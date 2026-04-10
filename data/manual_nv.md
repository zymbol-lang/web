# Zymbol-Lang Naaltsoos

**Zymbol-Lang** łahgo saad olta' nahalinígíí. Doo ła' bizaad da — ła'í nahalin. Diné bizaad nídaaz dóó łahgo saad bee olta'.

- Doo ła' bizaad da (`if`, `while`, `return` — doo hólǫ́ da — ła'í nahalin: `?`, `@`, `<~`)
- Unicode nízaad — saad olta' Diné bizaad góne' dóó emoji 👋
- Łah bił nahalin — saad olta' t'áá ałtso saad bee hane'ígíí bił nahalin

---

## Saad dóó Doo Nahalin

```zymbol
x = 10                  // saad (nályééh)
PI := 3.14159           // doo nahalin (t'áá ákódaatʼéhígíí)
naaltsoos = "Ana"
ánółt'e = #1            // #1 = #1 (nídaaz)
👋 := "Yá'át'ééh"
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

## Saad Ádaat'éhígíí

| Ádaat'éhígíí     | Nahalin             | Symbol `#?` | Baa Hane'                           |
|------------------|---------------------|-------------|-------------------------------------|
| Namboo           | `42`, `-7`          | `###`       | 64-bit, nályééh                     |
| Namboo Nízaad    | `3.14`, `1.5e10`    | `##.`       | Łahgo namboo nahalin                |
| Naaltsoos        | `"yá'át'ééh"`       | `##"`       | Bił nahalin: `"Yá'át'ééh {saad}"`  |
| Ła' Saad         | `'A'`               | `##'`       | Ła' Unicode saad                    |
| #1/#0            | `#1`, `#0`          | `##?`       | Doo namboo da                       |
| Łah Siłtsooí     | `[1, 2, 3]`         | `##]`       | T'áá ałtso ádaat'éhígíí             |
| Tuple            | `(a, b)`            | `##)`       | Nahalin bił                         |
| Tuple Bił Nizin  | `(x: 1, y: 2)`      | `##)`       | Bizhi' dóó namboo bił               |

---

## Bił Haz'á dóó Bił Ninídá

```zymbol
>> "Yá'át'ééh" ¶                    // ¶ dóó \\ — ła'í nahalin
>> "a=" a " b=" b ¶                  // łah siłtsooí juxtaposition bił
>> (łah$#) ¶                        // postfix — ánóołt'e bił bił

<< saad                              // doo bizhi' da — saad bił ninídá
<< "Nízhi' dínídzaa? " saad         // bizhi' bił
```

> `¶` dóó `\\` — ła'í nahalin zis nahalin.

---

## Naaltsoos Bee Hane'

```zymbol
// Tìkan namboo
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (namboo tìkan)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (tìran)

// Sìpawm
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Tìkangkem
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Saad

```zymbol
// Táá' nahalinígíí — t'áá ałtso bił nahalin
saad = "Ana"
namboo = 25

msg = "Yá'át'ééh ", saad, "!"             // dah — = dóó := bił
>> "Yá'át'ééh " saad " namboo " namboo ¶  // juxtaposition — >> bił
bizhi' = "Yá'át'ééh {saad}, namboo {namboo}"  // bił nahalin — ła' bił
```

```zymbol
s = "Yá'át'ééh"
len = s$#                  // 9
sub = s$[0..3]             // "Yá'" (ke tìran)
has = s$? "át"             // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["á":"Á"]        // "YÁ'Át'ééh"
rep1 = s$~~["á":"Á":1]     // "YÁ'át'ééh"  (nì'aw pxey)
```

> **Baa hane'**: `+` namboo bił nahalin. Naaltsoos bił warning bił nahalin.

---

## Haa Yit'éego

```zymbol
x = 7

? x > 0 { >> "nídaaz" ¶ }

