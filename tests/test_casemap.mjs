#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The case tables of the browser engines (src/zymbol/casemap.js, D-18) against
// the Rust engines, on every code point.
//
//   node tests/test_casemap.mjs
//
// casemap.js is generated from the Unicode Character Database by
// tools/gen_casemap.mjs, and the Rust engines use Rust's own tables. The two
// agree only while they are the same Unicode version, and nothing else notices
// the day the Rust toolchain moves to a newer one. So this runs one Zymbol
// program through the Rust binary — every code point whose upper case, lower
// case or folding is not itself — and holds casemap.js to its answer, then the
// final sigma, the one context rule, on texts built to reach every branch.
//
// ZYMBOL_BIN picks the binary (default: ../interpreter/target/release/zymbol,
// then `zymbol` on PATH). Exit 2 when there is none: nothing ran is not nothing
// failed.

import { execFileSync } from 'child_process';
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const casemap = await import('../src/zymbol/casemap.js');

let bin = process.env.ZYMBOL_BIN;
if (!bin) {
  const built = join(HERE, '../../interpreter/target/release/zymbol');
  bin = existsSync(built) ? built : 'zymbol';
}
function run(src) {
  const dir = mkdtempSync(join(tmpdir(), 'casemap-'));
  try {
    writeFileSync(join(dir, 'p.zy'), src);
    return execFileSync(bin, ['run', join(dir, 'p.zy')], { encoding: 'utf8', maxBuffer: 1 << 26 });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

let rust;
try {
  rust = run(`<# std/text => tx
@ cp:0..1114111 {
    ? cp >= 55296 && cp <= 57343 { @> }
    c = 0d|cp|
    s = "" c
    u = tx::upper(c)
    l = tx::lower(c)
    f = tx::fold(c)
    ? u <> s || l <> s || f <> c {
        >> cp "\\t" u "\\t" l "\\t" f ¶
    }
}
`);
} catch (e) {
  console.error(`test_casemap: could not run ${bin}: ${e.message.split('\n')[0]}`);
  process.exit(2);
}

let js = '';
for (let cp = 0; cp <= 0x10FFFF; cp++) {
  if (cp >= 0xD800 && cp <= 0xDFFF) continue;
  const c = String.fromCodePoint(cp);
  const u = casemap.upperChar(c), l = casemap.lowerChar(c), f = casemap.foldChar(c);
  if (u !== c || l !== c || f !== c) js += `${cp}\t${u}\t${l}\t${f}\n`;
}

let failures = 0;
const check = (label, ok, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ' :: ' + detail}`);
  if (!ok) failures++;
};

console.log(`\ncasemap.js (Unicode ${casemap.UNICODE_VERSION}) against ${bin}`);
const r = rust.split('\n').filter(Boolean), j = js.split('\n').filter(Boolean);
const firstDiff = r.findIndex((l, i) => l !== j[i]);
check(`every code point: ${r.length} that change in Rust, ${j.length} in casemap.js`,
  r.length === j.length && firstDiff === -1,
  `first difference: rust ${JSON.stringify(r[firstDiff])} js ${JSON.stringify(j[firstDiff])} — regenerate with tools/gen_casemap.mjs and the UCD of Rust's char::UNICODE_VERSION`);

// The final sigma: before it a cased letter, past any case-ignorable one; after
// it none. Each text reaches a branch of that rule.
const texts = ['ΣΑΣ', 'Σ', 'ΑΣ.', 'ΑΣΑ', 'ΑΣ́', 'Σ.Α', 'ὈΔΥΣΣΕΎΣ', 'A­Σ', 'ΣΣ', 'Α\'Σ', '1Σ', 'ΑΣ1', 'ΑΣ­'];
const rustLower = run(`<# std/text => tx
p = [${texts.map(t => JSON.stringify(t)).join(', ')}]
@ s:p { >> tx::lower(s) ¶ }
`).split('\n').filter(Boolean);
texts.forEach((t, i) => check(`lower(${JSON.stringify(t)}) = ${JSON.stringify(rustLower[i])}`,
  casemap.lower(t) === rustLower[i], JSON.stringify(casemap.lower(t))));

console.log(failures ? `\n${failures} failed` : '\nall passed');
process.exit(failures ? 1 : 0);
