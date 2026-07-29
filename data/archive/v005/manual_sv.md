> **Varning:** Denna dokumentation skapades och översattes av artificiell intelligens (AI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Handbok

> **Reviderad för v0.0.5 — 2026-05-12**

**Zymbol-Lang** är ett symboliskt programmeringsspråk. Inga nyckelord — allt är ett symbol. Fungerar identiskt på vilket mänskligt språk som helst.

- Ingen `if`, `while`, `return` — bara `?`, `@`, `<~`
- Full Unicode — identifierare på vilket språk eller emoji som helst
- Mänskligt-språk-agnostiskt — koden är densamma överallt

**Tolkarversion**: v0.0.5 | **Testtäckning**: 436/436 (TW ↔ VM paritet)

---

## Variabler & Konstanter

```zymbol
x = 10              // muterbar variabel
PI := 3.14159       // konstant — omtilldelning är ett körningsfel
namn = "Alice"
aktiv = #1          // booleanskt sant
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

`°` (gradsymbol, U+00B0) initialiserar automatiskt en variabel till sitt neutrala värde vid första användning:

```zymbol
tal = [3, 1, 4, 1, 5]
@ n:tal {
    °totalt += n    // auto-init till 0 ovanför slingan; överlever efter @
}
>> totalt ¶         // → 14
```

> `°x` (prefix) förankrar ovanför slingan — resultatet är tillgängligt efter `@`.
> `x°` (postfix) förankrar inuti slingan — försvinner när slingan slutar.
> Endast trädgenomgång.

---

## Datatyper

| Typ | Literal | `#?`-tagg | Noteringar |
|-----|---------|-----------|------------|
| Heltal | `42`, `-7` | `###` | 64-bit tecknat |
| Decimaltal | `3.14`, `1.5e10` | `##.` | Vetenskaplig notation OK |
| Text | `"text"` | `##"` | Interpolation: `"Hej {namn}"` |
| Tecken | `'A'` | `##'` | Enskilt Unicode-tecken |
| Booleanskt | `#1`, `#0` | `##?` | INTE numeriskt — `#1 ≠ 1` |
| Lista | `[1, 2, 3]` | `##]` | Homogena element |
| Tupel | `(a, b)` | `##)` | Positionsbaserad |
| Namngiven Tupel | `(x: 1, y: 2)` | `##)` | Namngivna fält |
| Funktion | namngiven funktionsreferens | `##()` | Första klass; visning `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Första klass; visning `<lambd/N>` |

```zymbol
// Typsintrospektion — returnerar (typ, siffror, värde)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Utdata & Indata

```zymbol
>> "Hej" ¶                        // ¶ eller \\ för explicit ny rad
>> "a=" a " b=" b ¶               // sammansättning — flera värden
>> (lista$#) ¶                    // postfix-operatorer kräver ( ) i >>

<< namn                           // läs in i variabel (ingen prompt)
<< "Ange namn: " namn             // med prompt
```

> `¶` (AltGr+R på spanskt tangentbord) och `\\` är likvärdiga nya rader.

---

## TUI-primitiver

Terminalanvändargränssnittsoperatorer för interaktiva program. De flesta kräver ett `>>| { }`-block (alternativ skärm + råläge).

```zymbol
>>| {
    >>!                             // rensa alternativ skärm
    >>~ (1, 1, 0, 10) > "Kör"      // rad 1, kol 1, fg=10 (grön)
    @~ 1000                         // paus 1 sekund (1000 ms)
    >>~ (2, 1) > "Klar."
}
// terminalen återställs automatiskt vid avslutning
```

```zymbol
// Knapptryckning och skärmstorlek
>>| {
    [rader, kolumner] = >>?              // fråga om skärmstorlek
    >>~ (1, 1) > "Terminal: " rader " x " kolumner
    <<| tangent                          // blockerande knapptryckning
    >>~ (2, 1) > "Tryckt: " tangent
}
```

> `>>!` rensar skärm. `>>?` returnerar `[rader, kolumner]`. `@~ N` sover N millisekunder.
> `<<|` läser ett knapptryck (blockerande); `<<|?` pollar utan blockering (returnerar `'\0'` om inget).
> Positionsbaserad utdatatupel: `(rad, kol, BKS, fg, bg)` — vilket spår som helst kan utelämnas med komma (`>>~ (,,, 196) > "röd"`).
> BKS-bitmask: `1`=Fet, `2`=Kursiv, `4`=Understruken. ANSI 256-färgpalett (`0`=terminalstandard).
> Endast trädgenomgång (utom `>>!`, `>>?`, `@~`, `>>~` som också körs i `--vm`).

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
r6 = a ^ b    // 1000  (potenser)

// Jämförelse — tilldela för att inspektera
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logiska
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Text

```zymbol
// Två sammansättningsformer
namn = "Alice"
n = 42

>> "Hej " namn " du har " n ¶       // sammansättning — i >>
beskr = "Hej {namn}, du har {n}"    // interpolation — var som helst
```

```zymbol
s = "Hej Världen"
len = s$#                  // 12
del = s$[1..3]             // "Hej"  (1-baserat, slut inklusivt)
har = s$? "Världen"        // #1
delar = "a,b,c,d"$/ ','    // [a, b, c, d]  (dela efter avgränsare)
byt = s$~~["e":"E"]        // "HEj VärldEn"  (ersätt alla)
byt1 = s$~~["e":"E":1]     // "HEj Världen"  (första N)
linje = "─" $* 20          // "────────────────────"  (upprepa N gånger)
```

> `+` är bara för tal. Använd `,`, sammansättning eller interpolation för text.

---

## Kontrollflöde

```zymbol
x = 7

? x > 0 { >> "positiv" ¶ }

? x > 100 {
    >> "stor" ¶
} _? x > 0 {
    >> "positiv" ¶
} _? x == 0 {
    >> "noll" ¶
} _ {
    >> "negativ" ¶
}
```

> `{ }`-hängslen är **obligatoriska** även för en enskild sats.

---

## Mönstermatchning

```zymbol
// Intervall
poäng = 85
betyg = ?? poäng {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> betyg ¶    // → B

// Text
färg = "röd"
kod = ?? färg {
    "röd"    => "#FF0000"
    "grön"   => "#00FF00"
    _        => "#000000"
}

// Jämförelsemönster
temp = -5
tillstånd = ?? temp {
    < 0  => "is"
    < 20 => "kall"
    < 35 => "varm"
    _    => "het"
}
>> tillstånd ¶    // → is

// Satsform (block-armar)
n = -3
?? n {
    0    => { >> "noll" ¶ }
    < 0  => { >> "negativ" ¶ }
    _    => { >> "positiv" ¶ }
}
```

---

## Slingor

```zymbol
@ i:0..4  { >> i " " }        // intervall inklusivt:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // med steg:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omvänt:               5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (medan)

frukter = ["äpple", "päron", "druva"]
@ f:frukter { >> f ¶ }        // för-varje lista

@ t:"hej" { >> t "-" }
>> ¶                          // → h-e-j-  (för-varje text)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> fortsätt
    ? i > 7 { @! }             // @! bryt
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Oändlig slinga
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Märkt slinga (nästlad brytning)
räknare = 0
@:yttre {
    räknare++
    ? räknare >= 3 { @:yttre! }
}
>> räknare ¶                   // → 3
```

---

## Funktioner

```zymbol
lägg_till(a, b) { <~ a + b }
>> lägg_till(3, 4) ¶    // → 7

fakultet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultet(n - 1)
}
>> fakultet(5) ¶    // → 120
```

Funktioner har **isolerat omfång** — de kan inte läsa yttre variabler. Använd utdataparametrar `<~` för att modifiera anropsvariabler:

```zymbol
byt_plats(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
byt_plats(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Namngivna funktioner är **förstaklassvärden** — skicka direkt: `tal$> dubbel`. För inpackning: `x -> fn(x)` är också giltigt.

---

## Lambda & Stängning

```zymbol
dubbel = x -> x * 2
summa = (a, b) -> a + b
>> dubbel(5) ¶    // → 10
>> summa(3, 7) ¶    // → 10

// Block-lambda
klassificera = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "noll"
}

