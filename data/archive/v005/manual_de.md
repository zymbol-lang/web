> **Hinweis:** Diese Dokumentation wurde mit Unterstützung künstlicher Intelligenz (KI) erstellt.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Die kanonische Referenz ist **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** im Interpreter-Repository.

---

# Zymbol-Lang Handbuch

> **Überarbeitet für v0.0.5 — 2026-05-12**

**Zymbol-Lang** ist eine symbolische Programmiersprache. Keine Schlüsselwörter — alles ist ein Symbol. Funktioniert in jeder menschlichen Sprache identisch.

- Kein `if`, `while`, `return` — nur `?`, `@`, `<~`
- Vollständiges Unicode — Bezeichner in jeder Sprache oder Emoji
- Sprachunabhängig — der Code ist überall gleich

**Interpreter-Version**: v0.0.5 | **Testabdeckung**: 436/436 (TW ↔ VM Parität)

---

## Variablen & Konstanten

```zymbol
x = 10              // veränderliche Variable
PI := 3.14159       // Konstante — Neuzuweisung ist ein Laufzeitfehler
name = "Alice"
aktiv = #1          // Boolescher Wert wahr
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

`°` (Gradzeichen, U+00B0) initialisiert eine Variable beim ersten Gebrauch automatisch auf ihren Neutralwert:

```zymbol
zahlen = [3, 1, 4, 1, 5]
@ n:zahlen {
    °gesamt += n    // Auto-Init auf 0 über Schleife; bleibt nach @
}
>> gesamt ¶         // → 14
```

> `°x` (Präfix) verankert oberhalb der Schleife — Ergebnis nach `@` verfügbar.
> `x°` (Postfix) verankert innerhalb der Schleife — endet wenn die Schleife endet.
> Nur Tree-Walker.

---

## Datentypen

| Typ | Literal | `#?` tag | Hinweise |
|-----|---------|----------|---------|
| Ganzzahl | `42`, `-7` | `###` | 64-Bit vorzeichenbehaftet |
| Gleitkomma | `3.14`, `1.5e10` | `##.` | Wissenschaftliche Notation OK |
| Zeichenkette | `"text"` | `##"` | Interpolation: `"Hallo {name}"` |
| Zeichen | `'A'` | `##'` | Einzelnes Unicode-Zeichen |
| Wahrheitswert | `#1`, `#0` | `##?` | NICHT numerisch — `#1 ≠ 1` |
| Feld | `[1, 2, 3]` | `##]` | Homogene Elemente |
| Tupel | `(a, b)` | `##)` | Positionell |
| Benanntes Tupel | `(x: 1, y: 2)` | `##)` | Benannte Felder |
| Funktion | benannte Funktionsreferenz | `##()` | Erstklassig; Anzeige `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Erstklassig; Anzeige `<lambd/N>` |

```zymbol
// Typinspektion — gibt (typ, stellen, wert) zurück
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Ausgabe & Eingabe

```zymbol
>> "Hallo" ¶                       // ¶ oder \\ für expliziten Zeilenumbruch
>> "a=" a " b=" b ¶                // Nebeneinanderstellung — mehrere Werte
>> (feld$#) ¶                      // Postfix-Operatoren benötigen ( ) in >>

<< name                            // in Variable einlesen (kein Prompt)
<< "Namen eingeben: " name         // mit Prompt
```

> `¶` (AltGr+R auf spanischer Tastatur) und `\\` sind gleichwertige Zeilenumbrüche.

---

## TUI-Grundbausteine

Terminal-UI-Operatoren für interaktive Programme. Die meisten benötigen einen `>>| { }` Block (Alternativbildschirm + Rohmodus).

```zymbol
>>| {
    >>!                              // Alternativbildschirm löschen
    >>~ (1, 1, 0, 10) > "Läuft"     // Zeile 1, Spalte 1, fg=10 (grün)
    @~ 1000                          // 1 Sekunde pausieren (1000 ms)
    >>~ (2, 1) > "Fertig."
}
// Terminal wird beim Beenden automatisch wiederhergestellt
```

