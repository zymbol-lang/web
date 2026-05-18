> **Vastuuvapauslauseke:** Tämä dokumentaatio on luotu tekoälyn (AI) avustuksella.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanoninen viite on **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** tulkkiarkistossa.

---

# Zymbol-Lang -käsikirja

**Zymbol-Lang** on symbolinen ohjelmointikieli. Ei avainsanoja — kaikki on symboli. Toimii samalla tavalla missä tahansa ihmiskielessä.

- Ei `if`, `while`, `return` — vain `?`, `@`, `<~`
- Täysi Unicode — tunnisteet millä tahansa kielellä tai emojilla
- Ihmiskielestä riippumaton — koodi on sama kaikkialla

**Tulkin versio**: v0.0.4 | **Testikattavuus**: 393/393 (TW ↔ VM -pariteetti)

---

## Muuttujat ja vakiot

```zymbol
x = 10              // muuttuva muuttuja
PI := 3.14159       // vakio — uudelleenmääritys on ajonaikainen virhe
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

| Tyyppi | Literaali | `#?` -tunniste | Huomautukset |
|--------|-----------|----------------|--------------|
| Kokonaisluku | `42`, `-7` | `###` | 64-bittinen etumerkillinen |
| Liukuluku | `3.14`, `1.5e10` | `##.` | Tieteellinen merkintä OK |
| Merkkijono | `"teksti"` | `##"` | Interpolointi: `"Hei {nimi}"` |
| Merkki | `'A'` | `##'` | Yksi Unicode-merkki |
| Totuusarvo | `#1`, `#0` | `##?` | EI numeerinen — `#1 ≠ 1` |
| Taulukko | `[1, 2, 3]` | `##]` | Homogeeniset alkiot |
| Monikko | `(a, b)` | `##)` | Paikkainen |
| Nimetty monikko | `(x: 1, y: 2)` | `##)` | Nimetyt kentät |
| Funktio | nimetty funktioviite | `##()` | Ensiluokkainen; näyttää `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ensiluokkainen; näyttää `<lambd/N>` |

```zymbol
// Tyypin tiedustelu — palauttaa (tyyppi, numerot, arvo)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Tulostus ja syöte

```zymbol
>> "Hei" ¶                       // ¶ tai \\ selkeälle rivinvaihdolle
>> "a=" a " b=" b ¶              // rinnakkain asettelu — useita arvoja
>> (arr$#) ¶                     // postfix-operaattorit vaativat ( ) >>-merkissä

<< nimi                           // lue muuttujaan (ei kehotetta)
<< "Anna nimi: " nimi             // kehotteen kanssa
```

> `¶` (AltGr+R espanjalaisella näppäimistöllä) ja `\\` vastaavat rivinvaihtoja.

---

## Operaattorit

```zymbol
// Aritmetiikka — käytä sijoituksia; joillakin operaattoreilla on erikoisuuksia suoraan >>-merkissä
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (kokonaislukujako)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potenssiinkorotus)

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

>> "Hei " nimi " sinulla on " n ¶       // rinnakkain asettelu — >>-merkissä
kuvaus = "Hei {nimi}, sinulla on {n}"   // interpolointi — missä tahansa
```

```zymbol
s = "Hei Maailma"
pituus = s$#                  // 11
osa = s$[1..5]                // "Hei M"  (1-pohjainen, loppu mukaan lukien)
onko = s$? "Maailma"          // #1
osat = "a,b,c,d"$/ ','        // [a, b, c, d]  (erota erottimella)
korvattu = s$~~["i":"y"]      // "Hey Maaylma"
korvattu1 = s$~~["i":"y":1]   // "Hey Maailma"  (vain ensimmäinen N)
```

> `+` on vain numeroille. Käytä `,`, rinnakkain asettelua tai interpolointia merkkijonoille.

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

> `{ }` -aaltosulkeet **vaaditaan** jopa yhdelle lauseelle.

---

## Match

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
vari = "punainen"
koodi = ?? vari {
    "punainen" : "#FF0000"
    "vihreä"   : "#00FF00"
    _          : "#000000"
}

// Vertailumallit
lampotila = -5
tila = ?? lampotila {
    < 0  : "jää"
    < 20 : "kylmä"
    < 35 : "lämmin"
    _    : "kuuma"
}
>> tila ¶    // → jää

