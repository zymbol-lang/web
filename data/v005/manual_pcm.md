> **Warning:** AI write and translate dis document.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Manual

> **Reviewed for v0.0.5 — 2026-05-12**

**Zymbol-Lang** na symbolic programming language. No keyword — everything na symbol. E work the same for any human language.

- No `if`, `while`, `return` — only `?`, `@`, `<~`
- Full Unicode — identifiers for any language or emoji
- E no care about human language — the code na the same everywhere

**Interpreter version**: v0.0.5 | **Test coverage**: 436/436 (TW ↔ VM parity)

---

## Variabel & Konstant

```zymbol
x = 10              // variable wey fit change
PI := 3.14159       // constant — if you reassign am, e go crash for runtime
nem = "Alice"
aktif = #1         // boolean wey be true
👋 := "Hello"
```

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++        // 5
x--        // 4
```

`°` (degree sign, U+00B0) e go auto-initialize variable to im neutral value when e first dey use:

```zymbol
nomba = [3, 1, 4, 1, 5]
@ n:nomba {
    °total += n    // auto-init to 0 above di loop; e survive after @
}
>> total ¶         // → 14
```

> `°x` (prefix) e anchor above di loop — result dey accessible after `@`.
> `x°` (postfix) e anchor inside di loop — e die when loop end.
> Tree-walker only.

---

## Data Type

| Type | Literal | `#?` tag | Notes |
|------|---------|----------|-------|
| Int | `42`, `-7` | `###` | 64-bit signed |
| Float | `3.14`, `1.5e10` | `##.` | Scientific notation OK |
| String | `"text"` | `##"` | Interpolation: `"Hello {nem}"` |
| Char | `'A'` | `##'` | Single Unicode character |
| Bool | `#1`, `#0` | `##?` | NOT numeric — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Same type elements |
| Tuple | `(a, b)` | `##)` | Positional |
| Named Tuple | `(x: 1, y: 2)` | `##)` | Named fields |
| Function | named function ref | `##()` | First-class; show `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-class; show `<lambd/N>` |

```zymbol
// Type introspection — e return (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output & Input

```zymbol
>> "Hello" ¶                      // ¶ or \\ for newline
>> "a=" a " b=" b ¶               // juxtaposition — many values
>> (arr$#) ¶                      // postfix operators need ( ) for >>

<< nem                           // read am go inside variable (no prompt)
<< "Enter nem: " nem            // with prompt
```

> `¶` (AltGr+R for Spanish keyboard) and `\\` na same newline.

---

## TUI Primitives

Terminal UI operators for interactive programs. Most need `>>| { }` block (alternate screen + raw mode).

```zymbol
>>| {
    >>!                             // clear di alternate screen
    >>~ (1, 1, 0, 10) > "E dey Run"  // row 1, col 1, fg=10 (green)
    @~ 1000                         // pause for 1 second (1000 ms)
    >>~ (2, 1) > "Don do."
}
// terminal go restore itsself when e exit
```

```zymbol
// Keypress and terminal size
>>| {
    [rows, cols] = >>?              // ask di terminal for im size
    >>~ (1, 1) > "Terminal: " rows " x " cols
    <<| key                         // blocking keypress read
    >>~ (2, 1) > "You Press: " key
}
```

> `>>!` clear screen. `>>?` return `[rows, cols]`. `@~ N` sleep N milliseconds.
> `<<|` read one keypress (blocking); `<<|?` poll without blocking (e return `'\0'` if none).
> Positioned output tuple: `(row, col, BKS, fg, bg)` — any slot fit omit with comma (`>>~ (,,, 196) > "red"`).
> BKS bitmask: `1`=Bold, `2`=Italic, `4`=Underline. ANSI 256-color palette (`0`=terminal default).
> Tree-walker only (except `>>!`, `>>?`, `@~`, `>>~` wey also run for `--vm`).

---

## Operators

```zymbol
// Arithmetic
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (integer division)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponentiation)

// Comparison — assign am make you check
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logical
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Strings

```zymbol
// Two ways to join string
nem = "Alice"
n = 42

