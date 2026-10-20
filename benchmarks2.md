# How fast is Zymbol?

Sixteen programs, eight languages and four Zymbol engines, the same printed answer, measured on 2026-10-20. One machine, elapsed time per process. Zymbol v0.0.11 is the development branch (commit `52ad7d3`); the release is v0.0.10. The HTML page lets the reader pick any language or engine as the reference; this twin carries the figures against Zymbol v0.0.11 = 1.00.

The programs, their twins and the script that measured them: https://github.com/zymbol-lang/zyquality/tree/v0.0.11/bench/big

## Against Zymbol v0.0.11

Geometric mean of elapsed time. Whole process: all sixteen programs, start-up included. Start-up subtracted: each language's own empty-program time taken off — Zymbol's too — over the 11 programs Zymbol takes 100 ms or more on, still against Zymbol's whole process = 1.00.

| Language or engine | Kind | Whole process | Start-up subtracted | Its start-up |
|---|---|---:|---:|---:|
| Zymbol v0.0.11 · VM | register VM, the default | 1.00× | 0.98× | 4.9 ms |
| Zymbol v0.0.11 · tree-walker | tree-walker, --tw | 6.45× | 8.42× | 2.2 ms |
| Zymbol v0.0.10 · VM | register VM, --vm | 1.59× | 1.38× | 2.1 ms |
| Zymbol v0.0.10 · tree-walker | tree-walker, its default | 6.84× | 8.91× | 1.9 ms |
| Lua 5.4.7 | PUC Lua, register VM | 0.56× | 0.43× | 1.1 ms |
| PHP 8.4.26 | Zend VM; opcache JIT off on the command line | 0.56× | 0.37× | 13 ms |
| Ruby 3.3.8 | CRuby VM; YJIT off without --yjit | 1.63× | 0.80× | 57 ms |
| Python 3.13.5 | CPython | 1.64× | 1.60× | 9.6 ms |
| Perl v5.40.1 | interpreter | 1.67× | 1.60× | 1.8 ms |
| JavaScript · Node v24.16.0 | JIT compiler | 0.41× | 0.12× | 24 ms |
| Julia 1.12.7 | JIT compiler | 1.57× | 0.19× | 163 ms |

Zymbol v0.0.11 is the third fastest of the six interpreters. Lua is faster on 13 of the sixteen programs and PHP is faster on 13 of the sixteen programs. Zymbol is ahead of Ruby, Python and Perl in the mean. With start-up subtracted, PHP (0.37×), Lua (0.43×) and Ruby (0.80×) are ahead of it, and Julia (0.19×) comes next to JavaScript (0.12×). PHP's opcache JIT is off on the command line and Ruby's YJIT is off without `--yjit`, so both run as interpreters.

## Program by program

Milliseconds of elapsed time, median of 5 runs, start-up included. 176 of 176 twins printed exactly what the Python twin printed.

