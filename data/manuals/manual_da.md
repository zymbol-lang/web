> **Advarsel:** Denne dokumentation er oprettet og oversat af kunstig intelligens (KI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Håndbog

> **Revideret til v0.0.5 — 2026-05-12**

**Zymbol-Lang** er et symbolsk programmeringssprog. Ingen nøgleord — alt er et symbol. Fungerer identisk på ethvert menneskesprog.

- Ingen `if`, `while`, `return` — kun `?`, `@`, `<~`
- Fuld Unicode — identifikatorer på ethvert sprog eller emoji
- Menneskesprogs-agnostisk — koden er den samme overalt

**Fortolkerversion**: v0.0.5 | **Testdækning**: 436/436 (TW ↔ VM paritet)

---

## Variabler & Konstanter

```zymbol
x = 10              // mutabel variabel
PI := 3.14159       // konstant — gentildeling er en kørselsfejl
navn = "Alice"
aktiv = #1          // boolesk sand
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

`°` (gradstegn, U+00B0) auto-initialiserer en variabel til dens neutrale værdi ved første brug:

```zymbol
tal = [3, 1, 4, 1, 5]
@ n:tal {
    °total += n    // auto-init til 0 over løkken; overlever efter @
}
>> total ¶         // → 14
```

> `°x` (præfiks) forankrer over løkken — resultatet er tilgængeligt efter `@`.
> `x°` (postfiks) forankrer inden i løkken — forsvinder når løkken slutter.
> Kun træ-gennemgang.

---

## Datatyper

| Type | Literal | `#?`-tag | Noter |
|------|---------|----------|-------|
| Heltal | `42`, `-7` | `###` | 64-bit fortegn |
| Decimaltal | `3.14`, `1.5e10` | `##.` | Videnskabelig notation OK |
| Tekst | `"tekst"` | `##"` | Interpolation: `"Hej {navn}"` |
| Tegn | `'A'` | `##'` | Enkelt Unicode-tegn |
| Boolesk | `#1`, `#0` | `##?` | IKKE numerisk — `#1 ≠ 1` |
| Tabel | `[1, 2, 3]` | `##]` | Homogene elementer |
| Tupel | `(a, b)` | `##)` | Positionel |
| Navngivet Tupel | `(x: 1, y: 2)` | `##)` | Navngivne felter |
| Funktion | navngivet funktionsref | `##()` | Første klasse; visning `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Første klasse; visning `<lambd/N>` |

```zymbol
// Typeintrospktion — returnerer (type, cifre, værdi)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Uddata & Inddata

```zymbol
>> "Hej" ¶                        // ¶ eller \\ til eksplicit ny linje
>> "a=" a " b=" b ¶               // sammensætning — flere værdier
>> (tab$#) ¶                      // postfiks-operatorer kræver ( ) i >>

<< navn                           // læs ind i variabel (ingen prompt)
<< "Indtast navn: " navn          // med prompt
```

> `¶` (AltGr+R på spansk tastatur) og `\\` er ækvivalente nye linjer.

---

## TUI-primitiver

Terminalbrugergrænsefladeoperatorer til interaktive programmer. De fleste kræver et `>>| { }`-blok (alternativ skærm + rå tilstand).

```zymbol
>>| {
    >>!                             // ryd alternativ skærm
    >>~ (1, 1, 0, 10) > "Kører"    // række 1, kol 1, fg=10 (grøn)
    @~ 1000                         // pause 1 sekund (1000 ms)
    >>~ (2, 1) > "Færdig."
}
// terminalen gendannes automatisk ved afslutning
```

```zymbol
// Tastetryk og terminalstørrelse
>>| {
    [raekker, kolonner] = >>?              // forespørg terminalstørrelse
    >>~ (1, 1) > "Terminal: " raekker " x " kolonner
    <<| tast                               // blokerende tastetryk
    >>~ (2, 1) > "Trykket: " tast
}
```

> `>>!` rydder skærmen. `>>?` returnerer `[raekker, kolonner]`. `@~ N` sover N millisekunder.
> `<<|` læser ét tastetryk (blokerende); `<<|?` forespørger uden blokering (returnerer `'\0'` hvis ingen).
> Positionel uddata-tupel: `(række, kol, BKS, fg, bg)` — ethvert slot kan udelades med komma (`>>~ (,,, 196) > "rød"`).
> BKS-bitmaske: `1`=Fed, `2`=Kursiv, `4`=Understreget. ANSI 256-farve-palette (`0`=terminal standard).
> Kun træ-gennemgang (undtagen `>>!`, `>>?`, `@~`, `>>~` som også kører i `--vm`).

---

## Operatorer

```zymbol
// Aritmetik
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (heltalsdivision)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (eksponentiering)

// Sammenligning — tildel for at inspicere
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logiske
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Tekst

```zymbol
// To sammensætningsformer
navn = "Alice"
n = 42

>> "Hej " navn " du har " n ¶        // sammensætning — i >>
beskr = "Hej {navn}, du har {n}"     // interpolation — overalt
```

```zymbol
s = "Hej Verden"
laen = s$#                 // 10
del = s$[1..3]             // "Hej"  (1-baseret, slut inklusiv)
har = s$? "Verden"         // #1
dele = "a,b,c,d"$/ ','     // [a, b, c, d]  (opdel efter afgrænser)
erstat = s$~~["e":"E"]     // "HEj VErdEn"  (erstat alle)
erstat1 = s$~~["e":"E":1]  // "HEj Verden"  (første N)
linje = "─" $* 20          // "────────────────────"  (gentag N gange)
```

> `+` er kun til tal. Brug `,`, sammensætning eller interpolation til tekst.

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

> `{ }`-klammer er **påkrævede** selv for en enkelt sætning.

---

## Mønstertilpasning

```zymbol
// Intervaller
point = 85
karakter = ?? point {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> karakter ¶    // → B

// Tekst
farve = "roed"
kode = ?? farve {
    "roed"   => "#FF0000"
    "groen"  => "#00FF00"
    _        => "#000000"
}

// Sammenligningsmomstre
temp = -5
tilstand = ?? temp {
    < 0  => "is"
    < 20 => "kold"
    < 35 => "varm"
    _    => "hed"
}
>> tilstand ¶    // → is

// Sætningsform (blok-arme)
n = -3
?? n {
    0    => { >> "nul" ¶ }
    < 0  => { >> "negativ" ¶ }
    _    => { >> "positiv" ¶ }
}
```

---

## Løkker

```zymbol
@ i:0..4  { >> i " " }        // interval inklusivt:   0 1 2 3 4
@ i:1..9:2 { >> i " " }       // med skridt:           1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omvendt:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (mens)

frugter = ["æble", "pære", "drue"]
@ f:frugter { >> f ¶ }        // for-hvert tabel

@ t:"hej" { >> t "-" }
>> ¶                          // → h-e-j-  (for-hvert tekst)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> fortsæt
    ? i > 7 { @! }             // @! afbryd
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

// Mærket løkke (indlejret afbrydelse)
taeller = 0
@:ydre {
    taeller++
    ? taeller >= 3 { @:ydre! }
}
>> taeller ¶                   // → 3
```

---

## Funktioner

```zymbol
laeg_til(a, b) { <~ a + b }
>> laeg_til(3, 4) ¶    // → 7

fakultet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultet(n - 1)
}
>> fakultet(5) ¶    // → 120
```

Funktioner har **isoleret omfang** — de kan ikke læse ydre variabler. Brug udgangsparametre `<~` til at ændre kaldervariabler:

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

> Navngivne funktioner er **første klasses værdier** — send direkte: `tal$> dobbelt`. For indpakning: `x -> fn(x)` er også gyldigt.

---

## Lambda & Closure

```zymbol
dobbelt = x -> x * 2
sum = (a, b) -> a + b
>> dobbelt(5) ¶    // → 10
>> sum(3, 7) ¶    // → 10

// Blok-lambda
klassificer = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "nul"
}

