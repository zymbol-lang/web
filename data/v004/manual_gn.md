# Zymbol-Lang Mba'eporã Ñe'ẽ

**Zymbol-Lang** peteĩ ñe'ẽ jehaipyre ñe'ẽtee rupi. Ndoipuruséi moñe'ẽrã — peteĩva símbolo. Ojejapo porã ñe'ẽ opaichagua rupi.

- Ndaipori moñe'ẽrã (`if`, `while`, `return` ndaiporiséi — añoite símbolo `?`, `@`, `<~`)
- Unicode opaite — réra opaichagua ñe'ẽme térã emoji 👋
- Ñe'ẽ ndojeporúi — código peteĩ ñe'ẽ opaichagua rupi

---

## Mba'eporu ha Mba'e'ỹva

```zymbol
x = 10              // mba'eporu (ijykekóva)
PI := 3.14159       // mba'e'ỹva (ndijykekóiva — mba'e oĩ ramo ojeheka)
réra = "Ana"
ijoja = #1          // porã hete
👋 := "Maitei"
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

## Mba'e Mba'eporu

| Mba'e          | Techapyrã           | Símbolo `#?` | Ñe'ẽporã                          |
|----------------|---------------------|--------------|-----------------------------------|
| Papapy         | `42`, `-7`          | `###`        | 64-bit                            |
| Papapy ñemi    | `3.14`, `1.5e10`    | `##.`        | Papapy pytũ ojeporúma             |
| Ñe'ẽ           | `"maitei"`          | `##"`        | Mbohapymi: `"Maitei {réra}"`      |
| Letra          | `'A'`               | `##'`        | Peteĩ letra Unicode               |
| Porã/Vai       | `#1`, `#0`          | `##?`        | NDOGUEREKÓVO papapy 1 ha 0        |
| Mba'epuru      | `[1, 2, 3]`         | `##]`        | Opaite mba'e peteĩ mba'e          |
| Tupla          | `(a, b)`            | `##)`        | Ñemoĩporã                         |
| Tupla réra     | `(x: 1, y: 2)`      | `##)`        | Ojeheka réra térã papapy rupi     |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Moñe'ẽrã ha Mboheryrã

```zymbol
>> "Maitei" ¶                    // ¶ térã \\ ojapo ñenguerã
>> "a=" a " b=" b ¶              // mba'e hetavéva juntepe
>> (arr$#) ¶                     // postfix oñeikotevẽ paréntesis

<< réra                          // ndaipori prompt — oike variable rupi
<< "Ne réra? " réra              // prompt ndive
```

> `¶` (AltGr+R teclado españolpe) térã `\\` oñeikotevẽ ñenguerã.

---

## Ñemoañete

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

## Ñe'ẽ

```zymbol
// Three concatenation forms
réra = "Ana"
n = 25

moñe'ẽ = "Maitei ", réra, "!"          // kõma — mba'eporu = térã :=
>> "Maitei " réra " nde papapy " n ¶   // juntepeguaréta — moñe'ẽrã >>
porã = "Maitei {réra}, nde papapy {n}" // mbohapymi — opaite apopyrãpe
```

```zymbol
s = "Maitei Yvy"
len = s$#                  // 10
sub = s$[0..6]             // "Maitei"  (tukuy mana)
has = s$? "Yvy"            // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["i":"I"]        // "MaIteI Yvy"
rep1 = s$~~["i":"I":1]     // "MaItei Yvy"  (ñawpaq N kama)
```

> `+` papapy añoite. Ñe'ẽ ndive ojapo jaikuaakuaáva `,`, juntepeguaréta, térã mbohapymi.

---

## Mba'epy Ñemboguata

```zymbol
x = 7

? x > 0 { >> "mbatéva" ¶ }

? x > 100 {
    >> "tuicha" ¶
} _? x > 0 {
    >> "mbatéva" ¶
} _? x == 0 {
    >> "nda'éi" ¶
} _ {
    >> "opáva" ¶
}
```

