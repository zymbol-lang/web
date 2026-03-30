# Manualul Zymbol-Lang

**Zymbol-Lang** este un limbaj de programare simbolic. Fără cuvinte cheie — totul este un simbol. Funcționează la fel în orice limbă umană.

- Fără `if`, `while`, `return` — doar `?`, `@`, `<~`
- Unicode complet — identificatori în orice limbă sau emoji
- Agnostic față de limbă — codul este identic în toate limbile

---

## Variabile și Constante

```zymbol
x = 10              // variabilă mutabilă
PI := 3.14159       // constantă — eroare la reatribuire
nume = "Alice"
activ = #1          // boolean adevărat
👋 := "Salut"
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

## Tipuri de Date

| Tip            | Literal             | Etichetă `#?` | Note                               |
|----------------|---------------------|---------------|------------------------------------|
| Int            | `42`, `-7`          | `###`         | 64 de biți cu semn                 |
| Float          | `3.14`, `1.5e10`    | `##.`         | Notație științifică OK             |
| String         | `"text"`            | `##"`         | Interpolare: `"Salut {nume}"`      |
| Char           | `'A'`               | `##'`         | Un caracter Unicode                |
| Bool           | `#1`, `#0`          | `##?`         | NU numeric — `#1 ≠ 1`             |
| Array          | `[1, 2, 3]`         | `##]`         | Elemente omogene                   |
| Tuplu          | `(a, b)`            | `##)`         | Pozițional                         |
| Tuplu numit    | `(x: 1, y: 2)`      | `##)`         | Câmpuri numite                     |

```zymbol
// Introspecție de tip — returnează (tip, cifre, valoare)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Ieșire și Intrare

```zymbol
>> "Salut" ¶                       // ¶ sau \\ pentru linie nouă explicită
>> "a=" a " b=" b ¶                // juxtapunere — valori multiple
>> (arr$#) ¶                       // operatorii postfix necesită ( ) în >>

<< nume                            // citi în variabilă (fără mesaj)
<< "Introduceți numele: " nume     // cu mesaj
```

> `¶` (AltGr+R pe tastatura spaniolă) și `\\` sunt linii noi echivalente.

---

## Operatori

```zymbol
// Aritmetică
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (împărțire întreagă)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (ridicare la putere)

// Comparație
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logică
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Șiruri de Caractere

```zymbol
// Trei forme de concatenare
nume = "Alice"
n = 42

msg = "Salut ", nume, "!"              // virgulă — în atribuiri
>> "Salut " nume " ai " n ¶           // juxtapunere — în >>
desc = "Salut {nume}, ai {n}"         // interpolare — oriunde
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (sfârșit exclusiv)
are = s$? "World"          // #1
parti = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (doar primele N)
```

> `+` este doar pentru numere. Folosiți `,`, juxtapunere sau interpolare pentru șiruri.

---

## Control de Flux

```zymbol
x = 7

? x > 0 { >> "pozitiv" ¶ }

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

> Blocurile `{ }` sunt **obligatorii** chiar și pentru o singură instrucțiune.

---

## Match

```zymbol
// Intervale
nota = 85
calificativ = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> calificativ ¶    // → B

// Șiruri
culoare = "rosu"
cod = ?? culoare {
    "rosu"  : "#FF0000"
    "verde" : "#00FF00"
    _       : "#000000"
}

// Gărzi
temp = -5
stare = ?? temp {
    _? temp < 0  : "gheata"
    _? temp < 20 : "rece"
    _? temp < 35 : "cald"
    _            : "fierbinte"
}
>> stare ¶    // → gheata

// Formă instrucțiune (ramuri bloc)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negativ" ¶ }
    _        : { >> "pozitiv" ¶ }
}
```

---

## Bucle

```zymbol
@ i:0..4  { >> i " " }        // interval inclusiv:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // cu pas:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // invers:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fructe = ["măr", "pară", "strugure"]
@ f:fructe { >> f ¶ }         // pentru fiecare element

