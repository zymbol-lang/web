> **Hoiatus:** See dokumentatsioon on loodud ja tõlgitud tehisintellekti (TI) abil.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Käsiraamat

> **Läbi vaadatud versiooni v0.0.5 jaoks — 2026-05-12**

**Zymbol-Lang** on sümboolne programmeerimiskeel. Ilma märksõnadeta — kõik on sümbol. Töötab ühesuguselt igas inimkeeles.

- Ei mingit `if`, `while`, `return` — ainult `?`, `@`, `<~`
- Täielik Unicode — identifikaatorid igas keeles või emojis
- Inimloomuliselt neutraalne — kood on igal pool sama

**Interpreteri versioon**: v0.0.5 | **Testide katvus**: 436/436 (TW ↔ VM pariteetsus)

---

## Muutujad ja konstandid

```zymbol
x = 10              // muutuv muutuja
PI := 3.14159       // konstant — uuestiomistamine on käitusaja viga
nimi = "Alice"
aktiivne = #1       // tõeväärtus tõene
👋 := "Tere"
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

`°` (kraadimärk, U+00B0) lähtestab muutuja automaatselt esimesel kasutamisel neutraalväärtusega:

```zymbol
numbrid = [3, 1, 4, 1, 5]
@ n:numbrid {
    °kokku += n    // autolähtestus 0-le enne silmust; säilib pärast @
}
>> kokku ¶         // → 14
```

> `°x` (eesliide) ankureerib silmuse kohale — tulemus on kättesaadav pärast `@`.
> `x°` (järelliide) ankureerib silmuse sisse — kaob silmuse lõppedes.
> Ainult puuläbija jaoks.

---

## Andmetüübid

| Tüüp | Literaal | `#?` silt | Märkused |
|------|---------|----------|---------|
| Täisarv | `42`, `-7` | `###` | 64-bitine märgiga |
| Ujukomaarv | `3.14`, `1.5e10` | `##.` | Teaduslik notatsioon OK |
| String | `"tekst"` | `##"` | Interpolatsioon: `"Tere {nimi}"` |
| Märk | `'A'` | `##'` | Üks Unicode'i märk |
| Tõeväärtus | `#1`, `#0` | `##?` | EI ole arvuline — `#1 ≠ 1` |
| Massiiv | `[1, 2, 3]` | `##]` | Homogeensed elemendid |
| Korteež | `(a, b)` | `##)` | Positsiooniline |
| Nimega korteež | `(x: 1, y: 2)` | `##)` | Nimega väljad |
| Funktsioon | nimega funktsiooni viide | `##()` | Esimese klassi; kuvatakse `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Esimese klassi; kuvatakse `<lambd/N>` |

```zymbol
// Tüübi introspektsioon — tagastab (tüüp, numbrid, väärtus)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Väljund ja sisend

```zymbol
>> "Tere" ¶                      // ¶ või \\ selgesõnalise reavahetuse jaoks
>> "a=" a " b=" b ¶              // kõrvutamine — mitu väärtust
>> (massiiv$#) ¶                 // järelliite operaatorid nõuavad ( ) >>-s

<< nimi                          // loe muutujasse (ilma viipata)
<< "Sisesta nimi: " nimi         // viipaga
```

> `¶` (AltGr+R Hispaania klaviatuuril) ja `\\` on samaväärsed reavahetused.

---

## TUI primitiivid

Terminali kasutajaliidese operaatorid interaktiivsete programmide jaoks. Enamik nõuab `>>| { }` plokki (alternatiivne ekraan + toorrežiim).

```zymbol
>>| {
    >>!                             // puhasta alternatiivne ekraan
    >>~ (1, 1, 0, 10) > "Jookseb"  // rida 1, veerg 1, fg=10 (roheline)
    @~ 1000                         // paus 1 sekund (1000 ms)
    >>~ (2, 1) > "Valmis."
}
// terminal taastatakse automaatselt väljumisel
```

```zymbol
// Klahvivajutus ja terminali suurus
>>| {
    [read, veerud] = >>?              // päri terminali mõõtmed
    >>~ (1, 1) > "Terminal: " read " x " veerud
    <<| klahv                         // blokeeriv klahvivajutuse lugemine
    >>~ (2, 1) > "Vajutati: " klahv
}
```

