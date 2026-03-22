# Dokumentatsioon | Kompaktne Zymbol-Lang käsiraamat

**Zymbol-Lang** on sümboolne programmeerimiskeel. See ei kasuta märksõnu — kõik on sümbol. See toimib ühtmoodi igas inimkeeles.

---

## Filosoofia

- Märksõnu pole (`kui`, `tsükkel`, `tagastus` ei eksisteeri — ainult sümbolid `?`, `@`, `<~`)
- Täielik Unicode tugi — identifikaatorid igas keeles või emojis 👋
- Inimkeelest sõltumatu — kood on identne igas keeles

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
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
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
| Massiiv        | `[1, 2, 3]`         | `##]`       | Kõik elemendid peavad olema sama tüüpi |
| Tuple          | `(a, b)`            | `##)`       | Positsioonipõhine                     |
| Nimega Tuple   | `(x: 1, y: 2)`      | `##)`       | Ligipääs nime või indeksi järgi       |

---

## Väljund ja Sisend

```zymbol
// Väljund — EI lisa automaatselt reavahetust
>> "Tere, Eestikeelne maailm!" ¶     // ¶ või \\ annab selgesõnalise reavahetuse
>> "a=" a " b=" b ¶                  // mitu väärtust juxtapositsiooni abil
>> "summa=" klassifitseeri(2, 3) ¶   // funktsioonikutsed mis tahes positsioonis
>> (puuvili$#) ¶                     // postfiks-operaatorid vajavad sulge

// Sisend
<< nimi                              // ilma viipata — loeb muutujasse
<< "Teie nimi? " nimi                // viipaga
```

> `¶` või `\\` on reavahetus ekvivalendid.

---

## Stringide Ühendamine

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
    "punane" : "#FF0000"
    "roheline" : "#00FF00"
    _        : "#000000"
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
>> lisa10(5) ¶    // → 15

// Lambdad väärtustena: salvestatakse massiividesse
toimingud = [x -> x+1, x -> x*2, x -> x*x]
>> toimingud[0](5) ¶    // → 6
>> toimingud[2](5) ¶    // → 25
```

---

## Massiivid

```zymbol
arr = [10, 20, 30, 40, 50]

// Juurdepääs (0-põhine indeks)
>> arr[0] ¶    // → 10

// Pikkus (vajab sulge >>-s)
arv = arr$#
>> (arr$#) ¶    // → 5

// Lisa, eemalda, sisaldab, lõige
arr = arr$+ 60               // lisamine
arr = arr$- 0                // indeks 0 eemaldamine
on_olemas = arr$? 30         // → #1
lõige = arr$[0..2]           // [20, 30]

// Elemendi uuendamine
arr[1] = 99

// Iga elemendi jaoks
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` tagastavad **uue massiivi** — omistage tagasi: `arr = arr$+ 4`.
> Ei saa ahelada: kasutage kahte eraldi omistamist.

---

## Tuplid

```zymbol
// Nimega tuple
isik = (nimi: "Liina", vanus: 25)
>> isik.nimi ¶     // → Liina
>> isik.vanus ¶    // → 25
>> isik[0] ¶       // → Liina (indeks töötab ka)
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
```

---

## Vigade Käsitlemine

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "nulliga jagamine" ¶
} :! ##IO {
    >> "I/O viga" ¶
} :! {
    >> "muu viga: " _err ¶
} :> {
    >> "käivitub alati" ¶
}
```

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
# calc

#> { liida, get_PI }    // ekspordi ENNE definitsioone

_PI := 3.14159
liida(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fail: main.zy
<# ./lib/calc <= c    // alias on kohustuslik

>> c::liida(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

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

| Sümbol   | Toiming             | Sümbol     | Toiming              |
|----------|---------------------|------------|----------------------|
| `=`      | muutuja             | `$#`       | pikkus               |
| `:=`     | konstant            | `$+`       | lisamine             |
| `>>`     | väljund             | `$-`       | eemaldamine (ind.)   |
| `<<`     | sisend              | `$?`       | sisaldab             |
| `¶`/`\`  | reavahetus          | `$[s..e]`  | lõige                |
| `?`      | kui                 | `$>`       | kaardistamine        |
| `_?`     | muidu-kui           | `$\|`      | filtreerimine        |
| `_`      | muidu / universaalne| `$<`       | vähendamine          |
| `??`     | vastavus            | `!?`       | proovi               |
| `@`      | tsükkel             | `:!`       | püüa viga            |
| `@!`     | katkesta            | `:>`       | lõpuks               |
| `@>`     | jätka               | `$!`       | on viga              |
| `->`     | lambda              | `$!!`      | levi viga            |
| `<~`     | tagasta             | `#`        | deklareeri moodul    |
| `\|>`    | toru                | `#>`       | ekspordi             |
| `#1`     | tõene               | `<#`       | impordi              |
| `#0`     | väär                | `::`       | mooduli kutse        |

---

*Zymbol-Lang — Sümboolne. Universaalne. Muutumatu.*

---

**Märkus:** See dokumentatsioon loodi ja tõlgiti tehisintellekti (TI) abil. On tehtud kõik jõupingutused täpsuse tagamiseks, kuid mõned tõlked või näited võivad sisaldada vigu. Autoriteetne viide on [Zymbol-Lang spetsifikatsioon](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