| Program | What it does | Zymbol | Zymbol TW | Zymbol 0.10 VM | Zymbol 0.10 TW | Lua | PHP | Ruby | Python | Perl | JavaScript (JIT) | Julia (JIT) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `array_update` | write 3 000 slots of a 20 000-slot array | 7.7 | 14 | 9.9 | 17 | 1.5 | 13 | 71 | 11 | 13 | 27 | 191 |
| `collatz` | longest Collatz chain below 60 000 | 355 | 1862 | 463 | 2031 | 148 | 134 | 285 | 786 | 575 | 42 | 196 |
| `fib_rec` | naive recursive fib(34) — 18 million calls | 946 | 8119 | 1012 | 8170 | 403 | 287 | 540 | 737 | 2500 | 84 | 208 |
| `hof_chain` | map, filter, reduce over 100 000 numbers, 25 times | 332 | 1977 | 424 | 2252 | 179 | 230 | 422 | 386 | 265 | 183 | 328 |
| `loop_mod` | ten million turns of integer arithmetic | 457 | 2373 | 766 | 2585 | 154 | 158 | 663 | 1216 | 525 | 178 | 217 |
| `mandelbrot` | 250×250 Mandelbrot set, floating point | 185 | 2766 | 245 | 2840 | 95 | 76 | 229 | 547 | 445 | 50 | 203 |
| `match_loop` | classify three million numbers by range | 248 | 1810 | 378 | 1868 | 101 | 124 | 346 | 511 | 647 | 49 | 198 |
| `matmul` | 150×150 integer matrix product | 398 | 3529 | 516 | 3713 | 94 | 96 | 318 | 678 | 331 | 58 | 209 |
| `nqueens` | every solution of 10 queens | 274 | 2667 | 355 | 2794 | 130 | 92 | 234 | 299 | 495 | 47 | 471 |
| `primes_trial` | primes below 300 000 by trial division | 213 | 2066 | 284 | 2153 | 77 | 72 | 210 | 542 | 381 | 44 | 213 |
| `sort_builtin` | sort 600 000 numbers, natural order | 86 | 267 | 118 | 380 | 241 | 129 | 173 | 251 | 220 | 120 | 222 |
| `sort_cmp_300k` | sort 300 000 numbers with a comparator | 345 | 3110 | 667 | 3281 | 276 | 297 | 403 | 574 | 262 | 124 | 326 |
| `sort_cmp_4k` | sort 4 000 numbers with a comparator | 14 | 44 | 11 | 32 | 10 | 15 | 60 | 16 | 13 | 40 | 311 |
| `strings_scan_long` | count vowels in an 88 000-character text | 30 | 168 | 408 | 170 | 47 | 26 | 208 | 51 | 67 | 45 | 299 |
| `strings_scan_short` | count vowels in a short text, 200 times | 52 | 313 | 135 | 331 | 65 | 38 | 292 | 83 | 116 | 41 | 196 |
| `tak` | Takeuchi function, deep recursion | 351 | 4618 | 495 | 4911 | 175 | 150 | 245 | 302 | 1243 | 52 | 204 |
| geometric mean, Zymbol v0.0.11 = 1 | | 1.00× | 6.45× | 1.59× | 6.84× | 0.56× | 0.56× | 1.63× | 1.64× | 1.67× | 0.41× | 1.57× |

## Since 2026-10-18

What changed between the commit the page of 2026-10-18 measured (`7ef269c`, benchmarks.md) and the one this page measures (`52ad7d3`). Below 1.00× is faster now.

### The two commits side by side

Both binaries built with the same cargo command, each program run once by one and once by the other, 7 times over, in the same minutes. Median CPU time in milliseconds; the steps are `zymbol run --count`, exact.

| | 52ad7d3 against 7ef269c, geometric mean |
|---|---:|
| Zymbol v0.0.11 · VM | 1.00× (no change) |
| Zymbol v0.0.11 · tree-walker | 0.91× (9% faster) |

| Program | VM 7ef269c | VM 52ad7d3 | ÷ | same steps | TW 7ef269c | TW 52ad7d3 | ÷ | same steps |
|---|---:|---:|---:|:-:|---:|---:|---:|:-:|
| `array_update` | 5.1 | 4.6 | 0.90× | yes | 16 | 14 | 0.84× | yes |
| `collatz` | 353 | 346 | 0.98× | yes | 2046 | 1835 | 0.90× | yes |
| `fib_rec` | 954 | 949 | 1.00× | no | 8333 | 7824 | 0.94× | yes |
| `hof_chain` | 335 | 343 | 1.02× | yes | 2211 | 2040 | 0.92× | yes |
| `loop_mod` | 416 | 444 | 1.07× | yes | 2729 | 2439 | 0.89× | yes |
| `mandelbrot` | 188 | 192 | 1.02× | yes | 2984 | 2769 | 0.93× | yes |
| `match_loop` | 244 | 253 | 1.04× | yes | 1854 | 1760 | 0.95× | yes |
| `matmul` | 403 | 405 | 1.00× | yes | 3674 | 3537 | 0.96× | yes |
| `nqueens` | 279 | 282 | 1.01× | no | 2788 | 2645 | 0.95× | yes |
| `primes_trial` | 224 | 223 | 0.99× | yes | 2214 | 2056 | 0.93× | yes |
| `sort_builtin` | 99 | 99 | 1.00× | yes | 391 | 274 | 0.70× | yes |
| `sort_cmp_300k` | 361 | 354 | 0.98× | yes | 3264 | 3262 | 1.00× | yes |
| `sort_cmp_4k` | 13 | 14 | 1.01× | yes | 47 | 46 | 0.98× | yes |
| `strings_scan_long` | 29 | 27 | 0.93× | yes | 190 | 161 | 0.85× | yes |
| `strings_scan_short` | 67 | 65 | 0.98× | yes | 342 | 300 | 0.88× | yes |
| `tak` | 372 | 374 | 1.01× | no | 4944 | 4722 | 0.96× | yes |

