// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// zymbol-semantic's last-use analysis (src/last_use.rs) and its interpolation
// scanner (src/interpolation.rs), which zymbol-compiler calls to decide where a
// variable's register is freed (auto-free) and which reads must be pinned. The
// compiler's output depends on every answer here, so this is a port arm for arm,
// over the Rust-shaped AST of rustast.js; the comments that explain *why* are
// Rust's, abridged.
//
// Rust's sets are hash sets: where one is iterated, its order does not reach the
// bytecode (region_schedule sorts each slot), except where noted in compiler.js.

import { isIdentStart, isIdentContinue } from '../zymbol.js';

// ── Mention collection ───────────────────────────────────────────────────────

class Mentions {
  constructor() {
    /** name → last region-level statement index that mentions it */
    this.last = new Map();
    /** names that must never be auto-freed (hot mentions found in this walk) */
    this.poisoned = new Set();
    this.current = 0;
  }
  mention(name) { this.last.set(name, this.current); }
  poison(name) { this.poisoned.add(name); this.mention(name); }
}

/** Every `{content}` segment of an interpolated string, verbatim. */
function scanInterpolated(s, m) {
  const chars = [...s];
  let i = 0;
  while (i < chars.length) {
    if (chars[i] === '{') {
      const start = i + 1;
      let end = start;
      while (end < chars.length && chars[end] !== '}') end++;
      if (end < chars.length) {
        m.mention(chars.slice(start, end).join(''));
        i = end + 1;
        continue;
      }
    }
    i++;
  }
}

function scanLiteral(lit, m) {
  if (lit.t === 'InterpolatedString') scanInterpolated(lit.v, m);
}

function scanPattern(p, m) {
  switch (p.k) {
    case 'Literal': scanLiteral(p._[0], m); break;
    case 'Range': scanExpr(p._[0], m); scanExpr(p._[1], m); break;
    case 'List': for (const item of p._[0]) scanPattern(item, m); break;
    case 'Wildcard': break;
    case 'Comparison': scanExpr(p._[1], m); break;
    // Ident patterns compare against the named variable at runtime — a read.
    case 'Ident': m.mention(p._[0]); break;
    case 'Or': for (const alt of p._[0]) scanPattern(alt, m); break;
    // `##Kind(m)` binds a name for its arm; it reads nothing.
    case 'ErrorKind': break;
    default: throw new Error(`lastuse: pattern ${p.k}`);
  }
}

function scanBlock(block, m) {
  for (const s of block.statements) scanStmt(s, m);
}

function destructureNames(pattern, f) {
  if (pattern.k === 'NamedTuple') { for (const [, v] of pattern._[0]) f(v); return; }
  for (const item of pattern._[0]) if (item !== 'Ignore') f(item._[0]);
}

