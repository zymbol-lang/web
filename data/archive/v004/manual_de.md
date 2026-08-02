> **Hinweis:** Diese Dokumentation wurde mit Unterstützung von künstlicher Intelligenz (KI) erstellt und übersetzt.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Die maßgebliche Referenz ist **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** im Interpreter-Repository.

---

# Zymbol-Lang Handbuch

**Zymbol-Lang** ist eine symbolische Programmiersprache. Keine Schlüsselwörter — alles sind Symbole. Funktioniert identisch in jeder menschlichen Sprache.

- Kein `if`, `while`, `return` — nur `?`, `@`, `<~`
- Vollständiges Unicode — Bezeichner in jeder Sprache oder als Emoji
- Sprachunabhängig — der Code ist überall gleich

**Interpreter-Version**: v0.0.4 | **Testabdeckung**: 393/393 (Parität TW ↔ VM)

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

---

## Datentypen

| Typ | Literal | `#?`-Tag | Hinweise |
|-----|---------|----------|----------|
| Ganzzahl | `42`, `-7` | `###` | 64-Bit-Vorzeichen |
| Gleitkomma | `3.14`, `1.5e10` | `##.` | Wissenschaftliche Notation OK |
| Zeichenkette | `"text"` | `##"` | Interpolation: `"Hallo {name}"` |
| Zeichen | `'A'` | `##'` | Einzelnes Unicode-Zeichen |
| Boolesch | `#1`, `#0` | `##?` | NICHT numerisch — `#1 ≠ 1` |
| Feld | `[1, 2, 3]` | `##]` | Homogene Elemente |
| Tupel | `(a, b)` | `##)` | Positionsbezogen |
| Benanntes Tupel | `(x: 1, y: 2)` | `##)` | Benannte Felder |
| Funktion | benannte Funktionsreferenz | `##()` | Erstklassig; Anzeige `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Erstklassig; Anzeige `<lambd/N>` |

```zymbol
// Typinspektion — gibt (Typ, Stellen, Wert) zurück
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Ausgabe und Eingabe

```zymbol
>> "Hallo Welt" ¶                 // ¶ oder \\ für expliziten Zeilenumbruch
>> "a=" a " b=" b ¶               // Juxtaposition — mehrere Werte
>> (arr$#) ¶                      // Postfix-Operatoren benötigen ( ) in >>

<< name                           // in Variable einlesen (ohne Eingabeaufforderung)
<< "Namen eingeben: " name        // mit Eingabeaufforderung
```

> `¶` (AltGr+R auf spanischer Tastatur) und `\\` sind äquivalente Zeilenumbrüche.

---

## Operatoren

```zymbol
// Arithmetik — Zuweisungen verwenden; einige Operatoren haben Eigenheiten direkt in >>
a = 10
b = 3
ergebnis1 = a + b    // 13
ergebnis2 = a - b    // 7
ergebnis3 = a * b    // 30
ergebnis4 = a / b    // 3  (Ganzzahldivision)
ergebnis5 = a % b    // 1
ergebnis6 = a ^ b    // 1000  (Potenzierung)

// Vergleich
a == b    // #0
a <> b    // #1
a < b      // #0
a <= b    // #0
a > b      // #1
a >= b     // #1

// Logisch
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Zeichenketten

```zymbol
// Zwei Verkettungsformen
name = "Alice"
n = 42

