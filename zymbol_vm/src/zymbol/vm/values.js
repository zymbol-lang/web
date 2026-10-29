// SPDX-License-Identifier: AGPL-3.0-only
/*
 * Copyright (C) 2024-2026 Zymbol-Lang Team
 *
 * Part of zymbol_vm.js, a hand-written JavaScript port of the Rust register VM
 * in <https://github.com/zymbol-lang/interpreter> (crates/zymbol-vm), and a
 * derivative work of it. Distributed under the GNU Affero General Public
 * License, version 3; see LICENSE-AGPL-3.0 at the root of this repository.
 */

// The runtime values of the VM, and everything that reads one without changing
// it: how it prints, how it is named in a diagnostic, how two compare.
//
// The representation, and why:
//
//   Int      a JS number, always integral and within ±(2^53−1) — the language's
//            own range, which is exactly what a double holds without loss.
//   Float    a ZFloat box: a number alone cannot tell 1 from 1.0. A double in an
//            array of mixed values is boxed by V8 anyway, so the box costs a
//            field load, not an allocation V8 would not have made.
//   Bool     a JS boolean.        String  a JS string (code points, see charLen).
//   Char     a ZChar box, interned below 0x10000 so a text walk allocates nothing.
//   Unit     the UNIT singleton.
//   Array, Tuple, Dict, Closure
//            boxes with a reference count, `rc`, that mirrors the strong count of
//            the Rc the Rust VM keeps them behind. JavaScript has no count of its
//            own, and the count is what decides whether an edit writes in place
//            or copies: without it, passing an array to a function and then
//            editing it copies the whole array every time (measured: quadratic
//            in zymbol.js, linear in the Rust VM). `retain` is Rust's `clone`,
//            `release` is its `drop`; the machine calls them where the Rust code
//            clones and drops, and `--count`'s `copied=` is how a missed one shows.

export const T_INT = 0, T_FLOAT = 1, T_BOOL = 2, T_CHAR = 3, T_UNIT = 4, T_FUNC = 5,
  T_STR = 6, T_ARRAY = 7, T_TUPLE = 8, T_DICT = 9, T_CLOSURE = 10, T_ERROR = 11;

export class ZFloat { constructor(v) { this.v = v; } }
ZFloat.prototype.t = T_FLOAT;

export class ZChar { constructor(cp) { this.cp = cp; } }
ZChar.prototype.t = T_CHAR;
const CHAR_CACHE = new Array(0x10000);
export function mkChar(cp) {
  if (cp < 0x10000) return CHAR_CACHE[cp] ?? (CHAR_CACHE[cp] = new ZChar(cp));
  return new ZChar(cp);
}

class ZUnit {}
ZUnit.prototype.t = T_UNIT;
export const UNIT = new ZUnit();

export class ZFunc { constructor(idx, arity) { this.idx = idx; this.arity = arity; } }
ZFunc.prototype.t = T_FUNC;

export class ZArray { constructor(items) { this.items = items; this.rc = 1; } }
ZArray.prototype.t = T_ARRAY;

export class ZTuple { constructor(items) { this.items = items; this.rc = 1; } }
ZTuple.prototype.t = T_TUPLE;

/** The dictionary: a Map keeps insertion order and finds by hash, as IndexMap does. */
export class ZDict { constructor(map) { this.map = map; this.rc = 1; } }
ZDict.prototype.t = T_DICT;

/** A lambda; its captures are shared between copies, as Rust's `Rc<Vec<Value>>` is. */
export class ZClosure { constructor(idx, arity, ups) { this.idx = idx; this.arity = arity; this.ups = ups; this.rc = 1; } }
ZClosure.prototype.t = T_CLOSURE;

/** An error carried as a value: its text is `##Kind(message)`. */
export class ZError { constructor(s) { this.s = s; } }
ZError.prototype.t = T_ERROR;

export function tagOf(v) {
  switch (typeof v) {
    case 'number': return T_INT;
    case 'string': return T_STR;
    case 'boolean': return T_BOOL;
    default: return v.t;
  }
}

// ── The reference count ─────────────────────────────────────────────────────

/** Rust's `Value::clone` for a value that owns a collection: one more holder. */
export function retain(v) {
  if (typeof v === 'object' && v.rc > 0) v.rc++;
  return v;
}

