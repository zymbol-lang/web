# Zymbol-Lang Aküjawaa

**Zymbol-Lang** süpüla aküjalin wayuunaiki. Nnojolüin tü aküjaliakat — pütchi anüikat pümüin. Wayuunaiki aküjaa süpüla tü pütchiikat.

- Nnojolüin aküjaliaka (`if`, `while`, `return` nnojolüin — pütchi anüikat `?`, `@`, `<~`)
- Wayuunaiki kepiain — aküjalin sünain wayuunaiki o emoji 👋
- Aküjaliaka sünain outka — tü pütchiikat sünainjee wayuunaiki

---

## Pütchi mîna Nnojolüin Paainjüin

```zymbol
x = 10           // Pütchi (achikirawaa)
PI := 3.14159    // Nnojolüin paainjüin (nnojolüin achikiraain — pütchi sünain kachon)
suulu = "Wayuu"
wanee = #1       // pütchi anüikat wanee
👋 := "Jamaya"
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

## Kasa Pütchi

| Kasa            | Süchiki             | Symbol `#?`  | Aküjaa                              |
|-----------------|---------------------|--------------|-------------------------------------|
| Akumajaa        | `42`, `-7`          | `###`        | 64-bit sünain                       |
| Pütchi Akumajaa | `3.14`, `1.5e10`    | `##.`        | Pütchi anüikat aküjain              |
| Pütchirua       | `"jamaya"`          | `##"`        | Aküjaa: `"Jamaya {suulu}"`          |
| Pütchi Wanee    | `'A'`               | `##'`        | Wanee pütchi unicode                |
| Pütchi Anüikat  | `#1`, `#0`          | `##?`        | NNOJOLÜIN akumajaa 1 o 0            |
| Pütchiirua      | `[1, 2, 3]`         | `##]`        | Kasa sünainjee                      |
| Tuple           | `(a, b)`            | `##)`        | Pütchi akumajaa                     |
| Tuple Suulu     | `(x: 1, y: 2)`      | `##)`        | Aküjaa sünain suulu o akumajaa      |