>> "Hallo " name " du hast " n ¶     // Juxtaposition — in >>
beschr = "Hallo {name}, du hast {n}" // Interpolation — überall
```

```zymbol
s = "Hallo Welt"
len = s$#                  // 10
sub = s$[1..5]             // "Hallo"  (1-basiert, Ende inklusive)
hat = s$? "Welt"           // #1
teile = "a,b,c,d"$/ ','   // [a, b, c, d]  (Trennung nach Trennzeichen)
ers = s$~~["l":"L"]        // "HaLLo WeLt"
ers1 = s$~~["l":"L":1]    // "HaLlo Welt"  (nur erste N)
```

> `+` ist nur für Zahlen. Verwende `,`, Juxtaposition oder Interpolation für Zeichenketten.

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

> `{ }` geschweifte Klammern sind **erforderlich**, auch bei einer einzelnen Anweisung.

---

## Match

```zymbol
// Bereiche
punkte = 85
note = ?? punkte {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> note ¶    // → B

// Zeichenketten
farbe = "rot"
code = ?? farbe {
    "rot"   : "#FF0000"
    "gruen" : "#00FF00"
    _       : "#000000"
}

// Vergleichsmuster
temp = -5
zustand = ?? temp {
    < 0  : "eis"
    < 20 : "kalt"
    < 35 : "warm"
    _    : "heiss"
}
>> zustand ¶    // → eis

// Anweisungsform (Block-Arme)
?? n {
    0       : { >> "null" ¶ }
    _? n < 0: { >> "negativ" ¶ }
    _       : { >> "positiv" ¶ }
}
```

---

## Schleifen

```zymbol
@ i:0..4  { >> i " " }        // Bereich inklusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // mit Schritt:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // rückwärts:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruechte = ["Apfel", "Birne", "Traube"]
@ f:fruechte { >> f ¶ }       // für jedes Feldelement

@ c:"hallo" { >> c "-" }
>> ¶                          // → h-a-l-l-o-  (für jedes Zeichen)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> weiter
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

// Benannte Schleife (verschachtelter Abbruch)
zaehler = 0
@:aussen {
    zaehler++
    ? zaehler >= 3 { @:aussen! }
}
>> zaehler ¶                  // → 3
```

---

## Funktionen

```zymbol
addieren(a, b) { <~ a + b }
>> addieren(3, 4) ¶    // → 7

fakultaet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultaet(n - 1)
}
>> fakultaet(5) ¶    // → 120
```

Funktionen haben **isolierten Geltungsbereich** — sie können keine äußeren Variablen lesen. Verwende Ausgabeparameter `<~`, um Variablen des Aufrufers zu ändern:

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

> Benannte Funktionen sind **erstklassige Werte** — direkt übergeben: `zahlen$> verdoppeln`. Zum Einwickeln: `x -> fn(x)` ist ebenfalls gültig.

---

## Lambdas und Closures

```zymbol
verdoppeln = x -> x * 2
summe = (a, b) -> a + b
>> verdoppeln(5) ¶    // → 10
>> summe(3, 7) ¶      // → 10

// Block-Lambda
klassifizieren = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "null"
}

// Closure — erfasst äußeren Geltungsbereich
faktor = 3
dreifach = x -> x * faktor
>> dreifach(7) ¶    // → 21

// Fabrik
erstelle_addierer(n) { <~ x -> x + n }
add10 = erstelle_addierer(10)
>> add10(5) ¶    // → 15

// In Feldern
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Felder

Felder sind **veränderlich** und enthalten Elemente des **gleichen Typs**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — Zugriff (1-basiert: erstes Element)
arr[-1]         // 5 — negativer Index (letztes Element)
arr$#           // 5 — Länge (verwende (arr$#) in >>)

arr = arr$+ 6            // anhängen → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // einfügen an Position 2 (1-basiert)
arr3 = arr$- 3           // erstes Vorkommen des Werts entfernen
arr4 = arr$-- 3          // alle Vorkommen entfernen
arr5 = arr$-[1]          // an Index 1 entfernen (erstes Element)
arr6 = arr$-[2..3]       // Bereich entfernen (1-basiert, Ende inklusive)

hat = arr$? 3            // #1 — enthält
pos = arr$?? 3           // [3] — alle Indizes des Werts (1-basiert)
ausschn = arr$[1..3]     // [1,2,3] — Ausschnitt (1-basiert, Ende inklusive)
ausschn2 = arr$[1:3]     // [1,2,3] — gleich, anzahlbasierte Syntax

aufst = arr$^+           // aufsteigend sortiert  (nur Primitive)
abst = arr$^-            // absteigend sortiert   (nur Primitive)

// Benannte/positionelle Tupel-Felder — $^ mit Vergleichs-Lambda verwenden
db = [(name: "Carla", alter: 28), (name: "Ana", alter: 25), (name: "Bob", alter: 30)]
nach_alter = db$^ (a, b -> a.alter < b.alter)     // aufsteigend nach Alter (<)
nach_name  = db$^ (a, b -> a.name > b.name)       // absteigend nach Name (>)
>> nach_alter[1].name ¶     // → Ana
>> nach_name[1].name ¶      // → Carla

// Direktes Element-Update (nur Felder)
arr[1] = 99              // zuweisen
arr[2] += 5              // zusammengesetzt: +=  -=  *=  /=  %=  ^=

