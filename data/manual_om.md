# Qajeelfama Gabaabaa Zymbol-Lang

**Zymbol-Lang** afaan sagantaa mallattoodhaan hojjatudha. Jechoota madda hin fayyadamu — hundinuu mallattoo dha. Afaan namaa kamiyyuu irratti tokkummaadhaan hojjata.

- Jechoota madda hin qabu (`if`, `while`, `return` hin jiran — mallattoo qofa `?`, `@`, `<~`)
- Unicode guutuu — maqaaleen afaan kamiyyuu yookaan emoji 👋 ta'uu danda'u
- Afaan-walaba — koodiin afaanota hundaaf tokkuma dha

---

## Jijjiiramtoota fi Wayyoomina

```zymbol
x = 10              // Jijjiiramaa (jijjiiramu danda'a)
PI := 3.14159       // Wayyoomina — dogoggora yoo irra-ramaddame
maqaa = "Ana"
socho = #1          // boolean dhugaa
👋 := "Nagaa"
```

```zymbol
x = 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++       // 5
x--       // 4
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

```zymbol
// Gosa sakatta'uu — (gosa, lakkoofsa, gatii) deebisa
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Maddisiisuu fi Galchuu

```zymbol
>> "Nagaa" ¶                      // ¶ yookaan \\ sarara haaraa ifaa kennuu
>> "a=" a " b=" b ¶               // gatii hedduu walitti qabamaan
>> (arr$#) ¶                      // Operator postfix maxxansa barbaadu

<< maqaa                          // kakaasu malee — jijjiiramaa keessa dubbisa
<< "Maqaa kee? " maqaa            // kakaasudhaan
```

> `¶` yookaan `\\` sarara haaraadhaan walqixa.

---

## Hojjechiisota

```zymbol
// Lakkoofsa — ramaddii fayyadami; hojjechiisoti tokko tokko >> keessatti hariiroo garaagarummaa qabu
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (qooduu lakkoofsa guutuu)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (humna)

// Wal-bira-qabii
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Loojikii
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Tarree Qubee

```zymbol
// Foormiiwwan sadii walitti makuu
maqaa = "Ana"
n = 42

msg = "Nagaa ", maqaa, "!"               // Comma — ramaddii keessatti
>> "Nagaa " maqaa " si umriin " n ¶      // walitti qabama — maddisiisuu >>
ibsa = "Nagaa {maqaa}, umriin kee {n}"   // Interpolation — gahee kamiyyuu keessatti
```

```zymbol
s = "Nagaa Adduunyaa"
len = s$#                  // 13
sub = s$[0..5]             // "Nagaa"  (dhumti hin hammatiin)
has = s$? "Adduunyaa"      // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "NAgAA AdduunyAA"
rep1 = s$~~["a":"A":1]     // "NAgaa Adduunyaa"  (N koo jalqabaa qofa)
```

> `+` lakkoofsota qoofaaf dha. Tarree arfii `,`፣ walitti qabama, yookaan interpolation fayyadami.

---

## To'annoo Dhangala'aa

```zymbol
x = 7

? x > 0 { >> "mirkaa'aa" ¶ }

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

> Qaawwaa `{ }` **dirqama dha**, sarara tokko qofa ta'e illee.

---

## Match

```zymbol
// Daangaawwan
lakkoofsaa = 85
madaallii = ?? lakkoofsaa {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> madaallii ¶    // → B

// Tarree arfii
halluu = "diimaa"
koodii = ?? halluu {
    "diimaa"  : "#FF0000"
    "magariisa": "#00FF00"
    _         : "#000000"
}

// Eegduu
ho'a = -5
haala = ?? ho'a {
    _? ho'a < 0  : "Cabbii"
    _? ho'a < 20 : "qorraa"
    _? ho'a < 35 : "ho'aa"
    _            : "gubaa"
}
>> haala ¶    // → Cabbii

// Qaabni ibsa (gacmawwan qaawwaa)
?? n {
    0       : { >> "duwwaa" ¶ }
    _? n < 0: { >> "manca'aa" ¶ }
    _       : { >> "mirkaa'aa" ¶ }
}
```

---

## Duubee

```zymbol
@ i:0..4  { >> i " " }        // daangaa hammataa: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tartiibaan: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // garagalchaan: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (yeroo)

mi'a = ["Avookadoo", "Muuzii", "Maangoo"]
@ f:mi'a { >> f ¶ }

@ c:"nagaa" { >> c "-" }
>> ¶                          // → n-a-g-a-a-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> itti fufi
    ? i > 7 { @! }             // @! addaan kuti
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Duubee dhumna hin qabne
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Duubee maqaa qabuu (addaan kutuu gadi-fageenyaa)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Hojii

```zymbol
qooduu(a, b) { <~ a + b }
>> qooduu(3, 4) ¶    // → 7

