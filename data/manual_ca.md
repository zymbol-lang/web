> **Avís:** Aquesta documentació ha estat creada amb l'assistència de la intel·ligència artificial (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> La referència canònica és **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** al repositori de l'intèrpret.

---

# Manual de Zymbol-Lang

> **Revisat per a v0.0.5 — 2026-05-12**

**Zymbol-Lang** és un llenguatge de programació simbòlic. Sense paraules clau — tot és un símbol. Funciona de manera idèntica en qualsevol llengua humana.

- Sense `if`, `while`, `return` — només `?`, `@`, `<~`
- Unicode complet — identificadors en qualsevol llengua o emoji
- Independent de la llengua — el codi és idèntic a tot arreu

**Versió de l'intèrpret**: v0.0.5 | **Cobertura de proves**: 436/436 (TW ↔ VM paritat)

---

## Variables & Constants

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constant — la reassignació és un error en temps d'execució
nom = "Alice"
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

`°` (signe de grau, U+00B0) inicialitza automàticament una variable al seu valor neutre en el primer ús:

```zymbol
nums = [3, 1, 4, 1, 5]
@ n:nums {
    °total += n    // auto-init a 0 per sobre del bucle; sobreviu després de @
}
>> total ¶         // → 14
```

> `°x` (prefix) s'ancora per sobre del bucle — resultat accessible després de `@`.
> `x°` (postfix) s'ancora dins del bucle — desapareix quan el bucle acaba.
> Només Tree-Walker.

---

## Tipus de Dades

| Tipus | Literal | `#?` tag | Notes |
|-------|---------|----------|-------|
| Enter | `42`, `-7` | `###` | 64-bit amb signe |
| Decimal | `3.14`, `1.5e10` | `##.` | Notació científica OK |
| Cadena | `"text"` | `##"` | Interpolació: `"Hola {nom}"` |
| Caràcter | `'A'` | `##'` | Únic caràcter Unicode |
| Booleà | `#1`, `#0` | `##?` | NO numèric — `#1 ≠ 1` |
| Matriu | `[1, 2, 3]` | `##]` | Elements homogenis |
| Tupla | `(a, b)` | `##)` | Posicional |
| Tupla Nominada | `(x: 1, y: 2)` | `##)` | Camps nominats |
| Funció | referència a funció nominada | `##()` | Primera classe; mostra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primera classe; mostra `<lambd/N>` |

```zymbol
// Introspecció de tipus — retorna (tipus, dígits, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Sortida & Entrada

```zymbol
>> "Hola" ¶                       // ¶ o \\ per a nova línia explícita
>> "a=" a " b=" b ¶               // juxtaposició — valors múltiples
>> (mat$#) ¶                      // els operadors postfixos requereixen ( ) en >>

<< nom                            // llegeix en variable (sense indicació)
<< "Introdueix el nom: " nom      // amb indicació
```

> `¶` (AltGr+R en teclat espanyol) i `\\` són noves línies equivalents.

---

## Primitives TUI

Operadors d'interfície de terminal per a programes interactius. La majoria requereix un bloc `>>| { }` (pantalla alternativa + mode raw).

```zymbol
>>| {
    >>!                              // neteja la pantalla alternativa
    >>~ (1, 1, 0, 10) > "Executant"  // fila 1, col 1, fg=10 (verd)
    @~ 1000                          // pausa 1 segon (1000 ms)
    >>~ (2, 1) > "Fet."
}
// terminal restaurat automàticament en sortir
```

```zymbol
// Tecla premuda i mida del terminal
>>| {
    [files, cols] = >>?              // consulta dimensions del terminal
    >>~ (1, 1) > "Terminal: " files " x " cols
    <<| tecla                        // lectura de tecla bloquejant
    >>~ (2, 1) > "Premuda: " tecla
}
```

> `>>!` neteja pantalla. `>>?` retorna `[files, cols]`. `@~ N` dorm N mil·lisegons.
> `<<|` llegeix una tecla (bloquejant); `<<|?` sondeja sense bloquejar (retorna `'\0'` si cap).
> Tupla de sortida posicionada: `(fila, col, BKS, fg, bg)` — qualsevol ranura pot ometre's amb coma (`>>~ (,,, 196) > "vermell"`).
> Màscara BKS: `1`=Negreta, `2`=Cursiva, `4`=Subratllat. Paleta ANSI 256 colors (`0`=predeterminat terminal).
> Només Tree-Walker (excepte `>>!`, `>>?`, `@~`, `>>~` que també funcionen en `--vm`).

---

## Operadors

```zymbol
// Aritmètica
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisió entera)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponenciació)