```zymbol
// Kasa süchiki — bora (kasa, akumajaa, süchiki)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Ayaawataa mîna Ekirajaa

```zymbol
>> "Jamaya" ¶                       // ¶ o \\ pütchi jüpüla
>> "a=" a " b=" b ¶                 // pütchi jünüin sünain jüpüshua
>> (pütchiirua$#) ¶                 // postfix süpüla parantesis

<< suulu                            // nnojolüin pütchi — ekirajaa sünain pütchi
<< "Tü suuluka? " suulu             // sünain pütchi
```

> `¶` o `\\` wayuunaiki sünain jüpüla.

---

## Wyrops

```zymbol
// Akumajaa aküjaa — pütchi sünain
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (akumajaa wanee)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (akumajaa naas)

// Kasa süchiki
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Aküjaa wayuunaiki
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Waystryn

```zymbol
// Wayuu müshi sünain — wanee sünain süchikua
suulu = "Wayuu"
n = 42

pütchi = "Jamaya ", suulu, "!"           // comma — sünain = o :=
>> "Jamaya " suulu " süpüla " n ¶        // jüpüshua — sünain ayaawataa >>
aküja = "Jamaya {suulu}, süpüla {n}"     // aküjaa — sünain outka
```

```zymbol
s = "Jamaya Wayuu"
len = s$#                  // 12
sub = s$[0..6]             // "Jamaya"  (nnojolüin süchiki)
has = s$? "Wayuu"          // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "JAmAyA WAyuu"
rep1 = s$~~["a":"A":1]     // "JAmaya Wayuu"
```

> **Aküjaa**: `+` süpüla akumajaa pümüin. Pütchiirua sünain pütchi jüpüshua.

---

## Kasain

```zymbol
x = 7

? x > 0 { >> "anüikat" ¶ }

? x > 100 {
    >> "wayuu" ¶
} _? x > 0 {
    >> "anüikat" ¶
} _? x == 0 {
    >> "süchon" ¶
} _ {
    >> "nnojolüin" ¶
}
```

> Pütchi `{ }` **süpüla**, wanee sünain aküjaa.

---

## Match

```zymbol
// Match sünain pütchi akumajaa
akumajaa = 85
pütchi = ?? akumajaa {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> pütchi ¶    // → B

// Match sünain pütchirua
wanüiki = "wayuu"
kasa = ?? wanüiki {
    "wayuu"   : "#FF0000"
    "anüikat" : "#00FF00"
    _         : "#000000"
}

// Match sünain kasain
temp = -5
kasa = ?? temp {
    _? temp < 0  : "kachon"
    _? temp < 20 : "wayuu"
    _? temp < 35 : "anüikat"
    _            : "wanee"
}
>> kasa ¶    // → kachon

// Match sünain bloque
?? n {
    0       : { >> "süchon" ¶ }
    _? n < 0: { >> "nnojolüin" ¶ }
    _       : { >> "anüikat" ¶ }
}
```

---

## Naülaajaa

```zymbol
@ i:0..4  { >> i " " }        // pütchi akumajaa:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pütchi step:       1 3 5 7 9
@ i:5..0:1 { >> i " " }       // pütchi süchon:     5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (kasain)

müsia = ["wayuu", "anüikat", "wanee"]
@ f:müsia { >> f ¶ }          // naülaajaa sünain pütchiirua

@ c:"jamaya" { >> c "-" }
>> ¶                          // → j-a-m-a-y-a-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> naülaajain
    ? i > 7 { @! }             // @! süpüla
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Naülaajaa wanee
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Naülaajaa suulu (süpüla naasad)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Süpüla

```zymbol
ayaawataa(a, b) { <~ a + b }
>> ayaawataa(3, 4) ¶    // → 7

süpülain(n) {
    ? n <= 1 { <~ 1 }
    <~ n * süpülain(n - 1)
}
>> süpülain(5) ¶    // → 120
```

Süpüla sünainjee pütchi — **nnojolüin aküjaa sünain outka**. Hut'unn `<~` pütchi achikirawaa:

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

> **Aküjaa**: Süpüla `suulu(nüchukua){ }` nnojolüin pütchi anüikat.
> Süpüla sünain nüchukua: `x -> suulu(x)`.

---

## Lambda mîna Tü

```zymbol
wayuusein = x -> x * 2
sümaa = (a, b) -> a + b
>> wayuusein(5) ¶    // → 10
>> sümaa(3, 7) ¶     // → 10

// Lambda sünain pütchi
kasain = x -> {
    ? x > 0 { <~ "anüikat" }
    _? x < 0 { <~ "nnojolüin" }
    <~ "süchon"
}

// Tü — lambda sünainjee pütchi outka
wayuuka = 3
wayuusein3 = x -> x * wayuuka
>> wayuusein3(7) ¶    // → 21

// Süpüla anüikat
make_wayuu(n) { <~ x -> x + n }
wayuu10 = make_wayuu(10)
>> wayuu10(5) ¶    // → 15

// Lambda sünain pütchiirua
kasas = [x -> x+1, x -> x*2, x -> x*x]
>> kasas[2](5) ¶    // → 25
```

---

## Pütchiirua

```zymbol
pütchiirua = [1, 2, 3, 4, 5]

pütchiirua[0]          // 1 — aküjaa (0-sünain akumajaa)
pütchiirua[-1]         // 5 — akumajaa nnojolüin (paainjüin)
pütchiirua$#           // 5 — süchikua (parantesis sünain >> süpüla)

pütchiirua = pütchiirua$+ 6            // jünüin → [1,2,3,4,5,6]
pütchiirua2 = pütchiirua$+[2] 99       // jünüin sünain índice 2
pütchiirua3 = pütchiirua$- 3           // süpüla wanee
pütchiirua4 = pütchiirua$-- 3          // süpüla tuláakal
pütchiirua5 = pütchiirua$-[0]          // süpüla sünain índice
pütchiirua6 = pütchiirua$-[1..3]       // süpüla rango (nnojolüin süchiki)

has = pütchiirua$? 3                   // #1 — kasain
pos = pütchiirua$?? 3                  // [2] — outka índice
sl = pütchiirua$[0..3]                 // [1,2,3] — pütchi (nnojolüin süchiki)
sl2 = pütchiirua$[0:3]                 // [1,2,3] — akumajaa süchiki

asc = pütchiirua$^+                    // gai'tayl anüikat (naas solus)
desc = pütchiirua$^-                   // gai'tayl nnojolüin (naas solus)

// Tuple Suulu — hut'unn $^ mîna lambda
db = [(suulu: "Carla", akumajaa: 28), (suulu: "Ana", akumajaa: 25), (suulu: "Bob", akumajaa: 30)]
by_akumajaa = db$^ (a, b -> a.akumajaa < b.akumajaa)
by_suulu    = db$^ (a, b -> a.suulu > b.suulu)
>> by_akumajaa[0].suulu ¶     // → Ana
>> by_suulu[0].suulu ¶        // → Carla

pütchiirua[1] = 99              // pütchi achikirawaa
pütchiirua = pütchiirua[1]$~ 99 // achikirawaa wanee — bora pütchiirua
```

> `$+`, `$-`, `$[..]` pütchiirua **wanee** — achikirawaa: `pütchiirua = pütchiirua$+ 4`.
> Nnojolüin jünüin: wayuu pütchi wanee sünain.
> `$^+` / `$^-` gai'tayl **naas solus**. Tuple Suulu — hut'unn `$^` mîna lambda.

```zymbol
// Pütchiirua naasad
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Waydstr

```zymbol
// Pütchiirua
pütchiirua = [10, 20, 30, 40, 50]
[a, b, c] = pütchiirua              // a=10  b=20  c=30
[first, *rest] = pütchiirua         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]               // _ nnojolüin süpüla

// Tuple akumajaa
point = (100, 200)
(px, py) = point                    // px=100  py=200

// Tuple Suulu
person = (suulu: "Ana", akumajaa: 25, city: "Maracaibo")
(suulu: n, akumajaa: a) = person    // n="Ana"  a=25
```

---

## Tuple

```zymbol
// Akumajaa
point = (10, 20)
>> point[0] ¶    // → 10

// Suulu
wayuu = (suulu: "Wayuu", akumajaa: 25)
>> wayuu.suulu ¶      // → Wayuu
>> wayuu[0] ¶         // → Wayuu  (akumajaa süpüla)

// Naasad
pos = (x: 10, y: 20)
p = (pos: pos, label: "wayuunaiki")
>> p.pos.x ¶        // → 10
```

---

## Süpüla Nüchukua

> Süpüla nüchukua süpüla **lambda inline** — nnojolüin lambda pütchi wanee.

```zymbol
akumajaat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

wayuusein = akumajaat$> (x -> x * 2)                // map → [2,4,6…20]
wanüikat  = akumajaat$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
sümaa     = akumajaat$< (0, (acc, x) -> acc + x)     // reduce → 55

// Kasa wanee
step1 = akumajaat$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Süpüla naasad — bora lambda
ayaawataa2(x) { <~ x * 2 }
r = akumajaat$> (x -> ayaawataa2(x))    // ✅
```

---

## Waypipe

Ibac süchiki süpüla `_` dachi pütchi:

```zymbol
wayuusein = x -> x * 2
sümaa = (a, b) -> a + b
inc = x -> x + 1

5 |> wayuusein(_)        // → 10
10 |> sümaa(_, 5)        // → 15
5 |> sümaa(2, _)         // → 7

// Naasad
r = 5 |> wayuusein(_) |> inc(_) |> wayuusein(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Nnojo

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Nnojo sünain akumajaa" ¶
} :! {
    >> "Nnojo wanee: " _err ¶    // _err pütchi nnojo
} :> {
    >> "Naülaajain wanee" ¶
}
```

| Kasa        | Wayuunaiki                        |
|-------------|-----------------------------------|
| `##Div`     | Nnojo sünain akumajaa             |
| `##IO`      | Pütchi / Kasa                     |
| `##Index`   | Akumajaa nnojolüin pütchi         |
| `##Type`    | Nnojo sünain kasa pütchi          |
| `##Parse`   | Nnojo sünain aküjaa               |
| `##Network` | Nnojo sünain wayuunaiki           |
| `##_`       | Outka nnojo (catch-all)           |

---

## Aküjaliaka

```zymbol
// lib/calc.zy
# calc

#> { ayaawataa, get_PI }    // Outka SÜNAIN aküjaliaka

_PI := 3.14159
ayaawataa(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // Alias süpüla

>> c::ayaawataa(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Outka suulu naas
# mylib
#> { _ibac_ayaawataa <= ibac }

_ibac_ayaawataa(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::ibac(3, 4) ¶    // → 7
```

---

## Waydatops

```zymbol
// Bora akumajaa sünain pütchirua
v1 = #|"42"|      // → 42  (Akumajaa)
v2 = #|"3.14"|    // → 3.14  (Pütchi Akumajaa)
v3 = #|"abc"|     // → "abc"  (nnojo nnojolüin)

// Tracyn / süpüla
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (süpüla)

// Aküjaa akumajaa
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Naas akumajaa
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

## Wayshell

```zymbol
date = <\ date +%Y-%m-%d \>     // chuuyil stdout (bal pütchi jüpüla)
>> "Eetaa: " date

tebec = "data.txt"
content = <\ cat {tebec} \>     // aküjaa hut'unn

output = </"./sub.zy"/>         // ayaawataa zy pütchi, ekirajaa
>> output
```

> `><` ekirajaa CLI pütchi wanee pütchiirua (wanee cha'an).

---

## Pütchi Anüikat: FizzBuzz

```zymbol
ayaawataa(nüchukua) {
    ? nüchukua % 15 == 0 { <~ "PütchiWanüiki" }
    _? nüchukua % 3  == 0 { <~ "Pütchi" }
    _? nüchukua % 5  == 0 { <~ "Wanüiki" }
    _ { <~ nüchukua }
}

@ i:1..20 { >> ayaawataa(i) ¶ }
```

---

## Pütchi Kasain

| Symbol  | Aküjaa             | Symbol       | Aküjaa                |
|---------|--------------------|--------------|------------------------|
| `=`     | Pütchi             | `$#`         | Süchikua              |
| `:=`    | Nnojolüin          | `$+`         | Jünüin                |
| `>>`    | Ayaawataa          | `$+[i]`      | Jünüin índice         |
| `<<`    | Ekirajaa           | `$-`         | Süpüla wanee          |
| `¶`/`\\`| Pütchi Jüpüla      | `$--`        | Süpüla tuláakal       |
| `?`     | Kasain (if)        | `$-[i]`      | Süpüla índice         |
| `_?`    | Pütchi kasain      | `$-[i..j]`   | Süpüla rango          |
| `_`     | Nnojolüin / outka  | `$?`         | Kasain                |
| `??`    | match              | `$??`        | Outka índice          |
| `@`     | Naülaajaa          | `$[s..e]`    | Pütchi akumajaa       |
| `@!`    | Süpüla (break)     | `$>`         | map                   |
| `@>`    | Naülaajain         | `$\|`        | filter                |
| `->`    | Lambda             | `$<`         | reduce                |
| `$^+`   | Gai'tayl anüikat   | `$^-`        | Gai'tayl nnojolüin    |
| `$^`    | Gai'tayl lambda    |              |                       |
| `<~`    | Pütchi jüpüla      | `!?`         | Nnojo kasain (try)    |
| `\|>`   | Pipe               | `:!`         | Nnojo (catch)         |
| `#1`    | Wanee              | `:>`         | Wanee (finally)       |
| `#0`    | Nnojolüin          | `$!`         | Kasa nnojo            |
| `<#`    | Ekirajaa           | `$!!`        | Nnojo jünüin          |
| `#`     | Aküjaliaka         | `#>`         | Outka                 |
| `::`    | Aküjaliaka ayaawataa | `.`        | Süchiki aküjaa        |
| `#\|..\|`| Bora akumajaa    | `#?`         | Kasa süchiki          |
| `#.N\|..\|`| Tracyn         | `#!N\|..\|`  | Süpüla                |
| `c\|..\|`| Aküjaa comma     | `e\|..\|`    | Naas'ika              |
| `<\ ..\>`| Shell ayaawataa  | `>\<`        | CLI pütchi            |

---

*Zymbol-Lang — Pütchi. Wayuu. Nnojolüin Paainjüin.*

> **Aküjaa Wayuunaiki:** Tü aküjaliakat sünainjee inteligencia artificial (IA) aküjain.
> Ayaawataa sünain tü pütchiikat, süka wanee pütchi o aküjaa nnojolüin anüikat.
> Tü pütchi anüikat sünain [Zymbol-Lang aküjaliaka](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
