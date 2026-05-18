> **Pirlirlipa yimi:** Kuruwarri yalumpu AI-rlu yirrarnu.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Yimi kirlangu **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** interpreter-kurra.

---

# Zymbol-Lang — Yimi Kirlangu

> **Kankarlurlu v0.0.5 — 2026-05-12**

**Zymbol-Lang** yimi-kurlu programming language. Lawa keyword — tu lakal pirnki. Kuja-manu bey yapa-patu t'aan-juku.

- Lawa `if`, `while`, `return` — chen `?`, `@`, `<~`
- Unicode wiri — wangka-juku yapa t'aan wa emoji
- T'aan yapa lawa ku pirnkinja — kod kuja-manu tu lakal ngurra

**Interpreter version**: v0.0.5 | **Test coverage**: 436/436 (TW ↔ VM parity)

---

## Jalangu & Pirlirlipa

```zymbol
x = 10              // jalangu ku pirnkinja
PI := 3.14159       // pirlirlipa — kankarlurlu k'as ka pirnkinja
wangka = "Nampijinpa"
yuwarli = #1        // bool yuwayi
👋 := "Yuwayi"
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

`°` (U+00B0) ku kaajil jalangu jarda lawa-pala jinta-pala:

```zymbol
jardajarda = [3, 1, 4, 1, 5]
@ n:jardajarda {
    °jardamanu += n    // ku kaajil 0 pirli-pirli ngurra; ku bin @-ka
}
>> jardamanu ¶         // → 14
```

> `°x` (prefix) pirli-pirli ngurra ku kaajil — ku bin @-kari.
> `x°` (postfix) pirli-pirli kankarlurlu — ku kari pirli-pirli.
> Tree-walker chen.

---

## Yimi Panu

| Yimi | Tziib | `#?` | Yirninja |
|------|---------|----------|-------|
| Int | `42`, `-7` | `###` | 64-bit signed |
| Float | `3.14`, `1.5e10` | `##.` | Scientific notation OK |
| T'aan | `"yimi"` | `##"` | Pirlirlipa: `"Yuwayi {wangka}"` |
| Char | `'A'` | `##'` | Jinta Unicode |
| Bool | `#1`, `#0` | `##?` | Lawa jarda — `#1 ≠ 1` |
| Jalama | `[1, 2, 3]` | `##]` | Kuja-manu yimi |
| Tupla | `(a, b)` | `##)` | Jarda-panu |
| Tupla Wangka | `(x: 1, y: 2)` | `##)` | Wangka jarda-panu |
| Function | named function ref | `##()` | First-class; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-class; `<lambd/N>` |

```zymbol
// yimi panu — ku ookol (panu, jarda, nilai)
yimipanu = 42#?
>> yimipanu ¶         // → (###, 2, 42)
t = yimipanu[1]
>> t ¶            // → ###
```

---

## Wangkanja & Ngurnturninja

```zymbol
>> "Yuwayi" ¶                     // ¶ wa \\ jinta-palu yimi
>> "a=" a " b=" b ¶               // yalumpu — yimi panu
>> (jalama$#) ¶                   // pirnki posfijo k'uchul ( ) ti' >>

<< wangka                         // ngurnturninja (lawa yimi pirlirlipa)
<< "Wangka yimi: " wangka         // yéetel yimi pirlirlipa
```

> `¶` (AltGr+R Spanish teclado-ku) yéetel `\\` kuja-manu yimi.

---

## TUI Primitivos

Terminal UI pirnki interactive programa-juku. Yaab ku k'uchul `>>| { }` bloque.

```zymbol
>>| {
    >>!                              // ku su'uk pantalla alterna
    >>~ (1, 1, 0, 10) > "Yuwarli"   // jelen 1, col 1, fg=10 (yaax)
    @~ 1000                          // ku k'uchul 1 segundo (1000 ms)
    >>~ (2, 1) > "Yirrarnu."
}
// terminal ku ts'o'oksik automatiko
```