```zymbol
// Tastendruck und Terminalgröße
>>| {
    [zeilen, spalten] = >>?          // Terminal-Dimensionen abfragen
    >>~ (1, 1) > "Terminal: " zeilen " x " spalten
    <<| taste                        // blockierendes Tastenlesen
    >>~ (2, 1) > "Gedrückt: " taste
}
```

> `>>!` löscht Bildschirm. `>>?` gibt `[zeilen, spalten]` zurück. `@~ N` wartet N Millisekunden.
> `<<|` liest eine Taste (blockierend); `<<|?` fragt ohne Blockierung ab (gibt `'\0'` zurück wenn keine).
> Positioniertes Ausgabe-Tupel: `(zeile, spalte, BKS, fg, bg)` — jeder Slot kann mit Komma weggelassen werden (`>>~ (,,, 196) > "rot"`).
> BKS-Bitmaske: `1`=Fett, `2`=Kursiv, `4`=Unterstrichen. ANSI-256-Farb-Palette (`0`=Terminal-Standard).
> Nur Tree-Walker (außer `>>!`, `>>?`, `@~`, `>>~` die auch in `--vm` funktionieren).

---

## Operatoren

```zymbol
// Arithmetik
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (Ganzzahldivision)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (Potenzierung)

// Vergleich — zuweisen um zu prüfen
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logik
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Zeichenketten

```zymbol
// Zwei Verkettungsformen
name = "Alice"
n = 42

>> "Hallo " name " du hast " n ¶    // Nebeneinanderstellung — in >>
beschr = "Hallo {name}, du hast {n}"  // Interpolation — überall
```

```zymbol
s = "Hallo Welt"
laenge = s$#                  // 11
teil = s$[1..5]               // "Hallo"  (1-basiert, Ende inklusive)
hat = s$? "Welt"              // #1
teile = "a,b,c,d"$/ ','       // [a, b, c, d]  (nach Trennzeichen aufteilen)
ers = s$~~["l":"L"]           // "HaLLo WeLt"
ers1 = s$~~["l":"L":1]        // "HaLlo Welt"  (nur erste N)
linie = "─" $* 20             // "────────────────────"  (N-mal wiederholen)
```

> `+` ist nur für Zahlen. Verwende `,`, Nebeneinanderstellung oder Interpolation für Zeichenketten.

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

> Geschweifte Klammern `{ }` sind **erforderlich** auch für eine einzelne Anweisung.

---

## Muster-Abgleich

```zymbol
// Bereiche
punkte = 85
note = ?? punkte {
    90..100 => 'S'
    80..89  => 'G'
    70..79  => 'B'
    _       => 'U'
}
>> note ¶    // → G

// Zeichenketten
farbe = "rot"
code = ?? farbe {
    "rot"   => "#FF0000"
    "grün"  => "#00FF00"
    _       => "#000000"
}

// Vergleichsmuster
temp = -5
zustand = ?? temp {
    < 0  => "eis"
    < 20 => "kalt"
    < 35 => "warm"
    _    => "heiß"
}
>> zustand ¶    // → eis

// Anweisungsform (Block-Zweige)
n = -3
?? n {
    0    => { >> "null" ¶ }
    < 0  => { >> "negativ" ¶ }
    _    => { >> "positiv" ¶ }
}
```

---

## Schleifen

```zymbol
@ i:0..4  { >> i " " }        // Bereich inklusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // mit Schritt:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // rückwärts:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruechte = ["apfel", "birne", "traube"]
@ f:fruechte { >> f ¶ }       // für jedes Element des Felds

@ z:"hallo" { >> z "-" }
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

// Beschriftete Schleife (verschachtelter Abbruch)
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

Funktionen haben **isolierten Gültigkeitsbereich** — sie können keine äußeren Variablen lesen. Verwende Ausgabeparameter `<~` um Aufrufervariablen zu ändern:

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

## Lambdas & Closures

