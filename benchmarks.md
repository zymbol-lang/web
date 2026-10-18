# How fast is Zymbol?

Sixteen programs, eight languages, the same printed answer, measured on 2026-10-18 — every figure against Zymbol v0.0.11 = 1.00. One machine, elapsed time per process, start-up included. Zymbol is the development branch v0.0.11 (commit `7ef269c`) on its register VM; the release is v0.0.10.

The programs, their twins and the script that measured them: https://github.com/zymbol-lang/zyquality/tree/v0.0.11/bench/big

## At a glance

How long each language took, with Zymbol v0.0.11 = 1.00 — geometric mean of elapsed time over the sixteen programs. Above 1, slower than Zymbol; below 1, faster. The last two, marked JIT, compile to machine code while they run.

| Language | Kind | Whole process, Zymbol = 1 | Start-up subtracted, Zymbol = 1 |
|---|---|---:|---:|
| Zymbol (VM) v0.0.11 | interpreter | 1.00× | 1.00× |
| PHP 8.4.26 | interpreter | 0.63× | 0.35× |
| Lua 5.4.7 | interpreter | 0.64× | 0.47× |
| Perl v5.40.1 | interpreter | 1.75× | 1.67× |
| Ruby 3.3.8 | interpreter | 1.86× | 0.83× |
| Python (CPython) 3.13.5 | interpreter | 1.89× | 1.69× |
| JavaScript (Node, V8) v24.16.0 | JIT | 0.48× | 0.13× |
| Julia 1.12.7 | JIT | 1.81× | 0.17× |

Start-up subtracted: each language's empty-program time taken off every figure, over the 11 programs Zymbol takes 100 ms or more on — Julia comes to 0.17×, next to JavaScript's 0.13×; among the interpreters, PHP (0.35×), Lua (0.47×) and Ruby (0.83×) are then ahead of Zymbol.

Zymbol is the third fastest of the six interpreters in the geometric mean. Among the other interpreters: PHP is 1.6× faster than Zymbol; Lua is 1.6× faster than Zymbol; Perl is 1.7× slower than Zymbol; Ruby is 1.9× slower than Zymbol; Python is 1.9× slower than Zymbol. PHP's opcache JIT is off on the command line and Ruby's YJIT is off without `--yjit`, so both run as interpreters. JavaScript (Node, V8) is 2.1× faster than Zymbol, as a JIT compiler is expected to be. Julia compiles every function before it first runs it and starts in 185 ms before running anything; on programs this short, start-up is a large part of its figures.

## Program by program

Milliseconds of elapsed time, median of 5 runs, start-up included. 128 of 128 twins printed exactly what the Python twin printed. Interpreters first; the JIT compilers last.

| Program | What it does | Zymbol | PHP | Lua | Perl | Ruby | Python | JavaScript (JIT) | Julia (JIT) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `array_update` | write 3 000 slots of a 20 000-slot array | 5.8 | 14 | 3.3 | 12 | 77 | 20 | 32 | 220 |
| `collatz` | longest Collatz chain below 60 000 | 341 | 133 | 147 | 558 | 286 | 790 | 52 | 208 |
| `fib_rec` | naive recursive fib(34) — 18 million calls | 925 | 303 | 397 | 2551 | 550 | 762 | 97 | 218 |
| `hof_chain` | map, filter, reduce over 100 000 numbers, 25 times | 321 | 240 | 198 | 269 | 444 | 414 | 196 | 371 |
| `loop_mod` | ten million turns of integer arithmetic | 421 | 169 | 166 | 527 | 663 | 1272 | 180 | 236 |
| `mandelbrot` | 250×250 Mandelbrot set, floating point | 170 | 75 | 96 | 433 | 249 | 528 | 44 | 215 |
| `match_loop` | classify three million numbers by range | 249 | 135 | 108 | 644 | 352 | 520 | 50 | 211 |
| `matmul` | 150×150 integer matrix product | 394 | 83 | 104 | 353 | 328 | 675 | 55 | 222 |
| `nqueens` | every solution of 10 queens | 268 | 91 | 141 | 515 | 248 | 312 | 69 | 513 |
| `primes_trial` | primes below 300 000 by trial division | 207 | 79 | 92 | 383 | 227 | 539 | 45 | 226 |
| `sort_builtin` | sort 600 000 numbers, natural order | 90 | 145 | 260 | 246 | 197 | 289 | 124 | 238 |
| `sort_cmp_300k` | sort 300 000 numbers with a comparator | 359 | 308 | 289 | 277 | 421 | 635 | 125 | 365 |
| `sort_cmp_4k` | sort 4 000 numbers with a comparator | 7.1 | 17 | 4.7 | 6.8 | 79 | 18 | 43 | 339 |
| `strings_scan_long` | count vowels in an 88 000-character text | 30 | 30 | 58 | 69 | 223 | 53 | 53 | 324 |
| `strings_scan_short` | count vowels in a short text, 200 times | 58 | 38 | 78 | 129 | 310 | 87 | 52 | 210 |
| `tak` | Takeuchi function, deep recursion | 364 | 165 | 172 | 1241 | 262 | 309 | 62 | 214 |
| geometric mean, Zymbol = 1 | | 1.00× | 0.63× | 0.64× | 1.75× | 1.86× | 1.89× | 0.48× | 1.81× |

Zymbol is the third fastest of the six interpreters. PHP is faster on 12 of the sixteen and Lua is faster on 13 of the sixteen — both are mature virtual machines with decades of tuning behind them, and Lua's is a register machine like Zymbol's. Zymbol is ahead of Perl, Ruby and Python in the mean, and behind one of them on a few programs: Perl on `hof_chain`, `matmul`, `sort_cmp_300k`, `sort_cmp_4k`; Ruby on `collatz`, `fib_rec`, `matmul`, `nqueens`, `tak`; Python on `fib_rec`, `tak`. The deep-recursion programs, `fib_rec` and `tak`, are where a call still costs Zymbol most. Zymbol is the fastest interpreter on 2 of the sixteen.

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
| PHP | 8.4.26 | interpreter |
| Lua | 5.4.7 | interpreter |
| Perl | v5.40.1 | interpreter |
| Ruby | 3.3.8 | interpreter |
| Python (CPython) | 3.13.5 | interpreter |
| JavaScript (Node, V8) | v24.16.0 | JIT compiler |
| Julia | 1.12.7 | JIT compiler |

- Each program is written once per language with the same algorithm and shape as the Python twin; its printed line is compared with Python's before any figure is kept. Julia's twins put their code inside a `main()` function, because a global in Julia is untyped.
- Elapsed time is the figure on this page, median of 5 runs of the whole process on an otherwise idle machine: start-up, parsing, compiling and running. CPU time was recorded too and agrees with it for the interpreters; not for the JIT compilers, which compile on other threads — Julia used 2.8× as much CPU time as elapsed time, JavaScript 1.1×. In CPU time Julia would read 5.17× and JavaScript 0.52× against Zymbol; an earlier version of this page showed CPU time, which charged Julia for work no one waits for.
- Start-up of an empty program, elapsed ms: Zymbol (VM) 2.7, PHP 25, Lua 1.9, Perl 2.0, Ruby 69, Python (CPython) 11, JavaScript (Node, V8) 28, Julia 185.
- Not a ranking of languages: sixteen small programs say how fast an interpreter runs loops, calls, arithmetic, collections and text, not how fast real applications are.
- v0.0.11 is not released yet; these are figures of its development branch.

Reproduce, from `zyquality/bench/big/`: `ZYMBOL_BIN=zymbol python3 langs.py --runs 5 --json out.json`.
