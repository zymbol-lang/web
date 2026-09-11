> **Declinare de responsabilitate:** Acest document a fost creat și tradus de inteligență artificială (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Referința canonică este **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** în depozitul interpretorului.

---

# Manual Zymbol-Lang

> **Revizuit pentru v0.0.9 — 2026-09-07**

**Zymbol-Lang** este un limbaj de programare simbolic. Niciun cuvânt în gramatica sa — fiecare construct este un semn. Funcționează identic în orice limbă umană.

- Fără `if`, `while`, `return` — doar `?`, `@`, `<~`
- Unicode complet — identificatori în orice limbă sau emoji
- Independent de limba umană — codul este același peste tot

**Versiunea interpretorului**: v0.0.9 | **Acoperirea testelor**: 660/666 (trei motoare de acord, 0 divergente)

---

## Variabile și Constante

```zymbol
x = 10              // variabilă mutabilă
PI := 3.14159       // constantă — reatribuirea este eroare la execuție
nume = "Ana"
activ = #1          // boolean adevărat
👋 := "Bună"
```

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

`°` (semn de grad, U+00B0) inițializează automat o variabilă la valoarea sa neutră la prima utilizare:

```zymbol
numere = [3, 1, 4, 1, 5]
@ n:numere {
    °sumă += n
}
>> sumă ¶              // → 14
```

> `°variabilă` (prefix) se ancorează deasupra buclei — rezultatul este citibil după `@`.
> `variabilă°` (sufix) se ancorează în interiorul buclei — moare când bucla se termină.

O instrucțiune care este doar un nume citește variabila și aruncă valoarea, deci avertizează:

```zymbol
contor = 5
contor
```

Compilatorul avertizează astfel (mesajele sale sunt întotdeauna în engleză):

```text
warning: this statement does nothing: 'contor' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Adică: *«această instrucțiune nu face nimic: 'contor' este citit și aruncat»*.

---

## Tipuri de Date

| Tip | Literal | Etichetă `#?` | Note |
|------|---------|----------|-------|
| Întreg | `42`, `-7` | `###` | Întreg sigur: ±(2⁵³ − 1) |
| Real | `3.14`, `1.5e10` | `##.` | IEEE-754 dublu |
| Șir | `"text"` | `##"` | Interpolare: `"Bună {nume}"` |
| Caracter | `'A'` | `##'` | Un punct de cod Unicode |
| Boolean | `#1`, `#0` | `##?` | NU numeric — `#1 ≠ 1` |
| Tablou | `[1, 2, 3]` | `##]` | Un singur tip, verificat |
| Amestec declarat | `#[1, "doi"]` | `##[` | Același tip ca `[…]`, neverificat |
| Tuplu | `(a, b)` | `##)` | Pozițional, imutabil |
| Dicționar | `#(x: 1, y: 2)` | `##(` | Cu chei, mutabil |
| Funcție | referință la funcție numită | `##()` | Clasă întâi; afișează `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Clasă întâi; afișează `<lambd/N>` |
| Unitate | `##_` | `##_` | Absență — nu există null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Un întreg care iese din intervalul sigur este o eroare prinsabilă, niciodată o depășire silențioasă:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "în afara intervalului" ¶ // → în afara intervalului
}
```

`##_` este modul în care un program întreabă dacă ceva este absent:

```zymbol
nimic() { }
valoare = nimic()
>> (valoare == ##_) ¶     // → #1
```

---

## Ieșire și Intrare

```zymbol
nume = "Ana"
sumă = 3
>> "Bună" ¶             // → Bună
>> "a=" nume " b=" sumă ¶ // → a=Ana b=3
>> sumă#? ¶            // → (###, 1, 3)
```

```zymbol
<< nume
<< "Introduceți numele dvs.: " nume
<< ###(4) "Vârsta: " vârstă
```

**Priviți forma celor două semne.** `>>` indică spre exterior: scoate date din program. `<<` indică spre interior: aduce date în program. Nu este nimic de memorat aici — săgeata arată direcția în care circulă informația, iar aceeași idee revine în fiecare semn care mută ceva.

> `¶` și `\\` sunt linii noi echivalente. `>>` nu adaugă niciodată una.
> Un specificator de tip înainte de prompt validează la citire și re-solicită până când valoarea este validă:
> `##.` Real · `##.(T,D)` zecimal · `###(N)` Întreg · `##"(N)"` text · `##'` un Caracter.

La nivelul superior al unui fișier, `<~` este codul de ieșire al programului:

```zymbol
>> "verificare" ¶      // → verificare
<~ 0
```

---

