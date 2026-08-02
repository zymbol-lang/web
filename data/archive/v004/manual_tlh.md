> **Qoylu'meH:** Wej qelnISbe'lu' 'e' wIlaD. qar'a'? 'e' wISovbe'. (Dochvam Data' HomwI' (AI) ghojmoHwI'pu' ghIj.)
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang ghItlh

**Zymbol-Lang** chenmoHwI' Hol 'oH. mughato' tu'lu'be' — Hoch 'oH mughom'e'. Hoch HolDaq rur.

- `if`, `while`, `return` tu'lu'be' — 'oH neH 'oH `?`, `@`, `<~`
- naQ 'oH Unicode'e' — yu' HomwI' HolDaq 'ej emoji'Daq
- HolDaq rarHa' — ghItlhvetlhDaq rur Hoch

**chenmoHwI' versIon**: v0.0.4 | **QelpIn**: 393/393 (TW ↔ VM rur)

---

---

## lIwmey 'ej rurbuS

```zymbol
x = 10              // lIw Dor
PI := 3.14159       // rurbuS — chenmoHmeH qaStaHvIS wej qel
pong = "'alIS"
Suq = #1            // boQyIn bot
👋 := "nuqneH"
```

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++        // 5
x--        // 4
```

---

## De' wabmey

| wab | ghalqI' | `#?` tagh | qelmeH |
|-----|---------|-----------|--------|
| mI' | `42`, `-7` | `###` | 64-bit |
| yon | `3.14`, `1.5e10` | `##.` | QeD ghItlhwIj luq |
| chIch | `"ghItlh"` | `##"` | lI': `"nuqneH {pong}"` |
| mu'ghom | `'A'` | `##'` | wa' Unicode mu'ghom |
| boQyIn | `#1`, `#0` | `##?` | mI'be' — `#1 = 1` ghobe' |
| gev | `[1, 2, 3]` | `##]` | roD wabmey |
| tup | `(a, b)` | `##)` | Doch |
| pong tup | `(x: 1, y: 2)` | `##)` | pong ghItlhmey |
| Qun | pong Qun mIgh | `##()` | wa'DIch boq; legh `<funct/N>` |
| lambda | `x -> x * 2` | `##->` | wa'DIch boq; legh `<lambd/N>` |

