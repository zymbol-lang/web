#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Checks that the repository says what LICENSE says it says.
//
//   node tests/test_licenses.mjs
//
// The split is easy to state and easy to lose: code is AGPL-3.0-only because
// `zymbol.js` is a hand-written port of the AGPL Rust tree-walker and everything
// around it links against that port; manuals and examples are CC BY-SA 4.0. A new
// .js file with no SPDX line, or a new manual with no footer, is a file whose
// license only exists in a document nobody reads — and files travel alone.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}
function section(name) { console.log(`\n${name}`); }

const read = rel => readFileSync(join(WEB_DIR, rel), 'utf8');

function walk(dir, out = []) {
  for (const name of readdirSync(join(WEB_DIR, dir))) {
    const rel = join(dir, name);
    if (statSync(join(WEB_DIR, rel)).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

// ─── the license texts are present ───────────────────────────────────────────
section('license files');

for (const f of ['LICENSE', 'LICENSE-AGPL-3.0', 'LICENSE-CC-BY-SA-4.0']) {
  check(`${f} exists`, existsSync(join(WEB_DIR, f)));
}
check('LICENSE-AGPL-3.0 is the AGPL text',
      read('LICENSE-AGPL-3.0').includes('GNU AFFERO GENERAL PUBLIC LICENSE'));
check('LICENSE-CC-BY-SA-4.0 is the CC text',
      read('LICENSE-CC-BY-SA-4.0').includes('Attribution-ShareAlike 4.0 International'));
check('LICENSE names both', ['LICENSE-AGPL-3.0', 'LICENSE-CC-BY-SA-4.0']
      .every(f => read('LICENSE').includes(f)));

// ─── every source file carries AGPL ──────────────────────────────────────────
section('source: AGPL-3.0-only');

const sources = [...walk('src'), ...walk('worker'), ...walk('tests')]
  .filter(f => /\.(js|mjs)$/.test(f));

for (const f of sources) {
  const head = read(f).split('\n').slice(0, 3).join('\n');
  check(`${f} declares AGPL-3.0-only`, head.includes('SPDX-License-Identifier: AGPL-3.0-only'),
        'expected an SPDX line in the first lines of the file');
}

// The engine is the file the license argument hangs on, so it says more than a
// tag: where it came from, and where the running source can be obtained.
const engine = read('src/zymbol/zymbol.js');
check('zymbol.js names its upstream', engine.includes('github.com/zymbol-lang/interpreter'));
check('zymbol.js offers the running source (AGPL §13)',
      engine.includes('github.com/zymbol-lang/web'));
check('the playground offers the running source too',
      read('playground.html').includes('github.com/zymbol-lang/web'),
      'AGPL section 13: users interacting over a network must be offered the source');

// ─── every manual carries CC BY-SA ───────────────────────────────────────────
section('manuals: CC BY-SA 4.0');

const manuals = readdirSync(join(WEB_DIR, 'data/manuals'))
  .filter(f => f.startsWith('manual_') && f.endsWith('.md'));

check('the manuals are where they are expected', manuals.length > 100, `${manuals.length} found`);
for (const f of manuals) {
  const text = read(join('data/manuals', f));
  check(`data/manuals/${f} declares CC-BY-SA-4.0`,
        text.includes('SPDX-License-Identifier: CC-BY-SA-4.0') &&
        text.includes('creativecommons.org/licenses/by-sa/4.0/'));
}

// ─── summary ─────────────────────────────────────────────────────────────────
console.log(`\n${sources.length} source file(s) · ${manuals.length} manual(s)`);
console.log(failures === 0 ? '\nAll license tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
