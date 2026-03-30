# Zymbol-Lang Hatun Qillqa

**Zymbol-Lang** huk rimay qillqa simiyuq. Mana rimaykunata apaykachan — llapan señalkunam. Llapan rumasimipeqa kikillanpim ruran.

- Mana rimaykunata (`if`, `while`, `return` mana kanchu — señalkuna `?`, `@`, `<~` kama)
- Unicode tukuy — sutikuna llapan simipeqa icha emoji 👋
- Mana simiman hap'ikuq — código llapan simipeqa kikillanmi

---

## Chanin Qillqakuna

```zymbol
x = 10              // chanin (tikrakuqmi)
PI := 3.14159       // chanin mana tikrakuq (mana tikrakunqa — pantayqa kanqa)
suti = "Ana"
kawsaq = #1         // chiqaq
👋 := "Napaykullayki"
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

## Imaymana Chaninkuna

| Klase          | Kayhinam             | Símbolo `#?` | Willakuy                            |
|----------------|----------------------|--------------|-------------------------------------|
| Yupay          | `42`, `-7`           | `###`        | 64-bit firmayuq                     |
| Chiru yupay    | `3.14`, `1.5e10`     | `##.`        | Qimichasqa yupay apaykachasqa       |
| Simi           | `"napaykullayki"`    | `##"`        | Qichwa: `"Napaykullayki {suti}"`    |
| Sillabiy       | `'A'`                | `##'`        | Huk Unicode sillabiy                |
| Chiqap/Mana    | `#1`, `#0`           | `##?`        | MANA 1 icha 0 yupay                 |
| Qipa           | `[1, 2, 3]`          | `##]`        | Llapan ima klasepin                 |
| Tupla          | `(a, b)`             | `##)`        | Churanapim                          |
| Sutiyuq tupla  | `(x: 1, y: 2)`       | `##)`        | Sutinpi icha yupaypi taripasqa      |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Lluksichiykuna ha Yaykuchiykuna

```zymbol
>> "Napaykullayki" ¶                // ¶ icha \\ muhu churan
>> "a=" a " b=" b ¶                 // achka imaymana huñisqa
>> (arr$#) ¶                        // postfix paréntesispi munasqa

<< suti                             // mana rimaywan — chaninta chayachispa
<< "Sutikiqa? " suti                // rimaywan
```

> `¶` (AltGr+R teclado españolpi) icha `\\` kikillanmi muhu churan.

---

## Ruwaq Rimaykunas

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

## Qillqakuna

```zymbol
// Three concatenation forms
suti = "Ana"
n = 25

willakuy = "Napaykullayki ", suti, "!"            // koma — chanin churaypi
>> "Napaykullayki " suti " yupayniyki " n ¶        // huñisqa — lluqsichiypi >>
rimay = "Napaykullayki {suti}, yupayniyki {n}"     // ukupi churachiysqa — imaymana chawpimpi
```

```zymbol
s = "Napaykullayki Pacha"
len = s$#                  // 19
sub = s$[0..11]            // "Napaykullayki"  (tukuy mana)
has = s$? "Pacha"          // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "NApAykullyAki PAchA"
rep1 = s$~~["a":"A":1]     // "NApaykullayki Pacha"  (ñawpaq N kama)
```

> `+` yupayllapiñam. Simiman apaykachaqqa `,`, huñisqa, icha ukupi churachiysqa apaykachay.

---

## Puriynin Kamachiy

```zymbol
x = 7

? x > 0 { >> "wichaypi" ¶ }

? x > 100 {
    >> "hatun" ¶
} _? x > 0 {
    >> "wichaypi" ¶
} _? x == 0 {
    >> "ch'uya" ¶
} _ {
    >> "uraypi" ¶
}
```

> Bloque `{ }` **munasqam** huk renglonlla kaqtinpis.

---

## Match

```zymbol
// Yupay juk'urkuna
yupay = 85
grado = ?? yupay {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Simi
kuluri = "puka"
código = ?? kuluri {
    "puka"  : "#FF0000"
    "q'umir": "#00FF00"
    _       : "#000000"
}

// Waqaychay
urqu = -5
kaqnin = ?? urqu {
    _? urqu < 0  : "chiri riti"
    _? urqu < 20 : "chiri"
    _? urqu < 35 : "q'uñi"
    _            : "nina"
}
>> kaqnin ¶    // → chiri riti

// Bloque ukuypi
?? n {
    0       : { >> "ch'uya" ¶ }
    _? n < 0: { >> "uraypi" ¶ }
    _       : { >> "wichaypi" ¶ }
}
```

---

## Muyuy

