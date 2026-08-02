# Zymbol-Lang Ome Wẽra

**Zymbol-Lang** embera ome wẽra kira pari. Jã dachi nezarã — kira pari dachi nezarã. Embera ome wẽra dachi nezara.

- Jã nezara (`if`, `while`, `return` jã dachi — kira pari `?`, `@`, `<~`)
- Unicode wẽra — dachi ome wẽra kira pari 👋
- Ome jãni — kira pari dachi ome wẽra nezara

---

## Kira mîna Jãni Pari

```zymbol
kira = 10           // kira (wẽra)
DACHI := 3.14159    // jãni pari (jã wẽra — kira jã)
nabi = "Ana"
ome = #1            // wẽra pari
👋 := "Nabi, Embera!"
```

```zymbol
kira = 10
kira += 5    // 15
kira -= 3    // 12
kira *= 2    // 24
kira /= 3    // 8
kira %= 3    // 2
kira ^= 2    // 4
kira++       // 5
kira--       // 4
```

---

## Ome Kira

| Kira Ome        | Wẽra Pari           | Symbol `#?`  | Dachi Nezara                        |
|-----------------|---------------------|--------------|-------------------------------------|
| Jãni Kira       | `42`, `-7`          | `###`        | 64-Bit wẽra pari                    |
| Wẽra Kira       | `3.14`, `1.5e10`    | `##.`        | Nezara ome wẽra                     |
| Ome Kira        | `"nabi"`            | `##"`        | Wẽra: `"Nabi {nabi}"`               |
| Kira Ome        | `'A'`               | `##'`        | Ome kira wẽra                       |
| Pari Ome        | `#1`, `#0`          | `##?`        | Jã kira 1 mîna 0                    |
| Kira Pari       | `[1, 2, 3]`         | `##]`        | Ome kira nezara                     |
| Tuple           | `(a, b)`            | `##)`        | Kira pari                           |
| Nabi Tuple      | `(x: 1, y: 2)`      | `##)`        | Kira nabi mîna jãni                 |

