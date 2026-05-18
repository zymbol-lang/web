> **Aviso:** Esta documentação foi criada e traduzida por inteligência artificial (IA).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Manual de Zymbol-Lang

> **Revisto para v0.0.5 — 2026-05-12**

**Zymbol-Lang** é uma linguagem de programação simbólica. Sem palavras-chave — tudo é um símbolo. Funciona de forma idêntica em qualquer língua humana.

- Sem `if`, `while`, `return` — apenas `?`, `@`, `<~`
- Unicode completo — identificadores em qualquer língua ou emoji
- Independente de língua humana — o código é o mesmo em todo o lado

**Versão do interpretador**: v0.0.5 | **Cobertura de testes**: 436/436 (TW ↔ VM paridade)

---

## Variáveis & Constantes

```zymbol
x = 10              // variável mutável
PI := 3.14159       // constante — reatribuição é um erro de execução
nome = "Alice"
activo = #1         // booleano verdadeiro
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

`°` (sinal de grau, U+00B0) inicializa automaticamente uma variável ao seu valor neutro na primeira utilização:

```zymbol
numeros = [3, 1, 4, 1, 5]
@ n:numeros {
    °total += n    // auto-init para 0 acima do ciclo; sobrevive após @
}
>> total ¶         // → 14
```

> `°x` (prefixo) ancora acima do ciclo — resultado acessível após `@`.
> `x°` (sufixo) ancora dentro do ciclo — desaparece quando o ciclo termina.
> Apenas interpretador de árvore.

---

## Tipos de Dados

| Tipo | Literal | tag `#?` | Notas |
|------|---------|----------|-------|
| Inteiro | `42`, `-7` | `###` | 64-bit com sinal |
| Decimal | `3.14`, `1.5e10` | `##.` | Notação científica OK |
| Cadeia | `"texto"` | `##"` | Interpolação: `"Olá {nome}"` |
| Carácter | `'A'` | `##'` | Único carácter Unicode |
| Booleano | `#1`, `#0` | `##?` | NÃO numérico — `#1 ≠ 1` |
| Vector | `[1, 2, 3]` | `##]` | Elementos homogéneos |
| Tuplo | `(a, b)` | `##)` | Posicional |
| Tuplo Nomeado | `(x: 1, y: 2)` | `##)` | Campos nomeados |
| Função | referência de função nomeada | `##()` | Primeira classe; apresentação `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primeira classe; apresentação `<lambd/N>` |

```zymbol
// Introspecção de tipo — devolve (tipo, dígitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Saída & Entrada

```zymbol
>> "Olá" ¶                        // ¶ ou \\ para nova linha explícita
>> "a=" a " b=" b ¶               // justaposição — valores múltiplos
>> (vec$#) ¶                      // operadores pós-fixos requerem ( ) em >>

<< nome                           // lê para variável (sem aviso)
<< "Introduza o nome: " nome      // com aviso
```

> `¶` (AltGr+R no teclado espanhol) e `\\` são novas linhas equivalentes.

---

## Primitivas TUI

Operadores de interface de utilizador de terminal para programas interactivos. A maioria requer um bloco `>>| { }` (ecrã alternativo + modo raw).

```zymbol
>>| {
    >>!                             // limpar ecrã alternativo
    >>~ (1, 1, 0, 10) > "A correr" // linha 1, col 1, fg=10 (verde)
    @~ 1000                         // pausa 1 segundo (1000 ms)
    >>~ (2, 1) > "Concluído."
}
// terminal restaurado automaticamente ao sair
```

```zymbol
// Tecla premida e tamanho do terminal
>>| {
    [linhas, colunas] = >>?              // consultar dimensões do terminal
    >>~ (1, 1) > "Terminal: " linhas " x " colunas
    <<| tecla                            // leitura de tecla bloqueante
    >>~ (2, 1) > "Premido: " tecla
}
```

