# Bhuku Pfupi reZymbol-Lang

**Zymbol-Lang** mutauro wekurongedza unoshanda nesimbo. Haashandisi mazwi ekutanga — zvose isimbo. Inoshanda nenzira imwe chete mumutauro wose wemunhu.

- Hapana mazwi ekutanga (`if`, `while`, `return` haagarepo — simbo chete `?`, `@`, `<~`)
- Unicode yakakwana — mazita emutauro wose kana emoji 👋
- Inoshanda mumutauro wose — code inofanana mumitauro yose

---

## Zvinochinja neZvisingazochinji

```zymbol
x = 10              // chinochinja (chinogona kushandurwa)
PI := 3.14159       // chisingazochinji — kuisa zvakare kuchakanganisa
zita = "Ana"
chokwadi = #1       // boolean yechokwadi
👋 := "Mhoro"
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

## Mhando dzeZvakachengeterwa

| Mhando         | Muenzaniso          | Simbo `#?` | Mazwi                               |
|----------------|---------------------|------------|-------------------------------------|
| Nhamba yese    | `42`, `-7`          | `###`      | 64-bit ine chiratidzo               |
| Nhamba pfupisi | `3.14`, `1.5e10`    | `##.`      | Nyorwa yesainzi inoshanda           |
| Shoko          | `"mhoro"`           | `##"`      | Kuisa: `"Mhoro {zita}"`            |
| Bvuma          | `'A'`               | `##'`      | Bvuma imwe yeUnicode                |
| Boolean        | `#1`, `#0`          | `##?`      | HAISI nhamba 1 kana 0               |
| Matanda        | `[1, 2, 3]`         | `##]`      | Zvose zvemhando imwe                |
| Tupeli         | `(a, b)`            | `##)`      | Yenzvimbo                           |
| Tupeli ine zita| `(x: 1, y: 2)`      | `##)`      | Kuwana nezita kana nenhamba         |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Kuratidza nekuPinda

```zymbol
>> "Mhoro" ¶                      // ¶ kana \\ inopa mutsara witsva
>> "a=" a " b=" b ¶               // mimiririro inoverengeka pamwe chete
>> (arr$#) ¶                      // simbo dzinotevera dzinoda makurigu

<< zita                           // pasina chiratidzo — inoverengera mune chinochinja
<< "Zita rako? " zita             // ine chiratidzo
```

> `¶` (AltGr+R) ne `\\` zvakaenzana somunyorwa wetsva.

---

## Vashandisi

```zymbol
// Nhamba — shandisa kuisa; vashandisi vamwe vane maererano akachinja mu >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (kugoverwa kwenhamba)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (kudzika)

// Kuenzanisa
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logic
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Vhurungwa

```zymbol
// Nzira nhatu dzekubatanidza
zita = "Ana"
n = 42

msg = "Mhoro ", zita, "!"                // koma — mukuisa
>> "Mhoro " zita " une " n ¶             // kuisa pamwe — mukuratidza >>
tsananguro = "Mhoro {zita}, une {n}"     // kuisa mukati — munzvimbo yose
```

```zymbol
s = "Mhoro Nyika"
hurefu = s$#                  // 10
chikamu = s$[0..5]             // "Mhoro"  (magumo haagari)
kune = s$? "Nyika"             // #1
zvikamu = "a,b,c,d" / ','      // [a, b, c, d]
tsiva = s$~~["o":"O"]          // "MhOrO Nyika"
tsiva1 = s$~~["o":"O":1]       // "MhOrO Nyika" (yekutanga N chete)
```

> `+` inoshanda nhamba chete. Shandisa `,`, kuisa pamwe, kana kuisa mukati neshoko.

---

## Kutungamira Kwekufamba

```zymbol
x = 7

? x > 0 { >> "nyamupfihwa" ¶ }

