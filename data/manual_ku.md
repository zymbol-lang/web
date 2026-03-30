# Rêbera Kompakt a Zymbol-Lang

**Zymbol-Lang** zimanek bernamesaziya sembolîk e. Ew tu peyivên sereke bikar nayîne — her tişt sembol e. Di her zimanê mirovî de bi heman awayî dixebite.

- Tu peyivên sereke tune (`if`, `while`, `return` tune — tenê sembol `?`, `@`, `<~`)
- Unicode-ya tam — nasnavên bi her ziman an emoji 👋
- Bêalî ya zimanan — kod di hemî zimanan de wekhev e

---

## Guhêrbar û Sabit

```zymbol
x = 10           // Guhêrbar (guherbar)
PI := 3.14159    // Sabit (neguhêrbar — xelet e ji nû ve were peywirdan)
nav = "Amed"
çalak = #1       // Boolean rast
👋 := "Merheba"
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

## Celebên Daneyê

| Celeb          | Mînak               | Sembol `#?` | Şirove                              |
|----------------|---------------------|-------------|-------------------------------------|
| Jimare         | `42`, `-7`          | `###`       | 64-bit bi nîşan                     |
| Jimareyê Kesk  | `3.14`, `1.5e10`    | `##.`       | Nivîsandina zanistî qebûl e         |
| Rêze           | `"merheba"`         | `##"`       | Veguheztin: `"Merheba {nav}"`       |
| Tîp            | `'A'`               | `##'`       | Yek tîpek Unicode                   |
| Boolean        | `#1`, `#0`          | `##?`       | Ne jimare 1 û 0 ne                  |
| Rêze-kom       | `[1, 2, 3]`         | `##]`       | Hemî hêman ji heman celebî          |
| Tuple          | `(a, b)`            | `##)`       | Pozisyonî                           |
| Tuple bi Nav   | `(x: 1, y: 2)`      | `##)`       | Têketin bi nav an index             |

