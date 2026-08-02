# Zymbol-Lang Dovaogēdy Sȳrior

**Zymbol-Lang** issa ānogar glaeson hen tymptir. Bē udra kostilus — iemnon issa ānogar. Issa sȳz hen bantis udra ēngos.

- Daor udra (`if`, `while`, `return` kostus daor — ānogar `?`, `@`, `<~`)
- Unicode sȳz — zȳha ēngos iemnon, emoji 👋
- Ēngos-daor — glaeson idh issa bantis ēngo

---

## Issa bal Morghūlis

```zymbol
x = 10              // issa (gaomagon)
PI := 3.14159       // morghūlis (daor gaomagon — sȳz lo gaomagon)
brōzi = "Ana"
elek_ = #1          // iksan vala
👋 := "Rytsas"
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

## Bantis Udra

| Bantis       | Naas              | Ānogar `#?` | Nynir                              |
|--------------|-------------------|-------------|-------------------------------------|
| Lentor       | `42`, `-7`        | `###`       | 64-bit                              |
| Lentor mēre  | `3.14`, `1.5e10`  | `##.`       | Bantis naas OK                      |
| Udra         | `"rytsas"`        | `##"`       | Bora: `"Rytsas {brōzi}"`            |
| Tebec Mēre   | `'A'`             | `##'`       | Mēre Unicode tebec                  |
| Iksan/Daor  | `#1`, `#0`        | `##?`       | Daor lentor mēre                    |
| Glaeson      | `[1, 2, 3]`       | `##]`       | Bantis iemnon nan                   |
| Tuple        | `(a, b)`          | `##)`       | Gaomagon                            |
| Brōzi Tuple  | `(x: 1, y: 2)`    | `##)`       | Brōzi iemnon lentor                 |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Gevives bal Ūndegon

```zymbol
>> "Rytsas" ¶                   // ¶ bal \\ borarir tebec
>> "a=" a " b=" b ¶             // sȳrys lentor — gaomagon
>> (arr$#) ¶                    // ānogar lentor poQlu'

<< brōzi                        // daor tebec — ūndegon issa
<< "Ñuha brōzi? " brōzi         // bal tebec
```

> `¶` bal `\\` — nan tebec tebec.

---

## Vali Bartosi

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

## Kostilus

```zymbol
// Tȳni bantis — iemnon gaomagon
brōzi = "Ana"
n = 42

tebec2 = "Rytsas ", brōzi, "!"           // comma — in assignments
>> "Rytsas " brōzi " issa lentor " n ¶   // juxtaposition — in >>
naas2 = "Rytsas {brōzi}, issa lentor {n}" // interpolation — anywhere
```

```zymbol
s = "Valar Morghulis"
len = s$#                  // 15
sub = s$[0..5]             // "Valar"  (end exclusive)
has = s$? "Morghulis"      // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "VAlAr MorghuliS"
rep1 = s$~~["a":"A":1]     // "VAlAr Morghulis"  (first N only)
```

> **Nynir**: `+` lentor tebec. Udra — sȳz.

---

## Lo Daor

```zymbol
x = 7

? x > 0 { >> "iksan" ¶ }

? x > 100 {
    >> "bantis" ¶
} _? x > 0 {
    >> "iksan" ¶
} _? x == 0 {
    >> "daor" ¶
} _ {
    >> "dōna" ¶
}
```

> `{ }` — **poQlu'**, mēre tebec.

---

## Match

```zymbol
// Match lentor
lentor2 = 85
patlh = ?? lentor2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match udra
perzys = "sētebagon"
kode = ?? perzys {
    "sētebagon" : "#FF0000"
    "vēttir"    : "#00FF00"
    _           : "#000000"
}

// Match sōnar (guards)
temp = -5
ind = ?? temp {
    _? temp < 0  : "jēdar"
    _? temp < 20 : "bōsa"
    _? temp < 35 : "sȳndroti"
    _            : "perzys"
}
>> ind ¶    // → jēdar

// Statement form
?? n {
    0        : { >> "daor" ¶ }
    _? n < 0 : { >> "dōna" ¶ }
    _        : { >> "iksan" ¶ }
}
```

---

## Kostagon

```zymbol
@ i:0..4  { >> i " " }        // range inclusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // with step:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

zaldrīzes = ["zaldrizoti", "dōnior", "perzys"]
@ f:zaldrīzes { >> f ¶ }      // for-each array

@ c:"valar" { >> c "-" }
>> ¶                          // → v-a-l-a-r-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> kostagon daur (continue)
    ? i > 7 { @! }             // @! ūbagon (break)
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

## Ānogar

```zymbol
tubagon(a, b) { <~ a + b }
>> tubagon(3, 4) ¶    // → 7

