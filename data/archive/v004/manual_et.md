> **Märkus:** See dokumentatsioon on loodud tehisintellekti (TI) abil.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanooniline viide on **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** interpretaatori hoidlas.

---

# Zymbol-Lang Käsiraamat

**Zymbol-Lang** on sümboolne programmeerimiskeel. Märksõnu pole — kõik on sümbol. Töötab ühtmoodi igas inimkeeles.

- Pole `if`, `while`, `return` — ainult `?`, `@`, `<~`
- Täielik Unicode tugi — identifikaatorid igas keeles või emojis
- Inimkeelest sõltumatu — kood on kõikjal identne

**Interpretaatori versioon**: v0.0.4 | **Testide katvus**: 393/393 (TW ↔ VM pariteet)

---

## Muutujad ja Konstandid

```zymbol
x = 10              // muutuja — muudetav
PI := 3.14159       // konstant — uuesti omistamine on viga
nimi = "Alice"
aktiivne = #1        // tõeväärtus tõene
👋 := "Tere"
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

## Andmetüübid

| Tüüp | Literaal | Märgend `#?` | Märkused |
|------|---------|--------------|---------|
| Int | `42`, `-7` | `###` | 64-bitine märgiga |
| Float | `3.14`, `1.5e10` | `##.` | Teaduslik notatsioon OK |
| String | `"tekst"` | `##"` | Interpolatsioon: `"Tere {nimi}"` |
| Char | `'A'` | `##'` | Üks Unicode märk |
| Bool | `#1`, `#0` | `##?` | EI ole arvuline — `#1 ≠ 1` |
| Massiiv | `[1, 2, 3]` | `##]` | Homogeensed elemendid |
| Korteež | `(a, b)` | `##)` | Positsiooniline |
| Nimega Korteež | `(x: 1, y: 2)` | `##)` | Nimega väljad |
| Funktsioon | viide nimega funktsioonile | `##()` | Esmaklassiline; kuvatakse `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Esmaklassiline; kuvatakse `<lambd/N>` |

```zymbol
// Tüübi introspektsioon — tagastab (tüüp, numbrid, väärtus)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Väljund ja Sisend

```zymbol
>> "Tere" ¶                      // ¶ või \\ selgesõnaliseks reavahetuseks
>> "a=" a " b=" b ¶              // juxtapositsioon — mitu väärtust
>> (massiiv$#) ¶                 // postfiks-operaatorid vajavad ( ) >>-s

<< nimi                          // lugemine muutujasse (ilma viipata)
<< "Sisesta nimi: " nimi         // vihjeküsimusega
```

> `¶` (AltGr+R Hispaania klaviatuuril) ja `\\` on samaväärsed reavahetused.

---

## Operaatorid

```zymbol
// Aritmeetika — kasuta omistamisi; mõnel operaatoril on eripärad otse >>-s
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (täisarvu jagamine)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (astendamine)

// Võrdlus
a == b    // #0
a <> b    // #1
a < b      // #0
a <= b    // #0
a > b      // #1
a >= b     // #1

// Loogika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Sõned

```zymbol
// Kaks konkatenatsiooniviisi
nimi = "Alice"
n = 42

>> "Tere " nimi " sul on " n ¶        // juxtapositsioon — >>-s
kirjeldus = "Tere {nimi}, sul on {n}"  // interpolatsioon — kõikjal
```

```zymbol
s = "Tere Maailm"
pikkus = s$#                  // 11
alamsõne = s$[1..4]           // "Tere"  (indeks 1-st, lõpp kaasav)
sisaldab = s$? "Maailm"       // #1
osad = "a,b,c,d"$/ ','        // [a, b, c, d]  (jaga eraldaja järgi)
asend = s$~~["a":"A"]         // asenda kõik
asend1 = s$~~["a":"A":1]      // asenda esimesed N
```

> `+` on ainult arvude jaoks. Sõnede jaoks kasuta juxtapositsiooni või interpolatsiooni.

---

## Voo Juhtimine

```zymbol
x = 7

? x > 0 { >> "positiivne" ¶ }

