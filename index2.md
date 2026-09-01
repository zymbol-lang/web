# Zymbol — A Notation, Not a Dialect

> Zymbol read as a writing system rather than as a feature list: how its marks
> mean, how they compose into operators, where the system is irregular and says
> so, how a new mark is admitted, and how a game of Go is used to find out what
> the language cannot yet say. Public alpha, v0.0.8.

This is the Markdown representation of <https://zymbol-lang.org/index2.html>, a
**working draft** — an alternative reading of the front page. The front page
itself is [/index.md](index.md). Other pages: [/install.md](install.md),
[/playground.md](playground.md), [/changelog.md](changelog.md),
[/piqad-reference.md](piqad-reference.md). Start from [/llms.txt](llms.txt) for
the full map.

Every claim below was executed against the running language — the tree-walker,
the register VM and the browser engine — rather than recalled from an earlier
edition of the documentation. The terminal frames on the HTML page are captures
of the applications running, not mock-ups.

## A language with no keywords has to supply the meaning of its own marks

```
<<        |        ?
IN      UNIT     IRR
```

"take one unit from the input stream, non-committally" → poll for a keypress,
and do not block if none has arrived.

The usual introduction says that Zymbol has no `if`, no `while`, no `return` and
no `true` — that `?` is if, `@` is loop, `<~` is return. That is accurate, and it
is where most descriptions stop. It is a better place to start.

A keyword carries its meaning in from outside: `while` means what English
already made it mean. A mark carries nothing. If no construct of a grammar may be
a word, then every construct is a mark or a run of marks, and the language owes
an account of what its marks mean and how they join — or the coherence is only
asserted.

`<<|?` is not an arbitrary trigraph that happens to mean "poll for a key". It is
three morphemes, and you can take it apart.

## One — Three ways a mark can mean

The inventory is not uniform. The split decides which parts of the language
teach themselves.

| Mode | How it signifies | Examples |
| --- | --- | --- |
| **Iconic** | the shape resembles the meaning | `>>` `<<` `->` `<~` `\|>` `..` `<>` `><` `##]` `#०९#` |
| **Indexical** | points at a context instead of depicting it | `°` `_` `@:label` `@:label!` |
| **Conventional** | arbitrary; must be learned | `$` `@` `#` `¶` `?` `!` `~` `#1` `#0` |

A reader who has never seen Zymbol will guess `>>` and `->` correctly on sight.
Nobody guesses `$^-`. Every mark in the third row is a memorisation cost the
other two do not impose, which is the argument for keeping that row short rather
than for apologising about it.

`°` says nothing about what a value *is*; it says which scope the binding is
anchored to, and its whole meaning is positional — `x°` dies with the loop, `°x`
outlives it.

Two minimal pairs, offered as evidence that the iconic claim is falsifiable
rather than flattering:

```
>  <          <  >
converging    diverging
= intake at the process boundary    = the two sides differ
= ><  (command-line arguments)      = <>  (not equal)
```

Neither falls out of a slot template. Both are readable as pictures the first
time you see them, and the language chose them for that reason — `<>` over `!=`,
deliberately.

## Two — The shape of an operator

Operators are built, not coined. A mark contributes one meaning, the meanings
compose, and the seams stay visible in the written form. That is what makes the
claim checkable: either you can segment an operator and gloss each segment, or
you cannot, and the ones you cannot are listed by name.

```
[BINDER]   DOMAIN   [OPERATION]   [MODALITY]   [ARGUMENT]
```

| Slot | Filled by | Contributes |
| --- | --- | --- |
| BINDER | `:` | the following domain is bound to a name or a clause |
| **DOMAIN** | `$` `@` `#` `>>` `<<` `?` `!` | *which world the operation lives in* — required |
| OPERATION | `+ - * / ^ ~ # < > \| . ,` | *what is done in that world* |
| MODALITY | `?` `!` | *how certain, how forceful* |
| ARGUMENT | `[i]`, `(n)`, `\|x\|`, a label | the operand |

The modality slot is always last: across the whole inventory there is no
operator in which a modal `?` or `!` is followed by another operation mark. It is
the most reliable structural generalisation in the language, and it is why
labelled break is written `@:outer!` and never `@!outer`.

Worked glosses:

