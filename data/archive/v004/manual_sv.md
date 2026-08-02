> **Ansvarsfriskrivning:** Denna dokumentation skapades och översattes av artificiell intelligens (AI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> Den kanoniska referensen är **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** i tolkningsförrådet.

---

# Zymbol-Lang Handbok

**Zymbol-Lang** är ett symboliskt programmeringsspråk. Inga nyckelord — allt är en symbol. Fungerar identiskt på alla mänskliga språk.

- Inga `if`, `while`, `return` — bara `?`, `@`, `<~`
- Full Unicode — identifierare på valfritt språk eller emoji
- Mänskligt-språklig agnostisk — koden är densamma överallt

**Tolkningsversion**: v0.0.4 | **Testtäckning**: 393/393 (TW ↔ VM paritet)

---

## Variabler och konstanter

```zymbol
x = 10              // muterbar variabel
PI := 3.14159       // konstant — omtilldelning är ett körtidsfel
namn = "Alice"
aktiv = #1         // booleskt sant
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

| Typ | Literal | `#?`-tagg | Notering |
|-----|---------|-----------|----------|
| Heltal | `42`, `-7` | `###` | 64-bitars tecknad |
| Flyttal | `3.14`, `1.5e10` | `##.` | Vetenskaplig notation OK |
| Sträng | `"text"` | `##"` | Interpolation: `"Hej {namn}"` |
| Tecken | `'A'` | `##'` | Enskilt Unicode-tecken |
| Booleskt | `#1`, `#0` | `##?` | INTE numerisk — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Homogena element |
| Tupel | `(a, b)` | `##)` | Positionell |
| Namngiven tupel | `(x: 1, y: 2)` | `##)` | Namngivna fält |
| Funktion | namngiven funktionsreferens | `##()` | Förstklassig; visar `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Förstklassig; visar `<lambd/N>` |

```zymbol
// Typintrospection — returnerar (typ, siffror, värde)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Utdata och indata

```zymbol
>> "Hej" ¶                      // ¶ eller \\ för explicit radbrytning
>> "a=" a " b=" b ¶               // juxtaposition — flera värden
>> (arr$#) ¶                      // postfixoperatorer kräver ( ) i >>

<< namn                           // läs in i variabel (ingen prompt)
<< "Ange namn: " namn            // med prompt
```

> `¶` (AltGr+R på spanskt tangentbord) och `\\` är likvärdiga radbrytningar.

---

## Operatorer

```zymbol
// Aritmetik — använd tilldelning; några operatorer kan vara knepiga direkt i >>
a = 10
b = 3
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (heltalsdivision)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (exponentiering)

// Jämförelse
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b     // #1

// Logiskt
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Strängar

```zymbol
// Två konkatenationsformer
namn = "Alice"
n = 42

>> "Hej " namn " du har " n ¶    // juxtaposition — i >>
desc = "Hej {namn}, du har {n}"  // interpolation — var som helst
```

```zymbol
s = "Hej Världen"
len = s$#                  // 11
sub = s$[1..3]             // "Hej"  (1-baserat, slutet inkluderat)
has = s$? "Världen"       // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]  (dela med avgränsare)
rep = s$~~["e":"E"]        // "HEj VärldEn"
rep1 = s$~~["e":"E":1]     // "HEj Världen"  (bara första N)
```

> `+` är bara för tal. Använd `,`, juxtaposition eller interpolation för strängar.

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

> `{ }` klamrar är **obligatoriska** även för en enstaka sats.

---

## Matchning

```zymbol
// Intervall
poäng = 85
betyg = ?? poäng {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> betyg ¶    // → B

// Strängar
färg = "röd"
kod = ?? färg {
    "röd"   : "#FF0000"
    "grön"  : "#00FF00"
    _       : "#000000"
}

// Jämförelsemönster
temp = -5
tillstånd = ?? temp {
    < 0  : "is"
    < 20 : "kall"
    < 35 : "varm"
    _    : "het"
}
>> tillstånd ¶    // → is

// Satsform (block-armar)
?? n {
    0       : { >> "noll" ¶ }
    _? n < 0: { >> "negativ" ¶ }
    _       : { >> "positiv" ¶ }
}
```

---

## Slingor

```zymbol
@ i:0..4  { >> i " " }        // inklusivt intervall:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // med steg:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omvänd ordning:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frukter = ["äpple", "päron", "druva"]
@ f:frukter { >> f ¶ }         // för varje element i array

@ t:"hej" { >> t "-" }
>> ¶                          // → h-e-j-  (för varje tecken i sträng)

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

// Märkt slinga (nästlad bryt)
antal = 0
@:yttre {
    antal++
    ? antal >= 3 { @:yttre! }
}
>> antal ¶                    // → 3
```

---

## Funktioner

```zymbol
addera(a, b) { <~ a + b }
>> addera(3, 4) ¶    // → 7

fakultet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultet(n - 1)
}
>> fakultet(5) ¶    // → 120
```

Funktioner har **isolerat scope** — de kan inte läsa yttre variabler. Använd utdataparametrar `<~` för att ändra anroparens variabler:

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

> Namngivna funktioner är **förstklassiga värden** — skicka direkt: `num$> dubbel`. För att omsluta: `x -> fn(x)` är också giltigt.

---

## Lambdas och slutvärden

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

// Slutvärde — fångar yttre scope
faktor = 3
tredubbla = x -> x * faktor
>> tredubbla(7) ¶    // → 21

// Fabrik
gör_adderare(n) { <~ x -> x + n }
addera10 = gör_adderare(10)
>> addera10(5) ¶    // → 15

// I arrayer
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Arrayer

Arrayer är **muterbara** och håller element av **samma typ**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — åtkomst (1-indexerat: första elementet)
arr[-1]         // 5 — negativt index (sista elementet)
arr$#           // 5 — längd (använd (arr$#) i >>)

arr = arr$+ 6            // lägg till → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // infoga vid position 2 (1-baserat)
arr3 = arr$- 3           // ta bort första förekomst av värde
arr4 = arr$-- 3          // ta bort alla förekomster
arr5 = arr$-[1]          // ta bort vid index 1 (första elementet)
arr6 = arr$-[2..3]       // ta bort intervall (1-baserat, slutet inkluderat)

has = arr$? 3            // #1 — innehåller
pos = arr$?? 3           // [3] — alla index för värdet (1-baserat)
sl = arr$[1..3]          // [1,2,3] — utsnitt (1-baserat, slutet inkluderat)
sl2 = arr$[1:3]          // [1,2,3] — samma, antalsbaserad syntax

asc = arr$^+             // sorterat stigande  (bara primitiver)
desc = arr$^-            // sorterat fallande (bara primitiver)

// Namngivna/positionella tupel-arrayer — använd $^ med jämförelselambda
db = [(namn: "Carla", ålder: 28), (namn: "Ana", ålder: 25), (namn: "Bob", ålder: 30)]
efter_ålder  = db$^ (a, b -> a.ålder < b.ålder)    // stigande efter ålder  (<)
efter_namn = db$^ (a, b -> a.namn > b.namn)  // fallande efter namn (>)
>> efter_ålder[1].namn ¶     // → Ana
>> efter_namn[1].namn ¶    // → Carla

// Direkt elementuppdatering (bara arrayer)
arr[1] = 99              // tilldela
arr[2] += 5              // sammansatt: +=  -=  *=  /=  %=  ^=

// Funktionell uppdatering — returnerar ny array; originalet oförändrat
arr2 = arr[2]$~ 99
```

> Alla samlingsoperatorer returnerar en **ny array**. Tilldela tillbaka: `arr = arr$+ 4`.
> `$+` kan kedjas: `arr = arr$+ 5$+ 6$+ 7`. Andra operatorer använder mellanliggande tilldelningar.
> **Indexering är 1-baserad**: `arr[1]` är det första elementet; `arr[0]` är ett körtidsfel.
> `$^+` / `$^-` sorterar **primitiva arrayer** (tal, strängar). För tupel-arrayer använd `$^` med jämförelselambda — riktningen kodas i lambdan (`<` = stigande, `>` = fallande).

**Värdessemantik** — att tilldela en array till en annan variabel skapar en oberoende kopia:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b påverkas inte
```

```zymbol
// Nästlade arrayer (1-baserat index)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (rad 2, kolumn 3)
```

---

## Destrukturering

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[första, *rest] = arr         // första=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ kasserar

// Positionell tupel
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Namngiven tupel
person = (namn: "Ana", ålder: 25, stad: "Madrid")
(namn: n, ålder: a) = person   // n="Ana"  a=25
```

---

## Tuplar

Tuplar är **oföränderliga** ordnade behållare som kan hålla värden av **olika typer**.
Till skillnad från arrayer kan element inte ändras efter skapandet.

```zymbol
// Positionell — blandade typer tillåtna
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
p = (pos: pos, etikett: "origo")
>> p.pos.x ¶        // → 10
```

**Oföränderlighet** — varje försök att ändra ett tupelelement är ett körtidsfel:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ körtidsfel: tuplar är oföränderliga
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

## Högre ordningens funktioner

```zymbol
num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dubblade  = num$> (x -> x * 2)                // map  → [2,4,6…20]
jämna    = num$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = num$< (0, (acc, x) -> acc + x)     // reduce → 55

// Kedja via mellanting
steg1 = num$| (x -> x > 3)
steg2 = steg1$> (x -> x * x)
>> steg2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Namngivna funktioner kan skickas direkt till HOF
dubbel(x) { <~ x * 2 }
är_stor(x) { <~ x > 5 }
r = num$> dubbel       // ✅ direkt referens
r = num$| är_stor       // ✅ direkt referens
```

---

## Röroperatör

Höger sidan kräver alltid `_` som platshållare för det rörda värdet:

```zymbol
dubbel = x -> x * 2
addera = (a, b) -> a + b
öka = x -> x + 1

5 |> dubbel(_)        // → 10
10 |> addera(_, 5)       // → 15
5 |> addera(2, _)        // → 7

// Kedja
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
    >> "övrigt: " _err ¶    // _err håller felmeddelandet
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
| `##Parse` | Datatolkning |
| `##Network` | Nätverksfel |
| `##_` | Valfritt fel (uppsamlare) |

---

## Moduler

```zymbol
// lib/räkna.zy — modulens kropp omges av klamrar
# räkna {
    #> { addera, hämta_PI }

    _PI := 3.14159
    addera(a, b) { <~ a + b }
    hämta_PI() { <~ _PI }
}
```

```zymbol
// huvud.zy
<# ./lib/räkna <= r    // alias krävs

>> r::addera(5, 3) ¶     // → 8
pi = r::hämta_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportera med ett annat publikt namn
# mittlib {
    #> { _intern_addera <= lägg_till }

    _intern_addera(a, b) { <~ a + b }
}
```

```zymbol
<# ./mittlib <= m

>> m::lägg_till(3, 4) ¶    // → 7  (interna namnet _intern_addera är dolt)
```

> **Modulregler**: bara `#>`, funktionsdefinitioner och literal variabel-/konstantinitierare är tillåtna inuti `# namn { }`. Körbara satser (`>>`, `<<`, slingor osv.) utlöser fel E013.

---

## Sifferlägen

Zymbol kan visa tal i **69 Unicode-sifferskript** — Devanagari, Arabisk-Indisk, Thailändsk, Klingon pIqaD, Matematisk Fetstil, LCD-segment med mera. Det aktiva läget påverkar bara `>>`-utdata; intern aritmetik är alltid binär.

### Aktivera ett skript

Skriv siffran `0` och `9` för målskriptet omgiven av `#…#`:

```zymbol
#०९#    // Devanagari      (U+0966–U+096F)
#٠٩#    // Arabisk-Indisk  (U+0660–U+0669)
#๐๙#    // Thailändsk      (U+0E50–U+0E59)
#09#    // återställ till ASCII
```

### Utdata och booleska

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimaltecknet alltid ASCII)
>> 1 + 2 ¶      // → ३

