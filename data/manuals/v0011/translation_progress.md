# Translation Progress — Zymbol-Lang v0.0.11

**Referencia base:** `v0011/manual_en.md` · **Gates:** `bash gates.sh XX` desde este directorio
(los mismos seis de `v009/`, copiados aquí; comparan contra el `manual_en.md` de **este**
directorio).

**Estructura de referencia (bloqueada):** H1=3 · H2=30 · H3=11 · HR=33 · bloques `zymbol`=76
· 354 líneas de código · 3 bloques `text` · 2 bloques `bash` · 81 fences abiertos = 81 cerrados.

Las reglas de traducción, los seis gates y lo que cada uno no ve están en
`../v009/translation_progress.md` y siguen valiendo sin cambios. Esta página solo dice qué
cambia de v0.0.9 a v0.0.11 y en qué orden se lleva.

## Qué es un lote

**Copiar y mejorar, no retraducir.** Cada idioma parte de su propio `v009/manual_XX.md`, que
ya pasó los seis gates y la revisión de palabras reales; se copia aquí y se le aplica la
lista de abajo, en su idioma, con la terminología que ese manual ya usa. Lo demás no se toca.

1. `cp ../v009/manual_XX.md .`
2. Aplicar los 15 cambios de abajo.
3. `bash gates.sh XX` — A con 0 no-OK; B, C, E y F con 0 fallos; D se lee.
4. Añadir `XX` a `V0011_CODES` en `web/src/site/manual.js` y correr
   `node tests/test_manual_v0011.mjs`. **Escribir el manual no es publicarlo.**
5. Marcar la fila de la cola.

## Los 15 cambios de v0.0.9 a v0.0.11

Cada uno verificado en los tres motores (`zytw`, `zyvm`, `zyjs`) el 2026-10-28.

| # | Sección | Cambio | Por qué |
|--:|---------|--------|---------|
| 1 | cabecera | «Revised for v0.0.11 — 2026-10-28» | — |
| 2 | cabecera | v0.0.11 · 708/714 | corpus de 2026-10-25 |
| 3 | TUI | `[filas, columnas] = >>?` → `(filas, columnas) = >>?` | `>>?` da una tupla; el patrón de arreglo **ya fallaba en v0.0.9** |
| 4 | Control de flujo | nota: una condición es un Booleano; `? xs { }` se rechaza | GLB-121, v0.0.10 |
| 5 | Funciones | el bloque `limite` se sustituye por **dos** (`LIMITE :=` y el parámetro `tope`) + una nota con el mensaje del compilador | MEM-2, v0.0.10: el ejemplo de v0.0.9 hoy es un error |
| 6 | Lambdas | la nota final: la lambda ve lo que tiene el lugar donde se escribe y lo captura al crearse | MEM-6; ya no se contrasta con la función con nombre |
| 7 | Arreglos | línea nueva `>> (arr$[3..1]) ¶ // → [3, 2, 1]` | rebanada al revés, v0.0.10 |
| 8 | Diccionarios | nota: una clave escrita dos veces se rechaza | GLB-131, v0.0.11 |
| 9 | Errores | fila `##Depth` en la tabla | D7, v0.0.11 |
| 10 | Errores | párrafo + bloque `##Parse("…")` / `##Parse(msj) =>` + nota | v0.0.10 |
| 11 | Biblioteca | `semilla` en `std/random`, `timeout` en `std/net`, y dos líneas en la nota | G8, ZethyCLI G1 |
| 12 | **nueva H2** «Running a Program», antes de Paquetes | bloque `bash` + nota de efectos | G1, G3, `--count` |
| 13 | Operadores de datos | línea `>> ##'65 ¶ // → A` | v0.0.10 |
| 14 | Shell | `<\ date … \>` → `<\ "date +%Y-%m-%d" \>` + nota del valor como una palabra y del subguion con argumentos | el bloque **no se analizaba ni en v0.0.9**; G2 |
| 15 | Símbolos y registro | fila `##'` / `##Kind("m")`; entradas v0.0.11 y v0.0.10 en el registro | — |

**Lo que pide cuidado en cada idioma:**

- **6 y 5 cambian de sentido, no de palabras.** La frase de v0.0.9 decía lo contrario de lo
  que hoy es verdad. Traducir la frase inglesa nueva, no retocar la vieja.
- **El mensaje del compilador va en inglés** (`'limite' is read from outside this function`),
  con la traducción al lado, como ya hace el manual con *a dictionary is written `#(…)`*. Y el
  nombre dentro del mensaje es el identificador **traducido**, el del propio bloque.
