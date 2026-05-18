> **Nataangu:** Xibaar wi nga xam ne moo koy sos ak faranse ak xam-xam bu dor-la (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Turam-teere bu am solo mooy **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ci samaar bu faranse.

---

# Njàngale bu Zymbol-Lang

> **Nuy ko defaral v0.0.5 — 2026-05-14**

**Zymbol-Lang** làkk wu natt. Amul fukkeer — nekk ko natt. Moo natt ci làkk bu nit ku ne.

- Amul `if`, `while`, `return` — sukkandiku `?`, `@`, `<~`
- Unicode weex — tur ci làkk bu ne ci emoji
- Du nekk ci làkk bu nit — kood bi nekk melokaan ci anam wu ne

**Farans bi**: v0.0.5 | **Test bawoo**: 436/436 (boo mel ni TW ↔ VM)

---

## Wutti yi ak tegt yi

```zymbol
x = 10              // wutti bu daj
π := 3.14159        // tegt — lakk ci wàllu maana du ko def
turu = "Alisi"
jëfandikoo = #1         // bool bu gëna
👋 := "Salaam aleekum"
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

`°` (natt bi ngir digiri, U+00B0) daj na wutti ci anam gu safaanu ci doj bu xam-xam bu njëkk:

```zymbol
xibaar = [3, 1, 4, 1, 5]
@ n:xibaar {
    jëm += n    // daj ci anam gu safaanu ci kaw lipp; dëgg na ci rug li @
}
>> jëm ¶         // → 14
```

> `°x` (kanam) nekk ci kaw lipp — faramfaram bi doon xëy dégg ci rug li `@`.
> `x°` (gàdda) nekk ci biir lipp — dee na su lipp man.
> Tree-walker moom rekk.

---

## Xam-xamu xibaar yi

| Wàllu | Ki la | Natt bi `#?` | Xibaar yi |
|------|---------|----------|---------|
| Lim bu wétt | `42`, `-7` | `###` | 64-bit bu am natt |
| Bu jeex | `3.14`, `1.5e10` | `##.` | Mbindum xam-xam nekk |
| Xibaar bu yax | `"mbind"` | `##"` | Lim ci biir: `"Salaam aleekum {turu}"` |
| Xarala | `'A'` | `##'` | Xarala wu Unicode ju jékk |
| Bool | `#1`, `#0` | `##?` | Du lim — `#1 ≠ 1` |
| Làkk | `[1, 2, 3]` | `##]` | Xam-xamu melo bu benn |
| Tuple | `(a, b)` | `##)` | Ci anam wu mel |
| Tuple bu am tur | `(x: 1, y: 2)` | `##)` | Càll mi am tur |
| Jëfandikoo | natt bu jëfandikoo bu am tur | `##()` | Klas bu njëkk; mboole `funct/N` |
| Lambda | `x -> x * 2` | `##->` | Klas bu njëkk; mboole `lambd/N` |

```zymbol
// Xayme wàllu — wax (wàllu, lim yi, doj)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Ci biir ak ci wàllu

```zymbol
>> "Salaam aleekum" ¶                       // ¶ wala \\ ngir wétt wi jóge
>> "a=" a " b=" b ¶               // niki benn — xibaar yi bu bari
>> (arr$#) ¶                      // gàdda jëfandikoo wi bëgg ( ) ci >>

>> turu                           // dig nga ci wutti (ba ne)
>> "Tur nga: " turu            // ci wàllu
```

> `¶` (AltGr+R ci tastatura bu Españaa) ak `\\` benn melo bu wétt.

---

## Primitive TUI

Jëfandikoo yi ci diggante cat ak program yu jublu. Biir bi bëgg `>>| { }` (wétt wi leneen + mode raw).

```zymbol
>>| {
    >>!                             // wétt wi leneen leen
    >>~ (1, 1, 0, 10) > "Da nga xam"   // wétt 1, kolom 1, fg=10 (werte)
    @~ 1000                         // bayyi 1 seconde (1000 ms)
    >>~ (2, 1) > "Noppi."
}
// cat dina doon bokk ci anam gu safaanu
```

```zymbol
// Ki tàkka ak mag ca cat
>>| {
    [wétt yi, kolom yi] = >>?              // nañ nga xam mag ca cat
    >>~ (1, 1) > "Cat: " wétt yi " x " kolom yi
    <<| tàkk                         // tàkk wu dajj
    >>~ (2, 1) > "Nga tàkk: " tàkk
}
```

> `>>!` leen wétt. `>>?` wax `[wétt yi, kolom yi]`. `@~ N` neat na N milliseconde.
> `<<|` tàkk wu benn (dajj); `<<|?` baaxul dajj (deexu `\0` bu amul)
> Tuple wu ci biir bu am: `(wétt, kolom, BKS, fg, bg)` — fuglu bi keneen man a fa dige (`>>~ (,,, 196) > "xees"`).
> BKS bi: `1`=sant, `2`=juge, `4`=wétt ci suuf. ANSI 256 melo kaani (`0`=caat bu cat).
> Tree-walker moom rekk (te ba ci `>>!`, `>>?`, `@~`, `>>~` day ci `--vm`).

---

## Jëfandikoo yi

```zymbol
// Xayme
a = 10
b = 3
n1 = a + b    // 13
n2 = a - b    // 7
n3 = a * b    // 30
n4 = a / b    // 3  (lim bu wétt bay)
n5 = a % b    // 1
n6 = a ^ b    // 1000  (doj)

// Weesu — def lool ngir xayme
w1 = a == b    // #0
w2 = a <> b    // #1
w3 = a < b     // #0
w4 = a <= b    // #0
w5 = a > b     // #1
w6 = a >= b    // #1

// Xam-xam
x1 = #1 && #0    // #0
x2 = #1 || #0    // #1
x3 = !#1         // #0
```

---

## Mbindu bu yax

```zymbol
// Maner yi jege
turu = "Alisi"
n = 42

>> "Salaam aleekum " turu " nga am " n ¶       // niki benn — ci >>
mbind = "Salaam aleekum {turu}, nga am {n}"     // lim ci biir — ci anam bu ne
```

```zymbol
s = "Salaam aleekum àdduna"
guddi = s$#                  // 11
téer = s$[1..5]             // "Sal a"  (1-caay, mu man fa)
am = s$? "àdduna"          // #1
wétt yi = "a,b,c,d"$/ ','   // [a, b, c, d]  (bay ci biir bi)
dox = s$~~["l":"r"]        // "Salaam aleekum àdduna" (xalaat)
dox1 = s$~~["l":"r":1]     // "Salaam aleekum àdduna"
wétt = "─" $* 20           // "────────────────────"  (dox N)
```

> `+` lim moo ko jam. Ngir mbindu bu yax, jëfandikoo `,`, niki benn, wala lim ci biir.

---

## Liggéey bi

```zymbol
x = 7

? x > 0 { >> "baax" ¶ }

? x > 100 {
    >> "mag" ¶
} _? x > 0 {
    >> "baax" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "bon" ¶
}
```

> `{ }` **am na solo** su nekk benn qër

---

## Melo

```zymbol
// Jaare
doj = 85
grad = ?? doj {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> grad ¶    // → B

// Mbindu bu yax
meloo = "xees"
kood = ?? meloo {
    "xees"   => "#FF0000"
    "werte" => "#00FF00"
    _       => "#000000"
}

// Natt yu weesu
tàng = -5
jëfandikoo = ?? tàng {
    < 0  => "womb"
    < 20 => "tàng"
    < 35 => "tàng"
    _    => "tàng"
}
>> jëfandikoo ¶    // → womb

// Melo wu qër (fukkeer bi)
n = -3
?? n {
    0    => { >> "nul" ¶ }
    < 0  => { >> "bon" ¶ }
    _    => { >> "baax" ¶ }
}
```

---

## Lipp yi

```zymbol
@ i:0..4  { >> i " " }        // jaare bi def:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ci taal:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ginnaaw:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (tey)

lépp = ["pom", "pire", "reyin"]
@ l:lépp { >> l ¶ }         // ci anam wu nit nit

@ a:"hello" { >> a "-" }
>> ¶                          // → h-e-l-l-o-  (ci biir xarala)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> yéen
    ? i > 7 { @! }             // @! kuy
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Lipp bu ku
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Lipp bu am natt (kuy ci biir)
lim = 0
@:biir {
    lim++
    ? lim >= 3 { @:biir! }
}
>> lim ¶                    // → 3
```

---

## Jëfandikoo yi

```zymbol
yokku(a, b) { <~ a + b }
>> yokku(3, 4) ¶    // → 7

faktoriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyel(n - 1)
}
>> faktoriyel(5) ¶    // → 120
```

Jëfandikoo yi am na **ne ci biir** — du xam wutti yi ci biir. Jëfandikoo `<~>` ngir wutti yi ci xam-xam:

```zymbol
dox(a<~, b<~) {
    feebar = a
    a = b
    b = feebar
}
x = 10
y = 20
dox(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Jëfandikoo yi am tur **laaj wu njëkk** — dig ci biir: `xibaar yi$> ñaari`. Ngir xott, `x -> fn(x)` itam am solo.

---

## Lambda ak Juge ci biir

```zymbol
ñaari = x -> x * 2
yokku = (a, b) -> a + b
>> ñaari(5) ¶    // → 10
>> yokku(3, 7) ¶  // → 10

// Lambda ci biir
wees = x -> {
    ? x > 0 { <~ "baax" }
    _? x < 0 { <~ "bon" }
    <~ "nul"
}

// Juge ci biir — dafa xam wutti yi ci biir
melo = 3
ñetti = x -> x * melo
>> ñetti(7) ¶    // → 21

// Fabrique
defar_yokku(n) { <~ x -> x + n }
yokku_fukk = defar_yokku(10)
>> yokku_fukk(5) ¶    // → 15

// Ci làkk bi
jëfandikoo yi = [x -> x+1, x -> x*2, x -> x*x]
>> jëfandikoo yi[3](5) ¶    // → 25
```

---

## Làkk bi

Làkk bi **daj** na, te am **wàllu bu benn**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — xëy (1-caay: wàllu bu njëkk)
x = arr[-1]     // 5 — natt bu bëgg (wàllu bu gàdda)
x = arr$#       // 5 — guddi (jëfandikoo (arr$#) ci >>)

arr = arr$+ 6            // yokku → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // dugal ci 2 (1-caay)
arr3 = arr$- 3           // wàllu bi njëkk
arr4 = arr$-- 3          // wàllu bi wépp
arr5 = arr$-[1]          // ci natt 1 (wàllu bu njëkk)
arr6 = arr$-[2..3]       // wàllu ci jaare (1-caay, mu man)

am = arr$? 3            // #1 — am
fa = arr$?? 3           // [3] — natt yi wépp (1-caay)
téer = arr$[1..3]          // [1,2,3] — téer (1-caay, mu man)
téer2 = arr$[1:3]          // [1,2,3] — melo wu benn, xayme ci lim

yépp = arr$^+             // wërsët yépp (primitive rekk)
yépp = arr$^-            // wërsët yépp (primitive rekk)

// Làkk bi Tuple am tur/ci anam wu mel — jëfandikoo $^ ak lambda wi wees
dab = [(turu: "Carla", at: 28), (turu: "Ana", at: 25), (turu: "Bob", at: 30)]
ci_at  = dab$^ (a, b -> a.at < b.at)    // ci at yépp (<)
ci_turu = dab$^ (a, b -> a.turu > b.turu)   // ci turu yépp (>)
>> ci_at[1].turu ¶     // → Ana
>> ci_turu[1].turu ¶    // → Carla

// Wàllu bi daj (làkk bi rekk)
arr[1] = 99              // def
arr[2] += 5              // ci melo: +=  -=  *=  /=  %=  ^=

// Jëfandikoo ci biir — dëggalu làkk bu bees; bu njëkk du daj
arr2 = arr[2]$~ 99
```

> Jëfandikoo yi wépp ci xam-xam **làkk bu bees** dëggal. Def ko: `arr = arr$+ 4`.
> `$+` di fara: `arr = arr$+ 5$+ 6$+ 7`. Jëfandikoo yi wépp di jëfandikoo def bi ci biir.
> **Natt bi 1-caay**: `arr[1]` mooy wàllu bu njëkk; `arr[0]` mooy baat bi ci wàllu man.
> `$^+` / `$^-` di wërsët **làkk bi primitive** (lim yi, mbindu bu yax). Ngir làkk bi Tuple, jëfandikoo `$^` ak lambda wi wees — natt bi ne ci lambda (`<` = yépp, `>` = yépp).

**Xam-xamu doj** — làkk bi def ci wutti beneen dëggalu bu am solo:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b du dox
```

```zymbol
// Làkk bi ci biir (natt bi 1-caay)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (wétt 2, kolom 3)
```

---

## Koy fex

```zymbol
// Làkk bi
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[bu njëkk, *bu toog] = arr         // bu njëkk=10  bu toog=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ dox

// Tuple ci anam wu mel
point = (100, 200)
(px, py) = point             // px=100  py=200

// Tuple bu am tur
nit = (turu: "Ana", at: 25, dëkk: "Madrid")
(turu: n, at: a) = nit   // n="Ana"  a=25
```

---

## Tuple

Tuple day **du daj** te am wàllu yi **ci biir**.

```zymbol
// Ci anam wu mel — wàllu yi man a nekk
point = (10, 20)
>> point[1] ¶    // → 10

xibaar yi = (42, "Salaam aleekum", #1, 3.14)
>> xibaar yi[3] ¶     // → #1

// Bu am tur
nit = (turu: "Alisi", at: 25)
>> nit.turu ¶    // → Alisi
>> nit[1] ¶      // → Alisi  (natt itam, 1-caay)

// Ci biir
fa = (x: 10, y: 20)
p = (fa: fa, natt: "jege")
>> p.fa.x ¶        // → 10
```

**Du daj** — tey def wàllu wi ci tuple man a baat:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ baat bi ci wàllu man: tuple du daj
// t[1] += 5    // ❌ melo wu benn
```

Ngir am doj bu daj, jëfandikoo `$~` (jëfandikoo ci biir) — **tuple bu bees**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← bu njëkk du daj
>> t2 ¶    // → (10, 999, 30)

// Tuple bu am tur — def ko ci anam wu xam-xam
nit = (turu: "Alisi", at: 25)
bu mag  = (turu: nit.turu, at: 26)
>> nit.at ¶    // → 25
>> bu mag.at ¶     // → 26
```

---

## Jëfandikoo yu gën

```zymbol
xibaar yi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ñaari  = xibaar yi$> (x -> x * 2)                  // map  → [2,4,6…20]
mettiti    = xibaar yi$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
lim yi wépp    = xibaar yi$< (0, (feebar, x) -> feebar + x)     // reduce → 55

// Niki benn ak feebar
baŋ1 = xibaar yi$| (x -> x > 3)
baŋ2 = baŋ1$> (x -> x * x)
>> baŋ2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Jëfandikoo yi am tur man a yokku HOF
ñaari(x) { <~ x * 2 }
mag(x) { <~ x > 5 }
r = xibaar yi$> ñaari       // ✅ natt bu yóbb
r = xibaar yi$| mag       // ✅ natt bu yóbb
```

---

## Jëfandikoo tuyau

Ci saweru ñaari bëgg `_` ngir doj bi tuyau:

```zymbol
ñaari = x -> x * 2
yokku = (a, b) -> a + b
yokk = x -> x + 1

r1 = 5 |> ñaari(_)        // → 10
r2 = 10 |> yokku(_, 5)       // → 15
r3 = 5 |> yokku(2, _)        // → 7

// Niki benn
r = 5 |> ñaari(_) |> yokk(_) |> ñaari(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Baat bi ci biir

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "nul bay" ¶
} :! {
    >> "bu nekk: " _err ¶    // _err am na baat bi
} :> {
    >> "tey rek" ¶
}
```

| Wàllu | Kan |
|------|------|
| `##Div` | Nul bay |
| `##IO` | Kàdd / system |
| `##Index` | Natt bu amul |
| `##Type` | Wàllu du mel |
| `##Parse` | Xibaar yi xam |
| `##Network` | Baat bi ci network |
| `##_` | Baat bi wépp |

---

## Modul yi

```zymbol
// lib/calc.zy — modul bi nekk ci biir
# calc {
    #> { yokku, get_PI }

    _π := 3.14159
    yokku(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // tur wi man

>> c::yokku(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Koy defar ak tur bu nekk
# mylib {
    #> { _yokku_ci_biir => lim_wi_wépp }

    _yokku_ci_biir(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::lim_wi_wépp(3, 4) ¶    // → 7  (turu ci biir _yokku_ci_biir nekk)
```

> **Xam-xamu modul**: ci `# turu { }`, `#>`, mbind wu jëfandikoo, ak wutti yi/tegt yi nekk na. Qër yi man a def (`>>`, `<<`, lipp yi, ati.) dëggalu baat bi E013.

---

## Melo yu lim

Zymbol man a mboole lim yi **69 Unicode lim bu am** — Devanagari, Arab-Indik, Tay, Klingon pIqaD, Mathematical Bold, LCD wétt yi, ak bu nekk. Melo bi nekk ci biir daj na `>>` rekk; xayme ci biir binary.

### Jëfandikoo bar bu am

Bar bu am `0` ak `9` ci `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indik (U+0660–U+0669)
#๐๙#    // Tay         (U+0E50–U+0E59)
#09#    // def ko ASCII
```

### Ci biir ak bool

```zymbol
x = 42
>> x ¶          // → 42   (ASCII jamono)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (point décimal moo xam)
>> 1 + 2 ¶      // → ३

// Bool: kanam # ASCII rekk, lim moo mel
>> #1 ¶         // → #१   (gëna Devanagari)
>> #0 ¶         // → #०   (feebar — du mel ० lim bu wétt nul)

x = 28 > 4
>> x ¶          // → #१   (weesu bi daj melo bi nekk ci biir)
```

### Lim bi nekk ci mbind

Lim bi ci bar bu ne man a def — ci jaare, modulo, weesu:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Bool bi nekk ci bar bu ne

`#` + lim `0` wala `1` ci fukkeer bu ne man a def:

```zymbol
#٠٩#
jëfandikoo = #١        // melo wu benn #1
>> jëfandikoo ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **ASCII rekk**. `#0` (feebar) du mel `0` (lim bu wétt nul) ci bar bu ne.

---

## Jëfandikoo wu xibaar

```zymbol
// Wàllu wu dox
f = ##.42         // → 42.0  (bu jeex)
i = ###3.7        // → 4     (lim bu wétt, def ci melo)
t = ##!3.7        // → 3     (lim bu wétt, koy yépp)

// Xibaar bu yax ci lim
v1 = #|"42"|      // → 42  (lim bu wétt)
v2 = #|"3.14"|    // → 3.14  (bu jeex)
v3 = #|"abc"|     // → "abc"  (feebar, baat bi)

// Def ci melo / Yépp
π = 3.14159265
ci_melo2 = #.2|π|      // → 3.14  (ci melo 2 ci point)
ci_melo4 = #.4|π|      // → 3.1416
yépp2 = #!2|π|      // → 3.14  (yépp)

// Lim bi koy defar
defar = #,|1234567|  // → 1,234,567  (koma)
xam_xam = #^|12345.678|    // → 1.2345678e4  (xam-xam)

// Lim bu nekk ci biir
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Ci biir wu dox
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Niki benn ak Shell

```zymbol
bés = <\ date +%Y-%m-%d \>     // dox stdout (am na \n)
>> "Bés bi: " bés

kàdd = "data.txt"
xam = <\ cat {kàdd} \>      // lim ci biir

biir = </"./subscript.zy"/>   // defar script Zool
>> biir
```

> `><` dox argument CLI niki làkk bi (tree-walker rekk).

---

## Nataal bu wétt: FizzBuzz

```zymbol
wees(lim) {
    ? lim % 15 == 0 { <~ "FizzBuzz" }
    _? lim % 3  == 0 { <~ "Fizz" }
    _? lim % 5  == 0 { <~ "Buzz" }
    _ { <~ lim }
}

@ i:1..20 { >> wees(i) ¶ }
```

---

## Natt wu jëfandikoo

| Natt | Jëfandikoo | Natt | Jëfandikoo |
|--------|-----------|--------|-----------|
| `=` | wutti | `$#` | guddi |
| `:=` | tegt | `$+` | yokku (benn) |
| `>>` | ci biir | `$+[i]` | dugal ci natt (1-caay) |
| `<<` | ci wàllu | `$-` | bu njëkk |
| `¶` / `\\` | wétt | `$--` | wépp |
| `?` | su | `$-[i]` | ci natt (1-caay) |
| `_?` | su du | `$-[i..j]` | jaare (1-caay) |
| `_` | du / | `$?` | am |
| `??` | melo | `$??` | natt yi wépp (1-caay) |
| `@` | lipp | `$[s..e]` | téer (1-caay) |
| `@ N { }` | lipp N | `$>` | map |
| `@!` | kuy | `$\|` | filter |
| `@>` | yéen | `$<` | reduce |
| `@:turu { }` | lipp bu am natt | `$/ biir` | bay |
| `@:turu!` | kuy natt | `$++ a b c` | defar |
| `@:turu>` | yéen natt | `arr[i>j>k]` | natt wu dox |
| `->` | lambda | `arr[i] = doj` | wàllu bi daj (làkk bi rekk) |
| `arr[i] += doj` | daj ci melo | `arr[i]$~` | ci biir (koop bu bees) |
| `$^+` | wërsët yépp (primitive) | `$^-` | wërsët yépp (primitive) |
| `$^` | wërsët ak weesu (tuple) | `<~` | dëggalu |
| `\|>` | tuyau | `!?` | xam |
| `:!` | dox | `:>` | man |
| `#1` | gëna | `#0` | feebar |
| `$!` | baat bi | `$!!` | koy wax |
| `<#` | defal | `#>` | def |
| `#` | xam module | `::` | jëfandikoo module |
| `.` | ca càll | `#?` | xam-xamu wàllu |
| `#\|..\|` | lim bi | `##.` | def bu jeex |
| `###` | def lim bu wétt (ci melo) | `##!` | def lim bu wétt (yépp) |
| `#.N\|..\|` | ci melo | `#!N\|..\|` | yépp |
| `#,\|..\|` | defar ak koma | `#^\|..\|` | xam-xam |
| `#d0d9#` | def melo bu lim | `#09#` | def ko ASCII |
| `<\ ..\>` | def shell | `>\<` | argument CLI |
| `\ wutti` | wutti bi dox | `°x` / `x°` | defar ci melo (daj ci anam gu safaanu) |
| `>>|` | fukkeer TUI (wétt wi leneen) | `>>~` | ci biir wu am |
| `>>!` | leen wétt | `>>?` | mag ca cat |
| `<<\|` | tàkk wu dajj | `<<\|?` | baaxul dajj |
| `@~ N` | neat N | `$*` | mbindu bu yax N |

---

## Xibaar wu dox

### v0.0.5 — Primitive TUI, Defar ci melo & Mbindu bu yax N _(Mee 2026)_

- **Cere** weesu bi: `natt : doj` → `natt => doj`
- **Cere** tur wu defal: `<# wétt <= tur` → `<# wétt => tur`
- **Cere** tur wu def: `#> { fn <= nit }` → `#> { fn => nit }`
- **Yokku** Fukkeer TUI `>>| { }` — wétt wi leneen + mode raw; daj ci anam gu safaanu
- **Yokku** Ci biir wu am `>>~ (wétt, kolom, BKS, fg, bg) > xibaar yi` — melo, ANSI 256 melo kaani
- **Yokku** Tàkk ci biir `<<| wutti` (dajj) ak `<<|? wutti` (baaxul dajj)
- **Yokku** `>>!` leen wétt, `>>?` mag ca cat, `@~ N` neat N
- **Yokku** Defar ci melo `°x` / `x°` — wutti bi daj ci anam gu safaanu ci lipp yi
- **Yokku** Mbindu bu yax N `mbindu $* N` — dox N
- **VM** Mel: test 436/436

### v0.0.4 — Natt 1-caay, Jëfandikoo wu njëkk & Module ci biir _(Awril 2026)_

- **Cere** natt bi def **1-caay** — `arr[1]` wàllu bu njëkk; `arr[0]` baat bi ci wàllu man
- **Yokku** Jëfandikoo yi am tur **laaj wu njëkk** — dig ci biir HOF: `xibaar yi$> ñaari`
- **Yokku** **Xibaar wu ci biir** module: `# turu { ... }` — xibaar wu mel du nekk
- **Yokku** Natt yu bari: `arr[i>j>k]` (jublu), `arr[p ; q]` (ci biir)
- **Yokku** Wàllu wu dox: `##.mbind` (bu jeex), `###mbind` (lim bu wétt ci melo), `##!mbind` (lim bu wétt yépp)
- **Yokku** Mbindu bu yax bay: `mbindu$/ biir` — `Array(mbindu)`
- **Yokku** Defar melo: `caay$++ a b c` — yokku
- **Yokku** Lipp N: `@ N { }` — dox N
- **Yokku** Xibaar wu lipp bu am natt: `@:turu { }`, `@:turu!`, `@:turu>` — ci biir `@ @turu` / `@! turu`
- **Yokku** Xam-xamu wutti: wutti `_turu` am na biir; `\ wutti` dox
- **Yokku** Natt yu weesu: `< 0 =>`, `> 5 =>`, `== 42 =>`, ati.
- **Yokku** Module E013 baat bi: qër yi man a def ci module amul
- **Def** `alias.CONST` daj; `#>` man a nekk ci rug li
- **VM** Mel: test 393/393

### v0.0.3 — Lim yu Unicode & LSP _(Awril 2026)_

- **Yokku** 69 Unicode lim bu am natt `#d0d9#`
- **Yokku** Bool bi nekk ci bar bu ne — `#१` / `#०`, `#१` / `#०`, ati.
- **Yokku** Klingon pIqaD lim yi (CSUR PUA U+F8F0–U+F8F9)
- **Yokku** VM `SetNumeralMode` — melo tree-walker
- **Def** Bool `>>` daj `#` (`#0` / `#1`) ci melo yi wépp

### v0.0.2_01 — Tur wu jëfandikoo _(30 Maars 2026)_

- **Def** `c|..|` → `#,|..|` ak `e|..|` → `#^|..|` — niki benn ak `#`
- **Yokku** Tur wu def: module nit ak tur wu ne

### v0.0.2 — API wu xibaar & Module _(24 Maars 2026)_

- **Yokku** `$` jëfandikoo wi làkk ak mbindu bu yax (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yokku** Defal wu làkk, tuple, ak tuple bu am tur
- **Yokku** Natt bu bëgg (`arr[-1]` = wàllu bu gàdda)
- **Yokku** Module — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maars 2026)_

- **Yokku** Defal ci melo `^=`
- **Def** Xayme wu faranse; mbind

### v0.0.1 — Ci biir bu njëkk _(22 Maars 2026)_

- Tree-walker faranse + VM (`--vm`, ~4× mag, ~95% melo)
- Ñaari yi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode wu wétt, module, lambda, juge ci biir, baat bi ci biir
- REPL, LSP, VS Code extension, defar (`zymbol fmt`)

---

_Zymbol-Lang — Natt. Àdduna. Du daj._
