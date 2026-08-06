// SPDX-License-Identifier: AGPL-3.0-only
import { runZymbol, codePointDisplayWidth } from '../zymbol/zymbol.js';
import { highlightCode } from './highlight.js';
import { readZyp } from '../zymbol/zyp.js';
import { makeResolver } from '../zymbol/module-resolver.js';
import { createStore, dirOf, baseOf, USER } from './filestore.js';
import { createSidebar } from './sidebar.js';
import { loadCatalog, mountEntry, collectPackage, resolveDeepLink, deepLinkOf } from './catalog.js';

// ─── Editor sync ──────────────────────────────────────────────────────────────
const editor    = document.getElementById('editor');
const highlight = document.getElementById('editor-highlight');

function syncHighlight() {
  const code = editor.value;
  highlight.innerHTML = highlightCode(code) + '\n';
  syncScroll();
}
function syncScroll() {
  highlight.scrollTop  = editor.scrollTop;
  highlight.scrollLeft = editor.scrollLeft;
}

editor.addEventListener('scroll', syncScroll);

// ─── File store + tabs ────────────────────────────────────────────────────────
//
// `store` keeps two lists: mounted files (visible to the module resolver and the sidebar)
// and open tabs (a subset). See filestore.js — the split is why mounting a 22-file package
// no longer opens 22 tabs.
const store = createStore({ onChange: () => { renderFileTabs(); sidebar?.render(); } });

// The run target: which mounted file ▶ Run executes. `null` means "the focused tab", which
// is also the escape hatch after a package has been mounted — without it, mounting a package
// permanently hijacked the Run button.
let runTarget = null;
const scriptSelectEl = document.getElementById('zyp-script-select');
const argsInputEl    = document.getElementById('args-input');
let sidebar = null;

/** Rebuilds the [[script]] picker from the mounts that have scripts (packages). */
function refreshScriptSelect() {
  const withScripts = store.mountList().filter(m => m.scripts?.length);
  if (!withScripts.length) {
    scriptSelectEl.style.display = 'none';
    scriptSelectEl.innerHTML = '';
    if (runTarget && !store.byName(runTarget)) runTarget = null;
    return;
  }
  scriptSelectEl.innerHTML = '';
  for (const m of withScripts) {
    const group = document.createElement('optgroup');
    group.label = m.title;
    for (const s of m.scripts) {
      const opt = document.createElement('option');
      opt.value = s.path;
      opt.textContent = s.desc ? `${s.name} — ${s.desc}` : s.name;
      group.appendChild(opt);
    }
    scriptSelectEl.appendChild(group);
  }
  const escape = document.createElement('option');
  escape.value = '';
  escape.textContent = '— active tab —';
  scriptSelectEl.appendChild(escape);
  scriptSelectEl.value = runTarget && store.byName(runTarget) ? runTarget : '';
  scriptSelectEl.style.display = '';
}

scriptSelectEl.addEventListener('change', () => {
  runTarget = scriptSelectEl.value || null;
  sidebar?.render();
});

// ─── Mounting examples and packages ──────────────────────────────────────────
//
// One path for every source of files — a catalog entry, an uploaded `.zyp`, a dropped `.zy`.
// The only decision that needs the user is what to do with unsaved edits the incoming copy
// would replace: silently preferring the stale edit means the program runs as a mix of
// package and leftover code with nothing on screen saying so.
function askOverwrite(conflicts) {
  return window.confirm(
    `${conflicts.length} open file(s) have unsaved edits that this would replace:\n\n` +
    conflicts.slice(0, 10).join('\n') +
    (conflicts.length > 10 ? `\n…and ${conflicts.length - 10} more` : '') +
    `\n\nOK — use the fresh copies (your edits are lost)\n` +
    `Cancel — keep your edits (it runs with them instead)`
  );
}

/**
 * Mounts a bundle and opens exactly one file from it.
 * @param {{id,title,root,files:Map,entryName,scripts,args,needs}} bundle
 * @param {{isBundle?:boolean, kind?:string, open?:string}} opts `open` is a mounted name to
 *   show instead of the bundle's entry file (a deep link into a package). It changes the tab
 *   only — ▶ Run stays on the default `[[script]]`, since a module is not a runnable entry.
 */
function mountAndOpen(bundle, { isBundle = false, kind = 'dir', open = null } = {}) {
  flushEditor();
  const conflicts = store.conflictsWith(bundle);
  let overwriteDirty = false;
  if (conflicts.length) overwriteDirty = askOverwrite(conflicts);

  store.mountBundle({ ...bundle, isBundle, kind }, { overwriteDirty });
  if (bundle.args !== undefined) argsInputEl.value = bundle.args;

  runTarget = bundle.scripts?.length ? bundle.entryName : null;
  refreshScriptSelect();

  const file = (open && store.byName(open)) || store.byName(bundle.entryName);
  if (file) openFile(file.id);
  else { renderFileTabs(); sidebar?.render(); }

  if (conflicts.length && !overwriteDirty) {
    appendOutput(
      `(kept your unsaved edits in ${conflicts.length} file(s) — it will run with them, ` +
      `not with the original copies)`,
      'out-meta'
    );
  }
  return file;
}

/**
 * Rewrites the address bar to the entry that is showing, so the URL in the bar is always the
 * link to share — no copy button to find, no id to look up. Slashes stay literal
 * (`?open=games/classic/go.zyp`); only the segments are escaped, so a link keeps reading as
 * the path it is.
 */
function syncDeepLink(path) {
  if (!path) return;
  const pretty = path.split('/').map(encodeURIComponent).join('/');
  history.replaceState(null, '', `${location.pathname}?open=${pretty}${location.hash}`);
}

/**
 * @param {object} entry catalog entry
 * @param {{file?: string}} opts `file` opens one file of the entry instead of its entry file
 *   — that is what `?open=games/classic/go/核/盤.zy` resolves to.
 */
