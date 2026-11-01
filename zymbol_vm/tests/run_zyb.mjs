#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Run one compiled program on zymbol_vm.js, the way `zymbol run` runs it.
//
//   node tests/run_zyb.mjs PROGRAM.json [--count] [-- ARG...]
//
// PROGRAM.json is what tools/zyb_dump writes. The output contract is the Rust
// CLI's, so the two can be compared byte for byte:
//   - what the program prints goes to stdout, a `<<` reads stdin
//   - an uncaught runtime error is `Runtime error: …` and `  --> file:line` on
//     stderr, exit status 1; a top-level `<~ n` is the exit status
//   - `--count` adds `count  steps=…  calls=…  copied=…` on stderr: the three
//     figures `zymbol run --count` prints that do not depend on the machine
//     (allocs and bytes measure Rust's allocator and have no counterpart here)
//   - something zymbol_vm.js cannot run yet is `zymbol_vm.js: not yet: …` on
//     stderr, exit status 3, before anything runs

import { readFileSync, writeSync } from 'fs';
import { randomBytes } from 'crypto';
import { loadProgram } from '../../src/zymbol/vm/program.js';
import { Machine, VmErr, NotYet, unsupportedIn } from '../../src/zymbol/vm/machine.js';
import { OPS } from '../../src/zymbol/vm/isa.js';

const argv = process.argv.slice(2);
const dd = argv.indexOf('--');
const own = dd < 0 ? argv : argv.slice(0, dd);
const cliArgs = dd < 0 ? [] : argv.slice(dd + 1);
const file = own.find(a => !a.startsWith('--'));
const wantCount = own.includes('--count');
if (!file) { console.error('usage: run_zyb.mjs PROGRAM.json [--count] [-- ARG...]'); process.exit(2); }

const out = text => { if (text) writeSync(1, text); };
const err = text => writeSync(2, text);

const program = loadProgram(readFileSync(file, 'utf8'));
const missing = unsupportedIn(program, OPS);
if (missing) { err(`zymbol_vm.js: not yet: ${missing}\n`); process.exit(3); }

// stdin is read once, the first time a `<<` asks, and handed out a line at a time.
let input = null, at = 0;
const host = {
  write: out,
  readLine() {
    if (input === null) { try { input = readFileSync(0, 'utf8'); } catch { input = ''; } }
    if (at >= input.length) return '';
    const nl = input.indexOf('\n', at);
    const line = nl < 0 ? input.slice(at) : input.slice(at, nl + 1);
    at += line.length;
    return line;
  },
  inputHint(hint) { out(`  (${hint})\n`); },
  sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); return true; },
  entropy() { return randomBytes(8).readBigUInt64LE(); },
};

const m = new Machine(program, host);
m.cliArgs = cliArgs;
let code = 0;
try {
  let st = m.start();
  while (st.status !== 'done') st = m.resume();   // a host with every line at hand never waits
  if (m.exitCode !== undefined) code = Number(BigInt.asIntN(32, BigInt(m.exitCode)));
} catch (e) {
  if (e instanceof VmErr) {
    err(`Runtime error: ${e.message}\n`);
    if (e.file !== undefined) err(`  --> ${e.file}:${e.line}\n`);
    code = 1;
  } else if (e instanceof NotYet) {
    err(`zymbol_vm.js: not yet: ${e.message}\n`);
    code = 3;
  } else throw e;
}
if (wantCount) err(`count  steps=${m.count.steps}  calls=${m.count.calls}  copied=${m.count.copied}\n`);
process.exit(code);
