# Kompakti Zymbol-Lang-dokumentaatio

**Zymbol-Lang** on symbolinen ohjelmointikieli. Se ei käytä avainsanoja — kaikki on symboleja. Se toimii samalla tavalla kaikilla ihmiskielillä.

---

## Filosofia

- Ei avainsanoja (`if`, `while`, `return` eivät ole olemassa — vain symbolit `?`, `@`, `<~`)
- Täysi Unicode — tunnisteet millä tahansa kielellä tai emojilla 👋
- Kieliagnostinen — koodi on identtinen kaikilla kielillä

---

## Muuttujat ja Vakiot

```zymbol
x = 10          // muuttuja (muutettava)
PI := 3.14159   // vakio (muuttumaton — virhe uudelleensijoituksessa)
nimi = "Ana"
aktiivinen = #1 // totuusarvo tosi
👋 := "Hei"
```

### Yhdistetty Sijoitus

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

## Tietotyypit

| Tyyppi          | Esimerkki           | Symboli `#?` | Huomiot                               |
|-----------------|---------------------|--------------|---------------------------------------|
| Kokonaisluku    | `42`, `-7`          | `###`        | 64-bit etumerkillinen                 |
| Liukuluku       | `3.14`, `1.5e10`    | `##.`        | Tieteellinen merkintätapa OK          |
| Merkkijono      | `"hei"`             | `##"`        | Interpolaatio: `"Hei {nimi}"`         |
| Merkki          | `'A'`               | `##'`        | Yksi Unicode-merkki                   |
| Totuusarvo      | `#1`, `#0`          | `##?`        | EI numeerisia 1 ja 0                  |
| Taulukko        | `[1, 2, 3]`         | `##]`        | Kaikki elementit samaa tyyppiä        |
| Monikko         | `(a, b)`            | `##)`        | Paikallinen                           |
| Nimetty monikko | `(x: 1, y: 2)`      | `##)`        | Pääsy nimellä tai indeksillä          |

---

## Tulostus ja Syöte

```zymbol
// Tulostus — EI automaattista rivinvaihtoa
>> "Hei" ¶                     // ¶ tai \\ antaa eksplisiittisen rivinvaihdon
>> "a=" a " b=" b ¶            // useita arvoja rinnakkainasettelulla
>> "summa=" laske(2, 3) ¶      // funktiokutsut missä tahansa kohdassa
>> (arr$#) ¶                   // postfix-operaattorit vaativat sulkeet

// Syöte
<< nimi                        // ilman kehotetta — lukee muuttujaan
<< "Nimi? " nimi               // kehottella
```

> `¶` tai `\\` on rivinvaihdon vastaava.

---

## Merkkijonojen Yhdistäminen

Kolme pätevää tapaa — kukin omaan kontekstiinsa:

```zymbol
nimi = "Ana"
luku = 25

// 1. Pilkku — sijoituksissa = tai :=
msg = "Hei ", nimi, "!"                    // → Hei Ana!
OTSIKKO := "Käyttäjä: ", nimi

// 2. Rinnakkainasettelu — tulostuksessa >>
>> "Hei " nimi " olet " luku " vuotta vanha" ¶   // → Hei Ana olet 25 vuotta vanha

// 3. Interpolaatio — missä tahansa kontekstissa
desc = "Hei {nimi}, olet {luku} vuotta vanha"    // → Hei Ana, olet 25 vuotta vanha
```

> **Huomio**: `+` on vain numeroille. Käyttö merkkijonoilla antaa varoituksen.

---

## Ohjausrakenne

```zymbol
x = 7

// Yksinkertainen jos
? x > 0 { >> "positiivinen" ¶ }

// Jos / muuten jos / muuten
? x > 100 {
    >> "suuri" ¶
} _? x > 0 {
    >> "positiivinen" ¶
} _? x == 0 {
    >> "nolla" ¶
} _ {
    >> "negatiivinen" ¶
}
```

Lohkot `{ }` ovat **pakollisia** vaikka ne sisältäisivät vain yhden rivin.

---

## Match

```zymbol
// Match intervallien kanssa
pisteet = 85
arvosana = ?? pisteet {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> arvosana ¶    // → B

// Match vartijoiden (ehtojen) kanssa
lämpötila = -5
tila = ?? lämpötila {
    _? lämpötila < 0  : "jää"
    _? lämpötila < 20 : "kylmä"
    _? lämpötila < 35 : "lämmin"
    _                 : "kuuma"
}
>> tila ¶    // → jää

// Match merkkijonojen kanssa
väri = "punainen"
koodi = ?? väri {
    "punainen" : "#FF0000"
    "vihreä"   : "#00FF00"
    _          : "#000000"
}
>> koodi ¶
```