// Stängning — fångar yttre omfång
faktor = 3
tredubbel = x -> x * faktor
>> tredubbel(7) ¶    // → 21

// Fabrik
skapa_adderare(n) { <~ x -> x + n }
lägg10_till = skapa_adderare(10)
>> lägg10_till(5) ¶    // → 15

// I listor
operationer = [x -> x+1, x -> x*2, x -> x*x]
>> operationer[3](5) ¶    // → 25
```

---

## Listor

Listor är **muterbara** och innehåller element av **samma typ**.

```zymbol
lista = [1, 2, 3, 4, 5]

x = lista[1]      // 1 — åtkomst (1-baserat: första element)
x = lista[-1]     // 5 — negativt index (sista element)
x = lista$#       // 5 — längd (använd (lista$#) i >>)

lista = lista$+ 6            // lägg till → [1,2,3,4,5,6]
lista2 = lista$+[2] 99       // infoga vid position 2 (1-baserat)
lista3 = lista$- 3           // ta bort första förekomst av värde
lista4 = lista$-- 3          // ta bort alla förekomster
lista5 = lista$-[1]          // ta bort vid index 1 (första element)
lista6 = lista$-[2..3]       // ta bort intervall (1-baserat, slut inklusivt)

har = lista$? 3              // #1 — innehåller
pos = lista$?? 3             // [3] — alla index för värde (1-baserat)
skiva = lista$[1..3]         // [1,2,3] — skiva (1-baserat, slut inklusivt)
skiva2 = lista$[1:3]         // [1,2,3] — samma, antalsbaserad syntax

