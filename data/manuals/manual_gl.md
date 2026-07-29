> **Aviso:** Esta documentación foi creada coa asistencia da intelixencia artificial (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> A referencia canónica é **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** no repositorio do intérprete.

---

# Manual de Zymbol-Lang

> **Revisado para v0.0.5 — 2026-05-12**

**Zymbol-Lang** é unha linguaxe de programación simbólica. Sen palabras clave — todo é un símbolo. Funciona de forma idéntica en calquera lingua humana.

- Sen `if`, `while`, `return` — só `?`, `@`, `<~`
- Unicode completo — identificadores en calquera lingua ou emoji
- Independente da lingua — o código é igual en todas partes

**Versión do intérprete**: v0.0.5 | **Cobertura de probas**: 436/436 (TW ↔ VM paridade)

---

## Variables & Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — a reasignación é un erro en tempo de execución
nome = "Alice"
activo = #1         // booleano verdadeiro
👋 := "Ola"
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

`°` (signo de grao, U+00B0) auto-inicializa unha variable ao seu valor neutro no primeiro uso:

```zymbol
numeros = [3, 1, 4, 1, 5]
@ n:numeros {
    °total += n    // auto-init a 0 por encima do bucle; sobrevive despois de @
}
>> total ¶         // → 14
```

> `°x` (prefixo) áncrase por encima do bucle — resultado accesible despois de `@`.
> `x°` (posfixo) áncrase dentro do bucle — desaparece cando o bucle remata.
> Só Tree-Walker.

---

## Tipos de Datos

| Tipo | Literal | `#?` tag | Notas |
|------|---------|----------|-------|
| Enteiro | `42`, `-7` | `###` | 64-bit con signo |
| Decimal | `3.14`, `1.5e10` | `##.` | Notación científica OK |
| Cadea | `"texto"` | `##"` | Interpolación: `"Ola {nome}"` |
| Carácter | `'A'` | `##'` | Único carácter Unicode |
| Booleano | `#1`, `#0` | `##?` | NON numérico — `#1 ≠ 1` |
| Matriz | `[1, 2, 3]` | `##]` | Elementos homoxéneos |
| Tupla | `(a, b)` | `##)` | Posicional |
| Tupla Nomeada | `(x: 1, y: 2)` | `##)` | Campos nomeados |
| Función | referencia a función nomeada | `##()` | Primeira clase; mostra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primeira clase; mostra `<lambd/N>` |

```zymbol
// Introspección de tipo — devolve (tipo, díxitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Saída & Entrada

```zymbol
>> "Ola" ¶                        // ¶ ou \\ para nova liña explícita
>> "a=" a " b=" b ¶               // xustaposición — valores múltiplos
>> (mat$#) ¶                      // os operadores posfixos requiren ( ) en >>

<< nome                           // le nunha variable (sen indicación)
<< "Introduce o nome: " nome      // con indicación
```

> `¶` (AltGr+R no teclado español) e `\\` son novas liñas equivalentes.

---

## Primitivas TUI

Operadores de interface de terminal para programas interactivos. A maioría require un bloque `>>| { }` (pantalla alternativa + modo raw).

```zymbol
>>| {
    >>!                              // limpar pantalla alternativa
    >>~ (1, 1, 0, 10) > "Executando"  // fila 1, col 1, fg=10 (verde)
    @~ 1000                          // pausa 1 segundo (1000 ms)
    >>~ (2, 1) > "Feito."
}
// terminal restaurado automaticamente ao saír
```

```zymbol
// Tecla premida e tamaño do terminal
>>| {
    [filas, cols] = >>?              // consultar dimensións do terminal
    >>~ (1, 1) > "Terminal: " filas " x " cols
    <<| tecla                        // lectura de tecla bloqueante
    >>~ (2, 1) > "Premida: " tecla
}
```

> `>>!` limpa pantalla. `>>?` devolve `[filas, cols]`. `@~ N` dorme N milisegundos.
> `<<|` le unha tecla (bloqueante); `<<|?` sondea sen bloquear (devolve `'\0'` se ningunha).
> Tupla de saída posicionada: `(fila, col, BKS, fg, bg)` — calquera ranura pode omitirse cunha coma (`>>~ (,,, 196) > "vermello"`).
> Máscara BKS: `1`=Negriña, `2`=Cursiva, `4`=Subliñado. Paleta ANSI 256 cores (`0`=predeterminado terminal).
> Só Tree-Walker (excepto `>>!`, `>>?`, `@~`, `>>~` que tamén funcionan en `--vm`).

---

## Operadores

```zymbol
// Aritmética
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (división enteira)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potenciación)

// Comparación — asignar para inspeccionar
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lóxica
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Cadeas

```zymbol
// Dúas formas de concatenación
nome = "Alice"
n = 42

>> "Ola " nome " tes " n ¶          // xustaposición — en >>
descr = "Ola {nome}, tes {n}"       // interpolación — en calquera lugar
```

```zymbol
s = "Ola Mundo"
long = s$#                  // 11
sub = s$[1..3]              // "Ola"  (1-base, fin incluído)
ten = s$? "Mundo"           // #1
partes = "a,b,c,d"$/ ','    // [a, b, c, d]  (dividir por delimitador)
rep = s$~~["o":"0"]         // "0la Mund0"
rep1 = s$~~["o":"0":1]      // "0la Mundo"  (só primeiros N)
lina = "─" $* 20            // "────────────────────"  (repetir N veces)
```

> `+` é só para números. Usa `,`, xustaposición ou interpolación para cadeas.

---

## Fluxo de Control

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

> As chaves `{ }` son **obrigatorias** mesmo para unha soa instrución.

---

## Correspondencia

```zymbol
// Rangos
puntuacion = 85
nota = ?? puntuacion {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> nota ¶    // → B

// Cadeas
cor = "vermello"
codigo = ?? cor {
    "vermello" => "#FF0000"
    "verde"    => "#00FF00"
    _          => "#000000"
}

// Patróns de comparación
temp = -5
estado = ?? temp {
    < 0  => "xeo"
    < 20 => "frío"
    < 35 => "morno"
    _    => "quente"
}
>> estado ¶    // → xeo

// Forma de instrución (brazos de bloque)
n = -3
?? n {
    0    => { >> "cero" ¶ }
    < 0  => { >> "negativo" ¶ }
    _    => { >> "positivo" ¶ }
}
```

---

## Bucles

```zymbol
@ i:0..4  { >> i " " }        // rango inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // con paso:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverso:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

froitas = ["mazá", "pera", "uva"]
@ f:froitas { >> f ¶ }        // para cada elemento da matriz

@ c:"ola" { >> c "-" }
>> ¶                          // → o-l-a-  (para cada carácter)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! deter
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

// Bucle etiquetado (ruptura aniñada)
contador = 0
@:externo {
    contador++
    ? contador >= 3 { @:externo! }
}
>> contador ¶                 // → 3
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

As funcións teñen **ámbito illado** — non poden ler variables exteriores. Usa parámetros de saída `<~` para modificar variables do chamador:

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

> As funcións nomeadas son **valores de primeira clase** — pasa directamente: `numeros$> dobrar`. Para encapsular: `x -> fn(x)` tamén é válido.

---

## Lambdas & Closures

```zymbol
dobrar = x -> x * 2
sumar = (a, b) -> a + b
>> dobrar(5) ¶    // → 10
>> sumar(3, 7) ¶  // → 10

// Lambda de bloque
clasificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}

