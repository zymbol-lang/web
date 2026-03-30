# Zymbol-Lang Alegra Dothraki

**Zymbol-Lang** kisha athdrivar alegra. Vo alegra chiftik — haz athdrivar. Mahrazh khal e chek kisha dothraki.

- Vo chiftik (`if`, `while`, `return` vosecchi — alegra tebec `?`, `@`, `<~`)
- Unicode naas — fichas me ilch tebec, emoji 👋
- Tebec-vosecchi — alegra idh me ilch fichas

---

## Azhat bal Mra

```zymbol
x = 10              // azhat (ganar)
PI := 3.14159       // mra (vos ganar — nayc ibac)
fichas = "Ana"
hash_ = #1          // vos vosecchi
👋 := "M'athchomaroon"
```

```zymbol
x = 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++       // 5
x--       // 4
```

---

## Irge Qoy

| Irge         | Sarch             | Alegra `#?` | Nynir                              |
|--------------|-------------------|-------------|-------------------------------------|
| Gache        | `42`, `-7`        | `###`       | 64-bit                              |
| Gache mhi    | `3.14`, `1.5e10`  | `##.`       | Naas sarch OK                       |
| Fichas       | `"m'athchomaroon"`| `##"`       | Bora: `"Hash {fichas}"`             |
| Tebec Solus  | `'A'`             | `##'`       | At Unicode tebec                    |
| Hash/Vos    | `#1`, `#0`        | `##?`       | Vos gache at                        |
| Lajaki       | `[1, 2, 3]`       | `##]`       | Ilach irge nan                      |
| Tuple        | `(a, b)`          | `##)`       | Azhat                               |
| Fichas Tuple | `(x: 1, y: 2)`    | `##)`       | Fichas ilach gache                  |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Thirat bal Nakar

```zymbol
>> "M'athchomaroon" ¶           // ¶ bal \\ borarir tebec
>> "a=" a " b=" b ¶             // rimba gache — azhat
>> (arr$#) ¶                    // alegra gache poQlu'

<< fichas                       // vos tebec — nakar azhat
<< "Fichas? " fichas            // bal tebec
```

> `¶` bal `\\` — nan tebec tebec.

---

## Thirat Athdrivar

```zymbol
// Arithmetic — use assignments
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (integer division)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (exponentiation)

// Comparison
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logical
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Thirat

```zymbol
// Ehn irge — ilach azhat
fichas = "Ana"
n = 42

tebec2 = "M'athchomaroon ", fichas, "!"   // comma — in assignments
>> "Hash " fichas " vo " n ¶              // juxtaposition — in >>
naas2 = "Hash {fichas}, vo {n}"           // interpolation — anywhere
```

```zymbol
s = "M'athchomaroon"
len = s$#                  // 14
sub = s$[0..12]            // "M'athchomaroo"  (end exclusive)
has = s$? "chomaroon"      // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "M'Athchom Aroon"
rep1 = s$~~["a":"A":1]     // "M'Athchomaroon"  (first N only)
```

> **Nynir**: `+` gache tebec. Fichas — vosecchi.

---

## Hash

```zymbol
x = 7

? x > 0 { >> "asshekh" ¶ }

? x > 100 {
    >> "tih" ¶
} _? x > 0 {
    >> "asshekh" ¶
} _? x == 0 {
    >> "vos" ¶
} _ {
    >> "dothrak" ¶
}
```

> `{ }` — **poQlu'**, at tebec.

---

## Match

```zymbol
// Match gache
gache2 = 85
patlh = ?? gache2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match fichas
qoy = "qorasokh"
kode = ?? qoy {
    "qorasokh"  : "#FF0000"
    "yalli"     : "#00FF00"
    _           : "#000000"
}

// Match hrazef (guards)
SuD = -5
Dotlh = ?? SuD {
    _? SuD < 0  : "rhaggat"
    _? SuD < 20 : "bic"
    _? SuD < 35 : "asshekh"
    _            : "tih"
}
>> Dotlh ¶    // → rhaggat

