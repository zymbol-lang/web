# Zymbol-Lang Kimün Amukey

**Zymbol-Lang** kiñe kimün zungu. Ngäy tañi kimün zugun — fentren wixal. Feley kiñechi feyta mapuzugun mew.

---

## Kimün Rakizuam

- Ngäy tañi kimün zugun (`if`, `while`, `return` ngächi — wixal ñi `?`, `@`, `<~`)
- Unicode fentren — sutikuna mapuzugun mew icha emoji 👋
- Zugun ngächi — código kiñechi zugun mew

---

## Wixal Dungukelu ha Kümeke Amulelu

```zymbol
x = 10           // wixal (püleley)
PI := 3.14159    // kümeke (ngäy pülel — wingka reke)
iñche = "Ana"
nüküley = #1     // küme
👋 := "Mari mari"
```

### Wixal Fentren Amulkey

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

## Wixal Ñi Kimün

| Kimün          | Techapyrã             | Símbolo `#?` | Dungukelu                            |
|----------------|-----------------------|--------------|--------------------------------------|
| Xokiñ          | `42`, `-7`            | `###`        | 64-bit                               |
| Chiru xokiñ    | `3.14`, `1.5e10`      | `##.`        | Científico feley                     |
| Zugun          | `"mari mari"`         | `##"`        | Mbohapymi: `"Mari mari {iñche}"`     |
| Kiñe zugun     | `'A'`                 | `##'`        | Kiñe Unicode letra                   |
| Küme/Wingka    | `#1`, `#0`            | `##?`        | NGÄY xokiñ 1 icha 0                  |
| Küpalwe        | `[1, 2, 3]`           | `##]`        | Fentren kimün mew                    |
| Tupla          | `(a, b)`              | `##)`        | Wixal                                |
| Sutiyuq tupla  | `(x: 1, y: 2)`        | `##)`        | Suti icha xokiñ mew taripan          |

---

## Dungukelu ha Küpalekey

```zymbol
// Dungukelu — NGÄY küme mew
>> "Mari mari" ¶                    // ¶ icha \\ küme mew
>> "a=" a " b=" b ¶                 // fentren wixal huñisqa
>> "xokiñ=" kimeltun(2, 3) ¶        // función feley mew
>> (arr$#) ¶                        // postfix paréntesis itrofilu

// Küpalekey
<< iñche                            // ngäy prompt — küpalen wixal
<< "¿Iney tami suti? " iñche        // prompt yéetel
```

> `¶` icha `\\` küme mew dungukelu.

---

## Zugun Huñiy

Küla kimün — kiñechi mew:

```zymbol
iñche = "Ana"
n = 25

// 1. Koma — wixal = icha :=
zugun = "Mari mari ", iñche, "!"          // → Mari mari Ana!
SUTI := "Ñi pu: ", iñche

// 2. Fentren — >>
>> "Mari mari " iñche " ñi xokiñ " n ¶   // → Mari mari Ana ñi xokiñ 25

// 3. Ukupi — imaymana mew
rimay = "Mari mari {iñche}, ñi xokiñ {n}" // → Mari mari Ana, ñi xokiñ 25
```

> **Kimün**: `+` xokiñ ñi. Zugun mew wingka kimün.

---

## Rakizuam Ñi Amulew

```zymbol
x = 7

// Küme añoite
? x > 0 { >> "nochilechi" ¶ }

// Küme / icha küme / wingka
? x > 100 {
    >> "fütake" ¶
} _? x > 0 {
    >> "nochilechi" ¶
} _? x == 0 {
    >> "ngächi" ¶
} _ {
    >> "minche" ¶
}
```

Bloque `{ }` **itrofilu** kiñe línea ñi feley.

---

## Match

```zymbol
// Match xokiñ küla
xokiñ = 85
grado = ?? xokiñ {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Match waqaychay (fentren kimün)
külliñ = -5
kaqnin = ?? külliñ {
    _? külliñ < 0  : "anüf"
    _? külliñ < 20 : "küf"
    _? külliñ < 35 : "küme kalül"
    _              : "kalül"
}
>> kaqnin ¶    // → anüf

// Match zugun
kuluri = "kelü"
código = ?? kuluri {
    "kelü"  : "#FF0000"
    "karü"  : "#00FF00"
    _       : "#000000"
}
>> código ¶
```

---

## Muyuy

```zymbol
// Xokiñ küla: 0..4 amun 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Xokiñ xokiñ mew
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Xokiñ uray
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Welu (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Fentren ba'al
küpalwe = ["manzana", "pera", "uva"]
@ f:küpalwe { >> f ¶ }

// Zugun letra
@ c:"mapu" { >> c "-" }
>> ¶    // → m-a-p-u-

// @! ha @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> amun
    ? i > 7 { @! }          // @! fütra
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Kimeltun

```zymbol
// Dungukelu ha wixal
kimeltun(a, b) { <~ a + b }
>> kimeltun(3, 4) ¶    // → 7

// Küpalwe
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Kimeltun ngäy wixal mew
global = 100
amulkey() {
    x = 42    // wayye' cha'an
    <~ x
}
>> amulkey() ¶    // → 42
```

> **Fütake kimün**: Kimeltun `iñche(params){ }` ngäy wixal.
> Argumento mew: `x -> iñche(x)`.

---

## Lambda ha Closure

```zymbol
// Lambda (ngäy dungukelu)
epuñiy = x -> x * 2
yapuy = (a, b) -> a + b
>> epuñiy(5) ¶    // → 10
>> yapuy(3, 7) ¶  // → 10

