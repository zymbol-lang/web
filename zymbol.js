/**
 * zymbol.js — Browser interpreter for the Zymbol playground
 *
 * v0.0.4: 1-based indexing, multi-dimensional navigation (arr[i>j>k]),
 * type-cast operators (##. ### ##!), string split ($/), ConcatBuild ($++),
 * explicit lifetime end (\ var).
 *
 * v0.0.5: string repeat ($*), hot definition (°), module alias (:), sleep (@~),
 * labeled loops (@:label { } / @:label! / @:label>), TUI canvas operators
 * (>>! >>? >>~ <<| <<|? >>|), caught error values (##_(...)), hotDef scope fix.
 *
 * CLI args (><): supported — pass cliArgs array to runZymbol().
 * BashExec (<\ \>): returns high-resolution timestamp (entropy stub).
 * Not supported: shell inclusion (</ />).
 * TUI operators require a >>| { } block to activate the canvas overlay.
 */

// ─── Unicode digit blocks (mirrors DIGIT_BLOCKS in zymbol-lexer) ─────────────
const DIGIT_BLOCKS = [
  [0x0030,'ASCII'],[0x0660,'Arabic-Indic'],[0x06F0,'Ext. Arabic-Indic'],
  [0x07C0,'NKo'],[0x0966,'Devanagari'],[0x09E6,'Bengali'],[0x0A66,'Gurmukhi'],
  [0x0AE6,'Gujarati'],[0x0B66,'Oriya'],[0x0BE6,'Tamil'],[0x0C66,'Telugu'],
  [0x0CE6,'Kannada'],[0x0D66,'Malayalam'],[0x0DE6,'Sinhala Archaic'],
  [0x0E50,'Thai'],[0x0ED0,'Lao'],[0x0F20,'Tibetan'],[0x1040,'Myanmar'],
  [0x1090,'Myanmar Shan'],[0x17E0,'Khmer'],[0x1810,'Mongolian'],
  [0x1946,'Limbu'],[0x19D0,'New Tai Lue'],[0x1A80,'Tai Tham Hora'],
  [0x1A90,'Tai Tham Tham'],[0x1B50,'Balinese'],[0x1BB0,'Sundanese'],
  [0x1C40,'Lepcha'],[0x1C50,'Ol Chiki'],[0xA620,'Vai'],[0xA8D0,'Saurashtra'],
  [0xA900,'Kayah Li'],[0xA9D0,'Javanese'],[0xA9F0,'Myanmar Tai Laing'],
  [0xAA50,'Cham'],[0xABF0,'Meetei Mayek'],[0xF8F0,'Klingon pIqaD'],
  [0xFF10,'Fullwidth'],[0x104A0,'Osmanya'],[0x10D30,'Hanifi Rohingya'],
  [0x11066,'Brahmi'],[0x110F0,'Sora Sompeng'],[0x11136,'Chakma'],
  [0x111D0,'Sharada'],[0x112F0,'Khudawadi'],[0x11450,'Newa'],
  [0x114D0,'Tirhuta'],[0x11650,'Modi'],[0x116C0,'Takri'],[0x11730,'Ahom'],
  [0x118E0,'Warang Citi'],[0x11950,'Dives Akuru'],[0x11C50,'Bhaiksuki'],
  [0x11D50,'Masaram Gondi'],[0x11DA0,'Gunjala Gondi'],[0x11F50,'Kawi'],
  [0x16A60,'Mro'],[0x16AC0,'Tangsa'],[0x16B50,'Pahawh Hmong'],
  [0x1D7CE,'Mathematical Bold'],[0x1D7D8,'Mathematical Double-struck'],
  [0x1D7E2,'Mathematical Sans-serif'],[0x1D7EC,'Math Sans-serif Bold'],
  [0x1D7F6,'Mathematical Monospace'],[0x1E140,'Nyiakeng Puachue Hmong'],
  [0x1E2F0,'Wancho'],[0x1E4F0,'Nag Mundari'],[0x1E950,'Adlam'],
  [0x1FBF0,'Segmented/LCD'],
];

function digitValue(ch) {
  const cp = ch.codePointAt(0);
  for (const [base] of DIGIT_BLOCKS) {
    if (cp >= base && cp <= base + 9) return cp - base;
  }
  return -1;
}

function digitBlockBase(ch) {
  const cp = ch.codePointAt(0);
  for (const [base] of DIGIT_BLOCKS) {
    if (cp >= base && cp <= base + 9) return base;
  }
  return -1;
}

function mapToScript(s, blockBase) {
  if (blockBase === 0x0030) return s;
  return [...s].map(ch => {
    if (ch >= '0' && ch <= '9') return String.fromCodePoint(blockBase + (ch.charCodeAt(0) - 0x30));
    return ch;
  }).join('');
}

function numeralInt(n, base)   { return mapToScript(String(Math.trunc(n)), base); }
function numeralFloat(f, base) { return mapToScript(String(f), base); }
function numeralBool(b, base)  { return '#' + numeralInt(b ? 1 : 0, base); }

// ─── Signal types ─────────────────────────────────────────────────────────────

class ZyReturn  { constructor(value) { this.value = value; } }
class ZyBreak    { constructor(label = null) { this.label = label; } }
class ZyContinue { constructor(label = null) { this.label = label; } }
class ZyErrorPropagate { constructor(errVal) { this.errVal = errVal; } }
class ZyError extends Error {
  constructor(msg, line) {
    super(line ? `Line ${line}: ${msg}` : msg);
    this.zyLine = line;
  }
}
class ZyRuntimeError extends ZyError {
  constructor(msg, errType = '##_', line) {
    super(msg, line);
    this.errType = errType;
  }
}
class ZyStaticError extends Error {
  constructor(msg) { super(msg); }
}

// ─── Lexer ────────────────────────────────────────────────────────────────────

export class Lexer {
  constructor(src) {
    this.src = [...src];
    this.pos = 0;
    this.line = 1;
  }

  ch(offset = 0) { return this.src[this.pos + offset] ?? ''; }

  consume() {
    const c = this.src[this.pos++];
    if (c === '\n') this.line++;
    return c;
  }

