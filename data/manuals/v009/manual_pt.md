> **Aviso:** Esta documentação foi criada e traduzida por inteligência artificial (IA).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> A referência canônica é **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** no repositório do interpretador.

---

# Manual do Zymbol-Lang

> **Revisado para v0.0.9 — 2026-09-07**

**Zymbol-Lang** é uma linguagem de programação simbólica. Nenhuma palavra em sua gramática — cada construção é um símbolo. Funciona de forma idêntica em qualquer língua humana.

- Sem `if`, `while`, `return` — apenas `?`, `@`, `<~`
- Unicode completo — identificadores em qualquer idioma ou emoji
- Agnóstico à língua humana — o código é o mesmo em todo lugar

**Versão do interpretador**: v0.0.9 | **Cobertura de testes**: 660/666 (três motores concordam, 0 divergem)

---

## Variáveis e Constantes

```zymbol
x = 10              // variável mutável
PI := 3.14159       // constante — reatribuição é erro em tempo de execução
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
x++       // 5
x--       // 4
```

`°` (sinal de grau, U+00B0) inicializa automaticamente uma variável com seu valor neutro no primeiro uso:

```zymbol
numeros = [3, 1, 4, 1, 5]
@ n:numeros {
    °total += n
}
>> total ¶              // → 14
```

> `°var` (prefixo) ancora acima do laço — o resultado é legível após `@`.
> `var°` (sufixo) ancora dentro do laço — morre quando o laço termina.

Uma instrução que é apenas um nome lê a variável e descarta o valor, portanto avisa:

```zymbol
contador = 5
contador
```

O compilador avisa assim (suas mensagens são sempre em inglês):

```text
warning: this statement does nothing: 'contador' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Ou seja: *«esta instrução não faz nada: 'contador' é lido e descartado»*.

---

## Tipos de Dados

| Tipo | Literal | Rótulo `#?` | Notas |
|------|---------|-------------|-------|
| Inteiro | `42`, `-7` | `###` | Inteiro seguro: ±(2⁵³ − 1) |
| Ponto flutuante | `3.14`, `1.5e10` | `##.` | Duplo IEEE-754 |
| String | `"texto"` | `##"` | Interpolação: `"Olá {nome}"` |
| Caractere | `'A'` | `##'` | Um ponto de código Unicode |
| Booleano | `#1`, `#0` | `##?` | NÃO é numérico — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Um único tipo, verificado |
| Mix declarado | `#[1, "dois"]` | `##[` | Mesmo tipo que `[…]`, não verificado |
| Tupla | `(a, b)` | `##)` | Posicional, imutável |
| Dicionário | `#(x: 1, y: 2)` | `##(` | Por chave, mutável |
| Função | referência de função nomeada | `##()` | Primeira classe; exibe `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primeira classe; exibe `<lambd/N>` |
| Unidade | `##_` | `##_` | Ausência — não há null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Um inteiro que sai da faixa segura é um erro capturável, nunca um estouro silencioso:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "fora da faixa" ¶ // → fora da faixa
}
```

`##_` é como um programa pergunta se algo está ausente:

```zymbol
nada() { }
valor = nada()
>> (valor == ##_) ¶     // → #1
```

---

## Saída e Entrada

```zymbol
nome = "Alice"
total = 3
>> "Olá" ¶             // → Olá
>> "a=" nome " b=" total ¶ // → a=Alice b=3
>> total#? ¶            // → (###, 1, 3)
```

```zymbol
<< nome
<< "Digite seu nome: " nome
<< ###(4) "Idade: " idade
```

**Observe a forma dos dois símbolos.** `>>` aponta para fora: tira dados do programa. `<<` aponta para dentro: traz dados para o programa. Não há nada para memorizar aqui — a seta mostra para qual direção a informação viaja, e essa mesma ideia retorna em cada símbolo que move algo.

> `¶` e `\\` são quebras de linha equivalentes. `>>` nunca adiciona uma.
> Um especificador de tipo antes do prompt valida durante a leitura e repete até que o valor seja válido:
> `##.` Ponto flutuante · `##.(T,D)` decimal · `###(N)` Inteiro · `##"(N)` texto · `##'` um Caractere.

No nível superior de um arquivo, `<~` é o status de saída do programa:

```zymbol
>> "verificando" ¶      // → verificando
<~ 0
```

---

## Primitivas TUI

