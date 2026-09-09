// SPDX-License-Identifier: AGPL-3.0-only
/**
 * manual.js — the compact manual, fetched, rendered and syntax-highlighted into a page.
 *
 * Lifted out of src/site/main.js when the front page started showing the manual too. It is
 * the same extraction as langbar.js and highlight-zy.js, and for the same reason: a second
 * copy of the language→file table on the second page is how a language quietly stops having
 * a manual on half a site.
 *
 * TWO GENERATIONS LIVE SIDE BY SIDE, on purpose:
 *
 *   data/manuals/manual_<code>.md        110 languages, last revised for v0.0.5. Served by
 *                                        overview.html, which is archived at v0.0.8 and
 *                                        says so — the manual it shows is of its own time.
 *   data/manuals/v009/manual_<code>.md   the v0.0.9 rewrite: 4 languages so far, each one
 *                                        through the four gates in that directory
 *                                        (structure, `zymbol check`, claimed outputs,
 *                                        untranslated residue). Served by the front page.
 *
 * The two directories differ in what they do when the reader's language is missing, and
 * that difference is the point. The old one falls back — Spanish, then English — because
 * 110 languages are written and a gap is an accident. The new one shows NOTHING: with four
 * written, a fallback would hand a Japanese reader an English manual under a heading that
 * says Documentation in Japanese, which reads as "your language is done" and is a lie.
 * Absent is honest; wrong is not.
 */

import { highlightZymbol } from './highlight-zy.js';

export const MANUAL_MAP = {
  // Americas — North
  english:          'en',
  navajo:           'nv',
  cherokee:         'chr',
  cree_syl:         'cr_syl',
  // Americas — Mesoamerica / South
  portuguese:       'pt',
  guarani:          'gn',
  quechua:          'qu',
  aymara:           'ay',
  nahuatl:          'nah',
  maya:             'myn',
  mapuche:          'arn',
  wayuu:            'way',
  embera:           'emb',
  yanomami:         'yno',
  kiche:            'quc',
  // Romance — Europe
  spanish:          'es',
  french:           'fr',
  italian:          'it',
  romanian:         'ro',
  catalan:          'ca',
  galician:         'gl',
  // Germanic
  german:           'de',
  dutch:            'nl',
  swedish:          'sv',
  norwegian:        'no',
  danish:           'da',
  icelandic:        'is',
  afrikaans:        'af',
  // Finno-Ugric
  finnish:          'fi',
  estonian:         'et',
  // Baltic
  latvian:          'lv',
  lithuanian:       'lt',
  // Slavic (Latin)
  polish:           'pl',
  czech:            'cs',
  slovak:           'sk',
  croatian:         'hr',
  slovenian:        'sl',
  // Others
  basque:           'eu',
  albanian:         'sq',
  // East Asia — CJK
  mandarin:         'zh',
  japanese:         'ja',
  korean:           'ko',
  // South Asia — Indic scripts
  hindi:            'hi',
  marathi:          'mr',
  nepali:           'ne',
  bengali:          'bn',
  punjabi:          'pa',
  gujarati:         'gu',
  tamil:            'ta',
  telugu:           'te',
  kannada:          'kn',
  malayalam:        'ml',
  sinhala:          'si',
  // Southeast Asia
  indonesian:       'id',
  malay:            'ms',
  tagalog:          'tl',
  vietnamese:       'vi',
  thai:             'th',
  burmese:          'my',
  javanese:         'jv',
  sundanese:        'su',
  khmer:            'km',
  lao:              'lo',
  // Middle East — RTL scripts
  arabic:           'ar',
  hebrew:           'he',
  persian:          'fa',
  urdu:             'ur',
  pashto:           'ps',
  // Unique scripts — European
  greek:            'el',
  armenian:         'hy',
  georgian:         'ka',
  // Cyrillic — European
  russian:          'ru',
  ukrainian:        'uk',
  bulgarian:        'bg',
  serbian:          'sr',
  macedonian:       'mk',
  belarusian:       'be',
  // Turkic / Caucasian (Latin script)
  turkish:          'tr',
  azerbaijani:      'az',
  kurdish:          'ku',
  // Africa
  swahili:          'sw',
  hausa:            'ha',
  yoruba:           'yo',
  igbo:             'ig',
  wolof:            'wo',
  xhosa:            'xh',
  zulu:             'zu',
  amharic:          'am',
  oromo:            'om',
  bambara:          'bm',
  fula:             'ff',
  lingala:          'ln',
  somali:           'so',
  tigrinya:         'ti',
  shona:            'sn',
  luganda:          'lg',
  nyanja:           'ny',
  setswana:         'tn',
  haitian_creole:   'ht',
  jamaican_patois:  'jam',
  nigerian_pidgin:  'pcm',
  // Constructed & planned languages
  esperanto:        'eo',
  lojban:           'jbo',
  toki_pona:        'tp',
  ido:              'io',
  interlingua:      'ia',
  // Fictional languages
  klingon:          'tlh',
  klingon_piqad:    'tlh_iq',
  // Cross-references (shared manuals)
  castellano:       'es',      // Spain Spanish → same as Spanish
  portugues_eu:     'pt_eu',   // European Portuguese → own manual
  // Default fallback: 'en'
};

/**
 * The languages the v0.0.9 manual is actually written in, by manual code — NOT by language
 * id: `castellano` and `spanish` both map to `es` and both have one.
 *
 * It is a list and not a probe. Asking the network (fetch, catch a 404, then hide) means
 * painting a heading and taking it away again, and it makes an offline reader look like an
 * untranslated one. tests/test_manual_v009.mjs fails if this list and the directory ever
 * disagree, in either direction.
 */
export const V009_CODES = ['en', 'es', 'it', 'qu', 'zh', 'hi', 'ar', 'fr', 'bn', 'pt', 'ru', 'ur', 'sw', 'id', 'de', 'pa', 'ja'];

export const MANUAL_DIR_V005 = 'data/manuals';
export const MANUAL_DIR_V009 = 'data/manuals/v009';

/** The manual code for a language id, or null if the site has no manual for it at all. */
export const manualCode = langId => MANUAL_MAP[langId] ?? null;

/**
 * Where a language's v0.0.9 manual is, or null if it has not been written yet. Null is the
 * caller's cue to hide the section outright — see the note at the top of this file.
 */
export function manualUrlV009(langId) {
  const code = manualCode(langId);
  return code && V009_CODES.includes(code) ? `${MANUAL_DIR_V009}/manual_${code}.md` : null;
}

/** Where a language's v0.0.5 manual is. Always a URL: English is the floor. */
export function manualUrlV005(langId) {
  return `${MANUAL_DIR_V005}/manual_${manualCode(langId) ?? 'en'}.md`;
}

/**
 * Markdown → the element, with every ```zymbol block coloured by the site's own
 * highlighter. `marked` is a global from the CDN <script>; with no network it is undefined
 * and this returns false rather than throwing, so a page that cannot render the manual
 * simply does not show one.
 */
export async function renderManual(el, url) {
  if (typeof marked === 'undefined' || !el || !url) return false;
  const res = await fetch(url);
  if (!res.ok) return false;
  el.innerHTML = marked.parse(await res.text());
  for (const block of el.querySelectorAll('pre code.language-zymbol')) {
    block.innerHTML = highlightZymbol(block.textContent);
  }
  return true;
}
