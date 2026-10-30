// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// zymbol-compiler (crates/zymbol-compiler/src/lib.rs), ported function for
// function: the Rust-shaped AST of rustast.js into the CompiledProgram the Rust
// compiler would build for it — the same instructions, registers, string pool,
// globals and source table. tests/compile_diff.mjs holds it to `zyb_dump`.
//
// The names are Rust's in camelCase (compile_stmt → compileStmt), so the two can
// be read side by side; the comments that say *why* are Rust's, abridged — the
// full reasoning is in lib.rs, under the same function name.
//
// An instruction is an array, `[Name, ...operands]`, in the operand order of the
// Rust variant; `serde()` turns it into the JSON serde writes, which is what
// program.js loads. A Rust HashMap or HashSet whose iteration order reaches the
// bytecode is a Map or Set here, in insertion order: where Rust's order is
// arbitrary (the LoadUnit runs of zero_new_vars), any order is Rust's.

import {
  regionSchedule, mentionedNames, autoFreeExclusions, namesWrittenThroughOutput,
  operandMayWrite, interpolatedNames, unwrapGroup, walkSubExprs, walkStmtExprs, byCodePoint,
} from './lastuse.js';

// ── Static types for type-directed code generation ───────────────────────────

const T = Object.freeze({ Int: 'Int', Float: 'Float', Bool: 'Bool', String: 'String', Char: 'Char', Unknown: 'Unknown' });

// ── Error ────────────────────────────────────────────────────────────────────

export class CompileError extends Error {
  constructor(kind, ...args) {
    super(CompileError.text(kind, args));
    this.kind = kind;
    this.args = args;
  }
  static text(kind, a) {
    switch (kind) {
      case 'TooManyRegisters': return `too many registers (>65535) in function '${a[0]}'`;
      case 'UndefinedVariable': return `undefined variable '${a[0]}'`;
      case 'Unsupported': return `unsupported construct: ${a[0]}`;
      case 'ModuleNotFound': return `module not found: ${a[0]}`;
      case 'BreakOutsideLoop': return 'break outside loop';
      case 'ContinueOutsideLoop': return 'continue outside loop';
      case 'CircularImport': return `E004: Circular import detected: module '${a[0]}' is already being loaded`;
      case 'ModuleParse': return `failed to parse module: ${a[0]}`;
      case 'ModuleHasNoConstant': return `Module '${a[0]}' has no constant '${a[1]}'. Available constants: ${a[2]}`;
    }
    return kind;
  }
}
const err = (kind, ...args) => new CompileError(kind, ...args);

// ── Loop and try contexts ────────────────────────────────────────────────────

class LoopCtx {
  constructor(label, tryDepth) {
    /** Positions of `Jump(0)` placeholders to patch to the loop's end. */
    this.breakPatches = [];
    /** Positions of `Jump(0)` placeholders for `@>`. */
    this.continuePatches = [];
    this.label = label;
    /** How many `!?` were open when the loop began. */
    this.tryDepth = tryDepth;
  }
}

/** Which part of a `!?` the code being compiled sits in. */
const TryRegion = Object.freeze({ Body: 'Body', Catch: 'Catch', Finally: 'Finally' });

class TryCtx {
  constructor(region, save, guard, fin) {
    this.region = region;
    /** The register this `!?` saves the outer handler in; also its error's tag. */
    this.save = save;
    /** The guard armed around a clause when there is a `:>`. */
    this.guard = guard;
    /** The `:>` block, or null. */
    this.finally = fin;
  }
  clone() { return new TryCtx(this.region, this.save, this.guard, this.finally); }
}

/** Where an edit whose result goes back into its own receiver writes. */
const Receiver = Object.freeze({
  Copy: { k: 'Copy' },
  Own: slot => ({ k: 'Own', slot }),
  State: slot => ({ k: 'State', slot }),
});

/** What `ZYMBOL_POISON_TEMPS` leaves in a temporary whose statement ended. */
const POISON = 5_333_666_999;
const U16_MAX = 65535;

// ── Function compilation context ─────────────────────────────────────────────

class FunctionCtx {
  constructor(name, opts) {
    /** Variable name → register. */
    this.registerMap = new Map();
    /** Register → static type. */
    this.regTypes = [];
    this.nextReg = 0;
    /** Temporaries handed out to the statements being compiled, not yet given back. */
    this.liveTemps = [];
    /** Temporaries whose statement has ended. */
    this.freeTemps = [];
    this.poisonTemps = !!opts.poisonTemps;
    /** With `faithful`, `zero_new_vars` pushes no source position, as Rust does (BUG-VMJS-004). */
    this.rustSrcShift = !!opts.faithful;
    this.instructions = [];
    this.loopStack = [];
    this.tryStack = [];
    this.name = name;
    /** Hot variables (x° and °x): persist across block scopes. */
    this.hotVars = new Set();
    /** Variables the statement being compiled writes through `<~` (ZYVM-015). */
    this.pinned = new Set();
    /** This function's parameters (ZYVM-018). */
    this.params = new Set();
    /** Temporaries this statement loaded module state into, as [slot, register]. */
    this.stateTemps = [];
    /** Postfix-hot variables (x° only): reset to Unit when their loop ends. */
    this.postfixHotVars = new Set();
    this.src = [];
    this.curSrc = { file: 0, line: 0, column: 0 };
    /** Names some `\` in this body ends (ZYVM-005). */
    this.destroyable = new Set();
    /** Temporaries holding a call's result, not yet shown to be a number (ZYVM-022). */
    this.callResults = new Set();
  }

  setRegType(reg, ty) {
    while (this.regTypes.length <= reg) this.regTypes.push(T.Unknown);
    this.regTypes[reg] = ty;
  }
  getRegType(reg) { return this.regTypes[reg] ?? T.Unknown; }

  /** A register for a named variable; its existing one if it has one. */
  allocReg(name) {
    const r0 = this.registerMap.get(name);
    if (r0 !== undefined) return r0;
    const r = this.nextReg;
    if (r === U16_MAX) throw err('TooManyRegisters', this.name);
    this.registerMap.set(name, r);
    this.nextReg++;
    return r;
  }

  /** An anonymous temporary, owned by the statement being compiled. */
  allocTemp() {
    let r;
    if (this.freeTemps.length) { r = this.freeTemps.pop(); this.setRegType(r, T.Unknown); }
    else r = this.freshReg();
    this.liveTemps.push(r);
    return r;
  }

  /** Two temporaries at `r` and `r + 1`, never from the pool. */
  allocTempPair() {
    const lo = this.freshReg(), hi = this.freshReg();
    this.liveTemps.push(lo, hi);
    return [lo, hi];
  }

  freshReg() {
    const r = this.nextReg;
    if (r === U16_MAX) throw err('TooManyRegisters', this.name);
    this.nextReg++;
    return r;
  }

  /** The statement that began when `liveTemps` was `mark` long has ended. */
  releaseTemps(mark) {
    const named = new Set(this.registerMap.values());
    const done = this.liveTemps.splice(mark);
    for (const r of done) {
      if (named.has(r)) continue;
      if (this.poisonTemps) this.emit(['LoadInt', r, POISON]);
      else if (this.callResults.delete(r)) this.emit(['LoadUnit', r]);
      this.freeTemps.push(r);
    }
  }

  getReg(name) {
    const r = this.registerMap.get(name);
    if (r === undefined) throw err('UndefinedVariable', name);
    return r;
  }
  /** `get_reg(name).ok()`: the register, or undefined. */
  regOf(name) { return this.registerMap.get(name); }

  emit(ins) {
    switch (ins[0]) {
      case 'Call': case 'CallDynamic': case 'CallBuiltin':
        this.callResults.add(ins[1]); break;
      case 'AddInt': case 'SubInt': case 'MulInt': case 'DivInt': case 'ModInt': case 'PowInt':
      case 'AddFloat': case 'SubFloat': case 'MulFloat': case 'DivFloat': case 'PowFloat':
        this.callResults.delete(ins[2]); this.callResults.delete(ins[3]); break;
      case 'NegInt': case 'NegFloat': case 'AddIntImm': case 'SubIntImm': case 'MulIntImm':
        this.callResults.delete(ins[2]); break;
    }
    const pos = this.instructions.length;
    this.instructions.push(ins);
    this.src.push(this.curSrc);
    return pos;
  }

  /** An instruction pushed past `emit`, as zero_new_vars does (BUG-VMJS-004). */
  pushRaw(ins) {
    this.instructions.push(ins);
    if (!this.rustSrcShift) this.src.push(this.curSrc);
  }

  currentLabel() { return this.instructions.length; }
  emitJumpPlaceholder() { return this.emit(['Jump', 0]); }
  emitJumpIfNotPlaceholder(cond) { return this.emit(['JumpIfNot', cond, 0]); }
  /** The jump of a `?` / `_?` condition, which refuses what is not a Bool. */
  emitJumpCondPlaceholder(cond) { return this.emit(['JumpIfNotCond', cond, 0]); }

  patchJump(pos, target) {
    const ins = this.instructions[pos];
    switch (ins[0]) {
      case 'Jump': ins[1] = target; return;
      case 'JumpIf': case 'JumpIfNot': case 'JumpIfNotCond': ins[2] = target; return;
      case 'MatchStr': case 'MatchInt': case 'MatchBool': ins[3] = target; return;
    }
    throw new Error(`patch_jump called on non-jump instruction at ${pos}`);
  }

  /** Snapshot current variable names for block scoping. */
  saveScope() { return new Set(this.registerMap.keys()); }

  /** After a loop ends: reset the x° registers created during it to Unit. */
  resetPostfixHotAfterLoop(preLoopHot) {
    const toReset = [];
    for (const name of this.postfixHotVars) {
      if (preLoopHot.has(name)) continue;
      const r = this.registerMap.get(name);
      if (r !== undefined) toReset.push([name, r]);
    }
    for (const [name, reg] of toReset) {
      this.pushRaw(['LoadUnit', reg]);
      this.registerMap.delete(name);
      this.hotVars.delete(name);
      this.postfixHotVars.delete(name);
    }
  }

  /** After a block: zero the registers of the variables it introduced, and forget them. */
  zeroNewVars(saved) {
    const newVars = [];
    for (const [name, r] of this.registerMap) {
      if (!saved.has(name) && !this.hotVars.has(name)) newVars.push([name, r]);
    }
    for (const [name, reg] of newVars) {
      this.pushRaw(['LoadUnit', reg]);
      this.registerMap.delete(name);
    }
  }

  /** Inside a `:>`, at any depth (BUG-ZYB-011). */
  inFinally() { return this.tryStack.some(t => t.region === TryRegion.Finally); }

  patchTryBegin(pos, target) {
    const ins = this.instructions[pos];
    if (ins[0] !== 'TryBegin') throw new Error(`patch_try_begin called on non-TryBegin instruction at ${pos}`);
    ins[1] = target;
  }

  intoChunk(numParams) {
    const oldNumRegisters = this.nextReg;
    this.emit(['Halt']);
    const [instructions, src, numRegisters] = eliminateDeadCode(this.instructions, this.src, oldNumRegisters, numParams);
    return { name: this.name, instructions, num_registers: numRegisters, num_params: numParams, src };
  }
}

const newChunk = name => ({ name, instructions: [], num_registers: 0, num_params: 0, src: [] });

/** Whether an expression can only ever produce a Bool, judged from its shape. */
function exprIsAlwaysBool(e) {
  e = unwrapGroup(e);
  switch (e.k) {
    case 'Literal': return e.value.t === 'Bool';
    case 'Binary':
      return ['Eq', 'Neq', 'Lt', 'Gt', 'Le', 'Ge'].includes(e.op)
        || ((e.op === 'And' || e.op === 'Or') && exprIsAlwaysBool(e.left) && exprIsAlwaysBool(e.right));
    case 'Unary': return e.op === 'Not';
  }
  return false;
}

/** Every name a `\` ends anywhere in these statements, nested blocks included. */
function destroyedNames(stmts, out) {
  for (const s of stmts) {
    switch (s.k) {
      case 'LifetimeEnd': out.add(s.variable_name); break;
      case 'If':
        destroyedNames(s.then_block.statements, out);
        for (const b of s.else_if_branches) destroyedNames(b.block.statements, out);
        if (s.else_block) destroyedNames(s.else_block.statements, out);
        break;
      case 'Loop': destroyedNames(s.body.statements, out); break;
      case 'Try':
        destroyedNames(s.try_block.statements, out);
        for (const c of s.catch_clauses) destroyedNames(c.block.statements, out);
        if (s.finally_clause) destroyedNames(s.finally_clause.block.statements, out);
        break;
      case 'Match': for (const c of s.cases) if (c.block) destroyedNames(c.block.statements, out); break;
      case 'TuiBlock': destroyedNames(s.body.statements, out); break;
    }
  }
}

function emitAutoFree(ctx, names) {
  for (const name of names) {
    const r = ctx.regOf(name);
    if (r !== undefined) ctx.emit(['LoadUnit', r]);
  }
}

// ── Module constants ─────────────────────────────────────────────────────────
// A ModuleConst is `{ t, v }`: Unit, Int, Float, String, Bool, Char, and the
// collections Array and Tuple (`v` a list of constants) and Dict (`v` a list of
// [key, constant]).

const isCollection = mc => mc.t === 'Array' || mc.t === 'Tuple' || mc.t === 'Dict';

/** The span every statement kind reports (`Statement::span`). */
const spanOf = s => s.span ?? { line: 0, column: 0 };

// ── Top-level Compiler ───────────────────────────────────────────────────────

/**
 * `host` gives the compiler what the file system gives Rust's, for modules:
 *   resolve(modulePath, baseDir) → path | null    ModulePath::resolve_from
 *   canonical(path)  → the module's identity       Path::canonicalize
 *   read(path)       → source text | null
 *   display(path)    → zymbol_span::display_path
 *   parent(path)     → its directory; stem(path) → its file stem
 *   parseModule(source, path) → the module's Rust-shaped Program, or throws a
 *     CompileError('ModuleParse', …) worded as Rust words its lexer, parser and
 *     semantic gate.
 */
export class Compiler {
  constructor(opts = {}) {
    this.opts = opts;
    this.host = opts.host ?? null;
    this.stringPool = [];
    /** The interned strings, text → index (`intern_string`). */
    this.stringIndex = new Map();
    this.functions = [];
    this.functionIndex = new Map();
    /** "alias.NAME" → ModuleConst. */
    this.moduleConstants = new Map();
    /** NAME → ModuleConst, for inlining into function bodies. */
    this.globalConsts = new Map();
    /** FuncIdx → [bool] (true = output parameter). */
    this.outputParamMap = new Map();
    this.inFunctionBody = false;
    this.baseDir = null;
    this.loadingStack = new Set();
    this.files = [];
    this.curFile = 0;
    this.curDir = null;
    /** Plain name → FuncIdx while a module is compiled. */
    this.moduleScope = new Map();
    /** Module state: name → global slot. */
    this.globalVarMap = new Map();
    this.globalVarInits = [];
    /** A script's file variables: name → global slot (captured, ERROR-ZYB-002). */
    this.fileVarMap = new Map();
    this.knownModuleAliases = new Set();
    /** name → [paramNames, statements], for recompiling a named function as a closure. */
    this.fnSource = new Map();
    this.autoFreeExcluded = new Set();
    /** canonical path → { functions: [[public, idx]], builtins: [[public, id]], constants: [[public, mc]] } */
    this.compiledModules = new Map();
    /** "alias::func" → builtin id. */
    this.builtinMap = new Map();
    this.funcArity = new Map();
    this.builtinArity = new Map();
  }

  newCtx(name) { return new FunctionCtx(name, this.opts); }

  /** `Compiler::compile_named`: the program, with `baseDir` for its imports. */
  static compileNamed(program, baseDir, mainName, opts = {}) {
    const c = new Compiler(opts);
    c.baseDir = baseDir ?? null;
    c.files = [mainName ?? ''];
    c.autoFreeExcluded = autoFreeExclusions(program);

    if (baseDir != null) for (const imp of program.imports) c.compileImport(imp, baseDir);

    // First pass: register function names so forward calls work.
    for (const s of program.statements) {
      if (s.k !== 'FunctionDecl') continue;
      const idx = c.functions.length;
      c.functionIndex.set(s.name, idx);
      c.funcArity.set(idx, s.parameters.length);
      const outFlags = s.parameters.map(p => p.kind === 'Output');
      if (outFlags.some(b => b)) c.outputParamMap.set(idx, outFlags);
      c.fnSource.set(s.name, [s.parameters.map(p => p.name), s.body.statements]);
      c.functions.push(newChunk(s.name));
    }

    // Immutable constants (:=) are inlined; a collection becomes a global.
    for (const s of program.statements) {
      if (s.k !== 'ConstDecl') continue;
      const mc = Compiler.evalConstExpr(s.value);
      if (!mc) continue;
      if (isCollection(mc)) {
        if (!c.globalVarMap.has(s.name)) {
          const g = c.globalVarInits.length;
          c.globalVarInits.push(Compiler.globalInitOf(mc));
          c.globalVarMap.set(s.name, g);
        }
      } else {
        c.globalConsts.set(s.name, mc);
      }
    }

    // A script's file variables a function body mentions get a slot (ERROR-ZYB-002).
    if (!program.module_decl) {
      const reachable = new Set();
      for (const s of program.statements) {
        if (s.k === 'FunctionDecl') for (const n of mentionedNames(s.body)) reachable.add(n);
      }
      for (const s of program.statements) {
        if (s.k !== 'Assignment') continue;
        if (!reachable.has(s.name) || c.globalVarMap.has(s.name) || c.fileVarMap.has(s.name)) continue;
        const idx = c.globalVarInits.length;
        c.globalVarInits.push('Unit');
        c.fileVarMap.set(s.name, idx);
      }
    }

    for (const s of program.statements) {
      if (s.k !== 'FunctionDecl') continue;
      const chunk = c.compileFunction(s);
      c.functions[c.functionIndex.get(s.name)] = chunk;
    }

    const schedule = regionSchedule(program.statements, [], c.autoFreeExcluded);
    const ctx = c.newCtx('<main>');
    destroyedNames(program.statements, ctx.destroyable);
    program.statements.forEach((s, i) => {
      if (s.k !== 'FunctionDecl') c.compileStmt(s, ctx);
      const names = schedule.get(i);
      if (names) emitAutoFree(ctx, names);
    });
    const main = ctx.intoChunk(0);
    return { main, functions: c.functions, string_pool: c.stringPool, global_var_inits: c.globalVarInits, files: c.files };
  }

