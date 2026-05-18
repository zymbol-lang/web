# Liklik Manuwal bilong Zymbol-Lang

**Zymbol-Lang** em i wanpela tokples bilong ol sain. Em i no gat ol biknem wod — olgeta samting em sain. Em i wok sem long olgeta tokples bilong ol man.

- Biknem wod i no gat (`if`, `while`, `return` i no stap — sain `?`, `@`, `<~` tasol)
- Unicode olgeta — nem long olgeta tokples o emoji 👋
- Tokples-fri — kod i sem long olgeta tokples

---

## Ol Nem na Ol Nem I No Senis

```zymbol
x = 10              // nem i senis (ken senis)
PI := 3.14159       // nem i no senis (no ken senis — bagarap sapos senis)
nem = "Ana"
stret = #1          // tru
👋 := "Gude"
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

## Ol Kain Samting

| Kain          | Eksampol          | Sain `#?` | Nots                                |
|---------------|-------------------|-----------|-------------------------------------|
| Namba         | `42`, `-7`        | `###`     | 64-bit namba                        |
| Desimal       | `3.14`, `1.5e10`  | `##.`     | Siantifik notesen OK                |
| Strin         | `"gude"`          | `##"`     | Putim insait: `"Gude {nem}"`        |
| Wan Sain      | `'A'`             | `##'`     | Wan Unicode sain                    |
| Tru/Los       | `#1`, `#0`        | `##?`     | I no sem olsem namba 1 na 0         |
| Lain          | `[1, 2, 3]`       | `##]`     | Olgeta samting i mas sem kain       |
| Grup          | `(a, b)`          | `##)`     | Namba ples                          |
| Nem Grup      | `(x: 1, y: 2)`    | `##)`     | Ken kisim long nem o namba          |

