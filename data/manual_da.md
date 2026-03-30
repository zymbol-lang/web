# Kompakt Zymbol-Lang-dokumentation

**Zymbol-Lang** er et symbolsk programmeringssprog. Det bruger ingen nøgleord — alt er symboler. Det fungerer ens på alle menneskelige sprog. Ingen nøgleord (`if`, `while`, `return` eksisterer ikke — kun symboler `?`, `@`, `<~`). Fuld Unicode — identifikatorer på ethvert sprog eller emoji 👋

---

## Variabler og Konstanter

```zymbol
x = 10          // variabel (muterbar)
PI := 3.14159   // konstant (uforanderlig — fejl ved gentildeling)
navn = "Ana"
aktiv = #1      // boolsk sand
👋 := "Hej"
```

### Sammensat Tildeling

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

---

## Datatyper

| Type           | Eksempel            | Symbol `#?` | Bemærkninger                          |
|----------------|---------------------|-------------|---------------------------------------|
| Heltal         | `42`, `-7`          | `###`       | 64-bit med fortegn                    |
| Kommatal       | `3.14`, `1.5e10`    | `##.`       | Videnskabelig notation OK             |
| Streng         | `"hej"`             | `##"`       | Interpolation: `"Hej {navn}"`         |
| Tegn           | `'A'`               | `##'`       | Et Unicode-tegn                       |
| Boolsk         | `#1`, `#0`          | `##?`       | IKKE numeriske 1 og 0                 |
| Array          | `[1, 2, 3]`         | `##]`       | Alle elementer af samme type          |
| Tupel          | `(a, b)`            | `##)`       | Positionel                            |
| Navngivet tupel| `(x: 1, y: 2)`      | `##)`       | Adgang via navn eller indeks          |

---

## Uddata og Inddata

```zymbol
// Uddata — INGEN automatisk linjeskift
>> "Hej" ¶                     // ¶ eller \\ giver et eksplicit linjeskift
>> "a=" a " b=" b ¶            // flere værdier via juxtaposition
>> "sum=" tilføj(2, 3) ¶       // funktionskald på enhver position
>> (arr$#) ¶                   // postfix-operatorer kræver parenteser

// Inddata
<< navn                        // uden prompt — læser ind i variabel
<< "Navn? " navn               // med prompt
```

> `¶` eller `\\` er linjeskift-ækvivalenten.

---

## Operatorer

```zymbol
// Aritmetik
5 + 2    // → 7
5 - 2    // → 3
5 * 2    // → 10
5 / 2    // → 2.5
5 % 2    // → 1
5 ^ 2    // → 25   (eksponentiering)

// Sammenligning (returnerer #1 eller #0)
5 == 5   // → #1
5 != 4   // → #1
5 > 4    // → #1
5 < 4    // → #0
5 >= 5   // → #1
5 <= 4   // → #0

// Logisk
#1 && #0    // → #0   (og)
#1 || #0    // → #1   (eller)
!#1         // → #0   (ikke)
```

---

## Strenge

Tre gyldige metoder — hver til sit formål:

```zymbol
navn = "Ana"
tal = 25

// 1. Komma — i tildelinger med = eller :=
msg = "Hej ", navn, "!"                    // → Hej Ana!
TITEL := "Bruger: ", navn

// 2. Juxtaposition — i uddata >>
>> "Hej " navn " du er " tal " år gammel" ¶   // → Hej Ana du er 25 år gammel

// 3. Interpolation — i enhver kontekst
desc = "Hej {navn}, du er {tal} år gammel"    // → Hej Ana, du er 25 år gammel
```

```zymbol
// Erstat — s$~~["gammel":"ny"]
s = "hej verden"
s = s$~~["verden":"jord"]       // → "hej jord"
s = s$~~["l":"L":1]             // → "hej jord"   erstat første N forekomster
```

> **Bemærk**: `+` er kun til tal. Brug med strenge giver en advarsel.

---

## Kontrolflow

