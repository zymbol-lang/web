# Manual Compacte de Zymbol-Lang

**Zymbol-Lang** es un linguage de programmation symbolic. Il non usa parolas clave — toto es un symbolo. Il functiona de maniera identic in omne linguage human.

---

## Philosophia

- Nulle parolas clave (`if`, `while`, `return` non existe — solo symbolos `?`, `@`, `<~`)
- Unicode complete — identificatores in omne linguage o emoji 👋
- Agnostic re linguage human — le codice es identic in omne linguages

---

## Variabiles e Constantes

```zymbol
x = 10           // variabile (mutabile)
PI := 3.14159    // constante (immutabile — error si reassignate)
nomine = "Ana"
active = #1      // booleano vere
👋 := "Bon die"
```

### Assignation Composite

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

---

## Output e Input

```zymbol
// Output — non adde linea nova automaticamente
>> "Bon die" ¶                  // ¶ o \\ da linea nova explicit
>> "a=" a " b=" b ¶             // valores multiple per juxtaposition
>> "summa=" classificar(2, 3) ¶ // appellos de function in omne position
>> (arr$#) ¶                    // operatores postfixe require parentheses

// Input
<< nomine                       // sin prompte — lege in variabile
<< "Tu nomine? " nomine         // con prompte
```

> `¶` o `\\` es equivalente como linea nova.

---

## Concatenation de Catenas

Tres formas valide — cata una pro su contexto:

```zymbol
nomine = "Ana"
n = 25

// 1. Comma — in assignationes con = o :=
msg = "Bon die ", nomine, "!"             // → Bon die Ana!
TITULO := "Usator: ", nomine

// 2. Juxtaposition — in output >>
>> "Bon die " nomine " tu ha " n ¶        // → Bon die Ana tu ha 25

// 3. Interpolation — in omne contexto
descr = "Bon die {nomine}, tu ha {n}"    // → Bon die Ana, tu ha 25
```

> **Nota**: `+` es solo pro numeros. Con catenas genera un advertimento.

---

## Controlo de Fluxo

```zymbol
x = 7

// Si simple
? x > 0 { >> "positive" ¶ }

// Si / si-alsi / alsi
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

Blocos `{ }` es **requisite**, etiam pro un linea sol.

---

## Match

```zymbol
// Match con intervallos
nota = 85
gradu = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> gradu ¶    // → B

// Match con guardas (conditiones arbitrari)
temp = -5
stato = ?? temp {
    _? temp < 0  : "glacie"
    _? temp < 20 : "frigide"
    _? temp < 35 : "calde"
    _            : "calide"
}
>> stato ¶    // → glacie

