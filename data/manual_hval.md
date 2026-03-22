# Zymbol-Lang Dovaogēdy Sȳrior

**Zymbol-Lang** issa ānogar glaeson hen tymptir. Bē udra kostilus — iemnon issa ānogar. Issa sȳz hen bantis udra ēngos.

---

## Sȳrys

- Daor udra (`if`, `while`, `return` kostus daor — ānogar `?`, `@`, `<~`)
- Unicode sȳz — zȳha ēngos iemnon, emoji 👋
- Ēngos-daor — glaeson idh issa bantis ēngo

---

## Issa bal Morghūlis

```zymbol
x = 10           // issa (gaomagon)
PI := 3.14159    // morghūlis (daor gaomagon — sȳz lo gaomagon)
brōzi = "Ana"
elek_ = #1       // iksan vala
👋 := "Rytsas"
```

### Tymagon Issa

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

## Bantis Udra

| Bantis       | Naas              | Ānogar `#?` | Nynir                              |
|--------------|-------------------|-------------|-------------------------------------|
| Lentor       | `42`, `-7`        | `###`       | 64-bit                              |
| Lentor mēre  | `3.14`, `1.5e10`  | `##.`       | Bantis naas OK                      |
| Udra         | `"rytsas"`        | `##"`       | Bora: `"Rytsas {brōzi}"`            |
| Tebec Mēre   | `'A'`             | `##'`       | Mēre Unicode tebec                  |
| Iksan/Daor  | `#1`, `#0`        | `##?`       | Daor lentor mēre                    |
| Glaeson      | `[1, 2, 3]`       | `##]`       | Bantis iemnon nan                   |
| Tuple        | `(a, b)`          | `##)`       | Gaomagon                            |
| Brōzi Tuple  | `(x: 1, y: 2)`    | `##)`       | Brōzi iemnon lentor                 |

---

## Gevives bal Ūndegon

```zymbol
// Gevives — daor borarir tebec
>> "Rytsas" ¶                   // ¶ bal \\ borarir tebec
>> "a=" a " b=" b ¶             // sȳrys lentor — gaomagon
>> "lentor=" tymagon(2, 3) ¶    // ānogar iemnon gaomagon
>> (arr$#) ¶                    // ānogar lentor poQlu'

// Ūndegon
<< brōzi                        // daor tebec — ūndegon issa
<< "Ñuha brōzi? " brōzi         // bal tebec
```

> `¶` bal `\\` — nan tebec tebec.

---

## Udra Boq

Tȳni bantis — iemnon gaomagon:

```zymbol
brōzi = "Ana"
n = 25

// 1. Comma — issa = bal :=
tebec2 = "Rytsas ", brōzi, "!"          // → Rytsas Ana!
ZALDRĪZES := "Vala: ", brōzi

// 2. Gaomagon — gevives >>
>> "Rytsas " brōzi " issa lentor " n ¶  // → Rytsas Ana issa lentor 25

// 3. Bora — iemnon gaomagon
naas2 = "Rytsas {brōzi}, issa lentor {n}" // → Rytsas Ana, issa lentor 25
```

> **Nynir**: `+` lentor tebec. Udra — sȳz.

---

## Lo Daor

```zymbol
x = 7

// Mēre lo
? x > 0 { >> "iksan" ¶ }

// Lo / lo-daor / daor
? x > 100 {
    >> "bantis" ¶
} _? x > 0 {
    >> "iksan" ¶
} _? x == 0 {
    >> "daor" ¶
} _ {
    >> "dōna" ¶
}
```

`{ }` — **poQlu'**, mēre tebec.

---

## Match

```zymbol
// Match lentor
lentor2 = 85
patlh = ?? lentor2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match sōnar (iemnon lo)
temp = -5
ind = ?? temp {
    _? temp < 0  : "jēdar"
    _? temp < 20 : "bōsa"
    _? temp < 35 : "sȳndroti"
    _            : "perzys"
}
>> ind ¶    // → jēdar

// Match udra
perzys = "sētebagon"
kode = ?? perzys {
    "sētebagon" : "#FF0000"
    "vēttir"    : "#00FF00"
    _           : "#000000"
}
>> kode ¶
```

---

## Kostagon

```zymbol
// Naná: 0..4 — 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Lentor bal kostagon
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Bic kostagon
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Sōvēs (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Iemnon glaeson
zaldrīzes = ["zaldrizoti", "dōnior", "perzys"]
@ f:zaldrīzes { >> f ¶ }

// Tebec tebec
@ c:"valar" { >> c "-" }
>> ¶    // → v-a-l-a-r-

// Ūbagon bal Kostagon
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> kostagon
    ? i > 7 { @! }          // @! ūbagon
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Ānogar

```zymbol
// Gaomagon bal ānogar
tubagon(a, b) { <~ a + b }
>> tubagon(3, 4) ¶    // → 7

// Sȳndror
lentoraānogar(n) {
    ? n <= 1 { <~ 1 }
    <~ n * lentoraānogar(n - 1)
}
>> lentoraānogar(5) ¶    // → 120

