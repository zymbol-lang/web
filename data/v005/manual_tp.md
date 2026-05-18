> **pana e sona:** lipu ni li tan sona pi ilo lawa (AI). jan li ante e ona tawa toki pona.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> lipu pi lon pona li **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** lon poki pi ilo ante.

---

# lipu pi toki Zymbol-Lang

> **lipu ni li pona tawa v0.0.5 — 2026-05-15**

**toki Zymbol-Lang** li toki pi sitelen tawa. toki ni li jo ala e nimi lawa. ijo ale li sitelen. ona li pali sama lon toki jan ale.

- toki ni li jo ala e `if`, `while`, `return`. ona li jo e `?`, `@`, `<~` taso.
- ona li jo e sitelen Unicode ale. nimi li ken lon toki ale anu sitelen musi.
- ona li ken pali lon toki jan ale. sitelen pi ijo pali li sama lon ma ale.

---

## nimi ante en nimi pi kama ala

```zymbol
x = 10              // nimi ante li ken ante
π := 3.14159        // nimi pi kama ala — pana sin li pakala lon tenpo pali
nimi = "Alice"
pali = #1         // lon
👋 := "toki"
```

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++        // 5
x--        // 4
```

`°` (sitelen pi kipisi tenpo, U+00B0) li open e nimi ante lon nanpa meso lon tenpo open pi kepeken ona:

```zymbol
nanpa = [3, 1, 4, 1, 5]
@ n:nanpa {
    °ale += n    // open e ona tawa 0 lon sewi pi mute pali; ona li lon tenpo kama pi ijo @
}
>> ale ¶         // → 14
```

> `°x` (open nimi) li awen lon sewi pi mute pali. ni li ken kama jo ona tenpo kama pi ijo @.
> `x°` (pini nimi) li awen lon insa pi mute pali. ni li moli tenpo pini pi mute pali.
> ilo *tree-walker* taso li ken pali e ni.

---

## nasin pi ijo pali

| nasin ijo | nimi lon | nimi `#?` | toki sona |
|-----------|----------|-----------|-----------|
| nanpa suli | `42`, `-7` | `###` | 64-pita en sitelen |
| telo nanpa | `3.14`, `1.5e10` | `##.` | nasin sitelen pi sona sewi li ken |
| lipu nimi | `"toki"` | `##"` | pana e nimi lon insa: `"toki {nimi}"` |
| sitelen | `'A'` | `##'` | sitelen wan pi ilo Unicode |
| lon | `#1`, `#0` | `##?` | ni li nanpa ala — `#1 ≠ 1` |
| poki | `[1, 2, 3]` | `##]` | ijo sama |
| poki tu | `(a, b)` | `##)` | lon ma |
| poki tu pi nimi lon | `(x: 1, y: 2)` | `##)` | ma pi nimi lon |
| pali | nimi pi pali | `##()` | ilo pi nanpa wan; ona li lukin e `<funct/N>` |
| pali pi lili | `x -> x * 2` | `##->` | ilo pi nanpa wan; ona li lukin e `<lambd/N>` |

```zymbol
// lukin e nasin ijo — ona li pana e (nasin ijo, nanpa, nanpa)
ilo = 42#?
>> ilo ¶         // → (###, 2, 42)
t = ilo[1]
>> t ¶            // → ###
```

---

## pana e toki li kama jo e toki

```zymbol
>> "toki" ¶                       // ¶ anu \\ li pana e linja sin
>> "a=" a " b=" b ¶               // awen lon poka — mute nanpa
>> (arr$#) ¶                      // ilo pini li wile e ( ) lon insa >>

>> nimi                           // kama jo e toki tawa poki (pana ala e sona)
>> "pana e nimi: " nimi            // pana e sona
```

> `¶` (AltGr+R lon ilo pi toki Sipani) en `\\` li linja sin sama.

---

## ijo pi ilo TUI

ilo pi len lawa li pali e kute jan. mute li wile e poki `>>| { }` (len ante + nasin wawa).

```zymbol
>>| {
    >>!                             // pana e telo tawa len ante
    >>~ (1, 1, 0, 10) > "pali"    // linja 1, palisa 1, fg=10 (kasi)
    @~ 1000                         // awen 1 tenpo suli (1000 ms)
    >>~ (2, 1) > "pini."
}
// len li kama sama lon tenpo weka
```

