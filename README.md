# Zymbol-Lang — Website & Playground

> **Reviewed for v0.0.8 — 2026-07-29**
>
> The published download links (`index.html`, `install.html`, `changelog.html`) still point
> at the **v0.0.7** GitHub release, which is correct: v0.0.8 is not cut yet. Bump them in
> the same change that tags the release, not before — the links would 404.

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
│   │   ├── playground.js      Editor, tabs, run loop, .zyp loading
│   │   ├── examples.js        Bundled example programs, grouped by category
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
├── examples/
│   ├── snippets/              Feature smoke-test programs (.zy)
│   └── rosetta-stone/         The same program in 107 human languages (.zy)
│
├── tests/
│   ├── test_runner.mjs        Parity: zymbol CLI vs the JS engine
│   ├── test_zyp.mjs           .zyp reader + module resolver (builds its own fixtures)
│   ├── test_manual.mjs        Smoke-runs every ```zymbol block in manual_en.md
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

The playground loads a Zymbol Package directly: one editor tab per source file, named by full
relative path (e.g. `核/盤.zy`), plus a script picker populated from the manifest.

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
node tests/test_zyp.mjs      # .zyp reader + module resolver — builds its own fixtures
node tests/test_runner.mjs   # parity: zymbol CLI vs the JS engine
node tests/test_manual.mjs   # smoke-runs every code block in manual_en.md
```

`test_runner.mjs` runs the Rust test corpus (`../interpreter/tests/`) through both engines and
diffs the output — it needs the `zymbol` CLI on `PATH`. Current: **513/518 passing**, 39
skipped (irreducible in a browser: BashExec, ANSI/TUI, `std/db`, step limits).

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