```
$       ^       -            "impose an order on the collection, reversed"
COLL    ORDER   REV          → sort descending

@       :outer  !            "act forcefully on the time-context named outer"
TEMP    LBL     FRC          → break the labelled loop

#       #       !            "cross to the type level, forcefully"
META    TYPE    FRC          → cast to Int, truncating rather than rounding

<<      ##.     (5,2)   "p"     v
IN      TYPE.F  ARG     PROMPT  TARGET
"read inward, constrained to Float with 5 total digits and 2 decimals"
```

### When two principles disagree, the picture wins

```
<#   =  IN + META      import        arrow on the left  — flow enters
#>   =  META + OUT     export        arrow on the right — flow leaves
```

Under the template alone this is an inconsistency. Under a second rule it is
not — *a direction mark sits on the edge of the sign that faces the way it
points* — and the same rule explains `<~`, `->`, `|>`, `=>` and the mirrored
halves of `<\ … \>`. Two principles, and a stated winner, is a more honest
description than one template with an exception attached.

## Three — Where the system is not regular

| Class | Definition | Count | Examples |
| --- | --- | --- | --- |
| **Transparent** | fully segmentable; meaning = composition of the parts | majority | `<<\|?` `$^-` `@:outer!` `##!` `$??` `#.2\|x\|` |
| **Semi-transparent** | segmentable, but the whole means more than the parts | 6 | `!?` `:!` `:>` `\|>` `::` `$++` |
| **Opaque** | not compositional — a single lexical sign | 10 | `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°` |

The six semi-transparent forms, with the part the segments do not predict:

| Form | Segments | Surplus |
| --- | --- | --- |
| `!?` | ERR + IRR | that it opens a *block* whose failure is captured |
| `:!` | BND + ERR | that it binds specifically into `_err` |
| `:>` | BND + OUT | that it runs unconditionally after the block |
| `\|>` | GATE + OUT | that the left value is injected as an *argument* |
| `::` | BND + BND | that the left name is a *module namespace* |
| `$++` | COLL + ADD + PL | that it accepts mixed types and stringifies |

One mark can also be read differently depending on what it attaches to, and the
host — not the reader's judgement — selects. `!` has three readings: negation in
`!flag`, force in `@!` and `>>!`, the error domain in `!?` and `$!`. In `##!` the
`!` truncates; in `$!` it tests for an error; the only thing telling them apart is
`#` versus `$`.

That is *allosemy*, and it is a different thing from a mark carrying two
unrelated meanings — which is a defect and is treated as one. Six such
homographs are on the books as standing debt rather than as features. When `<=`
meant both "less than or equal" and "known as", the second reading was moved to
`=>` and the debt was paid; `<=` is now exclusively comparison.

A document maintained against itself drifts. Checking this one against the
running engines turned up defects in the language it was only supposed to
describe: a label agreement rule nothing enforced, a loop constraint that was
documented and never applied, a parameter slot the grammar said could not be
empty while two engines already ran it empty. **A rule that is written down but
not enforced is not a rule.**

## Four — How a mark is admitted

1. **Derive, do not invent.** A new operator must be explainable as a
   composition of marks already in the inventory. Write the gloss; if every
   segment has one, it is derivable.
2. **One abstract meaning per base mark.** `~` means modification, so a new `~X`
   has to involve transforming something.
3. **Constraints are inherited, not restated.** A new `@` statement acting on the
   time context is invalid outside a loop, and that is not a decision to be
   re-made.
4. **No natural-language words in the grammar.** Not in English, not in any
   language. Identifiers are free; the grammar is marks.
5. **Describe before implementing.** A mark that ships before it is described
   acquires its meaning from whatever the first few uses happen to be, and that
   meaning is very hard to correct afterwards.
6. **No mark carries two unrelated meanings.** If the readings cannot be stated
   as one contract, they are homographs, and a homograph is debt.
7. **Prefer iconic over conventional.** Where two derivable forms exist, take the
   one that depicts.
8. **Modality goes last.** Always.

### What five releases actually added

| Version | Change to the sign system |
| --- | --- |
| v0.0.5 | **One new base mark** — `°`, with two positional readings — plus seven derived operators: `>>!` `>>?` `>>~` `>>\|` `<<\|` `<<\|?` `@~` |
| v0.0.6 | No new mark. `=>` unified as the single "maps to" separator across match arms, import aliases and export renames — retiring the `<=` dual role |
| v0.0.7 | No new mark. Typed input by composition: `<< ##.(5,2)`, `<< ###(4)`, `<< ##"(20)`. Standard library established as modules rather than symbols |
| v0.0.8 | No new mark. `\|\|` extended to match arms; `##!` extended to `Char` → code point. Packaging added with no language surface at all |
| v0.0.9 | No new mark. `->` accepts an empty parameter list. Two enforcement changes with no surface at all |

