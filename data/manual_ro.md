# Manualul Compact Zymbol-Lang

**Zymbol-Lang** este un limbaj de programare simbolic. Nu folosește cuvinte cheie — totul este un simbol. Funcționează la fel în orice limbă umană.

---

## Filozofie

- Fără cuvinte cheie (`if`, `while`, `return` nu există — doar simbolurile `?`, `@`, `<~`)
- Unicode complet — identificatori în orice limbă sau emoji 👋
- Agnostic față de limbă — codul este identic în toate limbile

---

## Variabile și Constante

```zymbol
x = 10           // variabilă (mutabilă)
PI := 3.14159    // constantă (imutabilă — eroare dacă este reatribuită)
nume = "Ana"
activ = #1       // boolean adevărat
👋 := "Salut"
```

### Atribuire Compusă

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

## Tipuri de Date

| Tip            | Exemplu             | Simbol `#?`  | Note                                |
|----------------|---------------------|--------------|-------------------------------------|
| Întreg         | `42`, `-7`          | `###`        | 64 de biți cu semn                  |
| Virgulă mobilă | `3.14`, `1.5e10`    | `##.`        | Notație științifică OK              |
| Șir de caract. | `"salut"`           | `##"`        | Interpolare: `"Salut {nume}"`       |
| Caracter       | `'A'`               | `##'`        | Un caracter Unicode                 |
| Boolean        | `#1`, `#0`          | `##?`        | NU sunt 1 și 0 numerice             |
| Array          | `[1, 2, 3]`         | `##]`        | Toate elementele de același tip     |
| Tuplu          | `(a, b)`            | `##)`        | Pozițional                          |
| Tuplu numit    | `(x: 1, y: 2)`      | `##)`        | Acces prin nume sau index           |

---

## Ieșire și Intrare

```zymbol
// Ieșire — NU adaugă automat linie nouă
>> "Salut" ¶                    // ¶ sau \\ dă o linie nouă explicită
>> "a=" a " b=" b ¶             // mai multe valori prin juxtapunere
>> "suma=" aduna(2, 3) ¶        // apeluri de funcții în orice poziție
>> (arr$#) ¶                    // operatorii postfix necesită paranteze

// Intrare
<< nume                         // fără mesaj — citește în variabilă
<< "Numele tău? " nume          // cu mesaj
```

> `¶` sau `\\` sunt echivalente ca linie nouă.

---

## Concatenarea Șirurilor

Trei forme valide — fiecare pentru contextul său:

```zymbol
nume = "Ana"
n = 25

// 1. Virgulă — în atribuiri cu = sau :=
msg = "Salut ", nume, "!"              // → Salut Ana!
TITLU := "Utilizator: ", nume

// 2. Juxtapunere — în ieșire >>
>> "Salut " nume " ai " n " ani" ¶    // → Salut Ana ai 25 ani

// 3. Interpolare — în orice context
desc = "Salut {nume}, ai {n} ani"     // → Salut Ana, ai 25 ani
```

> **Notă**: `+` este doar pentru numere. Folosirea cu șiruri generează un avertisment.

---

## Control de Flux

```zymbol
x = 7

// Dacă simplu
? x > 0 { >> "pozitiv" ¶ }

// Dacă / altfel dacă / altfel
? x > 100 {
    >> "mare" ¶
} _? x > 0 {
    >> "pozitiv" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negativ" ¶
}
```

Blocurile `{ }` sunt **obligatorii** chiar și pentru o singură linie.

---

## Match

```zymbol
// Match cu intervale
nota = 85
calificativ = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> calificativ ¶    // → B

// Match cu gărzi (condiții arbitrare)
temp = -5
stare = ?? temp {
    _? temp < 0  : "gheata"
    _? temp < 20 : "rece"
    _? temp < 35 : "cald"
    _            : "fierbinte"
}
>> stare ¶    // → gheata

// Match cu șiruri
culoare = "rosu"
cod = ?? culoare {
    "rosu"  : "#FF0000"
    "verde" : "#00FF00"
    _       : "#000000"
}
>> cod ¶
```

---

## Bucle

```zymbol
// Interval inclusiv: 0..4 iterează 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Interval cu pas
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Interval invers
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Cât timp (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Pentru fiecare element
fructe = ["măr", "pară", "strugure"]
@ f:fructe { >> f ¶ }

// Peste caracterele unui șir
@ c:"salut" { >> c "-" }
>> ¶    // → s-a-l-u-t-

// Break și Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continuă
    ? i > 7 { @! }          // @! oprește
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funcții

```zymbol
// Declarare și apel
aduna(a, b) { <~ a + b }
>> aduna(3, 4) ¶    // → 7

