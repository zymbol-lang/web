> **Haftungsausschluss:** Dieses Dokument wurde von künstlicher Intelligenz (KI) erstellt und übersetzt.
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Die kanonische Referenz ist **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** im Interpreter-Repository.

---

# Zymbol-Lang Handbuch

> **Überarbeitet für v0.0.9 — 2026-09-07**

**Zymbol-Lang** ist eine symbolische Programmiersprache. Keine Wörter in ihrer Grammatik — jedes Konstrukt ist ein Symbol. Funktioniert in jeder menschlichen Sprache identisch.

- Kein `if`, `while`, `return` — nur `?`, `@`, `<~`
- Volles Unicode — Bezeichner in jeder Sprache oder jedem Emoji
- Sprachunabhängig — der Code ist überall derselbe

**Interpreter-Version**: v0.0.9 | **Testabdeckung**: 660/666 (drei Engines stimmen überein, 0 abweichend)

---

## Variablen und Konstanten

```zymbol
x = 10              // veränderliche Variable
PI := 3.14159       // Konstante — Neuzuweisung ist ein Laufzeitfehler
name = "Alice"
aktiv = #1          // boolescher Wahrheitswert
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
x++       // 5
x--       // 4
```

`°` (Gradzeichen, U+00B0) initialisiert eine Variable bei erster Verwendung automatisch mit ihrem neutralen Wert:

```zymbol
zahlen = [3, 1, 4, 1, 5]
@ n:zahlen {
    °summe += n
}
>> summe ¶              // → 14
```

> `°var` (Präfix) verankert oberhalb der Schleife — das Ergebnis ist nach `@` lesbar.
> `var°` (Suffix) verankert innerhalb der Schleife — es stirbt, wenn die Schleife endet.

Eine Anweisung, die nur ein Name ist, liest die Variable und verwirft den Wert, daher warnt sie:

```zymbol
zaehler = 5
zaehler
```

Der Compiler warnt wie folgt (seine Meldungen sind immer auf Englisch):

```text
warning: this statement does nothing: 'zaehler' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Das heißt: *«diese Anweisung tut nichts: 'zaehler' wird gelesen und verworfen»*.

---

## Datentypen

| Typ | Literal | `#?`-Tag | Hinweise |
|------|---------|----------|----------|
| Ganzzahl | `42`, `-7` | `###` | Sichere Ganzzahl: ±(2⁵³ − 1) |
| Gleitkommazahl | `3.14`, `1.5e10` | `##.` | IEEE-754-Doppel |
| Zeichenkette | `"Text"` | `##"` | Interpolation: `"Hallo {name}"` |
| Zeichen | `'A'` | `##'` | Ein Unicode-Codepunkt |
| Boolesch | `#1`, `#0` | `##?` | NICHT numerisch — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Ein Typ, geprüft |
| Deklarierte Mischung | `#[1, "zwei"]` | `##[` | Gleicher Typ wie `[…]`, nicht geprüft |
| Tupel | `(a, b)` | `##)` | Positionsbasiert, unveränderlich |
| Wörterbuch | `#(x: 1, y: 2)` | `##(` | Schlüsselbasiert, veränderlich |
| Funktion | benannte Funktionsreferenz | `##()` | Erstklassig; zeigt `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Erstklassig; zeigt `<lambd/N>` |
| Einheit | `##_` | `##_` | Abwesenheit — es gibt kein null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Eine Ganzzahl, die den sicheren Bereich verlässt, ist ein abfangbarer Fehler, niemals ein stilles Überlaufen:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "außerhalb des Bereichs" ¶ // → außerhalb des Bereichs
}
```

`##_` ist die Art und Weise, wie ein Programm fragt, ob etwas abwesend ist:

```zymbol
nichts() { }
wert = nichts()
>> (wert == ##_) ¶     // → #1
```

---

## Ausgabe und Eingabe

```zymbol
name = "Alice"
summe = 3
>> "Hallo" ¶             // → Hallo
>> "a=" name " b=" summe ¶ // → a=Alice b=3
>> summe#? ¶            // → (###, 1, 3)
```

```zymbol
<< name
<< "Geben Sie Ihren Namen ein: " name
<< ###(4) "Alter: " alter
```

**Beachten Sie die Form der beiden Symbole.** `>>` zeigt nach außen: es holt Daten aus dem Programm heraus. `<<` zeigt nach innen: es bringt Daten in das Programm. Es gibt nichts zu merken — der Pfeil zeigt, in welche Richtung die Information reist, und dieselbe Idee kehrt in jedem Symbol zurück, das etwas bewegt.

> `¶` und `\\` sind gleichwertige Zeilenumbrüche. `>>` fügt niemals einen hinzu.
> Ein Typspezifizierer vor der Eingabeaufforderung validiert beim Lesen und fordert erneut auf, bis der Wert gültig ist:
> `##.` Gleitkommazahl · `##.(T,D)` Dezimalzahl · `###(N)` Ganzzahl · `##"(N)` Text · `##'` ein Zeichen.

Auf der obersten Ebene einer Datei ist `<~` der Exit-Status des Programms:

```zymbol
>> "überprüfe" ¶      // → überprüfe
<~ 0
```

---

## TUI-Primitive

