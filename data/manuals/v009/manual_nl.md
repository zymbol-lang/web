> **Disclaimer:** Dit document is gemaakt en vertaald door kunstmatige intelligentie (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> De canonieke referentie is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in de interpreter-repository.

---

# Zymbol-Lang Handleiding

> **Herzien voor v0.0.9 — 2026-09-07**

**Zymbol-Lang** is een symbolische programmeertaal. Geen woorden in de grammatica — elk construct is een teken. Werkt identiek in elke menselijke taal.

- Geen `if`, `while`, `return` — alleen `?`, `@`, `<~`
- Volledige Unicode — identificatoren in elke taal of emoji
- Taal-onafhankelijk — de code is overal hetzelfde

**Interpreter-versie**: v0.0.9 | **Testdekking**: 660/666 (drie engines eens, 0 afwijkend)

---

## Variabelen en Constanten

```zymbol
x = 10              // veranderlijke variabele
PI := 3.14159       // constante — hertoewijzing is een runtime-fout
naam = "Anna"
actief = #1         // boolean waar
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

`°` (gradenteken, U+00B0) initialiseert een variabele automatisch op zijn neutrale waarde bij het eerste gebruik:

```zymbol
getallen = [3, 1, 4, 1, 5]
@ n:getallen {
    °som += n
}
>> som ¶              // → 14
```

> `°variabele` (prefix) verankert boven de lus — het resultaat is leesbaar na `@`.
> `variabele°` (suffix) verankert binnen de lus — sterft wanneer de lus eindigt.

Een statement dat alleen een naam is, leest de variabele en gooit de waarde weg, dus waarschuwt het:

```zymbol
teller = 5
teller
```

De compiler waarschuwt als volgt (de berichten zijn altijd in het Engels):

```text
warning: this statement does nothing: 'teller' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Dat wil zeggen: *«dit statement doet niets: 'teller' wordt gelezen en weggegooid»*.

---

## Gegevenstypen

| Type | Literal | `#?`-tag | Opmerkingen |
|------|---------|----------|-------------|
| Geheel getal | `42`, `-7` | `###` | Veilig geheel getal: ±(2⁵³ − 1) |
| Kommagetal | `3.14`, `1.5e10` | `##.` | IEEE-754 dubbel |
| Tekenreeks | `"tekst"` | `##"` | Interpolatie: `"Hallo {naam}"` |
| Karakter | `'A'` | `##'` | Eén Unicode-codepunt |
| Boolean | `#1`, `#0` | `##?` | NIET numeriek — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Eén type, gecontroleerd |
| Gedeclareerde mix | `#[1, "twee"]` | `##[` | Zelfde type als `[…]`, niet gecontroleerd |
| Tupel | `(a, b)` | `##)` | Positioneel, onveranderlijk |
| Woordenboek | `#(x: 1, y: 2)` | `##(` | Op sleutel, veranderlijk |
| Functie | verwijzing naar benoemde functie | `##()` | Eerste klasse; toont `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Eerste klasse; toont `<lambd/N>` |
| Eenheid | `##_` | `##_` | Afwezigheid — er is geen null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Een geheel getal dat het veilige bereik verlaat, is een opvangbare fout, nooit een stille overflow:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "buiten bereik" ¶ // → buiten bereik
}
```

`##_` is hoe een programma vraagt of iets afwezig is:

```zymbol
niets() { }
waarde = niets()
>> (waarde == ##_) ¶     // → #1
```

---

## Uitvoer en Invoer

```zymbol
naam = "Anna"
som = 3
>> "Hallo" ¶             // → Hallo
>> "a=" naam " b=" som ¶ // → a=Anna b=3
>> som#? ¶            // → (###, 1, 3)
```

```zymbol
<< naam
<< "Voer uw naam in: " naam
<< ###(4) "Leeftijd: " leeftijd
```

**Let op de vorm van de twee tekens.** `>>` wijst naar buiten: het haalt gegevens uit het programma. `<<` wijst naar binnen: het brengt gegevens in het programma. Er is hier niets te onthouden — de pijl toont de richting waarin informatie reist, en hetzelfde idee komt terug in elk teken dat iets verplaatst.

> `¶` en `\\` zijn gelijkwaardige regeleinden. `>>` voegt er nooit een toe.
> Een typespecificatie vóór de prompt valideert tijdens het lezen en vraagt opnieuw tot de waarde geldig is:
> `##.` Kommagetal · `##.(T,D)` decimaal · `###(N)` Geheel getal · `##"(N)"` tekst · `##'` één Karakter.

Op het hoogste niveau van een bestand is `<~` de exit-status van het programma:

```zymbol
>> "controleren" ¶      // → controleren
<~ 0
```

---

## TUI-primitieven

