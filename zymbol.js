/**
 * zymbol.js — Browser interpreter for the Zymbol playground
 *
 * v0.0.4: 1-based indexing, multi-dimensional navigation (arr[i>j>k]),
 * type-cast operators (##. ### ##!), string split ($/), ConcatBuild ($++),
 * explicit lifetime end (\ var).
 *
 * Not supported: modules, shell integration (><), BashExec (<\ \>).
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
        // # followed by space/letter/dot = script name comment, skip to EOL
        if (c1 === ' ' || c1 === '.' || /[A-Za-z_]/.test(c1)) {
          while (this.pos < this.src.length && this.src[this.pos] !== '\n') this.consume();
          continue;
        }
        // #> = export block declarator
        if (c1 === '>') { this.consume(); this.consume(); tok('EXPORT_DECL', '#>'); continue; }
        this.consume(); continue;
      }

      // two-char operators
      const two = this.ch(0) + this.ch(1);
      const twoMap = {
        '>>': 'OUTPUT', '<<': 'INPUT',  '<~': 'RETURN',
        '<#': 'IMPORT',
        '@!': 'BREAK',  '@>': 'CONTINUE',
        '??': 'MATCH',  '_?': 'ELSEIF', ':=': 'CONST_ASSIGN',
        '..': 'RANGE',  '==': 'EQ',     '<>': 'NEQ',
        '<=': 'LTE',    '>=': 'GTE',    '&&': 'AND',
        '||': 'OR',     '++': 'INC',    '--': 'DEC',
        '+=': 'PLUS_EQ',  '-=': 'MINUS_EQ', '*=': 'TIMES_EQ',
        '/=': 'DIV_EQ',   '%=': 'MOD_EQ',   '^=': 'POW_EQ',
        '->': 'ARROW',  '|>': 'PIPE',
        '!?': 'TRY',    ':!': 'CATCH',  ':>': 'FINALLY',
        '::': 'SCOPE',
        '\\\\': 'NEWLINE_ESC',
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
        if (/[\p{L}\p{M}\p{So}\p{Co}_]/u.test(this.ch())) {
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
      if (digitValue(c) >= 0 && !(c >= '0' && c <= '9')) break;
      if (/[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(c)) { s += this.consume(); continue; }
      break;
    }
    toks.push({ type: 'IDENT', value: s, line: this.line });
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
    this.eat('LTE'); // consume <=
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
              const exported = this.check('LTE') ? (this.adv(), this.check('IDENT') ? this.adv().value : member) : member;
              names.push({ kind: 'reexport', alias: first, member, exported });
            } else {
              const exported = this.check('LTE') ? (this.adv(), this.check('IDENT') ? this.adv().value : first) : first;
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
    this.eat('COLON');
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
    const name = this.adv().value;
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
    return { type: 'FuncDecl', name, params, body: this.parseBlock() };
  }

  parseIdentStmt() {
    if (this.isFuncDecl()) return this.parseFuncDecl();

    const name = this.adv().value;
    const line = this.peek().line;

    if (this.match('CONST_ASSIGN')) {
      return { type: 'ConstAssign', name, value: this.parseRHS(), line };
    }

    const compound = { PLUS_EQ:'+', MINUS_EQ:'-', TIMES_EQ:'*', DIV_EQ:'/', MOD_EQ:'%', POW_EQ:'^' };
    const cop = compound[this.peek().type];
    if (cop) { this.adv(); return { type: 'CompoundAssign', name, op: cop, value: this.parseExpr(), line }; }

    if (this.match('INC')) return { type: 'Increment', name, op: '++', line };
    if (this.match('DEC')) return { type: 'Increment', name, op: '--', line };

    if (this.match('ASSIGN')) {
      return { type: 'VarAssign', name, value: this.parseRHS(), line };
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
        const currentElem = { type: 'NavIndex', obj: { type: 'Ident', name }, spec: { kind: 'simple', index: idx } };
        const value = { type: 'BinOp', op: idxCompound, left: currentElem, right: rhs };
        return { type: 'IndexAssign', obj: name, index: idx, value, line };
      }
      let left = { type: 'NavIndex', obj: { type: 'Ident', name }, spec: { kind: 'simple', index: idx } };
      return { type: 'ExprStmt', expr: this.parsePostfixRest(left) };
    }

    let left = { type: 'Ident', name };
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
      'DSPLIT','DCONCATBUILD']);

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
          return { type: 'CollectionOp', op: '$+[i]', obj: left, index: idx, arg: this.parseUnary() };
        }
        return { type: 'CollectionOp', op: '$+', obj: left, arg: this.parseUnary() };

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
    if (t.type === 'IDENT') { this.adv(); return { type: 'Ident',   name: t.value }; }
    if (t.type === 'ELSE')  { this.adv(); return { type: 'Ident',   name: '_'      }; }
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
  constructor(parent = null, funcBoundary = false) {
    this.vars         = new Map();
    this.consts       = new Set();
    this.parent       = parent;
    this.funcBoundary = funcBoundary;
  }

  get(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    if (!this.parent) throw new ZyError(`undefined variable: '${name}'`);
    if (name.startsWith('_')) throw new ZyRuntimeError(`cannot access underscore variable '${name}' from inner scope`, '##Scope');
    if (this.funcBoundary) {
      const v = this.parent._getFuncOnly(name);
      if (v !== undefined) return v;
      throw new ZyError(`undefined variable: '${name}'`);
    }
    return this.parent.get(name);
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
  constructor(outputFn, inputFn = async () => '', moduleResolver = null) {
    this.outputFn        = outputFn;
    this.inputFn         = inputFn;
    this.steps           = 0;
    this.maxSteps        = 50_000;
    this.maxInfiniteIter = 1_024;
    this.outputBytes     = 0;
    this.maxBytes        = 8_000;
    this.lastYield       = performance.now();
    this.numeralMode     = 0x0030;
    this.moduleResolver  = moduleResolver;
    this.moduleCache     = new Map();
    this.loadingModules  = new Set();
  }

  async loadModule(path) {
    if (this.moduleCache.has(path)) return this.moduleCache.get(path);
    if (this.loadingModules.has(path)) {
      const modName = path.replace(/^.*\//, '').replace(/\.zy$/, '');
      throw new ZyStaticError(`E004: Circular import detected: module '${modName}' is already being loaded`);
    }
    if (!this.moduleResolver)
      throw new ZyError(`Cannot import '${path}': no module resolver available`);

    this.loadingModules.add(path);
    const result = await this.moduleResolver(path);
    if (result == null) throw new ZyError(`Module not found: '${path}'`);
    const src      = typeof result === 'string' ? result : result.src;
    const childRes = typeof result === 'string' ? this.moduleResolver : result.resolver;

    const tokens = new Lexer(src).tokenize();
    const ast    = new Parser(tokens).parse();

    const modInterp = new Interpreter(this.outputFn, this.inputFn, childRes);
    modInterp.moduleCache    = this.moduleCache;
    modInterp.loadingModules = this.loadingModules;

    const modEnv = new Env();
    modInterp.globalEnv = modEnv;

    // Collect exported names from ExportDecl nodes before execution
    const exportPairs = [];
    for (const s of ast.body) {
      if (s.type === 'ExportDecl') for (const p of s.names) exportPairs.push(p);
    }

    await modInterp.execBlock(ast.body, modEnv);

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

    this.loadingModules.delete(path);
    const modVal = { type: 'module', exports };
    this.moduleCache.set(path, modVal);
    return modVal;
  }

  tick() {
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
      throw new ZyError('Output limit reached (8 KB) — infinite loop?');
    this.outputFn(text);
  }

  async run(program) {
    const env = new Env();
    this.globalEnv = env;
    await this.execBlock(program.body, env);
  }

  async execBlock(stmts, env) {
    for (const stmt of stmts) {
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
        if (!env.set(stmt.name, val)) env.def(stmt.name, val);
        return;
      }

      case 'ConstAssign': {
        const val = await this.eval(stmt.value, env);
        env.def(stmt.name, val, true);
        return;
      }

      case 'CompoundAssign': {
        const cur = env.get(stmt.name);
        const rhs = await this.eval(stmt.value, env);
        env.set(stmt.name, this.applyOp(stmt.op, cur, rhs));
        return;
      }

      case 'Increment': {
        const cur = env.get(stmt.name);
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
        if (arr.type !== 'arr') throw new ZyError('Array destructuring requires an array');
        let i = 0;
        for (const t of stmt.targets) {
          if (t.rest) {
            const val = mkArr(arr.v.slice(i));
            if (!env.set(t.name, val)) env.def(t.name, val);
          } else if (t.name === '_') {
            i++;
          } else {
            const val = arr.v[i] ?? mkUnit();
            if (!env.set(t.name, val)) env.def(t.name, val);
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
            if (!env.set(t.name, val)) env.def(t.name, val);
          } else {
            const val = items[i] ?? mkUnit();
            if (!env.set(t.name, val)) env.def(t.name, val);
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
          const errType = err.errType ?? '##_';
          const matched = stmt.catches.find(
            c => !c.errType || c.errType === errType || c.errType === '##_'
          );
          if (matched) {
            const catchEnv = new Env(env);
            catchEnv.def('_err', mkStr(err.message ?? String(err)));
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

      case 'Ident': return env.get(expr.name);

      case 'Array':
        return mkArr(await Promise.all(expr.items.map(i => this.eval(i, env))));

      case 'Tuple': {
        const items = await Promise.all(expr.items.map(i => this.eval(i, env)));
        return { type: 'tuple', v: items, keys: expr.keys ?? null };
      }

      case 'ImplicitConcat': {
        const vals = [];
        for (const item of expr.items) vals.push(await this.eval(item, env));
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
          if (!obj.exports.has(expr.field))
            throw new ZyError(`Module has no export '${expr.field}'`);
          return obj.exports.get(expr.field);
        }
        if (obj.type !== 'tuple' || !obj.keys)
          throw new ZyError(`'.${expr.field}' requires a named tuple`);
        const i = obj.keys.indexOf(expr.field);
        if (i < 0) throw new ZyError(`Unknown field '${expr.field}'`);
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
          const typeName = val.type.charAt(0).toUpperCase() + val.type.slice(1);
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
    if (idx === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
    if (obj.type === 'arr') {
      const i = idx < 0 ? obj.v.length + idx : idx - 1;
      if (i < 0 || i >= obj.v.length) throw new ZyRuntimeError(`Index out of bounds: ${idx}`, '##Index');
      return obj.v[i];
    }
    if (obj.type === 'tuple') {
      const i = idx < 0 ? obj.v.length + idx : idx - 1;
      if (i < 0 || i >= obj.v.length) throw new ZyRuntimeError(`Index out of bounds: ${idx}`, '##Index');
      return obj.v[i] ?? mkUnit();
    }
    if (obj.type === 'str') {
      const chars = [...obj.v];
      const i = idx < 0 ? chars.length + idx : idx - 1;
      if (i < 0 || i >= chars.length) throw new ZyRuntimeError(`Index out of bounds: ${idx}`, '##Index');
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
    const symMap = { int:'###', float:'##.', str:'##"', char:"##'", bool:'##?', arr:'##]', tuple:'##)', unit:'##_', error:'##_' };
    const sym = symMap[val.type] ?? '##_';
    let count;
    switch (val.type) {
      case 'int':   count = String(Math.abs(val.v)).length; break;
      case 'float': count = String(val.v).replace(/^-/, '').length; break;
      case 'str':   count = [...val.v].length; break;
      case 'char':  count = 1; break;
      case 'bool':  count = 1; break;
      case 'arr':   count = val.v.length; break;
      case 'tuple': count = val.v.length; break;
      default:      count = 0;
    }
    return { type: 'tuple', v: [mkStr(sym), mkInt(count), val], keys: null };
  }

  async evalCollectionOp(expr, env) {
    const col = await this.eval(expr.obj, env);
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
        if (col.type === 'error')
          throw new ZyRuntimeError(col.v ?? 'error', col.errType ?? '##_');
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
    const sig = await this.execBlock(fn.body, funcEnv);
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
      case '/':  if (rv === 0) throw new ZyRuntimeError('Division by zero', '##Div');
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
    if (val.type === 'func') return `<function ${val.name}>`;
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

export async function runZymbol(src, inputFn, onOutput, moduleResolver = null) {
  const tokens = new Lexer(src).tokenize();
  const ast    = new Parser(tokens).parse();
  try {
    await new Interpreter(onOutput, inputFn, moduleResolver).run(ast);
  } catch (e) {
    if (e instanceof ZyStaticError)
      onOutput(`Runtime error: ${e.message}`);
    else
      onOutput(`Runtime error: runtime error: ${e.message ?? e}`);
  }
}
