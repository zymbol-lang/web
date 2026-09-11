# Translation Progress — Zymbol-Lang v0.0.9

**Referencia base:** `v009/manual_en.md` · **Validador:** `python3 web/data/manuals/v009/manual_compare.py manual_XX.md`

**Estructura de referencia (bloqueada):** H1=3 · H2=29 · H3=9 · HR=32 · bloques `zymbol`=74 · 337 líneas de código · 3 bloques `text` (TUI, módulos y el aviso del compilador)

## Reglas de ejecución críticas
- NO lanzar agentes en background ni subagentes paralelos
- Trabajar un archivo a la vez — completar y verificar antes de continuar
- Ejecutar los dos gates en la sesión actual, no delegarlos
- Reportar resultado y esperar confirmación antes del siguiente idioma

## Los seis gates, y por qué son seis
1. **Gate A — estructura:** `python3 manual_compare.py manual_XX.md` desde `v009/`.
   Todo debe decir `OK`: mismos H1/H2/H3, mismos `---`, y los 74 bloques con las mismas
   líneas internas.
2. **Gate B — sintaxis:** `python3 gate_b.py manual_XX.md`. Cada bloque `zymbol` se ejecuta
   con `zymbol check`, y **el veredicto es el código de salida**. Un gate que busca la palabra
   «error» en stderr no ve las negativas de v0.0.9 (`a dictionary is written`, `indexed
   assignment does not exist`, `chained index does not exist`) — así se colaron 8 bloques
   rotos en el manual v0.0.5.
3. **Gate C — las afirmaciones:** `python3 verify_claims.py manual_XX.md`. Cada `// → valor`
   se compara con lo que el bloque imprime de verdad. Compilar no es decir la verdad:
   `f = ##.42  // 42.0` compiló durante cuatro versiones y un Flotante imprime `42`.
   Debe decir **0 wrong**.
4. **Gate D — residuos:** `python3 gate_d.py manual_XX.md`. Reporta lo que quedó en inglés.

### Los dígitos de una anotación NO se traducen

El error más frecuente en un idioma con escritura numérica propia, y el más razonable de
cometer: el traductor escribe `// → १४` donde el programa imprime `14`. Medido en hindi:
**22 de 23 fallos de Gate C eran exactamente eso.**

Una anotación es **salida**, no prosa. Zymbol escribe cifras ASCII salvo que el propio
programa haya cambiado de escritura con `#०९#`. Dentro de la sección «Modos Numéricos» el
modo SÍ está activo, así que ahí la salida real es devanagari y la anotación también.

No hay que decidirlo a mano: **`python3 fix_claims.py manual_XX.md`** reescribe cada
anotación con lo que el bloque imprime de verdad, y por eso acierta en los dos contextos
sin saber en cuál está.

### Gate E — el módulo de ejemplo y su llamada tienen que coincidir

`python3 gate_e.py manual_XX.md`, y debe decir **0 incoherent**.

Gate B se salta el bloque que declara un módulo (no es un guion ejecutable) y el que lo
importa (el hermano no existe junto a un fichero temporal). Los dos saltos son correctos
por separado — y entre los dos queda un agujero: un manual puede declarar
`# calc { #> { sumar } … }` y luego llamar `c::add(5, 3)`, y **todos los demás gates siguen
en verde** mientras el ejemplo no puede funcionar.

Descubierto el 2026-09-09 de la peor manera: un script pensado para restaurar los nombres de
`std/` reescribió también la llamada al módulo de ejemplo y rompió **siete manuales a la
vez**, sin que ningún gate se enterara. La lección no es «cuidado con los scripts» — es que
**dos saltos correctos pueden sumar un agujero**, y un agujero merece su propio gate.

### Gate F — el comentario `// valor` también es una afirmación

`python3 gate_f.py manual_XX.md`, y debe decir **0 wrong**.

Gate C lee la anotación de una línea `>>`. La otra mitad de lo que el manual afirma no la
leía nadie:

```
lango = s$#                  // 11
sub   = s$[1..5]             // "Hola"
rep   = s$~~["l":"L"]        // "HoLa MuNdo"
```

Eso no lo ejecutó nunca nada. Medido el 2026-09-10, **39 comentarios falsos en 18 de los 22
manuales**, y los 39 en el mismo bloque: el de operaciones de cadena. El traductor cambia la
cadena y no recalcula nada. Tres formas, siempre las mismas:

- **la longitud**, copiada del inglés: marathi decía ११ de una cadena de 10 puntos de código;
  telugu ११ de una de 16; punyabí ੧੧ de una de 18
- **el corte**, con el límite del inglés: `s$[१..५]` sobre «नमस्ते विश्व» devuelve `नमस्त`,
  y el comentario prometía la palabra entera
- **el reemplazo**, inventado: hindi cambiaba `ल`→`र` en una cadena **sin ninguna `ल`**, y
  afirmaba un resultado distinto del original; marathi hacía el reemplazo de verdad y
  afirmaba que la cadena salía intacta

**Cómo decide qué comentario es una afirmación:** no mirándolo. `// variable mutable` es un
comentario y `// 11` es una afirmación, y ninguna regex distingue eso en un idioma que no
sabe leer. Lo decide el manual inglés: sus bloques son línea a línea los mismos (lo prueba
Gate A), así que una posición cuyo comentario inglés coincide con lo que el inglés imprime
es una afirmación de valor, y la traducción tiene que coincidir con **su** ejecución en esa
misma posición. Un comentario descriptivo no coincide nunca, y por eso no se comprueba en
ningún idioma.

Y como en Gate C, no se arregla a mano: **`python3 fix_comments.py manual_XX.md`** reescribe
el comentario con el valor real, en la escritura de cifras que el propio bloque usa.

Dos cosas que el arreglo automático **no** hace, porque son del ejemplo y no del comentario:
si el corte deja una palabra a medias, el límite se ajusta a lo que el comentario promete
(el inglés corta `"Hello"` de `"Hello World"`, no media palabra); y si el par de reemplazo
no aparece en la cadena, hay que elegir otro par — hindi, italiano y tamil se quedaban sin
enseñar nada.

### Los nombres de `std/` no se traducen

También medido en hindi: `t::चौड़ाई` por `t::width` y `T::प्रारूप` por `T::format` — dos
bloques que no compilaban. La biblioteca exporta `width`, `format`, `sqrt`… en inglés en
todos los idiomas, igual que los operadores. Se traduce lo que los rodea, no ellos.

Pasó en **chino, hindi, árabe, francés, suajili e indonesio** — seis de seis, siempre en los
mismos dos bloques. Ya no es «a veces ocurre»: **pásale `fix_api_names.py` a toda traducción
nueva antes de mirar nada más**. Restaura desde el inglés por posición y deja en paz las
llamadas a módulos locales — indonesio es la prueba: cambió `T::tambah` (que es
`std/time::add`) y no tocó la función `tambah(a, b)` del propio manual, que se llama igual.

En suajili además restauró la tabla de `std/`, once nombres en total; en indonesio, nueve.
Y hay un tercer sitio que el script no miraba: la **frase** que sigue al ejemplo de
`std/term` nombra `t::width` en prosa, no dentro de un bloque. Seis traducciones seguidas
(te, tr, vi, ta, mr, ko) tenían el bloque bien y la frase llamando a `t::genişlik`,
`t::너비`, `t::அகலம்`. `fix_api_names.py` ya hace también esa pasada, por posición.
Y ojo con `std/random`: sus exports **son** `entero rango peso_f64`, en español, en todos los
idiomas. No es un residuo sin traducir — verificado contra el binario, `r::int` no existe.
   No falla solo (hay préstamos legítimos), pero tiene que cazar siempre las variables y
   cadenas sin traducir dentro del código.

### Lo que trajeron suajili e indonesio, aparte de los nombres de `std/`

- **suajili**: una errata rompía dos bloques — la función se define `ainisha` y se llamaba
  `ainsha`, sin la `i`. El gate B la caza («undefined function»), que es exactamente para lo
  que está; ninguna revisión de lectura la habría visto.
- **indonesio**: `file` sin traducir en 12 sitios, teniendo `berkas`. No lo caza ningún gate
  como fallo — el D lo lista y deja decidir. El criterio ya estaba fijado por los hermanos:
  francés `fichier`, portugués `arquivo`, suajili `faili`. **`string` sí se queda**: es el
  préstamo aceptado, igual que en portugués, y hindi/urdu/bengalí lo transliteran en vez de
  traducirlo.
- **Los dos estaban escritos y sin añadir a `V009_CODES`** (`web/src/site/manual.js`), así
  que ningún lector los habría visto nunca y nada parecía roto. Lo caza
  `tests/test_manual_v009.mjs`. **Escribir el manual no es publicarlo: falta esa línea.**

