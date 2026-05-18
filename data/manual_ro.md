> **Avertisment:** Această documentație a fost creată și tradusă de inteligența artificială (IA).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Manual Zymbol-Lang

> **Revizuit pentru v0.0.5 — 2026-05-12**

**Zymbol-Lang** este un limbaj de programare simbolic. Fără cuvinte cheie — totul este un simbol. Funcționează identic în orice limbă umană.

- Nu există `if`, `while`, `return` — doar `?`, `@`, `<~`
- Unicode complet — identificatori în orice limbă sau emoji
- Independent de limbă umană — codul este același peste tot

**Versiunea interpretorului**: v0.0.5 | **Acoperire teste**: 436/436 (TW ↔ VM paritate)

---

## Variabile & Constante

```zymbol
x = 10              // variabilă mutabilă
PI := 3.14159       // constantă — reasignarea este eroare la execuție
nume = "Alice"
activ = #1          // boolean adevărat
👋 := "Salut"
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

`°` (semnul grade, U+00B0) inițializează automat o variabilă la valoarea sa neutră la prima utilizare:

```zymbol
numere = [3, 1, 4, 1, 5]
@ n:numere {
    °total += n    // auto-inițializat la 0 deasupra buclei; supraviețuiește după @
}
>> total ¶         // → 14
```

> `°x` (prefix) ancorează deasupra buclei — rezultatul este accesibil după `@`.
> `x°` (postfix) ancorează în interiorul buclei — dispare când bucla se termină.
> Doar interpretorul arborescent.

---

## Tipuri de Date

| Tip | Literal | tag `#?` | Note |
|-----|---------|----------|------|
| Întreg | `42`, `-7` | `###` | 64-bit cu semn |
| Zecimal | `3.14`, `1.5e10` | `##.` | Notație științifică OK |
| Șir | `"text"` | `##"` | Interpolare: `"Salut {nume}"` |
| Caracter | `'A'` | `##'` | Un singur caracter Unicode |
| Boolean | `#1`, `#0` | `##?` | NU numeric — `#1 ≠ 1` |
| Vector | `[1, 2, 3]` | `##]` | Elemente omogene |
| Tuplu | `(a, b)` | `##)` | Pozițional |
| Tuplu Numit | `(x: 1, y: 2)` | `##)` | Câmpuri numite |
| Funcție | referință funcție numită | `##()` | Primă clasă; afișaj `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primă clasă; afișaj `<lambd/N>` |

```zymbol
// Introspecție tip — returnează (tip, cifre, valoare)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Ieșire & Intrare

```zymbol
>> "Salut" ¶                      // ¶ sau \\ pentru linie nouă explicită
>> "a=" a " b=" b ¶               // juxtapunere — valori multiple
>> (vec$#) ¶                      // operatorii postfix necesită ( ) în >>

<< nume                           // citire într-o variabilă (fără prompt)
<< "Introduceți numele: " nume    // cu prompt
```

> `¶` (AltGr+R pe tastatura spaniolă) și `\\` sunt linii noi echivalente.

---

## Primitive TUI

Operatori de interfață terminală pentru programe interactive. Cei mai mulți necesită un bloc `>>| { }` (ecran alternativ + mod raw).

```zymbol
>>| {
    >>!                             // curăță ecranul alternativ
    >>~ (1, 1, 0, 10) > "Rulare"   // rând 1, col 1, fg=10 (verde)
    @~ 1000                         // pauză 1 secundă (1000 ms)
    >>~ (2, 1) > "Terminat."
}
// terminalul este restaurat automat la ieșire
```

```zymbol
// Apăsare tastă și dimensiuni terminal
>>| {
    [randuri, coloane] = >>?              // interogare dimensiuni terminal
    >>~ (1, 1) > "Terminal: " randuri " x " coloane
    <<| tasta                             // citire tastă blocantă
    >>~ (2, 1) > "Apăsat: " tasta
}
```

> `>>!` curăță ecranul. `>>?` returnează `[randuri, coloane]`. `@~ N` doarme N milisecunde.
> `<<|` citește o tastă (blocant); `<<|?` sondează fără blocare (returnează `'\0'` dacă nu există).
> Tuplu de ieșire pozițional: `(rând, col, BKS, fg, bg)` — orice slot poate fi omis cu virgulă (`>>~ (,,, 196) > "roșu"`).
> Mască BKS: `1`=Aldin, `2`=Cursiv, `4`=Subliniat. Paletă ANSI 256 de culori (`0`=implicit terminal).
> Doar interpretorul arborescent (cu excepția `>>!`, `>>?`, `@~`, `>>~` care rulează și în `--vm`).

