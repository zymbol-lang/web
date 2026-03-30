# Zymbol-Lang Handleiding

**Zymbol-Lang** is een symbolische programmeertaal. Er zijn geen sleutelwoorden — alles zijn symbolen. Het werkt hetzelfde in elke menselijke taal.

- Geen `if`, `while`, `return` — alleen `?`, `@`, `<~`
- Volledige Unicode — variabelen in elke taal of emoji
- Taalonafhankelijk — de code is identiek in alle talen

---

## Variabelen en Constanten

```zymbol
x = 10              // veranderlijk
PI := 3.14159       // constante — fout bij herindeling
naam = "Alice"
actief = #1         // booleaanse waarde waar
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

## Gegevenstypen

| Type | Letterwaarde | `#?` tag | Opmerkingen |
|------|-------------|----------|-------------|
| Int | `42`, `-7` | `###` | 64-bit met teken |
| Float | `3.14`, `1.5e10` | `##.` | Wetenschappelijke notatie OK |
| String | `"tekst"` | `##"` | Interpolatie: `"Hallo {naam}"` |
| Char | `'A'` | `##'` | Één Unicode-teken |
| Bool | `#1`, `#0` | `##?` | NIET numeriek — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Homogene elementen |
| Tuple | `(a, b)` | `##)` | Positioneel |
| Benoemde Tuple | `(x: 1, y: 2)` | `##)` | Benoemde velden |

```zymbol
// Type-introspectie — geeft (type, cijfers, waarde) terug
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Uitvoer en Invoer

```zymbol
>> "Hallo" ¶                      // ¶ of \\ voor expliciete newline
>> "a=" a " b=" b ¶               // juxtapositie — meerdere waarden
>> (arr$#) ¶                      // postfix-operatoren vereisen ( )

<< naam                           // lezen in variabele (geen prompt)
<< "Naam? " naam                  // met prompt
```

> `¶` (AltGr+R op Spaans toetsenbord) en `\\` zijn gelijkwaardige newlines.

---

## Operatoren

```zymbol
// Rekenkundig — gebruik toewijzingen; sommige operatoren werken niet direct in >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (gehele deling)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (machtsverheffing)

// Vergelijking
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logisch
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Tekenreeksen

```zymbol
// Drie aaneenschakelingsvormen
naam = "Alice"
n = 42

msg = "Hallo ", naam, "!"            // komma — in toewijzingen
>> "Hallo " naam " je hebt " n ¶    // juxtapositie — in >>
desc = "Hallo {naam}, je hebt {n}"  // interpolatie — overal
```

```zymbol
s = "Hallo Wereld"
len = s$#                  // 11
sub = s$[0..5]             // "Hallo"  (einde exclusief)
has = s$? "Wereld"         // #1
delen = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "HaLLo WerLd"
rep1 = s$~~["l":"L":1]     // "HaLlo Wereld"  (eerste N alleen)
```

> `+` is alleen voor getallen. Gebruik `,`, juxtapositie of interpolatie voor tekenreeksen.

---

## Controlestroom

```zymbol
x = 7

? x > 0 { >> "positief" ¶ }

? x > 100 {
    >> "groot" ¶
} _? x > 0 {
    >> "positief" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "negatief" ¶
}
```

> `{ }` accolades zijn **verplicht** zelfs voor één statement.

---

## Match

```zymbol
// Bereiken
punten = 85
beoordeling = ?? punten {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> beoordeling ¶    // → B

// Tekenreeksen
kleur = "rood"
code = ?? kleur {
    "rood"   : "#FF0000"
    "groen"  : "#00FF00"
    _        : "#000000"
}

// Bewakers
temp = -5
staat = ?? temp {
    _? temp < 0  : "ijs"
    _? temp < 20 : "koud"
    _? temp < 35 : "warm"
    _            : "heet"
}
>> staat ¶    // → ijs

// Statemvorm (blok-armen)
?? n {
    0       : { >> "nul" ¶ }
    _? n < 0: { >> "negatief" ¶ }
    _       : { >> "positief" ¶ }
}
```

---

## Lussen

```zymbol
@ i:0..4  { >> i " " }        // bereik inclusief:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // met stap:           1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omgekeerd:          5 4 3 2 1 0

getal = 1
@ getal <= 64 { getal *= 2 }
>> getal ¶                    // → 128  (while)

fruit = ["appel", "peer", "druif"]
@ f:fruit { >> f ¶ }          // for-each array

@ c:"hallo" { >> c "-" }
>> ¶                          // → h-a-l-l-o-  (for-each tekenreeks)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> doorgaan
    ? i > 7 { @! }             // @! onderbreken
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Oneindige lus
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Gelabelde lus (geneste onderbreking)
count = 0
@ @buiten {
    count++
    ? count >= 3 { @! buiten }
}
>> count ¶                    // → 3
```

---

## Functies

```zymbol
optellen(a, b) { <~ a + b }
>> optellen(3, 4) ¶    // → 7

faculteit(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faculteit(n - 1)
}
>> faculteit(5) ¶    // → 120
```

Functies hebben **geïsoleerde scope** — ze kunnen geen externe variabelen lezen. Gebruik uitvoerparameters `<~` om caller-variabelen te wijzigen:

```zymbol
wissel(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
wissel(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Benoemde functies zijn geen eersterangsburgers. Om als argument door te geven: `x -> fn(x)`.

---

## Lambda's en Sluitingen

```zymbol
dubbel = x -> x * 2
som = (a, b) -> a + b
>> dubbel(5) ¶    // → 10
>> som(3, 7) ¶    // → 10

// Blok-lambda
indelen = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}

