> **Opmerking:** Deze documentatie is gemaakt en vertaald door kunstmatige intelligentie (KI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Handleiding

> **Herzien voor v0.0.5 — 2026-05-12**

**Zymbol-Lang** is een symbolisch programmeertaal. Geen sleutelwoorden — alles is een symbool. Werkt identiek in elke menselijke taal.

- Geen `if`, `while`, `return` — alleen `?`, `@`, `<~`
- Volledig Unicode — identifiers in elke taal of emoji
- Menselijk-taal-agnostisch — de code is overal hetzelfde

**Interpreterversie**: v0.0.5 | **Testdekking**: 436/436 (TW ↔ VM pariteit)

---

## Variabelen & Constanten

```zymbol
x = 10              // veranderlijke variabele
PI := 3.14159       // constante — hertoewijzing is een uitvoeringsfout
naam = "Alice"
actief = #1         // booleaans waar
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

`°` (graagteken, U+00B0) initialiseert automatisch een variabele naar zijn neutrale waarde bij eerste gebruik:

```zymbol
getallen = [3, 1, 4, 1, 5]
@ n:getallen {
    °totaal += n    // auto-init naar 0 boven lus; overleeft na @
}
>> totaal ¶         // → 14
```

> `°x` (prefix) verankert boven de lus — resultaat toegankelijk na `@`.
> `x°` (postfix) verankert binnenin de lus — verdwijnt wanneer de lus eindigt.
> Alleen boomwandeling.

---

## Gegevenstypen

| Type | Literal | `#?`-tag | Opmerkingen |
|------|---------|----------|-------------|
| Geheel | `42`, `-7` | `###` | 64-bit getekend |
| Decimaal | `3.14`, `1.5e10` | `##.` | Wetenschappelijke notatie OK |
| Tekst | `"tekst"` | `##"` | Interpolatie: `"Hallo {naam}"` |
| Teken | `'A'` | `##'` | Enkel Unicode-teken |
| Booleaans | `#1`, `#0` | `##?` | NIET numeriek — `#1 ≠ 1` |
| Reeks | `[1, 2, 3]` | `##]` | Homogene elementen |
| Tupel | `(a, b)` | `##)` | Positioneel |
| Benoemde Tupel | `(x: 1, y: 2)` | `##)` | Benoemde velden |
| Functie | benoemde functiereferentie | `##()` | Eerste klasse; weergave `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Eerste klasse; weergave `<lambd/N>` |

```zymbol
// Type-introspectie — geeft (type, cijfers, waarde) terug
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Uitvoer & Invoer

```zymbol
>> "Hallo" ¶                      // ¶ of \\ voor expliciete nieuwe regel
>> "a=" a " b=" b ¶               // aaneenschakeling — meerdere waarden
>> (reeks$#) ¶                    // postfix-operatoren vereisen ( ) in >>

<< naam                           // lees in variabele (geen prompt)
<< "Voer naam in: " naam          // met prompt
```

> `¶` (AltGr+R op Spaans toetsenbord) en `\\` zijn gelijkwaardige nieuwe regels.

---

## TUI-primitieven

Terminalgebruikersinterface-operatoren voor interactieve programma's. De meeste vereisen een `>>| { }`-blok (alternatief scherm + ruwe modus).

```zymbol
>>| {
    >>!                             // alternatief scherm wissen
    >>~ (1, 1, 0, 10) > "Bezig"    // rij 1, kol 1, fg=10 (groen)
    @~ 1000                         // pauze 1 seconde (1000 ms)
    >>~ (2, 1) > "Gereed."
}
// terminal automatisch hersteld bij afsluiten
```

```zymbol
// Toetsdruk en terminalgrootte
>>| {
    [rijen, kolommen] = >>?              // terminalgrootte opvragen
    >>~ (1, 1) > "Terminal: " rijen " x " kolommen
    <<| toets                            // blokkerende toetsdruk
    >>~ (2, 1) > "Ingedrukt: " toets
}
```

> `>>!` wist scherm. `>>?` geeft `[rijen, kolommen]` terug. `@~ N` slaapt N milliseconden.
> `<<|` leest één toetsdruk (blokkerend); `<<|?` pollt zonder blokkering (geeft `'\0'` terug als geen).
> Positionele uitvoer-tupel: `(rij, kol, BKS, fg, bg)` — elk slot kan worden weggelaten met komma (`>>~ (,,, 196) > "rood"`).
> BKS-bitmask: `1`=Vet, `2`=Cursief, `4`=Onderstreept. ANSI 256-kleurenpalet (`0`=terminalstandaard).
> Alleen boomwandeling (behalve `>>!`, `>>?`, `@~`, `>>~` die ook in `--vm` draaien).

---

## Operatoren

```zymbol
// Rekenkunde
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (gehele deling)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (machtsverheffing)

// Vergelijking — toewijzen om te inspecteren
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logisch
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Tekst

```zymbol
// Twee samenvoegingsvormen
naam = "Alice"
n = 42

>> "Hallo " naam " jij hebt " n ¶      // aaneenschakeling — in >>
omschr = "Hallo {naam}, jij hebt {n}"  // interpolatie — overal
```

```zymbol
s = "Hallo Wereld"
len = s$#                  // 11
deel = s$[1..5]            // "Hallo"  (1-gebaseerd, einde inclusief)
heeft = s$? "Wereld"       // #1
delen = "a,b,c,d"$/ ','    // [a, b, c, d]  (splitsen op scheidingsteken)
verv = s$~~["l":"L"]       // "HaLLo WereLd"  (vervang alle)
verv1 = s$~~["l":"L":1]    // "HaLlo Wereld"  (eerste N)
lijn = "─" $* 20           // "────────────────────"  (N keer herhalen)
```

> `+` is alleen voor getallen. Gebruik `,`, aaneenschakeling of interpolatie voor tekst.

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

> `{ }`-accolades zijn **verplicht** zelfs voor een enkele instructie.

---

## Patroonkoppeling

```zymbol
// Bereiken
score = 85
cijfer = ?? score {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> cijfer ¶    // → B

// Tekst
kleur = "rood"
code = ?? kleur {
    "rood"   => "#FF0000"
    "groen"  => "#00FF00"
    _        => "#000000"
}

// Vergelijkingspatronen
temp = -5
staat = ?? temp {
    < 0  => "ijs"
    < 20 => "koud"
    < 35 => "warm"
    _    => "heet"
}
>> staat ¶    // → ijs

// Instructievorm (blok-armen)
n = -3
?? n {
    0    => { >> "nul" ¶ }
    < 0  => { >> "negatief" ¶ }
    _    => { >> "positief" ¶ }
}
```

---

## Lussen

```zymbol
@ i:0..4  { >> i " " }        // bereik inclusief:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // met stap:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omgekeerd:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (terwijl)

vruchten = ["appel", "peer", "druif"]
@ v:vruchten { >> v ¶ }       // voor-elk reeks

@ t:"hallo" { >> t "-" }
>> ¶                          // → h-a-l-l-o-  (voor-elk tekst)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> doorgaan
    ? i > 7 { @! }             // @! stoppen
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

// Gelabelde lus (geneste breuk)
teller = 0
@:buiten {
    teller++
    ? teller >= 3 { @:buiten! }
}
>> teller ¶                    // → 3
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

Functies hebben **geïsoleerde reikwijdte** — ze kunnen geen buitenste variabelen lezen. Gebruik uitvoerparameters `<~` om aanroepersvariabelen te wijzigen:

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

> Benoemde functies zijn **eerste klasse waarden** — geef direct door: `getallen$> verdubbel`. Voor inpakken: `x -> fn(x)` is ook geldig.

---

## Lambda & Sluiting

```zymbol
verdubbel = x -> x * 2
som = (a, b) -> a + b
>> verdubbel(5) ¶    // → 10
>> som(3, 7) ¶    // → 10

// Blok-lambda
klasseer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}

// Sluiting — vangt buitenste reikwijdte
factor = 3
verdrievoudig = x -> x * factor
>> verdrievoudig(7) ¶    // → 21

// Fabriek
maak_optelaar(n) { <~ x -> x + n }
tel10_op = maak_optelaar(10)
>> tel10_op(5) ¶    // → 15

// In reeksen
bewerkingen = [x -> x+1, x -> x*2, x -> x*x]
>> bewerkingen[3](5) ¶    // → 25
```

---

## Reeksen

Reeksen zijn **veranderlijk** en bevatten elementen van **hetzelfde type**.

```zymbol
reeks = [1, 2, 3, 4, 5]

x = reeks[1]      // 1 — toegang (1-gebaseerd: eerste element)
x = reeks[-1]     // 5 — negatieve index (laatste element)
x = reeks$#       // 5 — lengte (gebruik (reeks$#) in >>)

reeks = reeks$+ 6            // toevoegen → [1,2,3,4,5,6]
reeks2 = reeks$+[2] 99       // invoegen op positie 2 (1-gebaseerd)
reeks3 = reeks$- 3           // eerste voorkomen van waarde verwijderen
reeks4 = reeks$-- 3          // alle voorkomens verwijderen
reeks5 = reeks$-[1]          // verwijderen op index 1 (eerste element)
reeks6 = reeks$-[2..3]       // bereik verwijderen (1-gebaseerd, einde inclusief)

heeft = reeks$? 3            // #1 — bevat
pos = reeks$?? 3             // [3] — alle indices van waarde (1-gebaseerd)
deel = reeks$[1..3]          // [1,2,3] — segment (1-gebaseerd, einde inclusief)
deel2 = reeks$[1:3]          // [1,2,3] — zelfde, op aantal gebaseerde syntaxis

oplopend = reeks$^+          // gesorteerd oplopend  (alleen primitieven)
aflopend = reeks$^-          // gesorteerd aflopend  (alleen primitieven)

// Benoemde/positionele tupel-reeksen — gebruik $^ met vergelijkingslambda
db = [(naam: "Carla", leeftijd: 28), (naam: "Ana", leeftijd: 25), (naam: "Bob", leeftijd: 30)]
op_leeftijd = db$^ (a, b -> a.leeftijd < b.leeftijd)    // oplopend op leeftijd  (<)
op_naam     = db$^ (a, b -> a.naam > b.naam)             // aflopend op naam (>)
>> op_leeftijd[1].naam ¶     // → Ana
>> op_naam[1].naam ¶         // → Carla

// Directe elementupdate (alleen reeksen)
reeks[1] = 99              // toewijzen
reeks[2] += 5              // samengesteld: +=  -=  *=  /=  %=  ^=

// Functionele update — geeft nieuwe reeks terug; origineel ongewijzigd
reeks2 = reeks[2]$~ 99
```

> Alle verzameloperatoren geven een **nieuwe reeks** terug. Terugtoewijzen: `reeks = reeks$+ 4`.
> `$+` kan worden geketend: `reeks = reeks$+ 5$+ 6$+ 7`. Andere operatoren gebruiken tussenliggende toewijzingen.
> **Indexering is 1-gebaseerd**: `reeks[1]` is het eerste element; `reeks[0]` is een uitvoeringsfout.
> `$^+` / `$^-` sorteert **primitieve reeksen** (getallen, tekst). Voor tupel-reeksen gebruik `$^` met vergelijkingslambda — richting is gecodeerd in lambda (`<` = oplopend, `>` = aflopend).

**Waardensemantiek** — een reeks toewijzen aan een andere variabele maakt een onafhankelijke kopie:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b is niet beïnvloed
```

```zymbol
// Geneste reeksen (1-gebaseerde indexering)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (rij 2, kolom 3)
```

---

## Destructurering

```zymbol
// Reeks
reeks = [10, 20, 30, 40, 50]
[a, b, c] = reeks              // a=10  b=20  c=30
[eerste, *rest] = reeks        // eerste=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ verwijdert

// Positionele tupel
punt = (100, 200)
(px, py) = punt                // px=100  py=200

// Benoemde tupel
persoon = (naam: "Ana", leeftijd: 25, stad: "Madrid")
(naam: n, leeftijd: l) = persoon   // n="Ana"  l=25
```

---

## Tupels

Tupels zijn **onveranderlijke** geordende containers die waarden van **verschillende typen** kunnen bevatten.
In tegenstelling tot reeksen kunnen elementen na aanmaak niet worden gewijzigd.

```zymbol
// Positioneel — gemengde typen toegestaan
punt = (10, 20)
>> punt[1] ¶    // → 10

gegevens = (42, "hallo", #1, 3.14)
>> gegevens[3] ¶     // → #1

// Benoemd
persoon = (naam: "Alice", leeftijd: 25)
>> persoon.naam ¶    // → Alice
>> persoon[1] ¶      // → Alice  (index werkt ook, 1-gebaseerd)

// Genest
pos = (x: 10, y: 20)
p = (pos: pos, label: "oorsprong")
>> p.pos.x ¶        // → 10
```

**Onveranderlijkheid** — elke poging om een tupel-element te wijzigen is een uitvoeringsfout:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ uitvoeringsfout: tupels zijn onveranderlijk
// t[1] += 5    // ❌ zelfde fout
```

Om een gewijzigde waarde af te leiden gebruik `$~` (functionele update) — geeft een **nieuwe** tupel terug:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← origineel ongewijzigd
>> t2 ¶    // → (10, 999, 30)

// Benoemde tupel — expliciet herbouwen
persoon = (naam: "Alice", leeftijd: 25)
ouder  = (naam: persoon.naam, leeftijd: 26)
>> persoon.leeftijd ¶    // → 25
>> ouder.leeftijd ¶      // → 26
```

---

## Hogere-Orde Functies

```zymbol
getallen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdubbeld = getallen$> (x -> x * 2)                // map  → [2,4,6…20]
even       = getallen$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totaal     = getallen$< (0, (acc, x) -> acc + x)     // reduce → 55

// Keten via tussenliggende
stap1 = getallen$| (x -> x > 3)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Benoemde functies kunnen direct worden doorgegeven aan HOF
verdubbel(x) { <~ x * 2 }
is_groot(x) { <~ x > 5 }
r = getallen$> verdubbel    // ✅ directe referentie
r = getallen$| is_groot     // ✅ directe referentie
```

---

## Pijp-operator

De rechterkant vereist altijd `_` als tijdelijke aanduiding voor de doorgegeven waarde:

```zymbol
verdubbel = x -> x * 2
optellen = (a, b) -> a + b
verhoog = x -> x + 1

r1 = 5 |> verdubbel(_)        // → 10
r2 = 10 |> optellen(_, 5)     // → 15
r3 = 5 |> optellen(2, _)      // → 7

// Geketend
r = 5 |> verdubbel(_) |> verhoog(_) |> verdubbel(_)
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
    >> "andere fout: " _err ¶    // _err bevat het foutbericht
} :> {
    >> "loopt altijd" ¶
}
```

| Type | Wanneer |
|------|---------|
| `##Div` | Deling door nul |
| `##IO` | Bestand / systeem |
| `##Index` | Index buiten bereik |
| `##Type` | Type-mismatch |
| `##Parse` | Gegevens parsen |
| `##Network` | Netwerkfouten |
| `##_` | Elke fout (alles-vangen) |

---

## Modules

```zymbol
// lib/berekening.zy — modulelichaam is omsloten door accolades
# berekening {
    #> { optellen, get_PI }

    _PI := 3.14159
    optellen(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/berekening => b    // alias vereist

>> b::optellen(5, 3) ¶     // → 8
pi = b::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exporteren met een andere publieke naam
# mijnbibliotheek {
    #> { _intern_optellen => som }

    _intern_optellen(a, b) { <~ a + b }
}
```

```zymbol
<# ./mijnbibliotheek => m

>> m::som(3, 4) ¶    // → 7  (interne naam _intern_optellen is verborgen)
```

> **Moduleregels**: alleen `#>`, functiedefinities en letterlijke variabele-/constante-initialiseerders zijn toegestaan in `# naam { }`. Uitvoerbare instructies (`>>`, `<<`, lussen, etc.) geven fout E013.

---

## Numerieke Modi

Zymbol kan getallen weergeven in **69 Unicode-cijferschriften** — Devanagari, Arabisch-Indisch, Thai, Klingon pIqaD, Wiskundig Vet, LCD-segmenten en meer. De actieve modus heeft alleen invloed op `>>`-uitvoer; interne rekenkunde is altijd binair.

### Een schrift activeren

Schrijf het `0`- en `9`-cijfer van het doelschrift omgeven door `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisch-Indisch (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // terugzetten naar ASCII
```

### Uitvoer en booleans

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standaard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimaalteken altijd ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: #-prefix altijd ASCII, cijfer past zich aan
>> #1 ¶         // → #१   (waar in Devanagari)
>> #0 ¶         // → #०   (onwaar — onderscheiden van ०  geheel nul)

x = 28 > 4
>> x ¶          // → #१   (vergelijkingsresultaat volgt actieve modus)
```

### Inheemse cijferliteralen in broncode

Cijfers van elk ondersteund schrift zijn geldige literalen — in bereiken, modulo, vergelijkingen:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booleaanse literalen in elk schrift

`#` + cijfer `0` of `1` uit elk blok is een geldig booleaans literaal:

```zymbol
#٠٩#
actief = #١        // zelfde als #1
>> actief ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` is **altijd ASCII**. `#0` (onwaar) is altijd visueel onderscheiden van `0` (geheel nul) in elk schrift.

---

## Gegevensoperatoren

```zymbol
// Typeconversie-casts
f = ##.42         // → 42.0  (naar Decimaal)
i = ###3.7        // → 4     (naar Geheel, afronden)
t = ##!3.7        // → 3     (naar Geheel, afkappen)

// Tekst naar getal parsen
v1 = #|"42"|      // → 42  (Geheel)
v2 = #|"3.14"|    // → 3.14  (Decimaal)
v3 = #|"abc"|     // → "abc"  (foutveilig, geen fout)

// Afronden / afkappen
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (afronden op 2 decimalen)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (afkappen)

// Getalopmaak
fmt = #,|1234567|  // → 1,234,567  (kommagescheiden)
sci = #^|12345.678|    // → 1.2345678e4  (wetenschappelijk)

// Basisliteralen
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binair)
c = 0o101        // → 'A'  (octaal)

// Basisconversie-uitvoer
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integratie

```zymbol
datum = <\ date +%Y-%m-%d \>     // stdout vastleggen (inclusief afsluitende \n)
>> "Vandaag: " datum

bestand = "gegevens.txt"
inhoud = <\ cat {bestand} \>     // interpolatie in opdrachten

uitvoer = </"./subscript.zy"/>   // ander Zymbol-script uitvoeren, uitvoer vastleggen
>> uitvoer
```

> `><` legt CLI-argumenten vast als tekst-reeks (alleen boomwandeling).

---

## Volledig Voorbeeld: FizzBuzz

```zymbol
klasseer(getal) {
    ? getal % 15 == 0 { <~ "FizzBuzz" }
    _? getal % 3  == 0 { <~ "Fizz" }
    _? getal % 5  == 0 { <~ "Buzz" }
    _ { <~ getal }
}

@ i:1..20 { >> klasseer(i) ¶ }
```

---

## Symbolenreferentie

| Symbool | Bewerking | Symbool | Bewerking |
|---------|-----------|---------|-----------|
| `=` | variabele | `$#` | lengte |
| `:=` | constante | `$+` | toevoegen (ketenbaarbaar) |
| `>>` | uitvoer | `$+[i]` | invoegen op index (1-gebaseerd) |
| `<<` | invoer | `$-` | eerste op waarde verwijderen |
| `¶` / `\\` | nieuwe regel | `$--` | alle op waarde verwijderen |
| `?` | als | `$-[i]` | verwijderen op index (1-gebaseerd) |
| `_?` | anders-als | `$-[i..j]` | bereik verwijderen (1-gebaseerd) |
| `_` | anders / wildcard | `$?` | bevat |
| `??` | koppeling | `$??` | alle indices vinden (1-gebaseerd) |
| `@` | lus | `$[s..e]` | segment (1-gebaseerd) |
| `@ N { }` | N-keer-lus | `$>` | map |
| `@!` | stoppen | `$\|` | filter |
| `@>` | doorgaan | `$<` | reduce |
| `@:naam { }` | gelabelde lus | `$/ delim` | tekst splitsen |
| `@:naam!` | label stoppen | `$++ a b c` | samenvoegen bouwen |
| `@:naam>` | label doorgaan | `reeks[i>j>k]` | navigatie-index |
| `->` | lambda | `reeks[i] = val` | element bijwerken (alleen reeksen) |
| `reeks[i] += val` | samengestelde update | `reeks[i]$~` | functionele update (nieuwe kopie) |
| `$^+` | sorteren oplopend (primitieven) | `$^-` | sorteren aflopend (primitieven) |
| `$^` | sorteren met vergelijker (tupels) | `<~` | teruggeven |
| `\|>` | pijp | `!?` | proberen |
| `:!` | vangen | `:>` | tenslotte |
| `#1` | waar | `#0` | onwaar |
| `$!` | is fout | `$!!` | fout doorgeven |
| `<#` | importeren | `#>` | exporteren |
| `#` | module verklaren | `::` | moduleaanroep |
| `.` | veldtoegang | `#?` | typemetadata |
| `#\|..\|` | getal parsen | `##.` | cast naar Decimaal |
| `###` | cast naar Geheel (afronden) | `##!` | cast naar Geheel (afkappen) |
| `#.N\|..\|` | afronden | `#!N\|..\|` | afkappen |
| `#,\|..\|` | kommaopmaak | `#^\|..\|` | wetenschappelijk |
| `#d0d9#` | numerieke moduswissel | `#09#` | terugzetten naar ASCII |
| `<\ ..\>` | shell-uitvoeren | `>\<` | CLI-argumenten |
| `\ var` | variabele expliciet vernietigen | `°x` / `x°` | warme definitie (auto-init) |
| `>>|` | TUI-blok (alternatief scherm) | `>>~` | gepositioneerde uitvoer |
| `>>!` | scherm wissen | `>>?` | terminalgrootte opvragen |
| `<<\|` | blokkerende toetsdruk | `<<\|?` | niet-blokkerende toetsdruk |
| `@~ N` | N milliseconden slapen | `$*` | tekst N keer herhalen |

---

## Versie-Changelog

### v0.0.5 — TUI-primitieven, Warme Definitie & Tekstherhaling _(Mei 2026)_

- **Brekend** Match-arm-scheidingsteken: `patroon : resultaat` → `patroon => resultaat`
- **Brekend** Import-alias: `<# pad <= alias` → `<# pad => alias`
- **Brekend** Export-hernoeming: `#> { fn <= pub }` → `#> { fn => pub }`
- **Toegevoegd** TUI-blok `>>| { }` — alternatief scherm + ruwe modus; opruimen bij afsluiten
- **Toegevoegd** Gepositioneerde uitvoer `>>~ (rij, kol, BKS, fg, bg) > elementen` — schaarse slots, ANSI 256-kleuren
- **Toegevoegd** Toetsinvoer `<<| var` (blokkerend) en `<<|? var` (niet-blokkerende poll)
- **Toegevoegd** `>>!` scherm wissen, `>>?` terminalgrootte opvragen, `@~ N` N milliseconden slapen
- **Toegevoegd** Warme definitie `°x` / `x°` — variabele auto-initialiseren bij eerste gebruik in lussen
- **Toegevoegd** Tekstherhaling `str $* N` — een tekst N keer herhalen
- **VM** Pariteit: 436/436 tests geslaagd

### v0.0.4 — 1-Gebaseerde Indexering, Eerste Klasse Functies & Moduleblokken _(April 2026)_

- **Brekend** Alle indexering overgeschakeld naar **1-gebaseerd** — `reeks[1]` is het eerste element; `reeks[0]` is een uitvoeringsfout
- **Toegevoegd** Benoemde functies zijn **eerste klasse waarden** — geef direct door aan HOF: `getallen$> verdubbel`
- **Toegevoegd** Module-**bloksyntaxis** vereist: `# naam { ... }` — vlakke syntaxis verwijderd
- **Toegevoegd** Meerdimensionale indexering: `reeks[i>j>k]` (navigatie), `reeks[p ; q]` (vlakke extractie)
- **Toegevoegd** Typeconversie-casts: `##.expr` (Decimaal), `###expr` (Geheel afronden), `##!expr` (Geheel afkappen)
- **Toegevoegd** Tekst splitsen: `str$/ delim` — geeft `Reeks(Tekst)` terug
- **Toegevoegd** Samenvoegen bouwen: `basis$++ a b c` — meerdere elementen toevoegen
- **Toegevoegd** N-keer-lus: `@ N { }` — precies N keer herhalen
- **Toegevoegd** Gelabelde lussyntaxis: `@:naam { }`, `@:naam!`, `@:naam>` — vervangt `@ @naam` / `@! naam`
- **Toegevoegd** Variabele reikwijdteregels: `_naam`-variabelen hebben exacte blokreikwijdte; `\ var` vernietigt vroeg
- **Toegevoegd** Match-vergelijkingspatronen: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Toegevoegd** Module E013-fout: uitvoerbare instructies in modulelichaam zijn verboden
- **Opgelost** `take_variable` corrumpeert moduleconstanten niet meer bij terugschrijven
- **Opgelost** `alias.CONST` wordt nu correct opgelost; `#>` kan na functiedefinities verschijnen
- **VM** Volledige pariteit: 393/393 tests geslaagd

### v0.0.3 — Unicode Numerieke Systemen & LSP-verbeteringen _(April 2026)_

- **Toegevoegd** 69 Unicode-cijferblokken met moduswissel-token `#d0d9#`
- **Toegevoegd** Booleaanse literalen in elk schrift — `#१` / `#०`, `#١` / `#٠`, etc.
- **Toegevoegd** Klingon pIqaD-cijfers (CSUR PUA U+F8F0–U+F8F9)
- **Toegevoegd** `SetNumeralMode` VM-opcode — volledige pariteit met boomwandeling
- **Toegevoegd** REPL respecteert actieve numerieke modus in echo en variabeleweergave
- **Gewijzigd** Booleaanse `>>`-uitvoer bevat nu `#`-prefix (`#0` / `#1`) in alle modi

### v0.0.2_01 — Operatorhernoeming _(30 Mar 2026)_

- **Gewijzigd** `c|..|` → `#,|..|` en `e|..|` → `#^|..|` — consistent met `#`-opmaakprefix-familie
- **Toegevoegd** Exportalias: moduleleden herexporteren onder een andere naam

### v0.0.2 — Verzameling-API-herontwerp & Installatieprogramma's _(24 Mar 2026)_

- **Toegevoegd** Uniforme `$`-operatorfamilie voor reeksen en tekst (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Toegevoegd** Destructureringsopdracht voor reeksen, tupels en benoemde tupels
- **Toegevoegd** Negatieve indices (`reeks[-1]` = laatste element)
- **Toegevoegd** Native installatieprogramma's — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Toegevoegd** Samengestelde toewijzing `^=`
- **Opgelost** Parser-rekenkundige randgevallen; documentatiecorrecties

### v0.0.1 — Eerste Openbare Release _(22 Mar 2026)_

- Boomwandeling-interpreter + register-VM (`--vm`, ~4× sneller, ~95% pariteit)
- Alle kernstructuren: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Volledig Unicode-identifiers, modulesysteem, lambdas, sluitingen, foutafhandeling
- REPL, LSP, VS Code-extensie, opmaak (`zymbol fmt`)

---

_Zymbol-Lang — Symbolisch. Universeel. Onveranderlijk._
