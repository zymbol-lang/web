# Zymbol-Lang Þétt Handbók

**Zymbol-Lang** er táknrænt forritunarmál. Það notar engin lykilorð — allt er tákn. Það virkar eins í öllum mannlegum tungumálum.

---

## Heimspeki

- Engin lykilorð (`ef`, `lykkja`, `skilað` eru ekki til — aðeins tákn `?`, `@`, `<~`)
- Fullt Unicode — auðkenni á hvaða tungumáli eða emoji 👋
- Tungumálahlutlægt — kóðinn er eins á öllum tungumálum

---

## Breytur og Fastar

```zymbol
x = 10           // breyta (breytanleg)
PI := 3.14159    // fasti (óbreytanlegur — villa ef endurúthlutað)
nafn = "Ana"
virkt = #1       // bool satt
👋 := "Halló"
```

### Samsettar Úthlutanir

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

## Gagnagerðir

| Gerð          | Dæmi                | `#?` Tákn   | Athugasemdir                      |
|---------------|---------------------|-------------|-----------------------------------|
| Heiltala      | `42`, `-7`          | `###`       | 64-bita með formerki              |
| Fleytitala    | `3.14`, `1.5e10`    | `##.`       | Vísindaleg táknun OK              |
| Strengur      | `"halló"`           | `##"`       | Breytuinnsetning: `"Halló {nafn}"` |
| Stafur        | `'A'`               | `##'`       | Eitt Unicode-tákn                 |
| Boole-gildi   | `#1`, `#0`          | `##?`       | EKKI tölulegt 1 og 0              |
| Fylki         | `[1, 2, 3]`         | `##]`       | Öll stök verða að vera sama gerð  |
| Tuple         | `(a, b)`            | `##)`       | Staðsetningarlægt                 |
| Nafngreint Tuple | `(x: 1, y: 2)`   | `##)`       | Aðgangur með nafni eða númer      |

---

## Úttak og Inntök

```zymbol
// Úttak — bætir EKKI við línuskipti sjálfkrafa
>> "Halló, Íslenskumælandi heimur!" ¶    // ¶ eða \\ gefur bein línuskipti
>> "a=" a " b=" b ¶                       // mörg gildi með hlið við hlið
>> "summa=" add(2, 3) ¶                   // fallakall í hvaða stöðu sem er
>> (ávöxtur$#) ¶                          // viðskeytisaðgerðir krefjast sviga

// Inntök
<< nafn                                   // engin kvaðning — les í breytu
<< "Nafnið þitt? " nafn                   // með kvaðningu
```

> `¶` eða `\\` eru jafngildar sem línuskipti.

---

## Strengjatenging

Þrjár gildar myndir — hvert fyrir sitt samhengi:

```zymbol
nafn = "Ana"
tala = 25

// 1. Komma — í úthlutun með = eða :=
skilaboð = "Halló ", nafn, "!"              // → Halló Ana!
TITILL := "Notandi: ", nafn

// 2. Hlið við hlið — í >> úttak
>> "Halló " nafn " þú ert " tala ¶          // → Halló Ana þú ert 25

// 3. Breytuinnsetning — í hvaða samhengi sem er
lýsing = "Halló {nafn}, þú ert {tala}"     // → Halló Ana, þú ert 25
```

> **Athugið**: `+` er aðeins fyrir tölur. Að nota það með strengjum gefur viðvörun.

---

## Stýriflæði

```zymbol
x = 7

// Einfalt ef
? x > 0 { >> "jákvætt" ¶ }

// ef / ef-annars / annars
? x > 100 {
    >> "stórt" ¶
} _? x > 0 {
    >> "jákvætt" ¶
} _? x == 0 {
    >> "núll" ¶
} _ {
    >> "neikvætt" ¶
}
```

Blokkir `{ }` eru **nauðsynlegar** jafnvel fyrir eina línu.

---

## Passa

```zymbol
// Passa með bil
stig = 85
einkunn = ?? stig {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> einkunn ¶    // → B

// Passa með gæsluþingum (handvaldar skilyrðar)
hitastig = -5
ástand = ?? hitastig {
    _? hitastig < 0  : "ís"
    _? hitastig < 20 : "kalt"
    _? hitastig < 35 : "hlýtt"
    _                : "heitt"
}
>> ástand ¶    // → ís

// Passa með strengjum
litur = "rauður"
kóði = ?? litur {
    "rauður"  : "#FF0000"
    "grænn"   : "#00FF00"
    _         : "#000000"
}
>> kóði ¶
```

---

## Lykkjur

```zymbol
// Innifalið bil: 0..4 ítrar 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Bil með skrefi
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Öfugt bil
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Meðan
tala = 1
@ tala <= 64 { tala *= 2 }
>> tala ¶    // → 128

// Fyrir-hvert yfir fylki
ávöxtur = ["epli", "pera", "þrúga"]
@ f:ávöxtur { >> f ¶ }

// Yfir strengstafi
@ c:"halló" { >> c "-" }
>> ¶    // → h-a-l-l-ó-

// Break og Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> halda áfram
    ? i > 7 { @! }          // @! brjóta
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Föll

```zymbol
// Yfirlýsing og kall
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

// Endurkvæmni
tvöfaldur(n) {
    ? n <= 1 { <~ 1 }
    <~ n * tvöfaldur(n - 1)
}
>> tvöfaldur(5) ¶    // → 120

