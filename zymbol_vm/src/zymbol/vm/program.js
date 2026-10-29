// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// A CompiledProgram, as the Rust compiler wrote it, into the form the machine
// runs. Today it arrives as JSON (tools/zyb_dump, a stand-in for `zymbol
// compile`); a binary .zyb would be read into the very same form.
//
// An instruction becomes one object of a single shape, `{op, a, b, c, d, e, f,
// g}`: its opcode — the position of its variant in Rust's enum, see isa.js —
// and its operands in declaration order. One shape for all of them is what
// keeps every operand read in the dispatch loop monomorphic.

import { OP, OPS } from './isa.js';

class Ins {
  constructor(op) { this.op = op; this.a = 0; this.b = 0; this.c = 0; this.d = 0; this.e = 0; this.f = 0; this.g = 0; }
}
const SLOTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

// JSON has no infinity and no NaN: zyb_dump spells them as Rust's `{}` does.
function floatOf(raw, where) {
  if (typeof raw === 'number') return raw;
  if (raw === 'inf') return Infinity;
  if (raw === '-inf') return -Infinity;
  if (raw === 'NaN') return NaN;
  throw new Error(`${where}: not a float: ${JSON.stringify(raw)}`);
}

function operand(type, raw, where) {
  switch (type) {
    case 'f64': return floatOf(raw, where);
    case 'i64':
      if (!Number.isSafeInteger(raw)) throw new Error(`${where}: integer constant ${raw} is outside ±(2^53−1)`);
      return raw;
    case 'char': return raw.codePointAt(0);
    case 'Option<Reg>': return raw === null ? -1 : raw;
    // A literal is ~index (negative), a register its number.
    case 'Vec<BuildPart>': return raw.map(p => ('Lit' in p ? ~p.Lit : p.Reg));
    case 'Vec<(u16, Reg)>': return raw.map(([p, r]) => [p, r]);
    case 'InputKind':
      if (typeof raw === 'string') return { k: raw };
      if ('Decimal' in raw) return { k: 'Decimal', total: raw.Decimal.total, decimals: raw.Decimal.decimals };
      if ('Int' in raw) return { k: 'Int', maxDigits: raw.Int.max_digits };
      if ('Text' in raw) return { k: 'Text', max: raw.Text.max };
      throw new Error(`${where}: unknown InputKind ${JSON.stringify(raw)}`);
    default: return raw;   // Reg, Label, FuncIdx, StrIdx, u8, u16, u32, i32, bool, HotNeutral, Vec<Reg>, Vec<StrIdx>
  }
}

function instruction(json, where) {
  const name = typeof json === 'string' ? json : Object.keys(json)[0];
  const op = OP[name];
  if (op === undefined) throw new Error(`${where}: unknown instruction ${name} — isa.js is older than the compiler`);
  const types = OPS[op][1];
  let fields = typeof json === 'string' ? [] : json[name];
  // A variant of one field is written as the field itself, not as a list of one.
  if (types.length === 1) fields = [fields];
  const ins = new Ins(op);
  for (let i = 0; i < types.length; i++) ins[SLOTS[i]] = operand(types[i], fields[i], `${where} ${name}`);
  return ins;
}

function chunk(json, index) {
  const where = `chunk ${index < 0 ? '<main>' : index} (${json.name})`;
  return {
    name: json.name,
    code: json.instructions.map((ins, i) => instruction(ins, `${where} #${i}`)),
    nregs: json.num_registers,
    nparams: json.num_params,
    src: json.src ?? [],
  };
}

function globalInit(g) {
  if (g === 'Unit') return { k: 'Unit' };
  const k = Object.keys(g)[0], v = g[k];
  switch (k) {
    case 'Array': case 'Tuple': return { k, items: v.map(globalInit) };
    case 'Dict': return { k, fields: v.map(([key, x]) => [key, globalInit(x)]) };
    case 'Char': return { k, cp: v.codePointAt(0) };
    case 'Float': return { k, v: floatOf(v, 'global') };
    default: return { k, v };
  }
}

/** Load a CompiledProgram from the JSON `zyb_dump` writes. */
export function loadProgram(json) {
  const p = typeof json === 'string' ? JSON.parse(json) : json;
  return {
    main: chunk(p.main, -1),
    functions: p.functions.map((c, i) => chunk(c, i)),
    strings: p.string_pool,
    globals: p.global_var_inits.map(globalInit),
    files: p.files ?? [],
  };
}
