/**
 * filestore.js — the playground's file model.
 *
 * The central distinction here is **mounted vs open**:
 *
 *   mounted  the file exists, appears in the sidebar tree, and is visible to the module
 *            resolver — so `<# ../核/盤` finds it
 *   open     the file also has a tab and can be shown in the editor
 *
 * They used to be the same list, which is why loading a 22-file `.zyp` package opened 22
 * tabs and buried the editor. Mounting no longer opens anything: an example mounts all its
 * files and opens exactly one, and the program still runs in full because
 * `buildModuleResolver` in playground.js reads `files`, not the tab strip.
 *
 * Persistence (localStorage `zy-files`):
 *   - user files and *edited* example files are stored verbatim — they can't be recovered
 *     from anywhere else;
 *   - clean example files are NOT stored; only the catalog entry id is, under `mounts`, and
 *     playground.js re-mounts them from `examples/` at boot. Storing them made every
 *     keystroke serialize the whole mounted tree (~128 KB with GO loaded) into a synchronous
 *     localStorage write.
 *   - writes are debounced, for the same reason.
 */

const LS_KEY   = 'zy-files';
const SAVE_MS  = 400;
export const EMPTY_CODE = '>> "Hello, Zymbol-Lang!" ¶';

/** Origin tags. `user` files are the ones the user created or uploaded. */
export const USER = 'user';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function dirOf(name) {
  return name.includes('/') ? name.slice(0, name.lastIndexOf('/')) : '';
}

export function baseOf(name) {
  return name.includes('/') ? name.slice(name.lastIndexOf('/') + 1) : name;
}

