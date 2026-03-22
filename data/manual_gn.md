# Zymbol-Lang Mba'eporã Ñe'ẽ

**Zymbol-Lang** peteĩ ñe'ẽ jehaipyre ñe'ẽtee rupi. Ndoipuruséi moñe'ẽrã — peteĩva símbolo. Ojejapo porã ñe'ẽ opaichagua rupi.

---

## Mba'éichapa Oñemoñe'ẽ

- Ndaipori moñe'ẽrã (`if`, `while`, `return` ndaiporiséi — añoite símbolo `?`, `@`, `<~`)
- Unicode opaite — réra opaichagua ñe'ẽme térã emoji 👋
- Ñe'ẽ ndojeporúi — código peteĩ ñe'ẽ opaichagua rupi

---

## Mba'eporu ha Mba'e'ỹva

```zymbol
x = 10           // mba'eporu (ijykekóva)
PI := 3.14159    // mba'e'ỹva (ndijykekóiva — mba'e oĩ ramo ojeheka)
réra = "Ana"
ijoja = #1       // porã hete
👋 := "Maitei"
```

### Mba'eporu Mbohypy

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

## Mba'e Mba'eporu

| Mba'e          | Techapyrã           | Símbolo `#?` | Ñe'ẽporã                          |
|----------------|---------------------|--------------|-----------------------------------|
| Papapy         | `42`, `-7`          | `###`        | 64-bit                            |
| Papapy ñemi    | `3.14`, `1.5e10`    | `##.`        | Papapy pytũ ojeporúma             |
| Ñe'ẽ           | `"maitei"`          | `##"`        | Mbohapymi: `"Maitei {réra}"`      |
| Letra          | `'A'`               | `##'`        | Peteĩ letra Unicode               |
| Porã/Vai       | `#1`, `#0`          | `##?`        | NDOGUEREKÓVO papapy 1 ha 0        |
| Mba'epuru      | `[1, 2, 3]`         | `##]`        | Opaite mba'e peteĩ mba'e          |
| Tupla          | `(a, b)`            | `##)`        | Ñemoĩporã                         |
| Tupla réra     | `(x: 1, y: 2)`      | `##)`        | Ojeheka réra térã papapy rupi     |

---

## Moñe'ẽrã ha Mboheryrã

```zymbol
// Moñe'ẽrã — NDOIPORUSÉI ñenguerã pehẽngue ipype
>> "Maitei" ¶                    // ¶ térã \\ ojapo ñenguerã
>> "a=" a " b=" b ¶              // mba'e hetavéva juntepe
>> "mbohepy=" emboyke(2, 3) ¶    // ojeiporeka función ojapóva
>> (arr$#) ¶                     // postfix oñeikotevẽ paréntesis

// Mboheryrã
<< réra                          // ndaipori prompt — oike variable rupi
<< "Ne réra? " réra              // prompt ndive
```

> `¶` térã `\\` oñeikotevẽ ñenguerã.

---

## Ñe'ẽ Mbohasa

Mbohapy mba'e — opaite peteĩ apopyrã:

```zymbol
réra = "Ana"
n = 25

// 1. Kõma — mba'eporu = térã :=
moñe'ẽ = "Maitei ", réra, "!"          // → Maitei Ana!
TÉRA := "Oĩva: ", réra

// 2. Juntepeguaréta — moñe'ẽrã >>
>> "Maitei " réra " nde papapy " n ¶   // → Maitei Ana nde papapy 25

// 3. Mbohapymi — opaite apopyrãpe
porã = "Maitei {réra}, nde papapy {n}" // → Maitei Ana, nde papapy 25
```

> **Ñe'ẽporã**: `+` papapy añoite. Ñe'ẽ ndive ojapo jaikuaakuaáva.

---

## Mba'epy Ñemboguata

