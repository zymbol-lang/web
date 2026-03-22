# Kompaktes Zymbol-Lang Handbuch

**Zymbol-Lang** ist eine symbolische Programmiersprache. Sie verwendet keine Schlüsselwörter — alles ist ein Symbol. Sie funktioniert in jeder menschlichen Sprache gleich.

---

## Philosophie

- Keine Schlüsselwörter (`if`, `while`, `return` existieren nicht — nur Symbole `?`, `@`, `<~`)
- Vollständiges Unicode — Bezeichner in jeder Sprache oder Emoji 👋
- Sprachagnostisch — der Code ist in allen Sprachen identisch

---

## Variablen und Konstanten

```zymbol
x = 10           // Variable (veränderlich)
PI := 3.14159    // Konstante (unveränderlich — Fehler bei Neuzuweisung)
name = "Ana"
aktiv = #1       // boolesches Wahr
👋 := "Hallo"
```

### Zusammengesetzte Zuweisung

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

## Datentypen

| Typ             | Beispiel            | Symbol `#?`  | Hinweise                            |
|-----------------|---------------------|--------------|-------------------------------------|
| Ganzzahl        | `42`, `-7`          | `###`        | 64-Bit vorzeichenbehaftet           |
| Gleitkommazahl  | `3.14`, `1.5e10`    | `##.`        | Wissenschaftliche Notation OK       |
| Zeichenkette    | `"hallo"`           | `##"`        | Interpolation: `"Hallo {name}"`     |
| Zeichen         | `'A'`               | `##'`        | Ein Unicode-Zeichen                 |
| Boolescher Wert | `#1`, `#0`          | `##?`        | NICHT die Zahlen 1 und 0            |
| Array           | `[1, 2, 3]`         | `##]`        | Alle Elemente desselben Typs        |
| Tupel           | `(a, b)`            | `##)`        | Positionell                         |
| Benanntes Tupel | `(x: 1, y: 2)`      | `##)`        | Zugriff per Name oder Index         |

---

## Ausgabe und Eingabe

```zymbol
// Ausgabe — fügt KEINEN Zeilenumbruch automatisch hinzu
>> "Hallo" ¶                    // ¶ oder \\ gibt expliziten Zeilenumbruch
>> "a=" a " b=" b ¶             // mehrere Werte durch Nebeneinanderstellung
>> "summe=" addieren(2, 3) ¶    // Funktionsaufrufe an jeder Position
>> (arr$#) ¶                    // Postfix-Operatoren brauchen Klammern

// Eingabe
<< name                         // ohne Eingabeaufforderung — liest in Variable
<< "Dein Name? " name           // mit Eingabeaufforderung
```

> `¶` oder `\\` sind gleichwertig als Zeilenumbruch.

---

## Zeichenkettenverkettung

Drei gültige Formen — jede für ihren Kontext:

```zymbol
name = "Ana"
n = 25

// 1. Komma — in Zuweisungen mit = oder :=
msg = "Hallo ", name, "!"                // → Hallo Ana!
TITEL := "Benutzer: ", name

// 2. Nebeneinanderstellung — in der Ausgabe >>
>> "Hallo " name " du bist " n ¶         // → Hallo Ana du bist 25

// 3. Interpolation — in jedem Kontext
beschr = "Hallo {name}, du bist {n}"     // → Hallo Ana, du bist 25
```

> **Hinweis**: `+` ist nur für Zahlen. Bei Zeichenketten wird eine Warnung erzeugt.

---

## Kontrollfluss