// Föll hafa einangrað umfang — engin aðgangur að ytri breytum
altækt = 100
prófa() {
    x = 42    // aðeins staðbundið
    <~ x
}
>> prófa() ¶    // → 42
```

> **Mikilvægt**: Nafngreind föll `nafn(breytur){ }` eru ekki fyrstur flokks gildi.
> Til að senda sem rök, vefja: `x -> nafn(x)`.

---

## Lambdaföll og Lokanir

```zymbol
// Einfalt lambda (óbein skilagildi)
tvöfaldur = x -> x * 2
summa = (a, b) -> a + b
>> tvöfaldur(5) ¶    // → 10
>> summa(3, 7) ¶     // → 10

// Blokklamda (bein skilagildi)
flokkaðu = x -> {
    ? x > 0 { <~ "jákvætt" }
    _? x < 0 { <~ "neikvætt" }
    <~ "núll"
}
>> flokkaðu(5) ¶     // → jákvætt
>> flokkaðu(0) ¶     // → núll
>> flokkaðu(-5) ¶    // → neikvætt

// Lokanir — lambdaföll fanga ytri umfangsbreytur
stuðull = 3
þreföldur = x -> x * stuðull    // fangar 'stuðull'
>> þreföldur(7) ¶    // → 21

// Fallsverksmiðja
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdaföll sem gildi: geymd í fylkjum
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Fylki

```zymbol
arr = [10, 20, 30, 40, 50]

// Aðgangur (0-byggt númer)
>> arr[0] ¶    // → 10

// Lengd (krefst sviga í >>)
tala = arr$#
>> (arr$#) ¶    // → 5

// Bæta við, fjarlægja, inniheldur, sneiðing
arr = arr$+ 60               // bæta við
arr = arr$- 0                // fjarlægja númer 0
hefur = arr$? 30             // → #1
sneiðing = arr$[0..2]        // [20, 30]

// Uppfæra stak
arr[1] = 99

// Fyrir-hvert
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` skila **nýju fylki** — úthluta aftur: `arr = arr$+ 4`.
> Engin keðjun: nota tvær aðskildar úthlutanir.

---

## Tuples

```zymbol
// Nafngreint tuple
einstaklingur = (name: "Alice", age: 25)
>> einstaklingur.name ¶    // → Alice
>> einstaklingur.age ¶     // → 25
>> einstaklingur[0] ¶      // → Alice (númer virkar líka)
```

---

## Hærri Stigs Föll

Hærri stigs aðgerðir krefjast **innbyggðs lambda** — ekki beint lambdabreyta.

```zymbol
tölur = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Kortleggja ($>)
tvöfaldar = tölur$> (x -> x * 2)
>> tvöfaldar ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Sía ($|)
jafntala = tölur$| (x -> x % 2 == 0)
>> jafntala ¶    // → [2, 4, 6, 8, 10]

// Minnka ($<) — (upphafsgildi, (safn, stak) -> segð)
samtals = tölur$< (0, (acc, x) -> acc + x)
>> samtals ¶    // → 55
```

---

## Meðhöndlun Villna

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deiling með núll" ¶
} :! ##IO {
    >> "IO villa" ¶
} :! {
    >> "önnur villa: " _err ¶
} :> {
    >> "keyrir alltaf" ¶
}
```

| Gerð        | Þegar hún kemur fram      |
|-------------|---------------------------|
| `##Div`     | Deiling með núll          |
| `##IO`      | Skrá / kerfi              |
| `##Index`   | Númer utan marka          |
| `##Type`    | Gerðarvilla               |
| `##Parse`   | Gagnaþáttun               |
| `##Network` | Netvilla                  |
| `##_`       | Hvaða villa sem er        |

---

## Einingar

```zymbol
// Skrá: lib/calc.zy
# calc

#> { add, get_PI }    // útflutningur ÁÐUR EN skilgreiningar

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Skrá: main.zy
<# ./lib/calc <= c    // gælunafn nauðsynlegt

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Heildardæmi: FizzBuzz

```zymbol
flokkaðu(tala) {
    ? tala % 15 == 0 { <~ "FreyðSurr" }
    _? tala % 3  == 0 { <~ "Freyð" }
    _? tala % 5  == 0 { <~ "Surr" }
    _ { <~ tala }
}

@ i:1..20 { >> flokkaðu(i) ¶ }
```

---

## Táknaviðmið

| Tákn    | Aðgerð             | Tákn       | Aðgerð              |
|---------|--------------------|------------|---------------------|
| `=`     | breyta             | `$#`       | lengd               |
| `:=`    | fasti              | `$+`       | bæta við            |
| `>>`    | úttak              | `$-`       | fjarlægja (númer)   |
| `<<`    | inntök             | `$?`       | inniheldur          |
| `¶`/`\` | línuskipti         | `$[s..e]`  | sneiðing            |
| `?`     | ef                 | `$>`       | kortleggja          |
| `_?`    | ef-annars          | `$\|`      | sía                 |
| `_`     | annars / algildi   | `$<`       | minnka              |
| `??`    | passa              | `!?`       | reyna               |
| `@`     | lykkja             | `:!`       | grípa               |
| `@!`    | brjóta             | `:>`       | að lokum            |
| `@>`    | halda áfram        | `$!`       | er villa            |
| `->`    | lambda             | `$!!`      | dreifa villu        |
| `<~`    | skila              | `#`        | lýsa einingu        |
| `\|>`   | pípa               | `#>`       | útflutningur        |
| `#1`    | satt               | `<#`       | innflutningur       |
| `#0`    | ósatt              | `::`       | eininga kall        |

---

*Zymbol-Lang — Táknrænt. Alheimslegt. Óbreytanlegt.*

---

> **Fyrirvari:** Þessi skjölun var búin til og þýdd af gervigreind (GG). Allt hefur verið gert til að tryggja nákvæmni, en sumar þýðingar eða dæmi geta innihaldið villur. Heimildarvísunin er [Zymbol-Lang forskrift](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
