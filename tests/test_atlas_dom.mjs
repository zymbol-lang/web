#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Browser test for index3.html: the phone layout and the language switch.
//
//   node tests/test_atlas_dom.mjs
//
// tests/test_i18n_atlas.mjs already proves the catalogues are complete and that every key
// the markup asks for exists. What it cannot see is the page: whether a capture spills off
// a 360px screen, whether the header still fits once the picker is in it, whether the
// fitted panes land at a size anyone can read — and whether the picker actually re-labels
// the page, <title>, <html lang> and fourteen mark tiles included. All of that is laid-out
// boxes and live DOM, so it needs a browser and a viewport.
//
// Runs tests/dom/atlas.html in headless Chrome and reads the verdicts out of the rendered
// DOM, the same arrangement test_playground_dom.mjs uses. Chrome is optional: with none
// installed the test says so and passes. web/ has no package.json and gains no dependency
// from this — it drives the browser already on the machine, over the server the repo ships.

import { spawn, spawnSync, execFileSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = 8124;

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
  console.log('– no Chrome or Chromium found — index3 layout and language switch not checked.');
  console.log('  Install one, or open tests/dom/atlas.html in a browser by hand.');
  process.exit(0);
}

const server = spawn(process.execPath, [join(WEB_DIR, 'tests', 'serve.mjs'), String(PORT)], {
  cwd: WEB_DIR, stdio: 'ignore',
});

/** The server binds immediately, but "immediately" is not synchronous. */
async function waitForServer(tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/tests/dom/atlas.html`);
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
    // The page's own language resolution reads navigator.languages. Pin it, so the test
    // does not pass or fail on whatever locale the machine happens to be set to.
    '--lang=en-US',
    // The fixture waits out a catalogue fetch and a language switch; virtual time lets
    // that finish without making the test sleep for real.
    '--virtual-time-budget=15000',
    '--dump-dom', `http://localhost:${PORT}/tests/dom/atlas.html`,
  ], { encoding: 'utf8', timeout: 90000, env: { ...process.env, LANGUAGE: 'en_US', LC_ALL: 'C' } });

  const dom = r.stdout ?? '';
  const results = /<pre id="results">([\s\S]*?)<\/pre>/.exec(dom);

  if (!results || /^running…/.test(results[1].trim())) {
    failures++;
    console.log('  ✗ the fixture produced no results — index3\'s module graph probably failed to load');
    const err = (r.stderr ?? '').split('\n')
      .filter(l => /error|Error|failed/.test(l) && !/GPU|gpu|dbus|DevTools|sqlite/.test(l))
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
    console.log(`\n${lines.length} checks in the browser at 360px, ${failures} failed`);
  }
} finally {
  server.kill();
}

console.log(failures === 0
  ? '✓ index3 fits a phone and changes language in place'
  : `✗ ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
