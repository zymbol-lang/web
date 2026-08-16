#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Run one .zy file through the browser engine and print what it produced.
//
//   node tests/run_one.mjs FILE.zy [--input FILE]
//
// This exists so a shell script outside this repository can treat the JS engine
// as one more command-line engine, the way it already treats the Rust
// tree-walker, the register VM and zyml. `test_runner.mjs` compares a whole
// corpus and owns its own reporting; this prints one program's output and
// nothing else, so the caller does the comparing.
//
// Output contract, chosen to match what the Rust CLI puts on a terminal:
//   - program output goes to stdout, unchanged
//   - a diagnostic goes to stderr, and the exit code is 1
//
// The routing matters. `runZymbol` sends static diagnostics through `onOutput`,
// which is right for the playground — the panel is where the user is looking —
// but it means a rejected program and a program that printed an error message
// are indistinguishable to a shell. So static checking happens here first, via
// `checkSource`, and only a clean program is handed to `runZymbol`.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
const inputArg = args[args.indexOf('--input') + 1];

if (!file) {
  process.stderr.write('usage: node tests/run_one.mjs FILE.zy [--input FILE]\n');
  process.exit(2);
}

const { runZymbol, checkSource, moduleAritiesFor, moduleOutSlotsFor, Lexer, Parser } =
  await import('../src/zymbol/zymbol.js');

// ─── stdin feed ───────────────────────────────────────────────────────────────
// Mirrors test_runner.mjs: a program that reads more lines than it was given
// gets '' rather than hanging, which is what a closed stdin does to the CLI.
//
// Two ways in, because two callers need different ones. `--input FILE` is what
// this repo's own tests pass. Actual stdin is what a generic engine runner
// gives you — zyquality feeds every engine the same file descriptor, and an
// engine that ignored it would silently read nothing and diverge on all 14 of
// the corpus's input tests. Read up front: the engine's input callback is
// synchronous and cannot await a chunk that has not arrived.
// Empty input is no lines at all, and a trailing newline does not add one:
// `''.split('\n')` is `['']`, which handed the program one empty line before
// EOF and let `<< name` succeed where the CLI reports end of input.
const toLines = (buf) => {
  if (buf === '') return [];
  const ls = buf.split('\n');
  if (ls.length && ls[ls.length - 1] === '') ls.pop();
  return ls;
};

let lines = [];
if (inputArg && args.includes('--input')) {
  try { lines = toLines(readFileSync(inputArg, 'utf8')); } catch { lines = []; }
} else if (!process.stdin.isTTY) {
  let buf = '';
  for await (const chunk of process.stdin) buf += chunk;
  lines = toLines(buf);
}
let cursor = 0;
// null is the engine's EOF signal (see the "Input EOF contract" note at the top
// of zymbol.js): `<<` past the end of the input raises "end of input while
// waiting for …", which is what the CLI does with a closed stdin. Returning ''
// here instead made the browser engine invent an empty answer and carry on,
// completing programs the CLI refuses.
const inputFn = () => (cursor < lines.length ? lines[cursor++] : null);

// ─── module resolution ────────────────────────────────────────────────────────
// Imports resolve against the real filesystem, relative to the file being run,
// so a multi-file program behaves the same here as it does under the CLI.
const abs = resolve(file);

// A module's own imports resolve against *its* directory, not the entry file's.
// Returning `{ src, resolver, resolvedPath }` is how the engine is told that —
// it hands the child resolver to the module it just loaded, the same shape
// src/zymbol/module-resolver.js returns for the playground. Returning a bare
// string meant every nested import resolved against the entry file, so the
// `<# ./module` inside i18n/matematicas/中文.zy looked for i18n/module.zy and
// was reported as "module not found".
const makeResolver = (baseDir) => (spec) => {
  const candidate = spec.endsWith('.zy') ? spec : `${spec}.zy`;
  const full = resolve(baseDir, candidate);
  try {
    const src = readFileSync(full, 'utf8');
    // displayPath is what diagnostics quote: relative, like the CLI's.
    return { src, resolver: makeResolver(dirname(full)), resolvedPath: full,
             displayPath: relative(process.cwd(), full) };
  } catch { return null; }
};
const resolver = makeResolver(dirname(abs));

const source = readFileSync(abs, 'utf8');

