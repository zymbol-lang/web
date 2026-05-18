# Llawlyfr Cryno Zymbol-Lang

**Zymbol-Lang** yw iaith raglennu symbolaidd. Nid yw'n defnyddio unrhyw eiriau allweddol — mae popeth yn symbol. Mae'n gweithio'r un fath ym mhob iaith ddynol.

- Dim geiriau allweddol (`os`, `dolen`, `dychwelyd` nid ydynt yn bodoli — dim ond symbolau `?`, `@`, `<~`)
- Unicode llawn — cyfrifiaduron mewn unrhyw iaith neu emoji 👋
- Iaith-ddynol-amherthnasol — mae'r cod yr un peth ym mhob iaith

---

## Newidynnau a Chysonion

```zymbol
x = 10           // newidyn (newidiadwy)
PI := 3.14159    // cysonyn (annewidiadwy — gwall os ailneiltuir)
enw = "Ana"
actif = #1       // boole gwir
👋 := "Helo"
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

## Mathau Data

| Math           | Enghraifft          | Symbol `#?` | Nodiadau                              |
|----------------|---------------------|-------------|---------------------------------------|
| Cyfanrif       | `42`, `-7`          | `###`       | 64-did arwyddol                       |
| Pwynt Arnawf   | `3.14`, `1.5e10`    | `##.`       | Nodiant gwyddonol OK                  |
| Llinyn         | `"helo"`            | `##"`       | Rhyngosodiad: `"Helo {enw}"`          |
| Cymeriad       | `'A'`               | `##'`       | Un cymeriad Unicode                   |
| Boole          | `#1`, `#0`          | `##?`       | NID yn rhifiadol 1 a 0                |
| Arae           | `[1, 2, 3]`         | `##]`       | Rhaid i bob elfen fod o'r un math     |
| Twpl           | `(a, b)`            | `##)`       | Seilio ar safle                       |
| Twpl Enwol     | `(x: 1, y: 2)`      | `##)`       | Mynediad drwy enw neu fynegai         |

```zymbol
// Mewnsylliad math — yn dychwelyd (math, digidau, gwerth)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Allbwn a Mewnbwn

```zymbol
>> "Helo, Byd Cymraeg!" ¶              // ¶ neu \\ yn rhoi llinell newydd benodol
>> "a=" a " b=" b ¶                    // gwerthoedd lluosog ochr yn ochr
>> (ffrwyth$#) ¶                       // mae angen cromfachau ar weithredwyr ôl-dodi

<< enw                                 // dim anogaeth — yn darllen i mewn i newidyn
<< "Eich enw? " enw                    // gydag anogaeth
```

> `¶` neu `\\` sy'n gywerth â llinell newydd.

---

## Gweithredwyr

```zymbol
// Rhifyddeg
a = 10
b = 3
c1 = a + b    // 13     c2 = a - b    // 7
c3 = a * b    // 30     c4 = a / b    // 3  (rhaniad cyfanrif)
c5 = a % b    // 1      c6 = a ^ b    // 1000  (pŵer)

// Cymhariaeth
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Rhesymeg
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Llinynnau

```zymbol
// Tair ffurf gysylltu
enw = "Ana"
rhif = 42

neges = "Helo ", enw, "!"            // atalnod — mewn aseiniadau
>> "Helo " enw " mae gennych " rhif ¶ // ochr yn ochr — mewn >>
disgrifiad = "Helo {enw}, mae gennych {rhif}"  // rhyngosodiad — unrhyw le
```

```zymbol
s = "Helo Byd"
hyd = s$#                  // 8
is = s$[0..4]              // "Helo"  (diwedd heb gynnwys)
yn = s$? "Byd"             // #1
rhann = "a,b,c,d" / ','    // [a, b, c, d]
amnew = s$~~["e":"a"]       // amnewid
amnew1 = s$~~["e":"a":1]    // N cyntaf
```

> `+` ar gyfer rhifau yn unig. Ar gyfer llinynnau defnyddiwch `,`, cyfosodiad neu fewnblannu.

---

## Llif Rheoli

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "mawr" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "sero" ¶
} _ {
    >> "negatif" ¶
}
```

> Blociau `{ }` yn **ofynnol** hyd yn oed ar gyfer un datganiad.

---

## Cyfatebu

```zymbol
// Ystodau
pwyntiau = 85
gradd = ?? pwyntiau {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> gradd ¶    // → B

// Llinynau
lliw = "coch"
cod = ?? lliw {
    "coch"   : "#FF0000"
    "gwyrdd" : "#00FF00"
    _        : "#000000"
}

// Gwylwyr
tymheredd = -5
cyflwr = ?? tymheredd {
    _? tymheredd < 0  : "iâ"
    _? tymheredd < 20 : "oer"
    _? tymheredd < 35 : "cynnes"
    _                 : "poeth"
}
>> cyflwr ¶    // → iâ

// Ffurf datganiad (breichiau bloc)
?? n {
    0       : { >> "sero" ¶ }
    _? n < 0: { >> "negatif" ¶ }
    _       : { >> "positif" ¶ }
}
```

---

## Dolenni

```zymbol
@ i:0..4  { >> i " " }        // ystod gynhwysol:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // gyda cham:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // gwrthdroi:         5 4 3 2 1 0

rhif = 1
@ rhif <= 64 { rhif *= 2 }
>> rhif ¶                      // → 128  (tra)

ffrwyth = ["afal", "gellygen", "grawnwin"]
@ f:ffrwyth { >> f ¶ }         // am-bob-un dros arae

@ c:"helo" { >> c "-" }
>> ¶                           // → h-e-l-o-  (am-bob-un dros llinyn)

@ i:1..10 {
    ? i % 2 == 0 { @> }        // @> parhau
    ? i > 7 { @! }              // @! torri
    >> i " "
}
>> ¶                           // → 1 3 5 7

// Dolen anfeidrol
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                           // → 1 2 3 4

// Dolen wedi'i labelu (torri nyth)
cyfrif = 0
@ @allanol {
    cyfrif++
    ? cyfrif >= 3 { @! allanol }
}
>> cyfrif ¶                    // → 3
```

---

## Ffwythiannau

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

ffactorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ffactorial(n - 1)
}
>> ffactorial(5) ¶    // → 120
```

Mae gan ffwythiannau **cwmpas ynysig** — ni allant ddarllen newidynnau allanol. Defnyddiwch baramedrau allbwn `<~` i newid newidynnau'r galwr:

```zymbol
cyfnewid(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
cyfnewid(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nid yw ffwythiannau enwol yn werthoedd dosbarth cyntaf. I'w basio fel dadl, lapiwch: `x -> enw(x)`.

---

## Lambdas a Chaead

```zymbol
dyblu = x -> x * 2
swm = (a, b) -> a + b
>> dyblu(5) ¶    // → 10
>> swm(3, 7) ¶   // → 10

// Lambda bloc
dosbarthu = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "sero"
}