stigande = lista$^+          // sorterat stigande  (bara primitiver)
fallande = lista$^-          // sorterat fallande  (bara primitiver)

// Namngivna/positionsbaserade tupellistor — använd $^ med jämförelselambda
db = [(namn: "Carla", ålder: 28), (namn: "Ana", ålder: 25), (namn: "Bob", ålder: 30)]
efter_ålder = db$^ (a, b -> a.ålder < b.ålder)    // stigande efter ålder  (<)
efter_namn  = db$^ (a, b -> a.namn > b.namn)       // fallande efter namn (>)
>> efter_ålder[1].namn ¶     // → Ana
>> efter_namn[1].namn ¶      // → Carla

// Direkt elementuppdatering (bara listor)
lista[1] = 99              // tilldela
lista[2] += 5              // sammansatt: +=  -=  *=  /=  %=  ^=

// Funktionell uppdatering — returnerar ny lista; originalet oförändrat
lista2 = lista[2]$~ 99
```

> Alla samlingsoperatorer returnerar en **ny lista**. Tilldela tillbaka: `lista = lista$+ 4`.
> `$+` kan kedjas: `lista = lista$+ 5$+ 6$+ 7`. Andra operatorer använder mellanliggande tilldelningar.
> **Indexering är 1-baserat**: `lista[1]` är det första elementet; `lista[0]` är ett körningsfel.
> `$^+` / `$^-` sorterar **primitiva listor** (tal, text). För tupellistor använd `$^` med jämförelselambda — riktning är kodad i lambda (`<` = stigande, `>` = fallande).

**Värdesemantik** — att tilldela en lista till en annan variabel skapar en oberoende kopia:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b är opåverkat
```

```zymbol
// Nästlade listor (1-baserad indexering)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (rad 2, kolumn 3)
```

---

## Destrukturering

