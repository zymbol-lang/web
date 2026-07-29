import { runZymbol, codePointDisplayWidth } from '../zymbol/zymbol.js';
import { EXAMPLES } from './examples.js';
import { esc, highlightCode } from './highlight.js';
import { readZyp } from '../zymbol/zyp.js';
import { makeResolver } from '../zymbol/module-resolver.js';

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

// ─── File store ───────────────────────────────────────────────────────────────
const LS_FILES   = 'zy-files';
const EMPTY_CODE = '>> "Hello, Zymbol-Lang!" ¶';

let files    = [];   // [{id, name, code, dirty}]
let activeId = null;

// ─── Loaded .zyp package state ────────────────────────────────────────────────
// Set by loadZypFile() below when a .zyp is uploaded. `manifest` is the parsed zyp.json;
// its files already live in `files` above (one tab per source file, named by full relative
// path — e.g. "核/盤.zy" — so the resolver looks them up by that same path).
let loadedPackage = null; // { manifest }
const scriptSelectEl = document.getElementById('zyp-script-select');

// Sentinel option value meaning "ignore the package, just run whatever tab is focused".
// Without an escape hatch, loading a package permanently hijacked the Run button: every
// later run went through the selected script, and going back to a scratch file meant
// reloading the page.
const RUN_ACTIVE_TAB = '';

