# Zymbol-Lang Tlahtoa Amatl

**Zymbol-Lang** ce tlahtoa mecatl tlapōhualli. Āmo quitequi tlahtōlli — mochi tlapōhualoni. Nochi tlahtolli ipan nemi iuhquin.

---

## Tlahtoa Neltiliztli

- Āmo tlahtōlli (`if`, `while`, `return` āmo nemi — zan tlapōhualoni `?`, `@`, `<~`)
- Unicode mochi — tocāitl nochi tlahtolli itech iā emoji 👋
- Tlahtolli āmo quitequi — código nochi tlahtolli ipan iuhquin

---

## Tēxtli Ihuan Tlapōhualoni Mochi

```zymbol
x = 10           // tēxtli (huel mopatla)
PI := 3.14159    // tlapōhualoni (āmo mopatla — ītlahtlacohua)
tocāitl = "Ana"
nemi = #1        // neltiliztli
👋 := "Niltze"
```

### Tēxtli Mocentlālia

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

## Imaymana Tēxtli

| Tlapaltic      | Techiyotl            | Símbolo `#?` | Neltiliztli                         |
|----------------|----------------------|--------------|-------------------------------------|
| Tlapōhualli    | `42`, `-7`           | `###`        | 64-bit                              |
| Chichintic     | `3.14`, `1.5e10`     | `##.`        | Chichintoc tlapōhualli              |
| Tlahtōl        | `"niltze"`           | `##"`        | Centlāliztli: `"Niltze {tocāitl}"`  |
| Ce tlapal      | `'A'`                | `##'`        | Ce Unicode tlapal                   |
| Neltia/Āmo     | `#1`, `#0`           | `##?`        | ĀQUIQUE 1 iā 0 tlapōhualli          |
| Centlāliztli   | `[1, 2, 3]`          | `##]`        | Nochi iuhquin tlapaltic             |
| Tupla          | `(a, b)`             | `##)`        | Ītlan                               |
| Tupla tocāitl  | `(x: 1, y: 2)`       | `##)`        | Quitlalia tocāitl iā tlapōhualli    |

---

## Tēxtli Quitēhua Ihuan Caltia

```zymbol
// Tēxtli Quitēhua — ĀMOQUI cuecueyōca nochi
>> "Niltze" ¶                    // ¶ iā \\ quichihua tzacuiliztli
>> "a=" a " b=" b ¶              // miec tlapōhualoni centlāliztli
>> "tlapōhualli=" xelihui(2, 3) ¶  // función quimomachilia
>> (arr$#) ¶                     // postfix parenthesis monequi

// Caltia
<< tocāitl                       // āmo prompt — caltiameh
<< "Monocāitl? " tocāitl         // prompt ipan
```

> `¶` iā `\\` iuhquin nemi tzacuiliztli.

---

## Tlahtōl Centlāliztli

Ēyi tlamantli — cecenyacatl itech:

```zymbol
tocāitl = "Ana"
n = 25

// 1. Tecōmatl — tēxtli = iā :=
tlahtōl = "Niltze ", tocāitl, "!"          // → Niltze Ana!
TOCĀITL := "Tlahtōlli: ", tocāitl

// 2. Centlāliztli — >> ipan
>> "Niltze " tocāitl " motlapōhualli " n ¶  // → Niltze Ana motlapōhualli 25

// 3. Omoteneuh — nochi ipan
tlahpalōlli = "Niltze {tocāitl}, motlapōhualli {n}"  // → Niltze Ana, motlapōhualli 25
```

> **Neltiliztli**: `+` zan tlapōhualli. Tlahtōl ipan quichihua tlahtlacohuiliztli.

---

## Ītlan Nemiliztli

```zymbol
x = 7

// Zan neltia
? x > 0 { >> "huēyi" ¶ }

// Neltia / iā neltia / āmo
? x > 100 {
    >> "ueuetl" ¶
} _? x > 0 {
    >> "huēyi" ¶
} _? x == 0 {
    >> "āzo" ¶
} _ {
    >> "tepiton" ¶
}
```

