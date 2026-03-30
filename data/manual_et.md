# Dokumentatsioon | Kompaktne Zymbol-Lang käsiraamat

**Zymbol-Lang** on sümboolne programmeerimiskeel. See ei kasuta märksõnu — kõik on sümbol. See toimib ühtmoodi igas inimkeeles. Märksõnu pole (`kui`, `tsükkel`, `tagastus` ei eksisteeri — ainult sümbolid `?`, `@`, `<~`). Täielik Unicode tugi — identifikaatorid igas keeles või emojis 👋

---

## Muutujad ja Konstandid

```zymbol
x = 10           // muutuja (muudetav)
PI := 3.14159    // konstant (muutumatu — viga taasomistamisel)
nimi = "Ana"
aktiivne = #1    // tõeväärtus true
👋 := "Tere"
```

### Liitomistamine

```zymbol
x = 10    // 10
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

| Tüüp           | Näide               | `#?` Sümbol | Märkused                              |
|----------------|---------------------|-------------|---------------------------------------|
| Täisarv        | `42`, `-7`          | `###`       | 64-bitine märgiga                     |
| Ujukoma        | `3.14`, `1.5e10`    | `##.`       | Teadusliku notatsiooni tugi           |
| String         | `"tere"`            | `##"`       | Interpolatsioon: `"Tere {nimi}"`      |
| Märk           | `'A'`               | `##'`       | Üks Unicode märk                      |
| Tõeväärtus     | `#1`, `#0`          | `##?`       | EI ole arvuline 1 ja 0                |
| Massiiv        | `[1, 2, 3]`         | `##]`       | Kõik elemendid peavad olema sama tüüpi|
| Tuple          | `(a, b)`            | `##)`       | Positsioonipõhine                     |
| Nimega Tuple   | `(x: 1, y: 2)`      | `##)`       | Ligipääs nime või indeksi järgi       |

---

## Väljund ja Sisend

```zymbol
// Väljund — EI lisa automaatselt reavahetust
>> "Tere" ¶                          // ¶ või \\ annab selgesõnalise reavahetuse
>> "a=" a " b=" b ¶                  // mitu väärtust juxtapositsiooni abil
>> "summa=" liida(2, 3) ¶            // funktsioonikutsed mis tahes positsioonis
>> (arr$#) ¶                         // postfiks-operaatorid vajavad sulge

// Sisend
<< nimi                              // ilma viipata — loeb muutujasse
<< "Teie nimi? " nimi                // viipaga
```

> `¶` või `\\` on reavahetus ekvivalendid.

---

## Operaatorid

```zymbol
// Aritmeetika
5 + 2    // → 7
5 - 2    // → 3
5 * 2    // → 10
5 / 2    // → 2.5
5 % 2    // → 1
5 ^ 2    // → 25   (astendamine)

// Võrdlus (tagastab #1 või #0)
5 == 5   // → #1
5 != 4   // → #1
5 > 4    // → #1
5 < 4    // → #0
5 >= 5   // → #1
5 <= 4   // → #0

// Loogilised
#1 && #0    // → #0   (ja)
#1 || #0    // → #1   (või)
!#1         // → #0   (mitte)
```

---

## Stringid

Kolm kehtivat vormi — igaüks oma konteksti jaoks:

```zymbol
nimi = "Ana"
arv = 25

// 1. Koma — omistamisel = või :=
teade = "Tere ", nimi, "!"              // → Tere Ana!
PEALKIRI := "Kasutaja: ", nimi

// 2. Juxtapositsioon — >> väljundis
>> "Tere " nimi " sul on " arv ¶        // → Tere Ana sul on 25

// 3. Interpolatsioon — mis tahes kontekstis
kirjeldus = "Tere {nimi}, sul on {arv}" // → Tere Ana, sul on 25
```

```zymbol
// Asenda — s$~~["vana":"uus"]
s = "tere maailm"
s = s$~~["maailm":"maa"]        // → "tere maa"
s = s$~~["e":"E":1]             // → "tErE maa"   asenda esimesed N esinemist
```

> **Märkus**: `+` on ainult arvude jaoks. Kasutamine stringidega genereerib hoiatuse.

---

## Juhtimisstruktuur

