# Zymbol-Lang Sɛbɛnni Guekoro

**Zymbol-Lang** ye kumakan ye min bɛ sɛbɛn ka kɛ ni tiilenw ye. A tɛ baara kan kɛ — bɛɛ ye tiilen. A bɛ kɛ fɔlɔ ɲɔgɔn ye kanw bɛɛ la.

---

## Miiriya

- Baara kan tɛ yen (`if`, `while`, `return` tɛ yen — tiilenw dɔrɔn `?`, `@`, `<~`)
- Unicode tilennin — tɔgɔw kɛ kan o kan walima emoji 👋
- Kan bɛɛ kɛlen — code kɛlen do kanw bɛɛ la

---

## Nɔmɔrɔw ni Waatilenw

```zymbol
x = 10           // Nɔmɔrɔ (se ka yɛlɛma)
PI := 3.14159    // Waatilen (tɛ se ka yɛlɛma — ni a fɔlen tun ka yɛlɛma, fili bɛ kɛ)
tɔgɔ = "Ana"
aw = #1          // boole tiɲɛ
👋 := "I ni ce"
```

### Ɲɔgɔn Sɛbɛn

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

## Kunnafoniw Sugu

| Suguba          | Misali              | Tiilen `#?` | Kunnafoni                           |
|-----------------|---------------------|-------------|-------------------------------------|
| Jate tilennen   | `42`, `-7`          | `###`       | 64-Bit signed                       |
| Jate fɛnfɛnnen  | `3.14`, `1.5e10`    | `##.`       | Kɛfɔlen siɲɛ sɛbɛn OK              |
| Kumakan         | `"i ni ce"`         | `##"`       | Jɔyɔrɔ: `"I ni ce {tɔgɔ}"`        |
| Sɛbɛn kelen     | `'A'`               | `##'`       | Unicode sɛbɛn kelen                 |
| Boole           | `#1`, `#0`          | `##?`       | Jate 1 ni 0 TƐ                      |
| Array           | `[1, 2, 3]`         | `##]`       | Fɛnw bɛɛ suguba kelen              |
| Tupil           | `(a, b)`            | `##)`       | Yɔrɔ kɔnɔ                          |
| Tupil tɔgɔlen   | `(x: 1, y: 2)`      | `##)`       | Se ka sɔrɔ tɔgɔ walima jate ni    |

---

## Bɔ ni Don

```zymbol
// Bɔ — Sariya lafilenw TƐ a la dɔrɔn
>> "I ni ce" ¶                      // ¶ walima \\ bɛ sariya lafilenw di
>> "a=" a " b=" b ¶                 // Kunnafoni caaman ɲɔgɔn kɔnɔ
>> "jatelasɛgɛn=" sɛgɛsɛgɛ(2, 3) ¶  // Baaraw dɔrɔn yɔrɔ o yɔrɔ
>> (arr$#) ¶                        // Postfix tiilenw bi gɛrɛfɛn dɔrɔn

// Don
<< tɔgɔ                            // Fɛndi tɛ — kɔnɔ yɔrɔ la bɛ kalan
<< "I tɔgɔ? " tɔgɔ                 // Ni fɛndi ye
```

> `¶` walima `\\` bɛ kɛ kelen ye sariya lafilenw kama.

---

## Kumaw Bɛɛlafili

Fɔrɔ bisaba dɔrɔnw tilen — o bɛɛ ni a yɔrɔ:

```zymbol
tɔgɔ = "Ana"
n = 25

// 1. Zapiya — Fɛn dilan la = walima :=
msg = "I ni ce ", tɔgɔ, "!"               // → I ni ce Ana!
ƝƆGƆN := "Mɔgɔ: ", tɔgɔ

// 2. Ɲɔgɔn kɔnɔ — bɔ la >>
>> "I ni ce " tɔgɔ " e ye " n ¶           // → I ni ce Ana e ye 25

// 3. Jɔyɔrɔ — Yɔrɔ o yɔrɔ
kɔlɔsi = "I ni ce {tɔgɔ}, e ye {n}"      // → I ni ce Ana, e ye 25
```

> **Kunnafoni**: `+` bɛ kɛ jatew dɔrɔn ye. Kumakaw la, kɔlɔsi bɛ sɔrɔ.

---

## Talikɛlaw

```zymbol
x = 7

// ? Fɔlɔ
? x > 0 { >> "ɲɔgɔn" ¶ }

// ? / _? / _
? x > 100 {
    >> "ba" ¶
} _? x > 0 {
    >> "ɲɔgɔn" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "nɔgɔnin" ¶
}
```