? x > 100 {
    >> "nízaad" ¶
} _? x > 0 {
    >> "nídaaz" ¶
} _? x == 0 {
    >> "t'áá áłtsé" ¶
} _ {
    >> "doo nídaaz da" ¶
}
```

Bił `{ }` — **t'áá ákót'é**, ła' nahalin bił.

---

## Match

```zymbol
// Match namboo bił
namboo = 85
ánółt'e = ?? namboo {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ánółt'e ¶    // → B

// Match naaltsoos bił
dah = "łichíʼí"
code = ?? dah {
    "łichíʼí"   : "#FF0000"
    "dootłʼizh" : "#00FF00"
    _           : "#000000"
}

// Match bił guard
atiin = -5
hózhó = ?? atiin {
    _? atiin < 0  : "hózhó doo"
    _? atiin < 20 : "sik'az"
    _? atiin < 35 : "deesdoi"
    _             : "iiʼni'"
}
>> hózhó ¶    // → hózhó doo

// Tìkangkem tìran (block arms)
?? n {
    0       : { >> "t'áá áłtsé" ¶ }
    _? n < 0: { >> "doo nídaaz da" ¶ }
    _       : { >> "nídaaz" ¶ }
}
```

---

## Naalyéhé

```zymbol
@ i:0..4  { >> i " " }        // 0 1 2 3 4  — inclusive
@ i:1..9:2 { >> i " " }       // step:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // nánísdzá: 5 4 3 2 1 0

namboo = 1
@ namboo <= 64 { namboo *= 2 }
>> namboo ¶                   // → 128  (while)

ch'iyáán = ["na'ahóóhai", "łóóʼ", "dibé"]
@ c:ch'iyáán { >> c ¶ }

@ s:"yá'át'ééh" { >> s "-" }
>> ¶                          // → y-á-'-á-t-'-é-é-h-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> — t'áá naalyéhé
    ? i > 7 { @! }             // @! — doo naalyéhé
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Doo naalyéhé
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

## Olta'í

```zymbol
nályééh(a, b) { <~ a + b }
>> nályééh(3, 4) ¶    // → 7

olta'í(namboo) {
    ? namboo <= 1 { <~ 1 }
    <~ namboo * olta'í(namboo - 1)
}
>> olta'í(5) ¶    // → 120
```

Olta'í lu **isolated scope** — doo łah bił da. Output `<~` munge:

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

> **Baa hane'**: Olta'í `name(params){ }` doo first-class da. Bił nahalin: `x -> name(x)`.

---

## Lambda dóó Olta'í

```zymbol
nízaad = x -> x * 2
łah = (a, b) -> a + b
>> nízaad(5) ¶    // → 10
>> łah(3, 7) ¶    // → 10

// Lambda bił { }
ánółt'e = x -> {
    ? x > 0 { <~ "nídaaz" }
    _? x < 0 { <~ "doo nídaaz da" }
    <~ "t'áá áłtsé"
}

// Closure — lambda bił nahalin outer vars
ádaat'éhígíí = 3
táá' = x -> x * ádaat'éhígíí
>> táá'(7) ¶    // → 21

// Olta'í bił lambda
make_nályééh(n) { <~ x -> x + n }
nályééh10 = make_nályééh(10)
>> nályééh10(5) ¶    // → 15

// Lambda łah siłtsooí bił
olta' = [x -> x+1, x -> x*2, x -> x*x]
>> olta'[2](5) ¶    // → 25
```

---

## Łah Siłtsooí

