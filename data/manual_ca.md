# Manual de Zymbol-Lang

**Zymbol-Lang** és un llenguatge de programació simbòlic. Sense paraules clau — tot és un símbol. Funciona igual en qualsevol llengua humana.

- Sense `if`, `while`, `return` — només `?`, `@`, `<~`
- Unicode complet — identificadors en qualsevol llengua o emoji
- Agnòstic a la llengua humana — el codi és idèntic en totes les llengües

---

## Variables i Constants

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constant — error en reassignar
nom = "Alice"
actiu = #1          // booleà veritat
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

## Tipus de Dades

| Tipus          | Literal             | Tag `#?` | Notes                              |
|----------------|---------------------|----------|------------------------------------|
| Int            | `42`, `-7`          | `###`    | 64 bits amb signe                  |
| Float          | `3.14`, `1.5e10`    | `##.`    | Notació científica OK              |
| String         | `"text"`            | `##"`    | Interpolació: `"Hola {nom}"`       |
| Char           | `'A'`               | `##'`    | Un caràcter Unicode                |
| Bool           | `#1`, `#0`          | `##?`    | NO numèric — `#1 ≠ 1`             |
| Array          | `[1, 2, 3]`         | `##]`    | Elements homogenis                 |
| Tupla          | `(a, b)`            | `##)`    | Posicional                         |
| Tupla nomenada | `(x: 1, y: 2)`      | `##)`    | Camps nomenats                     |

```zymbol
// Introspecció de tipus — retorna (tipus, dígits, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Sortida i Entrada

```zymbol
>> "Hola" ¶                        // ¶ o \\ per a nova línia explícita
>> "a=" a " b=" b ¶                // juxtaposició — múltiples valors
>> (arr$#) ¶                       // operadors postfix requereixen ( ) a >>

<< nom                             // llegir a la variable (sense indicació)
<< "Introdueix el nom: " nom       // amb indicació
```

> `¶` (AltGr+R al teclat espanyol) i `\\` són noves línies equivalents.

---

## Operadors

```zymbol
// Aritmètica
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (divisió entera)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potència)

// Comparació
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lògica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Cadenes de Caràcters

```zymbol
// Tres formes de concatenació
nom = "Alice"
n = 42

msg = "Hola ", nom, "!"              // coma — en assignacions
>> "Hola " nom " tens " n ¶         // juxtaposició — a >>
desc = "Hola {nom}, tens {n}"       // interpolació — a qualsevol lloc
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (fi exclusiu)
te = s$? "World"           // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (només els primers N)
```

> `+` és només per a nombres. Useu `,`, juxtaposició o interpolació per a cadenes.

---

## Control de Flux

```zymbol
x = 7

? x > 0 { >> "positiu" ¶ }

? x > 100 {
    >> "gran" ¶
} _? x > 0 {
    >> "positiu" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negatiu" ¶
}
```

> Els blocs `{ }` són **obligatoris** fins i tot per a una sola instrucció.

---

## Match

```zymbol
// Intervals
nota = 85
qualificació = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> qualificació ¶    // → B

// Cadenes
color = "vermell"
codi = ?? color {
    "vermell" : "#FF0000"
    "verd"    : "#00FF00"
    _         : "#000000"
}

// Guardes
temp = -5
estat = ?? temp {
    _? temp < 0  : "gel"
    _? temp < 20 : "fred"
    _? temp < 35 : "calent"
    _            : "molt calent"
}
>> estat ¶    // → gel

// Forma d'instrucció (branques de bloc)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negatiu" ¶ }
    _        : { >> "positiu" ¶ }
}
```

---

## Bucles

```zymbol
@ i:0..4  { >> i " " }        // interval inclusiu:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // amb pas:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // invers:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruites = ["poma", "pera", "raïm"]
@ f:fruites { >> f ¶ }        // per a cada element

@ c:"hola" { >> c "-" }
>> ¶                          // → h-o-l-a-  (sobre caràcters)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! aturar
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Bucle infinit
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Bucle amb etiqueta (break aniuat)
compte = 0
@ @extern {
    compte++
    ? compte >= 3 { @! extern }
}
>> compte ¶                   // → 3
```

---

## Funcions

