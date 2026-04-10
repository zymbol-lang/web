# Manual do Zymbol-Lang

**Zymbol-Lang** é uma linguagem de programação simbólica. Sem palavras-chave — tudo são símbolos. Funciona igual em qualquer idioma humano.

- Sem `if`, `while`, `return` — apenas `?`, `@`, `<~`
- Unicode completo — identificadores em qualquer idioma ou emoji
- Agnóstico ao idioma humano — o código é igual em todos os idiomas

---

## Variáveis e Constantes

```zymbol
x = 10              // variável mutável
PI := 3.14159       // constante — erro ao reatribuir
nome = "Alice"
ativo = #1          // booleano verdadeiro
👋 := "Olá"
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

## Tipos de Dados

| Tipo           | Literal             | Tag `#?` | Notas                              |
|----------------|---------------------|----------|------------------------------------|
| Int            | `42`, `-7`          | `###`    | 64-bit com sinal                   |
| Float          | `3.14`, `1.5e10`    | `##.`    | Notação científica OK              |
| String         | `"texto"`           | `##"`    | Interpolação: `"Olá {nome}"`       |
| Char           | `'A'`               | `##'`    | Um caractere Unicode               |
| Bool           | `#1`, `#0`          | `##?`    | NÃO numérico — `#1 ≠ 1`           |
| Array          | `[1, 2, 3]`         | `##]`    | Elementos homogêneos               |
| Tupla          | `(a, b)`            | `##)`    | Posicional                         |
| Tupla nomeada  | `(x: 1, y: 2)`      | `##)`    | Campos nomeados                    |

```zymbol
// Introspecção de tipo — retorna (tipo, dígitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Saída e Entrada

```zymbol
>> "Olá" ¶                        // ¶ ou \\ para nova linha explícita
>> "a=" a " b=" b ¶               // justaposição — múltiplos valores
>> (arr$#) ¶                      // operadores postfix requerem ( ) em >>

<< nome                           // ler na variável (sem prompt)
<< "Digite seu nome: " nome       // com prompt
```

> `¶` (AltGr+R no teclado espanhol) e `\\` são novas linhas equivalentes.

---

## Operadores

```zymbol
// Aritmética
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (divisão inteira)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (exponenciação)

// Comparação
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lógica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Strings

```zymbol
// Três formas de concatenação
nome = "Alice"
n = 42

msg = "Olá ", nome, "!"              // vírgula — em atribuições
>> "Olá " nome " você tem " n ¶     // justaposição — em >>
desc = "Olá {nome}, você tem {n}"   // interpolação — em qualquer lugar
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (fim exclusivo)
tem = s$? "World"          // #1
partes = "a,b,c,d" / ','   // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (apenas os primeiros N)
```

> `+` é apenas para números. Use `,`, justaposição ou interpolação para strings.

---

## Controle de Fluxo

```zymbol
x = 7

? x > 0 { >> "positivo" ¶ }

? x > 100 {
    >> "grande" ¶
} _? x > 0 {
    >> "positivo" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negativo" ¶
}
```

> Blocos `{ }` são **obrigatórios** mesmo para uma única instrução.

---

## Match

```zymbol
// Intervalos
nota = 85
conceito = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> conceito ¶    // → B

// Strings
cor = "vermelho"
codigo = ?? cor {
    "vermelho" : "#FF0000"
    "verde"    : "#00FF00"
    _          : "#000000"
}

// Guardas
temp = -5
estado = ?? temp {
    _? temp < 0  : "gelo"
    _? temp < 20 : "frio"
    _? temp < 35 : "morno"
    _            : "quente"
}
>> estado ¶    // → gelo

// Forma de instrução (braços de bloco)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negativo" ¶ }
    _        : { >> "positivo" ¶ }
}
```

---

## Laços

```zymbol
@ i:0..4  { >> i " " }        // intervalo inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // com passo:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverso:               5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frutas = ["maçã", "pera", "uva"]
@ f:frutas { >> f ¶ }         // para cada elemento

@ c:"olá" { >> c "-" }
>> ¶                          // → o-l-á-  (sobre caracteres)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! parar
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Laço infinito
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Laço com rótulo (break aninhado)
conta = 0
@ @externo {
    conta++
    ? conta >= 3 { @! externo }
}
>> conta ¶                    // → 3
```

---

## Funções

```zymbol
somar(a, b) { <~ a + b }
>> somar(3, 4) ¶    // → 7

fatorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fatorial(n - 1)
}
>> fatorial(5) ¶    // → 120
```

Funções têm **escopo isolado** — não podem ler variáveis externas. Use parâmetros de saída `<~` para modificar variáveis do chamador:

```zymbol
trocar(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
trocar(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Funções nomeadas não são valores de primeira classe. Para passar como argumento, envolva: `x -> fn(x)`.

---

## Lambdas e Closures

```zymbol
dobro = x -> x * 2
soma = (a, b) -> a + b
>> dobro(5) ¶    // → 10
>> soma(3, 7) ¶  // → 10

// Lambda com bloco
classificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}