function scanStmt(stmt, m) {
  switch (stmt.k) {
    case 'Output': for (const e of stmt.exprs) scanExpr(e, m); break;
    case 'Assignment':
      if (stmt.hot || stmt.pre_hot) m.poison(stmt.name); else m.mention(stmt.name);
      scanExpr(stmt.value, m);
      break;
    case 'ConstDecl':
      // Constants are never auto-freed.
      m.poison(stmt.name);
      scanExpr(stmt.value, m);
      break;
    case 'DestructureAssign':
      destructureNames(stmt.pattern, n => m.mention(n));
      scanExpr(stmt.value, m);
      break;
    case 'LifetimeEnd': m.mention(stmt.variable_name); break;
    case 'Input':
      m.mention(stmt.variable);
      if (stmt.prompt && stmt.prompt.k === 'Interpolated') {
        for (const part of stmt.prompt._[0]) if (part.k === 'Variable') m.mention(part._[0]);
      }
      break;
    case 'If':
      scanExpr(stmt.condition, m);
      scanBlock(stmt.then_block, m);
      for (const b of stmt.else_if_branches) { scanExpr(b.condition, m); scanBlock(b.block, m); }
      if (stmt.else_block) scanBlock(stmt.else_block, m);
      break;
    case 'Loop':
      // The iterator write may reuse an outer variable of the same name.
      if (stmt.iterator_var != null) m.mention(stmt.iterator_var);
      if (stmt.condition) scanExpr(stmt.condition, m);
      if (stmt.iterable) scanExpr(stmt.iterable, m);
      scanBlock(stmt.body, m);
      break;
    case 'Break': case 'Continue': case 'Newline': break;
    case 'Try':
      scanBlock(stmt.try_block, m);
      for (const c of stmt.catch_clauses) scanBlock(c.block, m);
      if (stmt.finally_clause) scanBlock(stmt.finally_clause.block, m);
      break;
    // A named function body is its own region.
    case 'FunctionDecl': break;
    case 'Return': if (stmt.value) scanExpr(stmt.value, m); break;
    case 'Match': scanMatch(stmt, m); break;
    case 'Expr': scanExpr(stmt.expr, m); break;
    case 'CliArgsCapture': m.mention(stmt.variable_name); break;
    case 'SetNumeralMode': break;
    case 'Sleep': scanExpr(stmt.duration, m); break;
    case 'KeyInput': m.mention(stmt.variable); break;
    case 'ClearScreen': break;
    case 'OutputPos':
      for (const slot of stmt.slots) if (slot) scanExpr(slot, m);
      for (const item of stmt.items) scanExpr(item, m);
      break;
    case 'TuiBlock': scanBlock(stmt.body, m); break;
    default: throw new Error(`lastuse: statement ${stmt.k}`);
  }
}

function scanMatch(mx, m) {
  scanExpr(mx.scrutinee, m);
  for (const c of mx.cases) {
    scanPattern(c.pattern, m);
    if (c.value) scanExpr(c.value, m);
    if (c.block) scanBlock(c.block, m);
  }
}

/** The expression a precision carries, if it has one (GAP-ZYB-001). */
function scanPrecision(p, f) { if (p.k === 'Dynamic') f(p._[0]); }
function scanPrecisionOp(op, f) { if (op) scanPrecision(op._[0], f); }

function scanExpr(e, m) {
  switch (e.k) {
    case 'Literal': scanLiteral(e.value, m); return;
    case 'Identifier': if (e.hot || e.pre_hot) m.poison(e.name); else m.mention(e.name); return;
    case 'Lambda':
      // Capture-by-value happens where the lambda literal appears.
      if (e.body.k === 'Expr') scanExpr(e.body._[0], m); else scanBlock(e.body, m);
      return;
    case 'Match': scanMatch(e, m); return;
    case 'Execute': case 'TerminalSize': return;
  }
  walkSubExprs(e, sub => scanExpr(sub, m));
}

// ── Region-level creations ───────────────────────────────────────────────────

