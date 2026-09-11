> **Vrywaring:** Hierdie dokument is geskep en vertaal deur kunsmatige intelligensie (KI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Die kanonieke verwysing is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in die tolk-verwysingsbron.

---

# Zymbol-Lang Handleiding

> **Hersien vir v0.0.9 — 2026-09-07**

**Zymbol-Lang** is 'n simboliese programmeertaal. Geen woorde in sy grammatika nie — elke konstruksie is 'n teken. Werk identies in enige menslike taal.

- Geen `if`, `while`, `return` — net `?`, `@`, `<~`
- Volle Unicode — identifiseerders in enige taal of emoji
- Taalonafhanklik — die kode is oral dieselfde

**Tolkweergawe**: v0.0.9 | **Toetsdekking**: 660/666 (drie enjins stem ooreen, 0 afwykend)

---

## Veranderlikes en Konstantes

```zymbol
x = 10              // veranderlike veranderlike
PI := 3.14159       // konstante — hertoewysing is 'n looptydfout
naam = "Anna"
aktief = #1         // boole waar
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
x++       // 5
x--       // 4
```

`°` (graadteken, U+00B0) initialiseer 'n veranderlike outomaties na sy neutrale waarde by die eerste gebruik:

```zymbol
getalle = [3, 1, 4, 1, 5]
@ n:getalle {
    °som += n
}
>> som ¶              // → 14
```

> `°veranderlike` (voorvoegsel) anker bokant die lus — die resultaat is leesbaar ná `@`.
> `veranderlike°` (agtervoegsel) anker binne die lus — dit sterf wanneer die lus eindig.

'n Stelling wat net 'n naam is, lees die veranderlike en gooi die waarde weg, dus waarsku dit:

```zymbol
teller = 5
teller
```

Die samesteller waarsku soos volg (sy boodskappe is altyd in Engels):

```text
warning: this statement does nothing: 'teller' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Dit wil sê: *«hierdie stelling doen niks: 'teller' word gelees en weggegooi»*.

---

## Datatipes

| Tipe | Letterlike | `#?`-etiket | Notas |
|------|-----------|-------------|-------|
| Heelgetal | `42`, `-7` | `###` | Veilige heelgetal: ±(2⁵³ − 1) |
| Dryfpunt | `3.14`, `1.5e10` | `##.` | IEEE-754 dubbel |
| String | `"teks"` | `##"` | Interpolasie: `"Hallo {naam}"` |
| Karakter | `'A'` | `##'` | Een Unicode-kodepunt |
| Boole | `#1`, `#0` | `##?` | NIE numeries — `#1 ≠ 1` |
| Skikking | `[1, 2, 3]` | `##]` | Een tipe, nagegaan |
| Verklaarde mengsel | `#[1, "twee"]` | `##[` | Dieselfde tipe as `[…]`, nie nagegaan |
| Tupel | `(a, b)` | `##)` | Posisioneel, onveranderlik |
| Woordeboek | `#(x: 1, y: 2)` | `##(` | Sleutelgebaseerd, veranderlik |
| Funksie | verwysing na genoemde funksie | `##()` | Eerste klas; wys `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Eerste klas; wys `<lambd/N>` |
| Eenheid | `##_` | `##_` | Afwesigheid — daar is geen null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

'n Heelgetal wat buite die veilige reeks val, is 'n vangbare fout, nooit 'n stil oorloop nie:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "buite reeks" ¶ // → buite reeks
}
```

`##_` is hoe 'n program vra of iets afwesig is:

```zymbol
niks() { }
waarde = niks()
>> (waarde == ##_) ¶     // → #1
```

---

## Uitset en Inset

```zymbol
naam = "Anna"
som = 3
>> "Hallo" ¶             // → Hallo
>> "a=" naam " b=" som ¶ // → a=Anna b=3
>> som#? ¶            // → (###, 1, 3)
```

```zymbol
<< naam
<< "Voer jou naam in: " naam
<< ###(4) "Ouderdom: " ouderdom
```

**Kyk na die vorm van die twee tekens.** `>>` wys na buite: dit haal data uit die program uit. `<<` wys na binne: dit bring data in die program in. Daar is niks om hier te memoriseer nie — die pyl wys in watter rigting die inligting reis, en dieselfde idee kom terug in elke teken wat iets beweeg.

> `¶` en `\\` is ekwivalente nuwe lyne. `>>` voeg nooit een by nie.
> 'n Tipespesifiseerder voor die aansporing valideer tydens lees en vra weer tot die waarde geldig is:
> `##.` Dryfpunt · `##.(T,D)` desimaal · `###(N)` Heelgetal · `##"(N)"` teks · `##'` een Karakter.

Op die hoogste vlak van 'n lêer is `<~` die program se uittree-status:

```zymbol
>> "kontroleer" ¶      // → kontroleer
<~ 0
```

---

## TUI-Primitiewe

