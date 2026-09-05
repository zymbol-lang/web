#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The gate for index3.html's translations.
//
//   node tests/test_i18n_atlas.mjs
//
// index3's strings live in `data/i18n/i18n.json`, on an `atlas` block of each language
// entry, next to the front page's — one file, one language list, one selector. A language
// that has no `atlas` block yet falls back to English key by key, exactly as the manual
// does; that is the site's policy and this test does not fight it. What it will not allow:
//
//   a key with no string      the page renders the key name at the reader
//   a string with no key      a translated sentence nothing on the page ever shows: it was
//                             written, the markup moved on, and nobody found out
//   a half-done language      a language that HAS an `atlas` block answers every key the
//                             English one does. Opting in is the promise; this keeps it
//   a translated capture      the sample program, its output and the terminal frames are
//                             the page's evidence, and translating evidence is redrawing it
//
// The pre-paint <html lang> tables index3 now carries are checked by
// tests/test_i18n_playground.mjs, against src/i18n/detect.js, for both pages at once.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { digitValue } from '../src/zymbol/zymbol.js';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const PAGE    = join(WEB_DIR, 'index3.html');
const SCRIPT  = join(WEB_DIR, 'src/site/atlas.js');
const BASE_LOCALE = 'english';

/** The four keys index3 takes from the top level of an entry rather than from `atlas`,
 *  because the front page already says them in all 119 languages. Kept in step with
 *  stringsFor() in src/site/atlas.js. */
const SHARED = {
  'nav.home':   'nav_home',
  'nav.try':    'nav_try_online',
  'alpha.msg':  'alpha_msg',
  'alpha.link': 'alpha_link',
};

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}
function section(name) { console.log(`\n${name}`); }

/** Nested for editing, flat for lookup — the same flattening the page does. */
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const i18n = JSON.parse(readFileSync(join(WEB_DIR, 'data/i18n/i18n.json'), 'utf8')).languages;
const page   = readFileSync(PAGE, 'utf8');
const script = readFileSync(SCRIPT, 'utf8');

// ─── the base block ──────────────────────────────────────────────────────────
section('the base block');

check(`${BASE_LOCALE} has an atlas block`, Boolean(i18n[BASE_LOCALE]?.atlas),
      'it is the fallback for every key of every other language — it cannot be absent');

const base = flatten(i18n[BASE_LOCALE]?.atlas);
const baseKeys = Object.keys(base).sort();
check('the base block has keys', baseKeys.length > 50, `${baseKeys.length} keys`);

for (const [ours, theirs] of Object.entries(SHARED)) {
  check(`${BASE_LOCALE} has ${theirs} (index3 reads it as ${ours})`,
        typeof i18n[BASE_LOCALE]?.[theirs] === 'string' && i18n[BASE_LOCALE][theirs].trim() !== '');
}

// ─── page and catalogue answer each other ────────────────────────────────────
section('index3.html ↔ the catalogue');

const used = new Set();
for (const m of page.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) used.add(m[1]);
for (const m of page.matchAll(/data-i18n-attr="([^"]+)"/g)) {
  for (const pair of m[1].split(';')) {
    const i = pair.indexOf(':');
    if (i > 0) used.add(pair.slice(i + 1).trim());
  }
}
// The keys the script builds rather than the markup: the mark grid's labels and notes,
// derived from the buttons' own data-mk, and the two <head> strings.
for (const m of page.matchAll(/data-mk="([a-z]+)"/g)) {
  used.add(`mark.${m[1]}.name`);
  used.add(`mark.${m[1]}.note`);
}
used.add('title');
used.add('desc');
for (const m of script.matchAll(/\bt\('([a-zA-Z0-9_.]+)'\)/g)) used.add(m[1]);

const unknown = [...used].filter(k => !(k in base) && !(k in SHARED)).sort();
check('every key the page asks for exists', unknown.length === 0,
      unknown.length ? `the page would render these at the reader: ${unknown.join(', ')}` : '');

const unused = baseKeys.filter(k => !used.has(k));
check('every key in the base block is used', unused.length === 0,
      unused.length ? `translated and never shown: ${unused.join(', ')}` : '');

// Every translated element fades with the rest, or the language change happens in two
// stages and half the page visibly lags the other half.
const tags = page.match(/<[a-z0-9]+\b[^>]*\bdata-i18n(?:-html)?="[^"]*"[^>]*>/g) ?? [];
const unfaded = tags.filter(t => !t.includes('fade-target'));
check('every translated element is a fade target', unfaded.length === 0,
      unfaded.slice(0, 3).map(t => t.slice(0, 70)).join('\n      '));

