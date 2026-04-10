# tlhIngan Hol Zymbol-Lang paq

**Zymbol-Lang** 'oH porghQeD Hol'e' Dalo'bogh. mu'mey lo'be' — Hoch 'oH ta''e'. Hoch Hol lo'laH.

- mu'mey lo'be' (`if`, `while`, `return` tu'be'lu' — ta' neH `?`, `@`, `<~`)
- Unicode Hoch — Hoch Hol pong Dalo'laH, qoj emoji 👋
- Hol-qar — Hoch Hol, wa' mu'tlhegh law'

---

## ghaj je mab

```zymbol
x = 10              // ghaj (choHlaH)
PI := 3.14159       // mab (choHlaHbe' — Qagh choHchugh)
pong = "Ana"
Dun = #1            // 'Iv teH
👋 := "nuqneH"
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

## Segh Data

| Segh         | mu'tlhegh         | ta' `#?` | QInmey                             |
|--------------|-------------------|----------|------------------------------------|
| mI' naQ      | `42`, `-7`        | `###`    | 64-bit signed                      |
| mI' tIn      | `3.14`, `1.5e10`  | `##.`    | Scientific notation OK             |
| mu'mey       | `"nuqneH"`        | `##"`    | Hap: `"nuqneH {pong}"`             |
| mu'           | `'A'`             | `##'`    | wa' Unicode mu'                    |
| teH/ngeb     | `#1`, `#0`        | `##?`    | mI' wa' pagh je DAHO'be'           |
| ghom         | `[1, 2, 3]`       | `##]`    | Hoch Segh rap                      |
| tuple        | `(a, b)`          | `##)`    | mI' Dara'                          |
| pong tuple   | `(x: 1, y: 2)`    | `##)`    | pong qoj mI' Dalo'laH              |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## jatlh je Qoy

```zymbol
>> "nuqneH" ¶                   // ¶ qoj \\ chu' ghoS nob
>> "a=" a " b=" b ¶             // law' De' — Dara'
>> (arr$#) ¶                    // bIng ta' mI'mey poQlu'

<< pong                         // mu' Hutlh — nob yIgho'
<< "nuq 'oH ponglIj'e'? " pong  // mu' ghaj
```

> `¶` qoj `\\` — wa' rur chu' ghoS.

---

## Muvmeywi'

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

## mu'mey

```zymbol
// Three concatenation forms
pong = "Ana"
n = 42

QIn = "nuqneH ", pong, "!"            // comma — in assignments
>> "nuqneH " pong " bIHoS " n ¶       // juxtaposition — in >>
Qorwagh = "nuqneH {pong}, bIHoS {n}" // interpolation — anywhere
```

```zymbol
s = "nuqneH qo'"
len = s$#                  // 10
sub = s$[0..6]             // "nuqneH"  (end exclusive)
has = s$? "qo'"            // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["q":"Q"]        // "nuqneH Qo'"
rep1 = s$~~["q":"Q":1]     // "nuQneH qo'"  (first N only)
```

> `+` mI' neH. mu'mey — lut.

---

## ghobe' pagh HIja'

```zymbol
x = 7

? x > 0 { >> "HoS" ¶ }

? x > 100 {
    >> "tIn law'" ¶
} _? x > 0 {
    >> "HoS" ¶
} _? x == 0 {
    >> "pagh" ¶
} _ {
    >> "Dor" ¶
}
```

> Hoch `{ }` **poQlu'**, wa' mu'tlhegh je.

---

## Match

```zymbol
// Match mI' Dara'
mI'2 = 85
patlh2 = ?? mI'2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh2 ¶    // → B

// Match mu'mey
rItlh = "Doq"
HaSta = ?? rItlh {
    "Doq"  : "#FF0000"
    "SuD"  : "#00FF00"
    _      : "#000000"
}

// Match nuH (guards)
SuD = -5
Dotlh = ?? SuD {
    _? SuD < 0  : "chuch"
    _? SuD < 20 : "bIr"
    _? SuD < 35 : "tlhegh"
    _            : "tuj"
}
>> Dotlh ¶    // → chuch

// Statement form
?? n {
    0        : { >> "pagh" ¶ }
    _? n < 0 : { >> "Dor" ¶ }
    _        : { >> "HoS" ¶ }
}
```

---

## ngeb

```zymbol
@ i:0..4  { >> i " " }        // range inclusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // with step:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

naH = ["tI", "moQ", "'USqa'"]
@ f:naH { >> f ¶ }            // for-each array

@ c:"Qapla'" { >> c "-" }
>> ¶                          // → Q-a-p-l-a-'-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> HaD (continue)
    ? i > 7 { @! }             // @! pItlh (break)
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

## Qu'

```zymbol
boq(a, b) { <~ a + b }
>> boq(3, 4) ¶    // → 7

