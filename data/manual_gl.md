# Manual Compacto de Zymbol-Lang

**Zymbol-Lang** é unha linguaxe de programación simbólica. Non usa palabras clave — todo son símbolos. Funciona igual en calquera lingua humana.

---

## Filosofía

- Sen palabras clave (`if`, `while`, `return` non existen — só símbolos `?`, `@`, `<~`)
- Unicode completo — identificadores en calquera lingua ou emoji 👋
- Agnóstico á lingua humana — o código é idéntico en todas as linguas

---

## Variables e Constantes

```zymbol
x = 10           // variable (mutable)
PI := 3.14159    // constante (inmutable — erro se se reasigna)
nome = "Ana"
activo = #1      // booleano verdadeiro
👋 := "Ola"
```

### Asignación Composta

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

## Tipos de Datos

| Tipo           | Exemplo             | Símbolo `#?` | Notas                               |
|----------------|---------------------|--------------|-------------------------------------|
| Enteiro        | `42`, `-7`          | `###`        | 64 bits con signo                   |
| Coma flotante  | `3.14`, `1.5e10`    | `##.`        | Notación científica OK              |
| Cadea          | `"ola"`             | `##"`        | Interpolación: `"Ola {nome}"`       |
| Carácter       | `'A'`               | `##'`        | Un carácter Unicode                 |
| Booleano       | `#1`, `#0`          | `##?`        | NON son 1 e 0 numéricos             |
| Array          | `[1, 2, 3]`         | `##]`        | Todos os elementos do mesmo tipo    |
| Tupla          | `(a, b)`            | `##)`        | Posicional                          |
| Tupla nomeada  | `(x: 1, y: 2)`      | `##)`        | Acceso por nome ou índice           |

---

## Saída e Entrada

```zymbol
// Saída — NON engade nova liña automaticamente
>> "Ola" ¶                    // ¶ ou \\ dá nova liña explícita
>> "a=" a " b=" b ¶           // múltiples valores por xustaposición
>> "suma=" sumar(2, 3) ¶      // chamadas a funcións en calquera posición
>> (arr$#) ¶                  // os operadores postfix requiren parénteses

// Entrada
<< nome                       // sen indicación — le na variable
<< "O teu nome? " nome        // con indicación
```

> `¶` ou `\\` son equivalentes como nova liña.

---

## Concatenación de Cadeas

Tres formas válidas — cada unha para o seu contexto:

```zymbol
nome = "Ana"
n = 25

// 1. Coma — en asignacións con = ou :=
msg = "Ola ", nome, "!"                // → Ola Ana!
TITULO := "Usuario: ", nome

// 2. Xustaposición — na saída >>
>> "Ola " nome " tes " n " anos" ¶    // → Ola Ana tes 25 anos

// 3. Interpolación — en calquera contexto
desc = "Ola {nome}, tes {n} anos"     // → Ola Ana, tes 25 anos
```

> **Nota**: `+` é só para números. Usalo con cadeas xera un aviso.

---

## Control de Fluxo

```zymbol
x = 7

// Se simple
? x > 0 { >> "positivo" ¶ }

// Se / se non se / se non
? x > 100 {
    >> "grande" ¶
} _? x > 0 {
    >> "positivo" ¶
} _? x == 0 {
    >> "cero" ¶
} _ {
    >> "negativo" ¶
}
```

Os bloques `{ }` son **obrigatorios** aínda para unha soa liña.

---

## Match

```zymbol
// Match con intervalos
nota = 85
cualificación = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> cualificación ¶    // → B

// Match con gardas (condicións arbitrarias)
temp = -5
estado = ?? temp {
    _? temp < 0  : "xeo"
    _? temp < 20 : "frío"
    _? temp < 35 : "quente"
    _            : "moi quente"
}
>> estado ¶    // → xeo

// Match con cadeas
cor = "vermello"
código = ?? cor {
    "vermello" : "#FF0000"
    "verde"    : "#00FF00"
    _          : "#000000"
}
>> código ¶
```

---

## Bucles

```zymbol
// Intervalo inclusivo: 0..4 itera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervalo con paso
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Intervalo inverso
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Mentres (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Para cada elemento
froitas = ["mazá", "pera", "uva"]
@ f:froitas { >> f ¶ }

// Sobre os caracteres dunha cadea
@ c:"ola" { >> c "-" }
>> ¶    // → o-l-a-

// Break e Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continuar
    ? i > 7 { @! }          // @! parar
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funcións

```zymbol
// Declaración e chamada
sumar(a, b) { <~ a + b }
>> sumar(3, 4) ¶    // → 7

