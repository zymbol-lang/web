> **Advarsel:** Denne dokumentasjonen er opprettet og oversatt av kunstig intelligens (KI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Håndbok

> **Revidert for v0.0.5 — 2026-05-12**

**Zymbol-Lang** er et symbolsk programmeringsspråk. Ingen nøkkelord — alt er et symbol. Fungerer identisk på ethvert menneskespråk.

- Ingen `if`, `while`, `return` — bare `?`, `@`, `<~`
- Full Unicode — identifikatorer på ethvert språk eller emoji
- Menneskespråksuavhengig — koden er den samme overalt

**Tolkversjon**: v0.0.5 | **Testdekning**: 436/436 (TW ↔ VM paritet)

---

## Variabler & Konstanter

```zymbol
x = 10              // muterbar variabel
PI := 3.14159       // konstant — ny tildeling er en kjørefeil
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

`°` (gradtegn, U+00B0) initialiserer automatisk en variabel til sin nøytrale verdi ved første bruk:

```zymbol
tall = [3, 1, 4, 1, 5]
@ n:tall {
    °total += n    // auto-init til 0 over løkken; overlever etter @
}
>> total ¶         // → 14
```

> `°x` (prefiks) forankrer over løkken — resultatet er tilgjengelig etter `@`.
> `x°` (suffiks) forankrer inni løkken — forsvinner når løkken slutter.
> Bare tregjennomgang.

---

## Datatyper

| Type | Literal | `#?`-tag | Merknader |
|------|---------|----------|-----------|
| Heltall | `42`, `-7` | `###` | 64-bit fortegnet |
| Desimaltall | `3.14`, `1.5e10` | `##.` | Vitenskapelig notasjon OK |
| Tekst | `"tekst"` | `##"` | Interpolering: `"Hei {navn}"` |
| Tegn | `'A'` | `##'` | Enkelt Unicode-tegn |
| Boolsk | `#1`, `#0` | `##?` | IKKE numerisk — `#1 ≠ 1` |
| Tabell | `[1, 2, 3]` | `##]` | Homogene elementer |
| Tuppel | `(a, b)` | `##)` | Posisjonsbasert |
| Navngitt Tuppel | `(x: 1, y: 2)` | `##)` | Navngitte felt |
| Funksjon | navngitt funksjonsreferanse | `##()` | Første klasse; visning `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Første klasse; visning `<lambd/N>` |

```zymbol
// Typeintrospeksjon — returnerer (type, sifre, verdi)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Utdata & Inndata

```zymbol
>> "Hei" ¶                        // ¶ eller \\ for eksplisitt ny linje
>> "a=" a " b=" b ¶               // sammenstilling — flere verdier
>> (tab$#) ¶                      // postfiks-operatorer krever ( ) i >>

<< navn                           // les inn i variabel (ingen oppfordring)
<< "Skriv inn navn: " navn        // med oppfordring
```

> `¶` (AltGr+R på spansk tastatur) og `\\` er likeverdige nye linjer.

---

## TUI-primitiver

Terminalbrukergrensesnitt-operatorer for interaktive programmer. De fleste krever en `>>| { }`-blokk (alternativ skjerm + rå modus).

```zymbol
>>| {
    >>!                             // tøm alternativ skjerm
    >>~ (1, 1, 0, 10) > "Kjører"   // rad 1, kol 1, fg=10 (grønn)
    @~ 1000                         // pause 1 sekund (1000 ms)
    >>~ (2, 1) > "Ferdig."
}
// terminalen gjenopprettes automatisk ved avslutning
```

```zymbol
// Tastetrykk og skjermstørrelse
>>| {
    [rader, kolonner] = >>?              // spørr om skjermstørrelse
    >>~ (1, 1) > "Terminal: " rader " x " kolonner
    <<| tast                             // blokkerende tastetrykk
    >>~ (2, 1) > "Trykket: " tast
}
```

> `>>!` tømmer skjerm. `>>?` returnerer `[rader, kolonner]`. `@~ N` sover N millisekunder.
> `<<|` leser ett tastetrykk (blokkerende); `<<|?` poller uten blokkering (returnerer `'\0'` hvis ingen).
> Posisjonsbasert utdata-tuppel: `(rad, kol, BKS, fg, bg)` — ethvert spor kan utelates med komma (`>>~ (,,, 196) > "rød"`).
> BKS-bitmaske: `1`=Fet, `2`=Kursiv, `4`=Understreket. ANSI 256-fargepalett (`0`=terminalstandard).
> Bare tregjennomgang (unntatt `>>!`, `>>?`, `@~`, `>>~` som også kjører i `--vm`).

---

## Operatorer

```zymbol
// Aritmetikk
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (heltallsdivisjon)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potensering)

// Sammenligning — tildel for å inspisere
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
// To sammenstillingsformer
navn = "Alice"
n = 42

>> "Hei " navn " du har " n ¶        // sammenstilling — i >>
beskr = "Hei {navn}, du har {n}"     // interpolering — overalt
```

```zymbol
s = "Hei Verden"
len = s$#                  // 10
del = s$[1..3]             // "Hei"  (1-basert, slutt inklusiv)
har = s$? "Verden"         // #1
deler = "a,b,c,d"$/ ','    // [a, b, c, d]  (del på skilletegn)
erstat = s$~~["e":"E"]     // "HEi VErdEn"  (erstatt alle)
erstat1 = s$~~["e":"E":1]  // "HEi Verden"  (første N)
linje = "─" $* 20          // "────────────────────"  (gjenta N ganger)
```

> `+` er bare for tall. Bruk `,`, sammenstilling eller interpolering for tekst.

---

## Kontrollflyt

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

> `{ }`-klammere er **påkrevd** selv for en enkelt setning.

---

## Mønstermatching

```zymbol
// Intervaller
poeng = 85
karakter = ?? poeng {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> karakter ¶    // → B

// Tekst
farge = "roed"
kode = ?? farge {
    "roed"   => "#FF0000"
    "groenn" => "#00FF00"
    _        => "#000000"
}

// Sammenligningsmomstre
temp = -5
tilstand = ?? temp {
    < 0  => "is"
    < 20 => "kald"
    < 35 => "varm"
    _    => "het"
}
>> tilstand ¶    // → is

// Setningsform (blokkarmer)
n = -3
?? n {
    0    => { >> "null" ¶ }
    < 0  => { >> "negativ" ¶ }
    _    => { >> "positiv" ¶ }
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

frukter = ["eple", "paere", "drue"]
@ f:frukter { >> f ¶ }        // for-hvert tabell

@ t:"hei" { >> t "-" }
>> ¶                          // → h-e-i-  (for-hvert tekst)

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

// Merket løkke (nestet brudd)
teller = 0
@:ytre {
    teller++
    ? teller >= 3 { @:ytre! }
}
>> teller ¶                    // → 3
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

Funksjoner har **isolert omfang** — de kan ikke lese ytre variabler. Bruk utgangsparametere `<~` til å endre kallervariabeler:

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

> Navngitte funksjoner er **første klasses verdier** — send direkte: `tall$> dobbel`. For innpakking: `x -> fn(x)` er også gyldig.

---

## Lambda & Lukking

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

// Lukking — fanger ytre omfang
faktor = 3
tredobbel = x -> x * faktor
>> tredobbel(7) ¶    // → 21

// Fabrikk
lag_adder(n) { <~ x -> x + n }
legg10_til = lag_adder(10)
>> legg10_til(5) ¶    // → 15

// I tabeller
operasjoner = [x -> x+1, x -> x*2, x -> x*x]
>> operasjoner[3](5) ¶    // → 25
```

---

## Tabeller

Tabeller er **muterbare** og inneholder elementer av **samme type**.

```zymbol
tab = [1, 2, 3, 4, 5]

x = tab[1]      // 1 — tilgang (1-basert: første element)
x = tab[-1]     // 5 — negativ indeks (siste element)
x = tab$#       // 5 — lengde (bruk (tab$#) i >>)

tab = tab$+ 6            // legg til → [1,2,3,4,5,6]
tab2 = tab$+[2] 99       // sett inn ved posisjon 2 (1-basert)
tab3 = tab$- 3           // fjern første forekomst av verdi
tab4 = tab$-- 3          // fjern alle forekomster
tab5 = tab$-[1]          // fjern ved indeks 1 (første element)
tab6 = tab$-[2..3]       // fjern intervall (1-basert, slutt inklusiv)

har = tab$? 3            // #1 — inneholder
pos = tab$?? 3           // [3] — alle indekser for verdi (1-basert)
utsnitt = tab$[1..3]     // [1,2,3] — utsnitt (1-basert, slutt inklusiv)
utsnitt2 = tab$[1:3]     // [1,2,3] — samme, antallbasert syntaks

stigende = tab$^+        // sortert stigende  (bare primitiver)
fallende = tab$^-        // sortert fallende  (bare primitiver)

// Navngitte/posisjonsbaserte tuppel-tabeller — bruk $^ med sammenlignerlambda
db = [(navn: "Carla", alder: 28), (navn: "Ana", alder: 25), (navn: "Bob", alder: 30)]
etter_alder = db$^ (a, b -> a.alder < b.alder)    // stigende etter alder  (<)
etter_navn  = db$^ (a, b -> a.navn > b.navn)       // fallende etter navn (>)
>> etter_alder[1].navn ¶     // → Ana
>> etter_navn[1].navn ¶      // → Carla

// Direkte elementoppdatering (bare tabeller)
tab[1] = 99              // tildel
tab[2] += 5              // sammensatt: +=  -=  *=  /=  %=  ^=

// Funksjonell oppdatering — returnerer ny tabell; originalen uendret
tab2 = tab[2]$~ 99
```

> Alle samlingsoperatorer returnerer en **ny tabell**. Tildel tilbake: `tab = tab$+ 4`.
> `$+` kan kjedes: `tab = tab$+ 5$+ 6$+ 7`. Andre operatorer bruker mellomliggende tildelinger.
> **Indeksering er 1-basert**: `tab[1]` er første element; `tab[0]` er en kjørefeil.
> `$^+` / `$^-` sorterer **primitive tabeller** (tall, tekst). For tuppel-tabeller bruk `$^` med sammenlignerlambda — retning er kodet i lambda (`<` = stigende, `>` = fallende).

**Verdiavtale** — tildeling av en tabell til en annen variabel oppretter en uavhengig kopi:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er upåvirket
```

```zymbol
// Nestede tabeller (1-basert indeksering)
matrise = [[1,2,3],[4,5,6],[7,8,9]]
>> matrise[2][3] ¶    // → 6  (rad 2, kolonne 3)
```

---

## Destrukturering

```zymbol
// Tabell
tab = [10, 20, 30, 40, 50]
[a, b, c] = tab              // a=10  b=20  c=30
[foerste, *rest] = tab       // foerste=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ kaster bort

// Posisjonsbasert tuppel
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Navngitt tuppel
person = (navn: "Ana", alder: 25, by: "Madrid")
(navn: n, alder: a) = person   // n="Ana"  a=25
```

---

## Tuppeler

Tuppeler er **uforanderlige** ordnede beholdere som kan inneholde verdier av **forskjellige typer**.
I motsetning til tabeller kan elementer ikke endres etter opprettelse.

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

**Uforanderlighet** — ethvert forsøk på å endre et tuppel-element er en kjørefeil:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kjørefeil: tuppeler er uforanderlige
// t[1] += 5    // ❌ samme feil
```

For å avlede en endret verdi bruk `$~` (funksjonell oppdatering) — returnerer en **ny** tuppel:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalen uendret
>> t2 ¶    // → (10, 999, 30)

// Navngitt tuppel — gjenoppbygg eksplisitt
person = (navn: "Alice", alder: 25)
eldre  = (navn: person.navn, alder: 26)
>> person.alder ¶    // → 25
>> eldre.alder ¶     // → 26
```

---

## Høyere Ordens Funksjoner

```zymbol
tall = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doblet   = tall$> (x -> x * 2)                // map  → [2,4,6…20]
like     = tall$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = tall$< (0, (acc, x) -> acc + x)     // reduce → 55

// Kjede via mellomliggende
steg1 = tall$| (x -> x > 3)
steg2 = steg1$> (x -> x * x)
>> steg2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Navngitte funksjoner kan sendes direkte til HOF
dobbel(x) { <~ x * 2 }
er_stor(x) { <~ x > 5 }
r = tall$> dobbel      // ✅ direkte referanse
r = tall$| er_stor     // ✅ direkte referanse
```

---

## Pipe-operator

Høyre side krever alltid `_` som plassholder for den piped verdien:

```zymbol
dobbel = x -> x * 2
legg_til = (a, b) -> a + b
oek = x -> x + 1

r1 = 5 |> dobbel(_)          // → 10
r2 = 10 |> legg_til(_, 5)    // → 15
r3 = 5 |> legg_til(2, _)     // → 7

// Kjedet
r = 5 |> dobbel(_) |> oek(_) |> dobbel(_)
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
    >> "annen feil: " _err ¶    // _err inneholder feilmeldingen
} :> {
    >> "kjører alltid" ¶
}
```

| Type | Når |
|------|-----|
| `##Div` | Divisjon med null |
| `##IO` | Fil / system |
| `##Index` | Indeks utenfor grenser |
| `##Type` | Typemismatch |
| `##Parse` | Dataparsing |
| `##Network` | Nettverksfeil |
| `##_` | Enhver feil (fang-alt) |

