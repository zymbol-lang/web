# Zymbol-Lang Ome Wẽra

**Zymbol-Lang** embera ome wẽra kira pari. Jã dachi nezarã — kira pari dachi nezarã. Embera ome wẽra dachi nezara.

---

## Dachi Ome

- Jã nezara (`if`, `while`, `return` jã dachi — kira pari `?`, `@`, `<~`)
- Unicode wẽra — dachi ome wẽra kira pari 👋
- Ome jãni — kira pari dachi ome wẽra nezara

---

## Kira mîna Jãni Pari

```zymbol
kira = 10           // kira (wẽra)
DACHI := 3.14159    // jãni pari (jã wẽra — kira jã)
nabi = "Ana"
ome = #1            // wẽra pari
👋 := "Nabi, Embera!"
```

### Kira Wẽra Jãni

```zymbol
kira = 10    // 10
kira += 5    // 15
kira -= 3    // 12
kira *= 2    // 24
kira /= 4    // 6
kira %= 4    // 2
kira++       // 3
kira--       // 2
```

---

## Ome Kira

| Kira Ome        | Wẽra Pari           | Symbol `#?`  | Dachi Nezara                        |
|-----------------|---------------------|--------------|-------------------------------------|
| Jãni Kira       | `42`, `-7`          | `###`        | 64-Bit wẽra pari                    |
| Wẽra Kira       | `3.14`, `1.5e10`    | `##.`        | Nezara ome wẽra                     |
| Ome Kira        | `"nabi"`            | `##"`        | Wẽra: `"Nabi {nabi}"`               |
| Kira Ome        | `'A'`               | `##'`        | Ome kira wẽra                       |
| Pari Ome        | `#1`, `#0`          | `##?`        | Jã kira 1 mîna 0                    |
| Kira Pari       | `[1, 2, 3]`         | `##]`        | Ome kira nezara                     |
| Tuple           | `(a, b)`            | `##)`        | Kira pari                           |
| Nabi Tuple      | `(x: 1, y: 2)`      | `##)`        | Kira nabi mîna jãni                 |

---

## Ewandó mîna Peda

```zymbol
// Ewandó — jã ome wẽra kira pari
>> "Nabi" ¶                      // ¶ mîna \\ ome wẽra
>> "a=" kira " b=" peda ¶        // ome kira wẽra jãni
>> "dachi=" ewandó(2, 3) ¶       // ewandó kira pari
>> (dachi$#) ¶                   // kira pari ewandó wẽra

// Peda
<< nabi                          // jã ome — kira peda
<< "Nabi ome? " nabi             // ome peda
```

> `¶` mîna `\\` ome wẽra kira pari.

---

## Kira Ome

Nezara wẽra pari — dachi kira ome:

```zymbol
nabi = "Ana"
kira = 25

// 1. Ome — kira = mîna :=
ome = "Nabi ", nabi, "!"               // → Nabi Ana!
DACHI := "Kira: ", nabi

// 2. Wẽra — ewandó >>
>> "Nabi " nabi " kira " kira ¶        // → Nabi Ana kira 25

// 3. Wẽra Ome — dachi nezara
peda = "Nabi {nabi}, kira {kira}"      // → Nabi Ana, kira 25
```

> **Dachi**: `+` jã kira wẽra pari. Ome kira wẽra nezara.

---

## Jaida

```zymbol
kira = 7

// Jãni ome
? kira > 0 { >> "wẽra pari" ¶ }

// Jãni / ome jãni / ome
? kira > 100 {
    >> "dachi" ¶
} _? kira > 0 {
    >> "wẽra pari" ¶
} _? kira == 0 {
    >> "jã" ¶
} _ {
    >> "jã wẽra" ¶
}
```

Kira pari `{ }` **dachi nezara**, ome kira wẽra.

---

## Match

```zymbol
// Match kira ome
ome = 85
nezara = ?? ome {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nezara ¶    // → B

// Match kira wẽra
peda = -5
dachi = ?? peda {
    _? peda < 0  : "wẽra"
    _? peda < 20 : "kira"
    _? peda < 35 : "nabi"
    _            : "dachi"
}
>> dachi ¶    // → wẽra

// Match ome kira
nabi = "babará"
kira = ?? nabi {
    "babará"  : "#FF0000"
    "bupurú"  : "#00FF00"
    _         : "#000000"
}
>> kira ¶
```

---

## Naweda

```zymbol
// Kira wẽra: 0..4 → 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Kira ome wẽra
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Kira jã ome
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Wẽra ome
kira = 1
@ kira <= 64 { kira *= 2 }
>> kira ¶    // → 128

// Kira dachi
nabi = ["Embera", "Dachi", "Wẽra"]
@ ome:nabi { >> ome ¶ }

// Ome kira wẽra
@ c:"nabi" { >> c "-" }
>> ¶    // → n-a-b-i-

// Dachi mîna Wẽra
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> wẽra
    ? i > 7 { @! }          // @! dachi
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Dachi Nezara

```zymbol
// Ewandó mîna kira
ewandó(a, b) { <~ a + b }
>> ewandó(3, 4) ¶    // → 7

// Kira ome
dachi(kira) {
    ? kira <= 1 { <~ 1 }
    <~ kira * dachi(kira - 1)
}
>> dachi(5) ¶    // → 120

// Dachi nezara — jã kira ome wẽra
ome = 100
nezara() {
    kira = 42    // ome kira
    <~ kira
}
>> nezara() ¶    // → 42
```

> **Dachi**: Ewandó nabi `ome(nembi){ }` jã kira wẽra pari.
> Kira pari wẽra: `x -> ome(x)`.

---

## Lambda mîna Kira

```zymbol
// Ome lambda (wẽra kira)
peda = x -> x * 2
dachi = (a, b) -> a + b
>> peda(5) ¶     // → 10
>> dachi(3, 7) ¶ // → 10

