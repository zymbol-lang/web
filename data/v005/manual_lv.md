> **Brīdinājums:** Šī dokumentācija ir izveidota un tulkota ar mākslīgā intelekta (MI) palīdzību.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Rokasgrāmata

> **Pārskatīts versijai v0.0.5 — 2026-05-12**

**Zymbol-Lang** ir simboliska programmēšanas valoda. Bez atslēgvārdiem — viss ir simbols. Darbojas vienādi jebkurā cilvēku valodā.

- Nav `if`, `while`, `return` — tikai `?`, `@`, `<~`
- Pilns Unicode — identifikatori jebkurā valodā vai emodži
- Neitrāla pret cilvēku valodu — kods ir vienāds visur

**Tulka versija**: v0.0.5 | **Testu pārklājums**: 436/436 (TW ↔ VM paritāte)

---

## Mainīgie un konstantes

```zymbol
x = 10              // mainīgais
PI := 3.14159       // konstante — atkārtota piešķiršana ir izpildlaika kļūda
vards = "Alice"
aktīvs = #1         // Būla patiesums
👋 := "Sveiki"
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

`°` (grādu zīme, U+00B0) automātiski inicializē mainīgo ar neitrālu vērtību pie pirmās lietošanas:

```zymbol
skaitli = [3, 1, 4, 1, 5]
@ n:skaitli {
    °kopa += n    // auto-inicializācija uz 0 virs cikla; saglabājas pēc @
}
>> kopa ¶         // → 14
```

> `°x` (prefikss) noenkurojas virs cikla — rezultāts pieejams pēc `@`.
> `x°` (sufikss) noenkurojas cikla iekšienē — izzūd, kad cikls beidzas.
> Tikai koka pārgājienam.

---

## Datu tipi

| Tips | Literāls | `#?` tags | Piezīmes |
|------|---------|----------|---------|
| Vesels skaitlis | `42`, `-7` | `###` | 64 bitu ar zīmi |
| Decimāldaļa | `3.14`, `1.5e10` | `##.` | Zinātniskā notācija OK |
| Virkne | `"teksts"` | `##"` | Interpolācija: `"Sveiki {vards}"` |
| Rakstzīme | `'A'` | `##'` | Viena Unicode rakstzīme |
| Būla | `#1`, `#0` | `##?` | NAV skaitlisks — `#1 ≠ 1` |
| Masīvs | `[1, 2, 3]` | `##]` | Viendabīgi elementi |
| Kortežs | `(a, b)` | `##)` | Pozicionāls |
| Nosaukts kortežs | `(x: 1, y: 2)` | `##)` | Nosaukti lauki |
| Funkcija | nosauktas funkcijas atsauce | `##()` | Pirmās klases; attēlojums `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pirmās klases; attēlojums `<lambd/N>` |

```zymbol
// Tipa introspekcija — atgriež (tips, cipari, vērtība)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Izvade un ievade

```zymbol
>> "Sveiki" ¶                      // ¶ vai \\ eksplicitai rindu pārnesei
>> "a=" a " b=" b ¶               // blakusnovietošana — vairākas vērtības
>> (masivs$#) ¶                   // sufiksa operatori prasa ( ) >>

<< vards                          // nolasīt mainīgajā (bez aicinājuma)
<< "Ievadiet vārdu: " vards       // ar aicinājumu
```

> `¶` (AltGr+R spāņu tastatūrā) un `\\` ir ekvivalenti rindu pārnesumi.

---

## TUI primitīvi

Termināla lietotāja interfeisa operatori interaktīvām programmām. Lielākā daļa prasa `>>| { }` bloku (alternatīvs ekrāns + jēlrežīms).

```zymbol
>>| {
    >>!                             // notīrīt alternatīvo ekrānu
    >>~ (1, 1, 0, 10) > "Darbojas"  // 1. rinda, 1. kolonna, fg=10 (zaļš)
    @~ 1000                         // pauze 1 sekunde (1000 ms)
    >>~ (2, 1) > "Gatavs."
}
// termināls tiek automātiski atjaunots izejot
```