```zymbol
x = 7

// Simpel hvis
? x > 0 { >> "positiv" ¶ }

// Hvis / ellers hvis / ellers
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

Blokkene `{ }` er **obligatoriske** selvom de kun indeholder én linje.

---

## Match

```zymbol
// Match med intervaller
point = 85
karakter = ?? point {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> karakter ¶    // → B

// Match med vagter (betingelser)
temp = -5
tilstand = ?? temp {
    _? temp < 0  : "is"
    _? temp < 20 : "koldt"
    _? temp < 35 : "varmt"
    _            : "hedt"
}
>> tilstand ¶    // → is

// Match med strenge
farve = "rød"
kode = ?? farve {
    "rød"   : "#FF0000"
    "grøn"  : "#00FF00"
    _       : "#000000"
}
>> kode ¶
```

---

## Løkker

```zymbol
// Inklusivt interval: 0..4 itererer 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Interval med trin
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Omvendt interval
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Mens (while)
tal = 1
@ tal <= 64 { tal *= 2 }
>> tal ¶    // → 128

// For hvert element
frugt = ["æble", "pære", "drue"]
@ f:frugt { >> f ¶ }

// Over tegn i streng
@ c:"hej" { >> c "-" }
>> ¶    // → h-e-j-

// Afbryd og Fortsæt
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> fortsæt
    ? i > 7 { @! }          // @! afbryd
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funktioner

```zymbol
// Deklaration og kald
sum(a, b) { <~ a + b }
>> sum(3, 4) ¶    // → 7

// Rekursion
fakultet(tal) {
    ? tal <= 1 { <~ 1 }
    <~ tal * fakultet(tal - 1)
}
>> fakultet(5) ¶    // → 120

// Funktioner har isoleret omfang — ingen adgang til ydre variabler
global = 100
teste() {
    x = 42    // lokal, ingen adgang til 'global'
    <~ x
}
>> teste() ¶    // → 42
```

> **Vigtigt**: Funktioner deklareret med `navn(params){ }` er ikke førsteklasses værdier.
> Brug `x -> navn(x)` for at sende dem som argument.

---

## Lambdaer og Lukninger

```zymbol
// Simpel lambda (implicit retur)
dobbelt = x -> x * 2
sum = (a, b) -> a + b
>> dobbelt(5) ¶     // → 10
>> sum(3, 7) ¶      // → 10

// Lambda med blok (eksplicit retur)
klassificer = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "nul"
}
>> klassificer(5) ¶     // → positiv
>> klassificer(0) ¶     // → nul
>> klassificer(-5) ¶    // → negativ

// Lukninger — lambdaer fanger variabler fra ydre omfang
faktor = 3
tredobbelt = x -> x * faktor    // fanger 'faktor'
>> tredobbelt(7) ¶    // → 21

// Funktionsfabrik
make_adder(tal) { <~ x -> x + tal }
add10 = make_adder(10)
add20 = make_adder(20)
>> add10(5) ¶    // → 15
>> add20(5) ¶    // → 25

// Lambdaer som værdier: gem i arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[1](5) ¶    // → 10
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [10, 20, 30, 40, 50]

// Adgang (indeks starter ved 0)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30
>> arr[-1] ¶   // → 50   negativt indeks

// Længde (kræver parenteser i >>)
tal = arr$#
>> tal ¶           // → 5
>> (arr$#) ¶       // → 5

// Tilføj, fjern, kontroller, slice
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // fjerner indeks 0: [20, 30, 40, 50, 60]
har = arr$? 30               // → #1
idx = arr$?? 30              // → [1]   alle indekser for værdi
del = arr$[0..2]             // slice [0,2): [20, 30]
antal = arr$[0:3]            // antalbaseret: [20, 30, 40]

// Opdater element
arr[1] = 99
>> arr ¶    // → [20, 99, 40, 50, 60]

// Funktionel opdatering (returnerer nyt array)
arr2 = arr[1]$~ 77           // → [20, 77, 40, 50, 60]

// Sorter (primitiver)
num = [3, 1, 4, 1, 5]
stigende  = num$^+           // → [1, 1, 3, 4, 5]
faldende  = num$^-           // → [5, 4, 3, 1, 1]

// Sorter tupler med komparator-lambda
par = [(2,"b"), (1,"a"), (3,"c")]
sorteret = par$^ ((a,b) -> a[0] - b[0])    // sorter efter første element

// Indlejrede arrays
matrix = [[1,2],[3,4],[5,6]]
>> matrix[1][0] ¶    // → 3

// For hvert element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` returnerer et **nyt array** — tildel til samme navn: `arr = arr$+ 4`.
> Kæd ikke: `arr$+ 4$+ 5` virker ikke — brug to tildelinger.
> `arr$??` og `arr$[s:n]` bruger anden syntaks end `arr$[s..e]` — se Symbolreference.

---

## Destrukturering

```zymbol
// Array-destrukturering
arr = [10, 20, 30]
[a, b, c] = arr
>> a ¶    // → 10
>> b ¶    // → 20

// Positionel tupel-destrukturering
pt = (3, 4)
(x, y) = pt
>> x ¶    // → 3

// Navngivet tupel-destrukturering
person = (navn: "Alice", alder: 25)
(navn: n, alder: a) = person
>> n ¶    // → Alice
>> a ¶    // → 25
```

---

## Tupler

```zymbol
// Positionel tupel
punkt = (10, 20)
>> punkt[0] ¶    // → 10
>> punkt[1] ¶    // → 20

// Navngivet tupel
person = (navn: "Alice", alder: 25)
>> person.navn ¶      // → Alice
>> person.alder ¶     // → 25
>> person[0] ¶        // → Alice (indeks virker også)

// Indlejret
pos = (x: 3, y: 4)
p = (pos: pos, etiket: "oprindelse")
>> p.etiket ¶    // → oprindelse
>> p.pos.x ¶     // → 3
```

---

## Højere ordens Funktioner

HOF-operatorerne kræver en **inline lambda** — ingen direkte lambda-variabel.

```zymbol
tal_liste = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
fordoblede = tal_liste$> (x -> x * 2)
>> fordoblede ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
lige = tal_liste$| (x -> x % 2 == 0)
>> lige ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (startværdi, (akkumulator, element) -> udtryk)
total = tal_liste$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55

// Ingen direkte kæde — brug mellemliggende variabler
trin1 = tal_liste$| (x -> x > 5)
trin2 = trin1$> (x -> x * x)
>> trin2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Røroperator

```zymbol
// |> sender venstre værdi som _ i højre udtryk
resultat = 5 |> _ * 2 |> _ + 1
>> resultat ¶    // → 11

// Kædede transformationer
ord = ["hej", "verden"]
ud = ord
    |> _$> (w -> w$#)              // map til længder: [3, 5]
    |> _$< (0, (a,x) -> a+x)      // summer: 8
>> ud ¶    // → 8
```

---

## Fejlhåndtering

```zymbol
// Prøv / Fang / Endelig
!? {
    x = 10 / 0
} :! ##Div {
    >> "division med nul" ¶
} :! ##IO {
    >> "IO-fejl" ¶
} :! {
    >> "anden fejl: " _err ¶    // _err indeholder fejlmeddelelsen
} :> {
    >> "kører altid" ¶
}

