/**
 * zymbol.js — Browser interpreter for the Zymbol playground
 *
 * Supports: output (>>), input (<<), variables, constants, booleans (#0/#1),
 * integers, floats, strings (with interpolation), chars, arrays, tuples,
 * if/else (?/_?/_), match (??), all loop forms (@), functions (<~),
 * numeral mode switch (#09#, #०९#, etc.) for multi-script numeric output.
 *
 * Not supported: modules, shell integration (><), lambdas (->), closures.
 */

// ─── Unicode digit blocks (mirrors DIGIT_BLOCKS in zymbol-lexer) ─────────────
// Each entry: [blockBase, scriptName]. Sorted ascending by codepoint.
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

/** Returns 0–9 if ch is a digit in any supported block, else -1. */
function digitValue(ch) {
  const cp = ch.codePointAt(0);
  for (const [base] of DIGIT_BLOCKS) {
    if (cp >= base && cp <= base + 9) return cp - base;
  }
  return -1;
}

/** Returns the block base of ch if it is a digit, else -1. */
function digitBlockBase(ch) {
  const cp = ch.codePointAt(0);
  for (const [base] of DIGIT_BLOCKS) {
    if (cp >= base && cp <= base + 9) return base;
  }
  return -1;
}

/** Maps every ASCII digit in s to the equivalent digit in the target block. */
function mapToScript(s, blockBase) {
  if (blockBase === 0x0030) return s; // ASCII fast-path
  return [...s].map(ch => {
    if (ch >= '0' && ch <= '9') return String.fromCodePoint(blockBase + (ch.charCodeAt(0) - 0x30));
    return ch;
  }).join('');
}

/** Format an integer in the active numeral mode. */
function numeralInt(n, base) { return mapToScript(String(Math.trunc(n)), base); }
/** Format a float in the active numeral mode (decimal point stays ASCII). */
function numeralFloat(f, base) { return mapToScript(String(f), base); }
/** Format a boolean in the active numeral mode, always with # prefix. */
function numeralBool(b, base) { return '#' + numeralInt(b ? 1 : 0, base); }

// ─── Signal types for control flow ───────────────────────────────────────────

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

// ─── Lexer ────────────────────────────────────────────────────────────────────