// Statement form
?? n {
    0        : { >> "vos" ¶ }
    _? n < 0 : { >> "dothrak" ¶ }
    _        : { >> "asshekh" ¶ }
}
```

---

## Dothrak

```zymbol
@ i:0..4  { >> i " " }        // range inclusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // with step:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

ovvethikhea = ["hrazef", "jhavvorsa", "qora"]
@ f:ovvethikhea { >> f ¶ }    // for-each array

@ c:"khal" { >> c "-" }
>> ¶                          // → k-h-a-l-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> meh (continue)
    ? i > 7 { @! }             // @! troch'n (break)
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

// Labeled loop
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Maded

```zymbol
boq(a, b) { <~ a + b }
>> boq(3, 4) ¶    // → 7

gachedothrak(n) {
    ? n <= 1 { <~ 1 }
    <~ n * gachedothrak(n - 1)
}
>> gachedothrak(5) ¶    // → 120
```

Functions have **isolated scope** — they cannot read outer variables. Use output parameters `<~` to modify caller variables:

```zymbol
choH(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
choH(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> **Nynir**: Fichas maded `fichas(params){ }` — vos at eveth.
> Bora nob — borarir: `x -> fichas(x)`.

---

## Lambda bal Karyai

```zymbol
akat = x -> x * 2
boq2 = (a, b) -> a + b
>> akat(5) ¶    // → 10
>> boq2(3, 7) ¶  // → 10

// Block lambda
astat2 = x -> {
    ? x > 0 { <~ "asshekh" }
    _? x < 0 { <~ "dothrak" }
    <~ "vos"
}