One genuinely new mark in five versions. Everything else is recombination —
which is what an agglutinative system is *for*: a composition nobody has written
yet already has a meaning, worked out in advance by the marks it is made of.

## Five — The board is the test

Every automated suite takes a program that already exists and asks whether the
implementation handles it correctly. None of them can tell you that the language
cannot express a Go board. A missing capability produces no failing test,
because there is no test — that is what *missing* means.

So the instrument is a whole application, written in a domain that was not
chosen to be easy, as if the language already supported it. Every place it does
not is a finding with an identifier, a reproduction and a status. The cycle does
not close because the game works; it closes when the language has changed.

A workaround counts as a failure. If the program can only say the thing by
leaving the language — a shell call, a hand-written table, a duplicated block —
then the language did not support it, however well the program runs.

```
RED       write the application as if the language supported it; log every incapacity
  ↓
GREEN     change the language — derive the operator, fix the semantics, close the
          engine gap — or reject the finding, with the reason written down
  ↓
REFACTOR  distil it into a minimal program in the corpus with its golden; that is
          the layer that names what broke
  ↓
MIGRATE   the application enters the gate and stays; when the language moves again,
          carry it across — and log what the carrying finds
```

The application says *"something changed in 囲碁"*; the minimal program says
*"the interpolated-string arm is gone"*. Only the second is a diagnosis. But the
first is not thrown away afterwards — eight applications are in the gate, and
they are still finding things.

The HTML page shows four captured frames of two of them running: **囲碁**, a Go
engine written in Japanese (a 361-point structure threaded through cooperating
modules, with a two-column invariant that holds in every theme), and
**Serpiente**, a Spanish arcade game whose panel width is measured rather than
guessed.

### Three defects that needed two features to compose

The worst class is not the crash — it is the silent wrong answer.

- **Output parameters of *module* functions were dropped** under the register VM.
  Module functions worked. Output parameters worked. Together they did not.
- **A `String` was truncated *inside a module*** — correct everywhere else.
- **`"{CONST}"` interpolation compiled to literal text *inside a function*** —
  the braces stayed on the screen.

A Go board is state threaded through cooperating modules. There was nowhere else
for it to live, so it hit all three.

Once the corpus, the goldens and the example pool were all green, running the
same engines over the applications opened nine further findings. The clean one:
the browser engine continued an identifier with ASCII digits only, so
`कार्यस्थितिः२` — a variable in the Sanskrit chess engine — parsed wrongly in the
browser and correctly under both Rust engines. **No file in the corpus is named
that way. No file was going to be.**

## Six — The same program, in another hand

Two different questions get asked at once and usually get conflated. *Can a team
read and write the code in their own language?* and *can the program show its
text to a user in theirs?* They have separate answers, and neither is a
framework.

### The code — re-export layers

Every identifier is a plain Unicode symbol, so a library can be written in the
team's own language and re-exported into anyone else's. The adapter holds no
logic at all, only names.

```zymbol
// matematicas/ελληνικά.zy — an adapter, and nothing else
# .matematicas_ελληνικά {
    <# ./module => mat

    #> {
        mat::sumar       => προσθέτω
        mat::restar      => αφαιρώ
        mat::multiplicar => πολλαπλασιάζω
        mat.PI           => ΠΙ
    }
}
```

It costs nothing at runtime: the layer resolves to direct references when the
module loads. There is no dispatch table and no string lookup, so importing
through a translation is not slower than importing the base.

### The text — a dispatcher holding the locale

A string a user reads is data, not an identifier: `"Play"` and `"Jugar"` are two
values, not one value under two names. So the second mechanism is one module
holding the active locale as module state, and one table per language behind the
same function contract.

```zymbol
// the key is a concept, written in the base language
texto(clave) {
    <~ ?? clave {
        "menú.jugar"    => "Play"
        "menú.salir"    => "Quit"
        "aviso.ocupado" => "there is already a piece there"
        _               => clave
    }
}
```

The last arm is the whole trick. A missing translation renders as its own key,
so completeness becomes *decidable*: walk the catalogue against every locale and
fail on any string that comes back unchanged. That check only works because a
key can never equal a correct translation of itself — which is what the domain
prefix is for. `menú.salir` and `Salir` can never collide.

