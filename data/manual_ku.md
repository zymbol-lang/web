# Rêbera Kompakt a Zymbol-Lang

**Zymbol-Lang** zimanek bernamesaziya sembolîk e. Ew tu peyivên sereke bikar nayîne — her tişt sembol e. Di her zimanê mirovî de bi heman awayî dixebite.

---

## Felsefe

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

### Peywirdana Tevlihev

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %= 4    // 2
x++       // 3
x--       // 2
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

---

## Derxistin û Xwendin

```zymbol
// Derxistin — rêzek nû BI XWE NAGIRE
>> "Merheba, Cîhan!" ¶              // ¶ an \\ rêzek nû yê eşkere dide
>> "a=" a " b=" b ¶                 // gelek nirx bi tenê danîn
>> "berhev=" kirin(2, 3) ¶          // bangkirina fonksiyonê di her cihî de
>> (kom$#) ¶                        // operatorên postfix-ê parantez pêwist in

// Xwendin
<< nav                              // bê nîşana têketinê — di guhêrbarê de dixwîne
<< "Navê te? " nav                  // bi nîşana têketinê
```

> `¶` an `\\` wekhev in wek rêzek nû.

---

## Tevlîkirina Rêzeyan

Sê formên derbasdar — her yek ji bo çarçoveya xwe:

```zymbol
nav = "Amed"
n = 25

// 1. Vîrgul — di peywirdanên = an := de
msg = "Merheba ", nav, "!"              // → Merheba Amed!
SERNAVÊ := "Bikarhêner: ", nav

// 2. Tenê danîn — di derxistina >> de
>> "Merheba " nav " tu " n " salî yî" ¶  // → Merheba Amed tu 25 salî yî

// 3. Veguheztin — di her çarçoveyê de
danasîn = "Merheba {nav}, tu {n} salî yî"  // → Merheba Amed, tu 25 salî yî
```

> **Hişyarî**: `+` tenê ji bo jimareyan e. Di rêzeyan de hişyariyek tê çêkirin.

---

## Rêveçûna Kontrolê

