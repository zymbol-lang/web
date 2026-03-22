# Kompakt Zymbol-Lang-dokumentation

**Zymbol-Lang** är ett symboliskt programmeringsspråk. Det använder inga nyckelord — allt är symboler. Det fungerar likadant på alla mänskliga språk.

---

## Filosofi

- Inga nyckelord (`if`, `while`, `return` finns inte — bara symboler `?`, `@`, `<~`)
- Full Unicode — identifierare på vilket språk eller emoji som helst 👋
- Språkoberoende — koden är identisk på alla språk

---

## Variabler och Konstanter

```zymbol
x = 10          // variabel (muterbar)
PI := 3.14159   // konstant (oföränderlig — fel vid omtilldelning)
namn = "Ana"
aktiv = #1      // booleskt sant
👋 := "Hej"
```

### Sammansatt Tilldelning

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

## Datatyper

| Typ            | Exempel             | Symbol `#?` | Anteckningar                          |
|----------------|---------------------|-------------|---------------------------------------|
| Heltal         | `42`, `-7`          | `###`       | 64-bitars med tecken                  |
| Flyttal        | `3.14`, `1.5e10`    | `##.`       | Vetenskaplig notation OK              |
| Sträng         | `"hej"`             | `##"`       | Interpolation: `"Hej {namn}"`         |
| Tecken         | `'A'`               | `##'`       | Ett Unicode-tecken                    |
| Booleskt       | `#1`, `#0`          | `##?`       | INTE numeriska 1 och 0                |
| Array          | `[1, 2, 3]`         | `##]`       | Alla element av samma typ             |
| Tupel          | `(a, b)`            | `##)`       | Positionell                           |
| Namngiven tupel| `(x: 1, y: 2)`      | `##)`       | Åtkomst via namn eller index          |

---

## Utmatning och Inmatning

```zymbol
// Utmatning — INGEN automatisk radbrytning
>> "Hej" ¶                     // ¶ eller \\ ger en explicit ny rad
>> "a=" a " b=" b ¶            // flera värden via juxtaposition
>> "summa=" addera(2, 3) ¶     // funktionsanrop på valfri position
>> (arr$#) ¶                   // postfix-operatorer kräver parenteser

// Inmatning
<< namn                        // utan prompt — läser in variabel
<< "Namn? " namn               // med prompt
```

> `¶` eller `\\` är newline-ekvivalenten.

---

## Strängsammanfogning

Tre giltiga metoder — var och en för sitt sammanhang:

```zymbol
namn = "Ana"
tal = 25

// 1. Komma — i tilldelningar med = eller :=
msg = "Hej ", namn, "!"                    // → Hej Ana!
TITEL := "Användare: ", namn

// 2. Juxtaposition — i utmatning >>
>> "Hej " namn " du är " tal " år gammal" ¶   // → Hej Ana du är 25 år gammal

// 3. Interpolation — i valfritt sammanhang
desc = "Hej {namn}, du är {tal} år gammal"    // → Hej Ana, du är 25 år gammal
```

> **Obs**: `+` är bara för tal. Att använda det med strängar ger en varning.

---

## Kontrollflöde

```zymbol
x = 7

// Enkel om
? x > 0 { >> "positivt" ¶ }

// Om / annars om / annars
? x > 100 {
    >> "stort" ¶
} _? x > 0 {
    >> "positivt" ¶
} _? x == 0 {
    >> "noll" ¶
} _ {
    >> "negativt" ¶
}
```

Blocken `{ }` är **obligatoriska** även om de bara innehåller en rad.

---

## Match

```zymbol
// Match med intervall
poäng = 85
betyg = ?? poäng {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> betyg ¶    // → B

// Match med vakter (villkor)
temp = -5
tillstånd = ?? temp {
    _? temp < 0  : "is"
    _? temp < 20 : "kallt"
    _? temp < 35 : "varmt"
    _            : "hett"
}
>> tillstånd ¶    // → is

// Match med strängar
färg = "röd"
kod = ?? färg {
    "röd"   : "#FF0000"
    "grön"  : "#00FF00"
    _       : "#000000"
}
>> kod ¶
```

