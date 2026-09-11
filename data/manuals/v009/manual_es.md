> **Aviso:** Esta documentación fue creada y traducida por inteligencia artificial (IA).
> 
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
> 
> La referencia canónica es **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** en el repositorio del intérprete.

---

# Manual de Zymbol-Lang

> **Revisado para v0.0.9 — 2026-09-07**

**Zymbol-Lang** es un lenguaje de programación simbólico. Ninguna palabra en su gramática: cada construcción es una marca. Funciona igual en cualquier idioma humano.

- Sin `if`, `while`, `return` — solo `?`, `@`, `<~`
- Unicode completo — identificadores en cualquier idioma o emoji
- Independiente del idioma humano — el código es el mismo en todas partes

**Versión del intérprete**: v0.0.9 | **Cobertura de pruebas**: 660/666 (tres motores de acuerdo, 0 divergiendo)

---

## Variables y Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — reasignarla es un error de ejecución
nombre = "Alicia"
activo = #1         // booleano verdadero
👋 := "Hola"
```

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++       // 5
x--       // 4
```

`°` (signo de grado, U+00B0) inicializa una variable a su valor neutro en el primer uso:

```zymbol
numeros = [3, 1, 4, 1, 5]
@ n:numeros {
    °total += n
}
>> total ¶              // → 14
```

> `°x` (prefijo) ancla por encima del bucle — el resultado se lee después de `@`.
> `x°` (sufijo) ancla dentro del bucle — muere cuando el bucle termina.

Una sentencia que solo es un nombre lee la variable y tira el valor, así que lo dice:

```zymbol
cuenta = 5
cuenta
```

El compilador avisa así (sus mensajes son siempre en inglés):

```text
warning: this statement does nothing: 'cuenta' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Es decir: *«esta sentencia no hace nada: se lee 'cuenta' y se descarta»*.

---

## Tipos de Datos

| Tipo | Literal | Etiqueta `#?` | Notas |
|------|---------|---------------|-------|
| Entero | `42`, `-7` | `###` | Entero seguro: ±(2⁵³ − 1) |
| Flotante | `3.14`, `1.5e10` | `##.` | Doble IEEE-754 |
| Cadena | `"texto"` | `##"` | Interpolación: `"Hola {nombre}"` |
| Carácter | `'A'` | `##'` | Un punto de código Unicode |
| Booleano | `#1`, `#0` | `##?` | NO es numérico — `#1 ≠ 1` |
| Arreglo | `[1, 2, 3]` | `##]` | Un solo tipo, comprobado |
| Mezcla declarada | `#[1, "dos"]` | `##[` | Mismo tipo que `[…]`, sin comprobar |
| Tupla | `(a, b)` | `##)` | Posicional, inmutable |
| Diccionario | `#(x: 1, y: 2)` | `##(` | Por clave, mutable |
| Función | referencia a función | `##()` | De primera clase; se muestra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | De primera clase; se muestra `<lambd/N>` |
| Unidad | `##_` | `##_` | Ausencia — no existe null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(a: 1)#? ¶          // → (##(, 1, #(a: 1))
```

Un entero que se sale del rango seguro es un error atrapable, nunca un desbordamiento silencioso:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "fuera de rango" ¶ // → fuera de rango
}
```

`##_` es cómo un programa pregunta si algo está ausente:

```zymbol
nada() { }
valor = nada()
>> (valor == ##_) ¶     // → #1
```

---

## Salida y Entrada

```zymbol
nombre = "Alicia"
total = 3
>> "Hola" ¶             // → Hola
>> "a=" nombre " b=" total ¶ // → a=Alicia b=3
>> total#? ¶            // → (###, 1, 3)
```

```zymbol
<< nombre
<< "Ingresa tu nombre: " nombre
<< ###(4) "Edad: " edad
```

**Fíjate en la forma de las dos marcas.** `>>` apunta hacia afuera: saca datos del programa.
`<<` apunta hacia adentro: los mete. No hay nada que memorizar ahí — la flecha señala hacia
dónde va la información, y esa misma idea reaparece en cada marca que mueve algo.

> `¶` y `\\` son saltos de línea equivalentes. `>>` nunca añade uno.
> Un tipo antes del prompt valida mientras lee y vuelve a preguntar hasta que el valor sea válido:
> `##.` Flotante · `##.(T,D)` decimal · `###(N)` Entero · `##"(N)` texto · `##'` un Carácter.

En el nivel superior de un archivo, `<~` es el estado de salida del programa:

```zymbol
>> "comprobando" ¶      // → comprobando
<~ 0
```

---

## Primitivas TUI

Operadores de interfaz de terminal para programas interactivos. La mayoría requiere un bloque `>>| { }` (pantalla alterna + modo crudo).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Ejecutando"
    @~ 1000
    >>~ (2, 1) > "Listo."
}
```

```zymbol
>>| {
    [filas, columnas] = >>?
    >>~ (1, 1) > "Terminal: " filas " x " columnas
    <<| tecla
    >>~ (2, 1) > "Pulsaste: " tecla
}
```

Aquí se ve por qué las marcas se combinan en vez de multiplicarse. Ya sabes que `<<` es
entrada y que `?` pregunta sin comprometerse. Falta una sola marca:

- `|` es **una sola unidad**, no todo el flujo.

Con eso, los dos operadores de teclado se leen sin explicación aparte:

```text
<<        |             ?
entrada   una unidad    sin comprometerse

<<|   toma UNA tecla y espera hasta que la haya
<<|?  mira si HAY una tecla, y sigue aunque no la haya
```

Lo mismo del otro lado: `>>` saca, y `>>!` saca **con fuerza** (limpia la pantalla entera),
mientras que `>>?` **pregunta** en vez de escribir (cuánto mide la terminal). La marca de la
derecha es la que cambia el modo, y siempre va al final.

> `>>!` limpia la pantalla. `>>?` devuelve `(filas, columnas)`. `@~ N` duerme N milisegundos.
> `<<|` lee una tecla (bloqueante); `<<|?` consulta sin bloquear (`'\0'` si no hay ninguna).
> Las flechas llegan decodificadas como `'↑' '↓' '←' '→'`; ESC es el punto de código 27.
> Tupla de posición: `(fila, columna, BKS, frente, fondo)` — cualquier ranura se omite con una coma (`>>~ (,,, 196) > "rojo"`).
> Máscara BKS: `1`=Negrita, `2`=Cursiva, `4`=Subrayado. Paleta ANSI de 256 colores (`0`=color por defecto).

---

## Operadores

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (división entera)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` nunca convierte: `"5" == 5` es `#0`. El orden sí: `"5" > 4` es `#1`, y también
> `"४२" > 5` — el texto numérico en cualquiera de las 69 escrituras compara como número.
> Una función solo es igual a sí misma, nunca a otra con el mismo cuerpo.

---

## Cadenas

```zymbol
nombre = "Alicia"
n = 42
>> "Hola " nombre " tienes " n ¶ // → Hola Alicia tienes 42
frase = "Hola {nombre}, tienes {n}"
>> frase ¶              // → Hola Alicia, tienes 42
```

```zymbol
s = "Hola Mundo"
largo = s$#                // 10
sub = s$[1..4]             // "Hola"
tiene = s$? "Mundo"        // #1
partes = "a,b,c,d"$/ ','   // [a, b, c, d]
cambio = s$~~["o":"0"]     // "H0la Mund0"
linea = "─" $* 20
```

> `+` es solo para números. Para cadenas usa yuxtaposición o interpolación.
> `\{` y `\}` son llaves literales — el escape es simétrico.

---

## Control de Flujo

```zymbol
x = 7
? x > 100 {
    >> "grande" ¶
} _? x > 0 {
    >> "positivo" ¶     // → positivo
} _ {
    >> "negativo" ¶
}
```

Aquí hay dos marcas nuevas y una tercera que sale de juntarlas:

- `?` es **preguntar**: abre una condición.
- `_` es **lo que no se especificó**: la rama que queda cuando ninguna pregunta acertó.
- `_?` es las dos cosas seguidas: *si no acertó, vuelve a preguntar*.

Por eso `_?` se escribe así y no de otra manera: no es un símbolo nuevo que aprender, es `_`
seguido de `?`, y significa exactamente lo que significan sus dos partes leídas en orden.

> Las llaves `{ }` son **obligatorias** incluso para una sola sentencia.

---

## Coincidencia

```zymbol
nota = 85
letra = ?? nota {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> letra ¶              // → B
```

```zymbol
temperatura = -5
estado = ?? temperatura {
    < 0  => "hielo"
    < 20 => "frío"
    _    => "cálido"
}
>> estado ¶             // → hielo
```

Ya conoces `?` como «preguntar». **`??` es preguntar muchas veces**: repetir una marca es,
en todo el lenguaje, hacer varias veces lo que la marca hace una vez. Un `?` compara contra
una condición; `??` compara contra una lista de casos.

