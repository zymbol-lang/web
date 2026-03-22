# tlhIngan Hol Zymbol-Lang paq

**Zymbol-Lang** 'oH porghQeD Hol'e' Dalo'bogh. mu'mey lo'be' — Hoch 'oH ta''e'. Hoch Hol lo'laH.

---

## patlh

- mu'mey lo'be' (`if`, `while`, `return` tu'be'lu' — ta' neH `?`, `@`, `<~`)
- Unicode Hoch — Hoch Hol pong Dalo'laH, qoj emoji 👋
- Hol-qar — Hoch Hol, wa' mu'tlhegh law'

---

## ghaj je mab

```zymbol
x = 10           // ghaj (choHlaH)
PI := 3.14159    // mab (choHlaHbe' — Qagh choHchugh)
pong = "Ana"
Dun = #1         // 'Iv teH
👋 := "nuqneH"
```

### boqHa' ghaj

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

## Segh Data

| Segh         | mu'tlhegh         | ta' `#?` | QInmey                             |
|--------------|-------------------|----------|------------------------------------|
| mI' naQ      | `42`, `-7`        | `###`    | 64-bit署名付き                      |
| mI' tIn      | `3.14`, `1.5e10`  | `##.`    | pagh Segh OK                       |
| mu'mey       | `"nuqneH"`        | `##"`    | Hap: `"nuqneH {pong}"`             |
| mu'           | `'A'`             | `##'`    | wa' Unicode mu'                    |
| teH/ngeb     | `#1`, `#0`        | `##?`    | mI' wa' pagh je DAHO'be'           |
| ghom         | `[1, 2, 3]`       | `##]`    | Hoch Segh rap                      |
| tuple        | `(a, b)`          | `##)`    | mI' Dara'                          |
| pong tuple   | `(x: 1, y: 2)`    | `##)`    | pong qoj mI' Dalo'laH              |

---

## jatlh je Qoy

```zymbol
// jatlh — chu' ghoS DAHO'be'
>> "nuqneH" ¶                   // ¶ qoj \\ chu' ghoS nob
>> "a=" a " b=" b ¶             // law' De' — Dara'
>> "mI'=" buv(2, 3) ¶           // Qu' vItu' Hoch Dara'
>> (arr$#) ¶                    // bIng ta' mI'mey poQlu'

// Qoy
<< pong                         // mu' Hutlh — nob yIgho'
<< "nuq 'oH ponglIj'e'? " pong  // mu' ghaj
```

> `¶` qoj `\\` — wa' rur chu' ghoS.

---

## mu' boq

wej moj — Hoch Dalo':

```zymbol
pong = "Ana"
n = 25

// 1. comma — ghaj = qoj :=
QIn = "nuqneH ", pong, "!"             // → nuqneH Ana!
pong2 := "SuvwI': ", pong

// 2. Dara' — jatlh >>
>> "nuqneH " pong " bIHoS " n ¶        // → nuqneH Ana bIHoS 25

// 3. Hap — Hoch Dara'
Qorwagh = "nuqneH {pong}, bIHoS {n}"  // → nuqneH Ana, bIHoS 25
```

> **QIn**: `+` mI' neH. mu'mey — lut.

---

## ghobe' pagh HIja'

```zymbol
x = 7

// mach HIja'
? x > 0 { >> "HoS" ¶ }

// HIja' / ghobe'taH / ghobe'
? x > 100 {
    >> "tIn law'" ¶
} _? x > 0 {
    >> "HoS" ¶
} _? x == 0 {
    >> "pagh" ¶
} _ {
    >> "Dor" ¶
}
```

Hoch `{ }` **poQlu'**, wa' mu'tlhegh je.

---

## Match

```zymbol
// Match mI' Dara'
mI'2 = 85
patlh2 = ?? mI'2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh2 ¶    // → B

// Match nuH (Hoch mojaq)
SuD = -5
Dotlh = ?? SuD {
    _? SuD < 0  : "chuch"
    _? SuD < 20 : "bIr"
    _? SuD < 35 : "tlhegh"
    _            : "tuj"
}
>> Dotlh ¶    // → chuch

// Match mu'mey
rItlh = "Doq"
HaSta = ?? rItlh {
    "Doq"  : "#FF0000"
    "SuD"  : "#00FF00"
    _      : "#000000"
}
>> HaSta ¶
```

---

## ngeb

```zymbol
// naQ: 0..4 — 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Dochvam pa'
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// bIng
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// qaStaHvIS (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Hoch De' je
naH = ["tI", "moQ", "'USqa'"]
@ f:naH { >> f ¶ }

// mu' mu'
@ c:"Qapla'" { >> c "-" }
>> ¶    // → Q-a-p-l-a-'-

// pItlh je HaD
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> HaD
    ? i > 7 { @! }          // @! pItlh
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Qu'

```zymbol
// chergh je lo'
boq(a, b) { <~ a + b }
>> boq(3, 4) ¶    // → 7

// tagh
mI'ghaH(n) {
    ? n <= 1 { <~ 1 }
    <~ n * mI'ghaH(n - 1)
}
>> mI'ghaH(5) ¶    // → 120

