# Zymbol releases

> Public releases of Zymbol-Lang, newest first. Each version is a concept
> milestone — APIs, syntax, and features may change during the alpha phase.

This is the Markdown representation of <https://zymbol-lang.org/changelog.html>.
Downloads for the current release: [/install.md](install.md).

## v0.0.8 — August 2, 2026 (latest)

**Zymbol Packages, Auto-Free Memory & Terminal Metrics**

### Added

- **Zymbol Packages (`.zyp`) — one file for a multi-file program** — `zymbol package
  DIR --script main.zy -o out.zyp` walks the transitive closure of module imports and
  `</ file.zy />` targets and zips it; `zymbol run out.zyp` extracts to an ephemeral
  temp dir and never `chdir`s, so the code is disposable but whatever the script writes
  still lands in your real working directory. A `.zyp` is an archive of *source*, not a
  compiled binary — unrelated to `zymbol build`
- **Automatic destruction at last use — both engines, always on** — memory is released
  right after the statement that last uses a variable instead of at scope end. Invisible
  by design: it never changes a correct program's behavior, it only lowers peak memory
  (a script holding two sequential 30 MB strings peaks at ~64 MB instead of ~94 MB in
  the tree-walker)
- **`std/term` — terminal display metrics** — `width`, `pad_left`, `pad_right`,
  `center`, `truncate`, measured in *terminal columns* rather than grapheme count:
  `"手番"$#` is `2` but `term::width("手番")` is `4`. Padding never splits a wide glyph
- **Match or-patterns** — an arm's pattern can be a `||`-separated chain tested left
  to right: `'p' || 'P' => { … }`. Alternatives mix any pattern kind — `1..10 ||
  20..30`, `< 0 || > 100`, `["run", _] || ["build", _]`
- **`##!` on a `Char` yields its Unicode code point** — `##!'A'` is `65`, `##!'あ'` is
  `12354`. The only direct Char→Int route, which makes characters classifiable by range
- **Juxtaposition works inside delimiters** — `f(a " " b)`, `[a " " b]` and `(a " "
  b)` now parse; implicit concatenation used to stop at statement level, so every
  composed string handed to a function needed an intermediate variable
- **Rebuilt playground** — a VS Code-style file explorer, symmetric panel collapse, a
  layout toggle and a theme-aware TUI. Loading a `.zyp` *mounts* its whole source tree
  (visible in the sidebar and to the module resolver) but opens a single tab — the
  package's default script — with the rest of the manifest's scripts in the picker next
  to ▶ Run. The ZIP is read in the browser with no bundler and no CDN
- **Every example is now a real file** — the ~1000 lines of programs baked into a JS
  module were replaced by an indexed pool of `.zy` files and `.zyp` archives. No tool
  could reach the old ones, so four had been broken since v0.0.6 and nothing noticed;
  migrating them exposed 19 more that no longer compiled. The pool is audited on every
  change by `zymbol check` and a CLI-vs-browser parity run

### Changed

- **One shared module-path resolution rule** — the tree-walker, the semantic analyzer
  and the VM compiler now all resolve imports through `ModulePath::resolve_from`. An
  absolute import used to resolve to a different file under `--vm` than under the
  tree-walker
- **`zymbol check` checks the whole program** — it followed no imports, so a module
  that failed to parse was invisible until run time and a clean `check` meant nothing
  for a project organised in modules. It is now transitive, reporting each module's
  errors at the module's own line with `note: reached from …`; the editor shows the same
  through a diagnostic on the import line
- **VM module support reached parity with the tree-walker** — the whole comparison
  suite passes on both engines (544/544), so the register VM is no longer the partial
  path for programs that use modules

### Fixed

- **Numeral mode reaches every path to the screen** — `#०९#` only ever affected bare
  `>>`, so the same number printed through interpolation, juxtaposition, `$++` or `>>~`
  silently reverted to ASCII, and a number inside a list stopped following the active
  script by the mere fact of sitting in a list. All of those now honour the mode,
  recursively through arrays and tuples. The digits also come back: every numeric cast
  and typed input accepts digits from any of the 69 scripts, so a program can no longer
  render `१२०` and then refuse to read it
