#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// What `<<| k, m` hands a program in the browser (D-13, D-14, D-15), and where
// `>>~ (row, col)` shows the cursor (D-16).
//
//   node tests/test_keys.mjs
//
// The rule lives twice: `zymbol_common::keys` for the two Rust engines and
// `--keys`, and `src/zymbol/keys.js` for the two browser engines. Two copies
// drift, so this holds the browser one to the Rust one by its consequence, not
// its text: the corpus program `output/teclas_modificadores.zy` runs here, in
// both browser engines, on the browser's events for the same keys its `.keys`
// script names — and must print the golden the Rust engines recorded.
//
// The browser had drifted already when this was written: `_mapKey` gave Tab,
// Backspace and Ctrl+letter as the letter or as '\0' (the Rust engines fixed
// that in BUG-ZYB-006), and a Shift pressed on its own was queued as a '\0'
// key ahead of the Shift+→ it belonged to.
//
// Plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const { keyOf } = await import('../src/zymbol/keys.js');
const { runZymbol } = await import('../src/zymbol/zymbol.js');
const { runZymbolVM } = await import('../src/zymbol/zymbol_vm.js');

let failures = 0;
function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ' :: ' + detail}`);
  if (!ok) failures++;
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ─── the rule — the cases of zymbol_common::keys's own tests ─────────────────
console.log('\nkeyOf');
const cases = [
  // D-13: glyphs
  [{ key: 'Home' }, ['⇱', 0]], [{ key: 'End' }, ['⇲', 0]],
  [{ key: 'PageUp' }, ['⇞', 0]], [{ key: 'PageDown' }, ['⇟', 0]],
  [{ key: 'Delete' }, ['⌦', 0]], [{ key: 'F1' }, ['①', 0]], [{ key: 'F12' }, ['⑫', 0]],
  [{ key: 'F13' }, ['\0', 0]], [{ key: 'Insert', shiftKey: true }, ['\0', 0]],
  // the keys BUG-ZYB-006 was about
  [{ key: 'Tab' }, ['\t', 0]], [{ key: 'Backspace' }, ['\x7f', 0]],
  [{ key: 'Enter' }, ['\n', 0]], [{ key: 'Escape' }, ['\x1b', 0]],
  // D-15: Shift on named keys only
  [{ key: 'ArrowRight', shiftKey: true }, ['→', 1]],
  [{ key: 'A', shiftKey: true }, ['A', 0]], [{ key: '!', shiftKey: true }, ['!', 0]],
  [{ key: ' ', shiftKey: true }, [' ', 0]],
  // Back Tab
  [{ key: 'Tab', shiftKey: true }, ['⇤', 1]],
  // Ctrl+letter, Alt, AltGr
  [{ key: 's', ctrlKey: true }, ['\x13', 4]], [{ key: 'S', ctrlKey: true, shiftKey: true }, ['\x13', 4]],
  [{ key: 'a', ctrlKey: true, altKey: true }, ['\x01', 6]],
  [{ key: 'ArrowLeft', ctrlKey: true }, ['←', 4]],
  [{ key: 'x', altKey: true }, ['x', 2]], [{ key: '@', ctrlKey: true, altKey: true }, ['@', 0]],
  [{ key: 'ArrowUp', ctrlKey: true, altKey: true }, ['↑', 6]],
  // a modifier on its own is not a key
  [{ key: 'Shift', shiftKey: true }, null], [{ key: 'Control', ctrlKey: true }, null],
  [{ key: 'Alt', altKey: true }, null], [{ key: 'AltGraph' }, null], [{ key: 'Meta' }, null],
];
for (const [ev, want] of cases) {
  const got = keyOf(ev);
  check(`${JSON.stringify(ev)} → ${JSON.stringify(want)}`, same(got, want), JSON.stringify(got));
}

// ─── the corpus program, through both browser engines ────────────────────────
console.log('\noutput/teclas_modificadores.zy');
const CORPUS = resolve(process.env.ZYQUALITY ?? join(HERE, '../../zyquality'), 'corpus/output');
const zy = join(CORPUS, 'teclas_modificadores.zy');
if (!existsSync(zy)) {
  console.error(`test_keys: ${zy} not found — clone zyquality beside web/, or set ZYQUALITY`);
  process.exit(2);
}
const src = readFileSync(zy, 'utf8');
const golden = readFileSync(join(CORPUS, 'teclas_modificadores.expected'), 'utf8');

// The browser's event for each line of the `.keys` script. `null` is WAIT: one
// poll that finds nothing. The lone modifiers stand where a browser fires them,
// before the key they are held for.
const events = [
  { key: 'Home' }, { key: 'End' }, { key: 'PageUp' }, { key: 'PageDown' }, { key: 'Delete' },
  { key: 'Shift', shiftKey: true }, { key: 'Tab', shiftKey: true },                  // BACKTAB
  { key: 'F1' }, { key: 'F12' },
  { key: 'F5', shiftKey: true },                                                    // SHIFT+F5
  { key: 'Shift', shiftKey: true }, { key: 'ArrowRight', shiftKey: true },          // SHIFT+RIGHT
  { key: 'Control', ctrlKey: true }, { key: 'ArrowLeft', ctrlKey: true },           // CTRL+LEFT
  { key: 'Alt', altKey: true }, { key: 'x', altKey: true },                         // ALT+x
  { key: 'Delete', ctrlKey: true, altKey: true },                                   // CTRL+ALT+DEL
  { key: 's', ctrlKey: true },                                                      // CTRL+S
  { key: 'A', shiftKey: true },                                                     // A
  { key: 'A', shiftKey: true },                                                     // SHIFT+A
  { key: 'Tab', shiftKey: true },                                                   // SHIFT+TAB
  { key: 'q' },
  null,                                                                             // WAIT 1
  { key: 'z' },
];

// A screen with BrowserTUI's key queue: `readKey`/`pollKey` answer with the
// character and leave its modifiers in `lastMods`. What is drawn is kept as
// text, which is what the golden — the virtual screen's last frame — holds.
function fakeTui() {
  const queue = [];
  for (const ev of events) {
    if (ev === null) { queue.push('WAIT'); continue; }
    const k = keyOf(ev);
    if (k !== null) queue.push(k);
  }
  return {
    active: false, aborted: false, lastMods: 0, text: '', _sleepCancel: null,
    enter() { this.active = true; },
    leave() { this.active = false; },
    show() {}, clear() {}, printAt() {},
    print(s) { this.text += s; },
    getSize() { return [24, 80]; },
    pollKey() {
      const k = queue.shift();
      const [ch, m] = (k === undefined || k === 'WAIT') ? ['\0', 0] : k;
      this.lastMods = m;
      return ch;
    },
    async readKey() {
      while (queue[0] === 'WAIT') queue.shift();
      const [ch, m] = queue.shift() ?? ['\0', 0];
      this.lastMods = m;
      return ch;
    },
  };
}
// The frame trims each line's end and the trailing blank lines.
const asFrame = t => t.split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

for (const [name, run] of [['zyjs', runZymbol], ['zyjsvm', runZymbolVM]]) {
  const tui = fakeTui();
  let out = '';
  await run(src, async () => null, s => { out += s; }, null, 'teclas_modificadores.zy', tui, [], {});
  const got = asFrame(tui.text);
  check(`${name} prints the Rust engines' golden`, got === asFrame(golden) && out.trim() === '',
        `\n--- got\n${got}\n--- out\n${out}`);
}