export function createStore({ onChange = () => {} } = {}) {
  /** @type {Array<{id:string,name:string,code:string,dirty:boolean,origin:string}>} */
  let files    = [];
  let openIds  = [];
  let activeId = null;
  /** @type {Map<string, {id:string, title:string, root:string, scripts:Array, names:string[]}>} */
  const mounts = new Map();
  let saveTimer = null;

  function changed({ save = true } = {}) {
    if (save) scheduleSave();
    onChange();
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, SAVE_MS);
  }

  function save() {
    clearTimeout(saveTimer);
    try {
      const keep = files.filter(f => f.origin === USER || f.dirty);
      localStorage.setItem(LS_KEY, JSON.stringify({
        v: 2,
        files: keep,
        // Only tabs whose file survives the filter above; the rest are re-opened by
        // playground.js once their mount is restored.
        openIds: openIds.filter(id => keep.some(f => f.id === id)),
        activeId: keep.some(f => f.id === activeId) ? activeId : null,
        mounts: [...mounts.values()].map(m => ({ id: m.id, title: m.title, root: m.root })),
        openMountFiles: openIds.filter(id => !keep.some(f => f.id === id))
                              .map(id => files.find(f => f.id === id)?.name)
                              .filter(Boolean),
        activeName: files.find(f => f.id === activeId)?.name ?? null,
      }));
    } catch {}
  }

  /**
   * @returns {{mountIds: string[], openNames: string[], activeName: string|null}} what the
   *   caller still has to restore asynchronously (catalog mounts aren't stored inline).
   */
  function load() {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(LS_KEY) ?? 'null'); } catch {}
    if (data && Array.isArray(data.files)) {
      files = data.files.map(f => ({
        id: f.id ?? genId(), name: f.name, code: f.code,
        dirty: f.dirty ?? false, origin: f.origin ?? USER,
      }));
      // v1 had no `openIds`: every file was a tab. Keep it that way for anyone coming back
      // to a session saved by the old playground.
      openIds  = Array.isArray(data.openIds) && data.v >= 2
        ? data.openIds.filter(id => files.some(f => f.id === id))
        : files.map(f => f.id);
      activeId = files.some(f => f.id === data.activeId) ? data.activeId : (openIds[0] ?? null);
    }
    if (!files.length) {
      const f = { id: genId(), name: 'prog1.zy', code: EMPTY_CODE, dirty: false, origin: USER };
      files = [f];
      openIds = [f.id];
      activeId = f.id;
    }
    if (!openIds.length && files.length) openIds = [files[0].id];
    if (!files.some(f => f.id === activeId)) activeId = openIds[0] ?? files[0].id;
    return {
      mountIds:   (data?.mounts ?? []).map(m => m.id),
      openNames:  data?.openMountFiles ?? [],
      activeName: data?.activeName ?? null,
    };
  }

  // ─── queries ────────────────────────────────────────────────────────────────
  const all        = () => files;
  const tabs       = () => openIds.map(id => files.find(f => f.id === id)).filter(Boolean);
  const active     = () => files.find(f => f.id === activeId) ?? null;
  const byId       = id => files.find(f => f.id === id) ?? null;
  const byName     = name => files.find(f => f.name === name) ?? null;
  const codeOf     = name => files.find(f => f.name === name)?.code;
  const isOpen     = id => openIds.includes(id);
  const mountList  = () => [...mounts.values()];
  const mountOf    = file => (file.origin === USER ? null : mounts.get(file.origin) ?? null);

  // ─── mutation ───────────────────────────────────────────────────────────────
  function uniqueName(prefix = 'prog') {
    const used = new Set(files.map(f => f.name));
    let n = 1;
    while (used.has(`${prefix}${n}.zy`)) n++;
    return `${prefix}${n}.zy`;
  }

  /** Mounts one file. Returns the file record; reuses an existing record with the same name. */
  function mount(name, code, { origin = USER, overwriteDirty = false } = {}) {
    const existing = byName(name);
    if (existing) {
      if (!existing.dirty || overwriteDirty) {
        existing.code = code;
        existing.dirty = false;
        existing.origin = origin;
      }
      return existing;
    }
    const f = { id: genId(), name, code, dirty: false, origin };
    files.push(f);
    return f;
  }

  /**
   * Mounts a whole example/package under one origin so it can be unmounted as a unit.
   * @param {{id,title,root,files:Map<string,string>,scripts?:Array}} bundle
   */
  function mountBundle(bundle, { overwriteDirty = false } = {}) {
    const origin = bundle.id;
    const names  = [];
    for (const [name, code] of bundle.files) {
      mount(name, code, { origin, overwriteDirty });
      names.push(name);
    }
    mounts.set(origin, {
      id: origin, title: bundle.title ?? origin, root: bundle.root ?? '',
      scripts: bundle.scripts ?? [], names,
      // `bundle` distinguishes a mount that owns its own directory (a .zyp or a multi-file
      // project, so the tree can hang a package node off it) from a single loose example,
      // whose "root" is just the shared category folder it happens to sit in.
      bundle: names.length > 1 || !!bundle.isBundle,
      kind: bundle.kind ?? 'dir',
    });
    changed();
    return mounts.get(origin);
  }

  /** Files of a mount that carry unsaved edits differing from the incoming copy. */
  function conflictsWith(bundle) {
    const out = [];
    for (const [name, code] of bundle.files) {
      const f = byName(name);
      if (f && f.dirty && f.code !== code) out.push(name);
    }
    return out;
  }

  function newFile(name = uniqueName(), code = EMPTY_CODE) {
    const f = mount(name, code, { origin: USER });
    open(f.id);
    return f;
  }

  /** Removes a file entirely: no tab, no tree entry, invisible to the resolver. */
  function unmount(id) {
    const idx = files.findIndex(f => f.id === id);
    if (idx < 0) return;
    const [gone] = files.splice(idx, 1);
    closeTab(id, { save: false });
    const m = mounts.get(gone.origin);
    if (m) {
      m.names = m.names.filter(n => n !== gone.name);
      if (!m.names.length) mounts.delete(gone.origin);
    }
    ensureSomething();
    changed();
  }

  /** Unmounts every file of one example/package. */
  function unmountBundle(origin) {
    for (const f of files.filter(f => f.origin === origin)) {
      const idx = files.indexOf(f);
      if (idx >= 0) files.splice(idx, 1);
      closeTab(f.id, { save: false });
    }
    mounts.delete(origin);
    ensureSomething();
    changed();
  }

  /** There must always be at least one file, and one of them must be active. */
  function ensureSomething() {
    if (!files.length) {
      const f = { id: genId(), name: uniqueName(), code: EMPTY_CODE, dirty: false, origin: USER };
      files.push(f);
    }
    if (!openIds.length) openIds = [files[0].id];
    if (!files.some(f => f.id === activeId)) activeId = openIds[0];
  }

  function open(id, { activate = true } = {}) {
    const f = byId(id);
    if (!f) return null;
    if (!openIds.includes(id)) openIds.push(id);
    if (activate) activeId = id;
    changed();
    return f;
  }

  function closeTab(id, { save = true } = {}) {
    const idx = openIds.indexOf(id);
    if (idx < 0) return;
    openIds.splice(idx, 1);
    if (activeId === id) {
      activeId = openIds[Math.min(idx, openIds.length - 1)] ?? null;
      if (activeId === null) ensureSomething();
    }
    if (save) changed();
  }

  function setActiveCode(code) {
    const f = active();
    if (!f || f.code === code) return false;
    f.code = code;
    const wasClean = !f.dirty;
    f.dirty = true;
    scheduleSave();
    return wasClean;   // caller re-renders to show the • marker
  }

  /** Flushes the editor buffer into the model without marking the file dirty. */
  function syncActiveCode(code) {
    const f = active();
    if (f) f.code = code;
  }

  function rename(id, rawName) {
    const f = byId(id);
    if (!f) return;
    let name = rawName.trim() || f.name;
    if (!name.endsWith('.zy')) name += '.zy';
    if (name !== f.name && byName(name)) return;    // refuse to create a duplicate
    const m = mounts.get(f.origin);
    if (m) m.names = m.names.map(n => (n === f.name ? name : n));
    f.name = name;
    changed();
  }

  function clearActive() {
    const f = active();
    if (!f) return;
    f.code = '';
    f.dirty = false;
    changed();
  }

  return {
    load, save,
    all, tabs, active, byId, byName, codeOf, isOpen, mountList, mountOf,
    get activeId() { return activeId; },
    mount, mountBundle, conflictsWith, newFile, uniqueName,
    unmount, unmountBundle, open, closeTab,
    setActiveCode, syncActiveCode, rename, clearActive,
  };
}
