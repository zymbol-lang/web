# Nynir Zymbol-Lang Mando'a

**Zymbol-Lang** cuyir hut'unn ara'novor be programir. N'eparavu cuun ade — ibac cuyir hut'unn. Cuyir ibac nayc'aran gar tion'ad.

- N'eparavu cuun ade (`if`, `while`, `return` n'eparavut — hut'unn tebec `?`, `@`, `<~`)
- Unicode naas — gar tion'ad ra'kure Mando'a, gar nynir emoji 👋
- Naas'ika — ibac cuyir ibac meg'haat gar

---

## Mhi'ade bal Mhi'ade ne'

```zymbol
x = 10           // mhi'ade (ganar'ika)
PI := 3.14159    // mhi'ade ne' (n'ganar — nayc ibac)
gar = "Ana"
elek_ = #1       // elek darasuum
👋 := "Su'cuy"
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

## Gai'tayli'yc

| Gai'tayl        | Naas              | Hut'unn `#?` | Nynir                               |
|-----------------|-------------------|--------------|-------------------------------------|
| Gal naas        | `42`, `-7`        | `###`        | 64-bit                              |
| Gal mhi'        | `3.14`, `1.5e10`  | `##.`        | Naas'ika OK                         |
| Hut'unn tebec   | `"Su'cuy"`        | `##"`        | Bora: `"Su'cuy {gar}"`              |
| Tebec solus     | `'A'`             | `##'`        | Solus Unicode tebec                 |
| Elek/Nayc       | `#1`, `#0`        | `##?`        | N'ibac gal solus bal n'gal          |
| Aliit           | `[1, 2, 3]`       | `##]`        | Gaa'tayli'yc ibac meg'haat          |
| Tuple           | `(a, b)`          | `##)`        | Tracyn                              |
| Tuple gar       | `(x: 1, y: 2)`    | `##)`        | Naas'ika gar bal tracyn             |