@ c:"salut" { >> c "-" }
>> ¶                          // → s-a-l-u-t-  (peste caractere)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuă
    ? i > 7 { @! }             // @! oprește
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Buclă infinită
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Buclă etichetată (break imbricat)
contor = 0
@ @extern {
    contor++
    ? contor >= 3 { @! extern }
}
>> contor ¶                   // → 3
```

---

## Funcții

```zymbol
aduna(a, b) { <~ a + b }
>> aduna(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Funcțiile au un **domeniu de vizibilitate izolat** — nu pot citi variabile externe. Folosiți parametri de ieșire `<~` pentru a modifica variabilele apelantului:

```zymbol
schimba(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
schimba(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Funcțiile numite nu sunt valori de primă clasă. Pentru a le transmite ca argument, înveliți: `x -> fn(x)`.

---

## Lambda și Închideri

```zymbol
dublu = x -> x * 2
suma = (a, b) -> a + b
>> dublu(5) ¶    // → 10
>> suma(3, 7) ¶  // → 10

// Lambda cu bloc
clasifică = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "zero"
}

// Închidere — capturează domeniul exterior
factor = 3
triplu = x -> x * factor
>> triplu(7) ¶    // → 21

// Fabrică
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// În array-uri
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Array-uri

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — acces (baza 0)
arr[-1]         // 5 — index negativ (ultimul)
arr$#           // 5 — lungime (folosiți (arr$#) în >>)

arr = arr$+ 6            // adăuga → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insera la indexul 2
arr3 = arr$- 3           // elimina prima apariție a valorii
arr4 = arr$-- 3          // elimina toate aparițiile
arr5 = arr$-[0]          // elimina la index
arr6 = arr$-[1..3]       // elimina un interval (sfârșit exclusiv)

are = arr$? 3            // #1 — conține
pos = arr$?? 3           // [2] — toți indicii valorii
sl = arr$[0..3]          // [1,2,3] — felie (sfârșit exclusiv)
sl2 = arr$[0:3]          // [1,2,3] — la fel, sintaxă prin numărare

asc = arr$^+             // sortat crescător  (doar primitive)
desc = arr$^-            // sortat descrescător (doar primitive)

// Array-uri de tuple numite/poziționale — folosiți $^ cu lambda comparator
db = [(nume: "Carla", varsta: 28), (nume: "Ana", varsta: 25), (nume: "Bob", varsta: 30)]
dupa_varsta = db$^ (a, b -> a.varsta < b.varsta)    // crescător după vârstă  (<)
dupa_nume   = db$^ (a, b -> a.nume > b.nume)        // descrescător după nume (>)
>> dupa_varsta[0].nume ¶     // → Ana
>> dupa_nume[0].nume ¶       // → Carla

arr[1] = 99              // actualizare la loc
arr = arr[1]$~ 99        // actualizare funcțională — returnează array nou
```

> Toți operatorii de colecție returnează un **array nou**. Reatribuiți: `arr = arr$+ 4`.
> Operatorii nu pot fi înlănțuiți — folosiți atribuiri intermediare.
> `$^+` / `$^-` sortează **array-uri primitive** (numere, șiruri). Pentru array-uri de tuple, folosiți `$^` cu lambda comparator — direcția este codificată în lambda (`<` = crescător, `>` = descrescător).

```zymbol
// Array-uri imbricate
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[1][2] ¶    // → 6
```

---

## Destructurare

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primul, *restul] = arr      // primul=10  restul=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ignoră

// Tuplu pozițional
punct = (100, 200)
(px, py) = punct             // px=100  py=200

// Tuplu numit
persoana = (nume: "Ana", varsta: 25, oras: "București")
(nume: n, varsta: v) = persoana   // n="Ana"  v=25
```

---

## Tupluri

```zymbol
// Pozițional
punct = (10, 20)
>> punct[0] ¶    // → 10

// Numit
persoana = (nume: "Alice", varsta: 25)
>> persoana.nume ¶    // → Alice
>> persoana[0] ¶      // → Alice  (indexul funcționează și el)

// Imbricat
pos = (x: 10, y: 20)
p = (pos: pos, eticheta: "origine")
>> p.pos.x ¶        // → 10
```

---

## Funcții de Ordin Superior

> Operatorii HOF necesită un **lambda inline** — variabilele lambda nu pot fi transmise direct.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

duble   = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pare    = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total   = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Înlănțuire via intermediari
pas1 = nums$| (x -> x > 3)
pas2 = pas1$> (x -> x * x)
>> pas2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funcții numite în HOF — înveliți în lambda
dubla(x) { <~ x * 2 }
r = nums$> (x -> dubla(x))    // ✅
```

---

## Operatorul Pipe

Partea dreaptă necesită întotdeauna `_` ca marcaj de poziție pentru valoarea transmisă:

```zymbol
dublu = x -> x * 2
aduna = (a, b) -> a + b
inc = x -> x + 1

5 |> dublu(_)        // → 10
10 |> aduna(_, 5)    // → 15
5 |> aduna(2, _)     // → 7

