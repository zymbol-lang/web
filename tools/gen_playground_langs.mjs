#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Derives data/i18n/playground/langs.json from the two files that already hold the truth.
//
//   node tools/gen_playground_langs.mjs
//
// Why a derived file at all, in a directory with no build step: the playground needs two
// small things from data/i18n/ — the native name and direction of each language (for its
// language picker) and the 16 `ops` concept names (so a reader whose language has no full
// playground catalogue still sees `?` labelled もし, si, hoặc…). Those two things weigh
// ~7 KB. The files that contain them weigh 493 KB and 175 KB, because they also carry the
// landing page's whole copy deck and a FizzBuzz sample per language. Making every visitor
// download 670 KB for 16 words each would be indefensible.
//
// It lives in tools/ rather than scripts/ because scripts/ is gitignored — it holds
// one-off data migrations, and this is neither one-off nor optional: the test suite
// imports `deriveLangs` from here.
//
// The output is committed, not generated at load time, and tests/test_i18n_playground.mjs
// re-derives it and fails if it has drifted — the same "hand-committed, machine-verified"
// arrangement as the SHA-256 in .well-known/agent-skills/index.json. Editing i18n.json or
// languages.json means re-running this script in the same commit.

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));

/** Builds the derived object. Exported so the test derives it the same way, not its own way. */
export function deriveLangs(i18nData, langData) {
  const i18n = i18nData.languages;
  const out  = {};

  // languages.json is the set the landing page offers as chips; i18n.json has a few extra
  // ids with no display name (constructed languages, plus hungarian and welsh). A picker
  // entry with no name to show is not an entry, so the chip list is the one that governs.
  for (const lang of langData.languages) {
    const entry = i18n[lang.id];
    if (!entry || !entry.ops) continue;
    out[lang.id] = {
      native: lang.native || lang.name,
      dir: lang.dir === 'rtl' || entry.rtl ? 'rtl' : 'ltr',
      ops: entry.ops,
    };
  }
  return { languages: out };
}

// Only when run, never when imported. tests/test_i18n_playground.mjs imports `deriveLangs`
// to re-derive the file and compare: if this block ran on import, the test would rewrite
// the committed file and then find it identical — a drift check that can never fail.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i18nData = JSON.parse(readFileSync(join(WEB_DIR, 'data/i18n/i18n.json'), 'utf8'));
  const langData = JSON.parse(readFileSync(join(WEB_DIR, 'data/i18n/languages.json'), 'utf8'));

  const derived = deriveLangs(i18nData, langData);
  const target  = join(WEB_DIR, 'data/i18n/playground/langs.json');

  writeFileSync(target, JSON.stringify(derived, null, 2) + '\n');

  const n = Object.keys(derived.languages).length;
  console.log(`wrote data/i18n/playground/langs.json — ${n} languages, ` +
              `${(JSON.stringify(derived).length / 1024).toFixed(1)} KB`);
}
