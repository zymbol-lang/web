<p align="center">
  <img src="assets/img/logo.png" alt="Zymbol-Lang" width="180"/>
</p>

<h1 align="center">Zymbol-Lang — Website &amp; Playground</h1>

<p align="center">
  Source for <a href="https://zymbol-lang.org">zymbol-lang.org</a> — the official site of the<br/>
  wordless symbolic language, and the playground that runs it in the browser.
</p>

<p align="center">
  <img alt="version v0.0.8" src="https://img.shields.io/badge/version-v0.0.8-informational?style=flat-square"/>
  <img alt="build: none by design" src="https://img.shields.io/badge/build-none%20by%20design-success?style=flat-square"/>
  <img alt="code: AGPL-3.0-only" src="https://img.shields.io/badge/code-AGPL--3.0--only-blue?style=flat-square"/>
  <img alt="docs: CC-BY-SA-4.0" src="https://img.shields.io/badge/docs-CC--BY--SA--4.0-blue?style=flat-square"/>
  <a href="https://zymbol-lang.org/playground.html"><img alt="Open the playground" src="https://img.shields.io/badge/▶-playground-7c3aed?style=flat-square"/></a>
</p>

---

> **Live at v0.0.8.** The `v0.0.8` tag is cut, the release assets exist, and
> `index.html`, `install.html` and `changelog.html` carry real SHA256 digests — no
> `pending` placeholders remain. Work for v0.0.9 happens on the `v0.0.9` branch.
>
> **The rule this banner used to enforce still holds**, and is the reason it is rewritten
> rather than deleted: `main` is what GitHub Pages serves, so a version bump merges to
> `main` **only after** the corresponding release assets are published, with the digests
> filled in the same change. Merging early puts 404s on the live site. See
> `agents/web_release.md` for the procedure.

