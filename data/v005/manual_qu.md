> **Willakuy:** Kay qillqa rurasqa riqsichiyniyuq inteligencia artificial (IA) yanapayniyuqwan.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Qiqin referencia **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nisqam intérprete repositoriopin.

---

# Zymbol-Lang Qillqa

> **Tikraqchisqa v0.0.5 — 2026-05-12**

**Zymbol-Lang** qillqa programasiyun simim. Mana palabrakuna — llapan sananqa. Sapa runa simipi kikin rikch'aqtam llamkarin.

- Mana `if`, `while`, `return` — `?`, `@`, `<~` lla
- Tukuy Unicode — sapa simipi utaq emojipim identificadores
- Runa simi mana chanin — qillqa kikinmi llapanpi

**Intérprete versión**: v0.0.5 | **Prueba tapu**: 436/436 (TW ↔ VM kiqin)

---

## Variables & Constantes

```zymbol
x = 10              // tiksimuyu — tiksiyana atikuq
PI := 3.14159       // constante — tiksiychiy pantaymin
suti = "Qori"
llamkasqa = #1      // booleano chiqan
👋 := "Rimaykullayki"
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

`°` (grado señal, U+00B0) tiksimuyu neutralman auto-inicio ñawpaq llamkakuynimpi:

```zymbol
yupakuna = [3, 1, 4, 1, 5]
@ n:yupakuna {
    °llapan += n    // auto-inicio 0man patapi; kausanpim @ qhipapi
}
>> llapan ¶         // → 14
```

> `°x` (ñawpaq) hawapi wichaykun — llapan `@` qhipapi rikukun.
> `x°` (qhipa) ukupi wichaykun — muyuriy tukukuptinmi chinkan.
> Tree-walker lla.

---

## Datos Rikch'aqnin

| Rikch'aq | Literal | `#?` señal | Notas |
|----------|---------|------------|-------|
| Int | `42`, `-7` | `###` | 64-bit signo |
| Float | `3.14`, `1.5e10` | `##.` | Notación científica atikun |
| String | `"qillqa"` | `##"` | Interpolasiyun: `"Napay {suti}"` |
| Char | `'A'` | `##'` | Sug Unicode qillqa |
| Bool | `#1`, `#0` | `##?` | Mana yupaychu — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Kuskasqa elementos |
| Tuple | `(a, b)` | `##)` | Sitioyuq |
| Sutiyuq Tupla | `(x: 1, y: 2)` | `##)` | Sutirayuq ñan |
| Ruray | sutirayuq ruray ref | `##()` | Ñawpaq-rikch'aq; rikuchiy `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ñawpaq-rikch'aq; rikuchiy `<lambd/N>` |