Terminal-UI-operatoren voor interactieve programma's. De meeste vereisen een `>>| { }`-blok (alternatief scherm + raw-modus).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Actief"
    @~ 1000
    >>~ (2, 1) > "Klaar."
}
```

```zymbol
>>| {
    [regels, kolommen] = >>?
    >>~ (1, 1) > "Terminal: " regels " x " kolommen
    <<| toets
    >>~ (2, 1) > "Ingedrukt: " toets
}
```

Hier zie je waarom tekens combineren in plaats van vermenigvuldigen. Je weet al dat `<<` invoer is en `?` vraagt zonder zich vast te leggen. Slechts één teken is nieuw:

- `|` is **één eenheid**, niet de hele stroom.

Daarmee lezen beide toetsenbordoperatoren zichzelf:

```text
<<        |             ?
invoer    één eenheid   zonder verplichting

<<|   neem ÉÉN toets, en wacht tot er één is
<<|?  kijk of er een toets IS, en ga verder als er geen is
```

Hetzelfde aan de andere kant: `>>` stuurt, `>>!` stuurt **met geweld** (wist het hele scherm), terwijl `>>?` **vraagt** in plaats van schrijft (hoe groot het terminal is). Het teken aan de rechterkant is degene die de modus verandert, en het komt altijd als laatste.

> `>>!` wist het scherm. `>>?` retourneert `[regels, kolommen]`. `@~ N` slaapt N milliseconden.
> `<<|` leest één toetsaanslag (blokkerend); `<<|?` pollt zonder te blokkeren (`'\0'` als er geen is).
> Pijltoetsen komen gedecodeerd als `'↑' '↓' '←' '→'`; ESC is codepunt 27.
> Positionele uitvoertupel: `(regel, kolom, BKS, voorgrond, achtergrond)` — elke slot kan worden weggelaten met een komma (`>>~ (,,, 196) > "rood"`).
> BKS-bitmasker: `1`=Vet, `2`=Cursief, `4`=Onderstreept. ANSI 256-kleurenpalet (`0`=terminal-standaard).

---

## Operatoren

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (gehele deling)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` dwingt nooit: `"5" == 5` is `#0`. Ordening dwingt: `"5" > 4` is `#1`, en `"४२" > 5` ook — numerieke tekst in een van de 69 schriften wordt als getal vergeleken.
> Een functie is alleen gelijk aan zichzelf, nooit aan een andere functie met hetzelfde lichaam.

---

## Tekenreeksen

```zymbol
naam = "Anna"
n = 42
>> "Hallo " naam " je hebt " n ¶ // → Hallo Anna je hebt 42
beschrijving = "Hallo {naam}, je hebt {n}"
>> beschrijving ¶              // → Hallo Anna, je hebt 42
```

```zymbol
s = "Hallo wereld"
lengte = s$#                  // 12
deel = s$[1..5]             // "Hallo"
bevat = s$? "wereld"          // #1
delen = "a,b,c,d"$/ ','    // [a, b, c, d]
vervang = s$~~["a":"e"]        // "Hello wereld"
lijn = "─" $* 20
```

> `+` is alleen voor getallen. Gebruik voor tekenreeksen naast elkaar plaatsen of interpolatie.
> `\{` en `\}` zijn letterlijke accolades — de escape is symmetrisch.

---

## Controleflow

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

Hier zijn twee nieuwe tekens, en een derde die uit hun combinatie komt:

- `?` is **vragen**: het opent een voorwaarde.
- `_` is **wat niet gespecificeerd is**: de tak die overblijft wanneer geen vraag overeenkomt.
- `_?` is beide op een rij: *als niets overeenkwam, vraag opnieuw*.

Daarom wordt `_?` zo geschreven. Het is geen nieuw symbool om te leren — het is `_` gevolgd door `?`, en het betekent precies wat zijn twee delen betekenen, in volgorde gelezen.

> Accolades `{ }` zijn **verplicht**, zelfs voor één statement.

---

## Overeenkomst

```zymbol
score = 85
cijfer = ?? score {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> cijfer ¶              // → B
```

```zymbol
temperatuur = -5
toestand = ?? temperatuur {
    < 0  => "ijs"
    < 20 => "koud"
    _    => "heet"
}
>> toestand ¶              // → ijs
```

Je weet al dat `?` «vragen» is. **`??` is vele malen vragen**: een teken verdubbelen, waar dan ook in de taal, betekent meerdere keren doen wat het teken één keer doet. Eén `?` test één voorwaarde; `??` test tegen een lijst van gevallen.

Alternatieven worden verbonden met `||`, en ze kunnen patroontypes mengen:

```zymbol
toets = 'P'
actie = ?? toets {
    'p' || 'P' => "pauze"
    < 0 || > 100 => "buiten bereik"
    _ => "genegeerd"
}
>> actie ¶             // → pauze
```

