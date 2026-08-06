#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Integrity tests for the agent-facing Markdown of the site.
//
//   node tests/test_markdown.mjs
//
// Three things have to hold for `Accept: text/markdown` to be worth anything, and
// none of them are visible in a browser — which is exactly how they rot:
//
//   a missing twin    an HTML page with no .md next to it → the Worker falls back
//                     to HTML and the page is invisible to agents;
//   a stale twin      the page says v0.0.9 and the twin still says v0.0.8 → the
//                     agent is handed last month's download links, confidently;
//   a dead pointer    llms.txt or a <link rel="alternate"> aiming at a file that
//                     was renamed → the entry point 404s.
//
// The staleness check is deliberately mechanical: versions, release URLs and
// SHA256 digests that appear in a page must appear in its twin. Prose is allowed
// to differ (a twin is a representation, not a transcript), facts are not.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import worker, { twinPath, prefersMarkdown } from '../worker/markdown-negotiation.js';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}
function section(name) { console.log(`\n${name}`); }

const read = rel => readFileSync(join(WEB_DIR, rel), 'utf8');
const pages = readdirSync(WEB_DIR).filter(f => f.endsWith('.html')).sort();

// ─── every page has a twin, and says so ──────────────────────────────────────
section('page twins');

for (const page of pages) {
  const twin = page.replace(/\.html$/, '.md');
  const html = read(page);

  check(`${page} has ${twin}`, existsSync(join(WEB_DIR, twin)));
  if (!existsSync(join(WEB_DIR, twin))) continue;

  const md = read(twin);
  check(`${twin} is not empty`, md.trim().length > 200, `${md.trim().length} chars`);
  check(`${twin} opens with a heading`, /^#\s|\n#\s/.test(md));

  const alternate = /<link rel="alternate" type="text\/markdown" href="([^"]+)">/.exec(html);
  check(`${page} advertises its twin`, alternate !== null,
        'expected <link rel="alternate" type="text/markdown" href="…">');
  if (alternate) {
    check(`${page} advertises the right file`, alternate[1] === twin,
          `points at ${alternate[1]}, twin is ${twin}`);
  }
}

// ─── twins carry the same facts as the pages ─────────────────────────────────
section('twin freshness');

