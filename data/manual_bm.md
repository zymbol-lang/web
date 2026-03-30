# Zymbol-Lang Sɛbɛnni Guekoro

**Zymbol-Lang** ye kumakan ye min bɛ sɛbɛn ka kɛ ni tiilenw ye. A tɛ baara kan kɛ — bɛɛ ye tiilen. A bɛ kɛ fɔlɔ ɲɔgɔn ye kanw bɛɛ la.

- Baara kan tɛ yen (`if`, `while`, `return` tɛ yen — tiilenw dɔrɔn `?`, `@`, `<~`)
- Unicode tilennin — tɔgɔw kɛ kan o kan walima emoji 👋
- Kan bɛɛ kɛlen — code kɛlen do kanw bɛɛ la

---

## Nɔmɔrɔw ni Waatilenw

```zymbol
x = 10              // Nɔmɔrɔ (se ka yɛlɛma)
PI := 3.14159       // Waatilen (tɛ se ka yɛlɛma — ni a fɔlen tun ka yɛlɛma, fili bɛ kɛ)
tɔgɔ = "Ana"
aw = #1             // boole tiɲɛ
👋 := "I ni ce"
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

## Kunnafoniw Sugu

| Suguba          | Misali              | Tiilen `#?` | Kunnafoni                           |
|-----------------|---------------------|-------------|-------------------------------------|
| Jate tilennen   | `42`, `-7`          | `###`       | 64-Bit signed                       |
| Jate fɛnfɛnnen  | `3.14`, `1.5e10`    | `##.`       | Kɛfɔlen siɲɛ sɛbɛn OK              |
| Kumakan         | `"i ni ce"`         | `##"`       | Jɔyɔrɔ: `"I ni ce {tɔgɔ}"`        |
| Sɛbɛn kelen     | `'A'`               | `##'`       | Unicode sɛbɛn kelen                 |
| Boole           | `#1`, `#0`          | `##?`       | Jate 1 ni 0 TƐ                      |
| Array           | `[1, 2, 3]`         | `##]`       | Fɛnw bɛɛ suguba kelen              |
| Tupil           | `(a, b)`            | `##)`       | Yɔrɔ kɔnɔ                          |
| Tupil tɔgɔlen   | `(x: 1, y: 2)`      | `##)`       | Se ka sɔrɔ tɔgɔ walima jate ni    |