// Caead — yn dal cwmpas allanol
ffactor = 3
treblu = x -> x * ffactor
>> treblu(7) ¶    // → 21

// Ffatri
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Mewn araeau
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Araeau

Mae araeau yn **newidiadwy** ac yn dal elfennau o'r **un math**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — mynediad (mynegai 0-seiliedig)
arr[-1]         // 5 — mynegai negatif (olaf)
arr$#           // 5 — hyd (defnyddiwch (arr$#) yn >>)

arr = arr$+ 6            // ychwanegu → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // mewnosod yn mynegai 2
arr3 = arr$- 3           // tynnu digwyddiad cyntaf o werth
arr4 = arr$-- 3          // tynnu pob digwyddiad
arr5 = arr$-[0]          // tynnu yn ôl mynegai
arr6 = arr$-[1..3]       // tynnu ystod (diwedd heb gynnwys)

mae = arr$? 3            // #1 — yn cynnwys
safl = arr$?? 3          // [2] — pob mynegai o werth
sl = arr$[0..3]          // [1,2,3] — sleisen (diwedd heb gynnwys)
sl2 = arr$[0:3]          // [1,2,3] — yr un peth, cystrawen cyfrif

esgy = arr$^+            // trefnwyd yn esgynnol  (elfennau sylfaenol yn unig)
disg = arr$^-            // trefnwyd yn ddisgynnol (elfennau sylfaenol yn unig)

// Araeau twpl enwol/safleol — defnyddiwch $^ gyda lambda cymhariaeth
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
yn_ol_oed  = db$^ (a, b -> a.age < b.age)    // esgynnol yn ôl oed  (<)
yn_ol_enw = db$^ (a, b -> a.name > b.name)  // disgynol yn ôl enw (>)
>> yn_ol_oed[0].name ¶     // → Ana
>> yn_ol_enw[0].name ¶    // → Carla

// Diweddariad uniongyrchol elfen (araeau yn unig)
arr[1] = 99              // neilltuo
arr[0] += 5              // cyfansawdd: +=  -=  *=  /=  %=  ^=

