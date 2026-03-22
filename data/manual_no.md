# Kompakt Zymbol-Lang-dokumentasjon

**Zymbol-Lang** er et symbolsk programmeringsspråk. Det bruker ingen nøkkelord — alt er symboler. Det fungerer likt på alle menneskelige språk.

---

## Filosofi

- Ingen nøkkelord (`if`, `while`, `return` eksisterer ikke — bare symboler `?`, `@`, `<~`)
- Full Unicode — identifikatorer på ethvert språk eller emoji 👋
- Språkuavhengig — koden er identisk på alle språk

---

## Variabler og Konstanter

```zymbol
x = 10          // variabel (muterbar)
PI := 3.14159   // konstant (uforanderlig — feil ved ny tildeling)
navn = "Ana"
aktiv = #1      // boolsk sann
👋 := "Hei"
```

### Sammensatt Tildeling

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

| Type           | Eksempel            | Symbol `#?` | Merknader                             |
|----------------|---------------------|-------------|---------------------------------------|
| Heltall        | `42`, `-7`          | `###`       | 64-bit med fortegn                    |
| Flyttall       | `3.14`, `1.5e10`    | `##.`       | Vitenskapelig notasjon OK             |
| Streng         | `"hei"`             | `##"`       | Interpolasjon: `"Hei {navn}"`         |
| Tegn           | `'A'`               | `##'`       | Ett Unicode-tegn                      |
| Boolsk         | `#1`, `#0`          | `##?`       | IKKE numeriske 1 og 0                 |
| Array          | `[1, 2, 3]`         | `##]`       | Alle elementer av samme type          |
| Tuppel         | `(a, b)`            | `##)`       | Posisjonell                           |
| Navngitt tuppel| `(x: 1, y: 2)`      | `##)`       | Tilgang via navn eller indeks         |

---

## Utdata og Inndata

```zymbol
// Utdata — INGEN automatisk linjeskift
>> "Hei" ¶                     // ¶ eller \\ gir et eksplisitt linjeskift
>> "a=" a " b=" b ¶            // flere verdier via juxtaposisjon
>> "sum=" legg_til(2, 3) ¶     // funksjonskall på enhver posisjon
>> (arr$#) ¶                   // postfix-operatorer krever parenteser

// Inndata
<< navn                        // uten prompt — leser inn variabel
<< "Navn? " navn               // med prompt
```

> `¶` eller `\\` er ekvivalenten for linjeskift.

---

## Strengsammensetning

Tre gyldige metoder — hver for sin kontekst:

```zymbol
navn = "Ana"
tall = 25

// 1. Komma — i tildelinger med = eller :=
msg = "Hei ", navn, "!"                    // → Hei Ana!
TITTEL := "Bruker: ", navn

// 2. Juxtaposisjon — i utdata >>
>> "Hei " navn " du er " tall " år gammel" ¶   // → Hei Ana du er 25 år gammel

// 3. Interpolasjon — i enhver kontekst
desc = "Hei {navn}, du er {tall} år gammel"    // → Hei Ana, du er 25 år gammel
```

> **Merk**: `+` er bare for tall. Bruk med strenger gir en advarsel.

---

## Kontrollflyt

```zymbol
x = 7

// Enkel hvis
? x > 0 { >> "positiv" ¶ }

// Hvis / ellers hvis / ellers
? x > 100 {
    >> "stor" ¶
} _? x > 0 {
    >> "positiv" ¶
} _? x == 0 {
    >> "null" ¶
} _ {
    >> "negativ" ¶
}
```

Blokkene `{ }` er **obligatoriske** selv om de bare inneholder én linje.

---

## Match

```zymbol
// Match med intervaller
poeng = 85
karakter = ?? poeng {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> karakter ¶    // → B

// Match med vakter (betingelser)
temp = -5
tilstand = ?? temp {
    _? temp < 0  : "is"
    _? temp < 20 : "kaldt"
    _? temp < 35 : "varmt"
    _            : "hett"
}
>> tilstand ¶    // → is

// Match med strenger
farge = "rød"
kode = ?? farge {
    "rød"   : "#FF0000"
    "grønn" : "#00FF00"
    _       : "#000000"
}
>> kode ¶
```

