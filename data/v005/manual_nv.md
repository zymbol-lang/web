> **Bee Baa Yálti:** Dii naaltsoos AI (inteligencia artificial) yił ályaa.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Bee Ná'átł'idí **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** intérprete biih naaznil.

---

# Zymbol-Lang Manual

> **Bee Nínízíní v0.0.5 — 2026-05-12**

**Zymbol-Lang** bee naanish machiyotl yił bee nánáhidiih. Doo saad da — altso machiyotl. Altso diné saad bił yéego naanish.

- Doo `if`, `while`, `return` da — `?`, `@`, `<~` bee
- Unicode altso — bizhi altso diné saad bił
- Diné saad doo monequi da — bee naanish peteĩhawa

**Versión bee naanish**: v0.0.5 | **Bee Nínízíní**: 436/436 (TW ↔ VM bee)

---

## Bee Naanish dóó Nít'ah

```zymbol
x = 10              // bee naanish nemohua
PI := 3.14159       // nít'ah — nemohua nidahoolzhood
bizhi = "Sonia"
naalnish = #1       // nelli (verdadero)
👋 := "Yá'át'ééh"
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

`°` (U+00B0) bee naanish nít'ah ałtah yee áłah:

```zymbol
namba_k = [3, 1, 4, 1, 5]
@ n:namba_k {
    °łahgo += n    // 0 bił ałtah; nínánáhidiih dah ojejoko
}
>> łahgo ¶         // → 14
```

> `°x` (ałtah) nínánáhidiih bił — altso nínánáhidiih dah.
> `x°` (tąą') nínánáhidiih biih — naalnish nínánáhidiih dah.
> Tree-walker zan.

---

## Łahji' Naho

| Łahji' | Machiyotl | `#?` | Bee Yálti |
|--------|-----------|------|-----------|
| Int | `42`, `-7` | `###` | 64-bit firmado |
| Float | `3.14`, `1.5e10` | `##.` | Łahji' OK |
| Saad | `"arandu"` | `##"` | Bee yah: `"Yá'át'ééh {bizhi}"` |
| Ce Machiyotl | `'A'` | `##'` | Ce Unicode |
| Nellitoni | `#1`, `#0` | `##?` | Doo namba da — `#1 ≠ 1` |
| Dah Sinil | `[1, 2, 3]` | `##]` | Ce łahji' |
| Naaki Bee | `(a, b)` | `##)` | Ałtah rupi |
| Bizhi Naaki Bee | `(x: 1, y: 2)` | `##)` | Bizhi renda |
| Bee Iilyé | bizhi ref | `##()` | Ałtah; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ałtah; `<lambd/N>` |

```zymbol
// Łahji' itta — bee yah (łahji', namba, altso)
naho = 42#?
>> naho ¶         // → (###, 2, 42)
t = naho[1]
>> t ¶            // → ###
```

---

## Naalyéhé dóó Yah Iiná

```zymbol
>> "Yá'át'ééh" ¶                  // ¶ éí doodago \\ saad ihuan
>> "a=" a " b=" b ¶               // bee nánáhidiih — łahji' yálti
>> (arr$#) ¶                      // machiyotl bee ( ) >> bił monequi

<< bizhi                          // yah iiná bee naanish (doo saad da)
<< "Ha'át'íí bizhi: " bizhi       // saad bee
```

> `¶` (AltGr+R español tlatecpantli bił) dóó `\\` altso saad bił.

---

## TUI Bee Naanish