// Closure — captura escopo externo
fator = 3
triplo = x -> x * fator
>> triplo(7) ¶    // → 21

// Fábrica
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Em arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arrays

Arrays são **mutáveis** e contêm elementos do **mesmo tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — acesso (base 0)
arr[-1]         // 5 — índice negativo (último)
arr$#           // 5 — comprimento (usar (arr$#) em >>)

arr = arr$+ 6            // adicionar → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserir no índice 2
arr3 = arr$- 3           // remover primeira ocorrência do valor
arr4 = arr$-- 3          // remover todas as ocorrências
arr5 = arr$-[0]          // remover no índice
arr6 = arr$-[1..3]       // remover intervalo (fim exclusivo)

tem = arr$? 3            // #1 — contém
pos = arr$?? 3           // [2] — todos os índices do valor
sl = arr$[0..3]          // [1,2,3] — fatia (fim exclusivo)
sl2 = arr$[0:3]          // [1,2,3] — igual, sintaxe por contagem

asc = arr$^+             // ordenado crescente  (somente primitivos)
desc = arr$^-            // ordenado decrescente (somente primitivos)

// Arrays de tuplas nomeadas/posicionais — usar $^ com lambda comparador
db = [(nome: "Carla", idade: 28), (nome: "Ana", idade: 25), (nome: "Bob", idade: 30)]
por_idade = db$^ (a, b -> a.idade < b.idade)    // crescente por idade  (<)
por_nome  = db$^ (a, b -> a.nome > b.nome)      // decrescente por nome (>)
>> por_idade[0].nome ¶     // → Ana
>> por_nome[0].nome ¶      // → Carla

// Atualização direta de elemento (arrays somente)
arr[1] = 99              // atribuir
arr[0] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Atualização funcional — retorna um novo array; o original não é alterado
arr2 = arr[1]$~ 99
```

> Todos os operadores de coleção retornam um **novo array**. Atribuir de volta: `arr = arr$+ 4`.
> Operadores não podem ser encadeados — use atribuições intermediárias.
> `$^+` / `$^-` ordenam **arrays primitivos** (números, strings). Para arrays de tuplas, use `$^` com lambda comparador — a direção é codificada no lambda (`<` = crescente, `>` = decrescente).

**Semântica de valor** — atribuir um array a outra variável cria uma cópia independente:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b não é afetado
```

```zymbol
// Arrays aninhados
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[1][2] ¶    // → 6
```

---

## Desestruturação

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primeiro, *resto] = arr     // primeiro=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
ponto = (100, 200)
(px, py) = ponto             // px=100  py=200

// Tupla nomeada
pessoa = (nome: "Ana", idade: 25, cidade: "São Paulo")
(nome: n, idade: i) = pessoa   // n="Ana"  i=25
```

---

## Tuplas

Tuplas são contêineres ordenados **imutáveis** que podem conter valores de **tipos diferentes**.
Ao contrário dos arrays, os elementos não podem ser alterados após a criação.

```zymbol
// Posicional
ponto = (10, 20)
>> ponto[0] ¶    // → 10

