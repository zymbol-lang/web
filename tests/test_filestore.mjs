#!/usr/bin/env node
// Regression tests for the playground's file model (src/playground/filestore.js).
//
//   node tests/test_filestore.mjs
//
// The invariant worth protecting is the mounted/open split. Before it existed, the file list
// and the tab strip were the same array, so loading a 22-file `.zyp` opened 22 tabs and
// closing a tab removed the file from the module resolver — a package would then fail to
// import a module that was still, as far as the user could tell, right there. Every test
// below is about that boundary, plus the persistence rule that keeps clean example files out
// of localStorage (they are re-fetched from examples/ instead).
//
// Plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md). localStorage is
// stubbed because filestore.js is written for the browser.

const stored = new Map();
globalThis.localStorage = {
  getItem: k => (stored.has(k) ? stored.get(k) : null),
  setItem: (k, v) => stored.set(k, String(v)),
  removeItem: k => stored.delete(k),
};

const { createStore, USER, dirOf, baseOf } = await import('../src/playground/filestore.js');

let failures = 0;
function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ' :: ' + detail}`);
  if (!ok) failures++;
}
function section(n) { console.log(`\n${n}`); }

const bundle = (id, entries, { title = id, root = '', scripts = [] } = {}) => ({
  id, title, root, scripts, files: new Map(entries),
});

// ─── path helpers ─────────────────────────────────────────────────────────────
section('path helpers');
check('dirOf of a nested name', dirOf('packages/go/核/盤.zy') === 'packages/go/核');
check('dirOf of a bare name is empty', dirOf('prog1.zy') === '');
check('baseOf strips the directory', baseOf('packages/go/核/盤.zy') === '盤.zy');

// ─── mounting does not open ───────────────────────────────────────────────────
section('mounting is not opening');
{
  stored.clear();
  const store = createStore();
  store.load();
  const initialTabs = store.tabs().length;
  check('a fresh store has exactly one tab', initialTabs === 1, String(initialTabs));

  store.mountBundle(bundle('pkg', [
    ['packages/go/go.zy', 'ENTRY'],
    ['packages/go/核/盤.zy', 'BOARD'],
    ['packages/go/表示/描画.zy', 'DRAW'],
  ], { root: 'packages/go', scripts: [{ name: 'go', path: 'packages/go/go.zy', default: true }] }));

  check('all 3 files are mounted', store.all().length === initialTabs + 3, String(store.all().length));
  check('mounting opened no tabs', store.tabs().length === initialTabs, String(store.tabs().length));
  check('an unopened mounted file is visible to the resolver',
        store.codeOf('packages/go/核/盤.zy') === 'BOARD');

  // The whole point: run the entry with one tab open, resolve the other 2 from the store.
  const entry = store.byName('packages/go/go.zy');
  store.open(entry.id);
  check('opening one file gives one more tab', store.tabs().length === initialTabs + 1);
  check('the other files stay closed but mounted',
        !store.isOpen(store.byName('packages/go/表示/描画.zy').id) &&
        store.codeOf('packages/go/表示/描画.zy') === 'DRAW');
}

// ─── closing a tab ≠ unmounting ──────────────────────────────────────────────
section('closing a tab keeps the file resolvable');
{
  stored.clear();
  const store = createStore();
  store.load();
  store.mountBundle(bundle('proj', [['projects/p/mod.zy', 'MOD'], ['projects/p/app.zy', 'APP']],
                           { root: 'projects/p' }));
  const app = store.byName('projects/p/app.zy');
  store.open(app.id);
  store.closeTab(app.id);
  check('the tab is gone', !store.isOpen(app.id));
  check('the file is still mounted', store.byName('projects/p/app.zy') !== null);
  check('the resolver still finds it', store.codeOf('projects/p/app.zy') === 'APP');

  store.unmount(app.id);
  check('unmount removes it from the resolver', store.codeOf('projects/p/app.zy') === undefined);
  check('its sibling is untouched', store.codeOf('projects/p/mod.zy') === 'MOD');

  store.unmountBundle('proj');
  check('unmountBundle clears the whole mount', store.mountList().length === 0);
  check('there is always at least one file left', store.all().length >= 1);
  check('there is always an active file', store.active() !== null);
}

// ─── unsaved edits are never silently replaced ───────────────────────────────
section('conflict detection');
{
  stored.clear();
  const store = createStore();
  store.load();
  const b = bundle('ex', [['collections/map.zy', 'ORIGINAL']]);
  store.mountBundle(b);
  const f = store.byName('collections/map.zy');
  store.open(f.id);
  store.setActiveCode('EDITED');
  check('editing marks the file dirty', store.byName('collections/map.zy').dirty === true);
  check('a re-mount of edited content is reported as a conflict',
        store.conflictsWith(b).length === 1);

  store.mountBundle(b);                       // default: do not overwrite dirty
  check('without permission the edit survives', store.codeOf('collections/map.zy') === 'EDITED');
  store.mountBundle(b, { overwriteDirty: true });
  check('with permission the fresh copy wins', store.codeOf('collections/map.zy') === 'ORIGINAL');
  check('and the file is clean again', store.byName('collections/map.zy').dirty === false);

  // Re-mounting identical content is not a conflict — reopening an example you never
  // touched must not raise a dialog.
  const clean = bundle('ex2', [['loops/range.zy', 'SAME']]);
  store.mountBundle(clean);
  check('an unmodified file is not a conflict', store.conflictsWith(clean).length === 0);
}

// ─── persistence ─────────────────────────────────────────────────────────────
section('persistence');
{
  stored.clear();
  let store = createStore();
  store.load();
  store.mountBundle(bundle('pkg-go', [
    ['packages/go/go.zy', 'ENTRY'],
    ['packages/go/核/盤.zy', 'BOARD'],
  ], { title: 'GO', root: 'packages/go',
       scripts: [{ name: 'go', path: 'packages/go/go.zy', default: true }] }));
  const mine = store.newFile('mine.zy', 'MINE');
  const entry = store.byName('packages/go/go.zy');
  store.open(entry.id);
  store.save();

  const raw = JSON.parse(stored.get('zy-files'));
  const names = raw.files.map(f => f.name);
  check('user files are persisted verbatim', names.includes('mine.zy'));
  check('clean example files are NOT persisted (they are re-fetched)',
        !names.includes('packages/go/核/盤.zy'), names.join(', '));
  check('the mount id is persisted so it can be restored',
        raw.mounts.some(m => m.id === 'pkg-go'), JSON.stringify(raw.mounts));
  check('open tabs belonging to a mount are remembered by name',
        raw.openMountFiles.includes('packages/go/go.zy'), JSON.stringify(raw.openMountFiles));

  // Now edit a mounted file: an edit cannot be re-fetched, so it must be stored.
  store.open(store.byName('packages/go/核/盤.zy').id);
  store.setActiveCode('BOARD EDITED');
  store.save();
  const raw2 = JSON.parse(stored.get('zy-files'));
  check('an edited example file IS persisted',
        raw2.files.some(f => f.name === 'packages/go/核/盤.zy' && f.code === 'BOARD EDITED'));

  // Reload
  store = createStore();
  const restore = store.load();
  check('reload restores the user file', store.codeOf('mine.zy') === 'MINE');
  check('reload restores the edited example file',
        store.codeOf('packages/go/核/盤.zy') === 'BOARD EDITED');
  check('reload reports which mounts to re-fetch', restore.mountIds.includes('pkg-go'),
        JSON.stringify(restore.mountIds));
  check('reload reports which mount files were open',
        restore.openNames.includes('packages/go/go.zy'), JSON.stringify(restore.openNames));
}

// ─── v1 store migration ──────────────────────────────────────────────────────
section('v1 migration');
{
  stored.clear();
  // What the previous playground wrote: no `v`, no `openIds` — every file was a tab.
  stored.set('zy-files', JSON.stringify({
    files: [
      { id: 'a', name: 'prog1.zy', code: 'A', dirty: false },
      { id: 'b', name: 'prog2.zy', code: 'B', dirty: true },
    ],
    activeId: 'b',
  }));
  const store = createStore();
  store.load();
  check('every v1 file is still a tab', store.tabs().length === 2, String(store.tabs().length));
  check('the v1 active file is still active', store.activeId === 'b');
  check('v1 files default to the user origin', store.all().every(f => f.origin === USER));
}

// ─── renaming ────────────────────────────────────────────────────────────────
section('renaming');
{
  stored.clear();
  const store = createStore();
  store.load();
  const f = store.newFile('a.zy', 'A');
  store.newFile('b.zy', 'B');
  store.rename(f.id, 'renamed');
  check('a missing .zy extension is added', store.byName('renamed.zy') !== null);
  store.rename(f.id, 'b.zy');
  check('renaming onto an existing name is refused', store.byName('renamed.zy') !== null);
}

console.log(failures === 0 ? '\nAll filestore tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
