// SPDX-License-Identifier: AGPL-3.0-only
// zymbol_vm.js — the playground's engine: Zymbol compiled to the register VM's
// bytecode and run by a JavaScript port of the VM (src/zymbol/vm/).
//
// Two steps, as `zymbol run` takes them:
//
//   compileSource(source, opts) → { program } | { error }
//       zymbol.js's parser, rustast.js, compiler.js — the bytecode the Rust
//       compiler builds for the same file (tests/compile_diff.mjs).
//   runCompiled(program, host, opts) → { code, stderr, count }
//       machine.js to the end, with every line of input at hand. A host that
//       has to wait (a browser) drives the Machine itself: see runAsync.
//
// The static checks before both — warnings, refusals — are zymbol.js's
// `checkSource`, which this engine keeps.

import { Lexer, Parser } from './zymbol.js';
import { toRustAst } from './vm/rustast.js';
import { compile, CompileError } from './vm/compiler.js';
import { makeHost, parent, stem } from './vm/modhost.js';
import { loadProgram } from './vm/program.js';
import { Machine, VmErr, NotYet, unsupportedIn } from './vm/machine.js';
import { OPS } from './vm/isa.js';

/**
 * Compile one program.
 *   path         the file, as the run names it: its directory is where imports
 *                and subscripts resolve
 *   displayName  the name a runtime error reports (relative, as the CLI shows it)
 *   readFile(p)  → text | null; realpath, cwd, home: for modules (modhost.js)
 *   features     { http, db } — the std modules this build has
 * The error, when there is one, is the text the CLI prints for it.
 */
export function compileSource(source, opts = {}) {
  const { path = 'main.zy', displayName = path, features = { http: true, db: false } } = opts;
  let ast;
  try {
    ast = toRustAst(new Parser(new Lexer(source).tokenize()).parse());
  } catch (e) {
    return { error: `error: ${e.message}` };
  }
  if (ast.module_decl) {
    return { error: `warning: '${displayName}' is a module file and cannot be run directly\n`
      + `  = help: module '${ast.module_decl.name}' is meant to be imported with <# ./${stem(path) ?? 'module'} => alias` };
  }
  // std/db is ODBC, and a browser has none: zyjs's words.
  if (!features.db && ast.imports.some(i => i.path.components.join('/') === 'std/db' && !i.path.is_relative && !i.path.is_absolute)) {
    return { error: "Runtime error: standard library module 'std/db' is not available in the web playground (requires ODBC)" };
  }
  const host = makeHost({ readFile: opts.readFile ?? (() => null), realpath: opts.realpath, cwd: opts.cwd ?? null, home: opts.home ?? '/' });
  try {
    const json = compile(ast, parent(path), displayName, { host, features });
    return { program: loadProgram(json), json };
  } catch (e) {
    if (!(e instanceof CompileError)) throw e;
    const runtimeLike = e.kind === 'CircularImport' || e.kind === 'ModuleParse' || e.kind === 'ModuleNotFound';
    return { error: runtimeLike ? `Runtime error: ${e.message}` : `error: ${e.message}` };
  }
}

/** A runtime error as the CLI prints it. */
export function formatRuntimeError(e) {
  let s = `Runtime error: ${e.message}\n`;
  if (e.file !== undefined) s += `  --> ${e.file}:${e.line}\n`;
  return s;
}

/**
 * Run a compiled program to its end with a host that never has to wait.
 * The exit status follows the CLI: 0, 1 for an error, `<~ n` at the top level.
 */
export function runCompiled(program, host, opts = {}) {
  const missing = unsupportedIn(program, OPS);
  if (missing) return { code: 3, stderr: `zymbol_vm.js: not yet: ${missing}\n`, count: { steps: 0, calls: 0, copied: 0 } };
  const m = new Machine(program, host);
  m.cliArgs = opts.cliArgs ?? [];
  let code = 0, stderr = '';
  try {
    let st = m.start();
    while (st.status !== 'done') {
      if (st.status === 'await') throw new NotYet('a request that has to wait, with a host that cannot (use runAsync)');
      st = m.resume();
    }
    if (m.exitCode !== undefined) code = Number(BigInt.asIntN(32, BigInt(m.exitCode)));
  } catch (e) {
    if (e instanceof VmErr) { stderr = formatRuntimeError(e); code = 1; }
    else if (e instanceof NotYet) { stderr = `zymbol_vm.js: not yet: ${e.message}\n`; code = 3; }
    else throw e;
  }
  return { code, stderr, count: m.count };
}

/**
 * Run a compiled program with a host that may have to wait — a browser, or a
 * program that calls std/net. The machine stops where it has to wait and says
 * why; this answers it and goes on:
 *   'input'  host.waitLine() → the line (or '' at the end of input)
 *   'sleep'  host.waitSleep(ms)
 *   'key'    host.waitKey() → resolves when `<<|` may ask the terminal again
 *   'yield'  host.yieldSlice() — a time slice ended (opts.sliceSteps)
 *   'await'  a std native's Promise, settled to a value or an error to raise
 */
export async function runAsync(program, host, opts = {}) {
  const missing = unsupportedIn(program, OPS);
  if (missing) return { code: 3, stderr: `zymbol_vm.js: not yet: ${missing}\n`, count: { steps: 0, calls: 0, copied: 0 } };
  const m = new Machine(program, host);
  m.cliArgs = opts.cliArgs ?? [];
  if (opts.sliceSteps) m.sliceSteps = opts.sliceSteps;
  if (opts.onMachine) opts.onMachine(m);
  let code = 0, stderr = '';
  try {
    let st = m.start();
    while (st.status !== 'done') {
      switch (st.status) {
        case 'await': st = m.resume(await st.promise); break;
        case 'input': st = m.resume(await host.waitLine()); break;
        case 'sleep': await host.waitSleep(st.ms); st = m.resume(); break;
        case 'key': await host.waitKey(); st = m.resume(); break;
        case 'yield': await host.yieldSlice?.(); st = m.resume(); break;
        default: throw new Error(`zymbol_vm.js: unknown status ${st.status}`);
      }
      if (opts.signal?.aborted) { m.release(); return { code: 130, stderr: '', count: m.count, stopped: true }; }
    }
    if (m.exitCode !== undefined) code = Number(BigInt.asIntN(32, BigInt(m.exitCode)));
  } catch (e) {
    if (e instanceof VmErr) { stderr = formatRuntimeError(e); code = 1; }
    else if (e instanceof NotYet) { stderr = `zymbol_vm.js: not yet: ${e.message}\n`; code = 3; }
    else throw e;
  }
  return { code, stderr, count: m.count };
}

export { Machine, VmErr, NotYet, loadProgram, CompileError };
