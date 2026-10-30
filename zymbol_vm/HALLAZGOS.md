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