---

## Operatori

```zymbol
// Aritmetică
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (împărțire întreagă)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponențiere)

// Comparație — asignați pentru a inspecta
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logici
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Șiruri

```zymbol
// Două forme de concatenare
nume = "Alice"
n = 42

>> "Salut " nume " ai " n ¶           // juxtapunere — în >>
desc = "Salut {nume}, ai {n}"         // interpolare — oriunde
```

```zymbol
s = "Salut Lume"
lung = s$#                 // 10
sub = s$[1..5]             // "Salut"  (1-bazat, sfârșitul inclusiv)
are = s$? "Lume"           // #1
parti = "a,b,c,d"$/ ','    // [a, b, c, d]  (împărțit după delimitator)
rep = s$~~["l":"L"]        // "SaLut Lume"  (înlocuire)
rep1 = s$~~["l":"L":1]     // "SaLut Lume"  (primele N)
linie = "─" $* 20          // "────────────────────"  (repetare de N ori)
```

> `+` este doar pentru numere. Folosiți `,`, juxtapunere sau interpolare pentru șiruri.

---

## Flux de Control

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

> Acoladele `{ }` sunt **obligatorii** chiar și pentru o singură instrucțiune.

---

## Potrivire

```zymbol
// Intervale
scor = 85
nota = ?? scor {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> nota ¶    // → B

// Șiruri
culoare = "rosu"
cod = ?? culoare {
    "rosu"   => "#FF0000"
    "verde"  => "#00FF00"
    _        => "#000000"
}

// Tipare de comparație
temp = -5
stare = ?? temp {
    < 0  => "gheata"
    < 20 => "rece"
    < 35 => "cald"
    _    => "fierbinte"
}
>> stare ¶    // → gheata

// Formă instrucțiune (brațe bloc)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negativ" ¶ }
    _    => { >> "pozitiv" ¶ }
}
```

---

## Bucle

```zymbol
@ i:0..4  { >> i " " }        // interval inclusiv:   0 1 2 3 4
@ i:1..9:2 { >> i " " }       // cu pas:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // invers:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (cât timp)

fructe = ["măr", "pară", "strugure"]
@ f:fructe { >> f ¶ }         // pentru fiecare vector

@ c:"salut" { >> c "-" }
>> ¶                          // → s-a-l-u-t-  (pentru fiecare șir)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuare
    ? i > 7 { @! }             // @! ieșire
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

// Buclă etichetată (ieșire imbricată)
contor = 0
@:extern {
    contor++
    ? contor >= 3 { @:extern! }
}
>> contor ¶                    // → 3
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

Funcțiile au **domeniu izolat** — nu pot citi variabilele externe. Folosiți parametri de ieșire `<~` pentru a modifica variabilele apelantului:

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

> Funcțiile numite sunt **valori de primă clasă** — pasați direct: `numere$> dublu`. Pentru învelit: `x -> fn(x)` este și valid.

---

## Lambda & Closure

```zymbol
dublu = x -> x * 2
suma = (a, b) -> a + b
>> dublu(5) ¶    // → 10
>> suma(3, 7) ¶    // → 10

// Lambda bloc
clasifica = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "zero"
}

// Closure — captează domeniul exterior
factor = 3
triplu = x -> x * factor
>> triplu(7) ¶    // → 21

// Fabrică
face_adunator(n) { <~ x -> x + n }
aduna10 = face_adunator(10)
>> aduna10(5) ¶    // → 15

// În vectori
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Vectori

Vectorii sunt **mutabili** și conțin elemente de **același tip**.

```zymbol
vec = [1, 2, 3, 4, 5]

x = vec[1]      // 1 — acces (1-bazat: primul element)
x = vec[-1]     // 5 — indice negativ (ultimul element)
x = vec$#       // 5 — lungime (folosiți (vec$#) în >>)

vec = vec$+ 6            // adăugare → [1,2,3,4,5,6]
vec2 = vec$+[2] 99       // inserare la poziția 2 (1-bazat)
vec3 = vec$- 3           // elimină prima apariție a valorii
vec4 = vec$-- 3          // elimină toate aparițiile
vec5 = vec$-[1]          // elimină la indicele 1 (primul element)
vec6 = vec$-[2..3]       // elimină interval (1-bazat, sfârșitul inclusiv)