// Closure — fanger ydre omfang
faktor = 3
tredobbelt = x -> x * faktor
>> tredobbelt(7) ¶    // → 21

// Fabrik
lav_laegger(n) { <~ x -> x + n }
laeg10_til = lav_laegger(10)
>> laeg10_til(5) ¶    // → 15

// I tabeller
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Tabeller

Tabeller er **muterbare** og indeholder elementer af **samme type**.

```zymbol
tab = [1, 2, 3, 4, 5]

x = tab[1]      // 1 — adgang (1-baseret: første element)
x = tab[-1]     // 5 — negativt indeks (sidste element)
x = tab$#       // 5 — længde (brug (tab$#) i >>)

tab = tab$+ 6            // tilføj → [1,2,3,4,5,6]
tab2 = tab$+[2] 99       // indsæt ved position 2 (1-baseret)
tab3 = tab$- 3           // fjern første forekomst af værdi
tab4 = tab$-- 3          // fjern alle forekomster
tab5 = tab$-[1]          // fjern ved indeks 1 (første element)
tab6 = tab$-[2..3]       // fjern interval (1-baseret, slut inklusiv)

har = tab$? 3            // #1 — indeholder
pos = tab$?? 3           // [3] — alle indeks for værdi (1-baseret)
udsnit = tab$[1..3]      // [1,2,3] — udsnit (1-baseret, slut inklusiv)
udsnit2 = tab$[1:3]      // [1,2,3] — samme, antal-baseret syntaks

stigende = tab$^+        // sorteret stigende  (kun primitiver)
faldende = tab$^-        // sorteret faldende  (kun primitiver)

// Navngivne/positionelle tupel-tabeller — brug $^ med komparator-lambda
db = [(navn: "Carla", alder: 28), (navn: "Ana", alder: 25), (navn: "Bob", alder: 30)]
efter_alder = db$^ (a, b -> a.alder < b.alder)    // stigende efter alder  (<)
efter_navn  = db$^ (a, b -> a.navn > b.navn)       // faldende efter navn (>)
>> efter_alder[1].navn ¶     // → Ana
>> efter_navn[1].navn ¶      // → Carla

// Direkte elementopdatering (kun tabeller)
tab[1] = 99              // tildel
tab[2] += 5              // sammensat: +=  -=  *=  /=  %=  ^=

// Funktionel opdatering — returnerer ny tabel; originalen uændret
tab2 = tab[2]$~ 99
```