/** Rust's drop: one holder fewer, and the last one lets go of what it held. */
export function release(v) {
  if (typeof v === 'object' && v.rc > 0 && --v.rc === 0) {
    switch (v.t) {
      case T_ARRAY: case T_TUPLE: for (const x of v.items) release(x); break;
      case T_DICT: for (const x of v.map.values()) release(x); break;
      case T_CLOSURE: for (const x of v.ups) release(x); break;
    }
  }
}

/** What a copy of `items` holds: each element one more holder. */
export function cloneItems(items) {
  const out = items.slice();
  for (let i = 0; i < out.length; i++) retain(out[i]);
  return out;
}

export function cloneMap(map) {
  const out = new Map(map);
  for (const v of out.values()) retain(v);
  return out;
}

// ── Text ────────────────────────────────────────────────────────────────────

/** Code points, which is what `$#` counts (a char is a code point, not a grapheme). */
export function charLen(s) {
  let n = s.length;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF) { n--; i++; }
  }
  return n;
}

export function isAscii(s) {
  for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 0x7F) return false;
  return true;
}

/** The code points of a string, as an array of numbers. */
export function codePoints(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const c = s.codePointAt(i);
    out.push(c);
    if (c > 0xFFFF) i++;
  }
  return out;
}

/** Rust's `str::cmp`: byte order of UTF-8, which is code point order — not UTF-16's. */
export function cmpStr(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    let x = a.charCodeAt(i), y = b.charCodeAt(i);
    if (x === y) continue;
    // Surrogates sort after U+E000–U+FFFF in code point order.
    if (x >= 0xD800) x += x >= 0xE000 ? -0x800 : 0x2000;
    if (y >= 0xD800) y += y >= 0xE000 ? -0x800 : 0x2000;
    return x < y ? -1 : 1;
  }
  return a.length === b.length ? 0 : (a.length < b.length ? -1 : 1);
}

// ── Numbers as Zymbol spells them (copied from zymbol.js, which is to go) ───

export const ASCII_BASE = 0x0030;
export const ZY_INT_MAX = 9007199254740991;
export const ZY_INT_MIN = -9007199254740991;

const SCRIPT_SEPARATORS = [
  [0x0660, '٫', '٬'],   // Arabic-Indic
  [0x06F0, '٫', '٬'],   // Extended Arabic-Indic (Persian, Urdu)
];
function decimalSeparator(base) { const e = SCRIPT_SEPARATORS.find(([b]) => b === base); return e ? e[1] : '.'; }
function thousandsSeparator(base) { const e = SCRIPT_SEPARATORS.find(([b]) => b === base); return e ? e[2] : ','; }

/** One formatted number into the script whose digit zero is `base`. */
export function mapNumeralNumber(s, base) {
  if (base === ASCII_BASE) return s;
  const dec = decimalSeparator(base), th = thousandsSeparator(base);
  let out = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') out += String.fromCodePoint(base + (ch.charCodeAt(0) - 0x30));
    else if (ch === '.') out += dec;
    else if (ch === ',') out += th;
    else out += ch;
  }
  return out;
}

/** Rust's `{}` for an f64: never an exponent, `inf`, `-0` keeps its sign. */
export function floatText(f) {
  if (Number.isNaN(f)) return 'NaN';
  if (f === Infinity) return 'inf';
  if (f === -Infinity) return '-inf';
  if (Object.is(f, -0)) return '-0';
  return expandExponent(String(f));
}

function expandExponent(str) {
  const ei = str.indexOf('e');
  if (ei < 0) return str;
  let mant = str.slice(0, ei);
  const ex = Number(str.slice(ei + 1));
  const neg = mant.startsWith('-');
  if (neg) mant = mant.slice(1);
  const di = mant.indexOf('.');
  const ip = di < 0 ? mant : mant.slice(0, di);
  const fp = di < 0 ? '' : mant.slice(di + 1);
  const digits = ip + fp;
  const point = ip.length + ex;
  let body;
  if (point <= 0) body = '0.' + '0'.repeat(-point) + digits;
  else if (point >= digits.length) body = digits + '0'.repeat(point - digits.length);
  else body = digits.slice(0, point) + '.' + digits.slice(point);
  if (body.includes('.')) body = body.replace(/0+$/, '').replace(/\.$/, '');
  return neg ? '-' + body : body;
}

export function numeralInt(n, base) { return mapNumeralNumber(String(n), base); }
export function numeralFloat(f, base) { return mapNumeralNumber(floatText(f), base); }
export function numeralBool(b, base) { return '#' + numeralInt(b ? 1 : 0, base); }