---

## Slingor

```zymbol
// Inklusivt intervall: 0..4 itererar 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervall med steg
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Omvänt intervall
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Medan (while)
tal = 1
@ tal <= 64 { tal *= 2 }
>> tal ¶    // → 128

// För varje element
frukt = ["äpple", "päron", "druva"]
@ f:frukt { >> f ¶ }

// Över tecken i sträng
@ c:"hej" { >> c "-" }
>> ¶    // → h-e-j-

// Bryt och Fortsätt
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> fortsätt
    ? i > 7 { @! }          // @! bryt
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funktioner

```zymbol
// Deklaration och anrop
summa(a, b) { <~ a + b }
>> summa(3, 4) ¶    // → 7

// Rekursion
fakultet(tal) {
    ? tal <= 1 { <~ 1 }
    <~ tal * fakultet(tal - 1)
}
>> fakultet(5) ¶    // → 120

// Funktioner har isolerat omfång — ingen åtkomst till yttre variabler
global = 100
testa() {
    x = 42    // lokal, ingen åtkomst till 'global'
    <~ x
}
>> testa() ¶    // → 42
```

> **Viktigt**: Funktioner deklarerade med `namn(params){ }` är inte förstklassiga värden.
> Använd `x -> namn(x)` för att skicka dem som argument.

---

## Lambdas och Stängningar

```zymbol
// Enkel lambda (implicit retur)
dubbel = x -> x * 2
summa = (a, b) -> a + b
>> dubbel(5) ¶     // → 10
>> summa(3, 7) ¶   // → 10

// Lambda med block (explicit retur)
klassificera = x -> {
    ? x > 0 { <~ "positivt" }
    _? x < 0 { <~ "negativt" }
    <~ "noll"
}
>> klassificera(5) ¶     // → positivt
>> klassificera(0) ¶     // → noll
>> klassificera(-5) ¶    // → negativt

// Stängningar — lambdas fångar variabler från yttre omfång
faktor = 3
tredubbel = x -> x * faktor    // fångar 'faktor'
>> tredubbel(7) ¶    // → 21

// Funktionsfabrik
make_adder(tal) { <~ x -> x + tal }
add10 = make_adder(10)
add20 = make_adder(20)
>> add10(5) ¶    // → 15
>> add20(5) ¶    // → 25

// Lambdas som värden: lagra i arrayer
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[1](5) ¶    // → 10
>> ops[2](5) ¶    // → 25
```

---

## Arrayer

```zymbol
arr = [10, 20, 30, 40, 50]

// Åtkomst (index börjar på 0)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30

// Längd (kräver parenteser i >>)
tal = arr$#
>> tal ¶           // → 5
>> (arr$#) ¶       // → 5

// Lägg till, ta bort, kontrollera, slice
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // tar bort index 0: [20, 30, 40, 50, 60]
finns = arr$? 30             // → #1
del = arr$[0..2]             // slice [0,2): [20, 30]

// Uppdatera element
arr[1] = 99
>> arr ¶    // → [20, 99, 40, 50, 60]

// För varje element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` returnerar en **ny array** — tilldela till samma namn: `arr = arr$+ 4`.
> Kedja inte: `arr$+ 4$+ 5` fungerar inte — använd två tilldelningar.

---

## Tupler

```zymbol
// Positionell tupel
punkt = (10, 20)
>> punkt[0] ¶    // → 10
>> punkt[1] ¶    // → 20

// Namngiven tupel
person = (namn: "Alice", ålder: 25)
>> person.namn ¶      // → Alice
>> person.ålder ¶     // → 25
>> person[0] ¶        // → Alice (index fungerar också)

// Nästlad
pos = (x: 3, y: 4)
p = (pos: pos, etikett: "ursprung")
>> p.etikett ¶    // → ursprung
>> p.pos.x ¶      // → 3
```

---

## Högre ordningens Funktioner

HOF-operatorerna kräver en **inline lambda** — ingen direkt lambda-variabel.

```zymbol
tal_lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
dubblade = tal_lista$> (x -> x * 2)
>> dubblade ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
jämna = tal_lista$| (x -> x % 2 == 0)
>> jämna ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (startvärde, (ackumulator, element) -> expr)
totalt = tal_lista$< (0, (acc, x) -> acc + x)
>> totalt ¶    // → 55

// Ingen direkt kedja — använd mellanliggande variabler
steg1 = tal_lista$| (x -> x > 5)
steg2 = steg1$> (x -> x * x)
>> steg2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Felhantering

```zymbol
// Prova / Fånga / Slutligen
!? {
    x = 10 / 0
} :! ##Div {
    >> "division med noll" ¶
} :! ##IO {
    >> "IO-fel" ¶
} :! {
    >> "annat fel: " _err ¶    // _err innehåller felmeddelandet
} :> {
    >> "körs alltid" ¶
}

