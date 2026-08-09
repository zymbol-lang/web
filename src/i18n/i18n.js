// SPDX-License-Identifier: AGPL-3.0-only
/**
 * i18n.js — the playground's translation dispatcher.
 *
 * Zymbol's whole premise is that a team can read and write code in its own language, so a
 * playground that can only explain itself in English is arguing against the language it
 * exists to demonstrate. This is the piece that lets it explain itself in the reader's.
 *
 * Shape, following the doctrine the project publishes for Zymbol applications in
 * `interpreter/USERAPPI18N.md`:
 *
 *   §2  the locale is never threaded through call sites as a parameter. Callers say
 *       `t('sym.if.summary')`; which language that is, is this module's business.
 *   §3  one catalogue, and every key carries a domain prefix (`sym.` `chk.` `ui.`). That
 *       is not tidiness: a prefixed key can never equal its own translation, so
 *       "translation == key" keeps meaning "this string was never translated" — which is
 *       what makes the completeness gate decidable.
 *   §10 a locale reaches the picker as *fully translated* only when it passes that gate
 *       (tests/test_i18n_playground.mjs). There is no half-translated state that lies.
 *
 * Two tiers, because 97 symbol cards × 111 languages is not something anyone is going to
 * hand-write:
 *
 *   full     a locale with a catalogue in data/i18n/playground/ — every string in its
 *            language. Listed in PUBLISHED below.
 *   labels   every other language: the interface stays in English, but the 16 concepts
 *            the landing page already translates into all of them (`?` → もし, `@` →
 *            bucle) are shown in the reader's language on the symbol cards. Free: those
 *            translations already exist, and langs.json is the 15 KB derivation of them.
 *
 * A missing key falls back to English and, failing that, renders as the key itself —
 * visibly wrong rather than silently blank, so it gets fixed.
 */

import { LANG_STORAGE_KEY, bcp47Of, resolveInitialLang } from './detect.js';

/**
 * Locales with a full catalogue. A language belongs here only once its file passes the
 * completeness gate; the gate reads this list, so adding a name without the strings to
 * back it fails the test suite rather than the reader.
 */
export const PUBLISHED = ['english', 'spanish'];

/** The language every other one falls back to, key by key. Always loaded. */
export const BASE_LOCALE = 'english';

const DATA_DIR = new URL('../../data/i18n/playground/', import.meta.url);

let catalogues = {};      // locale id → flat {key: string}
let langs      = {};      // locale id → {native, dir, ops}
let active     = BASE_LOCALE;
const listeners = new Set();

async function fetchJson(name) {
  const res = await fetch(new URL(name, DATA_DIR));
  if (!res.ok) throw new Error(`data/i18n/playground/${name}: HTTP ${res.status}`);
  return res.json();
}

/** A catalogue is nested for editing ({sym: {if: {...}}}) and flat for lookup. */
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('_')) continue;                    // _comment, _meta: notes, not strings
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

async function loadCatalogue(locale) {
  if (catalogues[locale]) return true;
  if (!PUBLISHED.includes(locale)) return false;
  try {
    const raw = await fetchJson(`${locale}.json`);
    catalogues[locale] = flatten(raw);
    return true;
  } catch (err) {
    // A locale that fails to load must not take the playground down with it: the reader
    // gets English, which is always in memory by then.
    console.warn(`i18n: could not load ${locale}.json —`, err.message);
    return false;
  }
}

/**
 * Resolves the reader's language and loads what it needs. Safe to call once, at boot.
 * @returns {Promise<string>} the locale that ended up active
 */
export async function initI18n() {
  // langs.json is what makes a language *offerable*; the catalogue is what makes it
  // *speakable*. Both the picker and the ops labels need the first, so it is not optional.
  try {
    langs = (await fetchJson('langs.json')).languages || {};
  } catch (err) {
    console.warn('i18n: could not load langs.json —', err.message);
    langs = {};
  }

  await loadCatalogue(BASE_LOCALE);

  // A language is "known" here if the playground can do anything at all with it: either a
  // full catalogue or, at minimum, the concept labels. Otherwise ?lang= would accept an id
  // the playground cannot act on and silently render English while claiming otherwise.
  const known = id => PUBLISHED.includes(id) || Boolean(langs[id]);
  const resolved = resolveInitialLang(known);

  active = resolved;
  await loadCatalogue(active);
  applyDocumentLanguage();
  return active;
}

/** Mirrors the landing page: <html lang> so a browser translator sees the truth. */
function applyDocumentLanguage() {
  document.documentElement.lang = bcp47Of(active);
}

/**
 * Looks a key up in the active locale, then English, then gives up loudly.
 * @param {string} key    domain-prefixed, e.g. 'sym.if.summary'
 * @param {object} params values for `{placeholder}` slots
 */
export function t(key, params = null) {
  const s = catalogues[active]?.[key] ?? catalogues[BASE_LOCALE]?.[key] ?? key;
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (m, name) =>
    (params[name] !== undefined && params[name] !== null ? String(params[name]) : m));
}

/** True when the string exists at all — for callers that want to omit a whole element. */
export function tHas(key) {
  return (key in (catalogues[active] ?? {})) || (key in (catalogues[BASE_LOCALE] ?? {}));
}

/**
 * The reader's word for one of the 16 concepts the landing page translates everywhere:
 * 'if' 'elif' 'else' 'loop' 'out' 'ret' 'fn' 'match' 'const' 'len' 'app' 'bool' 'var'
 * 'input' 'rem' 'try'. Null when this language has no entry — the caller omits the line.
 */
export function opsLabel(opKey) {
  if (!opKey) return null;
  return langs[active]?.ops?.[opKey] ?? null;
}

export function locale()      { return active; }
export function localeDir()   { return langs[active]?.dir ?? 'ltr'; }
export function isFullyTranslated(id = active) { return PUBLISHED.includes(id); }

/** Everything the picker needs: id, native name, direction, and which tier it is in. */
export function languageList() {
  return Object.entries(langs)
    .map(([id, meta]) => ({ id, native: meta.native, dir: meta.dir, full: PUBLISHED.includes(id) }))
    .sort((a, b) => (b.full - a.full) || a.native.localeCompare(b.native));
}

/** Switches language in place — no reload, so nothing the reader typed is lost. */
export async function setLocale(id) {
  if (id === active) return;
  if (!langs[id] && !PUBLISHED.includes(id)) return;
  active = id;
  localStorage.setItem(LANG_STORAGE_KEY, id);
  await loadCatalogue(id);
  applyDocumentLanguage();
  for (const fn of listeners) {
    try { fn(active); } catch (err) { console.warn('i18n: listener failed —', err); }
  }
}

/** @returns {() => void} unsubscribe */
export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
