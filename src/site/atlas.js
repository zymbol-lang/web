// SPDX-License-Identifier: AGPL-3.0-only
/**
 * atlas.js — index3.html: its behaviour, and its share of the site's translations.
 *
 * The strings come out of `data/i18n/i18n.json`, the same file the front page reads, under
 * an `atlas` block on each language entry; the picker is the site's own region tabs and
 * chips, built by the module both pages import (src/site/langbar.js). There is one
 * language list, one data load and one `zy-lang` — a language chosen on either page is the
 * language the other one opens in.
 *
 * A key with no translation yet falls back to English, key by key, which is what every
 * other surface of the site does: the manual falls back the same way. So a language can be
 * filled in one sitting or in ten, and the reader always gets a page rather than a grid of
 * key names.
 *
 * The markup carries `data-i18n="hero.t1"` rather than forty `getElementById` calls, and
 * the English text stays in the HTML: with no JavaScript the page reads in English instead
 * of going blank.
 *
 * What is NOT translated, on purpose: the sample program, its output and the four terminal
 * captures. They are the page's evidence. A capture rewritten in the reader's language
 * would be a redrawing of it, and translating the sample's comments would make the page
 * disagree with the file its own "run it" link opens.
 */

import { LANG_STORAGE_KEY, bcp47Of, resolveInitialLang } from '../i18n/detect.js';
import { loadLanguageData, createLangBar, fadeUpdate } from './langbar.js';
import { highlightZymbol } from './highlight-zy.js';

const data = await loadLanguageData();
const { i18n } = data;

// ─── the reader's strings ────────────────────────────────────────────────────

/** Nested for editing ({hero: {t1: …}}), flat for lookup ('hero.t1'). */
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

/**
 * Which entry's `atlas` block a language reads. `castellano` declares
 * `"atlas_alias": "spanish"` and reads that one: es-ES and es-LA say the same things on this
 * page, so a second copy would only be a second thing to keep in step. It is an alias and
 * not a fallback — the four keys below still come from the reader's own entry, so a
 * castellano reader gets castellano's alpha notice, which is not the same text.
 *
 * Portuguese is the opposite case and has two blocks of its own: pt-BR and pt-PT really do
 * differ on the words this page uses (`limpar a tela` / `limpar o ecrã`).
 */
function atlasEntry(id) {
  const entry = i18n[id];
  const alias = entry?.atlas_alias;
  return (alias && i18n[alias]?.atlas) ? i18n[alias] : entry;
}

/**
 * One flat table per language. Four keys come from the top level of the entry rather than
 * from the `atlas` block, because the front page already says those things in all 119
 * languages and this page has no business saying them differently — the alpha notice above
 * all, which is where the project declares its AI-assisted engineering.
 */
function stringsFor(id) {
  const entry = i18n[id];
  if (!entry) return {};
  return {
    ...flatten(atlasEntry(id)?.atlas),
    'nav.home':   entry.nav_home,
    'nav.try':    entry.nav_try_online,
    'alpha.msg':  entry.alpha_msg,
    'alpha.link': entry.alpha_link,
  };
}

const BASE = stringsFor('english');
let strings = BASE;
let currentLang = 'english';

/** The reader's language, then English, then the key — visibly wrong beats silently blank. */
const t = key => strings[key] ?? BASE[key] ?? key;

/**
 * Re-labels the page. Three declarative hooks, so adding a string is an attribute:
 *
 *   data-i18n="key"        textContent
 *   data-i18n-html="key"   innerHTML, for the sentences with <b>, <s>, <code> or a link
 *                          inside. The value comes from this repository's own catalogue
 *                          and from nowhere else.
 *   data-i18n-attr="a:key" one or more attributes
 */
function applyTranslations() {
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-html]')) el.innerHTML = t(el.dataset.i18nHtml);
  for (const el of document.querySelectorAll('[data-i18n-attr]')) {
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const i = pair.indexOf(':');
      if (i > 0) el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim()));
    }
  }
  document.title = t('title');
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', t('desc'));
}