  /** Load, parse and compile an imported module; register its exports under its alias. */
  compileImport(imp, baseDir) {
    if (isStdlib(imp.path)) {
      const moduleKey = imp.path.components.join('/');
      const entries = stdlibBuiltinEntries(moduleKey, this.opts.features);
      if (entries) {
        const alias = imp.alias;
        const declared = stdlibModule(moduleKey);
        for (const [funcName, builtinId] of entries) {
          this.builtinMap.set(`${alias}::${funcName}`, builtinId);
          const f = declared?.[funcName];
          if (f !== undefined) this.builtinArity.set(builtinId, f);
        }
        if (moduleKey === 'std/math') {
          this.moduleConstants.set(`${alias}.PI`, { t: 'Float', v: Math.PI });
          this.moduleConstants.set(`${alias}.E`, { t: 'Float', v: Math.E });
        }
        this.knownModuleAliases.add(alias);
        return;
      }
      throw err('ModuleNotFound', moduleKey);
    }

    const host = this.host;
    if (!host) throw err('ModuleNotFound', `${imp.path.components.join('/')}.zy`);
    const path = host.resolve(imp.path, baseDir);
    if (path == null) throw err('ModuleNotFound', `${imp.path.components.join('/')}.zy`);
    const canonical = host.canonical(path);

    // L23/MM-10: the same module file compiles once.
    const cached = this.compiledModules.get(canonical);
    if (cached) { this.registerModuleAlias(imp.alias, cached); return; }

    if (this.loadingStack.has(canonical)) throw err('CircularImport', host.stem(path) ?? 'unknown');
    this.loadingStack.add(canonical);

    const source = host.read(path);
    if (source == null) throw err('ModuleNotFound', path);
    const moduleProg = host.parseModule(source, path);

    const moduleBaseDir = host.parent(path);
    const savedFile = this.curFile;
    const savedDir = this.curDir;
    this.curDir = moduleBaseDir;
    const name = host.display(path);
    let moduleFileIdx = this.files.indexOf(name);
    if (moduleFileIdx < 0) { this.files.push(name); moduleFileIdx = this.files.length - 1; }
    this.curFile = moduleFileIdx;

    for (const sub of moduleProg.imports) this.compileImport(sub, moduleBaseDir);
    this.curFile = moduleFileIdx;

    const alias = imp.alias;
    const allFuncNames = moduleProg.statements.filter(s => s.k === 'FunctionDecl').map(s => s.name);

    const ownFuncExports = [], ownConstExports = [], reexportFuncs = [], reexportConsts = [];
    const exportBlock = moduleProg.module_decl?.export_block;
    if (exportBlock) {
      for (const item of exportBlock.items) {
        if (item.k === 'Own') {
          const pub = item.rename ?? item.name;
          const isFunc = moduleProg.statements.some(s => s.k === 'FunctionDecl' && s.name === item.name);
          (isFunc ? ownFuncExports : ownConstExports).push([item.name, pub]);
        } else {
          const pub = item.rename ?? item.item_name;
          (item.item_type === 'Function' ? reexportFuncs : reexportConsts).push([item.module_alias, item.item_name, pub]);
        }
      }
    }

    const startIdx = this.functions.length;
    const localScope = new Map();
    allFuncNames.forEach((n, i) => { localScope.set(n, startIdx + i); this.functions.push(newChunk(n)); });

    for (const s of moduleProg.statements) {
      if (s.k !== 'FunctionDecl') continue;
      const idx = localScope.get(s.name);
      if (idx === undefined) continue;
      this.funcArity.set(idx, s.parameters.length);
      const outFlags = s.parameters.map(p => p.kind === 'Output');
      if (outFlags.some(b => b)) this.outputParamMap.set(idx, outFlags);
    }

    this.knownModuleAliases.add(alias);

    const exports = { functions: [], builtins: [], constants: [] };
    for (const [internal, pub] of ownFuncExports) {
      const idx = localScope.get(internal);
      if (idx !== undefined) exports.functions.push([pub, idx]);
    }

    const savedGlobalConsts = this.globalConsts;
    this.globalConsts = new Map();

    const shadowedGvars = [];
    const bindGvar = (n, init) => {
      const g = this.globalVarInits.length;
      this.globalVarInits.push(init);
      const prev = this.globalVarMap.has(n) ? this.globalVarMap.get(n) : null;
      this.globalVarMap.set(n, g);
      shadowedGvars.push([n, prev]);
    };

    for (const s of moduleProg.statements) {
      if (s.k !== 'ConstDecl') continue;
      const mc = Compiler.evalConstExpr(s.value);
      if (!mc) continue;
      if (isCollection(mc)) bindGvar(s.name, Compiler.globalInitOf(mc));
      else this.globalConsts.set(s.name, mc);
    }
    for (const s of moduleProg.statements) {
      if (s.k !== 'Assignment') continue;
      if (shadowedGvars.some(([n]) => n === s.name)) continue;
      const mc = Compiler.evalConstExpr(s.value);
      bindGvar(s.name, mc ? Compiler.globalInitOf(mc) : 'Unit');
    }

    const savedModuleScope = this.moduleScope;
    this.moduleScope = localScope;
    const savedExcluded = this.autoFreeExcluded;
    this.autoFreeExcluded = autoFreeExclusions(moduleProg);

    allFuncNames.forEach((n, i) => {
      const decl = moduleProg.statements.find(s => s.k === 'FunctionDecl' && s.name === n);
      if (decl) this.functions[startIdx + i] = this.compileFunction(decl);
    });

    this.moduleScope = savedModuleScope;
    this.autoFreeExcluded = savedExcluded;
    this.globalConsts = savedGlobalConsts;
    for (let i = shadowedGvars.length - 1; i >= 0; i--) {
      const [n, prev] = shadowedGvars[i];
      if (prev !== null) this.globalVarMap.set(n, prev); else this.globalVarMap.delete(n);
    }

    // MEM-4 (GLB-009): only a constant may be exported.
    for (const [internal, pub] of ownConstExports) {
      const decl = moduleProg.statements.find(s => s.k === 'ConstDecl' && s.name === internal);
      if (decl) {
        const mc = Compiler.evalConstExpr(decl.value);
        if (mc) exports.constants.push([pub, mc]);
      }
    }
    for (const [srcAlias, itemName, pub] of reexportFuncs) {
      const q = `${srcAlias}::${itemName}`;
      if (this.functionIndex.has(q)) exports.functions.push([pub, this.functionIndex.get(q)]);
      if (this.builtinMap.has(q)) exports.builtins.push([pub, this.builtinMap.get(q)]);
    }
    for (const [srcAlias, itemName, pub] of reexportConsts) {
      const mc = this.moduleConstants.get(`${srcAlias}.${itemName}`);
      if (mc) exports.constants.push([pub, mc]);
    }

    this.registerModuleAlias(alias, exports);
    this.compiledModules.set(canonical, exports);
    this.loadingStack.delete(canonical);
    this.curFile = savedFile;
    this.curDir = savedDir;
  }

  registerModuleAlias(alias, exports) {
    for (const [pub, idx] of exports.functions) this.functionIndex.set(`${alias}::${pub}`, idx);
    for (const [pub, bid] of exports.builtins) this.builtinMap.set(`${alias}::${pub}`, bid);
    for (const [pub, mc] of exports.constants) this.moduleConstants.set(`${alias}.${pub}`, mc);
    this.knownModuleAliases.add(alias);
  }

  compileFunction(decl) {
    const ctx = this.newCtx(decl.name);
    destroyedNames(decl.body.statements, ctx.destroyable);
    for (const p of decl.parameters) { ctx.allocReg(p.name); ctx.params.add(p.name); }
    const numParams = decl.parameters.length;

    const excluded = new Set(this.autoFreeExcluded);
    const paramCandidates = [];
    for (const p of decl.parameters) {
      if (p.kind === 'Normal') paramCandidates.push(p.name); else excluded.add(p.name);
    }
    const schedule = regionSchedule(decl.body.statements, paramCandidates, excluded);

    const prevInFn = this.inFunctionBody;
    this.inFunctionBody = true;
    try {
      decl.body.statements.forEach((s, i) => {
        this.compileStmt(s, ctx);
        const names = schedule.get(i);
        if (names) emitAutoFree(ctx, names);
      });
    } finally {
      this.inFunctionBody = prevInFn;
    }
    const unit = ctx.allocTemp();
    ctx.emit(['LoadUnit', unit]);
    ctx.emit(['Return', unit]);
    return ctx.intoChunk(numParams);
  }

  /** A named function recompiled as a closure with captured upvalues. */
  compileNamedFnAsClosure(originalName, params, stmts, freeVars) {
    const closureName = `<closure#${this.functions.length}/${originalName}>`;
    const funcIdx = this.functions.length;
    this.functions.push(newChunk(closureName));
    this.functionIndex.set(closureName, funcIdx);

    const ctx = this.newCtx(closureName);
    destroyedNames(stmts, ctx.destroyable);
    for (const p of params) { ctx.allocReg(p); ctx.params.add(p); }
    const numParams = params.length;
    for (const fv of freeVars) ctx.allocReg(fv);

    const prevInFn = this.inFunctionBody;
    this.inFunctionBody = true;
    for (const s of stmts) this.compileStmt(s, ctx);
    this.inFunctionBody = prevInFn;

    const unit = ctx.allocTemp();
    ctx.emit(['LoadUnit', unit]);
    ctx.emit(['Return', unit]);
    this.functions[funcIdx] = ctx.intoChunk(numParams);
    return funcIdx;
  }

  // ── Statement compilation ──────────────────────────────────────────────────

  compileStmt(stmt, ctx) {
    const written = namesWrittenThroughOutput(stmt);
    const saved = ctx.pinned;
    ctx.pinned = written;
    const savedTemps = ctx.stateTemps;
    ctx.stateTemps = [];
    const mark = ctx.liveTemps.length;
    try {
      this.compileStmtInner(stmt, ctx);
    } finally {
      ctx.pinned = saved;
      ctx.stateTemps = savedTemps;
    }
    ctx.releaseTemps(mark);
  }

  compileStmtInner(stmt, ctx) {
    const sp = spanOf(stmt);
    ctx.curSrc = { file: this.curFile, line: sp.line, column: sp.column };
    switch (stmt.k) {
      case 'Assignment': {
        const a = stmt;
        // GLB-119: a name that is module state stays module state, hot mark or not.
        const moduleState = this.globalVarMap.has(a.name) && !ctx.params.has(a.name);
        if ((a.hot || a.pre_hot) && ctx.regOf(a.name) === undefined && !moduleState) {
          const neutralReg = ctx.allocReg(a.name);
          ctx.emit(hotNeutralInstr(a.value, a.name, neutralReg));
          ctx.hotVars.add(a.name);
          if (a.hot) ctx.postfixHotVars.add(a.name);
        }
        return this.compileAssignment(a.name, a.value, a.sugar, ctx);
      }
      case 'ConstDecl': return this.compileAssignment(stmt.name, stmt.value, null, ctx);
      case 'Output': return this.compileOutput(stmt, ctx);
      case 'Newline': ctx.emit(['PrintNewline']); return;
      case 'If': return this.compileIf(stmt, ctx);
      case 'Loop': return this.compileLoop(stmt, ctx);
      case 'Break': return this.compileBreak(stmt, ctx);
      case 'Continue': return this.compileContinue(stmt, ctx);
      case 'Return': {
        const r = stmt;
        // BUG-ZYB-011: inside a `:>`, `<~` is not a return.
        if (ctx.inFinally()) {
          if (r.value) this.compileExpr(r.value, ctx);
          return;
        }
        // TCO: `<~ f(args)` where f is the current function, outside any `!?`.
        if (ctx.tryStack.length === 0 && r.value) {
          const val = unwrapGroup(r.value);
          if (val.k === 'FunctionCall') {
            const id = unwrapGroup(val.callable);
            if (id.k === 'Identifier' && id.name === ctx.name) {
              const funcIdx = this.functionIndex.has(id.name) ? this.functionIndex.get(id.name) : this.moduleScope.get(id.name);
              if (funcIdx !== undefined) {
                const argRegs = val.arguments.map(a => this.compileExpr(a, ctx));
                ctx.emit(['TailCall', funcIdx, argRegs]);
                return;
              }
            }
          }
        }
        let reg;
        if (r.value) reg = this.compileExpr(r.value, ctx);
        else { reg = ctx.allocTemp(); ctx.emit(['LoadUnit', reg]); }
        if (ctx.tryStack.length !== 0) {
          const held = ctx.allocTemp();
          ctx.emit(['CopyReg', held, reg]);
          this.emitTryExits(ctx, 0);
          reg = held;
        }
        ctx.emit(['Return', reg]);
        return;
      }
      case 'FunctionDecl': return;
      case 'Expr': this.compileExpr(stmt.expr, ctx); return;
      case 'Match': return this.compileMatchStmt(stmt, ctx);
      case 'DestructureAssign': return this.compileDestructureAssign(stmt, ctx);
      case 'Input': {
        const input = stmt;
        const dst = ctx.regOf(input.variable) ?? ctx.allocReg(input.variable);
        let promptReg = null;
        if (input.prompt && input.prompt.k === 'Simple') {
          const idx = this.internString(input.prompt._[0]);
          promptReg = ctx.allocTemp();
          ctx.emit(['LoadStr', promptReg, idx]);
        } else if (input.prompt && input.prompt.k === 'Interpolated') {
          const parts = [];
          for (const part of input.prompt._[0]) {
            if (part.k === 'Text') parts.push({ Lit: this.internString(part._[0]) });
            else {
              const r = ctx.regOf(part._[0]);
              if (r !== undefined) parts.push({ Reg: r });
              else parts.push({ Lit: this.internString(`{${part._[0]}}`) });
            }
          }
          promptReg = ctx.allocTemp();
          ctx.emit(['BuildStr', promptReg, parts]);
        }
        ctx.emit(['ReadLine', dst, promptReg, inputKindOf(input.cast)]);
        return;
      }
      case 'Try': return this.compileTry(stmt, ctx);
      case 'LifetimeEnd': {
        const name = stmt.variable_name;
        // ZYVM-005: a local keeps its register; the `\` is marked at run time.
        if (this.destroyedLocally(name, ctx)) {
          const r = ctx.regOf(name);
          if (r !== undefined) {
            ctx.emit(['DestroyLocal', r, this.internString(name)]);
            return;
          }
        }
        const r = ctx.regOf(name);
        if (r !== undefined) {
          ctx.emit(['LoadUnit', r]);
          ctx.registerMap.delete(name);
        }
        // GLB-008: a file variable is ended at run time, from `<main>` only (GLB-055).
        if (ctx.name === '<main>' && this.fileVarMap.has(name)) {
          ctx.emit(['DestroyGlobal', this.fileVarMap.get(name), this.internString(name)]);
        }
        // GLB-120: module state's end is the module's.
        if (ctx.regOf(name) === undefined && !ctx.params.has(name) && this.globalVarMap.has(name)) {
          ctx.emit(['DestroyGlobal', this.globalVarMap.get(name), this.internString(name)]);
        }
        return;
      }
      case 'CliArgsCapture': {
        const dst = ctx.allocReg(stmt.variable_name);
        ctx.emit(['LoadCliArgs', dst]);
        return;
      }
      case 'SetNumeralMode': ctx.emit(['SetNumeralMode', stmt.base]); return;
      case 'Sleep': {
        const r = this.compileExpr(stmt.duration, ctx);
        ctx.emit(['Sleep', r]);
        return;
      }
      case 'ClearScreen': ctx.emit(['ClearScreen']); return;
      case 'KeyInput': {
        const dst = ctx.regOf(stmt.variable) ?? ctx.allocReg(stmt.variable);
        ctx.emit(['ReadKey', dst, stmt.blocking]);
        return;
      }
      case 'OutputPos': {
        const slotRegs = [];
        const lone = stmt.slots.length === 1;
        for (const slot of stmt.slots) {
          let r;
          if (!slot) { r = ctx.allocTemp(); ctx.emit(['LoadUnit', r]); }
          else { r = this.compileExpr(slot, ctx); ctx.emit(['OutputSlotCheck', r, lone]); }
          slotRegs.push(r);
        }
        const rPos = ctx.allocTemp();
        ctx.emit(['MakeTuple', rPos, slotRegs]);
        const regs = stmt.items.map(it => this.compileExpr(it, ctx));
        ctx.emit(['PrintAt', rPos, regs]);
        return;
      }
      case 'TuiBlock':
        ctx.emit(['EnterTui']);
        this.compileBlock(stmt.body, ctx);
        ctx.emit(['ExitTui']);
        return;
    }
    throw new Error(`compiler: statement ${stmt.k}`);
  }

  compileBlock(block, ctx) {
    for (const s of block.statements) this.compileStmt(s, ctx);
  }

  /** `r_cmp = (r_val == n)`; the immediate form only when `n` fits an i32. */
  emitIntEq(ctx, rCmp, rVal, n) {
    if (n >= -2147483648 && n <= 2147483647) ctx.emit(['CmpEqImm', rCmp, rVal, n]);
    else {
      const rN = ctx.allocTemp();
      ctx.emit(['LoadInt', rN, n]);
      ctx.emit(['CmpEq', rCmp, rVal, rN]);
    }
  }

  /** Whether a `\` of `name` in this body is tracked on its own register (ZYVM-005). */
  destroyedLocally(name, ctx) {
    return ctx.destroyable.has(name) && (ctx.name !== '<main>' || !this.fileVarMap.has(name));
  }

  compileAssignment(name, value, sugar, ctx) {
    this.compileAssignmentInner(name, value, sugar, ctx);
    if (this.destroyedLocally(name, ctx)) {
      const r = ctx.regOf(name);
      if (r !== undefined) ctx.emit(['Revive', r]);
    }
  }

