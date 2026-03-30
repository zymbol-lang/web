# Zymbol-Lang — nêhiyawêwin Kîskinahamâkêwin (SRO)

**Zymbol-Lang** pêyak kîskinahamâkêwin pîkiskwêwin masinahikanis ôma — namôya kîkway âpacihiwêwin, masinahikanis piko. Kâ-pêyakwan ispayiw cîki ôma nêhiyaw-pîkiskwêwin.

- Namôya âpacihiwêwina (`if`, `while`, `return` namôya âpatisiw — masinahikanis piko `?`, `@`, `<~`)
- Kahkiyaw Unicode — pîkiskwêwina kâ-isi-pîkiskwêt ispayiw, mîna emoji 👋
- Pîkiskwêwin-kâ-kî-osîhtâk — kîkway masinahikanis kâ-pêyakwan ispayiw kahkiyaw pîkiskwêwinihk

---

## Pîkiskwêwina mîna Namôya Pâstâhowak

```zymbol
kî = 10              // pîkiskwêwin (kâ-wîhtamâhk)
pâyi := 3.14159      // namôya pâstâhôw (pâstâhowêw kâ-mâyinikêhk)
isiyihkâsowin = "nêhiyaw"
kistêyi = #1         // tâpwêwin kistêyimôwin
👋 := "Tânisi"
```

```zymbol
kî = 10
kî += 5    // 15
kî -= 3    // 12
kî *= 2    // 24
kî /= 3    // 8
kî %= 3    // 2
kî ^= 2    // 4
kî++       // 5
kî--       // 4
```

---

## Kîkway Ôhi

| Kîkway             | Tipahikêwin         | Masinahikanis `#?` | Kiskêyihtamowin                         |
|--------------------|---------------------|--------------------|-----------------------------------------|
| Akihtâsona         | `42`, `-7`          | `###`              | 64-bit kâ-kî-ihtakok                    |
| Pîtosâyâwin        | `3.14`, `1.5e10`    | `##.`              | Kistêyimôwin pîkiskwêwin OK             |
| Masinahikanis      | `"tânisi"`          | `##"`              | Wîhtamâkêwin: `"Tânisi {isiyihkâsowin}"` |
| Pîkiskwêwin        | `'A'`               | `##'`              | Pêyak Unicode pîkiskwêwin               |
| Tâpwêwin           | `#1`, `#0`          | `##?`              | NAMÔYA akihtâsona 1 mîna 0              |
| Masinahikanisa     | `[1, 2, 3]`         | `##]`              | Kâ-pêyakwan kîkwaya                     |
| Tupêl              | `(aw, êk)`          | `##)`              | Kâ-isi-itahpitêhk                       |
| Wîhcikâtêw Tupêl  | `(kî: 1, nî: 2)`    | `##)`              | Wîhcikâtêw mîna akihtâsona âpacihâwin  |

---

## Nâtawihoht mîna Tâpakêw

```zymbol
>> "Tânisi" ¶                         // ¶ mîna \\ pihtwâwin masinahikanis
>> "a=" kî " b=" nî ¶                 // mihcêt kîkwaya mâmawi
>> (masinahikana$#) ¶                  // postfix-masinahikanis wâwis ( ) kihci

<< isiyihkâsowin                       // namôya kakwêcihkêmôwin — isinâkwahk pîkiskwêwin
<< "Kîkisêpâ kiyawâw? " isiyihkâsowin // kakwêcihkêmôwin kâ-wîhtamihk
```

> `¶` mîna `\\` kâ-pêyakwan — pihtwâwin masinahikanis.

---

## Mamihcimâtisiwinisa

```zymbol
// Akihtâsona
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (akihtâson sipihkêwin)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (kâ-ispayik)

// Kâ-nanatohkamihk
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Tâpwêwin
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Masinahikana

```zymbol
// Nistam kâ-isi-itôtahk — tânisi kâ-itôtamihk
isiyihkâsowin = "nêhiyaw"
akihtâson = 25

