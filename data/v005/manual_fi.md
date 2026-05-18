> **Varoitus:** Tämä dokumentaatio on luotu ja käännetty tekoälyn (TA) avulla.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Käsikirja

> **Tarkistettu versiolle v0.0.5 — 2026-05-12**

**Zymbol-Lang** on symbolinen ohjelmointikieli. Ilman avainsanoja — kaikki on symboli. Toimii samalla tavalla millä tahansa ihmiskielellä.

- Ei `if`, `while`, `return` — vain `?`, `@`, `<~`
- Täysi Unicode — tunnisteet millä tahansa kielellä tai emojilla
- Ihmiskielestä riippumaton — koodi on sama kaikkialla

**Tulkin versio**: v0.0.5 | **Testikattavuus**: 436/436 (TW ↔ VM pariteetti)

---

## Muuttujat ja vakiot

```zymbol
x = 10              // muuttuva muuttuja
PI := 3.14159       // vakio — uudelleensijoitus on ajonaikainen virhe
nimi = "Alice"
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

`°` (astemerkki, U+00B0) alustaa muuttujan automaattisesti neutraaliksi arvoksi ensimmäisessä käyttökerrassa:

```zymbol
numerot = [3, 1, 4, 1, 5]
@ n:numerot {
    °yhteensa += n    // auto-alustus 0:ksi silmukan yläpuolelle; säilyy @ jälkeen
}
>> yhteensa ¶         // → 14
```

> `°x` (etuliite) ankkuroituu silmukan yläpuolelle — tulos on saatavilla `@` jälkeen.
> `x°` (jälkiliite) ankkuroituu silmukan sisälle — katoaa silmukan päättyessä.
> Vain puuläpikäyntiä varten.

---

## Tietotyypit

| Tyyppi | Literaali | `#?` tunniste | Huomautukset |
|--------|---------|-------------|------------|
| Kokonaisluku | `42`, `-7` | `###` | 64-bittinen etumerkillinen |
| Liukuluku | `3.14`, `1.5e10` | `##.` | Tieteellinen notaatio OK |
| Merkkijono | `"teksti"` | `##"` | Interpolointi: `"Hei {nimi}"` |
| Merkki | `'A'` | `##'` | Yksittäinen Unicode-merkki |
| Totuusarvo | `#1`, `#0` | `##?` | EI numeerinen — `#1 ≠ 1` |
| Taulukko | `[1, 2, 3]` | `##]` | Homogeeniset elementit |
| Monikko | `(a, b)` | `##)` | Sijaintipohjainen |
| Nimetty monikko | `(x: 1, y: 2)` | `##)` | Nimetyt kentät |
| Funktio | nimetyn funktion viite | `##()` | Ensimmäisen luokan; näyttö `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ensimmäisen luokan; näyttö `<lambd/N>` |

```zymbol
// Tyypin introspektio — palauttaa (tyyppi, numerot, arvo)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Tulostus ja syöte

```zymbol
>> "Hei" ¶                      // ¶ tai \\ eksplisiittinen rivinvaihto
>> "a=" a " b=" b ¶             // rinnakkain — useita arvoja
>> (taulukko$#) ¶               // jälkiliiteoperaattorit vaativat ( ) >>:ssä

<< nimi                         // lue muuttujaan (ilman kehotetta)
<< "Syota nimi: " nimi          // kehotteella
```

> `¶` (AltGr+R espanjalaisella näppäimistöllä) ja `\\` ovat vastaavia rivinvaihtoja.

---

## TUI-primitiivit

Terminaalikäyttöliittymäoperaattorit interaktiivisille ohjelmille. Useimmat vaativat `>>| { }` -lohkon (vaihtoehtoinen näyttö + raakamodi).

```zymbol
>>| {
    >>!                             // tyhjennä vaihtoehtoinen näyttö
    >>~ (1, 1, 0, 10) > "Suoritetaan"  // rivi 1, sarake 1, fg=10 (vihreä)
    @~ 1000                         // tauko 1 sekunti (1000 ms)
    >>~ (2, 1) > "Valmis."
}
// terminaali palautetaan automaattisesti poistuessa
```

