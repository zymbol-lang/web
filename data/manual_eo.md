# Kompakta Zymbol-Lang Manlibro

**Zymbol-Lang** estas simbola programlingvo. Ĝi ne uzas ŝlosilvortojn — ĉio estas simbolo. Ĝi funkcias same en ĉiu homa lingvo.

---

## Filozofio

- Neniaj ŝlosilvortoj (`se`, `buklo`, `redonu` ne ekzistas — nur simboloj `?`, `@`, `<~`)
- Plena Unicode — identigiloj en ĉiu lingvo aŭ emoji 👋
- Homa-lingvo-agnostika — la kodo estas identa en ĉiu lingvo

---

## Variabloj kaj Konstantoj

```zymbol
x = 10           // variablo (ŝanĝebla)
PI := 3.14159    // konstanto (neŝanĝebla — eraro se retransdona)
nomo = "Ana"
aktiva = #1      // bulea vera
👋 := "Saluton"
```

### Kunmetita Atribuo

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

## Datumtipoj

| Tipo           | Ekzemplo            | Simbolo `#?` | Notoj                               |
|----------------|---------------------|--------------|-------------------------------------|
| Entjero        | `42`, `-7`          | `###`        | 64-bita kun signo                   |
| Glitpunkto     | `3.14`, `1.5e10`    | `##.`        | Scienca notacio OK                  |
| Ĉeno           | `"saluton"`         | `##"`        | Interpolado: `"Saluton {nomo}"`     |
| Signo          | `'A'`               | `##'`        | Unu Unicode-signo                   |
| Buleo          | `#1`, `#0`          | `##?`        | NE numeraj 1 kaj 0                  |
| Tabelo         | `[1, 2, 3]`         | `##]`        | Ĉiuj eroj devas esti de sama tipo   |
| Oplo           | `(a, b)`            | `##)`        | Pozicia                             |
| Nomita Oplo    | `(x: 1, y: 2)`      | `##)`        | Aliro per nomo aŭ indekso           |

---

## Eligo kaj Enigo

```zymbol
// Eligo — NE aŭtomate aldonas novlinion
>> "Saluton, Esperanta Mondo!" ¶        // ¶ aŭ \\ donas eksplicitan novlinion
>> "a=" a " b=" b ¶                     // multaj valoroj per apudmeto
>> "sumo=" add(2, 3) ¶                  // funkciovokoj en iu ajn pozicio
>> (frukto$#) ¶                         // postfiks-operatoroj bezonas krampojn

// Enigo
<< nomo                                 // sen promptilo — legas en variablon
<< "Via nomo? " nomo                    // kun promptilo
```

> `¶` aŭ `\\` estas ekvivalentaj kiel novlinio.

---

## Kunigo de Ĉenoj

Tri validaj formoj — ĉiu por sia kunteksto:

```zymbol
nomo = "Ana"
nombro = 25

// 1. Komo — en atribuoj kun = aŭ :=
mesaĝo = "Saluton ", nomo, "!"              // → Saluton Ana!
TITOLO := "Uzanto: ", nomo

// 2. Apudmeto — en >> eligo
>> "Saluton " nomo " vi estas " nombro ¶    // → Saluton Ana vi estas 25

// 3. Interpolado — en iu ajn kunteksto
priskribo = "Saluton {nomo}, vi estas {nombro}"  // → Saluton Ana, vi estas 25
```

> **Noto**: `+` estas nur por nombroj. Uzado kun ĉenoj generas averton.

---

## Kontrolfluo

```zymbol
x = 7

// Simpla se
? x > 0 { >> "pozitiva" ¶ }

// se / alie-se / alie
? x > 100 {
    >> "granda" ¶
} _? x > 0 {
    >> "pozitiva" ¶
} _? x == 0 {
    >> "nulo" ¶
} _ {
    >> "negativa" ¶
}
```

Blokoj `{ }` estas **devigaj** eĉ por unu linio.

---

## Kongruado

```zymbol
// Kongruado kun intervaloj
poentoj = 85
takso = ?? poentoj {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> takso ¶    // → B

// Kongruado kun gardistoj (arbitraj kondiĉoj)
temperaturo = -5
stato = ?? temperaturo {
    _? temperaturo < 0  : "glacio"
    _? temperaturo < 20 : "malvarma"
    _? temperaturo < 35 : "varma"
    _                   : "varmega"
}
>> stato ¶    // → glacio

// Kongruado kun ĉenoj
koloro = "ruĝa"
kodo = ?? koloro {
    "ruĝa"   : "#FF0000"
    "verda"  : "#00FF00"
    _        : "#000000"
}
>> kodo ¶
```

---

## Bukloj

```zymbol
// Inkluziva intervalo: 0..4 iteras 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervalo kun paŝo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Inversa intervalo
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Dum
nombro = 1
@ nombro <= 64 { nombro *= 2 }
>> nombro ¶    // → 128

// Por-ĉiu super tabelo
frukto = ["pomo", "piro", "vinbero"]
@ f:frukto { >> f ¶ }

// Super signoj de ĉeno
@ c:"saluton" { >> c "-" }
>> ¶    // → s-a-l-u-t-o-n-

// Haltu kaj Daŭrigu
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> daŭrigu
    ? i > 7 { @! }          // @! haltu
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcioj

```zymbol
// Deklaro kaj voko
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

// Rekursio
duobligita(n) {
    ? n <= 1 { <~ 1 }
    <~ n * duobligita(n - 1)
}
>> duobligita(5) ¶    // → 120

