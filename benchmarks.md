# How fast is Zymbol?

Sixteen programs, five languages, the same printed answer, measured on 2026-10-18. One machine, CPU time per process, start-up included. Zymbol is the development branch v0.0.11 (commit `7ef269c`) on its register VM; the release is v0.0.10.

The programs, their twins and the script that measured them: https://github.com/zymbol-lang/zyquality/tree/v0.0.11/bench/big

## At a glance

CPU time relative to CPython, geometric mean over the sixteen programs — lower is faster.

| Language | Kind | Relative to Python |
|---|---|---:|
| JavaScript (Node, V8) v24.16.0 | JIT compiler | 0.26× |
| Zymbol (VM) v0.0.11 | interpreter | 0.53× |
| Perl v5.40.1 | interpreter | 0.90× |
| Python (CPython) 3.13.5 | interpreter | 1.00× |
| Julia 1.12.7 | JIT compiler | 2.99× |

Zymbol is 1.9× faster than Python and the fastest of the three interpreters. Node (V8) is a JIT compiler and is 2.1× faster than Zymbol, as expected. Julia compiles every function before it first runs it; on programs that take under a second, that compilation is most of what a run costs.

## Program by program

Milliseconds of CPU time, median of 5 runs, start-up included. 80 of 80 twins printed exactly what the Python twin printed.

| Program | What it does | Zymbol | Node | Perl | Python | Julia |
|---|---|---:|---:|---:|---:|---:|
| `array_update` | write 3 000 slots of a 20 000-slot array | 4.1 | 40 | 9.1 | 11 | 697 |
| `collatz` | longest Collatz chain below 60 000 | 346 | 47 | 555 | 804 | 672 |
| `fib_rec` | naive recursive fib(34) — 18 million calls | 903 | 98 | 2531 | 755 | 701 |
| `hof_chain` | map, filter, reduce over 100 000 numbers, 25 times | 321 | 211 | 279 | 404 | 1008 |
| `loop_mod` | ten million turns of integer arithmetic | 426 | 191 | 522 | 1288 | 815 |
| `mandelbrot` | 250×250 Mandelbrot set, floating point | 171 | 52 | 440 | 541 | 699 |
| `match_loop` | classify three million numbers by range | 244 | 52 | 650 | 513 | 645 |
| `matmul` | 150×150 integer matrix product | 409 | 56 | 348 | 680 | 772 |
| `nqueens` | every solution of 10 queens | 262 | 49 | 505 | 301 | 1156 |
| `primes_trial` | primes below 300 000 by trial division | 206 | 51 | 387 | 551 | 776 |
| `sort_builtin` | sort 600 000 numbers, natural order | 96 | 119 | 239 | 270 | 863 |
| `sort_cmp_300k` | sort 300 000 numbers with a comparator | 353 | 126 | 268 | 606 | 987 |
| `sort_cmp_4k` | sort 4 000 numbers with a comparator | 7.6 | 32 | 5.1 | 27 | 969 |
| `strings_scan_long` | count vowels in an 88 000-character text | 27 | 54 | 79 | 62 | 970 |
| `strings_scan_short` | count vowels in a short text, 200 times | 62 | 54 | 113 | 86 | 665 |
| `tak` | Takeuchi function, deep recursion | 365 | 65 | 1246 | 304 | 680 |
| geometric mean, Python = 1 | | 0.53× | 0.26× | 0.90× | 1.00× | 2.99× |

Zymbol is slower than Python on `fib_rec` and `tak`, the two deep-recursion programs: a call still costs Zymbol more than it costs CPython. Perl is faster on `hof_chain`, `matmul`, `sort_cmp_300k`, `sort_cmp_4k`. Zymbol is the fastest interpreter on 10 of the sixteen.

## From v0.0.10 to v0.0.11

CPU time relative to Python. v0.0.10 ran the tree-walker by default; its register VM was `zymbol run --vm`. From v0.0.11 the VM is the default.

| Program | v0.0.10 default (tree-walker) | v0.0.10 `--vm` | v0.0.11 |
|---|---:|---:|---:|
| `array_update` | 0.29× | 0.20× | 0.16× |
| `collatz` | 2.62× | 0.58× | 0.42× |
| `fib_rec` | 11.43× | 1.40× | 1.23× |
| `hof_chain` | 5.20× | 1.03× | 0.79× |
| `loop_mod` | 2.02× | 0.60× | 0.33× |
| `mandelbrot` | 5.32× | 0.42× | 0.30× |
| `match_loop` | 3.56× | 0.72× | 0.46× |
| `matmul` | 5.61× | 0.79× | 0.63× |
| `nqueens` | 9.11× | 1.13× | 0.85× |
| `primes_trial` | 3.82× | 0.51× | 0.37× |
| `sort_builtin` | 1.48× | 0.44× | 0.34× |
| `sort_cmp_300k` | 5.27× | 1.14× | 0.60× |
| `sort_cmp_4k` | 2.26× | 0.94× | 0.37× |
| `strings_scan_long` | 3.10× | 7.98× | 0.68× |
| `strings_scan_short` | 3.54× | 1.53× | 0.60× |
| `tak` | 16.64× | 1.66× | 1.20× |
| geometric mean | 3.67× | 0.88× | 0.51× |

v0.0.11 is 7.2× faster than v0.0.10 as it ran by default, and 1.7× faster than v0.0.10's VM (2.0× fewer instructions). Nothing in the language changed: every program prints what it printed.

## How it was measured

AMD Ryzen 7 4800H with Radeon Graphics, Linux 6.12.111+deb13-amd64.

| Language | Version | Kind |
|---|---|---|
| Zymbol (VM) | v0.0.11 (development, 7ef269c) | interpreter |
| JavaScript (Node, V8) | v24.16.0 | JIT compiler |
| Perl | v5.40.1 | interpreter |
| Python (CPython) | 3.13.5 | interpreter |
| Julia | 1.12.7 | JIT compiler |

- Each program is written once per language with the same algorithm and shape as the Python twin; its printed line is compared with Python's before any figure is kept. Julia's twins put their code inside a `main()` function, because a global in Julia is untyped.
- CPU time is `perf stat` `task-clock` for the whole process, median of 5 runs: start-up, parsing, compiling and running.
- Start-up of an empty program, in ms: Zymbol (VM) 2.0, JavaScript (Node, V8) 28, Perl 2.2, Python (CPython) 10, Julia 165.
- Not a ranking of languages: sixteen small programs say how fast an interpreter runs loops, calls, arithmetic, collections and text, not how fast real applications are.
- v0.0.11 is not released yet; these are figures of its development branch.

Reproduce, from `zyquality/bench/big/`: `ZYMBOL_BIN=zymbol python3 langs.py --runs 5 --json out.json`.