```zymbol
sumar(a, b) { <~ a + b }
>> sumar(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Les funcions tenen un **àmbit aïllat** — no poden llegir variables externes. Useu paràmetres de sortida `<~` per modificar variables del cridador:

```zymbol
intercanviar(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
intercanviar(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Les funcions nomenades no són valors de primera classe. Per passar-les com a argument, emboliqueu: `x -> fn(x)`.

---

## Lambdes i Tancaments

```zymbol
doble = x -> x * 2
suma = (a, b) -> a + b
>> doble(5) ¶    // → 10
>> suma(3, 7) ¶  // → 10

// Lambda amb bloc
classificar = x -> {
    ? x > 0 { <~ "positiu" }
    _? x < 0 { <~ "negatiu" }
    <~ "zero"
}

// Tancament — captura l'àmbit exterior
factor = 3
triple = x -> x * factor
>> triple(7) ¶    // → 21

// Fàbrica
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// En arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arrays

Els arrays són **mutables** i contenen elements del **mateix tipus**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — accés (base 0)
arr[-1]         // 5 — índex negatiu (últim)
arr$#           // 5 — longitud (usar (arr$#) a >>)

arr = arr$+ 6            // afegir → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserir a l'índex 2
arr3 = arr$- 3           // eliminar la primera ocurrència del valor
arr4 = arr$-- 3          // eliminar totes les ocurrències
arr5 = arr$-[0]          // eliminar a l'índex
arr6 = arr$-[1..3]       // eliminar un interval (fi exclusiu)

te = arr$? 3             // #1 — conté
pos = arr$?? 3           // [2] — tots els índexs del valor
sl = arr$[0..3]          // [1,2,3] — tall (fi exclusiu)
sl2 = arr$[0:3]          // [1,2,3] — igual, sintaxi per comptatge

asc = arr$^+             // ordenat creixent  (només primitius)
desc = arr$^-            // ordenat decreixent (només primitius)

// Arrays de tuples nomenades/posicionals — usar $^ amb lambda comparador
db = [(nom: "Carla", edat: 28), (nom: "Ana", edat: 25), (nom: "Bob", edat: 30)]
per_edat = db$^ (a, b -> a.edat < b.edat)    // creixent per edat  (<)
per_nom  = db$^ (a, b -> a.nom > b.nom)      // decreixent per nom (>)
>> per_edat[0].nom ¶     // → Ana
>> per_nom[0].nom ¶      // → Carla

// Actualització directa d'element (només arrays)
arr[1] = 99              // assignar
arr[0] += 5              // compost: +=  -=  *=  /=  %=  ^=

// Actualització funcional — retorna un nou array; l'original no canvia
arr2 = arr[1]$~ 99
```

> Tots els operadors de col·lecció retornen un **nou array**. Reassigneu: `arr = arr$+ 4`.
> Els operadors no es poden encadenar — useu assignacions intermèdies.
> `$^+` / `$^-` ordenen **arrays primitius** (nombres, cadenes). Per a arrays de tuples, useu `$^` amb lambda comparador — la direcció es codifica al lambda (`<` = creixent, `>` = decreixent).

**Semàntica de valor** — assignar un array a una altra variable crea una còpia independent:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b no es veu afectat
```

```zymbol
// Arrays niuats
matriu = [[1,2,3],[4,5,6],[7,8,9]]
>> matriu[1][2] ¶    // → 6
```

---

## Desestructuració

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primer, *resta] = arr       // primer=10  resta=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Tupla nomenada
persona = (nom: "Ana", edat: 25, ciutat: "Barcelona")
(nom: n, edat: e) = persona   // n="Ana"  e=25
```

---

## Tuples

Les tuples són contenidors ordenats **immutables** que poden contenir valors de **tipus diferents**.
A diferència dels arrays, els elements no es poden canviar després de la creació.

```zymbol
// Posicional
punt = (10, 20)
>> punt[0] ¶    // → 10

dades = (42, "hello", #1, 3.14)
>> dades[2] ¶     // → #1

// Nomenada
persona = (nom: "Alice", edat: 25)
>> persona.nom ¶    // → Alice
>> persona[0] ¶     // → Alice  (l'índex també funciona)

// Niuada
pos = (x: 10, y: 20)
p = (pos: pos, etiqueta: "origen")
>> p.pos.x ¶        // → 10
```

**Immutabilitat** — qualsevol intent de modificar un element de tupla és un error d'execució:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ error d'execució: les tuples són immutables
// t[0] += 5    // ❌ mateix error
```

Per derivar un valor modificat useu `$~` (actualització funcional) — retorna una **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original sense canvis
>> t2 ¶    // → (10, 999, 30)

// Tupla nomenada — reconstruir explícitament
persona = (nom: "Alice", edat: 25)
mes_gran  = (nom: persona.nom, edat: 26)
>> persona.edat ¶    // → 25
>> mes_gran.edat ¶    // → 26
```

---

## Funcions d'Ordre Superior

> Els operadors HOF requereixen un **lambda inline** — les variables lambda no es poden passar directament.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobles  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
parells = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total   = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Encadenar via intermediaris
pas1 = nums$| (x -> x > 3)
pas2 = pas1$> (x -> x * x)
>> pas2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funcions nomenades en HOF — emboliqueu en lambda
doblar(x) { <~ x * 2 }
r = nums$> (x -> doblar(x))    // ✅
```

---

## Operador Pipe

El costat dret sempre requereix `_` com a marcador de posició per al valor transmès:

```zymbol
doble = x -> x * 2
sumar = (a, b) -> a + b
inc = x -> x + 1

5 |> doble(_)        // → 10
10 |> sumar(_, 5)    // → 15
5 |> sumar(2, _)     // → 7

// Encadenat
r = 5 |> doble(_) |> inc(_) |> doble(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Gestió d'Errors

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisió per zero" ¶
} :! {
    >> "altre error: " _err ¶    // _err conté el missatge d'error
} :> {
    >> "sempre s'executa" ¶
}
```

| Tipus       | Quan es produeix             |
|-------------|------------------------------|
| `##Div`     | Divisió per zero              |
| `##IO`      | Fitxer / sistema              |
| `##Index`   | Índex fora dels límits        |
| `##Type`    | Error de tipus                |
| `##Parse`   | Error de parsatge             |
| `##Network` | Errors de xarxa               |
| `##_`       | Qualsevol error (catch-all)   |

---

## Mòduls

```zymbol
// Fitxer: lib/calc.zy
# calc

#> { sumar, get_PI }    // exportacions ABANS de les definicions

_PI := 3.14159
sumar(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — accés directe a la constant via àlies no suportat
```

```zymbol
// Fitxer: main.zy
<# ./lib/calc <= c    // àlies obligatori

>> c::sumar(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Exportar amb nom públic diferent
# meulib
#> { _sumar_intern <= suma }

_sumar_intern(a, b) { <~ a + b }
```

```zymbol
<# ./meulib <= m

>> m::suma(3, 4) ¶    // → 7  (nom intern _sumar_intern és ocult)
```

---

## Modes Numèrics

Zymbol pot mostrar números en **69 scripts de dígits Unicode** — Devanagari, Àrab-Índic, Tailandès, Klingon pIqaD, Negreta Matemàtica, segments LCD i més. El mode actiu només afecta la sortida `>>`; l'aritmètica interna sempre és binària.

### Activar un script

Escriviu el dígit `0` i `9` del script objectiu entre `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Àrab-Índic   (U+0660–U+0669)
#๐๙#    // Tailandès    (U+0E50–U+0E59)
#09#    // restablir a ASCII
```

### Sortida i booleans

```zymbol
x = 42
>> x ¶          // → 42   (ASCII per defecte)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punt decimal sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: prefix # sempre ASCII, dígit s'adapta
>> #1 ¶         // → #१   (cert en Devanagari)
>> #0 ¶         // → #०   (fals — distint de ०  zero enter)

x = 28 > 4
>> x ¶          // → #१   (resultat de comparació segueix el mode actiu)
```

### Literals de dígits natius al codi font

Els dígits de qualsevol script compatible són literals vàlids — en rangs, mòdul, comparacions:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literals booleans en qualsevol script

`#` + dígit `0` o `1` de qualsevol bloc és un literal booleà vàlid:

```zymbol
#٠٩#
نشط = #١        // equivalent a #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` és **sempre ASCII**. `#0` (fals) és sempre visualment distint de `0` (zero enter) en cada script.

---

## Operadors de Dades

```zymbol
// Convertir cadena a nombre
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (segur, sense error)

// Arrodonir / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrodonir a 2 decimals)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formatació de nombres
fmt = #,|1234567|      // → 1,234,567  (separador de milers)
sci = #^|12345.678|    // → 1.2345678e4  (científic)

// Literals de base
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binari)
c = 0o101        // → 'A'  (octal)

// Conversió de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integració Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // captura stdout (inclou \n final)
>> "Avui: " data

fitxer = "data.txt"
contingut = <\ cat {fitxer} \>  // interpolació en ordres

sortida = </"./script.zy"/>     // executar un altre script Zymbol, capturar sortida
>> sortida
```

> `><` captura arguments CLI com a array de cadenes (només tree-walker).

---

## Exemple Complet: FizzBuzz

```zymbol
classificar(nombre) {
    ? nombre % 15 == 0 { <~ "FizzBuzz" }
    _? nombre % 3  == 0 { <~ "Fizz" }
    _? nombre % 5  == 0 { <~ "Buzz" }
    _ { <~ nombre }
}

@ i:1..20 { >> classificar(i) ¶ }
```

---

## Referència de Símbols

| Símbol    | Operació                           | Símbol        | Operació                      |
|-----------|------------------------------------|---------------|-------------------------------|
| `=`       | variable                           | `$#`          | longitud                      |
| `:=`      | constant                           | `$+`          | afegir                        |
| `>>`      | sortida                            | `$+[i]`       | inserir a l'índex             |
| `<<`      | entrada                            | `$-`          | eliminar primera ocurrència   |
| `¶`/`\\`  | nova línia                         | `$--`         | eliminar totes les ocurrències|
| `?`       | si (if)                            | `$-[i]`       | eliminar a l'índex            |
| `_?`      | si no si (elif)                    | `$-[i..j]`    | eliminar un interval          |
| `_`       | si no / comodí                     | `$?`          | conté                         |
| `??`      | match                              | `$??`         | tots els índexs del valor     |
| `@`       | bucle                              | `$[s..e]`     | tall                          |
| `@!`      | aturar (break)                     | `$>`          | map                           |
| `@>`      | continuar                          | `$\|`         | filter                        |
| `->`      | lambda                             | `$<`          | reduce                        |
| `arr[i] = val` | actualitzar element (només arrays) | `arr[i] += val` | actualització composta  |
| `arr[i]$~` | actualització funcional (nova còpia) | `$^+`      | ordenar creixent (primitius)  |
| `$^-`     | ordenar decreixent (primitius)     | `$^`          | ordenar amb lambda comparador |
| `<~`      | retornar (return)                  | `!?`          | intentar (try)                |
| `\|>`     | pipe                               | `:!`          | capturar (catch)              |
| `#1`      | veritat                            | `:>`          | sempre (finally)              |
| `#0`      | fals                               | `$!`          | és error                      |
| `<#`      | importar                           | `$!!`         | propagar error                |
| `#`       | declarar mòdul                     | `#>`          | exportar                      |
| `::`      | crida de mòdul                     | `.`           | accés a camp                  |
| `#\|..\|` | convertir a nombre                | `#?`          | metadades de tipus            |
| `#.N\|..\|` | arrodonir                       | `#!N\|..\|`   | truncar                       |
| `#,\|..\|` | format amb comes                  | `#^\|..\|`     | científic                     |
| `#d0d9#` | commutació de mode numèric | `#09#` | restablir a ASCII |
| `<\ ..\>` | execució shell                    | `>\<`         | arguments CLI                 |

## Registre de Canvis

### v0.0.3 — Sistemes Numèrics Unicode i Millores LSP _(Abril 2026)_

- **Afegit** 69 blocs de dígits Unicode amb el token de commutació `#d0d9#`
- **Afegit** Literals booleans en qualsevol script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Afegit** Dígits Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Afegit** Opcode VM `SetNumeralMode` — paritat completa amb el tree-walker
- **Afegit** El REPL respecta el mode numèric actiu en l'eco i la visualització de variables
- **Canviat** La sortida `>>` dels booleans inclou ara el prefix `#` (`#0` / `#1`) en tots els modes

### v0.0.2_01 — Canvi de Nom d'Operadors _(30 Mar 2026)_

- **Canviat** `c|..|` → `#,|..|` i `e|..|` → `#^|..|` — coherent amb la família de prefixos `#`
- **Afegit** Àlies d'exportació: reexportar membres de mòdul amb un nom diferent

### v0.0.2 — Redisseny de l'API de Col·leccions i Instal·ladors _(24 Mar 2026)_

- **Afegit** Família d'operadors `$` unificada per a arrays i cadenes (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Afegit** Desestructuració per a arrays, tuples i tuples amb nom
- **Afegit** Índexs negatius (`arr[-1]` = últim element)
- **Afegit** Instal·ladors natius — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Afegit** Assignació composta `^=`
- **Corregit** Casos límit del parser aritmètic; correccions de documentació

### v0.0.1 — Llançament Públic Inicial _(22 Mar 2026)_

- Intèrpret tree-walker + VM de registres (`--vm`, ~4× més ràpid, ~95% de paritat)
- Totes les construccions principals: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadors Unicode complets, sistema de mòduls, lambdes, tancaments, gestió d'errors
- REPL, LSP, extensió VS Code, formatador (`zymbol fmt`)

---

> **Advertiment:** Aquesta documentació ha estat creada i traduïda per intel·ligència artificial (IA).
> S'han fet tots els esforços per garantir l'exactitud, però algunes traduccions o exemples poden contenir errors.
> La referència canònica és l'[especificació de Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
