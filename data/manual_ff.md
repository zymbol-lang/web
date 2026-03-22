# Zymbol-Lang Dokkol Ɓurɗo Famɗude

**Zymbol-Lang** ko haala ngal winndirtoo e tiimooje. Ngal alaa keɓɓinooje — fof ko tiimorde. Ngal golloroo haa gooto e kala haala aadee.

---

## Miijo

- Alaa keɓɓinooje (`if`, `while`, `return` wonaa ko woodi — ko tiimooje tan `?`, `@`, `<~`)
- Unicode himmude — innde e kala haala aadee walla Emoji 👋
- Golloroo e kala haala — koodhol ngol ko gooto e kala haala

---

## Coccorde e Waɗande

```zymbol
x = 10           // Coccorde (waɗande)
PI := 3.14159    // Waɗande (waɗande — juumre so waɗoynoo)
innde = "Ana"
goonga = #1       // goonga booleen
👋 := "Jaama"
```

### Jokkude Waɗande

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

---

## Hollinde e Naatinde

```zymbol
// Hollinde — ALAA njaajeende leeltunde ndee automatiki
>> "Jaama" ¶                    // ¶ walla \\ hollina njaajeende
>> "a=" a " b=" b ¶             // keɓɓe keewɗe e juxtaposition
>> "jumlol=" suudude(2, 3) ¶    // noddi tiiɗe e nokku fof
>> (arr$#) ¶                    // tiimooje postfix foti keɓɓe naange

// Naatinde
<< innde                        // alaa hiɓɓinooje — windana coccorde
<< "Innde maa? " innde          // e hiɓɓinooje
```

> `¶` walla `\\` ko gooto ko hollinta njaajeende.

---

## Jokkude Wolde

Naatooje tato ngonɗe — fof e nokku mum:

```zymbol
innde = "Ana"
limre = 25

// 1. Virgule — e waɗande = walla :=
ndiyam = "Jaama ", innde, "!"                // → Jaama Ana!
TIITOONDE := "Jannginɗo: ", innde

// 2. Juxtaposition — e hollinde >>
>> "Jaama " innde " aan nanndi " limre ¶     // → Jaama Ana aan nanndi 25

// 3. Interpolasion — e nokku fof
binndi = "Jaama {innde}, aan nanndi {limre}" // → Jaama Ana, aan nanndi 25
```

> **Tindinnde**: `+` ko ngam limreeje tan. E winndannde hollinan ceeɗu.

---

## Jaɓɓinde Njeeygu

