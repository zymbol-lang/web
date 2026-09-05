// SPDX-License-Identifier: AGPL-3.0-only
/**
 * highlight-zy.js — the colouring the static pages use for Zymbol source.
 *
 * Lifted out of src/site/main.js when index3.html started showing a real program fetched
 * from examples/, for the reason langbar.js exists: the second copy is the one that falls
 * behind. The landing page uses it for the showcase and for the ```zymbol blocks of the
 * manual; index3 uses it for the sample it displays.
 *
 * It is deliberately NOT src/playground/highlight.js. That one is the audited highlighter
 * — it carries the hover dictionary's keys and is checked against the lexer by
 * tests/test_symbols.mjs — but it imports the engine (src/zymbol/zymbol.js, 384 KB) for
 * the Unicode digit tables. A landing page does not download an interpreter to colour
 * sixty lines. What is here is the older, coarser pass, unchanged: it knows the operators
 * and nothing about symbol cards.
 *
 * `main.js` also carried a first attempt at this, a regex `highlight()` superseded by the
 * token-aware pass below. Nothing had called it in a long time; it did not come along.
 */

// ─── Better highlight: token-aware ───
export function highlightZymbol(raw) {
  const lines = raw.split('\n');
  return lines.map(line => highlightLine(line)).join('\n');
}

function highlightLine(line) {
  // comment
  if (/^\s*\/\//.test(line)) {
    return `<span class="t-cmt">${esc(line)}</span>`;
  }

  let out = '';
  let i = 0;
  const s = line;
  const len = s.length;

  while (i < len) {
    // comment
    if (s[i] === '/' && s[i+1] === '/') {
      out += `<span class="t-cmt">${esc(s.slice(i))}</span>`;
      break;
    }

    // string
    if (s[i] === '"') {
      let j = i + 1;
      while (j < len && s[j] !== '"') { if (s[j] === '\\') j++; j++; }
      out += `<span class="t-str">${esc(s.slice(i, j+1))}</span>`;
      i = j + 1;
      continue;
    }

    // number
    if (/\d/.test(s[i]) && (i === 0 || !/\w/.test(s[i-1]))) {
      let j = i;
      while (j < len && /[\d.]/.test(s[j])) j++;
      out += `<span class="t-num">${esc(s.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // multi-char operators
    const twoChar = s.slice(i, i+2);
    const oneChar = s[i];

    if (twoChar === '<~') { out += `<span class="t-kw">&lt;~</span>`; i += 2; continue; }
    if (twoChar === '>>') { out += `<span class="t-op">&gt;&gt;</span>`; i += 2; continue; }
    if (twoChar === '_?') { out += `<span class="t-kw">_?</span>`; i += 2; continue; }
    if (twoChar === '??') { out += `<span class="t-kw">??</span>`; i += 2; continue; }
    if (twoChar === '..') { out += `<span class="t-op">..</span>`; i += 2; continue; }
    if (twoChar === '::') { out += `<span class="t-op">::</span>`; i += 2; continue; }
    if (twoChar === '==') { out += `<span class="t-op">==</span>`; i += 2; continue; }
    if (twoChar === '!=') { out += `<span class="t-op">!=</span>`; i += 2; continue; }
    if (twoChar === '<=') { out += `<span class="t-op">&lt;=</span>`; i += 2; continue; }
    if (twoChar === '>=') { out += `<span class="t-op">&gt;=</span>`; i += 2; continue; }
    if (twoChar === '#1') { out += `<span class="t-num">#1</span>`; i += 2; continue; }
    if (twoChar === '#0') { out += `<span class="t-num">#0</span>`; i += 2; continue; }

    if (oneChar === '?') { out += `<span class="t-kw">?</span>`; i++; continue; }
    if (oneChar === '@') { out += `<span class="t-kw">@</span>`; i++; continue; }
    if (oneChar === '¶') { out += `<span class="t-kw">¶</span>`; i++; continue; }
    if (oneChar === '_' && (i+1 >= len || !/\w/.test(s[i+1]))) {
      out += `<span class="t-kw">_</span>`; i++; continue;
    }
    if (oneChar === '%') { out += `<span class="t-op">%</span>`; i++; continue; }
    if (oneChar === '+') { out += `<span class="t-op">+</span>`; i++; continue; }
    if (oneChar === '-' && (i+1 < len && /\d/.test(s[i+1]) && (i===0 || /[\s(,]/.test(s[i-1])))) {
      // negative number
      let j = i + 1;
      while (j < len && /[\d.]/.test(s[j])) j++;
      out += `<span class="t-num">${esc(s.slice(i, j))}</span>`;
      i = j; continue;
    }
    if (oneChar === ':' && s[i+1] !== ':') { out += `<span class="t-op">:</span>`; i++; continue; }
    if (oneChar === '<') { out += '&lt;'; i++; continue; }
    if (oneChar === '>') { out += '&gt;'; i++; continue; }
    if (oneChar === '&') { out += '&amp;'; i++; continue; }

    // identifier
    if (/[\p{L}\p{N}_$]/u.test(oneChar)) {
      let j = i;
      while (j < len && /[\p{L}\p{N}_$]/u.test(s[j])) j++;
      const word = s.slice(i, j);
      // peek if followed by (
      const isFn = j < len && s[j] === '(';
      if (isFn) {
        out += `<span class="t-fn">${esc(word)}</span>`;
      } else {
        out += `<span class="t-id">${esc(word)}</span>`;
      }
      i = j;
      continue;
    }

    out += esc(oneChar);
    i++;
  }

  return out;
}

export function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