- **One ordering rule, and no second-class digit script** — `"5" > 5` coerced while
  `"४२" > 5` raised an error, and the three engines disagreed even in ASCII. Now
  identical everywhere: numeric when both sides are numbers (a string counts if `#|…|`
  would convert it, in any script), lexicographic when both are non-numeric text, an
  error when a number meets text that is not one. `==` still never coerces
- **Module state survived a returning function** — in the tree-walker, a module
  function that wrote state and then returned a value silently lost the write. No error,
  no warning, and the VM was correct — so a program tested under `--vm` behaved while
  the default engine did not
- **String interpolation accepts every identifier the lexer does** — `"{DIR}"` and
  other global constants were printed verbatim instead of being substituted, and any
  identifier outside the Latin/CJK range — Klingon pIqaD among them — could not be
  interpolated at all
- **Scoping fixes in the tree-walker** — root-scope constants no longer vanish at call
  depth ≥ 2; `x°`/`°x` inside a function called from a `@` loop no longer panics; `\ x`
  inside a function no longer poisons the caller's same-named variable; modules loaded
  at runtime are no longer skipped by semantic analysis
- **VM divergences** — each import alias got its own copy of the module state; output
  parameters of module functions were silently dropped; an interpolated constant came
  out as literal text; a `String` could not be sliced inside a module function; a
  leftover loop-iterator value differed from the tree-walker
- **Numeric and index rules** — every comparison now promotes `Int` and `Float` (only
  `==` did); a module constant can carry a sign; an index computed from parameters is no
  longer rejected as `Float`
- **Misusing a `std/` module reached run time unreported** — a stdlib alias was a
  blind spot for the tooling, so an unknown function, a constant called as a function,
  or a typo in a re-export all passed `check` in silence. Editor and CLI now share one
  export table. In the same pass, re-exported names stopped being dropped by the indexer
  (33 false "export not found" warnings on correct code, now zero)
- **`zymbol fmt` on TUI key-handling code** — an escape sequence in a match pattern
  (`'\n'`, `'\t'`, `'\\'`) was written back unescaped, which no longer lexed; the
  fail-closed gate caught it every time and refused to write, so `fmt` was simply
  unusable on those files. No file was ever corrupted
- **A variable used only as a range bound** is no longer reported as unused — `@
  i:1..total { }` counts as a use of `total`
- **Clearer diagnostics** — `./../x` explains what a module path may look like, and a
  legacy export separator (`<=` or `:` inside `#> {}`) now names itself and shows the
  `=>` form instead of asking for an identifier you already wrote

Verified on release: 936 unit tests · 544/544 tree-walker/VM parity · 523/525 golden
files (two stale fixtures, documented) · formatter property suite 600/600. The browser
playground runs a hand-maintained JavaScript mirror of the interpreter and is behind the
CLI on seven known cases — see [IMPL_V008.md §
E.3](https://github.com/zymbol-lang/interpreter/blob/main/IMPL_V008.md).

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.8) · [Download](install.html)

## v0.0.7 — July 2, 2026

**Native Stdlib, ODBC Databases, Typed Input & Fail-Closed Formatter**

### Added

- **Native stdlib expansion** — `std/json` (`decode` / `decode_map` / `encode`),
  `std/io` (`read`, `write`, `append`, `exists`, `delete`, `list`, `mkdir`) and
  `std/net` (`get` / `post` / `post_json` / `head` with an optional `headers` argument).
  Recoverable failures return soft `##Parse` / `##IO` / `##Network` error values; full
  VM parity and Spanish i18n adapters
- **`std/db` — vendor-neutral database access via ODBC** — `connect`, `exec`, `query`,
  transactions, savepoints, `exec_script`, `table_exists`. Zymbol bundles no engine: the
  OS supplies the per-engine ODBC driver (validated live on SQLite and PostgreSQL with
  the same program). *Available in the Windows binaries and source builds; the prebuilt
  Linux/macOS binaries exclude it — ODBC needs `dlopen`, impossible in a fully static
  binary*
