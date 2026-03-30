# Zymbol-Lang Yama Pë

**Zymbol-Lang** yanomami yama pë thë. Yamaki pë haya — nowë pë yamaki. Yanomami yama pë kë thëpë.

- Nowë yamaki pë haya (`?`, `@`, `<~` — nowë thëpë `if`, `while`, `return` kë haya)
- Unicode thëpë — yamaki pë nowë mîna emoji 👋
- Yanomami yama pë kë — yamaki pë nowë thëpë haya

---

## Yamaki mîna Kami Pë

```zymbol
yama = 10           // yamaki (thëpë — nowë)
MAHI := 3.14159     // kami (nowë — kami pë thëpë)
nowë = "Yanomami"
thëpë = #1          // kami nowë #1
👋 := "Kë"
```

```zymbol
yama = 10
yama += 5    // 15
yama -= 3    // 12
yama *= 2    // 24
yama /= 3    // 8
yama %= 3    // 2
yama ^= 2    // 4
yama++       // 5
yama--       // 4
```

---

## Nowë Yamaki

| Nowë            | Thëpë               | Kami `#?` | Yamaki pë                          |
|-----------------|---------------------|------------|------------------------------------|
| Yama            | `42`, `-7`          | `###`      | 64-bit nowë                        |
| Thëpë Yama      | `3.14`, `1.5e10`    | `##.`      | Nowë yamaki OK                     |
| Pë Nowë         | `"kë"`              | `##"`      | Yamaki pë: `"Kë {nowë}"`          |
| Mîna Pë         | `'A'`               | `##'`      | Nowë mîna Unicode                  |
| Kami            | `#1`, `#0`          | `##?`      | Haya nowë 1 mîna 0                 |
| Yamaki Pë       | `[1, 2, 3]`         | `##]`      | Nowë thëpë yamaki pë               |
| Tuple           | `(a, b)`            | `##)`      | Nowë yamaki                        |
| Nowë Tuple      | `(x: 1, y: 2)`      | `##)`      | Yamaki pë nowë mîna yama           |