// Funktionales Update — gibt ein neues Feld zurück; Original unverändert
arr2 = arr[2]$~ 99
```

> Alle Sammlungsoperatoren geben ein **neues Feld** zurück. Zurückzuweisen: `arr = arr$+ 4`.
> `$+` ist verkettbar: `arr = arr$+ 5$+ 6$+ 7`. Andere Operatoren verwenden Zwischenzuweisungen.
> **Indizierung ist 1-basiert**: `arr[1]` ist das erste Element; `arr[0]` ist ein Laufzeitfehler.
> `$^+` / `$^-` sortiert **primitive Felder** (Zahlen, Zeichenketten). Für Tupel-Felder `$^` mit Vergleichs-Lambda verwenden — Richtung wird im Lambda kodiert (`<` = aufsteigend, `>` = absteigend).

**Wertsemantik** — eine Zuweisung eines Feldes an eine andere Variable erzeugt eine unabhängige Kopie:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ist nicht betroffen
```

```zymbol
// Verschachtelte Felder (1-basierte Indizierung)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (Zeile 2, Spalte 3)
```

---

## Destrukturierung

```zymbol
// Feld
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[erstes, *rest] = arr        // erstes=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ verwirft

// Positionelles Tupel
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Benanntes Tupel
person = (name: "Ana", alter: 25, stadt: "Berlin")
(name: n, alter: a) = person // n="Ana"  a=25
```

---

## Tupel

Tupel sind **unveränderliche** geordnete Container, die Werte **verschiedener Typen** enthalten können.
Im Gegensatz zu Feldern können Elemente nach der Erstellung nicht geändert werden.

```zymbol
// Positionell — gemischte Typen erlaubt
punkt = (10, 20)
>> punkt[1] ¶    // → 10

daten = (42, "hallo", #1, 3.14)
>> daten[3] ¶     // → #1

// Benannt
person = (name: "Alice", alter: 25)
>> person.name ¶    // → Alice
>> person[1] ¶      // → Alice  (Index funktioniert auch, 1-basiert)

// Verschachtelt
pos = (x: 10, y: 20)
p = (pos: pos, bezeichner: "ursprung")
>> p.pos.x ¶        // → 10
```

**Unveränderlichkeit** — jeder Versuch, ein Tupel-Element zu ändern, ist ein Laufzeitfehler:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ Laufzeitfehler: Tupel sind unveränderlich
// t[1] += 5    // ❌ gleicher Fehler
```

Um einen abgeleiteten Wert zu erhalten, verwende `$~` (funktionales Update) — gibt ein **neues** Tupel zurück:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← Original unverändert
>> t2 ¶    // → (10, 999, 30)

// Benanntes Tupel — explizit neu aufbauen
person = (name: "Alice", alter: 25)
aelter  = (name: person.name, alter: 26)
>> person.alter ¶    // → 25
>> aelter.alter ¶    // → 26
```

---

## Höhere Funktionen

```zymbol
zahlen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdoppelt = zahlen$> (x -> x * 2)               // map  → [2,4,6…20]
gerade     = zahlen$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
gesamt     = zahlen$< (0, (akk, x) -> akk + x)   // reduce → 55

// Verkettung über Zwischenschritte
schritt1 = zahlen$| (x -> x > 3)
schritt2 = schritt1$> (x -> x * x)
>> schritt2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Benannte Funktionen können direkt an höhere Funktionen übergeben werden
verdoppeln(x) { <~ x * 2 }
ist_gross(x) { <~ x > 5 }
ergebnis = zahlen$> verdoppeln    // ✅ direkte Referenz
ergebnis = zahlen$| ist_gross     // ✅ direkte Referenz
```

---

## Pipe-Operator

Die rechte Seite erfordert immer `_` als Platzhalter für den weitergeleiteten Wert:

```zymbol
verdoppeln = x -> x * 2
addieren = (a, b) -> a + b
erhoehen = x -> x + 1

5 |> verdoppeln(_)        // → 10
10 |> addieren(_, 5)      // → 15
5 |> addieren(2, _)       // → 7

// Verkettet
ergebnis = 5 |> verdoppeln(_) |> erhoehen(_) |> verdoppeln(_)
>> ergebnis ¶    // → 22  (5→10→11→22)
```

---