- **`json::decode_map(text, map)` — data-level i18n** — decodes JSON and recursively
  renames object keys per a named-tuple map, so API payload keys read in the consumer's
  language
- **Typed/validated input** — `<< ##.(5,2) "prompt" var` re-prompts until the input
  matches the typespec (both engines)
- **Deep functional update in the VM** — new `DeepSet` instruction: every
  `arr[i>j>…]$~ val` form now works under `--vm`, including positional tuples
- **Static undefined-function detection** — calling an unknown bare identifier is now
  a `check`-time semantic error

### Changed

- **Formatter is now fail-closed and faithful** — a safety gate (token equivalence,
  reparse, statement shape, comment count) refuses to emit non-equivalent output, and
  the parser preserves surface forms (user parentheses, `+=` / `++` / `--`, `¶` vs `\\`,
  typespecs). `zymbol fmt` can no longer corrupt a file
- **Nested `Unit` displays as `()` in both engines** — the last known display
  divergence between tree-walker and VM
- **Rust edition 2024** — workspace migrated (`rust-version 1.85`) with dependency
  upgrades and a security bump (`bytes` ≥ 1.11.1)

### Fixed

- **L16** — `!?` corrupted the caller's scope when a called function failed; the
  tree-walker now restores call state on every error exit and the VM unwinds frames to
  the nearest active catch
- **L14** — destructuring into a `:=` constant is now a semantic error at `check` time
- **Diagnostics** — `zymbol check` no longer prints module errors twice, and LSP
  diagnostics in the editor now match `zymbol check` (module analysis + severities)

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.7) · [Download](install.html)

## v0.0.6 — June 7, 2026

**FatArrow Operator, Bytecode Standalones, VM Input & Stdlib**

### Changed

- **Breaking: `=>` (FatArrow) is now the universal "maps-to" separator** — replaces
  `:` / `<=` in match arms (`pattern => result`), import aliases (`<# path => alias`),
  and export renames (`#> { fn => pub }`). Reads unambiguously as "becomes" across every
  context
- **Standalone binaries embed bytecode instead of source (~60% smaller)** — `zymbol
  build` now compiles to bytecode at build time (`bincode`) and links only
  `zymbol-bytecode` + `zymbol-vm` (2 crates instead of 7), with zero lex/parse/compile
  at startup. *serpiente: 2.2 MB → 901 KB*

### Added

- **Standard library modules** — `std/math` (22 functions incl. `sqrt`,
  `sin`/`cos`/`tan`, `ln`, `exp`, `pow`, `log`, `sigmoid` + `PI`/`E` constants) and
  `std/random` (`entero`, `rango`, `peso_f64`, xoshiro256++). Importable via `<#
  std/math => mat`
- **VM `<<` input parity** — new `ReadLine` bytecode instruction brings interactive
  input to `--vm` mode, with numeric cast and TUI raw-mode suspend/restore
- **Deep functional update** — `arr[i>j]$~ val` updates a nested element
  non-destructively; `$~` also accepts a string field name on named tuples (`p["y"]$~
  val`)
- **REPL upgrades** — unicode-width cursor alignment (CJK / emoji / pIqaD), word
  navigation (`Ctrl+Left/Right`, `Ctrl+W`, `Alt+D`), persistent `~/.zymbol_history`,
  piped-stdin batch mode, and a `RESET` command

### Fixed

- **BUG-007** — the semantic checker rejected recursive integer functions (`gcd`,
  `fibonacci`) after a `Numeric` parameter resolved to `Float`; added bidirectional
  `(Float, Int)` numeric compatibility
- **GAP-Z009** — named functions now retain their module aliases (e.g. `mat::sqrt`)
  when passed as higher-order-function values
- **TUI-FIX-01** — `<<` inside a `>>|` block no longer freezes the terminal (raw-mode
  suspend/restore around the read)
- **TUI-FIX-02** — `>>|` now starts the cursor at (1,1) via `MoveTo(0,0)` on entry

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.6) · [Download](install.html)

## v0.0.5 — May 18, 2026

**TUI Primitives, Hot Definitions & Bug Fixes**

### Added