// Funkcioj havas izolitan amplekson — neniu aliro al eksteraj variabloj
tutmonda = 100
testi() {
    x = 42    // nur loka
    <~ x
}
>> testi() ¶    // → 42
```

> **Grave**: Nomitaj funkcioj `nomo(params){ }` ne estas unua-klasa valoroj.
> Por pasi kiel argumento, envolvu: `x -> nomo(x)`.

---

## Lambdoj kaj Fermoj

```zymbol
// Simpla lambdo (implicita reveno)
duobligita = x -> x * 2
sumo = (a, b) -> a + b
>> duobligita(5) ¶    // → 10
>> sumo(3, 7) ¶       // → 10

// Bloka lambdo (eksplicita reveno)
klasifiki = x -> {
    ? x > 0 { <~ "pozitiva" }
    _? x < 0 { <~ "negativa" }
    <~ "nulo"
}
>> klasifiki(5) ¶     // → pozitiva
>> klasifiki(0) ¶     // → nulo
>> klasifiki(-5) ¶    // → negativa

// Fermoj — lambdoj kaptas variablojn de ekstera amplekso
faktoro = 3
triobligita = x -> x * faktoro    // kaptas 'faktoro'
>> triobligita(7) ¶    // → 21

// Funkcifabriko
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdoj kiel valoroj: konservitaj en tabeloj
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Aroj

```zymbol
arr = [10, 20, 30, 40, 50]

// Aliro (0-baza indekso)
>> arr[0] ¶    // → 10

// Longo (bezonas krampojn en >>)
nombro = arr$#
>> (arr$#) ¶    // → 5

// Aldonu, forigu, enhavas, tranĉo
arr = arr$+ 60               // aldonu
arr = arr$- 0                // forigu indekson 0
havas = arr$? 30             // → #1
tranĉo = arr$[0..2]          // [20, 30]

// Ĝisdatigu eron
arr[1] = 99

// Por-ĉiu
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` redonas **novan tabelon** — reattributu: `arr = arr$+ 4`.
> Neniu ĉenado: uzu du apartajn atribuojn.

---

## Tuploj

```zymbol
// Nomita oplo
persono = (name: "Alice", age: 25)
>> persono.name ¶    // → Alice
>> persono.age ¶     // → 25
>> persono[0] ¶      // → Alice (indekso ankaŭ funkcias)
```

---

## Higher-Ordaj Funkcioj

HOF-operatoroj bezonas **enlinian lambdon** — ne rektan lambdan variablon.

```zymbol
nombroj = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Mapo ($>)
duobligitaj = nombroj$> (x -> x * 2)
>> duobligitaj ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtrilo ($|)
paroj = nombroj$| (x -> x % 2 == 0)
>> paroj ¶    // → [2, 4, 6, 8, 10]

// Redukto ($<) — (komenca, (akumulilo, ero) -> esprimo)
entute = nombroj$< (0, (acc, x) -> acc + x)
>> entute ¶    // → 55
```

---

## Eraro-Traktado

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divido per nulo" ¶
} :! ##IO {
    >> "IO-eraro" ¶
} :! {
    >> "alia eraro: " _err ¶
} :> {
    >> "ĉiam kuras" ¶
}
```

| Tipo        | Kiam okazas             |
|-------------|-------------------------|
| `##Div`     | Divido per nulo         |
| `##IO`      | Dosiero / sistemo       |
| `##Index`   | Indekso ekster limoj    |
| `##Type`    | Tiperaro                |
| `##Parse`   | Datuma analizado        |
| `##Network` | Retaj eraroj            |
| `##_`       | Iu ajn eraro (kaptu-ĉion) |

---

## Moduloj

```zymbol
// Dosiero: lib/calc.zy
# calc

#> { add, get_PI }    // eksportoj ANTAŬ difinoj

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Dosiero: main.zy
<# ./lib/calc <= c    // alias deviga

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Plena Ekzemplo: FizzBuzz

```zymbol
klasifiki(nombro) {
    ? nombro % 15 == 0 { <~ "FissBz" }
    _? nombro % 3  == 0 { <~ "Fiss" }
    _? nombro % 5  == 0 { <~ "Bz" }
    _ { <~ nombro }
}

@ i:1..20 { >> klasifiki(i) ¶ }
```

---

## Referenca Tabelo de Simboloj

| Simbolo  | Operacio           | Simbolo    | Operacio            |
|----------|--------------------|------------|---------------------|
| `=`      | variablo           | `$#`       | longo               |
| `:=`     | konstanto          | `$+`       | aldonu              |
| `>>`     | eligo              | `$-`       | forigu (indekso)    |
| `<<`     | enigo              | `$?`       | enhavas             |
| `¶`/`\`  | novlinio           | `$[s..e]`  | tranĉo              |
| `?`      | se                 | `$>`       | mapu                |
| `_?`     | alie-se            | `$\|`      | filtru              |
| `_`      | alie / ĵokero      | `$<`       | reduktu             |
| `??`     | kongruado          | `!?`       | provu               |
| `@`      | buklo              | `:!`       | kaptu               |
| `@!`     | haltu              | `:>`       | fine                |
| `@>`     | daŭrigu            | `$!`       | estas eraro         |
| `->`     | lambdo             | `$!!`      | disvastigu eraron   |
| `<~`     | redonu             | `#`        | deklaru modulon     |
| `\|>`    | tubo               | `#>`       | eksportu            |
| `#1`     | vera               | `<#`       | importu             |
| `#0`     | malvera            | `::`       | modulovoko          |

---

*Zymbol-Lang — Simbola. Universala. Neŝanĝebla.*

---

> **Rimarko:** Ĉi tiu dokumentaro estis kreita kaj tradukita de artefarita inteligenteco (AI). Ĉiuj penoj estis faritaj por certigi precizecon, sed iuj tradukoj aŭ ekzemploj povas enhavi erarojn. La autoritata referenco estas la [Zymbol-Lang specifiko](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