Operadores de interface de terminal para programas interativos. A maioria requer um bloco `>>| { }` (tela alternativa + modo cru).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Executando"
    @~ 1000
    >>~ (2, 1) > "Concluído."
}
```

```zymbol
>>| {
    [linhas, colunas] = >>?
    >>~ (1, 1) > "Terminal: " linhas " x " colunas
    <<| tecla
    >>~ (2, 1) > "Pressionado: " tecla
}
```

Aqui você vê por que os símbolos se combinam em vez de se multiplicarem. Você já sabe que `<<` é entrada e `?` pergunta sem se comprometer. Apenas um símbolo é novo:

- `|` é **uma única unidade**, não todo o fluxo.

Com isso, os dois operadores de teclado se leem sozinhos:

```text
<<        |             ?
entrada   uma unidade   sem comprometer

<<|   pegue UMA tecla, e espere até que haja uma
<<|?  veja se HÁ uma tecla, e continue se não houver
```

O mesmo do outro lado: `>>` envia, `>>!` envia **com força** (limpa a tela inteira), enquanto `>>?` **pergunta** em vez de escrever (qual o tamanho do terminal). O símbolo à direita é o que muda o modo, e ele sempre vem por último.

> `>>!` limpa a tela. `>>?` retorna `(linhas, colunas)`. `@~ N` dorme N milissegundos.
> `<<|` lê uma tecla (bloqueante); `<<|?` consulta sem bloquear (`'\0'` se nenhuma).
> As teclas de seta chegam decodificadas como `'↑' '↓' '←' '→'`; ESC é o ponto de código 27.
> Tupla de saída posicionada: `(linha, coluna, BKS, frente, fundo)` — qualquer slot pode ser omitido com uma vírgula (`>>~ (,,, 196) > "vermelho"`).
> Máscara BKS: `1`=Negrito, `2`=Itálico, `4`=Sublinhado. Paleta ANSI de 256 cores (`0`=padrão do terminal).

---

## Operadores

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisão inteira)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` nunca força: `"5" == 5` é `#0`. A ordenação força: `"5" > 4` é `#1`, e `"४२" > 5` também — texto numérico em qualquer uma das 69 escritas compara como número.
> Uma função é igual apenas a si mesma, nunca a outra função com o mesmo corpo.

---

## Strings

```zymbol
nome = "Alice"
n = 42
>> "Olá " nome " você tem " n ¶ // → Olá Alice você tem 42
descricao = "Olá {nome}, você tem {n}"
>> descricao ¶              // → Olá Alice, você tem 42
```

```zymbol
s = "Olá mundo"
tamanho = s$#                  // 9
sub = s$[1..3]             // "Olá"
contem = s$? "mundo"          // #1
partes = "a,b,c,d"$/ ','    // [a, b, c, d]
substituicao = s$~~["o":"0"]     // "Olá mund0"
linha = "─" $* 20
```

> `+` é apenas para números. Para strings use justaposição ou interpolação.
> `\{` e `\}` são chaves literais — o escape é simétrico.

---

## Fluxo de Controle

```zymbol
x = 7
? x > 100 {
    >> "grande" ¶
} _? x > 0 {
    >> "positivo" ¶     // → positivo
} _ {
    >> "negativo" ¶
}
```

Aqui há dois novos símbolos, e um terceiro que vem de juntá-los:

- `?` é **perguntar**: abre uma condição.
- `_` é **o que não foi especificado**: o ramo deixado quando nenhuma pergunta correspondeu.
- `_?` são os dois em sequência: *se nada correspondeu, pergunte novamente*.

É por isso que `_?` é escrito assim. Não é um novo símbolo para aprender — é `_` seguido de `?`, e significa exatamente o que suas duas partes significam, lidas em ordem.

> As chaves `{ }` são **obrigatórias** mesmo para uma única instrução.

---

## Correspondência (Match)

```zymbol
pontuacao = 85
nota = ?? pontuacao {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> nota ¶              // → B
```

```zymbol
temperatura = -5
estado = ?? temperatura {
    < 0  => "gelo"
    < 20 => "frio"
    _    => "quente"
}
>> estado ¶              // → gelo
```

Você já conhece `?` como "perguntar". **`??` é perguntar várias vezes**: dobrar um símbolo, em qualquer lugar da linguagem, é fazer várias vezes o que o símbolo faz uma vez. Um `?` testa uma condição; `??` testa contra uma lista de casos.

Alternativas se juntam com `||`, e podem misturar tipos de padrões:

```zymbol
tecla = 'P'
acao = ?? tecla {
    'p' || 'P' => "pausar"
    < 0 || > 100 => "fora da faixa"
    _ => "ignorado"
}
>> acao ¶             // → pausar
```

---

## Laços

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
frutas = ["maçã", "pera", "uva"]
@ f:frutas { >> f " " }
>> ¶                    // → maçã pera uva
@ c:"Olá" { >> c "-" }
>> ¶                    // → O-l-á-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
contador = 0
@:externo {
    contador++
    ? contador >= 3 { @:externo! }
}
>> contador ¶             // → 3
```

`@` é o símbolo do **tempo**: tudo o que se repete vive nele. Para cortar esse tempo você adiciona um símbolo ao lado:

- `@!` — `!` é a **força**: saia do laço agora.
- `@>` — `>` empurra para frente: vá para a próxima volta.
- `@:externo!` — `:` **liga um nome**, então isso corta o laço *chamado* externo, não o mais próximo.

Três operadores, e nenhum precisou ser memorizado separadamente: são `@` mais um símbolo que já diz o que faz.

> **Um especificador é uma contagem ou uma condição.** Um `Inteiro` é uma contagem, avaliada uma vez — `@ 0` executa o corpo zero vezes. Qualquer outra coisa é uma condição. Não há veracidade: `@ []` e `@ 3.5` são recusados. Para percorrer uma coleção use `@ x:itens`; para contá-la, `@ itens$#`.

---

## Funções

```zymbol
somar(a, b) { <~ a + b }
>> somar(3, 4) ¶        // → 7
```

```zymbol
fatorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fatorial(n - 1)
}
>> fatorial(5) ¶       // → 120
```

Uma função lê as variáveis do arquivo por valor, e uma escrita dentro permanece dentro:

```zymbol
limite = 100
dentro(n) { <~ n < limite }
>> dentro(42) ¶         // → #1
```

Dois símbolos mudam isso, e ambos são escritos **na assinatura e no local de chamada**:

```zymbol
incrementar(contador<~) { contador = contador + 1 }
total = 0
incrementar(total<~)
>> total ¶              // → 1
```

> `p~` é uma cópia de trabalho — o corpo pode reatribuí-la e o chamador permanece intacto.
> `p<~` é um parâmetro de saída — a mudança viaja de volta. `incrementar(total)` sem o símbolo é um erro semântico: a anotação e a assinatura não podem se separar.

---

## Lambdas e Clausuras

```zymbol
dobro = x -> x * 2
soma = (a, b) -> a + b
>> dobro(5) ¶          // → 10
>> soma(3, 7) ¶          // → 10
```

```zymbol
classificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}
>> classificar(-4) ¶         // → negativo
```

```zymbol
fator = 3
triplo = x -> x * fator
>> triplo(7) ¶          // → 21
```

```zymbol
criar_somador(n) { <~ x -> x + n }
somar10 = criar_somador(10)
>> somar10(5) ¶           // → 15
```

Um lambda pode não receber nenhum parâmetro:

```zymbol
resposta = () -> 42
>> resposta() ¶           // → 42
```

> Um lambda captura as variáveis do arquivo **quando é criado**; uma função nomeada as lê **quando é chamada**.

---

## Arrays

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   indexação é 1-baseada
>> arr[-1] ¶      // → 5   negativo conta a partir do final
>> arr$# ¶        // → 5   tamanho
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   anexar
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  inserir na posição 2
>> (arr$- 3) ¶          // → [1, 2]         remover primeira ocorrência
>> (arr$-[1]) ¶         // → [2, 3]         remover no índice 1
>> (arr$[1..2]) ¶       // → [1, 2]         fatia, ambas as extremidades incluídas
>> (arr$? 3) ¶          // → #1             contém
```

Todos começam com `$`, o símbolo de **coleção**, e continuam com um símbolo dizendo o que é feito nela: `#` quantos, `+` adicionar, `-` remover, `?` perguntar se está presente. E como com `??`, dobrar o símbolo significa fazê-lo exaustivamente: `$?` pergunta *se* um valor está presente, `$??` pergunta *em quantos lugares* e retorna todos.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   crescente
>> (arr$^-) ¶     // → [3, 2, 1]   decrescente
```

**A regra do resultado.** Um único operador, e o que o código ao redor faz com ele decide: usado, ele **constrói** e deixa o original intacto; descartado, ele **modifica**.

```zymbol
arr = [1, 2, 3]
copia = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> copia ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` nunca escreve em uma coleção.** `arr[2] = 99` não é uma forma de Zymbol — `=` dá um valor a um NOME. Mudar parte de uma coleção é `$~`, em toda coleção.

`[…]` contém um único tipo e é verificado; uma mistura deliberada é **declarada** com `#[…]`:

```zymbol
mistura = #[1, "dois", #1]
>> mistura ¶             // → [1, dois, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indexação Multidimensional

`>` desce por uma estrutura aninhada. Um grupo de colchetes endereça um elemento, por mais profundo que seja.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   linha 2, coluna 3
>> m[-1>-1] ¶      // → 9   última linha, última coluna
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          plano: a diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   estruturado: os cantos
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **não** é uma forma de Zymbol. O índice encadeado é recusado tanto para leitura quanto para escrita — um grupo de colchetes por acesso, e `>` é o que vai entre os passos.

---

## Dicionários

Uma tupla com campos nomeados é um dicionário, e desde v0.0.9 é escrito `#(…)`.

```zymbol
pessoa = #(nome: "Alice", idade: 25)
>> pessoa.nome ¶        // → Alice
>> pessoa["idade"] ¶    // → 25
```

```zymbol
pessoa = #(nome: "Alice", idade: 25)
campo = "nome"
>> pessoa[campo] ¶     // → Alice
```

É mutável, chaves podem ser adicionadas e pode ser percorrido:

```zymbol
estoque = #(pera: 4)
estoque["maçã"]$~ 10
@ k:estoque { >> k "=" estoque[k] " " }
>> ¶                    // → pera=4 maçã=10
```

```zymbol
estoque = #(pera: 4, maçã: 10)
@ (k, v):estoque { >> k ":" v " " }
>> ¶                    // → pera:4 maçã:10
```

> `#()` é o dicionário vazio, o que `()` não poderia ser — teria que ser também a tupla vazia. O `(x: 1)` nu é recusado com esta mensagem: *a dictionary is written `#(…)`* — «um dicionário é escrito `#(…)`».
> Um dicionário é endereçado por chave, nunca por posição, portanto `pessoa[1]` é um erro.

---

## Tuplas

Tuplas são contêineres ordenados **imutáveis** que armazenam valores de tipos diferentes.

```zymbol
ponto = (10, 20)
>> ponto[1] ¶           // → 10
dados = (42, "Olá", #1, 3.14)
>> dados[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Qualquer tentativa de modificar uma tupla no lugar é um erro, seja qual for o operador — imutabilidade é uma propriedade do valor, não uma exceção dentro de cada `$`.

---

## Desestruturação

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[primeiro, *resto] = arr
>> primeiro ¶            // → 10
>> resto ¶              // → [20, 30, 40, 50]
```

```zymbol
ponto = (100, 200)
(px, py) = ponto
>> px " " py ¶          // → 100 200
```

```zymbol
pessoa = #(nome: "Ana", idade: 25)
#(nome: n, idade: i) = pessoa
>> n " " i ¶            // → Ana 25
```

> O formato do colchete é tipado: `[…]` pega um array, `(…)` uma tupla, `#(…)` um dicionário. O último nome **absorve o restante**, então a desestruturação nunca falha por comprimento — `(a, b, c) = (1,2,3,4,5)` dá `c = (3,4,5)`, e `##_` quando não sobra nada.

---

## Funções de Ordem Superior

```zymbol
numeros = [1, 2, 3, 4, 5]
>> (numeros$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (numeros$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (numeros$< (0, (acc, x) -> acc + x)) ¶ // → 15
```

```zymbol
numeros = [1, 2, 3, 4, 5, 6]
dobro(x) { <~ x * 2 }
e_grande(x) { <~ x > 3 }
>> (numeros$> dobro) ¶    // → [2, 4, 6, 8, 10, 12]
>> (numeros$| e_grande) ¶    // → [4, 5, 6]
```

```zymbol
base = [#(nome: "Carla", idade: 28), #(nome: "Ana", idade: 25)]
por_idade = base$^ (a, b -> a.idade < b.idade)
>> por_idade[1].nome ¶     // → Ana
```

> Uma função nomeada vai para uma HOF **sem parênteses**: `numeros$> dobro`. Escrever `numeros$> (dobro)` é um erro de sintaxe, pois `(` abre um lambda.

---

## Operador Pipe

