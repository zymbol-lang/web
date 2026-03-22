# Zymbol-Lang Lì'fya leNa'vi

**Zymbol-Lang** lu lì'fya a tsaheyl si. Ke lu tstxo a syaw — fìlì'fya lu Na'vi. Lu fpom fì'u, talun lu Na'vi lì'fya a fkeytok.

---

## Tìkangkem

- Ke lu tstxo (`if`, `while`, `return` ke fkeytok — tì'efumì `?`, `@`, `<~`)
- Unicode sìltseo — tìran teri lì'fya a lefpom, emoji 👋
- Ke tsun fkol nìNa'vi — lì'fya lu fpom fì'u

---

## Tìng ulte Tìng Ne'

```zymbol
x = 10           // tìng (tsun munge)
PI := 3.14159    // tìng ne' (ke tsun munge — tìkin ce tìng)
tìfya = "Ana"
vorn = #1        // srane kem
👋 := "Oel ngati kameie"
```

### Tìng Sìfpxi

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

## Tì'efumì Cìpx

| Tì'efumì     | Sìltseo           | Tì'ef `#?` | Tìkangkem                          |
|--------------|-------------------|------------|-------------------------------------|
| Numtseng     | `42`, `-7`        | `###`      | 64-bit sute                         |
| Numtseng Hin | `3.14`, `1.5e10`  | `##.`      | Sìltseo naur OK                     |
| Tìran        | `"oel ngati"`     | `##"`      | Lì'u: `"Sä'o {tìfya}"`             |
| Pxel         | `'A'`             | `##'`      | Mì Unicode pxel                     |
| Srane/Ke    | `#1`, `#0`        | `##?`      | Ke numtseng mì                      |
| Tskxe        | `[1, 2, 3]`       | `##]`      | Tì'efumì sìpawm nan                 |
| Tuple        | `(a, b)`          | `##)`      | Tìng                                |
| Tìfya Tuple  | `(x: 1, y: 2)`    | `##)`      | Tìfya sìpawm numtseng               |

---

## Pawm ulte Tìpawm

```zymbol
// Pawm — ke tsun tìpawm sìltseo
>> "Oel ngati kameie" ¶            // ¶ ulte \\ tsun tìpawm sìltseo
>> "a=" a " b=" b ¶                // sìpawm numtseng — tìng
>> "numtseng=" tìkan(2, 3) ¶       // tìkangkem sìpawm tìng
>> (arr$#) ¶                       // tì'ef tìpawm numtseng poQlu'

// Tìpawm
<< tìfya                           // ke sìltseo — tìpawm tìng
<< "Fyape syaw fko ngar? " tìfya   // ulte sìltseo
```

> `¶` ulte `\\` — nan sìltseo sìltseo.

---

## Tìran Boq

Mì tì'efumì — sìpawm tìng:

```zymbol
tìfya = "Ana"
n = 25

// 1. Comma — tìng = ulte :=
sì'efum = "Oel ngati kameie ", tìfya, "!"   // → Oel ngati kameie Ana!
EYWA := "Tìkan: ", tìfya

// 2. Tìng — pawm >>
>> "Sä'o " tìfya " lu numtseng " n ¶         // → Sä'o Ana lu numtseng 25

// 3. Lì'u — sìpawm tìng
tìkangkem = "Sä'o {tìfya}, lu numtseng {n}"  // → Sä'o Ana, lu numtseng 25
```

> **Tìkangkem**: `+` numtseng tìran. Tìrantseo — tìkin.

---

## Txo Ke

```zymbol
x = 7

// Hin txo
? x > 0 { >> "srane" ¶ }

// Txo / txo-ke / ke
? x > 100 {
    >> "txantslusam" ¶
} _? x > 0 {
    >> "srane" ¶
} _? x == 0 {
    >> "ke" ¶
} _ {
    >> "txoa" ¶
}
```

`{ }` — **poQlu'**, hin sìltseo.

---

## Match

```zymbol
// Match numtseng
numtseng2 = 85
patlh = ?? numtseng2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match sìpawm (sìpawm txo)
wutso = -5
tìsraw = ?? wutso {
    _? wutso < 0  : "rum"
    _? wutso < 20 : "txon"
    _? wutso < 35 : "lawr"
    _             : "kxu"
}
>> tìsraw ¶    // → rum

// Match tìran
tìyawn = "tawsìp"
kode = ?? tìyawn {
    "tawsìp"   : "#FF0000"
    "rìk"      : "#00FF00"
    _          : "#000000"
}
>> kode ¶
```

---

## Fpxäkìm

```zymbol
// Naná: 0..4 — 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Numtseng ulte fpxäkìm
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Fpxäkìm ke
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Txo txo (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Sìpawm tskxe
tskxeyä = ["ioang", "tìsraw", "syulang"]
@ f:tskxeyä { >> f ¶ }

// Pxel tìran
@ c:"eywa" { >> c "-" }
>> ¶    // → e-y-w-a-

// Tìhawnu ulte Fpxäkìm
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> fpxäkìm
    ? i > 7 { @! }          // @! tìhawnu
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Tìkan

```zymbol
// Tìng ulte tìkan
tìkangkem(a, b) { <~ a + b }
>> tìkangkem(3, 4) ¶    // → 7

// Tìran
numtseng_tìkan(n) {
    ? n <= 1 { <~ 1 }
    <~ n * numtseng_tìkan(n - 1)
}
>> numtseng_tìkan(5) ¶    // → 120

// Tìkan — ke pawm andë numtseng
_eywa = 100
tìtxur() {
    x = 42    // mì kem
    <~ x
}
>> tìtxur() ¶    // → 42
```

> **Tìkangkem**: Tìfya tìkan `tìfya(params){ }` — ke mì numtseng.
> Lì'u tìng — tìran: `x -> tìfya(x)`.

---

## Lambda ulte Karyai

```zymbol
// Hin lambda (tìran)
tatìng = x -> x * 2
tìkangkem2 = (a, b) -> a + b
>> tatìng(5) ¶       // → 10
>> tìkangkem2(3, 7) ¶ // → 10

// Lambda tskxe (naná tìran)
tìfya2 = x -> {
    ? x > 0 { <~ "srane" }
    _? x < 0 { <~ "txoa" }
    <~ "ke" }
>> tìfya2(5) ¶     // → srane
>> tìfya2(0) ¶     // → ke
>> tìfya2(-5) ¶    // → txoa

// Karyai — lambda tìng andë numtseng
tìkan_sì = 3
tìtxur2 = x -> x * tìkan_sì    // tìng 'tìkan_sì'
>> tìtxur2(7) ¶    // → 21

// Tìkangkem tìran
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda numtseng: tskxeyä
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Tskxe

```zymbol
arr = [10, 20, 30, 40, 50]

// Tìpawm (0 numtseng)
>> arr[0] ¶    // → 10

// Sìpawm (poQlu' >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Tìkangkem, tìhawnu, tìng, hin
arr = arr$+ 60               // tìkangkem
arr = arr$- 0                // tìhawnu 0
tìng2 = arr$? 30             // → #1
hin2 = arr$[0..2]            // [20, 30]

// Tìng numtseng
arr[1] = 99

// Sìpawm numtseng
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **naur tskxe** — tìng: `arr = arr$+ 4`.
> Ke tsaheyl: tatìng tìng.

---

## Tuple

```zymbol
// Tìfya tuple
sute = (tìfya: "Alice", numtseng: 25)
>> sute.tìfya ¶      // → Alice
>> sute.numtseng ¶   // → 25
>> sute[0] ¶         // → Alice (numtseng lo'laH)
```

---

## Tìkan Txantslusam

HOF — **hin lambda** — ke lambda numtseng.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
tatìng2 = nums$> (x -> x * 2)
>> tatìng2 ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
tìkangkem3 = nums$| (x -> x % 2 == 0)
>> tìkangkem3 ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (tìran numtseng, (tìkangkem, numtseng) -> moj)
tìpawm = nums$< (0, (acc, x) -> acc + x)
>> tìpawm ¶    // → 55
```

---

## Tìhawnu Txo

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ke numtseng" ¶
} :! ##IO {
    >> "IO tìhawnu" ¶
} :! {
    >> "tìhawnu: " _err ¶
} :> {
    >> "sìpawm lúm" ¶
}
```

| Tì'efumì    | Txo                            |
|-------------|--------------------------------|
| `##Div`     | Ke numtseng                    |
| `##IO`      | Tìran / vay                    |
| `##Index`   | Numtseng andë                  |
| `##Type`    | Tì'efumì tìhawnu               |
| `##Parse`   | Tìng tìhawnu                   |
| `##Network` | Tengwë tìhawnu                 |
| `##_`       | Sìpawm tìhawnu                 |

