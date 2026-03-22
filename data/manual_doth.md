# Zymbol-Lang Alegra Dothraki

**Zymbol-Lang** kisha athdrivar alegra. Vo alegra chiftik — haz athdrivar. Mahrazh khal e chek kisha dothraki.

---

## Vaes

- Vo chiftik (`if`, `while`, `return` vosecchi — alegra tebec `?`, `@`, `<~`)
- Unicode naas — fichas me ilch tebec, emoji 👋
- Tebec-vosecchi — alegra idh me ilch fichas

---

## Azhat bal Mra

```zymbol
x = 10           // azhat (ganar)
PI := 3.14159    // mra (vos ganar — nayc ibac)
fichas = "Ana"
hash_ = #1       // vos vosecchi
👋 := "M'athchomaroon"
```

### Azhatilat

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

## Irge Qoy

| Irge         | Sarch             | Alegra `#?` | Nynir                              |
|--------------|-------------------|-------------|-------------------------------------|
| Gache        | `42`, `-7`        | `###`       | 64-bit                              |
| Gache mhi    | `3.14`, `1.5e10`  | `##.`       | Naas sarch OK                       |
| Fichas       | `"m'athchomaroon"`| `##"`       | Bora: `"Hash {fichas}"`             |
| Tebec Solus  | `'A'`             | `##'`       | At Unicode tebec                    |
| Hash/Vos    | `#1`, `#0`        | `##?`       | Vos gache at                        |
| Lajaki       | `[1, 2, 3]`       | `##]`       | Ilach irge nan                      |
| Tuple        | `(a, b)`          | `##)`       | Azhat                               |
| Fichas Tuple | `(x: 1, y: 2)`    | `##)`       | Fichas ilach gache                  |

---

## Thirat bal Nakar

```zymbol
// Thirat — vos borarir tebec
>> "M'athchomaroon" ¶           // ¶ bal \\ borarir tebec
>> "a=" a " b=" b ¶             // rimba gache — azhat
>> "gache=" astat(2, 3) ¶       // maded ilach azhat
>> (arr$#) ¶                    // alegra gache poQlu'

// Nakar
<< fichas                       // vos tebec — nakar azhat
<< "Fichas? " fichas            // bal tebec
```

> `¶` bal `\\` — nan tebec tebec.

---

## Fichas Boq

Ehn irge — ilach azhat:

```zymbol
fichas = "Ana"
n = 25

// 1. Comma — azhat = bal :=
tebec2 = "M'athchomaroon ", fichas, "!"   // → M'athchomaroon Ana!
KHAL := "Lajak: ", fichas

// 2. Azhat — thirat >>
>> "Hash " fichas " vo " n ¶              // → Hash Ana vo 25

// 3. Bora — ilach azhat
naas2 = "Hash {fichas}, vo {n}"          // → Hash Ana, vo 25
```

> **Nynir**: `+` gache tebec. Fichas — vosecchi.

---

## Hash

```zymbol
x = 7

// At hash
? x > 0 { >> "asshekh" ¶ }

// Hash / hash-vos / vos
? x > 100 {
    >> "tih" ¶
} _? x > 0 {
    >> "asshekh" ¶
} _? x == 0 {
    >> "vos" ¶
} _ {
    >> "dothrak" ¶
}
```

`{ }` — **poQlu'**, at tebec.

---

## Match

```zymbol
// Match gache
gache2 = 85
patlh = ?? gache2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match hrazef (ilach hash)
SuD = -5
Dotlh = ?? SuD {
    _? SuD < 0  : "rhaggat"
    _? SuD < 20 : "bic"
    _? SuD < 35 : "asshekh"
    _            : "tih"
}
>> Dotlh ¶    // → rhaggat

// Match fichas
qoy = "qorasokh"
kode = ?? qoy {
    "qorasokh"  : "#FF0000"
    "yalli"     : "#00FF00"
    _           : "#000000"
}
>> kode ¶
```

---

## Dothrak

```zymbol
// Naná: 0..4 — 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Gache bal dothrak
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Dothrak bic
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Qastat (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Ilach eveth
ovvethikhea = ["hrazef", "jhavvorsa", "qora"]
@ f:ovvethikhea { >> f ¶ }

// Tebec tebec
@ c:"khal" { >> c "-" }
>> ¶    // → k-h-a-l-

// Troch'n bal meh
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> meh
    ? i > 7 { @! }          // @! troch'n
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Maded

```zymbol
// Azhat bal maded
boq(a, b) { <~ a + b }
>> boq(3, 4) ¶    // → 7

// Hrazef maded
gachedothrak(n) {
    ? n <= 1 { <~ 1 }
    <~ n * gachedothrak(n - 1)
}
>> gachedothrak(5) ¶    // → 120