Terminaal-koppelvlak-operateurs vir interaktiewe programme. Die meeste vereis 'n `>>| { }`-blok (alternatiewe skerm + rou modus).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Loop"
    @~ 1000
    >>~ (2, 1) > "Klaar."
}
```

```zymbol
>>| {
    [reëls, kolomme] = >>?
    >>~ (1, 1) > "Terminaal: " reëls " x " kolomme
    <<| sleutel
    >>~ (2, 1) > "Ingedruk: " sleutel
}
```

Hier kan jy sien waarom tekens kombineer eerder as vermenigvuldig. Jy weet al dat `<<` inset is en `?` vra sonder toewyding. Slegs een teken is nuut:

- `|` is **een eenheid**, nie die hele stroom nie.

Daarmee lees beide sleutelbordoperateurs hulself:

```text
<<        |             ?
inset     een eenheid   sonder toewyding

<<|   neem EEN sleutel, en wag tot daar een is
<<|?  kyk of daar 'n sleutel IS, en gaan voort as daar nie een is nie
```

Dieselfde aan die ander kant: `>>` stuur, `>>!` stuur **met geweld** (vee die hele skerm uit), terwyl `>>?` **vra** eerder as skryf (hoe groot die terminaal is). Die teken aan die regterkant is die een wat die modus verander, en dit kom altyd laaste.

> `>>!` vee die skerm uit. `>>?` gee `[reëls, kolomme]` terug. `@~ N` slaap N millisekondes.
> `<<|` lees een sleuteldruk (blokkerend); `<<|?` pols sonder om te blokkeer (`'\0'` as daar niks is).
> Pyltjies kom gedekodeer as `'↑' '↓' '←' '→'`; ESC is kode-punt 27.
> Posisionele uitset-tupel: `(reël, kolom, BKS, voorgrond, agtergrond)` — enige slot kan met 'n komma weggelaat word (`>>~ (,,, 196) > "rooi"`).
> BKS-bitmasker: `1`=Vet, `2`=Kursief, `4`=Onderstreep. ANSI 256-kleurpalet (`0`=terminaal-verstek).

---

## Operateurs

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (heelgetaldeling)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
v1 = a == b    // #0
v2 = a <> b    // #1
v3 = a < b     // #0
v4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` dwing nooit: `"5" == 5` is `#0`. Ordening dwing: `"5" > 4` is `#1`, en `"४२" > 5` ook — numeriese teks in enige van die 69 skrifte vergelyk as 'n getal.
> 'n Funksie is net gelyk aan homself, nooit aan 'n ander funksie met dieselfde liggaam nie.

---

## Strings

```zymbol
naam = "Anna"
n = 42
>> "Hallo " naam " jy het " n ¶ // → Hallo Anna jy het 42
beskrywing = "Hallo {naam}, jy het {n}"
>> beskrywing ¶              // → Hallo Anna, jy het 42
```

```zymbol
s = "Hallo wêreld"
lengte = s$#                  // 12
deel = s$[1..5]             // "Hallo"
bevat = s$? "wêreld"          // #1
dele = "a,b,c,d"$/ ','    // [a, b, c, d]
vervang = s$~~["a":"e"]        // "Hello wêreld"
lyn = "─" $* 20
```

> `+` is slegs vir getalle. Vir strings gebruik jukstaposisie of interpolasie.
> `\{` en `\}` is letterlike krulhakies — die ontsnapping is simmetries.

---

## Kontrole-Vloei

```zymbol
x = 7
? x > 100 {
    >> "groot" ¶
} _? x > 0 {
    >> "positief" ¶     // → positief
} _ {
    >> "negatief" ¶
}
```

Hier is twee nuwe tekens, en 'n derde wat uit die kombinasie daarvan kom:

- `?` is **vra**: dit open 'n voorwaarde.
- `_` is **wat nie gespesifiseer is nie**: die tak wat oorbly wanneer geen vraag pas nie.
- `_?` is beide in 'n ry: *as niks gepas het nie, vra weer*.

Daarom word `_?` so geskryf. Dit is nie 'n nuwe simbool om te leer nie — dit is `_` gevolg deur `?`, en dit beteken presies wat sy twee dele beteken, in volgorde gelees.

> Krulhakies `{ }` is **verpligtend**, selfs vir 'n enkele stelling.

---

## Passing

```zymbol
telling = 85
graad = ?? telling {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> graad ¶              // → B
```

```zymbol
temperatuur = -5
toestand = ?? temperatuur {
    < 0  => "ys"
    < 20 => "koud"
    _    => "warm"
}
>> toestand ¶              // → ys
```

Jy weet al dat `?` «vra» is. **`??` is baie keer vra**: om 'n teken te verdubbel, enige plek in die taal, is om verskeie kere te doen wat die teken een keer doen. Een `?` toets een voorwaarde; `??` toets teen 'n lys gevalle.

Alternatiewe word met `||` verbind, en hulle kan patroontipes meng:

```zymbol
sleutel = 'P'
aksie = ?? sleutel {
    'p' || 'P' => "pouse"
    < 0 || > 100 => "buite reeks"
    _ => "geïgnoreer"
}
>> aksie ¶             // → pouse
```

---

## Lusse

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
vrugte = ["appel", "peer", "druiwe"]
@ v:vrugte { >> v " " }
>> ¶                    // → appel peer druiwe
@ k:"Hallo" { >> k "-" }
>> ¶                    // → H-a-l-l-o-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
teller = 0
@:buite {
    teller++
    ? teller >= 3 { @:buite! }
}
>> teller ¶             // → 3
```

`@` is die teken van **tyd**: alles wat herhaal, leef daarin. Om daardie tyd te kort, voeg jy 'n teken langsaan by:

- `@!` — `!` is **geweld**: verlaat die lus nou.
- `@>` — `>` stoot vorentoe: gaan na die volgende draai.
- `@:buite!` — `:` **bind 'n naam**, dus dit sny die lus *met die naam* buite, nie die naaste een nie.

Drie operateurs, en nie een hoef afsonderlik gememoriseer te word nie: hulle is `@` plus 'n teken wat al sê wat dit doen.

> **'n Spesifiseerder is 'n telling of 'n voorwaarde.** 'n `Heelgetal` is 'n telling, een keer geëvalueer — `@ 0` voer die liggaam nul keer uit. Enigiets anders is 'n voorwaarde. Daar is geen waaragtigheid nie: `@ []` en `@ 3.5` word geweier. Om deur 'n versameling te stap, gebruik `@ x:items`; om dit te tel, `@ items$#`.

---

## Funksies

```zymbol
tel_by(a, b) { <~ a + b }
>> tel_by(3, 4) ¶        // → 7
```

```zymbol
faktoriaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriaal(n - 1)
}
>> faktoriaal(5) ¶       // → 120
```

'n Funksie lees die lêer se veranderlikes op waarde, en 'n skryf binne bly binne:

```zymbol
limiet = 100
binne(n) { <~ n < limiet }
>> binne(42) ¶         // → #1
```

Twee tekens verander dit, en beide word **in die handtekening en by die aanroep** geskryf:

```zymbol
verhoog(teller<~) { teller = teller + 1 }
som = 0
verhoog(som<~)
>> som ¶              // → 1
```

> `p~` is 'n werkkopie — die liggaam kan dit hertoewys en die aanroeper bly onaangeraak.
> `p<~` is 'n uitsetparameter — die verandering reis terug. `verhoog(som)` sonder die teken is 'n semantiese fout: die annotasie en die handtekening kan nie uitmekaar dryf nie.

---

## Lambda's en Sluitings

```zymbol
verdubbel = x -> x * 2
som = (a, b) -> a + b
>> verdubbel(5) ¶          // → 10
>> som(3, 7) ¶          // → 10
```

```zymbol
klassifiseer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}
>> klassifiseer(-4) ¶         // → negatief
```

```zymbol
faktor = 3
verdriedubbel = x -> x * faktor
>> verdriedubbel(7) ¶          // → 21
```

```zymbol
maak_opteller(n) { <~ x -> x + n }
tel10_by = maak_opteller(10)
>> tel10_by(5) ¶           // → 15
```

'n Lambda kan glad geen parameters neem nie:

```zymbol
antwoord = () -> 42
>> antwoord() ¶           // → 42
```

> 'n Lambda vang die lêer se veranderlikes **wanneer dit geskep word**; 'n genoemde funksie lees hulle **wanneer dit geroep word**.

---

## Skikkings

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   indeksering is 1-gebaseerd
>> arr[-1] ¶      // → 5   negatief tel van die einde af
>> arr$# ¶        // → 5   lengte
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   voeg by
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  voeg in by posisie 2
>> (arr$- 3) ¶          // → [1, 2]         verwyder eerste voorkoms
>> (arr$-[1]) ¶         // → [2, 3]         verwyder by indeks 1
>> (arr$[1..2]) ¶       // → [1, 2]         sny, beide ente ingesluit
>> (arr$? 3) ¶          // → #1             bevat
```

Hulle begin almal met `$`, die teken van **versameling**, en gaan voort met 'n teken wat sê wat daarin gedoen word: `#` hoeveel, `+` voeg by, `-` verwyder, `?` vra of dit daar is. En soos met `??`, beteken die verdubbeling van die teken om dit deeglik te doen: `$?` vra *of* 'n waarde teenwoordig is, `$??` vra *op hoeveel plekke* en gee almal terug.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   stygend
>> (arr$^-) ¶     // → [3, 2, 1]   dalend
```

**Die reël van die resultaat.** Een operateur, en wat die omringende kode daarmee doen, besluit: gebruik, dit **bou** en laat die oorspronklike onaangeraak; weggegooi, dit **verander**.

```zymbol
arr = [1, 2, 3]
kopie = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> kopie ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` skryf nooit in 'n versameling nie.** `arr[2] = 99` is nie 'n vorm van Zymbol nie — `=` gee 'n waarde aan 'n **NAAM**. Om 'n deel van 'n versameling te verander, is `$~`, in elke versameling.

`[…]` hou een tipe en word nagegaan; 'n doelbewuste mengsel word **verklaar** met `#[…]`:

```zymbol
mengsel = #[1, "twee", #1]
>> mengsel ¶             // → [1, twee, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Multi-Dimensionele Indeksering

`>` daal af in 'n genestelde struktuur. Een groep hakies adresseer een element, hoe diep ook.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   ry 2, kolom 3
>> m[-1>-1] ¶      // → 9   laaste ry, laaste kolom
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          plat: die diagonaal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   gestruktureerd: die hoeke
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` is **nie** 'n vorm van Zymbol nie. Die gekettingde indeks word geweier vir beide lees en skryf — een groep hakies per toegang, en `>` is wat tussen die stappe gaan.

---

## Woordeboeke

'n Tupel met genoemde velde is 'n woordeboek, en sedert v0.0.9 word dit as `#(…)` geskryf.

```zymbol
persoon = #(naam: "Anna", ouderdom: 25)
>> persoon.naam ¶        // → Anna
>> persoon["ouderdom"] ¶    // → 25
```

```zymbol
persoon = #(naam: "Anna", ouderdom: 25)
veld = "naam"
>> persoon[veld] ¶     // → Anna
```

Dit is veranderlik, sleutels kan bygevoeg word, en dit kan deurloop word:

```zymbol
voorraad = #(peer: 4)
voorraad["appel"]$~ 10
@ k:voorraad { >> k "=" voorraad[k] " " }
>> ¶                    // → peer=4 appel=10
```

```zymbol
voorraad = #(peer: 4, appel: 10)
@ (k, v):voorraad { >> k ":" v " " }
>> ¶                    // → peer:4 appel:10
```

> `#()` is die leë woordeboek, wat `()` nooit kon wees nie — dit sou ook die leë tupel moes wees. Die kaal `(x: 1)` word geweier met hierdie boodskap: *a dictionary is written `#(…)`* — «'n woordeboek word as `#(…)` geskryf».
> 'n Woordeboek word per sleutel geadresseer, nooit per posisie nie, dus `persoon[1]` is 'n fout.

---

## Tupels

Tupels is **onveranderlike** geordende houers wat waardes van verskillende tipes hou.

```zymbol
punt = (10, 20)
>> punt[1] ¶           // → 10
data = (42, "Hallo", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Enige poging om 'n tupel in plek te verander, is 'n fout, ongeag die operateur — onveranderlikheid is 'n eienskap van die waarde, nie 'n uitsondering binne elke `$` nie.

---

## Destrukturering

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[eerste, *res] = arr
>> eerste ¶            // → 10
>> res ¶              // → [20, 30, 40, 50]
```

```zymbol
punt = (100, 200)
(px, py) = punt
>> px " " py ¶          // → 100 200
```

```zymbol
persoon = #(naam: "Sanet", ouderdom: 25)
#(naam: n, ouderdom: o) = persoon
>> n " " o ¶            // → Sanet 25
```

> Die vorm van die hakies is getipeer: `[…]` neem 'n skikking, `(…)` 'n tupel, `#(…)` 'n woordeboek. Die laaste naam **absorbeer die res**, dus destrukturering misluk nooit op lengte nie — `(a, b, c) = (1,2,3,4,5)` gee `c = (3,4,5)`, en `##_` wanneer niks oorbly nie.

---

## Hoër-Orde Funksies

```zymbol
getalle = [1, 2, 3, 4, 5]
>> (getalle$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (getalle$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (getalle$< (0, (akk, x) -> akk + x)) ¶ // → 15
```

```zymbol
getalle = [1, 2, 3, 4, 5, 6]
verdubbel(x) { <~ x * 2 }
is_groot(x) { <~ x > 3 }
>> (getalle$> verdubbel) ¶    // → [2, 4, 6, 8, 10, 12]
>> (getalle$| is_groot) ¶    // → [4, 5, 6]
```

```zymbol
basis = [#(naam: "Carla", ouderdom: 28), #(naam: "Sanet", ouderdom: 25)]
volgens_ouderdom = basis$^ (a, b -> a.ouderdom < b.ouderdom)
>> volgens_ouderdom[1].naam ¶     // → Sanet
```

> 'n Genoemde funksie gaan na 'n HOF **sonder hakies**: `getalle$> verdubbel`. Om `getalle$> (verdubbel)` te skryf, is 'n ontledingsfout, want `(` open 'n lambda.

---

## Pypoperateur

```zymbol
verdubbel = x -> x * 2
tel_by = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> verdubbel(_)) ¶    // → 10
>> (10 |> tel_by(_, 5)) ¶  // → 15
>> (5 |> verdubbel(_) |> inc(_)) ¶ // → 11
```