  compileAssignmentInner(name, value, sugar, ctx) {
    if (sugar === 'InPlaceEdit') {
      const rRecv = ctx.regOf(name);
      if (rRecv !== undefined) {
        ctx.emit(['AssertMutable', rRecv, this.internString(name)]);
      } else if (this.globalVarMap.has(name)) {
        // ZYVM-016: module state is checked too, loaded for the check alone.
        const idx = this.internString(name);
        const t = ctx.allocTemp();
        ctx.emit(['LoadGlobal', t, this.globalVarMap.get(name)]);
        ctx.emit(['AssertMutable', t, idx]);
        ctx.emit(['LoadUnit', t]);
      }
    }
    const isReceiver = e => {
      const u = unwrapGroup(e);
      return u.k === 'Identifier' && u.name === name && !u.hot && !u.pre_hot;
    };
    const split = this.globalVarMap.has(name) && !ctx.params.has(name);
    const ownLocal = ctx.regOf(name) !== undefined && !ctx.pinned.has(name) && !split;
    const state = ctx.regOf(name) === undefined && this.globalVarMap.has(name) ? this.globalVarMap.get(name) : null;
    const mirror = ctx.name === '<main>' && this.fileVarMap.has(name) ? this.fileVarMap.get(name) : null;
    const receiverOf = root => {
      if (!isReceiver(root)) return Receiver.Copy;
      if (ownLocal) return Receiver.Own(mirror);
      if (state !== null) return Receiver.State(state);
      return Receiver.Copy;
    };
    const v = unwrapGroup(value);
    switch (v.k) {
      case 'CollectionUpdate': {
        const t = unwrapGroup(v.target);
        const root = t.k === 'Index' ? t.array : t.k === 'DeepIndex' ? t.array
          : t.k === 'MemberAccess' && !t.is_module_access ? t.object : null;
        const receiver = root ? receiverOf(root) : Receiver.Copy;
        if (receiver.k !== 'Copy') {
          const src = this.compileCollectionUpdateAs(v, sugar === 'InPlaceEdit' ? name : null, receiver, ctx);
          return this.storeToName(name, src, ctx);
        }
        break;
      }
      case 'CollectionRemoveAt': {
        const recv = receiverOf(v.collection);
        if (recv.k === 'Own') {
          const reg = ctx.getReg(name);
          const rIdx = this.compileExpr(v.index, ctx);
          if (recv.slot !== null) ctx.emit(['DetachGlobal', recv.slot, reg]);
          ctx.emit(['ArrayRemove', reg, rIdx]);
          if (recv.slot !== null) ctx.emit(['StoreGlobal', recv.slot, reg]);
          return;
        }
        if (recv.k === 'State') {
          const g = recv.slot;
          const t = this.compileExpr(v.collection, ctx);
          const rIdx = this.compileExpr(v.index, ctx);
          Compiler.releaseStateTemps(g, [t, rIdx], ctx);
          ctx.emit(['DetachGlobal', g, t]);
          ctx.emit(['ArrayRemove', t, rIdx]);
          ctx.emit(['StoreGlobal', g, t]);
          return;
        }
        break;
      }
      // `a$++ x y` adds at the end, in place when its destination is its base (GLB-118).
      case 'ConcatBuild': {
        const recv = receiverOf(v.base);
        if (recv.k === 'Own') {
          const reg = ctx.getReg(name);
          const itemRegs = v.items.map(it => this.compileExpr(it, ctx));
          if (recv.slot !== null) ctx.emit(['DetachGlobal', recv.slot, reg]);
          ctx.emit(['ConcatBuild', reg, reg, itemRegs]);
          if (recv.slot !== null) ctx.emit(['StoreGlobal', recv.slot, reg]);
          return;
        }
        if (recv.k === 'State') {
          const g = recv.slot;
          const t = this.compileExpr(v.base, ctx);
          const itemRegs = v.items.map(it => this.compileExpr(it, ctx));
          Compiler.releaseStateTemps(g, [t, ...itemRegs], ctx);
          ctx.emit(['DetachGlobal', g, t]);
          ctx.emit(['ConcatBuild', t, t, itemRegs]);
          ctx.emit(['StoreGlobal', g, t]);
          return;
        }
        break;
      }
      case 'CollectionAppend': {
        const recv = receiverOf(v.collection);
        if (recv.k === 'State') {
          const g = recv.slot;
          const t = this.compileExpr(v.collection, ctx);
          const rElem = this.compileExpr(v.element, ctx);
          Compiler.releaseStateTemps(g, [t, rElem], ctx);
          ctx.emit(['DetachGlobal', g, t]);
          ctx.emit(['ArrayPush', t, rElem]);
          ctx.emit(['StoreGlobal', g, t]);
          return;
        }
        break;
      }
      // `s = s x y`: ConcatStr into the receiver itself (ZYVM-023).
      case 'Binary': {
        if (v.op !== 'Concat') break;
        const parts = [];
        let root = v;
        while (root.k === 'Binary' && root.op === 'Concat') {
          parts.push(root.right);
          root = unwrapGroup(root.left);
        }
        parts.reverse();
        const recv = receiverOf(root);
        if (recv.k === 'Own') {
          const reg = ctx.getReg(name);
          const partRegs = this.compileConcatParts(parts, reg, ctx);
          if (recv.slot !== null) ctx.emit(['DetachGlobal', recv.slot, reg]);
          for (const r of partRegs) ctx.emit(['ConcatStr', reg, reg, r]);
          if (recv.slot !== null) ctx.emit(['StoreGlobal', recv.slot, reg]);
          ctx.setRegType(reg, T.String);
          return;
        }
        if (recv.k === 'State') {
          const g = recv.slot;
          const t = this.compileExpr(root, ctx);
          const partRegs = this.compileConcatParts(parts, t, ctx);
          Compiler.releaseStateTemps(g, [t, ...partRegs], ctx);
          ctx.emit(['DetachGlobal', g, t]);
          for (const r of partRegs) ctx.emit(['ConcatStr', t, t, r]);
          ctx.emit(['StoreGlobal', g, t]);
          return;
        }
        break;
      }
    }
    // arr = arr$+ elem → ArrayPush in place, unless `arr` is written through `<~`.
    if (value.k === 'CollectionAppend') {
      const id = unwrapGroup(value.collection);
      if (id.k === 'Identifier' && id.name === name && !ctx.pinned.has(name)) {
        if ((id.hot || id.pre_hot) && ctx.regOf(name) === undefined) {
          const arrReg = ctx.allocReg(name);
          ctx.emit(['HotInit', arrReg, 'Array']);
          ctx.hotVars.add(name);
        }
        const arrReg = ctx.regOf(name);
        if (arrReg !== undefined) {
          const rElem = this.compileExpr(value.element, ctx);
          ctx.emit(['ArrayPush', arrReg, rElem]);
          return;
        }
      }
    }
    // DM-16: the in-place form of `t[i]$~ v` keeps its name, so a tuple refuses it.
    const inPlace = sugar === 'InPlaceEdit';
    const uv = unwrapGroup(value);
    const src = uv.k === 'CollectionUpdate' && inPlace
      ? this.compileCollectionUpdateAs(uv, name, Receiver.Copy, ctx)
      : this.compileExpr(value, ctx);
    this.storeToNameWith(name, src, endsInOneInstruction(value), ctx);
  }

  storeToName(name, src, ctx) { this.storeToNameWith(name, src, false, ctx); }

  storeToNameWith(name, src, retarget, ctx) {
    const srcTy = ctx.getRegType(src);
    if (!ctx.params.has(name) && this.globalVarMap.has(name)) {
      ctx.emit(['StoreGlobal', this.globalVarMap.get(name), src]);
      return;
    }
    if (ctx.name === '<main>' && this.fileVarMap.has(name)) {
      ctx.emit(['StoreGlobal', this.fileVarMap.get(name), src]);
    }
    const dst = ctx.regOf(name) ?? ctx.allocReg(name);
    if (srcTy !== T.Unknown) ctx.setRegType(dst, srcTy);
    if (src !== dst) {
      let srcIsTemp = true;
      for (const r of ctx.registerMap.values()) if (r === src) { srcIsTemp = false; break; }
      const last = ctx.instructions[ctx.instructions.length - 1];
      const retargeted = retarget && srcIsTemp && last !== undefined && retargetDst(last, src, dst);
      if (!retargeted) ctx.emit(['CopyReg', dst, src]);
    }
  }

  /** Where a form that binds without `=` writes: [register, module slot | null] (GLB-119). */
  bindingTarget(name, ctx) {
    const existing = ctx.regOf(name);
    if (existing !== undefined) return [existing, null];
    if (!ctx.params.has(name) && this.globalVarMap.has(name)) return [ctx.allocTemp(), this.globalVarMap.get(name)];
    return [ctx.allocReg(name), null];
  }

  /** After a binding's register holds its value: the slot, and a revived `\` (GLB-147). */
  finishBinding(name, reg, slot, ctx) {
    if (slot !== null) ctx.emit(['StoreGlobal', slot, reg]);
    if (this.destroyedLocally(name, ctx) && ctx.regOf(name) === reg) ctx.emit(['Revive', reg]);
  }

  compileDestructureAssign(d, ctx) {
    const rRhs = this.compileExpr(d.value, ctx);
    if (d.pattern.k === 'NamedTuple') {
      ctx.emit(['RequireDict', rRhs]);
      for (const [field, varName] of d.pattern._[0]) {
        const fieldIdx = this.internString(field);
        const [dst, slot] = this.bindingTarget(varName, ctx);
        ctx.emit(['NamedTupleGet', dst, rRhs, fieldIdx]);
        this.finishBinding(varName, dst, slot, ctx);
      }
      return;
    }
    const items = d.pattern._[0];
    const wantsTuple = d.pattern.k === 'Positional';
    ctx.emit(['DestructureCheck', rRhs, wantsTuple]);
    const restAt = items.findIndex(i => i !== 'Ignore' && i.k === 'Rest');
    const trailing = restAt < 0 ? 0 : items.length - restAt - 1;
    let idx = 0;
    items.forEach((item, pos) => {
      const absorbs = restAt < 0 && pos + 1 === items.length;
      const afterRest = restAt >= 0 && pos > restAt;
      if (item === 'Ignore') { idx++; return; }
      const name = item._[0];
      if (item.k === 'Bind') {
        const [dst, slot] = this.bindingTarget(name, ctx);
        if (absorbs) ctx.emit(['DestructureAbsorb', dst, rRhs, idx + 1]);
        else if (afterRest) {
          // DM-24: the trailing names get their share only if the elements reach.
          ctx.emit(['DestructureTail', dst, rRhs, items.length - pos, restAt + 1, trailing]);
        } else {
          const rIdx = ctx.allocTemp();
          ctx.emit(['LoadInt', rIdx, idx + 1]);
          ctx.emit(['ArrayGet', dst, rRhs, rIdx]);
        }
        this.finishBinding(name, dst, slot, ctx);
        idx++;
      } else {
        const [dst, slot] = this.bindingTarget(name, ctx);
        ctx.emit(['DestructureRest', dst, rRhs, idx + 1, trailing]);
        this.finishBinding(name, dst, slot, ctx);
        idx++;
      }
    });
  }

  compileOutput(output, ctx) {
    for (const e of output.exprs) {
      // `¶` as a literal inside the list.
      if (e.k === 'Literal' && e.value.t === 'String' && e.value.v === '\n') { ctx.emit(['PrintNewline']); continue; }
      const reg = this.compileExpr(e, ctx);
      ctx.emit(['Print', reg]);
    }
  }

  compileIf(s, ctx) {
    const endPatches = [];
    const condReg = this.compileExpr(s.condition, ctx);
    const skipThen = ctx.emitJumpCondPlaceholder(condReg);
    let saved = ctx.saveScope();
    this.compileBlock(s.then_block, ctx);
    ctx.zeroNewVars(saved);
    endPatches.push(ctx.emitJumpPlaceholder());
    ctx.patchJump(skipThen, ctx.currentLabel());

    for (const elif of s.else_if_branches) {
      const c = this.compileExpr(elif.condition, ctx);
      const skip = ctx.emitJumpCondPlaceholder(c);
      saved = ctx.saveScope();
      this.compileBlock(elif.block, ctx);
      ctx.zeroNewVars(saved);
      endPatches.push(ctx.emitJumpPlaceholder());
      ctx.patchJump(skip, ctx.currentLabel());
    }
    if (s.else_block) {
      saved = ctx.saveScope();
      this.compileBlock(s.else_block, ctx);
      ctx.zeroNewVars(saved);
    }
    const end = ctx.currentLabel();
    for (const pos of endPatches) ctx.patchJump(pos, end);
  }

  compileLoop(lp, ctx) {
    // `@ (k, v):x { … }` is `@ __zy_par:x { (k, v) = __zy_par; … }`.
    if (lp.iterator_pattern) {
      const tmp = '__zy_par';
      const span = lp.span;
      const body = { ...lp.body, statements: [
        { k: 'DestructureAssign', pattern: lp.iterator_pattern, value: { k: 'Identifier', name: tmp, hot: false, pre_hot: false }, span },
        ...lp.body.statements,
      ] };
      const desugared = { k: 'Loop', condition: null, iterator_var: tmp, iterator_pattern: null, iterable: lp.iterable, body, label: lp.label, span };
      return this.compileForeachLoop(desugared, ctx);
    }
    if (lp.iterator_var != null) {
      const isRange = lp.iterable && unwrapGroup(lp.iterable).k === 'Range';
      return isRange ? this.compileRangeLoop(lp, ctx) : this.compileForeachLoop(lp, ctx);
    }
    if (lp.condition) {
      const cond = unwrapGroup(lp.condition);
      if (cond.k === 'Literal' && cond.value.t === 'Int') return this.compileTimesLoop(lp, ctx);
      if (exprIsAlwaysBool(cond)) return this.compileWhileLoop(lp, ctx);
      return this.compileAdaptiveLoop(lp, ctx);
    }
    return this.compileInfiniteLoop(lp, ctx);
  }

  compileTimesLoop(lp, ctx) {
    const c = lp.condition && unwrapGroup(lp.condition);
    const n = c && c.k === 'Literal' && c.value.t === 'Int' ? c.value.v : 0;
    if (n <= 0) return;
    const rI = ctx.allocTemp(), rEnd = ctx.allocTemp(), rFwd = ctx.allocTemp(), rOne = ctx.allocTemp();
    ctx.emit(['LoadInt', rI, 0]);
    ctx.emit(['LoadInt', rEnd, n - 1]);
    ctx.emit(['LoadInt', rOne, 1]);
    ctx.emit(['LoadBool', rFwd, true]);
    const preLoopHot = new Set(ctx.hotVars);
    const bodyLabel = ctx.currentLabel();
    ctx.loopStack.push(new LoopCtx(lp.label, ctx.tryStack.length));
    this.compileBlock(lp.body, ctx);
    const incLabel = ctx.currentLabel();
    ctx.emit(['RangeStep', rI, rEnd, rOne, rFwd, bodyLabel]);
    const loopEnd = ctx.currentLabel();
    const l = ctx.loopStack.pop();
    for (const p of l.breakPatches) ctx.patchJump(p, loopEnd);
    for (const p of l.continuePatches) ctx.patchJump(p, incLabel);
    ctx.resetPostfixHotAfterLoop(preLoopHot);
  }

  /** `@ <expr>` whose specifier's type is known only when it runs (GLB-135). */
  compileAdaptiveLoop(lp, ctx) {
    const condExpr = lp.condition;
    const rFirst = this.compileExpr(condExpr, ctx);
    const rN = ctx.allocTemp(), rIsTimes = ctx.allocTemp(), rI = ctx.allocTemp(), rCmp = ctx.allocTemp();
    const rZero = ctx.allocTemp(), rCondVal = ctx.allocTemp();
    ctx.emit(['CopyReg', rN, rFirst]);
    ctx.emit(['IsInt', rIsTimes, rN]);
    ctx.emit(['LoadInt', rI, 0]);
    ctx.emit(['LoadInt', rZero, 0]);

    const preLoopHot = new Set(ctx.hotVars);
    const loopStart = ctx.currentLabel();
    ctx.loopStack.push(new LoopCtx(lp.label, ctx.tryStack.length));

    const toWhile = ctx.emitJumpIfNotPlaceholder(rIsTimes);
    ctx.emit(['CmpGe', rCmp, rI, rN]);
    const exitTimes = ctx.emit(['JumpIf', rCmp, 0]);
    const toBody = ctx.emit(['Jump', 0]);

    const whileLabel = ctx.currentLabel();
    ctx.emit(['CmpEq', rCmp, rI, rZero]);
    const notFirst = ctx.emitJumpIfNotPlaceholder(rCmp);
    ctx.emit(['CopyReg', rCondVal, rN]);
    const toCheck = ctx.emit(['Jump', 0]);
    const evalLabel = ctx.currentLabel();
    const rCond = this.compileExpr(condExpr, ctx);
    ctx.emit(['CopyReg', rCondVal, rCond]);
    const checkLabel = ctx.currentLabel();
    ctx.patchJump(notFirst, evalLabel);
    ctx.patchJump(toCheck, checkLabel);
    const rChecked = ctx.allocTemp();
    ctx.emit(['AsLoopCond', rChecked, rCondVal]);
    const exitWhile = ctx.emit(['JumpIfNot', rChecked, 0]);

    const bodyLabel = ctx.currentLabel();
    this.compileBlock(lp.body, ctx);
    const incLabel = ctx.currentLabel();
    ctx.emit(['AddIntImm', rI, rI, 1]);
    ctx.emit(['Jump', loopStart]);

    const loopEnd = ctx.currentLabel();
    ctx.patchJump(toWhile, whileLabel);
    ctx.patchJump(toBody, bodyLabel);
    ctx.patchJump(exitTimes, loopEnd);
    ctx.patchJump(exitWhile, loopEnd);
    const l = ctx.loopStack.pop();
    for (const p of l.breakPatches) ctx.patchJump(p, loopEnd);
    for (const p of l.continuePatches) ctx.patchJump(p, incLabel);
    ctx.resetPostfixHotAfterLoop(preLoopHot);
  }

  compileInfiniteLoop(lp, ctx) {
    const preLoopHot = new Set(ctx.hotVars);
    const loopStart = ctx.currentLabel();
    ctx.loopStack.push(new LoopCtx(lp.label, ctx.tryStack.length));
    this.compileBlock(lp.body, ctx);
    ctx.emit(['Jump', loopStart]);
    const loopEnd = ctx.currentLabel();
    const l = ctx.loopStack.pop();
    for (const p of l.breakPatches) ctx.patchJump(p, loopEnd);
    for (const p of l.continuePatches) ctx.patchJump(p, loopStart);
    ctx.resetPostfixHotAfterLoop(preLoopHot);
  }

  compileWhileLoop(lp, ctx) {
    const preLoopHot = new Set(ctx.hotVars);
    const loopStart = ctx.currentLabel();
    ctx.loopStack.push(new LoopCtx(lp.label, ctx.tryStack.length));
    const condReg = this.compileExpr(lp.condition, ctx);
    const skipBody = ctx.emitJumpIfNotPlaceholder(condReg);
    this.compileBlock(lp.body, ctx);
    ctx.emit(['Jump', loopStart]);
    const loopEnd = ctx.currentLabel();
    ctx.patchJump(skipBody, loopEnd);
    const l = ctx.loopStack.pop();
    for (const p of l.breakPatches) ctx.patchJump(p, loopEnd);
    for (const p of l.continuePatches) ctx.patchJump(p, loopStart);
    ctx.resetPostfixHotAfterLoop(preLoopHot);
  }

  compileRangeLoop(lp, ctx) {
    const iterVar = lp.iterator_var;
    const range = unwrapGroup(lp.iterable);
    if (range.k !== 'Range') throw err('Unsupported', 'array for-each loop — VM Fase 4C');
    // L24/MM-11: a hidden counter, copied into the named variable each pass.
    const [rI, iSlot] = this.bindingTarget(iterVar, ctx);
    const rCnt = ctx.allocTemp(), rEnd = ctx.allocTemp(), rStep = ctx.allocTemp(), rFwd = ctx.allocTemp();
    const rStartTmp = this.compileExpr(range.start, ctx);
    ctx.emit(['CopyReg', rCnt, rStartTmp]);
    const rEndTmp = this.compileExpr(range.end, ctx);
    ctx.emit(['CopyReg', rEnd, rEndTmp]);
    if (range.step) {
      const rStepTmp = this.compileExpr(range.step, ctx);
      ctx.emit(['CopyReg', rStep, rStepTmp]);
      const s = unwrapGroup(range.step);
      const literalPositive = s.k === 'Literal' && s.value.t === 'Int' && s.value.v > 0;
      if (!literalPositive) ctx.emit(['LoopStepCheck', rStep]);
    } else {
      ctx.emit(['LoadInt', rStep, 1]);
    }
    // GLB-014 B: a bound that is not an Int would count in Floats.
    if (ctx.getRegType(rStartTmp) !== T.Int || ctx.getRegType(rEndTmp) !== T.Int) {
      ctx.emit(['LoopBoundsCheck', rCnt, rEnd]);
    }
    ctx.emit(['CmpLe', rFwd, rCnt, rEnd]);
    const preLoopHot = new Set(ctx.hotVars);
    const bodyLabel = ctx.currentLabel();
    ctx.loopStack.push(new LoopCtx(lp.label, ctx.tryStack.length));
    ctx.emit(['CopyReg', rI, rCnt]);
    this.finishBinding(iterVar, rI, iSlot, ctx);
    this.compileBlock(lp.body, ctx);
    const incLabel = ctx.currentLabel();
    ctx.emit(['RangeStep', rCnt, rEnd, rStep, rFwd, bodyLabel]);
    const loopEnd = ctx.currentLabel();
    const l = ctx.loopStack.pop();
    for (const p of l.breakPatches) ctx.patchJump(p, loopEnd);
    for (const p of l.continuePatches) ctx.patchJump(p, incLabel);
    ctx.resetPostfixHotAfterLoop(preLoopHot);
  }