```zymbol
// Lista
lista = [10, 20, 30, 40, 50]
[a, b, c] = lista              // a=10  b=20  c=30
[första, *rest] = lista        // första=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ kasserar

// Positionsbaserad tupel
punkt = (100, 200)
(px, py) = punkt               // px=100  py=200

// Namngiven tupel
person = (namn: "Ana", ålder: 25, stad: "Madrid")
(namn: n, ålder: å) = person   // n="Ana"  å=25
```

---

## Tuplar

Tuplar är **oföränderliga** ordnade behållare som kan innehålla värden av **olika typer**.
Till skillnad från listor kan element inte ändras efter skapande.

```zymbol
// Positionsbaserad — blandade typer tillåtna
punkt = (10, 20)
>> punkt[1] ¶    // → 10

data = (42, "hej", #1, 3.14)
>> data[3] ¶     // → #1

// Namngiven
person = (namn: "Alice", ålder: 25)
>> person.namn ¶    // → Alice
>> person[1] ¶      // → Alice  (index fungerar också, 1-baserat)

// Nästlad
pos = (x: 10, y: 20)
p = (pos: pos, etikett: "ursprung")
>> p.pos.x ¶        // → 10
```

**Oföränderlighet** — varje försök att modifiera ett tupelelement är ett körningsfel:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ körningsfel: tuplar är oföränderliga
// t[1] += 5    // ❌ samma fel
```

För att härleda ett modifierat värde använd `$~` (funktionell uppdatering) — returnerar en **ny** tupel:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalet oförändrat
>> t2 ¶    // → (10, 999, 30)

// Namngiven tupel — bygg om explicit
person = (namn: "Alice", ålder: 25)
äldre  = (namn: person.namn, ålder: 26)
>> person.ålder ¶    // → 25
>> äldre.ålder ¶     // → 26
```

---

## Högre Ordningens Funktioner

```zymbol
tal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dubblerat = tal$> (x -> x * 2)                // map  → [2,4,6…20]
jämna     = tal$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totalt    = tal$< (0, (acc, x) -> acc + x)     // reduce → 55

// Kedja via mellansteg
steg1 = tal$| (x -> x > 3)
steg2 = steg1$> (x -> x * x)
>> steg2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Namngivna funktioner kan skickas direkt till HOF
dubbel(x) { <~ x * 2 }
är_stor(x) { <~ x > 5 }
r = tal$> dubbel      // ✅ direkt referens
r = tal$| är_stor     // ✅ direkt referens
```

---

## Pipe-operator

Höger sida kräver alltid `_` som platshållare för det piped värdet:

```zymbol
dubbel = x -> x * 2
lägg_till = (a, b) -> a + b
öka = x -> x + 1

r1 = 5 |> dubbel(_)           // → 10
r2 = 10 |> lägg_till(_, 5)    // → 15
r3 = 5 |> lägg_till(2, _)     // → 7

// Kedjat
r = 5 |> dubbel(_) |> öka(_) |> dubbel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Felhantering

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division med noll" ¶
} :! {
    >> "annat fel: " _err ¶    // _err innehåller felmeddelandet
} :> {
    >> "körs alltid" ¶
}
```

| Typ | När |
|-----|-----|
| `##Div` | Division med noll |
| `##IO` | Fil / system |
| `##Index` | Index utanför gränser |
| `##Type` | Typmismatch |
| `##Parse` | Dataparsing |
| `##Network` | Nätverksfel |
| `##_` | Vilket fel som helst (fånga-allt) |

---

## Moduler

```zymbol
// lib/kalkyl.zy — modulkroppen är innesluten i hängslen
# kalkyl {
    #> { lägg_till, get_PI }

    _PI := 3.14159
    lägg_till(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/kalkyl => k    // alias krävs

>> k::lägg_till(5, 3) ¶     // → 8
pi = k::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportera med ett annat offentligt namn
# mittbibliotek {
    #> { _intern_lägg_till => summa }

    _intern_lägg_till(a, b) { <~ a + b }
}
```