```zymbol
// Suguba lɛsɛli — bɛ di (suguba, jate, baarakɛ)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Bɔ ni Don

```zymbol
>> "I ni ce" ¶                      // ¶ walima \\ bɛ sariya lafilenw di
>> "a=" a " b=" b ¶                 // Kunnafoni caaman ɲɔgɔn kɔnɔ
>> (arr$#) ¶                        // Postfix tiilenw bi gɛrɛfɛn dɔrɔn

<< tɔgɔ                            // Fɛndi tɛ — kɔnɔ yɔrɔ la bɛ kalan
<< "I tɔgɔ? " tɔgɔ                 // Ni fɛndi ye
```

> `¶` (AltGr+R español clavier) walima `\\` bɛ kɛ kelen ye sariya lafilenw kama.

---

## Baara kɛcogo

```zymbol
// Jate baara — kotow bɛ baara kɛ tuma bɛɛ; dɔw bɛ se ka fili kɛ >> kɔnɔ
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (jate kɔrɔtalen)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (jate kunba)

// Ɲɔgɔn lɛsɛli
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logiki
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Sɛbɛnni

```zymbol
// Fɔrɔ bisaba dɔrɔnw tilen — o bɛɛ ni a yɔrɔ
tɔgɔ = "Ana"
n = 42

msg = "I ni ce ", tɔgɔ, "!"            // zapiya — fɛn dilan la = walima :=
>> "I ni ce " tɔgɔ " e ye " n ¶        // ɲɔgɔn kɔnɔ — bɔ la >>
kɔlɔsi = "I ni ce {tɔgɔ}, e ye {n}"   // jɔyɔrɔ — yɔrɔ o yɔrɔ
```

```zymbol
s = "I ni ce Diina"
jatelɔn = s$#                  // 14
gɛrɛfɛn = s$[0..5]             // "I ni c"  (baw bɛ wili)
bɛ yen = s$? "Diina"           // #1
bɔlen = "a,b,c,d" / ','        // [a, b, c, d]
yɛlɛmanen = s$~~["i":"I"]      // kumakan yɛlɛma bɛɛ
yɛlɛma1 = s$~~["i":"I":1]      // yɛlɛma fɔlɔ dɔrɔn
```

> `+` bɛ kɛ jatew dɔrɔn ye. Kumakaw la, zapiya, ɲɔgɔn kɔnɔ, walima jɔyɔrɔ kɔlɔsi.

---

## Talikɛlaw

```zymbol
x = 7

? x > 0 { >> "ɲɔgɔn" ¶ }

? x > 100 {
    >> "ba" ¶
} _? x > 0 {
    >> "ɲɔgɔn" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "nɔgɔnin" ¶
}
```

> Dabaliw `{ }` **wajibi don**, fiɲɛ kelen bɛ na tuma bɛɛ.

---

## Match

```zymbol
// Yɔrɔw
kunnafoniw = 85
baaraden = ?? kunnafoniw {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> baaraden ¶    // → B

// Kumakaw
kulɛ = "ja"
code = ?? kulɛ {
    "ja"    : "#FF0000"
    "gwɛ"   : "#00FF00"
    _       : "#000000"
}

// Sariyaw
temp = -5
cogoyɔrɔ = ?? temp {
    _? temp < 0  : "kongolo"
    _? temp < 20 : "jɛni"
    _? temp < 35 : "teliman"
    _            : "tiɲɛ"
}
>> cogoyɔrɔ ¶    // → kongolo

// Kalama ni dabaliw
?? n {
    0       : { >> "nul" ¶ }
    _? n < 0: { >> "nɔgɔnin" ¶ }
    _       : { >> "ɲɔgɔn" ¶ }
}
```

---

## Sirilimaw

```zymbol
@ i:0..4  { >> i " " }        // yɔrɔ: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ni gafe: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // segin kɔ: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (waati)

furu = ["Mango", "Nɛrɛ", "Tulu"]
@ f:furu { >> f ¶ }           // fɛnw bɛɛ kama

@ c:"i ni ce" { >> c "-" }
>> ¶                          // → i-  -n-i-  -c-e-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> taa ɲɔgɔn
    ? i > 7 { @! }             // @! dɔgɔtɔ
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Sirilikɛ bɛ tuma bɛɛ
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Tɔgɔlen sirilikɛ (ɲɔgɔn kɔnɔ dɔgɔtɔ)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Baaraw

```zymbol
sɛgɛsɛgɛ(a, b) { <~ a + b }
>> sɛgɛsɛgɛ(3, 4) ¶    // → 7

mɔgɔjate(n) {
    ? n <= 1 { <~ 1 }
    <~ n * mɔgɔjate(n - 1)
}
>> mɔgɔjate(5) ¶    // → 120
```

Baaraw bɛ yɔrɔ wɛrɛ kɔnɔ — tɛ se ka kunnafoniw cɛkɔrɔw sɔrɔ. Kunnafoniw bɔ `<~` ka baara kɛ:

```zymbol
yɛlɛma(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
yɛlɛma(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Baaraw tɔgɔlen tɛ kɛ fɛn fɔlɔ ye. Ka di kuma kama: `x -> tɔgɔ(x)`.

---

## Lambda ni Tɔnw

```zymbol
fila = x -> x * 2
lajɛlen = (a, b) -> a + b
>> fila(5) ¶         // → 10
>> lajɛlen(3, 7) ¶   // → 10

// Lambda ni dabali ye
baarakɛ = x -> {
    ? x > 0 { <~ "ɲɔgɔn" }
    _? x < 0 { <~ "nɔgɔnin" }
    <~ "nul"
}

// Tɔnw — lambdaw bɛ kunnafoniw cɛkɔrɔw sɔrɔ
factor = 3
saba = x -> x * factor
>> saba(7) ¶    // → 21

// Baara dilan
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdaw kɛ fɛn ye: bɛ bila array la
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Siraw

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — sɔrɔ (0 kɔnɔ)
arr[-1]         // 5 — jate nɔgɔnin (laban)
arr$#           // 5 — jatelɔn (kɛ (arr$#) >> la)

arr = arr$+ 6            // fara kan → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // bila yɔrɔ 2 la
arr3 = arr$- 3           // bɔ baaralen fɔlɔ
arr4 = arr$-- 3          // bɔ baaralenw bɛɛ
arr5 = arr$-[0]          // bɔ yɔrɔ 0 la
arr6 = arr$-[1..3]       // bɔ yɔrɔw (baw bɛ wili)

bɛ yen = arr$? 3         // #1 — bɛ yen
yɔrɔw = arr$?? 3         // [2] — yɔrɔw bɛɛ
gɛrɛfɛn = arr$[0..3]     // [1,2,3] — gɛrɛfɛn (baw bɛ wili)
sl2 = arr$[0:3]          // [1,2,3] — jatelɔn kama

fara = arr$^+            // jate bila (jate dɔrɔn)
gɛlɛya = arr$^-          // jate bilanen (jate dɔrɔn)

// Tupilw ni tɔgɔw — $^ ni ɲɔgɔn kɔnɔ kɛ
db = [(tɔgɔ: "Kala", saan: 28), (tɔgɔ: "Ana", saan: 25), (tɔgɔ: "Buba", saan: 30)]
saan_kama  = db$^ (a, b -> a.saan < b.saan)    // fara kama saan  (<)
tɔgɔ_kama = db$^ (a, b -> a.tɔgɔ > b.tɔgɔ)   // gɛlɛya kama tɔgɔ (>)
>> saan_kama[0].tɔgɔ ¶     // → Ana
>> tɔgɔ_kama[0].tɔgɔ ¶    // → Kala

arr[1] = 99              // yɛlɛma yɔrɔ la
arr = arr[1]$~ 99        // yɛlɛma ni array kura ye
```

> Array yɔrɔlenw bɛɛ bɛ **array kura** di. Segin kɔ: `arr = arr$+ 4`.
> Tɛ se ka ɲɔgɔn kɔnɔ: fɛn dilan fila wɛrɛ wɛrɛ la kɛ.
> `$^+` / `$^-` bɛ **jate dɔrɔn** bila (jatew, kumakaw). Tupilw kama `$^` ni ɲɔgɔn kɔnɔ kɛ.

```zymbol
// Siraw ɲɔgɔn kɔnɔ
matirisi = [[1,2,3],[4,5,6],[7,8,9]]
>> matirisi[1][2] ¶    // → 6
```

---

## Fara fara kɛ

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[fɔlɔ, *tɔw] = arr           // fɔlɔ=10  tɔw=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ bɛ tɔgɔ bali

// Tupil yɔrɔ kɔnɔ
yɔrɔ = (100, 200)
(px, py) = yɔrɔ             // px=100  py=200

// Tupil tɔgɔlen
mɔgɔ = (tɔgɔ: "Ana", saan: 25, dugu: "Bamako")
(tɔgɔ: n, saan: a) = mɔgɔ  // n="Ana"  a=25
```

---

## Tupilw

```zymbol
// Yɔrɔ kɔnɔ
yɔrɔ = (10, 20)
>> yɔrɔ[0] ¶    // → 10

// Tɔgɔlen
mɔgɔ = (tɔgɔ: "Alice", saan: 25)
>> mɔgɔ.tɔgɔ ¶    // → Alice
>> mɔgɔ[0] ¶      // → Alice  (jate ni bɛ baara kɛ)

// Ɲɔgɔn kɔnɔ
bɔkɔ = (x: 10, y: 20)
p = (bɔkɔ: bɔkɔ, tɔgɔ: "kɔrɔ")
>> p.bɔkɔ.x ¶        // → 10
```

---

## Baaraw Kɔrɔbaw

> HOF tiilenw bi **lambda inline** — Lambda yɔrɔ tɛ ka kɛ.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

filalen  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
ɲɔgɔnw   = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
lajɛ     = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Ɲɔgɔn kɔnɔ ni fɛn dilan
gafe1 = nums$| (x -> x > 3)
gafe2 = gafe1$> (x -> x * x)
>> gafe2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Baaraw tɔgɔlenw HOF kɔnɔ — lambda kɔnɔ bila
fila(x) { <~ x * 2 }
r = nums$> (x -> fila(x))    // ✅
```

---

## Pipe Baara kɛcogo

RHS tuma bɛɛ bi `_` fɛn lafilenw kama:

```zymbol
fila = x -> x * 2
lajɛ = (a, b) -> a + b
ɲɔgɔn = x -> x + 1

5 |> fila(_)        // → 10
10 |> lajɛ(_, 5)    // → 15
5 |> lajɛ(2, _)     // → 7

// Ɲɔgɔn kɔnɔ
r = 5 |> fila(_) |> ɲɔgɔn(_) |> fila(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fili Mara

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Kɔrɔtalen bila nul la" ¶
} :! {
    >> "fili wɛrɛ: " _err ¶    // _err bɛ fili kuma mara
} :> {
    >> "tuma bɛɛ bɛ bɔ" ¶
}
```

| Suguba      | Tuma min              |
|-------------|----------------------|
| `##Div`     | Kɔrɔtalen bila nul la |
| `##IO`      | Dosiye / Baara        |
| `##Index`   | Jate tɛ yɔrɔ la      |
| `##Type`    | Suguba fili           |
| `##Parse`   | Kalan fili            |
| `##Network` | Interneti fili        |
| `##_`       | Fili o fili (bɛɛ)     |

---

## Modiilw

```zymbol
// Dosiye: lib/calc.zy
# calc

#> { sɛgɛsɛgɛ, get_PI }    // Bɔ tiilenw KALANDEN don k'a ɲɛsin dafaliw ma

_PI := 3.14159
sɛgɛsɛgɛ(a, b) { <~ a + b }
get_PI() { <~ _PI }   // sɔrɔkɛ — constant sɔrɔ tuma la tɛ se ka kɛ
```

```zymbol
// Dosiye: main.zy
<# ./lib/calc <= c    // Alias wajibi

>> c::sɛgɛsɛgɛ(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Bɔ ni tɔgɔ wɛrɛ ye
# mylib
#> { _sɛgɛsɛgɛ_kɔnɔ <= lajɛ }

_sɛgɛsɛgɛ_kɔnɔ(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::lajɛ(3, 4) ¶    // → 7  (tɔgɔ kɔnɔ _sɛgɛsɛgɛ_kɔnɔ bɛɲɔgɔn)
```

---

## Data Baara kɛcogo

```zymbol
// Kumakan yɛlɛma jate ma
v1 = #|"42"|      // → 42  (Jate tilennen)
v2 = #|"3.14"|    // → 3.14  (Jate fɛnfɛnnen)
v3 = #|"abc"|     // → "abc"  (fili tɛ)

// Telen / bɔsen
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (telen jate 2 ma)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (bɔsen)

// Jate sɛbɛnni
fmt = #,|1234567|      // → 1,234,567  (zapiya kɔnɔ)
sci = #^|12345.678|    // → 1.2345678e4  (kɛfɔlen siɲɛ)

// Jate tɔnɔw
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binɛri)
c = 0o101        // → 'A'  (oktal)

// Jate tɔnɔ bɔ
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Dɔgɔtɔrɔya

```zymbol
don = <\ date +%Y-%m-%d \>     // stdout sɔrɔ (sariya lafilenw ni)
>> "Bi: " don

dosiye = "data.txt"
kunnafoni = <\ cat {dosiye} \>      // jɔyɔrɔ ni kuma kɔnɔ

bɔlen = </"./subscript.zy"/>   // Zymbol script wɛrɛ kɛ, stdout sɔrɔ
>> bɔlen
```

> `><` bɛ CLI kuma kɔnɔw sɔrɔ lokola array (tree-walker dɔrɔn).

---

## Misali Tilennen: FizzBuzz

```zymbol
sɛgɛsɛgɛ(jate) {
    ? jate % 15 == 0 { <~ "FiziFilɛBuzuFilɛ" }
    _? jate % 3  == 0 { <~ "FiziFilɛ" }
    _? jate % 5  == 0 { <~ "BuzuFilɛ" }
    _ { <~ jate }
}

@ i:1..20 { >> sɛgɛsɛgɛ(i) ¶ }
```

---

## Tiilenw Waleliw

| Tiilen  | Baara              | Tiilen     | Baara                 |
|---------|--------------------|------------|-----------------------|
| `=`     | Nɔmɔrɔ            | `$#`       | Jatelɔn               |
| `:=`    | Waatilen           | `$+`       | Fara kan              |
| `>>`    | Bɔ                 | `$+[i]`    | Bila yɔrɔ la          |
| `<<`    | Don                | `$-`       | Bɔ (baaralen fɔlɔ)   |
| `¶`/`\\` | Sariya lafilenw   | `$--`      | Bɔ baaralenw bɛɛ     |
| `?`     | ? (if)             | `$-[i]`    | Bɔ yɔrɔ la            |
| `_?`    | _? (elif)          | `$-[i..j]` | Bɔ yɔrɔw              |
| `_`     | _ / yɔrɔ           | `$?`       | Bɛ yen                |
| `??`    | match              | `$??`      | Yɔrɔw bɛɛ sɔrɔ       |
| `@`     | Sirilikɛ           | `$[s..e]`  | Gɛrɛfɛn               |
| `@!`    | Dɔgɔtɔ (break)     | `$>`       | map                   |
| `@>`    | Taa ɲɔgɔn          | `$\|`      | filter                |
| `->`    | Lambda             | `$<`       | reduce                |
| `$^+`   | Bila fara (jatew)  | `$^-`      | Bila gɛlɛya (jatew)  |
| `$^`    | Bila ni ɲɔgɔn (tupilw) | | |
| `<~`    | Segin kɔ           | `!?`       | sɛbɛn (try)           |
| `\|>`   | Pipe               | `:!`       | minɛ (catch)          |
| `#1`    | tiɲɛ               | `:>`       | tuma bɛɛ (finally)    |
| `#0`    | galon              | `$!`       | fili ye wa            |
| `<#`    | don (import)       | `$!!`      | fili nɛnɛ             |
| `#`     | Modiil sɛbɛn       | `#>`       | bɔ (export)           |
| `::`    | Modiil wele        | `.`        | yɔrɔ sɔrɔ            |
| `#\|..\|` | Jate kalan      | `#?`       | Suguba lɛsɛli         |
| `#.N\|..\|` | Telen         | `#!N\|..\|` | Bɔsen              |
| `c\|..\|` | Zapiya sɛbɛnni  | `e\|..\|`  | Kɛfɔlen siɲɛ          |
| `<\ ..\>` | Shell kɛ        | `>\<`      | CLI kumaw             |

---

*Zymbol-Lang — Tiilen. Kan Bɛɛ. Kelen.*

> **Kunnafoni:** Sɛbɛnni nin ye AI (segin hakili) ye min sɛbɛnna ani u wilila.
> Tilennen kɛra ka kɛ, nga mɔgɔ dɔw ka wilili walima misaaliw bɛ se ka fili kɛ.
> Jɔyɔrɔ tilennen ye [Zymbol-Lang dafali](https://github.com/zymbol-lang/interpreter) ye.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