## Primitive TUI

Operatori de interfață terminal pentru programe interactive. Majoritatea necesită un bloc `>>| { }` (ecran alternativ + mod brut).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Se execută"
    @~ 1000
    >>~ (2, 1) > "Terminat."
}
```

```zymbol
>>| {
    [linii, coloane] = >>?
    >>~ (1, 1) > "Terminal: " linii " x " coloane
    <<| tastă
    >>~ (2, 1) > "Apăsat: " tastă
}
```

Aici puteți vedea de ce semnele se combină în loc să se înmulțească. Știți deja că `<<` este intrare și `?` întreabă fără angajament. Un singur semn este nou:

- `|` este **o singură unitate**, nu întregul flux.

Cu asta, ambii operatori de tastatură se citesc singuri:

```text
<<        |             ?
intrare   o unitate     fără angajament

<<|   ia O tastă și așteaptă până când există una
<<|?  verifică dacă EXISTĂ o tastă și continuă dacă nu există
```

La fel pe cealaltă parte: `>>` trimite, `>>!` trimite **cu forță** (șterge întregul ecran), în timp ce `>>?` **întreabă** în loc să scrie (cât de mare este terminalul). Semnul din dreapta este cel care schimbă modul și vine întotdeauna ultimul.

> `>>!` șterge ecranul. `>>?` returnează `[linii, coloane]`. `@~ N` doarme N milisecunde.
> `<<|` citește o apăsare de tastă (blocant); `<<|?` sondează fără blocare (`'\0'` dacă nu există).
> Tastele săgeți sosesc decodate ca `'↑' '↓' '←' '→'`; ESC este punctul de cod 27.
> Tuplu de ieșire poziționată: `(linie, coloană, BKS, față, spate)` — orice poziție poate fi omisă cu o virgulă (`>>~ (,,, 196) > "roșu"`).
> Mască BKS: `1`=Aldin, `2`=Cursiv, `4`=Subliniat. Paletă ANSI 256 culori (`0`=implicit terminal).

---

## Operatori

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (împărțire întreagă)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` nu forțează niciodată: `"5" == 5` este `#0`. Ordonarea forțează: `"5" > 4` este `#1`, și `"४२" > 5` de asemenea — textul numeric în oricare dintre cele 69 de scrieri se compară ca număr.
> O funcție este egală doar cu ea însăși, niciodată cu altă funcție având același corp.

---

## Șiruri

```zymbol
nume = "Ana"
n = 42
>> "Bună " nume " ai " n ¶ // → Bună Ana ai 42
descriere = "Bună {nume}, ai {n}"
>> descriere ¶              // → Bună Ana, ai 42
```

```zymbol
s = "Bună lume"
lungime = s$#                  // 9
subșir = s$[1..4]             // "Bună"
conține = s$? "lume"          // #1
părți = "a,b,c,d"$/ ','    // [a, b, c, d]
înlocuire = s$~~["ă":"a"]        // "Buna lume"
linie = "─" $* 20
```

> `+` este doar pentru numere. Pentru șiruri folosiți alăturarea sau interpolarea.
> `\{` și `\}` sunt acolade literale — escaparea este simetrică.

---

## Flux de Control

```zymbol
x = 7
? x > 100 {
    >> "mare" ¶
} _? x > 0 {
    >> "pozitiv" ¶     // → pozitiv
} _ {
    >> "negativ" ¶
}
```

Aici sunt două semne noi, iar al treilea vine din combinarea lor:

- `?` este **întrebare**: deschide o condiție.
- `_` este **ce nu a fost specificat**: ramura rămasă când nicio întrebare nu s-a potrivit.
- `_?` este ambele în șir: *dacă nimic nu s-a potrivit, întreabă din nou*.

De aceea `_?` este scris astfel. Nu este un simbol nou de învățat — este `_` urmat de `?`, și înseamnă exact ce înseamnă cele două părți ale sale, citite în ordine.

> Acoladele `{ }` sunt **obligatorii** chiar și pentru o singură instrucțiune.

---

## Potrivire

```zymbol
punctaj = 85
notă = ?? punctaj {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> notă ¶              // → B
```

```zymbol
temperatură = -5
stare = ?? temperatură {
    < 0  => "gheață"
    < 20 => "frig"
    _    => "cald"
}
>> stare ¶              // → gheață
```

Știți deja că `?` este „a întreba". **`??` este a întreba de mai multe ori**: dublarea unui semn, oriunde în limbaj, este a face de mai multe ori ceea ce semnul face o dată. Un `?` testează o condiție; `??` testează împotriva unei liste de cazuri.