are = vec$? 3            // #1 — conține
poz = vec$?? 3           // [3] — toți indicii valorii (1-bazat)
felie = vec$[1..3]       // [1,2,3] — felie (1-bazat, sfârșitul inclusiv)
felie2 = vec$[1:3]       // [1,2,3] — aceeași, sintaxă bazată pe număr

asc = vec$^+             // sortat crescător  (doar primitive)
desc = vec$^-            // sortat descrescător (doar primitive)

// Vectori de tupluri numite/poziționale — folosiți $^ cu lambda comparator
bd = [(nume: "Carla", varsta: 28), (nume: "Ana", varsta: 25), (nume: "Bob", varsta: 30)]
dupa_varsta  = bd$^ (a, b -> a.varsta < b.varsta)    // crescător după vârstă  (<)
dupa_nume    = bd$^ (a, b -> a.nume > b.nume)         // descrescător după nume (>)
>> dupa_varsta[1].nume ¶     // → Ana
>> dupa_nume[1].nume ¶       // → Carla

// Actualizare directă element (doar vectori)
vec[1] = 99              // asignare
vec[2] += 5              // compus: +=  -=  *=  /=  %=  ^=

// Actualizare funcțională — returnează un vector nou; originalul neschimbat
vec2 = vec[2]$~ 99
```

> Toți operatorii de colecție returnează un **vector nou**. Asignați înapoi: `vec = vec$+ 4`.
> `$+` poate fi înlănțuit: `vec = vec$+ 5$+ 6$+ 7`. Alți operatori folosesc asignări intermediare.
> **Indexarea este 1-bazată**: `vec[1]` este primul element; `vec[0]` este eroare la execuție.
> `$^+` / `$^-` sortează **vectori de primitive** (numere, șiruri). Pentru vectori de tupluri folosiți `$^` cu lambda comparator — direcția este codificată în lambda (`<` = crescător, `>` = descrescător).

**Semantică valoare** — asignarea unui vector la altă variabilă creează o copie independentă:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b este neafectat
```

```zymbol
// Vectori imbricați (indexare 1-bazată)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (rând 2, coloana 3)
```

---

## Destructurare

```zymbol
// Vector
vec = [10, 20, 30, 40, 50]
[a, b, c] = vec              // a=10  b=20  c=30
[primul, *rest] = vec        // primul=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ignoră

// Tuplu pozițional
punct = (100, 200)
(px, py) = punct             // px=100  py=200

// Tuplu numit
persoana = (nume: "Ana", varsta: 25, oras: "Madrid")
(nume: n, varsta: a) = persoana   // n="Ana"  a=25
```

---

## Tupluri

Tuplurile sunt containere ordonate **imuabile** care pot conține valori de **tipuri diferite**.
Spre deosebire de vectori, elementele nu pot fi modificate după creare.

```zymbol
// Pozițional — tipuri mixte permise
punct = (10, 20)
>> punct[1] ¶    // → 10

date = (42, "salut", #1, 3.14)
>> date[3] ¶     // → #1

// Numit
persoana = (nume: "Alice", varsta: 25)
>> persoana.nume ¶    // → Alice
>> persoana[1] ¶      // → Alice  (indicele funcționează și el, 1-bazat)

// Imbricat
poz = (x: 10, y: 20)
p = (poz: poz, eticheta: "origine")
>> p.poz.x ¶        // → 10
```

**Imuabilitate** — orice încercare de a modifica un element de tuplu este eroare la execuție:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ eroare la execuție: tuplurile sunt imuabile
// t[1] += 5    // ❌ aceeași eroare
```

Pentru a deriva o valoare modificată folosiți `$~` (actualizare funcțională) — returnează un **nou** tuplu:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalul neschimbat
>> t2 ¶    // → (10, 999, 30)

// Tuplu numit — reconstruiți explicit
persoana = (nume: "Alice", varsta: 25)
mai_batran  = (nume: persoana.nume, varsta: 26)
>> persoana.varsta ¶    // → 25
>> mai_batran.varsta ¶  // → 26
```

---

## Funcții de Ordin Superior