export class Lexer {
  constructor(src) {
    // Spread into an array of Unicode code points so that supplementary
    // characters (SMP, surrogate pairs) are treated as single entries.
    // This makes ch(n) return a full character regardless of BMP/SMP.
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
      // whitespace
      if (/[ \t\r\n]/.test(this.ch())) { this.consume(); continue; }

      // comment: // ...
      if (this.ch() === '/' && this.ch(1) === '/') {
        while (this.pos < this.src.length && this.ch() !== '\n') this.consume();
        continue;
      }

      // # — mode-switch #<d0><d9>#, booleans #0/#1 (any script), error types ##xxx
      if (this.ch() === '#') {
        const c1 = this.ch(1);
        const dv1 = digitValue(c1);
        if (dv1 >= 0) {
          // Check for mode-switch: #<digit0><digit9>#  (dv1==0, dv2==9, same block, closing #)
          if (dv1 === 0) {
            const c2 = this.ch(2);
            const dv2 = digitValue(c2);
            if (dv2 === 9 && digitBlockBase(c1) === digitBlockBase(c2) && this.ch(3) === '#') {
              const base = digitBlockBase(c1);
              this.consume(); this.consume(); this.consume(); this.consume(); // #d0d9#
              tok('SET_NUMERAL_MODE', base); continue;
            }
          }
          // Boolean: dv1 == 0 → false, dv1 == 1 → true
          this.consume(); this.consume();
          if (dv1 === 0) { tok('BOOL', false); continue; }
          if (dv1 === 1) { tok('BOOL', true);  continue; }
          // digit 2–9 after # is a lex error — emit nothing, skip
          continue;
        }
        if (c1 === '#') {
          this.consume(); this.consume(); // consume ##
          let name = '##';
          while (/[A-Za-z0-9_]/.test(this.ch())) { name += this.ch(); this.consume(); }
          tok('IDENT', name); continue;
        }
        if (c1 === '?') {
          this.consume(); this.consume(); // consume #?
          tok('TYPE_QUERY', '#?'); continue;
        }
        // Data formatting operators: #|..| #.N|..| #!N|..| #,|..| #^|..|
        {
          let kind = null, prec = null, advance = 0;
          const readDigits = start => {
            let d = '', i = start;
            while (/[0-9]/.test(this.ch(i))) { d += this.ch(i); i++; }
            return { d, i };
          };
          if (c1 === '|') {
            kind = 'eval'; advance = 2;
          } else if (c1 === '.' ) {
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
        // unknown # sequence — skip
        this.consume(); continue;
      }

      // two-char operators (order matters)
      const two = this.ch(0) + this.ch(1);
      const twoMap = {
        '>>': 'OUTPUT', '<<': 'INPUT',  '<~': 'RETURN',
        '@!': 'BREAK',  '@>': 'CONTINUE',
        '??': 'MATCH',  '_?': 'ELSEIF', ':=': 'CONST_ASSIGN',
        '..': 'RANGE',  '==': 'EQ',     '<>': 'NEQ',
        '<=': 'LTE',    '>=': 'GTE',    '&&': 'AND',
        '||': 'OR',     '++': 'INC',    '--': 'DEC',
        '+=': 'PLUS_EQ',  '-=': 'MINUS_EQ', '*=': 'TIMES_EQ',
        '/=': 'DIV_EQ',   '%=': 'MOD_EQ',   '^=': 'POW_EQ',
        '->': 'ARROW',  '|>': 'PIPE',
        '!?': 'TRY',    ':!': 'CATCH',  ':>': 'FINALLY',
        '\\\\': 'NEWLINE_ESC',
      };
      if (twoMap[two]) {
        this.consume(); this.consume();
        tok(twoMap[two], two);
        continue;
      }

      const c = this.ch();

      // _ — ELSE or start of identifier
      if (c === '_') {
        if (/[\p{L}\p{Co}0-9_]/u.test(this.ch(1))) { this.readIdent(toks); }
        else { this.consume(); tok('ELSE', '_'); }
        continue;
      }

      if (c === '?') { this.consume(); tok('IF',     '?'); continue; }
      if (c === '@') { this.consume(); tok('AT',     '@'); continue; }
      if (c === '¶') { this.consume(); tok('PILCROW','¶'); continue; }

      // $ collection operators — must run before single-char fallback
      if (c === '$') {
        const a = this.ch(1), b = this.ch(2);
        if (a === '#')                      { this.consume(); this.consume();            tok('DLEN',       '$#');  continue; }
        if (a === '?' && b === '?')         { this.consume(); this.consume(); this.consume(); tok('DFINDALL',  '$??'); continue; }
        if (a === '?')                      { this.consume(); this.consume();            tok('DCONTAINS',  '$?');  continue; }
        if (a === '-' && b === '-')         { this.consume(); this.consume(); this.consume(); tok('DREMOVEALL','$--'); continue; }
        if (a === '-')                      { this.consume(); this.consume();            tok('DREMOVE',    '$-');  continue; }
        if (a === '+')                      { this.consume(); this.consume();            tok('DAPPEND',    '$+');  continue; }
        if (a === '^' && b === '+')         { this.consume(); this.consume(); this.consume(); tok('DSORTASC', '$^+'); continue; }
        if (a === '^' && b === '-')         { this.consume(); this.consume(); this.consume(); tok('DSORTDESC','$^-'); continue; }
        if (a === '^')                      { this.consume(); this.consume();            tok('DSORT',      '$^');  continue; }
        if (a === '>')                      { this.consume(); this.consume();            tok('DMAP',       '$>');  continue; }
        if (a === '|')                      { this.consume(); this.consume();            tok('DFILTER',    '$|');  continue; }
        if (a === '<')                      { this.consume(); this.consume();            tok('DREDUCE',    '$<');  continue; }
        if (a === '~' && b === '~')         { this.consume(); this.consume(); this.consume(); tok('DREPLACE',   '$~~'); continue; }
        if (a === '~')                      { this.consume(); this.consume();            tok('DUPDATE',    '$~');  continue; }
        if (a === '[')                      { this.consume();                            tok('DSLICE',     '$[');  continue; }
        if (a === '!' && b === '!')         { this.consume(); this.consume(); this.consume(); tok('DERRORPROP', '$!!'); continue; }
        if (a === '!')                      { this.consume(); this.consume();            tok('DERROR',     '$!');  continue; }
        this.consume(); continue; // unknown $
      }

      // numbers
      if (/[0-9]/.test(c) || digitValue(c) >= 0) { this.readNumber(toks); continue; }

      // strings
      if (c === '"') { this.readString(toks); continue; }

      // char literals 'A'
      if (c === "'") { this.readChar(toks); continue; }

      // identifiers (all Unicode letters, marks, symbols — src is code-point array
      // so each element is already a full character, no surrogate handling needed)
      if (/[\p{L}\p{M}\p{So}\p{Co}]/u.test(c)) {
        this.readIdent(toks); continue;
      }

      // single-char tokens
      const single = {
        '=':'ASSIGN', '<':'LT', '>':'GT',
        '+':'PLUS',   '-':'MINUS', '*':'TIMES', '/':'DIV', '%':'MOD', '^':'POW',
        '!':'NOT',    '|':'VBAR',
        '(':'LPAREN', ')':'RPAREN', '[':'LBRACKET', ']':'RBRACKET',
        '{':'LBRACE', '}':'RBRACE',
        ',':'COMMA',  ':':'COLON', '.':'DOT', ';':'SEMI', '\\':'BACKSLASH',
      };
      if (single[c]) { this.consume(); tok(single[c], c); continue; }

      this.consume(); // skip unknown
    }

    tok('EOF', null);
    return toks;
  }

  readNumber(toks) {
    let value = 0;
    // Read digits from any supported Unicode block (normalise to ASCII value)
    while (this.pos < this.src.length) {
      const dv = digitValue(this.ch());
      if (dv < 0) break;
      value = value * 10 + dv;
      this.consume();
    }
    if (this.ch() === '.' && this.ch(1) !== '.') {
      this.consume(); // consume '.'
      let frac = 0, div = 1;
      while (this.pos < this.src.length) {
        const dv = digitValue(this.ch());
        if (dv < 0) break;
        frac = frac * 10 + dv;
        div *= 10;
        this.consume();
      }
      const f = value + frac / div;
      // scientific suffix stays ASCII
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
    this.consume(); // opening '
    let ch = '';
    if (this.ch() === '\\') { this.consume(); ch = this.consume(); }
    else ch = this.consume();
    if (this.ch() === "'") this.consume(); // closing '
    toks.push({ type: 'CHAR', value: ch, line: this.line });
  }

  readIdent(toks) {
    let s = '';
    while (true) {
      const c = this.ch();
      if (!c) break;
      // Non-ASCII Unicode digits (e.g. ०, ١, ๑) terminate the identifier;
      // ASCII digits 0-9 are allowed inside identifiers (e.g. n1, x2).
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

  peek(n = 0) {
    return this.toks[Math.min(this.pos + n, this.toks.length - 1)];
  }
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

  parse() {
    return { type: 'Program', body: this.parseStmtList() };
  }

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

  parseStmt() {
    const t = this.peek();

    if (t.type === 'SET_NUMERAL_MODE') { this.adv(); return { type: 'SetNumeralMode', base: t.value }; }
    if (t.type === 'OUTPUT')   return this.parseOutput();
    if (t.type === 'INPUT')    return this.parseInput();
    if (t.type === 'RETURN')   return this.parseReturn();
    if (t.type === 'BREAK')    { this.adv(); const bl = this.check('IDENT') ? this.adv().value : null; return { type: 'Break',    label: bl }; }
    if (t.type === 'CONTINUE') { this.adv(); const cl = this.check('IDENT') ? this.adv().value : null; return { type: 'Continue', label: cl }; }
    if (t.type === 'IF')       return this.parseIf();
    if (t.type === 'MATCH')    return { type: 'ExprStmt', expr: this.parseMatchExpr() };
    if (t.type === 'AT')       { this.adv(); return this.parseLoop(); }
    if (t.type === 'TRY')       return this.parseTryCatch();
    if (t.type === 'LBRACKET' && this.isDestructuring()) return this.parseArrayDestruct();
    if (t.type === 'LPAREN'   && this.isDestructuring()) return this.parseTupleDestruct();
    if (t.type === 'IDENT')    return this.parseIdentStmt();
    if (t.type === 'SEMI')     { this.adv(); return null; }
    if (t.type === 'PILCROW')  { this.adv(); return { type: 'Output', items: [], newline: true }; }

    // fall-through: expression statement
    return { type: 'ExprStmt', expr: this.parseExpr() };
  }

  parseOutput() {
    const opLine = this.adv().line; // >> — capture its line number
    const items = [];
    while (!this.check('PILCROW') && !this.check('NEWLINE_ESC') &&
           !this.check('RBRACE') && !this.check('EOF')) {
      if (this.peek().line > opLine) break; // next token is on a new line → new statement
      items.push(this.parseExpr());
    }
    const nl = this.match('PILCROW', 'NEWLINE_ESC');
    return { type: 'Output', items, newline: !!nl, line: this.peek().line };
  }

  parseInput() {
    const line = this.peek().line;
    this.adv(); // <<
    let prompt = null;
    if (this.check('STR')) {
      prompt = { type: 'Literal', kind: 'str', value: this.adv().value };
    }
    const varTok = this.eat('IDENT');
    return { type: 'Input', prompt, varName: varTok.value, line };
  }

  parseReturn() {
    this.adv(); // <~
    if (this.check('RBRACE') || this.check('EOF'))
      return { type: 'Return', value: null };
    return { type: 'Return', value: this.parseExpr() };
  }

  parseTryCatch() {
    this.adv(); // !?
    const tryBody = this.parseBlock();
    const catches = [];
    while (this.check('CATCH')) {
      this.adv(); // :!
      // Optional error type: identifier starting with ##
      const errType = (this.check('IDENT') && this.peek().value.startsWith('##'))
        ? this.adv().value : null;
      catches.push({ errType, body: this.parseBlock() });
    }
    let finallyBody = null;
    if (this.check('FINALLY')) {
      this.adv(); // :>
      finallyBody = this.parseBlock();
    }
    return { type: 'TryCatch', tryBody, catches, finallyBody };
  }

  // Lookahead: returns true if current [ or ( starts a destructuring pattern (= without :=)
  isDestructuring() {
    let i = 0, depth = 0;
    const start = this.peek(0).type;
    const close = start === 'LBRACKET' ? 'RBRACKET' : 'RPAREN';
    while (this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i++];
      if (t.type === start) depth++;
      else if (t.type === close) { depth--; if (depth === 0) break; }
    }
    // After the closing bracket/paren must be ASSIGN (=) but not CONST_ASSIGN (:=)
    return this.peek(i).type === 'ASSIGN';
  }

  parseArrayDestruct() {
    this.adv(); // [
    const targets = [];
    while (!this.check('RBRACKET') && !this.check('EOF')) {
      if (this.check('TIMES')) {
        this.adv();
        targets.push({ name: this.eat('IDENT').value, rest: true });
      } else if (this.check('ELSE')) {
        this.adv(); // _ discard
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
    // Distinguish named destructuring (x: a, y: b) = tup  vs  positional (a, b) = tup
    // Peek inside to detect "IDENT COLON IDENT" pattern
    const isNamed = this.peek(1).type === 'IDENT' && this.peek(2).type === 'COLON';
    this.adv(); // (
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
    this.adv(); // ?
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
    this.adv(); // ??
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
    } else {
      const left = this.parseAdditive();
      if (this.match('RANGE')) {
        pattern = { type: 'range', from: left, to: this.parseAdditive() };
      } else {
        pattern = { type: 'literal', value: left };
      }
    }
    this.eat('COLON');
    const body = this.check('LBRACE')
      ? { type: 'block', stmts: this.parseBlock() }
      : { type: 'expr',  value: this.parseExpr()  };
    return { pattern, body };
  }

  parseLoop() {
    // infinite: @ { }
    if (this.check('LBRACE')) {
      return { type: 'Loop', kind: 'infinite', label: null, body: this.parseBlock() };
    }

    // labeled: @ @label { }  or  @ @label var:... { }
    if (this.check('AT')) {
      this.adv(); // consume @
      const label = this.eat('IDENT').value;
      if (this.check('LBRACE')) {
        return { type: 'Loop', kind: 'infinite', label, body: this.parseBlock() };
      }
      if (this.check('IDENT') && this.peek(1).type === 'COLON') {
        const varName = this.adv().value;
        this.adv(); // :
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
      const cond = this.parseExpr();
      return { type: 'Loop', kind: 'while', label, cond, body: this.parseBlock() };
    }

    // range/foreach: @ var : ...
    if (this.check('IDENT') && this.peek(1).type === 'COLON') {
      const varName = this.adv().value;
      this.adv(); // :
      const startExpr = this.parseAdditive();
      if (this.match('RANGE')) {
        const endExpr = this.parseAdditive();
        let stepExpr = null;
        if (this.match('COLON')) stepExpr = this.parseAdditive();
        return { type: 'Loop', kind: 'range', label: null, var: varName,
                 from: startExpr, to: endExpr, step: stepExpr,
                 body: this.parseBlock() };
      }
      return { type: 'Loop', kind: 'foreach', label: null, var: varName,
               iterable: startExpr, body: this.parseBlock() };
    }

    // while: @ cond { }
    const cond = this.parseExpr();
    return { type: 'Loop', kind: 'while', label: null, cond, body: this.parseBlock() };
  }

  // Lookahead: is the current position a func decl? IDENT ( params ) {
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
      if (this.match('RETURN')) isOut = true; // <~ suffix
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

    // const assign
    if (this.match('CONST_ASSIGN')) {
      return { type: 'ConstAssign', name, value: this.parseRHS(), line };
    }

    // compound assign
    const compound = { PLUS_EQ:'+', MINUS_EQ:'-', TIMES_EQ:'*', DIV_EQ:'/', MOD_EQ:'%', POW_EQ:'^' };
    const cop = compound[this.peek().type];
    if (cop) { this.adv(); return { type: 'CompoundAssign', name, op: cop, value: this.parseExpr(), line }; }

    // inc / dec
    if (this.match('INC')) return { type: 'Increment', name, op: '++', line };
    if (this.match('DEC')) return { type: 'Increment', name, op: '--', line };

    // assign
    if (this.match('ASSIGN')) {
      return { type: 'VarAssign', name, value: this.parseRHS(), line };
    }

    // subscript assign: name[idx] = val  or  name[idx] += val
    if (this.check('LBRACKET') && this.peek().line === this.toks[this.pos - 1].line) {
      this.adv();
      const idx = this.parseExpr();
      this.eat('RBRACKET');
      if (this.match('ASSIGN')) {
        return { type: 'IndexAssign', obj: name, index: idx, value: this.parseExpr(), line };
      }
      // compound indexed assign: arr[i] += rhs  →  IndexAssign(arr, i, arr[i] op rhs)
      const idxCompound = compound[this.peek().type];
      if (idxCompound) {
        this.adv();
        const rhs = this.parseExpr();
        const currentElem = { type: 'Subscript', obj: { type: 'Ident', name }, index: idx };
        const value = { type: 'BinOp', op: idxCompound, left: currentElem, right: rhs };
        return { type: 'IndexAssign', obj: name, index: idx, value, line };
      }
      let left = { type: 'Subscript', obj: { type: 'Ident', name }, index: idx };
      return { type: 'ExprStmt', expr: this.parsePostfixRest(left) };
    }

    // expression starting with this ident (function call, etc.)
    let left = { type: 'Ident', name };
    return { type: 'ExprStmt', expr: this.parsePostfixRest(left) };
  }

  // Comma-join for string concat: x = "a ", name, "!"
  parseRHS() {
    const first = this.parseExpr();
    if (!this.check('COMMA')) return first;
    const items = [first];
    while (this.match('COMMA')) items.push(this.parseExpr());
    return { type: 'CommaJoin', items };
  }

  // ─── Expression grammar ──────────────────────────────────────────────────
  parseExpr() {
    if (this.isLambdaStart()) return this.parseLambda();
    return this.parsePipe();
  }

  isLambdaStart() {
    // x -> ...
    if (this.peek(0).type === 'IDENT' && this.peek(1).type === 'ARROW') return true;
    if (this.peek(0).type !== 'LPAREN') return false;
    // (a, b) -> ...  — scan past LPAREN...RPAREN then check for ARROW
    let i = 1, depth = 1;
    while (depth > 0 && this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i++];
      if (t.type === 'LPAREN') depth++;
      else if (t.type === 'RPAREN') depth--;
    }
    if (this.peek(i).type === 'ARROW') return true;
    // (a, b -> expr) — ARROW before closing RPAREN, all before are IDENT/COMMA
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
    if (this.check('LPAREN')) {
      this.adv();
      // handles both (a, b) -> expr  and  (a, b -> expr)
      while (!this.check('RPAREN') && !this.check('ARROW') && !this.check('EOF')) {
        params.push(this.eat('IDENT').value);
        this.match('COMMA');
      }
      if (this.check('RPAREN')) this.adv(); // (a, b) -> form: consume closing )
    } else {
      params.push(this.adv().value); // single param without parens
    }
    this.eat('ARROW');
    const body = this.check('LBRACE')
      ? { type: 'block', stmts: this.parseBlock() }
      : { type: 'expr',  value: this.parseExpr() };
    return { type: 'Lambda', params, body };
  }

  parsePipe() {
    let left = this.parseOr();
    while (this.match('PIPE')) {
      // rhs is a full expression: fn(_), lambda(_), or bare fn reference.
      // _ is bound to the left value at eval time via a child env.
      const rhs = this.parseOr();
      left = { type: 'Pipe', value: left, rhs };
    }
    return left;
  }

  parseOr()             { return this.parseBinLeft(['OR'],  () => this.parseAnd()); }
  parseAnd()            { return this.parseBinLeft(['AND'], () => this.parseComparison()); }
  parseComparison() {
    let left = this.parseAdditive();
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

  parseUnary() {
    if (this.match('MINUS')) return { type: 'UnaryOp', op: '-', operand: this.parseUnary() };
    if (this.match('NOT'))   return { type: 'UnaryOp', op: '!', operand: this.parseUnary() };
    return this.parsePostfix();
  }

  parsePostfix() {
    return this.parsePostfixRest(this.parsePrimary());
  }

  parsePostfixRest(left) {
    const COL_TOKENS = new Set(['DLEN','DAPPEND','DREMOVEALL','DREMOVE',
      'DFINDALL','DCONTAINS','DSORTASC','DSORTDESC','DSORT',
      'DMAP','DFILTER','DREDUCE','DSLICE','DERROR','DERRORPROP','DREPLACE']);

    while (true) {
      const sameLine = () => this.peek().line === (this.toks[this.pos - 1]?.line ?? this.peek().line);
      if (this.check('LBRACKET') && sameLine()) {
        this.adv();
        const idx = this.parseExpr();
        this.eat('RBRACKET');
        // expr[i]$~ val — functional update (must follow immediately)
        if (this.check('DUPDATE')) {
          this.adv();
          const val = this.parseUnary();
          left = { type: 'FuncUpdate', obj: left.obj ?? left, index: idx, value: val };
        } else {
          left = { type: 'Subscript', obj: left, index: idx };
        }

      } else if (this.check('DOT')) {
        this.adv();
        const field = this.eat('IDENT').value;
        left = { type: 'FieldAccess', obj: left, field };

      } else if (this.check('LPAREN') && sameLine() && left.type === 'Ident') {
        this.adv();
        const args = this.parseArgList();
        this.eat('RPAREN');
        left = { type: 'Call', callee: left.name, args };

      } else if (this.check('LPAREN') && sameLine() && left.type !== 'Ident') {
        // Chained call: expr(args) — e.g. make_adder(5)(3), (lambda)(args)
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

  parseCollectionOp(left) {
    const op = this.adv().type; // consume the $xxx token

    switch (op) {
      case 'DLEN':       // col$#
        return { type: 'CollectionOp', op: '$#', obj: left };

      case 'DAPPEND':    // col$+ val  OR  col$+[i] val
        if (this.check('LBRACKET')) {
          this.adv();
          const idx = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$+[i]', obj: left, index: idx, arg: this.parseUnary() };
        }
        return { type: 'CollectionOp', op: '$+', obj: left, arg: this.parseUnary() };

      case 'DREMOVEALL': // col$-- val
        return { type: 'CollectionOp', op: '$--', obj: left, arg: this.parseUnary() };

      case 'DREMOVE':    // col$- val  OR  col$-[i]  OR  col$-[i..j]
        if (this.check('LBRACKET')) {
          this.adv();
          const from = this.parseExpr();
          if (this.match('RANGE')) {
            const to = this.parseExpr(); this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$-[i..j]', obj: left, range: { from, to } };
          }
          this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$-[i]', obj: left, index: from };
        }
        return { type: 'CollectionOp', op: '$-', obj: left, arg: this.parseUnary() };

      case 'DFINDALL':   // col$?? val
        return { type: 'CollectionOp', op: '$??', obj: left, arg: this.parseUnary() };

      case 'DCONTAINS':  // col$? val
        return { type: 'CollectionOp', op: '$?', obj: left, arg: this.parseUnary() };

      case 'DUPDATE':    // col$~[i] val
        this.eat('LBRACKET');
        { const idx = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$~', obj: left, index: idx, arg: this.parseUnary() }; }

      case 'DSORTASC':   return { type: 'CollectionOp', op: '$^+', obj: left };
      case 'DSORTDESC':  return { type: 'CollectionOp', op: '$^-', obj: left };
      case 'DSORT':      return { type: 'CollectionOp', op: '$^',  obj: left, arg: this.parseUnary() };

      case 'DMAP':       return { type: 'CollectionOp', op: '$>',  obj: left, arg: this.parseUnary() };
      case 'DFILTER':    return { type: 'CollectionOp', op: '$|',  obj: left, arg: this.parseUnary() };

      case 'DREDUCE':    // col$< (init, fn)
        this.eat('LPAREN');
        { const init = this.parseExpr(); this.eat('COMMA');
          const fn   = this.parseExpr(); this.eat('RPAREN');
          return { type: 'CollectionOp', op: '$<', obj: left, init, arg: fn }; }

      case 'DSLICE':     // col$[i..j]  or  col$[i:n]
        this.eat('LBRACKET');
        { const from = this.parseExpr();
          if (this.match('RANGE')) {
            const to = this.parseExpr(); this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$[i..j]', obj: left, range: { from, to } };
          }
          this.eat('COLON');
          const count = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$[i:n]', obj: left, range: { from, count } }; }

      case 'DERROR':     // expr$!  — check if expression errored
        return { type: 'CollectionOp', op: '$!', obj: left };

      case 'DERRORPROP': // expr$!! — propagate error
        return { type: 'CollectionOp', op: '$!!', obj: left };

      case 'DREPLACE':   // str$~~["from":"to"]  or  str$~~["from":"to":n]
        this.eat('LBRACKET');
        { const from = this.parseExpr(); this.eat('COLON');
          const to   = this.parseExpr();
          const count = this.match('COLON') ? this.parseExpr() : null;
          this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$~~', obj: left, from, to, count }; }

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
    // Lambda starting with ( — needs check before tuple parsing
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

    // Array: [1, 2, 3]
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

    // Tuple or grouped: ( ... )
    if (t.type === 'LPAREN') {
      this.adv();
      if (this.check('RPAREN')) { this.adv(); return { type: 'Literal', kind: 'unit' }; }

      // Detect named tuple: (key: val, ...)
      let firstKey = null;
      if (this.check('IDENT') && this.peek(1).type === 'COLON') {
        firstKey = this.adv().value;
        this.adv(); // :
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
      return firstVal; // grouped expression
    }

    // Data formatting operators: #|..| #.N|..| etc.
    if (t.type === 'DATA_OP') {
      this.adv();
      const arg = this.parseExpr();
      this.eat('VBAR');
      return { type: 'DataOp', kind: t.value.kind, prec: t.value.prec, arg };
    }

    // skip unrecognised token
    this.adv();
    return { type: 'Literal', kind: 'unit' };
  }
}

// ─── Environment ──────────────────────────────────────────────────────────────

class Env {
  // funcBoundary=true: this env is isolated (traditional function call).
  // - get() walks parent chain only for func-type values (enables fn-to-fn calls).
  // - set() never propagates to parent (variables stay local).
  constructor(parent = null, funcBoundary = false) {
    this.vars        = new Map();
    this.consts      = new Set();
    this.parent      = parent;
    this.funcBoundary = funcBoundary;
  }

  get(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    if (!this.parent) throw new ZyError(`Undefined variable '${name}'`);
    if (this.funcBoundary) {
      // Only allow reading function definitions across the boundary
      const v = this.parent._getFuncOnly(name);
      if (v !== undefined) return v;
      throw new ZyError(`Undefined variable '${name}'`);
    }
    return this.parent.get(name);
  }

  // Walk upward returning only func-type values (used by funcBoundary get)
  _getFuncOnly(name) {
    if (this.vars.has(name)) {
      const v = this.vars.get(name);
      return v.type === 'func' ? v : undefined;
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
    // funcBoundary: never propagate assignments to outer scope
    if (this.funcBoundary) return false;
    if (this.parent && this.parent.set(name, value)) return true;
    return false; // not found
  }

  def(name, value, isConst = false) {
    this.vars.set(name, value);
    if (isConst) this.consts.add(name);
  }

  has(name) {
    return this.vars.has(name) || (this.parent ? this.parent.has(name) : false);
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
  /**
   * @param {(text:string)=>void}      outputFn — called for each output chunk
   * @param {()=>Promise<string>}      inputFn  — async callback for each << read
   */
  constructor(outputFn, inputFn = async () => '') {
    this.outputFn    = outputFn;
    this.inputFn     = inputFn;
    this.steps       = 0;
    this.maxSteps        = 50_000;  // ~50k AST nodes evaluated
    this.maxInfiniteIter = 1_024;   // bare @ { } iteration cap
    this.outputBytes     = 0;
    this.maxBytes        = 8_000;   // 8 KB output cap
    this.lastYield       = performance.now();
    this.numeralMode     = 0x0030;  // active output numeral block base (default: ASCII)
  }

  tick() {
    if (++this.steps > this.maxSteps)
      throw new ZyError('Execution limit reached (50 000 steps) — infinite loop?');
  }

  // Yields to the browser every ~16 ms so the DOM can repaint between loop iterations.
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
      throw new ZyError('Output limit reached (64 KB) — infinite loop?');
    this.outputFn(text);
  }

  async run(program) {
    const env = new Env();
    this.globalEnv = env;   // functions see top-level definitions (for recursion + cross-calls)
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
      case 'SetNumeralMode': {
        this.numeralMode = stmt.base;
        return;
      }

      case 'Output': {
        let out = '';
        for (const item of stmt.items) out += this.displayOutput(await this.eval(item, env));
        if (stmt.newline) out += '\n';
        this.emit(out);
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
        // Value semantics: create a new collection instead of mutating in place.
        // env.set() throws automatically if stmt.obj is a constant.
        const col = env.get(stmt.obj);
        const i   = (await this.eval(stmt.index, env)).v;
        const val = await this.eval(stmt.value, env);
        const idx = i < 0 ? col.v.length + i : i;
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
            throw err; // no matching catch — re-throw
          }
        } finally {
          if (stmt.finallyBody) await this.execBlock(stmt.finallyBody, new Env(env));
        }
        return result;
      }
    }
  }

  async execLoop(loop, env) {
    const outer = new Env(env);
    // Returns true if a break/continue signal targets this loop (unlabeled or matching label)
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
        if (sig instanceof ZyReturn) return sig;
        if (sig instanceof ZyBreak || sig instanceof ZyContinue) return sig; // propagate foreign label
        await this.maybeYield();
      }
      return;
    }

    if (loop.kind === 'while') {
      while (this.truthy(await this.eval(loop.cond, env))) {
        this.tick();
        const sig = await this.execBlock(loop.body, new Env(outer));
        if (brk(sig)) break;
        if (sig instanceof ZyReturn) return sig;
        if (sig instanceof ZyBreak || sig instanceof ZyContinue) return sig;
        await this.maybeYield();
      }
      return;
    }

    if (loop.kind === 'range') {
      const from = (await this.eval(loop.from, env)).v;
      const to   = (await this.eval(loop.to,   env)).v;
      const step = loop.step ? (await this.eval(loop.step, env)).v : (from <= to ? 1 : -1);
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

      case 'CommaJoin': {
        const vals = await Promise.all(expr.items.map(i => this.eval(i, env)));
        return mkStr(vals.map(v => this.display(v)).join(''));
      }

      case 'BinOp': {
        // short-circuit
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
        return await this.callFunc(fn, args);
      }

      case 'CallExpr': {
        // Chained / higher-order call: expr(args)
        const fn = await this.eval(expr.callee, env);
        if (!fn || fn.type !== 'func')
          throw new ZyError(`Expression is not a function`);
        const args = await Promise.all(expr.args.map(a => this.eval(a, env)));
        return await this.callFunc(fn, args);
      }

      case 'Subscript': {
        const obj = await this.eval(expr.obj, env);
        const idx = (await this.eval(expr.index, env)).v;
        if (obj.type === 'arr') {
          const i = idx < 0 ? obj.v.length + idx : idx;
          if (i < 0 || i >= obj.v.length) throw new ZyRuntimeError(`Index out of bounds: ${idx}`, '##Index');
          return obj.v[i];
        }
        if (obj.type === 'str') {
          const chars = [...obj.v];
          const i = idx < 0 ? chars.length + idx : idx;
          return mkChar(chars[i] ?? '');
        }
        if (obj.type === 'tuple') {
          const i = idx < 0 ? obj.v.length + idx : idx;
          return obj.v[i] ?? mkUnit();
        }
        throw new ZyError(`Cannot subscript ${obj.type}`);
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
        // Bind _ = val in a child env so rhs can reference it as a placeholder.
        const pipeEnv = new Env(env);
        pipeEnv.def('_', val);
        const result = await this.eval(expr.rhs, pipeEnv);
        // Bare function reference (no call): call it with val directly.
        if (result && result.type === 'func') return await this.callFunc(result, [val]);
        return result;
      }

      case 'FieldAccess': {
        const obj = await this.eval(expr.obj, env);
        if (obj.type !== 'tuple' || !obj.keys)
          throw new ZyError(`'.${expr.field}' requires a named tuple`);
        const i = obj.keys.indexOf(expr.field);
        if (i < 0) throw new ZyError(`Unknown field '${expr.field}'`);
        return obj.v[i];
      }

      case 'CollectionOp': {
        return await this.evalCollectionOp(expr, env);
      }

      case 'FuncUpdate': {
        const arr = await this.eval(expr.obj, env);
        const i   = (await this.eval(expr.index, env)).v;
        const val = await this.eval(expr.value, env);
        const idx = i < 0 ? arr.v.length + i : i;
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
          const exp = Math.floor(Math.log10(abs));
          let mant = abs / Math.pow(10, exp);
          if (prec !== null) {
            if (mode === 'round') mant = parseFloat(mant.toFixed(prec));
            else { const f = Math.pow(10, prec); mant = Math.trunc(mant * f) / f; }
          }
          const mantStr = parseFloat(mant.toPrecision(15)).toString().replace(/\.?0+$/, '');
          return (neg ? '-' : '') + mantStr + 'e' + exp;
        };
        switch (expr.kind) {
          case 'eval': {
            if (val.type === 'str') {
              const s = val.v.trim();
              const p = parseFloat(s);
              if (!isNaN(p)) {
                if (Number.isInteger(p) && !s.includes('.') && !s.toLowerCase().includes('e')) return mkInt(p);
                return mkFloat(p);
              }
            }
            return val; // pass-through (already a number, or non-numeric string)
          }
          case 'round': {
            return mkFloat(parseFloat(toNum(val).toFixed(expr.prec)));
          }
          case 'trunc': {
            const n = toNum(val);
            const f = Math.pow(10, expr.prec);
            return mkFloat(Math.trunc(n * f) / f);
          }
          case 'comma': {
            return mkStr(toNum(val).toLocaleString('en-US'));
          }
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
        }
        return val;
      }
    }

    return mkUnit();
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
    const idx = async () => { let i = (await this.eval(expr.index, env)).v; return i < 0 ? col.v.length + i : i; };

    // helpers
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
      // ── length ──────────────────────────────────────────────────────────
      case '$#': {
        if (col.type === 'arr')   return mkInt(col.v.length);
        if (col.type === 'str')   return mkInt([...col.v].length);
        if (col.type === 'tuple') return mkInt(col.v.length);
        notSupported('$#');
      }

      // ── append / insert ──────────────────────────────────────────────────
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
        notSupported('$+[i]');
      }

      // ── remove ──────────────────────────────────────────────────────────
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
      case '$-[i..j]': {
        const from=(await this.eval(expr.range.from,env)).v, to=(await this.eval(expr.range.to,env)).v;
        const count = to - from + 1;
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(from,count); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(from,count); return mkStr(r.join('')); }
        notSupported('$-[i..j]');
      }

      // ── search ──────────────────────────────────────────────────────────
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
          col.v.forEach((el,i) => { if (this.equals(el,v)) result.push(mkInt(i)); });
        } else if (col.type === 'str') {
          const chars = [...col.v];
          for (let i=0; i<=chars.length-target.length; i++) {
            if (chars.slice(i,i+target.length).join('')===target) result.push(mkInt(i));
          }
        } else notSupported('$??');
        return mkArr(result);
      }

      // ── update ──────────────────────────────────────────────────────────
      case '$~': {
        const i=await idx(), v=await arg();
        if (col.type === 'arr')   { const r=[...col.v]; r[i]=v; return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r[i]=this.display(v); return mkStr(r.join('')); }
        if (col.type === 'tuple') { const nv=[...col.v]; nv[i]=v; return {type:'tuple',v:nv,keys:col.keys}; }
        notSupported('$~');
      }

      // ── slice ────────────────────────────────────────────────────────────
      case '$[i..j]': {
        const from=(await this.eval(expr.range.from,env)).v, to=(await this.eval(expr.range.to,env)).v;
        if (col.type === 'arr')   return mkArr(col.v.slice(from, to));
        if (col.type === 'str')   return mkStr([...col.v].slice(from,to).join(''));
        if (col.type === 'tuple') return { type:'tuple', v:col.v.slice(from,to), keys:col.keys?col.keys.slice(from,to):null };
        notSupported('$[i..j]');
      }

      case '$[i:n]': {
        const from=(await this.eval(expr.range.from,env)).v, n=(await this.eval(expr.range.count,env)).v;
        if (col.type === 'arr')   return mkArr(col.v.slice(from, from+n));
        if (col.type === 'str')   return mkStr([...col.v].slice(from,from+n).join(''));
        if (col.type === 'tuple') return { type:'tuple', v:col.v.slice(from,from+n), keys:col.keys?col.keys.slice(from,from+n):null };
        notSupported('$[i:n]');
      }

      // ── sort ─────────────────────────────────────────────────────────────
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
        // Stable sort using comparator lambda: returns true if a < b (a before b)
        for (let i = 1; i < items.length; i++) {
          for (let j = i; j > 0; j--) {
            const less = await this.callFunc(cmpFn, [items[j-1], items[j]]);
            if (!this.truthy(less)) { const tmp = items[j-1]; items[j-1] = items[j]; items[j] = tmp; }
            else break;
          }
        }
        return mkArr(items);
      }

      // ── higher-order (require named function) ────────────────────────────
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
      case '$!': {
        // Returns #1 if the value is an error type, #0 otherwise
        return mkBool(col.type === 'error');
      }
      case '$!!': {
        // Propagates error: if the value is an error type, re-throw it; otherwise pass through
        if (col.type === 'error')
          throw new ZyRuntimeError(col.v ?? 'error', col.errType ?? '##_');
        return col;
      }
      case '$~~': {
        if (col.type !== 'str') notSupported('$~~');
        const from = this.display(await this.eval(expr.from, env));
        const to   = this.display(await this.eval(expr.to,   env));
        const maxN = expr.count ? (await this.eval(expr.count, env)).v : Infinity;
        let result = col.v, idx = 0, n = 0;
        while (n < maxN) {
          const p = result.indexOf(from, idx);
          if (p === -1) break;
          result = result.slice(0, p) + to + result.slice(p + from.length);
          idx = p + to.length;
          n++;
        }
        return mkStr(result);
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
      case 'literal':
        return this.equals(val, await this.eval(pattern.value, env));
    }
    return false;
  }

  async callFunc(fn, args) {
    // Lambdas (closures): parent = closureEnv, no boundary (they capture their scope).
    // Named functions: parent = globalEnv with funcBoundary=true — only func lookups
    //   pass the boundary, variable reads/writes stay local (Zymbol isolation rule).
    const isClosure = fn.closureEnv != null;
    const parent    = isClosure ? fn.closureEnv : this.globalEnv;
    const funcEnv   = new Env(parent, !isClosure);
    for (let i = 0; i < fn.params.length; i++)
      funcEnv.def(fn.params[i].name, args[i] ?? mkUnit());
    const sig = await this.execBlock(fn.body, funcEnv);
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
    // String concatenation: str + anything → str
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
    if (a.type === 'arr'   || a.type === 'tuple') return JSON.stringify(a.v) === JSON.stringify(b.v);
    return a.v === b.v;
  }

  truthy(val) {
    if (!val || val.type === 'unit') return false;
    if (val.type === 'bool')  return val.v;
    if (val.type === 'int' || val.type === 'float') return val.v !== 0;
    if (val.type === 'str')   return val.v.length > 0;
    return true;
  }

  // display() — internal representation (concatenation, array items, etc.)
  // Does NOT apply numeral mode: booleans → #1/#0, numbers → ASCII digits.
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

  // displayOutput() — used exclusively by >>
  // Applies the active numeral mode to int/float/bool; all other types unchanged.
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

/**
 * Run Zymbol source code.
 * @param {string}                  src      — source code
 * @param {()=>Promise<string>}     inputFn  — async callback invoked on each << read
 * @param {(text:string)=>void}     onOutput — callback for each output chunk
 * @returns {Promise<void>}
 */
export async function runZymbol(src, inputFn, onOutput) {
  const tokens = new Lexer(src).tokenize();
  const ast    = new Parser(tokens).parse();
  await new Interpreter(onOutput, inputFn).run(ast);
}
