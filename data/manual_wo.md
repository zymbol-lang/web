> **Xibaar:** Kàddugóoruwaay bii somaan lees koy defale ak nosukaay xelal bu ñuy wax Intelligence Artificielle (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Réewum nosukaay mooy **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ci samańse bi tànnaleefukaay bi.

---

# Zymbol-Lang Kàddugóor

**Zymbol-Lang** la wónn li wóor wàllug kàddugóor yi. Xam-xam kenn xam-xam du ci ànd — nekk ne ci wóor wàll. Mungi liggéey wu yam ci kàddugóor bees xam.

- Amul `if`, `while`, `return` — dafa nekk ne ci `?`, `@`, `<~`
- Unicode su weex — xam-xam yi ci kàdduug bees xam mbaa emoji
- Dafa bàyyikoo ci kàddugóor — kode gi nekk ne ci penku yépp

**Tànnaleefukaay sig**: v0.0.4 | **Nattal**: 393/393 (TW ↔ VM wiri)

---

## Wutti ak wuutee

```zymbol
x = 10              // wuutee di xam
PI := 3.14159       // wuutee — boo ko defate nekk na wunu ci liiy
turu = "Alice"
tudd ci liggéey = #1       // Boolaŋ bu nekk
👋 := "Noo"
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

---

## Xam-xamug Dente

| Xam-xam | Lu dug | Laabi `#?` | Tudd ci dugub |
|---------|--------|------------|---------------|
| Lu toll | `42`, `-7` | `###` | 64-bit bu toll u siin |
| Tàggu | `3.14`, `1.5e10` | `##.` | Mbindug xam-xam du nekk |
| Wóor | `"wóor"` | `##"` | Ci mét: `"Noo {turu}"` |
| Xare | `'A'` | `##'` | Unicode xare bu bees |
| Boolaŋ | `#1`, `#0` | `##?` | Du lu toll — `#1 ≠ 1` |
| Fepp | `[1, 2, 3]` | `##]` | Ndaxali yu nekk |
| Tuplat | `(a, b)` | `##)` | Ci yoon |
| Tuplat bu ñu tudd | `(x: 1, y: 2)` | `##)` | Ay jàng bu ñu tudd |
| Liggéey | tudd ci liggéey bu ñu tudd | `##()` | Lu toll bu njëkk; mu néew `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Lu toll bu njëkk; mu néew `<lambd/N>` |

```zymbol
// Xam-xamug digg — mu fekk (xam-xam, xaaj, lu néew)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

---

## Tàkk ci baatale

```zymbol
>> "Noo" ¶                       // ¶ mbaa \\ ci liy tàkk ci wéttu
>> "a=" a " b=" b ¶               // tàkk ci wetu — lu néew yi
>> (arr$#) ¶                      // mbir yiy liggéey postfix soxla ( ) ci biir >>,..

<< turu                           // tàkk ci wutti (ngir nuy liggéey)
<< "Turu la: " turu              // ngir nuy liggéey
```

> `¶` (AltGr+R ci klavye Spaañ) ak `\\` benn la ci wéttu.

---

## Liggéey yi

```zymbol
// Xaaj — jëfandikoo ci aki; ay liggéey yi nekk nañu ci biir >>,..
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (xééy lu toll)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (mag)

// Wec
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Lexique
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

---

## Wóor yi

```zymbol
// Benn ci ñaari seen aki
turu = "Alice"
n = 42

>> "Noo " turu " la am na " n ¶       // tàkk ci wetu — ci biir >>
fan = "Noo {turu}, la am na {n}"   // ci mét — penku bees

```

```zymbol
s = "Noo suuf"
guddi = s$#                  // 7
bu ndaw = s$[1..4]           // "Noo " (mbeg-1, bu ko gën)
nekk = s$? "suuf"            // #1
taf = "a,b,c,d"$/ ','        // [a, b, c, d]  (taf ak jafe-jafe)
wécc = s$~~["o":"a"]         // "Naa suuf"
wécc1 = s$~~["o":"a":1]      // "Naa suuf" (N bu njëkk rekk)
```

> `+` moo xare ci lu toll. Ci wóor yi, jëfandikoo `,`, tàkk ci wetu, mbaa ci mét.

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
    >> "tus" ¶
} _ {
    >> "bax" ¶
}
```

> `{ }` **sama la** soo waxet benn baat.

---

---

## Bennoo

```zymbol
// Ay taf
point = 85
grade = ?? point {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grade ¶     // → B

// Wóor yi
nga = "xees"
kood = ?? nga {
    "xees"   : "#FF0000"
    "werte"  : "#00FF00"
    _        : "#000000"
}

// Ay wec
loolu = -5
etat = ?? loolu {
    < 0  : "penda"
    < 20 : "tàng"
    < 35 : "tàngaan"
    _    : "tàng"
}
>> etat ¶      // → penda

// Baat (blok)
?? n {
    0        : { >> "tus" ¶ }
    _? n < 0 : { >> "bax" ¶ }
    _        : { >> "baax" ¶ }
}
```

---

## Toll

```zymbol
@ i:0..4  { >> i " " }        // taf moo am:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ak wéttu:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // wécc:       5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (waay)

lége = ["pom", "pire", "risin"]
@ l:lége { >> l ¶ }           // ci lu nekk mbooloom

@ x:"noo" { >> x "-" }
>> ¶                          // → n-o-o-  (ci xare bees ci wóor)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tàkk
    ? i > 7 { @! }            // @! fátt
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Toll bu amul ne
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Toll bu ñu tudd (fátt bu feye)
xot = 0
@:biir {
    xot++
    ? xot >= 3 { @:biir! }
}
>> xot ¶                      // → 3
```

---

## Liggéey yi

```zymbol
toll(a, b) { <~ a + b }
>> toll(3, 4) ¶   // → 7

factoreel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factoreel(n - 1)
}
>> factoreel(5) ¶    // → 120
```

Liggéey yi **am na yees** — du xam wuttiy biti. Jëfandikoo paramètre `<~` ci liy wécc wuttiy bi:

```zymbol
tàkkale(a<~, b<~) {
    temp = a
    a = b
    b = temp
}
x = 10
y = 20
tàkkale(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Liggéey bu ñu tudd **am na lu toll bu njëkk** — wi réer: `nums$> ñaar`. `x -> fn(x)` ba noppi.

---

---

## Lambda ak du

```zymbol
ñaar = x -> x * 2
toll = (a, b) -> a + b
>> ñaar(5) ¶   // → 10
>> toll(3, 7) ¶ // → 10

// Lambda blok
def = x -> {
    ? x > 0 { <~ "baax" }
    _? x < 0 { <~ "bax" }
    <~ "tus"
}

// Du — daa jël yeesu biti
facteur = 3
ñett = x -> x * facteur
>> ñett(7) ¶    // → 21

// Atelier
def_tollale(n) { <~ x -> x + n }
toll_fukk = def_tollale(10)
>> toll_fukk(5) ¶   // → 15

// Ci mbootaayu
liggéey = [x -> x+1, x -> x*2, x -> x*x]
>> liggéey[3](5) ¶   // → 25
```

---

## Fepp yi

Fepp yi **dañuy wax** ak am na **ndaxali yu ñu toll**.

```zymbol
fepp = [1, 2, 3, 4, 5]

fepp[1]          // 1 — ànd (mbeg-1: ndaxal bu njëkk)
fepp[-1]         // 5 — index bu rax (ndaxal bu gën)
fepp$#           // 5 — guddi (jëfandikoo (fepp$#) ci biir >>)

fepp = fepp$+ 6            // toll → [1,2,3,4,5,6]
fepp2 = fepp$+[2] 99       // dugal ci bu 2 (mbeg-1)
fepp3 = fepp$- 3           // far lu njëkk ci lu néew
fepp4 = fepp$-- 3          // far lépp
fepp5 = fepp$-[1]          // far ci index 1 (ndaxal bu njëkk)
fepp6 = fepp$-[2..3]       // far taf (mbeg-1, gën bi nekk)

nekk = fepp$? 3           // #1 — nekk
xóot = fepp$?? 3          // [3] — index yépp ci lu néew (mbeg-1)
xet = fepp$[1..3]         // [1,2,3] — xet (mbeg-1, gën bi nekk)
xet2 = fepp$[1:3]         // [1,2,3] — benn, syntax ci xaaj

dëgg = fepp$^+            // wëccu ndaw (primitif rekk)
wàrr = fepp$^-            // wëccu mag (primitif rekk)

// Mbootaayu tuple bu ñu tudd/ci yoon — jëfandikoo $^ ak lambda ci wec
data = [(turu: "Carla", at: 28), (turu: "Ana", at: 25), (turu: "Bob", at: 30)]
ci_at   = data$^ (a, b -> a.at < b.at)     // ndaw ci at (<)
ci_turu   = data$^ (a, b -> a.turu > b.turu)     // mag ci turu (>)
>> ci_at[1].turu ¶     // → Ana
>> ci_turu[1].turu ¶   // → Carla

// Wécc ndaxal bi nit (fepp rekk)
fepp[1] = 99              // aki
fepp[2] += 5              // aki: +=  -=  *=  /=  %=  ^=

// Wéccu liggéey — dafa fekk fepp bu bees; diggu du wécc
fepp2 = fepp[2]$~ 99
```

> Lépp liggéey yi ñu jël dañuy fekk **fepp bu bees**. Aki: `fepp = fepp$+ 4`.
> `$+` daa xàll: `fepp = fepp$+ 5$+ 6$+ 7`. Liggéey yi nekk ci biir dañuy jëfandikoo aki (aki).

> **Index bu mbeg-1**: `fepp[1]` moo xam ndaxal bu njëkk; `fepp[0]` moo xam wunu ci liiy.

> `$^+` / `$^-` dañuy wëccu **fepp yi ci primitif** (xaaj, wóor). Ci fepp yi ci tuple, jëfandikoo $^ ak lambda ci wec — tay bu ñu xam daa nekk ci lambda (`<` = ndaw, `>` = mag).

**Xam-xamug lu nekk** — lees aki fepp ci wutti gu bees daa xam copie bu ñu ngi.

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b du wécc
```

```zymbol
// Fepp yi ñu ngi (index bu mbeg-1)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (réew 2, colonne 3)
```

---

---

## Taf

```zymbol
// Fepp
fepp = [10, 20, 30, 40, 50]
[a, b, c] = fepp               // a=10  b=20  c=30
[njëkk, *yeen] = fepp          // njëkk=10  yeen=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ nekk na

// Tuplat ci yoon
point = (100, 200)
(px, py) = point              // px=100  py=200

// Tuplat bu ñu tudd
nit = (turu: "Ana", at: 25, dëkk: "Madrid")
(turu: t, at: a) = nit        // t="Ana"  a=25
```

---

## Tuplat

Tuplat dañuy **du wax** daanaka ci mbir yi ñu toll, dañuy **xam xam yi bees**.
Fepp yi, ndaxali du wax.

```zymbol
// Ci yoon — toll bokk ci xam xam
point = (10, 20)
>> point[1] ¶     // → 10

data = (42, "noo", #1, 3.14)
>> data[3] ¶      // → #1

// Bu ñu tudd
nit = (turu: "Alice", at: 25)
>> nit.turu ¶      // → Alice
>> nit[1] ¶        // → Alice  (index daa jële, mbeg-1)

// Bu ñu ngi
bu = (x: 10, y: 20)
p = (bu: bu, labe: "jëmm")
>> p.bu.x ¶        // → 10
```

**Du wax** — booy xame def ci tuplat, moo xam wunu ci liiy:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ wunu ci liiy: tuplat du wax
// t[1] += 5    // ❌ wunu bu nekk

// Tuplat bu ñu tudd — def ci yoon
nit = (turu: "Alice", at: 25)
mag = (turu: nit.turu, at: 26)
>> nit.at ¶       // → 25
>> mag.at ¶       // → 26
```

Loo xame lu néew ci tuplat bu bees, jëfandikoo `$~` (liggéey wécc) — dafa fekk **tuplat bu bees**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← diggi du wécc
>> t2 ¶    // → (10, 999, 30)
```

---

## Liggéey yu mag

```zymbol
xaaj = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ñaar = xaaj$> (x -> x * 2)                // carte → [2,4,6…20]
xare   = xaaj$| (x -> x % 2 == 0)        // filtrage → [2,4,6,8,10]
yépp    = xaaj$< (0, (xàll, x) -> xàll + x) // réduction → 55

// Xàll ak yees
tay1 = xaaj$| (x -> x > 3)
tay2 = tay1$> (x -> x * x)
>> tay2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Liggéey bu ñu tudd dañuy réer ci liggéey yu mag
ñaar(x) { <~ x * 2 }
mag(x) { <~ x > 5 }
r = xaaj$> ñaar       // ✅ référenc bi nit
r = xaaj$| mag        // ✅ référenc bi nit
```

---

---

## Liggéeyu tuyau

Biir boy daa soxla `_` nit fepp:

```zymbol
ñaar = x -> x * 2
toll = (a, b) -> a + b
toll_ben = x -> x + 1

5 |> ñaar(_)        // → 10
10 |> toll(_, 5)    // → 15
5 |> toll(2, _)     // → 7

// Xàll
r = 5 |> ñaar(_) |> toll_ben(_) |> ñaar(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ci màndarga

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "xééy tus" ¶
} :! {
    >> "wunu wi: " _err ¶    // _err nekk na ci màndarga
} :> {
    >> "tàkk na ba noppi" ¶
}
```

| Xam-xam | Kan la |
|---------|--------|
| `##Div` | Xééy tus |
| `##IO` | Feele / Système |
| `##Index` | Index bi nekk penku |
| `##Type` | Xam-xam du toll |
| `##Parse` | Xam dente |
| `##Network` | Wunu ci réseau |
| `##_` | Wunu bees (jël lépp) |

---

## Modul

```zymbol
// lib/calc.zy — modul bi nekk ci biir mbir yi
# calc {
    #> { toll, get_PI }

    _PI := 3.14159
    toll(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias moo soxla

>> c::toll(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Tàkk ci benn turu gu bees
# sàfara_ma {
    #> { _toll_biir <= jàpp }

    _toll_biir(a, b) { <~ a + b }
}
```

```zymbol
<# ./sàfara_ma <= m

>> m::jàpp(3, 4) ¶    // → 7  (turu biir _toll_biir nekk na ci suuf)
```

> **Xam-xamug modul**: ci biir `# turu { }`, `#>`, xam-xamug liggéey, ak liy def wuutee du dul nekk. Liy wax ci biir (`>>`, `<<`, toll, ...) daanaka nekk wunu E013.

---

---

## Lu toll

Zymbol daa xam xaaj ci **69 blok xaaj yu Unicode** — Devanagari, Araab-End, Thay, Klingon pIqaD, Xaaj bu mag, LCD, ak bees. Ci biir daa liy wax `>>` rekk; xaaj ci biir, nekk na ci base 2 waaye.

### Def ci xam

Dugal xaaj yi `0` ak `9` ci biir `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Araab-End     (U+0660–U+0669)
#๐๙#    // Thay          (U+0E50–U+0E59)
#09#    // def ci ASCII
```

---

### Tàkk ak Boolaŋ

```zymbol
x = 42
>> x ¶          // → 42   (ASCII bi nekk)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (point décimal daa nekk ASCII)
>> 1 + 2 ¶      // → ३

// Boolaŋ: # daa nekk ASCII, xaaj daa toll
>> #1 ¶         // → #१   (dëgg Devanagari)
>> #0 ¶         // → #०   (fàww — ० nekk na ci 0)

x = 28 > 4
>> x ¶          // → #१   (lu fekk ci wec daa jël ci lu nekk)
```

---

## Xaaj yi jamono ci code

Xaaj yi ci xam bi nekk dañuy xam:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

---

### Boolaŋ ci xam bees

`#` + xaaj `0` mbaa `1` ci blok bi nekk moo xam Boolaŋ bu nekk:

```zymbol
#०९#
tudd ci liggéey = #१        // benn ak #1
>> tudd ci liggéey ¶        // → #१
>> (#१ && #०) ¶             // → #०
```

> `#` **daa nekk ASCII**. `#0` (fàww) daa nekk benn ak `0` (xaaj bu tus) ci xam bees.

---

---

## Liggéey yi ci dente

```zymbol
// Wéccu xam-xam
##.42         // → 42.0  (Tàggu)
###3.7        // → 4     (Lu toll, rond)
##!3.7        // → 3     (Lu toll, far)

// Wóor bi ci xaaj
v1 = #|"42"|      // → 42  (Lu toll)
v2 = #|"3.14"|    // → 3.14  (Tàggu)
v3 = #|"abc"|     // → "abc"  (jënd na, wunu du)

// Rond / far
pi = 3.14159265
rond2 = #.2|pi|     // → 3.14  (rond ci xaaj 2 bi)
rond4 = #.4|pi|     // → 3.1416
far2 = #!2|pi|      // → 3.14  (far)

// Cosaanu xaaj
cosaan = #,|1234567|   // → 1,234,567  (wécc ci virgule)
xam_xam = #^|12345.678| // → 1.2345678e4  (xam_xam)

// Base lu toll
a = 0x41         // → 'A'  (hexa)
b = 0b01000001   // → 'A'  (binaire)
c = 0o101        // → 'A'  (octal)

// Base wécc
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

---

## Shell

```zymbol
bés = <\ date +%Y-%m-%d \>     // dafa jël stdout (ci \n)
>> "Tey: " bés

feele = "den.te.txt"
ci biir = <\ cat {feele} \>       // ci mét ci commande

tàkk = </"./subscript.zy"/>     // tàkk Zymbol gu bees, jël tàkk
>> tàkk
```

> `><` dafa jël CLI argument yi ci fepp bu wóor (tree-walker rekk).

---

---

## Lu nekk: FizzBuzz

```zymbol
def(xaaj) {
    ? xaaj % 15 == 0 { <~ "FizzBuzz" }
    _? xaaj % 3  == 0 { <~ "Fizz" }
    _? xaaj % 5  == 0 { <~ "Buzz" }
    _ { <~ xaaj }
}

@ i:1..20 { >> def(i) ¶ }
```

---

## Tudd ci référence

| Signe | Liggéey | Signe | Liggéey |
|-------|---------|-------|---------|
| `=` | wutti | `$#` | guddi |
| `:=` | wutti bu nekk | `$+` | toll (xàll) |
| `>>` | tàkk | `$+[i]` | dugal ci index (mbeg-1) |
| `<<` | dug | `$-` | far bu njëkk ci lu néew |
| `¶` / `\\` | wéttu | `$--` | far lépp ci lu néew |
| `?` | soo | `$-[i]` | far ci index (mbeg-1) |
| `_?` | soo du, soo | `$-[i..j]` | far taf (mbeg-1) |
| `_` | soo du / lu nekk | `$?` | nekk |
| `??` | bennoo | `$??` | gis index lépp (mbeg-1) |
| `@` | toll | `$[s..e]` | xet (mbeg-1) |
| `@ N { }` | toll N waay | `$>` | carte |
| `@!` | fátt | `$|` | filtrage |
| `@>` | tàkk | `$<` | réduction |
| `@:turu { }` | toll bu ñu tudd | `$/ jafe` | taf wóor |
| `@:turu!` | fátt bu ñu tudd | `$++ a b c` | def xàll |
| `@:turu>` | tàkk bu ñu tudd | `fepp[i>j>k]` | index bu xam |
| `->` | lambda | `fepp[i] = lu neew` | wécc ndaxal (fepp rekk) |
| `fepp[i] += lu neew` | wécc aki | `fepp[i]$~` | wécc liggéey (copie bees) |
| `$^+` | wëcc ndaw (primitif) | `$^-` | wëcc mag (primitif) |
| `$^` | wëcc ak comparateur (tuple) | `<~` | fekk |
| `|>` | tuyau | `!?` | xam |
| `:!` | jël | `:>` | gan |
| `#1` | dëgg | `#0` | fàww |
| `$!` | nekk wunu | `$!!` | xàll wunu |
| `<#` | jël | `#>` | tàkk |
| `#` | wax modul | `::` | dénk modul |
| `.` | ànd ci jàng | `#?` | xam-xamug xam-xam |
| `#\|..\|` | xam xaaj | `##.` | def Tàggu |
| `###` | def Lu toll (rond) | `##!` | def Lu toll (far) |
| `#.N\|..\|` | rond | `#!N\|..\|` | far |
| `#,\|..\|` | cosaan virgule | `#^\|..\|` | xam_xam |
| `#d0d9#` | wécc lu toll | `#09#` | def ci ASCII |
| `<\ ..\>` | shell | `>\<` | CLI arguments |
| `\ var` | far wutti ci yoon | | |

---

---

## Lu wécc ci version

### v0.0.4 — Index mbeg-1, Liggéey yu mag ak Blok modul _(Avril 2026)_

- **Fátt** Index lépp daa nekk **mbeg-1** — `fepp[1]` moo xam ndaxal bu njëkk; `fepp[0]` nekk wunu
- **Toll** Liggéey bu ñu tudd **am na lu toll bu njëkk** — wi réer: `nums$> ñaar`
- **Toll** **Syntax biir** modul soxla: `# turu { ... }` — syntax bu xënt nekk na ci
- **Toll** Index bu xam: `fepp[i>j>k]` (xam), `fepp[p ; q]` (far)
- **Toll** Wécc ci xam-xam: `##.expression` (Tàggu), `###expression` (Lu toll rond), `##!expression` (Lu toll far)
- **Toll** Taf wóor: `wóor$/ jafe` — fekk `Array(Wóor)`
- **Toll** Def xàll: `mbeg$++ a b c` — toll ndaxali yu bees
- **Toll** N waay: `@ N { }` — def N waay
- **Toll** Syntax yu toll bu ñu tudd: `@:turu { }`, `@:turu!`, `@:turu>` — nekk ci `@ @turu` / `@! turu`
- **Toll** Xam-xamug wutti: wutti `_turu` am na xam; `\ var` nekk na
- **Toll** Wec ci bennoo: `< 0 :`, `> 5 :`, `== 42 :`
- **Toll** Wunu modul E013: liy wax ci biir modul du nekk
- **Wécc** `take_variable` du def wunu
- **Wécc** `alias.CONST` nekk na ci yoon; `#>` daa nekk ci liggéey
- **VM** Noppi: 393/393 nattal nekk

### v0.0.3 — Xaaj Unicode ak LSP _(Avril 2026)_

- **Toll** 69 blok xaaj Unicode ak `#d0d9#`
- **Toll** Boolaŋ ci xam bees — `#१` / `#०`, `#१` / `#०`, ak bees
- **Toll** Xaaj Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Toll** `SetNumeralMode` opcode VM — noppi ak tree-walker
- **Toll** REPL daa jël ci lu nekk ci écho ak wutti
- **Wécc** Boolaŋ `>>` tàkk nekk na ak `#` (`#0` / `#1`) ci lu nekk

### v0.0.2_01 — Turu liggéey wécc _(30 Mars 2026)_

- **Wécc** `c|..|` → `#,|..|` ak `e|..|` → `#^|..|` — benn ak `#`
- **Toll** alias export — tàkk modul ci benn turu gu bees

### v0.0.2 — API collection ak installateur _(24 Mars 2026)_

- **Toll** Liggéey `$` ci fepp ak wóor (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Toll** Aki far ci fepp, tuple, ak tuple bu ñu tudd
- **Toll** Index bu rax (`fepp[-1]` = ndaxal bu gën)
- **Toll** Installateur — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mars 2026)_

- **Toll** Aki `^=`
- **Wécc** Wunu ci xaaj; kàddugóor

### v0.0.1 — Tàkk bu njëkk _(22 Mars 2026)_

- Tree-walker interpreter + VM (`--vm`, ~4× mag, ~95% noppi)
- Lépp: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode, modul, lambda, du, wunu
- REPL, LSP, VS Code, format (`zymbol fmt`)

---

_Zymbol-Lang — Signe. Aduna. Du wax._
