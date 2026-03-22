# Compacte Zymbol-Lang Documentatie

**Zymbol-Lang** is een symbolische programmeertaal. Er zijn geen sleutelwoorden — alles zijn symbolen. Het werkt hetzelfde in elke menselijke taal.

---

## Filosofie

- Geen sleutelwoorden (`if`, `while`, `return` bestaan niet — alleen symbolen `?`, `@`, `<~`)
- Volledige Unicode — variabelen in elke taal of emoji 👋
- Taalonafhankelijk — de code is identiek in alle talen

---

## Variabelen en Constanten

```zymbol
x = 10          // variabele (aanpasbaar)
PI := 3.14159   // constante (onveranderlijk — fout bij herindeling)
naam = "Ana"
actief = #1     // booleaanse waarde waar
👋 := "Hallo"
```

### Samengestelde Toewijzing

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

## Gegevenstypen

| Type           | Voorbeeld           | Symbool `#?` | Opmerkingen                            |
|----------------|---------------------|--------------|----------------------------------------|
| Geheel getal   | `42`, `-7`          | `###`        | 64-bit met teken                       |
| Drijvend komma | `3.14`, `1.5e10`    | `##.`        | Wetenschappelijke notatie OK           |
| Tekenreeks     | `"hallo"`           | `##"`        | Interpolatie: `"Hallo {naam}"`         |
| Teken          | `'A'`               | `##'`        | Één Unicode-teken                      |
| Booleaans      | `#1`, `#0`          | `##?`        | GEEN numerieke 1 en 0                  |
| Array          | `[1, 2, 3]`         | `##]`        | Alle elementen van hetzelfde type      |
| Tupel          | `(a, b)`            | `##)`        | Positioneel                            |
| Benoemde tupel | `(x: 1, y: 2)`      | `##)`        | Toegang via naam of index              |

---

## Uitvoer en Invoer

```zymbol
// Uitvoer — GEEN automatische newline
>> "Hallo" ¶                    // ¶ of \\ geeft een expliciete nieuwe regel
>> "a=" a " b=" b ¶             // meerdere waarden door juxtapositie
>> "som=" sumar(2, 3) ¶         // functieaanroepen op elke positie
>> (arr$#) ¶                    // postfix-operatoren vereisen haakjes

// Invoer
<< naam                         // zonder prompt — leest in variabele
<< "Naam? " naam                // met prompt
```

> `¶` of `\\` is het equivalent van newline.

---

## Tekenreeksaaneenschakeling

Drie geldige methoden — elk voor zijn context:

```zymbol
naam = "Ana"
getal = 25

// 1. Komma — in toewijzingen met = of :=
msg = "Hallo ", naam, "!"               // → Hallo Ana!
TITEL := "Gebruiker: ", naam

// 2. Juxtapositie — in uitvoer >>
>> "Hallo " naam " je bent " getal " jaar oud" ¶   // → Hallo Ana je bent 25 jaar oud

// 3. Interpolatie — in elke context
desc = "Hallo {naam}, je bent {getal} jaar oud"    // → Hallo Ana, je bent 25 jaar oud
```

> **Opmerking**: `+` is alleen voor getallen. Gebruik met tekenreeksen geeft een waarschuwing.

---

## Controlestroom