Arrays are **mutable** and hold elements of the **same type**. _(Łah siłtsooí **nályééh** dóó t'áá ałtso **ła' ádaat'éhígíí**.)_

```zymbol
łah = [1, 2, 3, 4, 5]

łah[0]          // 1 — index (0 bił nahalin)
łah[-1]         // 5 — ke index (tìpawm)
łah$#           // 5 — namboo (parens bił >> bił)

łah = łah$+ 6            // append → [1,2,3,4,5,6]
łah2 = łah$+[2] 99       // insert at index 2
łah3 = łah$- 3           // remove first value
łah4 = łah$-- 3          // remove all
łah5 = łah$-[0]          // remove at index
łah6 = łah$-[1..3]       // remove range (ke tìran)

hólǫ́ = łah$? 3            // #1 — contains
pos = łah$?? 3             // [2] — all indices
nahalin = łah$[0..3]       // [1,2,3] — slice (ke tìran)
sl2 = łah$[0:3]            // [1,2,3] — count-based syntax

asc = łah$^+              // sorted ascending  (primitives)
desc = łah$^-             // sorted descending (primitives)

// Tuple łah siłtsooí — $^ bił comparator lambda
db = [(bizhi': "Carla", namboo: 28), (bizhi': "Ana", namboo: 25), (bizhi': "Bob", namboo: 30)]
by_namboo = db$^ (a, b -> a.namboo < b.namboo)
by_bizhi' = db$^ (a, b -> a.bizhi' > b.bizhi')
>> by_namboo[0].bizhi' ¶     // → Ana
>> by_bizhi'[0].bizhi' ¶     // → Carla

// Nályééh (łah siłtsooí cha'an)
łah[1] = 99              // nályééh (assign)
łah[0] += 5              // ła' nahalin: +=  -=  *=  /=  %=  ^=

// Ła'í nahalin — naaltsoos nályééh; nayc doo nahalin da
łah2 = łah[1]$~ 99
```

> T'áá ałtso **naaltsoos nályééh** — bił ninídá: `łah = łah$+ 4`.
> Doo chaining da: łah nahalin bił bił.
> `$^+` / `$^-` — primitives. Tuple łah — `$^` bił lambda.

**Ła' ádaat'éhígíí** — łah siłtsooí ambé saad bił nahalinígíí yínółta' copia sapykueráva:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b doo nahalin da
```

```zymbol
// Nested łah siłtsooí
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Naasgó Áhóót'i'

```zymbol
// Łah siłtsooí
łah = [10, 20, 30, 40, 50]
[a, b, c] = łah              // a=10  b=20  c=30
[first, *rest] = łah         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ke tìng

// Positional tuple
point = (100, 200)
(px, py) = point             // px=100  py=200

// Named tuple
diné = (bizhi': "Ana", namboo: 25, nahalin: "Dinétah")
(bizhi': n, namboo: a) = diné   // n="Ana"  a=25
```

---

## Tuple

Tuples are **immutable** ordered containers that can hold values of **different types**. Unlike arrays, elements cannot be changed after creation. _(Tuple **doo nályééh da** — t'áá ałtso **ła' ádaat'éhígíí** bił nahalin. Łah siłtsooí bił nahalinígíí doo ła' nahalin da ts'o'ok ályaa.)_

```zymbol
// Positional
point = (10, 20)
>> point[0] ¶    // → 10

naaltsoos = (42, "yá'át'ééh", #1, 3.14)
>> naaltsoos[2] ¶     // → #1

// Named tuple
diné = (bizhi': "Shizhe'é", namboo: 25)
>> diné.bizhi' ¶    // → Shizhe'é
>> diné.namboo ¶    // → 25
>> diné[0] ¶        // → Shizhe'é (index bił nahalin)

// Nested
pos = (x: 10, y: 20)
p = (pos: pos, label: "Diné Bikéyah")
>> p.pos.x ¶        // → 10
```

**Doo nályééh da** — tuple ádaat'éhígíí nályééh doo hólǫ́ da:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ baa ntsídíkees: tuple doo nályééh da
// t[0] += 5    // ❌ bey kex
```

Ła' ádaat'éhígíí nályééh haguã `$~` apaykachaña (ła' nahalin) — **naaltsoos** tuple yínółta':

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← nayc doo nahalin da
>> t2 ¶    // → (10, 999, 30)

// Named tuple — yancuic ts'aak
diné = (bizhi': "Shizhe'é", namboo: 25)
diné2 = (bizhi': diné.bizhi', namboo: 26)
>> diné.namboo ¶    // → 25
>> diné2.namboo ¶   // → 26
```

---

## Olta'í Nízaadígíí

> HOF — **inline lambda** — doo lambda variable da.

```zymbol
nambooí = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

nízaad = nambooí$> (x -> x * 2)                // map  → [2,4,6…20]
łahgo = nambooí$| (x -> x % 2 == 0)            // filter → [2,4,6,8,10]
ałtso = nambooí$< (0, (acc, x) -> acc + x)     // reduce → 55

// Tatìng intermediates
step1 = nambooí$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Named function bił lambda
double(x) { <~ x * 2 }
r = nambooí$> (x -> double(x))    // ✅
```

---

## Bee Ná'ádleehí

RHS t'áá ákót'é **`_`** placeholder mì piped namboo:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Tatìng
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Baa Ntsídíkees

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Namboo bił doo nahalin da" ¶
} :! {
    >> "łahgo: " _err ¶
} :> {
    >> "t'áá ákót'é nahalin" ¶
}
```

| Ádaat'éhígíí | Haa Yit'éego                    |
|--------------|---------------------------------|
| `##Div`      | Namboo doo bił nahalin da       |
| `##IO`       | Naaltsoos / system              |
| `##Index`    | Index doo hólǫ́ da              |
| `##Type`     | Ádaat'éhígíí doo nahalin da     |
| `##Parse`    | Parsing doo nahalin da          |
| `##Network`  | Network doo nahalin da          |
| `##_`        | T'áá ałtso (catch-all)          |