```zymbol
x = 7

// Einfaches Wenn
? x > 0 { >> "positiv" ¶ }

// Wenn / sonst wenn / sonst
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

Blöcke `{ }` sind **erforderlich**, auch für eine einzelne Zeile.

---

## Match

```zymbol
// Match mit Bereichen
note = 85
bewertung = ?? note {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> bewertung ¶    // → B

// Match mit Wächtern (beliebige Bedingungen)
temp = -5
zustand = ?? temp {
    _? temp < 0  : "Eis"
    _? temp < 20 : "kalt"
    _? temp < 35 : "warm"
    _            : "heiß"
}
>> zustand ¶    // → Eis

// Match mit Zeichenketten
farbe = "rot"
code = ?? farbe {
    "rot"  : "#FF0000"
    "grün" : "#00FF00"
    _      : "#000000"
}
>> code ¶
```

---

## Schleifen

```zymbol
// Inklusiver Bereich: 0..4 iteriert 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Bereich mit Schritt
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Umgekehrter Bereich
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Solange (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Für jedes Element
früchte = ["Apfel", "Birne", "Traube"]
@ f:früchte { >> f ¶ }

// Über Zeichen einer Zeichenkette
@ c:"hallo" { >> c "-" }
>> ¶    // → h-a-l-l-o-

// Break und Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> weitermachen
    ? i > 7 { @! }          // @! abbrechen
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funktionen

```zymbol
// Deklaration und Aufruf
addieren(a, b) { <~ a + b }
>> addieren(3, 4) ¶    // → 7

// Rekursion
fakultät(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultät(n - 1)
}
>> fakultät(5) ¶    // → 120

// Funktionen haben isolierten Gültigkeitsbereich — kein Zugriff auf externe Variablen
global = 100
testen() {
    x = 42    // nur lokal
    <~ x
}
>> testen() ¶    // → 42
```

> **Wichtig**: Benannte Funktionen `name(params){ }` sind keine erstklassigen Werte.
> Zum Übergeben als Argument einwickeln: `x -> name(x)`.

---

## Lambdas und Closures

```zymbol
// Einfaches Lambda (implizite Rückgabe)
doppelt = x -> x * 2
summe = (a, b) -> a + b
>> doppelt(5) ¶    // → 10
>> summe(3, 7) ¶   // → 10

// Lambda mit Block (explizite Rückgabe)
einordnen = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "null"
}
>> einordnen(5) ¶     // → positiv
>> einordnen(0) ¶     // → null
>> einordnen(-5) ¶    // → negativ

// Closures — Lambdas erfassen äußere Variablen
faktor = 3
dreifach = x -> x * faktor    // erfasst 'faktor'
>> dreifach(7) ¶    // → 21

// Funktionsfabrik
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas als Werte: in Arrays gespeichert
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [10, 20, 30, 40, 50]

// Zugriff (0-basierter Index)
>> arr[0] ¶    // → 10

// Länge (Klammern in >> erforderlich)
n = arr$#
>> (arr$#) ¶    // → 5

// Hinzufügen, entfernen, enthält, Ausschnitt
arr = arr$+ 60               // hinzufügen
arr = arr$- 0                // Index 0 entfernen
hat = arr$? 30               // → #1
ausschnitt = arr$[0..2]      // [20, 30]

// Element aktualisieren
arr[1] = 99

// Für jedes Element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` geben ein **neues Array** zurück — neu zuweisen: `arr = arr$+ 4`.
> Kein Verketten: zwei separate Zuweisungen verwenden.

---

## Tupel

```zymbol
// Benanntes Tupel
person = (name: "Alice", alter: 25)
>> person.name ¶    // → Alice
>> person.alter ¶   // → 25
>> person[0] ¶      // → Alice (Index funktioniert auch)
```

---

## Höherwertigen Funktionen

HOF-Operatoren benötigen ein **Inline-Lambda** — keine direkte Lambda-Variable.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
doppelte = nums$> (x -> x * 2)
>> doppelte ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
gerade = nums$| (x -> x % 2 == 0)
>> gerade ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (Anfangswert, (Akkumulator, Element) -> Ausdruck)
gesamt = nums$< (0, (acc, x) -> acc + x)
>> gesamt ¶    // → 55
```

---

## Fehlerbehandlung

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Division durch null" ¶
} :! ##IO {
    >> "IO-Fehler" ¶
} :! {
    >> "anderer Fehler: " _err ¶
} :> {
    >> "wird immer ausgeführt" ¶
}
```

| Typ         | Wann es auftritt              |
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
get_PI() { <~ _PI }
```

```zymbol
// Datei: main.zy
<# ./lib/calc <= c    // Alias erforderlich

>> c::addieren(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

---

## Vollständiges Beispiel: FizzBuzz

```zymbol
einordnen(zahl) {
    ? zahl % 15 == 0 { <~ "ZischSumm" }
    _? zahl % 3  == 0 { <~ "Zisch" }
    _? zahl % 5  == 0 { <~ "Summ" }
    _ { <~ zahl }
}

@ i:1..20 { >> einordnen(i) ¶ }
```

---

## Symbolreferenz

| Symbol  | Operation          | Symbol     | Operation             |
|---------|--------------------|------------|-----------------------|
| `=`     | Variable           | `$#`       | Länge                 |
| `:=`    | Konstante          | `$+`       | hinzufügen            |
| `>>`    | Ausgabe            | `$-`       | entfernen (per Index) |
| `<<`    | Eingabe            | `$?`       | enthält               |
| `¶`/`\` | Zeilenumbruch      | `$[s..e]`  | Ausschnitt            |
| `?`     | wenn (if)          | `$>`       | map                   |
| `_?`    | sonst wenn (elif)  | `$\|`      | filter                |
| `_`     | sonst / Platzhalter| `$<`       | reduce                |
| `??`    | match              | `!?`       | versuchen (try)       |
| `@`     | Schleife           | `:!`       | abfangen (catch)      |
| `@!`    | abbrechen (break)  | `:>`       | immer (finally)       |
| `@>`    | weitermachen       | `$!`       | ist Fehler            |
| `->`    | Lambda             | `$!!`      | Fehler weitergeben    |
| `<~`    | zurückgeben        | `#`        | Modul deklarieren     |
| `\|>`   | Pipe               | `#>`       | exportieren           |
| `#1`    | wahr               | `<#`       | importieren           |
| `#0`    | falsch             | `::`       | Modulaufruf           |

---

*Zymbol-Lang — Symbolisch. Universell. Unveränderlich.*

---

> **Hinweis:** Diese Dokumentation wurde von künstlicher Intelligenz (KI) erstellt und übersetzt.
> Es wurden alle Anstrengungen unternommen, um die Genauigkeit zu gewährleisten, aber einige Übersetzungen oder Beispiele können Fehler enthalten.
> Die maßgebliche Referenz ist die [Zymbol-Lang-Spezifikation](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