// Qu' Hutlh — Dech De' tu'be'lu'
_naQ = 100
yIQorgh() {
    x = 42    // pa' neH
    <~ x
}
>> yIQorgh() ¶    // → 42
```

> **Qov**: pong Qu' `pong(params){ }` — wa' De' 'oHbe'.
> nob vIneH — yIjom: `x -> pong(x)`.

---

## Lambda je qorDu'

```zymbol
// mach lambda (tagh)
cha' = x -> x * 2
boq2 = (a, b) -> a + b
>> cha'(5) ¶    // → 10
>> boq2(3, 7) ¶  // → 10

// lambda Dara' (naQ tagh)
buv = x -> {
    ? x > 0 { <~ "HoS" }
    _? x < 0 { <~ "Dor" }
    <~ "pagh"
}
>> buv(5) ¶     // → HoS
>> buv(0) ¶     // → pagh
>> buv(-5) ¶    // → Dor

// qorDu' — lambda DaHar De'
Dop = 3
wej = x -> x * Dop    // DaHar 'Dop'
>> wej(7) ¶    // → 21

// Qu' moj
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// lambda De': ghom
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## ghom

```zymbol
arr = [10, 20, 30, 40, 50]

// tu' (0 tagh)
>> arr[0] ¶    // → 10

// mI' (mI'mey poQlu' >>)
n = arr$#
>> (arr$#) ¶    // → 5

// boq, teqlu', ghaj, mach
arr = arr$+ 60               // boq
arr = arr$- 0                // teq 0
ghaj = arr$? 30              // → #1
mach = arr$[0..2]            // [20, 30]

// choH De'
arr[1] = 99

// Hoch De'
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **chu' ghom** — ghaH: `arr = arr$+ 4`.
> boqHa'be': cha' ghaj Dalo'.

---

## Tuple

```zymbol
// pong tuple
SuvwI' = (pong: "Alice", DIS: 25)
>> SuvwI'.pong ¶    // → Alice
>> SuvwI'.DIS ¶     // → 25
>> SuvwI'[0] ¶      // → Alice (mI' lo'laH je)
```

---

## Qu' ghaj

HOF — **pa' lambda** poQlu' — lambda De' Hutlh.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
cha'2 = nums$> (x -> x * 2)
>> cha'2 ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
mI'rap = nums$| (x -> x % 2 == 0)
>> mI'rap ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (tagh mI', (boq, De') -> moj)
Hoch2 = nums$< (0, (acc, x) -> acc + x)
>> Hoch2 ¶    // → 55
```

---

## Qagh DIj

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pagh HoS Dor" ¶
} :! ##IO {
    >> "IO Qagh" ¶
} :! {
    >> "Qagh: " _err ¶
} :> {
    >> "reH qaStaH" ¶
}
```

| Segh        | qaStaHvIS                      |
|-------------|--------------------------------|
| `##Div`     | pagh HoS Dor                   |
| `##IO`      | De' / HoD                      |
| `##Index`   | mI' Dor                        |
| `##Type`    | Segh Qagh                      |
| `##Parse`   | moj Qagh                       |
| `##Network` | Hol Qagh                       |
| `##_`       | Hoch Qagh                      |

---

## HoD

```zymbol
// De': lib/calc.zy
# calc

#> { boq, get_PI }    // nob QACH

_PI := 3.14159
boq(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// De': main.zy
<# ./lib/calc <= c    // pong poQlu'

>> c::boq(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

---

## wa' Example: FizzBuzz

```zymbol
buv(mI') {
    ? mI' % 15 == 0 { <~ "QaplaHoH" }
    _? mI' % 3  == 0 { <~ "Qapla" }
    _? mI' % 5  == 0 { <~ "HoH" }
    _ { <~ mI' }
}

@ i:1..20 { >> buv(i) ¶ }
```

---

## mu' ghom

| ta'     | moj               | ta'        | moj                   |
|---------|-------------------|------------|-----------------------|
| `=`     | ghaj              | `$#`       | mI'                   |
| `:=`    | mab               | `$+`       | boq                   |
| `>>`    | jatlh             | `$-`       | teq (mI')             |
| `<<`    | Qoy               | `$?`       | ghaj                  |
| `¶`/`\` | chu' ghoS         | `$[s..e]`  | mach                  |
| `?`     | HIja'             | `$>`       | map                   |
| `_?`    | ghobe'taH         | `$\|`      | filter                |
| `_`     | ghobe' / Hoch     | `$<`       | reduce                |
| `??`    | match             | `!?`       | tIv (try)             |
| `@`     | tagh              | `:!`       | Hap (catch)           |
| `@!`    | pItlh (break)     | `:>`       | reH (finally)         |
| `@>`    | HaD (continue)    | `$!`       | Qagh 'oH              |
| `->`    | Lambda            | `$!!`      | Qagh nob              |
| `<~`    | nob               | `#`        | HoD chergh            |
| `\|>`   | Pipe              | `#>`       | nob                   |
| `#1`    | teH               | `<#`       | Hap                   |
| `#0`    | ngeb              | `::`       | HoD lo'               |

---

*Zymbol-Lang — ta'. Hoch. choHlaHbe'.*

---

> **QIn:** De'vam 'oH porghQeD vay' (AI) chenmoHta' je mughta'.
> Hoch DIv ta'lu', 'ach 'op mu' qoj mu'tlhegh Qagh tu'laH.
> chaq De' [Zymbol-Lang specifiko](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