```zymbol
// luka e ilo lili en suli pi len lawa
>>| {
    [linja, palisa] = >>?              // wile sona e suli pi len lawa
    >>~ (1, 1) > "len: " linja " x " palisa
    <<| luka                         // kute e luka lawa pi awen
    >>~ (2, 1) > "luka: " luka
}
```

> `>>!` li pana e telo tawa len. `>>?` li pana e `[linja, palisa]`. `@~ N` li lape N tenpo lili.
> `<<|` li kama jo e luka lawa wan (awen). `<<|?` li lukin taso (pana e `'\0'` tawa ni).
> poki tu pi lon ma: `(linja, palisa, BKS, fg, bg)` — ken weka e wan kepeken `,` (`>>~ (,,, 196) > "loje"`).
> BKS li ijo *bitmask*: `1`=wawa, `2`=tawa, `4`=lupa anpa. ANSI 256 kule (`0`=len lawa).
> ijo *tree-walker* taso. taso `>>!`, `>>?`, `@~`, `>>~` li ken pali lon `--vm`.

---

## ilo pali

```zymbol
// nanpa
a = 10
b = 3
p1 = a + b    // 13
p2 = a - b    // 7
p3 = a * b    // 30
p4 = a / b    // 3  (kipisi nanpa)
p5 = a % b    // 1
p6 = a ^ b    // 1000  (wawa)

// lukin — pana tawa lukin
l1 = a == b    // #0
l2 = a <> b    // #1
l3 = a < b     // #0
l4 = a <= b    // #0
l5 = a > b     // #1
l6 = a >= b    // #1

// lawa pi sona
s1 = #1 && #0    // #0
s2 = #1 || #0    // #1
s3 = !#1         // #0
```

---

## lipu nimi

```zymbol
// nasin tu pi tu
nimi = "Alice"
n = 42

>> "toki " nimi " sina jo e " n ¶       // awen lon poka — lon >>
sona = "toki {nimi}, sina jo e {n}"     // lon insa — lon ma ale
```

```zymbol
s = "toki ma"
suli = s$#                  // 8
lili = s$[1..4]             // "toki"  (1-li lon, pini lon)
lon = s$? "ma"          // #1
kipisi = "a,b,c,d"$/ ','   // [a, b, c, d]  (pakala kepeken ilo)
ante = s$~~["i":"u"]        // "toku ma"
ante1 = s$~~["i":"u":1]     // "toku ma"  (wan N taso)
linja = "─" $* 20           // "────────────────────"  (pali e sama N tenpo)
```

> `+` li tawa nanpa taso. tawa lipu nimi, o kepeken `,` anu awen lon poka anu lon insa.

---

## nasin pi pali

```zymbol
x = 7

? x > 0 { >> "pona" ¶ }

? x > 100 {
    >> "suli" ¶
} _? x > 0 {
    >> "pona" ¶
} _? x == 0 {
    >> "ala" ¶
} _ {
    >> "ike" ¶
}
```

> `{ }` **li wile** kin la ona li toki wan.

---

## sama

```zymbol
// kipisi
nanpa = 85
poki = ?? nanpa {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> poki ¶    // → B

// lipu nimi
kule = "loje"
ilo = ?? kule {
    "loje"   => "#FF0000"
    "laso" => "#00FF00"
    _       => "#000000"
}

// nasin pi lukin
seli = -5
pali = ?? seli {
    < 0  => "leko"
    < 20 => "lete"
    < 35 => "seli"
    _    => "seli mute"
}
>> pali ¶    // → leko

// nasin toki (luka poki)
n = -3
?? n {
    0    => { >> "ala" ¶ }
    < 0  => { >> "ike" ¶ }
    _    => { >> "pona" ¶ }
}
```

---

## mute pali