// Lausemuoto (lohkot)
?? n {
    0        : { >> "nolla" ¶ }
    _? n < 0 : { >> "negatiivinen" ¶ }
    _        : { >> "positiivinen" ¶ }
}
```

---

## Silmukat

```zymbol
@ i:0..4  { >> i " " }        // alue mukaan lukien:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // askeleella:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // käänteinen:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

hedelmat = ["omena", "päärynä", "rypäle"]
@ h:hedelmat { >> h ¶ }       // for-each taulukkoon

@ m:"hei" { >> m "-" }
>> ¶                          // → h-e-i-  (for-each merkkijonoon)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jatka
    ? i > 7 { @! }            // @! keskeytä
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Päättymätön silmukka
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Nimetty silmukka (sisäkkäinen keskeytys)
laskuri = 0
@:ulompi {
    laskuri++
    ? laskuri >= 3 { @:ulompi! }
}
>> laskuri ¶                  // → 3
```

---

## Funktiot

```zymbol
summa(a, b) { <~ a + b }
>> summa(3, 4) ¶    // → 7

kertoma(n) {
    ? n <= 1 { <~ 1 }
    <~ n * kertoma(n - 1)
}
>> kertoma(5) ¶    // → 120
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

> Nimetyt funktiot ovat **ensiluokkaisia arvoja** — siirrä suoraan: `nums$> tuplaa`. Myös `x -> fn(x)` on kelvollinen.

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
luo_summaaja(n) { <~ x -> x + n }
lisaa10 = luo_summaaja(10)
>> lisaa10(5) ¶    // → 15

// Taulukoissa
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Taulukot

Taulukot ovat **muuttuvia** ja sisältävät **saman tyypin** alkioita.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — pääsy (1-pohjainen: ensimmäinen alkio)
arr[-1]         // 5 — negatiivinen indeksi (viimeinen alkio)
arr$#           // 5 — pituus (käytä (arr$#) >>-merkissä)

arr = arr$+ 6            // lisää → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // lisää kohtaan 2 (1-pohjainen)
arr3 = arr$- 3           // poista ensimmäinen arvon esiintymä
arr4 = arr$-- 3          // poista kaikki esiintymät
arr5 = arr$-[1]          // poista indeksistä 1 (ensimmäinen alkio)
arr6 = arr$-[2..3]       // poista alue (1-pohjainen, loppu mukaan lukien)

onko = arr$? 3           // #1 — sisältää
paikat = arr$?? 3        // [3] — kaikki arvon indeksit (1-pohjainen)
pala = arr$[1..3]        // [1,2,3] — siivu (1-pohjainen, loppu mukaan lukien)
pala2 = arr$[1:3]        // [1,2,3] — sama, lukumääräsyntaksi

nouseva = arr$^+         // lajittele nousevasti (vain primitiivit)
laskeva = arr$^-         // lajittele laskevasti (vain primitiivit)

// Nimetyt/paikkaiset monikkotaulukot — käytä $^ vertailulambdalla
db = [(nimi: "Karla", ika: 28), (nimi: "Ana", ika: 25), (nimi: "Pekka", ika: 30)]
ian_mukaan   = db$^ (a, b -> a.ika < b.ika)      // nousevasti iän mukaan (<)
nimen_mukaan = db$^ (a, b -> a.nimi > b.nimi)    // laskevasti nimen mukaan (>)
>> ian_mukaan[1].nimi ¶     // → Ana
>> nimen_mukaan[1].nimi ¶   // → Karla

// Suora alkion päivitys (vain taulukot)
arr[1] = 99              // sijoita
arr[2] += 5              // yhdistetty: +=  -=  *=  /=  %=  ^=

// Funktionaalinen päivitys — palauttaa uuden taulukon; alkuperäinen muuttumaton
arr2 = arr[2]$~ 99
```

> Kaikki kokoelmaoperaattorit palauttavat **uuden taulukon**. Sijoita takaisin: `arr = arr$+ 4`.
> `$+` voidaan ketjuttaa: `arr = arr$+ 5$+ 6$+ 7`. Muut operaattorit käyttävät väliaikaisia sijoituksia.
> **Indeksointi on 1-pohjainen**: `arr[1]` on ensimmäinen alkio; `arr[0]` on ajonaikainen virhe.
> `$^+` / `$^-` lajittelevat **primitiiviset taulukot** (numerot, merkkijonot). Monikkotaulukoille käytä `$^` vertailulambdalla — suunta on koodattu lambdaan (`<` = nouseva, `>` = laskeva).

**Arvosemantiikka** — taulukon sijoittaminen toiseen muuttujaan luo itsenäisen kopion:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ei muutu
```

