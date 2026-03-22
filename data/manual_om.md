# Qajeelfama Gabaabaa Zymbol-Lang

**Zymbol-Lang** afaan sagantaa mallattoodhaan hojjatudha. Jechoota madda hin fayyadamu — hundinuu mallattoo dha. Afaan namaa kamiyyuu irratti tokkummaadhaan hojjata.

---

## Ogeessummaa

- Jechoota madda hin qabu (`if`, `while`, `return` hin jiran — mallattoo qofa `?`, `@`, `<~`)
- Unicode guutuu — maqaaleen afaan kamiyyuu yookaan emoji 👋 ta'uu danda'u
- Afaan-walaba — koodiin afaanota hundaaf tokkuma dha

---

## Jijjiiramtoota fi Wayyoomina

```zymbol
x = 10           // Jijjiiramaa (jijjiiramu danda'a)
PI := 3.14159    // Wayyoomina (hin jijjiiramu — dogoggora yoo irra-ramaddame)
maqaa = "Ana"
socho = #1       // boolean dhugaa
👋 := "Nagaa"
```

### Ramaddii Walitti Makame

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

## Gosa Odeeffannoo

| Gosa            | Fakkeenya           | Mallattoo `#?` | Yaadachiisa                         |
|-----------------|---------------------|----------------|-------------------------------------|
| Lakkoofsa guutuu| `42`, `-7`          | `###`          | Bit-64 mallattoo qabu               |
| Lakkoofsa kutaa | `3.14`, `1.5e10`    | `##.`          | Ibsituu saayinsaawaa OK             |
| Tarree arfii    | `"nagaa"`           | `##"`          | Interpolation: `"Nagaa {maqaa}"`    |
| Qubee           | `'A'`               | `##'`          | Qubee Unicode tokko                 |
| Boolean         | `#1`, `#0`          | `##?`          | LAKKOOFSOTA 1 fi 0 MITI             |
| Tarreeffamaa    | `[1, 2, 3]`         | `##]`          | Elemantota gosa tokkoo              |
| Tuupilii        | `(a, b)`            | `##)`          | Sadarkaan                           |
| Tuupilii maqaa  | `(x: 1, y: 2)`      | `##)`          | Maqaadhaan yookaan sadarkaadhaan    |

---

## Maddisiisuu fi Galchuu

```zymbol
// Maddisiisuu — sarara haaraa OFUMAAN hin ida'u
>> "Nagaa" ¶                      // ¶ yookaan \\ sarara haaraa ifaa kennuu
>> "a=" a " b=" b ¶               // gatii hedduu walitti qabamaan
>> "walitti=" qooduu(2, 3) ¶      // waamichi hojii bakka kamiyyuu
>> (arr$#) ¶                      // Operator postfix maxxansa barbaadu

// Galchuu
<< maqaa                          // kakaasu malee — jijjiiramaa keessa dubbisa
<< "Maqaa kee? " maqaa            // kakaasudhaan
```

> `¶` yookaan `\\` sarara haaraadhaan walqixa.

---

## Walitti Makuu Tarree Arfii

Foormiiwwan sadii sirrii — tokko tokkoon gahee isaa qaba:

```zymbol
maqaa = "Ana"
n = 25

// 1. Comma — ramaddii = yookaan := keessatti
msg = "Nagaa ", maqaa, "!"              // → Nagaa Ana!
MATAA := "Fayyadamaa: ", maqaa

// 2. Walitti qabama — maddisiisuu >> keessatti
>> "Nagaa " maqaa " si umriin " n ¶    // → Nagaa Ana si umriin 25

// 3. Interpolation — gahee kamiyyuu keessatti
ibsa = "Nagaa {maqaa}, umriin kee {n}"  // → Nagaa Ana, umriin kee 25
```

> **Yaadachiisa**: `+` lakkoofsota qoofaaf dha. Tarree arfii irratti gorsa uuma.

---

## To'annoo Dhangala'aa

```zymbol
x = 7

// Yoo qofa
? x > 0 { >> "mirkaa'aa" ¶ }

// Yoo / yoo_biroo / biroo
? x > 100 {
    >> "guddaa" ¶
} _? x > 0 {
    >> "mirkaa'aa" ¶
} _? x == 0 {
    >> "duwwaa" ¶
} _ {
    >> "manca'aa" ¶
}
```