wîhtamôwin = "Tânisi ", isiyihkâsowin, "!"       // kâ-kîskwêpayik — = mîna :=
>> "Tânisi " isiyihkâsowin " kiyawâw " akihtâson ¶  // mâmawi >> kâ-nâtawihohtihk
kiskinotahwâwin = "Tânisi {isiyihkâsowin}, kiyawâw {akihtâson}"  // wîhtamôwin
```

```zymbol
s = "Tânisi nêhiyaw"
len = s$#                  // 14
sub = s$[0..6]             // "Tânisi"  (ke tìran)
has = s$? "nêhiyaw"        // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["â":"Â"]        // "TÂnisi nÊhiyaw"
rep1 = s$~~["â":"Â":1]     // "TÂnisi nêhiyaw"  (pêyak piko)
```

> **Kiskêyihtamowin**: `+` akihtâsona piko. Masinahikanis kâ-wîhtamihk — mayi-ispayiw.

---

## Kâ-Isi-Ispayik

```zymbol
kî = 7

? kî > 0 { >> "kihci-akihtâson" ¶ }

? kî > 100 {
    >> "mistahi kihci" ¶
} _? kî > 0 {
    >> "kihci-akihtâson" ¶
} _? kî == 0 {
    >> "sôskwâc" ¶
} _ {
    >> "namôya kihci" ¶
}
```

Mihkwâhpitêwina `{ }` **kihci-itôtamihk** — mâka pêyak masinahikanis.

---

## Kâ-Kîspihtahk (Match)

```zymbol
// Kâ-kîspihtahk kâ-isi-akihtâhk
tipahikêwin = 85
wîhtamôwin = ?? tipahikêwin {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> wîhtamôwin ¶    // → B

// Kâ-kîspihtahk masinahikanis
wâpikiwan = "mihko"
kîsikâw = ?? wâpikiwan {
    "mihko"    : "#FF0000"
    "askihtaw" : "#00FF00"
    _          : "#000000"
}

// Kâ-kîspihtahk kâ-isi-kâkîsimihk (guards)
kisikâw = -5
ispayiwin = ?? kisikâw {
    _? kisikâw < 0  : "Kôna"
    _? kisikâw < 20 : "kîspin"
    _? kisikâw < 35 : "kîsikâw"
    _               : "kisikâw-mihkwâw"
}
>> ispayiwin ¶    // → Kôna

// Kâ-kîspihtahk mihkwâhpitêwin (block arms)
?? n {
    0       : { >> "sôskwâc" ¶ }
    _? n < 0: { >> "namôya kihci" ¶ }
    _       : { >> "kihci-akihtâson" ¶ }
}
```

---

## Kâ-Ispayik

```zymbol
@ ê:0..4  { >> ê " " }        // 0 1 2 3 4  — inclusive
@ ê:1..9:2 { >> ê " " }       // step:  1 3 5 7 9
@ ê:5..0:1 { >> ê " " }       // kâ-kîwêhk: 5 4 3 2 1 0

nî = 1
@ nî <= 64 { nî *= 2 }
>> nî ¶                       // → 128  (while)

mînisa = ["pahkwêsikan", "maskêkominak", "sâsâkisiw"]
@ mî:mînisa { >> mî ¶ }

@ sê:"tânisi" { >> sê "-" }
>> ¶                          // → t-â-n-i-s-i-

@ ê:1..10 {
    ? ê % 2 == 0 { @> }       // @> kâ-kîwêhk
    ? ê > 7 { @! }             // @! kâ-nîpâhahk
    >> ê " "
}
>> ¶                          // → 1 3 5 7

// Namôya kâ-kîsistahk
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

## Âpacihiwêwina

```zymbol
mâmawihoht(kî, nî) { <~ kî + nî }
>> mâmawihoht(3, 4) ¶    // → 7

akihtâsonâpacihikêwin(nî) {
    ? nî <= 1 { <~ 1 }
    <~ nî * akihtâsonâpacihikêwin(nî - 1)
}
>> akihtâsonâpacihikêwin(5) ¶    // → 120
```

Âpacihiwêwina **isolated scope** — namôya kîkway pîtos nâtawihohtêwin. Output `<~`:

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

> **Kistêyimôwin**: Wîhcikâtêwa âpacihiwêwina `isiyihkâsowin(akihtâsona){ }` namôya pêyak kîkway.
> Kâ-pimipayihcikêhk: `kî -> isiyihkâsowin(kî)`.

---

## Lamda mîna Kâ-Kîwêhât

```zymbol
pêyakosit = kî -> kî * 2
mâmawi = (kî, nî) -> kî + nî
>> pêyakosit(5) ¶    // → 10
>> mâmawi(3, 7) ¶    // → 10

// Lamda mihkwâhpitêwin
kistêyimôwin = kî -> {
    ? kî > 0 { <~ "kihci-akihtâson" }
    _? kî < 0 { <~ "namôya kihci" }
    <~ "sôskwâc"
}

// Kâ-Kîwêhâtwak — lamda kâ-kî-wîhtamihk pîtos kîkwaya
tipahikêwin = 3
nistomâpacihikêwin = kî -> kî * tipahikêwin
>> nistomâpacihikêwin(7) ¶    // → 21

// Âpacihiwêwin kâ-osîhtâhk
osîhtâkê(nî) { <~ kî -> kî + nî }
mitahtêwkî = osîhtâkê(10)
>> mitahtêwkî(5) ¶    // → 15

// Lamda kîkwaya: masinahikanisihk
âpacihiwêwina = [kî -> kî+1, kî -> kî*2, kî -> kî*kî]
>> âpacihiwêwina[2](5) ¶    // → 25
```

---

## Masinahikanisa

```zymbol
masinahikana = [1, 2, 3, 4, 5]

masinahikana[0]          // 1 — âpacihâwin (sôskwâc akihtâson)
masinahikana[-1]         // 5 — ke akihtâson (tìpawm)
masinahikana$#           // 5 — tipahikêwin

masinahikana = masinahikana$+ 6            // append
masinahikana2 = masinahikana$+[2] 99       // insert at index 2
masinahikana3 = masinahikana$- 3           // remove first value
masinahikana4 = masinahikana$-- 3          // remove all
masinahikana5 = masinahikana$-[0]          // remove at index
masinahikana6 = masinahikana$-[1..3]       // remove range (ke tìran)

ayâwin = masinahikana$? 3            // #1 — contains
pos = masinahikana$?? 3              // [2] — all indices
kîskihwin = masinahikana$[0..3]      // [1,2,3] — slice (ke tìran)
sl2 = masinahikana$[0:3]             // [1,2,3] — count-based syntax

asc = masinahikana$^+               // sorted ascending  (primitives)
desc = masinahikana$^-              // sorted descending (primitives)

// Wîhcikâtêw tupêl — $^ mîna comparator lamda
db = [(isiyihkâsowin: "Carla", akihtâson: 28), (isiyihkâsowin: "Ana", akihtâson: 25)]
by_akihtâson = db$^ (a, b -> a.akihtâson < b.akihtâson)
>> by_akihtâson[0].isiyihkâsowin ¶     // → Ana

masinahikana[1] = 99              // update in-place
masinahikana = masinahikana[1]$~ 99   // functional update
```

> T'áá ałtso **pîtos masinahikanisa** — kîhtwâm wîhtamôwin: `masinahikana = masinahikana$+ 4`.
> Namôya kâ-mâmawi-pimipayihcikâtêk: niswaw wîhtamôwin kâ-isi-pimipayihcikâtêk.
> `$^+` / `$^-` — primitives. Wîhcikâtêw tupêl — `$^` mîna lamda.

```zymbol
// Nested masinahikanisa
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Sêhcipayiwin

```zymbol
// Masinahikanisa
masinahikana = [10, 20, 30, 40, 50]
[a, b, c] = masinahikana              // a=10  b=20  c=30
[first, *rest] = masinahikana         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]                 // _ namôya wîhtamôwin

