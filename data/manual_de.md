# Zymbol-Lang Handbuch

**Zymbol-Lang** ist eine symbolische Programmiersprache. Keine Schlüsselwörter — alles ist ein Symbol. Funktioniert in jeder menschlichen Sprache gleich.

- Kein `if`, `while`, `return` — nur `?`, `@`, `<~`
- Vollständiges Unicode — Bezeichner in jeder Sprache oder Emoji
- Sprachagnostisch — der Code ist in allen Sprachen identisch

---

## Variablen und Konstanten

```zymbol
x = 10              // veränderliche Variable
PI := 3.14159       // Konstante — Neuzuweisung ist ein Laufzeitfehler
name = "Alice"
aktiv = #1          // boolesches Wahr
👋 := "Hallo"
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

## Datentypen

| Typ             | Literal             | `#?`-Tag | Hinweise                       |
|-----------------|---------------------|----------|-------------------------------|
| Int             | `42`, `-7`          | `###`    | 64-Bit vorzeichenbehaftet     |
| Float           | `3.14`, `1.5e10`    | `##.`    | Wissenschaftliche Notation OK |
| String          | `"text"`            | `##"`    | Interpolation: `"Hallo {name}"`|
| Char            | `'A'`               | `##'`    | Ein Unicode-Zeichen           |
| Bool            | `#1`, `#0`          | `##?`    | NICHT numerisch — `#1 ≠ 1`   |
| Array           | `[1, 2, 3]`         | `##]`    | Homogene Elemente             |
| Tupel           | `(a, b)`            | `##)`    | Positionell                   |
| Benanntes Tupel | `(x: 1, y: 2)`      | `##)`    | Benannte Felder               |

```zymbol
// Typinspektion — gibt (Typ, Stellen, Wert) zurück
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Ausgabe und Eingabe

```zymbol
>> "Hallo" ¶                      // ¶ oder \\ für expliziten Zeilenumbruch
>> "a=" a " b=" b ¶               // Juxtaposition — mehrere Werte
>> (arr$#) ¶                      // Postfix-Operatoren brauchen ( ) in >>

<< name                           // ohne Eingabeaufforderung — liest in Variable
<< "Dein Name: " name             // mit Eingabeaufforderung
```

> `¶` (AltGr+R auf Spanischer Tastatur) und `\\` sind gleichwertige Zeilenumbrüche.

---

## Operatoren

```zymbol
// Arithmetik
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (Ganzzahldivision)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (Potenz)

// Vergleich
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logik
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Zeichenketten

```zymbol
// Drei Verkettungsformen
name = "Alice"
n = 42

msg = "Hallo ", name, "!"            // Komma — in Zuweisungen
>> "Hallo " name " du hast " n ¶    // Juxtaposition — in >>
desc = "Hallo {name}, du hast {n}"  // Interpolation — überall
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (Ende exklusiv)
hat = s$? "World"          // #1
teile = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (nur erste N)
```

> `+` ist nur für Zahlen. Für Zeichenketten `,`, Juxtaposition oder Interpolation verwenden.

---

## Kontrollfluss

```zymbol
x = 7

? x > 0 { >> "positiv" ¶ }

? x > 100 {
    >> "groß" ¶
} _? x > 0 {
    >> "positiv" ¶
} _? x == 0 {
    >> "null" ¶
} _ {
    >> "negativ" ¶
}
```

> Blöcke `{ }` sind **erforderlich**, auch für eine einzelne Anweisung.

---

## Match

```zymbol
// Bereiche
note = 85
bewertung = ?? note {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> bewertung ¶    // → B

// Zeichenketten
farbe = "rot"
code = ?? farbe {
    "rot"   : "#FF0000"
    "grün"  : "#00FF00"
    _       : "#000000"
}

// Wächter
temp = -5
zustand = ?? temp {
    _? temp < 0  : "Eis"
    _? temp < 20 : "kalt"
    _? temp < 35 : "warm"
    _            : "heiß"
}
>> zustand ¶    // → Eis

// Anweisungsform (Block-Zweige)
?? n {
    0        : { >> "null" ¶ }
    _? n < 0 : { >> "negativ" ¶ }
    _        : { >> "positiv" ¶ }
}
```

---

## Schleifen

```zymbol
@ i:0..4  { >> i " " }        // Bereich inklusiv:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // mit Schritt:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // rückwärts:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

früchte = ["Apfel", "Birne", "Traube"]
@ f:früchte { >> f ¶ }        // für jedes Element

@ c:"hallo" { >> c "-" }
>> ¶                          // → h-a-l-l-o-  (über Zeichenkette)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> weitermachen
    ? i > 7 { @! }             // @! abbrechen
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Endlosschleife
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Beschriftete Schleife (verschachtelter Break)
anzahl = 0
@ @äußere {
    anzahl++
    ? anzahl >= 3 { @! äußere }
}
>> anzahl ¶                   // → 3
```

---

## Funktionen

```zymbol
addieren(a, b) { <~ a + b }
>> addieren(3, 4) ¶    // → 7

fakultät(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultät(n - 1)
}
>> fakultät(5) ¶    // → 120
```

Funktionen haben **isolierten Gültigkeitsbereich** — sie können keine äußeren Variablen lesen. Ausgabeparameter `<~` verwenden, um Aufrufervariablen zu ändern:

```zymbol
tauschen(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
tauschen(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Benannte Funktionen sind keine erstklassigen Werte. Zum Übergeben als Argument einwickeln: `x -> fn(x)`.

---

## Lambdas und Closures

```zymbol
doppelt = x -> x * 2
summe = (a, b) -> a + b
>> doppelt(5) ¶    // → 10
>> summe(3, 7) ¶   // → 10

// Block-Lambda
einordnen = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "null"
}