```zymbol
verdoppeln = x -> x * 2
summe = (a, b) -> a + b
>> verdoppeln(5) ¶    // → 10
>> summe(3, 7) ¶      // → 10

// Block-Lambda
einordnen = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "null"
}

// Closure — erfasst äußeren Bereich
faktor = 3
dreifach = x -> x * faktor
>> dreifach(7) ¶    // → 21

// Fabrik
addierer_erstellen(n) { <~ x -> x + n }
plus10 = addierer_erstellen(10)
>> plus10(5) ¶    // → 15

// In Feldern
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Felder

Felder sind **veränderlich** und enthalten Elemente desselben **Typs**.

```zymbol
feld = [1, 2, 3, 4, 5]

x = feld[1]      // 1 — Zugriff (1-basiert: erstes Element)
x = feld[-1]     // 5 — negativer Index (letztes Element)
x = feld$#       // 5 — Länge (verwende (feld$#) in >>)

feld = feld$+ 6             // anhängen → [1,2,3,4,5,6]
feld2 = feld$+[2] 99        // einfügen an Position 2 (1-basiert)
feld3 = feld$- 3            // erste Vorkommen des Werts entfernen
feld4 = feld$-- 3           // alle Vorkommen entfernen
feld5 = feld$-[1]           // bei Index 1 entfernen (erstes Element)
feld6 = feld$-[2..3]        // Bereich entfernen (1-basiert, Ende inklusive)

hat = feld$? 3              // #1 — enthält
pos = feld$?? 3             // [3] — alle Indizes des Werts (1-basiert)
ausschnitt = feld$[1..3]    // [1,2,3] — Ausschnitt (1-basiert, Ende inklusive)
ausschnitt2 = feld$[1:3]    // [1,2,3] — gleich, anzahlbasierte Syntax

aufst = feld$^+             // aufsteigend sortiert  (nur Primitive)
abst = feld$^-              // absteigend sortiert (nur Primitive)

// Benannte/positionelle Tupel-Felder — $^ mit Vergleichslambda verwenden
db = [(name: "Carla", alter: 28), (name: "Ana", alter: 25), (name: "Bob", alter: 30)]
nach_alter = db$^ (a, b -> a.alter < b.alter)    // aufsteigend nach Alter  (<)
nach_name  = db$^ (a, b -> a.name > b.name)      // absteigend nach Name (>)
>> nach_alter[1].name ¶     // → Ana
>> nach_name[1].name ¶      // → Carla

// Direktes Element-Update (nur Felder)
feld[1] = 99             // zuweisen
feld[2] += 5             // zusammengesetzt: +=  -=  *=  /=  %=  ^=

// Funktionales Update — gibt neues Feld zurück; Original unverändert
feld2 = feld[2]$~ 99
```

> Alle Kollektionsoperatoren geben ein **neues Feld** zurück. Zurückweisen: `feld = feld$+ 4`.
> `$+` kann verkettet werden: `feld = feld$+ 5$+ 6$+ 7`. Andere Operatoren verwenden Zwischenzuweisungen.
> **Indizierung ist 1-basiert**: `feld[1]` ist das erste Element; `feld[0]` ist ein Laufzeitfehler.
> `$^+` / `$^-` sortiert **primitive Felder** (Zahlen, Zeichenketten). Für Tupel-Felder verwende `$^` mit Vergleichslambda — die Richtung ist in der Lambda kodiert (`<` = aufsteigend, `>` = absteigend).

**Wertsemantik** — das Zuweisen eines Felds an eine andere Variable erstellt eine unabhängige Kopie:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b unberührt
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
feld = [10, 20, 30, 40, 50]
[a, b, c] = feld              // a=10  b=20  c=30
[erstes, *rest] = feld        // erstes=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]         // _ verwerfen

// Positionelles Tupel
punkt = (100, 200)
(px, py) = punkt              // px=100  py=200

// Benanntes Tupel
person = (name: "Ana", alter: 25, stadt: "Berlin")
(name: n, alter: a) = person  // n="Ana"  a=25
```

---

## Tupel

Tupel sind **unveränderliche** geordnete Container, die Werte **verschiedener Typen** halten können.
Anders als Felder können Elemente nach der Erstellung nicht geändert werden.

