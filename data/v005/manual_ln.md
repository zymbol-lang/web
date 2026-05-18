> **Bobebisi:** Ekakoli oyo esalemi mpe ebalongolami na mayele ya makambo (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Motindo ya ndenge ya kosala ezali **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** na ebombelo ya mobongoli.

---

# Libele ya Zymbol-Lang

> **Etaleli mpo na v0.0.5 — 2026-05-14**

**Zymbol-Lang** ezali monɔkɔ ya kosala bilembo. Ezali na maloba ya nsé te — nyonso ezali elembo. Esalaka ndenge moko na monɔkɔ nyonso ya moto.

- Ezali na `if`, `while`, `return` te — kaka `?`, `@`, `<~`
- Unicode ya mobimba — banteni na monɔkɔ nyonso to emoji
- Ezali na boyokani na monɔkɔ ya moto te — kode ezali ndenge moko bisika nyonso

**Mbongwana ya mobongoli**: v0.0.5 | **Kotikala ya mekano**: 436/436 (kokokana TW ↔ VM)

---

## Bikelamo mpe Bakokani

```zymbol
x = 10              // bikelamo oyo ebongisami
π := 3.14159        // bakokani — kopesa lisusu ezali libunga na ntango ya kosala
kombo = "Alice"
mosala = #1         // boolean ya solo
👋 := "Mbote"
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

`°` (elembo ya degré, U+00B0) ebandisaka bikelamo moko na moto oyo ezali na katikati na ntango ya liboso ya kosalela:

```zymbol
motango = [3, 1, 4, 1, 5]
@ n:motango {
    °mosangiseli += n    // ebandi moko na moko na 0 likolo ya loop; esalaka nsima ya @
}
>> mosangiseli ¶         // → 14
```

> `°x` (liboso) ezali na likolo ya loop — ndimbo ekoki kozuama nsima ya `@`.
> `x°` (nsima) ezali na kati ya loop — ekufaka ntango loop ekoti.
> Tree-walker kaka.

---

## Bikorá ya ba Données

| Korá | Liloba ya solo | Elembo `#?` | Maloba |
|------|---------|----------|---------|
| Motango mobimba | `42`, `-7` | `###` | 64-bit na elembo |
| Motango oyo ezali na nse | `3.14`, `1.5e10` | `##.` | Bokomi ya siansi endimami |
| Nkoku | `"mokanda"` | `##"` | Kotya na kati: `"Mbote {kombo}"` |
| Mokanda | `'A'` | `##'` | Mokanda moko ya Unicode |
| Boolean | `#1`, `#0` | `##?` | Ezali motango te — `#1 ≠ 1` |
| Lilongo | `[1, 2, 3]` | `##]` | Bileko ya lolenge moko |
| Tuple | `(a, b)` | `##)` | Na esika |
| Tuple oyo ezali na kombo | `(x: 1, y: 2)` | `##)` | Bisika oyo ezali na kombo |
| Mosala | nzela ya mosala oyo ezali na kombo | `##()` | Etuluku ya liboso; emonisi `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Etuluku ya liboso; emonisi `<lambd/N>` |

```zymbol
// Kotala kati ya lolenge — ezongisaka (lolenge, motango, motuya)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Nsima mpe Koma

```zymbol
>> "Mbote" ¶                       // ¶ to \\ mpo na mobembo ya sika ya polele
>> "a=" a " b=" b ¶               // kotya sima — ba valeurs ebele
>> (arr$#) ¶                      // basaleli ya nsima balingi ( ) na >>

>> kombo                           // tanga na bikelamo (na ntango te)
>> "Kotya kombo: " kombo            // na ntango
```

> `¶` (AltGr+R na clavier ya Espagne) mpe `\\` bazali ndenge moko ya kobimisa molɔngɔ.

---

## Ntoma ya TUI

Basaleli ya moto na terminal mpo na baprograme oyo ezali na nzela. Ebele balingi bloc `>>| { }` (skrin oyo esangani + ndenge ya liboso).

```zymbol
>>| {
    >>!                             // kopanza skrin oyo esangani
    >>~ (1, 1, 0, 10) > "Ezali kosala"   // nzela 1, colonne 1, fg=10 (vert)
    @~ 1000                         // kotinga sekunde moko (1000 ms)
    >>~ (2, 1) > "Ekokisama."
}
// terminal ezongisami moko na moko ntango obimi
```

```zymbol
// Kotya key mpe monene ya terminal
>>| {
    [nzela, colonne] = >>?              // tala monene ya terminal
    >>~ (1, 1) > "Terminal: " nzela " x " colonne
    <<| key                         // tanga kotya key oyo ezipi
    >>~ (2, 1) > "Otiki: " key
}
```

> `>>!` epanzaka skrin. `>>?` ezongisaka `[nzela, colonne]`. `@~ N` elalaka N milliseconde.
> `<<|` etangaka kotya key moko (ezipi); `<<|?` emonaka na kozipa te (ezongisaka `'\0'` soki ezali te).
> Tuple ya nsima na esika: `(nzela, colonne, BKS, fg, bg)` — esika nyonso ekoki kotikala na virgule (`>>~ (,,, 196) > "motane"`).
> BKS bitmask: `1`=molende, `2`=pembe, `4`=nzela na nse. ANSI 256 paleti ya balangi (`0`=ndenge ya moto ya terminal).
> Tree-walker kaka (longola `>>!`, `>>?`, `@~`, `>>~` oyo esalaka mpe na `--vm`).

---

## Basaleli

```zymbol
// Kotanga motango
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (bokaboli ya motango mobimba)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kotombola)

// Kokokanisa — pesa mpo na kotala
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a <= b    // #0
k5 = a > b     // #1
k6 = a >= b    // #1

// Ya mayele
m1 = #1 && #0    // #0
m2 = #1 || #0    // #1
m3 = !#1         // #0
```

---

## Nkoku

```zymbol
// Banzela mibale ya kosangisa
kombo = "Alice"
n = 42

>> "Mbote " kombo " ozali na " n ¶       // kotya sima — na >>
liloba = "Mbote {kombo}, ozali na {n}"     // kotya na kati — bisika nyonso
```

```zymbol
s = "Mbote molongo"
monene = s$#                  // 11
kati = s$[1..5]             // "Mbote"  (1-liboso, nsuka ezali na kati)
ezali = s$? "molongo"          // #1
bikaboli = "a,b,c,d"$/ ','   // [a, b, c, d]  (kabola na kati-kati)
kobongola = s$~~["l":"r"]        // "Mbote molongo" (ezali na 'l' te)
kobongola1 = s$~~["l":"r":1]     // "Mbote molongo"
monene = "─" $* 20           // "────────────────────"  (kobongola N mikolo)
```

> `+` ezali mpo na motango kaka. Mpo na nkoku, salela `,`, kotya sima, to kotya na kati.

---

## Nzela ya Kotambwisa

```zymbol
x = 7

? x > 0 { >> "malamu" ¶ }

? x > 100 {
    >> "monene" ¶
} _? x > 0 {
    >> "malamu" ¶
} _? x == 0 {
    >> "zéro" ¶
} _ {
    >> "mabe" ¶
}
```

> Bilembo `{ }` **bazali na tina** ata soki ezali na liloba moko.

---

## Kokokana

```zymbol
// Ba contours
point = 85
grade = ?? point {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> grade ¶    // → B

// Nkoku
lángi = "motane"
code = ?? lángi {
    "motane"   => "#FF0000"
    "vert" => "#00FF00"
    _       => "#000000"
}

// Nzela ya kokokanisa
chaleur = -5
état = ?? chaleur {
    < 0  => "glace"
    < 20 => "malili"
    < 35 => "moi"
    _    => "sika"
}
>> état ¶    // → glace

// Nzela ya liloba (bileko ya bloc)
n = -3
?? n {
    0    => { >> "zéro" ¶ }
    < 0  => { >> "mabe" ¶ }
    _    => { >> "malamu" ¶ }
}
```

---

## Ba Loops

```zymbol
@ i:0..4  { >> i " " }        // contour ya kokotisa:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // na pas:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // nsima:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (ntango)

mbuma = ["pomme", "poire", "raisin"]
@ m:mbuma { >> m ¶ }         // mpo na eloko nyonso na lilongo

@ k:"hello" { >> k "-" }
>> ¶                          // → h-e-l-l-o-  (mpo na monoko nyonso na nkoku)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> kolanda
    ? i > 7 { @! }             // @! kobuka
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop oyo ekokaki te
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop oyo ezali na nzela (kobuka ya kati)
kompteur = 0
@:libanda {
    kompteur++
    ? kompteur >= 3 { @:libanda! }
}
>> kompteur ¶                    // → 3
```

---

## Ba Fonctions

```zymbol
sangisa(a, b) { <~ a + b }
>> sangisa(3, 4) ¶    // → 7

factoriel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factoriel(n - 1)
}
>> factoriel(5) ¶    // → 120
```

Ba fonctions bazali na **esika ya mosika** — bakoki kotanga bikelamo ya libanda te. Salela paramètres ya nsima `<~>` mpo kobongola bikelamo ya moto oyo azali kobenga:

```zymbol
kobongola(a<~, b<~) {
    na ntango = a
    a = b
    b = na ntango
}
x = 10
y = 20
kobongola(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ba fonctions oyo ezali na kombo bazali **ba valeurs ya etuluku ya liboso** — pésa bango mibale: `motango$> kati_kabale`. Mpo na kokanga: `x -> fn(x)` ezali mpe kosala.

---

## Lambda mpe Ba Closures

```zymbol
kati_kabale = x -> x * 2
sangisa = (a, b) -> a + b
>> kati_kabale(5) ¶    // → 10
>> sangisa(3, 7) ¶  // → 10

// Bloc ya lambda
kokabola = x -> {
    ? x > 0 { <~ "malamu" }
    _? x < 0 { <~ "mabe" }
    <~ "zéro"
}

// Closure — ezuaka esika ya libanda
eloko = 3
misato = x -> x * eloko
>> misato(7) ¶    // → 21

// Fabrique
mosali_ya_sangisa(n) { <~ x -> x + n }
sangisa_zomi = mosali_ya_sangisa(10)
>> sangisa_zomi(5) ¶    // → 15

// Na lilongo
basaleli = [x -> x+1, x -> x*2, x -> x*x]
>> basaleli[3](5) ¶    // → 25
```

---

## Lilongo

Ba lilongo **ebongisami** mpe ezalaka na **lolenge moko**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — kozwa (1-ndambo: eloko ya liboso)
x = arr[-1]     // 5 — index négatif (eloko ya nsuka)
x = arr$#       // 5 — monene (salela (arr$#) na >>)

arr = arr$+ 6            // sangisa → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // kotya na esika 2 (1-ndambo)
arr3 = arr$- 3           // kolongola likambo ya liboso ya motuya
arr4 = arr$-- 3          // kolongola ba likambo nyonso
arr5 = arr$-[1]          // kolongola na index 1 (eloko ya liboso)
arr6 = arr$-[2..3]       // kolongola contour (1-ndambo, nsuka ezali na kati)

ezali = arr$? 3            // #1 — ezali na kati
bisika = arr$?? 3           // [3] — index nyonso ya motuya (1-ndambo)
kaboli = arr$[1..3]          // [1,2,3] — kaboli (1-ndambo, nsuka ezali na kati)
kaboli2 = arr$[1:3]          // [1,2,3] — ndenge moko, syntax ya ndambo ya kotanga

komata = arr$^+             // pona na komata (baprimitif kaka)
kokita = arr$^-            // pona na kokita (baprimitif kaka)

// Lilongo ya tuple oyo ezali na kombo/esika — salela $^ na lambda ya kokokanisa
database = [(kombo: "Carla", mbula: 28), (kombo: "Ana", mbula: 25), (kombo: "Bob", mbula: 30)]
na_ndembo_mbula  = database$^ (a, b -> a.mbula < b.mbula)    // na ndembo ya mbula komata (<)
na_ndembo_kombo = database$^ (a, b -> a.kombo > b.kombo)   // na ndembo ya kombo kokita (>)
>> na_ndembo_mbula[1].kombo ¶     // → Ana
>> na_ndembo_kombo[1].kombo ¶    // → Carla

// Kobongola eloko moko (lilongo kaka)
arr[1] = 99              // pésa
arr[2] += 5              // kosangisa: +=  -=  *=  /=  %=  ^=

// Kobongola ya fonction — ezongisaka lilongo ya sika; ya libanda ebongwani te
arr2 = arr[2]$~ 99
```

> Basaleli nyonso ya kokangisa bazongisaka **lilongo ya sika**. Zongisa: `arr = arr$+ 4`.
> `$+` ekoki kokangama: `arr = arr$+ 5$+ 6$+ 7`. Basaleli mosusu basalelaka bakokani ya katikati.
> **Indexation ezali 1-ndambo**: `arr[1]` ezali eloko ya liboso; `arr[0]` ezali libunga na ntango ya kosala.
> `$^+` / `$^-` eponaka **lilongo ya baprimitif** (motango, nkoku). Mpo na lilongo ya tuple, salela `$^` na lambda ya kokokanisa — nzela ekomami na lambda (`<` = komata, `>` = kokita).

**Sémantique ya motuya** — kopesa lilongo na bikelamo mosusu ekomisaka kopi oyo ezali na bozwi:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ebongwani te
```

```zymbol
// Lilongo oyo ezali na kati (indexation 1-ndambo)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (nzela 2, colonne 3)
```

---

## Kobongola Structure

```zymbol
// Lilongo
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[liboso, *likoti] = arr         // liboso=10  likoti=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ezali kosala te

// Tuple ya esika
point = (100, 200)
(px, py) = point             // px=100  py=200

// Tuple oyo ezali na kombo
moto = (kombo: "Ana", mbula: 25, engumba: "Madrid")
(kombo: n, mbula: m) = moto   // n="Ana"  m=25
```

---

## Tuple

Ba tuple bazali ba conteneurs oyo **ebongwani te** oyo ekoki kozwa ba valeurs **ya lolenge ndenge na ndenge**.
Bokeseni na lilongo, bileko ekoki kobongwama te nsima ya kokelama.

```zymbol
// Esika — lolenge ndenge na ndenge endimami
point = (10, 20)
>> point[1] ¶    // → 10

données = (42, "Mbote", #1, 3.14)
>> données[3] ¶     // → #1

// Oyo ezali na kombo
moto = (kombo: "Alice", mbula: 25)
>> moto.kombo ¶    // → Alice
>> moto[1] ¶      // → Alice  (index ezali mpe kosala, 1-ndambo)

// Oyo ezali na kati
esika = (x: 10, y: 20)
p = (esika: esika, nzela: "libanda")
>> p.esika.x ¶        // → 10
```

**Boyebani te** — likambo nyonso ya kobongola eloko ya tuple ezali libunga na ntango ya kosala:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ libunga na ntango ya kosala: ba tuple ebongwani te
// t[1] += 5    // ❌ libunga ndenge moko
```

Mpo kozwa motuya oyo ebongwani, salela `$~` (kobongola ya fonction) — ezongisaka **tuple ya sika**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← ya libanda ebongwani te
>> t2 ¶    // → (10, 999, 30)

// Tuple oyo ezali na kombo — káka lisusu polele
moto = (kombo: "Alice", mbula: 25)
monene  = (kombo: moto.kombo, mbula: 26)
>> moto.mbula ¶    // → 25
>> monene.mbula ¶     // → 26
```

---

## Ba Fonctions ya Etuluku ya Likolo

```zymbol
motango = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

bati_kabale  = motango$> (x -> x * 2)                  // map  → [2,4,6…20]
ba_pair    = motango$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
mosangiseli    = motango$< (0, (accumulateur, x) -> accumulateur + x)     // reduce → 55

// Kosangisa na bikelamo ya katikati
etape1 = motango$| (x -> x > 3)
etape2 = etape1$> (x -> x * x)
>> etape2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ba fonctions oyo ezali na kombo ekoki kopésama mibale na HOF
kati_kabale(x) { <~ x * 2 }
monene(x) { <~ x > 5 }
r = motango$> kati_kabale       // ✅ nzela ya mibale
r = motango$| monene       // ✅ nzela ya mibale
```

---

## Opérateur ya Pipeline

Elataki ya mobali ezali na posa ya `_` ndenge mosangisi ya valeur oyo epesami na pipeline:

```zymbol
kati_kabale = x -> x * 2
sangisa = (a, b) -> a + b
kotombola = x -> x + 1

r1 = 5 |> kati_kabale(_)        // → 10
r2 = 10 |> sangisa(_, 5)       // → 15
r3 = 5 |> sangisa(2, _)        // → 7

// Kosangisa
r = 5 |> kati_kabale(_) |> kotombola(_) |> kati_kabale(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kozwa ba Erreurs

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kokabola na zéro" ¶
} :! {
    >> "mosusu: " _err ¶    // _err ezali na mokanda ya libunga
} :> {
    >> "ezalaka ntango nyonso" ¶
}
```

| Lolenge | Ntango |
|------|------|
| `##Div` | Kokabola na zéro |
| `##IO` | Fisière / système |
| `##Index` | Index oyo ezali na libanda ya contour |
| `##Type` | Lolenge ekokani te |
| `##Parse` | Kobuka ba données |
| `##Network` | Ba erreurs ya réseau |
| `##_` | Erreur nyonso (koma nyonso) |

---

## Ba Modules

```zymbol
// lib/calc.zy — nzoto ya module ezipami na ba accolades
# calc {
    #> { sangisa, get_PI }

    _π := 3.14159
    sangisa(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // nom alternative ezali na ntina

>> c::sangisa(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Kosalela kombo mosusu ya public
# mylib {
    #> { _sangisa_ya_kati => mosangiseli }

    _sangisa_ya_kati(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::mosangiseli(3, 4) ¶    // → 7  (kombo ya kati _sangisa_ya_kati ebombami)
```

> **Mibeko ya module**: na kati ya `# kombo { }`, kaka `#>`, ndimbola ya ba fonctions, mpe bikelamo/ba constantes ya litreki ndimami. Ba phrases oyo ekoki kosalama (`>>`, `<<`, loops, bsp) ebutisaka libunga E013.

---

## Ba Modes ya Motango

Zymbol ekoki komonisa motango na **nkombo ya ba chiffres ya Unicode 69** — Devanagari, Arabe-Indien, Thai, Klingon pIqaD, Matematique ya molende, ba segments LCD, mpe bamosusu. Mode oyo ezali na mosala ekoki kosala na nsima ya `>>` kaka; calcul ya kati ezali ntango nyonso binaire.

### Kotia nkombo mosala

Koma ba chiffres `0` mpe `9` ya nkombo oyo ozali koluka na kati ya `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabe-Indien (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // kozongisa na ASCII
```

### Nsima mpe ba booleans

```zymbol
x = 42
>> x ¶          // → 42   (ASCII par défaut)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (point décimal ezali ntango nyonso ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: prefixe # ezali ntango nyonso ASCII, chiffre ebongwanaka
>> #1 ¶         // → #१   (solo na Devanagari)
>> #0 ¶         // → #०   (lokuta — ekeseni na ० motango mobimba zéro)

x = 28 > 4
>> x ¶          // → #१   (ndimbo ya kokokanisa elandaka mode oyo ezali na mosala)
```

### Ba chiffres ya litreki na source

Ba chiffres ya nkombo nyonso oyo esalemi bazali ba litreki ya solo — na ba contours, modulo, ba kokokanisa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Ba litreki ya boolean na nkombo nyonso

`#` + chiffre `0` to `1` uta na bloc nyonso ezali litreki ya boolean ya solo:

```zymbol
#٠٩#
mosala = #١        // ndenge moko na #1
>> mosala ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **ezali ntango nyonso ASCII**. `#0` (lokuta) ezali ntango nyonso ekeseni na `0` (motango mobimba zéro) na nkombo nyonso.

---

## Basaleli ya Données

```zymbol
// Kobongola lolenge
f = ##.42         // → 42.0  (na motango oyo ezali na nse)
i = ###3.7        // → 4     (na motango mobimba, kozongisa pembeni)
t = ##!3.7        // → 3     (na motango mobimba, kokata)

// Kobuka nkoku na motango
v1 = #|"42"|      // → 42  (motango mobimba)
v2 = #|"3.14"|    // → 3.14  (motango oyo ezali na nse)
v3 = #|"abc"|     // → "abc"  (na kimia, libunga te)

// Kozongisa pembeni / Kokata
π = 3.14159265
zongisa_pembeni2 = #.2|π|      // → 3.14  (zongisa pembeni na esika 2 ya décimale)
zongisa_pembeni4 = #.4|π|      // → 3.1416
kata2 = #!2|π|      // → 3.14  (kata)

// Komisa motango na form
forme = #,|1234567|  // → 1,234,567  (virgule-kabola)
scientifique = #^|12345.678|    // → 1.2345678e4  (scientifique)

// Ba litreki ya base
a = 0x41         // → 'A'  (hexadécimal)
b = 0b01000001   // → 'A'  (binaire)
c = 0o101        // → 'A'  (octal)

// Nsima ya kobongola base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Kosangisa na Shell

```zymbol
mokolo = <\ date +%Y-%m-%d \>     // kozwa stdout (ezali na \n na nsuka)
>> "Lelo: " mokolo

fisiere = "data.txt"
nzoto = <\ cat {fisiere} \>      // kotya na kati ya mitindo

nsima = </"./subscript.zy"/>   // kosalela script mosusu ya Zymbol, kozwa nsima
>> nsima
```

> `><` ezuaka ba arguments CLI lokola lilongo ya nkoku (tree-walker kaka).

---

## Ndakisa ya Mobimba: FizzBuzz

```zymbol
kokabola(motango) {
    ? motango % 15 == 0 { <~ "FizzBuzz" }
    _? motango % 3  == 0 { <~ "Fizz" }
    _? motango % 5  == 0 { <~ "Buzz" }
    _ { <~ motango }
}

@ i:1..20 { >> kokabola(i) ¶ }
```

---

## References ya ba Symboles

| Symbole | Opération | Symbole | Opération |
|--------|-----------|--------|-----------|
| `=` | bikelamo | `$#` | monene |
| `:=` | bakokani | `$+` | sangisa (ekoki kokangama) |
| `>>` | nsima | `$+[i]` | kotya na index (1-ndambo) |
| `<<` | koma | `$-` | kolongola ya liboso na motuya |
| `¶` / `\\` | nzela ya sika | `$--` | kolongola nyonso na motuya |
| `?` | soki | `$-[i]` | kolongola na index (1-ndambo) |
| `_?` | soki te-soki | `$-[i..j]` | kolongola contour (1-ndambo) |
| `_` | soki te / wildcard | `$?` | ezali na kati |
| `??` | kokokana | `$??` | koluka index nyonso (1-ndambo) |
| `@` | loop | `$[s..e]` | kaboli (1-ndambo) |
| `@ N { }` | loop N mikolo | `$>` | map |
| `@!` | kobuka | `$\|` | filter |
| `@>` | kolanda | `$<` | reduce |
| `@:kombo { }` | loop oyo ezali na nzela | `$/ kaboli` | kabola nkoku |
| `@:kombo!` | kobuka nzela | `$++ a b c` | kosala kokangisa |
| `@:kombo>` | kolanda nzela | `arr[i>j>k]` | index ya navigation |
| `->` | lambda | `arr[i] = valeur` | kobongola eloko (lilongo kaka) |
| `arr[i] += valeur` | kobongola ya kosangisa | `arr[i]$~` | kobongola ya fonction (kopi ya sika) |
| `$^+` | pona komata (primitif) | `$^-` | pona kokita (primitif) |
| `$^` | pona na comparateur (tuple) | `<~` | zongisa |
| `\|>` | pipeline | `!?` | meka |
| `:!` | koma | `:>` | na nsuka |
| `#1` | solo | `#0` | lokuta |
| `$!` | ezali libunga | `$!!` | panza libunga |
| `<#` | koma | `#>` | kotinda |
| `#` | komona module | `::` | benga module |
| `.` | kozwa esika | `#?` | metadata ya lolenge |
| `#\|..\|` | kobuka motango | `##.` | kobongola na motango oyo ezali na nse |
| `###` | kobongola na motango mobimba (zongisa pembeni) | `##!` | kobongola na motango mobimba (kata) |
| `#.N\|..\|` | zongisa pembeni | `#!N\|..\|` | kata |
| `#,\|..\|` | forme ya virgule | `#^\|..\|` | scientifique |
| `#d0d9#` | kobongola mode ya motango | `#09#` | kozongisa na ASCII |
| `<\ ..\>` | kosala shell | `>\<` | ba arguments CLI |
| `\ bikelamo` | koboma bikelamo polele | `°x` / `x°` | ndimbola ya sika (ebandisami moko na moko) |
| `>>|` | bloc ya TUI (skrin oyo esangani) | `>>~` | nsima na esika |
| `>>!` | kopanza skrin | `>>?` | tala monene ya terminal |
| `<<\|` | kotya key oyo ezipi | `<<\|?` | emonaka kotya key oyo ezipi te |
| `@~ N` | kolala N milliseconde | `$*` | kobongola nkoku N mikolo |

---

## Mbongwana ya Kotinda

### v0.0.5 — Ntoma ya TUI, Ndimbala ya Sika & Kobongola Nkoku _(Mái 2026)_

- **Kobuka** Kaboli ya loboko ya kokokana: `forme : ndimbo` → `forme => ndimbo`
- **Kobuka** Kombo mosusu ya koma: `<# nzela <= kombo_mosusu` → `<# nzela => kombo_mosusu`
- **Kobuka** Kobongola kombo ya kotinda: `#> { fn <= public }` → `#> { fn => public }`
- **Babakisi** Bloc ya TUI `>>| { }` — skrin oyo esangani + ndenge ya liboso; epanzaka na ntango ya kobima
- **Babakisi** Nsima na esika `>>~ (nzela, colonne, BKS, fg, bg) > makambo` — ba esika ya ndenge na ndenge, ANSI 256 balangi
- **Babakisi** Koma ya key `<<| bikelamo` (ezipi) mpe `<<|? bikelamo` (emoni oyo ezipi te)
- **Babakisi** `>>!` kopanza skrin, `>>?` tala monene ya terminal, `@~ N` kolala N milliseconde
- **Babakisi** Ndimbala ya sika `°x` / `x°` — ebandisaka bikelamo na moko na ntango ya liboso ya kosalela na ba loops
- **Babakisi** Kobongola nkoku `nkoku $* N` — kobongola nkoku N mikolo
- **VM** Kokokana: mekano 436/436 eleki

### v0.0.4 — Indexation 1-ndambo, Ba Fonctions ya Etuluku ya Liboso & Ba Modules ya Bloc _(Avril 2026)_

- **Kobuka** Indexation nyonso ebongwani na **1-ndambo** — `arr[1] ezali eloko ya liboso; `arr[0]` ezali libunga na ntango ya kosala
- **Babakisi** Ba fonctions oyo ezali na kombo bazali **ba valeurs ya etuluku ya liboso** — pésa bango mibale na HOF: `motango$> kati_kabale`
- **Babakisi** **Syntax ya bloc na tina** mpo na modules: `# kombo { ... }` — syntax ya ndenge ya liboso ekolongolami
- **Babakisi** Indexation ya ba dimensions ebele: `arr[i>j>k]` (navigation), `arr[p ; q]` (kolongola ya ndenge ya liboso)
- **Babakisi** Kobongola lolenge: `##.liloba` (motango oyo ezali na nse), `###liloba` (motango mobimba zongisa pembeni), `##!liloba` (motango mobimba kata)
- **Babakisi** Kokabola nkoku: `nkoku$/ kaboli` — ezongisaka `Array(nkoku)`
- **Babakisi** Kosala kokangisa: `ndambo$++ a b c` — ebatisaka ba éléments ebele
- **Babakisi** Loop ya mikolo: `@ N { }` — kobongola N mikolo
- **Babakisi** Syntax ya loop oyo ezali na nzela: `@:kombo { }`, `@:kombo!`, `@:kombo>` — epesaka esika ya `@ @kombo` / `@! kombo`
- **Babakisi** Mibeko ya esika ya bikelamo: bikelamo `_kombo` ezali na esika ya bloc ya solo; `\ bikelamo` ebomaka na ntango
- **Babakisi** Ba contours ya kokokanisa ya kokokana: `< 0 =>`, `> 5 =>`, `== 42 =>`, bsp
- **Babakisi** Libunga ya module E013: ba phrases oyo ekoki kosalama na nzoto ya module epekisami
- **Babongisi** `alias.CONST` sikoyo ebongolami; `#>` ekoki koya nsima ya ndimbola ya ba fonctions
- **VM** Kokokana ya mobimba: mekano 393/393 eleki

### v0.0.3 — Ba Systèmes ya Motango ya Unicode & Kobongisa LSP _(Avril 2026)_

- **Babakisi** Ba blocs ya chiffres ya Unicode 69 na symbole ya kobongola mode `#d0d9#`
- **Babakisi** Ba litreki ya boolean na nkombo nyonso — `#१` / `#०`, `#१` / `#०`, bsp
- **Babakisi** Ba chiffres ya Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Babakisi** Opcode ya VM `SetNumeralMode` — kokokana ya mobimba na tree-walker
- **Babongisi** Nsima ya boolean `>>` sikoyo eza na prefixe `#` (`#0` / `#1`) na ba modes nyonso

### v0.0.2_01 — Kobongola Kombo ya Opérateur _(30 Máálo 2026)_

- **Babongisi** `c|..|` → `#,|..|` mpe `e|..|` → `#^|..|` — mpo na kokokana na libota ya prefixe `#`
- **Babakisi** Kombo mosusu ya kotinda: kotinda lisusu ba membres ya module na kombo mosusu

### v0.0.2 — Kobongisa API ya Kokangisa & Ba Installateurs _(24 Máálo 2026)_

- **Babakisi** Libota ya opérateur `$` oyo esangani mpo na lilongo mpe nkoku (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Babakisi** Kopesa ya kobongola structure mpo na lilongo, tuple, mpe tuple oyo ezali na kombo
- **Babakisi** Ba index négatif (`arr[-1]` = eloko ya nsuka)
- **Babakisi** Ba installateurs ya solo — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Máálo 2026)_

- **Babakisi** Kopesa ya kosangisa `^=`
- **Babongisi** Makambo ya ndelo ya calcul ya parseur; babongisi ya mikanda

### v0.0.1 — Kotinda ya liboso ya bato nyonso _(22 Máálo 2026)_

- Mobongoli tree-walker + VM ya registre (`--vm`, ~4× mbangu, ~95% kokokana)
- Ba constructions nyonso ya liboso: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Ba identifiants ya Unicode ya mobimba, système ya module, ba lambda, ba closures, kozwa ba erreurs
- REPL, LSP, extension ya VS Code, formateur (`zymbol fmt`)

---

_Zymbol-Lang — Elembo. Ya mokili mobimba. Ebongwani te._