async function openCatalogEntry(entry, { file } = {}) {
  try {
    const bundle = await mountEntry(entry);
    // A link into a package can name a file the package no longer ships: say so and fall
    // back to the entry file rather than opening nothing.
    const wanted = file && bundle.files.has(file) ? file : null;
    const opened = mountAndOpen(bundle, {
      isBundle: !!(entry.dir || entry.zyp),
      kind: entry.zyp ? 'zyp' : 'dir',
      open: wanted,
    });
    if (file && !wanted) {
      appendOutput(`('${file}' is not in ${entry.title} — opened its entry file instead)`,
                   'out-meta');
    }
    syncDeepLink(wanted ?? deepLinkOf(entry));
    if (bundle.files.size > 1) {
      appendOutput(
        `(mounted '${entry.title}' — ${bundle.files.size} file(s)` +
        `${bundle.scripts.length ? `, ${bundle.scripts.length} script(s)` : ''}; ` +
        `opened ${opened ? baseOf(opened.name) : 'nothing'})`,
        'out-meta'
      );
    }
    sidebar?.closeDrawer();
  } catch (err) {
    clearOutput();
    appendOutput(`(could not load '${entry.title}': ${err.message ?? err})`, 'out-error');
  }
}

// ─── Tabs (open files only) ──────────────────────────────────────────────────
const fileTabsEl = document.getElementById('file-tabs');

function openFile(id) {
  const wasActive = store.activeId === id;
  flushEditor();
  const f = store.open(id);
  if (!f) return;
  editor.value = f.code;
  syncHighlight();
  // Only when the file actually changes: clicking the already-focused file in the tree
  // should not throw away the output you are looking at.
  if (!wasActive) clearOutput();
  renderFileTabs();
  sidebar?.render();
}

/** Writes the editor buffer back into the model without touching the dirty flag. */
function flushEditor() {
  store.syncActiveCode(editor.value);
}

function showActiveInEditor() {
  const f = store.active();
  editor.value = f ? f.code : '';
  syncHighlight();
}

function renderFileTabs() {
  fileTabsEl.innerHTML = '';
  for (const f of store.tabs()) {
    const tab = document.createElement('div');
    tab.className = 'ftab' + (f.id === store.activeId ? ' active' : '');
    tab.title = f.name;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'ftab-name';
    // Label with the basename: mounted names are full relative paths
    // (`packages/go/核/盤.zy`) and would blow the tab strip apart.
    nameSpan.textContent = baseOf(f.name);

    const dot = document.createElement('span');
    dot.className = 'ftab-dot';
    dot.textContent = f.dirty ? '●' : '';
    dot.title = f.dirty ? 'Modified' : '';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'ftab-close';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close tab (the file stays mounted)';
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      flushEditor();
      store.closeTab(f.id);
      showActiveInEditor();
    });

    tab.appendChild(nameSpan);
    tab.appendChild(dot);
    tab.appendChild(closeBtn);
    tab.addEventListener('click', () => openFile(f.id));
    tab.addEventListener('dblclick', e => { e.stopPropagation(); startRename(tab, nameSpan, f); });

    fileTabsEl.appendChild(tab);
  }

  const addBtn = document.createElement('button');
  addBtn.className = 'ftab-add';
  addBtn.textContent = '+';
  addBtn.title = 'New file';
  addBtn.addEventListener('click', () => newUserFile());
  fileTabsEl.appendChild(addBtn);

  const activeTab = fileTabsEl.querySelector('.ftab.active');
  if (activeTab) activeTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function newUserFile() {
  flushEditor();
  const f = store.newFile();
  editor.value = f.code;
  syncHighlight();
  clearOutput();
  renderFileTabs();
  sidebar?.render();
}

function startRename(tabEl, nameSpan, file) {
  if (tabEl.querySelector('.ftab-rename-input')) return;
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'ftab-rename-input';
  inp.value = file.name;
  nameSpan.replaceWith(inp);
  inp.focus();
  inp.select();

  let committed = false;
  function commit() {
    if (committed) return;
    committed = true;
    store.rename(file.id, inp.value);
    renderFileTabs();
    sidebar?.render();
  }
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { committed = true; renderFileTabs(); }
  });
}

// Track edits → mark file dirty
editor.addEventListener('input', () => {
  syncHighlight();
  if (store.setActiveCode(editor.value)) {
    renderFileTabs();      // refresh the • marker the first time
    sidebar?.render();
  }
});

// Tab → 4 spaces
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = editor.selectionStart, end = editor.selectionEnd;
    editor.value = editor.value.slice(0, s) + '    ' + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = s + 4;
    syncHighlight();
    store.setActiveCode(editor.value);
  }
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    runCode();
  }
});

// ─── Output ───────────────────────────────────────────────────────────────────
const outputEl = document.getElementById('output-content');