```zymbol
@ i:0..4  { >> i " " }        // kipisi lon:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kepeken noka:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // monsi:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (tenpo ni)

kili = ["kili loje", "kili pi seli", "kili unpa"]
@ k:kili { >> k ¶ }         // tawa ijo ale lon poki

@ k:"toki" { >> k "-" }
>> ¶                          // → t-o-k-i-  (tawa sitelen ale lon lipu nimi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> li pali sin
    ? i > 7 { @! }             // @! li pini
    >> i " "
}
>> ¶                          // → 1 3 5 7

// mute pali pi pini ala
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// mute pali pi nimi lon (pakala lon insa)
nanpa = 0
@:suno {
    nanpa++
    ? nanpa >= 3 { @:suno! }
}
>> nanpa ¶                    // → 3
```

---

## pali

```zymbol
wan(a, b) { <~ a + b }
>> wan(3, 4) ¶    // → 7

namako(n) {
    ? n <= 1 { <~ 1 }
    <~ n * namako(n - 1)
}
>> namako(5) ¶    // → 120
```

pali li jo e **ma ante**. ona li ken ala lukin e nimi ante lon ma ante. o kepeken ilo pana `<~>` tawa ante e nimi pi jan pali:

```zymbol
ante(a<~, b<~) {
    awen = a
    a = b
    b = awen
}
x = 10
y = 20
ante(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> pali pi nimi lon li **ijo pi nanpa wan**. o pana e ona tawa ilo HOF: `nanpa$> tu`. nasin `x -> pali(x)` li pona.

---

## pali pi lili en pali pi awen

```zymbol
tu = x -> x * 2
wan = (a, b) -> a + b
>> tu(5) ¶    // → 10
>> wan(3, 7) ¶  // → 10

// pali pi lili poki
poki = x -> {
    ? x > 0 { <~ "pona" }
    _? x < 0 { <~ "ike" }
    <~ "ala"
}

// pali pi awen — kama jo e ma ante
wawa = 3
tu wan = x -> x * wawa
>> tu wan(7) ¶    // → 21

// ijo pali
pana_wan(n) { <~ x -> x + n }
wan_luka = pana_wan(10)
>> wan_luka(5) ¶    // → 15

// lon poki
ilo = [x -> x+1, x -> x*2, x -> x*x]
>> ilo[3](5) ¶    // → 25
```

---

## poki

poki li **ken ante** li jo e ijo **sama**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — lukin (1-li lon: ijo nanpa wan)
x = arr[-1]     // 5 — nanpa ike (ijo pini)
x = arr$#       // 5 — suli (o kepeken (arr$#) lon >>)

arr = arr$+ 6            // wan → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // pana lon ma 2 (1-li lon)
arr3 = arr$- 3           // weka e ijo nanpa wan
arr4 = arr$-- 3          // weka e ijo ale
arr5 = arr$-[1]          // weka lon nanpa 1 (ijo nanpa wan)
arr6 = arr$-[2..3]       // weka e kipisi (1-li lon, pini lon)

lon = arr$? 3            // #1 — li lon
ma = arr$?? 3           // [3] — nanpa ale pi ijo (1-li lon)
kipisi = arr$[1..3]          // [1,2,3] — kipisi (1-li lon, pini lon)
kipisi2 = arr$[1:3]          // [1,2,3] — sama, nasin pi toki nanpa

suli = arr$^+             // pana e ijo tawa suli (ijo taso)
lili = arr$^-            // pana e ijo tawa lili (ijo taso)

// poki pi poki tu pi nimi lon/ma — o kepeken $^ en pali pi lili lukin
poki = [(nimi: "Carla", tenpo: 28), (nimi: "Ana", tenpo: 25), (nimi: "Bob", tenpo: 30)]
lukin_tenpo  = poki$^ (a, b -> a.tenpo < b.tenpo)    // lukin e tenpo tawa suli (<)
lukin_nimi = poki$^ (a, b -> a.nimi > b.nimi)   // lukin e nimi tawa lili (>)
>> lukin_tenpo[1].nimi ¶     // → Ana
>> lukin_nimi[1].nimi ¶    // → Carla

// ante e ijo wan (poki taso)
arr[1] = 99              // pana
arr[2] += 5              // tu: +=  -=  *=  /=  %=  ^=

// ante kepeken ilo — li pana e poki sin. poki nanpa wan li sama.
arr2 = arr[2]$~ 99
```