```zymbol
x = 7

// Heke sade
? x > 0 { >> "erênî" ¶ }

// Heke / heke din / wekî din
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

Blokên `{ }` **pêwist in**, heta ji bo yek rêzê jî.

---

## Match

```zymbol
// Match bi rêzeyên jimareyê
not = 85
nirxandin = ?? not {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nirxandin ¶    // → B

// Match bi parêzvan (şert û mercên rasthatî)
germahî = -5
rewş = ?? germahî {
    _? germahî < 0  : "qeş"
    _? germahî < 20 : "sar"
    _? germahî < 35 : "germ"
    _               : "gelek germ"
}
>> rewş ¶    // → qeş

// Match bi rêzeyan
reng = "sor"
kod = ?? reng {
    "sor"  : "#FF0000"
    "kesk" : "#00FF00"
    _      : "#000000"
}
>> kod ¶
```

---

## Xirxal

```zymbol
// Rêzeya tevlî: 0..4 li ser 0,1,2,3,4 dimeşe
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Rêze bi gav
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Rêzeya berevajî
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Heta ku (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Ji bo her hêmanê
fêkî = ["sêv", "hirmî", "tirî"]
@ f:fêkî { >> f ¶ }

// Li ser tîpên rêzeyê
@ c:"merheba" { >> c "-" }
>> ¶    // → m-e-r-h-e-b-a-

// Rawestin û Berdewamkirin
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> berdewam bike
    ? i > 7 { @! }          // @! raweste
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Fonksiyon

```zymbol
// Rakirîn û bangkirin
kirin(a, b) { <~ a + b }
>> kirin(3, 4) ¶    // → 7

// Vegerandin (recursion)
faktoriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyel(n - 1)
}
>> faktoriyel(5) ¶    // → 120

// Fonksiyon xwedan çarçoveya veqetandî ye — negihîştin guhêrbarên derve
gerdûnî = 100
ceribandin() {
    x = 42    // tenê herêmî
    <~ x
}
>> ceribandin() ¶    // → 42
```

> **Girîng**: Fonksiyonên bi nav `nav(params){ }` nirxên yekem-pola nîn in.
> Ji bo şandina wek arguman bi xwe bipêçin: `x -> nav(x)`.

---

## Lambda û Xêzik (Closure)

```zymbol
// Lambda sade (vegerandina eşkere nîne)
ducar = x -> x * 2
berhev = (a, b) -> a + b
>> ducar(5) ¶     // → 10
>> berhev(3, 7) ¶  // → 10

// Lambda bi blok (vegerandina eşkere)
sinifkirin = x -> {
    ? x > 0 { <~ "erênî" }
    _? x < 0 { <~ "neyînî" }
    <~ "sifir"
}
>> sinifkirin(5) ¶     // → erênî
>> sinifkirin(0) ¶     // → sifir
>> sinifkirin(-5) ¶    // → neyînî

// Xêzik — lambda guhêrbarên derve digire
faktor = 3
sê_qat = x -> x * faktor    // 'faktor' digire
>> sê_qat(7) ¶    // → 21

// Kargehê fonksiyonê
çêker_zêdekir(n) { <~ x -> x + n }
zêde10 = çêker_zêdekir(10)
>> zêde10(5) ¶    // → 15

// Lambda wek nirx: di rêze-koman de hatine hilanîn
karan = [x -> x+1, x -> x*2, x -> x*x]
>> karan[0](5) ¶    // → 6
>> karan[2](5) ¶    // → 25
```

---

## Rêze-Kom (Array)

```zymbol
kom = [10, 20, 30, 40, 50]

// Têketin (index ji 0 dest pê dike)
>> kom[0] ¶    // → 10

// Dirêjî (di >> de parantez pêwist in)
n = kom$#
>> (kom$#) ¶    // → 5

// Zêdekirin, jêkirin, hebûn, pêçe
kom = kom$+ 60               // zêdekirin
kom = kom$- 0                // index 0 jê bike
heye = kom$? 30              // → #1
pêçe = kom$[0..2]            // [20, 30]

// Nûvekirina hêmanê
kom[1] = 99

// Ji bo her hêmanê
@ x:kom { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **rêze-komek nû** vedigerîne — ji nû ve bispêre: `kom = kom$+ 4`.
> Zincîrkirin nîne: du peywirdanên cûda bikar bîne.

---

## Tuple

```zymbol
// Tuple bi nav
kes = (nav: "Leyla", temen: 28)
>> kes.nav ¶     // → Leyla
>> kes.temen ¶   // → 28
>> kes[0] ¶      // → Leyla (index jî dixebite)
```

---

## Fonksiyonên Rêza Bilind (HOF)

Operatorên HOF-ê **lambda-ya inline** pêwist in — guhêrbarê lambda-ya rasterast nabe.

```zymbol
hejmar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
ducar = hejmar$> (x -> x * 2)
>> ducar ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
cotmejî = hejmar$| (x -> x % 2 == 0)
>> cotmejî ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (nirxa destpêkê, (tomarker, hêman) -> daxuyanî)
giştî = hejmar$< (0, (acc, x) -> acc + x)
>> giştî ¶    // → 55
```

---

## Rêveçûna Xeletiyê

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Dabeşkirina bi sifir" ¶
} :! ##IO {
    >> "Xeletiya IO" ¶
} :! {
    >> "xeletiya din: " _err ¶
} :> {
    >> "her dem tê xebitandin" ¶
}
```

| Celeb       | Kengê çêdibe                     |
|-------------|----------------------------------|
| `##Div`     | Dabeşkirina bi sifir             |
| `##IO`      | Dosya / Sîstem                   |
| `##Index`   | Index li derveyî sînoram        |
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
| `>>`    | Derxistin            | `$-`       | Jêkirin (bi index)       |
| `<<`    | Xwendin              | `$?`       | Hebûn                    |
| `¶`/`\` | Rêzek nû             | `$[s..e]`  | Pêçe                     |
| `?`     | heke (if)            | `$>`       | map                      |
| `_?`    | heke din (elif)      | `$\|`      | filter                   |
| `_`     | wekî din / cîgir     | `$<`       | reduce                   |
| `??`    | match                | `!?`       | ceribandî (try)          |
| `@`     | xirxal (loop)        | `:!`       | girtin (catch)           |
| `@!`    | rawestan (break)     | `:>`       | her dem (finally)        |
| `@>`    | berdewamkirin        | `$!`       | xeletî ye                |
| `->`    | Lambda               | `$!!`      | xeletiyê belav bike      |
| `<~`    | vegerandin (return)  | `#`        | modulê rakin             |
| `\|>`   | Pipe                 | `#>`       | derxistin (export)       |
| `#1`    | rast (true)          | `<#`       | xistin (import)          |
| `#0`    | şaş (false)          | `::`       | bangkirina modulê        |

---

*Zymbol-Lang — Sembolîk. Gerdûnî. Neguhêrbar.*

---

> **Hişyarî:** Ev belge ji aliyê îstîxbarata çêkirî (AI) ve hatiye afirandin û wergerandin.
> Her hewl hatiye dayîn ku rasttiya wê were misoger kirin, lê dibe ku hin werger an mînak xeletî hebin.
> Referansa kanonîk [spesîfîkasyona Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web) e.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