---

## Fouthantering

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deling deur nul" ¶  // → deling deur nul
} :! {
    >> "ander: " _err ¶
} :> {
    >> "hardloop altyd" ¶        // → hardloop altyd
}
```

| Soort | Wanneer |
|------|-------|
| `##Div` | Deling deur nul |
| `##Index` | Indeks buite perke |
| `##Key` | Sleutel nie in 'n woordeboek nie |
| `##Range` | Buite veilige heelgetal-reeks |
| `##Type` | Tipe-mispassing |
| `##Parse` | Data-ontleding |
| `##IO` | Lêer / stelsel |
| `##Network` | Netwerkfoute |
| `##DB` | Databasis |
| `##Time` | 'n Datum wat nie bestaan nie |
| `##_` | Enige fout (vang alles) |

`!` is die teken van **fout en geweld**, en dit word dieselfde gelees in beide families: `$!` vra 'n waarde of dit 'n fout is; `$!!`, met die teken verdubbel, versprei dit opwaarts sonder om te vra.

> Standaardbiblioteek-mislukkings kom terug as **sagte foutwaardes** wat jy met `$!` toets of met `!?` vang, eerder as om te aborteer. `$!!` versprei een na die aanroeper.

---

## Modules

```zymbol
# bereken {
    #> { tel_by, PI }

    PI := 3.14159
    tel_by(a, b) { <~ a + b }
}
```

```zymbol
<# ./bereken => b

>> b::tel_by(5, 3) ¶
>> b.PI ¶
```

```zymbol
# my_biblioteek {
    #> { interne_optelling => som }

    interne_optelling(a, b) { <~ a + b }
}
```

Die twee module-tekens is dieselfde idee, nou op lêers toegepas: `#` is die vlak van **verklaring** — wat iets *is*, nie wat dit werd is nie — en die pyl sê watter rigting die kode beweeg:

```text
<#   die pyl kom in: invoer, bring van 'n ander lêer
#>   die pyl gaan uit: uitvoer, bied aan ander lêers
```

'n Rigtingteken sit altyd op die rand wat na die rigting wys waar dit wys. Dit is dieselfde rede waarom `<~` terugkeer links (uit die funksie) en `->` regs ingaan (in die liggaam van die lambda).

> **'n Module verklaar wat dit uitvoer.** Die `#>`-blok is verpligtend — om dit weg te laat, is **E014**, en `#> { }` is hoe 'n module sê dat sy oppervlak leeg is. `::` roep 'n funksie, `.` lees 'n konstante. Slegs invoere, die uitvoerblok, letterlike inisialiseerders en funksiedefinisies mag in 'n module-liggaam voorkom; enigiets uitvoerbaar is **E013**.

---

## Standaardbiblioteek

Inheemse modules, ingevoer soos enige ander:

| Module | Funksies |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   twee gliewe, vier kolomme
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

