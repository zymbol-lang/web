# Jëfandikukat yu Woyof Zymbol-Lang

**Zymbol-Lang** dafa ko làmbi ci sa pirogram bu xam xam yu signa. Dañu ko def te amul dem-dem xam-xam — dëkk bu nekk signa la. Dafa liggéey fi ci këlë ëllëk jëm ak koo.

---

## Xam-Xam bu Siiw

- Amul dem-dem xam-xam (`if`, `while`, `return` amul fi — signa rekk `?`, `@`, `<~`)
- Unicode bu xëy — tur ci bëgg-bëgg làkk walla emoji 👋
- Du làkk bu dëkk — kodu bi dafa nu sa ci bëgg-bëgg làkk

---

## Jumtukat ak Dëkku Yëgël

```zymbol
x = 10           // Jumtukat (mën a yokku)
PI := 3.14159    // Dëkku yëgël (du mën a yokku — lañu jël sañu bëgg-bëgg)
tur = "Ana"
aktif = #1       // wér bu dëgg
👋 := "Salaam"
```

### Jëfandikoo yu Xëy

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

## Xëtu Dati

| Xëtu         | Misaal               | Signa `#?` | Xibaar                              |
|--------------|----------------------|------------|-------------------------------------|
| Nomerkat     | `42`, `-7`           | `###`      | 64-bit bu am giskat                 |
| Nomer bu yeg | `3.14`, `1.5e10`     | `##.`      | Notation bu siyantifik dafa baax    |
| Wolu          | `"salaam"`           | `##"`      | Interpolasion: `"Xam {tur}"`        |
| Bireew        | `'A'`                | `##'`      | Bireew bu nekk ak Unicode           |
| Wér           | `#1`, `#0`           | `##?`      | DU nomer 1 ak 0                     |
| Array         | `[1, 2, 3]`          | `##]`      | Xëtu yi nekk ci kër                 |
| Tuple         | `(a, b)`             | `##)`      | Ci nomer                            |
| Tuple bu tur  | `(x: 1, y: 2)`       | `##)`      | Jëfandikoo tur walla nomer          |

---

## Dem ak Dugub

```zymbol
// Dem — du yokku ci dëkk wëpp auto
>> "Salaam" ¶                    // ¶ walla \\ dafa dem ci dëkk wëpp
>> "a=" a " b=" b ¶              // xëy ak yëgël ci këy bi
>> "jumlate=" yokku(2, 3) ¶      // jëf yi nekk ci nopp bu nekk
>> (deret$#) ¶                   // operatör yu kanam dañu soxor ko ci (...)

// Dugub
<< tur                           // dañu jox — jël ci jumtukat
<< "Sa tur? " tur                // ak baskël
```

> `¶` walla `\\` dañu nu dëgg rekk ci dëkk wëpp.

---

## Jëm Wéy Làmbi

Ñett yëgël yu baax — dëkkëbu nekk ci jëm moo:

```zymbol
tur = "Ana"
n = 25

// 1. Virgul — ci jëfandikoo ak = walla :=
wolu = "Salaam, ", tur, "!"              // → Salaam, Ana!
TIITLE := "Jëfandikukat: ", tur

// 2. Këy bi — ci dem >>
>> "Salaam " tur " nga am " n ¶          // → Salaam Ana nga am 25

// 3. Interpolasion — ci jëm wëpp
xër = "Salaam {tur}, nga am {n}"         // → Salaam Ana, nga am 25
```

> **Xibaar**: `+` ci nomer rekk. Ci wolu dafa jox xibaaral.

---

## Dëkku Jëm

