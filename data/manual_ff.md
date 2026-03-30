# Zymbol-Lang Dokkol Ɓurɗo Famɗude

**Zymbol-Lang** ko haala ngal winndirtoo e tiimooje. Ngal alaa keɓɓinooje — fof ko tiimorde. Ngal golloroo haa gooto e kala haala aadee.

- Alaa keɓɓinooje (`if`, `while`, `return` wonaa ko woodi — ko tiimooje tan `?`, `@`, `<~`)
- Unicode himmude — innde e kala haala aadee walla Emoji 👋
- Golloroo e kala haala — koodhol ngol ko gooto e kala haala

---

## Coccorde e Waɗande

```zymbol
x = 10              // Coccorde (waɗande)
PI := 3.14159       // Waɗande (waɗande — juumre so waɗoynoo)
innde = "Ana"
goonga = #1         // goonga booleen
👋 := "Jaama"
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

## Juuɗe Ɗee

| Juuɗe           | Misaale              | Tiimorde `#?` | Tindinnde                           |
|-----------------|----------------------|---------------|-------------------------------------|
| Limre Jaajre    | `42`, `-7`           | `###`         | 64-bit waɗaama                      |
| Limre Dottirde  | `3.14`, `1.5e10`     | `##.`         | Windannde siyantiifik OK            |
| Winndannde      | `"jaama"`            | `##"`         | Interpolasion: `"Innde {innde}"`    |
| Binndi          | `'A'`                | `##'`         | Unicode keefu gooto                 |
| Booleen         | `#1`, `#0`           | `##?`         | WONAA limre 1 e 0                   |
| Sarɗi           | `[1, 2, 3]`          | `##]`         | Fof ko juuɗe gooto                  |
| Tupili          | `(a, b)`             | `##)`         | Binndi e goɗɗe                      |
| Tupili Inndiraaɗe | `(x: 1, y: 2)`     | `##)`         | Naatee e innde walla binndi         |