mI'ghaH(n) {
    ? n <= 1 { <~ 1 }
    <~ n * mI'ghaH(n - 1)
}
>> mI'ghaH(5) ¶    // → 120
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

> **Qov**: pong Qu' — wa' De' 'oHbe'. nob vIneH — yIjom: `x -> pong(x)`.

---

## Lambda je qorDu'

```zymbol
cha' = x -> x * 2
boq2 = (a, b) -> a + b
>> cha'(5) ¶    // → 10
>> boq2(3, 7) ¶  // → 10

// Block lambda
buv = x -> {
    ? x > 0 { <~ "HoS" }
    _? x < 0 { <~ "Dor" }
    <~ "pagh"
}

// Closure — captures outer scope
Dop = 3
wej = x -> x * Dop
>> wej(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## ghom

ghom **Hap** je HIja' — Hoch De' lu **wa' tIq** pong.

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

// pong tuple arrays — use $^ with comparator lambda
db = [(pong: "Carla", DIS: 28), (pong: "Ana", DIS: 25), (pong: "Bob", DIS: 30)]
by_DIS  = db$^ (a, b -> a.DIS < b.DIS)
by_pong = db$^ (a, b -> a.pong > b.pong)
>> by_DIS[0].pong ¶     // → Ana
>> by_pong[0].pong ¶    // → Carla

arr[1] = 99              // ghaj Hap — update in-place
arr[1] += 10             // boq Hap — compound update
arr2 = arr[1]$~ 99       // ta' ghaj — chu' ghom nob
```

> Hoch collection ta' — **chu' ghom** — ghaH: `arr = arr$+ 4`.
> boqHa'be': cha' ghaj Dalo'.
> `$^+` / `$^-` — primitive arrays neH. tuple arrays — `$^` lambda Dalo'.

**ghaj De' (value semantics):** ghaj ghom chu' copy — boqHa' pong mab.

```zymbol
a = [1, 2, 3]
b = a            // chu' copy — boqHa' ghaj Hap
b[0] = 99
>> a ¶           // → [1, 2, 3]  (boqHa' Hap)
>> b ¶           // → [99, 2, 3]
```

```zymbol
// Nested arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## naQHom

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
SuvwI' = (pong: "Ana", DIS: 25, qach: "Qo'noS")
(pong: n, DIS: a) = SuvwI'   // n="Ana"  a=25
```

---

## Tuple

Tuple **boqHa' Hap** — Hoch ghom ghaj, pol tama **Hoch De'** pong.

```zymbol
// Positional
point = (10, 20)
>> point[0] ¶    // → 10

data = (42, "pong", #1, 3.14)
>> data[2] ¶     // → #1

// Named
SuvwI' = (pong: "Alice", DIS: 25)
>> SuvwI'.pong ¶    // → Alice
>> SuvwI'[0] ¶      // → Alice  (index also works)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, pong: "tlhIngan")
>> p.pos.x ¶        // → 10
```

**boqHa' Hap (Immutability):** Tuple Hap boqHa' — Qagh.

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ Qagh poSmoHbe'lu'bogh: tuple boqHa' Hap
// t[0] += 5    // ❌ Qagh ai
```

**ta' ghaj ($~):** chu' tuple boqHa' Hap — ghaj De'.

```zymbol
SuvwI' = (pong: "Alice", DIS: 25)
SuvwI'2 = (pong: SuvwI'.pong, DIS: 26)  // chu' tuple, DIS ghaj
>> SuvwI'2.DIS ¶    // → 26
>> SuvwI'.DIS ¶     // → 25  (boqHa' Hap)
```

---

## Qu' ghaj

> HOF ta' — **pa' lambda** poQlu' — lambda De' Hutlh.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

cha'2  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
mI'rap = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
Hoch2  = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Chain via intermediates
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named functions inside HOF — wrap in lambda
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## bIQ jatlh muvwI'

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

## Qagh DIj

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pagh HoS Dor" ¶
} :! {
    >> "Qagh: " _err ¶    // _err holds the error message
} :> {
    >> "reH qaStaH" ¶
}
```

| Segh        | qaStaHvIS                      |
|-------------|--------------------------------|
| `##Div`     | pagh HoS Dor                   |
| `##IO`      | De' / HoD                      |
| `##Index`   | mI' Dor                        |
| `##Type`    | Segh Qagh                      |
| `##Parse`   | moj Qagh                       |
| `##Network` | Hol Qagh                       |
| `##_`       | Hoch Qagh                      |

---

## HoD