// Lambda bloque (dungukelu)
kimeltun2 = x -> {
    ? x > 0 { <~ "nochilechi" }
    _? x < 0 { <~ "minche" }
    <~ "ngächi"
}
>> kimeltun2(5) ¶     // → nochilechi
>> kimeltun2(0) ¶     // → ngächi
>> kimeltun2(-5) ¶    // → minche

// Closure — lambda küpalwe wixal
factor = 3
küla = x -> x * factor    // 'factor' küpalwe
>> küla(7) ¶    // → 21

// Kimeltun dungukelu kimeltun
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda wixal: küpalwe mew
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Küpalwe

```zymbol
arr = [10, 20, 30, 40, 50]

// Amulew (0-base)
>> arr[0] ¶    // → 10

// Xokiñ (paréntesis itrofilu >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Ts'aak, quichihua, wáalik, chuuyil
arr = arr$+ 60               // ts'aak
arr = arr$- 0                // quichihua índice 0
yaan = arr$? 30              // → #1
chuuyil = arr$[0..2]         // [20, 30]

// Wixal patla
arr[1] = 99

// Fentren ba'al
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **küpalwe yáanal** — ts'aak: `arr = arr$+ 4`.
> Ngäy huñi — epu tz'iibil.

---

## Tupla

```zymbol
// Tupla suti mew
che = (suti: "Alice", xipan: 25)
>> che.suti ¶    // → Alice
>> che.xipan ¶   // → 25
>> che[0] ¶      // → Alice (xokiñ feley)
```

---

## Fütake Kimeltun

HOF señal itrofilu **lambda inline** — ngäy variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
epuñiysqa = nums$> (x -> x * 2)
>> epuñiysqa ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
epuñiy kuti = nums$| (x -> x % 2 == 0)
>> epuñiy kuti ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (ñi wixal, (acc, elem) -> expr)
fentren = nums$< (0, (acc, x) -> acc + x)
>> fentren ¶    // → 55
```

---

## Wingka Kimün Ñi Ngelay

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "xokiñ fütake wingka" ¶
} :! ##IO {
    >> "IO wingka" ¶
} :! {
    >> "hool wingka: " _err ¶
} :> {
    >> "fentren amun" ¶
}
```

| Kimün       | Feley mew                   |
|-------------|----------------------------|
| `##Div`     | Xokiñ fütake wingka         |
| `##IO`      | Tzikbal / sistema           |
| `##Index`   | Xokiñ ngäy                  |
| `##Type`    | Kimün wingka                |
| `##Parse`   | Parsing                     |
| `##Network` | Red wingka                  |
| `##_`       | Fentren wingka              |

---

## Módulo

```zymbol
// Dungukelu: lib/calc.zy
# calc

#> { kimeltun, get_PI }    // ÑAWPAQ definiciones

_PI := 3.14159
kimeltun(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Dungukelu: main.zy
<# ./lib/calc <= c    // alias itrofilu

>> c::kimeltun(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

---

## Fentren Techapyrã: FizzBuzz

```zymbol
kimeltun(rakizuam) {
    ? rakizuam % 15 == 0 { <~ "KollongKüzaw" }
    _? rakizuam % 3  == 0 { <~ "Kollong" }
    _? rakizuam % 5  == 0 { <~ "Küzaw" }
    _ { <~ rakizuam }
}

@ i:1..20 { >> kimeltun(i) ¶ }
```

---

## Wixal Kimün

| Wixal   | Amulew            | Wixal      | Amulew             |
|---------|-------------------|------------|--------------------|
| `=`     | wixal             | `$#`       | xokiñ              |
| `:=`    | ngäy pülel        | `$+`       | ts'aak             |
| `>>`    | dungukelu         | `$-`       | quichihua          |
| `<<`    | küpalekey         | `$?`       | yaan               |
| `¶`/`\` | küme mew          | `$[s..e]`  | chuuyil            |
| `?`     | küme              | `$>`       | map                |
| `_?`    | icha              | `$\|`      | filter             |
| `_`     | wingka / fentren  | `$<`       | reduce             |
| `??`    | match             | `!?`       | itrofilu           |
| `@`     | muyuy             | `:!`       | k'aak'al           |
| `@!`    | fütra             | `:>`       | fentren            |
| `@>`    | amun              | `$!`       | wingka             |
| `->`    | lambda            | `$!!`      | wingka cachay      |
| `<~`    | küme mew          | `#`        | módulo             |
| `\|>`   | pipe              | `#>`       | dungukelu          |
| `#1`    | küme              | `<#`       | küpalekey          |
| `#0`    | wingka            | `::`       | módulo kimeltun    |

---

*Zymbol-Lang — Wixal. Fentren. Ngäy Pülel.*

---

> **Dungukelu:** Kay kimün amukey rurasqa ka t'ikrasqa inteligencia artificial (IA) mew.
> Llapan llamk'ay rurasqa küme kaptin, wakin zugun icha techapyrã pantay kapun.
> Küme referencia: [Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