> ilo ale pi poki li pana e **poki sin**. o pana sin: `arr = arr$+ 4`.
> `$+` li ken mute: `arr = arr$+ 5$+ 6$+ 7`. ilo ante li kepeken pana insa.
> **nanpa 1-li lon**: `arr[1]` li ijo nanpa wan. `arr[0]` li pakala lon tenpo pali.
> `$^+` / `$^-` li pana e **poki ijo taso** (nanpa, lipu nimi). tawa poki pi poki tu, o kepeken `$^` en pali pi lili lukin. nasin li lon insa pi pali pi lili lukin (`<` = suli, `>` = lili).

**nasin pi ijo**: pana e poki tawa nimi ante li pali e poki sin.

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b li sama ala
```

```zymbol
// poki lon poki (nanpa 1-li lon)
poki = [[1,2,3],[4,5,6],[7,8,9]]
>> poki[2][3] ¶    // → 6  (linja 2, palisa 3)
```

---

## pakala ijo

```zymbol
// poki
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[wan, *mute] = arr         // wan=10  mute=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ li weka

// poki tu pi ma
lon = (100, 200)
(px, py) = lon             // px=100  py=200

// poki tu pi nimi lon
jan = (nimi: "Ana", tenpo: 25, ma: "Madrid")
(nimi: n, tenpo: t) = jan   // n="Ana"  t=25
```

---

## poki tu

poki tu li **ken ala ante**. ona li jo e ijo pi **nasin ante**.

```zymbol
// ma — nasin ante li ken
lon = (10, 20)
>> lon[1] ¶    // → 10

