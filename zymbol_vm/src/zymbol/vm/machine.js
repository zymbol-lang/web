// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// The machine: Rust's `VM::exec`, instruction for instruction, over the same
// bytecode. Where the Rust code clones a value this calls `retain`, where it
// drops one `release` — see values.js for why the count exists.
//
// It runs synchronously and stops in exactly two ways besides finishing: a line
// of input the host does not have yet, and the end of a time slice. Either way
// the state is all in `frames` and the register stack, so `resume` picks up
// where it left off — no `await` inside the loop, which is what made the
// tree-walker in zymbol.js slow.
//
// `case N: // Name` — N is the opcode Rust gives Name (isa.js), written as a
// literal so V8 compiles the switch to a jump table. `node tools/gen_isa.mjs
// --check` verifies every one of these labels against the Rust enum.

import {
  T_INT, T_FLOAT, T_BOOL, T_CHAR, T_UNIT, T_FUNC, T_STR, T_ARRAY, T_TUPLE, T_DICT, T_CLOSURE, T_ERROR,
  ZFloat, ZArray, ZTuple, ZDict, ZFunc, ZClosure, ZError, UNIT, mkChar, tagOf,
  retain, release, cloneItems, cloneMap, charLen, codePoints,
  ASCII_BASE, ZY_INT_MAX, repr, displayIn, numeralInt, numeralFloat, numeralBool, floatText,
  typeName, typeWord, typeLabel, typeSymbolOwned, refinedTypeSymbol, typeCount, errorMessageLen,
  cmpDirect, cmpOrder, equals, naturalCmp, parseNum, parseF64, display, mapNumeralNumber,
} from './values.js';
import { asciiDigits, asciiNumber } from './digits.js';
import { powi, roundHalfAway, fmtThousands, fmtScientific } from './format.js';

const NONE = 4294967295;               // u32::MAX: no handler armed
export const MAX_ACTIVE_CALLS = 10000;   // zymbol_common::depth
const DEPTH_MESSAGE = `call depth exceeded: more than ${MAX_ACTIVE_CALLS} calls active at once`;

// ── Errors: VmError's variants, by the family each one is ────────────────────

export class VmErr {
  /** `kind` null: the family is read from the words, as `error_kind_of_message` does. */
  constructor(kind, message) { this.kind = kind; this.message = message; this.at = undefined; }
}
export class NotYet extends Error {}

function errorKindOfMessage(message) {
  const m = message.toLowerCase();
  if (m.startsWith('call depth exceeded')) return 'Depth';
  if (m.includes('overflow') || m.includes('out of range')) return 'Range';
  if (m.includes('no key')) return 'Key';
  if (m.includes('index') || m.includes('out of bounds')) return 'Index';
  if (m.includes('type')) return 'Type';
  if (m.includes('division') || m.includes('divide by zero') || m.includes('modulo')) return 'Div';
  if (m.includes('parse')) return 'Parse';
  return '_';
}
const kindOf = e => e.kind ?? errorKindOfMessage(e.message);

const typeMsg = m => new VmErr('Type', m);
const indexMsg = m => new VmErr('Index', m);
const parseMsg = m => new VmErr('Parse', m);
const keyMsg = m => new VmErr('Key', m);
const plainMsg = m => new VmErr('_', m);
const generic = m => new VmErr(null, m);
const typeError = (expected, got) => new VmErr('Type', `this needs ${expected} and got ${got}`);
const divZero = () => new VmErr('Div', 'division by zero');
const modZero = () => new VmErr('Div', 'modulo by zero');
const intOverflow = (a, op, b) => new VmErr('Range', `integer overflow: ${a} ${op} ${b}`);
const castOverflow = op => new VmErr('Range', `integer overflow: ${op} cannot represent this float`);
const charOutOfRange = () => new VmErr('Range', "character out of range: ##' cannot represent this Int");
const indexOutOfBounds = (index, length, container) =>
  new VmErr('Index', `${container} index out of bounds: index ${index} for ${container} of length ${length}`);
const indexZero = () => new VmErr('Index', 'index 0 is invalid — Zymbol uses 1-based indexing (use 1 for the first element, -1 for the last)');
const undefinedFunction = i => new VmErr('_', `undefined function index ${i}`);

function arithTypeError(op, a, b) {
  const text = typeof a === 'string' || typeof b === 'string';
  if (op === '+' && text) return '+ is arithmetic only — use juxtaposition to concatenate strings: "a" b "c"';
  if (op === '/' && text) return '/ requires numeric operands — use $/ to split strings';
  if (op === '^') return `power operator requires numeric operands: ${typeName(a)}, ${typeName(b)}`;
  return `arithmetic requires numeric operands: ${typeName(a)}, ${typeName(b)}`;
}
const logicalTypeError = (op, v) => `logical ${op} requires boolean operands, got ${typeName(v)}`;

function cmpOrderError(a, b, op) {
  const ta = tagOf(a), tb = tagOf(b);
  if (ta === T_STR && tb === T_INT) return parseMsg(`cannot compare string '${a}' with integer ${b} using operator '${op}'`);
  if (ta === T_INT && tb === T_STR) return parseMsg(`cannot compare integer ${a} with string '${b}' using operator '${op}'`);
  if (ta === T_STR && tb === T_FLOAT) return parseMsg(`cannot compare string '${a}' with float ${floatText(b.v)} using operator '${op}'`);
  if (ta === T_FLOAT && tb === T_STR) return parseMsg(`cannot compare float ${floatText(a.v)} with string '${b}' using operator '${op}'`);
  return typeMsg(`cannot compare values with operator '${op}': ${typeName(a)} and ${typeName(b)}`);
}

function missingKeyMsg(key, available) {
  return available.length === 0
    ? `no key '${key}' in dictionary — it is empty`
    : `no key '${key}' in dictionary — available: ${available.join(', ')}`;
}
function dictNotPositional(op, firstKey) {
  const k = firstKey ?? 'clave';
  return `a dictionary is addressed by key, not by position: \`${op}\` has no meaning here\nhelp: use the key — d["${k}"], d["${k}"]$~ value, d$-["${k}"] — because adding a key changes what sits at each position`;
}
const firstKey = d => { for (const k of d.map.keys()) return k; return undefined; };
const tupleImmutableMsg = name =>
  `cannot modify tuple '${name}': tuples are immutable\nhelp: use 'new = ${name}[i]$~ value' for a functional update`;

// ── Numbers ──────────────────────────────────────────────────────────────────

const outOfRange = r => r > ZY_INT_MAX || r < -ZY_INT_MAX;
/** Rust's `f64::powf`: IEEE pow, where `1^NaN` and `(-1)^±inf` are 1 — JavaScript says NaN. */
function powf(a, b) {
  if (a === 1) return 1;
  if (a === -1 && (b === Infinity || b === -Infinity)) return 1;
  return Math.pow(a, b);
}
function fromF64(v) {
  if (!Number.isFinite(v)) return null;
  const t = Math.trunc(v);
  return outOfRange(t) ? null : t + 0;
}
function intPow(base, exp) {
  if (base === 0) return exp === 0 ? 1 : 0;
  if (base === 1) return 1;
  if (base === -1) return exp % 2 === 0 ? 1 : -1;
  let acc = 1;
  for (let i = 0; i < exp; i++) { acc *= base; if (outOfRange(acc)) return null; }
  return acc;
}
const rustMax = (a, b) => (Number.isNaN(a) ? b : Number.isNaN(b) ? a : Math.max(a, b));
const rustMin = (a, b) => (Number.isNaN(a) ? b : Number.isNaN(b) ? a : Math.min(a, b));

// ── Reads shared by several instructions (vm_index_get, vm_field_get, vm_len) ─

function resolve(idx, len, container) {
  if (idx === 0) throw indexZero();
  const i = idx < 0 ? len + idx : idx - 1;
  if (i < 0 || i >= len) throw indexOutOfBounds(idx, len, container);
  return i;
}

/** The i-th code point of a string, as a Char. */
function charAt(s, i) {
  let k = 0;
  for (let j = 0; j < s.length; j++) {
    const c = s.codePointAt(j);
    if (k === i) return mkChar(c);
    if (c > 0xFFFF) j++;
    k++;
  }
  throw new Error('charAt past the end');
}

function indexGet(coll, index) {
  const tc = tagOf(coll), ti = tagOf(index);
  if (tc === T_DICT && ti === T_STR) {
    if (coll.map.has(index)) return coll.map.get(index);
    throw keyMsg(missingKeyMsg(index, [...coll.map.keys()]));
  }
  if (tc === T_DICT && ti === T_INT) {
    const first = firstKey(coll) ?? 'clave';
    throw typeMsg(`a dictionary is addressed by key, not by position\nhelp: use d["${first}"] — adding a key changes what sits at each position`);
  }
  if (ti === T_STR) throw typeMsg(`a String addresses a dictionary key, and this is ${typeLabel(coll)}`);
  if (ti !== T_INT) throw typeMsg(`index must be an integer, got ${typeLabel(index)}`);
  switch (tc) {
    case T_ARRAY: return coll.items[resolve(index, coll.items.length, 'array')];
    case T_TUPLE: return coll.items[resolve(index, coll.items.length, 'tuple')];
    case T_STR: { const n = charLen(coll); return charAt(coll, resolve(index, n, 'string')); }
  }
  throw typeMsg(`cannot index into ${typeLabel(coll)} — expected array, tuple, or string`);
}

function fieldGet(target, name) {
  switch (tagOf(target)) {
    case T_DICT:
      if (target.map.has(name)) return target.map.get(name);
      throw keyMsg(missingKeyMsg(name, [...target.map.keys()]));
    case T_ARRAY: {
      if (/^[0-9]+$/.test(name)) return target.items[Number(name)] ?? UNIT;
      throw typeMsg(`the dot reaches a dictionary key, and this is ${typeLabel(target)}\nhelp: use d.${name} on a #(…) — for a position, use x[1]`);
    }
    case T_TUPLE:
      throw typeMsg(`a positional tuple is addressed by position, not by name: '${name}'\nhelp: use t[1] — names live in a dictionary, #(key: value)`);
  }
  throw typeMsg(`the dot reaches a dictionary key, and this is ${typeLabel(target)}\nhelp: use d.${name} on a #(…) — for a position, use x[1]`);
}

function vmLen(v) {
  switch (tagOf(v)) {
    case T_ARRAY: case T_TUPLE: return v.items.length;
    case T_STR: return charLen(v);
    case T_DICT: return v.map.size;
  }
  throw typeMsg(`cannot get length of ${typeLabel(v)} - only arrays, tuples, and strings have length`);
}

/** What a higher-order operator walks (`hof_items`): fresh items, each one more holder. */
function hofItems(coll) {
  switch (tagOf(coll)) {
    case T_ARRAY: case T_TUPLE: return cloneItems(coll.items);
    case T_STR: return codePoints(coll).map(mkChar);
    case T_DICT: return [...coll.map.keys()];
  }
  return null;
}

function hofRebuild(original, items) {
  switch (tagOf(original)) {
    case T_TUPLE: return new ZTuple(items);
    case T_STR: {
      if (items.every(v => tagOf(v) === T_CHAR || typeof v === 'string')) {
        let out = '';
        for (const v of items) out += typeof v === 'string' ? v : String.fromCodePoint(v.cp);
        return out;
      }
      return new ZArray(items);
    }
  }
  return new ZArray(items);
}

// ── Editing in place (vm_deep_set_in), through a slot: an array index or a Map key ─

const slotGet = (h, k) => (h instanceof Map ? h.get(k) : h[k]);
const slotSet = (h, k, v) => (h instanceof Map ? h.set(k, v) : (h[k] = v));
const sizeOf = c => (c.t === T_DICT ? c.map.size : c.items.length);

function cloneColl(c) {
  switch (c.t) {
    case T_ARRAY: return new ZArray(cloneItems(c.items));
    case T_TUPLE: return new ZTuple(cloneItems(c.items));
    case T_DICT: return new ZDict(cloneMap(c.map));
  }
  throw new Error('cloneColl of a non-collection');
}

// ── Reads with the operation's own words (as_int_for, ri!) ──────────────────

/** `as_int_for`: an Int, or `{what} must be an integer, got {type}`. */
function intFor(R, i, what) {
  const v = R[i];
  if (typeof v !== 'number') throw typeMsg(`${what} must be an integer, got ${typeLabel(v)}`);
  return v;
}
/** `ri!`: an Int for a position, or `this needs a number and got {type}`. */
function ri(R, i) {
  const v = R[i];
  if (typeof v !== 'number') throw typeError('a number', typeName(v));
  return v;
}
/** `vm_precision_from`: the decimal count a `*Dyn` format reads from a register. */
function precisionFrom(v) {
  if (typeof v === 'number') {
    if (v >= 0) return v;
    throw indexMsg(`decimal count must not be negative, got ${v}`);
  }
  throw typeMsg(`decimal count must be a whole number, got ${typeLabel(v)}`);
}
/** `vm_number_from`. */
function numberFrom(v) {
  if (typeof v === 'number') return v;
  if (isFloat(v)) return v.v;
  const f = parseF64(asciiDigits(display(v).trim()));
  if (f === null) throw typeError('number', typeName(v));
  return f;
}

// ── Text by code point ───────────────────────────────────────────────────────

/** The UTF-16 offset of the n-th code point, or the length past the end. */
function cpOffset(s, n) {
  let i = 0;
  for (let k = 0; k < n && i < s.length; k++) {
    const c = s.charCodeAt(i);
    i += c >= 0xD800 && c <= 0xDBFF ? 2 : 1;
  }
  return Math.min(i, s.length);
}
function fromCps(cps) {
  let out = '';
  for (let i = 0; i < cps.length; i += 8192) out += String.fromCodePoint(...cps.slice(i, i + 8192));
  return out;
}