// Booleska: # prefix alltid ASCII, siffran anpassas
>> #1 ¶         // → #१   (sant  i Devanagari)
>> #0 ¶         // → #०   (falskt — skiljer sig från ०  heltalsnoll)

x = 28 > 4
>> x ¶          // → #१   (jämförelseresultat följer aktivt läge)
```

### Inbyggda sifferliteraler i källkod

Alla stödda skripters siffror är giltiga literaler — i intervall, modulo, jämförelser:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booleska literaler i valfritt skript

`#` + siffran `0` eller `1` från valfritt block är ett giltigt booleskt literal:

```zymbol
#٠٩#
aktiv = #١        // samma som #1
>> aktiv ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` är **alltid ASCII**. `#0` (falskt) är alltid visuellt skilt från `0` (heltalsnoll) i varje skript.

---

## Dataoperatorer

```zymbol
// Typkonverteringscast
##.42         // → 42.0  (till Flyttal)
###3.7        // → 4     (till Heltal, avrundning)
##!3.7        // → 3     (till Heltal, trunkering)

// Tolka sträng till nummer
v1 = #|"42"|      // → 42  (Heltal)
v2 = #|"3.14"|    // → 3.14  (Flyttal)
v3 = #|"abc"|     // → "abc"  (felsäker, inget fel)

// Avrundning / trunkering
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (avrunda till 2 decimaler)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunkera)

// Talformatering
fmt = #,|1234567|  // → 1,234,567  (kommaseparerad)
sci = #^|12345.678|    // → 1.2345678e4  (vetenskaplig)

// Bas-literaler
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binär)
c = 0o101        // → 'A'  (oktal)

// Baskonverteringsutdata
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Skalintegration

```zymbol
datum = <\ date +%Y-%m-%d \>     // fångar stdout (inkluderar avslutande \n)
>> "Idag: " datum