Bloque `{ }` **monequi** mā zan ce renglón catqui.

---

## Match

```zymbol
// Match tlapōhualli ītlan
tlapōhualli = 85
grado = ?? tlapōhualli {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Match quīmilōlli (nochi tlamantli)
iztac = -5
neltiliztli = ?? iztac {
    _? iztac < 0  : "cepayahuitl"
    _? iztac < 20 : "cecec"
    _? iztac < 35 : "totonqui"
    _             : "tlatia"
}
>> neltiliztli ¶    // → cepayahuitl

// Match tlahtōl
tlapalli = "chichiltic"
código = ?? tlapalli {
    "chichiltic": "#FF0000"
    "xoxoctic"  : "#00FF00"
    _           : "#000000"
}
>> código ¶
```

---

## Nahuatilli

```zymbol
// Tlapōhualli ītlan: 0..4 quimotlalia 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Tlapōhualli pahpaqui
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Tlapōhualli nochi
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Peve (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Nochi tlamantli
totolin = ["chilli", "elotl", "āmatl"]
@ f:totolin { >> f ¶ }

// Tlahtōl tlapalloh
@ c:"niltze" { >> c "-" }
>> ¶    // → n-i-l-t-z-e-

// @! ihuan @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> nemi
    ? i > 7 { @! }          // @! tlamia
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Tlapalēhuia

```zymbol
// Quichihua ihuan quimōmana
xelihui(a, b) { <~ a + b }
>> xelihui(3, 4) ¶    // → 7

// Mōcuepiliztli
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Tlapalēhuia quitlalia — āmo quimotoa huehuē tēxtli
global = 100
nechihua() {
    x = 42    // nican zan
    <~ x
}
>> nechihua() ¶    // → 42
```

> **Huēyi neltiliztli**: Tlapalēhuia `tocāitl(params){ }` āmo tlapōhualoni nemi.
> Quimacah: `x -> tocāitl(x)`.

---

## Lambda ihuan Closure

```zymbol
// Lambda (āmo tenehualiztli)
ōmome = x -> x * 2
xelihui = (a, b) -> a + b
>> ōmome(5) ¶    // → 10
>> xelihui(3, 7) ¶  // → 10

// Lambda bloque (tenehualiztli)
xelihui2 = x -> {
    ? x > 0 { <~ "huēyi" }
    _? x < 0 { <~ "tepiton" }
    <~ "āzo"
}
>> xelihui2(5) ¶     // → huēyi
>> xelihui2(0) ¶     // → āzo
>> xelihui2(-5) ¶    // → tepiton

// Closure — lambda quimomachilia huehuē tēxtli
factor = 3
ēyi = x -> x * factor    // quimomachilia 'factor'
>> ēyi(7) ¶    // → 21

// Tlapalēhuia quichihua tlapalēhuia
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda tlapōhualoni: centlāliztli ipan
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Centlāliztli

```zymbol
arr = [10, 20, 30, 40, 50]

// Quimōmana (0-base)
>> arr[0] ¶    // → 10

// Tlapōhualli (parenthesis monequi >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Calāquia, quichihua, nehnemia, ītlan
arr = arr$+ 60               // calāquia
arr = arr$- 0                // quichihua índice 0
nemi = arr$? 30              // → #1
ītlan = arr$[0..2]           // [20, 30]

// Tlapōhualoni patla
arr[1] = 99

// Nochi tlamantli
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` quitemoa **centlāliztli yancuic** — calāquia: `arr = arr$+ 4`.
> Āmo ōmome — ōme tēxtli quichihua.

---

## Tupla

```zymbol
// Tupla tocāitl
tlacatl = (tocāitl: "Alice", xiuhpōhualli: 25)
>> tlacatl.tocāitl ¶       // → Alice
>> tlacatl.xiuhpōhualli ¶  // → 25
>> tlacatl[0] ¶             // → Alice (tlapōhualli cuali)
```