### Lo que trajeron alemán, punyabí y japonés

- **Un fence sin cerrar no lo ve ningún gate** (alemán): faltaba un ``` de cierre, así que
  un bloque `text` se tragaba nueve líneas de prosa. A, B y C pasaban — miran bloques
  emparejados — y solo se vio **renderizado**: 73 bloques en el navegador donde los demás
  dan 74. Contar los fences por tipo los compara: 74 `zymbol` + 3 `text` + 1 `bash` = 78
  aperturas, y había 77 cierres.
- **La estructura está bloqueada de verdad** (japonés): añadió una rama al `??` de las
  calificaciones — 8 líneas donde el inglés tiene 7 — y de paso usó `'不可'`, dos caracteres
  donde un literal `'…'` admite uno. Gate A y gate B, cada uno cazando su mitad.
- **La escritura propia va en el literal, NUNCA en el resultado** (punyabí): 21 afirmaciones
  mal, todas del mismo tipo — `// → ੧੪` donde el motor imprime `14`, porque el modo numeral
  está apagado. Es el error del urdu **al revés**, y se arregla con el mismo oráculo: alinear
  con el hindi posición a posición.
- **Un residuo puede ser la palabra del idioma** (alemán): los 23 del gate D son `name`
  (que *es* la palabra alemana, en minúscula como `alter`, `person`, `feld`) y los préstamos
  `Array`/`Block`. Igual que los 11 del español, que son todos `error`. **El gate D no falla
  solo precisamente por esto**: mide coincidencia con el inglés, no préstamo.
- **El separador decimal se mide, no se supone** (japonés): afirmaba `３．１４` con el punto
  ancho y el motor emite `３.１４` con el punto ASCII. El urdu sí recibe `٫`. Ejecutar el
  bloque es la única forma de saberlo.

**Y lo que ningún gate puede comprobar: si las palabras son reales.** Medido el 2026-09-08:
un quechua traducido por un modelo pequeño pasó los gates A, B y C con nota perfecta usando
`allinchu` (un saludo) 74 veces como comodín y `llakiy` (*tristeza*) para «bucle». Por eso
el informe de cada idioma debe traer la **tabla de términos con su nivel de confianza**: es
la única parte que un humano tiene que leer.

## Reglas de traducción
1. Misma estructura exacta que `v009/manual_en.md` (29 H2, 9 H3, 74 bloques `zymbol` + 4 `text`, con igual número de líneas)
2. Traducir TODO: texto, ejemplos, cadenas, variables, comentarios, nombres de tipo
3. Idiomas con escritura numérica propia → traducir los números en la sección Modos Numéricos
4. Disclaimer al INICIO en dos idiomas: idioma del manual + inglés (patrón: `manual_es.md` líneas 1–5)
5. Los operadores de Zymbol NUNCA se traducen: `?` `@` `>>` `<<` `:=` `¶` `$` `#?` `#(` `#[` `##_`
6. El diccionario se escribe `#(clave: valor)` — la forma desnuda `(a: 1)` ya no existe
7. `manual_es.md` es la referencia de estilo: leerlo antes de calibrar tono y nombres
8. **Los `// → valor` se recalculan, no se copian.** Al traducir cambian los nombres y las
   cadenas, así que la salida cambia con ellos. Ejecuta el bloque y toma lo que imprime;
   Gate C lo comprueba
9. **La composición de las marcas se explica donde cada marca aparece**, no en un apartado
   de lingüística al principio. El lector no puede leer `<<|?` antes de saber que `<<` es
   entrada, así que esa lectura va en la sección TUI, después de Salida y Entrada. La
   recapitulación («Cómo se Combinan las Marcas») va al final, cuando ya se vieron todas.
   **Sin jerga**: nada de «aglutinante», «morfema» ni glosas interlineales — se explica en
   el idioma del manual, con las marcas que el lector ya conoce
10. **Traducir de verdad TODO el texto**, incluidas las glosas de los bloques `text`. Solo
   quedan en inglés los mensajes literales del compilador, y cuando aparece uno se traduce
   al lado lo que dice

## Cola de traducción — por hablantes, no por región

El orden es **cantidad de hablantes (L1+L2)**, de más a menos. Las cifras son órdenes de
magnitud, no estadística citable: sirven para decidir a quién le llega antes el manual, no
para afirmar nada sobre un idioma.

