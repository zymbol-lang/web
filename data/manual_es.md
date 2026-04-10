# Manual de Zymbol-Lang

**Zymbol-Lang** es un lenguaje de programación simbólico. Sin palabras clave — todo son símbolos. Funciona igual en cualquier idioma humano.

- Sin `if`, `while`, `return` — solo `?`, `@`, `<~`
- Unicode completo — identificadores en cualquier idioma o emoji
- Agnóstico al idioma humano — el código es el mismo en todos lados

---

## Variables y Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — reasignar es un error en tiempo de ejecución
nombre = "Alice"
activo = #1         // booleano verdadero
👋 := "Hola"
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

## Tipos de Datos

| Tipo | Literal | Etiqueta `#?` | Notas |
|------|---------|---------------|-------|
| Int | `42`, `-7` | `###` | 64-bit con signo |
| Float | `3.14`, `1.5e10` | `##.` | Notación científica OK |
| String | `"texto"` | `##"` | Interpolación: `"Hola {nombre}"` |
| Char | `'A'` | `##'` | Un carácter Unicode |
| Bool | `#1`, `#0` | `##?` | NO es numérico — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Elementos homogéneos |
| Tupla | `(a, b)` | `##)` | Posicional |
| Tupla nombrada | `(x: 1, y: 2)` | `##)` | Campos nombrados |

