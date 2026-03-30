# Zymbol-Lang Yatiqawi

**Zymbol-Lang** mayni yatiqawi arunak. Janiw aruskipawinakax utjkiti — yatiyañanakaw puni. Aymara aru arsuñatakiw mayacht'ayasipxi.

- Janiw aruskipawinakax utjkiti (`if`, `while`, `return` janiw utjkiti — yatiyañanakaw puni `?`, `@`, `<~`)
- Unicodex jikxatasipxi — jakhunak mayni arunx emoji 👋 arsuñax yatipxi
- Mayni arupuniw — códigox lurawinakatan arunakaw utjxaspani

---

## Yatiyañanaka mîna Janiw Päsitinaka

```zymbol
jakhu = 10              // yatiyaña (cambiasiñax yatipxi)
PI := 3.14159           // janiw päsititi (janiw cambiasiñax yatiti — panthasinipaw utjaspa)
sutixa = "Ana"
luräwi = #1             // bool chiqani
👋 := "Kamisaraki"
```

```zymbol
jakhu = 10
jakhu += 5    // 15
jakhu -= 3    // 12
jakhu *= 2    // 24
jakhu /= 3    // 8
jakhu %= 3    // 2
jakhu ^= 2    // 4
jakhu++       // 5
jakhu--       // 4
```

---

## Kasta Yatiyañanaka

| Kasta           | Uñacht'ayaña        | Yatiyaña `#?` | Yatiqawi                            |
|-----------------|---------------------|---------------|-------------------------------------|
| Jakhu           | `42`, `-7`          | `###`         | 64-bit janiw sumaskaniti            |
| Jakhu Phuqt'aña | `3.14`, `1.5e10`    | `##.`         | Cientificow yatipxi                 |
| Arunak          | `"kamisaraki"`      | `##"`         | Yuqhantasiña: `"Kamisaraki {sutixa}"` |
| Silaña          | `'A'`               | `##'`         | Mayni Unicode silaña                |
| Bool            | `#1`, `#0`          | `##?`         | JANIW 1 mîna 0 jakhuñakiti          |
| Tantachaña      | `[1, 2, 3]`         | `##]`         | Kastax kimsa jikxatasiña            |
| Tuple           | `(a, b)`            | `##)`         | Jakhu uñacht'ayasiña                |
| Sutinak Tuple   | `(x: 1, y: 2)`      | `##)`         | Sutiw mîna jakhuniw yatinipxi       |