```zymbol
numere = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dublate  = numere$> (x -> x * 2)                // map  → [2,4,6…20]
pare     = numere$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = numere$< (0, (acc, x) -> acc + x)     // reduce → 55

// Înlănțuire prin intermediari
pas1 = numere$| (x -> x > 3)
pas2 = pas1$> (x -> x * x)
>> pas2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funcțiile numite pot fi pasate direct la FOSuperioare
dublu(x) { <~ x * 2 }
este_mare(x) { <~ x > 5 }
r = numere$> dublu       // ✅ referință directă
r = numere$| este_mare   // ✅ referință directă
```

---

## Operatorul Pipe

RHS necesită întotdeauna `_` ca substituent pentru valoarea trimisă prin pipe:

```zymbol
dublu = x -> x * 2
aduna = (a, b) -> a + b
inc = x -> x + 1

r1 = 5 |> dublu(_)        // → 10
r2 = 10 |> aduna(_, 5)    // → 15
r3 = 5 |> aduna(2, _)     // → 7

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
    >> "rulează întotdeauna" ¶
}
```

| Tip | Când |
|-----|------|
| `##Div` | Împărțire la zero |
| `##IO` | Fișier / sistem |
| `##Index` | Indice în afara limitelor |
| `##Type` | Nepotrivire de tip |
| `##Parse` | Parsare date |
| `##Network` | Erori de rețea |
| `##_` | Orice eroare (captare totală) |

---

## Module

```zymbol
// lib/calc.zy — corpul modulului este inclus în acolade
# calc {
    #> { aduna, get_PI }

    _PI := 3.14159
    aduna(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias necesar

>> c::aduna(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportare cu un alt nume public
# mylib {
    #> { _aduna_intern => suma }

    _aduna_intern(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::suma(3, 4) ¶    // → 7  (numele intern _aduna_intern este ascuns)
```

> **Reguli modul**: doar `#>`, definiții de funcții și inițializatori literali de variabile/constante sunt permise în `# nume { }`. Instrucțiunile executabile (`>>`, `<<`, bucle, etc.) ridică eroarea E013.

---

## Moduri Numerice

Zymbol poate afișa numere în **69 de scripturi de cifre Unicode** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Matematic Aldin, segmente LCD, și mai multe. Modul activ afectează doar ieșirea `>>`; aritmetica internă este întotdeauna binară.

### Activarea unui script

Scrieți cifrele `0` și `9` ale scriptului țintă cuprinse în `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // resetare la ASCII
```

### Ieșire și booleeni

```zymbol
x = 42
>> x ¶          // → 42   (ASCII implicit)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punctul zecimal întotdeauna ASCII)
>> 1 + 2 ¶      // → ३

// Booleeni: prefixul # întotdeauna ASCII, cifra se adaptează
>> #1 ¶         // → #१   (adevărat în Devanagari)
>> #0 ¶         // → #०   (fals — distinct de ०  zero întreg)

x = 28 > 4
>> x ¶          // → #१   (rezultatul comparației urmează modul activ)
```

### Literale cifre native în sursă

Cifrele oricărui script suportat sunt literale valide — în intervale, modulo, comparații:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literale booleene în orice script

`#` + cifra `0` sau `1` din orice bloc este un literal boolean valid:

```zymbol
#٠٩#
activ = #١        // același ca #1
>> activ ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` este **întotdeauna ASCII**. `#0` (fals) este întotdeauna distinct vizual de `0` (zero întreg) în orice script.

---

## Operatori de Date

```zymbol
// Conversii de tip
f = ##.42         // → 42.0  (la Zecimal)
i = ###3.7        // → 4     (la Întreg, rotunjire)
t = ##!3.7        // → 3     (la Întreg, trunchiere)

// Parsare șir la număr
v1 = #|"42"|      // → 42  (Întreg)
v2 = #|"3.14"|    // → 3.14  (Zecimal)
v3 = #|"abc"|     // → "abc"  (sigur la eșec, fără eroare)

// Rotunjire / trunchiere
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rotunjire la 2 zecimale)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunchiere)

// Formatare numere
fmt = #,|1234567|  // → 1,234,567  (cu virgulă)
sci = #^|12345.678|    // → 1.2345678e4  (științific)

// Literale baze
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binar)
c = 0o101        // → 'A'  (octal)

// Ieșire conversie baze
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrare Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // captează stdout (include \n final)
>> "Astăzi: " data

fisier = "date.txt"
continut = <\ cat {fisier} \>      // interpolare în comenzi

iesire = </"./subscript.zy"/>   // execută alt script Zymbol, captează ieșirea
>> iesire
```

