> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> **Aviso:** Esta documentación fue creada con asistencia de inteligencia artificial (IA).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Manual

> **Revised for v0.0.9 — 2026-09-07**

**Zymbol-Lang** is a symbolic programming language. No words in its grammar — every construct is a mark. Works identically in any human language.

- No `if`, `while`, `return` — only `?`, `@`, `<~`
- Full Unicode — identifiers in any language or emoji
- Human-language agnostic — the code is the same everywhere

**Interpreter version**: v0.0.9 | **Test coverage**: 660/666 (three engines agreeing, 0 diverging)

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
x++       // 5
x--       // 4
```

`°` (degree sign, U+00B0) auto-initializes a variable to its neutral value on first use:

```zymbol
nums = [3, 1, 4, 1, 5]
@ n:nums {
    °total += n
}
>> total ¶              // → 14
```

> `°x` (prefix) anchors above the loop — the result is readable after `@`.
> `x°` (postfix) anchors inside the loop — it dies when the loop ends.

A statement that is only a name reads the variable and throws the value away, so it says so:

```zymbol
count = 5
count
```

The compiler says so:

```text
warning: this statement does nothing: 'count' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

---

## Data Types

| Type | Literal | `#?` tag | Notes |
|------|---------|----------|-------|
| Int | `42`, `-7` | `###` | Safe integer: ±(2⁵³ − 1) |
| Float | `3.14`, `1.5e10` | `##.` | IEEE-754 double |
| String | `"text"` | `##"` | Interpolation: `"Hello {name}"` |
| Char | `'A'` | `##'` | One Unicode code point |
| Bool | `#1`, `#0` | `##?` | NOT numeric — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | One type, checked |
| Declared mix | `#[1, "two"]` | `##[` | Same type as `[…]`, not checked |
| Tuple | `(a, b)` | `##)` | Positional, immutable |
| Dictionary | `#(x: 1, y: 2)` | `##(` | Keyed, mutable |
| Function | named function ref | `##()` | First-class; display `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-class; display `<lambd/N>` |
| Unit | `##_` | `##_` | Absence — there is no null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(a: 1)#? ¶          // → (##(, 1, #(a: 1))
```

An integer that leaves the safe range is a catchable error, never a silent wrap:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "out of range" ¶ // → out of range
}
```

`##_` is how a program asks whether something is absent:

```zymbol
nothing() { }
value = nothing()
>> (value == ##_) ¶     // → #1
```

---

## Output & Input

```zymbol
name = "Alice"
total = 3
>> "Hello" ¶            // → Hello
>> "a=" name " b=" total ¶ // → a=Alice b=3
>> total#? ¶            // → (###, 1, 3)
```

```zymbol
<< name
<< "Enter name: " name
<< ###(4) "Age: " age
```

**Look at the shape of the two marks.** `>>` points outward: it takes data out of the
program. `<<` points inward: it brings data in. There is nothing to memorise there — the
arrow shows which way the information travels, and that same idea comes back in every mark
that moves something.

> `¶` and `\\` are equivalent newlines. `>>` never adds one.
> A typespec before the prompt validates as it reads and re-prompts until valid:
> `##.` Float · `##.(T,D)` decimal · `###(N)` Int · `##"(N)` text · `##'` one Char.

At the top level of a file, `<~` is the program's exit status:

```zymbol
>> "checking" ¶         // → checking
<~ 0
```

---

## TUI Primitives

Terminal UI operators for interactive programs. Most require a `>>| { }` block (alternate screen + raw mode).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Running"
    @~ 1000
    >>~ (2, 1) > "Done."
}
```

```zymbol
>>| {
    [rows, cols] = >>?
    >>~ (1, 1) > "Terminal: " rows " x " cols
    <<| key
    >>~ (2, 1) > "Pressed: " key
}
```

This is where you can see why marks combine instead of multiplying. You already know `<<` is
input and `?` asks without committing. Only one mark is new:

- `|` is **a single unit**, not the whole stream.

With that, both keyboard operators read themselves:

```text
<<        |            ?
input     one unit     without committing

