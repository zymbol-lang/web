> **Vastuuvapauslauseke:** Tämä dokumentaatio on luotu ja käännetty tekoälyn (AI) avulla.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> Kanoninen viite on **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** tulkin arkistossa.

---

# Zymbol-Lang käsikirja

**Zymbol-Lang** on symbolinen ohjelmointikieli. Ei avainsanoja — kaikki on symboli. Toimii identtisesti millä tahansa ihmiskielellä.

- Ei `if`, `while`, `return` — vain `?`, `@`, `<~`
- Täysi Unicode — tunnisteet millä tahansa kielellä tai emojilla
- Ihmiskielestä riippumaton — koodi on sama kaikkialla

**Tulkin versio**: v0.0.4 | **Testikattavuus**: 393/393 (TW ↔ VM pariteetti)

---

## Muuttujat ja vakiot

```zymbol
x = 10              // muuttuva muuttuja
PI := 3.14159       // vakio — uudelleenmääritys on suoritusaikainen virhe
nimi = "Anna"
aktiivinen = #1     // totuusarvo tosi
👋 := "Hei"
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

---

## Tietotyypit

| Tyyppi | Literaali | `#?` tunniste | Huomautukset |
|--------|-----------|---------------|--------------|
| Kokonaisluku | `42`, `-7` | `###` | 64-bittinen etumerkillinen |
| Liukuluku | `3.14`, `1.5e10` | `##.` | Tieteellinen merkintätapa OK |
| Merkkijono | `"teksti"` | `##"` | Interpolointi: `"Hei {nimi}"` |
| Merkki | `'A'` | `##'` | Yksi Unicode-merkki |
| Totuusarvo | `#1`, `#0` | `##?` | EI numeerinen — `#1 ≠ 1` |
| Taulukko | `[1, 2, 3]` | `##]` | Homogeeniset elementit |
| Monikko | `(a, b)` | `##)` | Paikallinen |
| Nimetty monikko | `(x: 1, y: 2)` | `##)` | Nimetyt kentät |
| Funktio | nimetyn funktion viite | `##()` | Ensiluokkainen; näyttää `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ensiluokkainen; näyttää `<lambd/N>` |

```zymbol
// Tyypin tiedustelu — palauttaa (tyyppi, numerot, arvo)
meta = 42#?
>> meta ¶          // → (###, 2, 42)
t = meta[1]
>> t ¶             // → ###
```

---

## Tulostus ja syöttö

```zymbol
>> "Hei" ¶                      // ¶ tai \\ rivinvaihdolle
>> "a=" a " b=" b ¶             // rinnakkain asettelu — useita arvoja
>> (taulukko$#) ¶                // postfix-operaattorit vaativat ( ) >>-ssa

<< nimi                          // lue muuttujaan (ei kehotetta)
<< "Syötä nimi: " nimi           // kehotteen kanssa
```

> `¶` ja `\\` ovat vastaavia rivinvaihtoja.

---

## Operaattorit

```zymbol
// Aritmetiikka — käytä sijoituksia; joillakin operaattoreilla on erikoisuuksia >>-ssa
a = 10
b = 3
t1 = a + b    // 13     
t2 = a - b    // 7
t3 = a * b    // 30     
t4 = a / b    // 3  (kokonaislukujako)
t5 = a % b    // 1      
t6 = a ^ b    // 1000  (potenssiinkorotus)

// Vertailu
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Loogiset
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Merkkijonot

```zymbol
// Kaksi yhdistämismuotoa
nimi = "Anna"
n = 42

>> "Hei " nimi " sinulla on " n ¶       // rinnakkain asettelu — >>-ssa
kuvaus = "Hei {nimi}, sinulla on {n}"   // interpolointi — missä tahansa
```

```zymbol
s = "Hei Maailma"
pituus = s$#                  // 11
osa = s$[1..5]                // "Hei M"  (1-indeksinen, loppu mukaan lukien)
onko = s$? "Maailma"          // #1
osat = "a,b,c,d"$/ ','        // [a, b, c, d]  (jaa erottimella)
korv = s$~~["a":"e"]          // "Hei Meeileme"
korv1 = s$~~["a":"e":1]       // "Hei Meeilma"  (vain ensimmäinen N)
```

> `+` on vain numeroille. Merkkijonoille käytä `,`, rinnakkain asettelua tai interpolointia.

---

## Ohjausrakenne

```zymbol
x = 7

? x > 0 { >> "positiivinen" ¶ }

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

> `{ }` aaltosulkeet **ovat pakollisia** jopa yhdelle lauseelle.

---

## Match (sovitus)

```zymbol
// Alueet
pisteet = 85
arvosana = ?? pisteet {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> arvosana ¶    // → B

// Merkkijonot
väri = "punainen"
koodi = ?? väri {
    "punainen" : "#FF0000"
    "vihreä"   : "#00FF00"
    _          : "#000000"
}

// Vertailumallit
lämpötila = -5
tila = ?? lämpötila {
    < 0  : "jää"
    < 20 : "kylmä"
    < 35 : "lämmin"
    _    : "kuuma"
}
>> tila ¶        // → jää

// Lausemuoto (lohkohaarat)
?? n {
    0        : { >> "nolla" ¶ }
    _? n < 0 : { >> "negatiivinen" ¶ }
    _        : { >> "positiivinen" ¶ }
}
```

---

## Silmukat

```zymbol
@ i:0..4  { >> i " " }         // alue mukaan lukien:  0 1 2 3 4
@ i:1..9:2 { >> i " " }        // askeleella:          1 3 5 7 9
@ i:5..0:1 { >> i " " }        // käänteinen:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                         // → 128  (while)

hedelmät = ["omena", "päärynä", "rypäle"]
@ h:hedelmät { >> h ¶ }        // taulukon läpikäynti

@ m:"hei" { >> m "-" }
>> ¶                           // → h-e-i-  (merkkijonon läpikäynti)

@ i:1..10 {
    ? i % 2 == 0 { @> }        // @> jatka
    ? i > 7 { @! }             // @! keskeytä
    >> i " "
}
>> ¶                           // → 1 3 5 7

// Ikuinen silmukka
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                           // → 1 2 3 4

// Nimetty silmukka (sisäkkäinen keskeytys)
laskuri = 0
@:ulompi {
    laskuri++
    ? laskuri >= 3 { @:ulompi! }
}
>> laskuri ¶                   // → 3
```

---

## Funktiot

```zymbol
lisää(a, b) { <~ a + b }
>> lisää(3, 4) ¶    // → 7

kertoma(n) {
    ? n <= 1 { <~ 1 }
    <~ n * kertoma(n - 1)
}
>> kertoma(5) ¶     // → 120
```

Funktioilla on **eristetty näkyvyysalue** — ne eivät voi lukea ulkoisia muuttujia. Käytä tulostusparametreja `<~` muokataksesi kutsujan muuttujia:

```zymbol
vaihda(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
vaihda(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nimetyt funktiot ovat **ensiluokkaisia arvoja** — välitä suoraan: `numerot$> tuplaa`. Kääre `x -> fn(x)` on myös kelvollinen.

---

## Lambdat ja sulkeumat

```zymbol
tuplaa = x -> x * 2
summa = (a, b) -> a + b
>> tuplaa(5) ¶    // → 10
>> summa(3, 7) ¶  // → 10

// Lohkolambda
luokittele = x -> {
    ? x > 0 { <~ "positiivinen" }
    _? x < 0 { <~ "negatiivinen" }
    <~ "nolla"
}

// Sulkeuma — kaappaa ulkoisen näkyvyysalueen
kerroin = 3
kolminkertaista = x -> x * kerroin
>> kolminkertaista(7) ¶    // → 21

// Tehdas
luo_lisääjä(n) { <~ x -> x + n }
lisää10 = luo_lisääjä(10)
>> lisää10(5) ¶    // → 15

// Taulukossa
operaatiot = [x -> x+1, x -> x*2, x -> x*x]
>> operaatiot[3](5) ¶    // → 25
```

---

## Taulukot

Taulukot ovat **muuttuvia** ja sisältävät **saman tyyppisiä** elementtejä.

```zymbol
taulu = [1, 2, 3, 4, 5]

taulu[1]          // 1 — pääsy (1-indeksinen: ensimmäinen elementti)
taulu[-1]         // 5 — negatiivinen indeksi (viimeinen elementti)
taulu$#           // 5 — pituus (käytä (taulu$#) >>-ssa)

taulu = taulu$+ 6               // lisää → [1,2,3,4,5,6]
taulu2 = taulu$+[2] 99          // lisää kohtaan 2 (1-indeksinen)
taulu3 = taulu$- 3              // poista ensimmäinen arvon esiintymä
taulu4 = taulu$-- 3             // poista kaikki esiintymät
taulu5 = taulu$-[1]             // poista indeksistä 1 (ensimmäinen elementti)
taulu6 = taulu$-[2..3]          // poista alue (1-indeksinen, loppu mukaan lukien)

onko = taulu$? 3                // #1 — sisältääkö
sijainnit = taulu$?? 3          // [3] — kaikki arvon indeksit (1-indeksinen)
siivu = taulu$[1..3]            // [1,2,3] — siivu (1-indeksinen, loppu mukaan lukien)
siivu2 = taulu$[1:3]            // [1,2,3] — sama, lukumääräpohjainen syntaksi

nouseva = taulu$^+              // lajittele nousevasti (vain primitiivit)
laskeva = taulu$^-              // lajittele laskevasti (vain primitiivit)

// Nimettyjen/paikallisten monikkojen taulukot — käytä $^ vertailijalambdan kanssa
db = [(nimi: "Karla", ikä: 28), (nimi: "Anna", ikä: 25), (nimi: "Pekka", ikä: 30)]
iän_mukaan = db$^ (a, b -> a.ikä < b.ikä)        // nousevasti iän mukaan (<)
nimen_mukaan = db$^ (a, b -> a.nimi > b.nimi)    // laskevasti nimen mukaan (>)
>> iän_mukaan[1].nimi ¶     // → Anna
>> nimen_mukaan[1].nimi ¶   // → Karla

// Suora elementin päivitys (vain taulukot)
taulu[1] = 99              // sijoita
taulu[2] += 5              // yhdistetty sijoitus: +=  -=  *=  /=  %=  ^=

// Funktionaalinen päivitys — palauttaa uuden taulukon; alkuperäinen muuttumaton
taulu2 = taulu[2]$~ 99
```

> Kaikki kokoelmaoperaattorit palauttavat **uuden taulukon**. Sijoita takaisin: `taulu = taulu$+ 4`.
> `$+` voidaan ketjuttaa: `taulu = taulu$+ 5$+ 6$+ 7`. Muut operaattorit käyttävät väliaikaissijoituksia.
> **Indeksointi on 1-pohjaista**: `taulu[1]` on ensimmäinen elementti; `taulu[0]` on suoritusaikainen virhe.
> `$^+` / `$^-` lajittelevat **primitiivitaulukot** (numerot, merkkijonot). Monikkotaulukoille käytä `$^` vertailijalambdan kanssa — suunta on koodattu lambdassa (`<` = nouseva, `>` = laskeva).

**Arvosemantiikka** — taulukon sijoittaminen toiseen muuttujaan luo itsenäisen kopion:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶     // → [99, 2, 3]
>> b ¶     // → [1, 2, 3]   ← b ei muutu
```

```zymbol
// Sisäkkäiset taulukot (1-indeksinen)
matriisi = [[1,2,3],[4,5,6],[7,8,9]]
>> matriisi[2][3] ¶    // → 6  (rivi 2, sarake 3)
```

---

## Destrukturointi

```zymbol
// Taulukko
taulu = [10, 20, 30, 40, 50]
[a, b, c] = taulu               // a=10  b=20  c=30
[ensimmäinen, *loput] = taulu   // ensimmäinen=10  loput=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ hylkää

// Paikallinen monikko
piste = (100, 200)
(px, py) = piste                // px=100  py=200

// Nimetty monikko
henkilö = (nimi: "Anna", ikä: 25, kaupunki: "Madrid")
(nimi: n, ikä: i) = henkilö      // n="Anna"  i=25
```

---

## Monikot

Monikot ovat **muuttumattomia** järjestettyjä säiliöitä, jotka voivat sisältää **eri tyyppisiä** arvoja.
Toisin kuin taulukot, elementtejä ei voi muuttaa luomisen jälkeen.

```zymbol
// Paikallinen — sekatyypit sallittuja
piste = (10, 20)
>> piste[1] ¶    // → 10

data = (42, "hei", #1, 3.14)
>> data[3] ¶     // → #1

// Nimetty
henkilö = (nimi: "Liisa", ikä: 25)
>> henkilö.nimi ¶    // → Liisa
>> henkilö[1] ¶      // → Liisa  (indeksi toimii myös, 1-pohjainen)

// Sisäkkäinen
sijainti = (x: 10, y: 20)
p = (sijainti: sijainti, tunniste: "alkupiste")
>> p.sijainti.x ¶    // → 10
```

**Muuttumattomuus** — yritys muokata monikon elementtiä on suoritusaikainen virhe:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ suoritusaikainen virhe: monikot ovat muuttumattomia
// t[1] += 5    // ❌ sama virhe
```

Muunnetun arvon saamiseksi käytä `$~` (funktionaalinen päivitys) — palauttaa **uuden** monikon:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← alkuperäinen muuttumaton
>> t2 ¶    // → (10, 999, 30)

// Nimetty monikko — rakenna eksplisiittisesti
henkilö = (nimi: "Liisa", ikä: 25)
vanhempi = (nimi: henkilö.nimi, ikä: 26)
>> henkilö.ikä ¶    // → 25
>> vanhempi.ikä ¶   // → 26
```

---

## Korkeamman asteen funktiot

```zymbol
luvut = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tuplatut = luvut$> (x -> x * 2)                  // map → [2,4,6…20]
parilliset = luvut$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
summa = luvut$< (0, (acc, x) -> acc + x)         // reduce → 55

// Ketjutus välimuuttujien kautta
vaihe1 = luvut$| (x -> x > 3)
vaihe2 = vaihe1$> (x -> x * x)
>> vaihe2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nimetyt funktiot voidaan välittää suoraan KAF:ille
tuplaa(x) { <~ x * 2 }
on_suuri(x) { <~ x > 5 }
t = luvut$> tuplaa        // ✅ suora viite
t = luvut$| on_suuri      // ✅ suora viite
```

---

## Putkioperaattori

Oikeanpuoleinen puoli vaatii aina `_` paikkamerkiksi putketulle arvolle:

```zymbol
tuplaa = x -> x * 2
lisää = (a, b) -> a + b
inc = x -> x + 1

5 |> tuplaa(_)        // → 10
10 |> lisää(_, 5)     // → 15
5 |> lisää(2, _)      // → 7

// Ketjutettu
t = 5 |> tuplaa(_) |> inc(_) |> tuplaa(_)
>> t ¶    // → 22  (5→10→11→22)
```

---

## Virheiden käsittely

```zymbol
!? {
    x = 10 / 0
} :! ##Nollajako {
    >> "jako nollalla" ¶
} :! {
    >> "muu virhe: " _virhe ¶    // _virhe sisältää virheviestin
} :> {
    >> "suoritetaan aina" ¶
}
```

| Tyyppi | Milloin |
|--------|---------|
| `##Nollajako` | Jako nollalla |
| `##IO` | Tiedosto / järjestelmä |
| `##Indeksi` | Indeksi alueen ulkopuolella |
| `##Tyyppi` | Tyyppiristiriita |
| `##Jäsennys` | Datan jäsennysvirhe |
| `##Verkko` | Verkkovirheet |
| `##_` | Mikä tahansa virhe (kaappaaja) |

---

## Moduulit

```zymbol
// lib/laskin.zy — moduulin runko on aaltosulkeissa
# laskin {
    #> { lisää, get_PI }

    _PI := 3.14159
    lisää(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// paäsivu.zy
<# ./lib/laskin <= l    // alias pakollinen

>> l::lisää(5, 3) ¶     // → 8
pi = l::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Vie eri julkisella nimellä
# minun_kirjasto {
    #> { _sisäinen_lisää <= summa }

    _sisäinen_lisää(a, b) { <~ a + b }
}
```

```zymbol
<# ./minun_kirjasto <= m

>> m::summa(3, 4) ¶    // → 7  (sisäinen nimi _sisäinen_lisää on piilotettu)
```

> **Moduulisäännöt**: vain `#>`, funktiomäärittelyt ja literaalimuuttujien/vakioiden alustukset sallitaan `# nimi { }` sisällä. Suoritettavat lauseet (`>>`, `<<`, silmukat jne.) aiheuttavat virheen E013.

---

## Numeeriset tilat

Zymbol voi näyttää numeroita **69 Unicode-merkistössä** — devanagari, arabialais-intialainen, thai, klingon pIqaD, matematiikka lihavoitu, LCD-segmentit ja monet muut. Aktiivinen tila vaikuttaa vain `>>` tulostukseen; sisäinen aritmetiikka on aina binaarista.

### Merkistön aktivointi

Kirjoita kohdemerkistön `0` ja `9` numerot `#…#` sisään:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabialais-intialainen (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // palauta ASCII
```

### Tulostus ja totuusarvot

```zymbol
x = 42
>> x ¶          // → 42   (ASCII oletus)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimaalipiste on aina ASCII)
>> 1 + 2 ¶      // → ३

// Totuusarvot: # etuliite on aina ASCII, numero mukautuu
>> #1 ¶         // → #१   (tosi devanagarissa)
>> #0 ¶         // → #०   (epätosi — erottuu visuaalisesti ० kokonaisluku nollasta)

x = 28 > 4
>> x ¶          // → #१   (vertailutulos noudattaa aktiivista tilaa)
```

### Alkuperäiset numeroliteraalit lähdekoodissa

Minkä tahansa tuetun merkistön numerot ovat kelvollisia literaaleja — alueissa, moduloissa, vertailuissa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Totuusarvoliteraalit missä tahansa merkistössä

`#` + minkä tahansa lohkon numero `0` tai `1` on kelvollinen totuusarvoliteraali:

```zymbol
#٠٩#
نشط = #١        // sama kuin #1
>> نشط ¶        // → #१
>> (#١ && #٠) ¶ // → #०
```

> `#` on **aina ASCII**. `#0` (epätosi) on aina visuaalisesti erilainen kuin `0` (kokonaisluku nolla) jokaisessa merkistössä.

---

## Data-operaattorit

```zymbol
// Tyypin muunnos
##.42         // → 42.0  (Liukuluvuksi)
###3.7        // → 4     (Kokonaisluvuksi, pyöristys)
##!3.7        // → 3     (Kokonaisluvuksi, katkaisu)

// Jäsennä merkkijono numeroksi
v1 = #|"42"|      // → 42  (Kokonaisluku)
v2 = #|"3.14"|    // → 3.14  (Liukuluku)
v3 = #|"abc"|     // → "abc"  (turvallinen epäonnistuminen, ei virhettä)

// Pyöristys / katkaisu
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (pyöristä 2 desimaaliin)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (katkaise)

// Numeroiden muotoilu
fmt = #,|1234567|  // → 1,234,567  (pilkuilla erotettu)
sci = #^|12345.678|    // → 1.2345678e4  (tieteellinen)

// Kantalukuliteraalit
a = 0x41         // → 'A'  (heksadesimaali)
b = 0b01000001   // → 'A'  (binaari)
c = 0o101        // → 'A'  (oktaali)

// Kantalukumuunnoksen tulostus
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integraatio

```zymbol
päivämäärä = <\ date +%Y-%m-%d \>     // kaappaa stdout (sisältää lopussa \n)
>> "Tänään: " päivämäärä

tiedosto = "data.txt"
sisältö = <\ cat {tiedosto} \>       // interpolointi komennoissa

tuloste = </"./aliskripti.zy"/>      // suorita toinen Zymbol-skripti, kaappaa tuloste
>> tuloste
```

> `><` kaappaa CLI-argumentit merkkijonotaulukkona (vain tree-walker).

---

## Täydellinen esimerkki: FizzBuzz

```zymbol
luokittele(luku) {
    ? luku % 15 == 0 { <~ "FizzBuzz" }
    _? luku % 3  == 0 { <~ "Fizz" }
    _? luku % 5  == 0 { <~ "Buzz" }
    _ { <~ luku }
}

@ i:1..20 { >> luokittele(i) ¶ }
```

---

## Symboliviite

| Symboli | Operaatio | Symboli | Operaatio |
|---------|-----------|---------|-----------|
| `=` | muuttuja | `$#` | pituus |
| `:=` | vakio | `$+` | lisää (ketjutettavissa) |
| `>>` | tulostus | `$+[i]` | lisää indeksiin (1-pohjainen) |
| `<<` | syöttö | `$-` | poista ensimmäinen arvon mukaan |
| `¶` / `\\` | rivinvaihto | `$--` | poista kaikki arvon mukaan |
| `?` | jos | `$-[i]` | poista indeksistä (1-pohjainen) |
| `_?` | muuten jos | `$-[i..j]` | poista alue (1-pohjainen) |
| `_` | muuten / yleismääritys | `$?` | sisältääkö |
| `??` | match | `$??` | etsi kaikki indeksit (1-pohjainen) |
| `@` | silmukka | `$[s..e]` | siivu (1-pohjainen) |
| `@ N { }` | N kertaa silmukka | `$>` | map |
| `@!` | keskeytä | `$\|` | filter |
| `@>` | jatka | `$<` | reduce |
| `@:nimi { }` | nimetty silmukka | `$/ erotin` | merkkijonon jako |
| `@:nimi!` | keskeytä nimetty | `$++ a b c` | konkatenointirakennus |
| `@:nimi>` | jatka nimetty | `taulu[i>j>k]` | navigointi-indeksi |
| `->` | lambda | `taulu[i] = arvo` | päivitä elementti (vain taulukot) |
| `taulu[i] += arvo` | yhdistetty päivitys | `taulu[i]$~` | funktionaalinen päivitys (uusi kopio) |
| `$^+` | lajittele nousevasti (primitiivit) | `$^-` | lajittele laskevasti (primitiivit) |
| `$^` | lajittele vertailijalla (monikot) | `<~` | palauta |
| `\|>` | putki | `!?` | yritä |
| `:!` | kaappaa | `:>` | lopuksi |
| `#1` | tosi | `#0` | epätosi |
| `$!` | onko virhe | `$!!` | levitä virhe |
| `<#` | tuo | `#>` | vie |
| `#` | määrittele moduuli | `::` | moduulikutsu |
| `.` | kentän pääsy | `#?` | tyypin metatiedot |
| `#\|..\|` | jäsennä numero | `##.` | muunna Liukuluvuksi |
| `###` | muunna Kokonaisluvuksi (pyöristys) | `##!` | muunna Kokonaisluvuksi (katkaisu) |
| `#.N\|..\|` | pyöristä | `#!N\|..\|` | katkaise |
| `#,\|..\|` | pilkkuformaatti | `#^\|..\|` | tieteellinen notaatio |
| `#0d9#` | numeerisen tilan vaihto | `#09#` | palauta ASCII |
| `<\ ..\>` | shell-suoritus | `>\<` | CLI-argumentit |
| `\ muuttuja` | tuhoa muuttuja eksplisiittisesti | | |

---

## Julkaisujen muutosloki

### v0.0.4 — 1-pohjainen indeksointi, Ensiluokkaiset funktiot ja Moduulilohkot _(Huhtikuu 2026)_

- **Murros** Kaikki indeksointi muutettu **1-pohjaiseksi** — `taulu[1]` on ensimmäinen elementti; `taulu[0]` on suoritusaikainen virhe
- **Lisätty** Nimetyt funktiot ovat **ensiluokkaisia arvoja** — välitä suoraan KAF:ille: `numerot$> tuplaa`
- **Lisätty** Moduulin **lohkosyntaksi pakolliseksi**: `# nimi { ... }` — tasainen syntaksi poistettu
- **Lisätty** Moniulotteinen indeksointi: `taulu[i>j>k]` (navigointi), `taulu[p ; q]` (tasainen erotus)
- **Lisätty** Tyypinmuunnos: `##.lauseke` (Liukuluku), `###lauseke` (Kokonaisluku pyöristys), `##!lauseke` (Kokonaisluku katkaisu)
- **Lisätty** Merkkijonon jako: `merkkijono$/ erotin` — palauttaa `Taulukko(Merkkijono)`
- **Lisätty** Konkatenointirakennus: `pohja$++ a b c` — lisää useita kohteita
- **Lisätty** N kertaa silmukka: `@ N { }` — toista tarkalleen N kertaa
- **Lisätty** Nimettyjen silmukoiden syntaksi: `@:nimi { }`, `@:nimi!`, `@:nimi>` — korvaa `@ @nimi` / `@! nimi`
- **Lisätyt** Muuttujien näkyvyyssäännöt: `_nimi` muuttujilla on tarkka lohkonäkyvyys; `\ muuttuja` tuhoaa ennenaikaisesti
- **Lisätyt** Match vertailumallit: `< 0 :`, `> 5 :`, `== 42 :` jne.
- **Lisätty** Moduulin E013 virhe: suoritettavat lauseet moduulirungossa on kielletty
- **Korjattu** `ota_muuttuja` ei enää vahingoita moduulivakioita takaisinkirjoituksessa
- **Korjattu** `alias.VAKIO` nyt ratkeaa oikein; `#>` voi esiintyä funktiomäärittelyjen jälkeen
- **VM** Täysi pariteetti: 393/393 testiä läpäisee

### v0.0.3 — Unicode numerojärjestelmät ja LSP-parannukset _(Huhtikuu 2026)_

- **Lisätyt** 69 Unicode numerolohkoa tilanvaihtotokenilla `#0d9#`
- **Lisätyt** Totuusarvoliteraalit missä tahansa merkistössä — `#१` / `#०`, `#١` / `#٠`, jne.
- **Lisätyt** Klingon pIqaD numerot (CSUR PUA U+F8F0–U+F8F9)
- **Lisätty** `AsetaNumeerinenTila` VM-opkoodi — täysi pariteetti puukulkijan kanssa
- **Lisätty** REPL kunnioittaa aktiivista numeerista tilaa kaikuessa ja muuttujien näytössä
- **Muutettu** Totuusarvo `>>` tulostus sisältää nyt `#` etuliitteen (`#0` / `#1`) kaikissa tiloissa

### v0.0.2_01 — Operaattoreiden uudelleennimeäminen _(30. Maaliskuuta 2026)_

- **Muutettu** `c|..|` → `#,|..|` ja `e|..|` → `#^|..|` — yhdenmukainen `#` muotoiluetuliiteperheen kanssa
- **Lisätty** Vientialias: vie moduulin jäsenet uudelleen eri nimellä

### v0.0.2 — Kokoelma-APIn uudelleensuunnittelu ja asentajat _(24. Maaliskuuta 2026)_

- **Lisätty** Yhtenäinen `$` operaattoriperhe taulukoille ja merkkijonoille (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lisätty** Destrukturointi tauluille, monikoille ja nimetyille monikoille
- **Lisätyt** Negatiiviset indeksit (`taulu[-1]` = viimeinen elementti)
- **Lisätyt** Natiiviasentajat — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. Maaliskuuta 2026)_

- **Lisätty** Yhdistetty sijoitus `^=`
- **Korjattu** Jäsentimen aritmetiikan reunatapaukset; dokumentaatiokorjaukset

### v0.0.1 — Ensimmäinen julkinen julkaisu _(22. Maaliskuuta 2026)_

- Puukulkijatulkki + rekisteri-VM (`--vm`, ~4× nopeampi, ~95% pariteetti)
- Kaikki ydinrakenteet: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Täysi Unicode-tunnisteet, moduulijärjestelmä, lambdat, sulkeumat, virheidenkäsittely
- REPL, LSP, VS Code -laajennus, muotoilija (`zymbol fmt`)

---

_Zymbol-Lang — Symbolinen. Universaali. Muuttumaton._