```zymbol
x = 7

// Porã añoite
? x > 0 { >> "mbatéva" ¶ }

// Porã / mba'e / vai
? x > 100 {
    >> "tuicha" ¶
} _? x > 0 {
    >> "mbatéva" ¶
} _? x == 0 {
    >> "nda'éi" ¶
} _ {
    >> "opáva" ¶
}
```

Bloque `{ }` **oñeikotevẽ** peteĩ línea añoite ramo avei.

---

## Match

```zymbol
// Match papapy jukuita
papapy = 85
grado = ?? papapy {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Match oñemboguata (mba'e opaichagua)
temp = -5
estado = ?? temp {
    _? temp < 0  : "yhy"
    _? temp < 20 : "ro'y"
    _? temp < 35 : "aku"
    _            : "akuhẽ"
}
>> estado ¶    // → yhy

// Match ñe'ẽ ndive
sa'y = "pytãvai"
código = ?? sa'y {
    "pytãvai" : "#FF0000"
    "hovyũ"   : "#00FF00"
    _         : "#000000"
}
>> código ¶
```

---

## Ñembojere

```zymbol
// Papapy jukuita: 0..4 oguata 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Papapy ñemboheta ndive
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Papapy oñemeẽva
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Peve (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Opaite mba'epe
yvyra = ["pakuri", "guavira", "yvapurũ"]
@ f:yvyra { >> f ¶ }

// Ñe'ẽ letra opavave
@ c:"maitei" { >> c "-" }
>> ¶    // → m-a-i-t-e-i-

// @! ha @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> oñeguata
    ? i > 7 { @! }          // @! opáva
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Función

```zymbol
// Mbohapy ha jeiporeka
emboyke(a, b) { <~ a + b }
>> emboyke(3, 4) ¶    // → 7

// Ñembohasa
mbohapymi(n) {
    ? n <= 1 { <~ 1 }
    <~ n * mbohapymi(n - 1)
}
>> mbohapymi(5) ¶    // → 120

// Función oĩva aparte — ndohecháiva variable ipýre
global = 100
japoru() {
    x = 42    // local añoite
    <~ x
}
>> japoru() ¶    // → 42
```

> **Ñe'ẽporã**: Función `réra(params){ }` ndaha'éi mba'e ñemoĩ.
> Ojejapokuévo argumento: `x -> réra(x)`.

---

## Lambda ha Closure

```zymbol
// Lambda mbykyvéva (oñemeẽ implícito)
mokõive = x -> x * 2
mboyke = (a, b) -> a + b
>> mokõive(5) ¶    // → 10
>> mboyke(3, 7) ¶  // → 10

// Lambda bloque ndive (oñemeẽ explícito)
ñemoñe = x -> {
    ? x > 0 { <~ "mbatéva" }
    _? x < 0 { <~ "opáva" }
    <~ "nda'éi"
}
>> ñemoñe(5) ¶     // → mbatéva
>> ñemoñe(0) ¶     // → nda'éi
>> ñemoñe(-5) ¶    // → opáva

// Closure — lambda oñangarekoséi variable ipýre
factor = 3
mbohapy = x -> x * factor    // oñangarekoséi 'factor'
>> mbohapy(7) ¶    // → 21

// Función ojapo función
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda mba'e ndive: oñeñotẽ array rupi
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Array

```zymbol
arr = [10, 20, 30, 40, 50]

// Ojeheka (0-based)
>> arr[0] ¶    // → 10

// Papapy (oñeikotevẽ paréntesis >>pe)
n = arr$#
>> (arr$#) ¶    // → 5

// Mbojupi, mboguete, jehekauka, slice
arr = arr$+ 60               // mbojupi
arr = arr$- 0                // mboguete índice 0
oĩ = arr$? 30                // → #1
trozo = arr$[0..2]           // [20, 30]

// Mboguata elemento
arr[1] = 99

// Opaite mba'epe
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` oñemeẽ **array pyahu** — oñembojupi: `arr = arr$+ 4`.
> Ndojejokóiva: mbohapy peteĩ ndive.