```zymbol
// Introspeksiyona celebê — (celeb, jimar, nirx) vedigerîne
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Derxistin û Xwendin

```zymbol
>> "Merheba, Cîhan!" ¶              // ¶ an \\ rêzek nû yê eşkere dide
>> "a=" a " b=" b ¶                 // gelek nirx bi tenê danîn
>> (kom$#) ¶                        // operatorên postfix-ê parantez pêwist in

<< nav                              // bê nîşana têketinê — di guhêrbarê de dixwîne
<< "Navê te? " nav                  // bi nîşana têketinê
```

> `¶` an `\\` wekhev in wek rêzek nû.

---

## Operatorên

```zymbol
// Hesab
a = 10
b = 3
n1 = a + b    // 13     n2 = a - b    // 7
n3 = a * b    // 30     n4 = a / b    // 3  (dabeşkirina integer)
n5 = a % b    // 1      n6 = a ^ b    // 1000  (hêz)

// Berhevdanî
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Mantiq
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Rêzikên Nivîsê

```zymbol
// Sê formên girêdanê
nav = "Amed"
n = 42

msg = "Merheba ", nav, "!"              // vîrgul — di peywirdanên = an := de
>> "Merheba " nav " tu " n " salî yî" ¶  // tenê danîn — di derxistina >> de
danasîn = "Merheba {nav}, tu {n} salî yî"  // veguheztin — di her çarçoveyê de
```

```zymbol
s = "Hello World"
dirêjî = s$#              // 11
bin = s$[0..5]            // "Hello"  (dawî jêde ye)
heye = s$? "World"        // #1
hiss = "a,b,c,d" / ','    // [a, b, c, d]
guhart = s$~~["l":"L"]    // "HeLLo WorLd"
guhart1 = s$~~["l":"L":1] // "HeLlo World"  (yekem N)
```

> `+` tenê ji bo jimareyan e. Ji bo rêzeyan `,`, tenê danîn an veguheztin bikar bîne.

---

## Rêveçûna Kontrolê

```zymbol
x = 7

? x > 0 { >> "erênî" ¶ }

? x > 100 {
    >> "mezin" ¶
} _? x > 0 {
    >> "erênî" ¶
} _? x == 0 {
    >> "sifir" ¶
} _ {
    >> "neyînî" ¶
}
```

> Blokên `{ }` **pêwist in**, heta ji bo yek rêzê jî.

---

## Match

```zymbol
// Rêzeyên jimareyê
not = 85
nirxandin = ?? not {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nirxandin ¶    // → B

// Rêzeyên nivîsê
reng = "sor"
kod = ?? reng {
    "sor"  : "#FF0000"
    "kesk" : "#00FF00"
    _      : "#000000"
}

// Parêzvan
germahî = -5
rewş = ?? germahî {
    _? germahî < 0  : "qeş"
    _? germahî < 20 : "sar"
    _? germahî < 35 : "germ"
    _               : "gelek germ"
}
>> rewş ¶    // → qeş

// Forma daxuyaniyê (blok-destên)
?? n {
    0       : { >> "sifir" ¶ }
    _? n < 0: { >> "neyînî" ¶ }
    _       : { >> "erênî" ¶ }
}
```

---

## Xirxal

```zymbol
@ i:0..4  { >> i " " }        // rêzeya tevlî: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // bi gav: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // berevajî: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fêkî = ["sêv", "hirmî", "tirî"]
@ f:fêkî { >> f ¶ }           // for-each rêze-kom

@ c:"merheba" { >> c "-" }
>> ¶                          // → m-e-r-h-e-b-a-  (for-each rêze)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> berdewam bike
    ? i > 7 { @! }             // @! raweste
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Xirxala bêdawî
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Xirxala bi nîşan (rawestandina ç-nav-ç)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Fonksiyon

```zymbol
kirin(a, b) { <~ a + b }
>> kirin(3, 4) ¶    // → 7

faktoriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyel(n - 1)
}
>> faktoriyel(5) ¶    // → 120
```

Fonksiyon xwedan **çarçoveya veqetandî** ye — negihîştin guhêrbarên derve. Ji bo guherandina guhêrbarên bangkerê parametrên derketinê `<~` bikar bîne:

```zymbol
guhertin(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
guhertin(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fonksiyonên bi nav nirxên yekem-pola nîn in. Ji bo şandina wek arguman bi xwe bipêçin: `x -> kirin(x)`.

---

## Lambda û Xêzik (Closure)

```zymbol
ducar = x -> x * 2
berhev = (a, b) -> a + b
>> ducar(5) ¶     // → 10
>> berhev(3, 7) ¶  // → 10

// Lambda bi blok
sinifkirin = x -> {
    ? x > 0 { <~ "erênî" }
    _? x < 0 { <~ "neyînî" }
    <~ "sifir"
}

// Xêzik — lambda guhêrbarên derve digire
faktor = 3
sê_qat = x -> x * faktor
>> sê_qat(7) ¶    // → 21

// Kargehê fonksiyonê
çêker_zêdekir(n) { <~ x -> x + n }
zêde10 = çêker_zêdekir(10)
>> zêde10(5) ¶    // → 15

// Di rêze-komê de
karan = [x -> x+1, x -> x*2, x -> x*x]
>> karan[2](5) ¶    // → 25
```

---

## Rêze-Kom (Array)

```zymbol
kom = [1, 2, 3, 4, 5]

kom[0]          // 1 — têketin (index ji 0 dest pê dike)
kom[-1]         // 5 — indexa neyînî (ya dawî)
kom$#           // 5 — dirêjî (di >> de (kom$#) bikar bîne)

kom = kom$+ 6            // zêdekirin → [1,2,3,4,5,6]
k2 = kom$+[2] 99         // li indexa 2 daxistin
k3 = kom$- 3             // yekem rasthatina nirxê jêkirin
k4 = kom$-- 3            // hemî rasthatinan jêkirin
k5 = kom$-[0]            // bi indexê jêkirin
k6 = kom$-[1..3]         // rêzeyê jêkirin (dawî jêde ye)

heye = kom$? 3           // #1 — hebûn
pos = kom$?? 3           // [2] — hemî indexên
pêçe = kom$[0..3]        // [1,2,3] — kirin (dawî jêde ye)
pêçe2 = kom$[0:3]        // [1,2,3] — heman, hejmarî

asc = kom$^+             // rêzkirina hilkişan  (tenê primitîv)
desc = kom$^-            // rêzkirina daketinê (tenê primitîv)

// Rêze-komên tuple — $^ bi lambda-ya berhevdanê
db = [(nav: "Carla", temen: 28), (nav: "Leyla", temen: 25), (nav: "Bob", temen: 30)]
by_age  = db$^ (a, b -> a.temen < b.temen)    // li gorî temenê hilkişan (<)
by_name = db$^ (a, b -> a.nav > b.nav)         // li gorî navê dakêşan (>)
>> by_age[0].nav ¶     // → Leyla
>> by_name[0].nav ¶    // → Carla

kom[1] = 99              // nûvekirina li cih
kom = kom[1]$~ 99        // nûvekirina fonksiyonî — rêze-komek nû vedigerîne
```

> Hemî operatorên koleksiyonê **rêze-komek nû** vedigerîne. Ji nû ve bispêre: `kom = kom$+ 4`.
> Zincîrkirin nîne: du peywirdanên cûda bikar bîne.
> `$^+` / `$^-` **rêze-komên primitîv** (jimare, rêze) rêz dike. Ji bo rêze-komên tuple `$^` bi lambda-ya berhevdanê bikar bîne.

```zymbol
// Rêze-komên ç-nav-ç
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Veqetandin

```zymbol
// Rêze-kom
kom = [10, 20, 30, 40, 50]
[a, b, c] = kom              // a=10  b=20  c=30
[first, *rest] = kom         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ davêje

// Tuplek pozisyonî
point = (100, 200)
(px, py) = point             // px=100  py=200

// Tuplek bi nav
kes = (nav: "Leyla", temen: 25, bajar: "Amed")
(nav: n, temen: a) = kes     // n="Leyla"  a=25
```

---

## Tuple

```zymbol
// Pozisyonî
point = (10, 20)
>> point[0] ¶    // → 10

// Bi nav
kes = (nav: "Leyla", temen: 28)
>> kes.nav ¶     // → Leyla
>> kes[0] ¶      // → Leyla  (index jî dixebite)

// Ç-nav-ç
pos = (x: 10, y: 20)
p = (pos: pos, label: "destpêk")
>> p.pos.x ¶        // → 10
```

---

## Fonksiyonên Rêza Bilind (HOF)

> Operatorên HOF-ê **lambda-ya inline** pêwist in — guhêrbarê lambda-ya rasterast nabe.

```zymbol
hejmar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ducar     = hejmar$> (x -> x * 2)                // map  → [2,4,6…20]
cotmejî   = hejmar$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
giştî     = hejmar$< (0, (acc, x) -> acc + x)    // reduce → 55

// Zincîr bi navberên demkî
step1 = hejmar$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fonksiyonên bi nav di HOF-ê de — di lambda-yê de bipêçin
double(x) { <~ x * 2 }
r = hejmar$> (x -> double(x))    // ✅
```

---

## Operatora Boriyê

Aliyê rastê her tim `_` wek cîgir pêwist e:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Zincîrkirî
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Rêveçûna Xeletiyê

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Dabeşkirina bi sifir" ¶
} :! {
    >> "xeletiya din: " _err ¶    // _err peyama xeletiyê dihewîne
} :> {
    >> "her dem tê xebitandin" ¶
}
```

| Celeb       | Kengê çêdibe                     |
|-------------|----------------------------------|
| `##Div`     | Dabeşkirina bi sifir             |
| `##IO`      | Dosya / Sîstem                   |
| `##Index`   | Index li derveyî sînoram         |
| `##Type`    | Xeletiya celebê                  |
| `##Parse`   | Xeletiya parskirinê              |
| `##Network` | Xeletiya torê                    |
| `##_`       | Her xeletî (girtina hemî)        |

---

## Module

```zymbol
// Dosya: lib/hesab.zy
# hesab

#> { kirin, get_PI }    // Derxistin BERÎ pênaseyê

_PI := 3.14159
kirin(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Dosya: sereke.zy
<# ./lib/hesab <= h    // Alias pêwist e

>> h::kirin(5, 3) ¶   // → 8
pi = h::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Bi navekî giştî yê cuda derxistin
# mylib
#> { _dahilî_kirin <= berhev }

_dahilî_kirin(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::berhev(3, 4) ¶    // → 7  (navê dahilî _dahilî_kirin veşartî ye)
```

---

## Operatorên Daneyê

```zymbol
// Rêzeyê veguheztina jimareyê
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ewle)

// Giroverkirinê / kurtkirinê
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Şêwekirina jimareyê
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Literalên bingehê
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Veguheztina bingehê
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Entegrasyona Shell

```zymbol
date = <\ date +%Y-%m-%d \>     // stdout digire
>> "Îro: " date

file = "data.txt"
content = <\ cat {file} \>      // veguheztin di fermanan de

output = </"./subscript.zy"/>   // skrîpta Zymbol dimeşîne
>> output
```

> `><` argumantên CLI wek rêze-komek tê girtin (tenê tree-walker).

---

## Nimûneya Tam: FizzBuzz

```zymbol
dabeşkirin(hejmar) {
    ? hejmar % 15 == 0 { <~ "PijokVıjvıj" }
    _? hejmar % 3  == 0 { <~ "Pijok" }
    _? hejmar % 5  == 0 { <~ "Vıjvıj" }
    _ { <~ hejmar }
}

@ i:1..20 { >> dabeşkirin(i) ¶ }
```

---

## Referansa Sembolan

| Sembol  | Karker               | Sembol     | Karker                   |
|---------|----------------------|------------|--------------------------|
| `=`     | Guhêrbar             | `$#`       | Dirêjî                   |
| `:=`    | Sabit                | `$+`       | Zêdekirin                |
| `>>`    | Derxistin            | `$+[i]`    | Li indexê daxistin       |
| `<<`    | Xwendin              | `$-`       | Yekem nirx jêkirin       |
| `¶`/`\\`| Rêzek nû             | `$--`      | Hemî nirxan jêkirin      |
| `?`     | heke (if)            | `$-[i]`    | Bi indexê jêkirin        |
| `_?`    | heke din (elif)      | `$-[i..j]` | Rêzeyê jêkirin           |
| `_`     | wekî din / cîgir     | `$?`       | Hebûn                    |
| `??`    | match                | `$??`      | Hemî indexên bibîne      |
| `@`     | xirxal (loop)        | `$[s..e]`  | Pêçe                     |
| `@!`    | rawestan (break)     | `$>`       | map                      |
| `@>`    | berdewamkirin        | `$\|`      | filter                   |
| `->`    | Lambda               | `$<`       | reduce                   |
| `$^+`   | Rêzkirin hilkişan (prim.) | `$^-` | Rêzkirin daketinê (prim.) |
| `$^`    | Komparatorê rêzkirin |            |                          |
| `<~`    | vegerandin (return)  | `!?`       | ceribandî (try)          |
| `\|>`   | Bori (pipe)          | `:!`       | girtin (catch)           |
| `#1`    | rast (true)          | `:>`       | her dem (finally)        |
| `#0`    | şaş (false)          | `$!`       | xeletî ye                |
| `<#`    | xistin (import)      | `$!!`      | xeletiyê belav bike      |
| `#`     | modulê rakin         | `#>`       | derxistin (export)       |
| `::`    | bangkirina modulê    | `.`        | gihîştina qadê           |
| `#\|..\|` | Jimareyê parse     | `#?`       | Metadata celebê          |
| `#.N\|..\|` | Giroverkirinê    | `#!N\|..\|` | Kurtkirin               |
| `c\|..\|` | Şêweya vîrgulê     | `e\|..\|`  | Şêweya zanistî           |
| `<\ ..\>` | Shell meşandin     | `><`       | Argumantên CLI           |

---

*Zymbol-Lang — Sembolîk. Gerdûnî. Neguhêrbar.*

> **Hişyarî:** Ev belge ji aliyê îstîxbarata çêkirî (AI) ve hatiye afirandin û wergerandin.
> Her hewl hatiye dayîn ku rasttiya wê were misoger kirin, lê dibe ku hin werger an mînak xeletî hebin.
> Referansa kanonîk [spesîfîkasyona Zymbol-Lang](https://github.com/zymbol-lang/interpreter) e.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> For authoritative reference, consult the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