// ─── a language that opted in is finished ────────────────────────────────────
section('languages with an atlas block');

const translated = Object.keys(i18n).filter(id => i18n[id].atlas);

// A language may point at another's block instead of carrying a copy: `castellano` reads
// `spanish`, because es-ES and es-LA say the same things here. Two copies would be two
// things to keep in step, and the drift would be invisible — nobody reads both.
const aliased = Object.entries(i18n).filter(([, e]) => e.atlas_alias);
for (const [id, e] of aliased) {
  check(`${id} may not have both an atlas block and an alias`, !e.atlas,
        'one or the other — an alias next to a block is a block nothing reads');
  check(`${id} aliases a language that has a block`, Boolean(i18n[e.atlas_alias]?.atlas),
        `atlas_alias points at ${JSON.stringify(e.atlas_alias)}`);
  // The four shared keys stay the reader's own, so the alpha notice is still theirs.
  for (const theirs of Object.values(SHARED)) {
    check(`${id} keeps its own ${theirs}`, typeof i18n[id][theirs] === 'string' && i18n[id][theirs].trim() !== '');
  }
}
check('at least one language beyond the base', translated.length > 1, translated.join(', '));

for (const id of translated) {
  const loc = flatten(i18n[id].atlas);

  const missing = baseKeys.filter(k => !(k in loc));
  check(`${id} answers every key`, missing.length === 0,
        missing.length ? `missing ${missing.length}: ${missing.slice(0, 5).join(', ')}` : '');

  const extra = Object.keys(loc).filter(k => !(k in base));
  check(`${id} has no keys the base lacks`, extra.length === 0,
        extra.length ? `extra: ${extra.slice(0, 5).join(', ')}` : '');

  const empty = Object.keys(loc).filter(k => typeof loc[k] !== 'string' || loc[k].trim() === '');
  check(`${id} has no blank string`, empty.length === 0, empty.slice(0, 5).join(', '));

  const isKey = Object.keys(loc).filter(k => loc[k] === k);
  check(`${id} has no key left as its own translation`, isKey.length === 0, isKey.slice(0, 5).join(', '));

  for (const theirs of Object.values(SHARED)) {
    check(`${id} has ${theirs}`, typeof i18n[id][theirs] === 'string' && i18n[id][theirs].trim() !== '',
          'index3 shows it in the nav or the alpha notice');
  }
}

// index3 is the page whose whole argument is the distinction, so its own strings may not
// translate to the claim it corrects — see README, "Known divergence".
//
// This used to be a regex of every language's word for "keyword" — `palabras clave`,
// `palavras-chave`, `mots-clés`, `mo kle`, `llika simi`… It failed to know the new phrase
// four languages running, which is not four oversights: it is the wrong shape of check. A
// list that has to be fed by hand for every language cannot guard a file that is meant to
// grow by language.
//
// The data already knows. Every entry's top-level `t1` is the *uncorrected* claim — that
// is the deliberate hold the README documents, English excepted — so the failure this is
// really guarding against is a translator copying `t1` into the atlas block. Comparing the
// two needs no vocabulary at all, and it works for the hundred languages not written yet.
section('the page does not argue against itself');
for (const id of translated) {
  const loc = flatten(i18n[id].atlas);
  if (id !== BASE_LOCALE) {
    check(`${id} corrects the front page's headline`, loc['hero.t1'] !== i18n[id].t1,
          `atlas hero.t1 and the entry's t1 are both ${JSON.stringify(i18n[id].t1)} — index3 ` +
          `says "no words" where the front page still says "no keywords"`);
  }
  // The claim is made twice on the page: the headline, and the sentence under it that
  // strikes the rejected version and bolds the exact one. Both halves have to be there and
  // they have to be different, whatever language they are in.
  const sub = loc['html.heroSub'] ?? '';
  const struck = (/<s>([\s\S]*?)<\/s>/.exec(sub)?.[1] ?? '').trim();
  const bolded = (/<b>([\s\S]*?)<\/b>/.exec(sub)?.[1] ?? '').trim();
  check(`${id} strikes a claim in the sub`, struck !== '',
        '<s> is where the rejected version goes');
  check(`${id} bolds a claim in the sub`, bolded !== '',
        '<b> is where the exact version goes');
  check(`${id} does not strike and bold the same words`, struck !== bolded,
        `both are ${JSON.stringify(struck)}`);
}