```zymbol
// De': lib/calc.zy
# calc

#> { boq, get_PI }    // nob QACH — definitions vo' qaSpa'

_PI := 3.14159
boq(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// De': main.zy
<# ./lib/calc <= c    // pong poQlu'

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

## mI' Hap

Zymbol mI' lujatlhlaH **Unicode mI' paq 69** — Devanagari, Arabi-India, Thai, Klingon pIqaD, HISlaH-mI', LCD. Hap mI' `>>`; mI' binary.

### paq chu'

mI' `0` je `9` `#…#`-Daq:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII-Daq
```

### lujatlh je boolean

```zymbol
x = 42
>> x ¶          // → 42

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, mI' Hap
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### mI' asli HolQeD

mI' paq literal — mIv, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal paq

`#` + mI' `0` pagh `1` bloc boolean:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (ghobe') `0` (mI' pagh) paq.

---

## De' muvmeywi'

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

## Shell lucherghlu'

```zymbol
jaj = <\ date +%Y-%m-%d \>     // captures stdout (includes trailing \n)
>> "DaHjaj: " jaj

De' = "data.txt"
tetlh = <\ cat {De'} \>        // interpolation in commands

nob = </"./subscript.zy"/>     // execute another Zymbol script, capture output
>> nob
```

> `><` captures CLI arguments as a string array (tree-walker only).

---

## wa' Example: FizzBuzz

```zymbol
buv(mI') {
    ? mI' % 15 == 0 { <~ "QaplaHoH" }
    _? mI' % 3  == 0 { <~ "Qapla" }
    _? mI' % 5  == 0 { <~ "HoH" }
    _ { <~ mI' }
}

@ i:1..20 { >> buv(i) ¶ }
```

---

## mu' ghom

| ta'     | moj               | ta'        | moj                   |
|---------|-------------------|------------|-----------------------|
| `=`     | ghaj              | `$#`       | mI'                   |
| `:=`    | mab               | `$+`       | boq                   |
| `>>`    | jatlh             | `$+[i]`    | chelwI' (insert)      |
| `<<`    | Qoy               | `$-`       | teq (mI')             |
| `¶`/`\` | chu' ghoS        | `$--`      | Hoch teq              |
| `?`     | HIja'             | `$-[i]`    | teq mI' Daq           |
| `_?`    | ghobe'taH         | `$-[i..j]` | teq Dara'             |
| `_`     | ghobe' / Hoch     | `$?`       | ghaj                  |
| `??`    | match             | `$??`      | Hoch Daq tu'          |
| `@`     | tagh              | `$[s..e]`  | mach                  |
| `@!`    | pItlh (break)     | `$>`       | map                   |
| `@>`    | HaD (continue)    | `$\|`      | filter                |
| `->`    | Lambda            | `$<`       | reduce                |
| `arr[i] = val` | ghaj Hap (update in-place) | `arr[i] +=` | boq Hap (compound update) |
| `arr[i]$~` | ta' ghaj (functional update) | `$^+` | sort ascending       |
| `$^-`   | sort descending   | `$^`       | sort comparator       |
| `<~`    | nob               | `!?`       | tIv (try)             |
| `\|>`   | Pipe              | `:!`       | Hap (catch)           |
| `#1`    | teH               | `:>`       | reH (finally)         |
| `#0`    | ngeb              | `$!`       | Qagh 'oH              |
| `<#`    | Hap (import)      | `$!!`      | Qagh nob              |
| `#`     | HoD chergh        | `#>`       | nob (export)          |
| `::`    | HoD lo'           | `.`        | De' tu'               |
| `#\|..\|` | parse number   | `#?`       | type metadata         |
| `#.N\|..\|` | round        | `#!N\|..\|` | truncate            |
| `#,\|..\|` | comma format   | `#^\|..\|`  | scientific            |
| `#d0d9#` | mI' Hap chu' | `#09#` | ASCII-Daq |
| `<\ ..\>` | shell exec     | `>\<`      | CLI args              |

## paq tI'ang

### v0.0.3 — Unicode mI' & LSP _(Abril 2026)_

- **chu'** Unicode bloc 69 token `#d0d9#`
- **chu'** Boolean literals — `#१` / `#०`, `#١` / `#٠`
- **chu'** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **chu'** VM opcode `SetNumeralMode` — tree-walker
- **chu'** REPL mI' echo variable
- **Hap** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Hap** `c|..|` → `#,|..|` je `e|..|` → `#^|..|`
- **chu'** Export alias

### v0.0.2 _(24 Mar 2026)_

- **chu'** `$` arrays je strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **chu'** Destructuring arrays, tuples
- **chu'** mI' ghobe' (`arr[-1]`)
- **chu'** Instalar — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **chu'** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — ta'. Hoch. choHlaHbe'.*

> **QIn:** De'vam 'oH porghQeD vay' (AI) chenmoHta' je mughta'.
> Hoch DIv ta'lu', 'ach 'op mu' qoj mu'tlhegh Qagh tu'laH.
> chaq De' [Zymbol-Lang specifiko](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
