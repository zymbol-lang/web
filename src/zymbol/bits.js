// SPDX-License-Identifier: AGPL-3.0-only
//
// std/bits — the bits of an integer, and words of several bytes (D-28,
// decided by the author 2026-11-25). The rules and the words of every message
// are those of `zymbol_intrinsics::bits` in Rust; zymbol.js wraps them as the
// module, and the VM reaches them through that module.
//
// An integer of Zymbol has no width: the bits are those of a NON-NEGATIVE
// integer up to 2⁵³ − 1, and `not` and `signed` take the width they need. A
// Char is its code (D-25). JavaScript's bitwise operators work on 32 bits, so
// everything goes through BigInt.

const MAX = 9007199254740991n;

/** The functions and their arities. */
export const FUNCTIONS = new Map([
  ['and', 2], ['or', 2], ['xor', 2], ['shl', 2], ['shr', 2], ['not', 2],
  ['to_le', 2], ['to_be', 2], ['from_le', 1], ['from_be', 1], ['signed', 2],
]);

/**
 * Call `f` with arguments as `{ kind: 'int'|'char'|'text'|'other', v, label }`.
 * Returns `{ int }` or `{ bytes }` (a String of Chars 0x00–0xFF), or throws
 * `{ message }` — its words choose the family, as errkind reads them.
 */
export function call(f, args) {
  const fail = message => { throw { message }; };
  const int = a => {
    if (a?.kind === 'int') return BigInt(a.v);
    if (a?.kind === 'char') return BigInt(a.v.codePointAt(0));
    return fail(`bits::${f}: argument type must be Int or Char, got ${a ? a.label : 'nothing'}`);
  };
  const bitsOf = a => {
    const n = int(a);
    if (n < 0n) fail(`bits::${f}: ${n} is out of range: bits are taken of integers from 0 to 9007199254740991`);
    return n;
  };
  const width = a => {
    const w = int(a);
    if (w < 1n || w > 53n) fail(`bits::${f}: a width of ${w} bits is out of range: it goes from 1 to 53`);
    return w;
  };
  const size = k => {
    if (k < 1n || k > 6n) fail(`bits::${f}: ${k} bytes is out of range: a word goes from 1 to 6`);
    return k;
  };
  const [a, b] = args;
  switch (f) {
    case 'and': return { int: Number(bitsOf(a) & bitsOf(b)) };
    case 'or': return { int: Number(bitsOf(a) | bitsOf(b)) };
    case 'xor': return { int: Number(bitsOf(a) ^ bitsOf(b)) };
    case 'shl': case 'shr': {
      const n = bitsOf(a);
      const k = int(b);
      if (k < 0n) fail(`bits::${f}: a shift of ${k} is out of range: it goes from 0`);
      if (f === 'shr') return { int: Number(k >= 63n ? 0n : n >> k) };
      if (n === 0n) return { int: 0 };
      if (k >= 53n || (n << k) > MAX) fail(`integer overflow: bits::shl(${n}, ${k})`);
      return { int: Number(n << k) };
    }
    case 'not': {
      const n = bitsOf(a);
      const w = width(b);
      const mask = (1n << w) - 1n;
      if (n > mask) fail(`bits::${f}: ${n} is out of range for ${w} bits`);
      return { int: Number(mask ^ n) };
    }
    case 'signed': {
      const n = bitsOf(a);
      const w = width(b);
      const top = 1n << w;
      if (n >= top) fail(`bits::${f}: ${n} is out of range for ${w} bits`);
      return { int: Number(n >= top / 2n ? n - top : n) };
    }
    case 'to_le': case 'to_be': {
      const n = bitsOf(a);
      const k = size(int(b));
      if (n >= 1n << (8n * k)) fail(`bits::${f}: ${n} is out of range for ${k} bytes`);
      const bytes = [];
      for (let i = 0n; i < k; i++) bytes.push(String.fromCodePoint(Number((n >> (8n * i)) & 0xFFn)));
      if (f === 'to_be') bytes.reverse();
      return { bytes: bytes.join('') };
    }
    case 'from_le': case 'from_be': {
      let text;
      if (a?.kind === 'text' || a?.kind === 'char') text = a.v;
      else fail(`bits::${f}: argument type must be String or Char, got ${a ? a.label : 'nothing'}`);
      const bytes = [];
      for (const c of text) {
        const cp = c.codePointAt(0);
        if (cp > 0xFF) {
          fail(`bits::${f}: '${c}' is U+${cp.toString(16).toUpperCase().padStart(4, '0')}, out of range for a byte: a byte is a Char from 0x00 to 0xFF`);
        }
        bytes.push(BigInt(cp));
      }
      size(BigInt(bytes.length));
      if (f === 'from_le') bytes.reverse();
      return { int: Number(bytes.reduce((acc, byte) => acc * 256n + byte, 0n)) };
    }
  }
  return fail(`bits::${f}: no such function`);
}