Changed by more than 5% — what repeated runs of one binary scatter — the VM: `array_update` 10% faster, `loop_mod` 7% slower and `strings_scan_long` 7% faster. The tree-walker: `array_update` 16% faster, `collatz` 10% faster, `fib_rec` 6% faster, `hof_chain` 8% faster, `loop_mod` 11% faster, `mandelbrot` 7% faster, `match_loop` 5% faster, `nqueens` 5% faster, `primes_trial` 7% faster, `sort_builtin` 30% faster, `strings_scan_long` 15% faster and `strings_scan_short` 12% faster. A VM figure that moves with the same steps is the compiler laying the VM loop out differently, not work added or taken away: building the same commit from the workspace root instead of with `-p zymbol-cli` moved `loop_mod` by 7%.

### Two runs, two days

All the languages measured on 2026-10-18 and again on 2026-10-20, elapsed milliseconds, median of 5 runs. It carries the machine as well as the change — the same v0.0.10 binary and the unchanged runtimes moved by up to 10% in the mean — so it is context, and the side-by-side figures above are the ones to quote.

| | now ÷ then, geometric mean |
|---|---:|
| Zymbol v0.0.11 · VM | 1.03× |
| Zymbol v0.0.11 · tree-walker | 0.89× |
| control: Zymbol v0.0.10 · VM, the same binary | 0.98× |
| control: Zymbol v0.0.10 · tree-walker, the same binary | 0.98× |
| control: Lua | 0.90× |
| control: PHP | 0.93× |
| control: Ruby | 0.95× |
| control: Python | 0.92× |
| control: Perl | 1.01× |
| control: JavaScript · Node | 0.91× |
| control: Julia | 0.92× |

| Program | Zymbol 2026-10-18 | Zymbol 2026-10-20 | ÷ | Zymbol TW 2026-10-18 | Zymbol TW 2026-10-20 | ÷ | control Zymbol 0.10 VM ÷ | control, other languages ÷ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `array_update` | 6.2 | 7.7 | 1.24× | 16 | 14 | 0.84× | 1.07× | 0.83× |
| `collatz` | 337 | 355 | 1.05× | 2002 | 1862 | 0.93× | 1.00× | 0.94× |
| `fib_rec` | 911 | 946 | 1.04× | 8395 | 8119 | 0.97× | 0.96× | 0.95× |
| `hof_chain` | 330 | 332 | 1.01× | 2437 | 1977 | 0.81× | 0.99× | 0.95× |
| `loop_mod` | 427 | 457 | 1.07× | 2668 | 2373 | 0.89× | 0.97× | 0.95× |
| `mandelbrot` | 185 | 185 | 1.00× | 2945 | 2766 | 0.94× | 1.02× | 0.96× |
| `match_loop` | 253 | 248 | 0.98× | 1901 | 1810 | 0.95× | 1.00× | 0.96× |
| `matmul` | 406 | 398 | 0.98× | 3864 | 3529 | 0.91× | 0.99× | 0.99× |
| `nqueens` | 270 | 274 | 1.02× | 2893 | 2667 | 0.92× | 0.99× | 0.94× |
| `primes_trial` | 204 | 213 | 1.04× | 2218 | 2066 | 0.93× | 0.96× | 0.94× |
| `sort_builtin` | 94 | 86 | 0.91× | 466 | 267 | 0.57× | 0.99× | 0.94× |
| `sort_cmp_300k` | 356 | 345 | 0.97× | 3625 | 3110 | 0.86× | 0.99× | 0.95× |
| `sort_cmp_4k` | 8.7 | 14 | 1.65× | 36 | 44 | 1.23× | 1.01× | 0.90× |
| `strings_scan_long` | 30 | 30 | 0.98× | 194 | 168 | 0.86× | 0.82× | 0.89× |
| `strings_scan_short` | 65 | 52 | 0.79× | 354 | 313 | 0.88× | 0.97× | 0.90× |
| `tak` | 359 | 351 | 0.98× | 5091 | 4618 | 0.91× | 0.98× | 0.94× |

What went into the interpreter between the two commits:

- **the tree-walker's value** shrank from 120 to 24 bytes: a function and an error moved into a box (ZYTW-019)
- **a call's result** is let go when its statement ends, unless arithmetic showed it is a number (ZYVM-022) — memory, for 0.05 % of the VM's steps
- **a position in a text** that is not ASCII is found from a crumb every 64 characters (GLB-139) — none of the sixteen programs indexes such a text
- **an edit two levels down** is written in place in the tree-walker (GLB-140) — none of the sixteen programs does one
- **std/db** stopped being a default feature (D4); the binary measured here is built with it, as the earlier one was