<<|   take ONE key, and wait until there is one
<<|?  look whether there IS a key, and carry on if there is not
```

The same on the other side: `>>` sends out, `>>!` sends out **forcefully** (it clears the
whole screen), and `>>?` **asks** instead of writing (how big the terminal is). The mark on
the right is the one that changes the mode, and it always comes last.

> `>>!` clears the screen. `>>?` returns `(rows, cols)`. `@~ N` sleeps N milliseconds.
> `<<|` reads one keypress (blocking); `<<|?` polls without blocking (`'\0'` if none).
> Arrow keys arrive decoded as `'↑' '↓' '←' '→'`; ESC is code point 27.
> Positioned output tuple: `(row, col, BKS, fg, bg)` — any slot may be omitted with a comma (`>>~ (,,, 196) > "red"`).
> BKS bitmask: `1`=Bold, `2`=Italic, `4`=Underline. ANSI 256-color palette (`0`=terminal default).

---

## Operators

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (integer division)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` never coerces: `"5" == 5` is `#0`. Ordering does: `"5" > 4` is `#1`, and so is
> `"४२" > 5` — numeric text in any of the 69 digit scripts compares as a number.
> A function equals only itself, never another function with the same body.

---

## Strings

```zymbol
name = "Alice"
n = 42
>> "Hello " name " you have " n ¶ // → Hello Alice you have 42
desc = "Hello {name}, you have {n}"
>> desc ¶               // → Hello Alice, you have 42
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[1..5]             // "Hello"
has = s$? "World"          // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
line = "─" $* 20
```

> `+` is for numbers only. Use juxtaposition or interpolation for strings.
> `\{` and `\}` are literal braces — the escape is symmetric.

---

## Control Flow

```zymbol
x = 7
? x > 100 {
    >> "large" ¶
} _? x > 0 {
    >> "positive" ¶     // → positive
} _ {
    >> "negative" ¶
}
```

Two new marks here, and a third that comes from putting them together:

- `?` is **to ask**: it opens a condition.
- `_` is **what was not specified**: the branch left when no question matched.
- `_?` is both in a row: *if nothing matched, ask again*.

That is why `_?` is written the way it is. It is not a new symbol to learn — it is `_`
followed by `?`, and it means exactly what its two parts mean, read in order.

> `{ }` braces are **required** even for a single statement.

---

## Match

```zymbol
score = 85
grade = ?? score {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> grade ¶              // → B
```

```zymbol
temp = -5
state = ?? temp {
    < 0  => "ice"
    < 20 => "cold"
    _    => "hot"
}
>> state ¶              // → ice
```

You already know `?` as "ask". **`??` is asking many times**: doubling a mark, anywhere in
the language, is doing several times what the mark does once. One `?` tests a condition;
`??` tests against a list of cases.

Alternatives join with `||`, and they may mix pattern kinds:

```zymbol
key = 'P'
action = ?? key {
    'p' || 'P' => "pause"
    < 0 || > 100 => "out of range"
    _ => "ignored"
}
>> action ¶             // → pause
```

---

## Loops

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
fruits = ["apple", "pear", "grape"]
@ f:fruits { >> f " " }
>> ¶                    // → apple pear grape
@ c:"hello" { >> c "-" }
>> ¶                    // → h-e-l-l-o-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
count = 0
@:outer {
    count++
    ? count >= 3 { @:outer! }
}
>> count ¶              // → 3
```

`@` is the mark of **time**: everything that repeats lives in it. To cut that time short you
add one mark beside it:

- `@!` — `!` is **force**: leave the loop now.
- `@>` — `>` pushes forward: skip to the next turn.
- `@:outer!` — `:` **binds a name**, so this cuts the loop *called* outer, not the nearest one.

Three operators, and none of them had to be memorised separately: they are `@` plus a mark
that already says what it does.

> **A specifier is a count or a condition.** An `Int` is a count, evaluated once — `@ 0` runs
> the body zero times. Anything else is a condition. There is no truthiness: `@ []` and
> `@ 3.5` are refused. To walk a collection use `@ x:items`; to count it, `@ items$#`.

---