function appendOutput(text, cls = 'out-text') {
  const span = document.createElement('span');
  span.className = cls;
  span.textContent = text;
  outputEl.appendChild(span);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function clearOutput() {
  outputEl.innerHTML = '';
}

// ─── TUI canvas support ───────────────────────────────────────────────────────
function ansi256ToRgb(n) {
  const ANSI16 = [
    '#000','#800000','#008000','#808000','#000080','#800080','#008080','#c0c0c0',
    '#808080','#ff0000','#00ff00','#ffff00','#0000ff','#ff00ff','#00ffff','#fff',
  ];
  if (n < 16)  return ANSI16[n];
  if (n < 232) {
    n -= 16;
    const b = n % 6, g = Math.floor(n / 6) % 6, r = Math.floor(n / 36);
    const c = v => v === 0 ? 0 : v * 40 + 55;
    return `rgb(${c(r)},${c(g)},${c(b)})`;
  }
  const v = (n - 232) * 10 + 8;
  return `rgb(${v},${v},${v})`;
}

// Font stack for canvas text, read from the page's own `--mono` custom property so the TUI
// draws with exactly the fonts the rest of the playground uses. It used to be hardcoded
// here — three separate copies of `"JetBrains Mono","Courier New",monospace` — and drifted
// from the CSS once `pIqaD-qolqoS` was added to `--mono`: pIqaD is Private Use Area
// (U+F8D0–U+F8FF), so with no font in the stack that maps those code points, every Klingon
// glyph on the canvas fell back to tofu while the same text rendered fine in the editor.
const CANVAS_FONT_SIZE = 13;
function canvasFontStack() {
  const fromCss = getComputedStyle(document.documentElement).getPropertyValue('--mono').trim();
  return fromCss || "'pIqaD-qolqoS','JetBrains Mono','Courier New',monospace";
}
function canvasFont(style = '') {
  return `${style}${CANVAS_FONT_SIZE}px ${canvasFontStack()}`;
}

// A canvas does not trigger webfont loading the way DOM text does: if nothing on the page
// has painted with the font yet, the first draw silently uses a fallback and never repaints.
// Ask for it explicitly, once, at startup.
document.fonts?.load(canvasFont())?.catch(() => {});

// Canvas pixels can't reference CSS custom properties, so these mirror --bg/--hi from :root
// and html.light in playground.css. Only the "no color given" default reacts to the site
// theme — explicit ANSI colors (ansi256ToRgb) are left alone, since a program that asked for
// a specific color should keep it regardless of theme.
function tuiBg() { return document.documentElement.classList.contains('light') ? '#f8f8f8' : '#0c0c0c'; }
function tuiFg() { return document.documentElement.classList.contains('light') ? '#111'    : '#ddd'; }

class BrowserTUI {
  constructor(canvas, outputDiv) {
    this.canvas       = canvas;
    this.wrap         = document.getElementById('tui-wrap');
    this.stopBtn      = document.getElementById('tui-stop-btn');
    this.inputBar     = document.getElementById('tui-input-bar');
    this.inputField   = document.getElementById('tui-input-field');
    this.keyBar       = document.getElementById('tui-key-bar');
    this.keyField     = document.getElementById('tui-key-field');
    this.keysBtn      = document.getElementById('tui-keys-btn');
    this.keyCloseBtn  = document.getElementById('tui-key-close');
    this.outputDiv    = outputDiv;
    this.ctx          = null;
    this.rows         = 0;
    this.cols         = 0;
    this.cellW        = 0;
    this.cellH        = 0;
    this.keyQueue     = [];
    this.keyWaiters   = [];
    this.keyListener  = null;
    this.active       = false;
    this.aborted      = false;
    this._sleepCancel     = null;
    this._inputResolve    = null;
    this._inputKeyHandler = null;
    this._touchStart      = null;
    this._touchMove       = null;
    this._touchEnd        = null;
    this._touchCancel     = null;
    this._keypadOpen      = false;
    this._keypadHandlers  = null;
    // Pre-compute dimensions so >>? works even before >>| is entered
    this._measureCells();
  }

  _measureCells() {
    const tmp = document.createElement('canvas');
    const ctx = tmp.getContext('2d');
    ctx.font = canvasFont();
    this.cellW = Math.ceil(ctx.measureText('M').width) || 8;
    this.cellH = 16;
    // wrap is display:none in constructor — use output-panel (always visible)
    const panel = this.outputDiv?.parentElement;
    const w = (panel && panel.clientWidth)  || 600;
    const h = (panel && panel.clientHeight) || 400;
    this.cols = Math.max(10, Math.floor(w / this.cellW));
    this.rows = Math.max(5,  Math.floor(h / this.cellH));
  }

  enter() {
    // Show wrap first so clientWidth/Height are real
    this.outputDiv.style.display = 'none';
    this.wrap.classList.add('active');

    this.ctx = this.canvas.getContext('2d');

    const w   = this.wrap.clientWidth  || 600;
    const h   = this.wrap.clientHeight || 400;
    const dpr = window.devicePixelRatio || 1;

    // HiDPI: buffer in physical pixels, draw in CSS pixels
    this.canvas.width        = Math.round(w * dpr);
    this.canvas.height       = Math.round(h * dpr);
    this.canvas.style.width  = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.scale(dpr, dpr);

    this.ctx.font = canvasFont();
    this.cellW = Math.ceil(this.ctx.measureText('M').width) || 8;
    this.cellH = 16;

    this.cols = Math.max(10, Math.floor(w / this.cellW));
    this.rows = Math.max(5,  Math.floor(h / this.cellH));

    this.canvas.focus();

    // Locked in for the whole session rather than read live: toggling the site theme
    // mid-game used to repaint only whatever got redrawn next (e.g. the cell under a moving
    // cursor), leaving the rest of an already-drawn board in the old colors — a patchwork.
    // There's no retained screen buffer to replay in full on a theme change, so the correct
    // "change everything, never just a piece of it" is to not change mid-session at all; the
    // new theme takes effect the next time a program enters TUI mode.
    this._bg = tuiBg();
    this._fg = tuiFg();

    this.ctx.fillStyle = this._bg;
    this.ctx.fillRect(0, 0, w, h);

    this.printRow = 1;
    this.printCol = 1;
    this.keyQueue        = [];
    this.keyWaiters      = [];
    this.aborted         = false;
    this._sleepCancel    = null;
    this._inputResolve   = null;
    this._inputKeyHandler = null;
    this.keyListener = e => {
      // Either input surface takes over completely while it is open, or a physical keypress
      // would be delivered twice: once by this document-level listener and once by the
      // field's own handler.
      if (this.inputBar.classList.contains('active') || this._keypadOpen) return;
      e.preventDefault();
      const ch = this._mapKey(e);
      if (this.keyWaiters.length > 0) this.keyWaiters.shift()(ch);
      else this.keyQueue.push(ch);
    };
    document.addEventListener('keydown', this.keyListener);
    this._installKeypad();

    // Swipe gestures → arrow keys (mobile).
    //
    // Three things have to be true or the browser eats the gesture before we see it, and the
    // failure is directional, which is what makes it confusing: an upward finger swipe is the
    // canonical "scroll down" gesture, so it is the first one Chrome claims.
    //
    //   1. The listeners must be NON-passive. A passive listener cannot preventDefault(), so
    //      the browser stays free to treat the touch as a scroll, an overscroll/pull-to-
    //      refresh, or an edge back-navigation.
    //   2. `touchcancel` must be handled. Once the browser decides the gesture is a scroll it
    //      stops sending touchmove/touchend and sends touchcancel instead — with only a
    //      touchend handler the swipe is silently dropped.
    //   3. The direction must be decided during touchmove, as soon as the threshold is
    //      crossed, not on release. That fires the instant the player moves (it matters in a
    //      game) and it survives a cancel that arrives afterwards.
    //
    // `touch-action: none` on the canvas (playground.css) is the other half: it tells the
    // compositor not to consider pans on this element at all, so 1–2 rarely even trigger.
    const SWIPE_PX = 24;
    let _sx = 0, _sy = 0, _fired = false, _tracking = false;
    const emit = ch => this._pushKey(ch);

    this._touchStart = e => {
      if (this.inputBar.classList.contains('active')) return;
      if (e.touches.length > 1) { _tracking = false; return; }   // pinch/zoom: not ours
      _sx = e.touches[0].clientX;
      _sy = e.touches[0].clientY;
      _fired = false;
      _tracking = true;
      e.preventDefault();     // no double-tap zoom, no synthetic click, no scroll hand-off
    };
    this._touchMove = e => {
      if (!_tracking) return;
      e.preventDefault();
      if (_fired) return;
      const dx = e.touches[0].clientX - _sx;
      const dy = e.touches[0].clientY - _sy;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      if (Math.max(ax, ay) < SWIPE_PX) return;
      emit(ax > ay ? (dx > 0 ? '→' : '←') : (dy > 0 ? '↓' : '↑'));
      _fired = true;
    };
    this._touchEnd = e => {
      if (!_tracking) return;
      _tracking = false;
      if (e.cancelable) e.preventDefault();
      if (!_fired) emit('\n');                 // never moved far enough → tap → Enter
    };
    // A cancelled gesture is not a tap: emit nothing if the direction never fired, rather
    // than sending a spurious Enter (which, in a game, is usually "confirm").
    this._touchCancel = () => { _tracking = false; };

    this.canvas.addEventListener('touchstart',  this._touchStart,  { passive: false });
    this.canvas.addEventListener('touchmove',   this._touchMove,   { passive: false });
    this.canvas.addEventListener('touchend',    this._touchEnd,    { passive: false });
    this.canvas.addEventListener('touchcancel', this._touchCancel, { passive: true });

    this.active = true;
  }

  /** Queues one keypress, exactly as the document-level key listener does. */
  _pushKey(ch) {
    if (this.keyWaiters.length > 0) this.keyWaiters.shift()(ch);
    else this.keyQueue.push(ch);
  }

  // ─── Keypad ────────────────────────────────────────────────────────────────
  //
  // A program reading `<<|` can ask for any character; on a touch device the only ones
  // reachable were the four arrows (swipe) and Enter (tap). Every package in the pool needs
  // more than that — `p` passes in GO, `q` quits, klingon_galaxy reads digits — so without
  // this those games are unplayable on a phone, not merely awkward.
  //
  // The field is an overlay, never part of the flex flow: `>>?` reports the canvas size and
  // programs lay their screen out from it, so reflowing the canvas after the program has
  // measured would leave a board drawn to a height that no longer exists.
  _installKeypad() {
    const open  = () => this._openKeypad();
    const close = () => this._closeKeypad();

    // A soft keyboard is not a keyboard. On Android, GBoard commonly reports `keydown` with
    // `key: 'Unidentified'` (keyCode 229) and delivers the real character only through the
    // input events, so reading `e.key` here would work on a desktop and silently do nothing
    // on the device this whole feature exists for. `beforeinput` carries the text, and
    // preventing it keeps the field empty so no visible string accumulates.
    const onBeforeInput = e => {
      if (e.inputType !== 'insertText' || !e.data) return;
      e.preventDefault();
      for (const ch of e.data) this._pushKey(ch);
    };
    // Belt and braces: some IMEs (and composition-based input) bypass beforeinput. Anything
    // that reaches the value is drained and the field reset.
    const onInput = () => {
      const v = this.keyField.value;
      if (!v) return;
      this.keyField.value = '';
      for (const ch of v) this._pushKey(ch);
    };
    // Keys that produce no text: these DO arrive reliably as keydown, on soft keyboards too.
    const onKeyDown = e => {
      const map = { Enter: '\n', Escape: '\x1b', Backspace: '\x7f', Tab: '\t',
                    ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };
      if (e.key in map) {
        e.preventDefault();
        // Escape closes the keypad rather than reaching the program: with the OS keyboard
        // covering half the screen, getting out has to be possible from the keyboard itself.
        if (e.key === 'Escape') { close(); return; }
        this._pushKey(map[e.key]);
      }
    };

    this._keypadHandlers = { open, close, onBeforeInput, onInput, onKeyDown };
    this.keysBtn.addEventListener('click', open);
    this.keyCloseBtn.addEventListener('click', close);
    this.keyField.addEventListener('beforeinput', onBeforeInput);
    this.keyField.addEventListener('input', onInput);
    this.keyField.addEventListener('keydown', onKeyDown);
    this.keysBtn.classList.add('visible');
  }

  _openKeypad() {
    if (!this.active || this._keypadOpen) return;
    this._keypadOpen = true;
    this.keyBar.classList.add('active');
    this.keysBtn.classList.remove('visible');
    this.keyField.value = '';
    // focus() is what raises the device keyboard, and it only works inside the user gesture
    // that opened the keypad — hence the direct call rather than anything deferred.
    this.keyField.focus();
  }

  _closeKeypad() {
    if (!this._keypadOpen) return;
    this._keypadOpen = false;
    this.keyBar.classList.remove('active');
    this.keyField.value = '';
    this.keyField.blur();
    if (this.active) {
      this.keysBtn.classList.add('visible');
      this.canvas.focus();
    }
  }

  _removeKeypad() {
    const h = this._keypadHandlers;
    if (h) {
      this.keysBtn.removeEventListener('click', h.open);
      this.keyCloseBtn.removeEventListener('click', h.close);
      this.keyField.removeEventListener('beforeinput', h.onBeforeInput);
      this.keyField.removeEventListener('input', h.onInput);
      this.keyField.removeEventListener('keydown', h.onKeyDown);
      this._keypadHandlers = null;
    }
    this._keypadOpen = false;
    this.keyBar.classList.remove('active');
    this.keysBtn.classList.remove('visible');
    this.keyField.value = '';
    this.keyField.blur();
  }

  leave() {
    if (!this.active) return;
    this._removeKeypad();
    document.removeEventListener('keydown', this.keyListener);
    this.keyListener = null;
    if (this._touchStart)  this.canvas.removeEventListener('touchstart',  this._touchStart);
    if (this._touchMove)   this.canvas.removeEventListener('touchmove',   this._touchMove);
    if (this._touchEnd)    this.canvas.removeEventListener('touchend',    this._touchEnd);
    if (this._touchCancel) this.canvas.removeEventListener('touchcancel', this._touchCancel);
    this._touchStart  = null;
    this._touchMove   = null;
    this._touchEnd    = null;
    this._touchCancel = null;
    while (this.keyWaiters.length > 0) this.keyWaiters.shift()('\x1b');
    this.inputBar.classList.remove('active');
    this.wrap.classList.remove('active');
    this.outputDiv.style.display = '';
    this.active = false;
  }

  abort() {
    this.aborted = true;
    while (this.keyWaiters.length > 0) this.keyWaiters.shift()('\x1b');
    if (this._sleepCancel) { this._sleepCancel(); this._sleepCancel = null; }
    if (this._inputResolve) {
      if (this._inputKeyHandler) this.inputField.removeEventListener('keydown', this._inputKeyHandler);
      this._inputResolve('');
      this._inputResolve = null;
    }
  }

  readLine() {
    return new Promise(resolve => {
      // Two fields cannot share one device keyboard: whichever was focused last wins and the
      // other keeps a caret that no longer receives anything.
      this._closeKeypad();
      this.inputBar.classList.add('active');
      this.inputField.value = '';
      this.inputField.focus();
      this._inputResolve = val => {
        this.inputBar.classList.remove('active');
        this._inputResolve   = null;
        this._inputKeyHandler = null;
        this.canvas.focus();
        resolve(val);
      };
      const onKey = e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation(); // prevent Enter from leaking into canvas keyQueue
          const val = this.inputField.value;
          this.inputField.removeEventListener('keydown', onKey);
          if (this._inputResolve) this._inputResolve(val);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          this.inputField.removeEventListener('keydown', onKey);
          if (this._inputResolve) this._inputResolve('');
        } else {
          e.stopPropagation(); // block all typing from reaching canvas keyQueue
        }
      };
      this._inputKeyHandler = onKey;
      this.inputField.addEventListener('keydown', onKey);
    });
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.fillStyle = this._bg;
    this.ctx.fillRect(0, 0, this.cols * this.cellW, this.rows * this.cellH);
    this.printRow = 1;
    this.printCol = 1;
  }

  // Returns true for Unicode "wide" characters (emoji, CJK fullwidth) that occupy 2 columns.
  //
  // Delegates to the interpreter's own width table rather than approximating: a program
  // lays its screen out using std/term's widths, so if the renderer disagrees about how
  // many cells a character occupies, it clips or overdraws. That is exactly what happened
  // with GO's default stones (⚫ U+26AB / ⚪ U+26AA): the old local test here was
  // `cp >= 0x1F000 || (cp >= 0xFF01 && cp <= 0xFFE6)`, which misses them, so each stone was
  // drawn two cells wide by the font and then clipped to one — every stone on the board came
  // out as a half moon. (GO's 月 theme uses 🌑/🌕 above U+1F000 and was unaffected, which is
  // why it looked theme-specific.)
  _isWide(ch) {
    return codePointDisplayWidth(ch.codePointAt(0)) === 2;
  }

  _drawChar(row, col, ch, bks, fg, bg) {
    if (!this.ctx || row < 1 || row > this.rows || col < 1 || col > this.cols) return;
    // Snap cell boundaries to integers to avoid sub-pixel accumulation
    const x  = Math.round((col - 1) * this.cellW);
    const y  = Math.round((row - 1) * this.cellH);
    const x2 = Math.round( col      * this.cellW);
    const y2 = Math.round( row      * this.cellH);
    const cw = x2 - x;
    const ch2 = y2 - y;
    // Wide chars (emoji) occupy 2 cells — same behaviour as a real terminal
    const wide  = ch && ch !== ' ' && this._isWide(ch);
    const clipW = wide ? cw * 2 : cw;
    // Erase cell(s) + 1px right: clears any bleed the previous char left in the neighbor
    this.ctx.clearRect(x, y, clipW + 1, ch2);
    this.ctx.fillStyle = (bg !== null && bg !== undefined) ? ansi256ToRgb(bg) : this._bg;
    this.ctx.fillRect(x, y, clipW, ch2);
    if (!ch || ch === ' ') return;
    let style = '';
    if (bks & 1) style += 'bold ';
    if (bks & 2) style += 'italic ';
    this.ctx.font = canvasFont(style);
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = (fg !== null && fg !== undefined) ? ansi256ToRgb(fg) : this._fg;
    // Clip to cell (or 2 cells for wide): prevents glyph bleed into further neighbors
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(x, y, clipW, ch2);
    this.ctx.clip();
    this.ctx.fillText(ch, x, y + 1);
    this.ctx.restore();
    if (bks & 4) {
      this.ctx.fillStyle = (fg !== null && fg !== undefined) ? ansi256ToRgb(fg) : this._fg;
      this.ctx.fillRect(x, y + ch2 - 2, cw, 1);
    }
  }

  // Positioned output (>>~) — draws at absolute position and updates streaming cursor
  printAt(row, col, text, bks, fg, bg) {
    if (!this.ctx) return;
    for (const ch of [...text]) {
      this._drawChar(row, col, ch, bks, fg, bg);
      col += (ch && this._isWide(ch)) ? 2 : 1;
    }
    this.printRow = row;
    this.printCol = col;
  }

  // Streaming output (>>) — renders at current cursor position, continues after >>~ output
  print(text) {
    for (const ch of text) {
      if (ch === '\n') { this.printRow++; this.printCol = 1; }
      else {
        this._drawChar(this.printRow, this.printCol, ch, 0, null, null);
        this.printCol += (this._isWide(ch)) ? 2 : 1;
      }
    }
  }

  async readKey() {
    if (this.keyQueue.length > 0) return this.keyQueue.shift();
    return new Promise(resolve => this.keyWaiters.push(resolve));
  }

  pollKey() {
    return this.keyQueue.length > 0 ? this.keyQueue.shift() : '\0';
  }

  getSize() { return [this.rows, this.cols]; }

  _mapKey(e) {
    if (e.key === 'ArrowUp')    return '↑';
    if (e.key === 'ArrowDown')  return '↓';
    if (e.key === 'ArrowLeft')  return '←';
    if (e.key === 'ArrowRight') return '→';
    if (e.key === 'Enter')      return '\n';
    if (e.key === 'Escape')     return '\x1b';
    if (e.key.length === 1)     return e.key;
    return '\0';
  }
}