Las alternativas se unen con `||`, y pueden mezclar clases de patrón:

```zymbol
tecla = 'P'
accion = ?? tecla {
    'p' || 'P' => "pausa"
    < 0 || > 100 => "fuera de rango"
    _ => "ignorada"
}
>> accion ¶             // → pausa
```

---

## Bucles

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
frutas = ["manzana", "pera", "uva"]
@ f:frutas { >> f " " }
>> ¶                    // → manzana pera uva
@ c:"hola" { >> c "-" }
>> ¶                    // → h-o-l-a-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
cuenta = 0
@:externo {
    cuenta++
    ? cuenta >= 3 { @:externo! }
}
>> cuenta ¶             // → 3
```

`@` es la marca del **tiempo**: todo lo que se repite vive en ella. Y para cortar ese tiempo
se le añade una marca al lado:

- `@!` — el `!` es **fuerza**: corta el bucle ahora.
- `@>` — el `>` empuja hacia adelante: salta a la vuelta siguiente.
- `@:externo!` — `:` **enlaza un nombre**, así que esto corta el bucle *llamado* externo, no
  el más cercano.

Tres operadores, y ninguno hubo que memorizarlo aparte: son `@` más una marca que ya dice lo
que hace.

> **Un especificador es una cuenta o una condición.** Un `Entero` es una cuenta, evaluada una
> sola vez — `@ 0` ejecuta el cuerpo cero veces. Cualquier otra cosa es una condición. No hay
> veracidad implícita: `@ []` y `@ 3.5` se rechazan. Para recorrer una colección usa
> `@ x:elementos`; para contarla, `@ elementos$#`.

---

## Funciones

```zymbol
sumar(a, b) { <~ a + b }
>> sumar(3, 4) ¶        // → 7
```

```zymbol
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶       // → 120
```

Una función lee las variables del archivo por valor, y una escritura dentro se queda dentro:

```zymbol
limite = 100
dentro(n) { <~ n < limite }
>> dentro(42) ¶         // → #1
```

Dos marcas cambian eso, y ambas se escriben **en la firma y en la llamada**:

```zymbol
incrementar(contador<~) { contador = contador + 1 }
total = 0
incrementar(total<~)
>> total ¶              // → 1
```

> `p~` es una copia de trabajo — el cuerpo puede reasignarla y el llamante queda intacto.
> `p<~` es un parámetro de salida — el cambio viaja de vuelta. `incrementar(total)` sin la
> marca es un error semántico: la anotación y la firma no pueden separarse.

---

## Lambdas y Clausuras

```zymbol
doble = x -> x * 2
suma = (a, b) -> a + b
>> doble(5) ¶           // → 10
>> suma(3, 7) ¶         // → 10
```

```zymbol
clasificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}
>> clasificar(-4) ¶     // → negativo
```

```zymbol
factor = 3
triple = x -> x * factor
>> triple(7) ¶          // → 21
```

```zymbol
crear_sumador(n) { <~ x -> x + n }
suma10 = crear_sumador(10)
>> suma10(5) ¶          // → 15
```

Una lambda puede no tomar ningún parámetro:

```zymbol
respuesta = () -> 42
>> respuesta() ¶        // → 42
```

> Una lambda captura las variables del archivo **cuando se crea**; una función con nombre las
> lee **cuando se la llama**.

---

## Arreglos

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   el índice empieza en 1
>> arr[-1] ¶      // → 5   el negativo cuenta desde el final
>> arr$# ¶        // → 5   longitud
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   añadir al final
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  insertar en la posición 2
>> (arr$- 3) ¶          // → [1, 2]         quitar la primera aparición
>> (arr$-[1]) ¶         // → [2, 3]         quitar en el índice 1
>> (arr$[1..2]) ¶       // → [1, 2]         rebanada, ambos extremos incluidos
>> (arr$? 3) ¶          // → #1             contiene
```

Todos empiezan por `$`, que es la marca de **colección**, y siguen con una marca que dice qué
se hace en ella: `#` cuántos hay, `+` añadir, `-` quitar, `?` preguntar si está. Y como en
`??`, doblar la marca significa hacerlo exhaustivamente: `$?` pregunta *si* un valor está,
`$??` pregunta *en cuántos sitios* está y los devuelve todos.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   ascendente
>> (arr$^-) ¶     // → [3, 2, 1]   descendente
```

**La regla del resultado.** Un solo operador, y lo que el código de alrededor hace con él
decide: si se usa, **construye** y deja el original intacto; si se descarta, **modifica**.

```zymbol
arr = [1, 2, 3]
copia = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> copia ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` nunca escribe dentro de una colección.** `arr[2] = 99` no es una forma de Zymbol —
> `=` le da un valor a un NOMBRE. Cambiar parte de una colección es `$~`, en todas ellas.

`[…]` guarda un solo tipo y se comprueba; una mezcla deliberada se **declara** con `#[…]`:

```zymbol
mezcla = #[1, "dos", #1]
>> mezcla ¶             // → [1, dos, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indexación Multidimensional

`>` desciende por una estructura anidada. Un grupo de corchetes direcciona un elemento, por hondo que esté.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   fila 2, columna 3
>> m[-1>-1] ¶      // → 9   última fila, última columna
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          plana: la diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   estructurada: las esquinas
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **no** es una forma de Zymbol. El índice encadenado se rechaza, tanto al leer como
> al escribir — un grupo de corchetes por acceso, y `>` es lo que va entre los pasos.

---

## Diccionarios

Una tupla con campos nombrados es un diccionario, y desde v0.0.9 se escribe `#(…)`.

```zymbol
persona = #(nombre: "Alicia", edad: 25)
>> persona.nombre ¶     // → Alicia
>> persona["edad"] ¶    // → 25
```

```zymbol
persona = #(nombre: "Alicia", edad: 25)
campo = "nombre"
>> persona[campo] ¶     // → Alicia
```

Es mutable, se le pueden añadir claves y se puede recorrer:

```zymbol
inventario = #(pera: 4)
inventario["manzana"]$~ 10
@ k:inventario { >> k "=" inventario[k] " " }
>> ¶                    // → pera=4 manzana=10
```

```zymbol
inventario = #(pera: 4, manzana: 10)
@ (k, v):inventario { >> k ":" v " " }
>> ¶                    // → pera:4 manzana:10
```

> `#()` es el diccionario vacío, que `()` no podía ser — tendría que ser también la tupla
> vacía. La forma desnuda `(a: 1)` se rechaza con el mensaje *a dictionary is written
> `#(…)`* — «un diccionario se escribe `#(…)`».
> Un diccionario se direcciona por clave, nunca por posición, así que `persona[1]` es un error.

---

## Tuplas

Las tuplas son contenedores ordenados **inmutables** que guardan valores de distintos tipos.

```zymbol
punto = (10, 20)
>> punto[1] ¶           // → 10
datos = (42, "hola", #1, 3.14)
>> datos[3] ¶           // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Cualquier intento de modificar una tupla en su sitio es un error, sea cual sea el operador —
> la inmutabilidad es una propiedad del valor, no una excepción dentro de cada `$`.

---

## Desestructuración

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[primero, *resto] = arr
>> primero ¶            // → 10
>> resto ¶              // → [20, 30, 40, 50]
```

```zymbol
punto = (100, 200)
(px, py) = punto
>> px " " py ¶          // → 100 200
```

```zymbol
persona = #(nombre: "Ana", edad: 25)
#(nombre: n, edad: e) = persona
>> n " " e ¶            // → Ana 25
```

> La forma del corchete es típica: `[…]` toma un arreglo, `(…)` una tupla, `#(…)` un
> diccionario. El último nombre **absorbe el resto**, así que la desestructuración nunca falla
> por longitud — `(a, b, c) = (1,2,3,4,5)` da `c = (3,4,5)`, y `##_` cuando no queda nada.

---

## Funciones de Orden Superior

```zymbol
numeros = [1, 2, 3, 4, 5]
>> (numeros$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (numeros$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (numeros$< (0, (acum, x) -> acum + x)) ¶ // → 15
```

```zymbol
numeros = [1, 2, 3, 4, 5, 6]
doble(x) { <~ x * 2 }
es_grande(x) { <~ x > 3 }
>> (numeros$> doble) ¶  // → [2, 4, 6, 8, 10, 12]
>> (numeros$| es_grande) ¶ // → [4, 5, 6]
```

```zymbol
base = [#(nombre: "Carla", edad: 28), #(nombre: "Ana", edad: 25)]
por_edad = base$^ (a, b -> a.edad < b.edad)
>> por_edad[1].nombre ¶ // → Ana
```

> Una función con nombre va a una función de orden superior **sin paréntesis**:
> `numeros$> doble`. Escribir `numeros$> (doble)` es un error de análisis, porque `(` abre
> una lambda.

