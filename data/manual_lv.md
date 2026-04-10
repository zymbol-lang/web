# Dokumentācija | Kompakts Zymbol-Lang rokasgrāmata

**Zymbol-Lang** ir simboliska programmēšanas valoda. Tā neizmanto atslēgvārdus — viss ir simbols. Tā darbojas vienādi jebkurā cilvēku valodā. Nav atslēgvārdu (`ja`, `cilpa`, `atgriešana` nepastāv — tikai simboli `?`, `@`, `<~`). Pilns Unicode atbalsts — identifikatori jebkurā valodā vai emoji 👋

---

## Mainīgie un Konstantes

```zymbol
x = 10           // mainīgais (maināms)
PI := 3.14159    // konstante (nemaināma — kļūda atkārtotā piešķiršanā)
vārds = "Ana"
aktīvs = #1      // loģiskā vērtība true
👋 := "Sveika"
```

### Salikta Piešķiršana

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

## Datu Tipi

| Tips             | Piemērs             | `#?` Simbols | Piezīmes                               |
|------------------|---------------------|--------------|----------------------------------------|
| Vesels skaitlis  | `42`, `-7`          | `###`        | 64 bitu ar zīmi                        |
| Peldošais komats | `3.14`, `1.5e10`    | `##.`        | Zinātniskā pieraksta atbalsts          |
| Virkne           | `"sveika"`          | `##"`        | Interpolācija: `"Sveika {vārds}"`      |
| Rakstzīme        | `'A'`               | `##'`        | Viena Unicode rakstzīme                |
| Loģiskā          | `#1`, `#0`          | `##?`        | NAV skaitliska 1 un 0                  |
| Masīvs           | `[1, 2, 3]`         | `##]`        | Visiem elementiem jābūt vienāda tipa   |
| Tuple            | `(a, b)`            | `##)`        | Pozicionāls                            |
| Nosaukts Tuple   | `(x: 1, y: 2)`      | `##)`        | Piekļuve pēc nosaukuma vai indeksa     |

---

## Izvade un Ievade

```zymbol
// Izvade — NAV automātiskas jaunas rindas
>> "Sveika" ¶                          // ¶ vai \\ dod skaidru jaunu rindu
>> "a=" a " b=" b ¶                    // vairākas vērtības ar juxtapozīciju
>> "summa=" saskaitīt(2, 3) ¶          // funkciju izsaukumi jebkurā pozīcijā
>> (arr$#) ¶                           // postfiksa operatori prasa iekavas

// Ievade
<< vārds                               // bez uzvednes — lasa mainīgajā
<< "Jūsu vārds? " vārds               // ar uzvedni
```

> `¶` vai `\\` ir ekvivalenti kā jaunā rinda.

---

## Operatori

```zymbol
// Aritmētika
5 + 2    // → 7
5 - 2    // → 3
5 * 2    // → 10
5 / 2    // → 2.5
5 % 2    // → 1
5 ^ 2    // → 25   (kāpināšana)

// Salīdzinājums (atgriež #1 vai #0)
5 == 5   // → #1
5 != 4   // → #1
5 > 4    // → #1
5 < 4    // → #0
5 >= 5   // → #1
5 <= 4   // → #0

// Loģiskie
#1 && #0    // → #0   (un)
#1 || #0    // → #1   (vai)
!#1         // → #0   (nē)
```

---

## Virknes

Trīs derīgas formas — katra savam kontekstam:

```zymbol
vārds = "Ana"
skaitlis = 25

// 1. Komats — piešķiršanā ar = vai :=
ziņa = "Sveika ", vārds, "!"              // → Sveika Ana!
NOSAUKUMS := "Lietotājs: ", vārds

// 2. Juxtapozīcija — >> izvadē
>> "Sveika " vārds " tev ir " skaitlis ¶  // → Sveika Ana tev ir 25

// 3. Interpolācija — jebkurā kontekstā
apraksts = "Sveika {vārds}, tev ir {skaitlis}" // → Sveika Ana, tev ir 25
```

```zymbol
// Aizstāšana — s$~~["vecs":"jauns"]
s = "sveika pasaule"
s = s$~~["pasaule":"zeme"]      // → "sveika zeme"
s = s$~~["a":"A":1]             // → "sveikA zeme"   aizstāt pirmos N gadījumus
```