```zymbol
// Näppäinpainallus ja terminaalin koko
>>| {
    [rivit, sarakkeet] = >>?              // kysy terminaalin mitat
    >>~ (1, 1) > "Terminaali: " rivit " x " sarakkeet
    <<| nappain                           // estävä näppäinluku
    >>~ (2, 1) > "Painettu: " nappain
}
```

> `>>!` tyhjentää näytön. `>>?` palauttaa `[rivit, sarakkeet]`. `@~ N` nukkuu N millisekuntia.
> `<<|` lukee yhden näppäinpainalluksen (estävä); `<<|?` kysyy ilman estoa (palauttaa `'\0'` jos ei ole).
> Sijaintitulosteen monikko: `(rivi, sarake, BKS, fg, bg)` — mikä tahansa paikka voidaan jättää pois pilkulla (`>>~ (,,, 196) > "punainen"`).
> BKS-bittipeite: `1`=Lihavoitu, `2`=Kursivoitu, `4`=Alleviivattu. ANSI 256-väripaletti (`0`=terminaalin oletus).
> Vain puuläpikäyntiä varten (paitsi `>>!`, `>>?`, `@~`, `>>~` jotka toimivat myös `--vm`).

---

## Operaattorit

```zymbol
// Aritmetiikka
a = 10
b = 3
t1 = a + b    // 13
t2 = a - b    // 7
t3 = a * b    // 30
t4 = a / b    // 3  (kokonaislukujako)
t5 = a % b    // 1
t6 = a ^ b    // 1000  (potenssi)

// Vertailu — sijoita tarkastettavaksi
v1 = a == b    // #0
v2 = a <> b    // #1
v3 = a < b     // #0
v4 = a <= b    // #0
v5 = a > b     // #1
v6 = a >= b    // #1

// Logiikka
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Merkkijonot

```zymbol
// Kaksi ketjutusmuotoa
nimi = "Alice"
n = 42