// ── Ranges: slice_span, range_bounds, count_span ────────────────────────────

function rangeBounds(lo, hi, len, slice) {
  const loN = lo === 0 ? 0 : lo < 0 ? len + lo : lo - 1;
  const hiN = hi < 0 ? len + hi + 1 : hi;
  if (loN < 0 || hiN < 0 || loN > len || hiN > len)
    throw indexMsg(slice ? `slice indices out of bounds: [${lo}..${hi}] for collection of length ${len}`
      : `$-[${lo}..${hi}] out of bounds for collection of length ${len}`);
  if (loN > hiN)
    throw indexMsg(slice ? `slice start (${lo}) cannot be greater than end (${hi})`
      : `$-[start..end]: start (${lo}) cannot be greater than end (${hi})`);
  return [loN, hiN];
}
/** Up: 0-based half-open [a, b). Down: 1-based positions a down to b. */
function sliceSpan(lo, hi, len) {
  const loPos = lo === 0 ? 1 : lo < 0 ? len + lo + 1 : lo;
  const hiPos = hi < 0 ? len + hi + 1 : hi;
  if (loPos > hiPos && hiPos >= 1 && loPos <= len) return { up: false, a: loPos, b: hiPos };
  const [a, b] = rangeBounds(lo, hi, len, true);
  return { up: true, a, b };
}
function countSpan(lo, n, len) {
  const start = lo === 0 ? 0 : lo < 0 ? len + lo : lo - 1;
  if (n < 0) throw indexMsg(`slice count must be non-negative, got ${n}`);
  const end = start + n;
  if (start < 0 || start > len || end > len)
    throw indexMsg(`slice indices out of bounds: [${lo}:${n}] for collection of length ${len}`);
  return [start, end];
}
function strSlice(s, lo, hi) {
  const sp = sliceSpan(lo, hi, charLen(s));
  if (sp.up) return s.slice(cpOffset(s, sp.a), cpOffset(s, sp.b));
  return fromCps(codePoints(s.slice(cpOffset(s, sp.b - 1), cpOffset(s, sp.a))).reverse());
}

/** `vm_char_as_number`: `#|'७'|` is 7; a Char that is no number comes back as it is. */
function charAsNumber(c) {
  const s = String.fromCodePoint(c.cp);
  let n = parseNum(s);
  if (n === null) { const a = asciiNumber(s); if (a !== null) n = parseNum(a); }
  if (n === null) return c;
  return 'int' in n ? n.int : new ZFloat(n.float);
}

/** `0x|…|` and its siblings (BaseConvert). */
function baseConvert(v, radix) {
  const prefix = radix === 2 ? '0b' : radix === 8 ? '0o' : radix === 10 ? '0d' : '0x';
  const digits = n => (radix === 2 ? n.toString(2) : radix === 8 ? n.toString(8)
    : radix === 10 ? String(n).padStart(4, '0') : n.toString(16).toUpperCase().padStart(4, '0'));
  switch (tagOf(v)) {
    case T_CHAR: return prefix + digits(v.cp);
    case T_INT: return (v < 0 ? '-' : '') + prefix + digits(Math.abs(v));
    case T_STR: {
      let s = v;
      for (const p of ['0b', '0B', '0o', '0O', '0d', '0D', '0x', '0X']) while (s.startsWith(p)) s = s.slice(2);
      const re = radix === 2 ? /^\+?[01]+$/ : radix === 8 ? /^\+?[0-7]+$/ : radix === 10 ? /^\+?[0-9]+$/ : /^\+?[0-9a-fA-F]+$/;
      const code = re.test(s) ? parseInt(s.replace(/^\+/, ''), radix) : NaN;
      if (!Number.isNaN(code) && code <= 0xFFFFFFFF) {
        if (code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF))
          throw new VmErr('Range', `character out of range: ${prefix}|…| cannot represent this code`);
        return mkChar(code);
      }
      const name = radix === 2 ? 'binary' : radix === 8 ? 'octal' : radix === 16 ? 'hexadecimal' : 'decimal';
      throw parseMsg(`failed to parse '${s}' as ${name} number`);
    }
  }
  throw typeMsg(`base conversion expressions work with char, int, or string, got ${typeLabel(v)}`);
}

function intStepOf(step, single, container) {
  if (typeof step === 'number') return step;
  if (single) throw typeMsg(`${container} update index must be an integer, got ${typeLabel(step)}`);
  throw typeMsg(`a navigation step is a position (Int) or a dictionary key (String), got ${typeLabel(step)}`);
}

// ── The machine ──────────────────────────────────────────────────────────────

const DONE = 'done', INPUT = 'input', YIELD = 'yield', SLEEP = 'sleep';

export class Machine {
  /**
   * @param program  what loadProgram() returns
   * @param host     { write(text), readLine() → string | '' (EOF) | undefined (not yet),
   *                   inputHint(hint), entropy() → BigInt, sleep(ms) → true if it slept, false to wait }
   */
  constructor(program, host) {
    this.p = program;
    this.host = host;
    this.R = new Array(1 << 12).fill(UNIT);
    this.sp = 0;
    this.frames = [];
    this.globals = [];
    this.mode = ASCII_BASE;
    this.inFlight = null;
    this.pendingWb = null;
    this.detached = null;
    this.destroyedGlobals = new Map();
    this.exitCode = undefined;
    this.cliArgs = [];
    this.count = { steps: 0, calls: 0, copied: 0 };
    this.out = [];
    this.waiting = null;
    this.sliceSteps = Infinity;
    this.sliceEnd = Infinity;
    this.rng = null;
    this.destroyed = new Set();   // absolute register slots `\` ended (destroyed_slots)
    this.sleepMs = 0;
  }

  /** Rust's `forget_destroyed_from`: a new frame reuses the slots from `base` up. */
  forgetDestroyedFrom(base) {
    if (this.destroyed.size > 0) for (const s of this.destroyed) if (s >= base) this.destroyed.delete(s);
  }

  // ── Driver ────────────────────────────────────────────────────────────────

  /** Run from the start. Returns { status: 'done' | 'input' | 'yield' }; throws a located VmErr. */
  start() {
    const p = this.p;
    this.globals = p.globals.map(globalValue);
    this.grow(p.main.nregs);
    this.frames.push(frameOf(0, -1, p.main, 0, null));
    return this.resume();
  }

  /** Go on: with the line a waiting `<<` asked for, or after a time slice. */
  resume(line) {
    try {
      if (this.waiting !== null) {
        if (line === undefined) return { status: INPUT };
        const w = this.waiting;
        this.waiting = null;
        let taken;
        try { taken = this.takeLine(w, line); }
        catch (e) {
          // End of input, raised by the `<<` that was waiting: a `!?` around it
          // meets it as it meets any other error.
          if (!(e instanceof VmErr)) throw e;
          const top = this.frames[this.frames.length - 1];
          if (e.at === undefined) e.at = [top.ip - 1, top.ci];
          if (!this.raise(e, kindOf(e), 0)) throw e;
          taken = true;
        }
        if (!taken) { this.flush(); return { status: INPUT }; }
      }
      this.sliceEnd = this.count.steps + this.sliceSteps;
      const r = this.exec(0);
      this.flush();
      if (r === SLEEP) return { status: SLEEP, ms: this.sleepMs };
      return { status: r === YIELD ? YIELD : r === INPUT ? INPUT : DONE };
    } catch (e) {
      this.flush();
      if (e instanceof VmErr) throw this.locate(e);
      throw e;
    }
  }

  flush() {
    if (this.out.length > 0) { this.host.write(this.out.join('')); this.out.length = 0; }
  }

  // ── Registers ─────────────────────────────────────────────────────────────

  /** Rust's `grow_regs`: the frame's registers, all Unit. Slots past `sp` already are. */
  grow(len) {
    const R = this.R;
    while (R.length < len) R.push(UNIT);
    this.sp = len;
  }

  /** Rust's `truncate_regs`: the registers from `len` up let go of what they hold. */
  truncate(len) {
    const R = this.R;
    for (let i = len; i < this.sp; i++) {
      const v = R[i];
      if (v !== UNIT) { R[i] = UNIT; release(v); }
    }
    this.sp = len;
  }

  /** `make_mut` on the collection at holder[key]: copied if anything else holds it. */
  mutAt(holder, key) {
    const c = slotGet(holder, key);
    if (c.rc === 1) return c;
    this.count.copied += sizeOf(c);
    const copy = cloneColl(c);
    c.rc--;
    slotSet(holder, key, copy);
    return copy;
  }

  numeralRepr(v) {
    return this.mode === ASCII_BASE ? repr(v) : displayIn(v, this.mode);
  }

  // ── Errors ────────────────────────────────────────────────────────────────

  /** Rust's `raise_kind!`: carry the error to the nearest armed handler at or above `floor`. */
  raise(e, kind, floor) {
    const R = this.R, frames = this.frames;
    if (this.detached !== null) {
      const [g, abs] = this.detached;
      this.detached = null;
      const old = this.globals[g];
      this.globals[g] = retain(R[abs]);
      release(old);
    }
    let target = -1;
    for (let i = frames.length - 1; i >= 0; i--) if (frames[i].catchIp !== NONE) { target = i; break; }
    if (target >= 0 && target >= floor) {
      while (frames.length - 1 > target) {
        const callee = frames.pop();
        const cb = callee.base;
        if (callee.wb !== null) {
          const callerBase = frames[frames.length - 1].base;
          for (const [pi, cr] of callee.wb) {
            const v = R[cb + pi];
            R[cb + pi] = UNIT;
            const old = R[callerBase + cr]; R[callerBase + cr] = v; release(old);
          }
        }
        this.truncate(cb);
      }
      const f = frames[frames.length - 1];
      const c = f.catchIp;
      f.catchIp = NONE;
      this.inFlight = { tag: 0, err: e, kind, origin: e.at };
      f.ip = c;
      return true;
    }
    if (floor > 0 && frames.length > floor) {
      const fb = frames[floor].base;
      frames.length = floor;
      this.truncate(fb);
    }
    return false;
  }

  lineAt(chunkIdx, ip) {
    const c = chunkIdx < 0 ? this.p.main : this.p.functions[chunkIdx];
    return c?.src[ip]?.line ?? 0;
  }

  /** Rust's `locate`: the file and line of the instruction that raised. */
  locate(e) {
    if (e.file !== undefined || e.at === undefined) return e;
    const [ip, ci] = e.at;
    const p = this.p;
    const chunk = ci < 0 ? p.main : p.functions[ci];
    let pos = chunk?.src[ip];
    if (pos === undefined) return e;
    if (pos.line === 0) {
      for (let i = this.frames.length - 2; i >= 0; i--) {
        const f = this.frames[i];
        if (f.ip === 0) continue;
        const c = f.ci < 0 ? p.main : p.functions[f.ci];
        const q = c.src[f.ip - 1];
        if (q && q.line > 0) { pos = q; break; }
      }
    }
    if (pos.line === 0) return e;
    const file = p.files[pos.file];
    if (!file) return e;
    e.file = file;
    e.line = pos.line;
    return e;
  }

  // ── Input ─────────────────────────────────────────────────────────────────

  /** A line for a waiting `<<`: the value written, or false if it must ask again. */
  takeLine(w, line) {
    if (line === '') throw generic(`end of input while waiting for ${describeInputKind(w.kind)}`);
    const r = validateInput(line.trim(), w.kind);
    if (r.ok) {
      const R = this.R, old = R[w.abs];
      R[w.abs] = r.value;
      release(old);
      return true;
    }
    this.flush();
    this.host.inputHint(r.hint);
    return this.askLine(w);
  }

  /** Ask the host for a line: taken now if it has one, else the machine waits. */
  askLine(w) {
    const prompt = w.promptReg >= 0 ? this.numeralRepr(this.R[w.base + w.promptReg]) : null;
    if (prompt !== null) this.out.push(prompt);
    this.flush();
    const line = this.host.readLine();
    if (line === undefined) { this.waiting = w; return false; }
    return this.takeLine(w, line);
  }

  // ── Calls from inside an instruction ──────────────────────────────────────

  /** Rust's `enter_callable`: push the frame of a call whose arguments are moved in. */
  enterCallable(fi, ups, args, dst) {
    const fn = this.p.functions[fi];
    if (fn === undefined) throw undefinedFunction(fi);
    if (args.length !== fn.nparams) {
      for (const a of args) release(a);
      throw generic(`lambda expects ${fn.nparams} arguments, got ${args.length}`);
    }
    if (this.frames.length > MAX_ACTIVE_CALLS) { for (const a of args) release(a); throw generic(DEPTH_MESSAGE); }
    const nb = this.sp;
    this.grow(nb + fn.nregs);
    const R = this.R;
    for (let i = 0; i < args.length; i++) R[nb + i] = args[i];
    if (ups !== null) {
      for (let i = 0; i < ups.length; i++) {
        const slot = fn.nparams + i;
        if (slot < fn.nregs) R[nb + slot] = retain(ups[i]);
      }
    }
    this.forgetDestroyedFrom(nb);
    this.count.calls++;
    const f = frameOf(nb, fi, fn, dst, null);
    this.frames.push(f);
    return f;
  }