> `><` captează argumentele CLI ca vector de șiruri (doar interpretorul arborescent).

---

## Exemplu Complet: FizzBuzz

```zymbol
clasifica(numar) {
    ? numar % 15 == 0 { <~ "FizzBuzz" }
    _? numar % 3  == 0 { <~ "Fizz" }
    _? numar % 5  == 0 { <~ "Buzz" }
    _ { <~ numar }
}

@ i:1..20 { >> clasifica(i) ¶ }
```

---

## Referință Simboluri

| Simbol | Operație | Simbol | Operație |
|--------|----------|--------|----------|
| `=` | variabilă | `$#` | lungime |
| `:=` | constantă | `$+` | adăugare (înlănțuibil) |
| `>>` | ieșire | `$+[i]` | inserare la indice (1-bazat) |
| `<<` | intrare | `$-` | elimină prima apariție |
| `¶` / `\\` | linie nouă | `$--` | elimină toate aparițiile |
| `?` | dacă | `$-[i]` | elimină la indice (1-bazat) |
| `_?` | altfel-dacă | `$-[i..j]` | elimină interval (1-bazat) |
| `_` | altfel / orice | `$?` | conține |
| `??` | potrivire | `$??` | găsește toți indicii (1-bazat) |
| `@` | buclă | `$[s..e]` | felie (1-bazat) |
| `@ N { }` | buclă de N ori | `$>` | map |
| `@!` | ieșire | `$\|` | filter |
| `@>` | continuare | `$<` | reduce |
| `@:nume { }` | buclă etichetată | `$/ delim` | împărțire șir |
| `@:nume!` | ieșire etichetă | `$++ a b c` | construire concat |
| `@:nume>` | continuare etichetă | `vec[i>j>k]` | indice navigare |
| `->` | lambda | `vec[i] = val` | actualizare element (doar vectori) |
| `vec[i] += val` | actualizare compusă | `vec[i]$~` | actualizare funcțională (copie nouă) |
| `$^+` | sortare crescătoare (primitive) | `$^-` | sortare descrescătoare (primitive) |
| `$^` | sortare cu comparator (tupluri) | `<~` | returnare |
| `\|>` | pipe | `!?` | încearcă |
| `:!` | captează | `:>` | în final |
| `#1` | adevărat | `#0` | fals |
| `$!` | este eroare | `$!!` | propagare eroare |
| `<#` | importare | `#>` | exportare |
| `#` | declarare modul | `::` | apel modul |
| `.` | acces câmp | `#?` | metadate tip |
| `#\|..\|` | parsare număr | `##.` | conversie la Zecimal |
| `###` | conversie la Întreg (rotunjire) | `##!` | conversie la Întreg (trunchiere) |
| `#.N\|..\|` | rotunjire | `#!N\|..\|` | trunchiere |
| `#,\|..\|` | format cu virgulă | `#^\|..\|` | format științific |
| `#d0d9#` | comutare mod numeric | `#09#` | resetare la ASCII |
| `<\ ..\>` | execuție shell | `>\<` | argumente CLI |
| `\ var` | distrugere explicită variabilă | `°x` / `x°` | definiție automată (auto-inițializare) |
| `>>|` | bloc TUI (ecran alternativ) | `>>~` | ieșire pozițională |
| `>>!` | curăță ecranul | `>>?` | interogare dimensiuni terminal |
| `<<\|` | tastă blocantă | `<<\|?` | tastă non-blocantă |
| `@~ N` | doarme N milisecunde | `$*` | repetare șir de N ori |

---

## Changelog Versiuni

### v0.0.5 — Primitive TUI, Definiție Automată & Repetare Șir _(Mai 2026)_

