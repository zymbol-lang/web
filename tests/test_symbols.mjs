#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Integrity tests for the hover help's symbol dictionary.
//
//   node tests/test_symbols.mjs
//
// The dictionary tells a visitor what each symbol on screen means. Three ways it can lie,
// and all three are invisible in a browser:
//
//   a card nobody reaches   the highlighter does not emit that `data-h` key, so the token
//                           is on screen, has a card, and can never be hovered;
//   a symbol with no card   REFERENCE.md §21 documents an operator the dictionary never
//                           mentions — the reader hovers and gets nothing;
//   a card that lies        its example does not compile. A snippet the language rejects,
//                           presented as the way to use an operator, is worse than silence.
//
// The last one is checked against the installed `zymbol` binary, in the engine the reader
// would actually use — not against the manuals, which are a v0.0.5 snapshot. That is how
// the cards for `|>`, `<\ … \>` and `</ … />` were caught: piping inside `>>` is a parse
// error, `%` inside a shell block is rejected by the CLI lexer, and a script inclusion is
// an expression, not a statement, so REFERENCE's own bare `</ ./sub.zy />` does not parse.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).
//
// Two inputs are optional, because web/ is its own repository and is cloned on its own:
// REFERENCE.md lives in the interpreter repo, and `zymbol` is a binary the reader may not
// have. Each missing one downgrades its section to a notice instead of failing the suite.

import { readFileSync, writeFileSync, mkdtempSync, existsSync, rmSync } from 'fs';
import { execFileSync, spawnSync } from 'child_process';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { SYMBOLS, GROUPS, REF_ROWS } from '../src/playground/symbols.js';
import { highlightCode } from '../src/playground/highlight.js';

const WEB_DIR   = dirname(dirname(fileURLToPath(import.meta.url)));
const REFERENCE = join(WEB_DIR, '..', 'interpreter', 'REFERENCE.md');

let failures = 0, notices = 0;
function check(label, ok, detail = '') {
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}
function section(name) { console.log(`\n${name}`); }
function notice(text) { notices++; console.log(`  – ${text}`); }