// Closure — captures outer scope
factor = 3
ehn2 = x -> x * factor
>> ehn2(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Lajaki

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — access (0-indexed)
arr[-1]         // 5 — negative index (last)
arr$#           // 5 — length (use (arr$#) in >>)

arr = arr$+ 6            // append → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insert at index 2
arr3 = arr$- 3           // remove first occurrence of value
arr4 = arr$-- 3          // remove all occurrences
arr5 = arr$-[0]          // remove at index
arr6 = arr$-[1..3]       // remove range (end exclusive)

has = arr$? 3            // #1 — contains
pos = arr$?? 3           // [2] — all indices of value
sl = arr$[0..3]          // [1,2,3] — slice (end exclusive)
sl2 = arr$[0:3]          // [1,2,3] — same, count-based syntax

asc = arr$^+             // sorted ascending  (primitives only)
desc = arr$^-            // sorted descending (primitives only)

// Fichas tuple arrays — use $^ with comparator lambda
db = [(fichas: "Carla", akat: 28), (fichas: "Ana", akat: 25), (fichas: "Bob", akat: 30)]
by_akat  = db$^ (a, b -> a.akat < b.akat)
by_fichas = db$^ (a, b -> a.fichas > b.fichas)
>> by_akat[0].fichas ¶     // → Ana
>> by_fichas[0].fichas ¶   // → Carla

arr[1] = 99              // update in-place
arr = arr[1]$~ 99        // functional update — returns new array
```

> Ilach alegra ta' — **naur lajaki** — azhat: `arr = arr$+ 4`.
> Vos tanc: akat azhat.
> `$^+` / `$^-` sort **primitive arrays**. For tuple arrays use `$^` with a comparator lambda.

```zymbol
// Nested arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Thirat Azho

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
lajak3 = (fichas: "Ana", akat: 25, vaes: "Vaes Dothrak")
(fichas: n, akat: a) = lajak3   // n="Ana"  a=25
```

---

## Tuple

```zymbol
// Positional
point = (10, 20)
>> point[0] ¶    // → 10

// Named
lajak3 = (fichas: "Alice", akat: 25)
>> lajak3.fichas ¶    // → Alice
>> lajak3[0] ¶        // → Alice  (index also works)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, fichas: "Qohor")
>> p.pos.x ¶        // → 10
```

---

## Maded Khal

> HOF — **só lambda** — vos lambda azhat.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

akat2 = nums$> (x -> x * 2)                // map  → [2,4,6…20]
ehn3  = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
naas3 = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Chain via intermediates
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named functions inside HOF — wrap in lambda
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Hrazef Athtihar

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

## Vosecchi Thirat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "vos gache" ¶
} :! {
    >> "vosecchi: " _err ¶    // _err holds the error message
} :> {
    >> "ilach lúm" ¶
}
```

| Irge        | Hash                           |
|-------------|--------------------------------|
| `##Div`     | Vos gache                      |
| `##IO`      | Tebec / vaes                   |
| `##Index`   | Gache andë                     |
| `##Type`    | Irge vosecchi                  |
| `##Parse`   | Azhat vosecchi                 |
| `##Network` | Tengwë vosecchi                |
| `##_`       | Ilach vosecchi                 |

---

## Vaes Dothrak

```zymbol
// Tebec: lib/calc.zy
# calc

#> { boq, get_PI }    // Nob AT — definitions vo' qaSpa'

_PI := 3.14159
boq(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Tebec: main.zy
<# ./lib/calc <= c    // Fichas poQlu'

>> c::boq(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Export with a different public name
# mylib
#> { _internal_boq <= boq }

_internal_boq(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::boq(3, 4) ¶    // → 7
```

---

## Thirat Me Jinne

```zymbol
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
fmt = #,|1234567|      // → 1,234,567  (comma-separated)
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

## Shell Kisha

```zymbol
jaj = <\ date +%Y-%m-%d \>     // captures stdout (includes trailing \n)
>> "Jalan: " jaj

tebec = "data.txt"
qosar = <\ cat {tebec} \>      // interpolation in commands

nob = </"./subscript.zy"/>     // execute another Zymbol script, capture output
>> nob
```

> `><` captures CLI arguments as a string array (tree-walker only).

---

## Ilach Alegra: FizzBuzz

```zymbol
astat(eveth) {
    ? eveth % 15 == 0 { <~ "FizzatBuzzat" }
    _? eveth % 3  == 0 { <~ "Fizzat" }
    _? eveth % 5  == 0 { <~ "Buzzat" }
    _ { <~ eveth }
}

@ i:1..20 { >> astat(i) ¶ }
```

---

## Alegra Tirë

| Alegra   | Moj                | Alegra     | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | azhat              | `$#`       | gache                 |
| `:=`     | mra                | `$+`       | boq                   |
| `>>`     | thirat             | `$+[i]`    | insert                |
| `<<`     | nakar              | `$-`       | teq (gache)           |
| `¶`/`\`  | tebec tebec        | `$--`      | teq ilach             |
| `?`      | hash (if)          | `$-[i]`    | teq Daq               |
| `_?`     | hash-vos (elif)    | `$-[i..j]` | teq Dara'             |
| `_`      | vos / ilach        | `$?`       | hash                  |
| `??`     | match              | `$??`      | Hoch Daq tu'          |
| `@`      | dothrak            | `$[s..e]`  | mhi                   |
| `@!`     | troch'n (break)    | `$>`       | map                   |
| `@>`     | meh (continue)     | `$\|`      | filter                |
| `->`     | Lambda             | `$<`       | reduce                |
| `$^+`    | sort ascending     | `$^-`      | sort descending       |
| `$^`     | sort comparator    |            |                       |
| `<~`     | bora               | `!?`       | lajak (try)           |
| `\|>`    | Pipe               | `:!`       | karyai (catch)        |
| `#1`     | hash               | `:>`       | ilach (finally)       |
| `#0`     | vos                | `$!`       | vosecchi hash         |
| `<#`     | nakar (import)     | `$!!`      | vosecchi thirat       |
| `#`      | vaes fichas        | `#>`       | nob (export)          |
| `::`     | vaes maded         | `.`        | field access          |
| `#\|..\|` | parse number      | `#?`       | type metadata         |
| `#.N\|..\|` | round           | `#!N\|..\|` | truncate            |
| `c\|..\|` | comma format      | `e\|..\|`  | scientific            |
| `<\ ..\>` | shell exec        | `>\<`      | CLI args              |

---

*Zymbol-Lang — Alegra. Ilach. Vos ganar.*

> **Nynir:** Alegra haz carna bal thirat AI (tebec maded).
> Ilach maded ná, mal neldë fichas bal sarch vosecchi.
> Khal nynir [Zymbol-Lang alegra](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
