> **Ansvarsfraskrivelse:** Denne dokumentasjonen ble opprettet og oversatt av kunstig intelligens (KI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> Den kanoniske referansen er **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** i tolk-repositoriet.

---

# Zymbol-Lang Håndbok

**Zymbol-Lang** er et symbolsk programmeringsspråk. Ingen nøkkelord — alt er et symbol. Fungerer identisk på alle menneskelige språk.

- Ingen `if`, `while`, `return` — kun `?`, `@`, `<~`
- Full Unicode — identifikatorer på alle språk eller emoji
- Språkuavhengig — koden er den samme overalt

**Tolkversjon**: v0.0.4 | **Testdekning**: 393/393 (TW ↔ VM paritet)

---

## Variabler og konstanter

```zymbol
x = 10              // muterbar variabel
PI := 3.14159       // konstant — ny tildeling er en kjøretidsfeil
navn = "Alice"
aktiv = #1          // boolsk sann
👋 := "Hei"
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

| Type | Literal | `#?`-tag | Merknader |
|------|---------|----------|-----------|
| Heltall | `42`, `-7` | `###` | 64-bit med fortegn |
| Desimaltall | `3.14`, `1.5e10` | `##.` | Vitenskapelig notasjon OK |
| Streng | `"tekst"` | `##"` | Interpolasjon: `"Hei {navn}"` |
| Tegn | `'A'` | `##'` | Enkelt Unicode-tegn |
| Boolsk | `#1`, `#0` | `##?` | IKKE numerisk — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Homogene elementer |
| Tuppel | `(a, b)` | `##)` | Posisjonsbasert |
| Navngitt tuppel | `(x: 1, y: 2)` | `##)` | Navngitte felt |
| Funksjon | navngitt funksjonsreferanse | `##()` | Førsteklasses; viser `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Førsteklasses; viser `<lambd/N>` |

```zymbol
// Typeintrospeksjon — returnerer (type, sifre, verdi)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Utdata og inndata

```zymbol
>> "Hei" ¶                        // ¶ eller \\ for eksplisitt linjeskift
>> "a=" a " b=" b ¶               // juxtaposisjon — flere verdier
>> (arr$#) ¶                      // postfix-operatorer krever ( ) i >>

<< navn                           // les inn i variabel (ingen prompt)
<< "Skriv inn navn: " navn        // med prompt
```

> `¶` (AltGr+R på spansk tastatur) og `\\` er ekvivalente linjeskiftmarkeringer.

---

## Operatorer

```zymbol
// Aritmetikk — bruk tildelinger; noen operatorer har særegenheter direkte i >>
a = 10
b = 3
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (heltallsdivisjon)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (eksponentiering)

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

## Strenger

```zymbol
// To sammenkoblingsformer
navn = "Alice"
n = 42

>> "Hei " navn " du har " n ¶    // juxtaposisjon — i >>
beskr = "Hei {navn}, du har {n}"  // interpolasjon — overalt
```

```zymbol
s = "Hei verden"
len = s$#                  // 10
sub = s$[1..3]             // "Hei"  (1-basert, slutt inklusiv)
har = s$? "verden"         // #1
deler = "a,b,c,d"$/ ','   // [a, b, c, d]  (del ved skilletegn)
bytt = s$~~["e":"E"]          // "HEi vErdEn"
bytt1 = s$~~["e":"E":1]       // "HEi verden"  (bare de første N)
```

> `+` er kun for tall. Bruk `,`, juxtaposisjon eller interpolasjon for strenger.

---

## Kontrollflyten

```zymbol
x = 7

? x > 0 { >> "positiv" ¶ }

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

> `{ }` klammeparenteser er **påkrevd** selv for en enkelt setning.

---

## Match

```zymbol
// Intervaller
poeng = 85
karakter = ?? poeng {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> karakter ¶    // → B

// Strenger
farge = "rød"
kode = ?? farge {
    "rød"    : "#FF0000"
    "grønn"  : "#00FF00"
    _        : "#000000"
}

// Sammenligningsmønstre
temp = -5
tilstand = ?? temp {
    < 0  : "is"
    < 20 : "kald"
    < 35 : "varm"
    _    : "hed"
}
>> tilstand ¶    // → is

// Setningsform (blokkarmer)
?? n {
    0       : { >> "null" ¶ }
    _? n < 0: { >> "negativ" ¶ }
    _       : { >> "positiv" ¶ }
}
```

---

## Løkker

```zymbol
@ i:0..4  { >> i " " }        // intervall inklusivt:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // med steg:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omvendt:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (mens)

frukter = ["eple", "pære", "drue"]
@ f:frukter { >> f ¶ }        // for hvert array

@ t:"hei" { >> t "-" }
>> ¶                          // → h-e-i-  (for hvert streng)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> fortsett
    ? i > 7 { @! }             // @! bryt
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

// Merket løkke (nestet bryt)
antall = 0
@:ytre {
    antall++
    ? antall >= 3 { @:ytre! }
}
>> antall ¶                    // → 3
```

---

## Funksjoner

```zymbol
legg_til(a, b) { <~ a + b }
>> legg_til(3, 4) ¶    // → 7

fakultet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakultet(n - 1)
}
>> fakultet(5) ¶    // → 120
```

Funksjoner har **isolert omfang** — de kan ikke lese ytre variabler. Bruk utdataparametre `<~` til å endre kallervariable:

```zymbol
bytt(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
bytt(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Navngitte funksjoner er **førsteklasses verdier** — send direkte: `tall$> dobbel`. Til innpakking er `x -> fn(x)` også gyldig.

---

## Lambdaer og lukninger

```zymbol
dobbel = x -> x * 2
sum = (a, b) -> a + b
>> dobbel(5) ¶    // → 10
>> sum(3, 7) ¶    // → 10

// Blokk-lambda
klassifiser = x -> {
    ? x > 0 { <~ "positiv" }
    _? x < 0 { <~ "negativ" }
    <~ "null"
}

// Lukning — fanger ytre omfang
faktor = 3
tredobbel = x -> x * faktor
>> tredobbel(7) ¶    // → 21

// Fabrikk
lag_adder(n) { <~ x -> x + n }
legg10_til = lag_adder(10)
>> legg10_til(5) ¶    // → 15

// I arrays
operasjoner = [x -> x+1, x -> x*2, x -> x*x]
>> operasjoner[3](5) ¶    // → 25
```

---

## Arrays

Arrays er **muterbare** og inneholder elementer av **samme type**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — tilgang (1-basert: første element)
arr[-1]         // 5 — negativt indeks (siste element)
arr$#           // 5 — lengde (bruk (arr$#) i >>)

arr = arr$+ 6            // legg til → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sett inn ved posisjon 2 (1-basert)
arr3 = arr$- 3           // fjern første forekomst av verdi
arr4 = arr$-- 3          // fjern alle forekomster
arr5 = arr$-[1]          // fjern ved indeks 1 (første element)
arr6 = arr$-[2..3]       // fjern intervall (1-basert, slutt inklusiv)

har = arr$? 3            // #1 — inneholder
pos = arr$?? 3           // [3] — alle indekser for verdi (1-basert)
utsnitt = arr$[1..3]     // [1,2,3] — utsnitt (1-basert, slutt inklusiv)
utsnitt2 = arr$[1:3]     // [1,2,3] — samme, antallsbasert syntaks

stigende = arr$^+        // sortert stigende  (kun primitive)
synkende = arr$^-        // sortert synkende (kun primitive)

// Navngitte/posisjonsbaserte tuppel-arrays — bruk $^ med komparator-lambda
db = [(navn: "Carla", alder: 28), (navn: "Ana", alder: 25), (navn: "Bob", alder: 30)]
etter_alder = db$^ (a, b -> a.alder < b.alder)    // stigende etter alder  (<)
etter_navn  = db$^ (a, b -> a.navn > b.navn)       // synkende etter navn (>)
>> etter_alder[1].navn ¶     // → Ana
>> etter_navn[1].navn ¶      // → Carla

// Direkte elementoppdatering (kun arrays)
arr[1] = 99              // tildel
arr[2] += 5              // sammensatt: +=  -=  *=  /=  %=  ^=

// Funksjonell oppdatering — returnerer en ny array; originalet uendret
arr2 = arr[2]$~ 99
```

> Alle samlingsoperatorer returnerer en **ny array**. Tildel tilbake: `arr = arr$+ 4`.
> `$+` kan kjedes: `arr = arr$+ 5$+ 6$+ 7`. Andre operatorer bruker mellomliggende tildelinger.
> **Indeksering er 1-basert**: `arr[1]` er det første elementet; `arr[0]` er en kjøretidsfeil.
> `$^+` / `$^-` sorterer **primitive arrays** (tall, strenger). For tuppel-arrays bruk `$^` med en komparator-lambda — retning er kodet i lambdaen (`<` = stigende, `>` = synkende).

**Verdisemantikk** — å tildele en array til en annen variabel oppretter en uavhengig kopi:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er upåvirket
```

```zymbol
// Nestede arrays (1-basert indeksering)
matrise = [[1,2,3],[4,5,6],[7,8,9]]
>> matrise[2][3] ¶    // → 6  (rad 2, kolonne 3)
```

---

## Destrukturering

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[første, *resten] = arr      // første=10  resten=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ kasserer

// Posisjonsbasert tuppel
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Navngitt tuppel
person = (navn: "Ana", alder: 25, by: "Madrid")
(navn: n, alder: a) = person   // n="Ana"  a=25
```

---

## Tupler

Tupler er **uforanderlige** ordnede beholdere som kan inneholde verdier av **forskjellige typer**.
I motsetning til arrays kan elementer ikke endres etter opprettelse.

```zymbol
// Posisjonsbasert — blandede typer tillatt
punkt = (10, 20)
>> punkt[1] ¶    // → 10

data = (42, "hei", #1, 3.14)
>> data[3] ¶     // → #1

// Navngitt
person = (navn: "Alice", alder: 25)
>> person.navn ¶    // → Alice
>> person[1] ¶      // → Alice  (indeks fungerer også, 1-basert)

// Nestet
pos = (x: 10, y: 20)
p = (pos: pos, etikett: "opprinnelse")
>> p.pos.x ¶        // → 10
```

**Uforanderlighet** — ethvert forsøk på å endre et tuppelelement er en kjøretidsfeil:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kjøretidsfeil: tupler er uforanderlige
// t[1] += 5    // ❌ samme feil
```

For å avlede en endret verdi bruk `$~` (funksjonell oppdatering) — returnerer en **ny** tuppel:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalet uendret
>> t2 ¶    // → (10, 999, 30)

// Navngitt tuppel — bygg om eksplisitt
person = (navn: "Alice", alder: 25)
eldre  = (navn: person.navn, alder: 26)
>> person.alder ¶    // → 25
>> eldre.alder ¶     // → 26
```

---

## Høyereordens funksjoner

```zymbol
tall = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doblet     = tall$> (x -> x * 2)                // map  → [2,4,6…20]
partall    = tall$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total      = tall$< (0, (akk, x) -> akk + x)    // reduser → 55

// Kjede via mellomvariabler
trinn1 = tall$| (x -> x > 3)
trinn2 = trinn1$> (x -> x * x)
>> trinn2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Navngitte funksjoner kan sendes direkte til HOF
dobbel(x) { <~ x * 2 }
er_stor(x) { <~ x > 5 }
r = tall$> dobbel       // ✅ direkte referanse
r = tall$| er_stor      // ✅ direkte referanse
```

---

## Røroperator

Høyre side krever alltid `_` som plassholder for den rørlagte verdien:

```zymbol
dobbel = x -> x * 2
legg_til = (a, b) -> a + b
øk = x -> x + 1

5 |> dobbel(_)        // → 10
10 |> legg_til(_, 5)  // → 15
5 |> legg_til(2, _)   // → 7

// Kjedet
r = 5 |> dobbel(_) |> øk(_) |> dobbel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Feilhåndtering

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisjon med null" ¶
} :! {
    >> "annet: " _err ¶    // _err inneholder feilmeldingen
} :> {
    >> "kjøres alltid" ¶
}
```

| Type | Når |
|------|-----|
| `##Div` | Divisjon med null |
| `##IO` | Fil / system |
| `##Index` | Indeks utenfor rekkevidde |
| `##Type` | Typefeil |
| `##Parse` | Dataparsing |
| `##Network` | Nettverksfeil |
| `##_` | Enhver feil (fang-alt) |

---

## Moduler

```zymbol
// lib/kalkulus.zy — modulinnholdet er omgitt av klammeparenteser
# kalkulus {
    #> { legg_til, hent_PI }

    _PI := 3.14159
    legg_til(a, b) { <~ a + b }
    hent_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/kalkulus <= k    // alias påkrevd

>> k::legg_til(5, 3) ¶     // → 8
pi = k::hent_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksporter med et annet offentlig navn
# mittlib {
    #> { _intern_legg_til <= sum }

    _intern_legg_til(a, b) { <~ a + b }
}
```

```zymbol
<# ./mittlib <= m

>> m::sum(3, 4) ¶    // → 7  (det interne navnet _intern_legg_til er skjult)
```

> **Modulregler**: kun `#>`, funksjonsdefinsjoner og bokstavelige variabel-/konstantinitialiserer er tillatt inne i `# navn { }`. Kjørbare setninger (`>>`, `<<`, løkker osv.) gir feil E013.

---

## Tallmodi

Zymbol kan vise tall i **69 Unicode-sifferskrifter** — Devanagari, arabisk-indisk, thai, klingon pIqaD, matematisk fet, LCD-segmenter og mer. Den aktive modusen påvirker kun `>>`-utdata; intern aritmetikk er alltid binær.

### Aktivere et skrift

Skriv `0`- og `9`-sifferet fra målskriften omgitt av `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisk-indisk (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
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

### Innebygde sifferliteraler i kildekode

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

> `#` er **alltid ASCII**. `#0` (usann) er alltid visuelt atskilt fra `0` (heltall null) i ethvert skrift.

---

## Dataoperatorer

```zymbol
// Typekonverteringskast
##.42         // → 42.0  (til Desimaltall)
###3.7        // → 4     (til Heltall, rund)
##!3.7        // → 3     (til Heltall, avkort)

// Analyser streng til tall
v1 = #|"42"|      // → 42  (Heltall)
v2 = #|"3.14"|    // → 3.14  (Desimaltall)
v3 = #|"abc"|     // → "abc"  (feilsikker, ingen feil)

// Rund / avkort
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rund til 2 desimalplasser)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (avkort)

// Tallformatering
fmt = #,|1234567|  // → 1,234,567  (kommaseparert)
sci = #^|12345.678|    // → 1.2345678e4  (vitenskapelig)

// Baseliteraler
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binær)
c = 0o101        // → 'A'  (oktal)

// Basekonverteringsutdata
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Skalintegrasjon

```zymbol
dato = <\ date +%Y-%m-%d \>     // fanger stdout (inkl. avsluttende \n)
>> "I dag: " dato

fil = "data.txt"
innhold = <\ cat {fil} \>       // interpolasjon i kommandoer

utdata = </"./underscript.zy"/>  // kjør et annet Zymbol-skript, fang utdata
>> utdata
```

> `><` fanger CLI-argumenter som en strengarray (kun trevandrer).

---

## Komplett eksempel: FizzBuzz

```zymbol
klassifiser(tall) {
    ? tall % 15 == 0 { <~ "FizzBuzz" }
    _? tall % 3  == 0 { <~ "Fizz" }
    _? tall % 5  == 0 { <~ "Buzz" }
    _ { <~ tall }
}

@ i:1..20 { >> klassifiser(i) ¶ }
```

---

## Symbolreferanse

| Symbol | Operasjon | Symbol | Operasjon |
|--------|-----------|--------|-----------|
| `=` | variabel | `$#` | lengde |
| `:=` | konstant | `$+` | legg til (kjedbar) |
| `>>` | utdata | `$+[i]` | sett inn ved indeks (1-basert) |
| `<<` | inndata | `$-` | fjern første ved verdi |
| `¶` / `\\` | linjeskift | `$--` | fjern alle ved verdi |
| `?` | hvis | `$-[i]` | fjern ved indeks (1-basert) |
| `_?` | ellers-hvis | `$-[i..j]` | fjern intervall (1-basert) |
| `_` | ellers / jokertegn | `$?` | inneholder |
| `??` | match | `$??` | finn alle indekser (1-basert) |
| `@` | løkke | `$[s..e]` | utsnitt (1-basert) |
| `@ N { }` | teller-løkke (N iterasjoner) | `$>` | map |
| `@!` | bryt | `$\|` | filtrer |
| `@>` | fortsett | `$<` | reduser |
| `@:navn { }` | merket løkke | `$/ delim` | strengdeling |
| `@:navn!` | bryt merke | `$++ a b c` | sammenkoblings-bygg |
| `@:navn>` | fortsett merke | `arr[i>j>k]` | navigasjonsindeks |
| `->` | lambda | `arr[i] = val` | oppdater element (kun arrays) |
| `arr[i] += val` | sammensatt oppdatering | `arr[i]$~` | funksjonell oppdatering (ny kopi) |
| `$^+` | sorter stigende (primitive) | `$^-` | sorter synkende (primitive) |
| `$^` | sorter med komparator (tupler) | `<~` | returner |
| `\|>` | rør | `!?` | prøv |
| `:!` | fang | `:>` | alltid |
| `#1` | sann | `#0` | usann |
| `$!` | er feil | `$!!` | videresend feil |
| `<#` | importer | `#>` | eksporter |
| `#` | deklarer modul | `::` | modulkall |
| `.` | felttilgang | `#?` | type-metadata |
| `#\|..\|` | analyser tall | `##.` | konverter til Desimaltall |
| `###` | konverter til Heltall (rund) | `##!` | konverter til Heltall (avkort) |
| `#.N\|..\|` | rund | `#!N\|..\|` | avkort |
| `#,\|..\|` | kommaformat | `#^\|..\|` | vitenskapelig |
| `#d0d9#` | tallsystembytte | `#09#` | tilbakestill til ASCII |
| `<\ ..\>` | skalutførelse | `>\<` | CLI-argumenter |
| `\ var` | eksplisitt slett variabel | | |

---

## Versjonshistorikk

### v0.0.4 — 1-basert indeksering, førsteklasses funksjoner og modulblokker _(april 2026)_

- **Endring** All indeksering byttet til **1-basert** — `arr[1]` er det første elementet; `arr[0]` er en kjøretidsfeil
- **Lagt til** Navngitte funksjoner er **førsteklasses verdier** — send direkte til HOF: `tall$> dobbel`
- **Lagt til** Modul **blokksyntaks** påkrevd: `# navn { ... }` — flat syntaks fjernet
- **Lagt til** Flerdimensjonal indeksering: `arr[i>j>k]` (navigasjon), `arr[p ; q]` (flat uttak)
- **Lagt til** Typekonverteringskast: `##.uttr` (Desimaltall), `###uttr` (Heltall rund), `##!uttr` (Heltall avkort)
- **Lagt til** Strengdeling: `str$/ delim` — returnerer `Array(Streng)`
- **Lagt til** Sammenkoblings-bygg: `base$++ a b c` — legger til flere elementer
- **Lagt til** Teller-løkke: `@ N { }` — gjentar nøyaktig N ganger
- **Lagt til** Merket løkkesyntaks: `@:navn { }`, `@:navn!`, `@:navn>` — erstatter `@ @navn` / `@! navn`
- **Lagt til** Variabelomfangsregler: `_navn`-variabler har nøyaktig blokkscope; `\ var` sletter tidlig
- **Lagt til** Match-sammenligningsmønstre: `< 0 :`, `> 5 :`, `== 42 :` osv.
- **Lagt til** Modul E013-feil: kjørbare setninger i modulkropp er forbudt
- **Rettet** `take_variable` ødelegger ikke lenger modulkonstanter ved skrivetilbake
- **Rettet** `alias.CONST` løses nå riktig; `#>` kan vises etter funksjonsdefinsjoner
- **VM** Full paritet: 393/393 tester bestått

### v0.0.3 — Unicode-tallsystemer og LSP-forbedringer _(april 2026)_

- **Lagt til** 69 Unicode-sifferblokker med modusbyttetoken `#d0d9#`
- **Lagt til** Boolske literaler i ethvert skrift — `#१` / `#०`, `#١` / `#٠` osv.
- **Lagt til** Klingon pIqaD-sifre (CSUR PUA U+F8F0–U+F8F9)
- **Lagt til** `SetNumeralMode` VM-opkode — full paritet med trevandrer
- **Lagt til** REPL respekterer aktiv tallmodus i ekko og variabelvisning
- **Endret** Boolsk `>>`-utdata inkluderer nå `#`-prefiks (`#0` / `#1`) i alle modi

### v0.0.2_01 — Operatornavn _(30. mar. 2026)_

- **Endret** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — konsistent med `#`-formatprefiksfamilien
- **Lagt til** Eksportalias: reeksporter modulmedlemmer under et annet navn

### v0.0.2 — Samlings-API-redesign og installasjonsprogrammer _(24. mar. 2026)_

- **Lagt til** Samlet `$`-operatorfamilie for arrays og strenger (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lagt til** Destruktureringtildeling for arrays, tupler og navngitte tupler
- **Lagt til** Negative indekser (`arr[-1]` = siste element)
- **Lagt til** Native installasjonsprogrammer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. mar. 2026)_

- **Lagt til** Sammensatt tildeling `^=`
- **Rettet** Parser-aritmetikk-hjørnetilfeller; dokumentasjonsrettelser

### v0.0.1 — Første offentlige utgivelse _(22. mar. 2026)_

- Trevandrer-tolk + register-VM (`--vm`, ~4× raskere, ~95% paritet)
- Alle kjernekonstruksjoner: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fulle Unicode-identifikatorer, modulsystem, lambdaer, lukninger, feilhåndtering
- REPL, LSP, VS Code-utvidelse, formaterer (`zymbol fmt`)

---

_Zymbol-Lang — Symbolsk. Universelt. Uforanderlig._
