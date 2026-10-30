#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The adapter against Rust's own parser: for every .zy, zymbol.js's AST put through
// src/zymbol/vm/rustast.js must equal what zymbol-parser builds, node for node.
//
//   node tests/ast_diff.mjs [DIR|FILE...] [--show N] [--only-type T]
//
// Compared: everything the compiler can read. Not compared: expression spans
// (only a statement's line and column reach the bytecode), `written` (nothing
// reads it), and `Group` around a node the compiler unwraps anyway is kept —
// the compiler matches on it in a few places.

import { readdirSync, statSync, readFileSync } from 'fs';
import { resolve, relative } from 'path';
import { rustAst } from '../tools/rast.mjs';
import { Lexer, Parser } from '../../src/zymbol/zymbol.js';
import { toRustAst } from '../../src/zymbol/vm/rustast.js';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args.splice(i, 2)[1]; };
const show = Number(opt('--show', 25));
const onlyPath = opt('--path', null);
const targets = args.length ? args.map(a => resolve(a)) : [resolve('../../zyquality/corpus')];
const walk = (p, o = []) => { if (statSync(p).isDirectory()) for (const n of readdirSync(p).sort()) walk(p + '/' + n, o); else if (p.endsWith('.zy')) o.push(p); return o; };

/** Rust's Debug-derived tree into the adapter's convention. */
export function normalize(v, isStmt = false) {
  if (Array.isArray(v)) return v.map(x => normalize(x));
  if (v === null || typeof v !== 'object') return v;
  if ('float' in v && Object.keys(v).length === 1) return v.float;
  if ('char' in v && Object.keys(v).length === 1) return v.char;
  if ('tuple' in v && Object.keys(v).length === 1) return v.tuple.map(x => normalize(x));
  const out = {};
  // A struct-like enum variant (`Int { max_digits }`, `Own { … }`) reads as a struct.
  if ('$' in v && ['Int', 'Text', 'Decimal', 'Own', 'ReExport', 'SetNumeralMode'].includes(v.$)) out.k = v.$;
  for (const [key, x] of Object.entries(v)) {
    // Nothing the compiler reads: the formatter's commas, how a key or a path was quoted.
    if (key === '$' || key === 'written' || key === 'commas' || key === 'quoted') continue;
    if (key === 'span') { if (isStmt) out.span = x; continue; }
    if (key === 'statements' || key === 'then_block' || key === 'else_block' || key === 'body' || key === 'block' || key === 'try_block') {
      out[key] = normalizeBlockish(x); continue;
    }
    out[key] = normalize(x);
  }
  // Literal values: `Int(5)` → { t: 'Int', v: 5 }.
  if (v.k === 'Literal' && out.value && typeof out.value === 'object' && out.value.k) out.value = lit(out.value);
  if (v.k === 'Literal' && out.value === 'Unit') out.value = { t: 'Unit' };
  // `:! ##_` and `:!` are one catch-all to the compiler (compile_try).
  if ('error_type' in out && out.error_type && out.error_type.name === '_') out.error_type = null;
  if (v.k === 'Literal' && Array.isArray(out._) && out._.length === 2) out._ = [litAny(out._[0])];   // Pattern::Literal(lit, span), not Precision::Literal(n)
  if (['Range', 'List', 'Wildcard', 'Comparison', 'Ident', 'Or', 'ErrorKind'].includes(v.k) && Array.isArray(out._)) out._ = out._.slice(0, -1); // pattern spans
  return out;
}
function normalizeBlockish(x) {
  if (Array.isArray(x)) return x.map(s => normalize(s, true));
  if (x && typeof x === 'object' && 'statements' in x) return { ...normalize(x), statements: x.statements.map(s => normalize(s, true)) };
  return normalize(x);
}
function lit(l) {
  if (l === 'Unit') return { t: 'Unit' };
  const v = l._?.[0];
  return { t: l.k, v: v && typeof v === 'object' && 'float' in v ? v.float : v && typeof v === 'object' && 'char' in v ? v.char : v };
}
function litAny(l) { return typeof l === 'string' ? { t: l } : lit(l); }
const STMTS = new Set(['Output', 'Assignment', 'ConstDecl', 'DestructureAssign', 'LifetimeEnd', 'Input', 'If', 'Loop', 'Break',
  'Continue', 'Try', 'Newline', 'FunctionDecl', 'Return', 'Match', 'Expr', 'CliArgsCapture', 'SetNumeralMode', 'Sleep',
  'KeyInput', 'ClearScreen', 'OutputPos', 'TuiBlock']);

function firstDiff(a, b, path = '') {
  if (Object.is(a, b)) return null;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return { path, a, b };
  if (Array.isArray(a) !== Array.isArray(b)) return { path, a, b };
  if (Array.isArray(a)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = firstDiff(a[i], b[i], `${path}[${i}]`); if (d) return d; }
    return null;
  }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const d = firstDiff(a[k], b[k], `${path}.${k}`); if (d) return d;
  }
  return null;
}

// Only a statement's line is compared: its column reaches the bytecode's `src`
// table and no output, and zymbol.js does not count columns in graphemes.
const lines = v => JSON.parse(JSON.stringify(v, (k, x) => (k === 'span' && x ? { line: x.line } : x)));

const files = targets.flatMap(t => walk(t));
let same = 0, skipped = 0;
const diffs = [];
for (const f of files) {
  const r = rustAst(f);
  if (r.error) { skipped++; continue; }
  let mine;
  try { mine = toRustAst(new Parser(new Lexer(readFileSync(f, 'utf8')).tokenize()).parse()); }
  catch (e) { diffs.push({ f, d: { path: '(adapter threw)', a: e.message, b: '' } }); continue; }
  const rust = { module_decl: normalize(r.module_decl), imports: normalize(r.imports), statements: r.statements.map(s => normalize(s, true)) };
  const d = firstDiff(lines(rust), lines(mine));
  if (d) diffs.push({ f, d }); else same++;
}
const cut = x => (JSON.stringify(x) ?? 'undefined').slice(0, 300);
console.log(`${files.length} files: ${same} identical ASTs, ${diffs.length} differ, ${skipped} refused by Rust's parser`);
const byPath = new Map();
for (const { d } of diffs) { const key = d.path.replace(/\[\d+\]/g, '[]'); byPath.set(key, (byPath.get(key) ?? 0) + 1); }
console.log('\nwhere they differ first, most frequent:');
for (const [k, n] of [...byPath].sort((x, y) => y[1] - x[1]).slice(0, 20)) console.log(`  ${String(n).padStart(4)}  ${k}`);
console.log('');
for (const { f, d } of diffs.filter(x => !onlyPath || x.d.path.includes(onlyPath) || String(x.d.a).includes(onlyPath)).slice(0, show)) console.log(`${relative(process.cwd(), f)}\n  at ${d.path}\n  rust ${cut(d.a)}\n  mine ${cut(d.b)}`);
process.exit(diffs.length ? 1 : 0);
