> **Vrywaring:** Hierdie dokumentasie is geskep en vertaal deur kunsmatige intelligensie (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Die kanonieke verwysing is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in die tolkbewaarplek.

---

# Zymbol-Lang Handleiding

> **Gekontroleer vir v0.0.5 — 2026-05-14**

**Zymbol-Lang** is 'n simboliese programmeertaal. Geen sleutelwoorde nie — alles is 'n simbool. Werk identies in enige menslike taal.

- Geen `if`, `while`, `return` nie — slegs `?`, `@`, `<~`
- Volledige Unicode — identifiseerders in enige taal of emoji
- Menslike taal onafhanklik — die kode is oral dieselfde

**Tolkweergawe**: v0.0.5 | **Toetsdekking**: 436/436 (TW ↔ VM pariteit)

---

## Veranderlikes en Konstantes

```zymbol
x = 10              // veranderlike veranderlike
π := 3.14159        // konstante — heraanwysing is looptydfout
naam = "Alice"
aktief = #1         // boolse waar
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

`°` (graadsimbool, U+00B0) initialiseer 'n veranderlike outomaties na sy neutrale waarde by eerste gebruik:

```zymbol
getalle = [3, 1, 4, 1, 5]
@ n:getalle {
    °totaal += n    // outomatiese initialisasie na 0 bokant die lus; oorleef na @
}
>> totaal ¶         // → 14
```

> `°x` (voorvoegsel) anker bo die lus — resultaat toeganklik na `@`.
> `x°` (agtervoegsel) anker binne die lus — sterf wanneer die lus eindig.
> Slegs tree-walker.

---

## Datatipes

| Tipe | Letterlike | `#?` Etiket | Notas |
|------|---------|----------|---------|
| Heelgetal | `42`, `-7` | `###` | 64-bits geteken |
| Drywende punt | `3.14`, `1.5e10` | `##.` | Wetenskaplike notasie toegelaat |
| String | `"teks"` | `##"` | Interpolasie: `"Hallo {naam}"` |
| Karakter | `'A'` | `##'` | Enkele Unicode karakter |
| Bool | `#1`, `#0` | `##?` | Nie numeries nie — `#1 ≠ 1` |
| Skikking | `[1, 2, 3]` | `##]` | Homogene elemente |
| Tuple | `(a, b)` | `##)` | Posisioneel |
| Genoemde tuple | `(x: 1, y: 2)` | `##)` | Genoemde velde |
| Funksie | genoemde funksie verwysing | `##()` | Eerste-klas; vertoon `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Eerste-klas; vertoon `<lambd/N>` |

```zymbol
// Tipe introspesie — gee terug (tipe, syfers, waarde)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Uitvoer en Invoer

```zymbol
>> "Hallo" ¶                       // ¶ of \\ vir eksplisiete nuwe lyn
>> "a=" a " b=" b ¶               // juxtaposition — veelvuldige waardes
>> (arr$#) ¶                      // agtervoegseloperateurs benodig ( ) in >>

>> naam                           // lees in veranderlike (sonder promp)
>> "Voer naam in: " naam            // met promp
```

> `¶` (AltGr+R op Spaanse sleutelbord) en `\\` is ekwivalente nuwe lyne.

---

## TUI Primitiewes

Terminale gebruikerskoppelvlak operateurs vir interaktiewe programme. Meestal benodig `>>| { }` blok (alternatiewe skerm + rou modus).

```zymbol
>>| {
    >>!                             // verwyder alternatiewe skerm
    >>~ (1, 1, 0, 10) > "Loop"     // ry 1, kolom 1, fg=10 (groen)
    @~ 1000                         // stop vir 1 sekonde (1000 ms)
    >>~ (2, 1) > "Klaar."
}
// terminal word outomaties herstel by uitgang
```

```zymbol
// Sleuteldruk en terminal grootte
>>| {
    [rye, kolomme] = >>?              // bevraagteken terminal afmetings
    >>~ (1, 1) > "Terminaal: " rye " x " kolomme
    <<| sleutel                         // lees blokkerende sleuteldruk
    >>~ (2, 1) > "Gedruk: " sleutel
}
```

> `>>!` verwyder skerm. `>>?` gee `[rye, kolomme]` terug. `@~ N` slaap N millisekondes.
> `<<|` lees een sleuteldruk (blokkerend); `<<|?` peil sonder om te blokkeer (gee `'\0'` terug as geen).
> Posisionele uitvoertuple: `(ry, kolom, BKS, fg, bg)` — enige slot kan met komma weggelaat word (`>>~ (,,, 196) > "rooi"`).
> BKS bitmasker: `1`=vet, `2`=skeef, `4`=onderstreep. ANSI 256 kleurpalet (`0`=terminaal verstek).
> Slegs tree-walker (behalwe `>>!`, `>>?`, `@~`, `>>~` wat ook in `--vm` werk).

---

## Operateurs

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (heelgetal deling)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (eksponensiasie)

// Vergelyking — wys toe vir inspeksie
v1 = a == b    // #0
v2 = a <> b    // #1
v3 = a < b     // #0
v4 = a <= b    // #0
v5 = a > b     // #1
v6 = a >= b    // #1

// Logies
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Strings

```zymbol
// Twee konkatenasie vorms
naam = "Alice"
n = 42

>> "Hallo " naam " jy het " n ¶       // juxtaposition — in >>
beskrywing = "Hallo {naam}, jy het {n}"     // interpolasie — oral
```

```zymbol
s = "Hallo wêreld"
lengte = s$#                  // 11
sub = s$[1..5]             // "Hallo"  (1-gebaseer, einde ingesluit)
bevat = s$? "wêreld"          // #1
dele = "a,b,c,d"$/ ','   // [a, b, c, d]  (splits met skeidingsteken)
vervang = s$~~["l":"r"]        // "Harro wêreld"
vervang1 = s$~~["l":"r":1]     // "Harro wêreld"  (slegs eerste N)
lyn = "─" $* 20           // "────────────────────"  (herhaal N keer)
```

> `+` is slegs vir getalle. Gebruik `,`, juxtaposition, of interpolasie vir strings.

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

> Krulhakies `{ }` is **vereis** selfs vir 'n enkele stelling.

---

## Passing

```zymbol
// Reekse
telling = 85
graad = ?? telling {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> graad ¶    // → B

// Strings
kleur = "rooi"
kode = ?? kleur {
    "rooi"   => "#FF0000"
    "groen" => "#00FF00"
    _       => "#000000"
}

// Vergelykingspatrone
temperatuur = -5
status = ?? temperatuur {
    < 0  => "ys"
    < 20 => "koud"
    < 35 => "warm"
    _    => "warm"
}
>> status ¶    // → ys

// Stellingvorm (blokarms)
n = -3
?? n {
    0    => { >> "nul" ¶ }
    < 0  => { >> "negatief" ¶ }
    _    => { >> "positief" ¶ }
}
```

---

## Lusse

```zymbol
@ i:0..4  { >> i " " }        // reeks ingesluit:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // met stap:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // omgekeerd:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

vrugte = ["appel", "peer", "druif"]
@ v:vrugte { >> v ¶ }         // vir elke element in skikking

@ k:"hallo" { >> k "-" }
>> ¶                          // → h-a-l-l-o-  (vir elke karakter in string)

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
telling = 0
@:ekstern {
    telling++
    ? telling >= 3 { @:ekstern! }
}
>> telling ¶                    // → 3
```

---

## Funksies

```zymbol
tel_op(a, b) { <~ a + b }
>> tel_op(3, 4) ¶    // → 7

faktoriaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriaal(n - 1)
}
>> faktoriaal(5) ¶    // → 120
```

Funksies het **geïsoleerde omvang** — hulle kan nie eksterne veranderlikes lees nie. Gebruik uitvoerparameters `<~` om beller se veranderlikes te wysig:

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

> Genoemde funksies is **eersteklaswaardes** — stuur direk: `getalle$> verdubbel`. Om te wrap: `x -> fn(x)` is ook geldig.

---

## Lambdas en Toesluitings

```zymbol
verdubbel = x -> x * 2
tel_op = (a, b) -> a + b
>> verdubbel(5) ¶    // → 10
>> tel_op(3, 7) ¶  // → 10

// Blok lambda
klassifiseer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}

// Toesluiting — vang eksterne omvang
faktor = 3
verdriedubbel = x -> x * faktor
>> verdriedubbel(7) ¶    // → 21

// Fabriek
maak_teller(n) { <~ x -> x + n }
tien_by = maak_teller(10)
>> tien_by(5) ¶    // → 15

// In skikking
operateurs = [x -> x+1, x -> x*2, x -> x*x]
>> operateurs[3](5) ¶    // → 25
```

---

## Skikkings

Skikkings is **veranderbaar** en bevat elemente van **dieselfde tipe**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — toegang (1-gebaseer: eerste element)
x = arr[-1]     // 5 — negatiewe indeks (laaste element)
x = arr$#       // 5 — lengte (gebruik (arr$#) in >>)

arr = arr$+ 6            // voeg by → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // voeg in by posisie 2 (1-gebaseer)
arr3 = arr$- 3           // verwyder eerste voorkoms van waarde
arr4 = arr$-- 3          // verwyder alle voorkomste
arr5 = arr$-[1]          // verwyder by indeks 1 (eerste element)
arr6 = arr$-[2..3]       // verwyder reeks (1-gebaseer, einde ingesluit)

bevat = arr$? 3            // #1 — bevat
posisies = arr$?? 3           // [3] — alle indekse van waarde (1-gebaseer)
snit = arr$[1..3]          // [1,2,3] — snit (1-gebaseer, einde ingesluit)
snit2 = arr$[1:3]          // [1,2,3] — selfde, telling-gebaseerde sintaksis

oplopend = arr$^+             // sorteer oplopend (slegs primitiewe)
aflopend = arr$^-            // sorteer aflopend (slegs primitiewe)

// Genoemde/posisionele tuple skikkings — gebruik $^ met vergelyker lambda
db = [(naam: "Carla", ouderdom: 28), (naam: "Ana", ouderdom: 25), (naam: "Bob", ouderdom: 30)]
volgens_ouderdom  = db$^ (a, b -> a.ouderdom < b.ouderdom)    // volgens ouderdom oplopend (<)
volgens_naam = db$^ (a, b -> a.naam > b.naam)   // volgens naam aflopend (>)
>> volgens_ouderdom[1].naam ¶     // → Ana
>> volgens_naam[1].naam ¶    // → Carla

// Direkte element opdatering (slegs skikkings)
arr[1] = 99              // wys toe
arr[2] += 5              // saamgestel: +=  -=  *=  /=  %=  ^=

// Funksionele opdatering — gee 'n nuwe skikking terug; oorspronklik onveranderd
arr2 = arr[2]$~ 99
```

> Alle versamelingsoperateurs gee 'n **nuwe skikking** terug. Wys terug toe: `arr = arr$+ 4`.
> `$+` kan geketting word: `arr = arr$+ 5$+ 6$+ 7`. Ander operateurs gebruik tussentydse toewysings.
> **Indeksering is 1-gebaseer**: `arr[1]` is die eerste element; `arr[0]` is 'n looptydfout.
> `$^+` / `$^-` sorteer **primitiewe skikkings** (getalle, stringe). Vir tuple skikkings gebruik `$^` met 'n vergelyker lambda — rigting is in die lambda geënkodeer (`<` = oplopend, `>` = aflopend).

**Waarde-semantiek** — om 'n skikking aan 'n ander veranderlike toe te wys skep 'n onafhanklike kopie:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b word nie beïnvloed nie
```

```zymbol
// Geneste skikkings (1-gebaseerde indeksering)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (ry 2, kolom 3)
```

---

## Destrukturing

```zymbol
// Skikking
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eerste, *oorblywend] = arr         // eerste=10  oorblywend=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ gooi weg

// Posisionele tuple
punt = (100, 200)
(px, py) = punt             // px=100  py=200

// Genoemde tuple
persoon = (naam: "Ana", ouderdom: 25, stad: "Madrid")
(naam: n, ouderdom: o) = persoon   // n="Ana"  o=25
```

---

## Tupels

Tupels is **onveranderlike** geordende houers wat waardes van **verskillende tipes** kan hou.
Anders as skikkings, kan elemente nie na skepping verander word nie.

```zymbol
// Posisioneel — gemengde tipes toegelaat
punt = (10, 20)
>> punt[1] ¶    // → 10

data = (42, "Hallo", #1, 3.14)
>> data[3] ¶     // → #1

// Genoemde
persoon = (naam: "Alice", ouderdom: 25)
>> persoon.naam ¶    // → Alice
>> persoon[1] ¶      // → Alice  (indeks werk ook, 1-gebaseer)

// Geneste
pos = (x: 10, y: 20)
p = (pos: pos, etiket: "oorsprong")
>> p.pos.x ¶        // → 10
```

**Onveranderlikheid** — enige poging om 'n tuple element te verander is 'n looptydfout:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ looptydfout: tupels is onveranderlik
// t[1] += 5    // ❌ selfde fout
```

Om 'n gewysigde waarde te kry gebruik `$~` (funksionele opdatering) — gee 'n **nuwe** tuple terug:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← oorspronklik onveranderd
>> t2 ¶    // → (10, 999, 30)

// Genoemde tuple — herbou eksplisiet
persoon = (naam: "Alice", ouderdom: 25)
ouer  = (naam: persoon.naam, ouderdom: 26)
>> persoon.ouderdom ¶    // → 25
>> ouer.ouderdom ¶     // → 26
```

---

## Hoër-orde Funksies

```zymbol
getalle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

verdubbelde  = getalle$> (x -> x * 2)                  // map  → [2,4,6…20]
ewe    = getalle$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totaal    = getalle$< (0, (akkumuleerder, x) -> akkumuleerder + x)     // reduce → 55

// Ketting via tussengangers
stap1 = getalle$| (x -> x > 3)
stap2 = stap1$> (x -> x * x)
>> stap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Genoemde funksies kan direk na HOF gestuur word
verdubbel(x) { <~ x * 2 }
is_groot(x) { <~ x > 5 }
r = getalle$> verdubbel       // ✅ direkte verwysing
r = getalle$| is_groot       // ✅ direkte verwysing
```

---

## Pyp Operateur

Die regterkant vereis altyd `_` as 'n plekhouer vir die gepypde waarde:

```zymbol
verdubbel = x -> x * 2
tel_op = (a, b) -> a + b
inkrementeer = x -> x + 1

r1 = 5 |> verdubbel(_)        // → 10
r2 = 10 |> tel_op(_, 5)       // → 15
r3 = 5 |> tel_op(2, _)        // → 7

// Geketting
r = 5 |> verdubbel(_) |> inkrementeer(_) |> verdubbel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fout Hantering

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deling deur nul" ¶
} :! {
    >> "ander: " _err ¶    // _err hou die foutboodskap
} :> {
    >> "loop altyd" ¶
}
```

| Tipe | Wanneer |
|------|------|
| `##Div` | Deling deur nul |
| `##IO` | Lêer / stelsel |
| `##Index` | Indeks buite perke |
| `##Type` | Tipe wanverhouding |
| `##Parse` | Data ontleding |
| `##Network` | Netwerkfoute |
| `##_` | Enige fout (vang-alles) |

---

## Modules

```zymbol
// lib/calc.zy — module liggaam is in krulhakies toegemaak
# calc {
    #> { tel_op, get_PI }

    _π := 3.14159
    tel_op(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias word vereis

>> c::tel_op(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Eksporteer met 'n ander publieke naam
# mylib {
    #> { _interne_tel_op => som }

    _interne_tel_op(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::som(3, 4) ¶    // → 7  (interne naam _interne_tel_op is verborge)
```

> **Module reëls**: binne `# naam { }` word slegs `#>`, funksie definisies, en letterlike veranderlike/konstante initialiseerders toegelaat. Uitvoerbare stellings (`>>`, `<<`, lusse, ens.) veroorsaak fout E013.

---

## Syfermodusse

Zymbol kan getalle vertoon in **69 Unicode syferskrifte** — Devanagari, Arabies-Indies, Thai, Klingon pIqaD, Wiskundige vet, LCD segmente, en meer. Die aktiewe modus beïnvloed slegs `>>` uitvoer; interne aritmetika is altyd binêr.

### Aktiveer 'n skrif

Skryf die `0` en `9` syfers van die teikenskrif binne `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabies-Indies (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // herstel na ASCII
```

### Uitvoer en booleane

```zymbol
x = 42
>> x ¶          // → 42   (ASCII verstek)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimale punt is altyd ASCII)
>> 1 + 2 ¶      // → ३

// Booleane: # voorvoegsel is altyd ASCII, syfer pas aan
>> #1 ¶         // → #१   (waar in Devanagari)
>> #0 ¶         // → #०   (vals — onderskei van ० heelgetal nul)

x = 28 > 4
>> x ¶          // → #१   (vergelykingsresultaat volg aktiewe modus)
```

### Inheemse syferletterlikes in bron

Enige ondersteunde skrif se syfers is geldige letterlikes — in reekse, modulo, vergelykings:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Bool letterlikes in enige skrif

`#` + syfer `0` of `1` van enige blok is 'n geldige bool letterlike:

```zymbol
#٠٩#
aktief = #١        // dieselfde as #1
>> aktief ¶        // → #१
>> (#١ && #٠) ¶ // → #०
```

> `#` **is altyd ASCII**. `#0` (vals) is altyd visueel onderskeibaar van `0` (heelgetal nul) in elke skrif.

---

## Data Operateurs

```zymbol
// Tipe omsetting
f = ##.42         // → 42.0  (na drywende punt)
i = ###3.7        // → 4     (na heelgetal, rond af)
t = ##!3.7        // → 3     (na heelgetal, kap af)

// Parseer string na getal
v1 = #|"42"|      // → 42  (heelgetal)
v2 = #|"3.14"|    // → 3.14  (drywende punt)
v3 = #|"abc"|     // → "abc"  (veilig, geen fout)

// Rond af / kap af
π = 3.14159265
afgerond2 = #.2|π|      // → 3.14  (rond af tot 2 desimale plekke)
afgerond4 = #.4|π|      // → 3.1416
afgekap2 = #!2|π|      // → 3.14  (kap af)

// Getalformattering
formaat = #,|1234567|  // → 1,234,567  (komma-geskei)
wetenskaplik = #^|12345.678|    // → 1.2345678e4  (wetenskaplik)

// Basis letterlikes
a = 0x41         // → 'A'  (heksadesimaal)
b = 0b01000001   // → 'A'  (binêr)
c = 0o101        // → 'A'  (oktaal)

// Basis omsetting uitvoer
heks = 0x|255|    // → "0x00FF"
binêr = 0b|65|     // → "0b1000001"
oktaal = 0o|8|      // → "0o10"
desimaal = 0d|255|    // → "0d0255"
```

---

## Skulp Integrasie

```zymbol
datum = <\ date +%Y-%m-%d \>     // vang stdout (sluit \n aan die einde in)
>> "Vandag: " datum

lêer = "data.txt"
inhoud = <\ cat {lêer} \>      // interpolasie in opdragte

uitvoer = </"./subscript.zy"/>   // voer nog 'n Zymbol-skrip uit, vang uitvoer
>> uitvoer
```

> `><` vang CLI argumente as 'n stringskikking (slegs tree-walker).

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
|--------|-----------|--------|-----------|
| `=` | veranderlike | `$#` | lengte |
| `:=` | konstante | `$+` | voeg by (kettingbaar) |
| `>>` | uitvoer | `$+[i]` | voeg in by indeks (1-gebaseer) |
| `<<` | invoer | `$-` | verwyder eerste per waarde |
| `¶` / `\\` | nuwe lyn | `$--` | verwyder alle per waarde |
| `?` | as | `$-[i]` | verwyder by indeks (1-gebaseer) |
| `_?` | anders-as | `$-[i..j]` | verwyder reeks (1-gebaseer) |
| `_` | anders / wildkaart | `$?` | bevat |
| `??` | passing | `$??` | vind alle indekse (1-gebaseer) |
| `@` | lus | `$[s..e]` | snit (1-gebaseer) |
| `@ N { }` | lus N keer | `$>` | map |
| `@!` | breek | `$\|` | filter |
| `@>` | gaan voort | `$<` | reduce |
| `@:naam { }` | gemerkte lus | `$/ skeidingsteken` | split string |
| `@:naam!` | breek merk | `$++ a b c` | concat bou |
| `@:naam>` | gaan voort merk | `arr[i>j>k]` | navigasie indeks |
| `->` | lambda | `arr[i] = waarde` | werk element by (slegs skikkings) |
| `arr[i] += waarde` | saamgestelde bywerking | `arr[i]$~` | funksionele bywerking (nuwe kopie) |
| `$^+` | sorteer oplopend (primitiewe) | `$^-` | sorteer aflopend (primitiewe) |
| `$^` | sorteer met vergelyker (tupels) | `<~` | gee terug |
| `\|>` | pyp | `!?` | probeer |
| `:!` | vang | `:>` | uiteindelik |
| `#1` | waar | `#0` | vals |
| `$!` | is fout | `$!!` | versprei fout |
| `<#` | invoer | `#>` | uitvoer |
| `#` | verklaar module | `::` | roep module |
| `.` | veld toegang | `#?` | tipe metadata |
| `#\|..\|` | parseer getal | `##.` | omskep na drywende punt |
| `###` | omskep na heelgetal (rond af) | `##!` | omskep na heelgetal (kap af) |
| `#.N\|..\|` | rond af | `#!N\|..\|` | kap af |
| `#,\|..\|` | komma formaat | `#^\|..\|` | wetenskaplik |
| `#d0d9#` | wissel syfermodus | `#09#` | herstel na ASCII |
| `<\ ..\>` | voer skulp uit | `>\<` | CLI argumente |
| `\ veranderlike` | vernietig veranderlike eksplisiet | `°x` / `x°` | warm definisie (auto-initialiseer) |
| `>>|` | TUI blok (alternatiewe skerm) | `>>~` | posisionele uitvoer |
| `>>!` | verwyder skerm | `>>?` | bevraagteken terminal grootte |
| `<<\|` | blokkerende sleuteldruk | `<<\|?` | nie-blokkerende sleuteldruk peiling |
| `@~ N` | slaap N millisekondes | `$*` | herhaal string N keer |

---

## Vrystellingveranderingslog

### v0.0.5 — TUI Primitiewes, Warm Definisie & String Herhaling _(Mei 2026)_

- **Brekend** Passingarm skeier: `patroon : resultaat` → `patroon => resultaat`
- **Brekend** Invoer alias: `<# pad <= alias` → `<# pad => alias`
- **Brekend** Uitvoer hernoem: `#> { fn <= pub }` → `#> { fn => pub }`
- **Bygevoeg** TUI blok `>>| { }` — alternatiewe skerm + rou modus; maak skoon by uitgang
- **Bygevoeg** Posisionele uitvoer `>>~ (ry, kolom, BKS, fg, bg) > items` — yl gleuwe, ANSI 256 kleur
- **Bygevoeg** Sleutel invoer `<<| veranderlike` (blokkerend) en `<<|? veranderlike` (nie-blokkerende peiling)
- **Bygevoeg** `>>!` verwyder skerm, `>>?` bevraagteken terminal grootte, `@~ N` slaap N millisekondes
- **Bygevoeg** Warm definisie `°x` / `x°` — outomatiese initialiseer veranderlike by eerste gebruik in lusse
- **Bygevoeg** String herhaling `string $* N` — herhaal 'n string N keer
- **VM** Pariteit: 436/436 toetse geslaag

### v0.0.4 — 1-Gebaseerde Indeksering, Eerste-klas Funksies & Blok Modules _(April 2026)_

- **Brekend** Alle indeksering is verander na **1-gebaseer** — `arr[1]` is die eerste element; `arr[0]` is 'n looptydfout
- **Bygevoeg** Genoemde funksies is **eersteklaswaardes** — stuur direk na HOF: `getalle$> verdubbel`
- **Bygevoeg** **Blok sintaksis vereis** vir modules: `# naam { ... }` — plat sintaksis verwyder
- **Bygevoeg** Multi-dimensionele indeksering: `arr[i>j>k]` (navigasie), `arr[p ; q]` (plat onttrekking)
- **Bygevoeg** Tipe omsetting kastings: `##.uitdrukking` (drywende punt), `###uitdrukking` (heelgetal rond), `##!uitdrukking` (heelgetal kap)
- **Bygevoeg** String splitsing: `string$/ skeidingsteken` — gee `Array(string)` terug
- **Bygevoeg** Concat bou: `basis$++ a b c` — voeg verskeie items by
- **Bygevoeg** Keer lus: `@ N { }` — herhaal presies N keer
- **Bygevoeg** Gemerkte lus sintaksis: `@:naam { }`, `@:naam!`, `@:naam>` — vervang `@ @naam` / `@! naam`
- **Bygevoeg** Veranderlike omvang reëls: `_naam` veranderlikes het presiese blok omvang; `\ veranderlike` vernietig vroeg
- **Bygevoeg** Passing vergelykingspatrone: `< 0 =>`, `> 5 =>`, `== 42 =>` ens.
- **Bygevoeg** Module E013 fout: uitvoerbare stellings in module liggaam is verbode
- **Reggemaak** `alias.CONST` los nou korrek op; `#>` kan na funksie definisies verskyn
- **VM** Volledige pariteit: 393/393 toetse geslaag

### v0.0.3 — Unicode Syferstelsels & LSP Verbeterings _(April 2026)_

- **Bygevoeg** 69 Unicode syferblokke met modus-wissel teken `#d0d9#`
- **Bygevoeg** Bool letterlikes in enige skrif — `#१` / `#०`, `#١` / `#٠`, ens.
- **Bygevoeg** Klingon pIqaD syfers (CSUR PUA U+F8F0–U+F8F9)
- **Bygevoeg** VM Opkode `SetNumeralMode` — volle pariteit met tree-walker
- **Verander** Bool `>>` uitvoer sluit nou `#` voorvoegsel (`#0` / `#1`) in alle modusse in

### v0.0.2_01 — Operateur Herdoop _(30 Maart 2026)_

- **Verander** `c|..|` → `#,|..|` en `e|..|` → `#^|..|` — konsekwent met `#` voorvoegselfamilie
- **Bygevoeg** Uitvoer alias: her-uitvoer module lede onder 'n ander naam

### v0.0.2 — Versameling API Herontwerp & Installeerders _(24 Maart 2026)_

- **Bygevoeg** Verenigde `$` operateur familie vir skikkings en stringe (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bygevoeg** Destrukturerings toewysing vir skikkings, tupels, en genoemde tupels
- **Bygevoeg** Negatiewe indekse (`arr[-1]` = laaste element)
- **Bygevoeg** Inheemse installeerders — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maart 2026)_

- **Bygevoeg** Saamgestelde toewysing `^=`
- **Reggemaak** Ontleder aritmetika randgevalle; dokumentasie regstellings

### v0.0.1 — Aanvanklike Openbare Vrystelling _(22 Maart 2026)_

- Tree-walker tolk + register VM (`--vm`, ~4× vinniger, ~95% pariteit)
- Alle kern konstrukte: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Volledige Unicode identifiseerders, module stelsel, lambdas, toesluitings, fout hantering
- REPL, LSP, VS Code uitbreiding, formateerder (`zymbol fmt`)

---

_Zymbol-Lang — Simbolies. Universeel. Onveranderlik._
