/**
 * zymbol.js — Browser interpreter for the Zymbol playground
 *
 * Supports: output (>>), input (<<), variables, constants, booleans (#0/#1),
 * integers, floats, strings (with interpolation), chars, arrays, tuples,
 * if/else (?/_?/_), match (??), all loop forms (@), functions (<~).
 *
 * Not supported: modules, shell integration (><), lambdas (->), closures.
 */

// ─── Signal types for control flow ───────────────────────────────────────────

class ZyReturn  { constructor(value) { this.value = value; } }
class ZyBreak   {}
class ZyContinue {}
class ZyError extends Error {
  constructor(msg, line) {
    super(line ? `Line ${line}: ${msg}` : msg);
    this.zyLine = line;
  }
}

// ─── Lexer ────────────────────────────────────────────────────────────────────

export class Lexer {
  constructor(src) {
    this.src = src;
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

      // booleans #0 #1
      if (this.ch() === '#') {
        if (this.ch(1) === '0') { this.consume(); this.consume(); tok('BOOL', false); continue; }
        if (this.ch(1) === '1') { this.consume(); this.consume(); tok('BOOL', true);  continue; }
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
        if (/[\p{L}0-9_]/u.test(this.ch(1))) { this.readIdent(toks); }
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
        if (a === '~')                      { this.consume(); this.consume();            tok('DUPDATE',    '$~');  continue; }
        if (a === '[')                      { this.consume();                            tok('DSLICE',     '$[');  continue; }
        this.consume(); continue; // unknown $
      }

      // numbers
      if (/[0-9]/.test(c)) { this.readNumber(toks); continue; }

      // strings
      if (c === '"') { this.readString(toks); continue; }

      // char literals 'A'
      if (c === "'") { this.readChar(toks); continue; }

      // identifiers (all Unicode letters + emoji via surrogate pairs)
      if (/\p{L}/u.test(c) || (c.charCodeAt(0) >= 0xD800 && c.charCodeAt(0) <= 0xDBFF)) {
        this.readIdent(toks); continue;
      }

      // single-char tokens
      const single = {
        '=':'ASSIGN', '<':'LT', '>':'GT',
        '+':'PLUS',   '-':'MINUS', '*':'TIMES', '/':'DIV', '%':'MOD', '^':'POW',
        '!':'NOT',
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
    let s = '';
    while (/[0-9]/.test(this.ch())) s += this.consume();
    if (this.ch() === '.' && this.ch(1) !== '.') {
      s += this.consume();
      while (/[0-9]/.test(this.ch())) s += this.consume();
      if (this.ch() === 'e' || this.ch() === 'E') {
        s += this.consume();
        if (this.ch() === '+' || this.ch() === '-') s += this.consume();
        while (/[0-9]/.test(this.ch())) s += this.consume();
      }
      toks.push({ type: 'FLOAT', value: parseFloat(s), line: this.line });
    } else {
      toks.push({ type: 'NUM', value: parseInt(s, 10), line: this.line });
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
      const code = this.src.charCodeAt(this.pos);
      if (code >= 0xD800 && code <= 0xDBFF) { s += this.consume(); s += this.consume(); continue; }
      if (/[\p{L}\p{M}0-9_]/u.test(this.ch())) { s += this.consume(); continue; }
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

    if (t.type === 'OUTPUT')   return this.parseOutput();
    if (t.type === 'INPUT')    return this.parseInput();
    if (t.type === 'RETURN')   return this.parseReturn();
    if (t.type === 'BREAK')    { this.adv(); return { type: 'Break' }; }
    if (t.type === 'CONTINUE') { this.adv(); return { type: 'Continue' }; }
    if (t.type === 'IF')       return this.parseIf();
    if (t.type === 'MATCH')    return { type: 'ExprStmt', expr: this.parseMatchExpr() };
    if (t.type === 'AT')       { this.adv(); return this.parseLoop(); }
    if (t.type === 'IDENT')    return this.parseIdentStmt();
    if (t.type === 'SEMI')     { this.adv(); return null; }

    // fall-through: expression statement
    return { type: 'ExprStmt', expr: this.parseExpr() };
  }

  parseOutput() {
    this.adv(); // >>
    const items = [];
    while (!this.check('PILCROW') && !this.check('NEWLINE_ESC') &&
           !this.check('RBRACE') && !this.check('EOF')) {
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
      return { type: 'Loop', kind: 'infinite', body: this.parseBlock() };
    }

    // labeled: @ @outer { } — skip, just consume label ident
    // range/foreach: @ var : ...
    if (this.check('IDENT') && this.peek(1).type === 'COLON') {
      const varName = this.adv().value;
      this.adv(); // :
      const startExpr = this.parseAdditive();
      if (this.match('RANGE')) {
        const endExpr = this.parseAdditive();
        let stepExpr = null;
        if (this.match('COLON')) stepExpr = this.parseAdditive();
        return { type: 'Loop', kind: 'range', var: varName,
                 from: startExpr, to: endExpr, step: stepExpr,
                 body: this.parseBlock() };
      }
      return { type: 'Loop', kind: 'foreach', var: varName,
               iterable: startExpr, body: this.parseBlock() };
    }

    // while: @ cond { }
    const cond = this.parseExpr();
    return { type: 'Loop', kind: 'while', cond, body: this.parseBlock() };
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

    // subscript assign: name[idx] = val
    if (this.check('LBRACKET')) {
      this.adv();
      const idx = this.parseExpr();
      this.eat('RBRACKET');
      if (this.match('ASSIGN')) {
        return { type: 'IndexAssign', obj: name, index: idx, value: this.parseExpr(), line };
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
  parseExpr()           { return this.parseOr(); }
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
      'DFINDALL','DCONTAINS','DUPDATE','DSORTASC','DSORTDESC','DSORT',
      'DMAP','DFILTER','DREDUCE','DSLICE']);

    while (true) {
      if (this.check('LBRACKET')) {
        this.adv();
        const idx = this.parseExpr();
        this.eat('RBRACKET');
        left = { type: 'Subscript', obj: left, index: idx };

      } else if (this.check('LPAREN') && left.type === 'Ident') {
        this.adv();
        const args = this.parseArgList();
        this.eat('RPAREN');
        left = { type: 'Call', callee: left.name, args };

      } else if (COL_TOKENS.has(this.peek().type)) {
        left = this.parseCollectionOp(left);

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

      case 'DSLICE':     // col$[i..j]
        this.eat('LBRACKET');
        { const from = this.parseExpr(); this.eat('RANGE');
          const to   = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$[i..j]', obj: left, range: { from, to } }; }

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
    const t = this.peek();

    if (t.type === 'NUM')   { this.adv(); return { type: 'Literal', kind: 'int',   value: t.value }; }
    if (t.type === 'FLOAT') { this.adv(); return { type: 'Literal', kind: 'float', value: t.value }; }
    if (t.type === 'BOOL')  { this.adv(); return { type: 'Literal', kind: 'bool',  value: t.value }; }
    if (t.type === 'CHAR')  { this.adv(); return { type: 'Literal', kind: 'char',  value: t.value }; }
    if (t.type === 'STR')   { this.adv(); return { type: 'Literal', kind: 'str',   value: t.value }; }
    if (t.type === 'IDENT') { this.adv(); return { type: 'Ident',   name: t.value }; }
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

    // skip unrecognised token
    this.adv();
    return { type: 'Literal', kind: 'unit' };
  }
}

// ─── Environment ──────────────────────────────────────────────────────────────

class Env {
  constructor(parent = null) {
    this.vars   = new Map();
    this.consts = new Set();
    this.parent = parent;
  }

  get(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    if (this.parent) return this.parent.get(name);
    throw new ZyError(`Undefined variable '${name}'`);
  }

  set(name, value) {
    if (this.vars.has(name)) {
      if (this.consts.has(name)) throw new ZyError(`Cannot reassign constant '${name}'`);
      this.vars.set(name, value);
      return true;
    }
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
   * @param {(text:string)=>void} outputFn  — called for each output chunk
   * @param {string[]}            inputLines — pre-filled stdin lines
   */
  constructor(outputFn, inputLines = []) {
    this.outputFn    = outputFn;
    this.inputLines  = [...inputLines];
    this.inputIdx    = 0;
    this.steps       = 0;
    this.maxSteps        = 50_000;  // ~50k AST nodes evaluated
    this.maxInfiniteIter = 1_024;   // bare @ { } iteration cap
    this.outputBytes     = 0;
    this.maxBytes        = 8_000;   // 8 KB output cap
  }

  tick() {
    if (++this.steps > this.maxSteps)
      throw new ZyError('Execution limit reached (50 000 steps) — infinite loop?');
  }

  emit(text) {
    this.outputBytes += text.length;
    if (this.outputBytes > this.maxBytes)
      throw new ZyError('Output limit reached (64 KB) — infinite loop?');
    this.outputFn(text);
  }

  run(program) {
    const env = new Env();
    this.globalEnv = env;   // functions see top-level definitions (for recursion + cross-calls)
    this.execBlock(program.body, env);
  }

  execBlock(stmts, env) {
    for (const stmt of stmts) {
      const sig = this.exec(stmt, env);
      if (sig instanceof ZyReturn || sig instanceof ZyBreak || sig instanceof ZyContinue)
        return sig;
    }
  }

  exec(stmt, env) {
    this.tick();

    switch (stmt.type) {
      case 'Output': {
        let out = '';
        for (const item of stmt.items) out += this.display(this.eval(item, env));
        if (stmt.newline) out += '\n';
        this.emit(out);
        return;
      }

      case 'Input': {
        if (stmt.prompt) this.emit(this.display(this.eval(stmt.prompt, env)));
        const line = this.inputIdx < this.inputLines.length
          ? this.inputLines[this.inputIdx++]
          : '';
        const val = mkStr(line.trim());
        if (!env.set(stmt.varName, val)) env.def(stmt.varName, val);
        return;
      }

      case 'VarAssign': {
        const val = this.eval(stmt.value, env);
        if (!env.set(stmt.name, val)) env.def(stmt.name, val);
        return;
      }

      case 'ConstAssign': {
        const val = this.eval(stmt.value, env);
        env.def(stmt.name, val, true);
        return;
      }

      case 'CompoundAssign': {
        const cur = env.get(stmt.name);
        const rhs = this.eval(stmt.value, env);
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
        const val = stmt.value ? this.eval(stmt.value, env) : mkUnit();
        return new ZyReturn(val);
      }

      case 'Break':    return new ZyBreak();
      case 'Continue': return new ZyContinue();

      case 'If': {
        if (this.truthy(this.eval(stmt.cond, env))) return this.execBlock(stmt.then, env);
        for (const ei of stmt.elseifs)
          if (this.truthy(this.eval(ei.cond, env))) return this.execBlock(ei.body, env);
        if (stmt.else) return this.execBlock(stmt.else, env);
        return;
      }

      case 'Loop': return this.execLoop(stmt, env);

      case 'ExprStmt': {
        this.eval(stmt.expr, env);
        return;
      }

      case 'IndexAssign': {
        const arr = env.get(stmt.obj);
        if (arr.type !== 'arr') throw new ZyError('Not an array');
        const idx = this.eval(stmt.index, env).v;
        arr.v[idx < 0 ? arr.v.length + idx : idx] = this.eval(stmt.value, env);
        return;
      }
    }
  }

  execLoop(loop, env) {
    const outer = new Env(env);

    if (loop.kind === 'infinite') {
      let iter = 0;
      while (true) {
        if (++iter > this.maxInfiniteIter)
          throw new ZyError(`Infinite loop limit reached (${this.maxInfiniteIter} iterations) — add @! to break`);
        this.tick();
        const sig = this.execBlock(loop.body, new Env(outer));
        if (sig instanceof ZyBreak)  break;
        if (sig instanceof ZyReturn) return sig;
      }
      return;
    }

    if (loop.kind === 'while') {
      while (this.truthy(this.eval(loop.cond, env))) {
        this.tick();
        const sig = this.execBlock(loop.body, new Env(outer));
        if (sig instanceof ZyBreak)  break;
        if (sig instanceof ZyReturn) return sig;
      }
      return;
    }

    if (loop.kind === 'range') {
      const from = this.eval(loop.from, env).v;
      const to   = this.eval(loop.to,   env).v;
      const step = loop.step ? this.eval(loop.step, env).v : (from <= to ? 1 : -1);
      if (step === 0) throw new ZyError('Loop step cannot be zero');
      for (let i = from; step > 0 ? i <= to : i >= to; i += step) {
        this.tick();
        const iter = new Env(outer);
        iter.def(loop.var, mkInt(i));
        const sig = this.execBlock(loop.body, iter);
        if (sig instanceof ZyBreak)    break;
        if (sig instanceof ZyContinue) continue;
        if (sig instanceof ZyReturn)   return sig;
      }
      return;
    }

    if (loop.kind === 'foreach') {
      const it = this.eval(loop.iterable, env);
      let items;
      if      (it.type === 'arr')   items = it.v;
      else if (it.type === 'str')   items = [...it.v].map(mkChar);
      else if (it.type === 'tuple') items = it.v;
      else throw new ZyError(`Cannot iterate over ${it.type}`);

      for (const item of items) {
        this.tick();
        const iter = new Env(outer);
        iter.def(loop.var, item);
        const sig = this.execBlock(loop.body, iter);
        if (sig instanceof ZyBreak)    break;
        if (sig instanceof ZyContinue) continue;
        if (sig instanceof ZyReturn)   return sig;
      }
      return;
    }
  }

  eval(expr, env) {
    this.tick();

    switch (expr.type) {
      case 'Literal':
        switch (expr.kind) {
          case 'int':   return mkInt(expr.value);
          case 'float': return mkFloat(expr.value);
          case 'bool':  return mkBool(expr.value);
          case 'char':  return mkChar(expr.value);
          case 'str':   return this.evalStr(expr.value, env);
          case 'unit':  return mkUnit();
        }
        break;

      case 'Ident': return env.get(expr.name);

      case 'Array':
        return mkArr(expr.items.map(i => this.eval(i, env)));

      case 'Tuple': {
        const items = expr.items.map(i => this.eval(i, env));
        return { type: 'tuple', v: items, keys: expr.keys ?? null };
      }

      case 'CommaJoin':
        return mkStr(expr.items.map(i => this.display(this.eval(i, env))).join(''));

      case 'BinOp': {
        // short-circuit
        if (expr.op === '&&') {
          return mkBool(this.truthy(this.eval(expr.left, env)) &&
                        this.truthy(this.eval(expr.right, env)));
        }
        if (expr.op === '||') {
          return mkBool(this.truthy(this.eval(expr.left, env)) ||
                        this.truthy(this.eval(expr.right, env)));
        }
        return this.applyOp(expr.op, this.eval(expr.left, env), this.eval(expr.right, env));
      }

      case 'UnaryOp': {
        const val = this.eval(expr.operand, env);
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
        const args = expr.args.map(a => this.eval(a, env));
        return this.callFunc(fn, args);
      }

      case 'Subscript': {
        const obj = this.eval(expr.obj, env);
        const idx = this.eval(expr.index, env).v;
        if (obj.type === 'arr') {
          const i = idx < 0 ? obj.v.length + idx : idx;
          if (i < 0 || i >= obj.v.length) throw new ZyError(`Index out of bounds: ${idx}`);
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

      case 'CollectionOp': {
        return this.evalCollectionOp(expr, env);
      }

      case 'Match': {
        const val = this.eval(expr.expr, env);
        for (const arm of expr.arms) {
          if (this.matchPattern(arm.pattern, val, env)) {
            if (arm.body.type === 'block') {
              const sig = this.execBlock(arm.body.stmts, new Env(env));
              return sig instanceof ZyReturn ? sig.value : mkUnit();
            }
            return this.eval(arm.body.value, env);
          }
        }
        return mkUnit();
      }
    }

    return mkUnit();
  }

  evalCollectionOp(expr, env) {
    const col = this.eval(expr.obj, env);
    const arg = () => this.eval(expr.arg, env);
    const idx = () => { let i = this.eval(expr.index, env).v; return i < 0 ? col.v.length + i : i; };

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
        const v = arg();
        if (col.type === 'arr')   return mkArr([...col.v, v]);
        if (col.type === 'str')   return mkStr(col.v + this.display(v));
        if (col.type === 'tuple') return { type:'tuple', v:[...col.v,v], keys: col.keys ? [...col.keys,null] : null };
        notSupported('$+');
      }
      case '$+[i]': {
        const i = idx(), v = arg();
        if (col.type === 'arr') { const r=[...col.v]; r.splice(i,0,v); return mkArr(r); }
        if (col.type === 'str') { const r=[...col.v]; r.splice(i,0,this.display(v)); return mkStr(r.join('')); }
        notSupported('$+[i]');
      }

      // ── remove ──────────────────────────────────────────────────────────
      case '$-': {
        const v = arg();
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
        const v = arg();
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
        const i = idx();
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(i,1); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(i,1); return mkStr(r.join('')); }
        if (col.type === 'tuple') {
          const nv=[...col.v],nk=col.keys?[...col.keys]:null; nv.splice(i,1); if(nk)nk.splice(i,1);
          return { type:'tuple', v:nv, keys:nk };
        }
        notSupported('$-[i]');
      }
      case '$-[i..j]': {
        const from=this.eval(expr.range.from,env).v, to=this.eval(expr.range.to,env).v;
        const count = to - from + 1;
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(from,count); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(from,count); return mkStr(r.join('')); }
        notSupported('$-[i..j]');
      }

      // ── search ──────────────────────────────────────────────────────────
      case '$?': {
        const v = arg();
        if (col.type === 'arr')   return mkBool(col.v.some(el=>this.equals(el,v)));
        if (col.type === 'str')   return mkBool(col.v.includes(this.display(v)));
        if (col.type === 'tuple') return mkBool(col.v.some(el=>this.equals(el,v)));
        notSupported('$?');
      }
      case '$??': {
        const v = arg(), target = this.display(v);
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
        const i=idx(), v=arg();
        if (col.type === 'arr')   { const r=[...col.v]; r[i]=v; return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r[i]=this.display(v); return mkStr(r.join('')); }
        if (col.type === 'tuple') { const nv=[...col.v]; nv[i]=v; return {type:'tuple',v:nv,keys:col.keys}; }
        notSupported('$~');
      }

      // ── slice ────────────────────────────────────────────────────────────
      case '$[i..j]': {
        const from=this.eval(expr.range.from,env).v, to=this.eval(expr.range.to,env).v;
        if (col.type === 'arr')   return mkArr(col.v.slice(from, to+1));
        if (col.type === 'str')   return mkStr([...col.v].slice(from,to+1).join(''));
        if (col.type === 'tuple') return { type:'tuple', v:col.v.slice(from,to+1), keys:col.keys?col.keys.slice(from,to+1):null };
        notSupported('$[i..j]');
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

      // ── higher-order (require named function) ────────────────────────────
      case '$>': {
        const fn = this.evalCallable(expr.arg, env);
        const items = colItems();
        const mapped = items.map(el => this.callFunc(fn,[el]));
        return fromStr(mapped);
      }
      case '$|': {
        const fn = this.evalCallable(expr.arg, env);
        const items = colItems();
        const kept = items.filter(el => this.truthy(this.callFunc(fn,[el])));
        return fromStr(kept);
      }
      case '$<': {
        const fn = this.evalCallable(expr.arg, env);
        let acc = this.eval(expr.init, env);
        for (const el of colItems()) acc = this.callFunc(fn,[acc,el]);
        return acc;
      }
    }
    throw new ZyError(`Unknown collection operator: ${expr.op}`);
  }

  evalCallable(argExpr, env) {
    const v = this.eval(argExpr, env);
    if (v && v.type === 'func') return v;
    throw new ZyError(`Expected a function for collection operator`);
  }

  matchPattern(pattern, val, env) {
    switch (pattern.type) {
      case 'wildcard': return true;
      case 'guard':    return this.truthy(this.eval(pattern.cond, env));
      case 'range': {
        const from = this.eval(pattern.from, env).v;
        const to   = this.eval(pattern.to,   env).v;
        return val.v >= from && val.v <= to;
      }
      case 'literal':
        return this.equals(val, this.eval(pattern.value, env));
    }
    return false;
  }

  callFunc(fn, args) {
    // Parent = global env so functions can call each other and recurse,
    // but cannot access local variables of the caller (Zymbol isolation rule).
    const funcEnv = new Env(this.globalEnv);
    for (let i = 0; i < fn.params.length; i++)
      funcEnv.def(fn.params[i].name, args[i] ?? mkUnit());
    const sig = this.execBlock(fn.body, funcEnv);
    if (sig instanceof ZyReturn) return sig.value;
    return mkUnit();
  }

  evalStr(parts, env) {
    let s = '';
    for (const part of parts) {
      if (part.t === 'lit') {
        s += part.v;
      } else {
        try {
          const toks = new Lexer(part.v).tokenize();
          const expr = new Parser(toks).parseExpr();
          s += this.display(this.eval(expr, env));
        } catch {
          s += `{${part.v}}`;
        }
      }
    }
    return mkStr(s);
  }

  applyOp(op, l, r) {
    const isFloat = l.type === 'float' || r.type === 'float';
    const mk = isFloat ? mkFloat : mkInt;
    const lv = l.v, rv = r.v;
    switch (op) {
      case '+':  return mk(lv + rv);
      case '-':  return mk(lv - rv);
      case '*':  return mk(lv * rv);
      case '/':  if (rv === 0) throw new ZyError('Division by zero');
                 return isFloat ? mkFloat(lv / rv) : mkInt(Math.trunc(lv / rv));
      case '%':  if (rv === 0) throw new ZyError('Modulo by zero');
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

  display(val) {
    if (!val || val.type === 'unit') return '';
    if (val.type === 'int')   return String(val.v);
    if (val.type === 'float') {
      const s = String(val.v);
      return s.includes('.') || s.includes('e') ? s : s + '.0';
    }
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
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Run Zymbol source code.
 * @param {string}   src        — source code
 * @param {string[]} inputLines — pre-filled stdin values (one per line)
 * @param {(text:string)=>void} onOutput — callback for each output chunk
 */
export function runZymbol(src, inputLines, onOutput) {
  const tokens = new Lexer(src).tokenize();
  const ast    = new Parser(tokens).parse();
  new Interpreter(onOutput, inputLines).run(ast);
}