// Comparació — assignar per inspeccionar
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lògica
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Cadenes

```zymbol
// Dues formes de concatenació
nom = "Alice"
n = 42

>> "Hola " nom " tens " n ¶         // juxtaposició — en >>
descr = "Hola {nom}, tens {n}"      // interpolació — a qualsevol lloc
```

```zymbol
s = "Hola Món"
long = s$#                  // 11
sub = s$[1..4]              // "Hola"  (1-base, final inclòs)
te = s$? "Món"              // #1
parts = "a,b,c,d"$/ ','     // [a, b, c, d]  (dividir per delimitador)
rep = s$~~["o":"0"]         // "H0la M0n"
rep1 = s$~~["o":"0":1]      // "H0la Món"  (sols primers N)
linia = "─" $* 20           // "────────────────────"  (repetir N vegades)
```

> `+` és només per a nombres. Usa `,`, juxtaposició o interpolació per a cadenes.

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
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> nota ¶    // → B

// Cadenes
color = "vermell"
codi = ?? color {
    "vermell" => "#FF0000"
    "verd"    => "#00FF00"
    _         => "#000000"
}

// Patrons de comparació
temp = -5
estat = ?? temp {
    < 0  => "gel"
    < 20 => "fred"
    < 35 => "tebi"
    _    => "calent"
}
>> estat ¶    // → gel

// Forma d'instrucció (branques de bloc)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negatiu" ¶ }
    _    => { >> "positiu" ¶ }
}
```

---

## Bucles

```zymbol
@ i:0..4  { >> i " " }        // rang inclusiu:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // amb pas:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // invers:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruites = ["poma", "pera", "raïm"]
@ f:fruites { >> f ¶ }        // per a cada element de la matriu

@ c:"hola" { >> c "-" }
>> ¶                          // → h-o-l-a-  (per a cada caràcter)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continua
    ? i > 7 { @! }             // @! atura
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

// Bucle etiquetat (trencament anidat)
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

Les funcions tenen **àmbit aïllat** — no poden llegir variables exteriors. Usa paràmetres de sortida `<~` per modificar variables del cridador:

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

> Les funcions nominades són **valors de primera classe** — passa directament: `nums$> doblar`. Per embolcallar: `x -> fn(x)` també és vàlid.

---

## Lambdes & Closures

```zymbol
doblar = x -> x * 2
sumar = (a, b) -> a + b
>> doblar(5) ¶    // → 10
>> sumar(3, 7) ¶  // → 10

// Lambda de bloc
classificar = x -> {
    ? x > 0 { <~ "positiu" }
    _? x < 0 { <~ "negatiu" }
    <~ "zero"
}

// Closure — captura àmbit exterior
factor = 3
triplicar = x -> x * factor
>> triplicar(7) ¶    // → 21

// Fàbrica
crear_sumador(n) { <~ x -> x + n }
sumar10 = crear_sumador(10)
>> sumar10(5) ¶    // → 15

// En matrius
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Matrius

Les matrius són **mutables** i contenen elements del **mateix tipus**.

```zymbol
mat = [1, 2, 3, 4, 5]

x = mat[1]      // 1 — accés (1-base: primer element)
x = mat[-1]     // 5 — índex negatiu (darrer element)
x = mat$#       // 5 — longitud (usa (mat$#) en >>)

