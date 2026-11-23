// SPDX-License-Identifier: AGPL-3.0-only
// What `<<|` and `<<|?` hand a program for a key: one character, and the
// modifiers held with it — the browser's half of `zymbol_common::keys`, the
// Rust rule both native engines and `--keys` go through. tests/test_keys.mjs
// holds the two to the same table.
//
// - The keys that are not text arrive as glyphs (D-13): ⇱ Home, ⇲ End,
//   ⇞ Page Up, ⇟ Page Down, ⌦ Delete, ⇤ Shift+Tab, ①–⑫ F1–F12.
// - The modifiers are a number, read with `<<| k, m` (D-14): Shift 1, Alt 2,
//   Ctrl 4. Ctrl+letter arrives as its control character, with m = 4.
// - Shift is not reported on text (D-15): 'A' says it already. Ctrl+Alt on a
//   printable character is AltGr — which is how a browser on Windows reports
//   it — and gives m = 0.

export const SHIFT = 1, ALT = 2, CTRL = 4;

const NAMED = {
  ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
  Enter: '\n', Escape: '\x1b', Tab: '\t', Backspace: '\x7f',
  Home: '⇱', End: '⇲', PageUp: '⇞', PageDown: '⇟', Delete: '⌦',
};

// A modifier pressed on its own. A browser fires `keydown` for it and a
// terminal sends nothing, so it is not a key: queued, it reached `<<|` as a
// '\0' ahead of the Shift+→ it belonged to.
const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'OS', 'CapsLock', 'NumLock',
  'ScrollLock', 'Fn', 'FnLock', 'Hyper', 'Super', 'Symbol', 'SymbolLock']);

/**
 * `[char, m]` for a key, named as a KeyboardEvent names it: `key` is
 * `e.key`, the flags are `e.shiftKey`, `e.altKey`, `e.ctrlKey`. `null` for a
 * modifier pressed on its own, which is not a key.
 */
export function keyOf({ key, shiftKey = false, altKey = false, ctrlKey = false }) {
  if (MODIFIERS.has(key)) return null;
  const alt = altKey ? ALT : 0, ctrl = ctrlKey ? CTRL : 0, shift = shiftKey ? SHIFT : 0;
  const chars = [...(key ?? '')];
  if (chars.length === 1) {
    const c = chars[0];
    // Ctrl+letter is its control character: Ctrl+A is 0x01 (BUG-ZYB-006).
    if (ctrlKey && /^[A-Za-z]$/.test(c)) {
      return [String.fromCharCode(c.toLowerCase().charCodeAt(0) - 96), ctrl | alt];
    }
    // AltGr (D-15).
    if (ctrlKey && altKey && c.codePointAt(0) >= 32) return [c, 0];
    // Shift is in the character already (D-15).
    return [c, ctrl | alt];
  }
  // Shift+Tab is Back Tab.
  if (key === 'Tab' && shiftKey) return ['⇤', SHIFT | ctrl | alt];
  if (key in NAMED) return [NAMED[key], shift | ctrl | alt];
  const f = /^F([0-9]{1,2})$/.exec(key ?? '');
  if (f && +f[1] >= 1 && +f[1] <= 12) return [String.fromCodePoint(0x2460 + +f[1] - 1), shift | ctrl | alt];
  // A key the language does not name — Insert, a lone Shift, a media key.
  return ['\0', 0];
}
