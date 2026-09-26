#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The completeness gate for the playground's translations.
//
//   node tests/test_i18n_playground.mjs
//
// A half-translated interface is worse than an untranslated one: the reader cannot tell
// which parts are their language and which are a fallback, so every English sentence reads
// as something the playground failed to say rather than something nobody wrote yet. This
// is the check that keeps that from shipping — a locale is listed in PUBLISHED only if it
// answers every key the base catalogue asks.
//
// It follows the shape the project publishes for Zymbol applications in
// zymbol-design/USERAPPI18N.md §10: walk catalogue × locales, and make "translation == key"
// mean "never translated" by giving every key a domain prefix.
//
// It also guards two derivations that no browser will ever complain about:
//
//   langs.json     derived from data/i18n/{i18n,languages}.json by
//                  tools/gen_playground_langs.mjs, committed rather than built. Editing
//                  either source without re-running the script leaves the playground
//                  showing last month's language list.
//   index.html     the pre-paint <script> that sets <html lang> cannot import
//                  src/i18n/detect.js — a module script is deferred by definition — so it
//                  carries its own copy of the language tables. The two copies had already
//                  drifted once, each missing four locale codes the other had.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { PUBLISHED, BASE_LOCALE } from '../src/i18n/i18n.js';
import { BROWSER_LANG_MAP, LANG_BCP47 } from '../src/i18n/detect.js';
import { deriveLangs } from '../tools/gen_playground_langs.mjs';
import { SYMBOLS, GROUPS } from '../src/playground/symbols.js';
import { checkSource } from '../src/zymbol/zymbol.js';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const CAT_DIR = join(WEB_DIR, 'data/i18n/playground');

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}
function section(name) { console.log(`\n${name}`); }

const readJson = p => JSON.parse(readFileSync(p, 'utf8'));

/** Same flattening the dispatcher uses: nested for editing, flat for lookup. */
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('_')) continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

// ─── the catalogues exist and are what PUBLISHED claims ──────────────────────
section('published locales');

check(`${BASE_LOCALE} is published`, PUBLISHED.includes(BASE_LOCALE),
      'the base locale is the fallback for every other one; it cannot be absent');

const onDisk = readdirSync(CAT_DIR)
  .filter(f => f.endsWith('.json') && f !== 'langs.json')
  .map(f => f.replace(/\.json$/, ''));

for (const id of PUBLISHED) {
  check(`${id} has a catalogue`, onDisk.includes(id), `expected data/i18n/playground/${id}.json`);
}
for (const id of onDisk) {
  check(`${id}.json is listed in PUBLISHED`, PUBLISHED.includes(id),
        'a catalogue nobody can select is dead weight — list it in src/i18n/i18n.js or delete it');
}

// ─── every published locale answers every key ────────────────────────────────
section('completeness');

const base = flatten(readJson(join(CAT_DIR, `${BASE_LOCALE}.json`)));
const baseKeys = Object.keys(base).sort();
check('the base catalogue has keys', baseKeys.length > 100, `${baseKeys.length} keys`);

for (const key of baseKeys) {
  check(`${key} is domain-prefixed`, key.includes('.'),
        'a bare key can equal its own translation, which defeats this whole test');
  check(`${key} has a non-empty base string`, typeof base[key] === 'string' && base[key].trim() !== '');
}