> `>>!` limpa o ecrã. `>>?` devolve `[linhas, colunas]`. `@~ N` dorme N milissegundos.
> `<<|` lê uma tecla (bloqueante); `<<|?` sonda sem bloquear (devolve `'\0'` se nenhuma).
> Tuplo de saída posicional: `(linha, col, BKS, fg, bg)` — qualquer posição pode ser omitida com vírgula (`>>~ (,,, 196) > "vermelho"`).
> Máscara BKS: `1`=Negrito, `2`=Itálico, `4`=Sublinhado. Paleta ANSI 256 cores (`0`=predefinição do terminal).
> Apenas interpretador de árvore (excepto `>>!`, `>>?`, `@~`, `>>~` que também correm em `--vm`).

---

## Operadores

```zymbol
// Aritmética
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisão inteira)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponenciação)

// Comparação — atribuir para inspeccionar
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lógicos
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Cadeias

```zymbol
// Duas formas de concatenação
nome = "Alice"
n = 42

>> "Olá " nome " tens " n ¶           // justaposição — em >>
descr = "Olá {nome}, tens {n}"        // interpolação — em qualquer sítio
```

```zymbol
s = "Olá Mundo"
comp = s$#                 // 9
sub = s$[1..3]             // "Olá"  (base 1, fim inclusivo)
tem = s$? "Mundo"          // #1
partes = "a,b,c,d"$/ ','   // [a, b, c, d]  (dividir por delimitador)
sub1 = s$~~["l":"L"]       // "OLá Mundo"  (substituir todas)
sub2 = s$~~["l":"L":1]     // "OLá Mundo"  (primeiras N)
linha = "─" $* 20          // "────────────────────"  (repetir N vezes)
```

> `+` é apenas para números. Use `,`, justaposição ou interpolação para cadeias.

---

## Fluxo de Controlo

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

> As chavetas `{ }` são **obrigatórias** mesmo para uma única instrução.

---

## Correspondência

```zymbol
// Intervalos
nota = 85
classificacao = ?? nota {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> classificacao ¶    // → B

// Cadeias
cor = "vermelho"
codigo = ?? cor {
    "vermelho" => "#FF0000"
    "verde"    => "#00FF00"
    _          => "#000000"
}

// Padrões de comparação
temp = -5
estado = ?? temp {
    < 0  => "gelo"
    < 20 => "frio"
    < 35 => "morno"
    _    => "quente"
}
>> estado ¶    // → gelo

// Forma de instrução (braços de bloco)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negativo" ¶ }
    _    => { >> "positivo" ¶ }
}
```

---

## Ciclos

```zymbol
@ i:0..4  { >> i " " }        // intervalo inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // com passo:            1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverso:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (enquanto)

frutas = ["maçã", "pera", "uva"]
@ f:frutas { >> f ¶ }         // para cada vector