  compileBreak(b, ctx) {
    if (ctx.loopStack.length === 0) throw err('BreakOutsideLoop');
    const target = Compiler.loopTarget(ctx, b.label, 'break');
    this.emitTryExits(ctx, ctx.loopStack[target].tryDepth);
    const pos = ctx.emitJumpPlaceholder();
    ctx.loopStack[target].breakPatches.push(pos);
  }

  compileContinue(c, ctx) {
    if (ctx.loopStack.length === 0) throw err('ContinueOutsideLoop');
    const target = Compiler.loopTarget(ctx, c.label, 'continue');
    this.emitTryExits(ctx, ctx.loopStack[target].tryDepth);
    const pos = ctx.emitJumpPlaceholder();
    ctx.loopStack[target].continuePatches.push(pos);
  }

  /** The innermost loop with the label, or the innermost one. */
  static loopTarget(ctx, label, what) {
    if (label == null) return ctx.loopStack.length - 1;
    for (let i = ctx.loopStack.length - 1; i >= 0; i--) if (ctx.loopStack[i].label === label) return i;
    throw err('Unsupported', `${what} label '${label}' not found`);
  }

  // ── Expression compilation ─────────────────────────────────────────────────

  /** Compile an expression; the register that holds its value. */
  compileExpr(e, ctx) {
    switch (e.k) {
      case 'Group': return this.compileExpr(e.expr, ctx);
      case 'Literal': return this.compileLiteral(e, ctx);
      case 'Identifier': return this.compileIdentifier(e, ctx);
      case 'Binary': return this.compileBinary(e, ctx);
      case 'Unary': return this.compileUnary(e, ctx);
      case 'FunctionCall': return this.compileCall(e, ctx);
      case 'Range': throw err('Unsupported', 'range outside loop');
      case 'ArrayLiteral': return this.compileArrayLiteral(e, ctx);
      case 'Tuple': return this.compileTuple(e, ctx);
      case 'NamedTuple': return this.compileNamedTuple(e, ctx);
      case 'Index': return this.compileIndex(e, ctx);
      case 'MemberAccess': return this.compileMemberAccess(e, ctx);
      case 'Match': return this.compileMatchExpr(e, ctx);
      case 'CollectionLength': return this.compileCollectionLength(e, ctx);
      case 'CollectionAppend': return this.compileCollectionAppend(e, ctx);
      case 'CollectionInsert': return this.compileCollectionInsert(e, ctx);
      case 'CollectionRemoveValue': return this.compileCollectionRemoveValue(e, ctx);
      case 'CollectionRemoveAll': return this.compileCollectionRemoveAll(e, ctx);
      case 'CollectionRemoveAt': return this.compileCollectionRemove(e, ctx);
      case 'CollectionRemoveRange': return this.compileCollectionRemoveRange(e, ctx);
      case 'CollectionFindAll': {
        const rColl = this.compileExpr(e.collection, ctx);
        const rVal = this.compileExpr(e.value, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['StrFindPos', dst, rColl, rVal]);
        ctx.setRegType(dst, T.Unknown);
        return dst;
      }
      case 'CollectionContains': return this.compileCollectionContains(e, ctx);
      case 'CollectionUpdate': return this.compileCollectionUpdate(e, ctx);
      case 'CollectionSlice': return this.compileCollectionSlice(e, ctx);
      case 'CollectionMap': return this.compileCollectionMap(e, ctx);
      case 'CollectionFilter': return this.compileCollectionFilter(e, ctx);
      case 'CollectionReduce': return this.compileCollectionReduce(e, ctx);
      case 'CollectionSortAsc': case 'CollectionSortDesc': case 'CollectionSortCustom':
        return this.compileCollectionSort(e, ctx);
      case 'Lambda': return this.compileLambda(e, ctx);
      case 'NumericEval': {
        const r = this.compileExpr(e.expr, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['NumericEval', dst, r]);
        return dst;
      }
      case 'TypeMetadata': {
        const r = this.compileExpr(e.expr, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['TypeOf', dst, r]);
        return dst;
      }
      case 'BaseConversion': {
        const r = this.compileExpr(e.expr, ctx);
        const dst = ctx.allocTemp();
        const radix = { Binary: 2, Octal: 8, Decimal: 10, Hex: 16 }[e.prefix];
        ctx.emit(['BaseConvert', dst, r, radix]);
        return dst;
      }
      case 'BashExec': return this.compileBashExec(e, ctx);
      case 'Format': return this.compileFormat(e, ctx);
      case 'Round': case 'Trunc': {
        const src = this.compileExpr(e.expr, ctx);
        const dst = ctx.allocTemp();
        ctx.setRegType(dst, T.Float);
        const name = e.k === 'Round' ? 'RoundFloat' : 'TruncFloat';
        if (e.precision.k === 'Literal') ctx.emit([name, dst, src, e.precision._[0]]);
        else {
          const pr = this.compileExpr(e.precision._[0], ctx);
          ctx.emit([`${name}Dyn`, dst, src, pr]);
        }
        return dst;
      }
      case 'ErrorConstruct': {
        const msg = this.compileExpr(e.message, ctx);
        const kind = this.internString(e.kind);
        const dst = ctx.allocTemp();
        ctx.emit(['MakeError', dst, kind, msg]);
        return dst;
      }
      case 'ErrorCheck': {
        const src = this.compileExpr(e.expr, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['IsError', dst, src]);
        return dst;
      }
      case 'ErrorPropagate': {
        const rVal = this.compileExpr(e.expr, ctx);
        if (ctx.inFinally()) return rVal;
        const rIsErr = ctx.allocTemp();
        ctx.emit(['IsError', rIsErr, rVal]);
        const skip = ctx.emitJumpIfNotPlaceholder(rIsErr);
        if (ctx.tryStack.length !== 0) this.emitTryExits(ctx, 0);
        ctx.emit(['Return', rVal]);
        ctx.patchJump(skip, ctx.currentLabel());
        return rVal;
      }
      case 'Pipe': {
        const rVal = this.compileExpr(e.left, ctx);
        const rFn = this.compileExpr(e.callable, ctx);
        ctx.emit(['CallableCheck', rFn, true]);
        const argRegs = e.arguments.map(a => (a === 'Placeholder' ? rVal : this.compileExpr(a._[0], ctx)));
        const dst = ctx.allocTemp();
        ctx.emit(['CallDynamic', dst, rFn, argRegs]);
        return dst;
      }
      case 'Execute': {
        // GLB-017 I: resolved from the file the `</` is written in.
        const base = this.curDir ?? this.baseDir;
        const absPath = isAbsolutePath(e.path) ? e.path : base != null ? joinPath(base, e.path) : e.path;
        const parts = [{ Lit: this.internString(absPath) }];
        for (const a of e.args) parts.push({ Lit: this.internString(a) });
        const dst = ctx.allocTemp();
        ctx.emit(['Execute', dst, parts]);
        ctx.setRegType(dst, T.String);
        return dst;
      }
      case 'StringRepeat': {
        const rStr = this.compileExpr(e.string, ctx);
        const rN = this.compileExpr(e.count, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['StrRepeat', dst, rStr, rN]);
        ctx.setRegType(dst, T.String);
        return dst;
      }
      case 'StringReplace': {
        const rStr = this.compileExpr(e.string, ctx);
        const rPat = this.compileExpr(e.pattern, ctx);
        const rRep = this.compileExpr(e.replacement, ctx);
        const dst = ctx.allocTemp();
        if (e.count) {
          const rN = this.compileExpr(e.count, ctx);
          ctx.emit(['StrReplaceN', dst, rStr, rPat, rRep, rN]);
        } else {
          ctx.emit(['StrReplace', dst, rStr, rPat, rRep]);
        }
        ctx.setRegType(dst, T.String);
        return dst;
      }
      case 'StringSplit': {
        const rStr = this.compileExpr(e.string, ctx);
        const rDel = this.compileExpr(e.delimiter, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['StrSplit', dst, rStr, rDel]);
        return dst;
      }
      case 'ConcatBuild': {
        const rBase = this.compileExpr(e.base, ctx);
        const itemRegs = e.items.map(it => this.compileExpr(it, ctx));
        const dst = ctx.allocTemp();
        ctx.emit(['ConcatBuild', dst, rBase, itemRegs]);
        return dst;
      }
      case 'NumericCast': {
        const rSrc = this.compileExpr(e.expr, ctx);
        const dst = ctx.allocTemp();
        switch (e.kind) {
          case 'ToFloat': ctx.emit(['IntToFloat', dst, rSrc]); ctx.setRegType(dst, T.Float); break;
          case 'ToIntRound': ctx.emit(['FloatToIntRound', dst, rSrc]); ctx.setRegType(dst, T.Int); break;
          case 'ToIntTrunc': ctx.emit(['FloatToIntTrunc', dst, rSrc]); ctx.setRegType(dst, T.Int); break;
          case 'ToChar': ctx.emit(['IntToChar', dst, rSrc]); ctx.setRegType(dst, T.Char); break;
        }
        return dst;
      }
      case 'DeepIndex': {
        const rArr = this.compileExpr(e.array, ctx);
        return this.compileNavPath(rArr, e.path, ctx);
      }
      case 'FlatExtract': {
        const rArr = this.compileExpr(e.array, ctx);
        const rResult = ctx.allocTemp();
        ctx.emit(['NewArray', rResult]);
        for (const p of e.paths) this.compileNavPathCollect(rArr, p.steps, rResult, ctx);
        return rResult;
      }
      case 'StructuredExtract': {
        const rArr = this.compileExpr(e.array, ctx);
        const rOuter = ctx.allocTemp();
        ctx.emit(['NewArray', rOuter]);
        for (const g of e.groups) {
          const rInner = ctx.allocTemp();
          ctx.emit(['NewArray', rInner]);
          for (const p of g.paths) this.compileNavPathCollect(rArr, p.steps, rInner, ctx);
          ctx.emit(['ArrayPush', rOuter, rInner]);
        }
        return rOuter;
      }
      case 'TerminalSize': {
        const dst = ctx.allocTemp();
        ctx.emit(['QueryTerminalSize', dst]);
        return dst;
      }
    }
    throw new Error(`compiler: expression ${e.k}`);
  }

  compileIdentifier(id, ctx) {
    const r = ctx.regOf(id.name);
    if (r !== undefined) {
      if (this.destroyedLocally(id.name, ctx)) ctx.emit(['CheckAlive', r, this.internString(id.name)]);
      // ZYVM-015: written through `<~` later in this statement — take its value now.
      if (ctx.pinned.has(id.name)) {
        const ty = ctx.getRegType(r);
        const tmp = ctx.allocTemp();
        ctx.emit(['CopyReg', tmp, r]);
        if (ty !== T.Unknown) ctx.setRegType(tmp, ty);
        return tmp;
      }
      return r;
    }
    if (id.hot || id.pre_hot) {
      const dst = ctx.allocReg(id.name);
      ctx.emit(['HotInit', dst, 'Int']);
      ctx.hotVars.add(id.name);
      if (id.hot) ctx.postfixHotVars.add(id.name);
      return dst;
    }
    const mc = this.globalConsts.get(id.name);
    if (mc) return this.emitModuleConst(mc, ctx);
    if (this.globalVarMap.has(id.name)) {
      const g = this.globalVarMap.get(id.name);
      const dst = ctx.allocTemp();
      ctx.emit(['LoadGlobal', dst, g]);
      ctx.stateTemps.push([g, dst]);
      return dst;
    }
    if (this.fileVarMap.has(id.name)) {
      const dst = ctx.allocTemp();
      ctx.emit(['LoadGlobal', dst, this.fileVarMap.get(id.name)]);
      return dst;
    }
    // A named function as a value (BUG-ZYB-005: module_scope too).
    if (this.functionIndex.has(id.name) || this.moduleScope.has(id.name)) {
      const source = this.fnSource.get(id.name);
      if (source) {
        const [params, stmts] = source;
        const locals = new Set(params);
        const seen = new Set();
        const free = [];
        collectFreeInStmts(stmts, locals, ctx, seen, free);
        if (free.length) {
          const newIdx = this.compileNamedFnAsClosure(id.name, params, stmts, free);
          const captured = free.map(v => ctx.getReg(v));
          const dst = ctx.allocTemp();
          ctx.emit(['MakeClosure', dst, newIdx, captured]);
          return dst;
        }
      }
      const funcIdx = this.functionIndex.has(id.name) ? this.functionIndex.get(id.name) : this.moduleScope.get(id.name);
      const dst = ctx.allocTemp();
      ctx.emit(['MakeFunc', dst, funcIdx]);
      return dst;
    }
    if (this.inFunctionBody) {
      const idx = this.internString(`'${id.name}' is undefined — did you mean '${id.name}°' (hot definition)?`);
      const dst = ctx.allocTemp();
      ctx.emit(['RaiseError', idx]);
      return dst;
    }
    throw err('UndefinedVariable', id.name);
  }

  // ── Nav-index helpers ──────────────────────────────────────────────────────

  /** A scalar nav path: a chain of ArrayGet, each step checked. */
  compileNavPath(rBase, path, ctx) {
    let current = rBase;
    for (const step of path.steps) {
      const rIdx = this.compileExpr(step.index, ctx);
      ctx.emit(['NavStepCheck', current, rIdx]);
      const dst = ctx.allocTemp();
      ctx.emit(['ArrayGet', dst, current, rIdx]);
      current = dst;
    }
    return current;
  }

  /** A nav path whose values are pushed into `rCollect`; a range step loops (D3). */
  compileNavPathCollect(rBase, steps, rCollect, ctx) {
    const k = steps.findIndex(s => s.range_end != null);
    if (k < 0) {
      let current = rBase;
      for (const step of steps) {
        const rIdx = this.compileExpr(step.index, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['ArrayGet', dst, current, rIdx]);
        current = dst;
      }
      ctx.emit(['ArrayPush', rCollect, current]);
      return;
    }
    let rMid = rBase;
    for (const step of steps.slice(0, k)) {
      const rIdx = this.compileExpr(step.index, ctx);
      const dst = ctx.allocTemp();
      ctx.emit(['ArrayGet', dst, rMid, rIdx]);
      rMid = dst;
    }
    const rangeStep = steps[k];
    const rStartTmp = this.compileExpr(rangeStep.index, ctx);
    const rEndTmp = this.compileExpr(rangeStep.range_end, ctx);
    const [rI, rEnd] = ctx.allocTempPair();
    const rCmp = ctx.allocTemp(), rStep = ctx.allocTemp(), rZero = ctx.allocTemp(), rDiff = ctx.allocTemp();
    ctx.emit(['CopyReg', rI, rStartTmp]);
    ctx.emit(['CopyReg', rEnd, rEndTmp]);
    ctx.emit(['NavRangeCheck', rI]);
    ctx.emit(['LoadInt', rZero, 0]);
    ctx.emit(['LoadInt', rStep, 1]);
    ctx.emit(['CmpGt', rCmp, rI, rEnd]);
    const ascPatch = ctx.emitJumpIfNotPlaceholder(rCmp);
    ctx.emit(['LoadInt', rStep, -1]);
    ctx.patchJump(ascPatch, ctx.currentLabel());
    const loopStart = ctx.currentLabel();
    ctx.emit(['SubInt', rDiff, rI, rEnd]);
    ctx.emit(['MulInt', rDiff, rDiff, rStep]);
    ctx.emit(['CmpGt', rCmp, rDiff, rZero]);
    const exitPatch = ctx.emit(['JumpIf', rCmp, 0]);
    const rElem = ctx.allocTemp();
    ctx.emit(['ArrayGet', rElem, rMid, rI]);
    this.compileNavPathCollect(rElem, steps.slice(k + 1), rCollect, ctx);
    ctx.emit(['AddInt', rI, rI, rStep]);
    ctx.emit(['Jump', loopStart]);
    ctx.patchJump(exitPatch, ctx.currentLabel());
  }

  compileLiteral(lit, ctx) {
    const dst = ctx.allocTemp();
    const v = lit.value;
    switch (v.t) {
      case 'Unit': ctx.emit(['LoadUnit', dst]); ctx.setRegType(dst, T.Unknown); break;
      case 'Int': ctx.emit(['LoadInt', dst, v.v]); ctx.setRegType(dst, T.Int); break;
      case 'Float': ctx.emit(['LoadFloat', dst, v.v]); ctx.setRegType(dst, T.Float); break;
      case 'Bool': ctx.emit(['LoadBool', dst, v.v]); ctx.setRegType(dst, T.Bool); break;
      case 'String': {
        ctx.emit(['LoadStr', dst, this.internString(unsentinel(v.v))]);
        ctx.setRegType(dst, T.String);
        break;
      }
      case 'InterpolatedString': {
        if (v.v.includes('{')) return this.compileInterpolatedString(v.v, ctx);
        ctx.emit(['LoadStr', dst, this.internString(unsentinel(v.v))]);
        ctx.setRegType(dst, T.String);
        break;
      }
      case 'Char': ctx.emit(['LoadChar', dst, v.v]); ctx.setRegType(dst, T.Char); break;
      default: throw new Error(`compiler: literal ${v.t}`);
    }
    return dst;
  }