```zymbol
x = 7

// Lihtne tingimus
? x > 0 { >> "positiivne" ¶ }

// tingimus / muidu-tingimus / muidu
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

Plokid `{ }` on **kohustuslikud** isegi ühe rea puhul.

---

## Vastavus

```zymbol
// Vastavus vahemikega
punktid = 85
hinne = ?? punktid {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> hinne ¶    // → B

// Vastavus tingimustega (suvalised tingimused)
temperatuur = -5
seisund = ?? temperatuur {
    _? temperatuur < 0  : "jää"
    _? temperatuur < 20 : "külm"
    _? temperatuur < 35 : "soe"
    _                   : "kuum"
}
>> seisund ¶    // → jää

// Vastavus stringidega
värv = "punane"
kood = ?? värv {
    "punane"   : "#FF0000"
    "roheline" : "#00FF00"
    _          : "#000000"
}
>> kood ¶
```

---

## Tsüklid

```zymbol
// Kaasav vahemik: 0..4 itereerib 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Vahemik sammuga
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Pööratud vahemik
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Kuni tsükkel
arv = 1
@ arv <= 64 { arv *= 2 }
>> arv ¶    // → 128

// Iga massiivi elemendi jaoks
puuvili = ["õun", "pirn", "viinamari"]
@ f:puuvili { >> f ¶ }

// Stringi märkide üle
@ c:"tere" { >> c "-" }
>> ¶    // → t-e-r-e-

// Katkestus ja Jätka
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> jätka
    ? i > 7 { @! }          // @! katkesta
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funktsioonid

```zymbol
// Deklaratsioon ja kutsumine
liida(a, b) { <~ a + b }
>> liida(3, 4) ¶    // → 7

// Rekursioon
faktoriaal(arv) {
    ? arv <= 1 { <~ 1 }
    <~ arv * faktoriaal(arv - 1)
}
>> faktoriaal(5) ¶    // → 120

// Funktsioonidel on isoleeritud ulatus — välistele muutujatele juurdepääs puudub
globaalne = 100
testida() {
    x = 42    // ainult kohalik
    <~ x
}
>> testida() ¶    // → 42
```

> **Oluline**: Nimega funktsioonid `nimi(params){ }` ei ole esimese klassi väärtused.
> Argumendina edastamiseks mähkige: `x -> nimi(x)`.

---

## Lambdad ja Sulgemised

```zymbol
// Lihtne lambda (kaudne tagastus)
kahekordne = x -> x * 2
summa = (a, b) -> a + b
>> kahekordne(5) ¶    // → 10
>> summa(3, 7) ¶      // → 10

// Ploki lambda (selgesõnaline tagastus)
klassifitseeri = x -> {
    ? x > 0 { <~ "positiivne" }
    _? x < 0 { <~ "negatiivne" }
    <~ "null"
}
>> klassifitseeri(5) ¶     // → positiivne
>> klassifitseeri(0) ¶     // → null
>> klassifitseeri(-5) ¶    // → negatiivne

// Sulgemised — lambdad hõivavad välise ulatuse muutujaid
tegur = 3
kolmekordne = x -> x * tegur    // hõivab 'tegur'
>> kolmekordne(7) ¶    // → 21

// Funktsioonide tehas
tee_liitja(n) { <~ x -> x + n }
lisa10 = tee_liitja(10)
lisa20 = tee_liitja(20)
>> lisa10(5) ¶    // → 15
>> lisa20(5) ¶    // → 25

// Lambdad väärtustena: salvestatakse massiividesse
toimingud = [x -> x+1, x -> x*2, x -> x*x]
>> toimingud[0](5) ¶    // → 6
>> toimingud[1](5) ¶    // → 10
>> toimingud[2](5) ¶    // → 25
```

---

## Massiivid

```zymbol
arr = [10, 20, 30, 40, 50]

// Juurdepääs (0-põhine indeks)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30
>> arr[-1] ¶   // → 50   negatiivne indeks

// Pikkus (vajab sulge >>-s)
arv = arr$#
>> arv ¶           // → 5
>> (arr$#) ¶       // → 5

// Lisa, eemalda, sisaldab, lõige
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // indeks 0 eemaldamine: [20, 30, 40, 50, 60]
on_olemas = arr$? 30         // → #1
idx = arr$?? 30              // → [1]   kõik indeksid väärtusele
lõige = arr$[0..2]           // lõige [0,2): [20, 30]
arv_põhine = arr$[0:3]       // arvupõhine: [20, 30, 40]

// Elemendi uuendamine
arr[1] = 99
>> arr ¶    // → [20, 99, 40, 50, 60]

// Funktsionaalne uuendamine (tagastab uue massiivi)
arr2 = arr[1]$~ 77           // → [20, 77, 40, 50, 60]

// Sorteeri (primitiivid)
num = [3, 1, 4, 1, 5]
kasvav   = num$^+            // → [1, 1, 3, 4, 5]
kahanev  = num$^-            // → [5, 4, 3, 1, 1]

// Sorteeri tupleid komparaator-lambdaga
paarid = [(2,"b"), (1,"a"), (3,"c")]
sorditud = paarid$^ ((a,b) -> a[0] - b[0])    // sorteeri esimese elemendi järgi

// Pesastatud massiivid
maatriks = [[1,2],[3,4],[5,6]]
>> maatriks[1][0] ¶    // → 3

// Iga elemendi jaoks
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` tagastavad **uue massiivi** — omistage tagasi: `arr = arr$+ 4`.
> Ei saa ahelada: kasutage kahte eraldi omistamist.
> `arr$??` ja `arr$[s:n]` kasutavad teist süntaksit kui `arr$[s..e]` — vt Sümbolite Viide.

---

## Destruktureerimine

```zymbol
// Massiivi destruktureerimine
arr = [10, 20, 30]
[a, b, c] = arr
>> a ¶    // → 10
>> b ¶    // → 20

// Positsioonilise tuple destruktureerimine
pt = (3, 4)
(x, y) = pt
>> x ¶    // → 3

// Nimega tuple destruktureerimine
isik = (nimi: "Alice", vanus: 25)
(nimi: n, vanus: v) = isik
>> n ¶    // → Alice
>> v ¶    // → 25
```

---

## Tuplid

```zymbol
// Positsioonipõhine tuple
punkt = (10, 20)
>> punkt[0] ¶    // → 10
>> punkt[1] ¶    // → 20

// Nimega tuple
isik = (nimi: "Alice", vanus: 25)
>> isik.nimi ¶     // → Alice
>> isik.vanus ¶    // → 25
>> isik[0] ¶       // → Alice (indeks töötab ka)

// Pesastatud
pos = (x: 3, y: 4)
p = (pos: pos, silt: "alguspunkt")
>> p.silt ¶    // → alguspunkt
>> p.pos.x ¶   // → 3
```

---

## Kõrgema Astme Funktsioonid

HOF operaatorid nõuavad **sisseehitatud lambdat** — mitte otsest lambda muutujat.

```zymbol
numbrid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Kaardistamine ($>)
kahekordistatud = numbrid$> (x -> x * 2)
>> kahekordistatud ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtreerimine ($|)
paaris = numbrid$| (x -> x % 2 == 0)
>> paaris ¶    // → [2, 4, 6, 8, 10]

// Vähendamine ($<) — (algväärtus, (acc, elem) -> avaldis)
kokku = numbrid$< (0, (acc, x) -> acc + x)
>> kokku ¶    // → 55

// Ei saa otseselt ahelada — kasutage vaheväärtusi
samm1 = numbrid$| (x -> x > 5)
samm2 = samm1$> (x -> x * x)
>> samm2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Toru-operaator

```zymbol
// |> edastab vasaku väärtuse _ paremas avaldises
tulemus = 5 |> _ * 2 |> _ + 1
>> tulemus ¶    // → 11

// Ahelatud teisendused
sõnad = ["tere", "maailm"]
väljund = sõnad
    |> _$> (w -> w$#)              // kaardista pikkusteks: [4, 6]
    |> _$< (0, (a,x) -> a+x)      // summeeri: 10
>> väljund ¶    // → 10
```

---

## Vigade Käsitlemine

```zymbol
// Proovi / Püüa / Lõpuks
!? {
    x = 10 / 0
} :! ##Div {
    >> "nulliga jagamine" ¶
} :! ##IO {
    >> "I/O viga" ¶
} :! {
    >> "muu viga: " _err ¶    // _err sisaldab veateadet
} :> {
    >> "käivitub alati" ¶
}