---

## Operador de Tubería

```zymbol
doble = x -> x * 2
sumar = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> doble(_)) ¶    // → 10
>> (10 |> sumar(_, 5)) ¶ // → 15
>> (5 |> doble(_) |> inc(_)) ¶ // → 11
```

---

## Manejo de Errores

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "división por cero" ¶  // → división por cero
} :! {
    >> "otro: " _err ¶
} :> {
    >> "siempre se ejecuta" ¶ // → siempre se ejecuta
}
```

| Clase | Cuándo |
|-------|--------|
| `##Div` | División por cero |
| `##Index` | Índice fuera de rango |
| `##Key` | Clave ausente en un diccionario |
| `##Range` | Fuera del rango entero seguro |
| `##Type` | Tipo incorrecto |
| `##Parse` | Análisis de datos |
| `##IO` | Archivo / sistema |
| `##Network` | Errores de red |
| `##DB` | Base de datos |
| `##Time` | Una fecha que no existe |
| `##_` | Cualquier error (atrapa todo) |

`!` es la marca del **error y de la fuerza**, y se lee igual en las dos familias: `$!` le
pregunta a un valor si es un error; `$!!`, con la marca doblada, lo propaga hacia arriba sin
preguntar.

> Los fallos de la biblioteca estándar vuelven como **valores de error blandos** que se
> comprueban con `$!` o se atrapan con `!?`, en vez de abortar. `$!!` propaga uno al llamante.

---

## Módulos

```zymbol
# calc {
    #> { sumar, PI }

    PI := 3.14159
    sumar(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::sumar(5, 3) ¶
>> c.PI ¶
```

```zymbol
# milib {
    #> { suma_interna => suma }

    suma_interna(a, b) { <~ a + b }
}
```

Las dos marcas de módulo son la misma idea de antes, ahora aplicada a archivos: `#` es el
nivel de **declaración** —lo que una cosa *es*, no lo que vale— y la flecha dice hacia dónde
va el código:

```text
<#   la flecha entra: importar, traer de otro archivo
#>   la flecha sale:  exportar, ofrecer a otros archivos
```

Una marca de dirección siempre se pone en el borde que mira hacia donde apunta. Es la misma
razón por la que `<~` devuelve hacia la izquierda (sale de la función) y `->` entra hacia la
derecha (pasa al cuerpo de la lambda).

> **Un módulo declara lo que exporta.** El bloque `#>` es obligatorio — omitirlo es **E014**,
> y `#> { }` es cómo un módulo dice que su superficie está vacía. `::` llama a una función,
> `.` lee una constante. Dentro del cuerpo de un módulo solo caben importaciones, el bloque de
> exportación, inicializadores literales y definiciones de función; cualquier cosa ejecutable
> es **E013**.

---

## Biblioteca Estándar

Módulos nativos, que se importan como cualquier otro:

| Módulo | Funciones |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   dos glifos, cuatro columnas
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

