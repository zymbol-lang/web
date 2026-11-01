#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The v0.0.11 manual list, and the fallback that lets it grow one language at a time.
//
//   node tests/test_manual_v0011.mjs
//
// The front page shows the v0.0.11 manual where it is written and the v0.0.9 one, in the
// same language, where it is not yet. Both lists are hand-written in src/site/manual.js —
// for the reasons tests/test_manual_v009.mjs gives — so this holds V0011_CODES to its
// directory in both directions, and holds the fallback to its one promise: a reader is
// never handed another language's manual.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  MANUAL_MAP, V009_CODES, V0011_CODES, MANUAL_DIR_V009, MANUAL_DIR_V0011, manualUrl,
} from '../src/site/manual.js';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const DIR     = join(WEB_DIR, MANUAL_DIR_V0011);

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) { failures++; console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`); }
}
function section(name) { console.log(`\n${name}`); }

// ─── the list and the directory answer each other ────────────────────────────
section('the list ↔ the directory');

const PUBLISHED = /^manual_([a-z]{2,3}(?:_[a-z]{2,3})?)\.md$/;
const onDisk = readdirSync(DIR)
  .filter(f => PUBLISHED.test(f))
  .map(f => PUBLISHED.exec(f)[1])
  .sort();
console.log(`  ${onDisk.length} published`);

const listed = [...V0011_CODES].sort();
const unwritten = listed.filter(c => !onDisk.includes(c));
const unlisted  = onDisk.filter(c => !listed.includes(c));

check('every listed code has a file', unwritten.length === 0,
      unwritten.length ? `V0011_CODES names ${unwritten.join(', ')} — the section would 404 for those readers` : '');
check('every file is listed', unlisted.length === 0,
      unlisted.length ? `written but nobody is shown it: ${unlisted.join(', ')} — add to V0011_CODES in src/site/manual.js` : '');
check('V0011_CODES has no duplicate', new Set(V0011_CODES).size === V0011_CODES.length);

// A revision is a revision of something: a v0.0.11 manual with no v0.0.9 one behind it was
// translated from scratch, outside the queue and outside the gates' reference.
for (const code of listed) {
  check(`${code} has a v0.0.9 manual it was revised from`, V009_CODES.includes(code));
}

// ─── which manual a reader gets ──────────────────────────────────────────────
section('the fallback');

for (const code of listed) {
  const lang = Object.keys(MANUAL_MAP).find(id => MANUAL_MAP[id] === code);
  check(`${code} is some language's manual`, Boolean(lang), 'no entry in MANUAL_MAP points at it');
  if (lang) check(`${lang} gets the v0.0.11 manual`, manualUrl(lang) === `${MANUAL_DIR_V0011}/manual_${code}.md`,
                  String(manualUrl(lang)));
}
check('castellano gets the v0.0.11 Spanish manual (a second id for one manual)',
      !listed.includes('es') || manualUrl('castellano') === `${MANUAL_DIR_V0011}/manual_es.md`,
      String(manualUrl('castellano')));

// Derived, never hand-listed — see the note in test_manual_v009.mjs about `arabic`.
const pending = Object.keys(MANUAL_MAP).filter(id => {
  const c = MANUAL_MAP[id];
  return V009_CODES.includes(c) && !V0011_CODES.includes(c);
});
for (const lang of pending.slice(0, 4)) {
  check(`${lang} falls back to its own v0.0.9 manual`,
        manualUrl(lang) === `${MANUAL_DIR_V009}/manual_${MANUAL_MAP[lang]}.md`, String(manualUrl(lang)));
}
const neither = Object.keys(MANUAL_MAP).filter(id => !V009_CODES.includes(MANUAL_MAP[id]));
for (const lang of neither.slice(0, 4)) {
  check(`${lang} gets nothing (never another language)`, manualUrl(lang) === null, String(manualUrl(lang)));
}

// ─── each published manual is what it says it is ─────────────────────────────
section('the manuals themselves');

for (const code of onDisk) {
  const text = readFileSync(join(DIR, `manual_${code}.md`), 'utf8');
  check(`manual_${code}.md declares CC-BY-SA-4.0`, text.includes('SPDX-License-Identifier: CC-BY-SA-4.0'));
  // The version and the date share the header line, in the language's own word order:
  // 「针对 v0.0.11 修订 — 2026-10-28」 puts a word between them, Hindi a whole phrase, and
  // Bengali writes the date itself in its own digits (२०२६ style), hence \p{Nd} and not \d.
  check(`manual_${code}.md is the v0.0.11 revision`, /^>.*\bv0\.0\.11\b.*\p{Nd}{4}-\p{Nd}{2}-\p{Nd}{2}/mu.test(text),
        'the header line that names the revision is missing or names another version');
  check(`manual_${code}.md carries the AI disclaimer`, /^>\s\*\*(Disclaimer|Aviso)/m.test(text));
  const fenced = (text.match(/^```zymbol$/gm) ?? []).length;
  check(`manual_${code}.md has its zymbol blocks fenced as such`, fenced > 50, `${fenced} found`);
  // An unclosed fence swallows the prose after it and no structural gate sees it — the
  // German v0.0.9 manual lost nine lines that way. Openings and closings must pair.
  const opens  = (text.match(/^```[a-z]+$/gm) ?? []).length;
  const closes = (text.match(/^```$/gm) ?? []).length;
  check(`manual_${code}.md closes every fence it opens`, opens === closes, `${opens} opened, ${closes} closed`);
}

// ─── the page asks for the right one ─────────────────────────────────────────
section('the front page wires it up');

const atlas = readFileSync(join(WEB_DIR, 'src/site/atlas.js'), 'utf8');
check('atlas.js resolves the manual with manualUrl (v0.0.11, then v0.0.9)',
      /manualUrl\(langId\)/.test(atlas) && !/manualUrlV009\(langId\)/.test(atlas));

console.log(`\n${onDisk.length} v0.0.11 manual(s) · ${pending.length} language id(s) still on v0.0.9`);
console.log(failures ? `\n✗ ${failures} failure(s)` : '\n✓ the v0.0.11 manual list matches the directory');
process.exit(failures ? 1 : 0);