// Püüdmine indeksitüübil
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "indeks väljaspool piire" ¶
}
```

### Vealiigid

| Tüüp        | Millal tekib             |
|-------------|--------------------------|
| `##Div`     | Nulliga jagamine         |
| `##IO`      | Fail / süsteem           |
| `##Index`   | Indeks väljaspool piire  |
| `##Type`    | Tüübiviga                |
| `##Parse`   | Andmete sõelumine        |
| `##Network` | Võrgu vead               |
| `##_`       | Ükskõik milline viga     |

---

## Moodulid

```zymbol
// Fail: lib/calc.zy
# calc                    // deklaratsioon — alati üleval

#> {                      // eksportid — PEAB olema enne definitsioone
    liida
    get_PI
}

_PI := 3.14159

liida(a, b) { <~ a + b }
get_PI() { <~ _PI }       // konstandi getter (vajalik kõrvalekalle)
```

```zymbol
// Fail: main.zy
<# ./lib/calc <= c         // alias on kohustuslik

>> c::liida(5, 3) ¶        // → 8  — kutsumine ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Märkus**: `alias.NIMI` konstantidele ei tööta — kasutage getter-funktsiooni.

---

## Andmeoperaatorid

```zymbol
// Parsi string arvuks
x = #|"42"|          // → 42    (täisarv)
y = #|"3.14"|        // → 3.14  (ujukoma)