Dabaliw `{ }` **wajibi don**, fiɲɛ kelen bɛ na tuma bɛɛ.

---

## Match

```zymbol
// Match ni yɔrɔw ye
kunnafoniw = 85
baaraden = ?? kunnafoniw {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> baaraden ¶    // → B

// Match ni sariyaw ye (siragataw o siragata)
temp = -5
cogoyɔrɔ = ?? temp {
    _? temp < 0  : "kongolo"
    _? temp < 20 : "jɛni"
    _? temp < 35 : "teliman"
    _            : "tiɲɛ"
}
>> cogoyɔrɔ ¶    // → kongolo

// Match ni kumakaw ye
kulɛ = "ja"
code = ?? kulɛ {
    "ja"    : "#FF0000"
    "gwɛ"   : "#00FF00"
    _       : "#000000"
}
>> code ¶
```

---

## Sirilimaw

```zymbol
// Yɔrɔ kɔnɔ: 0..4 bɛ kɛ 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Yɔrɔ ni gafe ye
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Yɔrɔ segin kɔ
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Ni waati (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Fɛnw bɛɛ kama
furu = ["Mango", "Nɛrɛ", "Tulu"]
@ f:furu { >> f ¶ }

// Kumakan sɛbɛnw kama
@ c:"i ni ce" { >> c "-" }
>> ¶    // → i-  -n-i-  -c-e-

// @! ni @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> taa ɲɔgɔn
    ? i > 7 { @! }          // @! dɔgɔtɔ
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Baaraw

```zymbol
// Fɔlɔ don ni wele
sɛgɛsɛgɛ(a, b) { <~ a + b }
>> sɛgɛsɛgɛ(3, 4) ¶    // → 7

// Segin kɔ
mɔgɔjate(n) {
    ? n <= 1 { <~ 1 }
    <~ n * mɔgɔjate(n - 1)
}
>> mɔgɔjate(5) ¶    // → 120

// Baaraw bɛ yɔrɔ wɛrɛ kɔnɔ — tɛ se ka kunnafoniw cɛkɔrɔw sɔrɔ
global = 100
sɛbɛnni() {
    x = 42    // yɔrɔ kelen dɔrɔn
    <~ x
}
>> sɛbɛnni() ¶    // → 42
```

> **Wajibi**: Baaraw tɔgɔlen `tɔgɔ(params){ }` tɛ kɛ fɛn fɔlɔ ye.
> Ka di kuma kama: `x -> tɔgɔ(x)`.

---

## Lambda ni Tɔnw

```zymbol
// Lambda fɛnfɛnnen (segin tɛ ka fɔ)
fila = x -> x * 2
lajɛlen = (a, b) -> a + b
>> fila(5) ¶    // → 10
>> lajɛlen(3, 7) ¶   // → 10

// Lambda ni dabali ye (segin ka fɔ)
baarakɛ = x -> {
    ? x > 0 { <~ "ɲɔgɔn" }
    _? x < 0 { <~ "nɔgɔnin" }
    <~ "nul"
}
>> baarakɛ(5) ¶     // → ɲɔgɔn
>> baarakɛ(0) ¶     // → nul
>> baarakɛ(-5) ¶    // → nɔgɔnin

// Tɔnw — Lambdaw bɛ kunnafoniw cɛkɔrɔw sɔrɔ
factor = 3
saba = x -> x * factor    // 'factor' sɔrɔlen
>> saba(7) ¶    // → 21

// Baara dilan
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdaw kɛ fɛn ye: bɛ bila array la
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Siraw

```zymbol
arr = [10, 20, 30, 40, 50]

// Sɔrɔ (0 kɔnɔ)
>> arr[0] ¶    // → 10

// Jatelɔn (gɛrɛfɛn >> la wajibi)
n = arr$#
>> (arr$#) ¶    // → 5

// Fara kan, bɔ, bɛ yen, gɛrɛfɛn
arr = arr$+ 60               // fara kan
arr = arr$- 0                // 0 bɔ
bɛ = arr$? 30                // → #1
gɛrɛfɛn = arr$[0..2]         // [20, 30]

// Fɛn yɛlɛma
arr[1] = 99

// Fɛnw bɛɛ kama
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` bɛ array **kura** di — ka segin kɔ: `arr = arr$+ 4`.
> Tɛ se ka ɲɔgɔn kɔnɔ: Fɛn dilan fila wɛrɛ wɛrɛ la kɛ.

---

## Tupilw