> Alle samleroperatorer returnerer en **ny tabel**. Tildel tilbage: `tab = tab$+ 4`.
> `$+` kan kædes: `tab = tab$+ 5$+ 6$+ 7`. Andre operatorer bruger mellemliggende tildelinger.
> **Indeksering er 1-baseret**: `tab[1]` er første element; `tab[0]` er en kørselsfejl.
> `$^+` / `$^-` sorterer **primitive tabeller** (tal, tekst). For tupel-tabeller brug `$^` med komparator-lambda — retning er kodet i lambda (`<` = stigende, `>` = faldende).

**Værdisemantik** — tildeling af en tabel til en anden variabel opretter en uafhængig kopi:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er upåvirket
```

```zymbol
// Indlejrede tabeller (1-baseret indeksering)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (række 2, kolonne 3)
```

---

## Destrukturering

```zymbol
// Tabel
tab = [10, 20, 30, 40, 50]
[a, b, c] = tab              // a=10  b=20  c=30
[foerste, *rest] = tab       // foerste=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ kasserer

// Positionel tupel
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Navngivet tupel
person = (navn: "Ana", alder: 25, by: "Madrid")
(navn: n, alder: a) = person   // n="Ana"  a=25
```

---

## Tupler

Tupeler er **uforanderlige** ordnede beholdere der kan indeholde værdier af **forskellige typer**.
I modsætning til tabeller kan elementer ikke ændres efter oprettelse.

```zymbol
// Positionel — blandede typer tilladt
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
p = (pos: pos, etiket: "oprindelse")
>> p.pos.x ¶        // → 10
```

**Uforanderlighed** — ethvert forsøg på at ændre et tupel-element er en kørselsfejl:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kørselsfejl: tupeler er uforanderlige
// t[1] += 5    // ❌ samme fejl
```

For at udlede en ændret værdi brug `$~` (funktionel opdatering) — returnerer en **ny** tupel:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalen uændret
>> t2 ¶    // → (10, 999, 30)

// Navngivet tupel — genopbyg eksplicit
person = (navn: "Alice", alder: 25)
aeldre  = (navn: person.navn, alder: 26)
>> person.alder ¶    // → 25
>> aeldre.alder ¶    // → 26
```

---

## Højere Ordensfunktioner

```zymbol
tal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

fordoblet = tal$> (x -> x * 2)                // map  → [2,4,6…20]
lige      = tal$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total     = tal$< (0, (acc, x) -> acc + x)     // reduce → 55