> **Piezīme**: `+` ir tikai skaitļiem. Izmantošana ar virknēm ģenerē brīdinājumu.

---

## Vadības Plūsma

```zymbol
x = 7

// Vienkāršs nosacījums
? x > 0 { >> "pozitīvs" ¶ }

// nosacījums / citādi-nosacījums / citādi
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

Bloki `{ }` ir **obligāti** pat vienai rindai.

---

## Atbilstība

```zymbol
// Atbilstība ar diapazoniem
punkti = 85
vērtējums = ?? punkti {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> vērtējums ¶    // → B

// Atbilstība ar nosacījumiem (patvaļīgi nosacījumi)
temperatūra = -5
stāvoklis = ?? temperatūra {
    _? temperatūra < 0  : "ledus"
    _? temperatūra < 20 : "auksts"
    _? temperatūra < 35 : "silts"
    _                   : "karsts"
}
>> stāvoklis ¶    // → ledus

// Atbilstība ar virknēm
krāsa = "sarkana"
kods = ?? krāsa {
    "sarkana" : "#FF0000"
    "zaļa"    : "#00FF00"
    _         : "#000000"
}
>> kods ¶
```

---

## Cilpas

```zymbol
// Iekļaujošs diapazons: 0..4 iterē 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Diapazons ar soli
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Apgriezts diapazons
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Kamēr cilpa
skaitlis = 1
@ skaitlis <= 64 { skaitlis *= 2 }
>> skaitlis ¶    // → 128

// Par katru masīva elementu
auglis = ["ābols", "bumbieris", "vīnogas"]
@ f:auglis { >> f ¶ }

// Pār virknes rakstzīmēm
@ c:"sveika" { >> c "-" }
>> ¶    // → s-v-e-i-k-a-

// Pārtraukums un Turpināšana
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> turpināt
    ? i > 7 { @! }          // @! pārtraukt
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcijas

```zymbol
// Deklarācija un izsaukums
saskaitīt(a, b) { <~ a + b }
>> saskaitīt(3, 4) ¶    // → 7

// Rekursija
faktoriāls(skaitlis) {
    ? skaitlis <= 1 { <~ 1 }
    <~ skaitlis * faktoriāls(skaitlis - 1)
}
>> faktoriāls(5) ¶    // → 120

// Funkcijām ir izolēta darbības joma — nav piekļuves ārējiem mainīgajiem
globāls = 100
testēt() {
    x = 42    // tikai lokāls
    <~ x
}
>> testēt() ¶    // → 42
```

> **Svarīgi**: Nosauktās funkcijas `nosaukums(params){ }` nav pirmās klases vērtības.
> Lai nodotu kā argumentu, ietiniet: `x -> nosaukums(x)`.

---

## Lambdas un Slēgumi

```zymbol
// Vienkārša lambda (netieša atgriešana)
dubultots = x -> x * 2
summa = (a, b) -> a + b
>> dubultots(5) ¶    // → 10
>> summa(3, 7) ¶     // → 10

// Bloka lambda (tieša atgriešana)
klasificē = x -> {
    ? x > 0 { <~ "pozitīvs" }
    _? x < 0 { <~ "negatīvs" }
    <~ "nulle"
}
>> klasificē(5) ¶     // → pozitīvs
>> klasificē(0) ¶     // → nulle
>> klasificē(-5) ¶    // → negatīvs

// Slēgumi — lambdas tver ārējās darbības jomas mainīgos
faktors = 3
trīskāršots = x -> x * faktors    // tver 'faktors'
>> trīskāršots(7) ¶    // → 21

// Funkciju rūpnīca
izveidot_saskaitītāju(n) { <~ x -> x + n }
pievienot10 = izveidot_saskaitītāju(10)
pievienot20 = izveidot_saskaitītāju(20)
>> pievienot10(5) ¶    // → 15
>> pievienot20(5) ¶    // → 25

// Lambdas kā vērtības: glabātas masīvos
darbības = [x -> x+1, x -> x*2, x -> x*x]
>> darbības[0](5) ¶    // → 6
>> darbības[1](5) ¶    // → 10
>> darbības[2](5) ¶    // → 25
```

---

## Masīvi

Masīvi ir **maināmi** un satur **viena tipa** elementus.

```zymbol
arr = [10, 20, 30, 40, 50]

// Piekļuve (0 balstīts indekss)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30
>> arr[-1] ¶   // → 50   negatīvs indekss

// Garums (prasa iekavas >>)
skaitlis = arr$#
>> skaitlis ¶      // → 5
>> (arr$#) ¶       // → 5

// Pievienot, noņemt, satur, šķēle
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // indeksa 0 noņemšana: [20, 30, 40, 50, 60]
ir = arr$? 30                // → #1
idx = arr$?? 30              // → [1]   visi indeksi vērtībai
šķēle = arr$[0..2]           // šķēle [0,2): [20, 30]
skaits = arr$[0:3]           // skaita bāzes: [20, 30, 40]

// Tiešā elementa atjaunināšana (tikai masīvi)
arr[1] = 99              // piešķirt
arr[0] += 5              // salikts: +=  -=  *=  /=  %=  ^=

// Funkcionāla atjaunināšana — atgriež jaunu masīvu; oriģināls nemainās
arr2 = arr[1]$~ 77           // → [20, 77, 40, 50, 60]

// Kārtot (primitīvi)
num = [3, 1, 4, 1, 5]
augošs   = num$^+            // → [1, 1, 3, 4, 5]
dilstošs = num$^-            // → [5, 4, 3, 1, 1]

// Kārtot tuples ar komparatora lambdu
pāri = [(2,"b"), (1,"a"), (3,"c")]
sakārtots = pāri$^ ((a,b) -> a[0] - b[0])    // kārtot pēc pirmā elementa

// Ligzdoti masīvi
matrica = [[1,2],[3,4],[5,6]]
>> matrica[1][0] ¶    // → 3

// Par katru elementu
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` atgriež **jaunu masīvu** — piešķiriet atpakaļ: `arr = arr$+ 4`.
> Nav ķēdēšanas: izmantojiet divas atsevišķas piešķiršanas.
> `arr$??` un `arr$[s:n]` izmanto citu sintaksi nekā `arr$[s..e]` — skatiet Simbolu Atsauce.

**Vērtību semantika** — piešķirot masīvu citam mainīgajam, tiek izveidota neatkarīga kopija:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nav ietekmēts
```

---

## Destrukturēšana

```zymbol
// Masīva destrukturēšana
arr = [10, 20, 30]
[a, b, c] = arr
>> a ¶    // → 10
>> b ¶    // → 20

// Pozicionāla tuple destrukturēšana
pt = (3, 4)
(x, y) = pt
>> x ¶    // → 3

// Nosaukta tuple destrukturēšana
persona = (vārds: "Alice", vecums: 25)
(vārds: v, vecums: ve) = persona
>> v ¶     // → Alice
>> ve ¶    // → 25
```

---

## Tuplās

Tuplās ir **nemainīgi** sakārtoti konteineri, kas var saturēt **dažādu tipu** vērtības. Atšķirībā no masīviem, elementus pēc izveides nevar mainīt.

```zymbol
// Pozicionāla tuple
punkts = (10, 20)
>> punkts[0] ¶    // → 10
>> punkts[1] ¶    // → 20

dati = (42, "sveika", #1, 3.14)
>> dati[2] ¶     // → #1

// Nosaukta tuple
persona = (vārds: "Alice", vecums: 25)
>> persona.vārds ¶    // → Alice
>> persona.vecums ¶   // → 25
>> persona[0] ¶       // → Alice (indekss arī darbojas)

// Ligzdota
pos = (x: 3, y: 4)
p = (pos: pos, etiķete: "sākumpunkts")
>> p.etiķete ¶    // → sākumpunkts
>> p.pos.x ¶      // → 3
```

**Nemainīgums** — jebkurš mēģinājums mainīt tuple elementu ir izpildes laika kļūda:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ izpildes laika kļūda: tuplās ir nemainīgas
// t[0] += 5    // ❌ tāda pati kļūda
```

Lai iegūtu mainītu vērtību, izmantojiet `$~` (funkcionāla atjaunināšana) — atgriež **jaunu** tuplu:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← oriģināls nemainīts
>> t2 ¶    // → (10, 999, 30)

// Nosaukta tuple — rekonstruējiet eksplicitāk
persona = (vārds: "Alice", vecums: 25)
vecāks = (vārds: persona.vārds, vecums: 26)
>> persona.vecums ¶    // → 25
>> vecāks.vecums ¶     // → 26
```

---

## Augstākas Kārtas Funkcijas

HOF operatori prasa **iekļautu lambdu** — nevis tiešu lambda mainīgo.

```zymbol
skaitļi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Kartēšana ($>)
dubultoti = skaitļi$> (x -> x * 2)
>> dubultoti ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtrēšana ($|)
pāra = skaitļi$| (x -> x % 2 == 0)
>> pāra ¶    // → [2, 4, 6, 8, 10]

// Samazināšana ($<) — (sākuma vērtība, (acc, elem) -> izteiksme)
kopā = skaitļi$< (0, (acc, x) -> acc + x)
>> kopā ¶    // → 55

// Nav tiešas ķēdēšanas — izmantojiet starpposma mainīgos
solis1 = skaitļi$| (x -> x > 5)
solis2 = solis1$> (x -> x * x)
>> solis2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Caurules Operators

```zymbol
// |> nodod kreiso vērtību kā _ labajā izteiksmē
rezultāts = 5 |> _ * 2 |> _ + 1
>> rezultāts ¶    // → 11

// Ķēdētas transformācijas
vārdi = ["sveika", "pasaule"]
izeja = vārdi
    |> _$> (w -> w$#)              // kartēt uz garumiem: [6, 6]
    |> _$< (0, (a,x) -> a+x)      // summēt: 12
>> izeja ¶    // → 12
```

---

## Kļūdu Apstrāde

```zymbol
// Mēģiniet / Noķeriet / Beidzot
!? {
    x = 10 / 0
} :! ##Div {
    >> "dalīšana ar nulli" ¶
} :! ##IO {
    >> "I/A kļūda" ¶
} :! {
    >> "cita kļūda: " _err ¶    // _err satur kļūdas ziņojumu
} :> {
    >> "vienmēr izpildās" ¶
}

// Noķeršana pēc indeksa tipa
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "indekss ārpus robežām" ¶
}
```

### Kļūdu Tipi

| Tips        | Kad rodas                  |
|-------------|----------------------------|
| `##Div`     | Dalīšana ar nulli          |
| `##IO`      | Fails / sistēma            |
| `##Index`   | Indekss ārpus robežām      |
| `##Type`    | Tipa kļūda                 |
| `##Parse`   | Datu parsēšana             |
| `##Network` | Tīkla kļūdas               |
| `##_`       | Jebkura kļūda              |

---

## Moduļi

```zymbol
// Fails: lib/calc.zy
# calc                    // deklarācija — vienmēr augšā

#> {                      // eksportēšana — JĀBŪT pirms definīcijām
    saskaitīt
    get_PI
}

_PI := 3.14159

saskaitīt(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter konstantei (nepieciešamais apvedceļš)
```

```zymbol
// Fails: main.zy
<# ./lib/calc <= c         // aizstājvārds ir obligāts

>> c::saskaitīt(5, 3) ¶    // → 8  — izsaukums ar ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Piezīme**: `alias.NOSAUKUMS` konstantēm nedarbosies — izmantojiet getter funkciju.

---

## Skaitļu Režīmi

Zymbol var attēlot skaitļus **69 Unicode ciparu rakstos** — Devanagari, Arābu-Indijas, Taizemes, Klingon pIqaD, Matemātiskais Treknraksts, LCD segmenti un vairāk. Aktīvais režīms ietekmē tikai `>>`-izvadi; iekšējā aritmētika vienmēr ir bināra.

### Raksta aktivizēšana

Ierakstiet mērķa raksta ciparu `0` un `9`, ievietojot `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arābu-Indijas (U+0660–U+0669)
#๐๙#    // Taizemes      (U+0E50–U+0E59)
#09#    // atiestatīt uz ASCII
```

### Izvade un Būla vērtības

```zymbol
x = 42
>> x ¶          // → 42   (ASCII noklusējums)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimāldaļas punkts vienmēr ASCII)
>> 1 + 2 ¶      // → ३

// Būla: # prefikss vienmēr ASCII, cipars pielāgojas
>> #1 ¶         // → #१   (patiesība Devanagari)
>> #0 ¶         // → #०   (nepatiesa — atšķiras no ०  vesels skaitlis nulle)

x = 28 > 4
>> x ¶          // → #१   (salīdzinājuma rezultāts seko aktīvajam režīmam)
```

### Vietējo ciparu literāļi avota kodā

Jebkura atbalstītā raksta cipari ir derīgi literāļi — diapazonos, modulo, salīdzinājumos:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Būla literāļi jebkurā rakstā

`#` + cipars `0` vai `1` no jebkura bloka ir derīgs Būla literāls:

```zymbol
#٠٩#
نشط = #١        // tas pats kā #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` ir **vienmēr ASCII**. `#0` (nepatiesa) vienmēr ir vizuāli atšķirīgs no `0` (vesels skaitlis nulle) katrā rakstā.

---

## Datu Operatori

```zymbol
// Parsēt virkni par skaitli
x = #|"42"|          // → 42    (vesels skaitlis)
y = #|"3.14"|        // → 3.14  (peldošais komats)

// Noapaļot / saīsināt
r = #.2|3.14159|     // → 3.14   noapaļot līdz 2 decimāļiem
t = #!2|3.14159|     // → 3.14   saīsināt līdz 2 decimāļiem

// Formatēt skaitli
s = #,|1234567.89|    // → "1,234,567.89"  komata formāts
e = #^|0.00042|       // → "4.2e-4"        zinātniskā notācija

// Bāzes literāļi
h = 0xFF             // → 255  heksadecimāls
b = 0b1010           // → 10   binārais
o = 0o17             // → 15   oktāls

// Bāzes konversija
hex = 255$>>"16"     // → "FF"
bin = 10$>>"2"       // → "1010"
```

---

## Čaulas Integrācija

```zymbol
// Palaist čaulas komandu un tvert izvadi
izeja = <\ ls -la \>
>> izeja ¶

// Interpolācija komandās
mape = "/tmp"
faili = <\ ls {mape} \>

// Daudzrindu skripta bloks
rezultāts = </
    echo "sveika"
    pwd
/>

// Novirzīt izvadi uz čaulu (bez tvēršanas)
>< "echo sveika"
```

> `><` nosūta izvadi uz čaulu bez tvēršanas.

---

## Pilns Piemērs: FizzBuzz

```zymbol
klasificē(skaitlis) {
    ? skaitlis % 15 == 0 { <~ "BurbDūc" }
    _? skaitlis % 3  == 0 { <~ "Burb" }
    _? skaitlis % 5  == 0 { <~ "Dūc" }
    _ { <~ skaitlis }
}
@ i:1..20 { >> klasificē(i) ¶ }
```

---

## Simbolu Atsauce

| Simbols     | Darbība              | Simbols      | Darbība                    |
|-------------|----------------------|--------------|----------------------------|
| `=`         | mainīgais            | `$#`         | garums                     |
| `:=`        | konstante            | `$+`         | pievienošana (append)      |
| `>>`        | izvade               | `$+[i]`      | ievietošana indeksā        |
| `<<`        | ievade               | `$--`        | pēdējā noņemšana           |
| `¶`/`\`     | jaunā rinda          | `$-[i]`      | noņemšana indeksā          |
| `?`         | ja (if)              | `$-[i..j]`   | diapazona noņemšana        |
| `_?`        | citādi-ja (elif)     | `$?`         | satur                      |
| `_`         | citādi / universāls  | `$??`        | visi indeksi vērtībai      |
| `??`        | atbilstība           | `$[s..e]`    | šķēle                      |
| `@`         | cilpa                | `$>`         | kartēšana                  |
| `@!`        | pārtraukt            | `$\|`        | filtrēšana                 |
| `@>`        | turpināt             | `$<`         | samazināšana               |
| `->`        | lambda               | `$<`         | samazināšana               |
| `arr[i] = val` | atjaunināt elementu (tikai masīvi) | `arr[i] += val` | saliktā atjaunināšana |
| `arr[i]$~`  | funkcionāla atjaunināšana (jauna kopija) | `$^+` | kārtot augošā (primitīvi) |
| `$^-`       | kārtot dilstošā (primitīvi) | `$^`   | kārtot ar komparatoru (tuplās) |
| `<~`        | atgriezt             | `!?`         | mēģināt (try)              |
| `\|>`       | caurule              | `:!`         | noķert (catch)             |
| `#1`        | patiess              | `$!`         | ir kļūda                   |
| `#0`        | aplams               | `$!!`        | izplatīt kļūdu             |
| `:>`        | beidzot (finally)    | `#`          | deklarēt moduli            |
| `<#`        | importēt             | `#>`         | eksportēt                  |
| `.`         | lauka piekļuve       | `::`         | moduļa izsaukums           |
| `#\|..\|`   | parsēt (parse)       | `#.N\|..\|`  | noapaļot N decimāļus       |
| `#!N\|..\|` | saīsināt N decimāļus | `#,\|..\|`    | komata formāts             |
| `#d0d9#` | skaitļu režīma pārslēdzējs | `#09#` | atiestatīt uz ASCII |
| `#^\|..\|`   | zinātniskā not.      | `<\ \>`      | čaulas komanda             |
| `><`        | čaulas izvade        | `$~~[..]`    | aizstāt virknē             |
| `[a,b]=arr` | destrukturēšana      | `(x,y)=tup`  | tuple destrukturēšana      |

---

*Zymbol-Lang — Simbolisks. Universāls. Nemainīgs.*

## Versiju Vēsture

### v0.0.3 — Unicode Skaitļu Sistēmas & LSP Uzlabojumi _(2026. gada aprīlis)_

- **Pievienots** 69 Unicode ciparu bloki ar režīma pārslēgšanas pilnvaru `#d0d9#`
- **Pievienots** Būla literāļi jebkurā rakstā — `#१` / `#०`, `#١` / `#٠` utt.
- **Pievienots** Klingon pIqaD cipari (CSUR PUA U+F8F0–U+F8F9)
- **Pievienots** VM opkods `SetNumeralMode` — pilna paritāte ar tree-walker
- **Pievienots** REPL ievēro aktīvo skaitļu režīmu atbalsī un mainīgo attēlošanā
- **Mainīts** `>>` Būla vērtību izvade tagad ietver prefiksu `#` (`#0` / `#1`) visos režīmos

### v0.0.2_01 — Operatoru Pārdēvēšana _(2026. gada 30. marts)_

- **Mainīts** `c|..|` → `#,|..|` un `e|..|` → `#^|..|` — konsekventi ar `#` prefiksu saimi
- **Pievienots** Eksporta aizstājvārds: moduļa locekļu atkārtota eksportēšana ar citu nosaukumu

### v0.0.2 — Kolekciju API Pārveidojums & Instalētāji _(2026. gada 24. marts)_

- **Pievienots** Vienotā `$` operatoru saime masīviem un virknēm (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pievienots** Destrukturēšana masīviem, kortežiem un nosauktiem kortežiem
- **Pievienots** Negatīvie indeksi (`arr[-1]` = pēdējais elements)
- **Pievienots** Vietējie instalētāji — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(2026. gada 25. marts)_

- **Pievienots** Saliktā piešķiršana `^=`
- **Labots** Aritmētiskā parsera robežgadījumi; dokumentācijas labojumi

### v0.0.1 — Pirmais Publiskais Laidiens _(2026. gada 22. marts)_

- Tree-walker interpretators + reģistra VM (`--vm`, ~4× ātrāks, ~95% paritāte)
- Visi galvenie konstrukti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pilni Unicode identifikatori, moduļu sistēma, lambdas, slēgumi, kļūdu apstrāde
- REPL, LSP, VS Code paplašinājums, formatētājs (`zymbol fmt`)

---

**Piezīme:** Šī dokumentācija tika izveidota un tulkota ar mākslīgo intelektu (MI). Ir veikti visi centieni, lai nodrošinātu precizitāti, taču daži tulkojumi vai piemēri var saturēt kļūdas. Autoritatīvā atsauce ir [Zymbol-Lang specifikācija](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
