// SPDX-License-Identifier: AGPL-3.0-only
/**
 * sidebar.js — the VSCode-style explorer that replaced the bottom card grid.
 *
 * Two sections over one filter box:
 *
 *   WORKSPACE  everything currently mounted, as a path tree. Because mounted names are
 *              namespaced by where the example came from (`collections/map.zy`,
 *              `games/classic/go/核/盤.zy`), a plain path tree produces the right nesting for
 *              free — no separate grouping model. A directory node that is exactly a
 *              bundle's root (a `.zyp` or a multi-file project) carries that bundle's
 *              badge, script list and "unmount all".
 *   EXAMPLES   the catalog: group → category → entry. Clicking an entry mounts it and
 *              opens one file, never one tab per file.
 *
 * Groups, categories and entries may carry an `icon` (an emoji in `catalog.json`), and a
 * category may ask to start expanded with `"open": true` — that is how 🎮 GAMES shows its
 * three playable packages without a click, while the 105-entry Rosetta Stone stays folded.
 *
 * This module owns no state beyond UI affordances (collapsed nodes, filter text, width).
 * Everything else it reads from the store and reports back through `hooks`.
 */

import { esc, highlightCode } from './highlight.js';
import { previewOf } from './catalog.js';
import { baseOf } from './filestore.js';

const LS_COLLAPSED = 'zy-sb-collapsed';
const LS_WIDTH     = 'zy-sb-width';
const LS_OPEN      = 'zy-sb-open'; // desktop collapse state — separate from the mobile drawer
const PREVIEW_MS   = 260;
const MOBILE_MQ    = '(max-width: 700px)';

const NEED_LABEL = {
  tui:   ['◱', 'draws on the TUI canvas'],
  input: ['⌨', 'reads input with <<'],
  args:  ['><', 'reads CLI args — fill the args… field'],
  shell: ['\\', 'uses <\\ cmd \\> — returns a timestamp in the browser'],
  net:   ['⇅', 'uses std/net (fetch)'],
};