// Maded — vos thirat andë azhat
_khal = 100
lajak2() {
    x = 42    // só
    <~ x
}
>> lajak2() ¶    // → 42
```

> **Nynir**: Fichas maded `fichas(params){ }` — vos at eveth.
> Bora nob — borarir: `x -> fichas(x)`.

---

## Lambda bal Karyai

```zymbol
// Mhi lambda (bora)
akat = x -> x * 2
boq2 = (a, b) -> a + b
>> akat(5) ¶    // → 10
>> boq2(3, 7) ¶  // → 10

// Lambda rhaw (naná bora)
astat2 = x -> {
    ? x > 0 { <~ "asshekh" }
    _? x < 0 { <~ "dothrak" }
    <~ "vos" }
>> astat2(5) ¶     // → asshekh
>> astat2(0) ¶     // → vos
>> astat2(-5) ¶    // → dothrak

// Karyai — lambda azhat andë eveth
factor = 3
ehn2 = x -> x * factor    // azhat 'factor'
>> ehn2(7) ¶    // → 21

// Maded hrazef
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda eveth: lajaki
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Lajaki

```zymbol
arr = [10, 20, 30, 40, 50]

// Nakar (0 gache)
>> arr[0] ¶    // → 10

// Gache (poQlu' >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Boq, teq, hash, mhi
arr = arr$+ 60               // boq
arr = arr$- 0                // teq 0
hash2 = arr$? 30             // → #1
mhi2 = arr$[0..2]            // [20, 30]

// Gaur eveth
arr[1] = 99

// Ilach eveth
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **naur lajaki** — azhat: `arr = arr$+ 4`.
> Vos tanc: akat azhat.

---

## Tuple

```zymbol
// Fichas tuple
lajak3 = (fichas: "Alice", akat: 25)
>> lajak3.fichas ¶    // → Alice
>> lajak3.akat ¶      // → 25
>> lajak3[0] ¶        // → Alice (gache lo'laH)
```

---

## Maded Khal

HOF — **só lambda** — vos lambda azhat.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
akat2 = nums$> (x -> x * 2)
>> akat2 ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
ehn3 = nums$| (x -> x % 2 == 0)
>> ehn3 ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (bora gache, (boq, eveth) -> moj)
naas3 = nums$< (0, (acc, x) -> acc + x)
>> naas3 ¶    // → 55
```

---

## Vosecchi Thirat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "vos gache" ¶
} :! ##IO {
    >> "IO vosecchi" ¶
} :! {
    >> "vosecchi: " _err ¶
} :> {
    >> "ilach lúm" ¶
}
```

| Irge        | Hash                           |
|-------------|--------------------------------|
| `##Div`     | Vos gache                      |
| `##IO`      | Tebec / vaes                   |
| `##Index`   | Gache andë                     |
| `##Type`    | Irge vosecchi                  |
| `##Parse`   | Azhat vosecchi                 |
| `##Network` | Tengwë vosecchi                |
| `##_`       | Ilach vosecchi                 |

---

## Vaes Dothrak

```zymbol
// Tebec: lib/calc.zy
# calc

#> { boq, get_PI }    // Nob AT

_PI := 3.14159
boq(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Tebec: main.zy
<# ./lib/calc <= c    // Fichas poQlu'

>> c::boq(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

---

## Ilach Alegra: FizzBuzz

```zymbol
astat(eveth) {
    ? eveth % 15 == 0 { <~ "FizzatBuzzat" }
    _? eveth % 3  == 0 { <~ "Fizzat" }
    _? eveth % 5  == 0 { <~ "Buzzat" }
    _ { <~ eveth }
}

@ i:1..20 { >> astat(i) ¶ }
```

---

## Alegra Tirë

| Alegra   | Moj                | Alegra     | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | azhat              | `$#`       | gache                 |
| `:=`     | mra                | `$+`       | boq                   |
| `>>`     | thirat             | `$-`       | teq (gache)           |
| `<<`     | nakar              | `$?`       | hash                  |
| `¶`/`\`  | tebec tebec        | `$[s..e]`  | mhi                   |
| `?`      | hash (if)          | `$>`       | map                   |
| `_?`     | hash-vos (elif)    | `$\|`      | filter                |
| `_`      | vos / ilach        | `$<`       | reduce                |
| `??`     | match              | `!?`       | lajak (try)           |
| `@`      | dothrak            | `:!`       | karyai (catch)        |
| `@!`     | troch'n (break)    | `:>`       | ilach (finally)       |
| `@>`     | meh (continue)     | `$!`       | vosecchi hash         |
| `->`     | Lambda             | `$!!`      | vosecchi thirat       |
| `<~`     | bora               | `#`        | vaes fichas           |
| `\|>`    | Pipe               | `#>`       | nob                   |
| `#1`     | hash               | `<#`       | nakar                 |
| `#0`     | vos                | `::`       | vaes maded            |

---

*Zymbol-Lang — Alegra. Ilach. Vos ganar.*

---

> **Nynir:** Alegra haz carna bal thirat AI (tebec maded).
> Ilach maded ná, mal neldë fichas bal sarch vosecchi.
> Khal nynir [Zymbol-Lang alegra](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