>> "Hello " nem " you get " n ¶    // juxtaposition — for >>
deskripshon = "Hello {nem}, you get {n}"  // interpolation — everywhere
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[1..5]             // "Hello"  (1-based, end inclusive)
has = s$? "World"          // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]  (split by delimiter)
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (first N only)
line = "─" $* 20           // "────────────────────"  (repeat N times)
```

> `+` na for numbers only. Use `,`, juxtaposition, or interpolation for strings.

---

## Control Flow

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "big" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negatif" ¶
}
```

> `{ }` braces na **must** even for one statement.

---

## Match

```zymbol
// Ranges
skoa = 85
grade = ?? skoa {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> grade ¶    // → B

// Strings
kolo = "red"
kode = ?? kolo {
    "red"   => "#FF0000"
    "green" => "#00FF00"
    _       => "#000000"
}

// Comparison patterns
tempu = -5
kondishon = ?? tempu {
    < 0  => "ice"
    < 20 => "cold"
    < 35 => "warm"
    _    => "hot"
}
>> kondishon ¶    // → ice

// Statement form (block arms)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negatif" ¶ }
    _    => { >> "positif" ¶ }
}
```

---

## Loops

```zymbol
@ i:0..4  { >> i " " }        // range inclusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // with step:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruits = ["apple", "pear", "grape"]
@ f:fruits { >> f ¶ }         // for-each array

@ c:"hello" { >> c "-" }
>> ¶                          // → h-e-l-l-o-  (for-each string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continue
    ? i > 7 { @! }             // @! break
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Infinite loop
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Labeled loop (nested break)
kount = 0
@:outer {
    kount++
    ? kount >= 3 { @:outer! }
}
>> kount ¶                    // → 3
```

---

## Functions

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Functions get **isolated scope** — dem no fit read outer variables. Use output parameters `<~` to modify caller variables:

```zymbol
swap(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
swap(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Named functions na **first-class values** — pass directly: `nums$> double`. To wrap: `x -> fn(x)` also work.

---

## Lambda & Closures

```zymbol
double = x -> x * 2
sum = (a, b) -> a + b
>> double(5) ¶    // → 10
>> sum(3, 7) ¶    // → 10

// Block lambda
klasify = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "zero"
}

