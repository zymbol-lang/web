# Zymbol Playground

> Run Zymbol in the browser — editor, file explorer, output pane and TUI canvas,
> no install. The interactive page is <https://zymbol-lang.org/playground.html>;
> this Markdown twin documents what it is and what it can do, because the
> playground is an application, not a document.

The playground runs `zymbol.js` (v0.0.8), a hand-written JavaScript mirror of the
Zymbol tree-walker — **not** the Rust engine compiled for the browser. It tracks
the native interpreter closely enough to run real programs, including multi-file
`.zyp` packages, but for the full language use the [native
interpreter](install.md).

## Not available here

- **`std/db`** — database access goes through an ODBC driver manager, which has no
  browser equivalent. Importing it fails with a message saying so.
- **`</ file.zy />`** — script inclusion reads from a real filesystem.
- **`<\ cmd \>`** — there is no shell. `date` format specifiers (`%Y %m %d %H %M
  %S %s`) and a plain `echo` are simulated; anything else returns a
  high-resolution timestamp, which is what most programs use it for: a random seed.

## Works, but not the way it does natively

- **`std/io`** — the whole API works against an in-memory filesystem built fresh
  for each run. Nothing touches your disk, and nothing survives the next ▶ Run.
- **`std/net`** — `get` / `post` / `post_json` / `head` run over `fetch()`, so the
  browser's CORS rules apply: a server that sends no CORS headers is unreachable
  from here even though the same program works from the CLI.
- A run stops after 50 000 statements or 32 KB of output, so a runaway loop cannot
  freeze the tab. A loaded `.zyp` package runs at 2 000 000 of each instead: it is a
  real multi-file program, not the single-statement snippet those defaults were sized
  for. Statements inside a `>>|` block count against neither — a TUI program is
  interactive and legitimately long-running — and on leaving the block the count
  returns to what it was on entry, so the budget outside is neither consumed by the
  block nor reset by it.
- Float literals lose precision — `3.14159265` prints as `3.1415926499999998`.
  Known gap, not present in the native engines.

## Fully supported

- `std/math`, `std/random`, `std/json`, `std/term`.
- Line numbers down the left of the editor. Every diagnostic names a line — the
  problems strip says "line 6", a failed run prints `Line 6:` into the output — and
  the numbers a message points at are tinted red for an error and amber for a
  warning, so the line the message means can be found without counting.
- Static checking, on its own button and while you type. **✓ Check** lists problems
  in a strip under the editor and tints the lines they point at, without running
  anything; the same check runs about 600 ms after you stop typing. The strip
  survives ▶ Run, which clears the output panel.
  - Errors always show. Warnings — unused variables, ambiguous lifetimes — are
    behind a **Show warnings** switch that starts off and is remembered. That is a
    measurement, not a preference: `zymbol check` raises an ambiguous-lifetime
    warning for the iterator of any top-level counted loop (deliberately, see the
    interpreter's CHANGELOG, GAP-003), and that one rule fires on 122 of the 216
    programs in `examples/`.
  - This is the browser checker, not the Rust one. On that same corpus the two
    agree exactly — same severity, same line — on **211 of 216 files**. The five
    that differ are unused-variable false positives this checker raises and the
    real tool does not. `tests/test_check.mjs` holds that number against
    regression.
- Hover help over the editor. Resting on a symbol gives its concept, a one-line
  summary and a worked example that is verified to compile; resting on a name gives
  what the program on screen defined it as — `PI := 3.14159` reads as
  *constant · Float · 3.14159*.
  - A type and a value are only shown when the definition's right-hand side is a
    literal. A name bound to a call is reported as a constant or a variable and
    nothing more, rather than guessing.
  - Names are resolved without column information — the browser lexer records lines
    only — so the card shows the nearest definition at or above the hovered line.
    Under deliberate shadowing that can be the wrong one.
  - Type names (`Int`, `Float`, `Text`) are the engine's own in every language, so
    that a card agrees with what `#?` prints.
- An interface language picker in the header, sharing its choice with the home page
  (both read `zy-lang`). Two languages — English and Spanish — are fully
  translated. In any other, the interface stays English and every symbol card
  carries that language's own word for the concept, drawn from the same 16 terms
  the home page translates into 111 languages: `?` is labelled もし in Japanese,
  *si* in Spanish, *hoặc* in Vietnamese.
- CLI arguments `>< args` — use the `args…` field next to ▶ Run.
- TUI mode (`>>|`) on a canvas renderer. On a touch device: swipe for the arrow
  keys, tap for Enter, ⌨ Keys for any other single key — `p` to pass in GO, `q` to
  quit, digits. ✕ Stop exits.

## Deep links

Every example in the pool is addressable, and the playground rewrites the address
bar to the shareable form:

- `playground.html?open=<path under examples/>` — e.g.
  [`?open=games/classic/go.zyp`](playground.html?open=games/classic/go.zyp)
  (mounts the package and opens its default script),
  `?open=games/classic/go/核/盤.zy` (mounts the package, opens that one file),
  `?open=rosetta-stone/Klingon_pIqaD.zy`.
- `playground.html?example=<catalog id>` — the older form, still resolved.

Loading a `.zyp` mounts the archive's whole source tree — visible in the sidebar
and to the module resolver — but opens a single tab, the package's default
`[[script]]`; the manifest's other scripts appear in the picker next to ▶ Run.

▶ Run always executes the tab you are looking at. The picker is a shortcut that
opens a script's tab, so switching tabs switches what runs — a package can never
keep the Run button pointed at a file you closed or moved away from.

## Examples

Every example is a real file under `examples/`, indexed by `examples/catalog.json`
and audited on every change by `zymbol check` and a CLI-vs-browser parity run. The
groups, in sidebar order:

| Group | Categories |
| --- | --- |
| 🎮 Games | arcade, classic |
| Basics | tour, output, input, variables, control, match, loops |
| Data | collections, destructuring |
| Functions | functions, lambdas |
| Errors | errors |
| Multilingual | numerals, rosetta (the same program in 105 human languages) |
| 🧪 Demos | projects, tui, cli, shell |

## Agent tools (WebMCP)

Where the browser supports `navigator.modelContext` (a Chrome origin trial), the
playground registers five tools so an agent can operate it rather than only read
about it: `zymbol_run` (execute source, return the real output and the real
error), `zymbol_get_editor`, `zymbol_set_editor`, `zymbol_list_examples` and
`zymbol_open_example`. `zymbol_run` never modifies the editor, and every call
writes to the output panel, so a person watching the tab sees what happened.
Where the API is absent nothing is registered and nothing changes.

To write Zymbol correctly first, load the published skill:
<https://zymbol-lang.org/.well-known/agent-skills/write-zymbol/SKILL.md>

## Source and license

`zymbol.js` is free software under **AGPL-3.0-only**, like the Rust interpreter it
mirrors — it is a derivative work of it. The complete corresponding source of
everything running in the playground tab is at
<https://github.com/zymbol-lang/web>, which is what AGPL section 13 asks of code
executed over a network. The manuals and examples are CC BY-SA 4.0.

## Keyboard

- **Ctrl+Enter** or ▶ Run — execute the open file.
- **Ctrl+Shift+Enter** or ✓ Check — look for problems without running.
- ✕ Stop — interrupt a TUI program.

Related: [/index.md](index.md) · [/install.md](install.md) · [/llms.txt](llms.txt)
