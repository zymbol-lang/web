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

import {
  Lexer, Parser, Checker, ZyRandom, ZyNet, formatDiagnostic,
  moduleAritiesFor, moduleOutSlotsFor, moduleExportsFor, moduleDeclErrors,
} from './zymbol.js';
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

/**
 * The playground's entry point, with runZymbol's signature so the page changes
 * one import: zymbol.js checks the program exactly as before — the same
 * diagnostics in the same words — and zymbol_vm.js compiles and runs it.
 *
 *   tuiContext  the page's BrowserTUI (enter, leave, clear, printAt, print,
 *               readKey, pollKey, readLine, getSize, active, aborted)
 *   opts        { readFile(name) → text | null  the mounted files, for modules
 *                 onError, displayPath, sliceSteps, shouldStop() }
 * Returns { failed, message?, exitCode? }, as runZymbol does.
 */
export async function runZymbolVM(src, inputFn, onOutput, moduleResolver = null, filePath = null, tuiContext = null, cliArgs = [], opts = {}) {
  ZyRandom.reset();
  ZyNet.limit = null;
  const onError = typeof opts.onError === 'function' ? opts.onError : onOutput;

  // ── The static half: zymbol.js's, unchanged ──
  let ast;
  try { ast = new Parser(new Lexer(src).tokenize()).parse(); }
  catch (e) { onError(`error: ${e.message}`); return { failed: true, message: e.message }; }
  const checker = new Checker(ast);
  checker.moduleArities = await moduleAritiesFor(ast, moduleResolver, filePath);
  checker.moduleOutSlots = await moduleOutSlotsFor(ast, moduleResolver, filePath);
  checker.moduleExports = await moduleExportsFor(ast, moduleResolver, filePath);
  const diags = checker.check();
  if (!opts.skipModuleNames) diags.push(...await moduleDeclErrors(ast, moduleResolver, filePath));
  for (const d of diags) if (d.severity === 'error') onError(formatDiagnostic(d) + '\n\n');
  if (diags.some(d => d.severity === 'error')) return { failed: true, message: diags.find(d => d.severity === 'error').message };

  // ── Compile ──
  const path = filePath ?? 'main.zy';
  const compiled = compileSource(src, { path, displayName: opts.displayPath ?? path, readFile: opts.readFile ?? (() => null) });
  if (compiled.error) { onError(compiled.error); return { failed: true, message: compiled.error }; }

  // ── Run, on the page ──
  const tui = tuiContext;
  let pendingKey = null;
  const terminal = tui ? {
    clear: () => tui.clear(),
    size: () => { const [rows, cols] = tui.getSize(); return [cols, rows]; },
    readKey(blocking) {
      if (!blocking) return tui.pollKey();
      if (pendingKey === null) return undefined;
      const k = pendingKey; pendingKey = null; return k;
    },
    printAt: (at, style, text) => tui.printAt(at ? at[0] : null, at ? at[1] : null, text,
      (style.bold ? 1 : 0) | (style.italic ? 2 : 0) | (style.underline ? 4 : 0), style.fg, style.bg),
    enterTui() {
      try { tui.enter(); return true; }
      catch (e) { return `failed to enable raw mode: ${e?.message ?? e}`; }
    },
    exitTui: () => tui.leave(),
    write: text => tui.print(text),
    release: () => { if (tui.active) tui.leave(); },
  } : undefined;
  const bytes = new Uint8Array(8);
  const host = {
    write: text => { if (tui?.active) tui.print(text); else onOutput(text); },
    readLine: () => undefined,                       // a page always waits for its line
    waitLine: async () => { const v = await inputFn(); return v == null ? '' : `${v}\n`; },
    inputHint: hint => host.write(`  (${hint})\n`),
    sleep: () => false,
    waitSleep: ms => new Promise(r => {
      const id = setTimeout(r, ms);
      if (tui) tui._sleepCancel = () => { clearTimeout(id); r(); };
    }),
    waitKey: async () => { pendingKey = await tui.readKey(); },
    yieldSlice: () => new Promise(r => setTimeout(r, 0)),
    entropy: () => { crypto.getRandomValues(bytes); return new DataView(bytes.buffer).getBigUint64(0, true); },
    terminal,
    shell: opts.shell ?? browserShell,
  };
  const r = await runAsync(compiled.program, host, {
    cliArgs, sliceSteps: opts.sliceSteps ?? 200_000,
    signal: { get aborted() { return !!(tui?.aborted || opts.shouldStop?.()); } },
  });
  if (r.stopped) return { failed: false, stopped: true };
  if (r.code !== 0 && r.stderr) {
    onError(r.stderr.replace(/\n$/, ''));
    return { failed: true, message: r.stderr };
  }
  return { failed: false, exitCode: r.code === 0 ? undefined : r.code };
}

/**
 * `<\ … \>` in a browser: no shell, only zymbol.js's stand-ins — each a command
 * whose answer the page can give honestly (the clock, a literal `echo`, the
 * entropy a seed is built from). Anything else is refused, in zymbol.js's words.
 */
export function browserShell(cmd) {
  const raw = cmd.trim();
  const c = raw.replace(/['"]/g, ' ').replace(/\s+/g, ' ').trim();
  const rand = n => Math.trunc(Math.random() * n);
  const pad = n => String(n).padStart(2, '0');
  const ok = printed => ({ printed, code: 0 });
  const shown = /^"[^"]*"$/.test(raw) || /^'[^']*'$/.test(raw) ? raw.slice(1, -1) : raw;
  const refuse = () => ({ raise: null, message: `cannot run '${shown}': a shell command runs as a process, and the browser has none` });
  const date = /^date \+(\S+)$/.exec(c);
  if (date) {
    const now = new Date();
    let bad = false;
    const out = date[1].replace(/%(\d*)(.)/g, (_, w, k) => {
      if (w && k !== 'N') { bad = true; return ''; }
      switch (k) {
        case 'Y': return String(now.getFullYear());
        case 'm': return pad(now.getMonth() + 1);
        case 'd': return pad(now.getDate());
        case 'H': return pad(now.getHours());
        case 'M': return pad(now.getMinutes());
        case 'S': return pad(now.getSeconds());
        case 'F': return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        case 'T': return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        case 's': return String(Math.floor(Date.now() / 1000));
        case 'N': { const ns = String(rand(1e9)).padStart(9, '0'); return w ? ns.slice(0, Math.min(9, Number(w))) : ns; }
        case '%': return '%';
        default: bad = true; return '';
      }
    });
    return bad ? refuse() : ok(out);
  }
  if (c === 'echo $$') return ok(String(1 + rand(4194304)));
  if (/^od -An -N2 -tu2 \/dev\/urandom( \| tr -d( .*)?)?$/.test(c)) return ok(String(rand(65536)));
  if (/^echo( |$)/.test(c) && !/[|&;<>\x60$(){}\\*?]/.test(c)) return ok(c.slice(4).trim());
  return refuse();
}

export { Machine, VmErr, NotYet, loadProgram, CompileError };
