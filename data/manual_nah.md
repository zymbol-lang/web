# Zymbol-Lang Tlahtoa Amatl

**Zymbol-Lang** ce tlahtoa mecatl tlapōhualli. Āmo quitequi tlahtōlli — mochi tlapōhualoni. Nochi tlahtolli ipan nemi iuhquin.

- Āmo tlahtōlli (`if`, `while`, `return` āmo nemi — zan tlapōhualoni `?`, `@`, `<~`)
- Unicode mochi — tocāitl nochi tlahtolli itech iā emoji 👋
- Tlahtolli āmo quitequi — código nochi tlahtolli ipan iuhquin

---

## Tēxtli Ihuan Tlapōhualoni Mochi

```zymbol
x = 10              // tēxtli (huel mopatla)
PI := 3.14159       // tlapōhualoni (āmo mopatla — ītlahtlacohua)
tocāitl = "Ana"
nemi = #1           // neltiliztli
👋 := "Niltze"
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

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Tēxtli Quitēhua Ihuan Caltia

```zymbol
>> "Niltze" ¶                    // ¶ iā \\ quichihua tzacuiliztli
>> "a=" a " b=" b ¶              // miec tlapōhualoni centlāliztli
>> (arr$#) ¶                     // postfix parenthesis monequi

<< tocāitl                       // āmo prompt — caltiameh
<< "Monocāitl? " tocāitl         // prompt ipan
```

> `¶` (AltGr+R teclado españolpe) iā `\\` iuhquin nemi tzacuiliztli.

---

## Tlamachtilmachiyotl

```zymbol
// Arithmetic — use assignments; some operators have quirks directly in >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (integer division)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (exponentiation)

// Comparison
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logical
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Tlahtolli

```zymbol
// Three concatenation forms
tocāitl = "Ana"
n = 25

tlahtōl = "Niltze ", tocāitl, "!"          // tecōmatl — tēxtli = iā :=
>> "Niltze " tocāitl " motlapōhualli " n ¶  // centlāliztli — >> ipan
tlahpalōlli = "Niltze {tocāitl}, motlapōhualli {n}" // omoteneuh — nochi ipan
```

```zymbol
s = "Niltze Tlaltipac"
len = s$#                  // 16
sub = s$[0..6]             // "Niltze"  (tukuy mana)
has = s$? "Tlaltipac"      // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "NiLtze TLaLtipac"
rep1 = s$~~["l":"L":1]     // "NiLtze Tlaltipac"  (ñawpaq N kama)
```

> `+` zan tlapōhualli. Tlahtōl ipan quichihua tlahtlacohuiliztli `,`, centlāliztli, iā omoteneuh.

---

## Ītlan Nemiliztli

```zymbol
x = 7

? x > 0 { >> "huēyi" ¶ }

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

> Bloque `{ }` **monequi** mā zan ce renglón catqui.

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

// Match tlahtōl
tlapalli = "chichiltic"
código = ?? tlapalli {
    "chichiltic": "#FF0000"
    "xoxoctic"  : "#00FF00"
    _           : "#000000"
}

// Match quīmilōlli (nochi tlamantli)
iztac = -5
neltiliztli = ?? iztac {
    _? iztac < 0  : "cepayahuitl"
    _? iztac < 20 : "cecec"
    _? iztac < 35 : "totonqui"
    _             : "tlatia"
}
>> neltiliztli ¶    // → cepayahuitl

// Bloque ukupi
?? n {
    0       : { >> "āzo" ¶ }
    _? n < 0: { >> "tepiton" ¶ }
    _       : { >> "huēyi" ¶ }
}
```

---

## Nahuatilli

```zymbol
@ i:0..4  { >> i " " }        // tlapōhualli ītlan:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pahpaqui:            1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tlapōhualli nochi:   5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

totolin = ["chilli", "elotl", "āmatl"]
@ f:totolin { >> f ¶ }       // nochi tlamantli array

@ c:"niltze" { >> c "-" }
>> ¶                          // → n-i-l-t-z-e-  (tlahtōl tlapalloh)

@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> nemi
    ? i > 7 { @! }          // @! tlamia
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Tlapōhualli nahuatilli
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Tocāitl nahuatilli (ukupi tlamia)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Tlapalēhuia

```zymbol
xelihui(a, b) { <~ a + b }
>> xelihui(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Tlapalēhuia **quitlalia** — āmo quimotoa huehuē tēxtli. Salida parámetro `<~` apaykachaña:

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

> Tocāitl tlapalēhuia `tocāitl(params){ }` āmo tlapōhualoni nemi. Quimacah: `x -> tocāitl(x)`.

---

## Lambda ihuan Closure

```zymbol
ōmome = x -> x * 2
xelihui = (a, b) -> a + b
>> ōmome(5) ¶    // → 10
>> xelihui(3, 7) ¶  // → 10

// Lambda bloque
xelihui2 = x -> {
    ? x > 0 { <~ "huēyi" }
    _? x < 0 { <~ "tepiton" }
    <~ "āzo"
}

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
>> ops[2](5) ¶    // → 25
```

---

## Centlāliztli

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — quimōmana (0-base)
arr[-1]         // 5 — tlapōhualli āmo (qipa)
arr$#           // 5 — tlapōhualli (parenthesis monequi >>pe)

arr = arr$+ 6            // calāquia → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // jakhu 2 calāquia
arr3 = arr$- 3           // ñawpaq valor quichihua
arr4 = arr$-- 3          // nochi valor quichihua
arr5 = arr$-[0]          // tlapōhualli quichihua
arr6 = arr$-[1..3]       // ītlan quichihua (tukuy mana)

nemi = arr$? 3           // #1 — utjiñ
pos = arr$?? 3           // [2] — nochi tlapōhuallinak
sl = arr$[0..3]          // [1,2,3] — ītlan (tukuy mana)
sl2 = arr$[0:3]          // [1,2,3] — kikillan, tlapōhualliw

asc = arr$^+             // wichay (primitivos kama)
desc = arr$^-            // nochi (primitivos kama)

// Tocāitl/tlapōhualli tuple centlāliztli — $^ comparador lambdawan
db = [(tocāitl: "Carla", xiuh: 28), (tocāitl: "Ana", xiuh: 25), (tocāitl: "Bob", xiuh: 30)]
xiuhpan  = db$^ (a, b -> a.xiuh < b.xiuh)
tocāpan  = db$^ (a, b -> a.tocāitl > b.tocāitl)
>> xiuhpan[0].tocāitl ¶     // → Ana
>> tocāpan[0].tocāitl ¶     // → Carla

arr[1] = 99              // tlapōhualoni patla
arr = arr[1]$~ 99        // yancuic centlāliztli kutitaña
```

> Nochi colección tlapōhualoni **yancuic centlāliztli** quitemoa. Calāquia: `arr = arr$+ 4`.
> Āmo ōmome — ōme tēxtli quichihua.
> `$^+` / `$^-` **primitivo centlāliztli** (tlapōhuallinak, tlahtōl). Tuple centlāliztliw `$^` comparador lambdawan — ñanqa lambdapi churasqa (`<` = wichay, `>` = nochi).

```zymbol
// Ukupi centlāliztli
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[1][2] ¶    // → 6
```

---

## Tlapolihuiliztli

```zymbol
// Centlāliztli
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ āmo monequi

// Tlapōhualli tupla
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Tocāitl tupla
tlacatl = (tocāitl: "Ana", xiuh: 25, altepetl: "Tenochtitlan")
(tocāitl: t, xiuh: x) = tlacatl   // t="Ana"  x=25
```

---

## Tupla

```zymbol
// Tlapōhualli
punto = (10, 20)
>> punto[0] ¶    // → 10

// Tocāitl
tlacatl = (tocāitl: "Alice", xiuhpōhualli: 25)
>> tlacatl.tocāitl ¶       // → Alice
>> tlacatl[0] ¶             // → Alice  (tlapōhualli cuali)

// Ukupi
pos = (x: 10, y: 20)
p = (pos: pos, tocāitl: "qallta")
>> p.pos.x ¶        // → 10
```

---

## Huēyi Tlapalēhuia

> HOF tlapōhualoni monequi **lambda inline** — āmo variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ōmomeh   = nums$> (x -> x * 2)                // map  → [2,4,6…20]
nahualeh = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
nochi    = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Ōme tēxtliw huñiy
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Tocāitl tlapalēhuia HOF ipan — lambdawan hapiy
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Tlacaxtlahuiliztli

RHS siempre `_` placeholder monequi piped tlapōhualoni:

```zymbol
ōmome = x -> x * 2
yapxitaña = (a, b) -> a + b
yapxtaña = x -> x + 1

5 |> ōmome(_)            // → 10
10 |> yapxitaña(_, 5)    // → 15
5 |> yapxitaña(2, _)     // → 7

// Chiqanchasiña
r = 5 |> ōmome(_) |> yapxtaña(_) |> ōmome(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Tlahtlacohuiliztli Quipia

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "xelihui āmo nemi" ¶
} :! {
    >> "huehuē tlahtlacohuiliztli: " _err ¶    // _err tlahtlacohuiliztli quitlalia
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

```zymbol
// Tocāitl yancuic exportar
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7  (tocāitl _internal_add pakasqa)
```

---

## Tlahtolmachiyotl

```zymbol
// Tlahtōl tlapōhualliñ tikraña
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (āmo tlahtlacohuiliztli)

// Xocotl / ch'iqtaña
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (ōme decimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (ch'iqtaña)

// Tlapōhualli formato
fmt = #,|1234567|      // → 1,234,567  (coma huñisqa)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Base literal
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Base tikraña sartañataki
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Tlatlazohtlaliztli Shell

```zymbol
ilhuitl = <\ date +%Y-%m-%d \>     // stdout hap'iy (tukuy \n hapikun)
>> "Axcān: " ilhuitl

āmatl = "data.txt"
tlahtōl = <\ cat {āmatl} \>      // interpolación comando ukupi

lluqsiña = </"./subscript.zy"/>   // huk Zymbol āmatl quichihua, sartaña hap'iy
>> lluqsiña
```

> `><` CLI argumentonak arunak centlāliztli hina hap'iy (tree-walker kama).

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
| `>>`         | quitēhua          | `$+[i]`      | tlapōhuallipi churay |
| `<<`         | caltia            | `$-`         | ñawpaq quichihua   |
| `¶`/`\\`     | tzacuiliztli      | `$--`        | nochi quichihua    |
| `?`          | neltia            | `$-[i]`      | tlapōhualli quichihua |
| `_?`         | iā                | `$-[i..j]`   | ītlan quichihua    |
| `_`          | āmo / nochi       | `$?`         | nemi               |
| `??`         | match             | `$??`        | nochi tlapōhuallinak |
| `@`          | nahuatilli        | `$[s..e]`    | ītlan              |
| `@!`         | tlamia            | `$>`         | map                |
| `@>`         | nemi              | `$\|`        | filter             |
| `->`         | lambda            | `$<`         | reduce             |
| `$^+`        | wichay (primitivos) | `$^-`      | nochi (primitivos) |
| `$^`         | comparador (tuples) | | |
| `<~`         | tenehualiztli     | `!?`         | quipia             |
| `\|>`        | pipe              | `:!`         | quitemohua         |
| `#1`         | neltia            | `:>`         | nochi nemi         |
| `#0`         | āmo               | `$!`         | tlahtlacohuia      |
| `<#`         | calāquia          | `$!!`        | quicahua           |
| `#`          | módulo            | `#>`         | quitēhua           |
| `::`         | módulo xelihui    | `.`          | campo taripay      |
| `#\|..\|`    | tlapōhualli tikraña | `#?`       | tipo metadata      |
| `#.N\|..\|`  | xocotl            | `#!N\|..\|`  | ch'iqtaña          |
| `c\|..\|`    | coma formato      | `e\|..\|`    | científico         |
| `<\ ..\>`    | shell luraña      | `><`         | CLI argumentonak   |

---

*Zymbol-Lang — Tlapōhualoni. Nochi. Āmo Mopatla.*

> **Tlahtōliztli:** In āmatl xinechihua ihuan xinemojtlapaloeh inteligencia artificial (IA) tlen.
> Ohualchīuhque zan nochi, amo in tlahtōl anozo techiyotl ihquihqueh māhuiztli.
> In tlaneltocā: [Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