fil = "data.txt"
innehåll = <\ cat {fil} \>      // interpolation i kommandon

utdata = </"./delskript.zy"/>   // kör ett annat Zymbol-skript, fånga utdata
>> utdata
```

> `><` fångar CLI-argument som en strängsarray (bara trädvandring).

---

## Fullständigt exempel: FizzBuzz

```zymbol
klassificera(nummer) {
    ? nummer % 15 == 0 { <~ "FizzBuzz" }
    _? nummer % 3  == 0 { <~ "Fizz" }
    _? nummer % 5  == 0 { <~ "Buzz" }
    _ { <~ nummer }
}

@ i:1..20 { >> klassificera(i) ¶ }
```

---

## Symbolreferens

| Symbol | Operation | Symbol | Operation |
|--------|-----------|--------|-----------|
| `=` | variabel | `$#` | längd |
| `:=` | konstant | `$+` | lägg till (kedjebart) |
| `>>` | utdata | `$+[i]` | infoga vid index (1-baserat) |
| `<<` | indata | `$-` | ta bort första av värde |
| `¶` / `\\` | radbrytning | `$--` | ta bort alla av värde |
| `?` | om | `$-[i]` | ta bort vid index (1-baserat) |
| `_?` | annars-om | `$-[i..j]` | ta bort intervall (1-baserat) |
| `_` | annars / jokertecken | `$?` | innehåller |
| `??` | matchning | `$??` | hitta alla index (1-baserat) |
| `@` | slinga | `$[s..e]` | utsnitt (1-baserat) |
| `@ N { }` | gångersslinga (N iterationer) | `$>` | map |
| `@!` | bryt | `$\|` | filter |
| `@>` | fortsätt | `$<` | reduce |
| `@:namn { }` | märkt slinga | `$/ delim` | strängdelning |
| `@:namn!` | bryt märkt | `$++ a b c` | konkatenationsbygge |
| `@:namn>` | fortsätt märkt | `arr[i>j>k]` | navigationsindex |
| `->` | lambda | `arr[i] = val` | uppdatera element (bara arrayer) |
| `arr[i] += val` | sammansatt uppdatering | `arr[i]$~` | funktionell uppdatering (ny kopia) |
| `$^+` | sortera stigande (primitiver) | `$^-` | sortera fallande (primitiver) |
| `$^` | sortera med jämförelseoperator (tuplar) | `<~` | returnera |
| `\|>` | rör | `!?` | försök |
| `:!` | fånga | `:>` | slutligen |
| `#1` | sant | `#0` | falskt |
| `$!` | är fel | `$!!` | sprid fel |
| `<#` | importera | `#>` | exportera |
| `#` | deklarera modul | `::` | modulanrop |
| `.` | fältåtkomst | `#?` | typmetadata |
| `#\|..\|` | tolka nummer | `##.` | cast till Flyttal |
| `###` | cast till Heltal (avrundning) | `##!` | cast till Heltal (trunkering) |
| `#.N\|..\|` | avrunda | `#!N\|..\|` | trunkera |
| `#,\|..\|` | kommaformat | `#^\|..\|` | vetenskaplig |
| `#d0d9#` | sifferlägesbrytare | `#09#` | återställ till ASCII |
| `<\ ..\>` | skalexekvering | `>\<` | CLI-argument |
| `\ var` | förstör variabel explicit | | |

