# Zymbol-Lang Kompakte Handleiding

**Zymbol-Lang** is 'n simboliese programmeertaal. Dit gebruik geen sleutelwoorde nie — alles is 'n simbool. Dit werk dieselfde in enige menslike taal.

- Geen sleutelwoorde nie (`as`, `lus`, `gee terug` bestaan nie — slegs simbole `?`, `@`, `<~`)
- Volledige Unicode — identifiseerders in enige taal of emoji 👋
- Menslike-taal-agnosties — die kode is identies in elke taal

---

## Veranderlikes en Konstantes

```zymbol
x = 10              // veranderlike (veranderbaar)
PI := 3.14159       // konstante — fout as heraangewer
naam = "Ana"
aktief = #1         // boole-waarde waar
👋 := "Hallo"
```

```zymbol
x = 10
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

## Datatipes

| Tipe          | Voorbeeld           | `#?` Simbool | Notas                               |
|---------------|---------------------|--------------|-------------------------------------|
| Heelgetal     | `42`, `-7`          | `###`        | 64-bit met teken                    |
| Drywende punt | `3.14`, `1.5e10`    | `##.`        | Wetenskaplike notasie OK            |
| String        | `"hallo"`           | `##"`        | Interpolasie: `"Hallo {naam}"`      |
| Karakter      | `'A'`               | `##'`        | Een Unicode-karakter                |
| Boole         | `#1`, `#0`          | `##?`        | NIE numeries 1 en 0 nie             |
| Skikking      | `[1, 2, 3]`         | `##]`        | Alle elemente moet dieselfde tipe wees |
| Tuple         | `(a, b)`            | `##)`        | Posisioneel                         |
| Benoemde Tuple | `(x: 1, y: 2)`     | `##)`        | Toegang per naam of indeks          |

```zymbol
// Tipe-introspeksie — gee (tipe, syfers, waarde) terug
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Uitvoer en Invoer

```zymbol
>> "Hallo, Wêreld!" ¶                  // ¶ of \\ gee eksplisiete nuwe reël
>> "a=" a " b=" b ¶                    // verskeie waardes langs mekaar
>> (vrugte$#) ¶                        // postfix-operatore vereis hakies

<< naam                                // geen kennisgewing — lees in veranderlike
<< "Jou naam? " naam                   // met kennisgewing
```

> `¶` of `\\` is gelykwaardig as nuwe reël.

---

## Operateurs

```zymbol
// Rekenkunde — gebruik toewysings; sommige operateurs het afwykings direk in >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (heelgetaldeling)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (magsverheffing)

// Vergelyking
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logies
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Karakterreekse

```zymbol
// Drie saamvoegingsvorms
naam = "Ana"
n = 42

boodskap = "Hallo ", naam, "!"            // komma — in toewysings
>> "Hallo " naam " jy het " n ¶           // langs mekaar — in >>
beskrywing = "Hallo {naam}, jy het {n}"   // interpolasie — oral
```

```zymbol
s = "Hallo Wêreld"
len = s$#                  // 11
sub = s$[0..5]             // "Hallo"  (end eksklusief)
het = s$? "Wêreld"         // #1
dele = "a,b,c,d" / ','     // [a, b, c, d]
rep = s$~~["l":"L"]        // "HaLLo WêreLd"
rep1 = s$~~["l":"L":1]     // "HaLlo Wêreld"  (eerste N slegs)
```

> `+` is slegs vir getalle. Gebruik `,`, langs mekaar, of interpolasie vir strings.

---

## Beheersvloei

```zymbol
x = 7

? x > 0 { >> "positief" ¶ }

? x > 100 {
    >> "groot" ¶
} _? x > 0 {
    >> "positief" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "negatief" ¶
}
```

> Blokke `{ }` is **verpligtend** selfs vir 'n enkele reël.

---

## Passing

```zymbol
// Reekse
punte = 85
beoordeling = ?? punte {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> beoordeling ¶    // → B

// Strings
kleur = "rooi"
kode = ?? kleur {
    "rooi"  : "#FF0000"
    "groen" : "#00FF00"
    _       : "#000000"
}

// Wagte
temperatuur = -5
toestand = ?? temperatuur {
    _? temperatuur < 0  : "ys"
    _? temperatuur < 20 : "koud"
    _? temperatuur < 35 : "warm"
    _                   : "baie warm"
}
>> toestand ¶    // → ys

// Stellingvorm (blokarme)
?? n {
    0       : { >> "nul" ¶ }
    _? n < 0: { >> "negatief" ¶ }
    _       : { >> "positief" ¶ }
}
```

---

## Lusse

```zymbol
@ i:0..4  { >> i " " }        // reeks ingesluit: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // met stap: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omgekeerd: 5 4 3 2 1 0

nommer = 1
@ nommer <= 64 { nommer *= 2 }
>> nommer ¶                   // → 128  (terwyl)

vrugte = ["appel", "peer", "druiwe"]
@ f:vrugte { >> f ¶ }

@ c:"hallo" { >> c "-" }
>> ¶                          // → h-a-l-l-o-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> gaan voort
    ? i > 7 { @! }             // @! breek
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Oneindige lus
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Gemerkte lus (geneste breek)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Funksies

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

faktoriaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriaal(n - 1)
}
>> faktoriaal(5) ¶    // → 120
```

Funksies het **geïsoleerde omvang** — hulle kan nie buite-veranderlikes lees nie. Gebruik uitvoerparameters `<~` om aanroeperveranderlikes te wysig:

```zymbol
ruil(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
ruil(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Benoemde funksies is nie eerste-klas-waardes nie. Om as argument te slaag, omhul: `x -> fn(x)`.

---

## Lambdas en Sluitings

```zymbol
verdubbeld = x -> x * 2
som = (a, b) -> a + b
>> verdubbeld(5) ¶    // → 10
>> som(3, 7) ¶        // → 10

// Blok-lambda
klassifiseer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}

