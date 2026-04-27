> **Aviso:** Esta documentación foi creada con asistencia de intelixencia artificial (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> A referencia canónica é **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** no repositorio do intérprete.

---

# Manual de Zymbol-Lang

**Zymbol-Lang** é unha linguaxe de programación simbólica. Sen palabras clave — todo son símbolos. Funciona igual en calquera lingua humana.

- Sen `if`, `while`, `return` — só símbolos `?`, `@`, `<~`
- Unicode completo — identificadores en calquera lingua ou emoji
- Agnóstico á lingua humana — o código é idéntico en todas as linguas

**Versión do intérprete**: v0.0.4 | **Cobertura de probas**: 393/393 (paridade TW ↔ VM)

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
| Función        | ref. función nomeada | `##()`        | Primeira clase; mostra `<funct/N>` |
| Lambda         | `x -> x * 2`         | `##->`        | Primeira clase; mostra `<lambd/N>` |

```zymbol
// Introspección de tipo — devolve (tipo, díxitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
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
// Dúas formas de concatenación
nome = "Alice"
n = 42

>> "Ola " nome " tes " n ¶           // xustaposición — en >>
desc = "Ola {nome}, tes {n}"         // interpolación — en calquera lugar
```

```zymbol
s = "Ola Mundo"
len = s$#                  // 9
sub = s$[1..3]             // "Ola"  (1-baseado, fin inclusivo)
ten = s$? "Mundo"          // #1
partes = "a,b,c,d"$/ ','   // [a, b, c, d]  (separar por delimitador)
rep = s$~~["o":"0"]        // "0la Mund0"
rep1 = s$~~["o":"0":1]     // "0la Mundo"  (só os primeiros N)
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

// Patróns de comparación
temp = -5
estado = ?? temp {
    < 0  : "xeo"
    < 20 : "frío"
    < 35 : "quente"
    _    : "moi quente"
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
@:externo {
    conta++
    ? conta >= 3 { @:externo! }
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

> As funcións nomeadas son **valores de primeira clase** — pásaas directamente: `nums$> dobrar`. Para envolve: `x -> fn(x)` tamén é válido.

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
crear_sumador(n) { <~ x -> x + n }
sumar10 = crear_sumador(10)
>> sumar10(5) ¶    // → 15

// En arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Arrays

Os arrays son **mutables** e conteñen elementos do **mesmo tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — acceso (1-baseado: primeiro elemento)
arr[-1]         // 5 — índice negativo (último elemento)
arr$#           // 5 — lonxitude (usar (arr$#) en >>)

arr = arr$+ 6            // engadir → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserir na posición 2 (1-baseado)
arr3 = arr$- 3           // eliminar a primeira ocorrencia do valor
arr4 = arr$-- 3          // eliminar todas as ocorrencias
arr5 = arr$-[1]          // eliminar no índice 1 (primeiro elemento)
arr6 = arr$-[2..3]       // eliminar un intervalo (1-baseado, fin inclusivo)

ten = arr$? 3            // #1 — contén
pos = arr$?? 3           // [3] — todos os índices do valor (1-baseado)
sl = arr$[1..3]          // [1,2,3] — recorte (1-baseado, fin inclusivo)
sl2 = arr$[1:3]          // [1,2,3] — igual, sintaxe por conteo

asc = arr$^+             // ordenado ascendente  (só primitivos)
desc = arr$^-            // ordenado descendente (só primitivos)

// Arrays de tuplas nomeadas/posicionais — usar $^ con lambda comparador
db = [(nome: "Carla", idade: 28), (nome: "Ana", idade: 25), (nome: "Bob", idade: 30)]
por_idade = db$^ (a, b -> a.idade < b.idade)    // ascendente por idade  (<)
por_nome  = db$^ (a, b -> a.nome > b.nome)      // descendente por nome (>)
>> por_idade[1].nome ¶     // → Ana
>> por_nome[1].nome ¶      // → Carla

// Actualización directa de elemento (só arrays)
arr[1] = 99              // asignar
arr[2] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Actualización funcional — devolve un novo array; o orixinal non cambia
arr2 = arr[2]$~ 99
```

> Todos os operadores de colección devolven un **novo array**. Reasignar: `arr = arr$+ 4`.
> `$+` pode encadearse: `arr = arr$+ 5$+ 6$+ 7`. Outros operadores usan asignacións intermedias.
> **A indexación é 1-baseada**: `arr[1]` é o primeiro elemento; `arr[0]` é un erro de execución.
> `$^+` / `$^-` ordenan **arrays primitivos** (números, cadeas). Para arrays de tuplas, usar `$^` con lambda comparador — a dirección codifícase no lambda (`<` = ascendente, `>` = descendente).

**Semántica de valor** — asignar un array a outra variable crea unha copia independente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b non se ve afectado
```

```zymbol
// Arrays anidados (indexación 1-baseada)
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[2][3] ¶    // → 6  (fila 2, columna 3)
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

As tuplas son contedores ordenados **inmutables** que poden conter valores de **tipos diferentes**.
A diferenza dos arrays, os elementos non se poden cambiar despois da creación.

```zymbol
// Posicional
punto = (10, 20)
>> punto[1] ¶    // → 10

datos = (42, "hello", #1, 3.14)
>> datos[3] ¶     // → #1

// Nomeada
persoa = (nome: "Alice", idade: 25)
>> persoa.nome ¶    // → Alice
>> persoa[1] ¶      // → Alice  (o índice tamén funciona, 1-baseado)

// Anidada
pos = (x: 10, y: 20)
p = (pos: pos, etiqueta: "orixe")
>> p.pos.x ¶        // → 10
```

**Inmutabilidade** — calquera intento de modificar un elemento dunha tupla é un erro de execución:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erro de execución: as tuplas son inmutables
// t[1] += 5    // ❌ mesmo erro
```

Para derivar un valor modificado usa `$~` (actualización funcional) — devolve unha **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orixinal sen cambios
>> t2 ¶    // → (10, 999, 30)

// Tupla nomeada — reconstruír explicitamente
persoa = (nome: "Alice", idade: 25)
maior  = (nome: persoa.nome, idade: 26)
>> persoa.idade ¶    // → 25
>> maior.idade ¶     // → 26
```

---

## Funcións de Orde Superior

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobres  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pares   = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total   = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Encadear vía intermedios
paso1 = nums$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// As funcións nomeadas pódense pasar directamente a HOF
dobrar(x) { <~ x * 2 }
e_grande(x) { <~ x > 5 }
r = nums$> dobrar       // ✅ referencia directa
r = nums$| e_grande     // ✅ referencia directa
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
// lib/calc.zy — o corpo do módulo está pechado entre chaves
# calc {
    #> { sumar, obter_PI }

    _PI := 3.14159
    sumar(a, b) { <~ a + b }
    obter_PI() { <~ _PI }
}
```

```zymbol
// principal.zy
<# ./lib/calc <= c    // alias obrigatorio

