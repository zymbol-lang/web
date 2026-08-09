// SPDX-License-Identifier: AGPL-3.0-only
// Which human language the reader gets — resolved once, for every page.
//
// The landing page and the playground must agree on this or the site contradicts
// itself: pick Japanese on index.html, open the playground, and get English back.
// They agree by sharing `zy-lang` in localStorage and, from here on, by sharing the
// tables below.
//
// They used to be copied by hand into three places (two blocks of src/site/main.js
// and the pre-paint <script> in index.html) and had silently drifted in both
// directions: the inline copy was missing `pt-pt`/`pt-br`/`pt`/`nn`, so a browser set
// to Portuguese got no <html lang> before first paint; main.js was missing
// `gu`/`ta`/`te`/`kn`, so a browser set to Gujarati, Tamil, Telugu or Kannada was
// never auto-detected even though all four ship in the data. This file is the union
// and the single source.
//
// One copy still has to live inline in index.html — it runs before first paint, and a
// module script is deferred by definition, so it cannot import this. That copy is
// checked against this file by tests/test_i18n_playground.mjs instead of being trusted.

export const LANG_STORAGE_KEY = 'zy-lang';

/** BCP-47 (and a few raw ids) → the language id used across the data files. */
export const BROWSER_LANG_MAP = {
  'en':'english', 'es-es':'castellano', 'es':'spanish',
  'pt-pt':'portugues_eu', 'pt-br':'portuguese', 'pt':'portuguese',
  'fr':'french', 'de':'german', 'it':'italian', 'nl':'dutch',
  'pl':'polish', 'ru':'russian', 'uk':'ukrainian', 'bg':'bulgarian',
  'hr':'croatian', 'cs':'czech', 'sk':'slovak', 'ro':'romanian',
  'hu':'hungarian', 'fi':'finnish', 'et':'estonian', 'lv':'latvian',
  'lt':'lithuanian', 'no':'norwegian', 'nb':'norwegian', 'nn':'norwegian',
  'da':'danish', 'sv':'swedish', 'is':'icelandic', 'el':'greek',
  'sr':'serbian', 'ar':'arabic', 'he':'hebrew', 'fa':'persian',
  'ur':'urdu', 'hi':'hindi', 'bn':'bengali', 'mr':'marathi',
  'pa':'punjabi', 'gu':'gujarati', 'ta':'tamil', 'te':'telugu',
  'kn':'kannada', 'zh':'mandarin', 'zh-cn':'mandarin', 'zh-tw':'mandarin',
  'cn':'mandarin', 'ja':'japanese', 'ko':'korean', 'id':'indonesian',
  'vi':'vietnamese', 'th':'thai', 'tl':'tagalog', 'sw':'swahili',
  'ha':'hausa', 'yo':'yoruba', 'am':'amharic', 'tr':'turkish',
  'eu':'basque', 'cy':'welsh', 'ga':'irish', 'ca':'catalan',
  'gl':'galician', 'af':'afrikaans', 'zu':'zulu', 'xh':'xhosa',
  'eo':'esperanto', 'tlh_hol':'klingon', 'tlh_piqad':'klingon_piqad',
};

/** Language id → BCP-47, for <html lang> so a browser translator sees the truth. */
export const LANG_BCP47 = {
  english:'en', spanish:'es', castellano:'es-ES', portuguese:'pt-BR',
  portugues_eu:'pt-PT', french:'fr', german:'de', italian:'it',
  dutch:'nl', polish:'pl', russian:'ru', ukrainian:'uk', bulgarian:'bg',
  croatian:'hr', czech:'cs', slovak:'sk', romanian:'ro', hungarian:'hu',
  finnish:'fi', estonian:'et', latvian:'lv', lithuanian:'lt',
  norwegian:'no', danish:'da', swedish:'sv', icelandic:'is', greek:'el',
  serbian:'sr', arabic:'ar', hebrew:'he', persian:'fa', urdu:'ur',
  hindi:'hi', bengali:'bn', marathi:'mr', punjabi:'pa', gujarati:'gu',
  tamil:'ta', telugu:'te', kannada:'kn', mandarin:'zh', japanese:'ja',
  korean:'ko', indonesian:'id', vietnamese:'vi', thai:'th', tagalog:'tl',
  swahili:'sw', hausa:'ha', yoruba:'yo', amharic:'am', turkish:'tr',
  basque:'eu', welsh:'cy', irish:'ga', catalan:'ca', galician:'gl',
  afrikaans:'af', zulu:'zu', xhosa:'xh', esperanto:'eo',
  klingon:'tlh_hol', klingon_piqad:'tlh_piqad',
};

/** BCP-47 for <html lang>. Falls back to the id, which is what the old code did. */
export function bcp47Of(langId) {
  return LANG_BCP47[langId] || langId;
}

/** Best match from the reader's full preferred-languages list, not just the first. */
export function detectBrowserLang() {
  const langs = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || 'en'];
  for (const l of langs) {
    const lc = l.toLowerCase();
    const match = BROWSER_LANG_MAP[lc] || BROWSER_LANG_MAP[lc.split('-')[0]];
    if (match) return match;
  }
  return 'english';
}

// `isKnown` is how a page says which ids it actually has data for: the landing asks
// its i18n.json, the playground asks its own catalogue. Without it a ?lang= pointing
// at a language the page cannot render would be accepted and then render nothing.

/** ?lang=… — accepts a language id (`?lang=mandarin`) or a locale code (`?lang=zh-cn`). */
export function resolveUrlLang(isKnown = () => false) {
  const raw = new URLSearchParams(window.location.search).get('lang');
  if (!raw) return null;
  // Strip surrounding quotes that some tools add: ?lang="cn"
  const code = raw.replace(/^["']|["']$/g, '').toLowerCase().trim();
  if (!code) return null;
  if (isKnown(code)) return code;
  return BROWSER_LANG_MAP[code] || BROWSER_LANG_MAP[code.split('-')[0]] || null;
}

/** URL wins over the stored choice, which wins over the browser's preference. */
export function resolveInitialLang(isKnown = () => false) {
  const fromUrl = resolveUrlLang(isKnown);
  if (fromUrl) return fromUrl;
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved && isKnown(saved)) return saved;
  return detectBrowserLang();
}