Qaawwaa `{ }` **dirqama dha**, sarara tokko qofa ta'e illee.

---

## Match

```zymbol
// Match daangaadhaan
lakkoofsaa = 85
madaallii = ?? lakkoofsaa {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> madaallii ¶    // → B

// Match eegduu (haala kamiyyuu)
ho'a = -5
haala = ?? ho'a {
    _? ho'a < 0  : "Cabbii"
    _? ho'a < 20 : "qorraa"
    _? ho'a < 35 : "ho'aa"
    _            : "gubaa"
}
>> haala ¶    // → Cabbii

// Match tarree arfiitiin
halluu = "diimaa"
koodii = ?? halluu {
    "diimaa"  : "#FF0000"
    "magariisa": "#00FF00"
    _         : "#000000"
}
>> koodii ¶
```

---

## Duubee

```zymbol
// Daangaa hammataa: 0..4 → 0,1,2,3,4 itera
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Daangaa tartiibaan
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Daangaa garagalchaan
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Yeroo (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Elemanta tokkoo tokkoof
mi'a = ["Avookadoo", "Muuzii", "Maangoo"]
@ f:mi'a { >> f ¶ }

// Qubee tarree arfiitiin
@ c:"nagaa" { >> c "-" }
>> ¶    // → n-a-g-a-a-

// Break fi Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> itti fufi
    ? i > 7 { @! }          // @! addaan kuti
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Hojii

```zymbol
// Labsii fi waamichaa
qooduu(a, b) { <~ a + b }
>> qooduu(3, 4) ¶    // → 7

// Deebi'uu deebi'aa
heddummeessuu(n) {
    ? n <= 1 { <~ 1 }
    <~ n * heddummeessuu(n - 1)
}
>> heddummeessuu(5) ¶    // → 120

// Hojiin daangaa addaan bahu — jijjiiramtoota alaa hin argatu
adda = 100
qorannoo() {
    x = 42    // naannoo qofa
    <~ x
}
>> qorannoo() ¶    // → 42
```

> **Barbaachisaa**: Hojiiwwan maqaa `maqaa(params){ }` gatii sadarkaa-jalqabaa miti.
> Seensarratti dabarsuuf maxxansi: `x -> maqaa(x)`.

---

## Lambda fi Cufaa

```zymbol
// Lambda salphaa (deebi'uu hiddame)
lama = x -> x * 2
ida'uu = (a, b) -> a + b
>> lama(5) ¶      // → 10
>> ida'uu(3, 7) ¶  // → 10

// Lambda qaawwadhaan (deebi'uu ifaa)
qooduu = x -> {
    ? x > 0 { <~ "mirkaa'aa" }
    _? x < 0 { <~ "manca'aa" }
    <~ "duwwaa"
}
>> qooduu(5) ¶     // → mirkaa'aa
>> qooduu(0) ¶     // → duwwaa
>> qooduu(-5) ¶    // → manca'aa

// Cufaalee — Lambdaawwan jijjiiramtoota alaa qabatu
sababa = 3
sadii = x -> x * sababa    // 'sababa' qabate
>> sadii(7) ¶    // → 21

// Warshaa hojii
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdaawwan gatii ta'een: tarreeffamaa keessa kuufame
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Tarreeffamtoota

```zymbol
arr = [10, 20, 30, 40, 50]

// Argachuu (sadarkaa 0-irraa eegaluu)
>> arr[0] ¶    // → 10

// Dheerina (maxxansa >> keessatti barbaachisa)
n = arr$#
>> (arr$#) ¶    // → 5

// Ida'achuu, haaquun, qabachuu, kutuu
arr = arr$+ 60               // ida'achuu
arr = arr$- 0                // sadarkaa 0 haaqi
qaba = arr$? 30              // → #1
kutuu = arr$[0..2]           // [20, 30]

// Elemanta haaromsuu
arr[1] = 99

// Elemanta tokkoo tokkoof
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **tarreeffamaa haaraa** deebisu — irra-ramaddi: `arr = arr$+ 4`.
> Hin walqabsiisu: ramaddiiwwan lama adda fayyadami.

---

## Tuupilii

```zymbol
// Tuupilii maqaa
namaa = (maqaa: "Alice", umurii: 25)
>> namaa.maqaa ¶    // → Alice
>> namaa.umurii ¶   // → 25
>> namaa[0] ¶       // → Alice (sadarkaan ni hojjata)
```

---

## Hojii Sadarkaa Ol-aanaa

Operator HOF **Lambda inline** barbaadu — jijjiiramaa lambda kallattii miti.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
lamaa = nums$> (x -> x * 2)
>> lamaa ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
lakk = nums$| (x -> x % 2 == 0)
>> lakk ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (gatii jalqabaa, (kuufaa, elemantaa) -> ibsa)
waliigalaa = nums$< (0, (acc, x) -> acc + x)
>> waliigalaa ¶    // → 55
```