>> c::sumar(5, 3) ¶   // → 8
pi = c::obter_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar con nome público diferente
# meulib {
    #> { _sumar_interno <= suma }

    _sumar_interno(a, b) { <~ a + b }
}
```

```zymbol
<# ./meulib <= m

>> m::suma(3, 4) ¶    // → 7  (nome interno _sumar_interno está oculto)
```

> **Regras dos módulos**: só `#>`, definicións de funcións e inicializadores de variables/constantes literais están permitidos dentro de `# nome { }`. As instrucións executables (`>>`, `<<`, bucles, etc.) xeran o erro E013.

---

## Modos Numéricos

Zymbol pode mostrar números en **69 scripts de díxitos Unicode** — Devanagari, Árabe-Índico, Tailandés, Klingon pIqaD, Negriña Matemática, segmentos LCD e máis. O modo activo só afecta á saída `>>`; a aritmética interna é sempre binaria.

### Activar un script

Escriba o díxito `0` e `9` do script obxectivo entre `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Árabe-Índico  (U+0660–U+0669)
#๐๙#    // Tailandés     (U+0E50–U+0E59)
#09#    // restablecer a ASCII
```

### Saída e booleanos

```zymbol
x = 42
>> x ¶          // → 42   (ASCII por defecto)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto decimal sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleanos: prefixo # sempre ASCII, díxito adáptase
>> #1 ¶         // → #१   (verdadeiro en Devanagari)
>> #0 ¶         // → #०   (falso — distinto de ०  cero enteiro)

x = 28 > 4
>> x ¶          // → #१   (resultado de comparación segue o modo activo)
```

### Literais de díxitos nativos no código fonte

Os díxitos de calquera script compatible son literais válidos — en rangos, módulo, comparacións:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literais booleanos en calquera script

`#` + díxito `0` ou `1` de calquera bloque é un literal booleano válido:

```zymbol
#٠٩#
نشط = #١        // equivalente a #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` é **sempre ASCII**. `#0` (falso) é sempre visualmente distinto de `0` (cero enteiro) en cada script.

---

## Operadores de Datos