/** `data-h` values are HTML-escaped in the markup; read them back as the real token. */
function unescapeAttr(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function hoverKeysIn(code) {
  return new Set([...highlightCode(code).matchAll(/data-h="([^"]*)"/g)]
    .map(m => unescapeAttr(m[1])));
}

// ─── the dictionary is internally consistent ─────────────────────────────────
section('dictionary shape');

const ids = new Set();
for (const [key, card] of Object.entries(SYMBOLS)) {
  check(`${key} has an id`, Boolean(card.id));
  check(`${key} has an example`, Boolean(card.example));
  check(`${key} is in a known group`, GROUPS.includes(card.group), `group: ${card.group}`);
  check(`${key} has a unique id`, !ids.has(card.id), `duplicate id: ${card.id}`);
  ids.add(card.id);
}

// ─── every card is reachable from the editor ─────────────────────────────────
// A card's own example is the strongest available proof that the highlighter emits its
// key: if hovering that very snippet cannot produce the card, nothing can.
section('every card is reachable');

for (const [key, card] of Object.entries(SYMBOLS)) {
  const keys = hoverKeysIn(card.example);
  check(`${key} (${card.id}) is emitted by its own example`, keys.has(key),
        `the example emits: ${[...keys].join(' ') || '(nothing)'}`);
}

// ─── every key the highlighter emits has a card ──────────────────────────────
section('every emitted key has a card');

const emitted = new Set();
for (const card of Object.values(SYMBOLS)) for (const k of hoverKeysIn(card.example)) emitted.add(k);
for (const k of emitted) {
  check(`emitted key ${JSON.stringify(k)} has a card`, k in SYMBOLS);
}

// ─── REFERENCE.md §21 is fully covered ───────────────────────────────────────
section('REFERENCE.md §21 coverage');

if (!existsSync(REFERENCE)) {
  notice('interpreter/REFERENCE.md not found — coverage not checked. ' +
         'Clone the interpreter repo next to web/ to run this section.');
} else {
  // Cells escape their pipes as \| ; swap them out before splitting on the real ones.
  const SENTINEL = '\uE000';   // private use area: cannot occur in the table
  const md = readFileSync(REFERENCE, 'utf8').split('\n');
  const start = md.findIndex(l => l.startsWith('## 21. Complete Symbol Reference'));
  check('REFERENCE.md has a §21', start !== -1);

  const rows = [];
  for (let i = start; i < md.length && start !== -1; i++) {
    const l = md[i];
    if (l.startsWith('---') && rows.length) break;
    if (!l.startsWith('|')) continue;
    const cells = l.replace(/\\\|/g, SENTINEL).split('|')
      .map(s => s.trim().split(SENTINEL).join('|'));
    if (cells[1] === 'Symbol' || cells[1].startsWith('---')) continue;
    rows.push(cells[1]);
  }

  check('§21 parsed into rows', rows.length > 50, `got ${rows.length}`);
  for (const row of rows) {
    check(`§21 row ${row} is explained by some card`, row in REF_ROWS,
          'add it to REF_ROWS in src/playground/symbols.js, pointing at the card that covers it');
  }
  for (const [row, key] of Object.entries(REF_ROWS)) {
    check(`REF_ROWS ${row} points at a real card`, key in SYMBOLS, `no card for ${key}`);
    check(`REF_ROWS ${row} still exists in §21`, rows.includes(row),
          'the row was renamed or removed upstream — update REF_ROWS');
  }
}

// ─── every example compiles ──────────────────────────────────────────────────
section('every example compiles');

function haveZymbol() {
  try { execFileSync('zymbol', ['--version'], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

if (!haveZymbol()) {
  notice('`zymbol` is not on PATH — examples not compiled. See install.html.');
} else {
  const dir = mkdtempSync(join(tmpdir(), 'zymbol-symbols-'));
  let warned = 0;
  try {
    for (const [key, card] of Object.entries(SYMBOLS)) {
      // A module's name has to match its file name (E001), so an example that declares
      // one is written under that name rather than under the card's id.
      const declared = /^#\s*([^\s{]+)\s*\{/m.exec(card.example);
      const file = join(dir, `${declared ? declared[1] : card.id}.zy`);
      writeFileSync(file, card.example + '\n');

      // spawnSync, not execFileSync: `zymbol check` writes diagnostics to stderr and exits
      // 0 when they are only warnings, and execFileSync hands back stdout alone on that
      // path — so every warning in every example was invisible here until this changed.
      const r = spawnSync('zymbol', ['check', file], { encoding: 'utf8', timeout: 10000 });
      const plain = ((r.stdout ?? '') + (r.stderr ?? '')).replace(/\x1b\[[0-9;]*m/g, '');
      const first = plain.split('\n').find(l => /^(error|warning)/.test(l)) ?? '';

      check(`${key} (${card.id}) compiles`, r.status === 0 && !/^error/m.test(plain), first);
      if (/^warning/m.test(plain)) warned++;
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  // Warnings are reported, not enforced. `zymbol check` raises "ambiguous lifetime" for the
  // iterator of any counted loop — `@ i:1..3 { >> i ¶ }` warns about `i` — so a zero-warning
  // rule here would ban the plainest loop in the language from the card that explains loops.
  // The count is printed so a jump in it gets noticed.
  console.log(`  – ${warned} of ${Object.keys(SYMBOLS).length} examples raise a warning ` +
              `(mostly the loop-iterator lifetime warning; errors are what fail this test)`);
}

// ─── report ──────────────────────────────────────────────────────────────────
console.log('');
console.log(failures === 0
  ? `✓ symbol dictionary: ${Object.keys(SYMBOLS).length} cards${notices ? ` (${notices} section(s) skipped)` : ''}`
  : `✗ ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
