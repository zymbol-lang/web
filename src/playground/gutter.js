// SPDX-License-Identifier: AGPL-3.0-only
/**
 * gutter.js — the line numbers beside the editor.
 *
 * Every diagnostic this playground shows names a line: the checker's strip says
 * "line 6", and a run that fails prints `Line 6: …` into the output. Without a
 * ruler down the side of the editor those numbers are a counting exercise, so
 * the one piece of information the message carries is the one the reader has to
 * reconstruct by hand.
 *
 * ── Why the numbers live in a <pre>, not in one <div> per line ────────────────
 *
 * The gutter has to agree with the colouring layer row for row, and with the
 * textarea under it, at a line height of 1.65 × 0.82rem — a fractional number of
 * pixels. Stacked block elements each round their own box; a single run of text
 * in `white-space: pre` is laid out by the same line-box machinery that lays out
 * the code, so the rows cannot drift no matter what the font or the zoom does.
 * The numbers are right-aligned with `padStart`, for the same reason: it is text
 * alignment done in the text, not in the box model.
 *
 * Diagnostics tint the number itself (colour and weight) rather than its
 * background — a background would be as wide as the digits, so "9" and "10"
 * would draw different-sized marks on lines that are equally wrong.
 */

/** Never narrower than this: the gutter must not visibly resize at line 10. */
const MIN_DIGITS = 2;

export function createGutter({ wrapper, editor, gutter }) {
  let built = -1;

  function countLines(src) {
    let n = 1;
    for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
    return n;
  }

  /** Rebuilds the numbers — but only when the program gained or lost a line. */
  function render() {
    const n = countLines(editor.value);
    if (n === built) return;
    built = n;

    const width = Math.max(String(n).length, MIN_DIGITS);
    // The two code layers are padded to clear the gutter, so its width has to
    // reach them: it does, through the wrapper both of them inherit from.
    wrapper.style.setProperty('--gutter-digits', String(width));

    const parts = new Array(n);
    for (let i = 1; i <= n; i++) {
      parts[i - 1] = `<span class="gl" data-l="${i}">${String(i).padStart(width, ' ')}</span>`;
    }
    gutter.innerHTML = parts.join('\n');
  }

  function scroll() {
    gutter.scrollTop = editor.scrollTop;
  }

  return {
    /** Numbers up to date and lined up with what the textarea is showing. */
    sync() { render(); scroll(); },
    scroll,
    /**
     * Tints the numbers the checker is complaining about. Called by problems.js
     * whenever it re-marks the colouring layer — including after a rebuild here,
     * which throws the tints away with the numbers that carried them.
     */
    mark(diagnostics) {
      for (const el of gutter.querySelectorAll('.gl.has-error, .gl.has-warning')) {
        el.classList.remove('has-error', 'has-warning');
      }
      for (const d of diagnostics) {
        if (!d.line) continue;
        const el = gutter.querySelector(`.gl[data-l="${d.line}"]`);
        if (el) el.classList.add(d.severity === 'error' ? 'has-error' : 'has-warning');
      }
    },
  };
}