  /** Rust's `call_callable`: run a function to its return on a nested loop. */
  callCallable(callable, args) {
    const t = tagOf(callable);
    if (t !== T_FUNC && t !== T_CLOSURE) throw typeError('Function', typeName(callable));
    const fi = callable.idx;
    const fn = this.p.functions[fi];
    if (fn === undefined) throw undefinedFunction(fi);
    if (args.length !== fn.nparams) {
      for (const a of args) release(a);
      throw generic(`lambda expects ${fn.nparams} arguments, got ${args.length}`);
    }
    if (this.frames.length > MAX_ACTIVE_CALLS) { for (const a of args) release(a); throw generic(DEPTH_MESSAGE); }
    const floor = this.frames.length;
    const nb = this.sp;
    this.grow(nb + fn.nregs);
    const R = this.R;
    for (let i = 0; i < args.length; i++) R[nb + i] = args[i];
    if (t === T_CLOSURE) {
      for (let i = 0; i < callable.ups.length; i++) {
        const slot = fn.nparams + i;
        if (slot < fn.nregs) R[nb + slot] = retain(callable.ups[i]);
      }
    }
    this.forgetDestroyedFrom(nb);
    this.count.calls++;
    this.frames.push(frameOf(nb, fi, fn, 0, null));
    const caller = this.callerAt;
    try {
      const r = this.exec(floor);
      if (r === INPUT || r === YIELD)
        throw new NotYet('a `<<` that has to wait, inside a sort comparator');
      return r;
    } catch (e) {
      if (e instanceof VmErr) {
        if (e.at !== undefined && this.lineAt(e.at[1], e.at[0]) === 0) e.at = caller;
        if (this.frames.length > floor) {
          const fb = this.frames[floor].base;
          this.frames.length = floor;
          this.truncate(fb);
        }
      }
      throw e;
    }
  }

  // ── The dispatch loop ─────────────────────────────────────────────────────