---

## Versionslogg

### v0.0.4 — 1-Baserad Indexering, Förstklassiga Funktioner och Modulblock _(April 2026)_

- **Brytande** All indexering ändrad till **1-baserad** — `arr[1]` är det första elementet; `arr[0]` är ett körtidsfel
- **Lagt till** Namngivna funktioner är **förstklassiga värden** — skicka direkt till HOF: `num$> dubbel`
- **Lagt till** Modul **blocksyntax** krävs: `# namn { ... }` — platt syntax borttagen
- **Lagt till** Flerdimensionell indexering: `arr[i>j>k]` (navigering), `arr[p ; q]` (platt extraktion)
- **Lagt till** Typkonverteringscast: `##.expr` (Flyttal), `###expr` (Heltal avrundning), `##!expr` (Heltal trunkering)
- **Lagt till** Strängdelning: `str$/ delim` — returnerar `Array(Sträng)`
- **Lagt till** Konkatenationsbygge: `bas$++ a b c` — lägger till flera element
- **Lagt till** Gångersslinga: `@ N { }` — upprepa exakt N gånger
- **Lagt till** Märkt slingasyntax: `@:namn { }`, `@:namn!`, `@:namn>` — ersätter `@ @namn` / `@! namn`
- **Lagt till** Variabelscoperegler: `_namn`-variabler har exakt blockscope; `\ var` förstör tidigt
- **Lagt till** Matchningsjämförelsemönster: `< 0 :`, `> 5 :`, `== 42 :` osv.
- **Lagt till** Modul E013-fel: körbara satser i modulkropp är förbjudna
- **Fixat** `take_variable` korrumperar inte längre modulkonstanter vid tillskrivning
- **Fixat** `alias.CONST` löser nu korrekt; `#>` kan förekomma efter funktionsdefinitioner
- **VM** Full paritet: 393/393 tester klarar