// Closure — captura ámbito exterior
factor = 3
triplicar = x -> x * factor
>> triplicar(7) ¶    // → 21

// Fábrica
crear_sumador(n) { <~ x -> x + n }
sumar10 = crear_sumador(10)
>> sumar10(5) ¶    // → 15

// En matrices
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Matrices

As matrices son **mutables** e conteñen elementos do **mesmo tipo**.

```zymbol
mat = [1, 2, 3, 4, 5]

x = mat[1]      // 1 — acceso (1-base: primeiro elemento)
x = mat[-1]     // 5 — índice negativo (último elemento)
x = mat$#       // 5 — lonxitude (usa (mat$#) en >>)

mat = mat$+ 6            // engadir → [1,2,3,4,5,6]
mat2 = mat$+[2] 99       // inserir na posición 2 (1-base)
mat3 = mat$- 3           // eliminar primeira ocorrencia do valor
mat4 = mat$-- 3          // eliminar todas as ocorrencias
mat5 = mat$-[1]          // eliminar no índice 1 (primeiro elemento)
mat6 = mat$-[2..3]       // eliminar rango (1-base, fin incluído)

ten = mat$? 3            // #1 — contén
pos = mat$?? 3           // [3] — todos os índices do valor (1-base)
sl = mat$[1..3]          // [1,2,3] — corte (1-base, fin incluído)
sl2 = mat$[1:3]          // [1,2,3] — mesmo, sintaxe baseada en reconto

asc = mat$^+             // ordenado ascendente  (só primitivos)
desc = mat$^-            // ordenado descendente (só primitivos)

// Matrices de tuplas nomeadas/posicionais — usa $^ con lambda comparadora
db = [(nome: "Carla", idade: 28), (nome: "Ana", idade: 25), (nome: "Bob", idade: 30)]
por_idade = db$^ (a, b -> a.idade < b.idade)    // ascendente por idade  (<)
por_nome  = db$^ (a, b -> a.nome > b.nome)      // descendente por nome (>)
>> por_idade[1].nome ¶     // → Ana
>> por_nome[1].nome ¶      // → Carla

// Actualización directa de elemento (só matrices)
mat[1] = 99              // asignar
mat[2] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Actualización funcional — devolve nova matriz; orixinal inalterado
mat2 = mat[2]$~ 99
```