```zymbol
x = 7

// So gooto
? x > 0 { >> "nanondiri" ¶ }

// So / _? / _
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

Jokkorde `{ }` ko **waajibii**, haa binndi gooto tan.

---

## Match

```zymbol
// Match e binndi
limre = 85
sarɗi = ?? limre {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> sarɗi ¶    // → B

// Match e sarɗi (keeɗe fof)
temp = -5
ciiƴe = ?? temp {
    _? temp < 0  : "congol"
    _? temp < 20 : "daneere"
    _? temp < 35 : "hiɓɓunde"
    _            : "weendu"
}
>> ciiƴe ¶    // → congol

// Match e winndannde
ranwal = "ɓaleeri"
koodhol = ?? ranwal {
    "ɓaleeri" : "#FF0000"
    "daneeri"  : "#00FF00"
    _          : "#000000"
}
>> koodhol ¶
```

---

## Woƴƴude

```zymbol
// Binndi himmude: 0..4 woƴƴa 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Binndi e aduna
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Binndi huwtiinde
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Haa (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// E kala keɓɓe
liɓɓe = ["mango", "lemon", "orange"]
@ f:liɓɓe { >> f ¶ }

// E binndi winndannde
@ c:"jaama" { >> c "-" }
>> ¶    // → j-a-a-m-a-

// @! e @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> jokkude
    ? i > 7 { @! }          // @! dankude
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Tiiɗe

```zymbol
// Hollude e nodde
suudude(a, b) { <~ a + b }
>> suudude(3, 4) ¶    // → 7

// Nattinde
neɗɗo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * neɗɗo(n - 1)
}
>> neɗɗo(5) ¶    // → 120

// Tiiɗe ngonɗe e scope moƴƴe — alaa naatgol e coccorɗe ɓurɗe
global = 100
tiiɗe() {
    x = 42    // nokku tan
    <~ x
}
>> tiiɗe() ¶    // → 42
```

> **Ɓurɗo Anndude**: Tiiɗe inndiraaɗe `innde(params){ }` wonaa keɓɓe cewndaaje.
> Ngam nawde ko teddingol: `x -> innde(x)`.

---

## Lambda e Binndi

```zymbol
// Lambda fawaangal (jooɗaare nde)
doppelt = x -> x * 2
jumloore = (a, b) -> a + b
>> doppelt(5) ¶    // → 10
>> jumloore(3, 7) ¶   // → 10

// Lambda e jokkorde (jooɗaare hiɓɓinnde)
suudude = x -> {
    ? x > 0 { <~ "nanondiri" }
    _? x < 0 { <~ "famɗude" }
    <~ "nul"
}
>> suudude(5) ¶     // → nanondiri
>> suudude(0) ¶     // → nul
>> suudude(-5) ¶    // → famɗude

// Binndi — Lambdas nanndi coccorɗe ɓurɗe
faktor = 3
tati = x -> x * faktor    // nanndi 'faktor'
>> tati(7) ¶    // → 21

// Laaboratoore tiiɗe
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas ko keɓɓe: sarɗi njeyaa
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Sarɗi

```zymbol
arr = [10, 20, 30, 40, 50]

// Naatgol (binndi fawaando 0)
>> arr[0] ¶    // → 10

// Fiɓɓinannde (naange foti e >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Heɓtude, feccude, ɓeyɗude, waɗude
arr = arr$+ 60               // ɓeyɗude
arr = arr$- 0                // feccude binndi 0
njeyaa = arr$? 30            // → #1
ndiyam = arr$[0..2]          // [20, 30]

// Lelnude keɓɓe
arr[1] = 99

// E kala keɓɓe
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` hollana **sarɗi kesel** — waɗanaa: `arr = arr$+ 4`.
> Alaa jokkude: waɗande ɗiɗi jaɓɓinee.

---

## Tupili

```zymbol
// Tupili inndiraaɗe
neɗɗo = (innde: "Alice", jimre: 25)
>> neɗɗo.innde ¶    // → Alice
>> neɗɗo.jimre ¶    // → 25
>> neɗɗo[0] ¶       // → Alice (binndi jokkata haa)
```

---

## Tiiɗe Mawnde

Tiimooje HOF foti **lambda hiɓɓinnde** — alaa coccorde lambda toɗɗaande.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
doppele = nums$> (x -> x * 2)
>> doppele ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
jaaɓniɗi = nums$| (x -> x % 2 == 0)
>> jaaɓniɗi ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (limre bittaande, (acc, keɓɓe) -> binndi)
jumlol = nums$< (0, (acc, x) -> acc + x)
>> jumlol ¶    // → 55
```

---

## Jaɓɓinde Juumre

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Feccude e nul" ¶
} :! ##IO {
    >> "Juumre IO" ¶
} :! {
    >> "juumre goɗɗo: " _err ¶
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
get_PI() { <~ _PI }
```

```zymbol
// Dosiye: main.zy
<# ./lib/calc <= c    // Innde foti

>> c::suudude(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

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
| `>>`     | Hollinde           | `$-`       | Feccude (e binndi)    |
| `<<`     | Naatinde           | `$?`       | Njeyaa                |
| `¶`/`\`  | Njaajeende         | `$[s..e]`  | Ndiyam                |
| `?`      | so (if)            | `$>`       | map                   |
| `_?`     | _so (_elif)        | `$\|`      | filter                |
| `_`      | _tan / toɗɗaare    | `$<`       | reduce                |
| `??`     | match              | `!?`       | ɗannude (try)         |
| `@`      | Woƴƴude            | `:!`       | jaɓɓude (catch)       |
| `@!`     | dankude (break)    | `:>`       | fof (finally)         |
| `@>`     | jokkude (continue) | `$!`       | ko juumre             |
| `->`     | Lambda             | `$!!`      | nawde juumre          |
| `<~`     | jooɗaare           | `#`        | hollude modul         |
| `\|>`    | Pipe               | `#>`       | sarɗude               |
| `#1`     | goonga             | `<#`       | naatinde              |
| `#0`     | fenaande           | `::`       | nodde modul           |

---

*Zymbol-Lang — Tiimorde. Himmude. Waɗande.*

---

> **Tindinnde:** Dokkol ngol winndaama e jannginaa e Hakkilantaagal (AI).
> Gollal fof waɗaama ngam saaktinde goonga, kono winndannde walla misaale ɗiɗi maa ngontoy ballal.
> Dokkol humpitanngal ko [Zymbol-Lang deftere](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
