#!/usr/bin/env node
// Integrity tests for the example pool: examples/catalog.json against examples/ on disk.
//
//   node tests/test_catalog.mjs [--check]      # --check also runs `zymbol check` on every .zy
//
// The catalog is hand-curated on purpose (that is what keeps the sidebar a menu instead of a
// dump), so the thing that needs guarding is not its content but its consistency with the
// filesystem. Two failures matter most:
//
//   a dead reference   an entry pointing at a file that was renamed or removed → the
//                      sidebar offers an example that errors on click;
//   an orphan          a .zy under examples/ that no entry points at → an example nobody
//                      can reach from the UI, which is exactly how the old inline pool
//                      accumulated four files that had been broken since v0.0.6.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { readZyp } from '../src/zymbol/zyp.js';
import { resolveDeepLink, deepLinkOf, mountRoot } from '../src/playground/catalog.js';

const WEB_DIR      = dirname(dirname(fileURLToPath(import.meta.url)));
const EXAMPLES_DIR = join(WEB_DIR, 'examples');
const RUN_CHECK    = process.argv.includes('--check');

const KNOWN_NEEDS = ['tui', 'input', 'args', 'shell', 'net'];

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}
function section(name) { console.log(`\n${name}`); }

// ─── load ─────────────────────────────────────────────────────────────────────
const catalog = JSON.parse(readFileSync(join(EXAMPLES_DIR, 'catalog.json'), 'utf8'));

section('schema');
check('schema is 1', catalog.schema === 1, `got ${catalog.schema}`);
check('groups is a non-empty array', Array.isArray(catalog.groups) && catalog.groups.length > 0);

// ─── walk ─────────────────────────────────────────────────────────────────────
const groupIds = new Set();
const catIds   = new Set();
const entryIds = new Set();
/** path relative to examples/ → list of entry ids referencing it */
const refs = new Map();
let entryCount = 0;

function refer(path, entryId) {
  if (!refs.has(path)) refs.set(path, []);
  refs.get(path).push(entryId);
}

section('entries');
for (const group of catalog.groups) {
  check(`group '${group.id}' has a unique id`, !groupIds.has(group.id));
  groupIds.add(group.id);
  check(`group '${group.id}' has a title`, !!group.title);
  check(`group '${group.id}' has categories`,
        Array.isArray(group.categories) && group.categories.length > 0);

  for (const cat of group.categories ?? []) {
    const ck = `${group.id}/${cat.id}`;
    check(`category '${ck}' has a unique id`, !catIds.has(ck));
    catIds.add(ck);
    check(`category '${ck}' has a title`, !!cat.title);
    check(`category '${ck}' has entries`,
          Array.isArray(cat.entries) && cat.entries.length > 0);
    check(`category '${ck}' icon is a string`, cat.icon === undefined || typeof cat.icon === 'string');
    // `open` opts a category out of the folded-by-default tree; a string there ("true") would
    // silently do nothing.
    check(`category '${ck}' open is a boolean`,
          cat.open === undefined || typeof cat.open === 'boolean', `got ${typeof cat.open}`);

    for (const e of cat.entries ?? []) {
      entryCount++;
      check(`entry '${e.id}' has a unique id`, !entryIds.has(e.id));
      entryIds.add(e.id);
      check(`entry '${e.id}' has a title`, !!e.title);
      check(`entry '${e.id}' icon is a string`, e.icon === undefined || typeof e.icon === 'string');

      const shapes = ['path', 'dir', 'zyp'].filter(k => e[k] !== undefined);
      check(`entry '${e.id}' has exactly one of path/dir/zyp`, shapes.length === 1,
            `has: ${shapes.join(', ') || 'none'}`);

      for (const n of e.needs ?? []) {
        check(`entry '${e.id}' declares a known need`, KNOWN_NEEDS.includes(n),
              `unknown need '${n}' (known: ${KNOWN_NEEDS.join(', ')})`);
      }

      if (e.path) {
        check(`entry '${e.id}' points at an existing file`,
              existsSync(join(EXAMPLES_DIR, e.path)), `examples/${e.path}`);
        check(`entry '${e.id}' points at a .zy`, e.path.endsWith('.zy'), e.path);
        refer(e.path, e.id);
      } else if (e.dir) {
        check(`entry '${e.id}' lists its files`, Array.isArray(e.files) && e.files.length > 0);
        check(`entry '${e.id}' names an entry file`, !!e.entry);
        check(`entry '${e.id}' entry file is among files[]`, (e.files ?? []).includes(e.entry),
              `entry '${e.entry}' not in [${(e.files ?? []).join(', ')}]`);
        for (const f of e.files ?? []) {
          const rel = `${e.dir}/${f}`;
          check(`entry '${e.id}' file exists`, existsSync(join(EXAMPLES_DIR, rel)), `examples/${rel}`);
          refer(rel, e.id);
        }
      } else if (e.zyp) {
        check(`entry '${e.id}' points at an existing archive`,
              existsSync(join(EXAMPLES_DIR, e.zyp)), `examples/${e.zyp}`);
        refer(e.zyp, e.id);
      }
    }
  }
}

