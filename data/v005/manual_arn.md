> **Kimüntun:** Tüfachi kimeltun IA (inteligencia artificial) mew femgechi.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kimün rüpü ta **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** intérprete zugumeal mew.

---

# Zymbol-Lang Manual

> **Kimün v0.0.5 — 2026-05-12**

**Zymbol-Lang** zugumeal küzaw rüpü. Wüño küpal — kom zugumeal. Fentren mapuche zugün mew melo.

- Wüño `if`, `while`, `return` — muten `?`, `@`, `<~`
- Kom Unicode — küpal kom zugün o emoji mew
- Mapuche zugün — küzaw melo kom mew

**Küzaw wirin**: v0.0.5 | **Kimüntun**: 436/436 (TW ↔ VM melo)

---

## Zugu ka Küme Zugu

```zymbol
x = 10              // rüme zugu
PI := 3.14159       // küme zugu — wüño zugumeal küzaw mew weza
küpal = "Mailen"
mongen = #1         // pewümn mongen
👋 := "Mari mari"
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

`°` (U+00B0) zugu fachantü wüño küme mew wünen rüpü:

```zymbol
akuñma = [3, 1, 4, 1, 5]
@ n:akuñma {
    °fentren += n    // fachantü 0 mew wüño; rüpüle @
}
>> fentren ¶         // → 14
```

> `°x` (wünen) rüpüle küzaw mew — küpa rüpü @ kellechi mew.
> `x°` (kellechi) rüpüle küzaw mew — kellechi @ mew.
> Tree-walker muten.

---

## Zugu Kimün

| Kimün | Wirin | `#?` | Kimüntun |
|-------|-------|------|----------|
| Int | `42`, `-7` | `###` | 64-bit firmado |
| Float | `3.14`, `1.5e10` | `##.` | Kimüntun rüpü OK |
| Wirin | `"texto"` | `##"` | Fangelum: `"Mari mari {küpal}"` |
| Kiñe Wirin | `'A'` | `##'` | Kiñe Unicode |
| Pewümn | `#1`, `#0` | `##?` | NO akuñma — `#1 ≠ 1` |
| Kiñeke | `[1, 2, 3]` | `##]` | Melo zugu |
| Fampüchi | `(a, b)` | `##)` | Akuñma mew |
| Küpal Fampüchi | `(x: 1, y: 2)` | `##)` | Küpal zugumeal |
| Küzaw | küzaw rüpü | `##()` | Wünen; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Wünen; `<lambd/N>` |

