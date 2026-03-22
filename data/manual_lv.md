# Dokumentācija | Kompakts Zymbol-Lang rokasgrāmata

**Zymbol-Lang** ir simboliska programmēšanas valoda. Tā neizmanto atslēgvārdus — viss ir simbols. Tā darbojas vienādi jebkurā cilvēku valodā.

---

## Filozofija

- Nav atslēgvārdu (`ja`, `cilpa`, `atgriešana` nepastāv — tikai simboli `?`, `@`, `<~`)
- Pilns Unicode atbalsts — identifikatori jebkurā valodā vai emoji 👋
- Neatkarīgs no cilvēku valodas — kods ir identisks katrā valodā

---

## Mainīgie un Konstantes

```zymbol
x = 10           // mainīgais (maināms)
PI := 3.14159    // konstante (nemaināma — kļūda atkārtotā piešķiršanā)
vārds = "Ana"
aktīvs = #1      // loģiskā vērtība true
👋 := "Sveika"
```

### Salikta Piešķiršana

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

## Datu Tipi

| Tips             | Piemērs             | `#?` Simbols | Piezīmes                               |
|------------------|---------------------|--------------|----------------------------------------|
| Vesels skaitlis  | `42`, `-7`          | `###`        | 64 bitu ar zīmi                        |
| Peldošais komats | `3.14`, `1.5e10`    | `##.`        | Zinātniskā pieraksta atbalsts          |
| Virkne           | `"sveika"`          | `##"`        | Interpolācija: `"Sveika {vārds}"`      |
| Rakstzīme        | `'A'`               | `##'`        | Viena Unicode rakstzīme                |
| Loģiskā          | `#1`, `#0`          | `##?`        | NAV skaitliska 1 un 0                  |
| Masīvs           | `[1, 2, 3]`         | `##]`        | Visiem elementiem jābūt vienāda tipa   |
| Tuple            | `(a, b)`            | `##)`        | Pozicionāls                            |
| Nosaukts Tuple   | `(x: 1, y: 2)`      | `##)`        | Piekļuve pēc nosaukuma vai indeksa     |

---

## Izvade un Ievade

```zymbol
// Izvade — NAV automātiskas jaunas rindas
>> "Sveika, Latviski runājošā pasaule!" ¶  // ¶ vai \\ dod skaidru jaunu rindu
>> "a=" a " b=" b ¶                        // vairākas vērtības ar juxtapozīciju
>> "summa=" klasificē(2, 3) ¶              // funkciju izsaukumi jebkurā pozīcijā
>> (auglis$#) ¶                            // postfiksa operatori prasa iekavas

// Ievade
<< vārds                                   // bez uzvednes — lasa mainīgajā
<< "Jūsu vārds? " vārds                    // ar uzvedni
```

> `¶` vai `\\` ir ekvivalenti kā jaunā rinda.

---

## Virkņu Savienošana

Trīs derīgas formas — katra savam kontekstam:

```zymbol
vārds = "Ana"
skaitlis = 25

// 1. Komats — piešķiršanā ar = vai :=
ziņa = "Sveika ", vārds, "!"              // → Sveika Ana!
NOSAUKUMS := "Lietotājs: ", vārds

// 2. Juxtapozīcija — >> izvadē
>> "Sveika " vārds " tev ir " skaitlis ¶  // → Sveika Ana tev ir 25

// 3. Interpolācija — jebkurā kontekstā
apraksts = "Sveika {vārds}, tev ir {skaitlis}" // → Sveika Ana, tev ir 25
```

> **Piezīme**: `+` ir tikai skaitļiem. Izmantošana ar virknēm ģenerē brīdinājumu.

---

## Vadības Plūsma

```zymbol
x = 7

// Vienkāršs nosacījums
? x > 0 { >> "pozitīvs" ¶ }

// nosacījums / citādi-nosacījums / citādi
? x > 100 {
    >> "liels" ¶
} _? x > 0 {
    >> "pozitīvs" ¶
} _? x == 0 {
    >> "nulle" ¶
} _ {
    >> "negatīvs" ¶
}
```

Bloki `{ }` ir **obligāti** pat vienai rindai.

---

## Atbilstība