// Recursivitate
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Funcțiile au domeniu de vizibilitate izolat — fără acces la variabile externe
global = 100
testa() {
    x = 42    // doar local
    <~ x
}
>> testa() ¶    // → 42
```

> **Important**: Funcțiile declarate cu `nume(params){ }` nu sunt valori de primă clasă.
> Pentru a le transmite ca argument, învelire: `x -> nume(x)`.

---

## Lambda și Închideri

```zymbol
// Lambda simplă (întoarcere implicită)
dublu = x -> x * 2
suma = (a, b) -> a + b
>> dublu(5) ¶    // → 10
>> suma(3, 7) ¶  // → 10

// Lambda cu bloc (întoarcere explicită)
clasifică = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "zero"
}
>> clasifică(5) ¶     // → pozitiv
>> clasifică(0) ¶     // → zero
>> clasifică(-5) ¶    // → negativ

// Închideri — lambda capturează variabilele din domeniu exterior
factor = 3
triplu = x -> x * factor    // capturează 'factor'
>> triplu(7) ¶    // → 21

// Fabrică de funcții
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda ca valori: stocate în array-uri
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Array-uri

```zymbol
arr = [10, 20, 30, 40, 50]

// Acces (index 0-base)
>> arr[0] ¶    // → 10

// Lungime (paranteze necesare în >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Adăuga, elimina, conține, felie
arr = arr$+ 60               // adăuga
arr = arr$- 0                // elimina indexul 0
contine = arr$? 30           // → #1
felie = arr$[0..2]           // [20, 30]

// Actualizare element
arr[1] = 99

// Pentru fiecare element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` returnează un **array nou** — reatribuire: `arr = arr$+ 4`.
> Fără înlănțuire: folosiți două atribuiri separate.

---

## Tupluri

```zymbol
// Tuplu numit
persoana = (nume: "Alice", varsta: 25)
>> persoana.nume ¶     // → Alice
>> persoana.varsta ¶   // → 25
>> persoana[0] ¶       // → Alice (indexul funcționează și el)
```

---

## Funcții de Ordin Superior

Operatorii HOF necesită o **lambda inline** — nu o variabilă lambda directă.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
duble = nums$> (x -> x * 2)
>> duble ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pare = nums$| (x -> x % 2 == 0)
>> pare ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (valoare_inițială, (acumulator, element) -> expr)
total = nums$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55
```

---

## Gestionarea Erorilor

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "împărțire la zero" ¶
} :! ##IO {
    >> "eroare IO" ¶
} :! {
    >> "altă eroare: " _err ¶
} :> {
    >> "se execută întotdeauna" ¶
}
```

| Tip         | Când apare                   |
|-------------|------------------------------|
| `##Div`     | Împărțire la zero             |
| `##IO`      | Fișier / sistem               |
| `##Index`   | Index în afara limitelor      |
| `##Type`    | Eroare de tip                 |
| `##Parse`   | Eroare de parsare             |
| `##Network` | Erori de rețea                |
| `##_`       | Orice eroare (catch-all)      |

---

## Module

```zymbol
// Fișier: lib/calc.zy
# calc

#> { aduna, get_PI }    // exporturi ÎNAINTE de definiții

_PI := 3.14159
aduna(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fișier: main.zy
<# ./lib/calc <= c    // alias obligatoriu

>> c::aduna(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Exemplu Complet: FizzBuzz

```zymbol
clasifică(număr) {
    ? număr % 15 == 0 { <~ "FizBâz" }
    _? număr % 3  == 0 { <~ "Fiz" }
    _? număr % 5  == 0 { <~ "Bâz" }
    _ { <~ număr }
}

@ i:1..20 { >> clasifică(i) ¶ }
```

---

## Referință Simboluri

| Simbol  | Operație           | Simbol     | Operație            |
|---------|--------------------|------------|---------------------|
| `=`     | variabilă          | `$#`       | lungime             |
| `:=`    | constantă          | `$+`       | adăuga              |
| `>>`    | ieșire             | `$-`       | elimina (prin index)|
| `<<`    | intrare            | `$?`       | conține             |
| `¶`/`\` | linie nouă         | `$[s..e]`  | felie               |
| `?`     | dacă (if)          | `$>`       | map                 |
| `_?`    | altfel dacă (elif) | `$\|`      | filter              |
| `_`     | altfel / wildcard  | `$<`       | reduce              |
| `??`    | match              | `!?`       | încearcă (try)      |
| `@`     | buclă              | `:!`       | prinde (catch)      |
| `@!`    | oprește (break)    | `:>`       | întotdeauna (finally)|
| `@>`    | continuă           | `$!`       | este eroare         |
| `->`    | lambda             | `$!!`      | propagă eroare      |
| `<~`    | întoarce           | `#`        | declară modul       |
| `\|>`   | pipe               | `#>`       | exportă             |
| `#1`    | adevărat           | `<#`       | importă             |
| `#0`    | fals               | `::`       | apel modul          |

---

*Zymbol-Lang — Simbolic. Universal. Imutabil.*

---

> **Avertisment:** Această documentație a fost creată și tradusă de inteligența artificială (IA).
> S-au depus toate eforturile pentru a asigura acuratețea, dar unele traduceri sau exemple pot conține erori.
> Referința canonică este [specificația Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