function populateScriptSelect(manifest) {
  scriptSelectEl.innerHTML = '';
  for (const s of manifest.scripts ?? []) {
    const opt = document.createElement('option');
    opt.value = s.path;
    opt.textContent = s.desc ? `${s.name} — ${s.desc}` : s.name;
    scriptSelectEl.appendChild(opt);
  }
  const escape = document.createElement('option');
  escape.value = RUN_ACTIVE_TAB;
  escape.textContent = '— active tab —';
  scriptSelectEl.appendChild(escape);

  const def = (manifest.scripts ?? []).find(s => s.default) ?? manifest.scripts?.[0];
  scriptSelectEl.value = def ? def.path : RUN_ACTIVE_TAB;
  scriptSelectEl.style.display = '';
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadStore() {
  try {
    const raw = localStorage.getItem(LS_FILES);
    if (raw) {
      const data = JSON.parse(raw);
      files    = (data.files ?? []).map(f => ({ ...f, dirty: f.dirty ?? false }));
      activeId = data.activeId ?? null;
    }
  } catch {}
  if (!files.length) {
    files = [{ id: genId(), name: 'prog1.zy', code: EMPTY_CODE, dirty: false }];
  }
  if (!files.find(f => f.id === activeId)) activeId = files[0].id;
}

function saveStore() {
  try { localStorage.setItem(LS_FILES, JSON.stringify({ files, activeId })); } catch {}
}

function activeFile() {
  return files.find(f => f.id === activeId) ?? files[0];
}

function switchTo(id) {
  const cur = activeFile();
  if (cur) cur.code = editor.value;
  activeId = id;
  const f = activeFile();
  editor.value = f.code;
  syncHighlight();
  clearOutput();
  saveStore();
  renderFileTabs();
}

function newFile(name, code = EMPTY_CODE) {
  const f = { id: genId(), name, code, dirty: false };
  const cur = activeFile();
  if (cur) cur.code = editor.value;
  files.push(f);
  activeId = f.id;
  editor.value = f.code;
  syncHighlight();
  clearOutput();
  saveStore();
  renderFileTabs();
  return f;
}

function closeFile(id) {
  if (files.length <= 1) return;
  const idx = files.findIndex(f => f.id === id);
  if (idx < 0) return;
  files.splice(idx, 1);
  if (activeId === id) {
    activeId = files[Math.min(idx, files.length - 1)].id;
    editor.value = activeFile().code;
    syncHighlight();
    clearOutput();
  }
  saveStore();
  renderFileTabs();
}

function nextName(prefix) {
  const used = new Set(files.map(f => f.name));
  let n = 1;
  while (used.has(`${prefix}${n}.zy`)) n++;
  return `${prefix}${n}.zy`;
}

// Add a file without switching the active tab
function addFile(name, code) {
  const existing = files.find(f => f.name === name);
  if (existing) {
    if (!existing.dirty) existing.code = code;
    return existing;
  }
  const cur = activeFile();
  if (cur) cur.code = editor.value;
  const f = { id: genId(), name, code, dirty: false };
  files.push(f);
  saveStore();
  renderFileTabs();
  return f;
}

// Derive a .zy filename from an example title
function titleToFilename(title) {
  let base = title;
  // For "NonASCII — ASCII" titles, prefer the ASCII part as the filename
  const parts = title.split(/\s*[—–]+\s*/);
  const asciiPart = parts.find(p => /^[\x20-\x7E]+$/.test(p.trim()) && p.trim().length > 0);
  if (asciiPart && asciiPart.trim() !== title.trim()) base = asciiPart.trim();
  const slug = base
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_') || 'example';
  return slug + '.zy';
}

// Load a single-file example: find-or-create a tab by derived filename
function loadSingleFileExample(ex) {
  const filename = titleToFilename(ex.title);
  if (ex.args !== undefined)
    document.getElementById('args-input').value = ex.args;
  const existing = files.find(f => f.name === filename);
  if (existing) {
    if (existing.dirty) {
      if (!window.confirm(`'${filename}' has been modified.\nOverwrite with the original example?`)) {
        switchTo(existing.id);
        return;
      }
    }
    existing.code = ex.code;
    existing.dirty = false;
    if (existing.id === activeId) {
      editor.value = ex.code;
      syncHighlight();
      clearOutput();
      saveStore();
      renderFileTabs();
    } else {
      switchTo(existing.id);
    }
  } else {
    newFile(filename, ex.code);
  }
}

// Load a multi-file example: add support files, switch to last (main program)
function loadMultiFileExample(exFiles) {
  for (let i = 0; i < exFiles.length - 1; i++) {
    addFile(exFiles[i].name, exFiles[i].code);
  }
  const last = exFiles[exFiles.length - 1];
  const existing = files.find(f => f.name === last.name);
  if (existing) {
    if (existing.dirty) {
      if (!window.confirm(`'${existing.name}' has been modified.\nOverwrite with the original example?`)) {
        switchTo(existing.id);
        return;
      }
      existing.code = last.code;
      existing.dirty = false;
      saveStore();
      renderFileTabs();
    } else {
      existing.code = last.code;
    }
    switchTo(existing.id);
  } else {
    newFile(last.name, last.code);
  }
}

// ─── File tabs UI ─────────────────────────────────────────────────────────────
const fileTabsEl = document.getElementById('file-tabs');

function renderFileTabs() {
  fileTabsEl.innerHTML = '';
  for (const f of files) {
    const tab = document.createElement('div');
    tab.className = 'ftab' + (f.id === activeId ? ' active' : '');

    const nameSpan = document.createElement('span');
    nameSpan.className = 'ftab-name';
    nameSpan.textContent = f.name;

    const dot = document.createElement('span');
    dot.className = 'ftab-dot';
    dot.textContent = f.dirty ? '●' : '';
    dot.title = f.dirty ? 'Modified' : '';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'ftab-close';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close';
    closeBtn.addEventListener('click', e => { e.stopPropagation(); closeFile(f.id); });

    tab.appendChild(nameSpan);
    tab.appendChild(dot);
    tab.appendChild(closeBtn);
    tab.addEventListener('click', () => switchTo(f.id));

    tab.addEventListener('dblclick', e => { e.stopPropagation(); startRename(tab, nameSpan, f); });

    fileTabsEl.appendChild(tab);
  }

  const addBtn = document.createElement('button');
  addBtn.className = 'ftab-add';
  addBtn.textContent = '+';
  addBtn.title = 'New file';
  addBtn.addEventListener('click', () => newFile(nextName('prog')));
  fileTabsEl.appendChild(addBtn);

  // Scroll active tab into view
  const activeTab = fileTabsEl.querySelector('.ftab.active');
  if (activeTab) activeTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
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
    let v = inp.value.trim() || file.name;
    if (!v.endsWith('.zy')) v += '.zy';
    file.name = v;
    saveStore();
    renderFileTabs();
  }
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { committed = true; inp.value = file.name; saveStore(); renderFileTabs(); }
  });
}