```zymbol
// Taustiņu nospiešana un termināla izmērs
>>| {
    [rindas, kolonnas] = >>?              // vaicāt termināla izmērus
    >>~ (1, 1) > "Termināls: " rindas " x " kolonnas
    <<| taustin                           // bloķējoša taustiņu nolasīšana
    >>~ (2, 1) > "Nospiedts: " taustin
}
```

> `>>!` notīra ekrānu. `>>?` atgriež `[rindas, kolonnas]`. `@~ N` guļ N milisekundes.
> `<<|` nolasa vienu taustiņu nospiešanu (bloķējoša); `<<|?` aptaujā bez bloķēšanas (atgriež `'\0'` ja nav).
> Pozicionētās izvades kortežs: `(rinda, kolonna, BKS, fg, bg)` — jebkuru vietu var izlaist ar komatu (`>>~ (,,, 196) > "sarkans"`).
> BKS bitmaska: `1`=Treknraksts, `2`=Slīpraksts, `4`=Pasvītrots. ANSI 256 krāsu palete (`0`=termināla noklusējums).
> Tikai koka pārgājienam (izņemot `>>!`, `>>?`, `@~`, `>>~` kas darbojas arī `--vm` režīmā).

---

## Operatori

```zymbol
// Aritmētika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (veselu skaitļu dalīšana)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kāpināšana)

// Salīdzināšana — piešķirt pārbaudei
s1 = a == b    // #0
s2 = a <> b    // #1
s3 = a < b     // #0
s4 = a <= b    // #0
s5 = a > b     // #1
s6 = a >= b    // #1

// Loģika
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Virknes

```zymbol
// Divas konkatenācijas formas
vards = "Alice"
n = 42

>> "Sveiki " vards " jums ir " n ¶    // blakusnovietošana — >>
apraksts = "Sveiki {vards}, jums ir {n}"  // interpolācija — jebkur
```

```zymbol
s = "Sveiki Pasaule"
garums = s$#                  // 13
apaksvirkne = s$[1..6]        // "Sveiki"  (1-bāzēts, beigas ieskaitot)
ir = s$? "Pasaule"            // #1
dalas = "a,b,c,d"$/ ','       // [a, b, c, d]  (sadalīt pēc atdalītāja)
aizv = s$~~["e":"E"]          // "SvEiki PasaulE"
aizv1 = s$~~["e":"E":1]       // "SvEiki Pasaule"  (tikai pirmie N)
linija = "─" $* 20            // "────────────────────"  (atkārtot N reizes)
```

> `+` ir tikai skaitļiem. Izmantojiet `,`, blakusnovietošanu vai interpolāciju virknēm.

---

## Plūsmas vadība

```zymbol
x = 7

? x > 0 { >> "pozitīvs" ¶ }