```zymbol
dobro = x -> x * 2
somar = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> dobro(_)) ¶    // → 10
>> (10 |> somar(_, 5)) ¶  // → 15
>> (5 |> dobro(_) |> inc(_)) ¶ // → 11
```

---

## Tratamento de Erros

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisão por zero" ¶  // → divisão por zero
} :! {
    >> "outro: " _err ¶
} :> {
    >> "sempre executado" ¶        // → sempre executado
}
```

| Tipo | Quando |
|------|--------|
| `##Div` | Divisão por zero |
| `##Index` | Índice fora dos limites |
| `##Key` | Chave ausente em um dicionário |
| `##Range` | Fora da faixa segura de inteiros |
| `##Type` | Incompatibilidade de tipo |
| `##Parse` | Análise de dados |
| `##IO` | Arquivo / sistema |
| `##Network` | Erros de rede |
| `##DB` | Banco de dados |
| `##Time` | Uma data que não existe |
| `##_` | Qualquer erro (pega-tudo) |

`!` é o símbolo do **erro e da força**, e é lido da mesma forma nas duas famílias: `$!` pergunta a um valor se ele é um erro; `$!!`, com o símbolo dobrado, propaga-o para cima sem perguntar.

> As falhas da biblioteca padrão retornam como **valores de erro suaves** que você testa com `$!` ou captura com `!?`, em vez de abortar. `$!!` propaga um para o chamador.

---

## Módulos

```zymbol
# calc {
    #> { somar, PI }

    PI := 3.14159
    somar(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::somar(5, 3) ¶
>> c.PI ¶
```

```zymbol
# minhabib {
    #> { soma_interna => soma }

    soma_interna(a, b) { <~ a + b }
}
```

Os dois símbolos de módulo são a mesma ideia, agora aplicada a arquivos: `#` é o nível de **declaração** — o que uma coisa *é*, não seu valor — e a seta diz para qual direção o código viaja:

```text
<#   a seta entra: importar, trazer de outro arquivo
#>   a seta sai: exportar, oferecer a outros arquivos
```

Um símbolo de direção sempre fica na borda voltada para a direção que aponta. É a mesma razão pela qual `<~` retorna para a esquerda (para fora da função) e `->` entra para a direita (para o corpo do lambda).

> **Um módulo declara o que exporta.** O bloco `#>` é obrigatório — omiti-lo é **E014**, e `#> { }` é como um módulo diz que sua superfície está vazia. `::` chama uma função, `.` lê uma constante. Apenas importações, o bloco de exportação, inicializadores literais e definições de função podem aparecer no corpo de um módulo; qualquer coisa executável é **E013**.

---

## Biblioteca Padrão

Módulos nativos, importados como qualquer outro:

| Módulo | Funções |
|--------|---------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   dois glifos, quatro colunas
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

