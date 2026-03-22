# Zymbol-Lang Hatun Qillqa

**Zymbol-Lang** huk rimay qillqa simiyuq. Mana rimaykunata apaykachan — llapan señalkunam. Llapan rumasimipeqa kikillanpim ruran.

---

## Yuyaychay

- Mana rimaykunata (`if`, `while`, `return` mana kanchu — señalkuna `?`, `@`, `<~` kama)
- Unicode tukuy — sutikuna llapan simipeqa icha emoji 👋
- Mana simiman hap'ikuq — código llapan simipeqa kikillanmi

---

## Chanin Qillqakuna

```zymbol
x = 10           // chanin (tikrakuqmi)
PI := 3.14159    // chanin mana tikrakuq (mana tikrakunqa — pantayqa kanqa)
suti = "Ana"
kawsaq = #1      // chiqaq
👋 := "Napaykullayki"
```

### Chanin Churay Huñisqa

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Imaymana Chaninkuna

| Klase          | Kayhinam             | Símbolo `#?` | Willakuy                            |
|----------------|----------------------|--------------|-------------------------------------|
| Yupay          | `42`, `-7`           | `###`        | 64-bit firmayuq                     |
| Chiru yupay    | `3.14`, `1.5e10`     | `##.`        | Qimichasqa yupay apaykachasqa       |
| Simi           | `"napaykullayki"`    | `##"`        | Qichwa: `"Napaykullayki {suti}"`    |
| Sillabiy       | `'A'`                | `##'`        | Huk Unicode sillabiy                |
| Chiqap/Mana    | `#1`, `#0`           | `##?`        | MANA 1 icha 0 yupay                 |
| Qipa           | `[1, 2, 3]`          | `##]`        | Llapan ima klasepin                 |
| Tupla          | `(a, b)`             | `##)`        | Churanapim                          |
| Sutiyuq tupla  | `(x: 1, y: 2)`       | `##)`        | Sutinpi icha yupaypi taripasqa      |

---

## Lluksichiykuna ha Yaykuchiykuna

```zymbol
// Lluqsichiy — MANA sapanmanta muhu churakunchu
>> "Napaykullayki" ¶                // ¶ icha \\ muhu churan
>> "a=" a " b=" b ¶                 // achka imaymana huñisqa
>> "yupay=" yapuy(2, 3) ¶           // función imaymana chawpimpi
>> (arr$#) ¶                        // postfix paréntesispi munasqa

// Yaykuchiy
<< suti                             // mana rimaywan — chaninta chayachispa
<< "Sutikiqa? " suti                // rimaywan
```

> `¶` icha `\\` kikillanmi muhu churan.

---

## Simi Huñiy

Kimsa ñan — sapanmanta wakichichiypim:

```zymbol
suti = "Ana"
n = 25

// 1. Koma — chanin churaypi = icha :=
willakuy = "Napaykullayki ", suti, "!"      // → Napaykullayki Ana!
SUTI := "Runasimipi: ", suti

// 2. Huñisqa — lluqsichiypi >>
>> "Napaykullayki " suti " yupayniyki " n ¶  // → Napaykullayki Ana yupayniyki 25

// 3. Ukupi churachiysqa — imaymana chawpimpi
rimay = "Napaykullayki {suti}, yupayniyki {n}"  // → Napaykullayki Ana, yupayniyki 25
```

> **Yuyay**: `+` yupayllapiñam. Simiman apaykachaqqa willachikun.

---

## Puriynin Kamachiy

```zymbol
x = 7

// Sapan chiqap
? x > 0 { >> "wichaypi" ¶ }

// Chiqap / icha chiqap / mana
? x > 100 {
    >> "hatun" ¶
} _? x > 0 {
    >> "wichaypi" ¶
} _? x == 0 {
    >> "ch'uya" ¶
} _ {
    >> "uraypi" ¶
}
```

Bloque `{ }` **munasqam** huk renglonlla kaqtinpis.

---

## Match

```zymbol
// Match yupay juk'urkuna
yupay = 85
grado = ?? yupay {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Match waqaychay (imaymana kaqkuna)
urqu = -5
kaqnin = ?? urqu {
    _? urqu < 0  : "chiri riti"
    _? urqu < 20 : "chiri"
    _? urqu < 35 : "q'uñi"
    _            : "nina"
}
>> kaqnin ¶    // → chiri riti

// Match simi
kuluri = "puka"
código = ?? kuluri {
    "puka"  : "#FF0000"
    "q'umir": "#00FF00"
    _       : "#000000"
}
>> código ¶
```

---

## Muyuy

```zymbol
// Yupay juk'urkuna: 0..4 purin 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Yupay hatunchisqawan
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Yupay uraypi
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Peve (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Llapan imaymana
poqoy = ["ch'uño", "tunta", "papa"]
@ f:poqoy { >> f ¶ }

// Simi silabiykuna
@ c:"suti" { >> c "-" }
>> ¶    // → s-u-t-i-

// @! ha @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> rinqa
    ? i > 7 { @! }          // @! tukun
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Ruray

```zymbol
// Rurachiy ha waqaychay
yapuy(a, b) { <~ a + b }
>> yapuy(3, 4) ¶    // → 7

