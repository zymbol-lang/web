> **K'aaba Tsikbal:** Lela' tziib ku beetik yéetel ku bixaaktik AI.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Le tsikbal ku kaajil **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ti' le bejlae tsoolil.

---

# Yucatec Maya — Zymbol-Lang

> **Ku kaakabil v0.0.5 — 2026-05-12**

**Zymbol-Lang** bey tziib ku beetik xook. Mix taan — bey tsikbal. Ma' chan xok ti' bix u kaajil.

- Mix `if`, `while`, `return` — ti' `?`, `@`, `<~`
- Ka'a xook Unicode — kaab ti' bix taan
- Ti' bejlae — bey tsikbal ti' bejlae taan

**Tsikbal yaalil**: v0.0.5 | **Tsol xook**: 436/436 (TW ↔ VM parity)

---

## Tsool yéetel Kaabal

```zymbol
x = 10              // tsool kaabal
PI := 3.14159       // kaabal — ku bisik k'as
kaab = "Sak"
kiimil = #1        // tsol kaab true
👋 := "Bix"
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

`°` (degree sign, U+00B0) ku kaajil tsol kaabal ti' ka'a bin:

```zymbol
tsool = [3, 1, 4, 1, 5]
@ n:tsool {
    °kaachi += n    // ku kaajil 0 ti' ka'a hochpahal; ku kuchul
}
>> kaachi ¶         // → 14
```

> `°x` (prefix) ku kaajil ti' ka'a hochpahal — ku kuchul tun @.
> `x°` (postfix) ku kaajil ti' hochpahal — ku kaaj tun tu ka'a.
> Tree-walker bey.

---

## Xook Tziib

| Xook | Tziib | `#?` | Bey |
|------|---------|----------|-------|
| Int | `42`, `-7` | `###` | 64-bit signed |
| Float | `3.14`, `1.5e10` | `##.` | Scientific notation OK |
| String | `"tziib"` | `##"` | Ku tziib: `"Bix {kaab}"` |
| Char | `'A'` | `##'` | Ka'a tziib Unicode |
| Bool | `#1`, `#0` | `##?` | Ma' xook — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Ka'a tsol |
| Tuple | `(a, b)` | `##)` | Yaalil |
| Named Tuple | `(x: 1, y: 2)` | `##)` | Kaab yaalil |
| Function | named function ref | `##()` | First-class; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-class; `<lambd/N>` |

```zymbol
// xook tziib — ku ookol (xook, yaalil, bey)
meentaan = 42#?
>> meentaan ¶         // → (###, 2, 42)
t = meentaan[1]
>> t ¶            // → ###
```

---

## Ookol yéetel Hochpahal

```zymbol
>> "Bix" ¶                      // ¶ waye \\ ku bin
>> "a=" a " b=" b ¶               // ka'a bej — ti' >>
>> (tsoolil$#) ¶            // bey tsikbal ti' ( ) tu >>

<< kaab                           // ku hochpahal (mix bey)
<< "Ka'a k'aab: " kaab  // yéetel bey
```