```zymbol
// Lukim kain — givim bek (kain, namba, valyu)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Tokim na Harim

```zymbol
>> "Gude, Wol!" ¶                       // ¶ o \\ i givim nupela lain
>> "a=" a " b=" b ¶                     // planti valyu wantaim
>> (arr$#) ¶                            // ol sain bihain i nidim braket

<< nem                                  // no askim — ritim long nem
<< "Nem bilong yu? " nem                // wantaim askim
```

> `¶` (AltGr+R long Spen kibod) na `\\` i sem olsem nupela lain.

---

## Ol bilong wok

```zymbol
// Matmatik — yusim putim; sampela sain i gat hevi stret long >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (namba divais)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (paoa)

// Kompea
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lojik
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Tok

```zymbol
// Tri kain bilong joinim
nem = "Ana"
n = 42

tok = "Gude ", nem, "!"              // koma — long putim
>> "Gude " nem " yu gat " n ¶        // sidibai — long tokim >>
dispela = "Gude {nem}, yu gat {n}"   // putim insait — long olgeta ples
```

```zymbol
s = "Gude Wol"
longpela = s$#                  // 9
hap = s$[0..4]                  // "Gude"  (las i no kaunttim)
gat = s$? "Wol"                 // #1
ol = "a,b,c,d" / ','           // [a, b, c, d]
senisim = s$~~["o":"0"]         // "Gude W0l"
senisim1 = s$~~["o":"0":1]      // "G0de Wol"  (namba N tasol)
```

> `+` bilong namba tasol. Yusim `,`, sidibai, o putim insait bilong ol strin.

---

## Nasin Bilong Wok

```zymbol
x = 7

? x > 0 { >> "moa" ¶ }

? x > 100 {
    >> "bikpela tumas" ¶
} _? x > 0 {
    >> "moa" ¶
} _? x == 0 {
    >> "nating" ¶
} _ {
    >> "liklik" ¶
}
```

> Ol poki `{ }` i **mas stap** maski wanpela lain tasol.

---

## Match

```zymbol
// Ol namba rens
mak = 85
gret = ?? mak {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> gret ¶    // → B

// Ol strin
kala = "ret"
kod = ?? kala {
    "ret"   : "#FF0000"
    "grin"  : "#00FF00"
    _       : "#000000"
}

// Ol gard
het = -5
stet = ?? het {
    _? het < 0  : "ais"
    _? het < 20 : "kol"
    _? het < 35 : "warm"
    _            : "hat tumas"
}
>> stet ¶    // → ais

// Blok fom
?? n {
    0        : { >> "nating" ¶ }
    _? n < 0 : { >> "liklik" ¶ }
    _        : { >> "moa" ¶ }
}
```

---

## Ol Taim Wok

```zymbol
@ i:0..4  { >> i " " }        // rens inklud:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // wantaim step:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // baksait:       5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (wanem taim)

ol_fru = ["abus", "banana", "kokonas"]
@ f:ol_fru { >> f ¶ }         // olgeta samting long lain

@ c:"gude" { >> c "-" }
>> ¶                          // → g-u-d-e-  (olgeta sain bilong strin)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> go het
    ? i > 7 { @! }             // @! stap
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Wok i no laik stop
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Nem lup (nestim stap)
kont = 0
@ @ausait {
    kont++
    ? kont >= 3 { @! ausait }
}
>> kont ¶                     // → 3
```

---

## Ol Wok

```zymbol
putim(a, b) { <~ a + b }
>> putim(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Ol wok i gat **ples bilong ol yet** — ol i no ken ritim ol nem i stap ausait. Yusim ol autput parameta `<~` bilong senisim ol nem bilong kolim:

```zymbol
senis(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
senis(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nem wok i no inap karim. Bilong pasim olsem agument, raunim: `x -> fn(x)`.

---

## Lambda na Ol Holim

```zymbol
tu = x -> x * 2
putim2 = (a, b) -> a + b
>> tu(5) ¶    // → 10
>> putim2(3, 7) ¶   // → 10

// Blok lambda
makim = x -> {
    ? x > 0 { <~ "moa" }
    _? x < 0 { <~ "liklik" }
    <~ "nating"
}

// Holim — lambda i holim nem ausait
bikpela = 3
tu2 = x -> x * bikpela
>> tu2(7) ¶    // → 21

// Faktori
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Long lain
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Ol Lain

Ol lain i **ken senisim** (mutable) na i gat ol samting bilong **wankain kain**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — kisim (stat long 0)
arr[-1]         // 5 — namba bihain (las wan)
arr$#           // 5 — longpela (yusim (arr$#) long >>)

arr = arr$+ 6            // putim → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // putim long namba 2
arr3 = arr$- 3           // rausim pas wan bilong valyu
arr4 = arr$-- 3          // rausim olgeta bilong valyu
arr5 = arr$-[0]          // rausim long namba
arr6 = arr$-[1..3]       // rausim rens (las i no kaunttim)

gat = arr$? 3            // #1 — gat
ples = arr$?? 3          // [2] — olgeta namba bilong valyu
hap = arr$[0..3]         // [1,2,3] — hap (las i no kaunttim)
hap2 = arr$[0:3]         // [1,2,3] — sem, kaunttim nasin

antap = arr$^+           // sotim antap (primitiv tasol)
daun = arr$^-            // sotim daun  (primitiv tasol)

// Nem/namba grup lain — yusim $^ wantaim kompea lambda
db = [(nem: "Karla", yia: 28), (nem: "Ana", yia: 25), (nem: "Bob", yia: 30)]
long_yia  = db$^ (a, b -> a.yia < b.yia)    // antap long yia  (<)
long_nem  = db$^ (a, b -> a.nem > b.nem)    // daun long nem   (>)
>> long_yia[0].nem ¶     // → Ana
>> long_nem[0].nem ¶     // → Karla

// Senisim stret long ples (ol lain tasol)
arr[1] = 99              // putim
arr[0] += 5              // compound: +=  -=  *=  /=  %=  ^=

// Wok senisim — givim bek nupela lain; as i no senisim
arr2 = arr[1]$~ 99
```

> Olgeta koleksen sain i givim bek **nupela lain**. Putim bek: `arr = arr$+ 4`.
> Sain i no ken joinim — yusim namel putim.
> `$^+` / `$^-` i sotim **primitiv lain** (namba, strin). Bilong grup lain yusim `$^` wantaim kompea lambda — direksen i stap long lambda (`<` = antap, `>` = daun).

**Semantik bilong valyu** — putim lain long narapela veriabel i mekim kopi bilong en:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b i no senisim
```

```zymbol
// Nestim lain
matrik = [[1,2,3],[4,5,6],[7,8,9]]
>> matrik[1][2] ¶    // → 6
```

---

## Brukim

```zymbol
// Lain
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pas, *res] = arr            // pas=10  res=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ i rausim

// Namba ples grup
poin = (100, 200)
(px, py) = poin              // px=100  py=200

// Nem grup
man = (nem: "Ana", yia: 25, taun: "Madrido")
(nem: n, yia: a) = man       // n="Ana"  a=25
```

---

## Ol Grup

Ol grup i **no ken senisim** (immutable) na i gat ol samting bilong **kain kain kain**. Ol samting i no ken senisim bihain long em i kamap.

```zymbol
// Namba ples
poin = (10, 20)
>> poin[0] ¶    // → 10

save = (42, "gude", #1, 3.14)
>> save[2] ¶     // → #1

// Nem
man = (nem: "Alice", yia: 25)
>> man.nem ¶    // → Alice
>> man[0] ¶     // → Alice  (namba tu i wok)

// Nestim
pos = (x: 10, y: 20)
p = (pos: pos, mak: "stat")
>> p.pos.x ¶    // → 10
```

**No ken senisim (Immutabilité)** — traim bilong senisim samting long grup i gat bagarap long taim bilong wok:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ bagarap long taim bilong wok: grup i no ken senisim
// t[0] += 5    // ❌ sem bagarap
```

Yusim `$~` (wok senisim) bilong kisim valyu i senisim — i givim bek **nupela grup**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← as i no senisim
>> t2 ¶    // → (10, 999, 30)

// Grup bilong nem — bildim gen stret
man = (nem: "Alice", yia: 25)
man2  = (nem: man.nem, yia: 26)
>> man.yia ¶    // → 25
>> man2.yia ¶   // → 26
```

---

## Ol Bikpela Wok

> HOF sain i nidim **insait lambda** — nem-lambda i no inap direct.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tupela   = nums$> (x -> x * 2)               // map  → [2,4,6…20]
tupela2  = nums$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
olgeta   = nums$< (0, (acc, x) -> acc + x)   // reduce → 55

// Joinim long namel
s1 = nums$| (x -> x > 3)
s2 = s1$> (x -> x * x)
>> s2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nem wok insait HOF — raunim long lambda
tu(x) { <~ x * 2 }
r = nums$> (x -> tu(x))    // ✅
```

---

## Banis Ol

Long sait seken i nidim oltaim `_` olsem ples bilong banis valyu:

```zymbol
tu = x -> x * 2
putim3 = (a, b) -> a + b
wan_moa = x -> x + 1

5 |> tu(_)           // → 10
10 |> putim3(_, 5)   // → 15
5 |> putim3(2, _)    // → 7

// Joinim
r = 5 |> tu(_) |> wan_moa(_) |> tu(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Makim Ol Bagarap

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divaisim long nating" ¶
} :! {
    >> "narapela bagarap: " _err ¶    // _err i holim tok bilong bagarap
} :> {
    >> "oltaim i wok" ¶
}
```

| Kain        | Wanem taim                      |
|-------------|---------------------------------|
| `##Div`     | Divaisim long nating            |
| `##IO`      | Fail / sistem                   |
| `##Index`   | Namba i go ausait               |
| `##Type`    | Kain i rang                     |
| `##Parse`   | Ridim i no orait                |
| `##Network` | Netwok bagarap                  |
| `##_`       | Olgeta bagarap (kisim olgeta)   |

---

## Ol Modul

```zymbol
// lib/calc.zy
# calc

#> { putim, get_PI }    // ekspotem BIPO ol wok

_PI := 3.14159
putim(a, b) { <~ a + b }
get_PI() { <~ _PI }     // getter — direk kisim konstant long alias i no sapotim
```

```zymbol
// main.zy
<# ./lib/calc <= c    // nem i mas stap

>> c::putim(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Ekspotem wantaim narapela nem
# laibreri_mi
#> { _insait_putim <= samim }

_insait_putim(a, b) { <~ a + b }
```

```zymbol
<# ./laibreri_mi <= m

>> m::samim(3, 4) ¶    // → 7  (nem _insait_putim i hait)
```

---

## Namba Rot

Zymbol inap soim namba long **69 Unicode skript bilong namba** — Devanagari, Arabi-India, Thai, Klingon pIqaD, Strong Matematik, LCD na moa. Rot i wok long `>>` tasol; namba insait binary.

### Kirapim skript

Raitim namba `0` na `9` bilong skript insait long `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // go bek long ASCII
```

### Soim na boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, namba senisim
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Namba asli long kod

Namba bilong eni skript literal — renji, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal long eni skript

`#` + namba `0` o `1` boolean literal:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (no tru) i narakenim long `0` (zero) long olgeta skript.

---

## Ol bilong save

```zymbol
// Ritim strin olsem namba
v1 = #|"42"|      // → 42  (Namba)
v2 = #|"3.14"|    // → 3.14  (Desimal)
v3 = #|"abc"|     // → "abc"  (no bagarap sapos i no wok)

// Raunim / katim
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (raunim long 2 desimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (katim)

// Namba fom
fmt = #,|1234567|      // → 1,234,567  (koma)
sci = #^|12345.678|    // → 1.2345678e4  (siantifik)

// Bes namba
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (bineri)
c = 0o101        // → 'A'  (oktal)

// Soim bes
heks = 0x|255|    // → "0x00FF"
bin  = 0b|65|     // → "0b1000001"
okt  = 0o|8|      // → "0o10"
dec  = 0d|255|    // → "0d0255"
```

---

## Bringim Shell

```zymbol
dei = <\ date +%Y-%m-%d \>     // holim stdout (wantaim las \n)
>> "Tude: " dei

fail = "save.txt"
kontens = <\ cat {fail} \>     // putim insait long komand

autput = </"./skript.zy"/>     // renim narapela Zymbol skript, kisim autput
>> autput
```

> `><` i kisim CLI agument olsem lain bilong strin (tri-woka tasol).

---

## Ful Eksampol: FizzBuzz

```zymbol
makim(namba) {
    ? namba % 15 == 0 { <~ "FizzBuzz" }
    _? namba % 3  == 0 { <~ "Fizz" }
    _? namba % 5  == 0 { <~ "Buzz" }
    _ { <~ namba }
}

@ i:1..20 { >> makim(i) ¶ }
```

---

## Olgeta Sain

| Sain       | Wok                | Sain         | Wok                     |
|------------|--------------------|--------------|-------------------------|
| `=`        | nem i senis        | `$#`         | longpela                |
| `:=`       | nem i no senis     | `$+`         | putim                   |
| `>>`       | tokim              | `$+[i]`      | putim long namba        |
| `<<`       | harim              | `$-`         | rausim pas wan long val |
| `¶` / `\\` | nupela lain        | `$--`        | rausim olgeta long val  |
| `?`        | sapos (if)         | `$-[i]`      | rausim long namba       |
| `_?`       | o sapos (elif)     | `$-[i..j]`   | rausim rens             |
| `_`        | o / olgeta         | `$?`         | gat                     |
| `??`       | match              | `$??`        | kisim olgeta namba      |
| `@`        | taim wok           | `$[s..e]`    | hap                     |
| `@!`       | stap (break)       | `$>`         | map                     |
| `@>`       | go het (continue)  | `$\|`        | filter                  |
| `->`       | lambda             | `$<`         | reduce                  |
| `arr[i] = val` | senisim samting (ol lain tasol) | `arr[i] += val` | compound senisim |
| `arr[i]$~` | wok senisim (nupela kopi) | `$^+` | sotim antap |
| `$^-` | sotim daun | `$^` | sotim wantaim kompea (tuples) |
| `<~`       | givim bek (return) | `!?`         | traim (try)             |
| `\|>`      | banis              | `:!`         | kisim (catch)           |
| `#1`       | tru                | `:>`         | oltaim (finally)        |
| `#0`       | los                | `$!`         | bagarap i stap          |
| `<#`       | bringim            | `$!!`        | pasisim bagarap         |
| `#`        | makim modul        | `#>`         | ekspotem                |
| `::`       | yusim modul        | `.`          | kisim fil               |
| `#\|..\|`  | ritim namba        | `#?`         | kain save               |
| `#.N\|..\|` | raunim            | `#!N\|..\|`  | katim                   |
| `#,\|..\|`  | koma fom           | `#^\|..\|`    | siantifik               |
| `#d0d9#` | senisim namba rot | `#09#` | go bek long ASCII |
| `<\ ..\>`  | renim shell        | `><`         | CLI agument             |

## Histri bilong Vesian

### v0.0.3 — Unicode Namba & LSP _(Epril 2026)_

- **Putim** Unicode bloc 69 token `#d0d9#`
- **Putim** Boolean literals long eni skript — `#१` / `#०`, `#١` / `#٠`
- **Putim** Klingon pIqaD namba (CSUR PUA U+F8F0–U+F8F9)
- **Putim** VM opcode `SetNumeralMode` — tree-walker
- **Putim** REPL namba rot echo variable
- **Senisim** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Senisim** `c|..|` → `#,|..|` na `e|..|` → `#^|..|`
- **Putim** Export alias

### v0.0.2 _(24 Mar 2026)_

- **Putim** `$` arrays na strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Putim** Destructuring arrays, tuples
- **Putim** Index nogat (`arr[-1]`)
- **Putim** Instolim — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Putim** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Sain. Bilong Olgeta. I No Senis.*

> **Nots:** Dispela dokument i bin mekim na tanim AI (komputa save).
> Ol man i traim gut, tasol sampela tanim o eksampol inap gat rong.
> Tru stori i stap long [Zymbol-Lang spesifikesen](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