```zymbol
// Introspección de tipo — retorna (tipo, dígitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Salida y Entrada

```zymbol
>> "Hola" ¶                       // ¶ o \\ para salto de línea explícito
>> "a=" a " b=" b ¶               // yuxtaposición — múltiples valores
>> (arr$#) ¶                      // operadores postfix requieren ( ) en >>

<< nombre                         // leer en variable (sin prompt)
<< "Ingresa nombre: " nombre      // con prompt
```

> `¶` (AltGr+R en teclado español) y `\\` son equivalentes como salto de línea.

---

## Operadores

```zymbol
// Aritmética — usar asignaciones; algunos operadores tienen quirks directo en >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (división entera)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (exponenciación)

// Comparación
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lógica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Cadenas

```zymbol
// Tres formas de concatenar
nombre = "Alice"
n = 42

msg = "Hola ", nombre, "!"             // coma — en asignaciones
>> "Hola " nombre " tienes " n ¶       // yuxtaposición — en >>
desc = "Hola {nombre}, tienes {n}"     // interpolación — en cualquier contexto
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (fin exclusivo)
has = s$? "World"          // #1
partes = "a,b,c,d" / ','   // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (solo las primeras N)
```

> `+` es solo para números. Usar `,`, yuxtaposición o interpolación para cadenas.

---

## Control de Flujo

```zymbol
x = 7

? x > 0 { >> "positivo" ¶ }

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

> Los bloques `{ }` son **obligatorios** aunque sean de una sola línea.

---

## Match

```zymbol
// Rangos
score = 85
grade = ?? score {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grade ¶    // → B

// Cadenas
color = "rojo"
codigo = ?? color {
    "rojo"  : "#FF0000"
    "verde" : "#00FF00"
    _       : "#000000"
}

// Guards (condiciones)
temp = -5
estado = ?? temp {
    _? temp < 0  : "hielo"
    _? temp < 20 : "frío"
    _? temp < 35 : "cálido"
    _            : "caliente"
}
>> estado ¶    // → hielo

// Forma de sentencia (bloques)
?? n {
    0        : { >> "cero" ¶ }
    _? n < 0 : { >> "negativo" ¶ }
    _        : { >> "positivo" ¶ }
}
```

---

## Bucles

```zymbol
@ i:0..4  { >> i " " }        // rango inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // con paso:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverso:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (mientras)

frutas = ["manzana", "pera", "uva"]
@ f:frutas { >> f ¶ }         // para cada elemento

@ c:"hola" { >> c "-" }
>> ¶                          // → h-o-l-a-  (sobre caracteres)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! romper
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Bucle infinito
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Bucle con etiqueta (romper bucle externo)
cuenta = 0
@ @externo {
    cuenta++
    ? cuenta >= 3 { @! externo }
}
>> cuenta ¶                   // → 3
```

---

## Funciones

```zymbol
sumar(a, b) { <~ a + b }
>> sumar(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Las funciones tienen **scope aislado** — no pueden leer variables externas. Usar parámetros de salida `<~` para modificar variables del llamador:

```zymbol
intercambiar(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
intercambiar(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Las funciones nombradas no son valores de primera clase. Para pasarlas como argumento, envolver: `x -> fn(x)`.

---

## Lambdas y Closures

```zymbol
doble = x -> x * 2
suma = (a, b) -> a + b
>> doble(5) ¶    // → 10
>> suma(3, 7) ¶  // → 10

// Lambda con bloque
clasificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}

// Closure — captura el scope externo
factor = 3
triple = x -> x * factor
>> triple(7) ¶    // → 21

// Factory
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// En arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arreglos

Los arreglos son **mutables** y contienen elementos del **mismo tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — acceso (base 0)
arr[-1]         // 5 — índice negativo (último)
arr$#           // 5 — longitud (usar (arr$#) en >>)

arr = arr$+ 6            // agregar → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insertar en índice 2
arr3 = arr$- 3           // quitar primera ocurrencia del valor
arr4 = arr$-- 3          // quitar todas las ocurrencias
arr5 = arr$-[0]          // quitar en índice
arr6 = arr$-[1..3]       // quitar rango (fin exclusivo)

has = arr$? 3            // #1 — contiene
pos = arr$?? 3           // [2] — todos los índices del valor
sl = arr$[0..3]          // [1,2,3] — slice (fin exclusivo)
sl2 = arr$[0:3]          // [1,2,3] — igual, sintaxis por conteo

asc = arr$^+             // ordenado ascendente  (solo primitivos)
desc = arr$^-            // ordenado descendente (solo primitivos)

// Arreglos de tuplas nombradas/posicionales — usar $^ con lambda comparadora
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
por_edad   = db$^ (a, b -> a.age < b.age)    // ascendente por edad  (<)
por_nombre = db$^ (a, b -> a.name > b.name)  // descendente por nombre (>)
>> por_edad[0].name ¶     // → Ana
>> por_nombre[0].name ¶   // → Carla

// Actualización directa de elemento (solo arreglos)
arr[1] = 99              // asignar
arr[0] += 5              // compuesto: +=  -=  *=  /=  %=  ^=

// Actualización funcional — retorna un nuevo arreglo; el original no cambia
arr2 = arr[1]$~ 99
```

> Todos los operadores de colección retornan un **nuevo arreglo**. Asignar de vuelta: `arr = arr$+ 4`.
> Los operadores no se pueden encadenar — usar asignaciones intermedias.
> `$^+` / `$^-` ordenan **arreglos de primitivos** (números, cadenas). Para arreglos de tuplas, usar `$^` con lambda comparadora — la dirección se codifica en la lambda (`<` = ascendente, `>` = descendente).

**Semántica de valor** — asignar un arreglo a otra variable crea una copia independiente:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b no se ve afectado
```

```zymbol
// Arreglos anidados
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[1][2] ¶    // → 6
```

---

## Destructuring

```zymbol
// Arreglo
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primero, *resto] = arr      // primero=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Tupla nombrada
persona = (nombre: "Ana", edad: 25, ciudad: "Madrid")
(nombre: n, edad: e) = persona   // n="Ana"  e=25
```

---

## Tuplas

Las tuplas son contenedores ordenados **inmutables** que pueden contener valores de **diferentes tipos**.
A diferencia de los arreglos, los elementos no se pueden cambiar después de su creación.

```zymbol
// Posicional — tipos mixtos permitidos
punto = (10, 20)
>> punto[0] ¶    // → 10

datos = (42, "hola", #1, 3.14)
>> datos[2] ¶     // → #1

// Nombrada
persona = (nombre: "Alice", edad: 25)
>> persona.nombre ¶    // → Alice
>> persona[0] ¶        // → Alice  (índice también funciona)

// Anidada
pos = (x: 10, y: 20)
p = (pos: pos, etiqueta: "origen")
>> p.pos.x ¶        // → 10
```

**Inmutabilidad** — cualquier intento de modificar un elemento de una tupla es un error en tiempo de ejecución:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ error en tiempo de ejecución: las tuplas son inmutables
// t[0] += 5    // ❌ mismo error
```

Para derivar un valor modificado usar `$~` (actualización funcional) — retorna una **nueva** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original sin cambios
>> t2 ¶    // → (10, 999, 30)

// Tupla nombrada — reconstruir explícitamente
persona = (nombre: "Alice", edad: 25)
mayor  = (nombre: persona.nombre, edad: 26)
>> persona.edad ¶    // → 25
>> mayor.edad ¶      // → 26
```

---

## Funciones de Orden Superior

> Los operadores HOF requieren **lambda inline** — las variables lambda pasadas directamente no funcionan.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobles  = nums$> (x -> x * 2)                  // map   → [2,4,6…20]
pares   = nums$| (x -> x % 2 == 0)             // filter → [2,4,6,8,10]
total   = nums$< (0, (acc, x) -> acc + x)       // reduce → 55

// Encadenar con variables intermedias
paso1 = nums$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funciones nombradas dentro de HOF — envolver en lambda
doble(x) { <~ x * 2 }
r = nums$> (x -> doble(x))    // ✅
```

---

## Operador Pipe

El lado derecho siempre requiere `_` como marcador de posición del valor:

```zymbol
doble = x -> x * 2
sumar = (a, b) -> a + b
inc = x -> x + 1

5 |> doble(_)        // → 10
10 |> sumar(_, 5)    // → 15
5 |> sumar(2, _)     // → 7

// Encadenado
r = 5 |> doble(_) |> inc(_) |> doble(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Manejo de Errores

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "división por cero" ¶
} :! {
    >> "otro error: " _err ¶    // _err contiene el mensaje
} :> {
    >> "siempre se ejecuta" ¶
}
```

| Tipo | Cuándo ocurre |
|------|---------------|
| `##Div` | División por cero |
| `##IO` | Archivo / sistema |
| `##Index` | Índice fuera de rango |
| `##Type` | Error de tipo |
| `##Parse` | Parsing de datos |
| `##Network` | Errores de red |
| `##_` | Cualquier error (catch-all) |

---

## Módulos

```zymbol
// lib/calc.zy
# calc

#> { sumar, get_PI }    // exports DEBEN ir antes de las definiciones

_PI := 3.14159
sumar(a, b) { <~ a + b }
get_PI() { <~ _PI }     // getter — acceso directo a constante vía alias no funciona
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias obligatorio

>> c::sumar(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar con nombre público diferente
# milib
#> { _sumar_interno <= suma }

_sumar_interno(a, b) { <~ a + b }
```

```zymbol
<# ./milib <= m

>> m::suma(3, 4) ¶    // → 7  (nombre interno _sumar_interno queda oculto)
```

---

## Modos Numéricos

Zymbol puede mostrar números en **69 sistemas de dígitos Unicode** — Devanagari, Árabe-Índico, Tailandés, Klingon pIqaD, Negrita Matemática, dígitos LCD, y más. El modo activo solo afecta la salida `>>`; la aritmética interna siempre es binaria.

### Activar un sistema

Escribe el dígito `0` y el dígito `9` del sistema deseado entre `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Árabe-Índico  (U+0660–U+0669)
#๐๙#    // Tailandés     (U+0E50–U+0E59)
#09#    // restablecer ASCII
```

### Salida y booleanos

```zymbol
x = 42
>> x ¶          // → 42   (ASCII por defecto)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto decimal siempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleanos: prefijo # siempre ASCII, dígito se adapta
>> #1 ¶         // → #१   (verdadero en Devanagari)
>> #0 ¶         // → #०   (falso — distinto de ०  cero entero)

x = 28 > 4
>> x ¶          // → #१   (resultado de comparación sigue el modo activo)
```

### Literales nativos en código fuente

Los dígitos de cualquier sistema soportado son literales válidos — en rangos, módulo, comparaciones:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literales booleanos en cualquier sistema

`#` + dígito `0` o `1` de cualquier bloque soportado es un literal booleano válido:

```zymbol
#٠٩#
نشط = #١        // igual que #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` es **siempre ASCII**. `#0` (falso) siempre es visualmente distinto de `0` (cero entero) en cualquier sistema.

---

## Operadores de Datos

```zymbol
// Parsear cadena a número
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (sin error, retorna original)

// Redondear / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (redondear a 2 decimales)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formato numérico
fmt = #,|1234567|      // → 1,234,567  (con comas)
sci = #^|12345.678|    // → 1.2345678e4  (notación científica)

// Literales en otras bases
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Conversión a representación en base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integración con Shell

```zymbol
fecha = <\ date +%Y-%m-%d \>    // captura stdout (incluye \n al final)
>> "Hoy: " fecha

archivo = "datos.txt"
contenido = <\ cat {archivo} \>    // interpolación en comandos

salida = </"./subscript.zy"/>      // ejecutar otro script Zymbol, capturar salida
>> salida
```

> `><` captura los argumentos CLI como arreglo de cadenas (solo tree-walker).

---

## Ejemplo Completo: FizzBuzz

```zymbol
clasificar(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> clasificar(i) ¶ }
```

---

## Referencia de Símbolos

| Símbolo | Operación | Símbolo | Operación |
|---------|-----------|---------|-----------|
| `=` | variable | `$#` | longitud |
| `:=` | constante | `$+` | agregar |
| `>>` | salida | `$+[i]` | insertar en índice |
| `<<` | entrada | `$-` | quitar 1ª ocurrencia |
| `¶` / `\\` | salto de línea | `$--` | quitar todas |
| `?` | si | `$-[i]` | quitar en índice |
| `_?` | sino si | `$-[i..j]` | quitar rango |
| `_` | sino / wildcard | `$?` | contiene |
| `??` | match | `$??` | hallar todos índices |
| `@` | bucle | `$[s..e]` | slice |
| `@!` | romper | `$>` | map |
| `@>` | continuar | `$\|` | filter |
| `->` | lambda | `$<` | reduce |
| `arr[i] = val` | actualizar elemento (solo arreglos) | `arr[i] += val` | actualización compuesta |
| `arr[i]$~` | actualización funcional (nueva copia) | `$^+` | ordenar asc (primitivos) |
| `$^-` | ordenar desc (primitivos) | `$^` | ordenar con comparadora (tuplas) |
| `<~` | retornar | `!?` | intentar |
| `\|>` | pipe | `:!` | capturar |
| `#1` | verdadero | `:>` | siempre |
| `#0` | falso | `$!` | es error |
| `<#` | importar | `$!!` | propagar error |
| `#` | declarar módulo | `#>` | exportar |
| `::` | llamar módulo | `.` | acceso a campo |
| `#\|..\|` | parsear número | `#?` | metadato de tipo |
| `#.N\|..\|` | redondear | `#!N\|..\|` | truncar |
| `#,\|..\|` | formato comas | `#^\|..\|` | notación científica |
| `#d0d9#` | cambio de sistema numérico | `#09#` | restablecer ASCII |
| `<\ ..\>` | ejecutar shell | `>\<` | argumentos CLI |

---

## Historial de Versiones

### v0.0.3 — Sistemas Numéricos Unicode & Mejoras LSP _(Abril 2026)_

- **Añadido** 69 bloques de dígitos Unicode con token de cambio de modo `#d0d9#`
- **Añadido** Literales booleanos en cualquier sistema — `#१` / `#०`, `#١` / `#٠`, etc.
- **Añadido** Dígitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Añadido** Opcode VM `SetNumeralMode` — paridad completa con el árbol de evaluación
- **Añadido** REPL respeta el modo numérico activo en eco y visualización de variables
- **Cambiado** Salida booleana `>>` incluye prefijo `#` (`#0` / `#1`) en todos los modos

### v0.0.2_01 — Renombrado de Operadores _(30 Mar 2026)_

- **Cambiado** `c|..|` → `#,|..|` y `e|..|` → `#^|..|` — consistente con la familia de prefijo `#`
- **Añadido** Alias de exportación: re-exportar miembros de módulo con nombre diferente

### v0.0.2 — Rediseño de Colecciones & Instaladores _(24 Mar 2026)_

- **Añadido** Familia unificada de operadores `$` para arreglos y cadenas (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Añadido** Destructuring para arreglos, tuplas y tuplas nombradas
- **Añadido** Índices negativos (`arr[-1]` = último elemento)
- **Añadido** Instaladores nativos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Añadido** Asignación compuesta `^=`
- **Corregido** Casos extremos en aritmética del parser; correcciones de documentación

### v0.0.1 — Primera Versión Pública _(22 Mar 2026)_

- Intérprete árbol de evaluación + VM de registros (`--vm`, ~4× más rápido, ~95% paridad)
- Todos los constructos base: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, closures, manejo de errores
- REPL, LSP, extensión VS Code, formateador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Inmutable._

> **Aviso:** Esta documentación fue creada con asistencia de inteligencia artificial (IA).
> La referencia canónica es [MANUAL.md](https://github.com/zymbol-lang/interpreter) en el repositorio del intérprete.