@ c:"olá" { >> c "-" }
>> ¶                          // → o-l-á-  (para cada cadeia)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuar
    ? i > 7 { @! }             // @! sair
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Ciclo infinito
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Ciclo com etiqueta (saída aninhada)
contador = 0
@:externo {
    contador++
    ? contador >= 3 { @:externo! }
}
>> contador ¶                  // → 3
```

---

## Funções

```zymbol
somar(a, b) { <~ a + b }
>> somar(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

As funções têm **âmbito isolado** — não podem ler variáveis externas. Use parâmetros de saída `<~` para modificar variáveis do chamador:

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

> As funções nomeadas são **valores de primeira classe** — passe directamente: `numeros$> dobrar`. Para envolver: `x -> fn(x)` também é válido.

---

## Lambdas & Closures

```zymbol
dobrar = x -> x * 2
somar = (a, b) -> a + b
>> dobrar(5) ¶    // → 10
>> somar(3, 7) ¶    // → 10

// Lambda de bloco
classificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}

// Closure — captura âmbito externo
factor = 3
triplicar = x -> x * factor
>> triplicar(7) ¶    // → 21

// Fábrica
criar_somador(n) { <~ x -> x + n }
somar10 = criar_somador(10)
>> somar10(5) ¶    // → 15

// Em vectores
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Vectores

Os vectores são **mutáveis** e contêm elementos do **mesmo tipo**.

```zymbol
vec = [1, 2, 3, 4, 5]

x = vec[1]      // 1 — acesso (base 1: primeiro elemento)
x = vec[-1]     // 5 — índice negativo (último elemento)
x = vec$#       // 5 — comprimento (use (vec$#) em >>)

vec = vec$+ 6            // adicionar → [1,2,3,4,5,6]
vec2 = vec$+[2] 99       // inserir na posição 2 (base 1)
vec3 = vec$- 3           // remover primeira ocorrência do valor
vec4 = vec$-- 3          // remover todas as ocorrências
vec5 = vec$-[1]          // remover no índice 1 (primeiro elemento)
vec6 = vec$-[2..3]       // remover intervalo (base 1, fim inclusivo)

tem = vec$? 3            // #1 — contém
pos = vec$?? 3           // [3] — todos os índices do valor (base 1)
fatia = vec$[1..3]       // [1,2,3] — fatia (base 1, fim inclusivo)
fatia2 = vec$[1:3]       // [1,2,3] — mesmo, sintaxe baseada em contagem

asc = vec$^+             // ordenado ascendente  (apenas primitivos)
desc = vec$^-            // ordenado descendente (apenas primitivos)

// Vectores de tuplos nomeados/posicionais — use $^ com lambda comparador
bd = [(nome: "Carla", idade: 28), (nome: "Ana", idade: 25), (nome: "Bob", idade: 30)]
por_idade = bd$^ (a, b -> a.idade < b.idade)    // ascendente por idade  (<)
por_nome  = bd$^ (a, b -> a.nome > b.nome)      // descendente por nome (>)
>> por_idade[1].nome ¶     // → Ana
>> por_nome[1].nome ¶      // → Carla

// Actualização directa de elemento (apenas vectores)
vec[1] = 99              // atribuir
vec[2] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Actualização funcional — devolve novo vector; original inalterado
vec2 = vec[2]$~ 99
```

> Todos os operadores de colecção devolvem um **novo vector**. Atribuir de volta: `vec = vec$+ 4`.
> `$+` pode ser encadeado: `vec = vec$+ 5$+ 6$+ 7`. Outros operadores usam atribuições intermédias.
> **A indexação é de base 1**: `vec[1]` é o primeiro elemento; `vec[0]` é um erro de execução.
> `$^+` / `$^-` ordena **vectores de primitivos** (números, cadeias). Para vectores de tuplos use `$^` com lambda comparador — a direcção é codificada no lambda (`<` = ascendente, `>` = descendente).

**Semântica de valor** — atribuir um vector a outra variável cria uma cópia independente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b não é afectado
```

```zymbol
// Vectores aninhados (indexação de base 1)
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[2][3] ¶    // → 6  (linha 2, coluna 3)
```

---

## Desestruturação

```zymbol
// Vector
vec = [10, 20, 30, 40, 50]
[a, b, c] = vec              // a=10  b=20  c=30
[primeiro, *resto] = vec     // primeiro=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tuplo posicional
ponto = (100, 200)
(px, py) = ponto             // px=100  py=200

// Tuplo nomeado
pessoa = (nome: "Ana", idade: 25, cidade: "Madrid")
(nome: n, idade: i) = pessoa   // n="Ana"  i=25
```

---

## Tuplos

Os tuplos são contentores ordenados **imutáveis** que podem conter valores de **tipos diferentes**.
Ao contrário dos vectores, os elementos não podem ser alterados após a criação.

```zymbol
// Posicional — tipos mistos permitidos
ponto = (10, 20)
>> ponto[1] ¶    // → 10

dados = (42, "olá", #1, 3.14)
>> dados[3] ¶     // → #1

// Nomeado
pessoa = (nome: "Alice", idade: 25)
>> pessoa.nome ¶    // → Alice
>> pessoa[1] ¶      // → Alice  (índice também funciona, base 1)

// Aninhado
pos = (x: 10, y: 20)
p = (pos: pos, etiqueta: "origem")
>> p.pos.x ¶        // → 10
```

**Imutabilidade** — qualquer tentativa de modificar um elemento de tuplo é um erro de execução:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erro de execução: os tuplos são imutáveis
// t[1] += 5    // ❌ mesmo erro
```

Para derivar um valor modificado use `$~` (actualização funcional) — devolve um **novo** tuplo:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original inalterado
>> t2 ¶    // → (10, 999, 30)

// Tuplo nomeado — reconstruir explicitamente
pessoa = (nome: "Alice", idade: 25)
mais_velho  = (nome: pessoa.nome, idade: 26)
>> pessoa.idade ¶      // → 25
>> mais_velho.idade ¶  // → 26
```

---

## Funções de Ordem Superior

```zymbol
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobrado  = numeros$> (x -> x * 2)                // map  → [2,4,6…20]
pares    = numeros$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = numeros$< (0, (acc, x) -> acc + x)     // reduce → 55

// Encadear via intermédios
passo1 = numeros$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funções nomeadas podem ser passadas directamente para FOS
dobrar(x) { <~ x * 2 }
e_grande(x) { <~ x > 5 }
r = numeros$> dobrar      // ✅ referência directa
r = numeros$| e_grande    // ✅ referência directa
```

---

## Operador Pipe

O lado direito requer sempre `_` como marcador de posição para o valor enviado por pipe:

```zymbol
dobrar = x -> x * 2
somar = (a, b) -> a + b
inc = x -> x + 1

r1 = 5 |> dobrar(_)        // → 10
r2 = 10 |> somar(_, 5)     // → 15
r3 = 5 |> somar(2, _)      // → 7

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
    >> "outro: " _err ¶    // _err contém a mensagem de erro
} :> {
    >> "corre sempre" ¶
}
```

| Tipo | Quando |
|------|--------|
| `##Div` | Divisão por zero |
| `##IO` | Ficheiro / sistema |
| `##Index` | Índice fora dos limites |
| `##Type` | Incompatibilidade de tipo |
| `##Parse` | Análise de dados |
| `##Network` | Erros de rede |
| `##_` | Qualquer erro (captura geral) |

---

## Módulos

```zymbol
// lib/calc.zy — o corpo do módulo está entre chavetas
# calc {
    #> { somar, get_PI }

    _PI := 3.14159
    somar(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias obrigatório

>> c::somar(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar com um nome público diferente
# mylib {
    #> { _somar_interno => soma }

    _somar_interno(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::soma(3, 4) ¶    // → 7  (o nome interno _somar_interno está oculto)
```

> **Regras do módulo**: apenas `#>`, definições de funções e inicializadores literais de variáveis/constantes são permitidos em `# nome { }`. Instruções executáveis (`>>`, `<<`, ciclos, etc.) geram o erro E013.

---

## Modos Numéricos

O Zymbol pode apresentar números em **69 scripts de dígitos Unicode** — Devanagari, árabe-índico, tailandês, Klingon pIqaD, Matemático Negrito, segmentos LCD, e mais. O modo activo só afecta a saída `>>`; a aritmética interna é sempre binária.

### Activar um script

Escreva o dígito `0` e `9` do script de destino entre `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-índico (U+0660–U+0669)
#๐๙#    // Tailandês    (U+0E50–U+0E59)
#09#    // repor para ASCII
```

### Saída e booleanos

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predefinido)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ponto decimal sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleanos: prefixo # sempre ASCII, dígito adapta-se
>> #1 ¶         // → #१   (verdadeiro em Devanagari)
>> #0 ¶         // → #०   (falso — distinto de ०  zero inteiro)