// Sluiting — vangt buitenste scope
factor = 3
drievoud = x -> x * factor
>> drievoud(7) ¶    // → 21

// Fabriek
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — toegang (0-geïndexeerd)
arr[-1]         // 5 — negatieve index (laatste)
arr$#           // 5 — lengte (gebruik (arr$#) in >>)

arr = arr$+ 6            // toevoegen → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // invoegen op index 2
arr3 = arr$- 3           // eerste voorkomen van waarde verwijderen
arr4 = arr$-- 3          // alle voorkomens verwijderen
arr5 = arr$-[0]          // verwijder op index
arr6 = arr$-[1..3]       // verwijder bereik (einde exclusief)

has = arr$? 3            // #1 — bevat
pos = arr$?? 3           // [2] — alle indices van waarde
sl = arr$[0..3]          // [1,2,3] — stuk (einde exclusief)
sl2 = arr$[0:3]          // [1,2,3] — hetzelfde, telgebaseerde syntaxis

asc = arr$^+             // gesorteerd oplopend  (alleen primitieven)
desc = arr$^-            // gesorteerd aflopend  (alleen primitieven)

// Benoemde/positionele tuple-arrays — gebruik $^ met vergelijkingslambda
db = [(naam: "Carla", leeftijd: 28), (naam: "Ana", leeftijd: 25), (naam: "Bob", leeftijd: 30)]
op_leeftijd  = db$^ (a, b -> a.leeftijd < b.leeftijd)
op_naam      = db$^ (a, b -> a.naam > b.naam)
>> op_leeftijd[0].naam ¶     // → Ana
>> op_naam[0].naam ¶         // → Carla

arr[1] = 99              // bijwerken op locatie
arr = arr[1]$~ 99        // functioneel bijwerken — geeft nieuwe array terug
```

> Alle collectie-operatoren geven een **nieuwe array** terug. Wijs terug toe: `arr = arr$+ 4`.
> Operatoren kunnen niet worden gekoppeld — gebruik tussenliggende toewijzingen.
> `$^+` / `$^-` sorteren **primitieve arrays** (getallen, strings). Voor tuple-arrays gebruik `$^` met een vergelijkingslambda.

```zymbol
// Geneste arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Destructuring

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eerste, *rest] = arr        // eerste=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ negeert

// Positionele tuple
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Benoemde tuple
persoon = (naam: "Ana", leeftijd: 25, stad: "Madrid")
(naam: n, leeftijd: l) = persoon   // n="Ana"  l=25
```

---

## Tupels

```zymbol
// Positioneel
punt = (10, 20)
>> punt[0] ¶    // → 10

// Benoemd
persoon = (naam: "Alice", leeftijd: 25)
>> persoon.naam ¶    // → Alice
>> persoon[0] ¶      // → Alice  (index werkt ook)

// Genest
pos = (x: 10, y: 20)
p = (pos: pos, label: "oorsprong")
>> p.pos.x ¶        // → 10
```

---

## Hogere-orde Functies

> HOF-operatoren vereisen **inline lambda** — lambda-variabelen direct doorgeven werkt niet.

```zymbol
getallen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdubbeld  = getallen$> (x -> x * 2)                // map  → [2,4,6…20]
paren       = getallen$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totaal      = getallen$< (0, (acc, x) -> acc + x)     // reduce → 55

// Keten via tussenliggende
stap1 = getallen$| (x -> x > 3)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Benoemde functies in HOF — omhullen in lambda
dubbel(x) { <~ x * 2 }
r = getallen$> (x -> dubbel(x))    // ✅
```

---

## Pipe-operator

De rechterkant vereist altijd `_` als tijdelijke aanduiding voor de doorgegeven waarde:

```zymbol
dubbel = x -> x * 2
optellen = (a, b) -> a + b
inc = x -> x + 1