mat = mat$+ 6            // afegeix → [1,2,3,4,5,6]
mat2 = mat$+[2] 99       // insereix a la posició 2 (1-base)
mat3 = mat$- 3           // elimina la primera ocurrència del valor
mat4 = mat$-- 3          // elimina totes les ocurrències
mat5 = mat$-[1]          // elimina a l'índex 1 (primer element)
mat6 = mat$-[2..3]       // elimina rang (1-base, final inclòs)

te = mat$? 3             // #1 — conté
pos = mat$?? 3           // [3] — tots els índexs del valor (1-base)
sl = mat$[1..3]          // [1,2,3] — tall (1-base, final inclòs)
sl2 = mat$[1:3]          // [1,2,3] — mateix, sintaxi basada en recompte

asc = mat$^+             // ordenat ascendent  (sols primitius)
desc = mat$^-            // ordenat descendent (sols primitius)

// Matrius de tuples nominades/posicionals — usa $^ amb lambda comparadora
db = [(nom: "Carla", edat: 28), (nom: "Ana", edat: 25), (nom: "Bob", edat: 30)]
per_edat = db$^ (a, b -> a.edat < b.edat)    // ascendent per edat  (<)
per_nom  = db$^ (a, b -> a.nom > b.nom)      // descendent per nom (>)
>> per_edat[1].nom ¶     // → Ana
>> per_nom[1].nom ¶      // → Carla

// Actualització directa d'element (sols matrius)
mat[1] = 99              // assigna
mat[2] += 5              // compost: +=  -=  *=  /=  %=  ^=

// Actualització funcional — retorna nova matriu; original inalterat
mat2 = mat[2]$~ 99
```

> Tots els operadors de col·lecció retornen una **nova matriu**. Reassigna: `mat = mat$+ 4`.
> `$+` pot encadenar-se: `mat = mat$+ 5$+ 6$+ 7`. Altres operadors usen assignacions intermèdies.
> **L'indexació és 1-base**: `mat[1]` és el primer element; `mat[0]` és un error en temps d'execució.
> `$^+` / `$^-` ordenen **matrius primitives** (nombres, cadenes). Per a matrius de tuples usa `$^` amb lambda comparadora — la direcció es codifica a la lambda (`<` = ascendent, `>` = descendent).

**Semàntica de valor** — assignar una matriu a una altra variable crea una còpia independent:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b no és afectat
```

```zymbol
// Matrius niades (indexació 1-base)
matriu = [[1,2,3],[4,5,6],[7,8,9]]
>> matriu[2][3] ¶    // → 6  (fila 2, columna 3)
```

---

## Desestructuració

```zymbol
// Matriu
mat = [10, 20, 30, 40, 50]
[a, b, c] = mat              // a=10  b=20  c=30
[primer, *resta] = mat       // primer=10  resta=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
punt = (100, 200)
(px, py) = punt              // px=100  py=200

// Tupla nominada
persona = (nom: "Ana", edat: 25, ciutat: "Barcelona")
(nom: n, edat: e) = persona  // n="Ana"  e=25
```

---

## Tuples

Les tuples són **contenidors ordenats immutables** que poden contenir valors de **tipus diferents**.
A diferència de les matrius, els elements no es poden canviar després de la creació.

```zymbol
// Posicional — tipus mixtos permesos
punt = (10, 20)
>> punt[1] ¶    // → 10

dades = (42, "hola", #1, 3.14)
>> dades[3] ¶   // → #1

// Nominada
persona = (nom: "Alice", edat: 25)
>> persona.nom ¶    // → Alice
>> persona[1] ¶     // → Alice  (l'índex també funciona, 1-base)

// Niada
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

Per derivar un valor modificat usa `$~` (actualització funcional) — retorna una **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original inalterat
>> t2 ¶    // → (10, 999, 30)

// Tupla nominada — reconstrueix explícitament
persona = (nom: "Alice", edat: 25)
mes_gran  = (nom: persona.nom, edat: 26)
>> persona.edat ¶    // → 25
>> mes_gran.edat ¶   // → 26
```

---