// Closure — erfasst äußeren Gültigkeitsbereich
faktor = 3
dreifach = x -> x * faktor
>> dreifach(7) ¶    // → 21

// Fabrik
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In Arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — Zugriff (0-basiert)
arr[-1]         // 5 — negativer Index (letztes Element)
arr$#           // 5 — Länge (in >> Klammern verwenden: (arr$#))

arr = arr$+ 6            // anhängen → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // an Index 2 einfügen
arr3 = arr$- 3           // erstes Vorkommen des Wertes entfernen
arr4 = arr$-- 3          // alle Vorkommen entfernen
arr5 = arr$-[0]          // an Index entfernen
arr6 = arr$-[1..3]       // Bereich entfernen (Ende exklusiv)

hat = arr$? 3            // #1 — enthält
pos = arr$?? 3           // [2] — alle Indizes des Wertes
sl = arr$[0..3]          // [1,2,3] — Ausschnitt (Ende exklusiv)
sl2 = arr$[0:3]          // [1,2,3] — gleich, zählbasierte Syntax

asc = arr$^+             // aufsteigend sortiert  (nur Primitive)
desc = arr$^-            // absteigend sortiert   (nur Primitive)

// Benannte/positionelle Tupel-Arrays — $^ mit Vergleichs-Lambda verwenden
db = [(name: "Carla", alter: 28), (name: "Ana", alter: 25), (name: "Bob", alter: 30)]
nach_alter = db$^ (a, b -> a.alter < b.alter)     // aufsteigend nach Alter (<)
nach_name  = db$^ (a, b -> a.name > b.name)       // absteigend nach Name (>)
>> nach_alter[0].name ¶     // → Ana
>> nach_name[0].name ¶      // → Carla

