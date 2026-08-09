#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Parity test: what the playground's checker says vs what `zymbol check` says.
//
//   node tests/test_check.mjs                          # fail on any regression
//   node tests/test_check.mjs --baseline               # rewrite the baseline
//   node tests/test_check.mjs --verbose                # list every disagreement
//
// The playground now reports problems before running anything, which means it makes
// claims about a program that the real tool also makes — and the two can drift apart
// silently, leaving a visitor told their program is fine by one and broken by the other.
//
// Exact agreement is not the goal and never was: zymbol.js is a hand-written mirror of the
// tree-walker, and its checker is a fraction of the Rust `zymbol-semantic` crate (no CFG,
// no type inference, no cross-module resolution). The goal is that the distance between
// them is *measured and stable*. The baseline records today's disagreements per file; this
// test fails when a file's status gets worse, not when the total is above zero — the same
// arrangement as the formatter's property harness in the interpreter repo.
//
// Compared per file: the set of (severity, line) pairs, not the wording. The two engines
// phrase diagnostics differently on purpose, and the playground translates them.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { spawnSync, execFileSync } from 'child_process';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

import { checkSource } from '../src/zymbol/zymbol.js';

const WEB_DIR      = dirname(dirname(fileURLToPath(import.meta.url)));
const EXAMPLES     = join(WEB_DIR, 'examples');
const BASELINE     = join(WEB_DIR, 'tests', 'check_parity_baseline.txt');
const WRITE        = process.argv.includes('--baseline');
const VERBOSE      = process.argv.includes('--verbose');

function haveZymbol() {
  try { execFileSync('zymbol', ['--version'], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

if (!haveZymbol()) {
  console.log('– `zymbol` is not on PATH — parity not checked. See install.html.');
  process.exit(0);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.zy')) out.push(p);
  }
  return out;
}

/** `zymbol check` writes diagnostics to stderr and exits 0 when they are only warnings. */
function cliDiagnostics(file) {
  const r = spawnSync('zymbol', ['check', file], { encoding: 'utf8', timeout: 15000 });
  const plain = ((r.stdout ?? '') + (r.stderr ?? '')).replace(/\x1b\[[0-9;]*m/g, '');
  const out = [];
  const lines = plain.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = /^(error|warning):/.exec(lines[i]);
    if (!m) continue;
    // The location is on the following `--> file:line:col` line.
    const loc = /-->\s+.*?:(\d+):/.exec(lines[i + 1] ?? '');
    out.push(`${m[1]}:${loc ? loc[1] : '?'}`);
  }
  return out;
}

function webDiagnostics(src) {
  return checkSource(src).diagnostics.map(d => `${d.severity}:${d.line ?? '?'}`);
}

/** Multiset difference, so two warnings on one line do not cancel one on another. */
function compare(cli, web) {
  const count = arr => arr.reduce((m, k) => m.set(k, (m.get(k) ?? 0) + 1), new Map());
  const c = count(cli), w = count(web);
  let onlyCli = 0, onlyWeb = 0;
  for (const [k, n] of c) onlyCli += Math.max(0, n - (w.get(k) ?? 0));
  for (const [k, n] of w) onlyWeb += Math.max(0, n - (c.get(k) ?? 0));
  return { onlyCli, onlyWeb };
}

const files = walk(EXAMPLES).sort();
const rows = [];
let agree = 0;

for (const file of files) {
  const rel = relative(WEB_DIR, file);
  const src = readFileSync(file, 'utf8');
  const { onlyCli, onlyWeb } = compare(cliDiagnostics(file), webDiagnostics(src));
  if (onlyCli === 0 && onlyWeb === 0) agree++;
  rows.push(`${rel}\t${onlyCli}\t${onlyWeb}`);
}

const report = rows.join('\n') + '\n';

if (WRITE) {
  writeFileSync(BASELINE, report);
  console.log(`baseline written: ${rows.length} files, ${agree} in full agreement`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.log('✗ no baseline — run: node tests/test_check.mjs --baseline');
  process.exit(1);
}

const before = new Map();
for (const line of readFileSync(BASELINE, 'utf8').trim().split('\n')) {
  const [f, a, b] = line.split('\t');
  before.set(f, [Number(a), Number(b)]);
}

let regressions = 0, improvements = 0, novel = 0;
for (const line of rows) {
  const [f, a, b] = line.split('\t');
  const now = [Number(a), Number(b)];
  const was = before.get(f);
  if (!was) {
    // A new example: it may not be worse than nothing, so it has to agree.
    if (now[0] || now[1]) {
      novel++;
      console.log(`  ✗ ${f} is new and disagrees (cli-only ${now[0]}, web-only ${now[1]})`);
    }
    continue;
  }
  if (now[0] > was[0] || now[1] > was[1]) {
    regressions++;
    console.log(`  ✗ ${f} got worse: ${was.join('/')} → ${now.join('/')} (cli-only/web-only)`);
  } else if (now[0] < was[0] || now[1] < was[1]) {
    improvements++;
    if (VERBOSE) console.log(`  ↑ ${f} improved: ${was.join('/')} → ${now.join('/')}`);
  }
}

const gone = [...before.keys()].filter(f => !rows.some(r => r.startsWith(f + '\t')));

console.log('');
console.log(`files      : ${rows.length}`);
console.log(`in full agreement : ${agree} (${(agree / rows.length * 100).toFixed(1)}%)`);
if (improvements) console.log(`improved   : ${improvements}  — re-run with --baseline to lock it in`);
if (gone.length)  console.log(`gone       : ${gone.length} baseline entries no longer exist`);

const failed = regressions + novel;
console.log(failed === 0 ? '\n✓ no parity regressions' : `\n✗ ${failed} regression(s)`);
process.exit(failed === 0 ? 0 : 1);