// ─── Interactive input ────────────────────────────────────────────────────────
function inputFn() {
  return new Promise(resolve => {
    const line = document.createElement('div');
    line.className = 'out-input-line';

    const caret = document.createElement('span');
    caret.className = 'out-input-prompt';
    caret.textContent = '❮❮ ';

    const inp = document.createElement('input');
    inp.className = 'out-input-field';
    inp.type = 'text';
    inp.setAttribute('autocomplete', 'off');
    inp.setAttribute('spellcheck', 'false');

    line.appendChild(caret);
    line.appendChild(inp);
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
    inp.focus();

    inp.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        // Cancel = EOF: typed input (<< ###(n) …) re-prompts until valid, so the
        // user needs a way out; the interpreter aborts like the CLI on closed stdin.
        inp.remove();
        line.remove();
        resolve(null);
        return;
      }
      if (e.key !== 'Enter') return;
      const value = inp.value;
      inp.remove();
      const val = document.createElement('span');
      val.className = 'out-input-value';
      val.textContent = value;
      line.appendChild(val);
      outputEl.appendChild(document.createTextNode('\n'));
      outputEl.scrollTop = outputEl.scrollHeight;
      resolve(value);
    });
  });
}

// ─── Module resolver: look up other MOUNTED files by full relative path ──────
//
// Mounted, not open: this is what lets a package run in full from a single tab. The
// resolver sees every mounted file, so `<# ../核/盤` finds 盤.zy whether or not it has a tab.
//
// An earlier version collapsed every import to its basename (`./核/盤` and `../核/盤` both
// became `盤.zy`), which worked by accident for flat single-directory examples but breaks in
// two real ways once mounted names are full relative paths (which they always are now):
//
//   1. Two same-named modules in different directories collide onto one file.
//   2. It never returned `resolvedPath`, so zymbol.js's module cache (keyed by the *raw,
//      un-normalized* import string when resolvedPath is absent) treated `./核/盤` and
//      `../核/盤` — the same file, imported from two different files — as two distinct
//      modules, loading and running it twice with two independent copies of its state.
//
// The path-normalizing logic lives in module-resolver.js (factored out so it can be
// unit-tested without a DOM); this just binds it to the store.
function buildModuleResolver(baseDir = '') {
  return makeResolver(name => store.codeOf(name), baseDir);
}

