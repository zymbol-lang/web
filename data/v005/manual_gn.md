> **Mombe'úva:** Ko tembiapo IA (inteligencia artificial) ojapojeýva.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Mba'e ñe'ẽndy **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** intérprete rekápe oĩva.

---

# Zymbol-Lang Manual

> **Ñembohekepyrã v0.0.5 — 2026-05-12**

**Zymbol-Lang** peteĩ ñe'ẽ señal rupi. Ndaipori ñe'ẽtee — opavave señalawa. Opavave ava ñe'ẽpe oikouka.

- Ndaipori `if`, `while`, `return` — oĩ `?`, `@`, `<~` añoite
- Unicode opavave — suti opavave ava ñe'ẽpe
- Ava ñe'ẽ ndoikotevẽi — lurawi ko'ãgaite peteĩhawa

**Versión lurawi**: v0.0.5 | **Jehecha**: 436/436 (TW ↔ VM ukhamawa)

---

## Mbovi ha Constante

```zymbol
x = 10              // mbovi oñembojoja
PI := 3.14159       // constante — oñembojoja error runtime
téra = "Sonia"
tepy = #1           // cheqarã ete
👋 := "Maitei"
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

`°` (U+00B0) oñepyrũrõ mbovi ko'ãgaite nayriri ojeporu hag̃ua:

```zymbol
numero = [3, 1, 4, 1, 5]
@ n:numero {
    °ape += n    // 0-gui oñepyrũ; @ tukuyata rire ojejoko
}
>> ape ¶         // → 14
```

> `°x` (ñepyrũrã) ojejoko muyuña hatãrõ — ojejoko @ tukuyata rire.
> `x°` (paha) oĩva muyuña ukape — otukuva @ tukuyata rire.
> Tree-walker añoite.

---

## Mba'epykuaa

| Mba'epykuaa | Qillqa | `#?` | Mombe'u |
|-------------|--------|------|---------|
| Int | `42`, `-7` | `###` | 64-bit firmado |
| Float | `3.14`, `1.5e10` | `##.` | Yatiña OK |
| Ñe'ẽndy | `"arandu"` | `##"` | Mantaña: `"Maitei {téra}"` |
| Mä Pyta | `'A'` | `##'` | Peteĩ Unicode |
| Cheqarã | `#1`, `#0` | `##?` | Ndaijakhúi — `#1 ≠ 1` |
| Ñombyry | `[1, 2, 3]` | `##]` | Peteĩ mba'epykuaa |
| Mboyvegua | `(a, b)` | `##)` | Katu rupi |
| Ñe'ẽndy Mboyvegua | `(x: 1, y: 2)` | `##)` | Ñe'ẽndy renda |
| Mba'apoha | suti ref | `##()` | Nayriri; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Nayriri; `<lambd/N>` |

