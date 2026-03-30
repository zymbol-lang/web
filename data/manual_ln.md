# Zymbol-Lang Mokanda ya Mokuse

**Zymbol-Lang** ezali monkɔtɔ ya programasio ya bilembo. Esalelaka te maloba ya mboto — nyonso ezali lilembo. Esalaka ndenge moko na monkɔtɔ nyonso ya bato.

- Maloba ya mboto te (`if`, `while`, `return` ezalaka te — bilembo kaka `?`, `@`, `<~`)
- Unicode ya mobimba — bakombo na monkɔtɔ nyonso to emoji 👋
- Ebotamaki te na monkɔtɔ moko — code ezali ndenge moko na minɔkɔ nyonso

---

## Bintoko mpe Biloko Ezangi Kobongwana

```zymbol
x = 10              // bintoko (ekoki kobongwana)
PI := 3.14159       // biloko ezangi kobongwana (ekoki te kobongwana — ekolela soki obongwani)
nkombo = "Ana"
solo = #1           // solo ya booléen
👋 := "Mbote"
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

## Mitindo ya Makambo

| Motindo          | Ndakisa             | Lilembo `#?` | Makombo                              |
|------------------|---------------------|--------------|--------------------------------------|
| Motango mobimba  | `42`, `-7`          | `###`        | Bit 64 na elembo                     |
| Motango ya koma  | `3.14`, `1.5e10`    | `##.`        | Notation ya kisayansi ekatanaka      |
| Nsango           | `"mbote"`           | `##"`        | Interpolasio: `"Mbote {nkombo}"`     |
| Mokanda           | `'A'`               | `##'`        | Mokanda moko ya Unicode              |
| Solo ya booléen  | `#1`, `#0`          | `##?`        | Ezali te motango 1 to 0              |
| Mitanda          | `[1, 2, 3]`         | `##]`        | Biloko nyonso ya motindo moko        |
| Tupeli           | `(a, b)`            | `##)`        | Na esika                             |
| Tupeli na nkombo | `(x: 1, y: 2)`      | `##)`        | Kokɔta na nkombo to index            |

