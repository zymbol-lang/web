// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// The 69 digit blocks a Zymbol number may be written in, and the normalizer
// that reads one as ASCII. Mirrors `zymbol_lexer::digit_blocks` — the table is
// the one zymbol.js carries, copied here because zymbol.js is to go.

const DIGIT_BLOCKS = [
  0x0030, 0x0660, 0x06F0, 0x07C0, 0x0966, 0x09E6, 0x0A66, 0x0AE6, 0x0B66, 0x0BE6,
  0x0C66, 0x0CE6, 0x0D66, 0x0DE6, 0x0E50, 0x0ED0, 0x0F20, 0x1040, 0x1090, 0x17E0,
  0x1810, 0x1946, 0x19D0, 0x1A80, 0x1A90, 0x1B50, 0x1BB0, 0x1C40, 0x1C50, 0xA620,
  0xA8D0, 0xA900, 0xA9D0, 0xA9F0, 0xAA50, 0xABF0, 0xF8F0, 0xFF10, 0x104A0, 0x10D30,
  0x11066, 0x110F0, 0x11136, 0x111D0, 0x112F0, 0x11450, 0x114D0, 0x11650, 0x116C0, 0x11730,
  0x118E0, 0x11950, 0x11C50, 0x11D50, 0x11DA0, 0x11F50, 0x16A60, 0x16AC0, 0x16B50, 0x1D7CE,
  0x1D7D8, 0x1D7E2, 0x1D7EC, 0x1D7F6, 0x1E140, 0x1E2F0, 0x1E4F0, 0x1E950, 0x1FBF0,
];

/** The value of a digit of any of the 69 scripts, or -1. */
export function digitValue(cp) {
  for (const base of DIGIT_BLOCKS) if (cp >= base && cp <= base + 9) return cp - base;
  return -1;
}

// ASCII `.` or the one script that has its own decimal separator (U+066B).
const isDecimalSeparator = cp => cp === 0x2E || cp === 0x066B;

/** `ascii_number`: a number written in any script, as ASCII; null if it is not one. */
export function asciiNumber(s) {
  let out = '', i = 0, hasDigit = false, hasDot = false;
  const cps = [...s];
  if (cps[0] === '-') { out = '-'; i = 1; }
  for (; i < cps.length; i++) {
    const cp = cps[i].codePointAt(0), dv = digitValue(cp);
    if (dv >= 0) { out += String.fromCharCode(0x30 + dv); hasDigit = true; }
    else if (isDecimalSeparator(cp) && !hasDot) { out += '.'; hasDot = true; }
    else return null;
  }
  return hasDigit ? out : null;
}

/** The VM's `ascii_digits`: ASCII text as it is, any other read through `asciiNumber`. */
export function asciiDigits(s) {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 0x7F) return asciiNumber(s) ?? s;
  }
  return s;
}
