> **Tlapopolhuitl:** Ko tlahtol IA (inteligencia artificial) oquichiuh.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Achtopa tlahtol **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** intérprete itech oitztia.

---

# Zymbol-Lang Manual

> **Tlapoa v0.0.5 — 2026-05-12**

**Zymbol-Lang** ce tlahzohtlaliztli machiyotl rupi. Ahmo ñe'ẽtee — mochi machiyotl. Mochi tlaca ñe'ẽ itech monequi.

- Ahmo `if`, `while`, `return` — oitztia `?`, `@`, `<~` zan
- Unicode mochi — tocaitl mochi tlaca ñe'ẽ itech
- Tlaca ñe'ẽ ahmo monequi — tlahtol ko'agaite peteĩhawa

**Versión tlahtol**: v0.0.5 | **Jehecha**: 436/436 (TW ↔ VM ukhamawa)

---

## Tlahtol ihuan Tlazotl

```zymbol
x = 10              // tlahtol nemohua
PI := 3.14159       // tlazotl — nemohua tlatlazohtlaliztli
tocait = "Sonia"
yoltok = #1         // nelli (verdadero)
👋 := "Niltze"
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

`°` (U+00B0) tlahtol necia mochipa achtopa xicmonanquili itech:

```zymbol
tlapohk = [3, 1, 4, 1, 5]
@ n:tlapohk {
    °mochi += n    // 0-pan tlahtoa; @ tlapoa quiza
}
>> mochi ¶         // → 14
```

> `°x` (achtopa) malinalliztli itech tlaxelhuia — quiza @ tlapoa.
> `x°` (tlami) malinalliztli itech — tlapoa @ tlapoa.
> Tree-walker zan.

---

## Tlapaliztli

| Tlapaliztli | Machiyotl | `#?` | Tlahtol |
|-------------|-----------|------|---------|
| Int | `42`, `-7` | `###` | 64-bit firmado |
| Float | `3.14`, `1.5e10` | `##.` | Tlapaliztli OK |
| Tlahtolli | `"arandu"` | `##"` | Calaqui: `"Niltze {tocait}"` |
| Ce Machiyotl | `'A'` | `##'` | Ce Unicode |
| Nellitoni | `#1`, `#0` | `##?` | Ahmo tlapohualli — `#1 ≠ 1` |
| Tlapallehua | `[1, 2, 3]` | `##]` | Ce tlapaliztli |
| Cehcehtl | `(a, b)` | `##)` | Ichtaca rupi |
| Tocaitl Cehcehtl | `(x: 1, y: 2)` | `##)` | Tocaitl renda |
| Tequitl | tocaitl ref | `##()` | Achtopa; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Achtopa; `<lambd/N>` |

```zymbol
// Tlapaliztli itta — quiza (tlapaliztli, tlapoa, tlahtolli)
nechca = 42#?
>> nechca ¶         // → (###, 2, 42)
t = nechca[1]
>> t ¶            // → ###
```

---

## Quiza ihuan Calaqui

```zymbol
>> "Niltze" ¶                     // ¶ anoce \\ tlahtol ihuan
>> "a=" a " b=" b ¶               // tlanextia — miec tlahtolli
>> (arr$#) ¶                      // tlamachtilli itech ( ) >> monequi

<< tocait                         // calaqui tlahtolco (ahmo tlanextia)
<< "Ximomachti tocait: " tocait   // tlanextia ihuan
```

> `¶` (AltGr+R español tlatecpantli itech) ihuan `\\` mochi tlahtol ihuan.

---

## TUI Achtopa

Terminal UI tlamachtilli tequitl amanchan. `>>| { }` monequi (pantalla tlacpac + modo cecec).

```zymbol
>>| {
    >>!                               // pantalla poxahui
    >>~ (1, 1, 0, 10) > "Quiza"      // ren 1, col 1, fg=10 (xoxoctic)
    @~ 1000                           // cochi 1 tonatiuh (1000 ms)
    >>~ (2, 1) > "Tlapoa."
}
// terminal cueitla quiza tlapoa
```

```zymbol
// Señal ihuan terminal tlapoa
>>| {
    [ren, col] = >>?              // terminal tlapoa monequi
    >>~ (1, 1) > "Terminal: " ren " x " col
    <<| señal                     // señal quita (cochi)
    >>~ (2, 1) > "Quita: " señal
}
```

