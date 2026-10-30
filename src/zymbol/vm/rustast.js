// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// zymbol.js's AST into the shape of zymbol-ast's: what Rust's parser builds for
// the same source, desugarings included, so the compiler (compiler.js) can be a
// line-for-line port of zymbol-compiler. tests/ast_diff.mjs holds this to Rust's
// own parser on every corpus file.
//
// The convention: a node is `{ k: 'Variant', ...fields }` with Rust's field
// names; a tuple-like enum value is `{ k, _: [args] }`; a unit variant is its
// name as a string; Option is the value or null; a literal is `{ t, v }`. Only a
// statement carries a span, `{ line, column }` — nothing else reaches the
// bytecode.

const BIN = {
  '+': 'Add', '-': 'Sub', '*': 'Mul', '/': 'Div', '%': 'Mod', '^': 'Pow',
  '==': 'Eq', '<>': 'Neq', '<': 'Lt', '>': 'Gt', '<=': 'Le', '>=': 'Ge',
  '&&': 'And', '||': 'Or', '|>': 'Pipe',
};
const UN = { '-': 'Neg', '!': 'Not', '+': 'Pos' };
const CAST = { '##.': 'ToFloat', '###': 'ToIntRound', '##!': 'ToIntTrunc', "##'": 'ToChar' };

class Unknown extends Error {}
const fail = (what, node) => { throw new Unknown(`adapter: ${what} ${JSON.stringify(node)?.slice(0, 200)}`); };

const spanOf = n => ({ line: n.zyLine ?? n.line ?? 0, column: n.zyCol ?? n.col ?? 0 });
const block = stmts => ({ statements: stmtList(stmts ?? []) });

// ── Literals ──────────────────────────────────────────────────────────────────

/** A string literal's parts: plain text, or Rust's raw interpolated form with
 *  escaped braces as \u0001 and \u0002, which is how its lexer hands it over. */
function stringLit(parts) {
  // A brace in a text part was written escaped (`\{`): Rust's lexer hands it over as
  // \u0001 / \u0002, interpolated or not, and the compiler turns it back.
  const braces = v => v.replace(/\{/g, '\u0001').replace(/\}/g, '\u0002');
  if (typeof parts === 'string') return { t: 'String', v: braces(parts) };
  if (!parts.some(p => p.t === 'expr')) return { t: 'String', v: parts.map(p => braces(p.v)).join('') };
  let raw = '';
  for (const p of parts) raw += p.t === 'expr' ? `{${p.v}}` : braces(p.v);
  return { t: 'InterpolatedString', v: raw };
}

function literal(n) {
  switch (n.kind) {
    case 'int': return { t: 'Int', v: n.value };
    case 'float': return { t: 'Float', v: n.value };
    case 'str': return stringLit(n.value);
    case 'bool': return { t: 'Bool', v: n.value };
    case 'char': return { t: 'Char', v: n.value };
    case 'unit': return { t: 'Unit' };
  }
  return fail('literal kind', n);
}

// ── Expressions ───────────────────────────────────────────────────────────────

function group(n, e) { return n.paren ? { k: 'Group', expr: e } : e; }

export function expr(n) {
  if (n == null) return null;
  return group(n, exprBare(n));
}

function ident(name, hot = false, pre = false) { return { k: 'Identifier', name, hot, pre_hot: pre }; }

const isSentinel = n => n?.type === 'Ident' && n.hot === true && n.name === '';
/** The name an expression starts with, where a prefix `°` lands. */
function markPreHot(n) {
  while (n) {
    if (n.type === 'Ident') { n.preHot = true; return; }
    n = n.type === 'BinOp' ? n.left
      : n.type === 'CollectionOp' || n.type === 'NavIndex' || n.type === 'FieldAccess' ? n.obj
      : n.type === 'ImplicitConcat' || n.type === 'JuxtaConcat' ? n.items[0]
      : n.type === 'Pipe' ? n.value
      : null;
  }
}