// Diweddariad swyddogaethol — yn dychwelyd arae newydd; gwreiddiol heb newid
arr2 = arr[1]$~ 99
```

> Mae pob gweithredwr casgliad yn dychwelyd **arae newydd**. Neiltuiwch yn ôl: `arr = arr$+ 4`.
> Ni ellir cadwyno gweithredwyr — defnyddiwch aseiniadau canolradd.
> Mae `$^+` / `$^-` yn trefnu **araeau sylfaenol** (rhifau, llinynau). Ar gyfer araeau twpl defnyddiwch `$^` gyda lambda cymhariaeth — mae'r cyfeiriad wedi'i amgodio yn y lambda (`<` = esgynnol, `>` = disgynol).

**Semanteg gwerth** — mae neilltuo arae i newidyn arall yn creu copi annibynnol:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← nid yw b wedi'i effeithio
```

```zymbol
// Araeau nyth
matrics = [[1,2,3],[4,5,6],[7,8,9]]
>> matrics[1][2] ¶    // → 6
```

---

## Dadstrwythuro

```zymbol
// Arae
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[cyntaf, *gweddill] = arr     // cyntaf=10  gweddill=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ yn anwybyddu

// Tuple safle
pwynt = (100, 200)
(px, py) = pwynt             // px=100  py=200

// Tuple enwedig
person = (enw: "Ana", oed: 25, dinas: "Caerdydd")
(enw: e, oed: o) = person    // e="Ana"  o=25
```

---

## Typlau

Mae typlau yn gynwysyddion trefnus **annewidiadwy** sy'n gallu dal gwerthoedd o **wahanol fathau**. Yn wahanol i araeau, ni ellir newid elfennau ar ôl eu creu.

```zymbol
// Safleol
pwynt = (10, 20)
>> pwynt[0] ¶    // → 10

data = (42, "helo", #1, 3.14)
>> data[2] ¶     // → #1

// Enwol
person = (name: "Alice", age: 25)
>> person.name ¶    // → Alice
>> person[0] ¶      // → Alice  (mae mynegai hefyd yn gweithio)

// Nyth
pos = (x: 10, y: 20)
p = (pos: pos, label: "tarddiad")
>> p.pos.x ¶        // → 10
```

**Annewidiadwyedd** — mae unrhyw ymgais i addasu elfen twpl yn wall amser rhedeg:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ gwall amser rhedeg: mae typlau yn annewidiadwy
// t[0] += 5    // ❌ yr un gwall
```

I gael gwerth wedi'i addasu defnyddiwch `$~` (diweddariad swyddogaethol) — yn dychwelyd twpl **newydd**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← gwreiddiol heb newid
>> t2 ¶    // → (10, 999, 30)

// Twpl enwol — ailgreu yn benodol
person = (name: "Alice", age: 25)
hŷn = (name: person.name, age: 26)
>> person.age ¶    // → 25
>> hŷn.age ¶       // → 26
```

---

## Ffwythiannau Uwch Drefn

> Mae gweithredwyr HOF yn gofyn am **lambda mewnol** — nid newidyn lambda uniongyrchol.

```zymbol
rhifau = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dyblu_maes  = rhifau$> (x -> x * 2)                // mapio  → [2,4,6…20]
eilrif    = rhifau$| (x -> x % 2 == 0)           // hidlo → [2,4,6,8,10]
cyfanswm    = rhifau$< (0, (acc, x) -> acc + x)     // lleihau → 55

// Cadwyn drwy ganolradd
cam1 = rhifau$| (x -> x > 3)
cam2 = cam1$> (x -> x * x)
>> cam2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ffwythiannau enwol y tu mewn i HOF — lapiwch mewn lambda
dyblu(x) { <~ x * 2 }
r = rhifau$> (x -> dyblu(x))    // ✅
```

---

## Gweithredwr Pib

Mae ochr dde bob amser angen `_` fel neilltuo:

```zymbol
dwbl = x -> x * 2
adio = (a, b) -> a + b
cynyddu = x -> x + 1

5 |> dwbl(_)        // → 10
10 |> adio(_, 5)    // → 15
5 |> adio(2, _)     // → 7

// Cadwyn
r = 5 |> dwbl(_) |> cynyddu(_) |> dwbl(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Trin Gwallau

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "rhannu â sero" ¶
} :! {
    >> "arall: " _err ¶    // mae _err yn dal y neges gwall
} :> {
    >> "yn rhedeg bob amser" ¶
}
```