> `>>!` pantalla poxahui. `>>?` quita `[ren, col]`. `@~ N` cochi N ms.
> `<<|` ce señal (cochi); `<<|?` ahmo cochi (quita `'\0'` ahmo oitztia).
> Quiza tupla: `(ren, col, BKS, fg, bg)` — coma itech (`>>~ (,,, 196) > "chichiltic"`).
> BKS: `1`=Huehue, `2`=Itzpa, `4`=Tlaxixtli. ANSI 256 tlapal (`0`=terminal achtopa).
> Tree-walker zan (ahmo `>>!`, `>>?`, `@~`, `>>~` `--vm` itech quiza).

---

## Tlamachtilli

```zymbol
// Tlapohualiztli
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (tlapohualli tlatectli)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (tupã)

// Tlanextia — quiza amantli
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Nellitoni Tlamachtilli
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Tlahtolli

```zymbol
// Omentin tlanextia
tocait = "Sonia"
n = 42

>> "Niltze " tocait " tlapohua " n ¶    // tlanextia — >> itech
arupa = "Niltze {tocait}, tlapohua {n}"  // calaqui — nochipa
```

```zymbol
s = "Niltze Cemanahuac"
tlapoh = s$#                  // 17
tlaxel = s$[1..6]             // "Niltze"  (1-itech, tlami ihuan)
necia_k = s$? "Cemanahuac"   // #1
xeloa = "a,b,c,d"$/ ','      // [a, b, c, d]  (tlaxeloa)
tlaquetz = s$~~["a":"A"]     // "NiltzeE CemAnAhuAc"
tlaquetz1 = s$~~["a":"A":1]  // "NiltzeE Cemanahuac"  (ce zan)
tlail = "─" $* 20            // "────────────────────"  (N tlami)
```

> `+` tlapohualli zan. Xicmonanquili `,`, tlanextia, anoce calaqui tlahtolli itech.

---

## Tlaneltoca

```zymbol
x = 7

? x > 0 { >> "cualli" ¶ }

