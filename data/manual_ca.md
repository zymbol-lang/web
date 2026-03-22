# Manual Compacte de Zymbol-Lang

**Zymbol-Lang** és un llenguatge de programació simbòlic. No utilitza paraules clau — tot és un símbol. Funciona igual en qualsevol llengua humana.

---

## Filosofia

- Sense paraules clau (`if`, `while`, `return` no existeixen — només símbols `?`, `@`, `<~`)
- Unicode complet — identificadors en qualsevol llengua o emoji 👋
- Agnòstic a la llengua humana — el codi és idèntic en totes les llengües

---

## Variables i Constants

```zymbol
x = 10           // variable (mutable)
PI := 3.14159    // constant (immutable — error si es reassigna)
nom = "Ana"
actiu = #1       // booleà veritat
👋 := "Hola"
```

### Assignació Composta

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Tipus de Dades

| Tipus          | Exemple             | Símbol `#?`  | Notes                               |
|----------------|---------------------|--------------|-------------------------------------|
| Enter          | `42`, `-7`          | `###`        | 64 bits amb signe                   |
| Coma flotant   | `3.14`, `1.5e10`    | `##.`        | Notació científica OK               |
| Cadena         | `"hola"`            | `##"`        | Interpolació: `"Hola {nom}"`        |
| Caràcter       | `'A'`               | `##'`        | Un caràcter Unicode                 |
| Booleà         | `#1`, `#0`          | `##?`        | NO són 1 i 0 numèrics               |
| Array          | `[1, 2, 3]`         | `##]`        | Tots els elements del mateix tipus  |
| Tupla          | `(a, b)`            | `##)`        | Posicional                          |
| Tupla nomenada | `(x: 1, y: 2)`      | `##)`        | Accés per nom o índex               |

---

## Sortida i Entrada

```zymbol
// Sortida — NO afegeix nova línia automàticament
>> "Hola" ¶                    // ¶ o \\ dóna una nova línia explícita
>> "a=" a " b=" b ¶            // múltiples valors per juxtaposició
>> "suma=" sumar(2, 3) ¶       // crides a funcions en qualsevol posició
>> (arr$#) ¶                   // els operadors postfix requereixen parèntesis

// Entrada
<< nom                         // sense indicació — llegeix a la variable
<< "El teu nom? " nom          // amb indicació
```

> `¶` o `\\` són equivalents com a nova línia.

---

## Concatenació de Cadenes

Tres formes vàlides — cadascuna per al seu context:

```zymbol
nom = "Ana"
n = 25

// 1. Coma — en assignacions amb = o :=
msg = "Hola ", nom, "!"               // → Hola Ana!
TITOL := "Usuari: ", nom

// 2. Juxtaposició — a la sortida >>
>> "Hola " nom " tens " n " anys" ¶   // → Hola Ana tens 25 anys

// 3. Interpolació — en qualsevol context
desc = "Hola {nom}, tens {n} anys"    // → Hola Ana, tens 25 anys
```

> **Nota**: `+` és només per a nombres. Usar-lo amb cadenes genera un avís.

---

## Control de Flux

```zymbol
x = 7

// Si simple
? x > 0 { >> "positiu" ¶ }

// Si / si no si / si no
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

Els blocs `{ }` són **obligatoris** fins i tot per a una sola línia.

---

## Match

```zymbol
// Match amb intervals
nota = 85
qualificació = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> qualificació ¶    // → B

// Match amb guardes (condicions arbitràries)
temp = -5
estat = ?? temp {
    _? temp < 0  : "gel"
    _? temp < 20 : "fred"
    _? temp < 35 : "calent"
    _            : "molt calent"
}
>> estat ¶    // → gel

