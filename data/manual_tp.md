# lipu lili pi Zymbol-Lang

**Zymbol-Lang** li toki pi sitelen pi nasin sewi. ona li jo ala e nimi suli — ale li sitelen. ona li sama lon toki ale pi jan ale.

---

## nasin sona

- nimi suli li lon ala (`if`, `while`, `return` li lon ala — sitelen `?`, `@`, `<~` taso)
- Unicode ale — nimi kepeken toki ale anu emoji 👋
- toki-sama — lipu kama li sama lon toki ale

---

## nimi ante en nimi pi ante ala

```zymbol
x = 10           // nimi ante (ken ante)
PI := 3.14159    // nimi pi ante ala (ken ante ala — pakala lon ante)
nimi_ = "Ana"
lon_ = #1         // lon pi nasin toki
👋 := "toki"
```

### pana kulupu

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

## ale pi ijo

| ijo             | sama              | sitelen `#?` | toki                                |
|-----------------|-------------------|--------------|-------------------------------------|
| nanpa           | `42`, `-7`        | `###`        | nanpa 64-bit                        |
| nanpa lili      | `3.14`, `1.5e10`  | `##.`        | nasin pi sona pi mute OK            |
| nimi toki       | `"toki"`          | `##"`        | ante: `"toki {nimi_}"`              |
| sitelen wan     | `'A'`             | `##'`        | sitelen Unicode wan                 |
| lon/ala         | `#1`, `#0`        | `##?`        | nanpa 1 en 0 li sama ala           |
| kulupu          | `[1, 2, 3]`       | `##]`        | ijo ale li sama                     |
| kulupu mute     | `(a, b)`          | `##)`        | poka                                |
| kulupu nimi     | `(x: 1, y: 2)`    | `##)`        | ken kepeken nimi anu nanpa          |

---

## toki en kute

```zymbol
// toki — li pana ala e sike toki
>> "toki" ¶                     // ¶ anu \\ li pana e sike toki
>> "a=" a " b=" b ¶             // ijo mute kepeken poka
>> "ale=" pali(2, 3) ¶          // pali li ken lon poka ale
>> (arr$#) ¶                    // sitelen monsi li wile e poki

// kute
<< nimi_                        // kute ala — kute e nimi ante
<< "nimi sina li seme? " nimi_  // kepeken toki
```

> `¶` anu `\\` li sama lon sike toki.

---

## kipisi nimi

nasin toki tu wan — wan wan kepeken poka ona:

```zymbol
nimi_ = "Ana"
n = 25

// 1. kipisi — lon pana kepeken = anu :=
toki_ = "toki ", nimi_, "!"              // → toki Ana!
SULI := "jan: ", nimi_

// 2. poka — lon toki >>
>> "toki " nimi_ " sina nanpa " n ¶      // → toki Ana sina nanpa 25

// 3. ante — lon poka ale
toki2 = "toki {nimi_}, sina nanpa {n}"  // → toki Ana, sina nanpa 25
```

> **sona**: `+` li nanpa taso. kepeken nimi toki li pana e pakala lili.

---

## nasin tawa

```zymbol
x = 7

// ni wan
? x > 0 { >> "mute" ¶ }

// ni / anu ni / anu
? x > 100 {
    >> "mute suli" ¶
} _? x > 0 {
    >> "mute" ¶
} _? x == 0 {
    >> "ala" ¶
} _ {
    >> "lili" ¶
}
```

Poki `{ }` li **wile**, jaki kepeken linja wan.

---

## Match

```zymbol
// Match kepeken nanpa
nanpa_ = 85
pona_ = ?? nanpa_ {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> pona_ ¶    // → B

// Match kepeken nasin
seli = -5
lon2 = ?? seli {
    _? seli < 0  : "lete mute"
    _? seli < 20 : "lete"
    _? seli < 35 : "seli"
    _            : "seli mute"
}
>> lon2 ¶    // → lete mute

// Match kepeken nimi toki
kule = "loje"
nanpa2 = ?? kule {
    "loje"  : "#FF0000"
    "laso"  : "#00FF00"
    _       : "#000000"
}
>> nanpa2 ¶
```

---

## awen pali

```zymbol
// nanpa ale: 0..4 li pali 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// nanpa kepeken suli
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// nanpa monsi
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// awen (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// ijo ale lon kulupu
kili = ["kili pi loje", "kili pi jelo", "kili pi laso"]
@ f:kili { >> f ¶ }

// sitelen lon nimi toki
@ c:"toki" { >> c "-" }
>> ¶    // → t-o-k-i-

// awen ala en tawa
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> tawa
    ? i > 7 { @! }          // @! awen ala
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## pali

```zymbol
// pana en kepeken
pali_tu(a, b) { <~ a + b }
>> pali_tu(3, 4) ¶    // → 7

// pali sin sin
nanpa_pali(n) {
    ? n <= 1 { <~ 1 }
    <~ n * nanpa_pali(n - 1)
}
>> nanpa_pali(5) ¶    // → 120