> Todos os operadores de colección devolven unha **nova matriz**. Reasignar: `mat = mat$+ 4`.
> `$+` pode encadearse: `mat = mat$+ 5$+ 6$+ 7`. Outros operadores usan asignacións intermedias.
> **A indexación é 1-base**: `mat[1]` é o primeiro elemento; `mat[0]` é un erro en tempo de execución.
> `$^+` / `$^-` ordenan **matrices primitivas** (números, cadeas). Para matrices de tuplas usa `$^` con lambda comparadora — a dirección codifícase na lambda (`<` = ascendente, `>` = descendente).

**Semántica de valor** — asignar unha matriz a outra variable crea unha copia independente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b non é afectado
```

```zymbol
// Matrices aniñadas (indexación 1-base)
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[2][3] ¶    // → 6  (fila 2, columna 3)
```

---

## Desestruturación

```zymbol
// Matriz
mat = [10, 20, 30, 40, 50]
[a, b, c] = mat              // a=10  b=20  c=30
[primeiro, *resto] = mat     // primeiro=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Tupla nomeada
persoa = (nome: "Ana", idade: 25, cidade: "Vigo")
(nome: n, idade: i) = persoa // n="Ana"  i=25
```

---

## Tuplas

As tuplas son **contedores ordenados inmutables** que poden conter valores de **tipos diferentes**.
A diferenza das matrices, os elementos non se poden cambiar despois da creación.

```zymbol
// Posicional — tipos mixtos permitidos
punto = (10, 20)
>> punto[1] ¶    // → 10

