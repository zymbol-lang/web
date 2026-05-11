# Web Interpreter — Gaps & Bugs Analysis

**Date:** 2026-05-10
**Tests:** 330/456 passing (126 failing)
**Tool:** `web/zymbol.js` vs `zymbol run` CLI

---

## Summary

| Category | Count | Fixable |
|---|---|---|
| RUNTIME_FORMAT | 53 | Yes |
| FEATURE_GAP | 25 | Partial |
| ANSI_FORMAT | 11 | No |
| HOT_DEF_GAP | 10 | Partial |
| BASH_EXEC | 12 | No |
| CHECKER_FP | 5 | Yes |
| MODULE_GAP | 5 | Partial |
| RUNTIME_BUG | 5 | Yes |
| **Total** | **126** | |

**Highest-impact quick wins:** RUNTIME_FORMAT has 53 tests, 38 of which share the exact same one-line fix (alias syntax in module help text). Another 15 differ only in error message phrasing and the double-prefix bug. All 53 are fixable with small, surgical edits.

---

## Fixable Issues

### RUNTIME_FORMAT — 53 tests

#### Sub-group A: Module help text uses `: alias` instead of `<= alias` (38 tests)

All these tests fail because the module-file warning says:
```
= help: module 'X' is meant to be imported with <# ./X : alias
```
but the CLI emits:
```
= help: module 'X' is meant to be imported with <# ./X <= alias
```

**Fix:** In `web/zymbol.js`, locate the module-file warning construction and change `: alias` to `<= alias`.

Affected tests:
- `bugs/bug001_adaptador.zy`
- `bugs/bug001_servidor.zy`
- `bugs/bug01_intra_mod.zy`
- `errors/semantic/E001_mismatch_mod.zy`
- `errors/semantic/E004_mod_a.zy`
- `errors/semantic/E004_mod_b.zy`
- `errors/semantic/E005_bad_export.zy`
- `errors/semantic/E006_base.zy`
- `errors/semantic/E006_reexport_missing.zy`
- `errors/semantic/E007_base.zy`
- `errors/semantic/E007_reexport_type.zy`
- `errors/semantic/E008_mod.zy`
- `errors/semantic/E009_dup_export.zy`
- `errors/semantic/E010_base.zy`
- `errors/semantic/E010_reexport_private.zy`
- `errors/semantic/E011_mod_a.zy`
- `errors/semantic/E011_mod_b.zy`
- `errors/semantic/E012_mod.zy`
- `gaps/g09_config_mod.zy`
- `gaps/g11_printer_mod.zy`
- `gaps/g13_counter_mod.zy`
- `gaps/g14_flex_mod.zy`
- `gaps/g17_helper_mod.zy`
- `i18n/matematicas/fecha_hora.zy`
- `i18n/matematicas/module.zy`
- `i18n/matematicas/한국인.zy`
- `i18n/matematicas/ελληνικά.zy`
- `i18n/matematicas/עִברִית.zy`
- `modules_scope/block_syntax_basic.zy`
- `modules_scope/circ_mod_a.zy`
- `modules_scope/circ_mod_b.zy`
- `modules_scope/circ_mod_c.zy`
- `modules_scope/complex_module.zy`
- `modules_scope/export_alias.zy`
- `modules_scope/isolated_module.zy`
- `modules_scope/math_test.zy`
- `modules_scope/private_state_block.zy`
- `scripts/lib_time.zy`

#### Sub-group B: Double `runtime error:` prefix in thrown exceptions (15 tests)

The web interpreter's `runZymbol` catch block at line 3465 of `zymbol.js` prefixes all non-`ZyStaticError` exceptions with `"Runtime error: runtime error: "`. This creates a doubled prefix not present in CLI output. Additionally, several individual error messages differ in capitalization or verbosity.

**Root fix (line 3465):** Change:
```js
onOutput(`Runtime error: runtime error: ${e.message ?? e}`);
```
to:
```js
onOutput(`Runtime error: ${e.message ?? e}`);
```