dia = T::of(2026, 1, 31)
>> T::format(dia, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(dia, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` mide **columnas de pantalla**, no caracteres: el CJK y la mayoría de los emoji
> ocupan 2 columnas, así que una tabla se alinea con `t::width`, nunca con `$#`.
> En `std/time` un instante son milisegundos desde la época. Por debajo de un día es duración,
> de un día en adelante es calendario — así que un mes cae en el mismo día del mes, ajustado.
> `diff(a, b)` es `a - b`, así que el instante anterior primero da una respuesta negativa.

---

## Paquetes

Un `.zyp` empaqueta un programa de varios archivos en uno solo, portátil. Es un archivo de
**código fuente**, no un binario, así que corre donde corra un binario `zymbol`.

```bash
zymbol package miproyecto/ --script main.zy -o miproyecto.zyp
zymbol run miproyecto.zyp
```

> El paquete lleva un manifiesto (`zyp.toml`) que declara sus guiones de entrada y la versión
> del motor que necesita. `zymbol run` lo extrae a un directorio temporal y ejecuta desde ahí,
> de modo que el código es desechable mientras lo que el programa escriba cae en tu directorio
> de trabajo real. El playground también carga archivos `.zyp`.

---

## Modos Numéricos

Zymbol puede escribir números en **69 escrituras Unicode** — devanagari, árabe-índiga, tailandesa, pIqaD klingon, matemática negrita, segmentos LCD y más. El modo es global al proceso y afecta a la salida; la aritmética no cambia.

```zymbol
#०९#    // devanagari   (U+0966–U+096F)
#٠٩#    // árabe-índiga (U+0660–U+0669)
#๐๙#    // tailandesa   (U+0E50–U+0E59)
#09#    // vuelve a ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Los dígitos de cualquier escritura admitida son literales válidos en el código:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

La lectura es simétrica — un dígito se entiende en cualquier escritura:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` siempre es ASCII, así que `#0` se distingue del dígito cero en todas las escrituras.
> `#,` y `#^` también escriben sus dígitos en la escritura activa, y los separadores la siguen —
> pero el par nunca se invierte: `,` agrupa y `.` divide, en todas las escrituras.

---

## Operadores de Datos

```zymbol
f = ##.42         // a Flotante
i = ###3.7        // a Entero, redondeado  → 4
t = ##!3.7        // a Entero, truncado    → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Un Flotante se escribe con dígitos, nunca con exponente, y suelta el `.0` final — `##.42`
> escribe `42` y sigue siendo Flotante, como muestra `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   a prueba de fallos: devuelve la entrada intacta
>> ##!'A' ¶        // → 65    el punto de código de un carácter
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          redondear a 2 decimales
>> #!2|pi| ¶       // → 3.14          truncar a 2 decimales
>> #,|1234567| ¶   // → 1,234,567     separadores de millar
>> #^|12345.678| ¶ // → 1.2345678e4   notación científica
```

```zymbol
>> 0x41 ¶        // → A   hexadecimal
>> 0b01000001 ¶  // → A   binario
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   decimal
```

> Un literal de base en el rango ASCII es un **carácter**: `0d65 == 'A'` es `#1`, y
> `0d65 == 65` es `#0`. Las cuatro bases escriben el mismo carácter.

---

## Integración con el Shell

```zymbol
hoy = <\ date +%Y-%m-%d \>
>> "Hoy: " hoy
```

```zymbol
salida = </"./subguion.zy"/>
>> salida
```

> `<\ … \>` captura la salida estándar y la de error, sin el salto de línea final.
> `>< args` captura los argumentos de la línea de órdenes como un arreglo de cadenas.

---

## Ejemplo Completo: FizzBuzz

```zymbol
clasificar(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    <~ numero
}

@ i:1..20 { >> clasificar(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (uno por línea)
```

---

## Cómo se Combinan las Marcas

A lo largo del manual fuiste viendo lo mismo una y otra vez: **un operador no es un dibujo
que haya que memorizar, sino varias marcas puestas en fila, y cada una aporta su significado.**
Ahora que ya las conoces todas, aquí está el patrón completo.

Primero va **de qué mundo hablamos**:

| Marca | Mundo | La viste en |
|-------|-------|-------------|
| `$` | una colección | `$#` `$+` `$?` `$^-` |
| `@` | el tiempo, lo que se repite | `@!` `@>` `@~` |
| `#` | lo que algo *es*, no cuánto vale | `#?` `#(…)` `<#` `#>` |
| `>>` | sale del programa | `>>` `>>!` `>>?` |
| `<<` | entra al programa | `<<` `<<\|` `<<\|?` |
| `?` | preguntar, sin comprometerse | `?` `_?` `??` `$?` |
| `!` | fuerza, o error | `@!` `$!` `!?` |

Después va **qué se hace ahí**: `+` añadir, `-` quitar, `^` ordenar, `~` modificar, `#`
contar, `|` una sola unidad, `:` enlazar un nombre.

Y hay dos reglas que no fallan:

**Doblar una marca la hace exhaustiva.** `?` pregunta una vez, `??` compara contra muchos
casos. `$?` pregunta si un valor está, `$??` devuelve todos los sitios donde está. `!`
señala un error, `!!` lo propaga sin preguntar.

**La marca de modo va siempre al final.** Cuando `?` o `!` aparecen para decir *cómo* se hace
algo —con duda o con fuerza—, son la última marca del operador: `$??`, `$!!`, `<<|?`, `@!`,
`##!`, `>>!`, `>>?`, `@:externo!`. Nunca hay una operación después de ellas.

De ahí sale algo práctico: **una combinación que nunca has visto ya tiene sentido antes de
buscarla.** Si `$` es colección y `^` es ordenar y `-` es al revés, entonces `$^-` ordena
descendente, y no hiciste falta que nadie te lo dijera.

No todo el inventario funciona así, y vale la pena decirlo en vez de fingirlo. La mayoría de
los operadores se descomponen limpiamente. Seis se descomponen pero significan algo más que
sus partes: `!?` `:!` `:>` `|>` `::` `$++`. Y diez hay que aprenderlos de memoria porque no
se descomponen en absoluto: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Contar los opacos en vez de suponer que son pocos es deliberado: son el coste real de
> memorización del lenguaje. La referencia completa —el inventario, los homógrafos declarados
> y las reglas que un operador nuevo debe cumplir para existir— está en `SYMBOLS.md`, en el
> repositorio del intérprete.

---

## Referencia de Símbolos

| Símbolo | Operación | Símbolo | Operación |
|---------|-----------|---------|-----------|
| `=` | variable | `$#` | longitud |
| `:=` | constante | `$+` | añadir al final |
| `>>` | salida | `$+[i]` | insertar en índice (base 1) |
| `<<` | entrada | `$-` | quitar el primero por valor |
| `¶` / `\\` | salto de línea | `$--` | quitar todos por valor |
| `?` | si | `$-[i]` | quitar en índice (base 1) |
| `_?` | si no, si | `$-[i..j]` | quitar rango (base 1) |
| `_` | si no / comodín | `$?` | contiene |
| `??` | coincidencia | `$??` | todos los índices (base 1) |
| `\|\|` | alternativa en un brazo | `$[s..e]` | rebanada (base 1) |
| `@` | bucle | `$>` | mapear |
| `@ N { }` | bucle de N vueltas | `$\|` | filtrar |
| `@!` | romper | `$<` | reducir |
| `@>` | continuar | `$/ delim` | partir cadena |
| `@:nombre { }` | bucle etiquetado | `$++ a b c` | construir concatenando |
| `@:nombre!` | romper etiqueta | `$~~[p:r]` | reemplazar en cadena |
| `@:nombre>` | continuar etiqueta | `$*` | repetir cadena |
| `->` | lambda | `arr[i]$~ v` | LA forma de actualizar |
| `<~` | retorno / param. salida | `~` | param. copia de trabajo |
| `arr[i>j]` | índice de navegación | `arr[p ; q]` | extracción plana |
| `$^+` | ordenar ascendente | `$^-` | ordenar descendente |
| `$^` | ordenar con comparador | `\|>` | tubería |
| `!?` | intentar | `:!` | atrapar |
| `:>` | finalmente | `$!` | es error |
| `$!!` | propagar error | `#1` / `#0` | verdadero / falso |
| `##_` | Unidad — ausencia | `[…]` | arreglo, un tipo |
| `#[…]` | arreglo, mezcla declarada | `#(…)` | diccionario |
| `(…)` | tupla posicional | `#()` | diccionario vacío |
| `<#` | importar | `#>` | exportar |
| `#` | declarar módulo | `::` | llamada a módulo |
| `.` | acceso a campo / constante | `#?` | metadatos de tipo |
| `#\|..\|` | leer número | `##.` | convertir a Flotante |
| `###` | a Entero (redondeo) | `##!` | a Entero (truncado) |
| `#.N\|..\|` | redondear | `#!N\|..\|` | truncar |
| `#,\|..\|` | separadores de millar | `#^\|..\|` | notación científica |
| `#d0d9#` | cambiar modo numérico | `#09#` | volver a ASCII |
| `<\ ..\>` | ejecutar shell | `><` | argumentos de la línea de órdenes |
| `\ var` | destruir variable | `°x` / `x°` | definición caliente |
| `>>\|` | bloque TUI (pantalla alterna) | `>>~` | salida posicionada |
| `>>!` | limpiar pantalla | `>>?` | tamaño de la terminal |
| `<<\|` | tecla bloqueante | `<<\|?` | tecla no bloqueante |
| `@~ N` | dormir N milisegundos | `0d` `0x` `0o` `0b` | literales de base |

---

## Registro de Cambios

### v0.0.9 — Las Colecciones Decididas _(septiembre 2026)_

- **Ruptura** El diccionario tiene notación propia: `#(clave: valor)`. La forma desnuda `(a: 1)` se rechaza, y `#()` es el diccionario vacío — que `()` nunca pudo ser
- **Ruptura** Se retira la asignación indexada: `arr[i] = v` y todas sus formas compuestas. `=` le da un valor a un NOMBRE; cambiar parte de una colección es `$~`
- **Ruptura** El índice encadenado `m[i][j]` se rechaza al leer igual que al escribir — `>` es lo que va entre los pasos
- **Ruptura** Un módulo debe declarar lo que exporta (**E014**); `#> { }` dice que la superficie está vacía
- **Ruptura** Un especificador de bucle es una cuenta o una condición — sin veracidad implícita. `@ []` y `@ 3.5` se rechazan
- **Añadido** `##_` — el literal de Unidad, y cómo un programa pregunta si algo está ausente
- **Añadido** `#[…]` — un arreglo cuya mezcla de tipos se declara
- **Añadido** `#?` distingue las cuatro colecciones: `##]` `##[` `##)` `##(`
- **Añadido** `std/time` — el reloj y el calendario civil, con zonas y aritmética de calendario
- **Añadido** Un `<~` en el nivel superior es el estado de salida del programa
- **Añadido** `@ (k, v):pares` — un patrón en la cabecera del bucle
- **Añadido** `#|c|` lee un dígito en cualquiera de las 69 escrituras; `#,` y `#^` escriben en la activa
- **Cambiado** `Entero` es un entero seguro, ±(2⁵³ − 1), cerrado ante fallo en todos los motores
- **Cambiado** Una función con nombre lee las variables del archivo al llamarla, por valor
- **Cambiado** Una sentencia que solo lee un nombre avisa en vez de pasar en silencio
- **Motores** 660 de 666 archivos del corpus coinciden en los tres motores, 0 divergiendo

### v0.0.8 — Auto-liberación, `std/term` y Paquetes _(agosto 2026)_

- **Añadido** Destrucción automática en el último uso — invisible; solo baja la memoria pico
- **Añadido** `std/term` — métricas de pantalla en columnas de terminal
- **Añadido** `##!` sobre un Carácter — su punto de código Unicode
- **Añadido** Alternativas en coincidencia: `'p' || 'P' => …`, de cualquier clase en un brazo
- **Añadido** Paquetes Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Añadido** `<~` en la llamada es obligatorio donde la función declare un parámetro de salida
- **Corregido** Paridad del sistema de módulos en la máquina virtual de registros

### v0.0.7 — Biblioteca Estándar Nativa _(julio 2026)_

- **Añadido** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — todos con errores blandos
- **Añadido** Entrada tipada y validada: `<< ##.(5,2) "precio: " p`
- **Añadido** Operadores postfijos directamente en `>>` — sin paréntesis
- **Cambiado** Formateador cerrado ante fallo: se niega a escribir lo que no pueda releer

### v0.0.6 — Refinamiento y Biblioteca Científica _(junio 2026)_

- **Ruptura** `=>` sustituye a `:` en los brazos de coincidencia y a `<=` en los alias
- **Añadido** `std/math` y `std/random`
- **Añadido** Actualización de diccionario por clave: `d["k"]$~ valor`

### v0.0.5 — Primitivas TUI y Definición Caliente _(mayo 2026)_

- **Añadido** Bloque TUI `>>| { }`, salida posicionada `>>~`, teclas `<<|` y `<<|?`
- **Añadido** `>>!` limpiar pantalla, `>>?` tamaño de terminal, `@~ N` dormir
- **Añadido** Definición caliente `°x` / `x°`, y repetición de cadena `$*`

### v0.0.4 — Índice Base 1 y Funciones de Primera Clase _(abril 2026)_

- **Ruptura** Toda indexación empieza en **1** — `arr[1]` es el primer elemento
- **Añadido** Funciones con nombre como valores; sintaxis de bloque `# nombre { }`
- **Añadido** Indexación multidimensional `arr[i>j>k]` y extracción plana `arr[p ; q]`

### v0.0.3 — Sistemas Numéricos Unicode _(abril 2026)_

- **Añadido** 69 bloques de dígitos Unicode con el cambio de modo `#d0d9#`
- **Añadido** Literales booleanos en cualquier escritura — `#१` / `#०`

### v0.0.2 — Rediseño de la API de Colecciones _(marzo 2026)_

- **Añadido** La familia de operadores `$` para arreglos y cadenas
- **Añadido** Desestructuración, e índices negativos

### v0.0.1 — Primera Versión Pública _(marzo 2026)_

- Intérprete de árbol + máquina virtual de registros (`--vm`)
- Todas las construcciones del núcleo: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, módulos, lambdas, clausuras, manejo de errores
- REPL, LSP, extensión de VS Code, formateador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Inmutable._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licencia:** este manual se publica bajo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Texto completo: `LICENSE-CC-BY-SA-4.0` en <https://github.com/zymbol-lang/web>. El intérprete y el motor de navegador (`zymbol.js`) son obras separadas, con licencia AGPL-3.0-only.