---

## Huēyi Tlapalēhuia

HOF tlapōhualoni monequi **lambda inline** — āmo variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
ōmomeh = nums$> (x -> x * 2)
>> ōmomeh ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
nahualeh = nums$| (x -> x % 2 == 0)
>> nahualeh ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (pepena, (acc, elem) -> expr)
nochi = nums$< (0, (acc, x) -> acc + x)
>> nochi ¶    // → 55
```

---

## Tlahtlacohuiliztli Quipia

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "xelihui āmo nemi" ¶
} :! ##IO {
    >> "IO tlahtlacohuiliztli" ¶
} :! {
    >> "huehuē tlahtlacohuiliztli: " _err ¶
} :> {
    >> "nochi nemi" ¶
}
```

| Tlapaltic   | Āquin nemi                  |
|-------------|----------------------------|
| `##Div`     | Xelihui āmo nemi            |
| `##IO`      | Āmatl / sistema             |
| `##Index`   | Tlapōhualli ōca āmo nemi    |
| `##Type`    | Tlapaltic tlahtlacohuiliztli|
| `##Parse`   | Parsing                     |
| `##Network` | Red tlahtlacohuiliztli      |
| `##_`       | Nochi tlahtlacohuiliztli    |

---

## Módulo

```zymbol
// Āmatl: lib/calc.zy
# calc

#> { xelihui, get_PI }    // ÑAWPAQ definiciones

_PI := 3.14159
xelihui(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Āmatl: main.zy
<# ./lib/calc <= c    // alias monequi

>> c::xelihui(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

---

## Moch Techiyotl: FizzBuzz

```zymbol
xelihui(tlapōhualli) {
    ? tlapōhualli % 15 == 0 { <~ "PopochtliTzatziliztli" }
    _? tlapōhualli % 3  == 0 { <~ "Popochtli" }
    _? tlapōhualli % 5  == 0 { <~ "Tzatziliztli" }
    _ { <~ tlapōhualli }
}

@ i:1..20 { >> xelihui(i) ¶ }
```

---

## Tlapōhualoni Tēpōztli

| Tlapōhualoni | Tlapalēhuia       | Tlapōhualoni | Tlapalēhuia        |
|--------------|-------------------|--------------|--------------------|
| `=`          | tēxtli            | `$#`         | tlapōhualli        |
| `:=`         | āmo mopatla       | `$+`         | calāquia           |
| `>>`         | quitēhua          | `$-`         | quichihua          |
| `<<`         | caltia            | `$?`         | nemi               |
| `¶`/`\`      | tzacuiliztli      | `$[s..e]`    | ītlan              |
| `?`          | neltia            | `$>`         | map                |
| `_?`         | iā                | `$\|`        | filter             |
| `_`          | āmo / nochi       | `$<`         | reduce             |
| `??`         | match             | `!?`         | quipia             |
| `@`          | nahuatilli        | `:!`         | quitemohua         |
| `@!`         | tlamia            | `:>`         | nochi nemi         |
| `@>`         | nemi              | `$!`         | tlahtlacohuia      |
| `->`         | lambda            | `$!!`        | quicahua           |
| `<~`         | tenehualiztli     | `#`          | módulo             |
| `\|>`        | pipe              | `#>`         | quitēhua           |
| `#1`         | neltia            | `<#`         | calāquia           |
| `#0`         | āmo               | `::`         | módulo xelihui     |

---

*Zymbol-Lang — Tlapōhualoni. Nochi. Āmo Mopatla.*

---

> **Tlahtōliztli:** In āmatl xinechihua ihuan xinemojtlapaloeh inteligencia artificial (IA) tlen.
> Ohualchīuhque zan nochi, amo in tlahtōl anozo techiyotl ihquihqueh māhuiztli.
> In tlaneltocā: [Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