datos = (42, "ola", #1, 3.14)
>> datos[3] ¶    // → #1

// Nomeada
persoa = (nome: "Alice", idade: 25)
>> persoa.nome ¶    // → Alice
>> persoa[1] ¶      // → Alice  (o índice tamén funciona, 1-base)

// Aniñada
pos = (x: 10, y: 20)
p = (pos: pos, etiqueta: "orixe")
>> p.pos.x ¶        // → 10
```

**Inmutabilidade** — calquera intento de modificar un elemento de tupla é un erro en tempo de execución:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erro en tempo de execución: as tuplas son inmutables
// t[1] += 5    // ❌ mesmo erro
```

Para derivar un valor modificado usa `$~` (actualización funcional) — devolve unha **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orixinal inalterado
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
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doblados  = numeros$> (x -> x * 2)               // map  → [2,4,6…20]
pares     = numeros$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
total     = numeros$< (0, (acc, x) -> acc + x)    // reduce → 55

// Cadea vía intermediarios
paso1 = numeros$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// As funcións nomeadas pódense pasar directamente ás HOF
dobrar(x) { <~ x * 2 }
e_grande(x) { <~ x > 5 }
r = numeros$> dobrar     // ✅ referencia directa
r = numeros$| e_grande   // ✅ referencia directa
```

---

## Operador Pipe

O lado dereito sempre require `_` como marcador de posición para o valor canalizado:

```zymbol
dobrar = x -> x * 2
sumar = (a, b) -> a + b
incrementar = x -> x + 1

r1 = 5 |> dobrar(_)              // → 10
r2 = 10 |> sumar(_, 5)           // → 15
r3 = 5 |> sumar(2, _)            // → 7

// Encadeado
r = 5 |> dobrar(_) |> incrementar(_) |> dobrar(_)
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
    >> "outro: " _err ¶    // _err contén a mensaxe de erro
} :> {
    >> "sempre se executa" ¶
}
```

| Tipo | Cando |
|------|-------|
| `##Div` | División por cero |
| `##IO` | Ficheiro / sistema |
| `##Index` | Índice fóra dos límites |
| `##Type` | Desaxuste de tipo |
| `##Parse` | Análise de datos |
| `##Network` | Erros de rede |
| `##_` | Calquera erro (catch-all) |

---

## Módulos

```zymbol
// lib/calc.zy — o corpo do módulo está entre chaves
# calc {
    #> { sumar, obter_PI }

    _PI := 3.14159
    sumar(a, b) { <~ a + b }
    obter_PI() { <~ _PI }
}
```

```zymbol
// principal.zy
<# ./lib/calc => c    // alias obrigatorio

>> c::sumar(5, 3) ¶   // → 8
pi = c::obter_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar con nome público diferente
# minhalib {
    #> { _sumar_interna => suma }

    _sumar_interna(a, b) { <~ a + b }
}
```

```zymbol
<# ./minhalib => m

>> m::suma(3, 4) ¶    // → 7  (o nome interno _sumar_interna está agochado)
```

> **Regras de módulos**: só `#>`, definicións de funcións e inicializadores literais de variables/constantes están permitidos dentro de `# nome { }`. As instrucións executables (`>>`, `<<`, bucles, etc.) xeran o erro E013.

---

## Modos Numéricos

Zymbol pode mostrar números en **69 scripts de díxitos Unicode** — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemático Negriña, segmentos LCD e máis. O modo activo afecta só a saída `>>`; a aritmética interna é sempre binaria.

### Activar un script

Escribe os díxitos `0` e `9` do script obxectivo entre `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // restablecer a ASCII
```

### Saída e booleanos

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predeterminado)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto decimal sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleanos: prefixo # sempre ASCII, díxito adáptase
>> #1 ¶         // → #१   (verdadeiro en Devanagari)
>> #0 ¶         // → #०   (falso — distinto de ० cero enteiro)

x = 28 > 4
>> x ¶          // → #१   (resultado comparación segue o modo activo)
```

### Literais de díxitos nativos no código fonte

Os díxitos de calquera script soportado son literais válidos — en rangos, módulo, comparacións:

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
نشط = #١        // igual que #1
>> نشط ¶        // → #١
>> (#१ && #٠) ¶ // → #٠
```

> `#` é **sempre ASCII**. `#0` (falso) é sempre visualmente distinto de `0` (cero enteiro) en calquera script.

---

## Operadores de Datos

```zymbol
// Cast de conversión de tipo
f = ##.42         // → 42.0  (a Decimal)
i = ###3.7        // → 4     (a Enteiro, arredonda)
t = ##!3.7        // → 3     (a Enteiro, trunca)

// Analizar cadea en número
v1 = #|"42"|      // → 42  (Enteiro)
v2 = #|"3.14"|    // → 3.14  (Decimal)
v3 = #|"abc"|     // → "abc"  (fail-safe, sen erro)

// Arredondar / Truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arredondar a 2 decimais)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formato de números
fmt = #,|1234567|      // → 1,234,567  (separado por comas)
cient = #^|12345.678|  // → 1.2345678e4  (científico)

// Literais de base
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Saída de conversión de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integración Shell

```zymbol
data = <\ date +%Y-%m-%d \>        // captura stdout (inclúe \n final)
>> "Hoxe: " data

