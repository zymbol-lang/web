# Zymbol-Lang Lì'fya leNa'vi

**Zymbol-Lang** lu lì'fya a tsaheyl si. Ke lu tstxo a syaw — fìlì'fya lu Na'vi. Lu fpom fì'u, talun lu Na'vi lì'fya a fkeytok.

- Ke lu tstxo (`if`, `while`, `return` ke fkeytok — tì'efumì `?`, `@`, `<~`)
- Unicode sìltseo — tìran teri lì'fya a lefpom, emoji 👋
- Ke tsun fkol nìNa'vi — lì'fya lu fpom fì'u

---

## Tìng ulte Tìng Ne'

```zymbol
x = 10           // tìng (tsun munge)
PI := 3.14159    // tìng ne' (ke tsun munge — tìkin ce tìng)
tìfya = "Ana"
vorn = #1        // srane kem
👋 := "Oel ngati kameie"
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

## Tì'efumì Cìpx

| Tì'efumì     | Sìltseo           | Tì'ef `#?` | Tìkangkem                          |
|--------------|-------------------|------------|-------------------------------------|
| Numtseng     | `42`, `-7`        | `###`      | 64-bit sute                         |
| Numtseng Hin | `3.14`, `1.5e10`  | `##.`      | Sìltseo naur OK                     |
| Tìran        | `"oel ngati"`     | `##"`      | Lì'u: `"Sä'o {tìfya}"`             |
| Pxel         | `'A'`             | `##'`      | Mì Unicode pxel                     |
| Srane/Ke    | `#1`, `#0`        | `##?`      | Ke numtseng mì                      |
| Tskxe        | `[1, 2, 3]`       | `##]`      | Tì'efumì sìpawm nan                 |
| Tuple        | `(a, b)`          | `##)`      | Tìng                                |
| Tìfya Tuple  | `(x: 1, y: 2)`    | `##)`      | Tìfya sìpawm numtseng               |

---

## Pawm ulte Tìpawm

```zymbol
>> "Oel ngati kameie" ¶            // ¶ ulte \\ tsun tìpawm sìltseo
>> "a=" a " b=" b ¶                // sìpawm numtseng — tìng
>> (arr$#) ¶                       // tì'ef tìpawm numtseng poQlu'

<< tìfya                           // ke sìltseo — tìpawm tìng
<< "Fyape syaw fko ngar? " tìfya   // ulte sìltseo
```

> `¶` ulte `\\` — nan sìltseo sìltseo.

---

## Naaltsoos Bee Hane'

```zymbol
// Tìkan numtseng
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (numtseng tìkan)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (tìran)

// Sìpawm
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Tìkangkem
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Saad

```zymbol
// Tìran boq
tìfya = "Ana"
n = 25

msg = "Oel ngati kameie ", tìfya, "!"   // comma — tìng ulte :=
>> "Oel ngati kameie " tìfya " lu " n ¶  // juxtaposition — pawm >>
desc = "Oel ngati kameie {tìfya}, lu {n}" // lì'u — sìpawm tìng
```

```zymbol
s = "Oel ngati kameie"
len = s$#                  // 17
sub = s$[0..3]             // "Oel"  (ke tìran)
has = s$? "ngati"          // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["o":"O"]        // "OEl ngati kameie"
rep1 = s$~~["o":"O":1]     // "Oel ngati kameie"  (nì'aw pxeyä)
```

> `+` numtseng tìran. Tìrantseo — tìkin.

---

## Txo Ke

```zymbol
x = 7

? x > 0 { >> "srane" ¶ }

? x > 100 {
    >> "txantslusam" ¶
} _? x > 0 {
    >> "srane" ¶
} _? x == 0 {
    >> "ke" ¶
} _ {
    >> "txoa" ¶
}
```

> `{ }` — **poQlu'**, hin sìltseo.

---

## Match

```zymbol
// Match numtseng
numtseng2 = 85
patlh = ?? numtseng2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match tìran
tìyawn = "tawsìp"
kode = ?? tìyawn {
    "tawsìp"   : "#FF0000"
    "rìk"      : "#00FF00"
    _          : "#000000"
}

// Match sìpawm (guard)
wutso = -5
tìsraw = ?? wutso {
    _? wutso < 0  : "rum"
    _? wutso < 20 : "txon"
    _? wutso < 35 : "lawr"
    _             : "kxu"
}
>> tìsraw ¶    // → rum

// Tìkangkem tìran (block arms)
?? n {
    0       : { >> "ke" ¶ }
    _? n < 0: { >> "txoa" ¶ }
    _       : { >> "srane" ¶ }
}
```

---

## Fpxäkìm

```zymbol
@ i:0..4  { >> i " " }        // naná: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // step:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ke:    5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (txo txo)

tskxeyä = ["ioang", "tìsraw", "syulang"]
@ f:tskxeyä { >> f ¶ }

@ c:"eywa" { >> c "-" }
>> ¶                          // → e-y-w-a-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> fpxäkìm
    ? i > 7 { @! }             // @! tìhawnu
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Tìhawnu ke'u
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Tìhawnu tìfya (naná fpxäkìm)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Tìkan

```zymbol
tìkangkem(a, b) { <~ a + b }
>> tìkangkem(3, 4) ¶    // → 7

numtseng_tìkan(n) {
    ? n <= 1 { <~ 1 }
    <~ n * numtseng_tìkan(n - 1)
}
>> numtseng_tìkan(5) ¶    // → 120
```

Tìkan lu **isolated scope** — ke tsun tìng outer numtseng. Tìran `<~` munge:

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

> **Tìkangkem**: Tìfya tìkan ke first-class. Lì'u tìng — tìran: `x -> tìfya(x)`.

---

## Lambda ulte Karyai

```zymbol
tatìng = x -> x * 2
tìkangkem2 = (a, b) -> a + b
>> tatìng(5) ¶        // → 10
>> tìkangkem2(3, 7) ¶ // → 10

// Lambda tskxe
tìfya2 = x -> {
    ? x > 0 { <~ "srane" }
    _? x < 0 { <~ "txoa" }
    <~ "ke"
}

// Karyai — lambda tìng andë numtseng
tìkan_sì = 3
tìtxur2 = x -> x * tìkan_sì
>> tìtxur2(7) ¶    // → 21

// Tìkangkem tìran
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda numtseng: tskxeyä
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Tskxe

Tskxe lu **tìkangkem** sì ke — ałtso tì'ef lu **pxey numtseng** tìng. Tskxe ke lu ke tìkangkem — elementi tsun munge.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — tìpawm (0 numtseng)
arr[-1]         // 5 — ke numtseng (tìpawm)
arr$#           // 5 — sìpawm (poQlu' >> bił)

arr = arr$+ 6            // tìkangkem → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // tìkangkem mì numtseng 2
arr3 = arr$- 3           // tìhawnu pxey numtseng
arr4 = arr$-- 3          // tìhawnu ałtso numtseng
arr5 = arr$-[0]          // tìhawnu mì numtseng
arr6 = arr$-[1..3]       // tìhawnu tìran (ke tìran)

has = arr$? 3            // #1 — tìng
pos = arr$?? 3           // [2] — ałtso numtseng
sl = arr$[0..3]          // [1,2,3] — hin (ke tìran)
sl2 = arr$[0:3]          // [1,2,3] — count-based syntax

asc = arr$^+             // sorted ascending  (primitives)
desc = arr$^-            // sorted descending (primitives)

// Tuple tskxe — $^ ulte comparator lambda
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
by_age  = db$^ (a, b -> a.age < b.age)
by_name = db$^ (a, b -> a.name > b.name)
>> by_age[0].name ¶     // → Ana
>> by_name[0].name ¶    // → Carla

// Tìng mì (tskxe toi) — Direct element update (arrays only)
arr[1] = 99              // tìng — assign
arr[0] += 5              // tatìng tìng: +=  -=  *=  /=  %=  ^= — compound

// Tìkangkem tìran — Functional update — naur tskxe; original ke tìkangkem
arr2 = arr[1]$~ 99
```

> Ałtso tskxe operator **naur tskxe** tìkangkem. Tìng: `arr = arr$+ 4`.
> Ke tsaheyl: tatìng tìng.
> `$^+` / `$^-` — primitives (numtseng, tìran). Tuple tskxe — `$^` ulte lambda.

**Tìng numtseng (Value semantics)** — Tìng tskxe naur kopio rarna:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ke tìkangkem
```

```zymbol
// Nested tskxe
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Naasgó Áhóót'i'

```zymbol
// Tskxe
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ke tìng

// Positional tuple
point = (100, 200)
(px, py) = point             // px=100  py=200

// Named tuple
person = (name: "Ana", age: 25, city: "Eywa'eveng")
(name: n, age: a) = person   // n="Ana"  a=25
```

---

## Tuple

Tuple lu **ke tìkangkem** — ałtso sìpawm tìng, hut'unn **pxey numtseng** tskxe. Ke tskxe — elementi ke tsun munge ao tìkangkem.

```zymbol
// Tìng
point = (10, 20)
>> point[0] ¶    // → 10

tìran = (42, "oel ngati", #1, 3.14)
>> tìran[2] ¶     // → #1

// Tìfya
sute = (tìfya: "Alice", numtseng: 25)
>> sute.tìfya ¶      // → Alice
>> sute[0] ¶         // → Alice (numtseng lo'laH)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, label: "Eywa")
>> p.pos.x ¶        // → 10
```

**Ke tìkangkem (Immutability)** — Irga provo tìkangkem elementi tuple lu tìhawnu:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ tìhawnu: tuple ke tìkangkem
// t[0] += 5    // ❌ tìhawnu tìng
```

Fi naur tìran yusim `$~` (tìkangkem tìran) — naur **bora** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original ke tìkangkem
>> t2 ¶    // → (10, 999, 30)

// Tìfya tuple — naur bora sute
sute = (tìfya: "Alice", numtseng: 25)
sute2 = (tìfya: sute.tìfya, numtseng: 26)
>> sute.numtseng ¶     // → 25
>> sute2.numtseng ¶    // → 26
```

---

## Tìkan Txantslusam

> HOF — **hin lambda** — ke lambda numtseng.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tatìng2 = nums$> (x -> x * 2)             // map  → [2,4,6…20]
tìkangkem3 = nums$| (x -> x % 2 == 0)     // filter → [2,4,6,8,10]
tìpawm = nums$< (0, (acc, x) -> acc + x)  // reduce → 55

// Tatìng intermediates
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Tìfya tìkan — lambda mì
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Bee Ná'ádleehí

RHS lu **`_`** placeholder mì piped numtseng:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Tatìng
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Tìhawnu Txo

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ke numtseng" ¶
} :! {
    >> "tìhawnu: " _err ¶
} :> {
    >> "sìpawm lúm" ¶
}
```

| Tì'efumì    | Txo                            |
|-------------|--------------------------------|
| `##Div`     | Ke numtseng                    |
| `##IO`      | Tìran / vay                    |
| `##Index`   | Numtseng andë                  |
| `##Type`    | Tì'efumì tìhawnu               |
| `##Parse`   | Tìng tìhawnu                   |
| `##Network` | Tengwë tìhawnu                 |
| `##_`       | Sìpawm tìhawnu                 |

