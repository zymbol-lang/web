# Dokumentacija | Kompaktiška Zymbol-Lang vadovėlis

**Zymbol-Lang** yra simbolinė programavimo kalba. Ji nenaudoja raktažodžių — viskas yra simbolis. Ji veikia vienodai bet kurioje žmonių kalboje.

---

## Filosofija

- Nėra raktažodžių (`jei`, `ciklas`, `grąžinimas` neegzistuoja — tik simboliai `?`, `@`, `<~`)
- Pilnas Unicode palaikymas — identifikatoriai bet kuria kalba ar emoji 👋
- Nepriklausomas nuo žmonių kalbos — kodas yra identiškas kiekvienoje kalboje

---

## Kintamieji ir Konstantos

```zymbol
x = 10           // kintamasis (keičiamas)
PI := 3.14159    // konstanta (nekeičiama — klaida pakartotinai priskiriant)
vardas = "Ana"
aktyvus = #1     // loginė reikšmė true
👋 := "Labas"
```

### Sudėtinis Priskyrimas

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

## Duomenų Tipai

| Tipas            | Pavyzdys            | `#?` Simbolis | Pastabos                              |
|------------------|---------------------|---------------|---------------------------------------|
| Sveikasis        | `42`, `-7`          | `###`         | 64 bitų su ženklu                     |
| Slankusis kablelis | `3.14`, `1.5e10`  | `##.`         | Mokslinis žymėjimas palaikomas        |
| Eilutė           | `"labas"`           | `##"`         | Interpolacija: `"Labas {vardas}"`     |
| Simbolis         | `'A'`               | `##'`         | Vienas Unicode simbolis               |
| Loginė           | `#1`, `#0`          | `##?`         | NE skaitinė 1 ir 0                    |
| Masyvas          | `[1, 2, 3]`         | `##]`         | Visi elementai turi būti to paties tipo |
| Tuple            | `(a, b)`            | `##)`         | Pozicinis                             |
| Pavadintas Tuple | `(x: 1, y: 2)`      | `##)`         | Prieiga pagal pavadinimą ar indeksą   |

---

## Išvestis ir Įvestis

```zymbol
// Išvestis — NEPRIDEDA automatiškai naujos eilutės
>> "Labas, Lietuviškai kalbantis pasauli!" ¶  // ¶ arba \\ suteikia aiškią naują eilutę
>> "a=" a " b=" b ¶                           // kelios reikšmės su juxtapozicija
>> "suma=" klasifikuok(2, 3) ¶                // funkcijų iškvietimai bet kurioje vietoje
>> (vaisius$#) ¶                              // postfikso operatoriai reikalauja skliaustų

// Įvestis
<< vardas                                     // be raginimo — skaito į kintamąjį
<< "Jūsų vardas? " vardas                     // su raginimo
```

> `¶` arba `\\` yra ekvivalentai kaip nauja eilutė.

---

## Eilučių Sujungimas

Trys galiojančios formos — kiekviena savo kontekstui:

```zymbol
vardas = "Ana"
skaičius = 25

// 1. Kablelis — priskyrimuose su = ar :=
žinutė = "Labas ", vardas, "!"              // → Labas Ana!
PAVADINIMAS := "Vartotojas: ", vardas

// 2. Juxtapozicija — >> išvestyje
>> "Labas " vardas " tau " skaičius ¶       // → Labas Ana tau 25

// 3. Interpolacija — bet kuriame kontekste
aprašymas = "Labas {vardas}, tau {skaičius}" // → Labas Ana, tau 25
```

> **Pastaba**: `+` skirtas tik skaičiams. Naudojimas su eilutėmis generuoja įspėjimą.

---

## Valdymo Srautas

```zymbol
x = 7

// Paprastas sąlyga
? x > 0 { >> "teigiamas" ¶ }

// sąlyga / kita-sąlyga / kita
? x > 100 {
    >> "didelis" ¶
} _? x > 0 {
    >> "teigiamas" ¶
} _? x == 0 {
    >> "nulis" ¶
} _ {
    >> "neigiamas" ¶
}
```

Blokai `{ }` yra **privalomi** net vienai eilutei.

---

## Atitikimas

