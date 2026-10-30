#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Run one .zy file through zymbol_vm.js — the playground's default engine, the
// VM — and print what it produced. The twin of tests/run_one.mjs (the TW), with
// the same contract; zyquality grades it as the engine `zyjsvm`.
//
//   node tests/run_one_vm.mjs FILE.zy [--input FILE] [--count] [-- ARG...]
//
// What it can reach is what the page can: std/io on a file system in memory, a
// shell that only has the playground's stand-ins (`date`, `echo`, entropy), and
// no subscripts — so the gate's exclusions for zyjs apply to it unchanged.
//
// The static half is zyjs's, unchanged — the same checker, the same layout of a
// diagnostic — because zymbol_vm.js keeps zymbol.js's parser and checker. The
// running half is new: the program is compiled by src/zymbol/vm/compiler.js and
// run by src/zymbol/vm/machine.js, as `zymbol run` compiles and runs it.
//
// Output contract, the Rust CLI's:
//   - program output to stdout, unchanged
//   - a diagnostic or a runtime error to stderr, exit status 1
//   - a top-level `<~ n` is the exit status
//   - `--count` adds `count  steps=…  calls=…  copied=…` on stderr
//   - something zymbol_vm.js cannot run yet: `zymbol_vm.js: not yet: …`, status 3

import { readFileSync, writeSync, realpathSync, statSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { homedir } from 'os';
import { randomBytes } from 'crypto';
import { runAsync, compileSource, browserShell } from '../src/zymbol/zymbol_vm.js';

const argv = process.argv.slice(2);
const dashdash = argv.indexOf('--');
const args = dashdash < 0 ? argv : argv.slice(0, dashdash);
const programArgs = dashdash < 0 ? [] : argv.slice(dashdash + 1);
const file = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--input');
const inputArg = args.includes('--input') ? args[args.indexOf('--input') + 1] : null;
const wantCount = args.includes('--count');
if (!file) {
  process.stderr.write('usage: node tests/run_one_vm.mjs FILE.zy [--input FILE] [--count] [-- ARG...]\n');
  process.exit(2);
}

const { checkSource, moduleAritiesFor, moduleOutSlotsFor, moduleExportsFor, moduleDeclErrors, Lexer, Parser } =
  await import('../src/zymbol/zymbol.js');

// ─── stdin, read up front, as web/tests/run_one.mjs reads it ────────────────
let input = '';
if (inputArg) { try { input = readFileSync(inputArg, 'utf8'); } catch { input = ''; } }
else if (!process.stdin.isTTY) { for await (const chunk of process.stdin) input += chunk; }
let at = 0;

// ─── Modules, for the checker: as web/tests/run_one.mjs resolves them ───────
const abs = resolve(file);
const displayPath = (full) => {
  const rel = relative(process.cwd(), full);
  return (rel && !rel.startsWith('..')) ? rel : full;
};
const makeResolver = (baseDir) => (spec) => {
  const candidate = spec.endsWith('.zy') ? spec : `${spec}.zy`;
  const full = resolve(baseDir, candidate);
  try {
    const src = readFileSync(full, 'utf8');
    return { src, resolver: makeResolver(dirname(full)), resolvedPath: full, displayPath: displayPath(full) };
  } catch { return null; }
};
const resolver = makeResolver(dirname(abs));
const source = readFileSync(abs, 'utf8');

let moduleArities = new Map(), moduleOutSlots = new Map(), moduleExports = new Map(), moduleNameDiags = [];
try {
  const ast = new Parser(new Lexer(source).tokenize()).parse();
  moduleArities = await moduleAritiesFor(ast, resolver, abs);
  moduleOutSlots = await moduleOutSlotsFor(ast, resolver, abs);
  moduleExports = await moduleExportsFor(ast, resolver, abs);
  moduleNameDiags = await moduleDeclErrors(ast, resolver, abs);
} catch { /* reported by checkSource */ }

function formatDiagnostic(severity, d) {
  const [head, ...rest] = String(d.message).split('\n');
  let out = `${severity}: ${head}\n`;
  if (d.line != null) out += d.col != null ? `  --> ${displayPath(abs)}:${d.line}:${d.col}\n` : `  --> line ${d.line}\n`;
  for (const line of rest) out += `  ${line}\n`;
  for (const note of d.notes ?? []) out += `  = ${note}\n`;
  if (d.help) out += `  = help: ${d.help}\n`;
  return out;
}

const { diagnostics: ownDiags, ast: checkedAst } = checkSource(source, { moduleArities, moduleOutSlots, moduleExports });
const diagnostics = [...ownDiags, ...moduleNameDiags];
const isModuleFile = checkedAst?.body?.[0]?.type === 'ModuleBlock';
for (const d of diagnostics.filter(d => d.severity === 'warning' && !isModuleFile)) process.stderr.write(formatDiagnostic('warning', d));
const errors = diagnostics.filter(d => d.severity === 'error');
if (errors.length > 0) {
  for (const d of errors) process.stderr.write(formatDiagnostic('error', d));
  process.exit(1);
}

// ─── Compile ─────────────────────────────────────────────────────────────────
const compiled = compileSource(source, {
  path: abs,
  displayName: displayPath(abs),
  readFile: p => { try { return statSync(p).isFile() ? readFileSync(p, 'utf8') : null; } catch { return null; } },
  realpath: p => realpathSync(p),
  cwd: process.cwd(),
  home: homedir(),
});
if (compiled.error) {
  process.stderr.write(`${compiled.error}\n`);
  process.exit(1);
}

// ─── Run ─────────────────────────────────────────────────────────────────────
const out = text => { if (text) writeSync(1, text); };
const host = {
  write: out,
  readLine() {
    if (at >= input.length) return '';
    const nl = input.indexOf('\n', at);
    const line = nl < 0 ? input.slice(at) : input.slice(at, nl + 1);
    at += line.length;
    return line;
  },
  inputHint(hint) { out(`  (${hint})\n`); },
  sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); return true; },
  entropy() { return randomBytes(8).readBigUInt64LE(); },
  waitLine: async () => host.readLine(),
  waitSleep: async ms => { host.sleep(ms); },
  waitKey: async () => {},
  // The page's shell, and no subscript runner: what the playground has.
  shell: browserShell,
};

const r = await runAsync(compiled.program, host, { cliArgs: programArgs });
if (wantCount) process.stderr.write(`count  steps=${r.count.steps}  calls=${r.count.calls}  copied=${r.count.copied}\n`);
if (r.stderr) process.stderr.write(r.stderr);
process.exit(r.code);