```zymbol
// Nowë yamaki — thëpë (nowë, yama, thëpë)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Poremai mîna Mahi

```zymbol
>> "Kë, Yanomami!" ¶                   // ¶ mîna \\ nowë thëpë
>> "yama=" yama " nowë=" nowë ¶        // yamaki pë thëpë nowë
>> (mahipë$#) ¶                        // nowë postfix kami pë

<< nowë                                // haya kami — yamaki
<< "Nowë pë? " nowë                    // kami thëpë
```

> `¶` mîna `\\` — nowë thëpë yamaki.

---

## Ynopers

```zymbol
// Nowë yama — yamaki mîna
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (yama kami)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (nowë yama)

// Thëpë kami
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Yamaki nowë
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Ynostr

```zymbol
// Nowë thëpë — yamaki pë mîna kami
nowë = "Yanomami"
yama = 42

pë = "Kë, ", nowë, "!"                 // kami nowë — yamaki = mîna :=
>> "Kë " nowë " yama " yama ¶          // thëpë nowë — poremai >>
yamaki = "Kë {nowë}, yama {yama}"      // yamaki — nowë thëpë
```

```zymbol
s = "Kë Yanomami"
len = s$#                  // 12
sub = s$[0..2]             // "Kë"  (nowë thëpë)
has = s$? "Yanomami"       // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "Kë YAnomAmi"
rep1 = s$~~["a":"A":1]     // "Kë YAnomami"
```

> **Kami**: `+` nowë yama pë. Pë nowë yamaki thëpë.

---

## Thëpë

```zymbol
yama = 7

? yama > 0 { >> "nowë" ¶ }

? yama > 100 {
    >> "mahipë" ¶
} _? yama > 0 {
    >> "nowë" ¶
} _? yama == 0 {
    >> "kami" ¶
} _ {
    >> "haya" ¶
}
```

> Nowë `{ }` — **kami thëpë**, mîna nowë yamaki.

---

## Match

```zymbol
// Match nowë yamaki
yama = 85
thëpë = ?? yama {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> thëpë ¶    // → B

// Match pë nowë
yamaki = "kë"
nowë = ?? yamaki {
    "kë"    : "#FF0000"
    "thëpë" : "#00FF00"
    _        : "#000000"
}

// Match kami nowë
pë = -5
kami = ?? pë {
    _? pë < 0  : "nowë kami"
    _? pë < 20 : "haya"
    _? pë < 35 : "thëpë"
    _           : "mahipë"
}
>> kami ¶    // → nowë kami

// Match nowë (kami thëpë)
?? n {
    0       : { >> "kami" ¶ }
    _? n < 0: { >> "haya" ¶ }
    _       : { >> "nowë" ¶ }
}
```

---

## Yama

```zymbol
@ i:0..4  { >> i " " }        // nowë yamaki:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // yamaki kami:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // haya yamaki:  5 4 3 2 1 0

yama = 1
@ yama <= 64 { yama *= 2 }
>> yama ¶                     // → 128  (thëpë)

mahipë = ["kë", "thëpë", "nowë"]
@ pë:mahipë { >> pë ¶ }       // nowë yamaki pë

@ mîna:"kë" { >> mîna "-" }
>> ¶                          // → k-ë-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> nowë
    ? i > 7 { @! }             // @! kami
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Yama kami
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Yama nowë (kami naasad)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Poremai Thëpë

```zymbol
poremai(mahi, nowë) { <~ mahi + nowë }
>> poremai(3, 4) ¶    // → 7

kami(yama) {
    ? yama <= 1 { <~ 1 }
    <~ yama * kami(yama - 1)
}
>> kami(5) ¶    // → 120
```

Poremai thëpë nowë — **haya yamaki** — jã kira ome. Hut'unn `<~` yamaki thëpë:

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

> **Kami**: Poremai `nowë(mahi){ }` haya nowë yamaki.
> Yamaki thëpë: `yama -> nowë(yama)`.

---

## Lambda mîna Nowë

```zymbol
thëpë = yama -> yama * 2
kami = (mahi, nowë) -> mahi + nowë
>> thëpë(5) ¶    // → 10
>> kami(3, 7) ¶  // → 10

// Lambda kami nowë
nowë_kami = yama -> {
    ? yama > 0 { <~ "nowë" }
    _? yama < 0 { <~ "haya" }
    <~ "kami"
}

// Yamaki nowë — lambda kami thëpë
mahi = 3
thëpë_kami = yama -> yama * mahi
>> thëpë_kami(7) ¶    // → 21

// Poremai yamaki
make_kami(yama) { <~ mîna -> mîna + yama }
kami10 = make_kami(10)
>> kami10(5) ¶    // → 15

// Lambda nowë: yamaki pë
mahi_pë = [yama -> yama+1, yama -> yama*2, yama -> yama*yama]
>> mahi_pë[2](5) ¶    // → 25
```

---

## Mahipë

```zymbol
mahipë = [1, 2, 3, 4, 5]

mahipë[0]          // 1 — yamaki (0-nowë)
mahipë[-1]         // 5 — kami nowë (pari)
mahipë$#           // 5 — nowë (kami pë >>)

mahipë = mahipë$+ 6            // kami → [1,2,3,4,5,6]
mahipë2 = mahipë$+[2] 99       // kami índice 2
mahipë3 = mahipë$- 3           // haya wanee
mahipë4 = mahipë$-- 3          // haya tuláakal
mahipë5 = mahipë$-[0]          // haya índice
mahipë6 = mahipë$-[1..3]       // haya rango (nowë thëpë)

has = mahipë$? 3               // #1 — thëpë nowë
pos = mahipë$?? 3              // [2] — nowë kami
sl = mahipë$[0..3]             // [1,2,3] — yamaki (nowë thëpë)
sl2 = mahipë$[0:3]             // [1,2,3] — yama nowë

asc = mahipë$^+                // nowë yamaki (naas solus)
desc = mahipë$^-               // haya yamaki (naas solus)

// Nowë Tuple — hut'unn $^ mîna lambda
db = [(nowë: "Carla", yama: 28), (nowë: "Ana", yama: 25), (nowë: "Bob", yama: 30)]
by_yama = db$^ (a, b -> a.yama < b.yama)
by_nowë = db$^ (a, b -> a.nowë > b.nowë)
>> by_yama[0].nowë ¶     // → Ana
>> by_nowë[0].nowë ¶     // → Carla

mahipë[1] = 99              // yamaki nowë
mahipë = mahipë[1]$~ 99     // nowë mahipë — thëpë nowë
```

> `$+`, `$-`, `$[..]` — **nowë mahipë** thëpë — yamaki: `mahipë = mahipë$+ 4`.
> Haya kami: nowë yamaki thëpë.
> `$^+` / `$^-` nowë **naas solus**. Nowë Tuple — hut'unn `$^` mîna lambda.

```zymbol
// Mahipë naasad
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Ynodst

```zymbol
// Mahipë
mahipë = [10, 20, 30, 40, 50]
[a, b, c] = mahipë              // a=10  b=20  c=30
[first, *rest] = mahipë         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ nowë kami

// Tuple yama
point = (100, 200)
(px, py) = point                // px=100  py=200

// Nowë Tuple
person = (nowë: "Ana", yama: 25, city: "Yanomami")
(nowë: n, yama: a) = person     // n="Ana"  a=25
```

---

## Tuple

```zymbol
// Nowë yamaki
point = (10, 20)
>> point[0] ¶    // → 10

// Nowë
yanomami = (nowë: "Alice", yama: 25)
>> yanomami.nowë ¶    // → Alice
>> yanomami[0] ¶      // → Alice  (yamaki thëpë)

// Naasad
pos = (x: 10, y: 20)
p = (pos: pos, label: "yanomami")
>> p.pos.x ¶        // → 10
```

---

## Urihipë Poremai

> Nowë thëpë — **lambda kami** — haya nowë yamaki.

```zymbol
yama_pë = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

thëpë_pë = yama_pë$> (yama -> yama * 2)                // map → [2,4,6…20]
nowë_pë  = yama_pë$| (yama -> yama % 2 == 0)           // filter → [2,4,6,8,10]
kami_pë  = yama_pë$< (0, (nowë, yama) -> nowë + yama)  // reduce → 55

// Nowë wanee
step1 = yama_pë$| (yama -> yama > 3)
step2 = step1$> (yama -> yama * yama)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Poremai naasad — kami lambda
poremai2(yama) { <~ yama * 2 }
r = yama_pë$> (yama -> poremai2(yama))    // ✅
```

---

## Ynopipe

Ibac thëpë yamaki `_` nowë kami:

```zymbol
thëpë = yama -> yama * 2
kami = (mahi, nowë) -> mahi + nowë
inc = yama -> yama + 1

5 |> thëpë(_)        // → 10
10 |> kami(_, 5)     // → 15
5 |> kami(2, _)      // → 7

// Naasad
r = 5 |> thëpë(_) |> inc(_) |> thëpë(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kami

```zymbol
!? {
    yama = 10 / 0
} :! ##Div {
    >> "Kami nowë haya" ¶
} :! {
    >> "Kami thëpë: " _err ¶    // _err nowë kami
} :> {
    >> "Nowë kami thëpë" ¶
}
```

| Nowë        | Kami thëpë                      |
|-------------|----------------------------------|
| `##Div`     | Kami nowë haya                   |
| `##IO`      | Yamaki / Thëpë                   |
| `##Index`   | Yama haya nowë                   |
| `##Type`    | Kami nowë thëpë                  |
| `##Parse`   | Yamaki kami                      |
| `##Network` | Nowë yamaki kami                 |
| `##_`       | Nowë kami thëpë (catch-all)      |

