// SPDX-License-Identifier: AGPL-3.0-only
/**
 * catalog.js — the example pool.
 *
 * The pool is `web/examples/`: real `.zy` files and `.zyp` archives, indexed by a
 * hand-curated `examples/catalog.json`. It used to be `examples.js`, ~1000 lines of
 * inline JS string literals; moving it to files is what makes the pool auditable —
 * `zymbol check`, `tests/test_runner.mjs --dir examples` and `tests/test_catalog.mjs`
 * all operate on files and could never see a string baked into a JS module. (When the
 * examples lived inline, four of them had been broken since v0.0.6 and nothing noticed.)
 *
 * An entry is one of three shapes, and all three mount the same way:
 *
 *   { path }                  one loose file
 *   { dir, files[], entry }   a multi-file project (its own imports resolve inside `dir`)
 *   { zyp }                   a packaged program, read with the same reader as ↑ Upload
 *
 * Mounted names are namespaced by the entry's own location (`collections/map.zy`,
 * `games/classic/go/核/盤.zy`) so that two examples sharing a basename — or two packages both
 * shipping a `texto.zy` — can be mounted at once without silently overwriting each other.
 * Relative imports keep working because resolution is relative to the importing file's
 * own directory (see module-resolver.js).
 *
 * That namespacing is also the deep-link address space: `?open=games/classic/go.zyp` and
 * `?open=rosetta-stone/Klingon_pIqaD.zy` are the entry's own location under `examples/`,
 * which is what makes a shared link readable and stable — see `resolveDeepLink`.
 */

import { readZyp } from '../zymbol/zyp.js';

const CATALOG_URL  = new URL('../../examples/catalog.json', import.meta.url);
const EXAMPLES_DIR = new URL('../../examples/', import.meta.url);

const KNOWN_NEEDS = ['tui', 'input', 'args', 'shell', 'net'];

let catalogPromise = null;
const sourceCache = new Map();   // mounted-name → code, for previews and re-mounts

/** A `file://` page can't fetch its own siblings; say so instead of showing an empty tree. */
function fetchHint() {
  return location.protocol === 'file:'
    ? ' — the playground was opened as a local file; serve the directory instead ' +
      '(e.g. `python3 -m http.server` in web/) so the browser is allowed to read examples/'
    : '';
}

async function fetchText(relPath) {
  const res = await fetch(new URL(relPath, EXAMPLES_DIR));
  if (!res.ok) throw new Error(`examples/${relPath}: HTTP ${res.status}${fetchHint()}`);
  return res.text();
}

/**
 * Loads and indexes `examples/catalog.json`. Cached: the tree is rebuilt on every filter
 * keystroke and must not re-fetch.
 * @returns {Promise<{schema:number, groups:Array, byId:Map<string,object>}>}
 */
export function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      let res;
      try {
        res = await fetch(CATALOG_URL);
      } catch (err) {
        throw new Error(`could not read examples/catalog.json${fetchHint()}`);
      }
      if (!res.ok) throw new Error(`examples/catalog.json: HTTP ${res.status}${fetchHint()}`);
      const catalog = await res.json();
      if (catalog.schema !== 1) {
        throw new Error(`examples/catalog.json: unsupported schema ${catalog.schema} (expected 1)`);
      }
      const byId = new Map();
      for (const group of catalog.groups ?? []) {
        for (const cat of group.categories ?? []) {
          for (const entry of cat.entries ?? []) {
            entry.group = group.id;
            entry.category = cat.id;
            byId.set(entry.id, entry);
          }
        }
      }
      catalog.byId = byId;
      return catalog;
    })().catch(err => { catalogPromise = null; throw err; });
  }
  return catalogPromise;
}

/** Root directory a mounted entry's files hang from — also its identity in the tree. */
export function mountRoot(entry) {
  if (entry.zyp) return entry.zyp.replace(/\.zyp$/, '');
  if (entry.dir) return entry.dir;
  return entry.path.includes('/') ? entry.path.slice(0, entry.path.lastIndexOf('/')) : '';
}

/**
 * Reads every file an entry needs, keyed by its mounted name. Does not touch the file
 * store — the caller decides what to do with unsaved edits (see playground.js).
 *
 * @returns {Promise<{ id, title, root, files: Map<string,string>, entryName: string,
 *                     scripts: Array<{name,path,desc,default}>, args?: string, needs: string[] }>}
 */