- **Hot Definition operator `°`** — two-form scope anchoring: `x° op= n` (postfix)
  anchors to the nearest enclosing `@` loop; `°x op= n` (prefix) anchors to the scope
  above. RHS hot read `p° + c` returns neutral if undefined. Neutral values: `+=`/`-=` →
  0; `*=`/`/=` → 1; `$+` → `[]`; juxtaposition → `""`
- **TUI / Terminal primitives** — six new operators: `@~ N` sleep N ms; `>>!` clear
  screen; `>>?` query terminal size (returns `(rows, cols)`); `>>~ (row, col, BKS, fg,
  bg) > items` positioned & styled output (sparse: any slot may be omitted); `<<|`
  blocking keypress read; `<<|?` non-blocking keypress poll; `>>| {}` TUI block
  (alternate screen + raw mode)
- **String repeat `$*`** — `"str" $* N` repeats a string N times; implemented in
  tree-walker and VM (`StrRepeat` instruction)

### Fixed

- **BUG-005** — VM tuple `==` / `<>` always returned `#0`; recursive element-wise
  comparison added to `cmp_direct()` and `Value::equals()`
- **BUG-001** — re-exported functions lost their origin module scope; `FunctionDef`
  now carries `origin_module_path` and uses it at call time
- **BUG-002** — `><` CLI args capture not registered in semantic scope; `zymbol check`
  and LSP no longer report false `undefined variable`
- **BUG-003** — LSP failed to resolve imports in directories with Unicode names
  (percent-encoded URIs); `uri_to_path` now decodes before building the `PathBuf`
- **GAP-001** — arithmetic expressions as slice bounds (`$[pos-1..end]`) caused parse
  errors; new `parse_slice_bound()` handles `+`/`-` in bounds
- **GAP-002** — parenthesized expressions rejected as `$++` items; `LParen` added to
  the item start set without affecting juxtaposition chains
- **GAP-003** — spurious `ambiguous lifetime` warning on every loop iterator;
  suppressed for `_`-prefixed names and pre-defined variables
- **TUI-FIX-01/02/03** — `>>` invisible before `<<|` (missing flush); `¶` breaking
  column alignment in raw mode (CRLF fix); TUI tokens not recognized as statement
  starters inside `>>`

### Changed

- **VS Code extension v0.1.3** — syntax highlighting for all new operators (`°`, `@~`,
  `>>!`, `>>?`, `>>~`, `<<|`, `>>|`, `$*`); new snippets: `outps`, `outpc`, `repeat`,
  `hotacc`, `key`, `keynb`, `tui`, `sleep`, `cls`, `termsize`

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.5) · [Download](install.html)

## v0.0.4 — April 27, 2026

**1-Based Indexing, Multi-Dim Access & Tooling Improvements**

### Added

- **Multi-dimensional indexing** — `arr[i>j>k]` scalar deep access, `arr[p;q]` flat
  extraction, `arr[[g];[g]]` structured extraction
- **Type conversion casts** — `##.expr` to Float, `###expr` to Int (round), `##!expr`
  to Int (truncate)
- **String split** — `string$/ delim` returns an Array of parts
- **Concat-build** — `base$++ a b c` appends multiple items in one expression
- **Closed block module syntax** — `# name { … }` required; E013 raised on executable
  statements at module top-level
- **Circular import detection** — clear `CircularImport` error instead of stack
  overflow
- **E001 enforcement** — module declaration name must match the filename stem; `zymbol
  check` always verifies this
- **REPL** — raw-mode output fix (bare `\n` → `\r\n` in raw mode); `<<` input
  temporarily disables raw mode; expressions typed at the prompt display with quoted
  `repr` formatting
- **Formatter** — multi-line block-comment tracking and re-indentation; module
  export-block layout; handles `DeepIndexExpr`, `FlatExtractExpr`, and
  `StructuredExtractExpr` nodes; idempotent on all 393 parity test files
- **VM full parity** — 320/320 tests pass; `LoadGlobal`/`StoreGlobal` for module
  private mutable state; lambda HOF; list-pattern compilation

### Changed

- **1-based indexing across all collections** — `arr[1]` is the first element; index
  `0` raises a runtime error. Negative indices preserved: `arr[-1]` is still the last
  element
