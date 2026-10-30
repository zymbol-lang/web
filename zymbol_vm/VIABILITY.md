# Is `zymbol_vm.js` viable? — the evidence

> **The question, as the author put it (2026-10-29):** `zymbol_vm.js` is to become the only
> engine of the web, replacing `zymbol.js`, which is too slow — **if and only if it is
> really viable**; otherwise it is dropped, **with evidence either way**. As close to the
> Rust VM as possible, so that one day both can run the same `.zyb`.
>
> **Short answer so far:** the **machine** is viable, measured — it runs the Rust
> compiler's bytecode with the Rust VM's output and the Rust VM's exact `--count`, about
> 20 times faster than `zymbol.js`. The **compiler** it still needs in the browser is the
> open half: not built, not measured.
>
> Every figure below was measured on 2026-10-29, on branch `Zymbol_VM.js` (base `v0.0.11`,
> `8a8de5a`), against `zymbol 0.0.11` built from `interpreter/` with `--features db`.
> Re-run before quoting: `node tests/probe.mjs`, `node tests/bench.mjs`.

## 1. Method

The two machines get **the same bytecode**: the Rust compiler's, written out by
`tools/zyb_dump` (the call `zymbol run` makes). So a difference can only be the machine's.
`tests/probe.mjs` runs every corpus file the way `zyq` runs an engine — absolute path,
empty working directory, `x.input` as stdin — and compares stdout, the runtime error with
its `-->` line, the exit status, and `--count`'s `steps`, `calls` and `copied`.
The analyzer's warnings are not compared: they are the front-end's, and this machine has
none yet.

## 2. The corpus

```text
714 files under zyquality/corpus
  agree       552  (steps, calls and copied identical in 552)
  diverge     0
  not yet     47
  refused     22   (the Rust front-end refuses them before running)
  module      74
  uncompiled  19   (error tests the compiler is meant to refuse)
```

**Every file that runs agrees, and agrees to the instruction**: the same number of
instructions dispatched, the same calls, the same elements copied by copy-on-write. The
47 not yet need a host or a library, not the language:

| What they need | Files | Nature |
|---|---|---|
| `<\ \>` and `</ />` (BashExec, Execute) | 12 | a process — no browser has one (`BASH_EXEC` for zyjs too) |
| The full-screen terminal (PrintAt, EnterTui, ClearScreen, QueryTerminalSize, ReadKey) | 13 | a terminal host in the page |
| `std/json` | 9 | pure — to port |
| `std/db` | 5 | ODBC — no browser equivalent (`STD_DB` for zyjs too) |
| `std/io` | 4 | a virtual file system, as zymbol.js has |
| `std/net`, `std/time`, `std/term` | 4 | the host: `fetch`, the clock, display width |

The corpus uses 162 of the 172 instructions; `machine.js` implements 159. The 13 it does
not are those hosts (8) and five the compiler never emits for the corpus (`ArraySet` and
the four fused `StrSplit*`).

## 3. Speed

`tests/bench.mjs` on the sixteen programs of `zyquality/bench/big/zy/` — the set the
v0.0.11 roadmap measured `zymbol.js` (×61 of the native VM) and the wasm prototype (×3.2)
on. Whole-process elapsed time, Node's start-up included; every run's output checked
against the native one. One run each (the zymbol.js column takes minutes):