// Fang på indekstype
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "indeks uden for rækkevidde" ¶
}
```

### Fejltyper

| Type        | Hvornår det sker               |
|-------------|-------------------------------|
| `##Div`     | Division med nul              |
| `##IO`      | Fil / system                  |
| `##Index`   | Indeks uden for rækkevidde    |
| `##Type`    | Typefejl                      |
| `##Parse`   | Dataparsning                  |
| `##Network` | Netværksfejl                  |
| `##_`       | Enhver fejl (fang-alt)        |

---

## Moduler

```zymbol
// Fil: lib/calc.zy
# calc                    // deklaration — altid øverst

#> {                      // eksporter — SKAL stå før definitionerne
    sum
    get_PI
}

_PI := 3.14159

sum(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter for konstant (nødvendig omvej)
```

```zymbol
// Fil: main.zy
<# ./lib/calc <= c         // alias obligatorisk

>> c::sum(5, 3) ¶          // → 8  — kald med ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Bemærk**: `alias.NAVN` for adgang til konstanter virker ikke — brug en getter-funktion.

---

## Dataoperatorer

```zymbol
// Fortolk streng til tal
x = #|"42"|          // → 42    (heltal)
y = #|"3.14"|        // → 3.14  (kommatal)

// Afrund / afkort
r = #.2|3.14159|     // → 3.14   afrund til 2 decimaler
t = #!2|3.14159|     // → 3.14   afkort til 2 decimaler

