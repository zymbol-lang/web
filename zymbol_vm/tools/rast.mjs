// SPDX-License-Identifier: AGPL-3.0-only
// Rust's AST of a program, as JavaScript objects: the oracle for the adapter.
//
// `zyb_dump --ast FILE` prints the parsed program with Rust's `{:#?}`; this reads
// that text back into objects in the convention src/zymbol/vm/rustast.js produces,
// so the two can be compared node by node (tests/ast_diff.mjs):
//
//   Variant(Struct { f: v })   →  { k: 'Variant', f: v }      the struct merged in
//   Struct { f: v }            →  { $: 'Struct', f: v }
//   Variant(a, b) / Variant(5) →  { k: 'Variant', _: [a, b] }
//   Variant                    →  'Variant'
//   None / Some(x)             →  null / x
//   Span { start: Position { line, column, … }, … }  →  { line, column }

import { spawnSync } from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = join(ROOT, 'tools/zyb_dump/target/release/zyb_dump');

export function rustAst(file) {
  const r = spawnSync(DUMP, ['--ast', file], { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) return { error: (r.stderr || '').trim() };
  return parseDebug(r.stdout);
}

export function parseDebug(text) {
  let i = 0;
  const ws = () => { while (i < text.length && /[\s,]/.test(text[i])) i++; };
  const ident = () => { const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(text.slice(i, i + 200)); i += m[0].length; return m[0]; };

  function str() {
    i++; let out = '';
    while (text[i] !== '"') {
      if (text[i] === '\\') {
        const c = text[i + 1];
        if (c === 'u') { const end = text.indexOf('}', i); out += String.fromCodePoint(parseInt(text.slice(i + 3, end), 16)); i = end + 1; continue; }
        out += { n: '\n', t: '\t', r: '\r', '0': '\0', '"': '"', "'": "'", '\\': '\\' }[c] ?? c;
        i += 2; continue;
      }
      const cp = text.codePointAt(i); out += String.fromCodePoint(cp); i += cp > 0xFFFF ? 2 : 1;
    }
    i++; return out;
  }
  function chr() {
    i++; let out;
    if (text[i] === '\\') {
      const c = text[i + 1];
      if (c === 'u') { const end = text.indexOf('}', i); out = String.fromCodePoint(parseInt(text.slice(i + 3, end), 16)); i = end + 1; }
      else { out = { n: '\n', t: '\t', r: '\r', '0': '\0', '"': '"', "'": "'", '\\': '\\' }[c] ?? c; i += 2; }
    } else { const cp = text.codePointAt(i); out = String.fromCodePoint(cp); i += cp > 0xFFFF ? 2 : 1; }
    i++; return { char: out };
  }

  function value() {
    ws();
    const c = text[i];
    if (c === '"') return str();
    if (c === "'") return chr();
    if (c === '[') { i++; const out = []; ws(); while (text[i] !== ']') { out.push(value()); ws(); } i++; return out; }
    if (c === '(') { i++; const out = []; ws(); while (text[i] !== ')') { out.push(value()); ws(); } i++; return { tuple: out }; }
    if (/[-0-9]/.test(c) || text.startsWith('inf', i) || text.startsWith('NaN', i)) {
      const m = /^-?(inf|NaN|[0-9]+(\.[0-9]+)?(e[-+]?[0-9]+)?)/.exec(text.slice(i, i + 64));
      i += m[0].length;
      const t = m[0];
      return t === 'inf' ? Infinity : t === '-inf' ? -Infinity : t === 'NaN' ? NaN : (t.includes('.') || t.includes('e') ? { float: Number(t) } : Number(t));
    }
    const name = ident();
    if (name === 'true') return true;
    if (name === 'false') return false;
    if (name === 'None') return null;
    ws();
    if (text[i] === '{') {
      i++; const obj = { $: name };
      ws();
      while (text[i] !== '}') { const f = ident(); ws(); i++; /* : */ obj[f] = value(); ws(); }
      i++;
      if (name === 'Span') return { line: obj.start.line, column: obj.start.column };
      if (name === 'Position') return obj;
      if (name === 'FileId') return obj;
      return obj;
    }
    if (text[i] === '(') {
      i++; const args = []; ws();
      while (text[i] !== ')') { args.push(value()); ws(); }
      i++;
      if (name === 'Some') return args[0];
      if (name === 'Box') return args[0];
      if (name === 'FileId') return args[0];
      if (args.length === 1 && args[0] && typeof args[0] === 'object' && '$' in args[0]) {
        const { $, ...fields } = args[0];
        return { k: name, ...fields };
      }
      return { k: name, _: args };
    }
    return name;
  }
  return value();
}

// `node tools/rast.mjs FILE` prints the converted AST.
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(rustAst(process.argv[2]), null, 1));
}