// Facts worth pinning: they are what an agent acts on, and they are the first
// thing to go stale when a release lands in the HTML only.
const FACTS = [
  { name: 'version',      re: /\bv\d+\.\d+\.\d+\b/g },
  { name: 'release URL',  re: /https:\/\/github\.com\/zymbol-lang\/[^\s"'<>)]+\/(?:releases|download)\/[^\s"'<>)]+/g },
  { name: 'SHA256',       re: /\b[a-f0-9]{64}\b/g },
];

for (const page of pages) {
  const twin = page.replace(/\.html$/, '.md');
  if (!existsSync(join(WEB_DIR, twin))) continue;
  const html = read(page);
  const md   = read(twin);

  for (const { name, re } of FACTS) {
    const inHtml = new Set(html.match(re) ?? []);
    const missing = [...inHtml].filter(v => !md.includes(v));
    check(`${twin} covers every ${name} in ${page}`, missing.length === 0,
          missing.length ? `missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` (+${missing.length - 3})` : ''}` : '');
  }
}

// ─── llms.txt ────────────────────────────────────────────────────────────────
section('llms.txt');

const llms = read('llms.txt');
check('llms.txt starts with an H1', /^# \S/.test(llms));
check('llms.txt has a summary blockquote', /\n> \S/.test(llms));

const SITE = 'https://zymbol-lang.org/';
for (const [, url] of llms.matchAll(/\]\((https:\/\/zymbol-lang\.org\/[^)]+)\)/g)) {
  const rel = url.slice(SITE.length);
  check(`llms.txt → /${rel} exists`, existsSync(join(WEB_DIR, rel)));
}
for (const page of pages) {
  const twin = page.replace(/\.html$/, '.md');
  check(`llms.txt lists ${twin}`, llms.includes(twin));
}

// ─── auth.md ─────────────────────────────────────────────────────────────────
// The site has no accounts and no API. That is worth one request to establish,
// which is all this file is: a machine-readable "there is nothing here to log
// into", so an agent stops looking instead of probing for a sign-up flow.
section('auth.md');

const auth = read('auth.md');
check('auth.md has an H1 naming itself', /^#\s.*auth\.md/mi.test(auth.split('\n')[0]));
check('auth.md states there is no registration', /no registration/i.test(auth));
check('auth.md is listed in llms.txt', llms.includes('auth.md'));
for (const [, url] of auth.matchAll(/<(https:\/\/zymbol-lang\.org\/[^>]+)>/g)) {
  const rel = url.slice(SITE.length);
  if (rel.includes('<')) continue;                       // a template, not a path
  check(`auth.md → /${rel} exists`, existsSync(join(WEB_DIR, rel)));
}

// ─── robots.txt ──────────────────────────────────────────────────────────────
section('robots.txt');

const robots = read('robots.txt');
check('robots.txt allows the site', /^Allow: \/$/m.test(robots));
check('robots.txt blocks nothing wholesale', !/^Disallow: \/$/m.test(robots));
check('robots.txt points at the sitemap', /^Sitemap: https:\/\/zymbol-lang\.org\/sitemap\.xml$/m.test(robots));

// ─── the Worker's two decisions ──────────────────────────────────────────────
section('worker: twinPath');

for (const [path, want] of [
  ['/',                    '/index.md'],
  ['/install.html',        '/install.md'],
  ['/docs/',               '/docs/index.md'],
  ['/install',             '/install.md'],
  ['/install.md',          null],
  ['/llms.txt',            null],
  ['/favicon.ico',         null],
  ['/src/zymbol/zymbol.js', null],
]) {
  const got = twinPath(path);
  check(`twinPath(${path}) → ${want}`, got === want, `got ${got}`);
}

section('worker: prefersMarkdown');

const BROWSER = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
for (const [accept, want] of [
  ['text/markdown',                     true],
  ['text/x-markdown',                   true],
  ['text/markdown, text/html;q=0.9',    true],
  ['text/markdown;q=0.5, text/html',    false],   // asked, but prefers HTML
  ['text/html',                         false],
  ['*/*',                               false],   // a bare wildcard is not a request for Markdown
  [BROWSER,                             false],   // and neither is a browser navigation
  [null,                                false],
  ['',                                  false],
]) {
  const got = prefersMarkdown(accept);
  check(`prefersMarkdown(${JSON.stringify(accept)}) → ${want}`, got === want, `got ${got}`);
}

// ─── the Worker against the real files ───────────────────────────────────────
// The two helpers above can both be right while the handler still hands back the
// wrong body, so run it for real: `fetch` is stubbed to serve this directory, the
// way Pages does.
section('worker: responses');

globalThis.fetch = async (input, init) => {
  const req = input instanceof Request ? input : new Request(input, init);
  const path = new URL(req.url).pathname;
  const file = join(WEB_DIR, path.endsWith('/') ? `${path}index.html` : path);
  if (!existsSync(file)) return new Response('Not Found', { status: 404 });
  const type = file.endsWith('.md') ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8';
  return new Response(readFileSync(file), { status: 200, headers: { 'content-type': type } });
};

const call = (path, accept) =>
  worker.fetch(new Request(`https://zymbol-lang.org${path}`,
                           { headers: accept ? { Accept: accept } : {} }));

{
  const res  = await call('/', 'text/markdown');
  const body = await res.text();
  check('GET / with Accept: text/markdown → markdown',
        res.headers.get('content-type').startsWith('text/markdown'), res.headers.get('content-type'));
  check('GET / with Accept: text/markdown → index.md body', body.startsWith('# Zymbol\n'), body.slice(0, 40));
  check('markdown response varies on Accept', res.headers.get('vary') === 'Accept');
  check('markdown response names the file it served',
        res.headers.get('content-location') === '/index.md', res.headers.get('content-location'));
}
{
  const res = await call('/', BROWSER);
  check('GET / from a browser → html', res.headers.get('content-type').startsWith('text/html'),
        res.headers.get('content-type'));
  check('html response varies on Accept', res.headers.get('vary') === 'Accept');
  check('html response links its twin',
        (res.headers.get('link') ?? '').includes('rel="alternate"; type="text/markdown"'),
        res.headers.get('link') ?? '(no Link header)');

  // RFC 8288 Link headers, registered relation types only. Each one is a promise
  // about a URL, so each target has to be a file that is actually published.
  const links = res.headers.get('link') ?? '';
  for (const [rel, target] of [
    ['describedby', '/llms.txt'],
    ['license',     '/LICENSE-AGPL-3.0'],
    ['license',     '/LICENSE-CC-BY-SA-4.0'],
  ]) {
    check(`homepage Link: <${target}>; rel="${rel}"`,
          links.includes(`<${target}>; rel="${rel}"`), links || '(no Link header)');
    check(`Link target ${target} exists`, existsSync(join(WEB_DIR, target.slice(1))));
  }
  check('no api-catalog link is claimed', !links.includes('api-catalog'),
        'this site has no API — advertising a catalog would be a false claim');
}
{
  const res  = await call('/install.html', 'text/markdown');
  const body = await res.text();
  check('GET /install.html with Accept: text/markdown → install.md',
        body.startsWith('# Download & Install Zymbol'), body.slice(0, 40));
}
{
  // A page with no twin must still answer with whatever the origin has.
  const res = await call('/nope.html', 'text/markdown');
  check('a page with no twin falls back to the origin', res.status === 404, `status ${res.status}`);
}
{
  const res  = await call('/llms.txt', 'text/markdown');
  const body = await res.text();
  check('/llms.txt passes through untouched', body.startsWith('# Zymbol\n'), body.slice(0, 40));
}

// ─── summary ─────────────────────────────────────────────────────────────────
console.log(`\n${pages.length} page(s) · ${pages.length} twin(s) · llms.txt · robots.txt`);
console.log(failures === 0 ? '\nAll markdown tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
