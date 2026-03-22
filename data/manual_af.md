# Zymbol-Lang Kompakte Handleiding

**Zymbol-Lang** is 'n simboliese programmeertaal. Dit gebruik geen sleutelwoorde nie — alles is 'n simbool. Dit werk dieselfde in enige menslike taal.

---

## Filosofie

- Geen sleutelwoorde nie (`as`, `lus`, `gee terug` bestaan nie — slegs simbole `?`, `@`, `<~`)
- Volledige Unicode — identifiseerders in enige taal of emoji 👋
- Menslike-taal-agnosties — die kode is identies in elke taal

---

## Veranderlikes en Konstantes

```zymbol
x = 10           // veranderlike (veranderbaar)
PI := 3.14159    // konstante (onveranderbaar — fout as heraangewer)
naam = "Ana"
aktief = #1      // boole-waarde waar
👋 := "Hallo"
```

### Saamgestelde Toewysing

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

---

## Uitvoer en Invoer

```zymbol
// Uitvoer — voeg NIE outomaties 'n nuwe reël by nie
>> "Hallo, Wêreld!" ¶                  // ¶ of \\ gee eksplisiete nuwe reël
>> "a=" a " b=" b ¶                    // verskeie waardes langs mekaar
>> "som=" add(2, 3) ¶                  // funksie-oproepe in enige posisie
>> (vrugte$#) ¶                        // postfix-operatore vereis hakies

// Invoer
<< naam                                // geen kennisgewing — lees in veranderlike
<< "Jou naam? " naam                   // met kennisgewing
```

> `¶` of `\\` is gelykwaardig as nuwe reël.

---

## Snaarsaamvoeging

Drie geldige vorms — elk vir sy konteks:

```zymbol
naam = "Ana"
nommer = 25

// 1. Komma — in toewysings met = of :=
boodskap = "Hallo ", naam, "!"              // → Hallo Ana!
TITEL := "Gebruiker: ", naam

// 2. Langs mekaar — in >> uitvoer
>> "Hallo " naam " jy is " nommer ¶         // → Hallo Ana jy is 25

// 3. Interpolasie — in enige konteks
beskrywing = "Hallo {naam}, jy is {nommer}" // → Hallo Ana, jy is 25
```

> **Nota**: `+` is slegs vir getalle. Om dit met strings te gebruik genereer 'n waarskuwing.

---

## Beheersvloei