**El orden de la cola y el modelo NO se derivan uno del otro.** Los cuatro primeros son
chino, hindi, árabe y francés: tres de riesgo medio y uno bajo. Y `pcm` (pidgin nigeriano)
es el 14.º por hablantes y de riesgo alto. El modelo lo decide la columna «riesgo»,
la posición solo decide el turno.

| Riesgo | Modelo | Por qué |
|--------|--------|---------|
| BAJO | **Haiku** | Medido con italiano: los cuatro gates verdes |
| MEDIO | **Sonnet** | Sin medir; no se arriesga tras lo que pasó en quechua |
| ALTO | **Sonnet** + verificación de **Opus** | Haiku falla aquí de forma invisible a los gates |

**Nunca Haiku como borrador para que Sonnet lo audite**: medido, sale 1,9× más caro que
traducir limpio (391k tokens frente a 205k), porque el verificador tiene primero que
*desaprender* un mapeo erróneo antes de reemplazarlo.

| # | Código | Idioma | Hablantes | Riesgo | Modelo | Estado |
|--:|--------|--------|----------:|--------|--------|--------|
| — | `en` | english | 1500M | BAJO | — | ✅ |
| — | `zh` | mandarin | 1100M | MEDIO | DeepSeek | ✅ |
| — | `hi` | hindi | 600M | MEDIO | DeepSeek | ✅ |
| — | `es` | spanish | 600M | BAJO | — | ✅ |
| — | `ar` | arabic | 400M | MEDIO | DeepSeek | ✅ |
| — | `fr` | french | 310M | BAJO | DeepSeek | ✅ |
| — | `bn` | bengali | 270M | MEDIO | DeepSeek | ✅ |
| — | `pt` | portuguese | 260M | BAJO | DeepSeek | ✅ |
| — | `ru` | russian | 255M | BAJO | DeepSeek | ✅ |
| — | `ur` | urdu | 230M | MEDIO | DeepSeek | ✅ |
| — | `sw` | swahili | 200M | MEDIO | Sonnet | ✅ |
| — | `id` | indonesian | 200M | MEDIO | Sonnet | ✅ |
| — | `de` | german | 135M | BAJO | Haiku | ✅ |
| — | `pa` | punjabi | 125M | MEDIO | Sonnet | ✅ |
| — | `ja` | japanese | 125M | MEDIO | Sonnet | ✅ |
| 1 | `pcm` | nigerian pidgin | 120M | ALTO | Sonnet+Opus | ❌ |
| — | `te` | telugu | 95M | MEDIO | Sonnet | ✅ |
| — | `tr` | turkish | 90M | MEDIO | Sonnet | ✅ |
| — | `vi` | vietnamese | 85M | MEDIO | Sonnet | ✅ |
| — | `ta` | tamil | 85M | MEDIO | Sonnet | ✅ |
| — | `mr` | marathi | 83M | MEDIO | Sonnet | ✅ |
| — | `ko` | korean | 82M | MEDIO | Sonnet | ✅ |
| — | `jv` | javanese | 82M | MEDIO | Sonnet | ✅ |
| — | `ha` | hausa | 80M | MEDIO | Sonnet | ✅ |
| — | `fa` | persian | 70M | MEDIO | Sonnet | ✅ |
| — | `it` | italian | 65M | BAJO | — | ✅ |
| — | `th` | thai | 60M | MEDIO | Sonnet | ✅ |
| — | `gu` | gujarati | 57M | MEDIO | Sonnet | ✅ |
| — | `kn` | kannada | 56M | MEDIO | Sonnet | ✅ |
| — | `yo` | yoruba | 45M | MEDIO | Sonnet | ✅ |
| — | `tl` | tagalog | 45M | MEDIO | Sonnet | ⚠️ |
| — | `my` | burmese | 43M | MEDIO | Sonnet | ✅ |
| — | `uk` | ukrainian | 40M | BAJO | Haiku | ✅ |
| — | `ps` | pashto | 40M | MEDIO | Sonnet | ✅ |
| — | `pl` | polish | 40M | BAJO | Haiku | ✅ |
| 2 | `ln` | lingala | 40M | ALTO | Sonnet+Opus | ❌ |
| — | `ml` | malayalam | 38M | MEDIO | Sonnet | ✅ |
| 3 | `om` | oromo | 37M | ALTO | Sonnet+Opus | ❌ |
| — | `ms` | malay | 35M | MEDIO | Sonnet | ✅ |
| — | `am` | amharic | 35M | MEDIO | Sonnet | ⚠️ |
| — | `su` | sundanese | 32M | MEDIO | Sonnet | ✅ |
| — | `ne` | nepali | 32M | MEDIO | Sonnet | ✅ |
| — | `lo` | lao | 30M | MEDIO | Sonnet | ✅ |
| — | `ku` | kurdish | 30M | MEDIO | Sonnet | ✅ |
| — | `ig` | igbo | 30M | MEDIO | Sonnet | ✅ |
| — | `az` | azerbaijani | 30M | MEDIO | Sonnet | ✅ |
| 4 | `zu` | zulu | 28M | MEDIO | Sonnet | ❌ |
| — | `nl` | dutch | 25M | BAJO | Haiku | ✅ |
| 5 | `ff` | fula | 25M | ALTO | Sonnet+Opus | ❌ |
| — | `ro` | romanian | 24M | BAJO | Haiku | ✅ |
| 6 | `so` | somali | 22M | ALTO | Sonnet+Opus | ❌ |
| — | `si` | sinhala | 17M | MEDIO | Sonnet | ✅ |
| — | `km` | khmer | 17M | MEDIO | Sonnet | ✅ |
| — | `af` | afrikaans | 17M | BAJO | Haiku | ✅ |
| 7 | `bm` | bambara | 15M | ALTO | Sonnet+Opus | ❌ |
| — | `el` | greek | 13M | MEDIO | Sonnet | ✅ |
| 8 | `ny` | nyanja | 12M | ALTO | Sonnet+Opus | ❌ |
| 9 | `ht` | haitian creole | 12M | MEDIO | Sonnet | ❌ |
| 10 | `sn` | shona | 11M | ALTO | Sonnet+Opus | ❌ |
| — | `cs` | czech | 11M | BAJO | Haiku | ✅ |
| 11 | `wo` | wolof | 10M | ALTO | Sonnet+Opus | ❌ |
| 12 | `sv` | swedish | 10M | BAJO | Haiku | ❌ |
| 13 | `pt_eu` | portugues eu | 10M | BAJO | Haiku | ❌ |
| 14 | `ca` | catalan | 10M | BAJO | Haiku | ❌ |
| 15 | `be` | belarusian | 10M | BAJO | Haiku | ❌ |
| 16 | `ti` | tigrinya | 9M | ALTO | Sonnet+Opus | ❌ |
| 17 | `he` | hebrew | 9M | MEDIO | Sonnet | ❌ |
| 18 | `xh` | xhosa | 8M | ALTO | Sonnet+Opus | ❌ |
| 19 | `sr` | serbian | 8M | BAJO | Haiku | ❌ |
| — | `qu` | quechua | 8M | ALTO | — | ✅ |
| 20 | `bg` | bulgarian | 8M | BAJO | Haiku | ❌ |
| 21 | `sq` | albanian | 6M | BAJO | Haiku | ❌ |
| 22 | `myn` | maya | 6M | ALTO | Sonnet+Opus | ❌ |
| 23 | `hy` | armenian | 6M | MEDIO | Sonnet | ❌ |
| 24 | `hr` | croatian | 6M | BAJO | Haiku | ❌ |
| 25 | `gn` | guarani | 6M | ALTO | Sonnet+Opus | ❌ |
| 26 | `da` | danish | 6M | BAJO | Haiku | ❌ |
| 27 | `tn` | setswana | 5M | ALTO | Sonnet+Opus | ❌ |
| 28 | `sk` | slovak | 5M | BAJO | Haiku | ❌ |
| 29 | `no` | norwegian | 5M | BAJO | Haiku | ❌ |
| 30 | `lg` | luganda | 5M | ALTO | Sonnet+Opus | ❌ |
| 31 | `fi` | finnish | 5M | BAJO | Haiku | ❌ |
| 32 | `ka` | georgian | 4M | MEDIO | Sonnet | ❌ |
| 33 | `lt` | lithuanian | 3M | BAJO | Haiku | ❌ |
| 34 | `jam` | jamaican patois | 3M | ALTO | Sonnet+Opus | ❌ |
| 35 | `sl` | slovenian | 2.5M | BAJO | Haiku | ❌ |
| 36 | `gl` | galician | 2.4M | BAJO | Haiku | ❌ |
| 37 | `mk` | macedonian | 2M | BAJO | Haiku | ❌ |
| 38 | `lv` | latvian | 2M | BAJO | Haiku | ❌ |
| 39 | `eo` | esperanto | 2M | MEDIO | Sonnet | ❌ |
| 40 | `ay` | aymara | 2M | ALTO | Sonnet+Opus | ❌ |
| 41 | `nah` | nahuatl | 1.7M | ALTO | Sonnet+Opus | ❌ |
| 42 | `et` | estonian | 1.1M | BAJO | Haiku | ❌ |
| 43 | `quc` | kiche | 1M | ALTO | Sonnet+Opus | ❌ |
| 44 | `eu` | basque | 750k | BAJO | Haiku | ❌ |
| 45 | `way` | wayuu | 400k | ALTO | Sonnet+Opus | ❌ |
| 46 | `is` | icelandic | 350k | BAJO | Haiku | ❌ |
| 47 | `arn` | mapuche | 250k | ALTO | Sonnet+Opus | ❌ |
| 48 | `nv` | navajo | 170k | ALTO | Sonnet+Opus | ❌ |
| 49 | `emb` | embera | 100k | ALTO | Sonnet+Opus | ❌ |
| 50 | `cr_syl` | cree syl | 100k | ALTO | Sonnet+Opus | ❌ |
| 51 | `yno` | yanomami | 35k | ALTO | Sonnet+Opus | ❌ |
| 52 | `chr` | cherokee | 2k | ALTO | Sonnet+Opus | ❌ |
| 53 | `tp` | toki pona | 1k | ALTO | Sonnet+Opus | ❌ |
| 54 | `tlh_iq` | klingon piqad | 1k | ALTO | Sonnet+Opus | ❌ |
| 55 | `tlh` | klingon | 1k | ALTO | Sonnet+Opus | ❌ |
| 56 | `jbo` | lojban | 1k | ALTO | Sonnet+Opus | ❌ |
| 57 | `io` | ido | 1k | ALTO | Sonnet+Opus | ❌ |
| 58 | `ia` | interlingua | 1k | ALTO | Sonnet+Opus | ❌ |