Alternativele se unesc cu `||`, și pot amesteca tipuri de șabloane:

```zymbol
tastă = 'P'
acțiune = ?? tastă {
    'p' || 'P' => "pauză"
    < 0 || > 100 => "în afara intervalului"
    _ => "ignorat"
}
>> acțiune ¶             // → pauză
```

---

## Bucle

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
fructe = ["măr", "pară", "strugure"]
@ f:fructe { >> f " " }
>> ¶                    // → măr pară strugure
@ c:"Bună" { >> c "-" }
>> ¶                    // → B-u-n-ă-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
contor = 0
@:exterior {
    contor++
    ? contor >= 3 { @:exterior! }
}
>> contor ¶             // → 3
```

`@` este semnul **timpului**: tot ce se repetă trăiește în el. Pentru a scurta acel timp adăugați un semn alături:

- `@!` — `!` este **forță**: părăsește bucla acum.
- `@>` — `>` împinge înainte: treci la următoarea iterație.
- `@:exterior!` — `:` **leagă un nume**, deci aceasta întrerupe bucla *numită* exterior, nu cea mai apropiată.

Trei operatori, și niciunul nu a trebuit memorat separat: sunt `@` plus un semn care spune deja ce face.

> **Un specificator este un număr sau o condiție.** Un `Întreg` este un număr, evaluat o dată — `@ 0` execută corpul de zero ori. Orice altceva este o condiție. Nu există veridicitate: `@ []` și `@ 3.5` sunt respinse. Pentru a parcurge o colecție folosiți `@ x:elemente`; pentru a o număra, `@ elemente$#`.

---

## Funcții

```zymbol
adună(a, b) { <~ a + b }
>> adună(3, 4) ¶        // → 7
```

```zymbol
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶       // → 120
```

O funcție citește variabilele fișierului prin valoare, iar o scriere în interior rămâne în interior:

```zymbol
limită = 100
înăuntru(n) { <~ n < limită }
>> înăuntru(42) ¶         // → #1
```

Două semne schimbă asta, și ambele sunt scrise **în semnătură și la locul apelului**:

```zymbol
mărește(contor<~) { contor = contor + 1 }
sumă = 0
mărește(sumă<~)
>> sumă ¶              // → 1
```

> `p~` este o copie de lucru — corpul o poate reatribui iar apelantul rămâne neatins.
> `p<~` este un parametru de ieșire — schimbarea călătorește înapoi. `mărește(sumă)` fără semn este o eroare semantică: adnotarea și semnătura nu pot diverge.

---

## Lambda și Închideri

```zymbol
dublează = x -> x * 2
sumă = (a, b) -> a + b
>> dublează(5) ¶          // → 10
>> sumă(3, 7) ¶          // → 10
```

```zymbol
clasifică = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "zero"
}
>> clasifică(-4) ¶         // → negativ
```

```zymbol
factor = 3
triplează = x -> x * factor
>> triplează(7) ¶          // → 21
```

```zymbol
creează_adunator(n) { <~ x -> x + n }
adună10 = creează_adunator(10)
>> adună10(5) ¶           // → 15
```

O lambda poate să nu ia niciun parametru:

```zymbol
răspuns = () -> 42
>> răspuns() ¶           // → 42
```

> O lambda captează variabilele fișierului **când este creată**; o funcție numită le citește **când este apelată**.

---

## Tablouri

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   indexarea este bazată pe 1
>> arr[-1] ¶      // → 5   negativul numără de la sfârșit
>> arr$# ¶        // → 5   lungime
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   adaugă
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  inserează la poziția 2
>> (arr$- 3) ¶          // → [1, 2]         elimină prima apariție
>> (arr$-[1]) ¶         // → [2, 3]         elimină la indexul 1
>> (arr$[1..2]) ¶       // → [1, 2]         felie, ambele capete incluse
>> (arr$? 3) ¶          // → #1             conține
```

Toate încep cu `$`, semnul **colecției**, și continuă cu un semn care spune ce se face în ea: `#` câte, `+` adaugă, `-` elimină, `?` întreabă dacă există. Și ca la `??`, dublarea semnului înseamnă a face asta exhaustiv: `$?` întreabă *dacă* o valoare este prezentă, `$??` întreabă *în câte locuri* și le returnează pe toate.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   crescător
>> (arr$^-) ¶     // → [3, 2, 1]   descrescător
```

**Regula rezultatului.** Un singur operator, iar ce face codul din jur cu el decide: folosit, **construiește** și lasă originalul neatins; aruncat, **modifică**.

```zymbol
arr = [1, 2, 3]
copie = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> copie ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` nu scrie niciodată într-o colecție.** `arr[2] = 99` nu este o formă a lui Zymbol — `=` dă o valoare unui **NUME**. Modificarea unei părți a unei colecții este `$~`, în fiecare colecție.

`[…]` conține un singur tip și este verificat; un amestec deliberat este **declarat** cu `#[…]`:

```zymbol
amestec = #[1, "doi", #1]
>> amestec ¶             // → [1, doi, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indexare Multidimensională

`>` coboară într-o structură imbricată. Un grup de paranteze adresează un element, oricât de adânc.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   rândul 2, coloana 3
>> m[-1>-1] ¶      // → 9   ultimul rând, ultima coloană
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          plat: diagonala
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   structurat: colțurile
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **nu este** o formă a lui Zymbol. Indexul înlănțuit este respins atât pentru citire cât și pentru scriere — un grup de paranteze pentru fiecare acces, iar `>` este cel care merge între pași.

---

## Dicționare

Un tuplu cu câmpuri numite este un dicționar, iar din v0.0.9 este scris `#(…)`.

```zymbol
persoană = #(nume: "Ana", vârstă: 25)
>> persoană.nume ¶        // → Ana
>> persoană["vârstă"] ¶    // → 25
```

```zymbol
persoană = #(nume: "Ana", vârstă: 25)
câmp = "nume"
>> persoană[câmp] ¶     // → Ana
```

Este mutabil, se pot adăuga chei și poate fi parcurs:

```zymbol
stoc = #(pară: 4)
stoc["măr"]$~ 10
@ k:stoc { >> k "=" stoc[k] " " }
>> ¶                    // → pară=4 măr=10
```

```zymbol
stoc = #(pară: 4, măr: 10)
@ (k, v):stoc { >> k ":" v " " }
>> ¶                    // → pară:4 măr:10
```

> `#()` este dicționarul gol, ceea ce `()` nu putea fi — ar trebui să fie și tuplul gol. `(x: 1)` simplu este respins cu acest mesaj: *a dictionary is written `#(…)`* — «un dicționar este scris `#(…)`».
> Un dicționar este adresat prin cheie, niciodată prin poziție, deci `persoană[1]` este o eroare.

---

## Tupluri

Tuplurile sunt containere ordonate **imutabile** care conțin valori de tipuri diferite.

```zymbol
punct = (10, 20)
>> punct[1] ¶           // → 10
date = (42, "Bună", #1, 3.14)
>> date[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Orice încercare de a modifica un tuplu la locul lui este o eroare, indiferent de operator — imutabilitatea este o proprietate a valorii, nu o excepție în fiecare `$`.

---

## Destructurare

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[primul, *rest] = arr
>> primul ¶            // → 10
>> rest ¶              // → [20, 30, 40, 50]
```

```zymbol
punct = (100, 200)
(px, py) = punct
>> px " " py ¶          // → 100 200
```

```zymbol
persoană = #(nume: "Ioana", vârstă: 25)
#(nume: n, vârstă: v) = persoană
>> n " " v ¶            // → Ioana 25
```

> Forma parantezelor este tipizată: `[…]` ia un tablou, `(…)` un tuplu, `#(…)` un dicționar. Ultimul nume **absoarbe restul**, deci destructurarea nu eșuează niciodată din cauza lungimii — `(a, b, c) = (1,2,3,4,5)` dă `c = (3,4,5)`, iar `##_` când nu rămâne nimic.

---

## Funcții de Ordin Superior

```zymbol
numere = [1, 2, 3, 4, 5]
>> (numere$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (numere$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (numere$< (0, (acc, x) -> acc + x)) ¶ // → 15
```

```zymbol
numere = [1, 2, 3, 4, 5, 6]
dublează(x) { <~ x * 2 }
mare(x) { <~ x > 3 }
>> (numere$> dublează) ¶    // → [2, 4, 6, 8, 10, 12]
>> (numere$| mare) ¶    // → [4, 5, 6]
```

```zymbol
bază = [#(nume: "Carla", vârstă: 28), #(nume: "Ioana", vârstă: 25)]
după_vârstă = bază$^ (a, b -> a.vârstă < b.vârstă)
>> după_vârstă[1].nume ¶     // → Ioana
```

> O funcție numită merge la HOF **fără paranteze**: `numere$> dublează`. Scrierea `numere$> (dublează)` este o eroare de parsare, deoarece `(` deschide o lambda.

---

## Operatorul Conductă