```zymbol
// Teclado yéetel warlalku wiri
>>| {
    [jeleno, kolumo] = >>?           // ku k'amik warlalku wiri
    >>~ (1, 1) > "Warlalku: " jeleno " x " kolumo
    <<| klave                        // ku ngurnturninja tecla
    >>~ (2, 1) > "Kankarlurlu: " klave
}
```

> `>>!` ku su'uk tziib. `>>?` ku ookol `[rows, cols]`. `@~ N` ku k'uchul N milliseconds.
> `<<|` ku ngurnturninja tecla; `<<|?` lawa ku k'uchul (ku ookol `'\0'` wa lawa).
> Tupla: `(row, col, BKS, fg, bg)` — ba'al slot lawa yéetel coma (`>>~ (,,, 196) > "chak"`).
> BKS: `1`=Pirlirlipa, `2`=Kankarlurlu, `4`=Yirninja. ANSI 256 colores (`0`=predeterminado).
> Tree-walker chen (lawa `>>!`, `>>?`, `@~`, `>>~` ku bin `--vm`).

---

## Pirnki Yimi

```zymbol
// Jarda pirnki
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (jarda ts'iit'ik)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potencia)

// Kuja-manu — ku kaab jalangu
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lógico
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Yimi Yirninja

```zymbol
// Jirrama bey yimi pirlirlipa
wangka = "Nampijinpa"
n = 42

>> "Yuwayi " wangka " jardamanu " n ¶  // yalumpu — ti' >>
yimijuku = "Yuwayi {wangka}, jardamanu {n}"  // pirlirlipa — tu lakal
```

```zymbol
s = "Yuwayi Yapa-Patu"
nampula = s$#                  // 16
wita = s$[1..6]                // "Yuwayi"  (jinta-panu, yirninja)
yinpirni = s$? "Yapa"          // #1
kirlangu = "a,b,c,d"$/ ','    // [a, b, c, d]  (ts'iit'ik)
jirramba_yimi = s$~~["a":"A"]        // ku yirninja
jirramba_yimi1 = s$~~["a":"A":1]     // jinta chen
pirnki_yimi = "─" $* 20           // "────────────────────"  (N kuja-manu)
```

> `+` jarda chen. Yóok'ol t'aan `,`, yalumpu, wa pirlirlipa.

---

## Jukurrpa Yuwarli

```zymbol
x = 7

? x > 0 { >> "ngurrju" ¶ }