---

## Moduler

```zymbol
// lib/kalkulator.zy — modulkroppen er omsluttet i klammere
# kalkulator {
    #> { legg_til, get_PI }

    _PI := 3.14159
    legg_til(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/kalkulator => k    // alias påkrevd

>> k::legg_til(5, 3) ¶     // → 8
pi = k::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksporter med et annet offentlig navn
# mittbibliotek {
    #> { _intern_legg_til => sum }

    _intern_legg_til(a, b) { <~ a + b }
}
```

```zymbol
<# ./mittbibliotek => m

>> m::sum(3, 4) ¶    // → 7  (det interne navnet _intern_legg_til er skjult)
```

> **Modulregler**: bare `#>`, funksjonsdefinisioner og bokstavelige variabel-/konstantinitialiserere er tillatt i `# navn { }`. Kjørbare setninger (`>>`, `<<`, løkker, etc.) gir feil E013.

---

## Tallsystemer

Zymbol kan vise tall i **69 Unicode-siferskrifter** — Devanagari, arabisk-indisk, thai, Klingon pIqaD, matematisk fet, LCD-segmenter og mer. Den aktive modusen påvirker bare `>>`-utdata; intern aritmetikk er alltid binær.

### Aktivere et skrift

Skriv `0`- og `9`-sifferet for målskriften omgitt av `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisk-indisk (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tilbakestill til ASCII
```