// Positional tupêl
point = (100, 200)
(px, py) = point                      // px=100  py=200

// Wîhcikâtêw tupêl
iyinîw = (isiyihkâsowin: "Ana", akihtâson: 25, pîkiskwêwin: "nêhiyaw")
(isiyihkâsowin: n, akihtâson: a) = iyinîw   // n="Ana"  a=25
```

---

## Tupêl

```zymbol
// Positional
point = (10, 20)
>> point[0] ¶    // → 10

// Wîhcikâtêw tupêl
iyinîw = (isiyihkâsowin: "Alice", akihtâson: 25)
>> iyinîw.isiyihkâsowin ¶    // → Alice
>> iyinîw[0] ¶               // → Alice (akihtâson mîna âpacihiwêwin)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, label: "nêhiyaw")
>> p.pos.x ¶        // → 10
```

---

## Nîpawistamâkêwina

> HOF-masinahikanisa **lamda kâ-pimipayihcikâtêk** kihci — namôya lamda-pîkiskwêwin kiyâpic.

```zymbol
akihtâsona = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

pêyakositwa = akihtâsona$> (kî -> kî * 2)                // map  → [2,4,6…20]
nisto = akihtâsona$| (kî -> kî % 2 == 0)                 // filter → [2,4,6,8,10]
mâmawi = akihtâsona$< (0, (mâmawi, kî) -> mâmawi + kî)  // reduce → 55

