# Maikling Gabay sa Zymbol-Lang

**Zymbol-Lang** ay isang simbolikong wika ng programa. Walang mga keyword — lahat ay simbolo. Gumagana nang pareho sa anumang wikang pantao.

- Walang mga keyword (`kung`, `habang`, `ibalik` ay hindi umiiral — simbolo lamang `?`, `@`, `<~`)
- Buong Unicode — mga identifier sa anumang wika o emoji 👋
- Hindi nakasalalay sa wikang pantao — ang code ay magkapareho sa bawat wika

---

## Mga Variable at Konstante

```zymbol
x = 10           // variable (mababago)
PI := 3.14159    // konstante (hindi mababago — error kung muling itakda)
pangalan = "Ana"
aktibo = #1      // boolean na totoo
👋 := "Kamusta"
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

## Talahanayan ng Uri ng Data

| Uri             | Halimbawa            | Simbolo ng `#?` | Tala                                     |
|-----------------|----------------------|-----------------|------------------------------------------|
| Integer         | `42`, `-7`           | `###`           | 64-bit na may tanda                      |
| Float           | `3.14`, `1.5e10`     | `##.`           | Notasyong siyentipiko OK                 |
| String          | `"kamusta"`          | `##"`           | Interpolasyon: `"Kamusta {pangalan}"`    |
| Char            | `'A'`                | `##'`           | Isang character na Unicode               |
| Boolean         | `#1`, `#0`           | `##?`           | HINDI numerikong 1 at 0                  |
| Array           | `[1, 2, 3]`          | `##]`           | Lahat ng elemento ay dapat parehong uri  |
| Tuple           | `(a, b)`             | `##)`           | Pangkatang posisyon                      |
| Pinangalanang Tuple | `(x: 1, y: 2)`  | `##)`           | Access sa pangalan o index               |