/** Names a region-level statement creates (or may create) in the region scope. */
function creations(stmt, out) {
  switch (stmt.k) {
    case 'Assignment': if (!stmt.hot && !stmt.pre_hot) out.push(stmt.name); break;
    case 'DestructureAssign': destructureNames(stmt.pattern, n => out.push(n)); break;
    case 'Input': out.push(stmt.variable); break;
    case 'KeyInput': out.push(stmt.variable); break;
    case 'CliArgsCapture': out.push(stmt.variable_name); break;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Destruction schedule for one region: statement index → names to destroy
 *  after that statement finishes normally. */
export function regionSchedule(stmts, paramCandidates, excluded) {
  const m = new Mentions();
  stmts.forEach((s, i) => { m.current = i; scanStmt(s, m); });
  const candidates = new Set(paramCandidates);
  const created = [];
  for (const s of stmts) creations(s, created);
  for (const n of created) candidates.add(n);
  const schedule = new Map();
  for (const name of candidates) {
    if (name.startsWith('_') || m.poisoned.has(name) || excluded.has(name)) continue;
    if (m.last.has(name)) {
      const last = m.last.get(name);
      if (!schedule.has(last)) schedule.set(last, []);
      schedule.get(last).push(name);
    }
  }
  // Rust sorts each slot by its `String` order: code units of UTF-8, which for
  // these strings is code point order.
  for (const names of schedule.values()) names.sort(byCodePoint);
  return schedule;
}

export function byCodePoint(a, b) {
  const x = [...a], y = [...b];
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const d = x[i].codePointAt(0) - y[i].codePointAt(0);
    if (d) return d;
  }
  return x.length - y.length;
}

/** Every name mentioned anywhere in a block, nested blocks and lambda bodies included. */
export function mentionedNames(block) {
  const m = new Mentions();
  for (const s of block.statements) scanStmt(s, m);
  const out = new Set(m.last.keys());
  for (const n of m.poisoned) out.add(n);
  return out;
}

/** Program-wide names that must never be auto-freed, in any region. */
export function autoFreeExclusions(program) {
  const excluded = new Set();
  const all = new Mentions();
  for (const s of program.statements) {
    scanStmt(s, all);
    collectDeclPoisons(s, excluded);
  }
  for (const n of all.poisoned) excluded.add(n);

  const fnFree = new Map();
  collectFnFreeVars(program.statements, fnFree);

  const valueUsed = new Set();
  const fnNames = new Set(fnFree.keys());
  scanValueUses(program.statements, fnNames, valueUsed);
  for (const name of valueUsed) {
    const free = fnFree.get(name);
    if (free) for (const n of free) excluded.add(n);
  }

  if (program.module_decl) {
    const created = [];
    for (const s of program.statements) creations(s, created);
    for (const n of created) excluded.add(n);
  }
  return excluded;
}

function collectDeclPoisons(stmt, excluded) {
  if (stmt.k !== 'FunctionDecl') return;
  const m = new Mentions();
  for (const s of stmt.body.statements) {
    scanStmt(s, m);
    collectDeclPoisons(s, excluded);
  }
  for (const n of m.poisoned) excluded.add(n);
}

function collectFnFreeVars(stmts, out) {
  for (const stmt of stmts) {
    if (stmt.k !== 'FunctionDecl') continue;
    const params = new Set(stmt.parameters.map(p => p.name));
    const local = new Set();
    const free = new Set();
    stmt.body.statements.forEach((s, i) => {
      const m = new Mentions();
      m.current = i;
      scanStmt(s, m);
      const created = [];
      creations(s, created);
      for (const name of m.last.keys()) {
        if (params.has(name) || local.has(name)) continue;
        if (created.includes(name) && !mentionReadsName(s, name)) continue;
        free.add(name);
      }
      for (const n of created) local.add(n);
    });
    out.set(stmt.name, free);
    collectFnFreeVars(stmt.body.statements, out);
  }
}

function mentionReadsName(stmt, name) {
  const m = new Mentions();
  switch (stmt.k) {
    case 'Assignment': scanExpr(stmt.value, m); break;
    case 'DestructureAssign': scanExpr(stmt.value, m); break;
    case 'Input':
      if (stmt.prompt && stmt.prompt.k === 'Interpolated') {
        for (const part of stmt.prompt._[0]) if (part.k === 'Variable') m.mention(part._[0]);
      }
      break;
    default: return true;
  }
  return m.last.has(name);
}

function scanValueUses(stmts, fnNames, valueUsed) {
  for (const stmt of stmts) {
    if (stmt.k === 'FunctionDecl') { scanValueUses(stmt.body.statements, fnNames, valueUsed); continue; }
    const all = new Mentions();
    scanStmt(stmt, all);
    const callOnly = new Mentions();
    collectCallCallables(stmt, callOnly);
    for (const name of all.last.keys()) {
      if (fnNames.has(name) && !callOnly.last.has(name)) valueUsed.add(name);
    }
    extraOccurrences(stmt, fnNames, valueUsed);
  }
}

export function unwrapGroup(e) {
  while (e && e.k === 'Group') e = e.expr;
  return e;
}

function collectCallCallables(stmt, m) {
  const walk = e => {
    if (e.k === 'FunctionCall') {
      const c = unwrapGroup(e.callable);
      if (c.k === 'Identifier') m.mention(c.name);
    }
    walkSubExprs(e, walk);
  };
  walkStmtExprs(stmt, walk);
}

function extraOccurrences(stmt, fnNames, valueUsed) {
  const walk = e => {
    if (e.k === 'FunctionCall') {
      if (unwrapGroup(e.callable).k !== 'Identifier') walk(e.callable);
      for (const a of e.arguments) walk(a);
    } else if (e.k === 'Identifier') {
      if (fnNames.has(e.name)) valueUsed.add(e.name);
    } else {
      walkSubExprs(e, walk);
    }
  };
  walkStmtExprs(stmt, walk);
}

/** Every direct sub-expression of `e`, one level — `walk_sub_exprs`. */
export function walkSubExprs(e, f) {
  switch (e.k) {
    case 'Literal': case 'Identifier': case 'Execute': case 'TerminalSize': return;
    case 'Binary': f(e.left); f(e.right); return;
    case 'Unary': f(e.operand); return;
    case 'Range': f(e.start); f(e.end); if (e.step) f(e.step); return;
    case 'ArrayLiteral': case 'Tuple': for (const x of e.elements) f(x); return;
    case 'Group': f(e.expr); return;
    case 'NamedTuple': for (const [, x] of e.fields) f(x); return;
    case 'MemberAccess': f(e.object); return;
    case 'Index': f(e.array); f(e.index); return;
    case 'FunctionCall': f(e.callable); for (const a of e.arguments) f(a); return;
    case 'Match':
      f(e.scrutinee);
      for (const c of e.cases) {
        if (c.pattern.k === 'Range') { f(c.pattern._[0]); f(c.pattern._[1]); }
        if (c.pattern.k === 'Comparison') f(c.pattern._[1]);
        if (c.value) f(c.value);
        if (c.block) for (const s of c.block.statements) walkStmtExprs(s, f);
      }
      return;
    case 'CollectionLength': f(e.collection); return;
    case 'CollectionAppend': case 'CollectionContains': f(e.collection); f(e.element); return;
    case 'CollectionInsert': f(e.collection); f(e.index); f(e.element); return;
    case 'CollectionRemoveValue': case 'CollectionRemoveAll': case 'CollectionFindAll': f(e.collection); f(e.value); return;
    case 'CollectionRemoveAt': f(e.collection); f(e.index); return;
    case 'CollectionRemoveRange': case 'CollectionSlice':
      f(e.collection); if (e.start) f(e.start); if (e.end) f(e.end); return;
    case 'CollectionUpdate': f(e.target); f(e.value); return;
    case 'StringRepeat': f(e.string); f(e.count); return;
    case 'StringReplace': f(e.string); f(e.pattern); f(e.replacement); if (e.count) f(e.count); return;
    case 'StringSplit': f(e.string); f(e.delimiter); return;
    case 'ConcatBuild': f(e.base); for (const x of e.items) f(x); return;
    case 'NumericEval': case 'TypeMetadata': case 'BaseConversion': case 'NumericCast':
    case 'ErrorCheck': case 'ErrorPropagate':
      f(e.expr); return;
    case 'Format': f(e.expr); scanPrecisionOp(e.precision, f); return;
    case 'Lambda':
      if (e.body.k === 'Expr') f(e.body._[0]); else for (const s of e.body.statements) walkStmtExprs(s, f);
      return;
    case 'CollectionMap': case 'CollectionFilter': f(e.collection); f(e.lambda); return;
    case 'CollectionReduce': f(e.collection); f(e.initial); f(e.lambda); return;
    case 'CollectionSortAsc': case 'CollectionSortDesc': case 'CollectionSortCustom':
      f(e.collection); if (e.comparator) f(e.comparator); return;
    case 'Pipe':
      f(e.left); f(e.callable);
      for (const a of e.arguments) if (a !== 'Placeholder') f(a._[0]);
      return;
    case 'BashExec': for (const a of e.args) f(a); return;
    case 'Round': case 'Trunc': f(e.expr); scanPrecision(e.precision, f); return;
    case 'ErrorConstruct': f(e.message); return;
    case 'DeepIndex': f(e.array); stepsOf(e.path, f); return;
    case 'FlatExtract': f(e.array); for (const p of e.paths) stepsOf(p, f); return;
    case 'StructuredExtract': f(e.array); for (const g of e.groups) for (const p of g.paths) stepsOf(p, f); return;
  }
  throw new Error(`lastuse: expression ${e.k}`);
}
function stepsOf(path, f) {
  for (const s of path.steps) { f(s.index); if (s.range_end) f(s.range_end); }
}

/** The variables a statement can write through an output argument (ZYVM-015). */
export function namesWrittenThroughOutput(stmt) {
  const out = new Set();
  const go = e => {
    if (e.k === 'FunctionCall') {
      for (const i of e.out_args) {
        const a = e.arguments[i];
        const id = a && unwrapGroup(a);
        if (id && id.k === 'Identifier') out.add(id.name);
      }
    }
    walkSubExprs(e, go);
  };
  walkStmtExprs(stmt, go);
  return out;
}

/** Whether evaluating `operand` can write the variable `name` (GLB-115). */
export function operandMayWrite(operand, name, shared) {
  let found = false;
  const go = e => {
    if (found) return;
    switch (e.k) {
      case 'FunctionCall': {
        const passed = e.out_args.some(i => {
          const a = e.arguments[i];
          const id = a && unwrapGroup(a);
          return id && id.k === 'Identifier' && id.name === name;
        });
        if (shared || passed) { found = true; return; }
        break;
      }
      case 'Match': found = true; return;
      case 'Pipe': case 'CollectionMap': case 'CollectionFilter': case 'CollectionReduce':
      case 'CollectionSortAsc': case 'CollectionSortDesc': case 'CollectionSortCustom':
        if (shared) { found = true; return; }
        break;
    }
    walkSubExprs(e, go);
  };
  go(operand);
  return found;
}

/** Every top-level expression of a statement, through nested blocks but not
 *  into function declaration bodies — `walk_stmt_exprs`. */
export function walkStmtExprs(stmt, f) {
  const each = b => { for (const s of b.statements) walkStmtExprs(s, f); };
  switch (stmt.k) {
    case 'Output': for (const e of stmt.exprs) f(e); return;
    case 'Assignment': case 'ConstDecl': case 'DestructureAssign': f(stmt.value); return;
    case 'LifetimeEnd': case 'Newline': case 'Input': case 'Break': case 'Continue':
    case 'FunctionDecl': case 'CliArgsCapture': case 'SetNumeralMode': case 'KeyInput': case 'ClearScreen':
      return;
    case 'If':
      f(stmt.condition); each(stmt.then_block);
      for (const b of stmt.else_if_branches) { f(b.condition); each(b.block); }
      if (stmt.else_block) each(stmt.else_block);
      return;
    case 'Loop':
      if (stmt.condition) f(stmt.condition);
      if (stmt.iterable) f(stmt.iterable);
      each(stmt.body);
      return;
    case 'Try':
      each(stmt.try_block);
      for (const c of stmt.catch_clauses) each(c.block);
      if (stmt.finally_clause) each(stmt.finally_clause.block);
      return;
    case 'Return': if (stmt.value) f(stmt.value); return;
    case 'Match':
      f(stmt.scrutinee);
      for (const c of stmt.cases) { if (c.value) f(c.value); if (c.block) each(c.block); }
      return;
    case 'Expr': f(stmt.expr); return;
    case 'Sleep': f(stmt.duration); return;
    case 'OutputPos':
      for (const s of stmt.slots) if (s) f(s);
      for (const i of stmt.items) f(i);
      return;
    case 'TuiBlock': each(stmt.body); return;
  }
  throw new Error(`lastuse: statement ${stmt.k}`);
}

/** Every name interpolated in an InterpolatedString's text, in order — interpolation.rs. */
export function interpolatedNames(s) {
  const names = [];
  let inVar = false, name = '';
  for (const ch of s) {
    if (ch === '{' && !inVar) { inVar = true; name = ''; }
    else if (ch === '}' && inVar) { inVar = false; if (name) { names.push(name); name = ''; } }
    else if (inVar) {
      const ok = name === '' ? isIdentStart(ch) : isIdentContinue(ch);
      if (ok) name += ch; else inVar = false;
    }
  }
  return names;
}