// ─── the cursor (D-16), through both browser engines ─────────────────────────
// `output/cursor_pantalla.zy` on a virtual screen that keeps what is drawn cell
// by cell, as `zymbol run --keys` does, with the cursor a line after the frame:
// `[cursor row,col]`. A SHOW in the `.keys` script prints the frame the next key
// is read on, and the block's last frame is printed when it ends.
console.log('\noutput/cursor_pantalla.zy');
function virtualTui(script, sink) {
  const ROWS = 24, COLS = 80;
  const queue = [];
  for (const line of script.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    if (t === 'SHOW') queue.push('SHOW');
    else queue.push(keyOf({ key: t }));
  }
  return {
    active: false, aborted: false, lastMods: 0, _sleepCancel: null,
    cells: null, row: 0, col: 0, caret: null,
    blank() { this.cells = Array.from({ length: ROWS }, () => Array(COLS).fill(' ')); this.row = 0; this.col = 0; },
    frame() {
      const rows = this.cells.map(r => r.join('').replace(/\s+$/, ''));
      while (rows.length && rows[rows.length - 1] === '') rows.pop();
      if (this.caret) rows.push(`[cursor ${this.caret[0]},${this.caret[1]}]`);
      return rows.join('\n');
    },
    enter() { this.active = true; this.blank(); this.caret = null; },
    leave() { sink(this.frame() + '\n'); this.active = false; this.caret = null; },
    show() {},
    clear() { this.blank(); },
    setCaret(c) { this.caret = c; },
    print(s) {
      for (const ch of s) {
        if (ch === '\n') { this.row++; this.col = 0; continue; }
        if (this.row < ROWS && this.col < COLS) this.cells[this.row][this.col] = ch;
        this.col++;
      }
    },
    printAt(r, c, text) { if (r !== null && c !== null) { this.row = r - 1; this.col = c - 1; } this.print(text); },
    getSize() { return [ROWS, COLS]; },
    next() {
      while (queue[0] === 'SHOW') { queue.shift(); sink(this.frame() + '\n'); }
      return queue.shift() ?? ['\0', 0];
    },
    pollKey() { const [ch, m] = this.next(); this.lastMods = m; return ch; },
    async readKey() { const [ch, m] = this.next(); this.lastMods = m; return ch; },
  };
}
const cursorZy = join(CORPUS, 'cursor_pantalla.zy');
const cursorSrc = readFileSync(cursorZy, 'utf8');
const cursorKeys = readFileSync(join(CORPUS, 'cursor_pantalla.keys'), 'utf8');
const cursorGolden = readFileSync(join(CORPUS, 'cursor_pantalla.expected'), 'utf8');
for (const [name, run] of [['zyjs', runZymbol], ['zyjsvm', runZymbolVM]]) {
  let out = '';
  const sink = s => { out += s; };
  const tui = virtualTui(cursorKeys, sink);
  await run(cursorSrc, async () => null, sink, null, 'cursor_pantalla.zy', tui, [], {});
  // zyq compares with the blank lines left out, and records the golden so.
  const lines = t => t.split('\n').filter(l => l.trim() !== '').join('\n');
  check(`${name} prints the Rust engines' golden`, lines(out) === lines(cursorGolden),
        `\n--- got\n${out}\n--- want\n${cursorGolden}`);
}

console.log(failures ? `\n${failures} failed` : '\nall passed');
process.exit(failures ? 1 : 0);