---

## Yamaki Nowë

```zymbol
// lib/kami.zy
# kami

#> { poremai, get_MAHI }    // Nowë thëpë HAYA yamaki

_MAHI := 3.14159
poremai(mahi, nowë) { <~ mahi + nowë }
get_MAHI() { <~ _MAHI }
```

```zymbol
// nowë.zy
<# ./lib/kami <= k    // Kami nowë

>> k::poremai(5, 3) ¶  // → 8
mahi = k::get_MAHI()
>> mahi ¶               // → 3.14159
```

```zymbol
// Outka nowë naas
# mylib
#> { _ibac_poremai <= ibac }

_ibac_poremai(mahi, nowë) { <~ mahi + nowë }
```

```zymbol
<# ./mylib <= m

>> m::ibac(3, 4) ¶    // → 7
```

---

## Ynodatops

```zymbol
// Bora yama sünain nowë
v1 = #|"42"|      // → 42  (Yama)
v2 = #|"3.14"|    // → 3.14  (Thëpë Yama)
v3 = #|"abc"|     // → "abc"  (haya kami)

// Thëpë / kami
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kami)

// Yamaki yama
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Naas yama
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Thëpë naas
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ynoshell

```zymbol
date = <\ date +%Y-%m-%d \>     // kami stdout (mîna nowë thëpë)
>> "Yama: " date