---

## Silmukat

```zymbol
// Inklusiivinen väli: 0..4 iteroi 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Väli askeleilla
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Käänteinen väli
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Niin kauan kuin (while)
luku = 1
@ luku <= 64 { luku *= 2 }
>> luku ¶    // → 128

// Jokaiselle elementille
hedelmä = ["omena", "päärynä", "viinirypäle"]
@ f:hedelmä { >> f ¶ }

// Merkkijonon merkkien yli
@ c:"hei" { >> c "-" }
>> ¶    // → h-e-i-

// Keskeytä ja Jatka
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> jatka
    ? i > 7 { @! }          // @! keskeytä
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funktiot

```zymbol
// Määrittely ja kutsu
summa(a, b) { <~ a + b }
>> summa(3, 4) ¶    // → 7

// Rekursio
kertoma(luku) {
    ? luku <= 1 { <~ 1 }
    <~ luku * kertoma(luku - 1)
}
>> kertoma(5) ¶    // → 120

// Funktioilla on eristetty näkyvyysalue — ei pääsyä ulkoisiin muuttujiin
globaali = 100
testata() {
    x = 42    // paikallinen, ei pääsyä 'globaali'-muuttujaan
    <~ x
}
>> testata() ¶    // → 42
```

> **Tärkeää**: Funktiot, jotka on määritelty muodolla `nimi(params){ }`, eivät ole ensimmäisen luokan arvoja.
> Käytä `x -> nimi(x)` välittääksesi ne argumenttina.

---

## Lambdat ja Sulkeumat

```zymbol
// Yksinkertainen lambda (implisiittinen palautus)
kaksinkertainen = x -> x * 2
summa = (a, b) -> a + b
>> kaksinkertainen(5) ¶     // → 10
>> summa(3, 7) ¶            // → 10

// Lambda lohkolla (eksplisiittinen palautus)
luokittele = x -> {
    ? x > 0 { <~ "positiivinen" }
    _? x < 0 { <~ "negatiivinen" }
    <~ "nolla"
}
>> luokittele(5) ¶     // → positiivinen
>> luokittele(0) ¶     // → nolla
>> luokittele(-5) ¶    // → negatiivinen

// Sulkeumat — lambdat kaappaavat muuttujia ulkoisesta näkyvyysalueesta
kerroin = 3
kolminkertainen = x -> x * kerroin    // kaappaa 'kerroin'
>> kolminkertainen(7) ¶    // → 21

// Funktiotuotanto
make_adder(luku) { <~ x -> x + luku }
add10 = make_adder(10)
add20 = make_adder(20)
>> add10(5) ¶    // → 15
>> add20(5) ¶    // → 25

// Lambdat arvoina: tallennetaan taulukoihin
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[1](5) ¶    // → 10
>> ops[2](5) ¶    // → 25
```

---

## Taulukot

```zymbol
arr = [10, 20, 30, 40, 50]

// Pääsy (indeksi alkaa 0:sta)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30

