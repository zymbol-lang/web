# Buug-yaraha Kooban ee Zymbol-Lang

**Zymbol-Lang** waa luqad barnaamij ah oo astaan ah. Ereyada muhiimka ah ma isticmaasho — wax kastaa astaan. Si isku mid ah ayey ugu shaqeysaa luqadda aadanaha kasta.

---

## Falsafada

- Ereyada muhiimka ah ma jiraan (`if`, `while`, `return` ma jiraan — astaamaha kaliya `?`, `@`, `<~`)
- Unicode buuxa — magacyada kasta oo luqad ah ama emoji 👋
- Luqad-agoon — koodka wuu isku mid yahay dhammaan luqadaha

---

## Doorsoomayaasha iyo Joogta

```zymbol
x = 10           // Doorsoomaha (wax laga beddeli karo)
PI := 3.14159    // Joogta (wax laga beddeli karin — khalad haddii dib loo qoondeeyo)
magac = "Ana"
run = #1         // Boolean run
👋 := "Nabad"
```

### Qeybinta Dheelitiran

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Noocyada Xogta

| Nooca            | Tusaale             | Astaan `#?` | Xusuus-qoryo                         |
|------------------|---------------------|-------------|--------------------------------------|
| Tiro Buuxda      | `42`, `-7`          | `###`       | 64-Bit oo calaamad leh               |
| Tiro Jajaban     | `3.14`, `1.5e10`    | `##.`       | Xisaabta sayniska OK                 |
| Xaraf-xidid      | `"nabad"`           | `##"`       | Gelinta: `"Nabad {magac}"`           |
| Xaraf Keliya     | `'A'`               | `##'`       | Xaraf Unicode ah oo keliya           |
| Boolean          | `#1`, `#0`          | `##?`       | MA aha tiroyinka 1 iyo 0             |
| Taxane           | `[1, 2, 3]`         | `##]`       | Dhammaan xubnuhu waa nooc isku mid ah|
| Tupul            | `(a, b)`            | `##)`       | Meel-meel                            |
| Tupul La Magacaabay | `(x: 1, y: 2)`  | `##)`       | Galitaanka magac ama tirsi            |

---

## Muujinta iyo Galinta

```zymbol
// Muujinta — MA DHIGTO xarfaha-saarka si toos ah
>> "Nabad" ¶                    // ¶ ama \\ waxay bixisaa xaraf-saarka cad
>> "a=" a " b=" b ¶             // qiyamyo badan oo ku xiga
>> "wadarta=" ku_dar(2, 3) ¶    // wicitaanka hawlaha meel kastaba
>> (arr$#) ¶                    // hawlaha postfix waxay u baahan yihiin xagasha

// Galinta
<< magac                        // la'aanta tilmaan — akhrinta doorsoomaha
<< "Magacaaga? " magac          // tilmaan leh
```

> `¶` ama `\\` waxay u dhiganyihiin xaraf-saarka.

---

## Isku Xidka Xarafaha

Saddex qaab oo sax ah — mid kasta meelaheeda:

```zymbol
magac = "Ana"
tiro = 25

// 1. Xigashada (,) — ku jira qoondaynta = ama :=
fariin = "Nabad ", magac, "!"                // → Nabad Ana!
CINWAAN := "Isticmaale: ", magac

// 2. Ku-xigeenka — ku jira muujinta >>
>> "Nabad " magac " waxaad tahay " tiro ¶   // → Nabad Ana waxaad tahay 25

// 3. Gelinta — meel kasta
sharax = "Nabad {magac}, waxaad tahay {tiro}"  // → Nabad Ana, waxaad tahay 25
```

> **Xusuus-qor**: `+` waa tiroyinka keliya. Xaraf-xididka waxay soo saartaa digniin.

---

## Xukumaynta Socodka

```zymbol
x = 7

// Haddii fudud
? x > 0 { >> "togan" ¶ }

// Haddii / haddii-kalena / haddii-kale
? x > 100 {
    >> "weyn" ¶
} _? x > 0 {
    >> "togan" ¶
} _? x == 0 {
    >> "eber" ¶
} _ {
    >> "tirsi" ¶
}
```

Xagashada `{ }` waa **waajib**, xitaa xariiq keliya.

---

## Match