```zymbol
<# ./mittbibliotek => m

>> m::summa(3, 4) ¶    // → 7  (det interna namnet _intern_lägg_till är dolt)
```

> **Modulregler**: bara `#>`, funktionsdefinitioner och bokstavliga variabel-/konstantinitialiserare är tillåtna i `# namn { }`. Körbara satser (`>>`, `<<`, slingor, etc.) ger fel E013.

---

## Numeriska Lägen

Zymbol kan visa tal i **69 Unicode-sifferskrifter** — Devanagari, arabisk-indisk, thai, Klingon pIqaD, matematisk fet, LCD-segment och mer. Det aktiva läget påverkar bara `>>`-utdata; intern aritmetik är alltid binär.

### Aktivera en skrift

Skriv `0`- och `9`-siffret för målskriften omgivet av `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisk-indisk (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // återställ till ASCII
```

### Utdata och booleskt

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimalkomma alltid ASCII)
>> 1 + 2 ¶      // → ३

// Booleskt: #-prefix alltid ASCII, siffra anpassar sig
>> #1 ¶         // → #१   (sant i Devanagari)
>> #0 ¶         // → #०   (falskt — skilt från ०  heltalsnoll)

x = 28 > 4
>> x ¶          // → #१   (jämförelseresultat följer aktivt läge)
```

### Inbyggda sifferliteraler i källkod

Siffror från vilket stödd skrift som helst är giltiga literaler — i intervall, modulo, jämförelser:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booleska literaler i valfri skrift

`#` + siffra `0` eller `1` från vilket block som helst är en giltig boolesk literal:

```zymbol
#٠٩#
aktiv = #١        // samma som #1
>> aktiv ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` är **alltid ASCII**. `#0` (falskt) är alltid visuellt skilt från `0` (heltalsnoll) i valfri skrift.

---

## Dataoperatorer

```zymbol
// Typkonverteringscast
f = ##.42         // → 42.0  (till Decimaltal)
i = ###3.7        // → 4     (till Heltal, avrunda)
t = ##!3.7        // → 3     (till Heltal, trunkera)

// Parsa text till tal
v1 = #|"42"|      // → 42  (Heltal)
v2 = #|"3.14"|    // → 3.14  (Decimaltal)
v3 = #|"abc"|     // → "abc"  (felsäker, inget fel)

// Avrundning / trunkering
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (avrunda till 2 decimaler)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunkera)

// Talformatering
fmt = #,|1234567|  // → 1,234,567  (kommaseparerat)
sci = #^|12345.678|    // → 1.2345678e4  (vetenskapligt)

// Basliteraler
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binärt)
c = 0o101        // → 'A'  (oktalt)

// Baskonverteringsutdata
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integration

```zymbol
datum = <\ date +%Y-%m-%d \>     // fångar stdout (inkluderar avslutande \n)
>> "Idag: " datum

fil = "data.txt"
innehåll = <\ cat {fil} \>       // interpolation i kommandon

utdata = </"./subscript.zy"/>    // kör ett annat Zymbol-skript, fånga utdata
>> utdata
```

> `><` fångar CLI-argument som en text-lista (bara trädgenomgång).

---

## Komplett Exempel: FizzBuzz

```zymbol
klassificera(tal) {
    ? tal % 15 == 0 { <~ "FizzBuzz" }
    _? tal % 3  == 0 { <~ "Fizz" }
    _? tal % 5  == 0 { <~ "Buzz" }
    _ { <~ tal }
}