// Closure — e capture di outside scope
faktor = 3
triple = x -> x * faktor
>> triple(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// For inside arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Arrays

Arrays na **mutable** and dem hold elements of **same type**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — access (1-indexed: first element)
x = arr[-1]     // 5 — negative index (last element)
x = arr$#       // 5 — length (use (arr$#) for >>)

arr = arr$+ 6            // append → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insert for position 2 (1-based)
arr3 = arr$- 3           // remove first occurrence of value
arr4 = arr$-- 3          // remove all occurrences
arr5 = arr$-[1]          // remove for index 1 (first element)
arr6 = arr$-[2..3]       // remove range (1-based, end inclusive)

has = arr$? 3            // #1 — contains
pos = arr$?? 3           // [3] — all indices of value (1-based)
sl = arr$[1..3]          // [1,2,3] — slice (1-based, end inclusive)
sl2 = arr$[1:3]          // [1,2,3] — same, count-based syntax

asc = arr$^+             // sorted ascending  (primitives only)
desc = arr$^-            // sorted descending (primitives only)

// Named/positional tuple arrays — use $^ with comparator lambda
db = [(nem: "Carla", age: 28), (nem: "Ana", age: 25), (nem: "Bob", age: 30)]
by_age  = db$^ (a, b -> a.age < b.age)    // ascending by age  (<)
by_nem = db$^ (a, b -> a.nem > b.nem)  // descending by nem (>)
>> by_age[1].nem ¶     // → Ana
>> by_nem[1].nem ¶    // → Carla

// Direct element update (arrays only)
arr[1] = 99              // assign
arr[2] += 5              // compound: +=  -=  *=  /=  %=  ^=

// Functional update — e return new array; original no change
arr2 = arr[2]$~ 99
```

> All collection operators return a **new array**. Assign back: `arr = arr$+ 4`.
> `$+` fit chain: `arr = arr$+ 5$+ 6$+ 7`. Other operators use intermediate assignments.
> **Indexing na 1-based**: `arr[1]` na first element; `arr[0]` na runtime error.
> `$^+` / `$^-` sort **primitive arrays** (numbers, strings). For tuple arrays use `$^` with comparator lambda — direction dey inside lambda (`<` = ascending, `>` = descending).

**Value semantics** — when you assign array to another variable, e create independent copy:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b no change
```

```zymbol
// Nested arrays (1-based indexing)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (row 2, column 3)
```

---

## Destructuring

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ discard am

// Positional tuple
point = (100, 200)
(px, py) = point             // px=100  py=200

// Named tuple
pesin = (nem: "Ana", age: 25, city: "Madrid")
(nem: n, age: a) = pesin   // n="Ana"  a=25
```

---

## Tuples

Tuples na **immutable** ordered containers wey fit hold values of **different types**.
Unlike arrays, elements no fit change after dem create am.

```zymbol
// Positional — mixed types allowed
point = (10, 20)
>> point[1] ¶    // → 10

data = (42, "hello", #1, 3.14)
>> data[3] ¶     // → #1

// Named
pesin = (nem: "Alice", age: 25)
>> pesin.nem ¶    // → Alice
>> pesin[1] ¶      // → Alice  (index also works, 1-based)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, label: "origin")
>> p.pos.x ¶        // → 10
```

**Immutability** — any attempt to modify tuple element na runtime error:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ runtime error: tuples no fit change
// t[1] += 5    // ❌ same error
```

To derive modified value use `$~` (functional update) — e return a **new** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original no change
>> t2 ¶    // → (10, 999, 30)

// Named tuple — rebuild am by hand
pesin = (nem: "Alice", age: 25)
older  = (nem: pesin.nem, age: 26)
>> pesin.age ¶    // → 25
>> older.age ¶     // → 26
```

---

## Higher-Order Functions

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doubled  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
evens    = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Chain via intermediates
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named functions fit pass directly to HOF
double(x) { <~ x * 2 }
is_big(x) { <~ x > 5 }
r = nums$> double       // ✅ direct reference
r = nums$| is_big       // ✅ direct reference
```

---

## Pipe Operator

Di RHS always need `_` as placeholder for di piped value:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

r1 = 5 |> double(_)        // → 10
r2 = 10 |> add(_, 5)       // → 15
r3 = 5 |> add(2, _)        // → 7

// Chained
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Error Handling

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dem divide am by zero" ¶
} :! {
    >> "anoda: " _err ¶    // _err hold di error message
} :> {
    >> "e always go run" ¶
}
```

| Type | When |
|------|------|
| `##Div` | Division by zero |
| `##IO` | File / system |
| `##Index` | Index out of bounds |
| `##Type` | Type mismatch |
| `##Parse` | Data parsing |
| `##Network` | Network errors |
| `##_` | Any error (catch-all) |

---

## Modules

```zymbol
// lib/calc.zy — module body dey inside braces
# calc {
    #> { add, get_PI }

    _PI := 3.14159
    add(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias na must

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Export with different public name
# mylib {
    #> { _internal_add => sum }

    _internal_add(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::sum(3, 4) ¶    // → 7  (internal name _internal_add na hidden)
```

> **Module rules**: only `#>`, function definitions, and literal variable/constant initializers allowed inside `# name { }`. Executable statements (`>>`, `<<`, loops, etc.) raise error E013.

---

## Numeral Modes

Zymbol fit display numbers for **69 Unicode digit scripts** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Mathematical Bold, LCD segments, and more. Di active mode only affect `>>` output; internal arithmetic always remain binary.

### How to Activate Am

Write di `0` and `9` digit of di target script wey you put inside `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Output and Booleans

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimal point always ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: # prefix always ASCII, digit go change
>> #1 ¶         // → #१   (true  for Devanagari)
>> #0 ¶         // → #०   (false — e different from ०  integer zero)

x = 28 > 4
>> x ¶          // → #१   (comparison result follow active mode)
```

### Native Digit Literals for Source Code

Any supported script digits na valid literals — for ranges, modulo, comparisons:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean Literals for Any Script

`#` + digit `0` or `1` from any block na valid boolean literal:

```zymbol
#٠٩#
aktif = #١        // same as #1
>> aktif ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` na **always ASCII**. `#0` (false) always look different from `0` (integer zero) for every script.

---

## Data Operators

```zymbol
// Type conversion casts
f = ##.42         // → 42.0  (to Float)
i = ###3.7        // → 4     (to Int, round)
t = ##!3.7        // → 3     (to Int, truncate)

// Parse string to number
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (fail-safe, no error)

// Round / truncate
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (round to 2 decimal places)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncate)

// Number formatting
fmt = #,|1234567|  // → 1,234,567  (comma-separated)
sci = #^|12345.678|    // → 1.2345678e4  (scientific)

// Base literals
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Base conversion output
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Integration

```zymbol
date = <\ date +%Y-%m-%d \>     // captures stdout (includes trailing \n)
>> "Today: " date

file = "data.txt"
content = <\ cat {file} \>      // interpolation inside commands

output = </"./subscript.zy"/>   // execute another Zymbol script, capture output
>> output
```

> `><` captures CLI arguments as string array (tree-walker only).

---

## Complete Example: FizzBuzz

```zymbol
classify(number) {
    ? number % 15 == 0 { <~ "FizzBuzz" }
    _? number % 3  == 0 { <~ "Fizz" }
    _? number % 5  == 0 { <~ "Buzz" }
    _ { <~ number }
}

@ i:1..20 { >> classify(i) ¶ }
```

---

## Symbol Reference

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | variable | `$#` | length |
| `:=` | constant | `$+` | append (chainable) |
| `>>` | output | `$+[i]` | insert for index (1-based) |
| `<<` | input | `$-` | remove first by value |
| `¶` / `\\` | newline | `$--` | remove all by value |
| `?` | if | `$-[i]` | remove for index (1-based) |
| `_?` | else-if | `$-[i..j]` | remove range (1-based) |
| `_` | else / wildcard | `$?` | contains |
| `??` | match | `$??` | find all indices (1-based) |
| `@` | loop | `$[s..e]` | slice (1-based) |
| `@ N { }` | times loop (N times) | `$>` | map |
| `@!` | break | `$\|` | filter |
| `@>` | continue | `$<` | reduce |
| `@:name { }` | labeled loop | `$/ delim` | string split |
| `@:name!` | break label | `$++ a b c` | concat build |
| `@:name>` | continue label | `arr[i>j>k]` | navigation index |
| `->` | lambda | `arr[i] = val` | update element (arrays only) |
| `arr[i] += val` | compound update | `arr[i]$~` | functional update (new copy) |
| `$^+` | sort ascending (primitives) | `$^-` | sort descending (primitives) |
| `$^` | sort with comparator (tuples) | `<~` | return |
| `\|>` | pipe | `!?` | try |
| `:!` | catch | `:>` | finally |
| `#1` | true | `#0` | false |
| `$!` | na error | `$!!` | propagate error |
| `<#` | import | `#>` | export |
| `#` | declare module | `::` | module call |
| `.` | field access | `#?` | type metadata |
| `#\|..\|` | parse number | `##.` | cast to Float |
| `###` | cast to Int (round) | `##!` | cast to Int (truncate) |
| `#.N\|..\|` | round | `#!N\|..\|` | truncate |
| `#,\|..\|` | comma format | `#^\|..\|` | scientific |
| `#d0d9#` | numeral mode switch | `#09#` | reset to ASCII |
| `<\ ..\>` | shell exec | `>\<` | CLI args |
| `\ var` | destroy variable (explicit) | `°x` / `x°` | hot definition (auto-init) |
| `>>|` | TUI block (alt screen) | `>>~` | positioned output |
| `>>!` | clear screen | `>>?` | ask terminal size |
| `<<\|` | blocking keypress | `<<\|?` | non-blocking keypress |
| `@~ N` | sleep N milliseconds | `$*` | repeat string N times |

---

## Release Changelog

### v0.0.5 — TUI Primitives, Hot Definition & String Repeat _(May 2026)_

- **Breaking** Match arm separator: `pattern : result` → `pattern => result`
- **Breaking** Import alias: `<# path <= alias` → `<# path => alias`
- **Breaking** Export rename: `#> { fn <= pub }` → `#> { fn => pub }`
- **Added** TUI block `>>| { }` — alternate screen + raw mode; e go clean up when e exit
- **Added** Positioned output `>>~ (row, col, BKS, fg, bg) > items` — sparse slots, 256-color ANSI
- **Added** Key input `<<| var` (blocking) and `<<|? var` (non-blocking poll)
- **Added** `>>!` clear screen, `>>?` query terminal size, `@~ N` sleep N milliseconds
- **Added** Hot definition `°x` / `x°` — auto-initialize variable when e first dey use for loops
- **Added** String repeat `str $* N` — repeat string N times
- **VM** Parity: 436/436 tests pass

### v0.0.4 — 1-Based Indexing, First-Class Functions & Module Blocks _(April 2026)_

- **Breaking** All indexing don switch to **1-based** — `arr[1]` na first element; `arr[0]` na runtime error
- **Added** Named functions na **first-class values** — pass directly to HOF: `nums$> double`
- **Added** Module **block syntax** na must: `# name { ... }` — flat syntax don remove
- **Added** Multi-dimensional indexing: `arr[i>j>k]` (navigation), `arr[p ; q]` (flat extraction)
- **Added** Type conversion casts: `##.expr` (Float), `###expr` (Int round), `##!expr` (Int truncate)
- **Added** String split: `str$/ delim` — e return `Array(String)`
- **Added** Concat build: `base$++ a b c` — e append many items
- **Added** Times loop: `@ N { }` — repeat exactly N times
- **Added** Labeled loop syntax: `@:name { }`, `@:name!`, `@:name>` — e replace `@ @name` / `@! name`
- **Added** Variable scope rules: `_name` variables get exact block scope; `\ var` destroy am early
- **Added** Match comparison patterns: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Added** Module E013 error: executable statements inside module body no allowed
- **Fixed** `take_variable` no go corrupt module constants when e write back
- **Fixed** `alias.CONST` now resolve correct; `#>` fit appear after function definitions
- **VM** Full parity: 393/393 tests pass

### v0.0.3 — Unicode Numeral Systems & LSP Improvements _(April 2026)_

- **Added** 69 Unicode digit blocks with mode-switch token `#d0d9#`
- **Added** Boolean literals for any script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Added** Klingon pIqaD digits (CSUR PUA U+F8F0–U+F8F9)
- **Added** `SetNumeralMode` VM opcode — full parity with tree-walker
- **Changed** Boolean `>>` output now get `#` prefix (`#0` / `#1`) for all modes

### v0.0.2_01 — Operator Rename _(30 Mar 2026)_

- **Changed** `c|..|` → `#,|..|` and `e|..|` → `#^|..|` — consistent with `#` format prefix family
- **Added** Export alias: re-export module members under different name

### v0.0.2 — Collection API Redesign & Installers _(24 Mar 2026)_

- **Added** Unified `$` operator family for arrays and strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Destructuring assignment for arrays, tuples, and named tuples
- **Added** Negative indices (`arr[-1]` = last element)
- **Added** Native installers — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Added** Compound assignment `^=`
- **Fixed** Parser arithmetic edge cases; documentation corrections

### v0.0.1 — First Public Release _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× faster, ~95% parity)
- All core constructs: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Full Unicode identifiers, module system, lambdas, closures, error handling
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Na Symbol. For Everywhere. E No Go Change._