// Match con catenas
color = "rubié"
codice = ?? color {
    "rubié"  : "#FF0000"
    "verde"  : "#00FF00"
    _        : "#000000"
}
>> codice ¶
```

---

## Bucleas

```zymbol
// Intervallo inclusive: 0..4 itera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervallo con passo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Intervallo inverse
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Mentre (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Pro cata elemento
fructos = ["pomo", "piro", "uva"]
@ f:fructos { >> f ¶ }

// Super characteres de catena
@ c:"bon" { >> c "-" }
>> ¶    // → b-o-n-

// Ruptura e Continuation
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continuar
    ? i > 7 { @! }          // @! rumper
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Functiones

```zymbol
// Declaration e appello
adder(a, b) { <~ a + b }
>> adder(3, 4) ¶    // → 7

// Recursion
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Functiones ha scopo isolate — nulle accesso a variables externe
_global = 100
testar() {
    x = 42    // local solmente
    <~ x
}
>> testar() ¶    // → 42
```

> **Importante**: Functiones nominate `nomine(params){ }` non es valores de prime classe.
> Pro passar como argumento, involver: `x -> nomine(x)`.

---

## Lambdas e Clausuras

```zymbol
// Lambda simple (retorno implicit)
duplicar = x -> x * 2
summa = (a, b) -> a + b
>> duplicar(5) ¶    // → 10
>> summa(3, 7) ¶    // → 10

// Lambda con bloco (retorno explicit)
classificar = x -> {
    ? x > 0 { <~ "positive" }
    _? x < 0 { <~ "negative" }
    <~ "zero"
}
>> classificar(5) ¶     // → positive
>> classificar(0) ¶     // → zero
>> classificar(-5) ¶    // → negative

// Clausuras — lambdas captura variables del scopo externe
factor = 3
triplicar = x -> x * factor    // captura 'factor'
>> triplicar(7) ¶    // → 21

// Fabrica de functiones
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas como valores: stockate in arreas
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Arreas

```zymbol
arr = [10, 20, 30, 40, 50]

// Accesso (indice base 0)
>> arr[0] ¶    // → 10

// Longitude (parentheses requisite in >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Appender, remover, contine, section
arr = arr$+ 60               // appender
arr = arr$- 0                // remover indice 0
ha = arr$? 30                // → #1
section = arr$[0..2]         // [20, 30]

// Actualisar elemento
arr[1] = 99

// Pro cata elemento
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` returna un **nove arrea** — reassignar: `arr = arr$+ 4`.
> Non catenar: usar duo assignationes separate.

---

## Tuplas

```zymbol
// Tupla nominate
persona = (nomine: "Alice", etate: 25)
>> persona.nomine ¶    // → Alice
>> persona.etate ¶     // → 25
>> persona[0] ¶        // → Alice (indice etiam functiona)
```

---

## Functiones de Ordine Superior

Operatores HOF require **lambda inline** — non un variabile lambda directe.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
duplicatos = nums$> (x -> x * 2)
>> duplicatos ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pares = nums$| (x -> x % 2 == 0)
>> pares ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (initio, (acc, elem) -> expr)
total = nums$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55
```

---

## Gestion de Errores

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division per zero" ¶
} :! ##IO {
    >> "error IO" ¶
} :! {
    >> "altere error: " _err ¶
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
// Fichiero: lib/calc.zy
# calc

#> { adder, get_PI }    // Exportationes ANTE le definitiones

_PI := 3.14159
adder(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fichiero: main.zy
<# ./lib/calc <= c    // Alias requisite

>> c::adder(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Exemplo Complete: FizzBuzz

```zymbol
classificar(numero) {
    ? numero % 15 == 0 { <~ "FizeBuze" }
    _? numero % 3  == 0 { <~ "Fize" }
    _? numero % 5  == 0 { <~ "Buze" }
    _ { <~ numero }
}

@ i:1..20 { >> classificar(i) ¶ }
```

---

## Referentia de Symbolos

| Symbolo  | Operation          | Symbolo    | Operation             |
|----------|--------------------|------------|-----------------------|
| `=`      | variabile          | `$#`       | longitude             |
| `:=`     | constante          | `$+`       | appender              |
| `>>`     | output             | `$-`       | remover (per indice)  |
| `<<`     | input              | `$?`       | contine               |
| `¶`/`\`  | linea nova         | `$[s..e]`  | section               |
| `?`      | si (if)            | `$>`       | map                   |
| `_?`     | si-alsi (elif)     | `$\|`      | filter                |
| `_`      | alsi / wildcard    | `$<`       | reduce                |
| `??`     | match              | `!?`       | probar (try)          |
| `@`      | buclea             | `:!`       | capturar (catch)      |
| `@!`     | ruptura (break)    | `:>`       | sempre (finally)      |
| `@>`     | continuar          | `$!`       | es error              |
| `->`     | Lambda             | `$!!`      | propagar error        |
| `<~`     | retornar           | `#`        | declarar modulo       |
| `\|>`    | Pipe               | `#>`       | exportar              |
| `#1`     | vere               | `<#`       | importar              |
| `#0`     | false              | `::`       | appello de modulo     |

---

*Zymbol-Lang — Symbolic. Universal. Immutabile.*

---

> **Nota:** Iste documentation esseva create e traducite per Intelligentia Artificial (AI).
> Tote effortios esseva facite pro assurar exactitude, ma alcun traductiones o exemplos pote continer errores.
> Le referentia authoritative es le [specification de Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