lentoraānogar(n) {
    ? n <= 1 { <~ 1 }
    <~ n * lentoraānogar(n - 1)
}
>> lentoraānogar(5) ¶    // → 120
```

Functions have **isolated scope** — they cannot read outer variables. Use output parameters `<~` to modify caller variables:

```zymbol
māzigon(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
māzigon(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> **Sȳz**: Brōzi ānogar `brōzi(params){ }` — daor mēre lentor.
> Bora nob — gaomagon: `x -> brōzi(x)`.

---

## Lambda bal Karyai

```zymbol
lanta = x -> x * 2
tubagon2 = (a, b) -> a + b
>> lanta(5) ¶     // → 10
>> tubagon2(3, 7) ¶ // → 10

// Block lambda
tymagon2 = x -> {
    ? x > 0 { <~ "iksan" }
    _? x < 0 { <~ "dōna" }
    <~ "daor"
}

// Closure — captures outer scope
factor = 3
tȳni = x -> x * factor
>> tȳni(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Glaeson

Glaeson **iksan** yn lanta — ānogar **mēre bantis** issa. Glaeson daor morghūlis — bantis iemnon same issa.

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

// Brōzi tuple arrays — use $^ with comparator lambda
db = [(brōzi: "Carla", ābre: 28), (brōzi: "Ana", ābre: 25), (brōzi: "Bob", ābre: 30)]
by_ābre  = db$^ (a, b -> a.ābre < b.ābre)
by_brōzi = db$^ (a, b -> a.brōzi > b.brōzi)
>> by_ābre[0].brōzi ¶     // → Ana
>> by_brōzi[0].brōzi ¶    // → Carla

// Issa tubagon (glaeson neP) — Direct element update (arrays only)
arr[1] = 99              // issa — assign
arr[0] += 5              // lanta tubagon: +=  -=  *=  /=  %=  ^= — compound

// Ānogar issa — Functional update — returns a new array; original unchanged
arr2 = arr[1]$~ 99
```

> Iemnon collection ta' — **naur glaeson** — issa: `arr = arr$+ 4`.
> Daor tanc: lanta issa.
> `$^+` / `$^-` sort **primitive arrays**. For tuple arrays use `$^` with a comparator lambda.

**Issa bantis (Value semantics)** — Glaeson issa naur kopio — daor morghūlis lanta:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b daor tubagon
```

```zymbol
// Nested arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Rughes

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
vala = (brōzi: "Ana", ābre: 25, ēngos: "Valyria")
(brōzi: n, ābre: a) = vala   // n="Ana"  a=25
```

---

## Tuple

Tuple **daor issa** — iemnon bantis morghūlis, ānogar **mēre bantis** glaeson. Daor morghūlis — bantis daor issa ao kostagon.

```zymbol
// Positional
point = (10, 20)
>> point[0] ¶    // → 10

data = (42, "rytsas", #1, 3.14)
>> data[2] ¶     // → #1

// Named
vala = (brōzi: "Alice", ābre: 25)
>> vala.brōzi ¶    // → Alice
>> vala[0] ¶       // → Alice  (index also works)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, brōzi: "Valyria")
>> p.pos.x ¶        // → 10
```

**Daor issa (Immutability)** — Ānogar daor issa — sōvēs gevives:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ sōvēs gevives: tuple daor issa
// t[0] += 5    // ❌ sōvēs
```

Ānogar bantis morghūlis haz `$~` (ānogar issa) — naur **bora** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original daor tubagon
>> t2 ¶    // → (10, 999, 30)

// Tuple brōzi — naur bora vala
vala = (brōzi: "Alice", ābre: 25)
vala_elder = (brōzi: vala.brōzi, ābre: 26)
>> vala.ābre ¶          // → 25
>> vala_elder.ābre ¶    // → 26
```

---

## Ānogar Bantis

> HOF — **mēre lambda** — daor lambda lentor.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

lanta2 = nums$> (x -> x * 2)                // map  → [2,4,6…20]
tȳni2  = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
naas3  = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Chain via intermediates
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named functions inside HOF — wrap in lambda
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Ābre Vali

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

## Sōvēs Sȳz

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "daor lentor" ¶
} :! {
    >> "sōvēs: " _err ¶    // _err holds the error message
} :> {
    >> "iemnon lúm" ¶
}
```

| Bantis      | Lo                             |
|-------------|--------------------------------|
| `##Div`     | Daor lentor                    |
| `##IO`      | Udra / valyria                 |
| `##Index`   | Lentor andë                    |
| `##Type`    | Bantis sōvēs                   |
| `##Parse`   | Gaomagon sōvēs                 |
| `##Network` | Tengwë sōvēs                   |
| `##_`       | Iemnon sōvēs                   |

---

## Valyria

```zymbol
// Udra: lib/calc.zy
# calc

#> { tubagon, get_PI }    // Nob MĒRE — definitions vo' qaSpa'

_PI := 3.14159
tubagon(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Udra: main.zy
<# ./lib/calc <= c    // Brōzi poQlu'

>> c::tubagon(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Export with a different public name
# mylib
#> { _internal_tubagon <= tubagon }

_internal_tubagon(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::tubagon(3, 4) ¶    // → 7
```

---

## Ābre Numrio

Zymbol māzis ābre numrio yn **Unicode numrio ēngos 69** — Devanagari, Arabi-India, Thai, Klingon pIqaD, Mathēmatika Beldis, LCD. Ēngos ābre `>>`; numrio binary.

### Ēngos māzis

Numrio `0` yn `9` yn `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII-o
```

### Ābre yn boolean

```zymbol
x = 42
>> x ¶          // → 42

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, numrio ābre
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Numrio asli kōdys

Numrio ēngos literal — rynis, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal ēngos

`#` + numrio `0` yn `1` bloc boolean:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (daōr) `0` (numrio zēro) ēngos.

---

## Ābre Bartosi

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

## Shell Syt

```zymbol
ēlie = <\ date +%Y-%m-%d \>    // captures stdout (includes trailing \n)
>> "Sīr: " ēlie

udra = "data.txt"
glaes = <\ cat {udra} \>       // interpolation in commands

nob = </"./subscript.zy"/>     // execute another Zymbol script, capture output
>> nob
```

> `><` captures CLI arguments as a string array (tree-walker only).

---

## Iemnon Ānogar: FizzBuzz

```zymbol
tymagon(lentor) {
    ? lentor % 15 == 0 { <~ "DracarysValar" }
    _? lentor % 3  == 0 { <~ "Dracarys" }
    _? lentor % 5  == 0 { <~ "Valar" }
    _ { <~ lentor }
}

@ i:1..20 { >> tymagon(i) ¶ }
```

---

## Ānogar Tirë

| Ānogar   | Moj                | Ānogar     | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | issa               | `$#`       | bantis                |
| `:=`     | morghūlis          | `$+`       | tubagon               |
| `>>`     | gevives            | `$+[i]`    | insert                |
| `<<`     | ūndegon            | `$-`       | teq (lentor)          |
| `¶`/`\`  | tebec tebec        | `$--`      | teq iemnon            |
| `?`      | lo (if)            | `$-[i]`    | teq Daq               |
| `_?`     | lo-daor (elif)     | `$-[i..j]` | teq Dara'             |
| `_`      | daor / iemnon      | `$?`       | issa                  |
| `??`     | match              | `$??`      | Hoch Daq tu'          |
| `@`      | kostagon           | `$[s..e]`  | mēre                  |
| `@!`     | ūbagon (break)     | `$>`       | map                   |
| `@>`     | kostagon daur      | `$\|`      | filter                |
| `->`     | Lambda             | `$<`       | reduce                |
| `arr[i] = val` | issa tubagon (update in-place) | `arr[i] +=` | lanta tubagon (compound update) |
| `arr[i]$~` | ānogar issa (functional update) | `$^+` | sort ascending      |
| `$^-`    | sort descending    | `$^`       | sort comparator       |
| `<~`     | tubagon            | `!?`       | ȳdrassagon (try)      |
| `\|>`    | Pipe               | `:!`       | karyai (catch)        |
| `#1`     | iksan              | `:>`       | iemnon (finally)      |
| `#0`     | daor               | `$!`       | sōvēs issa            |
| `<#`     | ūndegon (import)   | `$!!`      | sōvēs gevives         |
| `#`      | valyria brōzi      | `#>`       | nob (export)          |
| `::`     | valyria ānogar     | `.`        | field access          |
| `#\|..\|` | parse number      | `#?`       | type metadata         |
| `#.N\|..\|` | round           | `#!N\|..\|` | truncate            |
| `#,\|..\|` | comma format      | `#^\|..\|`  | scientific            |
| `#d0d9#` | ābre numrio ēngos | `#09#` | ASCII-o |
| `<\ ..\>` | shell exec        | `>\<`      | CLI args              |

## Versio Ēngos

### v0.0.3 — Unicode Numrio & LSP _(Abril 2026)_

- **Ābre** Unicode bloc 69 token `#d0d9#`
- **Ābre** Boolean literals — `#१` / `#०`, `#१` / `#٠`
- **Ābre** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ābre** VM opcode `SetNumeralMode` — tree-walker
- **Ābre** REPL numrio echo variable
- **Māzis** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Māzis** `c|..|` → `#,|..|` yn `e|..|` → `#^|..|`
- **Ābre** Export alias

### v0.0.2 _(24 Mar 2026)_

- **Ābre** `$` arrays yn strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ābre** Destructuring arrays, tuples
- **Ābre** Numrio daōr (`arr[-1]`)
- **Ābre** Instalar — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Ābre** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Ānogar. Bantis. Daor gaomagon.*

> **Nynir:** Dovaogēdy issa carna bal gevives AI (sȳz ānogar).
> Iemnon carna issa, mēpsa tȳni udra bal ānogar sōvēs.
> Kēlio dovaogēdy [Zymbol-Lang bantis](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