---

## Tìkangkem Na'vi

```zymbol
// Sìltseo: lib/calc.zy
# calc

#> { tìkangkem, get_PI }    // Nob MÌ

_PI := 3.14159
tìkangkem(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Sìltseo: main.zy
<# ./lib/calc <= c    // Tìfya poQlu'

>> c::tìkangkem(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

---

## Sìpawm Tìkangkem: FizzBuzz

```zymbol
tìkan(tìfya) {
    ? tìfya % 15 == 0 { <~ "EywaToruk" }
    _? tìfya % 3  == 0 { <~ "Eywa" }
    _? tìfya % 5  == 0 { <~ "Toruk" }
    _ { <~ tìfya }
}

@ i:1..20 { >> tìkan(i) ¶ }
```

---

## Tì'ef Tirë

| Tì'ef    | Moj                | Tì'ef      | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | tìng               | `$#`       | sìpawm                |
| `:=`     | tìng ne'           | `$+`       | tìkangkem             |
| `>>`     | pawm               | `$-`       | tìhawnu (numtseng)    |
| `<<`     | tìpawm             | `$?`       | tìng                  |
| `¶`/`\`  | sìltseo sìltseo    | `$[s..e]`  | hin                   |
| `?`      | txo (if)           | `$>`       | map                   |
| `_?`     | txo-ke (elif)      | `$\|`      | filter                |
| `_`      | ke / sìpawm        | `$<`       | reduce                |
| `??`     | match              | `!?`       | tìtxur (try)          |
| `@`      | fpxäkìm            | `:!`       | karyai (catch)        |
| `@!`     | tìhawnu (break)    | `:>`       | sìpawm (finally)      |
| `@>`     | fpxäkìm daur       | `$!`       | tìhawnu tìng          |
| `->`     | Lambda             | `$!!`      | tìhawnu pawm          |
| `<~`     | tìkangkem          | `#`        | tìkangkem tìfya       |
| `\|>`    | Pipe               | `#>`       | nob                   |
| `#1`     | srane              | `<#`       | tìpawm                |
| `#0`     | ke                 | `::`       | tìkangkem tìkan       |

---

*Zymbol-Lang — Lì'fya. Sìpawm. Ke tìng.*

---

> **Tìkangkem:** Fì'u carna ulte quenta AI (tìran tìkan).
> Sìpawm carna ná, mal nì'ul tìfya ulte sìltseo tìhawnu.
> Tìkangkem lì'fya [Zymbol-Lang tìkangkem](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
