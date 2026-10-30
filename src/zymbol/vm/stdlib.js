// SPDX-License-Identifier: AGPL-3.0-only
// Part of zymbol_vm.js (a port of crates/zymbol-vm; see values.js for the notice).
//
// std/json, std/io, std/net, std/time and std/term for the machine: zymbol.js's
// own implementations (`buildStdlibModule`), which the gate already holds to the
// Rust engines' goldens, reached through a translation of values both ways. One
// implementation of each module serves the old engine and the new one while
// both live; when zymbol.js goes, these move here.
//
// std/io works on a virtual file system, one per run, as in zymbol.js: the
// browser has no other. A host may give its own (`host.vfs`).
//
// A native that answers with a Promise (std/net) is handed back to the machine
// as one; the machine waits for it (status 'await') — see machine.js.

import { buildStdlibModule, ZyError, ZyRuntimeError } from '../zymbol.js';
import {
  T_INT, T_FLOAT, T_BOOL, T_CHAR, T_UNIT, T_FUNC, T_STR, T_ARRAY, T_TUPLE, T_DICT, T_CLOSURE, T_ERROR,
  ZFloat, ZArray, ZTuple, ZDict, ZError, UNIT, mkChar, tagOf,
} from './values.js';
import { VmErr } from './machine.js';

/** builtin id → [module, function], zymbol_bytecode::builtins. */
const IDS = new Map([
  [200, ['std/json', 'decode']], [201, ['std/json', 'encode']], [202, ['std/json', 'decode_map']],
  [300, ['std/io', 'read']], [301, ['std/io', 'write']], [302, ['std/io', 'append']], [303, ['std/io', 'exists']],
  [304, ['std/io', 'delete']], [305, ['std/io', 'list']], [306, ['std/io', 'mkdir']],
  [400, ['std/net', 'get']], [401, ['std/net', 'post']], [402, ['std/net', 'post_json']], [403, ['std/net', 'head']],
  [404, ['std/net', 'timeout']],
  [600, ['std/term', 'width']], [601, ['std/term', 'pad_left']], [602, ['std/term', 'pad_right']],
  [603, ['std/term', 'center']], [604, ['std/term', 'truncate']],
  [700, ['std/time', 'now']], [701, ['std/time', 'today']], [702, ['std/time', 'parts']], [703, ['std/time', 'of']],
  [704, ['std/time', 'format']], [705, ['std/time', 'add']], [706, ['std/time', 'diff']],
]);
export const BRIDGED = new Set(IDS.keys());

/** A machine value as zymbol.js holds it. */
export function toZy(v) {
  switch (tagOf(v)) {
    case T_INT: return { type: 'int', v };
    case T_FLOAT: return { type: 'float', v: v.v };
    case T_BOOL: return { type: 'bool', v };
    case T_STR: return { type: 'str', v };
    case T_CHAR: return { type: 'char', v: String.fromCodePoint(v.cp) };
    case T_UNIT: return { type: 'unit' };
    case T_ARRAY: return { type: 'arr', v: v.items.map(toZy) };
    case T_TUPLE: return { type: 'tuple', v: v.items.map(toZy), keys: null };
    case T_DICT: return { type: 'tuple', v: [...v.map.values()].map(toZy), keys: [...v.map.keys()] };
    case T_ERROR: {
      const i = v.s.indexOf('(');
      return { type: 'error', errType: v.s.slice(0, i), v: v.s.slice(i + 1, -1) };
    }
    case T_FUNC: case T_CLOSURE: return { type: 'func', name: '<function>' };
  }
  throw new Error(`stdlib bridge: value ${String(v)}`);
}

/** A zymbol.js value as the machine holds it. */
export function fromZy(z) {
  switch (z?.type) {
    case 'int': return z.v;
    case 'float': return new ZFloat(z.v);
    case 'bool': return z.v;
    case 'str': return z.v;
    case 'char': return mkChar(z.v.codePointAt(0));
    case 'unit': case undefined: return UNIT;
    case 'arr': return new ZArray(z.v.map(fromZy));
    case 'tuple':
      if (z.keys != null) return new ZDict(new Map(z.keys.map((k, i) => [k, fromZy(z.v[i])])));
      return new ZTuple(z.v.map(fromZy));
    case 'error': return new ZError(`${z.errType}(${z.v})`);
  }
  throw new Error(`stdlib bridge: zymbol.js value ${z?.type}`);
}

/** An error a zymbol.js native threw, as the machine raises it. */
export function errorFrom(e) {
  if (e instanceof ZyRuntimeError && e.kindDeclared) return new VmErr(e.errType.replace(/^##/, ''), e.message);
  if (e instanceof ZyError) return new VmErr(null, e.message);
  return e;
}

/** The std natives of one run: `call(id, args)` → a machine value, or a Promise of one. */
export function makeStdlib(host) {
  const vfs = host.vfs ?? { files: new Map(), dirs: new Set() };
  const modules = new Map();
  const fn = (mod, name) => {
    if (!modules.has(mod)) modules.set(mod, buildStdlibModule(mod, vfs));
    return modules.get(mod)?.exports.get(name);
  };
  return {
    call(id, args) {
      const [mod, name] = IDS.get(id);
      const f = fn(mod, name);
      if (!f) throw new VmErr(null, `standard library function ${mod}::${name} is not available here`);
      let r;
      try { r = f.call(args.map(toZy)); } catch (e) { throw errorFrom(e); }
      if (r && typeof r.then === 'function') return r.then(fromZy, e => errorFrom(e));
      return fromZy(r);
    },
  };
}
