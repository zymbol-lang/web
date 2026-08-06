// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Markdown content negotiation for zymbol-lang.org.
 *
 * The site is static (GitHub Pages), so it cannot vary a response on a request
 * header — Pages serves one body per path. This Worker sits on the zone and does
 * the varying: a request that asks for `Accept: text/markdown` gets the page's
 * Markdown twin, everything else gets the HTML it always got.
 *
 *     GET /install.html   Accept: text/html        → install.html
 *     GET /install.html   Accept: text/markdown    → install.md
 *     GET /               Accept: text/markdown    → index.md
 *     GET /install.md     (any Accept)             → install.md, untouched
 *
 * The twins are hand-written files in the repository, not a runtime HTML→Markdown
 * conversion. Two reasons: the playground is an application, so a scrape of its
 * DOM says nothing useful about it, and a conversion nobody reads is a conversion
 * nobody notices breaking. `tests/test_markdown.mjs` fails if an HTML page has no
 * twin, which is what keeps this Worker honest.
 *
 * A page with no twin is served as HTML — this Worker never 404s a request that
 * would otherwise have succeeded.
 *
 * It also attaches the site's `Link` headers (RFC 8288) to every page it handles:
 * the Markdown twin, the agent map, and the licences. Only registered relation
 * types, and only for resources that exist — a `Link` header is a machine-readable
 * claim, and an agent that follows one into a 404 has been lied to. There is no
 * `api-catalog` link because there is no API: this is a static site.
 */

const MARKDOWN_TYPES = ['text/markdown', 'text/x-markdown'];

/**
 * Site-wide links, in IANA-registered relation types only.
 *   describedby  → the agent's map of the site (llms.txt convention)
 *   license      → both licences: code is AGPL-3.0-only, prose is CC BY-SA 4.0
 * `alternate` is per-page and added alongside these.
 */
// Header values are ByteStrings: ASCII only, so no em dashes in the titles.
const SITE_LINKS = [
  '</llms.txt>; rel="describedby"',   // no type=: Pages decides how .txt is served
  '</LICENSE-AGPL-3.0>; rel="license"; title="Source code: AGPL-3.0-only"',
  '</LICENSE-CC-BY-SA-4.0>; rel="license"; title="Documentation: CC BY-SA 4.0"',
];

/** Marks our own subrequests so a route that loops back here passes straight through. */
const LOOP_HEADER = 'x-zymbol-md-subrequest';

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return fetch(request);
    if (request.headers.has(LOOP_HEADER)) return fetch(request);

    const url = new URL(request.url);
    const twin = twinPath(url.pathname);

    // Already text (a .md, .txt, llms.txt…) or an asset: nothing to negotiate.
    if (!twin) return fetch(request);

    if (!prefersMarkdown(request.headers.get('Accept'))) {
      return withLinks(await fetch(request), new URL(twin, url).toString());
    }

    const twinURL = new URL(twin, url);
    const twinRes = await fetch(twinURL, {
      headers: { [LOOP_HEADER]: '1', 'Accept': 'text/markdown' },
      cf: { cacheEverything: true },
    });

    if (!twinRes.ok) {
      // No twin for this path — the HTML is still a correct answer.
      return withLinks(await fetch(request), null);
    }

    const headers = new Headers(twinRes.headers);
    headers.set('Content-Type', 'text/markdown; charset=utf-8');
    headers.set('Content-Location', new URL(twin, url).pathname);
    headers.set('X-Robots-Tag', 'noindex');  // the HTML page is the indexable one
    return withLinks(new Response(request.method === 'HEAD' ? null : twinRes.body, {
      status: twinRes.status,
      headers,
    }), null);
  },
};

/**
 * The Markdown twin of a path, or null if the path is not an HTML page.
 *
 *   /              → /index.md
 *   /install.html  → /install.md
 *   /docs/         → /docs/index.md
 *   /install.md    → null (already Markdown)
 *   /favicon.ico   → null
 */
export function twinPath(pathname) {
  if (pathname.endsWith('/')) return `${pathname}index.md`;
  if (pathname.endsWith('.html')) return `${pathname.slice(0, -'.html'.length)}.md`;
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  if (!lastSegment.includes('.')) return `${pathname}.md`;  // extensionless page
  return null;                                              // .md, .txt, .js, assets…
}

/**
 * True when the client asked for Markdown and did not ask for something else more
 * strongly. `*\/*` alone is not a request for Markdown — a browser sends it on
 * every navigation, and answering those with Markdown would break the site.
 */
export function prefersMarkdown(accept) {
  if (!accept) return false;

  let markdown = 0;
  let other = 0;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().split(';');
    const media = type.trim().toLowerCase();
    if (!media) continue;
    const qParam = params.map(p => p.trim()).find(p => p.startsWith('q='));
    const q = qParam ? parseFloat(qParam.slice(2)) : 1;
    if (Number.isNaN(q)) continue;
    if (MARKDOWN_TYPES.includes(media)) markdown = Math.max(markdown, q);
    else if (media !== '*/*') other = Math.max(other, q);
  }
  return markdown > 0 && markdown >= other;
}

/**
 * Attach the site's `Link` headers and mark the response as varying on `Accept`.
 * `twinURL` adds the per-page `alternate` link; pass null when the response *is*
 * the Markdown (it would be a link to itself).
 *
 * The twin is not fetched to confirm it exists — that is one extra subrequest per
 * page view to verify what `tests/test_markdown.mjs` already guarantees.
 */
function withLinks(response, twinURL) {
  const headers = new Headers(response.headers);
  headers.set('Vary', 'Accept');
  if (twinURL) {
    headers.append('Link', `<${twinURL}>; rel="alternate"; type="text/markdown"`);
  }
  for (const link of SITE_LINKS) headers.append('Link', link);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
