# zymbol_vm.js — hallazgos

> **Qué es este documento.** El registro de lo que la construcción de `zymbol_vm.js`
> —el puerto a JavaScript de la VM de registros, candidato a motor único de la web—
> descubre sobre **el lenguaje y sus motores**, según `zymbol-design/LDV.md`. Un
> defecto que esta rama encuentra se queda aquí, en la rama, con su reproducción;
> corregirlo en el motor que corresponde es otra decisión.
>
> **Forma.** La canónica de `LDV.md` § 5.2: secciones `BUG` / `GAP` / `ERROR` /
> `IDEA`, tabla resumen arriba e identificadores con ámbito de proyecto desde la
> primera entrada: `VMJS` (`BUG-VMJS-001`). No se usan `ZYVM-` ni `ZYJS-`, que son
> de los motores en ZyDDT.
>
> **Los motores** se nombran como en `zyquality/engines.toml` —**zytw** (el
> tree-walker), **zyvm** (la VM de Rust), **zyjs** (`zymbol.js`, el del navegador)—
> y **zymbol_vm.js** es el de esta rama. Toda reproducción se ejecutó en los cuatro:
> los dos de Rust con `zymbol run --tw` y `--vm` (0.0.11, con `--features db`),
> zyjs con `web/tests/run_one.mjs` y zymbol_vm.js con `tests/run_zyb.mjs` sobre el
> bytecode que compila Rust.
>
> **Estado.** Abierto el 2026-10-29.

## Resumen