>> "Hei " nimi " sinulla on " n ¶    // rinnakkain — >>:ssä
kuvaus = "Hei {nimi}, sinulla on {n}"  // interpolointi — kaikkialla
```

```zymbol
s = "Hei Maailma"
pituus = s$#                  // 10
osa = s$[1..3]                // "Hei"  (1-pohjainen, loppu mukana)
on = s$? "Maailma"            // #1
osat = "a,b,c,d"$/ ','        // [a, b, c, d]  (jaa erottimen mukaan)
korv = s$~~["a":"A"]          // "HeI MAAllmA"
korv1 = s$~~["a":"A":1]       // "HeI Maailma"  (vain ensimmäiset N)
viiva = "─" $* 20             // "────────────────────"  (toista N kertaa)
```

> `+` on vain numeroille. Käytä `,`, rinnakkaisuutta tai interpolointia merkkijonoille.

---

## Kontrollirakenne

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

> `{ }` aaltosulut ovat **pakollisia** jopa yhdelle lauseelle.

---

## Hahmontäsmäytys

```zymbol
// Välit
pisteet = 85
arvosana = ?? pisteet {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> arvosana ¶    // → B

// Merkkijonot
vari = "punainen"
koodi = ?? vari {
    "punainen" => "#FF0000"
    "vihrea"   => "#00FF00"
    _          => "#000000"
}

// Vertailumallit
lampotila = -5
tila = ?? lampotila {
    < 0  => "jaa"
    < 20 => "kylma"
    < 35 => "lammin"
    _    => "kuuma"
}
>> tila ¶    // → jaa

// Lausemuoto (lohkohaarat)
n = -3
?? n {
    0    => { >> "nolla" ¶ }
    < 0  => { >> "negatiivinen" ¶ }
    _    => { >> "positiivinen" ¶ }
}
```

---

## Silmukat

```zymbol
@ i:0..4  { >> i " " }        // väli mukana:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // askeleella:    1 3 5 7 9
@ i:5..0:1 { >> i " " }       // käänteinen:    5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

hedelmat = ["omena", "paari", "rypale"]
@ h:hedelmat { >> h ¶ }       // for-each taulukko

@ m:"hei" { >> m "-" }
>> ¶                          // → h-e-i-  (for-each merkkijono)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jatka
    ? i > 7 { @! }             // @! keskeytä
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Ääretön silmukka
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
>> laskuri ¶                    // → 3
```

---

## Funktiot

```zymbol
laske(a, b) { <~ a + b }
>> laske(3, 4) ¶    // → 7

kertoma(n) {
    ? n <= 1 { <~ 1 }
    <~ n * kertoma(n - 1)
}
>> kertoma(5) ¶    // → 120
```

Funktioilla on **eristetty näkyvyysalue** — ne eivät voi lukea ulkoisia muuttujia. Käytä lähtöparametreja `<~` kutsuvan koodin muuttujien muuttamiseen:

```zymbol
vaihda(a<~, b<~) {
    vali = a
    a = b
    b = vali
}
x = 10
y = 20
vaihda(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nimetyt funktiot ovat **ensimmäisen luokan arvoja** — välitä suoraan: `numerot$> kaksinkertaista`. Käärimiseen: `x -> fn(x)` on myös kelvollinen.

---

## Lambdat ja sulkeumat

```zymbol
kaksinkertaista = x -> x * 2
summa = (a, b) -> a + b
>> kaksinkertaista(5) ¶    // → 10
>> summa(3, 7) ¶           // → 10

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
tee_lisaaja(n) { <~ x -> x + n }
lisaa10 = tee_lisaaja(10)
>> lisaa10(5) ¶    // → 15

// Taulukoissa
toiminnot = [x -> x+1, x -> x*2, x -> x*x]
>> toiminnot[3](5) ¶    // → 25
```

---

## Taulukot

Taulukot ovat **muuttuvia** ja sisältävät **saman tyyppiset** elementit.

```zymbol
taulukko = [1, 2, 3, 4, 5]

x = taulukko[1]      // 1 — pääsy (1-pohjainen: ensimmäinen elementti)
x = taulukko[-1]     // 5 — negatiivinen indeksi (viimeinen elementti)
x = taulukko$#       // 5 — pituus (käytä (taulukko$#) >>:ssä)

taulukko = taulukko$+ 6            // lisää → [1,2,3,4,5,6]
taulukko2 = taulukko$+[2] 99       // lisää paikkaan 2 (1-pohjainen)
taulukko3 = taulukko$- 3           // poista arvon ensimmäinen esiintymä
taulukko4 = taulukko$-- 3          // poista kaikki esiintymät
taulukko5 = taulukko$-[1]          // poista indeksillä 1 (ensimmäinen elementti)
taulukko6 = taulukko$-[2..3]       // poista väli (1-pohjainen, loppu mukana)

on = taulukko$? 3            // #1 — sisältää
pos = taulukko$?? 3          // [3] — kaikki arvon indeksit (1-pohjainen)
osa = taulukko$[1..3]        // [1,2,3] — osa (1-pohjainen, loppu mukana)
osa2 = taulukko$[1:3]        // [1,2,3] — sama, lukumäärään perustuva syntaksi

nouseva = taulukko$^+             // lajiteltu nousevaan  (vain primitiivit)
laskeva = taulukko$^-             // lajiteltu laskevaan (vain primitiivit)

// Nimetty/sijaintimonikoiden taulukot — käytä $^ vertailulambdan kanssa
tk = [(nimi: "Carla", ika: 28), (nimi: "Ana", ika: 25), (nimi: "Bob", ika: 30)]
ian_mukaan  = tk$^ (a, b -> a.ika < b.ika)    // nouseva iän mukaan  (<)
nimen_mukaan = tk$^ (a, b -> a.nimi > b.nimi) // laskeva nimen mukaan (>)
>> ian_mukaan[1].nimi ¶     // → Ana
>> nimen_mukaan[1].nimi ¶   // → Carla

// Suora elementin päivitys (vain taulukot)
taulukko[1] = 99              // sijoita
taulukko[2] += 5              // yhdistelmä: +=  -=  *=  /=  %=  ^=

// Toiminnallinen päivitys — palauttaa uuden taulukon; alkuperäinen muuttumaton
taulukko2 = taulukko[2]$~ 99
```

> Kaikki kokoelmaoperaattorit palauttavat **uuden taulukon**. Sijoita takaisin: `taulukko = taulukko$+ 4`.
> `$+` voidaan ketjuttaa: `taulukko = taulukko$+ 5$+ 6$+ 7`. Muut operaattorit käyttävät välisijoituksia.
> **Indeksointi on 1-pohjainen**: `taulukko[1]` on ensimmäinen elementti; `taulukko[0]` on ajonaikainen virhe.
> `$^+` / `$^-` lajittelevat **primitiivitaulukot** (numerot, merkkijonot). Monikoiden taulukoille käytä `$^` vertailulambdan kanssa — suunta on koodattu lambdaan (`<` = nouseva, `>` = laskeva).

**Arvosemantiikka** — taulukon sijoittaminen toiseen muuttujaan luo riippumattoman kopion:

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

## Hajotus

```zymbol
// Taulukko
taulukko = [10, 20, 30, 40, 50]
[a, b, c] = taulukko              // a=10  b=20  c=30
[ensimmainen, *loput] = taulukko  // ensimmainen=10  loput=[20,30,40,50]
[x, _, z] = [1, 2, 3]             // _ hylkää

// Sijaintimonikko
piste = (100, 200)
(px, py) = piste                  // px=100  py=200

// Nimetty monikko
henkilo = (nimi: "Ana", ika: 25, kaupunki: "Madrid")
(nimi: n, ika: i) = henkilo       // n="Ana"  i=25
```

---

## Monikot

Monikot ovat **muuttumattomia** järjestettyjä säiliöitä, jotka voivat sisältää **eri tyyppisiä** arvoja.
Toisin kuin taulukot, elementtejä ei voi muuttaa luomisen jälkeen.

```zymbol
// Sijainnillinen — sekatyypeille sallittu
piste = (10, 20)
>> piste[1] ¶    // → 10

tiedot = (42, "hei", #1, 3.14)
>> tiedot[3] ¶     // → #1

// Nimetty
henkilo = (nimi: "Alice", ika: 25)
>> henkilo.nimi ¶    // → Alice
>> henkilo[1] ¶      // → Alice  (indeksi toimii myös, 1-pohjainen)

// Sisäkkäinen
pos = (x: 10, y: 20)
p = (pos: pos, merkinta: "alkupiste")
>> p.pos.x ¶        // → 10
```

**Muuttumattomuus** — mikä tahansa yritys muuttaa monikoelementtiä on ajonaikainen virhe:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ ajonaikainen virhe: monikot ovat muuttumattomia
// t[1] += 5    // ❌ sama virhe
```

Muutetun arvon saamiseksi käytä `$~` (toiminnallinen päivitys) — palauttaa **uuden** monikon:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← alkuperäinen muuttumaton
>> t2 ¶    // → (10, 999, 30)

// Nimetty monikko — rakenna uudelleen eksplisiittisesti
henkilo = (nimi: "Alice", ika: 25)
vanhempi  = (nimi: henkilo.nimi, ika: 26)
>> henkilo.ika ¶    // → 25
>> vanhempi.ika ¶   // → 26
```

---

## Korkeamman asteen funktiot

```zymbol
numerot = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kaksinkertaistettu  = numerot$> (x -> x * 2)                // map  → [2,4,6…20]
parilliset          = numerot$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
yhteensa            = numerot$< (0, (kert, x) -> kert + x)  // reduce → 55

// Ketju välilaskujen kautta
vaihe1 = numerot$| (x -> x > 3)
vaihe2 = vaihe1$> (x -> x * x)
>> vaihe2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nimetyt funktiot voidaan välittää suoraan KAF:lle
kaksinkertaista(x) { <~ x * 2 }
on_suuri(x) { <~ x > 5 }
t = numerot$> kaksinkertaista       // ✅ suora viite
t = numerot$| on_suuri              // ✅ suora viite
```

---

## Putkioperaattori

Oikea puoli vaatii aina `_` paikkamerkiksi putkitetulle arvolle:

```zymbol
kaksinkertaista = x -> x * 2
lisaa = (a, b) -> a + b
kasvata = x -> x + 1

t1 = 5 |> kaksinkertaista(_)        // → 10
t2 = 10 |> lisaa(_, 5)              // → 15
t3 = 5 |> lisaa(2, _)               // → 7

// Ketjutettu
t = 5 |> kaksinkertaista(_) |> kasvata(_) |> kaksinkertaista(_)
>> t ¶    // → 22  (5→10→11→22)
```

---

## Virheenkäsittely

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "jako nollalla" ¶
} :! {
    >> "muu: " _err ¶    // _err sisältää virheviestin
} :> {
    >> "suoritetaan aina" ¶
}
```

| Tyyppi | Milloin |
|--------|---------|
| `##Div` | Jako nollalla |
| `##IO` | Tiedosto / järjestelmä |
| `##Index` | Indeksi rajojen ulkopuolella |
| `##Type` | Tyyppien epäyhteensopivuus |
| `##Parse` | Tietojen jäsennys |
| `##Network` | Verkkovirheet |
| `##_` | Mikä tahansa virhe (kaikki kiinni) |

---

## Moduulit

```zymbol
// lib/laskenta.zy — moduulin runko on suljettu aaltosulkuihin
# laskenta {
    #> { lisaa, hae_PI }

    _PI := 3.14159
    lisaa(a, b) { <~ a + b }
    hae_PI() { <~ _PI }
}
```

```zymbol
// paaohjema.zy
<# ./lib/laskenta => l    // alias vaaditaan

>> l::lisaa(5, 3) ¶     // → 8
pi = l::hae_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Vie eri julkisella nimellä
# kirjastoni {
    #> { _sisainen_lisays => summa }

    _sisainen_lisays(a, b) { <~ a + b }
}
```

```zymbol
<# ./kirjastoni => k

>> k::summa(3, 4) ¶    // → 7  (sisäinen nimi _sisainen_lisays on piilotettu)
```

> **Moduulisäännöt**: `# nimi { }` sisällä on sallittu vain `#>`, funktiomääritykset ja literaaliset muuttuja/vakioalustimet. Suoritettavat lauseet (`>>`, `<<`, silmukat jne.) nostavat virheen E013.

---

## Numeraalimuodot

Zymbol voi näyttää numeroita **69 Unicode-numerokirjoitusjärjestelmässä** — Devanagari, Arabia-Intia, Thai, Klingon pIqaD, matematiikan lihavoitu, LCD-segmentit ja enemmän. Aktiivinen tila vaikuttaa vain `>>`-tulostukseen; sisäinen aritmetiikka on aina binaarinen.

### Kirjoitusjärjestelmän aktivointi

Kirjoita kohdejärjestelmän `0` ja `9` numero `#…#`:n sisään:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabia-Intia (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // nollaa ASCII:lle
```

### Tulostus ja totuusarvot

```zymbol
x = 42
>> x ¶          // → 42   (ASCII oletuksena)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimaalipiste on aina ASCII)
>> 1 + 2 ¶      // → ३

// Totuusarvot: # etuliite on aina ASCII, numero mukautuu
>> #1 ¶         // → #१   (tosi Devanagarissa)
>> #0 ¶         // → #०   (epätosi — erotettavissa ०:sta kokonaisluku nollasta)

x = 28 > 4
>> x ¶          // → #१   (vertailutulos seuraa aktiivista tilaa)
```

### Alkuperäiset numeroliteraalit lähdekoodissa

Minkä tahansa tuetun järjestelmän numerot ovat kelvollisia literaaleja — väleissä, modulo, vertailuissa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Totuusarvoliteraalit missä tahansa järjestelmässä

`#` + numero `0` tai `1` mistä tahansa lohkosta on kelvollinen totuusarvoliteraali:

```zymbol
#٠٩#
aktiivinen = #١        // sama kuin #1
>> aktiivinen ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` on **aina ASCII**. `#0` (epätosi) on aina visuaalisesti erotettavissa `0`:sta (kokonaisluku nolla) kaikissa järjestelmissä.

---

## Tietooperaattorit

```zymbol
// Tyyppikastit
f = ##.42         // → 42.0  (Liukuluvuksi)
i = ###3.7        // → 4     (Kokonaisluvuksi, pyöristys)
t = ##!3.7        // → 3     (Kokonaisluvuksi, katkaisu)

// Jäsennä merkkijono numeroksi
v1 = #|"42"|      // → 42  (Kokonaisluku)
v2 = #|"3.14"|    // → 3.14  (Liukuluku)
v3 = #|"abc"|     // → "abc"  (turvallinen, ei virhettä)

// Pyöristä / katkaise
pi = 3.14159265
p2 = #.2|pi|      // → 3.14  (pyöristä 2 desimaaliin)
p4 = #.4|pi|      // → 3.1416
k2 = #!2|pi|      // → 3.14  (katkaisu)

// Numeromuotoilu
fmt = #,|1234567|  // → 1,234,567  (tuhaterottimella)
tie = #^|12345.678|    // → 1.2345678e4  (tieteellinen notaatio)

// Kantoliteraalit
a = 0x41         // → 'A'  (heksadesimaali)
b = 0b01000001   // → 'A'  (binaari)
c = 0o101        // → 'A'  (oktaali)

// Kantomuunnoksen tulostus
heks = 0x|255|    // → "0x00FF"
bin = 0b|65|      // → "0b1000001"
okt = 0o|8|       // → "0o10"
des = 0d|255|     // → "0d0255"
```

---

## Shell-integraatio

```zymbol
paivamaara = <\ date +%Y-%m-%d \>     // kaappaa stdout (sisältää lopputavan \n)
>> "Tanaan: " paivamaara

tiedosto = "tiedot.txt"
sisalto = <\ cat {tiedosto} \>      // interpolointi komennoissa

tuloste = </"./aliohjelma.zy"/>   // suorita toinen Zymbol-ohjelma, kaappaa tuloste
>> tuloste
```

> `><` kaappaa CLI-argumentit merkkijonotaulukkona (vain puuläpikäynti).

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

## Symbolitaulukko

| Symboli | Toiminto | Symboli | Toiminto |
|---------|----------|---------|----------|
| `=` | muuttuja | `$#` | pituus |
| `:=` | vakio | `$+` | lisää (ketjutettavissa) |
| `>>` | tuloste | `$+[i]` | lisää indeksiin (1-pohjainen) |
| `<<` | syöte | `$-` | poista ensimmäinen arvon mukaan |
| `¶` / `\\` | rivinvaihto | `$--` | poista kaikki arvon mukaan |
| `?` | if | `$-[i]` | poista indeksin mukaan (1-pohjainen) |
| `_?` | else-if | `$-[i..j]` | poista väli (1-pohjainen) |
| `_` | else / jokerikortti | `$?` | sisältää |
| `??` | hahmontäsmäytys | `$??` | etsi kaikki indeksit (1-pohjainen) |
| `@` | silmukka | `$[s..e]` | osa (1-pohjainen) |
| `@ N { }` | silmukka N kertaa | `$>` | map |
| `@!` | keskeytä | `$\|` | filter |
| `@>` | jatka | `$<` | reduce |
| `@:nimi { }` | nimetty silmukka | `$/ erotin` | merkkijonon jako |
| `@:nimi!` | keskeytä nimi | `$++ a b c` | ketjutusrakenne |
| `@:nimi>` | jatka nimeä | `taulukko[i>j>k]` | navigaatioindeksi |
| `->` | lambda | `taulukko[i] = a` | päivitä elementti (vain taulukot) |
| `taulukko[i] += a` | yhdistelmäpäivitys | `taulukko[i]$~` | toiminnallinen päivitys (uusi kopio) |
| `$^+` | lajittele nousevaan (primitiivit) | `$^-` | lajittele laskevaan (primitiivit) |
| `$^` | lajittele vertailulla (monikot) | `<~` | palauta |
| `\|>` | putki | `!?` | kokeile |
| `:!` | kiinni | `:>` | lopuksi |
| `#1` | tosi | `#0` | epätosi |
| `$!` | on virhe | `$!!` | levitä virhe |
| `<#` | tuonti | `#>` | vienti |
| `#` | ilmoita moduuli | `::` | moduulikutsu |
| `.` | kentän pääsy | `#?` | tyypin metatieto |
| `#\|..\|` | jäsennä numero | `##.` | kasta Liukuluvuksi |
| `###` | kasta Kokonaisluvuksi (pyöristys) | `##!` | kasta Kokonaisluvuksi (katkaisu) |
| `#.N\|..\|` | pyöristä | `#!N\|..\|` | katkaise |
| `#,\|..\|` | pilkkumuoto | `#^\|..\|` | tieteellinen notaatio |
| `#d0d9#` | numeraalijärjestelmän vaihdin | `#09#` | nollaa ASCII:lle |
| `<\ ..\>` | shell-suoritus | `>\<` | CLI-argumentit |
| `\ muuttuja` | tuhoa muuttuja eksplisiittisesti | `°x` / `x°` | kuuma määrittely (auto-alustus) |
| `>>|` | TUI-lohko (vaihtoehtonäyttö) | `>>~` | sijaintituloste |
| `>>!` | tyhjennä näyttö | `>>?` | kysy terminaalin koko |
| `<<\|` | estävä näppäinpainallus | `<<\|?` | ei-estävä näppäinpainallus |
| `@~ N` | nuku N millisekuntia | `$*` | toista merkkijono N kertaa |

---

## Muutosloki

### v0.0.5 — TUI-primitiivit, kuuma määrittely ja merkkijonon toistaminen _(Toukokuu 2026)_

- **Rikkova** Hahmontäsmäytyshaaran erotin: `malli : tulos` → `malli => tulos`
- **Rikkova** Tuontialias: `<# polku <= alias` → `<# polku => alias`
- **Rikkova** Viennin uudelleennimeäminen: `#> { fn <= julk }` → `#> { fn => julk }`
- **Lisätty** TUI-lohko `>>| { }` — vaihtoehtonäyttö + raakamodi; siivotaan poistuessa
- **Lisätty** Sijaintituloste `>>~ (rivi, sarake, BKS, fg, bg) > kohteet` — harva paikat, 256-väri ANSI
- **Lisätty** Näppäinsyöte `<<| muuttuja` (estävä) ja `<<|? muuttuja` (ei-estävä kysely)
- **Lisätty** `>>!` tyhjennä näyttö, `>>?` kysy terminaalin koko, `@~ N` nuku N millisekuntia
- **Lisätty** Kuuma määrittely `°x` / `x°` — auto-alustaa muuttujan ensimmäisessä käytössä silmukoissa
- **Lisätty** Merkkijonon toistaminen `merkkijono $* N` — toista merkkijono N kertaa
- **VM** Pariteetti: 436/436 testiä läpäisee

### v0.0.4 — 1-pohjainen indeksointi, ensimmäisen luokan funktiot ja moduulilohkot _(Huhtikuu 2026)_

- **Rikkova** Kaikki indeksointi vaihdettu **1-pohjaiseksi** — `taulukko[1]` on ensimmäinen elementti; `taulukko[0]` on ajonaikainen virhe
- **Lisätty** Nimetyt funktiot ovat **ensimmäisen luokan arvoja** — välitä suoraan KAF:lle: `numerot$> kaksinkertaista`
- **Lisätty** Moduulin **lohkosyntaksi** vaaditaan: `# nimi { ... }` — tasainen syntaksi poistettu
- **Lisätty** Moniulotteinen indeksointi: `taulukko[i>j>k]` (navigaatio), `taulukko[p ; q]` (tasainen purkaminen)
- **Lisätty** Tyyppikastit: `##.lauseke` (Liukuluku), `###lauseke` (Kokonaisluku pyöristys), `##!lauseke` (Kokonaisluku katkaisu)
- **Lisätty** Merkkijonon jako: `merkkijono$/ erotin` — palauttaa `Array(String)`
- **Lisätty** Ketjutusrakenne: `pohja$++ a b c` — lisää useita kohteita
- **Lisätty** N kertaa silmukka: `@ N { }` — toista tasan N kertaa
- **Lisätty** Nimetyn silmukan syntaksi: `@:nimi { }`, `@:nimi!`, `@:nimi>` — korvaa `@ @nimi` / `@! nimi`
- **Lisätty** Muuttujien näkyvyysalueen säännöt: `_nimi`-muuttujilla on tarkka lohkonäkyvyysalue; `\ muuttuja` tuhoaa aikaisin
- **Lisätty** Hahmontäsmäytyksen vertailutavat: `< 0 :`, `> 5 :`, `== 42 :` jne.
- **Lisätty** Moduulin E013-virhe: suoritettavat lauseet moduulin rungossa ovat kiellettyjä
- **Korjattu** `take_variable` ei enää vioita moduulin vakioita takaisinkirjoituksessa
- **Korjattu** `alias.VAKIO` ratkeaa nyt oikein; `#>` voi esiintyä funktioiden määritysten jälkeen
- **VM** Täysi pariteetti: 393/393 testiä läpäisee

### v0.0.3 — Unicode-numeraalijärjestelmät ja LSP-parannukset _(Huhtikuu 2026)_

- **Lisätty** 69 Unicode-numerolohkoa tilakytkintokenilla `#d0d9#`
- **Lisätty** Totuusarvoliteraalit missä tahansa järjestelmässä — `#१` / `#०`, `#١` / `#٠` jne.
- **Lisätty** Klingon pIqaD-numerot (CSUR PUA U+F8F0–U+F8F9)
- **Lisätty** VM-käskykoodi `SetNumeralMode` — täysi pariteetti puuläpikäynnin kanssa
- **Lisätty** REPL kunnioittaa aktiivista numeraalijärjestelmää kaikussa ja muuttujien näyttämisessä
- **Muutettu** Totuusarvojen `>>` tuloste sisältää nyt `#`-etuliitteen (`#0` / `#1`) kaikissa tiloissa

### v0.0.2_01 — Operaattorin uudelleennimeäminen _(30. Mar 2026)_

- **Muutettu** `c|..|` → `#,|..|` ja `e|..|` → `#^|..|` — yhdenmukainen `#`-formaattietuliiteperheen kanssa
- **Lisätty** Vientialias: vie moduulin jäsenet eri nimellä uudelleen

### v0.0.2 — Kokoelma-API:n uudelleensuunnittelu ja asennusohjelmat _(24. Mar 2026)_

- **Lisätty** Yhtenäinen `$`-operaattoriperhe taulukoille ja merkkijonoille (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lisätty** Hajotussijoitus taulukoille, monikoille ja nimetyille monikoille
- **Lisätty** Negatiiviset indeksit (`taulukko[-1]` = viimeinen elementti)
- **Lisätty** Alkuperäiset asennusohjelmat — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. Mar 2026)_

- **Lisätty** Yhdistelmäsijoitus `^=`
- **Korjattu** Jäsentäjän aritmetiikan reunatapaukset; dokumentaatiokorjaukset

### v0.0.1 — Ensimmäinen julkinen julkaisu _(22. Mar 2026)_

- Puuläpikäyntitulkki + rekisteri-VM (`--vm`, ~4× nopeampi, ~95% pariteetti)
- Kaikki perusrakenteet: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Täydet Unicode-tunnisteet, moduulijärjestelmä, lambdat, sulkeumat, virheenkäsittely
- REPL, LSP, VS Code -laajennus, muotoilija (`zymbol fmt`)

---

_Zymbol-Lang — Symbolinen. Universaali. Muuttumaton._