```zymbol
// Positionell — gemischte Typen erlaubt
punkt = (10, 20)
>> punkt[1] ¶    // → 10

daten = (42, "hallo", #1, 3.14)
>> daten[3] ¶    // → #1

// Benannt
person = (name: "Alice", alter: 25)
>> person.name ¶    // → Alice
>> person[1] ¶      // → Alice  (Index funktioniert auch, 1-basiert)

// Verschachtelt
pos = (x: 10, y: 20)
p = (pos: pos, bezeichnung: "ursprung")
>> p.pos.x ¶        // → 10
```

**Unveränderlichkeit** — jeder Versuch ein Tupel-Element zu ändern ist ein Laufzeitfehler:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ Laufzeitfehler: Tupel sind unveränderlich
// t[1] += 5    // ❌ gleicher Fehler
```

Um einen geänderten Wert abzuleiten, verwende `$~` (funktionales Update) — gibt ein **neues** Tupel zurück:

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

## Funktionen höherer Ordnung

```zymbol
zahlen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdoppelt  = zahlen$> (x -> x * 2)               // map  → [2,4,6…20]
gerade      = zahlen$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
gesamt      = zahlen$< (0, (acc, x) -> acc + x)    // reduce → 55

// Kette über Zwischenergebnisse
schritt1 = zahlen$| (x -> x > 3)
schritt2 = schritt1$> (x -> x * x)
>> schritt2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Benannte Funktionen können direkt an HOF übergeben werden
verdoppeln(x) { <~ x * 2 }
ist_gross(x) { <~ x > 5 }
r = zahlen$> verdoppeln    // ✅ direkte Referenz
r = zahlen$| ist_gross     // ✅ direkte Referenz
```

---

## Pipe-Operator

Die rechte Seite erfordert immer `_` als Platzhalter für den weitergeleiteten Wert:

```zymbol
verdoppeln = x -> x * 2
addieren = (a, b) -> a + b
erhoehen = x -> x + 1

r1 = 5 |> verdoppeln(_)             // → 10
r2 = 10 |> addieren(_, 5)           // → 15
r3 = 5 |> addieren(2, _)            // → 7

// Verkettet
r = 5 |> verdoppeln(_) |> erhoehen(_) |> verdoppeln(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fehlerbehandlung

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division durch null" ¶
} :! {
    >> "sonstiger fehler: " _err ¶    // _err enthält die Fehlermeldung
} :> {
    >> "läuft immer" ¶
}
```

| Typ | Wann |
|-----|------|
| `##Div` | Division durch null |
| `##IO` | Datei / System |
| `##Index` | Index außerhalb Grenzen |
| `##Type` | Typkonflikt |
| `##Parse` | Daten-Parsing |
| `##Network` | Netzwerkfehler |
| `##_` | Beliebiger Fehler (Auffangklausel) |

---

## Module

```zymbol
// lib/rechner.zy — Modulrumpf in geschweiften Klammern
# rechner {
    #> { addieren, pi_holen }

    _PI := 3.14159
    addieren(a, b) { <~ a + b }
    pi_holen() { <~ _PI }
}
```

```zymbol
// haupt.zy
<# ./lib/rechner => r    // Alias erforderlich

>> r::addieren(5, 3) ¶   // → 8
pi = r::pi_holen()
>> pi ¶                  // → 3.14159
```

```zymbol
// Mit anderem öffentlichem Namen exportieren
# meinmodul {
    #> { _intern_addieren => summe }

    _intern_addieren(a, b) { <~ a + b }
}
```

```zymbol
<# ./meinmodul => m

>> m::summe(3, 4) ¶    // → 7  (interner Name _intern_addieren ist verborgen)
```

> **Modulregeln**: nur `#>`, Funktionsdefinitionen und literale Variablen-/Konstanteninitialisierungen sind innerhalb `# name { }` erlaubt. Ausführbare Anweisungen (`>>`, `<<`, Schleifen usw.) lösen Fehler E013 aus.

---

## Zahlenmodi

