# Sarch Bain Zymbol-Lang

**Zymbol-Lang** na peth bauglo glamren. Ú-beditha i adar — ilach na peth. Na idh erin ilch lammen.

- Ú-adara i ader (`if`, `while`, `return` ú-choir — peth nain `?`, `@`, `<~`)
- Unicode naur — eneth erin ilch lam, ilyë emoji 👋
- Lam-úgarth — i glaer idh erin ilch lammen

---

## Boe a Dîn

```zymbol
x = 10              // boe (gaur)
PI := 3.14159       // dîn (ú-gaur — naeg ce gaur)
eneth = "Ana"
vorn = #1           // eithel ná
👋 := "Mae govannen"
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

## Goth Cîw

| Goth         | Sarch             | Peth `#?` | Notë                                |
|--------------|-------------------|-----------|-------------------------------------|
| Norn         | `42`, `-7`        | `###`     | 64-bit sinwa                        |
| Norn Hin     | `3.14`, `1.5e10`  | `##.`     | Sarch Naur OK                       |
| Peth         | `"mae govannen"`  | `##"`     | Lúm: `"Suilad {eneth}"`             |
| Tengwa       | `'A'`             | `##'`     | Min Unicode tengwa                  |
| Eithel/Ú    | `#1`, `#0`        | `##?`     | Ú-norn min ar ú-norn                |
| Rhaw         | `[1, 2, 3]`       | `##]`     | Ilach goth nan                      |
| Tuple        | `(a, b)`          | `##)`     | Anwa                                |
| Eneth Tuple  | `(x: 1, y: 2)`    | `##)`     | Eneth ilyë norn                     |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Pedo a Lasto

```zymbol
>> "Mae govannen" ¶             // ¶ ar \\ tirë lúm autë
>> "a=" a " b=" b ¶             // rimba norn — tanc
>> (arr$#) ¶                    // peth norn poQlu'

<< eneth                        // ú-peth — lasto boe
<< "Eneth lín? " eneth          // peth
```

> `¶` ar `\\` — nan lúm autë.

---

## Penim

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

## Lam Periain

```zymbol
// Neldë sarch — ilach tanc
eneth = "Ana"
n = 42

peth2 = "Suilad ", eneth, "!"            // comma — in assignments
>> "Suilad " eneth " le norn " n ¶       // juxtaposition — in >>
quenta = "Suilad {eneth}, le norn {n}"  // interpolation — anywhere
```

```zymbol
s = "Mae govannen"
len = s$#                  // 14
sub = s$[0..3]             // "Mae"  (end exclusive)
has = s$? "govannen"       // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "MAe govAnnen"
rep1 = s$~~["a":"A":1]     // "MAe govannen"  (first N only)
```

> **Notë**: `+` nornen. Pethassen — naeg.

---

## Ce Ú-Ce

```zymbol
x = 7

? x > 0 { >> "maer" ¶ }

? x > 100 {
    >> "alta" ¶
} _? x > 0 {
    >> "maer" ¶
} _? x == 0 {
    >> "ú" ¶
} _ {
    >> "dôl" ¶
}
```

> `{ }` — **poQlu'**, min peth.

---

## Match

```zymbol
// Match norn
norn2 = 85
patlh = ?? norn2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match peth
gwath = "caran"
tengwa2 = ?? gwath {
    "caran"  : "#FF0000"
    "calen"  : "#00FF00"
    _        : "#000000"
}

// Match nuith (guards)
ring = -5
ind = ?? ring {
    _? ring < 0  : "helch"
    _? ring < 20 : "ring"
    _? ring < 35 : "laer"
    _            : "naur"
}
>> ind ¶    // → helch

// Statement form
?? n {
    0        : { >> "ú" ¶ }
    _? n < 0 : { >> "dôl" ¶ }
    _        : { >> "maer" ¶ }
}
```

---

## Trevad

```zymbol
@ i:0..4  { >> i " " }        // range inclusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // with step:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

yúlë = ["galadh", "loth", "nen"]
@ f:yúlë { >> f ¶ }           // for-each array

@ c:"ithil" { >> c "-" }
>> ¶                          // → i-t-h-i-l-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> trevad daur (continue)
    ? i > 7 { @! }             // @! câr (break)
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
anno(a, b) { <~ a + b }
>> anno(3, 4) ¶    // → 7

nornmaded(n) {
    ? n <= 1 { <~ 1 }
    <~ n * nornmaded(n - 1)
}
>> nornmaded(5) ¶    // → 120
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

> **Naur**: Eneth maded `eneth(params){ }` — lá min norn.
> Hríva — yomë: `x -> eneth(x)`.

---

## Lambda a Nurta

```zymbol
tattanc = x -> x * 2
anno2 = (a, b) -> a + b
>> tattanc(5) ¶    // → 10
>> anno2(3, 7) ¶    // → 10