5 |> dubbel(_)        // → 10
10 |> optellen(_, 5)  // → 15
5 |> optellen(2, _)   // → 7

// Gekoppeld
r = 5 |> dubbel(_) |> inc(_) |> dubbel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Foutafhandeling

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deling door nul" ¶
} :! {
    >> "andere: " _err ¶    // _err bevat het foutbericht
} :> {
    >> "wordt altijd uitgevoerd" ¶
}
```

| Type | Wanneer |
|------|---------|
| `##Div` | Deling door nul |
| `##IO` | Bestand / systeem |
| `##Index` | Index buiten bereik |
| `##Type` | Type-fout |
| `##Parse` | Gegevensparsing |
| `##Network` | Netwerkfouten |
| `##_` | Elke fout (alles-vanger) |

---

## Modules

```zymbol
// lib/calc.zy
# calc

#> { optellen, get_PI }    // exports MOETEN voor definities staan

_PI := 3.14159
optellen(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — directe constante toegang via alias niet ondersteund
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias verplicht

>> c::optellen(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exporteren met een andere publieke naam
# mijnlib
#> { _intern_optellen <= som }

_intern_optellen(a, b) { <~ a + b }
```

```zymbol
<# ./mijnlib <= m

>> m::som(3, 4) ¶    // → 7  (interne naam _intern_optellen is verborgen)
```

---

## Gegevensoperatoren

```zymbol
// Tekenreeks naar getal ontleden
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (veilig mislukken, geen fout)

// Afronden / afkappen
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (afronden op 2 decimalen)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (afkappen)

// Getalopmaak
fmt = #,|1234567|  // → 1.234.567  (kommagescheiden)
sci = #^|12345.678|    // → 1.2345678e4  (wetenschappelijk)

// Basis-letterwaarden
a = 0x41         // → 'A'  (hexadecimaal)
b = 0b01000001   // → 'A'  (binair)
c = 0o101        // → 'A'  (octaal)

// Basisconversie uitvoer
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integratie

```zymbol
datum = <\ date +%Y-%m-%d \>     // stdout vastleggen (inclusief \n)
>> "Vandaag: " datum

bestand = "data.txt"
inhoud = <\ cat {bestand} \>     // interpolatie in opdrachten

uitvoer = </"./subscript.zy"/>   // ander Zymbol-script uitvoeren, uitvoer vastleggen
>> uitvoer
```

> `><` legt CLI-argumenten vast als string-array (alleen tree-walker).

---

## Volledig Voorbeeld: FizzBuzz

```zymbol
indelen(getal) {
    ? getal % 15 == 0 { <~ "FizzBuzz" }
    _? getal % 3  == 0 { <~ "Fizz" }
    _? getal % 5  == 0 { <~ "Buzz" }
    _ { <~ getal }
}

@ i:1..20 { >> indelen(i) ¶ }
```

---

## Symbolenreferentie

| Symbool | Bewerking | Symbool | Bewerking |
|---------|-----------|---------|-----------|
| `=` | variabele | `$#` | lengte |
| `:=` | constante | `$+` | toevoegen |
| `>>` | uitvoer | `$+[i]` | invoegen op index |
| `<<` | invoer | `$-` | eerste op waarde verwijderen |
| `¶` / `\\` | newline | `$--` | alle op waarde verwijderen |
| `?` | als | `$-[i]` | verwijder op index |
| `_?` | anders-als | `$-[i..j]` | verwijder bereik |
| `_` | anders / wildcard | `$?` | bevat |
| `??` | match | `$??` | alle indices zoeken |
| `@` | lus | `$[s..e]` | stuk |
| `@!` | onderbreken | `$>` | map |
| `@>` | doorgaan | `$\|` | filter |
| `->` | lambda | `$<` | reduce |
| `$^+` | oplopend sorteren (primitieven) | `$^-` | aflopend sorteren (primitieven) |
| `$^` | sorteren met vergelijking (tuples) | | |
| `<~` | teruggave | `!?` | proberen |
| `\|>` | pipe | `:!` | vangen |
| `#1` | waar | `:>` | altijd |
| `#0` | onwaar | `$!` | is fout |
| `<#` | importeren | `$!!` | fout doorgeven |
| `#` | module declareren | `#>` | exporteren |
| `::` | module-aanroep | `.` | veldzoegang |
| `#\|..\|` | getal ontleden | `#?` | type-metadata |
| `#.N\|..\|` | afronden | `#!N\|..\|` | afkappen |
| `c\|..\|` | kommanotatie | `e\|..\|` | wetenschappelijk |
| `<\ ..\>` | shell uitvoeren | `><` | CLI-argumenten |

---

*Zymbol-Lang — Symbolisch. Universeel. Onveranderlijk.*

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
