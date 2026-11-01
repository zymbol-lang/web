#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Grade zymbol_vm.js against the Rust VM: the same bytecode — the Rust
// compiler's, through tools/zyb_dump — run by two machines.
//
//   node tests/probe.mjs [DIR|FILE...] [--jobs N] [--list KIND]
//
// Default DIR: zyquality/corpus beside this checkout. Each file runs the way
// `zyq` runs an engine: by absolute path, from an empty working directory, with
// `x.input` beside `x.zy` as its stdin. What is compared is what the machine is
// responsible for: stdout, the runtime error with its `-->` line, the exit
// status, and `--count`'s steps, calls and copied. The analyzer's warnings and
// refusals are the front-end's, and this machine has none yet.
//
// Verdicts: agree (and whether the three counts agree too), diverge, not-yet
// (zymbol_vm.js says what it cannot run), refused (the Rust front-end refused
// the program before running it), module, uncompiled.

import { readdirSync, statSync, existsSync, mkdtempSync, rmSync, openSync, closeSync } from 'fs';
import { spawn } from 'child_process';
import { tmpdir, cpus } from 'os';
import { dirname, join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = join(ROOT, 'tools/zyb_dump/target/release/zyb_dump');
const RUN_ZYB = join(ROOT, 'tests/run_zyb.mjs');
const ZYMBOL = process.env.ZYMBOL_BIN ?? 'zymbol';

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i < 0 ? dflt : args.splice(i, 2)[1]; };
const jobs = Number(opt('--jobs', Math.max(1, cpus().length)));
const list = opt('--list', null);
const targets = args.length ? args.map(a => resolve(a)) : [resolve(ROOT, '../../zyquality/corpus')];

function walk(p, out = []) {
  if (statSync(p).isDirectory()) for (const n of readdirSync(p).sort()) walk(join(p, n), out);
  else if (p.endsWith('.zy')) out.push(p);
  return out;
}
const files = targets.flatMap(t => walk(t));
const rootOf = targets.length === 1 && statSync(targets[0]).isDirectory() ? targets[0] : '/';

function run(cmd, argv, { cwd, stdin = null, timeout = 10000 }) {
  return new Promise(res => {
    const fd = stdin ? openSync(stdin, 'r') : 'ignore';
    const child = spawn(cmd, argv, { cwd, stdio: [fd, 'pipe', 'pipe'] });
    let out = '', err = '', killed = false;
    const t = setTimeout(() => { killed = true; child.kill('SIGKILL'); }, timeout);
    child.stdout.on('data', d => (out += d));
    child.stderr.on('data', d => (err += d));
    child.on('close', code => {
      clearTimeout(t);
      if (typeof fd === 'number') closeSync(fd);
      res({ code: killed ? 124 : code, out, err });
    });
  });
}

const countOf = err => {
  const m = err.match(/^count {2}steps=(\d+) {2}calls=(\d+).*copied=(\d+)$/m);
  return m ? { steps: +m[1], calls: +m[2], copied: +m[3] } : null;
};
// What of Rust's stderr is the machine's: the runtime error and where it was.
const runtimePart = err => {
  const lines = err.split('\n');
  const i = lines.findIndex(l => l.startsWith('Runtime error:'));
  return i < 0 ? '' : lines.slice(i).filter(l => !l.startsWith('count  ')).join('\n').trim();
};

