# Maikling Gabay sa Zymbol-Lang

**Zymbol-Lang** ay isang simbolikong wika ng programa. Walang mga keyword — lahat ay simbolo. Gumagana nang pareho sa anumang wikang pantao.

> **Babala:** Ang dokumentasyong ito ay nilikha at isinalin ng artipisyal na katalinuhan (AI).
> Ang lahat ng pagsisikap ay ginawa upang matiyak ang katumpakan, ngunit ang ilang pagsasalin o halimbawa ay maaaring maglaman ng mga pagkakamali.
> Ang kanonikong sanggunian ay ang [detalye ng Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.

---

## Pilosopiya

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

### Kumplikadong Pagtatalaga

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %= 4    // 2
x++       // 3
x--       // 2
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

---

## Output at Input

```zymbol
// Output — HINDI awtomatikong nagdaragdag ng bagong linya
>> "Kamusta" ¶                         // ¶ o \\ ay nagbibigay ng bagong linya
>> "a=" a " b=" b ¶                    // maramihang halaga sa pamamagitan ng juxtaposition
>> "kabuuan=" kabuuan(2, 3) ¶          // mga function call sa anumang posisyon
>> (hanay$#) ¶                         // ang mga postfix operator ay nangangailangan ng panaklong

// Input
<< pangalan                            // walang prompt — nagbabasa sa variable
<< "Ang iyong pangalan? " pangalan     // may prompt
```

> `¶` o `\\` ay katumbas bilang bagong linya.

---

## Pagsasama ng String

Tatlong wastong paraan — bawat isa para sa kontekstong nito:

```zymbol
pangalan = "Ana"
n = 25

// 1. Kuwit — sa mga pagtatalaga gamit ang = o :=
mensahe = "Kamusta ", pangalan, "!"       // → Kamusta Ana!
TITULO := "Gumagamit: ", pangalan

// 2. Juxtaposition — sa >> output
>> "Kamusta " pangalan " ikaw ay " n ¶    // → Kamusta Ana ikaw ay 25

// 3. Interpolasyon — sa anumang konteksto
paglalarawan = "Kamusta {pangalan}, ikaw ay {n}"    // → Kamusta Ana, ikaw ay 25
```

> **Tala**: `+` ay para sa mga numero lamang. Ang paggamit nito sa mga string ay nagbibigay ng babala.

---

## Kontrol ng Daloy

```zymbol
x = 7

// Simpleng if
? x > 0 { >> "positibo" ¶ }

// if / else-if / else
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

Ang mga bloke `{ }` ay **kinakailangan** kahit para sa isang linya.

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

// Pagtutugma na may mga bantay (mga di-tiyak na kondisyon)
temperatura = -5
kalagayan = ?? temperatura {
    _? temperatura < 0  : "yelo"
    _? temperatura < 20 : "malamig"
    _? temperatura < 35 : "mainit-init"
    _                   : "mainit"
}
>> kalagayan ¶    // → yelo

// Pagtutugma na may mga string
kulay = "pula"
code = ?? kulay {
    "pula"   : "#FF0000"
    "berde"  : "#00FF00"
    _        : "#000000"
}
>> code ¶
```

---

## Mga Loop

```zymbol
// Inklusibong saklaw: 0..4 ay umuulit 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Saklaw na may hakbang
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Baligtad na saklaw
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// While
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// For-each sa array
mga_prutas = ["mansanas", "peras", "ubas"]
@ p:mga_prutas { >> p ¶ }

// Sa mga character ng string
@ c:"kamusta" { >> c "-" }
>> ¶    // → k-a-m-u-s-t-a-

// Break at Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> ituloy
    ? i > 7 { @! }          // @! ihinto
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Mga Function

```zymbol
// Deklarasyon at tawag
kabuuan(a, b) { <~ a + b }
>> kabuuan(3, 4) ¶    // → 7

// Recursion
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Ang mga function ay may nakahiwalay na saklaw — walang access sa mga panlabas na variable
_pandaigdig = 100
subukan() {
    x = 42    // lokal lamang
    <~ x
}
>> subukan() ¶    // → 42
```

> **Mahalaga**: Ang mga pinangalanang function na `pangalan(mga_param){ }` ay hindi mga first-class na halaga.
> Upang ipasa bilang argumento, balutin: `x -> kabuuan(x)`.

---

## Lambda at Closure

```zymbol
// Simpleng lambda (implicit na pagbabalik)
doble = x -> x * 2
kabuuan = (a, b) -> a + b
>> doble(5) ¶       // → 10
>> kabuuan(3, 7) ¶  // → 10

// Block lambda (explicit na pagbabalik)
uri_ng_halaga = x -> {
    ? x > 0 { <~ "positibo" }
    _? x < 0 { <~ "negatibo" }
    <~ "sero"
}
>> uri_ng_halaga(5) ¶     // → positibo
>> uri_ng_halaga(0) ¶     // → sero
>> uri_ng_halaga(-5) ¶    // → negatibo

// Mga Closure — ang mga lambda ay kumukuha ng mga variable mula sa panlabas na saklaw
salik = 3
tatlong_beses = x -> x * salik    // kumukuha ng 'salik'
>> tatlong_beses(7) ¶    // → 21

// Function factory
gumawa_ng_tagadagdag(n) { <~ x -> x + n }
dagdag10 = gumawa_ng_tagadagdag(10)
>> dagdag10(5) ¶    // → 15

// Mga lambda bilang halaga: iimbak sa mga array
mga_operasyon = [x -> x+1, x -> x*2, x -> x*x]
>> mga_operasyon[0](5) ¶    // → 6
>> mga_operasyon[2](5) ¶    // → 25
```

---

## Hanay

```zymbol
hanay = [10, 20, 30, 40, 50]

// Access (index na nagsisimula sa 0)
>> hanay[0] ¶    // → 10

// Haba (nangangailangan ng panaklong sa >>)
n = hanay$#
>> (hanay$#) ¶    // → 5

// Idagdag, alisin, naglalaman, hiwa
hanay = hanay$+ 60               // idagdag
hanay = hanay$- 0                // alisin ang index 0
mayroon = hanay$? 30             // → #1
hiwa = hanay$[0..2]              // [20, 30]

// I-update ang elemento
hanay[1] = 99

// For-each
@ x:hanay { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` ay nagbabalik ng **bagong array** — italaga ulit: `hanay = hanay$+ 4`.
> Walang chaining: gumamit ng dalawang hiwalay na pagtatalaga.

---

## Tuple

```zymbol
// Pinangalanang tuple
tao = (pangalan: "Alisa", edad: 25)
>> tao.pangalan ¶    // → Alisa
>> tao.edad ¶        // → 25
>> tao[0] ¶          // → Alisa (gumagana rin ang index)
```

---

## Mataas na Antas na Mga Function

Ang mga operator ng HOF ay nangangailangan ng **inline lambda** — hindi isang direktang lambda variable.

```zymbol
mga_bilang = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
mga_doble = mga_bilang$> (x -> x * 2)
>> mga_doble ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
mga_pantay = mga_bilang$| (x -> x % 2 == 0)
>> mga_pantay ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (paunang halaga, (acc, elem) -> expr)
kabuuan_lahat = mga_bilang$< (0, (acc, x) -> acc + x)
>> kabuuan_lahat ¶    // → 55
```

---

## Paghawak ng Error

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "paghahati sa sero" ¶
} :! ##IO {
    >> "error sa IO" ¶
} :! {
    >> "ibang error: " _err ¶
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
// File: lib/calc.zy
# calc

#> { kabuuan, kuha_PI }    // mga export BAGO ang mga kahulugan

_PI := 3.14159
kabuuan(a, b) { <~ a + b }
kuha_PI() { <~ _PI }
```

```zymbol
// File: pangunahin.zy
<# ./lib/calc <= c    // kinakailangan ang alias

>> c::kabuuan(5, 3) ¶     // → 8
pi = c::kuha_PI()
>> pi ¶                    // → 3.14159
```

---

## FizzBuzz

```zymbol
uriin(bilang) {
    ? bilang % 15 == 0 { <~ "BulaUgong" }
    _? bilang % 3  == 0 { <~ "Bula" }
    _? bilang % 5  == 0 { <~ "Ugong" }
    _ { <~ bilang }
}

@ i:1..20 { >> uriin(i) ¶ }
```

> Halimbawa ng output: `1 2 Bula 4 Ugong Bula 7 8 Bula Ugong 11 Bula 13 14 BulaUgong ...`

---

## Kumpletong Halimbawa: Kamusta, Mundo

```zymbol
// Pagbati gamit ang interpolasyon
pangalan = "Filipino na Mundo"
mensahe = "Kamusta, ", pangalan, "!"
>> mensahe ¶    // → Kamusta, Filipino na Mundo!

// O direkta
>> "Kamusta, Filipino na Mundo!" ¶
```

---

## Sanggunian ng Simbolo

| Simbolo   | Operasyon             | Simbolo      | Operasyon                |
|-----------|-----------------------|--------------|--------------------------|
| `=`       | variable              | `$#`         | haba                     |
| `:=`      | konstante             | `$+`         | idagdag                  |
| `>>`      | output                | `$-`         | alisin (sa index)        |
| `<<`      | input                 | `$?`         | naglalaman               |
| `¶`/`\`   | bagong linya          | `$[s..e]`    | hiwa                     |
| `?`       | kung (if)             | `$>`         | mapa (map)               |
| `_?`      | kung hindi (else-if)  | `$\|`        | salain (filter)          |
| `_`       | iba pa / wildcard     | `$<`         | bawasan (reduce)         |
| `??`      | tumugma (match)       | `!?`         | subukan (try)            |
| `@`       | loop                  | `:!`         | hulihin (catch)          |
| `@!`      | ihinto (break)        | `:>`         | sa wakas (finally)       |
| `@>`      | ituloy (continue)     | `$!`         | ay error                 |
| `->`      | lambda                | `$!!`        | ipalaganap ng error      |
| `<~`      | ibalik (return)       | `#`          | ideklara ang module      |
| `\|>`     | tubo (pipe)           | `#>`         | i-export                 |
| `#1`      | totoo (true)          | `<#`         | i-import                 |
| `#0`      | mali (false)          | `::`         | tawag sa module          |

---

*Zymbol-Lang — Simboliko. Pandaigdig. Hindi Nagbabago.*

---

> **Babala:** Ang dokumentasyong ito ay nilikha at isinalin ng artipisyal na katalinuhan (AI).
> Ang lahat ng pagsisikap ay ginawa upang matiyak ang katumpakan, ngunit ang ilang pagsasalin o halimbawa ay maaaring maglaman ng mga pagkakamali.
> Ang kanonikong sanggunian ay ang [detalye ng Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