  /**
   * Rust's `exec`: run from the frame on top until the frame at `floor` returns.
   * Returns that frame's value — or DONE when the program ends, INPUT when a `<<`
   * waits for the host, YIELD at the end of a time slice (only at floor 0).
   */
  exec(floor) {
    const p = this.p, R = this.R, count = this.count, strings = p.strings, frames = this.frames;
    let frame = frames[frames.length - 1];
    let base = frame.base, ip = frame.ip, ci = frame.ci, code = frame.chunk.code;

    for (;;) {
      if (ip >= code.length) {
        // Fell off the end of a chunk: an implicit return of Unit.
        if (frames.length === 1) return DONE;
        if (frames.length - 1 === floor) { frames.pop(); this.truncate(base); return UNIT; }
        const f = frames[frames.length - 1];
        const wbv = f.wb !== null ? f.wb.map(([pi, cr]) => [cr, retain(R[base + pi])]) : null;
        frames.pop();
        this.truncate(base);
        frame = frames[frames.length - 1];
        base = frame.base; ip = frame.ip; ci = frame.ci; code = frame.chunk.code;
        put(R, base + f.ret, UNIT);
        if (wbv !== null) for (const [cr, v] of wbv) put(R, base + cr, v);
        continue;
      }
      if (count.steps >= this.sliceEnd && floor === 0) { frame.ip = ip; return YIELD; }

      const ins = code[ip];
      ip++;
      count.steps++;
      try {
        switch (ins.op) {
          // ── Literals ────────────────────────────────────────────────────
          case 0: // LoadInt
            put(R, base + ins.a, ins.b); break;
          case 1: // LoadFloat
            put(R, base + ins.a, new ZFloat(ins.b)); break;
          case 2: // LoadBool
            put(R, base + ins.a, ins.b); break;
          case 3: // LoadStr
            put(R, base + ins.a, strings[ins.b]); break;
          case 4: // LoadChar
            put(R, base + ins.a, mkChar(ins.b)); break;
          case 5: // LoadUnit
            put(R, base + ins.a, UNIT); break;
          case 6: { // MakeFunc
            const fn = p.functions[ins.b];
            put(R, base + ins.a, new ZFunc(ins.b, fn ? fn.nparams : 0)); break;
          }
          case 7: { // MakeLambda
            const fn = p.functions[ins.b];
            put(R, base + ins.a, new ZClosure(ins.b, fn ? fn.nparams : 0, [])); break;
          }
          case 8: { // MakeClosure
            const fn = p.functions[ins.b];
            const ups = ins.c.map(r => retain(R[base + r]));
            put(R, base + ins.a, new ZClosure(ins.b, fn ? fn.nparams : 0, ups)); break;
          }

          // ── Register moves ──────────────────────────────────────────────
          case 9: // CopyReg
            put(R, base + ins.a, retain(R[base + ins.b])); break;
          case 10: { // MoveReg
            const v = R[base + ins.b];
            R[base + ins.b] = UNIT;
            put(R, base + ins.a, v); break;
          }

          // ── Integer arithmetic, with the Float fallback ─────────────────
          case 11: { // AddInt
            const x = R[base + ins.b], y = R[base + ins.c];
            if (typeof x === 'number' && typeof y === 'number') {
              const r = x + y;
              if (outOfRange(r)) throw intOverflow(x, '+', y);
              put(R, base + ins.a, r);
            } else if (isFloat(x) || isFloat(y)) put(R, base + ins.a, new ZFloat(rf2(x, y, '+', 0) + rf2b));
            else throw typeMsg(arithTypeError('+', x, y));
            break;
          }
          case 12: { // SubInt
            const x = R[base + ins.b], y = R[base + ins.c];
            if (typeof x === 'number' && typeof y === 'number') {
              const r = x - y;
              if (outOfRange(r)) throw intOverflow(x, '-', y);
              put(R, base + ins.a, r + 0);
            } else if (isFloat(x) || isFloat(y)) put(R, base + ins.a, new ZFloat(rf2(x, y, '-', 0) - rf2b));
            else throw typeMsg(arithTypeError('-', x, y));
            break;
          }
          case 13: { // MulInt
            const x = R[base + ins.b], y = R[base + ins.c];
            if (typeof x === 'number' && typeof y === 'number') {
              const r = x * y;
              if (outOfRange(r)) throw intOverflow(x, '*', y);
              put(R, base + ins.a, r + 0);
            } else if (isFloat(x) || isFloat(y)) put(R, base + ins.a, new ZFloat(rf2(x, y, '*', 0) * rf2b));
            else throw typeMsg(arithTypeError('*', x, y));
            break;
          }
          case 14: { // DivInt
            const x = R[base + ins.b], y = R[base + ins.c];
            if (isFloat(x) || isFloat(y)) { const a = rf2(x, y, '/', 0); put(R, base + ins.a, new ZFloat(a / rf2b)); break; }
            if (typeof x !== 'number' || typeof y !== 'number') throw typeMsg(arithTypeError('/', x, y));
            if (y === 0) throw divZero();
            put(R, base + ins.a, Math.trunc(x / y) + 0); break;
          }
          case 15: { // ModInt
            const x = R[base + ins.b], y = R[base + ins.c];
            if (isFloat(x) || isFloat(y)) {
              const a = rf2(x, y, '%', 0);
              if (rf2b === 0) throw modZero();
              put(R, base + ins.a, new ZFloat(a % rf2b)); break;
            }
            if (typeof x !== 'number' || typeof y !== 'number') throw typeMsg(arithTypeError('%', x, y));
            if (y === 0) throw modZero();
            put(R, base + ins.a, (x % y) + 0); break;
          }
          case 16: { // PowInt
            const x = R[base + ins.b], y = R[base + ins.c];
            if (isFloat(x) || isFloat(y)) { const a = rf2(x, y, '^', 0); put(R, base + ins.a, new ZFloat(powf(a, rf2b))); break; }
            if (typeof x !== 'number' || typeof y !== 'number') throw typeMsg(arithTypeError('^', x, y));
            if (y < 0) { put(R, base + ins.a, new ZFloat(powf(x, y))); break; }
            const r = intPow(x, Math.min(y, NONE));
            if (r === null) throw intOverflow(x, '^', y);
            put(R, base + ins.a, r + 0); break;
          }
          case 17: { // NegInt
            const x = R[base + ins.b];
            if (isFloat(x)) put(R, base + ins.a, new ZFloat(-x.v));
            else if (typeof x === 'number') put(R, base + ins.a, 0 - x);
            else throw typeMsg(`negation requires numeric operand, got ${typeName(x)}`);
            break;
          }
          case 18: case 19: case 20: { // AddIntImm SubIntImm MulIntImm
            const x = R[base + ins.b], imm = ins.c;
            const op = ins.op === 18 ? '+' : ins.op === 19 ? '-' : '*';
            if (isFloat(x)) {
              const v = x.v;
              put(R, base + ins.a, new ZFloat(op === '+' ? v + imm : op === '-' ? v - imm : v * imm));
            } else if (typeof x === 'number') {
              const r = op === '+' ? x + imm : op === '-' ? x - imm : x * imm;
              if (outOfRange(r)) throw intOverflow(x, op, imm);
              put(R, base + ins.a, r + 0);
            } else throw typeMsg(arithTypeError(op, x, imm));
            break;
          }
          case 21: case 22: { // CmpEqImm CmpNeImm
            const x = R[base + ins.b];
            const eq = typeof x === 'number' ? x === ins.c : isFloat(x) ? x.v === ins.c : null;
            put(R, base + ins.a, ins.op === 21 ? eq === true : eq !== true); break;
          }
          case 23: case 24: case 25: case 26: { // CmpLtImm CmpLeImm CmpGtImm CmpGeImm
            const x = R[base + ins.b], imm = ins.c;
            const op = ins.op === 23 ? '<' : ins.op === 24 ? '<=' : ins.op === 25 ? '>' : '>=';
            let r;
            if (typeof x === 'number') r = x < imm ? -1 : x > imm ? 1 : 0;
            else { r = cmpOrder(x, imm, asciiDigits); if (r === null) throw cmpOrderError(x, imm, op); }
            put(R, base + ins.a, ordTest(ins.op - 23, r)); break;
          }

          // ── Float arithmetic ────────────────────────────────────────────
          case 27: { const a = rf2(R[base + ins.b], R[base + ins.c], '+'); put(R, base + ins.a, new ZFloat(a + rf2b)); break; } // AddFloat
          case 28: { const a = rf2(R[base + ins.b], R[base + ins.c], '-'); put(R, base + ins.a, new ZFloat(a - rf2b)); break; } // SubFloat
          case 29: { const a = rf2(R[base + ins.b], R[base + ins.c], '*'); put(R, base + ins.a, new ZFloat(a * rf2b)); break; } // MulFloat
          case 30: { // DivFloat
            const a = rf(R[base + ins.b]), b = rf(R[base + ins.c]);
            if (b === 0) throw divZero();
            put(R, base + ins.a, new ZFloat(a / b)); break;
          }
          case 31: { const a = rf2(R[base + ins.b], R[base + ins.c], '^'); put(R, base + ins.a, new ZFloat(powf(a, rf2b))); break; } // PowFloat
          case 32: { // NegFloat
            const x = R[base + ins.b];
            if (isFloat(x)) put(R, base + ins.a, new ZFloat(-x.v));
            else if (typeof x === 'number') put(R, base + ins.a, new ZFloat(-x));
            else throw typeMsg(`negation requires numeric operand, got ${typeName(x)}`);
            break;
          }

          // ── Conversions ─────────────────────────────────────────────────
          case 33: { // IntToFloat
            const x = R[base + ins.b];
            if (typeof x === 'number') put(R, base + ins.a, new ZFloat(x));
            else if (isFloat(x)) put(R, base + ins.a, new ZFloat(x.v));
            else throw typeMsg(`##. requires a numeric value, got ${typeName(x)}`);
            break;
          }
          case 34: { // FloatToIntRound
            const x = R[base + ins.b];
            if (isFloat(x)) { const n = fromF64(roundHalfAway(x.v)); if (n === null) throw castOverflow('###'); put(R, base + ins.a, n); }
            else if (typeof x === 'number') put(R, base + ins.a, x);
            else throw typeMsg(`### requires a numeric value, got ${typeName(x)}`);
            break;
          }
          case 35: { // FloatToIntTrunc
            const x = R[base + ins.b];
            if (isFloat(x)) { const n = fromF64(Math.trunc(x.v)); if (n === null) throw castOverflow('##!'); put(R, base + ins.a, n); }
            else if (typeof x === 'number') put(R, base + ins.a, x);
            else if (tagOf(x) === T_CHAR) put(R, base + ins.a, x.cp);
            else throw typeMsg(`##! requires a numeric value or Char, got ${typeName(x)}`);
            break;
          }
          case 36: { // IntToChar
            const x = R[base + ins.b];
            if (tagOf(x) === T_CHAR) put(R, base + ins.a, x);
            else if (typeof x === 'number') {
              if (x < 0 || x > 0x10FFFF || (x >= 0xD800 && x <= 0xDFFF)) throw charOutOfRange();
              put(R, base + ins.a, mkChar(x));
            } else throw typeMsg(`##' requires an Int or Char, got ${typeName(x)}`);
            break;
          }

          // ── Strings ─────────────────────────────────────────────────────
          case 37: // ConcatStr
            put(R, base + ins.a, this.numeralRepr(R[base + ins.b]) + this.numeralRepr(R[base + ins.c])); break;
          case 38: { // ConcatBuild
            const dst = ins.a, br = ins.b, items = ins.c;
            const bv = R[base + br];
            if (dst === br && tagOf(bv) === T_ARRAY) {
              const add = items.map(r => retain(R[base + r]));
              this.mutAt(R, base + dst).items.push(...add);
              break;
            }
            let result;
            switch (tagOf(bv)) {
              case T_ARRAY: {
                const arr = cloneItems(bv.items);
                for (const r of items) arr.push(retain(R[base + r]));
                result = new ZArray(arr); break;
              }
              case T_STR: {
                let s = this.numeralRepr(bv);
                for (const r of items) s += this.numeralRepr(R[base + r]);
                result = s; break;
              }
              default: throw typeMsg(`$++ requires a string or array as base, got ${typeLabel(bv)}`);
            }
            put(R, base + dst, result); break;
          }
          case 39: { // StrLen
            const x = R[base + ins.b];
            if (typeof x === 'string') put(R, base + ins.a, charLen(x));
            else if (tagOf(x) === T_ARRAY) put(R, base + ins.a, x.items.length);
            else throw typeMsg(`cannot get length of ${typeLabel(x)} - only arrays, tuples, and strings have length`);
            break;
          }
          case 40: { // StrRepeat
            const sv = R[base + ins.b], nv = R[base + ins.c];
            let s;
            if (typeof sv === 'string') s = sv;
            else if (tagOf(sv) === T_CHAR) s = String.fromCodePoint(sv.cp);
            else throw typeMsg(`$* requires a string, got ${typeLabel(sv)}`);
            if (typeof nv !== 'number') throw typeMsg(`$* repetition count must be an integer, got ${typeLabel(nv)}`);
            if (nv < 0) throw indexMsg(`$* repetition count must be non-negative, got ${nv}`);
            put(R, base + ins.a, s.repeat(nv)); break;
          }
          case 41: { // StrSplit
            const sv = R[base + ins.b], sep = R[base + ins.c];
            if (typeof sv !== 'string') throw typeMsg(`$/ requires a string on the left, got ${typeLabel(sv)}`);
            let parts;
            if (tagOf(sep) === T_CHAR) parts = sv.split(String.fromCodePoint(sep.cp));
            else if (typeof sep === 'string') {
              if (sep === '') throw indexMsg('$/ delimiter must not be empty');
              parts = sv.split(sep);
            } else throw typeMsg(`$/ delimiter must be a char or string, got ${typeLabel(sep)}`);
            put(R, base + ins.a, new ZArray(parts)); break;
          }
          case 44: { // StrChars
            const x = R[base + ins.b];
            let v;
            switch (tagOf(x)) {
              case T_STR: v = new ZArray(codePoints(x).map(mkChar)); break;
              case T_ARRAY: case T_TUPLE: v = retain(x); break;
              case T_DICT: v = new ZArray([...x.map.keys()]); break;
              default: throw typeMsg(`can only iterate over ranges, arrays, strings, tuples and dictionaries, got ${typeLabel(x)}`);
            }
            put(R, base + ins.a, v); break;
          }
          case 45: { // StrCharNext — the cursor is a UTF-16 offset here, a byte offset in Rust: no program can see it
            const s = R[base + ins.b], at = R[base + ins.c];
            if (typeof s !== 'string') throw typeError('String', typeName(s));
            if (typeof at !== 'number' || at >= s.length) throw plainMsg(`internal: string cursor ${at} outside the text`);
            const c = s.codePointAt(at);
            put(R, base + ins.c, at + (c > 0xFFFF ? 2 : 1));
            put(R, base + ins.a, mkChar(c)); break;
          }
          case 51: { // BuildStr
            let s = '';
            for (const part of ins.b) s += part < 0 ? strings[~part] : this.numeralRepr(R[base + part]);
            put(R, base + ins.a, s); break;
          }

          // ── Comparison ──────────────────────────────────────────────────
          case 52: put(R, base + ins.a, cmpDirect(R[base + ins.b], R[base + ins.c]) === 0); break; // CmpEq
          case 53: put(R, base + ins.a, cmpDirect(R[base + ins.b], R[base + ins.c]) !== 0); break; // CmpNe
          case 54: case 55: case 56: case 57: { // CmpLt CmpLe CmpGt CmpGe
            const x = R[base + ins.b], y = R[base + ins.c];
            let r;
            if (typeof x === 'number' && typeof y === 'number') r = x < y ? -1 : x > y ? 1 : 0;
            else {
              r = cmpOrder(x, y, asciiDigits);
              if (r === null) throw cmpOrderError(x, y, ins.op === 54 ? '<' : ins.op === 55 ? '<=' : ins.op === 56 ? '>' : '>=');
            }
            put(R, base + ins.a, ordTest(ins.op - 54, r)); break;
          }

          // ── Logical ─────────────────────────────────────────────────────
          case 58: case 59: { // And Or
            const x = R[base + ins.b], y = R[base + ins.c];
            const op = ins.op === 58 ? 'AND' : 'OR';
            if (typeof x !== 'boolean' || typeof y !== 'boolean')
              throw typeMsg(logicalTypeError(op, typeof x === 'boolean' ? y : x));
            put(R, base + ins.a, ins.op === 58 ? x && y : x || y); break;
          }
          case 60: { // Not
            const x = R[base + ins.b];
            if (typeof x !== 'boolean') throw typeMsg(`logical NOT requires boolean operand, got ${typeName(x)}`);
            put(R, base + ins.a, !x); break;
          }
          case 61: put(R, base + ins.a, typeof R[base + ins.b] === 'number'); break; // IsInt
          case 62: { // AsLoopCond
            const x = R[base + ins.b];
            if (typeof x !== 'boolean') throw generic(`loop expects a count or a condition, got ${typeWord(x)}`);
            put(R, base + ins.a, x); break;
          }

          // ── Control flow ────────────────────────────────────────────────
          case 63: ip = ins.a; break; // Jump
          case 64: if (truthy(R[base + ins.a])) ip = ins.b; break; // JumpIf
          case 65: if (!truthy(R[base + ins.a])) ip = ins.b; break; // JumpIfNot
          case 66: { // JumpIfNotCond
            const x = R[base + ins.a];
            if (x === false) ip = ins.b;
            else if (x !== true) throw typeMsg(`a condition must be a Bool, got ${typeName(x)}`);
            break;
          }
          case 67: { // RangeStep
            const c = R[base + ins.a], e = R[base + ins.b], s = R[base + ins.c];
            if (typeof c !== 'number' || typeof e !== 'number' || typeof s !== 'number')
              throw typeMsg(`range bounds must be integers, got ${typeLabel(c)} and ${typeLabel(e)}`);
            if (R[base + ins.d] === true) { const n = c + s; if (n <= e) { R[base + ins.a] = n; ip = ins.e; } }
            else { const n = c - s; if (n >= e) { R[base + ins.a] = n; ip = ins.e; } }
            break;
          }
          case 68: { // IterStep
            const i = R[base + ins.a], n = R[base + ins.b];
            if (typeof i === 'number' && typeof n === 'number' && i + 1 <= n) { R[base + ins.a] = i + 1; ip = ins.c; }
            break;
          }

          // ── Functions ───────────────────────────────────────────────────
          case 69: { // Call
            const fi = ins.b, fn = p.functions[fi];
            if (fn === undefined) throw undefinedFunction(fi);
            if (frames.length > MAX_ACTIVE_CALLS) throw generic(DEPTH_MESSAGE);
            frame.ip = ip;
            const nb = this.sp;
            this.grow(nb + fn.nregs);
            const args = ins.c;
            for (let i = 0; i < args.length; i++) R[nb + i] = retain(R[base + args[i]]);
            let wb = null;
            if (this.pendingWb !== null) {
              wb = this.pendingWb; this.pendingWb = null;
              for (const [, cr] of wb) put(R, base + cr, UNIT);
            }
            this.forgetDestroyedFrom(nb);
            count.calls++;
            frame = frameOf(nb, fi, fn, ins.a, wb);
            frames.push(frame);
            base = nb; ip = 0; ci = fi; code = fn.code;
            break;
          }
          case 70: { // TailCall
            const fi = ins.a, fn = p.functions[fi];
            if (fn === undefined) throw undefinedFunction(fi);
            const staged = ins.b.map(r => { const v = R[base + r]; R[base + r] = UNIT; return v; });
            if (fn.nregs > this.sp - base) this.grow(base + fn.nregs);
            for (let i = base; i < base + fn.nregs; i++) put(R, i, UNIT);
            for (let i = 0; i < staged.length; i++) R[base + i] = staged[i];
            frame.ci = fi; frame.chunk = fn; frame.catchIp = NONE;
            ip = 0; ci = fi; code = fn.code;
            break;
          }
          case 71: { // Return
            const f = frames.pop();
            const wbv = f.wb !== null ? f.wb.map(([pi, cr]) => [cr, retain(R[base + pi])]) : null;
            const result = R[base + ins.a];
            R[base + ins.a] = UNIT;
            if (frames.length === 0) {
              if (tagOf(result) === T_ERROR) throw generic(result.s);
              this.exitCode = typeof result === 'number' ? result : result === UNIT ? 0 : 1;
              release(result);
              return DONE;
            }
            if (frames.length === floor) { this.truncate(base); return result; }
            this.truncate(base);
            frame = frames[frames.length - 1];
            base = frame.base; ip = frame.ip; ci = frame.ci; code = frame.chunk.code;
            put(R, base + f.ret, result);
            if (wbv !== null) for (const [cr, v] of wbv) put(R, base + cr, v);
            break;
          }
          case 72: { // CallDynamic
            const callable = R[base + ins.b], t = tagOf(callable);
            if (t !== T_FUNC && t !== T_CLOSURE) throw typeError('Function', typeName(callable));
            const fi = callable.idx, fn = p.functions[fi];
            if (fn === undefined) throw undefinedFunction(fi);
            const args = ins.c;
            if (args.length !== fn.nparams) throw generic(`lambda expects ${fn.nparams} arguments, got ${args.length}`);
            if (frames.length > MAX_ACTIVE_CALLS) throw generic(DEPTH_MESSAGE);
            frame.ip = ip;
            const nb = this.sp;
            this.grow(nb + fn.nregs);
            for (let i = 0; i < args.length; i++) R[nb + i] = retain(R[base + args[i]]);
            if (t === T_CLOSURE) {
              const ups = callable.ups;
              for (let i = 0; i < ups.length; i++) {
                const slot = fn.nparams + i;
                if (slot < fn.nregs) R[nb + slot] = retain(ups[i]);
              }
            }
            let wb = null;
            if (this.pendingWb !== null) {
              wb = this.pendingWb; this.pendingWb = null;
              for (const [, cr] of wb) put(R, base + cr, UNIT);
            }
            this.forgetDestroyedFrom(nb);
            count.calls++;
            frame = frameOf(nb, fi, fn, ins.a, wb);
            frames.push(frame);
            base = nb; ip = 0; ci = fi; code = fn.code;
            break;
          }
          case 73: { // CallBuiltin
            const args = ins.c.map(r => R[base + r]);
            put(R, base + ins.a, this.builtin(ins.b, args)); break;
          }

          // ── Output ──────────────────────────────────────────────────────
          case 74: { // Print
            const v = R[base + ins.a], mode = this.mode;
            switch (typeof v) {
              case 'string': this.out.push(v); break;
              case 'number': this.out.push(numeralInt(v, mode)); break;
              case 'boolean': this.out.push(numeralBool(v, mode)); break;
              default:
                if (v === UNIT) break;
                if (v.t === T_FLOAT) this.out.push(numeralFloat(v.v, mode));
                else if (v.t === T_CHAR) this.out.push(String.fromCodePoint(v.cp));
                else this.out.push(displayIn(v, mode));
            }
            if (this.out.length > 4096) this.flush();
            break;
          }
          case 75: this.out.push('\n'); break; // PrintNewline
          case 76: this.mode = ins.a; break;   // SetNumeralMode

          // ── Arrays ──────────────────────────────────────────────────────
          case 77: put(R, base + ins.a, new ZArray([])); break; // NewArray
          case 78: { // ArrayPush
            const val = retain(R[base + ins.b]);
            const target = R[base + ins.a];
            switch (tagOf(target)) {
              case T_ARRAY: case T_TUPLE: this.mutAt(R, base + ins.a).items.push(val); break;
              case T_STR: {
                if (typeof val === 'string') R[base + ins.a] = target + val;
                else if (tagOf(val) === T_CHAR) R[base + ins.a] = target + String.fromCodePoint(val.cp);
                else { release(val); throw typeMsg(`$+ on string requires char or string element, got ${typeLabel(val)}`); }
                break;
              }
              case T_DICT: release(val); throw typeMsg('$+ is not supported on named tuples — no field name available');
              default: release(val); throw typeMsg(`cannot append to ${typeLabel(target)} - only arrays, tuples, and strings support $+`);
            }
            break;
          }
          case 79: // ArrayGet
            put(R, base + ins.a, retain(indexGet(R[base + ins.b], R[base + ins.c]))); break;
          case 81: // ArrayLen
            put(R, base + ins.a, vmLen(R[base + ins.b])); break;
          case 88: { // ArrayContains
            const coll = R[base + ins.b], elem = R[base + ins.c];
            let r;
            switch (tagOf(coll)) {
              case T_ARRAY: case T_TUPLE: r = coll.items.some(v => equals(v, elem)); break;
              case T_STR:
                r = tagOf(elem) === T_CHAR ? coll.includes(String.fromCodePoint(elem.cp))
                  : typeof elem === 'string' ? coll.includes(elem) : false;
                break;
              case T_DICT:
                if (typeof elem !== 'string') throw typeMsg(`a dictionary is asked about a key, so \`$?\` needs a String, got ${typeLabel(elem)}`);
                r = coll.map.has(elem); break;
              default: throw typeMsg(`cannot search ${typeLabel(coll)} - only arrays, tuples, and strings support contains`);
            }
            put(R, base + ins.a, r); break;
          }

          // ── `$>`, `$|`, `$<` on the machine's own frames ────────────────
          case 92: { // HofItems
            const callable = R[base + ins.c], kind = ins.d;
            const t = tagOf(callable);
            const what = kind === 0 ? 'map' : kind === 1 ? 'filter' : 'reduce';
            if (t !== T_FUNC && t !== T_CLOSURE) throw typeMsg(`${what} requires lambda function`);
            if (kind === 2 && callable.arity !== 2)
              throw generic(`reduce lambda requires 2 parameters (accumulator, element), got ${callable.arity}`);
            const items = hofItems(R[base + ins.b]);
            if (items === null) throw typeMsg(`${what} requires array, tuple, string or dictionary, got ${typeLabel(R[base + ins.b])}`);
            put(R, base + ins.a, new ZArray(items)); break;
          }
          case 93: { // HofNext
            const kind = ins.a, itemsReg = ins.b, idxReg = ins.c, accReg = ins.d, outReg = ins.e, keepReg = ins.f, funcReg = ins.g;
            const idx = typeof R[base + idxReg] === 'number' ? R[base + idxReg] : 0;
            if (idx > 0) {
              if (kind === 0) {
                const out = R[base + outReg]; R[base + outReg] = UNIT;
                if (tagOf(R[base + accReg]) === T_ARRAY) this.mutAt(R, base + accReg).items.push(out);
                else release(out);
              } else if (kind === 1) {
                const keep = R[base + outReg];
                if (typeof keep !== 'boolean') throw typeMsg(`filter lambda must return boolean, got ${typeLabel(keep)}`);
                const elem = R[base + keepReg]; R[base + keepReg] = UNIT;
                if (keep && tagOf(R[base + accReg]) === T_ARRAY) this.mutAt(R, base + accReg).items.push(elem);
                else release(elem);
              }
            }
            const items = R[base + itemsReg];
            if (tagOf(items) !== T_ARRAY || idx >= items.items.length) break;   // past the last: on
            const own = this.mutAt(R, base + itemsReg);
            const elem = own.items[idx]; own.items[idx] = UNIT;
            put(R, base + idxReg, idx + 1);
            const fv = R[base + funcReg];
            const fi = fv.idx, ups = tagOf(fv) === T_CLOSURE ? fv.ups : null;
            frame.ip = ip - 1;   // the callee returns HERE, to gather and go on
            let f;
            if (kind === 0) f = this.enterCallable(fi, ups, [elem], outReg);
            else if (kind === 1) { put(R, base + keepReg, retain(elem)); f = this.enterCallable(fi, ups, [elem], outReg); }
            else { const acc = R[base + accReg]; R[base + accReg] = UNIT; f = this.enterCallable(fi, ups, [acc, elem], accReg); }
            frame = f; base = f.base; ip = 0; ci = fi; code = f.chunk.code;
            break;
          }
          case 94: { // HofRebuild
            const res = R[base + ins.c]; R[base + ins.c] = UNIT;
            let items;
            if (tagOf(res) === T_ARRAY) {
              if (res.rc === 1) { items = res.items; res.rc = 0; }
              else { items = cloneItems(res.items); release(res); }
            } else { items = []; release(res); }
            put(R, base + ins.a, hofRebuild(R[base + ins.b], items)); break;
          }
          case 99: { // ArraySort
            const src = R[base + ins.b];
            if (tagOf(src) !== T_ARRAY) throw typeMsg(`sort requires an array, got ${typeLabel(src)}`);
            let items = cloneItems(src.items);
            if (ins.d === 65535) {
              items.sort(naturalCmp);   // stable, as Rust's sort_by is
              if (!ins.c) items.reverse();
            } else {
              const callable = R[base + ins.d];
              try { items = this.mergeSort(items, callable, [ip - 1, ci]); }
              catch (e) { for (const v of items) release(v); throw e; }
            }
            put(R, base + ins.a, new ZArray(items)); break;
          }

          // ── Checks ──────────────────────────────────────────────────────
          case 100: { // DestructureCheck
            const v = R[base + ins.a], wantsTuple = ins.b;
            if (wantsTuple ? tagOf(v) !== T_TUPLE : tagOf(v) !== T_ARRAY)
              throw generic(wantsTuple ? `tuple pattern '( … )' requires a tuple, got ${typeLabel(v)}`
                : `array pattern '[ … ]' requires an array, got ${typeLabel(v)}`);
            break;
          }
          case 101: { // LoopStepCheck
            const v = R[base + ins.a];
            if (typeof v !== 'number') throw typeMsg(`step must be an integer, got ${typeLabel(v)}`);
            if (v <= 0) throw generic(`step must be positive, got ${v}`);
            break;
          }
          case 102: { // LoopBoundsCheck
            const a = R[base + ins.a], b = R[base + ins.b];
            if (typeof a !== 'number' || typeof b !== 'number')
              throw typeMsg(`range bounds must be integers, got ${typeLabel(a)} and ${typeLabel(b)}`);
            break;
          }
          case 103: { // CallableCheck
            const t = tagOf(R[base + ins.a]);
            if (t !== T_FUNC && t !== T_CLOSURE)
              throw typeMsg(ins.b ? 'pipe operator requires a callable function or lambda' : 'expression is not callable');
            break;
          }
          case 104: { // CallableCheckNamed
            const t = tagOf(R[base + ins.a]);
            if (t !== T_FUNC && t !== T_CLOSURE) throw typeMsg(`'${strings[ins.b]}' is not a function`);
            break;
          }
          case 105: { // NavRangeCheck
            const a = R[base + ins.a], b = R[base + ins.a + 1];
            if (typeof a !== 'number') throw typeMsg(`index must be an integer, got ${typeLabel(a)}`);
            if (typeof b !== 'number') throw typeMsg(`index must be an integer, got ${typeLabel(b)}`);
            if (a < 0 || b < 0) throw indexMsg('range indices in nav path must be positive integers');
            if (a < 1 || b < 1) throw indexMsg(`invalid nav range ${a}..${b} — indices are 1-based`);
            break;
          }
          case 106: { // NavStepCheck
            const coll = R[base + ins.a], idx = R[base + ins.b];
            if (tagOf(coll) === T_DICT && typeof idx === 'number') throw typeMsg(dictNotPositional('d[n>…]', firstKey(coll)));
            if (typeof idx !== 'number' && typeof idx !== 'string')
              throw typeMsg(`a navigation step is a position (Int) or a dictionary key (String), got ${typeLabel(idx)}`);
            break;
          }
          case 118: { // RequireDict
            const v = R[base + ins.a];
            if (tagOf(v) !== T_DICT)
              throw generic(`the pattern #(…) requires a dictionary, got ${typeLabel(v)}\nhelp: #(key: name) = d unpacks a dictionary; use (a, b) for a tuple, [a, b] for an array`);
            break;
          }
          case 119: { // RequireBool
            const v = R[base + ins.a];
            if (typeof v !== 'boolean') throw typeMsg(logicalTypeError(ins.b ? 'AND' : 'OR', v));
            break;
          }

          // ── Strings: search, slice, edit ────────────────────────────────
          case 42: { // StrContains
            const s = R[base + ins.b], e = R[base + ins.c];
            if (typeof s !== 'string') throw typeMsg(`cannot search ${typeLabel(s)} - only arrays, tuples, and strings support contains`);
            let r;
            if (tagOf(e) === T_CHAR) r = s.includes(String.fromCodePoint(e.cp));
            else if (typeof e === 'string') r = s.includes(e);
            else throw typeMsg(`string contains only supports char or string search, got ${typeLabel(e)}`);
            put(R, base + ins.a, r); break;
          }
          case 43: { // StrSlice
            const lo = intFor(R, base + ins.c, 'slice start'), hi = intFor(R, base + ins.c + 1, 'slice end');
            const s = R[base + ins.b];
            if (typeof s !== 'string') throw typeMsg(`cannot slice ${typeLabel(s)} - only arrays, tuples, named tuples, and strings support slice`);
            put(R, base + ins.a, strSlice(s, lo, hi)); break;
          }
          case 46: { // StrFindPos
            const s = R[base + ins.b], pv = R[base + ins.c];
            const found = [];
            if (typeof s === 'string') {
              if (tagOf(pv) === T_CHAR) codePoints(s).forEach((c, i) => { if (c === pv.cp) found.push(i + 1); });
              else if (typeof pv === 'string') {
                if (pv === '') throw indexMsg('$?? pattern must not be empty');
                const sc = codePoints(s), pc = codePoints(pv);
                for (let i = 0; i + pc.length <= sc.length; i++) {
                  let ok = true;
                  for (let j = 0; j < pc.length; j++) if (sc[i + j] !== pc[j]) { ok = false; break; }
                  if (ok) found.push(i + 1);
                }
              } else throw typeMsg(`$?? on string requires char or string value, got ${typeLabel(pv)}`);
            } else if (tagOf(s) === T_ARRAY || tagOf(s) === T_TUPLE) s.items.forEach((v, i) => { if (equals(v, pv)) found.push(i + 1); });
            else throw typeMsg(`$?? requires an array, tuple, or string, got ${typeLabel(s)}`);
            put(R, base + ins.a, new ZArray(found)); break;
          }
          case 47: { // StrInsert
            const s = R[base + ins.b];
            if (typeof s !== 'string') throw typeError('String', typeName(s));
            const pos = ri(R, base + ins.c);
            const t = R[base + ins.d];
            if (typeof t !== 'string') throw typeError('String', typeName(t));
            const at = cpOffset(s, Math.max(pos <= 0 ? 0 : pos - 1, 0));
            put(R, base + ins.a, s.slice(0, at) + t + s.slice(at)); break;
          }
          case 48: { // StrRemove
            const s = R[base + ins.b];
            if (typeof s !== 'string') throw typeError('String', typeName(s));
            const posRaw = ri(R, base + ins.c);
            const pos = posRaw <= 0 ? 0 : posRaw - 1;
            const count = Math.max(ri(R, base + ins.d), 0);
            put(R, base + ins.a, s.slice(0, cpOffset(s, pos)) + s.slice(cpOffset(s, pos + count))); break;
          }
          case 49: case 50: { // StrReplace StrReplaceN
            const s = R[base + ins.b];
            if (typeof s !== 'string') throw typeMsg(`$~~ requires a string, got ${typeLabel(s)}`);
            const rep = R[base + ins.d];
            if (typeof rep !== 'string') throw typeMsg(`$~~ replacement must be a string, got ${typeLabel(rep)}`);
            let max = 0;
            if (ins.op === 50) {
              max = intFor(R, base + ins.e, '$~~ count');
              if (max < 0) throw indexMsg(`replacement count must be non-negative, got ${max}`);
            }
            const pv = R[base + ins.c];
            let pat;
            if (typeof pv === 'string') { if (pv === '') throw indexMsg('$~~ pattern must not be empty'); pat = pv; }
            else if (tagOf(pv) === T_CHAR) pat = String.fromCodePoint(pv.cp);
            else throw typeMsg(`$~~ pattern must be a string or char, got ${typeLabel(pv)}`);
            let r;
            if (max === 0) r = s.split(pat).join(rep);
            else {
              r = ''; let rest = s;
              for (let n = 0; n < max; n++) {
                const at = rest.indexOf(pat);
                if (at < 0) break;
                r += rest.slice(0, at) + rep;
                rest = rest.slice(at + pat.length);
              }
              r += rest;
            }
            put(R, base + ins.a, r); break;
          }

          // ── Collections: remove, insert, slice ──────────────────────────
          case 82: { // ArrayRemove
            const coll = R[base + ins.a], key = R[base + ins.b];
            if (tagOf(coll) === T_DICT && typeof key === 'string') {
              if (!coll.map.has(key)) throw keyMsg(missingKeyMsg(key, [...coll.map.keys()]));
              const own = this.mutAt(R, base + ins.a);
              const v = own.map.get(key);
              own.map.delete(key);
              release(v);
              break;
            }
            const idx = intFor(R, base + ins.b, 'remove index');
            const t = tagOf(coll);
            let len;
            if (t === T_ARRAY || t === T_TUPLE) len = coll.items.length;
            else if (t === T_STR) len = charLen(coll);
            else if (t === T_DICT) throw typeMsg(dictNotPositional('d$-[n]', firstKey(coll)));
            else throw typeMsg(`cannot remove from ${typeLabel(coll)} - only arrays, tuples, and strings support $-[i]`);
            if (idx === 0) throw indexZero();
            const i = idx < 0 ? len + idx : idx - 1;
            if (i < 0 || i >= len)
              throw indexMsg(`index out of bounds: index ${idx} for ${t === T_ARRAY ? 'array' : t === T_TUPLE ? 'tuple' : 'string'} of length ${len}`);
            if (t === T_STR) R[base + ins.a] = coll.slice(0, cpOffset(coll, i)) + coll.slice(cpOffset(coll, i + 1));
            else { const own = this.mutAt(R, base + ins.a); release(own.items.splice(i, 1)[0]); }
            break;
          }
          case 83: { // ArrayRemoveValue — a copy made without make_mut, so not counted, as in Rust
            const val = R[base + ins.b], coll = R[base + ins.a];
            switch (tagOf(coll)) {
              case T_ARRAY: {
                const items = cloneItems(coll.items);
                const pos = items.findIndex(v => equals(v, val));
                if (pos >= 0) release(items.splice(pos, 1)[0]);
                put(R, base + ins.a, new ZArray(items)); break;
              }
              case T_STR: {
                let cps = codePoints(coll), out = null;
                if (tagOf(val) === T_CHAR) { const pos = cps.indexOf(val.cp); if (pos >= 0) { cps.splice(pos, 1); out = cps; } }
                else if (typeof val === 'string') {
                  const pc = codePoints(val);
                  if (pc.length > 0) {
                    for (let i = 0; i + pc.length <= cps.length; i++) {
                      if (pc.every((c, j) => cps[i + j] === c)) { cps.splice(i, pc.length); out = cps; break; }
                    }
                  }
                } else throw typeMsg(`$- on string requires char or string value, got ${typeLabel(val)}`);
                if (out !== null) R[base + ins.a] = fromCps(out);
                break;
              }
              case T_DICT: {
                // `make_mut` on a clone of the register's dictionary: it always has another owner, so it copies, counted.
                let foundKey, hit = false;
                for (const [k, v] of coll.map) if (equals(v, val)) { foundKey = k; hit = true; break; }
                if (hit) {
                  this.count.copied += coll.map.size;
                  const map = cloneMap(coll.map);
                  const removed = map.get(foundKey);
                  map.delete(foundKey);
                  release(removed);
                  put(R, base + ins.a, new ZDict(map));
                }
                break;
              }
              default: throw typeMsg(`$- requires an array, tuple, or string, got ${typeLabel(coll)}`);
            }
            break;
          }
          case 84: { // ArrayRemoveAll
            const val = R[base + ins.b], coll = R[base + ins.a];
            switch (tagOf(coll)) {
              case T_ARRAY: case T_TUPLE: {
                const kept = coll.items.filter(v => !equals(v, val)).map(retain);
                put(R, base + ins.a, coll.t === T_ARRAY ? new ZArray(kept) : new ZTuple(kept)); break;
              }
              case T_STR: {
                let r;
                if (tagOf(val) === T_CHAR) r = fromCps(codePoints(coll).filter(c => c !== val.cp));
                else if (typeof val === 'string') r = val === '' ? coll : coll.split(val).join('');
                else throw typeMsg(`$-- on string requires char or string value, got ${typeLabel(val)}`);
                R[base + ins.a] = r; break;
              }
              case T_DICT: {
                const map = new Map();
                for (const [k, v] of coll.map) if (!equals(v, val)) map.set(k, retain(v));
                put(R, base + ins.a, new ZDict(map)); break;
              }
              default: throw typeMsg(`$-- requires an array, tuple, or string, got ${typeLabel(coll)}`);
            }
            break;
          }
          case 85: { // ArrayInsert
            const iv = R[base + ins.b];
            if (typeof iv !== 'number') throw typeMsg(`$+[i] index must be an integer, got ${typeLabel(iv)}`);
            if (iv <= 0) throw indexMsg(`$+[i] index must be positive (1-based, use 1 to insert at the beginning), got ${iv}`);
            const val = R[base + ins.c], coll = R[base + ins.a];
            switch (tagOf(coll)) {
              case T_ARRAY: case T_TUPLE: {
                const what = coll.t === T_ARRAY ? 'array' : 'tuple';
                if (iv - 1 > coll.items.length) throw indexMsg(`$+[${iv}] index out of bounds for ${what} of length ${coll.items.length}`);
                const items = cloneItems(coll.items);
                items.splice(iv - 1, 0, retain(val));
                put(R, base + ins.a, coll.t === T_ARRAY ? new ZArray(items) : new ZTuple(items)); break;
              }
              case T_STR: {
                const cps = codePoints(coll);
                if (iv - 1 > cps.length) throw indexMsg(`$+[${iv}] index out of bounds for string of length ${cps.length}`);
                let piece;
                if (tagOf(val) === T_CHAR) piece = [val.cp];
                else if (typeof val === 'string') piece = codePoints(val);
                else throw typeMsg(`$+[i] on string requires char or string element, got ${typeLabel(val)}`);
                cps.splice(iv - 1, 0, ...piece);
                R[base + ins.a] = fromCps(cps); break;
              }
              case T_DICT: throw typeMsg('$+[i] is not supported on named tuples — no field name available');
              default: throw typeMsg(`$+[i] requires an array, tuple, or string, got ${typeLabel(coll)}`);
            }
            break;
          }
          case 86: case 87: { // ArrayRemoveRange ArrayRemoveCount
            const lo = intFor(R, base + ins.b, '$-[..] start');
            const hiOrN = intFor(R, base + ins.b + 1, ins.op === 86 ? '$-[..] end' : '$-[..] count');
            if (lo <= 0) throw indexMsg(`$-[start..] start must be positive (1-based), got ${lo}`);
            if (ins.op === 86 && hiOrN <= 0) throw indexMsg(`$-[..end] end must be positive (1-based), got ${hiOrN}`);
            if (ins.op === 87 && hiOrN < 0) throw indexMsg(`$-[..] count must be non-negative, got ${hiOrN}`);
            const coll = R[base + ins.a], t = tagOf(coll);
            const len = t === T_ARRAY || t === T_TUPLE ? coll.items.length : t === T_STR ? charLen(coll) : null;
            let a = 0, b = 0;
            if (len !== null) {
              if (ins.op === 86) [a, b] = rangeBounds(lo, hiOrN, len, false);
              else {
                a = lo - 1; b = a + hiOrN;
                if (a > len || b > len) throw indexMsg(`$-[${lo}:${hiOrN}] out of bounds for collection of length ${len}`);
              }
            }
            switch (t) {
              case T_ARRAY: case T_TUPLE: {
                const items = cloneItems(coll.items);
                if (a <= b && b <= items.length) for (const v of items.splice(a, b - a)) release(v);
                put(R, base + ins.a, t === T_ARRAY ? new ZArray(items) : new ZTuple(items)); break;
              }
              case T_DICT: throw typeMsg(dictNotPositional('d$-[a..b]', firstKey(coll)));
              case T_STR: { const cps = codePoints(coll); if (a <= b && b <= cps.length) cps.splice(a, b - a); R[base + ins.a] = fromCps(cps); break; }
              default: throw typeMsg(`$-[..] requires an array, tuple, or string, got ${typeLabel(coll)}`);
            }
            break;
          }
          case 89: { // ArraySlice
            const lo = intFor(R, base + ins.c, 'slice start'), hi = intFor(R, base + ins.c + 1, 'slice end');
            const coll = R[base + ins.b];
            let r;
            switch (tagOf(coll)) {
              case T_ARRAY: case T_TUPLE: {
                const sp = sliceSpan(lo, hi, coll.items.length);
                const items = [];
                if (sp.up) for (let i = sp.a; i < sp.b; i++) items.push(retain(coll.items[i]));
                else for (let p = sp.a; p >= sp.b; p--) items.push(retain(coll.items[p - 1]));
                r = coll.t === T_ARRAY ? new ZArray(items) : new ZTuple(items); break;
              }
              case T_DICT: throw typeMsg(dictNotPositional('d$[a..b]', firstKey(coll)));
              case T_STR: r = strSlice(coll, lo, hi); break;
              default: throw typeMsg(`cannot slice ${typeLabel(coll)} - only arrays, tuples, named tuples, and strings support slice`);
            }
            put(R, base + ins.a, r); break;
          }
          case 90: case 91: { // ArraySliceCount StrSliceCount
            const lo = intFor(R, base + ins.c, 'slice start'), n = intFor(R, base + ins.c + 1, 'slice count');
            const coll = R[base + ins.b], t = tagOf(coll);
            let r;
            if (ins.op === 90 && (t === T_ARRAY || t === T_TUPLE)) {
              const [a, b] = countSpan(lo, n, coll.items.length);
              const items = coll.items.slice(a, b).map(retain);
              r = t === T_ARRAY ? new ZArray(items) : new ZTuple(items);
            } else if (ins.op === 90 && t === T_DICT) throw typeMsg(dictNotPositional('d$[a..b]', firstKey(coll)));
            else if (t === T_STR) { const [a, b] = countSpan(lo, n, charLen(coll)); r = coll.slice(cpOffset(coll, a), cpOffset(coll, b)); }
            else throw typeMsg(`cannot slice ${typeLabel(coll)} - only arrays, tuples, named tuples, and strings support slice`);
            put(R, base + ins.a, r); break;
          }

          // ── Destructuring the rest, and `\` ─────────────────────────────
          case 107: { // OutputSlotCheck
            const v = R[base + ins.a];
            if (typeof v !== 'number' && !(ins.b && tagOf(v) === T_TUPLE)) throw typeMsg(`>>~ slot expects Int, got ${typeName(v)}`);
            break;
          }
          case 108: { // Pos
            const v = R[base + ins.b];
            if (typeof v !== 'number' && !isFloat(v)) throw typeMsg(`unary plus requires numeric operand, got ${typeName(v)}`);
            put(R, base + ins.a, v); break;
          }
          case 109: { // DestroyLocal
            const abs = base + ins.a;
            if (this.destroyed.has(abs)) throw plainMsg(`use after destruction: variable '${strings[ins.b]}' was destroyed after its last use`);
            this.destroyed.add(abs);
            put(R, abs, UNIT); break;
          }
          case 110: // CheckAlive
            if (this.destroyed.size > 0 && this.destroyed.has(base + ins.a))
              throw plainMsg(`use after destruction: variable '${strings[ins.b]}' was destroyed after its last use`);
            break;
          case 111: if (this.destroyed.size > 0) this.destroyed.delete(base + ins.a); break; // Revive
          case 112: { // DestructureAbsorb
            const src = R[base + ins.b], t = tagOf(src);
            let v = UNIT;
            if (t === T_ARRAY || t === T_TUPLE) {
              const rest = src.items.slice(Math.min(ins.c - 1, src.items.length));
              v = rest.length === 0 ? UNIT : rest.length === 1 ? retain(rest[0])
                : t === T_ARRAY ? new ZArray(rest.map(retain)) : new ZTuple(rest.map(retain));
            }
            put(R, base + ins.a, v); break;
          }
          case 113: { // DestructureRest
            const src = R[base + ins.b], t = tagOf(src), trailing = ins.d;
            const coll = t === T_ARRAY || t === T_TUPLE;
            const len = coll ? src.items.length : 0;
            const lo = Math.min(ins.c - 1, len);
            const end = trailing > 0 && len > lo + trailing ? len - trailing : len;
            const slice = coll && lo <= end ? src.items.slice(lo, end).map(retain) : [];
            put(R, base + ins.a, t === T_TUPLE ? new ZTuple(slice) : new ZArray(slice)); break;
          }
          case 114: { // DestructureTail
            const src = R[base + ins.b], t = tagOf(src), k = ins.c, trailing = ins.e;
            const coll = t === T_ARRAY || t === T_TUPLE;
            const len = coll ? src.items.length : 0;
            const lo = Math.min(ins.d - 1, len);
            const v = trailing > 0 && len > lo + trailing && coll ? retain(src.items[len - k] ?? UNIT) : UNIT;
            put(R, base + ins.a, v); break;
          }
          case 154: { // DestroyGlobal
            const g = ins.a, name = strings[ins.b];
            if (this.destroyedGlobals.has(g)) throw plainMsg(`use after destruction: variable '${name}' was destroyed after its last use`);
            this.destroyedGlobals.set(g, name);
            if (g < this.globals.length) { const old = this.globals[g]; this.globals[g] = UNIT; release(old); }
            break;
          }

          // ── Numbers: `#|…|`, bases, formats, precision ──────────────────
          case 125: { // NumericEval
            const v = R[base + ins.b];
            let r;
            if (typeof v === 'string') {
              const t = v.trim();
              let n = parseNum(t);
              if (n === null) { const a = asciiNumber(t); if (a !== null) n = parseNum(a); }
              r = n === null ? v : 'int' in n ? n.int : new ZFloat(n.float);
            } else if (typeof v === 'number' || isFloat(v)) r = v;
            else if (tagOf(v) === T_CHAR) r = charAsNumber(v);
            else r = retain(v);
            put(R, base + ins.a, r); break;
          }
          case 128: // BaseConvert
            put(R, base + ins.a, baseConvert(R[base + ins.b], ins.c)); break;
          case 137: case 138: { // FmtThousands FmtScientific
            const v = R[base + ins.b];
            let f;
            if (typeof v === 'number') f = v;
            else if (isFloat(v)) f = v.v;
            else { f = parseF64(asciiDigits(display(v).trim())); if (f === null) throw typeMsg(`format expressions only work with numbers, got ${typeLabel(v)}`); }
            const s = ins.op === 137 ? fmtThousands(f, ins.c, ins.d) : fmtScientific(f, ins.c, ins.d);
            put(R, base + ins.a, mapNumeralNumber(s, this.mode)); break;
          }
          case 139: case 144: { // RoundFloat TruncFloat
            const v = R[base + ins.b], round = ins.op === 139;
            let f;
            if (typeof v === 'number') f = v;
            else if (isFloat(v)) f = v.v;
            else if (typeof v === 'string') {
              f = parseF64(asciiDigits(v.trim()));
              if (f === null) throw parseMsg(`cannot convert string '${v}' to number for ${round ? 'rounding' : 'truncation'}`);
            } else throw typeMsg(`${round ? 'round' : 'truncate'} expressions only work with numbers or numeric strings, got ${typeLabel(v)}`);
            const m = powi(10, ins.c);
            put(R, base + ins.a, new ZFloat((round ? roundHalfAway(f * m) : Math.trunc(f * m)) / m)); break;
          }
          case 140: case 141: case 142: case 143: { // FmtThousandsDyn FmtScientificDyn RoundFloatDyn TruncFloatDyn
            const n = precisionFrom(R[base + (ins.op <= 141 ? ins.d : ins.c)]);
            const f = numberFrom(R[base + ins.b]);
            let r;
            if (ins.op === 140) r = mapNumeralNumber(fmtThousands(f, ins.c, n), this.mode);
            else if (ins.op === 141) r = mapNumeralNumber(fmtScientific(f, ins.c, n), this.mode);
            else { const m = powi(10, n); r = new ZFloat((ins.op === 142 ? roundHalfAway(f * m) : Math.trunc(f * m)) / m); }
            put(R, base + ins.a, r); break;
          }
          case 155: { // Sleep
            const v = R[base + ins.a];
            if (typeof v !== 'number') throw typeMsg(`@~ requires integer milliseconds, got ${typeLabel(v)}`);
            if (v < 0) throw generic(`@~ requires non-negative duration, got ${v}`);
            frame.ip = ip;
            this.flush();
            if (!this.host.sleep(v)) {
              if (floor > 0) throw new NotYet('a `@~` that has to wait, inside a sort comparator');
              this.sleepMs = v;
              return SLEEP;
            }
            break;
          }

          // ── Patterns of `??` ────────────────────────────────────────────
          case 120: { // MatchInt
            const v = R[base + ins.a];
            if (typeof v !== 'number') throw typeError('Int', typeName(v));
            if (v === ins.b) ip = ins.c;
            break;
          }
          case 121: { // MatchRange
            const v = R[base + ins.a];
            if (typeof v !== 'number') throw typeMsg('range pattern type mismatch');
            if (v >= ins.b && v <= ins.c) ip = ins.d;
            break;
          }
          case 122: { // MatchCharRange
            const v = R[base + ins.a];
            if (tagOf(v) !== T_CHAR) throw typeMsg('range pattern type mismatch');
            if (v.cp >= ins.b && v.cp <= ins.c) ip = ins.d;
            break;
          }
          case 123: { // MatchStr
            if (R[base + ins.a] === strings[ins.b]) ip = ins.c;
            break;
          }
          case 124: { // MatchBool
            if (R[base + ins.a] === ins.b) ip = ins.c;
            break;
          }

          // ── Tuples and dictionaries ─────────────────────────────────────
          case 115: // MakeTuple
            put(R, base + ins.a, new ZTuple(ins.b.map(r => retain(R[base + r])))); break;
          case 116: { // MakeNamedTuple
            const map = new Map();
            for (let i = 0; i < ins.b.length; i++) map.set(strings[ins.b[i]], retain(R[base + ins.c[i]]));
            put(R, base + ins.a, new ZDict(map)); break;
          }
          case 117: // NamedTupleGet
            put(R, base + ins.a, retain(fieldGet(R[base + ins.b], strings[ins.c]))); break;

          // ── Data ────────────────────────────────────────────────────────
          case 126: { // TypeOf
            const v = retain(R[base + ins.b]);
            const tuple = tagOf(v) === T_ERROR
              ? [typeSymbolOwned(v), errorMessageLen(v), v]
              : [tagOf(v) === T_UNIT ? '##_' : refinedTypeSymbol(v), typeCount(v), v];
            put(R, base + ins.a, new ZTuple(tuple)); break;
          }
          case 127: put(R, base + ins.a, tagOf(R[base + ins.b]) === T_ARRAY); break; // IsArray

          // ── `!?` (GLB-010) ──────────────────────────────────────────────
          case 129: { // TryBegin
            const pending = frame.pending === null ? 0 : frame.pending.length;
            const outer = frame.catchIp;
            frame.catchIp = ins.a;
            put(R, base + ins.b, pending * 4294967296 + outer); break;
          }
          case 130: { // TryEnd
            const s = R[base + ins.a];
            frame.catchIp = typeof s === 'number' ? s % 4294967296 : NONE; break;
          }
          case 131: { // TryLand
            const s = R[base + ins.a];
            const outer = typeof s === 'number' ? s % 4294967296 : NONE;
            const keep = typeof s === 'number' ? Math.floor(s / 4294967296) : 0;
            const pending = this.inFlight ?? { tag: 0, err: generic('unknown error'), kind: '_', origin: [ip - 1, ci] };
            this.inFlight = null;
            pending.tag = ins.a;
            const value = new ZError(`##${pending.kind}(${pending.err.message})`);
            frame.catchIp = outer;
            if (frame.pending === null) frame.pending = [];
            frame.pending.length = Math.min(frame.pending.length, keep);
            frame.pending.push(pending);
            put(R, base + ins.b, value); break;
          }
          case 132: { // LoadErrorKind
            const pl = frame.pending;
            put(R, base + ins.a, pl !== null && pl.length > 0 ? pl[pl.length - 1].kind : ''); break;
          }
          case 133: { // TryHandled
            const pl = frame.pending;
            if (pl !== null && pl.length > 0 && pl[pl.length - 1].tag === ins.a) pl.pop();
            break;
          }
          case 134: { // TryRethrow
            const pl = frame.pending;
            if (pl !== null && pl.length > 0 && pl[pl.length - 1].tag === ins.a) {
              const pe = pl.pop();
              pe.err.at = pe.origin;
              pe.err.rethrowKind = pe.kind;
              throw pe.err;
            }
            break;
          }

          // ── Errors as values ────────────────────────────────────────────
          case 145: put(R, base + ins.a, tagOf(R[base + ins.b]) === T_ERROR); break; // IsError
          case 146: { // MakeError
            const m = R[base + ins.c];
            if (typeof m !== 'string') throw typeMsg(`an error's message is a String, got ${typeLabel(m)}`);
            put(R, base + ins.a, new ZError(`##${strings[ins.b]}(${m})`)); break;
          }
          case 147: { // ErrorKindIs
            const v = R[base + ins.b];
            const k = '##' + strings[ins.c];
            put(R, base + ins.a, tagOf(v) === T_ERROR && v.s.startsWith(k) && v.s[k.length] === '('); break;
          }
          case 148: { // ErrorMessage
            const v = R[base + ins.b];
            let msg = '';
            if (tagOf(v) === T_ERROR) { const i = v.s.indexOf('('); if (i >= 0 && v.s.endsWith(')')) msg = v.s.slice(i + 1, -1); }
            put(R, base + ins.a, msg); break;
          }
          case 149: throw generic(strings[ins.a]); // RaiseError
          case 150: this.pendingWb = ins.a; break; // SetupOutputWriteback

          // ── Module state ────────────────────────────────────────────────
          case 151: { // DetachGlobal
            const abs = base + ins.b, g = this.globals[ins.a], v = R[abs];
            const t = tagOf(v);
            if ((t === T_ARRAY || t === T_TUPLE || t === T_DICT) && g === v) {
              this.globals[ins.a] = UNIT;
              release(v);
              this.detached = [ins.a, abs];
            }
            break;
          }
          case 152: { // LoadGlobal
            const name = this.destroyedGlobals.get(ins.b);
            if (name !== undefined) throw plainMsg(`use after destruction: variable '${name}' was destroyed after its last use`);
            put(R, base + ins.a, retain(this.globals[ins.b] ?? UNIT)); break;
          }
          case 153: { // StoreGlobal
            if (this.destroyedGlobals.size > 0) this.destroyedGlobals.delete(ins.a);
            this.detached = null;
            if (ins.a < this.globals.length) {
              const old = this.globals[ins.a];
              this.globals[ins.a] = retain(R[base + ins.b]);
              release(old);
            }
            break;
          }

          // ── Input, and the rest ─────────────────────────────────────────
          case 159: { // ReadLine
            const w = { abs: base + ins.a, base, promptReg: ins.b, kind: ins.c };
            frame.ip = ip;
            if (!this.askLine(w)) {
              if (floor > 0) throw new NotYet('a `<<` that has to wait, inside a sort comparator');
              return INPUT;
            }
            break;
          }
          case 163: { // HotInit
            if (R[base + ins.a] === UNIT) {
              const n = ins.b;
              put(R, base + ins.a, n === 'Int' ? 0 : n === 'IntOne' ? 1 : n === 'Array' ? new ZArray([]) : '');
            }
            break;
          }
          case 164: put(R, base + ins.a, new ZArray(this.cliArgs.slice())); break; // LoadCliArgs
          case 165: case 166: case 167: case 168: { // DeepSet DeepSetInPlace SetOne SetOneInPlace
            const dst = base + ins.a;
            const val = retain(R[base + ins.c]);
            // In Rust's order: the path is read before the tuple is refused.
            let path;
            if (ins.op === 167 || ins.op === 168) path = [R[base + ins.b]];
            else {
              const pv = R[base + ins.b];
              if (tagOf(pv) !== T_ARRAY) { release(val); throw typeError('Array', typeName(pv)); }
              path = pv.items;
            }
            if ((ins.op === 166 || ins.op === 168) && tagOf(R[dst]) === T_TUPLE) {
              release(val);
              throw generic(tupleImmutableMsg(strings[ins.d]));
            }
            try { this.deepSetIn(R, dst, path, 0, val, path.length === 1); }
            catch (e) { release(val); throw e; }
            break;
          }
          case 169: { // IterPairs
            const x = R[base + ins.b];
            let v;
            switch (tagOf(x)) {
              case T_DICT: v = new ZArray([...x.map].map(([k, y]) => new ZTuple([k, retain(y)]))); break;
              case T_STR: v = new ZArray(codePoints(x).map(mkChar)); break;
              case T_ARRAY: case T_TUPLE: v = retain(x); break;
              default: throw typeMsg(`can only iterate over ranges, arrays, strings, tuples and dictionaries, got ${typeLabel(x)}`);
            }
            put(R, base + ins.a, v); break;
          }
          case 170: // AssertMutable
            if (tagOf(R[base + ins.a]) === T_TUPLE) throw generic(tupleImmutableMsg(strings[ins.b]));
            break;
          case 171: // Halt
            return DONE;

          default:
            throw new NotYet(`instruction ${ins.op} is not implemented yet`);
        }
      } catch (e) {
        if (!(e instanceof VmErr)) throw e;
        if (e.at === undefined) e.at = [ip - 1, ci];
        const kind = e.rethrowKind ?? kindOf(e);
        e.rethrowKind = undefined;
        if (!this.raise(e, kind, floor)) throw e;
        frame = frames[frames.length - 1];
        base = frame.base; ip = frame.ip; ci = frame.ci; code = frame.chunk.code;
      }
    }
  }

