// SPDX-License-Identifier: AGPL-3.0-only
// ─── Syntax highlighter ───────────────────────────────────────────────────────
//
// Two jobs, one pass. It colours the code, and it is the index the hover help reads:
// every operator span carries `data-h`, the key of its card in the symbol dictionary
// (src/playground/symbols.js), and every line is wrapped in a `.hl-line` span carrying
// `data-l` so a mouse position can be narrowed to one line before hit-testing.
//
// That second job is why this file is worth auditing against the lexer in
// src/zymbol/zymbol.js rather than against intuition: a token the highlighter does not
// know is a token the reader cannot ask about. Auditing it that way found five operators
// this file had been splitting or swallowing — `$++` came out as `$+` then `+`, the whole
// `#|…|` numeric-eval family was unmarked, a postfix `x°` was absorbed into the
// identifier, and `</ f.zy />` was six unrelated punctuation marks.
//
// The `.hl-line` wrapper is an inline span inside `white-space: pre`, so it changes the
// colouring layer's layout by nothing at all — which matters, because that layer has to
// stay glued to the textarea on top of it, character for character.

export function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/** Attribute values need the quote escaped too — `##"` and `##'` are real operators. */
function escAttr(s) { return esc(s).replace(/"/g, '&quot;'); }

/** One operator span: class, visible text, and the dictionary key to look up on hover. */
function op(cls, text, hoverKey) {
  return `<span class="${cls}" data-h="${escAttr(hoverKey ?? text)}">${esc(text)}</span>`;
}

// Returns [html, inBlockComment] — caller threads the state between lines.
export function highlightLine(line, inBlockComment) {
  let out = '', i = 0;
  const s = line, len = s.length;

  // ── Continue a block comment that started on a previous line ──────────────
  if (inBlockComment) {
    const end = s.indexOf('*/');
    if (end === -1) {
      return [`<span class="t-cmt">${esc(line)}</span>`, true];
    }
    out += `<span class="t-cmt">${esc(s.slice(0, end + 2))}</span>`;
    i = end + 2;
    inBlockComment = false;
    if (i >= len) return [out, false];
  }

  // ── Full-line // comment (fast path) ─────────────────────────────────────
  if (i === 0 && /^\s*\/\//.test(s)) {
    return [`<span class="t-cmt">${esc(line)}</span>`, false];
  }

  while (i < len) {
    // Inline // comment — rest of line is comment
    if (s[i] === '/' && s[i+1] === '/') {
      out += `<span class="t-cmt">${esc(s.slice(i))}</span>`; break;
    }

    // Block comment /* ... */
    if (s[i] === '/' && s[i+1] === '*') {
      const end = s.indexOf('*/', i + 2);
      if (end === -1) {
        // Block comment spans to next line(s)
        out += `<span class="t-cmt">${esc(s.slice(i))}</span>`;
        inBlockComment = true;
        break;
      }
      out += `<span class="t-cmt">${esc(s.slice(i, end + 2))}</span>`;
      i = end + 2; continue;
    }

    if (s[i] === '"') {
      let j = i+1;
      while (j < len && s[j] !== '"') { if (s[j]==='\\') j++; j++; }
      out += `<span class="t-str">${esc(s.slice(i, j+1))}</span>`;
      i = j+1; continue;
    }
    if (s[i] === "'") {
      let j = i+1;
      while (j < len && s[j] !== "'") { if (s[j]==='\\') j++; j++; }
      out += `<span class="t-str">${esc(s.slice(i, j+1))}</span>`;
      i = j+1; continue;
    }

    if (/\d/.test(s[i]) && (i===0 || !/\w/.test(s[i-1]))) {
      // Base literals: 0b, 0o, 0d, 0x
      if (s[i] === '0' && i+1 < len && /[boxd]/i.test(s[i+1])) {
        const pfx = s[i+1].toLowerCase();
        const cs = pfx==='b' ? /[01]/ : pfx==='o' ? /[0-7]/ : pfx==='d' ? /\d/ : /[0-9a-fA-F]/;
        let j = i+2;
        while (j < len && cs.test(s[j])) j++;
        out += op('t-num', s.slice(i,j), '0x');
        i = j; continue;
      }
      // A decimal point is only part of the number when a digit follows it. Scanning
      // `[\d.]` greedily instead swallowed `2..3` whole, so no range in any program ever
      // had its `..` coloured — or, once this file fed the hover, askable.
      let j = i;
      while (j < len && /\d/.test(s[j])) j++;
      if (s[j] === '.' && j+1 < len && /\d/.test(s[j+1])) {
        j++;
        while (j < len && /\d/.test(s[j])) j++;
      }
      out += `<span class="t-num">${esc(s.slice(i,j))}</span>`;
      i = j; continue;
    }

    // ── Shell and script blocks ──────────────────────────────────────────────
    // `<\ cmd \>` and `</ file.zy />` hold text, not Zymbol: the lexer captures the whole
    // span as one token. Colouring the inside as code offers arithmetic help on the `-l`
    // of `ls -la` and member access on `f.zy`, which is worse than saying nothing. Only
    // when the closer is on this line — a block left open is coloured as before.
    if ((s[i] === '<' && (s[i+1] === '\\' || s[i+1] === '/'))) {
      const shell = s[i+1] === '\\';
      const close = shell ? '\\>' : '/>';
      const end = s.indexOf(close, i + 2);
      if (end !== -1) {
        out += op('t-kw', s.slice(i, end + 2), shell ? '<\\' : '</');
        i = end + 2; continue;
      }
    }

    // ── The `#` family ───────────────────────────────────────────────────────
    // Mirrors the lexer's `#` branch in zymbol.js, in the same order, because the
    // prefixes overlap: `#!2|` is a truncate operator, `#1` is a boolean, `#०९#` is a
    // numeral-mode switch, and `#?` is a type query. Checking these in the wrong order
    // is how `#|"42"|` used to come out as a bare `#` followed by a stray pipe.
    if (s[i] === '#') {
      const c1 = s[i+1];

      // ##. ### ##! ##" ##' — casts and input typespecs, then ##Ident — error types
      if (c1 === '#') {
        const c2 = s[i+2];
        if (c2 === '.' || c2 === '#' || c2 === '!' || c2 === '"' || c2 === "'") {
          const tok = s.slice(i, i+3);
          out += op('t-op', tok); i += 3; continue;
        }
        if (c2 !== undefined && /[A-Za-z_]/.test(c2)) {
          let j = i+2;
          while (j < len && /[A-Za-z0-9_]/.test(s[j])) j++;
          out += op('t-kw', s.slice(i,j), '##type');
          i = j; continue;
        }
      }

      // #? — type metadata
      if (c1 === '?') { out += op('t-op', '#?'); i += 2; continue; }

      // #> — export block
      if (c1 === '>') { out += op('t-kw', '#>'); i += 2; continue; }

      // #|x| #.N|x| #!N|x| #,|x| #,.N|x| #,!N|x| #^|x| #^.N|x| #^!N|x|
      // The opening bracket is the operator; the closing `|` is punctuation that pairs
      // with it. Five cards cover the family: eval, round, truncate, comma, scientific.
      {
        const digitsAt = k => { let d = 0; while (k + d < len && /[0-9]/.test(s[k+d])) d++; return d; };
        let end = -1, key = null;
        if (c1 === '|') { end = i + 2; key = '#|'; }
        else if (c1 === '.' || c1 === '!') {
          const n = digitsAt(i+2);
          if (n > 0 && s[i+2+n] === '|') { end = i+3+n; key = c1 === '.' ? '#.|' : '#!|'; }
        } else if (c1 === ',' || c1 === '^') {
          key = c1 === ',' ? '#,|' : '#^|';
          const c2 = s[i+2];
          if (c2 === '|') end = i + 3;
          else if (c2 === '.' || c2 === '!') {
            const n = digitsAt(i+3);
            if (n > 0 && s[i+3+n] === '|') end = i+4+n;
          }
          if (end === -1) key = null;
        }
        if (end !== -1) { out += op('t-op', s.slice(i, end), key); i = end; continue; }
      }

      // # name { — module block declaration: highlight # as keyword
      if (c1 === ' ' || c1 === '\t' || (c1 !== undefined && /[\p{L}_]/u.test(c1))) {
        let _j = i + 1;
        while (_j < len && (s[_j] === ' ' || s[_j] === '\t')) _j++;
        if (_j < len && s[_j] === '.') _j++;
        const _idStart = _j;
        while (_j < len && /[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(s[_j])) _j++;
        if (_j > _idStart) {
          let _k = _j;
          while (_k < len && (s[_k] === ' ' || s[_k] === '\t')) _k++;
          if (_k < len && s[_k] === '{') {
            out += op('t-kw', '#', '#mod');
            i++; continue;
          }
        }
      }

      // Numeral mode: #XY# where X and Y are the '0' and '9' digits of any Unicode digit
      // block (ASCII, Arabic-Indic, Devanagari, Klingon pIqaD U+F8F0–U+F8F9, etc.).
      // Must be checked before the two-char #0/#1 boolean patterns.
      {
        const _nmDig = (cp) => (cp !== undefined) &&
          (/^\p{Nd}$/u.test(String.fromCodePoint(cp)) || (cp >= 0xF8F0 && cp <= 0xF8F9));
        const _cp1 = s.codePointAt(i + 1);
        if (_nmDig(_cp1)) {
          const _j1 = i + 1 + (String.fromCodePoint(_cp1).length);
          const _cp2 = s.codePointAt(_j1);
          if (_nmDig(_cp2)) {
            const _j2 = _j1 + (String.fromCodePoint(_cp2).length);
            if (s[_j2] === '#') {
              out += op('t-kw', s.slice(i, _j2 + 1), '#num#');
              i = _j2 + 1; continue;
            }
          }
        }
      }

      // #0 / #1 — the booleans, after numeral mode so `#09#` is not read as `#0` + `9#`
      if (c1 === '0' || c1 === '1') { out += op('t-num', s.slice(i, i+2)); i += 2; continue; }
    }

    // Four-char operators — must precede all shorter checks
    const four = s.slice(i, i+4);
    if (four === '<<|?') { out += op('t-kw', '<<|?'); i+=4; continue; }

    // Three-char operators — must precede two-char checks
    const thr = s.slice(i, i+3);
    // I/O variants (green — same group as >> << in VS Code)
    if (thr === '>>~') { out += op('t-kw', '>>~'); i+=3; continue; }
    if (thr === '>>!') { out += op('t-kw', '>>!'); i+=3; continue; }
    if (thr === '>>?') { out += op('t-kw', '>>?'); i+=3; continue; }
    if (thr === '>>|') { out += op('t-kw', '>>|'); i+=3; continue; }
    if (thr === '<<|') { out += op('t-kw', '<<|'); i+=3; continue; }

    const two = s.slice(i, i+2);
    if (two === '>>') { out += op('t-kw', '>>'); i+=2; continue; }
    if (two === '<<') { out += op('t-kw', '<<'); i+=2; continue; }
    if (two === '<~') { out += op('t-kw', '<~'); i+=2; continue; }
    if (two === '<#') { out += op('t-kw', '<#'); i+=2; continue; }
    // Shell and script brackets: <\ cmd \>  and  </ file.zy />
    if (two === '<\\') { out += op('t-kw', '<\\'); i+=2; continue; }
    if (two === '</')  { out += op('t-kw', '</');  i+=2; continue; }
    // An orphan closer — the block's opener is on an earlier line, so it was never folded
    // into one span above. It still asks about the same construct as its opener.
    if (two === '/>')  { out += op('t-kw', '/>', '</');  i+=2; continue; }
    if (two === '_?') { out += op('t-kw', '_?'); i+=2; continue; }
    if (two === '??') { out += op('t-kw', '??'); i+=2; continue; }
    if (two === '!?') { out += op('t-kw', '!?'); i+=2; continue; }
    if (two === ':=') { out += op('t-op', ':='); i+=2; continue; }
    if (two === ':!') { out += op('t-kw', ':!'); i+=2; continue; }
    if (two === ':>') { out += op('t-kw', ':>'); i+=2; continue; }
    if (two === '::') { out += op('t-op', '::'); i+=2; continue; }
    if (two === '..') { out += op('t-op', '..'); i+=2; continue; }
    if (two === '==') { out += op('t-op', '=='); i+=2; continue; }
    if (two === '<>') { out += op('t-op', '<>'); i+=2; continue; }
    if (two === '<=') { out += op('t-op', '<='); i+=2; continue; }
    if (two === '>=') { out += op('t-op', '>='); i+=2; continue; }
    if (two === '&&') { out += op('t-op', '&&'); i+=2; continue; }
    if (two === '||') { out += op('t-op', '||'); i+=2; continue; }
    if (two === '->') { out += op('t-kw', '->'); i+=2; continue; }
    if (two === '=>') { out += op('t-kw', '=>'); i+=2; continue; }
    if (two === '><') { out += op('t-kw', '><'); i+=2; continue; }
    if (two === '|>') { out += op('t-op', '|>'); i+=2; continue; }
    if (two === '@!') { out += op('t-kw', '@!'); i+=2; continue; }
    if (two === '@>') { out += op('t-kw', '@>'); i+=2; continue; }
    if (two === '@:') { out += `<span class="t-kw">@:</span>`;         i+=2; continue; }
    if (two === '@~') { out += op('t-kw', '@~'); i+=2; continue; }
    if (two === '++') { out += op('t-op', '++'); i+=2; continue; }
    if (two === '--') { out += op('t-op', '--'); i+=2; continue; }
    if (two === '+=' || two === '-=' || two === '*=' ||
        two === '/=' || two === '%=' || two === '^=') {
      out += op('t-op', two, '+='); i+=2; continue;
    }

    const one = s[i];
    if (one === '?') { out += op('t-kw', '?');  i++; continue; }
    if (one === '@') { out += op('t-kw', '@');  i++; continue; }
    if (one === '¶') { out += op('t-kw', '¶');  i++; continue; }
    if (one === '_' && (i+1>=len || !/\w/.test(s[i+1]))) {
      out += op('t-kw', '_'); i++; continue;
    }
    if (one === '!') { out += op('t-op', '!');  i++; continue; }
    if (one === '|') { out += `<span class="t-op">|</span>`;   i++; continue; }
    if (one === '\\') {
      // \\ = newline constant, \> = shell-exec close, \ = lifetime-end
      if (s[i+1] === '\\') { out += op('t-kw', '\\\\'); i+=2; continue; }
      if (s[i+1] === '>')  { out += op('t-kw', '\\>', '<\\'); i+=2; continue; }
      out += op('t-kw', '\\'); i++; continue;
    }
    if (one === '$') {
      const sdollar3 = s.slice(i, i+3);
      // ConcatBuild `$++` must precede `$+`, or it is read as append followed by a plus.
      if (sdollar3 === '$++') { out += op('t-op', '$++'); i+=3; continue; }
      // Sort with direction: $^+ $^- (3-char, must precede $^ and $+/$-)
      if (sdollar3 === '$^+' || sdollar3 === '$^-') {
        out += op('t-op', sdollar3); i+=3; continue;
      }
      // Multi-char collection operators (3-char)
      if (sdollar3==='$+[' || sdollar3==='$-[') {
        out += op('t-op', sdollar3.slice(0,2) + '[', sdollar3); i+=3; continue;
      }
      if (sdollar3==='$~~' || sdollar3==='$!!' || sdollar3==='$--' || sdollar3==='$??') {
        out += op('t-op', sdollar3); i+=3; continue;
      }
      // Sort without direction: $^ (2-char, must precede single-char checks)
      if (s[i+1] === '^') { out += op('t-op', '$^'); i+=2; continue; }
      // Single-char collection operators: $# $+ $- $~ $? $[ $< $> $| $! $* $/
      if (i+1 < len && /[#+\-~?\[<>|!*/]/.test(s[i+1])) {
        out += op('t-op', s.slice(i,i+2)); i+=2; continue;
      }
      out += `<span class="t-op">$</span>`; i++; continue;
    }
    if (one === '°') { out += op('t-hot', '°'); i++; continue; }
    if (one === '<') { out += op('t-op', '<'); i++; continue; }
    if (one === '>') { out += op('t-op', '>'); i++; continue; }
    if (one === '&') { out += '&amp;'; i++; continue; }
    if (one === '+' || one === '-' || one === '*' || one === '/' ||
        one === '%' || one === '^') {
      out += op('t-op', one, '+'); i++; continue;
    }
    if (one === '=') { out += op('t-op', '='); i++; continue; }
    if (one === '.' ) { out += op('t-op', '.');         i++; continue; }
    if (one === ',' ) { out += `<span class="t-punct">,</span>`;     i++; continue; }
    if (one === ':' ) { out += `<span class="t-punct">:</span>`;     i++; continue; }
    if (one === ';' ) { out += op('t-punct', ';');      i++; continue; }
    if (one === '[' || one === ']') { out += op('t-br', one, '[');   i++; continue; }
    if (one === '{' || one === '}') { out += op('t-br', one, '{');   i++; continue; }
    if (one === '(' || one === ')') { out += op('t-br', one, '(');   i++; continue; }

    // Identifiers — code-point-aware (handles emoji surrogate pairs, Klingon PUA,
    // and every Unicode script). Mirrors the Zymbol lexer: accept anything that is
    // NOT whitespace, NOT a Unicode decimal digit at start, and NOT an operator char.
    // `°` belongs in that operator set: the lexer breaks an identifier on it (a trailing
    // `°` is the hot-definition marker), so `suma°` is `suma` plus an operator, and
    // leaving it out of the set made the marker invisible and unaskable.
    {
      const _cp0 = s.codePointAt(i);
      if (_cp0 !== undefined) {
        const _ch0 = String.fromCodePoint(_cp0);
        const _opRx = /[\s"'><!=+\-*/%^&|?:.,;()\[\]{}@~#$¶\\°]/u;
        if (!_opRx.test(_ch0) && !/^\p{Nd}$/u.test(_ch0)) {
          let j = i + _ch0.length;
          while (j < len) {
            const _cp2 = s.codePointAt(j);
            if (_cp2 === undefined) break;
            const _ch2 = String.fromCodePoint(_cp2);
            if (_opRx.test(_ch2)) break;
            j += _ch2.length;
          }
          const word = s.slice(i, j);
          let k = j; while (k < len && s[k] === ' ') k++;
          const isFn = k < len && s[k] === '(';
          // data-id, not data-h: an identifier's card is built from the program being
          // read, not from the dictionary of fixed operators.
          out += isFn
            ? `<span class="t-fn" data-id="${escAttr(word)}">${esc(word)}</span>`
            : `<span class="t-id" data-id="${escAttr(word)}">${esc(word)}</span>`;
          i = j; continue;
        }
      }
    }

    out += esc(one); i++;
  }
  return [out, inBlockComment];
}

export function highlightCode(code) {
  let inBlockComment = false;
  return code.split('\n').map((line, idx) => {
    const [html, nextState] = highlightLine(line, inBlockComment);
    inBlockComment = nextState;
    return `<span class="hl-line" data-l="${idx + 1}">${html}</span>`;
  }).join('\n');
}