// Kæde via mellemled
trin1 = tal$| (x -> x > 3)
trin2 = trin1$> (x -> x * x)
>> trin2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Navngivne funktioner kan sendes direkte til HOF
dobbelt(x) { <~ x * 2 }
er_stor(x) { <~ x > 5 }
r = tal$> dobbelt      // ✅ direkte reference
r = tal$| er_stor      // ✅ direkte reference
```

---

## Pipe-operator

Højre side kræver altid `_` som pladsholder for den sendte værdi:

```zymbol
dobbelt = x -> x * 2
laeg_til = (a, b) -> a + b
forøg = x -> x + 1

r1 = 5 |> dobbelt(_)          // → 10
r2 = 10 |> laeg_til(_, 5)     // → 15
r3 = 5 |> laeg_til(2, _)      // → 7

// Kædet
r = 5 |> dobbelt(_) |> forøg(_) |> dobbelt(_)
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
    >> "anden fejl: " _err ¶    // _err indeholder fejlmeddelelsen
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
| `##Parse` | Dataparsing |
| `##Network` | Netværksfejl |
| `##_` | Enhver fejl (catch-all) |

---

## Moduler

```zymbol
// lib/beregn.zy — modulkroppen er omsluttet i klammer
# beregn {
    #> { laeg_til, get_PI }

    _PI := 3.14159
    laeg_til(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/beregn => b    // alias påkrævet

>> b::laeg_til(5, 3) ¶     // → 8
pi = b::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksporter med et andet offentligt navn
# mittbibliotek {
    #> { _intern_laeg_til => sum }

    _intern_laeg_til(a, b) { <~ a + b }
}
```

```zymbol
<# ./mittbibliotek => m

>> m::sum(3, 4) ¶    // → 7  (det interne navn _intern_laeg_til er skjult)
```

> **Modulregler**: kun `#>`, funktionsdefinitioner og bogstavelige variabel-/konstantinitialiseringer er tilladt i `# navn { }`. Eksekverbare sætninger (`>>`, `<<`, løkker, etc.) giver fejl E013.

---

## Talsystemer

Zymbol kan vise tal i **69 Unicode-cifreskrifter** — Devanagari, arabisk-indisk, thai, Klingon pIqaD, matematisk fed, LCD-segmenter og mere. Den aktive tilstand påvirker kun `>>`-output; intern aritmetik er altid binær.

### Aktivering af et skrift

Skriv `0`- og `9`-cifrene i målskriftet omgivet af `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisk-indisk (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // nulstil til ASCII
```

### Output og booleaner

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimaltegn altid ASCII)
>> 1 + 2 ¶      // → ३

// Booleaner: #-præfiks altid ASCII, ciffer tilpasser sig
>> #1 ¶         // → #१   (sand i Devanagari)
>> #0 ¶         // → #०   (falsk — adskilt fra ०  heltalsnul)

x = 28 > 4
>> x ¶          // → #१   (sammenligningsresultat følger aktiv tilstand)
```

### Native ciffer-literaler i kilde

Ethvert understøttet skrifts cifre er gyldige literaler — i intervaller, modulo, sammenligninger:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booleske literaler i ethvert skrift

`#` + ciffer `0` eller `1` fra ethvert blok er et gyldigt boolesk literal:

```zymbol
#٠٩#
aktiv = #١        // samme som #1
>> aktiv ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` er **altid ASCII**. `#0` (falsk) er altid visuelt adskilt fra `0` (heltalsnul) i ethvert skrift.

---

## Dataoperatorer

```zymbol
// Typekonverteringscast
f = ##.42         // → 42.0  (til Decimaltal)
i = ###3.7        // → 4     (til Heltal, afrund)
t = ##!3.7        // → 3     (til Heltal, afkort)

// Parse tekst til tal
v1 = #|"42"|      // → 42  (Heltal)
v2 = #|"3.14"|    // → 3.14  (Decimaltal)
v3 = #|"abc"|     // → "abc"  (fejlsikker, ingen fejl)

// Afrunding / afkortning
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (afrund til 2 decimaler)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (afkort)

// Talformatering
fmt = #,|1234567|  // → 1,234,567  (kommasepareret)
sci = #^|12345.678|    // → 1.2345678e4  (videnskabelig)

// Basisliteraler
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binær)
c = 0o101        // → 'A'  (oktal)

// Basiskonverteringsoutput
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integration

```zymbol
dato = <\ date +%Y-%m-%d \>     // fanger stdout (inkluderer afsluttende \n)
>> "I dag: " dato