```zymbol
// Type introspection — returns (type, digits, value)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Sartaña mîna Aptaña

```zymbol
>> "Kamisaraki" ¶                    // ¶ mîna \\ ch'uwa uñacht'ayasiña
>> "a=" jakhu " b=" wakisi ¶         // achikt'ayasiñaw yatipxi
>> (tantachaña$#) ¶                  // postfix yatiyañanakax paréntesisaw munipxi

<< sutixa                            // janiw munaskatiti — yatiyañan aptasiña
<< "Sutimax? " sutixa                // munaskatiti
```

> `¶` (AltGr+R teclado españolpe) mîna `\\` ch'uxñaw utjxaspani ch'uwatakiw.

---

## Lurawinaka

```zymbol
// Arithmetic — use assignments; some operators have quirks directly in >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (integer division)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (exponentiation)

// Comparison
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logical
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Aruskipawinaka

```zymbol
// Three concatenation forms
sutixa = "Ana"
jakhu = 25

willkaña = "Kamisaraki ", sutixa, "!"          // coma — yatiyañan = mîna :=
>> "Kamisaraki " sutixa " juman " jakhu ¶      // achikt'ayasiña — sartasiñan >>
willkaña = "Kamisaraki {sutixa}, juman {jakhu}" // yuqhantasiña — mayni jaytasiñan
```

```zymbol
s = "Kamisaraki Pacha"
len = s$#                  // 17
sub = s$[0..10]            // "Kamisaraki"  (tukuy mana)
has = s$? "Pacha"          // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "KAmisArAki PAchA"
rep1 = s$~~["a":"A":1]     // "KAmisaraki Pacha"  (ñawpaq N kama)
```

> `+` jakhunakaw puni. Arunakan warninipaw uñjaspa `,`, achikt'ayasiña, mîna yuqhantasiña.

---

## Kunjamasa

```zymbol
jakhu = 7

? jakhu > 0 { >> "jila" ¶ }

? jakhu > 100 {
    >> "jach'a" ¶
} _? jakhu > 0 {
    >> "jila" ¶
} _? jakhu == 0 {
    >> "maya" ¶
} _ {
    >> "janiw" ¶
}
```

> Bloques `{ }` **munapxi**, mayni lineatakiw.

---

## Match

```zymbol
// Match jakhu pampanakan
jakhu = 85
chiqancha = ?? jakhu {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> chiqancha ¶    // → B

// Match arunakan
sami = "puca"
codigon = ?? sami {
    "puca"  : "#FF0000"
    "q'umir": "#00FF00"
    _       : "#000000"
}

// Match guardanakan (mayni condicionnakan)
phusuta = -5
kastan = ?? phusuta {
    _? phusuta < 0  : "chiri"
    _? phusuta < 20 : "chirinaka"
    _? phusuta < 35 : "lupi"
    _               : "jallu"
}
>> kastan ¶    // → chiri

// Bloque ukupi
?? n {
    0       : { >> "maya" ¶ }
    _? n < 0: { >> "janiw" ¶ }
    _       : { >> "jila" ¶ }
}
```

---

## Mayacht'aña

```zymbol
@ i:0..4  { >> i " " }        // pampanaka:   0 1 2 3 4
@ i:1..9:2 { >> i " " }       // yapxt'aña:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // janiw pampa: 5 4 3 2 1 0

jakhu = 1
@ jakhu <= 64 { jakhu *= 2 }
>> jakhu ¶                    // → 128  (while)

jallunak = ["jallu", "chiri", "lupi"]
@ f:jallunak { >> f ¶ }      // tantachaña maynitakit

@ c:"kamisaraki" { >> c "-" }
>> ¶                          // → k-a-m-i-s-a-r-a-k-i-  (arunak sillanankan)

@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> saraña
    ? i > 7 { @! }          // @! jaqukipaña
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Tukuy mayacht'aña
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Sutinak mayacht'aña (ukupi jaqukipaña)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Yatiqawinaka

```zymbol
yapxitaña(a, b) { <~ a + b }
>> yapxitaña(3, 4) ¶    // → 7

contaña(jakhu) {
    ? jakhu <= 1 { <~ 1 }
    <~ jakhu * contaña(jakhu - 1)
}
>> contaña(5) ¶    // → 120
```

Yatiqawinakax **janiw tawaña yatipxiti** — janiw tawaña yatiti huehuē yatiyaña. Salida parámetro `<~` apaykachaña:

```zymbol
swap(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
swap(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Sutinak yatiqawinaka `sutixa(params){ }` janiw jach'a yatiyañakiti. Pasaña munaspa: `x -> sutixa(x)`.

---

## Lambda mîna Qilqaña

```zymbol
pàyxataña = x -> x * 2
yapxitaña = (a, b) -> a + b
>> pàyxataña(5) ¶    // → 10
>> yapxitaña(3, 7) ¶  // → 10

// Lambda bloquenakan
kastanchaña = x -> {
    ? x > 0 { <~ "jila" }
    _? x < 0 { <~ "janiw" }
    <~ "maya"
}

// Qilqaña — lambdanakax tawaña yatipxi
luraña = 3
kimsa_kuti = x -> x * luraña    // luraña qilqasiwa
>> kimsa_kuti(7) ¶    // → 21

// Yatiqawi luraña
make_yapxitaña(jakhu) { <~ x -> x + jakhu }
yapxitaña10 = make_yapxitaña(10)
>> yapxitaña10(5) ¶    // → 15

// Lambdanakax yatiyañanakaw — tantachaña
lurawinaka = [x -> x+1, x -> x*2, x -> x*x]
>> lurawinaka[2](5) ¶    // → 25
```

---

## Tantachaña

```zymbol
tantachaña = [1, 2, 3, 4, 5]

tantachaña[0]          // 1 — yatinuña (0-base)
tantachaña[-1]         // 5 — janiw pampa (qipa)
tantachaña$#           // 5 — jach'anaka (paréntesisaw >> munipxi)

tantachaña = tantachaña$+ 6            // yapxtaña → [1,2,3,4,5,6]
arr2 = tantachaña$+[2] 99              // jakhu 2pi churay
arr3 = tantachaña$- 3                  // ñawpaq valor jiwayaña
arr4 = tantachaña$-- 3                 // tukuy valor jiwayaña
arr5 = tantachaña$-[0]                 // jakhu jiwayaña
arr6 = tantachaña$-[1..3]             // pampanaka jiwayaña (tukuy mana)

utji = tantachaña$? 3            // #1 — utjiñ
pos = tantachaña$?? 3            // [2] — tukuy jakhunak
sl = tantachaña$[0..3]           // [1,2,3] — siq'iña (tukuy mana)
sl2 = tantachaña$[0:3]           // [1,2,3] — kikillan, jakhuniw

asc = tantachaña$^+              // wichay (primitivos kama)
desc = tantachaña$^-             // janiw pampa (primitivos kama)

// Sutinak/jakhu tuple tantachaña — $^ comparador lambdawan
db = [(sutixa: "Carla", maranaka: 28), (sutixa: "Ana", maranaka: 25), (sutixa: "Bob", maranaka: 30)]
maranakapi  = db$^ (a, b -> a.maranaka < b.maranaka)
sutixapi    = db$^ (a, b -> a.sutixa > b.sutixa)
>> maranakapi[0].sutixa ¶     // → Ana
>> sutixapi[0].sutixa ¶       // → Carla

tantachaña[1] = 99              // jakhu cambiaña
tantachaña = tantachaña[1]$~ 99 // mayni tantachaña kutitaña
```

> Tukuy colección lurawinakax **mayni tantachaña** kutipxi. Yapxtaña: `tantachaña = tantachaña$+ 4`.
> Janiw chiqanchasiñax yatiti: pàya cambianakaw luraña.
> `$^+` / `$^-` **primitivo tantachaña** (jakhunak, arunak). Tuple tantachañapx `$^` comparador lambdawan — ñanqa lambdapi churasqa (`<` = wichay, `>` = janiw pampa).

```zymbol
// Ukupi tantachaña
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[1][2] ¶    // → 6
```

---

## Kachuntayaña

```zymbol
// Tantachaña
tantachaña = [10, 20, 30, 40, 50]
[a, b, c] = tantachaña              // a=10  b=20  c=30
[first, *rest] = tantachaña         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]               // _ janiw munapkiti

// Jakhu tuple
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Sutinak tuple
jaqi = (sutixa: "Ana", maranaka: 25, marka: "La Paz")
(sutixa: s, maranaka: m) = jaqi   // s="Ana"  m=25
```

---

## Tuple

```zymbol
// Jakhu
punto = (10, 20)
>> punto[0] ¶    // → 10

// Sutinak
jaqi = (sutixa: "Alice", maranaka: 25)
>> jaqi.sutixa ¶    // → Alice
>> jaqi[0] ¶        // → Alice  (jakhuniw yatipxiw)

// Ukupi
pos = (x: 10, y: 20)
p = (pos: pos, sutixa: "qallta")
>> p.pos.x ¶        // → 10
```

---

## Nayra Yatiqawinaka

> HOF yatiyañanakax **inline lambda** munipxi — janiw lambda yatiyaña chiruntita.

```zymbol
jakhunak = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

pàyxataña  = jakhunak$> (x -> x * 2)                // map  → [2,4,6…20]
pärnak     = jakhunak$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
tantanaka  = jakhunak$< (0, (acc, x) -> acc + x)     // reduce → 55

// Pàya cambianakaw huñiy
step1 = jakhunak$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Sutinak yatiqawinaka HOF ukupi — lambdawan hapiy
pàyxataña2(x) { <~ x * 2 }
r = jakhunak$> (x -> pàyxataña2(x))    // ✅
```

---

## Turku Lurawi

RHS siempre `_` placeholder munasqa piped yatiyaña:

```zymbol
pàyxataña = x -> x * 2
yapxitaña = (a, b) -> a + b
yapxtaña = x -> x + 1

5 |> pàyxataña(_)        // → 10
10 |> yapxitaña(_, 5)    // → 15
5 |> yapxitaña(2, _)     // → 7

// Chiqanchasiña
r = 5 |> pàyxataña(_) |> yapxtaña(_) |> pàyxataña(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Panthasiña

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Janiw jakhuñax yatiti" ¶
} :! {
    >> "Juk'a panthasiña: " _err ¶    // _err panthasiña yatiyaña waqaychan
} :> {
    >> "Mayniw lurasipxi" ¶
}
```

| Kasta       | Kunjamasa utjaspa              |
|-------------|--------------------------------|
| `##Div`     | Janiw jakhuñax yatiti          |
| `##IO`      | Archivo / Sistema              |
| `##Index`   | Jakhu pampan janiw utjkiti     |
| `##Type`    | Kasta panthasiña               |
| `##Parse`   | Leer panthasiña                |
| `##Network` | Red panthasiña                 |
| `##_`       | Mayni panthasiña (catch-all)   |

---

## Lurawi

```zymbol
// Archivo: lib/calc.zy
# calc

#> { yapxitaña, get_PI }    // Exportar NAYRA definicionan

_PI := 3.14159
yapxitaña(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Archivo: main.zy
<# ./lib/calc <= c    // Alias munapxi

>> c::yapxitaña(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                   // → 3.14159
```

```zymbol
// Sutinak exportaña
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7  (sutixa _internal_add pakasxa)
```

---

## Yatiyawinaka Lurawi

```zymbol
// Arunak jakhuñ tikraña
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (panthasiña janiw)

// Jakhuntaña / ch'iqtaña
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (pàya decimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (ch'iqtaña)

// Jakhu formato
fmt = #,|1234567|      // → 1,234,567  (coma huñisqa)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Base literal
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Base tikraña sartañataki
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Tantachaña

```zymbol
urupa = <\ date +%Y-%m-%d \>     // stdout aptaña (tukuy \n hapipxi)
>> "Jichhuru: " urupa

marandurenda = "data.txt"
ukhuña = <\ cat {marandurenda} \>      // yuqhantasiña comando ukupi

lluqsiña = </"./subscript.zy"/>   // huk Zymbol qillqa luraña, sartaña aptaña
>> lluqsiña
```

> `><` CLI argumentanakax arunak tantachaña hina aptaña (tree-walker kama).

---

## Phuqat Yatiqawi: FizzBuzz

```zymbol
sartaña(jakhu) {
    ? jakhu % 15 == 0 { <~ "PupuñaJaqaña" }
    _? jakhu % 3  == 0 { <~ "Pupuña" }
    _? jakhu % 5  == 0 { <~ "Jaqaña" }
    _ { <~ jakhu }
}

@ i:1..20 { >> sartaña(i) ¶ }
```

---

## Yatiyañanaka Uñjawi

| Yatiyaña | Luraña              | Yatiyaña   | Luraña                |
|----------|---------------------|------------|-----------------------|
| `=`      | yatiyaña            | `$#`       | jach'anaka            |
| `:=`     | janiw päsititi      | `$+`       | yapxtaña              |
| `>>`     | sartaña             | `$+[i]`    | jakhupi churay        |
| `<<`     | aptaña              | `$-`       | ñawpaq jiwayaña       |
| `¶`/`\\` | ch'uwa              | `$--`      | tukuy jiwayaña        |
| `?`      | kunjamasa (if)      | `$-[i]`    | jakhu jiwayaña        |
| `_?`     | juk'a (elif)        | `$-[i..j]` | pampanaka jiwayaña    |
| `_`      | janiw / Placeholder | `$?`       | utjiñ                 |
| `??`     | match               | `$??`      | tukuy jakhunak        |
| `@`      | mayacht'aña         | `$[s..e]`  | siq'iña               |
| `@!`     | jaqukipaña (break)  | `$>`       | map                   |
| `@>`     | saraña (continue)   | `$\|`      | filter                |
| `->`     | lambda              | `$<`       | reduce                |
| `$^+`    | wichay (primitivos) | `$^-`      | janiw pampa (primitivos) |
| `$^`     | comparador (tuples) | | |
| `<~`     | kutitaña (return)   | `!?`       | luraña (try)          |
| `\|>`    | pipe                | `:!`       | aptaña (catch)        |
| `#1`     | chiqani             | `:>`       | mayniw (finally)      |
| `#0`     | janiw               | `$!`       | panthasiña yatinuña   |
| `<#`     | importaña           | `$!!`      | panthasiña pasaña     |
| `#`      | lurawi uñacht'ayaña | `#>`       | exportaña             |
| `::`     | lurawi wawxataña    | `.`        | campo yatinuña        |
| `#\|..\|` | jakhu tikraña      | `#?`       | tipo metadata         |
| `#.N\|..\|` | jakhuntaña       | `#!N\|..\|` | ch'iqtaña           |
| `c\|..\|` | coma formato       | `e\|..\|`  | científico            |
| `<\ ..\>` | shell luraña       | `><`       | CLI argumentanaka     |

---

*Zymbol-Lang — Yatiyañanaka. Mayni. Janiw Pästiti.*

> **Yatichtaña:** Kay yatiqawixa inteligencia artificial (IA) lurasipxiwa mîna mayacht'ayasipxiwa.
> Chiqanchasiñatakix walja lurawinakaw lurasipxi, ukampis juk'a yatichtawinaka mîna uñacht'ayañanakax panthasinipaw utjaspa.
> Jach'a yatiqawixa [Zymbol-Lang yatichtawi](https://github.com/zymbol-lang/interpreter) awa.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
