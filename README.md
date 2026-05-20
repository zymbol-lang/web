# Zymbol-Lang — Landing Page

> **Revisado para v0.0.5 — 2026-05-12**

Source for [zymbol-lang.org](https://zymbol-lang.org) — the official website of the Zymbol programming language.

## About

Zymbol is a keyword-free symbolic programming language. Every construct uses pure symbols (`?` for if, `@` for loops, `->` for lambdas, `>>` for output). Identifiers can be written in any human language or script — Unicode, emoji, RTL, CJK, Indic, and more. Numeric output can be displayed in any of 69 Unicode digit scripts (Devanagari, Arabic-Indic, Thai, Klingon pIqaD, …) via numeral modes.

## Structure

```
index.html                    — Main landing page (i18n, 106 languages)
playground.html               — Interactive online editor (multi-file, i18n examples)
main.js                       — UI logic, language switcher, fade transitions
zymbol.js                     — Zymbol interpreter (WASM/JS) for the playground
style.css                     — Styles (light/dark theme)
data/
  i18n.json                   — Translations for all 106 supported languages
assets/                       — Icons and static assets
fonts/                        — Custom font files
examples/                     — Code snippets shown in the landing page
esolangs_zymbol_lang.wiki     — Esolangs.org wiki article source (MediaWiki format)
```

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