```zymbol
@ i:0..4  { >> i " " }        // yupay juk'urkuna:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // hatunchisqawan:     1 3 5 7 9
@ i:5..0:1 { >> i " " }       // uraypi:             5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

poqoy = ["ch'uño", "tunta", "papa"]
@ f:poqoy { >> f ¶ }         // llapan imaymana array

@ c:"suti" { >> c "-" }
>> ¶                          // → s-u-t-i-  (simi silabiykuna)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> rinqa
    ? i > 7 { @! }             // @! tukun
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

// Sutiyuq muyuy (ukupi tukukiy)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Ruray

```zymbol
yapuy(a, b) { <~ a + b }
>> yapuy(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Ruray **sapanmanta kanmi** — mana hawa chanin tarinchu. `<~` salida parámetrokuna apaykachay:

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

> Sutiyuq ruray mana chanin hina. Argumento cachaypi: `x -> ruray(x)`.

---

## Lambda ha Closure

```zymbol
iskayñiy = x -> x * 2
yapuy = (a, b) -> a + b
>> iskayñiy(5) ¶    // → 10
>> yapuy(3, 7) ¶    // → 10

// Lambda bloquepi
riqsinchiy = x -> {
    ? x > 0 { <~ "wichaypi" }
    _? x < 0 { <~ "uraypi" }
    <~ "ch'uya"
}

// Closure — lambda hawa chaninta hap'in
factor = 3
kimsa = x -> x * factor
>> kimsa(7) ¶    // → 21

// Ruray ruray
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Array ukupi
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Qipa

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — yaykuy (0-base)
arr[-1]         // 5 — mana puntapi (qipa)
arr$#           // 5 — yupay (paréntesis munasqa >>pi)

arr = arr$+ 6            // yapuy → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // índice 2pi churay
arr3 = arr$- 3           // ñawpaq valor qichuy
arr4 = arr$-- 3          // llapan valor qichuy
arr5 = arr$-[0]          // índice qichuy
arr6 = arr$-[1..3]       // juk'urkuna qichuy (tukuy mana)

has = arr$? 3            // #1 — kan
pos = arr$?? 3           // [2] — llapan índicekuna
sl = arr$[0..3]          // [1,2,3] — cortay (tukuy mana)
sl2 = arr$[0:3]          // [1,2,3] — kikillan, yupaywan

asc = arr$^+             // wichay ordenasqa  (primitivos kama)
desc = arr$^-            // uray ordenasqa    (primitivos kama)

// Sutiyuq/churanapim tupla arrays — $^ comparador lambdawan
db = [(suti: "Carla", watantin: 28), (suti: "Ana", watantin: 25), (suti: "Bob", watantin: 30)]
watantinpi  = db$^ (a, b -> a.watantin < b.watantin)
sutipi      = db$^ (a, b -> a.suti > b.suti)
>> watantinpi[0].suti ¶     // → Ana
>> sutipi[0].suti ¶         // → Carla

arr[1] = 99              // chanin tikray
arr = arr[1]$~ 99        // musuq array kutichiy
```

> Llapan colección ruwaqkuna **musuq array** kutichikankum. Yapuy: `arr = arr$+ 4`.
> Mana huñichiyta — iskay churaypi ruway.
> `$^+` / `$^-` **primitivo arrays** (yupay, simi) ordenan. Tupla arrayspi `$^` comparador lambdawan — ñanqa lambdapi churasqa (`<` = wichay, `>` = uray).

```zymbol
// Ukupi arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Rakichiy

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ mana munasqa

// Churanapim tupla
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Sutiyuq tupla
runa = (suti: "Ana", watantin: 25, llaqta: "Cusco")
(suti: s, watantin: w) = runa   // s="Ana"  w=25
```

---

## Tupla

```zymbol
// Churanapim
punto = (10, 20)
>> punto[0] ¶    // → 10

// Sutiyuq
runa = (suti: "Alice", watantin: 25)
>> runa.suti ¶      // → Alice
>> runa[0] ¶        // → Alice  (yupay kaqpis)

// Ukupi
pos = (x: 10, y: 20)
p = (pos: pos, suti: "punta")
>> p.pos.x ¶        // → 10
```

---

## Hatun Ruray

> HOF señalkuna **lambda inline** munankum — mana variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

iskayñisqa  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
iskay kuti  = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
llapan      = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Iskay churaypi huñiy
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Sutiyuq ruray HOF ukupi — lambdawan hapiy
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Tubu Ruwaq

RHS siempre `_` placeholder munasqa piped chanin:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Huñisqa
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Pantay Waqaychay

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "siphunwan mana ruwasqa" ¶
} :! {
    >> "huk pantay: " _err ¶    // _err pantay willakuyta waqaychan
} :> {
    >> "llapanpi purin" ¶
}
```

| Klase       | Kaypi kaqpim          |
|-------------|----------------------|
| `##Div`     | Siphunwan mana       |
| `##IO`      | Qillqa / sistema     |
| `##Index`   | Yupay hawapi         |
| `##Type`    | Klase pantay         |
| `##Parse`   | Parsing              |
| `##Network` | Red pantay           |
| `##_`       | Llapan pantay        |