// ─── Static diagnostics first ─────────────────────────────────────────────────
// `checkSource` has no resolver, so the arity table for imported modules is
// built here and passed in — the same thing `runZymbol` does for itself further
// down. Parsing twice costs nothing at this size and keeps the two paths honest.
let moduleArities = new Map();
let moduleOutSlots = new Map();
try {
  const ast = new Parser(new Lexer(source).tokenize()).parse();
  moduleArities = await moduleAritiesFor(ast, resolver, abs);
  moduleOutSlots = await moduleOutSlotsFor(ast, resolver, abs);
} catch {
  // A source that does not parse is reported by checkSource below.
}

const { diagnostics } = checkSource(source, { moduleArities, moduleOutSlots });
const errors = diagnostics.filter(d => d.severity === 'error');
if (errors.length > 0) {
  for (const d of errors) {
    const where = d.line == null ? '' : ` (line ${d.line})`;
    process.stderr.write(`error: ${d.message}${where}\n`);
  }
  process.exit(1);
}

// ─── Execute ──────────────────────────────────────────────────────────────────
let out = '';
const onOutput = s => { out += s; };

// Diagnostics go to their own channel, so they land on stderr like the CLI's do
// rather than in the middle of the program's output. `onError` is what tells the
// engine to keep them apart; without it (the playground) everything stays in the
// one panel a browser has.
// A terminal context that writes the escape sequences instead of driving a DOM.
// Without one, `>>~` printed its text with no cursor move and `>>!` did nothing,
// so every positioned-output test disagreed with the CLI — which has always
// written the sequences to stdout. `active` stays false: ordinary `>>` output
// keeps going through onOutput, exactly as it does under the CLI.
const ansiTui = {
  active: false,
  aborted: false,
  enter() {}, leave() {},
  clear() { out += '\x1b[2J\x1b[1;1H'; },
  printAt(row, col, text, bks, fg, bg) {
    let style = '';
    if (bks || fg != null || bg != null) {
      const codes = [];
      if (typeof bks === 'string') {
        if (bks.includes('B')) codes.push(1);
        if (bks.includes('K')) codes.push(5);
        if (bks.includes('S')) codes.push(7);
      }
      if (fg != null) codes.push(30 + Number(fg));
      if (bg != null) codes.push(40 + Number(bg));
      if (codes.length) style = `\x1b[${codes.join(';')}m`;
    }
    out += `\x1b[${row};${col}H${style}${text}${style ? '\x1b[0m' : ''}`;
  },
  print(text) { out += text; },
  // The same fallback the engine uses when there is no terminal at all, so `>>?`
  // answers with the CLI's dimensions rather than undefined.
  getSize() { return [process.stdout.rows || 24, process.stdout.columns || 80]; },
  readKey() { return Promise.resolve('\0'); },
  pollKey() { return '\0'; },
};

let errOut = '';
const onError = s => { errOut += s; };

let failed = false;
let message = '';
try {
  // runZymbol catches the engine's own errors so the playground can render
  // them; the result object is how it reports the failure to a caller that
  // needs an exit code. Without reading it, a refused program looked like a
  // successful one from the shell.
  // No execution ceiling: the 50 000-step and 32 KB caps exist to stop a browser
  // tab locking up, and the CLI has no equivalent. Applying them here made long
  // but perfectly finite programs (`smoke/08_functions.zy`'s fib) fail against
  // engines that ran them to completion. A runaway program is the shell's problem
  // now, exactly as it is under `zymbol run`.
  const limits = { maxSteps: Infinity, maxBytes: Infinity, maxInfiniteIter: Infinity };
  const result = await runZymbol(source, inputFn, onOutput, resolver, abs, ansiTui, [], { onError, ...limits });
  if (result && result.failed) {
    failed = true;
    message = result.message ?? 'engine reported failure';
  }
} catch (e) {
  failed = true;
  message = e && e.message ? e.message : String(e);
}

process.stdout.write(out);
if (errOut) process.stderr.write(errOut.endsWith('\n') ? errOut : errOut + '\n');
if (failed) {
  // Only when it did not already reach stderr through onError, and not if the
  // engine put it in the program's output — writing it twice would change one
  // of the two streams for every program that fails.
  if (!errOut.includes(message) && !out.includes(message)) {
    process.stderr.write(`Runtime error: ${message}\n`);
  }
  process.exit(1);
}
