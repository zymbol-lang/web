#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The compiler against Rust's: for every .zy, src/zymbol/vm/compiler.js — fed by
// zymbol.js's parser through rustast.js — must build the CompiledProgram that
// zymbol-compiler builds, as `tools/zyb_dump` writes it. Instruction for
// instruction, register for register, the same string pool, globals and files.
//
//   node tests/compile_diff.mjs [DIR|FILE...] [--show N] [--path SUBSTR]
//
// It compiles in `faithful` mode, which reproduces the two Rust defects the port
// corrects (BUG-VMJS-004, BUG-VMJS-005). Not compared: the order inside a run of
// consecutive LoadUnit (Rust takes it from a HashMap's iteration), and a source
// position's column (zymbol.js does not count columns in graphemes; no output
// shows one).

import { readdirSync, statSync, readFileSync, realpathSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve, relative, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import { Lexer, Parser } from '../../src/zymbol/zymbol.js';
import { toRustAst } from '../../src/zymbol/vm/rustast.js';
import { compile } from '../../src/zymbol/vm/compiler.js';
import { makeHost, parent } from '../../src/zymbol/vm/modhost.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = join(ROOT, 'tools/zyb_dump/target/release/zyb_dump');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args.splice(i, 2)[1]; };
const show = Number(opt('--show', 20));
const onlyPath = opt('--path', null);
const targets = args.length ? args : ['../../zyquality/corpus'];
const walk = (p, o = []) => { if (statSync(p).isDirectory()) for (const n of readdirSync(p).sort()) walk(`${p}/${n}`, o); else if (p.endsWith('.zy')) o.push(p); return o; };

const host = makeHost({
  readFile: p => { try { return statSync(p).isFile() ? readFileSync(p, 'utf8') : null; } catch { return null; } },
  realpath: p => realpathSync(p),
  cwd: process.cwd(),
  home: homedir(),
});

/** JSON with every object's keys in order: serde_json writes them sorted. */
const stable = v => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(key => [key, x[key]])) : x));

/** A chunk with each run of LoadUnit sorted, and its positions reduced to file and line. */
function canon(chunk) {
  const ins = chunk.instructions.map(stable);
  for (let i = 0; i < ins.length;) {
    if (!ins[i].startsWith('{"LoadUnit"')) { i++; continue; }
    let j = i;
    while (j < ins.length && ins[j].startsWith('{"LoadUnit"')) j++;
    const run = ins.slice(i, j).sort();
    ins.splice(i, j - i, ...run);
    i = j;
  }
  return { name: chunk.name, instructions: ins, num_registers: chunk.num_registers, num_params: chunk.num_params,
    src: chunk.src.map(p => `${p.file}:${p.line}`) };
}

function firstDiff(a, b, path = '') {
  if (Object.is(a, b)) return null;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return { path, a, b };
  if (Array.isArray(a) !== Array.isArray(b)) return { path, a, b };
  if (Array.isArray(a)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = firstDiff(a[i], b[i], `${path}[${i}]`); if (d) return d; }
    return null;
  }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const d = firstDiff(a[k], b[k], `${path}.${k}`); if (d) return d; }
  return null;
}

/** JSON the way both sides compare: non-finite floats spelled as zyb_dump spells them. */
const norm = v => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'number' && !Number.isFinite(x) ? String(x).replace('Infinity', 'inf') : x)));

const files = targets.flatMap(t => walk(t));
let same = 0, skipped = 0, bothRefused = 0;
const diffs = [];
for (const f of files) {
  const r = spawnSync(DUMP, [f], { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status === 3) { skipped++; continue; }                    // a module file
  const rustErr = r.status === 0 ? null : r.stderr.trim();
  if (rustErr && /^zyb_dump: (lex|parse) error/.test(rustErr)) { skipped++; continue; }
  let mine, myErr = null;
  try {
    const program = toRustAst(new Parser(new Lexer(readFileSync(f, 'utf8')).tokenize()).parse());
    mine = compile(program, parent(f), f, { host, faithful: true, features: { http: true, db: true } });
  } catch (e) {
    myErr = `zyb_dump: compile error: ${e.message}`;
    if (!e.kind) myErr += `\n${e.stack.split('\n').slice(1, 4).join('\n')}`;
  }
  if (rustErr || myErr) {
    if (rustErr === myErr) { bothRefused++; same++; }
    else diffs.push({ f, d: { path: '(refusal)', a: rustErr, b: myErr } });
    continue;
  }
  const rust = norm(JSON.parse(r.stdout));
  const m = norm(mine);
  const left = { ...rust, main: canon(rust.main), functions: rust.functions.map(canon) };
  const right = { ...m, main: canon(m.main), functions: m.functions.map(canon) };
  const d = firstDiff(left, right);
  if (d) diffs.push({ f, d }); else same++;
}

const cut = x => (JSON.stringify(x) ?? 'undefined').slice(0, 400);
console.log(`${files.length} files: ${same} compile the same (${bothRefused} refused alike), ${diffs.length} differ, ${skipped} not compared (modules, parse errors)`);
const byPath = new Map();
for (const { d } of diffs) {
  const key = d.path.replace(/\[\d+\]/g, '[]');
  byPath.set(key, (byPath.get(key) ?? 0) + 1);
}
console.log('\nwhere they differ first, most frequent:');
for (const [k, n] of [...byPath].sort((x, y) => y[1] - x[1]).slice(0, 20)) console.log(`  ${String(n).padStart(4)}  ${k}`);
console.log('');
for (const { f, d } of diffs.filter(x => !onlyPath || x.d.path.includes(onlyPath) || x.f.includes(onlyPath)).slice(0, show)) {
  console.log(`${relative(process.cwd(), f)}\n  at ${d.path}\n  rust ${cut(d.a)}\n  mine ${cut(d.b)}`);
}
process.exit(diffs.length ? 1 : 0);
