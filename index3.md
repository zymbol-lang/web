# Zymbol — No Words, Just Symbols

> Not *no keywords* — **no words**: nothing in Zymbol's grammar is a word, in any
> language. A minimalist symbolic language of fourteen marks, one meaning each,
> agglutinating into every operator — so identifiers can be written in any human
> language while the operators never change. This page teaches the marks one at a
> time, shows the rules by which they join, and then hands you a fractal written
> entirely in symbols. A shorter, more visual reading of
> <https://zymbol-lang.org/>.

This is the Markdown representation of <https://zymbol-lang.org/index3.html>.
Other pages: [/index.md](index.md), [/index2.md](index2.md),
[/install.md](install.md), [/playground.md](playground.md),
[/changelog.md](changelog.md), [/piqad-reference.md](piqad-reference.md). Start
from [/llms.txt](llms.txt) for the full map.

## No words. Just symbols.

Not ~~no keywords~~ — **no words**.
Nothing in the grammar is a word in any language.

A minimalist symbolic language: fourteen marks, one meaning each, and they
**agglutinate** into everything else.

Identifiers in any human language.
Symbols never change.

### The readings are concepts, not other languages' keywords

`?` is not *if*. *If* is the word English picked for the idea; the idea is a
**condition** — the outcome hangs on a question that may come back false, empty
or nothing (`SYMBOLS.md` §8.7 calls the domain *irrealis*). The same applies down
the column: `@` heads the **time** context rather than being a *loop*, and `_`
**binds no name** rather than being an *else* (§9.3, *non-binding*). Glossing a
mark with the keyword some other language chose for it would put the words
straight back in — which is the whole thing the language is avoiding.

Where a reading does match a familiar word it is because the word describes what
happens, not because a language reserved it: `>>` is **out** and `<<` is **in**
because that is the direction the data travels.

### Why "no words" and not "no keywords"