// Ümarda / kärbi
r = #.2|3.14159|     // → 3.14   ümarda 2 komakohani
t = #!2|3.14159|     // → 3.14   kärbi 2 komakohani

// Vorminda arv
s = #,|1234567.89|    // → "1,234,567.89"  komavormingus
e = #^|0.00042|       // → "4.2e-4"        teaduslik notatsioon

// Alusliteraalid
h = 0xFF             // → 255  heksadetsimaalne
b = 0b1010           // → 10   binaarne
o = 0o17             // → 15   oktaalne

// Aluse teisendus
hex = 255$>>"16"     // → "FF"
bin = 10$>>"2"       // → "1010"
```

---

## Kestaintegrering

```zymbol
// Käivita kesta käsk ja püüa väljund
väljund = <\ ls -la \>
>> väljund ¶

// Interpolatsioon käskudes
kaust = "/tmp"
failid = <\ ls {kaust} \>

// Mitmerealine skriptiplokk
tulemus = </
    echo "tere"
    pwd
/>

// Suuna väljund kesta (ilma püüdmata)
>< "echo tere"
```

> `><` saadab väljundi kesta ilma seda püüdmata.

---

## Täielik Näide: FizzBuzz

```zymbol
klassifitseeri(arv) {
    ? arv % 15 == 0 { <~ "SissSumm" }
    _? arv % 3  == 0 { <~ "Siss" }
    _? arv % 5  == 0 { <~ "Summ" }
    _ { <~ arv }
}
@ i:1..20 { >> klassifitseeri(i) ¶ }
```

---

## Sümbolite Viide

| Sümbol      | Toiming              | Sümbol       | Toiming                    |
|-------------|----------------------|--------------|----------------------------|
| `=`         | muutuja              | `$#`         | pikkus                     |
| `:=`        | konstant             | `$+`         | lisamine (append)          |
| `>>`        | väljund              | `$+[i]`      | lisamine indeksile         |
| `<<`        | sisend               | `$--`        | viimase eemaldamine        |
| `¶`/`\`     | reavahetus           | `$-[i]`      | eemaldamine indeksil       |
| `?`         | kui (if)             | `$-[i..j]`   | vahemiku eemaldamine       |
| `_?`        | muidu-kui (elif)     | `$?`         | sisaldab                   |
| `_`         | muidu / universaalne | `$??`        | kõik indeksid väärtusele   |
| `??`        | vastavus             | `$[s..e]`    | lõige                      |
| `@`         | tsükkel              | `$>`         | kaardistamine              |
| `@!`        | katkesta             | `$\|`        | filtreerimine              |
| `@>`        | jätka                | `$<`         | vähendamine                |
| `->`        | lambda               | `$^+`        | sorteeri kasvavalt         |
| `<~`        | tagasta              | `$^-`        | sorteeri kahanevalt        |
| `\|>`       | toru                 | `$^`         | sorteeri komparaatoriga    |
| `#1`        | tõene                | `$!`         | on viga                    |
| `#0`        | väär                 | `$!!`        | levi viga                  |
| `!?`        | proovi (try)         | `#`          | deklareeri moodul          |
| `:!`        | püüa (catch)         | `#>`         | ekspordi                   |
| `:>`        | lõpuks (finally)     | `<#`         | impordi                    |
| `.`         | väljapääs            | `::`         | mooduli kutse              |
| `#\|..\|`   | parsi (parse)        | `#.N\|..\|`  | ümarda N kohani            |
| `#!N\|..\|` | kärbi N kohani       | `c\|..\|`    | komavormingus              |
| `e\|..\|`   | teaduslik not.       | `<\ \>`      | kesta käsk                 |
| `><`        | kesta väljund        | `$~~[..]`    | asenda stringis            |
| `[a,b]=arr` | destruktureerimine   | `(x,y)=tup`  | tuple destruktureerimine   |

---

*Zymbol-Lang — Sümboolne. Universaalne. Muutumatu.*

---

**Märkus:** See dokumentatsioon loodi ja tõlgiti tehisintellekti (TI) abil. On tehtud kõik jõupingutused täpsuse tagamiseks, kuid mõned tõlked või näited võivad sisaldada vigu. Autoriteetne viide on [Zymbol-Lang spetsifikatsioon](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
