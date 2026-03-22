# Zymbol-Lang Compact Manual

**Zymbol-Lang** is a symbolic programming language. It uses no keywords — everything is a symbol. It works the same in any human language.

---

## Philosophy

- No keywords (`if`, `while`, `return` don't exist — only symbols `?`, `@`, `<~`)
- Full Unicode — identifiers in any language or emoji 👋
- Human-language agnostic — the code is identical in every language

---

## Variables and Constants

```zymbol
x = 10           // variable (mutable)
PI := 3.14159    // constant (immutable — error if reassigned)
name = "Ana"
active = #1      // boolean true
👋 := "Hello"
```

### Compound Assignment

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Data Types

| Type         | Example             | `#?` Symbol | Notes                             |
|--------------|---------------------|-------------|-----------------------------------|
| Integer      | `42`, `-7`          | `###`       | 64-bit signed                     |
| Float        | `3.14`, `1.5e10`    | `##.`       | Scientific notation OK            |
| String       | `"hello"`           | `##"`       | Interpolation: `"Hello {name}"`   |
| Char         | `'A'`               | `##'`       | One Unicode character             |
| Boolean      | `#1`, `#0`          | `##?`       | NOT numeric 1 and 0               |
| Array        | `[1, 2, 3]`         | `##]`       | All elements must be same type    |
| Tuple        | `(a, b)`            | `##)`       | Positional                        |
| Named Tuple  | `(x: 1, y: 2)`      | `##)`       | Access by name or index           |

---

## Output and Input

```zymbol
// Output — does NOT add newline automatically
>> "Hello" ¶                    // ¶ or \\ gives explicit newline
>> "a=" a " b=" b ¶             // multiple values by juxtaposition
>> "sum=" add(2, 3) ¶           // function calls in any position
>> (arr$#) ¶                    // postfix operators require parentheses

// Input
<< name                         // no prompt — reads into variable
<< "Your name? " name           // with prompt
```

> `¶` or `\\` are equivalent as newline.

---

## String Concatenation

Three valid forms — each for its context:

```zymbol
name = "Ana"
n = 25

// 1. Comma — in assignments with = or :=
msg = "Hello ", name, "!"              // → Hello Ana!
TITLE := "User: ", name

// 2. Juxtaposition — in >> output
>> "Hello " name " you are " n ¶       // → Hello Ana you are 25

// 3. Interpolation — in any context
desc = "Hello {name}, you are {n}"     // → Hello Ana, you are 25
```

> **Note**: `+` is for numbers only. Using it with strings generates a warning.

---

## Control Flow

```zymbol
x = 7

// Simple if
? x > 0 { >> "positive" ¶ }

// if / else-if / else
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

Blocks `{ }` are **required** even for a single line.

---

## Match

```zymbol
// Match with ranges
score = 85
grade = ?? score {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grade ¶    // → B

// Match with guards (arbitrary conditions)
temp = -5
state = ?? temp {
    _? temp < 0  : "ice"
    _? temp < 20 : "cold"
    _? temp < 35 : "warm"
    _            : "hot"
}
>> state ¶    // → ice

// Match with strings
color = "red"
code = ?? color {
    "red"   : "#FF0000"
    "green" : "#00FF00"
    _       : "#000000"
}
>> code ¶
```

---

## Loops

```zymbol
// Inclusive range: 0..4 iterates 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Range with step
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Reverse range
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// While
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// For-each over array
fruits = ["apple", "pear", "grape"]
@ f:fruits { >> f ¶ }

// Over string characters
@ c:"hello" { >> c "-" }
>> ¶    // → h-e-l-l-o-

// Break and Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continue
    ? i > 7 { @! }          // @! break
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Functions

```zymbol
// Declaration and call
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

// Recursion
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Functions have isolated scope — no access to outer variables
_global = 100
test() {
    x = 42    // local only
    <~ x
}
>> test() ¶    // → 42
```

> **Important**: Named functions `name(params){ }` are not first-class values.
> To pass as argument, wrap: `x -> name(x)`.

---

## Lambdas and Closures

```zymbol
// Simple lambda (implicit return)
double = x -> x * 2
sum = (a, b) -> a + b
>> double(5) ¶    // → 10
>> sum(3, 7) ¶    // → 10

// Block lambda (explicit return)
classify = x -> {
    ? x > 0 { <~ "positive" }
    _? x < 0 { <~ "negative" }
    <~ "zero"
}
>> classify(5) ¶     // → positive
>> classify(0) ¶     // → zero
>> classify(-5) ¶    // → negative

// Closures — lambdas capture outer scope variables
factor = 3
triple = x -> x * factor    // captures 'factor'
>> triple(7) ¶    // → 21

// Function factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas as values: store in arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [10, 20, 30, 40, 50]

// Access (0-based index)
>> arr[0] ¶    // → 10

// Length (requires parentheses in >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Append, remove, contains, slice
arr = arr$+ 60               // append
arr = arr$- 0                // remove index 0
has = arr$? 30               // → #1
slice = arr$[0..2]           // [20, 30]

// Update element
arr[1] = 99

// For-each
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` return a **new array** — assign back: `arr = arr$+ 4`.
> No chaining: use two separate assignments.

---

## Tuples

```zymbol
// Named tuple
person = (name: "Alice", age: 25)
>> person.name ¶    // → Alice
>> person.age ¶     // → 25
>> person[0] ¶      // → Alice (index also works)
```

---

## Higher-Order Functions

HOF operators require **inline lambda** — not a direct lambda variable.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
doubles = nums$> (x -> x * 2)
>> doubles ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
evens = nums$| (x -> x % 2 == 0)
>> evens ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (initial, (acc, elem) -> expr)
total = nums$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55
```

---

## Error Handling

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division by zero" ¶
} :! ##IO {
    >> "IO error" ¶
} :! {
    >> "other error: " _err ¶
} :> {
    >> "always runs" ¶
}
```

| Type        | When it occurs         |
|-------------|------------------------|
| `##Div`     | Division by zero       |
| `##IO`      | File / system          |
| `##Index`   | Index out of bounds    |
| `##Type`    | Type error             |
| `##Parse`   | Data parsing           |
| `##Network` | Network errors         |
| `##_`       | Any error (catch-all)  |

---

## Modules

```zymbol
// File: lib/calc.zy
# calc

#> { add, get_PI }    // exports BEFORE definitions

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// File: main.zy
<# ./lib/calc <= c    // alias required

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

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

| Symbol  | Operation         | Symbol     | Operation          |
|---------|-------------------|------------|--------------------|
| `=`     | variable          | `$#`       | length             |
| `:=`    | constant          | `$+`       | append             |
| `>>`    | output            | `$-`       | remove (by index)  |
| `<<`    | input             | `$?`       | contains           |
| `¶`/`\` | newline           | `$[s..e]`  | slice              |
| `?`     | if                | `$>`       | map                |
| `_?`    | else-if           | `$\|`      | filter             |
| `_`     | else / wildcard   | `$<`       | reduce             |
| `??`    | match             | `!?`       | try                |
| `@`     | loop              | `:!`       | catch              |
| `@!`    | break             | `:>`       | finally            |
| `@>`    | continue          | `$!`       | is error           |
| `->`    | lambda            | `$!!`      | propagate error    |
| `<~`    | return            | `#`        | declare module     |
| `\|>`   | pipe              | `#>`       | export             |
| `#1`    | true              | `<#`       | import             |
| `#0`    | false             | `::`       | module call        |

---

*Zymbol-Lang — Symbolic. Universal. Immutable.*

---

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