> `>>!` puhastab ekraani. `>>?` tagastab `[read, veerud]`. `@~ N` magab N millisekundit.
> `<<|` loeb ühe klahvivajutuse (blokeeriv); `<<|?` küsib blokeerimata (tagastab `'\0'` kui pole).
> Positsioneeritud väljundi korteež: `(rida, veerg, BKS, fg, bg)` — iga pesa võib koma abil välja jätta (`>>~ (,,, 196) > "punane"`).
> BKS bitmask: `1`=Paks, `2`=Kaldkiri, `4`=Allakriipsutus. ANSI 256-värvi palett (`0`=terminali vaikimisi).
> Ainult puuläbija jaoks (v.a `>>!`, `>>?`, `@~`, `>>~` mis töötavad ka `--vm` režiimis).

---

## Operaatorid

```zymbol
// Aritmeetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (täisarvuline jagamine)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (astendamine)

// Võrdlus — omistada vaatamiseks
v1 = a == b    // #0
v2 = a <> b    // #1
v3 = a < b     // #0
v4 = a <= b    // #0
v5 = a > b     // #1
v6 = a >= b    // #1

// Loogiline
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Stringid

```zymbol
// Kaks konkatenatsioonivormi
nimi = "Alice"
n = 42

>> "Tere " nimi " sul on " n ¶    // kõrvutamine — >>-s
kirjeldus = "Tere {nimi}, sul on {n}"  // interpolatsioon — kõikjal
```

```zymbol
s = "Tere Maailm"
pikkus = s$#                  // 10
alstring = s$[1..4]           // "Tere"  (1-põhine, lõpp kaasaarvatud)
on = s$? "Maailm"             // #1
osad = "a,b,c,d"$/ ','        // [a, b, c, d]  (jaga eraldaja järgi)
asend = s$~~["e":"E"]         // "TErE MaailmE"
asend1 = s$~~["e":"E":1]      // "TErE Maailm"  (ainult esimesed N)
joon = "─" $* 20              // "────────────────────"  (korda N korda)
```

> `+` on ainult arvude jaoks. Kasuta `,`, kõrvutamist või interpolatsiooni stringide jaoks.

---

## Voo juhtimine

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

## Vastavus

```zymbol
// Vahemikud
tulemus = 85
hinne = ?? tulemus {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> hinne ¶    // → B

// Stringid
vari = "punane"
kood = ?? vari {
    "punane"  => "#FF0000"
    "roheline" => "#00FF00"
    _          => "#000000"
}

// Võrdlusmustrid
temp = -5
olek = ?? temp {
    < 0  => "jää"
    < 20 => "külm"
    < 35 => "soe"
    _    => "kuum"
}
>> olek ¶    // → jää

// Lause vorm (ploki harud)
n = -3
?? n {
    0    => { >> "null" ¶ }
    < 0  => { >> "negatiivne" ¶ }
    _    => { >> "positiivne" ¶ }
}
```

---

## Silmused

```zymbol
@ i:0..4  { >> i " " }        // vahemik kaasaarvatud:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // sammuga:               1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tagurpidi:             5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

puuviljad = ["õun", "pirn", "viinamari"]
@ p:puuviljad { >> p ¶ }      // for-each massiiv

@ m:"tere" { >> m "-" }
>> ¶                          // → t-e-r-e-  (for-each string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jätka
    ? i > 7 { @! }             // @! katkesta
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Lõputu silmus
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Märgistatud silmus (pesastatud katkestus)
loendur = 0
@:valine {
    loendur++
    ? loendur >= 3 { @:valine! }
}
>> loendur ¶                    // → 3
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

Funktsioonidel on **isoleeritud ulatus** — nad ei saa lugeda väliseid muutujaid. Kasuta väljundparameetreid `<~` kutsuva koodi muutujate muutmiseks:

```zymbol
vaheta(a<~, b<~) {
    ajutine = a
    a = b
    b = ajutine
}
x = 10
y = 20
vaheta(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nimega funktsioonid on **esimese klassi väärtused** — anna otse edasi: `numbrid$> kahekorda`. Mähkimiseks: `x -> fn(x)` on samuti kehtiv.

---

## Lambdad ja sulundid

```zymbol
kahekorda = x -> x * 2
summa = (a, b) -> a + b
>> kahekorda(5) ¶    // → 10
>> summa(3, 7) ¶     // → 10

// Ploki lambda
klassifitseeri = x -> {
    ? x > 0 { <~ "positiivne" }
    _? x < 0 { <~ "negatiivne" }
    <~ "null"
}

// Sulund — jäädvustab välise ulatuse
tegur = 3
kolmekorda = x -> x * tegur
>> kolmekorda(7) ¶    // → 21

// Tehas
tee_liitja(n) { <~ x -> x + n }
liida10 = tee_liitja(10)
>> liida10(5) ¶    // → 15

// Massiivides
toimingud = [x -> x+1, x -> x*2, x -> x*x]
>> toimingud[3](5) ¶    // → 25
```

---

## Massiivid

Massiivid on **muudetavad** ja hoiavad **sama tüüpi** elemente.

```zymbol
massiiv = [1, 2, 3, 4, 5]

x = massiiv[1]      // 1 — juurdepääs (1-põhine: esimene element)
x = massiiv[-1]     // 5 — negatiivne indeks (viimane element)
x = massiiv$#       // 5 — pikkus (kasuta (massiiv$#) >>-s)

massiiv = massiiv$+ 6            // lisa → [1,2,3,4,5,6]
massiiv2 = massiiv$+[2] 99       // sisesta positsioonile 2 (1-põhine)
massiiv3 = massiiv$- 3           // eemalda väärtuse esimene esinemine
massiiv4 = massiiv$-- 3          // eemalda kõik esinemised
massiiv5 = massiiv$-[1]          // eemalda indeksiga 1 (esimene element)
massiiv6 = massiiv$-[2..3]       // eemalda vahemik (1-põhine, lõpp kaasaarvatud)

on = massiiv$? 3            // #1 — sisaldab
pos = massiiv$?? 3          // [3] — kõik väärtuse indeksid (1-põhine)
lõik = massiiv$[1..3]       // [1,2,3] — lõik (1-põhine, lõpp kaasaarvatud)
lõik2 = massiiv$[1:3]       // [1,2,3] — sama, arvu-põhine süntaks

kasv = massiiv$^+             // sorteeritud kasvavalt  (ainult primitiivid)
lan = massiiv$^-              // sorteeritud kahanevalt (ainult primitiivid)

// Nimega/positsioonilised korteeži massiivid — kasuta $^ võrdleja lambdaga
ab = [(nimi: "Carla", vanus: 28), (nimi: "Ana", vanus: 25), (nimi: "Bob", vanus: 30)]
vanuse_jargi  = ab$^ (a, b -> a.vanus < b.vanus)    // kasvav vanuse järgi  (<)
nime_jargi = ab$^ (a, b -> a.nimi > b.nimi)         // kahanev nime järgi (>)
>> vanuse_jargi[1].nimi ¶     // → Ana
>> nime_jargi[1].nimi ¶       // → Carla

// Otsene elemendi uuendamine (ainult massiivid)
massiiv[1] = 99              // omista
massiiv[2] += 5              // liitmääramine: +=  -=  *=  /=  %=  ^=

// Funktsionaalne uuendamine — tagastab uue massiivi; originaal muutumatult
massiiv2 = massiiv[2]$~ 99
```

> Kõik kollektsioonide operaatorid tagastavad **uue massiivi**. Omista tagasi: `massiiv = massiiv$+ 4`.
> `$+` saab aheldada: `massiiv = massiiv$+ 5$+ 6$+ 7`. Teised operaatorid kasutavad vaheomistusi.
> **Indekseerimine on 1-põhine**: `massiiv[1]` on esimene element; `massiiv[0]` on käitusaja viga.
> `$^+` / `$^-` sorteerivad **primitiivseid massiive** (numbrid, stringid). Korteeži massiivide jaoks kasuta `$^` võrdleja lambdaga — suund on kodeeritud lambdasse (`<` = kasvav, `>` = kahanev).

**Väärtuse semantika** — massiivi teisele muutujale omistamine loob sõltumatu koopia:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ei muutu
```

```zymbol
// Pesastatud massiivid (1-põhine indekseerimine)
maatriks = [[1,2,3],[4,5,6],[7,8,9]]
>> maatriks[2][3] ¶    // → 6  (rida 2, veerg 3)
```

---

## Dekonstrueerimine

```zymbol
// Massiiv
massiiv = [10, 20, 30, 40, 50]
[a, b, c] = massiiv              // a=10  b=20  c=30
[esimene, *ülejäänud] = massiiv  // esimene=10  ülejäänud=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ heidab kõrvale

// Positsiooniline korteež
punkt = (100, 200)
(px, py) = punkt                 // px=100  py=200

// Nimega korteež
isik = (nimi: "Ana", vanus: 25, linn: "Madrid")
(nimi: n, vanus: v) = isik       // n="Ana"  v=25
```

---

## Korteežid

Korteežid on **muutumatud** järjestatud konteinerid, mis võivad hoida **erinevat tüüpi** väärtusi.
Erinevalt massiividest ei saa elemente pärast loomist muuta.

```zymbol
// Positsiooniline — segatüübid lubatud
punkt = (10, 20)
>> punkt[1] ¶    // → 10

andmed = (42, "tere", #1, 3.14)
>> andmed[3] ¶     // → #1

// Nimega
isik = (nimi: "Alice", vanus: 25)
>> isik.nimi ¶    // → Alice
>> isik[1] ¶      // → Alice  (indeks töötab samuti, 1-põhine)

// Pesastatud
pos = (x: 10, y: 20)
p = (pos: pos, silt: "alguspunkt")
>> p.pos.x ¶        // → 10
```

**Muutumatus** — iga katse muuta korteeži elementi on käitusaja viga:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ käitusaja viga: korteežid on muutumatud
// t[1] += 5    // ❌ sama viga
```

Muudetud väärtuse saamiseks kasuta `$~` (funktsionaalne uuendamine) — tagastab **uue** korteeži:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originaal muutumatu
>> t2 ¶    // → (10, 999, 30)

// Nimega korteež — ehita uuesti selgesõnaliselt
isik = (nimi: "Alice", vanus: 25)
vanem  = (nimi: isik.nimi, vanus: 26)
>> isik.vanus ¶    // → 25
>> vanem.vanus ¶   // → 26
```

---

## Kõrgema järgu funktsioonid

```zymbol
numbrid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kahekordistatud  = numbrid$> (x -> x * 2)                // map  → [2,4,6…20]
paaris           = numbrid$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
kokku            = numbrid$< (0, (akum, x) -> akum + x)  // reduce → 55

// Ahel vahemuutujate kaudu
samm1 = numbrid$| (x -> x > 3)
samm2 = samm1$> (x -> x * x)
>> samm2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nimega funktsioone saab otse HOF-ile edasi anda
kahekorda(x) { <~ x * 2 }
on_suur(x) { <~ x > 5 }
r = numbrid$> kahekorda       // ✅ otsene viide
r = numbrid$| on_suur         // ✅ otsene viide
```

---

## Toru operaator

Parempoolne pool nõuab alati `_` kohahoidjana torustatud väärtuse jaoks:

```zymbol
kahekorda = x -> x * 2
liida = (a, b) -> a + b
suurenda = x -> x + 1

r1 = 5 |> kahekorda(_)        // → 10
r2 = 10 |> liida(_, 5)        // → 15
r3 = 5 |> liida(2, _)         // → 7

// Ahelatud
r = 5 |> kahekorda(_) |> suurenda(_) |> kahekorda(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Vigade käsitlemine

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "jagamine nulliga" ¶
} :! {
    >> "muu: " _err ¶    // _err hoiab veateadet
} :> {
    >> "käivitub alati" ¶
}
```

| Tüüp | Millal |
|------|--------|
| `##Div` | Jagamine nulliga |
| `##IO` | Fail / süsteem |
| `##Index` | Indeks piiridest väljas |
| `##Type` | Tüübi mittevastavus |
| `##Parse` | Andmete sõelumine |
| `##Network` | Võrgu vead |
| `##_` | Iga viga (püüab kõik) |

---

## Moodulid

```zymbol
// lib/arv.zy — mooduli keha on ümbritsetud loogeliste sulgudega
# arv {
    #> { liida, saa_PI }

    _PI := 3.14159
    liida(a, b) { <~ a + b }
    saa_PI() { <~ _PI }
}
```

```zymbol
// peamine.zy
<# ./lib/arv => a    // alias on nõutav

>> a::liida(5, 3) ¶     // → 8
pi = a::saa_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksport teise avaliku nimega
# minu_teek {
    #> { _sisemine_liitmine => summa }

    _sisemine_liitmine(a, b) { <~ a + b }
}
```

```zymbol
<# ./minu_teek => m

>> m::summa(3, 4) ¶    // → 7  (sisenimi _sisemine_liitmine on peidetud)
```

> **Mooduli reeglid**: `# nimi { }` sees on lubatud ainult `#>`, funktsioonide definitsioonid ja literaalsed muutuja/konstandi lähtestajad. Käivitatavad laused (`>>`, `<<`, silmused jne) põhjustavad vea E013.

---

## Numbrisüsteemid

Zymbol saab kuvada numbreid **69 Unicode numbrimärkide skriptis** — Devanagari, Araabia-India, Tai, Klingoni pIqaD, matemaatiliselt paksus kirjas, LCD-segmentides ja muus. Aktiivne režiim mõjutab ainult `>>` väljundit; sisemine aritmeetika on alati binaarne.

### Skripti aktiveerimine

Kirjuta sihtskripti `0` ja `9` numbrimärk `#…#` vahel:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Araabia-India (U+0660–U+0669)
#๐๙#    // Tai         (U+0E50–U+0E59)
#09#    // lähtesta ASCII-le
```

### Väljund ja tõeväärtused

```zymbol
x = 42
>> x ¶          // → 42   (ASCII vaikimisi)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (kümnendpunkt on alati ASCII)
>> 1 + 2 ¶      // → ३

// Tõeväärtused: # eesliide on alati ASCII, numbrimärk kohandub
>> #1 ¶         // → #१   (tõene Devanagaris)
>> #0 ¶         // → #०   (väär — erineb ०  täisarvu nullist)

x = 28 > 4
>> x ¶          // → #१   (võrdluse tulemus järgib aktiivset režiimi)
```

### Algsed numbriliteraalid lähtetekstis

Iga toetatud skripti numbrimärgid on kehtivad literaalid — vahemikes, moodulis, võrdlustes:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Tõeväärtuse literaalid mis tahes skriptis

`#` + numbrimärk `0` või `1` mis tahes plokist on kehtiv tõeväärtuse literaal:

```zymbol
#٠٩#
aktiivne = #١        // sama kui #1
>> aktiivne ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` on **alati ASCII**. `#0` (väär) erineb visuaalselt alati `0`-st (täisarvu null) igas skriptis.

---

## Andmeoperaatorid

```zymbol
// Tüübi teisendused
f = ##.42         // → 42.0  (ujukomaarvuks)
i = ###3.7        // → 4     (täisarvuks, ümardamine)
t = ##!3.7        // → 3     (täisarvuks, kärpimine)

// Sõelu string numbriks
v1 = #|"42"|      // → 42  (täisarv)
v2 = #|"3.14"|    // → 3.14  (ujukomaarv)
v3 = #|"abc"|     // → "abc"  (turvaline, ilma veata)

// Ümarda / kärbi
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (ümarda 2 kümnendkohani)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kärpimine)

// Numbri vormindamine
frm = #,|1234567|  // → 1,234,567  (tuhandetega eraldatud)
tead = #^|12345.678|    // → 1.2345678e4  (teaduslik notatsioon)

// Aluse literaalid
a = 0x41         // → 'A'  (kuueteistkümnend)
b = 0b01000001   // → 'A'  (kahendsüsteem)
c = 0o101        // → 'A'  (kaheksandsüsteem)

// Aluse teisenduse väljund
kuueteist = 0x|255|    // → "0x00FF"
kahend = 0b|65|         // → "0b1000001"
kaheksand = 0o|8|       // → "0o10"
kumnend = 0d|255|       // → "0d0255"
```

---

## Shelli integratsioon

```zymbol
kuupäev = <\ date +%Y-%m-%d \>     // jäädvustab stdout (koos lõpu \n-ga)
>> "Täna: " kuupäev

fail = "andmed.txt"
sisu = <\ cat {fail} \>      // interpolatsioon käskudes

väljund = </"./aliskript.zy"/>   // käivita teine Zymbol skript, jäädvusta väljund
>> väljund
```

> `><` jäädvustab CLI argumendid stringi massiivina (ainult puuläbija).

---

## Täielik näide: FizzBuzz

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

## Sümboli viide

| Sümbol | Toiming | Sümbol | Toiming |
|--------|---------|--------|---------|
| `=` | muutuja | `$#` | pikkus |
| `:=` | konstant | `$+` | lisa (ahelatav) |
| `>>` | väljund | `$+[i]` | sisesta indeksisse (1-põhine) |
| `<<` | sisend | `$-` | eemalda esimene väärtuse järgi |
| `¶` / `\\` | reavahetuse | `$--` | eemalda kõik väärtuse järgi |
| `?` | if | `$-[i]` | eemalda indeksi järgi (1-põhine) |
| `_?` | else-if | `$-[i..j]` | eemalda vahemik (1-põhine) |
| `_` | else / metamärk | `$?` | sisaldab |
| `??` | vastavus | `$??` | leia kõik indeksid (1-põhine) |
| `@` | silmus | `$[s..e]` | lõik (1-põhine) |
| `@ N { }` | silmus N korda | `$>` | map |
| `@!` | katkesta | `$\|` | filter |
| `@>` | jätka | `$<` | reduce |
| `@:nimi { }` | märgistatud silmus | `$/ eraldaja` | stringi jagamine |
| `@:nimi!` | katkesta märgistus | `$++ a b c` | konkatenatsiooni ehitamine |
| `@:nimi>` | jätka märgistust | `massiiv[i>j>k]` | navigatsiooni indeks |
| `->` | lambda | `massiiv[i] = v` | uuenda element (ainult massiivid) |
| `massiiv[i] += v` | liitvärskendus | `massiiv[i]$~` | funktsionaalne uuendamine (uus koopia) |
| `$^+` | sorteeri kasvavalt (primitiivid) | `$^-` | sorteeri kahanevalt (primitiivid) |
| `$^` | sorteeri võrdlejaga (korteežid) | `<~` | tagasta |
| `\|>` | toru | `!?` | proovi |
| `:!` | püüa | `:>` | lõpuks |
| `#1` | tõene | `#0` | väär |
| `$!` | on viga | `$!!` | levita viga |
| `<#` | import | `#>` | eksport |
| `#` | deklareeri moodul | `::` | mooduli kutsumine |
| `.` | välja juurdepääs | `#?` | tüübi metaandmed |
| `#\|..\|` | sõelu arv | `##.` | teisenda ujukomaarvuks |
| `###` | teisenda täisarvuks (ümardus) | `##!` | teisenda täisarvuks (kärpimine) |
| `#.N\|..\|` | ümarda | `#!N\|..\|` | kärbi |
| `#,\|..\|` | komaformaat | `#^\|..\|` | teaduslik notatsioon |
| `#d0d9#` | numbrisüsteemi lüliti | `#09#` | lähtesta ASCII-le |
| `<\ ..\>` | shelli käivitamine | `>\<` | CLI argumendid |
| `\ muutuja` | hävita muutuja selgesõnaliselt | `°x` / `x°` | kuum definitsioon (autolähtestus) |
| `>>|` | TUI plokk (alt-ekraan) | `>>~` | positsioneeritud väljund |
| `>>!` | puhasta ekraan | `>>?` | päri terminali suurus |
| `<<\|` | blokeeriv klahvivajutus | `<<\|?` | mitteblokeeriv klahvivajutus |
| `@~ N` | maga N millisekundit | `$*` | korda stringi N korda |

---

## Muudatuste logi

### v0.0.5 — TUI primitiivid, kuum definitsioon ja stringi kordamine _(Mai 2026)_

- **Murrang** Vastavuse haru eraldaja: `muster : tulemus` → `muster => tulemus`
- **Murrang** Impordi alias: `<# tee <= alias` → `<# tee => alias`
- **Murrang** Ekspordis ümbernimetamine: `#> { fn <= pub }` → `#> { fn => pub }`
- **Lisatud** TUI plokk `>>| { }` — alternatiivne ekraan + toovrežiim; puhastab väljumisel
- **Lisatud** Positsioneeritud väljund `>>~ (rida, veerg, BKS, fg, bg) > elemendid` — hõredad pesad, 256-värviline ANSI
- **Lisatud** Klahvisisend `<<| muutuja` (blokeeriv) ja `<<|? muutuja` (mitteblokeeriv küsitlus)
- **Lisatud** `>>!` puhasta ekraan, `>>?` päri terminali suurus, `@~ N` maga N millisekundit
- **Lisatud** Kuum definitsioon `°x` / `x°` — autolähtestab muutuja esmakasutamisel silmustes
- **Lisatud** Stringi kordamine `string $* N` — korda stringi N korda
- **VM** Pariteetsus: 436/436 testi läbitud

### v0.0.4 — 1-põhine indekseerimine, esimese klassi funktsioonid ja mooduli plokid _(Aprill 2026)_

- **Murrang** Kõik indekseerimine lülitati **1-põhisele** — `massiiv[1]` on esimene element; `massiiv[0]` on käitusaja viga
- **Lisatud** Nimega funktsioonid on **esimese klassi väärtused** — anna otse HOF-ile: `numbrid$> kahekorda`
- **Lisatud** Mooduli **ploki süntaks** on nõutav: `# nimi { ... }` — lame süntaks eemaldati
- **Lisatud** Mitmemõõtmeline indekseerimine: `massiiv[i>j>k]` (navigatsioon), `massiiv[p ; q]` (tasane ekstraktsioon)
- **Lisatud** Tüübi teisendused: `##.avaldis` (ujukomaarv), `###avaldis` (täisarv ümardusega), `##!avaldis` (täisarv kärpimisega)
- **Lisatud** Stringi jagamine: `string$/ eraldaja` — tagastab `Array(String)`
- **Lisatud** Konkatenatsiooni ehitamine: `baas$++ a b c` — lisab mitu elementi
- **Lisatud** N korra silmus: `@ N { }` — korda täpselt N korda
- **Lisatud** Märgistatud silmuse süntaks: `@:nimi { }`, `@:nimi!`, `@:nimi>` — asendab `@ @nimi` / `@! nimi`
- **Lisatud** Muutuja ulatuse reeglid: `_nimi` muutujatel on täpne ploki ulatus; `\ muutuja` hävitab varakult
- **Lisatud** Vastavuse võrdlusmustrid: `< 0 :`, `> 5 :`, `== 42 :` jne
- **Lisatud** Mooduli E013 viga: käivitatavad laused mooduli kehas on keelatud
- **Parandatud** `take_variable` ei rikuta enam mooduli konstante tagasikirjutamisel
- **Parandatud** `alias.KONSTANT` lahendatakse nüüd õigesti; `#>` võib ilmuda pärast funktsioonide definitsioone
- **VM** Täielik pariteetsus: 393/393 testi läbitud

### v0.0.3 — Unicode numbrisüsteemid ja LSP täiustused _(Aprill 2026)_

- **Lisatud** 69 Unicode numbrimärkide plokki režiimilüliti tokeniga `#d0d9#`
- **Lisatud** Tõeväärtuse literaalid mis tahes skriptis — `#१` / `#०`, `#١` / `#٠` jne
- **Lisatud** Klingoni pIqaD numbrid (CSUR PUA U+F8F0–U+F8F9)
- **Lisatud** VM opkood `SetNumeralMode` — täielik pariteetsus puuläbijaga
- **Lisatud** REPL austab aktiivset numbrisüsteemi kaja ja muutujate kuvamisel
- **Muudetud** Tõeväärtuse `>>` väljund sisaldab nüüd `#` eesliidet (`#0` / `#1`) kõigis režiimides

### v0.0.2_01 — Operaatori ümbernimetamine _(30 Mar 2026)_

- **Muudetud** `c|..|` → `#,|..|` ja `e|..|` → `#^|..|` — ühtne `#` formaadieesliite perekonnaga
- **Lisatud** Ekspordialias: ekspordi mooduli liikmed teise nime all

### v0.0.2 — Kollektsiooni API ümberdisain ja paigaldajad _(24 Mar 2026)_

- **Lisatud** Ühtne `$` operaatorite perekond massiivide ja stringide jaoks (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lisatud** Dekonstrueerimisomistus massiividele, korteežidele ja nimega korteežidele
- **Lisatud** Negatiivsed indeksid (`massiiv[-1]` = viimane element)
- **Lisatud** Algsed paigaldajad — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Lisatud** Liitvärskendus `^=`
- **Parandatud** Parseri aritmeetika äärejuhud; dokumentatsiooni parandused

### v0.0.1 — Esimene avalik väljaanne _(22 Mar 2026)_

- Puuläbija interpretaator + registripõhine VM (`--vm`, ~4× kiirem, ~95% pariteetsus)
- Kõik põhikonstruktsioonid: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Täielikud Unicode identifikaatorid, moodulisüsteem, lambdad, sulundid, vigade käsitlemine
- REPL, LSP, VS Code laiendus, vormindaja (`zymbol fmt`)

---

_Zymbol-Lang — Sümboolne. Universaalne. Muutumatu._