---

## Olta' Binahalin

```zymbol
// Naaltsoos: lib/nályééh.zy
# nályééh

#> { łah, get_PI }    // Exports BEFORE definitions

_PI := 3.14159
łah(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Naaltsoos: main.zy
<# ./lib/nályééh <= n    // alias t'áá ákót'é

>> n::łah(5, 3) ¶    // → 8
pi = n::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Export bił pxey bizhi'
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7
```

---

## Łah Siłtsooí Naaltsoos

Zymbol bił haz'á **Unicode naaltsoos 69** — Devanagari, Arabi-India, Thai, Klingon pIqaD, Naaltsoos Nízaadígíí, LCD. Łah siłtsooí bił haz'á `>>`-di; naaltsoos binary.

### Naaltsoos bee hane'

Naaltsoos `0` dóó `9` `#…#`-di:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabi-India   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // ASCII-di naasgó
```

### Bił haz'á dóó boolean

```zymbol
x = 42
>> x ¶          // → 42

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # ASCII, naaltsoos yoołkaał
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Naaltsoos asli kodi-di

Naaltsoos literal — range, modulo:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal naaltsoos

`#` + naaltsoos `0` éí doodago `1` bloc boolean:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (doo) `0` (łah naaltsoos) yoołkaał.

---

## Naaltsoos Ná'ádleehí

```zymbol
// Namboo bił nahalin
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (doo tìhawnu da)

// Round / truncate
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncate)

// Namboo tìran
fmt = #,|1234567|  // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Base literals
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Base tìkangkem
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Bee Nahat'á

```zymbol
date = <\ date +%Y-%m-%d \>     // stdout (tìran \n)
>> "Díí jį': " date

file = "data.txt"
content = <\ cat {file} \>      // bił nahalin mì tìkan

output = </"./subscript.zy"/>   // Zymbol script, tìpawm output
>> output
```

> `><` CLI arguments sìpawm łah siłtsooí (tree-walker piko).

---

## Olta' Bił Hóló: FizzBuzz

```zymbol
nályééh(namboo) {
    ? namboo % 15 == 0 { <~ "DliʼDizí" }
    _? namboo % 3  == 0 { <~ "Dliʼ" }
    _? namboo % 5  == 0 { <~ "Dizí" }
    _ { <~ namboo }
}