? x > 100 {
    >> "huehca" ¶
} _? x > 0 {
    >> "cualli" ¶
} _? x == 0 {
    >> "apan" ¶
} _ {
    >> "amo" ¶
}
```

> `{ }` **monequi** ahmo mochi tequitl peteĩ itech.

---

## Tlanextia

```zymbol
// Tlaxeloa Tlapohuali
tlapohk = 85
tleyo = ?? tlapohk {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> tleyo ¶    // → B

// Tlahtolli
tlapal = "chichiltic"
codigo = ?? tlapal {
    "chichiltic" => "#FF0000"
    "xoxoctic"   => "#00FF00"
    _            => "#000000"
}

// Tlanextia Tlapaliztli
toton = -5
necia = ?? toton {
    < 0  => "cepayahuitl"
    < 20 => "cecec"
    < 35 => "yeyec"
    _    => "totonqui"
}
>> necia ¶    // → cepayahuitl

// Tequitl (bloque tequitl)
n = -3
?? n {
    0    => { >> "apan" ¶ }
    < 0  => { >> "amo" ¶ }
    _    => { >> "cualli" ¶ }
}
```

---

## Malinalliztli

```zymbol
@ i:0..4  { >> i " " }        // tlapohua:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tlazpoa:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tlatzacua:  5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (malinalliztli)

tlapal_k = ["tzapotl", "ahuacatl", "tomatl"]
@ f:tlapal_k { >> f ¶ }       // @ tlapallehua itech

@ c:"niltze" { >> c "-" }
>> ¶                          // → n-i-l-t-z-e-  (@ tlahtolli itech)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tlatoca
    ? i > 7 { @! }             // @! tlatzacua
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Malinalliztli ahmo tlami
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Malinalliztli tocaitl (tlazpoa tlami)
contador = 0
@:tloc {
    contador++
    ? contador >= 3 { @:tloc! }
}
>> contador ¶                 // → 3
```

---

## Tequitl

```zymbol
cehmehua(a, b) { <~ a + b }
>> cehmehua(3, 4) ¶    // → 7

tlapaloa(n) {
    ? n <= 1 { <~ 1 }
    <~ n * tlapaloa(n - 1)
}
>> tlapaloa(5) ¶    // → 120
```

Tequitl **zan tlaxelhuia** — ahmo quimati tlacpac tlahtol. Xicmonanquili `<~` tlacatl tlahtol monequi:

```zymbol
nahna(a<~, b<~) {
    tloc = a
    a = b
    b = tloc
}
x = 10
y = 20
nahna(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Tocaitl tequitl **achtopa amantli** — mana itech: `tlapohk$> ompohua`. Calaqui: `x -> fn(x)` zan.

---

## Lambda ihuan Tlalnamiquia

```zymbol
ompohua = x -> x * 2
cehmehua = (a, b) -> a + b
>> ompohua(5) ¶    // → 10
>> cehmehua(3, 7) ¶    // → 10

// Bloque lambda
tlanextia = x -> {
    ? x > 0 { <~ "cualli" }
    _? x < 0 { <~ "amo" }
    <~ "apan"
}

// Tlalnamiquia — ome tlahtol quiza
factor = 3
eitechmati = x -> x * factor
>> eitechmati(7) ¶    // → 21

// Tequitl chihua
cehmehuach(n) { <~ x -> x + n }
cehm_matlac = cehmehuach(10)
>> cehm_matlac(5) ¶    // → 15

// Tlapallehua itech
tequit_k = [x -> x+1, x -> x*2, x -> x*x]
>> tequit_k[3](5) ¶    // → 25
```

---

## Tlapallehua

Tlapallehua **nemohua** ihuan amantli **ce tlapaliztli** necia.

```zymbol
tlapal_k = [1, 2, 3, 4, 5]

x = tlapal_k[1]      // 1 — itta (1-itech: achtopa)
x = tlapal_k[-1]     // 5 — tlapohua amo (tlami)
x = tlapal_k$#       // 5 — tlapoa (jeporua (tlapal_k$#) >> itech)

tlapal_k = tlapal_k$+ 6            // calaqui → [1,2,3,4,5,6]
tlap_k2 = tlapal_k$+[2] 99       // calaqui 2 itech (1-itech)
tlap_k3 = tlapal_k$- 3           // quiza achtopa
tlap_k4 = tlapal_k$-- 3          // quiza mochi
tlap_k5 = tlapal_k$-[1]          // quiza 1 itech (achtopa)
tlap_k6 = tlapal_k$-[2..3]       // quiza tlaxeloa (1-itech, tlami ihuan)

oiv_k = tlapal_k$? 3             // #1 — oitztia
pos_k = tlapal_k$?? 3            // [3] — mochi itech (1-itech)
sl_k = tlapal_k$[1..3]           // [1,2,3] — tlaxeloa (1-itech)
sl2_k = tlapal_k$[1:3]           // [1,2,3] — ukhamaki, tlapohualli

asc_k = tlapal_k$^+              // tlahtoa ichtaca (achtopa)
desc_k = tlapal_k$^-             // tlahtoa cueitl (achtopa)

// Tocaitl tlapal_k — tlapal_k$^ lambda ihuan
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
por_iy = db$^ (a, b -> a.age < b.age)    // ichtaca xiuh (<)
por_tc = db$^ (a, b -> a.name > b.name)  // cueitl tocait (>)
>> por_iy[1].name ¶     // → Ana
>> por_tc[1].name ¶     // → Carla

// Tlahtol tlacuilo (tlapal_k zan)
tlapal_k[1] = 99              // calaqui
tlapal_k[2] += 5              // cehmehua: +=  -=  *=  /=  %=  ^=

// Tequitl calaqui — calaqui tlapal_k oco; achtopa ahmo nemohua
tlap_k2 = tlapal_k[2]$~ 99
```

> Mochi tlapallehua tlamachtilli quiza **tlapallehua oco**. Cueitla: `tlapal_k = tlapal_k$+ 4`.
> `$+` cehcehtla: `tlapal_k = tlapal_k$+ 5$+ 6$+ 7`. Oc no tlamachtilli amantli itech.
> **Tlapohualli 1-itech**: `tlapal_k[1]` achtopa; `tlapal_k[0]` tlatlazohtlaliztli.
> `$^+` / `$^-` **achtopa tlapallehua** (tlapohualli, tlahtolli). Cehcehtl `$^` lambda — lambda (`<` = ichtaca, `>` = cueitl).

**Amantli tlapaliztli** — tlapallehua cueitla oco amantli quiza:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ahmo nemohua
```

```zymbol
// Tlapallehua ihuan (1-itech)
patana = [[1,2,3],[4,5,6],[7,8,9]]
>> patana[2][3] ¶    // → 6  (metztli 2, tlapoa 3)
```

---

## Tlatectli

```zymbol
// Tlapallehua
tlapal_k = [10, 20, 30, 40, 50]
[a, b, c] = tlapal_k              // a=10  b=20  c=30
[achtopa, *tlami_k] = tlapal_k    // achtopa=10  tlami_k=[20,30,40,50]
[x, _, z] = [1, 2, 3]             // _ quiza

// Cehcehtl Ichtaca
yolic = (100, 200)
(px, py) = yolic                  // px=100  py=200

// Tocaitl Cehcehtl
tlaca = (name: "Ana", age: 25, city: "Tenochtitlan")
(name: n, age: a) = tlaca      // n="Ana"  a=25
```

---

## Cehcehtl

Cehcehtl **ahmo nemohua** ihuan amantli **mochi tlapaliztli** monequi.
Tlapallehua ahmo, amantli ahmo nemohua tlapoa quiza.

```zymbol
// Ichtaca — mochi tlapaliztli
yolic = (10, 20)
>> yolic[1] ¶    // → 10

nechca = (42, "niltze", #1, 3.14)
>> nechca[3] ¶     // → #1

// Tocaitl
tlaca = (name: "Sonia", age: 25)
>> tlaca.name ¶    // → Sonia
>> tlaca[1] ¶      // → Sonia  (tlapohualli ihuan, 1-itech)

// Cehcehtl
yolic_k = (x: 10, y: 20)
p = (pos: yolic_k, label: "achtopa")
>> p.pos.x ¶        // → 10
```

**Ahmo Nemohua** — amantli cueitla tlatlazohtlaliztli quiza:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ tlatlazohtlaliztli: cehcehtl ahmo nemohua
// t[1] += 5    // ❌ oc no
```

Xicmonanquili `$~` cueitla (tequitl cueitla) — **cehcehtl oco** quiza:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← achtopa ahmo nemohua
>> t2 ¶    // → (10, 999, 30)

// Tocaitl cehcehtl — oco chihua
tlaca = (name: "Sonia", age: 25)
pyahura  = (name: tlaca.name, age: 26)
>> tlaca.age ¶    // → 25
>> pyahura.age ¶     // → 26
```

---

## Tequitl Huehue

```zymbol
tlapohk = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ompoha  = tlapohk$> (x -> x * 2)              // map  → [2,4,6…20]
yoli    = tlapohk$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
mochi   = tlapohk$< (0, (acc, x) -> acc + x)  // reduce → 55

// Tlanextia tlapallehua
tlaz1 = tlapohk$| (x -> x > 3)
tlaz2 = tlaz1$> (x -> x * x)
>> tlaz2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Tequitl mana HOF itech
ompohua(x) { <~ x * 2 }
huehca(x) { <~ x > 5 }
r = tlapohk$> ompohua       // ✅ mana
r = tlapohk$| huehca        // ✅ mana
```

---

## Tlanahuatilli

Tlami `_` monequi amantli ahmo nemohua itech:

```zymbol
ompohua = x -> x * 2
cehmehua = (a, b) -> a + b
tlacah = x -> x + 1

r1 = 5 |> ompohua(_)        // → 10
r2 = 10 |> cehmehua(_, 5)       // → 15
r3 = 5 |> cehmehua(2, _)        // → 7

// Cehcehtla
r = 5 |> ompohua(_) |> tlacah(_) |> ompohua(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Tlapopolhuitl

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "tlaxeloa apan" ¶
} :! {
    >> "oc no: " _err ¶    // _err quimati tlatlazohtlaliztli
} :> {
    >> "mochipa quiza" ¶
}
```

| Tlapaliztli | Itca |
|-------------|------|
| `##Div` | Apan pan tlaxeloa |
| `##IO` | Tlahtolli / sistema |
| `##Index` | Itech tlatlazohtlaliztli |
| `##Type` | Tlapaliztli tlatlazohtlaliztli |
| `##Parse` | Tlahtolli tlapohua |
| `##Network` | Red tlatlazohtlaliztli |
| `##_` | Mochi tlatlazohtlaliztli (taqini) |

---

## Tlaxelhuia

```zymbol
// lib/calc.zy — módulo { } itech
# calc {
    #> { cehmehua, getPI }

    _PI := 3.14159
    cehmehua(a, b) { <~ a + b }
    getPI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // tocaitl monequi

>> c::cehmehua(5, 3) ¶   // → 8
pi = c::getPI()
>> pi ¶               // → 3.14159
```

```zymbol
// Quiza tocaitl oco ihuan
# tlaxelhuia {
    #> { _cehmehua_tloc => cehmehua }

    _cehmehua_tloc(a, b) { <~ a + b }
}
```

```zymbol
<# ./tlaxelhuia => m

>> m::cehmehua(3, 4) ¶    // → 7  (_cehmehua_tloc poliuh)
```

> **Módulo monequi**: zan `#>`, tequitl tlahtoa, ihuan tlahtol `# tocaitl { }` itech. Tequitl ejecutable (`>>`, `<<`, malinalliztli, etc.) tlatlazohtlaliztli E013.

---

## Tlapohualiztli

Zymbol quita tlapohualli **69 Unicode tlapohualiztli machiyotl** — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemática Negrita, LCD, ihuan oc no. Achtopa tlapaliztli zan `>>` quiza itech; tlapohualli binario zan.

### Tlapehualia

Xicmonanquili `0` ihuan `9` tlapohualli `#…#` itech:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ASCII-pan cueitla
```

### Quiza ihuan Nellitoni

```zymbol
x = 42
>> x ¶          // → 42   (ASCII achtopa)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto ASCII zan)
>> 1 + 2 ¶      // → ३

// Nellitoni: # ASCII zan, tlapohualli itech
>> #1 ¶         // → #१   (nelli Devanagari itech)
>> #0 ¶         // → #०   (amo — ahmo ० tlapohualli apan)

x = 28 > 4
>> x ¶          // → #१   (tlanextia tequitl achtopa itech)
```

### Tlapohualiztli Machiyotl Achtopa

Mochi tlapohualiztli machiyotl cualli — malinalliztli, modulo, tlanextia itech:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Nellitoni Machiyotl Mochi Tlapaliztlica

`#` + tlapohualli `0` anoce `1` mochi tlapaliztli itech nellitoni machiyotl:

```zymbol
#٠٩#
yoltok = #١        // oc no #1
>> yoltok ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII zan**. `#0` (amo) ahmo `0` (tlapohualli apan) mochi tlapaliztli itech.

---

## Tlahtol Tlamachtilli

```zymbol
// Tlapaliztli cueitla
f = ##.42         // → 42.0  (Float-pan)
i = ###3.7        // → 4     (Int-pan, tlahtoa)
t = ##!3.7        // → 3     (Int-pan, tlaxeloa)

// Tlahtolli tlapohua-pan
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ahmo tlatlazohtlaliztli)

// Tlahtoa / Tlaxeloa
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (2 itech tlahtoa)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tlaxeloa)

// Tlapohualiztli neci
fmt = #,|1234567|  // → 1,234,567  (coma ihuan)
sci = #^|12345.678|    // → 1.2345678e4  (tlapaliztli)

// Tlahtol machiyotl
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Tlahtol quiza
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Tlanecoca

```zymbol
ilhuitl = <\ date +%Y-%m-%d \>     // quita stdout (\n ihuan)
>> "Axcan: " ilhuitl

tlahtol = "tequitl.txt"
neci = <\ cat {tlahtol} \>          // calaqui tlahtolli itech

quizquia = </"./tequitl.zy"/>   // Zymbol tequitl, quita quizquia
>> quizquia
```

> `><` CLI tlahtolli tlapallehua quiza (tree-walker zan).

---

## Neci Tlamachiliztli: FizzBuzz

```zymbol
tlanextia(tlapohua) {
    ? tlapohua % 15 == 0 { <~ "FizzBuzz" }
    _? tlapohua % 3  == 0 { <~ "Fizz" }
    _? tlapohua % 5  == 0 { <~ "Buzz" }
    _ { <~ tlapohua }
}

@ i:1..20 { >> tlanextia(i) ¶ }
```

---

## Machiyotl Tlapalliztli

| Machiyotl | Tlahtol | Machiyotl | Tlahtol |
|-----------|---------|-----------|---------|
| `=` | tlahtol | `$#` | tlapoa |
| `:=` | tlazotl | `$+` | calaqui (cehcehtla) |
| `>>` | quiza | `$+[i]` | calaqui itech (1-itech) |
| `<<` | tlahtoa | `$-` | quiza achtopa |
| `¶` / `\\` | tlahtol ihuan | `$--` | quiza mochi |
| `?` | nellitoni | `$-[i]` | quiza itech (1-itech) |
| `_?` | amo ukhamako | `$-[i..j]` | quiza tlaxeloa |
| `_` | oc no | `$?` | oitztia |
| `??` | tlanextia | `$??` | mochi itech |
| `@` | malinalliztli | `$[s..e]` | tlatectli |
| `@ N { }` | N malinalliztli | `$>` | map |
| `@!` | tlatzacua | `$\|` | tlapaliztli |
| `@>` | tlatoca | `$<` | cehmehualiztli |
| `@:name { }` | tocaitl malinalliztli | `$/ delim` | tlahtolli tlaxeloa |
| `@:name!` | tlatzacua tocaitl | `$++ a b c` | cehcehtla |
| `@:name>` | tlatoca tocaitl | `arr[i>j>k]` | tlapoa itech |
| `->` | lambda | `arr[i] = val` | tlapohualli cueitla |
| `arr[i] += val` | cehmehua cueitla | `arr[i]$~` | tequitl cueitla |
| `$^+` | tlahtoa ichtaca | `$^-` | tlahtoa cueitl |
| `$^` | tlahtoa lambda | `<~` | cueitla |
| `\|>` | tlanahuatilli | `!?` | tlapopolhuitl |
| `:!` | tlatlazohtlaliztli | `:>` | mochipa quiza |
| `#1` | nelli | `#0` | amo |
| `$!` | tlatlazohtlaliztli kimün | `$!!` | sartaña |
| `<#` | tlahtoa | `#>` | quiza |
| `#` | tlaxelhuia | `::` | tlaxelhuia runa |
| `.` | renda | `#?` | tlapaliztli amantli |
| `#\|..\|` | tlahtolli tlapohualli | `##.` | Float-pan |
| `###` | Int-pan tlahtoa | `##!` | Int-pan tlaxeloa |
| `#.N\|..\|` | tlahtoa N | `#!N\|..\|` | tlaxeloa N |
| `#,\|..\|` | coma neci | `#^\|..\|` | tlapaliztli |
| `#d0d9#` | tlapohualiztli | `#09#` | ASCII cueitla |
| `<\ ..\>` | shell tequitl | `>\<` | CLI tlahtolli |
| `\ var` | tlahtol poxahui | `°x` / `x°` | achtopa tlahtol |
| `>>|` | TUI tlapallehua | `>>~` | tlapoa quiza |
| `>>!` | pantalla poxahui | `>>?` | terminal tlapoa |
| `<<\|` | señal tlahtoa | `<<\|?` | ahmo cochi señal |
| `@~ N` | cochi N ms | `$*` | tlahtolli N tlami |

---

## Moyolnonotzaliztli

### v0.0.5 — TUI Achtopa, Tlahtol ihuan Tlahtolli _(Mayu 2026)_

- **Tlapoloa** Tlanextia machiyotl: `pattern : result` → `pattern => result`
- **Tlapoloa** Tlahtoa tocaitl: `<# sara <= tocaitl` → `<# sara => tocaitl`
- **Tlapoloa** Quiza tocaitl: `#> { fn <= pub }` → `#> { fn => pub }`
- **Calaqui** TUI `>>| { }` — pantalla tlacpac + modo cecec; tlapoa cueitla
- **Calaqui** Tlapoa quiza `>>~ (ren, col, BKS, fg, bg) > amantli` — slot, ANSI 256
- **Calaqui** Señal `<<| tlahtol` (cochi) ihuan `<<|? tlahtol` (ahmo cochi)
- **Calaqui** `>>!` pantalla poxahui, `>>?` terminal tlapoa, `@~ N` cochi N ms
- **Calaqui** Tlahtol achtopa `°x` / `x°` — necia malinalliztli itech
- **Calaqui** Tlahtolli malinalliztli `str $* N` — tlahtolli N tlami
- **VM** Ukhamawa: 436/436 yatiqawi wali

### v0.0.4 — 1-Itech, Tequitl Achtopa & Tlaxelhuia _(Abrilpe 2026)_

- **Tlapoloa** Mochi tlapohualli **1-itech** — `tlapal_k[1]` achtopa; `tlapal_k[0]` tlatlazohtlaliztli
- **Calaqui** Tocaitl tequitl **achtopa amantli** — mana itech HOF: `tlapohk$> ompohua`
- **Calaqui** Tlaxelhuia **tlapallehua tlapaliztli** monequi: `# tocaitl { ... }` — zan tlapaliztli
- **Calaqui** Patankiri tlapohualli: `arr[i>j>k]` (tlapoa), `arr[p ; q]` (quiza)
- **Calaqui** Tlapaliztli cueitla: `##.expr` (Float), `###expr` (Int tlahtoa), `##!expr` (Int tlaxeloa)
- **Calaqui** Tlahtolli tlaxeloa: `str$/ delim` — cueitla `Array(String)`
- **Calaqui** Cehcehtla: `base$++ a b c` — miec amantli calaqui
- **Calaqui** N malinalliztli: `@ N { }` — N tlami tequitl
- **Calaqui** Tocaitl malinalliztli: `@:tocaitl { }`, `@:tocaitl!`, `@:tocaitl>` — amo `@ @tocaitl`
- **Calaqui** Tlahtol tlapoa: `_tocaitl` itech; `\ tlahtol` achtopa poxahui
- **Calaqui** Tlanextia tlapaliztli: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Calaqui** Tlaxelhuia E013 tlatlazohtlaliztli: tequitl ejecutable itech tlatlazohtlaliztli
- **Cueitla** `take_variable` ahmo nemohua tlaxelhuia amantli
- **Cueitla** `alias.CONST` cualli cueitla; `#>` tequitl tlami itech
- **VM** Ukhamawa: 393/393 yatiqawi wali

### v0.0.3 — Unicode Tlapohualiztli & LSP Cueitla _(Abrilpe 2026)_

- **Calaqui** 69 Unicode tlapohualiztli machiyotl `#d0d9#` itech
- **Calaqui** Nellitoni machiyotl mochi tlapaliztli — `#१` / `#०`, `#١` / `#٠`, etc.
- **Calaqui** Klingon pIqaD tlapohualli (CSUR PUA U+F8F0–U+F8F9)
- **Calaqui** `SetNumeralMode` VM opcode — ukhamawa tree-walker itech
- **Calaqui** REPL tlapohualiztli quiza ihuan tlahtol itech
- **Cueitla** Nellitoni `>>` quiza `#` ihuan (`#0` / `#1`) mochi tlapaliztli

### v0.0.2_01 — Machiyotl Ñe'ẽ _(Marzepe 2026)_

- **Cueitla** `c|..|` → `#,|..|` ihuan `e|..|` → `#^|..|` — ukhamawa `#` amantli
- **Calaqui** Quiza tocaitl: tlaxelhuia amantli tocaitl oc no quiza

### v0.0.2 — Tlapallehua API Cueitla & Instaladores _(Marzepe 2026)_

- **Calaqui** `$` tlamachtilli tlapallehua ihuan tlahtolli itech (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Calaqui** Tlatectli tlapallehua, cehcehtl, ihuan tocaitl cehcehtl itech
- **Calaqui** Tlapohualli amo (`tlapal_k[-1]` = tlami)
- **Calaqui** Instaladores — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(Marzepe 2026)_

- **Calaqui** Cehmehua `^=`
- **Cueitla** Parser tlapohualli tequitl; tlahtoa cueitla

### v0.0.1 — Achtopa Quiza _(Marzepe 2026)_

- Tree-walker tlahtol + register VM (`--vm`, ~4× cualli, ~95% ukhamawa)
- Mochi tlahtol: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Mochi Unicode tocaitl, tlaxelhuia, lambda, tlalnamiquia, tlapopolhuitl
- REPL, LSP, VS Code, tlahtoa (`zymbol fmt`)

---

_Zymbol-Lang — Machiyotl. Mochi ihuan. Ahmo Nemohua._