```zymbol
// tach - HeS (ghItlhwab, mI'mey, qay)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## 'och 'ej 'ong

```zymbol
>> "nuqneH" ¶                       // ¶ pagh \\ chu' ghItlh 'e' leghmoHmeH
>> "a=" a " b=" b ¶                // qabDaq - 'op qaymey
>> (arr$#) ¶                       // postfix SeHwI' 'e' ( ) tul >>Daq

<< pong                           // lIwDaq HIvoy (ghItlhtaHghach Hutlh)
<< "pong yIghItlh: " pong         // ghItlhtaHghach ghaj

```

> `¶` (AltGr+R spanish QI' lombuQ Dung) 'ej `\\` chu' ghItlh 'oH.

---

## SeHwI'

```zymbol
// mI' — lI'wI'; 'op SeHwI' 'e' qay' >>Daq
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (mI' boqHa')
r5 = a % b    // 1
r6 = a ^ b    // 1000  (Dung)

// 'ang
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b    // #1

// QeD
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## chIchyey

```zymbol
// cha' ghap rurbu'
pong = "'alIS"
n = 42

>> "nuqneH " pong " SoH ghaj " n ¶       // qabDaq — >>Daq
ghItlh = "nuqneH {pong}, SoH ghaj {n}"   // lI' — DatDaq
```

```zymbol
s = "nuqneH 'u'
chab = s$#                  // 7
bI'reS = s$[1..4]           // "nuqn"  (nab-1, rInDaq)
ghaj = s$? "'u'"            // #1
'uch = "a,b,c,d"$/ ','      // [a, b, c, d]  (chetlI' lo'taHvIS QAw)
lIw = s$~~["n":"q"]         // "quqneH 'u'"
lIw1 = s$~~["n":"q":1]      // "quqneH 'u'"  (nab n neH)
```

> `+` 'oH mI''e'. chIchyeyDaq lo' `,`, qabDaq, joq lI'.

---

---

## Do

```zymbol
x = 7

? x > 0 { >> "poS" ¶ }

? x > 100 {
    >> "tIn" ¶
} _? x > 0 {
    >> "poS" ¶
} _? x == 0 {
    >> "pagh" ¶
} _ {
    >> "Ha'DIbaH" ¶
}
```

> `{ }` *parHa'* neH wa' ghItlhtaHghach je.

---

---

## 'ang (Match)

```zymbol
// 'ur
pIn = 85
latlh = ?? pIn {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> latlh ¶    // → B

// chIchyey
Qaj = "Doq"
code = ?? Qaj {
    "Doq"   : "#FF0000"
    "SuD"   : "#00FF00"
    _       : "#000000"
}

// 'ang rurbu'
'oj = -5
Qap = ?? 'oj {
    < 0  : "bIS"
    < 20 : "bIr"
    < 35 : "wIj"
    _    : "tuj"
}
>> Qap ¶      // → bIS

// ghItlhtaHghach rurbu' (tajmey)
?? n {
    0        : { >> "pagh" ¶ }
    _? n < 0 : { >> "Ha'DIbaH" ¶ }
    _        : { >> "poS" ¶ }
}
```

---

## pe'meH

```zymbol
@ i:0..4  { >> i " " }        // 'ur:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // wIgh:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // lan:    5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (bID)

'ep = ["Hara'", "pe'ar", "tIqIp"]
@ 'e:'ep { >> 'e ¶ }           // gevDaq Hoch wab

@ ch:"nuqneH" { >> ch "-" }
>> ¶                          // → n-u-q-n-e-H-  (chIchyeyDaq Hoch mu'ghom)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jaH
    ? i > 7 { @! }            // @! Qaw'
    >> i " "
}
>> ¶                          // → 1 3 5 7

// pIpyuS pe'meH
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// pong pe'meH (ruD Qaw')
'Ir = 0
@:Hur {
    'Ir++
    ? 'Ir >= 3 { @:Hur! }
}
>> 'Ir ¶                     // → 3
```

---

## Qun

```zymbol
boq(a, b) { <~ a + b }
>> boq(3, 4) ¶   // → 7

'archu' (n) {
    ? n <= 1 { <~ 1 }
    <~ n * 'archu' (n - 1)
}
>> 'archu' (5) ¶    // → 120
```

Qunpu' ghaj **Ha'DIbaH Dung** — laDmeH 'e' tulbe'. lo' `meq.` mutlh `<~>` chenmoHwI' lIw:

```zymbol
boq'egh(a<~, b<~) {
    lIwwIj = a
    a = b
    b = lIwwIj
}
x = 10
y = 20
boq'egh(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> pong Qunpu' 'oH **wa'DIch boq qay**. DIl: `nums$> cha'logh`. `x -> fn(x)` je Qap.

---

---

## lambdabogh 'ej 'eDSeH

```zymbol
cha'logh = x -> x * 2
boq = (a, b) -> a + b
>> cha'logh(5) ¶   // → 10
>> boq(3, 7) ¶    // → 10

// taj lambda
nIv = x -> {
    ? x > 0 { <~ "poS" }
    _? x < 0 { <~ "Ha'DIbaH" }
    <~ "pagh"
}

// 'eDSeH — Hur Dung pe'
tIn = 3
wejlogh = x -> x * tIn
>> wejlogh(7) ¶   // → 21

// chen
chenmoHboq(n) { <~ x -> x + n }
wa'maH boq = chenmoHboq(10)
>> wa'maH boq(5) ¶   // → 15

// gevDaq
SeH = [x -> x+1, x -> x*2, x -> x*x]
>> SeH[3](5) ¶      // → 25
```

---

## gev

gev **Dor** 'ej ghaj **roD wabmey**.

```zymbol
gev = [1, 2, 3, 4, 5]

gev[1]          // 1 — 'uch (nab-1: wa'DIch wab)
gev[-1]         // 5 — nagh nugh (Qav wab)
gev$#           // 5 — chab (lo' (gev$#) >>Daq)

gev = gev$+ 6            // boq → [1,2,3,4,5,6]
gev2 = gev$+[2] 99       // 'eD chen 2Daq (nab-1)
gev3 = gev$- 3           // wa'DIch qay ta'pu'bogh yIqaw'Ha'
gev4 = gev$-- 3          // Hoch qay yIqaw'Ha'
gev5 = gev$-[1]          // nugh 1Daq yIqaw'Ha' (wa'DIch wab)
gev6 = gev$-[2..3]       // 'ur yIqaw'Ha' (nab-1, rInDaq)

ghaj = gev$? 3           // #1 — tu'lu'
nughmey = gev$?? 3       // [3] — Hoch qay nugh (nab-1)
Qav = gev$[1..3]        // [1,2,3] — Qav (nab-1, rInDaq)
Qav2 = gev$[1:3]        // [1,2,3] — rur, mI'nab ghItlh

Dung = gev$^+           // Dung (nab rurbu')
bIng = gev$^-           // bIng (nab rurbu')

// pong/ Doch tup gev — lo' $^ 'ang lambdabogh
De' = [(pong: "qarla", ben: 28), (pong: "'ana", ben: 25), (pong: "bob", ben: 30)]
benDung   = De'$^ (a, b -> a.ben < b.ben)     // Dung ben (<)
pongbIng   = De'$^ (a, b -> a.pong > b.pong)  // bIng pong (>)
>> benDung[1].pong ¶    // → 'ana
>> pongbIng[1].pong ¶   // → qarla

// Hoch wab Qap (gev neH)
gev[1] = 99              // lI'
gev[2] += 5              // lI' boqtaH: +=  -=  *=  /=  %=  ^=

// Qun Qap — ghIq gev chu' 'ang; Sov ghIq Ha'DIbaH
gev2 = gev[2]$~ 99
```

> Hoch 'ay' SeHwI' **gev chu'** 'ang. lI': `gev = gev$+ 4`.
> `$+` Hogh: `gev = gev$+ 5$+ 6$+ 7`. latlh SeHwI' lI' 'ugh.
> **nugh nab-1**: `gev[1] 'oH wa'DIch wab`; `gev[0] 'oH qaStaHvIS wej qel`.
> `$^+` / `$^-` **rurbu' gev** (mI', chIchyey). tup gev lo' $^ 'ang 'ang lambda — Hur lambdaDaq wul (`<` = Dung, `>` = bIng).