| Math        | Pan ddigwydd             |
|-------------|--------------------------|
| `##Div`     | Rhannu â sero            |
| `##IO`      | Ffeil / system           |
| `##Index`   | Mynegai y tu hwnt i fwnd |
| `##Type`    | Gwall math               |
| `##Parse`   | Dadosodiad data          |
| `##Network` | Gwallau rhwydwaith       |
| `##_`       | Unrhyw wall (dal-popeth) |

---

## Modiwlau

```zymbol
// lib/calc.zy
# calc

#> { add, get_PI }    // allforio CYN diffiniadau

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }   // gettwr — nid yw mynediad cysonyn uniongyrchol trwy alias yn cael ei gynnal
```

```zymbol
// main.zy
<# ./lib/calc <= c    // mae angen alias

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Allforio gydag enw cyhoeddus gwahanol
# fylib
#> { _add_mewnol <= swm }

_add_mewnol(a, b) { <~ a + b }
```

```zymbol
<# ./fylib <= m

>> m::swm(3, 4) ¶    // → 7  (mae enw mewnol _add_mewnol wedi'i guddio)
```

---

## Moddau Rhifol

Gall Zymbol arddangos rhifau mewn **69 o sgriptiau digid Unicode** — Devanagari, Arabaidd-Indiaidd, Thai, Klingon pIqaD, Mathemategol Trwm, segmentau LCD a mwy. Mae'r modd actif yn effeithio ar allbwn `>>` yn unig; mae rhifyddeg fewnol bob amser yn ddeuaidd.

### Actifadu sgript

Ysgrifennwch ddigid `0` a `9` y sgript targed wedi'i amgáu yn `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabaidd-Ind. (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ailosod i ASCII
```

### Allbwn a booleans

```zymbol
x = 42
>> x ¶          // → 42   (ASCII rhagosodiad)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (pwynt degol bob amser yn ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: rhagddodiad # bob amser yn ASCII, digid yn addasu
>> #1 ¶         // → #१   (gwir yn Devanagari)
>> #0 ¶         // → #०   (anghywir — gwahanol i ०  sero cyfanrif)

x = 28 > 4
>> x ¶          // → #१   (canlyniad cymhariaeth yn dilyn modd actif)
```

### Llythrennau digid brodorol yn y cod ffynhonnell

Mae digidau unrhyw sgript a gefnogir yn llythrennau dilys — mewn ystodau, modulo, cymhariaethau:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Llythrennau boolean mewn unrhyw sgript

`#` + digid `0` neu `1` o unrhyw floc yw llythyren boolean ddilys:

```zymbol
#٠٩#
نشط = #١        // yr un fath â #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> Mae `#` **bob amser yn ASCII**. Mae `#0` (anghywir) bob amser yn wahanol yn weledol i `0` (sero cyfanrif) ym mhob sgript.

---

## Gweithredwyr Data

```zymbol
// Trosi llinyn i rif
v1 = #|"42"|      // → 42
v2 = #|"3.14"|    // → 3.14
v3 = #|"abc"|     // → "abc"

// Talgrynnu / Torri
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Fformat rhif
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Sylfaen lythrennol
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Trosi sylfaen
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integreiddio Shell

```zymbol
dyddiad = <\ date +%Y-%m-%d \>     // cipio stdout
>> "Heddiw: " dyddiad

ffeil = "data.txt"
cynnwys = <\ cat {ffeil} \>        // rhyngosodiad mewn gorchymyn

allbwn = </"./subscript.zy"/>      // rhedeg sgript Zymbol
>> allbwn
```

> `><` yn cipio dadleuon CLI fel arae llinyn (coeden-gerdded yn unig).

---

## Enghraifft Gyflawn: FizzBuzz

```zymbol
dosbarthu(rhif) {
    ? rhif % 15 == 0 { <~ "SwigenBwm" }
    _? rhif % 3  == 0 { <~ "Swigen" }
    _? rhif % 5  == 0 { <~ "Bwm" }
    _ { <~ rhif }
}