```zymbol
// Kotala motindo — ezongisaka (motindo, nambolo, motuya)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Koloba mpe Kozwa

```zymbol
>> "Mbote" ¶                       // ¶ to \\ epesi motindo ya mpe
>> "a=" a " b=" b ¶                // bintoko mingi na esika moko
>> (arr$#) ¶                       // binto ya nsuka esengeli parenthèse

<< nkombo                          // kozwa nzela — tia na bintoko
<< "Nkombo na yo? " nkombo         // na mibeko ya kozwa
```

> `¶` (AltGr+R clavier espagnol) to `\\` ezali ndenge moko lokola motindo ya mpe.

---

## Bato ya misala

```zymbol
// Barithmétique — salelaka na kotya; mosusu mpe ekokela na >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (bokaboli ya motango mobimba)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (pɔwɛrɛ)

// Kotala
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Boyebeli
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Nsinga

```zymbol
// Ndenge misato ya malamu — mokomoko na ntina na ye
nkombo = "Ana"
motango = 42

msg = "Mbote ", nkombo, "!"                    // virgule — na kotya na = to :=
>> "Mbote " nkombo " ozali " motango ¶         // esika moko — na koloba >>
bosembo = "Mbote {nkombo}, ozali {motango}"    // interpolasio — na ntina nyonso
```

```zymbol
s = "Mbote Bato"
molai = s$#                  // 10
tiolo = s$[0..5]             // "Mbote"  (nsuka ekatanaka)
azali = s$? "Bato"           // #1
bintoko = "a,b,c,d" / ','    // [a, b, c, d]
bobongwani = s$~~["o":"O"]   // kobongola nyonso
bobong1 = s$~~["o":"O":1]    // kobongola ya liboso kaka
```

> `+` ezali kaka mpo na baminotango. Na mibeko, salelaka virgule, esika moko, to interpolasio.

---

## Kotambola ya Mosala

```zymbol
x = 7

? x > 0 { >> "ya likolo" ¶ }

? x > 100 {
    >> "monene" ¶
} _? x > 0 {
    >> "ya likolo" ¶
} _? x == 0 {
    >> "zéro" ¶
} _ {
    >> "ya nse" ¶
}
```

> Bilembo `{ }` **esengeli**, ata mpo na mwa mpe moko.

---

## Match

```zymbol
// Ntalo ya ntango
motango = 85
ndango = ?? motango {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ndango ¶    // → B

// Mibeko
lango = "motane"
code = ?? lango {
    "motane"  : "#FF0000"
    "ya pɛpɛ" : "#00FF00"
    _         : "#000000"
}

// Bayard
temp = -5
etat = ?? temp {
    _? temp < 0  : "Nzoto ya mayi"
    _? temp < 20 : "mpio"
    _? temp < 35 : "moto ndeke"
    _            : "moto mingi"
}
>> etat ¶    // → Nzoto ya mayi

// Ndakisa ya block
?? n {
    0       : { >> "zéro" ¶ }
    _? n < 0: { >> "ya nse" ¶ }
    _       : { >> "ya likolo" ¶ }
}
```

---

## Koluka Mbala Mingi

```zymbol
@ i:0..4  { >> i " " }        // ntalo: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // na etinda: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ya liboso: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (tango)

mbuma = ["pasiflore", "mangele", "nzala"]
@ f:mbuma { >> f ¶ }          // na biloko nyonso

@ c:"mbote" { >> c "-" }
>> ¶                          // → m-b-o-t-e-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tɔlɔlɔ
    ? i > 7 { @! }             // @! simba
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Koluka ya libela
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Koluka na nkombo (simba ya kati)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Misala

```zymbol
kotanga(a, b) { <~ a + b }
>> kotanga(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Misala ezali na esika ya bango moko — ekoki te kokɔta na bintoko ya libanda. Salelaka bintoko ya kobimi `<~` mpo na kobongisa:

```zymbol
kobongola(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
kobongola(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Misala ya nkombo ezali te biloko ya liboso. Mpo na kopesa lokola eloko: `x -> misala(x)`.

---

## Lambda mpe Bozali

```zymbol
mbala_mibale = x -> x * 2
lisangisi = (a, b) -> a + b
>> mbala_mibale(5) ¶    // → 10
>> lisangisi(3, 7) ¶    // → 10

// Lambda na block
kopesa_ndango = x -> {
    ? x > 0 { <~ "ya likolo" }
    _? x < 0 { <~ "ya nse" }
    <~ "zéro"
}

// Bozali — lambda ekanga bintoko ya libanda
factor = 3
mbala_tatu = x -> x * factor
>> mbala_tatu(7) ¶    // → 21

// Fabrika ya misala
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda lokola biloko: ebatelama na mitanda
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Mitanda

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — kokɔta (index ya liboso = 0)
arr[-1]         // 5 — index ya nse (ya nsuka)
arr$#           // 5 — molai (salelaka (arr$#) na >>)

arr = arr$+ 6            // kobakisa → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // kotia na index 2
arr3 = arr$- 3           // kolongola ya liboso na motuya
arr4 = arr$-- 3          // kolongola nyonso na motuya
arr5 = arr$-[0]          // kolongola na index
arr6 = arr$-[1..3]       // kolongola ntalo (nsuka ekatanaka)

azali = arr$? 3          // #1 — azali na kati
bisika = arr$?? 3        // [2] — bisika nyonso na motuya
tiolo = arr$[0..3]       // [1,2,3] — tiolo (nsuka ekatanaka)
sl2 = arr$[0:3]          // [1,2,3] — kama-nambolo

asc = arr$^+             // kobeba na mokolo (biloko ya mboto kaka)
desc = arr$^-            // kobeba na nse (biloko ya mboto kaka)

// Tupeli na nkombo — salelaka $^ na lambda ya kotala
db = [(nkombo: "Karla", mibu: 28), (nkombo: "Ana", mibu: 25), (nkombo: "Buba", mibu: 30)]
mibu_kama  = db$^ (a, b -> a.mibu < b.mibu)      // kobeba na mibu (<)
nkombo_kama = db$^ (a, b -> a.nkombo > b.nkombo) // kobeba nse na nkombo (>)
>> mibu_kama[0].nkombo ¶     // → Ana
>> nkombo_kama[0].nkombo ¶   // → Karla

arr[1] = 99              // kobongisa na esika
arr = arr[1]$~ 99        // kobongisa ya mosala — ezongisaka mitanda mipe
```

> Bato nyonso ya kolekta ezongisaka **mitanda mipe**. Tya lisusu: `arr = arr$+ 4`.
> Kokatisa te — salelaka kotya mibale ya semba.
> `$^+` / `$^-` ebeba **mitanda ya mboto** (baminotango, mibeko). Mpo na tupeli salelaka `$^` na lambda ya kotala.

```zymbol
// Mitanda ya kati
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Kobikisa

```zymbol
// Mitanda
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[liboso, *misusu] = arr      // liboso=10  misusu=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ekatisa nkombo

// Tupeli ya esika
esika = (100, 200)
(px, py) = esika             // px=100  py=200

// Tupeli na nkombo
moto = (nkombo: "Ana", mibu: 25, mboka: "Kinshasa")
(nkombo: n, mibu: a) = moto  // n="Ana"  a=25
```

---

## Tupeli

```zymbol
// Ya esika
esika = (10, 20)
>> esika[0] ¶    // → 10

// Na nkombo
moto = (nkombo: "Alice", mibu: 25)
>> moto.nkombo ¶    // → Alice
>> moto[0] ¶        // → Alice  (index esalaka mpe)

// Ya kati
bɔkɔ = (x: 10, y: 20)
p = (bɔkɔ: bɔkɔ, etikɛtɛ: "ebandeli")
>> p.bɔkɔ.x ¶      // → 10
```

---

## Misala ya Nkoto

> Binto ya HOF esengeli **lambda ya kati** — te bintoko ya lambda ya semba.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

mbala_mibale = nums$> (x -> x * 2)                // map  → [2,4,6…20]
ya_mibale    = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
mobimba      = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Kokatisa na kotya
etape1 = nums$| (x -> x > 3)
etape2 = etape1$> (x -> x * x)
>> etape2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Misala ya nkombo na HOF — tia na lambda
mbala_mibale_fn(x) { <~ x * 2 }
r = nums$> (x -> mbala_mibale_fn(x))    // ✅
```

---

## Operatɛrɛ ya Tuyau

Baɗtorde kaa esengeli `_` lokola eloko ya nzela:

```zymbol
mbala_mibale = x -> x * 2
lisangisi = (a, b) -> a + b
kobakisa = x -> x + 1

5 |> mbala_mibale(_)        // → 10
10 |> lisangisi(_, 5)        // → 15
5 |> lisangisi(2, _)         // → 7

// Kokatisa
r = 5 |> mbala_mibale(_) |> kobakisa(_) |> mbala_mibale(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kobatela Makambo ya Mabe

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Bokaboli na zéro" ¶
} :! {
    >> "mabe mosusu: " _err ¶    // _err ebatelaka molayi ya mabe
} :> {
    >> "etambola ntango nyonso" ¶
}
```

| Motindo     | Ntango ezalaka                         |
|-------------|----------------------------------------|
| `##Div`     | Bokaboli na zéro                       |
| `##IO`      | Fiche / Système                        |
| `##Index`   | Index elongi nsuka ya mitanda          |
| `##Type`    | Mabe ya motindo                        |
| `##Parse`   | Mabe ya kobengela                      |
| `##Network` | Mabe ya réseau                         |
| `##_`       | Mabe nyonso (catch-all)                |

---

## Mamoduli

```zymbol
// Fiche: lib/calc.zy
# calc

#> { kotanga, get_PI }    // Binto ya libanda LIBOSO ya bonsomi

_PI := 3.14159
kotanga(a, b) { <~ a + b }
get_PI() { <~ _PI }   // mobimisi — kokɔta toon toon na nkombo ekoki te
```

```zymbol
// Fiche: main.zy
<# ./lib/calc <= c    // nkombo ya mbano esengeli

>> c::kotanga(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Kolongola na nkombo mosusu
# mylib
#> { _kotanga_kati <= lisangisi }

_kotanga_kati(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::lisangisi(3, 4) ¶    // → 7  (nkombo ya kati _kotanga_kati esuudamaki)
```

---

## Bato ya misala ya data

```zymbol
// Kobongola nsango na motango
v1 = #|"42"|      // → 42  (Motango mobimba)
v2 = #|"3.14"|    // → 3.14  (Motango ya koma)
v3 = #|"abc"|     // → "abc"  (mabe te)

// Kotondo / kobeba
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (kotondo na binndi 2)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kobeba)

// Ndakisa ya motango
fmt = #,|1234567|      // → 1,234,567  (virgule ya kosemba)
sci = #^|12345.678|    // → 1.2345678e4  (kisayansi)

// Biloko ya baze
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binairi)
c = 0o101        // → 'A'  (oktal)

// Kobongola baze na kobimi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Kotanganaki na Shell

```zymbol
lelo = <\ date +%Y-%m-%d \>     // kokanga stdout (na motindo ya mpe)
>> "Lelo: " lelo

fiche = "data.txt"
tembe = <\ cat {fiche} \>       // interpolasio na mitindo

bimi = </"./subscript.zy"/>    // kosala zymbol mosusu, kokanga bimi
>> bimi
```

> `><` ekangaka mitindo ya CLI lokola mitanda ya nsinga (tree-walker kaka).

---

## Ndakisa ya Momesano: FizzBuzz

```zymbol
kotanga(nomboro) {
    ? nomboro % 15 == 0 { <~ "FiiziBuuzi" }
    _? nomboro % 3  == 0 { <~ "Fiizi" }
    _? nomboro % 5  == 0 { <~ "Buuzi" }
    _ { <~ nomboro }
}

@ i:1..20 { >> kotanga(i) ¶ }
```

---

## Kotalela Bilembo

| Lilembo  | Mosala             | Lilembo    | Mosala                |
|----------|--------------------|------------|-----------------------|
| `=`      | Bintoko            | `$#`       | Molai                 |
| `:=`     | Biloko ezangi      | `$+`       | kobakisa              |
| `>>`     | Koloba             | `$+[i]`    | kotia na index        |
| `<<`     | Kozwa              | `$-`       | kolongola ya liboso   |
| `¶`/`\\` | Motindo ya mpe     | `$--`      | kolongola nyonso      |
| `?`      | soki (if)          | `$-[i]`    | kolongola na index    |
| `_?`     | soki mosusu (elif) | `$-[i..j]` | kolongola ntalo       |
| `_`      | soki te / esika    | `$?`       | azali na kati         |
| `??`     | match              | `$??`      | bisika nyonso         |
| `@`      | Koluka mbala mingi | `$[s..e]`  | Tiolo                 |
| `@!`     | simba (break)      | `$>`       | map                   |
| `@>`     | tɔlɔlɔ (continue)  | `$\|`      | filter                |
| `->`     | Lambda             | `$<`       | reduce                |
| `$^+`    | kobeba na mokolo   | `$^-`      | kobeba na nse         |
| `$^`     | kobeba na lambda   | | |
| `<~`     | kozongisa          | `!?`       | luka (try)            |
| `\|>`    | Pipe               | `:!`       | kanga (catch)         |
| `#1`     | solo               | `:>`       | ntango nyonso (finally)|
| `#0`     | lokuta             | `$!`       | azali mabe            |
| `<#`     | zwa (import)       | `$!!`      | tinda mabe            |
| `#`      | bongisa moduli     | `#>`       | longola libanda       |
| `::`     | benga moduli       | `.`        | kokɔta esika          |
| `#\|..\|` | kobongola motango | `#?`       | kotala motindo        |
| `#.N\|..\|` | kotondo        | `#!N\|..\|` | kobeba             |
| `c\|..\|` | virgule ya ndakisa | `e\|..\|` | kisayansi             |
| `<\ ..\>` | shell kosala     | `>\<`      | mitindo ya CLI        |

---

*Zymbol-Lang — Ya Bilembo. Ya Bato Nyonso. Ezangi Kobongwana.*

> **Litatoli:** Mokanda oyo esalamaki mpe ekopiamaki na Mayele ya Makinini (AI).
> Misala nyonso esalamaki mpo na kotala malamu, kasi miteya misusu to ndakisa zingi mpe kolala na makambo ya mabe.
> Toli ya solo ezali [Zymbol-Lang specifications](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
