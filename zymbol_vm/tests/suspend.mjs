#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// A `<<` that has to wait, the way the browser waits for one: the host never has
// the line at hand, so the machine stops, hands control back, and goes on when
// the line arrives — inside a `$>` lambda too, because that lambda runs on the
// machine's own frames (HofNext), not on a nested JavaScript call.
//
//   node tests/suspend.mjs PROGRAM.json INPUT_FILE [--slice STEPS]
//
// `--slice` ends a time slice every STEPS instructions: the machine hands control
// back and the driver resumes it on the next turn of the event loop, as a page
// must for a long computation.
//
// Prints what the program printed, then on stderr how many times it waited and
// how many timer ticks the event loop ran meanwhile: a page that kept answering.

import { readFileSync, writeSync } from 'fs';
import { loadProgram } from '../src/zymbol/vm/program.js';
import { Machine, VmErr } from '../src/zymbol/vm/machine.js';

const [file, inputFile] = process.argv.slice(2);
const sliceAt = process.argv.indexOf('--slice');
const lines = readFileSync(inputFile, 'utf8').split(/(?<=\n)/);
let output = '';
const host = {
  write: t => { output += t; },
  readLine: () => undefined,             // never at hand: every `<<` waits
  inputHint: h => { output += `  (${h})\n`; },
  sleep: () => false,                    // never sleeps in place: the driver waits
  entropy: () => 0n,
};

let ticks = 0;
const timer = setInterval(() => ticks++, 1);
const later = ms => new Promise(r => setTimeout(r, ms));

const m = new Machine(loadProgram(readFileSync(file, 'utf8')), host);
if (sliceAt > 0) m.sliceSteps = Number(process.argv[sliceAt + 1]);
let waits = 0, slices = 0, code = 0;
try {
  let st = m.start();
  while (st.status !== 'done') {
    if (st.status === 'input') { waits++; await later(15); st = m.resume(lines.shift() ?? ''); }
    else if (st.status === 'sleep') { waits++; await later(st.ms); st = m.resume(); }
    else { slices++; await later(0); st = m.resume(); }
  }
} catch (e) {
  if (!(e instanceof VmErr)) throw e;
  output += '';
  writeSync(2, `Runtime error: ${e.message}\n`);
  code = 1;
}
clearInterval(timer);
writeSync(1, output);
writeSync(2, `waited ${waits} times, yielded ${slices} time slices; the event loop ran ${ticks} timer ticks meanwhile; steps=${m.count.steps} calls=${m.count.calls} copied=${m.count.copied}\n`);
process.exit(code);
