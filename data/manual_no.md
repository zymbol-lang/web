# Kompakt Zymbol-Lang-dokumentasjon

**Zymbol-Lang** er et symbolsk programmeringsspråk. Det bruker ingen nøkkelord — alt er symboler. Det fungerer likt på alle menneskelige språk. Ingen nøkkelord (`if`, `while`, `return` eksisterer ikke — bare symboler `?`, `@`, `<~`). Full Unicode — identifikatorer på ethvert språk eller emoji 👋

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
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++       // 5
x--       // 4
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

## Operatorer

```zymbol
// Aritmetikk
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

## Strenger

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

```zymbol
// Erstatt — s$~~["gammel":"ny"]
s = "hei verden"
s = s$~~["verden":"jord"]       // → "hei jord"
s = s$~~["l":"L":1]             // → "hei jord"   erstatt første N forekomster
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

Arrayer er **mutable** og inneholder elementer av **samme type**.

```zymbol
arr = [10, 20, 30, 40, 50]

// Tilgang (indeks begynner på 0)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30
>> arr[-1] ¶   // → 50   negativt indeks

// Lengde (krever parenteser i >>)
tall = arr$#
>> tall ¶          // → 5
>> (arr$#) ¶       // → 5

// Legg til, fjern, sjekk, slice
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // fjerner indeks 0: [20, 30, 40, 50, 60]
har = arr$? 30               // → #1
idx = arr$?? 30              // → [1]   alle indekser for verdi
del = arr$[0..2]             // slice [0,2): [20, 30]
antall = arr$[0:3]           // antallbasert: [20, 30, 40]

// Direkte elementoppdatering (kun arrayer)
arr[1] = 99              // tilordne
arr[0] += 5              // sammensatt: +=  -=  *=  /=  %=  ^=

// Funksjonell oppdatering — returnerer en ny array; originalet uendret
arr2 = arr[1]$~ 77           // → [20, 77, 40, 50, 60]

// Sorter (primitiver)
num = [3, 1, 4, 1, 5]
stigende  = num$^+           // → [1, 1, 3, 4, 5]
synkende  = num$^-           // → [5, 4, 3, 1, 1]

// Sorter tupler med komparator-lambda
par = [(2,"b"), (1,"a"), (3,"c")]
sortert = par$^ ((a,b) -> a[0] - b[0])    // sorter etter første element

// Nestede arrayer
matrise = [[1,2],[3,4],[5,6]]
>> matrise[1][0] ¶    // → 3

// For hvert element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` returnerer en **ny array** — tilordne til samme navn: `arr = arr$+ 4`.
> Ikke kjede: `arr$+ 4$+ 5` fungerer ikke — bruk to tildelinger.
> `arr$??` og `arr$[s:n]` bruker annen syntaks enn `arr$[s..e]` — se Symbolreferanse.

**Verdisemantikk** — å tilordne en array til en annen variabel oppretter en uavhengig kopi:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er upåvirket
```

---

## Destrukturering

```zymbol
// Array-destrukturering
arr = [10, 20, 30]
[a, b, c] = arr
>> a ¶    // → 10
>> b ¶    // → 20

// Posisjonell tuppel-destrukturering
pt = (3, 4)
(x, y) = pt
>> x ¶    // → 3

// Navngitt tuppel-destrukturering
person = (navn: "Alice", alder: 25)
(navn: n, alder: a) = person
>> n ¶    // → Alice
>> a ¶    // → 25
```

---

## Tupler

Tupler er **uforanderlige** ordnede beholdere som kan inneholde verdier av **forskjellige typer**.
I motsetning til arrayer kan elementer ikke endres etter opprettelse.

```zymbol
// Posisjonell tuppel — blandede typer tillatt
punkt = (10, 20)
>> punkt[0] ¶    // → 10