fil = "data.txt"
indhold = <\ cat {fil} \>       // interpolation i kommandoer

output = </"./underscript.zy"/> // udfør andet Zymbol-script, fang output
>> output
```

> `><` fanger CLI-argumenter som en tekst-tabel (kun træ-gennemgang).

---

## Komplet Eksempel: FizzBuzz

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
| `:=` | konstant | `$+` | tilføj (kædbar) |
| `>>` | output | `$+[i]` | indsæt ved indeks (1-baseret) |
| `<<` | input | `$-` | fjern første efter værdi |
| `¶` / `\\` | ny linje | `$--` | fjern alle efter værdi |
| `?` | hvis | `$-[i]` | fjern ved indeks (1-baseret) |
| `_?` | ellers-hvis | `$-[i..j]` | fjern interval (1-baseret) |
| `_` | ellers / wildcard | `$?` | indeholder |
| `??` | match | `$??` | find alle indekser (1-baseret) |
| `@` | løkke | `$[s..e]` | udsnit (1-baseret) |
| `@ N { }` | N-gange-løkke | `$>` | map |
| `@!` | afbryd | `$\|` | filter |
| `@>` | fortsæt | `$<` | reduce |
| `@:navn { }` | mærket løkke | `$/ delim` | tekst opdel |
| `@:navn!` | afbryd mærke | `$++ a b c` | sammensæt byg |
| `@:navn>` | fortsæt mærke | `tab[i>j>k]` | navigationsindeks |
| `->` | lambda | `tab[i] = val` | opdater element (kun tabeller) |
| `tab[i] += val` | sammensat opdatering | `tab[i]$~` | funktionel opdatering (ny kopi) |
| `$^+` | sortér stigende (primitiver) | `$^-` | sortér faldende (primitiver) |
| `$^` | sortér med komparator (tupeler) | `<~` | returnér |
| `\|>` | pipe | `!?` | forsøg |
| `:!` | fang | `:>` | til sidst |
| `#1` | sand | `#0` | falsk |
| `$!` | er fejl | `$!!` | udbreder fejl |
| `<#` | importér | `#>` | eksportér |
| `#` | erklær modul | `::` | modulkald |
| `.` | feltadgang | `#?` | typemetadata |
| `#\|..\|` | parse tal | `##.` | cast til Decimaltal |
| `###` | cast til Heltal (afrund) | `##!` | cast til Heltal (afkort) |
| `#.N\|..\|` | afrund | `#!N\|..\|` | afkort |
| `#,\|..\|` | kommaformat | `#^\|..\|` | videnskabeligt |
| `#d0d9#` | talsystemskift | `#09#` | nulstil til ASCII |
| `<\ ..\>` | shell-udfør | `>\<` | CLI-argumenter |
| `\ var` | eksplicit ødelæg variabel | `°x` / `x°` | varm definition (auto-init) |
| `>>|` | TUI-blok (alternativ skærm) | `>>~` | positioneret output |
| `>>!` | ryd skærm | `>>?` | forespørg terminalstørrelse |
| `<<\|` | blokerende tastetryk | `<<\|?` | ikke-blokerende tastetryk |
| `@~ N` | sov N millisekunder | `$*` | gentag tekst N gange |

---

## Versions-Changelog

### v0.0.5 — TUI-primitiver, Varm Definition & Tekstgentagelse _(Maj 2026)_

- **Brydende** Match-arm-separator: `mønster : resultat` → `mønster => resultat`
- **Brydende** Importalias: `<# sti <= alias` → `<# sti => alias`
- **Brydende** Eksportomdøbning: `#> { fn <= pub }` → `#> { fn => pub }`
- **Tilføjet** TUI-blok `>>| { }` — alternativ skærm + rå tilstand; rydder op ved afslutning
- **Tilføjet** Positioneret output `>>~ (række, kol, BKS, fg, bg) > elementer` — sparse slots, ANSI 256-farver
- **Tilføjet** Tastetastindgang `<<| var` (blokerende) og `<<|? var` (ikke-blokerende forespørgsel)
- **Tilføjet** `>>!` ryd skærm, `>>?` forespørg terminalstørrelse, `@~ N` sov N millisekunder
- **Tilføjet** Varm definition `°x` / `x°` — auto-initialiser variabel ved første brug i løkker
- **Tilføjet** Tekstgentagelse `str $* N` — gentag en tekst N gange
- **VM** Paritet: 436/436 tests består