```zymbol
// Sisäkkäiset taulukot (1-pohjainen indeksointi)
matriisi = [[1,2,3],[4,5,6],[7,8,9]]
>> matriisi[2][3] ¶    // → 6  (rivi 2, sarake 3)
```

---

## Destrukturointi

```zymbol
// Taulukko
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[ensimmainen, *loput] = arr  // ensimmainen=10  loput=[20,30,40,50]
[x, _, z] = [1, 2, 3]       // _ hylkää

// Paikkainen monikko
piste = (100, 200)
(px, py) = piste             // px=100  py=200

// Nimetty monikko
henkilo = (nimi: "Ana", ika: 25, kaupunki: "Madrid")
(nimi: n, ika: i) = henkilo   // n="Ana"  i=25
```

---

## Monikot

Monikot ovat **muuttumattomia** järjestettyjä säiliöitä, jotka voivat sisältää **eri tyyppisiä** arvoja.
Toisin kuin taulukot, alkioita ei voi muuttaa luomisen jälkeen.

```zymbol
// Paikkainen — sekatyypit sallittuja
piste = (10, 20)
>> piste[1] ¶    // → 10

data = (42, "hei", #1, 3.14)
>> data[3] ¶     // → #1

// Nimetty
henkilo = (nimi: "Anna", ika: 25)
>> henkilo.nimi ¶    // → Anna
>> henkilo[1] ¶      // → Anna  (indeksi toimii myös, 1-pohjainen)

// Sisäkkäinen
p = (x: 10, y: 20)
monikko = (p: p, label: "alkuperä")
>> monikko.p.x ¶     // → 10
```

**Muuttumattomuus** — yritys muokata monikon alkiota on ajonaikainen virhe:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ ajonaikainen virhe: monikot ovat muuttumattomia
// t[1] += 5    // ❌ sama virhe
```

Muokatun arvon johtamiseksi käytä `$~` (funktionaalinen päivitys) — palauttaa **uuden** monikon:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← alkuperäinen muuttumaton
>> t2 ¶    // → (10, 999, 30)

// Nimetty monikko — rakenna nimenomaisesti
henkilo = (nimi: "Anna", ika: 25)
vanhempi = (nimi: henkilo.nimi, ika: 26)
>> henkilo.ika ¶    // → 25
>> vanhempi.ika ¶   // → 26
```

---

## Korkeamman asteen funktiot

```zymbol
numerot = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tuplattu  = numerot$> (x -> x * 2)               // kuvaus  → [2,4,6…20]
parilliset = numerot$| (x -> x % 2 == 0)         // suodatus → [2,4,6,8,10]
summa     = numerot$< (0, (acc, x) -> acc + x)   // redusointi → 55

// Ketjuta väliaikaismuuttujien kautta
vaihe1 = numerot$| (x -> x > 3)
vaihe2 = vaihe1$> (x -> x * x)
>> vaihe2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nimetyt funktiot voidaan siirtää suoraan HOF:ille
tuplaa(x) { <~ x * 2 }
on_suuri(x) { <~ x > 5 }
r = numerot$> tuplaa       // ✅ suora viite
r = numerot$| on_suuri     // ✅ suora viite
```

---

## Putkioperaattori

Oikea puoli vaatii aina `_`-merkkiä sijoitusmerkkinä putkitettavalle arvolle:

```zymbol
tuplaa = x -> x * 2
summaa = (a, b) -> a + b
inc = x -> x + 1

5 |> tuplaa(_)        // → 10
10 |> summaa(_, 5)    // → 15
5 |> summaa(2, _)     // → 7

// Ketjutettu
r = 5 |> tuplaa(_) |> inc(_) |> tuplaa(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Virheiden käsittely

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "jako nollalla" ¶
} :! {
    >> "muu virhe: " _err ¶    // _err sisältää virheviestin
} :> {
    >> "suoritetaan aina" ¶
}
```