Additional per-message fixes needed after the prefix fix:

- `errors/runtime/div_zero.zy` — WEB: `Division by zero` → should be `division by zero` (lowercase d)
- `errors/runtime/index_oob.zy` — WEB: `Index out of bounds: 99` → should be `array index out of bounds: index 99 for array of length 3` (full message with length context)
- `errors/runtime/index_zero.zy` — WEB: `Index 0 is invalid (indices start at 1)` → CLI gives longer message explaining 1-based indexing
- `errors/runtime/module_not_found.zy` — WEB: `Module not found: './i_do_not_exist'` → CLI gives absolute path; also `Module` vs `module` capitalization
- `errors/runtime/type_cast.zy` — WEB: `Str` → should be `String` (full type name for string type)
- `errors/runtime/undefined_var.zy` — WEB: `did you mean 'outer°'?` → CLI adds `(hot definition)` at the end
- `errors/runtime/E004_circular.zy` — WEB detects module `E004_mod_b` as already loading; CLI detects `E004_mod_a` (different traversal order)
- `errors/runtime/E008_private_access.zy` — WEB: `Module has no export 'private_fn'` → CLI: `module 'm' does not export function 'private_fn'` (different template, missing alias)
- `errors/runtime/E010_reexport_private.zy` — same pattern as E008
- `errors/runtime/E012_no_export.zy` — same pattern as E008
- `errors/semantic/E002_mod_not_found.zy` — absolute path vs `'./i_do_not_exist'` (relative)
- `errors/semantic/E003_bad_path.zy` — absolute path vs `'../../../escape'` (relative)
- `memory05_function_error.zy` — WEB: `did you mean 'external_var°'?` → CLI adds `(hot definition)` suffix
- `named_tuples/error_01_field_not_found.zy` — WEB has `runtime error:` prefix; also field error message format differs slightly
- `named_tuples/error_02_member_on_positional.zy` — WEB: `'.x' requires a named tuple` vs CLI: `Cannot access field 'x' on positional tuple. Use positional indexing like tuple[1]`

---

### CHECKER_FP — 5 tests

The static Checker emits false positives or duplicate errors that block correct execution.

#### Missing newline between multiple Checker diagnostics

`formatDiagnostic()` returns a string without a trailing `\n`. When the Checker emits multiple diagnostics in sequence, they concatenate without separation:
```
error[E_SCOPE]: cannot access underscore variable '_outer' from inner scopeerror[E_VAR]: undefined variable: '_outer'
```

**Fix:** Change line 3454 in `zymbol.js` from:
```js
for (const d of diags) if (d.severity === 'error') onOutput(formatDiagnostic(d));
```
to:
```js
for (const d of diags) if (d.severity === 'error') onOutput(formatDiagnostic(d) + '\n');
```

#### E_SCOPE followed by spurious E_VAR for the same variable

After emitting `E_SCOPE` for underscore variable access across scope, the Checker also emits `E_VAR` for the same identifier (because the variable is not visible from that scope). The E_VAR is redundant — the real error is E_SCOPE.

**Fix:** In the Checker's `E_SCOPE` path, mark the variable as seen so the E_VAR check is skipped.

Affected tests:
- `analysis/04_underscore_var_scope_violation.zy` — E_SCOPE + spurious E_VAR concatenated
- `v0.0.4_review/scope_underscore_inner_error.zy` — same
- `v0.0.4_review/scope_underscore_loop_error.zy` — three errors concatenated (E_SCOPE + E_VAR + E_SCOPE again)
- `scope02_nested_blocks.zy` — Checker emits two `E_VAR` errors (for `inner` and `middle`) where CLI stops at first; no newline between them

#### Checker incorrectly flags hot-def variables as undefined

