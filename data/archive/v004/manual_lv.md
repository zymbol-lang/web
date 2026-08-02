> **Paziņojums:** Šī dokumentācija ir izveidota ar mākslīgā intelekta (AI) palīdzību.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanoniskā atsauce ir **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** interpretera repozitorijā.

---

# Zymbol-Lang Rokasgrāmata

**Zymbol-Lang** ir simboliskā programmēšanas valoda. Nav atslēgvārdu — viss ir simbols. Darbojas vienādi jebkurā cilvēku valodā.

- Nav `if`, `while`, `return` — tikai `?`, `@`, `<~`
- Pilns Unicode — identifikatori jebkurā valodā vai emocijzīmēs
- Neatkarīgs no cilvēku valodas — kods ir vienāds visur

**Interpretera versija**: v0.0.4 | **Testu pārklājums**: 393/393 (TW ↔ VM paritāte)

---

## Mainīgie un konstantes

```zymbol
x = 10              // maināms mainīgais
PI := 3.14159       // konstante — atkārtota piešķiršana ir izpildes kļūda
vārds = "Alise"
aktīvs = #1         // Būla patiess
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
x++       // 5
x--       // 4
```

---

## Datu tipi

| Tips | Literāls | `#?` birka | Piezīmes |
|------|----------|------------|----------|
| Vesels skaitlis | `42`, `-7` | `###` | 64 bitu zīmēts |
| Peldošais punkts | `3.14`, `1.5e10` | `##.` | Zinātniskais pieraksts atļauts |
| Virkne | `"teksts"` | `##"` | Interpolācija: `"Sveiki {vārds}"` |
| Simbols | `'A'` | `##'` | Viens Unicode simbols |
| Būla | `#1`, `#0` | `##?` | NAV skaitlisks — `#1 ≠ 1` |
| Masīvs | `[1, 2, 3]` | `##]` | Homogēni elementi |
| Kortežs | `(a, b)` | `##)` | Pozicionāls |
| Nosaukts kortežs | `(x: 1, y: 2)` | `##)` | Nosaukti lauki |
| Funkcija | nosaukta funkcijas atsauce | `##()` | Pirmās klases; rāda `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pirmās klases; rāda `<lambd/N>` |

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
>> "Sveiki" ¶                       // ¶ vai \\ skaidrai rindas pārejai
>> "a=" a " b=" b ¶                 // blakus novietošana — vairākas vērtības
>> (arr$#) ¶                        // postfiks operatoriem nepieciešams ( ) >>

<< vārds                            // ielasi mainīgajā (bez uzvednes)
<< "Ievadiet vārdu: " vārds         // ar uzvedni
```

> `¶` (AltGr+R spāņu tastatūrā) un `\\` ir līdzvērtīgi rindas pārejai.

---

## Operatoru apzīmējumi

```zymbol
// Aritmētika — izmantojiet piešķiršanu; dažiem operatoriem ir īpatnības tieši >> operatorā
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (veselo skaitļu dalīšana)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kāpināšana)

// Salīdzināšana
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Loģiskie
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Virknes

```zymbol
// Divas konkatenācijas formas
vārds = "Alise"
n = 42

