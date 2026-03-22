# Kompakta Manualo di Zymbol-Lang

**Zymbol-Lang** esas simbolala programo-linguo. Lu ne uzas klef-vortaro — omno esas simbolo. Lu funcionas same en omna hom-linguo.

---

## Filozofio

- Nula klef-vortaro (`if`, `while`, `return` ne existas — sole simboli `?`, `@`, `<~`)
- Plena Unikodo — identigiloj en irga linguo o emoji 👋
- Linguo-agnostika — la kodo esas identa en omna lingui

---

## Variabli e Konstanti

```zymbol
x = 10           // variablo (muteblа)
PI := 3.14159    // konstanto (nemuteblа — eroro se reassignas)
nomo = "Ana"
aktiva = #1      // boolala vera
👋 := "Saluto"
```

### Komponita Assigno

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

## Dati-Tipi

| Tipo            | Exemple           | Simbolo `#?` | Noti                                |
|-----------------|-------------------|--------------|-------------------------------------|
| Integro         | `42`, `-7`        | `###`        | 64-bita kun signo                   |
| Decimalo        | `3.14`, `1.5e10`  | `##.`        | Sciencala notaco OK                 |
| Stringo         | `"saluto"`        | `##"`        | Interpolado: `"Saluto {nomo}"`      |
| Karaktero       | `'A'`             | `##'`        | Un Unikoda karaktero                |
| Boolano         | `#1`, `#0`        | `##?`        | NE la numeri 1 e 0                  |
| Areo            | `[1, 2, 3]`       | `##]`        | Omni elementi di sama tipo          |
| Tuplo           | `(a, b)`          | `##)`        | Pozicional                          |
| Nomata Tuplo    | `(x: 1, y: 2)`    | `##)`        | Aceptebla per nomo o indico         |

---

## Exito e Eniro

```zymbol
// Exito — ne adicionar nova-lineo automatale
>> "Saluto" ¶                   // ¶ o \\ donas explicita nova-lineo
>> "a=" a " b=" b ¶             // multi valori per juxtapozado
>> "sumo=" klasifikar(2, 3) ¶   // funkcio-voki en irga pozico
>> (arr$#) ¶                    // postfiksa operatori require parentezi

// Eniro
<< nomo                         // sen promptilo — lektas en variablo
<< "Vua nomo? " nomo            // kun promptilo
```

> `¶` o `\\` esas ekvivalenta kom nova-lineo.

---

## Stringo-Konkatenado

Tri valida formi — singla por sua kontexto:

```zymbol
nomo = "Ana"
n = 25

// 1. Komo — en assigni kun = o :=
msg = "Saluto ", nomo, "!"              // → Saluto Ana!
TITULO := "Uzero: ", nomo

// 2. Juxtapozado — en exito >>
>> "Saluto " nomo " tu esas " n ¶       // → Saluto Ana tu esas 25

// 3. Interpolado — en irga kontexto
deskrip = "Saluto {nomo}, tu esas {n}"  // → Saluto Ana, tu esas 25
```

> **Noto**: `+` esas sole por numeri. Por stringi lu generas averto.

---

## Kontrolo-Fluo

```zymbol
x = 7

// Simpla se
? x > 0 { >> "pozitiva" ¶ }

// Se / altra-se / altra
? x > 100 {
    >> "granda" ¶
} _? x > 0 {
    >> "pozitiva" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negativa" ¶
}
```

Bloki `{ }` esas **requireta**, jube por un lineo.

---

## Match

```zymbol
// Match kun intervali
noto = 85
grado = ?? noto {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Match kun gardisti (arbitrala kondicioni)
temp = -5
stato = ?? temp {
    _? temp < 0  : "glacio"
    _? temp < 20 : "kolda"
    _? temp < 35 : "varma"
    _            : "varmega"
}
>> stato ¶    // → glacio

// Match kun stringi
koloro = "reda"
kodo = ?? koloro {
    "reda"   : "#FF0000"
    "verda"  : "#00FF00"
    _        : "#000000"
}
>> kodo ¶
```

---

## Bukli

```zymbol
// Inkluziva intervalo: 0..4 iteras 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervalo kun pazo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Inversa intervalo
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Dum (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Por-omna elemento
frukti = ["pomo", "piro", "uvo"]
@ f:frukti { >> f ¶ }

// Pri karakteri di stringo
@ c:"saluto" { >> c "-" }
>> ¶    // → s-a-l-u-t-o-

// Rompo e Dauro
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> dauro
    ? i > 7 { @! }          // @! rompo
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funcioni

```zymbol
// Deklarado e voko
adicionar(a, b) { <~ a + b }
>> adicionar(3, 4) ¶    // → 7

// Rekursado
faktorialo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorialo(n - 1)
}
>> faktorialo(5) ¶    // → 120

// Funcioni havas izolita skopo — nula aceso a externa variabli
_globala = 100
testar() {
    x = 42    // locale sole
    <~ x
}
>> testar() ¶    // → 42
```

> **Importanta**: Nomata funcioni `nomo(params){ }` ne esas unua-klasa valori.
> Por pasir kom argumento, envolvar: `x -> nomo(x)`.

---

## Lambdi e Klozuri

```zymbol
// Simpla lambdo (implica returno)
dupligo = x -> x * 2
sumo = (a, b) -> a + b
>> dupligo(5) ¶    // → 10
>> sumo(3, 7) ¶    // → 10

