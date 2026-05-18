import { runZymbol } from './zymbol.js';
import { EXAMPLES } from './playground-examples.js';
import { esc, highlightCode } from './playground-highlight.js';

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
    ctx.font = '13px "JetBrains Mono","Courier New",monospace';
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

    this.ctx.font = '13px "JetBrains Mono","Courier New",monospace';
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

  // Returns true for Unicode "wide" characters (emoji, CJK fullwidth) that occupy 2 columns
  _isWide(ch) {
    const cp = ch.codePointAt(0);
    return cp >= 0x1F000 || (cp >= 0xFF01 && cp <= 0xFFE6);
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
    let font = '13px "JetBrains Mono","Courier New",monospace';
    if (bks & 1) font = 'bold '   + font;
    if (bks & 2) font = 'italic ' + font;
    this.ctx.font = font;
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

// ─── Module resolver: look up other loaded tabs by name ──────────────────────
function buildModuleResolver() {
  const resolver = async (importPath) => {
    // Normalize: strip path prefix and .zy, keep just the filename
    let name = importPath.replace(/^(\.\/|\.\.\/)*/, '').replace(/\.zy$/, '') + '.zy';
    const found = files.find(f => f.name === name);
    return found ? { src: found.code, resolver } : null;
  };
  return resolver;
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
  const src = editor.value.trim();
  if (!src) { appendOutput('(empty program)', 'out-meta'); return; }

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
    await runZymbol(src, activeInputFn, text => appendOutput(text), buildModuleResolver(), null, tui, cliArgs);
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

