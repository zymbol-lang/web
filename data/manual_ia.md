# Manual Compacte de Zymbol-Lang

**Zymbol-Lang** es un linguage de programmation symbolic. Il non usa parolas clave — toto es un symbolo. Il functiona de maniera identic in omne linguage human.

- Nulle parolas clave (`if`, `while`, `return` non existe — solo symbolos `?`, `@`, `<~`)
- Unicode complete — identificatores in omne linguage o emoji 👋
- Agnostic re linguage human — le codice es identic in omne linguages

---

## Variabiles e Constantes

```zymbol
x = 10              // variabile (mutabile)
PI := 3.14159       // constante (immutabile — error si reassignate)
nomine = "Ana"
active = #1         // booleano vere
👋 := "Bon die"
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

## Typos de Datos

| Typo            | Exemplo           | Symbolo `#?` | Notas                               |
|-----------------|-------------------|--------------|-------------------------------------|
| Integro         | `42`, `-7`        | `###`        | 64-bit con signo                    |
| Fracto          | `3.14`, `1.5e10`  | `##.`        | Notation scientific OK              |
| Catena          | `"bon die"`       | `##"`        | Interpolation: `"Bon {nomine}"`     |
| Character       | `'A'`             | `##'`        | Un character Unicode                |
| Booleano        | `#1`, `#0`        | `##?`        | NON le numeros 1 e 0                |
| Arrea           | `[1, 2, 3]`       | `##]`        | Tote elementos del mesme typo       |
| Tupla           | `(a, b)`          | `##)`        | Positional                          |
| Tupla nominate  | `(x: 1, y: 2)`    | `##)`        | Accesso per nomine o indice         |