// Ānogar — daor ūndegon andë issa
_Valyria = 100
ȳdrassagon() {
    x = 42    // mēre
    <~ x
}
>> ȳdrassagon() ¶    // → 42
```

> **Sȳz**: Brōzi ānogar `brōzi(params){ }` — daor mēre lentor.
> Bora nob — gaomagon: `x -> brōzi(x)`.

---

## Lambda bal Karyai

```zymbol
// Mēre lambda (bora)
lanta = x -> x * 2
tubagon2 = (a, b) -> a + b
>> lanta(5) ¶     // → 10
>> tubagon2(3, 7) ¶ // → 10

// Lambda glaeson (naná bora)
tymagon2 = x -> {
    ? x > 0 { <~ "iksan" }
    _? x < 0 { <~ "dōna" }
    <~ "daor" }
>> tymagon2(5) ¶     // → iksan
>> tymagon2(0) ¶     // → daor
>> tymagon2(-5) ¶    // → dōna

// Karyai — lambda issa andë lentor
factor = 3
tȳni = x -> x * factor    // issa 'factor'
>> tȳni(7) ¶    // → 21

// Ānogar gaomagon
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda lentor: glaeson
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Glaeson

```zymbol
arr = [10, 20, 30, 40, 50]

// Ūndegon (0 lentor)
>> arr[0] ¶    // → 10

// Bantis (poQlu' >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Tubagon, teq, issa, mēre
arr = arr$+ 60               // tubagon
arr = arr$- 0                // teq 0
issa2 = arr$? 30             // → #1
mēre2 = arr$[0..2]           // [20, 30]

// Gaomagon lentor
arr[1] = 99

// Iemnon lentor
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **naur glaeson** — issa: `arr = arr$+ 4`.
> Daor tanc: lanta issa.

---

## Tuple

```zymbol
// Brōzi tuple
vala = (brōzi: "Alice", ābre: 25)
>> vala.brōzi ¶    // → Alice
>> vala.ābre ¶     // → 25
>> vala[0] ¶       // → Alice (lentor issa)
```

---

## Ānogar Bantis

HOF — **mēre lambda** — daor lambda lentor.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
lanta2 = nums$> (x -> x * 2)
>> lanta2 ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
tȳni2 = nums$| (x -> x % 2 == 0)
>> tȳni2 ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (bora lentor, (tubagon, lentor) -> moj)
naas3 = nums$< (0, (acc, x) -> acc + x)
>> naas3 ¶    // → 55
```

---

## Sōvēs Sȳz

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "daor lentor" ¶
} :! ##IO {
    >> "IO sōvēs" ¶
} :! {
    >> "sōvēs: " _err ¶
} :> {
    >> "iemnon lúm" ¶
}
```

| Bantis      | Lo                             |
|-------------|--------------------------------|
| `##Div`     | Daor lentor                    |
| `##IO`      | Udra / valyria                 |
| `##Index`   | Lentor andë                    |
| `##Type`    | Bantis sōvēs                   |
| `##Parse`   | Gaomagon sōvēs                 |
| `##Network` | Tengwë sōvēs                   |
| `##_`       | Iemnon sōvēs                   |

---

## Valyria

```zymbol
// Udra: lib/calc.zy
# calc

#> { tubagon, get_PI }    // Nob MĒRE

_PI := 3.14159
tubagon(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Udra: main.zy
<# ./lib/calc <= c    // Brōzi poQlu'

>> c::tubagon(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

---

## Iemnon Ānogar: FizzBuzz

```zymbol
tymagon(lentor) {
    ? lentor % 15 == 0 { <~ "DracarysValar" }
    _? lentor % 3  == 0 { <~ "Dracarys" }
    _? lentor % 5  == 0 { <~ "Valar" }
    _ { <~ lentor }
}

@ i:1..20 { >> tymagon(i) ¶ }
```

---

## Ānogar Tirë

| Ānogar   | Moj                | Ānogar     | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | issa               | `$#`       | bantis                |
| `:=`     | morghūlis          | `$+`       | tubagon               |
| `>>`     | gevives            | `$-`       | teq (lentor)          |
| `<<`     | ūndegon            | `$?`       | issa                  |
| `¶`/`\`  | tebec tebec        | `$[s..e]`  | mēre                  |
| `?`      | lo (if)            | `$>`       | map                   |
| `_?`     | lo-daor (elif)     | `$\|`      | filter                |
| `_`      | daor / iemnon      | `$<`       | reduce                |
| `??`     | match              | `!?`       | ȳdrassagon (try)      |
| `@`      | kostagon           | `:!`       | karyai (catch)        |
| `@!`     | ūbagon (break)     | `:>`       | iemnon (finally)      |
| `@>`     | kostagon daur      | `$!`       | sōvēs issa            |
| `->`     | Lambda             | `$!!`      | sōvēs gevives         |
| `<~`     | tubagon            | `#`        | valyria brōzi         |
| `\|>`    | Pipe               | `#>`       | nob                   |
| `#1`     | iksan              | `<#`       | ūndegon               |
| `#0`     | daor               | `::`       | valyria ānogar        |

---

*Zymbol-Lang — Ānogar. Bantis. Daor gaomagon.*

---

> **Nynir:** Dovaogēdy issa carna bal gevives AI (sȳz ānogar).
> Iemnon carna issa, mēpsa tȳni udra bal ānogar sōvēs.
> Kēlio dovaogēdy [Zymbol-Lang bantis](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