## Funcions d'Ordre Superior

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doblats  = nums$> (x -> x * 2)               // map  → [2,4,6…20]
parells  = nums$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
total    = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Cadena via intermediaris
pas1 = nums$| (x -> x > 3)
pas2 = pas1$> (x -> x * x)
>> pas2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Les funcions nominades es poden passar directament a HOF
doblar(x) { <~ x * 2 }
es_gran(x) { <~ x > 5 }
r = nums$> doblar     // ✅ referència directa
r = nums$| es_gran    // ✅ referència directa
```

---

## Operador Pipe

El costat dret sempre requereix `_` com a marcador de posició per al valor canalitzat:

```zymbol
doblar = x -> x * 2
sumar = (a, b) -> a + b
incrementar = x -> x + 1

r1 = 5 |> doblar(_)              // → 10
r2 = 10 |> sumar(_, 5)           // → 15
r3 = 5 |> sumar(2, _)            // → 7

// Encadenat
r = 5 |> doblar(_) |> incrementar(_) |> doblar(_)
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
| `##Index` | Índex fora de límits |
| `##Type` | Desajust de tipus |
| `##Parse` | Anàlisi de dades |
| `##Network` | Errors de xarxa |
| `##_` | Qualsevol error (catch-all) |

---

## Mòduls

```zymbol
// lib/calc.zy — el cos del mòdul és tancat entre claus
# calc {
    #> { sumar, obtenir_PI }

    _PI := 3.14159
    sumar(a, b) { <~ a + b }
    obtenir_PI() { <~ _PI }
}
```

```zymbol
// principal.zy
<# ./lib/calc => c    // àlies obligatori

>> c::sumar(5, 3) ¶   // → 8
pi = c::obtenir_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exporta amb un nom públic diferent
# mevalib {
    #> { _sumar_interna => suma }

    _sumar_interna(a, b) { <~ a + b }
}
```

```zymbol
<# ./mevalib => m

>> m::suma(3, 4) ¶    // → 7  (el nom intern _sumar_interna està amagat)
```

> **Regles de mòduls**: només `#>`, definicions de funcions i inicialitzadors literals de variables/constants estan permesos dins `# nom { }`. Les instruccions executables (`>>`, `<<`, bucles, etc.) generen l'error E013.

---

## Modes Numèrics

Zymbol pot mostrar nombres en **69 scripts de dígits Unicode** — Devanagari, Àrab-Índic, Thai, Klingon pIqaD, Matemàtic Negreta, segments LCD i més. El mode actiu afecta només la sortida `>>`; l'aritmètica interna és sempre binària.

### Activar un script

Escriu els dígits `0` i `9` de l'script objectiu tancats en `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Àrab-Índic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // restableix a ASCII
```

### Sortida i booleans

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predeterminat)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punt decimal sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: prefix # sempre ASCII, dígit s'adapta
>> #1 ¶         // → #१   (cert en Devanagari)
>> #0 ¶         // → #०   (fals — distint de ० zero enter)

x = 28 > 4
>> x ¶          // → #१   (resultat comparació segueix el mode actiu)
```