- **Modificare incompatibilă** Separator braț potrivire: `pattern : rezultat` → `pattern => rezultat`
- **Modificare incompatibilă** Alias importare: `<# cale <= alias` → `<# cale => alias`
- **Modificare incompatibilă** Redenumire exportare: `#> { fn <= pub }` → `#> { fn => pub }`
- **Adăugat** Bloc TUI `>>| { }` — ecran alternativ + mod raw; curăță la ieșire
- **Adăugat** Ieșire pozițională `>>~ (rând, col, BKS, fg, bg) > elemente` — sloturi sparse, ANSI 256 culori
- **Adăugat** Intrare tastă `<<| var` (blocant) și `<<|? var` (sondaj non-blocant)
- **Adăugat** `>>!` curăță ecranul, `>>?` interogare dimensiuni terminal, `@~ N` doarme N milisecunde
- **Adăugat** Definiție automată `°x` / `x°` — auto-inițializare variabilă la prima utilizare în bucle
- **Adăugat** Repetare șir `str $* N` — repetă un șir de N ori
- **VM** Paritate: 436/436 teste trec

### v0.0.4 — Indexare 1-Bazată, Funcții de Primă Clasă & Blocuri Module _(Aprilie 2026)_

- **Modificare incompatibilă** Toată indexarea comutată la **1-bazat** — `vec[1]` este primul element; `vec[0]` este eroare la execuție
- **Adăugat** Funcțiile numite sunt **valori de primă clasă** — pasați direct la FOSuperioare: `numere$> dublu`
- **Adăugat** **Sintaxă bloc** modul necesară: `# nume { ... }` — sintaxa plată eliminată
- **Adăugat** Indexare multi-dimensională: `vec[i>j>k]` (navigare), `vec[p ; q]` (extracție plată)
- **Adăugat** Conversii de tip: `##.expr` (Zecimal), `###expr` (Întreg rotunjire), `##!expr` (Întreg trunchiere)
- **Adăugat** Împărțire șir: `str$/ delim` — returnează `Vector(Șir)`
- **Adăugat** Construire concat: `baza$++ a b c` — adaugă mai multe elemente
- **Adăugat** Buclă de N ori: `@ N { }` — repetă exact de N ori
- **Adăugat** Sintaxă buclă etichetată: `@:nume { }`, `@:nume!`, `@:nume>` — înlocuiește `@ @nume` / `@! nume`
- **Adăugat** Reguli domeniu variabilă: variabilele `_nume` au domeniu exact de bloc; `\ var` distruge devreme
- **Adăugat** Tipare comparație potrivire: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Adăugat** Eroare modul E013: instrucțiunile executabile în corpul modulului sunt interzise
- **Corectat** `take_variable` nu mai corupe constantele modulului la scriere înapoi
- **Corectat** `alias.CONST` se rezolvă acum corect; `#>` poate apărea după definiții de funcții
- **VM** Paritate completă: 393/393 teste trec

### v0.0.3 — Sisteme Numerale Unicode & Îmbunătățiri LSP _(Aprilie 2026)_

- **Adăugat** 69 de blocuri de cifre Unicode cu token comutare mod `#d0d9#`
- **Adăugat** Literale booleene în orice script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Adăugat** Cifre Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Adăugat** Opcode VM `SetNumeralMode` — paritate completă cu interpretorul arborescent
- **Adăugat** REPL respectă modul numeric activ în eco și afișaj variabile
- **Modificat** Ieșirea `>>` booleeni include acum prefixul `#` (`#0` / `#1`) în toate modurile

### v0.0.2_01 — Redenumire Operatori _(30 Mar 2026)_

- **Modificat** `c|..|` → `#,|..|` și `e|..|` → `#^|..|` — consistent cu familia de prefix format `#`
- **Adăugat** Alias exportare: re-exportare membri modul cu un alt nume

### v0.0.2 — Reproiectare API Colecție & Instalatoare _(24 Mar 2026)_

- **Adăugat** Familie unificată de operatori `$` pentru vectori și șiruri (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Adăugat** Asignare prin destructurare pentru vectori, tupluri și tupluri numite
- **Adăugat** Indici negativi (`vec[-1]` = ultimul element)
- **Adăugat** Instalatoare native — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Adăugat** Asignare compusă `^=`
- **Corectat** Cazuri limită aritmetică parser; corecții documentație

### v0.0.1 — Lansare Publică Inițială _(22 Mar 2026)_

- Interpretor arborescent + VM registru (`--vm`, ~4× mai rapid, ~95% paritate)
- Toate construcțiile de bază: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificatori Unicode complet, sistem module, lambdas, closures, gestionare erori
- REPL, LSP, extensie VS Code, formatator (`zymbol fmt`)

---

_Zymbol-Lang — Simbolic. Universal. Imuabil._