---

## Lussen

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
fruit = ["appel", "peer", "druif"]
@ f:fruit { >> f " " }
>> ¶                    // → appel peer druif
@ t:"Hallo" { >> t "-" }
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
@:buiten {
    teller++
    ? teller >= 3 { @:buiten! }
}
>> teller ¶             // → 3
```

`@` is het teken van **tijd**: alles wat zich herhaalt leeft erin. Om die tijd in te korten voeg je een teken ernaast toe:

- `@!` — `!` is **geweld**: verlaat de lus nu.
- `@>` — `>` duwt vooruit: ga naar de volgende ronde.
- `@:buiten!` — `:` **bindt een naam**, dus dit breekt de lus *met de naam* buiten, niet de dichtstbijzijnde.

Drie operatoren, en geen enkele hoefde apart te worden onthouden: het zijn `@` plus een teken dat al zegt wat het doet.

> **Een specificatie is een aantal of een voorwaarde.** Een `Geheel getal` is een aantal, één keer geëvalueerd — `@ 0` voert het lichaam nul keer uit. Al het andere is een voorwaarde. Er is geen truthiness: `@ []` en `@ 3.5` worden geweigerd. Om een collectie te doorlopen gebruik `@ x:items`; om te tellen `@ items$#`.

---

## Functies

```zymbol
optellen(a, b) { <~ a + b }
>> optellen(3, 4) ¶        // → 7
```

```zymbol
faculteit(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faculteit(n - 1)
}
>> faculteit(5) ¶       // → 120
```

Een functie leest de variabelen van het bestand op waarde, en een schrijfactie binnenin blijft binnenin:

```zymbol
limiet = 100
binnen(n) { <~ n < limiet }
>> binnen(42) ¶         // → #1
```

Twee tekens veranderen dat, en beide worden geschreven **in de signatuur en op de aanroepplaats**:

```zymbol
verhoog(teller<~) { teller = teller + 1 }
som = 0
verhoog(som<~)
>> som ¶              // → 1
```

> `p~` is een werkkopie — het lichaam kan het opnieuw toewijzen en de aanroeper blijft ongewijzigd.
> `p<~` is een uitvoerparameter — de wijziging reist terug. `verhoog(som)` zonder teken is een semantische fout: de annotatie en de signatuur kunnen niet uit elkaar gaan.

---

## Lambda's en Closures

```zymbol
verdubbel = x -> x * 2
som = (a, b) -> a + b
>> verdubbel(5) ¶          // → 10
>> som(3, 7) ¶          // → 10
```

```zymbol
classificeer = x -> {
    ? x > 0 { <~ "positief" }
    _? x < 0 { <~ "negatief" }
    <~ "nul"
}
>> classificeer(-4) ¶         // → negatief
```

```zymbol
factor = 3
verdriedubbel = x -> x * factor
>> verdriedubbel(7) ¶          // → 21
```

```zymbol
maak_opteller(n) { <~ x -> x + n }
optellen10 = maak_opteller(10)
>> optellen10(5) ¶           // → 15
```

Een lambda kan helemaal geen parameters nemen:

```zymbol
antwoord = () -> 42
>> antwoord() ¶           // → 42
```

> Een lambda legt de variabelen van het bestand vast **wanneer hij wordt gemaakt**; een benoemde functie leest ze **wanneer hij wordt aangeroepen**.

---

## Arrays

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   indexering is 1-gebaseerd
>> arr[-1] ¶      // → 5   negatief telt vanaf het einde
>> arr$# ¶        // → 5   lengte
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   toevoegen
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  invoegen op positie 2
>> (arr$- 3) ¶          // → [1, 2]         eerste voorkomen verwijderen
>> (arr$-[1]) ¶         // → [2, 3]         verwijderen op index 1
>> (arr$[1..2]) ¶       // → [1, 2]         slice, beide uiteinden inbegrepen
>> (arr$? 3) ¶          // → #1             bevat
```

Ze beginnen allemaal met `$`, het teken van **collectie**, en gaan verder met een teken dat zegt wat erin wordt gedaan: `#` hoeveel, `+` toevoegen, `-` verwijderen, `?` vragen of het er is. En zoals bij `??` betekent het verdubbelen van het teken het grondig doen: `$?` vraagt *of* een waarde aanwezig is, `$??` vraagt *op hoeveel plaatsen* en retourneert ze allemaal.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   oplopend
>> (arr$^-) ¶     // → [3, 2, 1]   aflopend
```

**De resultaatregel.** Eén operator, en wat de omringende code ermee doet bepaalt: gebruikt, dan **bouwt** het en laat het origineel ongemoeid; weggegooid, dan **wijzigt** het.

```zymbol
arr = [1, 2, 3]
kopie = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> kopie ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` schrijft nooit in een collectie.** `arr[2] = 99` is geen vorm van Zymbol — `=` geeft een waarde aan een **NAAM**. Een deel van een collectie wijzigen is `$~`, in elke collectie.

`[…]` bevat één type en wordt gecontroleerd; een bewuste mix wordt **gedeclareerd** met `#[…]`:

```zymbol
mix = #[1, "twee", #1]
>> mix ¶             // → [1, twee, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Multidimensionale Indexering

`>` daalt af in een geneste structuur. Eén groep haakjes adresseert één element, hoe diep ook.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   rij 2, kolom 3
>> m[-1>-1] ¶      // → 9   laatste rij, laatste kolom
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          plat: de diagonaal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   gestructureerd: de hoeken
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **is geen** vorm van Zymbol. De geketende index wordt geweigerd voor zowel lezen als schrijven — één groep haakjes per toegang, en `>` gaat tussen de stappen.

---

## Woordenboeken

Een tupel met benoemde velden is een woordenboek, en sinds v0.0.9 wordt het geschreven als `#(…)`.

```zymbol
persoon = #(naam: "Anna", leeftijd: 25)
>> persoon.naam ¶        // → Anna
>> persoon["leeftijd"] ¶    // → 25
```

```zymbol
persoon = #(naam: "Anna", leeftijd: 25)
veld = "naam"
>> persoon[veld] ¶     // → Anna
```

Het is veranderlijk, sleutels kunnen worden toegevoegd, en het kan worden doorlopen:

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

> `#()` is het lege woordenboek, wat `()` nooit kon zijn — het zou ook de lege tupel moeten zijn. De kale `(x: 1)` wordt geweigerd met dit bericht: *a dictionary is written `#(…)`* — «een woordenboek wordt geschreven als `#(…)`».
> Een woordenboek wordt geadresseerd op sleutel, nooit op positie, dus `persoon[1]` is een fout.

---

## Tupels

Tupels zijn **onveranderlijke** geordende containers die waarden van verschillende typen bevatten.

```zymbol
punt = (10, 20)
>> punt[1] ¶           // → 10
gegevens = (42, "Hallo", #1, 3.14)
>> gegevens[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Elke poging om een tupel ter plaatse te wijzigen is een fout, wat de operator ook is — onveranderlijkheid is een eigenschap van de waarde, niet een uitzondering binnen elke `$`.

---

## Destructurering

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[eerste, *rest] = arr
>> eerste ¶            // → 10
>> rest ¶              // → [20, 30, 40, 50]
```

```zymbol
punt = (100, 200)
(px, py) = punt
>> px " " py ¶          // → 100 200
```

```zymbol
persoon = #(naam: "Sanne", leeftijd: 25)
#(naam: n, leeftijd: l) = persoon
>> n " " l ¶            // → Sanne 25
```

> De vorm van de haakjes is getypeerd: `[…]` neemt een array, `(…)` een tupel, `#(…)` een woordenboek. De laatste naam **absorbeert de rest**, dus destructurering faalt nooit op lengte — `(a, b, c) = (1,2,3,4,5)` geeft `c = (3,4,5)`, en `##_` wanneer er niets overblijft.

---

## Hogere-Orde Functies

```zymbol
getallen = [1, 2, 3, 4, 5]
>> (getallen$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (getallen$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (getallen$< (0, (acc, x) -> acc + x)) ¶ // → 15
```

```zymbol
getallen = [1, 2, 3, 4, 5, 6]
verdubbel(x) { <~ x * 2 }
is_groot(x) { <~ x > 3 }
>> (getallen$> verdubbel) ¶    // → [2, 4, 6, 8, 10, 12]
>> (getallen$| is_groot) ¶    // → [4, 5, 6]
```

```zymbol
basis = [#(naam: "Carla", leeftijd: 28), #(naam: "Sanne", leeftijd: 25)]
op_leeftijd = basis$^ (a, b -> a.leeftijd < b.leeftijd)
>> op_leeftijd[1].naam ¶     // → Sanne
```

> Een benoemde functie gaat naar een HOF **zonder haakjes**: `getallen$> verdubbel`. `getallen$> (verdubbel)` schrijven is een parseerfout, want `(` opent een lambda.

---

## Pijpoperator

```zymbol
verdubbel = x -> x * 2
optellen = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> verdubbel(_)) ¶    // → 10
>> (10 |> optellen(_, 5)) ¶  // → 15
>> (5 |> verdubbel(_) |> inc(_)) ¶ // → 11
```

---

