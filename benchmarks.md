# How fast is Zymbol?

Sixteen programs, eight languages, the same printed answer, measured on 2026-10-18 — every figure against Zymbol v0.0.11 = 1.00. One machine, CPU time per process, start-up included. Zymbol is the development branch v0.0.11 (commit `7ef269c`) on its register VM; the release is v0.0.10.

The programs, their twins and the script that measured them: https://github.com/zymbol-lang/zyquality/tree/v0.0.11/bench/big

## At a glance

How long each language took, with Zymbol v0.0.11 = 1.00 — geometric mean of CPU time over the sixteen programs. Above 1, slower than Zymbol; below 1, faster. The last two, marked JIT, compile to machine code while they run.

| Language | Kind | Time, Zymbol = 1 |
|---|---|---:|
| Zymbol (VM) v0.0.11 | interpreter | 1.00× |
| Lua 5.4.7 | interpreter | 0.55× |
| PHP 8.4.26 | interpreter | 0.64× |
| Perl v5.40.1 | interpreter | 1.62× |
| Ruby 3.3.8 | interpreter | 1.75× |
| Python (CPython) 3.13.5 | interpreter | 1.93× |
| JavaScript (Node, V8) v24.16.0 | JIT | 0.50× |
| Julia 1.12.7 | JIT | 5.07× |

Zymbol is the third fastest of the six interpreters in the geometric mean. Among the other interpreters: Lua is 1.8× faster than Zymbol; PHP is 1.6× faster than Zymbol; Perl is 1.6× slower than Zymbol; Ruby is 1.7× slower than Zymbol; Python is 1.9× slower than Zymbol. PHP's opcache JIT is off on the command line and Ruby's YJIT is off without `--yjit`, so both run as interpreters. JavaScript (Node, V8) is 2.0× faster than Zymbol, as a JIT compiler is expected to be. Julia compiles every function before it first runs it; on programs that take under a second, that compilation is most of what a run costs.

## Program by program

Milliseconds of CPU time, median of 5 runs, start-up included. 128 of 128 twins printed exactly what the Python twin printed. Interpreters first; the JIT compilers last.

| Program | What it does | Zymbol | Lua | PHP | Perl | Ruby | Python | JavaScript (JIT) | Julia (JIT) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `array_update` | write 3 000 slots of a 20 000-slot array | 6.0 | 1.6 | 15 | 5.3 | 72 | 24 | 32 | 592 |
| `collatz` | longest Collatz chain below 60 000 | 349 | 148 | 143 | 569 | 293 | 802 | 68 | 599 |
| `fib_rec` | naive recursive fib(34) — 18 million calls | 913 | 400 | 299 | 2561 | 541 | 740 | 100 | 626 |
| `hof_chain` | map, filter, reduce over 100 000 numbers, 25 times | 324 | 189 | 240 | 277 | 441 | 420 | 206 | 1020 |
| `loop_mod` | ten million turns of integer arithmetic | 433 | 149 | 167 | 518 | 679 | 1275 | 196 | 731 |
| `mandelbrot` | 250×250 Mandelbrot set, floating point | 177 | 80 | 87 | 439 | 252 | 540 | 55 | 625 |
| `match_loop` | classify three million numbers by range | 251 | 106 | 136 | 661 | 342 | 524 | 54 | 576 |
| `matmul` | 150×150 integer matrix product | 407 | 108 | 95 | 350 | 338 | 673 | 72 | 659 |
| `nqueens` | every solution of 10 queens | 269 | 129 | 92 | 503 | 250 | 297 | 51 | 1166 |
| `primes_trial` | primes below 300 000 by trial division | 215 | 78 | 72 | 401 | 223 | 602 | 61 | 753 |
| `sort_builtin` | sort 600 000 numbers, natural order | 96 | 251 | 145 | 246 | 192 | 272 | 115 | 784 |
| `sort_cmp_300k` | sort 300 000 numbers with a comparator | 349 | 284 | 308 | 257 | 408 | 610 | 129 | 1002 |
| `sort_cmp_4k` | sort 4 000 numbers with a comparator | 8.5 | 3.8 | 27 | 6.8 | 61 | 27 | 42 | 998 |
| `strings_scan_long` | count vowels in an 88 000-character text | 29 | 52 | 28 | 82 | 215 | 62 | 61 | 988 |
| `strings_scan_short` | count vowels in a short text, 200 times | 67 | 70 | 39 | 128 | 295 | 98 | 54 | 565 |
| `tak` | Takeuchi function, deep recursion | 363 | 172 | 166 | 1262 | 256 | 297 | 65 | 724 |
| geometric mean, Zymbol = 1 | | 1.00× | 0.55× | 0.64× | 1.62× | 1.75× | 1.93× | 0.50× | 5.07× |

