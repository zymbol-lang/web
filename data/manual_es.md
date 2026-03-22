# Manual Compacto de Zymbol-Lang

**Zymbol-Lang** es un lenguaje de programación simbólico. No usa palabras clave — todo son símbolos. Funciona igual en cualquier idioma humano.

---

## Filosofía

- Sin palabras clave (`if`, `while`, `return` no existen — solo simbolos `?`, `@`, `<~`)
- Unicode completo — identificadores en cualquier idioma o emoji 👋
- Agnóstico al idioma humano — el código es igual en todos los idiomas

---

## Variables y Constantes

```zymbol
x = 10          // variable (mutable)
PI := 3.14159   // constante (inmutable — error si se reasigna)
nombre = "Ana"
activo = #1     // booleano verdadero
👋 := "Hola"
```

### Asignación compuesta

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

| Tipo           | Ejemplo             | Símbolo `#?` | Notas                              |
|----------------|---------------------|--------------|------------------------------------|
| Entero         | `42`, `-7`          | `###`        | 64-bit con signo                   |
| Flotante       | `3.14`, `1.5e10`    | `##.`        | Notación científica OK             |
| Cadena         | `"hola"`            | `##"`        | Interpolación: `"Hola {nombre}"`   |
| Carácter       | `'A'`               | `##'`        | Un carácter Unicode                |
| Booleano       | `#1`, `#0`          | `##?`        | NO son 1 y 0 numéricos             |
| Arreglo        | `[1, 2, 3]`         | `##]`        | Todos los elementos del mismo tipo |
| Tupla          | `(a, b)`            | `##)`        | Posicional                         |
| Tupla nombrada | `(x: 1, y: 2)`      | `##)`        | Acceso por nombre o índice         |

---

## Salida y Entrada

```zymbol
// Salida — NO agrega newline automático
>> "Hola" ¶                    // ¶ o \\ es el que da una nueva linea explícita
>> "a=" a " b=" b ¶            // múltiples valores por yuxtaposición
>> "suma=" add(2, 3) ¶         // llamadas a funciones en cualquier posición
>> (arr$#) ¶                   // postfix operators requieren paréntesis

// Entrada
<< nombre                      // sin prompt — lee en variable
<< "¿Nombre? " nombre          // con prompt
```

> `¶` (Alt+R en teclado español) o `\\` es el equivalentes como newline.

---

## Concatenación de Cadenas

Tres formas válidas — cada una para su contexto:

```zymbol
nombre = "Ana"
n = 25

// 1. Coma — en asignaciones con = o :=
msg = "Hola ", nombre, "!"             // → Hola Ana!
TITULO := "Usuario: ", nombre

// 2. Juxtaposición — en salida >>
>> "Hola " nombre " tienes " n " años" ¶   // → Hola Ana tienes 25 años

// 3. Interpolación — en cualquier contexto
desc = "Hola {nombre}, tienes {n} años"    // → Hola Ana, tienes 25 años
```

> **Nota**: `+` es solo para números. Usarlo con cadenas genera un warning.

---

## Control de Flujo

