# Zymbol-Lang Þétt Handbók

**Zymbol-Lang** er táknrænt forritunarmál. Það notar engin lykilorð — allt er tákn. Það virkar eins í öllum mannlegum tungumálum.

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

```zymbol
// Gerðarskoðun — skilar (gerð, tölustafir, gildi)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Úttak og Inntök

```zymbol
>> "Halló, Íslenskumælandi heimur!" ¶    // ¶ eða \\ gefur bein línuskipti
>> "a=" a " b=" b ¶                       // mörg gildi með hlið við hlið
>> (ávöxtur$#) ¶                          // viðskeytisaðgerðir krefjast sviga

<< nafn                                   // engin kvaðning — les í breytu
<< "Nafnið þitt? " nafn                   // með kvaðningu
```

> `¶` eða `\\` eru jafngildar sem línuskipti.

---

## Virkjar

```zymbol
// Reikningur
a = 10
b = 3
n1 = a + b    // 13     n2 = a - b    // 7
n3 = a * b    // 30     n4 = a / b    // 3  (heiltöludeiling)
n5 = a % b    // 1      n6 = a ^ b    // 1000  (veldi)

// Samanburður
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Rökfræði
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Strengir

```zymbol
// Þrjár tengingarmyndir
nafn = "Ana"
tala = 42

skilaboð = "Halló ", nafn, "!"              // komma — í úthlutun
>> "Halló " nafn " þú ert " tala ¶          // hlið við hlið — í >>
lýsing = "Halló {nafn}, þú ert {tala}"     // innsetning — hvar sem er
```

```zymbol
s = "Halló Heimur"
len = s$#                  // 12
sub = s$[0..5]             // "Halló"  (lok ekki innifalið)
has = s$? "Heimur"         // #1
split = "a,b,c,d" / ','   // [a, b, c, d]
repl = s$~~["á":"a"]        // skipta út
repl1 = s$~~["á":"a":1]     // fyrstu N
```

> `+` er eingöngu fyrir tölur. Notaðu `,`, samhliðasetningu eða innfellingu fyrir strengi.

---

## Stýriflæði

```zymbol
x = 7

? x > 0 { >> "jákvætt" ¶ }

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

> Blokkir `{ }` eru **nauðsynlegar** jafnvel fyrir eina yfirlýsingu.

---

## Passa

```zymbol
// Bil
stig = 85
einkunn = ?? stig {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> einkunn ¶    // → B

// Strengir
litur = "rauður"
kóði = ?? litur {
    "rauður"  : "#FF0000"
    "grænn"   : "#00FF00"
    _         : "#000000"
}

// Gæslur
hitastig = -5
ástand = ?? hitastig {
    _? hitastig < 0  : "ís"
    _? hitastig < 20 : "kalt"
    _? hitastig < 35 : "hlýtt"
    _                : "heitt"
}
>> ástand ¶    // → ís

// Yfirlýsingarform (blokkahermur)
?? n {
    0       : { >> "núll" ¶ }
    _? n < 0: { >> "neikvætt" ¶ }
    _       : { >> "jákvætt" ¶ }
}
```

---

## Lykkjur

```zymbol
@ i:0..4  { >> i " " }        // innifalið bil:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // með skrefi:      1 3 5 7 9
@ i:5..0:1 { >> i " " }       // öfugt:           5 4 3 2 1 0

tala = 1
@ tala <= 64 { tala *= 2 }
>> tala ¶                      // → 128  (meðan)

ávöxtur = ["epli", "pera", "þrúga"]
@ f:ávöxtur { >> f ¶ }         // fyrir-hvert yfir fylki

@ c:"halló" { >> c "-" }
>> ¶                           // → h-a-l-l-ó-  (fyrir-hvert yfir streng)

@ i:1..10 {
    ? i % 2 == 0 { @> }        // @> halda áfram
    ? i > 7 { @! }              // @! brjóta
    >> i " "
}
>> ¶                           // → 1 3 5 7

// Óendanleg lykkja
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                           // → 1 2 3 4

// Merkt lykkja (hreiður brot)
fjöldi = 0
@ @ytri {
    fjöldi++
    ? fjöldi >= 3 { @! ytri }
}
>> fjöldi ¶                    // → 3
```

---

## Föll

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Föll hafa **einangrað umfang** — þau geta ekki lesið ytri breytur. Notaðu úttaksbreytur `<~` til að breyta breytum kallara:

```zymbol
skipta(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
skipta(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nafngreind föll eru ekki fyrstur flokks gildi. Til að senda sem rök, vefja: `x -> nafn(x)`.

---

## Lambdaföll og Lokanir

```zymbol
tvöfaldur = x -> x * 2
summa = (a, b) -> a + b
>> tvöfaldur(5) ¶    // → 10
>> summa(3, 7) ¶     // → 10

// Blokklamda
flokkaðu = x -> {
    ? x > 0 { <~ "jákvætt" }
    _? x < 0 { <~ "neikvætt" }
    <~ "núll"
}

// Lokun — fangar ytri umfang
stuðull = 3
þreföldur = x -> x * stuðull
>> þreföldur(7) ¶    // → 21

// Verksmiðja
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Í fylkjum
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Fylki

Fylki eru **breytanleg** og innihalda stök af **sömu gerð**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — aðgangur (0-byggt númer)
arr[-1]         // 5 — neikvætt númer (síðasta)
arr$#           // 5 — lengd (nota (arr$#) í >>)

arr = arr$+ 6            // bæta við → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // setja inn á númer 2
arr3 = arr$- 3           // fjarlægja fyrsta tilvik af gildi
arr4 = arr$-- 3          // fjarlægja öll tilvik
arr5 = arr$-[0]          // fjarlægja eftir númer
arr6 = arr$-[1..3]       // fjarlægja svið (lok ekki innifalið)

hefur = arr$? 3          // #1 — inniheldur
staðir = arr$?? 3        // [2] — öll númer gildis
sl = arr$[0..3]          // [1,2,3] — sneiðing (lok ekki innifalið)
sl2 = arr$[0:3]          // [1,2,3] — sama, talningarsetningafræði

hækkandi = arr$^+        // raðað hækkandi  (frumstæðar eingöngu)
lækkandi = arr$^-        // raðað lækkandi (frumstæðar eingöngu)

// Nafngreint/staðsett tuple fylki — nota $^ með samanburðarlambda
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
eftir_aldri  = db$^ (a, b -> a.age < b.age)    // hækkandi eftir aldri  (<)
eftir_nafni = db$^ (a, b -> a.name > b.name)  // lækkandi eftir nafni (>)
>> eftir_aldri[0].name ¶     // → Ana
>> eftir_nafni[0].name ¶    // → Carla

// Bein staks-uppfærsla (aðeins fylki)
arr[1] = 99              // úthluta
arr[0] += 5              // samsett: +=  -=  *=  /=  %=  ^=

// Virknileg uppfærsla — skilar nýju fylki; frumritið óbreytt
arr2 = arr[1]$~ 99
```

> Allar safnaðaraðgerðir skila **nýju fylki**. Úthluta aftur: `arr = arr$+ 4`.
> Ekki er hægt að keðja aðgerðir — notaðu millistig úthlutanir.
> `$^+` / `$^-` raða **frumstæðum fylkjum** (tölur, strengir). Fyrir tuple fylki notaðu `$^` með samanburðarlambda — stefnan er kóðuð í lambdanu (`<` = hækkandi, `>` = lækkandi).

**Gildismerking** — að úthluta fylki til annarrar breytu skapar sjálfstæða afrit:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er ósnert
```

```zymbol
// Hreiður fylki
fylki = [[1,2,3],[4,5,6],[7,8,9]]
>> fylki[1][2] ¶    // → 6
```

---

## Niðurbrot

```zymbol
// Fylki
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[fyrst, *rest] = arr          // fyrst=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ hunsar

// Staðsett tuple
punktur = (100, 200)
(px, py) = punktur           // px=100  py=200

// Nafngreint tuple
einstaklingur = (nafn: "Ana", aldur: 25, borg: "Reykjavík")
(nafn: n, aldur: a) = einstaklingur  // n="Ana"  a=25
```

---

## Tuples

Tuples eru **óbreytanleg** raðuð gámar sem geta geymt gildi af **mismunandi gerðum**.
Ólíkt fylkjum er ekki hægt að breyta stökum eftir stofnun.

```zymbol
// Staðsetningarlægt — blöndaðar gerðir leyfðar
punktur = (10, 20)
>> punktur[0] ¶    // → 10

gögn = (42, "halló", #1, 3.14)
>> gögn[2] ¶     // → #1

// Nafngreint
einstaklingur = (nafn: "Alice", aldur: 25)
>> einstaklingur.nafn ¶    // → Alice
>> einstaklingur[0] ¶      // → Alice  (númer virkar líka)

// Hreiður
staðsetning = (x: 10, y: 20)
p = (staðsetning: staðsetning, merki: "uppruni")
>> p.staðsetning.x ¶        // → 10
```

**Óbreytanleiki** — sérhver tilraun til að breyta tuple-staki er keyrsluvilla:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ keyrsluvilla: tuples eru óbreytanleg
// t[0] += 5    // ❌ sama villa
```

Til að leiða út breytt gildi notaðu `$~` (virknileg uppfærsla) — skilar **nýju** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← frumritið óbreytt
>> t2 ¶    // → (10, 999, 30)

// Nafngreint tuple — endurbyggja sérstaklega
einstaklingur = (nafn: "Alice", aldur: 25)
eldri  = (nafn: einstaklingur.nafn, aldur: 26)
>> einstaklingur.aldur ¶    // → 25
>> eldri.aldur ¶             // → 26
```

---

## Hærri Stigs Föll

> Hærri stigs aðgerðir krefjast **innbyggðs lambda** — ekki beint lambdabreyta.

```zymbol
tölur = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tvöfaldar  = tölur$> (x -> x * 2)                // kortleggja  → [2,4,6…20]
jafntölur    = tölur$| (x -> x % 2 == 0)           // sía → [2,4,6,8,10]
samtals    = tölur$< (0, (acc, x) -> acc + x)     // minnka → 55

// Keðja með millistigum
skref1 = tölur$| (x -> x > 3)
skref2 = skref1$> (x -> x * x)
>> skref2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nafngreind föll í HOF — vefja í lambda
tvöfaldur(x) { <~ x * 2 }
r = tölur$> (x -> tvöfaldur(x))    // ✅
```

---

## Pípu-virkji

Hægri hlið þarfnast alltaf `_` sem frátakssæti:

```zymbol
tvöfalt = x -> x * 2
leggja = (a, b) -> a + b
auka = x -> x + 1

5 |> tvöfalt(_)      // → 10
10 |> leggja(_, 5)   // → 15
5 |> leggja(2, _)    // → 7

// Keðja
n = 5 |> tvöfalt(_) |> auka(_) |> tvöfalt(_)
>> n ¶    // → 22  (5→10→11→22)
```

---

## Meðhöndlun Villna

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deiling með núll" ¶
} :! {
    >> "önnur: " _err ¶    // _err geymir villuboðið
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
// lib/calc.zy
# calc

#> { add, get_PI }    // útflutningur ÁÐUR EN skilgreiningar

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — beinn fastaaðgangur með gælunafni er ekki studdur
```

```zymbol
// main.zy
<# ./lib/calc <= c    // gælunafn nauðsynlegt

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Útflutningur með öðru opinberu nafni
# minlib
#> { _innri_add <= summa }

_innri_add(a, b) { <~ a + b }
```

```zymbol
<# ./minlib <= m

>> m::summa(3, 4) ¶    // → 7  (innra nafnið _innri_add er falið)
```

---

## Tölustafahamur

Zymbol getur sýnt tölur í **69 Unicode-tölustafaskriftum** — Devanagari, Arabísk-Indversk, Taílensk, Klingon pIqaD, Stærðfræðileg Feitletrað, LCD-hlutar og fleiri. Virkur hamur hefur aðeins áhrif á `>>`-úttak; innri reikningur er alltaf tvíundur.

### Virkja skrift

Skrifaðu tölustafina `0` og `9` úr markhömlunni innan `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabísk-Ind.  (U+0660–U+0669)
#๐๙#    // Taílensk      (U+0E50–U+0E59)
#09#    // endurstilla í ASCII
```

### Úttak og boole-gildi

```zymbol
x = 42
>> x ¶          // → 42   (ASCII sjálfgefið)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (aukastafur alltaf ASCII)
>> 1 + 2 ¶      // → ३

// Boole: # forskeyti alltaf ASCII, tölustafur aðlagast
>> #1 ¶         // → #१   (satt í Devanagari)
>> #0 ¶         // → #०   (ósatt — greinilegt frá ०  heiltölunúll)

x = 28 > 4
>> x ¶          // → #१   (samanburðarniðurstaða fylgir virkum ham)
```

### Upprunalegir tölustafa-literals í frumkóða

Tölustafir úr hvaða studdri skrift sem er eru gild literals — í sviðum, modulo, samanburði:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boole-literals í hvaða skrift sem er

`#` + tölustafur `0` eða `1` úr hvaða blokk sem er er gilt boole-literal:

```zymbol
#٠٩#
نشط = #١        // sama og #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` er **alltaf ASCII**. `#0` (ósatt) er alltaf sjónrænt greinilegt frá `0` (heiltölunúll) í hverri skrift.

---

## Gagnagirðar

```zymbol
// Breyta streng í tölu
v1 = #|"42"|      // → 42
v2 = #|"3.14"|    // → 3.14
v3 = #|"abc"|     // → "abc"

// Námunda / Stytta
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Tölumót
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Grunntölur
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Grunnumreikningur
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-samþætting

```zymbol
dagsetning = <\ date +%Y-%m-%d \>     // fanga stdout
>> "Í dag: " dagsetning

skrá = "data.txt"
innihald = <\ cat {skrá} \>           // innskot í skipun

úttak = </"./subscript.zy"/>          // keyra Zymbol skrift
>> úttak
```

> `><` fangar CLI-frumbreytur sem strengfylki (eingöngu tréfara).

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

| Tákn | Aðgerð | Tákn | Aðgerð |
|------|--------|------|--------|
| `=` | breyta | `$#` | lengd |
| `:=` | fasti | `$+` | bæta við |
| `>>` | úttak | `$+[i]` | setja inn eftir númer |
| `<<` | inntök | `$-` | fjarlægja fyrsta eftir gildi |
| `¶` / `\\` | línuskipti | `$--` | fjarlægja öll eftir gildi |
| `?` | ef | `$-[i]` | fjarlægja eftir númer |
| `_?` | ef-annars | `$-[i..j]` | fjarlægja svið |
| `_` | annars / algildi | `$?` | inniheldur |
| `??` | passa | `$??` | finna öll númer |
| `@` | lykkja | `$[s..e]` | sneiðing |
| `@!` | brjóta | `$>` | kortleggja |
| `@>` | halda áfram | `$\|` | sía |
| `->` | lambda | `$<` | minnka |
| `arr[i] = val` | uppfæra stak (aðeins fylki) | `arr[i] += val` | samsett uppfærsla |
| `arr[i]$~` | virknileg uppfærsla (ný afrit) | `$^+` | raða hækkandi (frumstæðar) |
| `$^-` | raða lækkandi (frumstæðar) | `$^` | raða með samanburðarlambda (tuples) |
| `<~` | skila | `!?` | reyna |
| `\|>` | pípa | `:!` | grípa |
| `#1` | satt | `:>` | að lokum |
| `#0` | ósatt | `$!` | er villa |
| `<#` | innflutningur | `$!!` | dreifa villu |
| `#` | lýsa einingu | `#>` | útflutningur |
| `::` | eininga kall | `.` | svæðis aðgangur |
| `#\|..\|` | þátta tölu | `#?` | gerðarflokkar |
| `#.N\|..\|` | námunda | `#!N\|..\|` | stytta |
| `#,\|..\|` | kommusnið | `#^\|..\|` | vísindalegt |
| `#d0d9#` | skipta um tölustafaham | `#09#` | endurstilla í ASCII |
| `<\ ..\>` | keyra shell | `>\<` | CLI-frumbreytur |

## Útgáfuferill

### v0.0.3 — Unicode Talningstafir & LSP-endurbætur _(Apríl 2026)_

- **Bætt við** 69 Unicode-tölustafablokkum með hamabreytingarmerki `#d0d9#`
- **Bætt við** Boole-literals í hvaða skrift sem er — `#१` / `#०`, `#١` / `#٠`, o.fl.
- **Bætt við** Klingon pIqaD-tölustafir (CSUR PUA U+F8F0–U+F8F9)
- **Bætt við** VM-opkóði `SetNumeralMode` — fullur jafngildi við tréferð
- **Bætt við** REPL virðir virkan tölustafaham í bergmáli og breytubirting
- **Breytt** `>>`-úttak boole-gilda inniheldur nú `#`-forskeyti (`#0` / `#1`) í öllum hömum

### v0.0.2_01 — Endurnöfnun virkja _(30 Mar 2026)_

- **Breytt** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — samræmt `#`-forskeytisfjölskyldunni
- **Bætt við** Útflutningssamheiti: endurútflytja einingarlimi undir öðru nafni

### v0.0.2 — Safn-API Endurhönnun & Uppsetningarforrit _(24 Mar 2026)_

- **Bætt við** Sameinað `$`-virkjasett fyrir fylki og strengi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bætt við** Niðurbrot fyrir fylki, túplur og nafngreindar túplur
- **Bætt við** Neikvæðar vísur (`arr[-1]` = síðasta stak)
- **Bætt við** Innfædd uppsetningarforrit — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Bætt við** Samsett úthlutun `^=`
- **Lagað** Jaðartilfelli í reikniþáttara; leiðréttingar í skjölun

### v0.0.1 — Fyrsta opinbera útgáfa _(22 Mar 2026)_

- Tréferðartúlkur + skráarVM (`--vm`, ~4× hraðari, ~95% jafngildi)
- Öll kjarnasmíði: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fullgildar Unicode-auðkenni, einingakerfi, lambdur, lokun, villumeðhöndlun
- REPL, LSP, VS Code-viðbót, sniðstillir (`zymbol fmt`)

---

*Zymbol-Lang — Táknrænt. Alheimslegt. Óbreytanlegt.*

> **Fyrirvari:** Þessi skjölun var búin til og þýdd af gervigreind (GG). Allt hefur verið gert til að tryggja nákvæmni, en sumar þýðingar eða dæmi geta innihaldið villur. Heimildarvísunin er [Zymbol-Lang forskrift](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
