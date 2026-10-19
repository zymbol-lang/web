# How fast is Zymbol?

Sixteen programs, eight languages and four Zymbol engines, the same printed answer, measured on 2026-10-18. One machine, elapsed time per process. Zymbol v0.0.11 is the development branch (commit `7ef269c`); the release is v0.0.10. The HTML page lets the reader pick any language or engine as the reference; this twin carries the figures against Zymbol v0.0.11 = 1.00.

The programs, their twins and the script that measured them: https://github.com/zymbol-lang/zyquality/tree/v0.0.11/bench/big

## Against Zymbol v0.0.11

Geometric mean of elapsed time. Whole process: all sixteen programs, start-up included. Start-up subtracted: each language's own empty-program time taken off — Zymbol's too — over the 11 programs Zymbol takes 100 ms or more on, still against Zymbol's whole process = 1.00.

| Language or engine | Kind | Whole process | Start-up subtracted | Its start-up |
|---|---|---:|---:|---:|
| Zymbol v0.0.11 · VM | register VM, the default | 1.00× | 0.99× | 4.6 ms |
| Zymbol v0.0.11 · tree-walker | tree-walker, --tw | 7.45× | 9.35× | 3.9 ms |
| Zymbol v0.0.10 · VM | register VM, --vm | 1.68× | 1.41× | 3.3 ms |
| Zymbol v0.0.10 · tree-walker | tree-walker, its default | 7.22× | 9.15× | 2.7 ms |
| PHP 8.4.26 | Zend VM; opcache JIT off on the command line | 0.63× | 0.38× | 15 ms |
| Lua 5.4.7 | PUC Lua, register VM | 0.64× | 0.45× | 2.3 ms |
| Perl v5.40.1 | interpreter | 1.70× | 1.64× | 2.4 ms |
| Ruby 3.3.8 | CRuby VM; YJIT off without --yjit | 1.77× | 0.83× | 61 ms |
| Python 3.13.5 | CPython | 1.84× | 1.65× | 12 ms |
| JavaScript · Node v24.16.0 | JIT compiler | 0.46× | 0.11× | 36 ms |
| Julia 1.12.7 | JIT compiler | 1.76× | 0.14× | 194 ms |

Zymbol v0.0.11 is the third fastest of the six interpreters. PHP is faster on 13 of the sixteen programs and Lua is faster on 12 of the sixteen programs. Zymbol is ahead of Perl, Ruby and Python in the mean. With start-up subtracted, PHP (0.38×), Lua (0.45×) and Ruby (0.83×) are ahead of it, and Julia (0.14×) comes next to JavaScript (0.11×). PHP's opcache JIT is off on the command line and Ruby's YJIT is off without `--yjit`, so both run as interpreters.

## Program by program

Milliseconds of elapsed time, median of 5 runs, start-up included. 176 of 176 twins printed exactly what the Python twin printed.

| Program | What it does | Zymbol | Zymbol TW | Zymbol 0.10 VM | Zymbol 0.10 TW | PHP | Lua | Perl | Ruby | Python | JavaScript (JIT) | Julia (JIT) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `array_update` | write 3 000 slots of a 20 000-slot array | 6.2 | 16 | 9.2 | 16 | 24 | 3.0 | 5.8 | 79 | 13 | 40 | 221 |
| `collatz` | longest Collatz chain below 60 000 | 337 | 2002 | 461 | 2094 | 136 | 148 | 561 | 291 | 814 | 56 | 212 |
| `fib_rec` | naive recursive fib(34) — 18 million calls | 911 | 8395 | 1051 | 8486 | 302 | 406 | 2553 | 548 | 755 | 100 | 223 |
| `hof_chain` | map, filter, reduce over 100 000 numbers, 25 times | 330 | 2437 | 428 | 2332 | 248 | 186 | 270 | 446 | 418 | 188 | 359 |
| `loop_mod` | ten million turns of integer arithmetic | 427 | 2668 | 788 | 2592 | 170 | 167 | 533 | 684 | 1297 | 188 | 231 |
| `mandelbrot` | 250×250 Mandelbrot set, floating point | 185 | 2945 | 240 | 2932 | 88 | 96 | 452 | 235 | 529 | 53 | 218 |
| `match_loop` | classify three million numbers by range | 253 | 1901 | 378 | 1859 | 128 | 115 | 668 | 353 | 510 | 51 | 214 |
| `matmul` | 150×150 integer matrix product | 406 | 3864 | 520 | 3805 | 83 | 96 | 345 | 321 | 665 | 63 | 226 |
| `nqueens` | every solution of 10 queens | 270 | 2893 | 357 | 2828 | 93 | 136 | 504 | 243 | 303 | 59 | 514 |
| `primes_trial` | primes below 300 000 by trial division | 204 | 2218 | 294 | 2186 | 76 | 84 | 398 | 232 | 547 | 49 | 225 |
| `sort_builtin` | sort 600 000 numbers, natural order | 94 | 466 | 120 | 469 | 143 | 247 | 247 | 181 | 280 | 113 | 240 |
| `sort_cmp_300k` | sort 300 000 numbers with a comparator | 356 | 3625 | 677 | 3181 | 303 | 295 | 266 | 406 | 631 | 129 | 354 |
| `sort_cmp_4k` | sort 4 000 numbers with a comparator | 8.7 | 36 | 11 | 31 | 17 | 10 | 13 | 67 | 31 | 31 | 343 |
| `strings_scan_long` | count vowels in an 88 000-character text | 30 | 194 | 499 | 179 | 27 | 61 | 79 | 226 | 51 | 51 | 341 |
| `strings_scan_short` | count vowels in a short text, 200 times | 65 | 354 | 139 | 346 | 39 | 78 | 127 | 310 | 99 | 46 | 213 |
| `tak` | Takeuchi function, deep recursion | 359 | 5091 | 506 | 5005 | 163 | 175 | 1264 | 265 | 303 | 60 | 219 |
| geometric mean, Zymbol v0.0.11 = 1 | | 1.00× | 7.45× | 1.68× | 7.22× | 0.63× | 0.64× | 1.70× | 1.77× | 1.84× | 0.46× | 1.76× |

