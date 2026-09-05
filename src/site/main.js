// SPDX-License-Identifier: AGPL-3.0-only
import { LANG_STORAGE_KEY, bcp47Of, resolveInitialLang } from '../i18n/detect.js';
// The region tabs and the language chips are shared with index3.html — one selector, one
// data load, one place where a language stops being offered. See src/site/langbar.js.
import { loadLanguageData, createLangBar, fadeUpdate } from './langbar.js';
import { highlightZymbol, esc } from './highlight-zy.js';

(async function() {
  // ─── Load data ───
  const data = await loadLanguageData();
  const { langList, langById, i18n, regions } = data;

  // ─── State ───
  let currentLang = 'english';

  // ─── Browser language detection ───
  // The tables and the URL/storage/browser precedence live in ../i18n/detect.js, shared
  // with the playground so both pages resolve the reader's language the same way.
  // `isKnownLang` is this page's answer to "do I have data for that id?".
  const isKnownLang = id => Boolean(i18n[id]);

  const langBar = createLangBar(data, {
    tabsEl:   document.getElementById('region-tabs'),
    chipsEl:  document.getElementById('lang-chips'),
    onSelect: id => selectLang(id),
  });

  // ─── Operators grid ───
  // 15 tiles (5×3 / 3×5) + 1 hidden tile (4×4 at <500px)
  const OP_DEFS = [
    // Row 1 — Data & I/O
    { sym: '=',     key: 'var',   fixed: 'x = 5' },
    { sym: ':=',    key: 'const', fixed: 'PI := 3.14' },
    { sym: '>>',    key: 'out',   fixed: '>> value ¶' },
    { sym: '<<',    key: 'input', fixed: '<< "prompt" x' },
    { sym: '#1/#0', key: 'bool',  fixed: 'true / false' },
    // Row 2 — Control flow
    { sym: '?',     key: 'if',    fixed: 'if condition { }' },
    { sym: '_?',    key: 'elif',  fixed: 'else-if branch' },
    { sym: '_',     key: 'else',  fixed: 'fallthrough' },
    { sym: '??',    key: 'match', fixed: 'match expr { }' },
    { sym: '@',     key: 'loop',  fixed: '@ item:list { }' },
    // Row 3 — Functions & Collections
    { sym: '->',    key: 'fn',    fixed: 'x -> x * 2' },
    { sym: '<~',    key: 'ret',   fixed: 'return / output' },
    { sym: '$#',    key: 'len',   fixed: 'arr$#' },
    { sym: '$+',    key: 'app',   fixed: 'arr$+ val' },
    { sym: '$-',    key: 'rem',   fixed: 'arr$- val' },
    // Hidden — shows only in 4-col (mobile <500px)
    { sym: '!?',    key: 'try',   fixed: '!?{ } :!{ }', hidden: true },
  ];

  function buildOpsGrid(opsTranslations, opExamples) {
    const grid = document.getElementById('ops-grid');
    grid.innerHTML = '';
    for (const op of OP_DEFS) {
      const card = document.createElement('div');
      card.className = 'op-card' + (op.hidden ? ' hidden-tile' : '');
      card.innerHTML = `
        <div class="op-sym">${esc(op.sym)}</div>
        <div class="op-concept">${esc(opsTranslations[op.key] || op.key)}</div>
        <div class="op-desc">${esc((opExamples && opExamples[op.key]) || op.fixed)}</div>
      `;
      grid.appendChild(card);
    }
  }

  // ─── Select language ───
  function selectLang(langId, persist = true) {
    currentLang = langId;
    if (persist) localStorage.setItem(LANG_STORAGE_KEY, langId);
    // Keep URL in sync so the inline <head> script sets the right lang on reload
    const bcp47 = bcp47Of(langId);
    document.documentElement.lang = bcp47;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', bcp47);
    history.replaceState(null, '', url.toString());
    const piqadLink = document.getElementById('piqad-ref-link');
    if (piqadLink) piqadLink.hidden = (langId !== 'klingon_piqad');
    langBar.collapse();
    langBar.setActive(langId);
    loadManual(langId);

    const langMeta  = langById[langId];
    const i18nEntry = i18n[langId];
    if (!langMeta || !i18nEntry) return;

    fadeUpdate(() => {
      // April banner
      const aprilWelcomeEl = document.getElementById('april-welcome');
      if (aprilWelcomeEl) aprilWelcomeEl.textContent = i18nEntry.april_welcome || "Welcome Zymbol-Lang";
      const aprilSubEl = document.getElementById('april-sub');
      if (aprilSubEl) aprilSubEl.textContent = i18nEntry.april_sub || "We renamed all operators to emojis. JK. Maybe. 😈";

      // Hero
      document.getElementById('hero-why-tag').textContent  = i18nEntry.why_tag || 'why zymbol';
      document.getElementById('hero-t1').textContent       = i18nEntry.t1;
      document.getElementById('hero-t2').textContent       = i18nEntry.t2;
      document.getElementById('hero-desc').textContent     = i18nEntry.desc;

      // Showcase
      const constructs = langMeta.constructs || {};
      const tokens     = langMeta.tokens || {};

      const primaryRegion = Array.isArray(i18nEntry.regions) ? i18nEntry.regions[0] : i18nEntry.region;
      document.getElementById('showcase-region-tag').textContent = regions[primaryRegion] || primaryRegion;
      document.getElementById('showcase-lang-name').textContent  = langMeta.name;
      document.getElementById('showcase-native').textContent     = langMeta.native;
      document.getElementById('showcase-desc').textContent       = i18nEntry.desc;
      document.getElementById('showcase-filename').textContent   = `fizzbuzz_${langId}.zy`;

      document.getElementById('meta-dir').textContent     = (langMeta.dir === 'rtl' || i18nEntry.rtl) ? 'RTL' : 'LTR';
      document.getElementById('meta-fizz').textContent    = tokens.fizz     || '—';
      document.getElementById('meta-buzz').textContent    = tokens.buzz     || '—';
      document.getElementById('meta-greeting').textContent = tokens.greeting || '—';

      // Showcase code
      const fullCode = constructs.full || constructs.function || '';
      document.getElementById('showcase-code').innerHTML = highlightZymbol(fullCode);

      // Operators
      buildOpsGrid(i18nEntry.ops || {}, i18nEntry.op_examples || {});

      // Operators section
      document.getElementById('ops-tag').textContent   = i18nEntry.ops_tag   || 'operator reference';
      document.getElementById('ops-title').textContent = i18nEntry.ops_title || 'Symbolic. Universal. Immutable.';
      document.getElementById('ops-desc').textContent  = i18nEntry.ops_desc  || 'These operators never change — regardless of which human language you code in. Concept names below update to your selected language.';

      // Features section
      document.getElementById('features-tag').textContent   = i18nEntry.why_tag      || 'design principles';
      document.getElementById('features-title').textContent = i18nEntry.feat_title   || 'Built for every language.';
      document.getElementById('features-desc').textContent  = i18nEntry.feat_desc    || "Zymbol's core idea: the syntax belongs to no culture.";
      document.getElementById('f1-title').textContent = i18nEntry.f1_title;
      document.getElementById('f1-desc').textContent  = i18nEntry.f1_desc;
      document.getElementById('f2-title').textContent = i18nEntry.f2_title;
      document.getElementById('f2-desc').textContent  = i18nEntry.f2_desc;
      document.getElementById('f3-title').textContent = i18nEntry.f3_title;
      document.getElementById('f3-desc').textContent  = i18nEntry.f3_desc;

      // Hero buttons + stats
      document.getElementById('btn-examples').textContent  = i18nEntry.btn_examples  || 'See Examples';
      document.getElementById('btn-try-online').textContent  = i18nEntry.nav_try_online  || 'Try Online';
      document.getElementById('btn-ops-ref').textContent   = i18nEntry.btn_ops_ref   || 'Operator Ref';
      document.getElementById('stat-keywords').textContent  = i18nEntry.stat_keywords  || 'Words';
      document.getElementById('stat-unicode').textContent   = i18nEntry.stat_unicode   || 'Unicode';

      // Nav + footer links
      document.getElementById('nav-showcase').textContent    = i18nEntry.nav_showcase    || 'Showcase';
      document.getElementById('nav-operators').textContent   = i18nEntry.nav_operators   || 'Operators';
      document.getElementById('nav-features').textContent    = i18nEntry.nav_features    || 'Features';
      document.getElementById('nav-try-online').textContent  = i18nEntry.nav_try_online  || 'Try Online';
      document.getElementById('nav-manual').textContent      = i18nEntry.nav_manual      || 'Documentation';
      document.getElementById('manual-title').textContent    = i18nEntry.manual_title    || i18nEntry.nav_manual || 'Documentation';
      document.getElementById('manual-sub').textContent      = i18nEntry.manual_sub      || 'Compact Zymbol-Lang manual';
      document.getElementById('footer-home').textContent     = i18nEntry.nav_home        || 'Home';
      document.getElementById('footer-showcase').textContent = i18nEntry.nav_showcase    || 'Showcase';
      document.getElementById('footer-operators').textContent= i18nEntry.nav_operators   || 'Operators';
      document.getElementById('footer-features').textContent = i18nEntry.nav_features    || 'Features';
      document.getElementById('footer-manual').textContent   = i18nEntry.nav_manual      || 'Documentation';
      document.getElementById('footer-tagline').textContent  = i18nEntry.t1 + ' ' + i18nEntry.t2;

      // Alpha notice
      const alphaMsg  = document.getElementById('alpha-msg');
      const alphaLink = document.getElementById('alpha-link');
      if (alphaMsg)  alphaMsg.textContent  = i18nEntry.alpha_msg  || 'Zymbol is in active development — this release is a concept validation of the language design. APIs, syntax, and features may change.';
      if (alphaLink) alphaLink.textContent = i18nEntry.alpha_link || 'Follow progress on GitHub →';

      // Hero snippet strings + identifiers
      document.getElementById('hero-str1').textContent    = i18nEntry.hero_str1    || 'write in any script';
      document.getElementById('hero-str2').textContent    = i18nEntry.hero_str2    || 'same operators';
      document.getElementById('hv-language').textContent  = i18nEntry.hv_language  || 'language';
      document.getElementById('hv-yours').textContent     = i18nEntry.hv_yours     || 'yours';
      document.getElementById('hv-human').textContent     = i18nEntry.hv_human     || 'human';
      document.getElementById('hv-world').textContent     = i18nEntry.hv_world     || 'world';

      // Showcase mini-snippet tokens
      document.getElementById('sc-cond').textContent   = i18nEntry.sc_cond    || 'condition';
      document.getElementById('sc-cond2').textContent  = i18nEntry.sc_cond    || 'condition';
      document.getElementById('sc-loopvar').textContent= i18nEntry.sc_loopvar || 'i';
      document.getElementById('sc-val').textContent    = i18nEntry.sc_val     || 'value';
      document.getElementById('sc-expr').textContent   = i18nEntry.sc_expr    || 'expression';

      // RTL on showcase area
      const rtl = langMeta.dir === 'rtl' || i18nEntry.rtl;
      document.getElementById('showcase-lang-name').dir = rtl ? 'rtl' : 'ltr';
      document.getElementById('showcase-native').dir    = rtl ? 'rtl' : 'ltr';
      document.getElementById('showcase-desc').dir      = rtl ? 'rtl' : 'ltr';
      document.getElementById('hero-t1').dir            = rtl ? 'rtl' : 'ltr';
      document.getElementById('hero-t2').dir            = rtl ? 'rtl' : 'ltr';
      document.getElementById('hero-desc').dir          = rtl ? 'rtl' : 'ltr';
    });
  }

  // ─── Theme toggle ───
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');

  function applyTheme(light) {
    document.documentElement.classList.toggle('light', light);
    themeIcon.textContent = light ? '☀️' : '🌙';
    localStorage.setItem('zy-theme', light ? 'light' : 'dark');
  }

  themeToggle.addEventListener('click', () => {
    applyTheme(!document.documentElement.classList.contains('light'));
  });

  // Restore saved preference, then check OS preference
  const saved = localStorage.getItem('zy-theme');
  if (saved) {
    applyTheme(saved === 'light');
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme(true);
  }

  // ─── Manual: language → file mapping ───
  const MANUAL_MAP = {
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

  function getManualFile(langId) {
    if (MANUAL_MAP[langId]) return 'data/manuals/manual_' + MANUAL_MAP[langId] + '.md';
    // Fallback: try Spanish for Spanish-family, else English
    return 'data/manuals/manual_en.md';
  }

  function loadManual(langId) {
    if (typeof marked === 'undefined') return;
    const el = document.getElementById('manual-content');
    const url = getManualFile(langId || currentLang || 'spanish');
    el.innerHTML = '<p style="color:var(--dim);text-align:center">Cargando…</p>';
    fetch(url)
      .then(r => {
        if (!r.ok) {
          // Fallback to Spanish then English
          if (!url.endsWith('manual_es.md')) return fetch('data/manuals/manual_es.md').then(r2 => r2.ok ? r2 : fetch('data/manuals/manual_en.md')).then(r3 => { if (!r3.ok) throw new Error(r3.status); return r3; });
          return fetch('data/manuals/manual_en.md').then(r2 => { if (!r2.ok) throw new Error(r2.status); return r2; });
        }
        return r;
      })
      .then(r => r.text())
      .then(md => {
        el.innerHTML = marked.parse(md);
        el.querySelectorAll('pre code.language-zymbol').forEach(block => {
          block.innerHTML = highlightZymbol(block.textContent);
        });
      })
      .catch(err => {
        el.innerHTML = `<p style="color:var(--dim);text-align:center">
          Error cargando el manual (${err.message}).<br>
          <small>Abre el sitio desde un servidor web, no directamente como archivo.</small>
        </p>`;
      });
  }

  // Initial load
  loadManual('spanish');

  // ─── Hamburger menu ───
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav    = document.getElementById('main-nav');

  function closeMenu() {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('span').textContent = '☰';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.querySelector('span').textContent = isOpen ? '✕' : '☰';
  });

  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
  });

  // ─── Init ───
  selectLang(resolveInitialLang(isKnownLang), false);

})();
