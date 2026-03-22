# Zymbol-Lang U Tzíibil Nojoch Kaaj

**Zymbol-Lang** jun tzíibil t'aan. Ma' k'aaba'ob u tia'al — bey síimbolo'. Le xan jach kex bix t'aan.

---

## U Yóol

- Ma' k'aaba'ob (`if`, `while`, `return` ma' yaan — cha'an síimbolo' `?`, `@`, `<~`)
- Unicode tuláakal — k'aaba'ob ti' tuláakal t'aan wáa emoji 👋
- Ma' k'abeet t'aan — código beyo' ti' tuláakal t'aan

---

## K'aaba' yéetel Ma' Tikrakuq

```zymbol
x = 10           // k'aaba' (páajtal u cháajil)
PI := 3.14159    // ma' cháajil (ma' páajtal u cháajil — ya'ab u páajtal)
k'aaba' = "Ana"
ku'ubul = #1     // jaaj
👋 := "Ba'ax ka wa'alik"
```

### K'aaba' Tzikbalil

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

## Ba'ax K'aaba'

| Chuuyil        | U jela'anil              | Símbolo `#?` | Tzikbal                              |
|----------------|--------------------------|--------------|--------------------------------------|
| Xook           | `42`, `-7`               | `###`        | 64-bit                               |
| Chiru xook     | `3.14`, `1.5e10`         | `##.`        | Científico xook páajtal              |
| T'aan          | `"ba'ax ka wa'alik"`     | `##"`        | Páajtal: `"Ba'ax ka wa'alik {k'aaba'}"`|
| Jun t'aan      | `'A'`                    | `##'`        | Jun Unicode t'aan                    |
| Jaaj/Ma'       | `#1`, `#0`               | `##?`        | MA' xook 1 wáa 0                     |
| Tzikbal        | `[1, 2, 3]`              | `##]`        | Tuláakal bey chuuyil                 |
| Tupla          | `(a, b)`                 | `##)`        | Chuuyil                              |
| Tupla k'aaba'  | `(x: 1, y: 2)`           | `##)`        | Bey k'aaba' wáa xook                 |

---

## Páajtal T'aanil yéetel Cháanbal

```zymbol
// Páajtal — MA' ts'o'ok u ts'áikal
>> "Ba'ax ka wa'alik" ¶             // ¶ wáa \\ u ts'o'ok línea
>> "a=" a " b=" b ¶                 // ya'ab ba'alche' ti' leti'
>> "xook=" tsibtik(2, 3) ¶          // función ti' ken
>> (arr$#) ¶                        // postfix paréntesis k'abeet

// Cháanbal
<< k'aaba'                          // ma' prompt — k'uchul ti' k'aaba'
<< "Ba'ax a k'aaba'? " k'aaba'      // prompt yéetel
```

> `¶` wáa `\\` bey kex ts'o'ok línea.

---

## T'aan Tz'aabal

Óox chuuyil — bix ken beey:

```zymbol
k'aaba' = "Ana"
n = 25

// 1. Koma — k'aaba' = wáa :=
t'aan = "Ba'ax ka wa'alik ", k'aaba', "!"    // → Ba'ax ka wa'alik Ana!
K'AABA' := "Máasewáal: ", k'aaba'

// 2. Ti' leti' — >>
>> "Ba'ax ka wa'alik " k'aaba' " a xook " n ¶  // → Ba'ax ka wa'alik Ana a xook 25

// 3. U úuchben — ken
tzikbal = "Ba'ax ka wa'alik {k'aaba'}, a xook {n}"  // → Ba'ax ka wa'alik Ana, a xook 25
```

> **Tzikbal**: `+` xook cha'an. T'aan yéetel u ya'ab ichil.

---

## U Beetik Noj

```zymbol
x = 7

// Jaaj cha'an
? x > 0 { >> "nojoch" ¶ }

// Jaaj / wáa / ma'
? x > 100 {
    >> "noj" ¶
} _? x > 0 {
    >> "nojoch" ¶
} _? x == 0 {
    >> "ma'" ¶
} _ {
    >> "chan" ¶
}
```

Bloque `{ }` **k'abeet** kex jun línea.

---

## Match

```zymbol
// Match xook chuuyil
xook = 85
grado = ?? xook {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Match wáa (tuláakal taamil)
k'áak' = -5
estado = ?? k'áak' {
    _? k'áak' < 0  : "sak"
    _? k'áak' < 20 : "síis"
    _? k'áak' < 35 : "le'ek"
    _              : "k'áak'"
}
>> estado ¶    // → sak

// Match t'aan
chak = "chak"
código = ?? chak {
    "chak" : "#FF0000"
    "ya'x" : "#00FF00"
    _      : "#000000"
}
>> código ¶
```

---

## Chuuyil

```zymbol
// Xook chuuyil: 0..4 u suut 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Xook xookol
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Xook noj
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Peve (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Tuláakal ba'al
ixi'im = ["nal", "box", "k'aan nal"]
@ f:ixi'im { >> f ¶ }

// T'aan t'aano'ob
@ c:"kaaj" { >> c "-" }
>> ¶    // → k-a-a-j-

// @! yéetel @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> xíimbal
    ? i > 7 { @! }          // @! ts'o'ok
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Tsibtik

```zymbol
// Tzikbal yéetel beetik
k'áatik(a, b) { <~ a + b }
>> k'áatik(3, 4) ¶    // → 7