```zymbol
// Tupil tɔgɔlen
mɔgɔ = (tɔgɔ: "Alice", saan: 25)
>> mɔgɔ.tɔgɔ ¶    // → Alice
>> mɔgɔ.saan ¶    // → 25
>> mɔgɔ[0] ¶      // → Alice (jate ni bɛ baara kɛ)
```

---

## Baaraw Kɔrɔbaw

HOF tiilenw bi **lambda inline** — Lambda yɔrɔ tɛ ka kɛ.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
filalen = nums$> (x -> x * 2)
>> filalen ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
ɲɔgɔnw = nums$| (x -> x % 2 == 0)
>> ɲɔgɔnw ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (Jate fɔlɔ, (acc, fɛn) -> kuma)
lajɛ = nums$< (0, (acc, x) -> acc + x)
>> lajɛ ¶    // → 55
```

---

## Fili Mara

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Kɔrɔtalen bila nul la" ¶
} :! ##IO {
    >> "IO fili" ¶
} :! {
    >> "fili wɛrɛ: " _err ¶
} :> {
    >> "tuma bɛɛ bɛ bɔ" ¶
}
```

| Suguba      | Tuma min              |
|-------------|----------------------|
| `##Div`     | Kɔrɔtalen bila nul la |
| `##IO`      | Dosiye / Baara        |
| `##Index`   | Jate tɛ yɔrɔ la      |
| `##Type`    | Suguba fili           |
| `##Parse`   | Kalan fili            |
| `##Network` | Interneti fili        |
| `##_`       | Fili o fili (bɛɛ)     |

---

## Modiilw

```zymbol
// Dosiye: lib/calc.zy
# calc

#> { sɛgɛsɛgɛ, get_PI }    // Bɔ tiilenw KALANDEN don k'a ɲɛsin dafaliw ma

_PI := 3.14159
sɛgɛsɛgɛ(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Dosiye: main.zy
<# ./lib/calc <= c    // Alias wajibi

>> c::sɛgɛsɛgɛ(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                  // → 3.14159
```

---

## Misali Tilennen: FizzBuzz

```zymbol
sɛgɛsɛgɛ(jate) {
    ? jate % 15 == 0 { <~ "FiziFilɛBuzuFilɛ" }
    _? jate % 3  == 0 { <~ "FiziFilɛ" }
    _? jate % 5  == 0 { <~ "BuzuFilɛ" }
    _ { <~ jate }
}
@ i:1..20 { >> sɛgɛsɛgɛ(i) ¶ }
```

---

## Tiilenw Waleliw

| Tiilen  | Baara              | Tiilen     | Baara                 |
|---------|--------------------|------------|-----------------------|
| `=`     | Nɔmɔrɔ            | `$#`       | Jatelɔn               |
| `:=`    | Waatilen           | `$+`       | Fara kan              |
| `>>`    | Bɔ                 | `$-`       | Bɔ (jate ni)          |
| `<<`    | Don                | `$?`       | Bɛ yen                |
| `¶`/`\` | Sariya lafilenw    | `$[s..e]`  | Gɛrɛfɛn               |
| `?`     | ? (if)             | `$>`       | map                   |
| `_?`    | _? (elif)          | `$\|`      | filter                |
| `_`     | _ / yɔrɔ           | `$<`       | reduce                |
| `??`    | match              | `!?`       | sɛbɛn (try)           |
| `@`     | Sirilikɛ           | `:!`       | minɛ (catch)          |
| `@!`    | Dɔgɔtɔ (break)     | `:>`       | tuma bɛɛ (finally)    |
| `@>`    | Taa ɲɔgɔn          | `$!`       | fili ye wa            |
| `->`    | Lambda             | `$!!`      | fili nɛnɛ             |
| `<~`    | Segin kɔ           | `#`        | Modiil sɛbɛn          |
| `\|>`   | Pipe               | `#>`       | bɔ                    |
| `#1`    | tiɲɛ               | `<#`       | don                   |
| `#0`    | galon              | `::`       | Modiil wele           |

---

*Zymbol-Lang — Tiilen. Kan Bɛɛ. Kelen.*

---

> **Kunnafoni:** Sɛbɛnni nin ye AI (segin hakili) ye min sɛbɛnna ani u wilila.
> Tilennen kɛra ka kɛ, nga mɔgɔ dɔw ka wilili walima misaaliw bɛ se ka fili kɛ.
> Jɔyɔrɔ tilennen ye [Zymbol-Lang dafali](https://github.com/OscarEEspinozaB/zymbol-lang-web) ye.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