- `gaps/gap_hot_definition_scope.zy` — The Checker emits `E_VAR: undefined variable: 'palabra'` (twice, no newline) for a variable accumulated via `°palabra` inside a `@` loop. The Checker does not model hot-def scope, so it sees the variable as undefined before the loop body. The runtime would succeed if Checker didn't block it. **Fix:** Teach the Checker to recognize `°name` and `name°` patterns as variable definitions; skip E_VAR for names that appear in a hot-def position.

---

### RUNTIME_BUG — 5 tests

Bugs where the web interpreter computes or interprets code differently from the CLI for logic that should work.

- **`analysis/p1e_destructuring_overwrite.zy`** — Destructuring assignment `[limit, extra] = [200, 300]` where `limit` was declared with `:=` (constant). CLI allows this (known gap: destructuring silently overwrites constants). Web blocks it with `Cannot reassign constant 'limit'`. WEB is stricter here than CLI intends.

- **`analysis/p2a_append_chaining.zy`** — Chained `$+` operator: `arr$+ 4$+ 5$+ 6` fails with `$+ not supported on int`. The web evaluates `(arr$+ 4)` which returns an array, then applies `$+ 5` to it, but something in the postfix parse for chained `$+` causes the result type to be wrong. CLI handles left-to-right chaining correctly.

- **`analysis/p3h_error_flows.zy`** — Error value flow via `$!` and `$!!`. When a function returns an error value (not throws), the web interpreter throws the error as an exception instead of wrapping it as a value. The `$!` operator (is-error test) and `$!!` (error propagation) require the error to be a first-class value, but the web throws mid-function. This affects the last two tests in the file (lines 7-8).

- **`analysis/p5d_fn_capture_asymmetry.zy`** — Named functions used as first-class values (`f = adder`) should capture the outer scope at assignment time. In the web, the named function `adder` accesses `base` from the calling env at call time, but since `f` is called outside `adder`'s original scope, `base` is undefined. CLI creates a snapshot of the scope at function assignment. **Fix:** When a named function is used as a value (stored in a variable), snapshot the current environment.

- **`lambdas/28_eval_order_and_capture.zy`** — Two sub-issues:
  1. L2: `getA = (dummy -> a); a = 99; getA(0)` should return `5` (captured at creation), but web returns `99` (live binding). Lambda closures use live environment references instead of snapshots.
  2. L7: `bump = (dummy -> { counter = counter + 1  <~ counter }); bump(0); counter` — writes to a captured variable inside the lambda should stay local; web leaks the write back to outer scope (`counter` becomes `1` instead of staying `0`).

---

## Irreducible Failures (cannot fix without major changes)

### ANSI_FORMAT — 11 tests

The CLI emits ANSI-decorated error messages with file location, line number, and source snippet. The web cannot replicate this format. Both CLI and web produce *semantically equivalent* errors, but the format differs enough to fail exact text comparison.

- `scope01_if_block.zy` — CLI: ANSI `error: undefined variable 'inside_var'` with 6-line location block; WEB: `error[E_VAR]: undefined variable: 'inside_var'` (1 line, no location)
- `scope03_loop_block.zy` — same pattern for `loop_var`
- `functions/11_constant_immutability_error.zy` — CLI: ANSI `error: cannot reassign constant 'PI'` with location; WEB: `error[E_CONST]: cannot reassign constant 'PI' (line 5)`
- `arithmetic/04_comparison_ops.zy` — CLI: ANSI parse error for `!=` with help text `use '<>' for not-equal`; WEB: `[ERROR] Line 5: Expected RPAREN, got '!'` (different parser error format)
- `tui/02_clear_screen.zy` — CLI emits `ESC[2J ESC[1;1H` ANSI clear-screen escape before `after`; WEB outputs only `after`
- `tui/04_output_pos.zy` — CLI emits `ESC[1;1H` position escape then `x`; WEB outputs empty string
- `gaps/gap_output_pos_sparse.zy` — CLI emits ANSI cursor-position sequences; WEB outputs empty string
- `manual/tui/07_output_pos_sparse.zy` — same as above
- `gaps/gap_hot_def_double_hot_error.zy` — CLI: ANSI parse error for `°arr°` (ambiguous double hot marker); WEB: silently runs and produces output `000[1]23`
- `gaps/gap_hot_def_error_in_output.zy` — CLI: ANSI error for `x°` in output position (invalid); WEB: executes and produces output `5\nunreachable`
- `gaps/gap_hot_def_scope_postfix_loops.zy` — CLI: ANSI error for accessing `x` after its postfix-scoped loop ends; WEB: outputs `12` (wrong value, no scope error)