Terminal-UI-Operatoren für interaktive Programme. Die meisten erfordern einen `>>| { }`-Block (Alternativbildschirm + Rohmodus).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Wird ausgeführt"
    @~ 1000
    >>~ (2, 1) > "Fertig."
}
```

```zymbol
>>| {
    [zeilen, spalten] = >>?
    >>~ (1, 1) > "Terminal: " zeilen " x " spalten
    <<| taste
    >>~ (2, 1) > "Gedrückt: " taste
}
```

Hier sehen Sie, warum Symbole kombiniert statt multipliziert werden. Sie wissen bereits, dass `<<` Eingabe ist und `?` fragt, ohne sich festzulegen. Nur ein Symbol ist neu:

- `|` ist **eine einzelne Einheit**, nicht der gesamte Strom.

Damit lesen sich beide Tastaturoperatoren von selbst:

```text
<<        |             ?
Eingabe   eine Einheit  ohne Bindung

<<|   nimm EINE Taste und warte, bis eine da ist
<<|?  prüfe, ob EINE Taste da ist, und fahre fort, wenn keine da ist
```

Dasselbe auf der anderen Seite: `>>` sendet aus, `>>!` sendet **mit Gewalt** aus (löscht den gesamten Bildschirm), während `>>?` **fragt** statt schreibt (wie groß das Terminal ist). Das Symbol auf der rechten Seite ist dasjenige, das den Modus ändert, und es kommt immer zuletzt.

> `>>!` löscht den Bildschirm. `>>?` gibt `(zeilen, spalten)` zurück. `@~ N` schläft N Millisekunden.
> `<<|` liest einen Tastendruck (blockierend); `<<|?` fragt ohne Blockieren ab (`'\0'` falls keiner).
> Pfeiltasten werden dekodiert als `'↑' '↓' '←' '→'`; ESC ist Codepunkt 27.
> Positions-Tupel für Ausgabe: `(zeile, spalte, BKS, vordergrund, hintergrund)` — jeder Slot kann mit einem Komma ausgelassen werden (`>>~ (,,, 196) > "rot"`).
> BKS-Bitmaske: `1`=Fett, `2`=Kursiv, `4`=Unterstrichen. ANSI-256-Farbpalette (`0`=Terminal-Standard).

---

## Operatoren

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (Ganzzahldivision)
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

> `==` erzwingt niemals: `"5" == 5` ist `#0`. Die Ordnung erzwingt: `"5" > 4` ist `#1`, und `"४२" > 5` ebenfalls — numerischer Text in einer der 69 Schriften vergleicht als Zahl.
> Eine Funktion ist nur sich selbst gleich, niemals einer anderen Funktion mit demselben Körper.

---

## Zeichenketten

```zymbol
name = "Alice"
n = 42
>> "Hallo " name " Sie haben " n ¶ // → Hallo Alice Sie haben 42
beschreibung = "Hallo {name}, Sie haben {n}"
>> beschreibung ¶              // → Hallo Alice, Sie haben 42
```

```zymbol
s = "Hallo Welt"
laenge = s$#                  // 10
teil = s$[1..5]             // "Hallo"
enthaelt = s$? "Welt"          // #1
teile = "a,b,c,d"$/ ','    // [a, b, c, d]
ersetzen = s$~~["o":"0"]     // "Hall0 Welt"
linie = "─" $* 20
```

> `+` ist nur für Zahlen. Für Zeichenketten verwenden Sie Nebeneinanderstellung oder Interpolation.
> `\{` und `\}` sind literale geschweifte Klammern — die Escape ist symmetrisch.

---

## Kontrollfluss

```zymbol
x = 7
? x > 100 {
    >> "groß" ¶
} _? x > 0 {
    >> "positiv" ¶     // → positiv
} _ {
    >> "negativ" ¶
}
```

Hier gibt es zwei neue Symbole und ein drittes, das aus ihrer Kombination entsteht:

- `?` ist **fragen**: es öffnet eine Bedingung.
- `_` ist **was nicht spezifiziert wurde**: der Zweig, der übrig bleibt, wenn keine Frage übereinstimmte.
- `_?` ist beides hintereinander: *wenn nichts übereinstimmte, frage erneut*.

Deshalb wird `_?` so geschrieben. Es ist kein neues Symbol zum Lernen — es ist `_` gefolgt von `?`, und es bedeutet genau das, was seine beiden Teile bedeuten, in der Reihenfolge gelesen.

> Geschweifte Klammern `{ }` sind **obligatorisch**, selbst für eine einzelne Anweisung.

---

## Musterabgleich

```zymbol
punkte = 85
note = ?? punkte {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> note ¶              // → B
```

```zymbol
temperatur = -5
zustand = ?? temperatur {
    < 0  => "Eis"
    < 20 => "kalt"
    _    => "heiß"
}
>> zustand ¶              // → Eis
```

Sie wissen bereits, dass `?` "fragen" bedeutet. **`??` ist mehrmals fragen**: ein Symbol zu verdoppeln, an jeder Stelle der Sprache, bedeutet, mehrmals das zu tun, was das Symbol einmal tut. Ein `?` testet eine Bedingung; `??` testet gegen eine Liste von Fällen.

Alternativen werden mit `||` verbunden und können Mustertypen mischen:

```zymbol
taste = 'P'
aktion = ?? taste {
    'p' || 'P' => "pausieren"
    < 0 || > 100 => "außerhalb des Bereichs"
    _ => "ignoriert"
}
>> aktion ¶             // → pausieren
```

---

## Schleifen

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
obst = ["Apfel", "Birne", "Traube"]
@ o:obst { >> o " " }
>> ¶                    // → Apfel Birne Traube
@ z:"Hallo" { >> z "-" }
>> ¶                    // → H-a-l-l-o-
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
zaehler = 0
@:aeusser {
    zaehler++
    ? zaehler >= 3 { @:aeusser! }
}
>> zaehler ¶             // → 3
```

`@` ist das Symbol der **Zeit**: alles, was sich wiederholt, lebt in ihm. Um diese Zeit zu verkürzen, fügen Sie ein Symbol daneben:

- `@!` — `!` ist **Gewalt**: verlasse die Schleife jetzt.
- `@>` — `>` schiebt vorwärts: gehe zur nächsten Runde.
- `@:aeusser!` — `:` **bindet einen Namen**, also schneidet dies die Schleife mit dem *Namen* äusser, nicht die nächste.

Drei Operatoren, und keiner musste separat gelernt werden: es sind `@` plus ein Symbol, das bereits sagt, was es tut.

> **Ein Spezifizierer ist eine Anzahl oder eine Bedingung.** Eine `Ganzzahl` ist eine Anzahl, einmal ausgewertet — `@ 0` führt den Körper null Mal aus. Alles andere ist eine Bedingung. Es gibt keine Wahrhaftigkeit: `@ []` und `@ 3.5` werden abgelehnt. Um eine Sammlung zu durchlaufen, verwenden Sie `@ x:elemente`; um sie zu zählen, `@ elemente$#`.

---

## Funktionen

```zymbol
addieren(a, b) { <~ a + b }
>> addieren(3, 4) ¶        // → 7
```

```zymbol
fakultaet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultaet(n - 1)
}
>> fakultaet(5) ¶       // → 120
```

Eine Funktion liest die Variablen der Datei nach Wert, und ein Schreiben innerhalb bleibt innerhalb:

```zymbol
grenze = 100
innerhalb(n) { <~ n < grenze }
>> innerhalb(42) ¶         // → #1
```

Zwei Symbole ändern das, und beide werden **in der Signatur und an der Aufrufstelle** geschrieben:

```zymbol
erhoehe(zaehler<~) { zaehler = zaehler + 1 }
summe = 0
erhoehe(summe<~)
>> summe ¶              // → 1
```

> `p~` ist eine Arbeitskopie — der Körper kann sie neu zuweisen und der Aufrufer bleibt unberührt.
> `p<~` ist ein Ausgabeparameter — die Änderung reist zurück. `erhoehe(summe)` ohne das Symbol ist ein semantischer Fehler: die Annotation und die Signatur können nicht auseinanderdriften.

---

## Lambdas und Abschlüsse

```zymbol
verdoppeln = x -> x * 2
summieren = (a, b) -> a + b
>> verdoppeln(5) ¶          // → 10
>> summieren(3, 7) ¶          // → 10
```

```zymbol
klassifizieren = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "null"
}
>> klassifizieren(-4) ¶         // → negativ
```

```zymbol
faktor = 3
verdreifachen = x -> x * faktor
>> verdreifachen(7) ¶          // → 21
```

```zymbol
addierer_erstellen(n) { <~ x -> x + n }
addiere10 = addierer_erstellen(10)
>> addiere10(5) ¶           // → 15
```

Ein Lambda kann überhaupt keine Parameter nehmen:

```zymbol
antwort = () -> 42
>> antwort() ¶           // → 42
```

> Ein Lambda erfasst die Variablen der Datei **bei seiner Erstellung**; eine benannte Funktion liest sie **bei ihrem Aufruf**.

---

## Arrays

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   Indizierung ist 1-basiert
>> arr[-1] ¶      // → 5   Negativ zählt vom Ende
>> arr$# ¶        // → 5   Länge
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   anhängen
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  an Position 2 einfügen
>> (arr$- 3) ¶          // → [1, 2]         erstes Vorkommen entfernen
>> (arr$-[1]) ¶         // → [2, 3]         an Index 1 entfernen
>> (arr$[1..2]) ¶       // → [1, 2]         Slice, beide Enden eingeschlossen
>> (arr$? 3) ¶          // → #1             enthält
```

Alle beginnen mit `$`, dem Symbol für **Sammlung**, und setzen sich mit einem Symbol fort, das sagt, was darin getan wird: `#` wie viele, `+` hinzufügen, `-` entfernen, `?` fragen, ob vorhanden. Und wie bei `??` bedeutet das Verdoppeln des Symbols, es erschöpfend zu tun: `$?` fragt *ob* ein Wert vorhanden ist, `$??` fragt *an wie vielen Stellen* und gibt alle zurück.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   aufsteigend
>> (arr$^-) ¶     // → [3, 2, 1]   absteigend
```

**Die Regel des Ergebnisses.** Ein Operator, und was der umgebende Code damit macht, entscheidet: verwendet, **baut** er und lässt das Original unberührt; verworfen, **modifiziert** er.

```zymbol
arr = [1, 2, 3]
kopie = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> kopie ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` schreibt niemals in eine Sammlung.** `arr[2] = 99` ist keine Form von Zymbol — `=` gibt einen Wert an einen **NAMEN**. Das Ändern eines Teils einer Sammlung ist `$~`, in jeder Sammlung.

`[…]` enthält einen Typ und wird geprüft; eine bewusste Mischung wird mit `#[…]` **deklariert**:

```zymbol
mischung = #[1, "zwei", #1]
>> mischung ¶             // → [1, zwei, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Mehrdimensionale Indizierung

`>` steigt in eine verschachtelte Struktur hinab. Eine Klammergruppe adressiert ein Element, egal wie tief.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   Zeile 2, Spalte 3
>> m[-1>-1] ¶      // → 9   letzte Zeile, letzte Spalte
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          flach: die Diagonale
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   strukturiert: die Ecken
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **ist** keine Form von Zymbol. Der verkettete Index wird sowohl zum Lesen als auch zum Schreiben abgelehnt — eine Klammergruppe pro Zugriff, und `>` ist das, was zwischen den Schritten steht.

---

## Wörterbücher

Ein Tupel mit benannten Feldern ist ein Wörterbuch, und seit v0.0.9 wird es `#(…)` geschrieben.

```zymbol
person = #(name: "Alice", alter: 25)
>> person.name ¶        // → Alice
>> person["alter"] ¶    // → 25
```

```zymbol
person = #(name: "Alice", alter: 25)
feld = "name"
>> person[feld] ¶     // → Alice
```

Es ist veränderlich, Schlüssel können hinzugefügt werden, und es kann durchlaufen werden:

```zymbol
bestand = #(birne: 4)
bestand["apfel"]$~ 10
@ k:bestand { >> k "=" bestand[k] " " }
>> ¶                    // → birne=4 apfel=10
```

```zymbol
bestand = #(birne: 4, apfel: 10)
@ (k, v):bestand { >> k ":" v " " }
>> ¶                    // → birne:4 apfel:10
```

> `#()` ist das leere Wörterbuch, was `()` nicht sein konnte — es müsste auch das leere Tupel sein. Die nackte `(x: 1)` wird mit dieser Meldung abgelehnt: *a dictionary is written `#(…)`* — «ein Wörterbuch wird `#(…)` geschrieben».
> Ein Wörterbuch wird per Schlüssel adressiert, niemals per Position, daher ist `person[1]` ein Fehler.

---

## Tupel

Tupel sind **unveränderliche** geordnete Container, die Werte verschiedener Typen enthalten.

```zymbol
punkt = (10, 20)
>> punkt[1] ¶           // → 10
daten = (42, "Hallo", #1, 3.14)
>> daten[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Jeder Versuch, ein Tupel direkt zu modifizieren, ist ein Fehler, unabhängig vom Operator — Unveränderlichkeit ist eine Eigenschaft des Werts, keine Ausnahme innerhalb jedes `$`.

---

## Destrukturierung

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[erster, *rest] = arr
>> erster ¶            // → 10
>> rest ¶              // → [20, 30, 40, 50]
```

```zymbol
punkt = (100, 200)
(px, py) = punkt
>> px " " py ¶          // → 100 200
```

```zymbol
person = #(name: "Anna", alter: 25)
#(name: n, alter: a) = person
>> n " " a ¶            // → Anna 25
```

> Die Klammerform ist typisiert: `[…]` nimmt ein Array, `(…)` ein Tupel, `#(…)` ein Wörterbuch. Der letzte Name **absorbiert den Rest**, daher schlägt die Destrukturierung niemals aufgrund der Länge fehl — `(a, b, c) = (1,2,3,4,5)` ergibt `c = (3,4,5)`, und `##_` wenn nichts übrig bleibt.

---

## Funktionen höherer Ordnung

```zymbol
zahlen = [1, 2, 3, 4, 5]
>> (zahlen$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (zahlen$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (zahlen$< (0, (akk, x) -> akk + x)) ¶ // → 15
```

```zymbol
zahlen = [1, 2, 3, 4, 5, 6]
verdoppeln(x) { <~ x * 2 }
ist_gross(x) { <~ x > 3 }
>> (zahlen$> verdoppeln) ¶    // → [2, 4, 6, 8, 10, 12]
>> (zahlen$| ist_gross) ¶    // → [4, 5, 6]
```

```zymbol
basis = [#(name: "Carla", alter: 28), #(name: "Anna", alter: 25)]
nach_alter = basis$^ (a, b -> a.alter < b.alter)
>> nach_alter[1].name ¶     // → Anna
```

> Eine benannte Funktion geht zu einer HOF **ohne Klammern**: `zahlen$> verdoppeln`. `zahlen$> (verdoppeln)` zu schreiben ist ein Parsefehler, denn `(` öffnet ein Lambda.

---

## Pipe-Operator

```zymbol
verdoppeln = x -> x * 2
addieren = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> verdoppeln(_)) ¶    // → 10
>> (10 |> addieren(_, 5)) ¶  // → 15
>> (5 |> verdoppeln(_) |> inc(_)) ¶ // → 11
```

---