## Foutafhandeling

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deling door nul" ¶  // → deling door nul
} :! {
    >> "anders: " _err ¶
} :> {
    >> "altijd uitgevoerd" ¶        // → altijd uitgevoerd
}
```

| Type | Wanneer |
|------|---------|
| `##Div` | Deling door nul |
| `##Index` | Index buiten bereik |
| `##Key` | Sleutel niet in woordenboek |
| `##Range` | Buiten veilig geheel-getalbereik |
| `##Type` | Type komt niet overeen |
| `##Parse` | Gegevens parseren |
| `##IO` | Bestand / systeem |
| `##Network` | Netwerkfouten |
| `##DB` | Database |
| `##Time` | Een datum die niet bestaat |
| `##_` | Elke fout (vangt alles) |

`!` is het teken van **fout en geweld**, en wordt op dezelfde manier gelezen in beide families: `$!` vraagt een waarde of het een fout is; `$!!`, met een verdubbeld teken, propageert het omhoog zonder te vragen.

> Storingen van de standaardbibliotheek komen terug als **zachte foutwaarden** die je test met `$!` of opvangt met `!?`, in plaats van af te breken. `$!!` propageert er één naar de aanroeper.

---

## Modules

```zymbol
# calc {
    #> { optellen, PI }

    PI := 3.14159
    optellen(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::optellen(5, 3) ¶
>> c.PI ¶
```

```zymbol
# mijn_bib {
    #> { interne_optelling => som }

    interne_optelling(a, b) { <~ a + b }
}
```

De twee moduletekens zijn hetzelfde idee, nu toegepast op bestanden: `#` is het niveau van de **declaratie** — wat iets *is*, niet wat het waard is — en de pijl zegt welke richting de code op gaat:

```text
<#   de pijl komt binnen: importeren, uit een ander bestand halen
#>   de pijl gaat naar buiten: exporteren, aan andere bestanden aanbieden
```

Een richtingsteken zit altijd op de rand die naar de richting wijst waar het naar wijst. Dat is dezelfde reden waarom `<~` naar links terugkeert (uit de functie) en `->` naar rechts binnenkomt (in het lichaam van de lambda).

> **Een module declareert wat hij exporteert.** Het `#>`-blok is verplicht — het weglaten is **E014**, en `#> { }` is hoe een module zegt dat zijn oppervlak leeg is. `::` roept een functie aan, `.` leest een constante. Alleen imports, het exportblok, letterlijke initialisaties en functiedefinities mogen in een modulelichaam voorkomen; alles wat uitvoerbaar is, is **E013**.

---

## Standaardbibliotheek

Native modules, geïmporteerd zoals alle andere:

| Module | Functies |
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

>> t::width("手番") ¶            // → 4   twee glyphs, vier kolommen
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