- **`##Parse` no se traduce; su mensaje sí.** El bloque 10 tiene dos `// →` que Gate C
  recalcula: `python3 fix_claims.py manual_XX.md` si la cadena cambió.
- **`semilla`, `timeout`, `--deny`, `--timeout`, `--count`, `--effects` y los nueve efectos
  son nombres**: no se traducen (como los de `std/`, ver `fix_api_names.py`).
- **En el registro**, «v0.0.9 … lee las variables del archivo» se deja: es historia, y la
  entrada de v0.0.10 dice que se retiró.

## Cola — por hablantes, el mismo orden que v0.0.9

| # | Código | Idioma | Hablantes | Lote | Estado |
|--:|--------|--------|----------:|-----:|--------|
| 1 | `en` | english | 1500M | 1 | ✅ |
| 2 | `zh` | mandarin | 1100M | 2 | ✅ |
| 3 | `hi` | hindi | 600M | 2 | ✅ |
| 4 | `es` | spanish | 600M | 1 | ✅ |
| 5 | `ar` | arabic | 400M | 2 | ✅ |
| 6 | `fr` | french | 310M | 2 | ✅ |
| 7 | `bn` | bengali | 270M | 3 | ✅ |
| 8 | `pt` | portuguese | 260M | 3 | ✅ |
| 9 | `ru` | russian | 255M | 3 | ✅ |
| 10 | `ur` | urdu | 230M | 3 | ✅ |
| 11 | `sw` | swahili | 200M | 4 | ✅ |
| 12 | `id` | indonesian | 200M | 4 | ✅ |
| 13 | `de` | german | 135M | 4 | ✅ |
| 14 | `pa` | punjabi | 125M | 4 | ✅ |
| 15 | `ja` | japanese | 125M | 5 | ✅ |
| 16 | `te` | telugu | 95M | 5 | ✅ |
| 17 | `tr` | turkish | 90M | 5 | ✅ |
| 18 | `vi` | vietnamese | 85M | 5 | ✅ |
| 19 | `ta` | tamil | 85M | 6 | ✅ |
| 20 | `mr` | marathi | 83M | 6 | ✅ |
| 21 | `ko` | korean | 82M | 6 | ✅ |
| 22 | `jv` | javanese | 82M | 6 | ✅ |
| 23 | `ha` | hausa | 80M | 7 | ✅ |
| 24 | `fa` | persian | 70M | 7 | ✅ |
| 25 | `it` | italian | 65M | 7 | ✅ |
| 26 | `th` | thai | 60M | 7 | ✅ |
| 27 | `gu` | gujarati | 57M | 8 | ✅ |
| 28 | `kn` | kannada | 56M | 8 | ✅ |
| 29 | `yo` | yoruba | 45M | 8 | ✅ |
| 30 | `tl` | tagalog | 45M | 8 | ✅ |
| 31 | `my` | burmese | 43M | 9 | ✅ |
| 32 | `uk` | ukrainian | 40M | 9 | ✅ |
| 33 | `ps` | pashto | 40M | 9 | ✅ |
| 34 | `pl` | polish | 40M | 9 | ✅ |
| 35 | `ml` | malayalam | 38M | 10 | ✅ |
| 36 | `ms` | malay | 35M | 10 | ✅ |
| 37 | `su` | sundanese | 32M | 10 | ✅ |
| 38 | `ne` | nepali | 32M | 10 | ✅ |
| 39 | `lo` | lao | 30M | 11 | ✅ |
| 40 | `ku` | kurdish | 30M | 11 | ✅ |
| 41 | `ig` | igbo | 30M | 11 | ✅ |
| 42 | `az` | azerbaijani | 30M | 11 | ✅ |
| 43 | `zu` | zulu | 28M | 12 | ✅ |
| 44 | `nl` | dutch | 25M | 12 | ✅ |
| 45 | `ro` | romanian | 24M | 12 | ✅ |
| 46 | `si` | sinhala | 17M | 12 | ✅ |
| 47 | `km` | khmer | 17M | 13 | ✅ |
| 48 | `af` | afrikaans | 17M | 13 | ✅ |
| 49 | `el` | greek | 13M | 13 | ✅ |
| 50 | `cs` | czech | 11M | 13 | ✅ |
| 51 | `qu` | quechua | 8M | 13 | ✅ |

## Lo que trajo cada lote

**Lote 1 (`en`, `es`, 2026-10-28).** Las dos referencias.

**Lote 2 (`zh`, `hi`, `ar`, `fr`, 2026-10-28).** Seis gates en verde en los cuatro, y los 76
bloques con la misma salida en `zytw` y `zyvm`. Tres cosas que los gates no veían:

- **El chino de v0.0.9 tenía un fence de cierre suelto** al final del archivo, después de la
  licencia: 78 aperturas y 79 cierres. Es el único de los 51 (medido). Corregido en la copia;
  `tests/test_manual_v0011.mjs` ya cuenta aperturas y cierres, así que no vuelve a entrar.
- **El registro de v0.0.9 en hindi decía «660 में से 666»**, al revés. Corregido.
- **`zyjs` rechaza una cuenta de decimales en otra escritura**: `#.२|π|` y `#.٢|ط|` dan
  `expected a decimal count after '#.'` en el navegador, y `3.14` en los dos motores Rust. El
  bloque es el mismo en v0.0.9; afecta a todo idioma que escriba sus literales con cifras
  propias (hindi y árabe en este lote). **Es del motor, no del manual**: el manual no cambia, y
  el hallazgo está por registrar y decidir.

**Lote 3 (`bn`, `pt`, `ru`, `ur`, 2026-10-28).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de bengalí y urdu
(la misma cuenta de decimales con cifras propias que ya dio hindi y árabe). Sin fences sueltos.

- **El bengalí escribe la fecha de la cabecera con sus cifras** (`২০২৬-১০-২৮`). El test de
  cabecera usaba `\d`, que solo reconoce ASCII; ahora usa `\p{Nd}`. El urdu la escribe en ASCII.
- **Los nombres de las notas se comprobaron contra el compilador:** el mensaje de MEM-2 sale
  literalmente con `'সীমা'`, `'limite'`, `'предел'` y `'حد'`.
- **Las anclas de `std/time` varían:** portugués y ruso abren la nota con «Em `std/time`» y
  «В `std/time`», no con «> `std/time`». El script de aplicación aborta si una ancla no aparece
  exactamente una vez, y por eso lo vio.
- **Gate D en portugués** lista 10 líneas: los préstamos `string` y `array`, que v0.0.9 ya
  traía y son el criterio aceptado de ese manual.

**Lote 4 (`sw`, `id`, `de`, `pa`, 2026-10-29).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de punyabí (la
cuenta de decimales con cifras propias: ya son cinco los manuales afectados). Sin fences sueltos.

- **Gate D no trajo nada nuevo:** indonesio (9 líneas) y alemán (23) listan exactamente las
  mismas que en v0.0.9; swahili y punyabí, ninguna.
- **El mensaje de MEM-2 sale literal** con `'kikomo'`, `'batas'`, `'grenze'` y `'ਸੀਮਾ'`.
- **Otra vez las anclas de la prosa:** la nota del diccionario en alemán termina en «ein
  Fehler» y no en «ist ein Fehler»; el script aborta si un ancla no aparece una sola vez.
- **Punyabí:** los literales nuevos van en gurmukhi (`$[੩..੧]`, `##'੬੫`, `#(a: ੧, a: ੨)`),
  y la cabecera conserva la fecha en ASCII como la de v0.0.9.

**Lote 5 (`ja`, `te`, `tr`, `vi`, 2026-10-29).** Seis gates en verde en los cuatro, sin
residuos en Gate D; los 76 bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el
bloque 72 de telugu (la cuenta de decimales con cifras propias: seis manuales afectados). Sin
fences sueltos. El mensaje de MEM-2 sale literal con `'制限'`, `'పరిమితి'`, `'sınır'` y
`'giới_hạn'`.

- **El japonés lleva una línea de más** respecto a los demás (su línea 272 es la 271 del resto,
  porque abre con una línea extra), así que las anclas por número de línea no valen: el script
  ancla por contenido, y por eso aplicó a la primera.
- **Telugu escribe los literales en sus cifras** (`$[౩..౧]`, `##'౬౫`, `#(a: ౧, a: ౨)`), y evita
  el carácter de unión de ancho cero (U+200C) en prosa y en los nombres nuevos.

**Lote 6 (`ta`, `mr`, `ko`, `jv`, 2026-10-29).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de tamil y maratí
(la cuenta de decimales con cifras propias: ocho manuales afectados). Sin fences sueltos. El
mensaje de MEM-2 sale literal con `'வரம்பு'`, `'मर्यादा'`, `'한계'` y `'wates'`.

- **Gate D en javanés** baja de 20 líneas a 18: las dos que desaparecen eran `file` y
  `Fungsi` en la frase de v0.0.9 que MEM-2 hizo falsa y se reescribió. Ninguna nueva.