```zymbol
// Mba'epykuaa ohecha — omoingo (tipo, papapy, amtawi)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Hesarã ha Moiñoha

```zymbol
>> "Maitei" ¶                     // ¶ térã \\ ñombyry jepyso rehe
>> "a=" a " b=" b ¶               // jepehẽ — hetave mba'e
>> (jeha$#) ¶                     // señal postfijo oikotevẽ ( ) >> rehe

<< téra                           // moiñoha mbovipe (ndaipori yatichiña)
<< "Emombe'u tera: " téra         // yatichiña ndive
```

> `¶` (AltGr+R español tecladope) ha `\\` peteĩhawa ñombyry jepyso rehe.

---

## TUI Primitivas

Terminal UI señalanak lurawi amparaha. `>>| { }` oikotevẽ (pantalla ypykue + modo crudo).

```zymbol
>>| {
    >>!                             // pantalla ojapo chugui
    >>~ (1, 1, 0, 10) > "Osemba"   // ña 1, columna 1, fg=10 (hovy)
    @~ 1000                         // ose 1 aravo (1000 ms)
    >>~ (2, 1) > "Ojehu."
}
// terminal oñemoingo peve jeike
```

```zymbol
// Señal ha terminal ñemomba'e
>>| {
    [ña, columna] = >>?              // terminal ñemomba'e oporandu
    >>~ (1, 1) > "Terminal: " ña " x " columna
    <<| señal                        // señal otoma (ojejoko)
    >>~ (2, 1) > "Opopresó: " señal
}
```

> `>>!` pantalla ojapo chugui. `>>?` kutt'ayaña `[ña, columna]`. `@~ N` ose N ms.
> `<<|` peteĩ señal (ojejoko); `<<|?` ndojejokói (kutt'ayaña `'\0'` ndaipori hag̃ua).
> Apsuña tupla: `(ña, columna, BKS, fg, bg)` — slot coma ukape (`>>~ (,,, 196) > "pyta"`).
> BKS: `1`=Tupichagua, `2`=Italiko, `4`=Ymombeguicha. ANSI 256 sa (`0`=terminal nayriri).
> Tree-walker añoite (añoite `>>!`, `>>?`, `@~`, `>>~` `--vm` ukana oikouka).

---

## Señalanak

```zymbol
// Jakhu Señalanak
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (jakhu chiqatawi)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (tupã)

// Jepykuaa — moingo amtawi
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Cheqarã Señalanak
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Ñe'ẽndy

```zymbol
// Mokoi ñombyry yatiña
téra = "Sonia"
n = 42

>> "Maitei " téra " ererekopa " n ¶    // jepehẽ — >> ukape
desc = "Maitei {téra}, ererekopa {n}"  // mantaña — ko'agaite
```

```zymbol
s = "Maitei Yvytu"
jaku = s$#                  // 12
wali_s = s$[1..6]           // "Maitei"  (1-sata, paha ombyky)
oiva = s$? "Yvytu"          // #1
jeskana = "a,b,c,d"$/ ','   // [a, b, c, d]  (ñembyky)
jayrant = s$~~["e":"E"]     // "MaitEi Yvytu"
jayrant1 = s$~~["e":"E":1]  // "MaitEi Yvytu"  (peteĩha añoite)
sara = "─" $* 20            // "────────────────────"  (N jey)
```

> `+` jakhu añoite. Emojeaha `,`, jepehẽ, térã mantaña ñe'ẽndy ukape.

---

## Jeguata

```zymbol
x = 7

? x > 0 { >> "positivo" ¶ }

? x > 100 {
    >> "tuicha" ¶
} _? x > 0 {
    >> "positivo" ¶
} _? x == 0 {
    >> "apopy" ¶
} _ {
    >> "negativo" ¶
}
```

> `{ }` **oikotevẽ** ani mba'apo peteĩva rehe avave.

---

## Jehechakuaa

```zymbol
// Ñembyky Jakhu
papapy = 85
tepy = ?? papapy {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> tepy ¶    // → B

// Ñe'ẽndy
color = "pyta"
codigo = ?? color {
    "pyta"  => "#FF0000"
    "hovy"  => "#00FF00"
    _       => "#000000"
}

// Jehechakuaa Yatiña
temperatura = -5
teko = ?? temperatura {
    < 0  => "rorory"
    < 20 => "ro"
    < 35 => "hakumichi"
    _    => "haku"
}
>> teko ¶    // → rorory

// Lurawi Yatiña (bloque lurawi)
n = -3
?? n {
    0    => { >> "apopy" ¶ }
    < 0  => { >> "negativo" ¶ }
    _    => { >> "positivo" ¶ }
}
```

---

## Jojupy

```zymbol
@ i:0..4  { >> i " " }        // jakhu sara:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // mboja ndive:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // jepykua:      5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (jepykuaa)

fruta = ["mburukuja", "pakuri", "aguai"]
@ f:fruta { >> f ¶ }          // @ ñombyry ukana

@ c:"maitei" { >> c "-" }
>> ¶                          // → m-a-i-t-e-i-  (@ ñe'ẽndy ukana)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> osalva
    ? i > 7 { @! }             // @! otukuva
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Jojupy ndotukuvava
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Jojupy ñe'ẽndy (patankiri tukuyaña)
contador = 0
@:jave {
    contador++
    ? contador >= 3 { @:jave! }
}
>> contador ¶                 // → 3
```

---

## Mba'apoha

```zymbol
joayu(a, b) { <~ a + b }
>> joayu(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Mba'apoha **sara jark'ata** — ndohechái tuichakuéri jark'atawi. Emojeaha `<~` kuñambuéva mbovi oñembojoja hag̃ua:

```zymbol
jeheke(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
jeheke(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Mba'apoha ñe'ẽndy **nayriri amtawi** — mä sara: `numero$> mokopy`. Mantaña: `x -> fn(x)` ukhamaki.

---

## Lambda ha Jark'aña

```zymbol
mokopy = x -> x * 2
joayu = (a, b) -> a + b
>> mokopy(5) ¶    // → 10
>> joayu(3, 7) ¶    // → 10

// Bloque lambda
jeporura = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "apopy"
}

// Jark'aña — uka sara ukana
factor = 3
hetapy = x -> x * factor
>> hetapy(7) ¶    // → 21

// Mba'apoha ombojoja
joayuka(n) { <~ x -> x + n }
joayupa = joayuka(10)
>> joayupa(5) ¶    // → 15

// Ñombyry ukape
tembiapo = [x -> x+1, x -> x*2, x -> x*x]
>> tembiapo[3](5) ¶    // → 25
```

---

## Ñombyry

Ñombyry **oñembojoja** ha amtawi **peteĩ mba'epykuaa** orekóva.

```zymbol
jeha = [1, 2, 3, 4, 5]

x = jeha[1]      // 1 — luraña (1-sata: nayriri)
x = jeha[-1]     // 5 — índice negativo (paha)
x = jeha$#       // 5 — ñemomba'e (jeporua (jeha$#) >> rehe)

jeha = jeha$+ 6            // emoingo → [1,2,3,4,5,6]
jeha2 = jeha$+[2] 99       // emoingo posición 2 (1-sata)
jeha3 = jeha$- 3           // embogue peteĩha valor
jeha4 = jeha$-- 3          // embogue opavave
jeha5 = jeha$-[1]          // embogue índice 1 (nayriri)
jeha6 = jeha$-[2..3]       // embogue ñembyky (1-sata, paha ombyky)

has = jeha$? 3             // #1 — oiva
pos = jeha$?? 3            // [3] — opavave índice (1-sata)
sl = jeha$[1..3]           // [1,2,3] — wali (1-sata, paha ombyky)
sl2 = jeha$[1:3]           // [1,2,3] — ko'ava, jakhu rupi

asc = jeha$^+              // ñembojoja yguy (jakhu añoite)
desc = jeha$^-             // ñembojoja yvate (jakhu añoite)

// Sutichiña ñombyry — jeha$^ lambda ndive
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
porype = db$^ (a, b -> a.age < b.age)    // yguy ary (<)
porytéra = db$^ (a, b -> a.name > b.name)  // yvate téra (>)
>> porype[1].name ¶     // → Ana
>> porytéra[1].name ¶   // → Carla

// Jakhu oñembohase (jeha añoite)
jeha[1] = 99              // emoingo
jeha[2] += 5              // jojupy: +=  -=  *=  /=  %=  ^=

// Lurawi emoingo — omoingo jeha pyahurã; nayriri ndojajukuéi
jeha2 = jeha[2]$~ 99
```

> Opavave ñombyry señalanak omoingo **ñombyry juk'a**. Oñembojoja: `jeha = jeha$+ 4`.
> `$+` ombotantaa: `jeha = jeha$+ 5$+ 6$+ 7`. Ambuéva señalanak amtawi ukape.
> **Jakhu 1-sata**: `jeha[1]` nayriri; `jeha[0]` pantiriwa rúnante.
> `$^+` / `$^-` **nayriri ñombyry** (jakhu, ñe'ẽndy). Tupla ñombyry `$^` lambda ndive — lambda sara (`<` = yguy, `>` = yvate).

**Amtawi mba'epykuaa** — ñombyry oñembojoja juk'a amtawi omoingo:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ndojajukuéi
```

```zymbol
// Ñombyry ñombyry ukana (1-sata)
patana = [[1,2,3],[4,5,6],[7,8,9]]
>> patana[2][3] ¶    // → 6  (ña 2, columna 3)
```

---

## Ñembykyha

```zymbol
// Ñombyry
jeha = [10, 20, 30, 40, 50]
[a, b, c] = jeha              // a=10  b=20  c=30
[nayriri, *resto] = jeha      // nayriri=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]         // _ ombyky

// Mboyvegua Katu Rupi
punto = (100, 200)
(px, py) = punto              // px=100  py=200

// Ñe'ẽndy Mboyvegua
ava = (name: "Ana", age: 25, city: "Asuncion")
(name: n, age: a) = ava    // n="Ana"  a=25
```

---

## Mboyvegua

Mboyvegua **ndojajukuéi** ha amtawi **taqi mba'epykuaa** orekóva.
Ñombyry rehe ani, amtawi ndohechakuaai ojehu'ã rire.

```zymbol
// Katu Rupi — taqi mba'epykuaa
punto = (10, 20)
>> punto[1] ¶    // → 10

teko = (42, "maitei", #1, 3.14)
>> teko[3] ¶     // → #1

// Ñe'ẽndy
ava = (name: "Sonia", age: 25)
>> ava.name ¶    // → Sonia
>> ava[1] ¶      // → Sonia  (jakhu ukhumaki, 1-sata)

// Jojupy
py = (x: 10, y: 20)
p = (pos: py, label: "ypykue")
>> p.pos.x ¶        // → 10
```

**Ndojajukuéiva** — amtawi oñembohase error runtime omoingo:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ error runtime: mboyvegua ndojajukuéi
// t[1] += 5    // ❌ ko'ã añoite
```

Emojeaha `$~` omombyjoja hag̃ua (lurawi kutt'ayaña) — **mboyvegua pyahurã** omoingo:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← nayriri ndojajukuéi
>> t2 ¶    // → (10, 999, 30)

// Ñe'ẽndy mboyvegua — omoheñoi
ava = (name: "Sonia", age: 25)
pyahurã  = (name: ava.name, age: 26)
>> ava.age ¶    // → 25
>> pyahurã.age ¶     // → 26
```

---

## Mba'apoha Tuichavéva

```zymbol
numero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

mokoha  = numero$> (x -> x * 2)              // map  → [2,4,6…20]
paha    = numero$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
ape     = numero$< (0, (acc, x) -> acc + x)  // reduce → 55

// Jojupy ñombyry
paso1 = numero$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Mba'apoha oñemboja HOF rehe
mokopy(x) { <~ x * 2 }
hetaha(x) { <~ x > 5 }
r = numero$> mokopy       // ✅ mä sara
r = numero$| hetaha       // ✅ mä sara
```

---

## Ñemboja Señal

Tukuya `_` oikotevẽ amtawi ndojajukuéiva hag̃ua:

```zymbol
mokopy = x -> x * 2
joayu = (a, b) -> a + b
incr = x -> x + 1

r1 = 5 |> mokopy(_)        // → 10
r2 = 10 |> joayu(_, 5)       // → 15
r3 = 5 |> joayu(2, _)        // → 7

// Ñombotantaa
r = 5 |> mokopy(_) |> incr(_) |> mokopy(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Pantiri Ñangareko

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "jojupy apopy" ¶
} :! {
    >> "ambueva: " _err ¶    // _err omono'o pantiri ñe'ẽ
} :> {
    >> "ojejapopa" ¶
}
```

| Mba'epykuaa | Areko |
|-------------|-------|
| `##Div` | Cero ukana jojupy |
| `##IO` | Qillqa / sistema |
| `##Index` | Índice pantiri |
| `##Type` | Mba'epykuaa pantiri |
| `##Parse` | Ñe'ẽndy yatiqaña |
| `##Network` | Red pantiri |
| `##_` | Opavave pantiri (taqini) |

---

## Modulo

```zymbol
// lib/calc.zy — módulo { } ukape
# calc {
    #> { joayu, getPI }

    _PI := 3.14159
    joayu(a, b) { <~ a + b }
    getPI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias oikotevẽ

>> c::joayu(5, 3) ¶   // → 8
pi = c::getPI()
>> pi ¶               // → 3.14159
```

```zymbol
// Apsuña ñe'ẽndy pyahurã ndive
# porurã {
    #> { _joayu_ikina => joayu }

    _joayu_ikina(a, b) { <~ a + b }
}
```

```zymbol
<# ./porurã => m

>> m::joayu(3, 4) ¶    // → 7  (_joayu_ikina opampachata)
```

> **Módulo mba'e oikotevẽva**: añoite `#>`, mba'apoha kimüntun, ha jark'atawi qillqa `# suti { }` ukape. Lurawi ejecutable (`>>`, `<<`, jojupy, etc.) omoingo E013 pantiri.

---

## Jakhu Yatiña

Zymbol ohechauka jakhu **69 Unicode jakhu qillqa** — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemática Negrita, LCD, ha ambuéva. Nayriri yatiña oĩ `>>` apsuña ukape añoite; jakhu binary mä.

### Ñepyrũha

Emohai `0` ha `9` jakhu `#…#` ukape:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ASCII-pe oñemboguata
```

### Hesarã ha Cheqarãkuéra

```zymbol
x = 42
>> x ¶          // → 42   (ASCII nayriri)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto ASCII añoite)
>> 1 + 2 ¶      // → ३

// Cheqarã: # ASCII añoite, jakhu lurawi ukana
>> #1 ¶         // → #१   (cheqarã Devanagari ukape)
>> #0 ¶         // → #०   (ani — jan ukhamaki ० jakhu cero)

x = 28 > 4
>> x ¶          // → #१   (jepykuaa lurawi nayriri ukana)
```

### Jakhu Qillqa Nayriri Luravape

Opavave jakhu qillqa válido — sara, modulo, uñakipaña ukape:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Cheqarã Qillqa Taqi Yatiña Ukape

`#` + jakhu `0` térã `1` taqi yatiña ukape cheqarã qillqa:

```zymbol
#٠٩#
tepy = #١        // ukhamawa #1
>> tepy ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII añoite**. `#0` (ani) ndojajukuáai `0` (jakhu cero) taqi yatiña ukape.

---

## Amtawi Señalanak

```zymbol
// Tipo kutt'ayaña
f = ##.42         // → 42.0  (Float-pe)
i = ###3.7        // → 4     (Int-pe, oñemboheta)
t = ##!3.7        // → 3     (Int-pe, oñembyky)

// Ñe'ẽndy jakhu-pe
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ndojayvy, ndaipori pantiri)

// Oñemboheta / Oñembyky
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (oñemboheta 2 ukana)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (oñembyky)

// Jakhu ñemboheke
fmt = #,|1234567|  // → 1,234,567  (coma ndive)
sci = #^|12345.678|    // → 1.2345678e4  (yatiña)

// Base qillqa
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Base apsuña
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Ñemboja

```zymbol
aravo = <\ date +%Y-%m-%d \>     // otoma stdout (\n ndive)
>> "Ko'agaite: " aravo

archivo = "tembiapo.txt"
contenido = <\ cat {archivo} \>      // mantaña qillqa ukape

output = </"./ojeporu.zy"/>   // Zymbol lurawi, otoma output
>> output
```

> `><` CLI ñe'ẽ ñombyry ukana omoingo (tree-walker añoite).

---

## Yatiqawi Kumpliru: FizzBuzz

```zymbol
jeporura(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> jeporura(i) ¶ }
```

---

## Señal Amtawi

| Señal | Lurawi | Señal | Lurawi |
|-------|--------|-------|--------|
| `=` | mbovi | `$#` | ñemomba'e |
| `:=` | constante | `$+` | emoingo (ñombotantaa) |
| `>>` | hesarã | `$+[i]` | emoingo índice (1-sata) |
| `<<` | moiñoha | `$-` | embogue nayriri |
| `¶` / `\\` | jepyso ñombyry | `$--` | embogue opavave |
| `?` | cheqarã | `$-[i]` | embogue índice (1-sata) |
| `_?` | ani ukhamako | `$-[i..j]` | embogue ñembyky |
| `_` | ambuéva | `$?` | oiva |
| `??` | jehechakuaa | `$??` | opavave índice |
| `@` | jojupy | `$[s..e]` | ñembykyha |
| `@ N { }` | N jojupy | `$>` | map |
| `@!` | otukuva | `$\|` | yatiña |
| `@>` | osalva | `$<` | tantawiña |
| `@:name { }` | ñe'ẽndy jojupy | `$/ delim` | ñe'ẽndy jaqukipaña |
| `@:name!` | tukuyaña suti | `$++ a b c` | ñombotantaa |
| `@:name>` | saraña suti | `arr[i>j>k]` | sara jakhu |
| `->` | lambda | `arr[i] = val` | jakhu kutt'ayaña |
| `arr[i] += val` | tantawiña kutt'ayaña | `arr[i]$~` | lurawi kutt'ayaña |
| `$^+` | ñembojoja yguy | `$^-` | ñembojoja yvate |
| `$^` | ñembojoja lambda | `<~` | kutt'ayaña |
| `\|>` | ñemboja señal | `!?` | pantiri ñangareko |
| `:!` | pantiri katana | `:>` | ojejapopa |
| `#1` | cheqarã | `#0` | ani |
| `$!` | pantiri kimün | `$!!` | pantiri sartaña |
| `<#` | moiñoha | `#>` | hesarã |
| `#` | modulo | `::` | modulo runa |
| `.` | renda | `#?` | mba'epykuaa amtawi |
| `#\|..\|` | ñe'ẽndy jakhu | `##.` | Float-pe |
| `###` | Int-pe oñemboheta | `##!` | Int-pe oñembyky |
| `#.N\|..\|` | oñemboheta N | `#!N\|..\|` | oñembyky N |
| `#,\|..\|` | coma yatiyaña | `#^\|..\|` | yatiña |
| `#d0d9#` | jakhu yatiña | `#09#` | ASCII oñemboguata |
| `<\ ..\>` | shell lurawi | `>\<` | CLI ñe'ẽ |
| `\ var` | mbovi apsuña | `°x` / `x°` | nayriri mbovi |
| `>>|` | TUI katanka | `>>~` | sara hesarã |
| `>>!` | pantalla ojapo chugui | `>>?` | terminal ñemomba'e |
| `<<\|` | señal moiñoha | `<<\|?` | ndojejokóiva señal |
| `@~ N` | ose N ms | `$*` | ñe'ẽndy N jey |

---

## Ñemboheke Ojehu'ã

### v0.0.5 — TUI Primitivas, Mbovi Nayriri & Ñe'ẽndy Jojupy _(Mayu 2026)_

- **Jajuka** Jehechakuaa señal: `pattern : result` → `pattern => result`
- **Jajuka** Mantaña suti: `<# sara <= suti` → `<# sara => suti`
- **Jajuka** Hesarã suti: `#> { fn <= pub }` → `#> { fn => pub }`
- **Moingo** TUI `>>| { }` — pantalla ypykue + modo crudo; otukuva peve jeike
- **Moingo** Sara hesarã `>>~ (ña, columna, BKS, fg, bg) > amtawi` — slot, ANSI 256
- **Moingo** Señal `<<| mbovi` (ojejoko) ha `<<|? mbovi` (ndojejokóiva)
- **Moingo** `>>!` pantalla ojapo chugui, `>>?` terminal ñemomba'e, `@~ N` ose N ms
- **Moingo** Mbovi nayriri `°x` / `x°` — oñepyrũrõ mbovi jojupy ukape
- **Moingo** Ñe'ẽndy jojupy `str $* N` — ñe'ẽndy N jey
- **VM** Ukhamawa: 436/436 yatiqawi wali

### v0.0.4 — 1-Sata, Mba'apoha Nayriri & Modulo _(Abrilpe 2026)_

- **Jajuka** Opavave jakhu **1-sata** — `jeha[1]` nayriri; `jeha[0]` pantiriwa
- **Moingo** Mba'apoha ñe'ẽndy **nayriri amtawi** — mä sara HOF: `numero$> mokopy`
- **Moingo** Módulo **katanka yatiña** oikotevẽ: `# suti { ... }` — jan yatiña añoite
- **Moingo** Patankiri jakhu: `arr[i>j>k]` (sara), `arr[p ; q]` (apsuña)
- **Moingo** Tipo kutt'ayaña: `##.expr` (Float), `###expr` (Int oñemboheta), `##!expr` (Int oñembyky)
- **Moingo** Ñe'ẽndy ñembyky: `str$/ delim` — kutt'ayaña `Array(String)`
- **Moingo** Ñombotantaa: `base$++ a b c` — hetave amtawi junta
- **Moingo** N jojupy: `@ N { }` — N jey lura
- **Moingo** Ñe'ẽndy jojupy: `@:suti { }`, `@:suti!`, `@:suti>` — jan `@ @suti` / `@! suti`
- **Moingo** Mbovi sara: `_suti` bloque ukape; `\ mbovi` nayriri apsuña
- **Moingo** Jehechakuaa uñakipaña: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Moingo** Módulo E013 pantiri: lurawi ejecutable ukape pantiriwa
- **Areko** `take_variable` ndojajukuéi módulo amtawi
- **Areko** `alias.CONST` wali kutt'ayaña; `#>` mba'apoha tukuyata ukana
- **VM** Ukhamawa: 393/393 yatiqawi wali

### v0.0.3 — Unicode Jakhu Yatiña & LSP Areko _(Abrilpe 2026)_

- **Moingo** 69 Unicode jakhu qillqa `#d0d9#` ukape
- **Moingo** Cheqarã qillqa taqi yatiña — `#१` / `#०`, `#١` / `#٠`, etc.
- **Moingo** Klingon pIqaD jakhu (CSUR PUA U+F8F0–U+F8F9)
- **Moingo** `SetNumeralMode` VM opcode — ukhamawa tree-walker ukape
- **Moingo** REPL jakhu yatiña hesarã ha mbovi ukape
- **Jajuka** Cheqarã `>>` hesarã `#` ndive (`#0` / `#1`) taqi yatiña

### v0.0.2_01 — Señal Ñe'ẽ _(Marzepe 2026)_

- **Jajuka** `c|..|` → `#,|..|` ha `e|..|` → `#^|..|` — ukhamawa `#` amtawi
- **Moingo** Hesarã suti: módulo amtawi suti ukha hesarã

### v0.0.2 — Ñombyry API Jajuka & Instaladores _(Marzepe 2026)_

- **Moingo** `$` señal ñombyry ha ñe'ẽndy ukape (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Moingo** Ñembykyha ñombyry, mboyvegua, ha ñe'ẽndy mboyvegua ukape
- **Moingo** Jakhu negativo (`jeha[-1]` = paha)
- **Moingo** Instaladores — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(Marzepe 2026)_

- **Moingo** Tantawiña `^=`
- **Areko** Parser jakhu lurawi; yatiyaña kutt'ayaña

### v0.0.1 — Nayriri Hesarã _(Marzepe 2026)_

- Tree-walker lurawi + register VM (`--vm`, ~4× wali, ~95% ukhamawa)
- Opavave lurawi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Taqi Unicode suti, módulo, lambda, jark'aña, pantiri ñangareko
- REPL, LSP, VS Code, yatiyaña (`zymbol fmt`)

---

_Zymbol-Lang — Señalankiri. Opavave ndive. Ndojajukuéiva._