// ─── Parse CLI args (shell-like: spaces split, quotes group) ─────────────────
function parseCliArgs(str) {
  const args = [];
  let cur = '', quote = null;
  for (const ch of str) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ' ') {
      if (cur) { args.push(cur); cur = ''; }
    } else {
      cur += ch;
    }
  }
  if (cur) args.push(cur);
  return args;
}

// ─── Run ──────────────────────────────────────────────────────────────────────
// Set below by the "Split panel + output toggle" block once it wires up the Output panel.
// A plain closure bridge rather than a custom event: runCode only ever fires from a click,
// long after that block has already run at module load, so the assignment always lands
// before this is ever called.
let expandOutputPanel = () => {};

async function runCode() {
  expandOutputPanel();
  clearOutput();

  // The model is only written back on tab switches and on `input`. Running a script that
  // ISN'T the focused tab (the common case — the script picker can point anywhere) would
  // otherwise execute the last-saved copy while the editor shows edits that were never
  // captured. This flush makes "press Run" always see what is on screen.
  flushEditor();

  let src, resolver, displayPath, execOpts;
  const target = runTarget ? store.byName(runTarget) : null;
  if (target) {
    src = target.code;
    // Imports resolve relative to the file containing them, not to the project root —
    // same rule as the CLI (ModulePath::resolve_from).
    resolver = buildModuleResolver(dirOf(target.name));
    displayPath = target.name;
    // A package is typically a real multi-file program (a board being drawn, a small
    // tournament), not the single-statement snippets the default limits were sized for.
    // Raised only for a package/project run; a plain file keeps zymbol.js's defaults.
    execOpts = { maxSteps: 2_000_000, maxBytes: 2_000_000 };
  } else {
    const active = store.active();
    src = (active?.code ?? '').trim();
    if (!src) { appendOutput('(empty program)', 'out-meta'); return; }
    // Resolve against the active file's own directory, not the root: with a package
    // mounted, the focused tab can itself be a nested module (e.g. 表示/描画.zy) whose
    // `../核/盤` imports only resolve correctly relative to 表示/.
    resolver = buildModuleResolver(dirOf(active?.name ?? ''));
    displayPath = active?.name ?? null;
    execOpts = {};
  }

  const cliArgs = parseCliArgs(argsInputEl.value);
  const tui = new BrowserTUI(
    document.getElementById('tui-canvas'),
    outputEl
  );
  const stopBtn = document.getElementById('tui-stop-btn');
  const onStop = () => tui.abort();
  stopBtn.addEventListener('click', onStop);
  // Route << input through canvas bar when TUI is active
  const activeInputFn = () => tui.active ? tui.readLine() : inputFn();
  try {
    await runZymbol(src, activeInputFn, text => appendOutput(text), resolver, displayPath, tui, cliArgs, execOpts);
    if (!tui.aborted) appendOutput('\n— done —', 'out-meta');
  } catch (err) {
    tui.leave();
    if (!tui.aborted) appendOutput('\n' + (err.message ?? String(err)), 'out-error');
  } finally {
    stopBtn.removeEventListener('click', onStop);
  }
}