// Suutuk
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Función ma' u yilaj hool k'aaba'
global = 100
beetik() {
    x = 42    // wayye' cha'an
    <~ x
}
>> beetik() ¶    // → 42
```

> **Noj tzikbal**: Función `k'aaba'(params){ }` ma' ba'al.
> Ti' argumento: `x -> k'aaba'(x)`.

---

## Lambda yéetel Closure

```zymbol
// Lambda (ma' tz'ibik)
ka'p'éel = x -> x * 2
k'áatik = (a, b) -> a + b
>> ka'p'éel(5) ¶    // → 10
>> k'áatik(3, 7) ¶  // → 10

// Lambda bloque (tz'ibik)
tsibtik = x -> {
    ? x > 0 { <~ "nojoch" }
    _? x < 0 { <~ "chan" }
    <~ "ma'"
}
>> tsibtik(5) ¶     // → nojoch
>> tsibtik(0) ¶     // → ma'
>> tsibtik(-5) ¶    // → chan

// Closure — lambda u tzikbal hool
factor = 3
óox = x -> x * factor    // 'factor' u kajtik
>> óox(7) ¶    // → 21

// Función u beeta función
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda ba'al: tzikbal ichil
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Tzikbal

```zymbol
arr = [10, 20, 30, 40, 50]

// U yilaj (0-base)
>> arr[0] ¶    // → 10

// Xook (paréntesis k'abeet >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Ts'aak, kíinsik, wáalik, chuuyil
arr = arr$+ 60               // ts'aak
arr = arr$- 0                // kíinsik índice 0
yaan = arr$? 30              // → #1
chuuyil = arr$[0..2]         // [20, 30]

// Ba'al tikrakuq
arr[1] = 99

// Tuláakal ba'al
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` u ts'o'okol **tzikbal yáanal** — ts'aak: `arr = arr$+ 4`.
> Ma' tz'aab — ka'p'éel tz'iibil.

---

## Tupla

```zymbol
// Tupla k'aaba'
winik = (k'aaba': "Alice", ja'ab: 25)
>> winik.k'aaba' ¶    // → Alice
>> winik.ja'ab ¶      // → 25
>> winik[0] ¶         // → Alice (xook xan páajtal)
```

---

## Noj Función

HOF señal k'abeet **lambda inline** — ma' variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
ka'p'eelil = nums$> (x -> x * 2)
>> ka'p'eelil ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
ka'p'eelob = nums$| (x -> x % 2 == 0)
>> ka'p'eelob ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (u k'iinil, (acc, elem) -> expr)
tuláakal = nums$< (0, (acc, x) -> acc + x)
>> tuláakal ¶    // → 55
```

---

## Chaambel Beetik

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "xook ma' páajtal" ¶
} :! ##IO {
    >> "IO chaambel" ¶
} :! {
    >> "hool chaambel: " _err ¶
} :> {
    >> "tuláakal ku beetik" ¶
}
```

| Chuuyil     | Tu' ku yúuchul            |
|-------------|--------------------------|
| `##Div`     | Xook ma' páajtal          |
| `##IO`      | Tzikbal / sistema         |
| `##Index`   | Xook ma'alob              |
| `##Type`    | Chuuyil chaambel          |
| `##Parse`   | Parsing                   |
| `##Network` | Red chaambel              |
| `##_`       | Tuláakal chaambel         |

---

## Módulo

```zymbol
// Tzikbal: lib/calc.zy
# calc

#> { k'áatik, get_PI }    // ÑAWPAQ definiciones

_PI := 3.14159
k'áatik(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Tzikbal: main.zy
<# ./lib/calc <= c    // alias k'abeet

>> c::k'áatik(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

---

## Tuláakal U Jela'anil: FizzBuzz

```zymbol
tsibtik(xook) {
    ? xook % 15 == 0 { <~ "ChichTs'oots'" }
    _? xook % 3  == 0 { <~ "Chich" }
    _? xook % 5  == 0 { <~ "Ts'oots'" }
    _ { <~ xook }
}

@ i:1..20 { >> tsibtik(i) ¶ }
```

---

## Síimbolo' Tzikbal

| Símbolo | U beetik          | Símbolo    | U beetik           |
|---------|-------------------|------------|--------------------|
| `=`     | k'aaba'           | `$#`       | xook               |
| `:=`    | ma' tikrakuq      | `$+`       | ts'aak             |
| `>>`    | páajtal           | `$-`       | kíinsik            |
| `<<`    | cháanbal          | `$?`       | yaan               |
| `¶`/`\` | ts'o'ok línea     | `$[s..e]`  | chuuyil            |
| `?`     | jaaj              | `$>`       | map                |
| `_?`    | wáa               | `$\|`      | filter             |
| `_`     | ma' / tuláakal    | `$<`       | reduce             |
| `??`    | match             | `!?`       | kaab               |
| `@`     | chuuyil           | `:!`       | k'aak'al           |
| `@!`    | ts'o'ok           | `:>`       | tuláakal           |
| `@>`    | xíimbal           | `$!`       | chaambel           |
| `->`    | lambda            | `$!!`      | chaambel             |
| `<~`    | tz'ibik           | `#`        | módulo             |
| `\|>`   | pipe              | `#>`       | páajtal            |
| `#1`    | jaaj              | `<#`       | cháanbal           |
| `#0`    | ma'               | `::`       | módulo k'áatik     |

---

*Zymbol-Lang — Síimbolo'. Tuláakal. Ma' Tikrakuq.*

---

> **Tzikbal:** Le tzíibil lelo' ku beetik yéetel ku ts'áaik inteligencia artificial (IA).
> Tuun beetik ti' bix páajtal, bix Jump'éel t'aan wáa techapyrã ku yaan sa'atale'.
> Le referencia chiqap: [Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