## Fehlerbehandlung

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Division durch Null" ¶  // → Division durch Null
} :! {
    >> "andere: " _err ¶
} :> {
    >> "wird immer ausgeführt" ¶        // → wird immer ausgeführt
}
```

| Typ | Wann |
|------|------|
| `##Div` | Division durch Null |
| `##Index` | Index außerhalb der Grenzen |
| `##Key` | Schlüssel nicht im Wörterbuch |
| `##Range` | Außerhalb des sicheren Ganzzahlbereichs |
| `##Type` | Typkonflikt |
| `##Parse` | Datenparsing |
| `##IO` | Datei / System |
| `##Network` | Netzwerkfehler |
| `##DB` | Datenbank |
| `##Time` | Ein Datum, das nicht existiert |
| `##_` | Jeder Fehler (fängt alles) |

`!` ist das Symbol für **Fehler und Gewalt**, und es wird in beiden Familien gleich gelesen: `$!` fragt einen Wert, ob er ein Fehler ist; `$!!`, mit verdoppeltem Symbol, propagiert ihn nach oben, ohne zu fragen.

> Standardbibliotheksfehler kommen als **weiche Fehlerwerte** zurück, die Sie mit `$!` testen oder mit `!?` abfangen, anstatt abzubrechen. `$!!` propagiert einen zum Aufrufer.

---

## Module

```zymbol
# rechner {
    #> { addieren, PI }

    PI := 3.14159
    addieren(a, b) { <~ a + b }
}
```

```zymbol
<# ./rechner => r

>> r::addieren(5, 3) ¶
>> r.PI ¶
```

```zymbol
# meine_bib {
    #> { interne_add => summe }

    interne_add(a, b) { <~ a + b }
}
```

Die beiden Modulsymbole sind dieselbe Idee, nun auf Dateien angewendet: `#` ist die Ebene der **Deklaration** — was eine Sache *ist*, nicht ihr Wert — und der Pfeil sagt, in welche Richtung der Code reist:

```text
<#   der Pfeil tritt ein: importieren, aus anderer Datei holen
#>   der Pfeil tritt aus: exportieren, anderen Dateien anbieten
```

Ein Richtungssymbol sitzt immer an dem Rand, der in die Richtung zeigt, in die es zeigt. Es ist derselbe Grund, warum `<~` nach links zurückkehrt (aus der Funktion hinaus) und `->` nach rechts eintritt (in den Körper des Lambdas).

> **Ein Modul deklariert, was es exportiert.** Der `#>`-Block ist obligatorisch — ihn wegzulassen ist **E014**, und `#> { }` ist die Art und Weise, wie ein Modul sagt, dass seine Oberfläche leer ist. `::` ruft eine Funktion auf, `.` liest eine Konstante. Nur Importe, der Exportblock, Literalinitialisierer und Funktionsdefinitionen dürfen im Modulkörper erscheinen; alles Ausführbare ist **E013**.

---

## Standardbibliothek

Native Module, importiert wie jedes andere:

| Modul | Funktionen |
|-------|------------|
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

>> t::width("手番") ¶            // → 4   zwei Glyphen, vier Spalten
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