// ─── the sample program, in the reader's language ────────────────────────────
//
// Section 03 shows a real file out of examples/, not a transcription of one: the same
// file its own "run it" link opens in the playground. There is one Mandelbrot per
// language — the identifiers translated, the marks untouched, which is the page's whole
// claim — and they are proved to be the same program by running them: both paint 5588
// cells at identical row, column, colour and glyph, under the tree-walker and the VM.
//
// Adding a language is a file plus a line here plus a catalog entry, and
// tests/test_i18n_atlas.mjs fails if those three ever disagree.
const SAMPLE_LANGS = ['english', 'spanish', 'portuguese', 'portugues_eu', 'french',
                      'haitian_creole', 'quechua', 'guarani', 'nahuatl',
                      'jamaican_patois', 'aymara', 'mapuche', 'maya', 'kiche',
                      'navajo', 'cherokee', 'cree_syl',
                      'wayuu', 'embera', 'yanomami',
                      'german', 'italian', 'dutch', 'polish', 'russian', 'greek',
                      'ukrainian', 'czech', 'swedish', 'danish', 'romanian', 'catalan',
                      'norwegian', 'icelandic', 'finnish', 'slovak', 'croatian', 'bulgarian',
                      'estonian', 'latvian', 'lithuanian', 'serbian', 'basque', 'galician',
                      'slovenian', 'albanian', 'belarusian', 'macedonian',
                      'mandarin', 'japanese', 'korean', 'hindi', 'vietnamese', 'indonesian',
                      'thai', 'bengali', 'tamil', 'telugu', 'malay', 'tagalog',
                      'marathi', 'gujarati', 'punjabi', 'kannada', 'malayalam', 'nepali',
                      'burmese', 'javanese', 'khmer', 'lao', 'sundanese', 'sinhala',
                      'swahili', 'afrikaans', 'amharic', 'hausa', 'yoruba', 'zulu',
                      'igbo', 'xhosa', 'somali', 'lingala', 'shona', 'nyanja',
                      'oromo', 'tigrinya', 'luganda', 'setswana', 'wolof', 'bambara', 'fula',
                      'nigerian_pidgin',
                      'arabic', 'hebrew', 'persian', 'urdu', 'pashto', 'turkish',
                      'azerbaijani', 'kurdish', 'georgian', 'armenian',
                      'esperanto', 'ido', 'interlingua', 'lojban', 'toki_pona', 'emoji',
                      'klingon', 'klingon_piqad'];

function samplePath(id) {
  // An aliased language reads the program its alias reads, for the same reason it reads its
  // strings: a Castilian Mandelbrot would be the Latin-American one under another name.
  const want = i18n[id]?.atlas_alias ?? id;
  return `examples/graphics/mandelbrot/${SAMPLE_LANGS.includes(want) ? want : 'english'}.zy`;
}

/**
 * How many terminal columns a line occupies — which is not how many characters it has.
 * A CJK ideograph is one code point and two columns wide, so counting code points sized the
 * Japanese pane at 46 columns for content 68 columns wide, and the code spilled out of a
 * pane that had room for it. The `w1`/`w2` boxing on the captured terminal frames further
 * down this page is the same fact, already acknowledged once.
 *
 * The ranges are Unicode's East Asian Wide and Fullwidth, which is what a monospace font
 * doubles. Kept as ranges rather than a property lookup because there is no `east_asian_width`
 * in the browser and this page is not downloading a table for sixty lines of code.
 */
const WIDE = [
  [0x1100, 0x115F], [0x2E80, 0x303E], [0x3041, 0x33FF], [0x3400, 0x4DBF],
  [0x4E00, 0x9FFF], [0xA000, 0xA4CF], [0xA960, 0xA97F], [0xAC00, 0xD7A3],
  [0xF900, 0xFAFF], [0xFE10, 0xFE19], [0xFE30, 0xFE6F], [0xFF00, 0xFF60],
  [0xFFE0, 0xFFE6], [0x1F300, 0x1F64F], [0x1F900, 0x1F9FF],
  [0x20000, 0x2FFFD], [0x30000, 0x3FFFD],
];
function displayWidth(line) {
  let w = 0;
  for (const ch of line) {
    const cp = ch.codePointAt(0);
    w += WIDE.some(([lo, hi]) => cp >= lo && cp <= hi) ? 2 : 1;
  }
  return w;
}

/** What the pane shows: the program, without the header comment that explains it. */
function sampleBody(source) {
  const lines = source.split('\n');
  let last = -1;
  lines.forEach((l, i) => { if (/^\/\/ =+$/.test(l.trim())) last = i; });
  const body = lines.slice(last + 1);
  while (body.length && !body[0].trim()) body.shift();
  while (body.length && !body[body.length - 1].trim()) body.pop();
  return body.join('\n');
}

const srcEl  = document.getElementById('zy-src');
const fileEl = document.getElementById('zy-file');
const runEl  = document.getElementById('zy-run');
const linkEl = document.getElementById('zy-permalink');
const sampleCache = new Map();

