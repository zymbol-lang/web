// SPDX-License-Identifier: AGPL-3.0-only
// The terminal's cursor inside `>>|` (D-16, DIS-ZYE-004) — the browser's half
// of `zymbol_common::screen::caret`, in the same words, used by both browser
// engines.
//
// `>>|` hides the cursor: a game wants none. `>>~ (row, col)` with nothing to
// print shows it there, and `>>~ (0, 0)` hides it again. It stays where it was
// put until the program moves or hides it.

/** A place outside the screen's numbering: a `##Range` by its words. */
export const CARET_RANGE =
  'cursor position out of range: >>~ (row, col) counts both from 1, and (0, 0) hides the cursor';
/** `>>~ pos` with nothing to print, whose `pos` is not a place. The engine adds ", got <Type>". */
export const CARET_SHAPE = ">>~ pos with nothing to print takes the cursor's place, a tuple (row, col)";
/** `>>~ (row, col)` outside `>>|`, where the cursor is the shell's. */
export const CARET_OUTSIDE =
  '>>~ (row, col) shows the cursor of a full screen, and is written inside >>| { }';

/**
 * The place `>>~ (row, col)` asks for: `null` for `(0, 0)`, which hides the
 * cursor, `[row, col]` for a place, and `undefined` for anything else — the
 * caller raises CARET_RANGE.
 */
export function caretOf(row, col) {
  if (row === 0 && col === 0) return null;
  const ok = n => Number.isInteger(n) && n >= 1 && n <= 0xFFFF;
  return ok(row) && ok(col) ? [row, col] : undefined;
}