## Fehlerbehandlung

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Division durch null" ¶
} :! {
    >> "sonstiger Fehler: " _err ¶    // _err enthält die Fehlermeldung
} :> {
    >> "wird immer ausgeführt" ¶
}
```

| Typ | Wann |
|-----|------|
| `##Div` | Division durch null |
| `##IO` | Datei / System |
| `##Index` | Index außerhalb des Bereichs |
| `##Type` | Typfehler |
| `##Parse` | Daten-Parsing |
| `##Network` | Netzwerkfehler |
| `##_` | Beliebiger Fehler (Sammelklausel) |

---

## Module

```zymbol
// lib/rechner.zy — Modulrumpf ist in geschweifte Klammern eingeschlossen
# rechner {
    #> { addieren, get_PI }

    _PI := 3.14159
    addieren(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// haupt.zy
<# ./lib/rechner <= r    // Alias erforderlich

>> r::addieren(5, 3) ¶   // → 8
pi = r::get_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Export unter einem anderen öffentlichen Namen
# meinelib {
    #> { _interner_addierer <= summe }

    _interner_addierer(a, b) { <~ a + b }
}
```

```zymbol
<# ./meinelib <= m

>> m::summe(3, 4) ¶    // → 7  (interner Name _interner_addierer ist versteckt)
```

> **Modulregeln**: Nur `#>`, Funktionsdefinitionen und literale Variablen-/Konstanteninitialisierungen sind innerhalb von `# name { }` erlaubt. Ausführbare Anweisungen (`>>`, `<<`, Schleifen usw.) lösen Fehler E013 aus.

---

## Numerische Systeme

Zymbol kann Zahlen in **69 Unicode-Ziffernskripten** anzeigen — Devanagari, Arabisch-Indisch, Thailändisch, Klingonisches pIqaD, Mathematisch Fett, LCD-Segmente und mehr. Der aktive Modus beeinflusst nur die `>>`-Ausgabe; die interne Arithmetik ist immer binär.

### Ein System aktivieren

Schreibe die Ziffern `0` und `9` des Zielskripts eingeschlossen in `#…#`:

```zymbol
#०९#    // Devanagari       (U+0966–U+096F)
#٠٩#    // Arabisch-Indisch (U+0660–U+0669)
#๐๙#    // Thailändisch     (U+0E50–U+0E59)
#09#    // auf ASCII zurücksetzen
```

Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9) wird ebenfalls unterstützt und kann auf dieselbe Weise aktiviert werden.

### Ausgabe und Boolesche Werte

```zymbol
x = 42
>> x ¶          // → 42   (ASCII-Standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (Dezimalpunkt immer ASCII)
>> 1 + 2 ¶      // → ३

// Boolesche Werte: # Präfix immer ASCII, Ziffer passt sich an
>> #1 ¶         // → #१   (wahr  auf Devanagari)
>> #0 ¶         // → #०   (falsch — unterscheidet sich von ०  ganzzahlig null)

x = 28 > 4
>> x ¶          // → #१   (Vergleichsergebnis folgt aktivem Modus)
```

### Native Ziffernsymbole im Quellcode

Ziffern aller unterstützten Skripte sind gültige Literale — in Bereichen, Modulo, Vergleichen:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolesche Literale in jedem System

`#` + Ziffer `0` oder `1` aus einem beliebigen Block ist ein gültiges boolesches Literal:

```zymbol
#٠٩#
نشط = #١        // entspricht #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` ist **immer ASCII**. `#0` (falsch) ist in jedem Skript visuell immer von `0` (ganzzahlig null) zu unterscheiden.

---

## Datenoperatoren

```zymbol
// Typkonvertierungs-Casts
##.42         // → 42.0  (zu Gleitkomma)
###3.7        // → 4     (zu Ganzzahl, runden)
##!3.7        // → 3     (zu Ganzzahl, abschneiden)

// Zeichenkette zu Zahl parsen
v1 = #|"42"|      // → 42  (Ganzzahl)
v2 = #|"3.14"|    // → 3.14  (Gleitkomma)
v3 = #|"abc"|     // → "abc"  (sicher, kein Fehler)

// Runden / Abschneiden
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (auf 2 Dezimalstellen runden)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (abschneiden)

// Zahlenformatierung
fmt = #,|1234567|      // → 1,234,567  (kommagetrennt)
wiss = #^|12345.678|   // → 1.2345678e4  (wissenschaftlich)

// Basis-Literale
a = 0x41         // → 'A'  (hexadezimal)
b = 0b01000001   // → 'A'  (binär)
c = 0o101        // → 'A'  (oktal)

// Basis-Konvertierungsausgabe
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
okt = 0o|8|      // → "0o10"
dez = 0d|255|    // → "0d0255"
```