@ i:1..20 { >> nályééh(i) ¶ }
```

---

## Nahalinígíí Ła'

| Symbol  | Olta'              | Symbol      | Olta'                  |
|---------|--------------------|-------------|------------------------|
| `=`     | Saad               | `$#`        | Namboo                 |
| `:=`    | Doo nahalin da     | `$+`        | Append                 |
| `>>`    | Bił haz'á          | `$+[i]`     | Insert at index        |
| `<<`    | Bił ninídá         | `$-`        | Remove first value     |
| `¶`/`\\` | Nahalin           | `$--`       | Remove all value       |
| `?`     | ? (if)             | `$-[i]`     | Remove at index        |
| `_?`    | _? (else if)       | `$-[i..j]`  | Remove range           |
| `_`     | _ (else/wildcard)  | `$?`        | Hólǫ́                   |
| `??`    | Match              | `$??`       | All indices            |
| `@`     | Naalyéhé           | `$[s..e]`   | Slice                  |
| `@!`    | @! (break)         | `$>`        | Map                    |
| `@>`    | @> (continue)      | `$\|`       | Filter                 |
| `->`    | Lambda             | `$<`        | Reduce                 |
| `$^+`   | Sort ascending     | `$^-`       | Sort descending        |
| `$^`    | Sort lambda        |             |                        |
| `<~`    | Return             | `!?`        | Try                    |
| `\|>`   | Pipe               | `:!`        | Catch                  |
| `#1`    | #1 (nídaaz)        | `:>`        | Finally                |
| `#0`    | #0 (doo nídaaz da) | `$!`        | Baa ntsídíkees         |
| `<#`    | Import             | `$!!`       | Propagate              |
| `#`     | Module declare     | `#>`        | Export                 |
| `::`    | Module call        | `.`         | Field access           |
| `#\|..\|` | Parse number    | `#?`        | Type metadata          |
| `#.N\|..\|` | Round         | `#!N\|..\|` | Truncate              |
| `#,\|..\|` | Comma format    | `#^\|..\|`   | Scientific             |
| `#d0d9#` | łah siłtsooí naaltsoos | `#09#` | ASCII-di naasgó |
| `<\ ..\>` | Shell exec      | `>\<`       | CLI args               |

## Naaltsoos Taalik

### v0.0.3 — Unicode Naaltsoos & LSP _(Abril 2026)_

- **Nayiiłtsooz** Unicode bloc 69 token `#d0d9#`
- **Nayiiłtsooz** Boolean literals — `#१` / `#०`, `#١` / `#٠`
- **Nayiiłtsooz** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Nayiiłtsooz** VM opcode `SetNumeralMode` — tree-walker
- **Nayiiłtsooz** REPL naaltsoos echo variable
- **Yiináá'** `>>` boolean `#` (`#0` / `#1`)

### v0.0.2_01 _(30 Mar 2026)_

- **Yiináá'** `c|..|` → `#,|..|` dóó `e|..|` → `#^|..|`
- **Nayiiłtsooz** Export alias

### v0.0.2 _(24 Mar 2026)_

- **Nayiiłtsooz** `$` arrays dóó strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Nayiiłtsooz** Destructuring arrays, tuples
- **Nayiiłtsooz** Index doo (`arr[-1]`)
- **Nayiiłtsooz** Instalar — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Nayiiłtsooz** `^=`

### v0.0.1 _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Nahalinígíí. Ła'. Doo Nahalin.*

> **Baa hane':** Naaltsoos éí AI yee ályaa dóó naaltsoos bee hane'. T'áá ákót'é nahalin hólǫ́ lá, nídí ła' nahalin dóó nahalinígíí doo t'áá ákót'é da.
> Bił nahalin: [Zymbol-Lang Specification](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
