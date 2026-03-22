# Sarch Bain Zymbol-Lang

**Zymbol-Lang** na peth bauglo glamren. Ú-beditha i adar — ilach na peth. Na idh erin ilch lammen.

---

## Ind

- Ú-adara i ader (`if`, `while`, `return` ú-choir — peth nain `?`, `@`, `<~`)
- Unicode naur — eneth erin ilch lam, ilyë emoji 👋
- Lam-úgarth — i glaer idh erin ilch lammen

---

## Boe a Dîn

```zymbol
x = 10           // boe (gaur)
PI := 3.14159    // dîn (ú-gaur — naeg ce gaur)
eneth = "Ana"
vorn = #1        // eithel ná
👋 := "Mae govannen"
```

### Tanc Boe

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

## Goth Cîw

| Goth         | Sarch             | Peth `#?` | Notë                                |
|--------------|-------------------|-----------|-------------------------------------|
| Norn         | `42`, `-7`        | `###`     | 64-bit sinwa                        |
| Norn Hin     | `3.14`, `1.5e10`  | `##.`     | Sarch Naur OK                       |
| Peth         | `"mae govannen"`  | `##"`     | Lúm: `"Suilad {eneth}"`             |
| Tengwa       | `'A'`             | `##'`     | Min Unicode tengwa                  |
| Eithel/Ú    | `#1`, `#0`        | `##?`     | Ú-norn min ar ú-norn                |
| Rhaw         | `[1, 2, 3]`       | `##]`     | Ilach goth nan                      |
| Tuple        | `(a, b)`          | `##)`     | Anwa                                |
| Eneth Tuple  | `(x: 1, y: 2)`    | `##)`     | Eneth ilyë norn                     |

---

## Pedo a Lasto

```zymbol
// Pedo — ú-tirë lúm autë
>> "Mae govannen" ¶             // ¶ ar \\ tirë lúm autë
>> "a=" a " b=" b ¶             // rimba norn — tanc
>> "norn=" gerio(2, 3) ¶        // maquet ilach tanc
>> (arr$#) ¶                    // peth norn poQlu'

// Lasto
<< eneth                        // ú-peth — lasto boe
<< "Eneth lín? " eneth          // peth
```

> `¶` ar `\\` — nan lúm autë.

---

## Peth Boq

Neldë sarch — ilach tanc:

```zymbol
eneth = "Ana"
n = 25

// 1. Comma — boe = ar :=
peth2 = "Suilad ", eneth, "!"           // → Suilad Ana!
ARAN := "Ellon: ", eneth

// 2. Tanc — pedo >>
>> "Suilad " eneth " le norn " n ¶       // → Suilad Ana le norn 25

// 3. Lúm — ilach tanc
quenta = "Suilad {eneth}, le norn {n}"  // → Suilad Ana, le norn 25
```

> **Notë**: `+` nornen. Pethassen — naeg.

---

## Ce Ú-Ce

```zymbol
x = 7

// Min ce
? x > 0 { >> "maer" ¶ }

// Ce / ar-ce / ú-ce
? x > 100 {
    >> "alta" ¶
} _? x > 0 {
    >> "maer" ¶
} _? x == 0 {
    >> "ú" ¶
} _ {
    >> "dôl" ¶
}
```

`{ }` — **poQlu'**, min peth.

---

## Match

```zymbol
// Match norn
norn2 = 85
patlh = ?? norn2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match nuith (ilach ce)
ring = -5
ind = ?? ring {
    _? ring < 0  : "helch"
    _? ring < 20 : "ring"
    _? ring < 35 : "laer"
    _            : "naur"
}
>> ind ¶    // → helch

// Match peth
gwath = "caran"
tengwa2 = ?? gwath {
    "caran"  : "#FF0000"
    "calen"  : "#00FF00"
    _        : "#000000"
}
>> tengwa2 ¶
```

---

## Trevad

```zymbol
// Naná: 0..4 — 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Norn ar trevad
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Luivë
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Ilach (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Ilach rhaw
yúlë = ["galadh", "loth", "nen"]
@ f:yúlë { >> f ¶ }

// Tengwi peth
@ c:"ithil" { >> c "-" }
>> ¶    // → i-t-h-i-l-

// Câr a Trevad
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> trevad
    ? i > 7 { @! }          // @! câr
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Maded

```zymbol
// Tanc ar maded
anno(a, b) { <~ a + b }
>> anno(3, 4) ¶    // → 7

// Trevad-dîn
nornmaded(n) {
    ? n <= 1 { <~ 1 }
    <~ n * nornmaded(n - 1)
}
>> nornmaded(5) ¶    // → 120