arr[1] = 99              // direkt aktualisieren
arr = arr[1]$~ 99        // funktionale Aktualisierung — gibt neues Array zurück
```

> Alle Kollektionsoperatoren geben ein **neues Array** zurück. Neu zuweisen: `arr = arr$+ 4`.
> Operatoren können nicht verkettet werden — Zwischenzuweisungen verwenden.
> `$^+` / `$^-` sortieren **primitive Arrays** (Zahlen, Zeichenketten). Für Tupel-Arrays `$^` mit Vergleichs-Lambda verwenden — Richtung ist in der Lambda kodiert (`<` = aufsteigend, `>` = absteigend).

```zymbol
// Verschachtelte Arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Destrukturierung

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[erstes, *rest] = arr        // erstes=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ verwirft

// Positionelles Tupel
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Benanntes Tupel
person = (name: "Ana", alter: 25, stadt: "Berlin")
(name: n, alter: a) = person   // n="Ana"  a=25
```

---

## Tupel

```zymbol
// Positionell
punkt = (10, 20)
>> punkt[0] ¶    // → 10

// Benannt
person = (name: "Alice", alter: 25)
>> person.name ¶    // → Alice
>> person[0] ¶      // → Alice  (Index funktioniert auch)

// Verschachtelt
pos = (x: 10, y: 20)
p = (pos: pos, bezeichnung: "Ursprung")
>> p.pos.x ¶        // → 10
```

---

## Höherwertige Funktionen

> HOF-Operatoren benötigen ein **Inline-Lambda** — Lambda-Variablen können nicht direkt übergeben werden.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdoppelt = nums$> (x -> x * 2)                // map  → [2,4,6…20]
gerade     = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
gesamt     = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Verketten über Zwischenwerte
schritt1 = nums$| (x -> x > 3)
schritt2 = schritt1$> (x -> x * x)
>> schritt2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Benannte Funktionen in HOF — in Lambda einwickeln
doppelt(x) { <~ x * 2 }
r = nums$> (x -> doppelt(x))    // ✅
```

---

## Pipe-Operator

Die rechte Seite erfordert immer `_` als Platzhalter für den weitergeleiteten Wert:

```zymbol
doppelt = x -> x * 2
addieren = (a, b) -> a + b
inc = x -> x + 1

5 |> doppelt(_)        // → 10
10 |> addieren(_, 5)   // → 15
5 |> addieren(2, _)    // → 7

// Verkettet
r = 5 |> doppelt(_) |> inc(_) |> doppelt(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fehlerbehandlung

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Division durch null" ¶
} :! {
    >> "anderer Fehler: " _err ¶    // _err enthält die Fehlermeldung
} :> {
    >> "wird immer ausgeführt" ¶
}
```

| Typ         | Wann                          |
|-------------|-------------------------------|
| `##Div`     | Division durch null            |
| `##IO`      | Datei / System                 |
| `##Index`   | Index außerhalb des Bereichs   |
| `##Type`    | Typfehler                      |
| `##Parse`   | Parsing-Fehler                 |
| `##Network` | Netzwerkfehler                 |
| `##_`       | Jeder Fehler (catch-all)       |

---

## Module

```zymbol
// Datei: lib/calc.zy
# calc

#> { addieren, get_PI }    // Exporte VOR den Definitionen

_PI := 3.14159
addieren(a, b) { <~ a + b }
get_PI() { <~ _PI }   // Getter — direkter Konstantenzugriff per Alias nicht möglich
```

```zymbol
// Datei: main.zy
<# ./lib/calc <= c    // Alias erforderlich

>> c::addieren(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

```zymbol
// Export mit anderem öffentlichen Namen
# meinlib
#> { _intern_addieren <= summe }

_intern_addieren(a, b) { <~ a + b }
```

```zymbol
<# ./meinlib <= m

>> m::summe(3, 4) ¶    // → 7  (interner Name _intern_addieren ist verborgen)
```

---

## Datenoperatoren

```zymbol
// Zeichenkette in Zahl umwandeln
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (sicher, kein Fehler)

// Runden / Abschneiden
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (auf 2 Dezimalstellen runden)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (abschneiden)

// Zahlenformatierung
fmt = #,|1234567|      // → 1,234,567  (mit Trennzeichen)
wiss = #^|12345.678|   // → 1.2345678e4  (wissenschaftlich)

