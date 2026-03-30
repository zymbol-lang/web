# Parma Pitya Zymbol-Lang

**Zymbol-Lang** ná tengwesta tancalima. Quetta úva — ilqua ná tengwa. Ná same ilya lambe Eruo.

- Quetti úvë (`if`, `while`, `return` ú-nar — tengwi nér `?`, `@`, `<~`)
- Unicode ilya — essë ilya lambessë, ilyë emoji 👋
- Lambe-nurtalë — tengwesta same ilya lambessin

---

## Harya ar Carna Ne'

```zymbol
x = 10              // harya (imbë)
PI := 3.14159       // carna ne' (lá imbë — raxë cé imbëa)
essë = "Ana"
naimë = #1          // vórë ná
👋 := "Namárië"
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

## Nossë Cuilë

| Nossë           | Sanyë             | Tengwa `#?` | Notë                                |
|-----------------|-------------------|-------------|-------------------------------------|
| Nótë            | `42`, `-7`        | `###`       | 64-bit sinwa                        |
| Nótë pitya      | `3.14`, `1.5e10`  | `##.`       | Notë tiuca ná                       |
| Quetta          | `"namárië"`       | `##"`       | Lúmequenta: `"Namárië {essë}"`      |
| Tengwa          | `'A'`             | `##'`       | Minë Unicode tengwa                 |
| Vórë/Lá        | `#1`, `#0`        | `##?`       | Lá nótë minë ar nul                 |
| Rimba           | `[1, 2, 3]`       | `##]`       | Ilqua nossë same                    |
| Tuple           | `(a, b)`          | `##)`       | Anwa                                |
| Essëa Tuple     | `(x: 1, y: 2)`    | `##)`       | Essë ilyë nótë                      |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Quetë ar Hlara

```zymbol
>> "Namárië" ¶                  // ¶ ar \\ tirë lúmë autë
>> "a=" a " b=" b ¶             // rimba nótë — tanwë
>> (arr$#) ¶                    // tengwi nótë poQlu'

<< essë                         // ú-quenta — hlara harya
<< "Mana essëlya? " essë        // quenta
```

> `¶` ar `\\` — same lúmë autë.

---

## Carmar

```zymbol
// Arithmetic — use assignments
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

## Tengwesta

```zymbol
// Neldë nossë — ilqua tanwë
essë = "Ana"
n = 42

tengwë = "Namárië ", essë, "!"            // comma — in assignments
>> "Namárië " essë " lyen nótë " n ¶      // juxtaposition — in >>
quenta = "Namárië {essë}, lyen nótë {n}"  // interpolation — anywhere
```

```zymbol
s = "Namárië Elda"
len = s$#                  // 13
sub = s$[0..7]             // "Namárië"  (end exclusive)
has = s$? "Elda"           // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "NAmárië EldA"
rep1 = s$~~["a":"A":1]     // "NAmárië Elda"  (first N only)
```

> **Notë**: `+` nótëssen. Quettassen — raxë.

---

## Nurtalë

```zymbol
x = 7

? x > 0 { >> "poldë" ¶ }

? x > 100 {
    >> "alta" ¶
} _? x > 0 {
    >> "poldë" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "nurwa" ¶
}
```

> `{ }` — **poQlu'**, minë tengwesta.

---

## Match

```zymbol
// Match nótë
nótë2 = 85
patlh = ?? nótë2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match quetti
óla = "carnë"
tengwa2 = ?? óla {
    "carnë"  : "#FF0000"
    "laicë"  : "#00FF00"
    _        : "#000000"
}

// Match nurwi (guards)
ringa = -5
indo = ?? ringa {
    _? ringa < 0  : "helca"
    _? ringa < 20 : "ringa"
    _? ringa < 35 : "larca"
    _             : "urwa"
}
>> indo ¶    // → helca

// Statement form
?? n {
    0        : { >> "nul" ¶ }
    _? n < 0 : { >> "nurwa" ¶ }
    _        : { >> "poldë" ¶ }
}
```

---

## Lúvë

```zymbol
@ i:0..4  { >> i " " }        // range inclusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // with step:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

yávë = ["orne", "lossë", "nén"]
@ f:yávë { >> f ¶ }           // for-each array