ficheiro = "datos.txt"
contido = <\ cat {ficheiro} \>     // interpolación en ordes

saida = </"./subscript.zy"/>       // executar outro script Zymbol, capturar saída
>> saida
```

> `><` captura argumentos CLI como matriz de cadeas (só Tree-Walker).

---

## Exemplo Completo: FizzBuzz

```zymbol
clasificar(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> clasificar(i) ¶ }
```

---

## Referencia de Símbolos

| Símbolo | Operación | Símbolo | Operación |
|---------|-----------|---------|-----------|
| `=` | variable | `$#` | lonxitude |
| `:=` | constante | `$+` | engadir (encadenable) |
| `>>` | saída | `$+[i]` | inserir no índice (1-base) |
| `<<` | entrada | `$-` | eliminar primeiro por valor |
| `¶` / `\\` | nova liña | `$--` | eliminar todos por valor |
| `?` | se | `$-[i]` | eliminar no índice (1-base) |
| `_?` | se non | `$-[i..j]` | eliminar rango (1-base) |
| `_` | senón / comodín | `$?` | contén |
| `??` | correspondencia | `$??` | atopar todos os índices (1-base) |
| `@` | bucle | `$[s..e]` | corte (1-base) |
| `@ N { }` | bucle N veces | `$>` | map |
| `@!` | deter | `$\|` | filter |
| `@>` | continuar | `$<` | reduce |
| `@:nome { }` | bucle etiquetado | `$/ delim` | dividir cadea |
| `@:nome!` | deter etiqueta | `$++ a b c` | concat build |
| `@:nome>` | continuar etiqueta | `mat[i>j>k]` | índice navegación |
| `->` | lambda | `mat[i] = val` | actualizar elemento (só matrices) |
| `mat[i] += val` | actualización composta | `mat[i]$~` | actualización funcional (nova copia) |
| `$^+` | ordenar ascendente (primitivos) | `$^-` | ordenar descendente (primitivos) |
| `$^` | ordenar con comparador (tuplas) | `<~` | devolver |
| `\|>` | pipe | `!?` | tentar |
| `:!` | capturar | `:>` | finalmente |
| `#1` | verdadeiro | `#0` | falso |
| `$!` | é erro | `$!!` | propagar erro |
| `<#` | importar | `#>` | exportar |
| `#` | declarar módulo | `::` | chamada de módulo |
| `.` | acceso a campo | `#?` | metadatos de tipo |
| `#\|..\|` | analizar número | `##.` | converter a Decimal |
| `###` | converter a Enteiro (arredondar) | `##!` | converter a Enteiro (truncar) |
| `#.N\|..\|` | arredondar | `#!N\|..\|` | truncar |
| `#,\|..\|` | formato coma | `#^\|..\|` | científico |
| `#d0d9#` | cambiar modo numérico | `#09#` | restablecer a ASCII |
| `<\ ..\>` | execución shell | `>\<` | argumentos CLI |
| `\ var` | destruír variable explicitamente | `°x` / `x°` | definición en quente (auto-init) |
| `>>|` | bloque TUI (pantalla alt.) | `>>~` | saída posicionada |
| `>>!` | limpar pantalla | `>>?` | consultar tamaño terminal |
| `<<\|` | lectura de tecla bloqueante | `<<\|?` | lectura de tecla non bloqueante |
| `@~ N` | durmir N milisegundos | `$*` | repetir cadea N veces |

---

## Changelog de Versións

### v0.0.5 — Primitivas TUI, Definición en Quente & Repetición de Cadea _(Maio 2026)_

