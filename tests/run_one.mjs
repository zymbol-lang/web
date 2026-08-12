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
import { resolve, dirname, join } from 'path';

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
const inputArg = args[args.indexOf('--input') + 1];

if (!file) {
  process.stderr.write('usage: node tests/run_one.mjs FILE.zy [--input FILE]\n');
  process.exit(2);
}

const { runZymbol, checkSource, moduleAritiesFor, Lexer, Parser } =
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
let lines = [];
if (inputArg && args.includes('--input')) {
  try { lines = readFileSync(inputArg, 'utf8').split('\n'); } catch { lines = []; }
} else if (!process.stdin.isTTY) {
  let buf = '';
  for await (const chunk of process.stdin) buf += chunk;
  lines = buf.split('\n');
}
let cursor = 0;
const inputFn = () => (cursor < lines.length ? lines[cursor++] : '');

// ─── module resolution ────────────────────────────────────────────────────────
// Imports resolve against the real filesystem, relative to the file being run,
// so a multi-file program behaves the same here as it does under the CLI.
const abs = resolve(file);
const resolver = (spec, fromPath) => {
  const base = dirname(fromPath ? resolve(fromPath) : abs);
  const candidate = spec.endsWith('.zy') ? spec : `${spec}.zy`;
  try { return readFileSync(join(base, candidate), 'utf8'); } catch { return null; }
};

const source = readFileSync(abs, 'utf8');

// ─── Static diagnostics first ─────────────────────────────────────────────────
// `checkSource` has no resolver, so the arity table for imported modules is
// built here and passed in — the same thing `runZymbol` does for itself further
// down. Parsing twice costs nothing at this size and keeps the two paths honest.
let moduleArities = new Map();
try {
  const ast = new Parser(new Lexer(source).tokenize()).parse();
  moduleArities = await moduleAritiesFor(ast, resolver, abs);
} catch {
  // A source that does not parse is reported by checkSource below.
}

const { diagnostics } = checkSource(source, { moduleArities });
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

let failed = false;
let message = '';
try {
  await runZymbol(source, inputFn, onOutput, resolver, abs);
} catch (e) {
  failed = true;
  message = e && e.message ? e.message : String(e);
}

process.stdout.write(out);
if (failed) {
  process.stderr.write(`Runtime error: ${message}\n`);
  process.exit(1);
}