// Block lambda
gerio2 = x -> {
    ? x > 0 { <~ "maer" }
    _? x < 0 { <~ "dôl" }
    <~ "ú"
}

// Closure — captures outer scope
tancal = 3
neldë = x -> x * tancal
>> neldë(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Rhaw

Rhaw **cared** a ú — ilach tama lu **er dîn** eneth.

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

// Eneth tuple arrays — use $^ with comparator lambda
db = [(eneth: "Carla", vin: 28), (eneth: "Ana", vin: 25), (eneth: "Bob", vin: 30)]
by_vin  = db$^ (a, b -> a.vin < b.vin)
by_eneth = db$^ (a, b -> a.eneth > b.eneth)
>> by_vin[0].eneth ¶     // → Ana
>> by_eneth[0].eneth ¶   // → Carla

arr[1] = 99              // boe norn — update in-place
arr[1] += 10             // tattanc boe — compound update
arr2 = arr[1]$~ 99       // maded boe — naur rhaw norn
```

> Hoch collection ta' — **naur rhaw** — boe: `arr = arr$+ 4`.
> Ú-tanc: tattanc boe.
> `$^+` / `$^-` sort **primitive arrays**. For tuple arrays use `$^` with a comparator lambda.

**Dîn peth (value semantics):** Boe rhaw naur kopio — ú-tattanc eneth.

```zymbol
a = [1, 2, 3]
b = a            // naur rhaw — ú-tattanc boe
b[0] = 99
>> a ¶           // → [1, 2, 3]  (ú-cared)
>> b ¶           // → [99, 2, 3]
```

```zymbol
// Nested arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Nedh Periain

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
Ellon = (eneth: "Ana", vin: 25, tham: "Imladris")
(eneth: n, vin: a) = Ellon   // n="Ana"  a=25
```

---

## Tuple

Tuple **ú-cared** — ilach rhaw boe, pol tama **úmë dîn** eneth.

```zymbol
// Positional
point = (10, 20)
>> point[0] ¶    // → 10

data = (42, "eneth", #1, 3.14)
>> data[2] ¶     // → #1

// Named
Ellon = (eneth: "Alice", vin: 25)
>> Ellon.eneth ¶    // → Alice
>> Ellon[0] ¶       // → Alice  (index also works)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, eneth: "Imladris")
>> p.pos.x ¶        // → 10
```

**Ú-cared (Immutability):** Tuple ú-pol cared — naeg aen tirith e-gohenam.

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ naeg aen tirith: tuple ú-cared
// t[0] += 5    // ❌ naeg ai
```

**Maded boe ($~):** Naur tuple ú-cared — boe eneth.

```zymbol
Ellon = (eneth: "Alice", vin: 25)
Ellon2 = (eneth: Ellon.eneth, vin: 26)  // naur tuple, vin boe
>> Ellon2.vin ¶    // → 26
>> Ellon.vin ¶     // → 25  (ú-cared)
```

---

## Maded Alta

> HOF — **só lambda** — lá lambda norn.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tattanc2 = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pair     = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ilach2   = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Chain via intermediates
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named functions inside HOF — wrap in lambda
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Pêd Periain

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

## Naeg Nurta

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ú norn" ¶
} :! {
    >> "naeg: " _err ¶    // _err holds the error message
} :> {
    >> "ilach lúm" ¶
}
```

| Goth        | Lúm                            |
|-------------|--------------------------------|
| `##Div`     | Ú norn                         |
| `##IO`      | Sarch / aran                   |
| `##Index`   | Norn andë                      |
| `##Type`    | Goth naeg                      |
| `##Parse`   | Tanc naeg                      |
| `##Network` | Tengwë naeg                    |
| `##_`       | Ilach naeg                     |

---

## Tanwesta

```zymbol
// Sarch: lib/calc.zy
# calc

#> { anno, get_PI }    // Nob MIN — definitions vo' qaSpa'

_PI := 3.14159
anno(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Sarch: main.zy
<# ./lib/calc <= c    // Eneth poQlu'

>> c::anno(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Export with a different public name
# mylib
#> { _internal_anno <= anno }

_internal_anno(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::anno(3, 4) ¶    // → 7
```

---

## Nœ Enni

Zymbol pan nœ **Unicode nœ gwaith 69** — Devanagari, Arabi-India, Thai, Klingon pIqaD, Mathmeg, LCD. Gwaith nœ `>>`; nœ binary.

### Gwaith achae

Nœ `0` a `9` in `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII-nna
```

### Nœ a boolean

```zymbol
x = 42
>> x ¶          // → 42

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, nœ gwaith
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Nœ asli côd

Nœ gwaith literal — rhandir, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal gwaith

`#` + nœ `0` hain `1` bloc boolean:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (ú) `0` (nœ sîdh) gwaith.

---

## Pedhrim Penim

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

## Shell Periaid

```zymbol
aur = <\ date +%Y-%m-%d \>     // captures stdout (includes trailing \n)
>> "Aur: " aur

sarch = "data.txt"
tetlh = <\ cat {sarch} \>      // interpolation in commands

nob = </"./subscript.zy"/>     // execute another Zymbol script, capture output
>> nob
```

> `><` captures CLI arguments as a string array (tree-walker only).

---

## Naná Sarch: FizzBuzz

```zymbol
gerio(norn) {
    ? norn % 15 == 0 { <~ "GaladDûn" }
    _? norn % 3  == 0 { <~ "Galad" }
    _? norn % 5  == 0 { <~ "Dûn" }
    _ { <~ norn }
}

@ i:1..20 { >> gerio(i) ¶ }
```

---

## Peth Tirë

| Peth     | Moj                | Peth       | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | boe                | `$#`       | rimba                 |
| `:=`     | dîn                | `$+`       | anno                  |
| `>>`     | pedo               | `$+[i]`    | insert                |
| `<<`     | lasto              | `$-`       | telë (norn)           |
| `¶`/`\`  | lúm autë           | `$--`      | telë ilach            |
| `?`      | ce (if)            | `$-[i]`    | telë Daq              |
| `_?`     | ar-ce (elif)       | `$-[i..j]` | telë Dara'            |
| `_`      | ú-ce / ilach       | `$?`       | boe                   |
| `??`     | match              | `$??`      | Hoch Daq tu'          |
| `@`      | trevad             | `$[s..e]`  | hin                   |
| `@!`     | câr (break)        | `$>`       | map                   |
| `@>`     | trevad daur        | `$\|`      | filter                |
| `->`     | Lambda             | `$<`       | reduce                |
| `arr[i] = val` | boe norn (update in-place) | `arr[i] +=` | tattanc boe (compound update) |
| `arr[i]$~` | maded boe (functional update) | `$^+` | sort ascending       |
| `$^-`    | sort descending    | `$^`       | sort comparator       |
| `<~`     | anno               | `!?`       | provo (try)           |
| `\|>`    | Pipe               | `:!`       | nurta (catch)         |
| `#1`     | eithel             | `:>`       | ilach (finally)       |
| `#0`     | ú                  | `$!`       | naeg ná               |
| `<#`     | lasto (import)     | `$!!`      | naeg nob              |
| `#`      | tanwesta eneth     | `#>`       | nob (export)          |
| `::`     | tanwesta maded     | `.`        | field access          |
| `#\|..\|` | parse number      | `#?`       | type metadata         |
| `#.N\|..\|` | round           | `#!N\|..\|` | truncate            |
| `#,\|..\|` | comma format      | `#^\|..\|`  | scientific            |
| `#d0d9#` | nœ gwaith achae | `#09#` | ASCII-nna |
| `<\ ..\>` | shell exec        | `>\<`      | CLI args              |

## Versio Nœ

### v0.0.3 — Unicode Nœ & LSP _(Abril 2026)_

- **Pan** Unicode bloc 69 token `#d0d9#`
- **Pan** Boolean literals — `#१` / `#०`, `#१` / `#٠`
- **Pan** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Pan** VM opcode `SetNumeralMode` — tree-walker
- **Pan** REPL nœ echo variable
- **Achae** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Achae** `c|..|` → `#,|..|` a `e|..|` → `#^|..|`
- **Pan** Export alias

### v0.0.2 _(24 Mar 2026)_

- **Pan** `$` arrays a strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pan** Destructuring arrays, tuples
- **Pan** Nœ ú (`arr[-1]`)
- **Pan** Instalar — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Pan** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Peth. Ilach. Ú-gaur.*

> **Notë:** Sarch hen carna ar quenta AI (tancalë maded).
> Ilach carna ná, mal neldë peth ar sarch naeg erin.
> Tancalëa sarch [Zymbol-Lang tengwesta](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