  tokenize() {
    const toks = [];
    const tok = (type, value) => toks.push({ type, value, line: this.line });

    while (this.pos < this.src.length) {
      if (/[ \t\r\n]/.test(this.ch())) { this.consume(); continue; }

      // comment
      if (this.ch() === '/' && this.ch(1) === '/') {
        while (this.pos < this.src.length && this.ch() !== '\n') this.consume();
        continue;
      }
      // block comment /* ... */
      if (this.ch() === '/' && this.ch(1) === '*') {
        this.consume(); this.consume();
        while (this.pos < this.src.length) {
          if (this.ch() === '*' && this.ch(1) === '/') { this.consume(); this.consume(); break; }
          this.consume();
        }
        continue;
      }

      // # — mode-switch, booleans, cast ops, data ops, error types
      if (this.ch() === '#') {
        const c1 = this.ch(1);
        const dv1 = digitValue(c1);
        if (dv1 >= 0) {
          if (dv1 === 0) {
            const c2 = this.ch(2);
            const dv2 = digitValue(c2);
            if (dv2 === 9 && digitBlockBase(c1) === digitBlockBase(c2) && this.ch(3) === '#') {
              const base = digitBlockBase(c1);
              this.consume(); this.consume(); this.consume(); this.consume();
              tok('SET_NUMERAL_MODE', base); continue;
            }
          }
          this.consume(); this.consume();
          if (dv1 === 0) { tok('BOOL', false); continue; }
          if (dv1 === 1) { tok('BOOL', true);  continue; }
          continue;
        }
        if (c1 === '#') {
          // ##. → CAST_FLOAT, ### → CAST_INT_ROUND, ##! → CAST_INT_TRUNC, else ##xxx IDENT
          const c2 = this.ch(2);
          this.consume(); this.consume(); // consume ##
          if (c2 === '.') { this.consume(); tok('CAST_FLOAT',     '##.'); continue; }
          if (c2 === '#') { this.consume(); tok('CAST_INT_ROUND', '###'); continue; }
          if (c2 === '!') { this.consume(); tok('CAST_INT_TRUNC', '##!'); continue; }
          let name = '##';
          while (/[A-Za-z0-9_]/.test(this.ch())) { name += this.ch(); this.consume(); }
          tok('IDENT', name); continue;
        }
        if (c1 === '?') {
          this.consume(); this.consume();
          tok('TYPE_QUERY', '#?'); continue;
        }
        {
          let kind = null, prec = null, advance = 0;
          const readDigits = start => {
            let d = '', i = start;
            while (/[0-9]/.test(this.ch(i))) { d += this.ch(i); i++; }
            return { d, i };
          };
          if (c1 === '|') {
            kind = 'eval'; advance = 2;
          } else if (c1 === '.') {
            const { d, i } = readDigits(2);
            if (d.length > 0 && this.ch(i) === '|') { kind = 'round'; prec = parseInt(d); advance = i + 1; }
          } else if (c1 === '!') {
            const { d, i } = readDigits(2);
            if (d.length > 0 && this.ch(i) === '|') { kind = 'trunc'; prec = parseInt(d); advance = i + 1; }
          } else if (c1 === ',') {
            const c2 = this.ch(2);
            if (c2 === '|') { kind = 'comma'; advance = 3; }
            else if (c2 === '.') { const { d, i } = readDigits(3); if (d.length > 0 && this.ch(i) === '|') { kind = 'comma_round'; prec = parseInt(d); advance = i + 1; } }
            else if (c2 === '!') { const { d, i } = readDigits(3); if (d.length > 0 && this.ch(i) === '|') { kind = 'comma_trunc'; prec = parseInt(d); advance = i + 1; } }
          } else if (c1 === '^') {
            const c2 = this.ch(2);
            if (c2 === '|') { kind = 'sci'; advance = 3; }
            else if (c2 === '.') { const { d, i } = readDigits(3); if (d.length > 0 && this.ch(i) === '|') { kind = 'sci_round'; prec = parseInt(d); advance = i + 1; } }
            else if (c2 === '!') { const { d, i } = readDigits(3); if (d.length > 0 && this.ch(i) === '|') { kind = 'sci_trunc'; prec = parseInt(d); advance = i + 1; } }
          }
          if (kind !== null) {
            for (let i = 0; i < advance; i++) this.consume();
            tok('DATA_OP', { kind, prec }); continue;
          }
        }
        // # followed by space/letter/dot: module block `# name {` or old-style comment
        if (c1 === ' ' || c1 === '.' || /[\p{L}_]/u.test(c1)) {
          // Lookahead: check for # [.] name { (new module block syntax)
          let _j = this.pos + 1;
          while (_j < this.src.length && (this.src[_j] === ' ' || this.src[_j] === '\t')) _j++;
          if (_j < this.src.length && this.src[_j] === '.') _j++; // optional leading dot
          const _idStart = _j;
          while (_j < this.src.length && /[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(this.src[_j])) _j++;
          if (_j > _idStart) {
            let _k = _j;
            while (_k < this.src.length && (this.src[_k] === ' ' || this.src[_k] === '\t')) _k++;
            if (_k < this.src.length && this.src[_k] === '{') {
              this.consume(); // consume #
              tok('HASH', '#'); continue;
            }
          }
          // Old-style header: skip to EOL
          while (this.pos < this.src.length && this.src[this.pos] !== '\n') this.consume();
          continue;
        }
        // #> = export block declarator
        if (c1 === '>') { this.consume(); this.consume(); tok('EXPORT_DECL', '#>'); continue; }
        this.consume(); continue;
      }

      // BashExec <\ cmd \> — browser-only: captures command text, simulates common date/echo
      if (this.ch() === '<' && this.ch(1) === '\\') {
        this.consume(); this.consume(); // consume <\
        let _cmd = '';
        while (this.pos < this.src.length) {
          if (this.ch() === '\\' && this.ch(1) === '>') { this.consume(); this.consume(); break; }
          _cmd += this.consume();
        }
        tok('BASHEXEC', _cmd.trim()); continue;
      }

      // TUI operators (3-4 chars) — must come before twoMap so >> and << aren't consumed first
      if (this.ch() === '>' && this.ch(1) === '>') {
        const c2 = this.ch(2);
        if (c2 === '!') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_CLEAR', '>>!'); continue; }
        if (c2 === '?') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_QUERY', '>>?'); continue; }
        if (c2 === '~') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_POS',   '>>~'); continue; }
        if (c2 === '|') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_GATE',  '>>|'); continue; }
      }
      if (this.ch() === '<' && this.ch(1) === '<' && this.ch(2) === '|') {
        if (this.ch(3) === '?') {
          this.consume(); this.consume(); this.consume(); this.consume();
          tok('KEY_NONBLOCK', '<<|?'); continue;
        }
        this.consume(); this.consume(); this.consume();
        tok('KEY_BLOCK', '<<|'); continue;
      }

      // two-char operators
      const two = this.ch(0) + this.ch(1);
      const twoMap = {
        '>>': 'OUTPUT', '<<': 'INPUT',  '<~': 'RETURN',
        '<#': 'IMPORT',
        '@!': 'BREAK',  '@>': 'CONTINUE', '@~': 'ATSLEEP',
        '??': 'MATCH',  '_?': 'ELSEIF', ':=': 'CONST_ASSIGN',
        '..': 'RANGE',  '==': 'EQ',     '<>': 'NEQ',
        '<=': 'LTE',    '>=': 'GTE',    '&&': 'AND',
        '||': 'OR',     '++': 'INC',    '--': 'DEC',
        '+=': 'PLUS_EQ',  '-=': 'MINUS_EQ', '*=': 'TIMES_EQ',
        '/=': 'DIV_EQ',   '%=': 'MOD_EQ',   '^=': 'POW_EQ',
        '->': 'ARROW',  '=>': 'FAT_ARROW',  '|>': 'PIPE',
        '!?': 'TRY',    ':!': 'CATCH',  ':>': 'FINALLY',
        '::': 'SCOPE',
        '\\\\': 'NEWLINE_ESC',
        '><': 'CLI_ARGS',
      };
      if (twoMap[two]) {
        this.consume(); this.consume();
        tok(twoMap[two], two);
        continue;
      }

      const c = this.ch();

      if (c === '_') {
        if (/[\p{L}\p{Co}0-9_]/u.test(this.ch(1))) { this.readIdent(toks); }
        else { this.consume(); tok('ELSE', '_'); }
        continue;
      }

      if (c === '?') { this.consume(); tok('IF',     '?'); continue; }
      if (c === '@') {
        this.consume();
        if (this.ch() === ':') {
          // @:label — labeled loop, break, or continue
          this.consume();
          let label = '';
          while (/[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(this.ch())) label += this.consume();
          if (this.ch() === '!') { this.consume(); tok('AT_BREAK', label); }
          else if (this.ch() === '>') { this.consume(); tok('AT_CONT',  label); }
          else tok('AT_LABEL', label);
        } else if (/[\p{L}\p{M}\p{So}\p{Co}_]/u.test(this.ch())) {
          // @label (legacy: label without colon)
          let label = '';
          while (/[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(this.ch())) label += this.consume();
          tok('AT_LABEL', label);
        } else {
          tok('AT', '@');
        }
        continue;
      }
      if (c === '¶') { this.consume(); tok('PILCROW','¶'); continue; }

      // $ collection operators
      if (c === '$') {
        const a = this.ch(1), b = this.ch(2);
        if (a === '+' && b === '+')         { this.consume(); this.consume(); this.consume(); tok('DCONCATBUILD','$++'); continue; }
        if (a === '#')                      { this.consume(); this.consume();               tok('DLEN',        '$#');  continue; }
        if (a === '?' && b === '?')         { this.consume(); this.consume(); this.consume(); tok('DFINDALL',  '$??'); continue; }
        if (a === '?')                      { this.consume(); this.consume();               tok('DCONTAINS',  '$?');  continue; }
        if (a === '-' && b === '-')         { this.consume(); this.consume(); this.consume(); tok('DREMOVEALL','$--'); continue; }
        if (a === '-')                      { this.consume(); this.consume();               tok('DREMOVE',    '$-');  continue; }
        if (a === '+')                      { this.consume(); this.consume();               tok('DAPPEND',    '$+');  continue; }
        if (a === '*')                      { this.consume(); this.consume();               tok('DREPEAT',    '$*');  continue; }
        if (a === '/' )                     { this.consume(); this.consume();               tok('DSPLIT',     '$/');  continue; }
        if (a === '^' && b === '+')         { this.consume(); this.consume(); this.consume(); tok('DSORTASC', '$^+'); continue; }
        if (a === '^' && b === '-')         { this.consume(); this.consume(); this.consume(); tok('DSORTDESC','$^-'); continue; }
        if (a === '^')                      { this.consume(); this.consume();               tok('DSORT',      '$^');  continue; }
        if (a === '>')                      { this.consume(); this.consume();               tok('DMAP',       '$>');  continue; }
        if (a === '|')                      { this.consume(); this.consume();               tok('DFILTER',    '$|');  continue; }
        if (a === '<')                      { this.consume(); this.consume();               tok('DREDUCE',    '$<');  continue; }
        if (a === '~' && b === '~')         { this.consume(); this.consume(); this.consume(); tok('DREPLACE', '$~~'); continue; }
        if (a === '~')                      { this.consume(); this.consume();               tok('DUPDATE',    '$~');  continue; }
        if (a === '[')                      { this.consume();                               tok('DSLICE',     '$[');  continue; }
        if (a === '!' && b === '!')         { this.consume(); this.consume(); this.consume(); tok('DERRORPROP','$!!'); continue; }
        if (a === '!')                      { this.consume(); this.consume();               tok('DERROR',     '$!');  continue; }
        this.consume(); continue;
      }

      if (/[0-9]/.test(c) || digitValue(c) >= 0) { this.readNumber(toks); continue; }
      if (c === '"') { this.readString(toks); continue; }
      if (c === "'") { this.readChar(toks); continue; }
      if (/[\p{L}\p{M}\p{So}\p{Co}]/u.test(c)) { this.readIdent(toks); continue; }

      const single = {
        '=':'ASSIGN', '<':'LT', '>':'GT',
        '+':'PLUS',   '-':'MINUS', '*':'TIMES', '/':'DIV', '%':'MOD', '^':'POW',
        '!':'NOT',    '|':'VBAR',
        '(':'LPAREN', ')':'RPAREN', '[':'LBRACKET', ']':'RBRACKET',
        '{':'LBRACE', '}':'RBRACE',
        ',':'COMMA',  ':':'COLON', '.':'DOT', ';':'SEMI', '\\':'BACKSLASH',
      };
      if (single[c]) { this.consume(); tok(single[c], c); continue; }

      this.consume();
    }

    tok('EOF', null);
    return toks;
  }

  readNumber(toks) {
    // Handle base literals: 0x (hex), 0b (binary), 0o (octal), 0d (decimal explicit)
    if (this.ch() === '0') {
      const next = this.ch(1);
      if (next === 'x' || next === 'X') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 16 }, line: this.line }); return; }
        this.consume(); this.consume();
        let hex = '';
        while (/[0-9a-fA-F]/.test(this.ch())) hex += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(hex, 16)), line: this.line }); return;
      }
      if (next === 'b' || next === 'B') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 2 }, line: this.line }); return; }
        this.consume(); this.consume();
        let bin = '';
        while (this.ch() === '0' || this.ch() === '1') bin += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(bin, 2)), line: this.line }); return;
      }
      if (next === 'o' || next === 'O') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 8 }, line: this.line }); return; }
        this.consume(); this.consume();
        let oct = '';
        while (/[0-7]/.test(this.ch())) oct += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(oct, 8)), line: this.line }); return;
      }
      if (next === 'd' || next === 'D') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 10 }, line: this.line }); return; }
        this.consume(); this.consume();
        let dec = '';
        while (/[0-9]/.test(this.ch())) dec += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(dec, 10)), line: this.line }); return;
      }
    }
    let value = 0;
    while (this.pos < this.src.length) {
      const dv = digitValue(this.ch());
      if (dv < 0) break;
      value = value * 10 + dv;
      this.consume();
    }
    if (this.ch() === '.' && this.ch(1) !== '.') {
      this.consume();
      let frac = 0, div = 1;
      while (this.pos < this.src.length) {
        const dv = digitValue(this.ch());
        if (dv < 0) break;
        frac = frac * 10 + dv;
        div *= 10;
        this.consume();
      }
      const f = value + frac / div;
      let sci = '';
      if (this.ch() === 'e' || this.ch() === 'E') {
        sci += this.consume();
        if (this.ch() === '+' || this.ch() === '-') sci += this.consume();
        while (/[0-9]/.test(this.ch())) sci += this.consume();
      }
      toks.push({ type: 'FLOAT', value: sci ? parseFloat(f + sci) : f, line: this.line });
    } else {
      toks.push({ type: 'NUM', value, line: this.line });
    }
  }

  readString(toks) {
    this.consume(); // opening "
    const parts = [];
    let cur = '';
    while (this.pos < this.src.length && this.ch() !== '"') {
      if (this.ch() === '\\') {
        this.consume();
        const e = this.consume();
        // \{ and \} produce literal braces (not interpolation delimiters)
        cur += e === 'n' ? '\n' : e === 't' ? '\t' : e;
      } else if (this.ch() === '{') {
        if (cur) { parts.push({ t: 'lit', v: cur }); cur = ''; }
        this.consume();
        let depth = 1, inner = '';
        while (this.pos < this.src.length && depth > 0) {
          const ch = this.consume();
          if      (ch === '{') { depth++; inner += ch; }
          else if (ch === '}') { depth--; if (depth > 0) inner += ch; }
          else inner += ch;
        }
        parts.push({ t: 'expr', v: inner });
      } else {
        cur += this.consume();
      }
    }
    if (this.pos < this.src.length) this.consume(); // closing "
    if (cur) parts.push({ t: 'lit', v: cur });
    toks.push({ type: 'STR', value: parts, line: this.line });
  }

  readChar(toks) {
    this.consume();
    let ch = '';
    if (this.ch() === '\\') { this.consume(); ch = this.consume(); }
    else ch = this.consume();
    if (this.ch() === "'") this.consume();
    toks.push({ type: 'CHAR', value: ch, line: this.line });
  }

  readIdent(toks) {
    let s = '';
    while (true) {
      const c = this.ch();
      if (!c) break;
      if (c === '°') break; // hot-def suffix — consumed below, not part of name
      if (digitValue(c) >= 0 && !(c >= '0' && c <= '9')) break;
      if (/[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(c)) { s += this.consume(); continue; }
      break;
    }
    const hot = this.ch() === '°';
    if (hot) this.consume();
    toks.push({ type: 'IDENT', value: s, hot, line: this.line });
  }
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export class Parser {
  constructor(tokens) {
    this.toks = tokens;
    this.pos  = 0;
  }

  peek(n = 0) { return this.toks[Math.min(this.pos + n, this.toks.length - 1)]; }
  adv() {
    const t = this.toks[this.pos];
    if (this.pos < this.toks.length - 1) this.pos++;
    return t;
  }
  check(type) { return this.peek().type === type; }
  match(...types) { return types.includes(this.peek().type) ? this.adv() : null; }
  eat(type, msg) {
    if (!this.check(type))
      throw new ZyError(msg ?? `Expected ${type}, got '${this.peek().value ?? this.peek().type}'`, this.peek().line);
    return this.adv();
  }

  parse() { return { type: 'Program', body: this.parseStmtList() }; }

  parseStmtList() {
    const stmts = [];
    while (!this.check('EOF') && !this.check('RBRACE')) {
      const s = this.parseStmt();
      if (s) stmts.push(s);
    }
    return stmts;
  }

  parseBlock() {
    this.eat('LBRACE');
    const stmts = this.parseStmtList();
    this.eat('RBRACE');
    return stmts;
  }

  parseModuleBlock() {
    this.adv(); // consume HASH
    let name = '';
    if (this.check('DOT')) { this.adv(); name += '.'; }
    name += this.eat('IDENT').value;
    this.eat('LBRACE');
    const body = this.parseStmtList();
    this.eat('RBRACE');
    return { type: 'ModuleBlock', name, body };
  }

  parseImport() {
    this.adv(); // consume <#
    // Parse path: ./name, ../name, ./dir/name, or string literal
    let path = '';
    if (this.check('DOT')) {
      this.adv(); this.eat('DIV'); // consume . and /
      path = './' + this.eat('IDENT').value;
      while (this.check('DIV')) { this.adv(); path += '/' + this.eat('IDENT').value; }
    } else if (this.check('RANGE')) {
      this.adv(); this.eat('DIV'); // consume .. and /
      let ups = 1;
      while (this.check('RANGE')) { this.adv(); this.eat('DIV'); ups++; }
      path = '../'.repeat(ups) + this.eat('IDENT').value;
      while (this.check('DIV')) { this.adv(); path += '/' + this.eat('IDENT').value; }
    } else if (this.check('STR')) {
      path = this.adv().value;
    } else {
      path = this.eat('IDENT').value;
    }
    this.eat('FAT_ARROW'); // consume =>
    const alias = this.eat('IDENT').value;
    return { type: 'Import', path, alias };
  }

  parseStmt() {
    const t = this.peek();

    if (t.type === 'SET_NUMERAL_MODE') { this.adv(); return { type: 'SetNumeralMode', base: t.value }; }
    if (t.type === 'IMPORT') return this.parseImport();
    if (t.type === 'EXPORT_DECL') {
      this.adv();
      const names = []; // { kind:'own'|'reexport', internal, alias?, member?, exported }
      if (this.check('LBRACE')) {
        this.adv();
        while (!this.check('RBRACE') && !this.check('EOF')) {
          if (this.check('IDENT')) {
            const first = this.adv().value;
            if (this.check('SCOPE') || this.check('DOT')) {
              // Re-export: alias::member or alias.member
              this.adv();
              const member = this.check('IDENT') ? this.adv().value : first;
              const exported = this.check('FAT_ARROW') ? (this.adv(), this.check('IDENT') ? this.adv().value : member) : member;
              names.push({ kind: 'reexport', alias: first, member, exported });
            } else {
              const exported = this.check('FAT_ARROW') ? (this.adv(), this.check('IDENT') ? this.adv().value : first) : first;
              names.push({ kind: 'own', internal: first, exported });
            }
          } else {
            this.adv();
          }
        }
        this.match('RBRACE');
      }
      return { type: 'ExportDecl', names };
    }
    if (t.type === 'OUTPUT')   return this.parseOutput();
    if (t.type === 'INPUT')    return this.parseInput();
    if (t.type === 'RETURN')   return this.parseReturn();
    if (t.type === 'BREAK')    { this.adv(); const bl = this.check('IDENT') ? this.adv().value : null; return { type: 'Break',    label: bl }; }
    if (t.type === 'CONTINUE') { this.adv(); const cl = this.check('IDENT') ? this.adv().value : null; return { type: 'Continue', label: cl }; }
    if (t.type === 'AT_BREAK') { const lbl = this.adv().value; return { type: 'Break',    label: lbl }; }
    if (t.type === 'AT_CONT')  { const lbl = this.adv().value; return { type: 'Continue', label: lbl }; }
    if (t.type === 'ATSLEEP')    { this.adv(); return { type: 'Sleep', duration: this.parseExpr() }; }
    if (t.type === 'CLI_ARGS')    { this.adv(); return { type: 'CliArgs', variable: this.eat('IDENT').value }; }
    if (t.type === 'OUTPUT_CLEAR') { this.adv(); return { type: 'ClearScreen' }; }
    if (t.type === 'OUTPUT_GATE')  return this.parseTuiBlock();
    if (t.type === 'OUTPUT_POS')   return this.parseOutputPos();
    if (t.type === 'KEY_BLOCK')    return this.parseKeyInput(true);
    if (t.type === 'KEY_NONBLOCK') return this.parseKeyInput(false);
    if (t.type === 'IF')       return this.parseIf();
    if (t.type === 'MATCH')    return { type: 'ExprStmt', expr: this.parseMatchExpr() };
    if (t.type === 'AT')       { this.adv(); return this.parseLoop(); }
    if (t.type === 'AT_LABEL') { return this.parseLabeledLoop(); }
    if (t.type === 'TRY')      return this.parseTryCatch();
    if (t.type === 'BACKSLASH') {
      this.adv();
      if (this.check('IDENT')) {
        const name = this.adv().value;
        return { type: 'LifetimeEnd', name };
      }
      return null;
    }
    if (t.type === 'LBRACKET' && this.isDestructuring()) return this.parseArrayDestruct();
    if (t.type === 'LPAREN'   && this.isDestructuring()) return this.parseTupleDestruct();
    if (t.type === 'IDENT')    return this.parseIdentStmt();
    if (t.type === 'SEMI')     { this.adv(); return null; }
    if (t.type === 'PILCROW')  { this.adv(); return { type: 'Output', items: [], newline: true }; }
    if (t.type === 'HASH')     return this.parseModuleBlock();

    return { type: 'ExprStmt', expr: this.parseExpr() };
  }

  parseOutput() {
    const opLine = this.adv().line;
    const items = [];
    while (!this.check('PILCROW') && !this.check('NEWLINE_ESC') &&
           !this.check('RBRACE') && !this.check('EOF')) {
      if (this.peek().line > opLine) break;
      items.push(this.parseExpr());
    }
    const nl = this.match('PILCROW', 'NEWLINE_ESC');
    return { type: 'Output', items, newline: !!nl, line: this.peek().line };
  }

  parseInput() {
    const line = this.peek().line;
    this.adv();
    let prompt = null;
    if (this.check('STR')) {
      prompt = { type: 'Literal', kind: 'str', value: this.adv().value };
    }
    const varTok = this.eat('IDENT');
    return { type: 'Input', prompt, varName: varTok.value, line };
  }

  parseReturn() {
    const opLine = this.adv().line;
    if (this.check('RBRACE') || this.check('EOF') || this.peek().line > opLine)
      return { type: 'Return', value: null };
    const items = [];
    while (!this.check('RBRACE') && !this.check('EOF') && this.peek().line === opLine) {
      items.push(this.parseExpr());
    }
    const value = items.length === 1 ? items[0] : { type: 'JuxtaConcat', items };
    return { type: 'Return', value };
  }

  parseTryCatch() {
    this.adv();
    const tryBody = this.parseBlock();
    const catches = [];
    while (this.check('CATCH')) {
      this.adv();
      const errType = (this.check('IDENT') && this.peek().value.startsWith('##'))
        ? this.adv().value : null;
      catches.push({ errType, body: this.parseBlock() });
    }
    let finallyBody = null;
    if (this.check('FINALLY')) {
      this.adv();
      finallyBody = this.parseBlock();
    }
    return { type: 'TryCatch', tryBody, catches, finallyBody };
  }

  isDestructuring() {
    let i = 0, depth = 0;
    const start = this.peek(0).type;
    const close = start === 'LBRACKET' ? 'RBRACKET' : 'RPAREN';
    while (this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i++];
      if (t.type === start) depth++;
      else if (t.type === close) { depth--; if (depth === 0) break; }
    }
    return this.peek(i).type === 'ASSIGN';
  }

  parseArrayDestruct() {
    this.adv();
    const targets = [];
    while (!this.check('RBRACKET') && !this.check('EOF')) {
      if (this.check('TIMES')) {
        this.adv();
        targets.push({ name: this.eat('IDENT').value, rest: true });
      } else if (this.check('ELSE')) {
        this.adv();
        targets.push({ name: '_', rest: false });
      } else {
        targets.push({ name: this.eat('IDENT').value, rest: false });
      }
      this.match('COMMA');
    }
    this.eat('RBRACKET');
    this.eat('ASSIGN');
    return { type: 'ArrayDestruct', targets, value: this.parseExpr() };
  }

  parseTupleDestruct() {
    const isNamed = this.peek(1).type === 'IDENT' && this.peek(2).type === 'COLON';
    this.adv();
    if (isNamed) {
      const targets = [];
      while (!this.check('RPAREN') && !this.check('EOF')) {
        const field = this.eat('IDENT').value;
        this.eat('COLON');
        const name  = this.eat('IDENT').value;
        targets.push({ field, name });
        this.match('COMMA');
      }
      this.eat('RPAREN');
      this.eat('ASSIGN');
      return { type: 'NamedDestruct', targets, value: this.parseExpr() };
    } else {
      const targets = [];
      while (!this.check('RPAREN') && !this.check('EOF')) {
        if (this.check('TIMES')) {
          this.adv();
          targets.push({ name: this.eat('IDENT').value, rest: true });
        } else {
          targets.push({ name: this.eat('IDENT').value, rest: false });
        }
        this.match('COMMA');
      }
      this.eat('RPAREN');
      this.eat('ASSIGN');
      return { type: 'TupleDestruct', targets, value: this.parseExpr() };
    }
  }

  parseIf() {
    this.adv();
    const cond = this.parseExpr();
    const then = this.parseBlock();
    const elseifs = [];
    let elseBranch = null;
    while (this.check('ELSEIF')) {
      this.adv();
      elseifs.push({ cond: this.parseExpr(), body: this.parseBlock() });
    }
    if (this.check('ELSE')) {
      this.adv();
      elseBranch = this.parseBlock();
    }
    return { type: 'If', cond, then, elseifs, else: elseBranch };
  }

  parseMatchExpr() {
    this.adv();
    const expr = this.parseExpr();
    this.eat('LBRACE');
    const arms = [];
    while (!this.check('RBRACE') && !this.check('EOF')) {
      arms.push(this.parseMatchArm());
    }
    this.eat('RBRACE');
    return { type: 'Match', expr, arms };
  }

  parseMatchArm() {
    let pattern;
    if (this.check('ELSE')) {
      this.adv();
      pattern = { type: 'wildcard' };
    } else if (this.check('ELSEIF')) {
      this.adv();
      pattern = { type: 'guard', cond: this.parseExpr() };
    } else if (this.check('LBRACKET')) {
      // List pattern: [a, b, *rest] or [1, "x", _]
      this.adv();
      const elems = [];
      while (!this.check('RBRACKET') && !this.check('EOF')) {
        if (this.check('TIMES')) {
          this.adv();
          elems.push({ kind: 'rest', name: this.eat('IDENT').value });
        } else if (this.check('ELSE')) {
          this.adv();
          elems.push({ kind: 'wildcard' });
        } else if (this.check('IDENT') && (this.peek(1).type === 'COMMA' || this.peek(1).type === 'RBRACKET')) {
          elems.push({ kind: 'bind', name: this.adv().value });
        } else {
          elems.push({ kind: 'literal', expr: this.parseAdditive() });
        }
        this.match('COMMA');
      }
      this.eat('RBRACKET');
      pattern = { type: 'list', elems };
    } else if (['LT','GT','LTE','GTE','EQ','NEQ'].includes(this.peek().type)) {
      const op = this.adv().value;
      pattern = { type: 'comparison', op, value: this.parseAdditive() };
    } else {
      const left = this.parseAdditive();
      if (this.match('RANGE')) {
        pattern = { type: 'range', from: left, to: this.parseAdditive() };
      } else {
        pattern = { type: 'literal', value: left };
      }
    }
    this.eat('FAT_ARROW');
    this.inMatchBody = true;
    const body = this.check('LBRACE')
      ? { type: 'block', stmts: this.parseBlock() }
      : { type: 'expr',  value: this.parseExpr()  };
    this.inMatchBody = false;
    return { pattern, body };
  }

  parseLoop() {
    if (this.check('LBRACE')) {
      return { type: 'Loop', kind: 'infinite', label: null, body: this.parseBlock() };
    }
    // @ IDENT COLON  → unlabeled range/foreach (@ var:start..end)
    if (this.check('IDENT') && this.peek(1).type === 'COLON') {
      const varName = this.adv().value;
      this.adv();
      const startExpr = this.parseAdditive();
      if (this.match('RANGE')) {
        const endExpr = this.parseAdditive();
        let stepExpr = null;
        if (this.match('COLON')) stepExpr = this.parseAdditive();
        return { type: 'Loop', kind: 'range', label: null, var: varName,
                 from: startExpr, to: endExpr, step: stepExpr, body: this.parseBlock() };
      }
      return { type: 'Loop', kind: 'foreach', label: null, var: varName,
               iterable: startExpr, body: this.parseBlock() };
    }
    const cond = this.parseExpr();
    return { type: 'Loop', kind: 'while', label: null, cond, body: this.parseBlock() };
  }

  parseLabeledLoop() {
    const label = this.adv().value; // consume AT_LABEL token
    if (this.check('LBRACE')) {
      return { type: 'Loop', kind: 'infinite', label, body: this.parseBlock() };
    }
    // @label var:start..end
    if (this.check('IDENT') && this.peek(1).type === 'COLON') {
      const varName = this.adv().value;
      this.adv(); // consume ':'
      const startExpr = this.parseAdditive();
      if (this.match('RANGE')) {
        const endExpr = this.parseAdditive();
        let stepExpr = null;
        if (this.match('COLON')) stepExpr = this.parseAdditive();
        return { type: 'Loop', kind: 'range', label, var: varName,
                 from: startExpr, to: endExpr, step: stepExpr, body: this.parseBlock() };
      }
      return { type: 'Loop', kind: 'foreach', label, var: varName,
               iterable: startExpr, body: this.parseBlock() };
    }
    // @label cond { }
    const cond = this.parseExpr();
    return { type: 'Loop', kind: 'while', label, cond, body: this.parseBlock() };
  }

  isFuncDecl() {
    if (this.peek(0).type !== 'IDENT' || this.peek(1).type !== 'LPAREN') return false;
    let i = 2, depth = 1;
    while (this.pos + i < this.toks.length && depth > 0) {
      const t = this.toks[this.pos + i++];
      if (t.type === 'LPAREN') depth++;
      else if (t.type === 'RPAREN') depth--;
    }
    return this.peek(i).type === 'LBRACE';
  }

  parseFuncDecl() {
    const nameTok = this.adv();
    const name = nameTok.value;
    const line = nameTok.line;
    this.eat('LPAREN');
    const params = [];
    while (!this.check('RPAREN') && !this.check('EOF')) {
      const pname = this.eat('IDENT').value;
      let isOut = false;
      if (this.match('RETURN')) isOut = true;
      params.push({ name: pname, isOut });
      this.match('COMMA');
    }
    this.eat('RPAREN');
    return { type: 'FuncDecl', name, params, body: this.parseBlock(), line };
  }

  parseIdentStmt() {
    if (this.isFuncDecl()) return this.parseFuncDecl();

    const tok0 = this.adv();
    const name = tok0.value;
    const hot  = tok0.hot ?? false;
    const line = this.peek().line;

    if (this.match('CONST_ASSIGN')) {
      return { type: 'ConstAssign', name, value: this.parseRHS(), line };
    }

    const compound = { PLUS_EQ:'+', MINUS_EQ:'-', TIMES_EQ:'*', DIV_EQ:'/', MOD_EQ:'%', POW_EQ:'^' };
    const cop = compound[this.peek().type];
    if (cop) { this.adv(); return { type: 'CompoundAssign', name, hot, op: cop, value: this.parseExpr(), line }; }

    if (this.match('INC')) return { type: 'Increment', name, hot, op: '++', line };
    if (this.match('DEC')) return { type: 'Increment', name, hot, op: '--', line };

    if (this.match('ASSIGN')) {
      return { type: 'VarAssign', name, hot, value: this.parseRHS(), line };
    }

    // subscript assign: name[idx] = val
    if (this.check('LBRACKET') && this.peek().line === this.toks[this.pos - 1].line) {
      this.adv();
      const idx = this.parseExpr();
      this.eat('RBRACKET');
      if (this.match('ASSIGN')) {
        return { type: 'IndexAssign', obj: name, index: idx, value: this.parseExpr(), line };
      }
      const idxCompound = compound[this.peek().type];
      if (idxCompound) {
        this.adv();
        const rhs = this.parseExpr();
        const currentElem = { type: 'NavIndex', obj: { type: 'Ident', name, line: tok0.line }, spec: { kind: 'simple', index: idx } };
        const value = { type: 'BinOp', op: idxCompound, left: currentElem, right: rhs };
        return { type: 'IndexAssign', obj: name, index: idx, value, line };
      }
      let left = { type: 'NavIndex', obj: { type: 'Ident', name, line: tok0.line }, spec: { kind: 'simple', index: idx } };
      return { type: 'ExprStmt', expr: this.parsePostfixRest(left) };
    }

    let left = { type: 'Ident', name, hot, line: tok0.line };
    return { type: 'ExprStmt', expr: this.parsePostfixRest(left) };
  }

  parseRHS() {
    const firstLine = this.peek().line;
    const first = this.parseExpr();
    if (this.check('COMMA')) {
      const items = [first];
      while (this.match('COMMA')) items.push(this.parseExpr());
      return { type: 'CommaJoin', items };
    }
    // Implicit string concatenation: collect multiple expressions on the same line
    const implicitExprStart = new Set(['STR','IDENT','NUM','FLOAT','CHAR','BOOL','LPAREN','LBRACKET','MINUS','NOT','CAST_FLOAT','CAST_INT_ROUND','CAST_INT_TRUNC','DATA_OP','MATCH','ELSE']);
    const items = [first];
    while (this.peek().line === firstLine && implicitExprStart.has(this.peek().type)) {
      items.push(this.parseExpr());
    }
    if (items.length === 1) return first;
    return { type: 'ImplicitConcat', items };
  }

  // ─── Expression grammar ──────────────────────────────────────────────────

  parseExpr() {
    if (this.isLambdaStart()) return this.parseLambda();
    return this.parsePipe();
  }

  isLambdaStart() {
    if (this.peek(0).type === 'IDENT' && this.peek(1).type === 'ARROW') return true;
    if (this.peek(0).type !== 'LPAREN') return false;
    let i = 1, depth = 1;
    while (depth > 0 && this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i++];
      if (t.type === 'LPAREN') depth++;
      else if (t.type === 'RPAREN') depth--;
    }
    if (this.peek(i).type === 'ARROW') return true;
    i = 1;
    while (this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i];
      if (t.type === 'ARROW') return true;
      if (t.type === 'RPAREN' || t.type === 'EOF') return false;
      if (t.type !== 'IDENT' && t.type !== 'COMMA') return false;
      i++;
    }
    return false;
  }

  parseLambda() {
    const params = [];
    let parensWrapped = false;
    if (this.check('LPAREN')) {
      this.adv();
      while (!this.check('RPAREN') && !this.check('ARROW') && !this.check('EOF')) {
        params.push(this.eat('IDENT').value);
        this.match('COMMA');
      }
      if (this.check('RPAREN')) {
        // (params) -> body form: consume ')' before '->'
        this.adv();
      } else {
        // (params -> body) form: closing ')' comes after body
        parensWrapped = true;
      }
    } else {
      params.push(this.adv().value);
    }
    this.eat('ARROW');
    const body = this.check('LBRACE')
      ? { type: 'block', stmts: this.parseBlock() }
      : { type: 'expr',  value: this.parseExpr() };
    if (parensWrapped) this.match('RPAREN');
    return { type: 'Lambda', params, body };
  }

  parsePipe() {
    let left = this.parseOr();
    while (this.match('PIPE')) {
      const rhs = this.parseOr();
      left = { type: 'Pipe', value: left, rhs };
    }
    return left;
  }

  parseOr()             { return this.parseBinLeft(['OR'],  () => this.parseAnd()); }
  parseAnd()            { return this.parseBinLeft(['AND'], () => this.parseComparison()); }
  parseComparison() {
    let left = this.parseAdditive();
    if (this.inMatchBody) return left;
    const cmp = { EQ:'==', NEQ:'<>', LT:'<', GT:'>', LTE:'<=', GTE:'>=' };
    const op  = cmp[this.peek().type];
    if (op) { this.adv(); left = { type:'BinOp', op, left, right: this.parseAdditive() }; }
    return left;
  }
  parseAdditive()       { return this.parseBinLeft(['PLUS','MINUS'], () => this.parseMultiplicative()); }
  parseMultiplicative() { return this.parseBinLeft(['TIMES','DIV','MOD'], () => this.parseExponent()); }
  parseExponent() {
    let left = this.parseUnary();
    if (this.match('POW')) left = { type:'BinOp', op:'^', left, right: this.parseUnary() };
    return left;
  }

  parseBinLeft(tokenTypes, sub) {
    const opMap = { OR:'||', AND:'&&', PLUS:'+', MINUS:'-', TIMES:'*', DIV:'/', MOD:'%' };
    let left = sub();
    while (tokenTypes.includes(this.peek().type)) {
      const op = opMap[this.adv().type] ?? this.toks[this.pos - 1].value;
      left = { type: 'BinOp', op, left, right: sub() };
    }
    return left;
  }

  parseUnary(noCollectionChain) {
    if (this.match('MINUS')) return { type: 'UnaryOp', op: '-', operand: this.parseUnary() };
    if (this.match('NOT'))   return { type: 'UnaryOp', op: '!', operand: this.parseUnary() };
    return noCollectionChain ? this.parsePostfixNoChain() : this.parsePostfix();
  }

  parsePostfix() {
    return this.parsePostfixRest(this.parsePrimary());
  }

  parsePostfixNoChain() {
    const primary = this.parsePrimary();
    const sameLine = () => this.peek().line === (this.toks[this.pos - 1]?.line ?? this.peek().line);
    let left = primary;
    while (true) {
      if (this.check('LBRACKET') && sameLine()) {
        this.adv(); const spec = this.parseNavContent(); this.eat('RBRACKET');
        left = { type: 'NavIndex', obj: left, spec };
      } else if (this.check('DOT') || this.check('SCOPE')) {
        this.adv(); const field = this.eat('IDENT').value;
        left = { type: 'FieldAccess', obj: left, field };
      } else if (this.check('LPAREN') && sameLine() && left.type === 'Ident') {
        this.adv(); const args = this.parseArgList(); this.eat('RPAREN');
        left = { type: 'Call', callee: left.name, args };
      } else if (this.check('LPAREN') && sameLine() && left.type !== 'Ident') {
        this.adv(); const args = this.parseArgList(); this.eat('RPAREN');
        left = { type: 'CallExpr', callee: left, args };
      } else break;
    }
    return left;
  }

  parsePostfixRest(left) {
    const COL_TOKENS = new Set(['DLEN','DAPPEND','DREMOVEALL','DREMOVE',
      'DFINDALL','DCONTAINS','DSORTASC','DSORTDESC','DSORT',
      'DMAP','DFILTER','DREDUCE','DSLICE','DERROR','DERRORPROP','DREPLACE',
      'DSPLIT','DCONCATBUILD','DREPEAT']);

    while (true) {
      const sameLine = () => this.peek().line === (this.toks[this.pos - 1]?.line ?? this.peek().line);

      if (this.check('LBRACKET') && sameLine()) {
        this.adv();
        const spec = this.parseNavContent();
        this.eat('RBRACKET');
        // FuncUpdate: arr[i]$~ val — only for simple subscript
        if (spec.kind === 'simple' && this.check('DUPDATE')) {
          this.adv();
          const val = this.parseUnary();
          left = { type: 'FuncUpdate', obj: left.obj ?? left, index: spec.index, value: val };
        } else {
          left = { type: 'NavIndex', obj: left, spec };
        }

      } else if (this.check('DOT') || this.check('SCOPE')) {
        this.adv();
        const field = this.eat('IDENT').value;
        left = { type: 'FieldAccess', obj: left, field };

      } else if (this.check('LPAREN') && sameLine() && left.type === 'Ident') {
        this.adv();
        const args = this.parseArgList();
        this.eat('RPAREN');
        left = { type: 'Call', callee: left.name, args };

      } else if (this.check('LPAREN') && sameLine() && left.type !== 'Ident' && left.type !== 'Literal') {
        this.adv();
        const args = this.parseArgList();
        this.eat('RPAREN');
        left = { type: 'CallExpr', callee: left, args };

      } else if (COL_TOKENS.has(this.peek().type)) {
        left = this.parseCollectionOp(left);

      } else if (this.check('TYPE_QUERY')) {
        this.adv();
        left = { type: 'TypeMetadata', obj: left };

      } else {
        break;
      }
    }
    return left;
  }

  // ─── Navigation index parsing ─────────────────────────────────────────────

  // Called after consuming '['. Returns a spec object for NavIndex.
  parseNavContent() {
    // Structured nav: [[g1] ; [g2]] — starts with '['
    if (this.check('LBRACKET')) {
      return this.parseNavStructured();
    }

    // Parse first nav atom (uses additive, not full comparison, so '>' is nav separator)
    const firstAtom = this.parseNavAtom();

    // nav path or flat extraction?
    if (this.check('GT') || this.check('SEMI')) {
      return this.parseNavContinue(firstAtom);
    }

    // Simple subscript: single index, no nav ops
    if (firstAtom.kind === 'index') {
      return { kind: 'simple', index: firstAtom.expr };
    }
    // Single range at top level (unusual) → flat
    return { kind: 'flat', paths: [[firstAtom]] };
  }

  // Parse a nav atom: additive expr, optionally followed by '..' range
  parseNavAtom() {
    const expr = this.parseAdditive();
    if (this.match('RANGE')) {
      const to = this.parseAdditive();
      return { kind: 'range', from: expr, to };
    }
    return { kind: 'index', expr };
  }

  // Continue parsing after the first atom — GT means nav path, SEMI means flat
  parseNavContinue(firstAtom) {
    // Build first path (starting with firstAtom)
    const firstPath = [firstAtom];
    while (this.match('GT')) firstPath.push(this.parseNavAtom());

    if (!this.check('SEMI')) {
      // Single nav path
      return { kind: 'path', path: firstPath };
    }

    // Multiple paths separated by ';' — flat extraction
    const paths = [firstPath];
    while (this.match('SEMI')) {
      const path = [this.parseNavAtom()];
      while (this.match('GT')) path.push(this.parseNavAtom());
      paths.push(path);
    }
    return { kind: 'flat', paths };
  }

  // Parse structured nav: [[g1,g2] ; [g3,g4]] — already past outer '['
  parseNavStructured() {
    const groups = [];
    do {
      this.eat('LBRACKET');
      const paths = [];
      do {
        const path = [this.parseNavAtom()];
        while (this.match('GT')) path.push(this.parseNavAtom());
        paths.push(path);
      } while (this.match('COMMA'));
      this.eat('RBRACKET');
      groups.push({ paths });
    } while (this.match('SEMI'));
    return { kind: 'structured', groups };
  }

  // ─── Collection ops ───────────────────────────────────────────────────────

  parseCollectionOp(left) {
    const op = this.adv().type;

    switch (op) {
      case 'DLEN':
        return { type: 'CollectionOp', op: '$#', obj: left };

      case 'DAPPEND':
        if (this.check('LBRACKET')) {
          this.adv();
          const idx = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$+[i]', obj: left, index: idx, arg: this.parseUnary(true) };
        }
        // Use parseUnary(true) to prevent right-nesting: arr$+4$+5 → (arr$+4)$+5 not arr$+(4$+5)
        return { type: 'CollectionOp', op: '$+', obj: left, arg: this.parseUnary(true) };

      case 'DREMOVEALL':
        return { type: 'CollectionOp', op: '$--', obj: left, arg: this.parseUnary() };

      case 'DREMOVE':
        if (this.check('LBRACKET')) {
          this.adv();
          // Open-start: $-[..N]
          if (this.match('RANGE')) {
            const to = this.parseExpr(); this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$-[i..j]', obj: left, range: { from: null, to } };
          }
          const from = this.parseExpr();
          if (this.match('RANGE')) {
            // Open-end: $-[N..]  or  $-[N..M]
            const toNode = (!this.check('RBRACKET')) ? this.parseExpr() : null;
            this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$-[i..j]', obj: left, range: { from, to: toNode } };
          }
          if (this.match('COLON')) {
            // Count-based: $-[start:count]
            const count = this.parseExpr(); this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$-[i:n]', obj: left, start: from, count };
          }
          this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$-[i]', obj: left, index: from };
        }
        return { type: 'CollectionOp', op: '$-', obj: left, arg: this.parseUnary() };

      case 'DFINDALL':
        return { type: 'CollectionOp', op: '$??', obj: left, arg: this.parseUnary() };

      case 'DCONTAINS':
        return { type: 'CollectionOp', op: '$?', obj: left, arg: this.parseUnary() };

      case 'DUPDATE':
        this.eat('LBRACKET');
        { const idx = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$~', obj: left, index: idx, arg: this.parseUnary() }; }

      case 'DSORTASC':   return { type: 'CollectionOp', op: '$^+', obj: left };
      case 'DSORTDESC':  return { type: 'CollectionOp', op: '$^-', obj: left };
      case 'DSORT':      return { type: 'CollectionOp', op: '$^',  obj: left, arg: this.parseUnary() };

      case 'DMAP':       return { type: 'CollectionOp', op: '$>',  obj: left, arg: this.parseUnary(true) };
      case 'DFILTER':    return { type: 'CollectionOp', op: '$|',  obj: left, arg: this.parseUnary(true) };

      case 'DREDUCE':
        this.eat('LPAREN');
        { const init = this.parseExpr(); this.eat('COMMA');
          const fn   = this.parseExpr(); this.eat('RPAREN');
          return { type: 'CollectionOp', op: '$<', obj: left, init, arg: fn }; }

      case 'DSLICE':
        this.eat('LBRACKET');
        { const from = this.parseExpr();
          if (this.match('RANGE')) {
            const to = this.parseExpr(); this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$[i..j]', obj: left, range: { from, to } };
          }
          this.eat('COLON');
          const count = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$[i:n]', obj: left, range: { from, count } }; }

      case 'DERROR':
        return { type: 'CollectionOp', op: '$!', obj: left };

      case 'DERRORPROP':
        return { type: 'CollectionOp', op: '$!!', obj: left };

      case 'DREPLACE':
        this.eat('LBRACKET');
        { const from = this.parseExpr(); this.eat('COLON');
          const to   = this.parseExpr();
          const count = this.match('COLON') ? this.parseExpr() : null;
          this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$~~', obj: left, from, to, count }; }

      case 'DSPLIT':
        return { type: 'CollectionOp', op: '$/', obj: left, arg: this.parseUnary() };

      case 'DREPEAT':
        return { type: 'CollectionOp', op: '$*', obj: left, arg: this.parseUnary() };

      case 'DCONCATBUILD': {
        const opLine = this.toks[this.pos - 1].line;
        const items = [];
        const canStart = () => {
          const t = this.peek().type;
          return ['NUM','FLOAT','BOOL','CHAR','STR','IDENT','LPAREN','LBRACKET','ELSE',
                  'CAST_FLOAT','CAST_INT_ROUND','CAST_INT_TRUNC'].includes(t);
        };
        while (this.peek().line === opLine && !this.check('PILCROW') &&
               !this.check('RBRACE') && !this.check('EOF') && canStart()) {
          items.push(this.parsePostfix());
        }
        return { type: 'CollectionOp', op: '$++', obj: left, items };
      }

      default:
        return left;
    }
  }

  parseKeyInput(blocking) {
    this.adv(); // consume <<| or <<|?
    const v = this.eat('IDENT');
    return { type: 'KeyInput', variable: v.value, blocking };
  }

  parseTuiBlock() {
    this.adv(); // consume >>|
    const body = this.parseBlock();
    return { type: 'TuiBlock', body };
  }

  parseOutputPos() {
    const opLine = this.adv().line; // consume >>~
    let slots;
    if (this.check('LPAREN')) {
      this.adv(); // consume (
      slots = [];
      while (!this.check('RPAREN') && !this.check('EOF')) {
        if (this.check('COMMA')) { slots.push(null); this.adv(); }
        else { slots.push(this.parseExpr()); if (this.check('COMMA')) this.adv(); }
        if (slots.length > 5) throw new Error('>>~ position has at most 5 slots');
      }
      this.eat('RPAREN');
    } else {
      const name = this.eat('IDENT').value;
      slots = [{ type: 'Ident', name, hot: false }]; // sentinel: variable mode
    }
    this.eat('GT'); // consume >
    const items = [];
    while (!this.check('PILCROW') && !this.check('RBRACE') &&
           !this.check('EOF') && this.peek().line === opLine) {
      items.push(this.parseExpr());
    }
    return { type: 'OutputPos', slots, items };
  }

  parseArgList() {
    const args = [];
    while (!this.check('RPAREN') && !this.check('EOF')) {
      args.push(this.parseExpr());
      this.match('COMMA');
    }
    return args;
  }

  parsePrimary() {
    if (this.peek().type === 'LPAREN' && this.isLambdaStart()) return this.parseLambda();

    const t = this.peek();

    if (t.type === 'NUM')   { this.adv(); return { type: 'Literal', kind: 'int',   value: t.value }; }
    if (t.type === 'FLOAT') { this.adv(); return { type: 'Literal', kind: 'float', value: t.value }; }
    if (t.type === 'BOOL')  { this.adv(); return { type: 'Literal', kind: 'bool',  value: t.value }; }
    if (t.type === 'CHAR')  { this.adv(); return { type: 'Literal', kind: 'char',  value: t.value }; }
    if (t.type === 'STR')   { this.adv(); return { type: 'Literal', kind: 'str',   value: t.value }; }
    if (t.type === 'IDENT')        { this.adv(); return { type: 'Ident',       name: t.value, hot: t.hot ?? false, line: t.line }; }
    if (t.type === 'ELSE')         { this.adv(); return { type: 'Ident',       name: '_'      }; }
    if (t.type === 'OUTPUT_QUERY') { this.adv(); return { type: 'TerminalSize' }; }
    if (t.type === 'BASHEXEC')    { const tok = this.adv(); return { type: 'BashExec', cmd: tok.value }; }
    if (t.type === 'MATCH') { return this.parseMatchExpr(); }

    // Cast operators: ##. ### ##!
    if (t.type === 'CAST_FLOAT')     { this.adv(); return { type: 'CastOp', op: '##.', operand: this.parseUnary() }; }
    if (t.type === 'CAST_INT_ROUND') { this.adv(); return { type: 'CastOp', op: '###', operand: this.parseUnary() }; }
    if (t.type === 'CAST_INT_TRUNC') { this.adv(); return { type: 'CastOp', op: '##!', operand: this.parseUnary() }; }

    if (t.type === 'LBRACKET') {
      this.adv();
      const items = [];
      while (!this.check('RBRACKET') && !this.check('EOF')) {
        items.push(this.parseExpr());
        this.match('COMMA');
      }
      this.eat('RBRACKET');
      return { type: 'Array', items };
    }

    if (t.type === 'LPAREN') {
      this.adv();
      if (this.check('RPAREN')) { this.adv(); return { type: 'Literal', kind: 'unit' }; }

      let firstKey = null;
      if (this.check('IDENT') && this.peek(1).type === 'COLON') {
        firstKey = this.adv().value;
        this.adv();
      }
      const firstVal = this.parseExpr();
      if (this.check('COMMA') || firstKey !== null) {
        const items = [firstVal];
        const keys  = [firstKey];
        while (this.match('COMMA')) {
          if (this.check('RPAREN')) break;
          let key = null;
          if (this.check('IDENT') && this.peek(1).type === 'COLON') {
            key = this.adv().value;
            this.adv();
          }
          items.push(this.parseExpr());
          keys.push(key);
        }
        this.eat('RPAREN');
        const named = keys.some(k => k !== null);
        return { type: 'Tuple', items, keys: named ? keys : null };
      }
      this.eat('RPAREN');
      return firstVal;
    }

    if (t.type === 'DATA_OP') {
      this.adv();
      const arg = this.parseExpr();
      this.eat('VBAR');
      return { type: 'DataOp', kind: t.value.kind, prec: t.value.prec, arg };
    }

    this.adv();
    return { type: 'Literal', kind: 'unit' };
  }
}

// ─── Environment ──────────────────────────────────────────────────────────────

class Env {
  constructor(parent = null, funcBoundary = false, isModuleScope = false) {
    this.vars          = new Map();
    this.consts        = new Set();
    this.parent        = parent;
    this.funcBoundary  = funcBoundary;
    this.isModuleScope = isModuleScope;
  }

  get(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    if (!this.parent) throw new ZyError(`'${name}' is undefined — did you mean '${name}°' (hot definition)?`);
    if (this.funcBoundary) {
      const v = this.parent._getFuncOnly(name);
      if (v !== undefined) return v;
      throw new ZyError(`'${name}' is undefined — did you mean '${name}°' (hot definition)?`);
    }
    if (name.startsWith('_')) {
      // _ vars can't escape block scopes — but _ names defined at module scope
      // (past any funcBoundary) are module-private and accessible from within the module.
      const v = this._findPastBoundary(name);
      if (v !== undefined) return v;
      throw new ZyRuntimeError(`cannot access underscore variable '${name}' from inner scope`, '##Scope');
    }
    return this.parent.get(name);
  }

  _findPastBoundary(name) {
    // Module scope: _ names here are module-private, accessible from within the module
    if (this.isModuleScope && this.vars.has(name)) return this.vars.get(name);
    if (this.funcBoundary) return this.parent ? this.parent._findUnrestricted(name) : undefined;
    return this.parent ? this.parent._findPastBoundary(name) : undefined;
  }

  _findUnrestricted(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    return this.parent ? this.parent._findUnrestricted(name) : undefined;
  }

  _getFuncOnly(name) {
    if (this.vars.has(name)) {
      const v = this.vars.get(name);
      return (v.type === 'func' || v.type === 'module') ? v : undefined;
    }
    if (this.parent) return this.parent._getFuncOnly(name);
    return undefined;
  }

  set(name, value) {
    if (this.vars.has(name)) {
      if (this.consts.has(name)) throw new ZyError(`Cannot reassign constant '${name}'`);
      this.vars.set(name, value);
      return true;
    }
    if (name.startsWith('_')) return false;
    if (this.funcBoundary) return false;
    if (this.parent && this.parent.set(name, value)) return true;
    return false;
  }

  def(name, value, isConst = false) {
    this.vars.set(name, value);
    if (isConst) this.consts.add(name);
  }

  hotDef(name, value) {
    // Walk to nearest function boundary or root so hot-def vars survive loop iterations
    let scope = this;
    while (scope.parent && !scope.funcBoundary) scope = scope.parent;
    scope.vars.set(name, value);
  }

  has(name) {
    return this.vars.has(name) || (this.parent ? this.parent.has(name) : false);
  }

  destroy(name) {
    if (this.vars.has(name)) {
      this.vars.delete(name);
      this.consts.delete(name);
      return true;
    }
    if (this.parent) return this.parent.destroy(name);
    return false;
  }
}

// ─── Checker ──────────────────────────────────────────────────────────────────

function formatDiagnostic(d) {
  return `${d.severity}: ${d.message}`;
}

class Checker {
  constructor(ast) {
    this.ast         = ast;
    this.diagnostics = [];
    this.stack       = [];
    this.pendingHot  = false; // prefix hot-def sentinel (°name)
  }

  push(funcBoundary = false) {
    this.stack.push({ vars: new Map(), funcBoundary });
  }

  pop() {
    const frame = this.stack.pop();
    for (const [name, info] of frame.vars) {
      if (!info.used && !name.startsWith('_') && !info.isConst) {
        this.warn('W_UNUSED', `unused variable '${name}'`, info.line);
      }
    }
  }

  define(name, line, isConst = false) {
    if (this.stack.length === 0 || !name) return;
    this.stack[this.stack.length - 1].vars.set(name, { line, isConst, used: false });
  }

  // Mirror Env.hotDef: walk to nearest funcBoundary or root, define there
  hotDefine(name, line) {
    if (this.stack.length === 0 || !name) return;
    let i = this.stack.length - 1;
    while (i > 0 && !this.stack[i].funcBoundary) i--;
    this.stack[i].vars.set(name, { line, isConst: false, used: false });
  }

  lookup(name, usageLine) {
    if (!name) return null;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const frame = this.stack[i];
      if (frame.vars.has(name)) {
        // Found — check underscore scope violation: _name cannot be read from inner scope
        // that crosses at least one non-funcBoundary scope to reach the definition
        if (name.startsWith('_') && i < this.stack.length - 1) {
          const crossedNonBoundary = this.stack.slice(i + 1).some(f => !f.funcBoundary);
          if (crossedNonBoundary) {
            this.error('E_SCOPE', `cannot access underscore variable '${name}' from inner scope`, usageLine);
            return { used: true, isConst: false, isScope: true }; // sentinel: suppress follow-up E_VAR
          }
        }
        frame.vars.get(name).used = true;
        return frame.vars.get(name);
      }
      if (frame.funcBoundary && !name.startsWith('_')) break;
    }
    return null;
  }

  error(code, msg, line = null) {
    this.diagnostics.push({ severity: 'error', code, message: msg, line });
  }

  warn(code, msg, line = null) {
    this.diagnostics.push({ severity: 'warning', code, message: msg, line });
  }

  _leftmostIdent(expr) {
    if (!expr) return null;
    if (expr.type === 'Ident') return expr.name || null;
    if (expr.type === 'BinOp')       return this._leftmostIdent(expr.left);
    if (expr.type === 'CollectionOp') return this._leftmostIdent(expr.obj);
    if (expr.type === 'NavIndex')     return this._leftmostIdent(expr.obj);
    if (expr.type === 'UnaryOp')      return this._leftmostIdent(expr.operand ?? expr.value);
    return null;
  }

  check() {
    this.push(false);
    for (const stmt of this.ast.body) {
      if (stmt.type === 'FuncDecl') this.define(stmt.name, stmt.line);
    }
    for (const stmt of this.ast.body) this.checkStmt(stmt);
    this.pop();
    return this.diagnostics;
  }

  checkBlock(stmts) {
    if (!Array.isArray(stmts)) return;
    for (const s of stmts) {
      if (s?.type === 'FuncDecl') this.define(s.name, s.line, false);
    }
    for (const s of stmts) this.checkStmt(s);
  }

  checkStmt(stmt) {
    if (!stmt) return;
    const wasHot = this.pendingHot;
    this.pendingHot = false;

    switch (stmt.type) {

      case 'VarAssign': {
        // Prefix hot-def (°name = expr): define target before checking RHS so self-references are valid
        if (wasHot && stmt.name) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.hotDefine(stmt.name, stmt.line);
        }
        this.checkExpr(stmt.value);
        // Check for reassignment of a constant
        if (stmt.name) {
          const existing = this.lookup(stmt.name, stmt.line);
          if (existing?.isConst) {
            this.error('E_CONST', `cannot reassign constant '${stmt.name}'`, stmt.line);
            return;
          }
        }
        if (!wasHot) this.define(stmt.name, stmt.line, false);
        return;
      }

      case 'ConstAssign': {
        this.checkExpr(stmt.value);
        this.define(stmt.name, stmt.line, true);
        return;
      }

      case 'CompoundAssign': {
        // postfix hot: name° +=  → stmt.hot = true
        // prefix hot:  °name +=  → wasHot = true (from ExprStmt sentinel)
        const isHot = stmt.hot || wasHot;
        if (!isHot) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${stmt.name}'`, stmt.line);
          else if (info.isConst) this.error('E_CONST', `cannot reassign constant '${stmt.name}'`, stmt.line);
        } else {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.hotDefine(stmt.name, stmt.line);
        }
        this.checkExpr(stmt.value);
        return;
      }

      case 'Increment': {
        const isHot = stmt.hot || wasHot;
        if (!isHot) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${stmt.name}'`, stmt.line);
          else if (info.isConst) this.error('E_CONST', `cannot reassign constant '${stmt.name}'`, stmt.line);
        } else {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.hotDefine(stmt.name, stmt.line);
        }
        return;
      }

      case 'IndexAssign': {
        // obj is a string (the variable name being indexed)
        const obj = stmt.obj ?? stmt.name;
        if (obj) {
          const info = this.lookup(obj, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${obj}'`, stmt.line);
        }
        this.checkExpr(stmt.index);
        this.checkExpr(stmt.value);
        return;
      }

      case 'IndexedAssign': {
        const name = stmt.name ?? stmt.obj;
        if (name) {
          const info = this.lookup(name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${name}'`, stmt.line);
        }
        for (const idx of (stmt.indices ?? [])) this.checkExpr(idx);
        this.checkExpr(stmt.value);
        return;
      }

      case 'LifetimeEnd': {
        if (stmt.name) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${stmt.name}'`, stmt.line);
          else {
            for (let i = this.stack.length - 1; i >= 0; i--) {
              if (this.stack[i].vars.has(stmt.name)) {
                this.stack[i].vars.delete(stmt.name); break;
              }
            }
          }
        }
        return;
      }

      case 'Import': {
        if (stmt.alias) this.define(stmt.alias, stmt.line, false);
        return;
      }

      case 'Output':
      case 'OutputPos': {
        for (const item of (stmt.items ?? [])) this.checkExpr(item);
        return;
      }

      case 'Input': {
        if (stmt.prompt) this.checkExpr(stmt.prompt);
        const varName = stmt.varName ?? stmt.name;
        if (varName) this.define(varName, stmt.line, false);
        return;
      }

      case 'If': {
        this.checkExpr(stmt.cond);
        this.push(); this.checkBlock(stmt.then); this.pop();
        for (const elif of (stmt.elseifs ?? [])) {
          this.checkExpr(elif.cond);
          this.push(); this.checkBlock(elif.body ?? elif.then); this.pop();
        }
        if (stmt.else) { this.push(); this.checkBlock(stmt.else); this.pop(); }
        return;
      }

      case 'Loop': {
        this.push();
        if (stmt.kind === 'foreach' || stmt.iterable || stmt.iter) {
          this.checkExpr(stmt.iterable ?? stmt.iter);
          if (stmt.var) this.define(stmt.var, stmt.line, false);
        } else if (stmt.kind === 'range' || stmt.from !== undefined) {
          this.checkExpr(stmt.from);
          this.checkExpr(stmt.to);
          if (stmt.step) this.checkExpr(stmt.step);
          if (stmt.var) this.define(stmt.var, stmt.line, false);
        } else if (stmt.cond) {
          this.checkExpr(stmt.cond);
        }
        this.checkBlock(stmt.body);
        this.pop();
        return;
      }

      case 'CliArgs': {
        // >< name: captures CLI args into a variable
        if (stmt.variable) this.define(stmt.variable, stmt.line, false);
        return;
      }

      case 'KeyInput': {
        if (stmt.varName ?? stmt.variable) this.define(stmt.varName ?? stmt.variable, stmt.line, false);
        return;
      }

      case 'Break':
      case 'Continue':
      case 'SetNumeralMode':
      case 'Noop':
      case 'ExportDecl':
      case 'Sleep':
      case 'ClearScreen':
        return;

      case 'ModuleBlock': {
        const allowedInModule = new Set(['ExportDecl', 'FuncDecl', 'VarAssign', 'ConstAssign', 'Import', 'Noop']);
        for (const s of (stmt.body ?? [])) {
          if (s && !allowedInModule.has(s.type))
            this.error('E013', `E013: executable statement not allowed in module body`, s.line ?? stmt.line);
        }
        return;
      }

      case 'Match': {
        this.checkExpr(stmt.subject ?? stmt.expr);
        for (const arm of (stmt.arms ?? [])) {
          if (arm.pattern?.type === 'Ident') this.lookup(arm.pattern.name, arm.pattern.line);
          if (Array.isArray(arm.body)) { this.push(); this.checkBlock(arm.body); this.pop(); }
          else this.checkExpr(arm.body);
        }
        return;
      }

      case 'FuncDecl': {
        this.push(false); // named fns can access outer scope (module aliases, globals)
        for (const p of (stmt.params ?? [])) {
          const pname = typeof p === 'string' ? p : p.name;
          if (pname) this.define(pname, stmt.line, false);
        }
        this.checkBlock(stmt.body);
        this.pop();
        return;
      }

      case 'Return': {
        if (stmt.value) this.checkExpr(stmt.value);
        return;
      }

      case 'TryCatch': {
        this.push(); this.checkBlock(stmt.tryBody ?? stmt.try); this.pop();
        for (const catch_ of (stmt.catches ?? [])) {
          this.push();
          this.define('_err', stmt.line, false);
          this.checkBlock(catch_.body);
          this.pop();
        }
        const fin = stmt.finallyBody ?? stmt.finally;
        if (fin) { this.push(); this.checkBlock(fin); this.pop(); }
        return;
      }

      case 'TupleDestruct':
      case 'ArrayDestruct': {
        this.checkExpr(stmt.value);
        for (const t of (stmt.targets ?? [])) {
          if (t.name && t.name !== '_') this.define(t.name, stmt.line, false);
        }
        return;
      }

      case 'NamedDestruct': {
        this.checkExpr(stmt.value);
        for (const t of (stmt.targets ?? [])) {
          if (t.name && t.name !== '_') this.define(t.name, stmt.line, false);
        }
        return;
      }

      case 'DestructureAssign': {
        this.checkExpr(stmt.value);
        for (const item of (stmt.pattern ?? [])) {
          if (item.type === 'Bind' || item.type === 'Rest') this.define(item.name, stmt.line, false);
        }
        return;
      }

      case 'ExprStmt': {
        const expr = stmt.expr ?? stmt.value;
        // Prefix hot-def sentinel: ExprStmt with empty hot Ident (°name produces this)
        if (expr?.type === 'Ident' && expr.hot === true && expr.name === '') {
          this.pendingHot = true;
          return;
        }
        this.checkExpr(expr);
        return;
      }

      default:
        if (stmt.value) this.checkExpr(stmt.value);
        if (stmt.body)  this.checkBlock(stmt.body);
    }
  }

  checkExpr(expr) {
    if (!expr) return;
    switch (expr.type) {

      case 'Ident': {
        if (!expr.name) return; // empty sentinel
        if (expr.name === '_') return; // wildcard placeholder — never an error
        // hot Ident (name°): auto-initializes at function/root boundary
        if (expr.hot) {
          const info = this.lookup(expr.name, expr.line);
          if (!info) this.hotDefine(expr.name, expr.line);
          return;
        }
        const info = this.lookup(expr.name, expr.line);
        if (!info) this.error('E_VAR', `undefined variable '${expr.name}'`, expr.line);
        return;
      }

      case 'BinOp': {
        this.checkExpr(expr.left);
        this.checkExpr(expr.right);
        return;
      }

      case 'UnaryOp': {
        this.checkExpr(expr.operand ?? expr.value);
        return;
      }

      case 'CastOp': {
        this.checkExpr(expr.operand ?? expr.value ?? expr.obj);
        return;
      }

      case 'Call': {
        // callee is a string — mark as used (W_UNUSED suppression) but don't emit E_VAR
        if (typeof expr.callee === 'string' && expr.callee) {
          this.lookup(expr.callee, expr.line);
        } else if (expr.callee && typeof expr.callee === 'object') {
          this.checkExpr(expr.callee);
        }
        for (const a of (expr.args ?? [])) this.checkExpr(a.value ?? a);
        return;
      }

      case 'CallExpr': {
        this.checkExpr(expr.callee ?? expr.fn);
        for (const a of (expr.args ?? [])) this.checkExpr(a.value ?? a);
        return;
      }

      case 'Lambda': {
        // Lambdas are closures — use funcBoundary=false so outer vars remain accessible
        this.push(false);
        for (const p of (expr.params ?? [])) {
          const pname = typeof p === 'string' ? p : p.name;
          if (pname) this.define(pname, expr.line, false);
        }
        const body = expr.body;
        if (Array.isArray(body))         this.checkBlock(body);
        else if (body?.type === 'expr')  this.checkExpr(body.value);
        else if (body?.type === 'block') this.checkBlock(body.stmts ?? body.body ?? []);
        else                             this.checkExpr(body);
        this.pop();
        return;
      }

      case 'Array': {
        for (const el of (expr.items ?? expr.elements ?? [])) this.checkExpr(el);
        return;
      }

      case 'Tuple': {
        for (const f of (expr.items ?? expr.fields ?? [])) this.checkExpr(f.value ?? f);
        return;
      }

      case 'NavIndex': {
        this.checkExpr(expr.obj);
        const spec = expr.spec;
        if (spec?.index) this.checkExpr(spec.index);
        if (spec?.from)  this.checkExpr(spec.from);
        if (spec?.to)    this.checkExpr(spec.to);
        return;
      }

      case 'FieldAccess': {
        this.checkExpr(expr.obj);
        return;
      }

      case 'CollectionOp': {
        this.checkExpr(expr.obj);
        if (expr.arg)  this.checkExpr(expr.arg);
        if (expr.arg2) this.checkExpr(expr.arg2);
        return;
      }

      case 'Pipe': {
        this.checkExpr(expr.value);
        this.checkExpr(expr.rhs ?? expr.fn);
        return;
      }

      case 'ImplicitConcat':
      case 'JuxtaConcat':
      case 'CommaJoin': {
        const items = expr.items ?? [];
        // Prefix hot-def in expression context: °name op expr
        // Parsed as ImplicitConcat[{Ident name:'' hot:true}, <expr starting with name>]
        if (items.length >= 2 &&
            items[0]?.type === 'Ident' && items[0]?.hot === true && !items[0]?.name) {
          const hotName = this._leftmostIdent(items[1]);
          if (hotName) this.hotDefine(hotName, items[1]?.line ?? expr.line);
        }
        for (const item of items) this.checkExpr(item);
        return;
      }

      case 'TypeMetadata': {
        // #? is safe access — target may be undefined, don't emit E_VAR
        return;
      }

      case 'DataOp': {
        this.checkExpr(expr.obj ?? expr.value);
        if (expr.arg) this.checkExpr(expr.arg);
        return;
      }

      case 'Match': {
        this.checkStmt(expr);
        return;
      }

      case 'Literal': {
        // String literals may embed interpolated identifier names: {varname}
        if (expr.kind === 'str' && Array.isArray(expr.value)) {
          for (const part of expr.value) {
            if (part.t === 'expr' && typeof part.v === 'string') {
              const name = part.v.trim();
              // Only look up simple identifiers (no operators/spaces)
              if (/^[\p{L}_][\p{L}\p{M}0-9_]*$/u.test(name)) this.lookup(name, expr.line);
            }
          }
        }
        return;
      }

      // Terminals — nothing to check
      case 'BoolLiteral':
      case 'IntLiteral':
      case 'FloatLiteral':
      case 'StringLiteral':
      case 'CharLiteral':
      case 'Numeral':
      case 'BashExec':
      case 'CliArgs':
      case 'TerminalSize':
      case 'KeyInput':
        return;

      default:
        if (expr.left)    this.checkExpr(expr.left);
        if (expr.right)   this.checkExpr(expr.right);
        if (expr.value)   this.checkExpr(expr.value);
        if (expr.obj)     this.checkExpr(expr.obj);
        if (expr.operand) this.checkExpr(expr.operand);
    }
  }
}