@ i:1..20 { >> klassificera(i) ¶ }
```

---

## Symbolreferens

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | variabel | `$#` | längd |
| `:=` | konstant | `$+` | lägg till (kedjningsbar) |
| `>>` | utdata | `$+[i]` | infoga vid index (1-baserat) |
| `<<` | indata | `$-` | ta bort första efter värde |
| `¶` / `\\` | ny rad | `$--` | ta bort alla efter värde |
| `?` | om | `$-[i]` | ta bort vid index (1-baserat) |
| `_?` | annars-om | `$-[i..j]` | ta bort intervall (1-baserat) |
| `_` | annars / wildcard | `$?` | innehåller |
| `??` | matchning | `$??` | hitta alla index (1-baserat) |
| `@` | slinga | `$[s..e]` | skiva (1-baserat) |
| `@ N { }` | N-gångers-slinga | `$>` | map |
| `@!` | bryt | `$\|` | filter |
| `@>` | fortsätt | `$<` | reduce |
| `@:namn { }` | märkt slinga | `$/ delim` | textdelning |
| `@:namn!` | bryt märke | `$++ a b c` | sammansättningsbygge |
| `@:namn>` | fortsätt märke | `lista[i>j>k]` | navigationsindex |
| `->` | lambda | `lista[i] = val` | uppdatera element (bara listor) |
| `lista[i] += val` | sammansatt uppdatering | `lista[i]$~` | funktionell uppdatering (ny kopia) |
| `$^+` | sortera stigande (primitiver) | `$^-` | sortera fallande (primitiver) |
| `$^` | sortera med jämförare (tuplar) | `<~` | returnera |
| `\|>` | pipe | `!?` | försök |
| `:!` | fånga | `:>` | slutligen |
| `#1` | sant | `#0` | falskt |
| `$!` | är fel | `$!!` | sprid fel |
| `<#` | importera | `#>` | exportera |
| `#` | deklarera modul | `::` | modulanrop |
| `.` | fältåtkomst | `#?` | typmetadata |
| `#\|..\|` | parsa tal | `##.` | cast till Decimaltal |
| `###` | cast till Heltal (avrunda) | `##!` | cast till Heltal (trunkera) |
| `#.N\|..\|` | avrunda | `#!N\|..\|` | trunkera |
| `#,\|..\|` | kommaformat | `#^\|..\|` | vetenskapligt |
| `#d0d9#` | numerärt lägesbyte | `#09#` | återställ till ASCII |
| `<\ ..\>` | shell-körning | `>\<` | CLI-argument |
| `\ var` | förstör variabel explicit | `°x` / `x°` | varm definition (auto-init) |
| `>>|` | TUI-block (alternativ skärm) | `>>~` | positionsbaserad utdata |
| `>>!` | rensa skärm | `>>?` | fråga om skärmstorlek |
| `<<\|` | blockerande knapptryckning | `<<\|?` | icke-blockerande knapptryckning |
| `@~ N` | sov N millisekunder | `$*` | upprepa text N gånger |

---

## Versions-Changelog

### v0.0.5 — TUI-primitiver, Varm Definition & Textupprepning _(Maj 2026)_

- **Brytande** Match-arm-avgränsare: `mönster : resultat` → `mönster => resultat`
- **Brytande** Import-alias: `<# stig <= alias` → `<# stig => alias`
- **Brytande** Export-omdöpning: `#> { fn <= pub }` → `#> { fn => pub }`
- **Tillagd** TUI-block `>>| { }` — alternativ skärm + råläge; städar upp vid avslutning
- **Tillagd** Positionsbaserad utdata `>>~ (rad, kol, BKS, fg, bg) > element` — glesa spår, ANSI 256-färger
- **Tillagd** Tangentindata `<<| var` (blockerande) och `<<|? var` (icke-blockerande poll)
- **Tillagd** `>>!` rensa skärm, `>>?` fråga om skärmstorlek, `@~ N` sov N millisekunder
- **Tillagd** Varm definition `°x` / `x°` — auto-initialisera variabel vid första användning i slingor
- **Tillagd** Textupprepning `str $* N` — upprepa en text N gånger
- **VM** Paritet: 436/436 tester godkända

