# Zymbol-Lang — Landing Page

Source for [zymbol-lang.org](https://zymbol-lang.org) — the official website of the Zymbol programming language.

## About

Zymbol is a keyword-free symbolic programming language. Every construct uses pure symbols (`?` for if, `@` for loops, `->` for lambdas, `>>` for output). Identifiers can be written in any human language or script — Unicode, emoji, RTL, CJK, Indic, and more.

## Structure

```
index.html        — Main landing page (i18n, 106 languages)
playground.html   — Interactive online editor
main.js           — UI logic, language switcher, fade transitions
zymbol.js         — Zymbol interpreter (WASM/JS) for the playground
style.css         — Styles (light/dark theme)
data/
  i18n.json       — Translations for all 106 supported languages
assets/           — Icons and static assets
fonts/            — Custom font files
examples/         — Code snippets shown in the landing page
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

## License

Website content and source © Zymbol-Lang contributors, licensed under  
[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](LICENSE).
