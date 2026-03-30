# Manual de Zymbol-Lang

**Zymbol-Lang** é unha linguaxe de programación simbólica. Sen palabras clave — todo son símbolos. Funciona igual en calquera lingua humana.

- Sen `if`, `while`, `return` — só símbolos `?`, `@`, `<~`
- Unicode completo — identificadores en calquera lingua ou emoji
- Agnóstico á lingua humana — o código é idéntico en todas as linguas

---

## Variables e Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — erro ao reasignar
nome = "Alice"
activo = #1         // booleano verdadeiro
👋 := "Ola"
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

## Tipos de Datos

| Tipo           | Literal             | Etiqueta `#?` | Notas                              |
|----------------|---------------------|---------------|------------------------------------|
| Int            | `42`, `-7`          | `###`         | 64 bits con signo                  |
| Float          | `3.14`, `1.5e10`    | `##.`         | Notación científica OK             |
| String         | `"texto"`           | `##"`         | Interpolación: `"Ola {nome}"`      |
| Char           | `'A'`               | `##'`         | Un carácter Unicode                |
| Bool           | `#1`, `#0`          | `##?`         | NON numérico — `#1 ≠ 1`           |
| Array          | `[1, 2, 3]`         | `##]`         | Elementos homoxéneos               |
| Tupla          | `(a, b)`            | `##)`         | Posicional                         |
| Tupla nomeada  | `(x: 1, y: 2)`      | `##)`         | Campos nomeados                    |

```zymbol
// Introspección de tipo — devolve (tipo, díxitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Saída e Entrada

```zymbol
>> "Ola" ¶                         // ¶ ou \\ para nova liña explícita
>> "a=" a " b=" b ¶                // xustaposición — múltiples valores
>> (arr$#) ¶                       // operadores postfix requiren ( ) en >>

<< nome                            // ler na variable (sen indicación)
<< "Introduce o nome: " nome       // con indicación
```

> `¶` (AltGr+R no teclado español) e `\\` son novas liñas equivalentes.

---

## Operadores

```zymbol
// Aritmética
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (división enteira)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potencia)

// Comparación
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lóxica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Cadeas de Caracteres

```zymbol
// Tres formas de concatenación
nome = "Alice"
n = 42

msg = "Ola ", nome, "!"               // coma — en asignacións
>> "Ola " nome " tes " n ¶           // xustaposición — en >>
desc = "Ola {nome}, tes {n}"         // interpolación — en calquera lugar
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (fin exclusivo)
ten = s$? "World"          // #1
partes = "a,b,c,d" / ','   // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (só os primeiros N)
```

> `+` é só para números. Usa `,`, xustaposición ou interpolación para cadeas.

---

## Control de Fluxo

```zymbol
x = 7

? x > 0 { >> "positivo" ¶ }

? x > 100 {
    >> "grande" ¶
} _? x > 0 {
    >> "positivo" ¶
} _? x == 0 {
    >> "cero" ¶
} _ {
    >> "negativo" ¶
}
```

> Os bloques `{ }` son **obrigatorios** aínda para unha soa instrución.

---

## Match

```zymbol
// Intervalos
nota = 85
cualificación = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> cualificación ¶    // → B

// Cadeas
cor = "vermello"
código = ?? cor {
    "vermello" : "#FF0000"
    "verde"    : "#00FF00"
    _          : "#000000"
}

// Gardas
temp = -5
estado = ?? temp {
    _? temp < 0  : "xeo"
    _? temp < 20 : "frío"
    _? temp < 35 : "quente"
    _            : "moi quente"
}
>> estado ¶    // → xeo

// Forma de instrución (ramas de bloque)
?? n {
    0        : { >> "cero" ¶ }
    _? n < 0 : { >> "negativo" ¶ }
    _        : { >> "positivo" ¶ }
}
```

---

## Bucles

```zymbol
@ i:0..4  { >> i " " }        // intervalo inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // con paso:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverso:               5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

froitas = ["mazá", "pera", "uva"]
@ f:froitas { >> f ¶ }        // para cada elemento

@ c:"ola" { >> c "-" }
>> ¶                          // → o-l-a-  (sobre caracteres)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! parar
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Bucle infinito
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Bucle con etiqueta (break anidado)
conta = 0
@ @externo {
    conta++
    ? conta >= 3 { @! externo }
}
>> conta ¶                    // → 3
```

---

## Funcións