## From v0.0.10 to v0.0.11

Zymbol against itself — no other language here. v0.0.10 ran the tree-walker by default; its VM was `zymbol run --vm`. Elapsed milliseconds, median of 5 runs; in brackets, against v0.0.11 = 1.00.

| Program | v0.0.11 VM | v0.0.10 `--vm` | v0.0.10 tree-walker (its default) |
|---|---:|---:|---:|
| `array_update` | 6.2 ms (1.00×) | 9.2 ms (1.49×) | 16 ms (2.64×) |
| `collatz` | 337 ms (1.00×) | 461 ms (1.37×) | 2094 ms (6.22×) |
| `fib_rec` | 911 ms (1.00×) | 1051 ms (1.15×) | 8486 ms (9.32×) |
| `hof_chain` | 330 ms (1.00×) | 428 ms (1.30×) | 2332 ms (7.06×) |
| `loop_mod` | 427 ms (1.00×) | 788 ms (1.84×) | 2592 ms (6.07×) |
| `mandelbrot` | 185 ms (1.00×) | 240 ms (1.30×) | 2932 ms (15.89×) |
| `match_loop` | 253 ms (1.00×) | 378 ms (1.49×) | 1859 ms (7.34×) |
| `matmul` | 406 ms (1.00×) | 520 ms (1.28×) | 3805 ms (9.36×) |
| `nqueens` | 270 ms (1.00×) | 357 ms (1.33×) | 2828 ms (10.49×) |
| `primes_trial` | 204 ms (1.00×) | 294 ms (1.44×) | 2186 ms (10.69×) |
| `sort_builtin` | 94 ms (1.00×) | 120 ms (1.27×) | 469 ms (4.96×) |
| `sort_cmp_300k` | 356 ms (1.00×) | 677 ms (1.90×) | 3181 ms (8.94×) |
| `sort_cmp_4k` | 8.7 ms (1.00×) | 11 ms (1.22×) | 31 ms (3.57×) |
| `strings_scan_long` | 30 ms (1.00×) | 499 ms (16.43×) | 179 ms (5.88×) |
| `strings_scan_short` | 65 ms (1.00×) | 139 ms (2.12×) | 346 ms (5.28×) |
| `tak` | 359 ms (1.00×) | 506 ms (1.41×) | 5005 ms (13.94×) |
| geometric mean | 1.00× | 1.68× | 7.22× |

In elapsed time, v0.0.11 is 7.2× faster than v0.0.10 as it ran by default, and 1.7× faster than v0.0.10's VM. Nothing in the language changed: every program prints what it printed.

## How it was measured

AMD Ryzen 7 4800H with Radeon Graphics, Linux 6.12.111+deb13-amd64.

| Language or engine | Version |
|---|---|
| Zymbol v0.0.11 · VM | v0.0.11 (development branch, 7ef269c) |
| Zymbol v0.0.11 · tree-walker | v0.0.11 (development branch, 7ef269c) |
| Zymbol v0.0.10 · VM | v0.0.10 |
| Zymbol v0.0.10 · tree-walker | v0.0.10 |
| PHP | 8.4.26 |
| Lua | 5.4.7 |
| Perl | v5.40.1 |
| Ruby | 3.3.8 |
| Python | 3.13.5 |
| JavaScript · Node | v24.16.0 |
| Julia | 1.12.7 |

- Each program is written once per language with the same algorithm and shape as the Python twin; its printed line is compared with Python's before any figure is kept. Julia's twins put their code inside a `main()` function, because a global in Julia is untyped.
- Elapsed time, median of 5 runs of the whole process on an otherwise idle machine. CPU time was recorded too; it agrees for the interpreters, not for the JIT compilers, which compile on other threads — Julia used 2.9× as much CPU time as elapsed time. An earlier version of this page showed CPU time, which charged Julia for work no one waits for.
- Not a ranking of languages: sixteen small programs say how fast an interpreter runs loops, calls, arithmetic, collections and text, not how fast real applications are.
- v0.0.11 is not released yet; these are figures of its development branch.

Reproduce, from `zyquality/bench/big/`: `ZYMBOL_BIN=zymbol ZYMBOL_OLD=zymbol-0.0.10 python3 langs.py --runs 5 --json out.json`.