  /** `$^` with a comparator: the bottom-up merge sort all three engines run, call for call. */
  mergeSort(items, callable, at) {
    const n = items.length;
    let src = items, merged = [];
    this.callerAt = at;
    for (let width = 1; width < n; width *= 2) {
      merged = [];
      for (let lo = 0; lo < n; lo += 2 * width) {
        const mid = Math.min(lo + width, n), hi = Math.min(lo + 2 * width, n);
        let i = lo, j = mid;
        while (i < mid && j < hi) {
          const says = [false, false];
          const pairs = [[i, j], [j, i]];
          for (let k = 0; k < 2; k++) {
            const [x, y] = pairs[k];
            const answer = this.callCallable(callable, [retain(src[x]), retain(src[y])]);
            if (typeof answer !== 'boolean') { release(answer); throw typeMsg(`sort comparator must return a Bool, got ${typeName(answer)}`); }
            says[k] = answer;
            if (k === 0 && says[0]) break;
          }
          if (says[0] || !says[1]) merged.push(src[i++]);
          else merged.push(src[j++]);
        }
        while (i < mid) merged.push(src[i++]);
        while (j < hi) merged.push(src[j++]);
      }
      src = merged;
    }
    return src;
  }

  /** Rust's `vm_deep_set_in`: write `val` at `path[k..]` inside the value at holder[key]. */
  deepSetIn(holder, key, path, k, val, single) {
    if (k === path.length) { const old = slotGet(holder, key); slotSet(holder, key, val); release(old); return; }
    const col = slotGet(holder, key), step = path[k];
    switch (tagOf(col)) {
      case T_ARRAY: case T_TUPLE: {
        const container = col.t === T_ARRAY ? 'array' : 'tuple';
        const i = resolve(intStepOf(step, single, container), col.items.length, container);
        this.deepSetIn(this.mutAt(holder, key).items, i, path, k + 1, val, false);
        return;
      }
      case T_STR: {
        const cps = codePoints(col);
        const i = resolve(intStepOf(step, single, 'string'), cps.length, 'string');
        if (k + 1 < path.length) throw typeMsg('cannot index into Char — expected array, tuple, or string');
        let piece;
        if (tagOf(val) === T_CHAR) piece = String.fromCodePoint(val.cp);
        else if (typeof val === 'string') piece = val;
        else throw typeMsg(`$~ on string requires char or string value, got ${typeLabel(val)}`);
        let out = '';
        for (let n = 0; n < cps.length; n++) out += n === i ? piece : String.fromCodePoint(cps[n]);
        slotSet(holder, key, out);
        return;
      }
      case T_DICT: {
        if (typeof step === 'string') {
          if (col.map.has(step)) { this.deepSetIn(this.mutAt(holder, key).map, step, path, k + 1, val, false); return; }
          if (k + 1 < path.length) throw keyMsg(missingKeyMsg(step, [...col.map.keys()]));
          this.mutAt(holder, key).map.set(step, val);
          return;
        }
        if (typeof step === 'number' && !single) throw typeMsg(dictNotPositional('d[n>…]$~ value', firstKey(col)));
        if (!single) throw typeMsg(`a navigation step is a position (Int) or a dictionary key (String), got ${typeLabel(step)}`);
        throw typeMsg(dictNotPositional('d[n]$~ value', firstKey(col)));
      }
    }
    if (!single) throw typeMsg(`cannot index into ${typeLabel(col)} — expected array, tuple, or string`);
    throw typeMsg(`$~ writes into a collection, and this is ${typeLabel(col)}\nhelp: use a[1]$~ v on an array or tuple, d["key"]$~ v on a #(…)`);
  }