### Literals de dígits natius en el codi font

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
نشط = #١        // igual que #1
>> نشط ¶        // → #١
>> (#१ && #٠) ¶ // → #٠
```

> `#` és **sempre ASCII**. `#0` (fals) és sempre visualment distint de `0` (zero enter) en qualsevol script.

---

## Operadors de Dades

```zymbol
// Càsting de conversió de tipus
f = ##.42         // → 42.0  (a Decimal)
i = ###3.7        // → 4     (a Enter, arrodoneix)
t = ##!3.7        // → 3     (a Enter, trunca)

// Analitza cadena a nombre
v1 = #|"42"|      // → 42  (Enter)
v2 = #|"3.14"|    // → 3.14  (Decimal)
v3 = #|"abc"|     // → "abc"  (fail-safe, sense error)

// Arrodonir / Truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrodonir a 2 decimals)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Format de nombres
fmt = #,|1234567|      // → 1,234,567  (separat per comes)
cient = #^|12345.678|  // → 1.2345678e4  (científic)

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

## Integració Shell

```zymbol
data = <\ date +%Y-%m-%d \>        // captura stdout (inclou \n final)
>> "Avui: " data

fitxer = "dades.txt"
contingut = <\ cat {fitxer} \>     // interpolació en ordres

sortida = </"./subscript.zy"/>     // executa altre script Zymbol, captura sortida
>> sortida
```

> `><` captura arguments CLI com a matriu de cadenes (només Tree-Walker).

---

## Exemple Complet: FizzBuzz

```zymbol
classificar(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> classificar(i) ¶ }
```

---

## Referència de Símbols

| Símbol | Operació | Símbol | Operació |
|--------|----------|--------|----------|
| `=` | variable | `$#` | longitud |
| `:=` | constant | `$+` | afegeix (encadenable) |
| `>>` | sortida | `$+[i]` | insereix a l'índex (1-base) |
| `<<` | entrada | `$-` | elimina primer per valor |
| `¶` / `\\` | nova línia | `$--` | elimina tots per valor |
| `?` | si | `$-[i]` | elimina a l'índex (1-base) |
| `_?` | si no | `$-[i..j]` | elimina rang (1-base) |
| `_` | sinó / comodí | `$?` | conté |
| `??` | coincidència | `$??` | troba tots els índexs (1-base) |
| `@` | bucle | `$[s..e]` | tall (1-base) |
| `@ N { }` | bucle N vegades | `$>` | map |
| `@!` | atura | `$\|` | filter |
| `@>` | continua | `$<` | reduce |
| `@:nom { }` | bucle etiquetat | `$/ delim` | divideix cadena |
| `@:nom!` | atura etiqueta | `$++ a b c` | concat build |
| `@:nom>` | continua etiqueta | `mat[i>j>k]` | índex navegació |
| `->` | lambda | `mat[i] = val` | actualitza element (sols matrius) |
| `mat[i] += val` | actualització composta | `mat[i]$~` | actualització funcional (nova còpia) |
| `$^+` | ordena ascendent (primitius) | `$^-` | ordena descendent (primitius) |
| `$^` | ordena amb comparador (tuples) | `<~` | retorna |
| `\|>` | pipe | `!?` | prova |
| `:!` | captura | `:>` | finalment |
| `#1` | cert | `#0` | fals |
| `$!` | és error | `$!!` | propaga error |
| `<#` | importa | `#>` | exporta |
| `#` | declara mòdul | `::` | crida de mòdul |
| `.` | accés a camp | `#?` | metadades de tipus |
| `#\|..\|` | analitza nombre | `##.` | converteix a Decimal |
| `###` | converteix a Enter (arrodoneix) | `##!` | converteix a Enter (trunca) |
| `#.N\|..\|` | arrodoneix | `#!N\|..\|` | trunca |
| `#,\|..\|` | format coma | `#^\|..\|` | científic |
| `#d0d9#` | canvia mode numèric | `#09#` | restableix a ASCII |
| `<\ ..\>` | execució shell | `>\<` | arguments CLI |
| `\ var` | destrueix variable explícitament | `°x` / `x°` | definició en calent (auto-init) |
| `>>|` | bloc TUI (pantalla alt.) | `>>~` | sortida posicionada |
| `>>!` | neteja pantalla | `>>?` | consulta mida terminal |
| `<<\|` | lectura de tecla bloquejant | `<<\|?` | lectura de tecla no bloquejant |
| `@~ N` | dorm N mil·lisegons | `$*` | repeteix cadena N vegades |

---

## Changelog de Versions

### v0.0.5 — Primitives TUI, Definició en Calent & Repetició de Cadena _(Maig 2026)_

- **Breaking** Separador de branca match: `patró : resultat` → `patró => resultat`
- **Breaking** Àlies d'import: `<# camí <= àlies` → `<# camí => àlies`
- **Breaking** Reanomenament d'export: `#> { fn <= pub }` → `#> { fn => pub }`
- **Added** Bloc TUI `>>| { }` — pantalla alternativa + mode raw; neteja en sortir
- **Added** Sortida posicionada `>>~ (fila, col, BKS, fg, bg) > elements` — ranures escasses, paleta ANSI 256 colors
- **Added** Entrada de tecla `<<| var` (bloquejant) i `<<|? var` (polling no bloquejant)
- **Added** `>>!` neteja pantalla, `>>?` consulta mida terminal, `@~ N` dorm N mil·lisegons
- **Added** Definició en calent `°x` / `x°` — auto-inicialitza variable en el primer ús en bucles
- **Added** Repetició de cadena `str $* N` — repeteix una cadena N vegades
- **VM** Paritat: 436/436 proves passen

### v0.0.4 — Indexació 1-Base, Funcions Primera Classe & Blocs de Mòdul _(Abril 2026)_

- **Breaking** Tota la indexació canviada a **1-base** — `mat[1]` és el primer element; `mat[0]` és un error en temps d'execució
- **Added** Les funcions nominades són **valors de primera classe** — passa directament a HOF: `nums$> doblar`
- **Added** Sintaxi de **bloc de mòdul** obligatòria: `# nom { ... }` — sintaxi plana eliminada
- **Added** Indexació multidimensional: `mat[i>j>k]` (navegació), `mat[p ; q]` (extracció plana)
- **Added** Càstings de conversió de tipus: `##.expr` (Decimal), `###expr` (Enter arrodoneix), `##!expr` (Enter trunca)
- **Added** Divisió de cadena: `str$/ delim` — retorna `Array(String)`
- **Added** Concat build: `base$++ a b c` — afegeix múltiples elements
- **Added** Bucle N vegades: `@ N { }` — repeteix exactament N vegades
- **Added** Sintaxi de bucle etiquetat: `@:nom { }`, `@:nom!`, `@:nom>` — substitueix `@ @nom` / `@! nom`
- **Added** Regles d'àmbit de variables: variables `_nom` tenen àmbit exacte del bloc; `\ var` destrueix aviat
- **Added** Patrons de comparació match: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Added** Error de mòdul E013: les instruccions executables al cos del mòdul estan prohibides
- **Fixed** `take_variable` ja no corromp les constants del mòdul en el write-back
- **Fixed** `alias.CONST` ara es resol correctament; `#>` pot aparèixer després de les definicions de funcions
- **VM** Paritat completa: 393/393 proves passen

### v0.0.3 — Sistemes de Numerals Unicode & Millores LSP _(Abril 2026)_

- **Added** 69 blocs de dígits Unicode amb token de canvi de mode `#d0d9#`
- **Added** Literals booleans en qualsevol script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Added** Dígits Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Added** Opcode de VM `SetNumeralMode` — paritat completa amb tree-walker
- **Added** REPL respecta el mode numèric actiu en l'eco i la visualització de variables
- **Changed** Sortida booleana `>>` ara inclou prefix `#` (`#0` / `#1`) en tots els modes

### v0.0.2_01 — Reanomenament d'Operadors _(30 Mar 2026)_

- **Changed** `c|..|` → `#,|..|` i `e|..|` → `#^|..|` — consistent amb família de prefix de format `#`
- **Added** Àlies d'export: re-exporta membres del mòdul amb nom diferent

### v0.0.2 — Redisseny de l'API de Col·leccions & Instal·ladors _(24 Mar 2026)_

- **Added** Família unificada d'operadors `$` per a matrius i cadenes (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Assignació de desestructuració per a matrius, tuples i tuples nominades
- **Added** Índexos negatius (`mat[-1]` = darrer element)
- **Added** Instal·ladors natius — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Added** Assignació composta `^=`
- **Fixed** Casos límit aritmètics del parser; correccions de documentació

### v0.0.1 — Primera Versió Pública _(22 Mar 2026)_

- Intèrpret tree-walker + VM de registres (`--vm`, ~4× més ràpid, ~95% paritat)
- Tots els constructes base: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadors Unicode complets, sistema de mòduls, lambdes, closures, gestió d'errors
- REPL, LSP, extensió VS Code, formatador (`zymbol fmt`)

---

_Zymbol-Lang — Simbòlic. Universal. Immutable._