x = 28 > 4
>> x ¶          // → #१   (resultado de comparação segue modo activo)
```

### Literais de dígitos nativos na fonte

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
activo = #١        // mesmo que #1
>> activo ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` é **sempre ASCII**. `#0` (falso) é sempre visualmente distinto de `0` (zero inteiro) em qualquer script.

---

## Operadores de Dados

```zymbol
// Conversões de tipo
f = ##.42         // → 42.0  (para Decimal)
i = ###3.7        // → 4     (para Inteiro, arredondar)
t = ##!3.7        // → 3     (para Inteiro, truncar)

// Analisar cadeia para número
v1 = #|"42"|      // → 42  (Inteiro)
v2 = #|"3.14"|    // → 3.14  (Decimal)
v3 = #|"abc"|     // → "abc"  (seguro em falha, sem erro)

// Arredondar / truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arredondar para 2 casas decimais)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formatação de números
fmt = #,|1234567|  // → 1,234,567  (separado por vírgulas)
sci = #^|12345.678|    // → 1.2345678e4  (científico)

// Literais de base
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binário)
c = 0o101        // → 'A'  (octal)

// Saída de conversão de base
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

ficheiro = "dados.txt"
conteudo = <\ cat {ficheiro} \>    // interpolação em comandos

saida = </"./subscript.zy"/>    // executar outro script Zymbol, capturar saída
>> saida
```

