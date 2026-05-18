> **Paunawa:** Ang dokumentasyong ito ay nilikha at isinalin ng artificial intelligence (AI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Manwal ng Zymbol-Lang

> **Sinuri para sa v0.0.5 — 2026-05-12**

**Zymbol-Lang** ay isang simbolikong programming language. Walang mga keyword — lahat ay simbolo. Gumagana nang magkapareho sa anumang wikang pantao.

- Walang `if`, `while`, `return` — tanging `?`, `@`, `<~`
- Buong Unicode — mga identifier sa anumang wika o emoji
- Hindi nakasalalay sa wikang pantao — ang code ay pareho sa lahat ng dako

**Bersyon ng interpreter**: v0.0.5 | **Saklaw ng pagsubok**: 436/436 (TW ↔ VM pagkakatugma)

---

## Mga Variable & Konstante

```zymbol
x = 10              // nababagong variable
PI := 3.14159       // konstante — ang muling pagtatalaga ay isang runtime error
pangalan = "Alice"
aktibo = #1         // boolean totoo
👋 := "Kumusta"
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

`°` (tanda ng degree, U+00B0) awtomatikong nagpapasimula ng variable sa neutral na halaga nito sa unang paggamit:

```zymbol
mga_numero = [3, 1, 4, 1, 5]
@ n:mga_numero {
    °kabuuan += n    // auto-init sa 0 sa itaas ng loop; nananatili pagkatapos ng @
}
>> kabuuan ¶         // → 14
```

> `°x` (prefix) nagpapalapit sa itaas ng loop — ang resulta ay naa-access pagkatapos ng `@`.
> `x°` (postfix) nagpapalapit sa loob ng loop — nawawala kapag natapos ang loop.
> Tree-walker lamang.

---

## Mga Uri ng Data

| Uri | Literal | tag `#?` | Mga Tala |
|-----|---------|----------|---------|
| Buong Bilang | `42`, `-7` | `###` | 64-bit may tanda |
| Desimal | `3.14`, `1.5e10` | `##.` | Siyentipikong notasyon OK |
| Teksto | `"teksto"` | `##"` | Interpolasyon: `"Kumusta {pangalan}"` |
| Karakter | `'A'` | `##'` | Isang Unicode na karakter |
| Boolean | `#1`, `#0` | `##?` | HINDI numero — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Magkaparehong mga elemento |
| Tuple | `(a, b)` | `##)` | Porsyonal |
| Pinangalanang Tuple | `(x: 1, y: 2)` | `##)` | Mga pinangalanang field |
| Function | pinangalanang function reference | `##()` | Unang klase; display `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Unang klase; display `<lambd/N>` |

```zymbol
// Introspeksyon ng uri — nagbabalik ng (uri, mga digit, halaga)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output & Input

```zymbol
>> "Kumusta" ¶                     // ¶ o \\ para sa malinaw na bagong linya
>> "a=" a " b=" b ¶                // pagsasama — maraming halaga
>> (arr$#) ¶                       // ang postfix na operator ay nangangailangan ng ( ) sa >>

<< pangalan                        // magbasa sa variable (walang prompt)
<< "Ilagay ang pangalan: " pangalan // may prompt
```

> `¶` (AltGr+R sa Spanish keyboard) at `\\` ay katumbas na bagong linya.

---

## Mga TUI Primitive

Mga terminal UI operator para sa mga interactive na programa. Karamihan ay nangangailangan ng `>>| { }` na bloke (kahaliling screen + raw mode).

```zymbol
>>| {
    >>!                              // linisin ang kahaliling screen
    >>~ (1, 1, 0, 10) > "Tumatakbo" // hilera 1, kol 1, fg=10 (berde)
    @~ 1000                          // tigil 1 segundo (1000 ms)
    >>~ (2, 1) > "Tapos na."
}
// ang terminal ay awtomatikong naibabalik sa paglabas
```

```zymbol
// Pagpindot ng key at sukat ng terminal
>>| {
    [mga_hilera, mga_kolumn] = >>?              // itanong ang sukat ng terminal
    >>~ (1, 1) > "Terminal: " mga_hilera " x " mga_kolumn
    <<| key                                     // humahadlang na pagbabasa ng key
    >>~ (2, 1) > "Pinindot: " key
}
```

> `>>!` linisin ang screen. `>>?` nagbabalik ng `[mga_hilera, mga_kolumn]`. `@~ N` matulog ng N milliseconds.
> `<<|` nagbabasa ng isang key (humahadlang); `<<|?` nagpo-poll nang walang paghinto (nagbabalik ng `'\0'` kung wala).
> Porsyonal na output tuple: `(hilera, kol, BKS, fg, bg)` — anumang slot ay maaaring alisin ng kuwit (`>>~ (,,, 196) > "pula"`).
> BKS bitmask: `1`=Matapang, `2`=Italiko, `4`=Salungguhit. ANSI 256-kulay na paleta (`0`=default ng terminal).
> Tree-walker lamang (maliban sa `>>!`, `>>?`, `@~`, `>>~` na tumatakbo rin sa `--vm`).

---

## Mga Operator

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (buong bilang na dibisyon)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (pagpapalakas)

// Paghahambing — mag-assign para masuri
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lohikal
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Teksto

```zymbol
// Dalawang paraan ng pagdurugtong
pangalan = "Alice"
n = 42

>> "Kumusta " pangalan " mayroon kang " n ¶        // pagdurugtong — sa >>
paglalarawan = "Kumusta {pangalan}, mayroon kang {n}"  // interpolasyon — kahit saan
```

```zymbol
s = "Kumusta Mundo"
haba = s$#                  // 13
bahagi = s$[1..7]           // "Kumusta"  (base 1, kasama ang dulo)
may = s$? "Mundo"           // #1
mga_bahagi = "a,b,c,d"$/ ','  // [a, b, c, d]  (hatiin sa delimiter)
palit = s$~~["u":"U"]       // "KUmUsta MUndO"  (palitan lahat)
palit1 = s$~~["u":"U":1]    // "KUmusta Mundo"  (unang N)
linya = "─" $* 20           // "────────────────────"  (ulitin N beses)
```

> `+` ay para sa mga numero lamang. Gumamit ng `,`, pagdurugtong, o interpolasyon para sa teksto.

---

## Daloy ng Kontrol

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

> Ang `{ }` na mga kulot na bracket ay **kinakailangan** kahit para sa isang pahayag.

---

## Pagtutugma

```zymbol
// Mga saklaw
marka = 85
grado = ?? marka {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> grado ¶    // → B

// Teksto
kulay = "pula"
code = ?? kulay {
    "pula"    => "#FF0000"
    "berde"   => "#00FF00"
    _         => "#000000"
}

// Mga pattern ng paghahambing
temperatura = -5
kalagayan = ?? temperatura {
    < 0  => "yelo"
    < 20 => "malamig"
    < 35 => "mainit-init"
    _    => "napakainit"
}
>> kalagayan ¶    // → yelo

// Anyo ng pahayag (mga bloke na braso)
n = -3
?? n {
    0    => { >> "sero" ¶ }
    < 0  => { >> "negatibo" ¶ }
    _    => { >> "positibo" ¶ }
}
```

---

## Mga Loop

```zymbol
@ i:0..4  { >> i " " }        // saklaw na kasama ang dulo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // may hakbang:                1 3 5 7 9
@ i:5..0:1 { >> i " " }       // baligtad:                   5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (habang)

mga_prutas = ["mansanas", "peras", "ubas"]
@ p:mga_prutas { >> p ¶ }     // para sa bawat array

@ k:"helo" { >> k "-" }
>> ¶                          // → h-e-l-o-  (para sa bawat teksto)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> magpatuloy
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
bilang = 0
@:labas {
    bilang++
    ? bilang >= 3 { @:labas! }
}
>> bilang ¶                    // → 3
```

---

## Mga Function

```zymbol
idagdag(a, b) { <~ a + b }
>> idagdag(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Ang mga function ay may **hiwalay na saklaw** — hindi nila mababasa ang mga panlabas na variable. Gumamit ng output parameter na `<~` para baguhin ang mga variable ng tumatawag:

```zymbol
palitan(a<~, b<~) {
    pansamantala = a
    a = b
    b = pansamantala
}
x = 10
y = 20
palitan(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ang mga pinangalanang function ay **mga unang klase na halaga** — ipasa nang direkta: `mga_numero$> doblehin`. Para i-wrap: `x -> fn(x)` ay waring wasto rin.

---

## Lambda & Closure

```zymbol
doblehin = x -> x * 2
kabuuan = (a, b) -> a + b
>> doblehin(5) ¶    // → 10
>> kabuuan(3, 7) ¶    // → 10

// Block lambda
uriin = x -> {
    ? x > 0 { <~ "positibo" }
    _? x < 0 { <~ "negatibo" }
    <~ "sero"
}

// Closure — kumukuha ng panlabas na saklaw
salik = 3
triplehin = x -> x * salik
>> triplehin(7) ¶    // → 21

// Pabrika
gumawa_ng_tagdagdag(n) { <~ x -> x + n }
dagdag10 = gumawa_ng_tagdagdag(10)
>> dagdag10(5) ¶    // → 15

// Sa mga array
mga_operasyon = [x -> x+1, x -> x*2, x -> x*x]
>> mga_operasyon[3](5) ¶    // → 25
```

---

## Mga Array

Ang mga array ay **nababago** at naglalaman ng mga elemento ng **parehong uri**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — access (base 1: unang elemento)
x = arr[-1]     // 5 — negatibong index (huling elemento)
x = arr$#       // 5 — haba (gamitin ang (arr$#) sa >>)

arr = arr$+ 6            // idagdag → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // ipasok sa posisyon 2 (base 1)
arr3 = arr$- 3           // alisin ang unang pagkakataon ng halaga
arr4 = arr$-- 3          // alisin ang lahat ng pagkakataon
arr5 = arr$-[1]          // alisin sa index 1 (unang elemento)
arr6 = arr$-[2..3]       // alisin ang saklaw (base 1, kasama ang dulo)

may = arr$? 3            // #1 — naglalaman
pos = arr$?? 3           // [3] — lahat ng index ng halaga (base 1)
hiwa = arr$[1..3]        // [1,2,3] — hiwa (base 1, kasama ang dulo)
hiwa2 = arr$[1:3]        // [1,2,3] — pareho, syntax na nakabase sa bilang

pataas = arr$^+          // naayos pataas  (primitibo lamang)
pababa = arr$^-          // naayos pababa  (primitibo lamang)

// Mga pinangalanang/posisyonal na tuple array — gamitin ang $^ kasama ang comparator lambda
db = [(pangalan: "Carla", edad: 28), (pangalan: "Ana", edad: 25), (pangalan: "Bob", edad: 30)]
ayon_sa_edad = db$^ (a, b -> a.edad < b.edad)         // pataas ayon sa edad  (<)
ayon_sa_pangalan = db$^ (a, b -> a.pangalan > b.pangalan)  // pababa ayon sa pangalan (>)
>> ayon_sa_edad[1].pangalan ¶     // → Ana
>> ayon_sa_pangalan[1].pangalan ¶ // → Carla

// Direktang pag-update ng elemento (array lamang)
arr[1] = 99              // itakda
arr[2] += 5              // compound: +=  -=  *=  /=  %=  ^=

// Functional na pag-update — nagbabalik ng bagong array; orihinal ay hindi nagbabago
arr2 = arr[2]$~ 99
```

> Lahat ng collection operator ay nagbabalik ng **bagong array**. Itakda muli: `arr = arr$+ 4`.
> Maaaring i-chain ang `$+`: `arr = arr$+ 5$+ 6$+ 7`. Ang iba pang operator ay gumagamit ng mga intermediate na takda.
> **Ang pag-index ay base 1**: `arr[1]` ang unang elemento; `arr[0]` ay runtime error.
> Ang `$^+` / `$^-` ay nagaayos ng **primitive na array** (mga numero, teksto). Para sa mga tuple array gamitin ang `$^` kasama ang comparator lambda — ang direksyon ay naka-encode sa lambda (`<` = pataas, `>` = pababa).

**Value semantics** — ang pagtatalaga ng array sa ibang variable ay gumagawa ng independyenteng kopya:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← hindi apektado ang b
```

```zymbol
// Mga nested na array (base 1 na pag-index)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (hilera 2, kolumn 3)
```

---

## Destructuring

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[una, *natitirang] = arr     // una=10  natitirang=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ itapon

// Posisyonal na tuple
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Pinangalanang tuple
tao = (pangalan: "Ana", edad: 25, lungsod: "Madrid")
(pangalan: n, edad: e) = tao   // n="Ana"  e=25
```

---

## Mga Tuple

Ang mga tuple ay **hindi nababago** na mga ordered na lalagyan na maaaring maglaman ng mga halaga ng **iba't ibang uri**.
Hindi tulad ng mga array, ang mga elemento ay hindi maaaring baguhin pagkatapos ng paglikha.

```zymbol
// Posisyonal — pinahihintulutan ang magkahalong uri
punto = (10, 20)
>> punto[1] ¶    // → 10

datos = (42, "kumusta", #1, 3.14)
>> datos[3] ¶     // → #1

// Pinangalanan
tao = (pangalan: "Alice", edad: 25)
>> tao.pangalan ¶    // → Alice
>> tao[1] ¶          // → Alice  (gumagana rin ang index, base 1)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, label: "pinagmulan")
>> p.pos.x ¶        // → 10
```

**Hindi nababago** — anumang pagtatangkang baguhin ang isang elemento ng tuple ay runtime error:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ runtime error: ang mga tuple ay hindi nababago
// t[1] += 5    // ❌ parehong error
```

Para makakuha ng binagong halaga gamitin ang `$~` (functional na pag-update) — nagbabalik ng **bagong** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orihinal ay hindi nagbabago
>> t2 ¶    // → (10, 999, 30)

// Pinangalanang tuple — muling buuin nang malinaw
tao = (pangalan: "Alice", edad: 25)
mas_matanda  = (pangalan: tao.pangalan, edad: 26)
>> tao.edad ¶          // → 25
>> mas_matanda.edad ¶  // → 26
```

---

## Mga Higher-Order na Function

```zymbol
mga_numero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dinobleng  = mga_numero$> (x -> x * 2)                // map  → [2,4,6…20]
mga_pantay = mga_numero$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
kabuuan    = mga_numero$< (0, (acc, x) -> acc + x)     // reduce → 55

// I-chain sa pamamagitan ng mga intermediate
hakbang1 = mga_numero$| (x -> x > 3)
hakbang2 = hakbang1$> (x -> x * x)
>> hakbang2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ang mga pinangalanang function ay maaaring direktang ipasa sa HOF
doblehin(x) { <~ x * 2 }
malaki_ba(x) { <~ x > 5 }
r = mga_numero$> doblehin    // ✅ direktang reference
r = mga_numero$| malaki_ba   // ✅ direktang reference
```

---

## Pipe Operator

Ang RHS ay palaging nangangailangan ng `_` bilang placeholder para sa piped na halaga:

```zymbol
doblehin = x -> x * 2
idagdag = (a, b) -> a + b
dagdagan = x -> x + 1

r1 = 5 |> doblehin(_)         // → 10
r2 = 10 |> idagdag(_, 5)      // → 15
r3 = 5 |> idagdag(2, _)       // → 7

// Naka-chain
r = 5 |> doblehin(_) |> dagdagan(_) |> doblehin(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Paghawak ng Error

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dibisyon sa sero" ¶
} :! {
    >> "iba pa: " _err ¶    // _err naglalaman ng mensahe ng error
} :> {
    >> "palaging tumatakbo" ¶
}
```

| Uri | Kailan |
|-----|--------|
| `##Div` | Dibisyon sa sero |
| `##IO` | File / sistema |
| `##Index` | Index na labas ng hangganan |
| `##Type` | Hindi tugmang uri |
| `##Parse` | Pag-parse ng data |
| `##Network` | Mga error sa network |
| `##_` | Anumang error (catch-all) |

---

## Mga Module

```zymbol
// lib/calc.zy — ang katawan ng module ay nakapaloob sa kulot na bracket
# calc {
    #> { idagdag, get_PI }

    _PI := 3.14159
    idagdag(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // kinakailangan ang alias

>> c::idagdag(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// I-export gamit ang ibang pampublikong pangalan
# mylib {
    #> { _panloob_idagdag => kabuuan }

    _panloob_idagdag(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::kabuuan(3, 4) ¶    // → 7  (ang panloob na pangalan _panloob_idagdag ay nakatago)
```

> **Mga panuntunan ng module**: `#>` lamang, mga kahulugan ng function, at mga literal na panimula ng variable/konstante ang pinapahintulutan sa `# pangalan { }`. Ang mga executable na pahayag (`>>`, `<<`, mga loop, atbp.) ay nagdudulot ng error E013.

---

## Mga Numerikong Mode

Ang Zymbol ay maaaring magpakita ng mga numero sa **69 na Unicode na digit script** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Mathematical Bold, mga segment ng LCD, at iba pa. Ang aktibong mode ay nakakaapekto lamang sa `>>` output; ang panloob na aritmetika ay palaging binary.

### Pag-aktibo ng isang script

Isulat ang digit na `0` at `9` ng target na script na nakapalibid sa `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // i-reset sa ASCII
```

### Output at mga boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimal point palaging ASCII)
>> 1 + 2 ¶      // → ३

// Mga boolean: # prefix palaging ASCII, ang digit ay umaangkop
>> #1 ¶         // → #१   (totoo sa Devanagari)
>> #0 ¶         // → #०   (mali — naiiba mula sa ०  integer zero)

x = 28 > 4
>> x ¶          // → #१   (ang resulta ng paghahambing ay sumusunod sa aktibong mode)
```

### Mga native na digit literal sa source

Ang mga digit ng anumang sinusuportahang script ay mga wastong literal — sa mga saklaw, modulo, paghahambing:

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
aktibo = #١        // katulad ng #1
>> aktibo ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> Ang `#` ay **palaging ASCII**. Ang `#0` (mali) ay palaging visually naiiba mula sa `0` (integer zero) sa anumang script.

---

## Mga Data Operator

```zymbol
// Mga type conversion cast
f = ##.42         // → 42.0  (sa Desimal)
i = ###3.7        // → 4     (sa Buong Bilang, bilugin)
t = ##!3.7        // → 3     (sa Buong Bilang, putulin)

// I-parse ang teksto sa numero
v1 = #|"42"|      // → 42  (Buong Bilang)
v2 = #|"3.14"|    // → 3.14  (Desimal)
v3 = #|"abc"|     // → "abc"  (ligtas sa pagkabigo, walang error)

// Pag-bilog / pagputol
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (bilugin sa 2 decimal na lugar)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (putulin)

// Pag-format ng numero
fmt = #,|1234567|  // → 1,234,567  (pinaghiwalay ng kuwit)
sci = #^|12345.678|    // → 1.2345678e4  (siyentipiko)

// Mga literal ng base
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Output ng conversion ng base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrasyon ng Shell

```zymbol
petsa = <\ date +%Y-%m-%d \>     // kinukuha ang stdout (kasama ang trailing \n)
>> "Ngayon: " petsa

file = "datos.txt"
nilalaman = <\ cat {file} \>     // interpolasyon sa mga command

output = </"./subscript.zy"/>    // magpatakbo ng isa pang Zymbol script, kunin ang output
>> output
```

> Ang `><` ay kumukuha ng mga CLI argument bilang isang array ng teksto (tree-walker lamang).

---

## Kumpletong Halimbawa: FizzBuzz

```zymbol
uriin(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> uriin(i) ¶ }
```

---

## Sanggunian ng Simbolo

| Simbolo | Operasyon | Simbolo | Operasyon |
|---------|-----------|---------|-----------|
| `=` | variable | `$#` | haba |
| `:=` | konstante | `$+` | idagdag (maaaring i-chain) |
| `>>` | output | `$+[i]` | ipasok sa index (base 1) |
| `<<` | input | `$-` | alisin ang una ayon sa halaga |
| `¶` / `\\` | bagong linya | `$--` | alisin ang lahat ayon sa halaga |
| `?` | kung | `$-[i]` | alisin sa index (base 1) |
| `_?` | kung-hindi | `$-[i..j]` | alisin ang saklaw (base 1) |
| `_` | kung-hindi / wildcard | `$?` | naglalaman |
| `??` | pagtutugma | `$??` | hanapin ang lahat ng index (base 1) |
| `@` | loop | `$[s..e]` | hiwa (base 1) |
| `@ N { }` | loop N beses | `$>` | map |
| `@!` | ihinto | `$\|` | filter |
| `@>` | magpatuloy | `$<` | reduce |
| `@:pangalan { }` | may label na loop | `$/ delim` | hatiin ang teksto |
| `@:pangalan!` | ihinto ang label | `$++ a b c` | buuin ang concat |
| `@:pangalan>` | ituloy ang label | `arr[i>j>k]` | navigation index |
| `->` | lambda | `arr[i] = val` | i-update ang elemento (array lamang) |
| `arr[i] += val` | compound na update | `arr[i]$~` | functional na update (bagong kopya) |
| `$^+` | pag-uri pataas (primitibo) | `$^-` | pag-uri pababa (primitibo) |
| `$^` | pag-uri kasama ang comparator (mga tuple) | `<~` | ibalik |
| `\|>` | pipe | `!?` | subukan |
| `:!` | kunin | `:>` | sa wakas |
| `#1` | totoo | `#0` | mali |
| `$!` | may error | `$!!` | i-propagate ang error |
| `<#` | mag-import | `#>` | mag-export |
| `#` | ideklara ang module | `::` | tawag sa module |
| `.` | pag-access sa field | `#?` | metadata ng uri |
| `#\|..\|` | i-parse ang numero | `##.` | i-cast sa Desimal |
| `###` | i-cast sa Buong Bilang (bilugin) | `##!` | i-cast sa Buong Bilang (putulin) |
| `#.N\|..\|` | bilugin | `#!N\|..\|` | putulin |
| `#,\|..\|` | format na may kuwit | `#^\|..\|` | siyentipiko |
| `#d0d9#` | pagbabago ng numerikong mode | `#09#` | i-reset sa ASCII |
| `<\ ..\>` | patakbuhin sa shell | `>\<` | mga CLI argument |
| `\ var` | sirain ang variable nang malinaw | `°x` / `x°` | mainit na kahulugan (auto-init) |
| `>>|` | TUI bloke (kahaliling screen) | `>>~` | posisyonal na output |
| `>>!` | linisin ang screen | `>>?` | itanong ang sukat ng terminal |
| `<<\|` | humahadlang na key | `<<\|?` | hindi humahadlang na key |
| `@~ N` | matulog ng N milliseconds | `$*` | ulitin ang teksto N beses |

---

## Changelog ng Mga Bersyon

### v0.0.5 — Mga TUI Primitive, Mainit na Kahulugan & Pag-ulit ng Teksto _(Mayo 2026)_

- **Nakakabasag** Separator ng match arm: `pattern : resulta` → `pattern => resulta`
- **Nakakabasag** Import alias: `<# landas <= alias` → `<# landas => alias`
- **Nakakabasag** Pagpapalit ng pangalan ng export: `#> { fn <= pub }` → `#> { fn => pub }`
- **Idinagdag** TUI bloke `>>| { }` — kahaliling screen + raw mode; naglilinis sa paglabas
- **Idinagdag** Posisyonal na output `>>~ (hilera, kol, BKS, fg, bg) > mga_item` — maluwag na mga slot, ANSI 256-kulay
- **Idinagdag** Key input `<<| var` (humahadlang) at `<<|? var` (hindi humahadlang na poll)
- **Idinagdag** `>>!` linisin ang screen, `>>?` itanong ang sukat ng terminal, `@~ N` matulog ng N milliseconds
- **Idinagdag** Mainit na kahulugan `°x` / `x°` — auto-simulan ang variable sa unang paggamit sa mga loop
- **Idinagdag** Pag-ulit ng teksto `str $* N` — ulitin ang isang teksto ng N beses
- **VM** Pagkakatugma: 436/436 na mga pagsubok ang pumasa

### v0.0.4 — Base 1 na Pag-index, Mga First-Class na Function & Mga Module Block _(Abril 2026)_

- **Nakakabasag** Lahat ng pag-index ay inilipat sa **base 1** — `arr[1]` ang unang elemento; `arr[0]` ay runtime error
- **Idinagdag** Ang mga pinangalanang function ay **mga unang klase na halaga** — ipasa nang direkta sa HOF: `mga_numero$> doblehin`
- **Idinagdag** **Block syntax** ng module ay kinakailangan: `# pangalan { ... }` — flat syntax ay inalis
- **Idinagdag** Multi-dimensional na pag-index: `arr[i>j>k]` (navigation), `arr[p ; q]` (flat extraction)
- **Idinagdag** Mga type conversion cast: `##.expr` (Desimal), `###expr` (Buong Bilang bilugin), `##!expr` (Buong Bilang putulin)
- **Idinagdag** Paghahati ng teksto: `str$/ delim` — nagbabalik ng `Array(Teksto)`
- **Idinagdag** Pagbuo ng concat: `base$++ a b c` — nagdadagdag ng maraming item
- **Idinagdag** Loop N beses: `@ N { }` — ulitin nang eksakto N beses
- **Idinagdag** May label na loop syntax: `@:pangalan { }`, `@:pangalan!`, `@:pangalan>` — pinapalitan ang `@ @pangalan` / `@! pangalan`
- **Idinagdag** Mga panuntunan ng saklaw ng variable: ang mga `_pangalan` na variable ay may eksaktong block scope; `\ var` sinisira nang maaga
- **Idinagdag** Mga pattern ng paghahambing sa pagtutugma: `< 0 :`, `> 5 :`, `== 42 :` atbp.
- **Idinagdag** Module E013 error: ang mga executable na pahayag sa katawan ng module ay ipinagbabawal
- **Naayos** Ang `take_variable` ay hindi na sisira ng mga module constant sa pagsusulat muli
- **Naayos** Ang `alias.CONST` ay naresolba na nang tama; maaaring lumabas ang `#>` pagkatapos ng mga kahulugan ng function
- **VM** Buong pagkakatugma: 393/393 na mga pagsubok ang pumasa

### v0.0.3 — Mga Unicode Numeral System & Mga Pagpapabuti ng LSP _(Abril 2026)_

- **Idinagdag** 69 na mga Unicode digit block na may mode-switch token na `#d0d9#`
- **Idinagdag** Mga boolean literal sa anumang script — `#१` / `#०`, `#١` / `#٠`, atbp.
- **Idinagdag** Mga Klingon pIqaD digit (CSUR PUA U+F8F0–U+F8F9)
- **Idinagdag** `SetNumeralMode` VM opcode — buong pagkakatugma sa tree-walker
- **Idinagdag** Iginagalang ng REPL ang aktibong numerikong mode sa echo at display ng variable
- **Binago** Ang boolean `>>` output ay kasama na ngayon ang `#` prefix (`#0` / `#1`) sa lahat ng mode

### v0.0.2_01 — Pagpapalit ng Pangalan ng Operator _(30 Mar 2026)_

- **Binago** `c|..|` → `#,|..|` at `e|..|` → `#^|..|` — naaayon sa pamilya ng `#` format prefix
- **Idinagdag** Export alias: muling i-export ang mga miyembro ng module sa ibang pangalan

### v0.0.2 — Muling Pagdisenyo ng Collection API & Mga Installer _(24 Mar 2026)_

- **Idinagdag** Pinag-isang pamilya ng `$` operator para sa mga array at teksto (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Idinagdag** Destructuring assignment para sa mga array, tuple, at pinangalanang tuple
- **Idinagdag** Mga negatibong index (`arr[-1]` = huling elemento)
- **Idinagdag** Mga native installer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Idinagdag** Compound assignment `^=`
- **Naayos** Mga edge case ng aritmetika ng parser; mga pagwawasto sa dokumentasyon

### v0.0.1 — Unang Pampublikong Paglabas _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× mas mabilis, ~95% pagkakatugma)
- Lahat ng pangunahing construct: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Buong Unicode identifier, sistema ng module, lambdas, closure, paghawak ng error
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Simboliko. Pangkalahatan. Hindi Nababago._