>> "Sveiki " vārds " tev ir " n ¶       // blakus novietošana — >> operatorā
apraksts = "Sveiki {vārds}, tev ir {n}"  // interpolācija — jebkurā vietā
```

```zymbol
s = "Sveiki Pasaule"
garums = s$#                  // 14
apakšvirkne = s$[1..6]        // "Sveiki"  (1-bāzes, beigas iekļaujot)
ir = s$? "Pasaule"            // #1
daļas = "a,b,c,d"$/ ','       // [a, b, c, d]  (sadalīt ar atdalītāju)
aizstāts = s$~~["e":"a"]      // "Svaiki Pasauia"
aizstāts1 = s$~~["e":"a":1]   // "Svaiki Pasaule"  (tikai pirmie N)
```

> `+` ir tikai skaitļiem. Virknēm izmantojiet `,`, blakus novietošanu vai interpolāciju.

---

## Vadības plūsma

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

> `{ }` iekavas ir **obligātas** pat vienam paziņojumam.

---

## Match (Saskaņošana)

```zymbol
// Diapazoni
punkti = 85
atzīme = ?? punkti {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> atzīme ¶    // → B

// Virknes
krāsa = "sarkana"
kods = ?? krāsa {
    "sarkana" : "#FF0000"
    "zaļa"    : "#00FF00"
    _         : "#000000"
}

// Salīdzināšanas raksti
temp = -5
stāvoklis = ?? temp {
    < 0  : "ledus"
    < 20 : "auksts"
    < 35 : "silts"
    _    : "karsts"
}
>> stāvoklis ¶    // → ledus

// Paziņojuma forma (bloki)
?? n {
    0        : { >> "nulle" ¶ }
    _? n < 0 : { >> "negatīvs" ¶ }
    _        : { >> "pozitīvs" ¶ }
}
```

---

## Cikli

```zymbol
@ i:0..4  { >> i " " }        // diapazons iekļaujot:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ar soli:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // pretējā virzienā:    5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (kamēr)

augļi = ["ābols", "bumbieris", "vīnoga"]
@ a:augļi { >> a ¶ }          // katram masīva elementam

@ z:"sveiki" { >> z "-" }
>> ¶                          // → s-v-e-i-k-i-  (katrai virknes zīmei)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> turpināt
    ? i > 7 { @! }            // @! pārtraukt
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

// Apzīmēts cikls (ligzdots pārtraukums)
skaitītājs = 0
@:ārējais {
    skaitītājs++
    ? skaitītājs >= 3 { @:ārējais! }
}
>> skaitītājs ¶               // → 3
```

---

## Funkcijas

```zymbol
saskaitīt(a, b) { <~ a + b }
>> saskaitīt(3, 4) ¶   // → 7

faktoriāls(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriāls(n - 1)
}
>> faktoriāls(5) ¶     // → 120
```

Funkcijām ir **izolēts tvērums** — tās nevar nolasīt ārējos mainīgos. Izmantojiet izvades parametrus `<~`, lai modificētu izsaucēja mainīgos:

```zymbol
samainīt(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
samainīt(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nosauktas funkcijas ir **pirmās klases vērtības** — padodiet tieši: `nums$> dubultot`. Derīgs ir arī `x -> fn(x)`.

---

## Lambdas un aizvērumi

```zymbol
dubultot = x -> x * 2
saskaitīt = (a, b) -> a + b
>> dubultot(5) ¶   // → 10
>> saskaitīt(3, 7) ¶ // → 10

// Bloka lambda
klasificēt = x -> {
    ? x > 0 { <~ "pozitīvs" }
    _? x < 0 { <~ "negatīvs" }
    <~ "nulle"
}

// Aizvērums — uztver ārējo tvērumu
faktors = 3
trīskāršot = x -> x * faktors
>> trīskāršot(7) ¶   // → 21

// Fabrika
izveidot_saskaitītāju(n) { <~ x -> x + n }
pievienot10 = izveidot_saskaitītāju(10)
>> pievienot10(5) ¶   // → 15

// Masīvos
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶        // → 25
```

---

## Masīvi

Masīvi ir **maināmi** un satur **viena tipa** elementus.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — piekļuve (1-bāzes: pirmais elements)
arr[-1]         // 5 — negatīvs indekss (pēdējais elements)
arr$#           // 5 — garums (izmantojiet (arr$#) >> operatorā)

arr = arr$+ 6            // pievienot → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // ievietot pozīcijā 2 (1-bāzes)
arr3 = arr$- 3           // noņemt pirmo vērtības gadījumu
arr4 = arr$-- 3          // noņemt visus gadījumus
arr5 = arr$-[1]          // noņemt indeksā 1 (pirmais elements)
arr6 = arr$-[2..3]       // noņemt diapazonu (1-bāzes, beigas iekļaujot)

ir = arr$? 3             // #1 — satur
pozīcijas = arr$?? 3     // [3] — visi vērtības indeksi (1-bāzes)
griezums = arr$[1..3]    // [1,2,3] — šķēle (1-bāzes, beigas iekļaujot)
griezums2 = arr$[1:3]    // [1,2,3] — tas pats, skaita sintakse

augošs = arr$^+          // sakārtot augoši (tikai primitīvi)
dilstošs = arr$^-        // sakārtot dilstoši (tikai primitīvi)

// Nosaukto/pozicionālo kortežu masīvi — izmantojiet $^ ar salīdzināšanas lambdu
db = [(vārds: "Karla", vecums: 28), (vārds: "Anna", vecums: 25), (vārds: "Bob", vecums: 30)]
pēc_vecuma   = db$^ (a, b -> a.vecums < b.vecums)     // augoši pēc vecuma (<)
pēc_vārda    = db$^ (a, b -> a.vārds > b.vārds)      // dilstoši pēc vārda (>)
>> pēc_vecuma[1].vārds ¶     // → Anna
>> pēc_vārda[1].vārds ¶      // → Karla

// Tieša elementa atjaunināšana (tikai masīvi)
arr[1] = 99              // piešķirt
arr[2] += 5              // saliktais: +=  -=  *=  /=  %=  ^=

// Funkcionālā atjaunināšana — atgriež jaunu masīvu; oriģināls nemainīgs
arr2 = arr[2]$~ 99
```

> Visi kolekciju operatori atgriež **jaunu masīvu**. Piešķiriet atpakaļ: `arr = arr$+ 4`.
> `$+` var ķēdēt: `arr = arr$+ 5$+ 6$+ 7`. Citi operatori izmanto starpposma piešķiršanu.
> **Indeksēšana ir 1-bāzes**: `arr[1]` ir pirmais elements; `arr[0]` ir izpildes kļūda.
> `$^+` / `$^-` kārto **primitīvos masīvus** (skaitļus, virknes). Kortežu masīviem izmantojiet `$^` ar salīdzināšanas lambdu — virziens ir iekodēts lambdā (`<` = augoši, `>` = dilstoši).

**Vērtību semantika** — masīva piešķiršana citam mainīgajam izveido neatkarīgu kopiju:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nav ietekmēts
```

```zymbol
// Ligzdoti masīvi (1-bāzes indeksēšana)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (2. rinda, 3. kolonna)
```

---

## Destrukturēšana

```zymbol
// Masīvs
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pirmais, *pārējie] = arr    // pirmais=10  pārējie=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ atmet

// Pozicionāls kortežs
punkts = (100, 200)
(px, py) = punkts            // px=100  py=200

// Nosaukts kortežs
persona = (vārds: "Anna", vecums: 25, pilsēta: "Madride")
(vārds: v, vecums: ve) = persona   // v="Anna"  ve=25
```

---

## Korteži

Korteži ir **neizmaināmi** sakārtoti konteineri, kas var saturēt **dažādu tipu** vērtības.
Atšķirībā no masīviem, elementus nevar mainīt pēc izveides.

```zymbol
// Pozicionāls — jaukti tipi atļauti
punkts = (10, 20)
>> punkts[1] ¶    // → 10

dati = (42, "sveiki", #1, 3.14)
>> dati[3] ¶      // → #1

// Nosaukts
persona = (vārds: "Alise", vecums: 25)
>> persona.vārds ¶    // → Alise
>> persona[1] ¶       // → Alise  (indekss arī darbojas, 1-bāzes)

// Ligzdots
pos = (x: 10, y: 20)
p = (pos: pos, etiķete: "sākums")
>> p.pos.x ¶          // → 10
```

**Neizmaināmība** — jebkurš mēģinājums modificēt korteža elementu ir izpildes kļūda:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ izpildes kļūda: korteži ir neizmaināmi
// t[1] += 5    // ❌ tā pati kļūda
```

Lai iegūtu modificētu vērtību, izmantojiet `$~` (funkcionālā atjaunināšana) — atgriež **jaunu** kortežu:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← oriģināls nemainīgs
>> t2 ¶    // → (10, 999, 30)

// Nosaukts kortežs — izveidojiet atkārtoti tieši
persona = (vārds: "Alise", vecums: 25)
vecāks = (vārds: persona.vārds, vecums: 26)
>> persona.vecums ¶    // → 25
>> vecāks.vecums ¶     // → 26
```

---

## Augstākas pakāpes funkcijas

```zymbol
skaitļi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dubultoti  = skaitļi$> (x -> x * 2)                 // kartēšana → [2,4,6…20]
pāra       = skaitļi$| (x -> x % 2 == 0)            // filtrēšana → [2,4,6,8,10]
kopā       = skaitļi$< (0, (acc, x) -> acc + x)     // reducēšana → 55

// Ķēdēšana ar starpposmu palīdzību
1.solis = skaitļi$| (x -> x > 3)
2.solis = 1.solis$> (x -> x * x)
>> 2.solis ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nosauktas funkcijas var padot tieši HOF
dubultot(x) { <~ x * 2 }
ir_liels(x) { <~ x > 5 }
r = skaitļi$> dubultot       // ✅ tieša atsauce
r = skaitļi$| ir_liels       // ✅ tieša atsauce
```

---

## Cauruļvada operators

Labajā pusē vienmēr ir nepieciešams `_` kā vietturis cauruļvadītajai vērtībai:

```zymbol
dubultot = x -> x * 2
saskaitīt = (a, b) -> a + b
inc = x -> x + 1

5 |> dubultot(_)        // → 10
10 |> saskaitīt(_, 5)   // → 15
5 |> saskaitīt(2, _)    // → 7

// Ķēdēts
r = 5 |> dubultot(_) |> inc(_) |> dubultot(_)
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
    >> "cita kļūda: " _err ¶    // _err satur kļūdas ziņojumu
} :> {
    >> "vienmēr izpildās" ¶
}
```

| Tips | Kad |
|------|-----|
| `##Div` | Dalīšana ar nulli |
| `##IO` | Fails / sistēma |
| `##Index` | Indekss ārpus robežām |
| `##Type` | Tipu nesakritība |
| `##Parse` | Datu parsēšana |
| `##Network` | Tīkla kļūdas |
| `##_` | Jebkura kļūda (visu aptverošs) |

---

## Moduļi

```zymbol
// lib/calc.zy — moduļa pamatteksts ir iekavās
# calc {
    #> { saskaitīt, get_PI }

    _PI := 3.14159
    saskaitīt(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // aizstājvārds obligāts

>> c::saskaitīt(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksportēt ar citu publisku nosaukumu
# mana_bibliotēka {
    #> { _iekšējais_saskaitīt <= summa }

    _iekšējais_saskaitīt(a, b) { <~ a + b }
}
```

```zymbol
<# ./mana_bibliotēka <= m

>> m::summa(3, 4) ¶    // → 7  (iekšējais nosaukums _iekšējais_saskaitīt ir paslēpts)
```

> **Moduļu noteikumi**: `# nosaukums { }` iekšpusē ir atļauti tikai `#>`, funkciju definīcijas un literālu mainīgo/konstanšu inicializatori. Izpildāmie paziņojumi (`>>`, `<<`, cikli utt.) rada kļūdu E013.

---

## Skaitļu režīmi

Zymbol var attēlot skaitļus **69 Unicode ciparu blokos** — Devanagari, Arābu-Indiešu, Taizemiešu, Klingoņu pIqaD, Matemātikas treknrakstā, LCD segmentos un citur. Aktīvais režīms ietekmē tikai `>>` izvadi; iekšējā aritmētika vienmēr ir bināra.

### Režīma aktivizēšana

Ierakstiet mērķa rakstības `0` un `9` ciparus `#…#` iekšpusē:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arābu-Indiešu (U+0660–U+0669)
#๐๙#    // Taizemiešu    (U+0E50–U+0E59)
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

// Būla vērtības: # prefikss vienmēr ASCII, cipars pielāgojas
>> #1 ¶         // → #१   (patiess Devanagari)
>> #0 ¶         // → #०   (nepatiess — atšķiras no ० veselā skaitļa nulles)

x = 28 > 4
>> x ¶          // → #१   (salīdzināšanas rezultāts seko aktīvajam režīmam)
```

### Vietējie ciparu literāli pirmkodā

Jebkura atbalstīta rakstības cipari ir derīgi literāli — diapazonos, modulo, salīdzināšanā:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Būla literāli jebkurā rakstībā

`#` + cipars `0` vai `1` no jebkura bloka ir derīgs Būla literāls:

```zymbol
#٠٩#
aktīvs = #١        // tas pats, kas #1
>> aktīvs ¶        // → #١
>> (#١ && #٠) ¶    // → #٠
```

> `#` vienmēr ir **ASCII**. `#0` (nepatiess) vienmēr ir vizuāli atšķirams no `0` (veselā skaitļa nulles) katrā rakstībā.

---

## Datu operatori

```zymbol
// Tipu konvertēšana
##.42         // → 42.0  (uz Peldošo)
###3.7        // → 4     (uz Veselo, noapaļot)
##!3.7        // → 3     (uz Veselo, nogriezt)

// Parsēt virkni par skaitli
v1 = #|"42"|      // → 42  (Vesels)
v2 = #|"3.14"|    // → 3.14  (Peldošais)
v3 = #|"abc"|     // → "abc"  (drošs, bez kļūdas)

// Noapaļot / nogriezt
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (noapaļot līdz 2 decimāldaļām)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (nogriezt)

// Skaitļu formatēšana
fmt = #,|1234567|   // → 1,234,567  (ar komatu atdalīts)
sci = #^|12345.678| // → 1.2345678e4  (zinātniskais)

// Bāzes literāli
a = 0x41         // → 'A'  (heksadecimāls)
b = 0b01000001   // → 'A'  (binārs)
c = 0o101        // → 'A'  (oktāls)

// Bāzes konvertēšanas izvade
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrācija ar čaulu

```zymbol
datums = <\ date +%Y-%m-%d \>    // uztver stdout (ietver \n beigās)
>> "Šodien: " datums

fails = "dati.txt"
saturs = <\ cat {fails} \>       // interpolācija komandās

izvade = </"./subscript.zy"/>     // izpildīt citu Zymbol skriptu, uztvert izvadi
>> izvade
```

> `><` uztver CLI argumentus kā virkņu masīvu (tikai koku apstaigātājam).

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

## Simbolu atsauce

| Simbols | Darbība | Simbols | Darbība |
|---------|---------|---------|---------|
| `=` | mainīgais | `$#` | garums |
| `:=` | konstante | `$+` | pievienot (ķēdējams) |
| `>>` | izvade | `$+[i]` | ievietot indeksā (1-bāzes) |
| `<<` | ievade | `$-` | noņemt pēc vērtības (pirmo) |
| `¶` / `\\` | rindas pāreja | `$--` | noņemt visus pēc vērtības |
| `?` | ja | `$-[i]` | noņemt indeksā (1-bāzes) |
| `_?` | citādi ja | `$-[i..j]` | noņemt diapazonu (1-bāzes) |
| `_` | citādi / aizstājējzīme | `$?` | satur |
| `??` | saskaņošana | `$??` | atrast visus indeksus (1-bāzes) |
| `@` | cikls | `$[s..e]` | šķēle (1-bāzes) |
| `@ N { }` | N reižu cikls | `$>` | kartēšana |
| `@!` | pārtraukt | `$|` | filtrēšana |
| `@>` | turpināt | `$<` | reducēšana |
| `@:nosaukums { }` | apzīmēts cikls | `$/ atd` | virknes sadalīšana |
| `@:nosaukums!` | pārtraukt apzīmēto | `$++ a b c` | konkatenācijas veidošana |
| `@:nosaukums>` | turpināt apzīmēto | `arr[i>j>k]` | navigācijas indekss |
| `->` | lambda | `arr[i] = vērt` | atjaunināt elementu (tikai masīvi) |
| `arr[i] += vērt` | saliktā atjaunināšana | `arr[i]$~` | funkcionālā atjaunināšana (jauna kopija) |
| `$^+` | kārtot augoši (primitīvi) | `$^-` | kārtot dilstoši (primitīvi) |
| `$^` | kārtot ar salīdzinātāju (korteži) | `<~` | atgriezt |
| `|>` | cauruļvads | `!?` | mēģināt |
| `:!` | noķert | `:>` | beidzot |
| `#1` | patiess | `#0` | nepatiess |
| `$!` | ir kļūda | `$!!` | izplatīt kļūdu |
| `<#` | importēt | `#>` | eksportēt |
| `#` | deklarēt moduli | `::` | izsaukt moduli |
| `.` | piekļuve laukam | `#?` | tipa metadati |
| `#|..|` | parsēt skaitli | `##.` | konvertēt uz Peldošo |
| `###` | konvertēt uz Veselo (noapaļot) | `##!` | konvertēt uz Veselo (nogriezt) |
| `#.N|..|` | noapaļot | `#!N|..|` | nogriezt |
| `#,|..|` | komatu formāts | `#^|..|` | zinātniskais |
| `#d0d9#` | skaitļu režīma maiņa | `#09#` | atiestatīt uz ASCII |
| `<\ ..\>` | čaulas izpilde | `>\<` | CLI argumenti |
| `\ var` | iznīcināt mainīgo tieši | | |

---

## Izlaidumu izmaiņu žurnāls

### v0.0.4 — 1-bāzes indeksēšana, Pirmās klases funkcijas un Moduļu bloki _(2026. gada aprīlis)_

- **Laužošas izmaiņas** Visa indeksēšana mainīta uz **1-bāzes** — `arr[1]` ir pirmais elements; `arr[0]` ir izpildes kļūda
- **Pievienots** Nosauktas funkcijas ir **pirmās klases vērtības** — padodiet tieši HOF: `nums$> dubultot`
- **Pievienots** Moduļu **bloka sintakse obligāta**: `# nosaukums { ... }` — plakanā sintakse noņemta
- **Pievienots** Daudzdimensiju indeksēšana: `arr[i>j>k]` (navigācija), `arr[p ; q]` (plakana izvilkšana)
- **Pievienots** Tipu konvertēšana: `##.izteiksme` (Peldošais), `###izteiksme` (Vesels noapaļot), `##!izteiksme` (Vesels nogriezt)
- **Pievienots** Virknes sadalīšana: `str$/ atd` — atgriež `Array(Virkne)`
- **Pievienots** Konkatenācijas veidošana: `bāze$++ a b c` — pievieno vairākus elementus
- **Pievienots** N reižu cikls: `@ N { }` — atkārtot tieši N reizes
- **Pievienota** Apzīmētu ciklu sintakse: `@:nosaukums { }`, `@:nosaukums!`, `@:nosaukums>` — aizstāj `@ @nosaukums` / `@! nosaukums`
- **Pievienoti** Mainīgo tvēruma noteikumi: `_nosaukums` mainīgajiem ir precīzs bloka tvērums; `\ var` iznīcina agri
- **Pievienoti** Saskaņošanas salīdzināšanas raksti: `< 0 :`, `> 5 :`, `== 42 :` utt.
- **Pievienota** Moduļu E013 kļūda: izpildāmi paziņojumi moduļa pamattekstā ir aizliegti
- **Izlabots** `take_variable` vairs neizjauc moduļa konstantes atpakaļrakstīšanas laikā
- **Izlabots** `alias.KONSTANTE` tagad tiek pareizi atrisināta; `#>` var parādīties pēc funkciju definīcijām
- **VM** Pilna paritāte: 393/393 testi iziet

### v0.0.3 — Unicode skaitļu sistēmas un LSP uzlabojumi _(2026. gada aprīlis)_

- **Pievienoti** 69 Unicode ciparu bloki ar režīma maiņas marķieri `#d0d9#`
- **Pievienoti** Būla literāli jebkurā rakstībā — `#१` / `#०`, `#١` / `#٠`, utt.
- **Pievienoti** Klingoņu pIqaD cipari (CSUR PUA U+F8F0–U+F8F9)
- **Pievienots** `SetNumeralMode` VM opkods — pilna paritāte ar koku apstaigātāju
- **Pievienots** REPL ievēro aktīvo skaitļu režīmu atbalsī un mainīgo attēlošanā
- **Mainīts** Būla `>>` izvade tagad ietver `#` prefiksu (`#0` / `#1`) visos režīmos

### v0.0.2_01 — Operatoru pārdēvēšana _(2026. gada 30. marts)_

- **Mainīts** `c|..|` → `#,|..|` un `e|..|` → `#^|..|` — konsekventi ar `#` formāta prefiksu saimi
- **Pievienots** Eksporta aizstājvārds: atkārtoti eksportēt moduļa locekļus ar citu nosaukumu

### v0.0.2 — Kolekciju API pārprojektēšana un instalētāji _(2026. gada 24. marts)_

- **Pievienota** Vienota `$` operatoru saime masīviem un virknēm (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pievienota** Destrukturēšanas piešķiršana masīviem, kortežiem un nosauktiem kortežiem
- **Pievienoti** Negatīvi indeksi (`arr[-1]` = pēdējais elements)
- **Pievienoti** Natīvi instalētāji — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(2026. gada 25. marts)_

- **Pievienota** Saliktā piešķiršana `^=`
- **Izlabotas** Parsera aritmētikas stūra gadījumi; dokumentācijas labojumi

### v0.0.1 — Pirmais publiskais izlaidums _(2026. gada 22. marts)_

- Koku apstaigātāja interpreters + reģistru VM (`--vm`, ~4× ātrāks, ~95% paritāte)
- Visas pamatstruktūras: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pilns Unicode identifikatori, moduļu sistēma, lambdas, aizvērumi, kļūdu apstrāde
- REPL, LSP, VS Code paplašinājums, formatētājs (`zymbol fmt`)

---

_Zymbol-Lang — Simbolisks. Universāls. Neizmaināms._