// ── How a value prints ──────────────────────────────────────────────────────

/** Rust's `Display`: the form a value takes inside a collection. */
export function display(v) {
  switch (typeof v) {
    case 'number': return String(v);
    case 'string': return v;
    case 'boolean': return v ? '#1' : '#0';
  }
  switch (v.t) {
    case T_FLOAT: return floatText(v.v);
    case T_CHAR: return String.fromCodePoint(v.cp);
    case T_UNIT: return '()';
    case T_FUNC: return `<funct/${v.arity}>`;
    case T_CLOSURE: return `<lambd/${v.arity}>`;
    case T_ERROR: return v.s;
    case T_ARRAY: return '[' + v.items.map(display).join(', ') + ']';
    case T_TUPLE: return '(' + v.items.map(display).join(', ') + ')';
    case T_DICT: {
      const parts = [];
      for (const [k, x] of v.map) parts.push(`${k}: ${display(x)}`);
      return '#(' + parts.join(', ') + ')';
    }
  }
  throw new Error('unknown value');
}

/** `to_string_repr`: a standalone Unit is nothing; nested, it is `()`. */
export function repr(v) {
  if (typeof v === 'string') return v;
  if (v === UNIT) return '';
  return display(v);
}

/** `to_display_in`: every digit in the script of `base`, collections included. */
export function displayIn(v, base) {
  const nested = x => (x === UNIT ? '()' : displayIn(x, base));
  switch (typeof v) {
    case 'number': return numeralInt(v, base);
    case 'string': return v;
    case 'boolean': return numeralBool(v, base);
  }
  switch (v.t) {
    case T_UNIT: return '';
    case T_FLOAT: return numeralFloat(v.v, base);
    case T_ARRAY: return '[' + v.items.map(nested).join(', ') + ']';
    case T_TUPLE: return '(' + v.items.map(nested).join(', ') + ')';
    case T_DICT: {
      const parts = [];
      for (const [k, x] of v.map) parts.push(`${k}: ${nested(x)}`);
      return '#(' + parts.join(', ') + ')';
    }
    default: return display(v);
  }
}

// ── How a value is named ────────────────────────────────────────────────────

/** `type_name`: Int, Float, …, as the arithmetic and comparison refusals say. */
export function typeName(v) {
  switch (tagOf(v)) {
    case T_INT: return 'Int'; case T_FLOAT: return 'Float'; case T_STR: return 'String';
    case T_CHAR: return 'Char'; case T_BOOL: return 'Bool'; case T_ARRAY: return 'Array';
    case T_TUPLE: return 'Tuple'; case T_DICT: return 'Dict'; case T_FUNC: return 'Function';
    case T_CLOSURE: return 'Function'; case T_UNIT: return 'Unit'; case T_ERROR: return 'Error';
  }
}

/** `type_word`: integer, float, …, as the loop specifier's refusal says. */
export function typeWord(v) {
  switch (tagOf(v)) {
    case T_INT: return 'integer'; case T_FLOAT: return 'float'; case T_BOOL: return 'bool';
    case T_STR: return 'string'; case T_CHAR: return 'char'; case T_ARRAY: return 'array';
    case T_TUPLE: case T_DICT: return 'tuple'; case T_FUNC: return 'function';
    case T_CLOSURE: return 'lambda'; case T_ERROR: return 'error'; case T_UNIT: return 'unit';
  }
}

/** `type_label` (zymbol_common::typeword): `Int`, `[Int]`, `(Int, String)`, `#(k: Int)`. */
export function typeLabel(v) {
  switch (tagOf(v)) {
    case T_INT: return 'Int'; case T_FLOAT: return 'Float'; case T_STR: return 'String';
    case T_CHAR: return 'Char'; case T_BOOL: return 'Bool'; case T_UNIT: return 'Unit';
    case T_ERROR: return 'Error'; case T_FUNC: case T_CLOSURE: return 'Function';
    case T_ARRAY: {
      const names = v.items.map(typeLabel);
      if (names.length === 0) return '[?]';
      return names.every(n => n === names[0]) ? `[${names[0]}]` : '[Any]';
    }
    case T_TUPLE: return '(' + v.items.map(typeLabel).join(', ') + ')';
    case T_DICT: {
      const parts = [];
      for (const [k, x] of v.map) parts.push(`${k}: ${typeLabel(x)}`);
      return '#(' + parts.join(', ') + ')';
    }
  }
}