Terminal UI machiyotl naanish. `>>| { }` monequi (łeets'áán tlacpac + modo cecec).

```zymbol
>>| {
    >>!                               // łeets'áán poxahui
    >>~ (1, 1, 0, 10) > "Naanish"    // ren 1, col 1, fg=10 (łitso)
    @~ 1000                           // yidloh 1 tonatiuh (1000 ms)
    >>~ (2, 1) > "T'áá."
}
// terminal bee hózhó tłéé'
```

```zymbol
// Machiyotl dóó terminal naho
>>| {
    [ren, col] = >>?              // terminal naho monequi
    >>~ (1, 1) > "Terminal: " ren " x " col
    <<| señal                     // señal bee (yidloh)
    >>~ (2, 1) > "Yiiłt'e: " señal
}
```

> `>>!` łeets'áán poxahui. `>>?` bee `[ren, col]`. `@~ N` yidloh N ms.
> `<<|` ce machiyotl (yidloh); `<<|?` doo yidloh da (bee `'\0'` doo oitztia).
> Quiza tupla: `(ren, col, BKS, fg, bg)` — coma bił (`>>~ (,,, 196) > "łichíí"`).
> BKS: `1`=Nineez, `2`=Itzpa, `4`=Altso Bee. ANSI 256 bilaa (`0`=terminal ałtah).
> Tree-walker zan (doo `>>!`, `>>?`, `@~`, `>>~` `--vm` bił bee da).

---

## Bee Nánáádzidí

```zymbol
// Namba Bee Nánáádzidí
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (namba tlatectli)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (altso namba)

// Nánáhidiih — bee yah altso
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Nellitoni Bee Nánáádzidí
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Saad

```zymbol
// Naaki bee nánáhidiih
bizhi = "Sonia"
n = 42

>> "Yá'át'ééh " bizhi " namba " n ¶    // bee nánáhidiih — >> bił
arupa = "Yá'át'ééh {bizhi}, namba {n}"  // bee yah — altso bee
```

```zymbol
s = "Yá'át'ééh Diné"
biiyo = s$#                  // 13
biis = s$[1..9]              // "Yá'át'ééh"  (1-bił, tąą' bee)
bee_k = s$? "Diné"           // #1
naakih = "a,b,c,d"$/ ','    // [a, b, c, d]  (bee tlaxeloa)
naakih2 = s$~~["a":"A"]     // "Yá'át'ééh Diné" wip
naakih3 = s$~~["a":"A":1]   // "Yá'át'ééh Diné" (ce zan)
bił_ts = "─" $* 20          // "────────────────────"  (N bił)
```

> `+` namba zan. Bee ``,`, bee nánáhidiih, éídínígíí saad bił.

---

## Naanish Bee Ítts'á

```zymbol
x = 7

? x > 0 { >> "nizhóní" ¶ }

? x > 100 {
    >> "tsoh" ¶
} _? x > 0 {
    >> "nizhóní" ¶
} _? x == 0 {
    >> "ádin" ¶
} _ {
    >> "doo" ¶
}
```

> `{ }` **monequi** doo mochi ce naanish bił da.

---

## Nánáhidiih

```zymbol
// Namba Łahji'
namba_k = 85
tsin = ?? namba_k {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> tsin ¶    // → B

// Saad
bilaa = "łichíí"
codigo = ?? bilaa {
    "łichíí" => "#FF0000"
    "łitso"  => "#00FF00"
    _        => "#000000"
}

// Nánáhidiih Łahji'
siil = -5
naho = ?? siil {
    < 0  => "tin"
    < 20 => "hakaz"
    < 35 => "ałní"
    _    => "sido"
}
>> naho ¶    // → tin

// Bee Iilyé (bloque bee iilyé)
n = -3
?? n {
    0    => { >> "ádin" ¶ }
    < 0  => { >> "doo" ¶ }
    _    => { >> "nizhóní" ¶ }
}
```

---

## Nínánáhidiih

```zymbol
@ i:0..4  { >> i " " }        // namba:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // bee:    1 3 5 7 9
@ i:5..0:1 { >> i " " }       // bił:    5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (nínánáhidiih)

nidaaz = ["neeshchíí", "tsézhin", "łitsxo"]
@ f:nidaaz { >> f ¶ }         // @ dah sinil bił

@ c:"yatahe" { >> c "-" }
>> ¶                          // → y-a-t-a-h-e-  (@ saad bił)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> bee
    ? i > 7 { @! }             // @! bił
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Nínánáhidiih doo tąą' da
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Nínánáhidiih bizhi (altso tąą')
naalnish_k = 0
@:bił_naho {
    naalnish_k++
    ? naalnish_k >= 3 { @:bił_naho! }
}
>> naalnish_k ¶               // → 3
```

---

## Bee Iilyé

```zymbol
bilah(a, b) { <~ a + b }
>> bilah(3, 4) ¶    // → 7

naałingo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * naałingo(n - 1)
}
>> naałingo(5) ¶    // → 120
```

Bee iilyé **zan yah** — doo quimati bee naanish. Xicmonanquili `<~` bee naanish yee áłah:

```zymbol
nahidees(a<~, b<~) {
    bila = a
    a = b
    b = bila
}
x = 10
y = 20
nahidees(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Bizhi bee iilyé **ałtah altso** — mana bił: `namba_k$> naaki`. Bee: `x -> fn(x)` zan.

---

## Lambda dóó Bił Naanish

```zymbol
naaki = x -> x * 2
bee_łah = (a, b) -> a + b
>> naaki(5) ¶    // → 10
>> bee_łah(3, 7) ¶    // → 10

// Bloque lambda
bił_naho = x -> {
    ? x > 0 { <~ "nizhóní" }
    _? x < 0 { <~ "doo" }
    <~ "ádin"
}

// Bił naanish — bee naanish bee
naalyehe = 3
biłke = x -> x * naalyehe
>> biłke(7) ¶    // → 21

// Bee iilyé
bilah_k(n) { <~ x -> x + n }
bilah_pa = bilah_k(10)
>> bilah_pa(5) ¶    // → 15

// Dah sinil bił
naho_k = [x -> x+1, x -> x*2, x -> x*x]
>> naho_k[3](5) ¶    // → 25
```

---

## Dah Sinil

Dah sinil **nemohua** dóó altso **ce łahji'** bee nánáhidiih.

```zymbol
naho_k = [1, 2, 3, 4, 5]

x = naho_k[1]      // 1 — bee (1-bił: ałtah)
x = naho_k[-1]     // 5 — namba doo (tąą')
x = naho_k$#       // 5 — naho (jeporua (naho_k$#) >> bił)

naho_k = naho_k$+ 6            // bee yah → [1,2,3,4,5,6]
naho2 = naho_k$+[2] 99       // bee yah 2 bił (1-bił)
naho3 = naho_k$- 3           // bee dah ałtah
naho4 = naho_k$-- 3          // bee dah altso
naho5 = naho_k$-[1]          // bee dah 1 bił (ałtah)
naho6 = naho_k$-[2..3]       // bee dah bee (1-bił, tąą' bee)

oiv_k = naho_k$? 3            // #1 — oitztia
pos_k = naho_k$?? 3           // [3] — altso bił (1-bił)
sl_k = naho_k$[1..3]          // [1,2,3] — bee (1-bił)
sl2_k = naho_k$[1:3]          // [1,2,3] — ukhamaki, namba

asc_k = naho_k$^+             // ałtah bee (ce)
desc_k = naho_k$^-            // nineez bee (ce)

// Bizhi dah sinil — naho_k$^ lambda bee
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
por_iy = db$^ (a, b -> a.age < b.age)    // ałtah naahai (<)
por_tc = db$^ (a, b -> a.name > b.name)  // nineez bizhi (>)
>> por_iy[1].name ¶     // → Ana
>> por_tc[1].name ¶     // → Carla

// Namba bee (naho_k zan)
naho_k[1] = 99              // bee yah
naho_k[2] += 5              // bilah: +=  -=  *=  /=  %=  ^=

// Bee iilyé — bee yah naho_k oco; ałtah doo nemohua
naho2 = naho_k[2]$~ 99
```

> Altso dah sinil machiyotl bee yah **dah sinil oco**. Bee: `naho_k = naho_k$+ 4`.
> `$+` bee bił: `naho_k = naho_k$+ 5$+ 6$+ 7`. Oc no machiyotl altso bił.
> **Namba 1-bił**: `naho_k[1]` ałtah; `naho_k[0]` nidahoolzhood.
> `$^+` / `$^-` **ałtah dah sinil** (namba, saad). Naaki Bee `$^` lambda — lambda (`<` = ałtah, `>` = nineez).

**Altso łahji'** — dah sinil bee yah oco altso bee yah:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b doo nemohua da
```

```zymbol
// Dah sinil bił (1-bił)
patana = [[1,2,3],[4,5,6],[7,8,9]]
>> patana[2][3] ¶    // → 6  (ren 2, col 3)
```

---

## Yidloh

```zymbol
// Dah sinil
naho_k = [10, 20, 30, 40, 50]
[a, b, c] = naho_k              // a=10  b=20  c=30
[ałtah, *bilaas] = naho_k       // ałtah=10  bilaas=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ bee dah

// Naaki Bee Ałtah
yolic = (100, 200)
(px, py) = yolic                // px=100  py=200

// Bizhi Naaki Bee
tlaca = (name: "Ana", age: 25, city: "Navajoland")
(name: n, age: a) = tlaca    // n="Ana"  a=25
```

---

## Naaki Bee

Naaki Bee **doo néelą́** dóó altso **łahji' ił'ínígíí** bee nánáhidiih.
Dah sinil doo, altso doo néelą́ nínánáhidiih dah.

```zymbol
// Ałtah — altso łahji'
yolic = (10, 20)
>> yolic[1] ¶    // → 10

nechca = (42, "yatahe", #1, 3.14)
>> nechca[3] ¶     // → #1

// Bizhi
tlaca = (name: "Sonia", age: 25)
>> tlaca.name ¶    // → Sonia
>> tlaca[1] ¶      // → Sonia  (namba bee, 1-bił)

// Bee bił
yolic_k = (x: 10, y: 20)
p = (pos: yolic_k, label: "ałtah")
>> p.pos.x ¶        // → 10
```

**Doo Néelą́** — altso bee yah nidahoolzhood:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ nidahoolzhood: naaki bee doo néelą́
// t[1] += 5    // ❌ éí doodago
```

Bee `$~` bee yah (bee iilyé) — **naaki bee oco** bee yah:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← ałtah doo nemohua da
>> t2 ¶    // → (10, 999, 30)

// Bizhi naaki bee — oco bee iilyé
tlaca = (name: "Sonia", age: 25)
pyahura  = (name: tlaca.name, age: 26)
>> tlaca.age ¶    // → 25
>> pyahura.age ¶     // → 26
```

---

## Bee Iilyé Nineez

```zymbol
namba_k = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ompoha  = namba_k$> (x -> x * 2)              // map  → [2,4,6…20]
yoli    = namba_k$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
łahgo   = namba_k$< (0, (acc, x) -> acc + x)  // reduce → 55

// Bee nánáhidiih dah sinil
tlaz1 = namba_k$| (x -> x > 3)
tlaz2 = tlaz1$> (x -> x * x)
>> tlaz2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Bee iilyé bee HOF
naaki(x) { <~ x * 2 }
bee_k(x) { <~ x > 5 }
r = namba_k$> naaki       // ✅ mana
r = namba_k$| bee_k       // ✅ mana
```

---

## Bił Yigáál

Tąą' `_` monequi altso doo néelą́ bił:

```zymbol
naaki = x -> x * 2
bee_łah = (a, b) -> a + b
nahayoi = x -> x + 1

r1 = 5 |> naaki(_)        // → 10
r2 = 10 |> bee_łah(_, 5)       // → 15
r3 = 5 |> bee_łah(2, _)        // → 7

// Bee bił altso
r = 5 |> naaki(_) |> nahayoi(_) |> naaki(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Nidahoolzhood

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ádin bee" ¶
} :! {
    >> "éí doodago: " _err ¶    // _err bee nidahoolzhood
} :> {
    >> "altso bee" ¶
}
```

| Łahji' | Bił |
|--------|-----|
| `##Div` | Ádin bee naanish |
| `##IO` | Naaltsoos / sistema |
| `##Index` | Namba nidahoolzhood |
| `##Type` | Łahji' nidahoolzhood |
| `##Parse` | Saad namba |
| `##Network` | Red nidahoolzhood |
| `##_` | Altso nidahoolzhood (mochi) |

---

## Bił Nineez

```zymbol
// lib/calc.zy — módulo { } bił
# calc {
    #> { bilah, getPI }

    _PI := 3.14159
    bilah(a, b) { <~ a + b }
    getPI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // bizhi monequi

>> c::bilah(5, 3) ¶   // → 8
pi = c::getPI()
>> pi ¶               // → 3.14159
```

```zymbol
// Bee yah bizhi bee
# nahołah {
    #> { _bilah_bila => bilah }

    _bilah_bila(a, b) { <~ a + b }
}
```

```zymbol
<# ./nahołah => m

>> m::bilah(3, 4) ¶    // → 7  (_bilah_bila poliuh)
```

> **Módulo monequi**: zan `#>`, bee iilyé, dóó saad `# bizhi { }` bił. Bee iilyé ejecutable (`>>`, `<<`, nínánáhidiih, etc.) nidahoolzhood E013.

---

## Namba Bee

Zymbol namba bee yah **69 Unicode namba machiyotl** — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemática Negrita, LCD, dóó altso. Ałtah łahji' zan `>>` bee yah bił; namba binary zan.

### Bee Yánáłti

Bee `0` dóó `9` namba `#…#` bił:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ASCII-pan bee hózhó
```

### Naalyéhé dóó Nellitoni

```zymbol
x = 42
>> x ¶          // → 42   (ASCII ałtah)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto ASCII zan)
>> 1 + 2 ¶      // → ३

// Nellitoni: # ASCII zan, namba bił
>> #1 ¶         // → #१   (nelli Devanagari bił)
>> #0 ¶         // → #०   (doo — doo ० namba ádin da)

x = 28 > 4
>> x ¶          // → #१   (bee nánáhidiih ałtah bił)
```

### Namba Machiyotl Nít'ah

Altso namba machiyotl cualli — nínánáhidiih, modulo, nánáhidiih bił:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Nellitoni Machiyotl Altso

`#` + namba `0` éídínígíí `1` altso łahji' bił nellitoni machiyotl:

```zymbol
#٠٩#
naalnish = #١        // éí doodago #1
>> naalnish ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII zan**. `#0` (doo) doo `0` (namba ádin) altso łahji' bił bee.

---

## Bee Naanish Daazts'a'

```zymbol
// Łahji' bee hózhó
f = ##.42         // → 42.0  (Float-bił)
i = ###3.7        // → 4     (Int-bił, bee)
t = ##!3.7        // → 3     (Int-bił, bee tlaxeloa)

// Saad namba-bił
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (doo nidahoolzhood da)

// Bee / Bee tlaxeloa
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (2 bił bee)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (bee tlaxeloa)

// Namba bee yah
fmt = #,|1234567|  // → 1,234,567  (coma bee)
sci = #^|12345.678|    // → 1.2345678e4  (łahji')

// Namba machiyotl
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Namba bee yah
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Bee

```zymbol
biiné = <\ date +%Y-%m-%d \>     // bee yah stdout (\n bee)
>> "Díí jį': " biiné

naats = "naanish.txt"
biniih = <\ cat {naats} \>          // bee yah saad bił

biizh = </"./naanish.zy"/>   // Zymbol bee iilyé, bee yah
>> biizh
```

> `><` CLI saad dah sinil bee yah (tree-walker zan).

---

## Bee Nineez: FizzBuzz

```zymbol
naho_bił(namba) {
    ? namba % 15 == 0 { <~ "FizzBuzz" }
    _? namba % 3  == 0 { <~ "Fizz" }
    _? namba % 5  == 0 { <~ "Buzz" }
    _ { <~ namba }
}

@ i:1..20 { >> naho_bił(i) ¶ }
```

---

## Bee Naanish Altso

| Machiyotl | Bee | Machiyotl | Bee |
|-----------|-----|-----------|-----|
| `=` | bee naanish | `$#` | naho |
| `:=` | nít'ah | `$+` | bee yah (cehcehtla) |
| `>>` | naalyéhé | `$+[i]` | bee yah bił (1-bił) |
| `<<` | yah iiná | `$-` | bee dah ałtah |
| `¶` / `\\` | saad bee | `$--` | bee dah altso |
| `?` | nellitoni | `$-[i]` | bee dah bił (1-bił) |
| `_?` | doo bee da | `$-[i..j]` | bee dah bee |
| `_` | éí doodago | `$?` | oitztia |
| `??` | nánáhidiih | `$??` | altso bił |
| `@` | nínánáhidiih | `$[s..e]` | yidloh |
| `@ N { }` | N nínánáhidiih | `$>` | map |
| `@!` | bił | `$\|` | łahji' |
| `@>` | bee | `$<` | bilah |
| `@:name { }` | bizhi nínánáhidiih | `$/ delim` | saad bee dah |
| `@:name!` | bił bizhi | `$++ a b c` | cehcehtla |
| `@:name>` | bee bizhi | `arr[i>j>k]` | namba bił |
| `->` | lambda | `arr[i] = val` | namba bee yah |
| `arr[i] += val` | bilah bee yah | `arr[i]$~` | bee iilyé |
| `$^+` | ałtah bee | `$^-` | nineez bee |
| `$^` | bee lambda | `<~` | bee yah |
| `\|>` | bił yigáál | `!?` | nidahoolzhood |
| `:!` | nidahoolzhood | `:>` | altso bee |
| `#1` | nelli | `#0` | doo |
| `$!` | nidahoolzhood kimün | `$!!` | bee sartaña |
| `<#` | yah iiná | `#>` | naalyéhé |
| `#` | bił nineez | `::` | bił nineez runa |
| `.` | renda | `#?` | łahji' altso |
| `#\|..\|` | saad namba | `##.` | Float-bił |
| `###` | Int-bił bee | `##!` | Int-bił bee tlaxeloa |
| `#.N\|..\|` | bee N | `#!N\|..\|` | bee tlaxeloa N |
| `#,\|..\|` | coma bee yah | `#^\|..\|` | łahji' |
| `#d0d9#` | namba bee | `#09#` | ASCII bee hózhó |
| `<\ ..\>` | shell bee iilyé | `>\<` | CLI saad |
| `\ var` | bee naanish dah | `°x` / `x°` | ałtah bee naanish |
| `>>|` | TUI dah sinil | `>>~` | namba bee yah |
| `>>!` | łeets'áán poxahui | `>>?` | terminal naho |
| `<<\|` | machiyotl bee | `<<\|?` | doo yidloh da |
| `@~ N` | yidloh N ms | `$*` | saad N bił |

---

## Hahoodzood

### v0.0.5 — TUI Bee Naanish, Nít'ah dóó Saad _(Mayu 2026)_

- **Bee Hózhó** Nánáhidiih machiyotl: `pattern : result` → `pattern => result`
- **Bee Hózhó** Yah iiná bizhi: `<# sara <= bizhi` → `<# sara => bizhi`
- **Bee Hózhó** Naalyéhé bizhi: `#> { fn <= pub }` → `#> { fn => pub }`
- **Bee Yah** TUI `>>| { }` — łeets'áán tlacpac + modo cecec; tąą' bee
- **Bee Yah** Namba bee yah `>>~ (ren, col, BKS, fg, bg) > altso` — slot, ANSI 256
- **Bee Yah** Machiyotl `<<| bee naanish` (yidloh) dóó `<<|? bee naanish` (doo yidloh)
- **Bee Yah** `>>!` łeets'áán poxahui, `>>?` terminal naho, `@~ N` yidloh N ms
- **Bee Yah** Bee naanish ałtah `°x` / `x°` — nínánáhidiih bił
- **Bee Yah** Saad nínánáhidiih `str $* N` — saad N bił
- **VM** Ukhamawa: 436/436 yatiqawi wali

### v0.0.4 — 1-Bił, Bee Iilyé Ałtah dóó Bił Nineez _(Abrilpe 2026)_

- **Bee Hózhó** Altso namba **1-bił** — `naho_k[1]` ałtah; `naho_k[0]` nidahoolzhood
- **Bee Yah** Bizhi bee iilyé **ałtah altso** — mana bił HOF: `namba_k$> naaki`
- **Bee Yah** Bił nineez **dah sinil łahji'** monequi: `# bizhi { ... }` — zan łahji'
- **Bee Yah** Namba bee bił: `arr[i>j>k]` (namba), `arr[p ; q]` (bee yah)
- **Bee Yah** Łahji' bee yah: `##.expr` (Float), `###expr` (Int bee), `##!expr` (Int tlaxeloa)
- **Bee Yah** Saad bee dah: `str$/ delim` — bee yah `Array(String)`
- **Bee Yah** Cehcehtla: `base$++ a b c` — łahji' bee yah
- **Bee Yah** N nínánáhidiih: `@ N { }` — N bił bee iilyé
- **Bee Yah** Bizhi nínánáhidiih: `@:bizhi { }`, `@:bizhi!`, `@:bizhi>` — doo `@ @bizhi` da
- **Bee Yah** Bee naanish tąą': `_bizhi` bił; `\ bee naanish` ałtah bee dah
- **Bee Yah** Nánáhidiih łahji': `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Bee Yah** Bił nineez E013 nidahoolzhood: bee iilyé ejecutable bił nidahoolzhood
- **Bee Hózhó** `take_variable` doo nemohua da bił nineez altso
- **Bee Hózhó** `alias.CONST` bee; `#>` bee iilyé tąą' bił
- **VM** Ukhamawa: 393/393 yatiqawi wali

### v0.0.3 — Unicode Namba Bee dóó LSP Bee Hózhó _(Abrilpe 2026)_

- **Bee Yah** 69 Unicode namba machiyotl `#d0d9#` bił
- **Bee Yah** Nellitoni machiyotl altso łahji' — `#१` / `#०`, `#١` / `#٠`, etc.
- **Bee Yah** Klingon pIqaD namba (CSUR PUA U+F8F0–U+F8F9)
- **Bee Yah** `SetNumeralMode` VM opcode — ukhamawa tree-walker bił
- **Bee Yah** REPL namba bee yah dóó bee naanish bił
- **Bee Hózhó** Nellitoni `>>` bee yah `#` bee (`#0` / `#1`) altso łahji'

### v0.0.2_01 — Machiyotl Saad _(Marzepe 2026)_

- **Bee Hózhó** `c|..|` → `#,|..|` dóó `e|..|` → `#^|..|` — ukhamawa `#` altso
- **Bee Yah** Naalyéhé bizhi: bił nineez altso bizhi bee yah

### v0.0.2 — Dah Sinil API Bee Hózhó dóó Instaladores _(Marzepe 2026)_

- **Bee Yah** `$` machiyotl dah sinil dóó saad bił (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bee Yah** Yidloh dah sinil, naaki bee, dóó bizhi naaki bee bił
- **Bee Yah** Namba doo (`naho_k[-1]` = tąą')
- **Bee Yah** Instaladores — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(Marzepe 2026)_

- **Bee Yah** Bilah `^=`
- **Bee Hózhó** Parser namba bee iilyé; bee yah

### v0.0.1 — Ałtah Bee Yah _(Marzepe 2026)_

- Tree-walker bee iilyé + register VM (`--vm`, ~4× nizhóní, ~95% ukhamawa)
- Altso bee iilyé: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Altso Unicode bizhi, bił nineez, lambda, bił naanish, nidahoolzhood
- REPL, LSP, VS Code, bee yah (`zymbol fmt`)

---

_Zymbol-Lang — Machiyotl. Altso Bee. Doo Néelą́._