| Tyyppi | Milloin |
|--------|---------|
| `##Div` | Jako nollalla |
| `##IO` | Tiedosto / järjestelmä |
| `##Index` | Indeksi alueen ulkopuolella |
| `##Type` | Tyyppiristiriita |
| `##Parse` | Datan jäsennys |
| `##Network` | Verkkovirheet |
| `##_` | Mikä tahansa virhe (kaappaa kaikki) |

---

## Moduulit

```zymbol
// lib/calc.zy — moduulin runko on aaltosulkeiden sisällä
# calc {
    #> { summa, get_PI }

    _PI := 3.14159
    summa(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias vaaditaan

>> c::summa(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Vie eri julkisella nimellä
# oma_kirjasto {
    #> { _sisainen_summa <= sum }

    _sisainen_summa(a, b) { <~ a + b }
}
```

```zymbol
<# ./oma_kirjasto <= m

>> m::sum(3, 4) ¶    // → 7  (sisäinen nimi _sisainen_summa on piilotettu)
```

> **Moduulisäännöt**: vain `#>`, funktiomäärittelyt ja literaalimuuttujien/vakioiden alustajat ovat sallittuja `# nimi { }` -lohkon sisällä. Suoritettavat lauseet (`>>`, `<<`, silmukat jne.) aiheuttavat E013-virheen.

---

## Numeraalitilat

Zymbol voi näyttää numeroita **69 Unicode-numerolohkossa** — Devanagari, Arabialais-intialainen, Thaimaalainen, Klingonin pIqaD, Matematiikan lihavointi, LCD-segmentit ja lisää. Aktiivinen tila vaikuttaa vain `>>`-tulostukseen; sisäinen aritmetiikka on aina binaarista.

### Tilan aktivointi

Kirjoita kohdeskriptin `0` ja `9` numerot `#…#`-merkkien sisään:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabialais-intialainen (U+0660–U+0669)
#๐๙#    // Thaimaalainen (U+0E50–U+0E59)
#09#    // palauta ASCII
```

### Tulostus ja totuusarvot

```zymbol
x = 42
>> x ¶          // → 42   (ASCII-oletus)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimaalipiste on aina ASCII)
>> 1 + 2 ¶      // → ३

// Totuusarvot: #-etuliite on aina ASCII, numero mukautuu
>> #1 ¶         // → #१   (tosi Devanagarilla)
>> #0 ¶         // → #०   (epätosi — erillinen ०-kokonaisluvusta)

x = 28 > 4
>> x ¶          // → #१   (vertailutulos seuraa aktiivista tilaa)
```

### Natiivi numeroliteraalit lähdekoodissa

Minkä tahansa tuetun skriptin numerot ovat kelvollisia literalreja — alueilla, moduloissa, vertailuissa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Totuusarvoliteraalit missä tahansa skriptissä

`#` + numero `0` tai `1` mistä tahansa lohkosta on kelvollinen totuusarvoliteraali:

```zymbol
#٠٩#
aktiivinen = #١        // sama kuin #1
>> aktiivinen ¶        // → #١
>> (#١ && #٠) ¶        // → #٠
```

> `#` on **aina ASCII**. `#0` (epätosi) on aina visuaalisesti erotettavissa `0`-luvusta (kokonaisluku nolla) jokaisessa skriptissä.

---

## Data-operaattorit

```zymbol
// Tyypinmuunnos
##.42         // → 42.0  (liukuluvuksi)
###3.7        // → 4     (kokonaisluvuksi, pyöristys)
##!3.7        // → 3     (kokonaisluvuksi, katkaisu)

// Jäsennä merkkijono numeroksi
v1 = #|"42"|      // → 42  (kokonaisluku)
v2 = #|"3.14"|    // → 3.14  (liukuluku)
v3 = #|"abc"|     // → "abc"  (virheturvallinen, ei virhettä)

// Pyöristys / katkaisu
pii = 3.14159265
r2 = #.2|pii|      // → 3.14  (pyöristä 2 desimaaliin)
r4 = #.4|pii|      // → 3.1416
t2 = #!2|pii|      // → 3.14  (katkaise)

// Numeromuotoilu
fmt = #,|1234567|   // → 1,234,567  (pilkulla erotettu)
sci = #^|12345.678| // → 1.2345678e4  (tieteellinen)

// Kantalukuliteraalit
a = 0x41         // → 'A'  (heksadesimaali)
b = 0b01000001   // → 'A'  (binaari)
c = 0o101        // → 'A'  (oktaali)

// Kantalukuesitystulostus
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integraatio

```zymbol
paivamaara = <\ date +%Y-%m-%d \>    // kaappaa stdoutin (sisältää \n)
>> "Tänään: " paivamaara