document.getElementById('run-btn').addEventListener('click', runCode);
document.getElementById('clear-code-btn').addEventListener('click', () => {
  editor.value = '';
  syncHighlight();
  store.clearActive();
});

// ─── Download active file ─────────────────────────────────────────────────────
document.getElementById('download-btn').addEventListener('click', () => {
  flushEditor();
  const f = store.active();
  if (!f) return;
  const blob = new Blob([f.code], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: baseOf(f.name) });
  a.click();
  URL.revokeObjectURL(url);
});

// ─── Upload .zy files / .zyp packages ────────────────────────────────────────
const uploadInput = document.getElementById('upload-input');

document.getElementById('upload-btn').addEventListener('click', () => uploadInput.click());

uploadInput.addEventListener('change', async () => {
  const picked = [...uploadInput.files];
  uploadInput.value = '';          // reset so the same file can be re-uploaded
  if (!picked.length) return;

  const loose = [];
  for (const file of picked) {
    if (file.name.endsWith('.zyp')) await uploadZyp(file);
    else loose.push(file);
  }
  if (!loose.length) return;

  flushEditor();
  let firstId = null;
  for (const file of loose) {
    const name = file.name.endsWith('.zy') ? file.name : file.name + '.zy';
    const code = await file.text();
    // Reuse an empty, untouched tab rather than leaving a stray prog1.zy behind.
    const active = store.active();
    let f;
    if (!firstId && active && !active.dirty && active.code.trim() === '' && active.origin === USER) {
      store.rename(active.id, name);
      active.code = code;
      f = active;
    } else {
      f = store.mount(name, code, { origin: USER });
    }
    firstId ??= f.id;
    store.open(f.id, { activate: false });
  }
  if (firstId) openFile(firstId);
});