dados = (42, "hello", #1, 3.14)
>> dados[2] ¶     // → #1

// Nomeada
pessoa = (nome: "Alice", idade: 25)
>> pessoa.nome ¶    // → Alice
>> pessoa[0] ¶      // → Alice  (índice também funciona)

// Aninhada
pos = (x: 10, y: 20)
p = (pos: pos, rotulo: "origem")
>> p.pos.x ¶        // → 10
```

**Imutabilidade** — qualquer tentativa de modificar um elemento de tupla é um erro de execução:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ erro de execução: tuplas são imutáveis
// t[0] += 5    // ❌ mesmo erro
```

Para derivar um valor modificado use `$~` (atualização funcional) — retorna uma **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original não alterado
>> t2 ¶    // → (10, 999, 30)

// Tupla nomeada — reconstruir explicitamente
pessoa = (nome: "Alice", idade: 25)
mais_velha  = (nome: pessoa.nome, idade: 26)
>> pessoa.idade ¶    // → 25
>> mais_velha.idade ¶    // → 26
```

---

## Funções de Ordem Superior

> Operadores HOF requerem **lambda inline** — variáveis lambda não podem ser passadas diretamente.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobros  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pares   = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total   = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Encadear via intermediários
passo1 = nums$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funções nomeadas em HOF — envolva em lambda
dobrar(x) { <~ x * 2 }
r = nums$> (x -> dobrar(x))    // ✅
```

---

## Operador Pipe

O lado direito sempre requer `_` como marcador de posição para o valor passado:

```zymbol
dobro = x -> x * 2
somar = (a, b) -> a + b
inc = x -> x + 1

5 |> dobro(_)        // → 10
10 |> somar(_, 5)    // → 15
5 |> somar(2, _)     // → 7

// Encadeado
r = 5 |> dobro(_) |> inc(_) |> dobro(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Tratamento de Erros

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisão por zero" ¶
} :! {
    >> "outro erro: " _err ¶    // _err contém a mensagem de erro
} :> {
    >> "sempre executa" ¶
}
```

| Tipo        | Quando                     |
|-------------|---------------------------|
| `##Div`     | Divisão por zero           |
| `##IO`      | Arquivo / sistema          |
| `##Index`   | Índice fora dos limites    |
| `##Type`    | Erro de tipo               |
| `##Parse`   | Erro de parsing            |
| `##Network` | Erros de rede              |
| `##_`       | Qualquer erro (catch-all)  |

---

## Módulos

```zymbol
// Arquivo: lib/calc.zy
# calc

#> { somar, get_PI }    // exportações ANTES das definições

_PI := 3.14159
somar(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — acesso direto à constante via alias não suportado
```

```zymbol
// Arquivo: main.zy
<# ./lib/calc <= c    // alias obrigatório

>> c::somar(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Exportar com nome público diferente
# minhalib
#> { _somar_interno <= soma }

_somar_interno(a, b) { <~ a + b }
```

```zymbol
<# ./minhalib <= m

>> m::soma(3, 4) ¶    // → 7  (nome interno _somar_interno está oculto)
```

---

## Modos Numéricos

Zymbol pode exibir números em **69 scripts de dígitos Unicode** — Devanagari, Árabe-Índico, Tailandês, Klingon pIqaD, Negrito Matemático, segmentos LCD e mais. O modo ativo afeta apenas a saída `>>`; a aritmética interna é sempre binária.

### Ativar um script

Escreva o dígito `0` e `9` do script alvo entre `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Árabe-Índico  (U+0660–U+0669)
#๐๙#    // Tailandês     (U+0E50–U+0E59)
#09#    // redefinir para ASCII
```

### Saída e booleanos

```zymbol
x = 42
>> x ¶          // → 42   (ASCII padrão)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ponto decimal sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleanos: prefixo # sempre ASCII, dígito se adapta
>> #1 ¶         // → #१   (verdadeiro em Devanagari)
>> #0 ¶         // → #०   (falso — distinto de ०  zero inteiro)

x = 28 > 4
>> x ¶          // → #१   (resultado de comparação segue o modo ativo)
```

### Literais de dígitos nativos no código-fonte

Os dígitos de qualquer script suportado são literais válidos — em intervalos, módulo, comparações:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literais booleanos em qualquer script

`#` + dígito `0` ou `1` de qualquer bloco é um literal booleano válido:

```zymbol
#٠٩#
نشط = #١        // equivalente a #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` é **sempre ASCII**. `#0` (falso) é sempre visualmente distinto de `0` (zero inteiro) em cada script.

---

## Operadores de Dados

```zymbol
// Converter string para número
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (seguro, sem erro)

// Arredondar / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arredondar para 2 casas decimais)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formatação de números
fmt = #,|1234567|      // → 1,234,567  (separador de milhar)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Literais de base
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binário)
c = 0o101        // → 'A'  (octal)

// Conversão de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integração Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // captura stdout (inclui \n final)
>> "Hoje: " data

arquivo = "data.txt"
conteudo = <\ cat {arquivo} \>  // interpolação em comandos

saida = </"./script.zy"/>       // executar outro script Zymbol, capturar saída
>> saida
```

> `><` captura argumentos CLI como array de strings (apenas tree-walker).

---

## Exemplo Completo: FizzBuzz

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

## Referência de Símbolos

| Símbolo   | Operação                           | Símbolo       | Operação                      |
|-----------|------------------------------------|---------------|-------------------------------|
| `=`       | variável                           | `$#`          | comprimento                   |
| `:=`      | constante                          | `$+`          | adicionar                     |
| `>>`      | saída                              | `$+[i]`       | inserir no índice             |
| `<<`      | entrada                            | `$-`          | remover primeira ocorrência   |
| `¶`/`\\`  | nova linha                         | `$--`         | remover todas as ocorrências  |
| `?`       | se (if)                            | `$-[i]`       | remover no índice             |
| `_?`      | senão se (elif)                    | `$-[i..j]`    | remover intervalo             |
| `_`       | senão / curinga                    | `$?`          | contém                        |
| `??`      | match                              | `$??`         | todos os índices do valor     |
| `@`       | laço                               | `$[s..e]`     | fatia                         |
| `@!`      | parar (break)                      | `$>`          | map                           |
| `@>`      | continuar                          | `$\|`         | filter                        |
| `->`      | lambda                             | `$<`          | reduce                        |
| `arr[i] = val` | atualizar elemento (arrays somente) | `arr[i] += val` | atualização composta    |
| `arr[i]$~` | atualização funcional (nova cópia) | `$^+`        | ordenar crescente (primitivos) |
| `$^-`     | ordenar decrescente (primitivos)   | `$^`          | ordenar com lambda comparador |
| `<~`      | retornar (return)                  | `!?`          | tentar (try)                  |
| `\|>`     | pipe                               | `:!`          | capturar (catch)              |
| `#1`      | verdadeiro                         | `:>`          | sempre (finally)              |
| `#0`      | falso                              | `$!`          | é erro                        |
| `<#`      | importar                           | `$!!`         | propagar erro                 |
| `#`       | declarar módulo                    | `#>`          | exportar                      |
| `::`      | chamada de módulo                  | `.`           | acesso a campo                |
| `#\|..\|` | converter para número             | `#?`          | metadados de tipo             |
| `#.N\|..\|` | arredondar                      | `#!N\|..\|`   | truncar                       |
| `#,\|..\|` | formato com vírgula               | `#^\|..\|`     | científico                    |
| `#d0d9#` | alternância de modo numérico | `#09#` | redefinir para ASCII |
| `<\ ..\>` | executar shell                    | `>\<`         | argumentos CLI                |

## Registro de Alterações

### v0.0.3 — Sistemas Numéricos Unicode & Melhorias LSP _(Abril 2026)_

- **Adicionado** 69 blocos de dígitos Unicode com o token de alternância `#d0d9#`
- **Adicionado** Literais booleanos em qualquer script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Adicionado** Dígitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Adicionado** Opcode VM `SetNumeralMode` — paridade completa com o tree-walker
- **Adicionado** O REPL respeita o modo numérico ativo no eco e exibição de variáveis
- **Alterado** A saída `>>` dos booleanos inclui agora o prefixo `#` (`#0` / `#1`) em todos os modos

### v0.0.2_01 — Renomeação de Operadores _(30 Mar 2026)_

- **Alterado** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — consistente com a família de prefixos `#`
- **Adicionado** Alias de exportação: reexportar membros de módulo com nome diferente

### v0.0.2 — Redesenho da API de Coleções & Instaladores _(24 Mar 2026)_

- **Adicionado** Família de operadores `$` unificada para arrays e strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Adicionado** Desestruturação para arrays, tuplas e tuplas com nome
- **Adicionado** Índices negativos (`arr[-1]` = último elemento)
- **Adicionado** Instaladores nativos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Adicionado** Atribuição composta `^=`
- **Corrigido** Casos extremos do parser aritmético; correções de documentação

### v0.0.1 — Lançamento Público Inicial _(22 Mar 2026)_

- Interpretador tree-walker + VM de registros (`--vm`, ~4× mais rápido, ~95% de paridade)
- Todos os construtos principais: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, closures, tratamento de erros
- REPL, LSP, extensão VS Code, formatador (`zymbol fmt`)

---

> **Aviso:** Esta documentação foi criada e traduzida por inteligência artificial (IA).
> Todos os esforços foram feitos para garantir a precisão, mas algumas traduções ou exemplos podem conter erros.
> A referência canônica é a [especificação do Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