tiedosto = "data.txt"
sisalto = <\ cat {tiedosto} \>       // interpolointi komennoissa

tuloste = </"./subscript.zy"/>       // suorita toinen Zymbol-skripti, kaappaa tuloste
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

| Symboli | Toiminto | Symboli | Toiminto |
|---------|----------|---------|----------|
| `=` | muuttuja | `$#` | pituus |
| `:=` | vakio | `$+` | lisää (ketjutettavissa) |
| `>>` | tulostus | `$+[i]` | lisää indeksiin (1-pohjainen) |
| `<<` | syöte | `$-` | poista ensimmäinen arvon mukaan |
| `¶` / `\\` | rivinvaihto | `$--` | poista kaikki arvon mukaan |
| `?` | jos | `$-[i]` | poista indeksistä (1-pohjainen) |
| `_?` | muuten jos | `$-[i..j]` | poista alue (1-pohjainen) |
| `_` | muuten / yleismalli | `$?` | sisältää |
| `??` | täsmäytys | `$??` | etsi kaikki indeksit (1-pohjainen) |
| `@` | silmukka | `$[s..e]` | siivu (1-pohjainen) |
| `@ N { }` | N kertaa silmukka | `$>` | kuvaus |
| `@!` | keskeytä | `$|` | suodatus |
| `@>` | jatka | `$<` | redusointi |
| `@:nimi { }` | nimetty silmukka | `$/ erotin` | merkkijonon jako |
| `@:nimi!` | keskeytä nimetty | `$++ a b c` | ketjutusrakenne |
| `@:nimi>` | jatka nimetty | `arr[i>j>k]` | navigointi-indeksi |
| `->` | lambda | `arr[i] = arvo` | päivitä alkio (vain taulukot) |
| `arr[i] += arvo` | yhdistetty päivitys | `arr[i]$~` | funktionaalinen päivitys (uusi kopio) |
| `$^+` | lajittele nousevasti (primitiiivit) | `$^-` | lajittele laskevasti (primitiiivit) |
| `$^` | lajittele vertailijalla (monikot) | `<~` | palauta |
| `|>` | putki | `!?` | yritä |
| `:!` | kaappaa | `:>` | lopuksi |
| `#1` | tosi | `#0` | epätosi |
| `$!` | on virhe | `$!!` | levitä virhe |
| `<#` | tuo | `#>` | vie |
| `#` | määrittele moduuli | `::` | kutsu moduulia |
| `.` | kenttään pääsy | `#?` | tyypin metadata |
| `#|..|` | jäsennä numero | `##.` | muunna liukuluvuksi |
| `###` | muunna kokonaisluvuksi (pyöristys) | `##!` | muunna kokonaisluvuksi (katkaisu) |
| `#.N|..|` | pyöristä | `#!N|..|` | katkaise |
| `#,|..|` | pilkkuformaatio | `#^|..|` | tieteellinen |
| `#d0d9#` | numeraalitilan vaihto | `#09#` | palauta ASCII |
| `<\ ..\>` | shell-suoritus | `>\<` | CLI-argumentit |
| `\ var` | tuhoa muuttuja nimenomaisesti | | |

---

## Julkaisumuutosloki

### v0.0.4 — 1-pohjainen indeksointi, Ensiluokkaiset funktiot ja Moduulilohkot _(Huhtikuu 2026)_