// Basis-Literale
a = 0x41         // → 'A'  (hexadezimal)
b = 0b01000001   // → 'A'  (binär)
c = 0o101        // → 'A'  (oktal)

// Basiskonvertierung
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dez = 0d|255|    // → "0d0255"
```

---

## Shell-Integration

```zymbol
datum = <\ date +%Y-%m-%d \>     // stdout erfassen (inkl. nachgestelltem \n)
>> "Heute: " datum

datei = "data.txt"
inhalt = <\ cat {datei} \>       // Interpolation in Befehlen

ausgabe = </"./skript.zy"/>      // anderes Zymbol-Skript ausführen, Ausgabe erfassen
>> ausgabe
```

> `><` erfasst CLI-Argumente als String-Array (nur Tree-Walker).

---

## Vollständiges Beispiel: FizzBuzz

```zymbol
einordnen(zahl) {
    ? zahl % 15 == 0 { <~ "FizzBuzz" }
    _? zahl % 3  == 0 { <~ "Fizz" }
    _? zahl % 5  == 0 { <~ "Buzz" }
    _ { <~ zahl }
}

@ i:1..20 { >> einordnen(i) ¶ }
```

---

## Symbolreferenz

| Symbol  | Operation                          | Symbol        | Operation                    |
|---------|------------------------------------|---------------|------------------------------|
| `=`     | Variable                           | `$#`          | Länge                        |
| `:=`    | Konstante                          | `$+`          | anhängen                     |
| `>>`    | Ausgabe                            | `$+[i]`       | an Index einfügen            |
| `<<`    | Eingabe                            | `$-`          | erstes Vorkommen entfernen   |
| `¶`/`\\`| Zeilenumbruch                      | `$--`         | alle Vorkommen entfernen     |
| `?`     | wenn (if)                          | `$-[i]`       | an Index entfernen           |
| `_?`    | sonst wenn (elif)                  | `$-[i..j]`    | Bereich entfernen            |
| `_`     | sonst / Platzhalter                | `$?`          | enthält                      |
| `??`    | match                              | `$??`         | alle Indizes des Wertes      |
| `@`     | Schleife                           | `$[s..e]`     | Ausschnitt                   |
| `@!`    | abbrechen (break)                  | `$>`          | map                          |
| `@>`    | weitermachen (continue)            | `$\|`         | filter                       |
| `->`    | Lambda                             | `$<`          | reduce                       |
| `$^+`   | aufsteigend sortieren (Primitive)  | `$^-`         | absteigend sortieren         |
| `$^`    | sortieren mit Vergleichs-Lambda    |               |                              |
| `<~`    | zurückgeben (return)               | `!?`          | versuchen (try)              |
| `\|>`   | Pipe                               | `:!`          | abfangen (catch)             |
| `#1`    | wahr                               | `:>`          | immer (finally)              |
| `#0`    | falsch                             | `$!`          | ist Fehler                   |
| `<#`    | importieren                        | `$!!`         | Fehler weitergeben           |
| `#`     | Modul deklarieren                  | `#>`          | exportieren                  |
| `::`    | Modulaufruf                        | `.`           | Feldzugriff                  |
| `#\|..\|` | Zahl parsen                      | `#?`          | Typ-Metadaten                |
| `#.N\|..\|` | runden                         | `#!N\|..\|`   | abschneiden                  |
| `c\|..\|` | Kommaformat                      | `e\|..\|`     | wissenschaftlich             |
| `<\ ..\>` | Shell-Befehl                     | `>\<`         | CLI-Argumente                |

---

> **Hinweis:** Diese Dokumentation wurde von künstlicher Intelligenz (KI) erstellt und übersetzt.
> Es wurden alle Anstrengungen unternommen, um die Genauigkeit zu gewährleisten, aber einige Übersetzungen oder Beispiele können Fehler enthalten.
> Die maßgebliche Referenz ist die [Zymbol-Lang-Spezifikation](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
