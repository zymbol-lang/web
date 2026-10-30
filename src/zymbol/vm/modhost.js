// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// What the compiler asks of a file system to load modules (compiler.js, `host`),
// in two halves: the path rules, which are Rust's `Path` and
// `ModulePath::resolve_from` written for '/'-separated paths, and the reading,
// which the embedder supplies — Node's `fs`, or the playground's file store.
//
// `parseModule` reads a module as zymbol.js reads one (Interpreter.loadModule):
// lexer, parser and checker, each refusal worded as the Rust engines word it.

import { Lexer, Parser, Checker, ZyError, ZyStaticError } from '../zymbol.js';
import { toRustAst } from './rustast.js';
import { CompileError } from './compiler.js';

// ── Rust's Path, for '/'-separated paths ─────────────────────────────────────

/** `Path::components`: the root, then the names; `.` dropped except in front. */
export function components(p) {
  const out = [];
  if (p.startsWith('/')) out.push('/');
  const parts = p.split('/');
  parts.forEach((c, i) => {
    if (c === '' ) return;
    if (c === '.' && !(i === 0 && !p.startsWith('/'))) return;
    out.push(c);
  });
  return out;
}

/** `PathBuf::push` of a relative component. */
export function push(base, c) {
  if (c.startsWith('/')) return c;
  if (base === '') return c;
  return base.endsWith('/') ? base + c : `${base}/${c}`;
}

/** `PathBuf::pop`: the path without its last component. */
export function pop(p) {
  const cs = components(p);
  cs.pop();
  if (cs.length === 0) return '';
  if (cs[0] === '/') return cs.length === 1 ? '/' : `/${cs.slice(1).join('/')}`;
  return cs.join('/');
}

/** `Path::parent`, as the CLI uses it for a script's directory: `""` for a bare name. */
export function parent(p) {
  const cs = components(p);
  if (cs.length <= 1) return cs[0] === '/' ? '/' : '';
  return pop(p);
}

/** `Path::file_name`. */
function fileName(p) {
  const cs = components(p);
  const last = cs[cs.length - 1];
  return last === undefined || last === '/' || last === '..' ? null : last;
}

/** `Path::file_stem`. */
export function stem(p) {
  const name = fileName(p);
  if (name == null) return null;
  if (name === '..') return name;
  const dot = name.lastIndexOf('.');
  return dot <= 0 ? name : name.slice(0, dot);
}

/** `PathBuf::set_extension(ext)`. */
export function setExtension(p, ext) {
  const name = fileName(p);
  if (name == null) return p;
  const s = stem(p);
  const head = p.slice(0, p.length - name.length);
  return head + s + (ext ? `.${ext}` : '');
}

/** `climb` (zymbol-ast modules.rs): `levels` directories up, relative staying relative. */
function climb(baseDir, levels) {
  let base = baseDir === '.' ? '' : baseDir;
  for (let i = 0; i < levels; i++) {
    const cs = components(base);
    const last = cs[cs.length - 1];
    if (last === '/') return null;
    if (last !== undefined && last !== '.' && last !== '..') base = pop(base);
    else base = push(base, '..');
  }
  return base;
}

/** `ModulePath::resolve_from`. `home` is the user's home directory. */
export function resolveFrom(mp, baseDir, home = '/') {
  if (!mp.is_relative && !mp.is_absolute && mp.components[0] === 'std') return null;
  let resolved;
  if (mp.is_absolute) resolved = mp.home_relative ? home : '/';
  else {
    resolved = climb(baseDir, mp.parent_levels);
    if (resolved === null) return null;
  }
  for (const c of mp.components) resolved = push(resolved, c);
  return setExtension(resolved, 'zy');
}

// ── Reading a module ─────────────────────────────────────────────────────────

/** A module's source into its Rust-shaped Program, refused as Rust refuses it. */
export function parseModule(source, where) {
  const readError = (e, stage) => {
    if (!(e instanceof ZyStaticError || e instanceof ZyError)) return e;
    let detail = `  ${where}:${e.zyLine ?? 0}:${e.zyCol ?? 0}: ${e.message}`;
    if (e.zyHelp) detail += `\n    help: ${e.zyHelp}`;
    return new CompileError('ModuleParse', `1 ${stage} error(s) in '${where}'\n${detail}`);
  };
  let tokens, ast;
  try { tokens = new Lexer(source).tokenize(); } catch (e) { throw readError(e, 'lexer'); }
  try { ast = new Parser(tokens).parse(); } catch (e) { throw readError(e, 'parse'); }
  // MM-4: the same semantic gate as the entry file.
  const diags = new Checker(ast).check().filter(d => d.severity === 'error');
  if (diags.length) {
    const detail = diags.map(d => `  ${where}:${d.line ?? 0}:${d.col ?? 0}: ${d.message}` + (d.help ? `\n    help: ${d.help}` : '')).join('\n');
    throw new CompileError('ModuleParse', `${diags.length} semantic error(s) in '${where}'\n${detail}`);
  }
  return toRustAst(ast);
}

/**
 * A compiler host over a file system given as three functions:
 *   readFile(path) → text | null, realpath(path) → identity, cwd → for display_path.
 */
export function makeHost({ readFile, realpath = p => p, cwd = null, home = '/' }) {
  return {
    resolve: (mp, baseDir) => resolveFrom(mp, baseDir, home),
    canonical: p => { try { return realpath(p); } catch { return p; } },
    read: p => readFile(p),
    // zymbol_span::display_path: relative to the working directory when under it.
    display: p => (cwd && p.startsWith(`${cwd}/`) ? p.slice(cwd.length + 1) : p),
    parent: p => parent(p),
    stem: p => stem(p),
    parseModule: (source, path) => parseModule(source, path),
  };
}