- **Muutos** Kaikki indeksointi vaihdettu **1-pohjaiseksi** — `arr[1]` on ensimmäinen alkio; `arr[0]` on ajonaikainen virhe
- **Lisätty** Nimetyt funktiot ovat **ensiluokkaisia arvoja** — siirrä suoraan HOF:ille: `nums$> tuplaa`
- **Lisätty** Moduulien **lohkosyntaksi vaaditaan**: `# nimi { ... }` — tasainen syntaksi poistettu
- **Lisätty** Moniulotteinen indeksointi: `arr[i>j>k]` (navigointi), `arr[p ; q]` (tasainen poiminta)
- **Lisätty** Tyypinmuunnos: `##.lauseke` (liukuluku), `###lauseke` (kokonaisluku pyöristys), `##!lauseke` (kokonaisluku katkaisu)
- **Lisätty** Merkkijonon jako: `str$/ erotin` — palauttaa `Array(String)`
- **Lisätty** Ketjutusrakenne: `pohja$++ a b c` — lisää useita alkioita
- **Lisätty** N kertaa silmukka: `@ N { }` — toista tarkalleen N kertaa
- **Lisätty** Nimettyjen silmukoiden syntaksi: `@:nimi { }`, `@:nimi!`, `@:nimi>` — korvaa `@ @nimi` / `@! nimi`
- **Lisätty** Muuttujien näkyvyyssäännöt: `_nimi`-muuttujilla on tarkka lohkonäkyvyys; `\ var` tuhoaa varhain
- **Lisätty** Täsmäytyksen vertailumallit: `< 0 :`, `> 5 :`, `== 42 :` jne.
- **Lisätty** Moduulien E013-virhe: suoritettavat lauseet moduulin rungossa ovat kiellettyjä
- **Korjattu** `take_variable` ei enää vioita moduulivakioita takaisinkirjoituksessa
- **Korjattu** `alias.VAKIO` ratkeaa nyt oikein; `#>` voi esiintyä funktiomäärittelyjen jälkeen
- **VM** Täysi pariteetti: 393/393 testiä läpäisee

### v0.0.3 — Unicode-numeraalijärjestelmät ja LSP-parannukset _(Huhtikuu 2026)_

- **Lisätty** 69 Unicode-numerolohkoa tilanvaihtotokenilla `#d0d9#`
- **Lisätty** Totuusarvoliteraalit missä tahansa skriptissä — `#१` / `#०`, `#١` / `#٠`, jne.
- **Lisätty** Klingonin pIqaD-numerot (CSUR PUA U+F8F0–U+F8F9)
- **Lisätty** `SetNumeralMode` VM-opkoodi — täysi pariteetti puukulkijan kanssa
- **Lisätty** REPL kunnioittaa aktiivista numeraalitilaa kaiussa ja muuttujanäytössä
- **Muutettu** Totuusarvojen `>>`-tulostus sisältää nyt `#`-etuliitteen (`#0` / `#1`) kaikissa tiloissa

### v0.0.2_01 — Operaattoreiden uudelleennimeäminen _(30. maaliskuuta 2026)_

- **Muutettu** `c|..|` → `#,|..|` ja `e|..|` → `#^|..|` — yhdenmukainen `#`-muotoiluetuliiteperheen kanssa
- **Lisätty** Vientialias: vie moduulin jäsenet uudelleen eri nimellä

### v0.0.2 — Kokoelma-APIN uudelleensuunnittelu ja asennusohjelmat _(24. maaliskuuta 2026)_

- **Lisätty** Yhtenäinen `$`-operaattoriperhe taulukoille ja merkkijonoille (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lisätty** Destrukturointisijoitus taulukoille, monikoille ja nimetyille monikoille
- **Lisätty** Negatiiviset indeksit (`arr[-1]` = viimeinen alkio)
- **Lisätty** Natiivit asennusohjelmat — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. maaliskuuta 2026)_

- **Lisätty** Yhdistetty sijoitus `^=`
- **Korjattu** Jäsentimen aritmetiikan reunatapaukset; dokumentaatiokorjaukset

### v0.0.1 — Ensimmäinen julkinen julkaisu _(22. maaliskuuta 2026)_

- Puukulkijatulkki + rekisteri-VM (`--vm`, ~4× nopeampi, ~95% pariteetti)
- Kaikki ydinrakenteet: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Täysi Unicode-tunnisteet, moduulijärjestelmä, lambdat, sulkeumat, virheidenkäsittely
- REPL, LSP, VS Code -laajennus, muotoilija (`zymbol fmt`)

---

_Zymbol-Lang — Symbolinen. Universaali. Muuttumaton._
