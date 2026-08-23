---
name: write-zymbol
description: Write and run Zymbol — a keyword-free language where every construct is a symbol (`?` if, `@` loop, `<~` return, `#1` true) and identifiers may be in any human language. Use when writing, reading, running or debugging .zy files.
license: CC-BY-SA-4.0
---

# Write Zymbol

Zymbol has **no keywords**. Every construct is a symbol, so nothing in the syntax
is an English word and identifiers can be written in any script — Spanish,
Japanese, Arabic, Klingon pIqaD, emoji. `?` is if, `@` is loop, `<~` is return,
`#1` is true, `¶` is newline.

Version v0.0.9. Canonical reference: `GUIDE.md` in
<https://github.com/zymbol-lang/interpreter>. Every code block below is executed
by this project's CI, so it runs as written.

## The eleven things that trip you up

Read these before writing a line — each one is a mistake that *parses* and then
behaves wrong.

1. **Indices start at 1.** `arr[1]` is the first element. `arr[-1]` is the last.
2. **`>>` does not add a newline.** End the statement with `¶` or the next output
   continues on the same line.
3. **A variable you never read is a warning.** Prefix it `_` when that is
   deliberate: `_unused = 42`, `@ _i:1..3 { … }`.
4. **A function sees none of the caller's variables.** Scope is isolated, not
   lexical-with-fallback: reading an outer `g` inside a function is
   `'g' is undefined`. Pass it in as a parameter.
5. **`??` is pattern matching, not a condition chain.** An arm is *operator +
   value* — `< 0 => "cold"`, `90..100 => 'A'` — with the subject implicit. It
   never evaluates a boolean expression. Use `?` / `_?` / `_` for those.
6. **Booleans are `#1` and `#0`** — no `true`, no `false`, no `null`. And the
   comparisons disagree on purpose: `"5" > 4` is `#1` (ordering coerces numeric
   text) while `"5" == 5` is `#0` (`==` never coerces).
7. **Slices include both ends.** `arr$[1..3]` is three elements.
8. **`/` is division; `$/` splits a string.** They look alike and do not overlap.
9. **A named function in a HOF slot takes no parentheses.** `nums$> double` is right;
   `nums$> (double)` is a parse error, because `(` opens a lambda.
10. **`<~` on a parameter is written twice** — in the signature *and* at every call site,
    and both are required: `bump(b<~)` is called as `bump(y<~)`, never `bump(y)`.
11. **The last name of a destructuring pattern absorbs the remainder.** `(a, b, c) = (1,2,3,4,5)`
    leaves `c` holding `(3,4,5)`, and `[…]` accepts only an array while `(…)` accepts only a
    tuple. An `Int` is a safe integer, ±(2⁵³−1): leaving that range is a `##Range` error.

## Variables, output, strings

```zymbol
x = 10              // variable
PI := 3.14159       // constant — reassignment is an error
name = "Ana"
_active = #1        // true; #0 is false
_unused = "kept on purpose"

x += 5
x++

>> "x=" x ¶                        // juxtaposition concatenates
>> "Hi {name}, PI is {PI}" ¶       // interpolation
greeting = "Hello " $++ name "!"   // $++ builds a string
>> greeting ¶
```

Comments are `//`. A `¶` on its own (`>> ¶`) emits a blank line.

## Control flow

```zymbol
x = 7
? x > 100 {
    >> "big" ¶
} _? x > 0 {
    >> "positive" ¶
} _ {
    >> "negative or zero" ¶
}

score = 85
grade = ?? score {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> grade ¶

temp = -5
state = ?? temp {
    < 0  => "ice"
    < 20 => "cold"
    _    => "warm"
}
>> state ¶
```

An arm's pattern can be a `||`-separated chain — `'p' || 'P' => { … }`,
`1..10 || 20..30 => …` — tested left to right.

## Loops

`@` is every loop. The form of the header decides which kind.

```zymbol
@ i:1..3 { >> i " " }        // inclusive range
>> ¶
@ i:1..9:2 { >> i " " }      // step
>> ¶
@ i:3..1:1 { >> i " " }      // reverse — direction comes from the bounds;
                             // a negative step is a runtime error
>> ¶

fruits = ["apple", "pear"]
@ f:fruits { >> f " " }      // for-each
>> ¶
@ c:"hola" { >> c "-" }      // over a string, character by character
>> ¶

n = 1
@ n <= 64 { n *= 2 }         // while
>> n ¶

@ i:1..10 {
    ? i % 2 == 0 { @> }      // @> continue
    ? i > 7 { @! }           // @! break
    >> i " "
}
>> ¶
```

## Collections

```zymbol
arr = [10, 20, 30, 40, 50]
>> arr[1] ¶          // 10 — first element
>> arr[-1] ¶         // 50 — last
>> (arr$#) ¶         // 5 — length

arr = arr$+ 60       // append, returns a new array
arr = arr$-[1]       // remove by index
>> (arr$? 30) ¶      // #1 — contains
>> arr$[1..2] ¶      // slice, both ends included
arr[2]$~ 99          // modify in place — `=` never writes into a collection
>> arr ¶

point = (10, 20)                        // positional tuple, immutable
person = #(name: "Alice", age: 25)      // dictionary — `#(` is its mark, `#()` is the empty one
person["city"]$~ "Lima"                 // any string may be a key
>> point[1] " " person.name " " person["age"] ¶

