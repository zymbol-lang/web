#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// What the language switcher is actually offering.
//
//   node tools/audit_i18n.mjs            every language, worst first
//   node tools/audit_i18n.mjs --region americas
//   node tools/audit_i18n.mjs --lang nahuatl --verbose
//
// `i18n.json` carries 119 languages and the chip bar offers all of them, so the site makes
// 119 promises. Nothing has ever checked whether they are kept: a browser renders a chip
// that hands back English exactly as happily as one that hands back Quechua, and the reader
// who would notice is the one reader who never files a bug about it.
//
// This is not a gate. It cannot be: it would be red for most of the file on the day it was
// written, and a permanently red gate is one nobody reads. It is a map — it says which
// languages are worth trusting and which need a speaker. The same checks ARE enforced, as a
// gate, on the languages that carry an `atlas` block, because those claim to be finished:
// see tests/test_i18n_atlas.mjs.
//
// The four signals, in the order they matter:
//
//   english     an `ops` value that is the English word itself. Sixteen of sixteen means the
//               entry is a placeholder wearing a language's name.
//   dup         one word doing two jobs — `mahi` for both *return* and *length*. Two
//               concepts collapsed into one is a translation that has stopped distinguishing.
//   leak        Spanish or English function words inside prose that is supposed to be
//               neither: "Cada construcción es un símbolo en Nāhuatl" is a Spanish sentence
//               sitting in the Nahuatl entry.
//   no-bcp47    no entry in src/i18n/detect.js, so <html lang> comes out as the raw id,
//               which is not a valid language tag. Only matters once the language is real.
//
// Every signal is a heuristic and says "look here", not "this is wrong". Read the strings.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LANG_BCP47 } from '../src/i18n/detect.js';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const argv = process.argv.slice(2);
const opt = (name, def = null) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? def : (argv[i + 1] ?? true);
};
const VERBOSE = argv.includes('--verbose');

const data = JSON.parse(readFileSync(join(WEB_DIR, 'data/i18n/i18n.json'), 'utf8'));
const i18n = data.languages;
const review = (() => {
  try { return JSON.parse(readFileSync(join(WEB_DIR, 'data/i18n/atlas-review.json'), 'utf8')).languages; }
  catch { return {}; }
})();
const chips = new Set(
  JSON.parse(readFileSync(join(WEB_DIR, 'data/i18n/languages.json'), 'utf8')).languages.map(l => l.id));

// Function words, not content words: `símbolo` and `symbol` are shared across half these
// languages and would fire on everything. `Cada construcción es un` does not.
const LEAK_ES = /\b(cada|construcci[oó]n|es un|es una|en el|en la|de la|del |para |con el|los |las |sistema de tipos|en lugar de)\b/i;
// English *syntax*, not English loanwords. The bare concept nouns were in here — `loop`,
// `input`, `output`, `match`, `variable` — and they are the ordinary word in half of Europe:
// Swedish says `loop`, Italian says `input`, German says `Variable`. They were reporting
// correct prose as a leak, which is how a map teaches people to stop reading it. The `ops`
// signal already covers a concept name left in English, and that is the right place for it.
// `keyword` was in here and came out: it is a loanword in Tagalog and elsewhere, so the
// probe reported `Walang mga keyword` — ordinary Taglish, and the front page's own
// uncorrected claim — as an English leak. The claim itself is guarded properly and without
// vocabulary by tests/test_i18n_atlas.mjs, which compares the atlas headline against the
// entry's own `t1`. This probe is for English *syntax* and should stay that.
const LEAK_EN = /\b(the |and |every |is a |nothing to|in any language|per language)\b/i;

// A Romance language shares those function words with Spanish by descent, so the Spanish
// probe fires on all of them and means nothing. It was reporting four "leaks" in the
// Portuguese entry, every one of them ordinary Portuguese.
const ROMANCE = new Set(['spanish', 'castellano', 'portuguese', 'portugues_eu', 'french',
                         'italian', 'romanian', 'catalan', 'galician', 'haitian_creole',
                         'interlingua', 'esperanto', 'ido',
                         // Not Romance, but three centuries of Spanish borrowing put the
                         // same function words in them: `para`, `pero`, `kung`. The probe
                         // was reporting ordinary Tagalog as a Spanish leak.
                         'tagalog', 'cebuano', 'chavacano']);

// And the same trap on the other side: an English-lexified creole is *made of* English
// function words, so the English probe fires on correct Patwa and means nothing there. The
// `ops` signal still works — it is what took Jamaican Patois from 15 English concept names
// to one, and that one is `if`, which is the Patwa word too.
const ENGLISH_LEXIFIED = new Set(['jamaican_patois', 'nigerian_pidgin', 'tok_pisin']);

// `fn` is "lambda" in every entry in the file — it is a borrowed term, not an untranslated
// one — so counting it would put a point on all 119 and distinguish none of them.
const OPS_LOANWORD = new Set(['fn']);

/** Below this many English concept names, the finding has always been a cognate. */
const ENGLISH_SIGNAL = 3;

// Structural fields, not strings a reader sees. Counting them reported two "missing" keys
// on almost every language, which is noise that hides the entries really missing prose.
const NOT_PROSE = new Set(['ops', 'op_examples', 'regions', 'region', 'subregions',
                           'subregion', 'rtl', 'atlas', 'atlas_alias']);