| Program | native VM | zymbol_vm.js | zymbol.js | zymbol.js ÷ zymbol_vm.js |
|---|---|---|---|---|
| array_update | 7 ms | 79 ms | 207 ms | 2.6 |
| collatz | 341 ms | 554 ms | 37.09 s | 66.9 |
| fib_rec | 948 ms | 2.24 s | 80.34 s | 35.8 |
| hof_chain | 360 ms | 2.03 s | 15.60 s | 7.7 |
| loop_mod | 540 ms | 1.10 s | 37.75 s | 34.2 |
| mandelbrot | 177 ms | 1.22 s | 26.34 s | 21.6 |
| match_loop | 278 ms | 598 ms | 22.32 s | 37.3 |
| matmul | 367 ms | 588 ms | 26.93 s | 45.8 |
| nqueens | 302 ms | 744 ms | 47.42 s | 63.8 |
| primes_trial | 215 ms | 397 ms | 24.98 s | 62.9 |
| sort_builtin | 111 ms | 399 ms | 3.52 s | 8.8 |
| sort_cmp_300k | 376 ms | 1.35 s | 18.07 s | 13.4 |
| sort_cmp_4k | 15 ms | 140 ms | 354 ms | 2.5 |
| strings_scan_long | 32 ms | 173 ms | 2.43 s | 14.0 |
| strings_scan_short | 66 ms | 242 ms | 4.45 s | 18.4 |
| tak | 380 ms | 1.23 s | 33.13 s | 27.0 |

Geometric means: **zymbol_vm.js ×3.46 of the native VM** (×3.25 and ×3.52 in two
median-of-3 runs the same day), **zymbol.js ×68.0**, so **zymbol.js is ×19.7 slower than
zymbol_vm.js**. Nothing in the machine has been optimised yet; the short programs are
mostly Node's start-up.

Not counted for zymbol_vm.js: compiling. The bytecode came from Rust (2–10 ms per
program). A JavaScript compiler will add its own time to every run in the browser.

### GO, a real program

`tests/bench_go.mjs`: GO's fixed-seed self-play, `試験/自戦試験.zy` (seed 424242) — the
workload `GO/BENCHMARK.md` measures releases on. Six files compiled into one program
(105 KB of bytecode as JSON, 15 ms for Rust to compile). Median of 5 for the two VMs, the
engines alternating within each round; one run of zymbol.js:

| Board | Moves | native VM | zymbol_vm.js | zymbol.js | zymbol.js ÷ zymbol_vm.js |
|---|---|---|---|---|---|
| 9×9 | 103 | 80 ms | 406 ms (×5.1) | 5.55 s (×69.6) | 13.7 |
| 13×13 | 217 | 255 ms | 961 ms (×3.8) | 20.74 s (×81.3) | 21.6 |
| 19×19 | 454 | 1.03 s | 3.10 s (×3.0) | 86.54 s (×83.7) | 27.9 |

**The same game in all three engines**, move for move, ending in the same scores; and
zymbol_vm.js's `--count` equals the native one on every board — 19×19 is 122 805 747
instructions, 2 077 200 calls and 16 110 794 elements copied in both. The native column
agrees with GO's own record of 2026-10-27 (82 ms, 272 ms, 1.04 s). The gap to native
narrows with the board because Node's start-up and V8's warm-up are a fixed cost.

What GO's playground scripts need is more: `go.zy` and `観戦.zy` are full-screen programs
(`>>|`, 51 `>>~` sites, `<<|`, `std/term`), and those hosts are not built — see §7.

## 4. The three risks of the roadmap's stage 4

**Copy-on-write without a reference count.** The machine keeps one (`retain`/`release` where
Rust clones and drops). The pattern that is quadratic in zymbol.js — pass a collection to a
function, then edit it:

```zymbol
largo(a) { <~ a$# }
arr = []
total = 0
@ i:1..16000 {
    total = total + largo(arr)
    arr$+ i
}
>> arr$# " " total ¶
```

| n | Rust VM `copied=` | zymbol_vm.js `copied=` | zymbol_vm.js | zymbol.js |
|---|---|---|---|---|
| 4 000 | 0 | 0 | 96 ms | 200 ms |
| 8 000 | 0 | 0 | 117 ms | 357 ms |
| 16 000 | 0 | 0 | 121 ms | 1 146 ms |
| 32 000 | 0 | 0 | 109 ms | 6 079 ms |

And `copied=` agrees on all 552 corpus files: the count is right, not just cheap here.