### BASH_EXEC — 12 tests

These tests use the `<\ ... \>` BashExec operator to execute shell commands. The web interpreter stubs BashExec to return a large numeric hash (Date.now()-based), not actual shell output. Real shell execution is not available in a browser context.

- `gaps/g12_bashexec_expression.zy` — `<\ "test -d " dir " && echo yes || echo no" \>` returns numeric timestamp instead of `yes`; simple `<\ "echo X" \>` works (lines 1-2 pass), but complex shell operators (`&&`, `||`, `|`) do not
- `scripts/manual_check.zy` — entire test runner is based on BashExec for shell operations
- `i18n/test_archivos.zy` — uses BashExec for file system operations (`find`, `echo`, `>>`)
- `i18n/test_bash.zy` — uses BashExec with pipe (`ls | head`)
- `i18n/test_bash_simple.zy` — uses BashExec with pipe (`echo | wc`)
- `i18n/test_database.zy` — uses BashExec for `sqlite3` commands
- `i18n/test_http_api.zy` — imports `i18n/matematicas/http.zy` which uses BashExec; CLI fails to parse that module; web can't connect to HTTP
- `i18n/test_integration_all.zy` — uses BashExec with pipe (`ls *.zy | wc -l`)
- `i18n/test_interpolacion_simple.zy` — uses BashExec with variable interpolation inside `{}` inside shell args
- `i18n/test_modulos_sistema.zy` — imports `sistema.zy` which uses BashExec with `ls | wc -l`
- `i18n/test_sqlite_direct.zy` — uses BashExec with variable interpolation for sqlite3 operations
- `i18n/test_sqlite_simple.zy` — same

---

## Partial Gaps (complex to fix)

### HOT_DEF_GAP — 10 tests

The `°` (hot-definition) operator is not correctly implemented in the web interpreter. In the CLI, `°x` (prefix) auto-initializes `x` above the nearest `@` loop and survives across sequential loops. `x°` (postfix) anchors to the loop and is destroyed when the loop ends. The web interpreter does not model these scoping rules, causing runtime errors like `'x' is undefined — did you mean 'x°'?` for code that should work.

The core issue: the web interpreter does not pre-initialize hot-def variables before loop entry. Instead, when the loop body first tries to use `x` (without the `°` on subsequent iterations), it's not in scope.

- `gaps/gap_hot_def_else_branch.zy` — `°pares` and `°impares` accumulated in if/else branches inside `@` loop; web errors `'impares' is undefined`
- `gaps/gap_hot_def_float.zy` — float accumulation via `°suma` across loop iterations
- `gaps/gap_hot_def_function.zy` — `°s` inside function body accumulated across loop; each call should get a fresh scope
- `gaps/gap_hot_definition_basic.zy` — basic `°total += n` and `arr = °arr $+ i` patterns
- `gaps/gap_hot_definition_mul_div.zy` — `°prod *= i` with multiplicative neutral 1 (not 0)
- `gaps/gap_hot_def_no_warn_in_loop.zy` — `°acc` inside nested loops; no warning expected when `loop_depth > 0`
- `gaps/gap_hot_def_sequential_prefix.zy` — `°x` survives across two sequential `@` loops
- `gaps/gap_hot_def_warn_multiple.zy` — second `x°` outside loop should warn but still execute; web errors
- `gaps/gap_hot_def_warn_pow.zy` — `°y ^= n` should warn (neutral is 0, result always 0) but still run; web errors
- `gaps/gap_hot_def_warn_redundant.zy` — second `x°` in same scope warns but continues; web errors