```zymbol
// Gai'tayl naas — bora (gai'tayl, gal, tracyn)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Hibira bal Cuyir

```zymbol
>> "Su'cuy" ¶                   // ¶ bal \\ borarir tebec tebec
>> "a=" a " b=" b ¶             // gaa'tayli'yc mhi'ade — tracyn
>> (arr$#) ¶                    // naas hut'unn poQlu' poki

<< gar                          // n'tebec — cuyir gai'tayl
<< "Tion'ad gar? " gar          // bal tebec
```

> `¶` bal `\\` — ibac meg'haat tebec tebec.

---

## Operatore

```zymbol
// Borarir gal — hut'unn mhi'ade
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (gal tracyn)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (gal naas)

// Tion tracyn
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Tracyn'yc
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Mando'ade Tome

```zymbol
// Ehn gai'tayl — ibac meg'haat tracyn
gar = "Ana"
n = 42

tebec2 = "Su'cuy ", gar, "!"            // kaysh — borarir = bal :=
>> "Su'cuy " gar " gar gal " n ¶        // tracyn — hibira >>
naas2 = "Su'cuy {gar}, gar gal {n}"     // bora — ibac tracyn
```

```zymbol
s = "Su'cuy Vode"
len = s$#                  // 11
sub = s$[0..5]             // "Su'cu"  (nayc tracyn)
has = s$? "Vode"           // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["o":"O"]        // "Su'cuy VOde"
rep1 = s$~~["o":"O":1]     // "Su'cuy VOde" (tracyn solus)
```

> `+` gal tebec. Hut'unn tebec — ibac liser.

---

## Tion'ad

```zymbol
x = 7

? x > 0 { >> "jate" ¶ }

? x > 100 {
    >> "jate naas" ¶
} _? x > 0 {
    >> "jate" ¶
} _? x == 0 {
    >> "pag" ¶
} _ {
    >> "nayc" ¶
}
```

> Poki `{ }` — **poQlu'**, ibac solus tebec tebec.

---

## Match

```zymbol
// Match gal tracyn
gal2 = 85
patlh2 = ?? gal2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh2 ¶    // → B

// Match hut'unn
rItlh = "laamyc"
kode = ?? rItlh {
    "laamyc"  : "#FF0000"
    "yaim"    : "#00FF00"
    _         : "#000000"
}

// Match naas (ibac tion)
temp = -5
Dotlh = ?? temp {
    _? temp < 0  : "kelir"
    _? temp < 20 : "bic"
    _? temp < 35 : "warm"
    _            : "warm naas"
}
>> Dotlh ¶    // → kelir

// Match hut'unn poki
?? n {
    0       : { >> "pag" ¶ }
    _? n < 0: { >> "nayc" ¶ }
    _       : { >> "jate" ¶ }
}
```

---

## Meh

```zymbol
@ i:0..4  { >> i " " }        // naas tracyn:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // bal meh:       1 3 5 7 9
@ i:5..0:1 { >> i " " }       // darasuum bic:  5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (akaanir)

kir = ["mandokar", "verd'goten", "riduur"]
@ f:kir { >> f ¶ }            // ibac mhi'ade aliit

@ c:"Vode" { >> c "-" }
>> ¶                          // → V-o-d-e-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> meh darasuum
    ? i > 7 { @! }             // @! troch'n
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Meh darasuum
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Meh gar (darasuum troch'n)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Ara'novor

```zymbol
borarir(a, b) { <~ a + b }
>> borarir(3, 4) ¶    // → 7

kaysh(n) {
    ? n <= 1 { <~ 1 }
    <~ n * kaysh(n - 1)
}
>> kaysh(5) ¶    // → 120
```

Ara'novor cuyir **naas ibac** — n'cuyi mhi'ade naas. Hut'unn `<~` mhi'ade tracyn:

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

> Ara'novor n'ibac gai'tayl solus. Bora nob — borarir: `x -> gar(x)`.

---

## Lambda bal Karyai

```zymbol
t'ad = x -> x * 2
ibac2 = (a, b) -> a + b
>> t'ad(5) ¶    // → 10
>> ibac2(3, 7) ¶  // → 10

// Lambda poki
jate = x -> {
    ? x > 0 { <~ "jate" }
    _? x < 0 { <~ "nayc" }
    <~ "pag"
}

// Karyai — lambda cuyir mhi'ade naas
factor = 3
ehn2 = x -> x * factor
>> ehn2(7) ¶    // → 21

// Ara'novor mhi'ade
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda gai'tayl: aliit
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Trattok'o

Trattok'o **borarir** bal nayc — ibac hut'unn **pa' gai'tayl** tebec. Trattok'o n'ibac mhi'ade ne' — gai'tayl borarir ibac.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — gai'tayl (0 tebec)
arr[-1]         // 5 — gal nayc (darasuum)
arr$#           // 5 — gal (poQlu' (arr$#) hibira)

arr = arr$+ 6            // borarir → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // tracyn gal 2
arr3 = arr$- 3           // teq tracyn solus
arr4 = arr$-- 3          // teq ibac
arr5 = arr$-[0]          // teq gal tracyn
arr6 = arr$-[1..3]       // teq naas (nayc tracyn)

has = arr$? 3            // #1 — elek
pos = arr$?? 3           // [2] — ibac tracyn
sl = arr$[0..3]          // [1,2,3] — mhi' (nayc tracyn)
sl2 = arr$[0:3]          // [1,2,3] — tracyn gal

asc = arr$^+             // gai'tayl jate (naas solus)
desc = arr$^-            // gai'tayl nayc (naas solus)

// Tuple aliit — hut'unn $^ bal lambda borarir
db = [(gar: "Carla", cuir: 28), (gar: "Ana", cuir: 25), (gar: "Bob", cuir: 30)]
by_cuir  = db$^ (a, b -> a.cuir < b.cuir)
by_gar   = db$^ (a, b -> a.gar > b.gar)
>> by_cuir[0].gar ¶     // → Ana
>> by_gar[0].gar ¶      // → Carla

// Borarir pa' (trattok'o tebec) — Direct element update (arrays only)
arr[1] = 99              // gai'tayl — assign
arr[0] += 5              // ibac borarir: +=  -=  *=  /=  %=  ^= — compound

// Borarir vaii — Functional update — bora trattok'o; original nayc borarir
arr2 = arr[1]$~ 99
```

> Ibac hut'unn borarir **trattok'o vaii**. Borarir: `arr = arr$+ 4`.
> N'gai'tayl: t'ad ara'novor mhi'ade.
> `$^+` / `$^-` gai'tayl **naas solus**. Tuple aliit — hut'unn `$^` bal lambda.

**Gai'tayl tebec (Value semantics)** — Mhi'ade trattok'o bora kopio nayc mirci:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nayc borarir
```

```zymbol
// Trattok'o naasad
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Tome Ruug'la

```zymbol
// Aliit
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ nayc tracyn

// Tuple tracyn
point = (100, 200)
(px, py) = point             // px=100  py=200

// Tuple gar
person = (gar: "Ana", cuir: 25, city: "Mandalore")
(gar: n, cuir: a) = person   // n="Ana"  a=25
```

---

## Tuple

Tuple **nayc borarir** — ibac gal mhi'ade, hut'unn **pa' gai'tayl** tebec. Nayc trattok'o — gai'tayl nayc borarir ibac.

```zymbol
// Tracyn
point = (10, 20)
>> point[0] ¶    // → 10

kaysh = (42, "Su'cuy", #1, 3.14)
>> kaysh[2] ¶     // → #1

// Gar
vod = (gar: "Alice", cuir: 25)
>> vod.gar ¶    // → Alice
>> vod[0] ¶     // → Alice  (tracyn lo'laH)

// Naasad
pos = (x: 10, y: 20)
p = (pos: pos, label: "Manda")
>> p.pos.x ¶        // → 10
```

**Nayc borarir (Immutability)** — Ibac borarir gai'tayl tuple nayc cuyir:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ nayc cuyir: tuple nayc borarir
// t[0] += 5    // ❌ nayc cuyir
```

Borarir vaii haz `$~` (borarir gai'tayl) — bora **naur** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original nayc borarir
>> t2 ¶    // → (10, 999, 30)

// Tuple gar — bora naur vod
vod = (gar: "Alice", cuir: 25)
vod2 = (gar: vod.gar, cuir: 26)
>> vod.cuir ¶    // → 25
>> vod2.cuir ¶   // → 26
```

---

## Ara'novor Alor

> HOF — **lambda pa'** poQlu' — n'lambda gai'tayl.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

t'ad2 = nums$> (x -> x * 2)                // map  → [2,4,6…20]
cuir2 = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
naas3 = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Tracyn mhi'ade
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ara'novor naasad — bora lambda
borarir2(x) { <~ x * 2 }
r = nums$> (x -> borarir2(x))    // ✅
```

---

## Operatore Gar

Ibac tracyn poQlu' `_` meg'haat tracyn:

```zymbol
t'ad = x -> x * 2
ibac2 = (a, b) -> a + b
inc = x -> x + 1

5 |> t'ad(_)        // → 10
10 |> ibac2(_, 5)   // → 15
5 |> ibac2(2, _)    // → 7

// Darasuum
r = 5 |> t'ad(_) |> inc(_) |> t'ad(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Buir Haat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pag'yc nayc" ¶
} :! {
    >> "nayc: " _err ¶    // _err cuyir tebec nayc
} :> {
    >> "darasuum" ¶
}
```

| Gai'tayl    | Tion'ad                        |
|-------------|--------------------------------|
| `##Div`     | Pag'yc nayc                    |
| `##IO`      | Tebec / naas                   |
| `##Index`   | Tracyn nayc                    |
| `##Type`    | Gai'tayl nayc                  |
| `##Parse`   | Nynir nayc                     |
| `##Network` | Naas nayc                      |
| `##_`       | Ibac nayc                      |

---

## Aliit'verde

```zymbol
// lib/calc.zy
# calc

#> { borarir, get_PI }    // Nob SOLUS

_PI := 3.14159
borarir(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // Gar poQlu'

>> c::borarir(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Nob gar naas
# mylib
#> { _ibac_borarir <= ibac }

_ibac_borarir(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::ibac(3, 4) ¶    // → 7
```

---

## Naasad Mirci

Zymbol runi naasad **Unicode naasad'ika 69** — Devanagari, Arabi-India, Thai, Klingon pIqaD, Mirdalore, LCD. Mirci haat `>>`; naasad binary.

### Ika gaa'tayl

Naasad `0` mir `9` gaa `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII-e
```

### Haat mir boolean

```zymbol
x = 42
>> x ¶          // → 42

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, naasad runi
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Naasad asli kode

Naasad ika literal — range, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal ika

`#` + naasad `0` mir `1` bloc boolean:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (ne) `0` (naasad nul) ika.

---

## Operatore Naasad

```zymbol
// Bora gal naas tebec
v1 = #|"42"|      // → 42  (Gal naas)
v2 = #|"3.14"|    // → 3.14  (Gal mhi')
v3 = #|"abc"|     // → "abc"  (nayc nynir)

// Tracyn / teq
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (teq)

// Gai'tayl gal
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Naas gal
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Bora naas
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Naasad

```zymbol
date = <\ date +%Y-%m-%d \>     // cuyir stdout (bal tebec tebec)
>> "Tion'ad: " date

tebec = "data.txt"
content = <\ cat {tebec} \>     // bora hut'unn

output = </"./sub.zy"/>         // hibira zy nynir, cuyir
>> output
```

> `><` cuyir CLI gai'tayl ibac tebec (nynir solus).

---

## Ara'novor Mhi'ade: FizzBuzz

```zymbol
jate(gal) {
    ? gal % 15 == 0 { <~ "MandoVode" }
    _? gal % 3  == 0 { <~ "Mando" }
    _? gal % 5  == 0 { <~ "Vode" }
    _ { <~ gal }
}

@ i:1..20 { >> jate(i) ¶ }
```

---

## Nynir

| Hut'unn  | Moj                | Hut'unn      | Moj                   |
|----------|--------------------|--------------|------------------------|
| `=`      | mhi'ade            | `$#`         | gal                   |
| `:=`     | mhi'ade ne'        | `$+`         | borarir               |
| `>>`     | hibira             | `$+[i]`      | tracyn gal tracyn     |
| `<<`     | cuyir              | `$-`         | teq tracyn solus      |
| `¶`/`\\` | tebec tebec        | `$--`        | teq ibac              |
| `?`      | tion (if)          | `$-[i]`      | teq gal tracyn        |
| `_?`     | tion'yc (elif)     | `$-[i..j]`   | teq naas              |
| `_`      | nayc / ibac        | `$?`         | elek                  |
| `??`     | match              | `$??`        | ibac tracyn           |
| `@`      | meh                | `$[s..e]`    | mhi'                  |
| `@!`     | troch'n (break)    | `$>`         | map                   |
| `@>`     | meh darasuum       | `$\|`        | filter                |
| `->`     | Lambda             | `$<`         | reduce                |
| `arr[i] = val` | borarir pa' (update in-place) | `arr[i] +=` | ibac borarir (compound update) |
| `arr[i]$~` | borarir vaii (functional update) | `$^+` | jate (naas solus) |
| `$^-`    | nayc (naas solus)  | `$^`         | borarir lambda        |
| `<~`     | bora               | `!?`         | troch'n (try)         |
| `\|>`    | Pipe               | `:!`         | karyai (catch)        |
| `#1`     | elek               | `:>`         | darasuum (finally)    |
| `#0`     | nayc               | `$!`         | nayc cuyir            |
| `<#`     | cuyir              | `$!!`        | nayc hibira           |
| `#`      | aliit nynir        | `#>`         | nob                   |
| `::`     | aliit lo'          | `.`          | gai'tayl tracyn       |
| `#\|..\|`| bora gal           | `#?`         | gai'tayl naas         |
| `#.N\|..\|` | tracyn         | `#!N\|..\|`  | teq                   |
| `#,\|..\|`| gai'tayl comma     | `#^\|..\|`    | naas'ika              |
| `#d0d9#` | naasad mirci runi | `#09#` | ASCII-e |
| `<\ ..\>`| shell hibira       | `>\<`        | CLI gai'tayl          |

## Versione Haat

### v0.0.3 — Unicode Naasad & LSP _(Abril 2026)_

- **Runi** Unicode bloc 69 token `#d0d9#`
- **Runi** Boolean literals — `#१` / `#०`, `#١` / `#٠`
- **Runi** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Runi** VM opcode `SetNumeralMode` — tree-walker
- **Runi** REPL naasad echo variable
- **Mirci** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Mirci** `c|..|` → `#,|..|` mir `e|..|` → `#^|..|`
- **Runi** Export alias

### v0.0.2 _(24 Mar 2026)_

- **Runi** `$` arrays mir strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Runi** Destructuring arrays, tuples
- **Runi** Naasad ne (`arr[-1]`)
- **Runi** Instalar — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Runi** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Hut'unn. Ibac naas. Darasuum.*

> **Nynir:** Tebec ni cuyir bal hibira AI (naas'ika ara'novor).
> Ibac gaa'tayli'yc cuyir troch'n naas, tebec bal borarir li ken nayc.
> Alor nynir cuyir [Zymbol-Lang nynir](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