```zymbol
// Atitikimas su diapazonais
taškai = 85
įvertinimas = ?? taškai {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> įvertinimas ¶    // → B

// Atitikimas su sąlygomis (savavališkos sąlygos)
temperatūra = -5
būsena = ?? temperatūra {
    _? temperatūra < 0  : "ledas"
    _? temperatūra < 20 : "šalta"
    _? temperatūra < 35 : "šilta"
    _                   : "karšta"
}
>> būsena ¶    // → ledas

// Atitikimas su eilutėmis
spalva = "raudona"
kodas = ?? spalva {
    "raudona" : "#FF0000"
    "žalia"   : "#00FF00"
    _         : "#000000"
}
>> kodas ¶
```

---

## Ciklai

```zymbol
// Įtraukiantis diapazonas: 0..4 iteruoja 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Diapazonas su žingsniu
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Atvirkštinis diapazonas
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Kol ciklas
skaičius = 1
@ skaičius <= 64 { skaičius *= 2 }
>> skaičius ¶    // → 128

// Kiekvienam masyvo elementui
vaisius = ["obuolys", "kriaušė", "vynuogė"]
@ f:vaisius { >> f ¶ }

// Per eilutės simbolius
@ c:"labas" { >> c "-" }
>> ¶    // → l-a-b-a-s-

// Pertrauka ir Tęsinys
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> tęsti
    ? i > 7 { @! }          // @! pertraukti
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcijos

```zymbol
// Deklaracija ir iškvietimas
sudėti(a, b) { <~ a + b }
>> sudėti(3, 4) ¶    // → 7

// Rekursija
faktorialas(skaičius) {
    ? skaičius <= 1 { <~ 1 }
    <~ skaičius * faktorialas(skaičius - 1)
}
>> faktorialas(5) ¶    // → 120

// Funkcijos turi izoliuotą apimtį — be prieigos prie išorinių kintamųjų
globalus = 100
testuoti() {
    x = 42    // tik lokalus
    <~ x
}
>> testuoti() ¶    // → 42
```

> **Svarbu**: Pavadintos funkcijos `pavadinimas(params){ }` nėra pirmosios klasės reikšmės.
> Norint perduoti kaip argumentą, apvilkite: `x -> pavadinimas(x)`.

---

## Lambdos ir Uždarai

```zymbol
// Paprasta lambda (numanomas grąžinimas)
padvigubintas = x -> x * 2
suma = (a, b) -> a + b
>> padvigubintas(5) ¶    // → 10
>> suma(3, 7) ¶          // → 10

// Bloko lambda (aiškus grąžinimas)
klasifikuok = x -> {
    ? x > 0 { <~ "teigiamas" }
    _? x < 0 { <~ "neigiamas" }
    <~ "nulis"
}
>> klasifikuok(5) ¶     // → teigiamas
>> klasifikuok(0) ¶     // → nulis
>> klasifikuok(-5) ¶    // → neigiamas

// Uždarai — lambdos fiksuoja išorinės apimties kintamuosius
faktorius = 3
patrigubintas = x -> x * faktorius    // fiksuoja 'faktorius'
>> patrigubintas(7) ¶    // → 21

// Funkcijų fabrikas
sukurti_sudėjiklį(n) { <~ x -> x + n }
pridėti10 = sukurti_sudėjiklį(10)
>> pridėti10(5) ¶    // → 15

// Lambdos kaip reikšmės: saugomos masyvuose
operacijos = [x -> x+1, x -> x*2, x -> x*x]
>> operacijos[0](5) ¶    // → 6
>> operacijos[2](5) ¶    // → 25
```

---

## Masyvai

```zymbol
arr = [10, 20, 30, 40, 50]

// Prieiga (0 pagrįstas indeksas)
>> arr[0] ¶    // → 10