```zymbol
// Atbilstība ar diapazoniem
punkti = 85
vērtējums = ?? punkti {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> vērtējums ¶    // → B

// Atbilstība ar nosacījumiem (patvaļīgi nosacījumi)
temperatūra = -5
stāvoklis = ?? temperatūra {
    _? temperatūra < 0  : "ledus"
    _? temperatūra < 20 : "auksts"
    _? temperatūra < 35 : "silts"
    _                   : "karsts"
}
>> stāvoklis ¶    // → ledus

// Atbilstība ar virknēm
krāsa = "sarkana"
kods = ?? krāsa {
    "sarkana" : "#FF0000"
    "zaļa"    : "#00FF00"
    _         : "#000000"
}
>> kods ¶
```

---

## Cilpas

```zymbol
// Iekļaujošs diapazons: 0..4 iterē 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Diapazons ar soli
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Apgriezts diapazons
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Kamēr cilpa
skaitlis = 1
@ skaitlis <= 64 { skaitlis *= 2 }
>> skaitlis ¶    // → 128

// Par katru masīva elementu
auglis = ["ābols", "bumbieris", "vīnogas"]
@ f:auglis { >> f ¶ }

// Pār virknes rakstzīmēm
@ c:"sveika" { >> c "-" }
>> ¶    // → s-v-e-i-k-a-

// Pārtraukums un Turpināšana
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> turpināt
    ? i > 7 { @! }          // @! pārtraukt
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcijas

```zymbol
// Deklarācija un izsaukums
saskaitīt(a, b) { <~ a + b }
>> saskaitīt(3, 4) ¶    // → 7

// Rekursija
faktoriāls(skaitlis) {
    ? skaitlis <= 1 { <~ 1 }
    <~ skaitlis * faktoriāls(skaitlis - 1)
}
>> faktoriāls(5) ¶    // → 120

// Funkcijām ir izolēta darbības joma — nav piekļuves ārējiem mainīgajiem
globāls = 100
testēt() {
    x = 42    // tikai lokāls
    <~ x
}
>> testēt() ¶    // → 42
```

> **Svarīgi**: Nosauktās funkcijas `nosaukums(params){ }` nav pirmās klases vērtības.
> Lai nodotu kā argumentu, ietiniet: `x -> nosaukums(x)`.

---

## Lambdas un Slēgumi

```zymbol
// Vienkārša lambda (netieša atgriešana)
dubultots = x -> x * 2
summa = (a, b) -> a + b
>> dubultots(5) ¶    // → 10
>> summa(3, 7) ¶     // → 10

// Bloka lambda (tieša atgriešana)
klasificē = x -> {
    ? x > 0 { <~ "pozitīvs" }
    _? x < 0 { <~ "negatīvs" }
    <~ "nulle"
}
>> klasificē(5) ¶     // → pozitīvs
>> klasificē(0) ¶     // → nulle
>> klasificē(-5) ¶    // → negatīvs

// Slēgumi — lambdas tver ārējās darbības jomas mainīgos
faktors = 3
trīskāršots = x -> x * faktors    // tver 'faktors'
>> trīskāršots(7) ¶    // → 21

// Funkciju rūpnīca
izveidot_saskaitītāju(n) { <~ x -> x + n }
pievienot10 = izveidot_saskaitītāju(10)
>> pievienot10(5) ¶    // → 15

// Lambdas kā vērtības: glabātas masīvos
darbības = [x -> x+1, x -> x*2, x -> x*x]
>> darbības[0](5) ¶    // → 6
>> darbības[2](5) ¶    // → 25
```

---

## Masīvi

```zymbol
arr = [10, 20, 30, 40, 50]

// Piekļuve (0 balstīts indekss)
>> arr[0] ¶    // → 10

