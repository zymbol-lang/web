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
const perChar = src => confusableHints(src).filter(d => d.code === 'W_CONFUSABLE');
check('each of the symbol look-alikes warns once', perChar(all).length === 15, perChar(all).length);

// Two whole names that look the same (D-21, decided 2026-11-24), as the
// language server's `look_alike_names` says it.
const names = src => confusableHints(src).filter(d => d.code === 'W_CONFUSABLE_NAME');
const two = names('a = 1\n\u0430 = 2\n>> a " " \u0430 \u00b6\n');
check('Latin a, then Cyrillic а: the later one is named with the earlier', two.length === 1 &&
  two[0].message === "'\u0430' looks like 'a' (line 1), a different name: it has U+0430 where 'a' has U+0061" &&
  two[0].line === 2 && two[0].severity === 'warning', JSON.stringify(two));
check('a name after . or :: is left out — the Greek layer\'s mat.E => Ε',
  names('# m {\n    <# std/math => mat\n    #> { mat.E => \u0395 }\n}\n').length === 0);
check('the same name twice does not warn', names('x = 1\nx = 2\n').length === 0);
check('a name typed decomposed is placed where it is typed (D-20)',
  names('q\u0397\u0300 = 1\nq\u041d\u0300 = 2\n')[0]?.line === 2);
check('checkSource gives no look-alike names either',
  !checkSource('a = 1\n\u0430 = 2\n>> a \u0430 \u00b6\n').diagnostics.some(d => d.code === 'W_CONFUSABLE_NAME'));

check('checkSource — what a terminal sees — gives no hint',
  !checkSource('ºtotal = 1\n>> ºtotal ¶\n').diagnostics.some(d => d.code === 'W_CONFUSABLE'));

console.log(failures ? `\n✗ ${failures} failure(s)` : '\n✓ confusable-character hints');
process.exit(failures ? 1 : 0);