```zymbol
// Introspection de typo — returna (typo, cifras, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Output e Input

```zymbol
>> "Bon die, Mundo!" ¶                  // ¶ o \\ da linea nova explicit
>> "a=" a " b=" b ¶                     // valores multiple per juxtaposition
>> (arr$#) ¶                            // operatores postfixe require parentheses

<< nomine                               // sin prompte — lege in variabile
<< "Tu nomine? " nomine                 // con prompte
```

> `¶` (AltGr+R sur tecliero hispanic) e `\\` es equivalente como linea nova.

---

## Operatores

```zymbol
// Arithmetica — usar assignationes; alcun operatores ha peculiaritate directe in >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (division integre)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (exponentation)

// Comparation
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logic
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Catenas

```zymbol
// Tres formas de concatenation
nomine = "Ana"
n = 42

msg = "Bon die ", nomine, "!"              // comma — in assignationes
>> "Bon die " nomine " tu ha " n ¶         // juxtaposition — in >>
descr = "Bon die {nomine}, tu ha {n}"      // interpolation — ubique
```

```zymbol
s = "Bon die Mundo"
lon = s$#                  // 14
sub = s$[0..7]             // "Bon die"  (fin exclusive)
ha = s$? "Mundo"           // #1
partes = "a,b,c,d" / ','  // [a, b, c, d]
anst = s$~~["o":"0"]       // "B0n die Mund0"
anst1 = s$~~["o":"0":1]    // "B0n die Mundo"  (prime N solmente)
```

> `+` es solo pro numeros. Usar `,`, juxtaposition, o interpolation pro catenas.

---

## Controlo de Fluxo

```zymbol
x = 7

? x > 0 { >> "positive" ¶ }

? x > 100 {
    >> "grande" ¶
} _? x > 0 {
    >> "positive" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negative" ¶
}
```

> Blocos `{ }` es **requisite** etiam pro un linea sol.

---

## Match

```zymbol
// Intervallos
nota = 85
gradu = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> gradu ¶    // → B

// Catenas
color = "rubié"
codice = ?? color {
    "rubié"  : "#FF0000"
    "verde"  : "#00FF00"
    _        : "#000000"
}

// Guardas
temp = -5
stato = ?? temp {
    _? temp < 0  : "glacie"
    _? temp < 20 : "frigide"
    _? temp < 35 : "calde"
    _            : "calide"
}
>> stato ¶    // → glacie

// Forma de statement (bracios bloco)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negative" ¶ }
    _        : { >> "positive" ¶ }
}
```

---

## Bucleas

```zymbol
@ i:0..4  { >> i " " }        // intervallo inclusive:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // con passo:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverse:               5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (mentre)

fructos = ["pomo", "piro", "uva"]
@ f:fructos { >> f ¶ }        // pro cata elemento de arrea

@ c:"bon" { >> c "-" }
>> ¶                          // → b-o-n-  (pro characteres de catena)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! rumper
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Buclea infinite
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Buclea con etiquetta (ruptura nestite)
conto = 0
@ @extern {
    conto++
    ? conto >= 3 { @! extern }
}
>> conto ¶                    // → 3
```

---

## Functiones

```zymbol
adder(a, b) { <~ a + b }
>> adder(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Functiones ha **scopo isolate** — illes non pote leger variables externe. Usar parametros de output `<~` pro modificar variables del appellante:

```zymbol
inverter(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
inverter(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Functiones nominate non es de prime classe. Pro passar como argumento, involver: `x -> fn(x)`.

---

## Lambdas e Clausuras

```zymbol
duplicar = x -> x * 2
summa = (a, b) -> a + b
>> duplicar(5) ¶    // → 10
>> summa(3, 7) ¶    // → 10

// Lambda con bloco
classificar = x -> {
    ? x > 0 { <~ "positive" }
    _? x < 0 { <~ "negative" }
    <~ "zero"
}

// Clausura — captura scopo externe
factor = 3
triplicar = x -> x * factor
>> triplicar(7) ¶    // → 21

// Fabrica
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// In arreas
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arreas

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — accesso (base 0)
arr[-1]         // 5 — indice negative (ultime)
arr$#           // 5 — longitude (usar (arr$#) in >>)

arr = arr$+ 6            // appender → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insertar a indice 2
arr3 = arr$- 3           // remover prime occurrence de valor
arr4 = arr$-- 3          // remover tote occurrences
arr5 = arr$-[0]          // remover a indice
arr6 = arr$-[1..3]       // remover intervallo (fin exclusive)

ha = arr$? 3             // #1 — contine
pos = arr$?? 3           // [2] — tote indices de valor
sl = arr$[0..3]          // [1,2,3] — section (fin exclusive)
sl2 = arr$[0:3]          // [1,2,3] — mesme, syntaxe per conto

asc = arr$^+             // ordinate ascendente  (primitive solmente)
desc = arr$^-            // ordinate descendente (primitive solmente)

// Arreas de tuplas nominate/positional — usar $^ con lambda comparator
db = [(nomine: "Carla", etate: 28), (nomine: "Ana", etate: 25), (nomine: "Bob", etate: 30)]
per_etate  = db$^ (a, b -> a.etate < b.etate)    // ascendente per etate  (<)
per_nomine = db$^ (a, b -> a.nomine > b.nomine)  // descendente per nomine (>)
>> per_etate[0].nomine ¶     // → Ana
>> per_nomine[0].nomine ¶    // → Carla

arr[1] = 99              // actualisation in loco
arr = arr[1]$~ 99        // actualisation functional — returna nove arrea
```

> Tote operatores de collection returna un **nove arrea**. Reassignar: `arr = arr$+ 4`.
> Operatores non pote esser catenate — usar assignationes intermediate.
> `$^+` / `$^-` ordina **arreas primitive** (numeros, catenas). Pro arreas de tuplas usar `$^` con lambda comparator — le direction es codificate in le lambda (`<` = ascendente, `>` = descendente).

```zymbol
// Arreas nestite
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Destructuration

```zymbol
// Arrea
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[prime, *resto] = arr        // prime=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ discarda

// Tupla positional
puncto = (100, 200)
(px, py) = puncto            // px=100  py=200

// Tupla nominate
persona = (nomine: "Ana", etate: 25, citate: "Madrid")
(nomine: n, etate: a) = persona  // n="Ana"  a=25
```

---

## Tuplas

```zymbol
// Positional
puncto = (10, 20)
>> puncto[0] ¶    // → 10

// Nominate
persona = (nomine: "Alice", etate: 25)
>> persona.nomine ¶    // → Alice
>> persona[0] ¶        // → Alice  (indice etiam functiona)

// Nestite
pos = (x: 10, y: 20)
p = (pos: pos, etiquetta: "origine")
>> p.pos.x ¶           // → 10
```

---

## Functiones de Ordine Superior

> Operatores HOF require **lambda inline** — variables lambda passate directemente non functiona.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

duplicatos = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pares       = nums$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
total       = nums$< (0, (acc, x) -> acc + x)   // reduce → 55

// Catenation via intermediarios
passo1 = nums$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Functiones nominate in HOF — involver in lambda
duplicar(x) { <~ x * 2 }
r = nums$> (x -> duplicar(x))    // ✅
```

---

## Operatore Tubo

Le latere dextre require semper `_` como placeholder pro le valor tubate:

```zymbol
duplicar = x -> x * 2
adder = (a, b) -> a + b
incrementar = x -> x + 1

5 |> duplicar(_)        // → 10
10 |> adder(_, 5)       // → 15
5 |> adder(2, _)        // → 7

// Catenate
r = 5 |> duplicar(_) |> incrementar(_) |> duplicar(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Gestion de Errores

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division per zero" ¶
} :! {
    >> "altere error: " _err ¶    // _err contine le message de error
} :> {
    >> "executa sempre" ¶
}
```

| Typo        | Quando occure                  |
|-------------|--------------------------------|
| `##Div`     | Division per zero              |
| `##IO`      | Fichiero / systema             |
| `##Index`   | Indice foras de limites        |
| `##Type`    | Error de typo                  |
| `##Parse`   | Error de parsing               |
| `##Network` | Error de rete                  |
| `##_`       | Omne errores (captura total)   |

---

## Modulos

```zymbol
// lib/calc.zy
# calc

#> { adder, get_PI }    // exportationes ANTE le definitiones

_PI := 3.14159
adder(a, b) { <~ a + b }
get_PI() { <~ _PI }     // getter — accesso directe a constante per alias non supportate
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias requisite

>> c::adder(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar con nomine public differente
# mibiblioteca
#> { _adder_interne <= summa }

_adder_interne(a, b) { <~ a + b }
```

```zymbol
<# ./mibiblioteca <= m

>> m::summa(3, 4) ¶    // → 7  (nomine interne _adder_interne es celate)
```

---

## Operatores de Datos

```zymbol
// Analysar catena a numero
v1 = #|"42"|      // → 42  (Integro)
v2 = #|"3.14"|    // → 3.14  (Fracto)
v3 = #|"abc"|     // → "abc"  (fail-safe, sin error)

// Rotundar / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rotundar a 2 decimales)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formatation de numero
fmt = #,|1234567|      // → 1,234,567  (con commas)
sci = #^|12345.678|    // → 1.2345678e4  (scientific)

// Literales de base
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binari)
c = 0o101        // → 'A'  (octal)

// Output de conversion de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integration Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // captura stdout (include \n final)
>> "Hodie: " data

fichiero = "datos.txt"
contento = <\ cat {fichiero} \>  // interpolation in commandos

output = </"./subscripto.zy"/>   // exeuctar altere scripto Zymbol, capturar output
>> output
```

> `><` captura argumentos CLI como arrea de catenas (solmente tree-walker).

---

## Exemplo Complete: FizzBuzz

```zymbol
classificar(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> classificar(i) ¶ }
```

---

## Referentia de Symbolos

| Symbolo    | Operation          | Symbolo      | Operation               |
|------------|--------------------|--------------|-------------------------|
| `=`        | variabile          | `$#`         | longitude               |
| `:=`       | constante          | `$+`         | appender                |
| `>>`       | output             | `$+[i]`      | insertar a indice       |
| `<<`       | input              | `$-`         | remover prime per valor |
| `¶` / `\\` | linea nova         | `$--`        | remover tote per valor  |
| `?`        | si (if)            | `$-[i]`      | remover a indice        |
| `_?`       | si-alsi (elif)     | `$-[i..j]`   | remover intervallo      |
| `_`        | alsi / wildcard    | `$?`         | contine                 |
| `??`       | match              | `$??`        | trovar tote indices     |
| `@`        | buclea             | `$[s..e]`    | section                 |
| `@!`       | ruptura (break)    | `$>`         | map                     |
| `@>`       | continuar          | `$\|`        | filter                  |
| `->`       | lambda             | `$<`         | reduce                  |
| `$^+`      | ordinar ascendente | `$^-`        | ordinar descendente     |
| `$^`       | ordinar con comp.  | `$~`         | actualisation functional|
| `<~`       | retornar           | `!?`         | probar (try)            |
| `\|>`      | tubo               | `:!`         | capturar (catch)        |
| `#1`       | vere               | `:>`         | sempre (finally)        |
| `#0`       | false              | `$!`         | es error                |
| `<#`       | importar           | `$!!`        | propagar error          |
| `#`        | declarar modulo    | `#>`         | exportar                |
| `::`       | appello de modulo  | `.`          | accesso a campo         |
| `#\|..\|`  | analysar numero    | `#?`         | metadata de typo        |
| `#.N\|..\|` | rotundar          | `#!N\|..\|`  | truncar                 |
| `c\|..\|`  | formato comma      | `e\|..\|`    | scientific              |
| `<\ ..\>`  | exec shell         | `><`         | argumentos CLI          |

---

*Zymbol-Lang — Symbolic. Universal. Immutabile.*

> **Nota:** Iste documentation esseva create e traducite per Intelligentia Artificial (AI).
> Le referentia authoritative es le [specification de Zymbol-Lang](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
