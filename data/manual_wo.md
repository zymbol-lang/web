# Jëfandikukat yu Woyof Zymbol-Lang

**Zymbol-Lang** dafa ko làmbi ci sa pirogram bu xam xam yu signa. Dañu ko def te amul dem-dem xam-xam — dëkk bu nekk signa la. Dafa liggéey fi ci këlë ëllëk jëm ak koo.

- Amul dem-dem xam-xam (`if`, `while`, `return` amul fi — signa rekk `?`, `@`, `<~`)
- Unicode bu xëy — tur ci bëgg-bëgg làkk walla emoji 👋
- Du làkk bu dëkk — kodu bi dafa nu sa ci bëgg-bëgg làkk

---

## Jumtukat ak Dëkku Yëgël

```zymbol
x = 10              // Jumtukat (mën a yokku)
PI := 3.14159       // Dëkku yëgël — lañu jël sañu bëgg-bëgg
tur = "Ana"
aktif = #1          // wér bu dëgg
👋 := "Salaam"
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

## Xëtu Dati

| Xëtu         | Misaal               | Signa `#?` | Xibaar                              |
|--------------|----------------------|------------|-------------------------------------|
| Nomerkat     | `42`, `-7`           | `###`      | 64-bit bu am giskat                 |
| Nomer bu yeg | `3.14`, `1.5e10`     | `##.`      | Notation bu siyantifik dafa baax    |
| Wolu          | `"salaam"`           | `##"`      | Interpolasion: `"Xam {tur}"`        |
| Bireew        | `'A'`                | `##'`      | Bireew bu nekk ak Unicode           |
| Wér           | `#1`, `#0`           | `##?`      | DU nomer 1 ak 0                     |
| Wàllu         | `[1, 2, 3]`          | `##]`      | Xëtu yi nekk ci kër                 |
| Tuple         | `(a, b)`             | `##)`      | Ci nomer                            |
| Tuple bu tur  | `(x: 1, y: 2)`       | `##)`      | Jëfandikoo tur walla nomer          |