**qay rurbu'** — gev HItlhej lIw chu' chenmoH:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b Qapbe'
```

```zymbol
// ruD gev (nab-1 nugh)
logh = [[1,2,3],[4,5,6],[7,8,9]]
>> logh[2][3] ¶    // → 6  (logh2, tuq3)
```

---

## ghItlhwIj tIqIp

```zymbol
// gev
gev = [10, 20, 30, 40, 50]
[a, b, c] = gev              // a=10  b=20  c=30
[wa'DIch, *ngI'], = gev      // wa'DIch=10  ngI'=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ Qaw'

// Doch tup
nav = (100, 200)
(px, py) = nav              // px=100  py=200

// pong tup
tlhIngan = (pong: "'ana", ben: 25, Qo'noS: "madrid")
(pong: p, ben: b) = tlhIngan   // p="'ana"  b=25
```

---

## tup

tup 'oH **Ha'DIbaH** 'ay'pu' 'ej ghaj **wab law'**.

```zymbol
// Doch — law' wabmey lutu'
nav = (10, 20)
>> nav[1] ¶     // → 10

De' = (42, "nuqneH", #1, 3.14)
>> De'[3] ¶     // → #1

// pong
tlhIngan = (pong: "alIS", ben: 25)
>> tlhIngan.pong ¶   // → alIS
>> tlhIngan[1] ¶     // → alIS  (nugh je Qap, nab-1)

// ruD
nagh = (x: 10, y: 20)
p = (nagh: nagh, tagh: "ghoS")
>> p.nagh.x ¶       // → 10
```

**Ha'DIbaH** — tup wab Qap 'e' Qapbe':

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ Ha'DIbaH: tup Ha'DIbaH 'oH
// t[1] += 5    // ❌ rur

// pong tup — lI' Qap
tlhIngan = (pong: "alIS", ben: 25)
tIn = (pong: tlhIngan.pong, ben: 26)
>> tlhIngan.ben ¶    // → 25
>> tIn.ben ¶         // → 26
```

chenmoHmeH Qap, lo' `$~` (Qun Qap) — **chu'** tup 'ang:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← Sov Ha'DIbaH
>> t2 ¶    // → (10, 999, 30)
```

---

## Dung Qun

```zymbol
mI'mey = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

cha'loghpu' = mI'mey$> (x -> x * 2)                // meq → [2,4,6…20]
chatlh   = mI'mey$| (x -> x % 2 == 0)             // ghItlhtaH → [2,4,6,8,10]
nI'     = mI'mey$< (0, (boq, x) -> boq + x)       // Qaw' → 55

// Hogh 'ugh
tep1 = mI'mey$| (x -> x > 3)
tep2 = tep1$> (x -> x * x)
>> tep2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// pong Qun lo' Dung Qun
cha'logh(x) { <~ x * 2 }
tIn'a' (x) { <~ x > 5 }
r = mI'mey$> cha'logh       // ✅ Hoch mIgh
r = mI'mey$| tIn'a'         // ✅ Hoch mIgh
```

---

---

## pel SeHwI'

nIH poS jarDaq 'oH `_` 'e' lo':

```zymbol
cha'logh = x -> x * 2
boq = (a, b) -> a + b
nIq = x -> x + 1

5 |> cha'logh(_)        // → 10
10 |> boq(_, 5)         // → 15
5 |> boq(2, _)          // → 7

// Hogh
r = 5 |> cha'logh(_) |> nIq(_) |> cha'logh(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## qay

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pagh boqHa''a'" ¶
} :! {
    >> "Hoch qay: " _err ¶    // _err qay ghItlh
} :> {
    >> "Hoch logh" ¶
}
```

| wab | qaStaH |
|-----|--------|
| `##Div` | pagh boqHa''a' |
| `##IO` | De'wI' / chen |
| `##Index` | nugh bIng |
| `##Type` | wab rurbe' |
| `##Parse` | De' tIqIp |
| `##Network` | 'echlet qay |
| `##_` | Hoch qay (choH) |

---

## modul

```zymbol
// lib/calc.zy — modul taj bIng
# calc {
    #> { boq, get_PI }

    _PI := 3.14159
    boq(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // pong tIqIp parHa'

>> c::boq(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// 'ang latlh pong
# moy'taHghach {
    #> { _boqDaq <= boqHom }

    _boqDaq(a, b) { <~ a + b }
}
```

```zymbol
<# ./moy'taHghach <= m

>> m::boqHom(3, 4) ¶    // → 7  (_boqDaq pong So'lu')
```

> **modul malja':** `# pong { }`Daq reH `#>`, Qun rurbu', 'ej ghalqI' lIw/rurbu' dam — parHa'. ghItlhtaHghach SeH (`>>`, `<<`, pe'meH, latlh) qay E013 'ang.

---

---

## mI' rurbu'

Zymbol mI'mey 'anglaH **69 Unicode mI' tajmey**Daq — Devanagari, 'arAb-Hindu, thay, tlhIngan pIqaD, QeD bIr, LCD 'ay', latlh. rurbu' 'oH QuQ 'angtaHvIS `>>`; 'oHbogh mI' 'oH binary.

### mI' tIqIp

`0` 'ej `9` mI' tIqIp `#…#`Daq:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // 'arAb-Hindu   (U+0660–U+0669)
#๐๙#    // thay          (U+0E50–U+0E59)
#09#    // ASCII DIr

```

### 'ang 'ej boQyIn

```zymbol
x = 42
>> x ¶          // → 42   (ASCII nab)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (yon nugh 'oH ASCII)
>> 1 + 2 ¶      // → ३

// boQyIn: # tagh 'oH ASCII, mI' je
>> #1 ¶         // → #१   (bot DevanagariDaq)
>> #0 ¶         // → #०   (botHa' — ० mI' pagh je)

x = 28 > 4
>> x ¶          // → #१   ('ang rurbu' legh)
```

---

## ghalqI' mI'mey De'Daq

Hoch rurbu' mI'mey 'oH **ghalqI'** — 'urDaq, moduloDaq, 'angDaq:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

---

### Hoch rurbu' boQyIn ghalqI'

`#` + mI' `0` pagh `1` tajvo' 'oH boQyIn ghalqI':

```zymbol
#०९#
Suq = #१        // rur #1
>> Suq ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **reH ASCII**. `#0` (botHa') reH 'oH legh 'e' rur `0` (pagh mI') Hoch rurbu'.

---

---

## De' SeHwI'

```zymbol
// wab 'ang
##.42         // → 42.0  (yonDaq)
###3.7        // → 4     (mI'Daq, bow)
##!3.7        // → 3     (mI'Daq, Qor)

// chIch mI'Daq tIqIp
v1 = #|"42"|      // → 42  (mI')
v2 = #|"3.14"|    // → 3.14  (yon)
v3 = #|"abc"|     // → "abc"  (DeSDu', qaybe')

// bow / Qor
pi = 3.14159265
bow2 = #.2|pi|     // → 3.14  (yoS 2Daq bow)
bow4 = #.4|pi|     // → 3.1416
Qor2 = #!2|pi|     // → 3.14  (Qor)

// mI' ghItlh
ghItlh = #,|1234567|   // → 1,234,567  (Qo'noS)
QeD = #^|12345.678|    // → 1.2345678e4  (QeD)

// nab ghalqI'
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// nab 'ang
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## DIvI' Hol

```zymbol
jaj = <\ date +%Y-%m-%d \>     // stdout chav (rInDaq \n je)
>> "DaHjaj: " jaj

De'wI' = "De'.txt"
ghItlh = <\ cat {De'wI'} \>       // ra'Daq lI'

'ang = </"./subscript.zy"/>      // latlh Zymbol ghItlh Qap, 'ang chav
>> 'ang
```

> `><` CLI SeH 'ang chav (tree-walker neH).

---

## qaSDI' QeD: FizzBuzz

```zymbol
nIv(mI') {
    ? mI' % 15 == 0 { <~ "FizzBuzz" }
    _? mI' % 3  == 0 { <~ "Fizz" }
    _? mI' % 5  == 0 { <~ "Buzz" }
    _ { <~ mI' }
}

@ i:1..20 { >> nIv(i) ¶ }
```

---

## mughom

| mughom | Qun | mughom | Qun |
|--------|-----|--------|-----|
| `=` | lIw | `$#` | chab |
| `:=` | rurbuS | `$+` | boq (Hogh) |
| `>>` | 'ang | `$+[i]` | 'eD nughDaq (nab-1) |
| `<<` | 'ong | `$-` | wa'DIch Qaw'Ha' qay |
| `¶` / `\\` | chu' ghItlh | `$--` | Hoch Qaw'Ha' qay |
| `?` | chugh | `$-[i]` | nughDaq Qaw'Ha' (nab-1) |
| `_?` | pagh chugh | `$-[i..j]` | 'ur Qaw'Ha' (nab-1) |
| `_` | pagh / Hoch | `$?` | tu'lu' |
| `??` | 'ang | `$??` | Hoch nugh tu' (nab-1) |
| `@` | pe'meH | `$[s..e]` | Qav (nab-1) |
| `@ N { }` | N logh pe'meH | `$>` | meq |
| `@!` | Qaw' | `$|` | ghItlhtaH |
| `@>` | jaH | `$<` | Qaw' |
| `@:pong { }` | pong pe'meH | `$/ chetlI'` | chIch 'uch |
| `@:pong!` | pong Qaw' | `$++ a b c` | boq chen |
| `@:pong>` | pong jaH | `gev[i>j>k]` | nugh |
| `->` | lambda | `gev[i] = qay` | wab Qap (gev neH) |
| `gev[i] += qay` | lI' Qap | `gev[i]$~` | Qun Qap (ghIq copy) |
| `$^+` | Dung (rurbu') | `$^-` | bIng (rurbu') |
| `$^` | 'ang (tup) | `<~` | 'ang |
| `|>` | pel | `!?` | Qap |
| `:!` | chav | `:>` | rIn |
| `#1` | bot | `#0` | botHa' |
| `$!` | qay | `$!!` | qay 'ang |
| `<#` | 'ong | `#>` | 'ang |
| `#` | modul ja'chu' | `::` | modul boq |
| `.` | Doch 'uch | `#?` | wab De' |
| `#\|..\|` | mI' tIqIp | `##.` | yonDaq 'ang |
| `###` | mI'Daq 'ang (bow) | `##!` | mI'Daq 'ang (Qor) |
| `#.N\|..\|` | bow | `#!N\|..\|` | Qor |
| `#,\|..\|` | Qo'noS ghItlh | `#^\|..\|` | QeD |
| `#d0d9#` | mI' rurbu' choH | `#09#` | ASCII DIr |
| `<\ ..\>` | DIvI' Hol Qap | `>\<` | CLI SeH |
| `\ var` | lIw Qaw' | | |

---

## 'ang logh

### v0.0.4 — nab-1 nugh, wa'DIch boq Qun, modul taj '(April 2026)

- **Qaw'** Hoch nugh **nab-1** — `arr[1]` 'oH wa'DIch wab; `arr[0]` 'oH qaStaHvIS wej qel
- **boq** pong Qun 'oH **wa'DIch boq qay** — Dung QunDaq DIl: `nums$> cha'logh`
- **boq** modul **taj ghItlh** parHa': `# pong { ... }` — Sut ghItlh Qaw'lu'
- **boq** law' nugh: `arr[i>j>k]` (Do), `arr[p ; q]` (Sut)
- **boq** wab 'ang: `##.ghItlh` (yon), `###ghItlh` (mI' bow), `##!ghItlh` (mI' Qor)
- **boq** chIch 'uch: `chIch$/ chetlI'` — 'ang `Array(chIch)`
- **boq** boq chen: `nab$++ a b c` — 'op wab boq
- **boq** N logh pe'meH: `@ N { }` — N logh Qap
- **boq** pong pe'meH ghItlh: `@:pong { }`, `@:pong!`, `@:pong>` — Sut `@ @pong` / `@! pong`
- **boq** lIw Dung malja': `_pong` lIw ghaj taj Dung; `\ var` Qaw' Qap
- **boq** 'ang 'ang rurbu': `< 0 :`, `> 5 :`, `== 42 :` latlh
- **boq** modul qay E013: Sut ghItlhtaHghach modulDaq 'e' 'angbe'
- **Qap** `take_variable` modul rurbuS Qaw'Ha' vay'
- **Qap** `alias.RURBUS` Daq Qap; `#>` Qun rurbu' 'anglaH
- **VM** rur: 393/393 QelpIn Qap

### v0.0.3 — Unicode mI' rurbu' 'ej LSP Qap _(April 2026)_

- **boq** 69 Unicode mI' tajmey lo' `#d0d9#` rurbu' choH
- **boq** boQyIn ghalqI' Hoch rurbu' — `#१` / `#०`, `#१` / `#०`, latlh
- **boq** tlhIngan pIqaD mI'mey (CSUR PUA U+F8F0–U+F8F9)
- **boq** `SetNumeralMode` VM SeHwI' — rur tree-walker
- **boq** REPL rurbu' tu'lu'bogh 'angtaHvIS 'ej lIw legh
- **choH** boQyIn `>>` 'ang 'oH `#` tagh (`#0` / `#1`) Hoch rurbu'Daq

### v0.0.2_01 — SeHwI' pong choH _(30 'IwlIj 2026)_

- **choH** `c|..|` → `#,|..|` 'ej `e|..|` → `#^|..|` — 'ang `#` tagh
- **boq** 'ang pong: modul wab 'ang latlh pong

### v0.0.2 — 'ay' API Sut 'ej chenmoHwI' _(24 'IwlIj 2026)_

- **boq** 'ay' `$` SeHwI' gev 'ej chIch (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **boq** ghItlhwIj tIqIp lI' gev, tup, 'ej pong tup
- **boq** nagh nugh (`arr[-1]` = Qav wab)
- **boq** chenmoHwI' — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 'IwlIj 2026)_

- **boq** lI' boqtaH `^=`
- **Qap** De'wI' mI' qab; ghItlh Qap

### v0.0.1 — wa'DIch 'ang _(22 'IwlIj 2026)_

- tree-walker chenmoHwI' + register VM (`--vm`, ~4× QaQ, ~95% rur)
- Hoch Qun: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- naQ Unicode yu', modul chen, lambda, 'eDSeH, qay
- REPL, LSP, VS Code 'ay', ghItlh (`zymbol fmt`)

---

_Zymbol-Lang — mughom. Hoch 'u'. Ha'DIbaH._