@ c:"eldar" { >> c "-" }
>> ¶                          // → e-l-d-a-r-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> endë (continue)
    ? i > 7 { @! }             // @! caitë (break)
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Infinite loop
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Labeled loop
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Maquet

```zymbol
boqë(a, b) { <~ a + b }
>> boqë(3, 4) ¶    // → 7

nótëmaquet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * nótëmaquet(n - 1)
}
>> nótëmaquet(5) ¶    // → 120
```

Functions have **isolated scope** — they cannot read outer variables. Use output parameters `<~` to modify caller variables:

```zymbol
antanë(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
antanë(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> **Vórë**: Essëa maquet `essë(params){ }` — lá minë nótë.
> Hríva — yomë: `x -> essë(x)`.

---

## Lambda ar Nurta

```zymbol
tatya = x -> x * 2
boqë2 = (a, b) -> a + b
>> tatya(5) ¶    // → 10
>> boqë2(3, 7) ¶  // → 10

// Block lambda
carna2 = x -> {
    ? x > 0 { <~ "poldë" }
    _? x < 0 { <~ "nurwa" }
    <~ "nul"
}

// Closure — captures outer scope
tancal = 3
neldë = x -> x * tancal
>> neldë(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Rimbar

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — access (0-indexed)
arr[-1]         // 5 — negative index (last)
arr$#           // 5 — length (use (arr$#) in >>)

arr = arr$+ 6            // append → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insert at index 2
arr3 = arr$- 3           // remove first occurrence of value
arr4 = arr$-- 3          // remove all occurrences
arr5 = arr$-[0]          // remove at index
arr6 = arr$-[1..3]       // remove range (end exclusive)

has = arr$? 3            // #1 — contains
pos = arr$?? 3           // [2] — all indices of value
sl = arr$[0..3]          // [1,2,3] — slice (end exclusive)
sl2 = arr$[0:3]          // [1,2,3] — same, count-based syntax

asc = arr$^+             // sorted ascending  (primitives only)
desc = arr$^-            // sorted descending (primitives only)

// Essëa tuple arrays — use $^ with comparator lambda
db = [(essë: "Carla", loa: 28), (essë: "Ana", loa: 25), (essë: "Bob", loa: 30)]
by_loa  = db$^ (a, b -> a.loa < b.loa)
by_essë = db$^ (a, b -> a.essë > b.essë)
>> by_loa[0].essë ¶     // → Ana
>> by_essë[0].essë ¶    // → Carla

arr[1] = 99              // update in-place
arr = arr[1]$~ 99        // functional update — returns new array
```

> Ilqua collection ta' — **cuivëa rimba** — harya: `arr = arr$+ 4`.
> Lá tanwë: tatya harya.
> `$^+` / `$^-` sort **primitive arrays**. For tuple arrays use `$^` with a comparator lambda.

```zymbol
// Nested arrays
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Núta

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ discards

// Positional tuple
point = (100, 200)
(px, py) = point             // px=100  py=200

// Named tuple
Elda = (essë: "Ana", loa: 25, nórë: "Valinor")
(essë: n, loa: a) = Elda     // n="Ana"  a=25
```

---

## Tuplë

```zymbol
// Positional
point = (10, 20)
>> point[0] ¶    // → 10

// Named
Elda = (essë: "Alice", loa: 25)
>> Elda.essë ¶    // → Alice
>> Elda[0] ¶      // → Alice  (index also works)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, essë: "Tirion")
>> p.pos.x ¶        // → 10
```

---

## Maquet Alta

> HOF — **só lambda** — lá lambda nótë.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tatyar = nums$> (x -> x * 2)                // map  → [2,4,6…20]
aicë   = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ilqua  = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Chain via intermediates
step1 = nums$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named functions inside HOF — wrap in lambda
double(x) { <~ x * 2 }
r = nums$> (x -> double(x))    // ✅
```

---

## Yulda Carma

The RHS always requires `_` as a placeholder for the piped value:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Chained
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Raxë Nurta

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "nul nótë" ¶
} :! {
    >> "raxë: " _err ¶    // _err holds the error message
} :> {
    >> "ilya lúmë" ¶
}
```

| Nossë       | Lúmë                           |
|-------------|--------------------------------|
| `##Div`     | Nul nótë                       |
| `##IO`      | Parma / quendë                 |
| `##Index`   | Nótë andë                      |
| `##Type`    | Nossë raxë                     |
| `##Parse`   | Tanwë raxë                     |
| `##Network` | Tengwë raxë                    |
| `##_`       | Ilya raxë                      |