---

## Módulo

```zymbol
// lib/calc.zy
# calc

#> { yapuy, get_PI }    // lluqsichiy ÑAWPAQ definiciones

_PI := 3.14159
yapuy(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — directo constante acceso mana
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias munasqa

>> c::yapuy(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Público sutiwan lluqsichiy
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7  (suti _internal_add pakasqa)
```

---

## Willaykunapa Ruwaqkuna

```zymbol
// Simi yupaypi tikray
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (mana pantay)

// Rutuy / cortay
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (iskay decimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (cortay)

// Yupay formato
fmt = #,|1234567|      // → 1,234,567  (koma huñisqa)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Base literal
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Base tikray lluqsichiypaq
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Tinkiykuy

```zymbol
fecha = <\ date +%Y-%m-%d \>     // stdout hap'iy (tukuypi \n hapikun)
>> "Kunan: " fecha

marandurenda = "data.txt"
contenido = <\ cat {marandurenda} \>      // interpolación comando ukupi

lluqsichiysqa = </"./subscript.zy"/>   // huk Zymbol qillqa ruwachiy, lluqsichiyta hap'iy
>> lluqsichiysqa
```

> `><` CLI argumentokunata simi array hina hap'in (tree-walker kama).

---

## Tukuy Kayhinam: FizzBuzz

```zymbol
riqsinchiy(yupay) {
    ? yupay % 15 == 0 { <~ "PhuyuWaqay" }
    _? yupay % 3  == 0 { <~ "Phuyu" }
    _? yupay % 5  == 0 { <~ "Waqay" }
    _ { <~ yupay }
}

@ i:1..20 { >> riqsinchiy(i) ¶ }
```

---

## Señal Rekotee

| Señal   | Ruray             | Señal      | Ruray              |
|---------|-------------------|------------|--------------------|
| `=`     | chanin            | `$#`       | yupay              |
| `:=`    | mana tikrakuq     | `$+`       | yapuy              |
| `>>`    | lluqsichiy        | `$+[i]`    | índicepi churay    |
| `<<`    | yaykuchiy         | `$-`       | ñawpaq qichuy      |
| `¶`/`\\` | muhu             | `$--`      | llapan qichuy      |
| `?`     | chiqapmi          | `$-[i]`    | índice qichuy      |
| `_?`    | icha              | `$-[i..j]` | juk'urkuna qichuy  |
| `_`     | mana / llapan     | `$?`       | kan                |
| `??`    | match             | `$??`      | llapan índicekuna  |
| `@`     | muyuy             | `$[s..e]`  | cortay             |
| `@!`    | tukuchiy          | `$>`       | map                |
| `@>`    | rinqa             | `$\|`      | filter             |
| `->`    | lambda            | `$<`       | reduce             |
| `$^+`   | wichay orden (primitivos) | `$^-` | uray orden (primitivos) |
| `$^`    | orden comparadorwan (tuplas) | | |
| `<~`    | kutimuy           | `!?`       | willachiy          |
| `\|>`   | pipe              | `:!`       | hap'iy             |
| `#1`    | chiqap            | `:>`       | llapanpi           |
| `#0`    | mana              | `$!`       | pantaymi           |
| `<#`    | yaykuchiy         | `$!!`      | pantay cachay      |
| `#`     | módulo            | `#>`       | lluqsichiy         |
| `::`    | módulo waqaychay  | `.`        | campo taripay      |
| `#\|..\|` | yupay tikray    | `#?`       | tipo metadata      |
| `#.N\|..\|` | rutuy         | `#!N\|..\|` | cortay           |
| `c\|..\|` | koma formato    | `e\|..\|`  | científico         |
| `<\ ..\>` | shell ruwachiy  | `><`       | CLI argumentokuna  |

---

*Zymbol-Lang — Señal. Llapan. Mana Tikrakuq.*

> **Willakuy:** Kay qillqa rurasqa hinallataq t'ikrasqa artificial intelligence (IA) nisqawan.
> Llapan llamk'ay rurasqa chiqap kaptin, wakin t'ikray icha techapyrã pantay kapun.
> Cheqaq referencia: [Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
