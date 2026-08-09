// SPDX-License-Identifier: AGPL-3.0-only
/**
 * problems.js — what is wrong with this program, before you run it.
 *
 * The engine has always computed this: `runZymbol` builds the same diagnostics and prints
 * the errors. But it printed them into the output panel at the moment of running, mixed
 * with the program's own output and wiped by the next ▶ Run — so the one message you
 * needed while fixing the code was the one that disappeared when you tried again. Here the
 * list lives under the editor, survives runs, and appears while typing.
 *
 * ── Warnings are behind a switch, and that is a measurement, not a preference ─────────
 *
 * `zymbol check` raises "ambiguous lifetime" for the iterator of any top-level counted
 * loop, deliberately (interpreter CHANGELOG, GAP-003). That single rule fires on 122 of
 * the 216 programs in examples/. Opening the playground with two thirds of its own
 * examples flagged amber would teach a visitor that warnings are wallpaper. So errors show
 * always, warnings only when asked — and the answer is remembered.
 *
 * The checker is the browser mirror's, not the Rust one: on examples/ the two agree
 * exactly on 211 of 216 files, and tests/test_check.mjs holds that number against
 * regression. The remaining five are unused-variable false positives this checker raises
 * and the real tool does not.
 */

import { checkSource } from '../zymbol/zymbol.js';
import { t, localeDir, onLocaleChange } from '../i18n/i18n.js';

const WARN_KEY = 'zy-pg-warnings';
const DEBOUNCE_MS = 600;

export function createProblems({ panel, list, countEl, titleEl, toggleBtn, warningsBox,
                                 warningsText, highlight, getSource, gotoLine }) {
  let diagnostics = [];
  let timer = null;
  let showWarnings = localStorage.getItem(WARN_KEY) === '1';

  warningsBox.checked = showWarnings;

  /**
   * Renders a diagnostic in the reader's language.
   *
   * The engine hands back a code and its parameters (`{code: 'E_CONST', params: {name}}`),
   * never a finished sentence, which is the whole reason this can be translated at all.
   * One exception is honest and unavoidable: a parse error's text comes from the parser as
   * English prose, so `chk.E_PARSE` is a passthrough and the reader sees it verbatim.
   */
  function messageOf(d) {
    return t(`chk.${d.code}`, d.params ?? {});
  }
  function hintOf(d) {
    const key = `chk.${d.code}_help`;
    const help = t(key);
    return help === key ? null : help;
  }

  function visible() {
    return showWarnings ? diagnostics : diagnostics.filter(d => d.severity === 'error');
  }

  /** Tints the lines a diagnostic points at, on the colouring layer under the textarea. */
  function markLines() {
    for (const el of highlight.querySelectorAll('.hl-line.has-error, .hl-line.has-warning')) {
      el.classList.remove('has-error', 'has-warning');
    }
    for (const d of visible()) {
      if (!d.line) continue;
      const el = highlight.querySelector(`.hl-line[data-l="${d.line}"]`);
      if (el) el.classList.add(d.severity === 'error' ? 'has-error' : 'has-warning');
    }
  }

  function render() {
    const errors = diagnostics.filter(d => d.severity === 'error').length;
    const warnings = diagnostics.length - errors;
    const shown = visible();

    titleEl.textContent = t('ui.problems');
    warningsText.textContent = t('ui.problemsShowWarnings');
    toggleBtn.title = panel.classList.contains('collapsed')
      ? t('ui.problemsExpand') : t('ui.problemsCollapse');
    countEl.textContent = t('ui.problemsCount', { errors, warnings });
    panel.dir = localeDir();

    // Nothing at all to say: the strip stays out of the way entirely rather than sitting
    // there empty. A clean program should look like a clean program.
    if (diagnostics.length === 0) {
      panel.classList.add('hidden');
      list.innerHTML = '';
      markLines();
      return;
    }
    panel.classList.remove('hidden');

    list.innerHTML = '';
    if (shown.length === 0) {
      const p = document.createElement('div');
      p.className = 'pb-none';
      p.textContent = t('ui.problemsNone');
      list.appendChild(p);
      markLines();
      return;
    }

    for (const d of shown) {
      const item = document.createElement('button');
      item.className = `pb-item ${d.severity}`;
      item.type = 'button';

      const sev = document.createElement('span');
      sev.className = 'pb-sev';
      sev.textContent = t(`chk.${d.severity}`);

      const line = document.createElement('span');
      line.className = 'pb-line';
      line.textContent = d.line ? t('ui.line', { line: d.line }) : '';

      const msg = document.createElement('span');
      msg.className = 'pb-msg';
      msg.textContent = messageOf(d);
      const hint = hintOf(d);
      if (hint) {
        const h = document.createElement('span');
        h.className = 'pb-hint';
        h.textContent = ` — ${hint}`;
        msg.appendChild(h);
      }

      item.append(sev, line, msg);
      if (d.line) item.addEventListener('click', () => gotoLine(d.line));
      list.appendChild(item);
    }
    markLines();
  }

  /** Runs the checker over what is on screen right now. */
  function run() {
    const src = getSource();
    diagnostics = src.trim() ? checkSource(src).diagnostics : [];
    render();
  }

  /** Called on every keystroke; only the last one in a burst does any work. */
  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; run(); }, DEBOUNCE_MS);
  }

  toggleBtn.addEventListener('click', () => {
    const collapsed = panel.classList.toggle('collapsed');
    toggleBtn.setAttribute('aria-expanded', String(!collapsed));
    toggleBtn.title = collapsed ? t('ui.problemsExpand') : t('ui.problemsCollapse');
  });

  warningsBox.addEventListener('change', () => {
    showWarnings = warningsBox.checked;
    localStorage.setItem(WARN_KEY, showWarnings ? '1' : '0');
    render();
  });

  onLocaleChange(render);

  return {
    run,
    schedule,
    /** After the colouring layer is rebuilt, its line tints are gone — put them back. */
    remark: markLines,
    clear() { diagnostics = []; render(); },
  };
}