## Functions

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶          // → 7
```

```zymbol
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶       // → 120
```

A function reads the file's variables by value, and a write inside stays inside:

```zymbol
limit = 100
within(n) { <~ n < limit }
>> within(42) ¶         // → #1
```

Two marks change that, and both are written **in the signature and at the call site**:

```zymbol
bump(counter<~) { counter = counter + 1 }
total = 0
bump(total<~)
>> total ¶              // → 1
```

> `p~` is a working copy — the body may reassign it and the caller is untouched.
> `p<~` is an output parameter — the change travels back. `bump(total)` without the
> mark is a semantic error: the annotation and the signature cannot drift apart.

---

## Lambdas & Closures

```zymbol
double = x -> x * 2
sum = (a, b) -> a + b
>> double(5) ¶          // → 10
>> sum(3, 7) ¶          // → 10
```

```zymbol
classify = x -> {
    ? x > 0 { <~ "positive" }
    _? x < 0 { <~ "negative" }
    <~ "zero"
}
>> classify(-4) ¶       // → negative
```

```zymbol
factor = 3
triple = x -> x * factor
>> triple(7) ¶          // → 21
```

```zymbol
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶           // → 15
```

A lambda may take no parameters at all:

```zymbol
answer = () -> 42
>> answer() ¶           // → 42
```

> A lambda captures the file's variables **when it is created**; a named function reads
> them **when it is called**.

---

## Arrays

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   indexing is 1-based
>> arr[-1] ¶      // → 5   negative counts from the end
>> arr$# ¶        // → 5   length
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   append
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  insert at position 2
>> (arr$- 3) ¶          // → [1, 2]         remove first occurrence
>> (arr$-[1]) ¶         // → [2, 3]         remove at index 1
>> (arr$[1..2]) ¶       // → [1, 2]         slice, both ends included
>> (arr$? 3) ¶          // → #1             contains
```

They all start with `$`, the mark for **collection**, and continue with a mark saying what is
done in it: `#` how many, `+` add, `-` remove, `?` ask whether it is there. And as with `??`,
doubling the mark means doing it exhaustively: `$?` asks *whether* a value is present, `$??`
asks *in how many places* and returns them all.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   ascending
>> (arr$^-) ¶     // → [3, 2, 1]   descending
```

**The rule of the result.** One operator, and what the surrounding code does with it
decides: used, it **builds** and leaves the original alone; discarded, it **modifies**.

```zymbol
arr = [1, 2, 3]
copy = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> copy ¶               // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` never writes into a collection.** `arr[2] = 99` is not a form of Zymbol — `=` gives
> a value to a NAME. Changing part of a collection is `$~`, in every collection.

`[…]` holds one type and is checked; a deliberate mix is **declared** with `#[…]`:

```zymbol
ok = #[1, "two", #1]
>> ok ¶                 // → [1, two, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Multi-dimensional Indexing

`>` walks down a nested structure. One bracket group addresses one element, however deep.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   row 2, column 3
>> m[-1>-1] ¶      // → 9   last row, last column
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          flat: the diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   structured: the corners
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` is **not** a form of Zymbol. The chained index is refused, for reading as well
> as for writing — one bracket group per access, and `>` is what goes between the steps.

---

## Dictionaries

A tuple with named fields is a dictionary, and since v0.0.9 it is written `#(…)`.

```zymbol
person = #(name: "Alice", age: 25)
>> person.name ¶        // → Alice
>> person["age"] ¶      // → 25
```

```zymbol
person = #(name: "Alice", age: 25)
field = "name"
>> person[field] ¶      // → Alice
```

It is mutable, keys can be added, and it can be walked:

```zymbol
stock = #(pear: 4)
stock["apple"]$~ 10
@ k:stock { >> k "=" stock[k] " " }
>> ¶                    // → pear=4 apple=10
```

```zymbol
stock = #(pear: 4, apple: 10)
@ (k, v):stock { >> k ":" v " " }
>> ¶                    // → pear:4 apple:10
```

> `#()` is the empty dictionary, which `()` could not be — it would have to be the empty
> tuple as well. The bare `(a: 1)` is refused, with that as the message: *a dictionary is
> written `#(…)`*.
> A dictionary is addressed by key, never by position, so `person[1]` is an error.

