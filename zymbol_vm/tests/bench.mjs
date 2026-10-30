#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Elapsed time of zymbol_vm.js against the native VM and zymbol.js, on
// zyquality/bench/big/zy/ — the sixteen programs the v0.0.11 roadmap measured
// zymbol.js (×61 of the native VM) and the wasm prototype (×3.2) on.
//
//   node tests/bench.mjs [--runs N] [--zyjs-runs N] [--only NAME,…] [--no-zyjs]
//
// Whole-process wall time, Node's start-up included, median of N runs — the
// roadmap's method. zymbol_vm.js is handed the bytecode the Rust compiler made
// (tools/zyb_dump, timed apart and NOT added): until it has a compiler of its
// own, that is the part of the browser's work it can be measured on.
// Every run's stdout is checked against the native one: a fast wrong answer is
// not a measurement.

import { readdirSync, mkdtempSync, rmSync } from 'fs';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BENCH = resolve(ROOT, '../../zyquality/bench/big/zy');
const DUMP = join(ROOT, 'tools/zyb_dump/target/release/zyb_dump');
const RUN_ZYB = join(ROOT, 'tests/run_zyb.mjs');
const RUN_ONE = resolve(ROOT, '../tests/run_one.mjs');   // zymbol.js, as the gate runs it
const ZYMBOL = process.env.ZYMBOL_BIN ?? 'zymbol';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args[i + 1]; };
const runs = Number(opt('--runs', 3));
const zyjsRuns = Number(opt('--zyjs-runs', 1));
const only = opt('--only', null)?.split(',');
const withZyjs = !args.includes('--no-zyjs');

const median = xs => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
function timed(cmd, argv, cwd, timeout = 600000) {
  const t0 = process.hrtime.bigint();
  const r = spawnSync(cmd, argv, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout, maxBuffer: 1 << 28 });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  return { ms, out: r.stdout, code: r.status, timedOut: r.error?.code === 'ETIMEDOUT' };
}

const box = mkdtempSync(join(tmpdir(), 'zyvmjs-bench-'));
const rows = [];
for (const name of readdirSync(BENCH).filter(f => f.endsWith('.zy')).sort()) {
  if (only && !only.includes(name.replace(/\.zy$/, ''))) continue;
  const file = join(BENCH, name), json = join(box, name + '.json');
  const d = timed(DUMP, [file, '-o', json], box);
  const native = [], vmjs = [], zyjs = [];
  let ref = null, ok = true;
  for (let i = 0; i < runs; i++) {
    const n = timed(ZYMBOL, ['run', file], box);
    ref ??= n.out; native.push(n.ms);
    const j = timed('node', [RUN_ZYB, json], box);
    if (j.out !== ref) ok = false;
    vmjs.push(j.ms);
  }
  if (withZyjs) for (let i = 0; i < zyjsRuns; i++) {
    const z = timed('node', [RUN_ONE, file], box);
    zyjs.push(z.timedOut ? NaN : z.ms);
  }
  const row = { name: name.replace(/\.zy$/, ''), dump: d.ms, native: median(native), vmjs: median(vmjs), zyjs: zyjs.length ? median(zyjs) : NaN, ok };
  rows.push(row);
  const f = x => (Number.isNaN(x) ? '—' : x >= 1000 ? `${(x / 1000).toFixed(2)} s` : `${x.toFixed(0)} ms`);
  console.log(`${row.name.padEnd(20)} native ${f(row.native).padStart(9)}   zymbol_vm.js ${f(row.vmjs).padStart(9)} (×${(row.vmjs / row.native).toFixed(1)})` +
    (withZyjs ? `   zymbol.js ${f(row.zyjs).padStart(9)} (×${(row.zyjs / row.native).toFixed(1)}, ${(row.zyjs / row.vmjs).toFixed(1)}× slower than zymbol_vm.js)` : '') +
    `   dump ${f(row.dump)}${row.ok ? '' : '   OUTPUT DIFFERS'}`);
}
rmSync(box, { recursive: true, force: true });

const geo = xs => Math.exp(xs.reduce((s, x) => s + Math.log(x), 0) / xs.length);
const good = rows.filter(r => r.ok);
console.log(`\ngeometric mean over ${good.length} programs with the native output:`);
console.log(`  zymbol_vm.js / native   ×${geo(good.map(r => r.vmjs / r.native)).toFixed(2)}`);
if (withZyjs) {
  const z = good.filter(r => !Number.isNaN(r.zyjs));
  console.log(`  zymbol.js / native      ×${geo(z.map(r => r.zyjs / r.native)).toFixed(2)}`);
  console.log(`  zymbol.js / zymbol_vm.js ×${geo(z.map(r => r.zyjs / r.vmjs)).toFixed(2)}`);
}
process.exit(good.length === rows.length ? 0 : 1);