### Utdata og boolske verdier

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimaltegn alltid ASCII)
>> 1 + 2 ¶      // → ३

// Boolske verdier: #-prefiks alltid ASCII, siffer tilpasser seg
>> #1 ¶         // → #१   (sann i Devanagari)
>> #0 ¶         // → #०   (usann — adskilt fra ०  heltallsnull)

x = 28 > 4
>> x ¶          // → #१   (sammenligningsresultat følger aktiv modus)
```

### Innfødde sifferliteraler i kildekode

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

`#` + siffer `0` eller `1` fra ethvert blokk er en gyldig boolsk literal:

```zymbol
#٠٩#
aktiv = #١        // samme som #1
>> aktiv ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` er **alltid ASCII**. `#0` (usann) er alltid visuelt adskilt fra `0` (heltallsnull) i ethvert skrift.

---

## Dataoperatorer

```zymbol
// Typekonverteringscast
f = ##.42         // → 42.0  (til Desimaltall)
i = ###3.7        // → 4     (til Heltall, rund)
t = ##!3.7        // → 3     (til Heltall, avskjær)

// Parse tekst til tall
v1 = #|"42"|      // → 42  (Heltall)
v2 = #|"3.14"|    // → 3.14  (Desimaltall)
v3 = #|"abc"|     // → "abc"  (feilsikker, ingen feil)

// Avrunding / avskjæring
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rund til 2 desimaler)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (avskjær)

// Tallformatering
fmt = #,|1234567|  // → 1,234,567  (kommaseparert)
sci = #^|12345.678|    // → 1.2345678e4  (vitenskapelig)

// Basisliteraler
a = 0x41         // → 'A'  (heks)
b = 0b01000001   // → 'A'  (binær)
c = 0o101        // → 'A'  (oktal)

// Basiskonverteringsutdata
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-integrasjon

```zymbol
dato = <\ date +%Y-%m-%d \>     // fanger stdout (inkluderer avsluttende \n)
>> "I dag: " dato