dag = T::of(2026, 1, 31)
>> T::format(dag, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(dag, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` meet **vertoonkolomme**, nie karakters nie: CJK en die meeste emoji's is 2 kolomme, dus lê 'n tabel uit met `t::width`, nooit `$#` nie.
> In `std/time` is 'n oomblik millisekondes sedert die epog. Onder 'n dag is dit duur, vanaf 'n dag is dit kalender — dus val 'n maand op dieselfde dag van die maand, vasgeklem. `verskil(a, b)` is `a - b`, dus die vroeër oomblik eerste gee 'n negatiewe antwoord.

---

## Pakkette

'n `.zyp` bundel 'n multi-lêer-program in een draagbare lêer. Dit is 'n argief van **bronkode**, nie binêr nie, dus dit hardloop oral waar 'n `zymbol`-binêre hardloop.

```bash
zymbol package myprojek/ --script main.zy -o myprojek.zyp
zymbol run myprojek.zyp
```

> Die argief dra 'n manifes (`zyp.toml`) wat sy intree-skripte en die enjinweergawe wat dit nodig het, verklaar. `zymbol run` onttrek dit na 'n tydelike gids en hardloop van daar af, dus die kode is weggooibaar terwyl wat die skrip skryf, in jou werklike werkgids beland. Die speelgrond laai ook `.zyp`-lêers.

---

## Syfermodusse

Zymbol kan getalle in **69 Unicode-syferskrifte** skryf — Devanagari, Arabies-Indies, Thai, Klingon pIqaD, Wiskundige Vet, LCD-segmente, en meer. Die modus is globaal vir die proses en beïnvloed uitset; rekenkunde verander nie.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabies-Indies (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // herstel na ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Syfers van enige ondersteunde skrif is geldige letterlikes in die bron:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Lees is simmetries — 'n syfer word in enige skrif verstaan:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` is altyd ASCII, dus `#0` bly visueel onderskeibaar van die syfer nul in elke skrif.
> `#,` en `#^` skryf ook hulle syfers in die aktiewe skrif, en die skeiers volg dit — maar die paar keer nooit om nie: `,` groepeer en `.` skei, in elke skrif.

---

## Data-operateurs

```zymbol
f = ##.42         // na Dryfpunt
i = ###3.7        // na Heelgetal, afgerond  → 4
t = ##!3.7        // na Heelgetal, afgekap  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> 'n Dryfpunt druk as syfers, nooit as 'n eksponent nie, en laat die agterste `.0` weg — `##.42` skryf `42` en is steeds 'n Dryfpunt, soos `f#?` wys.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   mislukkingsveilig: gee inset onveranderd terug
>> ##!'A' ¶        // → 65    kode-punt van 'n Karakter
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          rond af na 2 desimale
>> #!2|pi| ¶       // → 3.14          kap af na 2 desimale
>> #,|1234567| ¶   // → 1,234,567     duisende-skeiers
>> #^|12345.678| ¶ // → 1.2345678e4   wetenskaplike notasie
```

```zymbol
>> 0x41 ¶        // → A   heksadesimaal
>> 0b01000001 ¶  // → A   binêr
>> 0o101 ¶       // → A   oktale
>> 0d65 ¶        // → A   desimaal
```

> 'n Basis-letterlike in die ASCII-reeks is 'n **Karakter**: `0d65 == 'A'` is `#1`, en `0d65 == 65` is `#0`. Al vier basisse spel dieselfde karakter.

---

## Skulpintegrasie

```zymbol
vandag = <\ date +%Y-%m-%d \>
>> "Vandag: " vandag
```

```zymbol
uitset = </"./subskrip.zy"/>
>> uitset
```

> `<\ … \>` vang stdout en stderr, met die agterste nuwe lyn verwyder.
> `>< args` vang die opdragreël-argumente as 'n string-skikking.

---

## Volledige Voorbeeld: FizzBuzz

```zymbol
klassifiseer(getal) {
    ? getal % 15 == 0 { <~ "FizzBuzz" }
    _? getal % 3  == 0 { <~ "Fizz" }
    _? getal % 5  == 0 { <~ "Buzz" }
    <~ getal
}

@ i:1..20 { >> klassifiseer(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (een per lyn)
```

---

## Hoe die Tekens Kombineer

Jy het dieselfde ding regdeur hierdie handleiding gesien: **'n operateur is nie 'n tekening om te memoriseer nie, dit is verskeie tekens in 'n ry, en elkeen dra sy betekenis by.** Nou dat jy hulle almal ken, is hier die volledige patroon.

Eers kom **in watter wêreld ons is**:

| Teken | Wêreld | Jy het dit gesien in |
|--------|-------|----------------------------|
| `$` | 'n versameling | `$#` `$+` `$?` `$^-` |
| `@` | tyd, alles wat herhaal | `@!` `@>` `@~` |
| `#` | wat iets *is*, nie die waarde daarvan nie | `#?` `#(…)` `<#` `#>` |
| `>>` | uit die program | `>>` `>>!` `>>?` |
| `<<` | in die program | `<<` `<<\|` `<<\|?` |
| `?` | vra, sonder toewyding | `?` `_?` `??` `$?` |
| `!` | geweld, of fout | `@!` `$!` `!?` |

Dan kom **wat daar gedoen word**: `+` voeg by, `-` verwyder, `^` orden, `~` wysig, `#` tel, `|` een eenheid, `:` bind 'n naam.

En twee reëls wat nooit misluk nie:

**Om 'n teken te verdubbel, maak dit deeglik.** `?` vra een keer, `??` toets baie gevalle. `$?` vra of 'n waarde daar is, `$??` gee elke plek waar dit is. `!` merk 'n fout, `!!` versprei dit sonder om te vra.

**Die modus-teken kom altyd laaste.** Wanneer `?` of `!` verskyn om te sê *hoe* iets gedoen word — huiwerig of met geweld — is hulle die laaste teken van die operateur: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:buite!`. Daar is nooit 'n operasie ná hulle nie.

Iets prakties volg daaruit: **'n kombinasie wat jy nog nooit gesien het nie, het reeds betekenis voordat jy dit naslaan.** As `$` versameling is en `^` orde is en `-` omgekeerd is, dan sorteer `$^-` dalend, en niemand moes dit vir jou sê nie.

Nie die hele inventaris werk so nie, en om dit te sê is beter as om voor te gee. Die meeste operateurs val netjies uitmekaar. Ses val uitmekaar, maar beteken meer as hulle dele: `!?` `:!` `:>` `|>` `::` `$++`. En tien moet uit die hoof geleer word, want hulle val glad nie uitmekaar nie: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Om die ondeursigtiges te tel eerder as om aan te neem dat hulle min is, is doelbewus: hulle is die taal se werklike memoriseringskoste. Die volledige verwysing — die inventaris, die verklaarde homograwe en die reëls waaraan 'n nuwe operateur moet voldoen om te bestaan — is `SYMBOLS.md`, in die tolk-verwysingsbron.

---

## Simboolverwysing

| Simbool | Operasie | Simbool | Operasie |
|--------|-----------|--------|-----------|
| `=` | veranderlike | `$#` | lengte |
| `:=` | konstante | `$+` | voeg by |
| `>>` | uitset | `$+[i]` | voeg in by indeks (1-gebaseerd) |
| `<<` | inset | `$-` | verwyder eerste per waarde |
| `¶` / `\\` | nuwe lyn | `$--` | verwyder alles per waarde |
| `?` | as | `$-[i]` | verwyder by indeks (1-gebaseerd) |
| `_?` | anders-as | `$-[i..j]` | verwyder reeks (1-gebaseerd) |
| `_` | anders / wildkaart | `$?` | bevat |
| `??` | passing | `$??` | vind alle indekse (1-gebaseerd) |
| `\|\|` | of-patroon in 'n passing-tak | `$[s..e]` | sny (1-gebaseerd) |
| `@` | lus | `$>` | kaart |
| `@ N { }` | lus N keer | `$\|` | filter |
| `@!` | breek | `$<` | verminder |
| `@>` | gaan voort | `$/ skeier` | verdeel string |
| `@:naam { }` | gemerkte lus | `$++ a b c` | bou deur samevoeging |
| `@:naam!` | breek etiket | `$~~[p:r]` | vervang in string |
| `@:naam>` | gaan voort etiket | `$*` | herhaal string |
| `->` | lambda | `arr[i]$~ v` | DIE ENIGSTE opdateringsvorm |
| `<~` | terugkeer / uitsetparameter | `~` | werkkopie-parameter |
| `arr[i>j]` | navigasie-indeks | `arr[p ; q]` | plat onttrekking |
| `$^+` | sorteer stygend | `$^-` | sorteer dalend |
| `$^` | sorteer met vergelyker | `\|>` | pyp |
| `!?` | probeer | `:!` | vang |
| `:>` | uiteindelik | `$!` | is fout |
| `$!!` | versprei fout | `#1` / `#0` | waar / onwaar |
| `##_` | Eenheid — afwesigheid | `[…]` | skikking, een tipe |
| `#[…]` | skikking, verklaarde mengsel | `#(…)` | woordeboek |
| `(…)` | posisionele tupel | `#()` | leë woordeboek |
| `<#` | invoer | `#>` | uitvoer |
| `#` | verklaar module | `::` | roep module |
| `.` | veld / konstante-toegang | `#?` | tipe-metadata |
| `#\|..\|` | ontleed getal | `##.` | skakel oor na Dryfpunt |
| `###` | skakel oor na Heelgetal (rond af) | `##!` | skakel oor na Heelgetal (kap af) |
| `#.N\|..\|` | rond af | `#!N\|..\|` | kap af |
| `#,\|..\|` | duisende-skeiers | `#^\|..\|` | wetenskaplik |
| `#d0d9#` | skakel syfermodus oor | `#09#` | herstel na ASCII |
| `<\ ..\>` | voer skulp uit | `><` | CLI-argumente |
| `\ var` | vernietig veranderlike | `°x` / `x°` | warm definisie |
| `>>\|` | TUI-blok (alternatiewe skerm) | `>>~` | posisionele uitset |
| `>>!` | vee skerm uit | `>>?` | vra terminaalgrootte |
| `<<\|` | blokkerende sleuteldruk | `<<\|?` | nie-blokkerende sleuteldruk |
| `@~ N` | slaap N millisekondes | `0d` `0x` `0o` `0b` | basis-letterlikes |

---

## Vrystellingsveranderingslog

### v0.0.9 — Die Versamelings Het Besluit _(September 2026)_

- **Brekend** Die woordeboek het sy eie notasie: `#(sleutel: waarde)`. Die kaal `(x: 1)` word geweier, en `#()` is die leë woordeboek — wat `()` nooit kon wees nie
- **Brekend** Geïndekseerde toewysing teruggetrek: `arr[i] = v` en alle saamgestelde vorms. `=` gee 'n waarde aan 'n **NAAM**; om 'n deel van 'n versameling te verander, is `$~`
- **Brekend** Die gekettingde indeks `m[i][j]` word geweier vir beide lees en skryf — `>` is wat tussen die stappe gaan
- **Brekend** 'n Module moet verklaar wat dit uitvoer (**E014**); `#> { }` is hoe 'n module sê dat sy oppervlak leeg is
- **Brekend** 'n Lusspesifiseerder is 'n telling of 'n voorwaarde — geen waaragtigheid nie. `@ []` en `@ 3.5` word geweier
- **Bygevoeg** `##_` — die Eenheid-letterlike, en hoe 'n program vra of iets afwesig is
- **Bygevoeg** `#[…]` — 'n skikking waarvan die mengsel van elementtipes verklaar is
- **Bygevoeg** `#?` onderskei die vier versamelings: `##]` `##[` `##)` `##(`
- **Bygevoeg** `std/time` — die horlosie en die burgerlike kalender, met sones en kalenderrekenkunde
- **Bygevoeg** 'n Topvlak-`<~>` is die program se uittree-status
- **Bygevoeg** `@ (k, v):pare` — 'n patroon in die luskop
- **Bygevoeg** `#|c|` lees 'n syfer in enige van die 69 skrifte; `#,` en `#^` skryf in die aktiewe een
- **Verander** `Heelgetal` is 'n veilige heelgetal, ±(2⁵³ − 1), mislukkingsgeslote in elke enjin
- **Verander** 'n Genoemde funksie lees die lêer se veranderlikes op die oomblik van die aanroep, op waarde
- **Verander** 'n Stelling wat net 'n naam lees, waarsku in plaas van om stil verby te gaan
- **Enjins** 660 van die 666 korpus-lêers stem ooreen in al drie enjins, 0 afwykend

### v0.0.8 — Outo-Vrylating, `std/term` en Pakkette _(Augustus 2026)_

- **Bygevoeg** Outomatiese vernietiging by die laaste gebruik — onsigbaar; verlaag slegs die piekgeheue
- **Bygevoeg** `std/term` — vertoonmetrieke in terminaal-kolomme
- **Bygevoeg** `##!` op 'n `Karakter` — sy Unicode-kode-punt
- **Bygevoeg** Of-patrone in passing: `'p' || 'P' => …`, alternatiewe van enige aard in een tak
- **Bygevoeg** Zymbol-pakkette (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Bygevoeg** `<~>` by die aanroep is verpligtend waar die gekalliseerde 'n uitsetparameter verklaar
- **Reggestel** Module-stelsel-pariteit in die register-VM

### v0.0.7 — Inheemse Standaardbiblioteek _(Julie 2026)_

- **Bygevoeg** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — almal met sagte foutwaardes
- **Bygevoeg** Getipeerde/gevalideerde inset: `<< ##.(5,2) "prys: " p`
- **Bygevoeg** Postfiks-operateurs direk in `>>` — geen hakies nodig nie
- **Verander** Mislukkingsgeslote formuleerder: weier om uitset te skryf wat dit nie weer kan lees nie

### v0.0.6 — Verfyning en Wetenskaplike Stdlib _(Junie 2026)_

- **Brekend** `=>` vervang `:` in passing-takke en `<=` in invoer-/uitvoer-aliasse
- **Bygevoeg** `std/math` en `std/random`
- **Bygevoeg** Woordeboek-opdatering per sleutel: `d["k"]$~ waarde`

### v0.0.5 — TUI-Primitiewe en Warm Definisie _(Mei 2026)_

- **Bygevoeg** TUI-blok `>>| { }`, posisionele uitset `>>~`, sleutel-inset `<<|` en `<<|?`
- **Bygevoeg** `>>!` vee skerm uit, `>>?` terminaalgrootte, `@~ N` slaap
- **Bygevoeg** Warm definisie `°x` / `x°`, en string-herhaling `$*`

### v0.0.4 — 1-Gebaseerde Indeksering en Eerste-Klas Funksies _(April 2026)_

- **Brekend** Alle indeksering is **1-gebaseerd** — `arr[1]` is die eerste element
- **Bygevoeg** Genoemde funksies as eerste-klas waardes; module-blok-sintaksis `# naam { }`
- **Bygevoeg** Multi-dimensionele indeksering `arr[i>j>k]` en plat onttrekking `arr[p ; q]`

### v0.0.3 — Unicode-Syferstelsels _(April 2026)_

- **Bygevoeg** 69 Unicode-syferblokke met modus-skakel-teken `#d0d9#`
- **Bygevoeg** Boole-letterlikes in enige skrif — `#१` / `#०`

### v0.0.2 — Herontwerp van die Versameling-API _(Maart 2026)_

- **Bygevoeg** Die `$`-operateurfamilie vir skikkings en strings
- **Bygevoeg** Destruktureringstoewysing en negatiewe indekse

### v0.0.1 — Eerste Openbare Vrystelling _(Maart 2026)_

- Boom-wandelende tolk + register-VM (`--vm`)
- Alle kernkonstruksies: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Volle Unicode-identifiseerders, module-stelsel, lambda's, sluitings, fouthantering
- REPL, LSP, VS Code-uitbreiding, formuleerder (`zymbol fmt`)

---

_Zymbol-Lang — Simbolies. Universeel. Onveranderlik._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lisensie:** hierdie handleiding is gelisensieer onder [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Span. Volle teks: `LICENSE-CC-BY-SA-4.0` in <https://github.com/zymbol-lang/web>. Die tolk en die blaaier-enjin (`zymbol.js`) is afsonderlike werke, gelisensieer onder AGPL-3.0-only.