### v0.0.4 — 1-Baserad Indexering, Förstaklassfunktioner & Modulblock _(April 2026)_

- **Brytande** All indexering bytt till **1-baserat** — `lista[1]` är det första elementet; `lista[0]` är ett körningsfel
- **Tillagd** Namngivna funktioner är **förstaklassvärden** — skicka direkt till HOF: `tal$> dubbel`
- **Tillagd** Modul-**blocksyntax** krävs: `# namn { ... }` — platt syntax borttagen
- **Tillagd** Flerdimensionell indexering: `lista[i>j>k]` (navigering), `lista[p ; q]` (platt extraktion)
- **Tillagd** Typkonverteringscast: `##.expr` (Decimaltal), `###expr` (Heltal avrunda), `##!expr` (Heltal trunkera)
- **Tillagd** Textdelning: `str$/ delim` — returnerar `Lista(Text)`
- **Tillagd** Sammansättningsbygge: `bas$++ a b c` — lägger till flera element
- **Tillagd** N-gångers-slinga: `@ N { }` — upprepa exakt N gånger
- **Tillagd** Märkt slingsyntax: `@:namn { }`, `@:namn!`, `@:namn>` — ersätter `@ @namn` / `@! namn`
- **Tillagd** Variabelomfångsregler: `_namn`-variabler har exakt blockomfång; `\ var` förstör tidigt
- **Tillagd** Match-jämförelsemönster: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Tillagd** Modul E013-fel: körbara satser i modulkropp är förbjudna
- **Fixad** `take_variable` korrumperar inte längre modulkonstanter vid återskrivning
- **Fixad** `alias.CONST` löses nu korrekt; `#>` kan visas efter funktionsdefinitioner
- **VM** Full paritet: 393/393 tester godkända

### v0.0.3 — Unicode Numeriska System & LSP-förbättringar _(April 2026)_

- **Tillagd** 69 Unicode-sifferblock med lägesbytes-token `#d0d9#`
- **Tillagd** Booleska literaler i valfri skrift — `#१` / `#०`, `#١` / `#٠`, etc.
- **Tillagd** Klingon pIqaD-siffror (CSUR PUA U+F8F0–U+F8F9)
- **Tillagd** `SetNumeralMode` VM-opkod — full paritet med trädgenomgång
- **Tillagd** REPL respekterar aktivt numeriskt läge i eko och variabelvisning
- **Ändrad** Boolesk `>>`-utdata inkluderar nu `#`-prefix (`#0` / `#1`) i alla lägen

### v0.0.2_01 — Operatöromdöpning _(30 Mar 2026)_

- **Ändrad** `c|..|` → `#,|..|` och `e|..|` → `#^|..|` — konsekvent med `#`-formatprefix-familj
- **Tillagd** Exportalias: re-exportera modulmedlemmar under ett annat namn

### v0.0.2 — Samlings-API-omdesign & Installationsprogram _(24 Mar 2026)_

- **Tillagd** Enhetlig `$`-operatorfamilj för listor och text (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Tillagd** Destruktureringstilldelning för listor, tuplar och namngivna tuplar
- **Tillagd** Negativa index (`lista[-1]` = sista element)
- **Tillagd** Inbyggda installationsprogram — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Tillagd** Sammansatt tilldelning `^=`
- **Fixad** Parser-aritmetiska kantfall; dokumentationskorrigeringar

### v0.0.1 — Första Offentliga Utgåva _(22 Mar 2026)_

- Trädgenomgångstolk + register-VM (`--vm`, ~4× snabbare, ~95% paritet)
- Alla kärnkonstruktioner: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fullständiga Unicode-identifierare, modulsystem, lambdas, stängningar, felhantering
- REPL, LSP, VS Code-tillägg, formatering (`zymbol fmt`)

---

_Zymbol-Lang — Symboliskt. Universellt. Oföränderligt._