**Pendientes:** 58 · **Completados:** 49 (en, es, it, qu, zh, hi, ar, fr, bn, pt, ru, ur, sw, id, de, pa, ja, te, tr, vi, ta, mr, ko, jv, ha, fa, th, gu, kn, yo, my, uk, ps, pl, af, az, cs, el, ig, km, ku, lo, ml, ms, ne, nl, ro, si, su) · **Parciales:** 2 (tl, am) · **Referencias:** en, es

> **`am` (amárico) va con ⚠️ y NO se publica: es `manual_am_borrador.md`.** Escribe los
> literales en **cifras etíopes** —`፲` por 10, `፵፪` por 42, `፫፻` por 300— y Zymbol no
> puede leerlas. Las 69 escrituras que conoce son **bloques decimales de diez puntos de
> código contiguos**; el sistema etíope no es posicional, no tiene cero y reparte signos
> por unidades, decenas, centenas y decenas de millar. Resultado medido: **58 de 69
> bloques no compilan** (`undefined variable '፲'`), 30 afirmaciones falsas y ni un
> comentario comprobable. No es una errata que arreglar sino una regla que no se supo:
> se retraduce con los literales en ASCII.
>
> **La regla, para que no se repita** — y va a repetirse, porque el **tigriña** está en
> la cola y escribe la misma escritura: si la lengua no tiene uno de los 69 bloques, los
> literales van en ASCII. Tenerla escritura propia no basta; tiene que ser decimal y
> contigua. La lista está en `interpreter/crates/zymbol-lexer/src/digit_blocks.rs`, y
> `gate_f.py` lleva una copia embebida de las 69 bases.

> **`tl` va con ⚠️ y aun así se publica.** Pasa los seis gates y sus 74 bloques corren,
> pero **22 celdas de prosa de las tablas siguen en inglés** — `return / output param`,
> `working-copy param`, `navigation index`, `flat extraction`, `blocking keypress`,
> `hot definition`… La línea base de los demás idiomas es 0–4 celdas, casi todas palabras
> que se escriben igual (`Symbol`, `variable`, `pipe`), así que 22 no es el préstamo
> normal del taglish: es tabla a medio traducir. Se publica porque el manual no dice nada
> falso y esconderlo deja al lector tagalo sin nada; el ⚠️ es para que no se promocione a
> producción hasta que esas celdas estén en tagalo.

> Ningún ✅ se hereda de v005: el manual se reescribió para v0.0.9 y las 29 secciones
> no son las 24 anteriores. Cada traducción se regenera contra `v009/manual_en.md`.
