> **Declaration de responsabilitate:** Iste documentation ha essite create e traducite per intelligentia artificial (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Le referencia canonic es **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in le repositorio del interprete.

---

# Manual de Zymbol-Lang

> **Reviderate pro v0.0.5 — 2026-05-15**

**Zymbol-Lang** es un linguage de programmation symbolic. Necun parolas clave — toto es un symbolo. Illo functiona identicamente in omne linguage human.

- Necun `if`, `while`, `return` — solmente `?`, `@`, `<~`
- Unicode complete — identificatores in omne lingua o emoji
- Agnostic al lingua human — le codice es le mesme omne loco

**Version del interprete**: v0.0.5 | **Copertura del tests**: 436/436 (paritate TW ↔ VM)

---

## Variabiles e Constantes

```zymbol
x = 10              // variabile mutabile
π := 3.14159        // constante — reattribuer es un error in tempore de execution
nomine = "Alice"
active = #1         // booleano ver
👋 := "Salute"
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

`°` (signo de grado, U+00B0) initialisa automaticamente un variabile a su valor neutre al prime uso:

```zymbol
numeros = [3, 1, 4, 1, 5]
@ n:numeros {
    °total += n    // initialisation automatic a 0 supra le bucla; supervive post @
}
>> total ¶         // → 14
```

> `°x` (prefixo) ancora supra le bucla — le resultato es accessibile post `@`.
> `x°` (suffixo) ancora intra le bucla — mori quando le bucla fini.
> Solmente tree-walker.

---

## Typos de Datos

| Typo | Literal | Etiquetta `#?` | Notas |
|------|---------|----------|---------|
| Integer | `42`, `-7` | `###` | 64-bit signate |
| Flottante | `3.14`, `1.5e10` | `##.` | Notation scientific permittite |
| Catenas | `"texto"` | `##"` | Interpolation: `"Salute {nomine}"` |
| Character | `'A'` | `##'` | Un singule character Unicode |
| Booleano | `#1`, `#0` | `##?` | Non numeric — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Elementos homogene |
| Tuple | `(a, b)` | `##)` | Positional |
| Tuple nominate | `(x: 1, y: 2)` | `##)` | Campos nominate |
| Function | referentia de function nominate | `##()` | Prime classe; monstra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prime classe; monstra `<lambd/N>` |

```zymbol
// Introspection de typo — retorna (typo, digitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output e Input

```zymbol
>> "Salute" ¶                       // ¶ o \\ pro linea nove explicate
>> "a=" a " b=" b ¶               // juxtaposition — multiple valores
>> (arr$#) ¶                      // operatores suffixo require ( ) in >>

>> nomine                           // lege in variabile (sin prompt)
>> "Entra nomine: " nomine            // con prompt
```

> `¶` (AltGr+R sur le claviera espaniol) e `\\` es lineas nove equivalente.

---

## Primitivos TUI

Operatores de interfacie de usator pro programmas interactive. Le majoritate require bloco `>>| { }` (schermo alternative + modo crude).

```zymbol
>>| {
    >>!                             // clarar schermo alternative
    >>~ (1, 1, 0, 10) > "Executa"   // linea 1, columna 1, fg=10 (verde)
    @~ 1000                         // pausa 1 secunda (1000 ms)
    >>~ (2, 1) > "Finite."
}
// le termino es restaurate automaticamente al exir
```

```zymbol
// Pressa de clave e dimension del termino
>>| {
    [lineas, columnas] = >>?              // query dimensiones del termino
    >>~ (1, 1) > "Termino: " lineas " x " columnas
    <<| clave                         // lege pressa de clave bloccante
    >>~ (2, 1) > "Pressate: " clave
}
```

> `>>!` clarar schermo. `>>?` retorna `[lineas, columnas]`. `@~ N` dormi N millisecondas.
> `<<|` lege un pressa de clave (bloccante); `<<|?` sonda sin blocar (retorna `'\0'` si necun).
> Tuple de output positional: `(linea, columna, BKS, fg, bg)` — omne placia pote esser omittite con comma (`>>~ (,,, 196) > "rubie"`).
> BKS bitmask: `1`=grasse, `2`=italic, `4`=sublinea. Paletta de colores ANSI 256 (`0`=predefinition del termino).
> Solmente tree-walker (excepte `>>!`, `>>?`, `@~`, `>>~` que functiona etiam in `--vm`).

---

## Operatores

```zymbol
// Arithetica
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (division integer)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponentiation)

// Comparation — attribuer pro inspection
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logic
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Catenas

```zymbol
// Duo formas de concatenation
nomine = "Alice"
n = 42

>> "Salute " nomine " tu ha " n ¶       // juxtaposition — in >>
description = "Salute {nomine}, tu ha {n}"     // interpolation — omne loco
```

```zymbol
s = "Salute mundo"
longor = s$#                  // 11
sub = s$[1..5]             // "Salut"  (1-base, fin includite)
ha = s$? "mundo"          // #1
partes = "a,b,c,d"$/ ','   // [a, b, c, d]  (divider per separator)
reimplaciar = s$~~["l":"r"]        // "Sarrute mundo"
reimplaciar1 = s$~~["l":"r":1]     // "Sarute mundo"  (solmente le prime N)
linea = "─" $* 20           // "────────────────────"  (repeter N vices)
```

> `+` es solmente pro numeros. Pro catenas, usa `,`, juxtaposition, o interpolation.

---

## Fluxo de Controlo

```zymbol
x = 7

? x > 0 { >> "positive" ¶ }

? x > 100 {
    >> "grande" ¶
} _? x > 0 {
    >> "positive" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negative" ¶
}
```

> Accolladas `{ }` **es obligatori** mesmo pro un sol declaration.

---

## Correspondentia

```zymbol
// Intervallo
punctos = 85
grado = ?? punctos {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> grado ¶    // → B

// Catenas
color = "rubie"
codice = ?? color {
    "rubie"   => "#FF0000"
    "verde" => "#00FF00"
    _       => "#000000"
}

// Patrones de comparation
temperatura = -5
stato = ?? temperatura {
    < 0  => "glacie"
    < 20 => "frigide"
    < 35 => "calide"
    _    => "ardente"
}
>> stato ¶    // → glacie

// Forma de declaration (bracios de bloco)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negative" ¶ }
    _    => { >> "positive" ¶ }
}
```

---

## Bucales

```zymbol
@ i:0..4  { >> i " " }        // intervallo includite:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // con passo:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fructos = ["pomo", "pera", "uva"]
@ f:fructos { >> f ¶ }         // pro cata elemento in array

@ c:"hello" { >> c "-" }
>> ¶                          // → h-e-l-l-o-  (pro cata character in catena)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! rumper
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Bucal infinite
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Bucal etiquettate (rumper annidate)
conta = 0
@:externe {
    conta++
    ? conta >= 3 { @:externe! }
}
>> conta ¶                    // → 3
```

---

## Functiones

```zymbol
add( a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Functiones ha **scopo isolate** — illes non pote leger variabiles externe. Usa parametros de output `<~>` pro modificar variabiles del vocator:

```zymbol
permutar(a<~, b<~) {
    temp = a
    a = b
    b = temp
}
x = 10
y = 20
permutar(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Functiones nominate es **valores de prime classe** — passa directemente: `numeros$> duplo`. Pro involver: `x -> fn(x)` es etiam valide.

---

## Lambdas e Claudituras

```zymbol
duplo = x -> x * 2
add = (a, b) -> a + b
>> duplo(5) ¶    // → 10
>> add(3, 7) ¶  // → 10

// Lambda de bloco
classificar = x -> {
    ? x > 0 { <~ "positive" }
    _? x < 0 { <~ "negative" }
    <~ "zero"
}

// Clauditura — captura scopo externe
factor = 3
triple = x -> x * factor
>> triple(7) ¶    // → 21

// Fabrica
crear_additor(n) { <~ x -> x + n }
add_dece = crear_additor(10)
>> add_dece(5) ¶    // → 15

// In array
operatores = [x -> x+1, x -> x*2, x -> x*x]
>> operatores[3](5) ¶    // → 25
```

---

## Arrays

Arrays es **mutabile** e contine elementos **del mesme typo**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — accesso (1-base: prime elemento)
x = arr[-1]     // 5 — indice negative (ultime elemento)
x = arr$#       // 5 — longor (usa (arr$#) in >>)

arr = arr$+ 6            // adder → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserer in position 2 (1-base)
arr3 = arr$- 3           // remover le prime occurrentia del valor
arr4 = arr$-- 3          // remover tote le occurrentias
arr5 = arr$-[1]          // remover al indice 1 (prime elemento)
arr6 = arr$-[2..3]       // remover intervallo (1-base, fin includite)

ha = arr$? 3            // #1 — contine
positiones = arr$?? 3           // [3] — tote indices del valor (1-base)
section = arr$[1..3]          // [1,2,3] — section (1-base, fin includite)
section2 = arr$[1:3]          // [1,2,3] — mesme, syntaxe a base de conto

ascendente = arr$^+             // ordinar ascendente (solmente primitivos)
descendente = arr$^-            // ordinar descendente (solmente primitivos)

// Arrays de tuples nominate/positional — usa $^ con lambda comparator
base_datos = [(nomine: "Carla", etate: 28), (nomine: "Ana", etate: 25), (nomine: "Bob", etate: 30)]
per_etate  = base_datos$^ (a, b -> a.etate < b.etate)    // per etate ascendente (<)
per_nomine = base_datos$^ (a, b -> a.nomine > b.nomine)   // per nomine descendente (>)
>> per_etate[1].nomine ¶     // → Ana
>> per_nomine[1].nomine ¶    // → Carla

// Actualisation directe de elemento (solmente arrays)
arr[1] = 99              // attribuer
arr[2] += 5              // composite: +=  -=  *=  /=  %=  ^=

// Actualisation functional — retorna un nove array; le original non cambia
arr2 = arr[2]$~ 99
```

> Tote le operatores de collection retorna un **nove array**. Attribuer retro: `arr = arr$+ 4`.
> `$+` pote esser catenate: `arr = arr$+ 5$+ 6$+ 7`. Altere operatores usa attributiones intermedie.
> **Indiciation es 1-base**: `arr[1]` es le prime elemento; `arr[0]` es un error in tempore de execution.
> `$^+` / `$^-` ordina **arrays primitiv** (numeros, catenas). Pro arrays de tuple, usa `$^` con lambda comparator — le direction es codificate in le lambda (`<` = ascendente, `>` = descendente).

**Semantica de valor** — attribuer un array a un altere variabile crea un copia independente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b non es afficite
```

```zymbol
// Arrays annidate (indication 1-base)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (linea 2, columna 3)
```

---

## Destructuration

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[prime, *resto] = arr         // prime=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ discarga

// Tuple positional
puncto = (100, 200)
(px, py) = puncto             // px=100  py=200

// Tuple nominate
persona = (nomine: "Ana", etate: 25, citate: "Madrid")
(nomine: n, etate: e) = persona   // n="Ana"  e=25
```

---

## Tuples

Tuples es contentores ordinate **immutabile** que pote continer valores de **typos differente**.
A differentia de arrays, elementos non pote esser cambiate post creation.

```zymbol
// Positional — typos mixte permittite
puncto = (10, 20)
>> puncto[1] ¶    // → 10

datos = (42, "Salute", #1, 3.14)
>> datos[3] ¶     // → #1

// Nominate
persona = (nomine: "Alice", etate: 25)
>> persona.nomine ¶    // → Alice
>> persona[1] ¶      // → Alice  (indice etiam functiona, 1-base)

// Annidate
position = (x: 10, y: 20)
p = (position: position, etiquetta: "origine")
>> p.position.x ¶        // → 10
```

**Immubilitate** — omne tentativa de modificar un elemento de tuple es un error in tempore de execution:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ error in tempore de execution: tuples es immutabile
// t[1] += 5    // ❌ mesme error
```

Pro obtener un valor modificate usa `$~` (actualisation functional) — retorna un **nove tuple**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original non cambia
>> t2 ¶    // → (10, 999, 30)

// Tuple nominate — reconstruer explicitemente
persona = (nomine: "Alice", etate: 25)
plus_vetere  = (nomine: persona.nomine, etate: 26)
>> persona.etate ¶    // → 25
>> plus_vetere.etate ¶     // → 26
```

---

## Functiones de Ordine Superior

```zymbol
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

duplicate  = numeros$> (x -> x * 2)                  // map  → [2,4,6…20]
pares    = numeros$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = numeros$< (0, (accumulator, x) -> accumulator + x)     // reduce → 55

// Catenar via intermediarios
passo1 = numeros$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Functiones nominate pote esser passate directemente a HOF
duplo(x) { <~ x * 2 }
es_grande(x) { <~ x > 5 }
r = numeros$> duplo       // ✅ referentia directe
r = numeros$| es_grande       // ✅ referentia directe
```

---

## Operator Tubo

Le latere dextere require sempre `_` como placehoder pro le valor tubate:

```zymbol
duplo = x -> x * 2
add = (a, b) -> a + b
incrementar = x -> x + 1

r1 = 5 |> duplo(_)        // → 10
r2 = 10 |> add(_, 5)       // → 15
r3 = 5 |> add(2, _)        // → 7

// Catenate
r = 5 |> duplo(_) |> incrementar(_) |> duplo(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Gestion de Errores

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division per zero" ¶
} :! {
    >> "altere: " _err ¶    // _err tene le message de error
} :> {
    >> "executa sempre" ¶
}
```

| Typo | Quando |
|------|------|
| `##Div` | Division per zero |
| `##IO` | File / systema |
| `##Index` | Indice foras limites |
| `##Type` | Disaccord de typo |
| `##Parse` | Parsamento de datos |
| `##Network` | Errores de rete |
| `##_` | Omne error (capturar toto) |

---

## Modulos

```zymbol
// lib/calc.zy — corpore del modulo es claudite in accolladas
# calc {
    #> { add, get_PI }

    _π := 3.14159
    add(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias es requisito

>> c::add(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Exportar con un nomine public differente
# mylib {
    #> { _add_interne => summa }

    _add_interne(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::summa(3, 4) ¶    // → 7  (nomine interne _add_interne es celate)
```

> **Regulas de modulo**: intra `# nomine { }`, solmente `#>`, definitiones de function, e initialisatores literal de variabile/constante es permittite. Declarationes executabile (`>>`, `<<`, buclas, etc.) provoca error E013.

---

## Modos Numeral

Zymbol pote monstrar numeros in **69 scripts numeral de Unicode** — Devanagari, Arabe-Indic, Thai, Klingon pIqaD, Mathematic Grasse, segmentos LCD, e plus. Le modo active affice solmente le output `>>`; le arithmetica interne es sempre binari.

### Activar un script

Scribe le digitos `0` e `9` del script visate intra `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabe-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reinitialisar a ASCII
```

### Output e booleano

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predefinite)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (puncto decimal es sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleano: prefixo # es sempre ASCII, le digito se adapta
>> #1 ¶         // → #१   (ver in Devanagari)
>> #0 ¶         // → #०   (false — distincte de ० zero integer)

x = 28 > 4
>> x ¶          // → #१   (resultato de comparation sequi le modo active)
```

### Literal de digitos native in codice fonte

Le digitos de omne script supportate es literales valide — in intervallos, modulo, comparationes:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal booleano in omne script

`#` + digito `0` o `1` de omne bloco es un literal booleano valide:

```zymbol
#٠٩#
active = #١        // mesme como #1
>> active ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **es sempre ASCII**. `#0` (false) es sempre visualmente distincte de `0` (zero integer) in omne script.

---

## Operatores de Datos

```zymbol
// Conversion de typos
f = ##.42         // → 42.0  (a flottante)
i = ###3.7        // → 4     (a integer, rotundar)
t = ##!3.7        // → 3     (a integer, truncar)

// Parsar catena a numero
v1 = #|"42"|      // → 42  (integer)
v2 = #|"3.14"|    // → 3.14  (flottante)
v3 = #|"abc"|     // → "abc"  (secur, necun error)

// Rotundar / Truncar
π = 3.14159265
rotundate2 = #.2|π|      // → 3.14  (rotundar a 2 placias decimal)
rotundate4 = #.4|π|      // → 3.1416
truncate2 = #!2|π|      // → 3.14  (truncar)

// Formatation de numero
formato = #,|1234567|  // → 1,234,567  (separate per comma)
scientific = #^|12345.678|    // → 1.2345678e4  (scientific)

// Literal de base
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binari)
c = 0o101        // → 'A'  (octal)

// Output de conversion de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integration de Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // capturar stdout (include \n al fin)
>> "Hodie: " data

file = "data.txt"
contento = <\ cat {file} \>      // interpolation in comandos

output = </"./subscript.zy"/>   // executa un altere script Zymbol, capturar output
>> output
```

> `><` capturar argumentos CLI como un array de catenas (solmente tree-walker).

---

## Exemplo Complete: FizzBuzz

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

## Referentia de Symbolos

| Symbolo | Operation | Symbolo | Operation |
|--------|-----------|--------|-----------|
| `=` | variabile | `$#` | longor |
| `:=` | constante | `$+` | adder (catenabile) |
| `>>` | output | `$+[i]` | inserer al indice (1-base) |
| `<<` | input | `$-` | remover prime per valor |
| `¶` / `\\` | linea nove | `$--` | remover tote per valor |
| `?` | si | `$-[i]` | remover al indice (1-base) |
| `_?` | altere-si | `$-[i..j]` | remover intervallo (1-base) |
| `_` | altere / wildcard | `$?` | contine |
| `??` | correspondentia | `$??` | trovar tote indices (1-base) |
| `@` | bucle | `$[s..e]` | section (1-base) |
| `@ N { }` | bucle N vices | `$>` | map |
| `@!` | rumper | `$\|` | filter |
| `@>` | continuar | `$<` | reduce |
| `@:nomine { }` | bucle etiquettate | `$/ separator` | divider catena |
| `@:nomine!` | rumper etiquetta | `$++ a b c` | construction de concatenation |
| `@:nomine>` | continuar etiquetta | `arr[i>j>k]` | indice de navigation |
| `->` | lambda | `arr[i] = valor` | actualisar elemento (solmente arrays) |
| `arr[i] += valor` | actualisation composite | `arr[i]$~` | actualisation functional (nove copia) |
| `$^+` | ordinar ascendente (primitivos) | `$^-` | ordinar descendente (primitivos) |
| `$^` | ordinar con comparator (tuples) | `<~` | retornar |
| `\|>` | tubo | `!?` | tentar |
| `:!` | capturar | `:>` | finalmente |
| `#1` | ver | `#0` | false |
| `$!` | es error | `$!!` | propager error |
| `<#` | importar | `#>` | exportar |
| `#` | declarar modulo | `::` | appellar modulo |
| `.` | accesso a campo | `#?` | metadata de typo |
| `#\|..\|` | parsar numero | `##.` | converter a flottante |
| `###` | converter a integer (rotundar) | `##!` | converter a integer (truncar) |
| `#.N\|..\|` | rotundar | `#!N\|..\|` | truncar |
| `#,\|..\|` | formato de comma | `#^\|..\|` | scientific |
| `#d0d9#` | cambiar modo numeral | `#09#` | reinitialisar a ASCII |
| `<\ ..\>` | executar shell | `>\<` | argumentos CLI |
| `\ variabile` | destruer variabile explicitemente | `°x` / `x°` | definition calide (auto-initialisation) |
| `>>|` | bloco TUI (schermo alternative) | `>>~` | output positional |
| `>>!` | clarar schermo | `>>?` | query dimension del termino |
| `<<\|` | pressa de clave bloccante | `<<\|?` | sondar pressa de clave non bloccante |
| `@~ N` | dormir N millisecondas | `$*` | repeter catena N vices |

---

## Registro de Modificationes del Versiones

### v0.0.5 — Primitivos TUI, Definition Calide & Repetition de Catenas _(Maio 2026)_

- **Ruptura** Separator de bracio de correspondentia: `patrono : resultado` → `patrono => resultado`
- **Ruptura** Alias de importation: `<# cammino <= alias` → `<# cammino => alias`
- **Ruptura** Renomination de exportation: `#> { fn <= public }` → `#> { fn => public }`
- **Addite** Bloco TUI `>>| { }` — schermo alternative + modo crude; clarar al exir
- **Addite** Output positional `>>~ (linea, columna, BKS, fg, bg) > items` — spatios sparse, color ANSI 256
- **Addite** Input de clave `<<| variabile` (bloccante) e `<<|? variabile` (sondar non bloccante)
- **Addite** `>>!` clarar schermo, `>>?` query dimension del termino, `@~ N` dormir N millisecondas
- **Addite** Definition calide `°x` / `x°` — auto-initialisation de variabile al prime uso in buclas
- **Addite** Repetition de catena `catena $* N` — repeter un catena N vices
- **VM** Paritate: 436/436 tests passa

### v0.0.4 — Indication 1-base, Functiones de Prime Classe & Modulos de Bloco _(April 2026)_

- **Ruptura** Tote indication cambiate a **1-base** — `arr[1]` es le prime elemento; `arr[0]` es un error in tempore de execution
- **Addite** Functiones nominate es **valores de prime classe** — passar directemente a HOF: `numeros$> duplo`
- **Addite** **Syntaxe de bloco obligatori** pro modulos: `# nomine { ... }` — syntaxe plan removite
- **Addite** Indication multidimensional: `arr[i>j>k]` (navigation), `arr[p ; q]` (extraction plan)
- **Addite** Conversion de typos: `##.expression` (flottante), `###expression` (integer rotundar), `##!expression` (integer truncar)
- **Addite** Division de catena: `catena$/ separator` — retorna `Array(catena)`
- **Addite** Construction de concatenation: `base$++ a b c` — adder multiple items
- **Addite** Bucal de vices: `@ N { }` — repeter exactemente N vices
- **Addite** Syntaxe de bucal etiquettate: `@:nomine { }`, `@:nomine!`, `@:nomine>` — reimplaciar `@ @nomine` / `@! nomine`
- **Addite** Regulas de scopo de variabile: variabiles `_nomine` ha scopo de bloco exacte; `\ variabile` destruer precoce
- **Addite** Patrones de comparation de correspondentia: `< 0 =>`, `> 5 =>`, `== 42 =>`, etc.
- **Addite** Error de modulo E013: declarationes executabile in corpore de modulo es prohibite
- **Corrigite** `alias.CONST` ora resolve correctemente; `#>` pote apparir post definitiones de function
- **VM** Paritate complete: 393/393 tests passa

### v0.0.3 — Systemas Numeral de Unicode & Meliorationes de LSP _(April 2026)_

- **Addite** 69 blocos de digitos Unicode con token de cambio de modo `#d0d9#`
- **Addite** Literal booleano in omne script — `#१` / `#०`, `#१` / `#०`, etc.
- **Addite** Digitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Addite** Opcode VM `SetNumeralMode` — paritate complete con tree-walker
- **Cambiate** Output booleano `>>` ora include le prefixo `#` (`#0` / `#1`) in omne modos

### v0.0.2_01 — Renomination de Operator _(30 Martio 2026)_

- **Cambiate** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — coherente con le familia de prefixo `#`
- **Addite** Alias de exportation: re-exportar membros de modulo sub un altere nomine

### v0.0.2 — Redesign del API de Collection & Installatores _(24 Martio 2026)_

- **Addite** Familia de operator `$` unificate pro arrays e catenas (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Addite** Attribution de destructuration pro arrays, tuples, e tuples nominate
- **Addite** Indices negative (`arr[-1]` = ultime elemento)
- **Addite** Installatores native — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Martio 2026)_

- **Addite** Attribution composite `^=`
- **Corrigite** Casos marginal de arithmetica del parsator; correctiones de documentation

### v0.0.1 — Prime Publication Public _(22 Martio 2026)_

- Interprete tree-walker + VM de registros (`--vm`, ~4× plus rapide, ~95% paritate)
- Tote le constructiones central: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificatores Unicode complete, systema de modulo, lambdas, claudituras, gestion de errores
- REPL, LSP, extension VS Code, formatator (`zymbol fmt`)

---

_Zymbol-Lang — Symbolic. Universal. Immutabile._