```zymbol
// Match oo leh kala-duwanaansho
dhibcood = 85
qiimaha = ?? dhibcood {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> qiimaha ¶    // → B

// Match oo leh ilaaliyayaasha (shuruudo kasta)
heer = -5
xaalad = ?? heer {
    _? heer < 0  : "baraf"
    _? heer < 20 : "qabow"
    _? heer < 35 : "diiran"
    _            : "kulul"
}
>> xaalad ¶    // → baraf

// Match oo leh xaraf-xididyo
midab = "cas"
kood = ?? midab {
    "cas"   : "#FF0000"
    "cagaar": "#00FF00"
    _       : "#000000"
}
>> kood ¶
```

---

## Wareegyada

```zymbol
// Kala-duwanaanshaha dhameystiran: 0..4 wuxuu ku wareegaa 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Kala-duwanaansho leh tallaabo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Kala-duwanaansho dib-u-rogal
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Intay jirto (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Xubin kasta
khudaar = ["Tufaax", "Muus", "Canab"]
@ f:khudaar { >> f ¶ }

// Xarafaha xaraf-xididka
@ c:"nabad" { >> c "-" }
>> ¶    // → n-a-b-a-d-

// Jooji iyo Sii-wad
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> sii-wad
    ? i > 7 { @! }          // @! jooji
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Hawlaha

```zymbol
// Bayaan iyo wicitaan
ku_dar(a, b) { <~ a + b }
>> ku_dar(3, 4) ¶    // → 7

// Dib-u-noqosho
xasaab(n) {
    ? n <= 1 { <~ 1 }
    <~ n * xasaab(n - 1)
}
>> xasaab(5) ¶    // → 120

// Hawluhu waxay leeyihiin xudduud gooni ah — ma gaadaan doorsoomayaasha dibadda
global = 100
tijaabin() {
    x = 42    // maxalli kaliya
    <~ x
}
>> tijaabin() ¶    // → 42
```

> **Muhiim**: Hawlaha la magacaabay `magac(params){ }` ma ahan qiyam heer-koowaad.
> Si loogu gudbiyoo dood ahaan, geli: `x -> magac(x)`.

---

## Lambda iyo Xidhidka

```zymbol
// Lambda fudud (noqosho damaad ah)
laban_laab = x -> x * 2
wadarta = (a, b) -> a + b
>> laban_laab(5) ¶    // → 10
>> wadarta(3, 7) ¶    // → 10

// Lambda leh xagasha (noqosho cad)
kala_sooc = x -> {
    ? x > 0 { <~ "togan" }
    _? x < 0 { <~ "tirsi" }
    <~ "eber"
}
>> kala_sooc(5) ¶     // → togan
>> kala_sooc(0) ¶     // → eber
>> kala_sooc(-5) ¶    // → tirsi

// Xidhidyo — Lambdas waxay qaadanaan doorsoomayaasha dibadda
qiimayn = 3
saddex_laab = x -> x * qiimayn    // waxay qaadataa 'qiimayn'
>> saddex_laab(7) ¶    // → 21

// Warshada hawlaha
samee_kudar(n) { <~ x -> x + n }
kudar10 = samee_kudar(10)
>> kudar10(5) ¶    // → 15

// Lambdas qiyam ahaan: ku kaydsan taxanaha
hawlaha = [x -> x+1, x -> x*2, x -> x*x]
>> hawlaha[0](5) ¶    // → 6
>> hawlaha[2](5) ¶    // → 25
```

---

## Taxanayaasha

```zymbol
arr = [10, 20, 30, 40, 50]

// Galitaanka (tilsi aasaas-0)
>> arr[0] ¶    // → 10