// Înlănțuit
r = 5 |> dublu(_) |> inc(_) |> dublu(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Gestionarea Erorilor

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "împărțire la zero" ¶
} :! {
    >> "altă eroare: " _err ¶    // _err conține mesajul de eroare
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
get_PI() { <~ _PI }   // getter — accesul direct la constantă prin alias nu e suportat
```

```zymbol
// Fișier: main.zy
<# ./lib/calc <= c    // alias obligatoriu

>> c::aduna(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Export cu un alt nume public
# libmea
#> { _aduna_interna <= suma }

_aduna_interna(a, b) { <~ a + b }
```

```zymbol
<# ./libmea <= m

>> m::suma(3, 4) ¶    // → 7  (numele intern _aduna_interna este ascuns)
```

---

## Operatori de Date

```zymbol
// Conversia șirului în număr
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (sigur, fără eroare)

// Rotunjire / trunchiere
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rotunjire la 2 zecimale)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunchiere)

// Formatare numere
fmt = #,|1234567|      // → 1,234,567  (separator de mii)
sci = #^|12345.678|    // → 1.2345678e4  (științific)

// Literale de bază
a = 0x41         // → 'A'  (hexazecimal)
b = 0b01000001   // → 'A'  (binar)
c = 0o101        // → 'A'  (octal)

// Conversie de bază
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrare Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // capturează stdout (inclusiv \n final)
>> "Astăzi: " data

fisier = "data.txt"
continut = <\ cat {fisier} \>   // interpolare în comenzi

iesire = </"./script.zy"/>      // executa alt script Zymbol, capturează ieșirea
>> iesire
```

> `><` capturează argumentele CLI ca array de șiruri (doar tree-walker).

---

## Exemplu Complet: FizzBuzz

```zymbol
clasifică(număr) {
    ? număr % 15 == 0 { <~ "FizzBuzz" }
    _? număr % 3  == 0 { <~ "Fizz" }
    _? număr % 5  == 0 { <~ "Buzz" }
    _ { <~ număr }
}

@ i:1..20 { >> clasifică(i) ¶ }
```

---

## Referință Simboluri

| Simbol    | Operație                           | Simbol        | Operație                      |
|-----------|------------------------------------|---------------|-------------------------------|
| `=`       | variabilă                          | `$#`          | lungime                       |
| `:=`      | constantă                          | `$+`          | adăuga                        |
| `>>`      | ieșire                             | `$+[i]`       | insera la index               |
| `<<`      | intrare                            | `$-`          | elimina prima apariție        |
| `¶`/`\\`  | linie nouă                         | `$--`         | elimina toate aparițiile      |
| `?`       | dacă (if)                          | `$-[i]`       | elimina la index              |
| `_?`      | altfel dacă (elif)                 | `$-[i..j]`    | elimina un interval           |
| `_`       | altfel / wildcard                  | `$?`          | conține                       |
| `??`      | match                              | `$??`         | toți indicii valorii          |
| `@`       | buclă                              | `$[s..e]`     | felie                         |
| `@!`      | oprește (break)                    | `$>`          | map                           |
| `@>`      | continuă                           | `$\|`         | filter                        |
| `->`      | lambda                             | `$<`          | reduce                        |
| `$^+`     | sorta crescător (primitive)        | `$^-`         | sorta descrescător            |
| `$^`      | sorta cu lambda comparator         |               |                               |
| `<~`      | întoarce (return)                  | `!?`          | încearcă (try)                |
| `\|>`     | pipe                               | `:!`          | prinde (catch)                |
| `#1`      | adevărat                           | `:>`          | întotdeauna (finally)         |
| `#0`      | fals                               | `$!`          | este eroare                   |
| `<#`      | importă                            | `$!!`         | propagă eroare                |
| `#`       | declară modul                      | `#>`          | exportă                       |
| `::`      | apel modul                         | `.`           | acces câmp                    |
| `#\|..\|` | conversi număr                    | `#?`          | metadate tip                  |
| `#.N\|..\|` | rotunjire                       | `#!N\|..\|`   | trunchiere                    |
| `c\|..\|` | format virgulă                    | `e\|..\|`     | științific                    |
| `<\ ..\>` | execuție shell                    | `>\<`         | argumente CLI                 |

---

> **Avertisment:** Această documentație a fost creată și tradusă de inteligența artificială (IA).
> S-au depus toate eforturile pentru a asigura acuratețea, dar unele traduceri sau exemple pot conține erori.
> Referința canonică este [specificația Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