async function grade(file) {
  const box = mkdtempSync(join(tmpdir(), 'zyvmjs-'));
  try {
    const json = join(box, 'program.json');
    const d = await run(DUMP, [file, '-o', json], { cwd: box });
    if (d.code === 3) return { file, verdict: 'module' };
    if (d.code !== 0) return { file, verdict: 'uncompiled', detail: d.err.trim() };
    const input = file.replace(/\.zy$/, '.input');
    const stdin = existsSync(input) ? input : null;
    const t0 = performance.now();
    const rv = await run(ZYMBOL, ['run', '--vm', '--count', file], { cwd: box, stdin });
    const t1 = performance.now();
    const rj = await run('node', [RUN_ZYB, json, '--count'], { cwd: box, stdin });
    const t2 = performance.now();
    if (rj.code === 3 && rj.err.startsWith('zymbol_vm.js: not yet:'))
      return { file, verdict: 'not-yet', detail: rj.err.trim().replace('zymbol_vm.js: not yet: ', '') };
    const rustErr = runtimePart(rv.err);
    if (rv.code === 1 && rustErr === '' && rv.out === '') return { file, verdict: 'refused', detail: rv.err.trim().split('\n')[0] };
    const jsErr = runtimePart(rj.err);
    const same = rv.out === rj.out && rustErr === jsErr && rv.code === rj.code;
    const cv = countOf(rv.err), cj = countOf(rj.err);
    const countsAgree = cv !== null && cj !== null && cv.steps === cj.steps && cv.calls === cj.calls && cv.copied === cj.copied;
    return {
      file, verdict: same ? 'agree' : 'diverge', countsAgree, cv, cj,
      ms: { rust: t1 - t0, js: t2 - t1 },
      detail: same ? '' : explain(rv, rj, rustErr, jsErr),
    };
  } finally {
    rmSync(box, { recursive: true, force: true });
  }
}

function explain(rv, rj, rustErr, jsErr) {
  if (rv.code !== rj.code) return `exit ${rv.code} vs ${rj.code}; rust: ${rustErr || '(no error)'} | js: ${jsErr || rj.err.trim().slice(0, 200) || '(no error)'}`;
  if (rustErr !== jsErr) return `error: rust «${rustErr}» js «${jsErr}»`;
  const a = rv.out.split('\n'), b = rj.out.split('\n');
  const i = a.findIndex((l, k) => l !== b[k]);
  return `stdout line ${i + 1}: rust «${a[i] ?? '(end)'}» js «${b[i] ?? '(end)'}»`;
}

const results = [];
let next = 0;
await Promise.all(Array.from({ length: jobs }, async () => {
  while (next < files.length) {
    const f = files[next++];
    results.push(await grade(f));
  }
}));
results.sort((x, y) => (x.file < y.file ? -1 : 1));

const by = k => results.filter(r => r.verdict === k);
const agree = by('agree');
const countsAgree = agree.filter(r => r.countsAgree);
console.log(`${files.length} files under ${relative(process.cwd(), rootOf) || rootOf}`);
console.log(`  agree       ${agree.length}  (steps, calls and copied identical in ${countsAgree.length})`);
console.log(`  diverge     ${by('diverge').length}`);
console.log(`  not yet     ${by('not-yet').length}`);
console.log(`  refused     ${by('refused').length}  (the Rust front-end refuses them before running: not the machine's question)`);
console.log(`  module      ${by('module').length}`);
console.log(`  uncompiled  ${by('uncompiled').length}`);
const missing = new Map();
for (const r of by('not-yet')) missing.set(r.detail, (missing.get(r.detail) ?? 0) + 1);
if (missing.size) {
  console.log('\nwhat the not-yet files need, most wanted first:');
  for (const [k, n] of [...missing].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`  ${String(n).padStart(4)}  ${k}`);
}
const shown = list ? by(list) : by('diverge');
if (shown.length) {
  console.log(`\n${list ?? 'diverge'}:`);
  for (const r of shown) console.log(`  ${relative(rootOf, r.file)}: ${r.detail ?? ''}`);
}
const countDiff = agree.filter(r => !r.countsAgree);
if (countDiff.length && !list) {
  console.log('\nsame output, different counts:');
  for (const r of countDiff) console.log(`  ${relative(rootOf, r.file)}: rust ${JSON.stringify(r.cv)} js ${JSON.stringify(r.cj)}`);
}
process.exit(by('diverge').length ? 1 : 0);
