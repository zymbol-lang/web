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

arr[1] = 99               // shandura panzvimbo
arr = arr[1]$~ 99         // shandura zvitsva — inodzorera matanda matsva
```

> Vashandisi vose vekurongedza vanodzorera **matanda matsva**. Isa zvakare: `arr = arr$+ 4`.
> Hapana kuenzanisa — shandisa kuisa kaviri zvakasiyana.
> `$^+` / `$^-` inoronga **matanda eprimitive** (nhamba, mashoko). Kune matanda atupeli shandisa `$^` ne lambda.

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

```zymbol
// Yenzvimbo
nzvimbo = (10, 20)
>> nzvimbo[0] ¶    // → 10

// Ine zita
munhu = (zita: "Alice", makore: 25)
>> munhu.zita ¶    // → Alice
>> munhu[0] ¶      // → Alice (index inoshanda zvakare)

// Akadzika
pos = (x: 10, y: 20)
p = (pos: pos, zita: "mazizi")
>> p.pos.x ¶        // → 10
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
| `c\|..\|` | rongedza nekoma | `e\|..\|` | sainzi |
| `<\ ..\>` | shell exec | `>\<` | mhinduro dzeCLI |

---

*Zymbol-Lang — Isimbo. Inoshanda pasi pose. Isingazochinji.*

> **Zivo:** Bhuku iri rakagadzirwa uye rakashandurwa neMuchenjeri weKurongedza (AI).
> Zvose zvakaitwa kuti rume chokwadi, asi shanduro dzimwe kana mienzaniso inogona kuva neminamato.
> Zano rechokwadi nde [zvirevo zveZymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