```zymbol
// Conversión de tipos
##.42         // → 42.0  (a Float)
###3.7        // → 4     (a Int, arredondar)
##!3.7        // → 3     (a Int, truncar)

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
| `@`       | bucle                              | `$[s..e]`     | recorte (1-baseado)           |
| `@ N { }` | bucle N veces (N iteracións)       | `$>`          | map                           |
| `@!`      | parar (break)                      | `$\|`         | filter                        |
| `@>`      | continuar                          | `$<`          | reduce                        |
| `@:nome { }` | bucle con etiqueta              | `$/ delim`    | separar cadea                 |
| `@:nome!` | parar etiqueta                     | `$++ a b c`   | construír concatenación       |
| `@:nome>` | continuar etiqueta                 | `arr[i>j>k]`  | índice de navegación          |
| `->`      | lambda                             | `arr[i] = val` | actualizar elemento (só arrays) |
| `arr[i] = val` | actualizar elemento (só arrays) | `arr[i] += val` | actualización composta    |
| `arr[i]$~` | actualización funcional (nova copia) | `$^+`      | ordenar ascendente (primitivos) |
| `$^-`     | ordenar descendente (primitivos)   | `$^`          | ordenar con lambda comparador |
| `<~`      | retornar (return)                  | `!?`          | intentar (try)                |
| `\|>`     | pipe                               | `:!`          | capturar (catch)              |
| `#1`      | verdadeiro                         | `:>`          | sempre (finally)              |
| `#0`      | falso                              | `$!`          | é erro                        |
| `<#`      | importar                           | `$!!`         | propagar erro                 |
| `#`       | declarar módulo                    | `#>`          | exportar                      |
| `::`      | chamada de módulo                  | `.`           | acceso a campo                |
| `#\|..\|` | converter a número                | `##.`         | converter a Float             |
| `###`     | converter a Int (arredondar)       | `##!`         | converter a Int (truncar)     |
| `#?`      | metadatos de tipo                  | `\ var`       | destruír variable             |
| `#.N\|..\|` | arredondar                      | `#!N\|..\|`   | truncar                       |
| `#,\|..\|` | formato con comas                 | `#^\|..\|`     | científico                    |
| `#d0d9#` | cambio de modo numérico | `#09#` | restablecer a ASCII |
| `<\ ..\>` | executar shell                    | `>\<`         | argumentos CLI                |

## Rexistro de Cambios

### v0.0.4 — Indexación 1-baseada, Funcións de Primeira Clase & Bloques de Módulo _(Abril 2026)_

- **Rotura** Toda a indexación cambiou a **1-baseada** — `arr[1]` é o primeiro elemento; `arr[0]` é un erro de execución
- **Engadido** As funcións nomeadas son **valores de primeira clase** — pásaas directamente a HOF: `nums$> dobrar`
- **Engadido** **Sintaxe de bloque** de módulo obrigatoria: `# nome { ... }` — a sintaxe plana eliminouse
- **Engadido** Indexación multidimensional: `arr[i>j>k]` (navegación), `arr[p ; q]` (extracción plana)
- **Engadido** Conversión de tipos: `##.expr` (Float), `###expr` (Int arredondar), `##!expr` (Int truncar)
- **Engadido** División de cadea: `str$/ delim` — devolve `Array(String)`
- **Engadido** Construción concatenada: `base$++ a b c` — engade múltiples elementos
- **Engadido** Bucle N veces: `@ N { }` — repetir exactamente N veces
- **Engadido** Sintaxe de bucle con etiqueta: `@:nome { }`, `@:nome!`, `@:nome>` — substitúe `@ @nome` / `@! nome`
- **Engadido** Regras de ámbito de variables: as variables `_nome` teñen ámbito exacto de bloque; `\ var` destrúe antes
- **Engadido** Patróns de comparación en match: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Engadido** Erro de módulo E013: as instrucións executables no corpo do módulo están prohibidas
- **Corrixido** `take_variable` xa non corrompe as constantes do módulo na reescritura
- **Corrixido** `alias.CONST` agora resólvese correctamente; `#>` pode aparecer despois das definicións de función
- **VM** Paridade total: 393/393 probas pasan

### v0.0.3 — Sistemas Numéricos Unicode & Melloras LSP _(Abril 2026)_

- **Engadido** 69 bloques de díxitos Unicode co token de cambio `#d0d9#`
- **Engadido** Literais booleanos en calquera script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Engadido** Díxitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Engadido** Opcode VM `SetNumeralMode` — paridade completa co tree-walker
- **Engadido** O REPL respecta o modo numérico activo no eco e visualización de variables
- **Cambiado** A saída `>>` dos booleanos inclúe agora o prefixo `#` (`#0` / `#1`) en todos os modos

### v0.0.2_01 — Cambio de Nome de Operadores _(30 Mar 2026)_

- **Cambiado** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — coherente coa familia de prefixos `#`
- **Engadido** Alias de exportación: reexportar membros de módulo con nome diferente

### v0.0.2 — Redeseño da API de Coleccións & Instaladores _(24 Mar 2026)_

- **Engadido** Familia de operadores `$` unificada para arrays e cadeas (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Engadido** Desestruturación para arrays, tuplas e tuplas con nome
- **Engadido** Índices negativos (`arr[-1]` = último elemento)
- **Engadido** Instaladores nativos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Engadido** Asignación composta `^=`
- **Corrixido** Casos límite do parser aritmético; correccións de documentación

### v0.0.1 — Lanzamento Público Inicial _(22 Mar 2026)_

- Intérprete tree-walker + VM de rexistros (`--vm`, ~4× máis rápido, ~95% de paridade)
- Todas as construcións principais: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, peches, xestión de erros
- REPL, LSP, extensión VS Code, formateador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Inmutable._