// Maded — ú-tirë andë norn
_ilach = 100
provo() {
    x = 42    // só
    <~ x
}
>> provo() ¶    // → 42
```

> **Naur**: Eneth maded `eneth(params){ }` — lá min norn.
> Hríva — yomë: `x -> eneth(x)`.

---

## Lambda a Nurta

```zymbol
// Hin lambda (tancalë)
tattanc = x -> x * 2
anno2 = (a, b) -> a + b
>> tattanc(5) ¶    // → 10
>> anno2(3, 7) ¶    // → 10

// Lambda rhaw (naná tancalë)
gerio2 = x -> {
    ? x > 0 { <~ "maer" }
    _? x < 0 { <~ "dôl" }
    <~ "ú" }
>> gerio2(5) ¶     // → maer
>> gerio2(0) ¶     // → ú
>> gerio2(-5) ¶    // → dôl

// Nurta — lambda boe andë norn
tancal = 3
neldë = x -> x * tancal    // boe 'tancal'
>> neldë(7) ¶    // → 21

// Maded tanc
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda norn: rhawassen
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Rhaw

```zymbol
arr = [10, 20, 30, 40, 50]

// Tirë (0 norn)
>> arr[0] ¶    // → 10

// Rimba (poQlu' >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Anno, telë, boe, hin
arr = arr$+ 60               // anno
arr = arr$- 0                // telë 0
boe2 = arr$? 30              // → #1
hin = arr$[0..2]             // [20, 30]

// Gaur norn
arr[1] = 99

// Ilach norn
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **naur rhaw** — boe: `arr = arr$+ 4`.
> Ú-tanc: tattanc boe.

---

## Tuple

```zymbol
// Eneth tuple
Ellon = (eneth: "Alice", vin: 25)
>> Ellon.eneth ¶    // → Alice
>> Ellon.vin ¶      // → 25
>> Ellon[0] ¶       // → Alice (norn ná)
```

---

## Maded Alta

HOF — **só lambda** — lá lambda norn.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
tattanc2 = nums$> (x -> x * 2)
>> tattanc2 ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pair = nums$| (x -> x % 2 == 0)
>> pair ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (tancalë norn, (anno, norn) -> moj)
ilach2 = nums$< (0, (acc, x) -> acc + x)
>> ilach2 ¶    // → 55
```

---

## Naeg Nurta

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ú norn" ¶
} :! ##IO {
    >> "IO naeg" ¶
} :! {
    >> "naeg: " _err ¶
} :> {
    >> "ilach lúm" ¶
}
```

| Goth        | Lúm                            |
|-------------|--------------------------------|
| `##Div`     | Ú norn                         |
| `##IO`      | Sarch / aran                   |
| `##Index`   | Norn andë                      |
| `##Type`    | Goth naeg                      |
| `##Parse`   | Tanc naeg                      |
| `##Network` | Tengwë naeg                    |
| `##_`       | Ilach naeg                     |

---

## Tanwesta

```zymbol
// Sarch: lib/calc.zy
# calc

#> { anno, get_PI }    // Nob MIN

_PI := 3.14159
anno(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Sarch: main.zy
<# ./lib/calc <= c    // Eneth poQlu'

>> c::anno(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Naná Sarch: FizzBuzz

```zymbol
gerio(norn) {
    ? norn % 15 == 0 { <~ "GaladDûn" }
    _? norn % 3  == 0 { <~ "Galad" }
    _? norn % 5  == 0 { <~ "Dûn" }
    _ { <~ norn }
}

@ i:1..20 { >> gerio(i) ¶ }
```

---

## Peth Tirë

| Peth     | Moj                | Peth       | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | boe                | `$#`       | rimba                 |
| `:=`     | dîn                | `$+`       | anno                  |
| `>>`     | pedo               | `$-`       | telë (norn)           |
| `<<`     | lasto              | `$?`       | boe                   |
| `¶`/`\`  | lúm autë           | `$[s..e]`  | hin                   |
| `?`      | ce (if)            | `$>`       | map                   |
| `_?`     | ar-ce (elif)       | `$\|`      | filter                |
| `_`      | ú-ce / ilach       | `$<`       | reduce                |
| `??`     | match              | `!?`       | provo (try)           |
| `@`      | trevad             | `:!`       | nurta (catch)         |
| `@!`     | câr (break)        | `:>`       | ilach (finally)       |
| `@>`     | trevad daur        | `$!`       | naeg ná               |
| `->`     | Lambda             | `$!!`      | naeg nob              |
| `<~`     | anno               | `#`        | tanwesta eneth        |
| `\|>`    | Pipe               | `#>`       | nob                   |
| `#1`     | eithel             | `<#`       | lasto                 |
| `#0`     | ú                  | `::`       | tanwesta maded        |

---

*Zymbol-Lang — Peth. Ilach. Ú-gaur.*

---

> **Notë:** Sarch hen carna ar quenta AI (tancalë maded).
> Ilach carna ná, mal neldë peth ar sarch naeg erin.
> Tancalëa sarch [Zymbol-Lang tengwesta](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