### v0.0.4 — 1-Baseret Indeksering, Første Klasses Funktioner & Modulblokke _(April 2026)_

- **Brydende** Al indeksering skiftet til **1-baseret** — `tab[1]` er første element; `tab[0]` er en kørselsfejl
- **Tilføjet** Navngivne funktioner er **første klasses værdier** — send direkte til HOF: `tal$> dobbelt`
- **Tilføjet** Modul-**bloksyntaks** påkrævet: `# navn { ... }` — flad syntaks fjernet
- **Tilføjet** Multi-dimensionel indeksering: `tab[i>j>k]` (navigation), `tab[p ; q]` (flad udtræk)
- **Tilføjet** Typekonverteringscast: `##.expr` (Decimaltal), `###expr` (Heltal afrund), `##!expr` (Heltal afkort)
- **Tilføjet** Tekst-opdeling: `str$/ delim` — returnerer `Tabel(Tekst)`
- **Tilføjet** Sammensæt-byg: `base$++ a b c` — tilføjer flere elementer
- **Tilføjet** N-gange-løkke: `@ N { }` — gentag præcis N gange
- **Tilføjet** Mærket løkke-syntaks: `@:navn { }`, `@:navn!`, `@:navn>` — erstatter `@ @navn` / `@! navn`
- **Tilføjet** Variabel-omfangsregler: `_navn`-variabler har præcist blok-omfang; `\ var` ødelægger tidligt
- **Tilføjet** Match-sammenligningsmomstre: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Tilføjet** Modul E013-fejl: eksekverbare sætninger i modulkrop er forbudt
- **Rettet** `take_variable` ødelægger ikke længere modulkonstanter ved tilbageskrivning
- **Rettet** `alias.CONST` opløses nu korrekt; `#>` kan vises efter funktionsdefinitioner
- **VM** Fuld paritet: 393/393 tests består

### v0.0.3 — Unicode Talsystemer & LSP-forbedringer _(April 2026)_

- **Tilføjet** 69 Unicode-cifrerblokke med tilstandsskift-token `#d0d9#`
- **Tilføjet** Booleske literaler i ethvert skrift — `#१` / `#०`, `#١` / `#٠`, etc.
- **Tilføjet** Klingon pIqaD-cifre (CSUR PUA U+F8F0–U+F8F9)
- **Tilføjet** `SetNumeralMode` VM-opkode — fuld paritet med træ-gennemgang
- **Tilføjet** REPL respekterer aktiv taltilstand i ekko og variabelvisning
- **Ændret** Boolesk `>>`-output inkluderer nu `#`-præfiks (`#0` / `#1`) i alle tilstande

### v0.0.2_01 — Operatøromdøbning _(30 Mar 2026)_

- **Ændret** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — konsistent med `#`-formatpræfiks-familie
- **Tilføjet** Eksportalias: gen-eksportér modulmedlemmer under et andet navn

### v0.0.2 — Samler-API-redesign & Installationsprogrammer _(24 Mar 2026)_

- **Tilføjet** Samlet `$`-operatorfamilie for tabeller og tekst (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Tilføjet** Destruktureringssignatur for tabeller, tupeler og navngivne tupeler
- **Tilføjet** Negative indekser (`tab[-1]` = sidste element)
- **Tilføjet** Native installationsprogrammer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Tilføjet** Sammensat tildeling `^=`
- **Rettet** Parser-aritmetiske edge cases; dokumentationsrettelser

### v0.0.1 — Første Offentlige Udgivelse _(22 Mar 2026)_

- Træ-gennemgangsfortolker + register-VM (`--vm`, ~4× hurtigere, ~95% paritet)
- Alle kernestrukturer: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fuld Unicode-identifikatorer, modulsystem, lambdas, closures, fejlhåndtering
- REPL, LSP, VS Code-udvidelse, formatering (`zymbol fmt`)

---

_Zymbol-Lang — Symbolsk. Universelt. Uforanderligt._