```zymbol
// Sakantal xëtu — (xëtu, nomer, xëy) may
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Dem ak Dugub

```zymbol
>> "Salaam" ¶                    // ¶ walla \\ dafa dem ci dëkk wëpp
>> "a=" a " b=" b ¶              // xëy ak yëgël ci këy bi
>> (deret$#) ¶                   // operatör yu kanam dañu soxor ko ci (...)

<< tur                           // dañu jox — jël ci jumtukat
<< "Sa tur? " tur                // ak baskël
```

> `¶` walla `\\` dañu nu dëgg rekk ci dëkk wëpp.

---

## Jëfandikukaay

```zymbol
// Xam-xam — jëfandikoo ci jëfandikoo; operatör yi am benn benn ci >> bu yëgël
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (jëfandikoo nomer bu dëkk)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (puissance)

// Xëy-bu-xëy
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lojiik
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Xettub-Rab

```zymbol
// Ñett yëgël wallu wolu
tur = "Ana"
n = 42

wolu = "Salaam, ", tur, "!"               // virgul — ci jëfandikoo
>> "Salaam " tur " nga am " n ¶           // ku-xigeenka — ci dem >>
xër = "Salaam {tur}, nga am {n}"          // interpolasion — ci jëm wëpp
```

```zymbol
s = "Salaam Addinaa"
len = s$#                  // 14
sub = s$[0..6]             // "Salaam"  (dëkku dañu ko wàcc)
has = s$? "Addinaa"        // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "SAlAAm AddinAA"
rep1 = s$~~["a":"A":1]     // "SAlaam Addinaa"  (N bu njëkk rekk)
```

> `+` ci nomer rekk. Ci wolu jëfandikoo `,`, ku-xigeenka, walla interpolasion.

---

## Dëkku Jëm

```zymbol
x = 7

? x > 0 { >> "bu nekkee kanam" ¶ }

? x > 100 {
    >> "xëy" ¶
} _? x > 0 {
    >> "bu nekkee kanam" ¶
} _? x == 0 {
    >> "ñaareel" ¶
} _ {
    >> "bu nekkee kanam du" ¶
}
```

> Blok `{ }` **waajuul**, bëgg ci dëkk bu yëgël.

---

## Match

```zymbol
// Rang
nomer_xëy = 85
penc = ?? nomer_xëy {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> penc ¶    // → B

// Wolu
rëdd = "xonq"
kood = ?? rëdd {
    "xonq"  : "#FF0000"
    "wert"  : "#00FF00"
    _       : "#000000"
}

// Yëgël
tamp = -5
dëkk = ?? tamp {
    _? tamp < 0  : "dëgg"
    _? tamp < 20 : "sedd"
    _? tamp < 35 : "tanq"
    _            : "tang"
}
>> dëkk ¶    // → dëgg

// Qaab xëy (gacce blok)
?? n {
    0       : { >> "ñaareel" ¶ }
    _? n < 0: { >> "bu nekkee kanam du" ¶ }
    _       : { >> "bu nekkee kanam" ¶ }
}
```

---

## Ànd-ànd

```zymbol
@ i:0..4  { >> i " " }        // rang bu dëkk: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ak kanam: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // bu wëccëf: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (solange)

mbir = ["Mànggo", "Ditax", "Jaxatu"]
@ b:mbir { >> b ¶ }

@ c:"salaam" { >> c "-" }
>> ¶                          // → s-a-l-a-a-m-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> dem kanam
    ? i > 7 { @! }             // @! jël dem
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Ànd-ànd bu dëkk
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Ànd-ànd bu tur (jël dem bu xidid)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Liggéey

```zymbol
yokku(a, b) { <~ a + b }
>> yokku(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Liggéey yi am **jëm yëgël** — du jëfandikoo jumtukat yu kanam. Jëfandikoo `<~` ngir soppati jumtukat yu waamkat:

```zymbol
soppal(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
soppal(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Liggéey yu tur du xëy bu kanam. Ci jox ci xëy: `x -> tur(x)`.

---

## Lambda ak Fitu

```zymbol
ñaareel = x -> x * 2
yokku = (a, b) -> a + b
>> ñaareel(5) ¶    // → 10
>> yokku(3, 7) ¶   // → 10

// Lambda ak blok
penc = x -> {
    ? x > 0 { <~ "bu nekkee kanam" }
    _? x < 0 { <~ "bu nekkee kanam du" }
    <~ "ñaareel"
}

// Fitu — lambda yi jëfandikoo jumtukat yu kanam
faktër = 3
ñett = x -> x * faktër
>> ñett(7) ¶    // → 21

// Fabrik liggéey
make_yokku(n) { <~ x -> x + n }
yokk10 = make_yokku(10)
>> yokk10(5) ¶    // → 15

// Ci array
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Wàllu

Wàllu **yi soppi** (mutable) ak ëlëm yi **bu xëtu dati bu dëkk**.

```zymbol
deret = [1, 2, 3, 4, 5]

deret[0]          // 1 — jëfal (index bu tànn ci 0)
deret[-1]         // 5 — index tasan (dëkkël)
deret$#           // 5 — paxar (soxor ci (...) ci >>)

deret = deret$+ 6            // yokku → [1,2,3,4,5,6]
deret2 = deret$+[2] 99       // jox ci index 2
deret3 = deret$- 3           // tëj njëkk ci xëy bi
deret4 = deret$-- 3          // tëj lépp
deret5 = deret$-[0]          // tëj ci index
deret6 = deret$-[1..3]       // tëj rang (dëkkël wàccuul)

am = deret$? 3            // #1 — am
pos = deret$?? 3          // [2] — index yi lépp
ànd = deret$[0..3]        // [1,2,3] — ànd (dëkkël wàccuul)
ànd2 = deret$[0:3]        // [1,2,3] — syntax bu nomer

ol = deret$^+             // tartiib ol (primitives rekk)
sëf = deret$^-            // tartiib sëf (primitives rekk)

// Tuple bu tur/nomer — jëfandikoo $^ ak lambda bu xëy-bu-xëy
db = [(tur: "Carla", at: 28), (tur: "Ana", at: 25), (tur: "Bob", at: 30)]
ci_at   = db$^ (a, b -> a.at < b.at)
ci_tur  = db$^ (a, b -> a.tur > b.tur)
>> ci_at[0].tur ¶     // → Ana
>> ci_tur[0].tur ¶    // → Carla

// Jox ci biir (wàllu rekk)
deret[1] = 99              // jox
deret[0] += 5              // compound: +=  -=  *=  /=  %=  ^=

// Yokku bu liggéey — def wàllu bu bees; njëkk bi du soppi
deret2 = deret[1]$~ 99
```

> Operatör uru yi lépp dañu jox **array bu bees**. Jëfandikoo ci: `deret = deret$+ 4`.
> Du soxor ñaar — jëfandikoo jëfandikoo dhexee.
> `$^+` / `$^-` dañu tartiib **array yu primitive**. Tuple array jëfandikoo `$^` ak lambda.

**Semantik xëy** — jox wàllu ci jëfandikukaay bees di def kopi bu yombal:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b du soppi
```

```zymbol
// Array yu xidid
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[1][2] ¶    // → 6
```

---

## Décomposition

```zymbol
// Wàllu
deret = [10, 20, 30, 40, 50]
[a, b, c] = deret              // a=10  b=20  c=30
[njëkk, *dëkkël] = deret       // njëkk=10  dëkkël=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ wàcc ko

// Tuple bu nomer
dhibic = (100, 200)
(px, py) = dhibic              // px=100  py=200

// Tuple bu tur
nit = (tur: "Ana", at: 25, dëkk: "Ndakaaru")
(tur: t, at: a) = nit          // t="Ana"  a=25
```

---

## Tuple

Tuple yi **du soppi** (immutable) — dañu am elemang **yu bëgg-bëgg**. Àkku wàllu yi, elemang yi du soppi juqël yi créé.

```zymbol
// Bu nomer
dhibic = (10, 20)
>> dhibic[0] ¶    // → 10

xëyu = (42, "salam", #1, 3.14)
>> xëyu[2] ¶     // → #1

// Bu tur
nit = (tur: "Alice", at: 25)
>> nit.tur ¶    // → Alice
>> nit[0] ¶     // → Alice (index dafa liggéey)

// Xidid
pos = (x: 10, y: 20)
p = (pos: pos, summad: "origine")
>> p.pos.x ¶        // → 10
```

**Du soppi (Immutabilité)** — soppi ci elemang bi tuple dafa am dëgg ci waktu:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ dëgg ci waktu: tuple du soppi
// t[0] += 5    // ❌ dëgg bii rekk
```

Jëfandikoo `$~` (yokku bu liggéey) — def **Tuple bu bees**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← njëkk bi du soppi
>> t2 ¶    // → (10, 999, 30)

// Tuple bu tur — def mees ci biir
nit = (tur: "Alice", at: 25)
nit2  = (tur: nit.tur, at: 26)
>> nit.at ¶    // → 25
>> nit2.at ¶   // → 26
```

---

## Liggéey yu Rang bu Kanam

> Operatör HOF yi waajuul **lambda bu inline** — du variable lambda ci dëkk.

```zymbol
nomeryi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ñaareelyi  = nomeryi$> (x -> x * 2)                // map  → [2,4,6…20]
paari      = nomeryi$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
jàmm       = nomeryi$< (0, (acc, x) -> acc + x)     // reduce → 55

// Silsilaa dhexee
etap1 = nomeryi$| (x -> x > 3)
etap2 = etap1$> (x -> x * x)
>> etap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Liggéey yu tur ci HOF — bëgg ci lambda
ñaareel_l(x) { <~ x * 2 }
r = nomeryi$> (x -> ñaareel_l(x))    // ✅
```

---

## Operatër Tuyël

RHS waajuul `_` bu placeholder ci xëy bi darr bi:

```zymbol
ñaareel = x -> x * 2
yokku = (a, b) -> a + b
yokk1 = x -> x + 1

5 |> ñaareel(_)        // → 10
10 |> yokku(_, 5)      // → 15
5 |> yokku(2, _)       // → 7

// Silsilaa
r = 5 |> ñaareel(_) |> yokk1(_) |> ñaareel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Solu Njëkk

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Xam-xam ci ñaareel" ¶
} :! {
    >> "solu bees: " _err ¶    // _err am xibaar solu bi
} :> {
    >> "dafa dem ndaw" ¶
}
```

| Xëtu       | Kañ dafa am                         |
|------------|-------------------------------------|
| `##Div`    | Xam-xam ci ñaareel                  |
| `##IO`     | Fisel / Sistëm                      |
| `##Index`  | Index bu kanam ci rang              |
| `##Type`   | Solu xëtu                           |
| `##Parse`  | Solu parsing                        |
| `##Network`| Solu réseau                         |
| `##_`      | Solu wëpp (catch-all)               |

---

## Modul

```zymbol
// Fisel: lib/kalkil.zy
# kalkil

#> { yokku, get_PI }    // Eksportasion KANAM définisyonyi

_PI := 3.14159
yokku(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fisel: main.zy
<# ./lib/kalkil <= k    // Alias waajuul

>> k::yokku(5, 3) ¶     // → 8
pi = k::get_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Eksportasion ak tur yëgël
# mylib
#> { _internal_add <= yokku_bi }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::yokku_bi(3, 4) ¶    // → 7  (tur bu biir _internal_add planqe)
```

---

## Yoon yi Ciif

Zymbol mën na yëgël ciif ci **Unicode bëj-gànnaar yi 69** — Devanagari, Arabi-Inde, Taayilaand, Klingon pIqaD, Xam-xam bu Dëkk, segment LCD ak yeneen. Yoon bu am njëkk bi dëkk ak loxo `>>`-bi rekk; xam-xam bi ci tëgg dëkk binary la.

### Jëfandiku bëj-gànnaar

Bind ciif `0` ak `9` bëj-gànnaar bi ci `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic  (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Yëgël ak xaritu yëgëlëef

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Yëgëlëef: # kanam dëkk ASCII, ciif yi jaaxle
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Ciif asli ci kood source

Ciif bëj-gànnaar bu ëlëek yi am ngëm — ci suufu, modulo, taaxuleen:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Yëgëlëef ci bëj-gànnaar

`#` + ciif `0` walla `1` ci bloc ci fi xam ngëm yëgëlëef:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` dëkk **ASCII**. `#0` (fànaan) dëkk feebar `0` (ciif zero) ci bëj-gànnaar bëgg.

---

## Jëfandikukaay Data

```zymbol
// Soppati wolu nomer
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (solu-baax)

// Waxtaanal / tëj
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (waxtaanal ci 2 ci kanam)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tëj)

// Qaab nomer
fmt = #,|1234567|      // → 1,234,567  (comma-separe)
sci = #^|12345.678|    // → 1.2345678e4  (siyantifik)

// Base literals
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Soppati base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Danku ak Shell

```zymbol
bés = <\ date +%Y-%m-%d \>     // dox stdout (ak \n dëkkël)
>> "Tey: " bés

fisel = "data.txt"
yëgël = <\ cat {fisel} \>      // interpolasion ci jëfandikoo yi

output = </"./subscript.zy"/>   // dox script Zymbol bees, dox output
>> output
```

> `><` dox CLI yi ak array wolu (tree-walker rekk).

---

## Tënk bu Xóólóólu: FizzBuzz

```zymbol
setal(nomer) {
    ? nomer % 15 == 0 { <~ "FizzBuzz" }
    _? nomer % 3  == 0 { <~ "Fizz" }
    _? nomer % 5  == 0 { <~ "Buzz" }
    _ { <~ nomer }
}

@ i:1..20 { >> setal(i) ¶ }
```

---

## Taatef Signa

| Signa | Liggéey | Signa | Liggéey |
|-------|---------|-------|---------|
| `=` | Jumtukat | `$#` | Paxar |
| `:=` | Dëkku yëgël | `$+` | Yokku |
| `>>` | Dem | `$+[i]` | Jox ci index |
| `<<` | Dugub | `$-` | Tëj njëkk ci xëy |
| `¶` / `\\` | Dëkk wëpp | `$--` | Tëj lépp ci xëy |
| `?` | Jëm (if) | `$-[i]` | Tëj ci index |
| `_?` | Walla jëm (elif) | `$-[i..j]` | Tëj rang |
| `_` | Walla / yëgël | `$?` | Am |
| `??` | match | `$??` | Index yi lépp |
| `@` | Ànd-ànd | `$[s..e]` | Ànd |
| `@!` | Jël dem (break) | `$>` | map |
| `@>` | Dem kanam (continue) | `$\|` | filter |
| `->` | Lambda | `$<` | reduce |
| `deret[i] = val` | Jox elemang (wàllu rekk) | `deret[i] += val` | compound jox |
| `deret[i]$~` | yokku bu liggéey (kopi bu bees) | `$^+` | Tartiib ol (primitives) |
| `$^-` | Tartiib sëf (primitives) | `$^` | Tartiib ak comparator (tuples) |
| `<~` | Màggal (return) | `!?` | Solu (try) |
| `\|>` | Pipe | `:!` | Jëfal (catch) |
| `#1` | Wér | `:>` | Ndaw (finally) |
| `#0` | Xam-xam du wér | `$!` | Solu bi am |
| `<#` | Importasion | `$!!` | Dem solu bi |
| `#` | Setal modul | `#>` | Eksportasion |
| `::` | Jëfal modul | `.` | Jëfal biir |
| `#\|..\|` | Parse nomer | `#?` | Metadata xëtu |
| `#.N\|..\|` | Waxtaanal | `#!N\|..\|` | Tëj |
| `#,\|..\|` | Qaab comma | `#^\|..\|` | Siyantifik |
| `#d0d9#` | soppi yoon yi ciif | `#09#` | dellu ASCII |
| `<\ ..\>` | shell exec | `>\<` | Doodaa CLI |

## Tariix Wersiyon yi

### v0.0.3 — Unicode Bëj-gànnaar Ciif & Yaatal LSP _(Awril 2026)_

- **Yokk** Unicode bloc ciif 69 ak caloon soppi yoon `#d0d9#`
- **Yokk** Yëgëlëef ci bëj-gànnaar — `#१` / `#०`, `#١` / `#٠`, ak yeneen
- **Yokk** Klingon pIqaD ciif (CSUR PUA U+F8F0–U+F8F9)
- **Yokk** VM opcode `SetNumeralMode` — pareeti ak tree-walker
- **Yokk** REPL soxoroon yoon ciif ci echo ak yëgëlëef variables
- **Soppi** Yëgël `>>` yëgëlëef am `#` kanam (`#0` / `#1`) ci yoon yëpp

### v0.0.2_01 — Soppi Turu Jëfandikukaay _(30 Mar 2026)_

- **Soppi** `c|..|` → `#,|..|` ak `e|..|` → `#^|..|` — rafetoon ak waa-kër `#`
- **Yokk** Alias export: export mujjeel module ci turu yeneen

### v0.0.2 — Yokk API Collection & Instalateur _(24 Mar 2026)_

- **Yokk** Waa-kër jëfandikukaay `$` arrays ak strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yokk** Destructuring arrays, tuples ak tuples bu turu
- **Yokk** Index yu tàng (`arr[-1]` = element yu dëkk)
- **Yokk** Instalateur asli — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Yokk** Attribution `^=`
- **Dëgël** Kees border parser xam-xam; dëggël documents

### v0.0.1 — Yëgël bu Njëkk _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× gaaw, ~95% pareeti)
- Constructions yëpp: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode identifiants, système module, lambda, fermeture, dëggël njëjjëef
- REPL, LSP, extension VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Signa. Àddina. Du saf.*

> **Xibaar:** Dokkumantasion bii dañu ko def ak jëfandikoo xam-xam bu otomatik (IA).
> Dañu wàcc gëm ci xëy bi, waaye ay jëfandikoo walla misaal mën a am solu.
> Xiibaar bu dëgg moo nekk ci [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