## From v0.0.10 to v0.0.11

Zymbol against itself — no other language here. v0.0.10 ran the tree-walker by default; its VM was `zymbol run --vm`. Elapsed milliseconds, median of 5 runs; in brackets, against v0.0.11 = 1.00.

| Program | v0.0.11 VM | v0.0.10 `--vm` | v0.0.10 tree-walker (its default) |
|---|---:|---:|---:|
| `array_update` | 7.7 ms (1.00×) | 9.9 ms (1.29×) | 17 ms (2.23×) |
| `collatz` | 355 ms (1.00×) | 463 ms (1.30×) | 2031 ms (5.72×) |
| `fib_rec` | 946 ms (1.00×) | 1012 ms (1.07×) | 8170 ms (8.64×) |
| `hof_chain` | 332 ms (1.00×) | 424 ms (1.28×) | 2252 ms (6.78×) |
| `loop_mod` | 457 ms (1.00×) | 766 ms (1.68×) | 2585 ms (5.66×) |
| `mandelbrot` | 185 ms (1.00×) | 245 ms (1.33×) | 2840 ms (15.38×) |
| `match_loop` | 248 ms (1.00×) | 378 ms (1.53×) | 1868 ms (7.54×) |
| `matmul` | 398 ms (1.00×) | 516 ms (1.30×) | 3713 ms (9.32×) |
| `nqueens` | 274 ms (1.00×) | 355 ms (1.30×) | 2794 ms (10.20×) |
| `primes_trial` | 213 ms (1.00×) | 284 ms (1.33×) | 2153 ms (10.10×) |
| `sort_builtin` | 86 ms (1.00×) | 118 ms (1.38×) | 380 ms (4.42×) |
| `sort_cmp_300k` | 345 ms (1.00×) | 667 ms (1.94×) | 3281 ms (9.52×) |
| `sort_cmp_4k` | 14 ms (1.00×) | 11 ms (0.74×) | 32 ms (2.25×) |
| `strings_scan_long` | 30 ms (1.00×) | 408 ms (13.74×) | 170 ms (5.73×) |
| `strings_scan_short` | 52 ms (1.00×) | 135 ms (2.60×) | 331 ms (6.37×) |
| `tak` | 351 ms (1.00×) | 495 ms (1.41×) | 4911 ms (13.99×) |
| geometric mean | 1.00× | 1.59× | 6.84× |

In elapsed time, v0.0.11 is 6.8× faster than v0.0.10 as it ran by default, and 1.6× faster than v0.0.10's VM. Nothing in the language changed: every program prints what it printed.

## How it was measured

AMD Ryzen 7 4800H with Radeon Graphics, Linux 6.12.111+deb13-amd64.

| Language or engine | Version |
|---|---|
| Zymbol v0.0.11 · VM | v0.0.11 (development branch, 52ad7d3) |
| Zymbol v0.0.11 · tree-walker | v0.0.11 (development branch, 52ad7d3) |
| Zymbol v0.0.10 · VM | v0.0.10 |
| Zymbol v0.0.10 · tree-walker | v0.0.10 |
| Lua | 5.4.7 |
| PHP | 8.4.26 |
| Ruby | 3.3.8 |
| Python | 3.13.5 |
| Perl | v5.40.1 |
| JavaScript · Node | v24.16.0 |
| Julia | 1.12.7 |

- Each program is written once per language with the same algorithm and shape as the Python twin; its printed line is compared with Python's before any figure is kept. Julia's twins put their code inside a `main()` function, because a global in Julia is untyped.
- Elapsed time, median of 5 runs of the whole process on an otherwise idle machine. CPU time was recorded too; it agrees for the interpreters, not for the JIT compilers, which compile on other threads — Julia used 2.9× as much CPU time as elapsed time. An earlier version of this page showed CPU time, which charged Julia for work no one waits for.
- Not a ranking of languages: sixteen small programs say how fast an interpreter runs loops, calls, arithmetic, collections and text, not how fast real applications are.
- v0.0.11 is not released yet; these are figures of its development branch.

Reproduce, from `zyquality/bench/big/`: `ZYMBOL_BIN=zymbol ZYMBOL_OLD=zymbol-0.0.10 python3 langs.py --runs 5 --json out.json`.
