#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Drive the playground in a real (headless) Chrome: open an example by its deep
// link, press ▶ Run, and print what the output panel shows when the run ends.
//
//   node tests/browser_run.mjs [--engine js|vm] [--base URL] PATH-UNDER-EXAMPLES...
//   node tests/browser_run.mjs --compare [--timeout MS] [--all | PATH...]
//
// --compare runs every path in both engines and reports where the output panels
// differ (the closing `— done · engine · ms —` line aside). --all takes every
// `.zy` and `.zyp` the catalog lists.
//
// Needs the worktree served (node tools/serve.mjs, port 8077 by default) and
// Chrome or Chromium. One page, one run per path, over the DevTools protocol.

import { spawn } from 'child_process';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i < 0 ? d : argv.splice(i, 2)[1]; };
const engine = opt('--engine', 'vm');
const base = opt('--base', 'http://127.0.0.1:8077/zymbol_vm/playground.html');
const timeoutMs = Number(opt('--timeout', 120000));
const compare = argv.includes('--compare') && argv.splice(argv.indexOf('--compare'), 1);
const all = argv.includes('--all') && argv.splice(argv.indexOf('--all'), 1);
let paths = argv;
if (all) {
  const cat = await (await fetch(new URL('../examples/catalog.json', base))).json();
  const found = [];
  const walk = x => {
    if (Array.isArray(x)) return x.forEach(walk);
    if (x && typeof x === 'object') {
      if (typeof x.path === 'string') found.push(x.path);
      else if (typeof x.zyp === 'string') found.push(x.zyp);
      else if (x.dir && x.entry) found.push(`${x.dir}/${x.entry}`);
      Object.values(x).forEach(v => typeof v === 'object' && walk(v));
    }
  };
  walk(cat);
  paths = [...new Set(found)];
}
const CHROME = process.env.CHROME ?? 'google-chrome';
const PORT = 9333;

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${PORT}`,
  '--user-data-dir=' + (process.env.TMPDIR ?? '/tmp') + '/zyvm-chrome', 'about:blank'], { stdio: 'ignore' });

async function cdpTarget() {
  for (let i = 0; i < 100; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = list.find(t => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('Chrome never answered on the DevTools port');
}

const ws = new WebSocket(await cdpTarget());
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const sleep = ms => new Promise(r => setTimeout(r, ms));

await send('Page.enable');
async function runOne(p, eng) {
  const url = `${base}?open=${encodeURIComponent(p)}${eng === 'js' ? '&engine=js' : ''}`;
  // A blank page first, so nothing of the previous one can be read as this one's.
  await send('Page.navigate', { url: 'about:blank' });
  await sleep(50);
  await send('Page.navigate', { url });
  // Ready when the active tab is the file asked for (a package: one of its files).
  const want = JSON.stringify(p.endsWith('.zyp') ? p.replace(/\.zyp$/, '/') : p);
  for (let i = 0; i < 200; i++) {
    if (await evaluate(`(document.querySelector('.ftab.active')?.title ?? '').includes(${want}) && (document.getElementById('editor')?.value ?? '').length > 0`)) break;
    await sleep(100);
  }
  await sleep(300);
  await evaluate(`document.getElementById('pg-notice-backdrop')?.classList.add('hidden'); document.getElementById('run-btn').click(); true`);
  const t0 = Date.now();
  let text = '';
  while (Date.now() - t0 < timeoutMs) {
    text = await evaluate(`document.getElementById('output-content').innerText`) ?? '';
    if (/— (done|stopped)/.test(text) || /Runtime error|^error:/m.test(text)) break;
    await sleep(100);
  }
  // Stop whatever still runs, so the next page starts clean.
  await evaluate(`(document.getElementById('run-btn').textContent.includes('Stop') && document.getElementById('run-btn').click(), true)`);
  const ms = (/— done · [^·]+ · (\d+) ms —/.exec(text) ?? [])[1];
  return { done: /— done/.test(text), text: text.replace(/\n?— (done|stopped)[^\n]*—\s*$/, '').trimEnd(), ms };
}

let failed = 0;
const rows = [];
for (const p of paths) {
  if (!compare) {
    const r = await runOne(p, engine);
    if (!r.done) failed++;
    console.log(`=== ${p} [${engine}] ${r.done ? `done ${r.ms} ms` : 'NOT DONE'}\n${r.text}\n`);
    continue;
  }
  const vm = await runOne(p, 'vm');
  const js = await runOne(p, 'js');
  const same = vm.text === js.text && vm.done === js.done;
  if (!same) failed++;
  rows.push({ p, same, vm, js });
  console.log(`${same ? 'same' : 'DIFF'}  ${p}  vm ${vm.done ? vm.ms + ' ms' : '—'}  js ${js.done ? js.ms + ' ms' : '—'}`);
  if (!same) {
    const a = vm.text.split('\n'), b = js.text.split('\n');
    const i = a.findIndex((l, k) => l !== b[k]);
    console.log(`      first difference, line ${i + 1}\n      vm| ${a[i]?.slice(0, 160)}\n      js| ${b[i]?.slice(0, 160)}`);
  }
}
if (compare) console.log(`\n${rows.length} examples: ${rows.length - failed} same, ${failed} differ`);
ws.close();
chrome.kill();
process.exit(failed ? 1 : 0);