> Bloque `{ }` **oñeikotevẽ** peteĩ línea añoite ramo avei.

---

## Match

```zymbol
// Match papapy jukuita
papapy = 85
grado = ?? papapy {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Match ñe'ẽ ndive
sa'y = "pytãvai"
código = ?? sa'y {
    "pytãvai" : "#FF0000"
    "hovyũ"   : "#00FF00"
    _         : "#000000"
}

// Match oñemboguata (mba'e opaichagua)
temp = -5
estado = ?? temp {
    _? temp < 0  : "yhy"
    _? temp < 20 : "ro'y"
    _? temp < 35 : "aku"
    _            : "akuhẽ"
}
>> estado ¶    // → yhy

// Bloque ukupi
?? n {
    0       : { >> "nda'éi" ¶ }
    _? n < 0: { >> "opáva" ¶ }
    _       : { >> "mbatéva" ¶ }
}
```

---

## Ñembojere

```zymbol
@ i:0..4  { >> i " " }        // papapy jukuita:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ñemboheta ndive:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // oñemeẽva:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

yvyra = ["pakuri", "guavira", "yvapurũ"]
@ f:yvyra { >> f ¶ }         // opaite mba'epe array

@ c:"maitei" { >> c "-" }
>> ¶                          // → m-a-i-t-e-i-  (ñe'ẽ letra opavave)

@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> oñeguata
    ? i > 7 { @! }          // @! opáva
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Tukuy ñembojere
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Réra ñembojere (ukupi opáva)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Función

```zymbol
emboyke(a, b) { <~ a + b }
>> emboyke(3, 4) ¶    // → 7

mbohapymi(n) {
    ? n <= 1 { <~ 1 }
    <~ n * mbohapymi(n - 1)
}
>> mbohapymi(5) ¶    // → 120
```

Función **oĩva aparte** — ndohecháiva variable ipýre. Salida parámetro `<~` apaykachaña:

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

> Función `réra(params){ }` ndaha'éi mba'e ñemoĩ. Ojejapokuévo argumento: `x -> réra(x)`.

---

## Lambda ha Closure

```zymbol
mokõive = x -> x * 2
mboyke = (a, b) -> a + b
>> mokõive(5) ¶    // → 10
>> mboyke(3, 7) ¶  // → 10

// Lambda bloque ndive
ñemoñe = x -> {
    ? x > 0 { <~ "mbatéva" }
    _? x < 0 { <~ "opáva" }
    <~ "nda'éi"
}

// Closure — lambda oñangarekoséi variable ipýre
factor = 3
mbohapy = x -> x * factor    // oñangarekoséi 'factor'
>> mbohapy(7) ¶    // → 21

// Función ojapo función
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda mba'e ndive: oñeñotẽ array rupi
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Array