```zymbol
x = 7

// Si simple
? x > 0 { >> "positivo" ¶ }

// Si / sino si / sino
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

Los bloques `{ }` son **obligatorios** aunque tengan una sola línea.

---

## Match

```zymbol
// Match con rangos
score = 85
grade = ?? score {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grade ¶    // → B

// Match con guards (condiciones)
temp = -5
estado = ?? temp {
    _? temp < 0  : "hielo"
    _? temp < 20 : "frío"
    _? temp < 35 : "cálido"
    _            : "caliente"
}
>> estado ¶    // → hielo

// Match con cadenas
color = "rojo"
codigo = ?? color {
    "rojo"  : "#FF0000"
    "verde" : "#00FF00"
    _       : "#000000"
}
>> codigo ¶
```

---

## Bucles

```zymbol
// Rango inclusivo: 0..4 itera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Rango con pasos
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Rango reverso
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Mientras (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Para cada elemento
frutas = ["manzana", "pera", "uva"]
@ f:frutas { >> f ¶ }

// Sobre caracteres de cadena
@ c:"hola" { >> c "-" }
>> ¶    // → h-o-l-a-

// Break y Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continuar
    ? i > 7 { @! }          // @! romper
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funciones

```zymbol
// Declaración y llamada
sumar(a, b) { <~ a + b }
>> sumar(3, 4) ¶    // → 7

// Recursión
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Las funciones tienen scope aislado — no acceden a variables externas
global = 100
test() {
    x = 42    // local, no accede a 'global'
    <~ x
}
>> test() ¶    // → 42
```

> **Importante**: Las funciones declaradas con `nombre(params){ }` no son valores
> de primera clase. Para pasarlas como argumento, usar `x -> nombre(x)`.

---

## Lambdas y Closures

```zymbol
// Lambda simple (retorno implícito)
doble = x -> x * 2
suma = (a, b) -> a + b
>> doble(5) ¶     // → 10
>> suma(3, 7) ¶   // → 10

// Lambda con bloque (retorno explícito)
clasificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}
>> clasificar(5) ¶     // → positivo
>> clasificar(0) ¶     // → cero
>> clasificar(-5) ¶    // → negativo

// Closures — las lambdas capturan variables del scope exterior
factor = 3
triple = x -> x * factor    // captura 'factor'
>> triple(7) ¶    // → 21

// Factory de funciones
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
add20 = make_adder(20)
>> add10(5) ¶    // → 15
>> add20(5) ¶    // → 25

// Lambdas como valores: almacenar en arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[1](5) ¶    // → 10
>> ops[2](5) ¶    // → 25
```

---

## Arreglos

```zymbol
arr = [10, 20, 30, 40, 50]

// Acceso (índice 0-based)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30

// Longitud (requiere paréntesis en >>)
n = arr$#
>> n ¶           // → 5
>> (arr$#) ¶     // → 5

// Agregar, quitar, verificar, slice
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // quita índice 0: [20, 30, 40, 50, 60]
tiene = arr$? 30             // → #1
trozo = arr$[0..2]           // slice [0,2): [20, 30]

// Actualizar elemento
arr[1] = 99
>> arr ¶    // → [20, 99, 40, 50, 60]

// Para cada elemento
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` retornan un **nuevo arreglo** — asignar al mismo nombre: `arr = arr$+ 4`.
> No encadenar: `arr$+ 4$+ 5` no funciona — usar dos asignaciones.

---

## Tuplas

```zymbol
// Tupla posicional
punto = (10, 20)
>> punto[0] ¶    // → 10
>> punto[1] ¶    // → 20

// Tupla nombrada
persona = (nombre: "Alice", edad: 25)
>> persona.nombre ¶    // → Alice
>> persona.edad ¶      // → 25
>> persona[0] ¶        // → Alice (índice también funciona)

// Anidada
pos = (x: 3, y: 4)
p = (pos: pos, etiqueta: "origen")
>> p.etiqueta ¶    // → origen
>> p.pos.x ¶       // → 3
```

---

## Funciones de Orden Superior

Los operadores HOF requieren **lambda inline** — no variable lambda directa.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
dobles = nums$> (x -> x * 2)
>> dobles ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pares = nums$| (x -> x % 2 == 0)
>> pares ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (valor_inicial, (acumulador, elemento) -> expr)
suma = nums$< (0, (acc, x) -> acc + x)
>> suma ¶    // → 55

// Sin encadenado directo — usar variables intermedias
paso1 = nums$| (x -> x > 5)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Manejo de Errores

```zymbol
// Try / Catch / Finally
!? {
    x = 10 / 0
} :! ##Div {
    >> "división por cero" ¶
} :! ##IO {
    >> "error de IO" ¶
} :! {
    >> "otro error: " _err ¶    // _err contiene el mensaje
} :> {
    >> "siempre se ejecuta" ¶
}

// Catch por tipo de índice
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "índice fuera de rango" ¶
}
```

### Tipos de error

| Tipo        | Cuando ocurre              |
|-------------|---------------------------|
| `##Div`     | División por cero          |
| `##IO`      | Archivo / sistema          |
| `##Index`   | Índice fuera de rango      |
| `##Type`    | Error de tipo              |
| `##Parse`   | Parsing de datos           |
| `##Network` | Errores de red             |
| `##_`       | Cualquier error (catch-all)|

---

## Módulos

```zymbol
// Archivo: lib/calc.zy
# calc                    // declaración — siempre al inicio

#> {                      // exports — DEBE ir antes de las definiciones
    sumar
    get_PI
}

_PI := 3.14159

sumar(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter para constante (workaround necesario)
```

```zymbol
// Archivo: main.zy
<# ./lib/calc <= c         // alias obligatorio

>> c::sumar(5, 3) ¶        // → 8  — llamada con ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Nota**: `alias.NOMBRE` para acceder constantes no funciona — usar función getter.

---

## Ejemplo Completo: FizzBuzz

```zymbol
@ i:1..20 {
    ? i % 15 == 0 { >> "FizzBuzz" ¶ }
    _? i % 3 == 0 { >> "Fizz" ¶ }
    _? i % 5 == 0 { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

---

## Referencia de Símbolos

| Símbolo | Operación        | Símbolo    | Operación          |
|---------|-----------------|------------|--------------------|
| `=`     | variable        | `$#`       | longitud           |
| `:=`    | constante       | `$+`       | agregar (append)   |
| `>>`    | salida          | `$-`       | quitar (por índice)|
| `<<`    | entrada         | `$?`       | contiene           |
| `¶`/`\` | newline         | `$[s..e]`  | slice              |
| `?`     | si (if)         | `$>`       | map                |
| `_?`    | sino si (elif)  | `$\|`      | filter             |
| `_`     | sino / wildcard | `$<`       | reduce             |
| `??`    | match           | `!?`       | intentar (try)     |
| `@`     | bucle           | `:!`       | capturar (catch)   |
| `@!`    | romper (break)  | `:>`       | siempre (finally)  |
| `@>`    | continuar       | `$!`       | es error           |
| `->`    | lambda          | `$!!`      | propagar error     |
| `<~`    | retornar        | `#`        | declarar módulo    |
| `\|>`   | pipe            | `#>`       | exportar           |
| `#1`    | verdadero       | `<#`       | importar           |
| `#0`    | falso           | `::`       | llamar de módulo   |

---

*Zymbol-Lang — Simbólico. Universal. Inmutable.*

---

> **Aviso:** Esta documentación fue creada y traducida por inteligencia artificial (IA).
> Se han realizado todos los esfuerzos para garantizar la exactitud, pero algunas traducciones o ejemplos pueden contener errores.
> La referencia canónica es la [especificación de Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