> `><` captura argumentos CLI como vector de cadeias (apenas interpretador de árvore).

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
| `<<` | entrada | `$-` | remover primeiro por valor |
| `¶` / `\\` | nova linha | `$--` | remover todos por valor |
| `?` | se | `$-[i]` | remover no índice (base 1) |
| `_?` | senão-se | `$-[i..j]` | remover intervalo (base 1) |
| `_` | senão / wildcard | `$?` | contém |
| `??` | correspondência | `$??` | encontrar todos os índices (base 1) |
| `@` | ciclo | `$[s..e]` | fatia (base 1) |
| `@ N { }` | ciclo N vezes | `$>` | map |
| `@!` | sair | `$\|` | filter |
| `@>` | continuar | `$<` | reduce |
| `@:nome { }` | ciclo com etiqueta | `$/ delim` | dividir cadeia |
| `@:nome!` | sair etiqueta | `$++ a b c` | construir concat |
| `@:nome>` | continuar etiqueta | `vec[i>j>k]` | índice de navegação |
| `->` | lambda | `vec[i] = val` | actualizar elemento (apenas vectores) |
| `vec[i] += val` | actualização composta | `vec[i]$~` | actualização funcional (nova cópia) |
| `$^+` | ordenar ascendente (primitivos) | `$^-` | ordenar descendente (primitivos) |
| `$^` | ordenar com comparador (tuplos) | `<~` | retornar |
| `\|>` | pipe | `!?` | tentar |
| `:!` | capturar | `:>` | finalmente |
| `#1` | verdadeiro | `#0` | falso |
| `$!` | é erro | `$!!` | propagar erro |
| `<#` | importar | `#>` | exportar |
| `#` | declarar módulo | `::` | chamada de módulo |
| `.` | acesso a campo | `#?` | metadados de tipo |
| `#\|..\|` | analisar número | `##.` | converter para Decimal |
| `###` | converter para Inteiro (arredondar) | `##!` | converter para Inteiro (truncar) |
| `#.N\|..\|` | arredondar | `#!N\|..\|` | truncar |
| `#,\|..\|` | formato com vírgulas | `#^\|..\|` | científico |
| `#d0d9#` | mudar modo numérico | `#09#` | repor para ASCII |
| `<\ ..\>` | executar shell | `>\<` | argumentos CLI |
| `\ var` | destruir variável explicitamente | `°x` / `x°` | definição automática (auto-init) |
| `>>|` | bloco TUI (ecrã alternativo) | `>>~` | saída posicional |
| `>>!` | limpar ecrã | `>>?` | consultar tamanho do terminal |
| `<<\|` | tecla bloqueante | `<<\|?` | tecla não bloqueante |
| `@~ N` | dormir N milissegundos | `$*` | repetir cadeia N vezes |

---

## Changelog de Versões

### v0.0.5 — Primitivas TUI, Definição Automática & Repetição de Cadeia _(Maio 2026)_