---

## Tìkangkem Na'vi

```zymbol
// Sìltseo: lib/calc.zy
# calc

#> { tìkangkem, get_PI }    // Nob MÌ

_PI := 3.14159
tìkangkem(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Sìltseo: main.zy
<# ./lib/calc <= c    // Tìfya poQlu'

>> c::tìkangkem(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

```zymbol
// Export tìfya pxey
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7
```

---

## Lì'fya Tìran

Zymbol tìran lì'fya **Unicode tìran alo 69** — Devanagari, Arabi-India, Thai, Klingon pIqaD, Mìftxavìl, LCD. Alo lì'fya `>>`; tìran binary.

### Alo sì'a

Tìran `0` sì `9` nìwotx `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII-e sì'a
```

### Tìran sì boolean

```zymbol
x = 42
>> x ¶          // → 42

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, tìran sì'a
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Tìran asli kode

Tìran alo literal — range, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal alo

`#` + tìran `0` pxan `1` bloc boolean:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (ke) `0` (tìran zéro) alo.

---

## Naaltsoos Ná'ádleehí

```zymbol
// Tìkangkem numtseng → akihtâson
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ke tìhawnu)

// Round / truncate
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncate)

// Numtseng tìran
fmt = #,|1234567|  // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Base literals
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Base tìkangkem
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Bee Nahat'á

```zymbol
date = <\ date +%Y-%m-%d \>     // tìkangkem stdout (tìran \n)
>> "Tsatseng: " date