```zymbol
dublează = x -> x * 2
adună = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> dublează(_)) ¶    // → 10
>> (10 |> adună(_, 5)) ¶  // → 15
>> (5 |> dublează(_) |> inc(_)) ¶ // → 11
```

---

## Tratarea Erorilor

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "împărțire la zero" ¶  // → împărțire la zero
} :! {
    >> "altceva: " _err ¶
} :> {
    >> "rulează întotdeauna" ¶        // → rulează întotdeauna
}
```

| Tip | Când |
|------|------|
| `##Div` | Împărțire la zero |
| `##Index` | Index în afara limitelor |
| `##Key` | Cheie absentă din dicționar |
| `##Range` | În afara intervalului întreg sigur |
| `##Type` | Nepotrivire de tip |
| `##Parse` | Parsare date |
| `##IO` | Fișier / sistem |
| `##Network` | Erori de rețea |
| `##DB` | Bază de date |
| `##Time` | O dată care nu există |
| `##_` | Orice eroare (prinde tot) |

`!` este semnul **erorii și forței**, și este citit la fel în ambele familii: `$!` întreabă o valoare dacă este o eroare; `$!!`, cu semnul dublat, o propagă mai sus fără să întrebe.

> Eșecurile bibliotecii standard se întorc ca **valori de eroare moi** pe care le testați cu `$!` sau le prindeți cu `!?`, în loc să abandonе. `$!!` propagă una apelantului.

---

## Module

```zymbol
# calc {
    #> { adună, PI }

    PI := 3.14159
    adună(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::adună(5, 3) ¶
>> c.PI ¶
```

```zymbol
# biblioteca_mea {
    #> { adunare_internă => sumă }

    adunare_internă(a, b) { <~ a + b }
}
```

Cele două semne de modul sunt aceeași idee, acum aplicată fișierelor: `#` este nivelul **declarației** — ce *este* un lucru, nu cât valorează — iar săgeata spune în ce direcție călătorește codul:

```text
<#   săgeata intră: importă, adu din alt fișier
#>   săgeata iese: exportă, oferă altor fișiere
```

Un semn de direcție stă întotdeauna pe muchia orientată spre direcția în care indică. Este același motiv pentru care `<~` se întoarce la stânga (iese din funcție) iar `->` intră la dreapta (în corpul lambda-ului).

> **Un modul declară ce exportă.** Blocul `#>` este obligatoriu — omiterea lui este **E014**, iar `#> { }` este modul în care un modul spune că suprafața sa este goală. `::` apelează o funcție, `.` citește o constantă. Doar importurile, blocul de export, inițializatorii literali și definițiile de funcții pot apărea în corpul unui modul; orice este executabil este **E013**.

---

## Biblioteca Standard

Module native, importate ca oricare altele:

| Modul | Funcții |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   două glife, patru coloane
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

