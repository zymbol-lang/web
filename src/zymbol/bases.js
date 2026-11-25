// SPDX-License-Identifier: AGPL-3.0-only
//
// The three doors between a value and its spellings (D-25, decided by the
// author 2026-11-24), shared by zymbol.js and the VM so the two browser engines
// cannot read the same text differently. The Rust engines share the same rule
// through `zymbol_common::num` (`base_string`, `parse_base_text`,
// `parse_prefixed`), and every message below is worded as it words it.
//
//   0x|v| 0d|v| 0o|v| 0b|v|   the text of v in that base   0d|'A'| → "0d65"
//   |v|                       the character                |"0x41"| → 'A'
//   #|v|                      the number                   #|'A'| → 65
//
// v is a Char, an Int, or a text in any base: the text may carry a sign and
// any of the four prefixes, and without one it is read in the base of the
// door — decimal for the bare bars.

const ZY_INT_MAX = 9007199254740991;

const NAMES = { 2: 'binary', 8: 'octal', 10: 'decimal', 16: 'hexadecimal' };
const PREFIX = { b: 2, B: 2, o: 8, O: 8, d: 10, D: 10, x: 16, X: 16 };
const DIGITS = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9a-fA-F]+$/ };

/** The name of a radix as a reader writes it. */
export function radixName(radix) { return NAMES[radix] ?? 'hexadecimal'; }

/**
 * `n` written in `radix`: never fewer digits than a byte takes in that base,
 * the decimal as it is read, the sign in front (D-23, GLB-136):
 * `0x41 0o101 0b01000001 0d65 -0x01`.
 */
export function baseString(n, radix) {
  const sg = n < 0 ? '-' : '', m = Math.abs(n);
  if (radix === 2) return sg + '0b' + m.toString(2).padStart(8, '0');
  if (radix === 8) return sg + '0o' + m.toString(8).padStart(3, '0');
  if (radix === 10) return sg + '0d' + m.toString(10);
  return sg + '0x' + m.toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Read a text written in a base. Returns `{ n }`, or `{ family, message }` —
 * `Parse` for no digits or a digit not of the radix, `Range` past ±(2⁵³ − 1).
 */
export function parseBaseText(text, defaultRadix) {
  const t = text.trim();
  let rest = t, negative = false;
  if (rest[0] === '-') { negative = true; rest = rest.slice(1); }
  else if (rest[0] === '+') rest = rest.slice(1);
  let radix = defaultRadix, digits = rest;
  if (rest.length >= 2 && rest[0] === '0' && PREFIX[rest[1]] !== undefined) {
    radix = PREFIX[rest[1]];
    digits = rest.slice(2);
  }
  if (!DIGITS[radix].test(digits)) {
    return { family: 'Parse', message: `failed to parse '${digits}' as ${radixName(radix)} number` };
  }
  // Every digit string reads exactly up to 2⁵³; past it the range check below
  // refuses it before precision matters.
  const m = digits.length > 64 ? Infinity : parseInt(digits, radix);
  if (!(m <= ZY_INT_MAX)) {
    return { family: 'Range', message: `integer overflow: '${digits}' is past the integer range` };
  }
  return { n: negative ? -m : m };
}

/** `#|"0x41"|`: the number of a text that names its base by a prefix, or null. */
export function parsePrefixed(text) {
  const t = text.trim();
  const u = t[0] === '-' || t[0] === '+' ? t.slice(1) : t;
  if (!(u.length >= 2 && u[0] === '0' && PREFIX[u[1]] !== undefined)) return null;
  const r = parseBaseText(t, 10);
  return 'n' in r ? r.n : null;
}

/** A code that has a character: 0 to 0x10FFFF, and not a surrogate. */
export function isCharCode(n) {
  return Number.isInteger(n) && n >= 0 && n <= 0x10FFFF && !(n >= 0xD800 && n <= 0xDFFF);
}