### MODULE_GAP — 5 tests

- `errors/semantic/E013_exec_in_mod.zy` — CLI emits a hard parse error `E013: executable statement not allowed in module body`. The web only emits a warning that the file is a module and cannot be run directly, without detecting the invalid executable statement inside the module body.

- `i18n/matematicas/archivos.zy` — Module file containing BashExec with `.` dot in command args (e.g., `find . "-maxdepth" ...`). CLI fails to parse (`expected field name after '.'`). Web detects it as a module file and warns without parsing the body. Both fail but for different reasons.

- `i18n/matematicas/db.zy` — Module file containing BashExec with `{variable}` interpolation inside shell string. CLI fails to parse (`expected expression, found LBrace`). Web emits module warning without parsing body.

- `i18n/matematicas/http.zy` — Same pattern as `db.zy` (BashExec with `{url}` interpolation).

- `i18n/matematicas/sistema.zy` — Module file with BashExec containing shell pipes (`ls | wc -l`). CLI fails to parse. Web emits module warning.

### FEATURE_GAP — 25 tests

#### Execution step limit (13 tests)

The web interpreter enforces a 50,000-step limit to prevent browser hangs. All benchmark and stress tests exceed this limit. The CLI has no step limit.

- `scripts/_test_fib_approaches.zy`
- `scripts/bench_collections.zy`
- `scripts/bench_match.zy`
- `scripts/bench_recursion.zy`
- `scripts/bench_recursion_loop.zy`
- `scripts/bench_strings.zy`
- `scripts/bench_strings_modify.zy`
- `scripts/bench_strings_stress.zy`
- `scripts/stress.zy`
- `stress_v2/bench_hof.zy`
- `stress_v2/bench_numeric.zy`
- `stress_v2/bench_pipeline.zy`
- `stress_v2/bench_text.zy`

The step limit is intentional for the browser. These tests could be excluded from the parity test run, or the limit could be raised for CLI-mode test runs.

#### Type model `#?` introspection (2 tests)

- `analysis/p3e_type_model.zy` — `(fn_ref#?)[1]` should return `##()` (tuple type symbol) but returns `##_` (unit). `(fn_ref#?)[2]` should return the arity `1` but returns `0`. `(fn_ref#?)[3]` should return `<funct/1>` but returns `<function double>`. The web `#?` operator returns a different structure for functions and lambdas.
- `analysis/p3f_fn_lambda_types.zy` — same issue for both named functions and lambdas.

**Fix direction:** The web `symMap` at line 2964 of `zymbol.js` maps `fn` to `##()` but the `#?` result tuple structure is different from what CLI produces. The `#?` result should be a 3-element tuple `(type_symbol, arity, display_string)`.

#### Multi-parameter sort lambda `$^+` (1 test)

- `collections/22_sort_named.zy` — `people$^+ (a, b -> a.age < b.age)` fails with `[ERROR] Line 11: Expected COLON, got '('`. The web parser does not support the `(a, b -> ...)` two-parameter lambda form in `$^+`/`$^-` sort operators. The CLI parses this correctly.

#### `!=` operator divergence (1 test)

- `collections/11_hof_filter_reduce.zy` — CLI rejects `!=` as invalid (`use '<>' for not-equal`). The web accepts `!=` as a valid comparison operator (tokenized as `NOT` + `ASSIGN`, which the parser somehow handles). The test expects CLI behavior (parse error). This is an inverted failure: web is more permissive than CLI.

#### Homogeneous array type enforcement (1 test)

- `collections/34_homogeneous_type_error.zy` — CLI enforces that all array elements must share the same type as the first element (`[1, "hello", #1]` → type error). Web allows heterogeneous arrays silently.

#### Execute-file operator `</ />` (1 test)