```zymbol
// Weltaare juuɗe — hollana (juuɗe, limre, nyaawka)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Hollinde e Naatinde

```zymbol
>> "Jaama" ¶                    // ¶ walla \\ hollina njaajeende
>> "a=" a " b=" b ¶             // keɓɓe keewɗe e juxtaposition
>> (arr$#) ¶                    // tiimooje postfix foti keɓɓe naange

<< innde                        // alaa hiɓɓinooje — windana coccorde
<< "Innde maa? " innde          // e hiɓɓinooje
```

> `¶` (AltGr+R clavier espagnol) walla `\\` ko gooto ko hollinta njaajeende.

---

## Kuutooɓe

```zymbol
// Limreeji — waɗanee e coccorɗe; diiɗi maa waɗee ko juumre e >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (feccude limreeje)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (fewnude)

// Safaara
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Miijo
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Ɓatakon

```zymbol
// Naatooje tato ngonɗe — fof e nokku mum
innde = "Ana"
limre = 42

ndiyam = "Jaama ", innde, "!"                // virgule — e waɗande = walla :=
>> "Jaama " innde " aan nanndi " limre ¶     // juxtaposition — e hollinde >>
binndi = "Jaama {innde}, aan nanndi {limre}" // interpolasion — e nokku fof
```

```zymbol
s = "Jaama Fulɓe"
fiɓɓinannde = s$#                  // 11
ndiyam = s$[0..5]                  // "Jaama"  (cakkitaare wiɗteede)
njeyaa = s$? "Fulɓe"               // #1
binnɗi = "a,b,c,d" / ','           // [a, b, c, d]
yiɗtaare = s$~~["a":"A"]           // binndi yiɗtaare fof
yiɗta1 = s$~~["a":"A":1]           // yiɗtaare adannde tan
```

> `+` ko ngam limreeje tan. E winndannde, hollinan virgule, juxtaposition walla interpolasion.

---

## Jaɓɓinde Njeeygu

```zymbol
x = 7

? x > 0 { >> "nanondiri" ¶ }

? x > 100 {
    >> "mawnde" ¶
} _? x > 0 {
    >> "nanondiri" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "famɗude" ¶
}
```

> Jokkorde `{ }` ko **waajibii**, haa binndi gooto tan.

---

## Match

```zymbol
// Binndi himmude
limre = 85
sarɗi = ?? limre {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> sarɗi ¶    // → B

// Winndannde
ranwal = "ɓaleeri"
koodhol = ?? ranwal {
    "ɓaleeri" : "#FF0000"
    "daneeri"  : "#00FF00"
    _          : "#000000"
}

// Sarɗi (keeɗe fof)
temp = -5
ciiƴe = ?? temp {
    _? temp < 0  : "congol"
    _? temp < 20 : "daneere"
    _? temp < 35 : "hiɓɓunde"
    _            : "weendu"
}
>> ciiƴe ¶    // → congol

// Gure jokkorde
?? n {
    0       : { >> "nul" ¶ }
    _? n < 0: { >> "famɗude" ¶ }
    _       : { >> "nanondiri" ¶ }
}
```

---

## Woƴƴude

```zymbol
@ i:0..4  { >> i " " }        // binndi: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // e aduna: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // huwtiinde: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (haa)

liɓɓe = ["mango", "lemon", "orange"]
@ f:liɓɓe { >> f ¶ }          // e kala keɓɓe

@ c:"jaama" { >> c "-" }
>> ¶                          // → j-a-a-m-a-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jokkude
    ? i > 7 { @! }             // @! dankude
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Woƴƴude moƴƴaani
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Woƴƴude inndiraaɗe (dankude fewnude)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Tiiɗe

```zymbol
suudude(a, b) { <~ a + b }
>> suudude(3, 4) ¶    // → 7

neɗɗo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * neɗɗo(n - 1)
}
>> neɗɗo(5) ¶    // → 120
```

Tiiɗe ngonɗe e scope moƴƴe — alaa naatgol e coccorɗe ɓurɗe. Waɗanee coccorɗe `<~` ngam waɗde:

```zymbol
fewnitaare(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
fewnitaare(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Tiiɗe inndiraaɗe wonaa keɓɓe cewndaaje. Ngam nawde ko teddingol: `x -> innde(x)`.

---

## Lambda e Binndi

```zymbol
doppelt = x -> x * 2
jumloore = (a, b) -> a + b
>> doppelt(5) ¶       // → 10
>> jumloore(3, 7) ¶   // → 10

// Lambda e jokkorde
suudude = x -> {
    ? x > 0 { <~ "nanondiri" }
    _? x < 0 { <~ "famɗude" }
    <~ "nul"
}

// Binndi — Lambdas nanndi coccorɗe ɓurɗe
faktor = 3
tati = x -> x * faktor
>> tati(7) ¶    // → 21

// Laaboratoore tiiɗe
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas ko keɓɓe: sarɗi njeyaa
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Sarɗi

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — naatgol (binndi fawaando 0)
arr[-1]         // 5 — binndi famɗuɗe (cakkitaare)
arr$#           // 5 — fiɓɓinannde (waɗanee (arr$#) e >>)

arr = arr$+ 6            // ɓeyɗude → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // naatgol e binndi 2
arr3 = arr$- 3           // feccude adannde e nyaawka
arr4 = arr$-- 3          // feccude fof e nyaawka
arr5 = arr$-[0]          // feccude e binndi
arr6 = arr$-[1..3]       // feccude binndi (cakkitaare wiɗteede)

njeyaa = arr$? 3         // #1 — njeyaa
binnɗi = arr$?? 3        // [2] — binnɗi fof e nyaawka
ndiyam = arr$[0..3]      // [1,2,3] — ndiyam (cakkitaare wiɗteede)
sl2 = arr$[0:3]          // [1,2,3] — fiɓɓinannde-kama

asc = arr$^+             // dartinde mawnde (limreeje tan)
desc = arr$^-            // dartinde famɗude (limreeje tan)

// Tupili inndiraaɗe — waɗanee $^ e lambda safaara
db = [(innde: "Karla", jimre: 28), (innde: "Ana", jimre: 25), (innde: "Buba", jimre: 30)]
jimre_kama  = db$^ (a, b -> a.jimre < b.jimre)    // dartinde mawnde e jimre (<)
innde_kama = db$^ (a, b -> a.innde > b.innde)     // dartinde famɗude e innde (>)
>> jimre_kama[0].innde ¶     // → Ana
>> innde_kama[0].innde ¶    // → Karla

arr[1] = 99              // waɗde e nokku
arr = arr[1]$~ 99        // waɗde tiiɗungal — hollana sarɗi kesel
```

> Tiimooje fof ngollana **sarɗi kesel**. Waɗanaa: `arr = arr$+ 4`.
> Alaa jokkude — waɗande ɗiɗi jaɓɓinee.
> `$^+` / `$^-` ngollana **sarɗi limreeje** (limreeje, winndannde). Tupili waɗanee `$^` e lambda safaara.

```zymbol
// Sarɗi ɗiɗiɗe
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Ukkitaare

```zymbol
// Sarɗi
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[adannde, *goɗɗe] = arr      // adannde=10  goɗɗe=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ feccude innde

// Tupili e goɗɗe
nokku = (100, 200)
(px, py) = nokku             // px=100  py=200

// Tupili inndiraaɗe
neɗɗo = (innde: "Ana", jimre: 25, wuro: "Dakar")
(innde: n, jimre: a) = neɗɗo // n="Ana"  a=25
```

---

## Tupili

```zymbol
// E goɗɗe
nokku = (10, 20)
>> nokku[0] ¶    // → 10

// Inndiraaɗe
neɗɗo = (innde: "Alice", jimre: 25)
>> neɗɗo.innde ¶    // → Alice
>> neɗɗo[0] ¶       // → Alice  (binndi jokkata haa)

// Fewnude
weeyo = (x: 10, y: 20)
p = (weeyo: weeyo, innde: "adannde")
>> p.weeyo.x ¶      // → 10
```

---

## Tiiɗe Mawnde

> Tiimooje HOF foti **lambda hiɓɓinnde** — alaa coccorde lambda toɗɗaande.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doppele  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
jaaɓniɗi = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
jumlol   = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Jokkude e waɗande
gure1 = nums$| (x -> x > 3)
gure2 = gure1$> (x -> x * x)
>> gure2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Tiiɗe inndiraaɗe e HOF — naatanee e lambda
doppelt(x) { <~ x * 2 }
r = nums$> (x -> doppelt(x))    // ✅
```

---

## Kuutorde Kaaƴndi

Baɗtorde kaa foti `_` lokola toɗɗaande nyaawka piipirde:

```zymbol
doppelt = x -> x * 2
jumlol = (a, b) -> a + b
ɓeyɗude = x -> x + 1

5 |> doppelt(_)        // → 10
10 |> jumlol(_, 5)     // → 15
5 |> jumlol(2, _)      // → 7

// Jokkude
r = 5 |> doppelt(_) |> ɓeyɗude(_) |> doppelt(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Jaɓɓinde Juumre

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Feccude e nul" ¶
} :! {
    >> "juumre goɗɗo: " _err ¶    // _err nanndi ɓatakon juumre
} :> {
    >> "woɗɗi fof golloroo" ¶
}
```

| Juuɗe       | Tuma ngal jokkata           |
|-------------|------------------------------|
| `##Div`     | Feccude e nul                |
| `##IO`      | Dosiye / Coodaari            |
| `##Index`   | Binndi ɓuri binndi sarɗi     |
| `##Type`    | Juumre juuɗe                 |
| `##Parse`   | Juumre parse                 |
| `##Network` | Juumre reseew                |
| `##_`       | Juumre fof (catch-all)       |

---

## Modiiji

```zymbol
// Dosiye: lib/calc.zy
# calc

#> { suudude, get_PI }    // Sarɗi ƁURI faayre

_PI := 3.14159
suudude(a, b) { <~ a + b }
get_PI() { <~ _PI }   // naatande — naatgol toon toon alaa
```

```zymbol
// Dosiye: main.zy
<# ./lib/calc <= c    // Innde foti

>> c::suudude(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Hollinde e innde goɗɗo
# mylib
#> { _jumlol_katin <= jumlol }

_jumlol_katin(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::jumlol(3, 4) ¶    // → 7  (innde katin _jumlol_katin suuɗaama)
```

---

## Kuutooɓe Jaati

```zymbol
// Feccude winndannde e limre
v1 = #|"42"|      // → 42  (Limre Jaajre)
v2 = #|"3.14"|    // → 3.14  (Limre Dottirde)
v3 = #|"abc"|     // → "abc"  (juumre alaa)

// Dartinde / feccude
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (dartinde e binndi 2)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (feccude)

// Windannde limre
fmt = #,|1234567|      // → 1,234,567  (virgule fewnirde)
sci = #^|12345.678|    // → 1.2345678e4  (siyantiifik)

// Limreeji tondiraaɗi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binaari)
c = 0o101        // → 'A'  (oktal)

// Hollinde tondirde
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Lekki Shell

```zymbol
wontere = <\ date +%Y-%m-%d \>     // nanndi stdout (e njaajeende)
>> "Hannde: " wontere

dosiye = "data.txt"
mbinndanndee = <\ cat {dosiye} \>      // interpolasion e kuutooɗe

binndi = </"./subscript.zy"/>   // golloroo zymbol goɗɗo, nanndi binndi
>> binndi
```

> `><` nanndi kuutooɗe CLI lokola sarɗi (tree-walker tan).

---

## Misaale Humpitanɗe: FizzBuzz

```zymbol
suudude(limorde) {
    ? limorde % 15 == 0 { <~ "BinndoFizzBuzz" }
    _? limorde % 3  == 0 { <~ "BinndoFizz" }
    _? limorde % 5  == 0 { <~ "BinndoBuzz" }
    _ { <~ limorde }
}

@ i:1..20 { >> suudude(i) ¶ }
```

---

## Tiimooje Ɗee

| Tiimorde | Gollal             | Tiimorde   | Gollal                |
|----------|--------------------|------------|-----------------------|
| `=`      | Coccorde           | `$#`       | Fiɓɓinannde           |
| `:=`     | Waɗande            | `$+`       | Ɓeyɗude               |
| `>>`     | Hollinde           | `$+[i]`    | Naatgol e binndi      |
| `<<`     | Naatinde           | `$-`       | Feccude adannde       |
| `¶`/`\\` | Njaajeende         | `$--`      | Feccude fof e nyaawka |
| `?`      | so (if)            | `$-[i]`    | Feccude e binndi      |
| `_?`     | _so (_elif)        | `$-[i..j]` | Feccude binnɗi        |
| `_`      | _tan / toɗɗaare    | `$?`       | Njeyaa                |
| `??`     | match              | `$??`      | Binnɗi fof e nyaawka  |
| `@`      | Woƴƴude            | `$[s..e]`  | Ndiyam                |
| `@!`     | dankude (break)    | `$>`       | map                   |
| `@>`     | jokkude (continue) | `$\|`      | filter                |
| `->`     | Lambda             | `$<`       | reduce                |
| `$^+`    | Dartinde mawnde    | `$^-`      | Dartinde famɗude      |
| `$^`     | Dartinde e lambda  | | |
| `<~`     | jooɗaare           | `!?`       | ɗannude (try)         |
| `\|>`    | Pipe               | `:!`       | jaɓɓude (catch)       |
| `#1`     | goonga             | `:>`       | fof (finally)         |
| `#0`     | fenaande           | `$!`       | ko juumre             |
| `<#`     | naatinde (import)  | `$!!`      | nawde juumre          |
| `#`      | hollude modul      | `#>`       | sarɗude (export)      |
| `::`     | nodde modul        | `.`        | naatgol binndi        |
| `#\|..\|` | feccude limre    | `#?`       | weltaare juuɗe        |
| `#.N\|..\|` | dartinde       | `#!N\|..\|` | feccude            |
| `c\|..\|` | windannde virgule | `e\|..\|` | siyantiifik           |
| `<\ ..\>` | shell golloroo  | `>\<`      | kuutooɗe CLI          |

---

*Zymbol-Lang — Tiimorde. Himmude. Waɗande.*

> **Tindinnde:** Dokkol ngol winndaama e jannginaa e Hakkilantaagal (AI).
> Gollal fof waɗaama ngam saaktinde goonga, kono winndannde walla misaale ɗiɗi maa ngontoy ballal.
> Dokkol humpitanngal ko [Zymbol-Lang deftere](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
