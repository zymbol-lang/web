// SPDX-License-Identifier: AGPL-3.0-only
/**
 * langbar.js — the site's language selector: region tabs, then native-name chips.
 *
 * This is the control the landing page has always had, lifted out of src/site/main.js so
 * that index3.html can carry the same one rather than a second, different picker. The
 * reason is the reason detect.js gives for existing: a table or a widget copied into two
 * pages drifts, and the drift is invisible until a reader lands on the page that fell
 * behind. There is one selector, one data load, one set of chips.
 *
 * Data, unchanged:
 *   data/i18n/languages.json   the set the chips offer — FizzBuzz tokens, showcase code
 *   data/i18n/i18n.json        the strings, one entry per language, plus region labels
 *
 * A page says which strings it wants out of an entry; this module only decides which
 * entry. Nothing here knows what is on either page.
 */

export const REGION_ORDER = ['americas', 'europe', 'mideast', 'asia', 'africa', 'universal'];

/** Both files at once — the pages need them together and neither is useful alone. */
export async function loadLanguageData() {
  const [langData, i18nData] = await Promise.all([
    fetch('data/i18n/languages.json').then(r => r.json()),
    fetch('data/i18n/i18n.json').then(r => r.json()),
  ]);
  const langList = langData.languages;
  const langById = {};
  for (const l of langList) langById[l.id] = l;
  return {
    langList,
    langById,
    i18n:     i18nData.languages,
    regions:  i18nData.regions,
    srOrder:  i18nData.subregion_order  || {},
    srLabels: i18nData.subregion_labels || {},
  };
}

/**
 * Builds the bar into the two elements a page provides and calls back on every choice.
 *
 * @param {object} data       what loadLanguageData() returned
 * @param {object} opts
 * @param {Element} opts.tabsEl   #region-tabs
 * @param {Element} opts.chipsEl  #lang-chips
 * @param {(id: string) => void} opts.onSelect
 * @returns {{setActive(id: string): void, collapse(): void}}
 */
export function createLangBar(data, { tabsEl, chipsEl, onSelect }) {
  const { langList, i18n, regions, srOrder, srLabels } = data;
  let currentRegion = null;
  let currentLang = null;

  function makeChip(lang) {
    const chip = document.createElement('div');
    chip.className = 'lang-chip' + (lang.id === currentLang ? ' active' : '');
    chip.dataset.lang = lang.id;
    chip.textContent = lang.native || lang.name;
    chip.title = lang.name;
    chip.addEventListener('click', () => { collapse(); onSelect(lang.id); });
    return chip;
  }

  function buildChips(regionId) {
    chipsEl.innerHTML = '';

    const langsInRegion = langList.filter(l => {
      const d = i18n[l.id];
      return d && (Array.isArray(d.regions) ? d.regions.includes(regionId) : d.region === regionId);
    });

    const order = srOrder[regionId];
    if (!order || order.length === 0) {
      // No subgroups — flat sorted list
      langsInRegion.sort((a, b) => a.name.localeCompare(b.name));
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

    for (const sr of order) {
      const group = grouped[sr];
      if (!group || group.length === 0) continue;
      group.sort((a, b) => a.name.localeCompare(b.name));
      const lbl = document.createElement('div');
      lbl.className = 'subregion-label';
      lbl.textContent = srLabels[sr] || sr;
      chipsEl.appendChild(lbl);
      for (const lang of group) chipsEl.appendChild(makeChip(lang));
    }

    if (grouped['_other']) {
      grouped['_other'].sort((a, b) => a.name.localeCompare(b.name));
      for (const lang of grouped['_other']) chipsEl.appendChild(makeChip(lang));
    }
  }

  function collapse() {
    chipsEl.classList.remove('open');
    tabsEl.querySelectorAll('.region-tab').forEach(t => t.classList.remove('active'));
    currentRegion = null;
  }

  function selectRegion(rid) {
    const alreadyOpen = currentRegion === rid && chipsEl.classList.contains('open');
    if (alreadyOpen) { collapse(); return; }
    currentRegion = rid;
    buildChips(rid);
    chipsEl.classList.add('open');
    tabsEl.querySelectorAll('.region-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.region === rid);
    });
  }

  for (const rid of REGION_ORDER) {
    const tab = document.createElement('div');
    tab.className = 'region-tab';
    tab.textContent = regions[rid];
    tab.dataset.region = rid;
    tab.addEventListener('click', () => selectRegion(rid));
    tabsEl.appendChild(tab);
  }

  return {
    setActive(langId) {
      currentLang = langId;
      chipsEl.querySelectorAll('.lang-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.lang === langId);
      });
    },
    collapse,
  };
}

/**
 * Swaps every `.fade-target` out and back in around `fn`, so a language change reads as one
 * movement rather than forty elements repainting at their own pace.
 */
export function fadeUpdate(fn) {
  const targets = [...document.querySelectorAll('.fade-target')];
  targets.forEach(el => {
    el.style.transition = 'opacity 0.18s ease';
    el.style.opacity = '0';
  });
  setTimeout(() => {
    try { fn(); } catch (e) { console.error('[fadeUpdate]', e); }
    targets.forEach(el => { el.style.opacity = '1'; });
    setTimeout(() => {
      targets.forEach(el => { el.style.transition = ''; el.style.opacity = ''; });
    }, 220);
  }, 190);
}
