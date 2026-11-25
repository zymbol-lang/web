#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The grapheme clusters of the browser engines (src/zymbol/graphemes.js, D-19)
// against the Rust engines'.
//
//   node tests/test_graphemes.mjs
//
// graphemes.js is generated from the Unicode Character Database by
// tools/gen_graphemes.mjs, whose `--test` runs that version's
// GraphemeBreakTest.txt; the Rust engines use the `unicode-segmentation` crate.
// They agree only while they are the same version, and nothing else notices the
// day the crate moves. So this builds texts out of a representative of every
// class the rules read — the break property, Extended_Pictographic, the InCB
// values — 4000 of them from a fixed seed, cuts them in the Rust binary and in
// graphemes.js, and requires the same clusters.
//
// ZYMBOL_BIN picks the binary (default: ../interpreter/target/release/zymbol,
// then `zymbol` on PATH). Exit 2 when there is none.

import { execFileSync } from 'child_process';
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const { graphemes, UNICODE_VERSION } = await import('../src/zymbol/graphemes.js');

let bin = process.env.ZYMBOL_BIN;
if (!bin) {
  const built = join(HERE, '../../interpreter/target/release/zymbol');
  bin = existsSync(built) ? built : 'zymbol';
}

// One or two code points of each class.
const POOL = [
  0x0D, 0x0A, 0x01, 0x200B,            // CR LF Control
  0x0301, 0x1F3FD, 0xFE0F,             // Extend (a mark, a skin tone, VS16)
  0x200D,                              // ZWJ (InCB=Extend)
  0x1F1EA, 0x1F1F8,                    // Regional_Indicator
  0x0600, 0x0903, 0x0E33,              // Prepend, SpacingMark ×2
  0x1100, 0x1161, 0x11A8, 0xAC00, 0xAC01, // L V T LV LVT
  0x1F468, 0x2764, 0x1F469,            // Extended_Pictographic
  0x0915, 0x094D, 0x093C,              // InCB Consonant, Linker, Extend
  0x61, 0x20,                          // Other
];
let seed = 2026;
// A 32-bit LCG in integer arithmetic, read from its high bits: the product in
// doubles passed 2^53 and lost the low bits, so every draw was a multiple of 8.
const rand = n => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) % n; };
const texts = [];
for (let i = 0; i < 4000; i++) {
  const len = 1 + rand(7);
  const t = [];
  for (let k = 0; k < len; k++) t.push(POOL[rand(POOL.length)]);
  texts.push(t);
}

// Each text is built from its code points and its clusters printed as code
// points, so no control character ever stands in a source literal.
const src = `<# std/text => tx
textos = [${texts.map(t => `[${t.join(', ')}]`).join(',\n')}]
@ t:textos {
    s = ""
    @ cp:t { s = s |cp| }
    @ g:tx::graphemes(s) {
        @ c:g { >> #|c| "." }
        >> "|"
    }
    >> ¶
}
`;
let rust;
const dir = mkdtempSync(join(tmpdir(), 'graphemes-'));
try {
  writeFileSync(join(dir, 'p.zy'), src);
  rust = execFileSync(bin, ['run', join(dir, 'p.zy')], { encoding: 'utf8', maxBuffer: 1 << 26 });
} catch (e) {
  console.error(`test_graphemes: could not run ${bin}: ${e.message.split('\n')[0]}`);
  process.exit(2);
} finally { rmSync(dir, { recursive: true, force: true }); }

const js = texts.map(t => graphemes(String.fromCodePoint(...t))
  .map(g => [...g].map(c => `${c.codePointAt(0)}.`).join('') + '|').join('')).join('\n') + '\n';

const r = rust.split('\n'), j = js.split('\n');
const bad = r.findIndex((l, i) => l !== j[i]);
console.log(`\ngraphemes.js (Unicode ${UNICODE_VERSION}) against ${bin}`);
if (bad === -1 && r.length === j.length) {
  console.log(`  ok   ${texts.length} texts cut alike, ${r.filter(l => l.split("|").length > 2).length} of them in more than one cluster`);
  console.log('\nall passed');
  process.exit(0);
}
console.log(`  FAIL text ${bad}: ${JSON.stringify(texts[bad])} — rust ${r[bad]} js ${j[bad]}`);
console.log('  regenerate with tools/gen_graphemes.mjs and the UCD of unicode-segmentation\'s UNICODE_VERSION');
process.exit(1);