// Fånga på indextyp
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "index utanför intervall" ¶
}
```

### Feltyper

| Typ         | När det inträffar              |
|-------------|-------------------------------|
| `##Div`     | Division med noll             |
| `##IO`      | Fil / system                  |
| `##Index`   | Index utanför intervall       |
| `##Type`    | Typfel                        |
| `##Parse`   | Dataparsning                  |
| `##Network` | Nätverksfel                   |
| `##_`       | Vilket fel som helst (fånga allt)|

---

## Moduler

```zymbol
// Fil: lib/calc.zy
# calc                    // deklaration — alltid överst

#> {                      // exporter — MÅSTE stå före definitionerna
    summa
    get_PI
}

_PI := 3.14159

summa(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter för konstant (nödvändig omväg)
```

```zymbol
// Fil: main.zy
<# ./lib/calc <= c         // alias obligatoriskt

>> c::summa(5, 3) ¶        // → 8  — anrop med ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Obs**: `alias.NAMN` för åtkomst till konstanter fungerar inte — använd en getter-funktion.

---

## Komplett Exempel: FizzBuzz

```zymbol
klassificera(tal) {
    ? tal % 15 == 0 { <~ "FräsSurr" }
    _? tal % 3  == 0 { <~ "Fräs" }
    _? tal % 5  == 0 { <~ "Surr" }
    _ { <~ tal }
}
@ i:1..20 { >> klassificera(i) ¶ }
```

---

## Symbolreferens

| Symbol  | Operation          | Symbol     | Operation              |
|---------|--------------------|------------|------------------------|
| `=`     | variabel           | `$#`       | längd                  |
| `:=`    | konstant           | `$+`       | lägg till (append)     |
| `>>`    | utmatning          | `$-`       | ta bort (per index)    |
| `<<`    | inmatning          | `$?`       | innehåller             |
| `¶`/`\` | radbrytning        | `$[s..e]`  | slice                  |
| `?`     | om (if)            | `$>`       | map                    |
| `_?`    | annars om (elif)   | `$\|`      | filter                 |
| `_`     | annars / wildcard  | `$<`       | reduce                 |
| `??`    | match              | `!?`       | prova (try)            |
| `@`     | slinga             | `:!`       | fånga (catch)          |
| `@!`    | bryt               | `:>`       | alltid (finally)       |
| `@>`    | fortsätt           | `$!`       | är fel                 |
| `->`    | lambda             | `$!!`      | propagera fel          |
| `<~`    | retur              | `#`        | deklarera modul        |
| `\|>`   | pipe               | `#>`       | exportera              |
| `#1`    | sant               | `<#`       | importera              |
| `#0`    | falskt             | `::`       | modulanrop             |

---

*Zymbol-Lang — Symbolisk. Universell. Oföränderlig.*

---

**Ansvarsfriskrivning:** Denna dokumentation skapades och översattes av artificiell intelligens (AI). Alla ansträngningar har gjorts för att säkerställa noggrannheten, men vissa översättningar eller exempel kan innehålla fel. Den auktoritativa referensen är [Zymbol-Lang-specifikationen](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