```zymbol
// Introspeksyon ng uri — nagbabalik ng (uri, digit, halaga)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Output at Input

```zymbol
>> "Kamusta" ¶                         // ¶ o \\ ay nagbibigay ng bagong linya
>> "a=" a " b=" b ¶                    // maramihang halaga sa pamamagitan ng juxtaposition
>> (hanay$#) ¶                         // ang mga postfix operator ay nangangailangan ng panaklong

<< pangalan                            // walang prompt — nagbabasa sa variable
<< "Ang iyong pangalan? " pangalan     // may prompt
```

> `¶` o `\\` ay katumbas bilang bagong linya.

---

## Mga Operator

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (integer na dibisyon)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (exponentiation)

// Paghahambing
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lohikal
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Mga String

Tatlong wastong paraan — bawat isa para sa kontekstong nito:

```zymbol
pangalan = "Ana"
n = 25

// 1. Kuwit — sa mga pagtatalaga gamit ang = o :=
mensahe = "Kamusta ", pangalan, "!"       // → Kamusta Ana!

// 2. Juxtaposition — sa >> output
>> "Kamusta " pangalan " ikaw ay " n ¶    // → Kamusta Ana ikaw ay 25

// 3. Interpolasyon — sa anumang konteksto
paglalarawan = "Kamusta {pangalan}, ikaw ay {n}"    // → Kamusta Ana, ikaw ay 25
```

```zymbol
s = "Kamusta Mundo"
haba = s$#                  // 13
bahagi = s$[0..7]           // "Kamusta"
mayroon = s$? "Mundo"       // #1
hatiin = "a,b,c,d" / ','    // [a, b, c, d]
palitan = s$~~["a":"e"]      // palitan
palitan1 = s$~~["a":"e":1]   // N unang
```

> `+` para sa mga numero lamang. Para sa mga string gamitin ang `,`, juxtaposition, o interpolation.

---

## Kontrol ng Daloy

```zymbol
x = 7

? x > 0 { >> "positibo" ¶ }

? x > 100 {
    >> "malaki" ¶
} _? x > 0 {
    >> "positibo" ¶
} _? x == 0 {
    >> "sero" ¶
} _ {
    >> "negatibo" ¶
}
```

> Ang mga bloke `{ }` ay **kinakailangan** kahit para sa isang linya.

---

## Pagtutugma

```zymbol
// Pagtutugma na may mga saklaw
marka = 85
grado = ?? marka {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Mga string
kulay = "pula"
code = ?? kulay {
    "pula"   : "#FF0000"
    "berde"  : "#00FF00"
    _        : "#000000"
}

// Mga bantay
temperatura = -5
kalagayan = ?? temperatura {
    _? temperatura < 0  : "yelo"
    _? temperatura < 20 : "malamig"
    _? temperatura < 35 : "mainit-init"
    _                   : "mainit"
}
>> kalagayan ¶    // → yelo

// Anyong pahayag (mga blokeng braso)
?? n {
    0       : { >> "sero" ¶ }
    _? n < 0: { >> "negatibo" ¶ }
    _       : { >> "positibo" ¶ }
}
```

---

## Mga Loop

```zymbol
@ i:0..4  { >> i " " }        // inklusibong saklaw:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // na may hakbang:       1 3 5 7 9
@ i:5..0:1 { >> i " " }       // baligtad:             5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

mga_prutas = ["mansanas", "peras", "ubas"]
@ p:mga_prutas { >> p ¶ }     // for-each array

@ c:"kamusta" { >> c "-" }
>> ¶                          // → k-a-m-u-s-t-a-  (for-each string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> ituloy
    ? i > 7 { @! }             // @! ihinto
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Walang katapusang loop
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// May label na loop (nested na paghinto)
count = 0
@ @labas {
    count++
    ? count >= 3 { @! labas }
}
>> count ¶                    // → 3
```

---

## Mga Function

```zymbol
kabuuan(a, b) { <~ a + b }
>> kabuuan(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Ang mga function ay may **nakahiwalay na saklaw** — hindi nila mababasa ang mga panlabas na variable. Gamitin ang mga output parameter `<~` upang baguhin ang mga variable ng nagtatawag:

```zymbol
palitan(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
palitan(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ang mga pinangalanang function ay hindi mga first-class na halaga. Upang ipasa bilang argumento, balutin: `x -> kabuuan(x)`.

---

## Lambda at Closure

```zymbol
doble = x -> x * 2
kabuuan = (a, b) -> a + b
>> doble(5) ¶       // → 10
>> kabuuan(3, 7) ¶  // → 10

// Block lambda
uri_ng_halaga = x -> {
    ? x > 0 { <~ "positibo" }
    _? x < 0 { <~ "negatibo" }
    <~ "sero"
}

// Closure — kumukuha ng panlabas na saklaw
salik = 3
tatlong_beses = x -> x * salik
>> tatlong_beses(7) ¶    // → 21

// Function factory
gumawa_ng_tagadagdag(n) { <~ x -> x + n }
dagdag10 = gumawa_ng_tagadagdag(10)
>> dagdag10(5) ¶    // → 15

// Sa mga array
mga_operasyon = [x -> x+1, x -> x*2, x -> x*x]
>> mga_operasyon[2](5) ¶    // → 25
```

---

## Hanay

Ang mga hanay ay **nababago** at naglalaman ng mga elemento ng **parehong uri**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — access (0-indexed)
arr[-1]         // 5 — negatibong index (huli)
arr$#           // 5 — haba (gamitin ang (arr$#) sa >>)

arr = arr$+ 6            // idagdag → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // ipasok sa index 2
arr3 = arr$- 3           // alisin ang unang paglitaw ng halaga
arr4 = arr$-- 3          // alisin ang lahat ng paglitaw
arr5 = arr$-[0]          // alisin sa index
arr6 = arr$-[1..3]       // alisin ang saklaw (eksklusibong katapusan)

mayroon = arr$? 3        // #1 — naglalaman
pos = arr$?? 3           // [2] — lahat ng index ng halaga
sl = arr$[0..3]          // [1,2,3] — hiwa (eksklusibong katapusan)
sl2 = arr$[0:3]          // [1,2,3] — pareho, syntax na batay sa bilang

pataas = arr$^+          // inayos pataas  (mga primitibo lamang)
pababa = arr$^-          // inayos pababa  (mga primitibo lamang)

// Mga pinangalanang/posisyonal na tuple array — gamitin ang $^ na may comparator lambda
db = [(pangalan: "Carla", edad: 28), (pangalan: "Ana", edad: 25), (pangalan: "Bob", edad: 30)]
ayon_sa_edad   = db$^ (a, b -> a.edad < b.edad)     // pataas ayon sa edad  (<)
ayon_sa_pangalan = db$^ (a, b -> a.pangalan > b.pangalan) // pababa ayon sa pangalan (>)
>> ayon_sa_edad[0].pangalan ¶     // → Ana
>> ayon_sa_pangalan[0].pangalan ¶ // → Carla

// Direktang pag-update ng elemento (mga hanay lamang)
arr[1] = 99              // italaga
arr[0] += 5              // compound: +=  -=  *=  /=  %=  ^=

// Functional na update — nagbabalik ng bagong hanay; ang orihinal ay hindi nababago
arr2 = arr[1]$~ 99
```

> Lahat ng mga operator ng koleksyon ay nagbabalik ng **bagong array**. Italaga ulit: `arr = arr$+ 4`.
> Hindi maaaring i-chain ang mga operator — gumamit ng mga intermediate na pagtatalaga.
> `$^+` / `$^-` nag-uuri ng **mga primitive array** (mga numero, string). Para sa mga tuple array gamitin ang `$^` na may comparator lambda — ang direksyon ay naka-encode sa lambda (`<` = pataas, `>` = pababa).

**Semantika ng halaga** — ang pagtatalaga ng hanay sa ibang variable ay gumagawa ng independyenteng kopya:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← hindi apektado ang b
```

```zymbol
// Mga nested array
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Destructuring

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[una, *natira] = arr          // una=10  natira=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ itatapon

// Posisyonal na tuple
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Pinangalanang tuple
tao = (pangalan: "Ana", edad: 25, lungsod: "Maynila")
(pangalan: p, edad: e) = tao // p="Ana"  e=25
```

---

## Tuple

Ang mga tuple ay **hindi nababago** na mga nakaayos na lalagyan na maaaring maglaman ng mga halaga ng **iba't ibang uri**. Hindi tulad ng mga hanay, ang mga elemento ay hindi maaaring baguhin pagkatapos ng paglikha.

```zymbol
// Posisyonal
punto = (10, 20)
>> punto[0] ¶    // → 10

datos = (42, "hello", #1, 3.14)
>> datos[2] ¶     // → #1

// Pinangalanan
tao = (pangalan: "Alisa", edad: 25)
>> tao.pangalan ¶    // → Alisa
>> tao[0] ¶          // → Alisa  (gumagana rin ang index)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, label: "simula")
>> p.pos.x ¶        // → 10
```

**Hindi nababago** — anumang pagtatangkang baguhin ang elemento ng tuple ay isang runtime error:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ runtime error: ang mga tuple ay hindi nababago
// t[0] += 5    // ❌ parehong error
```

Upang makuha ang nabagong halaga, gamitin ang `$~` (functional na update) — nagbabalik ng **bagong** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← ang orihinal ay hindi nababago
>> t2 ¶    // → (10, 999, 30)

// Pinangalanang tuple — muling buuin nang malinaw
tao = (pangalan: "Alisa", edad: 25)
masMatanda = (pangalan: tao.pangalan, edad: 26)
>> tao.edad ¶         // → 25
>> masMatanda.edad ¶  // → 26
```

---

## Mataas na Antas na Mga Function

> Ang mga operator ng HOF ay nangangailangan ng **inline lambda** — hindi isang direktang lambda variable.

```zymbol
mga_bilang = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

mga_doble    = mga_bilang$> (x -> x * 2)                   // map  → [2,4,6…20]
mga_pantay   = mga_bilang$| (x -> x % 2 == 0)              // filter → [2,4,6,8,10]
kabuuan_lahat = mga_bilang$< (0, (acc, x) -> acc + x)      // reduce → 55

// Pinagkakadena sa pamamagitan ng mga intermediate
hakbang1 = mga_bilang$| (x -> x > 3)
hakbang2 = hakbang1$> (x -> x * x)
>> hakbang2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Mga pinangalanang function sa loob ng HOF — balutin sa lambda
doblehin(x) { <~ x * 2 }
r = mga_bilang$> (x -> doblehin(x))    // ✅
```

---

## Pipe Operator

Ang kanang bahagi ay palaging nangangailangan ng `_` bilang placeholder:

```zymbol
doble = x -> x * 2
dagdag = (a, b) -> a + b
dagdag_isa = x -> x + 1

5 |> doble(_)            // → 10
10 |> dagdag(_, 5)       // → 15
5 |> dagdag(2, _)        // → 7

// Pinagkakadena
resulta = 5 |> doble(_) |> dagdag_isa(_) |> doble(_)
>> resulta ¶    // → 22  (5→10→11→22)
```

---

## Paghawak ng Error

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "paghahati sa sero" ¶
} :! {
    >> "ibang error: " _err ¶    // _err ay nagtatago ng mensahe ng error
} :> {
    >> "palaging tumatakbo" ¶
}
```

| Uri         | Kapag nangyayari              |
|-------------|-------------------------------|
| `##Div`     | Paghahati sa sero             |
| `##IO`      | File / sistema                |
| `##Index`   | Index na labas sa hangganan   |
| `##Type`    | Error sa uri                  |
| `##Parse`   | Pag-parse ng data             |
| `##Network` | Mga error sa network          |
| `##_`       | Anumang error (catch-all)     |

---

## Mga Module

```zymbol
// lib/calc.zy
# calc

#> { kabuuan, kuha_PI }    // mga export BAGO ang mga kahulugan

_PI := 3.14159
kabuuan(a, b) { <~ a + b }
kuha_PI() { <~ _PI }   // getter — hindi sinusuportahan ang direktang access sa constant sa pamamagitan ng alias
```

```zymbol
// pangunahin.zy
<# ./lib/calc <= c    // kinakailangan ang alias

>> c::kabuuan(5, 3) ¶     // → 8
pi = c::kuha_PI()
>> pi ¶                    // → 3.14159
```

```zymbol
// I-export na may ibang pampublikong pangalan
# mylib
#> { _panloob_na_dagdag <= kabuuan }

_panloob_na_dagdag(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::kabuuan(3, 4) ¶    // → 7  (ang pangalang panloob _panloob_na_dagdag ay nakatago)
```

---

## Mga Mode ng Numero

Ang Zymbol ay maaaring magpakita ng mga numero sa **69 Unicode na script ng digit** — Devanagari, Arabe-Indiyano, Thai, Klingon pIqaD, Mathematical Bold, mga segment ng LCD, at iba pa. Ang aktibong mode ay nakakaapekto lamang sa output ng `>>`; ang panloob na aritmetika ay palaging binary.

### Pag-activate ng isang script

Isulat ang digit na `0` at `9` ng target na script na nakapaloob sa `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabe-Ind.    (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // i-reset sa ASCII
```

### Output at mga boolean na halaga

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimal point palaging ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: # prefix palaging ASCII, digit nag-aayon
>> #1 ¶         // → #१   (totoo sa Devanagari)
>> #0 ¶         // → #०   (mali — naiiba mula sa ०  integer na zero)

x = 28 > 4
>> x ¶          // → #१   (resulta ng paghahambing ay sumusunod sa aktibong mode)
```

### Mga native na digit literal sa source code

Ang mga digit mula sa anumang sinusuportahang script ay mga wastong literal — sa mga hanay, modulo, paghahambing:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Mga boolean literal sa anumang script

`#` + digit na `0` o `1` mula sa anumang bloke ay isang wastong boolean literal:

```zymbol
#٠٩#
نشط = #١        // katulad ng #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> Ang `#` ay **palaging ASCII**. Ang `#0` (mali) ay palaging naiiba sa visual mula sa `0` (integer na zero) sa bawat script.

---

## Mga Operator ng Data

```zymbol
// Pag-parse ng string sa numero
v1 = #|"42"|      // → 42
v2 = #|"3.14"|    // → 3.14
v3 = #|"abc"|     // → "abc"

// Bilugan / putulin
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Format ng numero
fmt = #,|1234567|       // → 1,234,567
sains = #^|12345.678|   // → 1.2345678e4

// Mga base literal
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Conversion ng base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrasyon ng Shell

```zymbol
petsa = <\ date +%Y-%m-%d \>     // kumuha ng stdout
>> "Ngayon: " petsa

file = "data.txt"
nilalaman = <\ cat {file} \>     // interpolation sa mga utos

output = </"./subscript.zy"/>    // patakbuhin ang Zymbol script
>> output
```

> `><` kumukuha ng mga CLI argument bilang string array (tree-walker lamang).

---

## Kumpletong Halimbawa: FizzBuzz

```zymbol
uriin(bilang) {
    ? bilang % 15 == 0 { <~ "BulaUgong" }
    _? bilang % 3  == 0 { <~ "Bula" }
    _? bilang % 5  == 0 { <~ "Ugong" }
    _ { <~ bilang }
}

@ i:1..20 { >> uriin(i) ¶ }
```

---

## Sanggunian ng Simbolo

| Simbolo   | Operasyon                   | Simbolo      | Operasyon                        |
|-----------|-----------------------------|--------------|----------------------------------|
| `=`       | variable                    | `$#`         | haba                             |
| `:=`      | konstante                   | `$+`         | idagdag                          |
| `>>`      | output                      | `$+[i]`      | ipasok sa index                  |
| `<<`      | input                       | `$-`         | alisin ang una ayon sa halaga    |
| `¶` / `\\` | bagong linya               | `$--`        | alisin lahat ayon sa halaga      |
| `?`       | kung (if)                   | `$-[i]`      | alisin sa index                  |
| `_?`      | kung hindi (else-if)        | `$-[i..j]`   | alisin ang saklaw                |
| `_`       | iba pa / wildcard           | `$?`         | naglalaman                       |
| `??`      | tumugma (match)             | `$??`        | hanapin lahat ng index           |
| `@`       | loop                        | `$[s..e]`    | hiwa                             |
| `@!`      | ihinto (break)              | `$>`         | mapa (map)                       |
| `@>`      | ituloy (continue)           | `$\|`        | salain (filter)                  |
| `->`      | lambda                      | `$<`         | bawasan (reduce)                 |
| `arr[i] = val` | i-update ang elemento (mga hanay lamang) | `arr[i] += val` | compound na update  |
| `arr[i]$~` | functional na update (bagong kopya) | `$^+`  | ayusin pataas (primitibo)       |
| `$^-`     | ayusin pababa (primitibo)   | `$^`         | ayusin na may comparator (tuple) |
| `<~`      | ibalik (return)             | `!?`         | subukan (try)                    |
| `\|>`     | tubo (pipe)                 | `:!`         | hulihin (catch)                  |
| `#1`      | totoo (true)                | `:>`         | sa wakas (finally)               |
| `#0`      | mali (false)                | `$!`         | ay error                         |
| `<#`      | i-import                    | `$!!`        | ipalaganap ng error              |
| `#`       | ideklara ang module         | `#>`         | i-export                         |
| `::`      | tawag sa module             | `.`          | pag-access sa field              |
| `#\|..\|` | mag-parse ng numero         | `#?`         | metadata ng uri                  |
| `#.N\|..\|` | bilugan                   | `#!N\|..\|`  | putulin                          |
| `#,\|..\|` | format na may kuwit         | `#^\|..\|`    | format na siyentipiko            |
| `#d0d9#` | switch ng mode ng numero | `#09#` | i-reset sa ASCII |
| `<\ ..\>` | pagpapatakbo ng shell       | `>\<`        | mga CLI argument                 |

## Kasaysayan ng Bersyon

### v0.0.3 — Mga Sistema ng Numero ng Unicode & Mga Pagpapabuti ng LSP _(Abril 2026)_

- **Idinagdag** 69 Unicode na bloke ng digit na may mode-switch token na `#d0d9#`
- **Idinagdag** Mga boolean literal sa anumang script — `#१` / `#०`, `#١` / `#٠`, atbp.
- **Idinagdag** Mga digit ng Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Idinagdag** VM opcode na `SetNumeralMode` — buong paridad sa tree-walker
- **Idinagdag** Ang REPL ay gumagalang sa aktibong mode ng numero sa echo at display ng variable
- **Binago** Ang `>>` output ng mga boolean ay kasama na ang `#` prefix (`#0` / `#1`) sa lahat ng mode

### v0.0.2_01 — Pagpapalit ng Pangalan ng Operator _(30 Mar 2026)_

- **Binago** `c|..|` → `#,|..|` at `e|..|` → `#^|..|` — pare-pareho sa pamilya ng prefix na `#`
- **Idinagdag** Export alias: muling pag-export ng mga miyembro ng module sa ibang pangalan

### v0.0.2 — Muling Disenyo ng API ng Koleksyon & Mga Installer _(24 Mar 2026)_

- **Idinagdag** Pinag-isang pamilya ng operator na `$` para sa mga array at string (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Idinagdag** Destructuring para sa mga array, tuple, at pinangalanang tuple
- **Idinagdag** Mga negatibong index (`arr[-1]` = huling elemento)
- **Idinagdag** Mga native na installer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Idinagdag** Compound assignment na `^=`
- **Naayos** Mga edge case ng arithmetic parser; mga pagwawasto sa dokumentasyon

### v0.0.1 — Unang Pampublikong Labas _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× mas mabilis, ~95% paridad)
- Lahat ng pangunahing construct: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Buong Unicode identifier, sistema ng module, lambda, closure, paghawak ng error
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Simboliko. Pandaigdig. Hindi Nagbabago.*

> **Babala:** Ang dokumentasyong ito ay nilikha at isinalin ng artipisyal na katalinuhan (AI).
> Ang lahat ng pagsisikap ay ginawa upang matiyak ang katumpakan, ngunit ang ilang pagsasalin o halimbawa ay maaaring maglaman ng mga pagkakamali.
> Ang kanonikong sanggunian ay ang [detalye ng Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