Zymbol kann Zahlen in **69 Unicode-Ziffernskripten** anzeigen — Devanagari, Arabisch-Indisch, Thai, Klingon pIqaD, Mathematisch-Fett, LCD-Segmente und mehr. Der aktive Modus beeinflusst nur die `>>`-Ausgabe; interne Arithmetik ist stets binär.

### Skript aktivieren

Schreibe die Ziffer `0` und `9` des Zielskripts in `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisch-Indisch (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // auf ASCII zurücksetzen
```

### Ausgabe und Wahrheitswerte

```zymbol
x = 42
>> x ¶          // → 42   (ASCII Standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (Dezimalpunkt immer ASCII)
>> 1 + 2 ¶      // → ३

// Wahrheitswerte: # Präfix immer ASCII, Ziffer passt sich an
>> #1 ¶         // → #१   (wahr in Devanagari)
>> #0 ¶         // → #०   (falsch — unterschiedlich von ० Ganzzahl-Null)

x = 28 > 4
>> x ¶          // → #१   (Vergleichsergebnis folgt aktivem Modus)
```

### Native Ziffernliterale im Quellcode

Ziffern jedes unterstützten Skripts sind gültige Literale — in Bereichen, Modulo, Vergleichen:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Wahrheitswertliterale in jedem Skript

`#` + Ziffer `0` oder `1` aus jedem Block ist ein gültiges Wahrheitswertliteral:

```zymbol
#٠٩#
نشط = #١        // entspricht #1
>> نشط ¶        // → #١
>> (#१ && #٠) ¶ // → #٠
```

> `#` ist **immer ASCII**. `#0` (falsch) ist in jedem Skript optisch klar von `0` (Ganzzahl-Null) unterscheidbar.

---

## Datenoperatoren

```zymbol
// Typkonvertierungs-Casts
f = ##.42         // → 42.0  (zu Gleitkomma)
i = ###3.7        // → 4     (zu Ganzzahl, gerundet)
t = ##!3.7        // → 3     (zu Ganzzahl, abgeschnitten)

// Zeichenkette in Zahl umwandeln
w1 = #|"42"|      // → 42  (Ganzzahl)
w2 = #|"3.14"|    // → 3.14  (Gleitkomma)
w3 = #|"abc"|     // → "abc"  (fehlersicher, kein Fehler)

// Runden / Abschneiden
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (auf 2 Stellen runden)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (abschneiden)

// Zahlenformatierung
fmt = #,|1234567|      // → 1,234,567  (tausendergetrennt)
wiss = #^|12345.678|  // → 1.2345678e4  (wissenschaftlich)

// Basisliterale
a = 0x41         // → 'A'  (hexadezimal)
b = 0b01000001   // → 'A'  (binär)
c = 0o101        // → 'A'  (oktal)

// Basiskonversions-Ausgabe
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
okt = 0o|8|      // → "0o10"
dez = 0d|255|    // → "0d0255"
```

---

## Shell-Integration

```zymbol
datum = <\ date +%Y-%m-%d \>      // erfasst stdout (einschließlich \n)
>> "Heute: " datum

datei = "daten.txt"
inhalt = <\ cat {datei} \>        // Interpolation in Befehlen

ausgabe = </"./teilskript.zy"/>   // anderes Zymbol-Skript ausführen, Ausgabe erfassen
>> ausgabe
```