// Tatìng intermediates
step1 = akihtâsona$| (kî -> kî > 3)
step2 = step1$> (kî -> kî * kî)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named function bił lamda
double(kî) { <~ kî * 2 }
r = akihtâsona$> (kî -> double(kî))    // ✅
```

---

## Pipe Mamihcimâtisiwin

RHS t'áá ákót'é **`_`** placeholder mì piped kîkway:

```zymbol
double = kî -> kî * 2
add = (a, b) -> a + b
inc = kî -> kî + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Kâ-mâmawi-pimipayihcikâtêk
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kâ-Mâyipayik

```zymbol
!? {
    kî = 10 / 0
} :! ##Div {
    >> "Namôya akihtâson kâ-sipihkêhk" ¶
} :! {
    >> "pîtos kâ-mâyipayik: " _err ¶
} :> {
    >> "kahkiyaw ispayiw" ¶
}
```

| Kîkway        | Tânisîsi ispayiw                        |
|---------------|-----------------------------------------|
| `##Div`       | Namôya akihtâson kâ-sipihkêhk           |
| `##IO`        | Masinahikanis / kâ-ispayik              |
| `##Index`     | Akihtâsow pihci kâ-ispayik              |
| `##Type`      | Kîkway-kistêyimôwin kâ-mâyipayik        |
| `##Parse`     | Kâ-misinahamihk kâ-mâyipayik            |
| `##Network`   | Kâ-wâpahtamihk kâ-mâyipayik             |
| `##_`         | Kahkiyaw kâ-mâyipayik (catch-all)       |

---

## Masinahikan Ôhi

```zymbol
// Masinahikan: lib/mâmawihoht.zy
# mâmawihoht

#> { mâmawihoht, get_pâyi }    // Nâtawihoht NISTAM wîhtamôwinihk isi

_pâyi := 3.14159
mâmawihoht(kî, nî) { <~ kî + nî }
get_pâyi() { <~ _pâyi }
```

```zymbol
// Masinahikan: nistam.zy
<# ./lib/mâmawihoht <= sê    // Wîhcikâtêwin kihci

>> sê::mâmawihoht(5, 3) ¶  // → 8
pâyi = sê::get_pâyi()
>> pâyi ¶                    // → 3.14159
```

```zymbol
// Export bił pîtos isiyihkâsowin
# mylib
#> { _internal_add <= mâmawi }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::mâmawi(3, 4) ¶    // → 7
```

---

## Tipahamâkêwina

```zymbol
// Akihtâson kâ-osîhtâhk
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (namôya kâ-mâyipayik)

// Round / truncate
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncate)

// Akihtâson tìran
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

## Shell Mâmawêwin

```zymbol
date = <\ date +%Y-%m-%d \>     // stdout (tìran \n)
>> "Anohc: " date