> `¶` (AltGr+R ti' Spanish keyboard) yéetel `\\` ka'a bejlae.

---

## TUI Bey

TUI bey tsikbal ku beetik bix xook. Mix ku k'aabtik `>>| { }`.

```zymbol
>>| {
    >>!                             // ku bisik ookol tziib
    >>~ (1, 1, 0, 10) > "Bin"  // yaalil 1, kaab 1, tsukul=10 (yax)
    @~ 1000                         // ku kaajtik 1 tsol (1000 ms)
    >>~ (2, 1) > "Listo."
}
// tziib ku kuchul ti' ka'a bej
```

```zymbol
// tsuul yéetel tsol tziib
>>| {
    [tsolile, naakal] = >>?              // ku k'amik tsol tziib
    >>~ (1, 1) > "Tziib: " tsolile " x " naakal
    <<| tsuul                         // ku kaajtik tsuul
    >>~ (2, 1) > "Kuchul: " tsuul
}
```

> `>>!` ku bisik tziib. `>>?` ku ookol `[rows, cols]`. `@~ N` ku kaajtik N milliseconds.
> `<<|` ku kaajtik tsuul; `<<|?` ku bin (ku ookol `'\0'` mix).
> `(row, col, BKS, fg, bg)` — tsol waye ku bisik (`>>~ (,,, 196) > "red"`).
> BKS: `1`=Bold, `2`=Italic, `4`=Underline. ANSI 256-color (`0`=terminal default).
> Tree-walker bey (mix `>>!`, `>>?`, `@~`, `>>~` ku bin `--vm`).

---

## Bey Xook Tsikbal

```zymbol
// tsol xook
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (xook tsol)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (k'ina tsol)

// tseeltik — ku kaab xook
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// tsol kaab
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Tziib

```zymbol
// ka'a bej ku tsoolte
kaab = "Sak"
n = 42

>> "Bix " kaab " tu " n ¶    // ka'a bej — ti' >>
meentaan = "Bix {kaab}, tu {n}"  // ku tziib — ti' bejlae
```

```zymbol
s = "Bix Kaab"
yalak = s$#                  // 8
tsoolbis = s$[1..3]          // "Bix"  (1-yaalil, yéetel kaab)
uchul = s$? "Kaab"              // #1
laak = "a,b,c,d"$/ ','      // [a, b, c, d]
bisik = s$~~["i":"e"]       // ku bisik
bisik1 = s$~~["i":"e":1]   // ka'a ku bisik
tsol = "─" $* 20           // "────────────────────"
```

> `+` xook bey. Ti' `,`, ka'a bej, yéetel ku tziib tziib bey.

---

## Bejlae Béeytal

```zymbol
x = 7

? x > 0 { >> "Maalo" ¶ }

? x > 100 {
    >> "Nohoch" ¶
} _? x > 0 {
    >> "Maalo" ¶
} _? x == 0 {
    >> "Mix" ¶
} _ {
    >> "Maat" ¶
}
```

> `{ }` ku k'aabtik ka'a tsikbal waye.

---

## Tseeltik

```zymbol
// tsol xook
tsool = 85
beetaan = ?? tsool {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> beetaan ¶    // → B

// tziib
tsukul = "Seel"
meentaan = ?? tsukul {
    "Seel"   => "#FF0000"
    "Yax" => "#00FF00"
    _       => "#000000"
}

// tsol bey tseeltik
choko = -5
tuux = ?? choko {
    < 0  => "Seel"
    < 20 => "Xib"
    < 35 => "Choko"
    _    => "Tabi"
}
>> tuux ¶    // → Seel

// bey tsikbal (bey xook)
n = -3
?? n {
    0    => { >> "Mix" ¶ }
    < 0  => { >> "Maat" ¶ }
    _    => { >> "Maalo" ¶ }
}
```

---

## Hochpahal

```zymbol
@ i:0..4  { >> i " " }        // tsol xook:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // yéetel yaan:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ka'a bej:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (ka'a hochpahal)

janal = ["Ixim", "Chico", "Uts"]
@ f:janal { >> f ¶ }         // tu tsoolil

@ c:"Bix" { >> c "-" }
>> ¶                          // → B-i-x-  (tu tziib)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> ka'a bin
    ? i > 7 { @! }             // @! kaaj
    >> i " "
}
>> ¶                          // → 1 3 5 7

// hochpahal mix kaaj
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// tsol kaab hochpahal (bisik kaaj)
yalak = 0
@:waye {
    yalak++
    ? yalak >= 3 { @:waye! }
}
>> yalak ¶                    // → 3
```

---

## Bey Xook

```zymbol
suutu(a, b) { <~ a + b }
>> suutu(3, 4) ¶    // → 7

factoriaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factoriaal(n - 1)
}
>> factoriaal(5) ¶    // → 120
```

Bey xook ku k'aabtik — ma' ku kaajil ti' laak tsool. Ti' `<~` ku bin:

```zymbol
bisik(a<~, b<~) {
    chukaan = a
    a = b
    b = chukaan
}
x = 10
y = 20
bisik(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Bey xook **first-class** — ku bin: `tsool$> kaap`. Waye: `x -> fn(x)` ku bin.

---

## Lambdas yéetel Tseeltik

```zymbol
kaap = x -> x * 2
suutu = (a, b) -> a + b
>> kaap(5) ¶    // → 10
>> suutu(3, 7) ¶    // → 10

// bey xook tsikbal
tsoolte = x -> {
    ? x > 0 { <~ "Maalo" }
    _? x < 0 { <~ "Maat" }
    <~ "Mix"
}

// tseeltik — ku kaajil ti'
factor = 3
oxte = x -> x * factor
>> oxte(7) ¶    // → 21

// bey xook
okol(n) { <~ x -> x + n }
suutu10 = okol(10)
>> suutu10(5) ¶    // → 15

// ti' tsoolil
tsoolop = [x -> x+1, x -> x*2, x -> x*x]
>> tsoolop[3](5) ¶    // → 25
```

---

## Tsoolil

Tsoolil **ku kaab** yéetel ku kaajil tsol **ka'a tsol**.

```zymbol
tsoolil = [1, 2, 3, 4, 5]

x = tsoolil[1]      // 1 — ku kaajil (1-yaalil: cha'a)
x = tsoolil[-1]     // 5 — tsol kaab (u kaajil)
x = tsoolil$#       // 5 — yaalil (ti' (tsoolil$#) tu >>)

tsoolil = tsoolil$+ 6            // ku kaab → [1,2,3,4,5,6]
arr2 = tsoolil$+[2] 99       // ti' yaalil 2 (1-yaalil)
arr3 = tsoolil$- 3           // ku bisik ka'a ka'a
arr4 = tsoolil$-- 3          // ku bisik bejlae
arr5 = tsoolil$-[1]          // ku bisik yaalil 1
arr6 = tsoolil$-[2..3]       // ku bisik tsol

uchul = tsoolil$? 3            // #1 — ti'
naats = tsoolil$?? 3           // [3] — bejlae yaalil (1-yaalil)
tsoolbis = tsoolil$[1..3]          // [1,2,3]
tsoolbis2 = tsoolil$[1:3]          // [1,2,3]

naats_bin = tsoolil$^+             // ku tsool (xook)
keban_bin = tsoolil$^-            // ku tsool (tsol)

// ka'a kaab tsoolil — $^ yéetel tseeltik
meentaan = [(kaab: "Yax", tsol: 28), (kaab: "Ik", tsol: 25), (kaab: "Sak", tsol: 30)]
kin_tsool  = meentaan$^ (a, b -> a.tsol < b.tsol)    // ku tsool tsol  (<)
kaab_tsool = meentaan$^ (a, b -> a.kaab > b.kaab)  // ku tsool kaab (>)
>> kin_tsool[1].kaab ¶     // → Ik
>> kaab_tsool[1].kaab ¶    // → Yax

// ku bis xook (tsoolil bey)
tsoolil[1] = 99              // ku kaab
tsoolil[2] += 5              // ka'a bey: +=  -=  *=  /=  %=  ^=

// ku bis xook — ku ookol bey; ma' ku bis
arr2 = tsoolil[2]$~ 99
```

> Ka'a bey tsikbal ku ookol **bejlae tsoolil**.
> `$+` ku tsoolte: `tsoolil = tsoolil$+ 5$+ 6$+ 7`.
> **1-yaalil**: `tsoolil[1]` cha'a; `tsoolil[0]` k'as.
> `$^+` / `$^-` tsol xook. Ka'akaab ti' `$^` yéetel tseeltik.

**Tsol kaab** — ku tsoolte ka'a tsoolil yéetel ka'a kaab ku ookol bejlae:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ma' ku bis
```

```zymbol
// ka'a tsoolil (1-yaalil)
patal = [[1,2,3],[4,5,6],[7,8,9]]
>> patal[2][3] ¶    // → 6  (tsol 2, kaab 3)
```

---

## Bisaal

```zymbol
// tsoolil
tsoolil = [10, 20, 30, 40, 50]
[a, b, c] = tsoolil              // a=10  b=20  c=30
[naats, *laak] = tsoolil         // naats=10  laak=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ku bisik

// yaalil ka'akaab
kamas = (100, 200)
(px, py) = kamas             // px=100  py=200

// kaab ka'akaab
winik = (kaab: "Ik", tsol: 25, bejlae: "Chichen")
(kaab: n, tsol: a) = winik   // n="Ik"  a=25
```

---

## Ka'akaab

Ka'akaab **ma' ku bis** ku kaajil tsol **ka'a xook tziib**.
Ma' tsoolil, ma' ku bis.

```zymbol
// yaalil — ka'a tsol ku bin
kamas = (10, 20)
>> kamas[1] ¶    // → 10

meentaan = (42, "Bix", #1, 3.14)
>> meentaan[3] ¶     // → #1

// kaab
winik = (kaab: "Sak", tsol: 25)
>> winik.kaab ¶    // → Sak
>> winik[1] ¶      // → Sak  (ku bin, 1-yaalil)

// ka'a tsol
kamas2 = (x: 10, y: 20)
p = (kamas2: kamas2, kaab: "Chichen")
>> p.kamas2.x ¶        // → 10
```

**Ma' ku bis** — ku tsoolte ka'akaab k'as:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ k'as: ka'akaab ma' ku bis
// t[1] += 5    // ❌ k'as waye
```

Ti' `$~` (ku bin) — ku ookol **bejlae** ka'akaab:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← ma' ku bis
>> t2 ¶    // → (10, 999, 30)

// kaab ka'akaab — ku ka'a xook
winik = (kaab: "Sak", tsol: 25)
nohoch  = (kaab: winik.kaab, tsol: 26)
>> winik.tsol ¶    // → 25
>> nohoch.tsol ¶     // → 26
```

---

## Nohoch Bey Xook

```zymbol
akihtasona = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kaapt  = akihtasona$> (x -> x * 2)                // ku bis  → [2,4,6…20]
nisowatam   = akihtasona$| (x -> x % 2 == 0)           // ku tseeltik → [2,4,6,8,10]
kaachi    = akihtasona$< (0, (acc, x) -> acc + x)     // ku tsol → 55

// ku tsoolte
step1 = akihtasona$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// bey xook ku bin ti' HOF
kaap(x) { <~ x * 2 }
nohoch(x) { <~ x > 5 }
r = akihtasona$> kaap       // ✅ ku bin
r = akihtasona$| nohoch          // ✅ ku bin
```

---

## Bin Yookol Bey

Ku k'aabtik `_` bey tsikbal:

```zymbol
kaap = x -> x * 2
suutu = (a, b) -> a + b
yaan = x -> x + 1

r1 = 5 |> kaap(_)        // → 10
r2 = 10 |> suutu(_, 5)       // → 15
r3 = 5 |> suutu(2, _)        // → 7

// ku tsoolte
r = 5 |> kaap(_) |> yaan(_) |> kaap(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Xook Meenel

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Division tu mix" ¶
} :! {
    >> "Laak: " _err ¶    // _err ku kaajil k'as
} :> {
    >> "Siempre bin" ¶
}
```

| Xook | Tun |
|------|------|
| `##Div` | Division tu mix |
| `##IO` | Tziib / tsikbal |
| `##Index` | Yaalil k'as |
| `##Type` | Xook k'as |
| `##Parse` | Ka'a xook |
| `##Network` | Ka'anal k'as |
| `##_` | Bejlae k'as (catch-all) |

---

## Bejlae Tsoolil

```zymbol
// lib/tsol.zy — tsoolil bey tsikbal
# tsol {
    #> { suutu, mamo_PI }

    _PI := 3.14159
    suutu(a, b) { <~ a + b }
    mamo_PI() { <~ _PI }
}
```

```zymbol
// kaajil.zy
<# ./lib/tsol => c    // ka'a tsikbal

>> c::suutu(5, 3) ¶     // → 8
pi = c::mamo_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// ku ookol ka'a kaab
# laaktsoolil {
    #> { _xibsuutu => kaachi }

    _xibsuutu(a, b) { <~ a + b }
}
```

```zymbol
<# ./laaktsoolil => m

>> m::kaachi(3, 4) ¶    // → 7  (ku bisik _xibsuutu)
```

> **Tsoolil bey**: `#>`, bey xook, yéetel tsool kaabal ti' `# kaab { }`. Tsikbal (`>>`, `<<`, hochpahal, etc.) E013 k'as.

---

## Tsol Xook Tziib

Zymbol ku ookol xook ti' **69 Unicode** — Devanagari, Arabic-Indic, Thai, Maya, yéetel laak. Ku bin `>>` bey; arithmetic ASCII.

### Paktik Tsol Xook

Ku tziib `0` yéetel `9` ti' `#…#`:

```zymbol
#𝋠𝋩#    // Maya Numerals  (U+1D2E0–U+1D2F3)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ku kuchul ASCII
```

### Ookol yéetel Tsol Kaab

```zymbol
#𝋠𝋩#
x = 42
>> x ¶          // → 𝋤𝋢   (modo maya activo)
>> 3.14 ¶       // → 𝋣.𝋡𝋤   (punto decimal ASCII siempre)

#09#
>> x ¶          // → 42   (ASCII yéetel)

// Bool: # ASCII siempre, xook ku p'áatal
>> #1 ¶         // → #𝋡   (jaajil ti' Maya)
>> #0 ¶         // → #𝋠   (ma'atech — ma' ti' 𝋠 entero cero)

x = 28 > 4
>> x ¶          // → #𝋡   (resultado comparación ku bin ti' modo)
```

### Tziib Tsol Xook Ti Kaan

Ka'a xook ku bin — ti' tsol, modulo, tseeltik:

```zymbol
#𝋠𝋩#

@ i:𝋡..𝋯 {
    ? i % 𝋯 == 𝋠 { >> "FizzBuzz" ¶ }
    _? i % 𝋣  == 𝋠 { >> "Fizz" ¶ }
    _? i % 𝋥  == 𝋠 { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Tsol Kaab Ti Bejlae Tsol Xook

`#` + xook `0` waye `1` ti' bejlae tsol ku bin:

```zymbol
#𝋠𝋩#
kiimil = #𝋡        // same as #1
>> kiimil ¶        // → #𝋡
>> (#𝋡 && #𝋠) ¶ // → #𝋠
```

> `#` **ASCII**. `#0` (false) ma' `0` (xook mix) ti' bejlae tsol.

---

## Tsol Bey

```zymbol
// ku bis xook tziib
f = ##.42         // → 42.0  (ti' Float)
i = ###3.7        // → 4     (ti' Int, tsol)
t = ##!3.7        // → 3     (ti' Int, bisik)

// ku tziib xook
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (mix k'as)

// tsol / bisik
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (tsol 2)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (bisik)

// tziib xook
itwewin = #,|1234567|  // → 1,234,567
akihtasiskahkew = #^|12345.678|    // → 1.2345678e4

// bey tsol
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// ku ookol bey tsol
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ka'anal Bin

```zymbol
kin = <\ date +%Y-%m-%d \>     // ku kaajil stdout (yéetel \n)
>> "Bejlae: " kin

huun = "tipahinamowin.txt"
tiich = <\ cat {huun} \>      // ku tziib xook

kuchul = </"./subscript.zy"/>   // ku bin Zymbol, ku kaajil
>> kuchul
```

> `><` ku kaajil CLI xook (tree-walker bey).

---

## Yaanal Xook: FizzBuzz

```zymbol
tsoolte(akihtam) {
    ? akihtam % 15 == 0 { <~ "FizzBuzz" }
    _? akihtam % 3  == 0 { <~ "Fizz" }
    _? akihtam % 5  == 0 { <~ "Buzz" }
    _ { <~ akihtam }
}

@ i:1..20 { >> tsoolte(i) ¶ }
```

---

## Bey Tziib

| Bey | Tsikbal | Bey | Tsikbal |
|--------|-----------|--------|-----------|
| `=` | tsool | `$#` | yaalil |
| `:=` | kaabal | `$+` | ku kaab |
| `>>` | ookol | `$+[i]` | ti' yaalil (1-yaalil) |
| `<<` | hochpahal | `$-` | ku bisik ka'a |
| `¶` / `\` | ka'a k'iin | `$--` | ku bisik bejlae |
| `?` | wa | `$-[i]` | ku bisik yaalil (1-yaalil) |
| `_?` | waye ka | `$-[i..j]` | ku bisik tsol |
| `_` | waye / bejlae | `$?` | ti' |
| `??` | tseeltik | `$??` | bejlae yaalil (1-yaalil) |
| `@` | hochpahal | `$[s..e]` | tsol (1-yaalil) |
| `@ N { }` | hochpahal N tsol | `$>` | ku bis |
| `@!` | kaaj | `$\|` | ku tseeltik |
| `@>` | ka'a bin | `$<` | ku tsol |
| `@:kaab { }` | tsol kaab hochpahal | `$/ delim` | ku tsoolte tziib |
| `@:kaab!` | kaaj tsol kaab | `$++ a b c` | ku tsoolte |
| `@:kaab>` | ka'a bin tsol kaab | `arr[i>j>k]` | tsol yaalil |
| `->` | lambda | `arr[i] = val` | ku bis (tsoolil bey) |
| `arr[i] += val` | ka'a bey ku bis | `arr[i]$~` | ku bis bey |
| `$^+` | tsol naats (xook) | `$^-` | tsol keban (xook) |
| `$^` | tsol yéetel tseeltik | `<~` | ku ookol |
| `\|>` | bin yookol | `!?` | ku bin |
| `:!` | ku kaajil k'as | `:>` | siempre ku bin |
| `#1` | tsol true | `#0` | tsol false |
| `$!` | k'as ti' | `$!!` | ku bis k'as |
| `<#` | ku hochpahal | `#>` | ku ookol |
| `#` | tsoolil kaab | `::` | tsoolil ku bin |
| `.` | kaab ku bin | `#?` | xook tziib |
| `#\|..\|` | ku tziib xook | `##.` | ti' Float |
| `###` | ti' Int (tsol) | `##!` | ti' Int (bisik) |
| `#.N\|..\|` | tsol | `#!N\|..\|` | bisik |
| `#,\|..\|` | tziib xook | `#^\|..\|` | ka'anal xook |
| `#d0d9#` | tsol xook tziib | `#09#` | ku kuchul ASCII |
| `<\ ..\>` | ku bin kanal | `><` | CLI xook |
| `\ var` | ku bisik tsool | `°x` / `x°` | ku kaajil tsool |
| `>>\|` | TUI bey | `>>~` | ku bin xook |
| `>>!` | ku bisik tziib | `>>?` | ku k'amik tsol tziib |
| `<<\|` | ku kaajtik tsuul | `<<\|?` | ka'a bin tsuul |
| `@~ N` | ku kaajtik N milliseconds | `$*` | ku tsoolte tziib N |

---

## Kaakabil Xook

### v0.0.5 — TUI Bey, Ku Kaajil & Tziib Ku Tsoolte _(Ka'a Tsol 2026)_

- **Ku bis** Match arm: `pattern : result` → `pattern => result`
- **Ku bis** Import alias: `<# path <= alias` → `<# path => alias`
- **Ku bis** Export rename: `#> { fn <= pub }` → `#> { fn => pub }`
- **Ku kaab** TUI `>>| { }` — alternate screen + raw mode
- **Ku kaab** `>>~ (row, col, BKS, fg, bg) > items`
- **Ku kaab** `<<| var` (ku kaajtik) yéetel `<<|? var`
- **Ku kaab** `>>!`, `>>?`, `@~ N`
- **Ku kaab** `°x` / `x°`
- **Ku kaab** Tziib ku tsoolte `str $* N`
- **VM** Parity: 436/436

### v0.0.4 — 1-Yaalil, First-Class Bey Xook & Tsoolil Bey _(Ka'a Tsol 2026)_

- **Ku bis** Bejlae 1-yaalil — `arr[1]` cha'a; `arr[0]` k'as
- **Ku kaab** Bey xook **first-class** — `akihtasona$> kaap`
- **Ku kaab** Tsoolil **block syntax**: `# kaab { ... }`
- **Ku kaab** Ka'a tsol: `arr[i>j>k]`, `arr[p ; q]`
- **Ku kaab** Ku bis: `##.expr` (Float), `###expr` (Int), `##!expr` (Int)
- **Ku kaab** Tziib tsoolte: `str$/ delim`
- **Ku kaab** Tsoolte: `base$++ a b c`
- **Ku kaab** Times loop: `@ N { }`
- **Ku kaab** Tsol kaab hochpahal: `@:kaab { }`, `@:kaab!`, `@:kaab>`
- **Ku kaab** `_kaab` bey; `\ var` ku bisik
- **Ku kaab** Tseeltik: `< 0 :`, `> 5 :`, `== 42 :`
- **VM** 393/393

### v0.0.3 — Unicode Tsol Xook & LSP _(Ka'a Tsol 2026)_

- **Ku kaab** 69 Unicode `#d0d9#`
- **Ku kaab** Tsol kaab ti' bejlae — `#1` / `#0`
- **Ku kaab** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ku kaab** `SetNumeralMode` VM opcode
- **Ku bis** Bool `>>` ti' `#` prefix (`#0` / `#1`)

### v0.0.2_01 — Bey Tsikbal Ku Bis _(30 Mar 2026)_

- **Ku bis** `c|..|` → `#,|..|` yéetel `e|..|` → `#^|..|`
- **Ku kaab** Export alias

### v0.0.2 — Tsoolil API Ku Bis & Kanal _(24 Mar 2026)_

- **Ku kaab** `$` bey (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ku kaab** Bisaal tsoolil, ka'akaab, kaab ka'akaab
- **Ku kaab** Tsol keban (`arr[-1]`)
- **Ku kaab** installers — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Ku kaab** Compound assignment `^=`
- **Ku bis** Parser edge cases

### v0.0.1 — Ka'a Bin _(22 Mar 2026)_

- Tree-walker + register VM (`--vm`, ~4× nohoch, ~95% parity)
- Ka'a bin: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode identifiers, tsoolil, lambdas, closures, k'as tsikbal
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Bey Tziib. Ti' Bejlae. Ma' Ku Bis._
