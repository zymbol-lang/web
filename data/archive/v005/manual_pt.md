> **Aviso:** Esta documentação foi criada com assistência de inteligência artificial (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> A referência canônica é **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** no repositório do interpretador.

---

# Manual de Zymbol-Lang

> **Revisado para v0.0.5 — 2026-05-12**

**Zymbol-Lang** é uma linguagem de programação simbólica. Sem palavras-chave — tudo é um símbolo. Funciona de forma idêntica em qualquer língua humana.

- Sem `if`, `while`, `return` — apenas `?`, `@`, `<~`
- Unicode completo — identificadores em qualquer idioma ou emoji
- Independente de idioma — o código é igual em todo lugar

**Versão do interpretador**: v0.0.5 | **Cobertura de testes**: 436/436 (TW ↔ VM paridade)

---

## Variáveis & Constantes

```zymbol
x = 10              // variável mutável
PI := 3.14159       // constante — reatribuição é um erro em tempo de execução
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

`°` (símbolo de grau, U+00B0) auto-inicializa uma variável ao seu valor neutro no primeiro uso:

```zymbol
numeros = [3, 1, 4, 1, 5]
@ n:numeros {
    °total += n    // auto-init para 0 acima do laço; sobrevive após @
}
>> total ¶         // → 14
```

> `°x` (prefixo) ancora acima do laço — resultado acessível após `@`.
> `x°` (sufixo) ancora dentro do laço — desaparece quando o laço termina.
> Apenas Tree-Walker.

---

## Tipos de Dados

| Tipo | Literal | `#?` tag | Observações |
|------|---------|----------|-------------|
| Inteiro | `42`, `-7` | `###` | 64-bit com sinal |
| Decimal | `3.14`, `1.5e10` | `##.` | Notação científica OK |
| Texto | `"texto"` | `##"` | Interpolação: `"Olá {nome}"` |
| Caractere | `'A'` | `##'` | Único caractere Unicode |
| Booleano | `#1`, `#0` | `##?` | NÃO numérico — `#1 ≠ 1` |
| Vetor | `[1, 2, 3]` | `##]` | Elementos homogêneos |
| Tupla | `(a, b)` | `##)` | Posicional |
| Tupla Nomeada | `(x: 1, y: 2)` | `##)` | Campos nomeados |
| Função | ref. a função nomeada | `##()` | Primeira classe; mostra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primeira classe; mostra `<lambd/N>` |

```zymbol
// Introspecção de tipo — retorna (tipo, dígitos, valor)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Saída & Entrada

```zymbol
>> "Olá" ¶                        // ¶ ou \\ para nova linha explícita
>> "a=" a " b=" b ¶               // justaposição — múltiplos valores
>> (vet$#) ¶                      // operadores pós-fixos requerem ( ) em >>

<< nome                           // leia para variável (sem prompt)
<< "Digite o nome: " nome         // com prompt
```

> `¶` (AltGr+R no teclado espanhol) e `\\` são novas linhas equivalentes.

---

## Primitivas TUI

Operadores de interface de terminal para programas interativos. A maioria requer um bloco `>>| { }` (tela alternativa + modo raw).

```zymbol
>>| {
    >>!                              // limpar tela alternativa
    >>~ (1, 1, 0, 10) > "Executando"  // linha 1, col 1, fg=10 (verde)
    @~ 1000                          // pausa 1 segundo (1000 ms)
    >>~ (2, 1) > "Pronto."
}
// terminal restaurado automaticamente ao sair
```

```zymbol
// Tecla pressionada e tamanho do terminal
>>| {
    [linhas, colunas] = >>?          // consultar dimensões do terminal
    >>~ (1, 1) > "Terminal: " linhas " x " colunas
    <<| tecla                        // leitura de tecla bloqueante
    >>~ (2, 1) > "Pressionado: " tecla
}
```

> `>>!` limpa tela. `>>?` retorna `[linhas, colunas]`. `@~ N` dorme N milissegundos.
> `<<|` lê uma tecla (bloqueante); `<<|?` sonda sem bloquear (retorna `'\0'` se nenhuma).
> Tupla de saída posicionada: `(linha, coluna, BKS, fg, bg)` — qualquer slot pode ser omitido com vírgula (`>>~ (,,, 196) > "vermelho"`).
> Máscara BKS: `1`=Negrito, `2`=Itálico, `4`=Sublinhado. Paleta ANSI 256 cores (`0`=padrão do terminal).
> Apenas Tree-Walker (exceto `>>!`, `>>?`, `@~`, `>>~` que também funcionam em `--vm`).

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

// Comparação — atribuir para inspecionar
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lógica
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Textos

```zymbol
// Duas formas de concatenação
nome = "Alice"
n = 42

>> "Olá " nome " você tem " n ¶      // justaposição — em >>
descr = "Olá {nome}, você tem {n}"   // interpolação — em qualquer lugar
```

```zymbol
s = "Olá Mundo"
tam = s$#                   // 11
sub = s$[1..3]              // "Olá"  (1-based, fim inclusivo)
tem = s$? "Mundo"           // #1
partes = "a,b,c,d"$/ ','    // [a, b, c, d]  (dividir por delimitador)
sub2 = s$~~["o":"0"]        // "0lá Mund0"
sub3 = s$~~["o":"0":1]      // "0lá Mundo"  (apenas os primeiros N)
linha = "─" $* 20           // "────────────────────"  (repetir N vezes)
```

> `+` é apenas para números. Use `,`, justaposição ou interpolação para textos.

---

## Fluxo de Controle

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

> As chaves `{ }` são **obrigatórias** mesmo para uma única instrução.

---

## Correspondência

```zymbol
// Intervalos
pontuacao = 85
nota = ?? pontuacao {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> nota ¶    // → B

// Textos
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

// Forma de instrução (braços em bloco)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negativo" ¶ }
    _    => { >> "positivo" ¶ }
}
```

---

## Laços

```zymbol
@ i:0..4  { >> i " " }        // intervalo inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // com passo:            1 3 5 7 9
@ i:5..0:1 { >> i " " }       // reverso:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frutas = ["maçã", "pera", "uva"]
@ f:frutas { >> f ¶ }         // para cada elemento do vetor

@ c:"ola" { >> c "-" }
>> ¶                          // → o-l-a-  (para cada caractere)

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

// Laço rotulado (parada aninhada)
contador = 0
@:externo {
    contador++
    ? contador >= 3 { @:externo! }
}
>> contador ¶                 // → 3
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

> Funções nomeadas são **valores de primeira classe** — passe diretamente: `numeros$> dobrar`. Para encapsular: `x -> fn(x)` também é válido.

---

## Lambdas & Closures

```zymbol
dobrar = x -> x * 2
somar = (a, b) -> a + b
>> dobrar(5) ¶    // → 10
>> somar(3, 7) ¶  // → 10

// Lambda em bloco
classificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}

// Closure — captura escopo externo
fator = 3
triplicar = x -> x * fator
>> triplicar(7) ¶    // → 21

// Fábrica
criar_somador(n) { <~ x -> x + n }
somar10 = criar_somador(10)
>> somar10(5) ¶    // → 15

// Em vetores
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Vetores

Vetores são **mutáveis** e contêm elementos do **mesmo tipo**.

```zymbol
vet = [1, 2, 3, 4, 5]

x = vet[1]      // 1 — acesso (1-based: primeiro elemento)
x = vet[-1]     // 5 — índice negativo (último elemento)
x = vet$#       // 5 — tamanho (use (vet$#) em >>)

vet = vet$+ 6            // adicionar → [1,2,3,4,5,6]
vet2 = vet$+[2] 99       // inserir na posição 2 (1-based)
vet3 = vet$- 3           // remover primeira ocorrência do valor
vet4 = vet$-- 3          // remover todas as ocorrências
vet5 = vet$-[1]          // remover no índice 1 (primeiro elemento)
vet6 = vet$-[2..3]       // remover intervalo (1-based, fim inclusivo)

tem = vet$? 3            // #1 — contém
pos = vet$?? 3           // [3] — todos os índices do valor (1-based)
sl = vet$[1..3]          // [1,2,3] — fatia (1-based, fim inclusivo)
sl2 = vet$[1:3]          // [1,2,3] — mesmo, sintaxe baseada em contagem

asc = vet$^+             // ordenado crescente  (apenas primitivos)
desc = vet$^-            // ordenado decrescente (apenas primitivos)

// Vetores de tuplas nomeadas/posicionais — use $^ com lambda comparadora
db = [(nome: "Carla", idade: 28), (nome: "Ana", idade: 25), (nome: "Bob", idade: 30)]
por_idade = db$^ (a, b -> a.idade < b.idade)    // crescente por idade  (<)
por_nome  = db$^ (a, b -> a.nome > b.nome)      // decrescente por nome (>)
>> por_idade[1].nome ¶     // → Ana
>> por_nome[1].nome ¶      // → Carla

// Atualização direta de elemento (apenas vetores)
vet[1] = 99              // atribuir
vet[2] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Atualização funcional — retorna novo vetor; original inalterado
vet2 = vet[2]$~ 99
```

> Todos os operadores de coleção retornam um **novo vetor**. Reatribuir: `vet = vet$+ 4`.
> `$+` pode ser encadeado: `vet = vet$+ 5$+ 6$+ 7`. Outros operadores usam atribuições intermediárias.
> **Indexação é 1-based**: `vet[1]` é o primeiro elemento; `vet[0]` é um erro em tempo de execução.
> `$^+` / `$^-` ordenam **vetores primitivos** (números, textos). Para vetores de tuplas use `$^` com lambda comparadora — a direção é codificada na lambda (`<` = crescente, `>` = decrescente).

**Semântica de valor** — atribuir um vetor a outra variável cria uma cópia independente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b não é afetado
```

```zymbol
// Vetores aninhados (indexação 1-based)
matriz = [[1,2,3],[4,5,6],[7,8,9]]
>> matriz[2][3] ¶    // → 6  (linha 2, coluna 3)
```

---

## Desestruturação

```zymbol
// Vetor
vet = [10, 20, 30, 40, 50]
[a, b, c] = vet              // a=10  b=20  c=30
[primeiro, *resto] = vet     // primeiro=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarta

// Tupla posicional
ponto = (100, 200)
(px, py) = ponto             // px=100  py=200

// Tupla nomeada
pessoa = (nome: "Ana", idade: 25, cidade: "São Paulo")
(nome: n, idade: i) = pessoa // n="Ana"  i=25
```

---

## Tuplas

Tuplas são **contêineres ordenados imutáveis** que podem conter valores de **tipos diferentes**.
Ao contrário de vetores, elementos não podem ser alterados após a criação.

```zymbol
// Posicional — tipos mistos permitidos
ponto = (10, 20)
>> ponto[1] ¶    // → 10

dados = (42, "olá", #1, 3.14)
>> dados[3] ¶    // → #1

// Nomeada
pessoa = (nome: "Alice", idade: 25)
>> pessoa.nome ¶    // → Alice
>> pessoa[1] ¶      // → Alice  (índice também funciona, 1-based)

// Aninhada
pos = (x: 10, y: 20)
p = (pos: pos, rotulo: "origem")
>> p.pos.x ¶        // → 10
```

**Imutabilidade** — qualquer tentativa de modificar um elemento de tupla é um erro em tempo de execução:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erro em tempo de execução: tuplas são imutáveis
// t[1] += 5    // ❌ mesmo erro
```

Para derivar um valor modificado use `$~` (atualização funcional) — retorna uma **nova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original inalterado
>> t2 ¶    // → (10, 999, 30)

// Tupla nomeada — reconstruir explicitamente
pessoa = (nome: "Alice", idade: 25)
mais_velha  = (nome: pessoa.nome, idade: 26)
>> pessoa.idade ¶      // → 25
>> mais_velha.idade ¶  // → 26
```

---

## Funções de Ordem Superior

```zymbol
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dobrados  = numeros$> (x -> x * 2)               // map  → [2,4,6…20]
pares     = numeros$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
total     = numeros$< (0, (acc, x) -> acc + x)    // reduce → 55

// Encadear via intermediários
passo1 = numeros$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funções nomeadas podem ser passadas diretamente para HOF
dobrar(x) { <~ x * 2 }
e_grande(x) { <~ x > 5 }
r = numeros$> dobrar     // ✅ referência direta
r = numeros$| e_grande   // ✅ referência direta
```

---

## Operador Pipe

O lado direito sempre requer `_` como marcador de posição para o valor canalizado:

```zymbol
dobrar = x -> x * 2
somar = (a, b) -> a + b
incrementar = x -> x + 1

r1 = 5 |> dobrar(_)              // → 10
r2 = 10 |> somar(_, 5)           // → 15
r3 = 5 |> somar(2, _)            // → 7

// Encadeado
r = 5 |> dobrar(_) |> incrementar(_) |> dobrar(_)
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
    >> "sempre executa" ¶
}
```

| Tipo | Quando |
|------|--------|
| `##Div` | Divisão por zero |
| `##IO` | Arquivo / sistema |
| `##Index` | Índice fora dos limites |
| `##Type` | Incompatibilidade de tipo |
| `##Parse` | Análise de dados |
| `##Network` | Erros de rede |
| `##_` | Qualquer erro (catch-all) |

---

## Módulos

```zymbol
// lib/calc.zy — o corpo do módulo está entre chaves
# calc {
    #> { somar, obter_PI }

    _PI := 3.14159
    somar(a, b) { <~ a + b }
    obter_PI() { <~ _PI }
}
```

```zymbol
// principal.zy
<# ./lib/calc => c    // alias obrigatório

>> c::somar(5, 3) ¶   // → 8
pi = c::obter_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exportar com nome público diferente
# minhalib {
    #> { _somar_interna => soma }

    _somar_interna(a, b) { <~ a + b }
}
```

```zymbol
<# ./minhalib => m

>> m::soma(3, 4) ¶    // → 7  (o nome interno _somar_interna está oculto)
```

> **Regras de módulos**: apenas `#>`, definições de funções e inicializadores literais de variáveis/constantes são permitidos dentro de `# nome { }`. Instruções executáveis (`>>`, `<<`, laços, etc.) geram erro E013.

---

## Modos Numéricos

Zymbol pode exibir números em **69 scripts de dígitos Unicode** — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemático Negrito, segmentos LCD e mais. O modo ativo afeta apenas a saída `>>`; a aritmética interna é sempre binária.

### Ativar um script

Escreva os dígitos `0` e `9` do script alvo entre `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
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
>> #0 ¶         // → #०   (falso — distinto de ० zero inteiro)

x = 28 > 4
>> x ¶          // → #१   (resultado de comparação segue o modo ativo)
```

### Literais de dígitos nativos no código-fonte

Dígitos de qualquer script suportado são literais válidos — em intervalos, módulo, comparações:

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
نشط = #١        // equivale a #1
>> نشط ¶        // → #١
>> (#१ && #٠) ¶ // → #٠
```

> `#` é **sempre ASCII**. `#0` (falso) é sempre visualmente distinto de `0` (zero inteiro) em qualquer script.

---

## Operadores de Dados

```zymbol
// Conversões de tipo
f = ##.42         // → 42.0  (para Decimal)
i = ###3.7        // → 4     (para Inteiro, arredonda)
t = ##!3.7        // → 3     (para Inteiro, trunca)

// Analisar texto em número
v1 = #|"42"|      // → 42  (Inteiro)
v2 = #|"3.14"|    // → 3.14  (Decimal)
v3 = #|"abc"|     // → "abc"  (fail-safe, sem erro)

// Arredondar / Truncar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arredondar para 2 casas decimais)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (truncar)

// Formatação de números
fmt = #,|1234567|      // → 1,234,567  (separado por vírgulas)
cient = #^|12345.678|  // → 1.2345678e4  (científico)

// Literais de base
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binário)
c = 0o101        // → 'A'  (octal)

// Saída de conversão de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integração com Shell

```zymbol
data = <\ date +%Y-%m-%d \>       // captura stdout (inclui \n final)
>> "Hoje: " data

arquivo = "dados.txt"
conteudo = <\ cat {arquivo} \>    // interpolação em comandos

saida = </"./subscript.zy"/>      // executar outro script Zymbol, capturar saída
>> saida
```

> `><` captura argumentos CLI como vetor de textos (apenas Tree-Walker).

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
| `=` | variável | `$#` | tamanho |
| `:=` | constante | `$+` | adicionar (encadeável) |
| `>>` | saída | `$+[i]` | inserir no índice (1-based) |
| `<<` | entrada | `$-` | remover primeiro por valor |
| `¶` / `\\` | nova linha | `$--` | remover todos por valor |
| `?` | se | `$-[i]` | remover no índice (1-based) |
| `_?` | senão-se | `$-[i..j]` | remover intervalo (1-based) |
| `_` | senão / curinga | `$?` | contém |
| `??` | correspondência | `$??` | encontrar todos os índices (1-based) |
| `@` | laço | `$[s..e]` | fatia (1-based) |
| `@ N { }` | laço N vezes | `$>` | map |
| `@!` | parar | `$\|` | filter |
| `@>` | continuar | `$<` | reduce |
| `@:nome { }` | laço rotulado | `$/ delim` | dividir texto |
| `@:nome!` | parar rótulo | `$++ a b c` | concat build |
| `@:nome>` | continuar rótulo | `vet[i>j>k]` | índice de navegação |
| `->` | lambda | `vet[i] = val` | atualizar elemento (apenas vetores) |
| `vet[i] += val` | atualização composta | `vet[i]$~` | atualização funcional (nova cópia) |
| `$^+` | ordenar crescente (primitivos) | `$^-` | ordenar decrescente (primitivos) |
| `$^` | ordenar com comparador (tuplas) | `<~` | retornar |
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
| `#,\|..\|` | formato vírgula | `#^\|..\|` | científico |
| `#d0d9#` | mudar modo numérico | `#09#` | redefinir para ASCII |
| `<\ ..\>` | execução shell | `>\<` | argumentos CLI |
| `\ var` | destruir variável explicitamente | `°x` / `x°` | definição a quente (auto-init) |
| `>>|` | bloco TUI (tela alt.) | `>>~` | saída posicionada |
| `>>!` | limpar tela | `>>?` | consultar tamanho do terminal |
| `<<\|` | leitura de tecla bloqueante | `<<\|?` | leitura de tecla não-bloqueante |
| `@~ N` | dormir N milissegundos | `$*` | repetir texto N vezes |

---

## Changelog de Versões

### v0.0.5 — Primitivas TUI, Definição a Quente & Repetição de Texto _(Maio 2026)_

- **Breaking** Separador de braço match: `padrão : resultado` → `padrão => resultado`
- **Breaking** Alias de import: `<# caminho <= alias` → `<# caminho => alias`
- **Breaking** Renomear export: `#> { fn <= pub }` → `#> { fn => pub }`
- **Added** Bloco TUI `>>| { }` — tela alternativa + modo raw; limpa ao sair
- **Added** Saída posicionada `>>~ (linha, col, BKS, fg, bg) > itens` — slots esparsos, paleta ANSI 256 cores
- **Added** Entrada de tecla `<<| var` (bloqueante) e `<<|? var` (polling não-bloqueante)
- **Added** `>>!` limpar tela, `>>?` consultar tamanho do terminal, `@~ N` dormir N milissegundos
- **Added** Definição a quente `°x` / `x°` — auto-inicializar variável no primeiro uso em laços
- **Added** Repetição de texto `str $* N` — repetir um texto N vezes
- **VM** Paridade: 436/436 testes passam

### v0.0.4 — Indexação 1-Based, Funções de Primeira Classe & Blocos de Módulo _(Abril 2026)_

- **Breaking** Toda indexação alterada para **1-based** — `vet[1]` é o primeiro elemento; `vet[0]` é um erro em tempo de execução
- **Added** Funções nomeadas são **valores de primeira classe** — passe diretamente para HOF: `numeros$> dobrar`
- **Added** Sintaxe de **bloco de módulo** obrigatória: `# nome { ... }` — sintaxe plana removida
- **Added** Indexação multidimensional: `vet[i>j>k]` (navegação), `vet[p ; q]` (extração plana)
- **Added** Conversões de tipo: `##.expr` (Decimal), `###expr` (Inteiro arredonda), `##!expr` (Inteiro trunca)
- **Added** Divisão de texto: `str$/ delim` — retorna `Array(String)`
- **Added** Concat build: `base$++ a b c` — adiciona múltiplos itens
- **Added** Laço N vezes: `@ N { }` — repetir exatamente N vezes
- **Added** Sintaxe de laço rotulado: `@:nome { }`, `@:nome!`, `@:nome>` — substitui `@ @nome` / `@! nome`
- **Added** Regras de escopo de variáveis: variáveis `_nome` têm escopo exato do bloco; `\ var` destrói cedo
- **Added** Padrões de comparação match: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Added** Erro de módulo E013: instruções executáveis no corpo do módulo são proibidas
- **Fixed** `take_variable` não corrompe mais constantes de módulo no write-back
- **Fixed** `alias.CONST` agora resolve corretamente; `#>` pode aparecer após definições de funções
- **VM** Paridade completa: 393/393 testes passam

### v0.0.3 — Sistemas de Numerais Unicode & Melhorias LSP _(Abril 2026)_

- **Added** 69 blocos de dígitos Unicode com token de troca de modo `#d0d9#`
- **Added** Literais booleanos em qualquer script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Added** Dígitos Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Added** Opcode de VM `SetNumeralMode` — paridade completa com tree-walker
- **Added** REPL respeita o modo numérico ativo no echo e exibição de variáveis
- **Changed** Saída booleana `>>` agora inclui prefixo `#` (`#0` / `#1`) em todos os modos

### v0.0.2_01 — Renomear Operadores _(30 Mar 2026)_

- **Changed** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — consistente com família de prefixo de formato `#`
- **Added** Alias de export: re-exportar membros do módulo com nome diferente

### v0.0.2 — Redesenho da API de Coleções & Instaladores _(24 Mar 2026)_

- **Added** Família unificada de operadores `$` para vetores e textos (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Atribuição de desestruturação para vetores, tuplas e tuplas nomeadas
- **Added** Índices negativos (`vet[-1]` = último elemento)
- **Added** Instaladores nativos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Added** Atribuição composta `^=`
- **Fixed** Casos de borda na aritmética do parser; correções de documentação

### v0.0.1 — Primeira Versão Pública _(22 Mar 2026)_

- Interpretador tree-walker + VM de registros (`--vm`, ~4× mais rápido, ~95% paridade)
- Todos os construtos base: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificadores Unicode completos, sistema de módulos, lambdas, closures, tratamento de erros
- REPL, LSP, extensão VS Code, formatador (`zymbol fmt`)

---

_Zymbol-Lang — Simbólico. Universal. Imutável._
