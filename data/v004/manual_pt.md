> **Aviso:** Esta documentação foi criada com assistência de inteligência artificial (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> A referência canônica é **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** no repositório do interpretador.

---

# Manual do Zymbol-Lang

**Zymbol-Lang** é uma linguagem de programação simbólica. Sem palavras-chave — tudo são símbolos. Funciona igualmente em qualquer idioma humano.

- Sem `if`, `while`, `return` — apenas `?`, `@`, `<~`
- Unicode completo — identificadores em qualquer idioma ou emoji
- Agnóstico ao idioma humano — o código é o mesmo em todos os lugares

**Versão do interpretador**: v0.0.4 | **Cobertura de testes**: 393/393 (paridade TW ↔ VM)

---

## Variáveis e Constantes

```zymbol
x = 10              // variável mutável
PI := 3.14159       // constante — reatribuir é um erro em tempo de execução
nome = "Alice"
ativo = #1          // booleano verdadeiro
👋 := "Olá"
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

## Tipos de Dados

| Tipo | Literal | Etiqueta `#?` | Notas |
|------|---------|---------------|-------|
| Inteiro | `42`, `-7` | `###` | 64 bits com sinal |
| Flutuante | `3.14`, `1.5e10` | `##.` | Notação científica OK |
| Cadeia | `"texto"` | `##"` | Interpolação: `"Olá {nome}"` |
| Caractere | `'A'` | `##'` | Um caractere Unicode |
| Booleano | `#1`, `#0` | `##?` | NÃO é numérico — `#1 ≠ 1` |
| Vetor | `[1, 2, 3]` | `##]` | Elementos homogêneos |
| Tupla | `(a, b)` | `##)` | Posicional |
| Tupla nomeada | `(x: 1, y: 2)` | `##)` | Campos nomeados |
| Função | referência a função | `##()` | Primeira classe; exibe `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primeira classe; exibe `<lambd/N>` |

```zymbol
// Introspecção de tipo — retorna (tipo, dígitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Saída e Entrada

```zymbol
>> "Olá Mundo" ¶                  // ¶ ou \\ para quebra de linha explícita
>> "a=" a " b=" b ¶               // justaposição — múltiplos valores
>> (arr$#) ¶                      // operadores postfix exigem ( ) em >>

<< nome                           // ler em variável (sem prompt)
<< "Digite o nome: " nome         // com prompt
```

> `¶` (AltGr+R no teclado espanhol) e `\\` são equivalentes como quebra de linha.

---

## Operadores

```zymbol
// Aritmética — usar atribuições; alguns operadores têm quirks direto em >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisão inteira)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponenciação)

// Comparação
a == b    // #0
a <> b    // #1
a < b     // #0
a <= b    // #0
a > b     // #1
a >= b    // #1

// Lógica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Cadeias

```zymbol
// Duas formas de concatenar
nome = "Alice"
n = 42

>> "Olá " nome " você tem " n ¶        // justaposição — em >>
desc = "Olá {nome}, você tem {n}"      // interpolação — em qualquer contexto
```

```zymbol
s = "Olá Mundo"
len = s$#                  // 9
sub = s$[1..3]             // "Olá"  (base 1, fim inclusivo)
has = s$? "Mundo"          // #1
partes = "a,b,c,d"$/ ','   // [a, b, c, d]  (separar por delimitador)
rep = s$~~["o":"0"]        // "Olá Mund0"
rep1 = s$~~["o":"0":1]     // "Olá Mundo"  (somente o primeiro)
```

> `+` é apenas para números. Usar `,`, justaposição ou interpolação para cadeias.

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

> Os blocos `{ }` são **obrigatórios** mesmo para uma única linha.

---

## Match

```zymbol
// Intervalos
score = 85
grade = ?? score {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grade ¶    // → B

// Cadeias
cor = "vermelho"
codigo = ?? cor {
    "vermelho" : "#FF0000"
    "verde"    : "#00FF00"
    _          : "#000000"
}

// Padrões de comparação
temp = -5
estado = ?? temp {
    < 0  : "gelo"
    < 20 : "frio"
    < 35 : "quente"
    _    : "escaldante"
}
>> estado ¶    // → gelo

// Forma de instrução (blocos)
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
>> n ¶                        // → 128  (enquanto)

frutas = ["maçã", "pera", "uva"]
@ f:frutas { >> f ¶ }         // para cada elemento

@ c:"ola" { >> c "-" }
>> ¶                          // → o-l-a-  (sobre caracteres)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! romper
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

// Laço com rótulo (romper laço externo)
conta = 0
@:externo {
    conta++
    ? conta >= 3 { @:externo! }
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

As funções têm **escopo isolado** — não podem ler variáveis externas. Usar parâmetros de saída `<~` para modificar variáveis do chamador:

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

> As funções nomeadas são **valores de primeira classe** — podem ser passadas diretamente: `nums$> dobrar`. Envolvê-las também é válido: `x -> fn(x)`.

---

## Lambdas e Closures

```zymbol
dobrar = x -> x * 2
somar = (a, b) -> a + b
>> dobrar(5) ¶    // → 10
>> somar(3, 7) ¶  // → 10

// Lambda com bloco
classificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}

// Closure — captura o escopo externo
fator = 3
triple = x -> x * fator
>> triple(7) ¶    // → 21

// Factory
criar_somador(n) { <~ x -> x + n }
soma10 = criar_somador(10)
>> soma10(5) ¶    // → 15

// Em vetores
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Vetores

Os vetores são **mutáveis** e contêm elementos do **mesmo tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — acesso (base 1: primeiro elemento)
arr[-1]         // 5 — índice negativo (último elemento)
arr$#           // 5 — comprimento (usar (arr$#) em >>)

arr = arr$+ 6            // adicionar → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserir na posição 2 (base 1)
arr3 = arr$- 3           // remover primeira ocorrência do valor
arr4 = arr$-- 3          // remover todas as ocorrências
arr5 = arr$-[1]          // remover no índice 1 (primeiro elemento)
arr6 = arr$-[2..3]       // remover intervalo (base 1, fim inclusivo)

has = arr$? 3            // #1 — contém
pos = arr$?? 3           // [3] — todos os índices do valor (base 1)
sl = arr$[1..3]          // [1,2,3] — slice (base 1, fim inclusivo)
sl2 = arr$[1:3]          // [1,2,3] — igual, sintaxe por contagem

asc = arr$^+             // ordenado ascendente  (apenas primitivos)
desc = arr$^-            // ordenado descendente (apenas primitivos)

// Vetores de tuplas nomeadas/posicionais — usar $^ com lambda comparadora
dados = [(nome: "Carla", idade: 28), (nome: "Ana", idade: 25), (nome: "Bob", idade: 30)]
por_idade  = dados$^ (a, b -> a.idade < b.idade)       // ascendente por idade  (<)
por_nome   = dados$^ (a, b -> a.nome > b.nome)         // descendente por nome  (>)
>> por_idade[1].nome ¶     // → Ana
>> por_nome[1].nome ¶      // → Carla

// Atualização direta de elemento (apenas vetores)
arr[1] = 99              // atribuir
arr[2] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Atualização funcional — retorna um novo vetor; o original não muda
arr2 = arr[2]$~ 99
```

> Todos os operadores de coleção retornam um **novo vetor**. Atribuir de volta: `arr = arr$+ 4`.
> `$+` pode ser encadeado: `arr = arr$+ 5$+ 6$+ 7`. Os demais operadores usam atribuições intermediárias.
> **Indexação base 1**: `arr[1]` é o primeiro elemento; `arr[0]` é erro em tempo de execução.
> `$^+` / `$^-` ordenam **vetores de primitivos** (números, cadeias). Para vetores de tuplas, usar `$^` com lambda comparadora — a direção é codificada na lambda (`<` = ascendente, `>` = descendente).

**Semântica de valor** — atribuir um vetor a outra variável cria uma cópia independente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b não é afetado
```

```zymbol
// Vetores aninhados (indexação base 1)
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[2][3] ¶    // → 6  (linha 2, coluna 3)
```

---

## Desestruturação

```zymbol
// Vetor
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primeiro, *resto] = arr     // primeiro=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
ponto = (100, 200)
(px, py) = ponto             // px=100  py=200

// Tupla nomeada
pessoa = (nome: "Ana", idade: 25, cidade: "Lisboa")
(nome: n, idade: e) = pessoa   // n="Ana"  e=25
```

---

## Tuplas

As tuplas são contêineres ordenados **imutáveis** que podem conter valores de **tipos diferentes**.
Ao contrário dos vetores, os elementos não podem ser alterados após a criação.

```zymbol
// Posicional — tipos mistos permitidos
ponto = (10, 20)
>> ponto[1] ¶    // → 10

dados = (42, "olá", #1, 3.14)
>> dados[3] ¶     // → #1

// Nomeada
pessoa = (nome: "Alice", idade: 25)
>> pessoa.nome ¶    // → Alice
>> pessoa[1] ¶      // → Alice  (índice também funciona, base 1)

// Aninhada
pos = (x: 10, y: 20)
p = (pos: pos, rotulo: "origem")
>> p.pos.x ¶        // → 10
```

**Imutabilidade** — qualquer tentativa de modificar um elemento de uma tupla é um erro em tempo de execução:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erro em tempo de execução: tuplas são imutáveis
// t[1] += 5    // ❌ mesmo erro
```

Para derivar um valor modificado usar `$~` (atualização funcional) — retorna uma **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original sem alterações
>> t2 ¶    // → (10, 999, 30)

// Tupla nomeada — reconstruir explicitamente
pessoa = (nome: "Alice", idade: 25)
mais_velha = (nome: pessoa.nome, idade: 26)
>> pessoa.idade ¶       // → 25
>> mais_velha.idade ¶   // → 26
```

---

## Funções de Ordem Superior

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobrados = nums$> (x -> x * 2)                 // map    → [2,4,6…20]
pares    = nums$| (x -> x % 2 == 0)            // filter → [2,4,6,8,10]
total    = nums$< (0, (acc, x) -> acc + x)      // reduce → 55

// Encadear com variáveis intermediárias
passo1 = nums$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funções nomeadas podem ser passadas diretamente para HOF
dobrar(x) { <~ x * 2 }
eh_grande(x) { <~ x > 5 }
r = nums$> dobrar       // ✅ referência direta
r = nums$| eh_grande    // ✅ referência direta
```

---

## Operador Pipe

O lado direito sempre requer `_` como marcador de posição do valor:

```zymbol
dobrar = x -> x * 2
somar = (a, b) -> a + b
inc = x -> x + 1

5 |> dobrar(_)        // → 10
10 |> somar(_, 5)     // → 15
5 |> somar(2, _)      // → 7

// Encadeado
r = 5 |> dobrar(_) |> inc(_) |> dobrar(_)
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
    >> "outro erro: " _err ¶    // _err contém a mensagem
} :> {
    >> "sempre executado" ¶
}
```

| Tipo | Quando ocorre |
|------|---------------|
| `##Div` | Divisão por zero |
| `##IO` | Arquivo / sistema |
| `##Index` | Índice fora do intervalo |
| `##Type` | Erro de tipo |
| `##Parse` | Parsing de dados |
| `##Network` | Erros de rede |
| `##_` | Qualquer erro (catch-all) |

---

## Módulos

```zymbol
// lib/calc.zy — o corpo do módulo fica entre chaves
# calc {
    #> { somar, get_PI }

    _PI := 3.14159
    somar(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias obrigatório

>> c::somar(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar com nome público diferente
# minhalib {
    #> { _somar_interno <= soma }

    _somar_interno(a, b) { <~ a + b }
}
```

```zymbol
<# ./minhalib <= m

>> m::soma(3, 4) ¶    // → 7  (nome interno _somar_interno fica oculto)
```

> **Regras de módulos**: apenas `#>`, definições de funções e inicializadores literais são permitidos dentro de `# nome { }`. Instruções executáveis (`>>`, `<<`, laços, etc.) geram o erro E013.

---

## Sistemas Numéricos

Zymbol pode exibir números em **69 sistemas de dígitos Unicode** — Devanagari, Árabe-Índico, Tailandês, Klingon pIqaD, Negrito Matemático, dígitos LCD e mais. O modo ativo afeta apenas a saída `>>`; a aritmética interna é sempre binária.

### Ativar um sistema

Escreva o dígito `0` e o dígito `9` do sistema desejado entre `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Árabe-Índico  (U+0660–U+0669)
#๐๙#    // Tailandês     (U+0E50–U+0E59)
#09#    // restaurar ASCII
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

### Dígitos nativos no código-fonte

Os dígitos de qualquer sistema suportado são literais válidos — em intervalos, módulo, comparações:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literais booleanos em qualquer sistema

`#` + dígito `0` ou `1` de qualquer bloco suportado é um literal booleano válido:

```zymbol
#٠٩#
نشط = #١        // igual a #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` é **sempre ASCII**. `#0` (falso) é sempre visualmente distinto de `0` (zero inteiro) em qualquer sistema.

---

## Operadores de Dados

```zymbol
// Conversão de tipos
##.42         // → 42.0  (para Flutuante)
###3.7        // → 4     (para Inteiro, arredondar)
##!3.7        // → 3     (para Inteiro, truncar)

// Interpretar cadeia como número
v1 = #|"42"|      // → 42  (Inteiro)
v2 = #|"3.14"|    // → 3.14  (Flutuante)
v3 = #|"abc"|     // → "abc"  (sem erro, retorna original)

// Arredondar / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arredondar a 2 casas)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formato numérico
fmt = #,|1234567|      // → 1,234,567  (com vírgulas)
sci = #^|12345.678|    // → 1.2345678e4  (notação científica)

// Literais em outras bases
a = 0x41         // → 'A'  (hexadecimal → caractere)
b = 0b01000001   // → 'A'  (binário → caractere)
c = 0o101        // → 'A'  (octal → caractere)

// Conversão para representação em base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integração com o Shell

```zymbol
data = <\ date +%Y-%m-%d \>    // captura stdout (inclui \n no final)
>> "Hoje: " data

arquivo = "dados.txt"
conteudo = <\ cat {arquivo} \>    // interpolação em comandos

saida = </"./subscript.zy"/>      // executar outro script Zymbol, capturar saída
>> saida
```

> `><` captura os argumentos CLI como vetor de cadeias (apenas tree-walker).

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

| Símbolo | Operação | Símbolo | Operação |
|---------|----------|---------|----------|
| `=` | variável | `$#` | comprimento |
| `:=` | constante | `$+` | adicionar (encadeável) |
| `>>` | saída | `$+[i]` | inserir no índice (base 1) |
| `<<` | entrada | `$-` | remover 1ª ocorrência |
| `¶` / `\\` | quebra de linha | `$--` | remover todas |
| `?` | se | `$-[i]` | remover no índice (base 1) |
| `_?` | senão se | `$-[i..j]` | remover intervalo (base 1) |
| `_` | senão / curinga | `$?` | contém |
| `??` | match | `$??` | encontrar todos os índices (base 1) |
| `@` | laço | `$[s..e]` | slice (base 1) |
| `@ N { }` | laço N vezes | `$>` | map |
| `@!` | romper | `$\|` | filter |
| `@>` | continuar | `$<` | reduce |
| `@:nome { }` | laço com rótulo | `$/ delim` | separar cadeia |
| `@:nome!` | romper rótulo | `$++ a b c` | concat build |
| `@:nome>` | continuar rótulo | `arr[i>j>k]` | navegação de índice |
| `->` | lambda | `arr[i] = val` | atualizar elemento (apenas vetores) |
| `arr[i] += val` | atualização composta | `arr[i]$~` | atualização funcional (nova cópia) |
| `$^+` | ordenar asc (primitivos) | `$^-` | ordenar desc (primitivos) |
| `$^` | ordenar com comparadora (tuplas) | `<~` | retornar |
| `\|>` | pipe | `!?` | tentar |
| `:!` | capturar | `:>` | sempre |
| `#1` | verdadeiro | `#0` | falso |
| `$!` | é erro | `$!!` | propagar erro |
| `<#` | importar | `#>` | exportar |
| `#` | declarar módulo | `::` | chamar módulo |
| `.` | acesso a campo | `#?` | metadado de tipo |
| `#\|..\|` | interpretar número | `##.` | converter para Flutuante |
| `###` | converter para Inteiro (arredondar) | `##!` | converter para Inteiro (truncar) |
| `#.N\|..\|` | arredondar | `#!N\|..\|` | truncar |
| `#,\|..\|` | formato vírgulas | `#^\|..\|` | notação científica |
| `#d0d9#` | mudança de sistema numérico | `#09#` | restaurar ASCII |
| `<\ ..\>` | executar shell | `>\<` | argumentos CLI |
| `\ var` | destruir variável explicitamente | | |

---

## Histórico de Versões

### v0.0.4 — Indexação Base 1, Funções de Primeira Classe & Módulos com Bloco _(Abril 2026)_

- **Quebra de compatibilidade** Indexação alterada para **base 1** — `arr[1]` é o primeiro elemento; `arr[0]` é erro em tempo de execução
- **Adicionado** Funções nomeadas são **valores de primeira classe** — passar diretamente para HOF: `nums$> dobrar`
- **Adicionado** **Sintaxe de bloco obrigatória** em módulos: `# nome { ... }` — sintaxe plana removida
- **Adicionado** Indexação multidimensional: `arr[i>j>k]` (navegação), `arr[p ; q]` (extração plana)
- **Adicionado** Conversão de tipos: `##.expr` (Flutuante), `###expr` (Inteiro arredondar), `##!expr` (Inteiro truncar)
- **Adicionado** Separar cadeia: `str$/ delim` — retorna `Vetor(Cadeia)`
- **Adicionado** Concat build: `base$++ a b c` — adiciona múltiplos elementos
- **Adicionado** Laço N vezes: `@ N { }` — executa exatamente N iterações
- **Adicionado** Sintaxe de laços com rótulo: `@:nome { }`, `@:nome!`, `@:nome>` — substitui `@ @nome` / `@! nome`
- **Adicionado** Regras de escopo de variáveis: `_nome` tem escopo exato de bloco; `\ var` destrói antecipadamente
- **Adicionado** Padrões de comparação em match: `< 0 :`, `> 5 :`, `== 42 :`, etc.
- **Adicionado** Erro E013 em módulos: instruções executáveis no corpo do módulo são inválidas
- **Corrigido** `take_variable` não corrompe mais constantes de módulo ao escrever de volta
- **Corrigido** `alias.CONST` resolve corretamente; `#>` pode aparecer após definições de funções
- **VM** Paridade total: 393/393 testes passam

### v0.0.3 — Sistemas Numéricos Unicode & Melhorias LSP _(Abril 2026)_

- **Adicionado** 69 blocos de dígitos Unicode com token de mudança de modo `#d0d9#`
- **Adicionado** Literais booleanos em qualquer sistema — `#१` / `#०`, `#١` / `#٠`, etc.
- **Adicionado** Dígitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Adicionado** Opcode VM `SetNumeralMode` — paridade completa com a árvore de avaliação
- **Adicionado** REPL respeita o modo numérico ativo no eco e exibição de variáveis
- **Alterado** Saída booleana `>>` inclui prefixo `#` (`#0` / `#1`) em todos os modos

### v0.0.2_01 — Renomeação de Operadores _(30 Mar 2026)_

- **Alterado** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — consistente com a família de prefixo `#`
- **Adicionado** Alias de exportação: re-exportar membros de módulo com nome diferente

### v0.0.2 — Redesenho de Coleções & Instaladores _(24 Mar 2026)_

- **Adicionado** Família unificada de operadores `$` para vetores e cadeias (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Adicionado** Desestruturação para vetores, tuplas e tuplas nomeadas
- **Adicionado** Índices negativos (`arr[-1]` = último elemento)
- **Adicionado** Instaladores nativos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Adicionado** Atribuição composta `^=`
- **Corrigido** Casos extremos na aritmética do parser; correções de documentação

### v0.0.1 — Primeira Versão Pública _(22 Mar 2026)_

- Interpretador de árvore de avaliação + VM de registros (`--vm`, ~4× mais rápido, ~95% paridade)
- Todos os construtos base: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, closures, tratamento de erros
- REPL, LSP, extensão VS Code, formatador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Imutável._