Zymbol is the third fastest of the six interpreters. Lua is faster on 13 of the sixteen and PHP is faster on 13 of the sixteen — both are mature virtual machines with decades of tuning behind them, and Lua's is a register machine like Zymbol's. Zymbol is ahead of Perl, Ruby and Python in the mean, and behind one of them on a few programs: Perl on `array_update`, `hof_chain`, `matmul`, `sort_cmp_300k`, `sort_cmp_4k`; Ruby on `collatz`, `fib_rec`, `matmul`, `nqueens`, `tak`; Python on `fib_rec`, `tak`. The deep-recursion programs, `fib_rec` and `tak`, are where a call still costs Zymbol most. Zymbol is the fastest interpreter on 1 of the sixteen.

## From v0.0.10 to v0.0.11

CPU time with Zymbol v0.0.11 = 1.00. v0.0.10 ran the tree-walker by default; its register VM was `zymbol run --vm`. From v0.0.11 the VM is the default.

| Program | v0.0.11 | v0.0.10 `--vm` | v0.0.10 default (tree-walker) | Python |
|---|---:|---:|---:|---:|
| `array_update` | 1.00× | 1.24× | 1.77× | 6.11× |
| `collatz` | 1.00× | 1.37× | 6.23× | 2.38× |
| `fib_rec` | 1.00× | 1.13× | 9.26× | 0.81× |
| `hof_chain` | 1.00× | 1.31× | 6.62× | 1.27× |
| `loop_mod` | 1.00× | 1.83× | 6.17× | 3.06× |
| `mandelbrot` | 1.00× | 1.37× | 17.49× | 3.29× |
| `match_loop` | 1.00× | 1.55× | 7.66× | 2.15× |
| `matmul` | 1.00× | 1.26× | 8.96× | 1.60× |
| `nqueens` | 1.00× | 1.32× | 10.65× | 1.17× |
| `primes_trial` | 1.00× | 1.36× | 10.24× | 2.68× |
| `sort_builtin` | 1.00× | 1.29× | 4.35× | 2.94× |
| `sort_cmp_300k` | 1.00× | 1.90× | 8.80× | 1.67× |
| `sort_cmp_4k` | 1.00× | 2.50× | 6.04× | 2.68× |
| `strings_scan_long` | 1.00× | 11.69× | 4.54× | 1.46× |
| `strings_scan_short` | 1.00× | 2.57× | 5.94× | 1.68× |
| `tak` | 1.00× | 1.38× | 13.83× | 0.83× |
| geometric mean | 1.00× | 1.72× | 7.15× | 1.95× |

v0.0.11 is 7.2× faster than v0.0.10 as it ran by default, and 1.7× faster than v0.0.10's VM (2.0× fewer instructions). Nothing in the language changed: every program prints what it printed.

## How it was measured

AMD Ryzen 7 4800H with Radeon Graphics, Linux 6.12.111+deb13-amd64.

| Language | Version | Kind |
|---|---|---|
| Zymbol (VM) | v0.0.11 (development branch, 7ef269c) | interpreter |
| Lua | 5.4.7 | interpreter |
| PHP | 8.4.26 | interpreter |
| Perl | v5.40.1 | interpreter |
| Ruby | 3.3.8 | interpreter |
| Python (CPython) | 3.13.5 | interpreter |
| JavaScript (Node, V8) | v24.16.0 | JIT compiler |
| Julia | 1.12.7 | JIT compiler |

- Each program is written once per language with the same algorithm and shape as the Python twin; its printed line is compared with Python's before any figure is kept. Julia's twins put their code inside a `main()` function, because a global in Julia is untyped.
- CPU time is user + system time of the whole process as the kernel accounts it, median of 5 runs: start-up, parsing, compiling and running.
- Start-up of an empty program, in ms: Zymbol (VM) 2.6, Lua 2.2, PHP 14, Perl 2.4, Ruby 72, Python (CPython) 11, JavaScript (Node, V8) 29, Julia 190.
- Not a ranking of languages: sixteen small programs say how fast an interpreter runs loops, calls, arithmetic, collections and text, not how fast real applications are.
- v0.0.11 is not released yet; these are figures of its development branch.

Reproduce, from `zyquality/bench/big/`: `ZYMBOL_BIN=zymbol python3 langs.py --runs 5 --json out.json`.
