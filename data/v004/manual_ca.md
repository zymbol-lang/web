> **Avís:** Aquesta documentació ha estat creada amb l'assistència d'intel·ligència artificial (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> La referència canònica és **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** al repositori de l'intèrpret.

---

# Manual de Zymbol-Lang

**Zymbol-Lang** és un llenguatge de programació simbòlic. Sense paraules clau — tot és un símbol. Funciona de manera idèntica en qualsevol idioma humà.

- Sense `if`, `while`, `return` — només `?`, `@`, `<~`
- Unicode complet — identificadors en qualsevol idioma o emoji
- Agnòstic al llenguatge humà — el codi és el mateix arreu

**Versió de l'intèrpret**: v0.0.4 | **Cobertura de proves**: 393/393 (paritat TW ↔ VM)

---

## Variables i Constants

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constant — la reassignació és un error en temps d'execució
nom = "Alícia"
actiu = #1          // booleà cert
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
x++        // 5
x--        // 4
```

---

## Tipus de Dades

| Tipus | Literal | Etiqueta `#?` | Notes |
|-------|---------|---------------|-------|
| Sencer | `42`, `-7` | `###` | 64 bits amb signe |
| Decimal | `3.14`, `1.5e10` | `##.` | Notació científica OK |
| Cadena | `"text"` | `##"` | Interpolació: `"Hola {nom}"` |
| Caràcter | `'A'` | `##'` | Un sol caràcter Unicode |
| Booleà | `#1`, `#0` | `##?` | NO numèric — `#1 ≠ 1` |
| Vector | `[1, 2, 3]` | `##]` | Elements homogenis |
| Tupla | `(a, b)` | `##)` | Posicional |
| Tupla nomenada | `(x: 1, y: 2)` | `##)` | Camps nomenats |
| Funció | ref. funció nomenada | `##()` | Primera classe; mostra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primera classe; mostra `<lambd/N>` |

```zymbol
// Introspecció de tipus — retorna (tipus, dígits, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Sortida i Entrada

```zymbol
>> "Hola" ¶                       // ¶ o \\ per a salt de línia explícit
>> "a=" a " b=" b ¶               // juxtaposició — múltiples valors
>> (arr$#) ¶                      // els operadors postfix requereixen ( ) a >>

<< nom                            // llegir en variable (sense indicació)
<< "Introduïu el nom: " nom       // amb indicació
```

> `¶` (AltGr+R al teclat espanyol) i `\\` són salts de línia equivalents.

---

## Operadors

```zymbol
// Aritmètica — usar assignacions; alguns operadors tenen peculiaritats directament a >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisió entera)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponenciació)

// Comparació
a == b    // #0
a <> b    // #1
a < b      // #0
a <= b    // #0
a > b      // #1
a >= b     // #1

// Lògica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Cadenes

```zymbol
// Dues formes de concatenació
nom = "Alícia"
n = 42

>> "Hola " nom " tens " n ¶      // juxtaposició — a >>
desc = "Hola {nom}, tens {n}"    // interpolació — en qualsevol lloc
```

```zymbol
s = "Hola Mon"
lon = s$#                  // 8
sub = s$[1..4]             // "Hola"  (1-basat, final inclusiu)
te = s$? "Mon"             // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]  (separar per delimitador)
rep = s$~~["o":"0"]        // "H0la M0n"
rep1 = s$~~["o":"0":1]     // "H0la Mon"  (primer N solament)
```

> `+` és només per a números. Useu `,`, juxtaposició o interpolació per a cadenes.

---

## Flux de Control

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

> Les claus `{ }` són **obligatòries** fins i tot per a una sola instrucció.

---

## Coincidència

```zymbol
// Rangs
puntuacio = 85
nota = ?? puntuacio {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nota ¶    // → B

// Cadenes
color = "vermell"
codi = ?? color {
    "vermell" : "#FF0000"
    "verd"    : "#00FF00"
    _         : "#000000"
}

// Patrons de comparació
temp = -5
estat = ?? temp {
    < 0  : "gel"
    < 20 : "fred"
    < 35 : "calid"
    _    : "calent"
}
>> estat ¶    // → gel

// Forma d'instrucció (braços de bloc)
?? n {
    0       : { >> "zero" ¶ }
    _? n < 0: { >> "negatiu" ¶ }
    _       : { >> "positiu" ¶ }
}
```

---

## Bucles

```zymbol
@ i:0..4  { >> i " " }        // rang inclusiu:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // amb pas:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // invers:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruites = ["poma", "pera", "raim"]
@ f:fruites { >> f ¶ }        // per a cada element del vector

@ c:"hola" { >> c "-" }
>> ¶                          // → h-o-l-a-  (per a cada caràcter)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! sortir
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

// Bucle etiquetat (sortida imbricada)
comptador = 0
@:extern {
    comptador++
    ? comptador >= 3 { @:extern! }
}
>> comptador ¶                // → 3
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

Les funcions tenen un **àmbit aïllat** — no poden llegir variables exteriors. Useu paràmetres de sortida `<~` per modificar variables del cridador:

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

> Les funcions nomenades són **valors de primera classe** — passeu-les directament: `nums$> doble`. Per embolcallar: `x -> fn(x)` també és vàlid.

---

## Lambdes i Tancaments

```zymbol
doble = x -> x * 2
suma = (a, b) -> a + b
>> doble(5) ¶    // → 10
>> suma(3, 7) ¶    // → 10

// Lambda de bloc
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
crear_sumador(n) { <~ x -> x + n }
sumar10 = crear_sumador(10)
>> sumar10(5) ¶    // → 15

// En vectors
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Vectors

Els vectors són **mutables** i contenen elements del **mateix tipus**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — accés (1-basat: primer element)
arr[-1]         // 5 — índex negatiu (darrer element)
arr$#           // 5 — longitud (useu (arr$#) a >>)

arr = arr$+ 6            // afegir → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserir a la posició 2 (1-basat)
arr3 = arr$- 3           // eliminar primera aparició del valor
arr4 = arr$-- 3          // eliminar totes les aparicions
arr5 = arr$-[1]          // eliminar a l'índex 1 (primer element)
arr6 = arr$-[2..3]       // eliminar rang (1-basat, final inclusiu)

te = arr$? 3             // #1 — conté
pos = arr$?? 3           // [3] — tots els índexs del valor (1-basat)
sl = arr$[1..3]          // [1,2,3] — tall (1-basat, final inclusiu)
sl2 = arr$[1:3]          // [1,2,3] — mateix, sintaxi basada en recompte

asc = arr$^+             // ordenat ascendent  (sols primitius)
desc = arr$^-            // ordenat descendent (sols primitius)

// Vectors de tuples nomenades/posicionals — usar $^ amb lambda comparadora
bd = [(nom: "Carla", edat: 28), (nom: "Ana", edat: 25), (nom: "Bob", edat: 30)]
per_edat  = bd$^ (a, b -> a.edat < b.edat)    // ascendent per edat  (<)
per_nom   = bd$^ (a, b -> a.nom > b.nom)       // descendent per nom (>)
>> per_edat[1].nom ¶     // → Ana
>> per_nom[1].nom ¶      // → Carla

// Actualització directa d'element (sols vectors)
arr[1] = 99              // assignar
arr[2] += 5              // compost: +=  -=  *=  /=  %=  ^=

// Actualització funcional — retorna un nou vector; l'original no canvia
arr2 = arr[2]$~ 99
```

> Tots els operadors de col·lecció retornen un **nou vector**. Assigneu de nou: `arr = arr$+ 4`.
> `$+` es pot encadenar: `arr = arr$+ 5$+ 6$+ 7`. Altres operadors usen assignacions intermèdies.
> **L'indexació és 1-basada**: `arr[1]` és el primer element; `arr[0]` és un error en temps d'execució.
> `$^+` / `$^-` ordenen **vectors de primitius** (números, cadenes). Per a vectors de tuples useu `$^` amb una lambda comparadora — la direcció s'encoda a la lambda (`<` = ascendent, `>` = descendent).

**Semàntica de valor** — assignar un vector a una altra variable crea una còpia independent:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b no es veu afectat
```

```zymbol
// Vectors imbricats (indexació 1-basada)
matriu = [[1,2,3],[4,5,6],[7,8,9]]
>> matriu[2][3] ¶    // → 6  (fila 2, columna 3)
```

---

## Desestructuració

```zymbol
// Vector
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primer, *resta] = arr       // primer=10  resta=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Tupla nomenada
persona = (nom: "Ana", edat: 25, ciutat: "Barcelona")
(nom: n, edat: e) = persona  // n="Ana"  e=25
```

---

## Tuples

Les tuples són contenidors ordenats **immutables** que poden contenir valors de **tipus diferents**.
A diferència dels vectors, els elements no es poden canviar un cop creats.

```zymbol
// Posicional — tipus mixtos permesos
punt = (10, 20)
>> punt[1] ¶    // → 10

dades = (42, "hola", #1, 3.14)
>> dades[3] ¶     // → #1

// Nomenada
persona = (nom: "Alicia", edat: 25)
>> persona.nom ¶    // → Alicia
>> persona[1] ¶      // → Alicia  (l'índex també funciona, 1-basat)

// Imbricada
pos = (x: 10, y: 20)
p = (pos: pos, etiqueta: "origen")
>> p.pos.x ¶        // → 10
```

**Immutabilitat** — qualsevol intent de modificar un element de tupla és un error en temps d'execució:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ error en temps d'execució: les tuples són immutables
// t[1] += 5    // ❌ mateix error
```

Per derivar un valor modificat useu `$~` (actualització funcional) — retorna una **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original no canvia
>> t2 ¶    // → (10, 999, 30)

// Tupla nomenada — reconstruir explícitament
persona = (nom: "Alicia", edat: 25)
major   = (nom: persona.nom, edat: 26)
>> persona.edat ¶    // → 25
>> major.edat ¶     // → 26
```

---

## Funcions d'Ordre Superior

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doblats  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
parells  = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Encadenar via intermediaris
pas1 = nums$| (x -> x > 3)
pas2 = pas1$> (x -> x * x)
>> pas2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Les funcions nomenades es poden passar directament a HOF
doble(x) { <~ x * 2 }
es_gran(x) { <~ x > 5 }
r = nums$> doble       // ✅ referència directa
r = nums$| es_gran     // ✅ referència directa
```

---

## Operador Canonada

El costat dret sempre requereix `_` com a marcador de posició per al valor canalitzat:

```zymbol
doble = x -> x * 2
sumar = (a, b) -> a + b
incr = x -> x + 1

5 |> doble(_)        // → 10
10 |> sumar(_, 5)    // → 15
5 |> sumar(2, _)     // → 7

// Encadenat
r = 5 |> doble(_) |> incr(_) |> doble(_)
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
    >> "altre: " _err ¶    // _err conté el missatge d'error
} :> {
    >> "sempre s'executa" ¶
}
```

| Tipus | Quan |
|-------|------|
| `##Div` | Divisió per zero |
| `##IO` | Fitxer / sistema |
| `##Index` | Índex fora de rang |
| `##Type` | Desajust de tipus |
| `##Parse` | Anàlisi de dades |
| `##Network` | Errors de xarxa |
| `##_` | Qualsevol error (captura general) |

---

## Mòduls

```zymbol
// lib/calc.zy — el cos del mòdul està tancat entre claus
# calc {
    #> { sumar, obtenir_PI }

    _PI := 3.14159
    sumar(a, b) { <~ a + b }
    obtenir_PI() { <~ _PI }
}
```

```zymbol
// principal.zy
<# ./lib/calc <= c    // àlies obligatori

>> c::sumar(5, 3) ¶   // → 8
pi = c::obtenir_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar amb un nom públic diferent
# mellib {
    #> { _sumar_intern <= suma }

    _sumar_intern(a, b) { <~ a + b }
}
```

```zymbol
<# ./mellib <= m

>> m::suma(3, 4) ¶    // → 7  (el nom intern _sumar_intern queda ocult)
```

> **Regles dels mòduls**: només `#>`, definicions de funcions i inicialitzadors de variables/constants literals estan permesos dins `# nom { }`. Les instruccions executables (`>>`, `<<`, bucles, etc.) generen l'error E013.

---

## Modes Numèrics

Zymbol pot mostrar números en **69 scripts de dígits Unicode** — Devanagari, àrab-índic, tailandès, pIqaD klingon, negreta matemàtica, segments LCD i més. El mode actiu sols afecta la sortida `>>`; l'aritmètica interna sempre és binària.

### Activar un script

Escriviu el dígit `0` i `9` del script de destinació entre `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Àrab-índic   (U+0660–U+0669)
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
>> #0 ¶         // → #०   (fals — diferent de ०  zero enter)

x = 28 > 4
>> x ¶          // → #१   (resultat de comparació segueix el mode actiu)
```

### Literals de dígits nadius a la font

Els dígits de qualsevol script suportat són literals vàlids — en rangs, mòdul, comparacions:

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
actiu = #١        // igual que #1
>> actiu ¶        // → #١
>> (#١ && #٠) ¶   // → #٠
```

> `#` és **sempre ASCII**. `#0` (fals) és sempre visualment diferent de `0` (zero enter) en tots els scripts.

---

## Operadors de Dades

```zymbol
// Conversions de tipus
##.42         // → 42.0  (a Decimal)
###3.7        // → 4     (a Sencer, arrodonir)
##!3.7        // → 3     (a Sencer, truncar)

// Analitzar cadena a número
v1 = #|"42"|      // → 42  (Sencer)
v2 = #|"3.14"|    // → 3.14  (Decimal)
v3 = #|"abc"|     // → "abc"  (sense error)

// Arrodonir / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrodonir a 2 decimals)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Format de número
fmt = #,|1234567|      // → 1,234,567  (separat per comes)
sci = #^|12345.678|    // → 1.2345678e4  (científic)

// Literals de base
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binari)
c = 0o101        // → 'A'  (octal)

// Sortida de conversió de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integració amb Shell

```zymbol
data = <\ date +%Y-%m-%d \>       // captura stdout (inclou \n final)
>> "Avui: " data

fitxer = "dades.txt"
contingut = <\ cat {fitxer} \>    // interpolació a les comandes

sortida = </"./subscript.zy"/>    // executar un altre script Zymbol, capturar sortida
>> sortida
```

> `><` captura els arguments CLI com a vector de cadenes (sols tree-walker).

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

| Símbol | Operació | Símbol | Operació |
|--------|----------|--------|----------|
| `=` | variable | `$#` | longitud |
| `:=` | constant | `$+` | afegir (encadenable) |
| `>>` | sortida | `$+[i]` | inserir a l'índex (1-basat) |
| `<<` | entrada | `$-` | eliminar primer per valor |
| `¶` / `\\` | salt de línia | `$--` | eliminar tots per valor |
| `?` | si | `$-[i]` | eliminar a l'índex (1-basat) |
| `_?` | si no si | `$-[i..j]` | eliminar rang (1-basat) |
| `_` | si no / comodí | `$?` | conté |
| `??` | coincidència | `$??` | trobar tots els índexs (1-basat) |
| `@` | bucle | `$[s..e]` | tall (1-basat) |
| `@ N { }` | bucle N vegades (N iteracions) | `$>` | map |
| `@!` | sortir | `$\|` | filter |
| `@>` | continuar | `$<` | reduce |
| `@:nom { }` | bucle etiquetat | `$/ delim` | separar cadena |
| `@:nom!` | sortir etiqueta | `$++ a b c` | construir concatenació |
| `@:nom>` | continuar etiqueta | `arr[i>j>k]` | índex de navegació |
| `->` | lambda | `arr[i] = val` | actualitzar element (sols vectors) |
| `arr[i] += val` | actualització composta | `arr[i]$~` | actualització funcional (nova còpia) |
| `$^+` | ordenar ascendent (primitius) | `$^-` | ordenar descendent (primitius) |
| `$^` | ordenar amb comparador (tuples) | `<~` | retornar |
| `\|>` | canonada | `!?` | intentar |
| `:!` | capturar | `:>` | finalment |
| `#1` | cert | `#0` | fals |
| `$!` | és error | `$!!` | propagar error |
| `<#` | importar | `#>` | exportar |
| `#` | declarar mòdul | `::` | crida de mòdul |
| `.` | accés a camp | `#?` | metadades de tipus |
| `#\|..\|` | analitzar número | `##.` | convertir a Decimal |
| `###` | convertir a Sencer (arrodonir) | `##!` | convertir a Sencer (truncar) |
| `#.N\|..\|` | arrodonir | `#!N\|..\|` | truncar |
| `#,\|..\|` | format de comes | `#^\|..\|` | científic |
| `#d0d9#` | canvi de mode numeral | `#09#` | restablir a ASCII |
| `<\ ..\>` | executar shell | `>\<` | args CLI |
| `\ var` | destruir variable explícitament | | |

---

## Historial de Canvis

### v0.0.4 — Indexació 1-basada, Funcions de Primera Classe i Blocs de Mòdul _(Abril 2026)_

- **Ruptura** Tota la indexació canviada a **1-basada** — `arr[1]` és el primer element; `arr[0]` és un error en temps d'execució
- **Afegit** Les funcions nomenades són **valors de primera classe** — passar directament a HOF: `nums$> doble`
- **Afegit** **Sintaxi de bloc** de mòdul obligatòria: `# nom { ... }` — la sintaxi plana s'ha eliminat
- **Afegit** Indexació multidimensional: `arr[i>j>k]` (navegació), `arr[p ; q]` (extracció plana)
- **Afegit** Conversions de tipus: `##.expr` (Decimal), `###expr` (Sencer arrodonir), `##!expr` (Sencer truncar)
- **Afegit** Separació de cadena: `str$/ delim` — retorna `Vector(Cadena)`
- **Afegit** Construcció de concatenació: `base$++ a b c` — afegeix múltiples elements
- **Afegit** Bucle N vegades: `@ N { }` — repetir exactament N vegades
- **Afegit** Sintaxi de bucle etiquetat: `@:nom { }`, `@:nom!`, `@:nom>` — reemplaça `@ @nom` / `@! nom`
- **Afegit** Regles d'àmbit de variables: les variables `_nom` tenen àmbit de bloc exacte; `\ var` destrueix aviat
- **Afegit** Patrons de comparació de coincidència: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Afegit** Error de mòdul E013: les instruccions executables al cos del mòdul estan prohibides
- **Corregit** `take_variable` ja no corromp les constants del mòdul en la reescriptura
- **Corregit** `alias.CONST` ara es resol correctament; `#>` pot aparèixer després de les definicions de funció
- **VM** Paritat total: 393/393 proves passen

### v0.0.3 — Sistemes Numèrics Unicode i Millores LSP _(Abril 2026)_

- **Afegit** 69 blocs de dígits Unicode amb el testimoni de canvi de mode `#d0d9#`
- **Afegit** Literals booleans en qualsevol script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Afegit** Dígits pIqaD klingon (CSUR PUA U+F8F0–U+F8F9)
- **Afegit** Opcode VM `SetNumeralMode` — paritat total amb el tree-walker
- **Afegit** El REPL respecta el mode numeral actiu en l'eco i la visualització de variables
- **Canviat** La sortida `>>` de booleans ara inclou el prefix `#` (`#0` / `#1`) en tots els modes

### v0.0.2_01 — Canvi de Nom d'Operadors _(30 Mar 2026)_

- **Canviat** `c|..|` → `#,|..|` i `e|..|` → `#^|..|` — consistent amb la família de prefixos de format `#`
- **Afegit** Àlies d'exportació: reexportar membres del mòdul amb un nom diferent

### v0.0.2 — Redisseny de l'API de Col·lecció i Instal·ladors _(24 Mar 2026)_

- **Afegit** Família d'operadors `$` unificada per a vectors i cadenes (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Afegit** Assignació per desestructuració per a vectors, tuples i tuples nomenades
- **Afegit** Índexs negatius (`arr[-1]` = darrer element)
- **Afegit** Instal·ladors nadius — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Afegit** Assignació composta `^=`
- **Corregit** Casos límit aritmètics del parser; correccions de documentació

### v0.0.1 — Llançament Públic Inicial _(22 Mar 2026)_

- Intèrpret tree-walker + VM de registres (`--vm`, ~4× més ràpid, ~95% paritat)
- Tots els constructs principals: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadors Unicode complets, sistema de mòduls, lambdes, tancaments, gestió d'errors
- REPL, LSP, extensió VS Code, formatador (`zymbol fmt`)

---

_Zymbol-Lang — Simbòlic. Universal. Immutable._