---

## Løkker

```zymbol
// Inklusivt intervall: 0..4 itererer 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervall med trinn
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Omvendt intervall
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Mens (while)
tall = 1
@ tall <= 64 { tall *= 2 }
>> tall ¶    // → 128

// For hvert element
frukt = ["eple", "pære", "drue"]
@ f:frukt { >> f ¶ }

// Over tegn i streng
@ c:"hei" { >> c "-" }
>> ¶    // → h-e-i-

// Bryt og Fortsett
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> fortsett
    ? i > 7 { @! }          // @! bryt
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funksjoner

```zymbol
// Deklarasjon og kall
sum(a, b) { <~ a + b }
>> sum(3, 4) ¶    // → 7

// Rekursjon
fakultet(tall) {
    ? tall <= 1 { <~ 1 }
    <~ tall * fakultet(tall - 1)
}
>> fakultet(5) ¶    // → 120

// Funksjoner har isolert omfang — ingen tilgang til ytre variabler
global = 100
teste() {
    x = 42    // lokal, ingen tilgang til 'global'
    <~ x
}
>> teste() ¶    // → 42
```

> **Viktig**: Funksjoner deklarert med `navn(params){ }` er ikke førsteklasses verdier.
> Bruk `x -> navn(x)` for å sende dem som argument.

---

## Lambdaer og Lukkinger

```zymbol
// Enkel lambda (implisitt retur)
dobbel = x -> x * 2
sum = (a, b) -> a + b
>> dobbel(5) ¶     // → 10
>> sum(3, 7) ¶     // → 10

// Lambda med blokk (eksplisitt retur)
klassifiser = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "null"
}
>> klassifiser(5) ¶     // → positiv
>> klassifiser(0) ¶     // → null
>> klassifiser(-5) ¶    // → negativ

// Lukkinger — lambdaer fanger variabler fra ytre omfang
faktor = 3
tredobbel = x -> x * faktor    // fanger 'faktor'
>> tredobbel(7) ¶    // → 21

// Funksjonsfabrikk
make_adder(tall) { <~ x -> x + tall }
add10 = make_adder(10)
add20 = make_adder(20)
>> add10(5) ¶    // → 15
>> add20(5) ¶    // → 25

// Lambdaer som verdier: lagre i arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[1](5) ¶    // → 10
>> ops[2](5) ¶    // → 25
```

---

## Arrayer

```zymbol
arr = [10, 20, 30, 40, 50]

// Tilgang (indeks begynner på 0)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30

// Lengde (krever parenteser i >>)
tall = arr$#
>> tall ¶          // → 5
>> (arr$#) ¶       // → 5

// Legg til, fjern, sjekk, slice
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // fjerner indeks 0: [20, 30, 40, 50, 60]
har = arr$? 30               // → #1
del = arr$[0..2]             // slice [0,2): [20, 30]

// Oppdater element
arr[1] = 99
>> arr ¶    // → [20, 99, 40, 50, 60]

// For hvert element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` returnerer en **ny array** — tilordne til samme navn: `arr = arr$+ 4`.
> Ikke kjede: `arr$+ 4$+ 5` fungerer ikke — bruk to tildelinger.

---

## Tupler

```zymbol
// Posisjonell tuppel
punkt = (10, 20)
>> punkt[0] ¶    // → 10
>> punkt[1] ¶    // → 20

// Navngitt tuppel
person = (navn: "Alice", alder: 25)
>> person.navn ¶      // → Alice
>> person.alder ¶     // → 25
>> person[0] ¶        // → Alice (indeks fungerer også)

// Nestet
pos = (x: 3, y: 4)
p = (pos: pos, etikett: "opprinnelse")
>> p.etikett ¶    // → opprinnelse
>> p.pos.x ¶      // → 3
```

---

## Høyere ordens Funksjoner

HOF-operatorene krever en **inline lambda** — ingen direkte lambda-variabel.

```zymbol
tall_liste = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
doblet = tall_liste$> (x -> x * 2)
>> doblet ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
partall = tall_liste$| (x -> x % 2 == 0)
>> partall ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (startverdi, (akkumulator, element) -> uttr)
totalt = tall_liste$< (0, (acc, x) -> acc + x)
>> totalt ¶    // → 55

// Ingen direkte kjeding — bruk mellomliggende variabler
steg1 = tall_liste$| (x -> x > 5)
steg2 = steg1$> (x -> x * x)
>> steg2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Feilhåndtering

```zymbol
// Prøv / Fang / Til Slutt
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisjon med null" ¶
} :! ##IO {
    >> "IO-feil" ¶
} :! {
    >> "annen feil: " _err ¶    // _err inneholder feilmeldingen
} :> {
    >> "kjøres alltid" ¶
}

