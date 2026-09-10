# Web Interpreter — Gaps & Status

**Date:** 2026-08-31
**Tests:** 661 corpus files — **631 agree, 0 diverge** · 222 example files — **216 agree,
0 diverge**
**Tool:** `node tests/test_runner.mjs`, which delegates to `zyq consensus --engines
zytw,zyjs` (v0.0.9 branch)

> The corpus is the shared one in `zyquality/`, so it grows when any engine's tests do and
> this page goes stale without anyone editing `zymbol.js`. **Re-run the tool before quoting
> any figure above** — that is not boilerplate here: between 2026-08-09 and this pass the
> gaps below were fixed and this page kept reporting them, along with the header comment in
> `zymbol.js` and `interpreter/IMPL_V008.md` § E.3, all three saying twelve where the
> measurement said zero.

---

## Open parity gaps — none

`zymbol.js` is **at parity** with the Rust engines on the whole corpus and the whole example
pool. Each of the twelve cases this section used to list was verified on its own rather than
inferred from the total:

| Case | Was | Now |
| --- | --- | --- |
| `arity/` (5 files) | Static argument-count checking (`zymbol-semantic/call_arity.rs`) had no counterpart in the web `Checker` — JS **permissive** | 7 files, three engines, **7 agree**. This engine was the last one that filled a missing argument with `Unit` |
| `bugs/bug_mm4_*`, `bug_mm9_*`, `bug_mm11_*` | MM-4 import-time gate, MM-9 root-scope constants at depth ≥ 2, MM-11 leftover loop-iterator value | `corpus/bugs/bug_mm*` — 12 files, **12 agree** |
| `errors/parser/parent_path_alias.zy` | HLZ-005 diagnostic text and error count | agrees |
| `modules_scope/interp_global_const.zy` | Interpolating a global constant printed `{DIR}` verbatim | agrees |
| `examples/rosetta-stone/klingon.zy` | HLZ-KL-001 not ported — the lexer rejected `'` inside an identifier | `f(mI') { <~ mI' }` returns `7` here and in the CLI; tlhIngan Hol parses |
| `examples/projects/math-es/calculadora.zy` | Float literals accumulated digit by digit, so `3.14159265` printed as `3.1415926499999998` | `>> 3.14159265 ¶` prints `3.14159265` in both engines |

The float row was the worst of the twelve: it affected **every** float literal, not the one
example that caught it, and it went unnoticed from v0.0.4 until the example pool became real
files on disk. The last two rows are reachable only through the pool — which is the argument
for the pool being real files rather than string literals in a JS module.

---

## Feature coverage

Everything below is at parity, including the v0.0.7 feature set:

- **std/json** — `decode`/`encode` over `JSON.parse`/`JSON.stringify`. Object↔NamedTuple,
  array↔Array, null↔Unit, soft `##Parse(...)` on malformed JSON. The parse-error *text*
  is engine-specific (serde vs V8), so the runner normalizes `##Parse(...)` bodies.
- **std/net** — `get`/`post`/`post_json` (optional headers arg) + `head` over `fetch()`.
  Soft `##Network(...)` on failure (incl. non-2xx, like ureq). Browser caveat: CORS
  applies to cross-origin requests.
- **std/io** — full API (`read`/`write`/`append`/`exists`/`delete`/`list`/`mkdir`) over a
  **per-run virtual filesystem** (Map of files + Set of dirs, shared with imported
  modules). State does not persist across runs. `write`/`append` do not require parent
  directories (web-specific permissiveness).
- **Typed input** — `<< <typespec> "prompt" var` with `##.(t,d)` / `##.` / `###(n)` /
  `##"(n)` / `##'`. Validates and re-prompts with the CLI's exact hint text.
- **Input EOF contract** — `inputFn` returning `null`/`undefined` means EOF → runtime
  error `end of input while waiting for …`, matching the CLI on closed stdin. In the
  playground, Escape cancels the input field (= EOF). Legacy `<< #|v|` now converts
  numeric strings to Int/Float (`parse_numeric_string` mirror).
- **Static undefined-function detection** — the Checker flags bare-identifier calls
  that name neither a hoisted function, a variable, nor a module alias (`E_FUNC`,
  first line matches the CLI: `error: undefined function: 'cos'`). Validated with
  zero false positives across the full corpus, the manual suite, and all 115
  playground examples.

Test corpus inputs: a test `foo.zy` with a sibling `foo.input` gets that file fed line
by line (CLI: stdin; web: `inputFn`, `null` when exhausted).

---

## Irreducible skips (30 corpus files, 6 examples)

| Category | Count | Reason |
| --- | --- | --- |
| BASH_EXEC | 14 | `<\ \>` / `</ />` shell execution — no shell in the browser |
| ANSI_FORMAT / parser divergence | 14 | CLI ANSI diagnostics with file locations; plus inverted cases where web is more permissive or more correct than the CLI |
| TUI key/raw | 2 | `<<\|` key input and `>>\|` raw mode need a real TTY |
| HOT_DEF edge cases | 3 | CLI-only static errors on `°` misuse (double marker, output position, postfix scope) |
| Closure snapshot semantics | 2 | Web `Env` is a live linked list; capture-by-value needs structural rework |
| STD_DB | 4 | `std/db` requires ODBC — no browser equivalent. Importing it errors with a clear message |

The authority is `zyquality/corpus.toml`, which declares four tags that exclude a file from
`zyjs` — `BASH_EXEC`, `ANSI_FORMAT`, `TUI`, `STD_DB` — each with a written reason, because an
exclusion nobody justified cannot be told from a bug somebody hid. The `SKIP_SET` literal that
used to live inside `tests/test_runner.mjs` is gone: it was one of the five incompatible
exclusion mechanisms `corpus.toml` replaced.
Files in the **example pool** do not go in that table: an example whose CLI/browser
divergence is irreducible declares `// @skip-parity: <reason>` in its own first lines, so
the reason travels with the file.

---

## Known web-specific divergences (not test failures)

- `json::encode` of an integral Float (e.g. `2.0`) emits `2`, not `2.0` (JS has one
  number type).
- `##Parse(...)` / `##Network(...)` message bodies differ from the Rust equivalents
  (V8/fetch wording vs serde/ureq wording); kinds and catchability match.
- The engine caps steps and output (browser hang protection); the Rust engines have no
  such cap, so this is a divergence by design. Defaults are 2 000 000 steps / 32 KB, the
  playground raises both to 2 000 000 for a `.zyp` mount, and the test runner lifts them
  to `Infinity` via `opts.maxSteps` — benchmark tests are excluded by directory, not by
  SKIP entries. A `>>|` block is exempt: it runs uncapped, and on exit both counters are
  restored to their values on entry, so its work is neither charged to the budget outside
  nor allowed to reset it. Until 2026-08-09 only the ceilings were saved and restored
  while the counters kept accumulating, so the first statement after any substantial TUI
  block failed instantly — see `tests/test_limits.mjs`, which holds both halves of that
  boundary.
- `mat::PI` / `mat::E` constants are accessible in web via FieldAccess; the CLI parser
  does not support bare constant access yet (CLI gap, not web gap).