Arrays are **mutable** and hold elements of the **same type**. _(Mba'epuru **ijykekóva** ha ikatúva oñemboheryrã — mba'e peteĩ mba'epe añoite.)_

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — ojeheka (0-based)
arr[-1]         // 5 — índice vai (qipa)
arr$#           // 5 — papapy heta (oñeikotevẽ paréntesis >>pe)

arr = arr$+ 6            // mbojupi → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // índice 2 mbojupi
arr3 = arr$- 3           // ñawpaq valor mboguete
arr4 = arr$-- 3          // opaite valor mboguete
arr5 = arr$-[0]          // índice mboguete
arr6 = arr$-[1..3]       // jukuita mboguete (tukuy mana)

oĩ = arr$? 3             // #1 — oĩ
pos = arr$?? 3           // [2] — opaite índice
sl = arr$[0..3]          // [1,2,3] — trozo (tukuy mana)
sl2 = arr$[0:3]          // [1,2,3] — kikillan, papapyniw

asc = arr$^+             // wichay (primitivos kama)
desc = arr$^-            // oñemeẽva (primitivos kama)

// Réra/papapy tuple array — $^ comparador lambdawan
db = [(réra: "Carla", ára: 28), (réra: "Ana", ára: 25), (réra: "Bob", ára: 30)]
áramew  = db$^ (a, b -> a.ára < b.ára)
réramew = db$^ (a, b -> a.réra > b.réra)
>> áramew[0].réra ¶     // → Ana
>> réramew[0].réra ¶    // → Carla

// Elemento ñemoambue pytúpe (array añoite)
arr[1] = 99              // ñemoambue (asignar)
arr[0] += 5              // ñemoambue ñembojoajú: +=  -=  *=  /=  %=  ^=

// Ñemoambue funcional — oñemeẽ array pyahu; original ndoikuaái
arr2 = arr[1]$~ 99
```

> Opaite colección operador oñemeẽ **array pyahu** — oñembojupi: `arr = arr$+ 4`.
> Ndojejokóiva: mbohapy peteĩ ndive.
> `$^+` / `$^-` **primitivo array** (papapynak, ñe'ẽ). Tuple arraype `$^` comparador lambdawan — ñanqa lambdapi churasqa (`<` = wichay, `>` = oñemeẽva).

**Mba'e oĩ semantics** — array peteĩva oñemboheryrãvo ambuéva variablepe oñemoĩ copia sapykueráva:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ndoikuaái
```

```zymbol
// Ukupi array
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[1][2] ¶    // → 6
```

---

## Moñe'ẽrã

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ndoiporúi

// Papapy tupla
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Réra tupla
ava = (réra: "Ana", ára: 25, tetã: "Paraguái")
(réra: r, ára: a) = ava   // r="Ana"  a=25
```

---

## Tupla

Tuples are **immutable** ordered containers that can hold values of **different types**. Unlike arrays, elements cannot be changed after creation. _(Tupla **ndijykekóiva** — ikatúva oñemboheryrã mba'e opaichagua. Ndaha'éi array — elementi ndahekóiva oñemboambue oñemohendárõ.)_

```zymbol
// Papapy
punto = (10, 20)
>> punto[0] ¶    // → 10

mba'eporu = (42, "maitei", #1, 3.14)
>> mba'eporu[2] ¶     // → #1

// Réra ndive
ava = (réra: "Alice", ára: 25)
>> ava.réra ¶    // → Alice
>> ava[0] ¶      // → Alice  (índice avei ojogua)

// Ukupi
pos = (x: 10, y: 20)
p = (pos: pos, réra: "punta")
>> p.pos.x ¶        // → 10
```

**Ndijykekóiva** — ñemoambue tupla elementope mba'e vai oñemoĩ:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ mba'e vai: tupla ndijykekóiva
// t[0] += 5    // ❌ avei mba'e vai
```

Mba'e ñemoambue oñemoĩ haguã `$~` (ñemoambue funcional) — oñemeẽ tupla **pyahu**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original ndoikuaái
>> t2 ¶    // → (10, 999, 30)

// Tupla réra — oñemoĩ pyahu
ava = (réra: "Alice", ára: 25)
ava2 = (réra: ava.réra, ára: 26)
>> ava.ára ¶    // → 25
>> ava2.ára ¶   // → 26
```

---

## Función Tuvicha

> HOF operador oñeikotevẽ **lambda inline** — ndaha'éi variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

mokõivéva  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pares      = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
mboyke     = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Mbohapy peteĩ ndive huñiy
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Réra función HOF ipype — lambdawan hapiy
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Operador Tuvo

RHS siempre `_` placeholder oñeikotevẽ piped mba'eporu:

```zymbol
mokõive = x -> x * 2
emboyke = (a, b) -> a + b
mbojupi = x -> x + 1

5 |> mokõive(_)          // → 10
10 |> emboyke(_, 5)      // → 15
5 |> emboyke(2, _)       // → 7

// Oñembojere
r = 5 |> mokõive(_) |> mbojupi(_) |> mokõive(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Mba'e Vai Ñangareko

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "papapy peguarã mbói" ¶
} :! {
    >> "mba'e vai: " _err ¶    // _err mba'e vai moñe'ẽ waqaychan
} :> {
    >> "oguata opavave" ¶
}
```

| Mba'e       | Araka'e oiko           |
|-------------|------------------------|
| `##Div`     | Papapy peguarã mbói    |
| `##IO`      | Marandurenda / sistema |
| `##Index`   | Índice opáva           |
| `##Type`    | Mba'e vai              |
| `##Parse`   | Parsing                |
| `##Network` | Red mba'e vai          |
| `##_`       | Opaite mba'e vai       |

---

## Módulo

```zymbol
// Marandurenda: lib/calc.zy
# calc

#> { emboyke, get_PI }    // exportaciones ANTES definiciones

_PI := 3.14159
emboyke(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Marandurenda: main.zy
<# ./lib/calc <= c    // alias oñeikotevẽ

>> c::emboyke(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Réra pyahu moñe'ẽrã
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7  (réra _internal_add pakasqa)
```

---

## Papapa Mba'eporu

Zymbol ikuaa haguã papapa **Unicode papapa reko 69** — Devanagari, Arabe-India, Thai, Klingon pIqaD, Matemática Yvate, LCD ha ambuéva. Mba'eporu ojogua chupe `>>`-hendápe; papapa oĩporã binary rupive.

### Mba'eporu mbohovái

Emoñe'ẽ papapa `0` ha `9` mba'eporu apytégui `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabe-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII-pe ojevy
```

### Jehechaukaha ha boolean ñemombuku

```zymbol
x = 42
>> x ¶          // → 42   (ASCII rehe)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, papapa oñembosako'i
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Papapa asli kódigope

Papapa mba'eporu oĩporã literal — rangope, modulo, ojejuhu haguãicha:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal mba'eporu rupi

`#` + papapa `0` térã `1` bloc apytégui boolean literal oĩporã:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII** oĩporãva. `#0` (ñepyso) ojejuhu `0` (ñepyrusu papapa)gui.

---

## Operador Mba'ekuaa

```zymbol
// Ñe'ẽ papapypi tikray
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ndaipori mba'e vai)

// Peteĩtĩ / ch'iqtaña
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (mokõi decimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (ch'iqtaña)

// Papapy formato
fmt = #,|1234567|      // → 1,234,567  (kõma juntepe)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Base literal
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Base tikray moñe'ẽrãpeg
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Ñemongu'e

```zymbol
ára = <\ date +%Y-%m-%d \>     // stdout hap'iy (opaite \n hapikun)
>> "Ko ára: " ára

marandurenda = "data.txt"
tembiapo = <\ cat {marandurenda} \>      // interpolación comando ipype

lluqsiña = </"./subscript.zy"/>   // huk Zymbol marandurenda ojaporu, moñe'ẽ hap'iy
>> lluqsiña
```

> `><` CLI argumentonak ñe'ẽ array hina hap'iy (tree-walker kama).

---

## Techapyrã Oikoporã: FizzBuzz

```zymbol
moñeẽ(papapy) {
    ? papapy % 15 == 0 { <~ "PororóÑemuhũ" }
    _? papapy % 3  == 0 { <~ "Pororó" }
    _? papapy % 5  == 0 { <~ "Ñemuhũ" }
    _ { <~ papapy }
}

@ i:1..20 { >> moñeẽ(i) ¶ }
```

---

## Símbolo Rekotee

| Símbolo | Mba'épyguaréta    | Símbolo    | Mba'épyguaréta     |
|---------|-------------------|------------|--------------------|
| `=`     | mba'eporu         | `$#`       | papapy heta        |
| `:=`    | mba'e'ỹva         | `$+`       | mbojupi            |
| `>>`    | moñe'ẽrã          | `$+[i]`    | índicepe mbojupi   |
| `<<`    | mboheryrã         | `$-`       | ñawpaq mboguete    |
| `¶`/`\\` | ñenguerã         | `$--`      | opaite mboguete    |
| `?`     | porã              | `$-[i]`    | índice mboguete    |
| `_?`    | mba'e             | `$-[i..j]` | jukuita mboguete   |
| `_`     | vai / opavave     | `$?`       | oĩ                 |
| `??`    | match             | `$??`      | opaite índice      |
| `@`     | ñembojere         | `$[s..e]`  | trozo              |
| `@!`    | opáva             | `$>`       | map                |
| `@>`    | oñeguata          | `$\|`      | filter             |
| `->`    | lambda            | `$<`       | reduce             |
| `arr[i] = val` | ñemoambue elemento (array añoite) | `arr[i] += val` | ñemoambue ñembojoajú |
| `arr[i]$~` | ñemoambue funcional (copia pyahu) | `$^+` | wichay (primitivos) |
| `$^-`   | oñemeẽva (primitivos) | `$^`   | comparador (tuples) |
| `<~`    | oñemeẽ            | `!?`       | japoru             |
| `\|>`   | pipe              | `:!`       | ñangarekouka       |
| `#1`    | porã              | `:>`       | opavave            |
| `#0`    | vai               | `$!`       | mba'e vai          |
| `<#`    | mbojupi           | `$!!`      | mba'e vai mbohasa  |
| `#`     | módulo            | `#>`       | exportar           |
| `::`    | ojeiporeka        | `.`        | campo jeheka       |
| `#\|..\|` | papapy tikray   | `#?`       | tipo metadata      |
| `#.N\|..\|` | peteĩtĩ       | `#!N\|..\|` | ch'iqtaña        |
| `#,\|..\|` | kõma formato    | `#^\|..\|`  | científico         |
| `#d0d9#` | papapa mba'eporu ombohasa | `#09#` | ASCII-pe ojevy |
| `<\ ..\>` | shell ojaporu   | `><`       | CLI argumentonak   |

## Versión Rehegua

### v0.0.3 — Unicode Papapa & LSP Mbohovái _(Abril 2026)_

- **Ojeguereko** Unicode bloc 69 token `#d0d9#`
- **Ojeguereko** Boolean literals mba'eporu rupi — `#१` / `#०`, `#١` / `#٠`, ha ambuéva
- **Ojeguereko** Klingon pIqaD papapa (CSUR PUA U+F8F0–U+F8F9)
- **Ojeguereko** VM opcode `SetNumeralMode` — tree-walker ndive oñepyrũ
- **Ojeguereko** REPL papapa mba'eporu echo ha variable rehechaukaha
- **Oñembohasa** `>>` boolean `#` (`#0` / `#1`) mba'eporu oĩporãva rupi

### v0.0.2_01 — Operador Ñe'ẽ Pyahu _(30 Mar 2026)_

- **Oñembohasa** `c|..|` → `#,|..|` ha `e|..|` → `#^|..|`
- **Ojeguereko** Export alias: module mba'egua oje'e ambue ñe'ẽ rupive

### v0.0.2 — API Mbohovái & Mbosako'i _(24 Mar 2026)_

- **Ojeguereko** `$` operador arrays ha strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ojeguereko** Destructuring arrays, tuples ha tuples ñe'ẽ oĩva
- **Ojeguereko** Índice ñepyso (`arr[-1]` = mba'e paha)
- **Ojeguereko** Instalador — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Ojeguereko** `^=`
- **Oñemohenda** Parser; documentación

### v0.0.1 — Pehẽ Mboyve _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4× pya'e, ~95%)
- Oĩporãva: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode, module, lambda, closure, jejapo'i
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Símbolo. Opavave. Ndijykekóiva.*

> **Marandu:** Ko mba'eporã ojapo ha omboñe'ẽ inteligencia artificial (IA).
> Ojejapo ikatupyry peve, upéicha peteĩ ñe'ẽ térã techapyrã ikatu oñembokyje.
> Referencia real: [Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