// Formater tal
s = #,|1234567.89|    // → "1,234,567.89"  kommaformat
e = #^|0.00042|       // → "4.2e-4"        videnskabelig notation

// Basliteraler
h = 0xFF             // → 255  hexadecimalt
b = 0b1010           // → 10   binært
o = 0o17             // → 15   oktalt

// Baskonvertering
hex = 255$>>"16"     // → "FF"
bin = 10$>>"2"       // → "1010"
```

---

## Skalintegration

```zymbol
// Kør skalkommando og fang uddata
ud = <\ ls -la \>
>> ud ¶

// Interpolation i kommandoer
mappe = "/tmp"
filer = <\ ls {mappe} \>

// Flerlinjet skriptblok
resultat = </
    echo "hej"
    pwd
/>

// Omdirigér uddata til skal (uden fangst)
>< "echo hej"
```

> `><` sender uddata til skallen uden at fange det.

---

## Komplet Eksempel: FizzBuzz

```zymbol
klassificer(tal) {
    ? tal % 15 == 0 { <~ "BrusSurr" }
    _? tal % 3  == 0 { <~ "Brus" }
    _? tal % 5  == 0 { <~ "Surr" }
    _ { <~ tal }
}
@ i:1..20 { >> klassificer(i) ¶ }
```

---

## Symbolreference

| Symbol      | Operation            | Symbol       | Operation                  |
|-------------|----------------------|--------------|----------------------------|
| `=`         | variabel             | `$#`         | længde                     |
| `:=`        | konstant             | `$+`         | tilføj (append)            |
| `>>`        | uddata               | `$+[i]`      | indsæt ved indeks          |
| `<<`        | inddata              | `$--`        | fjern sidste               |
| `¶`/`\`     | linjeskift           | `$-[i]`      | fjern ved indeks           |
| `?`         | hvis (if)            | `$-[i..j]`   | fjern interval             |
| `_?`        | ellers hvis (elif)   | `$?`         | indeholder                 |
| `_`         | ellers / wildcard    | `$??`        | alle indekser for værdi    |
| `??`        | match                | `$[s..e]`    | slice                      |
| `@`         | løkke                | `$>`         | map                        |
| `@!`        | afbryd               | `$\|`        | filter                     |
| `@>`        | fortsæt              | `$<`         | reduce                     |
| `->`        | lambda               | `$^+`        | sorter stigende            |
| `<~`        | retur                | `$^-`        | sorter faldende            |
| `\|>`       | rør                  | `$^`         | sorter med komparator      |
| `#1`        | sand                 | `$!`         | er fejl                    |
| `#0`        | falsk                | `$!!`        | propagér fejl              |
| `!?`        | prøv (try)           | `#`          | deklarer modul             |
| `:!`        | fang (catch)         | `#>`         | eksportér                  |
| `:>`        | altid (finally)      | `<#`         | importér                   |
| `.`         | feltadgang           | `::`         | modulkald                  |
| `#\|..\|`   | fortolk (parse)      | `#.N\|..\|`  | afrund N decimaler         |
| `#!N\|..\|` | afkort N decimaler   | `c\|..\|`    | kommaformat                |
| `e\|..\|`   | videnskabelig not.   | `<\ \>`      | skalkommando               |
| `><`        | skaluddata           | `$~~[..]`    | erstat i streng            |
| `[a,b]=arr` | destrukturering      | `(x,y)=tup`  | tupel-destrukturering      |

---

*Zymbol-Lang — Symbolsk. Universelt. Uforanderligt.*

---

**Ansvarsfraskrivelse:** Denne dokumentation blev oprettet og oversat af kunstig intelligens (KI). Der er gjort alle bestræbelser for at sikre nøjagtighed, men nogle oversættelser eller eksempler kan indeholde fejl. Den autoritative reference er [Zymbol-Lang-specifikationen](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