```zymbol
x = 7

// Eenvoudige as
? x > 0 { >> "positief" ¶ }

// as / anders-as / anders
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

Blokke `{ }` is **verpligtend** selfs vir 'n enkele reël.

---

## Passing

```zymbol
// Passing met reekse
punte = 85
beoordeling = ?? punte {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> beoordeling ¶    // → B

// Passing met wagte (arbitrêre toestande)
temperatuur = -5
toestand = ?? temperatuur {
    _? temperatuur < 0  : "ys"
    _? temperatuur < 20 : "koud"
    _? temperatuur < 35 : "warm"
    _                   : "warm"
}
>> toestand ¶    // → ys

// Passing met strings
kleur = "rooi"
kode = ?? kleur {
    "rooi"  : "#FF0000"
    "groen" : "#00FF00"
    _       : "#000000"
}
>> kode ¶
```

---

## Lusse

```zymbol
// Ingeslote reeks: 0..4 itereer 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Reeks met stap
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Omgekeerde reeks
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Terwyl
nommer = 1
@ nommer <= 64 { nommer *= 2 }
>> nommer ¶    // → 128

// Vir-elke oor skikking
vrugte = ["appel", "peer", "druiwe"]
@ f:vrugte { >> f ¶ }

// Oor string-karakters
@ c:"hallo" { >> c "-" }
>> ¶    // → h-a-l-l-o-

// Break en Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> gaan voort
    ? i > 7 { @! }          // @! breek
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funksies

```zymbol
// Verklaring en oproep
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

// Rekursie
verdubbeld(n) {
    ? n <= 1 { <~ 1 }
    <~ n * verdubbeld(n - 1)
}
>> verdubbeld(5) ¶    // → 120

// Funksies het geïsoleerde omvang — geen toegang tot buite-veranderlikes nie
globaal = 100
toets() {
    x = 42    // slegs plaaslik
    <~ x
}
>> toets() ¶    // → 42
```

> **Belangrik**: Benoemde funksies `naam(params){ }` is nie eerste-klas-waardes nie.
> Om as argument te slaag, omhul: `x -> naam(x)`.

---

## Lambdas en Sluitings

```zymbol
// Eenvoudige lambda (implisiete terugkeer)
verdubbeld = x -> x * 2
som = (a, b) -> a + b
>> verdubbeld(5) ¶    // → 10
>> som(3, 7) ¶        // → 10

// Blok-lambda (eksplisiete terugkeer)
klassifiseer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}
>> klassifiseer(5) ¶     // → positief
>> klassifiseer(0) ¶     // → nul
>> klassifiseer(-5) ¶    // → negatief

// Sluitings — lambdas vang buite-omvang-veranderlikes
faktor = 3
verdriedubbeld = x -> x * faktor    // vang 'faktor'
>> verdriedubbeld(7) ¶    // → 21

// Funksie-fabriek
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas as waardes: stoor in skikkings
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Skikkings

```zymbol
arr = [10, 20, 30, 40, 50]

// Toegang (0-gebaseerde indeks)
>> arr[0] ¶    // → 10

// Lengte (vereis hakies in >>)
nommer = arr$#
>> (arr$#) ¶    // → 5

// Byvoeg, verwyder, bevat, sny
arr = arr$+ 60               // byvoeg
arr = arr$- 0                // verwyder indeks 0
het = arr$? 30               // → #1
sny = arr$[0..2]             // [20, 30]

// Dateer element op
arr[1] = 99

// Vir-elke
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` gee 'n **nuwe skikking** terug — wys terug toe: `arr = arr$+ 4`.
> Geen ketting nie: gebruik twee afsonderlike toewysings.

---

## Tuples

```zymbol
// Benoemde tuple
persoon = (name: "Alice", age: 25)
>> persoon.name ¶    // → Alice
>> persoon.age ¶     // → 25
>> persoon[0] ¶      // → Alice (indeks werk ook)
```

---

## Hoër-orde Funksies

HOF-operatore vereis **inlyn lambda** — nie 'n direkte lambda-veranderlike nie.

```zymbol
getalle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Kaart ($>)
verdubbelde = getalle$> (x -> x * 2)
>> verdubbelde ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
ewe = getalle$| (x -> x % 2 == 0)
>> ewe ¶    // → [2, 4, 6, 8, 10]

// Verminder ($<) — (aanvanklike, (versameling, element) -> uitdr)
totaal = getalle$< (0, (acc, x) -> acc + x)
>> totaal ¶    // → 55
```

---

## Fouthantering

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deling deur nul" ¶
} :! ##IO {
    >> "IO-fout" ¶
} :! {
    >> "ander fout: " _err ¶
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
// Lêer: lib/calc.zy
# calc

#> { add, get_PI }    // uitvoer VOOR definisies

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Lêer: main.zy
<# ./lib/calc <= c    // alias verpligtend

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Volledige Voorbeeld: FizzBuzz

```zymbol
klassifiseer(nommer) {
    ? nommer % 15 == 0 { <~ "BorrelGonser" }
    _? nommer % 3  == 0 { <~ "Borrel" }
    _? nommer % 5  == 0 { <~ "Gonser" }
    _ { <~ nommer }
}

@ i:1..20 { >> klassifiseer(i) ¶ }
```

---

## Simbolverwysing

| Simbool  | Operasie           | Simbool    | Operasie            |
|----------|--------------------|------------|---------------------|
| `=`      | veranderlike       | `$#`       | lengte              |
| `:=`     | konstante          | `$+`       | byvoeg              |
| `>>`     | uitvoer            | `$-`       | verwyder (indeks)   |
| `<<`     | invoer             | `$?`       | bevat               |
| `¶`/`\`  | nuwe reël          | `$[s..e]`  | sny                 |
| `?`      | as                 | `$>`       | kaart               |
| `_?`     | anders-as          | `$\|`      | filter              |
| `_`      | anders / wildkaart | `$<`       | verminder           |
| `??`     | passing            | `!?`       | probeer             |
| `@`      | lus                | `:!`       | vang                |
| `@!`     | breek              | `:>`       | ten slotte          |
| `@>`     | gaan voort         | `$!`       | is fout             |
| `->`     | lambda             | `$!!`      | versprei fout       |
| `<~`     | gee terug          | `#`        | verklaar module     |
| `\|>`    | pyp                | `#>`       | uitvoer             |
| `#1`     | waar               | `<#`       | invoer              |
| `#0`     | onwaar             | `::`       | module-oproep       |

---

*Zymbol-Lang — Simbolies. Universeel. Onveranderlik.*

---

> **Vrywaring:** Hierdie dokumentasie is deur kunsmatige intelligensie (KI) geskep en vertaal. Alle pogings is aangewend om akkuraatheid te verseker, maar sommige vertalings of voorbeelde kan foute bevat. Die gesaghebbende verwysing is die [Zymbol-Lang spesifikasie](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
