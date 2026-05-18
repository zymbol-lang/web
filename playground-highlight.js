// ─── Syntax highlighter ───────────────────────────────────────────────────────
export function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

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
        out += `<span class="t-num">${esc(s.slice(i,j))}</span>`;
        i = j; continue;
      }
      let j = i;
      while (j < len && /[\d.]/.test(s[j])) j++;
      out += `<span class="t-num">${esc(s.slice(i,j))}</span>`;
      i = j; continue;
    }

    // ##ErrorType — error type specifiers in catch clauses
    if (s[i] === '#' && s[i+1] === '#' && i+2 < len && /[A-Za-z_]/.test(s[i+2])) {
      let j = i+2;
      while (j < len && /[A-Za-z0-9_]/.test(s[j])) j++;
      out += `<span class="t-kw">${esc(s.slice(i,j))}</span>`;
      i = j; continue;
    }

    // # name { — module block declaration: highlight # as keyword
    if (s[i] === '#' && i+1 < len && (s[i+1] === ' ' || s[i+1] === '\t' || /[\p{L}_]/u.test(s[i+1]))) {
      let _j = i + 1;
      while (_j < len && (s[_j] === ' ' || s[_j] === '\t')) _j++;
      if (_j < len && s[_j] === '.') _j++;
      const _idStart = _j;
      while (_j < len && /[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(s[_j])) _j++;
      if (_j > _idStart) {
        let _k = _j;
        while (_k < len && (s[_k] === ' ' || s[_k] === '\t')) _k++;
        if (_k < len && s[_k] === '{') {
          out += `<span class="t-kw">#</span>`;
          i++; continue;
        }
      }
    }

    // Numeral mode: #XY# where X and Y are the '0' and '9' digits of any Unicode digit
    // block (ASCII, Arabic-Indic, Devanagari, Klingon pIqaD U+F8F0–U+F8F9, etc.).
    // Must be checked before the two-char #0/#1 boolean patterns.
    if (s[i] === '#') {
      const _nmDig = (cp) => (cp !== undefined) &&
        (/^\p{Nd}$/u.test(String.fromCodePoint(cp)) || (cp >= 0xF8F0 && cp <= 0xF8F9));
      const _cp1 = s.codePointAt(i + 1);
      if (_nmDig(_cp1)) {
        const _j1 = i + 1 + (String.fromCodePoint(_cp1).length);
        const _cp2 = s.codePointAt(_j1);
        if (_nmDig(_cp2)) {
          const _j2 = _j1 + (String.fromCodePoint(_cp2).length);
          if (s[_j2] === '#') {
            out += `<span class="t-kw">${esc(s.slice(i, _j2 + 1))}</span>`;
            i = _j2 + 1; continue;
          }
        }
      }
    }

    // Four-char operators — must precede all shorter checks
    const four = s.slice(i, i+4);
    if (four === '<<|?') { out += `<span class="t-kw">&lt;&lt;|?</span>`;   i+=4; continue; }

    // Three-char operators — must precede two-char checks
    const thr = s.slice(i, i+3);
    // I/O variants (green — same group as >> << in VS Code)
    if (thr === '>>~') { out += `<span class="t-kw">&gt;&gt;~</span>`;       i+=3; continue; }
    if (thr === '>>!') { out += `<span class="t-kw">&gt;&gt;!</span>`;       i+=3; continue; }
    if (thr === '>>?') { out += `<span class="t-kw">&gt;&gt;?</span>`;       i+=3; continue; }
    if (thr === '>>|') { out += `<span class="t-kw">&gt;&gt;|</span>`;       i+=3; continue; }
    if (thr === '<<|') { out += `<span class="t-kw">&lt;&lt;|</span>`;       i+=3; continue; }
    // Cast operators: ##. (float) ### (int) ##! (char) — blue like arithmetic
    if (thr === '##.') { out += `<span class="t-op">##.</span>`;              i+=3; continue; }
    if (thr === '###') { out += `<span class="t-op">###</span>`;              i+=3; continue; }
    if (thr === '##!') { out += `<span class="t-op">##!</span>`;              i+=3; continue; }

    const two = s.slice(i, i+2);
    if (two === '>>') { out += `<span class="t-kw">&gt;&gt;</span>`; i+=2; continue; }
    if (two === '<<') { out += `<span class="t-kw">&lt;&lt;</span>`; i+=2; continue; }
    if (two === '<~') { out += `<span class="t-kw">&lt;~</span>`;    i+=2; continue; }
    if (two === '<#') { out += `<span class="t-kw">&lt;#</span>`;    i+=2; continue; }
    if (two === '<\\') { out += `<span class="t-kw">&lt;\\</span>`;  i+=2; continue; }
    if (two === '_?') { out += `<span class="t-kw">_?</span>`;       i+=2; continue; }
    if (two === '??') { out += `<span class="t-kw">??</span>`;       i+=2; continue; }
    if (two === '!?') { out += `<span class="t-kw">!?</span>`;       i+=2; continue; }
    if (two === ':=') { out += `<span class="t-op">:=</span>`;       i+=2; continue; }
    if (two === ':!') { out += `<span class="t-kw">:!</span>`;        i+=2; continue; }
    if (two === ':>') { out += `<span class="t-kw">:&gt;</span>`;    i+=2; continue; }
    if (two === '::') { out += `<span class="t-op">::</span>`;        i+=2; continue; }
    if (two === '..') { out += `<span class="t-op">..</span>`;        i+=2; continue; }
    if (two === '==') { out += `<span class="t-op">==</span>`;        i+=2; continue; }
    if (two === '<>') { out += `<span class="t-op">&lt;&gt;</span>`;  i+=2; continue; }
    if (two === '<=') { out += `<span class="t-op">&lt;=</span>`;    i+=2; continue; }
    if (two === '>=') { out += `<span class="t-op">&gt;=</span>`;    i+=2; continue; }
    if (two === '&&') { out += `<span class="t-op">&amp;&amp;</span>`; i+=2; continue; }
    if (two === '||') { out += `<span class="t-op">||</span>`;        i+=2; continue; }
    if (two === '->') { out += `<span class="t-kw">-&gt;</span>`;    i+=2; continue; }
    if (two === '=>') { out += `<span class="t-kw">=&gt;</span>`;    i+=2; continue; }
    if (two === '><') { out += `<span class="t-kw">&gt;&lt;</span>`; i+=2; continue; }
    if (two === '|>') { out += `<span class="t-op">|&gt;</span>`;    i+=2; continue; }
    if (two === '#>') { out += `<span class="t-kw">#&gt;</span>`;    i+=2; continue; }
    if (two === '#?') { out += `<span class="t-op">#?</span>`;        i+=2; continue; }
    if (two === '@!') { out += `<span class="t-kw">@!</span>`;        i+=2; continue; }
    if (two === '@>') { out += `<span class="t-kw">@&gt;</span>`;    i+=2; continue; }
    if (two === '@:') { out += `<span class="t-kw">@:</span>`;        i+=2; continue; }
    if (two === '@~') { out += `<span class="t-kw">@~</span>`;        i+=2; continue; }
    if (two === '#0') { out += `<span class="t-num">#0</span>`;       i+=2; continue; }
    if (two === '#1') { out += `<span class="t-num">#1</span>`;       i+=2; continue; }
    if (two === '++') { out += `<span class="t-op">++</span>`;        i+=2; continue; }
    if (two === '--') { out += `<span class="t-op">--</span>`;        i+=2; continue; }
    if (two === '+=') { out += `<span class="t-op">+=</span>`;        i+=2; continue; }
    if (two === '-=') { out += `<span class="t-op">-=</span>`;        i+=2; continue; }
    if (two === '*=') { out += `<span class="t-op">*=</span>`;        i+=2; continue; }
    if (two === '/=') { out += `<span class="t-op">/=</span>`;        i+=2; continue; }
    if (two === '%=') { out += `<span class="t-op">%=</span>`;        i+=2; continue; }
    if (two === '^=') { out += `<span class="t-op">^=</span>`;        i+=2; continue; }

    const one = s[i];
    if (one === '?') { out += `<span class="t-kw">?</span>`;  i++; continue; }
    if (one === '@') { out += `<span class="t-kw">@</span>`;  i++; continue; }
    if (one === '¶') { out += `<span class="t-kw">¶</span>`;  i++; continue; }
    if (one === '_' && (i+1>=len || !/\w/.test(s[i+1]))) {
      out += `<span class="t-kw">_</span>`; i++; continue;
    }
    if (one === '!') { out += `<span class="t-op">!</span>`;   i++; continue; }
    if (one === '|') { out += `<span class="t-op">|</span>`;   i++; continue; }
    if (one === '\\') {
      // \\ = newline constant, \> = script-exec close, \ = lifetime-end
      if (s[i+1] === '\\') { out += `<span class="t-kw">\\\\</span>`; i+=2; continue; }
      if (s[i+1] === '>') { out += `<span class="t-kw">\\&gt;</span>`; i+=2; continue; }
      out += `<span class="t-kw">\\</span>`; i++; continue;
    }
    if (one === '$') {
      const sdollar3 = s.slice(i, i+3);
      // Sort with direction: $^+ $^- (3-char, must precede $^ and $+/$-)
      if (sdollar3 === '$^+' || sdollar3 === '$^-') {
        out += `<span class="t-op">${esc(sdollar3)}</span>`; i+=3; continue;
      }
      // Multi-char collection operators (3-char)
      if (sdollar3==='$+[' || sdollar3==='$-[' || sdollar3==='$~~' || sdollar3==='$!!') {
        out += `<span class="t-op">${esc(sdollar3)}</span>`; i+=3; continue;
      }
      if (sdollar3==='$--' || sdollar3==='$??') {
        out += `<span class="t-op">${esc(sdollar3)}</span>`; i+=3; continue;
      }
      // Sort without direction: $^ (2-char, must precede single-char checks)
      if (s[i+1] === '^') {
        out += `<span class="t-op">$^</span>`; i+=2; continue;
      }
      // Single-char collection operators: $# $+ $- $~ $? $[ $< $> $| $! $* $/
      if (i+1 < len && /[#+\-~?\[<>|!*/]/.test(s[i+1])) {
        out += `<span class="t-op">${esc(s.slice(i,i+2))}</span>`; i+=2; continue;
      }
      out += `<span class="t-op">$</span>`; i++; continue;
    }
    if (one === '°') { out += `<span class="t-hot">°</span>`; i++; continue; }
    if (one === '<') { out += `<span class="t-op">&lt;</span>`; i++; continue; }
    if (one === '>') { out += `<span class="t-op">&gt;</span>`; i++; continue; }
    if (one === '&') { out += '&amp;'; i++; continue; }
    if (one === '+' || one === '-' || one === '*' || one === '/' ||
        one === '%' || one === '^' || one === '=') {
      out += `<span class="t-op">${esc(one)}</span>`; i++; continue;
    }
    if (one === '.' ) { out += `<span class="t-op">.</span>`;        i++; continue; }
    if (one === ',' ) { out += `<span class="t-punct">,</span>`;     i++; continue; }
    if (one === ':' ) { out += `<span class="t-punct">:</span>`;     i++; continue; }
    if (one === '{' || one === '}' || one === '[' || one === ']' || one === '(' || one === ')') {
      out += `<span class="t-br">${esc(one)}</span>`; i++; continue;
    }

    // Identifiers — code-point-aware (handles emoji surrogate pairs, Klingon PUA,
    // and every Unicode script). Mirrors the Zymbol lexer: accept anything that is
    // NOT whitespace, NOT a Unicode decimal digit at start, and NOT an operator char.
    {
      const _cp0 = s.codePointAt(i);
      if (_cp0 !== undefined) {
        const _ch0 = String.fromCodePoint(_cp0);
        const _opRx = /[\s"'><!=+\-*/%^&|?:.,;()\[\]{}@~#$¶\\]/u;
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
          out += isFn
            ? `<span class="t-fn">${esc(word)}</span>`
            : `<span class="t-id">${esc(word)}</span>`;
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
  return code.split('\n').map(line => {
    const [html, nextState] = highlightLine(line, inBlockComment);
    inBlockComment = nextState;
    return html;
  }).join('\n');
}