- **Incompatível** Separador de braço de correspondência: `padrão : resultado` → `padrão => resultado`
- **Incompatível** Alias de importação: `<# caminho <= alias` → `<# caminho => alias`
- **Incompatível** Renomear exportação: `#> { fn <= pub }` → `#> { fn => pub }`
- **Adicionado** Bloco TUI `>>| { }` — ecrã alternativo + modo raw; limpa ao sair
- **Adicionado** Saída posicional `>>~ (linha, col, BKS, fg, bg) > itens` — posições esparsas, ANSI 256 cores
- **Adicionado** Entrada de tecla `<<| var` (bloqueante) e `<<|? var` (sondagem não bloqueante)
- **Adicionado** `>>!` limpar ecrã, `>>?` consultar tamanho do terminal, `@~ N` dormir N milissegundos
- **Adicionado** Definição automática `°x` / `x°` — auto-inicializar variável na primeira utilização em ciclos
- **Adicionado** Repetição de cadeia `str $* N` — repetir uma cadeia N vezes
- **VM** Paridade: 436/436 testes passam

### v0.0.4 — Indexação de Base 1, Funções de Primeira Classe & Blocos de Módulo _(Abril 2026)_

- **Incompatível** Toda a indexação alterada para **base 1** — `vec[1]` é o primeiro elemento; `vec[0]` é um erro de execução
- **Adicionado** Funções nomeadas são **valores de primeira classe** — passe directamente para FOS: `numeros$> dobrar`
- **Adicionado** **Sintaxe de bloco** de módulo obrigatória: `# nome { ... }` — sintaxe plana removida
- **Adicionado** Indexação multi-dimensional: `vec[i>j>k]` (navegação), `vec[p ; q]` (extracção plana)
- **Adicionado** Conversões de tipo: `##.expr` (Decimal), `###expr` (Inteiro arredondar), `##!expr` (Inteiro truncar)
- **Adicionado** Dividir cadeia: `str$/ delim` — devolve `Vector(Cadeia)`
- **Adicionado** Construir concat: `base$++ a b c` — adiciona múltiplos itens
- **Adicionado** Ciclo N vezes: `@ N { }` — repetir exactamente N vezes
- **Adicionado** Sintaxe de ciclo com etiqueta: `@:nome { }`, `@:nome!`, `@:nome>` — substitui `@ @nome` / `@! nome`
- **Adicionado** Regras de âmbito de variável: variáveis `_nome` têm âmbito exacto de bloco; `\ var` destrói cedo
- **Adicionado** Padrões de comparação de correspondência: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Adicionado** Erro de módulo E013: instruções executáveis no corpo do módulo são proibidas
- **Corrigido** `take_variable` já não corrompe constantes de módulo ao reescrever
- **Corrigido** `alias.CONST` resolve-se agora correctamente; `#>` pode aparecer após definições de funções
- **VM** Paridade completa: 393/393 testes passam

### v0.0.3 — Sistemas Numéricos Unicode & Melhorias LSP _(Abril 2026)_

- **Adicionado** 69 blocos de dígitos Unicode com token de mudança de modo `#d0d9#`
- **Adicionado** Literais booleanos em qualquer script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Adicionado** Dígitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Adicionado** Opcode VM `SetNumeralMode` — paridade completa com interpretador de árvore
- **Adicionado** REPL respeita o modo numérico activo em eco e apresentação de variáveis
- **Alterado** Saída `>>` de booleanos inclui agora o prefixo `#` (`#0` / `#1`) em todos os modos

### v0.0.2_01 — Renomear Operadores _(30 Mar 2026)_

- **Alterado** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — consistente com a família de prefixo de formato `#`
- **Adicionado** Alias de exportação: re-exportar membros de módulo com um nome diferente

### v0.0.2 — Redesenho da API de Colecção & Instaladores _(24 Mar 2026)_

- **Adicionado** Família de operadores `$` unificada para vectores e cadeias (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Adicionado** Atribuição por desestruturação para vectores, tuplos e tuplos nomeados
- **Adicionado** Índices negativos (`vec[-1]` = último elemento)
- **Adicionado** Instaladores nativos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Adicionado** Atribuição composta `^=`
- **Corrigido** Casos extremos de aritmética do analisador; correcções de documentação

### v0.0.1 — Lançamento Público Inicial _(22 Mar 2026)_

- Interpretador de árvore + VM de registos (`--vm`, ~4× mais rápido, ~95% paridade)
- Todas as construções principais: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, closures, tratamento de erros
- REPL, LSP, extensão VS Code, formatador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Imutável._
