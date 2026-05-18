# Zymbol-Lang Kimün Amukey

**Zymbol-Lang** kiñe kimün zungu. Ngäy tañi kimün zugun — fentren wixal. Feley kiñechi feyta mapuzugun mew.

- Ngäy tañi kimün zugun (`if`, `while`, `return` ngächi — wixal ñi `?`, `@`, `<~`)
- Unicode fentren — sutikuna mapuzugun mew icha emoji 👋
- Zugun ngächi — código kiñechi zugun mew

---

## Wixal Dungukelu ha Kümeke Amulelu

```zymbol
x = 10              // wixal (püleley)
PI := 3.14159       // kümeke (ngäy pülel — wingka reke)
iñche = "Ana"
nüküley = #1        // küme
👋 := "Mari mari"
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

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Dungukelu ha Küpalekey

```zymbol
>> "Mari mari" ¶                    // ¶ icha \\ küme mew
>> "a=" a " b=" b ¶                 // fentren wixal huñisqa
>> (arr$#) ¶                        // postfix paréntesis itrofilu

<< iñche                            // ngäy prompt — küpalen wixal
<< "¿Iney tami suti? " iñche        // prompt yéetel
```

> `¶` (AltGr+R teclado españolpe) icha `\\` küme mew dungukelu.

---

## Ñiduamün

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

## Dungun

```zymbol
// Three concatenation forms
iñche = "Ana"
n = 25

zugun = "Mari mari ", iñche, "!"           // koma — wixal = icha :=
>> "Mari mari " iñche " ñi xokiñ " n ¶    // fentren — >>
rimay = "Mari mari {iñche}, ñi xokiñ {n}" // ukupi — imaymana mew
```

```zymbol
s = "Mari mari Mapu"
len = s$#                  // 15
sub = s$[0..9]             // "Mari mari"  (tukuy mana)
has = s$? "Mapu"           // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "MAri mAri MApu"
rep1 = s$~~["a":"A":1]     // "MAri mari Mapu"  (ñawpaq N kama)
```

> `+` xokiñ ñi. Zugun mew wingka kimün `,`, fentren, icha ukupi.

---

## Rakizuam Ñi Amulew

```zymbol
x = 7

? x > 0 { >> "nochilechi" ¶ }

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

> Bloque `{ }` **itrofilu** kiñe línea ñi feley.

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

// Match zugun
kuluri = "kelü"
código = ?? kuluri {
    "kelü"  : "#FF0000"
    "karü"  : "#00FF00"
    _       : "#000000"
}

// Match waqaychay (fentren kimün)
külliñ = -5
kaqnin = ?? külliñ {
    _? külliñ < 0  : "anüf"
    _? külliñ < 20 : "küf"
    _? külliñ < 35 : "küme kalül"
    _              : "kalül"
}
>> kaqnin ¶    // → anüf

// Bloque ukupi
?? n {
    0       : { >> "ngächi" ¶ }
    _? n < 0: { >> "minche" ¶ }
    _       : { >> "nochilechi" ¶ }
}
```

---

## Muyuy

```zymbol
@ i:0..4  { >> i " " }        // xokiñ küla:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // xokiñ mew:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // xokiñ uray:  5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

küpalwe = ["manzana", "pera", "uva"]
@ f:küpalwe { >> f ¶ }       // fentren ba'al array

@ c:"mapu" { >> c "-" }
>> ¶                          // → m-a-p-u-  (zugun letra)

@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> amun
    ? i > 7 { @! }          // @! fütra
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Tukuy muyuy
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Suti muyuy (ukupi fütra)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Kimeltun

```zymbol
kimeltun(a, b) { <~ a + b }
>> kimeltun(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Kimeltun **ngäy wixal mew** — ngäy küpalwe wixal. Salida parámetro `<~` apaykachaña:

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

> Fütake kimün: Kimeltun `iñche(params){ }` ngäy wixal. Argumento mew: `x -> iñche(x)`.

---

## Lambda ha Closure

```zymbol
epuñiy = x -> x * 2
yapuy = (a, b) -> a + b
>> epuñiy(5) ¶    // → 10
>> yapuy(3, 7) ¶  // → 10

// Lambda bloque
kimeltun2 = x -> {
    ? x > 0 { <~ "nochilechi" }
    _? x < 0 { <~ "minche" }
    <~ "ngächi"
}

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
>> ops[2](5) ¶    // → 25
```

---

## Küpalwe

Küpalwe **püleley** ka fentren kimün mew **kiñe kimün** katupewma.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — amulew (0-base)
arr[-1]         // 5 — xokiñ ngäy (qipa)
arr$#           // 5 — xokiñ (paréntesis itrofilu >>)

arr = arr$+ 6            // ts'aak → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // xokiñ 2 ts'aak
arr3 = arr$- 3           // ñawpaq valor quichihua
arr4 = arr$-- 3          // fentren valor quichihua
arr5 = arr$-[0]          // xokiñ quichihua
arr6 = arr$-[1..3]       // küla quichihua (tukuy mana)

yaan = arr$? 3           // #1 — yaan
pos = arr$?? 3           // [2] — fentren xokiñnak
sl = arr$[0..3]          // [1,2,3] — chuuyil (tukuy mana)
sl2 = arr$[0:3]          // [1,2,3] — kikillan, xokiñniw

asc = arr$^+             // wichay (primitivos kama)
desc = arr$^-            // uray (primitivos kama)

// Suti/xokiñ tuple küpalwe — $^ comparador lambdawan
db = [(suti: "Carla", xipan: 28), (suti: "Ana", xipan: 25), (suti: "Bob", xipan: 30)]
xipanmew  = db$^ (a, b -> a.xipan < b.xipan)
sutimew   = db$^ (a, b -> a.suti > b.suti)
>> xipanmew[0].suti ¶     // → Ana
>> sutimew[0].suti ¶      // → Carla

// Wixal chalilay (küpalwe kama)
arr[1] = 99              // churay
arr[0] += 5              // huñiway: +=  -=  *=  /=  %=  ^=

// Küpalwe yáanal — küpalwe yáanal kutitaña; ñawpaq mana tikray
arr2 = arr[1]$~ 99
```

> Tukuy colección wixal **küpalwe yáanal** kutitaña. Ts'aak: `arr = arr$+ 4`.
> Ngäy huñi — epu tz'iibil.
> `$^+` / `$^-` **primitivo küpalwe** (xokiñnak, zugun). Tuple küpalwemew `$^` comparador lambdawan — ñanqa lambdapi churasqa (`<` = wichay, `>` = uray).

**Wixal kimün** — küpalwe wixalpe churay küpalwe yáanal kutipaymi:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b mana tikray
```

```zymbol
// Ukupi küpalwe
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[1][2] ¶    // → 6
```

---

## Keluwün

```zymbol
// Küpalwe
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ngäy itrofilu

// Xokiñ tupla
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Suti tupla
che = (suti: "Ana", xipan: 25, mapu: "Wallmapu")
(suti: s, xipan: x) = che   // s="Ana"  x=25
```

---

## Tupla

Tupla **ngäy püleley** ka fentren kimün mew **imaymana kimün** katupewma. Küpalwe ngächi, elementos ngäy püleley zugu küpayetew.

```zymbol
// Xokiñ
punto = (10, 20)
>> punto[0] ¶    // → 10

datos = (42, "mari mari", #1, 3.14)
>> datos[2] ¶     // → #1

// Suti mew
che = (suti: "Alice", xipan: 25)
>> che.suti ¶    // → Alice
>> che[0] ¶      // → Alice  (xokiñ feley)

// Ukupi
pos = (x: 10, y: 20)
p = (pos: pos, suti: "punta")
>> p.pos.x ¶        // → 10
```

**Ngäy püleley** — tupla elemento tikraküley wingkatu:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ wingka: tupla ngäy püleley
// t[0] += 5    // ❌ kiñechi wingka
```

`$~` (küpalwe yáanal) apaykachay — **küpalwe yáanal** kutipan:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← ñawpaq mana tikray
>> t2 ¶    // → (10, 999, 30)

// Suti tupla — kisuam churay
che = (suti: "Alice", xipan: 25)
che_fütra = (suti: che.suti, xipan: 26)
>> che.xipan ¶      // → 25
>> che_fütra.xipan ¶ // → 26
```

---

## Fütake Kimeltun

> HOF señal itrofilu **lambda inline** — ngäy variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

epuñiysqa  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
epuñiy kuti = nums$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
fentren    = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Epu tz'iibil huñiy
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Suti kimeltun HOF ukupi — lambdawan hapiy
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Ñidua Pipe

RHS siempre `_` placeholder itrofilu piped wixal:

```zymbol
epuñiy = x -> x * 2
yapuy = (a, b) -> a + b
yapxtaña = x -> x + 1

5 |> epuñiy(_)           // → 10
10 |> yapuy(_, 5)        // → 15
5 |> yapuy(2, _)         // → 7

// Huñisqa
r = 5 |> epuñiy(_) |> yapxtaña(_) |> epuñiy(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Wingka Kimün Ñi Ngelay

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "xokiñ fütake wingka" ¶
} :! {
    >> "hool wingka: " _err ¶    // _err wingka dungukelu waqaychan
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

```zymbol
// Suti yancuic dungukelu
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7  (suti _internal_add pakasqa)
```

---

## Rakizuam Pichike Kvzaw

Zymbol fey pichike kvzaw nütramen ta **Unicode pichike kvzaw ñi itroam 69** mew — Devanagari, Arabe-India, Thai, Klingon pIqaD, Matemática Rangikülefilu, LCD ka feychi chi zugu. Feychi kvzaw nütramen küpan `>>`-mew; kvzaw mew feychi kam binaryche.

### Kimün kvzaw wekufüyen

Wirin pichike kvzaw `0` ka `9` feychi kvzaw `#…#` mew:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabe-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII mew küpan
```

### Küpan ka chillkay boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standard)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # feychi pichi ASCII, pichike kvzaw feychi kam
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Pichike kvzaw asli mew kode

Pichike kvzaw kvme literal nga — range, modulo, rekiñman mew:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal kvzaw mew

`#` + pichike kvzaw `0` ka `1` bloc mew literal boolean kvme:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII** nga. `#0` (no) `0` (zéro) mew feychi kvzaw mew küme ñi rakizuam.

---

## Ngünechen Data

```zymbol
// Zugun xokiñpi tikray
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ngäy wingka)

// Xokiñ / ch'iqtaña
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (epu decimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (ch'iqtaña)

// Xokiñ formato
fmt = #,|1234567|      // → 1,234,567  (coma huñisqa)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Base literal
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Base tikraña dungukelu mew
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Eluñmapu

```zymbol
antü = <\ date +%Y-%m-%d \>     // stdout hap'iy (tukuy \n hapikun)
>> "Kümelu: " antü

marandurenda = "data.txt"
tañi = <\ cat {marandurenda} \>      // interpolación comando ukupi

lluqsiña = </"./subscript.zy"/>   // huk Zymbol qillqa kimeltun, dungukelu hap'iy
>> lluqsiña
```

> `><` CLI argumentonak zugun küpalwe hina hap'iy (tree-walker kama).

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
| `>>`    | dungukelu         | `$+[i]`    | xokiñpi ts'aak     |
| `<<`    | küpalekey         | `$-`       | ñawpaq quichihua   |
| `¶`/`\\` | küme mew         | `$--`      | fentren quichihua  |
| `?`     | küme              | `$-[i]`    | xokiñ quichihua    |
| `_?`    | icha              | `$-[i..j]` | küla quichihua     |
| `_`     | wingka / fentren  | `$?`       | yaan               |
| `??`    | match             | `$??`      | fentren xokiñnak   |
| `@`     | muyuy             | `$[s..e]`  | chuuyil            |
| `@!`    | fütra             | `$>`       | map                |
| `@>`    | amun              | `$\|`      | filter             |
| `->`    | lambda            | `$<`       | reduce             |
| `arr[i] = val` | wixal chalilay | `arr[i] += val` | huñiway chalilay |
| `arr[i]$~` | küpalwe yáanal (küpalwe yáanal) | `$^+` | wichay (primitivos) |
| `$^-` | uray (primitivos) | `$^` | comparador (tuples) |
| `<~`    | küme mew          | `!?`       | itrofilu           |
| `\|>`   | pipe              | `:!`       | k'aak'al           |
| `#1`    | küme              | `:>`       | fentren            |
| `#0`    | wingka            | `$!`       | wingka             |
| `<#`    | küpalekey         | `$!!`      | wingka cachay      |
| `#`     | módulo            | `#>`       | dungukelu          |
| `::`    | módulo kimeltun   | `.`        | campo taripay      |
| `#\|..\|` | xokiñ tikraña   | `#?`       | tipo metadata      |
| `#.N\|..\|` | xokiñ          | `#!N\|..\|` | ch'iqtaña        |
| `#,\|..\|` | coma formato    | `#^\|..\|`  | científico         |
| `#d0d9#` | pichike kvzaw rakizuam yafülün | `#09#` | ASCII mew küpan |
| `<\ ..\>` | shell luraña    | `><`       | CLI argumentonak   |

## Versiyon Tañi Fewla

### v0.0.3 — Unicode Pichike Kvzaw & LSP Küme _(Abril 2026)_

- **Fentren** Unicode bloc 69 ka token `#d0d9#`
- **Fentren** Boolean literals kvzaw mew — `#१` / `#०`, `#١` / `#٠`, ka feychi
- **Fentren** Klingon pIqaD pichike kvzaw (CSUR PUA U+F8F0–U+F8F9)
- **Fentren** VM opcode `SetNumeralMode` — tree-walker mew kvme
- **Fentren** REPL pichike kvzaw rakizuam echo ka variable mew
- **Kisuam** `>>` boolean `#` (`#0` / `#1`) kvzaw mew

### v0.0.2_01 — Kvzaw Tañi Kvzaw _(30 Mar 2026)_

- **Kisuam** `c|..|` → `#,|..|` ka `e|..|` → `#^|..|` — `#` nütramen mew kvme
- **Fentren** Export alias: module mew kvzaw welu tañi kvzaw

### v0.0.2 — Küme Tañi API & Machi _(24 Mar 2026)_

- **Fentren** `$` kvzaw arrays ka strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Fentren** Destructuring arrays, tuples ka tuples tañi kvzaw
- **Fentren** Index no (`arr[-1]` = feychi chi zugu)
- **Fentren** Machi asli — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Fentren** `^=`
- **Küme** Parser; documentación

### v0.0.1 — Kvzaw Küme _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4× wente, ~95% kvme)
- Kvzaw mew: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode, module, lambda, closure, kvzaw
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Wixal. Fentren. Ngäy Pülel.*

> **Dungukelu:** Kay kimün amukey rurasqa ka t'ikrasqa inteligencia artificial (IA) mew.
> Llapan llamk'ay rurasqa küme kaptin, wakin zugun icha techapyrã pantay kapun.
> Küme referencia: [Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