---

## Tanwesta

```zymbol
// Parma: lib/calc.zy
# calc

#> { boqë, get_PI }    // Nob MINË — definitions vo' qaSpa'

_PI := 3.14159
boqë(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Parma: main.zy
<# ./lib/calc <= c    // Essë poQlu'

>> c::boqë(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Export with a different public name
# mylib
#> { _internal_boqë <= boqë }

_internal_boqë(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::boqë(3, 4) ¶    // → 7
```

---

## Nótë Carmar

```zymbol
// Parse string to number
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (fail-safe, no error)

// Round / truncate
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (round to 2 decimal places)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncate)

// Number formatting
fmt = #,|1234567|      // → 1,234,567  (comma-separated)
sci = #^|12345.678|    // → 1.2345678e4  (scientific)

// Base literals
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Base conversion output
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Yulmë

```zymbol
ré = <\ date +%Y-%m-%d \>      // captures stdout (includes trailing \n)
>> "Sí: " ré

parma = "data.txt"
quenta = <\ cat {parma} \>     // interpolation in commands

nob = </"./subscript.zy"/>     // execute another Zymbol script, capture output
>> nob
```

> `><` captures CLI arguments as a string array (tree-walker only).

---

## Naná Sanyë: FizzBuzz

```zymbol
carna(nótë) {
    ? nótë % 15 == 0 { <~ "CalëMorë" }
    _? nótë % 3  == 0 { <~ "Calë" }
    _? nótë % 5  == 0 { <~ "Morë" }
    _ { <~ nótë }
}

@ i:1..20 { >> carna(i) ¶ }
```

---

## Tengwi Tirë

| Tengwa   | Moj                | Tengwa     | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | harya              | `$#`       | rimba                 |
| `:=`     | carna ne'          | `$+`       | boqë                  |
| `>>`     | quetë              | `$+[i]`    | insert                |
| `<<`     | hlara              | `$-`       | telë (nótë)           |
| `¶`/`\`  | lúmë autë          | `$--`      | telë ilya             |
| `?`      | námo (if)          | `$-[i]`    | telë Daq              |
| `_?`     | ar-námo (elif)     | `$-[i..j]` | telë Dara'            |
| `_`      | ar / ilya          | `$?`       | harya                 |
| `??`     | match              | `$??`      | Hoch Daq tu'          |
| `@`      | lúvë               | `$[s..e]`  | pitya                 |
| `@!`     | caitë (break)      | `$>`       | map                   |
| `@>`     | endë (continue)    | `$\|`      | filter                |
| `->`     | Lambda             | `$<`       | reduce                |
| `$^+`    | sort ascending     | `$^-`      | sort descending       |
| `$^`     | sort comparator    |            |                       |
| `<~`     | anna               | `!?`       | temë (try)            |
| `\|>`    | Pipe               | `:!`       | nurta (catch)         |
| `#1`     | vórë               | `:>`       | ilya (finally)        |
| `#0`     | lá                 | `$!`       | raxë ná               |
| `<#`     | hlara (import)     | `$!!`      | raxë nob              |
| `#`      | tanwesta essë      | `#>`       | nob (export)          |
| `::`     | tanwesta maquet    | `.`        | field access          |
| `#\|..\|` | parse number      | `#?`       | type metadata         |
| `#.N\|..\|` | round           | `#!N\|..\|` | truncate            |
| `c\|..\|` | comma format      | `e\|..\|`  | scientific            |
| `<\ ..\>` | shell exec        | `>\<`      | CLI args              |

---

*Zymbol-Lang — Tengwesta. Ilya. Lá imbë.*

> **Notë:** Parma sina carna ar quenta AI (tancalë maquetë).
> Ilya carna ná, mal neldë quetti ar sanyë raxë haryan.
> Tancalëa parma [Zymbol-Lang tengwesta](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