// Track edits → mark file dirty
editor.addEventListener('input', () => {
  syncHighlight();
  const f = activeFile();
  if (!f) return;
  f.code = editor.value;
  if (!f.dirty) {
    f.dirty = true;
    renderFileTabs();   // refresh dot indicator
  }
  saveStore();
});

// Tab → 4 spaces
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = editor.selectionStart, end = editor.selectionEnd;
    editor.value = editor.value.slice(0, s) + '    ' + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = s + 4;
    syncHighlight();
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

class BrowserTUI {
  constructor(canvas, outputDiv) {
    this.canvas       = canvas;
    this.wrap         = document.getElementById('tui-wrap');
    this.stopBtn      = document.getElementById('tui-stop-btn');
    this.inputBar     = document.getElementById('tui-input-bar');
    this.inputField   = document.getElementById('tui-input-field');
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
    this._touchEnd        = null;
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

    this.ctx.fillStyle = '#000';
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
      if (this.inputBar.classList.contains('active')) return;
      e.preventDefault();
      const ch = this._mapKey(e);
      if (this.keyWaiters.length > 0) this.keyWaiters.shift()(ch);
      else this.keyQueue.push(ch);
    };
    document.addEventListener('keydown', this.keyListener);

    // Swipe gestures → arrow keys (mobile)
    let _tx = 0, _ty = 0;
    this._touchStart = e => {
      if (this.inputBar.classList.contains('active')) return;
      _tx = e.touches[0].clientX;
      _ty = e.touches[0].clientY;
    };
    this._touchEnd = e => {
      if (this.inputBar.classList.contains('active')) return;
      const dx = e.changedTouches[0].clientX - _tx;
      const dy = e.changedTouches[0].clientY - _ty;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      const ch = Math.max(ax, ay) < 25
        ? '\n'                                                        // tap → Enter
        : ax > ay ? (dx > 0 ? '→' : '←') : (dy > 0 ? '↓' : '↑');  // swipe → arrow
      if (this.keyWaiters.length > 0) this.keyWaiters.shift()(ch);
      else this.keyQueue.push(ch);
    };
    this.canvas.addEventListener('touchstart', this._touchStart, { passive: true });
    this.canvas.addEventListener('touchend',   this._touchEnd,   { passive: true });