// Lambdo kun bloko (explicita returno)
klasifikar = x -> {
    ? x > 0 { <~ "pozitiva" }
    _? x < 0 { <~ "negativa" }
    <~ "zero"
}
>> klasifikar(5) ¶     // → pozitiva
>> klasifikar(0) ¶     // → zero
>> klasifikar(-5) ¶    // → negativa

// Klozuri — lambdi kaptas externa skopo-variabli
faktoro = 3
tripligo = x -> x * faktoro    // kaptas 'faktoro'
>> tripligo(7) ¶    // → 21

// Funciono-fabriko
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdi kom valori: storata en arei
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Arei

```zymbol
arr = [10, 20, 30, 40, 50]

// Aceso (0-baza indico)
>> arr[0] ¶    // → 10

// Longo (parentezi requireta en >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Adicionar, forigar, kontenas, tranchaĵo
arr = arr$+ 60               // adicionar
arr = arr$- 0                // forigar indico 0
havas = arr$? 30             // → #1
tranchaĵo = arr$[0..2]       // [20, 30]

// Aktualizar elemento
arr[1] = 99

// Por-omna
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` returnas **nova areo** — reassignar: `arr = arr$+ 4`.
> Nula katenado: uzar du separata assigni.

---

## Tupli

```zymbol
// Nomata tuplo
persono = (nomo: "Alice", agо: 25)
>> persono.nomo ¶    // → Alice
>> persono.agо ¶     // → 25
>> persono[0] ¶      // → Alice (indico anke funcionas)
```

---

## Supera-Orda Funcioni

HOF-operatori require **interna lambdo** — ne direkta lambdo-variablo.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
dupligi = nums$> (x -> x * 2)
>> dupligi ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pari = nums$| (x -> x % 2 == 0)
>> pari ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (komenca valoro, (akum, elemento) -> expr)
totalo = nums$< (0, (acc, x) -> acc + x)
>> totalo ¶    // → 55
```

---

## Eroro-Handlado

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divizado per zero" ¶
} :! ##IO {
    >> "IO-eroro" ¶
} :! {
    >> "altra eroro: " _err ¶
} :> {
    >> "sempre exekutas" ¶
}
```

| Tipo        | Kande eventas                  |
|-------------|--------------------------------|
| `##Div`     | Divizado per zero              |
| `##IO`      | Dosiero / sistemo              |
| `##Index`   | Indico extra limiti            |
| `##Type`    | Tipo-eroro                     |
| `##Parse`   | Parsado-eroro                  |
| `##Network` | Reto-eroro                     |
| `##_`       | Irga eroro (kaptu-omna)        |

---

## Moduli

```zymbol
// Dosiero: lib/calc.zy
# calc

#> { adicionar, get_PI }    // Exporti ANTE la deklaradi

_PI := 3.14159
adicionar(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Dosiero: main.zy
<# ./lib/calc <= c    // Alias requireta

>> c::adicionar(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                  // → 3.14159
```

---

## Kompleta Exemplo: FizzBuzz

```zymbol
klasifikar(nombro) {
    ? nombro % 15 == 0 { <~ "FizetoBuzeto" }
    _? nombro % 3  == 0 { <~ "Fizeto" }
    _? nombro % 5  == 0 { <~ "Buzeto" }
    _ { <~ nombro }
}

@ i:1..20 { >> klasifikar(i) ¶ }
```

---

## Simbolo-Referenaro

| Simbolo  | Operaco            | Simbolo    | Operaco               |
|----------|--------------------|------------|-----------------------|
| `=`      | variablo           | `$#`       | longo                 |
| `:=`     | konstanto          | `$+`       | adicionar             |
| `>>`     | exito              | `$-`       | forigar (per indico)  |
| `<<`     | eniro              | `$?`       | kontenas              |
| `¶`/`\`  | nova-lineo         | `$[s..e]`  | tranchaĵo             |
| `?`      | se (if)            | `$>`       | map                   |
| `_?`     | altra-se (elif)    | `$\|`      | filter                |
| `_`      | altra / kovrilo    | `$<`       | reduce                |
| `??`     | match              | `!?`       | provar (try)          |
| `@`      | buklo              | `:!`       | kaptar (catch)        |
| `@!`     | rompo (break)      | `:>`       | sempre (finally)      |
| `@>`     | dauro (continue)   | `$!`       | esas eroro            |
| `->`     | Lambda             | `$!!`      | propagar eroro        |
| `<~`     | returnar           | `#`        | deklaran modulo       |
| `\|>`    | Pipo               | `#>`       | exportar              |
| `#1`     | vera               | `<#`       | importar              |
| `#0`     | falsa              | `::`       | modulo-voko           |

---

*Zymbol-Lang — Simbolala. Universala. Nemuteblа.*

---

> **Noto:** Ica dokumentado esis kreita e tradukita da Artefarita Inteligenco (AI).
> Omna efori esis facita por asekurar precizeso, ma kelki traduki o exemplaĵi povas enhavas erori.
> La autoritata referenaro esas la [Zymbol-Lang specifiko](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