---

## Tuples

Tuples are **immutable** ordered containers that hold values of different types.

```zymbol
point = (10, 20)
>> point[1] ¶           // → 10
data = (42, "hello", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Any attempt to modify a tuple in place is an error, whatever the operator —
> immutability is a property of the value, not an exception inside each `$`.

---

## Destructuring

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[first, *rest] = arr
>> first ¶              // → 10
>> rest ¶               // → [20, 30, 40, 50]
```

```zymbol
point = (100, 200)
(px, py) = point
>> px " " py ¶          // → 100 200
```

```zymbol
person = #(name: "Ana", age: 25)
#(name: n, age: a) = person
>> n " " a ¶            // → Ana 25
```

> The bracket shape is typed: `[…]` takes an array, `(…)` a tuple, `#(…)` a dictionary.
> The last name **absorbs the remainder**, so destructuring never fails on length —
> `(a, b, c) = (1,2,3,4,5)` gives `c = (3,4,5)`, and `##_` when nothing is left.

---

## Higher-Order Functions

```zymbol
nums = [1, 2, 3, 4, 5]
>> (nums$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (nums$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (nums$< (0, (acc, x) -> acc + x)) ¶ // → 15
```

```zymbol
nums = [1, 2, 3, 4, 5, 6]
double(x) { <~ x * 2 }
is_big(x) { <~ x > 3 }
>> (nums$> double) ¶    // → [2, 4, 6, 8, 10, 12]
>> (nums$| is_big) ¶    // → [4, 5, 6]
```

```zymbol
db = [#(name: "Carla", age: 28), #(name: "Ana", age: 25)]
by_age = db$^ (a, b -> a.age < b.age)
>> by_age[1].name ¶     // → Ana
```

> A named function goes to a HOF **without parentheses**: `nums$> double`. Writing
> `nums$> (double)` is a parse error, because `(` opens a lambda.

---

## Pipe Operator

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> double(_)) ¶   // → 10
>> (10 |> add(_, 5)) ¶  // → 15
>> (5 |> double(_) |> inc(_)) ¶ // → 11
```

---

## Error Handling

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division by zero" ¶   // → division by zero
} :! {
    >> "other: " _err ¶
} :> {
    >> "always runs" ¶        // → always runs
}
```

| Kind | When |
|------|------|
| `##Div` | Division by zero |
| `##Index` | Index out of bounds |
| `##Key` | Key not in a dictionary |
| `##Range` | Outside the safe integer range |
| `##Type` | Type mismatch |
| `##Parse` | Data parsing |
| `##IO` | File / system |
| `##Network` | Network errors |
| `##DB` | Database |
| `##Time` | A date that does not exist |
| `##_` | Any error (catch-all) |

`!` is the mark of **error and force**, and it reads the same in both families: `$!` asks a
value whether it is an error; `$!!`, with the mark doubled, propagates it upward without
asking.

> Standard-library failures come back as **soft error values** you test with `$!` or catch
> with `!?`, rather than aborting. `$!!` propagates one to the caller.

---

## Modules

```zymbol
# calc {
    #> { add, PI }

    PI := 3.14159
    add(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::add(5, 3) ¶
>> c.PI ¶
```

```zymbol
# mylib {
    #> { internal_add => sum }

    internal_add(a, b) { <~ a + b }
}
```

The two module marks are the same idea again, now applied to files: `#` is the level of
**declaration** — what a thing *is*, not what it is worth — and the arrow says which way the
code travels:

```text
<#   the arrow enters: import, bring in from another file
#>   the arrow leaves: export, offer to other files
```