- `i18n/test_execute.zy` — `resultado = </ "./calculator.zy" />` should run the specified `.zy` file and capture its output. Web returns `NaN` for the result.

#### Match arm with block body for side effects (1 test)

- `scope04_match_block.zy` — Uses match arms with embedded block bodies: `1..3 : "low" { match_var = "in range 1-3" ... }`. Web parser fails: `Expected COLON, got 'match_var'`. The CLI supports block bodies attached to match arms for scoped side effects; this syntax is not implemented in the web parser.

#### TUI interactive input/mode (2 tests)

- `manual/tui/05_key_input.zy` — Uses `<<| key` (raw keyboard input operator). Not available in web context; CLI itself fails with `Failed to initialize input reader` in non-TTY.
- `manual/tui/06_tui_block.zy` — Uses `>>| { ... }` (TUI raw mode block). CLI fails `failed to enable raw mode`. Web outputs the content without raw mode.

#### Static argument type checking (1 test)

- `memory02_function_isolation.zy` — CLI rejects `process_value(data)` where `data` is `String` but `process_value` expects `Int`, emitting a type mismatch error. Web has no static argument type checking and runs the function, producing different output.

#### Block lambda local variable scoping (1 test)

- `memory_correct_01_lambdas.zy` — CLI Checker emits `undefined variable 'first'` for `<~ func(first)` inside a block lambda `-> { first = func(value)  <~ func(first) }`. The web runs this correctly (local var `first` is visible within the same block lambda). This is a CLI Checker false positive; the web behavior is correct. The test expects CLI output (error), so it fails in the parity runner.

#### String insert operator `$++[pos:str]` (1 test)

- `strings/09_length.zy` — `s$++[5:"!!!"]` (insert `"!!!"` at position 5) causes a CLI parse error (`unexpected '['`). Web parses and executes it correctly, producing the right result. Again an inverted failure: web is more complete than CLI for this operator form.

---

## Fix Priority Recommendations

### Priority 1 — Single fix, 38 tests unlocked

Change `': alias'` to `'<= alias'` in the module-file warning help text in `web/zymbol.js`. This is a one-line change that fixes 38 tests.

### Priority 2 — Single fix, ~10 more tests improved

Change line 3465 in `web/zymbol.js`:
```js
// Before:
onOutput(`Runtime error: runtime error: ${e.message ?? e}`);
// After:
onOutput(`Runtime error: ${e.message ?? e}`);
```
This removes the double `runtime error:` prefix from all thrown-exception error messages, directly improving 10+ tests and making the remaining message-text differences the only blocker.

### Priority 3 — Checker newline fix, 4 tests unlocked

Add `+ '\n'` to the `onOutput(formatDiagnostic(d))` call in the Checker error output loop. Fixes `scope02`, `analysis/04_underscore`, and both `v0.0.4_review` tests.

### Priority 4 — RUNTIME_BUG fixes, 5 tests unlocked

Address the five runtime bugs in order of complexity:
1. `p2a_append_chaining` — Fix `$+` chaining evaluation to correctly handle left-to-right chain on array results.
2. `p5d_fn_capture_asymmetry` — When assigning a named function to a variable (`f = adder`), snapshot the current environment for the function.
3. `lambdas/28_eval_order_and_capture` — Fix lambda closure to capture variable values at creation time (not live references); writes to captured vars must stay local.
4. `p3h_error_flows` — Implement `$!` (is-error) and `$!!` (error propagate) as value-level operators that don't throw exceptions.
5. `p1e_destructuring_overwrite` — Allow destructuring to overwrite constants (match CLI behavior, which treats this as a known gap).

### Priority 5 — HOT_DEF_GAP, 10 tests (complex)

Implement hot-def `°` scoping in the web interpreter. The `°name` (prefix) form must pre-initialize the variable in the scope *above* the nearest enclosing `@` loop before the loop body executes. The `name°` (postfix) form anchors to the loop and is destroyed on loop exit. Requires restructuring how loop scopes are set up and torn down.
