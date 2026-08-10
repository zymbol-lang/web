# Web Interpreter — Gaps & Status

**Date:** 2026-08-09
**Tests:** 518/528 on the interpreter suite (**10 failing**, 39 skipped as irreducible) +
208/210 on the example pool (**2 failing**, 6 skipped)
**Tool:** `node tests/test_runner.mjs` — `web/src/zymbol/zymbol.js` vs `zymbol run` CLI
(v0.0.9 branch)

> The corpus is the Rust one, so it grows when the Rust engines do and this page goes stale
> without anyone editing `zymbol.js`. The jump from 521 to 528 files between 2026-08-01 and
> this pass added seven tests and five failures, none of which were a regression here.
> Re-run the tool before quoting any figure above.

---

## Open parity gaps (12)

`zymbol.js` is **not** at full parity on the v0.0.9 branch. Twelve cases diverge from the
Rust engines. For the seven that predate this branch, the authoritative list — with the
direction of each divergence and why it matters — is
[`interpreter/IMPL_V008.md` § E.3](https://github.com/zymbol-lang/interpreter/blob/main/IMPL_V008.md).
Summarised:

| Case | Gap |
| --- | --- |
| `arity/local_call_too_many.zy`, `arity/module_call_too_few.zy`, `arity/module_call_too_many.zy`, `arity/stdlib_call_too_many.zy`, `arity/wrong_arity_on_a_dead_branch.zy` | Static argument-count checking (`zymbol-semantic/call_arity.rs`, new on v0.0.9) has no counterpart in the web `Checker`, for local, module-qualified and `std/` calls alike — JS **permissive** (5 cases) |
| `bug_mm11_iterator_leftover.zy` | MM-11 leftover loop-iterator value — JS **permissive** |
| `bug_mm4_module_const_guard.zy` | MM-4 import-time semantic gate missing — JS **permissive** |
| `bug_mm9_const_call_depth.zy` | MM-9 root-scope constants at call depth ≥ 2 |
| `parent_path_alias.zy` | HLZ-005 diagnostic text and error count |
| `interp_global_const.zy` | Interpolating a global constant prints `{DIR}` verbatim |
| `examples/rosetta-stone/klingon.zy` | HLZ-KL-001 not ported — the JS lexer rejects `'` inside an identifier, so `f(mI')` will not parse |
| `examples/projects/math-es/calculadora.zy` | Float literals are accumulated digit by digit (`value + frac / div`), so `3.14159265` prints as `3.1415926499999998`. Affects **every** float literal; predates v0.0.8 (introduced with digit-script support in v0.0.4) |

The **permissive** rows are the ones to fix first: a playground user gets output where the
CLI would have refused. The arity group is now the largest of them, and
`wrong_arity_on_a_dead_branch.zy` is the one that shows why running the program cannot
substitute for the check — the bad call sits on a branch that never executes, so only a
static pass can reach it.

Note that the last two are only reachable through the **example pool**, not through
`interpreter/tests/` — which is the argument for the pool being real files on disk.

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

## Irreducible skips (39)

| Category | Count | Reason |
| --- | --- | --- |
| BASH_EXEC | 14 | `<\ \>` / `</ />` shell execution — no shell in the browser |
| ANSI_FORMAT / parser divergence | 14 | CLI ANSI diagnostics with file locations; plus inverted cases where web is more permissive or more correct than the CLI |
| TUI key/raw | 2 | `<<\|` key input and `>>\|` raw mode need a real TTY |
| HOT_DEF edge cases | 3 | CLI-only static errors on `°` misuse (double marker, output position, postfix scope) |
| Closure snapshot semantics | 2 | Web `Env` is a live linked list; capture-by-value needs structural rework |
| STD_DB | 4 | `std/db` requires ODBC — no browser equivalent. Importing it errors with a clear message |

The full skip list with per-test comments lives in `tests/test_runner.mjs` (`SKIP_SET`).
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
  such cap, so this is a divergence by design. Defaults are 50 000 steps / 32 KB, the
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
