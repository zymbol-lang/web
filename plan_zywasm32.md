# Plan — `zywasm32.html`: the playground on the WebAssembly engine

> **Status: a plan, not started.** Written on 2026-10-20 to be picked up later. Every option below is the one
> recommended when the plan was laid out; the author asked for the plan with those options, from F1 to F5, and has
> not yet decided to start it. When work begins, record that decision in `interpreter/ROADMAP_V0011_ES.md` first: this
> plan **goes beyond decision 3.4 of 2026-10-20**, which made the core portable to wasm32 and published no engine.
>
> **Who it is for:** whoever resumes this work — the author, or a model working under the author's direction — with
> this repository and `interpreter/` checked out side by side. Read `zymbol-design/HOW_TO_CHANGE_ZYMBOL.md` before F1.

---

## 1. What it is, and what it is not

A second playground page, `web/zywasm32.html`, that runs programs on the **register VM compiled to wasm32** — the
engine `zymbol run` uses — instead of on `zymbol.js`, and gets its diagnostics from the same Rust front-end as
`zymbol check`. It reuses the existing playground modules; only the engine underneath changes.

It is **optional and separate**. `playground.html` keeps `zymbol.js`. The author's principle, not up for evaluation:
the browser's default engine is JavaScript, because Zymbol has to run easily and fast in any browser whatever its
capacity; a WebAssembly engine is a strong optional engine, never a requirement (`ROADMAP_V0011_ES.md` § 3.4).

The page must not be worse than `playground.html` at anything the playground already does: console, input, the
full-screen TUI, the file tree and `.zyp` packages, the example catalog and deep links, highlighting, the problems
panel and gutter, the hover cards, the interface's languages, the WebMCP tools and the AGPL source offer.

## 2. Where this starts from (measured 2026-10-20)

- **The core builds for wasm32.** Since 3.1 `zymbol-vm` depends on no system library (terminal, network and
  database are behind `zymbol_vm::host::{Terminal, Host}`, natively in `zymbol-host`); since 3.4 `ZyStr` takes 32-bit
  pointers. The gate checks `cargo check -p zymbol-compiler -p zymbol-vm --target wasm32-unknown-unknown`.