data = (42, "hei", #1, 3.14)
>> data[2] ¶     // → #1

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

**Uforanderlighet** — ethvert forsøk på å endre et tuppelelement er en kjøretidsfeil:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ kjøretidsfeil: tupler er uforanderlige
// t[0] += 5    // ❌ samme feil
```

For å avlede en endret verdi, bruk `$~` (funksjonell oppdatering) — returnerer en **ny** tuppel:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalet uendret
>> t2 ¶    // → (10, 999, 30)

// Navngitt tuppel — bygg opp eksplisitt
person = (navn: "Alice", alder: 25)
eldre  = (navn: person.navn, alder: 26)
>> person.alder ¶    // → 25
>> eldre.alder ¶     // → 26
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

## Røroperator

```zymbol
// |> sender venstre verdi som _ i høyre uttrykk
resultat = 5 |> _ * 2 |> _ + 1
>> resultat ¶    // → 11

// Kjedede transformasjoner
ord = ["hei", "verden"]
ut = ord
    |> _$> (w -> w$#)              // map til lengder: [3, 6]
    |> _$< (0, (a,x) -> a+x)      // summer: 9
>> ut ¶    // → 9
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

## Tallmodi

Zymbol kan vise tall i **69 Unicode-sifferskrifter** — Devanagari, Arabisk-Indisk, Thai, Klingon pIqaD, Matematisk Fet, LCD-segmenter og mer. Den aktive modusen påvirker kun `>>`-utdata; intern aritmetikk er alltid binær.

### Aktivere et skrift

Skriv sifrene `0` og `9` fra målskriften omgitt av `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabisk-Ind.  (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // tilbakestill til ASCII
```

### Utdata og booleaner

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimaltegn alltid ASCII)
>> 1 + 2 ¶      // → ३

// Booleaner: # prefiks alltid ASCII, siffer tilpasser seg
>> #1 ¶         // → #१   (sann i Devanagari)
>> #0 ¶         // → #०   (usann — atskilt fra ०  heltall null)

x = 28 > 4
>> x ¶          // → #१   (sammenligningsresultat følger aktiv modus)
```

### Opprinnelige sifferliteraler i kildekode

Sifre fra ethvert støttet skrift er gyldige literaler — i intervaller, modulo, sammenligninger:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolske literaler i ethvert skrift

`#` + siffer `0` eller `1` fra en hvilken som helst blokk er en gyldig boolsk literal:

```zymbol
#٠٩#
نشط = #١        // samme som #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` er **alltid ASCII**. `#0` (usann) er alltid visuelt atskilt fra `0` (heltall null) i hvert skrift.

---

## Dataoperatorer

```zymbol
// Analyser streng til tall
x = #|"42"|          // → 42    (heltall)
y = #|"3.14"|        // → 3.14  (flyttall)

// Rund av / avkort
r = #.2|3.14159|     // → 3.14   avrund til 2 desimaler
t = #!2|3.14159|     // → 3.14   avkort til 2 desimaler

// Formater tall
s = #,|1234567.89|    // → "1,234,567.89"  kommaformat
e = #^|0.00042|       // → "4.2e-4"        vitenskapelig notasjon

// Basliteraler
h = 0xFF             // → 255  heksadesimalt
b = 0b1010           // → 10   binært
o = 0o17             // → 15   oktalt

// Baskonvertering
hex = 255$>>"16"     // → "FF"
bin = 10$>>"2"       // → "1010"
```

---

## Skalintegrering

```zymbol
// Kjør skalkommando og fang utdata
ut = <\ ls -la \>
>> ut ¶

// Interpolering i kommandoer
mappe = "/tmp"
filer = <\ ls {mappe} \>

// Flerlinjet skriptblokk
resultat = </
    echo "hei"
    pwd
/>

// Videresend utdata til skall (uten fangst)
>< "echo hei"
```

> `><` sender utdata til skallet uten å fange det.

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

| Symbol      | Operasjon            | Symbol       | Operasjon                  |
|-------------|----------------------|--------------|----------------------------|
| `=`         | variabel             | `$#`         | lengde                     |
| `:=`        | konstant             | `$+`         | legg til (append)          |
| `>>`        | utdata               | `$+[i]`      | sett inn ved indeks        |
| `<<`        | inndata              | `$--`        | fjern siste                |
| `¶`/`\`     | linjeskift           | `$-[i]`      | fjern ved indeks           |
| `?`         | hvis (if)            | `$-[i..j]`   | fjern intervall            |
| `_?`        | ellers hvis (elif)   | `$?`         | inneholder                 |
| `_`         | ellers / wildcard    | `$??`        | alle indekser for verdi    |
| `??`        | match                | `$[s..e]`    | slice                      |
| `@`         | løkke                | `$>`         | map                        |
| `@!`        | bryt                 | `$\|`        | filter                     |
| `@>`        | fortsett             | `$<`         | reduce                     |
| `->`        | lambda               | `arr[i] = val` | oppdater element (kun arrayer) |
| `arr[i] += val` | sammensatt oppdatering | `arr[i]$~` | funksjonell oppdatering (ny kopi) |
| `$^+`       | sorter stigende      | `$^-`        | sorter synkende            |
| `$^`        | sorter med komparator |             |                            |
| `<~`        | retur                | `!?`         | prøv (try)                 |
| `\|>`       | rør                  | `:!`         | fang (catch)               |
| `#1`        | sann                 | `:>`         | alltid (finally)           |
| `#0`        | usann                | `$!`         | er feil                    |
| `<#`        | importer             | `$!!`        | propager feil              |
| `#`         | deklarer modul       | `#>`         | eksporter                  |
| `.`         | felttilgang          | `::`         | modulkall                  |
| `#\|..\|`   | analyser (parse)     | `#.N\|..\|`  | avrund N desimaler         |
| `#!N\|..\|` | avkort N desimaler   | `#,\|..\|`    | kommaformat                |
| `#d0d9#` | bytte tallmodus | `#09#` | tilbakestill til ASCII |
| `#^\|..\|`   | vitenskapelig not.   | `<\ \>`      | skalkommando               |
| `><`        | skalutdata           | `$~~[..]`    | erstatt i streng           |
| `[a,b]=arr` | destrukturering      | `(x,y)=tup`  | tuppel-destrukturering     |

---

*Zymbol-Lang — Symbolsk. Universell. Uforanderlig.*

## Versjonshistorikk

### v0.0.3 — Unicode Tallsystemer & LSP-forbedringer _(April 2026)_

- **Lagt til** 69 Unicode-sifferblokker med modusbytte-token `#d0d9#`
- **Lagt til** Boolske literaler i ethvert skrift — `#१` / `#०`, `#١` / `#٠`, osv.
- **Lagt til** Klingon pIqaD-sifre (CSUR PUA U+F8F0–U+F8F9)
- **Lagt til** VM-opkode `SetNumeralMode` — full paritet med trevandreren
- **Lagt til** REPL respekterer aktiv tallmodus i ekko og variabelvisning
- **Endret** `>>`-utdata for booleaner inkluderer nå `#`-prefiks (`#0` / `#1`) i alle modi

### v0.0.2_01 — Operatøromdøping _(30 Mar 2026)_

- **Endret** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — konsistent med `#`-prefiksfamilien
- **Lagt til** Eksportalias: reeksporter modulmedlemmer under et annet navn

### v0.0.2 — Samlings-API Redesign & Installasjonsprogrammer _(24 Mar 2026)_

- **Lagt til** Samlet `$`-operatorfamilie for arrays og strenger (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lagt til** Destrukturering for arrays, tupler og navngitte tupler
- **Lagt til** Negative indekser (`arr[-1]` = siste element)
- **Lagt til** Native installasjonsprogrammer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Lagt til** Sammensatt tildeling `^=`
- **Rettet** Kanttilfeller i aritmetisk parser; dokumentasjonsrettelser

### v0.0.1 — Første Offentlige Utgivelse _(22 Mar 2026)_

- Trevandrer-tolk + register-VM (`--vm`, ~4× raskere, ~95% paritet)
- Alle kjernekonstruksjoner: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fullstendige Unicode-identifikatorer, modulsystem, lambdaer, closures, feilhåndtering
- REPL, LSP, VS Code-utvidelse, formaterer (`zymbol fmt`)

---

**Ansvarsfraskrivelse:** Denne dokumentasjonen ble opprettet og oversatt av kunstig intelligens (KI). Det er gjort alle anstrengelser for å sikre nøyaktighet, men noen oversettelser eller eksempler kan inneholde feil. Den autoritative referansen er [Zymbol-Lang-spesifikasjonen](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
