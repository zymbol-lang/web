#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// GO's fixed-seed self-play game on three engines: the native VM, zymbol_vm.js
// and zymbol.js — the workload GO/BENCHMARK.md measures releases on.
//
//   node tests/bench_go.mjs [--runs N] [--zyjs-runs N] [--sizes 9,13,19]
//
// `試験/自戦試験.zy` plays one whole game from seed 424242; its argument is the
// board. Whole-process elapsed time, Node's start-up included; the engines take
// turns within each round so a drift of the machine reaches all of them. Every
// output is checked against the native one — the same game, move for move — and
// zymbol_vm.js's `--count` against the native `--count`.
//
// zymbol_vm.js runs the Rust compiler's bytecode (tools/zyb_dump, timed apart):
// compiling is not in its figure, and a JavaScript compiler will add its own.
// The GO checkout is the one beside this repository's, or $GO_DIR.

import { mkdtempSync, rmSync } from 'fs';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GO = resolve(process.env.GO_DIR ?? join(ROOT, '../../GO'));
const GAME = '試験/自戦試験.zy';
const DUMP = join(ROOT, 'tools/zyb_dump/target/release/zyb_dump');
const RUN_ZYB = join(ROOT, 'tests/run_zyb.mjs');
const RUN_ONE = resolve(ROOT, '../tests/run_one.mjs');
const ZYMBOL = process.env.ZYMBOL_BIN ?? 'zymbol';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args[i + 1]; };
const runs = Number(opt('--runs', 5));
const zyjsRuns = Number(opt('--zyjs-runs', 1));
const sizes = opt('--sizes', '9,13,19').split(',').map(Number);

function timed(cmd, argv) {
  const t0 = process.hrtime.bigint();
  const r = spawnSync(cmd, argv, { cwd: GO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });
  return { ms: Number(process.hrtime.bigint() - t0) / 1e6, out: r.stdout, err: r.stderr, code: r.status };
}
const median = xs => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const countOf = err => (err.match(/steps=(\d+) {2}calls=(\d+).*copied=(\d+)/) ?? []).slice(1).join('/');
const fmt = ms => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(0)} ms`);

const box = mkdtempSync(join(tmpdir(), 'zyvmjs-go-'));
const json = join(box, 'jisen.json');
const d = timed(DUMP, [GAME, '-o', json]);
if (d.code !== 0) { console.error(d.err); process.exit(2); }
console.log(`${GO}/${GAME} — bytecode compiled by Rust in ${fmt(d.ms)}`);

let allSame = true;
for (const n of sizes) {
  const ref = timed(ZYMBOL, ['run', '--vm', '--count', GAME, String(n)]);
  const check = timed('node', [RUN_ZYB, json, '--count', '--', String(n)]);
  const same = check.out === ref.out, counts = countOf(check.err) === countOf(ref.err);
  const native = [], vmjs = [], zyjs = [];
  for (let i = 0; i < runs; i++) {
    const order = i % 2 === 0 ? ['n', 'j'] : ['j', 'n'];   // A B, then B A
    for (const e of order) {
      if (e === 'n') native.push(timed(ZYMBOL, ['run', '--vm', GAME, String(n)]).ms);
      else vmjs.push(timed('node', [RUN_ZYB, json, '--', String(n)]).ms);
    }
  }
  let zyjsSame = true;
  for (let i = 0; i < zyjsRuns; i++) {
    const z = timed('node', [RUN_ONE, GAME, '--', String(n)]);
    zyjs.push(z.ms);
    if (z.out !== ref.out) zyjsSame = false;
  }
  const moves = (ref.out.match(/^\s*\d+[.:]/gm) ?? []).length;
  const mN = median(native), mJ = median(vmjs), mZ = zyjs.length ? median(zyjs) : NaN;
  allSame &&= same && counts && zyjsSame;
  console.log(`${String(n).padStart(2)}×${n}: native ${fmt(mN).padStart(8)} | zymbol_vm.js ${fmt(mJ).padStart(8)} (×${(mJ / mN).toFixed(1)})` +
    (zyjs.length ? ` | zymbol.js ${fmt(mZ).padStart(8)} (×${(mZ / mN).toFixed(1)}; ${(mZ / mJ).toFixed(1)}× slower than zymbol_vm.js)` : '') +
    ` | same game: ${same ? 'yes' : 'NO'}, same --count: ${counts ? 'yes' : 'NO'}${zyjs.length ? `, zymbol.js same game: ${zyjsSame ? 'yes' : 'NO'}` : ''}`);
}
rmSync(box, { recursive: true, force: true });
process.exit(allSame ? 0 : 1);