    this.active = true;
  }

  leave() {
    if (!this.active) return;
    document.removeEventListener('keydown', this.keyListener);
    this.keyListener = null;
    if (this._touchStart) this.canvas.removeEventListener('touchstart', this._touchStart);
    if (this._touchEnd)   this.canvas.removeEventListener('touchend',   this._touchEnd);
    this._touchStart = null;
    this._touchEnd   = null;
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
    this.ctx.fillStyle = '#000';
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
    this.ctx.fillStyle = (bg !== null && bg !== undefined) ? ansi256ToRgb(bg) : '#000';
    this.ctx.fillRect(x, y, clipW, ch2);
    if (!ch || ch === ' ') return;
    let style = '';
    if (bks & 1) style += 'bold ';
    if (bks & 2) style += 'italic ';
    this.ctx.font = canvasFont(style);
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = (fg !== null && fg !== undefined) ? ansi256ToRgb(fg) : '#ddd';
    // Clip to cell (or 2 cells for wide): prevents glyph bleed into further neighbors
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(x, y, clipW, ch2);
    this.ctx.clip();
    this.ctx.fillText(ch, x, y + 1);
    this.ctx.restore();
    if (bks & 4) {
      this.ctx.fillStyle = (fg !== null && fg !== undefined) ? ansi256ToRgb(fg) : '#ddd';
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

// ─── Module resolver: look up other loaded tabs by full relative path ────────
//
// The previous version of this resolver collapsed every import to its basename
// (`./核/盤` and `../核/盤` both became `盤.zy`), which worked by accident for
// flat single-directory examples but breaks in two real ways once tabs can hold
// full relative paths (which loading a .zyp package does deliberately, one tab
// per source file — see loadZypFile below):
//
//   1. Two same-named modules in different directories collide onto one tab.
//   2. The resolver never returned `resolvedPath`, so zymbol.js's module cache
//      (keyed by the *raw, un-normalized* import string when resolvedPath is
//      absent) treats `./核/盤` and `../核/盤` — the same file, imported from
//      two different files — as two distinct modules, loading and running it
//      twice with two independent copies of its state.
//
// The actual path-normalizing logic lives in module-resolver.js (factored out so it can be
// unit-tested without a DOM); this just binds it to the playground's `files` tab model.
function buildModuleResolver(baseDir = '') {
  return makeResolver(name => files.find(f => f.name === name)?.code, baseDir);
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
async function runCode() {
  clearOutput();

  // switchTo() only flushes editor.value into the file model when the user actually
  // switches tabs. Running a package script that ISN'T the currently-focused tab (the
  // common case — the script picker below can point anywhere) would otherwise silently
  // execute the last-saved copy while the visible editor shows edits that were never
  // captured. This flush makes "press Run" always see what's on screen, package or not.
  const cur = activeFile();
  if (cur) cur.code = editor.value;

  // Directory a file's own relative imports resolve against — mirrors the CLI, where a
  // module's imports are relative to the file containing them, not to the project root.
  const dirOf = name => (name.includes('/') ? name.slice(0, name.lastIndexOf('/')) : '');

  let src, resolver, displayPath, execOpts;
  // An empty selector value is the "— active tab —" escape hatch (RUN_ACTIVE_TAB), so this
  // falls through to the plain-file path below even while a package is loaded.
  if (loadedPackage && scriptSelectEl.value) {
    const entryName = scriptSelectEl.value;
    const entryFile = files.find(f => f.name === entryName);
    if (!entryFile) {
      appendOutput(`(script '${entryName}' not found among loaded files)`, 'out-error');
      return;
    }
    src = entryFile.code;
    resolver = buildModuleResolver(dirOf(entryName));
    displayPath = entryName;
    // A package is typically a real multi-file program (e.g. drawing a board, running a
    // small tournament), not the single-statement snippets the default limits were sized
    // for. Raised only for package execution — the plain single-file editor keeps the
    // defaults from zymbol.js.
    execOpts = { maxSteps: 2_000_000, maxBytes: 2_000_000 };
  } else {
    src = editor.value.trim();
    if (!src) { appendOutput('(empty program)', 'out-meta'); return; }
    // Resolve against the active tab's own directory, not the root: with a package loaded,
    // the focused tab can itself be a nested module (e.g. 表示/描画.zy), whose `../核/盤`
    // imports only resolve correctly relative to 表示/.
    const activeName = activeFile()?.name ?? '';
    resolver = buildModuleResolver(dirOf(activeName));
    displayPath = activeName || null;
    execOpts = {};
  }

  const cliArgs = parseCliArgs(document.getElementById('args-input').value);
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
  const f = activeFile();
  if (f) { f.code = ''; f.dirty = false; saveStore(); renderFileTabs(); }
});

// ─── Download active file ─────────────────────────────────────────────────────
document.getElementById('download-btn').addEventListener('click', () => {
  const f = activeFile();
  if (!f) return;
  f.code = editor.value;
  const blob = new Blob([f.code], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: f.name });
  a.click();
  URL.revokeObjectURL(url);
});

// ─── Upload .zy files ─────────────────────────────────────────────────────────
const uploadInput = document.getElementById('upload-input');

document.getElementById('upload-btn').addEventListener('click', () => uploadInput.click());

uploadInput.addEventListener('change', () => {
  const picked = [...uploadInput.files];
  uploadInput.value = '';          // reset so same file can be re-uploaded
  if (!picked.length) return;

  let first = true;
  for (const file of picked) {
    if (file.name.endsWith('.zyp')) {
      // Binary archive — can't go through readAsText below. Handled on its own; doesn't
      // participate in the "first picked file reuses the pristine tab" logic since a
      // package always adds its own set of tabs regardless of what's currently open.
      loadZypFile(file);
      continue;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const name = file.name.endsWith('.zy') ? file.name : file.name + '.zy';
      const code = e.target.result;
      if (first) {
        // First file: check if active tab is pristine; load in place or new tab
        const cur = activeFile();
        if (cur && !cur.dirty && cur.code.trim() === '') {
          // Empty pristine tab → reuse it
          cur.name  = name;
          cur.code  = code;
          cur.dirty = false;
          editor.value = code;
          syncHighlight();
          clearOutput();
          saveStore();
          renderFileTabs();
        } else {
          newFile(name, code);
        }
        first = false;
      } else {
        newFile(name, code);
      }
    };
    reader.readAsText(file);
  }
});

// ─── Load a .zyp package: one tab per source file, named by full relative path ──
async function loadZypFile(file) {
  let zyp;
  try {
    const buf = await file.arrayBuffer();
    zyp = await readZyp(buf);
  } catch (err) {
    appendOutput(`(failed to read ${file.name}: ${err.message ?? err})`, 'out-error');
    return;
  }

  // addFile() deliberately refuses to clobber a tab with unsaved edits. That's right for
  // loading an example, but silently wrong here: the package's own copy of a module would
  // be dropped in favour of a stale edit, and the program would then run with a mix of
  // package and leftover code with nothing on screen saying so. Ask once, up front.
  const conflicts = [...zyp.files.keys()].filter(path => {
    const tab = files.find(f => f.name === path);
    return tab && tab.dirty && tab.code !== zyp.files.get(path);
  });
  let overwriteDirty = false;
  if (conflicts.length) {
    overwriteDirty = window.confirm(
      `${conflicts.length} open file(s) have unsaved edits that the package would replace:\n\n` +
      conflicts.slice(0, 10).join('\n') +
      (conflicts.length > 10 ? `\n…and ${conflicts.length - 10} more` : '') +
      `\n\nOK — use the package's versions (your edits are lost)\n` +
      `Cancel — keep your edits (the package runs with them instead)`
    );
  }

  for (const [path, code] of zyp.files) {
    const existing = files.find(f => f.name === path);
    if (existing && existing.dirty && overwriteDirty) {
      existing.code = code;
      existing.dirty = false;
      if (existing.id === activeId) { editor.value = code; syncHighlight(); }
    } else {
      addFile(path, code);
    }
  }
  if (conflicts.length && !overwriteDirty) {
    appendOutput(
      `(keeping your unsaved edits in ${conflicts.length} file(s) — the package will run with them, not its own copies)`,
      'out-meta'
    );
  }
  loadedPackage = { manifest: zyp.manifest };
  populateScriptSelect(zyp.manifest);

  const def = (zyp.manifest.scripts ?? []).find(s => s.default) ?? zyp.manifest.scripts?.[0];
  if (def) {
    const tab = files.find(f => f.name === def.path);
    if (tab) switchTo(tab.id);
  }

  appendOutput(
    `(loaded package '${zyp.manifest.package?.name ?? file.name}' — ` +
    `${zyp.files.size} file(s), ${zyp.manifest.scripts?.length ?? 0} script(s))`,
    'out-meta'
  );
}
document.getElementById('clear-output-btn').addEventListener('click', clearOutput);

// ─── Examples ─────────────────────────────────────────────────────────────────
const tabsEl  = document.getElementById('examples-tabs');
const gridEl  = document.getElementById('examples-grid');
const panelEl = document.getElementById('examples-panel');
const toggleEl = document.getElementById('examples-toggle');

let activeTab = Object.keys(EXAMPLES)[0];
let examplesOpen = true;

function setExamplesOpen(open) {
  examplesOpen = open;
  panelEl.classList.toggle('collapsed', !open);
  toggleEl.textContent = open ? 'examples ▼' : 'examples ▲';
}

toggleEl.addEventListener('click', () => setExamplesOpen(!examplesOpen));

function renderTabs() {
  tabsEl.innerHTML = '';
  for (const cat of Object.keys(EXAMPLES)) {
    const btn = document.createElement('div');
    btn.className = 'ex-tab' + (cat === activeTab ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeTab = cat;
      if (!examplesOpen) setExamplesOpen(true);
      renderTabs();
      renderGrid();
    });
    tabsEl.appendChild(btn);
  }
  tabsEl.appendChild(toggleEl);
}