ijo = (42, "toki", #1, 3.14)
>> ijo[3] ¶     // → #1

// nimi lon
jan = (nimi: "Alice", tenpo: 25)
>> jan.nimi ¶    // → Alice
>> jan[1] ¶      // → Alice  (nanpa li ken, 1-li lon)

// lon insa
ma = (x: 10, y: 20)
p = (ma: ma, nimi: "open")
>> p.ma.x ¶        // → 10
```

**ken ala ante** — ante e ijo wan li pakala lon tenpo pali:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ pakala: poki tu li ken ala ante
// t[1] += 5    // ❌ pakala sama
```

tawa ijo ante, o kepeken `$~` (ante kepeken ilo) — li pana e **poki tu sin**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← ijo nanpa wan li sama
>> t2 ¶    // → (10, 999, 30)

// poki tu pi nimi lon — o pali e sin
jan = (nimi: "Alice", tenpo: 25)
suli  = (nimi: jan.nimi, tenpo: 26)
>> jan.tenpo ¶    // → 25
>> suli.tenpo ¶     // → 26
```

---

## pali pi wawa suli

```zymbol
nanpa = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tu  = nanpa$> (x -> x * 2)                  // map  → [2,4,6…20]
wan    = nanpa$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ale    = nanpa$< (0, (poki, x) -> poki + x)     // reduce → 55

// mute kepeken insa
noka1 = nanpa$| (x -> x > 3)
noka2 = noka1$> (x -> x * x)
>> noka2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// pali pi nimi lon li ken tawa HOF
tu(x) { <~ x * 2 }
suli(x) { <~ x > 5 }
r = nanpa$> tu       // ✅ lukin wan
r = nanpa$| suli       // ✅ lukin wan
```

---

## ilo pi nasin tawa

luka pi lawa li wile e `_` lon ma pi ijo tawa:

```zymbol
tu = x -> x * 2
wan = (a, b) -> a + b
wan = x -> x + 1

p1 = 5 |> tu(_)        // → 10
p2 = 10 |> wan(_, 5)       // → 15
p3 = 5 |> wan(2, _)        // → 7

// mute
p = 5 |> tu(_) |> wan(_) |> tu(_)
>> p ¶    // → 22  (5→10→11→22)
```

---

## pakala

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kipisi e ala" ¶
} :! {
    >> "ante: " _err ¶    // _err li jo e toki pakala
} :> {
    >> "pali lon tenpo ale" ¶
}
```

| nasin ijo | tenpo |
|-----------|-------|
| `##Div` | kipisi e ala |
| `##IO` | lipu / ilo |
| `##Index` | nanpa li weka |
| `##Type` | nasin ijo li sama ala |
| `##Parse` | lukin e ijo |
| `##Network` | pakala pi ilo linluwi |
| `##_` | pakala ale (kama jo) |

---

## poki pali

```zymbol
// lib/calc.zy — ijo pi poki pali li lon insa { }
# calc {
    #> { wan, get_PI }

    _π := 3.14159
    wan(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // nimi ante li wile

>> c::wan(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// pana e ijo kepeken nimi ante
# mylib {
    #> { _wan_insa => ale }

    _wan_insa(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::ale(3, 4) ¶    // → 7  (nimi insa _wan_insa li weka)
```

> **nasin pi poki pali**: lon insa `# nimi { }`, `#>`, toki pi pali, en ijo open pi nimi ante li ken. toki pali (`>>`, `<<`, mute pali, etc.) li pana e pakala E013.

---

## nasin pi nanpa sitelen

Zymbol li ken lukin e nanpa lon **69 nasin sitelen nanpa pi ilo Unicode** — Devanagari, Arab-Indian, Thai, Klingon pIqaD, Mathematical Bold, kipisi LCD, en ante. nasin pali li tawa `>>` taso. pali nanpa lon insa li nasin wan taso.

### open e nasin sitelen

o sitelen e nanpa `0` en `9` pi nasin sitelen lon insa `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indian (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tawa ASCII
```

### pana e toki en lon

```zymbol
x = 42
>> x ¶          // → 42   (ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (lili nanpa li ASCII)
>> 1 + 2 ¶      // → ३

// lon: open # li ASCII. nanpa li kama sama
>> #1 ¶         // → #१   (lon lon Devanagari)
>> #0 ¶         // → #०   (lon ala — ni li ante tan ० nanpa ala)

x = 28 > 4
>> x ¶          // → #१   (pali lukin li tawa nasin pali)
```

### nanpa lon open

nanpa pi nasin sitelen ale li ken. ona li ken lon kipisi, modulo, lukin:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### lon lon nasin sitelen ale

`#` + nanpa `0` anu `1` tan poki ale li lon:

```zymbol
#٠٩#
pali = #١        // sama #1
>> pali ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **li ASCII**. `#0` (lon ala) li lukin ante tan `0` (nanpa ala) lon nasin sitelen ale.

---

## ilo pi ijo pali

```zymbol
// ante e nasin ijo
f = ##.42         // → 42.0  (telo nanpa)
i = ###3.7        // → 4     (nanpa suli, sike)
t = ##!3.7        // → 3     (nanpa suli, kipisi)

// lukin e lipu nimi tawa nanpa
v1 = #|"42"|      // → 42  (nanpa suli)
v2 = #|"3.14"|    // → 3.14  (telo nanpa)
v3 = #|"abc"|     // → "abc"  (pona, pakala ala)

// sike / kipisi
π = 3.14159265
sike2 = #.2|π|      // → 3.14  (sike tawa ma 2)
sike4 = #.4|π|      // → 3.1416
kipisi2 = #!2|π|      // → 3.14  (kipisi)

// nasin pi sitelen nanpa
nasin = #,|1234567|  // → 1,234,567  (kepeken `,`)
sona = #^|12345.678|    // → 1.2345678e4  (sona sewi)

// nanpa lon
a = 0x41         // → 'A'  (nanpa luka luka)
b = 0b01000001   // → 'A'  (nanpa tu)
c = 0o101        // → 'A'  (nanpa luka tu)

// pana e toki pi nanpa ante
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## kepeken ilo *shell*

```zymbol
tenpo = <\ date +%Y-%m-%d \>     // kama jo e *stdout* (jo e \n lon pini)
>> "tenpo ni: " tenpo

lipu = "data.txt"
ijo = <\ cat {lipu} \>      // pana e nimi lon insa pi toki

pana = </"./subscript.zy"/>   // pali e lipu Zymbol ante, kama jo e pana
>> pana
```

> `><` li kama jo e toki CLI lon poki lipu nimi (tree-walker taso).

---

## ijo ale: FizzBuzz

```zymbol
poki(nanpa) {
    ? nanpa % 15 == 0 { <~ "FizzBuzz" }
    _? nanpa % 3  == 0 { <~ "Fizz" }
    _? nanpa % 5  == 0 { <~ "Buzz" }
    _ { <~ nanpa }
}

@ i:1..20 { >> poki(i) ¶ }
```

---

## lipu pi sitelen pali

| sitelen | pali | sitelen | pali |
|---------|------|---------|------|
| `=` | nimi ante | `$#` | suli |
| `:=` | nimi pi kama ala | `$+` | wan (ken mute) |
| `>>` | pana e toki | `$+[i]` | pana lon nanpa (1-li lon) |
| `<<` | kama jo e toki | `$-` | weka e ijo wan |
| `¶` / `\\` | linja sin | `$--` | weka e ijo ale |
| `?` | ni la | `$-[i]` | weka lon nanpa (1-li lon) |
| `_?` | ante la | `$-[i..j]` | weka e kipisi (1-li lon) |
| `_` | ante / ijo ale | `$?` | lon anu seme |
| `??` | sama | `$??` | alasa e nanpa ale (1-li lon) |
| `@` | mute pali | `$[s..e]` | kipisi (1-li lon) |
| `@ N { }` | mute pali N tenpo | `$>` | map |
| `@!` | pini | `$\|` | filter |
| `@>` | pali sin | `$<` | reduce |
| `@:nimi { }` | mute pali pi nimi lon | `$/ ilo` | pakala e lipu nimi |
| `@:nimi!` | pini pi nimi lon | `$++ a b c` | pali e poki sin |
| `@:nimi>` | pali sin pi nimi lon | `arr[i>j>k]` | nanpa tawa |
| `->` | pali pi lili | `arr[i] = ijo` | ante e ijo (poki taso) |
| `arr[i] += ijo` | ante tu | `arr[i]$~` | ante kepeken ilo (poki sin) |
| `$^+` | pana tawa suli (ijo taso) | `$^-` | pana tawa lili (ijo taso) |
| `$^` | pana kepeken lukin (poki tu) | `<~` | pana e ijo |
| `\|>` | nasin tawa | `!?` | o alasa |
| `:!` | kama jo | `:>` | pini la |
| `#1` | lon | `#0` | lon ala |
| `$!` | pakala anu seme | `$!!` | pana e pakala |
| `<#` | kama jo e poki | `#>` | pana e poki |
| `#` | open e poki pali | `::` | kepeken e poki pali |
| `.` | lukin e ma | `#?` | sona pi nasin ijo |
| `#\|..\|` | lukin e nanpa | `##.` | tawa telo nanpa |
| `###` | tawa nanpa suli (sike) | `##!` | tawa nanpa suli (kipisi) |
| `#.N\|..\|` | sike | `#!N\|..\|` | kipisi |
| `#,\|..\|` | nasin `,` | `#^\|..\|` | sona sewi |
| `#d0d9#` | ante e nasin pi nanpa sitelen | `#09#` | tawa ASCII |
| `<\ ..\>` | pali e ilo shell | `>\<` | toki CLI |
| `\ nimi` | weka e nimi | `°x` / `x°` | open wawa (open sama) |
| `>>|` | poki TUI (len ante) | `>>~` | pana e toki lon ma |
| `>>!` | pana e telo tawa len | `>>?` | wile sona e suli |
| `<<\|` | luka lawa (awen) | `<<\|?` | lukin luka lawa (awen ala) |
| `@~ N` | lape N tenpo lili | `$*` | pali e lipu nimi sama N tenpo |

---

## lipu ante

### v0.0.5 — ijo TUI, open wawa, en pali sama N tenpo _(tenpo pi mun tu wan 2026)_

- **pakala** ilo pi nasin sama: `nasin : pana` → `nasin => pana`
- **pakala** nimi ante pi kama jo: `<# nasin <= nimi` → `<# nasin => nimi`
- **pakala** ante nimi pi pana: `#> { pali <= jan }` → `#> { pali => jan }`
- **sin** poki TUI `>>| { }` — len ante + nasin wawa. ona li pana e telo lon tenpo weka.
- **sin** pana toki lon ma `>>~ (linja, palisa, BKS, fg, bg) > ijo` — ma ken weka, ANSI 256 kule
- **sin** luka lawa `<<| nimi` (awen) en `<<|? nimi` (lukin taso)
- **sin** `>>!` pana e telo tawa len, `>>?` wile sona e suli, `@~ N` lape N tenpo lili
- **sin** open wawa `°x` / `x°` — open sama e nimi lon tenpo open pi mute pali
- **sin** pali sama N tenpo `lipu $* N` — pali e lipu sama N tenpo
- **VM** pona: 436/436 pi ilo lukin li pona

### v0.0.4 — nanpa 1-li lon, pali pi nanpa wan, en poki pali pi nasin poki _(tenpo pi mun tu 2026)_

- **pakala** nasin nanpa li tawa **1-li lon**. `arr[1]` li ijo nanpa wan. `arr[0]` li pakala lon tenpo pali.
- **sin** pali pi nimi lon li **ijo pi nanpa wan**. o pana e ona tawa ilo HOF: `nanpa$> tu`
- **sin** **nasin poki li wile** tawa poki pali: `# nimi { ... }`. nasin ante li weka.
- **sin** nasin nanpa mute: `arr[i>j>k]` (tawa), `arr[p ; q]` (lukin)
- **sin** ante nasin ijo: `##.toki` (telo nanpa), `###toki` (nanpa suli sike), `##!toki` (nanpa suli kipisi)
- **sin** pakala e lipu nimi: `lipu$/ ilo` — li pana e `Array(lipu)`
- **sin** pali e poki sin: `open$++ a b c` — wan e ijo mute
- **sin** mute pali N tenpo: `@ N { }` — pali sama N tenpo
- **sin** nasin toki pi mute pali pi nimi lon: `@:nimi { }`, `@:nimi!`, `@:nimi>` — ona li ken e `@ @nimi` / `@! nimi`
- **sin** nasin pi ma nimi: nimi `_nimi` li jo e ma poki. `\ nimi` li weka e ona.
- **sin** nasin lukin pi sama: `< 0 =>`, `> 5 =>`, `== 42 =>`, en ante
- **sin** pakala poki pali E013: toki pali li ken ala lon insa pi poki pali.
- **pona** `alias.CONST` li pali pona. `#>` li ken lon tenpo kama pi toki pali.
- **VM** pona ale: 393/393 pi ilo lukin li pona

### v0.0.3 — nasin nanpa pi ilo Unicode en pona LSP _(tenpo pi mun tu 2026)_

- **sin** 69 poki nanpa pi ilo Unicode kepeken ilo ante `#d0d9#`
- **sin** lon lon nasin sitelen ale — `#१` / `#०`, `#१` / `#०`, en ante
- **sin** nanpa Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **sin** ilo VM `SetNumeralMode` — pona sama tree-walker
- **ante** `>>` li pana e `#` (`#0` / `#1`) lon tenpo ale

### v0.0.2_01 — ante nimi pi ilo pali _(tenpo suno 30 pi mun tu wan 2026)_

- **ante** `c|..|` → `#,|..|` en `e|..|` → `#^|..|` — ona li sama `#`
- **sin** nimi ante pi pana: pana e ijo pi poki pali kepeken nimi sin

### v0.0.2 — nasin sin pi poki en ilo pana _(tenpo suno 24 pi mun tu wan 2026)_

- **sin** ilo `$` wan tawa poki en lipu nimi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **sin** nasin pakala ijo tawa poki, poki tu, en poki tu pi nimi lon
- **sin** nanpa ike (`arr[-1]` = ijo pini)
- **sin** ilo pana — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(tenpo suno 25 pi mun tu wan 2026)_

- **sin** pana tu `^=`
- **pona** pakala pi ilo lukin nanpa. pona e lipu.

### v0.0.1 — open pi ilo Zymbol _(tenpo suno 22 pi mun tu wan 2026)_

- ijo *tree-walker* en *VM* ( `--vm`, ~4× wawa, ~95% pona)
- ijo ale: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- nimi Unicode ale, nasin poki pali, pali pi lili, pali pi awen, pakala
- *REPL*, *LSP*, *VS Code* ilo, nasin sitelen (`zymbol fmt`)

---

_Zymbol-Lang — sitelen tawa. ma ale. ken ala ante._
