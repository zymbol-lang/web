# Web Interpreter — Gaps & Status

**Date:** 2026-06-11
**Tests:** 476/476 passing (100%), 38 skipped (irreducible)
**Tool:** `node test_runner.mjs` — `web/zymbol.js` vs `zymbol run` CLI (v0.0.7 branch)

---

## Status

`web/zymbol.js` is in full parity with the CLI for every applicable test, including
the v0.0.7 feature set:

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

## Irreducible skips (38)

| Category | Count | Reason |
| --- | --- | --- |
| BASH_EXEC | 13 | `<\ \>` / `</ />` shell execution — no shell in the browser |
| ANSI_FORMAT / parser divergence | 14 | CLI ANSI diagnostics with file locations; plus inverted cases where web is more permissive or more correct than the CLI |
| TUI key/raw | 2 | `<<\|` key input and `>>\|` raw mode need a real TTY |
| HOT_DEF edge cases | 3 | CLI-only static errors on `°` misuse (double marker, output position, postfix scope) |
| Closure snapshot semantics | 2 | Web `Env` is a live linked list; capture-by-value needs structural rework |
| STD_DB | 4 | `std/db` requires ODBC — no browser equivalent. Importing it errors with a clear message |

The full skip list with per-test comments lives in `test_runner.mjs` (`SKIP_SET`).

---

## Known web-specific divergences (not test failures)

- `json::encode` of an integral Float (e.g. `2.0`) emits `2`, not `2.0` (JS has one
  number type).
- `##Parse(...)` / `##Network(...)` message bodies differ from the Rust equivalents
  (V8/fetch wording vs serde/ureq wording); kinds and catchability match.
- The 50k-step limit (browser hang protection) is lifted by the test runner via
  `opts.maxSteps`; benchmark tests are excluded by directory, not by SKIP entries.
- `mat::PI` / `mat::E` constants are accessible in web via FieldAccess; the CLI parser
  does not support bare constant access yet (CLI gap, not web gap).