// Ilgis (reikalauja skliaustų >>)
skaičius = arr$#
>> (arr$#) ¶    // → 5

// Pridėti, pašalinti, yra, pjūvis
arr = arr$+ 60               // pridėjimas
arr = arr$- 0                // indekso 0 pašalinimas
yra = arr$? 30               // → #1
pjūvis = arr$[0..2]          // [20, 30]

// Elemento atnaujinimas
arr[1] = 99

// Kiekvienam elementui
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` grąžina **naują masyvą** — priskirkite atgal: `arr = arr$+ 4`.
> Negalima grandinėti: naudokite du atskirus priskyrimus.

---

## Tuplai

```zymbol
// Pavadintas tuple
asmuo = (vardas: "Rūta", amžius: 25)
>> asmuo.vardas ¶    // → Rūta
>> asmuo.amžius ¶    // → 25
>> asmuo[0] ¶        // → Rūta (indeksas taip pat veikia)
```

---

## Aukštesnės Eilės Funkcijos

HOF operatoriai reikalauja **įterptinės lambdos** — ne tiesioginio lambda kintamojo.

```zymbol
skaičiai = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Žemėlapis ($>)
padvigubinti = skaičiai$> (x -> x * 2)
>> padvigubinti ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtravimas ($|)
lyginiai = skaičiai$| (x -> x % 2 == 0)
>> lyginiai ¶    // → [2, 4, 6, 8, 10]

// Redukcija ($<) — (pradinė reikšmė, (acc, elem) -> išraiška)
iš_viso = skaičiai$< (0, (acc, x) -> acc + x)
>> iš_viso ¶    // → 55
```

---

## Klaidų Tvarkymas

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dalyba iš nulio" ¶
} :! ##IO {
    >> "I/V klaida" ¶
} :! {
    >> "kita klaida: " _err ¶
} :> {
    >> "visada vykdoma" ¶
}
```

| Tipas       | Kada įvyksta             |
|-------------|--------------------------|
| `##Div`     | Dalyba iš nulio          |
| `##IO`      | Failas / sistema         |
| `##Index`   | Indeksas už ribų         |
| `##Type`    | Tipo klaida              |
| `##Parse`   | Duomenų analizė          |
| `##Network` | Tinklo klaidos           |
| `##_`       | Bet kuri klaida          |

---

## Moduliai

```zymbol
// Failas: lib/calc.zy
# calc

#> { sudėti, get_PI }    // eksportuoti PRIEŠ apibrėžimus

_PI := 3.14159
sudėti(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Failas: main.zy
<# ./lib/calc <= c    // slapyvardis privalomas

>> c::sudėti(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Pilnas Pavyzdys: FizzBuzz

```zymbol
klasifikuok(skaičius) {
    ? skaičius % 15 == 0 { <~ "ŠnypšDūz" }
    _? skaičius % 3  == 0 { <~ "Šnypš" }
    _? skaičius % 5  == 0 { <~ "Dūz" }
    _ { <~ skaičius }
}

@ i:1..20 { >> klasifikuok(i) ¶ }
```

---

## Simbolių Nuoroda

| Simbolis  | Operacija           | Simbolis   | Operacija             |
|-----------|---------------------|------------|-----------------------|
| `=`       | kintamasis          | `$#`       | ilgis                 |
| `:=`      | konstanta           | `$+`       | pridėjimas            |
| `>>`      | išvestis            | `$-`       | pašalinimas (ind.)    |
| `<<`      | įvestis             | `$?`       | yra                   |
| `¶`/`\`   | nauja eilutė        | `$[s..e]`  | pjūvis                |
| `?`       | jei                 | `$>`       | žemėlapis             |
| `_?`      | kita-jei            | `$\|`      | filtravimas           |
| `_`       | kita / universalus  | `$<`       | redukcija             |
| `??`      | atitikimas          | `!?`       | bandyti               |
| `@`       | ciklas              | `:!`       | pagauti klaidą        |
| `@!`      | pertraukti          | `:>`       | galų gale             |
| `@>`      | tęsti               | `$!`       | yra klaida            |
| `->`      | lambda              | `$!!`      | skleisti klaidą       |
| `<~`      | grąžinti            | `#`        | deklaruoti modulį     |
| `\|>`     | vamzdis             | `#>`       | eksportuoti           |
| `#1`      | tiesa               | `<#`       | importuoti            |
| `#0`      | netiesa             | `::`       | modulio iškvietimas   |

---

*Zymbol-Lang — Simbolinis. Universalus. Nekintamas.*

---

**Pastaba:** Ši dokumentacija buvo sukurta ir išversta dirbtinio intelekto (DI). Buvo dedamos visos pastangos užtikrinti tikslumą, tačiau kai kurie vertimai ar pavyzdžiai gali turėti klaidų. Autoritetinga nuoroda yra [Zymbol-Lang specifikacija](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