dia = T::of(2026, 1, 31)
>> T::format(dia, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(dia, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` mede **colunas de exibição**, não caracteres: CJK e a maioria dos emojis têm 2 colunas, portanto monte uma tabela com `t::width`, nunca `$#`.
> Em `std/time`, um instante é em milissegundos desde a época. Abaixo de um dia é duração, a partir de um dia é calendário — então um mês cai no mesmo dia do mês, ajustado. `diff(a, b)` é `a - b`, então o instante anterior primeiro dá uma resposta negativa.

---

## Pacotes

Um `.zyp` empacota um programa com vários arquivos em um único arquivo portátil. É um arquivo de **código-fonte**, não um binário, portanto roda em qualquer lugar onde um binário `zymbol` rode.

```bash
zymbol package meuprojeto/ --script main.zy -o meuprojeto.zyp
zymbol run meuprojeto.zyp
```

> O arquivo carrega um manifesto (`zyp.toml`) declarando seus scripts de entrada e a versão do motor de que precisa. `zymbol run` o extrai para um diretório temporário e executa a partir de lá, então o código é descartável enquanto o que o script escreve cai no seu diretório de trabalho real. O playground também carrega arquivos `.zyp`.

---

## Modos Numéricos

Zymbol pode escrever números em **69 escritas numéricas Unicode** — devanágari, árabe-índica, tailandesa, pIqaD klingon, negrito matemático, segmentos LCD e mais. O modo é global para o processo e afeta a saída; a aritmética permanece inalterada.

```zymbol
#०९#    // devanágari   (U+0966–U+096F)
#٠٩#    // árabe-índica (U+0660–U+0669)
#๐๙#    // tailandesa   (U+0E50–U+0E59)
#09#    // reset para ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Dígitos de qualquer escrita suportada são literais válidos no código-fonte:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

A leitura é simétrica — um dígito é entendido em qualquer escrita:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` é sempre ASCII, então `#0` permanece visualmente distinto do dígito zero em cada escrita.
> `#,` e `#^` também escrevem seus dígitos na escrita ativa, e os separadores a seguem — mas o par nunca se inverte: `,` agrupa e `.` divide, em toda escrita.

---

## Operadores de Dados

```zymbol
f = ##.42         // para Ponto flutuante
i = ###3.7        // para Inteiro, arredondado  → 4
t = ##!3.7        // para Inteiro, truncado  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Um Ponto flutuante é impresso como dígitos, nunca como expoente, e elimina o `.0` final — `##.42` escreve `42` e ainda é um Ponto flutuante, como `f#?` mostra.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   à prova de falhas: retorna a entrada inalterada
>> ##!'A' ¶        // → 65    o ponto de código de um Caractere
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          arredondar para 2 casas decimais
>> #!2|pi| ¶       // → 3.14          truncar para 2 casas decimais
>> #,|1234567| ¶   // → 1,234,567     separadores de milhares
>> #^|12345.678| ¶ // → 1.2345678e4   notação científica
```

```zymbol
>> 0x41 ¶        // → A   hexadecimal
>> 0b01000001 ¶  // → A   binário
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   decimal
```

> Um literal de base na faixa ASCII é um **caractere**: `0d65 == 'A'` é `#1`, e `0d65 == 65` é `#0`. As quatro bases soletram o mesmo caractere.

---

## Integração com o Shell

```zymbol
hoje = <\ date +%Y-%m-%d \>
>> "Hoje: " hoje
```

```zymbol
saida = </"./sub_script.zy"/>
>> saida
```

> `<\ … \>` captura stdout e stderr, removendo a quebra de linha final.
> `>< args` captura os argumentos da linha de comando como um array de strings.

---

## Exemplo Completo: FizzBuzz

```zymbol
classificar(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    <~ numero
}

@ i:1..20 { >> classificar(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (um por linha)
```

---

## Como os Símbolos se Combinam

Você tem visto a mesma coisa ao longo deste manual: **um operador não é um desenho para memorizar, são vários símbolos em sequência, e cada um contribui com seu significado.** Agora que você conhece todos eles, aqui está o padrão completo.

Primeiro vem **em que mundo estamos**:

| Símbolo | Mundo | Você o viu em |
|---------|-------|---------------|
| `$` | uma coleção | `$#` `$+` `$?` `$^-` |
| `@` | o tempo, tudo o que se repete | `@!` `@>` `@~` |
| `#` | o que algo *é*, não seu valor | `#?` `#(…)` `<#` `#>` |
| `>>` | para fora do programa | `>>` `>>!` `>>?` |
| `<<` | para dentro do programa | `<<` `<<\|` `<<\|?` |
| `?` | perguntar, sem comprometer | `?` `_?` `??` `$?` |
| `!` | força, ou erro | `@!` `$!` `!?` |

Depois vem **o que é feito ali**: `+` adicionar, `-` remover, `^` ordenar, `~` modificar, `#` contar, `|` uma única unidade, `:` ligar um nome.

E duas regras que nunca falham:

**Dobrar um símbolo o torna exaustivo.** `?` pergunta uma vez, `??` testa vários casos. `$?` pergunta se um valor está presente, `$??` retorna todos os lugares onde está. `!` sinaliza um erro, `!!` propaga sem perguntar.

**O símbolo de modo sempre vem por último.** Quando `?` ou `!` aparecem para dizer *como* algo é feito — de forma hesitante ou forçada — eles são o símbolo final do operador: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:externo!`. Nunca há uma operação depois deles.

Algo prático decorre disso: **uma combinação que você nunca viu já faz sentido antes de você procurá-la.** Se `$` é coleção e `^` é ordem e `-` é reverso, então `$^-` ordena decrescentemente, e ninguém precisou lhe dizer.

Nem todo o inventário funciona assim, e dizê-lo é melhor do que fingir. A maioria dos operadores se decompõe de forma limpa. Seis se decompõem mas significam mais do que suas partes: `!?` `:!` `:>` `|>` `::` `$++`. E dez precisam ser decorados porque não se decompõem de forma alguma: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Contar os opacos em vez de assumir que são poucos é intencional: eles são o custo real de memorização da linguagem. A referência completa — o inventário, os homógrafos declarados e as regras que um novo operador deve satisfazer para existir — está em `SYMBOLS.md`, no repositório do interpretador.

---

## Referência de Símbolos

| Símbolo | Operação | Símbolo | Operação |
|---------|----------|---------|----------|
| `=` | variável | `$#` | tamanho |
| `:=` | constante | `$+` | anexar |
| `>>` | saída | `$+[i]` | inserir no índice (1‑baseado) |
| `<<` | entrada | `$-` | remover o primeiro por valor |
| `¶` / `\\` | nova linha | `$--` | remover todos por valor |
| `?` | se | `$-[i]` | remover no índice (1‑baseado) |
| `_?` | senão‑se | `$-[i..j]` | remover faixa (1‑baseado) |
| `_` | senão / curinga | `$?` | contém |
| `??` | correspondência | `$??` | encontrar todos os índices (1‑baseado) |
| `\|\|` | ou‑padrão em um ramo de match | `$[s..e]` | fatia (1‑baseado) |
| `@` | laço | `$>` | mapear |
| `@ N { }` | laço N vezes | `$\|` | filtrar |
| `@!` | quebrar | `$<` | reduzir |
| `@>` | continuar | `$/ delimitador` | dividir string |
| `@:nome { }` | laço rotulado | `$++ a b c` | construir por concatenação |
| `@:nome!` | quebrar rótulo | `$~~[p:r]` | substituir string |
| `@:nome>` | continuar rótulo | `$*` | repetir string |
| `->` | lambda | `arr[i]$~ v` | A forma de atualização |
| `<~` | retornar / parâmetro de saída | `~` | parâmetro de cópia de trabalho |
| `arr[i>j]` | índice de navegação | `arr[p ; q]` | extração plana |
| `$^+` | ordenar crescente | `$^-` | ordenar decrescente |
| `$^` | ordenar com comparador | `\|>` | pipe |
| `!?` | tentar | `:!` | capturar |
| `:>` | finalmente | `$!` | é erro |
| `$!!` | propagar erro | `#1` / `#0` | verdadeiro / falso |
| `##_` | Unidade — ausência | `[…]` | array, um tipo |
| `#[…]` | array, mix declarado | `#(…)` | dicionário |
| `(…)` | tupla posicional | `#()` | dicionário vazio |
| `<#` | importar | `#>` | exportar |
| `#` | declarar módulo | `::` | chamar módulo |
| `.` | acesso a campo / constante | `#?` | metadados de tipo |
| `#\|..\|` | analisar número | `##.` | converter para Ponto flutuante |
| `###` | converter para Inteiro (arredondar) | `##!` | converter para Inteiro (truncar) |
| `#.N\|..\|` | arredondar | `#!N\|..\|` | truncar |
| `#,\|..\|` | separadores de milhares | `#^\|..\|` | científica |
| `#d0d9#` | alternar modo numérico | `#09#` | reset para ASCII |
| `<\ ..\>` | executar shell | `><` | argumentos CLI |
| `\ var` | destruir variável | `°x` / `x°` | definição quente |
| `>>\|` | bloco TUI (tela alternativa) | `>>~` | saída posicionada |
| `>>!` | limpar tela | `>>?` | consultar tamanho do terminal |
| `<<\|` | tecla bloqueante | `<<\|?` | tecla não bloqueante |
| `@~ N` | dormir N milissegundos | `0d` `0x` `0o` `0b` | literais de base |

---

## Registro de Alterações

### v0.0.9 — As Coleções Decidem _(setembro de 2026)_

- **Quebra** O dicionário tem sua própria notação: `#(chave: valor)`. A forma nua `(x: 1)` é recusada, e `#()` é o dicionário vazio — o que `()` nunca poderia ser
- **Quebra** Atribuição indexada removida: `arr[i] = v` e todas as formas compostas. `=` dá um valor a um NOME; mudar parte de uma coleção é `$~`
- **Quebra** O índice encadeado `m[i][j]` é recusado tanto para leitura quanto para escrita — `>` é o que vai entre os passos
- **Quebra** Um módulo deve declarar o que exporta (**E014**); `#> { }` é como um módulo diz que sua superfície está vazia
- **Quebra** Um especificador de laço é uma contagem ou uma condição — sem veracidade. `@ []` e `@ 3.5` são recusados
- **Adicionado** `##_` — o literal Unidade, e como um programa pergunta se algo está ausente
- **Adicionado** `#[…]` — um array cuja mistura de tipos de elementos é declarada
- **Adicionado** `#?` distingue as quatro coleções: `##]` `##[` `##)` `##(`
- **Adicionado** `std/time` — o relógio e o calendário civil, com fusos horários e aritmética de calendário
- **Adicionado** Um `<~>` no nível superior é o status de saída do programa
- **Adicionado** `@ (k, v):pares` — um padrão no cabeçalho do laço
- **Adicionado** `#|c|` lê um dígito em qualquer uma das 69 escritas; `#,` e `#^` escrevem na ativa
- **Alterado** `Inteiro` é um inteiro seguro, ±(2⁵³ − 1), fechado em caso de falha em todos os motores
- **Alterado** Uma função nomeada lê as variáveis do arquivo no momento da chamada, por valor
- **Alterado** Uma instrução que apenas lê um nome avisa em vez de passar silenciosamente
- **Motores** 660 dos 666 arquivos do corpus concordam nos três motores, 0 divergem

### v0.0.8 — Auto‑liberação, `std/term` e Pacotes _(agosto de 2026)_

- **Adicionado** Destruição automática no último uso — invisível; apenas reduz o pico de memória
- **Adicionado** `std/term` — métricas de exibição em colunas de terminal
- **Adicionado** `##!` em um `Caractere` — seu ponto de código Unicode
- **Adicionado** Padrões ou em match: `'p' || 'P' => …`, alternativas de qualquer tipo em um ramo
- **Adicionado** Pacotes Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Adicionado** `<~>` no local de chamada é obrigatório onde o callee declara um parâmetro de saída
- **Corrigido** Paridade do sistema de módulos na VM de registros

### v0.0.7 — Biblioteca Padrão Nativa _(julho de 2026)_

- **Adicionado** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — todos com valores de erro suaves
- **Adicionado** Entrada tipada/validada: `<< ##.(5,2) "preço: " p`
- **Adicionado** Operadores pós‑fixados diretamente em `>>` — sem parênteses necessários
- **Alterado** Formatador fechado em caso de falha: recusa‑se a escrever saída que não possa reler

### v0.0.6 — Refinamento e Biblioteca Científica _(junho de 2026)_

- **Quebra** `=>` substitui `:` em ramos de match e `<=` em aliases de importação/exportação
- **Adicionado** `std/math` e `std/random`
- **Adicionado** Atualização de dicionário por chave: `d["k"]$~ valor`

### v0.0.5 — Primitivas TUI e Definição Quente _(maio de 2026)_

- **Adicionado** Bloco TUI `>>| { }`, saída posicionada `>>~`, entrada de teclas `<<|` e `<<|?`
- **Adicionado** `>>!` limpar tela, `>>?` tamanho do terminal, `@~ N` dormir
- **Adicionado** Definição quente `°x` / `x°`, e repetição de string `$*`

### v0.0.4 — Indexação 1‑baseada e Funções de Primeira Classe _(abril de 2026)_

- **Quebra** Toda indexação é **1‑baseada** — `arr[1]` é o primeiro elemento
- **Adicionado** Funções nomeadas como valores de primeira classe; sintaxe de bloco de módulo `# nome { }`
- **Adicionado** Indexação multidimensional `arr[i>j>k]` e extração plana `arr[p ; q]`

### v0.0.3 — Sistemas Numéricos Unicode _(abril de 2026)_

- **Adicionado** 69 blocos de dígitos Unicode com o token de alternância de modo `#d0d9#`
- **Adicionado** Literais booleanos em qualquer escrita — `#१` / `#०`

### v0.0.2 — Redesenho da API de Coleções _(março de 2026)_

- **Adicionado** A família de operadores `$` para arrays e strings
- **Adicionado** Desestruturação, e índices negativos

### v0.0.1 — Primeira Versão Pública _(março de 2026)_

- Interpretador de árvore + VM de registros (`--vm`)
- Todas as construções principais: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, clausuras, tratamento de erros
- REPL, LSP, extensão do VS Code, formatador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Imutável._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licença:** este manual está licenciado sob [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Texto completo: `LICENSE-CC-BY-SA-4.0` em <https://github.com/zymbol-lang/web>. O interpretador e o motor para navegador (`zymbol.js`) são obras separadas, licenciadas sob AGPL-3.0-only.
