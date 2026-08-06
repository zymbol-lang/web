# Zymbol

> A keyword-free symbolic programming language. Every construct is a symbol, so
> identifiers can be written in any human language and the code reads the same
> everywhere. Public alpha, v0.0.8.

This is the Markdown representation of <https://zymbol-lang.org/>. Other pages:
[/install.md](install.md), [/playground.md](playground.md),
[/changelog.md](changelog.md), [/piqad-reference.md](piqad-reference.md).
Start from [/llms.txt](llms.txt) for the full map.

## Status

**Public alpha · v0.0.8** (August 2, 2026). Zymbol is in active development — this
release is a concept validation of the language design. APIs, syntax, and features
may change. Source and issues: <https://github.com/zymbol-lang/interpreter>.

## No keywords. Just symbols.

A minimalist programming language. Write identifiers in any human language — the
operators never change.

- **0** keywords
- **∞** Unicode: identifiers in any script, or emoji

There is no `if`, no `while`, no `return`, no `true`. `?` is if, `@` is loop,
`<~` is return, `#1` is true. Nothing in the syntax is an English word, so nothing
has to be translated when you code in Spanish, Japanese, Arabic or Klingon.

## Showcase — FizzBuzz

The landing page renders this program in any of 111 human languages; only the
identifiers change, never the operators. The English variant:

```zymbol
// FizzBuzz — English
// Identifiers in English. Operators always symbolic.

>> "Hello, English-speaking World!" ¶

classify(number) {
    ? number % 15 == 0 { <~ "FizzBuzz" }
    _? number % 3  == 0 { <~ "Fizz" }
    _? number % 5  == 0 { <~ "Buzz" }
    _ { <~ number }
}

@ i:1..15 {
    >> classify(i) ¶
}
```

The same program with Spanish identifiers is the same program: `clasificar`,
`número`, and the operators `? _? _ @ >> <~` untouched.

## Operator reference

These operators never change, regardless of which human language you code in.

| Symbol | Concept | Example |
| --- | --- | --- |
| `=` | variable | `x = 5` |
| `:=` | constant | `PI := 3.14` |
| `>>` | output | `>> value ¶` |
| `<<` | input | `<< "prompt" x` |
| `#1` / `#0` | boolean | true / false |
| `?` | if | `? condition { }` |
| `_?` | else if | else-if branch |
| `_` | else | fallthrough |
| `??` | match | `?? expr { }` |
| `@` | loop | `@ item:list { }` |
| `->` | lambda | `x -> x * 2` |
| `<~` | return | return / output |
| `$#` | length | `arr$#` |
| `$+` | append | `arr$+ val` |
| `$-` | remove | `arr$- val` |
| `!?` / `:!` | try / catch | `!?{ } :!{ }` |
| `¶` | newline | in an output statement |

The complete symbol table lives in `REFERENCE.md` in the interpreter repository.

## Design principles

**No keywords — ever.** Every construct is a symbol. `?` is if, `@` is loop, `<~`
is return. Nothing to translate per language.

**Full Unicode identifiers.** Name variables in Arabic, write functions in
Japanese, use emojis. The operators `? @ >> <~` stay the same.

**Language-agnostic types.** `#1` and `#0` instead of `true` / `false`. No English
words in the type system.

## Documentation

The compact Zymbol-Lang manual is published as Markdown in 110 languages:

- English — [/data/manuals/manual_en.md](data/manuals/manual_en.md)
- Spanish — [/data/manuals/manual_es.md](data/manuals/manual_es.md)
- Any other: `/data/manuals/manual_<ISO 639 code>.md`

The canonical, always-current reference is `GUIDE.md` in the interpreter
repository; the site manuals were last revised for v0.0.5 and lag the interpreter.

Klingon pIqaD script reference: [/piqad-reference.md](piqad-reference.md).

## Links

- Try it in the browser: <https://zymbol-lang.org/playground.html>
- Download and install: <https://zymbol-lang.org/install.html>
- Release history: <https://zymbol-lang.org/changelog.html>
- Interpreter (Rust): <https://github.com/zymbol-lang/interpreter>
- VS Code extension: <https://github.com/zymbol-lang/vscode>
- This site: <https://github.com/zymbol-lang/web>
- News: <https://x.com/ZymbolLang>

License: the interpreter and the browser engine are AGPL-3.0-only; the manuals,
examples and documentation are CC BY-SA 4.0.