? x > 100 {
    >> "wiri" ¶
} _? x > 0 {
    >> "ngurrju" ¶
} _? x == 0 {
    >> "lawa" ¶
} _ {
    >> "kari-juku" ¶
}
```

> `{ }` ku k'uchul siempre jinta-palu yimi.

---

## Kuja-Manu

```zymbol
// Jarda-jarda
warumpa = 85
yirninja = ?? warumpa {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> yirninja ¶    // → B

// Yimi
yarli = "chak"
kudi = ?? yarli {
    "chak"   => "#FF0000"
    "yaax"   => "#00FF00"
    _        => "#000000"
}

// Kuja-manu pirnki
yalara = -5
kujamanu = ?? yalara {
    < 0  => "yarlungku"
    < 20 => "jintiku"
    < 35 => "jinti"
    _    => "yalara"
}
>> kujamanu ¶    // → yarlungku

// Yimi yirninja (bloque)
n = -3
?? n {
    0    => { >> "lawa" ¶ }
    < 0  => { >> "kari-juku" ¶ }
    _    => { >> "ngurrju" ¶ }
}
```

---

## Pirli-Pirli

```zymbol
@ i:0..4  { >> i " " }        // jarda-jarda:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // yéetel pirli:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kari-palu:     5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (pirli-pirli)

watiyajarda = ["watiyanguru", "pajarra", "wapirra"]
@ f:watiyajarda { >> f ¶ }    // ti' jalama

@ c:"yuwayi" { >> c "-" }
>> ¶                          // → y-u-w-a-y-i-  (ti' yimi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> ku bin
    ? i > 7 { @! }             // @! ku kari
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Pirli-pirli lawa kaaj
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Wangka pirli-pirli (kaaj kijaka)
jarda = 0
@:ngurra {
    jarda++
    ? jarda >= 3 { @:ngurra! }
}
>> jarda ¶                    // → 3
```

---

## Ngurra-Kurlangu

```zymbol
wantiki(a, b) { <~ a + b }
>> wantiki(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Ngurra-kurlangu ku k'uchul **scope aislado** — lawa ku kaajil jalangu tu yóok'ol. `<~` ku bin:

```zymbol
kijamanu(a<~, b<~) {
    pinamanu = a
    a = b
    b = pinamanu
}
x = 10
y = 20
kijamanu(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ngurra-kurlangu wangka **first-class** — ku bin: `jardajarda$> jirramba`. Waye: `x -> fn(x)` ku bin.

---

## Lambdas & Tarlipirni

```zymbol
jirramba = x -> x * 2
jardamanu = (a, b) -> a + b
>> jirramba(5) ¶    // → 10
>> jardamanu(3, 7) ¶    // → 10

// Lambda bloque
yirdijimanu = x -> {
    ? x > 0 { <~ "ngurrju" }
    _? x < 0 { <~ "kari-juku" }
    <~ "lawa"
}

// Tarlipirni — ku kaajil tu yóok'ol
factor = 3
marnkurrpa = x -> x * factor
>> marnkurrpa(7) ¶    // → 21

// Wantikimanu
wantikimanu(n) { <~ x -> x + n }
wantiki10 = wantikimanu(10)
>> wantiki10(5) ¶    // → 15

// Ti' jalama
pirnkijuku = [x -> x+1, x -> x*2, x -> x*x]
>> pirnkijuku[3](5) ¶    // → 25
```

---

## Jalama-Jarda

Jalama-jarda **ku pirnkinja** yéetel yimi **kuja-manu panu**.

```zymbol
jalama = [1, 2, 3, 4, 5]

x = jalama[1]      // 1 — ok'ol (jinta-panu: jinta)
x = jalama[-1]     // 5 — kari-palu (u kaajil)
x = jalama$#       // 5 — nampula (ti' (jalama$#) ti' >>)

jalama = jalama$+ 6            // ku kaab → [1,2,3,4,5,6]
arr2 = jalama$+[2] 99       // ti' yirninja 2 (jinta-panu)
arr3 = jalama$- 3           // ku kari jinta-palu yimi
arr4 = jalama$-- 3          // ku kari tu lakal
arr5 = jalama$-[1]          // ku kari yirninja 1
arr6 = jalama$-[2..3]       // ku kari jarda-panu

yinpirni = jalama$? 3            // #1 — ku bin
nguwo = jalama$?? 3           // [3] — tu lakal yirninja (jinta-panu)
wita = jalama$[1..3]          // [1,2,3] — kijaka (jinta-panu)
wita2 = jalama$[1:3]          // [1,2,3] — biy kuja-manu, jarda-ku

naats_bin = jalama$^+             // ku tsool naats (xook chen)
keban_bin = jalama$^-             // ku tsool keban (xook chen)

// Tupla jalama — $^ yéetel tarlipirni
db = [(wangka: "Nampijinpa", jardangu: 28), (wangka: "Nakamarra", jardangu: 25), (wangka: "Jakamarra", jardangu: 30)]
jardaku  = db$^ (a, b -> a.jardangu < b.jardangu)    // jarda naats  (<)
wangkaku = db$^ (a, b -> a.wangka > b.wangka)         // wangka keban (>)
>> jardaku[1].wangka ¶     // → Nakamarra
>> wangkaku[1].wangka ¶    // → Nampijinpa

// Ku pirnkinja jinta (jalama chen)
jalama[1] = 99              // ku kaab
jalama[2] += 5              // yalumpu: +=  -=  *=  /=  %=  ^=

// Ku pirnkinja yimi — ku ookol jalama nok'; original lawa ku bis
arr2 = jalama[2]$~ 99
```

> Tu lakal pirnki colección ku ookol **jalama nok'**. Ku kaab: `jalama = jalama$+ 4`.
> `$+` ku tsoolte: `jalama = jalama$+ 5$+ 6$+ 7`. Yali pirnki yalumpu intermedios.
> **Jinta-panu**: `jalama[1]` jinta; `jalama[0]` kankarlurlu k'as.
> `$^+` / `$^-` **jalama jarda** (xooknalob, yimi). Tupla-ku `$^` yéetel tarlipirni.

**Nilai kuja-manu** — ku kaab jalama ku ookol kopi jinta:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b lawa ku bis
```

```zymbol
// Jalama-jarda anidado (jinta-panu)
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[2][3] ¶    // → 6  (jelen 2, kolu 3)
```

---

## Yimi Kijaka

```zymbol
// Jalama
jalama = [10, 20, 30, 40, 50]
[a, b, c] = jalama              // a=10  b=20  c=30
[jinta, *yalimpa] = jalama      // jinta=10  yalimpa=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ ku kari

// Tupla jarda-panu
wurnturu = (100, 200)
(px, py) = wurnturu             // px=100  py=200

// Tupla wangka
yapa = (wangka: "Nakamarra", jardangu: 25, ngurra: "Yuendumu")
(wangka: n, jardangu: a) = yapa  // n="Nakamarra"  a=25
```

---

## Jalama-Wita

Jalama-wita **lawa ku pirnkinja** ku kaajil yimi **yimi panu jirrama**.
Lawa jalama, yimi lawa ku pirnkinja ka yirrarnu.

```zymbol
// Jarda-panu — yimi panu yuwayi
wurnturu = (10, 20)
>> wurnturu[1] ¶    // → 10

yimipanu = (42, "yuwayi", #1, 3.14)
>> yimipanu[3] ¶     // → #1

// Wangka
yapa = (wangka: "Nampijinpa", jardangu: 25)
>> yapa.wangka ¶    // → Nampijinpa
>> yapa[1] ¶        // → Nampijinpa  (jarda ku bin, jinta-panu)

// Kijaka
nguwo = (x: 10, y: 20)
p = (nguwo: nguwo, wangka: "murungku")
>> p.nguwo.x ¶        // → 10
```

**Lawa ku pirnkinja** — ka ku pirnkinja jalama-wita yimi kankarlurlu k'as:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kankarlurlu k'as: jalama-wita lawa ku pirnkinja
// t[1] += 5    // ❌ kuja-manu k'as
```

`$~` ku bin — ku ookol **nok'** jalama-wita:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original lawa ku bis
>> t2 ¶    // → (10, 999, 30)

// Tupla wangka — ku kankarlurlu yirrarnu
yapa = (wangka: "Nampijinpa", jardangu: 25)
kurdiji  = (wangka: yapa.wangka, jardangu: 26)
>> yapa.jardangu ¶    // → 25
>> kurdiji.jardangu ¶  // → 26
```

---

## Nampula Ngurra-Kurlangu

```zymbol
jardajarda = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

jirramba_jalama  = jardajarda$> (x -> x * 2)              // map  → [2,4,6…20]
jirramba_jarda   = jardajarda$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
jardamanu        = jardajarda$< (0, (acc, x) -> acc + x)  // reduce → 55

// Pirlirlipa yalumpu
pirli1 = jardajarda$| (x -> x > 3)
pirli2 = pirli1$> (x -> x * x)
>> pirli2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ngurra-kurlangu wangka ku bin ti' HOF
jirramba(x) { <~ x * 2 }
wiripa(x) { <~ x > 5 }
r = jardajarda$> jirramba     // ✅ referencia pirlirlipa
r = jardajarda$| wiripa        // ✅ referencia pirlirlipa
```

---

## Pirnki Pipe

RHS ku k'uchul siempre `_` jarda-ku:

```zymbol
jirramba = x -> x * 2
wantiki = (a, b) -> a + b
jinta_pirnki = x -> x + 1

r1 = 5 |> jirramba(_)          // → 10
r2 = 10 |> wantiki(_, 5)       // → 15
r3 = 5 |> wantiki(2, _)        // → 7

// Pirlirlipa
r = 5 |> jirramba(_) |> jinta_pirnki(_) |> jirramba(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kankarlurlu Yirninja

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "yirninja lawa-juku" ¶
} :! {
    >> "yali: " _err ¶    // _err ku kaajil k'as yimi
} :> {
    >> "pirli-pirli yuwarli" ¶
}
```

| Panu | Kuja |
|------|------|
| `##Div` | Yirninja lawa-juku |
| `##IO` | Tziib / sistema |
| `##Index` | Yirninja lawa |
| `##Type` | Panu kankarlurlu |
| `##Parse` | Yimi kijaka |
| `##Network` | Ka'anal k'as |
| `##_` | Tu lakal k'as (catch-all) |

---

## Modulaso

```zymbol
// lib/wantiki.zy — modulaso kankarlurlu llaves-ku
# wantiki {
    #> { wantiki_jool, get_PI }

    _PI := 3.14159
    wantiki_jool(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// kaajil.zy
<# ./lib/wantiki => c    // alias ku k'uchul

>> c::wantiki_jool(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar yéetel wangka nok'
# yimijuku {
    #> { _wantiki_kari => jardamanu }

    _wantiki_kari(a, b) { <~ a + b }
}
```

```zymbol
<# ./yimijuku => m

>> m::jardamanu(3, 4) ¶    // → 7  (wangka _wantiki_kari lawa ku yil)
```

> **Reglas modulaso**: chen `#>`, ngurra-kurlangu, yéetel jalangu-jarda ti' `# wangka { }`. Yimi yirrarnu (`>>`, `<<`, pirli-pirli) E013 k'as.

---

## Jarda Yirninja

Zymbol ku ookol jarda ti' **69 Unicode** — Devanagari, Árabe-Índico, Thai, Maya, yéetel yali. Modo activo ku pirnkinja chen `>>` wangkanja; aritmética ASCII siempre.

### Pirlirlipa Pirnkinja

Ku tziib `0` yéetel `9` ti' script destino `#…#`-ku:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ku kuchul ASCII
```

### Wangkanja & Jarda Pirlirlipa

```zymbol
x = 42
>> x ¶          // → 42   (ASCII jinta)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimal ASCII siempre)
>> 1 + 2 ¶      // → ३

// Bool: # ASCII siempre, jarda ku pirnkinja
>> #1 ¶         // → #१   (yuwayi Devanagari-ku)
>> #0 ¶         // → #०   (lawa — lawa ० jarda-wita)

x = 28 > 4
>> x ¶          // → #१   (kuja-manu ku bin modo-ku)
```

### Jarda Yimi Ti Kod

Ba'al script jarda ku bin — jarda-jarda, modulo, kuja-manu:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Jarda Pirlirlipa Ti Yirninja

`#` + jarda `0` wa `1` ti' ba'al bloque ku bin bool literal:

```zymbol
#٠٩#
yuwarli = #١        // kuja-manu #1
>> yuwarli ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII siempre**. `#0` (lawa) lawa kuja-manu `0` (jarda-wita) ti' ba'al script.

---

## Yimi-Panu Pirnki

```zymbol
// Ku pirnkinja panu
f = ##.42         // → 42.0  (ti' Float)
i = ###3.7        // → 4     (ti' Int, ku tsool)
t = ##!3.7        // → 3     (ti' Int, ku bisik)

// Ku kijaka yimi jarda-ku
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (lawa k'as)

// Ku tsool / ku bisik
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (jirrama decimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (ku bisik)

// Formato jarda
fmt = #,|1234567|  // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Jarda base tziib
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Ku ookol base kijaka
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Ngurra

```zymbol
jurnta = <\ date +%Y-%m-%d \>     // ku kaajil stdout (yéetel \n)
>> "Jurnta: " jurnta

kuruwarri = "yimipanu.txt"
yimijuku = <\ cat {kuruwarri} \>  // pirlirlipa ti' comando

wangkanja = </"./subscript.zy"/>  // ku bin Zymbol nok', ku kaajil
>> wangkanja
```

> `><` ku kaajil CLI jarda bey jalama yimi (tree-walker chen).

---

## Yimi Kirlangu: FizzBuzz

```zymbol
yirdijimanu(jarda) {
    ? jarda % 15 == 0 { <~ "FizzBuzz" }
    _? jarda % 3  == 0 { <~ "Fizz" }
    _? jarda % 5  == 0 { <~ "Buzz" }
    _ { <~ jarda }
}

@ i:1..20 { >> yirdijimanu(i) ¶ }
```

---

## Pirnki Kuruwarri

| Pirnki | Yirrarnu | Pirnki | Yirrarnu |
|--------|-----------|--------|-----------|
| `=` | jalangu | `$#` | nampula |
| `:=` | pirlirlipa | `$+` | ku kaab (pirlirlipa) |
| `>>` | wangkanja | `$+[i]` | ti' yirninja (jinta-panu) |
| `<<` | ngurnturninja | `$-` | ku kari jinta yimi |
| `¶` / `\\` | yimi jinta | `$--` | ku kari tu lakal |
| `?` | kuja | `$-[i]` | ku kari yirninja (jinta-panu) |
| `_?` | yali kuja | `$-[i..j]` | ku kari jarda-panu |
| `_` | yali / tu lakal | `$?` | ku bin |
| `??` | kuja-manu | `$??` | tu lakal yirninja (jinta-panu) |
| `@` | pirli-pirli | `$[s..e]` | kijaka (jinta-panu) |
| `@ N { }` | pirli-pirli N kuja | `$>` | ku bis |
| `@!` | ku kari | `$\|` | ku tseeltik |
| `@>` | ku bin | `$<` | ku tsol |
| `@:wangka { }` | wangka pirli-pirli | `$/ delim` | ku kijaka yimi |
| `@:wangka!` | ku kari wangka | `$++ a b c` | ku tsoolte |
| `@:wangka>` | ku bin wangka | `arr[i>j>k]` | yirninja kijaka |
| `->` | lambda | `arr[i] = nilai` | ku pirnkinja (jalama chen) |
| `arr[i] += nilai` | yalumpu ku pirnkinja | `arr[i]$~` | ku pirnkinja yimi |
| `$^+` | ku tsool naats (xook) | `$^-` | ku tsool keban (xook) |
| `$^` | ku tsool tarlipirni-ku | `<~` | ku ookol |
| `\|>` | pipe | `!?` | ku bin kijaka |
| `:!` | ku kaajil k'as | `:>` | pirli-pirli ku bin |
| `#1` | yuwayi | `#0` | lawa |
| `$!` | k'as ku bin | `$!!` | ku bisik k'as |
| `<#` | ku hochpahal | `#>` | ku ookol |
| `#` | modulaso wangka | `::` | modulaso ku bin |
| `.` | wangka ku bin | `#?` | yimi panu |
| `#\|..\|` | ku kijaka jarda | `##.` | ti' Float |
| `###` | ti' Int (ku tsool) | `##!` | ti' Int (ku bisik) |
| `#.N\|..\|` | ku tsool | `#!N\|..\|` | ku bisik |
| `#,\|..\|` | formato jarda | `#^\|..\|` | científico |
| `#d0d9#` | ku pirnkinja jarda | `#09#` | ku kuchul ASCII |
| `<\ ..\>` | shell ku bin | `>\<` | CLI jarda |
| `\ jalangu` | ku bisik jalangu | `°x` / `x°` | jinta pirlirlipa (auto-init) |
| `>>\|` | TUI bloque (pantalla alterna) | `>>~` | wangkanja jarda |
| `>>!` | ku su'uk tziib | `>>?` | ku k'amik warlalku wiri |
| `<<\|` | tecla pirlirlipa | `<<\|?` | tecla lawa pirlirlipa |
| `@~ N` | ku k'uchul N milliseconds | `$*` | yimi pirli-pirli N kuja |

---

## Yimi Kankarlurlu

### v0.0.5 — TUI Primitivos, Jinta Pirlirlipa & Yimi Pirli-Pirli _(Ngurrju Jurnta 2026)_

- **Ku bis** Match arm: `pattern : result` → `pattern => result`
- **Ku bis** Import alias: `<# path <= alias` → `<# path => alias`
- **Ku bis** Export rename: `#> { fn <= pub }` → `#> { fn => pub }`
- **Ku kaab** TUI bloque `>>| { }` — pantalla alterna + modo raw
- **Ku kaab** Wangkanja jarda `>>~ (jelen, col, BKS, fg, bg) > yimi`
- **Ku kaab** Ngurnturninja `<<| jalangu` (pirlirlipa) yéetel `<<|? jalangu`
- **Ku kaab** `>>!`, `>>?`, `@~ N`
- **Ku kaab** `°x` / `x°` — jinta ku kaajil pirli-pirli ngurra-ku
- **Ku kaab** Yimi pirli-pirli `yimi $* N`
- **VM** Parity: 436/436

### v0.0.4 — Jinta-Panu, First-Class Ngurra-Kurlangu & Bloque Modulaso _(Ngurrju Jurnta 2026)_

- **Ku bis** Tu lakal **jinta-panu** — `jalama[1]` jinta; `jalama[0]` k'as
- **Ku kaab** Ngurra-kurlangu **first-class** — `jardajarda$> jirramba`
- **Ku kaab** Modulaso **bloque sintaxis**: `# wangka { ... }`
- **Ku kaab** Jarda-panu: `jalama[i>j>k]`, `jalama[p ; q]`
- **Ku kaab** Ku pirnkinja: `##.expr` (Float), `###expr` (Int), `##!expr` (Int)
- **Ku kaab** Yimi kijaka: `yimi$/ delim`
- **Ku kaab** Pirlirlipa: `base$++ a b c`
- **Ku kaab** Pirli-pirli N: `@ N { }`
- **Ku kaab** Wangka pirli-pirli: `@:wangka { }`, `@:wangka!`, `@:wangka>`
- **Ku kaab** `_wangka` scope; `\ jalangu`
- **Ku kaab** Kuja-manu pirnki: `< 0 :`, `> 5 :`, `== 42 :`
- **VM** 393/393

### v0.0.3 — Unicode Jarda & LSP _(Ngurrju Jurnta 2026)_

- **Ku kaab** 69 Unicode `#d0d9#`
- **Ku kaab** Bool ti' ba'al script — `#1` / `#0`
- **Ku kaab** Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ku kaab** `SetNumeralMode` VM opcode
- **Ku bis** Bool `>>` yéetel `#` prefix (`#0` / `#1`)

### v0.0.2_01 — Pirnki Kankarlurlu _(30 Mar 2026)_

- **Ku bis** `c|..|` → `#,|..|` yéetel `e|..|` → `#^|..|`
- **Ku kaab** Export alias

### v0.0.2 — Jalama API Kankarlurlu & Yukarninja _(24 Mar 2026)_

- **Ku kaab** `$` pirnki (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ku kaab** Yimi kijaka jalama, tupla, wangka tupla
- **Ku kaab** Kari-palu jarda (`jalama[-1]`)
- **Ku kaab** Installers — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Ku kaab** Compound assignment `^=`
- **Ku bis** Parser edge cases

### v0.0.1 — Jinta Wangkanja _(22 Mar 2026)_

- Tree-walker yéetel register VM (`--vm`, ~4× wiri, ~95% parity)
- Tu lakal pirnki: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode jalangu, modulaso, lambdas, tarlipirni, k'as yirninja
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Pirnki. Tu Lakal. Lawa Ku Pirnkinja._
