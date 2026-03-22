# Nynir Zymbol-Lang Mando'a

**Zymbol-Lang** cuyir hut'unn ara'novor be programir. N'eparavu cuun ade — ibac cuyir hut'unn. Cuyir ibac nayc'aran gar tion'ad.

---

## Naasade

- N'eparavu cuun ade (`if`, `while`, `return` n'eparavut — hut'unn tebec `?`, `@`, `<~`)
- Unicode naas — gar tion'ad ra'kure Mando'a, gar nynir emoji 👋
- Naas'ika — ibac cuyir ibac meg'haat gar

---

## Mhi'ade bal Mhi'ade ne'

```zymbol
x = 10           // mhi'ade (ganar'ika)
PI := 3.14159    // mhi'ade ne' (n'ganar — nayc ibac)
gar = "Ana"
elek_ = #1       // elek darasuum
👋 := "Su'cuy"
```

### Cuyan borarir

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

## Gai'tayli'yc

| Gai'tayl        | Naas              | Hut'unn `#?` | Nynir                               |
|-----------------|-------------------|--------------|-------------------------------------|
| Gal naas        | `42`, `-7`        | `###`        | 64-bit                              |
| Gal mhi'        | `3.14`, `1.5e10`  | `##.`        | Naas'ika OK                         |
| Hut'unn tebec   | `"Su'cuy"`        | `##"`        | Bora: `"Su'cuy {gar}"`              |
| Tebec solus     | `'A'`             | `##'`        | Solus Unicode tebec                 |
| Elek/Nayc       | `#1`, `#0`        | `##?`        | N'ibac gal solus bal n'gal          |
| Aliit           | `[1, 2, 3]`       | `##]`        | Gaa'tayli'yc ibac meg'haat          |
| Tuple           | `(a, b)`          | `##)`        | Tracyn                              |
| Tuple gar       | `(x: 1, y: 2)`    | `##)`        | Naas'ika gar bal tracyn             |

---

## Hibira bal Cuyir

```zymbol
// Hibira — n'borarir tebec tebec
>> "Su'cuy" ¶                   // ¶ bal \\ borarir tebec tebec
>> "a=" a " b=" b ¶             // gaa'tayli'yc mhi'ade — tracyn
>> "ibac=" jate(2, 3) ¶         // ara'novor meg'haat tracyn
>> (arr$#) ¶                    // naas hut'unn poQlu' poki

// Cuyir
<< gar                          // n'tebec — cuyir gai'tayl
<< "Tion'ad gar? " gar          // bal tebec
```

> `¶` bal `\\` — ibac meg'haat tebec tebec.

---

## Talyc hut'unn

Ehn gai'tayl — ibac meg'haat tracyn:

```zymbol
gar = "Ana"
n = 25

// 1. Kaysh — borarir = bal :=
tebec2 = "Su'cuy ", gar, "!"            // → Su'cuy Ana!
ALOR := "Vod: ", gar

// 2. Tracyn — hibira >>
>> "Su'cuy " gar " gar gal " n ¶        // → Su'cuy Ana gar gal 25

// 3. Bora — ibac tracyn
naas2 = "Su'cuy {gar}, gar gal {n}"    // → Su'cuy Ana, gar gal 25
```

> **Nynir**: `+` gal tebec. Hut'unn tebec — ibac liser.

---

## Tion'ad

```zymbol
x = 7

// Solus tion
? x > 0 { >> "jate" ¶ }

// Tion / tion'yc / nayc
? x > 100 {
    >> "jate naas" ¶
} _? x > 0 {
    >> "jate" ¶
} _? x == 0 {
    >> "pag" ¶
} _ {
    >> "nayc" ¶
}
```

Poki `{ }` — **poQlu'**, ibac solus tebec tebec.

---

## Match

```zymbol
// Match gal tracyn
gal2 = 85
patlh2 = ?? gal2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh2 ¶    // → B

// Match naas (ibac tion)
temp = -5
Dotlh = ?? temp {
    _? temp < 0  : "kelir"
    _? temp < 20 : "bic"
    _? temp < 35 : "warm"
    _            : "warm naas"
}
>> Dotlh ¶    // → kelir

// Match hut'unn
rItlh = "laamyc"
kode = ?? rItlh {
    "laamyc"  : "#FF0000"
    "yaim"    : "#00FF00"
    _         : "#000000"
}
>> kode ¶
```

---

## Meh

```zymbol
// Naas: 0..4 — 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Gal bal meh
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Darasuum bic
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Akaanir (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Ibac mhi'ade
kir = ["mandokar", "verd'goten", "riduur"]
@ f:kir { >> f ¶ }

// Tebec tebec
@ c:"Vode" { >> c "-" }
>> ¶    // → V-o-d-e-

// Troch'n bal meh darasuum
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> meh darasuum
    ? i > 7 { @! }          // @! troch'n
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Ara'novor

```zymbol
// Gai'tayl bal lo'
borarir(a, b) { <~ a + b }
>> borarir(3, 4) ¶    // → 7

// Darasuum
kaysh(n) {
    ? n <= 1 { <~ 1 }
    <~ n * kaysh(n - 1)
}
>> kaysh(5) ¶    // → 120