// Dhererka (xagasha ku >> waajib)
n = arr$#
>> (arr$#) ¶    // → 5

// Ku-dar, ka-saar, ku-jiraa, goyn
arr = arr$+ 60               // ku-dar
arr = arr$- 0                // tilsi 0 ka-saar
jiraa = arr$? 30             // → #1
goyn = arr$[0..2]            // [20, 30]

// Xubin cusbooneysii
arr[1] = 99

// Xubin kasta
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` waxay soo celiyaan **taxane cusub** — dib u qoondee: `arr = arr$+ 4`.
> Silsiladayn ma jirto: isticmaal laba qoondayn oo gooni ah.

---

## Tupulaha

```zymbol
// Tupul la magacaabay
qof = (magac: "Alice", da: 25)
>> qof.magac ¶    // → Alice
>> qof.da ¶       // → 25
>> qof[0] ¶       // → Alice (tilsiga wuu shaqeeyaa sidoo kale)
```

---

## Hawlaha Heerka Sare

Hawlaha HOF waxay u baahan yihiin **lambda-gooni-ah** — doorsoomaha lambda ma toos ah.

```zymbol
tirooyin = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
laban_laaban = tirooyin$> (x -> x * 2)
>> laban_laaban ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
lablaab = tirooyin$| (x -> x % 2 == 0)
>> lablaab ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (qiimaha bilowga, (ururiyaha, xubnta) -> muujin)
wadarta = tirooyin$< (0, (acc, x) -> acc + x)
>> wadarta ¶    // → 55
```

---

## Maaraynta Khaladaadka

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "qaybinta eber" ¶
} :! ##IO {
    >> "khaladka IO" ¶
} :! {
    >> "khalad kale: " _err ¶
} :> {
    >> "had iyo jeer waa socdaa" ¶
}
```

| Nooca       | Goorta ay dhacdo                  |
|-------------|-----------------------------------|
| `##Div`     | Qaybinta eber                     |
| `##IO`      | Faylka / Nidaamka                 |
| `##Index`   | Tilsiga ka baxsan kala-duwanaanshaha |
| `##Type`    | Khaladka nooca                    |
| `##Parse`   | Khaladka falanqaynta              |
| `##Network` | Khaladka shabakadda               |
| `##_`       | Khalad kasta (qabasho-dhammaad)   |

---

## Moduulada

```zymbol
// Faylka: lib/xisaab.zy
# xisaab

#> { ku_dar, hel_PI }    // Dhoofinta KA HOR qeybaha

_PI := 3.14159
ku_dar(a, b) { <~ a + b }
hel_PI() { <~ _PI }
```

```zymbol
// Faylka: main.zy
<# ./lib/xisaab <= x    // Magac-dhaadhicin waajib ah

>> x::ku_dar(5, 3) ¶  // → 8
pi = x::hel_PI()
>> pi ¶                // → 3.14159
```

---

## Tusaale Buuxa: FizzBuzz

```zymbol
kala_sooc(tiro) {
    ? tiro % 15 == 0 { <~ "FizziBuzzi" }
    _? tiro % 3  == 0 { <~ "Fizzi" }
    _? tiro % 5  == 0 { <~ "Buzzi" }
    _ { <~ tiro }
}

@ i:1..20 { >> kala_sooc(i) ¶ }
```

---

## Tixraaca Astaamaha

| Astaan  | Hawsha             | Astaan     | Hawsha                |
|---------|--------------------|------------|-----------------------|
| `=`     | Doorsoomaha        | `$#`       | Dhererka              |
| `:=`    | Joogta             | `$+`       | ku-dar                |
| `>>`    | Muujinta           | `$-`       | ka-saar (tilsi ahaan) |
| `<<`    | Galinta            | `$?`       | ku-jiraa              |
| `¶`/`\` | Xaraf-saarka       | `$[s..e]`  | Goynta                |
| `?`     | haddii (if)        | `$>`       | map                   |
| `_?`    | haddii-kalena (elif)| `$\|`     | filter                |
| `_`     | haddii-kale / meel-buuxin | `$<` | reduce             |
| `??`    | match              | `!?`       | isku-day (try)        |
| `@`     | Wareegga           | `:!`       | qaado (catch)         |
| `@!`    | jooji (break)      | `:>`       | had-jeer (finally)    |
| `@>`    | sii-wad (continue) | `$!`       | khalad ma ah          |
| `->`    | Lambda             | `$!!`      | khaladka gudbii       |
| `<~`    | soo-celi           | `#`        | moduulka bayaan       |
| `\|>`   | Pipe               | `#>`       | dhoofi                |
| `#1`    | run                | `<#`       | keeno                 |
| `#0`    | been               | `::`       | wicitaanka moduulka   |

---

*Zymbol-Lang — Astaan. Caalami. Joogto.*

---

> **Ogeysiis:** Buug-yarahani waxaa sameeya oo tarjumay Garashada Macquulka ah (AI).
> Wax walba ayaa lagu dadaalay si loo hubiyo saxnaanta, laakiin tarjumaadaha qaar ama tusaalooyinka waxaa laga yaabaa inay khaladaad leeyihiin.
> Tixraaca rasmiga ah waa [Qeybinta Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