A direction mark always sits on the edge facing the way it points. It is the same reason `<~`
returns leftward (out of the function) and `->` enters rightward (into the lambda's body).

> **A module declares what it exports.** The `#>` block is required — omitting it is
> **E014**, and `#> { }` is how a module says its surface is empty. `::` calls a function,
> `.` reads a constant. Only imports, the export block, literal initialisers and function
> definitions may appear in a module body; anything executable is **E013**.

---

## Standard Library

Native modules, imported like any other:

| Module | Functions |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   two glyphs, four columns
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

day = T::of(2026, 1, 31)
>> T::format(day, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(day, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` measures **display columns**, not characters: CJK and most emoji are 2 columns,
> so lay a table out with `t::width`, never `$#`.
> In `std/time` an instant is milliseconds since the epoch. Below a day is duration, from a
> day up is calendar — so a month lands on the same day of the month, clamped. `diff(a, b)`
> is `a - b`, so the earlier instant first gives a negative answer.

---

## Packages

A `.zyp` bundles a multi-file program into one portable file. It is an archive of
**source**, not a binary, so it runs anywhere a `zymbol` binary does.

```bash
zymbol package myproject/ --script main.zy -o myproject.zyp
zymbol run myproject.zyp
```

> The archive carries a manifest (`zyp.toml`) declaring its entry scripts and the engine
> version it needs. `zymbol run` extracts it to a temporary directory and runs from there,
> so code is disposable while anything the script writes lands in your real working
> directory. The playground loads `.zyp` files too.

---

## Numeral Modes

Zymbol can write numbers in **69 Unicode digit scripts** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Mathematical Bold, LCD segments, and more. The mode is global to the process and affects output; arithmetic is unchanged.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reset to ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Any supported script's digits are valid literals in source:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Reading is symmetric — a digit is understood in any script:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` is always ASCII, so `#0` stays visually distinct from the digit zero in every script.
> `#,` and `#^` write their digits in the active script too, and the separators follow it —
> but the pair never inverts: `,` groups and `.` divides, in every script.

---

## Data Operators

```zymbol
f = ##.42         // to Float
i = ###3.7        // to Int, rounded    → 4
t = ##!3.7        // to Int, truncated  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> A Float prints as digits, never as an exponent, and drops a trailing `.0` — `##.42`
> writes `42` and is still a Float, as `f#?` shows.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   fail-safe: it returns the input unchanged
>> ##!'A' ¶        // → 65    a Char's code point
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          round to 2 decimals
>> #!2|pi| ¶       // → 3.14          truncate to 2 decimals
>> #,|1234567| ¶   // → 1,234,567     thousands separators
>> #^|12345.678| ¶ // → 1.2345678e4   scientific notation
```

```zymbol
>> 0x41 ¶        // → A   hex
>> 0b01000001 ¶  // → A   binary
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   decimal
```

> A base literal in the ASCII range is a **character**: `0d65 == 'A'` is `#1`, and
> `0d65 == 65` is `#0`. All four bases spell the same character.

---

## Shell Integration

```zymbol
today = <\ date +%Y-%m-%d \>
>> "Today: " today
```

```zymbol
output = </"./subscript.zy"/>
>> output
```

> `<\ … \>` captures stdout and stderr, with the trailing newline stripped.
> `>< args` captures the command-line arguments as a string array.

---

## Complete Example: FizzBuzz

```zymbol
classify(number) {
    ? number % 15 == 0 { <~ "FizzBuzz" }
    _? number % 3  == 0 { <~ "Fizz" }
    _? number % 5  == 0 { <~ "Buzz" }
    <~ number
}

@ i:1..20 { >> classify(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (one per line)
```

---

## How the Marks Combine

You have been seeing the same thing all through this manual: **an operator is not a drawing
to memorise, it is several marks in a row, and each one contributes its meaning.** Now that
you know them all, here is the whole pattern.

First comes **which world we are in**:

| Mark | World | You saw it in |
|------|-------|---------------|
| `$` | a collection | `$#` `$+` `$?` `$^-` |
| `@` | time, whatever repeats | `@!` `@>` `@~` |
| `#` | what something *is*, not what it is worth | `#?` `#(…)` `<#` `#>` |
| `>>` | out of the program | `>>` `>>!` `>>?` |
| `<<` | into the program | `<<` `<<\|` `<<\|?` |
| `?` | to ask, without committing | `?` `_?` `??` `$?` |
| `!` | force, or error | `@!` `$!` `!?` |

Then comes **what is done there**: `+` add, `-` remove, `^` order, `~` modify, `#` count,
`|` a single unit, `:` bind a name.

And two rules that never fail:

**Doubling a mark makes it exhaustive.** `?` asks once, `??` tests many cases. `$?` asks
whether a value is there, `$??` returns every place it is. `!` flags an error, `!!`
propagates it without asking.

**The mode mark always comes last.** When `?` or `!` appear to say *how* something is done —
tentatively or forcefully — they are the final mark of the operator: `$??`, `$!!`, `<<|?`,
`@!`, `##!`, `>>!`, `>>?`, `@:outer!`. There is never an operation after them.

Something practical falls out of that: **a combination you have never seen already makes
sense before you look it up.** If `$` is collection and `^` is order and `-` is reversed,
then `$^-` sorts descending, and nobody had to tell you.

Not the whole inventory works this way, and saying so is better than pretending. Most
operators come apart cleanly. Six come apart but mean more than their parts: `!?` `:!` `:>`
`|>` `::` `$++`. And ten have to be learned by heart because they do not come apart at all:
`¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Counting the opaque ones instead of assuming they are few is deliberate: they are the
> language's real memorisation cost. The full reference — the inventory, the declared
> homographs, and the rules a new operator must satisfy to exist — is `SYMBOLS.md`, in the
> interpreter repository.

---

## Symbol Reference

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | variable | `$#` | length |
| `:=` | constant | `$+` | append |
| `>>` | output | `$+[i]` | insert at index (1-based) |
| `<<` | input | `$-` | remove first by value |
| `¶` / `\\` | newline | `$--` | remove all by value |
| `?` | if | `$-[i]` | remove at index (1-based) |
| `_?` | else-if | `$-[i..j]` | remove range (1-based) |
| `_` | else / wildcard | `$?` | contains |
| `??` | match | `$??` | find all indices (1-based) |
| `\|\|` | or-pattern in a match arm | `$[s..e]` | slice (1-based) |
| `@` | loop | `$>` | map |
| `@ N { }` | times loop (N iterations) | `$\|` | filter |
| `@!` | break | `$<` | reduce |
| `@>` | continue | `$/ delim` | string split |
| `@:name { }` | labeled loop | `$++ a b c` | concat build |
| `@:name!` | break label | `$~~[p:r]` | string replace |
| `@:name>` | continue label | `$*` | string repeat |
| `->` | lambda | `arr[i]$~ v` | the ONE update form |
| `<~` | return / output param | `~` | working-copy param |
| `arr[i>j]` | navigation index | `arr[p ; q]` | flat extraction |
| `$^+` | sort ascending | `$^-` | sort descending |
| `$^` | sort with comparator | `\|>` | pipe |
| `!?` | try | `:!` | catch |
| `:>` | finally | `$!` | is error |
| `$!!` | propagate error | `#1` / `#0` | true / false |
| `##_` | Unit — absence | `[…]` | array, one type |
| `#[…]` | array, declared mix | `#(…)` | dictionary |
| `(…)` | positional tuple | `#()` | empty dictionary |
| `<#` | import | `#>` | export |
| `#` | declare module | `::` | module call |
| `.` | field / constant access | `#?` | type metadata |
| `#\|..\|` | parse number | `##.` | cast to Float |
| `###` | cast to Int (round) | `##!` | cast to Int (truncate) |
| `#.N\|..\|` | round | `#!N\|..\|` | truncate |
| `#,\|..\|` | thousands separators | `#^\|..\|` | scientific |
| `#d0d9#` | numeral mode switch | `#09#` | reset to ASCII |
| `<\ ..\>` | shell exec | `><` | CLI args |
| `\ var` | destroy variable | `°x` / `x°` | hot definition |
| `>>\|` | TUI block (alt screen) | `>>~` | positioned output |
| `>>!` | clear screen | `>>?` | query terminal size |
| `<<\|` | blocking keypress | `<<\|?` | non-blocking keypress |
| `@~ N` | sleep N milliseconds | `0d` `0x` `0o` `0b` | base literals |

---

## Release Changelog

### v0.0.9 — The Collections Decided _(September 2026)_

- **Breaking** The dictionary has a notation of its own: `#(key: value)`. The bare `(a: 1)` is refused, and `#()` is the empty dictionary — which `()` could never be
- **Breaking** Indexed assignment withdrawn: `arr[i] = v` and every compound form. `=` gives a value to a NAME; changing part of a collection is `$~`
- **Breaking** The chained index `m[i][j]` is refused for reading as well as writing — `>` is what goes between the steps
- **Breaking** A module must declare what it exports (**E014**); `#> { }` says the surface is empty
- **Breaking** A loop specifier is a count or a condition — no truthiness. `@ []` and `@ 3.5` are refused
- **Added** `##_` — the Unit literal, and how a program asks whether something is absent
- **Added** `#[…]` — an array whose mix of element types is declared
- **Added** `#?` tells the four collections apart: `##]` `##[` `##)` `##(`
- **Added** `std/time` — the clock and the civil calendar, with zones and calendar arithmetic
- **Added** A top-level `<~` is the program's exit status
- **Added** `@ (k, v):pairs` — a pattern in the loop head
- **Added** `#|c|` reads a digit in any of the 69 scripts; `#,` and `#^` write theirs in the active one
- **Changed** `Int` is a safe integer, ±(2⁵³ − 1), fail-closed in every engine
- **Changed** A named function reads the file's variables at call time, by value
- **Changed** A statement that only reads a name warns instead of passing silently
- **Engines** 660 of 666 corpus files agree across all three engines, 0 diverging

### v0.0.8 — Auto-Free, `std/term` & Packages _(August 2026)_

- **Added** Automatic destruction at last use — invisible; it only lowers peak memory
- **Added** `std/term` — display metrics in terminal columns
- **Added** `##!` on a `Char` — its Unicode code point
- **Added** Match or-patterns: `'p' || 'P' => …`, alternatives of any kind in one arm
- **Added** Zymbol Packages (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Added** `<~` at the call site is required wherever the callee declares an output parameter
- **Fixed** Module-system parity in the register VM

### v0.0.7 — Native Standard Library _(July 2026)_

- **Added** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — all with soft error values
- **Added** Typed/validated input: `<< ##.(5,2) "price: " p`
- **Added** Postfix operators directly in `>>` — no parentheses needed
- **Changed** Fail-closed formatter: it refuses to write output it cannot re-read

### v0.0.6 — Refinement & Scientific Stdlib _(June 2026)_

- **Breaking** `=>` replaces `:` in match arms and `<=` in import/export aliases
- **Added** `std/math` and `std/random`
- **Added** Dictionary update by key: `d["k"]$~ value`

### v0.0.5 — TUI Primitives & Hot Definition _(May 2026)_

- **Added** TUI block `>>| { }`, positioned output `>>~`, key input `<<|` and `<<|?`
- **Added** `>>!` clear screen, `>>?` terminal size, `@~ N` sleep
- **Added** Hot definition `°x` / `x°`, and string repeat `$*`

### v0.0.4 — 1-Based Indexing & First-Class Functions _(April 2026)_

- **Breaking** All indexing is **1-based** — `arr[1]` is the first element
- **Added** Named functions as first-class values; module block syntax `# name { }`
- **Added** Multi-dimensional indexing `arr[i>j>k]` and flat extraction `arr[p ; q]`

### v0.0.3 — Unicode Numeral Systems _(April 2026)_

- **Added** 69 Unicode digit blocks with the mode-switch token `#d0d9#`
- **Added** Boolean literals in any script — `#१` / `#०`

### v0.0.2 — Collection API Redesign _(March 2026)_

- **Added** The `$` operator family for arrays and strings
- **Added** Destructuring assignment, and negative indices

### v0.0.1 — Initial Public Release _(March 2026)_

- Tree-walker interpreter + register VM (`--vm`)
- All core constructs: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Full Unicode identifiers, module system, lambdas, closures, error handling
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Symbolic. Universal. Immutable._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**License:** this manual is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Full text: `LICENSE-CC-BY-SA-4.0` in <https://github.com/zymbol-lang/web>. The interpreter and the browser engine (`zymbol.js`) are separate works, licensed AGPL-3.0-only.
