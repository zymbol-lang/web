// SPDX-License-Identifier: AGPL-3.0-only
/**
 * hover.js — what is this symbol, and what is this name?
 *
 * A visitor opens the playground, sees `? x > 0 { >> "hi" ¶ }`, and has nowhere to ask.
 * Resting the mouse on any token answers: an operator gets its card from the dictionary
 * (symbols.js), an identifier gets described from the program on screen — `PI := 3.14159`
 * hovers as *constant · Float · 3.14159*.
 *
 * ── Why the hit-testing is done by hand ──────────────────────────────────────────────
 *
 * The editor is a transparent `<textarea>` (z-index 2) over a `<pre>` that holds the
 * coloured copy (z-index 1, `pointer-events: none`). The mouse therefore never touches a
 * coloured span, and `elementFromPoint` never returns one. `caretPositionFromPoint` over a
 * textarea is not dependable across browsers either.
 *
 * What is dependable is that both layers use `white-space: pre` with no wrapping and one
 * uniform line height, so visual row and source line are the same number:
 *
 *     line = (pointerY − topOfLayer + scrollTop − paddingTop) / lineHeight
 *
 * That is O(1) and exact. From the line's `.hl-line` wrapper we test the handful of spans
 * on it with `getClientRects()` — which is how a Japanese identifier and an emoji get hit
 * correctly, since the browser did the measuring, not us.
 */

import { SYMBOLS } from './symbols.js';
import { highlightCode } from './highlight.js';
import { buildSymbolIndex } from '../zymbol/zymbol.js';
import { t, opsLabel, localeDir, onLocaleChange } from '../i18n/i18n.js';

/** Constructs the browser engine has no way to run. The card says so rather than pretending. */
const NOT_IN_BROWSER = new Set(['<\\', '</']);

/** How long the pointer has to rest before a card appears. */
const DWELL_MS = 320;

