# auth.md — zymbol-lang.org

> **There is nothing to authenticate.** This site has no accounts, no API keys, no
> registration and no login. Every URL below is public and anonymous. This document
> exists so an agent can establish that in one request instead of probing for a
> sign-up flow that does not exist.

## Audience

Automated clients: AI agents, crawlers, documentation tools, package tooling.

## Registration

**None.** There is no registration endpoint, no provisioning endpoint, and no
credential to obtain. Requests carry no `Authorization` header; one sent anyway is
ignored.

| Question | Answer |
| --- | --- |
| Registration URI | none — nothing to register for |
| Authorization servers | none |
| Supported auth methods | none (anonymous access only) |
| Scopes | none |
| OAuth metadata (`/.well-known/oauth-protected-resource`) | not published — no protected resource exists |
| API catalog (`/.well-known/api-catalog`) | not published — there is no API |

## What this site actually is

A static documentation site for the Zymbol programming language, served from
GitHub Pages behind Cloudflare. No application server, no database, no
user-specific state. The one dynamic component is an edge Worker that swaps an
HTML page for its Markdown twin when a client sends `Accept: text/markdown`; it
reads no credentials and stores nothing.

The in-browser playground executes Zymbol code entirely in the visitor's own tab.
Nothing is uploaded, nothing is stored server-side, and no account is involved.

## Machine-readable resources

| Resource | URL |
| --- | --- |
| Site map for agents | <https://zymbol-lang.org/llms.txt> |
| Markdown of any page | swap the extension — `/install.html` → `/install.md` — or send `Accept: text/markdown` |
| Crawl policy | <https://zymbol-lang.org/robots.txt> |
| Sitemap | <https://zymbol-lang.org/sitemap.xml> |
| Language manual, 110 languages | `https://zymbol-lang.org/data/manuals/manual_<code>.md` |
| Example pool index | <https://zymbol-lang.org/examples/catalog.json> |

`catalog.json` is a data file the playground reads, not a service: it has no
versioned contract, no OpenAPI description and no stability guarantee. Treat it as
content, not as an API.

## Rate limits and etiquette

No published rate limit. Cloudflare sits in front of the origin and may challenge
or throttle abusive traffic; ordinary crawling is welcome. Identify yourself with a
descriptive `User-Agent` and the site will not get in your way.

## Licence

Content is not free of terms even though access is free of credentials: source code
is AGPL-3.0-only, documentation and examples are CC BY-SA 4.0. See
<https://github.com/zymbol-lang/web/blob/main/LICENSE>.

## Contact

Issues and questions: <https://github.com/zymbol-lang/web/issues>