  compileBinary(bin, ctx) {
    if (bin.op === 'And') return this.compileAnd(bin, ctx);
    if (bin.op === 'Or') return this.compileOr(bin, ctx);

    // IMM fast path: an i32 literal on the right, for the operators that have one (GLB-085).
    let leftDone;   // the left operand, when the fast path compiled it and gave up
    const immOp = ['Add', 'Sub', 'Mul', 'Div', 'Mod', 'Pow', 'Eq', 'Neq', 'Lt', 'Le', 'Gt', 'Ge'].includes(bin.op);
    const right = unwrapGroup(bin.right);
    if (immOp && right.k === 'Literal' && right.value.t === 'Int') {
      const imm = right.value.v;
      if (imm >= -2147483648 && imm <= 2147483647) {
        const rL = this.compileExpr(bin.left, ctx);
        const tyL = ctx.getRegType(rL);
        if (tyL !== T.Float && tyL !== T.String) {
          const dst = ctx.allocTemp();
          const IMM = { Add: ['AddIntImm', T.Int], Sub: ['SubIntImm', T.Int], Mul: ['MulIntImm', T.Int],
            Eq: ['CmpEqImm', T.Bool], Neq: ['CmpNeImm', T.Bool], Lt: ['CmpLtImm', T.Bool],
            Le: ['CmpLeImm', T.Bool], Gt: ['CmpGtImm', T.Bool], Ge: ['CmpGeImm', T.Bool] }[bin.op];
          if (IMM) {
            ctx.setRegType(dst, IMM[1]);
            ctx.emit([IMM[0], dst, rL, imm]);
            return dst;
          }
          ctx.emit(['LoadInt', dst, imm]);
          const dst2 = ctx.allocTemp();
          ctx.emit([{ Div: 'DivInt', Mod: 'ModInt', Pow: 'PowInt' }[bin.op], dst2, rL, dst]);
          return dst2;
        }
        // BUG-VMJS-005: Rust compiles the left operand a second time below.
        if (!this.opts.faithful) leftDone = rL;
      }
    }

    // GLB-002: a hot name on the left of a juxtaposition starts at "".
    let rL;
    if (leftDone !== undefined) rL = leftDone;
    else if (bin.op === 'Concat') {
      const id = unwrapGroup(bin.left);
      if (id.k === 'Identifier' && (id.hot || id.pre_hot) && ctx.regOf(id.name) === undefined) {
        rL = ctx.allocReg(id.name);
        ctx.emit(['HotInit', rL, 'String']);
        ctx.hotVars.add(id.name);
        if (id.hot) ctx.postfixHotVars.add(id.name);
      } else {
        rL = this.compileExpr(bin.left, ctx);
      }
    } else {
      rL = this.compileExpr(bin.left, ctx);
    }
    const rR = this.compileExpr(bin.right, ctx);
    const dst = ctx.allocTemp();
    const tyL = ctx.getRegType(rL), tyR = ctx.getRegType(rR);
    const isFloat = tyL === T.Float || tyR === T.Float;
    let ins;
    switch (bin.op) {
      case 'Concat': ctx.setRegType(dst, T.String); ins = ['ConcatStr', dst, rL, rR]; break;
      case 'Add':
        if (isFloat) { ctx.setRegType(dst, T.Float); ins = ['AddFloat', dst, rL, rR]; }
        else { ctx.setRegType(dst, T.Int); ins = ['AddInt', dst, rL, rR]; }
        break;
      case 'Sub': if (isFloat) { ctx.setRegType(dst, T.Float); ins = ['SubFloat', dst, rL, rR]; } else ins = ['SubInt', dst, rL, rR]; break;
      case 'Mul': if (isFloat) { ctx.setRegType(dst, T.Float); ins = ['MulFloat', dst, rL, rR]; } else ins = ['MulInt', dst, rL, rR]; break;
      // ZYVM-001: `/` never splits; `$/` does.
      case 'Div': if (isFloat) { ctx.setRegType(dst, T.Float); ins = ['DivFloat', dst, rL, rR]; } else ins = ['DivInt', dst, rL, rR]; break;
      case 'Mod': ins = ['ModInt', dst, rL, rR]; break;
      case 'Pow': if (isFloat) { ctx.setRegType(dst, T.Float); ins = ['PowFloat', dst, rL, rR]; } else ins = ['PowInt', dst, rL, rR]; break;
      case 'Eq': ins = ['CmpEq', dst, rL, rR]; break;
      case 'Neq': ins = ['CmpNe', dst, rL, rR]; break;
      case 'Lt': ins = ['CmpLt', dst, rL, rR]; break;
      case 'Le': ins = ['CmpLe', dst, rL, rR]; break;
      case 'Gt': ins = ['CmpGt', dst, rL, rR]; break;
      case 'Ge': ins = ['CmpGe', dst, rL, rR]; break;
      case 'Pipe': throw err('Unsupported', 'pipe (|>) — VM Fase 4C');
      case 'Comma': ins = ['ConcatStr', dst, rL, rR]; break;
      case 'Range': throw err('Unsupported', 'range (..) in expression — VM Fase 4C');
      default: throw new Error(`compiler: binary ${bin.op}`);
    }
    ctx.emit(ins);
    return dst;
  }

  compileAnd(bin, ctx) {
    const dst = ctx.allocTemp();
    const rL = this.compileExpr(bin.left, ctx);
    ctx.emit(['RequireBool', rL, true]);
    const skip = ctx.emitJumpIfNotPlaceholder(rL);
    const rR = this.compileExpr(bin.right, ctx);
    ctx.emit(['And', dst, rL, rR]);
    const endJump = ctx.emitJumpPlaceholder();
    ctx.patchJump(skip, ctx.currentLabel());
    ctx.emit(['LoadBool', dst, false]);
    ctx.patchJump(endJump, ctx.currentLabel());
    return dst;
  }

  compileOr(bin, ctx) {
    const dst = ctx.allocTemp();
    const rL = this.compileExpr(bin.left, ctx);
    ctx.emit(['RequireBool', rL, false]);
    const skip = ctx.emit(['JumpIf', rL, 0]);
    const rR = this.compileExpr(bin.right, ctx);
    ctx.emit(['Or', dst, rL, rR]);
    const endJump = ctx.emitJumpPlaceholder();
    ctx.patchJump(skip, ctx.currentLabel());
    ctx.emit(['LoadBool', dst, true]);
    ctx.patchJump(endJump, ctx.currentLabel());
    return dst;
  }

  compileUnary(un, ctx) {
    const r = this.compileExpr(un.operand, ctx);
    const dst = ctx.allocTemp();
    let ins;
    switch (un.op) {
      case 'Neg':
        if (ctx.getRegType(r) === T.Float) { ctx.setRegType(dst, T.Float); ins = ['NegFloat', dst, r]; }
        else ins = ['NegInt', dst, r];
        break;
      case 'Not': ins = ['Not', dst, r]; break;
      case 'Pos': {
        // GLB-019 B: a copy only when the operand is known to be a number.
        const ty = ctx.getRegType(r);
        if (ty === T.Int || ty === T.Float) {
          ctx.emit(['CopyReg', dst, r]);
          ctx.setRegType(dst, ty);
          return dst;
        }
        ins = ['Pos', dst, r];
        break;
      }
      default: throw new Error(`compiler: unary ${un.op}`);
    }
    ctx.emit(ins);
    return dst;
  }

  /** The expected count when `got` cannot satisfy it; a negative arity is variadic. */
  arityError(declared, got) {
    return declared !== undefined && declared >= 0 && declared !== got ? declared : null;
  }

  /** The tree-walker's arity error, raised at the call site (a backstop). */
  raiseArity(expected, got, native, ctx) {
    const msg = native ? `function expects ${expected} argument(s), got ${got}` : `function expects ${expected} arguments, got ${got}`;
    const idx = this.internString(msg);
    const dst = ctx.allocTemp();
    ctx.emit(['RaiseError', idx]);
    ctx.emit(['LoadUnit', dst]);
    return dst;
  }

  compileCall(call, ctx) {
    const callee = unwrapGroup(call.callable);
    // Builtins first (std/math, std/random, i18n re-exports).
    let builtinId;
    if (callee.k === 'MemberAccess') {
      const obj = unwrapGroup(callee.object);
      if (obj.k === 'Identifier') builtinId = this.builtinMap.get(`${obj.name}::${callee.field}`);
    }
    if (builtinId !== undefined) {
      const argRegs = call.arguments.map(a => this.compileExpr(a, ctx));
      const expected = this.arityError(this.builtinArity.get(builtinId), call.arguments.length);
      if (expected !== null) return this.raiseArity(expected, call.arguments.length, true, ctx);
      const dst = ctx.allocTemp();
      ctx.emit(['CallBuiltin', dst, builtinId, argRegs]);
      return dst;
    }

    let funcIdx;
    if (callee.k === 'Identifier') {
      funcIdx = this.functionIndex.has(callee.name) ? this.functionIndex.get(callee.name) : this.moduleScope.get(callee.name);
    } else if (callee.k === 'MemberAccess' && !Compiler.localHidesAlias(callee, ctx)) {
      const obj = unwrapGroup(callee.object);
      if (obj.k === 'Identifier') funcIdx = this.functionIndex.get(`${obj.name}::${callee.field}`);
    }

    if (funcIdx === undefined && callee.k === 'MemberAccess') {
      const obj = unwrapGroup(callee.object);
      if (obj.k === 'Identifier' && this.knownModuleAliases.has(obj.name) && !Compiler.localHidesAlias(callee, ctx)) {
        const idx = this.internString(`module '${obj.name}' does not export function '${callee.field}'`);
        for (const a of call.arguments) this.compileExpr(a, ctx);
        const dst = ctx.allocTemp();
        ctx.emit(['RaiseError', idx]);
        ctx.emit(['LoadUnit', dst]);
        return dst;
      }
    }

    // An output argument is the variable itself: not pinned.
    const argRegs = [];
    call.arguments.forEach((a, i) => {
      const id = unwrapGroup(a);
      let unpinned = null;
      if (id.k === 'Identifier' && call.out_args.includes(i) && ctx.pinned.delete(id.name)) unpinned = id.name;
      let r;
      try { r = this.compileExpr(a, ctx); }
      finally { if (unpinned !== null) ctx.pinned.add(unpinned); }
      argRegs.push(r);
    });
    const dst = ctx.allocTemp();

    if (funcIdx !== undefined) {
      const expected = this.arityError(this.funcArity.get(funcIdx), call.arguments.length);
      if (expected !== null) return this.raiseArity(expected, call.arguments.length, false, ctx);
      const outFlags = this.outputParamMap.get(funcIdx);
      if (outFlags) {
        const pairs = [];
        outFlags.forEach((isOut, i) => {
          if (isOut && i < call.arguments.length && unwrapGroup(call.arguments[i]).k === 'Identifier') pairs.push([i, argRegs[i]]);
        });
        if (pairs.length) ctx.emit(['SetupOutputWriteback', pairs.map(p => [...p])]);
        // ZYVM-014: an output argument that is module state is stored back.
        const toStore = [];
        for (const [i, reg] of pairs) {
          const id = unwrapGroup(call.arguments[i]);
          if (id.k === 'Identifier' && ctx.regOf(id.name) === undefined && this.globalVarMap.has(id.name)) {
            toStore.push([this.globalVarMap.get(id.name), reg]);
          }
        }
        ctx.emit(['Call', dst, funcIdx, argRegs]);
        for (const [g, reg] of toStore) ctx.emit(['StoreGlobal', g, reg]);
        return dst;
      }
      ctx.emit(['Call', dst, funcIdx, argRegs]);
    } else {
      const calleeReg = this.compileExpr(call.callable, ctx);
      // GLB-034: a name gets the check that can say it.
      if (callee.k === 'Identifier') ctx.emit(['CallableCheckNamed', calleeReg, this.internString(callee.name)]);
      else ctx.emit(['CallableCheck', calleeReg, false]);
      ctx.emit(['CallDynamic', dst, calleeReg, argRegs]);
    }
    return dst;
  }

  compileArrayLiteral(arr, ctx) {
    const dst = ctx.allocTemp();
    ctx.emit(['NewArray', dst]);
    for (const el of arr.elements) {
      const r = this.compileExpr(el, ctx);
      ctx.emit(['ArrayPush', dst, r]);
    }
    return dst;
  }

  // ── Module constant evaluation ─────────────────────────────────────────────

  /** A literal expression as a ModuleConst, or null. */
  static evalConstExpr(e) {
    switch (e.k) {
      case 'Literal': {
        const v = e.value;
        switch (v.t) {
          case 'Int': return { t: 'Int', v: v.v };
          case 'Float': return { t: 'Float', v: v.v };
          case 'String': case 'InterpolatedString': return { t: 'String', v: unsentinel(v.v) };
          case 'Bool': return { t: 'Bool', v: v.v };
          case 'Char': return { t: 'Char', v: v.v };
          case 'Unit': return { t: 'Unit' };
        }
        return null;
      }
      case 'Unary': {
        if (e.op !== 'Neg') return null;
        const lit = unwrapGroup(e.operand);
        if (lit.k !== 'Literal') return null;
        if (lit.value.t === 'Int') return { t: 'Int', v: -lit.value.v };
        if (lit.value.t === 'Float') return { t: 'Float', v: -lit.value.v };
        return null;
      }
      case 'Group': return Compiler.evalConstExpr(e.expr);
      case 'ArrayLiteral': case 'Tuple': {
        const items = [];
        for (const x of e.elements) { const c = Compiler.evalConstExpr(x); if (!c) return null; items.push(c); }
        return { t: e.k === 'ArrayLiteral' ? 'Array' : 'Tuple', v: items };
      }
      case 'NamedTuple': {
        const fields = [];
        for (const [k, x] of e.fields) { const c = Compiler.evalConstExpr(x); if (!c) return null; fields.push([k, c]); }
        return { t: 'Dict', v: fields };
      }
    }
    return null;
  }

  /** The instructions that rebuild a module constant in a fresh register. */
  emitModuleConst(mc, ctx) {
    const dst = ctx.allocTemp();
    switch (mc.t) {
      case 'Unit': ctx.emit(['LoadUnit', dst]); break;
      case 'Int': ctx.emit(['LoadInt', dst, mc.v]); break;
      case 'Float': ctx.setRegType(dst, T.Float); ctx.emit(['LoadFloat', dst, mc.v]); break;
      case 'String': ctx.setRegType(dst, T.String); ctx.emit(['LoadStr', dst, this.internString(mc.v)]); break;
      case 'Bool': ctx.setRegType(dst, T.Bool); ctx.emit(['LoadBool', dst, mc.v]); break;
      case 'Char': ctx.setRegType(dst, T.Char); ctx.emit(['LoadChar', dst, mc.v]); break;
      case 'Array':
        ctx.emit(['NewArray', dst]);
        for (const item of mc.v) { const r = this.emitModuleConst(item, ctx); ctx.emit(['ArrayPush', dst, r]); }
        break;
      case 'Tuple': {
        const regs = mc.v.map(item => this.emitModuleConst(item, ctx));
        ctx.emit(['MakeTuple', dst, regs]);
        break;
      }
      case 'Dict': {
        const names = [], regs = [];
        for (const [k, v] of mc.v) { names.push(this.internString(k)); regs.push(this.emitModuleConst(v, ctx)); }
        ctx.emit(['MakeNamedTuple', dst, names, regs]);
        break;
      }
    }
    return dst;
  }

  /** A module constant as a VM startup initializer (serde's GlobalInit). */
  static globalInitOf(mc) {
    switch (mc.t) {
      case 'Unit': return 'Unit';
      case 'Int': return { Int: mc.v };
      case 'Float': return { Float: mc.v };
      case 'Bool': return { Bool: mc.v };
      case 'Char': return { Char: mc.v };
      case 'String': return { Str: mc.v };
      case 'Array': return { Array: mc.v.map(Compiler.globalInitOf) };
      case 'Tuple': return { Tuple: mc.v.map(Compiler.globalInitOf) };
      case 'Dict': return { Dict: mc.v.map(([k, v]) => [k, Compiler.globalInitOf(v)]) };
    }
    throw new Error(`compiler: module constant ${mc.t}`);
  }

  // ── String pool ────────────────────────────────────────────────────────────

  internString(s) {
    const at = this.stringIndex.get(s);
    if (at !== undefined) return at;
    const idx = this.stringPool.length;
    this.stringPool.push(s);
    this.stringIndex.set(s, idx);
    return idx;
  }

  // ── Tuples, index, member access ───────────────────────────────────────────

  compileTuple(t, ctx) {
    const regs = t.elements.map(el => this.compileExpr(el, ctx));
    const dst = ctx.allocTemp();
    ctx.emit(['MakeTuple', dst, regs]);
    return dst;
  }

  compileNamedTuple(nt, ctx) {
    const names = [], regs = [];
    for (const [name, val] of nt.fields) {
      names.push(this.internString(name));
      regs.push(this.compileExpr(val, ctx));
    }
    const dst = ctx.allocTemp();
    ctx.emit(['MakeNamedTuple', dst, names, regs]);
    return dst;
  }

