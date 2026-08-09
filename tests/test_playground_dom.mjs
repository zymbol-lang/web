#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Browser test for the reading help: hover cards and the problems strip.
//
//   node tests/test_playground_dom.mjs
//
// Everything else in tests/ runs in Node, because everything else is logic. This cannot be:
// the hover finds the token under the pointer by dividing the pointer's offset by the line
// height and then hit-testing laid-out rectangles, and there is no line height and no
// rectangle without a browser. A CSS change that shifts the colouring layer by a pixel, or
// gives it a different font, breaks the feature in a way that no unit test can see and that
// looks perfectly fine in a screenshot — the wrong card simply appears.
//
// Runs the fixture at tests/dom/reading-help.html in headless Chrome and reads the verdicts
// out of the rendered DOM. Chrome is optional: with none installed the test says so and
// passes, the same arrangement test_symbols.mjs uses for the `zymbol` binary. web/ has no
// package.json and gains no dependency from this — it drives the browser that is already on
// the machine, over the static server the repo already ships.

import { spawn, spawnSync, execFileSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = 8123;

const CHROME_CANDIDATES = [
  'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    try { execFileSync(c, ['--version'], { stdio: 'ignore' }); return c; }
    catch { /* next */ }
  }
  return null;
}

const chrome = findChrome();
if (!chrome) {
  console.log('– no Chrome or Chromium found — DOM behaviour not checked.');
  console.log('  Install one, or open tests/dom/reading-help.html in a browser by hand.');
  process.exit(0);
}

const server = spawn(process.execPath, [join(WEB_DIR, 'tests', 'serve.mjs'), String(PORT)], {
  cwd: WEB_DIR, stdio: 'ignore',
});

/** The server binds immediately, but "immediately" is not synchronous. */
async function waitForServer(tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/tests/dom/reading-help.html`);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 100));
  }
  return false;
}

let failures = 0;
try {
  if (!await waitForServer()) {
    console.log(`  ✗ the static server never came up on ${PORT}`);
    process.exit(1);
  }

  const r = spawnSync(chrome, [
    '--headless', '--disable-gpu', '--no-sandbox',
    // The fixture waits out several hover dwells; virtual time lets that finish without
    // making the test sleep for real.
    '--virtual-time-budget=15000',
    '--dump-dom', `http://localhost:${PORT}/tests/dom/reading-help.html`,
  ], { encoding: 'utf8', timeout: 90000 });

  const dom = r.stdout ?? '';
  const results = /<pre id="results">([\s\S]*?)<\/pre>/.exec(dom);

  if (!results) {
    failures++;
    console.log('  ✗ the fixture produced no results — its module graph probably failed to load');
    const err = (r.stderr ?? '').split('\n')
      .filter(l => /error|Error|failed/.test(l) && !/GPU|gpu|dbus|DevTools/.test(l))
      .slice(0, 6);
    if (err.length) console.log(err.map(l => `      ${l}`).join('\n'));
  } else {
    const lines = results[1]
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      .trim().split('\n');
    for (const line of lines) {
      if (line.startsWith('FAIL')) {
        failures++;
        console.log(`  ✗ ${line.slice(5)}`);
      }
    }
    console.log(`\n${lines.length} checks in the browser, ${failures} failed`);
  }
} finally {
  server.kill();
}

console.log(failures === 0 ? '✓ reading help behaves in a real browser' : `✗ ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