```zymbol
// Rikch'aq qawachiy — kutichimun (rikch'aq, cifras, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Lluqsiy & Yaykuy

```zymbol
>> "Rimaykullayki" ¶               // ¶ utaq \\ qhipa simipaq
>> "a=" a " b=" b ¶               // kuskanchiy — achkha willakuq
>> (arr$#) ¶                      // qhipa operadores ( ) maskhan >>

<< suti                           // tiksimuyu hap'iy (mana tapuywan)
<< "Sutiykita qillqa: " suti      // tapuywan
```

> `¶` (AltGr+R teclado españolpi) ukhumantawan `\\` kiqin qhipa simim.

---

## TUI Primitivos

Terminal UI operadores interactivo programaspaq. Ashkhan `>>| { }` bloque maskhan (pantalla alternativa + modo crudo).

```zymbol
>>| {
    >>!                                       // pantalla alternativa pichay
    >>~ (1, 1, 0, 10) > "Puriykushanmi"       // uchuy 1, pillar 1, fg=10 (q'umir)
    @~ 1000                                   // 1 segundo suyay (1000 ms)
    >>~ (2, 1) > "Tukurqan."
}
// terminal paqarimun lluqsimanta
```

```zymbol
// Tecla hap'iy ukhumantawan terminal hatunniynin
>>| {
    [filakuna, kolunakuna] = >>?              // terminal hatunniynin tapuy
    >>~ (1, 1) > "Terminal: " filakuna " x " kolunakuna
    <<| tecla                                 // tecla hap'iy (suyaspa)
    >>~ (2, 1) > "Hapirqan: " tecla
}
```

> `>>!` pantalla picharin. `>>?` kutichimun `[filakuna, kolunakuna]`. `@~ N` N milisegundos puñuchin.
> `<<|` sug tecla hap'in (suyaspa); `<<|?` mana suyaspa tapukun (`'\0'` kutichimun mana kaptinqa).
> Sitiosqa lluqsiy tupla: `(uchuy, pillar, BKS, fg, bg)` — sapa sitio coma nisqawan hich'akuyta atikun (`>>~ (,,, 196) > "puka"`).
> BKS bitmask: `1`=Negrita, `2`=Cursiva, `4`=Subrayado. ANSI 256-color paleta (`0`=terminal chiqan).
> Tree-walker lla (mana `>>!`, `>>?`, `@~`, `>>~` nisqakuna — kay `--vm` nisqapipis llamkarin).

---

## Operadores

```zymbol
// Yupachiy
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (yupa chaninpi t'aqay)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potencia)

// Tupachiy — tiksimuyu churay rikuchiy
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lógica
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Qillqakuna

```zymbol
// Iskay kuskanchiy rikch'aq
suti = "Qori"
n = 42

>> "Napaykullayki " suti " qanqa " n " tiyanki" ¶    // kuskanchiy — >> ukupi
willakuy = "Napaykullayki {suti}, qanqa {n} tiyanki"  // interpolasiyun — maypipis
```

```zymbol
s = "Napay Pacha"
tukuy = s$#                    // 11
uhu = s$[1..5]                 // "Napay"  (1-ñiqiq, tukukuq yaykuq)
kan = s$? "Pacha"              // #1
partekuna = "a,b,c,d"$/ ','    // [a, b, c, d]  (t'aqay kaq runasimiwan)
kuti = s$~~["a":"A"]           // "NApAy PAchA"
kuti1 = s$~~["a":"A":1]        // "NApay Pacha"  (sug ñiqiq lla)
siq'a = "─" $* 20             // "────────────────────"  (N kutita kutichiymanta)
```

> `+` yupakuna lla. `,`, kuskanchiy, utaq interpolasiyun qillqakuanpaq.

---

## Puriynin Kamachiy

```zymbol
x = 7

? x > 0 { >> "positivo" ¶ }

? x > 100 {
    >> "hatun" ¶
} _? x > 0 {
    >> "positivo" ¶
} _? x == 0 {
    >> "cero" ¶
} _ {
    >> "negativo" ¶
}
```

> `{ }` llaqtakuna **maskhasqa** sug willakuywan ima.

---

## Tupachiy

```zymbol
// Rangos
puntaje = 85
nota = ?? puntaje {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> nota ¶    // → B

// Qillqakuna
lliwi = "puka"
qillqa = ?? lliwi {
    "puka"   => "#FF0000"
    "q'umir" => "#00FF00"
    _        => "#000000"
}

// Tupachiy patrones
q'uñiy = -5
situasiyun = ?? q'uñiy {
    < 0  => "chiri"
    < 20 => "chiri chiri"
    < 35 => "q'uñi"
    _    => "ruphay"
}
>> situasiyun ¶    // → chiri

// Willakuy rikch'aq (bloque brazos)
n = -3
?? n {
    0    => { >> "cero" ¶ }
    < 0  => { >> "negativo" ¶ }
    _    => { >> "positivo" ¶ }
}
```

---

## Muyuriy

```zymbol
@ i:0..4  { >> i " " }        // rango yaykuq:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pasowanmi:      1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kutipuspa:      5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (mientras)

rutukuna = ["mansana", "piras", "uva"]
@ r:rutukuna { >> r ¶ }       // sapa-elemento lista

@ c:"napay" { >> c "-" }
>> ¶                          // → n-a-p-a-y-  (sapa-elemento qillqa)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> katiy
    ? i > 7 { @! }             // @! saychiy
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Mana tukuq muyuriy
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Sutirayuq muyuriy (ukhupi saychiy)
yupay = 0
@:wiqay {
    yupay++
    ? yupay >= 3 { @:wiqay! }
}
>> yupay ¶                    // → 3
```

---

## Ruraykunan

```zymbol
yapay(a, b) { <~ a + b }
>> yapay(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Ruraykunan **wichqasqa espacio** tiyan — mana wiqay tiksimuyu leenku. `<~` nisqata churay tiksimuyu waqay tiksiychiy:

```zymbol
t'aqlay(a<~, b<~) {
    temp = a
    a = b
    b = temp
}
x = 10
y = 20
t'aqlay(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Sutirayuq ruraykunan **ñawpaq-rikch'aq valores** — chiqanta pasachiy: `yupakuna$> iskayachiy`. Wichqay: `x -> fn(x)` ima atikun.

---

## Lambdas & Wichqasqakuna

```zymbol
iskayachiy = x -> x * 2
yapasqa = (a, b) -> a + b
>> iskayachiy(5) ¶    // → 10
>> yapasqa(3, 7) ¶    // → 10

// Bloque lambda
rikch'achiy = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}

// Wichqasqa — wiqay espacio hap'in
factor = 3
kimsachiy = x -> x * factor
>> kimsachiy(7) ¶    // → 21

// Fábrica
yapaqta_ruwaq(n) { <~ x -> x + n }
chunka_yapaq = yapaqta_ruwaq(10)
>> chunka_yapaq(5) ¶    // → 15

// Listapi
ruraykunan = [x -> x+1, x -> x*2, x -> x*x]
>> ruraykunan[3](5) ¶    // → 25
```

---

## Listas

Listas **tiksiyanakuq** ukhumantawan **kikin rikch'aq** elementosta hap'in.

```zymbol
lista = [1, 2, 3, 4, 5]

x = lista[1]      // 1 — chayay (1-ñiqiq: ñawpaq elemento)
x = lista[-1]     // 5 — negativo indice (qhipa elemento)
x = lista$#       // 5 — tupuy (>> ukupi (lista$#) churay)

lista = lista$+ 6            // yapay → [1,2,3,4,5,6]
lista2 = lista$+[2] 99       // 2 ñiqiqpi churay (1-ñiqiqmanta)
lista3 = lista$- 3           // ñawpaq tupasqa qonqay
lista4 = lista$-- 3          // llapan tupasqa qonqay
lista5 = lista$-[1]          // 1 ñiqiqpi qonqay (ñawpaq elemento)
lista6 = lista$-[2..3]       // rango qonqay (1-ñiqiqmanta, tukukuq yaykuq)

kan = lista$? 3              // #1 — ukupi kan
sitio = lista$?? 3           // [3] — llapan ñiqiqkunan (1-ñiqiqmanta)
uhu = lista$[1..3]           // [1,2,3] — uhu (1-ñiqiqmanta, tukukuq yaykuq)
uhu2 = lista$[1:3]           // [1,2,3] — kikin, yupay-ñiqiq sintaxis

hatunta = lista$^+           // hatunman t'aqay (primitivos lla)
uchuta = lista$^-            // uchuman t'aqay (primitivos lla)

// Sutiyuq/sitioyuq tupla listas — $^ nisqata tupachiy lambda nisqawan
datos = [(suti: "Killa", wata: 28), (suti: "Inti", wata: 25), (suti: "Mama", wata: 30)]
watanpi  = datos$^ (a, b -> a.wata < b.wata)    // hatun watapi  (<)
sutinpi = datos$^ (a, b -> a.suti > b.suti)     // urayman sutinpi (>)
>> watanpi[1].suti ¶     // → Inti
>> sutinpi[1].suti ¶    // → Mama

// Chiqan elemento tiksiychiy (listas lla)
lista[1] = 99              // churay
lista[2] += 5              // kuskasqa: +=  -=  *=  /=  %=  ^=

// Tinkiy tiksiychiy — musuq lista kutichimun; qallariy mana tiksirasqachu
lista2 = lista[2]$~ 99
```

> Llapan colección operadores **musuq lista** kutichimun. Kutipuy churay: `lista = lista$+ 4`.
> `$+` watasqa atikun: `lista = lista$+ 5$+ 6$+ 7`. Huk operadores chiqanmanta churay maskhan.
> **Ñiqiq 1-ñiqiqmanta**: `lista[1]` ñawpaq elementom; `lista[0]` ruwachiy pantaym.
> `$^+` / `$^-` **primitivo listas** t'aqarin (yupakuna, qillqakuna). Tupla listas `$^` tupachiy lambda nisqawan — rikch'aq lambda ukupi (`<` = hatunman, `>` = uchuman).

**Valor semántica** — lista huk tiksimuyu churaptinqa waqay kopia ruwakun:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b mana tiksirasqachu
```

```zymbol
// Ukhupi listas (1-ñiqiqmanta)
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[2][3] ¶    // → 6  (uchuy 2, pillar 3)
```

---

## Thuqlliy

```zymbol
// Lista
lista = [10, 20, 30, 40, 50]
[a, b, c] = lista                // a=10  b=20  c=30
[ñawpaq, *qhipa] = lista         // ñawpaq=10  qhipa=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ qonqaq

// Sitioyuq tupla
punto = (100, 200)
(px, py) = punto                 // px=100  py=200

// Sutiyuq tupla
runa = (suti: "Mama", wata: 25, llaqta: "Qusqu")
(suti: n, wata: a) = runa        // n="Mama"  a=25
```

---

## Tuplakuna

Tuplakuna **mana tiksiyanakuq** ukhumantawan **sapa rikch'aq** valores hap'ina atikun.
Listas mana kikin, elementos mana tiksiyana atikun rurasqamanta.

```zymbol
// Sitioyuq — sapa rikch'aq atikun
punto = (10, 20)
>> punto[1] ¶    // → 10

datos = (42, "napay", #1, 3.14)
>> datos[3] ¶    // → #1

// Sutiyuq
runa = (suti: "Qori", wata: 25)
>> runa.suti ¶      // → Qori
>> runa[1] ¶        // → Qori  (indice ima llamkapin, 1-ñiqiq)

// Ukhupi
sitio = (x: 10, y: 20)
p = (sitio: sitio, suti: "qallariy")
>> p.sitio.x ¶      // → 10
```

**Mana tiksiyanakuy** — tupla elemento tiksiychiy ruwachiy pantaym:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ ruwachiy pantay: tuplakuna mana tiksiyanakuqchu
// t[1] += 5    // ❌ chaynallataqmi
```

Tiksirasqa valor maskhaspaqa `$~` nisqata llamkachiy (tinkiy tiksiychiy) — **musuq** tupla kutichimun:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← qallariy mana tiksirasqachu
>> t2 ¶    // → (10, 999, 30)

// Sutiyuq tupla — qallariqmanta ruway
runa = (suti: "Qori", wata: 25)
aswan  = (suti: runa.suti, wata: 26)
>> runa.wata ¶     // → 25
>> aswan.wata ¶    // → 26
```

---

## Hatun Umalliq Ruraykunan

```zymbol
yupakuna = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

iskayachisqa  = yupakuna$> (x -> x * 2)                // mapa  → [2,4,6…20]
iskayninkunan = yupakuna$| (x -> x % 2 == 0)           // filtro → [2,4,6,8,10]
llapan        = yupakuna$< (0, (acc, x) -> acc + x)    // reduce → 55

// Chiqanmanta chiqanman purispa
paso1 = yupakuna$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Sutirayuq ruraykunan HOF nisqaman chiqanta pasachiy atikun
iskayachiy(x) { <~ x * 2 }
hatunchu(x) { <~ x > 5 }
r = yupakuna$> iskayachiy    // ✅ chiqan referencia
r = yupakuna$| hatunchu      // ✅ chiqan referencia
```

---

## Tubu Operador

Pata kaq maskhan `_` churayta tupasqa valor rankinpi:

```zymbol
iskayachiy = x -> x * 2
yapay = (a, b) -> a + b
yapaq = x -> x + 1

r1 = 5 |> iskayachiy(_)        // → 10
r2 = 10 |> yapay(_, 5)         // → 15
r3 = 5 |> yapay(2, _)          // → 7

// Watasqa
r = 5 |> iskayachiy(_) |> yapaq(_) |> iskayachiy(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Pantay Allichiy

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "cero nisqawan t'aqay" ¶
} :! {
    >> "sapa: " _err ¶    // _err pantay willayta hap'in
} :> {
    >> "llapan kutis purin" ¶
}
```

| Rikch'aq | Kutinpi |
|----------|---------|
| `##Div` | Cero nisqawan t'aqay |
| `##IO` | Qillqay / sistema |
| `##Index` | Indice hawaqtam |
| `##Type` | Rikch'aq mana tupanchu |
| `##Parse` | Datos t'aqay |
| `##Network` | Red pantay |
| `##_` | Sapa pantay (llapanta hap'iq) |

---

## Modulokuna

```zymbol
// lib/yapay.zy — modulo ukun llaqtapi
# yapay {
    #> { huñuy, PI_apamuy }

    _PI := 3.14159
    huñuy(a, b) { <~ a + b }
    PI_apamuy() { <~ _PI }
}
```

```zymbol
// ñawpaq.zy
<# ./lib/yapay => k    // alias maskhasqa

>> k::huñuy(5, 3) ¶    // → 8
pi = k::PI_apamuy()
>> pi ¶               // → 3.14159
```

```zymbol
// Riqsichiy suti hukwan
# watasqa {
    #> { _ukupi_yapay => yapasqa }

    _ukupi_yapay(a, b) { <~ a + b }
}
```

```zymbol
<# ./watasqa => w

>> w::yapasqa(3, 4) ¶    // → 7  (ukupi suti _ukupi_yapay pakasqam)
```

> **Modulo kamachiy**: `#>`, ruray rikch'aqkuna, ukhumantawan literal tiksimuyu/constante churakuy lla `# suti { }` ukupi atikun. Ruwachiy willakuykuna (`>>`, `<<`, muyuriy, etc.) E013 pantay rikuchin.

---

## Yupay Rikch'aqninkuna

Zymbol **69 Unicode yupay qillqa** rikuchiyta atikun — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemático Negrita, LCD qillqa, ukhumantawan. Llamkaq modo `>>` lluqsiyta lla chaninchan; ukhupi yupachiy wiñay binarion.

### Script hap'ichiy

`0` ukhumantawan `9` yupay maskhasqa script nisqata `#…#` ukupi qillqay:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ASCII nisqaman kutichiy
```

### Lluqsiy ukhumantawan booleanokuna

```zymbol
x = 42
>> x ¶          // → 42   (ASCII chiqan)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimal punto wiñay ASCII)
>> 1 + 2 ¶      // → ३

// Booleanokuna: # wiñay ASCII, yupay adaptakun
>> #1 ¶         // → #१   (chiqan  Devanagarapi)
>> #0 ¶         // → #०   (mana chiqan — ०  yupa ceromanta t'aqasqa)

x = 28 > 4
>> x ¶          // → #१   (tupachiy llapan llamkaq modon katikun)
```

### Qallariy yupay literal qillqapi

Sapa maskhasqa script yupay literal atikun — rangopi, modulopi, tupachiypi:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal sapa script nisqapi

`#` + yupay `0` utaq `1` sapa blokmanta chiqan boolean literal:

```zymbol
#٠٩#
llamkasqa = #١        // #1 nisqawan kikin
>> llamkasqa ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **wiñay ASCII**. `#0` (mana chiqan) wiñay rikchiqmanta t'aqasqam `0` (yupa cero) nisqamanta sapa scriptpi.

---

## Datos Operadores

```zymbol
// Rikch'aq tikraqchiy casteos
f = ##.42         // → 42.0  (Float nisqaman)
i = ###3.7        // → 4     (Int nisqaman, muyusqa)
t = ##!3.7        // → 3     (Int nisqaman, t'aqasqa)

// Qillqa yupaman t'aqay
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (pantay mana kan)

// Muyuchiy / t'aqay
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (2 decimal ñiqiqpi muyuchiy)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (t'aqay)

// Yupay formato
fmt = #,|1234567|      // → 1,234,567  (coma t'aqasqa)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Base literales
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Base tikraqchiy lluqsiy
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Tinkiy

```zymbol
p'unchaw = <\ date +%Y-%m-%d \>    // stdout hap'iy (qhipa \n yaykuq)
>> "Kunan p'unchaw: " p'unchaw

qillqay = "datos.txt"
ukhupi = <\ cat {qillqay} \>       // interpolasiyun kamachiykunapi

lluqsiy = </"./qatiyniy.zy"/>     // siq'a Zymbol qillqay ruwachiy, lluqsiy hap'iy
>> lluqsiy
```

> `><` CLI argumentosta qillqa lista rikch'aqmanta hap'in (tree-walker lla).

---

## Tukuy Rikuchiy: FizzBuzz

```zymbol
rikch'achiy(yupa) {
    ? yupa % 15 == 0 { <~ "FizzBuzz" }
    _? yupa % 3  == 0 { <~ "Fizz" }
    _? yupa % 5  == 0 { <~ "Buzz" }
    _ { <~ yupa }
}

@ i:1..20 { >> rikch'achiy(i) ¶ }
```

---

## Sananqa Qaway

| Sananqa | Ruwachiy | Sananqa | Ruwachiy |
|---------|----------|---------|----------|
| `=` | tiksimuyu | `$#` | tupuy |
| `:=` | constante | `$+` | yapay (watasqa) |
| `>>` | lluqsiy | `$+[i]` | ñiqiqpi churay (1-ñiqiqmanta) |
| `<<` | yaykuy | `$-` | ñawpaqta qonqay chaninwan |
| `¶` / `\\` | qhipa simipi | `$--` | llapan qonqay chaninwan |
| `?` | ? ruwachiy | `$-[i]` | ñiqiqpi qonqay (1-ñiqiqmanta) |
| `_?` | manachayqa ? | `$-[i..j]` | rango qonqay (1-ñiqiqmanta) |
| `_` | manachayqa / sapa | `$?` | ukupi kan |
| `??` | tupachiy | `$??` | llapan ñiqiqkunan maskhay (1-ñiqiqmanta) |
| `@` | muyuriy | `$[s..e]` | uhu (1-ñiqiqmanta) |
| `@ N { }` | N kutita muyuriy | `$>` | mapa |
| `@!` | saychiy | `$\|` | filtro |
| `@>` | katiy | `$<` | reduce |
| `@:suti { }` | sutirayuq muyuriy | `$/ delim` | qillqa t'aqay |
| `@:suti!` | sutirayuq saychiy | `$++ a b c` | watasqa ruway |
| `@:suti>` | sutirayuq katiy | `lista[i>j>k]` | navegasiyun indice |
| `->` | lambda | `lista[i] = val` | elemento tiksiychiy (listas lla) |
| `lista[i] += val` | kuskasqa tiksiychiy | `lista[i]$~` | tinkiy tiksiychiy (musuq kopia) |
| `$^+` | hatunman t'aqay (primitivos) | `$^-` | uchuman t'aqay (primitivos) |
| `$^` | tupachiywan t'aqay (tuplakuna) | `<~` | kutichiy |
| `\|>` | tubu | `!?` | ruray |
| `:!` | hap'iy | `:>` | tukuyniqpi |
| `#1` | chiqan | `#0` | mana chiqan |
| `$!` | pantaychu | `$!!` | pantay apachiy |
| `<#` | yaykuchiy | `#>` | lluqsichiy |
| `#` | modulo ñiychiy | `::` | modulo waqay |
| `.` | ñan chayay | `#?` | rikch'aq datos |
| `#\|..\|` | yupay t'aqay | `##.` | Float nisqaman tikraqchiy |
| `###` | Int nisqaman tikraqchiy (muyusqa) | `##!` | Int nisqaman tikraqchiy (t'aqasqa) |
| `#.N\|..\|` | muyuchiy | `#!N\|..\|` | t'aqay |
| `#,\|..\|` | coma formato | `#^\|..\|` | científico |
| `#d0d9#` | yupay modo t'ikraqchiy | `#09#` | ASCII nisqaman kutichiy |
| `<\ ..\>` | shell ruwachiy | `>\<` | CLI argumentos |
| `\ var` | tiksimuyu chinkachiy | `°x` / `x°` | auto-inicio (ruphay qillqay) |
| `>>|` | TUI bloque (pantalla alternativa) | `>>~` | sitiosqa lluqsiy |
| `>>!` | pantalla pichay | `>>?` | terminal hatunniynin tapuy |
| `<<\|` | tecla hap'iy (suyaspa) | `<<\|?` | tecla hap'iy (mana suyaspa) |
| `@~ N` | N milisegundos puñuchiy | `$*` | qillqata N kutita kutichiymanta |

---

## Lluqsiy Cambiokuna

### v0.0.5 — TUI Primitivos, Ruphay Qillqay & Qillqa Kutichiy _(Mayo 2026)_

- **Pantasqa** Tupachiy brazo t'aqakuy: `patrón : resultado` → `patrón => resultado`
- **Pantasqa** Yaykuchiy alias: `<# siq'a <= alias` → `<# siq'a => alias`
- **Pantasqa** Lluqsichiy sutiymanta: `#> { fn <= pub }` → `#> { fn => pub }`
- **Yapasqa** TUI bloque `>>| { }` — pantalla alternativa + modo crudo; lluqsiymanta allinchan
- **Yapasqa** Sitiosqa lluqsiy `>>~ (uchuy, pillar, BKS, fg, bg) > elementos` — sitios t'aqasqa, 256-color ANSI
- **Yapasqa** Tecla yaykuy `<<| var` (suyaspa) ukhumantawan `<<|? var` (mana suyaspa tapuy)
- **Yapasqa** `>>!` pantalla pichay, `>>?` terminal hatunniynin tapuy, `@~ N` N milisegundos puñuchiy
- **Yapasqa** Ruphay qillqay `°x` / `x°` — tiksimuyu auto-inicio ñawpaq llamkakuypi
- **Yapasqa** Qillqa kutichiy `str $* N` — qillqata N kutita kutichiymanta
- **VM** Kiqin: 436/436 prueba pasarqan

### v0.0.4 — 1-ñiqiq, Ñawpaq Ruraykunan & Modulo Blokukunan _(Abril 2026)_

- **Pantasqa** Llapan ñiqiq **1-ñiqiqman** tikraqchisqa — `lista[1]` ñawpaq elementom; `lista[0]` ruwachiy pantaym
- **Yapasqa** Sutirayuq ruraykunan **ñawpaq-rikch'aq valores** — HOF nisqaman chiqanta pasachiy: `yupakuna$> iskayachiy`
- **Yapasqa** Modulo **bloque sintaxis** maskhasqa: `# suti { ... }` — llano sintaxis qonqarqan
- **Yapasqa** Achkha-ñiqiq indice: `lista[i>j>k]` (navegasiyun), `lista[p ; q]` (llano lluqsiy)
- **Yapasqa** Rikch'aq tikraqchiy casteos: `##.expr` (Float), `###expr` (Int muyusqa), `##!expr` (Int t'aqasqa)
- **Yapasqa** Qillqa t'aqay: `str$/ delim` — `Array(String)` kutichimun
- **Yapasqa** Watasqa ruway: `base$++ a b c` — achkha elementos yapaykun
- **Yapasqa** N kutita muyuriy: `@ N { }` — kikin kutita muyuriy
- **Yapasqa** Sutirayuq muyuriy sintaxis: `@:suti { }`, `@:suti!`, `@:suti>` — `@ @suti` / `@! suti` nisqata hich'akin
- **Yapasqa** Tiksimuyu alcance: `_suti` tiksimuyu llaqta alcanceyuq; `\ var` sipiqmanta chinkachin
- **Yapasqa** Tupachiy comparación patrones: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Yapasqa** Modulo E013 pantay: ruwachiy willakuykuna modulo ukupi mana atikuqchu
- **Allichisqa** `take_variable` mana constante modulo tiksiychiypi pantaychu
- **Allichisqa** `alias.CONST` chiqanta chayarikun; `#>` ruray rikch'aqkuna qhipapi atikun
- **VM** Tukuy kiqin: 393/393 prueba pasarqan

### v0.0.3 — Unicode Yupay Sistémakuna & LSP Allichiy _(Abril 2026)_

- **Yapasqa** 69 Unicode yupay blokukunan modo-t'ikraqchiy señalwan `#d0d9#`
- **Yapasqa** Boolean literal sapa scriptpi — `#१` / `#०`, `#١` / `#٠`, etc.
- **Yapasqa** Klingon pIqaD yupakuna (CSUR PUA U+F8F0–U+F8F9)
- **Yapasqa** `SetNumeralMode` VM opcode — tree-walkerwan tukuy kiqin
- **Yapasqa** REPL llamkaq yupay modo rikuchiynimpi ukhumantawan tiksimuyu rikuchiypi
- **Tikrasqa** Boolean `>>` lluqsiy `#` ñawpaqwan rikuchimun (`#0` / `#1`) llapan modopi

### v0.0.2_01 — Operador Sutiymanta _(30 Mar 2026)_

- **Tikrasqa** `c|..|` → `#,|..|` ukhumantawan `e|..|` → `#^|..|` — `#` formato ñawpaq familiawan kiqin
- **Yapasqa** Lluqsichiy alias: modulo miembrokuna suti hukwan kutichiy

### v0.0.2 — Colección API Tikraqchiy & Instaladores _(24 Mar 2026)_

- **Yapasqa** Kuskasqa `$` operador familia listas ukhumantawan qillqakuanpaq (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yapasqa** Thuqlliy churay listas, tuplakuna, ukhumantawan sutiyuq tuplakuanpaq
- **Yapasqa** Negativo ñiqiqkuna (`lista[-1]` = qhipa elemento)
- **Yapasqa** Chiqan instaladores — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Yapasqa** Kuskasqa churay `^=`
- **Allichisqa** Parser yupachiy rikch'aq; documentación allichikuy

### v0.0.1 — Ñawpaq Paqarimuy _(22 Mar 2026)_

- Tree-walker intérprete + registro VM (`--vm`, ~4× usqayta, ~95% kiqin)
- Llapan qallariy ruwaykuna: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tukuy Unicode identificadores, modulo sistema, lambdas, wichqasqakuna, pantay allichiy
- REPL, LSP, VS Code extensión, formato (`zymbol fmt`)

---

_Zymbol-Lang — Sananqa. Universal. Mana tiksiyanakuq._