// Sluiting — vang buite-omvang
faktor = 3
verdriedubbeld = x -> x * faktor
>> verdriedubbeld(7) ¶    // → 21

// Funksie-fabriek
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In skikkings
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Skikkings

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — toegang (0-gebaseer)
arr[-1]         // 5 — negatiewe indeks (laaste)
arr$#           // 5 — lengte (gebruik (arr$#) in >>)

arr = arr$+ 6            // byvoeg → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // invoeg by indeks 2
arr3 = arr$- 3           // verwyder eerste voorkoms van waarde
arr4 = arr$-- 3          // verwyder alle voorkomste
arr5 = arr$-[0]          // verwyder by indeks
arr6 = arr$-[1..3]       // verwyder reeks (end eksklusief)

het = arr$? 3            // #1 — bevat
pos = arr$?? 3           // [2] — alle indekse van waarde
sny = arr$[0..3]         // [1,2,3] — sny (end eksklusief)
sny2 = arr$[0:3]         // [1,2,3] — telling-gebaseerde sintaksis

op = arr$^+              // gesorteer oplopend (slegs primitiewe)
af = arr$^-              // gesorteer aflopend (slegs primitiewe)

// Benoemde/posisionele tuple-skikkings — gebruik $^ met vergelykings-lambda
db = [(naam: "Carla", ouderdom: 28), (naam: "Ana", ouderdom: 25), (naam: "Bob", ouderdom: 30)]
per_ouderdom = db$^ (a, b -> a.ouderdom < b.ouderdom)
per_naam     = db$^ (a, b -> a.naam > b.naam)
>> per_ouderdom[0].naam ¶     // → Ana
>> per_naam[0].naam ¶         // → Carla

arr[1] = 99               // opdateer in-plek
arr = arr[1]$~ 99         // funksionele opdatering — gee nuwe skikking terug
```

> Alle versamelingsoperateurs gee 'n **nuwe skikking** terug. Wys terug toe: `arr = arr$+ 4`.
> Operateurs kan nie geketting word nie — gebruik tussentoewysings.
> `$^+` / `$^-` sorteer **primitiewe skikkings**. Vir tuple-skikkings gebruik `$^` met 'n vergelykings-lambda.

```zymbol
// Geneste skikkings
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[1][2] ¶    // → 6
```

---

## Destrukturering

```zymbol
// Skikking
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eerste, *res] = arr         // eerste=10  res=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ verwyder

// Posisionele tuple
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Benoemde tuple
persoon = (naam: "Ana", ouderdom: 25, stad: "Kaapstad")
(naam: n, ouderdom: o) = persoon  // n="Ana"  o=25
```

---

## Tuples

```zymbol
// Posisioneel
punt = (10, 20)
>> punt[0] ¶    // → 10

// Benoem
persoon = (naam: "Alice", ouderdom: 25)
>> persoon.naam ¶    // → Alice
>> persoon[0] ¶      // → Alice (indeks werk ook)

// Geneste
pos = (x: 10, y: 20)
p = (pos: pos, etiket: "oorsprong")
>> p.pos.x ¶        // → 10
```

---

## Hoër-orde Funksies

> HOF-operatore vereis **inlyn lambda** — nie 'n direkte lambda-veranderlike nie.

```zymbol
getalle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdubbelde  = getalle$> (x -> x * 2)                // map  → [2,4,6…20]
ewe          = getalle$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totaal       = getalle$< (0, (acc, x) -> acc + x)     // reduce → 55

// Ketting via tussentoewysings
stap1 = getalle$| (x -> x > 3)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Benoemde funksies binne HOF — omhul in lambda
verdubbel(x) { <~ x * 2 }
r = getalle$> (x -> verdubbel(x))    // ✅
```

---

## Pyp-operator

Die RHS vereis altyd `_` as plaasvervanger vir die geleide waarde:

```zymbol
verdubbeld = x -> x * 2
bytel = (a, b) -> a + b
verhoog = x -> x + 1