- CLI flag order corrected — `zymbol run --vm file.zy` (flag before file)

### Fixed

- `alias.CONST` — module constant access via dot notation now resolves correctly
- `\ var` explicit lifetime end was a no-op — now calls `destroy_variable()` and
  prevents post-destroy use at compile time
- Cast error messages unified between tree-walker and VM — both emit `"##. requires a
  numeric value, got String"`
- Module constants no longer corrupted on write-back (`take_variable` fix)
- Formatter: 52/52 unit tests pass after correcting loop and foreach test inputs

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.4) · [Download](install.html)

## v0.0.3 — April 10, 2026

**Unicode Numeral Systems & LSP Improvements**

### Added

- 69 Unicode digit blocks — Devanagari, Arabic-Indic, Thai, Tibetan, Adlam,
  Mathematical Bold/Monospace, Segmented LCD, and 62 more
- Mode-switch token `#०९#` sets the active output numeral script at runtime
- Boolean literals accept any digit block: `#१` (true), `#०` (false) in any supported
  script
- VM opcode `SetNumeralMode(u32)` — numeral mode fully supported in the register VM
- REPL: variable echo and expression results respect the active numeral mode
- Klingon pIqaD digits (CSUR PUA U+F8F0–U+F8F9) — only fictional-script exception
- 69 `.zy` test files under `tests/i18n/numerals/` — one per digit block, covering
  input, output mode, arithmetic, and booleans
- VS Code syntax highlighting for `#<d0><d9>#` mode-switch tokens and Unicode digit
  literals

### Changed

- Boolean `>>` output now includes `#` prefix (`#0` / `#1`) to distinguish booleans
  from integers visually — applies in all numeral modes (e.g. `#०` / `#१` in Devanagari)

### Fixed

- LSP: diagnostics and symbol resolution improvements

[GitHub](https://github.com/zymbol-lang/interpreter) · [Download](install.html)

## v0.0.2_01 — March 30, 2026

**Operator Rename & Export Alias**

### Changed

- `c|..|` renamed to `#,|..|` — comma-separated format operator
- `e|..|` renamed to `#^|..|` — scientific-notation format operator
- Symbolic naming now consistent with the `#` format prefix family

### Added

- Export alias: re-export module members under a different name
- EBNF grammar updated for `format_expr` with new operator names

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.2)

## v0.0.2 — March 24, 2026

**Collection API Redesign & Installers**

### Added

- Unified `$` operator family for both arrays and strings — `$#` length, `$+` append,
  `$?` contains, `$-` remove, `$[..]` slice
- Destructuring assignment for arrays, tuples, and named tuples
- Negative indices: `arr$[-1]` accesses the last element
- Native binary installers for Linux (x86_64 + aarch64: .deb, .rpm, .pkg.tar.zst,
  static musl), macOS (x86_64 Intel + aarch64 Apple Silicon), and Windows (MSI)
- winget manifest for Windows

### Changed

- Array and string operations unified under the `$` prefix — replaces earlier per-type
  syntax

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.2) · [Download](install.html)

## v0.0.1-patch — March 25, 2026

**Post-release Fixes**

### Added

- Compound assignment operator `^=`

### Fixed

- Parser arithmetic edge cases found after initial release
- Documentation corrections in MANUAL.md and EBNF grammar

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.1)

## v0.0.1 — March 22, 2026

**Initial Public Release**

### Added

- Tree-walker interpreter — full language feature coverage
- Register VM (`--vm` flag) — ~4× faster execution, ~95% feature parity
- All core language constructs: `?` if, `@` loop, `<~` return, `->` lambda, `>>`
  output, `<<` input, `¶` newline
- Full Unicode identifiers — write variable names in any human language
- Module system with `<` import and `#<` export
- Pattern matching with `~`
- Try/catch/finally with `!{ }` / `!( )` / `![ ]`
- REPL with persistent history
- Language Server Protocol (LSP) via `zymbol-lsp`
- VS Code extension with syntax highlighting
- Formatter: `zymbol fmt`
- 19 verified example programs

[GitHub](https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.1)

