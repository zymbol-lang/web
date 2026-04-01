(async function() {
  // ─── Load data ───
  const [langData, i18nData] = await Promise.all([
    fetch('data/languages.json').then(r => r.json()),
    fetch('data/i18n.json').then(r => r.json()),
  ]);

  const langList = langData.languages; // array
  const i18n     = i18nData.languages; // object keyed by id
  const regions  = i18nData.regions;   // object {id: label}

  // Build lookup: id -> langList entry
  const langById = {};
  for (const l of langList) langById[l.id] = l;

  // ─── State ───
  let currentLang   = 'english';
  let currentRegion = null;

  // ─── Browser language detection ───
  const BROWSER_LANG_MAP = {
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
    'pa':'punjabi', 'zh':'mandarin', 'zh-cn':'mandarin', 'zh-tw':'mandarin',
    'ja':'japanese', 'ko':'korean', 'id':'indonesian', 'vi':'vietnamese',
    'th':'thai', 'tl':'tagalog', 'sw':'swahili', 'ha':'hausa',
    'yo':'yoruba', 'am':'amharic', 'tr':'turkish',
  };
  const LANG_STORAGE_KEY = 'zy-lang';

  function detectBrowserLang() {
    // Walk the full preferred-languages list for the best match
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

  function resolveInitialLang() {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    // Only trust saved value if it exists in i18n data
    if (saved && i18n[saved]) return saved;
    return detectBrowserLang();
  }

  // ─── Syntax highlight a zymbol code string ───
  function highlight(code) {
    // escape HTML first
    code = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // comments
    code = code.replace(/(\/\/[^\n]*)/g, '<span class="t-cmt">$1</span>');

    // strings
    code = code.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="t-str">$1</span>');

    // keywords / operators: &lt;~ <~ >> _? _ ? @ ¶
    const kwPats = [
      [/\b(&lt;~)\b/g,   't-kw'],
      [/(&lt;~)/g,        't-kw'],
      [/(\?(?!\?))/g,     't-kw'],
      [/(_\?)/g,          't-kw'],
      [/(\?\?)/g,         't-kw'],
      [/(?<![&\w])_(?!\?)/g, 't-kw'],
      [/(¶)/g,            't-kw'],
      [/(@)/g,            't-kw'],
      [/(&gt;&gt;)/g,     't-op'],
    ];

    // numbers
    code = code.replace(/\b(\d+)\b/g, '<span class="t-num">$1</span>');

    // range ".." and "::" and ":" and ".." and "%" and "==" and "!=" and operators
    code = code.replace(/(\.\.|::|==|!=|&gt;=|&lt;=|[+\-*%])/g, '<span class="t-op">$1</span>');

    // apply kw patterns (on non-spanned text only — rough but functional)
    const KW_SYMS = ['&lt;~', '?', '_?', '??', '_', '¶', '@'];
    for (const sym of KW_SYMS) {
      const esc = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      code = code.replace(new RegExp(`(?<!<[^>]*)${esc}`, 'g'), `<span class="t-kw">${sym}</span>`);
    }
    code = code.replace(/(&gt;&gt;)/g, '<span class="t-op">$1</span>');

    return code;
  }

  // ─── Better highlight: token-aware ───
  function highlightZymbol(raw) {
    const lines = raw.split('\n');
    return lines.map(line => highlightLine(line)).join('\n');
  }

  function highlightLine(line) {
    // comment
    if (/^\s*\/\//.test(line)) {
      return `<span class="t-cmt">${esc(line)}</span>`;
    }

    let out = '';
    let i = 0;
    const s = line;
    const len = s.length;

    while (i < len) {
      // comment
      if (s[i] === '/' && s[i+1] === '/') {
        out += `<span class="t-cmt">${esc(s.slice(i))}</span>`;
        break;
      }

      // string
      if (s[i] === '"') {
        let j = i + 1;
        while (j < len && s[j] !== '"') { if (s[j] === '\\') j++; j++; }
        out += `<span class="t-str">${esc(s.slice(i, j+1))}</span>`;
        i = j + 1;
        continue;
      }

      // number
      if (/\d/.test(s[i]) && (i === 0 || !/\w/.test(s[i-1]))) {
        let j = i;
        while (j < len && /[\d.]/.test(s[j])) j++;
        out += `<span class="t-num">${esc(s.slice(i, j))}</span>`;
        i = j;
        continue;
      }

      // multi-char operators
      const twoChar = s.slice(i, i+2);
      const oneChar = s[i];

      if (twoChar === '<~') { out += `<span class="t-kw">&lt;~</span>`; i += 2; continue; }
      if (twoChar === '>>') { out += `<span class="t-op">&gt;&gt;</span>`; i += 2; continue; }
      if (twoChar === '_?') { out += `<span class="t-kw">_?</span>`; i += 2; continue; }
      if (twoChar === '??') { out += `<span class="t-kw">??</span>`; i += 2; continue; }
      if (twoChar === '..') { out += `<span class="t-op">..</span>`; i += 2; continue; }
      if (twoChar === '::') { out += `<span class="t-op">::</span>`; i += 2; continue; }
      if (twoChar === '==') { out += `<span class="t-op">==</span>`; i += 2; continue; }
      if (twoChar === '!=') { out += `<span class="t-op">!=</span>`; i += 2; continue; }
      if (twoChar === '<=') { out += `<span class="t-op">&lt;=</span>`; i += 2; continue; }
      if (twoChar === '>=') { out += `<span class="t-op">&gt;=</span>`; i += 2; continue; }
      if (twoChar === '#1') { out += `<span class="t-num">#1</span>`; i += 2; continue; }
      if (twoChar === '#0') { out += `<span class="t-num">#0</span>`; i += 2; continue; }

      if (oneChar === '?') { out += `<span class="t-kw">?</span>`; i++; continue; }
      if (oneChar === '@') { out += `<span class="t-kw">@</span>`; i++; continue; }
      if (oneChar === '¶') { out += `<span class="t-kw">¶</span>`; i++; continue; }
      if (oneChar === '_' && (i+1 >= len || !/\w/.test(s[i+1]))) {
        out += `<span class="t-kw">_</span>`; i++; continue;
      }
      if (oneChar === '%') { out += `<span class="t-op">%</span>`; i++; continue; }
      if (oneChar === '+') { out += `<span class="t-op">+</span>`; i++; continue; }
      if (oneChar === '-' && (i+1 < len && /\d/.test(s[i+1]) && (i===0 || /[\s(,]/.test(s[i-1])))) {
        // negative number
        let j = i + 1;
        while (j < len && /[\d.]/.test(s[j])) j++;
        out += `<span class="t-num">${esc(s.slice(i, j))}</span>`;
        i = j; continue;
      }
      if (oneChar === ':' && s[i+1] !== ':') { out += `<span class="t-op">:</span>`; i++; continue; }
      if (oneChar === '<') { out += '&lt;'; i++; continue; }
      if (oneChar === '>') { out += '&gt;'; i++; continue; }
      if (oneChar === '&') { out += '&amp;'; i++; continue; }

      // identifier
      if (/[\p{L}\p{N}_$]/u.test(oneChar)) {
        let j = i;
        while (j < len && /[\p{L}\p{N}_$]/u.test(s[j])) j++;
        const word = s.slice(i, j);
        // peek if followed by (
        const isFn = j < len && s[j] === '(';
        if (isFn) {
          out += `<span class="t-fn">${esc(word)}</span>`;
        } else {
          out += `<span class="t-id">${esc(word)}</span>`;
        }
        i = j;
        continue;
      }

      out += esc(oneChar);
      i++;
    }

    return out;
  }

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ─── Build region tabs ───
  const regionTabsEl = document.getElementById('region-tabs');
  const regionOrder = ['americas','europe','mideast','asia','africa','universal'];

  for (const rid of regionOrder) {
    const tab = document.createElement('div');
    tab.className = 'region-tab';
    tab.textContent = regions[rid];
    tab.dataset.region = rid;
    tab.addEventListener('click', () => selectRegion(rid));
    regionTabsEl.appendChild(tab);
  }

  // ─── Build language chips per region (with subgroup headers) ───
  const srOrder  = i18nData.subregion_order  || {};
  const srLabels = i18nData.subregion_labels || {};

  function makeChip(lang) {
    const chip = document.createElement('div');
    chip.className = 'lang-chip' + (lang.id === currentLang ? ' active' : '');
    chip.dataset.lang = lang.id;
    chip.textContent = lang.native || lang.name;
    chip.title = lang.name;
    chip.addEventListener('click', () => selectLang(lang.id));
    return chip;
  }

  function buildChips(regionId) {
    const chipsEl = document.getElementById('lang-chips');
    chipsEl.innerHTML = '';

    const langsInRegion = langList.filter(l => {
      const d = i18n[l.id];
      return d && (Array.isArray(d.regions) ? d.regions.includes(regionId) : d.region === regionId);
    });

    const order = srOrder[regionId];
    if (!order || order.length === 0) {
      // No subgroups — flat sorted list
      langsInRegion.sort((a,b) => a.name.localeCompare(b.name));
      for (const lang of langsInRegion) chipsEl.appendChild(makeChip(lang));
      return;
    }

    // Group by subregion (per-region dict or flat field)
    const grouped = {};
    for (const lang of langsInRegion) {
      const d = i18n[lang.id];
      const sr = (d.subregions && d.subregions[regionId]) || d.subregion || '_other';
      (grouped[sr] = grouped[sr] || []).push(lang);
    }

    // Render in defined order
    for (const sr of order) {
      const group = grouped[sr];
      if (!group || group.length === 0) continue;
      group.sort((a,b) => a.name.localeCompare(b.name));
      const lbl = document.createElement('div');
      lbl.className = 'subregion-label';
      lbl.textContent = srLabels[sr] || sr;
      chipsEl.appendChild(lbl);
      for (const lang of group) chipsEl.appendChild(makeChip(lang));
    }

    // Any unclassified languages
    if (grouped['_other']) {
      grouped['_other'].sort((a,b) => a.name.localeCompare(b.name));
      for (const lang of grouped['_other']) chipsEl.appendChild(makeChip(lang));
    }
  }

  function collapseChips() {
    const chipsEl = document.getElementById('lang-chips');
    chipsEl.classList.remove('open');
    document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('active'));
    currentRegion = null;
  }

  function selectRegion(rid) {
    const chipsEl = document.getElementById('lang-chips');
    const alreadyOpen = currentRegion === rid && chipsEl.classList.contains('open');
    if (alreadyOpen) {
      collapseChips();
      return;
    }
    currentRegion = rid;
    buildChips(rid);
    chipsEl.classList.add('open');
    document.querySelectorAll('.region-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.region === rid);
    });
  }

  // ─── Fade transition helper ───
  function fadeUpdate(fn) {
    const targets = [...document.querySelectorAll('.fade-target')];
    // Fade out
    targets.forEach(el => {
      el.style.transition = 'opacity 0.18s ease';
      el.style.opacity = '0';
    });
    setTimeout(() => {
      try { fn(); } catch(e) { console.error('[fadeUpdate]', e); }
      // Fade in
      targets.forEach(el => { el.style.opacity = '1'; });
      setTimeout(() => {
        targets.forEach(el => { el.style.transition = ''; el.style.opacity = ''; });
      }, 220);
    }, 190);
  }

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
    collapseChips();
    loadManual(langId);

    // update chip active state
    document.querySelectorAll('.lang-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.lang === langId);
    });

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
      document.getElementById('stat-keywords').textContent  = i18nEntry.stat_keywords  || 'Keywords';
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
      document.getElementById('footer-tagline').textContent  = i18nEntry.t1 + ' ' + i18nEntry.t2;

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
    english:    'en',
    navajo:     'nv',
    cherokee:   'chr',
    cree:       'cr',
    cree_syl:   'cr_syl',
    // Americas — Mesoamerica / South
    portuguese: 'pt',
    guarani:    'gn',
    quechua:    'qu',
    aymara:     'ay',
    nahuatl:    'nah',
    maya:       'myn',
    mapuche:    'arn',
    wayuu:      'way',
    embera:     'emb',
    yanomami:   'yno',
    // Romance — Europe
    spanish:    'es',
    french:     'fr',
    italian:    'it',
    romanian:   'ro',
    catalan:    'ca',
    galician:   'gl',
    // Germanic
    german:     'de',
    dutch:      'nl',
    swedish:    'sv',
    norwegian:  'no',
    danish:     'da',
    icelandic:  'is',
    afrikaans:  'af',
    // Finno-Ugric
    finnish:    'fi',
    hungarian:  'hu',
    estonian:   'et',
    // Baltic
    latvian:    'lv',
    lithuanian: 'lt',
    // Slavic (Latin)
    polish:     'pl',
    czech:      'cs',
    slovak:     'sk',
    croatian:   'hr',
    slovenian:  'sl',
    // Others
    basque:     'eu',
    welsh:      'cy',
    albanian:   'sq',
    // East Asia — CJK
    mandarin:     'zh',
    japanese:     'ja',
    korean:       'ko',
    // South Asia — Indic scripts
    hindi:        'hi',
    marathi:      'mr',
    nepali:       'ne',
    bengali:      'bn',
    punjabi:      'pa',
    gujarati:     'gu',
    tamil:        'ta',
    telugu:       'te',
    kannada:      'kn',
    // Middle East — RTL scripts
    arabic:       'ar',
    hebrew:       'he',
    persian:      'fa',
    urdu:         'ur',
    // Unique scripts — European
    greek:        'el',
    armenian:     'hy',
    georgian:     'ka',
    // Cyrillic — European
    russian:      'ru',
    ukrainian:    'uk',
    bulgarian:    'bg',
    serbian:      'sr',
    macedonian:   'mk',
    belarusian:   'be',
    // Turkic / Caucasian (Latin script)
    turkish:      'tr',
    azerbaijani:  'az',
    kurdish:      'ku',
    // Southeast Asia
    indonesian:   'id',
    malay:        'ms',
    tagalog:      'tl',
    vietnamese:   'vi',
    thai:         'th',
    burmese:      'my',
    // Africa
    swahili:      'sw',
    hausa:        'ha',
    yoruba:       'yo',
    igbo:         'ig',
    wolof:        'wo',
    xhosa:        'xh',
    zulu:         'zu',
    amharic:      'am',
    oromo:        'om',
    bambara:      'bm',
    fula:         'ff',
    lingala:      'ln',
    somali:       'so',
    tigrinya:     'ti',
    shona:        'sn',
    // Constructed & planned languages
    esperanto:    'eo',
    lojban:       'jbo',
    toki_pona:    'tp',
    ido:          'io',
    interlingua:  'ia',
    // Sci-Fi fictional languages
    klingon:      'tlh',
    mandoa:       'mando',
    // Fantasy fictional languages
    quenya:       'qya',
    sindarin:     'sjn',
    dothraki:     'doth',
    high_valyrian:'hval',
    // Cinema fictional languages
    navi:         'nav',
    // Klingon pIqaD script
    klingon_piqad:'tlh_iq',
    // Cross-references (shared manuals)
    castellano:   'es',      // Spain Spanish → same as Spanish
    portugues_eu: 'pt_eu',   // European Portuguese → own manual
    // Default fallback: 'en'
  };

  function getManualFile(langId) {
    if (MANUAL_MAP[langId]) return 'data/manual_' + MANUAL_MAP[langId] + '.md';
    // Fallback: try Spanish for Spanish-family, else English
    return 'data/manual_en.md';
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
          if (!url.endsWith('manual_es.md')) return fetch('data/manual_es.md').then(r2 => r2.ok ? r2 : fetch('data/manual_en.md')).then(r3 => { if (!r3.ok) throw new Error(r3.status); return r3; });
          return fetch('data/manual_en.md').then(r2 => { if (!r2.ok) throw new Error(r2.status); return r2; });
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
  selectLang(resolveInitialLang(), false);

})();