export async function mountEntry(entry) {
  const root  = mountRoot(entry);
  const files = new Map();
  let entryName, scripts = [];

  if (entry.zyp) {
    const res = await fetch(new URL(entry.zyp, EXAMPLES_DIR));
    if (!res.ok) throw new Error(`examples/${entry.zyp}: HTTP ${res.status}${fetchHint()}`);
    const pkg = await readZyp(await res.arrayBuffer());
    ({ entryName, scripts } = collectPackage(pkg, root, files));
  } else if (entry.dir) {
    for (const name of entry.files) {
      files.set(`${entry.dir}/${name}`, await fetchText(`${entry.dir}/${name}`));
    }
    entryName = `${entry.dir}/${entry.entry}`;
    if (!files.has(entryName)) {
      throw new Error(`catalog entry '${entry.id}': entry file '${entry.entry}' is not in files[]`);
    }
  } else {
    entryName = entry.path;
    files.set(entry.path, await fetchText(entry.path));
  }

  for (const [name, code] of files) sourceCache.set(name, code);
  return {
    id: entry.id, title: entry.title, icon: entry.icon, root, files, entryName, scripts,
    args: entry.args, needs: entry.needs ?? [],
  };
}

/** Where an entry answers to in a `?open=` link: its own path under `examples/`. */
export function deepLinkOf(entry) {
  if (entry.zyp) return entry.zyp;
  if (entry.dir) return `${entry.dir}/${entry.entry}`;
  return entry.path;
}

/**
 * Resolves `?open=<path>` — a path relative to `examples/` — to the entry that owns it, and
 * to one file inside that entry when the link points deeper than the entry itself.
 *
 * A link addresses what a person can see in the tree, so all four of these work:
 *
 *   games/classic/go.zyp              the archive
 *   games/classic/go                  its mount root (the extension is optional)
 *   games/classic/go/核/盤.zy          one file inside it — mounts the package, opens that file
 *   rosetta-stone/Klingon_pIqaD.zy    a loose example
 *
 * A catalog id (`pkg-go`) is accepted too, so an `?example=` id pasted into `?open=` still
 * lands somewhere instead of erroring.
 *
 * @returns {{entry: object, file?: string} | null}
 */
export function resolveDeepLink(catalog, raw) {
  const path = String(raw ?? '').trim().replace(/^\.?\//, '').replace(/\/+$/, '');
  if (!path) return null;

  const entries = [];
  for (const group of catalog.groups ?? []) {
    for (const cat of group.categories ?? []) entries.push(...(cat.entries ?? []));
  }

  for (const entry of entries) {
    if (entry.zyp === path || entry.path === path) return { entry };
    if (entry.dir && `${entry.dir}/${entry.entry}` === path) return { entry };
  }
  // Inside a bundle: `<root>/<file>` opens that file, `<root>` alone opens the entry file.
  for (const entry of entries) {
    if (!entry.zyp && !entry.dir) continue;
    const root = mountRoot(entry);
    if (path === root) return { entry };
    if (path.startsWith(root + '/')) return { entry, file: path };
  }
  const byId = catalog.byId?.get(path);
  return byId ? { entry: byId } : null;
}

/**
 * Shared by catalog `.zyp` entries and files picked with ↑ Upload, so a package behaves
 * identically whichever way it arrived.
 * @param {{manifest: object, files: Map<string,string>}} pkg
 * @param {string} root prefix for mounted names (`''` mounts at top level)
 */
export function collectPackage(pkg, root, files = new Map()) {
  const prefix = root ? root + '/' : '';
  for (const [path, code] of pkg.files) files.set(prefix + path, code);

  const scripts = (pkg.manifest.scripts ?? []).map(s => ({
    name: s.name, path: prefix + s.path, desc: s.desc, default: !!s.default,
  }));
  // A manifest can name a script that isn't in the archive (hand-edited zyp.toml, a
  // truncated build). Better to drop it from the picker than to offer a Run that can't work.
  const present = scripts.filter(s => files.has(s.path));
  const def = present.find(s => s.default) ?? present[0];
  return { files, scripts: present, entryName: def?.path ?? [...files.keys()][0], manifest: pkg.manifest };
}

/** First lines of an example, for the sidebar hover preview. Cached across hovers. */
export async function previewOf(entry, maxLines = 14) {
  const name = entry.zyp
    ? null
    : entry.dir ? `${entry.dir}/${entry.entry}` : entry.path;
  if (!name) return null;                       // packages: manifest only, no single source
  if (!sourceCache.has(name)) {
    try { sourceCache.set(name, await fetchText(name)); } catch { return null; }
  }
  const lines = sourceCache.get(name).split('\n');
  const head = lines.slice(0, maxLines).join('\n');
  return lines.length > maxLines ? head + '\n…' : head;
}

/** Validates the `needs` vocabulary — a typo there silently drops a capability badge. */
export function unknownNeeds(entry) {
  return (entry.needs ?? []).filter(n => !KNOWN_NEEDS.includes(n));
}

export { KNOWN_NEEDS };