```zymbol
// Zugu kimüntun — küpalen (kimün, akuñma, zugu)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Zugegeal ka Zuguleam

```zymbol
>> "Mari mari" ¶                  // ¶ o \\ rüpü küpal
>> "a=" a " b=" b ¶               // fampüchi — fentren zugu
>> (arr$#) ¶                      // kimüntun zugumeal kümekawün ( ) >> mew

<< küpal                          // zuguleam zugu mew (wüño kimüntun)
<< "Küpal ti: " küpal             // kimüntun mew
```

> `¶` (AltGr+R teclado español mew) ka `\\` melo rüpü küpal.

---

## TUI Kümekawün

Terminal UI kümekawün küzaw zugumeal. Fentren `>>| { }` kümeal (pantalla wüño + modo crudo).

```zymbol
>>| {
    >>!                             // mapu zugeleam
    >>~ (1, 1, 0, 10) > "Rüpülen"  // kiñe 1, mülelu 1, fg=10 (karü)
    @~ 1000                         // rüpün 1 akuñma (1000 ms)
    >>~ (2, 1) > "Kellechi."
}
// terminal fürüm kellechi amun mew
```

```zymbol
// Zugumeal ka terminal küzaw
>>| {
    [rüpü, mülelu] = >>?            // terminal akuñma kimüntun
    >>~ (1, 1) > "Terminal: " rüpü " x " mülelu
    <<| zugu                        // zuguleam kiñe (rüpüle)
    >>~ (2, 1) > "Zugelechi: " zugu
}
```

> `>>!` mapu zugeleam. `>>?` küpalen `[rüpü, mülelu]`. `@~ N` rüpün N ms.
> `<<|` kiñe zugumeal (rüpüle); `<<|?` wüño zugumeal (küpalen `'\0'` wüño mew).
> Zugegeal fampüchi: `(rüpü, mülelu, BKS, fg, bg)` — wüño küpa koma mew (`>>~ (,,, 196) > "kelü"`).
> BKS: `1`=Negrita, `2`=Cursiva, `4`=Subrayado. ANSI 256 rangi (`0`=terminal fachantü).
> Tree-walker muten (wüño `>>!`, `>>?`, `@~`, `>>~` `--vm` mew rüpüle).

---

## Küzawün Zugumeal

```zymbol
// Akuñma Küzawün
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (akuñma küdaw)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (fentren akuñma)

// Kimüntun — zugumeal kimün
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Pewümn Zugumeal
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Wirinkawün

```zymbol
// Epu fampüchi rüpü
küpal = "Mailen"
n = 42

>> "Mari mari " küpal " küpa " n ¶    // fampüchi — >> mew
zugu = "Mari mari {küpal}, küpa {n}"  // fangelum — kom mew
```

```zymbol
s = "Mari mari Mapu"
fentren_s = s$#              // 15
wüño_s = s$[1..5]            // "Mari "  (1-zugumeal, kellechi fampüchi)
mongechi = s$? "Mapu"        // #1
wüño_w = "a,b,c,d"$/ ','    // [a, b, c, d]  (wirin mew)
fangelum = s$~~["a":"A"]     // "MAri MAri MApu"
fangelum1 = s$~~["a":"A":1]  // "MAri mari Mapu"  (kiñe muten)
rüpü = "─" $* 20            // "────────────────────"  (fentren N)
```

> `+` akuñma muten. Kümekawün `,`, fampüchi, o fangelum wirin mew.

---

## Rüpü Kimün

```zymbol
x = 7

? x > 0 { >> "küme" ¶ }

? x > 100 {
    >> "fentren" ¶
} _? x > 0 {
    >> "küme" ¶
} _? x == 0 {
    >> "kero" ¶
} _ {
    >> "weza" ¶
}
```

> `{ }` **kümeal** kiñe zugumeal mew ka.

---

## Kimüntukun

```zymbol
// Akuñma Rüpü
pünon = 85
rüf = ?? pünon {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> rüf ¶    // → B

// Wirinkawün
rangi = "kelü"
zugu = ?? rangi {
    "kelü"  => "#FF0000"
    "karü"  => "#00FF00"
    _       => "#000000"
}

// Kimüntun Pewümn
kalül = -5
zugu_k = ?? kalül {
    < 0  => "apall"
    < 20 => "külen"
    < 35 => "rüme"
    _    => "kalül"
}
>> zugu_k ¶    // → apall

// Zugumeal fampüchi (kiñeke küzawün)
n = -3
?? n {
    0    => { >> "kero" ¶ }
    < 0  => { >> "weza" ¶ }
    _    => { >> "küme" ¶ }
}
```

---

## Wüño Küzawün

```zymbol
@ i:0..4  { >> i " " }        // akuñma fampüchi:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // paso mew:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // wüño:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (rüpün)

kintuñma = ["manzana", "pera", "uva"]
@ f:kintuñma { >> f ¶ }       // @ kiñeke mew

@ c:"mari" { >> c "-" }
>> ¶                          // → m-a-r-i-  (@ wirin mew)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> rüpün
    ? i > 7 { @! }             // @! wüño
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Kom rüpün
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Zugumeal rüpün (kiñeke wüño)
akuñma = 0
@:wünen {
    akuñma++
    ? akuñma >= 3 { @:wünen! }
}
>> akuñma ¶                   // → 3
```

---

## Küzaw

```zymbol
füren(a, b) { <~ a + b }
>> füren(3, 4) ¶    // → 7

wülaley(n) {
    ? n <= 1 { <~ 1 }
    <~ n * wülaley(n - 1)
}
>> wülaley(5) ¶    // → 120
```

Küzaw **küpa rüpü** — wüño zugu wünen kimüntun. Kümekawün `<~` küpa zugu:

```zymbol
kelün(a<~, b<~) {
    küzawün = a
    a = b
    b = küzawün
}
x = 10
y = 20
kelün(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Küzaw tur **wünen zugu** — küpa rüpün: `akuñma$> epun`. Fürüm: `x -> fn(x)` ka melo.

---

## Lambda ka Fürüm Zugu

```zymbol
epun = x -> x * 2
witrun = (a, b) -> a + b
>> epun(5) ¶    // → 10
>> witrun(3, 7) ¶    // → 10

// Kiñeke lambda
rakizuamün = x -> {
    ? x > 0 { <~ "küme" }
    _? x < 0 { <~ "weza" }
    <~ "kero"
}

// Fürüm zugu — küpan rüpü mew
fantechi = 3
külatun = x -> x * fantechi
>> külatun(7) ¶    // → 21

// Femün
füren_femün(n) { <~ x -> x + n }
füren_mari = füren_femün(10)
>> füren_mari(5) ¶    // → 15

// Kiñeke mew
kümekaw = [x -> x+1, x -> x*2, x -> x*x]
>> kümekaw[3](5) ¶    // → 25
```

---

## Kiñeke Zugu

Kiñeke **rüme** ka melo zugu **melo kimün** mew.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — kimüntun (1-zugumeal: wünen)
x = arr[-1]     // 5 — weza akuñma (kellechi)
x = arr$#       // 5 — fentren (kümekawün (arr$#) >> mew)

arr = arr$+ 6            // füren → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // fampüchi 2 mew (1-zugumeal)
arr3 = arr$- 3           // küpa wünen zugu
arr4 = arr$-- 3          // küpa kom zugu
arr5 = arr$-[1]          // küpa 1 mew (wünen)
arr6 = arr$-[2..3]       // küpa akuñma rüpü (1-zugumeal, kellechi fampüchi)

mongechi = arr$? 3       // #1 — mongechi
mapu_k = arr$?? 3        // [3] — kom akuñma (1-zugumeal)
wüño_s = arr$[1..3]      // [1,2,3] — wüño (1-zugumeal, kellechi fampüchi)
wüño_s2 = arr$[1:3]      // [1,2,3] — melo, wüño rüpü

kimün_k = arr$^+         // kimüntun küme (wünen muten)
weza_k = arr$^-          // kimüntun weza (wünen muten)

// Kiñeke fampüchi — kümekawün $^ lambda mew
kiñeke = [(küpal: "Carla", tripantu: 28), (küpal: "Ana", tripantu: 25), (küpal: "Bob", tripantu: 30)]
tripantu_mew  = kiñeke$^ (a, b -> a.tripantu < b.tripantu)    // küme tripantu (<)
küpal_mew = kiñeke$^ (a, b -> a.küpal > b.küpal)             // weza küpal (>)
>> tripantu_mew[1].küpal ¶     // → Ana
>> küpal_mew[1].küpal ¶        // → Carla

// Küpa zugu (kiñeke muten)
arr[1] = 99              // zugumeal
arr[2] += 5              // fampüchi: +=  -=  *=  /=  %=  ^=

// Küzaw zugumeal — küpalen kiñeke; wüño akuñma
arr2 = arr[2]$~ 99
```

> Kom kiñeke zugumeal küpalen **kiñeke wüño**. Zugumeal küpa: `arr = arr$+ 4`.
> `$+` fampüchi: `arr = arr$+ 5$+ 6$+ 7`. Kake zugumeal rüpün mew.
> **Akuñma 1-zugumeal**: `arr[1]` wünen; `arr[0]` küzaw weza.
> `$^+` / `$^-` **wünen kiñeke** (akuñma, wirin). Fampüchi kiñeke `$^` lambda mew — rüpü lambda mew (`<` = küme, `>` = weza).

**Zugu kimün** — kiñeke zugumeal wüño küpa rüpü:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b wüño
```

```zymbol
// Kiñeke mülelu (1-zugumeal)
mapu = [[1,2,3],[4,5,6],[7,8,9]]
>> mapu[2][3] ¶    // → 6  (rüpü 2, mülelu 3)
```

---

## Fangelum

```zymbol
// Kiñeke
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[wünen, *kom_ka] = arr       // wünen=10  kom_ka=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ küpa

// Fampüchi
mapu_p = (100, 200)
(px, py) = mapu_p            // px=100  py=200

// Küpal Fampüchi
che = (küpal: "Ana", tripantu: 25, mapu: "Temuko")
(küpal: n, tripantu: a) = che   // n="Ana"  a=25
```

---

## Fampüchi Zugu

Fampüchi **kiñe** zugumeal küpa fentren kimün **fentren küzaw** mew.
Kiñeke wüño, zugu wüño küzaw kellechi wüño mew.

```zymbol
// Fampüchi — fentren küzaw fampüchi
mapu_p = (10, 20)
>> mapu_p[1] ¶    // → 10

zugu = (42, "mari mari", #1, 3.14)
>> zugu[3] ¶     // → #1

// Küpal
che = (küpal: "Mailen", tripantu: 25)
>> che.küpal ¶    // → Mailen
>> che[1] ¶      // → Mailen  (akuñma fampüchi, 1-zugumeal)

// Kiñeke mülelu
mapu_pos = (x: 10, y: 20)
p = (mapu: mapu_pos, küpal: "wünen")
>> p.mapu.x ¶        // → 10
```

**Kiñe Zugu** — küzaw wüño fampüchi zugu küzaw weza mew:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ küzaw weza: fampüchi kiñe zugu
// t[1] += 5    // ❌ melo weza
```

Küpa zugu rüme kümekawün `$~` (küzaw zugumeal) — küpalen **fampüchi wüño**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← wüño akuñma
>> t2 ¶    // → (10, 999, 30)

// Küpal fampüchi — küpalün fentren
che = (küpal: "Mailen", tripantu: 25)
tripantu_ka  = (küpal: che.küpal, tripantu: 26)
>> che.tripantu ¶    // → 25
>> tripantu_ka.tripantu ¶     // → 26
```

---

## Küzaw Fentren

```zymbol
akuñma = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

epun_k   = akuñma$> (x -> x * 2)              // map  → [2,4,6…20]
wüño_w   = akuñma$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
fentren  = akuñma$< (0, (acc, x) -> acc + x)   // reduce → 55

// Fampüchi mew
paso1 = akuñma$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Küzaw mew küpa rüpü
epun(x) { <~ x * 2 }
fentrenley(x) { <~ x > 5 }
r = akuñma$> epun       // ✅ rüpün fampüchi
r = akuñma$| fentrenley // ✅ rüpün fampüchi
```

---

## Rüpü Zugumeal

Küpa mew kümeal `_` rüpü zugu mew:

```zymbol
epun = x -> x * 2
füren = (a, b) -> a + b
kepan = x -> x + 1

r1 = 5 |> epun(_)        // → 10
r2 = 10 |> füren(_, 5)   // → 15
r3 = 5 |> füren(2, _)    // → 7

// Fampüchi
r = 5 |> epun(_) |> kepan(_) |> epun(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Weza Küzawün

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "küzaw kero mew" ¶
} :! {
    >> "kake: " _err ¶    // _err weza zugu mew
} :> {
    >> "kom rüpüle" ¶
}
```

| Kimün | Ngeam mew |
|-------|-----------|
| `##Div` | Küzaw kero mew |
| `##IO` | Wirin / sistema |
| `##Index` | Akuñma rüpü weza |
| `##Type` | Kimün weza |
| `##Parse` | Wirin kimüntun |
| `##Network` | Red weza |
| `##_` | Kom weza (kiñeke) |

---

## Kimüntukun Kiñeke

```zymbol
// lib/calc.zy — módulo kiñeke { } mew
# calc {
    #> { füren, küpa_PI }

    _PI := 3.14159
    füren(a, b) { <~ a + b }
    küpa_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // küpal kümeal

>> c::füren(5, 3) ¶   // → 8
pi = c::küpa_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Küpa wirin kiñeke küpal mew
# miküzaw {
    #> { _füren_kimün => witrun }

    _füren_kimün(a, b) { <~ a + b }
}
```

```zymbol
<# ./miküzaw => m

>> m::witrun(3, 4) ¶    // → 7  (küpal _füren_kimün pürüm)
```

> **Kimüntukun kiñeke**: muten `#>`, küzaw kimüntun, ka wirin zugu fachantü `# küpal { }` mew. Zugumeal küzaw (`>>`, `<<`, wüño, etc.) weza E013.

---

## Akuñma Rüpü

Zymbol akuñma zugegeal **69 Unicode akuñma rüpü** — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemática Negrita, LCD zugumeal, ka fentren. Rüpü kimün `>>` zugegeal muten; akuñma kiñeke binary mew.

### Rüpü Kümelen

Wirin `0` ka `9` rüpü kimün `#…#` mew:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ASCII mew wüño
```

### Zugegeal ka Pewümn

```zymbol
x = 42
>> x ¶          // → 42   (ASCII fachantü)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto ASCII muten)
>> 1 + 2 ¶      // → ३

// Pewümn: # ASCII muten, akuñma küzaw mew
>> #1 ¶         // → #१   (mongen Devanagari mew)
>> #0 ¶         // → #०   (weza — wüño ० akuñma mew)

x = 28 > 4
>> x ¶          // → #१   (kimüntun küzaw rüpü mew)
```

### Akuñma Wirin Rüpü

Fentren rüpü akuñma wirin rüpü küme — rüpü, modulo, kimüntun mew:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Pewümn Wirin Rüpü

`#` + akuñma `0` o `1` kom rüpü mew pewümn wirin küme:

```zymbol
#٠٩#
mongen = #١        // melo #1
>> mongen ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII muten**. `#0` (weza) wüño `0` (akuñma kero) kom rüpü mew.

---

## Zugu Zugumeal

```zymbol
// Kimün küzaw
f = ##.42         // → 42.0  (Float mew)
i = ###3.7        // → 4     (Int mew, wüñon)
t = ##!3.7        // → 3     (Int mew, nüküm)

// Wirin mew akuñma
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (rüme, weza küzaw kümeal)

// Wüñon / Nüküm
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (wüñon 2 mew)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (nüküm)

// Akuñma fampüchi
fmt = #,|1234567|  // → 1,234,567  (komaw mew)
sci = #^|12345.678|    // → 1.2345678e4  (kimüntun)

// Wirin akuñma
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Wirin akuñma küpa
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Küpümün

```zymbol
antü = <\ date +%Y-%m-%d \>     // küpa rüpü (fampüchi \n mew)
>> "Fachantü: " antü

wirin = "zugu.txt"
zugulechi = <\ cat {wirin} \>      // fangelum zugu mew

rüpün = </"./miküzaw.zy"/>   // Zymbol küzaw, küpa rüpü
>> rüpün
```

> `><` CLI zugu küpalen wirin kiñeke mew (tree-walker muten).

---

## Kimün Mülechi: FizzBuzz

```zymbol
rakizuamün(akun) {
    ? akun % 15 == 0 { <~ "FizzBuzz" }
    _? akun % 3  == 0 { <~ "Fizz" }
    _? akun % 5  == 0 { <~ "Buzz" }
    _ { <~ akun }
}

@ i:1..20 { >> rakizuamün(i) ¶ }
```

---

## Zugumeal Pewümn

| Zugumeal | Küzawün | Zugumeal | Küzawün |
|----------|---------|----------|---------|
| `=` | zugu | `$#` | fentren |
| `:=` | küme zugu | `$+` | füren (fampüchi) |
| `>>` | zugegeal | `$+[i]` | fampüchi mew (1-zugumeal) |
| `<<` | zuguleam | `$-` | küpa wünen |
| `¶` / `\\` | rüpü küpal | `$--` | küpa kom |
| `?` | pewümn | `$-[i]` | küpa akuñma mew |
| `_?` | wüño pewümn | `$-[i..j]` | küpa rüpü |
| `_` | kake zugu | `$?` | mongechi |
| `??` | kimüntukun | `$??` | akuñma rüpü |
| `@` | wüño | `$[s..e]` | wüño zugu |
| `@ N { }` | N wüño (N küzaw) | `$>` | kimüntun küzaw |
| `@!` | wüño weza | `$\|` | fangelum |
| `@>` | rüpün | `$<` | wüño zugu |
| `@:name { }` | küpal wüño | `$/ delim` | wirin fangelum |
| `@:name!` | küpal wüño weza | `$++ a b c` | fampüchi kimüntun |
| `@:name>` | küpal wüño rüpün | `arr[i>j>k]` | rüpün akuñma |
| `->` | lambda | `arr[i] = val` | zugu küzaw |
| `arr[i] += val` | fampüchi küzaw | `arr[i]$~` | küzaw zugumeal (wüño) |
| `$^+` | kimüntun küme | `$^-` | kimüntun weza |
| `$^` | kimüntun lambda mew | `<~` | küpa |
| `\|>` | rüpü zugu | `!?` | weza rüpün |
| `:!` | küpa weza | `:>` | kom rüpüle |
| `#1` | mongen | `#0` | weza |
| `$!` | weza kimün | `$!!` | weza rüpün |
| `<#` | küpa wirin | `#>` | küpa zugumeal |
| `#` | módulo | `::` | módulo rüpün |
| `.` | zugumeal küpa | `#?` | kimün zugu |
| `#\|..\|` | wirin akuñma | `##.` | Float mew |
| `###` | Int mew wüñon | `##!` | Int mew nüküm |
| `#.N\|..\|` | wüñon N | `#!N\|..\|` | nüküm N |
| `#,\|..\|` | komaw fampüchi | `#^\|..\|` | kimüntun |
| `#d0d9#` | akuñma rüpü küzaw | `#09#` | ASCII wüño |
| `<\ ..\>` | shell küzaw | `>\<` | CLI zugu |
| `\ var` | zugu küpa | `°x` / `x°` | fachantü zugu |
| `>>|` | TUI kiñeke | `>>~` | rüpü zugegeal |
| `>>!` | mapu zugeleam | `>>?` | terminal akuñma |
| `<<\|` | zugumeal zugu | `<<\|?` | wüño zugumeal |
| `@~ N` | rüpün N ms | `$*` | wirin fentren N |

---

## Zugumeal Kimün

### v0.0.5 — TUI Kümekawün, Zugu Fachantü & Wirin Fentren _(Küyen 2026)_

- **Rüme Weza** Kimüntukun rüpü: `pattern : result` → `pattern => result`
- **Rüme Weza** Küpa wirin: `<# rüpü <= küpal` → `<# rüpü => küpal`
- **Rüme Weza** Küpa zugumeal: `#> { fn <= pub }` → `#> { fn => pub }`
- **Fampüchi** TUI `>>| { }` — pantalla wüño + modo crudo; kellechi fürüm amun mew
- **Fampüchi** Rüpü zugegeal `>>~ (rüpü, mülelu, BKS, fg, bg) > zugu` — küpa wüño, ANSI 256
- **Fampüchi** Zugumeal `<<| zugu` (rüpüle) ka `<<|? zugu` (wüño zugumeal)
- **Fampüchi** `>>!` mapu zugeleam, `>>?` terminal akuñma, `@~ N` rüpün N ms
- **Fampüchi** Zugu fachantü `°x` / `x°` — fachantü zugu wüño wüño küzaw mew
- **Fampüchi** Wirin fentren `str $* N` — wirin N fampüchi
- **VM** Melo: 436/436 kimüntun küme

### v0.0.4 — 1-Zugumeal, Küzaw Wünen & Kimüntukun Kiñeke _(Abril 2026)_

- **Rüme Weza** Kom akuñma **1-zugumeal** — `arr[1]` wünen; `arr[0]` küzaw weza
- **Fampüchi** Küzaw tur **wünen zugu** — küpa rüpün HOF: `akuñma$> epun`
- **Fampüchi** Kimüntukun **kiñeke rüpü** kümeal: `# küpal { ... }` — wüño rüpü küpa
- **Fampüchi** Fentren akuñma: `arr[i>j>k]` (rüpün), `arr[p ; q]` (küpa)
- **Fampüchi** Kimün küzaw: `##.expr` (Float), `###expr` (Int wüñon), `##!expr` (Int nüküm)
- **Fampüchi** Wirin fangelum: `str$/ delim` — küpalen `Array(String)`
- **Fampüchi** Fampüchi kimüntun: `base$++ a b c` — fentren zugu füren
- **Fampüchi** N wüño: `@ N { }` — N küzaw melo
- **Fampüchi** Küpal wüño: `@:küpal { }`, `@:küpal!`, `@:küpal>` — rüpün `@ @küpal` / `@! küpal`
- **Fampüchi** Zugu rüpü: `_küpal` fampüchi küzaw mew; `\ zugu` wüño kellechi
- **Fampüchi** Kimüntukun pewümn: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Fampüchi** Kimüntukun E013 weza: küzaw zugumeal kimüntukun kiñeke mew weza
- **Küme** `take_variable` wüño kimüntukun küme zugu wüño
- **Küme** `alias.CONST` küme rüpüle; `#>` küzaw küzaw mew küpa
- **VM** Melo: 393/393 kimüntun küme

### v0.0.3 — Unicode Akuñma Rüpü & LSP Küme _(Abril 2026)_

- **Fampüchi** 69 Unicode akuñma rüpü `#d0d9#` mew
- **Fampüchi** Pewümn wirin kom rüpü — `#१` / `#०`, `#١` / `#٠`, etc.
- **Fampüchi** Klingon pIqaD akuñma (CSUR PUA U+F8F0–U+F8F9)
- **Fampüchi** `SetNumeralMode` VM opcode — melo tree-walker mew
- **Fampüchi** REPL rüpü akuñma zugegeal ka zugu mew
- **Wüño** Pewümn `>>` fampüchi `#` (` #0` / `#1`) kom rüpü mew

### v0.0.2_01 — Zugumeal Küpal _(Marzo 2026)_

- **Wüño** `c|..|` → `#,|..|` ka `e|..|` → `#^|..|` — melo `#` fampüchi
- **Fampüchi** Küpa küpal: kimüntukun kiñeke küpal wüño mew küpa

### v0.0.2 — Kiñeke API Wüño & Instaladores _(Marzo 2026)_

- **Fampüchi** `$` zugumeal kiñeke ka wirin mew (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Fampüchi** Fangelum kiñeke, fampüchi, ka küpal fampüchi mew
- **Fampüchi** Weza akuñma (`arr[-1]` = kellechi)
- **Fampüchi** Instaladores — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(Marzo 2026)_

- **Fampüchi** Fampüchi zugumeal `^=`
- **Küme** Parser akuñma küzaw; kimüntun küme

### v0.0.1 — Wünen Küpa _(Marzo 2026)_

- Tree-walker küzaw + register VM (`--vm`, ~4× küme, ~95% melo)
- Kom küzaw: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Kom Unicode küpal, kimüntukun kiñeke, lambda, fürüm zugu, weza küzawün
- REPL, LSP, VS Code, fampüchi (`zymbol fmt`)

---

_Zymbol-Lang — Zugumealchi. Kom Mapuche Mew. Kiñe Küme._