---

## Shell-Integration

```zymbol
datum = <\ date +%Y-%m-%d \>     // stdout erfassen (mit abschließendem \n)
>> "Heute: " datum

datei = "daten.txt"
inhalt = <\ cat {datei} \>       // Interpolation in Befehlen

ausgabe = </"./teilskript.zy"/>  // weiteres Zymbol-Skript ausführen, Ausgabe erfassen
>> ausgabe
```

> `><` erfasst CLI-Argumente als Zeichenketten-Feld (nur Tree-Walker).

---

## Vollständiges Beispiel: FizzBuzz

```zymbol
klassifizieren(zahl) {
    ? zahl % 15 == 0 { <~ "FizzBuzz" }
    _? zahl % 3  == 0 { <~ "Fizz" }
    _? zahl % 5  == 0 { <~ "Buzz" }
    _ { <~ zahl }
}

@ i:1..20 { >> klassifizieren(i) ¶ }
```

---

## Symbolreferenz

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | Variable | `$#` | Länge |
| `:=` | Konstante | `$+` | anhängen (verkettbar) |
| `>>` | Ausgabe | `$+[i]` | einfügen an Index (1-basiert) |
| `<<` | Eingabe | `$-` | erstes Vorkommen nach Wert entfernen |
| `¶` / `\\` | Zeilenumbruch | `$--` | alle Vorkommen nach Wert entfernen |
| `?` | wenn | `$-[i]` | an Index entfernen (1-basiert) |
| `_?` | sonst-wenn | `$-[i..j]` | Bereich entfernen (1-basiert) |
| `_` | sonst / Platzhalter | `$?` | enthält |
| `??` | Match | `$??` | alle Indizes finden (1-basiert) |
| `@` | Schleife | `$[s..e]` | Ausschnitt (1-basiert) |
| `@ N { }` | N-mal-Schleife (N Iterationen) | `$>` | map |
| `@!` | abbrechen | `$\|` | filter |
| `@>` | weiter | `$<` | reduce |
| `@:name { }` | benannte Schleife | `$/ trenn` | Zeichenkette teilen |
| `@:name!` | Bezeichner abbrechen | `$++ a b c` | Verkettungsaufbau |
| `@:name>` | Bezeichner weiter | `arr[i>j>k]` | Navigationsindex |
| `->` | Lambda | `arr[i] = val` | Element aktualisieren (nur Felder) |
| `arr[i] += val` | zusammengesetztes Update | `arr[i]$~` | funktionales Update (neue Kopie) |
| `$^+` | aufsteigend sortieren (Primitive) | `$^-` | absteigend sortieren (Primitive) |
| `$^` | sortieren mit Vergleicher (Tupel) | `<~` | zurückgeben |
| `\|>` | Pipe | `!?` | versuchen |
| `:!` | fangen | `:>` | abschließend |
| `#1` | wahr | `#0` | falsch |
| `$!` | ist Fehler | `$!!` | Fehler weitergeben |
| `<#` | importieren | `#>` | exportieren |
| `#` | Modul deklarieren | `::` | Modulaufruf |
| `.` | Feldzugriff | `#?` | Typ-Metadaten |
| `#\|..\|` | Zahl parsen | `##.` | zu Gleitkomma casten |
| `###` | zu Ganzzahl casten (runden) | `##!` | zu Ganzzahl casten (abschneiden) |
| `#.N\|..\|` | runden | `#!N\|..\|` | abschneiden |
| `#,\|..\|` | Kommaformat | `#^\|..\|` | wissenschaftlich |
| `#d0d9#` | Ziffernsystem wechseln | `#09#` | auf ASCII zurücksetzen |
| `<\ ..\>` | Shell ausführen | `>\<` | CLI-Argumente |
| `\ var` | Variable explizit löschen | | |

---

## Versionsverlauf

### v0.0.4 — 1-basierte Indizierung, Erstklassige Funktionen & Modulblöcke _(April 2026)_