  // ── std/ natives (stdlib_builtins.rs) ─────────────────────────────────────

  builtin(id, args) {
    const f = i => (typeof args[i] === 'number' ? args[i] : isFloat(args[i]) ? args[i].v : null);
    const typeErr = name => generic(`mat::${name}: incompatible argument type(s) ${args.map(typeLabel).join(', ')}`);
    const unary = (name, fn) => { const x = f(0); if (x === null) throw typeErr(name); return new ZFloat(fn(x)); };
    switch (id) {
      case 0: return unary('sqrt', Math.sqrt);
      case 1: return unary('exp', Math.exp);
      case 2: { const x = f(0); if (x === null) throw typeErr('ln'); if (!(x > 0)) throw generic('mat::ln: argument must be positive'); return new ZFloat(Math.log(x)); }
      case 3: {
        const x = f(0), b = args.length > 1 ? f(1) : null;
        if (x !== null && b !== null && x > 0 && b > 0 && b !== 1) return new ZFloat(Math.log(x) / Math.log(b));
        if (x !== null && b === null && args.length < 2 && x > 0) return new ZFloat(Math.log(x));
        if (x !== null && b !== null) throw generic('mat::log: x and base must be positive; base ≠ 1');
        throw typeErr('log');
      }
      case 4: { const b = f(0), e = f(1); if (b === null || e === null) throw typeErr('pow'); return new ZFloat(powf(b, e)); }
      case 5: return unary('sin', Math.sin);
      case 6: return unary('cos', Math.cos);
      case 7: return unary('tan', Math.tan);
      case 8: { const x = f(0); if (x === null) throw typeErr('asin'); if (!(x >= -1 && x <= 1)) throw generic('mat::asin: argument must be in [-1, 1]'); return new ZFloat(Math.asin(x)); }
      case 9: { const x = f(0); if (x === null) throw typeErr('acos'); if (!(x >= -1 && x <= 1)) throw generic('mat::acos: argument must be in [-1, 1]'); return new ZFloat(Math.acos(x)); }
      case 10: return unary('atan', Math.atan);
      case 11: { const y = f(0), x = f(1); if (y === null || x === null) throw typeErr('atan2'); return new ZFloat(Math.atan2(y, x)); }
      case 12: return unary('tanh', Math.tanh);
      case 13: return unary('sinh', Math.sinh);
      case 14: return unary('cosh', Math.cosh);
      case 15: return unary('sigmoid', x => 1 / (1 + Math.exp(-x)));
      case 16: {
        const x = args[0];
        if (typeof x === 'number') return Math.abs(x);
        if (isFloat(x)) return new ZFloat(Math.abs(x.v));
        throw typeErr('abs');
      }
      case 17: case 18: {
        const name = id === 17 ? 'max' : 'min';
        if (args.length < 2) throw typeErr(name);
        const a = args[0], b = args[1];
        if (typeof a === 'number' && typeof b === 'number') return id === 17 ? Math.max(a, b) : Math.min(a, b);
        const x = f(0), y = f(1);
        if (x === null || y === null) throw typeErr(name);
        return new ZFloat(id === 17 ? rustMax(x, y) : rustMin(x, y));
      }
      case 19: return unary('floor', Math.floor);
      case 20: return unary('ceil', Math.ceil);
      case 21: return unary('round', roundHalfAway);
      case 100: { // random::entero
        const lo = args[0], hi = args[1];
        if (typeof lo !== 'number' || typeof hi !== 'number' || hi < lo) throw generic('random::entero: expected (###, ###) with max >= min');
        const range = BigInt(hi - lo + 1);
        return lo + Number(this.rngNext() % range);
      }
      case 101: { // random::rango
        const n = args[0];
        if (typeof n !== 'number' || n <= 0) throw generic('random::rango: expected positive ###');
        return Number(this.rngNext() % BigInt(n));
      }
      case 102: return new ZFloat((Number(this.rngNext() % 201n) - 100) / 1000); // random::peso_f64
      case 103: { // random::semilla
        const n = args[0];
        if (typeof n !== 'number') throw generic('random::semilla: expected ###');
        this.rng = rngState(BigInt.asUintN(64, BigInt(n)));
        return UNIT;
      }
    }
    throw new NotYet(`std builtin ${id} is not implemented yet`);
  }