> `><` erfasst CLI-Argumente als Zeichenketten-Feld (nur Tree-Walker).

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

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | Variable | `$#` | Länge |
| `:=` | Konstante | `$+` | Anhängen (verkettbar) |
| `>>` | Ausgabe | `$+[i]` | Einfügen bei Index (1-basiert) |
| `<<` | Eingabe | `$-` | Erste nach Wert entfernen |
| `¶` / `\\` | Zeilenumbruch | `$--` | Alle nach Wert entfernen |
| `?` | wenn | `$-[i]` | Bei Index entfernen (1-basiert) |
| `_?` | sonst-wenn | `$-[i..j]` | Bereich entfernen (1-basiert) |
| `_` | sonst / Wildcard | `$?` | Enthält |
| `??` | Musterabgleich | `$??` | Alle Indizes finden (1-basiert) |
| `@` | Schleife | `$[s..e]` | Ausschnitt (1-basiert) |
| `@ N { }` | N-mal-Schleife | `$>` | map |
| `@!` | abbrechen | `$\|` | filter |
| `@>` | weiter | `$<` | reduce |
| `@:name { }` | benannte Schleife | `$/ trenn` | Zeichenkette teilen |
| `@:name!` | Abbruch mit Bezeichnung | `$++ a b c` | Verkettungs-Build |
| `@:name>` | Weiter mit Bezeichnung | `feld[i>j>k]` | Navigationsindex |
| `->` | Lambda | `feld[i] = wert` | Element aktualisieren (nur Felder) |
| `feld[i] += wert` | Zusammengesetztes Update | `feld[i]$~` | Funktionales Update (neue Kopie) |
| `$^+` | Aufsteigend sortieren (Primitive) | `$^-` | Absteigend sortieren (Primitive) |
| `$^` | Mit Vergleich sortieren (Tupel) | `<~` | zurückgeben |
| `\|>` | Pipe | `!?` | versuchen |
| `:!` | abfangen | `:>` | abschließend |
| `#1` | wahr | `#0` | falsch |
| `$!` | ist Fehler | `$!!` | Fehler weiterleiten |
| `<#` | importieren | `#>` | exportieren |
| `#` | Modul deklarieren | `::` | Modulaufruf |
| `.` | Feldzugriff | `#?` | Typ-Metadaten |
| `#\|..\|` | Zahl parsen | `##.` | zu Gleitkomma konvertieren |
| `###` | zu Ganzzahl konvertieren (runden) | `##!` | zu Ganzzahl konvertieren (abschneiden) |
| `#.N\|..\|` | runden | `#!N\|..\|` | abschneiden |
| `#,\|..\|` | Tausenderformat | `#^\|..\|` | wissenschaftlich |
| `#z0z9#` | Zahlenmodus-Wechsel | `#09#` | auf ASCII zurücksetzen |
| `<\ ..\>` | Shell-Ausführung | `>\<` | CLI-Argumente |
| `\ var` | Variable explizit zerstören | `°x` / `x°` | Heißdefinition (Auto-Init) |
| `>>|` | TUI-Block (Alternativbildschirm) | `>>~` | Positionierte Ausgabe |
| `>>!` | Bildschirm löschen | `>>?` | Terminalgröße abfragen |
| `<<\|` | Blockierendes Tastenlesen | `<<\|?` | Nicht-blockierendes Tastenlesen |
| `@~ N` | N Millisekunden warten | `$*` | Zeichenkette N-mal wiederholen |

---

## Versions-Changelog

### v0.0.5 — TUI-Grundbausteine, Heißdefinition & Zeichenkettenwied. _(Mai 2026)_

- **Breaking** Musterabgleich-Zweig-Trennzeichen: `muster : ergebnis` → `muster => ergebnis`
- **Breaking** Import-Alias: `<# pfad <= alias` → `<# pfad => alias`
- **Breaking** Export-Umbenennung: `#> { fn <= pub }` → `#> { fn => pub }`
- **Added** TUI-Block `>>| { }` — Alternativbildschirm + Rohmodus; räumt beim Beenden auf
- **Added** Positionierte Ausgabe `>>~ (zeile, spalte, BKS, fg, bg) > elemente` — spärliche Slots, ANSI-256-Farben
- **Added** Tasteneingabe `<<| var` (blockierend) und `<<|? var` (nicht-blockierendes Polling)
- **Added** `>>!` Bildschirm löschen, `>>?` Terminalgröße abfragen, `@~ N` N Millisekunden warten
- **Added** Heißdefinition `°x` / `x°` — Variable beim ersten Gebrauch in Schleifen auto-initialisieren
- **Added** Zeichenkettenwiederholung `str $* N` — Zeichenkette N-mal wiederholen
- **VM** Parität: 436/436 Tests bestanden

### v0.0.4 — 1-basierte Indizierung, Erstklassige Funktionen & Modulblöcke _(April 2026)_