/** `tw_type_name` (zymbol_common::typesym): the base symbol `#?` starts from. */
export function typeSymbol(v) {
  switch (tagOf(v)) {
    case T_INT: return '###'; case T_FLOAT: return '##.'; case T_STR: return '##"';
    case T_CHAR: return "##'"; case T_BOOL: return '##?'; case T_ARRAY: return '##]';
    case T_TUPLE: return '##)'; case T_DICT: return '##('; case T_FUNC: return '##()';
    case T_CLOSURE: return '##->'; case T_UNIT: return '##_'; case T_ERROR: return '##!';
  }
}

/** `tw_type_name_owned`: an error names its own kind, `##Index`, not `##!`. */
export function typeSymbolOwned(v) {
  if (tagOf(v) === T_ERROR) { const i = v.s.indexOf('('); return i < 0 ? v.s : v.s.slice(0, i); }
  return typeSymbol(v);
}

/** `#?`'s symbol: an array whose elements are not all one type is a list, `##[`. */
export function refinedTypeSymbol(v) {
  if (tagOf(v) === T_ARRAY && v.items.length > 0) {
    const first = typeSymbol(v.items[0]);
    return v.items.every(x => typeSymbol(x) === first) ? '##]' : '##[';
  }
  return typeSymbol(v);
}

/** The count `#?` answers. */
export function typeCount(v) {
  switch (tagOf(v)) {
    case T_INT: return String(v).length;
    case T_FLOAT: return floatText(v.v).length;
    case T_STR: return charLen(v);
    case T_CHAR: case T_BOOL: return 1;
    case T_ARRAY: case T_TUPLE: return v.items.length;
    case T_DICT: return v.map.size;
    case T_FUNC: case T_CLOSURE: return v.arity;
    default: return 0;
  }
}

/** The message inside an error's `##Kind(…)`, which is what `#?` counts on one. */
export function errorMessageLen(v) {
  const t = v.s, i = t.indexOf('(');
  if (i >= 0 && t.endsWith(')')) return charLen(t.slice(i + 1, -1));
  return charLen(t);
}

// ── How two values compare ──────────────────────────────────────────────────

/** No ordering at all: two different types, or NaN. False in all four directions. */
export const INCOMPARABLE = 2;
const ord = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
const fOrd = (x, y) => (x < y ? -1 : x > y ? 1 : x === y ? 0 : INCOMPARABLE);

/** `cmp_direct`: what `==` and `<>` read, 0 meaning equal. */
export function cmpDirect(a, b) {
  const ta = tagOf(a), tb = tagOf(b);
  if (ta === T_INT && tb === T_INT) return ord(a, b);
  if ((ta === T_INT || ta === T_FLOAT) && (tb === T_INT || tb === T_FLOAT))
    return fOrd(ta === T_INT ? a : a.v, tb === T_INT ? b : b.v);
  if (ta !== tb) return 1;
  switch (ta) {
    case T_STR: return cmpStr(a, b);
    case T_CHAR: return ord(a.cp, b.cp);
    case T_BOOL: return ord(a ? 1 : 0, b ? 1 : 0);
    case T_UNIT: return 0;
    case T_TUPLE: case T_ARRAY: {
      if (a.items.length !== b.items.length) return 1;
      for (let i = 0; i < a.items.length; i++) { const r = cmpDirect(a.items[i], b.items[i]); if (r !== 0) return r; }
      return 0;
    }
    case T_DICT: {
      if (a.map.size !== b.map.size) return 1;
      for (const [k, va] of a.map) { if (!b.map.has(k) || cmpDirect(va, b.map.get(k)) !== 0) return 1; }
      return 0;
    }
    case T_FUNC: return a.idx === b.idx && a.arity === b.arity ? 0 : 1;
    case T_CLOSURE: return a === b || (a.idx === b.idx && a.arity === b.arity && a.ups === b.ups) ? 0 : 1;
    default: return 1;
  }
}