? x > 100 {
    >> "kukura" ¶
} _? x > 0 {
    >> "nyamupfihwa" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "nhamba isina pfihwa" ¶
}
```

> Mabhokisi `{ }` **anodikanwa**, kunyangwe mutsara umwe chete.

---

## Match

```zymbol
// Nzvimbo
nhamba = 85
chiratidzo = ?? nhamba {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> chiratidzo ¶    // → B

// Mashoko
ruvara = "tsvuku"
code = ?? ruvara {
    "tsvuku"  : "#FF0000"
    "girini"  : "#00FF00"
    _         : "#000000"
}

// Vhareti
tembiricha = -5
mamiriro = ?? tembiricha {
    _? tembiricha < 0  : "chando"
    _? tembiricha < 20 : "chibvumirano"
    _? tembiricha < 35 : "kupisa"
    _                  : "kupisa kwazvo"
}
>> mamiriro ¶    // → chando

// Chimiro chenyanduri (mabhokisi emapato)
?? n {
    0       : { >> "zero" ¶ }
    _? n < 0: { >> "nhamba isina pfihwa" ¶ }
    _       : { >> "nyamupfihwa" ¶ }
}
```

---

## Kudzokera

```zymbol
@ i:0..4  { >> i " " }        // nzvimbo inokhomba: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ine danho: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // dzokudzoka: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

michero = ["Apuro", "Mango", "Hrozeni"]
@ chichero:michero { >> chichero ¶ }

@ c:"mhoro" { >> c "-" }
>> ¶                          // → m-h-o-r-o-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> ramba
    ? i > 7 { @! }             // @! mira
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Tenderera risina magumo
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Tenderera rine zita (kumira kwakadzika)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Mabasa

```zymbol
kuchera(a, b) { <~ a + b }
>> kuchera(3, 4) ¶    // → 7

factorial(nhamba) {
    ? nhamba <= 1 { <~ 1 }
    <~ nhamba * factorial(nhamba - 1)
}
>> factorial(5) ¶    // → 120
```

Mabasa ane **nzvimbo yakasiyanasiyana** — haagone kuwana zviri kunze. Shandisa `<~` kuti ushandure chinochinja chemumhan'a:

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

> Mabasa ane zita haasi zvakachengeterwa zvekutanga. Kupfuudza semutsigiri: `x -> zita(x)`.

---

## Lambda neBatanidzo

```zymbol
kaviri = x -> x * 2
muripo = (a, b) -> a + b
>> kaviri(5) ¶    // → 10
>> muripo(3, 7) ¶   // → 10

// Lambda ine bhokisi
rongedza = x -> {
    ? x > 0 { <~ "nyamupfihwa" }
    _? x < 0 { <~ "nhamba isina pfihwa" }
    <~ "zero"
}

// Kubata — Lambda inotora zviri kunze
mhando = 3
katatu = x -> x * mhando
>> katatu(7) ¶    // → 21

// Fekitori yebasa
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Mumatanda
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Matanda

Matanda **anogona kushandurwa** uye anochengeta zvinhu zvemhando **imwe chete** chete.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — kuwana (0-based)
arr[-1]         // 5 — index yekupedzisira
arr$#           // 5 — hurefu (shandisa (arr$#) mu >>)

arr = arr$+ 6            // kuwedzera → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // kuisa pa index 2
arr3 = arr$- 3           // kubvisa kuratidzwa kwekutanga
arr4 = arr$-- 3          // kubvisa zvose zvakafanana
arr5 = arr$-[0]          // kubvisa pa index
arr6 = arr$-[1..3]       // kubvisa nzvimbo (magumo haagari)

kune = arr$? 3            // #1 — kuva nacho
nzvimbo = arr$?? 3        // [2] — index dzose
chikamu = arr$[0..3]      // [1,2,3] — chikamu (magumo haagari)
chikamu2 = arr$[0:3]      // [1,2,3] — nzira yenhamba

kukwira = arr$^+          // kuronga kukwira (primitive chete)
kudzika = arr$^-          // kuronga kudzika (primitive chete)

// Matanda ane mazita/nzvimbo — shandisa $^ ne lambda
db = [(zita: "Carla", makore: 28), (zita: "Ana", makore: 25), (zita: "Bob", makore: 30)]
nemakore  = db$^ (a, b -> a.makore < b.makore)
nezita = db$^ (a, b -> a.zita > b.zita)
>> nemakore[0].zita ¶     // → Ana
>> nezita[0].zita ¶       // → Carla

// Shandura chinhu chimwe chete panzvimbo (matanda chete)
arr[1] = 99
arr[0] += 5               // inoshanda zvakare: +=  -=  *=  /=  %=  ^=
// Shanduro inoita basa — inodzorera matanda matsva; original haichinjwi
arr2 = arr[1]$~ 99
```

> Vashandisi vose vekurongedza vanodzorera **matanda matsva**. Isa zvakare: `arr = arr$+ 4`.
> Hapana kuenzanisa — shandisa kuisa kaviri zvakasiyana.
> `$^+` / `$^-` inoronga **matanda eprimitive** (nhamba, mashoko). Kune matanda atupeli shandisa `$^` ne lambda.

**Pfungwa yemoyo** — kuisa matanda kune chinja maviri kunoita mipanda miviri yakasiyana:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b haichinjwi
```

```zymbol
// Matanda akadzika
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Kuparadzanisa

```zymbol
// Matanda
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[kutanga, *zvimwe] = arr     // kutanga=10  zvimwe=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ inoramba

// Tupeli yenzvimbo
nzvimbo = (100, 200)
(px, py) = nzvimbo           // px=100  py=200

// Tupeli ine zita
munhu = (zita: "Ana", makore: 25, guta: "Harare")
(zita: z, makore: m) = munhu  // z="Ana"  m=25
```

---

## Tupeli

Tupeli ndiwo mabhokisi **asingachinjwi** anochengeta zvinhu **zvemhando dzakasiyana**.

```zymbol
// Yenzvimbo
nzvimbo = (10, 20)
>> nzvimbo[0] ¶    // → 10
datha = (42, "mhoro", #1, 3.14)
>> datha[2] ¶     // → #1

// Ine zita
munhu = (zita: "Alice", makore: 25)
>> munhu.zita ¶    // → Alice
>> munhu[0] ¶      // → Alice (index inoshanda zvakare)

// Akadzika
pos = (x: 10, y: 20)
p = (pos: pos, zita: "mazizi")
>> p.pos.x ¶        // → 10
```

**Haingachinjwi** — tupeli haingachinjwi; vashandisi vakadziviswa:

```zymbol
t = (10, 20, 30)
// t[0] = 99      // ❌ Kukanganisa: tupeli haingachinjwi
// t[0] += 5      // ❌ Kukanganisa: tupeli haingachinjwi
```

Gadzira kopi itsva ne `$~`:

```zymbol
t = (10, 20, 30)
t2 = t[0]$~ 99    // → (99, 20, 30)  — t haichinjwi

// Tupeli ine zita — gadzira kopi ne kushandura nhengo
munhu_mukuru = (zita: munhu.zita, makore: 26)
```

---

## Mabasa epamusoro

> Vashandisi veHOF vanoda **lambda yakanyorwa mukati** — haashandisi chinochinja chelambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kaviri    = nums$> (x -> x * 2)                // map  → [2,4,6…20]
nhamba_dzakadzika = nums$| (x -> x % 2 == 0)   // filter → [2,4,6,8,10]
muripo    = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Kuenzanisa kuburikidza nekuisa kaviri
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Mabasa ane zita mune HOF — pfenesa mulambda
kaviriF(x) { <~ x * 2 }
r = nums$> (x -> kaviriF(x))    // ✅
```

---

## Mushandisi wePombi

RHS inoda `_` semutoveri wenzvimbo:

```zymbol
kaviri = x -> x * 2
kuwedzera = (a, b) -> a + b
kuwedzera1 = x -> x + 1

5 |> kaviri(_)        // → 10
10 |> kuwedzera(_, 5) // → 15
5 |> kuwedzera(2, _)  // → 7

// Kusunganidzwa
r = 5 |> kaviri(_) |> kuwedzera1(_) |> kaviri(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kugadzirisa Zvakaipa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Kupatsanura nezero" ¶
} :! {
    >> "dambudziko rimwe: " _err ¶    // _err ine shoko renyaya
} :> {
    >> "inogara ichiita" ¶
}
```

| Mhando      | Rinobuda rinhi                    |
|-------------|-----------------------------------|
| `##Div`     | Kupatsanura nezero                |
| `##IO`      | Faira / Sistema                   |
| `##Index`   | Index iri kunze kwenzvimbo        |
| `##Type`    | Dambudziko remhando               |
| `##Parse`   | Dambudziko rekuongorora           |
| `##Network` | Dambudziko reNetworki             |
| `##_`       | Dambudziko ripi neripi (catch-all)|

---

## Mamodhuru

```zymbol
// lib/calc.zy
# calc

#> { kuchera, get_PI }    // Kutumira PAMBERI petsananguro

_PI := 3.14159
kuchera(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // Zita rakadikanwa

>> c::kuchera(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Kutumira nezita rakasiyana
# mylib
#> { _internal_add <= muripo }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::muripo(3, 4) ¶    // → 7  (zita rekumukati _internal_add rakavanzwa)
```

---

## Maitiro Enhamba

Zymbol inogona kuratidza nhamba mu**Unicode nhamba nyaya 69** — Devanagari, Arabic-India, Thai, Klingon pIqaD, Mathematics Yakasimba, LCD uye zvimwe. Maitiro anoshanda anobata chete kubuda `>>`; nhamba yemukati inogara iri binary.

### Kuvhura nyaya

Nyora nhamba `0` na `9` yenyaya yakadiwa mukati mwa `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic  (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Kubuda uye zvikara zvechokwadi

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Zvikara zvechokwadi: # pamberi inogara iri ASCII, nhamba inochinja
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Nhamba dzinosakara musosi

Nhamba dzeimwe nyaya ipi zvayo inobatsirwa zvikara zvakanaka — munzvimbo, modulo, kuenzanisa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Zvikara zvechokwadi munyaya ipi zvayo

`#` + nhamba `0` kana `1` kubva pabloko ipi zvayo chikara chechokwadi chakanaka:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` inogara iri **ASCII**. `#0` (nhema) inogara ichisiyana pameso na `0` (nhamba zero) munyaya ipi zvayo.

---

## Vashandisi veData

```zymbol
// Shandura shoko kunge nhamba
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (haikanganisi)

// Kudzosera / kupaza
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (dzosera kusvika nhamba 2 dzichidzika)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (paza)

// Rongedza nhamba
fmt = #,|1234567|      // → 1,234,567  (ine koma)
sci = #^|12345.678|    // → 1.2345678e4  (sainzi)

// Zvakanyorwa zvebhesi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Kushandura bhesi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Kubatanidza Shell

```zymbol
zuva = <\ date +%Y-%m-%d \>     // kutora stdout (inosanganisira \n yekupedzisira)
>> "Nhasi: " zuva

faira = "data.txt"
zviri = <\ cat {faira} \>       // kuisa mukati mumirayiridzo

output = </"./subscript.zy"/>   // kuita script iri Zymbol, kutora output
>> output
```

> `><` inotora mhinduro dze CLI semutsara wematanda (tree-walker chete).

---

## Muenzaniso Wakakwana: FizzBuzz

```zymbol
kuchera(nhamba) {
    ? nhamba % 15 == 0 { <~ "FizzBuzz" }
    _? nhamba % 3  == 0 { <~ "Fizz" }
    _? nhamba % 5  == 0 { <~ "Buzz" }
    _ { <~ nhamba }
}

@ i:1..20 { >> kuchera(i) ¶ }
```

---

## Ongorora Zvisimbiso

| Simbo   | Basa               | Simbo      | Basa                  |
|---------|--------------------|------------|-----------------------|
| `=` | chinochinja | `$#` | hurefu |
| `:=` | chisingazochinji | `$+` | kuwedzera |
| `>>` | kuratidza | `$+[i]` | kuisa pa index |
| `<<` | kupinda | `$-` | kubvisa yekutanga nenzvimbo |
| `¶` / `\\` | mutsara witsva | `$--` | kubvisa zvose nenzvimbo |
| `?` | kana (if) | `$-[i]` | kubvisa pa index |
| `_?` | kana zvakare (elif) | `$-[i..j]` | kubvisa nzvimbo |
| `_` | zvimwe / nzvimbo | `$?` | kuva nacho |
| `??` | match | `$??` | tsvaga index dzose |
| `@` | tenderera (loop) | `$[s..e]` | chikamu |
| `@!` | mira (break) | `$>` | map |
| `@>` | ramba (continue) | `$\|` | filter |
| `->` | Lambda | `$<` | reduce |
| `$^+` | kuronga kukwira (primitive) | `$^-` | kuronga kudzika (primitive) |
| `$^` | kuronga ne comparator (tupeli) | | |
| `<~` | dzokera (return) | `!?` | edza (try) |
| `\|>` | Pipe | `:!` | bata (catch) |
| `#1` | chokwadi | `:>` | nguva yose (finally) |
| `#0` | nhema | `$!` | iri kukanganisa |
| `<#` | isa (import) | `$!!` | pindura kanganiso |
| `#` | tsanangura modhuru | `#>` | tumira (export) |
| `::` | kushandisa modhuru | `.` | kuwana nzira |
| `#\|..\|` | shandura nhamba | `#?` | metadata yemhando |
| `#.N\|..\|` | dzosera | `#!N\|..\|` | paza |
| `#,\|..\|` | rongedza nekoma | `#^\|..\|` | sainzi |
| `#d0d9#` | kushandura maitiro enhamba | `#09#` | dzosera ku ASCII |
| `<\ ..\>` | shell exec | `>\<` | mhinduro dzeCLI |

## Nhoroondo yeVhezheni

### v0.0.3 — Unicode Nhamba Dzinosakara & Kugadziriswa kwe LSP _(Kubvumbi 2026)_

- **Yakawedzerwa** Unicode bloko 69 dzeznhamba nemwoto wokushandura maitiro `#d0d9#`
- **Yakawedzerwa** Zvikara zvechokwadi munyaya ipi zvayo — `#१` / `#०`, `#١` / `#٠`, nzvimbo
- **Yakawedzerwa** Klingon pIqaD nhamba (CSUR PUA U+F8F0–U+F8F9)
- **Yakawedzerwa** VM opcode `SetNumeralMode` — kuenzana kwakakwana na tree-walker
- **Yakawedzerwa** REPL inoremekedza maitiro enhamba ari kushanda mu echo nekuratidza variable
- **Yakachinjwa** Kubuda `>>` kwezvinhu zvechokwadi kwava nako `#` pamberi (`#0` / `#1`) mumaitiro ose

### v0.0.2_01 — Kushandura Mazita eVashandisi _(30 Mar 2026)_

- **Yakachinjwa** `c|..|` → `#,|..|` uye `e|..|` → `#^|..|` — yakanaka nefamira ya `#`
- **Yakawedzerwa** Alias yokutumira: kutumira zvakare nhengo dzemodule nezita rakasiyana

### v0.0.2 — Kurongedza API yeZviunganidzwa & Mainstaller _(24 Mar 2026)_

- **Yakawedzerwa** Famira yevashandisi `$` yakabatana maarays nestrings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yakawedzerwa** Destructuring maarays, tuples netuples ane mazita
- **Yakawedzerwa** Nhamba dzakaderera (`arr[-1]` = chinhu chekupedzisira)
- **Yakawedzerwa** Mainstaller ekuno — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Yakawedzerwa** Kukumikidza kwakabatana `^=`
- **Yakagadziriswa** Nyaya dzemuganhu dzeparser; kugadziriswa kwemabhuku

### v0.0.1 — Kubudiswa Kwokutanga Pachena _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× kumhanya, ~95% kuenzana)
- Zvimbo zvose zvikuru: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode mazita akakwana, system yemodule, lambda, kubata, kurongera zvikanganiso
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Isimbo. Inoshanda pasi pose. Isingazochinji.*

> **Zivo:** Bhuku iri rakagadzirwa uye rakashandurwa neMuchenjeri weKurongedza (AI).
> Zvose zvakaitwa kuti rume chokwadi, asi shanduro dzimwe kana mienzaniso inogona kuva neminamato.
> Zano rechokwadi nde [zvirevo zveZymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