function renderGrid() {
  gridEl.innerHTML = '';
  for (const ex of EXAMPLES[activeTab]) {
    const card = document.createElement('div');
    card.className = 'ex-card';
    // Multi-file examples: show last file (main program) as preview
    const previewCode = ex.files ? ex.files[ex.files.length - 1].code : ex.code;
    // Badge for multi-file examples showing the file names
    const badge = ex.files
      ? `<div class="ex-card-badge">${ex.files.map(f => esc(f.name)).join(' + ')}</div>`
      : '';
    card.innerHTML = `
      <div class="ex-card-title">${esc(ex.title)}${badge}</div>
      <div class="ex-card-code">${highlightCode(previewCode)}</div>
    `;
    card.addEventListener('click', () => {
      if (ex.files) {
        loadMultiFileExample(ex.files);
      } else {
        loadSingleFileExample(ex);
      }
    });
    gridEl.appendChild(card);
  }
}

renderTabs();
renderGrid();

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

// ─── Initialize file store ────────────────────────────────────────────────────
loadStore();
editor.value = activeFile().code;
syncHighlight();
renderFileTabs();

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
  const playgroundEl     = document.getElementById('playground');
  const editorPanel      = document.getElementById('editor-panel');
  const outputPanel      = document.getElementById('output-panel');
  const splitHandle      = document.getElementById('split-handle');
  const toggleOutputBtn  = document.getElementById('toggle-output-btn');

  let dragging      = false;
  let outputHidden  = false;
  let savedEditorPct = 50;

  function isVertical() { return window.innerWidth <= 700; }

  function updateToggleIcon() {
    if (outputHidden) {
      toggleOutputBtn.textContent = isVertical() ? '▲' : '▶';
      toggleOutputBtn.title = 'Show output';
    } else {
      toggleOutputBtn.textContent = isVertical() ? '▼' : '◀';
      toggleOutputBtn.title = 'Hide output';
    }
  }

  toggleOutputBtn.addEventListener('click', () => {
    if (outputHidden) {
      outputPanel.classList.remove('output-collapsed');
      splitHandle.classList.remove('output-collapsed');
      editorPanel.style.flex = `0 0 ${savedEditorPct}%`;
      outputPanel.style.flex = `0 0 ${100 - savedEditorPct}%`;
      outputHidden = false;
    } else {
      const pgRect  = playgroundEl.getBoundingClientRect();
      const edRect  = editorPanel.getBoundingClientRect();
      savedEditorPct = isVertical()
        ? (edRect.height / pgRect.height) * 100
        : (edRect.width  / pgRect.width)  * 100;
      editorPanel.style.flex = '1 1 auto';
      outputPanel.style.flex = '';
      outputPanel.classList.add('output-collapsed');
      splitHandle.classList.add('output-collapsed');
      outputHidden = true;
    }
    updateToggleIcon();
  });

  // Drag start
  function onDragStart(e) {
    if (outputHidden) return;
    dragging = true;
    splitHandle.classList.add('dragging');
    document.body.style.userSelect = 'none';
    if (e.cancelable) e.preventDefault();
  }

  // Drag move
  function onDragMove(clientX, clientY) {
    if (!dragging) return;
    const pgRect = playgroundEl.getBoundingClientRect();
    let pct = isVertical()
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
    document.body.style.userSelect = '';
  }

  splitHandle.addEventListener('mousedown',  e => onDragStart(e));
  splitHandle.addEventListener('touchstart', e => onDragStart(e), { passive: false });
  document.addEventListener('mousemove',  e => onDragMove(e.clientX, e.clientY));
  document.addEventListener('touchmove',  e => { const t = e.touches[0]; onDragMove(t.clientX, t.clientY); }, { passive: true });
  document.addEventListener('mouseup',   onDragEnd);
  document.addEventListener('touchend',  onDragEnd);

  // Keep icon in sync on resize
  window.addEventListener('resize', updateToggleIcon);
  updateToggleIcon();
})();

