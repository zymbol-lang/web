#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The front page's manual section, and the list that decides who sees it.
//
//   node tests/test_manual_v009.mjs
//
// The front page shows the v0.0.9 manual only to readers whose language has one, and it
// decides that from a hand-written list in src/site/manual.js rather than by asking the
// network. That is the right call — a 404 probe paints a heading and takes it away, and it
// makes an offline reader look like an untranslated one — but a hand-written list is
// exactly the kind of thing that drifts from the directory it claims to describe:
//
//   a manual written and not listed   nobody is ever shown it, and nothing looks broken;
//   a code listed and not written     the section appears, the fetch 404s, and the reader
//                                     gets a heading over an empty box.
//
// Both are invisible in a browser set to English. So the list and the directory are
// compared here, in both directions.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MANUAL_MAP, V009_CODES, MANUAL_DIR_V009, manualUrlV009 } from '../src/site/manual.js';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const DIR     = join(WEB_DIR, MANUAL_DIR_V009);

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) { failures++; console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`); }
}
function section(name) { console.log(`\n${name}`); }

// ─── the list and the directory answer each other ────────────────────────────
section('the list ↔ the directory');

// A draft is not a manual. `manual_qu_borrador.md` sits beside the real Quechua one and
// matches any naive glob, so the shape of a published name is stated rather than assumed.
const PUBLISHED = /^manual_([a-z]{2,3}(?:_[a-z]{2,3})?)\.md$/;
const onDisk = readdirSync(DIR)
  .filter(f => PUBLISHED.test(f))
  .map(f => PUBLISHED.exec(f)[1])
  .sort();

const drafts = readdirSync(DIR).filter(f => f.startsWith('manual_') && f.endsWith('.md') && !PUBLISHED.test(f));
console.log(`  ${onDisk.length} published · ${drafts.length} draft(s) ignored${drafts.length ? `: ${drafts.join(', ')}` : ''}`);

const listed = [...V009_CODES].sort();
const unwritten = listed.filter(c => !onDisk.includes(c));
const unlisted  = onDisk.filter(c => !listed.includes(c));

check('every listed code has a file', unwritten.length === 0,
      unwritten.length ? `V009_CODES names ${unwritten.join(', ')} — the section would 404 for those readers` : '');
check('every file is listed', unlisted.length === 0,
      unlisted.length ? `written but nobody is shown it: ${unlisted.join(', ')} — add to V009_CODES in src/site/manual.js` : '');

// ─── a listed code is reachable from a language ──────────────────────────────
section('reachable from the picker');

for (const code of listed) {
  const langs = Object.keys(MANUAL_MAP).filter(id => MANUAL_MAP[id] === code);
  check(`${code} is some language's manual`, langs.length > 0,
        'no entry in MANUAL_MAP points at it, so no reader can ever reach it');
}

// Every published code resolves for at least one language id, and `castellano` is spelled
// out because a second id for one manual is the case a naive lookup drops silently.
for (const code of listed) {
  const lang = Object.keys(MANUAL_MAP).find(id => MANUAL_MAP[id] === code);
  const url = manualUrlV009(lang);
  check(`${lang} resolves to manual_${code}.md`, url === `${MANUAL_DIR_V009}/manual_${code}.md`, String(url));
}
check('castellano resolves to manual_es.md (a second id for one manual)',
      manualUrlV009('castellano') === `${MANUAL_DIR_V009}/manual_es.md`, String(manualUrlV009('castellano')));

// And a language with no v0.0.9 manual must resolve to nothing at all, not to English:
// the whole point of the strict directory is that absent beats wrong.
//
// Derived, never hand-listed. This list used to name `arabic`, and stayed right only until
// Arabic was published — then the test failed for a language that had just been ADDED, which
// is the most confusing way for a gate to be wrong. Anything mapped but unpublished serves.
const unpublished = Object.keys(MANUAL_MAP).filter(id => !listed.includes(MANUAL_MAP[id])).slice(0, 4);
for (const lang of unpublished) {
  check(`${lang} resolves to null (section stays hidden)`, manualUrlV009(lang) === null,
        String(manualUrlV009(lang)));
}

// ─── each published manual is what it says it is ─────────────────────────────
section('the manuals themselves');

for (const code of onDisk) {
  const text = readFileSync(join(DIR, `manual_${code}.md`), 'utf8');
  check(`manual_${code}.md declares CC-BY-SA-4.0`, text.includes('SPDX-License-Identifier: CC-BY-SA-4.0'));
  check(`manual_${code}.md is the v0.0.9 revision`, /v0\.0\.9/.test(text),
        'the header line that names the revision is missing or names another version');
  check(`manual_${code}.md carries the AI disclaimer`, /^>\s\*\*(Disclaimer|Aviso)/m.test(text));
  // The rendered section colours ```zymbol blocks and nothing else, so a manual whose code
  // fences lost their language would render as flat grey text and still look fine in diff.
  const fenced = (text.match(/^```zymbol$/gm) ?? []).length;
  check(`manual_${code}.md has its zymbol blocks fenced as such`, fenced > 50, `${fenced} found`);
}

// ─── the page still asks for what this file describes ────────────────────────
section('the front page wires it up');

const page = readFileSync(join(WEB_DIR, 'index.html'), 'utf8');
check('index.html has the manual section, hidden by default', /<section id="manual" hidden>/.test(page),
      'hidden in the markup, or a reader with no JavaScript sees a heading over an empty box');
check('index.html has the container the loader fills', /id="manual-content"/.test(page));
check('index.html has the nav item, hidden by default', /id="nav-manual-link" hidden/.test(page));
check('index.html loads a Markdown renderer', /cdn\.jsdelivr\.net\/npm\/marked@/.test(page),
      'without `marked` the loader returns false and no manual is ever shown');

const atlas = readFileSync(join(WEB_DIR, 'src/site/atlas.js'), 'utf8');
check('atlas.js calls showManual on a language change', /showManual\(langId\)/.test(atlas));

console.log(`\n${onDisk.length} manual(s) · ${Object.keys(MANUAL_MAP).length} language(s) mapped`);
console.log(failures ? `\n✗ ${failures} failure(s)` : '\n✓ the v0.0.9 manual list matches the directory');
process.exit(failures ? 1 : 0);