- **Las palabras de «parámetro» y «constante» se leyeron del propio manual** antes de escribir
  (tamil `அளவுரு`/`மாறிலி`, maratí `पॅरामीटर`/`स्थिरांक`, coreano `매개변수`/`상수`, javanés
  `parameter`/`konstanta`), en vez de elegirlas: es lo que ningún gate comprueba.
- Los cuatro tienen el diseño estándar de 1053 líneas, sin el desplazamiento del japonés.

Para los idiomas con cifras propias, los bloques nuevos siguen la escritura del manual en los
literales (`[३..१]`, `##'६५`, `##'١٥٧١`) y dejan las anotaciones en ASCII, que es lo que el
programa imprime — comprobado en los tres motores.

**Lote 7 (`ha`, `fa`, `it`, `th`, 2026-10-29).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de persa y tailandés
(la cuenta de decimales con cifras propias: diez manuales afectados). Sin fences sueltos. El
mensaje de MEM-2 sale literal con `'iyaka'`, `'حد'`, `'limite'` y `'ขีดจำกัด'`.

- **Gate D en italiano** pasa de 28 a 30 líneas: sólo `file` (préstamo corriente) en la nota de
  la lambda y en la de los efectos. El italiano no lo tradujo DeepSeek sino Haiku; no hizo falta
  nada distinto, pero las palabras («parametro», «costante», «condizione») se leyeron del manual.
- **Dos erratas de v0.0.9 corregidas de paso**: en hausa y persa la nota de `>>?` decía
  `[filas, columnas]` aunque devuelve una tupla (el italiano ya decía `(righe, colonne)`); en
  tailandés ocurría lo mismo. Y el hausa decía que `@~ N` duerme N *minutos* (`minti`), no
  milisegundos, en la nota y en la tabla de símbolos.
  La misma errata (`[a, b]` en vez de `(a, b)` tras `>>?`) estaba en los lotes 5 y 6 — `ko`, `mr`,
  `ta`, `te`, `tr`, `vi`, `jv` — y se corrigió ahí también; los gates siguen en verde.

**Lote 8 (`gu`, `kn`, `yo`, `tl`, 2026-10-29).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de guyaratí y
canarés (la cuenta de decimales con cifras propias: doce manuales afectados). Sin fences sueltos.
El mensaje de MEM-2 sale literal con `'મર્યાદા'`, `'ಮಿತಿ'`, `'ààlà'` y `'limitasyon'`.

- **Gate D en tagalo** sube de 75 a 80 líneas: `array`, `error` y `file`, que el manual ya
  usa como préstamos en las 75 anteriores. Los otros tres salen con 0.
- **Cadenas con marcas combinantes** (canarés con ZWNJ, yoruba con tonos): las frases que se
  reemplazan y las etiquetas del registro se leen del propio manual en lugar de escribirse a
  mano, y la columna de `=>` en el bloque de `##Parse` se alinea por puntos de código.
- En guyaratí, canarés, yoruba y tagalo las cifras del registro y de la tabla de errores siguen
  la escritura del propio registro de v0.0.9 (ASCII); los literales de código, la del bloque.
- La traducción de los textos en yoruba y tagalo —igual que en los lotes anteriores— no la
  revisó un hablante: los gates validan estructura, sintaxis y afirmaciones, no la lengua.

**Lote 9 (`my`, `uk`, `ps`, `pl`, 2026-10-29).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de birmano y
pastún (la cuenta de decimales con cifras propias: catorce manuales afectados). Sin fences
sueltos. El mensaje de MEM-2 sale literal con `'ကန့်သတ်'`, `'межа'`, `'حد'` y `'granica'`.

- **Gate D**: ucraniano y polaco quedan en 0 y pastún en 0; birmano sube de 5 a 6 por la palabra
  `loop` en una entrada del registro, préstamo que el manual ya usa.
- Las frases a reemplazar y las etiquetas del registro se leen del propio manual
  (`hdr.py` en el scratchpad), así que ninguna depende de teclear marcas combinantes a mano.
- Como en los lotes anteriores, ningún hablante revisó estas lenguas: los gates validan
  estructura, sintaxis y afirmaciones, no el idioma.

**Lote 10 (`ml`, `ms`, `su`, `ne`, 2026-10-29).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de malayalam y
nepalí (la cuenta de decimales con cifras propias: dieciséis manuales afectados). Sin fences
sueltos. El mensaje de MEM-2 sale literal con `'പരിധി'`, `'had'`, `'wates'` y `'सीमा'`.