// ─── the sample program, one per language ────────────────────────────────────
//
// Section 03 shows a real file and links to the same one. Three things have to hold, and
// none of them is visible on the page: the list the script reads from has to match what is
// on disk, the markup's no-JavaScript copy has to be that file, and the translations have
// to be the same program — identifiers renamed, nothing else.
//
// This section was silently deleted once, by an edit that sliced from one comment to
// another and took everything between them. Nothing went red: the checks simply stopped
// running, which is the failure a gate is least able to report about itself. It came back
// only because a later edit referred to a constant that was no longer there.
section('the sample program');

// An aliased language reads its alias's program too, so it needs no file of its own.
const aliasIds = new Set(aliased.map(([id]) => id));

const SAMPLE_DIR = 'examples/graphics/mandelbrot';
const onDisk = readdirSync(join(WEB_DIR, SAMPLE_DIR))
  .filter(f => f.endsWith('.zy')).map(f => f.replace(/\.zy$/, '')).sort();

const listed = (/const SAMPLE_LANGS = \[([^\]]*)\]/.exec(script)?.[1] ?? '')
  .split(',').map(x => x.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean).sort();

check('SAMPLE_LANGS matches the files on disk',
      listed.join() === onDisk.join(), `atlas.js: ${listed.join(', ')} | disk: ${onDisk.join(', ')}`);

for (const id of translated) {
  if (aliasIds.has(id)) continue;
  check(`${id} has a sample of its own`, onDisk.includes(id),
        `the page would be in ${id} and the program in English — add ${SAMPLE_DIR}/${id}.zy`);
}