- **Brechend** Alle Indizierung auf **1-basiert** umgestellt — `arr[1]` ist das erste Element; `arr[0]` ist ein Laufzeitfehler
- **Hinzugefügt** Benannte Funktionen sind **erstklassige Werte** — direkt an höhere Funktionen übergeben: `zahlen$> verdoppeln`
- **Hinzugefügt** Modul-**Blocksyntax** erforderlich: `# name { ... }` — flache Syntax entfernt
- **Hinzugefügt** Mehrdimensionale Indizierung: `arr[i>j>k]` (Navigation), `arr[p ; q]` (flache Extraktion)
- **Hinzugefügt** Typkonvertierungs-Casts: `##.ausdr` (Gleitkomma), `###ausdr` (Ganzzahl runden), `##!ausdr` (Ganzzahl abschneiden)
- **Hinzugefügt** Zeichenketten-Teilung: `str$/ trenn` — gibt `Feld(Zeichenkette)` zurück
- **Hinzugefügt** Verkettungsaufbau: `basis$++ a b c` — hängt mehrere Elemente an
- **Hinzugefügt** N-mal-Schleife: `@ N { }` — genau N-mal wiederholen
- **Hinzugefügt** Benannte Schleifen-Syntax: `@:name { }`, `@:name!`, `@:name>` — ersetzt `@ @name` / `@! name`
- **Hinzugefügt** Variablen-Geltungsbereichsregeln: `_name`-Variablen haben exakten Blockbereich; `\ var` löscht früh
- **Hinzugefügt** Match-Vergleichsmuster: `< 0 :`, `> 5 :`, `== 42 :` usw.
- **Hinzugefügt** Modul-Fehler E013: Ausführbare Anweisungen im Modulrumpf sind verboten
- **Behoben** `take_variable` beschädigt beim Zurückschreiben keine Modulkonstanten mehr
- **Behoben** `alias.CONST` wird jetzt korrekt aufgelöst; `#>` kann nach Funktionsdefinitionen erscheinen
- **VM** Vollständige Parität: 393/393 Tests bestanden

### v0.0.3 — Unicode-Ziffernsysteme & LSP-Verbesserungen _(April 2026)_

- **Hinzugefügt** 69 Unicode-Ziffernblöcke mit Moduswechsel-Token `#d0d9#`
- **Hinzugefügt** Boolesche Literale in jedem Skript — `#१` / `#०`, `#١` / `#٠` usw.
- **Hinzugefügt** Klingonische pIqaD-Ziffern (CSUR PUA U+F8F0–U+F8F9)
- **Hinzugefügt** `SetNumeralMode` VM-Opcode — vollständige Parität mit Tree-Walker
- **Hinzugefügt** REPL berücksichtigt aktiven Ziffernsystem-Modus in Echo und Variablenanzeige
- **Geändert** Boolesche `>>`-Ausgabe enthält jetzt `#`-Präfix (`#0` / `#1`) in allen Modi

### v0.0.2_01 — Operator-Umbenennung _(30. Mär. 2026)_

- **Geändert** `c|..|` → `#,|..|` und `e|..|` → `#^|..|` — konsistent mit `#`-Format-Präfix-Familie
- **Hinzugefügt** Export-Alias: Modulelemente unter einem anderen Namen re-exportieren

### v0.0.2 — Sammlungs-API-Neugestaltung & Installationsprogramme _(24. Mär. 2026)_

- **Hinzugefügt** Einheitliche `$`-Operatorfamilie für Felder und Zeichenketten (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Hinzugefügt** Destrukturierungszuweisung für Felder, Tupel und benannte Tupel
- **Hinzugefügt** Negative Indizes (`arr[-1]` = letztes Element)
- **Hinzugefügt** Native Installationsprogramme — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. Mär. 2026)_

- **Hinzugefügt** Zusammengesetzte Zuweisung `^=`
- **Behoben** Parser-Arithmetik-Randfälle; Dokumentationskorrekturen

### v0.0.1 — Erste öffentliche Veröffentlichung _(22. Mär. 2026)_

- Tree-Walker-Interpreter + Register-VM (`--vm`, ~4× schneller, ~95% Parität)
- Alle Kernkonstrukte: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Vollständige Unicode-Bezeichner, Modulsystem, Lambdas, Closures, Fehlerbehandlung
- REPL, LSP, VS-Code-Erweiterung, Formatierer (`zymbol fmt`)

---

_Zymbol-Lang — Symbolisch. Universal. Unveränderlich._