- **Gate D**: malayalam y nepalí en 0; malayo sube de 47 a 48 (`array` en la línea nueva de la
  rebanada) y sundanés de 48 a 50 (`array`, `file`, `loop`), todos préstamos que ya usan.
- **Cifras**: el registro de nepalí escribe sus cifras en devanagari (`६६६`), así que las
  entradas nuevas también (`७०८ … ७१४`); en malayalam, malayo y sundanés el registro usa ASCII.
- Los nombres del bloque de función (`had`/`dalam`, `परिधि`…) se leen del propio manual con
  `fn_codes` (scratchpad), no se teclean: el mensaje de MEM-2 cita el identificador traducido.
- Como siempre, ningún hablante revisó estas lenguas.

**Lote 11 (`lo`, `ku`, `ig`, `az`, 2026-10-29).** Seis gates en verde en los cuatro (salvo lo
que sigue en igbo); los 76 bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el
bloque 72 de laosiano y kurdo (la cuenta de decimales con cifras propias: dieciocho manuales
afectados). Sin fences sueltos. El mensaje de MEM-2 sale literal con `'ຂີດຈຳກັດ'`, `'سنوور'`,
`'oke'` y `'hədd'`.

- **Gate E en igbo: 1, y ya estaba en v0.0.9.** Es un falso positivo de la herramienta, no del
  manual: dos bloques distintos usan el alias `m` (`<# ./mgbako => m` y `<# std/math => m`) y
  el gate cree que `m::sqrt` llama al módulo local. Los dos bloques se ejecutan bien por
  separado; no se tocó.
- **Gate D**: los cuatro en 0.
- Kurdo (sorani) y laosiano escriben las cifras del bloque en su escritura (`۱۰۰`, `໑໐໐`) y las
  del registro en ASCII; igbo y azerí usan ASCII en todas partes.
- Como siempre, ningún hablante revisó estas lenguas.

**Lote 12 (`zu`, `nl`, `ro`, `si`, 2026-10-29).** Seis gates en verde en los cuatro; los 76
bloques con la misma salida en `zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de cingalés (la
cuenta de decimales con cifras propias: diecinueve manuales afectados). Sin fences sueltos. El
mensaje de MEM-2 sale literal con `'umkhawulo'`, `'limiet'`, `'limită'` y `'සීමාව'`.

- **Gate D**: zulú, rumano y cingalés en 0; neerlandés se queda en 5, las mismas de v0.0.9.
- **Errata de v0.0.9 corregida en rumano**: «să abandonе» llevaba una *е* cirílica
  (U+0435) en la línea de los fallos de la biblioteca; ahora es «să abandoneze», latina.
- El cingalés escribe las cifras del bloque con sus dígitos Lith (`෧෦෦`, `෬෫`) y las del
  registro en ASCII; zulú, neerlandés y rumano usan ASCII en todas partes.
- Como siempre, ningún hablante revisó estas lenguas.

**Lote 13 (`km`, `af`, `el`, `cs`, `qu`, 2026-10-29) — el último: los 51 manuales de la cola
están en v0.0.11.** Seis gates en verde en los cinco; los 76 bloques con la misma salida en
`zytw` y `zyvm`, y en `zyjs` salvo el bloque 72 de jemer (la cuenta de decimales con cifras
propias: veinte manuales afectados). Sin fences sueltos. El mensaje de MEM-2 sale literal con
`'ដែនកំណត់'`, `'limiet'`, `'όριο'`, `'limit'` y `'kancha'`.

- **Gate D**: jemer, griego y checo en 0; afrikáans sube de 7 a 11 (`loop`, que en afrikáans
  significa «correr» —el mismo falso positivo de las 7 anteriores—).
- **Quechua**: es el manual que escribió Sonnet y tiene una estructura algo distinta (1094
  líneas, notas en varias líneas, mezcla de quechua y préstamos del español). Los anclajes
  se eligieron sobre la *última* línea de cada nota para no partirla, y el bloque de la
  función se localiza por su frase, no por número de línea. En v0.0.9 su B y su C ya fallaban
  en el bloque de MEM-2; ahora pasan.
- Jemer escribe las cifras del bloque en su escritura (`១០០`, `៦៥`) y las del registro en
  ASCII; afrikáans, griego y checo usan ASCII en todas partes.
- Como siempre, ningún hablante revisó estas lenguas.

Los borradores de v0.0.9 (`am`, `qu_borrador`) no entran: no se publicaron, y un borrador no
se mejora, se termina primero en `v009/`. Los idiomas que v0.0.9 nunca tuvo siguen en la cola
de `../v009/translation_progress.md`; cuando se escriban, se escriben ya contra esta
referencia.