for (const id of PUBLISHED) {
  if (id === BASE_LOCALE) continue;
  const loc = flatten(readJson(join(CAT_DIR, `${id}.json`)));

  const missing = baseKeys.filter(k => !(k in loc));
  check(`${id} answers every key`, missing.length === 0,
        `${missing.length} missing: ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''}`);

  const extra = Object.keys(loc).filter(k => !(k in base));
  check(`${id} has no keys the base lacks`, extra.length === 0,
        `${extra.length} orphan: ${extra.slice(0, 8).join(', ')}${extra.length > 8 ? ' …' : ''}`);

  // Same string as English is legitimate for a few things — an operator spelled out, a
  // proper noun. What it must never be is the *key*, which is the untranslated marker.
  const isKey = Object.keys(loc).filter(k => loc[k] === k);
  check(`${id} has no key-as-translation`, isKey.length === 0, isKey.join(', '));

  const empty = Object.keys(loc).filter(k => typeof loc[k] !== 'string' || loc[k].trim() === '');
  check(`${id} has no empty strings`, empty.length === 0, empty.join(', '));

  // A placeholder dropped in translation is a sentence that renders with a hole in it.
  for (const k of baseKeys) {
    if (!(k in loc)) continue;
    const want = [...String(base[k]).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();
    const got  = [...String(loc[k]).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();
    check(`${id} ${k} keeps its placeholders`, want.join(',') === got.join(','),
          `base: {${want.join('} {')}}  ${id}: {${got.join('} {')}}`);
  }
}

// ─── the catalogue covers what the playground asks for ───────────────────────
section('catalogue covers the code');

for (const card of Object.values(SYMBOLS)) {
  check(`sym.${card.id} has a concept`, `sym.${card.id}.concept` in base);
  check(`sym.${card.id} has a summary`, `sym.${card.id}.summary` in base);
}
for (const g of GROUPS) {
  check(`sym.group.${g} is named`, `sym.group.${g}` in base);
}

// Every sym.* card in the catalogue must belong to a real symbol, or it is prose nobody
// will ever see.
const cardIds = new Set(Object.values(SYMBOLS).map(c => c.id));
for (const key of baseKeys) {
  const m = /^sym\.([^.]+)\.(concept|summary)$/.exec(key);
  if (m) check(`sym.${m[1]} belongs to a real symbol`, cardIds.has(m[1]),
               'no entry in SYMBOLS uses this id');
}

// ─── langs.json is the derivation it claims to be ────────────────────────────
section('langs.json is up to date');

const langsPath = join(CAT_DIR, 'langs.json');
check('langs.json exists', existsSync(langsPath), 'run: node tools/gen_playground_langs.mjs');

if (existsSync(langsPath)) {
  const committed = readJson(langsPath);
  const derived = deriveLangs(
    readJson(join(WEB_DIR, 'data/i18n/i18n.json')),
    readJson(join(WEB_DIR, 'data/i18n/languages.json')));

  check('langs.json matches its sources',
        JSON.stringify(committed) === JSON.stringify(derived),
        'data/i18n/i18n.json or languages.json changed — re-run: node tools/gen_playground_langs.mjs');

  for (const id of PUBLISHED) {
    check(`${id} appears in langs.json`, id in committed.languages,
          'a published locale with no native name cannot be shown in the picker');
  }
  for (const [id, meta] of Object.entries(committed.languages)) {
    check(`${id} has a native name`, Boolean(meta.native));
    check(`${id} has a direction`, meta.dir === 'ltr' || meta.dir === 'rtl', `dir: ${meta.dir}`);
    check(`${id} has the 16 concept labels`, Object.keys(meta.ops ?? {}).length === 16,
          `${Object.keys(meta.ops ?? {}).length} labels`);
  }
}

// ─── index.html's pre-paint copy still agrees with detect.js ─────────────────
section('pre-paint tables (index.html, overview.html)');

/** Reads one object literal out of a page's inline script, by name. */
function inlineTable(html, name) {
  const at = html.indexOf(`var ${name} = {`);
  if (at === -1) return null;
  const open = html.indexOf('{', at);
  const close = html.indexOf('};', open);
  if (close === -1) return null;
  // Object literal with unquoted keys — JSON.parse will not take it, and there is no
  // parser to hand in a no-dependency directory.
  // eslint-disable-next-line no-new-func
  return new Function(`return ${html.slice(open, close + 1)}`)();
}

// Two pages carry the copy now: overview.html — the former front page, kept archived —
// offers the same 119 languages from the same chip bar as index.html, so it needs the same
// tables before its own first paint. Two copies of a table that already drifted once are two
// chances to drift, so both are checked, not one.
const diff = (a, b, an, bn) => {
  const onlyA = Object.keys(a).filter(k => !(k in b));
  const onlyB = Object.keys(b).filter(k => !(k in a));
  const differ = Object.keys(a).filter(k => k in b && a[k] !== b[k]);
  check(`${an} and ${bn} have the same keys`, onlyA.length === 0 && onlyB.length === 0,
        `only in ${an}: ${onlyA.join(' ') || '—'} | only in ${bn}: ${onlyB.join(' ') || '—'}`);
  check(`${an} and ${bn} agree on every value`, differ.length === 0, differ.join(' '));
};

for (const page of ['index.html', 'overview.html']) {
  const src = readFileSync(join(WEB_DIR, page), 'utf8');
  const inlineLocale = inlineTable(src, 'LOCALE_MAP');
  const inlineBcp47  = inlineTable(src, 'BCP47');

  check(`${page} still has LOCALE_MAP`, inlineLocale !== null);
  check(`${page} still has BCP47`, inlineBcp47 !== null);
  if (!inlineLocale || !inlineBcp47) continue;

  diff(BROWSER_LANG_MAP, inlineLocale, 'detect.js BROWSER_LANG_MAP', `${page} LOCALE_MAP`);
  diff(LANG_BCP47, inlineBcp47, 'detect.js LANG_BCP47', `${page} BCP47`);
}

// ─── every diagnostic the engine emits reaches the panel as words ──────────────
//
// The Problems panel renders `chk.<code>`, and a code with no entry used to be
// shown as the key itself — `chk.W_NO_EFFECT` — for 19 of the checker's 28
// codes (ZYJS-023). It now falls back to the engine's English message, so every
// code needs an entry OR a place in this list, with the reason a template does
// not fit: each of these emits several different sentences under one code.
section('checker codes vs the catalogue');
{
  const ENGINE_WORDS = {
    E_ARRAY_MIX:      'three sentences (element mix, append, write), none with params',
    E_NAME:           'four sentences, each with its own help naming a line',
    W_NO_EFFECT:      'a name read and discarded, or a consulting $ operator',
    W_UNARY_TYPE:     'unary +/- and logical not are worded apart',
    W_DESTRUCT_SHAPE: 'the pattern, what it accepts and what it got, no params',
    W_MIX_UNNEEDED:   'names the element type in the sentence, no params',
    E_HOF_ARITY:      'map, filter and reduce are worded apart, each with its own count',
  };
  const engineSrc = readFileSync(join(WEB_DIR, 'src/zymbol/zymbol.js'), 'utf8');
  const emitted = new Set([...engineSrc.matchAll(/this\.(?:warn|error)\('([A-Z0-9_]+)'/g)].map(m => m[1]));
  for (const code of emitted) {
    check(`checker code ${code} has a catalogue entry or a declared reason`,
      (`chk.${code}` in base) || code in ENGINE_WORDS);
  }
  for (const code of Object.keys(ENGINE_WORDS)) {
    check(`ENGINE_WORDS lists ${code}, which the checker still emits`, emitted.has(code));
    check(`ENGINE_WORDS lists ${code}, which now has an entry — take it off the list`, !(`chk.${code}` in base));
  }
}

// ─── one code, one sentence ───────────────────────────────────────────────────
//
// The panel shows `chk.<code>`, not the engine's message. A code that two
// different failures share therefore shows the catalogued sentence for BOTH, and
// one of them is told something false: `'x' is read from outside this function`
// was shown as "cannot access underscore variable 'x' from inner scope", and
// `constant 'K' already declared` as "cannot reassign constant 'K'" (ZYJS-031).
// Any code with a catalogue entry must be emitted with a single sentence — the
// first literal of its message, placeholders aside.
section('one code, one sentence');
{
  const engineSrc = readFileSync(join(WEB_DIR, 'src/zymbol/zymbol.js'), 'utf8');
  const call = /this\.(?:warn|error)\(\s*'([A-Z0-9_]+)',\s*(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/gs;
  const sentences = new Map();
  for (const m of engineSrc.matchAll(call)) {
    const text = m[2].slice(1, -1).replace(/\$\{[^}]*\}/g, '§');
    if (!sentences.has(m[1])) sentences.set(m[1], new Set());
    sentences.get(m[1]).add(text);
  }
  for (const [code, set] of sentences) {
    if (!(`chk.${code}` in base)) continue;     // no entry: the engine's own words are shown
    check(`checker code ${code} has a catalogue entry and one sentence (${set.size})`, set.size === 1);
  }

  // And the three that were wrong, rendered the way the panel renders them.
  const render = d => base[`chk.${d.code}`].replace(/\{(\w+)\}/g, (m, k) => d.params?.[k] ?? m);
  for (const [src, code] of [
    ['x = 1\nf() { <~ x }\n>> f() ¶\n', 'E_SCOPE_FN'],
    ['K := 1\nK := 2\n>> K ¶\n',        'E_CONST_REDECL'],
    ['@ i:1..2 { cuenta = i }\n>> °cuenta ¶\n', 'E_HOT_OUTPUT'],
  ]) {
    const d = checkSource(src).diagnostics.find(x => x.code === code);
    check(`${code}: the panel says what the engine says`, d && render(d) === d.message,
          d ? `panel ${JSON.stringify(render(d))} engine ${JSON.stringify(d.message)}` : 'not emitted');
  }
}

// ─── report ──────────────────────────────────────────────────────────────────
console.log('');
console.log(failures === 0
  ? `✓ i18n: ${PUBLISHED.length} locale(s) × ${baseKeys.length} keys, complete`
  : `✗ ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