heddummeessuu(n) {
    ? n <= 1 { <~ 1 }
    <~ n * heddummeessuu(n - 1)
}
>> heddummeessuu(5) ¶    // → 120
```

Hojiiwwan **daangaa addaan bahu** qabu — jijjiiramtoota alaa hin argatu. Jijjiiramtoota waamaa jijjiiruuf `<~` fayyadami:

```zymbol
jijjiiri(a<~, b<~) {
    yeroo_gabaabaa = a
    a = b
    b = yeroo_gabaabaa
}
x = 10
y = 20
jijjiiri(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Hojiiwwan maqaa `maqaa(params){ }` gatii sadarkaa-jalqabaa miti. Seensarratti dabarsuuf maxxansi: `x -> maqaa(x)`.

---

## Lambda fi Cufaa

```zymbol
lama = x -> x * 2
ida'uu = (a, b) -> a + b
>> lama(5) ¶      // → 10
>> ida'uu(3, 7) ¶  // → 10

// Lambda qaawwadhaan
qooduu = x -> {
    ? x > 0 { <~ "mirkaa'aa" }
    _? x < 0 { <~ "manca'aa" }
    <~ "duwwaa"
}

// Cufaalee — Lambdaawwan jijjiiramtoota alaa qabatu
sababa = 3
sadii = x -> x * sababa
>> sadii(7) ¶    // → 21

// Warshaa hojii
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Tarreeffamaa keessatti
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Tarreeffamtoota

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — argachuu (sadarkaa 0-irraa)
arr[-1]         // 5 — sadarkaa tasa (dhumtii)
arr$#           // 5 — dheerina (maxxansa >> keessatti barbaachisa)

arr = arr$+ 6            // ida'achuu → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sadarkaa 2 keessatti galchuu
arr3 = arr$- 3           // gatii jalqabaa haaquun
arr4 = arr$-- 3          // hundumaa haaquun
arr5 = arr$-[0]          // sadarkaa haaquun
arr6 = arr$-[1..3]       // daangaa haaquun (dhumti hin hammatiin)

qaba = arr$? 3            // #1 — qabachuu
pos = arr$?? 3            // [2] — sadarkaalee hunda
kutuu = arr$[0..3]        // [1,2,3] — kutuu (dhumti hin hammatiin)
kutuu2 = arr$[0:3]        // [1,2,3] — syntax lakkoofsa-bu'uuraa

ol = arr$^+               // tartiiba ol (primitives qofa)
gad = arr$^-              // tartiiba gad (primitives qofa)

// Tuupilii maqaa/sadarkaa — $^ lambda wal-bira-qabii wajin fayyadami
db = [(maqaa: "Carla", umurii: 28), (maqaa: "Ana", umurii: 25), (maqaa: "Bob", umurii: 30)]
umuriidhan  = db$^ (a, b -> a.umurii < b.umurii)
maqaadhan = db$^ (a, b -> a.maqaa > b.maqaa)
>> umuriidhan[0].maqaa ¶     // → Ana
>> maqaadhan[0].maqaa ¶      // → Carla

arr[1] = 99               // bakka irratti haaromsuu
arr = arr[1]$~ 99         // haaromsuu hojii-ta'aa — tarreeffamaa haaraa deebisa
```

> Operator ururina hundi **tarreeffamaa haaraa** deebisu — irra-ramaddi: `arr = arr$+ 4`.
> Hin walqabsiisu — ramaddiiwwan dhexee fayyadami.
> `$^+` / `$^-` **tarreeffamaa primitive** tartiibaan kaa'u. Tuupilii tarreeffamaa `$^` lambda wal-bira-qabii wajin fayyadami.

```zymbol
// Tarreeffamaa xidid
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[1][2] ¶    // → 6
```

---

## Hiikkuu

```zymbol
// Tarreeffamaa
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[jalqaba, *hafuu] = arr      // jalqaba=10  hafuu=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ gataa

// Tuupilii sadarkaa
dhibii = (100, 200)
(px, py) = dhibii            // px=100  py=200

// Tuupilii maqaa
namaa = (maqaa: "Ana", umurii: 25, magaalaa: "Finfinnee")
(maqaa: m, umurii: u) = namaa  // m="Ana"  u=25
```

---

## Tuupilii

```zymbol
// Sadarkaan
dhibii = (10, 20)
>> dhibii[0] ¶    // → 10

// Maqaan
namaa = (maqaa: "Alice", umurii: 25)
>> namaa.maqaa ¶    // → Alice
>> namaa[0] ¶       // → Alice (sadarkaan ni hojjata)

// Xidid
pos = (x: 10, y: 20)
p = (pos: pos, summaa: "madda")
>> p.pos.x ¶        // → 10
```

---

## Hojii Sadarkaa Ol-aanaa

> Operator HOF **Lambda inline** barbaadu — jijjiiramaa lambda kallattii miti.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

lamaa      = nums$> (x -> x * 2)                // map  → [2,4,6…20]
lakk       = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
waliigalaa = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Silsilaa dhexeedhaan
tarkaanfii1 = nums$| (x -> x > 3)
tarkaanfii2 = tarkaanfii1$> (x -> x * x)
>> tarkaanfii2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Hojiiwwan maqaa HOF keessatti — lambda keessa maxxansi
lama_hojii(x) { <~ x * 2 }
r = nums$> (x -> lama_hojii(x))    // ✅
```

---

## Hojjechiisaa Tuubaa

RHS `_` placeholder gatii darban ta'ee barbaachisa:

```zymbol
lama = x -> x * 2
ida'uu = (a, b) -> a + b
tokko_dabal = x -> x + 1

5 |> lama(_)         // → 10
10 |> ida'uu(_, 5)   // → 15
5 |> ida'uu(2, _)    // → 7

// Silsilaa
r = 5 |> lama(_) |> tokko_dabal(_) |> lama(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Dogoggora Bulchuudhaan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Qooduu duwwaadhaan" ¶
} :! {
    >> "dogoggora biroo: " _err ¶    // _err dhaamsaa dogoggoraa qabata
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

```zymbol
// Maqaa hawaasaa garaa garaa wajin erguu
# mylib
#> { _internal_add <= ida'uu }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::ida'uu(3, 4) ¶    // → 7  (maqaan keessaa _internal_add dhokaa)
```

---

## Hojjechiisota Daataa

```zymbol
// Tarree arfii lakkoofsa gara jijjiiruu
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (dogoggora-nagaa)

// Wareeguu / muruu
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (bakka lamatti wareeguu)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (muruu)

// Lakkoofsa miidhamaa
fmt = #,|1234567|      // → 1,234,567  (comma-gargar-baasuu)
sci = #^|12345.678|    // → 1.2345678e4  (saayinsaawaa)

// Base literals
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Jijjiirama bu'uura
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Walitti Makamuu Shell

```zymbol
guyyaa = <\ date +%Y-%m-%d \>     // stdout qabachuu (dhumti \n dabalatee)
>> "Har'a: " guyyaa

faayilii = "data.txt"
qabiyyee = <\ cat {faayilii} \>   // interpolation ajajota keessatti

output = </"./subscript.zy"/>      // script Zymbol biraa raawwachuu, output qabachuu
>> output
```

> `><` doodaa CLI akka tarree string qabata (tree-walker qofa).

---

## Fakkeenya Guutuu: FizzBuzz

```zymbol
qooduu(lakkoofsaa) {
    ? lakkoofsaa % 15 == 0 { <~ "FizzBuzz" }
    _? lakkoofsaa % 3  == 0 { <~ "Fizz" }
    _? lakkoofsaa % 5  == 0 { <~ "Buzz" }
    _ { <~ lakkoofsaa }
}

@ i:1..20 { >> qooduu(i) ¶ }
```

---

## Wabii Mallattoo

| Mallattoo | Hojii | Mallattoo | Hojii |
|-----------|-------|-----------|-------|
| `=` | Jijjiiramaa | `$#` | Dheerina |
| `:=` | Wayyoomina | `$+` | ida'achuu |
| `>>` | Maddisiisuu | `$+[i]` | sadarkaa keessatti galchuu |
| `<<` | Galchuu | `$-` | jalqaba gatiidhaan haaquun |
| `¶` / `\\` | Sarara haaraa | `$--` | hundumaa gatiidhaan haaquun |
| `?` | yoo (if) | `$-[i]` | sadarkaadhaan haaquun |
| `_?` | yoo_biroo (elif) | `$-[i..j]` | daangaa haaquun |
| `_` | biroo / bakkaa | `$?` | qabachuu |
| `??` | match | `$??` | sadarkaalee hunda |
| `@` | duubee (loop) | `$[s..e]` | kutuu |
| `@!` | addaan kuti (break) | `$>` | map |
| `@>` | itti fufi (continue) | `$\|` | filter |
| `->` | Lambda | `$<` | reduce |
| `$^+` | tartiiba ol (primitives) | `$^-` | tartiiba gad (primitives) |
| `$^` | comparator wajin tartiibuu (tuples) | | |
| `<~` | deebi'i (return) | `!?` | yaali (try) |
| `\|>` | Pipe | `:!` | qabi (catch) |
| `#1` | dhugaa | `:>` | yeroo hundaa (finally) |
| `#0` | soba | `$!` | dogoggora dha |
| `<#` | galchuu (import) | `$!!` | dogoggora dabarsuu |
| `#` | moduulii labsi | `#>` | erguu |
| `::` | moduulii waamuu | `.` | bakka argachuu |
| `#\|..\|` | lakkoofsa parse | `#?` | metadata gosa |
| `#.N\|..\|` | wareeguu | `#!N\|..\|` | muruu |
| `c\|..\|` | comma miidhamaa | `e\|..\|` | saayinsaawaa |
| `<\ ..\>` | shell exec | `>\<` | doodaa CLI |

---

*Zymbol-Lang — Mallattoodhaan. Waliigalaan. Yeroo hundaa.*

> **Yaadachiisa:** Barruun kun Ogummaa Namtolcheen (AI) uumamee fi hiikame.
> Sirrummaa mirkaneessuuf hojiin hundi godhamee jira, garuu hiikkaa tokko tokko yookaan fakkeenya dogoggora qabaachuu danda'u.
> Wabiin murtaa'aan [Diriirsa Zymbol-Lang](https://github.com/zymbol-lang/interpreter) dha.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