- **Breaking** Separador de brazo match: `patrón : resultado` → `patrón => resultado`
- **Breaking** Alias de import: `<# ruta <= alias` → `<# ruta => alias`
- **Breaking** Renomeado de export: `#> { fn <= pub }` → `#> { fn => pub }`
- **Added** Bloque TUI `>>| { }` — pantalla alternativa + modo raw; limpa ao saír
- **Added** Saída posicionada `>>~ (fila, col, BKS, fg, bg) > elementos` — ranuras esparsas, paleta ANSI 256 cores
- **Added** Entrada de tecla `<<| var` (bloqueante) e `<<|? var` (polling non bloqueante)
- **Added** `>>!` limpar pantalla, `>>?` consultar tamaño terminal, `@~ N` durmir N milisegundos
- **Added** Definición en quente `°x` / `x°` — auto-inicializar variable no primeiro uso en bucles
- **Added** Repetición de cadea `str $* N` — repetir unha cadea N veces
- **VM** Paridade: 436/436 probas pasan

### v0.0.4 — Indexación 1-Base, Funcións Primeira Clase & Bloques de Módulo _(Abril 2026)_

- **Breaking** Toda a indexación cambiada a **1-base** — `mat[1]` é o primeiro elemento; `mat[0]` é un erro en tempo de execución
- **Added** As funcións nomeadas son **valores de primeira clase** — pasa directamente ás HOF: `numeros$> dobrar`
- **Added** Sintaxe de **bloque de módulo** obrigatoria: `# nome { ... }` — sintaxe plana eliminada
- **Added** Indexación multidimensional: `mat[i>j>k]` (navegación), `mat[p ; q]` (extracción plana)
- **Added** Cast de conversión de tipo: `##.expr` (Decimal), `###expr` (Enteiro arredonda), `##!expr` (Enteiro trunca)
- **Added** División de cadea: `str$/ delim` — devolve `Array(String)`
- **Added** Concat build: `base$++ a b c` — engade múltiples elementos
- **Added** Bucle N veces: `@ N { }` — repetir exactamente N veces
- **Added** Sintaxe de bucle etiquetado: `@:nome { }`, `@:nome!`, `@:nome>` — substitúe `@ @nome` / `@! nome`
- **Added** Regras de ámbito de variables: variables `_nome` teñen ámbito exacto do bloque; `\ var` destrúe cedo
- **Added** Patróns de comparación match: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Added** Erro de módulo E013: as instrucións executables no corpo do módulo están prohibidas
- **Fixed** `take_variable` xa non corrompe as constantes do módulo no write-back
- **Fixed** `alias.CONST` agora resólvese correctamente; `#>` pode aparecer despois das definicións de funcións
- **VM** Paridade completa: 393/393 probas pasan

### v0.0.3 — Sistemas de Numerais Unicode & Melloras LSP _(Abril 2026)_

- **Added** 69 bloques de díxitos Unicode con token de cambio de modo `#d0d9#`
- **Added** Literais booleanos en calquera script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Added** Díxitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Added** Opcode de VM `SetNumeralMode` — paridade completa con tree-walker
- **Added** REPL respecta o modo numérico activo no eco e visualización de variables
- **Changed** Saída booleana `>>` agora inclúe prefixo `#` (`#0` / `#1`) en todos os modos

### v0.0.2_01 — Renomeado de Operadores _(30 Mar 2026)_

- **Changed** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — consistente con familia de prefixo de formato `#`
- **Added** Alias de export: re-exportar membros do módulo con nome diferente

### v0.0.2 — Rediseño da API de Coleccións & Instaladores _(24 Mar 2026)_

- **Added** Familia unificada de operadores `$` para matrices e cadeas (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Asignación de desestruturación para matrices, tuplas e tuplas nomeadas
- **Added** Índices negativos (`mat[-1]` = último elemento)
- **Added** Instaladores nativos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Added** Asignación composta `^=`
- **Fixed** Casos límite aritméticos do parser; correccións de documentación

### v0.0.1 — Primeira Versión Pública _(22 Mar 2026)_

- Intérprete tree-walker + VM de rexistros (`--vm`, ~4× máis rápido, ~95% paridade)
- Todos os construtos base: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, closures, xestión de erros
- REPL, LSP, extensión VS Code, formateador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Inmutable._