dag = T::of(2026, 1, 31)
>> T::format(dag, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(dag, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` meet **weergavekolommen**, niet tekens: CJK en de meeste emoji's zijn 2 kolommen, dus rangschik een tabel met `t::width`, nooit met `$#`.
> In `std/time` is een moment milliseconden sinds het tijdperk. Onder een dag is duur, vanaf een dag is kalender — dus een maand valt op dezelfde dag van de maand, geklemd. `verschil(a, b)` is `a - b`, dus het eerdere moment eerst geeft een negatief antwoord.

---

## Pakketten

Een `.zyp` bundelt een bestand met meerdere bestanden in één draagbaar bestand. Het is een archief van **broncode**, geen binair bestand, dus het werkt overal waar een `zymbol`-binair bestand werkt.

```bash
zymbol package mijnproject/ --script main.zy -o mijnproject.zyp
zymbol run mijnproject.zyp
```

> Het archief bevat een manifest (`zyp.toml`) dat zijn entry-scripts en de vereiste engine-versie declareert. `zymbol run` pakt het uit naar een tijdelijke map en voert het van daaruit uit, dus de code is wegwerpbaar terwijl wat het script schrijft in je echte werkmap terechtkomt. De speeltuin laadt ook `.zyp`-bestanden.

---

## Numerieke Modi

Zymbol kan getallen schrijven in **69 Unicode-cijferschriften** — Devanagari, Arabisch-Indisch, Thais, Klingon pIqaD, Mathematical Bold, LCD-segmenten en meer. De modus is globaal voor het proces en beïnvloedt de uitvoer; de rekenkunde verandert niet.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabisch-Indisch (U+0660–U+0669)
#๐๙#    // Thais         (U+0E50–U+0E59)
#09#    // reset naar ASCII
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

Cijfers van elk ondersteund schrift zijn geldige literals in de bron:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Lezen is symmetrisch — een cijfer wordt in elk schrift begrepen:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` is altijd ASCII, dus `#0` blijft visueel onderscheiden van het cijfer nul in elk schrift.
> `#,` en `#^` schrijven hun cijfers ook in het actieve schrift, en de scheidingstekens volgen het — maar het paar keert nooit om: `,` groepeert en `.` scheidt, in elk schrift.

---

## Gegevensoperatoren

```zymbol
f = ##.42         // naar Kommagetal
i = ###3.7        // naar Geheel getal, afgerond  → 4
t = ##!3.7        // naar Geheel getal, afgekapt  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Een Kommagetal wordt afgedrukt als cijfers, nooit als exponent, en laat de afsluitende `.0` weg — `##.42` schrijft `42` en is nog steeds een Kommagetal, zoals `f#?` toont.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   faalveilig: retourneert de invoer ongewijzigd
>> ##!'A' ¶        // → 65    codepunt van een Karakter
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          afronden op 2 decimalen
>> #!2|pi| ¶       // → 3.14          afkappen op 2 decimalen
>> #,|1234567| ¶   // → 1,234,567     duizendtallen-scheidingstekens
>> #^|12345.678| ¶ // → 1.2345678e4   wetenschappelijke notatie
```

```zymbol
>> 0x41 ¶        // → A   hexadecimaal
>> 0b01000001 ¶  // → A   binair
>> 0o101 ¶       // → A   octaal
>> 0d65 ¶        // → A   decimaal
```

> Een basisliteral binnen het ASCII-bereik is een **Karakter**: `0d65 == 'A'` is `#1`, en `0d65 == 65` is `#0`. Alle vier de basissen spellen hetzelfde karakter.

---

## Shell-integratie

```zymbol
vandaag = <\ date +%Y-%m-%d \>
>> "Vandaag: " vandaag
```

```zymbol
uitvoer = </"./subscript.zy"/>
>> uitvoer
```

> `<\ … \>` vangt stdout en stderr op, met de afsluitende nieuwe regel verwijderd.
> `>< args` vangt de opdrachtregelargumenten op als een tekenreeks-array.

---

## Volledig Voorbeeld: FizzBuzz

```zymbol
classificeer(getal) {
    ? getal % 15 == 0 { <~ "FizzBuzz" }
    _? getal % 3  == 0 { <~ "Fizz" }
    _? getal % 5  == 0 { <~ "Buzz" }
    <~ getal
}

@ i:1..20 { >> classificeer(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (één per regel)
```

---

## Hoe Tekens Combineren

Je hebt dit het hele handboek door gezien: **een operator is geen tekening om te onthouden, het zijn meerdere tekens op een rij, en elk draagt zijn betekenis bij.** Nu je ze allemaal kent, is hier het volledige patroon.

Eerst komt **in welke wereld we ons bevinden**:

| Teken | Wereld | Je zag het in |
|--------|-------|----------------------------|
| `$` | een collectie | `$#` `$+` `$?` `$^-` |
| `@` | tijd, alles wat zich herhaalt | `@!` `@>` `@~` |
| `#` | wat iets *is*, niet zijn waarde | `#?` `#(…)` `<#` `#>` |
| `>>` | uit het programma | `>>` `>>!` `>>?` |
| `<<` | in het programma | `<<` `<<\|` `<<\|?` |
| `?` | vragen, zonder verplichting | `?` `_?` `??` `$?` |
| `!` | geweld, of fout | `@!` `$!` `!?` |

Dan komt **wat daar wordt gedaan**: `+` toevoegen, `-` verwijderen, `^` ordenen, `~` wijzigen, `#` tellen, `|` één eenheid, `:` een naam binden.

En twee regels die nooit falen:

**Een teken verdubbelen maakt het grondig.** `?` vraagt één keer, `??` test vele gevallen. `$?` vraagt of een waarde aanwezig is, `$??` retourneert elke plaats waar het is. `!` markeert een fout, `!!` propageert het zonder te vragen.

**Het modusteken komt altijd als laatste.** Wanneer `?` of `!` verschijnen om te zeggen *hoe* iets wordt gedaan — aarzelend of met geweld — zijn ze het laatste teken van de operator: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:buiten!`. Er is nooit een operatie na hen.

Daaruit volgt iets praktisch: **een combinatie die je nooit hebt gezien, heeft al betekenis voordat je hem opzoekt.** Als `$` een collectie is en `^` een ordening en `-` een omkering, dan sorteert `$^-` aflopend, en niemand hoefde het je te vertellen.

Niet de hele inventaris werkt zo, en dat zeggen is beter dan doen alsof. De meeste operatoren splitsen netjes. Zes splitsen maar betekenen meer dan hun delen: `!?` `:!` `:>` `|>` `::` `$++`. En tien moeten uit het hoofd worden geleerd omdat ze helemaal niet splitsen: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> De ondoorzichtige tellen in plaats van aannemen dat het er weinig zijn is met opzet: ze zijn de werkelijke memorisatiekosten van de taal. De volledige referentie — de inventaris, de gedeclareerde homografen, en de regels waaraan een nieuwe operator moet voldoen om te bestaan — staat in `SYMBOLS.md`, in de interpreter-repository.

---

## Symbolenreferentie

| Symbool | Operatie | Symbool | Operatie |
|---------|----------|---------|----------|
| `=` | variabele | `$#` | lengte |
| `:=` | constante | `$+` | toevoegen |
| `>>` | uitvoer | `$+[i]` | invoegen op index (1-gebaseerd) |
| `<<` | invoer | `$-` | eerste op waarde verwijderen |
| `¶` / `\\` | nieuwe regel | `$--` | alle op waarde verwijderen |
| `?` | als | `$-[i]` | verwijderen op index (1-gebaseerd) |
| `_?` | anders-als | `$-[i..j]` | bereik verwijderen (1-gebaseerd) |
| `_` | anders / jokerteken | `$?` | bevat |
| `??` | overeenkomst | `$??` | alle indices vinden (1-gebaseerd) |
| `\|\|` | of-patroon in een match-tak | `$[s..e]` | slice (1-gebaseerd) |
| `@` | lus | `$>` | in kaart brengen |
| `@ N { }` | lus N keer | `$\|` | filteren |
| `@!` | onderbreken | `$<` | reduceren |
| `@>` | doorgaan | `$/ scheidingsteken` | tekenreeks splitsen |
| `@:naam { }` | gelabelde lus | `$++ a b c` | opbouwen door aaneenschakeling |
| `@:naam!` | label onderbreken | `$~~[p:r]` | tekenreeks vervangen |
| `@:naam>` | label doorgaan | `$*` | tekenreeks herhalen |
| `->` | lambda | `arr[i]$~ v` | DE ENIGE updatevorm |
| `<~` | terugkeer / uitvoerparameter | `~` | werkkopie-parameter |
| `arr[i>j]` | navigatie-index | `arr[p ; q]` | platte extractie |
| `$^+` | oplopend sorteren | `$^-` | aflopend sorteren |
| `$^` | sorteren met vergelijker | `\|>` | pijp |
| `!?` | proberen | `:!` | vangen |
| `:>` | ten slotte | `$!` | is fout |
| `$!!` | fout propageren | `#1` / `#0` | waar / onwaar |
| `##_` | Eenheid — afwezigheid | `[…]` | array, één type |
| `#[…]` | array, gedeclareerde mix | `#(…)` | woordenboek |
| `(…)` | positionele tupel | `#()` | leeg woordenboek |
| `<#` | importeren | `#>` | exporteren |
| `#` | module declareren | `::` | module aanroepen |
| `.` | veld / constante-toegang | `#?` | type-metadata |
| `#\|..\|` | getal parseren | `##.` | converteren naar Kommagetal |
| `###` | converteren naar Geheel getal (afronden) | `##!` | converteren naar Geheel getal (afkappen) |
| `#.N\|..\|` | afronden | `#!N\|..\|` | afkappen |
| `#,\|..\|` | duizendtallen-scheidingstekens | `#^\|..\|` | wetenschappelijk |
| `#d0d9#` | numerieke modus wisselen | `#09#` | reset naar ASCII |
| `<\ ..\>` | shell uitvoeren | `><` | CLI-argumenten |
| `\ var` | variabele vernietigen | `°x` / `x°` | hete definitie |
| `>>\|` | TUI-blok (alternatief scherm) | `>>~` | positionele uitvoer |
| `>>!` | scherm wissen | `>>?` | terminalgrootte opvragen |
| `<<\|` | blokkerende toetsaanslag | `<<\|?` | niet-blokkerende toetsaanslag |
| `@~ N` | N milliseconden slapen | `0d` `0x` `0o` `0b` | basisliterals |

---

## Release Changelog

### v0.0.9 — De Collecties Hebben Beslist _(september 2026)_

- **Brekend** Het woordenboek heeft zijn eigen notatie: `#(sleutel: waarde)`. De kale `(x: 1)` wordt geweigerd, en `#()` is het lege woordenboek — wat `()` nooit kon zijn
- **Brekend** Geïndexeerde toewijzing ingetrokken: `arr[i] = v` en alle samengestelde vormen. `=` geeft een waarde aan een **NAAM**; een deel van een collectie wijzigen is `$~`
- **Brekend** De geketende index `m[i][j]` wordt geweigerd voor zowel lezen als schrijven — `>` gaat tussen de stappen
- **Brekend** Een module moet declareren wat hij exporteert (**E014**); `#> { }` is hoe een module zegt dat zijn oppervlak leeg is
- **Brekend** Een lusspecificatie is een aantal of een voorwaarde — geen truthiness. `@ []` en `@ 3.5` worden geweigerd
- **Toegevoegd** `##_` — het Eenheid-literal, en hoe een programma vraagt of iets afwezig is
- **Toegevoegd** `#[…]` — een array waarvan de mix van elementtypen is gedeclareerd
- **Toegevoegd** `#?` onderscheidt de vier collecties: `##]` `##[` `##)` `##(`
- **Toegevoegd** `std/time` — de klok en de burgerlijke kalender, met zones en kalenderrekenkunde
- **Toegevoegd** Een top-level `<~>` is de exit-status van het programma
- **Toegevoegd** `@ (k, v):paren` — een patroon in de luskop
- **Toegevoegd** `#|c|` leest een cijfer in een van de 69 schriften; `#,` en `#^` schrijven in het actieve
- **Gewijzigd** `Geheel getal` is een veilig geheel getal, ±(2⁵³ − 1), fail-closed in elke engine
- **Gewijzigd** Een benoemde functie leest de variabelen van het bestand op het moment van aanroep, op waarde
- **Gewijzigd** Een statement dat alleen een naam leest, waarschuwt in plaats van stil door te gaan
- **Engines** 660 van de 666 corpusbestanden komen overeen in alle drie de engines, 0 afwijkend

### v0.0.8 — Automatische Vrijgave, `std/term` en Pakketten _(augustus 2026)_

- **Toegevoegd** Automatische vernietiging bij laatste gebruik — onzichtbaar; verlaagt alleen de piekgeheugen
- **Toegevoegd** `std/term` — weergavemetrieken in terminalkolommen
- **Toegevoegd** `##!` op een `Karakter` — zijn Unicode-codepunt
- **Toegevoegd** Of-patronen in match: `'p' || 'P' => …`, alternatieven van elk type in één tak
- **Toegevoegd** Zymbol-pakketten (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Toegevoegd** `<~>` op de aanroepplaats is verplicht waar de aanroepene een uitvoerparameter declareert
- **Opgelost** Module-systeempariteit in de register-VM

### v0.0.7 — Native Standaardbibliotheek _(juli 2026)_

- **Toegevoegd** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — allemaal met zachte foutwaarden
- **Toegevoegd** Gettypeerde/gevalideerde invoer: `<< ##.(5,2) "prijs: " p`
- **Toegevoegd** Postfix-operatoren direct in `>>` — geen haakjes nodig
- **Gewijzigd** Fail-closed formatter: weigert uitvoer te schrijven die het niet opnieuw kan lezen

### v0.0.6 — Verfijning en Wetenschappelijke Stdlib _(juni 2026)_

- **Brekend** `=>` vervangt `:` in match-takken en `<=` in import/export-aliassen
- **Toegevoegd** `std/math` en `std/random`
- **Toegevoegd** Woordenboek-update op sleutel: `d["k"]$~ waarde`

### v0.0.5 — TUI-primitieven en Hete Definitie _(mei 2026)_

- **Toegevoegd** TUI-blok `>>| { }`, positionele uitvoer `>>~`, toetsinvoer `<<|` en `<<|?`
- **Toegevoegd** `>>!` scherm wissen, `>>?` terminalgrootte, `@~ N` slapen
- **Toegevoegd** Hete definitie `°x` / `x°`, en tekenreeksherhaling `$*`

### v0.0.4 — 1-Gebaseerde Indexering en Eerste-Klas Functies _(april 2026)_

- **Brekend** Alle indexering is **1-gebaseerd** — `arr[1]` is het eerste element
- **Toegevoegd** Benoemde functies als eerste-klas waarden; module-bloksyntaxis `# naam { }`
- **Toegevoegd** Multidimensionale indexering `arr[i>j>k]` en platte extractie `arr[p ; q]`

### v0.0.3 — Unicode-Cijfersystemen _(april 2026)_

- **Toegevoegd** 69 Unicode-cijferblokken met moduswisseltoken `#d0d9#`
- **Toegevoegd** Boolean-literals in elk schrift — `#१` / `#०`

### v0.0.2 — Herontwerp van de Collectie-API _(maart 2026)_

- **Toegevoegd** De `$`-operatorfamilie voor arrays en tekenreeksen
- **Toegevoegd** Destructureringstoewijzing en negatieve indices

### v0.0.1 — Eerste Publieke Release _(maart 2026)_

- Boom-wandelende interpreter + register-VM (`--vm`)
- Alle kernconstructen: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Volledige Unicode-identificatoren, modulesysteem, lambda's, closures, foutafhandeling
- REPL, LSP, VS Code-extensie, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Symbolisch. Universeel. Onveranderlijk._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licentie:** deze handleiding is gelicentieerd onder [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Volledige tekst: `LICENSE-CC-BY-SA-4.0` in <https://github.com/zymbol-lang/web>. De interpreter en de browser-engine (`zymbol.js`) zijn afzonderlijke werken, gelicentieerd onder AGPL-3.0-only.