/** `equals`: equality for patterns and `$?`. */
export function equals(a, b) {
  const ta = tagOf(a), tb = tagOf(b);
  if ((ta === T_INT || ta === T_FLOAT) && (tb === T_INT || tb === T_FLOAT))
    return (ta === T_INT ? a : a.v) === (tb === T_INT ? b : b.v);
  if (ta !== tb) return false;
  switch (ta) {
    case T_STR: case T_BOOL: return a === b;
    case T_CHAR: return a.cp === b.cp;
    case T_UNIT: return true;
    case T_FUNC: return a.idx === b.idx && a.arity === b.arity;
    case T_CLOSURE: return a === b || (a.idx === b.idx && a.arity === b.arity && a.ups === b.ups);
    case T_TUPLE: case T_ARRAY:
      return a.items.length === b.items.length && a.items.every((x, i) => equals(x, b.items[i]));
    case T_DICT: {
      if (a.map.size !== b.map.size) return false;
      for (const [k, va] of a.map) if (!b.map.has(k) || !equals(va, b.map.get(k))) return false;
      return true;
    }
    default: return false;
  }
}

/** `num::parse`: an Int when it is all digits and in range, else a Float, else none. */
export function parseNum(text) {
  const digits = text[0] === '+' || text[0] === '-' ? text.slice(1) : text;
  if (digits.length > 0 && /^[0-9]+$/.test(digits)) {
    const n = Number(text) + 0;   // `+ 0`: "-0" is the Int 0, not JavaScript's -0
    return Number.isSafeInteger(n) ? { int: n } : null;
  }
  const f = rustParseF64(text);
  return f === null ? null : { float: f };
}

/** Rust's `str::parse::<f64>`, or null. */
export const parseF64 = t => rustParseF64(t);

/** Rust's `f64::from_str`: decimal, optional exponent, `inf`/`nan` words; no hex, no blanks. */
function rustParseF64(t) {
  if (/^[+-]?(inf|infinity|nan)$/i.test(t)) {
    const neg = t[0] === '-';
    if (/nan/i.test(t)) return NaN;
    return neg ? -Infinity : Infinity;
  }
  if (!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(t)) return null;
  return Number(t);
}

/** `cmp_order`: `<`, `<=`, `>`, `>=`; a string counts as a number when `#|…|` would read one. */
export function cmpOrder(a, b, asciiDigits) {
  const ta = tagOf(a), tb = tagOf(b);
  const asInt = s => { const p = parseNum(asciiDigits(s.trim())); return p && 'int' in p ? p.int : null; };
  const asF64 = s => rustParseF64(asciiDigits(s.trim()));
  if (ta === T_INT && tb === T_INT) return ord(a, b);
  if (ta === T_FLOAT && tb === T_FLOAT) return fOrd(a.v, b.v);
  if (ta === T_INT && tb === T_FLOAT) return fOrd(a, b.v);
  if (ta === T_FLOAT && tb === T_INT) return fOrd(a.v, b);
  if (ta === T_CHAR && tb === T_CHAR) return ord(a.cp, b.cp);
  if (ta === T_BOOL && tb === T_BOOL) return ord(a ? 1 : 0, b ? 1 : 0);
  if (ta === T_STR && tb === T_STR) {
    const x = asInt(a), y = asInt(b);
    if (x !== null && y !== null) return ord(x, y);
    const fx = asF64(a), fy = asF64(b);
    if (fx !== null && fy !== null) return fOrd(fx, fy);
    return cmpStr(a, b);
  }
  if (ta === T_STR && tb === T_INT) { const n = asInt(a); if (n !== null) return ord(n, b); const f = asF64(a); return f === null ? null : fOrd(f, b); }
  if (ta === T_INT && tb === T_STR) { const n = asInt(b); if (n !== null) return ord(a, n); const f = asF64(b); return f === null ? null : fOrd(a, f); }
  if (ta === T_STR && tb === T_FLOAT) { const f = asF64(a); return f === null ? null : fOrd(f, b.v); }
  if (ta === T_FLOAT && tb === T_STR) { const f = asF64(b); return f === null ? null : fOrd(a.v, f); }
  return null;
}

/** `vm_natural_cmp`: the order `$^` sorts in without a comparator. */
export function naturalCmp(a, b) {
  const ta = tagOf(a), tb = tagOf(b);
  const num = (t, v) => (t === T_INT ? v : v.v);
  if ((ta === T_INT || ta === T_FLOAT) && (tb === T_INT || tb === T_FLOAT)) {
    const x = num(ta, a), y = num(tb, b);
    return x < y ? -1 : x > y ? 1 : 0;
  }
  if (ta === T_STR && tb === T_STR) return cmpStr(a, b);
  if (ta === T_BOOL && tb === T_BOOL) return ord(a ? 1 : 0, b ? 1 : 0);
  return 0;
}