- **Run on a 32-bit target** (`wasm32-wasip1`, through Node's WASI), the core's unit tests pass: vm 14, intrinsics 16,
  lexer 191, parser 58, common 37, semantic 75 — all but those that spawn a process or write a temporary file.
- **A measurement prototype** (off the branch, in `interpreter/target/w32/proto-main/`: a `cdylib` with two hand-written
  exports, no `wasm-bindgen`, the clock imported from JavaScript) runs the sixteen programs of
  `zyquality/bench/big/` in wasm32 with the native VM's output, byte for byte.

| | Uncompressed | `gzip -9` |
|---|---|---|
| `zymbol.js` | 636 KB | 185 KB |
| wasm, `opt-level = 3` | 1 809 KB | 474 KB |
| wasm, `opt-level = "z"` | 1 066 KB | 319 KB |

Elapsed time per process, Node start-up included, median of 5, geometric mean of the sixteen: `zymbol.js` runs at
61× the native VM; wasm with Liftoff only (V8's baseline compiler) at 3.2× — about 19 times faster than `zymbol.js`.
`fib_rec`: 0.98 s native, 1.9 s wasm, 70 s `zymbol.js`; with TurboFan, once compiled, ~1.3 s. **Compiling the module
with TurboFan costs ~3.7 s of CPU at `opt-level = 3` and ~1.4 s at `"z"`**: Node waits for it at exit; a browser does
it on another thread, and more slowly on a modest machine.

- `zymbol-formatter`, `zymbol-error` and `zymbol-package` also build for wasm32. `zymbol-analyzer` (the LSP's analysis
  engine) fails only on `Url::from_file_path`, which does not exist on wasm — a `cfg` away.

## 3. The playground today, piece by piece

| Piece | Today (`playground.html`) | In `zywasm32.html` |
|---|---|---|
| Running | `runZymbol()` from `src/zymbol/zymbol.js`, asynchronous, on the page's thread | The Rust VM in wasm32, in a Web Worker |
| Console | HTML (`out-*` elements); `<<` is an `<input>` resolving a promise (`inputFn` in `playground.js`) | The same HTML console |
| Full-screen TUI | `BrowserTUI` in `playground.js`, already on a `<canvas>` | The same `BrowserTUI`, driven from the worker |
| Problems and gutter | `checkSource()` from `zymbol.js`; each diagnostic carries a code and parameters, which is what lets `problems.js` render it in the reader's language | What `zymbol check` says, from wasm |
| Highlighting | `src/playground/highlight.js`, audited against the corpus | The same |
| Hover | `SYMBOLS` cards (`symbols.js`) and `buildSymbolIndex()` from `zymbol.js` | The same cards; the index from `zymbol-analyzer` in wasm |
| `std/net` | Over `fetch()`, a soft `##Network` on failure | `Host::http` over a synchronous `XMLHttpRequest` inside the worker, where it is allowed; the same CORS rules as `fetch()` |
| The shell `<\ \>` | No shell: a short list of stand-ins, held by `tests/test_shell.mjs` | The same stand-ins, reached through the host (see § 4) |
| Files, `.zyp`, catalog, deep links, i18n, WebMCP | `filestore.js`, `sidebar.js`, `catalog.js`, `zyp.js`, `module-resolver.js`, `src/i18n/`, `webmcp.js` | The same modules, not copied |

## 4. Architecture

```
zywasm32.html ── the same modules of src/playground/
      │            (sidebar, filestore, catalog, highlight, problems, gutter, hover, i18n, webmcp)
      ├─ src/zywasm/engine.js     the interface the playground already asks an engine for
      └─ Web Worker ── zymbol.wasm  (new crate zymbol-wasm, in interpreter/)
              exports:  run · check · symbols and definitions (the analyzer)
              imports:  write output · read a line · read a key · sleep · draw on the TUI
                        · the clock · the mounted files
```

- **A Web Worker.** A long run does not freeze the page, and *Stop* really stops: the worker is terminated. Today
  `BrowserTUI.abort()` wakes whatever the asynchronous interpreter is waiting on (a key, a sleep, a line) and lets it
  notice; terminating a worker needs no cooperation from the program.
- **Blocking input.** The VM is synchronous; `<<`, `<<|`, `<<|?` and `@~` must wait inside the worker. The plan uses
  `SharedArrayBuffer` + `Atomics.wait` (the page posts the line, or the key, into a shared buffer and wakes the worker).
  That needs the page to be cross-origin isolated: `Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Embedder-Policy: require-corp`. GitHub Pages cannot send headers; the Cloudflare Worker in
  `web/worker/` can, for this page and its assets only, and every resource the page loads has to be same-origin or
  carry `Cross-Origin-Resource-Policy`.
- **Mounted files.** The compiler and the semantic analysis read modules with `std::fs`, which does not exist on
  wasm32-unknown-unknown. The core needs a **source interface**, the way 3.1 gave it `Host`: the CLI's reads the disk,
  the wasm one reads the files the playground has mounted (the worker receives them before a run). `std/io` in the
  browser keeps an in-memory file system for the run, as `zymbol.js` does today — to be checked against it in F3.
- **Exact parity.** The front-end of `zymbol run` — warnings, semantic errors, the arity and export tables, the
  `--> file:line` format — lives inside `zymbol-cli/src/main.rs` (`run_program`, `check_source`, `module_decl_errors`).
  It moves into a library crate, `zymbol-driver`, that the CLI and `zymbol-wasm` both call. The page then says exactly
  what `zymbol run` says, and there is no third copy of the front-end to drift.
- **The output.** The VM writes to its own `W: Write`; in wasm that writer forwards to an imported function, flushed by
  line and before every read, so output appears as it is produced.
- **The terminal.** A `zymbol_vm::host::Terminal` implemented in `zymbol-wasm` whose methods call imports that post
  drawing commands to the page's `BrowserTUI`, and block on the shared buffer for keys.
- **The clock.** A `zymbol_intrinsics::time::Clock` reading `Date.now()` and the browser's offset
  (`Date.prototype.getTimezoneOffset`).
- **The shell.** `<\ \>` is run by `zymbol_common::shell`, which spawns a process — impossible in a browser and left
  outside `Host` by 3.1. It needs one more host entry, so that the wasm host can answer with the stand-ins `zymbol.js`
  already has and `tests/test_shell.mjs` already holds. `</ file.zy />` (a subscript) is the same question: the VM
  already takes a `SubscriptRunner`, and the wasm one compiles the mounted file and runs it.

## 5. The phases

| Phase | What | How it is known to be done | Estimate |
|---|---|---|---|
| F1 | In the core: the source interface in `zymbol-compiler` and `zymbol-semantic` (`ModuleTables`, `ModuleAnalyzer`), and `zymbol-driver` extracted from the CLI | The gate green; the CLI unchanged — same exit code, output, steps, calls and copies over the corpus in both engines, as 3.1 was held | 1.5–2 days |
| F2 | The crate `zymbol-wasm` (exports and imports as above) and a Node runner; `zywasm` as an engine in `zyquality/engines.toml`. Under Node, `<<` reads standard input synchronously (`fs.readSync`), so no worker is needed there | A four-engine consensus with 0 divergences; every exclusion in `corpus.toml` with its reason (`std/db`, and what the network or the shell answer on that machine) | 1.5 days |
| F3 | `web/zywasm32.html`: the worker with `SharedArrayBuffer`, the console, the TUI, Stop, mounted files and `.zyp`, `std/net` over synchronous XHR, the shell's stand-ins; the COOP/COEP headers in `web/worker/` | A DOM test like `test_playground_dom`; `test_shell.mjs` passing against the wasm host; the example catalog run in the page, against the CLI | 2–2.5 days |
| F4 | The "LSP" from wasm: `check` feeding `problems.js` and `gutter.js`; `zymbol-analyzer` (with its `Url` `cfg`) for the symbol index behind the hover cards and definitions | `test_check`'s parity measure run with `zywasm` | 1.5–2 days |
| F5 | The page measures itself (the same program timed on wasm and on `zymbol.js`); the Markdown twin `zywasm32.md`, `llms.txt`, licences; the script that builds `zymbol.wasm` from a named `interpreter/` commit, and a gate check that the committed file is not stale | `web`'s suites inside the gate (`zyq suite --only web`) | 1 day |

**Total: 8–9 days**, an estimate, not a measurement. Measured from 2026-10-20 it does not fit before 2026-11-01;
it fits in the margin up to 2026-11-11. Where a phase can be split, the order is F1 → F2 → F3 → `check` of F4 → the
analyzer of F4 → F5: every step leaves something verified behind.

## 6. Decisions, with the option this plan takes

| Id | The question | This plan takes | The alternative |
|---|---|---|---|
| D-W1 | Where does the page live? | `web/zywasm32.html`, at the root, with its twin `zywasm32.md`: `CLAUDE.md` keeps entry points at the root because published URLs are part of the site's contract | `web/playground/zywasm32.html` |
| D-W2 | How does input wait? | `SharedArrayBuffer` + `Atomics.wait` in a Web Worker, with COOP/COEP sent by the Cloudflare Worker for this page | Asyncify (binaryen's `wasm-opt`): no headers needed, but a larger and slower module, and the tool is not installed |
| D-W3 | Diagnostics in the reader's language? | First version: the Rust text, translated where the diagnostic's code is one `problems.js` already knows | Stable codes and parameters for every Rust diagnostic, now — several more days |
| D-W4 | TUI in HTML or on canvas? | Reuse today's `BrowserTUI`, which is already a canvas, so nothing gets worse; the console stays HTML | An HTML grid of `<span>`s, later |
| D-W5 | Is the `.wasm` committed to `web/`? | Yes, built by a script from a named `interpreter/` commit and recorded with it: `web/` has no build step and GitHub Pages serves the sources as they are. The gate checks it is not stale | Built in CI and deployed as an artifact |
| D-W6 | `opt-level = 3` or `"z"`? | Decide on the page with F5's numbers: `"z"` is 155 KB lighter gzipped and compiles in ~1.4 s instead of ~3.7 s; `3` is faster once TurboFan is done | — |

## 7. What can go wrong

- **Cross-origin isolation breaks a resource.** With `require-corp`, anything cross-origin without
  `Cross-Origin-Resource-Policy` stops loading. Audit what `playground.html` loads (fonts, scripts) before F3.
- **The TurboFan compile on a modest device.** Liftoff starts executing at once, but the optimising compile competes for
  the CPU. Measure on a low-end device, not only on this machine, before recommending the page to anyone.
- **Deep recursion.** wasm's stack is 1 MiB by default and the VM's depth guard (`zymbol_common::depth`) is off unless
  someone marks the stack base. Set the stack size at link time and mark the base, or `MAX_ACTIVE_CALLS` (10 000) will
  trap before it is reached.
- **`std/net` is synchronous** (`Host::http`). A synchronous `XMLHttpRequest` is allowed in a worker (it is the main
  thread where browsers deprecate it), and it obeys the same CORS rules as the `fetch()` `zymbol.js` uses — check that
  the two answer the same for the same URL, failures included, before calling F3 done.
- **Two front-ends in the browser.** `playground.html` keeps `zymbol.js`'s checker and `zywasm32.html` gets Rust's.
  Where they disagree, `test_check` already measures it; the page must not hide which one it is showing.

## 8. How to resume

1. Read this file, `interpreter/ROADMAP_V0011_ES.md` § 3.1 and § 3.4, and `zymbol-design/HOW_TO_CHANGE_ZYMBOL.md`.
2. Record the author's decision to start, in its own commit, in the roadmap.
3. The prototype: `interpreter/target/w32/proto-main/` (ignored by git; rebuild with
   `cargo build --release --target wasm32-unknown-unknown --target-dir ../wasm-main` from inside it). Its runner was a
   twenty-line Node script that instantiates the module, writes the source into its memory and reads the output back.
4. Run the core's tests on 32 bits: `rustup target add wasm32-wasip1`, and
   `CARGO_TARGET_WASM32_WASIP1_RUNNER="node --no-warnings <runner.mjs>" cargo test -p zymbol-vm --lib --target wasm32-wasip1`,
   where the runner instantiates the test binary with `node:wasi`.
5. Follow the phases in order; each ends with `cargo test --workspace --release --features db` and `zyq suite`.

Left for later by the author's decision: tests on **wasm64** (2026-10-20). Related and postponed: **`.zyb`** (3.3,
perhaps resumed on 2026-10-23) — an engine that only runs bytecode would need no compiler in the browser, which bears on
D-W6's size.

---

*Authorship and AI use: this document follows the convention of `interpreter/README.md` § Authorship & AI
Collaboration. Decisions about the language are the author's; the measurements and the writing are engineering work
assisted by Claude Code under the author's direction.*