```zymbol
sumar(a, b) { <~ a + b }
>> sumar(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

As funcións teñen un **ámbito illado** — non poden ler variables externas. Usa parámetros de saída `<~` para modificar variables do chamador:

```zymbol
intercambiar(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
intercambiar(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> As funcións nomeadas non son valores de primeira clase. Para pasalas como argumento, envolve: `x -> fn(x)`.

---

## Lambdas e Peches

```zymbol
dobre = x -> x * 2
suma = (a, b) -> a + b
>> dobre(5) ¶    // → 10
>> suma(3, 7) ¶  // → 10

// Lambda con bloque
clasificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}

// Peche — captura o ámbito exterior
factor = 3
triple = x -> x * factor
>> triple(7) ¶    // → 21

// Fábrica
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// En arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — acceso (base 0)
arr[-1]         // 5 — índice negativo (último)
arr$#           // 5 — lonxitude (usar (arr$#) en >>)

arr = arr$+ 6            // engadir → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserir no índice 2
arr3 = arr$- 3           // eliminar a primeira ocorrencia do valor
arr4 = arr$-- 3          // eliminar todas as ocorrencias
arr5 = arr$-[0]          // eliminar no índice
arr6 = arr$-[1..3]       // eliminar un intervalo (fin exclusivo)

ten = arr$? 3            // #1 — contén
pos = arr$?? 3           // [2] — todos os índices do valor
sl = arr$[0..3]          // [1,2,3] — recorte (fin exclusivo)
sl2 = arr$[0:3]          // [1,2,3] — igual, sintaxe por conteo

asc = arr$^+             // ordenado ascendente  (só primitivos)
desc = arr$^-            // ordenado descendente (só primitivos)

// Arrays de tuplas nomeadas/posicionais — usar $^ con lambda comparador
db = [(nome: "Carla", idade: 28), (nome: "Ana", idade: 25), (nome: "Bob", idade: 30)]
por_idade = db$^ (a, b -> a.idade < b.idade)    // ascendente por idade  (<)
por_nome  = db$^ (a, b -> a.nome > b.nome)      // descendente por nome (>)
>> por_idade[0].nome ¶     // → Ana
>> por_nome[0].nome ¶      // → Carla

arr[1] = 99              // actualizar no lugar
arr = arr[1]$~ 99        // actualización funcional — devolve novo array
```

> Todos os operadores de colección devolven un **novo array**. Reasignar: `arr = arr$+ 4`.
> Os operadores non se poden encadear — usar asignacións intermedias.
> `$^+` / `$^-` ordenan **arrays primitivos** (números, cadeas). Para arrays de tuplas, usar `$^` con lambda comparador — a dirección codifícase no lambda (`<` = ascendente, `>` = descendente).

```zymbol
// Arrays anidados
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[1][2] ¶    // → 6
```

---

## Desestruturación

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primeiro, *resto] = arr     // primeiro=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Tupla nomeada
persoa = (nome: "Ana", idade: 25, cidade: "Santiago")
(nome: n, idade: i) = persoa   // n="Ana"  i=25
```

---

## Tuplas

```zymbol
// Posicional
punto = (10, 20)
>> punto[0] ¶    // → 10

// Nomeada
persoa = (nome: "Alice", idade: 25)
>> persoa.nome ¶    // → Alice
>> persoa[0] ¶      // → Alice  (o índice tamén funciona)

// Anidada
pos = (x: 10, y: 20)
p = (pos: pos, etiqueta: "orixe")
>> p.pos.x ¶        // → 10
```

---

## Funcións de Orde Superior

> Os operadores HOF requiren un **lambda inline** — as variables lambda non se poden pasar directamente.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobres  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pares   = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total   = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Encadear vía intermedios
paso1 = nums$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funcións nomeadas en HOF — envolve en lambda
dobrar(x) { <~ x * 2 }
r = nums$> (x -> dobrar(x))    // ✅
```

---

## Operador Pipe

O lado dereito sempre require `_` como marcador de posición para o valor transmitido:

```zymbol
dobre = x -> x * 2
sumar = (a, b) -> a + b
inc = x -> x + 1

5 |> dobre(_)        // → 10
10 |> sumar(_, 5)    // → 15
5 |> sumar(2, _)     // → 7

// Encadeado
r = 5 |> dobre(_) |> inc(_) |> dobre(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Xestión de Erros

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "división por cero" ¶
} :! {
    >> "outro erro: " _err ¶    // _err contén a mensaxe de erro
} :> {
    >> "execútase sempre" ¶
}
```

| Tipo        | Cando ocorre                 |
|-------------|------------------------------|
| `##Div`     | División por cero             |
| `##IO`      | Ficheiro / sistema            |
| `##Index`   | Índice fóra dos límites       |
| `##Type`    | Erro de tipo                  |
| `##Parse`   | Erro de parsaxe               |
| `##Network` | Erros de rede                 |
| `##_`       | Calquera erro (catch-all)     |

---

## Módulos

```zymbol
// Ficheiro: lib/calc.zy
# calc

#> { sumar, get_PI }    // exportacións ANTES das definicións

_PI := 3.14159
sumar(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — acceso directo á constante vía alias non soportado
```

```zymbol
// Ficheiro: main.zy
<# ./lib/calc <= c    // alias obrigatorio

>> c::sumar(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Exportar con nome público diferente
# meulib
#> { _sumar_interno <= suma }

_sumar_interno(a, b) { <~ a + b }
```

```zymbol
<# ./meulib <= m

>> m::suma(3, 4) ¶    // → 7  (nome interno _sumar_interno está oculto)
```

---

## Operadores de Datos

```zymbol
// Converter cadea a número
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (seguro, sen erro)

// Arredondar / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arredondar a 2 decimais)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formatación de números
fmt = #,|1234567|      // → 1,234,567  (separador de millares)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Literais de base
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Conversión de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integración Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // captura stdout (inclúe \n final)
>> "Hoxe: " data

ficheiro = "data.txt"
contido = <\ cat {ficheiro} \>  // interpolación en comandos

saída = </"./script.zy"/>       // executar outro script Zymbol, capturar saída
>> saída
```

> `><` captura argumentos CLI como array de cadeas (só tree-walker).

---

## Exemplo Completo: FizzBuzz

```zymbol
clasificar(número) {
    ? número % 15 == 0 { <~ "FizzBuzz" }
    _? número % 3  == 0 { <~ "Fizz" }
    _? número % 5  == 0 { <~ "Buzz" }
    _ { <~ número }
}

@ i:1..20 { >> clasificar(i) ¶ }
```

---

## Referencia de Símbolos

| Símbolo   | Operación                          | Símbolo       | Operación                      |
|-----------|------------------------------------|---------------|-------------------------------|
| `=`       | variable                           | `$#`          | lonxitude                     |
| `:=`      | constante                          | `$+`          | engadir                       |
| `>>`      | saída                              | `$+[i]`       | inserir no índice             |
| `<<`      | entrada                            | `$-`          | eliminar primeira ocorrencia  |
| `¶`/`\\`  | nova liña                          | `$--`         | eliminar todas as ocorrencias |
| `?`       | se (if)                            | `$-[i]`       | eliminar no índice            |
| `_?`      | se non se (elif)                   | `$-[i..j]`    | eliminar un intervalo         |
| `_`       | se non / comodín                   | `$?`          | contén                        |
| `??`      | match                              | `$??`         | todos os índices do valor     |
| `@`       | bucle                              | `$[s..e]`     | recorte                       |
| `@!`      | parar (break)                      | `$>`          | map                           |
| `@>`      | continuar                          | `$\|`         | filter                        |
| `->`      | lambda                             | `$<`          | reduce                        |
| `$^+`     | ordenar ascendente (primitivos)    | `$^-`         | ordenar descendente           |
| `$^`      | ordenar con lambda comparador      |               |                               |
| `<~`      | retornar (return)                  | `!?`          | intentar (try)                |
| `\|>`     | pipe                               | `:!`          | capturar (catch)              |
| `#1`      | verdadeiro                         | `:>`          | sempre (finally)              |
| `#0`      | falso                              | `$!`          | é erro                        |
| `<#`      | importar                           | `$!!`         | propagar erro                 |
| `#`       | declarar módulo                    | `#>`          | exportar                      |
| `::`      | chamada de módulo                  | `.`           | acceso a campo                |
| `#\|..\|` | converter a número                | `#?`          | metadatos de tipo             |
| `#.N\|..\|` | arredondar                      | `#!N\|..\|`   | truncar                       |
| `c\|..\|` | formato con comas                 | `e\|..\|`     | científico                    |
| `<\ ..\>` | executar shell                    | `>\<`         | argumentos CLI                |

---

> **Aviso:** Esta documentación foi creada e traducida por intelixencia artificial (IA).
> Fixéronse todos os esforzos para garantir a exactitude, pero algunhas traducións ou exemplos poden conter erros.
> A referencia canónica é a [especificación de Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