s = "Hola Mundo"
>> (s$#) ¶                  // 10
>> s$[1..4] ¶               // Hola
>> ("a,b,c" $/ ',') ¶       // [a, b, c]
```

Higher-order functions take a lambda in parentheses:

```zymbol
nums = [1, 2, 3, 4, 5]
>> nums$> (x -> x * 2) ¶              // map
>> nums$| (x -> x % 2 == 0) ¶         // filter
>> nums$< (0, (acc, x) -> acc + x) ¶  // reduce, with an initial value
```

A *named* function goes in the slot bare, with no parentheses — `nums$> double` and
`nums$| is_big` work. Wrapping it is what fails: `nums$> (double)` is a parse error
(`expected '->' in lambda expression`), because `(` starts a lambda. Write the lambda
out (`nums$> (x -> double(x))`) or drop the parentheses.

## Functions and lambdas

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶

double = x -> x * 2
sum2   = (a, b) -> a + b
>> double(5) " " sum2(3, 7) ¶

classify = x -> {
    ? x > 0 { <~ "positive" }
    _? x < 0 { <~ "negative" }
    <~ "zero"
}
>> classify(-3) ¶
```

Function scope is isolated: a function does not see the caller's variables.

An `<~` on a **parameter** makes it an output parameter — the callee writes and
the caller sees it:

```zymbol
swap(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 1
y = 2
swap(x<~, y<~)    // the mark is required here too, or the call is a semantic error
>> x " " y ¶      // 2 1
```

`p~` is the other half of the pair: a *working copy* the body may reassign freely, with
nothing travelling back. One `<` is the whole difference.

## Errors

```zymbol
!? {
    _v = 10 / 0
} :! ##Div {
    >> "division by zero" ¶
} :> {
    >> "finally" ¶
}

!? {
    arr = [1, 2, 3]
    _v = arr[10]
} :! ##Index {
    >> "index out of range" ¶
}

!? {
    _x = 5 / 0
} :! {
    >> "any error" ¶
}
```

`!?` is try, `:!` is catch (bare, or typed with `##Div`, `##Index`, …), `:>` is
finally.

## Modules

A module declares what it exports; an importer binds it to an alias. These blocks
are not executed here because each needs its own file.

```text
// math.zy
# math {
    #> {
        add
        PI
    }

    PI := 3.14159
    add(a, b) { <~ a + b }
}
```

```text
// main.zy
<# ./math => m

>> m::add(2, 3) ¶      // :: calls a function
>> m.PI ¶              // .  reads a constant
```

An import path is relative (`./math`, `../lib/math`) or a stdlib name
(`std/math`, `std/json`, `std/io`, `std/net`, `std/random`, `std/term`,
`std/time`, `std/db`). A re-export layer is how a module is translated: export
`m::add => sumar` and the caller writes `sumar`.

Dates come from `std/time`, never from the shell. An instant is milliseconds
since the epoch and always UTC; a date is a reading of one, so every function
takes an optional trailing zone — `"UTC"` (default), `"local"`, `"+1000"`.

```zymbol
<# std/time => t

hoy = t::today()                              // 2026-08-23, ASCII whatever the numeral mode
inicio = t::of(2026, 8, 23, 14, 5, 9)         // year, month, day [, hour, minute, second]
>> t::format(inicio, "%F %T", "-0400") ¶      // POSIX codes: %Y %m %d %H %M %S %L %j %u %z %F %T
>> t::parts(inicio).weekday ¶                 // 1 = Monday, as ISO 8601 numbers it
>> t::format(t::add(inicio, -30, "day"), "%F") ¶
>> t::diff(inicio, t::of(2026, 7, 24), "day") ¶
```

`add`/`diff` take a unit in full — `millisecond second minute hour day week
month year`. Below a day it is duration, from a day up it is calendar: a month
lands on the same day of the month, clamped (31 Jan + 1 month = 28 Feb). A date
that does not exist is a soft `##Time`, testable with `$!`.

## Running it

```bash
zymbol run file.zy          # tree-walker (default)
zymbol run --vm file.zy     # register VM: 1.4-6x the tree-walker on microbenchmarks,
                            #   40x+ on search-shaped programs
zymbol check file.zy        # parse + semantic check, follows imports
zymbol fmt file.zy --write  # format in place
zymbol repl                 # interactive

zymbol package DIR --script main.zy -o app.zyp   # bundle a multi-file program
zymbol run app.zyp                               # run the bundle
```

Install: <https://zymbol-lang.org/install.md>. No install needed to try code —
<https://zymbol-lang.org/playground.html> runs a JavaScript mirror of the
interpreter in the browser (no `std/db`, no shell, no script inclusion).

## Where to look next

- Site map for agents: <https://zymbol-lang.org/llms.txt>
- Manual, 110 languages: `https://zymbol-lang.org/data/manuals/manual_<code>.md`
- Full symbol table and limitations: `REFERENCE.md` in the interpreter repository
- Runnable examples by topic: <https://zymbol-lang.org/examples/catalog.json>

Licensed CC BY-SA 4.0. © 2024-2026 Zymbol-Lang Team.