function concatChain(items) {
  let acc = expr(items[0]);
  for (let i = 1; i < items.length; i++) acc = { k: 'Binary', op: 'Concat', left: acc, right: expr(items[i]) };
  return acc;
}

function exprBare(n) {
  switch (n.type) {
    case 'Literal': return { k: 'Literal', value: literal(n) };
    case 'Ident': return ident(n.name, !!n.hot, !!n.preHot);
    case 'BinOp': {
      const op = BIN[n.op] ?? fail('binary op', n);
      return { k: 'Binary', op, left: expr(n.left), right: expr(n.right) };
    }
    case 'UnaryOp': return { k: 'Unary', op: UN[n.op] ?? fail('unary op', n), operand: expr(n.operand) };
    case 'JuxtaConcat': case 'ImplicitConcat': {
      // `°x + 1` arrives as the prefix sentinel (an unnamed hot name) and the
      // expression it governs; Rust has one name marked `pre_hot` instead.
      const items = n.items;
      if (items.length >= 2 && isSentinel(items[0])) {
        markPreHot(items[1]);
        return items.length === 2 ? expr(items[1]) : concatChain(items.slice(1));
      }
      return concatChain(items);
    }
    case 'Array': return { k: 'ArrayLiteral', elements: n.items.map(expr), declared_mixed: !!n.declaredMixed };
    case 'Tuple':
      if (n.keys) return { k: 'NamedTuple', fields: n.items.map((it, i) => [n.keys[i], expr(it)]) };
      return { k: 'Tuple', elements: n.items.map(expr) };
    case 'FieldAccess': return { k: 'MemberAccess', object: expr(n.obj), field: n.field, is_module_access: !!n.scoped };
    case 'NavIndex': return navIndex(n);
    case 'Call': return { k: 'FunctionCall', callable: callee(n), arguments: n.args.map(argExpr), out_args: outArgs(n.args) };
    case 'CallExpr': return { k: 'FunctionCall', callable: expr(n.callee), arguments: n.args.map(argExpr), out_args: outArgs(n.args) };
    case 'Lambda': return lambda(n);
    case 'CollectionOp': return collectionOp(n);
    case 'DataOp': return dataOp(n);
    case 'CastOp': return { k: 'NumericCast', kind: CAST[n.op] ?? fail('cast', n), expr: expr(n.operand) };
    case 'TypeMetadata': return { k: 'TypeMetadata', expr: expr(n.obj) };
    case 'ErrorConstruct': return { k: 'ErrorConstruct', kind: n.kind.replace(/^##/, ''), message: expr(n.value) };
    case 'Match': return matchExpr(n);
    case 'Pipe': return pipe(n);
    case 'Execute': {
      // zymbol.js keeps `</ file a b />` as one text; Rust splits the path from its arguments.
      const words = splitExecute(n.raw ?? n.path);
      return { k: 'Execute', path: words[0] ?? '', args: words.slice(1) };
    }
    case 'BashExec': return { k: 'BashExec', args: n.args.map(expr) };
    case 'TerminalSize': return { k: 'TerminalSize' };
    case 'FuncUpdate': return {
      k: 'CollectionUpdate',
      target: n.key != null
        ? { k: 'MemberAccess', object: expr(n.obj), field: n.key, is_module_access: false }
        : { k: 'Index', array: expr(n.obj), index: expr(n.index) },
      value: expr(n.value),
    };
    case 'DeepUpdate': return { k: 'CollectionUpdate', target: { k: 'DeepIndex', array: expr(n.obj), path: navPath(n.path) }, value: expr(n.value) };
  }
  return fail('expression', n);
}

/** `f(x)`, or `(f)(x)`, whose group Rust keeps. */
function callee(n) { return n.calleeParen ? { k: 'Group', expr: ident(n.callee) } : ident(n.callee); }

function argExpr(a) { return expr(a.type === 'OutArg' ? a.expr : a); }
// zymbol.js keeps the call-site `<~` marks on the argument array itself.
function outArgs(args) { return [...(args.outArgs ?? [])]; }

/** zymbol_common::shell::split_execute: words split at whitespace, a `"…"` one word. */
const RUST_WS = /[\t\n\v\f\r \u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/u;
function splitExecute(raw) {
  const cs = [...raw.replace(/^[\t\n\v\f\r \u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\t\n\v\f\r \u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/gu, '')];
  const words = [];
  let i = 0;
  while (i < cs.length) {
    if (RUST_WS.test(cs[i])) { i++; continue; }
    let w = '';
    if (cs[i] === '"') {
      i++;
      while (i < cs.length && cs[i] !== '"') w += cs[i++];
      i++;
    } else {
      while (i < cs.length && !RUST_WS.test(cs[i])) w += cs[i++];
    }
    words.push(w);
  }
  return words;
}

function lambda(n) {
  const body = n.body.type === 'block'
    ? { k: 'Block', statements: stmtList(n.body.stmts) }
    : { k: 'Expr', _: [expr(n.body.value)] };
  return { k: 'Lambda', params: n.params.map(p => (typeof p === 'string' ? p : p.name)), body, params_parenthesized: !!n.paramsParen };
}

/** A navigation step's index: Rust's parser folds a negative literal (`m[-1>2]`). */
function navStepExpr(n) {
  if (n && n.type === 'UnaryOp' && n.op === '-' && !n.paren && n.operand?.type === 'Literal' && (n.operand.kind === 'int' || n.operand.kind === 'float'))
    return { k: 'Literal', value: { t: n.operand.kind === 'int' ? 'Int' : 'Float', v: -n.operand.value } };
  const e = expr(n);
  return n && n.navParen ? { k: 'Group', expr: e } : e;
}
/** A step written as `.field` in an edit (`d.l[1]$~ v`) is a string key to Rust. */
function navStep(s) {
  if (s.key != null) return { index: { k: 'Literal', value: { t: 'String', v: s.key } }, range_end: null };
  return { index: navStepExpr(s.expr ?? s.from), range_end: s.kind === 'range' ? navStepExpr(s.to) : null };
}
function navPath(steps) { return { steps: steps.map(navStep) }; }

function navIndex(n) {
  const s = n.spec;
  switch (s.kind) {
    case 'simple': return { k: 'Index', array: expr(n.obj), index: expr(s.index) };
    // A path with a range in it gives several values: Rust's parser makes it a flat extraction.
    case 'path':
      if (s.path.some(st => st.kind === 'range')) return { k: 'FlatExtract', array: expr(n.obj), paths: [navPath(s.path)], double_bracket: false };
      return { k: 'DeepIndex', array: expr(n.obj), path: navPath(s.path) };
    case 'flat': return { k: 'FlatExtract', array: expr(n.obj), paths: s.paths.map(navPath), double_bracket: false };
    // `m[[p]]`, one group, is the double-bracket flat form; two groups or more are structured.
    case 'structured':
      if (s.groups.length === 1) return { k: 'FlatExtract', array: expr(n.obj), paths: s.groups[0].paths.map(navPath), double_bracket: true };
      return { k: 'StructuredExtract', array: expr(n.obj), groups: s.groups.map(g => ({ paths: g.paths.map(navPath) })) };
  }
  return fail('nav spec', s);
}

/** A slice or removal bound: absent, or an expression (Rust folds no negative literal here). */
function bound(n) { return n == null ? null : expr(n); }

function collectionOp(n) {
  const c = expr(n.obj);
  switch (n.op) {
    case '$#': return { k: 'CollectionLength', collection: c };
    case '$+': return { k: 'CollectionAppend', collection: c, element: expr(n.arg) };
    case '$?': return { k: 'CollectionContains', collection: c, element: expr(n.arg) };
    case '$??': return { k: 'CollectionFindAll', collection: c, value: expr(n.arg) };
    case '$-': return { k: 'CollectionRemoveValue', collection: c, value: expr(n.arg) };
    case '$--': return { k: 'CollectionRemoveAll', collection: c, value: expr(n.arg) };
    case '$>': return { k: 'CollectionMap', collection: c, lambda: expr(n.arg) };
    case '$|': return { k: 'CollectionFilter', collection: c, lambda: expr(n.arg) };
    case '$<': return { k: 'CollectionReduce', collection: c, initial: expr(n.init), lambda: expr(n.arg) };
    case '$/': return { k: 'StringSplit', string: c, delimiter: expr(n.arg) };
    case '$*': return { k: 'StringRepeat', string: c, count: expr(n.arg) };
    case '$++': return { k: 'ConcatBuild', base: c, items: (n.items ?? []).map(expr) };
    case '$!': return { k: 'ErrorCheck', expr: c };
    case '$+[i]': return { k: 'CollectionInsert', collection: c, index: expr(n.index), element: expr(n.arg) };
    case '$-[i]': return { k: 'CollectionRemoveAt', collection: c, index: expr(n.index) };
    case '$-[i..j]': return { k: 'CollectionRemoveRange', collection: c, start: bound(n.range.from), end: bound(n.range.to), count_based: false };
    case '$-[i:n]': return { k: 'CollectionRemoveRange', collection: c, start: bound(n.start), end: bound(n.count), count_based: true };
    case '$[i..j]': return { k: 'CollectionSlice', collection: c, start: bound(n.range.from), end: bound(n.range.to), count_based: false };
    case '$[i:n]': return { k: 'CollectionSlice', collection: c, start: bound(n.range.from), end: bound(n.range.count), count_based: true };
    case '$^+': return { k: 'CollectionSortAsc', collection: c, ascending: true, comparator: null };
    case '$^-': return { k: 'CollectionSortDesc', collection: c, ascending: false, comparator: null };
    case '$^': return { k: 'CollectionSortCustom', collection: c, ascending: true, comparator: expr(n.arg) };
    case '$~~': return { k: 'StringReplace', string: c, pattern: expr(n.from), replacement: expr(n.to), count: expr(n.count) };
    case '$!!': return { k: 'ErrorPropagate', expr: c };
  }
  return fail('collection op', n);
}

const BASE = { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hex' };
function precisionOf(n) {
  return n.precExpr ? { k: 'Dynamic', _: [expr(n.precExpr)] } : { k: 'Literal', _: [n.prec] };
}
function dataOp(n) {
  const e = expr(n.arg);
  switch (n.kind) {
    case 'eval': return { k: 'NumericEval', expr: e };
    case 'round': return { k: 'Round', precision: precisionOf(n), expr: e };
    case 'trunc': return { k: 'Trunc', precision: precisionOf(n), expr: e };
    case 'comma': return { k: 'Format', kind: 'Thousands', precision: null, expr: e };
    case 'comma_round': return { k: 'Format', kind: 'Thousands', precision: { k: 'Round', _: [precisionOf(n)] }, expr: e };
    case 'comma_trunc': return { k: 'Format', kind: 'Thousands', precision: { k: 'Truncate', _: [precisionOf(n)] }, expr: e };
    case 'sci': return { k: 'Format', kind: 'Scientific', precision: null, expr: e };
    case 'sci_round': return { k: 'Format', kind: 'Scientific', precision: { k: 'Round', _: [precisionOf(n)] }, expr: e };
    case 'sci_trunc': return { k: 'Format', kind: 'Scientific', precision: { k: 'Truncate', _: [precisionOf(n)] }, expr: e };
    case 'base_conv': return { k: 'BaseConversion', prefix: BASE[n.prec] ?? fail('base', n), expr: e };
  }
  return fail('data op', n);
}

function pipe(n) {
  const r = n.rhs;
  const arg = a => (a.type === 'Ident' && a.name === '_' ? 'Placeholder' : { k: 'Expr', _: [expr(a)] });
  if (r.type === 'Call' && !r.paren) return { k: 'Pipe', left: expr(n.value), callable: callee(r), arguments: r.args.map(arg), implicit: false };
  if (r.type === 'CallExpr' && !r.paren) return { k: 'Pipe', left: expr(n.value), callable: expr(r.callee), arguments: r.args.map(arg), implicit: false };
  return { k: 'Pipe', left: expr(n.value), callable: expr(r), arguments: ['Placeholder'], implicit: true };
}

function matchExpr(n) {
  return { k: 'Match', scrutinee: expr(n.expr), cases: n.arms.map(matchCase) };
}
function matchCase(a) {
  const b = a.body;
  return {
    pattern: pattern(a.pattern),
    value: b && b.type === 'expr' ? expr(b.value) : null,
    // `p => v { … }`: a value and the block run before it, kept by zymbol.js as `effect`.
    block: b && b.type === 'block' ? { statements: stmtList(b.stmts) } : b?.effect ? { statements: stmtList(b.effect) } : null,
  };
}
/** A literal pattern's value: a literal, a negative literal, or a name to compare with. */
function literalPattern(v) {
  if (v.type === 'Ident') return { k: 'Ident', _: [v.name] };
  const folded = navStepExpr(v);
  if (folded.k === 'Literal') return { k: 'Literal', _: [folded.value] };
  return fail('literal pattern', v);
}
/** An element of a list pattern, which zymbol.js writes with `kind`. */
function listElem(e) {
  if (e.type) return pattern(e);
  switch (e.kind) {
    case 'literal': return literalPattern(e.expr);
    case 'wildcard': return { k: 'Wildcard', _: [] };
    case 'bind': return { k: 'Ident', _: [e.name] };
    case 'nested': return pattern(e.pattern);
  }
  return fail('list pattern element', e);
}
function pattern(p) {
  if (!p.type) return listElem(p);
  switch (p.type) {
    case 'literal': return literalPattern(p.value);
    // Both ends are literals to Rust's parser, a negative one folded (`-10..-1`).
    case 'range': return { k: 'Range', _: [navStepExpr(p.from), navStepExpr(p.to)] };
    case 'list': return { k: 'List', _: [p.elems.map(listElem)] };
    case 'wildcard': return { k: 'Wildcard', _: [] };
    case 'comparison': return { k: 'Comparison', _: [BIN[p.op] ?? fail('comparison', p), expr(p.value)] };
    case 'or': return { k: 'Or', _: [p.alts.map(pattern)] };
    case 'IDENT': return { k: 'Ident', _: [p.value] };
    case 'errkind': return { k: 'ErrorKind', _: [p.kind.replace(/^##/, ''), p.bind ?? null] };
    case 'ERRCON': return { k: 'ErrorKind', _: [p.value.replace(/^##/, ''), null] };
  }
  return fail('pattern', p);
}

// ── Statements ────────────────────────────────────────────────────────────────

function isPreHotSentinel(s) {
  return s.type === 'ExprStmt' && s.expr?.type === 'Ident' && s.expr.name === '' && s.expr.hot === true;
}

/** A list of zymbol.js statements into Rust's: one may become two (`>> x ¶`),
 *  and a prefix `°` sentinel merges into the assignment after it. */
export function stmtList(list) {
  const out = [];
  let preHot = false;
  for (const s of list) {
    if (s.type === 'Import' || s.type === 'ExportDecl') continue;
    if (isPreHotSentinel(s)) { preHot = true; continue; }
    const r = stmt(s, preHot);
    preHot = false;
    if (Array.isArray(r)) out.push(...r); else if (r) out.push(r);
  }
  return out;
}

function assignment(s, name, value, sugar, preHot, hot = !!s.hot) {
  return { k: 'Assignment', name, value, span: spanOf(s), hot, pre_hot: preHot, sugar };
}

function stmt(s, preHot = false) {
  const span = spanOf(s);
  switch (s.type) {
    case 'VarAssign': return assignment(s, s.name, expr(s.value), null, preHot);
    case 'CompoundAssign': {
      const op = BIN[s.op.replace('=', '')] ?? fail('compound op', s);
      return assignment(s, s.name, { k: 'Binary', op, left: ident(s.name), right: expr(s.value) }, { k: 'Compound', _: [op] }, preHot);
    }
    case 'Increment': {
      const inc = s.op === '++';
      return assignment(s, s.name, { k: 'Binary', op: inc ? 'Add' : 'Sub', left: ident(s.name), right: { k: 'Literal', value: { t: 'Int', v: 1 } } },
        inc ? 'Increment' : 'Decrement', preHot);
    }
    case 'InPlaceEdit': return assignment(s, s.name, expr(s.expr), 'InPlaceEdit', preHot);
    case 'ConstAssign': return { k: 'ConstDecl', name: s.name, value: expr(s.value), span };
    case 'Output': {
      // Rust's `¶` and `\\` are statements of their own, with their own position.
      const nl = () => ({ k: 'Newline', span: s.nlAt ? { line: s.nlAt.line, column: s.nlAt.col ?? 0 } : span, backslash: !!s.nlBackslash });
      if (!('outLine' in s)) return nl();
      const out = { k: 'Output', exprs: s.items.map(expr), span };
      return s.newline ? [out, nl()] : out;
    }
    case 'ExprStmt':
      if (s.expr?.type === 'Match') return { ...matchExpr(s.expr), span };
      return { k: 'Expr', expr: expr(s.expr), span };
    case 'If': return {
      k: 'If', condition: expr(s.cond), then_block: block(s.then),
      else_if_branches: (s.elseifs ?? []).map(b => ({ condition: expr(b.cond), block: block(b.body) })),
      else_block: s.else ? block(s.else) : null, span,
    };
    case 'Loop': return loop(s, span);
    case 'Break': return { k: 'Break', label: s.label ?? null, span };
    case 'Continue': return { k: 'Continue', label: s.label ?? null, span };
    case 'Return': return { k: 'Return', value: expr(s.value), span };
    case 'FuncDecl': return {
      k: 'FunctionDecl', name: s.name,
      parameters: s.params.map(p => ({ name: p.name, kind: p.isOut ? 'Output' : p.isMut ? 'Mutable' : 'Normal' })),
      body: block(s.body), span,
    };
    case 'TryCatch': return {
      k: 'Try', try_block: block(s.tryBody),
      catch_clauses: s.catches.map(c => ({ error_type: c.errType ? { name: c.errType.replace(/^##/, '') } : null, block: block(c.body) })),
      finally_clause: s.finallyBody ? { block: block(s.finallyBody) } : null, span,
    };
    case 'LifetimeEnd': return { k: 'LifetimeEnd', variable_name: s.name, span };
    case 'ArrayDestruct': case 'TupleDestruct': return {
      k: 'DestructureAssign',
      pattern: { k: s.type === 'ArrayDestruct' ? 'Array' : 'Positional', _: [s.targets.map(destructItem)] },
      value: expr(s.value), span,
    };
    case 'NamedDestruct': return {
      k: 'DestructureAssign', pattern: { k: 'NamedTuple', _: [s.targets.map(t => [t.field, t.name])] }, value: expr(s.value), span,
    };
    case 'Input': return { k: 'Input', variable: s.varName, prompt: inputPrompt(s.prompt), cast: inputCast(s.cast), span };
    case 'CliArgs': return { k: 'CliArgsCapture', variable_name: s.variable, span };
    case 'SetNumeralMode': return { k: 'SetNumeralMode', base: s.base, span };
    case 'Sleep': return { k: 'Sleep', duration: expr(s.duration), span };
    case 'KeyInput': return { k: 'KeyInput', variable: s.variable, blocking: !!s.blocking, span };
    case 'ClearScreen': return { k: 'ClearScreen', span };
    case 'OutputPos': return { k: 'OutputPos', slots: s.slots.map(x => (x ? expr(x) : null)), items: s.items.map(expr), parenthesized: !!s.parenthesized, span };
    case 'TuiBlock': return { k: 'TuiBlock', body: block(s.body), span };
  }
  return fail('statement', s);
}

function destructItem(t) {
  if (t.rest) return { k: 'Rest', _: [t.name] };
  if (t.name === '_') return 'Ignore';
  return { k: 'Bind', _: [t.name] };
}

function inputPrompt(p) {
  if (!p) return null;
  const parts = p.value;
  if (typeof parts === 'string' || !parts.some(x => x.t === 'expr')) {
    return { k: 'Simple', _: [typeof parts === 'string' ? parts : parts.map(x => x.v).join('')] };
  }
  return { k: 'Interpolated', _: [parts.map(x => (x.t === 'expr' ? { k: 'Variable', _: [x.v] } : { k: 'Text', _: [x.v] }))] };
}

function inputCast(c) {
  switch (c?.kind) {
    case undefined: case 'string': return 'String';
    case 'numeric': return 'Numeric';
    case 'float': return 'Float';
    case 'char': return 'Char';
    case 'decimal': return { k: 'Decimal', total: c.total, decimals: c.decimals };
    case 'int': return { k: 'Int', max_digits: c.maxDigits ?? null };
    case 'text': return { k: 'Text', max: c.max ?? null };
  }
  return fail('input cast', c);
}

function loop(s, span) {
  const base = { k: 'Loop', condition: null, iterator_var: null, iterator_pattern: null, iterable: null, body: null, label: s.label ?? null, span };
  switch (s.kind) {
    case 'range':
      return { ...base, iterator_var: s.var, iterable: { k: 'Range', start: expr(s.from), end: expr(s.to), step: expr(s.step) }, body: block(s.body) };
    case 'foreach': {
      if (s.pairs) {
        const [first, ...rest] = s.body;
        const pattern = { k: first.type === 'ArrayDestruct' ? 'Array' : 'Positional', _: [first.targets.map(destructItem)] };
        return { ...base, iterator_pattern: pattern, iterable: expr(s.iterable), body: block(rest) };
      }
      return { ...base, iterator_var: s.var, iterable: expr(s.iterable), body: block(s.body) };
    }
    case 'while': return { ...base, condition: expr(s.cond), body: block(s.body) };
    case 'infinite': return { ...base, body: block(s.body) };
  }
  return fail('loop kind', s);
}

// ── Modules and the program ──────────────────────────────────────────────────

/** `ModulePath` from the text after `<#`: `./a/b`, `../x`, `std/math`, `/abs`, `~/h`. */
export function modulePath(text) {
  let t = text, parent = 0, rel = false, abs = false, home = false;
  if (t.startsWith('~/')) { abs = true; home = true; t = t.slice(2); }
  else if (t.startsWith('/')) { abs = true; t = t.slice(1); }
  else {
    while (t.startsWith('../')) { rel = true; parent++; t = t.slice(3); }
    if (t.startsWith('./')) { rel = true; t = t.slice(2); }
  }
  return { components: t.split('/').filter(Boolean), is_relative: rel, is_absolute: abs, home_relative: home, parent_levels: parent };
}

function exportBlock(decl) {
  return {
    items: decl.names.map(n => (n.kind === 'own'
      ? { k: 'Own', name: n.internal, rename: n.renamed ? n.exported : null }
      : { k: 'ReExport', module_alias: n.alias, item_name: n.member, item_type: n.viaScope ? 'Function' : 'Constant', rename: n.renamed ? n.exported : null })),
  };
}

/** The whole program. */
export function toRustAst(program) {
  let body = program.body;
  let module_decl = null;
  const mod = body.find(s => s.type === 'ModuleBlock');
  if (mod) {
    const exp = mod.body.find(s => s.type === 'ExportDecl');
    module_decl = { name: mod.name, export_block: exp ? exportBlock(exp) : null };
    body = [...body.filter(s => s !== mod), ...mod.body];
  }
  const imports = body.filter(s => s.type === 'Import').map(s => ({ path: modulePath(s.path), alias: s.alias }));
  return { module_decl, imports, statements: stmtList(body) };
}