| ID | Tipo | Módulo | Contexto | Estado |
|----|------|--------|----------|--------|
| [BUG-VMJS-001](#bug-vmjs-001) | BUG | zyjs · formato `#^` | `#^.N` redondea los empates hacia arriba y escribe un `.0` que los dos motores Rust no escriben: `1.3e0` donde Rust da `1.2e0` | **abierto** |
| [BUG-VMJS-002](#bug-vmjs-002) | BUG | zytw y zyvm · `$-` sobre texto | quitar de un texto una subcadena **más larga que el texto** hace caer los dos motores Rust (código 101); zyjs y zymbol_vm.js no lo tocan | **abierto** |
| [BUG-VMJS-003](#bug-vmjs-003) | BUG | zyjs · parser | un `\\` solo en su línea es una sentencia —un salto de línea— para los dos motores Rust; zyjs lo rechaza: `expected expression, found '\\'` | **abierto** |
| [BUG-VMJS-004](#bug-vmjs-004) | BUG | zyvm · compilador | después de un bloque que crea variables, un error de ejecución puede citar **la línea siguiente** a la suya: la tabla de posiciones del bytecode pierde una entrada por cada variable que muere al cerrar el bloque | **abierto** |
| [BUG-VMJS-005](#bug-vmjs-005) | BUG | zyvm · compilador | `(f() + 0.5) + 1` llama a `f` **dos veces**: el atajo del operando inmediato compila el lado izquierdo, lo descarta si es Float o texto, y el camino general lo compila otra vez | **abierto** |
| [BUG-VMJS-006](#bug-vmjs-006) | BUG | zyjs · verificador | dentro de un **módulo**, una función que asigna un nombre que también es alias de importación (`g = x * 2` con `<# ./util => g`) hace que zyjs rechace el módulo: `'g' is a module, not a value`; los dos motores Rust lo ejecutan (GLB-070). Deja a GoL sin arrancar en el navegador | **abierto** |
| [GAP-VMJS-001](#gap-vmjs-001) | GAP | zymbol_vm.js · `$^` con comparador | un `<<` dentro del comparador de `$^` no puede esperar a la entrada en el navegador: el comparador corre en una llamada anidada | **abierto** |

---

# BUG

## BUG-VMJS-001

**`#^.N` en zyjs redondea los empates hacia arriba y añade un `.0`; los dos motores Rust redondean al par y no lo añaden.**

Lo encontró el puerto del formato: `{:.Ne}` de Rust redondea un empate exacto **al
par**, a partir del valor binario exacto, y `toExponential(N)` de JavaScript lo
redondea **hacia arriba**. zymbol_vm.js reproduce el de Rust con aritmética decimal
exacta (`src/zymbol/vm/format.js`); zyjs usa `toFixed` sobre la mantisa.

**Reproducción.**

```zymbol
>> #^.1|1.25| " " #^.0|2.5| " " #^.2|1.125| " " #^.0|0.5| ¶
```

| motor | salida |
|-------|--------|
| zytw | `1.2e0 2e0 1.12e0 5e-1` |
| zyvm | `1.2e0 2e0 1.12e0 5e-1` |
| zyjs | `1.3e0 3.0e0 1.13e0 5.0e-1` |
| zymbol_vm.js | `1.2e0 2e0 1.12e0 5e-1` |

Son dos diferencias: el empate (`1.25` → `1.3`) y la forma (`3.0e0` y `5.0e-1`,
donde Rust escribe `2e0` y `5e-1` porque `{:.0e}` no lleva punto).

**Por qué no lo vio la puerta.** Ningún fichero del corpus formatea un empate
exacto con `#^.N`. El consenso declara cero divergencias de zyjs y es verdad sobre
lo que pregunta.

**Qué lo delimita.** `#.N|…|` y `#,.N|…|` no tienen el problema en ningún motor:
redondean antes con `round()` (mitad lejos de cero) y el valor ya no es un empate
cuando se formatea.

**Sugerido para el corpus:** la línea de arriba, con el golden de zytw.

## BUG-VMJS-002

**Quitar de un texto una subcadena más larga que el texto hace caer los dos motores Rust.**

Lo encontró la lectura de `ArrayRemoveValue` al portarlo: el bucle recorre
`0..=len(s) - len(patrón)` con una resta que satura a 0, y luego toma
`s[0..len(patrón)]`, que se sale del texto.

**Reproducción.**

```zymbol
s = "ab"
s$- "abc"
>> "[" s "]" ¶
```

| motor | resultado |
|-------|-----------|
| zytw | `thread 'zymbol-program' panicked at crates/zymbol-interpreter/src/collection_ops.rs:1286:37: range end index 3 out of range for slice of length 2`, código 101 |
| zyvm | `thread 'zymbol-program' panicked at crates/zymbol-vm/src/lib.rs:3033:50: range end index 3 out of range for slice of length 2`, código 101 |
| zyjs | `[ab]`, código 0 |
| zymbol_vm.js | `[ab]`, código 0 |

`zymbol check` no dice nada: el programa es correcto, y la respuesta que dan zyjs y
zymbol_vm.js —no hay nada que quitar— es la que da el mismo `$-` con un patrón que
no aparece.

**Qué lo delimita.** Solo `$-` (la primera aparición) sobre un texto, con un patrón
de texto más largo. `$--` (todas) usa `replace` y no cae; un `$-` sobre un arreglo
compara elementos y no corta nada.

**Por qué importa.** Es una caída del proceso, no un error de Zymbol: `!?` no la
captura y el programa no puede defenderse.

**Sugerido para el corpus:** el programa de arriba con el golden `[ab]`, una vez
corregido en los dos motores Rust.

## BUG-VMJS-003

**Un `\\` solo en su línea es un salto de línea para los dos motores Rust; zyjs no lo
acepta.**

Lo encontró el adaptador de AST (`src/zymbol/vm/rustast.js`), que pone el árbol del
parser de zyjs en la forma del de `zymbol-parser` y se compara con él nodo por nodo
(`tests/ast_diff.mjs`). Para Rust, `¶` y `\\` son sentencias por sí mismas
(`parse_newline`, `io.rs`), con o sin un `>>` delante. El parser de zyjs acepta `¶`
solo, pero `\\` solo cuando cierra un `>>`.

**Reproducción.**

```zymbol
>> "a" \\
\\
>> "b" ¶
```

| motor | resultado |
|-------|-----------|
| zytw | `a`, línea vacía, `b`; código 0 |
| zyvm | `a`, línea vacía, `b`; código 0 |
| zyjs | `error: expected expression, found '\\'` en `2:1`, sin salida |
| zymbol_vm.js | `a`, línea vacía, `b`; código 0 |

**Por qué no lo vio la puerta.** Ningún fichero del corpus escribe `\\` solo; el
único que lo usa como salto (`output/06_newline_variants.zy`) lo pone al final de
un `>>`.

**Qué lo delimita.** Solo la sentencia `\\` aislada. Al final de un `>>` los tres
motores coinciden.

**En esta rama.** La copia del parser de zyjs que usa zymbol_vm.js
(`src/zymbol/zymbol.js`) ya acepta las dos formas. La misma copia lleva corregido
también **BUG-ZYE-013** (ZyEdit): `"\r"` dentro de una cadena era la letra `r`; el
adaptador lo encontró en `ZyEdit/src/buffer.zy`, y el hallazgo es de ZyEdit.

**Sugerido para el corpus:** el programa de arriba, con el golden de zytw.

## BUG-VMJS-004

**Después de un bloque que crea variables, zyvm puede citar en un error de ejecución
la línea siguiente a la que falló.**

Lo encontró el puerto del compilador. Cada instrucción lleva su posición en una tabla
paralela, `Chunk::src`, que `FunctionCtx::emit` llena a la vez que la lista de
instrucciones. Dos funciones no pasan por `emit`: `zero_new_vars`, que al cerrar un
bloque pone a Unit los registros de las variables que el bloque creó, y
`reset_postfix_hot_after_loop`, que hace lo mismo con las `x°` de un bucle. Las dos
empujan su `LoadUnit` directamente en `instructions`, sin posición, y desde ahí la
tabla queda corrida una entrada: cada instrucción posterior lleva la posición de la
que la sigue. `eliminate_dead_code` filtra las dos listas por el mismo índice y
conserva el corrimiento.

**Reproducción.**

```zymbol
x = 0
? x == 0 { y = 1 }
z = 5 / x
>> z x ¶
```

| motor | resultado |
|-------|-----------|
| zytw | `Runtime error: division by zero` · `--> srcshift2.zy:3` |
| zyvm | `Runtime error: division by zero` · `--> srcshift2.zy:4` |
| zyjs | `Runtime error: division by zero` · `--> srcshift2.zy:3` |
| zymbol_vm.js | `--> srcshift2.zy:3` |

`zyb_dump` lo muestra sin ejecutar nada: 13 instrucciones y 12 posiciones.

**Qué lo delimita.** Solo cuando la instrucción que falla es la última de su
sentencia y la que la sigue es de otra línea: el corrimiento es de una entrada por
variable muerta, y casi siempre las instrucciones vecinas son de la misma sentencia.
Con `x` sin usar después (`>> z ¶`), el auto-free emite un `LoadUnit` de la misma
línea detrás de la división, y zyvm dice `3`.

**Por qué no lo vio la puerta.** El corpus tiene sus errores de ejecución en
sentencias cuya instrucción siguiente es de la misma línea, o antes del primer
bloque.

**En esta rama.** El puerto empuja la posición también en esas dos funciones. Para
comparar su bytecode con el de Rust instrucción por instrucción, el compilador de
zymbol_vm.js acepta la opción `faithful`, que reproduce el corrimiento.

**Sugerido para el corpus:** el programa de arriba con el golden de zytw.

## BUG-VMJS-005

**En zyvm, una operación con un entero literal a la derecha evalúa dos veces su lado
izquierdo cuando ese lado se sabe Float o texto.**

Lo encontró el puerto de `compile_binary`. Para `a + 1`, `a < 5` y los demás
operadores con un entero literal que cabe en 32 bits a la derecha, el compilador
prueba primero la forma inmediata (`AddIntImm`, `CmpLtImm`…): compila el lado
izquierdo y mira su tipo estático. Si es Float o String, la forma inmediata no sirve
y sigue por el camino general — que vuelve a compilar el lado izquierdo desde el
principio. Las instrucciones de la primera vez se quedan en el bytecode y se
ejecutan.

**Reproducción.**

```zymbol
f() {
    >> "llamada "
    <~ 1.5
}
x = (f() + 0.5) + 1
>> x ¶
```

| motor | salida |
|-------|--------|
| zytw | `llamada 3` |
| zyvm | `llamada llamada 3` |
| zyjs | `llamada 3` |
| zymbol_vm.js | `llamada 3` |

`(f() "a") + 2` también llama dos veces antes del error que le corresponde.

**Qué lo delimita.** Hace falta un lado izquierdo con efecto **y** tipo estático
conocido Float o String: el resultado de una llamada sola es de tipo desconocido y
toma la forma inmediata sin repetir nada; `f() + 0.5` ya es Float. Sin efecto, la
repetición solo cuesta instrucciones.

**Por qué no lo vio la puerta.** El corpus no tiene una llamada con efecto dentro
de un lado izquierdo así.

**En esta rama.** El puerto compila el lado izquierdo una vez y lo reutiliza. La
opción `faithful` del compilador reproduce la doble evaluación, para comparar
bytecode con Rust.

**Sugerido para el corpus:** el programa de arriba con el golden de zytw.

## BUG-VMJS-006

**En un módulo, zyjs no deja que una función use como variable propia un nombre que
el módulo usa como alias de importación.**

Lo encontró el arnés del compilador (`tests/compile_diff.mjs`) sobre las
aplicaciones: 21 programas de GoL compilan en Rust y la puerta de módulos de
zymbol_vm.js —que es el verificador de zyjs— los rechazaba. GLB-070 (decidido el
2026-09-26) dice que dentro de una función el nombre de un alias está libre: la
función es su propio entorno fuerte (MEM-7). El verificador de zyjs lo cumple en un
programa, pero no en un módulo: `onlyVisibleAcrossStrong` trata todo lo que está en
el ámbito del módulo como su estado (MEM-4), alias incluidos, así que `g = x * 2`
dentro de la función no crea una `g` local, y la lectura siguiente de `g` encuentra
el alias.

**Reproducción.**

```zymbol
// util.zy
# util {
    #> { uno }
    uno() {
        <~ 1
    }
}
```

```zymbol
// m.zy
# m {
    #> { f }
    <# ./util => g
    f(x) {
        g = x * 2
        <~ g + g::uno()
    }
}
```

```zymbol
// main.zy
<# ./m => m
>> m::f(3) ¶
```

| motor | resultado |
|-------|-----------|
| zytw | `7` |
| zyvm | `7` |
| zyjs | `Runtime error: failed to parse module: 1 semantic error(s) in 'm.zy'` · `m.zy:6:12: 'g' is a module, not a value` |
| zymbol_vm.js | `7` |

`zymbol check m.zy` no dice nada.

**Dónde se nota.** `GoL/εμφάνιση/όψη.zy` importa `=> γ` y su función `χωράει` usa
`γ` como variable local: en zyjs, `GoL/life.zy` y `GoL/vida.zy` no arrancan. GoL no
está en el catálogo del playground, y la puerta de aplicaciones corre sus suites
solo en los motores Rust.

**Por qué no lo vio la puerta.** El caso del corpus,
`modules_scope/alias_shadowed_by_variable.zy`, es la versión en un programa, no en
un módulo.

**En esta rama.** La copia del verificador trata un alias del ámbito del módulo
como un nombre más, no como estado.

**Sugerido para el corpus:** los tres ficheros de arriba, en `modules_scope/`, con
el golden `7`.

---

# GAP

## GAP-VMJS-001

**En zymbol_vm.js, un `<<` dentro del comparador de `$^` no puede esperar a la entrada.**

zymbol_vm.js corre síncrono y se detiene devolviendo el control: así espera un
`<<` en el navegador sin congelar la página, también dentro de la lambda de `$>`,
`$|` y `$<`, que corren en los marcos de la propia máquina (`HofNext`). El
comparador de `$^` no: igual que en la VM de Rust, se llama desde dentro de la
instrucción (`call_callable`), y desde ahí la máquina no puede devolver el control
a la mitad de una ordenación.

Con un anfitrión que tiene la línea a mano —el de `tests/run_zyb.mjs`— funciona. Con
uno que tiene que esperarla —el navegador— zymbol_vm.js responde `zymbol_vm.js:
not yet: a `<<` that has to wait, inside a sort comparator`. Lo mismo vale para
un `@~` dentro del comparador.

**Qué lo cerraría.** Ordenar con la máquina en marcha: el merge sort de `$^` como
una sucesión de llamadas en los marcos de la máquina, como `HofNext` hizo con
`$>`. La VM de Rust lo descartó para sí (`SortNext`, +6,8 % de instrucciones el
2026-10-17); en zymbol_vm.js la razón para hacerlo es otra, y su coste está por
medir.