```zymbol
x = 7

// Eenvoudige als
? x > 0 { >> "positief" ¶ }

// Als / anders als / anders
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

De blokken `{ }` zijn **verplicht**, ook als ze maar één regel bevatten.

---

## Match

```zymbol
// Match met bereiken
punten = 85
beoordeling = ?? punten {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> beoordeling ¶    // → B

// Match met bewakers (voorwaarden)
temp = -5
staat = ?? temp {
    _? temp < 0  : "ijs"
    _? temp < 20 : "koud"
    _? temp < 35 : "warm"
    _            : "heet"
}
>> staat ¶    // → ijs

// Match met tekenreeksen
kleur = "rood"
code = ?? kleur {
    "rood"  : "#FF0000"
    "groen" : "#00FF00"
    _       : "#000000"
}
>> code ¶
```

---

## Lussen

```zymbol
// Inclusief bereik: 0..4 itereert 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Bereik met stappen
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Omgekeerd bereik
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Terwijl (while)
getal = 1
@ getal <= 64 { getal *= 2 }
>> getal ¶    // → 128

// Voor elk element
fruit = ["appel", "peer", "druif"]
@ f:fruit { >> f ¶ }

// Over tekens van tekenreeks
@ c:"hallo" { >> c "-" }
>> ¶    // → h-a-l-l-o-

// Onderbreken en Doorgaan
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> doorgaan
    ? i > 7 { @! }          // @! onderbreken
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Functies

```zymbol
// Declaratie en aanroep
som(a, b) { <~ a + b }
>> som(3, 4) ¶    // → 7

// Recursie
faculteit(getal) {
    ? getal <= 1 { <~ 1 }
    <~ getal * faculteit(getal - 1)
}
>> faculteit(5) ¶    // → 120

// Functies hebben een geïsoleerd bereik — geen toegang tot externe variabelen
globaal = 100
testen() {
    x = 42    // lokaal, geen toegang tot 'globaal'
    <~ x
}
>> testen() ¶    // → 42
```

> **Belangrijk**: Functies gedeclareerd met `naam(params){ }` zijn geen eersterangsburgers.
> Gebruik `x -> naam(x)` om ze als argument door te geven.

---

## Lambda's en Sluitingen

```zymbol
// Eenvoudige lambda (impliciete teruggave)
dubbel = x -> x * 2
som = (a, b) -> a + b
>> dubbel(5) ¶     // → 10
>> som(3, 7) ¶     // → 10

// Lambda met blok (expliciete teruggave)
indelen = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}
>> indelen(5) ¶     // → positief
>> indelen(0) ¶     // → nul
>> indelen(-5) ¶    // → negatief

// Sluitingen — lambda's vangen variabelen uit het buitenste bereik
factor = 3
driemaal = x -> x * factor    // vangt 'factor'
>> driemaal(7) ¶    // → 21

// Functiefabriek
make_adder(getal) { <~ x -> x + getal }
add10 = make_adder(10)
add20 = make_adder(20)
>> add10(5) ¶    // → 15
>> add20(5) ¶    // → 25

// Lambda's als waarden: opslaan in arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[1](5) ¶    // → 10
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [10, 20, 30, 40, 50]

// Toegang (index begint bij 0)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30

// Lengte (vereist haakjes in >>)
getal = arr$#
>> getal ¶           // → 5
>> (arr$#) ¶         // → 5

// Toevoegen, verwijderen, controleren, slice
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // verwijdert index 0: [20, 30, 40, 50, 60]
heeft = arr$? 30             // → #1
stuk = arr$[0..2]            // slice [0,2): [20, 30]

// Element bijwerken
arr[1] = 99
>> arr ¶    // → [20, 99, 40, 50, 60]

// Voor elk element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` retourneren een **nieuwe array** — toewijzen aan dezelfde naam: `arr = arr$+ 4`.
> Niet koppelen: `arr$+ 4$+ 5` werkt niet — gebruik twee toewijzingen.

---

## Tupels

```zymbol
// Positionele tupel
punt = (10, 20)
>> punt[0] ¶    // → 10
>> punt[1] ¶    // → 20

// Benoemde tupel
persoon = (naam: "Alice", leeftijd: 25)
>> persoon.naam ¶         // → Alice
>> persoon.leeftijd ¶     // → 25
>> persoon[0] ¶           // → Alice (index werkt ook)

// Genest
pos = (x: 3, y: 4)
p = (pos: pos, label: "oorsprong")
>> p.label ¶    // → oorsprong
>> p.pos.x ¶    // → 3
```

---

## Hogere-orde Functies

De HOF-operatoren vereisen een **inline lambda** — geen directe lambda-variabele.

```zymbol
getallen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
dubbelen = getallen$> (x -> x * 2)
>> dubbelen ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
paren = getallen$| (x -> x % 2 == 0)
>> paren ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (beginwaarde, (accumulator, element) -> expr)
totaal = getallen$< (0, (acc, x) -> acc + x)
>> totaal ¶    // → 55

// Geen directe koppeling — gebruik tussenliggende variabelen
stap1 = getallen$| (x -> x > 5)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Foutafhandeling

```zymbol
// Proberen / Vangen / Altijd
!? {
    x = 10 / 0
} :! ##Div {
    >> "deling door nul" ¶
} :! ##IO {
    >> "IO-fout" ¶
} :! {
    >> "andere fout: " _err ¶    // _err bevat het foutbericht
} :> {
    >> "wordt altijd uitgevoerd" ¶
}