// Match amb cadenes
color = "vermell"
codi = ?? color {
    "vermell" : "#FF0000"
    "verd"    : "#00FF00"
    _         : "#000000"
}
>> codi ¶
```

---

## Bucles

```zymbol
// Interval inclusiu: 0..4 itera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Interval amb pas
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Interval invers
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Mentre (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Per a cada element
fruites = ["poma", "pera", "raïm"]
@ f:fruites { >> f ¶ }

// Sobre els caràcters d'una cadena
@ c:"hola" { >> c "-" }
>> ¶    // → h-o-l-a-

// Break i Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continuar
    ? i > 7 { @! }          // @! aturar
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funcions

```zymbol
// Declaració i crida
sumar(a, b) { <~ a + b }
>> sumar(3, 4) ¶    // → 7

// Recursió
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Les funcions tenen àmbit aïllat — sense accés a variables externes
global = 100
provar() {
    x = 42    // només local
    <~ x
}
>> provar() ¶    // → 42
```

> **Important**: Les funcions declarades amb `nom(params){ }` no són valors de primera classe.
> Per passar-les com a argument, embolcallar: `x -> nom(x)`.

---

## Lambdes i Tancaments

```zymbol
// Lambda simple (retorn implícit)
doble = x -> x * 2
suma = (a, b) -> a + b
>> doble(5) ¶    // → 10
>> suma(3, 7) ¶  // → 10

// Lambda amb bloc (retorn explícit)
classificar = x -> {
    ? x > 0 { <~ "positiu" }
    _? x < 0 { <~ "negatiu" }
    <~ "zero"
}
>> classificar(5) ¶     // → positiu
>> classificar(0) ¶     // → zero
>> classificar(-5) ¶    // → negatiu

// Tancaments — les lambdes capturen variables de l'àmbit exterior
factor = 3
triple = x -> x * factor    // captura 'factor'
>> triple(7) ¶    // → 21

// Fàbrica de funcions
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdes com a valors: emmagatzemades en arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [10, 20, 30, 40, 50]

// Accés (índex 0-base)
>> arr[0] ¶    // → 10

// Longitud (parèntesis requerits a >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Afegir, eliminar, conté, tall
arr = arr$+ 60               // afegir
arr = arr$- 0                // eliminar índex 0
conte = arr$? 30             // → #1
tall = arr$[0..2]            // [20, 30]

// Actualitzar element
arr[1] = 99

// Per a cada element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` retornen un **nou array** — reassignar: `arr = arr$+ 4`.
> Sense encadenament: usar dues assignacions separades.

---

## Tuples

```zymbol
// Tupla nomenada
persona = (nom: "Alice", edat: 25)
>> persona.nom ¶    // → Alice
>> persona.edat ¶   // → 25
>> persona[0] ¶     // → Alice (l'índex també funciona)
```

---

## Funcions d'Ordre Superior

Els operadors HOF requereixen una **lambda inline** — no una variable lambda directa.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
dobles = nums$> (x -> x * 2)
>> dobles ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
parells = nums$| (x -> x % 2 == 0)
>> parells ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (valor_inicial, (acumulador, element) -> expr)
total = nums$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55
```

---

## Gestió d'Errors

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisió per zero" ¶
} :! ##IO {
    >> "error IO" ¶
} :! {
    >> "altre error: " _err ¶
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
get_PI() { <~ _PI }
```

```zymbol
// Fitxer: main.zy
<# ./lib/calc <= c    // àlies obligatori

>> c::sumar(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Exemple Complet: FizzBuzz

```zymbol
classificar(nombre) {
    ? nombre % 15 == 0 { <~ "BombollaB" }
    _? nombre % 3  == 0 { <~ "Bombolla" }
    _? nombre % 5  == 0 { <~ "Brunzit" }
    _ { <~ nombre }
}

@ i:1..20 { >> classificar(i) ¶ }
```

---

## Referència de Símbols

| Símbol  | Operació           | Símbol     | Operació             |
|---------|--------------------|------------|----------------------|
| `=`     | variable           | `$#`       | longitud             |
| `:=`    | constant           | `$+`       | afegir               |
| `>>`    | sortida            | `$-`       | eliminar (per índex) |
| `<<`    | entrada            | `$?`       | conté                |
| `¶`/`\` | nova línia         | `$[s..e]`  | tall                 |
| `?`     | si (if)            | `$>`       | map                  |
| `_?`    | si no si (elif)    | `$\|`      | filter               |
| `_`     | si no / comodí     | `$<`       | reduce               |
| `??`    | match              | `!?`       | intentar (try)       |
| `@`     | bucle              | `:!`       | capturar (catch)     |
| `@!`    | aturar (break)     | `:>`       | sempre (finally)     |
| `@>`    | continuar          | `$!`       | és error             |
| `->`    | lambda             | `$!!`      | propagar error       |
| `<~`    | retornar           | `#`        | declarar mòdul       |
| `\|>`   | pipe               | `#>`       | exportar             |
| `#1`    | veritat            | `<#`       | importar             |
| `#0`    | fals               | `::`       | crida de mòdul       |

---

*Zymbol-Lang — Simbòlic. Universal. Immutable.*

---

> **Advertiment:** Aquesta documentació ha estat creada i traduïda per intel·ligència artificial (IA).
> S'han fet tots els esforços per garantir l'exactitud, però algunes traduccions o exemples poden contenir errors.
> La referència canònica és l'[especificació de Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
