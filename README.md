# Zymbol-Lang — Landing Page

> **Revisado para v0.0.8 — 2026-07-29**
>
> The published download links (`index.html`, `install.html`, `changelog.html`) still point
> at the **v0.0.7** GitHub release, which is correct: v0.0.8 is not cut yet. Bump them in
> the same change that tags the release, not before — the links would 404.

Source for [zymbol-lang.org](https://zymbol-lang.org) — the official website of the Zymbol programming language.

## About

Zymbol is a keyword-free symbolic programming language. Every construct uses pure symbols (`?` for if, `@` for loops, `->` for lambdas, `>>` for output). Identifiers can be written in any human language or script — Unicode, emoji, RTL, CJK, Indic, and more. Numeric output can be displayed in any of 69 Unicode digit scripts (Devanagari, Arabic-Indic, Thai, Klingon pIqaD, …) via numeral modes.

## Structure

```
index.html                    — Main landing page (i18n, 106 languages)
playground.html               — Interactive online editor (multi-file, i18n examples)
main.js                       — UI logic, language switcher, fade transitions
zymbol.js                     — Zymbol interpreter (hand-maintained JS mirror of the Rust tree-walker)
zyp.js                        — .zyp package reader (ZIP central directory + DecompressionStream)
module-resolver.js            — Path-normalizing module resolver (mirrors ModulePath::resolve_from)
style.css                     — Styles (light/dark theme)
data/
  i18n.json                   — Translations for all 106 supported languages
assets/                       — Icons and static assets
fonts/                        — Custom font files
examples/                     — Code snippets shown in the landing page
esolangs_zymbol_lang.wiki     — Esolangs.org wiki article source (MediaWiki format)
test_zyp.mjs                  — Tests: .zyp reader + module resolver (builds its own fixtures)
test_runner.mjs               — Tests: parity between the zymbol CLI and the JS interpreter
```

### `.zyp` support (v0.0.8)

The playground loads a Zymbol Package directly: one editor tab per source file, named by
full relative path (e.g. `核/盤.zy`), plus a script picker populated from the manifest.

`zyp.js` reads the ZIP by hand — central directory walk, then
`DecompressionStream('deflate-raw')` for deflated entries — so the playground keeps its
zero-dependency, no-build-step stance. It reads `zyp.json`, never `zyp.toml`: parsing TOML
in the browser would mean either a CDN dependency or a hand-rolled parser that could
silently diverge from the Rust `toml` crate on comments, escapes or multi-line strings. The
Rust writer emits `zyp.json` specifically so this file never has to.

Only Stored (0) and Deflate (8) compression are supported — the only two the writer
produces. `DecompressionStream` needs Chrome 103+, Firefox 113+, or Safari 16.4+; there is
no fallback.

`module-resolver.js` was factored out of `playground.js` so it can be tested without a DOM.
It replaced a resolver that collapsed every import to its basename, which silently collided
same-named modules in different directories and never returned `resolvedPath` — so
`zymbol.js`'s module cache and circular-import detection treated one file imported via two
different relative paths as two distinct modules, loading and running it twice.

## Testing

Plain Node, no `npm install` — there is no `package.json`:

```bash
node test_zyp.mjs      # .zyp reader + module resolver — builds its own fixtures
node test_runner.mjs   # parity: zymbol CLI vs the JS interpreter
```

`test_runner.mjs` runs the Rust test corpus (`interpreter/tests/`) through both engines and
diffs the output. Current: **513/518 passing**, 39 skipped (irreducible in a browser:
BashExec, ANSI/TUI, `std/db`, step limits).

The 5 failures are **known parity gaps in the JS mirror**, not regressions — v0.0.8 fixes
that have not been ported yet:

| Test | Missing in `zymbol.js` |
|------|------------------------|
| `bugs/bug_mm11_iterator_leftover.zy` | MM-11 — leftover loop-iterator value |
| `bugs/bug_mm4_module_const_guard.zy` | MM-4 — import-time semantic gate (constant reassignment in a module is not reported) |
| `bugs/bug_mm9_const_call_depth.zy` | MM-9 — root-scope constants at call depth ≥ 2 |
| `errors/parser/parent_path_alias.zy` | HLZ-005 — the `'./../' is not a module path` diagnostic (the JS mirror errors, but with different text) |
| `modules_scope/interp_global_const.zy` | Interpolation of any identifier, including global constants (`"{DIR}"`) |

## Development

No build step — pure static HTML/CSS/JS. Open `index.html` directly in a browser or serve locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deployment

Deployed via GitHub Pages at [zymbol-lang.org](https://zymbol-lang.org). Every push to `main` triggers automatic deployment.

## Authorship & AI Collaboration

This site and its interactive playground are designed by **[OscarE.EspinozaB](https://github.com/zymbol-lang/interpreter/commits?author=OscarEEspinozaB)**, the author of Zymbol-Lang. Content, structure, i18n scope, and playground behavior are defined and controlled by the author.

The implementation was built using **[Claude Code](https://claude.ai/code)** (Anthropic) as the engineering team. AI use is transparent — it accelerated delivery under the author's direction; the design and quality control remain entirely the author's.

## License

Website content and source © Zymbol-Lang contributors, licensed under  
[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](LICENSE).