5 |> verdubbeld(_)        // → 10
10 |> bytel(_, 5)         // → 15
5 |> bytel(2, _)          // → 7

// Geketend
r = 5 |> verdubbeld(_) |> verhoog(_) |> verdubbeld(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fouthantering

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deling deur nul" ¶
} :! {
    >> "ander fout: " _err ¶    // _err hou die foutboodskap
} :> {
    >> "loop altyd" ¶
}
```

| Tipe        | Wanneer dit voorkom      |
|-------------|--------------------------|
| `##Div`     | Deling deur nul          |
| `##IO`      | Lêer / stelsel           |
| `##Index`   | Indeks buite perke       |
| `##Type`    | Tipefout                 |
| `##Parse`   | Data-ontleding           |
| `##Network` | Netwerkfoute             |
| `##_`       | Enige fout (vang-alles)  |

---

## Modules

```zymbol
// lib/calc.zy
# calc

#> { add, get_PI }    // uitvoer VOOR definisies

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias verpligtend

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Uitvoer met 'n ander openbare naam
# mylib
#> { _internal_add <= som }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::som(3, 4) ¶    // → 7  (interne naam _internal_add is versteek)
```

---

## Data-operateurs

```zymbol
// Ontleed string na nommer
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (misluk veilig, geen fout)

// Afrond / afkap
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rond tot 2 desimale plekke)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (afkap)

// Getalleopmaak
fmt = #,|1234567|      // → 1,234,567  (komma-geskei)
sci = #^|12345.678|    // → 1.2345678e4  (wetenskaplik)

// Basisletterales
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binêr)
c = 0o101        // → 'A'  (oktaal)

// Basisomskakeling
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Skaal-integrasie

```zymbol
datum = <\ date +%Y-%m-%d \>     // vang stdout (sluit afsluitende \n in)
>> "Vandag: " datum

lêer = "data.txt"
inhoud = <\ cat {lêer} \>        // interpolasie in opdragte

uitvoer = </"./subscript.zy"/>   // voer 'n ander Zymbol-skrip uit, vang uitvoer
>> uitvoer
```

> `><` vang CLI-argumente as 'n string-skikking (slegs tree-walker).

---

## Volledige Voorbeeld: FizzBuzz

```zymbol
klassifiseer(nommer) {
    ? nommer % 15 == 0 { <~ "FizzBuzz" }
    _? nommer % 3  == 0 { <~ "Fizz" }
    _? nommer % 5  == 0 { <~ "Buzz" }
    _ { <~ nommer }
}

@ i:1..20 { >> klassifiseer(i) ¶ }
```

---

## Simbolverwysing

| Simbool | Operasie | Simbool | Operasie |
|---------|----------|---------|----------|
| `=` | veranderlike | `$#` | lengte |
| `:=` | konstante | `$+` | byvoeg |
| `>>` | uitvoer | `$+[i]` | invoeg by indeks |
| `<<` | invoer | `$-` | verwyder eerste per waarde |
| `¶` / `\\` | nuwe reël | `$--` | verwyder alle per waarde |
| `?` | as | `$-[i]` | verwyder by indeks |
| `_?` | anders-as | `$-[i..j]` | verwyder reeks |
| `_` | anders / wildkaart | `$?` | bevat |
| `??` | passing | `$??` | vind alle indekse |
| `@` | lus | `$[s..e]` | sny |
| `@!` | breek | `$>` | kaart |
| `@>` | gaan voort | `$\|` | filter |
| `->` | lambda | `$<` | verminder |
| `$^+` | sorteer oplopend (primitiewe) | `$^-` | sorteer aflopend (primitiewe) |
| `$^` | sorteer met vergelyker (tuples) | | |
| `<~` | gee terug | `!?` | probeer |
| `\|>` | pyp | `:!` | vang |
| `#1` | waar | `:>` | ten slotte |
| `#0` | onwaar | `$!` | is fout |
| `<#` | invoer module | `$!!` | versprei fout |
| `#` | verklaar module | `#>` | uitvoer |
| `::` | module-oproep | `.` | veld-toegang |
| `#\|..\|` | ontleed nommer | `#?` | tipe-metadata |
| `#.N\|..\|` | afrond | `#!N\|..\|` | afkap |
| `c\|..\|` | komma-formaat | `e\|..\|` | wetenskaplik |
| `<\ ..\>` | skaal-uitvoering | `>\<` | CLI-argumente |

---

*Zymbol-Lang — Simbolies. Universeel. Onveranderlik.*

> **Vrywaring:** Hierdie dokumentasie is deur kunsmatige intelligensie (KI) geskep en vertaal. Alle pogings is aangewend om akkuraatheid te verseker, maar sommige vertalings of voorbeelde kan foute bevat. Die gesaghebbende verwysing is die [Zymbol-Lang spesifikasie](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