? x > 100 {
    >> "liels" ¶
} _? x > 0 {
    >> "pozitīvs" ¶
} _? x == 0 {
    >> "nulle" ¶
} _ {
    >> "negatīvs" ¶
}
```

> `{ }` cirtainiekavas ir **obligātas** pat vienam paziņojumam.

---

## Atbilstības salīdzināšana

```zymbol
// Diapazoni
rezultats = 85
atzime = ?? rezultats {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> atzime ¶    // → B

// Virknes
krasa = "sarkana"
kods = ?? krasa {
    "sarkana" => "#FF0000"
    "zala"    => "#00FF00"
    _         => "#000000"
}

// Salīdzināšanas modeļi
temperatura = -5
stavoklis = ?? temperatura {
    < 0  => "ledus"
    < 20 => "auksts"
    < 35 => "silts"
    _    => "karsts"
}
>> stavoklis ¶    // → ledus

// Paziņojuma forma (bloka atzari)
n = -3
?? n {
    0    => { >> "nulle" ¶ }
    < 0  => { >> "negatīvs" ¶ }
    _    => { >> "pozitīvs" ¶ }
}
```

---

## Cikli

```zymbol
@ i:0..4  { >> i " " }        // diapazons ieskaitot:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ar soli:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // apgriezts:            5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

augļi = ["ābols", "bumbieris", "vīnoga"]
@ a:augļi { >> a ¶ }          // for-each masīvs

@ r:"sveiki" { >> r "-" }
>> ¶                          // → s-v-e-i-k-i-  (for-each virkne)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> turpināt
    ? i > 7 { @! }             // @! pārtraukt
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Bezgalīgs cikls
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Nosaukts cikls (ligzdota pārtraukšana)
skaitītājs = 0
@:ārējais {
    skaitītājs++
    ? skaitītājs >= 3 { @:ārējais! }
}
>> skaitītājs ¶                    // → 3
```

---

## Funkcijas

```zymbol
saskait(a, b) { <~ a + b }
>> saskait(3, 4) ¶    // → 7

faktoriāls(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriāls(n - 1)
}
>> faktoriāls(5) ¶    // → 120
```

Funkcijām ir **izolēta darbības joma** — tās nevar lasīt ārējos mainīgos. Izmantojiet izejas parametrus `<~`, lai mainītu izsaucēja mainīgos:

```zymbol
samainīt(a<~, b<~) {
    pagaidu = a
    a = b
    b = pagaidu
}
x = 10
y = 20
samainīt(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nosauktās funkcijas ir **pirmās klases vērtības** — nododiet tieši: `skaitli$> divkāršot`. Apvienošanai: `x -> fn(x)` arī ir derīgs.

---

## Lambdas un redzamības apgabali

```zymbol
divkāršot = x -> x * 2
summa = (a, b) -> a + b
>> divkāršot(5) ¶    // → 10
>> summa(3, 7) ¶     // → 10

// Bloka lambda
klasificēt = x -> {
    ? x > 0 { <~ "pozitīvs" }
    _? x < 0 { <~ "negatīvs" }
    <~ "nulle"
}

// Noslēgums — uztver ārējo darbības jomu
koeficients = 3
trīskāršot = x -> x * koeficients
>> trīskāršot(7) ¶    // → 21

// Rūpnīca
izveidot_pieskaitītāju(n) { <~ x -> x + n }
pievienot10 = izveidot_pieskaitītāju(10)
>> pievienot10(5) ¶    // → 15

// Masīvos
darbības = [x -> x+1, x -> x*2, x -> x*x]
>> darbības[3](5) ¶    // → 25
```

---

## Masīvi

Masīvi ir **maināmi** un satur **viena tipa** elementus.

```zymbol
masivs = [1, 2, 3, 4, 5]

x = masivs[1]      // 1 — piekļuve (1-bāzēts: pirmais elements)
x = masivs[-1]     // 5 — negatīvs indekss (pēdējais elements)
x = masivs$#       // 5 — garums (izmantojiet (masivs$#) >>)

masivs = masivs$+ 6            // pievienot → [1,2,3,4,5,6]
masivs2 = masivs$+[2] 99       // ievietot pozīcijā 2 (1-bāzēts)
masivs3 = masivs$- 3           // noņemt pirmo vērtības gadījumu
masivs4 = masivs$-- 3          // noņemt visus gadījumus
masivs5 = masivs$-[1]          // noņemt indeksā 1 (pirmais elements)
masivs6 = masivs$-[2..3]       // noņemt diapazonu (1-bāzēts, beigas ieskaitot)

ir = masivs$? 3            // #1 — satur
poz = masivs$?? 3          // [3] — visi vērtības indeksi (1-bāzēts)
griezums = masivs$[1..3]   // [1,2,3] — griezums (1-bāzēts, beigas ieskaitot)
griezums2 = masivs$[1:3]   // [1,2,3] — tas pats, skaita bāzēts sintakss

aug = masivs$^+             // sakārtots augošā  (tikai primitīvi)
noj = masivs$^-             // sakārtots dilstošā (tikai primitīvi)

// Nosauktu/pozicionālu kortežu masīvi — izmantojiet $^ ar salīdzinātāja lambdu
db = [(vards: "Carla", vecums: 28), (vards: "Ana", vecums: 25), (vards: "Bob", vecums: 30)]
pec_vecuma  = db$^ (a, b -> a.vecums < b.vecums)    // augošā vecumā  (<)
pec_varda = db$^ (a, b -> a.vards > b.vards)        // dilstošā vārdā (>)
>> pec_vecuma[1].vards ¶     // → Ana
>> pec_varda[1].vards ¶      // → Carla

// Tiešs elementa atjauninājums (tikai masīvi)
masivs[1] = 99              // piešķirt
masivs[2] += 5              // salikts: +=  -=  *=  /=  %=  ^=

// Funkcionāls atjauninājums — atgriež jaunu masīvu; oriģināls nemainīgs
masivs2 = masivs[2]$~ 99
```

> Visi kolekciju operatori atgriež **jaunu masīvu**. Piešķiriet atpakaļ: `masivs = masivs$+ 4`.
> `$+` var ķēdēt: `masivs = masivs$+ 5$+ 6$+ 7`. Citi operatori izmanto starpposmu piešķiršanu.
> **Indeksēšana ir 1-bāzēta**: `masivs[1]` ir pirmais elements; `masivs[0]` ir izpildlaika kļūda.
> `$^+` / `$^-` kārto **primitīvu masīvus** (skaitļi, virknes). Kortežu masīviem izmantojiet `$^` ar salīdzinātāja lambdu — virziens ir kodēts lambdā (`<` = augošs, `>` = dilstošs).

**Vērtību semantika** — masīva piešķiršana citam mainīgajam izveido neatkarīgu kopiju:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nav ietekmēts
```

```zymbol
// Ligzdoti masīvi (1-bāzēta indeksēšana)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (2. rinda, 3. kolonna)
```

---

## Destrukturizācija

```zymbol
// Masīvs
masivs = [10, 20, 30, 40, 50]
[a, b, c] = masivs              // a=10  b=20  c=30
[pirmais, *pārējie] = masivs    // pirmais=10  pārējie=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ atmet

// Pozicionāls kortežs
punkts = (100, 200)
(px, py) = punkts               // px=100  py=200

// Nosaukts kortežs
persona = (vards: "Ana", vecums: 25, pilseta: "Madride")
(vards: n, vecums: v) = persona  // n="Ana"  v=25
```

---

## Korteži

Korteži ir **nemainīgi** sakārtoti konteineri, kas var saturēt **dažāda tipa** vērtības.
Atšķirībā no masīviem, elementus nevar mainīt pēc izveides.

```zymbol
// Pozicionāls — jaukti tipi atļauti
punkts = (10, 20)
>> punkts[1] ¶    // → 10

dati = (42, "sveiki", #1, 3.14)
>> dati[3] ¶     // → #1

// Nosaukts
persona = (vards: "Alice", vecums: 25)
>> persona.vards ¶    // → Alice
>> persona[1] ¶       // → Alice  (indekss arī darbojas, 1-bāzēts)

// Ligzdots
poz = (x: 10, y: 20)
p = (poz: poz, iezime: "izcelsme")
>> p.poz.x ¶        // → 10
```

**Nemainīgums** — jebkurš mēģinājums mainīt kortežu elementu ir izpildlaika kļūda:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ izpildlaika kļūda: korteži ir nemainīgi
// t[1] += 5    // ❌ tāda pati kļūda
```

Lai iegūtu modificētu vērtību izmantojiet `$~` (funkcionāls atjauninājums) — atgriež **jaunu** kortežu:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← oriģināls nemainīgs
>> t2 ¶    // → (10, 999, 30)

// Nosaukts kortežs — atjaunot ekspliciski
persona = (vards: "Alice", vecums: 25)
vecaks  = (vards: persona.vards, vecums: 26)
>> persona.vecums ¶    // → 25
>> vecaks.vecums ¶     // → 26
```

---

## Augstākas kārtas funkcijas

```zymbol
skaitli = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

divkāršoti  = skaitli$> (x -> x * 2)                // map  → [2,4,6…20]
pārie        = skaitli$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
kopā         = skaitli$< (0, (akum, x) -> akum + x)  // reduce → 55

// Ķēde caur starpposma mainīgajiem
solis1 = skaitli$| (x -> x > 3)
solis2 = solis1$> (x -> x * x)
>> solis2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nosauktas funkcijas var nodot tieši AKF
divkāršot(x) { <~ x * 2 }
ir_liels(x) { <~ x > 5 }
r = skaitli$> divkāršot       // ✅ tieša atsauce
r = skaitli$| ir_liels         // ✅ tieša atsauce
```

---

## Cauruļu operators

Labajā pusē vienmēr nepieciešams `_` kā vietturis cauruļotajai vērtībai:

```zymbol
divkāršot = x -> x * 2
pievienot = (a, b) -> a + b
palielināt = x -> x + 1

r1 = 5 |> divkāršot(_)        // → 10
r2 = 10 |> pievienot(_, 5)    // → 15
r3 = 5 |> pievienot(2, _)     // → 7

// Ķēdē
r = 5 |> divkāršot(_) |> palielināt(_) |> divkāršot(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kļūdu apstrāde

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dalīšana ar nulli" ¶
} :! {
    >> "cita: " _err ¶    // _err satur kļūdas ziņojumu
} :> {
    >> "vienmēr izpildās" ¶
}
```

| Tips | Kad |
|------|-----|
| `##Div` | Dalīšana ar nulli |
| `##IO` | Fails / sistēma |
| `##Index` | Indekss ārpus robežām |
| `##Type` | Tipu neatbilstība |
| `##Parse` | Datu parsēšana |
| `##Network` | Tīkla kļūdas |
| `##_` | Jebkura kļūda (uztver visu) |

---

## Moduļi

```zymbol
// lib/aprēķins.zy — moduļa pamatteksts ir iekļauts cirtainieklsavās
# aprēķins {
    #> { pievienot, iegūt_PI }

    _PI := 3.14159
    pievienot(a, b) { <~ a + b }
    iegūt_PI() { <~ _PI }
}
```

```zymbol
// galvenais.zy
<# ./lib/aprēķins => a    // aizstājvārds nepieciešams

>> a::pievienot(5, 3) ¶     // → 8
pi = a::iegūt_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksportēt ar atšķirīgu publisko nosaukumu
# mana_biblioteka {
    #> { _iekšējā_saskaitīšana => summa }

    _iekšējā_saskaitīšana(a, b) { <~ a + b }
}
```

```zymbol
<# ./mana_biblioteka => m

>> m::summa(3, 4) ¶    // → 7  (iekšējais nosaukums _iekšējā_saskaitīšana ir paslēpts)
```

> **Moduļa noteikumi**: `# nosaukums { }` iekšienē ir atļauti tikai `#>`, funkciju definīcijas un literālie mainīgo/konstanšu inicializētāji. Izpildāmie paziņojumi (`>>`, `<<`, cikli utt.) rada kļūdu E013.

---

## Ciparu režīmi

Zymbol var attēlot skaitļus **69 Unicode ciparu skriptā** — Devanagari, Arābu-Indijas, Taizemes, Klingon pIqaD, matemātiski treknraksts, LCD segmenti un vairāk. Aktīvais režīms ietekmē tikai `>>` izvadi; iekšējā aritmētika vienmēr ir bināra.

### Skripta aktivizēšana

Ierakstiet mērķa skripta `0` un `9` ciparu, ievietots `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arābu-Indijas (U+0660–U+0669)
#๐๙#    // Taizemes     (U+0E50–U+0E59)
#09#    // atiestatīt uz ASCII
```

### Izvade un Būla vērtības

```zymbol
x = 42
>> x ¶          // → 42   (ASCII noklusējums)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimālpunkts vienmēr ASCII)
>> 1 + 2 ¶      // → ३

// Būla: # prefikss vienmēr ASCII, cipars pielāgojas
>> #1 ¶         // → #१   (patiesums Devanagari)
>> #0 ¶         // → #०   (nepatiesums — atšķiras no ०  vesela skaitļa nulle)

x = 28 > 4
>> x ¶          // → #१   (salīdzināšanas rezultāts seko aktīvajam režīmam)
```

### Dzimtie ciparu literāli avotā

Jebkura atbalstītā skripta cipari ir derīgi literāli — diapazonos, modulo, salīdzinājumos:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Būla literāli jebkurā skriptā

`#` + cipars `0` vai `1` no jebkura bloka ir derīgs Būla literāls:

```zymbol
#٠٩#
aktīvs = #١        // tas pats kas #1
>> aktīvs ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` ir **vienmēr ASCII**. `#0` (nepatiesums) vienmēr ir vizuāli atšķirīgs no `0` (vesela skaitļa nulle) visos skriptos.

---

## Datu operatori

```zymbol
// Tipa konversija
f = ##.42         // → 42.0  (uz Decimāldaļu)
i = ###3.7        // → 4     (uz Veselu skaitli, noapaļošana)
t = ##!3.7        // → 3     (uz Veselu skaitli, nogriezšana)

// Parsēt virkni kā skaitli
v1 = #|"42"|      // → 42  (Vesels skaitlis)
v2 = #|"3.14"|    // → 3.14  (Decimāldaļa)
v3 = #|"abc"|     // → "abc"  (droši, bez kļūdas)

// Noapaļot / nogriezt
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (noapaļot līdz 2 decimāldaļām)
r4 = #.4|pi|      // → 3.1416
n2 = #!2|pi|      // → 3.14  (nogriezšana)

// Skaitļa formatēšana
fmt = #,|1234567|  // → 1,234,567  (ar komatu atdalīts)
zin = #^|12345.678|    // → 1.2345678e4  (zinātniskā notācija)

// Bāzes literāli
a = 0x41         // → 'A'  (heksadecimāls)
b = 0b01000001   // → 'A'  (binārais)
c = 0o101        // → 'A'  (oktāls)

// Bāzes konversijas izvade
heks = 0x|255|    // → "0x00FF"
bin = 0b|65|      // → "0b1000001"
okt = 0o|8|       // → "0o10"
dec = 0d|255|     // → "0d0255"
```

---

## Apvalka integrācija

```zymbol
datums = <\ date +%Y-%m-%d \>     // uztver stdout (ietver beigu \n)
>> "Šodien: " datums

fails = "dati.txt"
saturs = <\ cat {fails} \>      // interpolācija komandās

izvade = </"./apakšskripts.zy"/>   // izpildīt citu Zymbol skriptu, uztvert izvadi
>> izvade
```

> `><` uztver CLI argumentus kā virknes masīvu (tikai koka pārgājienam).

---

## Pilns piemērs: FizzBuzz

```zymbol
klasificēt(skaitlis) {
    ? skaitlis % 15 == 0 { <~ "FizzBuzz" }
    _? skaitlis % 3  == 0 { <~ "Fizz" }
    _? skaitlis % 5  == 0 { <~ "Buzz" }
    _ { <~ skaitlis }
}

@ i:1..20 { >> klasificēt(i) ¶ }
```

---

## Simbolu uzziņa

| Simbols | Darbība | Simbols | Darbība |
|---------|---------|---------|---------|
| `=` | mainīgais | `$#` | garums |
| `:=` | konstante | `$+` | pievienot (ķēdējams) |
| `>>` | izvade | `$+[i]` | ievietot indeksā (1-bāzēts) |
| `<<` | ievade | `$-` | noņemt pirmo pēc vērtības |
| `¶` / `\\` | rindu pārnese | `$--` | noņemt visus pēc vērtības |
| `?` | if | `$-[i]` | noņemt pēc indeksa (1-bāzēts) |
| `_?` | else-if | `$-[i..j]` | noņemt diapazonu (1-bāzēts) |
| `_` | else / aizstājzīme | `$?` | satur |
| `??` | atbilstības salīdzināšana | `$??` | atrast visus indeksus (1-bāzēts) |
| `@` | cikls | `$[s..e]` | griezums (1-bāzēts) |
| `@ N { }` | cikls N reizes | `$>` | map |
| `@!` | pārtraukt | `$\|` | filter |
| `@>` | turpināt | `$<` | reduce |
| `@:nosaukums { }` | nosaukts cikls | `$/ atd` | virknes dalīšana |
| `@:nosaukums!` | pārtraukt iezīmi | `$++ a b c` | konkatenācijas būvniecība |
| `@:nosaukums>` | turpināt iezīmi | `masivs[i>j>k]` | navigācijas indekss |
| `->` | lambda | `masivs[i] = v` | atjaunināt elementu (tikai masīvi) |
| `masivs[i] += v` | salikts atjauninājums | `masivs[i]$~` | funkcionāls atjauninājums (jauna kopija) |
| `$^+` | kārtot augošā (primitīvi) | `$^-` | kārtot dilstošā (primitīvi) |
| `$^` | kārtot ar salīdzinātāju (korteži) | `<~` | atgriezt |
| `\|>` | caurule | `!?` | mēģināt |
| `:!` | noķert | `:>` | visbeidzot |
| `#1` | patiesums | `#0` | nepatiesums |
| `$!` | ir kļūda | `$!!` | izplatīt kļūdu |
| `<#` | importēt | `#>` | eksportēt |
| `#` | deklarēt moduli | `::` | moduļa izsaukums |
| `.` | lauka piekļuve | `#?` | tipa metadati |
| `#\|..\|` | parsēt skaitli | `##.` | kārtot uz Decimāldaļu |
| `###` | kārtot uz Veselu skaitli (noapaļ.) | `##!` | kārtot uz Veselu skaitli (nogr.) |
| `#.N\|..\|` | noapaļot | `#!N\|..\|` | nogriezt |
| `#,\|..\|` | komatu formāts | `#^\|..\|` | zinātniskā notācija |
| `#d0d9#` | ciparu režīma slēdzis | `#09#` | atiestatīt uz ASCII |
| `<\ ..\>` | apvalka izpilde | `>\<` | CLI argumenti |
| `\ main` | iznīcināt mainīgo ekspliciski | `°x` / `x°` | karsta definīcija (auto-inicializācija) |
| `>>|` | TUI bloks (alt-ekrāns) | `>>~` | pozicionēta izvade |
| `>>!` | notīrīt ekrānu | `>>?` | vaicāt termināla izmēru |
| `<<\|` | bloķējoša taustiņu nospiešana | `<<\|?` | nebloķējoša taustiņu nospiešana |
| `@~ N` | gulēt N milisekundes | `$*` | atkārtot virkni N reizes |

---

## Izmaiņu žurnāls

### v0.0.5 — TUI primitīvi, karsta definīcija un virknes atkārtošana _(Maijs 2026)_

- **Pārraujoša** Atbilstības atzara atdalītājs: `modelis : rezultāts` → `modelis => rezultāts`
- **Pārraujoša** Importa aizstājvārds: `<# ceļš <= aizst` → `<# ceļš => aizst`
- **Pārraujoša** Eksporta pārdēvēšana: `#> { fn <= pub }` → `#> { fn => pub }`
- **Pievienots** TUI bloks `>>| { }` — alternatīvs ekrāns + jēlrežīms; tīra izejot
- **Pievienots** Pozicionēta izvade `>>~ (rinda, kolonna, BKS, fg, bg) > elementi` — reta vieta, 256 krāsu ANSI
- **Pievienots** Taustiņu ievade `<<| mainīgais` (bloķējoša) un `<<|? mainīgais` (nebloķējoša aptauja)
- **Pievienots** `>>!` notīrīt ekrānu, `>>?` vaicāt termināla izmēru, `@~ N` gulēt N milisekundes
- **Pievienots** Karsta definīcija `°x` / `x°` — auto-inicializē mainīgo pie pirmās lietošanas ciklos
- **Pievienots** Virknes atkārtošana `virkne $* N` — atkārtot virkni N reizes
- **VM** Paritāte: 436/436 testi nokārto

### v0.0.4 — 1-bāzēta indeksēšana, pirmās klases funkcijas un moduļu bloki _(Aprīlis 2026)_

- **Pārraujoša** Visa indeksēšana pārslēgta uz **1-bāzētu** — `masivs[1]` ir pirmais elements; `masivs[0]` ir izpildlaika kļūda
- **Pievienots** Nosauktās funkcijas ir **pirmās klases vērtības** — nododiet tieši AKF: `skaitli$> divkāršot`
- **Pievienots** Moduļa **bloka sintakse** nepieciešama: `# nosaukums { ... }` — plakana sintakse noņemta
- **Pievienots** Daudzdimensiju indeksēšana: `masivs[i>j>k]` (navigācija), `masivs[p ; q]` (plakana ekstrakcija)
- **Pievienots** Tipa konversija: `##.izteiksme` (Decimāldaļa), `###izteiksme` (Vesels noapaļošana), `##!izteiksme` (Vesels nogriezšana)
- **Pievienots** Virknes dalīšana: `virkne$/ atdalītājs` — atgriež `Array(String)`
- **Pievienots** Konkatenācijas būvniecība: `bāze$++ a b c` — pievieno vairākus elementus
- **Pievienots** N reižu cikls: `@ N { }` — atkārtot tieši N reizes
- **Pievienots** Nosaukta cikla sintakse: `@:nosaukums { }`, `@:nosaukums!`, `@:nosaukums>` — aizvieto `@ @nosaukums` / `@! nosaukums`
- **Pievienots** Mainīgo darbības jomas noteikumi: `_nosaukums` mainīgajiem ir precīza bloka darbības joma; `\ main` iznīcina agrāk
- **Pievienots** Atbilstības salīdzināšanas modeļi: `< 0 :`, `> 5 :`, `== 42 :` utt.
- **Pievienots** Moduļa E013 kļūda: izpildāmie paziņojumi moduļa pamattekstā ir aizliegti
- **Labots** `take_variable` vairs nekorumpē moduļa konstantes atrakstot
- **Labots** `aizst.KONSTANTE` tagad tiek pareizi atrisināta; `#>` var parādīties pēc funkciju definīcijām
- **VM** Pilna paritāte: 393/393 testi nokārto

### v0.0.3 — Unicode ciparu sistēmas un LSP uzlabojumi _(Aprīlis 2026)_

- **Pievienots** 69 Unicode ciparu bloki ar režīma slēdža tokenu `#d0d9#`
- **Pievienots** Būla literāli jebkurā skriptā — `#१` / `#०`, `#١` / `#٠` utt.
- **Pievienots** Klingon pIqaD cipari (CSUR PUA U+F8F0–U+F8F9)
- **Pievienots** VM opkods `SetNumeralMode` — pilna paritāte ar koka pārgājienu
- **Pievienots** REPL ievēro aktīvo ciparu sistēmu atbalsī un mainīgo parādīšanā
- **Mainīts** Būla `>>` izvade tagad ietver `#` prefiksu (`#0` / `#1`) visos režīmos

### v0.0.2_01 — Operatora pārdēvēšana _(30. Mar 2026)_

- **Mainīts** `c|..|` → `#,|..|` un `e|..|` → `#^|..|` — konsekventi ar `#` formāta prefiksa saimi
- **Pievienots** Eksporta aizstājvārds: re-eksportēt moduļa dalībniekus ar citu nosaukumu

### v0.0.2 — Kolekcijas API pārdizains un instalētāji _(24. Mar 2026)_

- **Pievienots** Vienotā `$` operatoru saime masīviem un virknēm (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pievienots** Destrukturizācijas piešķiršana masīviem, kortežiem un nosauktiem kortežiem
- **Pievienots** Negatīvie indeksi (`masivs[-1]` = pēdējais elements)
- **Pievienots** Dzimtie instalētāji — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. Mar 2026)_

- **Pievienots** Salikts piešķīrums `^=`
- **Labots** Parsētāja aritmētikas robežgadījumi; dokumentācijas labojumi

### v0.0.1 — Pirmais publiskais laidiens _(22. Mar 2026)_

- Koka pārgājiena tulks + reģistru VM (`--vm`, ~4× ātrāks, ~95% paritāte)
- Visas pamata konstrukcijas: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pilni Unicode identifikatori, moduļu sistēma, lambdas, noslēgumi, kļūdu apstrāde
- REPL, LSP, VS Code paplašinājums, formatētājs (`zymbol fmt`)

---

_Zymbol-Lang — Simbolisks. Universāls. Nemainīgs._