  /** xoshiro256++ seeded by splitmix64: `zymbol_intrinsics::random`, step for step. */
  rngNext() {
    if (this.rng === null) this.rng = rngState(this.host.entropy());
    const s = this.rng;
    const result = (rotl((s[0] + s[3]) & M64, 23n) + s[0]) & M64;
    const t = (s[1] << 17n) & M64;
    s[2] ^= s[0]; s[3] ^= s[1]; s[1] ^= s[2]; s[0] ^= s[3];
    s[2] ^= t; s[3] = rotl(s[3], 45n);
    return result;
  }
}

const M64 = (1n << 64n) - 1n;
const rotl = (x, k) => ((x << k) | (x >> (64n - k))) & M64;
function rngState(seed) {
  let x = seed;
  const out = [];
  for (let i = 0; i < 4; i++) {
    x = (x + 0x9E3779B97F4A7C15n) & M64;
    let z = x;
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & M64;
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & M64;
    out.push(z ^ (z >> 31n));
  }
  return out;
}

// ── Small helpers kept out of the class so the loop calls them directly ──────

function frameOf(base, ci, chunk, ret, wb) {
  return { base, ip: 0, ci, chunk, ret, catchIp: NONE, pending: null, wb };
}

/** Rust's `put_reg`: write a register, letting go of what it held. */
function put(R, i, v) {
  const old = R[i];
  R[i] = v;
  if (typeof old === 'object' && old.rc > 0) release(old);
}