// Kutirimuy
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Ruray sapanmanta — mana kanman hawa chanin
global = 100
ruway() {
    x = 42    // kaypi kama
    <~ x
}
>> ruway() ¶    // → 42
```

> **Hatun yuyay**: Ruray `suti(params){ }` mana chanin hina.
> Argumento cachaypi: `x -> suti(x)`.

---

## Lambda ha Closure

```zymbol
// Lambda iskay (mana willasqa kutimuy)
iskayñiy = x -> x * 2
yapuy = (a, b) -> a + b
>> iskayñiy(5) ¶    // → 10
>> yapuy(3, 7) ¶    // → 10

// Lambda bloquepi (willasqa kutimuy)
riqsinchiy = x -> {
    ? x > 0 { <~ "wichaypi" }
    _? x < 0 { <~ "uraypi" }
    <~ "ch'uya"
}
>> riqsinchiy(5) ¶     // → wichaypi
>> riqsinchiy(0) ¶     // → ch'uya
>> riqsinchiy(-5) ¶    // → uraypi

// Closure — lambda hawa chaninta hap'in
factor = 3
kimsa = x -> x * factor    // 'factor' hap'in
>> kimsa(7) ¶    // → 21

// Ruray ruray
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda chanin: array ukupi
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Qipa

```zymbol
arr = [10, 20, 30, 40, 50]

// Yaykuy (0-base)
>> arr[0] ¶    // → 10

// Yupay (paréntesis munasqa >>pi)
n = arr$#
>> (arr$#) ¶    // → 5

// Yapuy, qichuy, maskhay, cortar
arr = arr$+ 60               // yapuy
arr = arr$- 0                // qichuy índice 0
kan = arr$? 30               // → #1
cortasqa = arr$[0..2]        // [20, 30]

// Chanin tikray
arr[1] = 99

// Llapan imaymana
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **qipa musuq** kutichikan — yapuy: `arr = arr$+ 4`.
> Mana huñichiyta — iskay churaypi ruway.

---

## Tupla

```zymbol
// Sutiyuq tupla
runa = (suti: "Alice", watantin: 25)
>> runa.suti ¶       // → Alice
>> runa.watantin ¶   // → 25
>> runa[0] ¶         // → Alice (yupay kaqpis)
```

---

## Hatun Ruray

HOF señalkuna **lambda inline** munankum — mana variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
iskayñisqa = nums$> (x -> x * 2)
>> iskayñisqa ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
iskay kuti = nums$| (x -> x % 2 == 0)
>> iskay kuti ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (kallpanin, (acc, elem) -> expr)
llapan = nums$< (0, (acc, x) -> acc + x)
>> llapan ¶    // → 55
```

---

## Pantay Waqaychay

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "siphunwan mana ruwasqa" ¶
} :! ##IO {
    >> "IO pantay" ¶
} :! {
    >> "huk pantay: " _err ¶
} :> {
    >> "llapanpi purin" ¶
}
```

| Klase       | Kaypi kaqpim          |
|-------------|----------------------|
| `##Div`     | Siphunwan mana       |
| `##IO`      | Qillqa / sistema     |
| `##Index`   | Yupay hawapi         |
| `##Type`    | Klase pantay         |
| `##Parse`   | Parsing              |
| `##Network` | Red pantay           |
| `##_`       | Llapan pantay        |

---

## Módulo

```zymbol
// Qillqa: lib/calc.zy
# calc

#> { yapuy, get_PI }    // lluqsichiy ÑAWPAQ definiciones

_PI := 3.14159
yapuy(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Qillqa: main.zy
<# ./lib/calc <= c    // alias munasqa

>> c::yapuy(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Tukuy Kayhinam: FizzBuzz

```zymbol
riqsinchiy(yupay) {
    ? yupay % 15 == 0 { <~ "PhuyuWaqay" }
    _? yupay % 3  == 0 { <~ "Phuyu" }
    _? yupay % 5  == 0 { <~ "Waqay" }
    _ { <~ yupay }
}

@ i:1..20 { >> riqsinchiy(i) ¶ }
```

---

## Señal Rekotee

| Señal   | Ruray             | Señal      | Ruray              |
|---------|-------------------|------------|--------------------|
| `=`     | chanin            | `$#`       | yupay              |
| `:=`    | mana tikrakuq     | `$+`       | yapuy              |
| `>>`    | lluqsichiy        | `$-`       | qichuy             |
| `<<`    | yaykuchiy         | `$?`       | kan                |
| `¶`/`\` | muhu              | `$[s..e]`  | cortay             |
| `?`     | chiqapmi          | `$>`       | map                |
| `_?`    | icha              | `$\|`      | filter             |
| `_`     | mana / llapan     | `$<`       | reduce             |
| `??`    | match             | `!?`       | willachiy          |
| `@`     | muyuy             | `:!`       | hap'iy             |
| `@!`    | tukuchiy          | `:>`       | llapanpi           |
| `@>`    | rinqa             | `$!`       | pantaymi           |
| `->`    | lambda            | `$!!`      | pantay cachay      |
| `<~`    | kutimuy           | `#`        | módulo             |
| `\|>`   | pipe              | `#>`       | lluqsichiy         |
| `#1`    | chiqap            | `<#`       | yaykuchiy          |
| `#0`    | mana              | `::`       | módulo waqaychay   |

---

*Zymbol-Lang — Señal. Llapan. Mana Tikrakuq.*

---

> **Willakuy:** Kay qillqa rurasqa hinallataq t'ikrasqa artificial intelligence (IA) nisqawan.
> Llapan llamk'ay rurasqa chiqap kaptin, wakin t'ikray icha techapyrã pantay kapun.
> Cheqaq referencia: [Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