// Garums (prasa iekavas >>)
skaitlis = arr$#
>> (arr$#) ¶    // → 5

// Pievienot, noņemt, satur, šķēle
arr = arr$+ 60               // pievienošana
arr = arr$- 0                // indeksa 0 noņemšana
ir = arr$? 30                // → #1
šķēle = arr$[0..2]           // [20, 30]

// Elementa atjaunināšana
arr[1] = 99

// Par katru elementu
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` atgriež **jaunu masīvu** — piešķiriet atpakaļ: `arr = arr$+ 4`.
> Nav ķēdēšanas: izmantojiet divas atsevišķas piešķiršanas.

---

## Tuplās

```zymbol
// Nosaukta tuple
persona = (vārds: "Laima", vecums: 25)
>> persona.vārds ¶    // → Laima
>> persona.vecums ¶   // → 25
>> persona[0] ¶       // → Laima (indekss arī darbojas)
```

---

## Augstākas Kārtas Funkcijas

HOF operatori prasa **iekļautu lambdu** — nevis tiešu lambda mainīgo.

```zymbol
skaitļi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Kartēšana ($>)
dubultoti = skaitļi$> (x -> x * 2)
>> dubultoti ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtrēšana ($|)
pāra = skaitļi$| (x -> x % 2 == 0)
>> pāra ¶    // → [2, 4, 6, 8, 10]

// Samazināšana ($<) — (sākuma vērtība, (acc, elem) -> izteiksme)
kopā = skaitļi$< (0, (acc, x) -> acc + x)
>> kopā ¶    // → 55
```

---

## Kļūdu Apstrāde

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dalīšana ar nulli" ¶
} :! ##IO {
    >> "I/A kļūda" ¶
} :! {
    >> "cita kļūda: " _err ¶
} :> {
    >> "vienmēr izpildās" ¶
}
```

| Tips        | Kad rodas                  |
|-------------|----------------------------|
| `##Div`     | Dalīšana ar nulli          |
| `##IO`      | Fails / sistēma            |
| `##Index`   | Indekss ārpus robežām      |
| `##Type`    | Tipa kļūda                 |
| `##Parse`   | Datu parsēšana             |
| `##Network` | Tīkla kļūdas               |
| `##_`       | Jebkura kļūda              |

---

## Moduļi

```zymbol
// Fails: lib/calc.zy
# calc

#> { saskaitīt, get_PI }    // eksportēt PIRMS definīcijām

_PI := 3.14159
saskaitīt(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fails: main.zy
<# ./lib/calc <= c    // aizstājvārds ir obligāts

>> c::saskaitīt(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                  // → 3.14159
```

---

## Pilns Piemērs: FizzBuzz

```zymbol
klasificē(skaitlis) {
    ? skaitlis % 15 == 0 { <~ "BurbDūc" }
    _? skaitlis % 3  == 0 { <~ "Burb" }
    _? skaitlis % 5  == 0 { <~ "Dūc" }
    _ { <~ skaitlis }
}

@ i:1..20 { >> klasificē(i) ¶ }
```

---

## Simbolu Atsauce

| Simbols  | Darbība             | Simbols    | Darbība              |
|----------|---------------------|------------|----------------------|
| `=`      | mainīgais           | `$#`       | garums               |
| `:=`     | konstante           | `$+`       | pievienošana         |
| `>>`     | izvade              | `$-`       | noņemšana (pēc ind.) |
| `<<`     | ievade              | `$?`       | satur                |
| `¶`/`\`  | jaunā rinda         | `$[s..e]`  | šķēle                |
| `?`      | ja                  | `$>`       | kartēšana            |
| `_?`     | citādi-ja           | `$\|`      | filtrēšana           |
| `_`      | citādi / universāls | `$<`       | samazināšana         |
| `??`     | atbilstība          | `!?`       | mēģināt              |
| `@`      | cilpa               | `:!`       | noķert kļūdu         |
| `@!`     | pārtraukt           | `:>`       | beidzot              |
| `@>`     | turpināt            | `$!`       | ir kļūda             |
| `->`     | lambda              | `$!!`      | izplatīt kļūdu       |
| `<~`     | atgriezt            | `#`        | deklarēt moduli      |
| `\|>`    | caurule             | `#>`       | eksportēt            |
| `#1`     | patiess             | `<#`       | importēt             |
| `#0`     | aplams              | `::`       | moduļa izsaukums     |

---

*Zymbol-Lang — Simbolisks. Universāls. Nemainīgs.*

---

**Piezīme:** Šī dokumentācija tika izveidota un tulkota ar mākslīgo intelektu (MI). Ir veikti visi centieni, lai nodrošinātu precizitāti, taču daži tulkojumi vai piemēri var saturēt kļūdas. Autoritatīvā atsauce ir [Zymbol-Lang specifikācija](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