const isFloat = v => typeof v === 'object' && v.t === T_FLOAT;
function truthy(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  return v !== UNIT;
}

// rf2: both arithmetic operands as floats, or the operator's refusal. The second
// comes back through `rf2b` so the hot path allocates nothing.
let rf2b = 0;
function rf2(x, y, op) {
  const a = typeof x === 'number' ? x : isFloat(x) ? x.v : null;
  const b = typeof y === 'number' ? y : isFloat(y) ? y.v : null;
  if (a === null || b === null) throw typeMsg(arithTypeError(op, x, y));
  rf2b = b;
  return a;
}
function rf(x) {
  if (typeof x === 'number') return x;
  if (isFloat(x)) return x.v;
  throw typeError('Float', typeName(x));
}

/** `ord_lt` … `ord_ge`: 0 <, 1 <=, 2 >, 3 >=. INCOMPARABLE is false in all four. */
function ordTest(which, r) {
  switch (which) {
    case 0: return r === -1;
    case 1: return r === -1 || r === 0;
    case 2: return r === 1;
    default: return r === 1 || r === 0;
  }
}

function globalValue(g) {
  switch (g.k) {
    case 'Int': return g.v;
    case 'Float': return new ZFloat(g.v);
    case 'Bool': return g.v;
    case 'Char': return mkChar(g.cp);
    case 'Str': return g.v;
    case 'Unit': return UNIT;
    case 'Array': return new ZArray(g.items.map(globalValue));
    case 'Tuple': return new ZTuple(g.items.map(globalValue));
    case 'Dict': return new ZDict(new Map(g.fields.map(([k, x]) => [k, globalValue(x)])));
  }
  throw new Error(`unknown global initializer ${g.k}`);
}

// ── `<<` with a type (vm_validate_input) ─────────────────────────────────────

function describeInputKind(kind) {
  switch (kind.k) {
    case 'Raw': return 'text';
    case 'Text': return kind.max == null ? 'text' : `text of up to ${kind.max} characters`;
    case 'Numeric': case 'Float': return 'a number';
    case 'Decimal': return `a number with up to ${kind.total} digits and ${kind.decimals} decimals`;
    case 'Int': return kind.maxDigits == null ? 'an integer' : `an integer of up to ${kind.maxDigits} digits`;
    case 'Char': return 'a single character';
  }
}

function validateInput(s, kind) {
  const bad = () => ({ ok: false, hint: describeInputKind(kind) });
  switch (kind.k) {
    case 'Raw': return { ok: true, value: s };
    case 'Numeric': {
      let n = parseNum(s);
      if (n === null) { const a = asciiNumber(s); n = a === null ? null : parseNum(a); }
      if (n === null) return { ok: true, value: s };
      return { ok: true, value: 'int' in n ? n.int : new ZFloat(n.float) };
    }
    case 'Float': {
      const n = parseNum(asciiDigits(s));
      if (n === null) return bad();
      return { ok: true, value: new ZFloat('int' in n ? n.int : n.float) };
    }
    case 'Decimal': {
      const t = asciiDigits(s);
      const n = parseNum(t);
      if (n === null) return bad();
      const body = t[0] === '+' || t[0] === '-' ? t.slice(1) : t;
      let intD = 0, fracD = 0, dot = false;
      for (const c of body) {
        if (c === '.') { if (dot) return bad(); dot = true; }
        else if (c >= '0' && c <= '9') { if (dot) fracD++; else intD++; }
        else return bad();
      }
      if (fracD > kind.decimals || intD + fracD > kind.total) return bad();
      return { ok: true, value: new ZFloat('int' in n ? n.int : n.float) };
    }
    case 'Int': {
      const t = asciiDigits(s);
      if (!/^[+-]?[0-9]+$/.test(t)) return bad();
      const n = Number(t) + 0;
      if (!Number.isSafeInteger(n)) return bad();
      if (kind.maxDigits != null && t.replace(/[^0-9]/g, '').length > kind.maxDigits) return bad();
      return { ok: true, value: n };
    }
    case 'Text':
      if (kind.max != null && charLen(s) > kind.max) return bad();
      return { ok: true, value: s };
    case 'Char': {
      const cps = codePoints(s);
      return cps.length === 1 ? { ok: true, value: mkChar(cps[0]) } : bad();
    }
  }
}

/**
 * What in `program` this machine cannot run yet — an instruction or a std/
 * native — or null. Asked before running, so a program is never half run.
 */
export function unsupportedIn(program, opsTable) {
  const NATIVES = new Set([...Array(22).keys(), 100, 101, 102, 103]);
  for (const c of [program.main, ...program.functions]) {
    for (const ins of c.code) {
      const name = opsTable[ins.op][0];
      if (!IMPLEMENTED.has(name)) return `instruction ${name}`;
      if (name === 'CallBuiltin' && !NATIVES.has(ins.b)) return `std native #${ins.b}`;
    }
  }
  return null;
}

/** The instructions this machine runs today, by name: what tools/isa_usage.mjs counts against. */
export const IMPLEMENTED = new Set([
  'LoadInt', 'LoadFloat', 'LoadBool', 'LoadStr', 'LoadChar', 'LoadUnit', 'MakeFunc', 'MakeLambda', 'MakeClosure',
  'CopyReg', 'MoveReg', 'AddInt', 'SubInt', 'MulInt', 'DivInt', 'ModInt', 'PowInt', 'NegInt',
  'AddIntImm', 'SubIntImm', 'MulIntImm', 'CmpEqImm', 'CmpNeImm', 'CmpLtImm', 'CmpLeImm', 'CmpGtImm', 'CmpGeImm',
  'AddFloat', 'SubFloat', 'MulFloat', 'DivFloat', 'PowFloat', 'NegFloat', 'IntToFloat', 'FloatToIntRound',
  'FloatToIntTrunc', 'IntToChar', 'ConcatStr', 'ConcatBuild', 'StrLen', 'StrRepeat', 'StrSplit', 'StrChars',
  'StrCharNext', 'BuildStr', 'CmpEq', 'CmpNe', 'CmpLt', 'CmpLe', 'CmpGt', 'CmpGe', 'And', 'Or', 'Not', 'IsInt',
  'AsLoopCond', 'Jump', 'JumpIf', 'JumpIfNot', 'JumpIfNotCond', 'RangeStep', 'IterStep', 'Call', 'TailCall',
  'Return', 'CallDynamic', 'CallBuiltin', 'Print', 'PrintNewline', 'SetNumeralMode', 'NewArray', 'ArrayPush',
  'ArrayGet', 'ArrayLen', 'ArrayContains', 'HofItems', 'HofNext', 'HofRebuild', 'ArraySort', 'DestructureCheck',
  'LoopStepCheck', 'LoopBoundsCheck', 'CallableCheck', 'CallableCheckNamed', 'NavRangeCheck', 'NavStepCheck',
  'MakeTuple', 'MakeNamedTuple', 'NamedTupleGet', 'RequireDict', 'RequireBool', 'TypeOf', 'IsArray',
  'MatchInt', 'MatchRange', 'MatchCharRange', 'MatchStr', 'MatchBool',
  'TryBegin', 'TryEnd', 'TryLand', 'LoadErrorKind', 'TryHandled', 'TryRethrow', 'IsError', 'MakeError',
  'ErrorKindIs', 'ErrorMessage', 'RaiseError', 'SetupOutputWriteback', 'DetachGlobal', 'LoadGlobal',
  'StoreGlobal', 'ReadLine', 'HotInit', 'LoadCliArgs', 'DeepSet', 'DeepSetInPlace', 'SetOne', 'SetOneInPlace',
  'IterPairs', 'AssertMutable', 'Halt',
  'StrContains', 'StrSlice', 'StrFindPos', 'StrInsert', 'StrRemove', 'StrReplace', 'StrReplaceN',
  'ArrayRemove', 'ArrayRemoveValue', 'ArrayRemoveAll', 'ArrayInsert', 'ArrayRemoveRange', 'ArrayRemoveCount',
  'ArraySlice', 'ArraySliceCount', 'StrSliceCount', 'OutputSlotCheck', 'Pos', 'DestroyLocal', 'CheckAlive',
  'Revive', 'DestructureAbsorb', 'DestructureRest', 'DestructureTail', 'DestroyGlobal', 'NumericEval',
  'BaseConvert', 'FmtThousands', 'FmtScientific', 'RoundFloat', 'TruncFloat', 'FmtThousandsDyn',
  'FmtScientificDyn', 'RoundFloatDyn', 'TruncFloatDyn', 'Sleep',
]);