**A `<<` inside a lambda.** `HofNext` (v0.0.11) runs `$>`, `$|`, `$<` on the machine's own
frames, so a `<<` there stops the machine and `resume` goes on. With a host that never has
the line at hand (`tests/suspend.mjs`), a `<<` inside a `$>` lambda waited three times while
the event loop kept running, and gave the Rust VM's output and counts (`steps=44 calls=3
copied=0`). Still a nested call: `$^` with a comparator — a `<<` inside one cannot wait yet
(it is refused, `zymbol_vm.js: not yet`).

**Int against Float.** Int is a JS number, Float a box: every corpus file agrees on it,
`mandelbrot` included. It is the likeliest place to win time back (×6.9 there).

## 4b. The compiler, and the gate (2026-10-30)

**The bytecode is Rust's.** `src/zymbol/vm/compiler.js` ports `zymbol-compiler` function
for function, fed by zymbol.js's parser through an adapter that rebuilds zymbol-ast's tree
(`rustast.js`). Both halves are held to Rust's own output:

| | corpus | example pool | 12 applications |
|---|---|---|---|
| parser tree = `zyb_dump --ast` (`ast_diff.mjs`) | 711 / 711 | 332 / 332 | 263 / 263 files |
| bytecode = `zyb_dump` (`compile_diff.mjs`) | 637 / 637 (16 refusals alike) | 321 / 321 | every runnable program |

Not compared: the order inside a run of `LoadUnit` (Rust takes it from a `HashMap`) and a
column (no output shows one). Everything else — registers, jumps, string pool, globals,
source lines — is equal. Two Rust defects the port found are corrected in it and
reproduced under `faithful` for this comparison (HALLAZGOS.md, BUG-VMJS-004, -005).

**The gate, with zymbol_vm.js in zyjs's place** (`ZYJS_HARNESS=…/run_one.mjs`, before it had an engine id of its own, `zyjsvm`):

| | zymbol_vm.js | zymbol.js |
|---|---|---|
| `zyq consensus`, three engines | 708 / 714 agree, 0 diverge | 708 / 714, 0 diverge |
| `zyq expect --engines zyjs` | 636 match | 635 match |
| `zyq consensus --strict` | 26 differ | 29 differ (the 26 among them) |
| example pool, against zytw | 216 agree, 0 diverge | 216, 0 |

Every golden zymbol_vm.js misses, zymbol.js misses too: 29 goldens recorded in the Rust
CLI's colour with a source excerpt, which neither JavaScript engine prints.

## 5. What a browser needs that a CLI does not

**Time slices.** `fib(34)` with a slice every 1 000 000 instructions: 101 slices, the event
loop ran between each, the same answer, 2.3 s against 2.24 s unsliced. A long program does
not freeze the page, and it costs nothing measurable.

**No SharedArrayBuffer, no worker required.** Waiting is the machine returning; the page
needs no cross-origin isolation, which GitHub Pages could not give.

## 6. Found on the way

Six findings, filed in [`HALLAZGOS.md`](HALLAZGOS.md) with their reproductions run on the
four engines: zymbol.js's `#^.N` ties (BUG-VMJS-001), a `$-` that brings both Rust engines
down (-002), a lone `\\` zymbol.js refuses (-003), the Rust VM's source table that shifts
after a block (-004), a left operand the Rust VM evaluates twice (-005), and a module
zymbol.js refuses that Rust runs — GoL does not start in the browser (-006).

## 7. What this does not show yet

- **Firefox and Safari.** Node 24 and headless Chrome are measured; the other two engines are not.
- **`.zyb` interop.** zymbol_vm.js builds the bytecode Rust builds, in JSON. A binary `.zyb`
  needs, on the Rust side, a versioned header and a verifier at load (the Rust VM reads
  registers unchecked), which is the roadmap's 3.3 for v0.0.12.
- **`<<` inside a `$^` comparator** cannot wait in a browser (GAP-VMJS-001).
- **std/** is reached through zymbol.js's implementations (`vm/stdlib.js`); the day zymbol.js
  goes, those functions move.