// Pituus (vaatii sulkeet >>:ssä)
luku = arr$#
>> luku ¶          // → 5
>> (arr$#) ¶       // → 5

// Lisää, poista, tarkista, siivu
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // poistaa indeksin 0: [20, 30, 40, 50, 60]
sisältää = arr$? 30          // → #1
osa = arr$[0..2]             // siivu [0,2): [20, 30]

// Päivitä elementti
arr[1] = 99
>> arr ¶    // → [20, 99, 40, 50, 60]

// Jokaiselle elementille
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` palauttavat **uuden taulukon** — sijoita samaan nimeen: `arr = arr$+ 4`.
> Älä ketjuta: `arr$+ 4$+ 5` ei toimi — käytä kahta sijoitusta.

---

## Tuplit

```zymbol
// Paikallinen monikko
piste = (10, 20)
>> piste[0] ¶    // → 10
>> piste[1] ¶    // → 20

// Nimetty monikko
henkilö = (nimi: "Alice", ikä: 25)
>> henkilö.nimi ¶      // → Alice
>> henkilö.ikä ¶       // → 25
>> henkilö[0] ¶        // → Alice (indeksi toimii myös)

// Sisäkkäinen
pos = (x: 3, y: 4)
p = (pos: pos, etiketti: "alkupiste")
>> p.etiketti ¶    // → alkupiste
>> p.pos.x ¶       // → 3
```

---

## Korkeamman asteen Funktiot

HOF-operaattorit vaativat **inline-lambdan** — ei suoraa lambda-muuttujaa.

```zymbol
luku_lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
kaksinkertaistetut = luku_lista$> (x -> x * 2)
>> kaksinkertaistetut ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
parilliset = luku_lista$| (x -> x % 2 == 0)
>> parilliset ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (alkuarvo, (akkumulaattori, elementti) -> lauseke)
yhteensä = luku_lista$< (0, (acc, x) -> acc + x)
>> yhteensä ¶    // → 55

// Ei suoraa ketjutusta — käytä välimuuttujia
vaihe1 = luku_lista$| (x -> x > 5)
vaihe2 = vaihe1$> (x -> x * x)
>> vaihe2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Virheenkäsittely

```zymbol
// Yritä / Ota kiinni / Lopuksi
!? {
    x = 10 / 0
} :! ##Div {
    >> "jako nollalla" ¶
} :! ##IO {
    >> "IO-virhe" ¶
} :! {
    >> "muu virhe: " _err ¶    // _err sisältää virheviestin
} :> {
    >> "suoritetaan aina" ¶
}

// Kiinniotto indeksityypillä
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "indeksi alueen ulkopuolella" ¶
}
```

### Virhetyypit

| Tyyppi      | Milloin tapahtuu               |
|-------------|-------------------------------|
| `##Div`     | Jako nollalla                 |
| `##IO`      | Tiedosto / järjestelmä        |
| `##Index`   | Indeksi alueen ulkopuolella   |
| `##Type`    | Tyyppivirt                    |
| `##Parse`   | Datan jäsennys                |
| `##Network` | Verkkovirheet                 |
| `##_`       | Mikä tahansa virhe (kaikki)   |

---

## Moduulit

```zymbol
// Tiedosto: lib/calc.zy
# calc                    // määrittely — aina ylhäällä

#> {                      // viennit — TÄYTYY olla ennen määrittelyjä
    summa
    get_PI
}

_PI := 3.14159

summa(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter vakiolle (tarvittava kiertotie)
```

```zymbol
// Tiedosto: main.zy
<# ./lib/calc <= c         // alias pakollinen

>> c::summa(5, 3) ¶        // → 8  — kutsu ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Huomio**: `alias.NIMI` vakioiden käyttämiseen ei toimi — käytä getter-funktiota.

---

## Täydellinen Esimerkki: FizzBuzz

```zymbol
luokittele(luku) {
    ? luku % 15 == 0 { <~ "SuhPörr" }
    _? luku % 3  == 0 { <~ "Suh" }
    _? luku % 5  == 0 { <~ "Pörr" }
    _ { <~ luku }
}
@ i:1..20 { >> luokittele(i) ¶ }
```

---

## Symboliviite

| Symboli | Operaatio          | Symboli    | Operaatio              |
|---------|--------------------|------------|------------------------|
| `=`     | muuttuja           | `$#`       | pituus                 |
| `:=`    | vakio              | `$+`       | lisää (append)         |
| `>>`    | tulostus           | `$-`       | poista (indeksillä)    |
| `<<`    | syöte              | `$?`       | sisältää               |
| `¶`/`\` | rivinvaihto        | `$[s..e]`  | siivu                  |
| `?`     | jos (if)           | `$>`       | map                    |
| `_?`    | muuten jos (elif)  | `$\|`      | filter                 |
| `_`     | muuten / wildcard  | `$<`       | reduce                 |
| `??`    | match              | `!?`       | yritä (try)            |
| `@`     | silmukka           | `:!`       | ota kiinni (catch)     |
| `@!`    | keskeytä           | `:>`       | aina (finally)         |
| `@>`    | jatka              | `$!`       | on virhe               |
| `->`    | lambda             | `$!!`      | propagoi virhe         |
| `<~`    | palautus           | `#`        | määrittele moduuli     |
| `\|>`   | pipe               | `#>`       | vie ulos               |
| `#1`    | tosi               | `<#`       | tuo sisään             |
| `#0`    | epätosi            | `::`       | moduulikutsu           |

---

*Zymbol-Lang — Symbolinen. Universaali. Muuttumaton.*

---

**Vastuuvapauslauseke:** Tämä dokumentaatio on luotu ja käännetty tekoälyllä (AI). Kaikki pyrkimykset on tehty tarkkuuden varmistamiseksi, mutta jotkut käännökset tai esimerkit saattavat sisältää virheitä. Virallinen viite on [Zymbol-Lang-spesifikaatio](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