/** Fold accents so "Ελληνικά" is findable by its tag and "castellano" by "Castellano". */
function foldText(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function createSidebar({ store, hooks }) {
  const el         = document.getElementById('sidebar');
  const filterEl   = document.getElementById('sb-filter');
  const bodyEl     = document.getElementById('sb-body');
  const previewEl  = document.getElementById('sb-preview');
  const backdropEl = document.getElementById('sb-backdrop');
  const resizeEl   = document.getElementById('sb-resize');
  const drawerBtn  = document.getElementById('sb-toggle');       // header ☰, mobile drawer opener
  const collapseBtn = document.getElementById('sb-collapse-btn'); // sidebar's own header, desktop toggle

  let catalog = null;
  let loadError = null;
  let filter = '';
  const collapsed = new Set(readCollapsed());
  let previewTimer = null;

  function readCollapsed() {
    try { return JSON.parse(localStorage.getItem(LS_COLLAPSED) ?? '[]'); } catch { return []; }
  }
  function saveCollapsed() {
    try { localStorage.setItem(LS_COLLAPSED, JSON.stringify([...collapsed])); } catch {}
  }
  // Categories start folded — 105 Rosetta Stone entries expanded by default is a wall.
  function isCollapsed(key, defaultCollapsed = false) {
    if (collapsed.has(key)) return true;
    return defaultCollapsed && !collapsed.has('!' + key);
  }
  function toggleCollapse(key, defaultCollapsed) {
    if (isCollapsed(key, defaultCollapsed)) { collapsed.delete(key); collapsed.add('!' + key); }
    else { collapsed.delete('!' + key); collapsed.add(key); }
    saveCollapsed();
    render();
  }

  // ─── row construction ───────────────────────────────────────────────────────
  function row({ depth, twisty, icon, label, title, cls = '', badges = [], actions = [] }) {
    const r = document.createElement('div');
    r.className = 'sb-row ' + cls;
    r.style.setProperty('--depth', depth);
    if (title) r.title = title;

    const tw = document.createElement('span');
    tw.className = 'sb-twisty';
    tw.textContent = twisty ?? '';
    r.appendChild(tw);

    if (icon) {
      const ic = document.createElement('span');
      ic.className = 'sb-icon';
      ic.textContent = icon;
      r.appendChild(ic);
    }

    const lb = document.createElement('span');
    lb.className = 'sb-label';
    lb.textContent = label;
    r.appendChild(lb);

    for (const b of badges) {
      const s = document.createElement('span');
      s.className = 'sb-badge ' + (b.cls ?? '');
      s.textContent = b.text;
      if (b.title) s.title = b.title;
      r.appendChild(s);
    }

    if (actions.length) {
      const box = document.createElement('span');
      box.className = 'sb-actions';
      for (const a of actions) {
        const btn = document.createElement('button');
        btn.className = 'sb-act ' + (a.cls ?? '');
        btn.textContent = a.text;
        btn.title = a.title ?? '';
        btn.addEventListener('click', e => { e.stopPropagation(); a.onClick(); });
        box.appendChild(btn);
      }
      r.appendChild(box);
    }
    return r;
  }

  function needBadges(needs) {
    return (needs ?? []).filter(n => NEED_LABEL[n]).map(n => ({
      text: NEED_LABEL[n][0], title: NEED_LABEL[n][1], cls: 'sb-need',
    }));
  }

  // ─── WORKSPACE ──────────────────────────────────────────────────────────────
  /** Path tree of the mounted files: `{ dirs: Map<name, node>, files: [file] }`. */
  function buildTree(files) {
    const root = { dirs: new Map(), files: [] };
    for (const f of files) {
      const parts = f.name.split('/');
      let node = root;
      for (const part of parts.slice(0, -1)) {
        if (!node.dirs.has(part)) node.dirs.set(part, { dirs: new Map(), files: [] });
        node = node.dirs.get(part);
      }
      node.files.push(f);
    }
    return root;
  }

  function renderWorkspace(container) {
    const files = filter
      ? store.all().filter(f => foldText(f.name).includes(filter))
      : store.all();

    if (!files.length) {
      container.appendChild(row({ depth: 1, label: 'no match', cls: 'sb-empty' }));
      return;
    }

    // A directory node is a "bundle root" when a multi-file mount lives exactly there.
    const bundleByRoot = new Map();
    for (const m of store.mountList()) if (m.bundle) bundleByRoot.set(m.root, m);

    const walk = (node, depth, prefix) => {
      for (const [name, child] of [...node.dirs].sort((a, b) => a[0].localeCompare(b[0]))) {
        const path = prefix ? `${prefix}/${name}` : name;
        const bundle = bundleByRoot.get(path);
        const key = 'ws:' + path;
        const open = filter || !isCollapsed(key);
        const actions = [];
        if (bundle) {
          actions.push({ text: '×', title: `Unmount ${bundle.title}`, cls: 'sb-act-del',
                         onClick: () => hooks.unmountBundle(bundle.id) });
        }
        const r = row({
          depth, twisty: open ? '▾' : '▸',
          // Same icons the EXAMPLES tree uses, so a mounted node is recognisable as the
          // entry it came from — including the entry's own icon when it has one.
          icon: bundle ? (bundle.icon ?? (bundle.kind === 'zyp' ? '📦' : '🗂')) : '',
          label: bundle ? bundle.title : name,
          title: bundle ? `${bundle.title} — ${bundle.names.length} file(s)` : path,
          cls: 'sb-dir' + (bundle ? ' sb-bundle' : ''), actions,
        });
        r.addEventListener('click', () => toggleCollapse(key, false));
        container.appendChild(r);
        if (!open) continue;
        if (bundle?.scripts?.length) {
          for (const s of bundle.scripts) {
            const sr = row({
              depth: depth + 1, icon: '▶', label: s.name,
              title: s.desc ? `${s.desc} — ${s.path}` : s.path,
              cls: 'sb-script' + (hooks.isRunTarget(s.path) ? ' active' : ''),
            });
            sr.addEventListener('click', () => hooks.runScript(bundle, s));
            container.appendChild(sr);
          }
        }
        walk(child, depth + 1, path);
      }
      for (const f of node.files.sort((a, b) => a.name.localeCompare(b.name))) {
        const badges = [];
        if (f.dirty) badges.push({ text: '●', title: 'Modified', cls: 'sb-dirty' });
        const r = row({
          depth, icon: '', label: baseOf(f.name), title: f.name,
          cls: 'sb-file' + (f.id === store.activeId ? ' active' : '')
                          + (store.isOpen(f.id) ? ' open' : ''),
          badges,
          actions: [{ text: '×', title: 'Unmount (removes it from the resolver too)',
                      cls: 'sb-act-del', onClick: () => hooks.unmountFile(f.id) }],
        });
        r.addEventListener('click', () => hooks.openFile(f.id));
        r.addEventListener('dblclick', () => hooks.renameFile(f.id));
        container.appendChild(r);
      }
    };
    walk(buildTree(files), 1, '');
  }

  // ─── EXAMPLES ───────────────────────────────────────────────────────────────
  function entryMatches(entry, cat, group) {
    if (!filter) return true;
    const hay = [entry.title, entry.desc, entry.path, entry.dir, entry.zyp, entry.id,
                 ...(entry.tags ?? []), cat.title, group.title].filter(Boolean).join(' ');
    return foldText(hay).includes(filter);
  }

  function renderExamples(container) {
    if (loadError) {
      const r = row({ depth: 1, label: loadError, cls: 'sb-error' });
      container.appendChild(r);
      return;
    }
    if (!catalog) {
      container.appendChild(row({ depth: 1, label: 'loading…', cls: 'sb-empty' }));
      return;
    }

    const mountedIds = new Set(store.mountList().map(m => m.id));
    let shown = 0;

    for (const group of catalog.groups) {
      const cats = group.categories
        .map(cat => ({ cat, entries: cat.entries.filter(e => entryMatches(e, cat, group)) }))
        .filter(c => c.entries.length);
      if (!cats.length) continue;

      const gkey = 'ex:' + group.id;
      const gopen = filter ? true : !isCollapsed(gkey);
      const gr = row({
        depth: 1, twisty: gopen ? '▾' : '▸', icon: group.icon, label: group.title,
        title: group.desc, cls: 'sb-group',
      });
      gr.addEventListener('click', () => toggleCollapse(gkey, false));
      container.appendChild(gr);
      if (!gopen) continue;

      for (const { cat, entries } of cats) {
        const ckey = 'ex:' + group.id + '/' + cat.id;
        // Folded by default: the tree is a menu, not a dump. `"open": true` in the catalog
        // opts a short, headline category out of that (the games).
        const foldDefault = !cat.open;
        const copen = filter ? true : !isCollapsed(ckey, foldDefault);
        const cr = row({
          depth: 2, twisty: copen ? '▾' : '▸', icon: cat.icon, label: cat.title, title: cat.desc,
          cls: 'sb-cat', badges: [{ text: String(cat.entries.length), cls: 'sb-count' }],
        });
        cr.addEventListener('click', () => toggleCollapse(ckey, foldDefault));
        container.appendChild(cr);
        if (!copen) continue;

        for (const entry of entries) {
          shown++;
          const badges = needBadges(entry.needs);
          if (mountedIds.has(entry.id)) {
            badges.unshift({ text: '✓', title: 'Already mounted', cls: 'sb-mounted' });
          }
          const r = row({
            depth: 3,
            icon: entry.icon ?? (entry.zyp ? '📦' : entry.dir ? '🗂' : ''),
            label: entry.title, title: entry.desc ?? entry.path ?? entry.zyp ?? entry.dir,
            // An entry that brought its own icon is a headline one (the games): give it the
            // weight to match, so the tree has a focal point instead of 208 identical rows.
            cls: 'sb-entry' + (entry.icon ? ' sb-featured' : ''), badges,
          });
          r.addEventListener('click', () => { hidePreview(); hooks.openEntry(entry); });
          r.addEventListener('pointerenter', e => {
            if (e.pointerType === 'mouse') schedulePreview(entry, r);
          });
          r.addEventListener('pointerleave', hidePreview);
          container.appendChild(r);
        }
      }
    }
    if (!shown && filter) {
      container.appendChild(row({ depth: 1, label: `no example matches “${filter}”`, cls: 'sb-empty' }));
    }
  }

  // ─── hover preview ──────────────────────────────────────────────────────────
  //
  // The popup has `pointer-events: none` and its anchor row is thrown away on every render,
  // so nothing about it can dismiss itself: whatever shows it is responsible for taking it
  // back. Two things used to leave it stuck on screen forever —
  //
  //   the async gap  `previewOf` fetches. Leaving the row (or re-rendering the tree) in that
  //                  window cleared the timer, but the callback was already running and
  //                  showed the popup afterwards, with no row left under the pointer to fire
  //                  `mouseleave`. `previewSeq` invalidates a scheduled preview so a late
  //                  resolution is dropped instead of displayed.
  //   the re-render  clicking an entry mounts it → `render()` → the anchor row is replaced,
  //                  so its `mouseleave` never arrives. `render()` and the click both hide.
  //
  // `pointerenter`, not `mouseenter`: on a touch screen a tap synthesises the mouse event but
  // never its `mouseleave` counterpart.
  let previewSeq = 0;

  function schedulePreview(entry, anchor) {
    clearTimeout(previewTimer);
    const seq = ++previewSeq;
    previewTimer = setTimeout(async () => {
      const code = await previewOf(entry);
      // Superseded, dismissed, or the row is gone / no longer under the pointer.
      if (seq !== previewSeq || !anchor.isConnected || !anchor.matches(':hover')) return;
      const parts = [];
      if (entry.desc) parts.push(`<div class="sb-pv-desc">${esc(entry.desc)}</div>`);
      const where = entry.zyp ?? entry.dir ?? entry.path;
      parts.push(`<div class="sb-pv-path">examples/${esc(where)}</div>`);
      if (code) parts.push(`<pre class="sb-pv-code">${highlightCode(code)}</pre>`);
      if (!code && entry.zyp) {
        parts.push('<div class="sb-pv-desc">Package — click to mount its source tree.</div>');
      }
      previewEl.innerHTML = parts.join('');
      previewEl.classList.add('visible');
      // Clamp to the viewport: entries near the bottom would otherwise open off-screen.
      const rect = anchor.getBoundingClientRect();
      const h = previewEl.offsetHeight;
      previewEl.style.top  = `${Math.max(8, Math.min(rect.top, window.innerHeight - h - 8))}px`;
      previewEl.style.left = `${rect.right + 8}px`;
    }, PREVIEW_MS);
  }
  function hidePreview() {
    clearTimeout(previewTimer);
    previewSeq++;
    previewEl.classList.remove('visible');
  }

  // ─── render ─────────────────────────────────────────────────────────────────
  function section(id, title, actions) {
    const sec = document.createElement('div');
    sec.className = 'sb-sec';
    const key = 'sec:' + id;
    const open = !isCollapsed(key);
    const head = row({
      depth: 0, twisty: open ? '▾' : '▸', label: title, cls: 'sb-sec-head', actions,
    });
    head.addEventListener('click', () => toggleCollapse(key, false));
    sec.appendChild(head);
    const body = document.createElement('div');
    body.className = 'sb-sec-body';
    if (!open) body.style.display = 'none';
    sec.appendChild(body);
    return { sec, body, open };
  }

  function render() {
    // Every row about to be dropped takes its `mouseleave` with it.
    hidePreview();
    const scroll = bodyEl.scrollTop;
    bodyEl.innerHTML = '';

    const ws = section('workspace', 'WORKSPACE', [
      { text: '+', title: 'New file', onClick: () => hooks.newFile() },
    ]);
    if (ws.open) renderWorkspace(ws.body);
    bodyEl.appendChild(ws.sec);

    const ex = section('examples', 'EXAMPLES', []);
    if (ex.open) renderExamples(ex.body);
    bodyEl.appendChild(ex.sec);

    bodyEl.scrollTop = scroll;
  }

  // ─── wiring ─────────────────────────────────────────────────────────────────
  filterEl.addEventListener('input', () => {
    filter = foldText(filterEl.value.trim());
    el.classList.toggle('filtering', !!filter);
    render();
  });
  filterEl.addEventListener('keydown', e => {
    if (e.key === 'Escape') { filterEl.value = ''; filter = ''; el.classList.remove('filtering'); render(); }
  });
  bodyEl.addEventListener('scroll', hidePreview);
  // Belt and braces, because a popup nobody can point at cannot dismiss itself: leaving the
  // sidebar (including straight out of the window), any click, Escape, or the tab losing
  // focus all take it back.
  el.addEventListener('pointerleave', hidePreview);
  document.addEventListener('pointerdown', hidePreview, true);
  window.addEventListener('blur', hidePreview);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hidePreview(); });

  // Drawer (mobile) — below 700px the sidebar becomes a slide-over panel instead of a
  // permanent column, since there isn't width to spare for both it and the editor.
  const isMobile = () => window.matchMedia(MOBILE_MQ).matches;
  function setDrawer(open) {
    el.classList.toggle('drawer-open', open);
    backdropEl.classList.toggle('visible', open);
    updateCollapseIcon();
  }
  backdropEl?.addEventListener('click', () => setDrawer(false));
  // Reachable only on mobile (see CSS): the drawer starts off-screen, so the one control
  // that can reopen it has to live outside the sidebar itself, in the app header.
  drawerBtn?.addEventListener('click', () => setDrawer(!el.classList.contains('drawer-open')));

  // Collapse (desktop) — lives in the sidebar's own header, symmetric with how the Output
  // panel owns its collapse toggle: width shrinks to a slim strip rather than vanishing,
  // so the panel stays visible as a place to click it back open. Chevron points toward the
  // edge it's collapsing to (the sidebar sits on the left), same convention as Output.
  function updateCollapseIcon() {
    if (!collapseBtn) return;
    if (isMobile()) {
      collapseBtn.textContent = '✕';
      collapseBtn.title = 'Close explorer';
    } else {
      const collapsed = el.classList.contains('sb-collapsed');
      collapseBtn.textContent = collapsed ? '▶' : '◀';
      collapseBtn.title = collapsed ? 'Show explorer' : 'Hide explorer';
    }
    collapseBtn.setAttribute('aria-label', collapseBtn.title);
  }
  function setOpen(open) {
    el.classList.toggle('sb-collapsed', !open);
    try { localStorage.setItem(LS_OPEN, open ? '1' : '0'); } catch {}
    updateCollapseIcon();
  }
  if (!isMobile() && localStorage.getItem(LS_OPEN) === '0') el.classList.add('sb-collapsed');
  updateCollapseIcon();

  collapseBtn?.addEventListener('click', () => {
    if (isMobile()) setDrawer(false);
    else setOpen(el.classList.contains('sb-collapsed'));
  });
  window.addEventListener('resize', updateCollapseIcon);

  // Width drag
  (function () {
    let dragging = false;
    const stored = Number(localStorage.getItem(LS_WIDTH));
    if (stored >= 160 && stored <= 560) {
      document.documentElement.style.setProperty('--sidebar-w', stored + 'px');
    }
    const start = e => {
      dragging = true;
      el.classList.add('sb-resizing');
      document.body.style.userSelect = 'none';
      if (e.cancelable) e.preventDefault();
    };
    const move = x => {
      if (!dragging) return;
      const w = Math.max(160, Math.min(560, x - el.getBoundingClientRect().left));
      document.documentElement.style.setProperty('--sidebar-w', w + 'px');
    };
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('sb-resizing');
      document.body.style.userSelect = '';
      const w = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-w'), 10);
      if (w) localStorage.setItem(LS_WIDTH, String(w));
    };
    resizeEl?.addEventListener('mousedown', start);
    resizeEl?.addEventListener('touchstart', start, { passive: false });
    document.addEventListener('mousemove', e => move(e.clientX));
    document.addEventListener('touchmove', e => move(e.touches[0].clientX), { passive: true });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
  })();

  return {
    render,
    setCatalog(c) { catalog = c; loadError = null; render(); },
    setError(msg) { loadError = msg; render(); },
    closeDrawer() { setDrawer(false); },
    focusFilter() { filterEl.focus(); filterEl.select(); },
  };
}
