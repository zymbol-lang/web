# Zymbol-Lang U Tzíibil Nojoch Kaaj

**Zymbol-Lang** jun tzíibil t'aan. Ma' k'aaba'ob u tia'al — bey síimbolo'. Le xan jach kex bix t'aan.

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

```zymbol
// Chuuyil xook — bora (chuuyil, xook, ba'al)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Páajtal T'aanil yéetel Cháanbal

```zymbol
>> "Ba'ax ka wa'alik" ¶             // ¶ wáa \\ u ts'o'ok línea
>> "a=" a " b=" b ¶                 // ya'ab ba'alche' ti' leti'
>> (arr$#) ¶                        // postfix paréntesis k'abeet

<< k'aaba'                          // ma' prompt — k'uchul ti' k'aaba'
<< "Ba'ax a k'aaba'? " k'aaba'      // prompt yéetel
```

> `¶` wáa `\\` bey kex ts'o'ok línea.

---

## Patatín Operatoru

```zymbol
// Xook borarir — k'aaba' sünain
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (xook chuuyil)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (xook naas)

// Tzikbal chuuyil
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// T'aan jaaj
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Bello Stringi

```zymbol
// Óox chuuyil — bix ken beey
k'aaba' = "Ana"
n = 42

t'aan = "Ba'ax ka wa'alik ", k'aaba', "!"   // koma — k'aaba' = wáa :=
>> "Ba'ax ka wa'alik " k'aaba' " a xook " n ¶  // ti' leti' — >>
tzikbal = "Ba'ax ka wa'alik {k'aaba'}, a xook {n}"  // u úuchben — ken
```

```zymbol
s = "Ba'ax ka wa'alik Kaaj"
len = s$#                  // 22
sub = s$[0..5]             // "Ba'ax"  (nayc chuuyil)
has = s$? "Kaaj"           // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "BA'Ax kA wA'Alik KAAj"
rep1 = s$~~["a":"A":1]     // "BA'ax ka wa'alik Kaaj"
```

> **Tzikbal**: `+` xook cha'an. T'aan yéetel u ya'ab ichil.

---

## U Beetik Noj

```zymbol
x = 7

? x > 0 { >> "nojoch" ¶ }

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

> Bloque `{ }` **k'abeet** kex jun línea.

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

// Match t'aan
chak = "chak"
código = ?? chak {
    "chak" : "#FF0000"
    "ya'x" : "#00FF00"
    _      : "#000000"
}

// Match wáa (tuláakal taamil)
k'áak' = -5
estado = ?? k'áak' {
    _? k'áak' < 0  : "sak"
    _? k'áak' < 20 : "síis"
    _? k'áak' < 35 : "le'ek"
    _              : "k'áak'"
}
>> estado ¶    // → sak

// Match bloque
?? n {
    0       : { >> "ma'" ¶ }
    _? n < 0: { >> "chan" ¶ }
    _       : { >> "nojoch" ¶ }
}
```

---

## Chuuyil

```zymbol
@ i:0..4  { >> i " " }        // xook chuuyil:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // xook xookol:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // xook noj:      5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (peve)

ixi'im = ["nal", "box", "k'aan nal"]
@ f:ixi'im { >> f ¶ }         // tuláakal ba'al

@ c:"kaaj" { >> c "-" }
>> ¶                          // → k-a-a-j-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> xíimbal
    ? i > 7 { @! }             // @! ts'o'ok
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Chuuyil darasuum
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Chuuyil k'aaba' (ts'o'ok naasad)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Tsibtik

```zymbol
k'áatik(a, b) { <~ a + b }
>> k'áatik(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Función **ma' u yilaj hool k'aaba'** — ma' páajtal u yilaj k'aaba' hool. Hut'unn `<~` k'aaba' tzikbal:

```zymbol
swap(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
swap(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> **Noj tzikbal**: Función `k'aaba'(params){ }` ma' ba'al.
> Ti' argumento: `x -> k'aaba'(x)`.

---

## Lambda yéetel Closure

```zymbol
ka'p'éel = x -> x * 2
k'áatik = (a, b) -> a + b
>> ka'p'éel(5) ¶    // → 10
>> k'áatik(3, 7) ¶  // → 10

// Lambda bloque
tsibtik = x -> {
    ? x > 0 { <~ "nojoch" }
    _? x < 0 { <~ "chan" }
    <~ "ma'"
}

// Closure — lambda u tzikbal hool
factor = 3
óox = x -> x * factor
>> óox(7) ¶    // → 21

// Función u beeta función
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda ba'al: tzikbal ichil
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Tzikbal

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — u yilaj (0-base)
arr[-1]         // 5 — xook noj (ts'o'ok)
arr$#           // 5 — xook (paréntesis k'abeet >>)

arr = arr$+ 6            // ts'aak → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // ts'aak ti' índice 2
arr3 = arr$- 3           // kíinsik jun chuuyil
arr4 = arr$-- 3          // kíinsik tuláakal
arr5 = arr$-[0]          // kíinsik ti' índice
arr6 = arr$-[1..3]       // kíinsik rango (nayc chuuyil)

has = arr$? 3            // #1 — yaan
pos = arr$?? 3           // [2] — tuláakal índice
sl = arr$[0..3]          // [1,2,3] — chuuyil (nayc chuuyil)
sl2 = arr$[0:3]          // [1,2,3] — xook chuuyil

asc = arr$^+             // gai'tayl jate (naas solus)
desc = arr$^-            // gai'tayl nayc (naas solus)

// Tupla tzikbal — hut'unn $^ yéetel lambda
db = [(k'aaba': "Carla", ja'ab: 28), (k'aaba': "Ana", ja'ab: 25), (k'aaba': "Bob", ja'ab: 30)]
by_ja'ab  = db$^ (a, b -> a.ja'ab < b.ja'ab)
by_k'aaba' = db$^ (a, b -> a.k'aaba' > b.k'aaba')
>> by_ja'ab[0].k'aaba' ¶     // → Ana
>> by_k'aaba'[0].k'aaba' ¶   // → Carla

arr[1] = 99              // ba'al tikrakuq
arr = arr[1]$~ 99        // ba'al yáanal — bora tzikbal
```

> `$+`, `$-`, `$[..]` u ts'o'okol **tzikbal yáanal** — ts'aak: `arr = arr$+ 4`.
> Ma' tz'aab — ka'p'éel tz'iibil.
> `$^+` / `$^-` gai'tayl **naas solus**. Tupla tzikbal — hut'unn `$^` yéetel lambda.

```zymbol
// Tzikbal naasad
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Splittini

```zymbol
// Tzikbal
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ma' k'abeet

// Tupla chuuyil
point = (100, 200)
(px, py) = point             // px=100  py=200

// Tupla k'aaba'
person = (k'aaba': "Ana", ja'ab: 25, city: "Mérida")
(k'aaba': n, ja'ab: a) = person   // n="Ana"  a=25
```

---

## Tupla

```zymbol
// Chuuyil
point = (10, 20)
>> point[0] ¶    // → 10

// K'aaba'
winik = (k'aaba': "Alice", ja'ab: 25)
>> winik.k'aaba' ¶    // → Alice
>> winik[0] ¶         // → Alice  (xook xan páajtal)

// Naasad
pos = (x: 10, y: 20)
p = (pos: pos, label: "kaaj")
>> p.pos.x ¶        // → 10
```

---

## Noj Función

> HOF señal k'abeet **lambda inline** — ma' variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ka'p'eelil = nums$> (x -> x * 2)                // map → [2,4,6…20]
ka'p'eelob = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
tuláakal   = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Tracyn mhi'ade
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Función naasad — bora lambda
k'áatik2(x) { <~ x * 2 }
r = nums$> (x -> k'áatik2(x))    // ✅
```

---

## Pipo Operatoru

Ibac chuuyil k'abeet `_` meg'haat tzikbal:

```zymbol
ka'p'éel = x -> x * 2
k'áatik = (a, b) -> a + b
inc = x -> x + 1

5 |> ka'p'éel(_)        // → 10
10 |> k'áatik(_, 5)     // → 15
5 |> k'áatik(2, _)      // → 7

// Naasad
r = 5 |> ka'p'éel(_) |> inc(_) |> ka'p'éel(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Chaambel Beetik

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "xook ma' páajtal" ¶
} :! {
    >> "hool chaambel: " _err ¶    // _err chuuyil chaambel
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
// lib/calc.zy
# calc

#> { k'áatik, get_PI }    // ÑAWPAQ definiciones

_PI := 3.14159
k'áatik(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias k'abeet

>> c::k'áatik(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Nob k'aaba' naas
# mylib
#> { _ibac_k'áatik <= ibac }

_ibac_k'áatik(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::ibac(3, 4) ¶    // → 7
```

---

## Datinu Operatoru

```zymbol
// Bora xook naas t'aan
v1 = #|"42"|      // → 42  (Xook)
v2 = #|"3.14"|    // → 3.14  (Chiru xook)
v3 = #|"abc"|     // → "abc"  (ma' chaambel)

// Tracyn / kíinsik
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kíinsik)

// Gai'tayl xook
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Naas xook
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Bora naas
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shelli Integratinu

```zymbol
date = <\ date +%Y-%m-%d \>     // chuuyil stdout (bal ts'o'ok línea)
>> "Bejla'e': " date

tebec = "data.txt"
content = <\ cat {tebec} \>     // bora hut'unn

output = </"./sub.zy"/>         // beetik zy tzikbal, chuuyil
>> output
```

> `><` chuuyil CLI k'aaba' jun t'aan tzikbal (jun chuuyil cha'an).

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

| Símbolo | U beetik          | Símbolo      | U beetik           |
|---------|-------------------|--------------|--------------------|
| `=`     | k'aaba'           | `$#`         | xook               |
| `:=`    | ma' tikrakuq      | `$+`         | ts'aak             |
| `>>`    | páajtal           | `$+[i]`      | ts'aak ti' índice  |
| `<<`    | cháanbal          | `$-`         | kíinsik jun        |
| `¶`/`\\`| ts'o'ok línea     | `$--`        | kíinsik tuláakal   |
| `?`     | jaaj              | `$-[i]`      | kíinsik índice     |
| `_?`    | wáa               | `$-[i..j]`   | kíinsik rango      |
| `_`     | ma' / tuláakal    | `$?`         | yaan               |
| `??`    | match             | `$??`        | tuláakal índice    |
| `@`     | chuuyil           | `$[s..e]`    | chuuyil            |
| `@!`    | ts'o'ok           | `$>`         | map                |
| `@>`    | xíimbal           | `$\|`        | filter             |
| `->`    | lambda            | `$<`         | reduce             |
| `$^+`   | gai'tayl jate     | `$^-`        | gai'tayl nayc      |
| `$^`    | gai'tayl lambda   |              |                    |
| `<~`    | tz'ibik           | `!?`         | kaab               |
| `\|>`   | pipe              | `:!`         | k'aak'al           |
| `#1`    | jaaj              | `:>`         | tuláakal           |
| `#0`    | ma'               | `$!`         | chaambel           |
| `<#`    | cháanbal          | `$!!`        | chaambel hibira    |
| `#`     | módulo            | `#>`         | páajtal            |
| `::`    | módulo k'áatik    | `.`          | chuuyil yilaj      |
| `#\|..\|`| bora xook        | `#?`         | chuuyil naas       |
| `#.N\|..\|`| tracyn         | `#!N\|..\|`  | kíinsik            |
| `c\|..\|`| gai'tayl comma   | `e\|..\|`    | científico         |
| `<\ ..\>`| shell beetik     | `>\<`        | CLI k'aaba'        |

---

*Zymbol-Lang — Síimbolo'. Tuláakal. Ma' Tikrakuq.*

> **Tzikbal:** Le tzíibil lelo' ku beetik yéetel ku ts'áaik inteligencia artificial (IA).
> Tuun beetik ti' bix páajtal, bix Jump'éel t'aan wáa techapyrã ku yaan sa'atale'.
> Le referencia chiqap: [Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