tag = T::of(2026, 1, 31)
>> T::format(tag, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(tag, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` misst **Anzeigespalten**, nicht Zeichen: CJK und die meisten Emojis sind 2 Spalten breit, also legen Sie eine Tabelle mit `t::width` an, niemals mit `$#`.
> In `std/time` ist ein Zeitpunkt in Millisekunden seit der Epoche. Unter einem Tag ist es eine Dauer, ab einem Tag ist es Kalender — also fällt ein Monat auf denselben Tag im Monat, begrenzt. `differenz(a, b)` ist `a - b`, also ergibt der frühere Zeitpunkt zuerst eine negative Antwort.

---

## Pakete

Eine `.zyp`-Datei bündelt ein Multifile-Programm in eine portable Datei. Es ist ein Archiv von **Quellcode**, kein Binärprogramm, also läuft es überall, wo ein `zymbol`-Binärprogramm läuft.

```bash
zymbol package meinprojekt/ --script main.zy -o meinprojekt.zyp
zymbol run meinprojekt.zyp
```

> Das Archiv enthält ein Manifest (`zyp.toml`), das seine Einstiegsskripte und die benötigte Engine-Version deklariert. `zymbol run` extrahiert es in ein temporäres Verzeichnis und führt es von dort aus, sodass der Code wegwerfbar ist, während das, was das Skript schreibt, in Ihr tatsächliches Arbeitsverzeichnis fällt. Der Spielplatz lädt ebenfalls `.zyp`-Dateien.

---

## Numerische Modi

Zymbol kann Zahlen in **69 Unicode-Ziffernschriften** schreiben — Devanagari, Arabisch-Indisch, Thailändisch, Klingonisch pIqaD, Mathematisch Fett, LCD-Segmente und mehr. Der Modus ist global für den Prozess und beeinflusst die Ausgabe; die Arithmetik bleibt unverändert.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisch-Indisch (U+0660–U+0669)
#๐๙#    // Thailändisch (U+0E50–U+0E59)
#09#    // Zurücksetzen auf ASCII
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

Ziffern jeder unterstützten Schrift sind gültige Literale im Quellcode:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Das Lesen ist symmetrisch — eine Ziffer wird in jeder Schrift verstanden:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` ist immer ASCII, daher bleibt `#0` visuell von der Ziffer Null in jeder Schrift unterscheidbar.
> `#,` und `#^` schreiben ihre Ziffern ebenfalls in der aktiven Schrift, und die Trennzeichen folgen ihr — aber das Paar kehrt sich nie um: `,` gruppiert und `.` trennt, in jeder Schrift.

---

## Datenoperatoren

```zymbol
f = ##.42         // zu Gleitkommazahl
i = ###3.7        // zu Ganzzahl, gerundet  → 4
t = ##!3.7        // zu Ganzzahl, abgeschnitten  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Eine Gleitkommazahl wird als Ziffern ausgegeben, niemals als Exponent, und lässt das abschließende `.0` weg — `##.42` schreibt `42` und ist dennoch eine Gleitkommazahl, wie `f#?` zeigt.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   abgesichert: gibt die Eingabe unverändert zurück
>> ##!'A' ¶        // → 65    der Codepunkt eines Zeichens
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          auf 2 Dezimalstellen runden
>> #!2|pi| ¶       // → 3.14          auf 2 Dezimalstellen abschneiden
>> #,|1234567| ¶   // → 1,234,567     Tausendertrennzeichen
>> #^|12345.678| ¶ // → 1.2345678e4   wissenschaftliche Notation
```

```zymbol
>> 0x41 ¶        // → A   hexadezimal
>> 0b01000001 ¶  // → A   binär
>> 0o101 ¶       // → A   oktal
>> 0d65 ¶        // → A   dezimal
```

> Ein Basisliteral im ASCII-Bereich ist ein **Zeichen**: `0d65 == 'A'` ist `#1`, und `0d65 == 65` ist `#0`. Alle vier Basen buchstabieren dasselbe Zeichen.

---

## Shell-Integration

```zymbol
heute = <\ date +%Y-%m-%d \>
>> "Heute: " heute
```

```zymbol
ausgabe = </"./unter_skript.zy"/>
>> ausgabe
```

> `<\ … \>` erfasst stdout und stderr, wobei der abschließende Zeilenumbruch entfernt wird.
> `>< args` erfasst die Befehlszeilenargumente als Zeichenketten-Array.

---

## Vollständiges Beispiel: FizzBuzz

```zymbol
klassifizieren(zahl) {
    ? zahl % 15 == 0 { <~ "FizzBuzz" }
    _? zahl % 3  == 0 { <~ "Fizz" }
    _? zahl % 5  == 0 { <~ "Buzz" }
    <~ zahl
}

@ i:1..20 { >> klassifizieren(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (eine pro Zeile)
```

---

## Wie Symbole kombiniert werden

Sie haben im gesamten Handbuch dasselbe gesehen: **ein Operator ist keine Zeichnung zum Auswendiglernen, es sind mehrere Symbole hintereinander, und jedes trägt seine Bedeutung bei.** Jetzt, da Sie sie alle kennen, hier das vollständige Muster.

Zuerst kommt **in welcher Welt wir uns befinden**:

| Symbol | Welt | Sie haben es gesehen in |
|--------|------|-------------------------|
| `$` | eine Sammlung | `$#` `$+` `$?` `$^-` |
| `@` | die Zeit, alles, was sich wiederholt | `@!` `@>` `@~` |
| `#` | was eine Sache *ist*, nicht ihr Wert | `#?` `#(…)` `<#` `#>` |
| `>>` | aus dem Programm heraus | `>>` `>>!` `>>?` |
| `<<` | in das Programm hinein | `<<` `<<\|` `<<\|?` |
| `?` | fragen, ohne sich festzulegen | `?` `_?` `??` `$?` |
| `!` | Gewalt, oder Fehler | `@!` `$!` `!?` |

Dann kommt **was dort getan wird**: `+` hinzufügen, `-` entfernen, `^` ordnen, `~` modifizieren, `#` zählen, `|` eine einzelne Einheit, `:` einen Namen binden.

Und zwei Regeln, die niemals versagen:

**Ein Symbol zu verdoppeln macht es erschöpfend.** `?` fragt einmal, `??` testet viele Fälle. `$?` fragt, ob ein Wert vorhanden ist, `$??` gibt jeden Ort zurück, an dem er sich befindet. `!` markiert einen Fehler, `!!` propagiert ihn, ohne zu fragen.

**Das Modus-Symbol kommt immer zuletzt.** Wenn `?` oder `!` erscheinen, um zu sagen, *wie* etwas getan wird — zögerlich oder gewaltsam — sind sie das letzte Symbol des Operators: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:aeusser!`. Nach ihnen folgt niemals eine Operation.

Etwas Praktisches ergibt sich daraus: **eine Kombination, die Sie noch nie gesehen haben, ergibt bereits Sinn, bevor Sie sie nachschlagen.** Wenn `$` Sammlung ist und `^` Ordnung und `-` umgekehrt, dann sortiert `$^-` absteigend, und niemand musste es Ihnen sagen.

Nicht das gesamte Inventar funktioniert so, und das zu sagen ist besser als zu tun. Die meisten Operatoren lassen sich sauber zerlegen. Sechs lassen sich zerlegen, bedeuten aber mehr als ihre Teile: `!?` `:!` `:>` `|>` `::` `$++`. Und zehn müssen auswendig gelernt werden, weil sie sich überhaupt nicht zerlegen lassen: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Die undurchsichtigen zu zählen, anstatt anzunehmen, dass es wenige sind, ist beabsichtigt: sie sind die tatsächlichen Lernkosten der Sprache. Die vollständige Referenz — das Inventar, die deklarierten Homographen und die Regeln, die ein neuer Operator erfüllen muss, um zu existieren — ist `SYMBOLS.md` im Interpreter-Repository.

---

## Symbolreferenz

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | Variable | `$#` | Länge |
| `:=` | Konstante | `$+` | anhängen |
| `>>` | Ausgabe | `$+[i]` | bei Index einfügen (1-basiert) |
| `<<` | Eingabe | `$-` | erstes nach Wert entfernen |
| `¶` / `\\` | Zeilenumbruch | `$--` | alle nach Wert entfernen |
| `?` | wenn | `$-[i]` | bei Index entfernen (1-basiert) |
| `_?` | sonst-wenn | `$-[i..j]` | Bereich entfernen (1-basiert) |
| `_` | sonst / Platzhalter | `$?` | enthält |
| `??` | Musterabgleich | `$??` | alle Indizes finden (1-basiert) |
| `\|\|` | Oder-Muster in einem Match-Zweig | `$[s..e]` | Slice (1-basiert) |
| `@` | Schleife | `$>` | abbilden |
| `@ N { }` | N-mal-Schleife | `$\|` | filtern |
| `@!` | abbrechen | `$<` | reduzieren |
| `@>` | fortsetzen | `$/ trenner` | Zeichenkette teilen |
| `@:name { }` | benannte Schleife | `$++ a b c` | durch Verkettung aufbauen |
| `@:name!` | benannt abbrechen | `$~~[p:r]` | Zeichenkette ersetzen |
| `@:name>` | benannt fortsetzen | `$*` | Zeichenkette wiederholen |
| `->` | Lambda | `arr[i]$~ v` | DIE EINZIGE Update-Form |
| `<~` | Rückgabe / Ausgabeparameter | `~` | Arbeitskopie-Parameter |
| `arr[i>j]` | Navigationsindex | `arr[p ; q]` | flache Extraktion |
| `$^+` | aufsteigend sortieren | `$^-` | absteigend sortieren |
| `$^` | mit Vergleich sortieren | `\|>` | Pipe |
| `!?` | versuchen | `:!` | fangen |
| `:>` | schließlich | `$!` | ist Fehler |
| `$!!` | Fehler propagieren | `#1` / `#0` | wahr / falsch |
| `##_` | Einheit — Abwesenheit | `[…]` | Array, ein Typ |
| `#[…]` | Array, deklarierte Mischung | `#(…)` | Wörterbuch |
| `(…)` | positionelles Tupel | `#()` | leeres Wörterbuch |
| `<#` | importieren | `#>` | exportieren |
| `#` | Modul deklarieren | `::` | Modul aufrufen |
| `.` | Feld / Konstantenzugriff | `#?` | Typ-Metadaten |
| `#\|..\|` | Zahl parsen | `##.` | zu Gleitkommazahl konvertieren |
| `###` | zu Ganzzahl konvertieren (runden) | `##!` | zu Ganzzahl konvertieren (abschneiden) |
| `#.N\|..\|` | runden | `#!N\|..\|` | abschneiden |
| `#,\|..\|` | Tausendertrennzeichen | `#^\|..\|` | wissenschaftlich |
| `#d0d9#` | numerischen Modus umschalten | `#09#` | auf ASCII zurücksetzen |
| `<\ ..\>` | Shell ausführen | `><` | CLI-Argumente |
| `\ var` | Variable zerstören | `°x` / `x°` | heiße Definition |
| `>>\|` | TUI-Block (Alternativbildschirm) | `>>~` | positionierte Ausgabe |
| `>>!` | Bildschirm löschen | `>>?` | Terminalgröße abfragen |
| `<<\|` | blockierender Tastendruck | `<<\|?` | nicht blockierender Tastendruck |
| `@~ N` | N Millisekunden schlafen | `0d` `0x` `0o` `0b` | Basisliterale |

---

## Versionsänderungen

### v0.0.9 — Die Sammlungen entscheiden _(September 2026)_

- **Breaking** Das Wörterbuch hat seine eigene Notation: `#(schlüssel: wert)`. Die nackte `(x: 1)` wird abgelehnt, und `#()` ist das leere Wörterbuch — was `()` niemals sein konnte
- **Breaking** Indexierte Zuweisung zurückgezogen: `arr[i] = v` und alle zusammengesetzten Formen. `=` gibt einen Wert an einen **NAMEN**; das Ändern eines Teils einer Sammlung ist `$~`
- **Breaking** Der verkettete Index `m[i][j]` wird sowohl zum Lesen als auch zum Schreiben abgelehnt — `>` ist das, was zwischen den Schritten steht
- **Breaking** Ein Modul muss deklarieren, was es exportiert (**E014**); `#> { }` ist die Art und Weise, wie ein Modul sagt, dass seine Oberfläche leer ist
- **Breaking** Ein Schleifenspezifizierer ist eine Anzahl oder eine Bedingung — keine Wahrhaftigkeit. `@ []` und `@ 3.5` werden abgelehnt
- **Hinzugefügt** `##_` — das Einheit-Literal, und wie ein Programm fragt, ob etwas abwesend ist
- **Hinzugefügt** `#[…]` — ein Array, dessen Mischung von Elementtypen deklariert ist
- **Hinzugefügt** `#?` unterscheidet die vier Sammlungen: `##]` `##[` `##)` `##(`
- **Hinzugefügt** `std/time` — die Uhr und der bürgerliche Kalender, mit Zeitzonen und Kalenderarithmetik
- **Hinzugefügt** Ein `<~>` auf oberster Ebene ist der Exit-Status des Programms
- **Hinzugefügt** `@ (k, v):paare` — ein Muster im Schleifenkopf
- **Hinzugefügt** `#|c|` liest eine Ziffer in einer der 69 Schriften; `#,` und `#^` schreiben in der aktiven
- **Geändert** `Ganzzahl` ist eine sichere Ganzzahl, ±(2⁵³ − 1), abgesichert in jeder Engine
- **Geändert** Eine benannte Funktion liest die Variablen der Datei beim Aufruf, nach Wert
- **Geändert** Eine Anweisung, die nur einen Namen liest, warnt, anstatt still zu passieren
- **Engines** 660 der 666 Korpusdateien stimmen in allen drei Engines überein, 0 abweichend

### v0.0.8 — Automatische Freigabe, `std/term` und Pakete _(August 2026)_

- **Hinzugefügt** Automatische Zerstörung bei letzter Verwendung — unsichtbar; senkt nur den Speicherspitzenwert
- **Hinzugefügt** `std/term` — Anzeigemetriken in Terminal-Spalten
- **Hinzugefügt** `##!` auf einem `Zeichen` — sein Unicode-Codepunkt
- **Hinzugefügt** Oder-Muster im Match: `'p' || 'P' => …`, Alternativen jeder Art in einem Zweig
- **Hinzugefügt** Zymbol-Pakete (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Hinzugefügt** `<~>` an der Aufrufstelle ist obligatorisch, wenn der Aufgerufene einen Ausgabeparameter deklariert
- **Behoben** Modulsystem-Parität in der Register-VM

### v0.0.7 — Native Standardbibliothek _(Juli 2026)_

- **Hinzugefügt** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — alle mit weichen Fehlerwerten
- **Hinzugefügt** Typisierte/validierte Eingabe: `<< ##.(5,2) "preis: " p`
- **Hinzugefügt** Postfix-Operatoren direkt in `>>` — keine Klammern nötig
- **Geändert** Abgesicherter Formatierer: weigert sich, Ausgabe zu schreiben, die er nicht erneut lesen kann

### v0.0.6 — Verfeinerung und Wissenschaftliche Bibliothek _(Juni 2026)_

- **Breaking** `=>` ersetzt `:` in Match-Zweigen und `<=` in Import/Export-Aliasen
- **Hinzugefügt** `std/math` und `std/random`
- **Hinzugefügt** Wörterbuch-Update per Schlüssel: `d["k"]$~ wert`

### v0.0.5 — TUI-Primitive und Heiße Definition _(Mai 2026)_

- **Hinzugefügt** TUI-Block `>>| { }`, positionierte Ausgabe `>>~`, Tasteneingabe `<<|` und `<<|?`
- **Hinzugefügt** `>>!` Bildschirm löschen, `>>?` Terminalgröße, `@~ N` schlafen
- **Hinzugefügt** Heiße Definition `°x` / `x°` und Zeichenkettenwiederholung `$*`

### v0.0.4 — 1-basierte Indizierung und Funktionen erster Klasse _(April 2026)_

- **Breaking** Alle Indizierung ist **1-basiert** — `arr[1]` ist das erste Element
- **Hinzugefügt** Benannte Funktionen als Werte erster Klasse; Modul-Block-Syntax `# name { }`
- **Hinzugefügt** Mehrdimensionale Indizierung `arr[i>j>k]` und flache Extraktion `arr[p ; q]`

### v0.0.3 — Unicode-Zahlensysteme _(April 2026)_

- **Hinzugefügt** 69 Unicode-Ziffernblöcke mit dem Modusumschalt-Token `#d0d9#`
- **Hinzugefügt** Boolesche Literale in jeder Schrift — `#१` / `#०`

### v0.0.2 — Neugestaltung der Sammlungs-API _(März 2026)_

- **Hinzugefügt** Die `$`-Operatorfamilie für Arrays und Zeichenketten
- **Hinzugefügt** Destrukturierungszuweisung und negative Indizes

### v0.0.1 — Erste öffentliche Veröffentlichung _(März 2026)_

- Baumwandernder Interpreter + Register-VM (`--vm`)
- Alle Kernkonstrukte: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Vollständige Unicode-Bezeichner, Modulsystem, Lambdas, Abschlüsse, Fehlerbehandlung
- REPL, LSP, VS-Code-Erweiterung, Formatierer (`zymbol fmt`)

---

_Zymbol-Lang — Symbolisch. Universal. Unveränderlich._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lizenz:** Dieses Handbuch ist lizenziert unter [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Volltext: `LICENSE-CC-BY-SA-4.0` in <https://github.com/zymbol-lang/web>. Der Interpreter und die Browser-Engine (`zymbol.js`) sind separate Werke, lizenziert unter AGPL-3.0-only.