async function showSample(langId) {
  const path = samplePath(langId);
  const open = path.replace(/^examples\//, '');

  fileEl.textContent = open;
  runEl.href = `playground.html?open=${open}`;
  linkEl.textContent = `zymbol-lang.org/playground.html?open=${open}`;

  if (!sampleCache.has(path)) {
    sampleCache.set(path, fetch(path).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    }).catch(err => {
      // The pane keeps whatever it is showing — the English file is in the markup — rather
      // than blanking out. A section titled "now read this" with nothing to read is worse
      // than one showing the wrong language.
      console.warn(`atlas: could not load ${path} —`, err.message);
      return null;
    }));
  }
  const source = await sampleCache.get(path);
  if (source === null || samplePath(currentLang) !== path) return;   // language moved on

  const body = sampleBody(source);
  srcEl.innerHTML = highlightZymbol(body);
  // The pane is fitted to the widest line it actually has, not to a number written down
  // once: a translation is a different length, and Spanish is eight columns wider.
  srcEl.style.setProperty('--cols', Math.max(...body.split('\n').map(displayWidth)));
  markScrollers();
}

// ─── theme ───────────────────────────────────────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function paintTheme() {
  themeIcon.textContent = document.documentElement.classList.contains('light') ? '☀️' : '🌙';
}
paintTheme();
themeBtn.addEventListener('click', () => {
  const light = document.documentElement.classList.toggle('light');
  localStorage.setItem('zy-theme', light ? 'light' : 'dark');
  paintTheme();
});

// ─── mobile nav ──────────────────────────────────────────────────────────────
const menuBtn = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
function shutMenu() {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.querySelector('span').textContent = '☰';
}
menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.querySelector('span').textContent = open ? '✕' : '☰';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', shutMenu));
document.addEventListener('click', e => {
  if (!nav.contains(e.target) && !menuBtn.contains(e.target)) shutMenu();
});
// Escape closes it and the focus goes back to the control that opened it — a menu you can
// only leave by tapping the page is a trap for a keyboard and for a screen reader.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { shutMenu(); menuBtn.focus(); }
});

// ─── hero glyph cycle ────────────────────────────────────────────────────────
// The word rides inside the same element as the mark and fades with it — when they were
// two elements the text swapped instantly while the glyph took 0.55s to cross, so for half
// a second the page named the wrong mark.
const glyphs = [...document.querySelectorAll('.glyph')];
const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!still && glyphs.length > 1) {
  let g = 0;
  setInterval(() => {
    glyphs[g].classList.remove('is-on');
    g = (g + 1) % glyphs.length;
    glyphs[g].classList.add('is-on');
  }, 2400);
}

// ─── captured terminal frames: every boxed cell fits its box ─────────────────
// The boxes come from the capture, so the columns are already right; what is left is a
// glyph whose fallback face draws it wider than the cell it belongs to — squeeze it
// horizontally rather than let it spill over its neighbour. Each character is measured once.
function fitGlyphs() {
  const boxes = document.querySelectorAll('pre.term i');
  if (!boxes.length) return;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:-9999px';
  document.body.appendChild(probe);
  const seen = Object.create(null);
  boxes.forEach(b => {
    const ch = b.textContent, key = ch + '|' + b.className;
    if (!(key in seen)) {
      const cs = getComputedStyle(b);
      probe.style.font = `${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`;
      probe.textContent = ch;
      const natural = probe.getBoundingClientRect().width;
      const box = b.getBoundingClientRect().width;
      seen[key] = (natural > box + 0.5 && natural > 0) ? box / natural : 1;
    }
    const k = seen[key];
    // Box-drawing is squeezed on X only: shrinking it vertically too would pull the
    // verticals apart and the frame comes out dotted. A wide glyph (emoji, CJK) is scaled
    // evenly instead, so it does not end up oval.
    b.style.transform = k < 1
      ? (b.classList.contains('w2') ? `scale(${k.toFixed(3)})` : `scaleX(${k.toFixed(3)})`)
      : '';
  });
  probe.remove();
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitGlyphs);