file = "data.txt"
content = <\ cat {file} \>      // lì'u mì tìkan

output = </"./subscript.zy"/>   // tìkangkem Na'vi script, tìpawm output
>> output
```

> `><` tìpawm CLI arguments sìpawm tskxe (tree-walker piko).

---

## Sìpawm Tìkangkem: FizzBuzz

```zymbol
tìkan(tìfya) {
    ? tìfya % 15 == 0 { <~ "EywaToruk" }
    _? tìfya % 3  == 0 { <~ "Eywa" }
    _? tìfya % 5  == 0 { <~ "Toruk" }
    _ { <~ tìfya }
}

@ i:1..20 { >> tìkan(i) ¶ }
```

---

## Tì'ef Tirë

| Tì'ef    | Moj                | Tì'ef      | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | tìng               | `$#`       | sìpawm                |
| `:=`     | tìng ne'           | `$+`       | tìkangkem             |
| `>>`     | pawm               | `$+[i]`    | tìkangkem mì numtseng |
| `<<`     | tìpawm             | `$-`       | tìhawnu (pxey)        |
| `¶`/`\\` | sìltseo sìltseo    | `$--`      | tìhawnu ałtso         |
| `?`      | txo (if)           | `$-[i]`    | tìhawnu mì numtseng   |
| `_?`     | txo-ke (elif)      | `$-[i..j]` | tìhawnu tìran         |
| `_`      | ke / sìpawm        | `$?`       | tìng                  |
| `??`     | match              | `$??`      | ałtso numtseng        |
| `@`      | fpxäkìm            | `$[s..e]`  | hin                   |
| `@!`     | tìhawnu (break)    | `$>`       | map                   |
| `@>`     | fpxäkìm daur       | `$\|`      | filter                |
| `->`     | Lambda             | `$<`       | reduce                |
| `arr[i] = val` | tìng mì (update in-place) | `arr[i] +=` | tatìng tìng (compound update) |
| `arr[i]$~` | tìkangkem tìran (functional update) | `$^+` | sorted ascending |
| `$^-`    | sorted descending  | `$^`       | sorted lambda         |
| `<~`     | tìkangkem          | `!?`       | tìtxur (try)          |
| `\|>`    | Pipe               | `:!`       | karyai (catch)        |
| `#1`     | srane              | `:>`       | sìpawm (finally)      |
| `#0`     | ke                 | `$!`       | tìhawnu tìng          |
| `<#`     | tìpawm             | `$!!`      | tìhawnu pawm          |
| `#`      | tìkangkem tìfya    | `#>`       | nob                   |
| `::`     | tìkangkem tìkan    | `.`        | field access          |
| `#\|..\|` | tìkangkem numtseng | `#?`      | tì'efumì              |
| `#.N\|..\|` | round           | `#!N\|..\|` | truncate           |
| `#,\|..\|` | comma format      | `#^\|..\|`  | scientific            |
| `#d0d9#` | tìran alo sì'a | `#09#` | ASCII-e sì'a |
| `<\ ..\>` | shell exec        | `>\<`      | CLI args              |

## Versión Tìran

### v0.0.3 — Unicode Tìran & LSP _(Abril 2026)_

- **Sì'a** Unicode bloc 69 token `#d0d9#`
- **Sì'a** Boolean literals — `#१` / `#०`, `#١` / `#٠`
- **Sì'a** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Sì'a** VM opcode `SetNumeralMode` — tree-walker
- **Sì'a** REPL tìran echo variable
- **Lu** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Lu** `c|..|` → `#,|..|` sì `e|..|` → `#^|..|`
- **Sì'a** Export alias

### v0.0.2 _(24 Mar 2026)_

- **Sì'a** `$` arrays sì strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Sì'a** Destructuring arrays, tuples
- **Sì'a** Tìran ke (`arr[-1]`)
- **Sì'a** Instalar — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Sì'a** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Lì'fya. Sìpawm. Ke tìng.*

> **Tìkangkem:** Fì'u carna ulte quenta AI (tìran tìkan).
> Sìpawm carna ná, mal nì'ul tìfya ulte sìltseo tìhawnu.
> Tìkangkem lì'fya [Zymbol-Lang tìkangkem](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