/**
 * A `.zyp` picked from disk takes exactly the same path as a catalog package entry —
 * mounted under the archive's own name, one tab opened, scripts in the picker.
 */
async function uploadZyp(file) {
  const root = file.name.replace(/\.zyp$/, '');
  try {
    const pkg = await readZyp(await file.arrayBuffer());
    const { files, scripts, entryName } = collectPackage(pkg, root);
    mountAndOpen({
      id: 'upload:' + root, title: pkg.manifest.package?.name ?? root,
      root, files, entryName, scripts,
    }, { isBundle: true, kind: 'zyp' });
    appendOutput(
      `(mounted package '${pkg.manifest.package?.name ?? file.name}' — ` +
      `${files.size} file(s), ${scripts.length} script(s))`,
      'out-meta'
    );
  } catch (err) {
    appendOutput(`(failed to read ${file.name}: ${err.message ?? err})`, 'out-error');
  }
}

document.getElementById('clear-output-btn').addEventListener('click', clearOutput);

// ─── Sidebar: WORKSPACE + the example catalog ───────────────────────────────
sidebar = createSidebar({
  store,
  hooks: {
    openEntry: openCatalogEntry,
    openFile,
    newFile: newUserFile,
    isRunTarget: path => runTarget === path,
    renameFile(id) {
      // The tab strip owns inline renaming; from the tree, focus the tab and start there.
      openFile(id);
      const tab = fileTabsEl.querySelector('.ftab.active');
      const name = tab?.querySelector('.ftab-name');
      const f = store.byId(id);
      if (tab && name && f) startRename(tab, name, f);
    },
    runScript(mount, script) {
      runTarget = script.path;
      refreshScriptSelect();
      const f = store.byName(script.path);
      if (f) openFile(f.id);
      sidebar.closeDrawer();
      runCode();
    },
    unmountFile(id) {
      const f = store.byId(id);
      if (f?.dirty && !window.confirm(`'${f.name}' has unsaved edits. Unmount anyway?`)) return;
      flushEditor();
      store.unmount(id);
      refreshScriptSelect();
      showActiveInEditor();
    },
    unmountBundle(originId) {
      const m = store.mountList().find(x => x.id === originId);
      const dirty = store.all().filter(f => f.origin === originId && f.dirty);
      if (dirty.length && !window.confirm(
            `${dirty.length} file(s) of '${m?.title ?? originId}' have unsaved edits. ` +
            `Unmount anyway?`)) return;
      flushEditor();
      store.unmountBundle(originId);
      refreshScriptSelect();
      showActiveInEditor();
    },
  },
});

// ─── Theme toggle ─────────────────────────────────────────────────────────────
const themeBtn  = document.getElementById('theme-toggle');
const themeIcon = themeBtn;

function applyTheme(light) {
  document.documentElement.classList.toggle('light', light);
  themeIcon.textContent = light ? '🌙' : '☀️';
  localStorage.setItem('zy-theme', light ? 'light' : 'dark');
}

themeBtn.addEventListener('click', () => {
  applyTheme(!document.documentElement.classList.contains('light'));
});
applyTheme(document.documentElement.classList.contains('light'));

// ─── Boot ─────────────────────────────────────────────────────────────────────
//
// Two phases, because clean example files are not persisted (see filestore.js): the local
// state comes back synchronously, then the catalog is fetched and the previously mounted
// entries are re-mounted from `examples/`.
const restore = store.load();
showActiveInEditor();
renderFileTabs();
sidebar.render();

(async function boot() {
  let catalog;
  try {
    catalog = await loadCatalog();
    sidebar.setCatalog(catalog);
  } catch (err) {
    sidebar.setError(String(err.message ?? err));
    return;
  }

  // Re-mount what was mounted last session, without stealing focus or clobbering edits:
  // a persisted dirty copy of an example file already sits in the store and wins.
  for (const id of restore.mountIds) {
    const entry = catalog.byId.get(id);
    if (!entry) continue;                     // entry renamed or retired since
    try {
      const bundle = await mountEntry(entry);
      store.mountBundle({ ...bundle, isBundle: !!(entry.dir || entry.zyp),
                         kind: entry.zyp ? 'zyp' : 'dir' });
    } catch { /* offline or moved — the tree just won't show it */ }
  }
  for (const name of restore.openNames) {
    const f = store.byName(name);
    if (f) store.open(f.id, { activate: false });
  }
  const active = restore.activeName ? store.byName(restore.activeName) : null;
  if (active) store.open(active.id);
  refreshScriptSelect();
  showActiveInEditor();
  renderFileTabs();
  sidebar.render();

  // Deep link, so docs, the course, the landing page — or anyone sharing a game — can point
  // at one entry instead of "open the playground and scroll". Two forms:
  //
  //   ?open=games/classic/go.zyp        by path under examples/, the form the address bar
  //   ?open=rosetta-stone/klingon.zy    shows and the one worth sharing
  //   ?example=pkg-go                   by catalog id — the original form, still honoured
  //
  const params     = new URLSearchParams(location.search);
  const wantedPath = params.get('open');
  const wantedId   = params.get('example');
  if (wantedPath) {
    const hit = resolveDeepLink(catalog, wantedPath);
    if (hit) await openCatalogEntry(hit.entry, { file: hit.file });
    else appendOutput(`(no example at '${wantedPath}')`, 'out-error');
  } else if (wantedId) {
    const entry = catalog.byId.get(wantedId);
    if (entry) await openCatalogEntry(entry);
    else appendOutput(`(unknown example '${wantedId}')`, 'out-error');
  }
})();

