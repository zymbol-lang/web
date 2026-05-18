> **Kennisgewing:** Hierdie dokumentasie is geskep met die hulp van kunsmatige intelligensie (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Die kanonieke verwysing is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in die interpreteerderbewaarplek.

---

# Zymbol-Lang Handleiding

**Zymbol-Lang** is 'n simboliese programmeertaal. Geen sleutelwoorde nie — alles is 'n simbool. Werk identies in enige menslike taal.

- Geen `if`, `while`, `return` — net `?`, `@`, `<~`
- Volledige Unicode — identifiseerders in enige taal of emoji
- Menslike taal-agnosties — die kode is oral dieselfde

**Interpreteerderversie**: v0.0.4 | **Toetsdekking**: 393/393 (TW ↔ VM pariteit)

---

## Veranderlikes en Konstantes

```zymbol
x = 10              // veranderlike veranderlike
PI := 3.14159       // konstante — heraanwysing is 'n looptydfout
naam = "Alice"
aktief = #1         // Booles waar
👋 := "Hallo"
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

## Datatipes

| Tipe | Literaal | `#?` merker | Notas |
|------|----------|-------------|-------|
| Heelgetal | `42`, `-7` | `###` | 64-bis onderteken |
| Dobbelpunt | `3.14`, `1.5e10` | `##.` | Wetenskaplike notasie toegelaat |
| String | `"teks"` | `##"` | Interpolasie: `"Hallo {naam}"` |
| Karakter | `'A'` | `##'` | Enkel Unicode karakter |
| Booles | `#1`, `#0` | `##?` | NIE numeries nie — `#1 ≠ 1` |
| Skikking | `[1, 2, 3]` | `##]` | Homogene elemente |
| Tuple | `(a, b)` | `##)` | Posisioneel |
| Genoemde tuple | `(x: 1, y: 2)` | `##)` | Genoemde velde |
| Funksie | genoemde funksieverwysing | `##()` | Eerste-klas; wys `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Eerste-klas; wys `<lambd/N>` |

```zymbol
// Tipe introspesie — gee terug (tipe, syfers, waarde)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Uitset en Inset

```zymbol
>> "Hallo" ¶                       // ¶ of \\ vir eksplisiete nuwe lyn
>> "a=" a " b=" b ¶               // jukstaposisie — meervoudige waardes
>> (arr$#) ¶                      // postfix operateurs benodig ( ) binne >>

<< naam                           // lees in veranderlike (sonder prompt)
<< "Voer naam in: " naam          // met prompt
```

> `¶` (AltGr+R op Spaanse sleutelbord) en `\\` is ekwivalent vir nuwe lyn.

---

## Operateurs

```zymbol
// Rekenkundig — gebruik toewysings; sommige operateurs het eienaardighede direk in >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (heelgetal deling)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (eksponensiasie)

// Vergelyking
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Logies
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Stringe

```zymbol
// Twee vervoegingsvorms
naam = "Alice"
n = 42

>> "Hallo " naam " jy het " n ¶       // jukstaposisie — in >>
beskrywing = "Hallo {naam}, jy het {n}" // interpolasie — oral
```

```zymbol
s = "Hallo Wêreld"
lengte = s$#                  // 11
sub = s$[1..5]                // "Hallo"  (basis-1, einde ingesluit)
het = s$? "Wêreld"            // #1
dele = "a,b,c,d"$/ ','        // [a, b, c, d]  (skeiding deur skeidingsteken)
vervang = s$~~["a":"o"]       // "Hollo Wêreld"
vervang1 = s$~~["a":"o":1]    // "Hollo Wêreld"  (slegs eerste N)
```

> `+` is slegs vir getalle. Gebruik `,`, jukstaposisie, of interpolasie vir stringe.

---

## Beheervloei

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

> Krulhakies `{ }` is **verpligtend** selfs vir 'n enkele stelling.

---

## Passings (Match)

```zymbol
// Reekse
telling = 85
graad = ?? telling {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> graad ¶      // → B

// Stringe
kleur = "rooi"
kode = ?? kleur {
    "rooi"   : "#FF0000"
    "groen"  : "#00FF00"
    _        : "#000000"
}

// Vergelykingspatrone
temperatuur = -5
toestand = ?? temperatuur {
    < 0  : "ys"
    < 20 : "koud"
    < 35 : "warm"
    _    : "warm"
}
>> toestand ¶    // → ys

// Stellingvorm (blokke)
?? n {
    0        : { >> "nul" ¶ }
    _? n < 0 : { >> "negatief" ¶ }
    _        : { >> "positief" ¶ }
}
```

---

## Lusse

```zymbol
@ i:0..4  { >> i " " }        // reeks ingesluit:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // met stap:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omgekeerd:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (terwyl)

vrugte = ["appel", "peer", "druif"]
@ v:vrugte { >> v ¶ }         // vir elke element in skikking

@ k:"hallo" { >> k "-" }
>> ¶                          // → h-a-l-l-o-  (vir elke karakter in string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> gaan voort
    ? i > 7 { @! }            // @! breek
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
teller = 0
@:buite {
    teller++
    ? teller >= 3 { @:buite! }
}
>> teller ¶                   // → 3
```

---

## Funksies

```zymbol
optel(a, b) { <~ a + b }
>> optel(3, 4) ¶   // → 7

faktoriaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriaal(n - 1)
}
>> faktoriaal(5) ¶    // → 120
```

Funksies het **geïsoleerde omvang** — hulle kan nie eksterne veranderlikes lees nie. Gebruik uitvoerparameters `<~` om die roeper se veranderlikes te wysig:

```zymbol
ruil(a<~, b<~) {
    tydelik = a
    a = b
    b = tydelik
}
x = 10
y = 20
ruil(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Genoemde funksies is **eerste-klas waardes** — stuur direk: `nums$> verdubbel`. `x -> fn(x)` is ook geldig.

---

## Lambdas en Sluitings

```zymbol
verdubbel = x -> x * 2
optel = (a, b) -> a + b
>> verdubbel(5) ¶   // → 10
>> optel(3, 7) ¶    // → 10

// Blok lambda
klassifiseer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}

// Sluiting — vang eksterne omvang
faktor = 3
verdriedubbel = x -> x * faktor
>> verdriedubbel(7) ¶   // → 21

// Fabriek
maak_teller(n) { <~ x -> x + n }
tien_bymekaar = maak_teller(10)
>> tien_bymekaar(5) ¶    // → 15

// In skikkings
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶        // → 25
```

---

## Skikkings

Skikkings is **veranderbaar** en bevat elemente van **dieselfde tipe**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — toegang (basis-1: eerste element)
arr[-1]         // 5 — negatiewe indeks (laaste element)
arr$#           // 5 — lengte (gebruik (arr$#) in >>)

arr = arr$+ 6            // voeg by → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // voeg in by posisie 2 (basis-1)
arr3 = arr$- 3           // verwyder eerste voorkoms van waarde
arr4 = arr$-- 3          // verwyder alle voorkomste
arr5 = arr$-[1]          // verwyder by indeks 1 (eerste element)
arr6 = arr$-[2..3]       // verwyder reeks (basis-1, einde ingesluit)

het = arr$? 3            // #1 — bevat
posisies = arr$?? 3      // [3] — alle indekse van waarde (basis-1)
sny = arr$[1..3]         // [1,2,3] — sny (basis-1, einde ingesluit)
sny2 = arr$[1:3]         // [1,2,3] — selfde, telling-gebaseerde sintaks

opklimmend = arr$^+      // sorteer opklimmend (slegs primitiewe)
afklimmend = arr$^-      // sorteer afklimmend (slegs primitiewe)

// Skikkings van genoemde/posisionele tuple — gebruik $^ met vergelykingslambda
db = [(naam: "Carla", ouderdom: 28), (naam: "Ana", ouderdom: 25), (naam: "Bob", ouderdom: 30)]
volgens_ouderdom  = db$^ (a, b -> a.ouderdom < b.ouderdom)   // opklimmend volgens ouderdom (<)
volgens_naam    = db$^ (a, b -> a.naam > b.naam)         // afklimmend volgens naam (>)
>> volgens_ouderdom[1].naam ¶   // → Ana
>> volgens_naam[1].naam ¶       // → Carla

// Direkte element opdatering (slegs skikkings)
arr[1] = 99              // wys toe
arr[2] += 5              // saamgesteld: +=  -=  *=  /=  %=  ^=

// Funksionele opdatering — gee nuwe skikking terug; oorspronklike onveranderd
arr2 = arr[2]$~ 99
```

> Alle versamelingsoperateurs gee **nuwe skikking** terug. Wys weer toe: `arr = arr$+ 4`.
> `$+` kan geketting word: `arr = arr$+ 5$+ 6$+ 7`. Ander operateurs gebruik tussentydse toewysings.
> **Indeksering is basis-1**: `arr[1]` is die eerste element; `arr[0]` is 'n looptydfout.
> `$^+` / `$^-` sorteer **primitiewe skikkings** (getalle, stringe). Vir tuple skikkings gebruik `$^` met vergelykingslambda — rigting is in lambda gekodeer (`<` = opklimmend, `>` = afklimmend).

**Waardesemantiek** — om 'n skikking aan 'n ander veranderlike toe te wys, skep 'n onafhanklike kopie:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b word nie beïnvloed nie
```

```zymbol
// Geneste skikkings (basis-1 indeksering)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (ry 2, kolom 3)
```

---

## Destrukturing

```zymbol
// Skikking
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eerste, *oorblywendes] = arr // eerste=10  oorblywendes=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ vergeet

// Posisionele tuple
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Genoemde tuple
persoon = (naam: "Ana", ouderdom: 25, stad: "Madrid")
(naam: n, ouderdom: o) = persoon   // n="Ana"  o=25
```

---

## Tuples

Tuples is **onveranderlike** geordende houers wat waardes van **verskillende tipes** kan hou.
Anders as skikkings, kan elemente nie verander word na skepping nie.

```zymbol
// Posisioneel — gemengde tipes toegelaat
punt = (10, 20)
>> punt[1] ¶     // → 10

data = (42, "hallo", #1, 3.14)
>> data[3] ¶     // → #1

// Genoemde
persoon = (naam: "Alice", ouderdom: 25)
>> persoon.naam ¶   // → Alice
>> persoon[1] ¶     // → Alice  (indeks werk ook, basis-1)

// Geneste
pos = (x: 10, y: 20)
p = (pos: pos, etiket: "oorsprong")
>> p.pos.x ¶       // → 10
```

**Onveranderlikheid** — enige poging om 'n tuple element te wysig, is 'n looptydfout:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ looptydfout: tuples is onveranderlik
// t[1] += 5    // ❌ selfde fout

// Genoemde tuple — herbou eksplisiet
persoon = (naam: "Alice", ouderdom: 25)
ouer = (naam: persoon.naam, ouderdom: 26)
>> persoon.ouderdom ¶   // → 25
>> ouer.ouderdom ¶      // → 26
```

Om 'n gewysigde waarde te kry, gebruik `$~` (funksionele opdatering) — gee **nuwe** tuple terug:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← oorspronklike onveranderd
>> t2 ¶    // → (10, 999, 30)
```

---

## Hoër-orde Funksies

```zymbol
getalle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdubbeldes = getalle$> (x -> x * 2)                // kaart → [2,4,6…20]
ewe_getalle   = getalle$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
totaal     = getalle$< (0, (akkum, x) -> akkum + x) // verminder → 55

// Ketting deur tussengangers
stap1 = getalle$| (x -> x > 3)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Genoemde funksies kan direk na hoër-orde funksies gestuur word
verdubbel(x) { <~ x * 2 }
is_groot(x) { <~ x > 5 }
r = getalle$> verdubbel       // ✅ direkte verwysing
r = getalle$| is_groot        // ✅ direkte verwysing
```

---

## Pyp operateur

Die regterkant vereis altyd `_` as plekhouer vir die waarde wat gepyp word:

```zymbol
verdubbel = x -> x * 2
optel = (a, b) -> a + b
verhoog = x -> x + 1

5 |> verdubbel(_)        // → 10
10 |> optel(_, 5)        // → 15
5 |> optel(2, _)         // → 7

// Geketting
r = 5 |> verdubbel(_) |> verhoog(_) |> verdubbel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fout hantering

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

| Tipe | Wanneer |
|------|---------|
| `##Div` | Deling deur nul |
| `##IO` | Lêer / stelsel |
| `##Index` | Indeks buite perke |
| `##Type` | Tipe wanverhouding |
| `##Parse` | Data ontleding |
| `##Network` | Netwerk foute |
| `##_` | Enige fout (vang alles) |

---

## Modules

```zymbol
// lib/calc.zy — module liggaam is in krulhakies
# calc {
    #> { optel, get_PI }

    _PI := 3.14159
    optel(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias is verpligtend

>> c::optel(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Eksporteer met 'n ander openbare naam
# my_biblioteek {
    #> { _interne_optel <= som }

    _interne_optel(a, b) { <~ a + b }
}
```

```zymbol
<# ./my_biblioteek <= m

>> m::som(3, 4) ¶    // → 7  (interne naam _interne_optel is versteek)
```

> **Module reëls**: slegs `#>`, funksie definisies, en letterlike veranderlike/konstante initialiseerders word toegelaat binne `# naam { }`. Uitvoerbare stellings (`>>`, `<<`, lusse, ens.) veroorsaak fout E013.

---

## Numeriese Modes

Zymbol kan getalle vertoon in **69 Unicode syferblokke** — Devanagari, Arabies-Indies, Thai, Klingon pIqaD, Wiskundige vet, LCD segmente, en meer. Die aktiewe mode beïnvloed slegs uitset `>>`; interne rekenkunde is altyd binêr.

### Aktiveer 'n skrif

Skryf die `0` en `9` syfers van die teikenskrif binne `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabies-Indies (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // herstel na ASCII
```

### Uitset en Booleans

```zymbol
x = 42
>> x ¶          // → 42   (verstek ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimale punt is altyd ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: # voorvoegsel is altyd ASCII, syfer pas aan
>> #1 ¶         // → #१   (waar in Devanagari)
>> #0 ¶         // → #०   (vals — onderskei van ० heelgetal nul)

x = 28 > 4
>> x ¶          // → #१   (vergelykingsresultaat volg aktiewe mode)
```

### Inheemse syfer literal in bronkode

Enige ondersteunde skrif se syfers is geldige literale — in reekse, modulo, vergelykings:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booles literale in enige skrif

`#` + syfer `0` of `1` van enige blok is 'n geldige Booles literaal:

```zymbol
#०९#
aktief = #१        // dieselfde as #1
>> aktief ¶        // → #१
>> (#१ && #०) ¶    // → #०
```

> `#` is **altyd ASCII**. `#0` (vals) is altyd visueel onderskeibaar van `0` (heelgetal nul) in elke skrif.

---

## Data Operateurs

```zymbol
// Tipe omskakeling
##.42         // → 42.0  (na Dobbelpunt)
###3.7        // → 4     (na Heelgetal, rond af)
##!3.7        // → 3     (na Heelgetal, kap af)

// Ontleed string na getal
v1 = #|"42"|      // → 42  (Heelgetal)
v2 = #|"3.14"|    // → 3.14  (Dobbelpunt)
v3 = #|"abc"|     // → "abc"  (veilig, geen fout)

// Rond af / kap af
pi = 3.14159265
afgerond2 = #.2|pi|     // → 3.14  (rond af na 2 desimale plekke)
afgerond4 = #.4|pi|     // → 3.1416
afgekap2 = #!2|pi|      // → 3.14  (kap af)

// Getal formatering
formaat = #,|1234567|   // → 1,234,567  (komma-geskei)
wetenskaplik = #^|12345.678| // → 1.2345678e4  (wetenskaplik)

// Basis literale
a = 0x41         // → 'A'  (heksadesimaal)
b = 0b01000001   // → 'A'  (binêr)
c = 0o101        // → 'A'  (oktaal)

// Basis omskakeling uitset
heks = 0x|255|    // → "0x00FF"
bin = 0b|65|      // → "0b1000001"
okt = 0o|8|       // → "0o10"
des = 0d|255|     // → "0d0255"
```

---

## Skulp Integrasie

```zymbol
datum = <\ date +%Y-%m-%d \>     // vang stdout (sluit \n aan die einde in)
>> "Vandag: " datum

lêer = "data.txt"
inhoud = <\ cat {lêer} \>        // interpolasie in opdragte

uitset = </"./subscript.zy"/>    // voer nog 'n Zymbol skrip uit, vang uitset
>> uitset
```

> `><` vang CLI argumente as 'n string skikking (slegs boomwandelaar).

---

## Volledige Voorbeeld: FizzBuzz

```zymbol
klassifiseer(getal) {
    ? getal % 15 == 0 { <~ "FizzBuzz" }
    _? getal % 3  == 0 { <~ "Fizz" }
    _? getal % 5  == 0 { <~ "Buzz" }
    _ { <~ getal }
}

@ i:1..20 { >> klassifiseer(i) ¶ }
```

---

## Simbool Verwysing

| Simbool | Operasie | Simbool | Operasie |
|---------|----------|---------|----------|
| `=` | veranderlike | `$#` | lengte |
| `:=` | konstante | `$+` | voeg by (kettingbaar) |
| `>>` | uitset | `$+[i]` | voeg in by indeks (basis-1) |
| `<<` | inset | `$-` | verwyder eerste volgens waarde |
| `¶` / `\\` | nuwe lyn | `$--` | verwyder alle volgens waarde |
| `?` | as | `$-[i]` | verwyder by indeks (basis-1) |
| `_?` | anders as | `$-[i..j]` | verwyder reeks (basis-1) |
| `_` | anders / joker | `$?` | bevat |
| `??` | passing | `$??` | vind alle indekse (basis-1) |
| `@` | lus | `$[s..e]` | sny (basis-1) |
| `@ N { }` | N keer lus | `$>` | kaart |
| `@!` | breek | `$|` | filter |
| `@>` | gaan voort | `$<` | verminder |
| `@:naam { }` | gemerkte lus | `$/ skeidingsteken` | string splitting |
| `@:naam!` | gemerkte breek | `$++ a b c` | konkatenasie bou |
| `@:naam>` | gemerkte gaan voort | `skikking[i>j>k]` | navigasie indeks |
| `->` | lambda | `skikking[i] = waarde` | opdateer element (slegs skikkings) |
| `skikking[i] += waarde` | saamgestelde opdatering | `skikking[i]$~` | funksionele opdatering (nuwe kopie) |
| `$^+` | sorteer opklimmend (primitiewe) | `$^-` | sorteer afklimmend (primitiewe) |
| `$^` | sorteer met vergelyker (tuples) | `<~` | terugkeer |
| `|>` | pyp | `!?` | probeer |
| `:!` | vang | `:>` | uiteindelik |
| `#1` | waar | `#0` | vals |
| `$!` | is fout | `$!!` | versprei fout |
| `<#` | invoer | `#>` | uitvoer |
| `#` | verklaar module | `::` | roep module |
| `.` | veld toegang | `#?` | tipe metadata |
| `#\|..\|` | ontleed getal | `##.` | omskakel na Dobbelpunt |
| `###` | omskakel na Heelgetal (rond af) | `##!` | omskakel na Heelgetal (kap af) |
| `#.N\|..\|` | rond af | `#!N\|..\|` | kap af |
| `#,\|..\|` | komma formaat | `#^\|..\|` | wetenskaplik |
| `#d0d9#` | verander numeriese mode | `#09#` | herstel na ASCII |
| `<\ ..\>` | voer skulp uit | `>\<` | CLI argumente |
| `\ var` | vernietig veranderlike eksplisiet | | |

---

## Vrystelling Verandering Log

### v0.0.4 — Basis-1 Indeksering, Eerste-klas Funksies & Module Blokke _(April 2026)_

- **Brekend** Alle indeksering verander na **basis-1** — `arr[1]` is die eerste element; `arr[0]` is 'n looptydfout
- **Bygevoeg** Genoemde funksies is **eerste-klas waardes** — stuur direk na hoër-orde funksies: `nums$> verdubbel`
- **Bygevoeg** Module **blok sintaksis is verpligtend**: `# naam { ... }` — plat sintaksis verwyder
- **Bygevoeg** Multidimensionele indeksering: `arr[i>j>k]` (navigasie), `arr[p ; q]` (platte onttrekking)
- **Bygevoeg** Tipe omskakeling: `##.uitdrukking` (Dobbelpunt), `###uitdrukking` (Heelgetal rond af), `##!uitdrukking` (Heelgetal kap af)
- **Bygevoeg** String splitting: `str$/ skeidingsteken` — gee terug `Array(String)`
- **Bygevoeg** Konkatenasie bou: `basis$++ a b c` — voeg veelvuldige items by
- **Bygevoeg** N keer lus: `@ N { }` — herhaal presies N keer
- **Bygevoeg** Gemerkte lusse sintaksis: `@:naam { }`, `@:naam!`, `@:naam>` — vervang `@ @naam` / `@! naam`
- **Bygevoeg** Veranderlike omvang reëls: `_naam` veranderlikes het presiese blok omvang; `\ var` vernietig vroeg
- **Bygevoeg** Passing vergelykingspatrone: `< 0 :`, `> 5 :`, `== 42 :` ens.
- **Bygevoeg** Module E013 fout: uitvoerbare stellings in module liggaam word verbied
- **Reggemaak** `take_variable` korrupteer nie meer module konstantes tydens terugskrywing nie
- **Reggemaak** `alias.CONST` word nou korrek opgelos; `#>` kan na funksie definisies verskyn
- **VM** Volledige pariteit: 393/393 toetse slaag

### v0.0.3 — Unicode Syferstelsels & LSP Verbeterings _(April 2026)_

- **Bygevoeg** 69 Unicode syferblokke met mode wissel teken `#d0d9#`
- **Bygevoeg** Booles literale in enige skrif — `#१` / `#०`, `#१` / `#०`, ens.
- **Bygevoeg** Klingon pIqaD syfers (CSUR PUA U+F8F0–U+F8F9)
- **Bygevoeg** `SetNumeralMode` VM opkode — volle pariteit met boomwandelaar
- **Bygevoeg** REPL respekteer aktiewe numeriese mode in eggo en veranderlike vertoning
- **Verander** Booles `>>` uitset sluit nou `#` voorvoegsel (`#0` / `#1`) in alle modes in

### v0.0.2_01 — Operateur Hername _(30 Maart 2026)_

- **Verander** `c|..|` → `#,|..|` en `e|..|` → `#^|..|` — konsekwent met `#` formaat voorvoegsel familie
- **Bygevoeg** Uitvoer alias: her-uitvoer module lede onder 'n ander naam

### v0.0.2 — Versameling API Herontwerp & Installeerders _(24 Maart 2026)_

- **Bygevoeg** Verenigde `$` operateur familie vir skikkings en stringe (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bygevoeg** Destrukturerings toewysing vir skikkings, tuples, en genoemde tuples
- **Bygevoeg** Negatiewe indekse (`arr[-1]` = laaste element)
- **Bygevoeg** Inheemse installeerders — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maart 2026)_

- **Bygevoeg** Saamgestelde toewysing `^=`
- **Reggemaak** Ontleder rekenkundige randgevalle; dokumentasie regstellings

### v0.0.1 — Aanvanklike Openbare Vrystelling _(22 Maart 2026)_

- Boomwandelaar interpreteerder + register VM (`--vm`, ~4× vinniger, ~95% pariteit)
- Alle kern konstrukte: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Volledige Unicode identifiseerders, module stelsel, lambdas, sluitings, fout hantering
- REPL, LSP, VS Code uitbreiding, formateerder (`zymbol fmt`)

---

_Zymbol-Lang — Simbolies. Universeel. Onveranderlik._
``Ja, nou gaan ek **`manual_af.md`** (Afrikaans) vertaal, met die behoud van dieselfde struktuur.

---

## manual_af.md

```markdown
> **Kennisgewing:** Hierdie dokumentasie is geskep met die hulp van kunsmatige intelligensie (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Die kanonieke verwysing is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in die interpreteerderbewaarplek.

---

# Zymbol-Lang Handleiding

**Zymbol-Lang** is 'n simboliese programmeertaal. Geen sleutelwoorde nie — alles is 'n simbool. Werk identies in enige menslike taal.

- Geen `if`, `while`, `return` — net `?`, `@`, `<~`
- Volledige Unicode — identifiseerders in enige taal of emoji
- Menslike taal-agnosties — die kode is oral dieselfde

**Interpreteerderversie**: v0.0.4 | **Toetsdekking**: 393/393 (TW ↔ VM pariteit)

---

## Veranderlikes en Konstantes

```zymbol
x = 10              // veranderlike veranderlike
PI := 3.14159       // konstante — heraanwysing is 'n looptydfout
naam = "Alice"
aktief = #1         // Booles waar
👋 := "Hallo"
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

## Datatipes

| Tipe | Literaal | `#?` merker | Notas |
|------|----------|-------------|-------|
| Heelgetal | `42`, `-7` | `###` | 64-bis onderteken |
| Dobbelpunt | `3.14`, `1.5e10` | `##.` | Wetenskaplike notasie toegelaat |
| String | `"teks"` | `##"` | Interpolasie: `"Hallo {naam}"` |
| Karakter | `'A'` | `##'` | Enkel Unicode karakter |
| Booles | `#1`, `#0` | `##?` | NIE numeries nie — `#1 ≠ 1` |
| Skikking | `[1, 2, 3]` | `##]` | Homogene elemente |
| Tuple | `(a, b)` | `##)` | Posisioneel |
| Genoemde tuple | `(x: 1, y: 2)` | `##)` | Genoemde velde |
| Funksie | genoemde funksieverwysing | `##()` | Eerste-klas; wys `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Eerste-klas; wys `<lambd/N>` |

```zymbol
// Tipe introspesie — gee terug (tipe, syfers, waarde)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Uitset en Inset

```zymbol
>> "Hallo" ¶                       // ¶ of \\ vir eksplisiete nuwe lyn
>> "a=" a " b=" b ¶               // jukstaposisie — meervoudige waardes
>> (arr$#) ¶                      // postfix operateurs benodig ( ) binne >>

<< naam                           // lees in veranderlike (sonder prompt)
<< "Voer naam in: " naam          // met prompt
```

> `¶` (AltGr+R op Spaanse sleutelbord) en `\\` is ekwivalent vir nuwe lyn.

---

## Operateurs

```zymbol
// Rekenkundig — gebruik toewysings; sommige operateurs het eienaardighede direk in >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (heelgetal deling)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (eksponensiasie)

// Vergelyking
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Logies
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Stringe

```zymbol
// Twee vervoegingsvorms
naam = "Alice"
n = 42

>> "Hallo " naam " jy het " n ¶       // jukstaposisie — in >>
beskrywing = "Hallo {naam}, jy het {n}" // interpolasie — oral
```

```zymbol
s = "Hallo Wêreld"
lengte = s$#                  // 11
sub = s$[1..5]                // "Hallo"  (basis-1, einde ingesluit)
het = s$? "Wêreld"            // #1
dele = "a,b,c,d"$/ ','        // [a, b, c, d]  (skeiding deur skeidingsteken)
vervang = s$~~["a":"o"]       // "Hollo Wêreld"
vervang1 = s$~~["a":"o":1]    // "Hollo Wêreld"  (slegs eerste N)
```

> `+` is slegs vir getalle. Gebruik `,`, jukstaposisie, of interpolasie vir stringe.

---

## Beheervloei

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

> Krulhakies `{ }` is **verpligtend** selfs vir 'n enkele stelling.

---

## Passings (Match)

```zymbol
// Reekse
telling = 85
graad = ?? telling {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> graad ¶      // → B

// Stringe
kleur = "rooi"
kode = ?? kleur {
    "rooi"   : "#FF0000"
    "groen"  : "#00FF00"
    _        : "#000000"
}

// Vergelykingspatrone
temperatuur = -5
toestand = ?? temperatuur {
    < 0  : "ys"
    < 20 : "koud"
    < 35 : "warm"
    _    : "warm"
}
>> toestand ¶    // → ys

// Stellingvorm (blokke)
?? n {
    0        : { >> "nul" ¶ }
    _? n < 0 : { >> "negatief" ¶ }
    _        : { >> "positief" ¶ }
}
```

---

## Lusse

```zymbol
@ i:0..4  { >> i " " }        // reeks ingesluit:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // met stap:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omgekeerd:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (terwyl)

vrugte = ["appel", "peer", "druif"]
@ v:vrugte { >> v ¶ }         // vir elke element in skikking

@ k:"hallo" { >> k "-" }
>> ¶                          // → h-a-l-l-o-  (vir elke karakter in string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> gaan voort
    ? i > 7 { @! }            // @! breek
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
teller = 0
@:buite {
    teller++
    ? teller >= 3 { @:buite! }
}
>> teller ¶                   // → 3
```

---

## Funksies

```zymbol
optel(a, b) { <~ a + b }
>> optel(3, 4) ¶   // → 7

faktoriaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriaal(n - 1)
}
>> faktoriaal(5) ¶    // → 120
```

Funksies het **geïsoleerde omvang** — hulle kan nie eksterne veranderlikes lees nie. Gebruik uitvoerparameters `<~` om die roeper se veranderlikes te wysig:

```zymbol
ruil(a<~, b<~) {
    tydelik = a
    a = b
    b = tydelik
}
x = 10
y = 20
ruil(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Genoemde funksies is **eerste-klas waardes** — stuur direk: `nums$> verdubbel`. `x -> fn(x)` is ook geldig.

---

## Lambdas en Sluitings

```zymbol
verdubbel = x -> x * 2
optel = (a, b) -> a + b
>> verdubbel(5) ¶   // → 10
>> optel(3, 7) ¶    // → 10

// Blok lambda
klassifiseer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}

// Sluiting — vang eksterne omvang
faktor = 3
verdriedubbel = x -> x * faktor
>> verdriedubbel(7) ¶   // → 21

// Fabriek
maak_teller(n) { <~ x -> x + n }
tien_bymekaar = maak_teller(10)
>> tien_bymekaar(5) ¶    // → 15

// In skikkings
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶        // → 25
```

---

## Skikkings

Skikkings is **veranderbaar** en bevat elemente van **dieselfde tipe**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — toegang (basis-1: eerste element)
arr[-1]         // 5 — negatiewe indeks (laaste element)
arr$#           // 5 — lengte (gebruik (arr$#) in >>)

arr = arr$+ 6            // voeg by → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // voeg in by posisie 2 (basis-1)
arr3 = arr$- 3           // verwyder eerste voorkoms van waarde
arr4 = arr$-- 3          // verwyder alle voorkomste
arr5 = arr$-[1]          // verwyder by indeks 1 (eerste element)
arr6 = arr$-[2..3]       // verwyder reeks (basis-1, einde ingesluit)

het = arr$? 3            // #1 — bevat
posisies = arr$?? 3      // [3] — alle indekse van waarde (basis-1)
sny = arr$[1..3]         // [1,2,3] — sny (basis-1, einde ingesluit)
sny2 = arr$[1:3]         // [1,2,3] — selfde, telling-gebaseerde sintaks

opklimmend = arr$^+      // sorteer opklimmend (slegs primitiewe)
afklimmend = arr$^-      // sorteer afklimmend (slegs primitiewe)

// Skikkings van genoemde/posisionele tuple — gebruik $^ met vergelykingslambda
db = [(naam: "Carla", ouderdom: 28), (naam: "Ana", ouderdom: 25), (naam: "Bob", ouderdom: 30)]
volgens_ouderdom  = db$^ (a, b -> a.ouderdom < b.ouderdom)   // opklimmend volgens ouderdom (<)
volgens_naam    = db$^ (a, b -> a.naam > b.naam)         // afklimmend volgens naam (>)
>> volgens_ouderdom[1].naam ¶   // → Ana
>> volgens_naam[1].naam ¶       // → Carla

// Direkte element opdatering (slegs skikkings)
arr[1] = 99              // wys toe
arr[2] += 5              // saamgesteld: +=  -=  *=  /=  %=  ^=

// Funksionele opdatering — gee nuwe skikking terug; oorspronklike onveranderd
arr2 = arr[2]$~ 99
```

> Alle versamelingsoperateurs gee **nuwe skikking** terug. Wys weer toe: `arr = arr$+ 4`.
> `$+` kan geketting word: `arr = arr$+ 5$+ 6$+ 7`. Ander operateurs gebruik tussentydse toewysings.
> **Indeksering is basis-1**: `arr[1]` is die eerste element; `arr[0]` is 'n looptydfout.
> `$^+` / `$^-` sorteer **primitiewe skikkings** (getalle, stringe). Vir tuple skikkings gebruik `$^` met vergelykingslambda — rigting is in lambda gekodeer (`<` = opklimmend, `>` = afklimmend).

**Waardesemantiek** — om 'n skikking aan 'n ander veranderlike toe te wys, skep 'n onafhanklike kopie:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b word nie beïnvloed nie
```

```zymbol
// Geneste skikkings (basis-1 indeksering)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (ry 2, kolom 3)
```

---

## Destrukturing

```zymbol
// Skikking
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eerste, *oorblywendes] = arr // eerste=10  oorblywendes=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ vergeet

// Posisionele tuple
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Genoemde tuple
persoon = (naam: "Ana", ouderdom: 25, stad: "Madrid")
(naam: n, ouderdom: o) = persoon   // n="Ana"  o=25
```

---

## Tuples

Tuples is **onveranderlike** geordende houers wat waardes van **verskillende tipes** kan hou.
Anders as skikkings, kan elemente nie verander word na skepping nie.

```zymbol
// Posisioneel — gemengde tipes toegelaat
punt = (10, 20)
>> punt[1] ¶     // → 10

data = (42, "hallo", #1, 3.14)
>> data[3] ¶     // → #1

// Genoemde
persoon = (naam: "Alice", ouderdom: 25)
>> persoon.naam ¶   // → Alice
>> persoon[1] ¶     // → Alice  (indeks werk ook, basis-1)

// Geneste
pos = (x: 10, y: 20)
p = (pos: pos, etiket: "oorsprong")
>> p.pos.x ¶       // → 10
```

**Onveranderlikheid** — enige poging om 'n tuple element te wysig, is 'n looptydfout:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ looptydfout: tuples is onveranderlik
// t[1] += 5    // ❌ selfde fout

// Genoemde tuple — herbou eksplisiet
persoon = (naam: "Alice", ouderdom: 25)
ouer = (naam: persoon.naam, ouderdom: 26)
>> persoon.ouderdom ¶   // → 25
>> ouer.ouderdom ¶      // → 26
```

Om 'n gewysigde waarde te kry, gebruik `$~` (funksionele opdatering) — gee **nuwe** tuple terug:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← oorspronklike onveranderd
>> t2 ¶    // → (10, 999, 30)
```

---

## Hoër-orde Funksies

```zymbol
getalle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdubbeldes = getalle$> (x -> x * 2)                // kaart → [2,4,6…20]
ewe_getalle   = getalle$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
totaal     = getalle$< (0, (akkum, x) -> akkum + x) // verminder → 55

// Ketting deur tussengangers
stap1 = getalle$| (x -> x > 3)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Genoemde funksies kan direk na hoër-orde funksies gestuur word
verdubbel(x) { <~ x * 2 }
is_groot(x) { <~ x > 5 }
r = getalle$> verdubbel       // ✅ direkte verwysing
r = getalle$| is_groot        // ✅ direkte verwysing
```

---

## Pyp operateur

Die regterkant vereis altyd `_` as plekhouer vir die waarde wat gepyp word:

```zymbol
verdubbel = x -> x * 2
optel = (a, b) -> a + b
verhoog = x -> x + 1

5 |> verdubbel(_)        // → 10
10 |> optel(_, 5)        // → 15
5 |> optel(2, _)         // → 7

// Geketting
r = 5 |> verdubbel(_) |> verhoog(_) |> verdubbel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fout hantering

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

| Tipe | Wanneer |
|------|---------|
| `##Div` | Deling deur nul |
| `##IO` | Lêer / stelsel |
| `##Index` | Indeks buite perke |
| `##Type` | Tipe wanverhouding |
| `##Parse` | Data ontleding |
| `##Network` | Netwerk foute |
| `##_` | Enige fout (vang alles) |

---

## Modules

```zymbol
// lib/calc.zy — module liggaam is in krulhakies
# calc {
    #> { optel, get_PI }

    _PI := 3.14159
    optel(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias is verpligtend

>> c::optel(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Eksporteer met 'n ander openbare naam
# my_biblioteek {
    #> { _interne_optel <= som }

    _interne_optel(a, b) { <~ a + b }
}
```

```zymbol
<# ./my_biblioteek <= m

>> m::som(3, 4) ¶    // → 7  (interne naam _interne_optel is versteek)
```

> **Module reëls**: slegs `#>`, funksie definisies, en letterlike veranderlike/konstante initialiseerders word toegelaat binne `# naam { }`. Uitvoerbare stellings (`>>`, `<<`, lusse, ens.) veroorsaak fout E013.

---

## Numeriese Modes

Zymbol kan getalle vertoon in **69 Unicode syferblokke** — Devanagari, Arabies-Indies, Thai, Klingon pIqaD, Wiskundige vet, LCD segmente, en meer. Die aktiewe mode beïnvloed slegs uitset `>>`; interne rekenkunde is altyd binêr.

### Aktiveer 'n skrif

Skryf die `0` en `9` syfers van die teikenskrif binne `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabies-Indies (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // herstel na ASCII
```

### Uitset en Booleans

```zymbol
x = 42
>> x ¶          // → 42   (verstek ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimale punt is altyd ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: # voorvoegsel is altyd ASCII, syfer pas aan
>> #1 ¶         // → #१   (waar in Devanagari)
>> #0 ¶         // → #०   (vals — onderskei van ० heelgetal nul)

x = 28 > 4
>> x ¶          // → #१   (vergelykingsresultaat volg aktiewe mode)
```

### Inheemse syfer literal in bronkode

Enige ondersteunde skrif se syfers is geldige literale — in reekse, modulo, vergelykings:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booles literale in enige skrif

`#` + syfer `0` of `1` van enige blok is 'n geldige Booles literaal:

```zymbol
#०९#
aktief = #१        // dieselfde as #1
>> aktief ¶        // → #१
>> (#१ && #०) ¶    // → #०
```

> `#` is **altyd ASCII**. `#0` (vals) is altyd visueel onderskeibaar van `0` (heelgetal nul) in elke skrif.

---

## Data Operateurs

```zymbol
// Tipe omskakeling
##.42         // → 42.0  (na Dobbelpunt)
###3.7        // → 4     (na Heelgetal, rond af)
##!3.7        // → 3     (na Heelgetal, kap af)

// Ontleed string na getal
v1 = #|"42"|      // → 42  (Heelgetal)
v2 = #|"3.14"|    // → 3.14  (Dobbelpunt)
v3 = #|"abc"|     // → "abc"  (veilig, geen fout)

// Rond af / kap af
pi = 3.14159265
afgerond2 = #.2|pi|     // → 3.14  (rond af na 2 desimale plekke)
afgerond4 = #.4|pi|     // → 3.1416
afgekap2 = #!2|pi|      // → 3.14  (kap af)

// Getal formatering
formaat = #,|1234567|   // → 1,234,567  (komma-geskei)
wetenskaplik = #^|12345.678| // → 1.2345678e4  (wetenskaplik)

// Basis literale
a = 0x41         // → 'A'  (heksadesimaal)
b = 0b01000001   // → 'A'  (binêr)
c = 0o101        // → 'A'  (oktaal)

// Basis omskakeling uitset
heks = 0x|255|    // → "0x00FF"
bin = 0b|65|      // → "0b1000001"
okt = 0o|8|       // → "0o10"
des = 0d|255|     // → "0d0255"
```

---

## Skulp Integrasie

```zymbol
datum = <\ date +%Y-%m-%d \>     // vang stdout (sluit \n aan die einde in)
>> "Vandag: " datum

lêer = "data.txt"
inhoud = <\ cat {lêer} \>        // interpolasie in opdragte

uitset = </"./subscript.zy"/>    // voer nog 'n Zymbol skrip uit, vang uitset
>> uitset
```

> `><` vang CLI argumente as 'n string skikking (slegs boomwandelaar).

---

## Volledige Voorbeeld: FizzBuzz

```zymbol
klassifiseer(getal) {
    ? getal % 15 == 0 { <~ "FizzBuzz" }
    _? getal % 3  == 0 { <~ "Fizz" }
    _? getal % 5  == 0 { <~ "Buzz" }
    _ { <~ getal }
}

@ i:1..20 { >> klassifiseer(i) ¶ }
```

---

## Simbool Verwysing

| Simbool | Operasie | Simbool | Operasie |
|---------|----------|---------|----------|
| `=` | veranderlike | `$#` | lengte |
| `:=` | konstante | `$+` | voeg by (kettingbaar) |
| `>>` | uitset | `$+[i]` | voeg in by indeks (basis-1) |
| `<<` | inset | `$-` | verwyder eerste volgens waarde |
| `¶` / `\\` | nuwe lyn | `$--` | verwyder alle volgens waarde |
| `?` | as | `$-[i]` | verwyder by indeks (basis-1) |
| `_?` | anders as | `$-[i..j]` | verwyder reeks (basis-1) |
| `_` | anders / joker | `$?` | bevat |
| `??` | passing | `$??` | vind alle indekse (basis-1) |
| `@` | lus | `$[s..e]` | sny (basis-1) |
| `@ N { }` | N keer lus | `$>` | kaart |
| `@!` | breek | `$|` | filter |
| `@>` | gaan voort | `$<` | verminder |
| `@:naam { }` | gemerkte lus | `$/ skeidingsteken` | string splitting |
| `@:naam!` | gemerkte breek | `$++ a b c` | konkatenasie bou |
| `@:naam>` | gemerkte gaan voort | `skikking[i>j>k]` | navigasie indeks |
| `->` | lambda | `skikking[i] = waarde` | opdateer element (slegs skikkings) |
| `skikking[i] += waarde` | saamgestelde opdatering | `skikking[i]$~` | funksionele opdatering (nuwe kopie) |
| `$^+` | sorteer opklimmend (primitiewe) | `$^-` | sorteer afklimmend (primitiewe) |
| `$^` | sorteer met vergelyker (tuples) | `<~` | terugkeer |
| `|>` | pyp | `!?` | probeer |
| `:!` | vang | `:>` | uiteindelik |
| `#1` | waar | `#0` | vals |
| `$!` | is fout | `$!!` | versprei fout |
| `<#` | invoer | `#>` | uitvoer |
| `#` | verklaar module | `::` | roep module |
| `.` | veld toegang | `#?` | tipe metadata |
| `#\|..\|` | ontleed getal | `##.` | omskakel na Dobbelpunt |
| `###` | omskakel na Heelgetal (rond af) | `##!` | omskakel na Heelgetal (kap af) |
| `#.N\|..\|` | rond af | `#!N\|..\|` | kap af |
| `#,\|..\|` | komma formaat | `#^\|..\|` | wetenskaplik |
| `#d0d9#` | verander numeriese mode | `#09#` | herstel na ASCII |
| `<\ ..\>` | voer skulp uit | `>\<` | CLI argumente |
| `\ var` | vernietig veranderlike eksplisiet | | |

---

## Vrystelling Verandering Log

### v0.0.4 — Basis-1 Indeksering, Eerste-klas Funksies & Module Blokke _(April 2026)_

- **Brekend** Alle indeksering verander na **basis-1** — `arr[1]` is die eerste element; `arr[0]` is 'n looptydfout
- **Bygevoeg** Genoemde funksies is **eerste-klas waardes** — stuur direk na hoër-orde funksies: `nums$> verdubbel`
- **Bygevoeg** Module **blok sintaksis is verpligtend**: `# naam { ... }` — plat sintaksis verwyder
- **Bygevoeg** Multidimensionele indeksering: `arr[i>j>k]` (navigasie), `arr[p ; q]` (platte onttrekking)
- **Bygevoeg** Tipe omskakeling: `##.uitdrukking` (Dobbelpunt), `###uitdrukking` (Heelgetal rond af), `##!uitdrukking` (Heelgetal kap af)
- **Bygevoeg** String splitting: `str$/ skeidingsteken` — gee terug `Array(String)`
- **Bygevoeg** Konkatenasie bou: `basis$++ a b c` — voeg veelvuldige items by
- **Bygevoeg** N keer lus: `@ N { }` — herhaal presies N keer
- **Bygevoeg** Gemerkte lusse sintaksis: `@:naam { }`, `@:naam!`, `@:naam>` — vervang `@ @naam` / `@! naam`
- **Bygevoeg** Veranderlike omvang reëls: `_naam` veranderlikes het presiese blok omvang; `\ var` vernietig vroeg
- **Bygevoeg** Passing vergelykingspatrone: `< 0 :`, `> 5 :`, `== 42 :` ens.
- **Bygevoeg** Module E013 fout: uitvoerbare stellings in module liggaam word verbied
- **Reggemaak** `take_variable` korrupteer nie meer module konstantes tydens terugskrywing nie
- **Reggemaak** `alias.CONST` word nou korrek opgelos; `#>` kan na funksie definisies verskyn
- **VM** Volledige pariteit: 393/393 toetse slaag

### v0.0.3 — Unicode Syferstelsels & LSP Verbeterings _(April 2026)_

- **Bygevoeg** 69 Unicode syferblokke met mode wissel teken `#d0d9#`
- **Bygevoeg** Booles literale in enige skrif — `#१` / `#०`, `#१` / `#०`, ens.
- **Bygevoeg** Klingon pIqaD syfers (CSUR PUA U+F8F0–U+F8F9)
- **Bygevoeg** `SetNumeralMode` VM opkode — volle pariteit met boomwandelaar
- **Bygevoeg** REPL respekteer aktiewe numeriese mode in eggo en veranderlike vertoning
- **Verander** Booles `>>` uitset sluit nou `#` voorvoegsel (`#0` / `#1`) in alle modes in

### v0.0.2_01 — Operateur Hername _(30 Maart 2026)_

- **Verander** `c|..|` → `#,|..|` en `e|..|` → `#^|..|` — konsekwent met `#` formaat voorvoegsel familie
- **Bygevoeg** Uitvoer alias: her-uitvoer module lede onder 'n ander naam

### v0.0.2 — Versameling API Herontwerp & Installeerders _(24 Maart 2026)_

- **Bygevoeg** Verenigde `$` operateur familie vir skikkings en stringe (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bygevoeg** Destrukturerings toewysing vir skikkings, tuples, en genoemde tuples
- **Bygevoeg** Negatiewe indekse (`arr[-1]` = laaste element)
- **Bygevoeg** Inheemse installeerders — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maart 2026)_

- **Bygevoeg** Saamgestelde toewysing `^=`
- **Reggemaak** Ontleder rekenkundige randgevalle; dokumentasie regstellings

### v0.0.1 — Aanvanklike Openbare Vrystelling _(22 Maart 2026)_

- Boomwandelaar interpreteerder + register VM (`--vm`, ~4× vinniger, ~95% pariteit)
- Alle kern konstrukte: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Volledige Unicode identifiseerders, module stelsel, lambdas, sluitings, fout hantering
- REPL, LSP, VS Code uitbreiding, formateerder (`zymbol fmt`)

---

_Zymbol-Lang — Simbolies. Universeel. Onveranderlik._