```zymbol
x = 7

// Jëm bu yëgël
? x > 0 { >> "bu nekkee kanam" ¶ }

// Jëm / walla jëm / walla
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

Blok `{ }` **waajuul**, bëgg ci dëkk bu yëgël.

---

## Match

```zymbol
// Match ak rang
nomer_xëy = 85
penc = ?? nomer_xëy {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> penc ¶    // → B

// Match ak yëgël (jëm yu bëgg-bëgg)
tamp = -5
dëkk = ?? tamp {
    _? tamp < 0  : "dëgg"
    _? tamp < 20 : "sedd"
    _? tamp < 35 : "tanq"
    _            : "tang"
}
>> dëkk ¶    // → dëgg

// Match ak wolu
rëdd = "xonq"
kood = ?? rëdd {
    "xonq"  : "#FF0000"
    "wert"  : "#00FF00"
    _       : "#000000"
}
>> kood ¶
```

---

## Ànd-ànd

```zymbol
// Rang bu dëkk: 0..4 dafa dem 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Rang ak kanam
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Rang bu wëccëf
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Solange (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Ci këy bi nekk
mbir = ["Mànggo", "Ditax", "Jaxatu"]
@ b:mbir { >> b ¶ }

// Ci bireew yi wolu bi
@ c:"salaam" { >> c "-" }
>> ¶    // → s-a-l-a-a-m-

// Break ak Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> dem kanam
    ? i > 7 { @! }          // @! jël dem
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Liggéey

```zymbol
// Setal ak jëfal
yokku(a, b) { <~ a + b }
>> yokku(3, 4) ¶    // → 7

// Rekursion
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120

// Liggéey yi am jëm yëgël — du jëfandikoo jumtukat yu kanam
global = 100
tëstël() {
    x = 42    // ci fii rekk
    <~ x
}
>> tëstël() ¶    // → 42
```

> **Waajuul**: Liggéey yu tur `tur(params){ }` du xëy bu kanam.
> Ci jox ci xëy: `x -> tur(x)`.

---

## Lambda ak Fitu

```zymbol
// Lambda bu yëgël (màggal implicite)
ñaareel = x -> x * 2
yokku = (a, b) -> a + b
>> ñaareel(5) ¶    // → 10
>> yokku(3, 7) ¶   // → 10

// Lambda ak blok (màggal explicite)
penc = x -> {
    ? x > 0 { <~ "bu nekkee kanam" }
    _? x < 0 { <~ "bu nekkee kanam du" }
    <~ "ñaareel"
}
>> penc(5) ¶     // → bu nekkee kanam
>> penc(0) ¶     // → ñaareel
>> penc(-5) ¶    // → bu nekkee kanam du

// Fitu — lambda yi jëfandikoo jumtukat yu kanam
faktër = 3
ñett = x -> x * faktër    // jëfandikoo 'faktër'
>> ñett(7) ¶    // → 21

// Fabrik liggéey
make_yokku(n) { <~ x -> x + n }
yokk10 = make_yokku(10)
>> yokk10(5) ¶    // → 15

// Lambda ci xëy: doxal ci array
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Wàllu

```zymbol
deret = [10, 20, 30, 40, 50]

// Jëfal (index bu tànn ci 0)
>> deret[0] ¶    // → 10

// Paxar (soxor ci (...) ci >>)
n = deret$#
>> (deret$#) ¶    // → 5

// Yokku, tëj, am, ànd
deret = deret$+ 60               // yokku
deret = deret$- 0                // tëj index 0
am = deret$? 30                  // → #1
ànd = deret$[0..2]               // [20, 30]

// Yokku këy bi
deret[1] = 99

// Ci këy bi nekk
@ x:deret { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` dañu jox **array bu bees** — jëfandikoo ci: `deret = deret$+ 4`.
> Du soxor ñaar: jëfandikoo jëfandikoo ñaar.

---

## Tuple

```zymbol
// Tuple bu tur
nit = (tur: "Alice", at: 25)
>> nit.tur ¶    // → Alice
>> nit.at ¶     // → 25
>> nit[0] ¶     // → Alice (index dafa liggéey)
```

---

## Liggéey yu Rang bu Kanam

Operatör HOF yi waajuul **lambda bu inline** — du variable lambda ci dëkk.

```zymbol
nomeryi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
ñaareelyi = nomeryi$> (x -> x * 2)
>> ñaareelyi ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
paari = nomeryi$| (x -> x % 2 == 0)
>> paari ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (xëy bu dëkk, (acc, këy) -> xëy)
jàmm = nomeryi$< (0, (acc, x) -> acc + x)
>> jàmm ¶    // → 55
```

---

## Solu Njëkk

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Xam-xam ci ñaareel" ¶
} :! ##IO {
    >> "Solu IO" ¶
} :! {
    >> "solu bees: " _err ¶
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

---

## Tënk bu Xóólóólu: FizzBuzz

```zymbol
setal(nomer) {
    ? nomer % 15 == 0 { <~ "BuñDëkk" }
    _? nomer % 3  == 0 { <~ "Buñ" }
    _? nomer % 5  == 0 { <~ "Dëkk" }
    _ { <~ nomer }
}

@ i:1..20 { >> setal(i) ¶ }
```

---

## Taatef Signa

| Signa   | Liggéey             | Signa      | Liggéey                   |
|---------|---------------------|------------|---------------------------|
| `=`     | Jumtukat            | `$#`       | Paxar                     |
| `:=`    | Dëkku yëgël         | `$+`       | Yokku                     |
| `>>`    | Dem                 | `$-`       | Tëj (ci index)            |
| `<<`    | Dugub               | `$?`       | Am                        |
| `¶`/`\` | Dëkk wëpp           | `$[s..e]`  | Ànd                       |
| `?`     | Jëm (if)            | `$>`       | map                       |
| `_?`    | Walla jëm (elif)    | `$\|`      | filter                    |
| `_`     | Walla / yëgël       | `$<`       | reduce                    |
| `??`    | match               | `!?`       | Solu (try)                |
| `@`     | Ànd-ànd             | `:!`       | Jëfal (catch)             |
| `@!`    | Jël dem (break)     | `:>`       | Ndaw (finally)            |
| `@>`    | Dem kanam (continue)| `$!`       | Solu bi am                |
| `->`    | Lambda              | `$!!`      | Dem solu bi               |
| `<~`    | Màggal (return)     | `#`        | Setal modul               |
| `\|>`   | Pipe                | `#>`       | Eksportasion              |
| `#1`    | Wér                 | `<#`       | Importasion               |
| `#0`    | Xam-xam du wér      | `::`       | Jëfal modul               |

---

*Zymbol-Lang — Signa. Àddina. Du saf.*

---

> **Xibaar:** Dokkumantasion bii dañu ko def ak jëfandikoo xam-xam bu otomatik (IA).
> Dañu wàcc gëm ci xëy bi, waaye ay jëfandikoo walla misaal mën a am solu.
> Xiibaar bu dëgg moo nekk ci [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