export function createHover({ editor, highlight, wrapper, card, getSource }) {
  let timer = null;
  let shownFor = null;          // the element the visible card belongs to
  let indexCache = { src: null, index: null };

  /** The identifier index is only rebuilt when the program actually changed. */
  function symbolIndex() {
    const src = getSource();
    if (indexCache.src !== src) {
      indexCache = { src, index: buildSymbolIndex(src) };
    }
    return indexCache.index;
  }

  function hide() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!shownFor) return;
    shownFor = null;
    card.classList.remove('visible');
    card.setAttribute('aria-hidden', 'true');
  }

  /** The source line under a pointer position, or 0 when it is past the end. */
  function lineAt(clientY) {
    const rect = highlight.getBoundingClientRect();
    const cs = getComputedStyle(highlight);
    const lineHeight = parseFloat(cs.lineHeight);
    const padTop = parseFloat(cs.paddingTop) || 0;
    if (!Number.isFinite(lineHeight) || lineHeight <= 0) return 0;
    const y = clientY - rect.top + highlight.scrollTop - padTop;
    if (y < 0) return 0;
    return Math.floor(y / lineHeight) + 1;
  }

  /** The token span under a pointer position, tested against what the browser laid out. */
  function tokenAt(clientX, clientY) {
    const line = lineAt(clientY);
    if (line < 1) return null;
    const lineEl = highlight.querySelector(`.hl-line[data-l="${line}"]`);
    if (!lineEl) return null;
    for (const el of lineEl.children) {
      if (!el.dataset.h && !el.dataset.id) continue;
      for (const r of el.getClientRects()) {
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
          return el;
        }
      }
    }
    return null;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** The card for an operator: what it is called, what it does, and one worked example. */
  function symbolCard(key) {
    const info = SYMBOLS[key];
    if (!info) return null;

    const native = info.ops ? opsLabel(info.ops) : null;
    const concept = t(`sym.${info.id}.concept`);
    // Only worth showing when it says something the concept does not — in English the two
    // are the same word, and a chip repeating the title is noise.
    const nativeChip = native && native.toLowerCase() !== concept.toLowerCase()
      ? `<span class="hc-native">${esc(native)}</span>` : '';

    return `
      <div class="hc-head">
        <span class="hc-sym">${esc(key)}</span>
        <span class="hc-concept">${esc(concept)}</span>
        ${nativeChip}
      </div>
      <p class="hc-summary">${esc(t(`sym.${info.id}.summary`))}</p>
      <pre class="hc-example">${highlightCode(info.example)}</pre>
      ${NOT_IN_BROWSER.has(key) ? `<p class="hc-note">${esc(t('ui.browserNote'))}</p>` : ''}
    `;
  }

  /**
   * The card for a name, built from the program on screen.
   *
   * The lexer records a line but no column, so a name is resolved to the last definition at
   * or above the hovered line. Exact for ordinary code; under deliberate shadowing it can
   * name the wrong one, which is why the playground documents this rather than implying an
   * accuracy it does not have.
   */
  function identifierCard(name, line) {
    const defs = symbolIndex().get(name);
    if (!defs || defs.length === 0) {
      return `
        <div class="hc-head"><span class="hc-sym">${esc(name)}</span></div>
        <p class="hc-summary hc-note">${esc(t('id.unknown'))}</p>`;
    }
    // The nearest definition at or above the pointer. With none above — the reader is
    // hovering a use that precedes its own definition — fall back to the last one, which
    // is still the honest answer to "what is this name in this program".
    const before = defs.filter(d => d.line <= line);
    const pool = before.length ? before : defs;
    const def = pool[pool.length - 1];

    const bits = [`<span class="hc-kind">${esc(t(`id.${def.kind}`))}</span>`];
    if (def.type)  bits.push(`<span class="hc-type">${esc(def.type)}</span>`);
    if (def.value) bits.push(`<span class="hc-value">${esc(def.value)}</span>`);

    return `
      <div class="hc-head">
        <span class="hc-sym">${esc(name)}</span>
        ${bits.join('')}
      </div>
      <p class="hc-note">${esc(t('id.definedAt', { line: def.line }))}</p>`;
  }

  /** Places the card near the token without letting it leave the editor. */
  function place(el) {
    const wrapRect = wrapper.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    card.style.left = '0px';
    card.style.top = '0px';
    card.classList.add('visible');
    const cardRect = card.getBoundingClientRect();

    let left = elRect.left - wrapRect.left;
    let top = elRect.bottom - wrapRect.top + 6;

    // Flip above when there is no room below, and pull back inside on the right.
    if (top + cardRect.height > wrapRect.height && elRect.top - wrapRect.top > cardRect.height + 6) {
      top = elRect.top - wrapRect.top - cardRect.height - 6;
    }
    if (left + cardRect.width > wrapRect.width) left = Math.max(0, wrapRect.width - cardRect.width - 4);

    card.style.left = `${Math.max(0, left)}px`;
    card.style.top = `${Math.max(0, top)}px`;
  }

  function show(el, clientY) {
    let html = null;
    if (el.dataset.h) html = symbolCard(el.dataset.h);
    else if (el.dataset.id) html = identifierCard(el.dataset.id, lineAt(clientY));
    if (!html) return;

    card.dir = localeDir();
    card.innerHTML = html;
    shownFor = el;
    card.setAttribute('aria-hidden', 'false');
    place(el);
  }

  editor.addEventListener('mousemove', (e) => {
    const el = tokenAt(e.clientX, e.clientY);
    if (!el) { hide(); return; }
    if (el === shownFor) return;               // already showing this one: leave it be
    if (timer) clearTimeout(timer);
    const { clientX, clientY } = e;
    timer = setTimeout(() => {
      timer = null;
      // Re-test on fire: the pointer may have moved on during the dwell.
      const still = tokenAt(clientX, clientY);
      if (still) show(still, clientY);
    }, DWELL_MS);
  });

  // Anything that moves the text out from under the card takes the card with it.
  editor.addEventListener('mouseleave', hide);
  editor.addEventListener('scroll', hide);
  editor.addEventListener('keydown', hide);
  editor.addEventListener('input', () => { hide(); indexCache = { src: null, index: null }; });
  editor.addEventListener('mousedown', hide);
  window.addEventListener('blur', hide);

  // A card in the old language would sit there contradicting the rest of the interface.
  onLocaleChange(hide);

  return { hide };
}