/** The prose fields — the ones a reader actually reads as sentences. */
const PROSE = ['t1', 't2', 'desc', 'f1_title', 'f1_desc', 'f2_title', 'f2_desc',
               'f3_title', 'f3_desc', 'feat_title', 'feat_desc', 'ops_title', 'ops_desc',
               'alpha_msg', 'manual_sub'];

const enOps = i18n.english.ops ?? {};
const enKeys = Object.keys(i18n.english);

function audit(id) {
  const e = i18n[id];
  const ops = e.ops ?? {};

  const english = id === 'english' ? [] : Object.keys(enOps).filter(
    k => !OPS_LOANWORD.has(k) &&
         String(ops[k] ?? '').trim().toLowerCase() === String(enOps[k] ?? '').trim().toLowerCase());

  const byValue = new Map();
  for (const [k, v] of Object.entries(ops)) {
    const key = String(v).trim().toLowerCase();
    if (!key) continue;
    (byValue.get(key) ?? byValue.set(key, []).get(key)).push(k);
  }
  const dup = [...byValue.entries()].filter(([, ks]) => ks.length > 1);

  const leak = [];
  for (const f of PROSE) {
    const v = e[f];
    if (typeof v !== 'string') continue;
    if (!ROMANCE.has(id) && LEAK_ES.test(v)) leak.push([f, 'es', v]);
    if (id !== 'english' && !ENGLISH_LEXIFIED.has(id) && LEAK_EN.test(v)) leak.push([f, 'en', v]);
  }

  const missing = enKeys.filter(k => !NOT_PROSE.has(k) && !(k in e));
  const blank = Object.keys(e).filter(k => typeof e[k] === 'string' && e[k].trim() === '');

  return {
    id,
    chip: chips.has(id),
    atlas: Boolean(e.atlas) || Boolean(e.atlas_alias),
    bcp47: Boolean(LANG_BCP47[id]),
    english, dup, leak, missing, blank,
    // Worst first. English placeholders dominate: an entry that is 16/16 English is not a
    // translation at all, whatever else it scores.
    //
    // One or two English concept names is not a signal, it is a cognate — and every single
    // time this fired at that level the word turned out to be right: German `Variable`,
    // Italian `input`, Danish `match`, Swedish `loop`, Catalan `constant`. Eleven European
    // entries were being flagged for correct vocabulary, which is how a map teaches people
    // to stop reading it. The count is still printed; it just stops driving "look here"
    // below the level where it has ever meant anything.
    score: (english.length >= ENGLISH_SIGNAL ? english.length * 10 : 0)
           + dup.length * 4 + leak.length * 2 + missing.length,
  };
}

const wantRegion = opt('region');
const wantLang = opt('lang');
let ids = Object.keys(i18n);
if (wantLang) ids = ids.filter(id => id === wantLang);
if (wantRegion) ids = ids.filter(id => {
  const e = i18n[id];
  const r = Array.isArray(e.regions) ? e.regions : [e.region];
  return r.includes(wantRegion);
});

const rows = ids.map(audit).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${pad('language', 18)}${pad('eng', 5)}${pad('dup', 5)}${pad('leak', 6)}${pad('miss', 6)}${pad('flags', 22)}`);
console.log('─'.repeat(62));
for (const r of rows) {
  const flags = [
    r.atlas ? 'atlas' : '',
    r.chip ? '' : 'no-chip',
    r.bcp47 ? '' : 'no-bcp47',
    r.blank.length ? `${r.blank.length} blank` : '',
    // How many computing terms had to be coined rather than sourced. It is the closest
    // thing here to "how much of this needs a speaker", and it is a count of listed
    // words rather than an opinion — data/i18n/atlas-review.json names every one.
    // coined/attested. Where the first number leads, the entry is a draft with the shape
    // of the language and mostly invented nouns — which is a different thing from a
    // translation, and the only place it is written down.
    review[r.id] && Object.keys(review[r.id].coined ?? {}).length
      ? `${Object.keys(review[r.id].coined).length}c/${(review[r.id].attested ?? []).length}a` : '',
  ].filter(Boolean).join(' ');
  const n = v => (v ? String(v) : '·');
  console.log(pad(r.id, 18) + pad(n(r.english.length), 5) + pad(n(r.dup.length), 5) +
              pad(n(r.leak.length), 6) + pad(n(r.missing.length), 6) + pad(flags, 22));
  if (VERBOSE) {
    for (const [word, keys] of r.dup) console.log(`      dup  ${JSON.stringify(word)} = ${keys.join(' + ')}`);
    for (const [f, lang, v] of r.leak) console.log(`      ${lang}   ${f}: ${JSON.stringify(v.slice(0, 92))}`);
    if (r.english.length) console.log(`      eng  ops still English: ${r.english.join(' ')}`);
  }
}

const bad = rows.filter(r => r.score > 0);
console.log('─'.repeat(62));
console.log(`${rows.length} language(s) · ${rows.length - bad.length} clean · ${bad.length} with something to look at`);
console.log(`${rows.filter(r => r.english.length >= 12).length} entry(ies) whose concept names are still English`);
const coined = rows.reduce((n, r) => n + Object.keys(review[r.id]?.coined ?? {}).length, 0);
console.log(`${rows.filter(r => r.atlas).length} carry an index3 atlas block · ${coined} coined term(s) awaiting a speaker\n`);