### One line of code, five ways of writing a square

The Sanskrit chess engine names a square as a Latin file plus a rank, and the
rank comes out in whatever numeral script the locale selected. The same
expression, run five times:

| locale | language | square | move |
| --- | --- | --- | --- |
| `sa` | संस्कृतम् | e४ | e२–e४ |
| `hi` | हिन्दी | e४ | e२–e४ |
| `fa` | فارسی | e۴ | e۲–e۴ |
| `en` | English | e4 | e2–e4 |
| `es` | Español | e4 | e2–e4 |

The numeral script is not a formatting flag threaded through the call graph; it
is a mode the writing system carries, declared by *exhibiting* its own digits —
`#०९#` says "Devanagari" by containing Devanagari. There is no name to translate
and no table to consult. What the script does *not* get to choose is which
separator means what: `,` groups and `.` divides, in every script, always. A
settable pair would make every number ambiguous until you knew the setting it
was written under.

The same opening position, drawn four ways (`शतरञ्जम्`, `चित्रम्`, `अक्षरम्`,
`लातिनम्`), every one of them measuring to the same sixteen columns — which is why
`रा` pads and `🐘` does not:

```
8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜     8 🛞🐎🐘🧙👑🐘🐎🛞    8 र अ ग म राग अ र     8 r n b q k b n r
7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟     7 🚶🚶🚶🚶🚶🚶🚶🚶    7 प प प प प प प प     7 p p p p p p p p
2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙     2 🚶🚶🚶🚶🚶🚶🚶🚶    2 प प प प प प प प     2 P P P P P P P P
1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖     1 🛞🐎🐘🧙👑🐘🐎🛞    1 र अ ग म राग अ र     1 R N B Q K B N R
```

Writing each application in a different natural language — English, Mandarin,
Spanish, Klingon pIqaD, Japanese, Sanskrit — was not a flourish. It is what
turned "language-neutral" from a design intention into a result, and it is how
the double-width glyph, the pIqaD interpolation and the numeral-mode defects
were found at all. In the Klingon game, exported names, parameters, match arms
and strings are all in the Klingon Private Use Area, and none of them is a
special case anywhere in the lexer. See
[/piqad-reference.md](piqad-reference.md).

## Seven — What follows from it

- **0 — nothing to translate.** Control flow, I/O, typing, module structure,
  collection operations and error handling are marks from a closed inventory of
  29 characters, and that inventory contains no letters.
- **3 — three engines, one answer.** A tree-walker, a register VM and a
  hand-written browser interpreter are graded on the same corpus, and
  disagreement is the failure condition. Today: 655 of 661 programs answered
  identically by all three, zero divergences, the remaining six excused in
  writing with a reason attached.
- **36 — refusal is tested too.** A separate corpus of malformed programs every
  engine must reject. Thirty-four of thirty-six are refused everywhere; the two
  that are not are open, named, and the reason each is still red is written down.
  A gate that only tests acceptance is half a gate.
- **8 — the instruments stay in service.** Eight applications across seven
  releases, in six natural languages — English, Mandarin, Spanish, Klingon,
  Japanese, Sanskrit — and in domains chosen to be far apart: a CLI over an HTTP
  service, a TUI arcade game, scientific computing, a Go engine, an accounting
  ledger. They are carried across every breaking change, and the carrying keeps
  finding things.
- **° — growth is recombination.** One new base mark in five versions.
- **¶ — the irregularities are published.** Six declared homographs, ten opaque
  signs, one grapheme that is not in the operator class and survives by an
  exception.

None of this makes the syntax familiar, and it is not meant to. It makes it
*accountable*: every mark has a gloss, every operator has a segmentation or an
entry saying why it has none, every rule has something that enforces it.

## Links

- Run it in the browser: <https://zymbol-lang.org/playground.html>
- The front page: <https://zymbol-lang.org/>
- Download and install: <https://zymbol-lang.org/install.html>
- Release history: <https://zymbol-lang.org/changelog.html>
- The sign system in full (`SYMBOLS.md`), the validation method (`LDV.md`) and
  the two i18n mechanisms (`I18N.md`) live in the interpreter repository:
  <https://github.com/zymbol-lang/interpreter>

License: the interpreter and the browser engine are AGPL-3.0-only; the manuals,
examples and documentation are CC BY-SA 4.0.
