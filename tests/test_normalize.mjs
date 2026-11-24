#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The NFC of the browser engines (src/zymbol/normalize.js, D-20) against the
// Rust engines', on names.
//
//   node tests/test_normalize.mjs
//
// normalize.js is generated from the Unicode Character Database by
// tools/gen_normalize.mjs, whose `--test` runs that version's
// NormalizationTest.txt; the Rust lexer uses the `unicode-normalization` crate.
// They agree only while they are the same version, and nothing else notices the
// day the crate moves. A name cannot be printed, but `zymbol check` names every
// unused variable in the form it knows it by: so this writes 4000 assignments
// whose names are built out of composed letters, their pieces, marks of every
// class and Hangul jamo — from a fixed seed — and requires every warning to name
// what normalize.js gives for that name.
//
// ZYMBOL_BIN picks the binary (default: ../interpreter/target/release/zymbol,
// then `zymbol` on PATH). Exit 2 when there is none.

import { spawnSync } from 'child_process';
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const { nfc, UNICODE_VERSION } = await import('../src/zymbol/normalize.js');
const { isIdentContinue } = await import('../src/zymbol/zymbol.js');

let bin = process.env.ZYMBOL_BIN;
if (!bin) {
  const built = join(HERE, '../../interpreter/target/release/zymbol');
  bin = existsSync(built) ? built : 'zymbol';
}

// Composed letters and the pieces they decompose into, marks of several
// classes (so the reordering is reached), a singleton, a composition exclusion,
// and jamo with the syllables they make.
const POOL = [
  0xE9, 0x1EC7, 0x419, 0x439, 0x451, 0x1E69, 0x1F82, 0x212B, 0x2126, 0x958, 0x929,
  0x65, 0x61, 0x6E, 0x438, 0x435, 0x3B1, 0x928, 0x915, 0x41, 0x73,
  0x301, 0x302, 0x306, 0x308, 0x323, 0x328, 0x327, 0x345, 0x313, 0x93C, 0x94D, 0x5B4, 0x316,
  0x1100, 0x1112, 0x1161, 0x1175, 0x11A8, 0x11AB, 0xAC00, 0xD55C,
].filter(cp => isIdentContinue(String.fromCodePoint(cp)));
let seed = 2026;
// A 32-bit LCG in integer arithmetic, read from its high bits: the product in
// doubles passed 2^53 and lost the low bits, so every draw was a multiple of 8.
const rand = n => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) % n; };
const names = [];
for (let i = 0; i < 4000; i++) {
  let s = `v${i}_`;
  for (let k = 1 + rand(6); k > 0; k--) s += String.fromCodePoint(POOL[rand(POOL.length)]);
  names.push(s);
}

let rust;
const dir = mkdtempSync(join(tmpdir(), 'normalize-'));
try {
  writeFileSync(join(dir, 'p.zy'), names.map(n => `${n} = 1`).join('\n') + '\n');
  // The warnings go to stderr.
  const r = spawnSync(bin, ['check', join(dir, 'p.zy')], { encoding: 'utf8', maxBuffer: 1 << 26, env: { ...process.env, NO_COLOR: '1' } });
  if (r.error) throw r.error;
  rust = r.stdout + r.stderr;
} catch (e) {
  console.error(`test_normalize: could not run ${bin}: ${e.message.split('\n')[0]}`);
  process.exit(2);
} finally { rmSync(dir, { recursive: true, force: true }); }

const got = [...rust.matchAll(/unused variable '([^']*)'/g)].map(m => m[1]);
const want = names.map(nfc);
console.log(`\nnormalize.js (Unicode ${UNICODE_VERSION}) against ${bin}`);
const bad = want.findIndex((w, i) => got[i] !== w);
if (got.length === want.length && bad === -1) {
  const changed = names.filter(n => nfc(n) !== n).length;
  console.log(`  ok   ${names.length} names read alike, ${changed} of them changed by NFC`);
  console.log('\nall passed');
  process.exit(0);
}
if (got.length !== want.length) console.log(`  FAIL ${got.length} warnings for ${want.length} names`);
if (bad !== -1) {
  const cps = s => [...(s ?? '')].map(c => c.codePointAt(0).toString(16)).join(' ');
  console.log(`  FAIL name ${bad}: ${cps(names[bad])} — rust ${cps(got[bad])} js ${cps(want[bad])}`);
}
console.log('  regenerate with tools/gen_normalize.mjs and the UCD of unicode-normalization\'s UNICODE_VERSION');
process.exit(1);