- **Breaking** Alle Indizierung auf **1-basiert** umgestellt — `feld[1]` ist das erste Element; `feld[0]` ist ein Laufzeitfehler
- **Added** Benannte Funktionen sind **erstklassige Werte** — direkt an HOF übergeben: `zahlen$> verdoppeln`
- **Added** Modul-**Blocksyntax** erforderlich: `# name { ... }` — flache Syntax entfernt
- **Added** Mehrdimensionale Indizierung: `feld[i>j>k]` (Navigation), `feld[p ; q]` (flache Extraktion)
- **Added** Typkonvertierungs-Casts: `##.ausdruck` (Gleitkomma), `###ausdruck` (Ganzzahl runden), `##!ausdruck` (Ganzzahl abschneiden)
- **Added** Zeichenketten-Teilen: `str$/ trenn` — gibt `Array(String)` zurück
- **Added** Verkettungs-Build: `basis$++ a b c` — mehrere Elemente anhängen
- **Added** N-mal-Schleife: `@ N { }` — genau N-mal wiederholen
- **Added** Benannte Schleifen-Syntax: `@:name { }`, `@:name!`, `@:name>` — ersetzt `@ @name` / `@! name`
- **Added** Variablen-Gültigkeitsbereichsregeln: `_name` Variablen haben genauen Blockbereich; `\ var` zerstört frühzeitig
- **Added** Musterabgleich-Vergleichsmuster: `< 0 :`, `> 5 :`, `== 42 :` usw.
- **Added** Modul-E013-Fehler: ausführbare Anweisungen im Modulrumpf sind verboten
- **Fixed** `take_variable` korrumpiert Modulkonstanten beim Zurückschreiben nicht mehr
- **Fixed** `alias.CONST` wird nun korrekt aufgelöst; `#>` kann nach Funktionsdefinitionen erscheinen
- **VM** Volle Parität: 393/393 Tests bestanden

### v0.0.3 — Unicode-Zahlensysteme & LSP-Verbesserungen _(April 2026)_

- **Added** 69 Unicode-Ziffernblöcke mit Moduswechsel-Token `#d0d9#`
- **Added** Wahrheitswertliterale in jedem Skript — `#१` / `#०`, `#١` / `#٠` usw.
- **Added** Klingon-pIqaD-Ziffern (CSUR PUA U+F8F0–U+F8F9)
- **Added** `SetNumeralMode`-VM-Opcode — vollständige Parität mit Tree-Walker
- **Added** REPL respektiert aktiven Zahlenmodus in Echo und Variablenanzeige
- **Changed** Wahrheitswert-`>>`-Ausgabe enthält nun `#`-Präfix (`#0` / `#1`) in allen Modi

### v0.0.2_01 — Operatorumbenennung _(30. März 2026)_

- **Changed** `c|..|` → `#,|..|` und `e|..|` → `#^|..|` — konsistent mit `#`-Formatpräfix-Familie
- **Added** Export-Alias: Modulelemente unter anderem Namen re-exportieren

### v0.0.2 — Kollektions-API-Überarbeitung & Installationsprogramme _(24. März 2026)_

- **Added** Einheitliche `$`-Operatorfamilie für Felder und Zeichenketten (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Destrukturierungszuweisung für Felder, Tupel und benannte Tupel
- **Added** Negative Indizes (`feld[-1]` = letztes Element)
- **Added** Native Installationsprogramme — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. März 2026)_

- **Added** Zusammengesetzte Zuweisung `^=`
- **Fixed** Parser-Arithmetik-Randfälle; Dokumentationskorrektionen

### v0.0.1 — Erste öffentliche Veröffentlichung _(22. März 2026)_

- Tree-Walker-Interpreter + Register-VM (`--vm`, ~4× schneller, ~95% Parität)
- Alle Kernkonstrukte: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Vollständige Unicode-Bezeichner, Modulsystem, Lambdas, Closures, Fehlerbehandlung
- REPL, LSP, VS-Code-Erweiterung, Formatierer (`zymbol fmt`)

---

_Zymbol-Lang — Symbolisch. Universal. Unveränderlich._
