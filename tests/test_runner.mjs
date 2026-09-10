#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Parity: the browser engine against the Rust CLI.
//
// This is now a wrapper over ZyQuality (../zyquality), the project's point of
// record for testing. The corpus, the comparison and the exclusion rules live
// there; this file keeps its name, its flags and its exit codes.
//
//   node tests/test_runner.mjs                  # the shared corpus
//   node tests/test_runner.mjs --dir examples   # this repo's example pool
//   node tests/test_runner.mjs --filter strings
//   node tests/test_runner.mjs --show-pass
//
// What changed, and why it had to:
//
//   * The 40-entry SKIP_SET that used to live in this file is gone. It was a
//     list of paths in JavaScript describing files in another repository, which
//     no other runner could read — so a file skipped here because it shells out
//     was still counted as a divergence by zyml. Those exclusions are now rules
//     in zyquality/corpus.toml, tagged (BASH_EXEC, ANSI_FORMAT, TUI, HOT_DEF,
//     FEATURE_GAP, STD_DB) with the reason each one gives, and every engine's
//     suite reads the same file. `zyq audit` reports one that stops matching
//     anything, which is how that list grew a dead entry nobody dared remove.
//
//   * Output normalisation was `trimEnd()` plus tabs-to-spaces here, five `sed`
//     expressions in vm_compare.sh, and nothing at all in the other two. It is
//     now `[[redact]]` in corpus.toml, applied to every engine equally.
//
//   * `// @skip-parity:` markers inside example files are still honoured — see
//     below. They belong to this repo's example pool, not to the shared corpus.
//
// Exit status: 0 parity holds, 1 a divergence, 2 could not run.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json).

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dir, '..');

const args = process.argv.slice(2);
const argOf = name => args[args.indexOf(name) + 1];
const dirArg = args.includes('--dir') ? argOf('--dir') : null;
const filterArg = args.includes('--filter') ? argOf('--filter') : null;
const showPass = args.includes('--show-pass');

// ─── Locate ZyQuality ─────────────────────────────────────────────────────────
// An explicit ZYQ_ROOT is never second-guessed: silently testing a different
// checkout is worse than failing. A candidate counts only if it holds both the
// binary and its configuration.
function findZyq() {
  const valid = d => existsSync(join(d, 'zyq')) && existsSync(join(d, 'engines.toml'));
  if (process.env.ZYQ_ROOT) return valid(process.env.ZYQ_ROOT) ? resolve(process.env.ZYQ_ROOT) : null;
  const sibling = resolve(WEB_ROOT, '../zyquality');
  return valid(sibling) ? sibling : null;
}

const ZYQ = findZyq();
if (!ZYQ) {
  if (process.env.ZYQ_ROOT) {
    console.error(`test_runner.mjs: ZYQ_ROOT='${process.env.ZYQ_ROOT}' is not a ZyQuality checkout.`);
    console.error(`  Expected both 'zyq' and 'engines.toml' inside it.`);
  } else {
    console.error('test_runner.mjs: ZyQuality not found — QA for this project lives there.');
    console.error('');
    console.error('  The browser engine is one of four, and they are all graded against the');
    console.error('  same corpus in the zyquality repository. This runner is a wrapper over it.');
    console.error('');
    console.error('      git clone https://github.com/zymbol-lang/zyquality.git ../zyquality');
    console.error('      make -C ../zyquality');
    console.error('');
    console.error('  Or:  ZYQ_ROOT=/path/to/zyquality node tests/test_runner.mjs');
  }
  process.exit(2);
}

// ─── Which corpus ─────────────────────────────────────────────────────────────
// Two different questions share this entry point:
//
//   no --dir     the shared language corpus, which zyquality owns
//   --dir X      a directory in *this* repo — the example pool. Those files are
//                the site's shop window rather than language tests, so they are
//                not in the shared corpus and are pointed at explicitly.
const zyqArgs = ['--root', ZYQ, 'consensus', '--engines', 'zytw,zyjs'];

if (dirArg) {
  const dir = resolve(WEB_ROOT, dirArg);
  if (!existsSync(dir)) {
    console.error(`test_runner.mjs: no such directory: ${dir}`);
    process.exit(2);
  }
  zyqArgs.push('--corpus', dir);
}
if (filterArg) zyqArgs.push('--filter', filterArg);
if (showPass) zyqArgs.push('-v');

// The browser engine is reached through run_one.mjs — this repo's driver, and
// the only one: zyquality used to carry a copy that skipped the checkSource
// pass, so a rejected program printed its diagnostic on stdout and exited 0.
// Point engines.toml at the driver next to *this* checkout, so the runner tests
// the source beside it rather than whatever sits beside zyquality.
const env = { ...process.env, ZYJS_HARNESS: join(__dir, 'run_one.mjs') };

// ─── @skip-parity markers ─────────────────────────────────────────────────────
// A file in the example pool can declare its own irreducible divergence in its
// first lines. zyq reads that marker itself and excuses the file, so this is
// only a report — the exclusion happens there, not here. The marker is
// `@zyq-skip` now, which unified this one with vm_compare.sh's `@vm-skip`;
// `@skip-parity` still works and means "every engine", which is what it always
// meant to the one runner that could see it.
function markedSkips(root) {
  const out = [];
  const walk = d => {
    for (const e of readdirSync(d)) {
      const full = join(d, e);
      if (statSync(full).isDirectory()) walk(full);
      else if (e.endsWith('.zy')) {
        const head = readFileSync(full, 'utf8').split('\n').slice(0, 10).join('\n');
        const m = head.match(/^\s*\/\/.*@(?:zyq-skip|skip-parity|vm-skip)[^:]*:\s*(.*)$/m);
        if (m) out.push([full.slice(root.length + 1), m[1].trim()]);
      }
    }
  };
  walk(root);
  return out;
}

if (dirArg) {
  const skips = markedSkips(resolve(WEB_ROOT, dirArg));
  if (skips.length > 0) {
    console.log(`${skips.length} file(s) carry a skip marker; zyq excuses them:`);
    for (const [rel, why] of skips) console.log(`  ⬜ ${rel} — ${why}`);
    console.log('');
  }
}

console.log(`test_runner.mjs: delegating to ZyQuality at ${ZYQ}`);
console.log(`  → zyq ${zyqArgs.filter(a => a !== '--root' && a !== ZYQ).join(' ')}`);
console.log('');

const r = spawnSync(join(ZYQ, 'zyq'), zyqArgs, { stdio: 'inherit', env });
process.exit(r.status === null ? 2 : r.status);
