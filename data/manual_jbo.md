# Zymbol-Lang karni poi cmalu

**Zymbol-Lang** cu selsni bangu poi se ciska le tadji be lo sampu ciska. Noda valsi cu nitcu — ro da tadji. Gi'e simsa lo prenu bangu ro da.

---

## julne

- Noda valsi (lo `if`, `while`, `return` cu na zasti — ka'e tadji `?`, `@`, `<~`)
- Mulno Unikodi — cmene fi ro bangu ji'a emoji 👋
- Bangu-sarcu na — lo ciska cu dunli fi ro bangu

---

## stika je stodi

```zymbol
x = 10           // stika (ka'e galfi)
PI := 3.14159    // stodi (na ka'e galfi — srera fi lo nu stika)
cmene = "Ana"
jetnu_ = #1       // jetnu bulea
👋 := "coi"
```

### jonta stika

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

## klesi be lo datni

| klesi           | va'u              | tadji `#?` | notci                               |
|-----------------|-------------------|------------|-------------------------------------|
| namcu           | `42`, `-7`        | `###`      | 64-bitni                            |
| flanu namcu     | `3.14`, `1.5e10`  | `##.`      | saientifi notci OK                  |
| valsi           | `"coi"`           | `##"`      | zbasu: `"coi {cmene}"`              |
| lerfu           | `'A'`             | `##'`      | pa Unikodi lerfu                    |
| jetnu/jitfa     | `#1`, `#0`        | `##?`      | NA lo namcu 1 e 0                   |
| porsi           | `[1, 2, 3]`       | `##]`      | ro se porsi cu dunli klesi          |
| tuple           | `(a, b)`          | `##)`      | tcita                               |
| cmene tuple     | `(x: 1, y: 2)`    | `##)`      | ka'e catlu fi cmene ji'a tcita      |

---

## cusku je ckaji

```zymbol
// cusku — na jonta salpo
>> "coi" ¶                      // ¶ ji'a \\ cu cusku salpo
>> "a=" a " b=" b ¶             // so'i valsi fi jecta
>> "sumji=" fancu(2, 3) ¶       // fancu vokei fi ro tcita
>> (arr$#) ¶                    // postfiksi cu nitcu kresa

// ckaji
<< cmene                        // noda cmana — tcidu fi stika
<< "do cmene ma? " cmene        // fi cmana
```

> `¶` ji'a `\\` cu dunli fi lo salpo tadji.

---

## jonta valsi

ci klesi — ro pa fi ri tcita:

```zymbol
cmene = "Ana"
n = 25

// 1. koma — fi stika fi = ji'a :=
notci = "coi ", cmene, "!"               // → coi Ana!
TITLA := "pilno: ", cmene

// 2. jecta — fi cusku >>
>> "coi " cmene " do namcu " n ¶         // → coi Ana do namcu 25

// 3. zbasu — fi ro tcita
skicu = "coi {cmene}, do namcu {n}"      // → coi Ana, do namcu 25
```

> **notci**: `+` ka'e namcu. fi valsi cu cusku peske.

---

## minde be lo pluta

```zymbol
x = 7

// sampu go'i
? x > 0 { >> "zenba" ¶ }

// go'i / alisego'i / alie
? x > 100 {
    >> "mutce" ¶
} _? x > 0 {
    >> "zenba" ¶
} _? x == 0 {
    >> "no" ¶
} _ {
    >> "jdika" ¶
}
```

Lo bloku `{ }` cu **nitcu**, ji'a fi pa loi.

---

## Match

```zymbol
// Match fi cmana
noda = 85
jdice = ?? noda {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> jdice ¶    // → B

// Match fi ganse (ro tcita)
temp = -5
stato = ?? temp {
    _? temp < 0  : "bisli"
    _? temp < 20 : "lenku"
    _? temp < 35 : "glare"
    _            : "mutce glare"
}
>> stato ¶    // → bisli

// Match fi valsi
skari = "xunre"
kodi = ?? skari {
    "xunre"  : "#FF0000"
    "crino"  : "#00FF00"
    _        : "#000000"
}
>> kodi ¶
```

---

## rapli

```zymbol
// inkluzivi cmana: 0..4 cu rapli 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// cmana fi plana
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// bapli cmana
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// nandu (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// ro se porsi
grute = ["plise", "perli", "vreji"]
@ f:grute { >> f ¶ }

// ro lerfu be valsi
@ c:"coi" { >> c "-" }
>> ¶    // → c-o-i-

// sisti je dauno
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> dauno
    ? i > 7 { @! }          // @! sisti
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## fancu

```zymbol
// jarco je vokei
sumji(a, b) { <~ a + b }
>> sumji(3, 4) ¶    // → 7

// rapli fancu
faktori(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktori(n - 1)
}
>> faktori(5) ¶    // → 120

// fancu cu solji tcita — na ka'e catlu lo bartu stika
ro_da = 100
troci() {
    x = 42    // ka'e tcita
    <~ x
}
>> troci() ¶    // → 42
```

> **vajni**: cmene fancu `cmene(params){ }` na se jdima.
> fi pase fi tcita, pilno: `x -> cmene(x)`.

---

## lambda je bende

```zymbol
// sampu lambda (natfe krefu)
relkai = x -> x * 2
sumji = (a, b) -> a + b
>> relkai(5) ¶    // → 10
>> sumji(3, 7) ¶   // → 10

// lambda fi bloku (eksplicita krefu)
fancu = x -> {
    ? x > 0 { <~ "zenba" }
    _? x < 0 { <~ "jdika" }
    <~ "no"
}
>> fancu(5) ¶     // → zenba
>> fancu(0) ¶     // → no
>> fancu(-5) ¶    // → jdika

// bende — lambda cu kei lo bartu stika
facto = 3
cimei = x -> x * facto    // kei 'facto'
>> cimei(7) ¶    // → 21

// fancu zbasu
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// lambda fi valsi: fi porsi
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## porsi

```zymbol
arr = [10, 20, 30, 40, 50]

// catlu (0-bazi tcita)
>> arr[0] ¶    // → 10

// clani (kresa nitcu fi >>)
n = arr$#
>> (arr$#) ¶    // → 5

// jmina, vimcu, ckaji, pagbu
arr = arr$+ 60               // jmina
arr = arr$- 0                // vimcu tcita 0
ckaji = arr$? 30             // → #1
pagbu = arr$[0..2]           // [20, 30]

// galfi se porsi
arr[1] = 99

// ro se porsi
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` cu krefu **cnino porsi** — stika: `arr = arr$+ 4`.
> Na jonta: pilno re drata stika.

---

## tuple

```zymbol
// cmene tuple
prenu = (cmene: "Alice", nanca: 25)
>> prenu.cmene ¶    // → Alice
>> prenu.nanca ¶    // → 25
>> prenu[0] ¶       // → Alice (tcita ji'a ka'e)
```

---

## fancu poi galtu

HOF cu nitcu **enlinia lambda** — na stika-lambda tcita.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
relkai = nums$> (x -> x * 2)
>> relkai ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
relti = nums$| (x -> x % 2 == 0)
>> relti ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (cfari valsi, (akumu, se porsi) -> esprimo)
sumji = nums$< (0, (acc, x) -> acc + x)
>> sumji ¶    // → 55
```

---

## fapro be lo srera

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "tenfa fi no" ¶
} :! ##IO {
    >> "IO srera" ¶
} :! {
    >> "drata srera: " _err ¶
} :> {
    >> "ro roi gasnu" ¶
}
```

| klesi       | ca gasnu                        |
|-------------|---------------------------------|
| `##Div`     | Tenfa fi no                     |
| `##IO`      | Datni / Sistemi                 |
| `##Index`   | Tcita bartu                     |
| `##Type`    | Klesi srera                     |
| `##Parse`   | Porsi srera                     |
| `##Network` | Muvdu srera                     |
| `##_`       | Ro srera (kaptu ro)             |

---

## modli

```zymbol
// datni: lib/calc.zy
# calc

#> { sumji, get_PI }    // Cusku PURCI lo jarco

_PI := 3.14159
sumji(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// datni: main.zy
<# ./lib/calc <= c    // cmena nitcu

>> c::sumji(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## gasnu co mulno: FizzBuzz

```zymbol
fancu(namcu) {
    ? namcu % 15 == 0 { <~ "fizdi-buzdi" }
    _? namcu % 3  == 0 { <~ "fizdi" }
    _? namcu % 5  == 0 { <~ "buzdi" }
    _ { <~ namcu }
}

@ i:1..20 { >> fancu(i) ¶ }
```

---

## liste be lo tadji

| tadji    | gasnu              | tadji      | gasnu                 |
|----------|--------------------|------------|-----------------------|
| `=`      | stika              | `$#`       | clani                 |
| `:=`     | stodi              | `$+`       | jmina                 |
| `>>`     | cusku              | `$-`       | vimcu (fi tcita)      |
| `<<`     | ckaji              | `$?`       | ckaji                 |
| `¶`/`\`  | salpo              | `$[s..e]`  | pagbu                 |
| `?`      | go'i               | `$>`       | map                   |
| `_?`     | alisego'i          | `$\|`      | filter                |
| `_`      | alie / tcita       | `$<`       | reduce                |
| `??`     | match              | `!?`       | troci (try)           |
| `@`      | rapli              | `:!`       | kei (catch)           |
| `@!`     | sisti (break)      | `:>`       | ro roi (finally)      |
| `@>`     | dauno              | `$!`       | srera ckaji           |
| `->`     | Lambda             | `$!!`      | disvastigi srera      |
| `<~`     | krefu              | `#`        | jarco modli           |
| `\|>`    | Pipo               | `#>`       | cusku                 |
| `#1`     | jetnu              | `<#`       | ckaji                 |
| `#0`     | jitfa              | `::`       | modli vokei           |

---

*Zymbol-Lang — tadji. ro prenu. na galfi.*

---

> **notci:** karni ca windu gi'e fukpi fi le AI (fanva makina).
> Ro nu snada cu troci, ku'i drata valsi ja gasnu ka'e srera.
> le jibni krasi cu [Zymbol-Lang notci](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