---

## Dogoggora Bulchuudhaan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Qooduu duwwaadhaan" ¶
} :! ##IO {
    >> "Dogoggora IO" ¶
} :! {
    >> "dogoggora biroo: " _err ¶
} :> {
    >> "yeroo hundaa hojjata" ¶
}
```

| Gosa        | Yeroo uumamu                    |
|-------------|---------------------------------|
| `##Div`     | Qooduu duwwaadhaan              |
| `##IO`      | Faayilii / Siistemii            |
| `##Index`   | Sadarkaan daangaa alaa          |
| `##Type`    | Dogoggora gosa                  |
| `##Parse`   | Dogoggora parse                 |
| `##Network` | Dogoggora network               |
| `##_`       | Dogoggora kamiyyuu (hunda qabi) |

---

## Moduulii

```zymbol
// Faayilii: lib/calc.zy
# calc

#> { qooduu, get_PI }    // Erguun DURSEE labsamuu dha

_PI := 3.14159
qooduu(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Faayilii: main.zy
<# ./lib/calc <= c    // Alias dirqama dha

>> c::qooduu(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Fakkeenya Guutuu: FizzBuzz

```zymbol
qooduu(lakkoofsaa) {
    ? lakkoofsaa % 15 == 0 { <~ "BofoduwWuuwuu" }
    _? lakkoofsaa % 3  == 0 { <~ "Bofoduu" }
    _? lakkoofsaa % 5  == 0 { <~ "Wuuwuu" }
    _ { <~ lakkoofsaa }
}

@ i:1..20 { >> qooduu(i) ¶ }
```

---

## Wabii Mallattoo

| Mallattoo | Hojii             | Mallattoo   | Hojii                   |
|-----------|-------------------|-------------|-------------------------|
| `=`       | Jijjiiramaa       | `$#`        | Dheerina                |
| `:=`      | Wayyoomina        | `$+`        | ida'achuu               |
| `>>`      | Maddisiisuu       | `$-`        | haaquun (sadarkaadhaan) |
| `<<`      | Galchuu           | `$?`        | qabachuu                |
| `¶`/`\`   | Sarara haaraa     | `$[s..e]`   | kutuu                   |
| `?`       | yoo (if)          | `$>`        | map                     |
| `_?`      | yoo_biroo (elif)  | `$\|`       | filter                  |
| `_`       | biroo / bakkaa    | `$<`        | reduce                  |
| `??`      | match             | `!?`        | yaali (try)             |
| `@`       | duubee (loop)     | `:!`        | qabi (catch)            |
| `@!`      | addaan kuti       | `:>`        | yeroo hundaa (finally)  |
| `@>`      | itti fufi         | `$!`        | dogoggora dha           |
| `->`      | Lambda            | `$!!`       | dogoggora dabarsuu      |
| `<~`      | deebi'i           | `#`         | moduulii labsi          |
| `\|>`     | Pipe              | `#>`        | erguu                   |
| `#1`      | dhugaa            | `<#`        | galchuu                 |
| `#0`      | soba              | `::`        | moduulii waamuu         |

---

*Zymbol-Lang — Mallattoodhaan. Waliigalaan. Yeroo hundaa.*

---

> **Yaadachiisa:** Barruun kun Ogummaa Namtolcheen (AI) uumamee fi hiikame.
> Sirrummaa mirkaneessuuf hojiin hundi godhamee jira, garuu hiikkaa tokko tokko yookaan fakkeenya dogoggora qabaachuu danda'u.
> Wabiin murtaa'aan [Diriirsa Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web) dha.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