Source for [zymbol-lang.org](https://zymbol-lang.org) — the official website of the Zymbol
programming language, including the in-browser playground that runs Zymbol without a server.

Zymbol is a symbolic programming language with no words in its grammar: every construct uses pure symbols
(`?` for if, `@` for loops, `->` for lambdas, `>>` for output). Identifiers can be written in
any human language or script — Unicode, emoji, RTL, CJK, Indic. Numeric output can be
rendered in any of 69 Unicode digit scripts (Devanagari, Arabic-Indic, Thai, Klingon pIqaD, …)
via numeral modes.

## Layout

```text
web/
├── index.html                 Landing page (i18n showcase, embedded manual reader)
├── playground.html            Interactive editor — multi-file, .zyp packages
├── install.html               Download / install instructions per platform
├── changelog.html             Release history
├── piqad-reference.html       Klingon pIqaD script reference
├── index|playground|install|changelog|piqad-reference.md
│                              Markdown twin of each page — what agents get
├── llms.txt                   Map of the site for agents (llms.txt convention)
├── robots.txt                 Crawl policy — agents allowed (see the Cloudflare caveat)
├── auth.md                    There is nothing to authenticate — no accounts, no API
├── .well-known/agent-skills/  index.json + write-zymbol/SKILL.md — the published skill
├── LICENSE                    Which license covers what (code AGPL, prose CC BY-SA)
├── LICENSE-AGPL-3.0  LICENSE-CC-BY-SA-4.0
│                              The two license texts
├── CNAME  favicon.ico         GitHub Pages domain + root favicon
├── .github/workflows/ci.yml   Runs the test suite on every push and PR
│
├── worker/                    Cloudflare Worker — Accept: text/markdown → the .md twin
│   ├── markdown-negotiation.js  Deployed to the edge, not served as part of the site
│   ├── wrangler.toml          Routes: zymbol-lang.org/* and www.
│   └── README.md              Deploy steps + the two dashboard settings that override this repo
│
├── src/
│   ├── zymbol/                THE ENGINE — no DOM, no site dependencies
│   │   ├── zymbol.js          JS mirror of the Rust tree-walker (Lexer/Parser/Interpreter)
│   │   ├── zyp.js             .zyp package reader (ZIP central directory + DecompressionStream)
│   │   └── module-resolver.js Path-normalizing module resolver (mirrors ModulePath::resolve_from)
│   ├── playground/            Playground UI — consumes the engine
│   │   ├── playground.js      Orchestrator: editor, tabs, run loop, TUI, upload
│   │   ├── filestore.js       File model — mounted (resolvable) vs open (tabbed)
│   │   ├── catalog.js         Reads examples/catalog.json; mounts entries and .zyp
│   │   ├── sidebar.js         Explorer tree: WORKSPACE + EXAMPLES, filter, preview
│   │   ├── highlight.js       Syntax highlighter (esc, highlightCode)
│   │   └── webmcp.js          navigator.modelContext tools — feature-detected no-op
│   ├── site/
│   │   └── main.js            Landing-page logic: language switcher, manual reader, transitions
│   └── css/
│       ├── site.css           Shared styles for every page except the playground
│       └── playground.css     Playground-only styles
│
├── assets/
│   ├── img/                   logo.png, favicon.png, Zenith_logo_Black.png
│   └── fonts/                 pIqaD-qolqoS.woff2 / .ttf (Klingon pIqaD, U+F8D0–U+F8FF)
│
├── data/
│   ├── i18n/                  languages.json, i18n.json, languages.xml
│   ├── manuals/               manual_<lang>.md (110 translations) + translation_progress.md
│   └── archive/               v004/, v005/ — superseded manual sets, kept for diffing
│
├── examples/                  THE EXAMPLE POOL — the playground's only source of examples
│   ├── catalog.json           Hand-curated index: groups → categories → entries
│   ├── tour/                  Guided tours, one heavily commented file per topic
│   ├── output|input|variables|control|match|loops/   Basics, one file per example
│   ├── collections|destructuring|functions|lambdas|errors/
│   ├── numerals/              Native digit sets (Devanagari, Thai, Math Bold, LCD)
│   ├── rosetta-stone/         The same program in 105 human languages (.zy)
│   ├── projects/              Multi-file projects (module + i18n re-export layers)
│   ├── tui|cli|shell/         Canvas TUI, >< args, <\ shell \>
│   └── games/                 arcade/ (serpiente, klingon_galaxy), classic/ (go) — .zyp
│
├── tests/
│   ├── test_runner.mjs        Parity: zymbol CLI vs the JS engine
│   ├── test_catalog.mjs       catalog.json ↔ examples/ integrity (dead refs, orphans)
│   ├── test_filestore.mjs     The mounted-vs-open file model and its persistence
│   ├── test_zyp.mjs           .zyp reader + module resolver (builds its own fixtures)
│   ├── test_manual.mjs        Smoke-runs every ```zymbol block in manual_en.md
│   ├── test_markdown.mjs      Page twins, llms.txt, robots.txt and the negotiation Worker
│   ├── test_licenses.mjs      The AGPL/CC BY-SA split, per file
│   ├── test_agents.mjs        Skill digest + every SKILL.md block runs + WebMCP tools
│   ├── serve.mjs              Dev server with Cache-Control: no-store (LAN device testing)
│   ├── tui-gestures.html      Self-checking: swipe → arrow key on the TUI canvas
│   └── piqad-font.html        Visual check that the pIqaD web font loads
│
├── docs/
│   ├── GAPS.md                Engine parity status vs the Rust interpreter
│   ├── newlang.md             Plan for adding new human languages
│   └── wiki/                  Esolangs / Wikipedia article sources (MediaWiki format)
│
└── scripts/                   One-off data migrations (Python, gitignored — not part of the site)
```

### Why the `.html` files stay at the root

GitHub Pages serves this repo from its root, `CNAME` must live there, and the published URLs
(`zymbol-lang.org/playground.html`, `/install.html`, …) are part of the site's public
contract — they are linked from the README, the releases, and external wikis. Moving a page
into a subdirectory breaks every one of those links. Everything a page *loads* is free to
move; the pages themselves are not.

### Dependency direction

`src/zymbol/` is the bottom layer and imports nothing outside itself — no DOM, no site code.
That is what makes it testable under plain Node (`tests/`) and reusable outside the
playground. `src/playground/` and `src/site/` depend on it, never the reverse.

```text
src/zymbol/  ←  src/playground/     (playground.html)
             ←  src/site/           (index.html)
```

## The example pool (`examples/`)

Every example the playground offers is a real `.zy` file or a real `.zyp` archive on disk,
indexed by `examples/catalog.json`. That is a deliberate reversal: the examples used to live
inline in `src/playground/examples.js` as ~1000 lines of JS string literals, where no tool
could reach them. Four of them had been broken since v0.0.6 (`:` instead of `=>` in a `??`
arm) and nothing noticed, because the parity runner walks files and a string baked into a JS
module is not a file. As files, the same examples are audited by `zymbol check`,
`test_runner.mjs --dir examples` and `test_catalog.mjs` — the migration itself turned up 19
files that no longer compiled and three that used pre-v0.0.4 zero-based indexing.

`catalog.json` is hand-curated, and that is the point: it decides grouping, ordering, titles
and descriptions, so the sidebar reads as a menu rather than a directory dump. An entry has
one of three shapes, and all three mount identically:

| Shape | Meaning |
| ----- | ------- |
| `{ "path": "loops/range.zy" }` | one loose file |
| `{ "dir": …, "files": […], "entry": … }` | a multi-file project; its own relative imports resolve inside `dir` |
| `{ "zyp": "games/classic/go.zyp" }` | a packaged program, read by the same `zyp.js` as ↑ Upload |

Optional keys: `desc`, `tags` (extra filter terms — this is how `Ελληνικά` is findable by
typing `greek`), `args` (pre-fills the args… field), `needs` (`tui`, `input`, `args`,
`shell`, `net` — the capability badges in the tree) and `icon` (an emoji; an entry that
carries one is rendered as a headline row rather than one more list item).

Groups and categories take an `icon` too, and a category takes `"open": true` to start
expanded instead of folded. That is the whole of the 🎮 GAMES treatment: it is the first
group in the file, its two categories are `open`, and each game brings its own emoji.

```text
🎮 GAMES          🕹️ Arcade    → 🐍 Serpiente — Snake, 🚀 Hov veS — Klingon Galaxy
                  ♟️ Classic   → ⚫ GO — 囲碁
```

Games are packages, and packages are how a program worth playing is shipped, so they live
under `examples/games/<category>/` rather than in a flat `packages/` bucket — the directory
is the same thing the tree shows and the same thing a shared link says.

Adding an example is: drop the `.zy` in the right directory, add one entry to
`catalog.json`, run `node tests/test_catalog.mjs --check`. The test fails on a dead reference
**and** on an orphan — a `.zy` under `examples/` that no entry points at is dead weight
shipped to every visitor, which is exactly how the old pool rotted.

### Deep links

`playground.html?open=<path>` mounts one entry and opens one file — the path is the entry's
own location under `examples/`, which is what makes a shared link readable:

```text
playground.html?open=games/classic/go.zyp             the packaged game
playground.html?open=games/classic/go                 same thing; the extension is optional
playground.html?open=games/classic/go/核/盤.zy         mounts GO, opens that one file
playground.html?open=rosetta-stone/Klingon_pIqaD.zy   a loose example
```

The playground rewrites the address bar to the `?open=` form of whatever is showing
(`history.replaceState`), so the link to share is always the URL already in the bar — there
is no copy button to find and no id to look up.

`playground.html?example=<id>` (a catalog id) still works and is what older links use; it
resolves to the same place and the bar is rewritten to the `?open=` form. `?open=` accepts an
id as a fallback too, so a mixed-up link still lands somewhere.

## No build step

This is deliberate. There is no `package.json`, no bundler, no npm install, no transpiler —
edit a file, reload the browser. HTML loads `src/playground/playground.js` as a native ES
module and the browser resolves the import graph itself.

Two external resources are loaded at runtime, both optional to the core experience: Google
Fonts (Inter + JetBrains Mono) and `marked@9` from jsDelivr, used only by the landing page's
manual reader. The playground itself has **zero** third-party code — `zyp.js` walks the ZIP
central directory by hand rather than pulling in a ZIP library.

Serve locally from this directory:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Opening `index.html` via `file://` will not work: ES modules and `fetch()` of the i18n data
both require an HTTP origin.

## The engine (`src/zymbol/`)

`zymbol.js` is a hand-maintained JavaScript mirror of the Rust tree-walker. It is not
generated and not compiled from the Rust — it is kept in parity by the test runner below, and
its file header comment tracks which Rust version it mirrors.

- Public entry point: `runZymbol(src, inputFn, onOutput, moduleResolver, filePath)`.
- Three exported classes: `Lexer`, `Parser`, `Interpreter`.
- `Interpreter` is fully `async`; every `eval`/`exec` call is awaited. Output goes through the
  `onOutput` callback, never `console.log`.
- `Env` is a linked-list scope: `def` creates, `set` updates up the chain, `get` throws on a
  missing name.
- Adding an operator touches three places: the lexer's `$`/`@`/`twoMap` block, an AST-shape
  case in the parser, and a `case` in `execStmt` or `evalCollectionOp`/`eval`.

### `.zyp` package support

The playground loads a Zymbol Package directly — from `examples/games/` through the sidebar
or from disk through ↑ Upload. Its source tree is **mounted**, not opened: every file appears in
the explorer and is visible to the module resolver, one tab opens (the default `[[script]]`),
and the manifest's scripts populate the picker next to ▶ Run. The picker *opens* a script's
tab — ▶ Run always executes the focused tab, so what the picker shows and what runs cannot
disagree; it used to hold a separate run target that survived tab switches, and a package
mounted early in a session kept hijacking Run. Mounted names are namespaced by
the archive (`games/classic/go/核/盤.zy`), so two packages that both ship a `texto.zy` can be
mounted at the same time without overwriting each other.

`zyp.js` reads the ZIP by hand — central directory walk, then
`DecompressionStream('deflate-raw')` for deflated entries. It reads `zyp.json`, never
`zyp.toml`: parsing TOML in the browser would mean either a CDN dependency or a hand-rolled
parser that could silently diverge from the Rust `toml` crate on comments, escapes or
multi-line strings. The Rust writer emits `zyp.json` specifically so this file never has to.

Only Stored (0) and Deflate (8) compression are supported — the only two the writer produces.
`DecompressionStream` needs Chrome 103+, Firefox 113+, or Safari 16.4+; there is no fallback.

`module-resolver.js` is separate from `playground.js` so it can be tested without a DOM. It
replaced a resolver that collapsed every import to its basename, which silently collided
same-named modules in different directories and never returned `resolvedPath` — so
`zymbol.js`'s module cache and circular-import detection treated one file imported via two
different relative paths as two distinct modules, loading and running it twice.

## Internationalization data

| File | Contents |
| ---- | -------- |
| `data/i18n/languages.json` | 111 languages — FizzBuzz tokens and showcase constructs. Drives the language switcher. |
| `data/i18n/i18n.json` | 119 languages — ~50 UI strings each, plus region labels. |
| `data/manuals/manual_<lang>.md` | 110 full manual translations, rendered by the landing page. |

`languages.json` is a strict subset of `i18n.json`: 8 languages (Hungarian, Welsh, Cree,
Mando'a, Quenya, Sindarin, Dothraki, High Valyrian) have UI translations staged but no
showcase entry yet, so they do not appear in the switcher. Adding a language means all three
artifacts — see [docs/newlang.md](docs/newlang.md).

### Known divergence: "no words" (English) vs "no keywords" (every other language)

The English strings say **No words. Just symbols.** — `t1`, `stat_keywords` and `f1_title`
in `i18n.json`, and the same claim throughout the English documentation. The other 118
languages still say the equivalent of *no keywords*: `Sin palabras clave`, `Aucun mot-clé`,
`キーワードなし`, `没有关键字`, `Без ключевых слов`.

**That is a deliberate hold, not an oversight.** The English wording was corrected on
2026-09-01 because "no keywords" is only nearly true: *keyword* is a tokenizer's term for a
reserved token, and by that reading Zymbol has plenty — its own language server files `?`,
`@` and `<~` under `KEYWORD` because LSP offers no other slot, and the TextMate grammar puts
every operator under a `keyword.control.zymbol` scope. The claim that survives inspection is
the one `interpreter/SYMBOLS.md` §1.2 states: **no construct of the grammar is a word.**

Carrying that correction into 119 languages is ~357 UI strings plus the opening line of 110
manuals, and in most languages it is a matter of dropping a modifier (`palabras clave` →
`palabras`). It has not been done. Anyone picking it up should start from `SYMBOLS.md` §1.2,
and should also fix `scripts/patch_african_i18n.py` and `scripts/add_mesoamerican_languages.py`,
which would otherwise reintroduce the old wording for any language added afterwards.

## Testing

Plain Node, no install step. Run from this directory:

```bash
node tests/test_zyp.mjs               # .zyp reader + module resolver — builds its own fixtures
node tests/test_filestore.mjs         # mounted-vs-open file model + persistence
node tests/test_limits.mjs            # step/output caps: the TUI exemption and the guard it must not disarm
node tests/test_catalog.mjs [--check] # catalog.json ↔ examples/ (--check also compiles every .zy)
node tests/test_runner.mjs            # parity: zymbol CLI vs the JS engine
node tests/test_runner.mjs --dir examples   # …over the example pool
node tests/test_manual.mjs            # smoke-runs every code block in manual_en.md
node tests/test_markdown.mjs          # page twins, llms.txt, robots.txt, negotiation Worker
node tests/test_licenses.mjs          # SPDX headers on every source, CC BY-SA on every manual
node tests/test_agents.mjs            # skill digest, SKILL.md blocks execute, WebMCP tools
```

Every one of those runs in CI on each push to `main` and on every pull request
(`.github/workflows/ci.yml`) — `main` is what GitHub Pages serves, so an invariant that
only ever ran on a laptop was an invariant that published its own breakage.
`test_runner.mjs` stays out: it needs the `zymbol` CLI, so it is a local pre-release check.

Two tests need a browser and therefore live as pages, opened over `node tests/serve.mjs`:
`tests/tui-gestures.html` (swipe → arrow key on the TUI canvas; self-checking, it prints its
own pass/fail and sets the document title) and `tests/piqad-font.html` (visual).

Use `node tests/serve.mjs [port]` rather than `python3 -m http.server` when testing from a
phone or tablet. `http.server` sends `Last-Modified` and no `Cache-Control`, so a browser
applies heuristic freshness and stops revalidating — which is invisible until a module is
renamed or deleted, at which point a stale cached `playground.js` imports a file that 404s and
the whole ES module graph fails silently. `serve.mjs` sends `no-store` on everything.

`test_runner.mjs` is a wrapper over
[ZyQuality](https://github.com/zymbol-lang/zyquality), the project's point of record for
testing: the corpus lives there, and the browser engine is graded on the same files as the
other three. It exits **2** if that checkout is absent — a gate must not read "nothing ran"
as "nothing failed".

```bash
git clone https://github.com/zymbol-lang/zyquality.git ../zyquality
make -C ../zyquality
node tests/test_runner.mjs                  # → zyq consensus --engines zytw,zyjs
node tests/test_runner.mjs --dir examples   # the example pool, which this repo owns
```

The 40-entry `SKIP_SET` that used to sit inside this file is gone. It was a list of paths in
JavaScript describing files in another repository, which no other runner could read — so a
file skipped here because it shells out was still counted as a divergence by zyml. Those
exclusions are now `[[rule]]` entries in `zyquality/corpus.toml`, tagged (BASH_EXEC,
ANSI_FORMAT, TUI, HOT_DEF, FEATURE_GAP, STD_DB) with the reason each gives, and every
engine's suite reads the same file. A file in *this* repository's example pool declares its
own with a `// @zyq-skip:` marker in its first lines, so the rule travels with the file.

`tests/run_one.mjs` is the driver: it runs one `.zy` and prints what the engine produced,
which is what lets a runner outside this repo treat the browser engine as one more
command-line engine. ZyQuality had a copy of it that skipped the `checkSource` pass, so a
rejected program printed its diagnostic on **stdout** and exited **0**; the copy is deleted
and `engines.toml` points here. That alone accounted for 14 of the divergences.

Measured 2026-08-12 over the shared corpus of 585 files: **90 files where the browser engine
is the sole outlier**, and that number needs qualifying before anyone acts on it — a good
share are diagnostics the CLI colours and the browser cannot, which is a channel difference,
not a semantic one. Characterising the rest is the next piece of work, and until it is done
the honest statement is "90 differences, most of them probably not bugs", not "90 bugs".

That count used to include ten more. This runner was the *only* suite in the project that
executed `interpreter/tests/scripts/*.zy` — seven benchmarks, a stress test, a timing module
the CLI refuses to run at all, and an orphan nobody referenced. Every one of them printed
elapsed wall time or failed outright, so every one of them was scored as a divergence of the
JavaScript engine. They are `zyquality/bench/` now, outside the corpus, and the ten failures
went with them.

The corpus grows with the Rust engines, so this figure moves when they gain a check the web
Checker has not been given yet — which is what half of those 10 are. Five of them are the
`arity/` tests added on this branch: `zymbol-semantic` now rejects a call whose argument count
is wrong (`call_arity.rs`) and the web Checker has no counterpart, so the playground runs a
program the CLI refuses. Quote this number from a fresh run, not from this line.

Pointed at the example pool (`--dir examples`) it audits every published example the same way:
**208/210 passing, 2 failing**, 6 skipped. A file whose divergence is irreducible declares it
in its own first lines with `// @skip-parity: <reason>` rather than being listed here — the
pool is not this runner's corpus, and duplicating its paths into the skip table would rot.

**Re-measured 2026-08-31 on v0.0.9: zero divergences**, in the corpus and in the pool alike.

```
node tests/test_runner.mjs                → 661 files: 631 agree, 0 diverge
node tests/test_runner.mjs --dir examples → 222 files: 216 agree, 0 diverge
```

The residue is *excused, not divergent*: 30 corpus files and 6 examples that `corpus.toml`
excludes for `zyjs` with a written reason — `std/db` is ODBC, `<\ cmd \>` entropy differs by
design, TUI needs a real TTY — plus the pool's own `@skip-parity` markers.

The gaps this section used to list are closed, each verified on its own rather than inferred
from the total: `arity/` (7 files, three engines, 7 agree — this engine was the last one that
filled a missing argument with `Unit`), `bugs/bug_mm*` (MM-4, MM-9, MM-11 — 12 files, 12
agree), `errors/parser/parent_path_alias.zy` (HLZ-005), `modules_scope/interp_global_const.zy`,
HLZ-KL-001 (`'` inside an identifier, so tlhIngan Hol parses), and the float literal
`3.14159265`, which was the worst of them because it affected *every* float literal and went
unnoticed until the pool became real files on disk.

See [docs/GAPS.md](docs/GAPS.md) for the full parity report.

## Markdown for agents

Every page is published twice: as HTML for people, and as a Markdown twin for agents.
`/install.html` and `/install.md` are the same page; `/llms.txt` is the map an agent starts
from.

Two ways to get the Markdown, and the second one needs no infrastructure at all:

```bash
curl -s https://zymbol-lang.org/install.html -H 'Accept: text/markdown'   # negotiated
curl -s https://zymbol-lang.org/install.md                               # the file itself
```

Negotiation is a Cloudflare Worker (`worker/`), because GitHub Pages serves one body per path
and cannot vary on a request header. It is a thin router: it maps `/x.html` → `/x.md`, serves
the twin when — and only when — the client asked for Markdown ahead of HTML, and otherwise
returns the HTML untouched with `Vary: Accept` and a `Link: …rel="alternate"` header. A page
with no twin is served as HTML; nothing 404s that would otherwise have worked.

The twins are **written, not generated**. A runtime HTML→Markdown conversion would produce a
scrape of the playground's DOM, which describes an application in the least useful way
possible, and nobody would notice the day it broke — the same failure mode as the old inline
example pool. What keeps written twins honest is `tests/test_markdown.mjs`: an HTML page with
no twin fails, and so does a twin that has fallen behind its page on any version string,
release URL or SHA256 digest. **Editing a page means editing its twin in the same commit.**

### Discovery: `Link` headers, and the two files that are deliberately absent

The Worker also attaches RFC 8288 `Link` headers to every page — `alternate` (the twin),
`describedby` (`/llms.txt`), `license` (both texts) — so one `HEAD` request tells an agent
where everything machine-readable is. Registered relation types only, targets asserted to
exist by `tests/test_markdown.mjs`, and ASCII only: header values are ByteStrings, so an em
dash in a `title=` throws.

`/auth.md` states, in the standard place, that there is nothing to authenticate: no accounts,
no keys, no registration, everything anonymous. That is worth publishing precisely because it
is a negative — an agent learns it in one request instead of probing for a sign-up flow.

There is **no `/.well-known/api-catalog`** and no `rel="api-catalog"`. This is a static
documentation site: no endpoint, no OpenAPI description, no service. `examples/catalog.json`
and `data/i18n/*.json` are data files the pages read, not APIs, and declaring them as APIs
would pass an agent-readiness scanner while misleading every agent that believed it. The test
asserts the absence.

### Acting, not just reading: the skill and the browser tools

Two surfaces let an agent *do* something rather than only read about it.

**`/.well-known/agent-skills/index.json`** publishes one skill, `write-zymbol`, whose artifact
is [`SKILL.md`](.well-known/agent-skills/write-zymbol/SKILL.md): the syntax an agent needs, and
first of all the eight mistakes that *parse* and then behave wrong (1-based indices, `>>` not
adding a newline, `??` being pattern matching rather than a condition chain, `==` never
coercing while `>` does). Every `zymbol` block in it is executed by `tests/test_agents.mjs`,
and the index carries the artifact's SHA-256 — edit the skill without regenerating the digest
and CI fails, which is the only thing that keeps a published hash meaningful.

**`src/playground/webmcp.js`** registers five `navigator.modelContext` tools — run source,
read the editor, replace the editor, list examples, open an example — so an agent driving a
browser can use the playground. Feature-detected end to end: where the API is absent (nearly
everywhere, it is a Chrome origin trial) it registers nothing and changes nothing. `zymbol_run`
never touches the editor, and every tool writes to the output panel, so a person watching the
tab sees what the agent did.

What is **not** published, and will not be: OAuth discovery and protected-resource metadata
(no authorization server, nothing protected), Web Bot Auth (this site sends no bot requests),
an A2A agent card (there is no agent), DNS-AID records (nothing to point them at). Those are
four agent-readiness checks that stay red on purpose. Passing them would mean publishing
authentication endpoints that do not exist.

Two Cloudflare dashboard settings silently outrank everything in this repository — a managed
`robots.txt` that disallows the AI crawlers, and edge blocking of AI bots. `worker/README.md`
documents both, and how to tell from a `curl` which `robots.txt` is actually live.

## Deployment

GitHub Pages, served from the repo root of `main` at [zymbol-lang.org](https://zymbol-lang.org).
Every push to `main` deploys automatically — there is no build job, the files are published
exactly as committed.

The Worker is the one thing that does not deploy with a push: it lives at the Cloudflare edge
and ships with `npx wrangler deploy` from `worker/`. The site is fully functional without it —
the `.md` files and `llms.txt` are ordinary static files — so a Worker that is down costs
negotiation, not content.

## Authorship & AI Collaboration

This site and its interactive playground are designed by
**[OscarE.EspinozaB](https://github.com/zymbol-lang/interpreter/commits?author=OscarEEspinozaB)**,
the author of Zymbol-Lang. Content, structure, i18n scope, and playground behavior are defined
and controlled by the author.

The implementation was built using **[Claude Code](https://claude.ai/code)** (Anthropic) as the
engineering team. AI use is transparent — it accelerated delivery under the author's direction;
the design and quality control remain entirely the author's.

## License

© 2024-2026 Zymbol-Lang contributors. Two licenses, split the way the interpreter repository
splits them — see [LICENSE](LICENSE) for the full breakdown:

| What | License |
| ---- | ------- |
| Source code — `src/`, `worker/`, `tests/`, the pages' inline scripts | [AGPL-3.0-only](LICENSE-AGPL-3.0) |
| Manuals, examples, documentation, page prose | [CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0) |

`src/zymbol/zymbol.js` is a hand-written port of the Rust tree-walker, which is AGPL-3.0-only:
it is a derivative work and carries the same license — CC BY-SA was never ours to grant over
it. Every `.js`/`.mjs` file states its own license in an SPDX line, and every
`data/manuals/manual_*.md` carries a CC BY-SA footer, so a file that travels alone still says
what it is.

The playground is AGPL section 13 territory — code executed by users over a network. Its `?`
panel links to the complete corresponding source at
[github.com/zymbol-lang/web](https://github.com/zymbol-lang/web).