// ─── Value constructors ───────────────────────────────────────────────────────

const mkInt   = v => ({ type: 'int',   v: Math.trunc(v) });
const mkFloat = v => ({ type: 'float', v });
const mkBool  = v => ({ type: 'bool',  v: !!v });
const mkStr   = v => ({ type: 'str',   v: String(v) });
const mkChar  = v => ({ type: 'char',  v: String(v) });
const mkArr   = v => ({ type: 'arr',   v });
const mkUnit  = () => ({ type: 'unit' });

// ─── Interpreter ──────────────────────────────────────────────────────────────

export class Interpreter {
  constructor(outputFn, inputFn = async () => '', moduleResolver = null, tuiContext = null) {
    this.outputFn        = outputFn;
    this.inputFn         = inputFn;
    this.steps           = 0;
    this.maxSteps        = 50_000;
    this.maxInfiniteIter = 100_000;
    this.outputBytes     = 0;
    this.maxBytes        = 32_000;
    this.lastYield       = performance.now();
    this.numeralMode     = 0x0030;
    this.moduleResolver  = moduleResolver;
    this.moduleCache     = new Map();
    this.tui             = tuiContext;
    this.cliArgs         = [];
    this.loadingModules  = new Set();
  }

  async loadModule(path) {
    if (!this.moduleResolver)
      throw new ZyError(`Cannot import '${path}': no module resolver available`);

    const result = await this.moduleResolver(path);
    if (result == null || result.notFound) {
      const displayPath = result?.path ?? path;
      throw new ZyError(`module not found: ${displayPath}`);
    }
    // Use resolved absolute path as canonical key so circular-import detection
    // works even when the same file is imported via different relative paths.
    const cacheKey = (typeof result === 'object' && result.resolvedPath) ? result.resolvedPath : path;

    if (this.moduleCache.has(cacheKey)) return this.moduleCache.get(cacheKey);
    if (this.loadingModules.has(cacheKey)) {
      const modName = cacheKey.replace(/^.*\//, '').replace(/\.zy$/, '');
      throw new ZyStaticError(`E004: Circular import detected: module '${modName}' is already being loaded`);
    }
    this.loadingModules.add(cacheKey);
    const src      = typeof result === 'string' ? result : result.src;
    const childRes = typeof result === 'string' ? this.moduleResolver : result.resolver;

    const tokens = new Lexer(src).tokenize();
    const ast    = new Parser(tokens).parse();

    const modInterp = new Interpreter(this.outputFn, this.inputFn, childRes);
    modInterp.moduleCache    = this.moduleCache;
    modInterp.loadingModules = this.loadingModules;

    const modEnv = new Env(null, false, true); // isModuleScope=true
    modInterp.globalEnv = modEnv;

    // Support both old-style (bare top-level statements) and new block syntax # name { ... }
    const modBody = (ast.body.length === 1 && ast.body[0].type === 'ModuleBlock')
      ? ast.body[0].body
      : ast.body;

    // Collect exported names from ExportDecl nodes before execution
    const exportPairs = [];
    for (const s of modBody) {
      if (s.type === 'ExportDecl') for (const p of s.names) exportPairs.push(p);
    }

    await modInterp.execBlock(modBody, modEnv);

    // Bind all module-level functions to modEnv so intra-module calls work
    for (const val of modEnv.vars.values()) {
      if (val.type === 'func' && !val.closureEnv) val.closureEnv = modEnv;
    }

    // Build module value with only exported names
    const exports = new Map();
    for (const p of exportPairs) {
      if (p.kind === 'reexport') {
        // alias::member or alias.member re-export
        const aliasVal = modEnv.vars.get(p.alias);
        if (aliasVal && aliasVal.type === 'module' && aliasVal.exports.has(p.member)) {
          exports.set(p.exported, aliasVal.exports.get(p.member));
        }
      } else {
        // own export (with optional rename)
        if (modEnv.vars.has(p.internal)) exports.set(p.exported, modEnv.vars.get(p.internal));
      }
    }

    this.loadingModules.delete(cacheKey);
    const modVal = { type: 'module', exports };
    this.moduleCache.set(cacheKey, modVal);
    return modVal;
  }

  tick() {
    if (this.tui?.aborted) throw new ZyError('Program stopped.');
    if (++this.steps > this.maxSteps)
      throw new ZyError('Execution limit reached (50 000 steps) — infinite loop?');
  }

  maybeYield() {
    const now = performance.now();
    if (now - this.lastYield > 16) {
      this.lastYield = now;
      return new Promise(r => setTimeout(r, 0));
    }
  }

  emit(text) {
    this.outputBytes += text.length;
    if (this.outputBytes > this.maxBytes)
      throw new ZyError('Output limit reached (32 KB) — infinite loop?');
    if (this.tui && this.tui.active) this.tui.print(text);
    else this.outputFn(text);
  }

  async run(program, filePath = null) {
    const env = new Env();
    this.globalEnv = env;
    if (program.body.length >= 1 && program.body[0].type === 'ModuleBlock') {
      const mb = program.body[0];
      const modName = mb.name; // preserve as declared (e.g. '.module' or 'matematicas')
      const pathStr = filePath ? `'${filePath}'` : `'${modName}.zy'`;
      // Use filename stem for import hint (matches CLI for mismatched names)
      const importHint = filePath
        ? filePath.replace(/^.*[/\\]/, '').replace(/\.zy$/, '')
        : modName.replace(/^\./, '');
      this.emit(`warning: ${pathStr} is a module file and cannot be run directly\n  = help: module '${modName}' is meant to be imported with <# ./${importHint} => alias`);
      return;
    }
    await this.execBlock(program.body, env);
  }

  async execBlock(stmts, env) {
    for (let i = 0; i < stmts.length; i++) {
      const stmt = stmts[i];
      // Prefix hot-def sentinel: ExprStmt{Ident{hot:true, name:''}} followed by the actual op.
      // Pre-initialize the target variable in the enclosing function/root scope.
      if (stmt.type === 'ExprStmt' &&
          stmt.expr?.type === 'Ident' && stmt.expr.hot && stmt.expr.name === '') {
        const next = stmts[i + 1];
        const targetName = this._hotTargetName(next);
        if (targetName) {
          let exists = false;
          try { env.get(targetName); exists = true; } catch (_) {}
          if (!exists) env.hotDef(targetName, this._hotNeutralForStmt(next));
        }
        continue;
      }
      const sig = await this.exec(stmt, env);
      if (sig instanceof ZyReturn || sig instanceof ZyBreak || sig instanceof ZyContinue)
        return sig;
    }
  }

  async exec(stmt, env) {
    this.tick();

    switch (stmt.type) {
      case 'Noop': return;
      case 'ExportDecl': return;
      case 'ModuleBlock': return;

      case 'Import': {
        const modVal = await this.loadModule(stmt.path);
        if (!env.set(stmt.alias, modVal)) env.def(stmt.alias, modVal);
        return;
      }

      case 'SetNumeralMode': {
        this.numeralMode = stmt.base;
        return;
      }

      case 'Output': {
        for (const item of stmt.items) this.emit(this.displayOutput(await this.eval(item, env)));
        if (stmt.newline) this.emit('\n');
        return;
      }

      case 'Input': {
        if (stmt.prompt) this.emit(this.display(await this.eval(stmt.prompt, env)));
        const line = await this.inputFn();
        const val = mkStr(line.trim());
        if (!env.set(stmt.varName, val)) env.def(stmt.varName, val);
        return;
      }

      case 'VarAssign': {
        const val = await this.eval(stmt.value, env);
        if (!env.set(stmt.name, val)) {
          if (stmt.hot) env.hotDef(stmt.name, val);
          else env.def(stmt.name, val);
        }
        return;
      }

      case 'ConstAssign': {
        const val = await this.eval(stmt.value, env);
        env.def(stmt.name, val, true);
        return;
      }

      case 'CompoundAssign': {
        let cur;
        try { cur = env.get(stmt.name); }
        catch (e) {
          if (!stmt.hot) throw e;
          cur = (stmt.op === '*' || stmt.op === '/') ? mkInt(1) : mkInt(0);
          env.hotDef(stmt.name, cur);
        }
        const rhs = await this.eval(stmt.value, env);
        env.set(stmt.name, this.applyOp(stmt.op, cur, rhs));
        return;
      }

      case 'Increment': {
        let cur;
        try { cur = env.get(stmt.name); }
        catch (e) {
          if (!stmt.hot) throw e;
          cur = mkInt(0);
          env.hotDef(stmt.name, cur);
        }
        const one = cur.type === 'float' ? mkFloat(1) : mkInt(1);
        env.set(stmt.name, this.applyOp(stmt.op === '++' ? '+' : '-', cur, one));
        return;
      }

      case 'FuncDecl': {
        env.def(stmt.name, { type: 'func', name: stmt.name, params: stmt.params, body: stmt.body });
        return;
      }

      case 'Return': {
        const val = stmt.value ? await this.eval(stmt.value, env) : mkUnit();
        return new ZyReturn(val);
      }

      case 'Break':    return new ZyBreak(stmt.label ?? null);
      case 'Continue': return new ZyContinue(stmt.label ?? null);

      case 'CliArgs':
        env.def(stmt.variable, { type: 'arr', v: this.cliArgs.map(s => mkStr(s)) });
        return;

      case 'Sleep': {
        const ms = (await this.eval(stmt.duration, env)).v;
        await new Promise(r => {
          const id = setTimeout(r, Math.max(0, Math.trunc(ms)));
          if (this.tui) this.tui._sleepCancel = () => { clearTimeout(id); r(); };
        });
        if (this.tui) this.tui._sleepCancel = null;
        return;
      }

      case 'ClearScreen':
        if (this.tui) this.tui.clear();
        return;

      case 'KeyInput': {
        const ch = stmt.blocking
          ? await (this.tui ? this.tui.readKey() : Promise.resolve('\0'))
          : (this.tui ? this.tui.pollKey() : '\0');
        const cur = { type: 'char', v: ch };
        if (!env.set(stmt.variable, cur)) env.def(stmt.variable, cur);
        return;
      }

      case 'OutputPos': {
        const { slots, items } = stmt;
        let row = null, col = null, bks = 0, fg = null, bg = null;
        if (slots.length === 1 && slots[0]?.type === 'Ident') {
          const tv = await this.eval(slots[0], env);
          const get = i => tv.v?.[i]?.v ?? null;
          row = get(0); col = get(1); bks = get(2) ?? 0; fg = get(3); bg = get(4);
        } else {
          const vals = [];
          for (const s of slots) vals.push(s ? await this.eval(s, env) : null);
          if (vals[0] != null) row = vals[0].v;
          if (vals[1] != null) col = vals[1].v;
          if (vals[2] != null) bks = vals[2].v;
          if (vals[3] != null) fg = vals[3].v;
          if (vals[4] != null) bg = vals[4].v;
        }
        const parts = [];
        for (const i of items) parts.push(await this.eval(i, env));
        const text = parts.map(v => this.displayOutput(v)).join('');
        if (this.tui) this.tui.printAt(row, col, text, bks, fg, bg);
        else this.emit(text);
        return;
      }

      case 'TuiBlock': {
        if (!this.tui) return await this.execBlock(stmt.body, new Env(env));
        const savedMax  = this.maxSteps;
        const savedByte = this.maxBytes;
        const savedIter = this.maxInfiniteIter;
        this.maxSteps        = Infinity;
        this.maxBytes        = Infinity;
        this.maxInfiniteIter = Infinity;
        this.tui.enter();
        try {
          await this.execBlock(stmt.body, new Env(env));
        } finally {
          this.tui.leave();
          this.maxSteps        = savedMax;
          this.maxBytes        = savedByte;
          this.maxInfiniteIter = savedIter;
        }
        return;
      }

      case 'If': {
        if (this.truthy(await this.eval(stmt.cond, env))) return await this.execBlock(stmt.then, new Env(env));
        for (const ei of stmt.elseifs)
          if (this.truthy(await this.eval(ei.cond, env))) return await this.execBlock(ei.body, new Env(env));
        if (stmt.else) return await this.execBlock(stmt.else, new Env(env));
        return;
      }

      case 'Loop': return await this.execLoop(stmt, env);

      case 'ExprStmt': {
        await this.eval(stmt.expr, env);
        return;
      }

      case 'IndexAssign': {
        const col = env.get(stmt.obj);
        const i   = (await this.eval(stmt.index, env)).v;
        if (i === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
        const val = await this.eval(stmt.value, env);
        const idx = i < 0 ? col.v.length + i : i - 1;
        let updated;
        if (col.type === 'arr') {
          const r = [...col.v]; r[idx] = val; updated = mkArr(r);
        } else if (col.type === 'tuple') {
          throw new ZyError(
            `cannot modify tuple '${stmt.obj}': tuples are immutable\n` +
            `hint: use 'new_var = ${stmt.obj}[${i}]$~ value' for a functional update`
          );
        } else {
          throw new ZyError(`'${stmt.obj}' is not an array`);
        }
        if (!env.set(stmt.obj, updated)) env.def(stmt.obj, updated);
        return;
      }

      case 'ArrayDestruct': {
        const arr = await this.eval(stmt.value, env);
        if (arr.type !== 'arr' && arr.type !== 'tuple') throw new ZyError('Array destructuring requires an array');
        if (arr.type === 'tuple') arr.v = arr.v; // tuples are compatible
        let i = 0;
        for (const t of stmt.targets) {
          if (t.rest) {
            const val = mkArr(arr.v.slice(i));
            try { if (!env.set(t.name, val)) env.def(t.name, val); }
            catch { env.destroy(t.name); env.def(t.name, val); }
          } else if (t.name === '_') {
            i++;
          } else {
            const val = arr.v[i] ?? mkUnit();
            try { if (!env.set(t.name, val)) env.def(t.name, val); }
            catch { env.destroy(t.name); env.def(t.name, val); }
            i++;
          }
        }
        return;
      }

      case 'TupleDestruct': {
        const tup = await this.eval(stmt.value, env);
        if (tup.type !== 'tuple' && tup.type !== 'arr')
          throw new ZyError('Tuple destructuring requires a tuple or array');
        const items = tup.v;
        let i = 0;
        for (const t of stmt.targets) {
          if (t.rest) {
            const val = mkArr(items.slice(i));
            try { if (!env.set(t.name, val)) env.def(t.name, val); }
            catch { env.destroy(t.name); env.def(t.name, val); }
          } else {
            const val = items[i] ?? mkUnit();
            try { if (!env.set(t.name, val)) env.def(t.name, val); }
            catch { env.destroy(t.name); env.def(t.name, val); }
            i++;
          }
        }
        return;
      }

      case 'NamedDestruct': {
        const tup = await this.eval(stmt.value, env);
        if (tup.type !== 'tuple' || !tup.keys)
          throw new ZyError('Named destructuring requires a named tuple');
        for (const { field, name } of stmt.targets) {
          const i = tup.keys.indexOf(field);
          if (i < 0) throw new ZyError(`Unknown field '${field}'`);
          const val = tup.v[i];
          if (!env.set(name, val)) env.def(name, val);
        }
        return;
      }

      case 'TryCatch': {
        let result;
        try {
          result = await this.execBlock(stmt.tryBody, new Env(env));
        } catch (err) {
          if (err instanceof ZyErrorPropagate) throw err; // $!! propagates through try/catch
          const errType = err.errType ?? '##_';
          const matched = stmt.catches.find(
            c => !c.errType || c.errType === errType || c.errType === '##_'
          );
          if (matched) {
            const catchEnv = new Env(env);
            const errMsg = err.message ?? String(err);
            catchEnv.def('_err', { type: 'error', errType, v: errMsg });
            result = await this.execBlock(matched.body, catchEnv);
          } else {
            throw err;
          }
        } finally {
          if (stmt.finallyBody) await this.execBlock(stmt.finallyBody, new Env(env));
        }
        return result;
      }

      case 'LifetimeEnd': {
        env.destroy(stmt.name);
        return;
      }
    }
  }

  async execLoop(loop, env) {
    const outer = new Env(env);
    const brk = sig => sig instanceof ZyBreak    && (sig.label === null || sig.label === loop.label);
    const cnt = sig => sig instanceof ZyContinue && (sig.label === null || sig.label === loop.label);

    if (loop.kind === 'infinite') {
      let iter = 0;
      while (true) {
        if (++iter > this.maxInfiniteIter)
          throw new ZyError(`Infinite loop limit reached (${this.maxInfiniteIter} iterations) — add @! to break`);
        this.tick();
        const sig = await this.execBlock(loop.body, new Env(outer));
        if (brk(sig)) break;
        if (cnt(sig)) continue;
        if (sig instanceof ZyReturn) return sig;
        if (sig instanceof ZyBreak) return sig;
        if (sig instanceof ZyContinue) return sig;
        await this.maybeYield();
      }
      return;
    }

    if (loop.kind === 'while') {
      const firstVal = await this.eval(loop.cond, env);
      if (firstVal.type === 'int') {
        // Times loop: repeat N times
        const n = firstVal.v;
        for (let i = 0; i < n; i++) {
          this.tick();
          const sig = await this.execBlock(loop.body, new Env(outer));
          if (brk(sig)) break;
          if (sig instanceof ZyReturn) return sig;
          if (sig instanceof ZyBreak || sig instanceof ZyContinue) return sig;
          await this.maybeYield();
        }
      } else {
        // While loop: re-evaluate condition each iteration
        let cond = firstVal;
        while (this.truthy(cond)) {
          this.tick();
          const sig = await this.execBlock(loop.body, new Env(outer));
          if (brk(sig)) break;
          if (cnt(sig)) { cond = await this.eval(loop.cond, env); continue; }
          if (sig instanceof ZyReturn) return sig;
          if (sig instanceof ZyBreak) return sig;
          if (sig instanceof ZyContinue) return sig;
          await this.maybeYield();
          cond = await this.eval(loop.cond, env);
        }
      }
      return;
    }

    if (loop.kind === 'range') {
      const from = (await this.eval(loop.from, env)).v;
      const to   = (await this.eval(loop.to,   env)).v;
      let step = loop.step ? (await this.eval(loop.step, env)).v : (from <= to ? 1 : -1);
      if (loop.step && from > to && step > 0) step = -step;
      if (loop.step && from < to && step < 0) step = -step;
      if (step === 0) throw new ZyError('Loop step cannot be zero');
      for (let i = from; step > 0 ? i <= to : i >= to; i += step) {
        this.tick();
        const iter = new Env(outer);
        iter.def(loop.var, mkInt(i));
        const sig = await this.execBlock(loop.body, iter);
        if (brk(sig)) break;
        if (cnt(sig)) continue;
        if (sig instanceof ZyReturn) return sig;
        if (sig instanceof ZyBreak || sig instanceof ZyContinue) return sig;
        await this.maybeYield();
      }
      return;
    }

    if (loop.kind === 'foreach') {
      const it = await this.eval(loop.iterable, env);
      let items;
      if      (it.type === 'arr')   items = it.v;
      else if (it.type === 'str')   items = [...it.v].map(mkChar);
      else if (it.type === 'tuple') items = it.v;
      else throw new ZyError(`Cannot iterate over ${it.type}`);

      for (const item of items) {
        this.tick();
        const iter = new Env(outer);
        iter.def(loop.var, item);
        const sig = await this.execBlock(loop.body, iter);
        if (brk(sig)) break;
        if (cnt(sig)) continue;
        if (sig instanceof ZyReturn) return sig;
        if (sig instanceof ZyBreak || sig instanceof ZyContinue) return sig;
        await this.maybeYield();
      }
      return;
    }
  }

  async eval(expr, env) {
    this.tick();

    switch (expr.type) {
      case 'Literal':
        switch (expr.kind) {
          case 'int':   return mkInt(expr.value);
          case 'float': return mkFloat(expr.value);
          case 'bool':  return mkBool(expr.value);
          case 'char':  return mkChar(expr.value);
          case 'str':   return await this.evalStr(expr.value, env);
          case 'unit':  return mkUnit();
        }
        break;

      case 'Ident':
        if (expr.hot) {
          try { return env.get(expr.name); }
          catch (_) { const n = mkInt(0); env.hotDef(expr.name, n); return n; }
        }
        return env.get(expr.name);

      case 'TerminalSize': {
        if (!this.tui) return { type: 'tuple', v: [mkInt(24), mkInt(80)], keys: null };
        const [rows, cols] = this.tui.getSize();
        return { type: 'tuple', v: [mkInt(rows), mkInt(cols)], keys: null };
      }

      case 'BashExec': {
        const _cmd = (expr.cmd ?? '').replace(/['"]/g, ' ').trim();
        const _now = new Date();
        const _pad = n => String(n).padStart(2, '0');
        if (_cmd.includes('%Y')) return mkStr(String(_now.getFullYear()));
        if (_cmd.includes('%m')) return mkStr(_pad(_now.getMonth() + 1));
        if (_cmd.includes('%d')) return mkStr(_pad(_now.getDate()));
        if (_cmd.includes('%H')) return mkStr(_pad(_now.getHours()));
        if (_cmd.includes('%M')) return mkStr(_pad(_now.getMinutes()));
        if (_cmd.includes('%S')) return mkStr(_pad(_now.getSeconds()));
        if (_cmd.includes('%s')) return mkStr(String(Math.floor(Date.now() / 1000)));
        if (_cmd.startsWith('echo ') && !_cmd.includes('$')) return mkStr(_cmd.slice(5).trim().replace(/^['"]|['"]$/g, ''));
        // Default: nanosecond-ish timestamp for random seeds
        return mkStr(String(Date.now() * 1000000 + Math.trunc(Math.random() * 999999)));
      }

      case 'Array':
        return mkArr(await Promise.all(expr.items.map(i => this.eval(i, env))));

      case 'Tuple': {
        const items = await Promise.all(expr.items.map(i => this.eval(i, env)));
        return { type: 'tuple', v: items, keys: expr.keys ?? null };
      }

      case 'ImplicitConcat': {
        const items = expr.items ?? [];
        // Prefix hot-def sentinel in RHS: [Ident{hot:true, name:''}, <inner_expr>]
        if (items.length >= 2 &&
            items[0]?.type === 'Ident' && items[0]?.hot && items[0]?.name === '') {
          const inner = items[1];
          const hotName = this._leftmostIdentName(inner);
          if (hotName) {
            let exists = false;
            try { env.get(hotName); exists = true; } catch (_) {}
            if (!exists) env.hotDef(hotName, this._hotNeutralForExpr(inner));
          }
          return await this.eval(inner, env);
        }
        const vals = [];
        for (const item of items) vals.push(await this.eval(item, env));
        return mkStr(vals.map(v => this.display(v)).join(''));
      }
      case 'CommaJoin': {
        const vals = await Promise.all(expr.items.map(i => this.eval(i, env)));
        return mkStr(vals.map(v => this.display(v)).join(''));
      }

      case 'BinOp': {
        if (expr.op === '&&') {
          return mkBool(this.truthy(await this.eval(expr.left, env)) &&
                        this.truthy(await this.eval(expr.right, env)));
        }
        if (expr.op === '||') {
          return mkBool(this.truthy(await this.eval(expr.left, env)) ||
                        this.truthy(await this.eval(expr.right, env)));
        }
        return this.applyOp(expr.op, await this.eval(expr.left, env), await this.eval(expr.right, env));
      }

      case 'UnaryOp': {
        const val = await this.eval(expr.operand, env);
        if (expr.op === '-')
          return val.type === 'float' ? mkFloat(-val.v) : mkInt(-val.v);
        if (expr.op === '!')
          return mkBool(!this.truthy(val));
        break;
      }

      case 'Call': {
        const fn = env.get(expr.callee);
        if (!fn || fn.type !== 'func')
          throw new ZyError(`'${expr.callee}' is not a function`);
        const args = await Promise.all(expr.args.map(a => this.eval(a, env)));
        // Build output param writeback list
        const outWriteback = fn.params.some(p => p.isOut)
          ? fn.params.map((p, i) => p.isOut && expr.args[i]?.type === 'Ident'
              ? { paramName: p.name, callerName: expr.args[i].name, callerEnv: env }
              : null).filter(Boolean)
          : null;
        return await this.callFunc(fn, args, outWriteback);
      }

      case 'CallExpr': {
        const fn = await this.eval(expr.callee, env);
        if (!fn || fn.type !== 'func')
          throw new ZyError(`Expression is not a function`);
        const args = await Promise.all(expr.args.map(a => this.eval(a, env)));
        return await this.callFunc(fn, args);
      }

      case 'NavIndex': {
        const obj  = await this.eval(expr.obj, env);
        const spec = expr.spec;

        if (spec.kind === 'simple') {
          // Simple 1-based subscript
          const idx = (await this.eval(spec.index, env)).v;
          return this.navGetAt(obj, idx);
        }

        if (spec.kind === 'path') {
          // Single nav path — may return scalar or flat array if path has ranges
          const resolvedSteps = await this.resolveNavSteps(spec.path, env);
          return await this.evalNavPath(obj, resolvedSteps);
        }

        if (spec.kind === 'flat') {
          // Multiple nav paths — flat array result
          const results = [];
          for (const path of spec.paths) {
            const resolvedSteps = await this.resolveNavSteps(path, env);
            const val = await this.evalNavPath(obj, resolvedSteps);
            if (val.type === 'arr') results.push(...val.v);
            else results.push(val);
          }
          return mkArr(results);
        }

        if (spec.kind === 'structured') {
          if (spec.groups.length === 1) {
            // Single structured group → flat array of that group's values
            const group = spec.groups[0];
            const results = [];
            for (const path of group.paths) {
              const resolvedSteps = await this.resolveNavSteps(path, env);
              const val = await this.evalNavPath(obj, resolvedSteps);
              if (val.type === 'arr') results.push(...val.v);
              else results.push(val);
            }
            return mkArr(results);
          }
          // Multiple groups → array of arrays
          const groups = [];
          for (const group of spec.groups) {
            const results = [];
            for (const path of group.paths) {
              const resolvedSteps = await this.resolveNavSteps(path, env);
              const val = await this.evalNavPath(obj, resolvedSteps);
              if (val.type === 'arr') results.push(...val.v);
              else results.push(val);
            }
            groups.push(mkArr(results));
          }
          return mkArr(groups);
        }

        throw new ZyError(`Unknown nav spec kind: ${spec.kind}`);
      }

      case 'JuxtaConcat': {
        const parts = [];
        for (const it of expr.items) parts.push(this.display(await this.eval(it, env)));
        return mkStr(parts.join(''));
      }

      case 'Lambda': {
        return {
          type: 'func', name: '<lambda>',
          params: expr.params.map(p => ({ name: p })),
          body: expr.body.type === 'block'
            ? expr.body.stmts
            : [{ type: 'Return', value: expr.body.value }],
          closureEnv: env,
        };
      }

      case 'Pipe': {
        const val = await this.eval(expr.value, env);
        const pipeEnv = new Env(env);
        pipeEnv.def('_', val);
        const result = await this.eval(expr.rhs, pipeEnv);
        if (result && result.type === 'func') return await this.callFunc(result, [val]);
        return result;
      }

      case 'FieldAccess': {
        const obj = await this.eval(expr.obj, env);
        if (obj.type === 'module') {
          if (!obj.exports.has(expr.field)) {
            const modAlias = expr.obj?.name ?? 'module';
            throw new ZyError(`module '${modAlias}' does not export function '${expr.field}'`);
          }
          return obj.exports.get(expr.field);
        }
        if (obj.type !== 'tuple' || !obj.keys)
          throw new ZyError(`'.${expr.field}' requires a named tuple`);
        const i = obj.keys.indexOf(expr.field);
        if (i < 0) throw new ZyRuntimeError(
          `Named tuple has no field '${expr.field}'. Available fields: ${obj.keys.filter(k => k).join(', ')}`,
          '##_'
        );
        return obj.v[i];
      }

      case 'CollectionOp':
        return await this.evalCollectionOp(expr, env);

      case 'FuncUpdate': {
        const arr = await this.eval(expr.obj, env);
        const i   = (await this.eval(expr.index, env)).v;
        if (i === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
        const val = await this.eval(expr.value, env);
        const idx = i < 0 ? arr.v.length + i : i - 1;
        if (arr.type === 'arr')   { const r = [...arr.v]; r[idx] = val; return mkArr(r); }
        if (arr.type === 'str')   { const r = [...arr.v]; r[idx] = this.display(val); return mkStr(r.join('')); }
        if (arr.type === 'tuple') { const r = [...arr.v]; r[idx] = val; return { type:'tuple', v:r, keys:arr.keys }; }
        throw new ZyError(`$~ not supported on ${arr.type}`);
      }

      case 'TypeMetadata': {
        let val;
        if (expr.obj.type === 'Ident') {
          try { val = env.get(expr.obj.name); }
          catch { return { type: 'tuple', v: [mkStr('##_'), mkInt(0), mkUnit()], keys: null }; }
        } else {
          val = await this.eval(expr.obj, env);
        }
        return this.typeMetadata(val);
      }

      case 'Match': {
        const val = await this.eval(expr.expr, env);
        for (const arm of expr.arms) {
          if (await this.matchPattern(arm.pattern, val, env)) {
            if (arm.body.type === 'block') {
              const sig = await this.execBlock(arm.body.stmts, new Env(env));
              return sig instanceof ZyReturn ? sig.value : mkUnit();
            }
            return await this.eval(arm.body.value, env);
          }
        }
        return mkUnit();
      }

      case 'DataOp': {
        const val = await this.eval(expr.arg, env);
        const toNum = v => {
          if (v.type === 'int' || v.type === 'float') return v.v;
          if (v.type === 'str') { const n = parseFloat(v.v); return isNaN(n) ? 0 : n; }
          return 0;
        };
        const fmtSci = (num, prec, mode) => {
          if (num === 0) return '0e0';
          const neg = num < 0;
          const abs = Math.abs(num);
          let exp = Math.floor(Math.log10(abs));
          let mant = abs / Math.pow(10, exp);
          if (prec !== null) {
            if (mode === 'round') mant = parseFloat(mant.toFixed(prec));
            else { const f = Math.pow(10, prec); mant = Math.trunc(mant * f) / f; }
            if (mant >= 10) { mant /= 10; exp += 1; }
          }
          let mantStr = parseFloat(mant.toPrecision(15)).toString().replace(/\.?0+$/, '');
          if (prec !== null && !mantStr.includes('.')) mantStr += '.0';
          return (neg ? '-' : '') + mantStr + 'e' + exp;
        };
        switch (expr.kind) {
          case 'eval': {
            if (val.type === 'str') {
              const s = val.v.trim();
              // Normalize Unicode digits to ASCII before parsing
              const ascii = [...s].map(ch => {
                const dv = digitValue(ch);
                return (dv >= 0 && !(ch >= '0' && ch <= '9')) ? String(dv) : ch;
              }).join('');
              const p = parseFloat(ascii);
              if (!isNaN(p) && /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(ascii)) {
                if (Number.isInteger(p) && !ascii.includes('.') && !ascii.toLowerCase().includes('e')) return mkInt(p);
                return mkFloat(p);
              }
            }
            return val;
          }
          case 'round':       return mkFloat(parseFloat(toNum(val).toFixed(expr.prec)));
          case 'trunc': {
            const n = toNum(val);
            const f = Math.pow(10, expr.prec);
            return mkFloat(Math.trunc(n * f) / f);
          }
          case 'comma':       return mkStr(toNum(val).toLocaleString('en-US'));
          case 'comma_round': {
            const n = parseFloat(toNum(val).toFixed(expr.prec));
            return mkStr(n.toLocaleString('en-US', { minimumFractionDigits: expr.prec, maximumFractionDigits: expr.prec }));
          }
          case 'comma_trunc': {
            const raw = toNum(val);
            const f = Math.pow(10, expr.prec);
            const n = Math.trunc(raw * f) / f;
            return mkStr(n.toLocaleString('en-US', { minimumFractionDigits: expr.prec, maximumFractionDigits: expr.prec }));
          }
          case 'sci':       return mkStr(fmtSci(toNum(val), null, null));
          case 'sci_round': return mkStr(fmtSci(toNum(val), expr.prec, 'round'));
          case 'sci_trunc': return mkStr(fmtSci(toNum(val), expr.prec, 'trunc'));
          case 'base_conv': {
            const n = val.type === 'char' ? val.v.codePointAt(0) : Math.trunc(toNum(val));
            const base = expr.prec;
            if (base === 16) return mkStr('0x' + n.toString(16).toUpperCase().padStart(4, '0'));
            if (base === 2)  return mkStr('0b' + n.toString(2));
            if (base === 8)  return mkStr('0o' + n.toString(8));
            if (base === 10) return mkStr('0d' + n.toString(10).padStart(4, '0'));
            return val;
          }
        }
        return val;
      }

      case 'CastOp': {
        const val = await this.eval(expr.operand, env);
        if (val.type !== 'int' && val.type !== 'float') {
          const _typeNames = { str:'String', int:'Integer', float:'Float', bool:'Bool', char:'Char', arr:'Array', tuple:'Tuple', unit:'Unit' };
          const typeName = _typeNames[val.type] ?? (val.type.charAt(0).toUpperCase() + val.type.slice(1));
          throw new ZyRuntimeError(`${expr.op} requires a numeric value, got ${typeName}`, '##_');
        }
        if (expr.op === '##.') return mkFloat(val.v);
        if (expr.op === '###') {
          // Round half away from zero
          const n = val.v;
          return mkInt(n >= 0 ? Math.floor(n + 0.5) : Math.ceil(n - 0.5));
        }
        if (expr.op === '##!') return mkInt(Math.trunc(val.v));
        return val;
      }
    }

    return mkUnit();
  }

  // ─── Navigation helpers ───────────────────────────────────────────────────

  // Resolve an AST nav step array to concrete { kind, val } or { kind, from, to } steps
  async resolveNavSteps(steps, env) {
    const resolved = [];
    for (const step of steps) {
      if (step.kind === 'index') {
        const v = (await this.eval(step.expr, env)).v;
        resolved.push({ kind: 'index', val: v });
      } else {
        const from = (await this.eval(step.from, env)).v;
        const to   = (await this.eval(step.to,   env)).v;
        resolved.push({ kind: 'range', from, to });
      }
    }
    return resolved;
  }

  // Evaluate a nav path against an object; returns scalar or flat array
  async evalNavPath(obj, resolvedSteps) {
    if (resolvedSteps.length === 0) return obj;
    const [step, ...rest] = resolvedSteps;

    if (step.kind === 'index') {
      const elem = this.navGetAt(obj, step.val);
      return await this.evalNavPath(elem, rest);
    }

    // Range step — fan out
    const { from, to } = step;
    const results = [];
    for (let i = from; i <= to; i++) {
      const elem = this.navGetAt(obj, i);
      const sub = await this.evalNavPath(elem, rest);
      // Flatten one level when nested ranges produce arrays
      if (rest.length > 0 && sub.type === 'arr') results.push(...sub.v);
      else results.push(sub);
    }
    return mkArr(results);
  }

  // 1-based get with error on index 0 and out-of-bounds
  navGetAt(obj, idx) {
    if (typeof idx === 'boolean') throw new ZyRuntimeError('Cannot use Bool as array index', '##Index');
    if (idx === 0) throw new ZyRuntimeError('index 0 is invalid — Zymbol uses 1-based indexing (use 1 for the first element, -1 for the last)', '##Index');
    if (obj.type === 'arr') {
      const i = idx < 0 ? obj.v.length + idx : idx - 1;
      if (i < 0 || i >= obj.v.length) throw new ZyRuntimeError(`array index out of bounds: index ${idx} for array of length ${obj.v.length}`, '##Index');
      return obj.v[i];
    }
    if (obj.type === 'tuple') {
      const i = idx < 0 ? obj.v.length + idx : idx - 1;
      if (i < 0 || i >= obj.v.length) throw new ZyRuntimeError(`array index out of bounds: index ${idx} for array of length ${obj.v.length}`, '##Index');
      return obj.v[i] ?? mkUnit();
    }
    if (obj.type === 'str') {
      const chars = [...obj.v];
      const i = idx < 0 ? chars.length + idx : idx - 1;
      if (i < 0 || i >= chars.length) throw new ZyRuntimeError(`array index out of bounds: index ${idx} for array of length ${chars.length}`, '##Index');
      return mkChar(chars[i]);
    }
    throw new ZyError(`Cannot subscript ${obj.type}`);
  }

  // Resolve a 1-based index to JS 0-based; 0 is clamped to 0 (for slices)
  resolve1Based(n, len) {
    if (n === 0) return 0;
    return n > 0 ? n - 1 : len + n;
  }

  typeMetadata(val) {
    const symMap = { int:'###', float:'##.', str:'##"', char:"##'", bool:'##?', arr:'##]', tuple:'##)', unit:'##_' };
    let sym;
    if (val.type === 'func') {
      sym = (val.name === '<lambda>') ? '##->' : '##()';
    } else if (val.type === 'error') {
      sym = val.errType ?? '##_'; // error type symbol = specific error code
    } else {
      sym = symMap[val.type] ?? '##_';
    }
    let count;
    switch (val.type) {
      case 'int':   count = String(Math.abs(val.v)).length; break;
      case 'float': count = String(val.v).replace(/^-/, '').length; break;
      case 'str':   count = [...val.v].length; break;
      case 'char':  count = 1; break;
      case 'bool':  count = 1; break;
      case 'arr':   count = val.v.length; break;
      case 'tuple': count = val.v.length; break;
      case 'func':  count = val.params?.length ?? 0; break;
      default:      count = 0;
    }
    return { type: 'tuple', v: [mkStr(sym), mkInt(count), val], keys: null };
  }

  // ─── Hot-def helpers ─────────────────────────────────────────────────────────

  // Return the name of the variable targeted by a statement (for sentinel pre-init)
  _hotTargetName(stmt) {
    if (!stmt) return null;
    if (stmt.type === 'CompoundAssign' || stmt.type === 'VarAssign' || stmt.type === 'Increment')
      return stmt.name;
    if (stmt.type === 'ExprStmt' && stmt.expr?.type === 'CollectionOp')
      return stmt.expr.obj?.name ?? null;
    return null;
  }

  // Return the neutral value for the first use of a hot-def variable (2-stmt prefix form)
  _hotNeutralForStmt(stmt) {
    if (!stmt) return mkInt(0);
    if (stmt.type === 'CompoundAssign' && (stmt.op === '*' || stmt.op === '/')) return mkInt(1);
    if (stmt.type === 'ExprStmt' && stmt.expr?.type === 'CollectionOp' && stmt.expr.op === '$+')
      return mkArr([]);
    if (stmt.type === 'VarAssign' && this._exprContainsOp(stmt.value, '$+')) return mkArr([]);
    if (stmt.type === 'VarAssign') return mkStr('');
    return mkInt(0);
  }

  // Return the neutral value for the first use of a hot-def variable (RHS ImplicitConcat form)
  _hotNeutralForExpr(expr) {
    if (!expr) return mkInt(0);
    if (expr.type === 'CollectionOp' && expr.op === '$+') return mkArr([]);
    return mkInt(0);
  }

  // Walk an expression and return the leftmost Ident name
  _leftmostIdentName(expr) {
    if (!expr) return null;
    if (expr.type === 'Ident') return expr.name || null;
    if (expr.type === 'CollectionOp') return this._leftmostIdentName(expr.obj);
    if (expr.type === 'BinOp') return this._leftmostIdentName(expr.left);
    return null;
  }

  // Check if an expression tree contains a CollectionOp with the given op
  _exprContainsOp(expr, op) {
    if (!expr) return false;
    if (expr.type === 'CollectionOp' && expr.op === op) return true;
    if (expr.type === 'ImplicitConcat') return (expr.items ?? []).some(i => this._exprContainsOp(i, op));
    return false;
  }

  async evalCollectionOp(expr, env) {
    // Hot array-accumulator: arr°$+ i initializes arr to [] instead of 0
    let col;
    if (expr.op === '$+' && expr.obj?.type === 'Ident' && expr.obj?.hot) {
      let existing = null;
      try { existing = env.get(expr.obj.name); } catch (_) {}
      if (existing === null) { col = mkArr([]); env.hotDef(expr.obj.name, col); }
      else col = existing;
    } else {
      col = await this.eval(expr.obj, env);
    }
    const arg = () => this.eval(expr.arg, env);

    // 1-based index resolution for collection ops
    const resolveIdx = (n, len) => {
      if (n === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
      return n < 0 ? len + n : n - 1;
    };
    const idx = async () => {
      const n = (await this.eval(expr.index, env)).v;
      return resolveIdx(n, col.v.length);
    };

    const notSupported = op => { throw new ZyError(`${op} not supported on ${col.type}`); };
    const colItems = () => {
      if (col.type === 'arr')   return col.v;
      if (col.type === 'tuple') return col.v;
      if (col.type === 'str')   return [...col.v].map(mkChar);
      notSupported('collection op');
    };
    const fromStr = items => col.type === 'str'
      ? mkStr(items.map(v => this.display(v)).join(''))
      : col.type === 'tuple'
        ? { type:'tuple', v: items, keys: null }
        : mkArr(items);

    switch (expr.op) {
      case '$#': {
        if (col.type === 'arr')   return mkInt(col.v.length);
        if (col.type === 'str')   return mkInt([...col.v].length);
        if (col.type === 'tuple') return mkInt(col.v.length);
        notSupported('$#');
      }

      case '$+': {
        const v = await arg();
        if (col.type === 'arr')   return mkArr([...col.v, v]);
        if (col.type === 'str')   return mkStr(col.v + this.display(v));
        if (col.type === 'tuple') return { type:'tuple', v:[...col.v,v], keys: col.keys ? [...col.keys,null] : null };
        notSupported('$+');
      }
      case '$+[i]': {
        const i = await idx(), v = await arg();
        if (col.type === 'arr') { const r=[...col.v]; r.splice(i,0,v); return mkArr(r); }
        if (col.type === 'str') { const r=[...col.v]; r.splice(i,0,this.display(v)); return mkStr(r.join('')); }
        if (col.type === 'tuple') {
          const nv=[...col.v]; nv.splice(i,0,v);
          const nk=col.keys?[...col.keys]:null; if(nk)nk.splice(i,0,null);
          return { type:'tuple', v:nv, keys:nk };
        }
        notSupported('$+[i]');
      }

      case '$-': {
        const v = await arg();
        if (col.type === 'arr') {
          const i = col.v.findIndex(el => this.equals(el, v));
          if (i < 0) return col;
          const r = [...col.v]; r.splice(i,1); return mkArr(r);
        }
        if (col.type === 'str') {
          const c = this.display(v), i = col.v.indexOf(c);
          return i < 0 ? col : mkStr(col.v.slice(0,i) + col.v.slice(i+c.length));
        }
        if (col.type === 'tuple') {
          const i = col.v.findIndex(el => this.equals(el, v)); if (i<0) return col;
          const nv=[...col.v], nk=col.keys?[...col.keys]:null; nv.splice(i,1); if(nk)nk.splice(i,1);
          return { type:'tuple', v:nv, keys:nk };
        }
        notSupported('$-');
      }
      case '$--': {
        const v = await arg();
        if (col.type === 'arr')   return mkArr(col.v.filter(el => !this.equals(el,v)));
        if (col.type === 'str') {
          const c = this.display(v); return mkStr(col.v.split(c).join(''));
        }
        if (col.type === 'tuple') {
          const kept = col.v.map((el,i)=>({el,k:col.keys?.[i]})).filter(({el})=>!this.equals(el,v));
          return { type:'tuple', v:kept.map(x=>x.el), keys:col.keys?kept.map(x=>x.k):null };
        }
        notSupported('$--');
      }
      case '$-[i]': {
        const i = await idx();
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(i,1); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(i,1); return mkStr(r.join('')); }
        if (col.type === 'tuple') {
          const nv=[...col.v],nk=col.keys?[...col.keys]:null; nv.splice(i,1); if(nk)nk.splice(i,1);
          return { type:'tuple', v:nv, keys:nk };
        }
        notSupported('$-[i]');
      }
      case '$-[i:n]': {
        const sv = (await this.eval(expr.start, env)).v;
        const nv = (await this.eval(expr.count, env)).v;
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const si = resolveIdx(sv, len);
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(si, nv); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(si, nv); return mkStr(r.join('')); }
        if (col.type === 'tuple') { const r=[...col.v]; r.splice(si, nv); return { type:'tuple', v:r, keys:col.keys?[...col.keys].filter((_,i)=>i<si||i>=si+nv):null }; }
        notSupported('$-[i:n]');
      }
      case '$-[i..j]': {
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const fv = expr.range.from ? (await this.eval(expr.range.from, env)).v : 1;
        const tv = expr.range.to   ? (await this.eval(expr.range.to,   env)).v : len;
        const fi = resolveIdx(fv, len);
        const ti = resolveIdx(tv, len);
        const count = ti - fi + 1;
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(fi,count); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(fi,count); return mkStr(r.join('')); }
        if (col.type === 'tuple') { const r=[...col.v]; r.splice(fi,count); const ks=col.keys?[...col.keys]:null; if(ks)ks.splice(fi,count); return {type:'tuple',v:r,keys:ks}; }
        notSupported('$-[i..j]');
      }

      case '$?': {
        const v = await arg();
        if (col.type === 'arr')   return mkBool(col.v.some(el=>this.equals(el,v)));
        if (col.type === 'str')   return mkBool(col.v.includes(this.display(v)));
        if (col.type === 'tuple') return mkBool(col.v.some(el=>this.equals(el,v)));
        notSupported('$?');
      }
      case '$??': {
        const v = await arg(), target = this.display(v);
        const result = [];
        if (col.type === 'arr' || col.type === 'tuple') {
          col.v.forEach((el,i) => { if (this.equals(el,v)) result.push(mkInt(i+1)); }); // 1-based
        } else if (col.type === 'str') {
          const chars = [...col.v];
          for (let i=0; i<=chars.length-target.length; i++) {
            if (chars.slice(i,i+target.length).join('')===target) result.push(mkInt(i+1)); // 1-based
          }
        } else notSupported('$??');
        return mkArr(result);
      }

      case '$~': {
        const i=await idx(), v=await arg();
        if (col.type === 'arr')   { const r=[...col.v]; r[i]=v; return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r[i]=this.display(v); return mkStr(r.join('')); }
        if (col.type === 'tuple') { const nv=[...col.v]; nv[i]=v; return {type:'tuple',v:nv,keys:col.keys}; }
        notSupported('$~');
      }

      case '$[i..j]': {
        const fv=(await this.eval(expr.range.from,env)).v, tv=(await this.eval(expr.range.to,env)).v;
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const fi = this.resolve1Based(fv, len);
        const ti = this.resolve1Based(tv, len) + 1; // inclusive end
        if (col.type === 'arr')   return mkArr(col.v.slice(fi, ti));
        if (col.type === 'str')   return mkStr([...col.v].slice(fi,ti).join(''));
        if (col.type === 'tuple') return { type:'tuple', v:col.v.slice(fi,ti), keys:col.keys?col.keys.slice(fi,ti):null };
        notSupported('$[i..j]');
      }

      case '$[i:n]': {
        const fv=(await this.eval(expr.range.from,env)).v, n=(await this.eval(expr.range.count,env)).v;
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const fi = this.resolve1Based(fv, len);
        if (col.type === 'arr')   return mkArr(col.v.slice(fi, fi+n));
        if (col.type === 'str')   return mkStr([...col.v].slice(fi,fi+n).join(''));
        if (col.type === 'tuple') return { type:'tuple', v:col.v.slice(fi,fi+n), keys:col.keys?col.keys.slice(fi,fi+n):null };
        notSupported('$[i:n]');
      }

      case '$^+': {
        if (col.type !== 'arr') notSupported('$^+');
        return mkArr([...col.v].sort((a,b)=> a.type==='str' ? a.v.localeCompare(b.v) : a.v-b.v));
      }
      case '$^-': {
        if (col.type !== 'arr') notSupported('$^-');
        return mkArr([...col.v].sort((a,b)=> a.type==='str' ? b.v.localeCompare(a.v) : b.v-a.v));
      }
      case '$^': {
        if (col.type !== 'arr') notSupported('$^');
        const cmpFn = await this.evalCallable(expr.arg, env);
        const items = [...col.v];
        for (let i = 1; i < items.length; i++) {
          for (let j = i; j > 0; j--) {
            const less = await this.callFunc(cmpFn, [items[j-1], items[j]]);
            if (!this.truthy(less)) { const tmp = items[j-1]; items[j-1] = items[j]; items[j] = tmp; }
            else break;
          }
        }
        return mkArr(items);
      }

      case '$>': {
        const fn = await this.evalCallable(expr.arg, env);
        const items = colItems();
        const mapped = await Promise.all(items.map(el => this.callFunc(fn,[el])));
        return fromStr(mapped);
      }
      case '$|': {
        const fn = await this.evalCallable(expr.arg, env);
        const items = colItems();
        const kept = [];
        for (const el of items) {
          if (this.truthy(await this.callFunc(fn,[el]))) kept.push(el);
        }
        return fromStr(kept);
      }
      case '$<': {
        const fn = await this.evalCallable(expr.arg, env);
        let acc = await this.eval(expr.init, env);
        for (const el of colItems()) acc = await this.callFunc(fn,[acc,el]);
        return acc;
      }

      case '$!':
        return mkBool(col.type === 'error');

      case '$!!': {
        if (col.type === 'error') throw new ZyErrorPropagate(col);
        return col;
      }

      case '$~~': {
        if (col.type !== 'str') notSupported('$~~');
        const from = this.display(await this.eval(expr.from, env));
        const to   = this.display(await this.eval(expr.to,   env));
        const maxN = expr.count ? (await this.eval(expr.count, env)).v : Infinity;
        let result = col.v, idx2 = 0, n = 0;
        while (n < maxN) {
          const p = result.indexOf(from, idx2);
          if (p === -1) break;
          result = result.slice(0, p) + to + result.slice(p + from.length);
          idx2 = p + to.length;
          n++;
        }
        return mkStr(result);
      }

      case '$/': {
        if (col.type !== 'str') notSupported('$/');
        const delimVal = await arg();
        const delim = this.display(delimVal);
        const parts = col.v.split(delim);
        return mkArr(parts.map(p => mkStr(p)));
      }

      case '$*': {
        const n = (await arg()).v;
        if (col.type !== 'str') notSupported('$*');
        if (n <= 0) return mkStr('');
        return mkStr(col.v.repeat(Math.trunc(n)));
      }

      case '$++': {
        const evalItems = await Promise.all(expr.items.map(i => this.eval(i, env)));
        if (col.type === 'str') {
          let result = col.v;
          for (const item of evalItems) result += this.display(item);
          return mkStr(result);
        }
        if (col.type === 'arr') {
          return mkArr([...col.v, ...evalItems]);
        }
        notSupported('$++');
      }
    }

    throw new ZyError(`Unknown collection operator: ${expr.op}`);
  }

  async evalCallable(argExpr, env) {
    const v = await this.eval(argExpr, env);
    if (v && v.type === 'func') return v;
    throw new ZyError(`Expected a function for collection operator`);
  }

  async matchPattern(pattern, val, env) {
    switch (pattern.type) {
      case 'wildcard': return true;
      case 'guard':    return this.truthy(await this.eval(pattern.cond, env));
      case 'range': {
        const from = (await this.eval(pattern.from, env)).v;
        const to   = (await this.eval(pattern.to,   env)).v;
        return val.v >= from && val.v <= to;
      }
      case 'comparison': {
        const pv = (await this.eval(pattern.value, env)).v;
        const sv = val.v;
        switch (pattern.op) {
          case '<':  return sv < pv;
          case '>':  return sv > pv;
          case '<=': return sv <= pv;
          case '>=': return sv >= pv;
          case '==': return this.equals(val, await this.eval(pattern.value, env));
          case '<>': return !this.equals(val, await this.eval(pattern.value, env));
        }
        return false;
      }
      case 'literal': {
        const pv = await this.eval(pattern.value, env);
        if (pv.type === 'arr') return pv.v.some(el => this.equals(val, el));
        return this.equals(val, pv);
      }
      case 'list': {
        // Scalar scrutinee: list pattern means "value is one of these" (membership)
        if (val.type !== 'arr') {
          for (const elem of pattern.elems) {
            if (elem.kind === 'wildcard') return true;
            if (elem.kind === 'literal' && this.equals(val, await this.eval(elem.expr, env))) return true;
          }
          return false;
        }
        const elems = pattern.elems;
        const restIdx = elems.findIndex(e => e.kind === 'rest');
        const matchElem = async (elem, arrVal) => {
          if (elem.kind === 'wildcard') return true;
          if (elem.kind === 'literal') return this.equals(arrVal, await this.eval(elem.expr, env));
          if (elem.kind === 'bind') { env.def(elem.name, arrVal); return true; }
          // Legacy format (name, rest)
          if (elem.rest) return true;
          if (elem.name === '_') return true;
          env.def(elem.name, arrVal); return true;
        };
        if (restIdx < 0) {
          if (val.v.length !== elems.length) return false;
          for (let i = 0; i < elems.length; i++) {
            if (!await matchElem(elems[i], val.v[i])) return false;
          }
          return true;
        }
        const minLen = elems.length - 1;
        if (val.v.length < minLen) return false;
        for (let i = 0; i < restIdx; i++) {
          if (!await matchElem(elems[i], val.v[i])) return false;
        }
        const afterRest = elems.length - restIdx - 1;
        const restElem = elems[restIdx];
        if (restElem.name && restElem.name !== '_')
          env.def(restElem.name, mkArr(val.v.slice(restIdx, val.v.length - afterRest)));
        for (let i = 0; i < afterRest; i++) {
          const elem = elems[restIdx + 1 + i];
          if (!await matchElem(elem, val.v[val.v.length - afterRest + i])) return false;
        }
        return true;
      }
    }
    return false;
  }

  async callFunc(fn, args, outWriteback) {
    const isClosure = fn.closureEnv != null;
    const parent    = isClosure ? fn.closureEnv : this.globalEnv;
    const funcEnv   = new Env(parent, !isClosure);
    for (let i = 0; i < fn.params.length; i++)
      funcEnv.def(fn.params[i].name, args[i] ?? mkUnit());
    let sig;
    try {
      sig = await this.execBlock(fn.body, funcEnv);
    } catch (e) {
      // $!! (ZyErrorPropagate) exits the function and returns the error value to the caller
      if (e instanceof ZyErrorPropagate) return e.errVal;
      throw e;
    }
    // Write back output params to caller env
    if (outWriteback) {
      for (const { paramName, callerName, callerEnv } of outWriteback) {
        const val = funcEnv.vars.get(paramName);
        if (val !== undefined) callerEnv.set(callerName, val);
      }
    }
    if (sig instanceof ZyReturn) return sig.value;
    return mkUnit();
  }

  async evalStr(parts, env) {
    let s = '';
    for (const part of parts) {
      if (part.t === 'lit') {
        s += part.v;
      } else {
        try {
          const toks = new Lexer(part.v).tokenize();
          const expr = new Parser(toks).parseExpr();
          s += this.display(await this.eval(expr, env));
        } catch {
          s += `{${part.v}}`;
        }
      }
    }
    return mkStr(s);
  }

  applyOp(op, l, r) {
    if (op === '+' && (l.type === 'str' || r.type === 'str')) {
      return mkStr(this.display(l) + this.display(r));
    }
    const isFloat = l.type === 'float' || r.type === 'float';
    const mk = isFloat ? mkFloat : mkInt;
    const lv = l.v, rv = r.v;
    switch (op) {
      case '+':  return mk(lv + rv);
      case '-':  return mk(lv - rv);
      case '*':  return mk(lv * rv);
      case '/':  if (rv === 0) throw new ZyRuntimeError('division by zero', '##Div');
                 return isFloat ? mkFloat(lv / rv) : mkInt(Math.trunc(lv / rv));
      case '%':  if (rv === 0) throw new ZyRuntimeError('Modulo by zero', '##Div');
                 return mk(lv % rv);
      case '^':  return mk(Math.pow(lv, rv));
      case '==': return mkBool(this.equals(l, r));
      case '<>': return mkBool(!this.equals(l, r));
      case '<':  return mkBool(lv < rv);
      case '>':  return mkBool(lv > rv);
      case '<=': return mkBool(lv <= rv);
      case '>=': return mkBool(lv >= rv);
    }
    throw new ZyError(`Unknown operator: ${op}`);
  }

  equals(a, b) {
    if (a.type !== b.type) {
      if ((a.type === 'int' || a.type === 'float') &&
          (b.type === 'int' || b.type === 'float')) return a.v === b.v;
      return false;
    }
    if (a.type === 'arr' || a.type === 'tuple') return JSON.stringify(a.v) === JSON.stringify(b.v);
    return a.v === b.v;
  }

  truthy(val) {
    if (!val || val.type === 'unit') return false;
    if (val.type === 'bool')  return val.v;
    if (val.type === 'int' || val.type === 'float') return val.v !== 0;
    if (val.type === 'str')   return val.v.length > 0;
    return true;
  }

  display(val) {
    if (!val || val.type === 'unit') return '';
    if (val.type === 'int')   return String(val.v);
    if (val.type === 'float') return String(val.v);
    if (val.type === 'str')  return val.v;
    if (val.type === 'char') return val.v;
    if (val.type === 'bool') return val.v ? '#1' : '#0';
    if (val.type === 'arr')  return '[' + val.v.map(v => this.display(v)).join(', ') + ']';
    if (val.type === 'tuple') {
      if (val.keys?.some(k => k !== null))
        return '(' + val.v.map((item, i) => `${val.keys[i]}: ${this.display(item)}`).join(', ') + ')';
      return '(' + val.v.map(v => this.display(v)).join(', ') + ')';
    }
    if (val.type === 'func') {
      const arity = val.params?.length ?? 0;
      return val.name === '<lambda>' ? `<lambd/${arity}>` : `<funct/${arity}>`;
    }
    if (val.type === 'error') return `${val.errType ?? '##_'}(${val.v ?? ''})`;
    return String(val.v ?? val);
  }

  displayOutput(val) {
    const m = this.numeralMode;
    if (!val || val.type === 'unit') return '';
    if (val.type === 'int')   return numeralInt(val.v, m);
    if (val.type === 'float') return numeralFloat(val.v, m);
    if (val.type === 'bool')  return numeralBool(val.v, m);
    return this.display(val);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function runZymbol(src, inputFn, onOutput, moduleResolver = null, filePath = null, tuiContext = null, cliArgs = [], opts = {}) {
  const tokens = new Lexer(src).tokenize();
  const ast    = new Parser(tokens).parse();

  const checker = new Checker(ast);
  const diags   = checker.check();

  for (const d of diags) if (d.severity === 'error') onOutput(formatDiagnostic(d) + '\n\n');
  if (diags.some(d => d.severity === 'error')) return;

  try {
    const interp = new Interpreter(onOutput, inputFn, moduleResolver, tuiContext);
    interp.cliArgs = cliArgs;
    if (opts.maxSteps        != null) interp.maxSteps        = opts.maxSteps;
    if (opts.maxBytes        != null) interp.maxBytes        = opts.maxBytes;
    if (opts.maxInfiniteIter != null) interp.maxInfiniteIter = opts.maxInfiniteIter;
    await interp.run(ast, filePath);
  } catch (e) {
    if (e instanceof ZyStaticError)
      onOutput(`Runtime error: ${e.message}`);
    else
      onOutput(`Runtime error: ${e.message ?? e}`);
  }
}