fil = "data.txt"
innhold = <\ cat {fil} \>       // interpolering i kommandoer

utdata = </"./underscript.zy"/> // kjør et annet Zymbol-skript, fang utdata
>> utdata
```

> `><` fanger CLI-argumenter som en tekst-tabell (bare tregjennomgang).

---

## Fullstendig Eksempel: FizzBuzz

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
| `<<` | inndata | `$-` | fjern første etter verdi |
| `¶` / `\\` | ny linje | `$--` | fjern alle etter verdi |
| `?` | hvis | `$-[i]` | fjern ved indeks (1-basert) |
| `_?` | ellers-hvis | `$-[i..j]` | fjern intervall (1-basert) |
| `_` | ellers / wildcard | `$?` | inneholder |
| `??` | matching | `$??` | finn alle indekser (1-basert) |
| `@` | løkke | `$[s..e]` | utsnitt (1-basert) |
| `@ N { }` | N-ganger-løkke | `$>` | map |
| `@!` | bryt | `$\|` | filter |
| `@>` | fortsett | `$<` | reduce |
| `@:navn { }` | merket løkke | `$/ delim` | tekst splitt |
| `@:navn!` | bryt merke | `$++ a b c` | sammenslå bygg |
| `@:navn>` | fortsett merke | `tab[i>j>k]` | navigasjonsindeks |
| `->` | lambda | `tab[i] = val` | oppdater element (bare tabeller) |
| `tab[i] += val` | sammensatt oppdatering | `tab[i]$~` | funksjonell oppdatering (ny kopi) |
| `$^+` | sorter stigende (primitiver) | `$^-` | sorter fallende (primitiver) |
| `$^` | sorter med sammenligner (tuppeler) | `<~` | returner |
| `\|>` | pipe | `!?` | prøv |
| `:!` | fang | `:>` | til slutt |
| `#1` | sann | `#0` | usann |
| `$!` | er feil | `$!!` | spred feil |
| `<#` | importer | `#>` | eksporter |
| `#` | deklarer modul | `::` | modulkall |
| `.` | felttilgang | `#?` | typemetadata |
| `#\|..\|` | parse tall | `##.` | cast til Desimaltall |
| `###` | cast til Heltall (rund) | `##!` | cast til Heltall (avskjær) |
| `#.N\|..\|` | rund | `#!N\|..\|` | avskjær |
| `#,\|..\|` | kommaformat | `#^\|..\|` | vitenskapelig |
| `#d0d9#` | tallsystemskifte | `#09#` | tilbakestill til ASCII |
| `<\ ..\>` | shell-kjør | `>\<` | CLI-argumenter |
| `\ var` | eksplisitt ødelegg variabel | `°x` / `x°` | varm definisjon (auto-init) |
| `>>|` | TUI-blokk (alternativ skjerm) | `>>~` | posisjonsbasert utdata |
| `>>!` | tøm skjerm | `>>?` | spørr om skjermstørrelse |
| `<<\|` | blokkerende tastetrykk | `<<\|?` | ikke-blokkerende tastetrykk |
| `@~ N` | sov N millisekunder | `$*` | gjenta tekst N ganger |

