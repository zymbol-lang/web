> **Disclaimer:** Deze documentatie is gemaakt en vertaald door kunstmatige intelligentie (KI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> De canonieke referentie is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in de interpreter-repository.

---

# Zymbol-Lang Handleiding

**Zymbol-Lang** is een symbolische programmeertaal. Geen sleutelwoorden — alles is een symbool. Werkt identiek in elke menselijke taal.

- Geen `if`, `while`, `return` — alleen `?`, `@`, `<~`
- Volledige Unicode — identificatoren in elke taal of emoji
- Taalonafhankelijk — de code is overal hetzelfde

**Interpreterversie**: v0.0.4 | **Testdekking**: 393/393 (TW ↔ VM pariteit)

---

## Variabelen en constanten

```zymbol
x = 10              // veranderlijke variabele
PI := 3.14159       // constante — hertoewijzing is een runtime-fout
naam = "Alice"
actief = #1         // boolean waar
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

## Gegevenstypen

| Type | Letterlijk | `#?`-tag | Opmerkingen |
|------|-----------|----------|-------------|
| Geheel getal | `42`, `-7` | `###` | 64-bit met teken |
| Decimaal | `3.14`, `1.5e10` | `##.` | Wetenschappelijke notatie OK |
| Tekst | `"tekst"` | `##"` | Interpolatie: `"Hallo {naam}"` |
| Karakter | `'A'` | `##'` | Enkel Unicode-teken |
| Boolean | `#1`, `#0` | `##?` | NIET numeriek — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Homogene elementen |
| Tupel | `(a, b)` | `##)` | Positioneel |
| Benoemde tupel | `(x: 1, y: 2)` | `##)` | Benoemde velden |
| Functie | benoemde functieverwijzing | `##()` | Eerste klasse; toont `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Eerste klasse; toont `<lambd/N>` |

```zymbol
// Type-introspectie — geeft (type, cijfers, waarde) terug
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Uitvoer en invoer

```zymbol
>> "Hallo" ¶                      // ¶ of \\ voor expliciete nieuwe regel
>> "a=" a " b=" b ¶               // naast elkaar — meerdere waarden
>> (arr$#) ¶                      // postfix-operatoren vereisen ( ) in >>

<< naam                           // lees in variabele (geen prompt)
<< "Voer naam in: " naam          // met prompt
```

> `¶` (AltGr+R op Spaans toetsenbord) en `\\` zijn equivalente nieuwe regelmarkeringen.

---

## Operatoren

```zymbol
// Rekenkunde — gebruik toewijzingen; sommige operatoren hebben eigenaardigheden direct in >>
a = 10
b = 3
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (gehele getaldeling)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (machtsverheffing)

// Vergelijking
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

## Tekstreeksen

```zymbol
// Twee aaneenschakelingsvormen
naam = "Alice"
n = 42

>> "Hallo " naam " jij hebt " n ¶    // naast elkaar — in >>
beschr = "Hallo {naam}, jij hebt {n}"  // interpolatie — overal
```

```zymbol
s = "Hallo wereld"
len = s$#                  // 11
sub = s$[1..5]             // "Hallo"  (1-gebaseerd, einde inclusief)
heeft = s$? "wereld"       // #1
delen = "a,b,c,d"$/ ','   // [a, b, c, d]  (splitsen bij scheidingsteken)
verv = s$~~["l":"L"]          // "HaLLo wereLd"
verv1 = s$~~["l":"L":1]       // "HaLlo wereld"  (alleen eerste N)
```

> `+` is alleen voor getallen. Gebruik `,`, naast elkaar of interpolatie voor tekstreeksen.

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

> `{ }` accolades zijn **vereist** zelfs voor een enkele instructie.

---

## Match

```zymbol
// Bereiken
score = 85
cijfer = ?? score {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> cijfer ¶    // → B

// Tekstreeksen
kleur = "rood"
code = ?? kleur {
    "rood"  : "#FF0000"
    "groen" : "#00FF00"
    _       : "#000000"
}

// Vergelijkingspatronen
temp = -5
toestand = ?? temp {
    < 0  : "ijs"
    < 20 : "koud"
    < 35 : "warm"
    _    : "heet"
}
>> toestand ¶    // → ijs

// Instructievorm (blokken met armen)
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
@ i:1..9:2 { >> i " " }       // met stap:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omgekeerd:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (terwijl)

fruit = ["appel", "peer", "druif"]
@ f:fruit { >> f ¶ }          // voor elk array

@ t:"hoi" { >> t "-" }
>> ¶                          // → h-o-i-  (voor elke tekstreeks)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> doorgaan
    ? i > 7 { @! }             // @! breken
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
aantal = 0
@:buiten {
    aantal++
    ? aantal >= 3 { @:buiten! }
}
>> aantal ¶                    // → 3
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

Functies hebben **geïsoleerde scope** — ze kunnen geen buitenste variabelen lezen. Gebruik uitvoerparameters `<~` om aanroeper-variabelen te wijzigen:

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

> Benoemde functies zijn **eerste klasse waarden** — geef direct door: `getallen$> verdubbel`. Om in te pakken is `x -> fn(x)` ook geldig.

---

## Lambda's en sluitingen

```zymbol
verdubbel = x -> x * 2
som = (a, b) -> a + b
>> verdubbel(5) ¶    // → 10
>> som(3, 7) ¶       // → 10

// Blok-lambda
classificeer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}

// Sluiting — legt buitenste scope vast
factor = 3
verdrievoudig = x -> x * factor
>> verdrievoudig(7) ¶    // → 21

// Fabriek
maak_opteller(n) { <~ x -> x + n }
tel10_op = maak_opteller(10)
>> tel10_op(5) ¶    // → 15

// In arrays
bewerkingen = [x -> x+1, x -> x*2, x -> x*x]
>> bewerkingen[3](5) ¶    // → 25
```

---

## Arrays

Arrays zijn **veranderlijk** en bevatten elementen van **hetzelfde type**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — toegang (1-gebaseerd: eerste element)
arr[-1]         // 5 — negatieve index (laatste element)
arr$#           // 5 — lengte (gebruik (arr$#) in >>)

arr = arr$+ 6            // toevoegen → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // invoegen op positie 2 (1-gebaseerd)
arr3 = arr$- 3           // eerste voorkomen van waarde verwijderen
arr4 = arr$-- 3          // alle voorkomens verwijderen
arr5 = arr$-[1]          // verwijderen op index 1 (eerste element)
arr6 = arr$-[2..3]       // bereik verwijderen (1-gebaseerd, einde inclusief)

heeft = arr$? 3          // #1 — bevat
pos = arr$?? 3           // [3] — alle indices van waarde (1-gebaseerd)
sl = arr$[1..3]          // [1,2,3] — slice (1-gebaseerd, einde inclusief)
sl2 = arr$[1:3]          // [1,2,3] — hetzelfde, aantal-gebaseerde syntaxis

oplopend = arr$^+        // gesorteerd oplopend  (alleen primitieven)
aflopend = arr$^-        // gesorteerd aflopend (alleen primitieven)

// Benoemde/positionele tupel-arrays — gebruik $^ met vergelijkingslambda
db = [(naam: "Carla", leeftijd: 28), (naam: "Ana", leeftijd: 25), (naam: "Bob", leeftijd: 30)]
op_leeftijd = db$^ (a, b -> a.leeftijd < b.leeftijd)    // oplopend op leeftijd  (<)
op_naam     = db$^ (a, b -> a.naam > b.naam)             // aflopend op naam (>)
>> op_leeftijd[1].naam ¶     // → Ana
>> op_naam[1].naam ¶         // → Carla

// Direct element bijwerken (alleen arrays)
arr[1] = 99              // toewijzen
arr[2] += 5              // samengesteld: +=  -=  *=  /=  %=  ^=

// Functionele update — geeft een nieuwe array terug; origineel ongewijzigd
arr2 = arr[2]$~ 99
```

> Alle verzamelingsoperatoren geven een **nieuwe array** terug. Wijs terug toe: `arr = arr$+ 4`.
> `$+` kan worden gekoppeld: `arr = arr$+ 5$+ 6$+ 7`. Andere operatoren gebruiken tussentijdse toewijzingen.
> **Indexering is 1-gebaseerd**: `arr[1]` is het eerste element; `arr[0]` is een runtime-fout.
> `$^+` / `$^-` sorteert **primitieve arrays** (getallen, tekstreeksen). Voor tupel-arrays gebruik `$^` met een vergelijkingslambda — richting is gecodeerd in de lambda (`<` = oplopend, `>` = aflopend).

**Waardensemantiek** — een array toewijzen aan een andere variabele maakt een onafhankelijke kopie:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b is onaangetast
```

```zymbol
// Geneste arrays (1-gebaseerde indexering)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (rij 2, kolom 3)
```

---

## Destructurering

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eerste, *rest] = arr        // eerste=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ verwijdert

// Positionele tupel
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Benoemde tupel
persoon = (naam: "Ana", leeftijd: 25, stad: "Madrid")
(naam: n, leeftijd: a) = persoon   // n="Ana"  a=25
```

---

## Tupels

Tupels zijn **onveranderlijke** geordende containers die waarden van **verschillende typen** kunnen bevatten.
Anders dan arrays kunnen elementen na aanmaken niet worden gewijzigd.

```zymbol
// Positioneel — gemengde typen toegestaan
punt = (10, 20)
>> punt[1] ¶    // → 10

gegevens = (42, "hoi", #1, 3.14)
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

**Onveranderlijkheid** — elke poging om een tupel-element te wijzigen is een runtime-fout:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ runtime-fout: tupels zijn onveranderlijk
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

## Hogere-orde functies

```zymbol
getallen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdubbeld  = getallen$> (x -> x * 2)                // map  → [2,4,6…20]
even_getallen = getallen$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
totaal      = getallen$< (0, (acc, x) -> acc + x)    // reduce → 55

// Ketening via tussenstappen
stap1 = getallen$| (x -> x > 3)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Benoemde functies kunnen direct worden doorgegeven aan HOF
verdubbel(x) { <~ x * 2 }
is_groot(x) { <~ x > 5 }
r = getallen$> verdubbel       // ✅ directe verwijzing
r = getallen$| is_groot        // ✅ directe verwijzing
```

---

## Pipe-operator

De rechterkant vereist altijd `_` als plaatshouder voor de doorgegeven waarde:

```zymbol
verdubbel = x -> x * 2
optellen = (a, b) -> a + b
verhoog = x -> x + 1

5 |> verdubbel(_)        // → 10
10 |> optellen(_, 5)     // → 15
5 |> optellen(2, _)      // → 7

// Gekoppeld
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
    >> "overige: " _err ¶    // _err bevat de foutmelding
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
| `##Parse` | Gegevensverwerking |
| `##Network` | Netwerkfouten |
| `##_` | Elke fout (alles opvangen) |

---

## Modules

```zymbol
// lib/rekenen.zy — de module-inhoud staat in accolades
# rekenen {
    #> { optellen, haal_PI }

    _PI := 3.14159
    optellen(a, b) { <~ a + b }
    haal_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/rekenen <= r    // alias vereist

>> r::optellen(5, 3) ¶     // → 8
pi = r::haal_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exporteren met een andere publieke naam
# mijnlib {
    #> { _interne_optelling <= som }

    _interne_optelling(a, b) { <~ a + b }
}
```

```zymbol
<# ./mijnlib <= m

>> m::som(3, 4) ¶    // → 7  (de interne naam _interne_optelling is verborgen)
```

> **Module-regels**: alleen `#>`, functiedefinities en letterlijke variabele-/constante-initialisaties zijn toegestaan binnen `# naam { }`. Uitvoerbare instructies (`>>`, `<<`, lussen, enz.) veroorzaken fout E013.

---

## Getalsystemen

Zymbol kan getallen weergeven in **69 Unicode-cijferschriften** — Devanagari, Arabisch-Indisch, Thais, Klingon pIqaD, Wiskundig vet, LCD-segmenten en meer. De actieve modus beïnvloedt alleen `>>`-uitvoer; interne rekenkunde is altijd binair.

### Een schrift activeren

Schrijf het `0`- en `9`-cijfer van het doelschrift omsloten door `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisch-Indisch (U+0660–U+0669)
#๐๙#    // Thais        (U+0E50–U+0E59)
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

// Booleans: # voorvoegsel altijd ASCII, cijfer past zich aan
>> #1 ¶         // → #१   (waar in Devanagari)
>> #0 ¶         // → #०   (onwaar — anders dan ०  geheel getal nul)

x = 28 > 4
>> x ¶          // → #१   (vergelijkingsresultaat volgt actieve modus)
```

### Inheemse cijferliteralen in broncode

Cijfers van alle ondersteunde schriften zijn geldige literalen — in bereiken, modulo, vergelijkingen:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean-literalen in elk schrift

`#` + cijfer `0` of `1` uit elk blok is een geldige boolean-literal:

```zymbol
#٠٩#
نشط = #١        // hetzelfde als #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` is **altijd ASCII**. `#0` (onwaar) is altijd visueel onderscheiden van `0` (geheel getal nul) in elk schrift.

---

## Gegevensoperatoren

```zymbol
// Type-conversiekast
##.42         // → 42.0  (naar Decimaal)
###3.7        // → 4     (naar Geheel getal, afronden)
##!3.7        // → 3     (naar Geheel getal, afkappen)

// Tekstreeks parsen naar getal
v1 = #|"42"|      // → 42  (Geheel getal)
v2 = #|"3.14"|    // → 3.14  (Decimaal)
v3 = #|"abc"|     // → "abc"  (faalveilig, geen fout)

// Afronden / afkappen
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (afronden op 2 decimalen)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (afkappen)

// Getalopmaak
fmt = #,|1234567|  // → 1,234,567  (komma-gescheiden)
sci = #^|12345.678|    // → 1.2345678e4  (wetenschappelijk)

// Grondtal-literalen
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binair)
c = 0o101        // → 'A'  (octaal)

// Grondtal-conversie-uitvoer
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integratie

```zymbol
datum = <\ date +%Y-%m-%d \>     // vangt stdout (inclusief afsluitende \n)
>> "Vandaag: " datum

bestand = "gegevens.txt"
inhoud = <\ cat {bestand} \>     // interpolatie in opdrachten

uitvoer = </"./subscript.zy"/>   // een ander Zymbol-script uitvoeren, uitvoer vastleggen
>> uitvoer
```

> `><` vangt CLI-argumenten op als een tekstreeks-array (alleen boomwandeling).

---

## Volledig voorbeeld: FizzBuzz

```zymbol
classificeer(getal) {
    ? getal % 15 == 0 { <~ "FizzBuzz" }
    _? getal % 3  == 0 { <~ "Fizz" }
    _? getal % 5  == 0 { <~ "Buzz" }
    _ { <~ getal }
}

@ i:1..20 { >> classificeer(i) ¶ }
```

---

## Symboolreferentie

| Symbool | Bewerking | Symbool | Bewerking |
|---------|-----------|---------|-----------|
| `=` | variabele | `$#` | lengte |
| `:=` | constante | `$+` | toevoegen (koppelbaar) |
| `>>` | uitvoer | `$+[i]` | invoegen op index (1-gebaseerd) |
| `<<` | invoer | `$-` | eerste op waarde verwijderen |
| `¶` / `\\` | nieuwe regel | `$--` | alle op waarde verwijderen |
| `?` | als | `$-[i]` | verwijderen op index (1-gebaseerd) |
| `_?` | anders-als | `$-[i..j]` | bereik verwijderen (1-gebaseerd) |
| `_` | anders / joker | `$?` | bevat |
| `??` | match | `$??` | alle indices vinden (1-gebaseerd) |
| `@` | lus | `$[s..e]` | slice (1-gebaseerd) |
| `@ N { }` | teller-lus (N iteraties) | `$>` | map |
| `@!` | breken | `$\|` | filteren |
| `@>` | doorgaan | `$<` | verminderen |
| `@:naam { }` | gelabelde lus | `$/ delim` | tekstreeks splitsen |
| `@:naam!` | label breken | `$++ a b c` | aaneenschakeling opbouwen |
| `@:naam>` | label doorgaan | `arr[i>j>k]` | navigatie-index |
| `->` | lambda | `arr[i] = val` | element bijwerken (alleen arrays) |
| `arr[i] += val` | samengestelde update | `arr[i]$~` | functionele update (nieuwe kopie) |
| `$^+` | oplopend sorteren (primitieven) | `$^-` | aflopend sorteren (primitieven) |
| `$^` | sorteren met vergelijker (tupels) | `<~` | teruggeven |
| `\|>` | pipe | `!?` | proberen |
| `:!` | opvangen | `:>` | eindelijk |
| `#1` | waar | `#0` | onwaar |
| `$!` | is fout | `$!!` | fout doorgeven |
| `<#` | importeren | `#>` | exporteren |
| `#` | module declareren | `::` | module-aanroep |
| `.` | veldtoegang | `#?` | type-metadata |
| `#\|..\|` | getal parsen | `##.` | converteren naar Decimaal |
| `###` | converteren naar Geheel getal (afronden) | `##!` | converteren naar Geheel getal (afkappen) |
| `#.N\|..\|` | afronden | `#!N\|..\|` | afkappen |
| `#,\|..\|` | komma-opmaak | `#^\|..\|` | wetenschappelijk |
| `#d0d9#` | getalsysteemwisseling | `#09#` | terugzetten naar ASCII |
| `<\ ..\>` | shell-uitvoering | `>\<` | CLI-argumenten |
| `\ var` | variabele expliciet verwijderen | | |

---

## Uitgavelogboek

### v0.0.4 — 1-gebaseerde indexering, eerste-klas functies en moduleblokken _(april 2026)_

- **Wijziging** Alle indexering omgezet naar **1-gebaseerd** — `arr[1]` is het eerste element; `arr[0]` is een runtime-fout
- **Toegevoegd** Benoemde functies zijn **eerste-klas waarden** — geef direct door aan HOF: `getallen$> verdubbel`
- **Toegevoegd** Module **bloksyntaxis** vereist: `# naam { ... }` — vlakke syntaxis verwijderd
- **Toegevoegd** Meerdimensionale indexering: `arr[i>j>k]` (navigatie), `arr[p ; q]` (vlakke extractie)
- **Toegevoegd** Type-conversiekast: `##.uitdr` (Decimaal), `###uitdr` (Geheel getal afronden), `##!uitdr` (Geheel getal afkappen)
- **Toegevoegd** Tekstreeks splitsen: `str$/ delim` — geeft `Array(Tekst)` terug
- **Toegevoegd** Aaneenschakeling opbouwen: `base$++ a b c` — voegt meerdere items toe
- **Toegevoegd** Teller-lus: `@ N { }` — herhaalt exact N keer
- **Toegevoegd** Gelabelde lussyntaxis: `@:naam { }`, `@:naam!`, `@:naam>` — vervangt `@ @naam` / `@! naam`
- **Toegevoegd** Variabele scope-regels: `_naam`-variabelen hebben exacte blok-scope; `\ var` verwijdert vroeg
- **Toegevoegd** Match-vergelijkingspatronen: `< 0 :`, `> 5 :`, `== 42 :` enz.
- **Toegevoegd** Module E013-fout: uitvoerbare instructies in module-inhoud zijn verboden
- **Opgelost** `take_variable` beschadigt geen module-constanten meer bij terugschrijven
- **Opgelost** `alias.CONST` wordt nu correct opgelost; `#>` kan na functiedefinities verschijnen
- **VM** Volledige pariteit: 393/393 tests geslaagd

### v0.0.3 — Unicode-getalsystemen en LSP-verbeteringen _(april 2026)_

- **Toegevoegd** 69 Unicode-cijferblokken met modusschakeltoken `#d0d9#`
- **Toegevoegd** Boolean-literalen in elk schrift — `#१` / `#०`, `#١` / `#٠` enz.
- **Toegevoegd** Klingon pIqaD-cijfers (CSUR PUA U+F8F0–U+F8F9)
- **Toegevoegd** `SetNumeralMode` VM-opcode — volledige pariteit met boomwandeling
- **Toegevoegd** REPL respecteert actieve getalsysteemmodus in echo en variabelweergave
- **Gewijzigd** Boolean `>>`-uitvoer bevat nu `#`-voorvoegsel (`#0` / `#1`) in alle modi

### v0.0.2_01 — Operatornaamwijziging _(30 mrt. 2026)_

- **Gewijzigd** `c|..|` → `#,|..|` en `e|..|` → `#^|..|` — consistent met de `#`-opmaakvoorvoegselsfamilie
- **Toegevoegd** Export-alias: module-leden herexporteren onder een andere naam

### v0.0.2 — Verzameling-API herontwerp en installatieprogramma's _(24 mrt. 2026)_

- **Toegevoegd** Uniforme `$`-operatorfamilie voor arrays en tekstreeksen (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Toegevoegd** Destructurering-toewijzing voor arrays, tupels en benoemde tupels
- **Toegevoegd** Negatieve indices (`arr[-1]` = laatste element)
- **Toegevoegd** Inheemse installatieprogramma's — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 mrt. 2026)_

- **Toegevoegd** Samengestelde toewijzing `^=`
- **Opgelost** Parser rekenkundige randgevallen; documentatiecorrecties

### v0.0.1 — Eerste publieke uitgave _(22 mrt. 2026)_

- Boomwandeling-interpreter + register-VM (`--vm`, ~4× sneller, ~95% pariteit)
- Alle kerneconstructies: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Volledige Unicode-identificatoren, modulesysteem, lambda's, sluitingen, foutafhandeling
- REPL, LSP, VS Code-extensie, opmaker (`zymbol fmt`)

---

_Zymbol-Lang — Symbolisch. Universeel. Onveranderlijk._