// ─── packages open, and their manifest scripts are really in the archive ──────
section('packages');
for (const group of catalog.groups) {
  for (const cat of group.categories ?? []) {
    for (const e of cat.entries ?? []) {
      if (!e.zyp) continue;
      const abs = join(EXAMPLES_DIR, e.zyp);
      if (!existsSync(abs)) continue;
      try {
        const buf = readFileSync(abs);
        const pkg = await readZyp(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
        check(`'${e.id}' archive has sources`, pkg.files.size > 0);
        const scripts = pkg.manifest.scripts ?? [];
        check(`'${e.id}' manifest declares at least one script`, scripts.length > 0);
        for (const s of scripts) {
          // A script the archive doesn't contain is a package whose Run cannot work.
          check(`'${e.id}' script '${s.name}' exists in the archive`, pkg.files.has(s.path), s.path);
        }
        check(`'${e.id}' declares a default script`,
              scripts.length <= 1 || scripts.some(s => s.default));
      } catch (err) {
        check(`'${e.id}' archive is readable`, false, String(err.message ?? err));
      }
    }
  }
}

// ─── deep links: playground.html?open=<path under examples/> ─────────────────
//
// A shared link addresses an entry by its own path, so what has to hold is that every entry
// is reachable by the path the playground itself puts in the address bar, and that no two
// entries answer to the same one.
section('deep links');
{
  const all = [];
  for (const group of catalog.groups) {
    for (const cat of group.categories ?? []) all.push(...(cat.entries ?? []));
  }
  // Same shape loadCatalog() hands the resolver, so the id fallback is exercised too.
  const rt = { groups: catalog.groups, byId: new Map(all.map(e => [e.id, e])) };

  for (const e of all) {
    const link = deepLinkOf(e);
    const hit = resolveDeepLink(rt, link);
    check(`entry '${e.id}' is reachable at ?open=${link}`, hit?.entry === e,
          hit ? `resolves to '${hit.entry.id}'` : 'resolves to nothing');
    check(`entry '${e.id}' is reachable by id`, resolveDeepLink(rt, e.id)?.entry === e);
  }

  // Bundle roots become directories in the workspace tree; one nested inside another would
  // make `?open=<root>/<file>` ambiguous and the tree misleading.
  const roots = all.filter(e => e.dir || e.zyp).map(e => [e.id, mountRoot(e)]);
  for (const [id, root] of roots) {
    for (const [otherId, other] of roots) {
      if (id === otherId) continue;
      check(`bundle root '${root}' (${id}) does not contain '${other}' (${otherId})`,
            other !== root && !other.startsWith(root + '/'));
    }
  }

  // A file inside a bundle opens that file; a bare root opens the entry file.
  const bundle = all.find(e => e.dir);
  if (bundle) {
    const inner = `${bundle.dir}/${bundle.files.find(f => f !== bundle.entry) ?? bundle.entry}`;
    const hit = resolveDeepLink(rt, inner);
    check('a file inside a bundle resolves to that file',
          hit?.entry === bundle && hit.file === inner, JSON.stringify(hit?.file));
    check('a bare bundle root resolves to the entry',
          resolveDeepLink(rt, bundle.dir)?.entry === bundle);
  }
  check('a leading ./ is tolerated',
        resolveDeepLink(rt, './' + deepLinkOf(all[0]))?.entry === all[0]);
  check('an unknown path resolves to nothing',
        resolveDeepLink(rt, 'nope/does-not-exist.zy') === null);
  check('an empty path resolves to nothing', resolveDeepLink(rt, '') === null);
}

// ─── orphans and duplicates ───────────────────────────────────────────────────
section('coverage');
function walkFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) out.push(...walkFiles(abs));
    else if (name.endsWith('.zy') || name.endsWith('.zyp')) out.push(relative(EXAMPLES_DIR, abs));
  }
  return out;
}
const onDisk = walkFiles(EXAMPLES_DIR).sort();
for (const rel of onDisk) {
  const who = refs.get(rel);
  check(`examples/${rel} is reachable from the catalog`, !!who,
        'no catalog entry references it — it would be dead weight on the site');
  if (who && who.length > 1) {
    // Two entries mounting the same file means two tree rows fighting over one buffer.
    check(`examples/${rel} is referenced once`, false, `referenced by: ${who.join(', ')}`);
  }
}
for (const [rel, who] of refs) {
  check(`referenced examples/${rel} exists`, onDisk.includes(rel), `wanted by: ${who.join(', ')}`);
}

// ─── optional: every example compiles ────────────────────────────────────────
if (RUN_CHECK) {
  section('zymbol check');
  let checked = 0, skipped = 0;
  for (const rel of onDisk) {
    if (!rel.endsWith('.zy')) continue;
    try {
      execFileSync('zymbol', ['check', join(EXAMPLES_DIR, rel)], { stdio: 'pipe' });
      checked++;
    } catch (err) {
      if (err.code === 'ENOENT') { skipped = onDisk.length; break; }
      const msg = String(err.stdout ?? '') + String(err.stderr ?? '');
      check(`examples/${rel} passes zymbol check`, false,
            msg.replace(/\x1b\[[0-9;]*m/g, '').split('\n').find(l => l.includes('error:')) ?? '');
    }
  }
  if (skipped) console.log('  ⬜ zymbol binary not on PATH — skipped');
  else console.log(`  ${checked} file(s) compiled`);
}

// ─── summary ─────────────────────────────────────────────────────────────────
const counts = catalog.groups.map(g => `${g.id}:${g.categories.length}`).join(' ');
console.log(`\n${entryCount} entries · ${catIds.size} categories · ${groupIds.size} groups (${counts})`);
console.log(`${onDisk.length} file(s) in examples/`);
console.log(failures === 0 ? '\nAll catalog tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