---

## Versjons-Changelog

### v0.0.5 — TUI-primitiver, Varm Definisjon & Tekstgjentagelse _(Mai 2026)_

- **Brytende** Match-arm-skilletegn: `mønster : resultat` → `mønster => resultat`
- **Brytende** Import-alias: `<# sti <= alias` → `<# sti => alias`
- **Brytende** Eksport-omdøping: `#> { fn <= pub }` → `#> { fn => pub }`
- **Lagt til** TUI-blokk `>>| { }` — alternativ skjerm + rå modus; rydder opp ved avslutning
- **Lagt til** Posisjonsbasert utdata `>>~ (rad, kol, BKS, fg, bg) > elementer` — glisne spor, ANSI 256-farger
- **Lagt til** Tastinndata `<<| var` (blokkerende) og `<<|? var` (ikke-blokkerende poll)
- **Lagt til** `>>!` tøm skjerm, `>>?` spørr om skjermstørrelse, `@~ N` sov N millisekunder
- **Lagt til** Varm definisjon `°x` / `x°` — auto-initialiser variabel ved første bruk i løkker
- **Lagt til** Tekstgjentagelse `str $* N` — gjenta en tekst N ganger
- **VM** Paritet: 436/436 tester bestått

### v0.0.4 — 1-Basert Indeksering, Første Klasses Funksjoner & Modulblokker _(April 2026)_