// Ara'novor — n'cuyi mhi'ade naas
_Manda = 100
troch'n2() {
    x = 42    // solus pa'
    <~ x
}
>> troch'n2() ¶    // → 42
```

> **Nynir**: Gar ara'novor `gar(params){ }` — n'ibac gai'tayl solus.
> Bora nob — borarir: `x -> gar(x)`.

---

## Lambda bal Karyai

```zymbol
// Mhi' lambda (bora)
t'ad = x -> x * 2
ibac2 = (a, b) -> a + b
>> t'ad(5) ¶    // → 10
>> ibac2(3, 7) ¶  // → 10

// Lambda poki (naas bora)
jate = x -> {
    ? x > 0 { <~ "jate" }
    _? x < 0 { <~ "nayc" }
    <~ "pag"
}
>> jate(5) ¶     // → jate
>> jate(0) ¶     // → pag
>> jate(-5) ¶    // → nayc

// Karyai — lambda cuyir mhi'ade naas
factor = 3
ehn2 = x -> x * factor    // cuyir 'factor'
>> ehn2(7) ¶    // → 21

// Ara'novor mhi'ade
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda gai'tayl: aliit
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Trattok'o

```zymbol
arr = [10, 20, 30, 40, 50]

// Gai'tayl (0 tebec)
>> arr[0] ¶    // → 10

// Gal (poki poQlu' >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Borarir, teq, elek, mhi'
arr = arr$+ 60               // borarir
arr = arr$- 0                // teq 0
elek2 = arr$? 30             // → #1
mhi'2 = arr$[0..2]           // [20, 30]

// Bic gai'tayl
arr[1] = 99

// Ibac mhi'ade
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **trattok'o vaii** — borarir: `arr = arr$+ 4`.
> N'gai'tayl: t'ad ara'novor mhi'ade.

---

## Tuple

```zymbol
// Tuple gar
vod = (gar: "Alice", cuir: 25)
>> vod.gar ¶    // → Alice
>> vod.cuir ¶   // → 25
>> vod[0] ¶     // → Alice (tracyn lo'laH)
```

---

## Ara'novor Alor

HOF — **lambda pa'** poQlu' — n'lambda gai'tayl.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
t'ad2 = nums$> (x -> x * 2)
>> t'ad2 ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
cuir2 = nums$| (x -> x % 2 == 0)
>> cuir2 ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (bora gal, (borarir, mhi'ade) -> moj)
naas3 = nums$< (0, (acc, x) -> acc + x)
>> naas3 ¶    // → 55
```

---

## Buir Haat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pag'yc nayc" ¶
} :! ##IO {
    >> "IO nayc" ¶
} :! {
    >> "nayc: " _err ¶
} :> {
    >> "darasuum" ¶
}
```

| Gai'tayl    | Tion'ad                        |
|-------------|--------------------------------|
| `##Div`     | Pag'yc nayc                    |
| `##IO`      | Tebec / naas                   |
| `##Index`   | Tracyn nayc                    |
| `##Type`    | Gai'tayl nayc                  |
| `##Parse`   | Nynir nayc                     |
| `##Network` | Naas nayc                      |
| `##_`       | Ibac nayc                      |

---

## Aliit'verde

```zymbol
// Tebec: lib/calc.zy
# calc

#> { borarir, get_PI }    // Nob SOLUS

_PI := 3.14159
borarir(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Tebec: main.zy
<# ./lib/calc <= c    // Gar poQlu'

>> c::borarir(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

---

## Ara'novor Mhi'ade: FizzBuzz

```zymbol
jate(gal) {
    ? gal % 15 == 0 { <~ "MandoVode" }
    _? gal % 3  == 0 { <~ "Mando" }
    _? gal % 5  == 0 { <~ "Vode" }
    _ { <~ gal }
}

@ i:1..20 { >> jate(i) ¶ }
```

---

## Nynir

| Hut'unn  | Moj                | Hut'unn    | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | mhi'ade            | `$#`       | gal                   |
| `:=`     | mhi'ade ne'        | `$+`       | borarir               |
| `>>`     | hibira             | `$-`       | teq (tracyn)          |
| `<<`     | cuyir              | `$?`       | elek                  |
| `¶`/`\`  | tebec tebec        | `$[s..e]`  | mhi'                  |
| `?`      | tion (if)          | `$>`       | map                   |
| `_?`     | tion'yc (elif)     | `$\|`      | filter                |
| `_`      | nayc / ibac        | `$<`       | reduce                |
| `??`     | match              | `!?`       | troch'n (try)         |
| `@`      | meh                | `:!`       | karyai (catch)        |
| `@!`     | troch'n (break)    | `:>`       | darasuum (finally)    |
| `@>`     | meh darasuum       | `$!`       | nayc cuyir            |
| `->`     | Lambda             | `$!!`      | nayc hibira           |
| `<~`     | bora               | `#`        | aliit nynir           |
| `\|>`    | Pipe               | `#>`       | nob                   |
| `#1`     | elek               | `<#`       | cuyir                 |
| `#0`     | nayc               | `::`       | aliit lo'             |

---

*Zymbol-Lang — Hut'unn. Ibac naas. Darasuum.*

---

> **Nynir:** Tebec ni cuyir bal hibira AI (naas'ika ara'novor).
> Ibac gaa'tayli'yc cuyir troch'n naas, tebec bal borarir li ken nayc.
> Alor nynir cuyir [Zymbol-Lang nynir](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
