# Markdown negotiation — deploy notes

`markdown-negotiation.js` is a Cloudflare Worker. It is **not** part of the site:
GitHub Pages will happily serve this directory, but nothing links to it and
nothing loads it. It runs at the edge, in front of Pages.

## What it does

GitHub Pages serves one body per path, so it cannot answer `Accept:
text/markdown` differently from `Accept: text/html`. This Worker does the varying:

| Request | Response |
| --- | --- |
| `GET /` + `Accept: text/html` | `index.html`, unchanged |
| `GET /` + `Accept: text/markdown` | `index.md` as `text/markdown` |
| `GET /install.html` + `Accept: text/markdown` | `install.md` |
| `GET /install.md` | `install.md` — untouched, no Worker logic |
| a page with no `.md` twin | the HTML, plus `Vary: Accept` |

The twins are hand-written files in the repository root next to the pages they
mirror. `tests/test_markdown.mjs` fails if an HTML page has no twin, so "the
Worker has something to serve" is a tested property, not a hope.

## Link headers

Every page the Worker handles also gets RFC 8288 `Link` headers, so an agent that
issues one `HEAD` request learns where the machine-readable material is:

```text
Link: <https://zymbol-lang.org/index.md>; rel="alternate"; type="text/markdown"
Link: </llms.txt>; rel="describedby"
Link: </LICENSE-AGPL-3.0>; rel="license"; title="Source code: AGPL-3.0-only"
Link: </LICENSE-CC-BY-SA-4.0>; rel="license"; title="Documentation: CC BY-SA 4.0"
```

Only IANA-registered relation types, and only targets that exist —
`tests/test_markdown.mjs` asserts both, because a `Link` header is a
machine-readable promise and an agent that follows one into a 404 has been lied
to. Header values are ByteStrings: **ASCII only**, so no em dash in a `title=`.

There is deliberately **no `rel="api-catalog"`** and no
`/.well-known/api-catalog`: this is a static documentation site with no API, no
endpoint and no OpenAPI description. `examples/catalog.json` is a data file the
playground reads, not a service. Declaring it as one would pass a scanner and
mislead every agent that believed it. `/auth.md` says the same thing about
accounts: there are none.

## Deploy

```bash
cd worker
npx wrangler login          # once, in a browser
npx wrangler deploy         # reads wrangler.toml, publishes and binds the routes
```

The routes in `wrangler.toml` cover the whole zone (`zymbol-lang.org/*` and
`www.`). The zone is already proxied through Cloudflare with Pages as the origin,
so no DNS or Pages change is needed. Deploying is free on the Workers free plan
(100 000 requests/day); the Worker only makes a subrequest when someone actually
asks for Markdown.

Undo is `npx wrangler delete` — the site returns to plain Pages behaviour and the
`.md` twins keep working as ordinary files.

## Verify

```bash
curl -sI  https://zymbol-lang.org/install.html                             # text/html
curl -sI  https://zymbol-lang.org/install.html -H 'Accept: text/markdown'  # text/markdown
curl -s   https://zymbol-lang.org/ -H 'Accept: text/markdown' | head -5    # index.md
curl -sI  https://zymbol-lang.org/                                         # Vary: Accept + Link: …index.md
curl -sI  https://zymbol-lang.org/ | grep -i '^link:'                     # all four Link headers
```

A browser navigation must keep returning HTML — that is the case that breaks if
`prefersMarkdown()` is ever loosened to accept `*/*`:

```bash
curl -sI https://zymbol-lang.org/ \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' | grep -i content-type
```

## Two dashboard settings that override this repository

Both live in the Cloudflare dashboard, and both silently outrank anything checked
in here:

1. **Managed `robots.txt`** (AI Crawl Control → robots.txt). While it is on,
   Cloudflare injects its own `robots.txt` — which disallows `ClaudeBot`,
   `GPTBot`, `Google-Extended`, `CCBot`, `Bytespider`, `Amazonbot`,
   `Applebot-Extended` and `meta-externalagent`, and signals `ai-train=no` — and
   the repository's `/robots.txt` is never served. Turn it off for the site's own
   policy to apply.
2. **AI crawler blocking / Bot Fight Mode**. If AI crawlers are blocked at the
   edge they get a challenge or a 403 before the Worker runs, and no amount of
   Markdown reaches them.

`curl -s https://zymbol-lang.org/robots.txt | head -3` tells you which file is
live: the repository's starts with `# zymbol-lang.org`, Cloudflare's with a
content-signals licence preamble.