- **Brytende** All indeksering byttet til **1-basert** — `tab[1]` er første element; `tab[0]` er en kjørefeil
- **Lagt til** Navngitte funksjoner er **første klasses verdier** — send direkte til HOF: `tall$> dobbel`
- **Lagt til** Modul-**blokksyntaks** påkrevd: `# navn { ... }` — flat syntaks fjernet
- **Lagt til** Multi-dimensjonal indeksering: `tab[i>j>k]` (navigasjon), `tab[p ; q]` (flat uttrekk)
- **Lagt til** Typekonverteringscast: `##.expr` (Desimaltall), `###expr` (Heltall rund), `##!expr` (Heltall avskjær)
- **Lagt til** Tekstsplitt: `str$/ delim` — returnerer `Tabell(Tekst)`
- **Lagt til** Sammenslå bygg: `basis$++ a b c` — legger til flere elementer
- **Lagt til** N-ganger-løkke: `@ N { }` — gjenta nøyaktig N ganger
- **Lagt til** Merket løkkesyntaks: `@:navn { }`, `@:navn!`, `@:navn>` — erstatter `@ @navn` / `@! navn`
- **Lagt til** Variabelomfangsregler: `_navn`-variabler har nøyaktig blokkereomfang; `\ var` ødelegger tidlig
- **Lagt til** Match-sammenligningsmomstre: `< 0 :`, `> 5 :`, `== 42 :` osv.
- **Lagt til** Modul E013-feil: kjørbare setninger i modulkropp er forbudt
- **Rettet** `take_variable` korrupterer ikke lenger modulkonstanter ved tilbakeskrivning
- **Rettet** `alias.CONST` løses nå korrekt; `#>` kan vises etter funksjonsdefinisioner
- **VM** Full paritet: 393/393 tester bestått

### v0.0.3 — Unicode Tallsystemer & LSP-forbedringer _(April 2026)_

- **Lagt til** 69 Unicode-siferblokker med modusbytte-token `#d0d9#`
- **Lagt til** Boolske literaler i ethvert skrift — `#१` / `#०`, `#١` / `#٠`, osv.
- **Lagt til** Klingon pIqaD-sifre (CSUR PUA U+F8F0–U+F8F9)
- **Lagt til** `SetNumeralMode` VM-opkode — full paritet med tregjennomgang
- **Lagt til** REPL respekterer aktiv tallmodus i ekko og variabelvisning
- **Endret** Boolsk `>>`-utdata inkluderer nå `#`-prefiks (`#0` / `#1`) i alle moduser

### v0.0.2_01 — Operatøromdøping _(30 Mar 2026)_

- **Endret** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — konsistent med `#`-formatprefiks-familie
- **Lagt til** Eksportalias: re-eksporter modulmedlemmer under et annet navn

### v0.0.2 — Samlings-API-redesign & Installasjonsprogrammer _(24 Mar 2026)_

- **Lagt til** Samlet `$`-operatorfamilie for tabeller og tekst (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lagt til** Destruktureringsopdrag for tabeller, tuppeler og navngitte tuppeler
- **Lagt til** Negative indekser (`tab[-1]` = siste element)
- **Lagt til** Native installasjonsprogrammer — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Lagt til** Sammensatt tildeling `^=`
- **Rettet** Parser-aritmetiske kanttilfeller; dokumentasjonsrettelser

### v0.0.1 — Første Offentlige Utgivelse _(22 Mar 2026)_

- Tregjennomgangstolk + register-VM (`--vm`, ~4× raskere, ~95% paritet)
- Alle kjernestrukturer: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Full Unicode-identifikatorer, modulsystem, lambdas, lukkinger, feilhåndtering
- REPL, LSP, VS Code-utvidelse, formatering (`zymbol fmt`)

---

_Zymbol-Lang — Symbolsk. Universelt. Uforanderlig._
