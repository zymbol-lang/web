#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Which of the 172 instructions a body of programs actually uses.
//
//   node tools/isa_usage.mjs [DIR]      default: zyquality/corpus beside this checkout
//
// Every .zy under DIR is compiled by the Rust compiler (tools/zyb_dump) and its
// bytecode kept in .cache/dumps/, mirroring DIR. The report says how many files
// use each instruction, which instructions nothing uses, and — given the
// instructions zymbol_vm.js implements today — how many files it could run.

import { readdirSync, statSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { OPS } from '../../src/zymbol/vm/isa.js';
import { IMPLEMENTED } from '../../src/zymbol/vm/machine.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = join(ROOT, 'tools/zyb_dump/target/release/zyb_dump');
const DIR = resolve(process.argv[2] ?? process.env.ZYQUALITY_CORPUS ?? join(ROOT, '../../zyquality/corpus'));
const CACHE = join(ROOT, '.cache/dumps');

function walk(dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.zy')) out.push(p);
  }
  return out;
}

const files = walk(DIR);
const uses = new Map(OPS.map(([n]) => [n, 0]));
const perFile = [];
let modules = 0;
const failed = [];
for (const file of files) {
  const rel = relative(DIR, file);
  const out = join(CACHE, rel + '.json');
  mkdirSync(dirname(out), { recursive: true });
  const r = spawnSync(DUMP, [file, '-o', out], { cwd: dirname(file), encoding: 'utf8' });
  if (r.status === 3) { modules++; continue; }
  if (r.status !== 0) { failed.push(`${rel}: ${(r.stderr || '').trim()}`); continue; }
  const prog = JSON.parse(readFileSync(out, 'utf8'));
  const names = new Set();
  for (const chunk of [prog.main, ...prog.functions])
    for (const ins of chunk.instructions) names.add(typeof ins === 'string' ? ins : Object.keys(ins)[0]);
  for (const n of names) uses.set(n, uses.get(n) + 1);
  perFile.push([rel, names]);
}

const used = [...uses].filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
const unused = [...uses].filter(([, c]) => c === 0).map(([n]) => n);
const runnable = perFile.filter(([, names]) => [...names].every(n => IMPLEMENTED.has(n)));

console.log(`${DIR}`);
console.log(`${files.length} .zy files: ${perFile.length} compiled, ${modules} modules, ${failed.length} refused by the compiler`);
console.log(`${used.length} of ${OPS.length} instructions used at least once; ${unused.length} never`);
console.log(`zymbol_vm.js implements ${IMPLEMENTED.size}; files whose every instruction it implements: ${runnable.length} of ${perFile.length}`);
console.log('\nfiles  instruction');
for (const [n, c] of used) console.log(`${String(c).padStart(5)}  ${n}${IMPLEMENTED.has(n) ? '' : '   (not yet)'}`);
console.log(`\nnever used: ${unused.join(' ')}`);
if (failed.length) console.log(`\nrefused by the compiler:\n  ${failed.join('\n  ')}`);
writeFileSync(join(ROOT, '.cache/runnable.txt'), runnable.map(([r]) => r).join('\n') + '\n');
