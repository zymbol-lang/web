<p align="center">
  <img src="assets/img/logo.png" alt="Zymbol-Lang" width="180"/>
</p>

<h1 align="center">Zymbol-Lang — Website &amp; Playground</h1>

<p align="center">
  Source for <a href="https://zymbol-lang.org">zymbol-lang.org</a> — the official site of the<br/>
  keyword-free symbolic language, and the playground that runs it in the browser.
</p>

<p align="center">
  <img alt="version v0.0.8" src="https://img.shields.io/badge/version-v0.0.8-informational?style=flat-square"/>
  <img alt="build: none by design" src="https://img.shields.io/badge/build-none%20by%20design-success?style=flat-square"/>
  <img alt="license CC-BY-SA-4.0" src="https://img.shields.io/badge/license-CC--BY--SA--4.0-blue?style=flat-square"/>
  <a href="https://zymbol-lang.org/playground.html"><img alt="Open the playground" src="https://img.shields.io/badge/▶-playground-7c3aed?style=flat-square"/></a>
</p>

---

> **Staged for v0.0.8 — 2026-08-01**
>
> `index.html`, `install.html` and `changelog.html` are already bumped to **v0.0.8**, with
> `pending` in place of the SHA256 hashes. Those download URLs point at a GitHub release
> that does not exist yet, so **they 404 until the `v0.0.8` tag is cut**.
>
> **Merge this branch to `main` only after the release assets are published**, and fill in
> the hashes in the same change. `main` is what GitHub Pages serves; merging early puts
> broken download links on the live site.

Source for [zymbol-lang.org](https://zymbol-lang.org) — the official website of the Zymbol
programming language, including the in-browser playground that runs Zymbol without a server.

Zymbol is a keyword-free symbolic programming language: every construct uses pure symbols
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
├── CNAME  favicon.ico         GitHub Pages domain + root favicon
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
│   │   └── highlight.js       Syntax highlighter (esc, highlightCode)
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
│   └── packages/              go.zyp, serpiente.zyp, klingon_galaxy.zyp
│
├── tests/
│   ├── test_runner.mjs        Parity: zymbol CLI vs the JS engine
│   ├── test_catalog.mjs       catalog.json ↔ examples/ integrity (dead refs, orphans)
│   ├── test_filestore.mjs     The mounted-vs-open file model and its persistence
│   ├── test_zyp.mjs           .zyp reader + module resolver (builds its own fixtures)
│   ├── test_manual.mjs        Smoke-runs every ```zymbol block in manual_en.md
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
| `{ "zyp": "packages/go.zyp" }` | a packaged program, read by the same `zyp.js` as ↑ Upload |

Optional keys: `desc`, `tags` (extra filter terms — this is how `Ελληνικά` is findable by
typing `greek`), `args` (pre-fills the args… field) and `needs` (`tui`, `input`, `args`,
`shell`, `net` — the capability badges in the tree).

Adding an example is: drop the `.zy` in the right directory, add one entry to
`catalog.json`, run `node tests/test_catalog.mjs --check`. The test fails on a dead reference
**and** on an orphan — a `.zy` under `examples/` that no entry points at is dead weight
shipped to every visitor, which is exactly how the old pool rotted.

`playground.html?example=<id>` mounts and opens one entry directly, so docs, the course and
the landing page can link to a specific example.

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

The playground loads a Zymbol Package directly — from `examples/packages/` through the sidebar
or from disk through ↑ Upload. Its source tree is **mounted**, not opened: every file appears in
the explorer and is visible to the module resolver, one tab opens (the default `[[script]]`),
and the manifest's scripts populate the picker next to ▶ Run. Mounted names are namespaced by
the archive (`packages/go/核/盤.zy`), so two packages that both ship a `texto.zy` can be
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

## Testing

Plain Node, no install step. Run from this directory:

```bash
node tests/test_zyp.mjs               # .zyp reader + module resolver — builds its own fixtures
node tests/test_filestore.mjs         # mounted-vs-open file model + persistence
node tests/test_catalog.mjs [--check] # catalog.json ↔ examples/ (--check also compiles every .zy)
node tests/test_runner.mjs            # parity: zymbol CLI vs the JS engine
node tests/test_runner.mjs --dir examples   # …over the example pool
node tests/test_manual.mjs            # smoke-runs every code block in manual_en.md
```

Two tests need a browser and therefore live as pages, opened over `node tests/serve.mjs`:
`tests/tui-gestures.html` (swipe → arrow key on the TUI canvas; self-checking, it prints its
own pass/fail and sets the document title) and `tests/piqad-font.html` (visual).

Use `node tests/serve.mjs [port]` rather than `python3 -m http.server` when testing from a
phone or tablet. `http.server` sends `Last-Modified` and no `Cache-Control`, so a browser
applies heuristic freshness and stops revalidating — which is invisible until a module is
renamed or deleted, at which point a stale cached `playground.js` imports a file that 404s and
the whole ES module graph fails silently. `serve.mjs` sends `no-store` on everything.

`test_runner.mjs` runs the Rust test corpus (`../interpreter/tests/`) through both engines and
diffs the output — it needs the `zymbol` CLI on `PATH`. Current: **513/518 passing**, 39
skipped (irreducible in a browser: BashExec, ANSI/TUI, `std/db`, step limits).

Pointed at the example pool (`--dir examples`) it audits every published example the same way:
**206/208 passing**, 6 skipped. A file whose divergence is irreducible declares it in its own
first lines with `// @skip-parity: <reason>` rather than being listed here — the pool is not
this runner's corpus, and duplicating its paths into the skip table would rot.

The 2 pool failures are parity gaps in `zymbol.js`, and the pool is what surfaced them:
`projects/math-es/calculadora.zy` (the float literal `3.14159265` prints as
`3.1415926499999998`) and `rosetta-stone/klingon.zy` (the JS lexer treats the `'` in the
Klingon identifier `mI'` as a char literal, so the file does not parse).

The 5 failures are **known parity gaps in the JS mirror**, not regressions — v0.0.8 fixes
that have not been ported yet:

| Test | Missing in `zymbol.js` |
| ---- | ---------------------- |
| `bugs/bug_mm11_iterator_leftover.zy` | MM-11 — leftover loop-iterator value |
| `bugs/bug_mm4_module_const_guard.zy` | MM-4 — import-time semantic gate (constant reassignment in a module is not reported) |
| `bugs/bug_mm9_const_call_depth.zy` | MM-9 — root-scope constants at call depth ≥ 2 |
| `errors/parser/parent_path_alias.zy` | HLZ-005 — the `'./../' is not a module path` diagnostic (the JS mirror errors, but with different text) |
| `modules_scope/interp_global_const.zy` | Interpolation of any identifier, including global constants (`"{DIR}"`) |

See [docs/GAPS.md](docs/GAPS.md) for the full parity report.

## Deployment

GitHub Pages, served from the repo root of `main` at [zymbol-lang.org](https://zymbol-lang.org).
Every push to `main` deploys automatically — there is no build job, the files are published
exactly as committed.

## Authorship & AI Collaboration

This site and its interactive playground are designed by
**[OscarE.EspinozaB](https://github.com/zymbol-lang/interpreter/commits?author=OscarEEspinozaB)**,
the author of Zymbol-Lang. Content, structure, i18n scope, and playground behavior are defined
and controlled by the author.

The implementation was built using **[Claude Code](https://claude.ai/code)** (Anthropic) as the
engineering team. AI use is transparent — it accelerated delivery under the author's direction;
the design and quality control remain entirely the author's.

## License

Website content and source © Zymbol-Lang contributors, licensed under
[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](LICENSE).