@ i:1..20 { >> dosbarthu(i) ¶ }
```

---

## Cyfeiriad Symbolau

| Symbol | Gweithrediad | Symbol | Gweithrediad |
|--------|--------------|--------|--------------|
| `=` | newidyn | `$#` | hyd |
| `:=` | cysonyn | `$+` | ychwanegu |
| `>>` | allbwn | `$+[i]` | mewnosod yn ôl mynegai |
| `<<` | mewnbwn | `$-` | tynnu cyntaf yn ôl gwerth |
| `¶` / `\\` | llinell newydd | `$--` | tynnu pob yn ôl gwerth |
| `?` | os | `$-[i]` | tynnu yn ôl mynegai |
| `_?` | arall-os | `$-[i..j]` | tynnu ystod |
| `_` | arall / cardiau gwyllt | `$?` | yn cynnwys |
| `??` | cyfatebu | `$??` | darganfod pob mynegai |
| `@` | dolen | `$[s..e]` | sleisen |
| `@!` | torri | `$>` | mapio |
| `@>` | parhau | `$\|` | hidlo |
| `->` | lambda | `$<` | lleihau |
| `arr[i] = val` | diweddaru elfen (araeau yn unig) | `arr[i] += val` | diweddariad cyfansawdd |
| `arr[i]$~` | diweddariad swyddogaethol (copi newydd) | `$^+` | trefnu esgynnol (sylfaenol) |
| `$^-` | trefnu disgynol (sylfaenol) | `$^` | trefnu gyda chymhariaeth (typlau) |
| `<~` | dychwelyd | `!?` | ceisio |
| `\|>` | pib | `:!` | dal |
| `#1` | gwir | `:>` | yn y diwedd |
| `#0` | anwir | `$!` | yw gwall |
| `<#` | mewnforio | `$!!` | lledaenu gwall |
| `#` | datgan modiwl | `#>` | allforio |
| `::` | galwad modiwl | `.` | mynediad maes |
| `#\|..\|` | trosi rhif | `#?` | metadata math |
| `#.N\|..\|` | talgrynnu | `#!N\|..\|` | torri |
| `#,\|..\|` | fformat atalnod | `#^\|..\|` | gwyddonol |
| `#d0d9#` | newid modd rhifol | `#09#` | ailosod i ASCII |
| `<\ ..\>` | gweithredu shell | `>\<` | dadleuon CLI |

## Hanes Fersiynau

### v0.0.3 — Systemau Rhifol Unicode & Gwelliannau LSP _(Ebrill 2026)_

- **Ychwanegwyd** 69 bloc digid Unicode gyda thocyn newid modd `#d0d9#`
- **Ychwanegwyd** Llythrennau boolean mewn unrhyw sgript — `#१` / `#०`, `#١` / `#٠`, ac ati
- **Ychwanegwyd** Digidau Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ychwanegwyd** Opcode VM `SetNumeralMode` — paredd llawn gyda'r tree-walker
- **Ychwanegwyd** Mae REPL yn parchu'r modd rhifol actif mewn atsain a dangos newidynnau
- **Newidiwyd** Mae allbwn `>>` booleans nawr yn cynnwys rhagddodiad `#` (`#0` / `#1`) ym mhob modd

### v0.0.2_01 — Ailenwi Gweithredwyr _(30 Mar 2026)_

- **Newidiwyd** `c|..|` → `#,|..|` ac `e|..|` → `#^|..|` — cyson â theulu rhagddodiaid `#`
- **Ychwanegwyd** Alias allforio: ailallforio aelodau modiwl dan enw gwahanol

### v0.0.2 — Ailddylunio API Casgliadau & Gosodwyr _(24 Mar 2026)_

- **Ychwanegwyd** Teulu gweithredwyr `$` unedig ar gyfer araeau a llinynau (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ychwanegwyd** Dadstrwythuro ar gyfer araeau, typlau a thyplau enwog
- **Ychwanegwyd** Mynegeion negyddol (`arr[-1]` = elfen olaf)
- **Ychwanegwyd** Gosodwyr brodorol — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Ychwanegwyd** Aseiniad cyfansawdd `^=`
- **Trwsiwyd** Achosion ymylol parser rhifyddeg; cywiriadau dogfennaeth

### v0.0.1 — Rhyddhad Cyhoeddus Cyntaf _(22 Mar 2026)_

- Dehonglydd tree-walker + VM cofrestr (`--vm`, ~4× cyflymach, ~95% paredd)
- Pob adeiladwaith craidd: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Nodwyr Unicode llawn, system fodiwlau, lambdas, caethiwedd, trin gwallau
- REPL, LSP, estyniad VS Code, fformatiwr (`zymbol fmt`)

---

*Zymbol-Lang — Symbolaidd. Cyffredinol. Annewidiol.*

> **Rhybudd:** Crëwyd a chyfieithwyd y ddogfennaeth hon gan ddeallusrwydd artiffisial (DA). Gwnaed pob ymdrech i sicrhau cywirdeb, ond gall rhai cyfieithiadau neu enghreifftiau gynnwys gwallau. Y cyfeiriad awdurdodol yw [manylebau Zymbol-Lang](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