zi = T::of(2026, 1, 31)
>> T::format(zi, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(zi, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` măsoară **coloane de afișare**, nu caractere: CJK și majoritatea emoji sunt 2 coloane, deci aranjați un tabel cu `t::width`, niciodată cu `$#`.
> În `std/time` un moment este milisecunde de la epocă. Sub o zi este durată, de la o zi în sus este calendar — deci o lună cade în aceeași zi a lunii, limitată. `diferență(a, b)` este `a - b`, deci momentul anterior dat primul dă un răspuns negativ.

---

## Pachete

Un `.zyp` împachetează un program cu mai multe fișiere într-un singur fișier portabil. Este o arhivă de **sursă**, nu un binar, deci rulează oriunde rulează un binar `zymbol`.

```bash
zymbol package proiectul_meu/ --script main.zy -o proiectul_meu.zyp
zymbol run proiectul_meu.zyp
```

> Arhiva conține un manifest (`zyp.toml`) care declară scripturile sale de intrare și versiunea de motor necesară. `zymbol run` îl extrage într-un director temporar și rulează de acolo, deci codul este de unică folosință în timp ce ceea ce scrie scriptul ajunge în directorul dvs. de lucru real. Locul de joacă încarcă și fișiere `.zyp`.

---

## Moduri Numerice

Zymbol poate scrie numere în **69 scrieri de cifre Unicode** — Devanagari, Arab-Indic, Thai, Klingon pIqaD, Mathematical Bold, segmente LCD și altele. Modul este global pentru proces și afectează ieșirea; aritmetica nu se schimbă.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // resetare la ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Cifrele din orice scriere acceptată sunt literali valizi în sursă:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Citirea este simetrică — o cifră este înțeleasă în orice scriere:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` este întotdeauna ASCII, deci `#0` rămâne vizual distinct de cifra zero în fiecare scriere.
> `#,` și `#^` scriu de asemenea cifrele lor în scrierea activă, iar separatoarele o urmează — dar perechea nu se inversează niciodată: `,` grupează iar `.` separă, în fiecare scriere.

---

## Operatori de Date

```zymbol
f = ##.42         // la Real
i = ###3.7        // la Întreg, rotunjit  → 4
t = ##!3.7        // la Întreg, trunchiat  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Un Real este afișat ca cifre, niciodată ca exponent, și renunță la `.0` final — `##.42` scrie `42` și rămâne Real, așa cum arată `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   sigur la eșec: returnează intrarea neschimbată
>> ##!'A' ¶        // → 65    punctul de cod al unui Caracter
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          rotunjește la 2 zecimale
>> #!2|pi| ¶       // → 3.14          trunchiază la 2 zecimale
>> #,|1234567| ¶   // → 1,234,567     separatori de mii
>> #^|12345.678| ¶ // → 1.2345678e4   notație științifică
```

```zymbol
>> 0x41 ¶        // → A   hexazecimal
>> 0b01000001 ¶  // → A   binar
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   zecimal
```

> Un literal de bază în intervalul ASCII este un **Caracter**: `0d65 == 'A'` este `#1`, iar `0d65 == 65` este `#0`. Toate cele patru baze scriu același caracter.

---

## Integrare Shell

```zymbol
astăzi = <\ date +%Y-%m-%d \>
>> "Astăzi: " astăzi
```

```zymbol
ieșire = </"./subscript.zy"/>
>> ieșire
```

> `<\ … \>` capturează stdout și stderr, cu linia nouă finală eliminată.
> `>< args` capturează argumentele liniei de comandă ca un tablou de șiruri.

---

## Exemplu Complet: FizzBuzz

```zymbol
clasifică(număr) {
    ? număr % 15 == 0 { <~ "FizzBuzz" }
    _? număr % 3  == 0 { <~ "Fizz" }
    _? număr % 5  == 0 { <~ "Buzz" }
    <~ număr
}

@ i:1..20 { >> clasifică(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (unul pe linie)
```

---

## Cum se Combină Semnele

Ați văzut același lucru de-a lungul acestui manual: **un operator nu este un desen de memorat, sunt mai multe semne la rând, iar fiecare își aduce contribuția la sens.** Acum că le știți pe toate, iată modelul complet.

Mai întâi vine **în ce lume ne aflăm**:

| Semn | Lume | L-ați văzut în |
|--------|-------|----------------------------|
| `$` | o colecție | `$#` `$+` `$?` `$^-` |
| `@` | timp, tot ce se repetă | `@!` `@>` `@~` |
| `#` | ce *este* un lucru, nu valoarea lui | `#?` `#(…)` `<#` `#>` |
| `>>` | din program | `>>` `>>!` `>>?` |
| `<<` | în program | `<<` `<<\|` `<<\|?` |
| `?` | a întreba, fără angajament | `?` `_?` `??` `$?` |
| `!` | forță sau eroare | `@!` `$!` `!?` |

Apoi vine **ce se face acolo**: `+` adaugă, `-` elimină, `^` ordonează, `~` modifică, `#` numără, `|` o unitate, `:` leagă un nume.

Și două reguli care nu eșuează niciodată:

**Dublarea unui semn îl face exhaustiv.** `?` întreabă o dată, `??` testează multe cazuri. `$?` întreabă dacă o valoare este prezentă, `$??` returnează fiecare loc unde se află. `!` semnalează o eroare, `!!` o propagă fără să întrebe.

**Semnul de mod vine întotdeauna ultimul.** Când `?` sau `!` apar pentru a spune *cum* se face ceva — ezitant sau forțat — ele sunt ultimul semn al operatorului: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:exterior!`. Nu există niciodată o operație după ele.

Din asta decurge ceva practic: **o combinație pe care nu ați văzut-o niciodată are deja sens înainte să o căutați.** Dacă `$` este colecție și `^` este ordine și `-` este invers, atunci `$^-` sortează descrescător, și nimeni nu a trebuit să vă spună.

Nu întregul inventar funcționează așa, și să spui asta este mai bine decât să te prefaci. Majoritatea operatorilor se descompun curat. Șase se descompun dar înseamnă mai mult decât părțile lor: `!?` `:!` `:>` `|>` `::` `$++`. Și zece trebuie învățate pe de rost pentru că nu se descompun deloc: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Numărarea celor opaci în loc să presupunem că sunt puțini este intenționat: ei sunt costul real de memorare al limbajului. Referința completă — inventarul, homografele declarate și regulile pe care un operator nou trebuie să le îndeplinească pentru a exista — este `SYMBOLS.md`, în depozitul interpretorului.

---

## Referință Simboluri

| Simbol | Operație | Simbol | Operație |
|--------|-----------|--------|-----------|
| `=` | variabilă | `$#` | lungime |
| `:=` | constantă | `$+` | adaugă |
| `>>` | ieșire | `$+[i]` | inserează la index (bazat pe 1) |
| `<<` | intrare | `$-` | elimină primul după valoare |
| `¶` / `\\` | linie nouă | `$--` | elimină toate după valoare |
| `?` | dacă | `$-[i]` | elimină la index (bazat pe 1) |
| `_?` | altfel-dacă | `$-[i..j]` | elimină interval (bazat pe 1) |
| `_` | altfel / wildcard | `$?` | conține |
| `??` | potrivire | `$??` | găsește toate indexurile (bazat pe 1) |
| `\|\|` | sau-șablon într-o ramură de potrivire | `$[s..e]` | felie (bazat pe 1) |
| `@` | buclă | `$>` | mapare |
| `@ N { }` | buclă N ori | `$\|` | filtrare |
| `@!` | întrerupe | `$<` | reducere |
| `@>` | continuă | `$/ separator` | împarte șirul |
| `@:nume { }` | buclă etichetată | `$++ a b c` | construiește prin concatenare |
| `@:nume!` | întrerupe eticheta | `$~~[p:r]` | înlocuiește în șir |
| `@:nume>` | continuă eticheta | `$*` | repetă șirul |
| `->` | lambda | `arr[i]$~ v` | SINGURA formă de actualizare |
| `<~` | returnare / parametru de ieșire | `~` | parametru copie de lucru |
| `arr[i>j]` | index de navigare | `arr[p ; q]` | extracție plată |
| `$^+` | sortare crescătoare | `$^-` | sortare descrescătoare |
| `$^` | sortare cu comparator | `\|>` | conductă |
| `!?` | încearcă | `:!` | prinde |
| `:>` | în final | `$!` | este eroare |
| `$!!` | propagă eroarea | `#1` / `#0` | adevărat / fals |
| `##_` | Unitate — absență | `[…]` | tablou, un tip |
| `#[…]` | tablou, amestec declarat | `#(…)` | dicționar |
| `(…)` | tuplu pozițional | `#()` | dicționar gol |
| `<#` | importă | `#>` | exportă |
| `#` | declară modul | `::` | apelează modul |
| `.` | acces câmp / constantă | `#?` | metadate tip |
| `#\|..\|` | parsează număr | `##.` | convertește la Real |
| `###` | convertește la Întreg (rotunjire) | `##!` | convertește la Întreg (trunchiere) |
| `#.N\|..\|` | rotunjește | `#!N\|..\|` | trunchiază |
| `#,\|..\|` | separatori de mii | `#^\|..\|` | științific |
| `#d0d9#` | comută modul numeric | `#09#` | resetare la ASCII |
| `<\ ..\>` | execută shell | `><` | argumente CLI |
| `\ var` | distruge variabila | `°x` / `x°` | definiție fierbinte |
| `>>\|` | bloc TUI (ecran alternativ) | `>>~` | ieșire poziționată |
| `>>!` | șterge ecranul | `>>?` | interoghează dimensiunea terminalului |
| `<<\|` | apăsare de tastă blocantă | `<<\|?` | apăsare de tastă neblocantă |
| `@~ N` | doarme N milisecunde | `0d` `0x` `0o` `0b` | literali de bază |

---

## Jurnal Modificări Lansare

### v0.0.9 — Colecțiile au Decis _(septembrie 2026)_

- **Ruptură** Dicționarul are propria notație: `#(cheie: valoare)`. `(x: 1)` simplu este respins, iar `#()` este dicționarul gol — ceea ce `()` nu putea fi niciodată
- **Ruptură** Atribuirea indexată a fost retrasă: `arr[i] = v` și toate formele compuse. `=` dă o valoare unui **NUME**; modificarea unei părți a unei colecții este `$~`
- **Ruptură** Indexul înlănțuit `m[i][j]` este respins atât pentru citire cât și pentru scriere — `>` merge între pași
- **Ruptură** Un modul trebuie să declare ce exportă (**E014**); `#> { }` este modul în care un modul spune că suprafața sa este goală
- **Ruptură** Un specificator de buclă este un număr sau o condiție — fără veridicitate. `@ []` și `@ 3.5` sunt respinse
- **Adăugat** `##_` — literalul Unitate, și modul în care un program întreabă dacă ceva este absent
- **Adăugat** `#[…]` — un tablou a cărui amestec de tipuri de elemente este declarat
- **Adăugat** `#?` distinge cele patru colecții: `##]` `##[` `##)` `##(`
- **Adăugat** `std/time` — ceasul și calendarul civil, cu fusuri orare și aritmetică calendaristică
- **Adăugat** Un `<~>` la nivel superior este codul de ieșire al programului
- **Adăugat** `@ (k, v):perechi` — un șablon în antetul buclei
- **Adăugat** `#|c|` citește o cifră în oricare dintre cele 69 de scrieri; `#,` și `#^` scriu în cea activă
- **Modificat** `Întreg` este un întreg sigur, ±(2⁵³ − 1), fail-closed în fiecare motor
- **Modificat** O funcție numită citește variabilele fișierului la momentul apelului, prin valoare
- **Modificat** O instrucțiune care doar citește un nume avertizează în loc să treacă silențios
- **Motoare** 660 din 666 de fișiere corpus sunt de acord în toate cele trei motoare, 0 divergente

### v0.0.8 — Eliberare Automată, `std/term` și Pachete _(august 2026)_

- **Adăugat** Distrugere automată la ultima utilizare — invizibil; scade doar memoria de vârf
- **Adăugat** `std/term` — metrici de afișare în coloane de terminal
- **Adăugat** `##!` pe un `Caracter` — punctul său de cod Unicode
- **Adăugat** Șabloane sau în potrivire: `'p' || 'P' => …`, alternative de orice tip într-o ramură
- **Adăugat** Pachete Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Adăugat** `<~>` la locul apelului este obligatoriu unde apelatul declară un parametru de ieșire
- **Reparat** Paritate sistem de module în VM-ul de registre

### v0.0.7 — Biblioteca Standard Nativă _(iulie 2026)_

- **Adăugat** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — toate cu valori de eroare moi
- **Adăugat** Intrare tipizată/validată: `<< ##.(5,2) "preț: " p`
- **Adăugat** Operatori postfixați direct în `>>` — fără paranteze
- **Modificat** Formator fail-closed: refuză să scrie ieșire pe care nu o poate reciti

### v0.0.6 — Rafinare și Stdlib Științific _(iunie 2026)_

- **Ruptură** `=>` înlocuiește `:` în ramurile de potrivire și `<=` în aliasurile de import/export
- **Adăugat** `std/math` și `std/random`
- **Adăugat** Actualizare dicționar după cheie: `d["k"]$~ valoare`

### v0.0.5 — Primitive TUI și Definiție Fierbinte _(mai 2026)_

- **Adăugat** Bloc TUI `>>| { }`, ieșire poziționată `>>~`, intrare tastă `<<|` și `<<|?`
- **Adăugat** `>>!` șterge ecranul, `>>?` dimensiune terminal, `@~ N` somn
- **Adăugat** Definiție fierbinte `°x` / `x°`, și repetare șir `$*`

### v0.0.4 — Indexare Bazată pe 1 și Funcții de Clasă Întâi _(aprilie 2026)_

- **Ruptură** Toată indexarea este **bazată pe 1** — `arr[1]` este primul element
- **Adăugat** Funcții numite ca valori de clasă întâi; sintaxă bloc modul `# nume { }`
- **Adăugat** Indexare multidimensională `arr[i>j>k]` și extracție plată `arr[p ; q]`

### v0.0.3 — Sisteme Numerice Unicode _(aprilie 2026)_

- **Adăugat** 69 blocuri de cifre Unicode cu token de comutare mod `#d0d9#`
- **Adăugat** Literali booleeni în orice scriere — `#१` / `#०`

### v0.0.2 — Reproiectare API Colecții _(martie 2026)_

- **Adăugat** Familia de operatori `$` pentru tablouri și șiruri
- **Adăugat** Atribuire prin destructurare și indici negativi

### v0.0.1 — Prima Lansare Publică _(martie 2026)_

- Interpretor cu parcurgere de arbore + VM de registre (`--vm`)
- Toate constructele de bază: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificatori Unicode complet, sistem de module, lambda, închideri, tratarea erorilor
- REPL, LSP, extensie VS Code, formator (`zymbol fmt`)

---

_Zymbol-Lang — Simbolic. Universal. Imutabil._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licență:** acest manual este licențiat sub [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Text complet: `LICENSE-CC-BY-SA-4.0` în <https://github.com/zymbol-lang/web>. Interpretorul și motorul de browser (`zymbol.js`) sunt lucrări separate, licențiate sub AGPL-3.0-only.