// Lambda kira ome (wẽra kira pari)
nezara = x -> {
    ? x > 0 { <~ "wẽra pari" }
    _? x < 0 { <~ "jã wẽra" }
    <~ "jã"
}
>> nezara(5) ¶      // → wẽra pari
>> nezara(0) ¶      // → jã
>> nezara(-5) ¶     // → jã wẽra

// Kira — lambda ome wẽra pari
kira = 3
dachi = x -> x * kira    // kira wẽra 'kira'
>> dachi(7) ¶    // → 21

// Ewandó kira ome
make_adder(kira) { <~ x -> x + kira }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda kira: dachi wẽra
ome = [x -> x+1, x -> x*2, x -> x*x]
>> ome[0](5) ¶    // → 6
>> ome[2](5) ¶    // → 25
```

---

## Nembira

```zymbol
dachi = [10, 20, 30, 40, 50]

// Kira (0 ome wẽra)
>> dachi[0] ¶    // → 10

// Ome wẽra (kira wẽra >> dachi)
kira = dachi$#
>> (dachi$#) ¶    // → 5

// Ewandó, kira, wẽra, pari
dachi = dachi$+ 60              // ewandó
dachi = dachi$- 0               // kira 0
ome = dachi$? 30                // → #1
pari = dachi$[0..2]             // [20, 30]

// Kira wẽra
dachi[1] = 99

// Kira dachi
@ x:dachi { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **kira wẽra** dachi — wẽra: `dachi = dachi$+ 4`.
> Jã kira: peda wẽra kira ome.

---

## Tuple

```zymbol
// Nabi Tuple
nabi = (ome: "Alice", kira: 25)
>> nabi.ome ¶     // → Alice
>> nabi.kira ¶    // → 25
>> nabi[0] ¶      // → Alice (kira ome)
```

---

## Wẽra Kira

Kira ome wẽra **lambda inline** — jã lambda kira wẽra.

```zymbol
kira = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
peda = kira$> (x -> x * 2)
>> peda ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
dachi = kira$| (x -> x % 2 == 0)
>> dachi ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (ome kira, (ome, kira) -> wẽra)
nezara = kira$< (0, (ome, x) -> ome + x)
>> nezara ¶    // → 55
```

---

## Jãni

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Kira jã wẽra" ¶
} :! ##IO {
    >> "IO kira" ¶
} :! {
    >> "ome kira: " _err ¶
} :> {
    >> "dachi wẽra" ¶
}
```

| Kira Ome    | Dachi Nezara                  |
|-------------|-------------------------------|
| `##Div`     | Kira jã wẽra                  |
| `##IO`      | Kira / ome wẽra               |
| `##Index`   | Kira ome pari                 |
| `##Type`    | Kira ome wẽra                 |
| `##Parse`   | Kira wẽra pari                |
| `##Network` | Kira ome nezara               |
| `##_`       | Dachi kira (catch-all)        |

---

## Ome Wẽra

```zymbol
// Kira: lib/dachi.zy
# dachi

#> { ewandó, get_DACHI }    // Kira wẽra DACHI nezara

_DACHI := 3.14159
ewandó(a, b) { <~ a + b }
get_DACHI() { <~ _DACHI }
```

```zymbol
// Kira: main.zy
<# ./lib/dachi <= d    // Kira wẽra dachi

>> d::ewandó(5, 3) ¶   // → 8
pari = d::get_DACHI()
>> pari ¶              // → 3.14159
```

---

## Dachi Kira: FizzBuzz

```zymbol
ewandó(nembi) {
    ? nembi % 15 == 0 { <~ "BabaráBupurú" }
    _? nembi % 3  == 0 { <~ "Babará" }
    _? nembi % 5  == 0 { <~ "Bupurú" }
    _ { <~ nembi }
}

@ i:1..20 { >> ewandó(i) ¶ }
```

---

## Kira Pari

| Symbol  | Kira Ome           | Symbol     | Kira Ome              |
|---------|--------------------|------------|-----------------------|
| `=`     | Kira               | `$#`       | Ome wẽra              |
| `:=`    | Jãni Pari          | `$+`       | Ewandó                |
| `>>`    | Dachi              | `$-`       | Kira (jãni)           |
| `<<`    | Peda               | `$?`       | Wẽra ome              |
| `¶`/`\` | Ome wẽra           | `$[s..e]`  | Kira pari             |
| `?`     | Jaida (if)         | `$>`       | map                   |
| `_?`    | Ome jaida (elif)   | `$\|`      | filter                |
| `_`     | Ome / kira pari    | `$<`       | reduce                |
| `??`    | match              | `!?`       | Jãni (try)            |
| `@`     | Naweda             | `:!`       | Kira (catch)          |
| `@!`    | Dachi (break)      | `:>`       | Dachi wẽra (finally)  |
| `@>`    | Wẽra (continue)    | `$!`       | Kira wẽra             |
| `->`    | Lambda             | `$!!`      | Kira pari             |
| `<~`    | Nezara (return)    | `#`        | Ome wẽra dachi        |
| `\|>`   | Pipe               | `#>`       | Dachi kira            |
| `#1`    | Wẽra (#1)          | `<#`       | Peda kira             |
| `#0`    | Jã (#0)            | `::`       | Ome kira              |

---

*Zymbol-Lang — Kira. Dachi. Jãni Pari.*

---

> **Dachi Nezara:** Ome wẽra kira pari dachi nezara ome kira wẽra. Kira ome wẽra pari dachi nezara kira ome. Kira pari wẽra: [Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