thëpë = "data.txt"
content = <\ cat {thëpë} \>     // yamaki nowë thëpë

output = </"./sub.zy"/>         // poremai zy nowë, mahi
>> output
```

> `><` mahi CLI nowë yamaki pë (nowë solus).

---

## Thëpë Yama: FizzBuzz

```zymbol
poremai(mahi) {
    ? mahi % 15 == 0 { <~ "HuuReha" }
    _? mahi % 3  == 0 { <~ "Huu" }
    _? mahi % 5  == 0 { <~ "Reha" }
    _ { <~ mahi }
}

@ i:1..20 { >> poremai(i) ¶ }
```

---

## Nowë Pë Yamaki

| Kami    | Thëpë              | Kami         | Thëpë                 |
|---------|--------------------|--------------|------------------------|
| `=`     | Yamaki             | `$#`         | Nowë                  |
| `:=`    | Kami               | `$+`         | Kami nowë             |
| `>>`    | Poremai            | `$+[i]`      | Kami índice           |
| `<<`    | Mahi               | `$-`         | Haya yama             |
| `¶`/`\\`| Nowë thëpë         | `$--`        | Haya tuláakal         |
| `?`     | Thëpë (if)         | `$-[i]`      | Haya índice           |
| `_?`    | Nowë thëpë (elif)  | `$-[i..j]`   | Haya rango            |
| `_`     | Kami / nowë yamaki | `$?`         | Thëpë nowë            |
| `??`    | match              | `$??`        | Nowë kami             |
| `@`     | Yama               | `$[s..e]`    | Yamaki nowë           |
| `@!`    | Kami (break)       | `$>`         | map                   |
| `@>`    | Thëpë (continue)   | `$\|`        | filter                |
| `->`    | Lambda             | `$<`         | reduce                |
| `$^+`   | Nowë yamaki        | `$^-`        | Haya yamaki           |
| `$^`    | Yamaki lambda      |              |                       |
| `<~`    | Yamaki (return)    | `!?`         | Kami thëpë (try)      |
| `\|>`   | Pipe               | `:!`         | Nowë kami (catch)     |
| `#1`    | Kami thëpë         | `:>`         | Nowë (finally)        |
| `#0`    | Haya               | `$!`         | Kami thëpë            |
| `<#`    | Mahi               | `$!!`        | Kami nowë             |
| `#`     | Nowë yamaki        | `#>`         | Poremai               |
| `::`    | Nowë poremai       | `.`          | Yamaki nowë           |
| `#\|..\|`| Bora yama        | `#?`         | Nowë yamaki naas      |
| `#.N\|..\|`| Thëpë          | `#!N\|..\|`  | Kami                  |
| `c\|..\|`| Yamaki comma     | `e\|..\|`    | Naas'ika              |
| `<\ ..\>`| Shell poremai    | `>\<`        | CLI nowë              |

---

*Zymbol-Lang — Nowë. Thëpë. Kami Pë.*

> **Kami pë:** Yamaki nowë pë thëpë AI (nowë kami) mîna thëpë. Nowë yamaki kami pë thëpë, mîna kami nowë thëpë.
> Nowë kami thëpë [Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