file = "data.txt"
content = <\ cat {file} \>      // wîhtamôwin mì tìkan

output = </"./subscript.zy"/>   // Zymbol script, tâpakêw output
>> output
```

> `><` CLI arguments pîtos masinahikanisa (tree-walker piko).

---

## Mâmawôhkatôwin: FizzBuzz

```zymbol
mâmawihoht(akihtâson) {
    ? akihtâson % 15 == 0 { <~ "PapîwinWîwîhcikan" }
    _? akihtâson % 3  == 0 { <~ "Papîwin" }
    _? akihtâson % 5  == 0 { <~ "Wîwîhcikan" }
    _ { <~ akihtâson }
}

@ ê:1..20 { >> mâmawihoht(ê) ¶ }
```

---

## Masinahikanis Ôhci Kâ-Nâtawihoht

| Masinahikanis | Âpacihâwin          | Masinahikanis   | Âpacihâwin                  |
|---------------|---------------------|-----------------|------------------------------|
| `=`           | Pîkiskwêwin         | `$#`            | Tipahikêwin                  |
| `:=`          | Namôya Pâstâhôw     | `$+`            | Wîhtamôwin                   |
| `>>`          | Nâtawihoht          | `$+[i]`         | Insert at index               |
| `<<`          | Tâpakêw             | `$-`            | Remove first value            |
| `¶`/`\\`     | Pihtwâwin           | `$--`           | Remove all value              |
| `?`           | ? (if)              | `$-[i]`         | Remove at index               |
| `_?`          | _? (elif)           | `$-[i..j]`      | Remove range                  |
| `_`           | _ / kâ-pîkiskwêhk  | `$?`            | Kâ-itohtatihk                 |
| `??`          | match               | `$??`           | All indices                   |
| `@`           | Kâ-Ispayik          | `$[s..e]`       | Kîskihwin                     |
| `@!`          | @! (break)          | `$>`            | map                           |
| `@>`          | @> (continue)       | `$\|`           | filter                        |
| `->`          | lamda               | `$<`            | reduce                        |
| `$^+`         | Sort ascending      | `$^-`           | Sort descending               |
| `$^`          | Sort lamda          |                 |                               |
| `<~`          | Kîhtwâm (return)    | `!?`            | kâ-kîskinotahwâhk (try)       |
| `\|>`        | Pipe                | `:!`            | kâ-kîsihtâhk (catch)          |
| `#1`          | tâpwêwin            | `:>`            | kahkiyaw (finally)            |
| `#0`          | namôya tâpwêwin     | `$!`            | kâ-mâyipayik                  |
| `<#`          | Pê-isi-nâtawihoht   | `$!!`           | kâ-wîhtamihk mâyipayiwin      |
| `#`           | Masinahikan wîhtamôwin | `#>`         | Nâtawihoht                    |
| `::`          | Masinahikan âpacihâwin | `.`          | Field access                  |
| `#\|..\|`    | Parse number        | `#?`            | Type metadata                 |
| `#.N\|..\|`  | Round               | `#!N\|..\|`     | Truncate                      |
| `c\|..\|`    | Comma format        | `e\|..\|`       | Scientific                    |
| `<\ ..\>`    | Shell exec          | `>\<`           | CLI args                      |

---

*Zymbol-Lang — Masinahikanis. Pêyak. Namôya Pâstâhôw.*

> **Kiskêyihtamowin:** Ôma masinahikanis kistêyimôwin-âpacihikêwin (AI) kâ-osîhtâhk mîna kâ-pîkiskwêwihcikêhk. Pîkiskwêwina itwêwina (altlab.ualberta.ca) kâ-nâtawihohtamihk — Wolvengrey mîna Maskwacîs masinahikana.
> Kahkiyaw kâ-isi-itôtamihk mâka mâskôc pîtos pîkiskwêwina mîna tipahikêwina mâyitôtamwak.
> Nistam âpacihâwin: [Zymbol-Lang kîskinahamâkêwin](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
