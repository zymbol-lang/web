> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> **Aviso:** Esta documentación fue creada con asistencia de inteligencia artificial (IA).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Manual

**Zymbol-Lang** is a symbolic programming language. No keywords — everything is a symbol. Works identically in any human language.

- No `if`, `while`, `return` — only `?`, `@`, `<~`
- Full Unicode — identifiers in any language or emoji
- Human-language agnostic — the code is the same everywhere

**Interpreter version**: v0.0.4 | **Test coverage**: 393/393 (TW ↔ VM parity)

---

## Variables & Constants

```zymbol
x = 10              // mutable variable
PI := 3.14159       // constant — reassignment is a runtime error
name = "Alice"
active = #1         // boolean true
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

---

## Data Types

| Type | Literal | `#?` tag | Notes |
|------|---------|----------|-------|
| Int | `42`, `-7` | `###` | 64-bit signed |
| Float | `3.14`, `1.5e10` | `##.` | Scientific notation OK |
| String | `"text"` | `##"` | Interpolation: `"Hello {name}"` |
| Char | `'A'` | `##'` | Single Unicode character |
| Bool | `#1`, `#0` | `##?` | NOT numeric — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Homogeneous elements |
| Tuple | `(a, b)` | `##)` | Positional |
| Named Tuple | `(x: 1, y: 2)` | `##)` | Named fields |
| Function | named function ref | `##()` | First-class; display `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-class; display `<lambd/N>` |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output & Input

```zymbol
>> "Hello" ¶                      // ¶ or \\ for explicit newline
>> "a=" a " b=" b ¶               // juxtaposition — multiple values
>> (arr$#) ¶                      // postfix operators require ( ) in >>

<< name                           // read into variable (no prompt)
<< "Enter name: " name            // with prompt
```

> `¶` (AltGr+R on Spanish keyboard) and `\\` are equivalent newlines.

---

## Operators

```zymbol
// Arithmetic — use assignments; some operators have quirks directly in >>
a = 10
b = 3
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (integer division)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (exponentiation)

// Comparison
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b     // #1

// Logical
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Strings

```zymbol
// Two concatenation forms
name = "Alice"
n = 42

>> "Hello " name " you have " n ¶    // juxtaposition — in >>
desc = "Hello {name}, you have {n}"  // interpolation — anywhere
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[1..5]             // "Hello"  (1-based, end inclusive)
has = s$? "World"          // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]  (split by delimiter)
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (first N only)
```

> `+` is for numbers only. Use `,`, juxtaposition, or interpolation for strings.

---

## Control Flow

```zymbol
x = 7

? x > 0 { >> "positive" ¶ }

? x > 100 {
    >> "large" ¶
} _? x > 0 {
    >> "positive" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negative" ¶
}
```

> `{ }` braces are **required** even for a single statement.

---

## Match

```zymbol
// Ranges
score = 85
grade = ?? score {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grade ¶    // → B

// Strings
color = "red"
code = ?? color {
    "red"   : "#FF0000"
    "green" : "#00FF00"
    _       : "#000000"
}

// Comparison patterns
temp = -5
state = ?? temp {
    < 0  : "ice"
    < 20 : "cold"
    < 35 : "warm"
    _    : "hot"
}
>> state ¶    // → ice

// Statement form (block arms)
?? n {
    0       : { >> "zero" ¶ }
    _? n < 0: { >> "negative" ¶ }
    _       : { >> "positive" ¶ }
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
count = 0
@:outer {
    count++
    ? count >= 3 { @:outer! }
}
>> count ¶                    // → 3
```

---

## Functions

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Functions have **isolated scope** — they cannot read outer variables. Use output parameters `<~` to modify caller variables:

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

> Named functions are **first-class values** — pass directly: `nums$> double`. To wrap: `x -> fn(x)` is also valid.

---

## Lambdas & Closures

```zymbol
double = x -> x * 2
sum = (a, b) -> a + b
>> double(5) ¶    // → 10
>> sum(3, 7) ¶    // → 10

// Block lambda
classify = x -> {
    ? x > 0 { <~ "positive" }
    _? x < 0 { <~ "negative" }
    <~ "zero"
}

// Closure — captures outer scope
factor = 3
triple = x -> x * factor
>> triple(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Arrays

Arrays are **mutable** and hold elements of the **same type**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — access (1-indexed: first element)
arr[-1]         // 5 — negative index (last element)
arr$#           // 5 — length (use (arr$#) in >>)

arr = arr$+ 6            // append → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insert at position 2 (1-based)
arr3 = arr$- 3           // remove first occurrence of value
arr4 = arr$-- 3          // remove all occurrences
arr5 = arr$-[1]          // remove at index 1 (first element)
arr6 = arr$-[2..3]       // remove range (1-based, end inclusive)

has = arr$? 3            // #1 — contains
pos = arr$?? 3           // [3] — all indices of value (1-based)
sl = arr$[1..3]          // [1,2,3] — slice (1-based, end inclusive)
sl2 = arr$[1:3]          // [1,2,3] — same, count-based syntax

asc = arr$^+             // sorted ascending  (primitives only)
desc = arr$^-            // sorted descending (primitives only)

// Named/positional tuple arrays — use $^ with comparator lambda
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
by_age  = db$^ (a, b -> a.age < b.age)    // ascending by age  (<)
by_name = db$^ (a, b -> a.name > b.name)  // descending by name (>)
>> by_age[1].name ¶     // → Ana
>> by_name[1].name ¶    // → Carla

// Direct element update (arrays only)
arr[1] = 99              // assign
arr[2] += 5              // compound: +=  -=  *=  /=  %=  ^=

// Functional update — returns a new array; original unchanged
arr2 = arr[2]$~ 99
```

> All collection operators return a **new array**. Assign back: `arr = arr$+ 4`.
> `$+` can be chained: `arr = arr$+ 5$+ 6$+ 7`. Other operators use intermediate assignments.
> **Indexing is 1-based**: `arr[1]` is the first element; `arr[0]` is a runtime error.
> `$^+` / `$^-` sort **primitive arrays** (numbers, strings). For tuple arrays use `$^` with a comparator lambda — direction is encoded in the lambda (`<` = ascending, `>` = descending).

**Value semantics** — assigning an array to another variable creates an independent copy:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b is unaffected
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
[x, _, z] = [1, 2, 3]        // _ discards

// Positional tuple
point = (100, 200)
(px, py) = point             // px=100  py=200

// Named tuple
person = (name: "Ana", age: 25, city: "Madrid")
(name: n, age: a) = person   // n="Ana"  a=25
```

---

## Tuples

Tuples are **immutable** ordered containers that can hold values of **different types**.
Unlike arrays, elements cannot be changed after creation.

```zymbol
// Positional — mixed types allowed
point = (10, 20)
>> point[1] ¶    // → 10

data = (42, "hello", #1, 3.14)
>> data[3] ¶     // → #1

// Named
person = (name: "Alice", age: 25)
>> person.name ¶    // → Alice
>> person[1] ¶      // → Alice  (index also works, 1-based)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, label: "origin")
>> p.pos.x ¶        // → 10
```

**Immutability** — any attempt to modify a tuple element is a runtime error:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ runtime error: tuples are immutable
// t[1] += 5    // ❌ same error
```

To derive a modified value use `$~` (functional update) — returns a **new** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original unchanged
>> t2 ¶    // → (10, 999, 30)

// Named tuple — rebuild explicitly
person = (name: "Alice", age: 25)
older  = (name: person.name, age: 26)
>> person.age ¶    // → 25
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

// Named functions can be passed directly to HOF
double(x) { <~ x * 2 }
is_big(x) { <~ x > 5 }
r = nums$> double       // ✅ direct reference
r = nums$| is_big       // ✅ direct reference
```

---

## Pipe Operator

The RHS always requires `_` as a placeholder for the piped value:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

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
    >> "division by zero" ¶
} :! {
    >> "other: " _err ¶    // _err holds the error message
} :> {
    >> "always runs" ¶
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
// lib/calc.zy — module body is enclosed in braces
# calc {
    #> { add, get_PI }

    _PI := 3.14159
    add(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias required

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Export with a different public name
# mylib {
    #> { _internal_add <= sum }

    _internal_add(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7  (internal name _internal_add is hidden)
```

> **Module rules**: only `#>`, function definitions, and literal variable/constant initializers are allowed inside `# name { }`. Executable statements (`>>`, `<<`, loops, etc.) raise error E013.

---

## Numeral Modes

Zymbol can display numbers in **69 Unicode digit scripts** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Mathematical Bold, LCD segments, and more. The active mode only affects `>>` output; internal arithmetic is always binary.

### Activating a script

Write the `0` and `9` digit of the target script enclosed in `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Output and booleans

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimal point always ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: # prefix always ASCII, digit adapts
>> #1 ¶         // → #१   (true  in Devanagari)
>> #0 ¶         // → #०   (false — distinct from ०  integer zero)

x = 28 > 4
>> x ¶          // → #१   (comparison result follows active mode)
```

### Native digit literals in source

Any supported script's digits are valid literals — in ranges, modulo, comparisons:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literals in any script

`#` + digit `0` or `1` from any block is a valid boolean literal:

```zymbol
#٠٩#
نشط = #١        // same as #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` is **always ASCII**. `#0` (false) is always visually distinct from `0` (integer zero) in every script.

---

## Data Operators

```zymbol
// Type conversion casts
##.42         // → 42.0  (to Float)
###3.7        // → 4     (to Int, round)
##!3.7        // → 3     (to Int, truncate)

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
content = <\ cat {file} \>      // interpolation in commands

output = </"./subscript.zy"/>   // execute another Zymbol script, capture output
>> output
```

> `><` captures CLI arguments as a string array (tree-walker only).

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
| `>>` | output | `$+[i]` | insert at index (1-based) |
| `<<` | input | `$-` | remove first by value |
| `¶` / `\\` | newline | `$--` | remove all by value |
| `?` | if | `$-[i]` | remove at index (1-based) |
| `_?` | else-if | `$-[i..j]` | remove range (1-based) |
| `_` | else / wildcard | `$?` | contains |
| `??` | match | `$??` | find all indices (1-based) |
| `@` | loop | `$[s..e]` | slice (1-based) |
| `@ N { }` | times loop (N iterations) | `$>` | map |
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
| `$!` | is error | `$!!` | propagate error |
| `<#` | import | `#>` | export |
| `#` | declare module | `::` | module call |
| `.` | field access | `#?` | type metadata |
| `#\|..\|` | parse number | `##.` | cast to Float |
| `###` | cast to Int (round) | `##!` | cast to Int (truncate) |
| `#.N\|..\|` | round | `#!N\|..\|` | truncate |
| `#,\|..\|` | comma format | `#^\|..\|` | scientific |
| `#d0d9#` | numeral mode switch | `#09#` | reset to ASCII |
| `<\ ..\>` | shell exec | `>\<` | CLI args |
| `\ var` | explicit destroy variable | | |

---

## Release Changelog

### v0.0.4 — 1-Based Indexing, First-Class Functions & Module Blocks _(April 2026)_

- **Breaking** All indexing switched to **1-based** — `arr[1]` is the first element; `arr[0]` is a runtime error
- **Added** Named functions are **first-class values** — pass directly to HOF: `nums$> double`
- **Added** Module **block syntax** required: `# name { ... }` — flat syntax removed
- **Added** Multi-dimensional indexing: `arr[i>j>k]` (navigation), `arr[p ; q]` (flat extraction)
- **Added** Type conversion casts: `##.expr` (Float), `###expr` (Int round), `##!expr` (Int truncate)
- **Added** String split: `str$/ delim` — returns `Array(String)`
- **Added** Concat build: `base$++ a b c` — appends multiple items
- **Added** Times loop: `@ N { }` — repeat exactly N times
- **Added** Labeled loop syntax: `@:name { }`, `@:name!`, `@:name>` — replaces `@ @name` / `@! name`
- **Added** Variable scope rules: `_name` variables have exact block scope; `\ var` destroys early
- **Added** Match comparison patterns: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Added** Module E013 error: executable statements in module body are forbidden
- **Fixed** `take_variable` no longer corrupts module constants on write-back
- **Fixed** `alias.CONST` now resolves correctly; `#>` can appear after function definitions
- **VM** Full parity: 393/393 tests pass

### v0.0.3 — Unicode Numeral Systems & LSP Improvements _(April 2026)_

- **Added** 69 Unicode digit blocks with mode-switch token `#d0d9#`
- **Added** Boolean literals in any script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Added** Klingon pIqaD digits (CSUR PUA U+F8F0–U+F8F9)
- **Added** `SetNumeralMode` VM opcode — full parity with tree-walker
- **Added** REPL respects active numeral mode in echo and variable display
- **Changed** Boolean `>>` output now includes `#` prefix (`#0` / `#1`) in all modes

### v0.0.2_01 — Operator Rename _(30 Mar 2026)_

- **Changed** `c|..|` → `#,|..|` and `e|..|` → `#^|..|` — consistent with `#` format prefix family
- **Added** Export alias: re-export module members under a different name

### v0.0.2 — Collection API Redesign & Installers _(24 Mar 2026)_

- **Added** Unified `$` operator family for arrays and strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Destructuring assignment for arrays, tuples, and named tuples
- **Added** Negative indices (`arr[-1]` = last element)
- **Added** Native installers — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Added** Compound assignment `^=`
- **Fixed** Parser arithmetic edge cases; documentation corrections

### v0.0.1 — Initial Public Release _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× faster, ~95% parity)
- All core constructs: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Full Unicode identifiers, module system, lambdas, closures, error handling
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Symbolic. Universal. Immutable._