// Vangen op indextype
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "index buiten bereik" ¶
}
```

### Fouttypen

| Type        | Wanneer het optreedt           |
|-------------|-------------------------------|
| `##Div`     | Deling door nul               |
| `##IO`      | Bestand / systeem             |
| `##Index`   | Index buiten bereik           |
| `##Type`    | Type-fout                     |
| `##Parse`   | Gegevensparsing               |
| `##Network` | Netwerkfouten                 |
| `##_`       | Elke fout (alles-vanger)      |

---

## Modules

```zymbol
// Bestand: lib/calc.zy
# calc                    // declaratie — altijd bovenaan

#> {                      // exports — MOET vóór de definities staan
    som
    get_PI
}

_PI := 3.14159

som(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter voor constante (vereiste omweg)
```

```zymbol
// Bestand: main.zy
<# ./lib/calc <= c         // alias verplicht

>> c::som(5, 3) ¶          // → 8  — aanroep met ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Opmerking**: `alias.NAAM` voor toegang tot constanten werkt niet — gebruik een getter-functie.

---

## Volledig Voorbeeld: FizzBuzz

```zymbol
indelen(getal) {
    ? getal % 15 == 0 { <~ "SisZoem" }
    _? getal % 3  == 0 { <~ "Sis" }
    _? getal % 5  == 0 { <~ "Zoem" }
    _ { <~ getal }
}
@ i:1..20 { >> indelen(i) ¶ }
```

---

## Symbolenreferentie

| Symbool | Bewerking         | Symbool    | Bewerking              |
|---------|-------------------|------------|------------------------|
| `=`     | variabele         | `$#`       | lengte                 |
| `:=`    | constante         | `$+`       | toevoegen (append)     |
| `>>`    | uitvoer           | `$-`       | verwijderen (per index)|
| `<<`    | invoer            | `$?`       | bevat                  |
| `¶`/`\` | newline           | `$[s..e]`  | slice                  |
| `?`     | als (if)          | `$>`       | map                    |
| `_?`    | anders als (elif) | `$\|`      | filter                 |
| `_`     | anders / wildcard | `$<`       | reduce                 |
| `??`    | match             | `!?`       | proberen (try)         |
| `@`     | lus               | `:!`       | vangen (catch)         |
| `@!`    | onderbreken       | `:>`       | altijd (finally)       |
| `@>`    | doorgaan          | `$!`       | is fout                |
| `->`    | lambda            | `$!!`      | fout doorgeven         |
| `<~`    | teruggave         | `#`        | module declareren      |
| `\|>`   | pipe              | `#>`       | exporteren             |
| `#1`    | waar              | `<#`       | importeren             |
| `#0`    | onwaar            | `::`       | module-aanroep         |

---

*Zymbol-Lang — Symbolisch. Universeel. Onveranderlijk.*

---

**Disclaimer:** Deze documentatie is gemaakt en vertaald door kunstmatige intelligentie (AI). Er zijn alle inspanningen geleverd om de nauwkeurigheid te waarborgen, maar sommige vertalingen of voorbeelden kunnen fouten bevatten. De gezaghebbende referentie is de [Zymbol-Lang specificatie](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