/** The program with every name, comment and string taken out: what is left is the marks. */
function skeleton(src) {
  return src
    .replace(/\/\/[^\n]*/g, '')                       // comments
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')              // string literals
    // What the lexer takes in an identifier, twice discovered the hard way rather than
    // assumed. The apostrophe: `sa'ykuéra`, `_ñit'ina`, `k'iche'` all pass `zymbol check`,
    // and leaving it out split every such name into `·'·`, reporting Quechua and Guaraní
    // as different programs from English. Then combining marks: Devanagari `ढाल` is
    // ढ + ा + ल where `ा` is a mark, not a letter, so `\p{L}` alone cut Hindi identifiers
    // in half. `\p{M}` covers the matras, and Thai's vowel signs, and Arabic's diacritics.
    // Then the joiners: Sinhala `පළල්ප්‍රමාණය` carries U+200D inside it — the
    // rakaransaya conjunct is spelled with one — and U+200D is `\p{Cf}`, neither letter
    // nor mark, so the name came apart into `·‍·`. `zymbol run` on that identifier alone
    // prints its value, and splitting it at the joiner is a parse error, so the lexer
    // takes the joiner as part of the name and this must too. U+200C rides along: it is
    // the same kind of character and it is orthographic in Devanagari and Persian.
    // Then, a fourth time, the two classes that are not letters at all. `\p{So}` is the
    // emoji: `🪜 = " .:-=+*#%"` is a binding, and a bare emoji, two in a row, and an
    // underscore plus an emoji all parse and run under both engines. `\p{Co}` is the
    // Private Use Area, which is where the CSUR pIqaD block lives — klingon_piqad.zy is
    // written in it, and klingon_galaxy has been for longer. Neither is exotic here: the
    // Rust lexer admits any character that is not whitespace and not an operator, so the
    // narrow rule was always this file's, never the language's.
    // A fifth time, and the same lesson: the numerals. `zymbol` reads a literal in any of
    // the 69 blocks in `digit_blocks.rs`, so the Hindi program writes `२.७` where the
    // English one writes `2.7` — same value, same program, different script, exactly as
    // `ढाल` and `ramp` are. Leaving the digits verbatim reported all twenty files that
    // write their own numerals as different programs from English.
    //
    // What is normalised is the SCRIPT, never the value: each digit becomes the ASCII
    // digit of the same value, so `२२` and `٢٢` both read as `22` and a file that said
    // 35 where English says 36 is still a different program. Collapsing every literal to
    // one placeholder would have passed this file and stopped testing anything. The value
    // comes from the engine's own `digitValue`, not from a table copied to here — the
    // pIqaD digits live in the PUA, where `\p{Nd}` does not reach, and this is the fifth
    // entry in a list of things a narrower local copy got wrong.
    .replace(/\p{Nd}|[\uf8f0-\uf8f9]/gu, ch => String(digitValue(ch)))  // numerals
    .replace(/[\p{L}\p{So}\p{Co}_][\p{L}\p{M}\p{N}\p{So}\p{Co}_'’\u200c\u200d]*/gu, '·')  // identifiers
    .split('\n').map(l => l.trim().replace(/\s+/g, ' ')).filter(Boolean).join('\n');
}

const sources = Object.fromEntries(
  onDisk.map(id => [id, readFileSync(join(WEB_DIR, SAMPLE_DIR, `${id}.zy`), 'utf8')]));
const baseSkeleton = skeleton(sources[BASE_LOCALE] ?? '');

for (const id of onDisk) {
  if (id === BASE_LOCALE) continue;
  const mine = skeleton(sources[id]);
  const same = mine === baseSkeleton;
  let where = '';
  if (!same) {
    const a = baseSkeleton.split('\n'), b = mine.split('\n');
    const i = a.findIndex((l, k) => l !== b[k]);
    where = `line ${i + 1}: ${BASE_LOCALE} ${JSON.stringify(a[i])} vs ${id} ${JSON.stringify(b[i])}`;
  }
  check(`${id}.zy is the same program as ${BASE_LOCALE}.zy`, same, where);
  check(`${id}.zy keeps the parity marker`, sources[id].includes('@skip-parity'),
        'the canvas has nothing to compare under a pipe — the runner needs to be told');
}

// The markup ships the English file so a reader with no JavaScript still gets a program.
// If the two drift, the page shows one thing and its own link opens another.
const inline = /<pre class="zy[^"]*"[^>]*>([\s\S]*?)<\/pre>/.exec(page)?.[1] ?? '';
const unescape = t => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const bodyOf = src => {
  const lines = src.split('\n');
  let last = -1;
  lines.forEach((l, i) => { if (/^\/\/ =+$/.test(l.trim())) last = i; });
  const body = lines.slice(last + 1);
  while (body.length && !body[0].trim()) body.shift();
  while (body.length && !body[body.length - 1].trim()) body.pop();
  return body.join('\n');
};
check('the inline fallback is the English file, verbatim',
      unescape(inline) === bodyOf(sources[BASE_LOCALE] ?? ''),
      'index3.html carries a copy of the program that no longer matches the file');

// ─── every translation says who still has to read it ─────────────────────────
//
// A language is written here by someone who does not speak it, against what could be
// sourced. Where a computing term could not be, a compound was coined from the language's
// own roots — which reads as fluent to everyone who does not speak it and as nonsense to
// everyone who does. `data/i18n/atlas-review.json` is where that is written down, term by
// term, so a speaker can be handed a list instead of a file. A block with no entry there
// is a translation whose provenance has been lost.
section('review record');

const review = JSON.parse(readFileSync(join(WEB_DIR, 'data/i18n/atlas-review.json'), 'utf8')).languages;
for (const id of translated) {
  const r = review[id];
  check(`${id} has a review record`, Boolean(r),
        'add it to data/i18n/atlas-review.json — coined terms, or an empty list and why');
  if (!r) continue;
  check(`${id}'s record has a note`, typeof r.note === 'string' && r.note.trim() !== '');
  check(`${id}'s coined list is an object`, r.coined && typeof r.coined === 'object' && !Array.isArray(r.coined));
  check(`${id}'s attested list is an array`, Array.isArray(r.attested),
        'the terms taken from the language rather than made here — the other half of the ratio');
  // A coinage claimed in the record has to be a word the language's own program uses,
  // or the record is describing a file that no longer exists.
  const samplePath = join(WEB_DIR, SAMPLE_DIR, `${id}.zy`);
  const src = onDisk.includes(id) ? readFileSync(samplePath, 'utf8') : '';
  for (const term of Object.keys(r.coined ?? {})) {
    check(`${id}: the coined term ${JSON.stringify(term)} appears in its program`,
          src === '' || src.includes(term),
          `atlas-review.json names it, ${SAMPLE_DIR}/${id}.zy does not use it`);
  }
}
for (const id of Object.keys(review)) {
  check(`${id} in the review record has an atlas block`, translated.includes(id) || aliasIds.has(id),
        'a record for a language nobody can select is a record nobody maintains');
}

// ─── what is deliberately not translated ─────────────────────────────────────
section('the evidence stays as it is');
for (const m of page.matchAll(/<pre[^>]*class="(?:zy|fractal|term)[^"]*"[^>]*>/g)) {
  check('no capture or sample is marked for translation', !/data-i18n/.test(m[0]), m[0].slice(0, 80));
}

// ─── verdict ─────────────────────────────────────────────────────────────────
console.log(failures === 0
  ? `\n✓ index3 i18n: ${translated.length} written + ${aliased.length} aliased of ${Object.keys(i18n).length} language(s) × ${baseKeys.length} keys, complete`
  : `\n✗ ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