// Fang på indekstype
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "indeks utenfor rekkevidde" ¶
}
```

### Feiltyper

| Type        | Når det skjer                  |
|-------------|-------------------------------|
| `##Div`     | Divisjon med null             |
| `##IO`      | Fil / system                  |
| `##Index`   | Indeks utenfor rekkevidde     |
| `##Type`    | Typefeil                      |
| `##Parse`   | Dataparsing                   |
| `##Network` | Nettverksfeil                 |
| `##_`       | Enhver feil (fang-alt)        |

---

## Moduler

```zymbol
// Fil: lib/calc.zy
# calc                    // deklarasjon — alltid øverst

#> {                      // eksporter — MÅ stå før definisjonene
    sum
    get_PI
}

_PI := 3.14159

sum(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter for konstant (nødvendig omvei)
```

```zymbol
// Fil: main.zy
<# ./lib/calc <= c         // alias obligatorisk

>> c::sum(5, 3) ¶          // → 8  — kall med ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Merk**: `alias.NAVN` for tilgang til konstanter fungerer ikke — bruk en getter-funksjon.

---

## Komplett Eksempel: FizzBuzz

```zymbol
klassifiser(tall) {
    ? tall % 15 == 0 { <~ "BrusSurr" }
    _? tall % 3  == 0 { <~ "Brus" }
    _? tall % 5  == 0 { <~ "Surr" }
    _ { <~ tall }
}
@ i:1..20 { >> klassifiser(i) ¶ }
```

---

## Symbolreferanse

| Symbol  | Operasjon          | Symbol     | Operasjon              |
|---------|--------------------|------------|------------------------|
| `=`     | variabel           | `$#`       | lengde                 |
| `:=`    | konstant           | `$+`       | legg til (append)      |
| `>>`    | utdata             | `$-`       | fjern (per indeks)     |
| `<<`    | inndata            | `$?`       | inneholder             |
| `¶`/`\` | linjeskift         | `$[s..e]`  | slice                  |
| `?`     | hvis (if)          | `$>`       | map                    |
| `_?`    | ellers hvis (elif) | `$\|`      | filter                 |
| `_`     | ellers / wildcard  | `$<`       | reduce                 |
| `??`    | match              | `!?`       | prøv (try)             |
| `@`     | løkke              | `:!`       | fang (catch)           |
| `@!`    | bryt               | `:>`       | alltid (finally)       |
| `@>`    | fortsett           | `$!`       | er feil                |
| `->`    | lambda             | `$!!`      | propager feil          |
| `<~`    | retur              | `#`        | deklarer modul         |
| `\|>`   | pipe               | `#>`       | eksporter              |
| `#1`    | sann               | `<#`       | importer               |
| `#0`    | usann              | `::`       | modulkall              |

---

*Zymbol-Lang — Symbolsk. Universell. Uforanderlig.*

---

**Ansvarsfraskrivelse:** Denne dokumentasjonen ble opprettet og oversatt av kunstig intelligens (KI). Det er gjort alle anstrengelser for å sikre nøyaktighet, men noen oversettelser eller eksempler kan inneholde feil. Den autoritative referansen er [Zymbol-Lang-spesifikasjonen](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