? x > 100 {
    >> "suur" ¶
} _? x > 0 {
    >> "positiivne" ¶
} _? x == 0 {
    >> "null" ¶
} _ {
    >> "negatiivne" ¶
}
```

> Loogelised sulud `{ }` on **kohustuslikud** isegi ühe lause puhul.

---

## Sobitamine

```zymbol
// Vahemikud
punktid = 85
hinne = ?? punktid {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> hinne ¶    // → B

// Sõned
värv = "punane"
kood = ?? värv {
    "punane"   : "#FF0000"
    "roheline" : "#00FF00"
    _          : "#000000"
}

// Võrdlusmustrid
temp = -5
olek = ?? temp {
    < 0  : "jää"
    < 20 : "külm"
    < 35 : "soe"
    _    : "kuum"
}
>> olek ¶    // → jää

// Lause vorm (ploki harud)
?? n {
    0       : { >> "null" ¶ }
    _? n < 0: { >> "negatiivne" ¶ }
    _       : { >> "positiivne" ¶ }
}
```

---

## Tsüklid

```zymbol
@ i:0..4  { >> i " " }        // vahemik kaasav:    0 1 2 3 4
@ i:1..9:2 { >> i " " }       // sammuga:           1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tagurpidi:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

puuviljad = ["õun", "pirn", "viinamari"]
@ f:puuviljad { >> f ¶ }      // for-each massiiv

@ c:"maailm" { >> c "-" }
>> ¶                          // → m-a-a-i-l-m-  (for-each sõne)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jätka
    ? i > 7 { @! }             // @! katkesta
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Lõpmatu tsükkel
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Sildistatud tsükkel (pesastatud katkestused)
loendur = 0
@:välimine {
    loendur++
    ? loendur >= 3 { @:välimine! }
}
>> loendur ¶                 // → 3
```

---

## Funktsioonid

```zymbol
liida(a, b) { <~ a + b }
>> liida(3, 4) ¶    // → 7

faktoriaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriaal(n - 1)
}
>> faktoriaal(5) ¶    // → 120
```

Funktsioonidel on **isoleeritud ulatus** — ei saa lugeda väliseid muutujaid. Kasuta väljundparameetreid `<~` kutsuva funktsiooni muutujate muutmiseks:

```zymbol
vaheta(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
vaheta(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nimega funktsioonid on **esmaklassilised väärtused** — edasta otse: `arvud$> kahekorda`. Mähis: `x -> fn(x)` on samuti õige.

---

## Lambdad ja Sulundid

```zymbol
kahekorda = x -> x * 2
summa = (a, b) -> a + b
>> kahekorda(5) ¶    // → 10
>> summa(3, 7) ¶   // → 10

// Ploki lambda
klassifitseeri = x -> {
    ? x > 0 { <~ "positiivne" }
    _? x < 0 { <~ "negatiivne" }
    <~ "null"
}

// Sulund — haarab välise ulatuse
kordaja = 3
kolmekorda = x -> x * kordaja
>> kolmekorda(7) ¶    // → 21

// Tehase
make_adder(n) { <~ x -> x + n }
liida10 = make_adder(10)
>> liida10(5) ¶    // → 15

// Massiivides
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Massiivid

Massiivid on **muudetavad** ja sisaldavad **sama tüübi** elemente.

```zymbol
massiiv = [1, 2, 3, 4, 5]

massiiv[1]          // 1 — juurdepääs (indeks 1-st: esimene element)
massiiv[-1]         // 5 — negatiivne indeks (viimane element)
massiiv$#           // 5 — pikkus (kasuta (massiiv$#) >>-s)

massiiv = massiiv$+ 6            // lisa → [1,2,3,4,5,6]
massiiv2 = massiiv$+[2] 99       // sisesta positsioonile 2 (indeks 1-st)
massiiv3 = massiiv$- 3           // eemalda väärtuse esimene esinemine
massiiv4 = massiiv$-- 3          // eemalda kõik esinemised
massiiv5 = massiiv$-[1]          // eemalda indeksil 1 (esimene element)
massiiv6 = massiiv$-[2..3]       // eemalda vahemik (indeks 1-st, lõpp kaasav)

sisaldab = massiiv$? 3         // #1 — sisaldab
pos = massiiv$?? 3             // [3] — kõik väärtuse indeksid (indeks 1-st)
viil = massiiv$[1..3]          // [1,2,3] — viil (indeks 1-st, lõpp kaasav)
viil2 = massiiv$[1:3]          // [1,2,3] — sama, arvestamissüntaks

kasv = massiiv$^+              // sorteeritud kasvavalt  (ainult primitiivid)
lang = massiiv$^-              // sorteeritud kahanevalt (ainult primitiivid)

// Korteežide massiivid — kasuta $^ võrdlusega lambda
db = [(nimi: "Carla", vanus: 28), (nimi: "Ana", vanus: 25), (nimi: "Bob", vanus: 30)]
vanuse_järgi = db$^ (a, b -> a.vanus < b.vanus)
nime_järgi   = db$^ (a, b -> a.nimi > b.nimi)
>> vanuse_järgi[1].nimi ¶     // → Ana
>> nime_järgi[1].nimi ¶       // → Carla

// Elemendi otsene uuendamine (ainult massiivid)
massiiv[1] = 99              // omista
massiiv[2] += 5              // liit: +=  -=  *=  /=  %=  ^=

// Funktsionaalne uuendamine — tagastab uue massiivi; originaal muutmatu
massiiv2 = massiiv[2]$~ 99
```

> Kõik kogumioperaatorid tagastavad **uue massiivi**. Omista tagasi: `massiiv = massiiv$+ 4`.
> `$^+` / `$^-` sorteerivad **primitiivide massiive** (arvud, sõned). Korteežide massiivide jaoks kasuta `$^` võrdlusega lambda.
> **Indekseerimine 1-st**: `massiiv[1]` on esimene element; `massiiv[0]` on käivitusviga.

**Väärtuse semantika** — massiivi omistamine teisele muutujale loob sõltumatu koopia:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ei ole mõjutatud
```

```zymbol
// Pesastatud massiivid (indekseerimine 1-st)
maatriks = [[1,2,3],[4,5,6],[7,8,9]]
>> maatriks[2][3] ¶    // → 6  (rida 2, veerg 3)
```

---

## Destruktureerimine

```zymbol
// Massiiv
massiiv = [10, 20, 30, 40, 50]
[a, b, c] = massiiv              // a=10  b=20  c=30
[esimene, *ülejäänud] = massiiv  // esimene=10  ülejäänud=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ hülgab

// Positsiooniline korteež
punkt = (100, 200)
(px, py) = punkt                 // px=100  py=200

// Nimega korteež
isik = (nimi: "Ana", vanus: 25, linn: "Madrid")
(nimi: n, vanus: v) = isik       // n="Ana"  v=25
```

---

## Korteežid

Korteežid on **muutmatud** järjestatud konteinerid, mis võivad sisaldada **erinevat tüüpi** väärtusi. Erinevalt massiividest ei saa elemente pärast loomist muuta.

```zymbol
// Positsiooniline — lubatud segatud tüübid
punkt = (10, 20)
>> punkt[1] ¶    // → 10

andmed = (42, "tere", #1, 3.14)
>> andmed[3] ¶     // → #1

// Nimega
isik = (nimi: "Alice", vanus: 25)
>> isik.nimi ¶    // → Alice
>> isik[1] ¶      // → Alice  (indeks töötab ka, 1-st)

// Pesastatud
asukoht = (x: 10, y: 20)
p = (asukoht: asukoht, märgend: "algus")
>> p.asukoht.x ¶        // → 10
```

**Muutmatus** — iga katse muuta korteeži elementi on käivitusviga:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ käivitusviga: korteežid on muutmatud
// t[1] += 5    // ❌ sama viga
```

Muudetud väärtuse saamiseks kasuta `$~` (funktsionaalne uuendamine) — tagastab **uue** korteeži:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originaal muutmatu
>> t2 ¶    // → (10, 999, 30)

// Nimega korteež — taasloomine eksplitsiitselt
isik = (nimi: "Alice", vanus: 25)
vanem  = (nimi: isik.nimi, vanus: 26)
>> isik.vanus ¶    // → 25
>> vanem.vanus ¶   // → 26
```

---

## Kõrgema Järgu Funktsioonid

```zymbol
arvud = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kahekordistatud = arvud$> (x -> x * 2)                // map  → [2,4,6…20]
paarisarvud     = arvud$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
kokku           = arvud$< (0, (acc, x) -> acc + x)     // reduce → 55

// Ahel ajutiste muutujate kaudu
samm1 = arvud$| (x -> x > 3)
samm2 = samm1$> (x -> x * x)
>> samm2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nimega funktsioone saab otse KJF-le edastada
kahekorda(x) { <~ x * 2 }
on_suur(x) { <~ x > 5 }
r = arvud$> kahekorda       // ✅ otse viide
r = arvud$| on_suur         // ✅ otse viide
```

---

## Torujuhe Operaator

Parem pool nõuab alati `_` edastatava väärtuse kohatäitena:

```zymbol
kahekorda = x -> x * 2
liida = (a, b) -> a + b
suurenda = x -> x + 1

5 |> kahekorda(_)        // → 10
10 |> liida(_, 5)    // → 15
5 |> liida(2, _)     // → 7

// Ahel
r = 5 |> kahekorda(_) |> suurenda(_) |> kahekorda(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Veakäsitlus

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "jagamine nulliga" ¶
} :! {
    >> "muu: " _err ¶    // _err sisaldab veateadet
} :> {
    >> "täidetakse alati" ¶
}
```

| Tüüp | Millal |
|------|--------|
| `##Div` | Jagamine nulliga |
| `##IO` | Fail / süsteem |
| `##Index` | Indeks väljaspool piire |
| `##Type` | Tüübide mittevastavus |
| `##Parse` | Andmete sõelumine |
| `##Network` | Võrgu vead |
| `##_` | Iga viga (catch-all) |

---

## Moodulid

```zymbol
// lib/arvutused.zy — mooduli keha on suletud loogeliste sulgudega
# arvutused {
    #> { liida, get_PI }

    _PI := 3.14159
    liida(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/arvutused <= a    // pseudonüüm on kohustuslik

>> a::liida(5, 3) ¶        // → 8
pi = a::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksport teise avaliku nime all
# minulib {
    #> { _sise_liida <= summa }

    _sise_liida(a, b) { <~ a + b }
}
```

```zymbol
<# ./minulib <= m

>> m::summa(3, 4) ¶    // → 7  (sisemine nimi _sise_liida on peidetud)
```

> **Mooduli reeglid**: ainult `#>`, funktsioonidefinitsioonid ja literaalsete muutujate/konstantide initsialisaatorid on lubatud `# name { }` sees. Täidetavad avaldused (`>>`, `<<`, tsüklid jne) põhjustavad viga E013.

---

## Arvurežiimid

Zymbol suudab kuvada numbreid **69 Unicode numbrimärkide blokis** — Devanaagari, Araabia-India, Tai, Klingoni pIqaD, matemaatiline paksus, LCD-numbrid ja palju muud. Aktiivne režiim mõjutab ainult `>>` väljundit; sisemine aritmeetika on alati binaarne.

### Režiimi aktiveerimine

Kirjuta sihtkirja `0` ja `9` numbrid `#…#` vahele:

```zymbol
#०९#    // Devanaagari       (U+0966–U+096F)
#٠٩#    // Araabia-India     (U+0660–U+0669)
#๐๙#    // Tai               (U+0E50–U+0E59)
#09#    // lähtesta ASCII-le
```

### Väljund ja loogikaväärtused

```zymbol
x = 42
>> x ¶          // → 42   (ASCII vaikimisi)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (kümnendpunkt alati ASCII)
>> 1 + 2 ¶      // → ३

// Tõeväärtused: eesliide # alati ASCII, number kohandub
>> #1 ¶         // → #१   (tõene Devanaagaris)
>> #0 ¶         // → #०   (väär — erineb ०  täisarvu nullist)

x = 28 > 4
>> x ¶          // → #१   (võrdlustulem järgib aktiivset režiimi)
```

### Sisseehitatud arvuliteraalid lähtekoodis

Iga toetatud süsteemi numbrid on kehtivad literaalid — vahemikes, modulol, võrdlustes:

```zymbol
#٠٩#

@ i:١..١٥ {
    ? i % ١٥ == ٠ { >> "FizzBuzz" ¶ }
    _? i % ٣  == ٠ { >> "Fizz" ¶ }
    _? i % ٥  == ٠ { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Loogilised literaalid kõigis süsteemides

`#` + number `0` või `1` mis tahes toetatud plokist on kehtiv loogiline literaal:

```zymbol
#٠٩#
aktiivne = #١        // sama mis #1
>> aktiivne ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` on **alati ASCII**. `#0` (väär) erineb alati visuaalselt `0`-st (täisarvu null) igas süsteemis.

---

## Andmeoperaatorid

```zymbol
// Tüübi teisendused
##.42         // → 42.0  (Float-iks)
###3.7        // → 4     (Int-iks, ümardamine)
##!3.7        // → 3     (Int-iks, kärpimine)

// Sõne sõelumine arvuks
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ohutu ebaõnnestumine, viga puudub)

// Ümardamine / kärpimine
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (ümarda 2 komakohani)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kärbi)

// Arvude vormindamine
fmt = #,|1234567|  // → 1,234,567  (eraldajatega)
sci = #^|12345.678|    // → 1.2345678e4  (teaduslik notatsioon)

// Literaalid erinevates alussüsteemides
a = 0x41         // → 'A'  (heksadetsimaal)
b = 0b01000001   // → 'A'  (binaarne)
c = 0o101        // → 'A'  (oktaal)

// Väljund aluse teisendusega
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Kesta Integratsioon

```zymbol
kuupäev = <\ date +%Y-%m-%d \>       // hõivab stdout (sisaldab \n)
>> "Täna: " kuupäev

fail = "data.txt"
sisu = <\ cat {fail} \>              // interpolatsioon käskudes

tulemus = </"./alaskript.zy"/>       // käivita teine Zymbol skript, hõivab väljundi
>> tulemus
```

> `>\<` hõivab CLI argumendid sõnede massiivina (ainult tree-walker).

---

## Täielik Näide: FizzBuzz

```zymbol
klassifitseeri(arv) {
    ? arv % 15 == 0 { <~ "FizzBuzz" }
    _? arv % 3  == 0 { <~ "Fizz" }
    _? arv % 5  == 0 { <~ "Buzz" }
    _ { <~ arv }
}

@ i:1..20 { >> klassifitseeri(i) ¶ }
```

---

## Sümbolite Viide

| Sümbol | Operatsioon | Sümbol | Operatsioon |
|--------|-------------|--------|-------------|
| `=` | muutuja | `$#` | pikkus |
| `:=` | konstant | `$+` | lisa (ahel) |
| `>>` | väljund | `$+[i]` | sisesta indeksile (1-st) |
| `<<` | sisend | `$-` | eemalda esimene väärtuse järgi |
| `¶` / `\\` | reavahetust | `$--` | eemalda kõik väärtuse järgi |
| `?` | kui | `$-[i]` | eemalda indeksil (1-st) |
| `_?` | muidu-kui | `$-[i..j]` | eemalda vahemik (1-st) |
| `_` | muidu / kohatäide | `$?` | sisaldab |
| `??` | sobitamine | `$??` | leia kõik indeksid (1-st) |
| `@` | tsükkel | `$[s..e]` | viil (1-st) |
| `@ N { }` | tsükkel N korda | `$>` | kaardistamine |
| `@!` | katkesta | `$\|` | filtreerimine |
| `@>` | jätka | `$<` | redutseerimine |
| `@:name { }` | sildistatud tsükkel | `$/ delim` | jaga sõne |
| `@:name!` | katkesta sildiga | `$++ a b c` | ehita liitmisega |
| `@:name>` | jätka sildiga | `massiiv[i>j>k]` | navigatsiooni indeks |
| `->` | lambda | `massiiv[i] = val` | uuenda element (ainult massiivid) |
| `massiiv[i] += val` | liit-uuendus | `massiiv[i]$~` | funktsionaalne uuendus (uus koopia) |
| `$^+` | sorteeri kasvavalt (primitiivid) | `$^-` | sorteeri kahanevalt (primitiivid) |
| `$^` | sorteeri võrdlusega (korteežid) | `<~` | tagasta |
| `\|>` | torujuhe | `!?` | proovi |
| `:!` | püüa | `:>` | lõpuks |
| `#1` | tõene | `#0` | väär |
| `$!` | on viga | `$!!` | levi viga |
| `<#` | impordi | `#>` | ekspordi |
| `#` | deklareeri moodul | `::` | mooduli kutse |
| `.` | välja juurdepääs | `#?` | tüübi metaandmed |
| `#\|..\|` | sõelu arv | `##.` | teisenda Float-iks |
| `###` | teisenda Int-iks (ümardus) | `##!` | teisenda Int-iks (kärpimine) |
| `#.N\|..\|` | ümarda | `#!N\|..\|` | kärbi |
| `#,\|..\|` | vorming eraldajatega | `#^\|..\|` | teaduslik |
| `#d0d9#` | arvurežiimi lüliti | `#09#` | lähtesta ASCII-le |
| `<\ ..\>` | käivita kest | `>\<` | CLI argumendid |
| `\ var` | hävita muutuja | | |

---

## Versiooniajalugu

### v0.0.4 — Indekseerimine 1-st, Esmaklassilised Funktsioonid ja Mooduliplokid _(aprill 2026)_

- **Muudetud** Kogu indekseerimine teisendati **1-st** — `massiiv[1]` on esimene element; `massiiv[0]` on käivitusviga
- **Lisatud** Nimega funktsioonid on **esmaklassilised väärtused** — edasta otse KJF-le: `arvud$> kahekorda`
- **Lisatud** Kohustuslik **ploki süntaks** moodulitele: `# name { ... }` — tasane süntaks eemaldatud
- **Lisatud** Mitmemõõtmeline indekseerimine: `massiiv[i>j>k]` (navigatsioon), `massiiv[p ; q]` (tasane ekstraheerimine)
- **Lisatud** Tüübi teisendused: `##.expr` (Float), `###expr` (Int ümardus), `##!expr` (Int kärpimine)
- **Lisatud** Sõne jagamine: `str$/ delim` — tagastab `Array(String)`
- **Lisatud** Ehitamine liitmisega: `base$++ a b c` — lisab mitu elementi
- **Lisatud** Tsükkel N korda: `@ N { }` — korda täpselt N korda
- **Lisatud** Sildistatud tsükli süntaks: `@:name { }`, `@:name!`, `@:name>` — asendab `@ @name` / `@! name`
- **Lisatud** Ulatusreeglid: `_name` muutujatel on täpne ploki ulatus; `\ var` hävitab varem
- **Lisatud** Võrdlusmustrid sobitamises: `< 0 :`, `> 5 :`, `== 42 :` jne
- **Lisatud** Mooduli viga E013: täidetavad avaldused mooduli kehas on keelatud
- **Parandatud** `take_variable` ei riku enam mooduli konstante tagasikirjutamisel
- **Parandatud** `alias.CONST` lahendub nüüd korrektselt; `#>` võib ilmuda pärast funktsioonidefinitsioone
- **VM** Täielik pariteet: 393/393 testi läbib

### v0.0.3 — Unicode Arvusüsteemid ja LSP Täiustused _(aprill 2026)_

- **Lisatud** 69 Unicode numbrimärkide blokki lülitusmärgiga `#d0d9#`
- **Lisatud** Tõeväärtuse literaalid kõigis süsteemides — `#१` / `#०`, `#١` / `#٠` jne
- **Lisatud** Klingoni pIqaD numbrid (CSUR PUA U+F8F0–U+F8F9)
- **Lisatud** VM-opkood `SetNumeralMode` — täielik pariteet tree-walkeriga
- **Lisatud** REPL järgib aktiivset arvurežiimi kaja kuvamisel ja muutujate vaatamisel
- **Muudetud** Boole'i väljund `>>` sisaldab nüüd eesliidet `#` (`#0` / `#1`) kõigis režiimides

### v0.0.2_01 — Operaatorite Ümbernimetamine _(30. märts 2026)_

- **Muudetud** `c|..|` → `#,|..|` ja `e|..|` → `#^|..|` — kooskõlas `#` eesliite perekonnaga
- **Lisatud** Ekspordi pseudonüüm: mooduli liikmete taaseksport teise nime all

### v0.0.2 — Kogumike Ümberdisain ja Installerid _(24. märts 2026)_

- **Lisatud** Ühtne `$` operaatorite perekond massiivide ja sõnede jaoks (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lisatud** Destruktureerimine massiivide, korteežide ja nimega korteežide jaoks
- **Lisatud** Negatiivsed indeksid (`massiiv[-1]` = viimane element)
- **Lisatud** Natiivsed installerid — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. märts 2026)_

- **Lisatud** Liit-omistamine `^=`
- **Parandatud** Parseri aritmeetika servaolukorrad; dokumentatsiooni parandused

### v0.0.1 — Esimene Avalik Väljalase _(22. märts 2026)_

- Tree-walker interpretaator + register-VM (`--vm`, ~4× kiirem, ~95% pariteet)
- Kõik põhikonstruktsioonid: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Täielikud Unicode identifikaatorid, moodulisüsteem, lambdad, sulundid, veakäsitlus
- REPL, LSP, VS Code laiendus, vormindaja (`zymbol fmt`)

---

_Zymbol-Lang — Sümboolne. Universaalne. Muutumatu._