// ─── Playground notice ────────────────────────────────────────────────────────
(function () {
  const NOTICE_KEY = 'zy-pg-notice-seen';
  const backdrop   = document.getElementById('pg-notice-backdrop');
  const okBtn      = document.getElementById('pg-notice-ok');

  function dismiss() {
    backdrop.classList.add('hidden');
    localStorage.setItem(NOTICE_KEY, '1');
  }

  if (!localStorage.getItem(NOTICE_KEY)) {
    backdrop.classList.remove('hidden');
  }

  document.getElementById('pg-about-btn').addEventListener('click', () => {
    backdrop.classList.remove('hidden');
  });

  okBtn.addEventListener('click', dismiss);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) dismiss();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) dismiss();
  });
})();

// ─── Split panel + output toggle ─────────────────────────────────────────────
(function () {
  // #split, not #playground: the drag positions the divider as a percentage of the
  // editor+output area, which no longer spans the whole row now that the sidebar is in it.
  const playgroundEl     = document.getElementById('split');
  const editorPanel      = document.getElementById('editor-panel');
  const outputPanel      = document.getElementById('output-panel');
  const splitHandle      = document.getElementById('split-handle');
  const toggleOutputBtn  = document.getElementById('toggle-output-btn');
  const layoutToggleBtn  = document.getElementById('layout-toggle-btn');

  const LS_LAYOUT = 'zy-split-layout'; // desktop-only preference: 'row' (side) or 'column' (bottom)

  let dragging      = false;
  let outputHidden  = false;
  let savedEditorPct = 50;
  let userLayout = localStorage.getItem(LS_LAYOUT) === 'column' ? 'column' : 'row';

  function isMobile() { return window.innerWidth <= 700; }
  // Mobile is always stacked (no room for side-by-side); on desktop it's the user's call.
  function isStacked() { return isMobile() || userLayout === 'column'; }

  function applyLayoutClass() {
    playgroundEl.classList.toggle('stacked', isStacked());
  }

  // Icon depicts the destination layout (a square with the half where output would land
  // filled in), not the current one — same "shows where it's going" convention as most
  // IDE panel-move icons.
  function updateLayoutBtnIcon() {
    if (!layoutToggleBtn) return;
    if (userLayout === 'column') {
      layoutToggleBtn.textContent = '◨';
      layoutToggleBtn.title = 'Move output to the side';
    } else {
      layoutToggleBtn.textContent = '⬓';
      layoutToggleBtn.title = 'Move output to the bottom';
    }
  }

  // Chevron points toward the edge the panel is collapsing to (output is the rightmost/
  // bottommost panel), so it reads as "this button pushes the boundary that way".
  function updateToggleIcon() {
    if (outputHidden) {
      toggleOutputBtn.textContent = isStacked() ? '▲' : '◀';
      toggleOutputBtn.title = 'Show output';
    } else {
      toggleOutputBtn.textContent = isStacked() ? '▼' : '▶';
      toggleOutputBtn.title = 'Hide output';
    }
  }

  function showOutput() {
    if (!outputHidden) return;
    outputPanel.classList.remove('output-collapsed');
    splitHandle.classList.remove('output-collapsed');
    editorPanel.style.flex = `0 0 ${savedEditorPct}%`;
    outputPanel.style.flex = `0 0 ${100 - savedEditorPct}%`;
    outputHidden = false;
    updateToggleIcon();
  }

  toggleOutputBtn.addEventListener('click', () => {
    if (outputHidden) {
      showOutput();
      return;
    }
    const pgRect  = playgroundEl.getBoundingClientRect();
    const edRect  = editorPanel.getBoundingClientRect();
    savedEditorPct = isStacked()
      ? (edRect.height / pgRect.height) * 100
      : (edRect.width  / pgRect.width)  * 100;
    editorPanel.style.flex = '1 1 auto';
    outputPanel.style.flex = '';
    outputPanel.classList.add('output-collapsed');
    splitHandle.classList.add('output-collapsed');
    outputHidden = true;
    updateToggleIcon();
  });

  // Running a program while Output is collapsed should surface the result rather than
  // silently write into a strip the user can't see.
  expandOutputPanel = showOutput;

  // Desktop-only: mobile hides this button entirely (see CSS) since there's no side-by-side
  // option to switch to. Toggling clears any dragged split percentage and collapse state —
  // a ratio dragged along one axis isn't a meaningful default for the other.
  layoutToggleBtn?.addEventListener('click', () => {
    userLayout = userLayout === 'column' ? 'row' : 'column';
    localStorage.setItem(LS_LAYOUT, userLayout);
    applyLayoutClass();
    updateLayoutBtnIcon();
    if (outputHidden) {
      outputPanel.classList.remove('output-collapsed');
      splitHandle.classList.remove('output-collapsed');
      outputHidden = false;
    }
    editorPanel.style.flex = '';
    outputPanel.style.flex = '';
    updateToggleIcon();
  });

  // Drag start
  function onDragStart(e) {
    if (outputHidden) return;
    dragging = true;
    splitHandle.classList.add('dragging');
    playgroundEl.classList.add('dragging');
    document.body.style.userSelect = 'none';
    if (e.cancelable) e.preventDefault();
  }

  // Drag move
  function onDragMove(clientX, clientY) {
    if (!dragging) return;
    const pgRect = playgroundEl.getBoundingClientRect();
    let pct = isStacked()
      ? ((clientY - pgRect.top)  / pgRect.height) * 100
      : ((clientX - pgRect.left) / pgRect.width)  * 100;
    pct = Math.max(15, Math.min(85, pct));
    editorPanel.style.flex = `0 0 ${pct}%`;
    outputPanel.style.flex = `0 0 ${100 - pct}%`;
  }

  // Drag end
  function onDragEnd() {
    if (!dragging) return;
    dragging = false;
    splitHandle.classList.remove('dragging');
    playgroundEl.classList.remove('dragging');
    document.body.style.userSelect = '';
  }

  splitHandle.addEventListener('mousedown',  e => onDragStart(e));
  splitHandle.addEventListener('touchstart', e => onDragStart(e), { passive: false });
  document.addEventListener('mousemove',  e => onDragMove(e.clientX, e.clientY));
  document.addEventListener('touchmove',  e => { const t = e.touches[0]; onDragMove(t.clientX, t.clientY); }, { passive: true });
  document.addEventListener('mouseup',   onDragEnd);
  document.addEventListener('touchend',  onDragEnd);

  // Keep everything in sync as the viewport crosses the mobile breakpoint.
  window.addEventListener('resize', () => {
    applyLayoutClass();
    updateToggleIcon();
  });
  applyLayoutClass();
  updateLayoutBtnIcon();
  updateToggleIcon();
})();