  compileIndex(ix, ctx) {
    const rArr = this.compileExpr(ix.array, ctx);
    const rIdx = this.compileExpr(ix.index, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(['ArrayGet', dst, rArr, rIdx]);
    return dst;
  }

  /** `m.x` where a function's variable `m` hides the import alias `m` (GLB-070). */
  static localHidesAlias(ma, ctx) {
    if (ma.is_module_access || ctx.name === '<main>') return false;
    const obj = unwrapGroup(ma.object);
    return obj.k === 'Identifier' && ctx.regOf(obj.name) !== undefined;
  }

  compileMemberAccess(ma, ctx) {
    const obj = unwrapGroup(ma.object);
    if (obj.k === 'Identifier') {
      if (Compiler.localHidesAlias(ma, ctx)) {
        const rObj = this.compileExpr(ma.object, ctx);
        const fieldIdx = this.internString(ma.field);
        const dst = ctx.allocTemp();
        ctx.emit(['NamedTupleGet', dst, rObj, fieldIdx]);
        return dst;
      }
      const mc = this.moduleConstants.get(`${obj.name}.${ma.field}`);
      if (mc) return this.emitModuleConst(mc, ctx);
      // A known alias with an unknown field: the tree-walker's words.
      if (this.knownModuleAliases.has(obj.name)) {
        const prefix = `${obj.name}.`;
        const available = [...this.moduleConstants.keys()].filter(k => k.startsWith(prefix)).map(k => k.slice(prefix.length));
        available.sort(byCodePoint);
        throw err('ModuleHasNoConstant', obj.name, ma.field, available.length ? available.join(', ') : 'none');
      }
    }
    const rObj = this.compileExpr(ma.object, ctx);
    const fieldIdx = this.internString(ma.field);
    const dst = ctx.allocTemp();
    ctx.emit(['NamedTupleGet', dst, rObj, fieldIdx]);
    return dst;
  }

  // ── Match ──────────────────────────────────────────────────────────────────

  compileMatchExpr(m, ctx) {
    // ZYVM-011: the no-match error is stamped with the statement that holds the `??`.
    const at = ctx.curSrc;
    const rSub = this.compileExpr(m.scrutinee, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(['LoadUnit', dst]);
    const endPatches = [];
    let hasWildcard = false;
    for (const c of m.cases) {
      if (c.pattern.k === 'Wildcard') {
        hasWildcard = true;
        // ZYVM-009: the value first, then the arm's block.
        if (c.value) { const r = this.compileExpr(c.value, ctx); ctx.emit(['CopyReg', dst, r]); }
        if (c.block) this.compileBlock(c.block, ctx);
        endPatches.push(ctx.emitJumpPlaceholder());
        break;
      }
      const [skipPatches, toBodyPatches] = this.emitPatternTest(c.pattern, rSub, ctx);
      const bodyLabel = ctx.currentLabel();
      for (const p of toBodyPatches) ctx.patchJump(p, bodyLabel);
      // `##Kind(m) =>`: the message goes into `m` as `m = …` would.
      if (c.pattern.k === 'ErrorKind' && c.pattern._[1] != null) {
        const rMsg = ctx.allocTemp();
        ctx.emit(['ErrorMessage', rMsg, rSub]);
        ctx.setRegType(rMsg, T.String);
        this.storeToName(c.pattern._[1], rMsg, ctx);
      }
      if (c.value) { const r = this.compileExpr(c.value, ctx); ctx.emit(['CopyReg', dst, r]); }
      if (c.block) this.compileBlock(c.block, ctx);
      endPatches.push(ctx.emitJumpPlaceholder());
      const next = ctx.currentLabel();
      for (const p of skipPatches) ctx.patchJump(p, next);
    }
    // GLB-016 / ZYVM-011 / GLB-106.
    ctx.curSrc = at;
    if (!hasWildcard) ctx.emit(['RaiseError', this.internString('no pattern matched in match expression')]);
    const end = ctx.currentLabel();
    for (const p of endPatches) ctx.patchJump(p, end);
    return dst;
  }

  /** Test a literal pattern value against `r`: the skip placeholder. */
  emitLiteralTest(lit, r, ctx) {
    switch (lit.t) {
      case 'Int': {
        const rCmp = ctx.allocTemp();
        this.emitIntEq(ctx, rCmp, r, lit.v);
        return ctx.emitJumpIfNotPlaceholder(rCmp);
      }
      case 'Float': {
        const rF = ctx.allocTemp();
        ctx.emit(['LoadFloat', rF, lit.v]);
        const rEq = ctx.allocTemp();
        ctx.emit(['CmpEq', rEq, r, rF]);
        return ctx.emitJumpIfNotPlaceholder(rEq);
      }
      case 'String': case 'InterpolatedString': {
        const idx = this.internString(unsentinel(lit.v));
        const bodyLabel = ctx.currentLabel() + 2;
        ctx.emit(['MatchStr', r, idx, bodyLabel]);
        return ctx.emitJumpPlaceholder();
      }
      case 'Bool': {
        const rCmp = ctx.allocTemp();
        ctx.emit(['LoadBool', rCmp, lit.v]);
        const rEq = ctx.allocTemp();
        ctx.emit(['CmpEq', rEq, r, rCmp]);
        return ctx.emitJumpIfNotPlaceholder(rEq);
      }
      case 'Char': {
        const rC = ctx.allocTemp();
        ctx.emit(['LoadChar', rC, lit.v]);
        const rEq = ctx.allocTemp();
        ctx.emit(['CmpEq', rEq, r, rC]);
        return ctx.emitJumpIfNotPlaceholder(rEq);
      }
    }
    return ctx.emitJumpPlaceholder();   // unsupported: always skip
  }

  /** The runtime test of one pattern; falling through means it matched. [skips, toBody]. */
  emitPatternTest(p, rSub, ctx) {
    const skips = [], toBody = [];
    switch (p.k) {
      case 'Wildcard': break;
      case 'ErrorKind': {
        const idx = this.internString(p._[0]);
        const rIs = ctx.allocTemp();
        ctx.emit(['ErrorKindIs', rIs, rSub, idx]);
        skips.push(ctx.emitJumpIfNotPlaceholder(rIs));
        break;
      }
      case 'Or': {
        const alts = p._[0];
        alts.forEach((alt, i) => {
          const [altSkips, altToBody] = this.emitPatternTest(alt, rSub, ctx);
          toBody.push(...altToBody);
          if (i + 1 < alts.length) {
            toBody.push(ctx.emitJumpPlaceholder());
            const next = ctx.currentLabel();
            for (const s of altSkips) ctx.patchJump(s, next);
          } else {
            skips.push(...altSkips);
          }
        });
        break;
      }
      case 'Literal': skips.push(this.emitLiteralTest(p._[0], rSub, ctx)); break;
      case 'Range': {
        const lo = unwrapGroup(p._[0]), hi = unwrapGroup(p._[1]);
        // ZYVM-032: a Char range.
        if (lo.k === 'Literal' && hi.k === 'Literal' && lo.value.t === 'Char' && hi.value.t === 'Char') {
          const bodyLabel = ctx.currentLabel() + 2;
          ctx.emit(['MatchCharRange', rSub, lo.value.v, hi.value.v, bodyLabel]);
          skips.push(ctx.emitJumpPlaceholder());
          return [skips, toBody];
        }
        if (lo.k !== 'Literal') throw err('Unsupported', 'dynamic range in match');
        if (lo.value.t !== 'Int') throw err('Unsupported', 'non-int range in match');
        if (hi.k !== 'Literal') throw err('Unsupported', 'dynamic range in match');
        if (hi.value.t !== 'Int') throw err('Unsupported', 'non-int range in match');
        const bodyLabel = ctx.currentLabel() + 2;
        ctx.emit(['MatchRange', rSub, lo.value.v, hi.value.v, bodyLabel]);
        skips.push(ctx.emitJumpPlaceholder());
        break;
      }
      case 'Comparison': {
        const [op, e] = p._;
        const rRhs = this.compileExpr(e, ctx);
        const rCmp = ctx.allocTemp();
        const CMP = { Lt: 'CmpLt', Gt: 'CmpGt', Le: 'CmpLe', Ge: 'CmpGe', Eq: 'CmpEq', Neq: 'CmpNe' }[op];
        if (!CMP) throw err('Unsupported', `unsupported op ${op} in comparison pattern`);
        ctx.emit([CMP, rCmp, rSub, rRhs]);
        skips.push(ctx.emitJumpIfNotPlaceholder(rCmp));
        break;
      }
      case 'Ident': {
        const rCmp = this.compileIdentPatternTest(p._[0], rSub, ctx);
        skips.push(ctx.emitJumpIfNotPlaceholder(rCmp));
        break;
      }
      case 'List': {
        const patterns = p._[0];
        const rIsArr = ctx.allocTemp();
        ctx.emit(['IsArray', rIsArr, rSub]);
        const patchToContain = ctx.emitJumpIfNotPlaceholder(rIsArr);

        // Structural path (the scrutinee is an array).
        const structSkips = [];
        const rLen = ctx.allocTemp();
        ctx.emit(['ArrayLen', rLen, rSub]);
        const rOk = ctx.allocTemp();
        ctx.emit(['CmpEqImm', rOk, rLen, patterns.length]);
        structSkips.push(ctx.emitJumpIfNotPlaceholder(rOk));
        patterns.forEach((sub, i) => {
          if (sub.k === 'Wildcard') return;
          const rIdx = ctx.allocTemp();
          ctx.emit(['LoadInt', rIdx, i + 1]);
          const rElem = ctx.allocTemp();
          ctx.emit(['ArrayGet', rElem, rSub, rIdx]);
          if (sub.k === 'Literal') {
            const lit = sub._[0];
            switch (lit.t) {
              case 'Int': {
                const rCmp = ctx.allocTemp();
                this.emitIntEq(ctx, rCmp, rElem, lit.v);
                structSkips.push(ctx.emitJumpIfNotPlaceholder(rCmp));
                break;
              }
              case 'Float': {
                const rF = ctx.allocTemp();
                ctx.emit(['LoadFloat', rF, lit.v]);
                const rCmp = ctx.allocTemp();
                ctx.emit(['CmpEq', rCmp, rElem, rF]);
                structSkips.push(ctx.emitJumpIfNotPlaceholder(rCmp));
                break;
              }
              case 'String': case 'InterpolatedString': {
                const idx = this.internString(unsentinel(lit.v));
                const bodyLbl = ctx.currentLabel() + 2;
                ctx.emit(['MatchStr', rElem, idx, bodyLbl]);
                structSkips.push(ctx.emitJumpPlaceholder());
                break;
              }
              case 'Bool': {
                const rB = ctx.allocTemp();
                ctx.emit(['LoadBool', rB, lit.v]);
                const rCmp = ctx.allocTemp();
                ctx.emit(['CmpEq', rCmp, rElem, rB]);
                structSkips.push(ctx.emitJumpIfNotPlaceholder(rCmp));
                break;
              }
              case 'Char': {
                const rC = ctx.allocTemp();
                ctx.emit(['LoadChar', rC, lit.v]);
                const rCmp = ctx.allocTemp();
                ctx.emit(['CmpEq', rCmp, rElem, rC]);
                structSkips.push(ctx.emitJumpIfNotPlaceholder(rCmp));
                break;
              }
            }
            return;
          }
          if (sub.k === 'Ident') {
            // DM-26: a name is compared; an undefined one fails when the arm is reached.
            try {
              const rCmp = this.compileIdentPatternTest(sub._[0], rElem, ctx);
              structSkips.push(ctx.emitJumpIfNotPlaceholder(rCmp));
            } catch (e) {
              if (!(e instanceof CompileError) || e.kind !== 'UndefinedVariable') throw e;
              ctx.emit(['RaiseError', this.internString(`undefined variable '${e.args[0]}' in match pattern`)]);
            }
            return;
          }
          // GLB-148: a range, comparison or list inside the list is tested on its element.
          const [subSkips, subToBody] = this.emitPatternTest(sub, rElem, ctx);
          structSkips.push(...subSkips);
          const nextElem = ctx.currentLabel();
          for (const q of subToBody) ctx.patchJump(q, nextElem);
        });
        const patchStructToBody = ctx.emitJumpPlaceholder();

        // Containment path (the scrutinee is a scalar).
        ctx.patchJump(patchToContain, ctx.currentLabel());
        const jumpToBody = [];
        for (const sub of patterns) {
          if (sub.k === 'Wildcard') { jumpToBody.push(ctx.emitJumpPlaceholder()); continue; }
          if (sub.k === 'Literal') {
            const lit = sub._[0];
            const rCmp = ctx.allocTemp();
            switch (lit.t) {
              case 'Int':
                this.emitIntEq(ctx, rCmp, rSub, lit.v);
                jumpToBody.push(ctx.emit(['JumpIf', rCmp, 0]));
                break;
              case 'Float': {
                const rF = ctx.allocTemp();
                ctx.emit(['LoadFloat', rF, lit.v]);
                ctx.emit(['CmpEq', rCmp, rSub, rF]);
                jumpToBody.push(ctx.emit(['JumpIf', rCmp, 0]));
                break;
              }
              case 'String': case 'InterpolatedString':
                jumpToBody.push(ctx.emit(['MatchStr', rSub, this.internString(unsentinel(lit.v)), 0]));
                break;
              case 'Bool': {
                const rB = ctx.allocTemp();
                ctx.emit(['LoadBool', rB, lit.v]);
                ctx.emit(['CmpEq', rCmp, rSub, rB]);
                jumpToBody.push(ctx.emit(['JumpIf', rCmp, 0]));
                break;
              }
              case 'Char': {
                const rC = ctx.allocTemp();
                ctx.emit(['LoadChar', rC, lit.v]);
                ctx.emit(['CmpEq', rCmp, rSub, rC]);
                jumpToBody.push(ctx.emit(['JumpIf', rCmp, 0]));
                break;
              }
            }
            continue;
          }
          if (sub.k === 'Ident') {
            try {
              const rCmp = this.compileIdentPatternTest(sub._[0], rSub, ctx);
              jumpToBody.push(ctx.emit(['JumpIf', rCmp, 0]));
            } catch (e) {
              if (!(e instanceof CompileError) || e.kind !== 'UndefinedVariable') throw e;
              ctx.emit(['RaiseError', this.internString(`undefined variable '${e.args[0]}' in match pattern`)]);
            }
            continue;
          }
          const [subSkips, subToBody] = this.emitPatternTest(sub, rSub, ctx);
          jumpToBody.push(...subToBody);
          jumpToBody.push(ctx.emitJumpPlaceholder());
          const nextElem = ctx.currentLabel();
          for (const q of subSkips) ctx.patchJump(q, nextElem);
        }
        const patchContainNoMatch = ctx.emitJumpPlaceholder();
        toBody.push(patchStructToBody, ...jumpToBody);
        skips.push(...structSkips, patchContainNoMatch);
        break;
      }
      default: throw new Error(`compiler: pattern ${p.k}`);
    }
    return [skips, toBody];
  }

  compileMatchStmt(m, ctx) { this.compileMatchExpr(m, ctx); }

  // ── Collection operations ──────────────────────────────────────────────────

  compileCollectionLength(cl, ctx) {
    // Fusion: (s $/ sep)$# → StrSplitCount.
    if (cl.collection.k === 'StringSplit') {
      const rStr = this.compileExpr(cl.collection.string, ctx);
      const rSep = this.compileExpr(cl.collection.delimiter, ctx);
      const dst = ctx.allocTemp();
      ctx.emit(['StrSplitCount', dst, rStr, rSep]);
      ctx.setRegType(dst, T.Int);
      return dst;
    }
    const r = this.compileExpr(cl.collection, ctx);
    const dst = ctx.allocTemp();
    ctx.emit([ctx.getRegType(r) === T.String ? 'StrLen' : 'ArrayLen', dst, r]);
    ctx.setRegType(dst, T.Int);
    return dst;
  }

  compileCollectionAppend(ca, ctx) {
    const rColl = this.compileExpr(ca.collection, ctx);
    const rElem = this.compileExpr(ca.element, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(['CopyReg', dst, rColl]);
    ctx.emit(['ArrayPush', dst, rElem]);
    return dst;
  }

  compileCollectionRemove(cr, ctx) {
    const rColl = this.compileExpr(cr.collection, ctx);
    const rIdx = this.compileExpr(cr.index, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(['CopyReg', dst, rColl]);
    ctx.emit(['ArrayRemove', dst, rIdx]);
    return dst;
  }

  compileCollectionContains(cc, ctx) {
    const rColl = this.compileExpr(cc.collection, ctx);
    const rElem = this.compileExpr(cc.element, ctx);
    const tyColl = ctx.getRegType(rColl);
    const dst = ctx.allocTemp();
    ctx.emit([tyColl === T.String ? 'StrContains' : 'ArrayContains', dst, rColl, rElem]);
    ctx.setRegType(dst, T.Bool);
    return dst;
  }

  /** An `Ident` pattern: a value compared (containment for an array), never a binding. */
  compileIdentPatternTest(name, rSub, ctx) {
    let rVar = ctx.regOf(name);
    if (rVar === undefined) {
      const mc = this.globalConsts.get(name);
      if (mc) rVar = this.emitModuleConst(mc, ctx);
      else if (this.globalVarMap.has(name)) {
        rVar = ctx.allocTemp();
        ctx.emit(['LoadGlobal', rVar, this.globalVarMap.get(name)]);
      } else {
        // GLB-125: whatever else the name is as an expression.
        try { rVar = this.compileExpr({ k: 'Identifier', name, hot: false, pre_hot: false }, ctx); }
        catch { throw err('UndefinedVariable', name); }
      }
    }
    const rIsArr = ctx.allocTemp();
    ctx.emit(['IsArray', rIsArr, rVar]);
    const patchToEq = ctx.emitJumpIfNotPlaceholder(rIsArr);
    const rCmp = ctx.allocTemp();
    ctx.emit(['ArrayContains', rCmp, rVar, rSub]);
    const patchArrSkip = ctx.emitJumpPlaceholder();
    ctx.patchJump(patchToEq, ctx.currentLabel());
    ctx.emit(['CmpEq', rCmp, rSub, rVar]);
    ctx.patchJump(patchArrSkip, ctx.currentLabel());
    return rCmp;
  }

  /** The operands `s = s x y` appends, each evaluated before the first append (ZYVM-023). */
  compileConcatParts(parts, recv, ctx) {
    const regs = [];
    for (const part of parts) {
      const r = this.compileExpr(part, ctx);
      if (r === recv) {
        const t = ctx.allocTemp();
        ctx.emit(['CopyReg', t, recv]);
        regs.push(t);
      } else {
        regs.push(r);
      }
    }
    return regs;
  }

  /** Clear this statement's loads of module state `g`, except the ones the edit reads. */
  static releaseStateTemps(g, keep, ctx) {
    const stale = ctx.stateTemps.filter(([slot, reg]) => slot === g && !keep.includes(reg)).map(([, reg]) => reg);
    for (const reg of stale) ctx.emit(['LoadUnit', reg]);
  }

  /** A bare `$~` expression: the functional update. */
  compileCollectionUpdate(cu, ctx) { return this.compileCollectionUpdateAs(cu, null, Receiver.Copy, ctx); }

  /** `$~`, told whether the source form was in place (`inPlace` = the name) and where it writes. */
  compileCollectionUpdateAs(cu, inPlace, receiver, ctx) {
    // ZYVM-013 / ZYVM-003: where the write lands.
    const land = root => {
      if (receiver.k === 'Copy') {
        const dst = ctx.allocTemp();
        ctx.emit(['CopyReg', dst, root]);
        return dst;
      }
      if (receiver.k === 'Own' && receiver.slot === null) return root;
      ctx.emit(['DetachGlobal', receiver.slot, root]);
      return root;
    };
    const target = inPlace != null ? this.internString(inPlace) : null;
    const deepSet = (dst, path, val) => (target !== null ? ['DeepSetInPlace', dst, path, val, target] : ['DeepSet', dst, path, val]);
    const setOne = (dst, step, val) => (target !== null ? ['SetOneInPlace', dst, step, val, target] : ['SetOne', dst, step, val]);
    const t = unwrapGroup(cu.target);
    switch (t.k) {
      case 'Index': {
        const rArr = this.compileExpr(t.array, ctx);
        const rIdx = this.compileExpr(t.index, ctx);
        const rVal = this.compileExpr(cu.value, ctx);
        if (receiver.k === 'State') Compiler.releaseStateTemps(receiver.slot, [rArr, rIdx, rVal], ctx);
        const dst = land(rArr);
        ctx.emit(setOne(dst, rIdx, rVal));
        return dst;
      }
      case 'DeepIndex': {
        // GLB-115: the root, then the steps, then the value.
        if (t.path.steps.some(s => s.range_end != null)) throw err('Unsupported', 'deep update ($~) does not support ranges in the path');
        const rRoot = this.compileExpr(t.array, ctx);
        const rPath = ctx.allocTemp();
        ctx.emit(['NewArray', rPath]);
        for (const step of t.path.steps) {
          const rI = this.compileExpr(step.index, ctx);
          ctx.emit(['ArrayPush', rPath, rI]);
        }
        const rVal = this.compileExpr(cu.value, ctx);
        if (receiver.k === 'State') Compiler.releaseStateTemps(receiver.slot, [rRoot, rPath, rVal], ctx);
        const dst = land(rRoot);
        ctx.emit(deepSet(dst, rPath, rVal));
        return dst;
      }
      case 'MemberAccess': {
        if (t.is_module_access) break;
        const rObj = this.compileExpr(t.object, ctx);
        const rKey = ctx.allocTemp();
        const keyIdx = this.internString(t.field);
        ctx.emit(['LoadStr', rKey, keyIdx]);
        const rVal = this.compileExpr(cu.value, ctx);
        if (receiver.k === 'State') Compiler.releaseStateTemps(receiver.slot, [rObj, rKey, rVal], ctx);
        const dst = land(rObj);
        ctx.emit(setOne(dst, rKey, rVal));
        return dst;
      }
    }
    throw err('Unsupported', 'collection update on non-index expr');
  }

  compileCollectionSlice(cs, ctx) {
    const rColl = this.compileExpr(cs.collection, ctx);
    const [rLo, rHi] = ctx.allocTempPair();
    if (cs.start) { const r = this.compileExpr(cs.start, ctx); ctx.emit(['CopyReg', rLo, r]); }
    else ctx.emit(['LoadInt', rLo, 1]);
    if (cs.end) { const r = this.compileExpr(cs.end, ctx); ctx.emit(['CopyReg', rHi, r]); }
    else ctx.emit([ctx.getRegType(rColl) === T.String ? 'StrLen' : 'ArrayLen', rHi, rColl]);
    const dst = ctx.allocTemp();
    if (ctx.getRegType(rColl) === T.String) {
      ctx.emit([cs.count_based ? 'StrSliceCount' : 'StrSlice', dst, rColl, rLo]);
      ctx.setRegType(dst, T.String);
    } else {
      ctx.emit([cs.count_based ? 'ArraySliceCount' : 'ArraySlice', dst, rColl, rLo]);
    }
    return dst;
  }

  compileCollectionInsert(ci, ctx) {
    const rColl = this.compileExpr(ci.collection, ctx);
    const rIdx = this.compileExpr(ci.index, ctx);
    const rElem = this.compileExpr(ci.element, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(['CopyReg', dst, rColl]);
    ctx.emit(['ArrayInsert', dst, rIdx, rElem]);
    return dst;
  }

  compileCollectionRemoveValue(cv, ctx) {
    const rColl = this.compileExpr(cv.collection, ctx);
    const rVal = this.compileExpr(cv.value, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(['CopyReg', dst, rColl]);
    ctx.emit(['ArrayRemoveValue', dst, rVal]);
    return dst;
  }

  compileCollectionRemoveAll(ca, ctx) {
    const rColl = this.compileExpr(ca.collection, ctx);
    const rVal = this.compileExpr(ca.value, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(['CopyReg', dst, rColl]);
    ctx.emit(['ArrayRemoveAll', dst, rVal]);
    return dst;
  }

  compileCollectionRemoveRange(cr, ctx) {
    const rColl = this.compileExpr(cr.collection, ctx);
    const [rLo, rHi] = ctx.allocTempPair();
    if (cr.start) { const r = this.compileExpr(cr.start, ctx); ctx.emit(['CopyReg', rLo, r]); }
    else ctx.emit(['LoadInt', rLo, 1]);
    if (cr.end) { const r = this.compileExpr(cr.end, ctx); ctx.emit(['CopyReg', rHi, r]); }
    else ctx.emit(['ArrayLen', rHi, rColl]);
    const dst = ctx.allocTemp();
    ctx.emit(['CopyReg', dst, rColl]);
    ctx.emit([cr.count_based && cr.end ? 'ArrayRemoveCount' : 'ArrayRemoveRange', dst, rLo]);
    return dst;
  }

  // ── Higher-order operators ─────────────────────────────────────────────────

  /** `(s $/ sep) $> f` and friends fuse into one instruction; the rest loop on HofNext. */
  compileStrSplitFused(name, coll, extra, lambda, ctx) {
    const rStr = this.compileExpr(coll.string, ctx);
    const rSep = this.compileExpr(coll.delimiter, ctx);
    const rExtra = extra ? this.compileExpr(extra, ctx) : null;
    const rFn = this.compileExpr(lambda, ctx);
    const dst = ctx.allocTemp();
    ctx.emit(rExtra === null ? [name, dst, rStr, rSep, rFn] : [name, dst, rStr, rSep, rExtra, rFn]);
    return dst;
  }

  compileCollectionMap(cm, ctx) {
    if (cm.collection.k === 'StringSplit') return this.compileStrSplitFused('StrSplitMap', cm.collection, null, cm.lambda, ctx);
    return this.compileHofLoop(0, cm.collection, null, cm.lambda, ctx);
  }

  compileCollectionFilter(cf, ctx) {
    if (cf.collection.k === 'StringSplit') return this.compileStrSplitFused('StrSplitFilter', cf.collection, null, cf.lambda, ctx);
    return this.compileHofLoop(1, cf.collection, null, cf.lambda, ctx);
  }

  compileCollectionReduce(cr, ctx) {
    if (cr.collection.k === 'StringSplit') return this.compileStrSplitFused('StrSplitReduce', cr.collection, cr.initial, cr.lambda, ctx);
    return this.compileHofLoop(2, cr.collection, cr.initial, cr.lambda, ctx);
  }

  /** `$>` (0), `$|` (1), `$<` (2) on the machine's own frames, one HofNext per element. */
  compileHofLoop(kind, collection, initial, lambda, ctx) {
    const rColl = this.compileExpr(collection, ctx);
    const rInit = initial ? this.compileExpr(initial, ctx) : null;
    const rFn = this.compileExpr(lambda, ctx);
    const rItems = ctx.allocTemp();
    ctx.emit(['HofItems', rItems, rColl, rFn, kind]);
    const rI = ctx.allocTemp();
    ctx.emit(['LoadInt', rI, 0]);
    const rOut = ctx.allocTemp();
    const rKeep = ctx.allocTemp();
    const rAcc = ctx.allocTemp();
    if (rInit !== null) ctx.emit(['CopyReg', rAcc, rInit]); else ctx.emit(['NewArray', rAcc]);
    ctx.emit(['HofNext', kind, rItems, rI, rAcc, rOut, rKeep, rFn]);
    ctx.emit(['LoadUnit', rOut]);
    ctx.emit(['LoadUnit', rKeep]);
    ctx.emit(['LoadUnit', rItems]);
    const dst = ctx.allocTemp();
    if (kind === 2) ctx.emit(['MoveReg', dst, rAcc]);
    else ctx.emit(['HofRebuild', dst, rColl, rAcc]);
    return dst;
  }

  compileCollectionSort(cs, ctx) {
    const rArr = this.compileExpr(cs.collection, ctx);
    const dst = ctx.allocTemp();
    const rFn = cs.comparator ? this.compileExpr(cs.comparator, ctx) : U16_MAX;
    ctx.emit(['ArraySort', dst, rArr, cs.ascending, rFn]);
    return dst;
  }

  // ── Lambdas with closure capture ───────────────────────────────────────────

  compileLambda(lam, ctx) {
    // ZYVM-021: module state is captured by value, as anything else.
    const stateNames = [...this.globalVarMap.keys()].filter(n => !ctx.params.has(n) && !ctx.registerMap.has(n) && !lam.params.includes(n));
    for (const n of stateNames) ctx.registerMap.set(n, U16_MAX);
    let freeVars;
    try { freeVars = collectFreeVars(lam.body, lam.params, ctx); }
    finally { for (const n of stateNames) ctx.registerMap.delete(n); }
    if (lam.body.k === 'Block') {
      const mentioned = mentionedNames(lam.body);
      for (const n of stateNames) if (mentioned.has(n) && !freeVars.includes(n)) freeVars.push(n);
    }

    const lambdaName = `<lambda#${this.functions.length}>`;
    const funcIdx = this.functions.length;
    this.functions.push(newChunk(lambdaName));
    this.functionIndex.set(lambdaName, funcIdx);

    const lctx = this.newCtx(lambdaName);
    if (lam.body.k === 'Block') destroyedNames(lam.body.statements, lctx.destroyable);
    for (const p of lam.params) { lctx.allocReg(p); lctx.params.add(p); }
    const numParams = lam.params.length;
    for (const fv of freeVars) {
      lctx.allocReg(fv);
      if (stateNames.includes(fv)) lctx.params.add(fv);
    }
    if (lam.body.k === 'Expr') {
      const r = this.compileExpr(lam.body._[0], lctx);
      lctx.emit(['Return', r]);
    } else {
      this.compileBlock(lam.body, lctx);
      const t = lctx.allocTemp();
      lctx.emit(['LoadUnit', t]);
      lctx.emit(['Return', t]);
    }
    this.functions[funcIdx] = lctx.intoChunk(numParams);

    const dst = ctx.allocTemp();
    if (freeVars.length === 0) {
      ctx.emit(['MakeLambda', dst, funcIdx]);
    } else {
      const captured = freeVars.map(v => {
        if (this.globalVarMap.has(v) && stateNames.includes(v)) {
          const r = ctx.allocTemp();
          ctx.emit(['LoadGlobal', r, this.globalVarMap.get(v)]);
          return r;
        }
        return ctx.getReg(v);
      });
      ctx.emit(['MakeClosure', dst, funcIdx, captured]);
    }
    return dst;
  }

  // ── String interpolation ───────────────────────────────────────────────────

  compileInterpolatedString(s, ctx) {
    const parts = this.interpolationParts(s, ctx);
    if (parts.length === 1 && 'Lit' in parts[0]) {
      const dst = ctx.allocTemp();
      ctx.emit(['LoadStr', dst, parts[0].Lit]);
      ctx.setRegType(dst, T.String);
      return dst;
    }
    const dst = ctx.allocTemp();
    ctx.emit(['BuildStr', dst, parts]);
    ctx.setRegType(dst, T.String);
    return dst;
  }

  /** `Lit` for the text as written, `Reg` for each `{var}`. */
  interpolationParts(s, ctx) {
    const parts = [];
    let lit = '';
    const chars = [...s];
    const flush = () => { if (lit) { parts.push({ Lit: this.internString(unsentinel(lit)) }); lit = ''; } };
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (c === '{') {
        if (chars[i + 1] === '{') { i++; lit += '{'; continue; }
        let name = '';
        i++;
        while (i < chars.length && chars[i] !== '}') name += chars[i++];
        flush();
        const r = ctx.regOf(name);
        if (r !== undefined) {
          if (this.destroyedLocally(name, ctx)) ctx.emit(['CheckAlive', r, this.internString(name)]);
          parts.push({ Reg: r });
        } else if (this.globalConsts.has(name)) {
          parts.push({ Reg: this.emitModuleConst(this.globalConsts.get(name), ctx) });
        } else if (this.globalVarMap.has(name)) {
          const t = ctx.allocTemp();
          ctx.emit(['LoadGlobal', t, this.globalVarMap.get(name)]);
          parts.push({ Reg: t });
        } else if (this.fileVarMap.has(name)) {
          const t = ctx.allocTemp();
          ctx.emit(['LoadGlobal', t, this.fileVarMap.get(name)]);
          parts.push({ Reg: t });
        } else if (this.functionIndex.has(name) || this.moduleScope.has(name)) {
          // GLB-018 H: a named function, read as the value `f` alone is.
          parts.push({ Reg: this.compileExpr({ k: 'Identifier', name, hot: false, pre_hot: false }, ctx) });
        } else if (this.inFunctionBody) {
          // GLB-025.
          ctx.emit(['RaiseError', this.internString(`'${name}' is undefined — did you mean '${name}°' (hot definition)?`)]);
          parts.push({ Lit: this.internString(`{${name}}`) });
        } else {
          parts.push({ Lit: this.internString(`{${name}}`) });
        }
      } else if (c === '}' && chars[i + 1] === '}') {
        i++;
        lit += '}';
      } else {
        lit += c;
      }
    }
    flush();
    return parts;
  }

  // ── For-each over collections ──────────────────────────────────────────────

  compileForeachLoop(lp, ctx) {
    const iterVar = lp.iterator_var;
    let rColl = this.compileExpr(lp.iterable, ctx);
    const collIsString = ctx.getRegType(rColl) === T.String;
    const rLen = ctx.allocTemp();
    const rIdx = ctx.allocTemp();
    const [rItem, itemSlot] = this.bindingTarget(iterVar, ctx);
    const rCmp = ctx.allocTemp();
    let rCursor = null;
    if (collIsString) {
      // ZYVM-024: over a register of the loop's own.
      const rSnap = ctx.allocTemp();
      ctx.emit(['CopyReg', rSnap, rColl]);
      rColl = rSnap;
      ctx.emit(['StrLen', rLen, rColl]);
      ctx.emit(['LoadInt', rIdx, 1]);
      rCursor = ctx.allocTemp();
      ctx.emit(['LoadInt', rCursor, 0]);
    } else {
      const rIter = ctx.allocTemp();
      ctx.emit([iterVar === '__zy_par' ? 'IterPairs' : 'StrChars', rIter, rColl]);
      rColl = rIter;
      ctx.emit(['ArrayLen', rLen, rColl]);
      ctx.emit(['LoadInt', rIdx, 1]);
    }
    const preLoopHot = new Set(ctx.hotVars);
    ctx.emit(['CmpGt', rCmp, rIdx, rLen]);
    const exitPatch = ctx.emit(['JumpIf', rCmp, 0]);
    const bodyLabel = ctx.currentLabel();
    ctx.loopStack.push(new LoopCtx(lp.label, ctx.tryStack.length));
    // ZYVM-025: the character at the cursor.
    if (collIsString) ctx.emit(['StrCharNext', rItem, rColl, rCursor]);
    else ctx.emit(['ArrayGet', rItem, rColl, rIdx]);
    this.finishBinding(iterVar, rItem, itemSlot, ctx);
    this.compileBlock(lp.body, ctx);
    const incLabel = ctx.currentLabel();
    ctx.emit(['IterStep', rIdx, rLen, bodyLabel]);
    const loopEnd = ctx.currentLabel();
    ctx.patchJump(exitPatch, loopEnd);
    const l = ctx.loopStack.pop();
    for (const p of l.breakPatches) ctx.patchJump(p, loopEnd);
    for (const p of l.continuePatches) ctx.patchJump(p, incLabel);
    ctx.resetPostfixHotAfterLoop(preLoopHot);
  }

  // ── Try / Catch / Finally (GLB-010) ────────────────────────────────────────

  /** What leaving every `!?` above `downTo` owes, innermost first (BUG-ZYB-010). */
  emitTryExits(ctx, downTo) {
    const n = ctx.tryStack.length;
    if (n <= downTo) return;
    const saved = ctx.tryStack;
    ctx.tryStack = [];
    try {
      for (let k = n - 1; k >= downTo; k--) {
        const t = saved[k].clone();
        if (t.region === TryRegion.Body) ctx.emit(['TryEnd', t.save]);
        else if (t.region === TryRegion.Catch) { if (t.guard !== null) ctx.emit(['TryEnd', t.guard]); }
        else {
          ctx.emit(['TryRethrow', t.save]);
          if (t.guard !== null) ctx.emit(['TryRethrow', t.guard]);
          continue;
        }
        if (t.finally) {
          ctx.tryStack = saved.slice(0, k).map(x => x.clone());
          ctx.tryStack.push(new TryCtx(TryRegion.Finally, t.save, t.guard, t.finally));
          this.compileBlock(t.finally, ctx);
        }
      }
    } finally {
      ctx.tryStack = saved;
    }
  }

  compileTry(ts, ctx) {
    const hasFinally = !!ts.finally_clause;
    const fin = ts.finally_clause ? ts.finally_clause.block : null;
    const save = ctx.allocTemp();
    const rErr = ctx.allocTemp();
    const guard = hasFinally && ts.catch_clauses.length ? ctx.allocTemp() : null;

    const tryBeginPos = ctx.emit(['TryBegin', 0, save]);
    ctx.tryStack.push(new TryCtx(TryRegion.Body, save, guard, fin));
    try { this.compileBlock(ts.try_block, ctx); } finally { ctx.tryStack.pop(); }
    ctx.emit(['TryEnd', save]);
    const toFinally = [ctx.emitJumpPlaceholder()];

    const handler = ctx.currentLabel();
    ctx.patchTryBegin(tryBeginPos, handler);
    ctx.emit(['TryLand', save, rErr]);
    ctx.registerMap.set('_err', rErr);

    const guardBegins = [];
    const typedOf = c => c.error_type && c.error_type.name !== '_';
    const typed = ts.catch_clauses.some(typedOf);
    let rKind = null;
    if (typed) { rKind = ctx.allocTemp(); ctx.emit(['LoadErrorKind', rKind]); }
    for (const clause of ts.catch_clauses) {
      let skip = null;
      if (typedOf(clause) && rKind !== null) {
        const rCmpStr = ctx.allocTemp();
        const rEq = ctx.allocTemp();
        const kindIdx = this.internString(clause.error_type.name);
        ctx.emit(['LoadStr', rCmpStr, kindIdx]);
        ctx.emit(['CmpEq', rEq, rKind, rCmpStr]);
        skip = ctx.emitJumpIfNotPlaceholder(rEq);
      }
      ctx.emit(['TryHandled', save]);
      if (guard !== null) guardBegins.push(ctx.emit(['TryBegin', 0, guard]));
      ctx.tryStack.push(new TryCtx(TryRegion.Catch, save, guard, fin));
      try { this.compileBlock(clause.block, ctx); } finally { ctx.tryStack.pop(); }
      if (guard !== null) ctx.emit(['TryEnd', guard]);
      toFinally.push(ctx.emitJumpPlaceholder());
      if (skip === null) break;   // a clause with no type catches everything
      ctx.patchJump(skip, ctx.currentLabel());
    }
    toFinally.push(ctx.emitJumpPlaceholder());

    if (guard !== null) {
      const guardLabel = ctx.currentLabel();
      for (const pos of guardBegins) ctx.patchTryBegin(pos, guardLabel);
      const rErr2 = ctx.allocTemp();
      ctx.emit(['TryLand', guard, rErr2]);
    }
    const finallyLabel = ctx.currentLabel();
    for (const pos of toFinally) ctx.patchJump(pos, finallyLabel);
    if (fin) {
      ctx.tryStack.push(new TryCtx(TryRegion.Finally, save, guard, fin));
      try { this.compileBlock(fin, ctx); } finally { ctx.tryStack.pop(); }
    }
    ctx.emit(['TryRethrow', save]);
    if (guard !== null) ctx.emit(['TryRethrow', guard]);
  }

  // ── BashExec and formats ───────────────────────────────────────────────────

  /** G2: written text is `Lit`, every value a `Reg` the VM quotes. */
  compileBashExec(be, ctx) {
    const parts = [];
    for (const a of be.args) {
      if (a.k === 'Literal') {
        const v = a.value;
        if (v.t === 'String') { parts.push({ Lit: this.internString(unsentinel(v.v)) }); continue; }
        if (v.t === 'Char') { parts.push({ Lit: this.internString(v.v) }); continue; }
        if (v.t === 'InterpolatedString') { parts.push(...this.interpolationParts(v.v, ctx)); continue; }
      }
      parts.push({ Reg: this.compileExpr(a, ctx) });
    }
    const dst = ctx.allocTemp();
    ctx.emit(['BashExec', dst, parts]);
    ctx.setRegType(dst, T.String);
    return dst;
  }

  /** `#,|x|`, `#^|x|` and their precisions; a computed count is a `*Dyn` (GAP-ZYB-001). */
  compileFormat(fe, ctx) {
    const r = this.compileExpr(fe.expr, ctx);
    const dst = ctx.allocTemp();
    const precKind = fe.precision == null ? 0 : fe.precision.k === 'Round' ? 1 : 2;
    const prec = fe.precision == null ? null : fe.precision._[0];
    const precLiteral = prec && prec.k === 'Literal' ? prec._[0] : null;
    const precReg = prec && prec.k === 'Dynamic' ? this.compileExpr(prec._[0], ctx) : null;
    const base = fe.kind === 'Thousands' ? 'FmtThousands' : 'FmtScientific';
    if (precReg === null) ctx.emit([base, dst, r, precKind, precLiteral ?? 0]);
    else ctx.emit([`${base}Dyn`, dst, r, precKind, precReg]);
    ctx.setRegType(dst, T.String);
    return dst;
  }
}

// ── Hot-definition neutral element ───────────────────────────────────────────

/** The HotInit for a hot variable, from the shape of its right-hand side. */
function hotNeutralInstr(value, varName, dst) {
  if (value.k === 'CollectionAppend') {
    const id = unwrapGroup(value.collection);
    if (id.k === 'Identifier' && id.name === varName) return ['HotInit', dst, 'Array'];
  }
  if (value.k === 'Binary') {
    if (value.op === 'Concat') return ['HotInit', dst, 'String'];
    const id = unwrapGroup(value.left);
    if (id.k === 'Identifier' && id.name === varName && (value.op === 'Mul' || value.op === 'Div')) return ['HotInit', dst, 'IntOne'];
  }
  if (value.k === 'ConcatBuild') {
    const id = unwrapGroup(value.base);
    if (id.k === 'Identifier' && id.name === varName) return ['HotInit', dst, 'String'];
  }
  return ['HotInit', dst, 'Int'];
}

// ── Free variables for closure capture ───────────────────────────────────────

/** The names a lambda body reads from `outer`: in its registers, not params or locals. */
function collectFreeVars(body, params, outer) {
  const seen = new Set();
  const free = [];
  const locals = new Set(params);
  if (body.k === 'Expr') collectFreeInExpr(body._[0], locals, outer, seen, free);
  else collectFreeInStmts(body.statements, locals, outer, seen, free);
  return free;
}

function addFree(name, locals, outer, seen, free) {
  if (!locals.has(name) && outer.registerMap.has(name) && !seen.has(name)) { seen.add(name); free.push(name); }
}

function collectFreeInExpr(e, locals, outer, seen, free) {
  const go = x => collectFreeInExpr(x, locals, outer, seen, free);
  switch (e.k) {
    case 'Identifier': addFree(e.name, locals, outer, seen, free); return;
    case 'Match':
      go(e.scrutinee);
      for (const c of e.cases) {
        collectFreeInPattern(c.pattern, locals, outer, seen, free);
        if (c.value) go(c.value);
        if (c.block) collectFreeInStmts(c.block.statements, new Set(locals), outer, seen, free);
      }
      return;
    case 'Lambda': {
      const inner = new Set(locals);
      for (const p of e.params) inner.add(p);
      if (e.body.k === 'Expr') collectFreeInExpr(e.body._[0], inner, outer, seen, free);
      else collectFreeInStmts(e.body.statements, inner, outer, seen, free);
      return;
    }
    // ZYTW-005: a name read inside a string is captured like any other.
    case 'Literal':
      if (e.value.t === 'InterpolatedString') for (const n of interpolatedNames(e.value.v)) addFree(n, locals, outer, seen, free);
      return;
    // Shell expressions have no capturable sub-expressions.
    case 'Execute': case 'BashExec': case 'TerminalSize': return;
  }
  walkSubExprs(e, go);
}

function collectFreeInPattern(p, locals, outer, seen, free) {
  switch (p.k) {
    case 'Comparison': collectFreeInExpr(p._[1], locals, outer, seen, free); return;
    case 'ErrorKind': return;
    case 'Ident': {
      const name = p._[0];
      if (!locals.has(name) && outer.registerMap.has(name) && !seen.has(name)) { seen.add(name); free.push(name); }
      return;
    }
    case 'Range': collectFreeInExpr(p._[0], locals, outer, seen, free); collectFreeInExpr(p._[1], locals, outer, seen, free); return;
    case 'List': case 'Or': for (const q of p._[0]) collectFreeInPattern(q, locals, outer, seen, free); return;
    case 'Literal': case 'Wildcard': return;
  }
}

function collectFreeInStmts(stmts, locals, outer, seen, free) {
  const go = (x, l = locals) => collectFreeInExpr(x, l, outer, seen, free);
  for (const s of stmts) {
    switch (s.k) {
      case 'Assignment': case 'ConstDecl': go(s.value); locals.add(s.name); break;
      case 'Return': if (s.value) go(s.value); break;
      case 'Output': for (const e of s.exprs) go(e); break;
      case 'If':
        go(s.condition);
        collectFreeInStmts(s.then_block.statements, new Set(locals), outer, seen, free);
        for (const b of s.else_if_branches) {
          go(b.condition);
          collectFreeInStmts(b.block.statements, new Set(locals), outer, seen, free);
        }
        if (s.else_block) collectFreeInStmts(s.else_block.statements, new Set(locals), outer, seen, free);
        break;
      case 'Loop': {
        if (s.condition) go(s.condition);
        if (s.iterable) go(s.iterable);
        const loopLocals = new Set(locals);
        if (s.iterator_var != null) loopLocals.add(s.iterator_var);
        collectFreeInStmts(s.body.statements, loopLocals, outer, seen, free);
        break;
      }
      case 'Try':
        collectFreeInStmts(s.try_block.statements, new Set(locals), outer, seen, free);
        for (const c of s.catch_clauses) {
          const cl = new Set(locals);
          cl.add('_err');
          collectFreeInStmts(c.block.statements, cl, outer, seen, free);
        }
        if (s.finally_clause) collectFreeInStmts(s.finally_clause.block.statements, new Set(locals), outer, seen, free);
        break;
      case 'Match':
        go(s.scrutinee);
        for (const c of s.cases) {
          collectFreeInPattern(c.pattern, locals, outer, seen, free);
          if (c.value) go(c.value);
          if (c.block) collectFreeInStmts(c.block.statements, new Set(locals), outer, seen, free);
        }
        break;
      case 'Expr': go(s.expr); break;
      case 'DestructureAssign': go(s.value); break;
      case 'Sleep': go(s.duration); break;
      case 'OutputPos':
        for (const x of s.slots) if (x) go(x);
        for (const x of s.items) go(x);
        break;
      case 'TuiBlock': collectFreeInStmts(s.body.statements, locals, outer, seen, free); break;
    }
  }
}

// ── Dead-code elimination ────────────────────────────────────────────────────

function eliminateDeadCode(instructions, src, oldNumRegs, numParams) {
  const n = instructions.length;
  if (n === 0) return [instructions, src, oldNumRegs];
  const reachable = new Array(n).fill(false);
  const worklist = [0];
  while (worklist.length) {
    const ip = worklist.pop();
    if (ip >= n || reachable[ip]) continue;
    reachable[ip] = true;
    const ins = instructions[ip];
    switch (ins[0]) {
      case 'Jump': worklist.push(ins[1]); break;
      case 'JumpIf': case 'JumpIfNot': case 'JumpIfNotCond': worklist.push(ins[2], ip + 1); break;
      case 'RangeStep': worklist.push(ins[5], ip + 1); break;
      case 'IterStep': worklist.push(ins[3], ip + 1); break;
      case 'MatchInt': case 'MatchStr': worklist.push(ins[3], ip + 1); break;
      case 'MatchRange': case 'MatchCharRange': worklist.push(ins[4], ip + 1); break;
      case 'TryBegin': worklist.push(ins[1], ip + 1); break;
      case 'Return': case 'TailCall': case 'Halt': break;
      default: worklist.push(ip + 1);
    }
  }
  // A LoadUnit right before the Return that ends the frame does nothing (2026-10-17).
  for (let i = n - 1; i >= 0; i--) {
    if (instructions[i][0] !== 'LoadUnit') continue;
    let j = i + 1;
    while (j < n && instructions[j][0] === 'LoadUnit') j++;
    if (j < n && instructions[j][0] === 'Return' && instructions[j][1] !== instructions[i][1]) reachable[i] = false;
  }
  if (reachable.every(Boolean)) return [instructions, src, oldNumRegs];

  const ipMap = new Array(n + 1);
  let newIp = 0;
  for (let i = 0; i < n; i++) { ipMap[i] = newIp; if (reachable[i]) newIp++; }
  ipMap[n] = newIp;
  const remap = l => ipMap[l];
  const out = [];
  for (let i = 0; i < n; i++) {
    if (!reachable[i]) continue;
    const ins = instructions[i].slice();
    switch (ins[0]) {
      case 'Jump': ins[1] = remap(ins[1]); break;
      case 'JumpIf': case 'JumpIfNot': case 'JumpIfNotCond': ins[2] = remap(ins[2]); break;
      case 'RangeStep': ins[5] = remap(ins[5]); break;
      case 'IterStep': ins[3] = remap(ins[3]); break;
      case 'MatchInt': case 'MatchStr': ins[3] = remap(ins[3]); break;
      case 'MatchRange': case 'MatchCharRange': ins[4] = remap(ins[4]); break;
      case 'TryBegin': ins[1] = remap(ins[1]); break;
    }
    out.push(ins);
  }
  // The positions travel with their instructions, by index (BUG-VMJS-004 under `faithful`).
  const newSrc = [];
  for (let i = 0; i < src.length; i++) if (reachable[i]) newSrc.push(src[i]);
  const maxReg = maxRegUsed(out);
  // ZYVM-030: never fewer than the parameters.
  const numRegisters = Math.max(maxReg === null ? 0 : maxReg + 1, Math.min(oldNumRegs, 1), numParams);
  return [out, newSrc, numRegisters];
}

// ── The standard library ─────────────────────────────────────────────────────

/** zymbol_bytecode::builtins, by module, in `stdlib_builtin_entries` order. */
const STDLIB = {
  'std/math': [['sqrt', 0], ['exp', 1], ['ln', 2], ['log', 3], ['pow', 4], ['sin', 5], ['cos', 6], ['tan', 7],
    ['asin', 8], ['acos', 9], ['atan', 10], ['atan2', 11], ['tanh', 12], ['sinh', 13], ['cosh', 14],
    ['sigmoid', 15], ['abs', 16], ['max', 17], ['min', 18], ['floor', 19], ['ceil', 20], ['round', 21]],
  'std/random': [['entero', 100], ['rango', 101], ['peso_f64', 102], ['semilla', 103]],
  'std/json': [['decode', 200], ['decode_map', 202], ['encode', 201]],
  'std/io': [['read', 300], ['write', 301], ['append', 302], ['exists', 303], ['delete', 304], ['list', 305], ['mkdir', 306]],
  'std/time': [['now', 700], ['today', 701], ['parts', 702], ['of', 703], ['format', 704], ['add', 705], ['diff', 706]],
  'std/net': [['get', 400], ['post', 401], ['post_json', 402], ['head', 403], ['timeout', 404]],
  'std/term': [['width', 600], ['pad_left', 601], ['pad_right', 602], ['center', 603], ['truncate', 604]],
  'std/db': [['connect', 500], ['disconnect', 501], ['exec', 502], ['query', 503], ['query_one', 504],
    ['query_value', 505], ['tx', 506], ['begin', 507], ['commit', 508], ['rollback', 509], ['savepoint', 510],
    ['release', 511], ['rollback_to', 512], ['exec_script', 513], ['table_exists', 514]],
};

/** `stdlib_builtin_entries`: std/net and std/db only with their features (`http`, `db`). */
export function stdlibBuiltinEntries(moduleKey, features = {}) {
  if (moduleKey === 'std/net' && !features.http) return null;
  if (moduleKey === 'std/db' && !features.db) return null;
  return STDLIB[moduleKey] ?? null;
}

/** zymbol_common::stdlib: each function's declared arity; negative is variadic. */
const STD_ARITY = {
  'std/math': { sqrt: 1, exp: 1, ln: 1, log: -1, pow: 2, sin: 1, cos: 1, tan: 1, asin: 1, acos: 1, atan: 1, atan2: 2,
    tanh: 1, sinh: 1, cosh: 1, sigmoid: 1, abs: 1, max: 2, min: 2, floor: 1, ceil: 1, round: 1 },
  'std/random': { entero: 2, rango: 1, peso_f64: 0, semilla: 1 },
  'std/json': { decode: 1, decode_map: 2, encode: 1 },
  'std/io': { read: 1, write: 2, append: 2, exists: 1, delete: 1, list: 1, mkdir: 1 },
  'std/net': { get: -1, post: -1, post_json: -1, head: -1, timeout: 1 },
  'std/term': { width: 1, pad_left: 2, pad_right: 2, center: 2, truncate: 2 },
  'std/time': { now: 0, today: -1, parts: -1, of: -1, format: -1, add: -1, diff: -1 },
  'std/db': { connect: 2, disconnect: 1, exec: -1, query: -1, query_one: -1, query_value: -1, tx: 2, begin: 1,
    commit: 1, rollback: 1, savepoint: 2, release: 2, rollback_to: 2, exec_script: 2, table_exists: 2 },
};
export const stdlibModule = key => STD_ARITY[key] ?? null;

// ── Small rules ──────────────────────────────────────────────────────────────

/** Whether an expression's code ends with the one instruction that writes its value. */
function endsInOneInstruction(e) {
  e = unwrapGroup(e);
  switch (e.k) {
    case 'Literal': case 'Unary': case 'Index': case 'CollectionLength': case 'CollectionSlice': return true;
    case 'Binary': return !['And', 'Or', 'Pipe', 'Comma', 'Range', 'Concat'].includes(e.op);
    case 'MemberAccess': return !e.is_module_access;
  }
  return false;
}

/** The instructions that read every operand before they write their destination. */
const RETARGETABLE = new Set([
  'LoadInt', 'LoadFloat', 'LoadBool', 'LoadStr', 'LoadChar', 'LoadUnit',
  'AddInt', 'SubInt', 'MulInt', 'DivInt', 'ModInt', 'PowInt', 'NegInt',
  'AddIntImm', 'SubIntImm', 'MulIntImm',
  'CmpEqImm', 'CmpNeImm', 'CmpLtImm', 'CmpLeImm', 'CmpGtImm', 'CmpGeImm',
  'AddFloat', 'SubFloat', 'MulFloat', 'DivFloat', 'PowFloat', 'NegFloat',
  'CmpEq', 'CmpNe', 'CmpLt', 'CmpLe', 'CmpGt', 'CmpGe', 'Not',
  'StrLen', 'StrSlice', 'StrSliceCount', 'ArrayGet', 'ArrayLen', 'ArraySlice', 'ArraySliceCount', 'NamedTupleGet',
]);
function retargetDst(ins, from, to) {
  if (!RETARGETABLE.has(ins[0]) || ins[1] !== from) return false;
  ins[1] = to;
  return true;
}

/** `max_reg_used`: the registers each instruction is counted by — Rust's list, omissions included. */
const REG_SLOTS = (() => {
  const t = {};
  const set = (names, slots) => { for (const n of names.split(' ')) t[n] = slots; };
  set('LoadInt LoadFloat LoadBool LoadStr LoadChar LoadUnit MakeFunc MakeLambda NewArray LoadErrorKind LoadGlobal'
    + ' Sleep QueryTerminalSize ReadKey LoadCliArgs HotInit BashExec BuildStr Execute Return Print JumpIf JumpIfNot'
    + ' JumpIfNotCond MatchInt MatchRange MatchCharRange MatchStr MatchBool DestructureCheck LoopStepCheck'
    + ' CallableCheck CallableCheckNamed NavRangeCheck OutputSlotCheck DestroyLocal CheckAlive Revive AssertMutable'
    + ' RequireDict RequireBool TryEnd TryHandled TryRethrow', [1]);
  set('CopyReg MoveReg NegInt NegFloat IntToFloat FloatToIntRound FloatToIntTrunc IntToChar AddIntImm SubIntImm'
    + ' MulIntImm CmpEqImm CmpNeImm CmpLtImm CmpLeImm CmpGtImm CmpGeImm Not Pos IsInt AsLoopCond IterPairs'
    + ' DestructureRest DestructureTail ArrayRemove ArrayRemoveValue ArrayRemoveAll ArrayRemoveRange ArrayRemoveCount'
    + ' ArrayLen ArrayContains ArraySlice ArraySliceCount StrSliceCount LoopBoundsCheck NavStepCheck DestructureAbsorb'
    + ' StrLen StrChars NamedTupleGet FmtThousands FmtScientific NumericEval TypeOf IsError IsArray ErrorKindIs'
    + ' ErrorMessage BaseConvert RoundFloat TruncFloat TryLand', [1, 2]);
  set('AddInt SubInt MulInt DivInt ModInt PowInt AddFloat SubFloat MulFloat DivFloat PowFloat CmpEq CmpNe CmpLt'
    + ' CmpLe CmpGt CmpGe And Or HofItems HofRebuild ArrayGet ArraySet DeepSet DeepSetInPlace SetOne SetOneInPlace'
    + ' ArrayInsert StrSplitCount StrRepeat StrSplit StrContains StrSlice StrFindPos ConcatStr StrCharNext'
    + ' RoundFloatDyn TruncFloatDyn', [1, 2, 3]);
  set('RangeStep StrSplitMap StrSplitFilter StrInsert StrRemove StrReplace', [1, 2, 3, 4]);
  set('StrSplitReduce StrReplaceN', [1, 2, 3, 4, 5]);
  set('IterStep', [1, 2]);
  set('HofNext', [2, 3, 4, 5, 6, 7]);
  set('FmtThousandsDyn FmtScientificDyn', [1, 2, 4]);
  set('MakeError', [1, 3]);
  set('TryBegin StoreGlobal DetachGlobal', [2]);
  set('SetupOutputWriteback RaiseError Jump Halt PrintNewline SetNumeralMode ClearScreen EnterTui ExitTui DestroyGlobal', []);
  return t;
})();

function maxRegUsed(instructions) {
  let max = null;
  const upd = r => { if (max === null || r > max) max = r; };
  for (const ins of instructions) {
    const op = ins[0];
    switch (op) {
      case 'Call': upd(ins[1]); ins[3].forEach(upd); continue;
      case 'TailCall': ins[2].forEach(upd); continue;
      case 'CallDynamic': upd(ins[1]); upd(ins[2]); ins[3].forEach(upd); continue;
      case 'CallBuiltin': upd(ins[1]); ins[3].forEach(upd); continue;
      case 'MakeClosure': upd(ins[1]); ins[3].forEach(upd); continue;
      case 'ArrayPush': upd(ins[1]); upd(ins[2]); continue;
      case 'ArraySort': upd(ins[1]); upd(ins[2]); if (ins[4] !== U16_MAX) upd(ins[4]); continue;
      case 'ConcatBuild': upd(ins[1]); upd(ins[2]); ins[3].forEach(upd); continue;
      case 'MakeTuple': upd(ins[1]); ins[2].forEach(upd); continue;
      case 'MakeNamedTuple': upd(ins[1]); ins[3].forEach(upd); continue;
      case 'ReadLine': upd(ins[1]); if (ins[2] !== null) upd(ins[2]); continue;
      case 'PrintAt': upd(ins[1]); ins[2].forEach(upd); continue;
    }
    const slots = REG_SLOTS[op];
    if (slots === undefined) throw new Error(`compiler: max_reg_used has no rule for ${op}`);
    for (const s of slots) upd(ins[s]);
  }
  return max;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** The lexer's sentinels for `\{` and `\}`, back to the braces. */
function unsentinel(s) { return s.replace(/\u0001/g, '{').replace(/\u0002/g, '}'); }

/** `ModulePath::is_stdlib`: a bare path whose first component is `std`. */
function isStdlib(p) { return !p.is_relative && !p.is_absolute && p.components[0] === 'std'; }

function isAbsolutePath(p) { return p.startsWith('/'); }

/** `Path::join` for the paths a compile sees. */
function joinPath(base, p) {
  if (isAbsolutePath(p)) return p;
  if (base === '') return p;
  return base.endsWith('/') ? base + p : `${base}/${p}`;
}

/** An Input statement's cast as the instruction's InputKind (serde's spelling). */
function inputKindOf(c) {
  if (typeof c === 'string') return c === 'String' ? 'Raw' : c;
  switch (c.k) {
    case 'Decimal': return { Decimal: { total: c.total, decimals: c.decimals } };
    case 'Int': return { Int: { max_digits: c.max_digits } };
    case 'Text': return { Text: { max: c.max } };
  }
  throw new Error(`compiler: input cast ${JSON.stringify(c)}`);
}

// ── Output ───────────────────────────────────────────────────────────────────

/** One instruction as serde writes it: `"Halt"`, `{"Jump": 5}`, `{"LoadInt": [0, 5]}`. */
export function serdeInstruction(ins) {
  if (ins.length === 1) return ins[0];
  if (ins.length === 2) return { [ins[0]]: ins[1] };
  return { [ins[0]]: ins.slice(1) };
}

function serdeChunk(c) {
  return { name: c.name, instructions: c.instructions.map(serdeInstruction), num_registers: c.num_registers, num_params: c.num_params, src: c.src };
}

/** A compiled program in the JSON shape `zyb_dump` writes, which program.js loads. */
export function toSerde(p) {
  return { main: serdeChunk(p.main), functions: p.functions.map(serdeChunk), string_pool: p.string_pool,
    global_var_inits: p.global_var_inits, files: p.files };
}

/**
 * Compile a Rust-shaped program (rustast.js) as `Compiler::compile_named` does.
 *   baseDir   the script's directory, where its imports and subscripts resolve
 *   mainName  the file name a runtime error reports
 *   opts      { host, features: { http, db }, faithful, poisonTemps }
 * Returns the program in serde's JSON shape; throws a CompileError.
 */
export function compile(program, baseDir, mainName, opts = {}) {
  return toSerde(Compiler.compileNamed(program, baseDir, mainName, opts));
}