### v0.0.3 — Unicode-siffersystem och LSP-förbättringar _(April 2026)_

- **Lagt till** 69 Unicode-siffrablock med lägesbrytningstoken `#d0d9#`
- **Lagt till** Booleska literaler i valfritt skript — `#१` / `#०`, `#١` / `#٠` osv.
- **Lagt till** Klingon pIqaD-siffror (CSUR PUA U+F8F0–U+F8F9)
- **Lagt till** `SetNumeralMode` VM-opkod — full paritet med trädvandring
- **Ändrat** REPL respekterar aktivt sifferläge i eko och variabelvisning
- **Ändrat** Boolesk `>>`-utdata inkluderar nu `#`-prefix (`#0` / `#1`) i alla lägen

### v0.0.2_01 — Operatorbyte _(30 Mar 2026)_

- **Ändrat** `c|..|` → `#,|..|` och `e|..|` → `#^|..|` — konsekvent med `#` formatprefixfamiljen
- **Lagt till** Exportalias: re-exportera modulmedlemmar under ett annat namn

### v0.0.2 — Samlingsomdesign och installatörer _(24 Mar 2026)_

- **Lagt till** Enhetlig `$`-operatörsfamilj för arrayer och strängar (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lagt till** Destruktureringstilldelning för arrayer, tuplar och namngivna tuplar
- **Lagt till** Negativa index (`arr[-1]` = sista elementet)
- **Lagt till** Inbyggda installatörer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Lagt till** Sammansatt tilldelning `^=`
- **Fixat** Tolkaren aritmetiska kantfall; dokumentationskorrigeringar

### v0.0.1 — Initial publik utgåva _(22 Mar 2026)_

- Trädvandringstolk + registerVM (`--vm`, ~4× snabbare, ~95% paritet)
- Alla kärnkonstruktioner: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Full Unicode-identifierare, modulsystem, lambdas, slutvärden, felhantering
- REPL, LSP, VS Code-tillägg, formaterare (`zymbol fmt`)

---

_Zymbol-Lang — Symbolisk. Universell. Oföränderlig._