---

## Tupla

```zymbol
// Tupla réra ndive
ava = (réra: "Alice", ára: 25)
>> ava.réra ¶    // → Alice
>> ava.ára ¶     // → 25
>> ava[0] ¶      // → Alice (índice avei ojogua)
```

---

## Función Tuvicha

HOF operador oñeikotevẽ **lambda inline** — ndaha'éi variable lambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
mokõivéva = nums$> (x -> x * 2)
>> mokõivéva ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pares = nums$| (x -> x % 2 == 0)
>> pares ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (mba'e heta, (acc, elem) -> expr)
mboyke = nums$< (0, (acc, x) -> acc + x)
>> mboyke ¶    // → 55
```

---

## Mba'e Vai Ñangareko

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "papapy peguarã mbói" ¶
} :! ##IO {
    >> "IO mba'e vai" ¶
} :! {
    >> "mba'e vai: " _err ¶
} :> {
    >> "oguata opavave" ¶
}
```

| Mba'e       | Araka'e oiko           |
|-------------|------------------------|
| `##Div`     | Papapy peguarã mbói    |
| `##IO`      | Marandurenda / sistema |
| `##Index`   | Índice opáva           |
| `##Type`    | Mba'e vai              |
| `##Parse`   | Parsing                |
| `##Network` | Red mba'e vai          |
| `##_`       | Opaite mba'e vai       |

---

## Módulo

```zymbol
// Marandurenda: lib/calc.zy
# calc

#> { emboyke, get_PI }    // exportaciones ANTES definiciones

_PI := 3.14159
emboyke(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Marandurenda: main.zy
<# ./lib/calc <= c    // alias oñeikotevẽ

>> c::emboyke(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

---

## Techapyrã Oikoporã: FizzBuzz

```zymbol
moñeẽ(papapy) {
    ? papapy % 15 == 0 { <~ "PororóÑemuhũ" }
    _? papapy % 3  == 0 { <~ "Pororó" }
    _? papapy % 5  == 0 { <~ "Ñemuhũ" }
    _ { <~ papapy }
}

@ i:1..20 { >> moñeẽ(i) ¶ }
```

---

## Símbolo Rekotee

| Símbolo | Mba'épyguaréta    | Símbolo    | Mba'épyguaréta     |
|---------|-------------------|------------|--------------------|
| `=`     | mba'eporu         | `$#`       | papapy heta        |
| `:=`    | mba'e'ỹva         | `$+`       | mbojupi            |
| `>>`    | moñe'ẽrã          | `$-`       | mboguete           |
| `<<`    | mboheryrã         | `$?`       | oĩ                 |
| `¶`/`\` | ñenguerã          | `$[s..e]`  | trozo              |
| `?`     | porã              | `$>`       | map                |
| `_?`    | mba'e             | `$\|`      | filter             |
| `_`     | vai / opavave     | `$<`       | reduce             |
| `??`    | match             | `!?`       | japoru             |
| `@`     | ñembojere         | `:!`       | ñangarekouka       |
| `@!`    | opáva             | `:>`       | opavave            |
| `@>`    | oñeguata          | `$!`       | mba'e vai          |
| `->`    | lambda            | `$!!`      | mba'e vai mbohasa  |
| `<~`    | oñemeẽ            | `#`        | módulo             |
| `\|>`   | pipe              | `#>`       | exportar           |
| `#1`    | porã              | `<#`       | mbojupi            |
| `#0`    | vai               | `::`       | ojeiporeka         |

---

*Zymbol-Lang — Símbolo. Opavave. Ndijykekóiva.*

---

> **Marandu:** Ko mba'eporã ojapo ha omboñe'ẽ inteligencia artificial (IA).
> Ojejapo ikatupyry peve, upéicha peteĩ ñe'ẽ térã techapyrã ikatu oñembokyje.
> Referencia real: [Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