// pali li jo e poka ona taso — ken ala jo e nimi pi insa ala
ale_ = 100
pali2() {
    x = 42    // insa taso
    <~ x
}
>> pali2() ¶    // → 42
```

> **sona**: pali kepeken nimi `nimi(params){ }` li ijo lili ala.
> kepeken e pana, kepeken: `x -> nimi(x)`.

---

## lambda en kulupu

```zymbol
// lambda lili (pana insa)
tu = x -> x * 2
ale2 = (a, b) -> a + b
>> tu(5) ¶    // → 10
>> ale2(3, 7) ¶   // → 10

// lambda kepeken poki (pana wan)
pali3 = x -> {
    ? x > 0 { <~ "mute" }
    _? x < 0 { <~ "lili" }
    <~ "ala"
}
>> pali3(5) ¶     // → mute
>> pali3(0) ¶     // → ala
>> pali3(-5) ¶    // → lili

// kulupu — lambda li jo e nimi pi insa
suli_ = 3
tu2 = x -> x * suli_    // jo e 'suli_'
>> tu2(7) ¶    // → 21

// pali pali
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// lambda lon kulupu nanpa
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## kulupu nanpa

```zymbol
arr = [10, 20, 30, 40, 50]

// jo (nanpa 0)
>> arr[0] ¶    // → 10

// mute (wile poki lon >>)
n = arr$#
>> (arr$#) ¶    // → 5

// pana, weka, lon, lili
arr = arr$+ 60               // pana
arr = arr$- 0                // weka nanpa 0
lon3 = arr$? 30              // → #1
lili2 = arr$[0..2]           // [20, 30]

// ante ijo
arr[1] = 99

// ijo ale
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` li pana e **kulupu sin** — pana: `arr = arr$+ 4`.
> pana ala mute: kepeken pana tu.

---

## kulupu mute

```zymbol
// kulupu nimi
jan_ = (nimi_: "Alice", tenpo: 25)
>> jan_.nimi_ ¶    // → Alice
>> jan_.tenpo ¶    // → 25
>> jan_[0] ¶       // → Alice (nanpa li pona kin)
```

---

## pali sewi

pali pi sewi li wile e **lambda insa** — nimi-lambda li ken ala.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
mute2 = nums$> (x -> x * 2)
>> mute2 ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
tu3 = nums$| (x -> x % 2 == 0)
>> tu3 ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (nanpa open, (kulupu, ijo) -> ijo)
ale3 = nums$< (0, (acc, x) -> acc + x)
>> ale3 ¶    // → 55
```

---

## pakala lawa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kipisi kepeken ala" ¶
} :! ##IO {
    >> "pakala pi lipu" ¶
} :! {
    >> "pakala ante: " _err ¶
} :> {
    >> "pali lon tenpo ale" ¶
}
```

| ijo         | tenpo                           |
|-------------|---------------------------------|
| `##Div`     | kipisi kepeken ala              |
| `##IO`      | lipu / ilo                      |
| `##Index`   | nanpa li weka                   |
| `##Type`    | ijo pakala                      |
| `##Parse`   | pakala pi lukin                 |
| `##Network` | pakala pi tomo pi sona          |
| `##_`       | pakala ale (jo ale)             |

---

## lipu

```zymbol
// lipu: lib/calc.zy
# calc

#> { pali_tu, get_PI }    // pana OPEN lon pali

_PI := 3.14159
pali_tu(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// lipu: main.zy
<# ./lib/calc <= c    // nimi wile

>> c::pali_tu(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

---

## pali ale: FizzBuzz

```zymbol
pali(nanpa) {
    ? nanpa % 15 == 0 { <~ "fizi-buzi" }
    _? nanpa % 3  == 0 { <~ "fizi" }
    _? nanpa % 5  == 0 { <~ "buzi" }
    _ { <~ nanpa }
}

@ i:1..20 { >> pali(i) ¶ }
```

---

## sitelen ale

| sitelen  | pali               | sitelen    | pali                  |
|----------|--------------------|------------|-----------------------|
| `=`      | nimi ante          | `$#`       | mute                  |
| `:=`     | nimi pi ante ala   | `$+`       | pana                  |
| `>>`     | toki               | `$-`       | weka (kepeken nanpa)  |
| `<<`     | kute               | `$?`       | lon                   |
| `¶`/`\`  | sike toki          | `$[s..e]`  | lili                  |
| `?`      | ni (if)            | `$>`       | map                   |
| `_?`     | anu ni (elif)      | `$\|`      | filter                |
| `_`      | anu / ijo ale      | `$<`       | reduce                |
| `??`     | match              | `!?`       | pali e (try)          |
| `@`      | awen pali          | `:!`       | jo e (catch)          |
| `@!`     | awen ala (break)   | `:>`       | tenpo ale (finally)   |
| `@>`     | tawa (continue)    | `$!`       | pakala lon            |
| `->`     | Lambda             | `$!!`      | pana e pakala         |
| `<~`     | pana (return)      | `#`        | pana nimi lipu        |
| `\|>`    | Pipo               | `#>`       | pana open             |
| `#1`     | lon                | `<#`       | jo e                  |
| `#0`     | ala                | `::`       | kepeken lipu          |

---

*Zymbol-Lang — sitelen. pi jan ale. ante ala.*

---

> **ijo sona:** lipu ni li pali e AI (jan sona ilo).
> jan li pali mute tawa ike ala, taso nimi ante anu sitelen li ken pakala.
> lipu pona li [lipu pi Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
