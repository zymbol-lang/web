// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// Numbers written the way Rust's `format!` writes them, for `#,` `#^` `#.` `#!`.
//
// JavaScript's toFixed/toExponential round an exact tie up; Rust rounds it to
// even, from the exact binary value: `#^.1|1.25|` is `1.2e0` in both Rust
// engines and `1.3e+0` from toExponential(1). So the digits here come from the
// exact decimal expansion of the double (BigInt), rounded half to even — which
// is what Rust's flt2dec does in its exact mode.

import { floatText } from './values.js';

/** LLVM's `__powidf2`, which `f64::powi` compiles to: square-and-multiply, then the reciprocal. */
export function powi(a, b) {
  const recip = b < 0;
  let n = Math.abs(b), r = 1;
  for (;;) {
    if (n & 1) r *= a;
    n = Math.floor(n / 2);
    if (n === 0) break;
    a *= a;
  }
  return recip ? 1 / r : r;
}

/** Rust's `f64::round`: half away from zero. */
export const roundHalfAway = f => (f < 0 ? -Math.round(-f) : Math.round(f));

/** The exact value of a finite double as `digits × 10^exp10`, digits without leading zeros. */
function exactDecimal(x) {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, x);
  const hi = view.getUint32(0), lo = view.getUint32(4);
  const e = (hi >>> 20) & 0x7FF;
  let m = (BigInt(hi & 0xFFFFF) << 32n) | BigInt(lo);
  let E;
  if (e === 0) E = -1074; else { m |= 1n << 52n; E = e - 1075; }
  if (m === 0n) return { digits: '0', exp10: 0 };
  if (E >= 0) return { digits: (m << BigInt(E)).toString(), exp10: 0 };
  return { digits: (m * 5n ** BigInt(-E)).toString(), exp10: E };
}

/** `keep` rounded by what follows it, half to even. Returns the digits and whether they grew a digit. */
function roundDigits(keep, rest) {
  let up = false;
  if (rest.length > 0) {
    if (rest[0] > '5') up = true;
    else if (rest[0] === '5') up = /[1-9]/.test(rest.slice(1)) || (Number(keep[keep.length - 1] ?? '0') % 2 === 1);
  }
  if (!up) return { digits: keep, carry: false };
  const n = (BigInt(keep === '' ? '0' : keep) + 1n).toString();
  return { digits: n, carry: n.length > keep.length };
}

const isNeg = x => x < 0 || Object.is(x, -0);

/** `format!("{:.N}", x)`. */
export function rustFixed(x, n) {
  if (Number.isNaN(x)) return 'NaN';
  if (x === Infinity) return 'inf';
  if (x === -Infinity) return '-inf';
  const sign = isNeg(x) ? '-' : '';
  const { digits, exp10 } = exactDecimal(Math.abs(x));
  // x × 10^n = digits × 10^(exp10 + n): an integer to round, then a point n from the right.
  const shift = exp10 + n;
  let int;
  if (shift >= 0) int = digits + '0'.repeat(shift);
  else {
    const cut = digits.length + shift;
    const keep = cut > 0 ? digits.slice(0, cut) : '';
    const rest = cut > 0 ? digits.slice(cut) : '0'.repeat(-cut) + digits;
    int = roundDigits(keep, rest).digits || '0';
  }
  int = int.replace(/^0+(?=.)/, '');
  if (n === 0) return sign + int;
  const padded = int.padStart(n + 1, '0');
  return `${sign}${padded.slice(0, -n)}.${padded.slice(-n)}`;
}

/** `format!("{:.N e}", x)`: N digits after the point, exponent without a `+`. */
export function rustExpPrec(x, n) {
  if (Number.isNaN(x)) return 'NaN';
  if (x === Infinity) return 'inf';
  if (x === -Infinity) return '-inf';
  const sign = isNeg(x) ? '-' : '';
  if (x === 0) return `${sign}0${n > 0 ? '.' + '0'.repeat(n) : ''}e0`;
  const { digits, exp10 } = exactDecimal(Math.abs(x));
  let sciE = digits.length - 1 + exp10;
  let mant;
  if (digits.length <= n + 1) mant = digits + '0'.repeat(n + 1 - digits.length);
  else {
    const r = roundDigits(digits.slice(0, n + 1), digits.slice(n + 1));
    mant = r.digits;
    if (r.carry) { mant = mant.slice(0, n + 1); sciE++; }
  }
  return `${sign}${mant[0]}${n > 0 ? '.' + mant.slice(1) : ''}e${sciE}`;
}

/** `format!("{:e}", x)`: the shortest digits that read back, exponent without a `+`. */
export function rustExpShortest(x) {
  if (Number.isNaN(x)) return 'NaN';
  if (x === Infinity) return 'inf';
  if (x === -Infinity) return '-inf';
  if (x === 0) return isNeg(x) ? '-0e0' : '0e0';
  return x.toExponential().replace('e+', 'e');
}

/** `fmt_comma_int`. */
function commaInt(n) {
  const digits = (n < 0n ? -n : n).toString();
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ',';
    out += digits[i];
  }
  return (n < 0n ? '-' : '') + out;
}

const I64_MAX = 9223372036854775807n;
/** `f.floor() as i64`: Rust's saturating cast, NaN to 0. */
function floorToI64(f) {
  if (Number.isNaN(f)) return 0n;
  if (f >= 9223372036854775807) return I64_MAX;
  if (f <= -9223372036854775808) return -I64_MAX - 1n;
  return BigInt(Math.floor(f));
}

/** `vm_fmt_thousands`: kind 0 none, 1 round, 2 truncate, to `n` decimals. */
export function fmtThousands(num, kind, n) {
  if (kind === 1) { const m = powi(10, n); num = roundHalfAway(num * m) / m; }
  else if (kind === 2) { const m = powi(10, n); num = Math.trunc(num * m) / m; }
  const neg = num < 0;
  const abs = Math.abs(num);
  const intPart = floorToI64(abs);
  let s = commaInt(intPart);
  if (kind === 0) {
    const full = floatText(abs);
    const dot = full.indexOf('.');
    if (dot >= 0) s += full.slice(dot);
  } else if (n > 0) {
    const fs = rustFixed(abs - Number(intPart), n);
    const dot = fs.indexOf('.');
    if (dot >= 0) s += fs.slice(dot);
  }
  return neg ? '-' + s : s;
}

/** `vm_fmt_scientific`. */
export function fmtScientific(num, kind, n) {
  if (kind === 0) return rustExpShortest(num);
  if (kind === 1) return rustExpPrec(num, n);
  if (num === 0) return n === 0 ? '0e0' : rustExpPrec(0, n);
  const exp = Math.floor(Math.log10(Math.abs(num)));
  const mantissa = num / powi(10, exp);
  const m = powi(10, n);
  const truncated = Math.trunc(mantissa * m) / m;
  if (n === 0) return `${Math.trunc(truncated)}e${exp}`;
  return `${rustFixed(truncated, n)}e${exp}`;
}