// ─── a wide block says so, once, and stops saying it ─────────────────────────
// The captures and the fractal are wider than a phone. They scroll, but a pane that
// scrolls without looking like it does reads as a cropped image — so the ones that
// actually overflow get a marked edge, and lose it as soon as the reader moves them.
function markScrollers() {
  for (const el of document.querySelectorAll('.scroller')) {
    const over = el.scrollWidth - el.clientWidth > 4;
    el.classList.toggle('is-wide', over);
    el.classList.toggle('at-start', over && el.scrollLeft <= 2);
    el.classList.toggle('at-end', over && el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    if (!el.dataset.bound) {
      el.dataset.bound = '1';
      el.addEventListener('scroll', () => markScrollers(), { passive: true });
    }
  }
}
// A rotation changes both the cell width the scale factors were measured against and
// whether a pane overflows at all. Recompute once the reflow has settled, not on every
// resize frame.
let refit;
addEventListener('resize', () => {
  clearTimeout(refit);
  refit = setTimeout(() => { fitGlyphs(); markScrollers(); }, 200);
});

// ─── reveal on entry ─────────────────────────────────────────────────────────
// With no IntersectionObserver everything is simply already visible.
const reveals = document.querySelectorAll('.reveal');
if (window.IntersectionObserver) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  reveals.forEach(r => io.observe(r));
} else {
  reveals.forEach(r => r.classList.add('in'));
}

// ─── the mark grid ───────────────────────────────────────────────────────────
// Fourteen buttons write into one shared line instead of fourteen tooltips: a tooltip is
// not reachable by touch, and this is the section a phone reader spends longest in.
const out = document.getElementById('mk-out');
const outCode = document.getElementById('mk-code');
const outNote = document.getElementById('mk-note');
const marks = [...document.querySelectorAll('.mk')];

function showMark(btn, animate = true) {
  marks.forEach(m => {
    m.classList.toggle('sel', m === btn);
    m.setAttribute('aria-pressed', String(m === btn));
  });
  outCode.textContent = btn.dataset.code;
  outNote.textContent = btn.dataset.note;
  if (animate) { out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop'); }
}

for (const btn of marks) {
  btn.addEventListener('click', () => showMark(btn));
  btn.addEventListener('focus', () => showMark(btn));
  // Hover only where hovering is a real thing. On a touch screen the browser synthesises
  // one before the tap, which fired showMark twice and replayed the animation.
  if (matchMedia('(hover: hover)').matches) {
    btn.addEventListener('mouseenter', () => showMark(btn));
  }
}

/**
 * Labels and notes come from the catalogue, so the grid follows the page. They are written
 * back onto the buttons rather than read out of `t()` at display time: the markup ships the
 * English of both, which is what a reader with no JavaScript sees, and leaving `data-note`
 * saying one thing while the page says another would be a lie in the DOM.
 */
function paintMarks() {
  for (const btn of marks) {
    const label = btn.querySelector('i');
    if (label) label.textContent = t(`mark.${btn.dataset.mk}.name`);
    btn.dataset.note = t(`mark.${btn.dataset.mk}.note`);
  }
  const sel = marks.find(m => m.classList.contains('sel')) || marks[0];
  if (sel) showMark(sel, false);
}

// ─── language ────────────────────────────────────────────────────────────────
const langBar = createLangBar(data, {
  tabsEl:   document.getElementById('region-tabs'),
  chipsEl:  document.getElementById('lang-chips'),
  onSelect: id => selectLang(id),
});

function selectLang(langId, persist = true) {
  if (!i18n[langId]) return;
  currentLang = langId;
  strings = stringsFor(langId);
  if (persist) localStorage.setItem(LANG_STORAGE_KEY, langId);

  const bcp47 = bcp47Of(langId);
  document.documentElement.lang = bcp47;
  document.documentElement.dir = (data.langById[langId]?.dir === 'rtl' || i18n[langId].rtl) ? 'rtl' : 'ltr';
  // Keep the URL shareable and in step with the pre-paint block on the next load, exactly
  // as the front page does.
  const url = new URL(window.location.href);
  url.searchParams.set('lang', bcp47);
  history.replaceState(null, '', url.toString());

  langBar.collapse();
  langBar.setActive(langId);
  fadeUpdate(() => { applyTranslations(); paintMarks(); });
  showSample(langId);
}

// ─── init ────────────────────────────────────────────────────────────────────
selectLang(resolveInitialLang(id => Boolean(i18n[id])), false);

// Measured, not hooked to `load`. This module awaits two fetches before it reaches here,
// and `load` has usually fired by then — the listener that used to do this was registered
// after the event it was waiting for, so the wide blocks were never marked at all. The DOM
// is parsed either way: a module script is deferred.
fitGlyphs();
markScrollers();