"No keywords" is the easier claim and it is only nearly true. *Keyword* is a
tokenizer's word for a reserved token, not for a word in a language — and by that
meaning Zymbol has plenty. Its own language server files `?`, `@` and `<~` under
`KEYWORD`, because LSP offers no other semantic-token slot for them
(`crates/zymbol-analyzer/src/semantic_tokens.rs`, under the comment "Control flow
keywords").

The exact claim is the one `SYMBOLS.md` states: **no construct of the grammar is
a word.** Control flow, I/O, typing, module structure, collection operations and
error handling are marks from a closed inventory of 29 characters, and that
inventory contains no letters. That is checkable; "no keywords" is a slogan that
depends on which sense of the term you take.

Current release: **v0.0.8** (public alpha) — Linux, Windows, macOS.
Download and install: <https://zymbol-lang.org/install.html>

## 01 — The marks

Each one means one thing.

| Mark | Reads as | In use |
| --- | --- | --- |
| `=` | bind | `name = 5` |
| `>>` | out | `>> "hi"` |
| `<<` | in | `<< "name?" who` |
| `¶` | newline | `>> "hi" ¶` |
| `?` | condition | `? n > 0 { … }` |
| `_` | binds nothing | `_ { … }` |
| `@` | time | `@ x : list { … }` |
| `..` | range | `1..10` |
| `<~` | give back | `<~ n * 2` |
| `->` | goes to | `x -> x * 2` |
| `$` | collection | never alone — it heads the collection family |
| `#` | meta | `#1` `#0` |
| `!` | force | `@!` |
| `\|` | one | `<<\|` — one key, not a line |

## 02 — They join

Agglutination, in the plain linguistic sense: one mark, one meaning, and the
meanings stack. An operator is *spelled*, not coined.

| Spelled from | Operator | Means |
| --- | --- | --- |
| `$` + `#` | `$#` | how many |
| `$` + `+` | `$+` | append |
| `$` + `^` + `-` | `$^-` | sort, descending |
| `>>` + `!` | `>>!` | wipe the screen |
| `<<` + `\|` + `?` | `<<\|?` | one key, if there is one |

Five releases. **One** new mark. Everything else was spelled from the ones
already here. The long version of why — the sign system, where it is irregular,
and how a Go board is used to find what the language cannot say — is
[/index2.md](index2.md).

## 03 — Now read this

Every mark below is one you have already met, and not one word appears in any of
it. The colours are the program's own: it picks an ANSI-256 index per escape step
and writes each cell with `>>~` on the canvas `>>|` opens. The tree-walker and the
register VM draw it identically, cell for cell.

```zymbol
// Outside the set: faint to solid, dark green to bright.
trazo  = " .:-=+*#%"
tintes = [22, 28, 34, 40, 46, 82, 118, 154, 191]

// Steps survived before the orbit runs away; 0 if it never does.
// zr2 and zi2 are carried, so each step costs four products, not six.
fuga(cr, ci) {
    zr  = 0.0
    zi  = 0.0
    zr2 = 0.0
    zi2 = 0.0
    @ i:1..36 {
        ? zr2 + zi2 > 4.0 { <~ i }
        zi  = 2.0 * zr * zi + ci
        zr  = zr2 - zi2 + cr
        zr2 = zr * zr
        zi2 = zi * zi
    }
    <~ 0
}

>>| {
    >>!
    (alto, ancho) = >>?
    filas = alto - 2
    cols  = ancho - 1

    // A cell is ~2.5x taller than wide; the vertical span is
    // scaled by that so the set comes out round.
    anchura = 2.7
    altura  = filas * anchura * 2.5 / cols
    medio   = filas / 2 + 1

    @ y:1..medio {
        espejo = filas + 1 - y
        @ x:1..cols {
            cr = (x - 1) * anchura / cols - 2.1
            ci = (y - 1) * altura  / filas - altura / 2.0
            n  = fuga(cr, ci)
            marca = "@"
            tinte = 231
            ? n <> 0 {
                paso = n / 4 + 1
                ? paso > 9 { paso = 9 }
                marca = trazo[paso]
                tinte = tintes[paso]
            }
            >>~ (y, x, 0, tinte) > marca
            ? espejo > medio { >>~ (espejo, x, 0, tinte) > marca }
        }
    }

    >>~ (alto, 2, 0, 244) > "any key to leave"
    <<| _tecla
}
```

The picture fills whatever terminal it finds — the program asks with `>>?` and
lays itself out from the answer. Two economies pay for the resolution: the
squares are carried between iterations instead of being recomputed (four
products a step instead of six), and the set is mirrored about the real axis, so
only the top half is ever escaped. Run it in the browser:
<https://zymbol-lang.org/playground.html?open=graphics/mandelbrot.zy>

## 04 — And people build with it

Same marks. The names are whatever the author thinks in. The HTML page shows a
capture of each program running.

The page shows two frames of each: the opening screen where the game is set
up, and the game itself in progress.

| Program | Written in | Play it |
| --- | --- | --- |
| 囲碁 — Go, 9×9 to 19×19, with scoring and an opponent | Japanese | <https://zymbol-lang.org/playground.html?open=games/classic/go.zyp> |
| Serpiente — Snake, five speeds, two languages | Spanish | <https://zymbol-lang.org/playground.html?open=games/arcade/serpiente.zyp> |
| चतुरङ्गम् — Chaturanga, historical rules, alpha-beta search | Sanskrit | <https://zymbol-lang.org/playground.html?open=games/classic/chaturanga.zyp> |
| Hov veS — Klingon Galaxy | Klingon pIqaD | <https://zymbol-lang.org/playground.html?open=games/arcade/klingon_galaxy.zyp> |

Not one identifier in any of them is an English word, and nothing in the grammar
had to change for that.

## Links

- Run it in the browser: <https://zymbol-lang.org/playground.html>
- The full front page: <https://zymbol-lang.org/>
- The long form of this argument: <https://zymbol-lang.org/index2.md>
- Download and install: <https://zymbol-lang.org/install.html>
- Interpreter (Rust): <https://github.com/zymbol-lang/interpreter>

License: the interpreter and the browser engine are AGPL-3.0-only; the manuals,
examples and documentation are CC BY-SA 4.0.
