> **Ansvarsfraskrivelse:** Denne dokumentation er oprettet og oversat af kunstig intelligens (KI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> Den kanoniske reference er **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** i fortolker-repositoriet.

---

# Zymbol-Lang Håndbog

**Zymbol-Lang** er et symbolsk programmeringssprog. Ingen nøgleord — alt er et symbol. Fungerer identisk på ethvert menneskeligt sprog.

- Ingen `if`, `while`, `return` — kun `?`, `@`, `<~`
- Fuld Unicode — identifikatorer på ethvert sprog eller emoji
- Sproguafhængig — koden er den samme overalt

**Fortolkerversion**: v0.0.4 | **Testdækning**: 393/393 (TW ↔ VM paritet)

---

## Variabler og konstanter

```zymbol
x = 10              // muterbar variabel
PI := 3.14159       // konstant — gentildeling er en kørselstidsfejl
navn = "Alice"
aktiv = #1          // boolsk sand
👋 := "Hej"
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

## Datatyper

| Type | Literal | `#?`-tag | Bemærkninger |
|------|---------|----------|--------------|
| Heltal | `42`, `-7` | `###` | 64-bit fortegnet |
| Decimaltal | `3.14`, `1.5e10` | `##.` | Videnskabelig notation OK |
| Tekst | `"tekst"` | `##"` | Interpolering: `"Hej {navn}"` |
| Tegn | `'A'` | `##'` | Enkelt Unicode-tegn |
| Boolsk | `#1`, `#0` | `##?` | IKKE numerisk — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Homogene elementer |
| Tupel | `(a, b)` | `##)` | Positionsbaseret |
| Navngivet tupel | `(x: 1, y: 2)` | `##)` | Navngivne felter |
| Funktion | navngivet funktionsreference | `##()` | Førsteklasses; viser `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Førsteklasses; viser `<lambd/N>` |

```zymbol
// Typeintrospektering — returnerer (type, cifre, værdi)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output og input

```zymbol
>> "Hej" ¶                        // ¶ eller \\ for eksplicit linjeskift
>> "a=" a " b=" b ¶               // juxtaposition — flere værdier
>> (arr$#) ¶                      // postfix-operatorer kræver ( ) i >>

<< navn                           // læs ind i variabel (ingen prompt)
<< "Indtast navn: " navn          // med prompt
```

> `¶` (AltGr+R på spansk tastatur) og `\\` er ækvivalente linjeskift.

---

## Operatorer

```zymbol
// Aritmetik — brug tildelinger; nogle operatorer har egenheder direkte i >>
a = 10
b = 3
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (heltalsdivision)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (potensopløftning)

// Sammenligning
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b     // #1

// Logisk
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Strenge

```zymbol
// To sammenkædningsformer
navn = "Alice"
n = 42

>> "Hej " navn " du har " n ¶    // juxtaposition — i >>
beskr = "Hej {navn}, du har {n}"  // interpolering — overalt
```

```zymbol
s = "Hej verden"
len = s$#                  // 10
sub = s$[1..3]             // "Hej"  (1-baseret, slutning inklusiv)
har = s$? "verden"         // #1
dele = "a,b,c,d"$/ ','    // [a, b, c, d]  (opdel ved afgrænser)
erstat = s$~~["e":"E"]        // "HEj vErdEn"
erstat1 = s$~~["e":"E":1]     // "HEj verden"  (kun de første N)
```

> `+` er kun til tal. Brug `,`, juxtaposition eller interpolering til strenge.

---

## Kontrolflow

```zymbol
x = 7

? x > 0 { >> "positiv" ¶ }

? x > 100 {
    >> "stor" ¶
} _? x > 0 {
    >> "positiv" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "negativ" ¶
}
```

> `{ }` klammeparenteser er **påkrævet** selv for en enkelt sætning.

---

## Match

```zymbol
// Intervaller
score = 85
karakter = ?? score {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> karakter ¶    // → B

// Strenge
farve = "rød"
kode = ?? farve {
    "rød"   : "#FF0000"
    "grøn"  : "#00FF00"
    _       : "#000000"
}

// Sammenligningsmønstre
temp = -5
tilstand = ?? temp {
    < 0  : "is"
    < 20 : "kold"
    < 35 : "varm"
    _    : "hed"
}
>> tilstand ¶    // → is

// Sætningsform (blokke med arme)
?? n {
    0       : { >> "nul" ¶ }
    _? n < 0: { >> "negativ" ¶ }
    _       : { >> "positiv" ¶ }
}
```

---

## Løkker

```zymbol
@ i:0..4  { >> i " " }        // interval inklusivt:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // med trin:            1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omvendt:             5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (mens)

frugter = ["æble", "pære", "drue"]
@ f:frugter { >> f ¶ }        // for-hvert array

@ t:"hej" { >> t "-" }
>> ¶                          // → h-e-j-  (for-hvert streng)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> fortsæt
    ? i > 7 { @! }             // @! bryd
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Uendelig løkke
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Mærket løkke (indlejret bryd)
antal = 0
@:ydre {
    antal++
    ? antal >= 3 { @:ydre! }
}
>> antal ¶                    // → 3
```

---

## Funktioner

```zymbol
tilføj(a, b) { <~ a + b }
>> tilføj(3, 4) ¶    // → 7

fakultet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultet(n - 1)
}
>> fakultet(5) ¶    // → 120
```

Funktioner har **isoleret omfang** — de kan ikke læse ydre variable. Brug outputparametre `<~` til at ændre kaldervariable:

```zymbol
byt(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
byt(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Navngivne funktioner er **førsteklasses værdier** — videregiv direkte: `tal$> fordobl`. Til indpakning er `x -> fn(x)` også gyldig.

---

## Lambdaer og lukninger

```zymbol
fordobl = x -> x * 2
sum = (a, b) -> a + b
>> fordobl(5) ¶    // → 10
>> sum(3, 7) ¶     // → 10

// Blok-lambda
klassificer = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "nul"
}

// Lukning — fanger ydre omfang
faktor = 3
tredobl = x -> x * faktor
>> tredobl(7) ¶    // → 21

// Fabrik
lav_adder(n) { <~ x -> x + n }
tilføj10 = lav_adder(10)
>> tilføj10(5) ¶    // → 15

// I arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Arrays

Arrays er **muterbare** og indeholder elementer af **samme type**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — adgang (1-baseret: første element)
arr[-1]         // 5 — negativt indeks (sidste element)
arr$#           // 5 — længde (brug (arr$#) i >>)

arr = arr$+ 6            // tilføj → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // indsæt ved position 2 (1-baseret)
arr3 = arr$- 3           // fjern første forekomst af værdi
arr4 = arr$-- 3          // fjern alle forekomster
arr5 = arr$-[1]          // fjern ved indeks 1 (første element)
arr6 = arr$-[2..3]       // fjern interval (1-baseret, slutning inklusiv)

har = arr$? 3            // #1 — indeholder
pos = arr$?? 3           // [3] — alle indekser for værdi (1-baseret)
ud = arr$[1..3]          // [1,2,3] — udsnit (1-baseret, slutning inklusiv)
ud2 = arr$[1:3]          // [1,2,3] — samme, antal-baseret syntaks

stigende = arr$^+        // sorteret stigende  (kun primitive)
faldende = arr$^-        // sorteret faldende (kun primitive)

// Navngivne/positionsbaserede tupel-arrays — brug $^ med komparator-lambda
db = [(navn: "Carla", alder: 28), (navn: "Ana", alder: 25), (navn: "Bob", alder: 30)]
efter_alder = db$^ (a, b -> a.alder < b.alder)    // stigende efter alder  (<)
efter_navn  = db$^ (a, b -> a.navn > b.navn)       // faldende efter navn (>)
>> efter_alder[1].navn ¶     // → Ana
>> efter_navn[1].navn ¶      // → Carla

// Direkte elementopdatering (kun arrays)
arr[1] = 99              // tildel
arr[2] += 5              // sammensat: +=  -=  *=  /=  %=  ^=

// Funktionel opdatering — returnerer et nyt array; originalen uændret
arr2 = arr[2]$~ 99
```

> Alle samlingsoperatorer returnerer et **nyt array**. Tildel tilbage: `arr = arr$+ 4`.
> `$+` kan kædes: `arr = arr$+ 5$+ 6$+ 7`. Andre operatorer bruger mellemliggende tildelinger.
> **Indeksering er 1-baseret**: `arr[1]` er det første element; `arr[0]` er en kørselstidsfejl.
> `$^+` / `$^-` sorterer **primitive arrays** (tal, strenge). Til tupel-arrays bruges `$^` med en komparator-lambda — retningen er kodet i lambdaen (`<` = stigende, `>` = faldende).

**Værdisemantik** — tildeling af et array til en anden variabel opretter en uafhængig kopi:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er upåvirket
```

```zymbol
// Indlejrede arrays (1-baseret indeksering)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (række 2, kolonne 3)
```

---

## Destrukturering

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[første, *resten] = arr      // første=10  resten=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ kasserer

// Positionsbaseret tupel
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Navngivet tupel
person = (navn: "Ana", alder: 25, by: "Madrid")
(navn: n, alder: a) = person   // n="Ana"  a=25
```

---

## Tupler

Tupler er **uforanderlige** ordnede beholdere, der kan indeholde værdier af **forskellige typer**.
I modsætning til arrays kan elementer ikke ændres efter oprettelse.

```zymbol
// Positionsbaseret — blandede typer tilladt
punkt = (10, 20)
>> punkt[1] ¶    // → 10

data = (42, "hej", #1, 3.14)
>> data[3] ¶     // → #1

// Navngivet
person = (navn: "Alice", alder: 25)
>> person.navn ¶    // → Alice
>> person[1] ¶      // → Alice  (indeks virker også, 1-baseret)

// Indlejret
pos = (x: 10, y: 20)
p = (pos: pos, label: "oprindelse")
>> p.pos.x ¶        // → 10
```

**Uforanderlighed** — ethvert forsøg på at ændre et tupelelement er en kørselstidsfejl:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kørselstidsfejl: tupler er uforanderlige
// t[1] += 5    // ❌ samme fejl
```

For at udlede en ændret værdi bruges `$~` (funktionel opdatering) — returnerer en **ny** tupel:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalen uændret
>> t2 ¶    // → (10, 999, 30)

// Navngivet tupel — genopbyg eksplicit
person = (navn: "Alice", alder: 25)
ældre  = (navn: person.navn, alder: 26)
>> person.alder ¶    // → 25
>> ældre.alder ¶     // → 26
```

---

## Højereordens funktioner

```zymbol
tal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

fordoblet  = tal$> (x -> x * 2)                // map  → [2,4,6…20]
ligetal    = tal$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total      = tal$< (0, (akk, x) -> akk + x)    // reducer → 55

// Kæde via mellemmænd
trin1 = tal$| (x -> x > 3)
trin2 = trin1$> (x -> x * x)
>> trin2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Navngivne funktioner kan videregives direkte til HOF
fordobl(x) { <~ x * 2 }
er_stor(x) { <~ x > 5 }
r = tal$> fordobl       // ✅ direkte reference
r = tal$| er_stor       // ✅ direkte reference
```

---

## Pipe-operator

Den højre side kræver altid `_` som pladsholder for den rørlagte værdi:

```zymbol
fordobl = x -> x * 2
tilføj = (a, b) -> a + b
forøg = x -> x + 1

5 |> fordobl(_)        // → 10
10 |> tilføj(_, 5)     // → 15
5 |> tilføj(2, _)      // → 7

// Kædet
r = 5 |> fordobl(_) |> forøg(_) |> fordobl(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fejlhåndtering

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division med nul" ¶
} :! {
    >> "andet: " _err ¶    // _err indeholder fejlmeddelelsen
} :> {
    >> "kører altid" ¶
}
```

| Type | Hvornår |
|------|---------|
| `##Div` | Division med nul |
| `##IO` | Fil / system |
| `##Index` | Indeks uden for grænser |
| `##Type` | Typemismatch |
| `##Parse` | Datafortolkning |
| `##Network` | Netværksfejl |
| `##_` | Enhver fejl (opsaml alt) |

---

## Moduler

```zymbol
// lib/beregn.zy — modulets krop er omsluttet af klammeparenteser
# beregn {
    #> { tilføj, hent_PI }

    _PI := 3.14159
    tilføj(a, b) { <~ a + b }
    hent_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/beregn <= b    // alias påkrævet

>> b::tilføj(5, 3) ¶     // → 8
pi = b::hent_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksporter med et andet offentligt navn
# mitlib {
    #> { _intern_tilføj <= sum }

    _intern_tilføj(a, b) { <~ a + b }
}
```

```zymbol
<# ./mitlib <= m

>> m::sum(3, 4) ¶    // → 7  (det interne navn _intern_tilføj er skjult)
```

> **Modulregler**: kun `#>`, funktionsdefinitioner og bogstavelige variabel-/konstantinitialiserere er tilladt inden i `# navn { }`. Eksekverbare sætninger (`>>`, `<<`, løkker osv.) giver fejl E013.

---

## Talsystemer

Zymbol kan vise tal i **69 Unicode-cifrescripts** — Devanagari, arabisk-indisk, thai, klingonskrift pIqaD, matematisk fed, LCD-segmenter og mere. Den aktive tilstand påvirker kun `>>`-output; intern aritmetik er altid binær.

### Aktivering af et script

Skriv `0`- og `9`-cifret fra målscriptet indesluttet i `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisk-indisk (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // nulstil til ASCII
```

### Output og boolske værdier

```zymbol
x = 42
>> x ¶          // → 42   (ASCII som standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimalpunkt altid ASCII)
>> 1 + 2 ¶      // → ३

// Boolske: # præfiks altid ASCII, ciffer tilpasser sig
>> #1 ¶         // → #१   (sand i Devanagari)
>> #0 ¶         // → #०   (falsk — forskellig fra ०  heltal nul)

x = 28 > 4
>> x ¶          // → #१   (sammenligningsresultat følger aktiv tilstand)
```

### Indfødte cifre i kildekode

Alle understøttede scripts' cifre er gyldige bogstaver — i intervaller, modulo, sammenligninger:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolske værdier i ethvert script

`#` + ciffer `0` eller `1` fra enhver blok er et gyldigt boolsk bogstav:

```zymbol
#٠٩#
نشط = #١        // samme som #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` er **altid ASCII**. `#0` (falsk) er altid visuelt forskellig fra `0` (heltal nul) i ethvert script.

---

## Dataoperatorer

```zymbol
// Typekonverteringskast
##.42         // → 42.0  (til Decimaltal)
###3.7        // → 4     (til Heltal, rund)
##!3.7        // → 3     (til Heltal, afkort)

// Fortolk streng til tal
v1 = #|"42"|      // → 42  (Heltal)
v2 = #|"3.14"|    // → 3.14  (Decimaltal)
v3 = #|"abc"|     // → "abc"  (fejlsikker, ingen fejl)

// Rund / afkort
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rund til 2 decimalpladser)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (afkort)

// Talformatering
fmt = #,|1234567|  // → 1,234,567  (kommasepareret)
sci = #^|12345.678|    // → 1.2345678e4  (videnskabelig)

// Baseliteraler
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binær)
c = 0o101        // → 'A'  (oktal)

// Basekonverteringsoutput
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Skalintegration

```zymbol
dato = <\ date +%Y-%m-%d \>     // opfanger stdout (inkl. afsluttende \n)
>> "I dag: " dato

fil = "data.txt"
indhold = <\ cat {fil} \>       // interpolering i kommandoer

output = </"./underskript.zy"/>  // kør et andet Zymbol-script, opfang output
>> output
```

> `><` opfanger CLI-argumenter som et streng-array (kun træ-walker).

---

## Komplet eksempel: FizzBuzz

```zymbol
klassificer(tal) {
    ? tal % 15 == 0 { <~ "FizzBuzz" }
    _? tal % 3  == 0 { <~ "Fizz" }
    _? tal % 5  == 0 { <~ "Buzz" }
    _ { <~ tal }
}

@ i:1..20 { >> klassificer(i) ¶ }
```

---

## Symbolreference

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | variabel | `$#` | længde |
| `:=` | konstant | `$+` | tilføj (kædebart) |
| `>>` | output | `$+[i]` | indsæt ved indeks (1-baseret) |
| `<<` | input | `$-` | fjern første ved værdi |
| `¶` / `\\` | linjeskift | `$--` | fjern alle ved værdi |
| `?` | hvis | `$-[i]` | fjern ved indeks (1-baseret) |
| `_?` | ellers-hvis | `$-[i..j]` | fjern interval (1-baseret) |
| `_` | ellers / jokertegn | `$?` | indeholder |
| `??` | match | `$??` | find alle indekser (1-baseret) |
| `@` | løkke | `$[s..e]` | udsnit (1-baseret) |
| `@ N { }` | tæller-løkke (N gentagelser) | `$>` | map |
| `@!` | bryd | `$\|` | filtrer |
| `@>` | fortsæt | `$<` | reducer |
| `@:navn { }` | mærket løkke | `$/ delim` | strengopdeling |
| `@:navn!` | bryd mærke | `$++ a b c` | sammenkæd opbyg |
| `@:navn>` | fortsæt mærke | `arr[i>j>k]` | navigationsindeks |
| `->` | lambda | `arr[i] = val` | opdater element (kun arrays) |
| `arr[i] += val` | sammensat opdatering | `arr[i]$~` | funktionel opdatering (ny kopi) |
| `$^+` | sorter stigende (primitive) | `$^-` | sorter faldende (primitive) |
| `$^` | sorter med komparator (tupler) | `<~` | returner |
| `\|>` | pipe | `!?` | forsøg |
| `:!` | fang | `:>` | endelig |
| `#1` | sand | `#0` | falsk |
| `$!` | er fejl | `$!!` | videreformidle fejl |
| `<#` | importer | `#>` | eksporter |
| `#` | deklarer modul | `::` | modulkald |
| `.` | feltadgang | `#?` | type-metadata |
| `#\|..\|` | fortolk tal | `##.` | konverter til Decimaltal |
| `###` | konverter til Heltal (rund) | `##!` | konverter til Heltal (afkort) |
| `#.N\|..\|` | rund | `#!N\|..\|` | afkort |
| `#,\|..\|` | kommaformat | `#^\|..\|` | videnskabelig |
| `#d0d9#` | talsystemskift | `#09#` | nulstil til ASCII |
| `<\ ..\>` | skaludførelse | `>\<` | CLI-argumenter |
| `\ var` | eksplicit slet variabel | | |

---

## Versionshistorik

### v0.0.4 — 1-baseret indeksering, førsteklasses funktioner og modulblokke _(april 2026)_

- **Ændring** Al indeksering skiftet til **1-baseret** — `arr[1]` er det første element; `arr[0]` er en kørselstidsfejl
- **Tilføjet** Navngivne funktioner er **førsteklasses værdier** — videregiv direkte til HOF: `tal$> fordobl`
- **Tilføjet** Modul **bloksyntaks** påkrævet: `# navn { ... }` — flad syntaks fjernet
- **Tilføjet** Flerdimensional indeksering: `arr[i>j>k]` (navigation), `arr[p ; q]` (flad udtrækning)
- **Tilføjet** Typekonverteringskast: `##.udtryk` (Decimaltal), `###udtryk` (Heltal rund), `##!udtryk` (Heltal afkort)
- **Tilføjet** Strengopdeling: `str$/ delim` — returnerer `Array(Tekst)`
- **Tilføjet** Sammenkæd opbyg: `base$++ a b c` — tilføjer flere elementer
- **Tilføjet** Tæller-løkke: `@ N { }` — gentager præcis N gange
- **Tilføjet** Mærket løkkesyntaks: `@:navn { }`, `@:navn!`, `@:navn>` — erstatter `@ @navn` / `@! navn`
- **Tilføjet** Variabelomfangsregler: `_navn`-variable har præcist blokopfang; `\ var` sletter tidligt
- **Tilføjet** Matchsammenligningsmønstre: `< 0 :`, `> 5 :`, `== 42 :` osv.
- **Tilføjet** Modul E013-fejl: eksekverbare sætninger i modulkrop er forbudt
- **Rettet** `take_variable` ødelægger ikke længere modulkonstanter ved skriveback
- **Rettet** `alias.CONST` opløses nu korrekt; `#>` kan optræde efter funktionsdefinitioner
- **VM** Fuld paritet: 393/393 tests bestået

### v0.0.3 — Unicode-talsystemer og LSP-forbedringer _(april 2026)_

- **Tilføjet** 69 Unicode-cifferblokke med tilstandsskiftetoken `#d0d9#`
- **Tilføjet** Boolske bogstaver i ethvert script — `#१` / `#०`, `#١` / `#٠` osv.
- **Tilføjet** Klingon pIqaD-cifre (CSUR PUA U+F8F0–U+F8F9)
- **Tilføjet** `SetNumeralMode` VM-opkode — fuld paritet med træ-walker
- **Tilføjet** REPL respekterer aktiv talsystemtilstand i ekko og variabelvisning
- **Ændret** Boolsk `>>`-output inkluderer nu `#`-præfiks (`#0` / `#1`) i alle tilstande

### v0.0.2_01 — Operatornavn _(30. mar. 2026)_

- **Ændret** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — konsistent med `#`-formatpræfiksfamilien
- **Tilføjet** Eksportalias: geneksporter modulmedlemmer under et andet navn

### v0.0.2 — SamlingsAPI-redesign og installationsprogrammer _(24. mar. 2026)_

- **Tilføjet** Samlet `$`-operatorfamilie til arrays og strenge (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Tilføjet** Destruktureringstildeling til arrays, tupler og navngivne tupler
- **Tilføjet** Negative indekser (`arr[-1]` = sidste element)
- **Tilføjet** Native installationsprogrammer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. mar. 2026)_

- **Tilføjet** Sammensat tildeling `^=`
- **Rettet** Parser-aritmetik-hjørnecases; dokumentationsrettelser

### v0.0.1 — Første offentlige udgivelse _(22. mar. 2026)_

- Træ-walker-fortolker + register-VM (`--vm`, ~4× hurtigere, ~95% paritet)
- Alle kernekonstruktioner: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fuld Unicode-identifikatorer, modulsystem, lambdaer, lukninger, fejlhåndtering
- REPL, LSP, VS Code-udvidelse, formaterer (`zymbol fmt`)

---

_Zymbol-Lang — Symbolsk. Universelt. Uforanderligt._