// Recursión
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// As funcións teñen ámbito illado — sen acceso a variables externas
global = 100
probar() {
    x = 42    // só local
    <~ x
}
>> probar() ¶    // → 42
```

> **Importante**: As funcións declaradas con `nome(params){ }` non son valores de primeira clase.
> Para pasalas como argumento, envolver: `x -> nome(x)`.

---

## Lambdas e Peches

```zymbol
// Lambda simple (retorno implícito)
dobre = x -> x * 2
suma = (a, b) -> a + b
>> dobre(5) ¶    // → 10
>> suma(3, 7) ¶  // → 10

// Lambda con bloque (retorno explícito)
clasificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}
>> clasificar(5) ¶     // → positivo
>> clasificar(0) ¶     // → cero
>> clasificar(-5) ¶    // → negativo

// Peches — as lambdas capturan variables do ámbito exterior
factor = 3
triple = x -> x * factor    // captura 'factor'
>> triple(7) ¶    // → 21

// Fábrica de funcións
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas como valores: almacenadas en arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [10, 20, 30, 40, 50]

// Acceso (índice 0-base)
>> arr[0] ¶    // → 10

// Lonxitude (parénteses necesarios en >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Engadir, eliminar, contén, recorte
arr = arr$+ 60               // engadir
arr = arr$- 0                // eliminar índice 0
ten = arr$? 30               // → #1
recorte = arr$[0..2]         // [20, 30]

// Actualizar elemento
arr[1] = 99

// Para cada elemento
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` retornan un **novo array** — reasignar: `arr = arr$+ 4`.
> Sen encadeamento: usar dúas asignacións separadas.

---

## Tuplas

```zymbol
// Tupla nomeada
persoa = (nome: "Alice", idade: 25)
>> persoa.nome ¶    // → Alice
>> persoa.idade ¶   // → 25
>> persoa[0] ¶      // → Alice (o índice tamén funciona)
```

---

## Funcións de Orde Superior

Os operadores HOF requiren unha **lambda inline** — non unha variable lambda directa.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
dobres = nums$> (x -> x * 2)
>> dobres ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pares = nums$| (x -> x % 2 == 0)
>> pares ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (valor_inicial, (acumulador, elemento) -> expr)
total = nums$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55
```

---

## Xestión de Erros

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "división por cero" ¶
} :! ##IO {
    >> "erro IO" ¶
} :! {
    >> "outro erro: " _err ¶
} :> {
    >> "execútase sempre" ¶
}
```

| Tipo        | Cando ocorre                 |
|-------------|------------------------------|
| `##Div`     | División por cero             |
| `##IO`      | Ficheiro / sistema            |
| `##Index`   | Índice fóra dos límites       |
| `##Type`    | Erro de tipo                  |
| `##Parse`   | Erro de parsaxe               |
| `##Network` | Erros de rede                 |
| `##_`       | Calquera erro (catch-all)     |

---

## Módulos

```zymbol
// Ficheiro: lib/calc.zy
# calc

#> { sumar, get_PI }    // exportacións ANTES das definicións

_PI := 3.14159
sumar(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Ficheiro: main.zy
<# ./lib/calc <= c    // alias obrigatorio

>> c::sumar(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Exemplo Completo: FizzBuzz

```zymbol
clasificar(número) {
    ? número % 15 == 0 { <~ "BurbullaZumbido" }
    _? número % 3  == 0 { <~ "Burbulla" }
    _? número % 5  == 0 { <~ "Zumbido" }
    _ { <~ número }
}

@ i:1..20 { >> clasificar(i) ¶ }
```

---

## Referencia de Símbolos

| Símbolo | Operación          | Símbolo    | Operación            |
|---------|--------------------|------------|----------------------|
| `=`     | variable           | `$#`       | lonxitude            |
| `:=`    | constante          | `$+`       | engadir              |
| `>>`    | saída              | `$-`       | eliminar (por índice)|
| `<<`    | entrada            | `$?`       | contén               |
| `¶`/`\` | nova liña          | `$[s..e]`  | recorte              |
| `?`     | se (if)            | `$>`       | map                  |
| `_?`    | se non se (elif)   | `$\|`      | filter               |
| `_`     | se non / comodín   | `$<`       | reduce               |
| `??`    | match              | `!?`       | intentar (try)       |
| `@`     | bucle              | `:!`       | capturar (catch)     |
| `@!`    | parar (break)      | `:>`       | sempre (finally)     |
| `@>`    | continuar          | `$!`       | é erro               |
| `->`    | lambda             | `$!!`      | propagar erro        |
| `<~`    | retornar           | `#`        | declarar módulo      |
| `\|>`   | pipe               | `#>`       | exportar             |
| `#1`    | verdadeiro         | `<#`       | importar             |
| `#0`    | falso              | `::`       | chamada de módulo    |

---

*Zymbol-Lang — Simbólico. Universal. Inmutable.*

---

> **Aviso:** Esta documentación foi creada e traducida por intelixencia artificial (IA).
> Fixéronse todos os esforzos para garantir a exactitude, pero algunhas traducións ou exemplos poden conter erros.
> A referencia canónica é a [especificación de Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
