#!/usr/bin/env node
// Regression tests for the browser-side .zyp path: the ZIP reader (zyp.js) and the
// path-normalizing module resolver (module-resolver.js).
//
//   node test_zyp.mjs
//
// Self-contained: builds its own .zyp fixtures in memory with a minimal STORED-only ZIP
// writer below, so it needs neither the `zymbol` binary nor any npm dependency (web/ has
// no build step and no package.json — see CLAUDE.md).
//
// These cover the two defects an audit of the original implementation turned up on this
// side: `readZyp` accepting traversing entry names that the Rust reader rejected (the two
// readers disagreeing about what a valid package is), and the earlier resolver that
// collapsed every import to its basename — colliding same-named modules in different
// directories and never returning `resolvedPath`, so the interpreter's module cache
// treated one file reached by two relative paths as two separate modules.

import { readZyp } from '../src/zymbol/zyp.js';
import { joinPath, makeResolver } from '../src/zymbol/module-resolver.js';

// ─── Minimal STORED-only ZIP writer (no compression, so no deflate dependency) ───────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** @param {Array<[string, string|Uint8Array]>} entries → ArrayBuffer of a valid .zip */
function makeZip(entries) {
  const enc = new TextEncoder();
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const [name, content] of entries) {
    const nameBytes = enc.encode(name);
    const data = typeof content === 'string' ? enc.encode(content) : content;
    const crc = crc32(data);

    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);      // version needed
    lv.setUint16(6, 0x0800, true);  // UTF-8 name flag (EFS)
    lv.setUint16(8, 0, true);       // method: stored
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);
    locals.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centrals.push(central);

    offset += local.length;
  }

  const cdSize = centrals.reduce((n, c) => n + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);

  const total = offset + cdSize + eocd.length;
  const out = new Uint8Array(total);
  let p = 0;
  for (const l of locals)   { out.set(l, p); p += l.length; }
  for (const c of centrals) { out.set(c, p); p += c.length; }
  out.set(eocd, p);
  return out.buffer;
}

function manifestPair(scripts) {
  const toml = `[package]\nname = "t"\nversion = "0.1.0"\n`;
  const json = JSON.stringify({ package: { name: 't', version: '0.1.0' }, scripts });
  return [['zyp.toml', toml], ['zyp.json', json]];
}

// ─── Harness ────────────────────────────────────────────────────────────────────────
let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? '  ok  ' : '  FAIL'}  ${name}`);
  if (!cond) failures++;
};
async function throws(name, fn, pattern) {
  try {
    await fn();
    check(name, false);
  } catch (e) {
    check(`${name} (${e.message})`, pattern.test(e.message));
  }
}

// ─── readZyp ────────────────────────────────────────────────────────────────────────
console.log('readZyp');
{
  const zip = makeZip([
    ...manifestPair([{ name: 'main', path: 'main.zy', default: true }]),
    ['src/main.zy', '>> "hi"\n'],
    ['src/核/盤.zy', 'BOARD'],
    ['src/言語/한국어.zy', 'KO'],
  ]);
  const { manifest, files } = await readZyp(zip);
  check('parses zyp.json (not zyp.toml — no TOML parser in the browser)', manifest.package.name === 't');
  check('exposes scripts under the plural key', Array.isArray(manifest.scripts) && manifest.scripts.length === 1);
  check('strips the src/ prefix', files.has('main.zy'));
  check('preserves CJK path components', files.get('核/盤.zy') === 'BOARD');
  check('preserves Hangul path components (NFC, not decomposed)', files.get('言語/한국어.zy') === 'KO');
  check('does not expose zyp.toml/zyp.json as source files', !files.has('zyp.toml') && !files.has('zyp.json'));
}

await throws(
  'rejects a traversing entry name inside src/',
  () => readZyp(makeZip([...manifestPair([]), ['src/../../evil.zy', 'x']])),
  /unsafe path/,
);
await throws(
  'rejects an absolute entry name inside src/',
  () => readZyp(makeZip([...manifestPair([]), ['src//etc/passwd', 'x']])),
  /unsafe path/,
);
await throws(
  'reports a missing manifest instead of throwing something opaque',
  () => readZyp(makeZip([['src/a.zy', 'x']])),
  /zyp\.json not found/,
);
await throws(
  'reports a non-zip input clearly',
  () => readZyp(new TextEncoder().encode('this is not a zip at all').buffer),
  /not a zip file/,
);

// ─── joinPath ───────────────────────────────────────────────────────────────────────
console.log('joinPath');
check('strips ./',                     joinPath('', './a.zy') === 'a.zy');
check('resolves ../ across dirs',      joinPath('表示', '../核/盤.zy') === '核/盤.zy');
check('resolves multiple ../',         joinPath('a/b/c', '../../d.zy') === 'a/d.zy');
check('escaping the root yields null', joinPath('', '../x.zy') === null);
check('escaping from depth is null',   joinPath('a', '../../x.zy') === null);

// ─── makeResolver ───────────────────────────────────────────────────────────────────
console.log('makeResolver');
{
  const fileMap = new Map([
    ['核/盤.zy', 'BOARD'],
    ['表示/描画.zy', 'DRAW'],
    ['盤.zy', 'ROOT-BOARD'],   // same basename as 核/盤.zy — the old resolver collided these
  ]);
  const get = p => fileMap.get(p);

  const fromDisplay = makeResolver(get, '表示');
  const hit = await fromDisplay('../核/盤');
  check('resolves ../ to the right directory', hit.src === 'BOARD');
  check('returns resolvedPath (the module cache key)', hit.resolvedPath === '核/盤.zy');
  check('returns a nested resolver', typeof hit.resolver === 'function');

  const nested = await hit.resolver('../表示/描画');
  check('nested resolver is rooted at the resolved file\'s own dir', nested.src === 'DRAW');

  const root = makeResolver(get, '');
  check('same basename in a different dir does NOT collide', (await root('./盤')).src === 'ROOT-BOARD');

  // The same file reached by two different import strings must produce one cache key, or
  // the interpreter loads and runs it twice with two copies of its module state.
  const viaRoot = await root('./核/盤');
  check('one file, one resolvedPath regardless of import spelling',
        viaRoot.resolvedPath === hit.resolvedPath);

  const miss = await root('../../nope');
  check('escaping returns notFound rather than a bogus path', miss.notFound === true);
  check('a genuinely absent module returns notFound', (await root('./ausente')).notFound === true);
}

console.log(failures === 0 ? '\nAll zyp web tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