```zymbol
// Kira ome — dachi (kira, jãni, wẽra)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Ewandó mîna Peda

```zymbol
>> "Nabi" ¶                      // ¶ mîna \\ ome wẽra
>> "a=" kira " b=" peda ¶        // ome kira wẽra jãni
>> (dachi$#) ¶                   // kira pari ewandó wẽra

<< nabi                          // jã ome — kira peda
<< "Nabi ome? " nabi             // ome peda
```

> `¶` mîna `\\` ome wẽra kira pari.

---

## ⚙️🔢

```zymbol
// Jãni kira — wẽra mîna
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (jãni kira)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (kira wẽra)

// Pari ome
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Wẽra pari
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## 💬🔤

```zymbol
// Nezara wẽra pari — dachi kira ome
nabi = "Ana"
kira = 42

ome = "Nabi ", nabi, "!"               // ome — kira = mîna :=
>> "Nabi " nabi " kira " kira ¶        // wẽra — ewandó >>
peda = "Nabi {nabi}, kira {kira}"      // wẽra ome — dachi nezara
```

```zymbol
s = "Nabi Embera"
len = s$#                  // 11
sub = s$[0..4]             // "Nabi"  (jã wẽra)
has = s$? "Embera"         // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "NAbi EmberA"
rep1 = s$~~["a":"A":1]     // "NAbi Embera"
```

> **Dachi**: `+` jã kira wẽra pari. Ome kira wẽra nezara.

---

## Jaida

```zymbol
kira = 7

? kira > 0 { >> "wẽra pari" ¶ }

? kira > 100 {
    >> "dachi" ¶
} _? kira > 0 {
    >> "wẽra pari" ¶
} _? kira == 0 {
    >> "jã" ¶
} _ {
    >> "jã wẽra" ¶
}
```

> Kira pari `{ }` **dachi nezara**, ome kira wẽra.

---

## Match

```zymbol
// Match kira ome
ome = 85
nezara = ?? ome {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nezara ¶    // → B

// Match ome kira
nabi = "babará"
kira = ?? nabi {
    "babará"  : "#FF0000"
    "bupurú"  : "#00FF00"
    _         : "#000000"
}

// Match kira wẽra
peda = -5
dachi = ?? peda {
    _? peda < 0  : "wẽra"
    _? peda < 20 : "kira"
    _? peda < 35 : "nabi"
    _            : "dachi"
}
>> dachi ¶    // → wẽra

// Match pari (kira wẽra)
?? n {
    0       : { >> "jã" ¶ }
    _? n < 0: { >> "jã wẽra" ¶ }
    _       : { >> "wẽra pari" ¶ }
}
```

---

## Naweda

```zymbol
@ i:0..4  { >> i " " }        // kira wẽra:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kira ome:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kira jã:    5 4 3 2 1 0

kira = 1
@ kira <= 64 { kira *= 2 }
>> kira ¶                     // → 128  (wẽra ome)

nabi = ["Embera", "Dachi", "Wẽra"]
@ ome:nabi { >> ome ¶ }       // kira dachi

@ c:"nabi" { >> c "-" }
>> ¶                          // → n-a-b-i-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> wẽra
    ? i > 7 { @! }             // @! dachi
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Naweda jãni
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Naweda nabi (dachi mîna)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Dachi Nezara

```zymbol
ewandó(a, b) { <~ a + b }
>> ewandó(3, 4) ¶    // → 7

dachi(kira) {
    ? kira <= 1 { <~ 1 }
    <~ kira * dachi(kira - 1)
}
>> dachi(5) ¶    // → 120
```

Dachi nezara **jã kira ome wẽra** — jã wẽra pari kira. Hut'unn `<~` kira wẽra:

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

> **Dachi**: Ewandó nabi `ome(nembi){ }` jã kira wẽra pari.
> Kira pari wẽra: `x -> ome(x)`.

---

## Lambda mîna Kira

```zymbol
peda = x -> x * 2
dachi = (a, b) -> a + b
>> peda(5) ¶     // → 10
>> dachi(3, 7) ¶ // → 10

// Lambda kira ome
nezara = x -> {
    ? x > 0 { <~ "wẽra pari" }
    _? x < 0 { <~ "jã wẽra" }
    <~ "jã"
}

// Kira — lambda ome wẽra pari
kira = 3
dachi2 = x -> x * kira
>> dachi2(7) ¶    // → 21

// Ewandó kira ome
make_adder(kira) { <~ x -> x + kira }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda kira: dachi wẽra
ome = [x -> x+1, x -> x*2, x -> x*x]
>> ome[2](5) ¶    // → 25
```

---

## Nembira

Arrays are **mutable** and hold elements of the **same type**. _(Nembira **wẽra pari** dachi — kira pari ome wẽra nezara.)_

```zymbol
dachi = [1, 2, 3, 4, 5]

dachi[0]          // 1 — kira (0 ome wẽra)
dachi[-1]         // 5 — jãni kira (pari)
dachi$#           // 5 — ome wẽra (kira wẽra >> dachi)

dachi = dachi$+ 6            // ewandó → [1,2,3,4,5,6]
dachi2 = dachi$+[2] 99       // kira 2
dachi3 = dachi$- 3           // kira jãni wẽra
dachi4 = dachi$-- 3          // kira ibac
dachi5 = dachi$-[0]          // kira ome
dachi6 = dachi$-[1..3]       // kira pari (jã wẽra)

has = dachi$? 3              // #1 — wẽra ome
pos = dachi$?? 3             // [2] — ibac ome
sl = dachi$[0..3]            // [1,2,3] — pari (jã wẽra)
sl2 = dachi$[0:3]            // [1,2,3] — jãni kira

asc = dachi$^+               // kira jate (naas solus)
desc = dachi$^-              // kira nayc (naas solus)

// Nabi Tuple — hut'unn $^ mîna lambda
db = [(nabi: "Carla", kira: 28), (nabi: "Ana", kira: 25), (nabi: "Bob", kira: 30)]
by_kira = db$^ (a, b -> a.kira < b.kira)
by_nabi = db$^ (a, b -> a.nabi > b.nabi)
>> by_kira[0].nabi ¶     // → Ana
>> by_nabi[0].nabi ¶     // → Carla

// Kira pari wẽra (nembira dachi kama)
dachi[1] = 99              // kira wẽra (jünüin)
dachi[0] += 5              // wẽra ome: +=  -=  *=  /=  %=  ^=

// Kira ome wẽra — bora nembira dachi; nayc mana tikiti
dachi2 = dachi[1]$~ 99
```

> `$+`, `$-`, `$[..]` **kira wẽra** dachi — wẽra: `dachi = dachi$+ 4`.
> Jã kira: peda wẽra kira ome.
> `$^+` / `$^-` kira **naas solus**. Nabi Tuple — hut'unn `$^` mîna lambda.

**Kira ome wẽra** — nembira dachi bora wẽra ome kira pari (kira ibac):

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b jã wẽra
```

```zymbol
// Nembira naasad
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## 🔓📦

```zymbol
// Nembira
dachi = [10, 20, 30, 40, 50]
[a, b, c] = dachi              // a=10  b=20  c=30
[first, *rest] = dachi         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ jã nezara

// Tuple kira
point = (100, 200)
(px, py) = point               // px=100  py=200

// Nabi Tuple
person = (nabi: "Ana", kira: 25, city: "Babará")
(nabi: n, kira: a) = person    // n="Ana"  a=25
```

---

## Tuple

Tuples are **immutable** ordered containers that can hold values of **different types**. Unlike arrays, elements cannot be changed after creation. _(Tuple **jã wẽra pari** ome kira dachi nezara — kira pari wẽra ome. Nembira dachi kama, kira jã wẽra pari lurasipxata qhipana.)_

```zymbol
// Kira pari
point = (10, 20)
>> point[0] ¶    // → 10

kira_pë = (42, "kë embera", #1, 3.14)
>> kira_pë[2] ¶     // → #1

// Nabi
nabi = (ome: "Alice", kira: 25)
>> nabi.ome ¶     // → Alice
>> nabi[0] ¶      // → Alice  (kira ome)

// Naasad
pos = (x: 10, y: 20)
p = (pos: pos, label: "embera")
>> p.pos.x ¶        // → 10
```

**Jã wẽra pari** — kira pari dachi wẽra ome kira pari nowë kami:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ kira pari: tuple jã wẽra pari
// t[0] += 5    // ❌ kira pari wẽra ome
```

Kira ome wẽra pari `$~` apaykachaña (wẽra kira) — **bora** tuple dachi:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← nayc mana tikiti
>> t2 ¶    // → (10, 999, 30)

// Nabi tuple — bora kira wẽra
nabi = (ome: "Alice", kira: 25)
nabi2 = (ome: nabi.ome, kira: 26)
>> nabi.kira ¶    // → 25
>> nabi2.kira ¶   // → 26
```

---

## Wẽra Kira

> Kira ome wẽra **lambda inline** — jã lambda kira wẽra.

```zymbol
kira = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

peda = kira$> (x -> x * 2)                // map → [2,4,6…20]
dachi = kira$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
nezara = kira$< (0, (ome, x) -> ome + x)  // reduce → 55

// Kira wẽra
step1 = kira$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Dachi naasad — peda lambda
ewandó2(x) { <~ x * 2 }
r = kira$> (x -> ewandó2(x))    // ✅
```

---

## 🔗➡️

Ibac kira wẽra `_` dachi nezara:

```zymbol
peda = x -> x * 2
dachi = (a, b) -> a + b
inc = x -> x + 1

5 |> peda(_)        // → 10
10 |> dachi(_, 5)   // → 15
5 |> dachi(2, _)    // → 7

// Naasad
r = 5 |> peda(_) |> inc(_) |> peda(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Jãni

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Kira jã wẽra" ¶
} :! {
    >> "ome kira: " _err ¶    // _err kira ome wẽra
} :> {
    >> "dachi wẽra" ¶
}
```

| Kira Ome    | Dachi Nezara                  |
|-------------|-------------------------------|
| `##Div`     | Kira jã wẽra                  |
| `##IO`      | Kira / ome wẽra               |
| `##Index`   | Kira ome pari                 |
| `##Type`    | Kira ome wẽra                 |
| `##Parse`   | Kira wẽra pari                |
| `##Network` | Kira ome nezara               |
| `##_`       | Dachi kira (catch-all)        |

---

## Ome Wẽra

```zymbol
// lib/dachi.zy
# dachi

#> { ewandó, get_DACHI }    // Kira wẽra DACHI nezara

_DACHI := 3.14159
ewandó(a, b) { <~ a + b }
get_DACHI() { <~ _DACHI }
```

```zymbol
// main.zy
<# ./lib/dachi <= d    // Kira wẽra dachi

>> d::ewandó(5, 3) ¶   // → 8
pari = d::get_DACHI()
>> pari ¶              // → 3.14159
```

```zymbol
// Nabi kira ome
# mylib
#> { _ibac_ewandó <= ibac }

_ibac_ewandó(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::ibac(3, 4) ¶    // → 7
```

---

## Dachi Jakhu Pari

Zymbol jakhunaka uñjaña danañatawa **Unicode jakhu aru 69** — Devanagari, Arabi-India, Thai, Klingon pIqaD, Matemática Sasa, LCD ukanakaw. Kira aktivo `>>`-naka pari; jakhu binario.

### Ome wẽra kira

Jakhu `0` mîna `9` bëdë `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII dachi
```

### Peda mîna boolean

```zymbol
x = 42
>> x ¶          // → 42

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, jakhu yatiqawi
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Jakhu dachi kira

Jakhu aru literal — range, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal

`#` + `0` mîna `1` bloc boolean:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (kami) `0` (dachi zero) uñjasiwa.

---

## 📊⚙️

```zymbol
// Kira jãni ome wẽra
v1 = #|"42"|      // → 42  (Jãni Kira)
v2 = #|"3.14"|    // → 3.14  (Wẽra Kira)
v3 = #|"abc"|     // → "abc"  (jã wẽra)

// Pari / kira
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kira)

// Ome kira
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Naas kira
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Wẽra naas
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## 🐚🔌

```zymbol
date = <\ date +%Y-%m-%d \>     // kira stdout (mîna ome wẽra)
>> "Kira: " date

tebec = "data.txt"
content = <\ cat {tebec} \>     // wẽra ome kira

output = </"./sub.zy"/>         // ewandó zy kira, peda
>> output
```

> `><` kira CLI jãni ome wẽra pari (jãni solus).

---

## Dachi Kira: FizzBuzz

```zymbol
ewandó(nembi) {
    ? nembi % 15 == 0 { <~ "BabaráBupurú" }
    _? nembi % 3  == 0 { <~ "Babará" }
    _? nembi % 5  == 0 { <~ "Bupurú" }
    _ { <~ nembi }
}

@ i:1..20 { >> ewandó(i) ¶ }
```

---

## Kira Pari

| Symbol  | Kira Ome           | Symbol       | Kira Ome              |
|---------|--------------------|--------------|------------------------|
| `=`     | Kira               | `$#`         | Ome wẽra              |
| `:=`    | Jãni Pari          | `$+`         | Ewandó                |
| `>>`    | Dachi              | `$+[i]`      | Kira ome              |
| `<<`    | Peda               | `$-`         | Kira jãni             |
| `¶`/`\\`| Ome wẽra           | `$--`        | Kira ibac             |
| `?`     | Jaida (if)         | `$-[i]`      | Kira ome              |
| `_?`    | Ome jaida (elif)   | `$-[i..j]`   | Kira pari             |
| `_`     | Ome / kira pari    | `$?`         | Wẽra ome              |
| `??`    | match              | `$??`        | Ibac ome              |
| `@`     | Naweda             | `$[s..e]`    | Kira pari             |
| `@!`    | Dachi (break)      | `$>`         | map                   |
| `@>`    | Wẽra (continue)    | `$\|`        | filter                |
| `->`    | Lambda             | `$<`         | reduce                |
| `dachi[i] = val` | kira wẽra (nembira kama) | `dachi[i] += val` | wẽra ome kira |
| `dachi[i]$~` | wẽra kira ome (bora copia) | `$^+` | Kira jate (naas solus) |
| `$^-`   | Kira nayc (naas solus) | `$^`     | Kira lambda           |
| `<~`    | Nezara (return)    | `!?`         | Jãni (try)            |
| `\|>`   | Pipe               | `:!`         | Kira (catch)          |
| `#1`    | Wẽra (#1)          | `:>`         | Dachi wẽra (finally)  |
| `#0`    | Jã (#0)            | `$!`         | Kira wẽra             |
| `<#`    | Peda kira          | `$!!`        | Kira pari             |
| `#`     | Ome wẽra dachi     | `#>`         | Dachi kira            |
| `::`    | Ome kira           | `.`          | Kira ome              |
| `#\|..\|`| Kira jãni        | `#?`         | Kira ome naas         |
| `#.N\|..\|`| Pari           | `#!N\|..\|`  | Kira                  |
| `#,\|..\|`| Ome kira comma   | `#^\|..\|`    | Naas'ika              |
| `#d0d9#` | jakhu kira amtaña | `#09#` | ASCII dachi |
| `<\ ..\>`| Shell ewandó     | `>\<`        | CLI kira              |

## Dachi Versión

### v0.0.3 — Unicode Jakhu & LSP _(Abril 2026)_

- **Ida'ame** Unicode bloc 69 token `#d0d9#`
- **Ida'ame** Boolean literals — `#१` / `#०`, `#١` / `#٠`
- **Ida'ame** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ida'ame** VM opcode `SetNumeralMode` — tree-walker
- **Ida'ame** REPL jakhu echo variable
- **Jijjiirame** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Jijjiirame** `c|..|` → `#,|..|` mîna `e|..|` → `#^|..|`
- **Ida'ame** Export alias

### v0.0.2 _(24 Mar 2026)_

- **Ida'ame** `$` arrays mîna strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ida'ame** Destructuring arrays, tuples
- **Ida'ame** Index kami (`arr[-1]`)
- **Ida'ame** Instalar — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Ida'ame** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Kira. Dachi. Jãni Pari.*

> **Dachi Nezara:** Ome wẽra kira pari dachi nezara ome kira wẽra. Kira ome wẽra pari dachi nezara kira ome. Kira pari wẽra: [Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
