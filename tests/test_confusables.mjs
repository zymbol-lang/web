#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The editor's hint for a name character that looks like a symbol.
//
//   node tests/test_confusables.mjs
//
// Decided by the author on 2026-09-25: `ºtotal` stays a valid name, and only an
// editor — the language server, and the playground's problems panel through
// `confusableHints` — says it may have meant `°total`. Same table and same words
// as crates/zymbol-analyzer/src/confusables.rs; `checkSource`, which a terminal
// uses, must never give the hint.

import { confusableHints, checkSource } from '../src/zymbol/zymbol.js';

let failures = 0;
function check(what, ok, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${what}${ok ? '' : `  ${detail}`}`);
  if (!ok) failures++;
}

const one = confusableHints('@ i:1..3 {\n    ºtotal += i\n}\n');
check('º for ° is named, with the name it may have meant', one.length === 1 &&
  one[0].message === "'º' (U+00BA) looks like '°' (U+00B0) — did you mean '°total'?",
  JSON.stringify(one));
check('…on the character itself', one[0]?.line === 2 && one[0]?.col === 5, JSON.stringify(one[0]));
check('…as a warning, with a catalogue code', one[0]?.severity === 'warning' && one[0]?.code === 'W_CONFUSABLE');

check('a Greek ο inside a Latin name warns', confusableHints('contadοr = 1\n').length === 1);
check('a Greek word does not', confusableHints('λόγος = 1\n').length === 0);
check('a name that mixes scripts on purpose does not', confusableHints('πλ_el = 1\n言語_English = 2\n').length === 0);
check('the Catalan middle dot does not', confusableHints('col·lecció = 1\n').length === 0);
check('a string is not a name', confusableHints('>> "ºtotal" ¶\n').length === 0);

const all = '＠a = 1\n？a = 2\n！a = 3\n＃a = 4\n¿a = 5\n¡a = 6\n§a = 7\n•a = 8\n¹a = 9\nⁿa = 10\nªa = 11\nᵒa = 12\nₒa = 13\n∘a = 14\n◦a = 15\n';
check('each of the symbol look-alikes warns once', confusableHints(all).length === 15, confusableHints(all).length);

check('checkSource — what a terminal sees — gives no hint',
  !checkSource('ºtotal = 1\n>> ºtotal ¶\n').diagnostics.some(d => d.code === 'W_CONFUSABLE'));

console.log(failures ? `\n✗ ${failures} failure(s)` : '\n✓ confusable-character hints');
process.exit(failures ? 1 : 0);
