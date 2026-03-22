# Manual Compacto do Zymbol-Lang

**Zymbol-Lang** é uma linguagem de programação simbólica. Não utiliza palavras-chave — tudo é um símbolo. Funciona da mesma forma em qualquer língua humana.

---

## Filosofia

- Sem palavras-chave (`if`, `while`, `return` não existem — apenas símbolos `?`, `@`, `<~`)
- Unicode completo — identificadores em qualquer língua ou emoji 👋
- Agnóstico à língua humana — o código é idêntico em todas as línguas

---

## Variáveis e Constantes

```zymbol
x = 10           // variável (mutável)
PI := 3.14159    // constante (imutável — erro se reatribuída)
nome = "Ana"
activo = #1      // booleano verdadeiro
👋 := "Olá"
```

### Atribuição Composta

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

## Tipos de Dados

| Tipo           | Exemplo             | Símbolo `#?` | Notas                               |
|----------------|---------------------|--------------|-------------------------------------|
| Inteiro        | `42`, `-7`          | `###`        | 64 bits com sinal                   |
| Vírgula flutuante | `3.14`, `1.5e10` | `##.`        | Notação científica OK               |
| Cadeia         | `"olá"`             | `##"`        | Interpolação: `"Olá {nome}"`        |
| Carácter       | `'A'`               | `##'`        | Um carácter Unicode                 |
| Booleano       | `#1`, `#0`          | `##?`        | NÃO são 1 e 0 numéricos             |
| Array          | `[1, 2, 3]`         | `##]`        | Todos os elementos do mesmo tipo    |
| Tuplo          | `(a, b)`            | `##)`        | Posicional                          |
| Tuplo nomeado  | `(x: 1, y: 2)`      | `##)`        | Acesso por nome ou índice           |

---

## Saída e Entrada

```zymbol
// Saída — NÃO adiciona nova linha automaticamente
>> "Olá" ¶                    // ¶ ou \\ dá nova linha explícita
>> "a=" a " b=" b ¶           // múltiplos valores por justaposição
>> "soma=" somar(2, 3) ¶      // chamadas a funções em qualquer posição
>> (arr$#) ¶                  // operadores postfix requerem parênteses

// Entrada
<< nome                       // sem indicação — lê para variável
<< "O seu nome? " nome        // com indicação
```

> `¶` ou `\\` são equivalentes como nova linha.

---

## Concatenação de Cadeias

Três formas válidas — cada uma para o seu contexto:

```zymbol
nome = "Ana"
n = 25

// 1. Vírgula — em atribuições com = ou :=
msg = "Olá ", nome, "!"              // → Olá Ana!
TITULO := "Utilizador: ", nome

// 2. Justaposição — na saída >>
>> "Olá " nome " tem " n " anos" ¶   // → Olá Ana tem 25 anos

// 3. Interpolação — em qualquer contexto
desc = "Olá {nome}, tem {n} anos"    // → Olá Ana, tem 25 anos
```

> **Nota**: `+` é apenas para números. Utilizá-lo com cadeias gera um aviso.

---

## Controlo de Fluxo

```zymbol
x = 7

// Se simples
? x > 0 { >> "positivo" ¶ }

// Se / senão se / senão
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

Os blocos `{ }` são **obrigatórios** mesmo para uma única linha.

---

## Match

```zymbol
// Match com intervalos
nota = 85
classificação = ?? nota {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> classificação ¶    // → B

// Match com guardas (condições arbitrárias)
temp = -5
estado = ?? temp {
    _? temp < 0  : "gelo"
    _? temp < 20 : "frio"
    _? temp < 35 : "morno"
    _            : "quente"
}
>> estado ¶    // → gelo

// Match com cadeias
cor = "vermelho"
código = ?? cor {
    "vermelho" : "#FF0000"
    "verde"    : "#00FF00"
    _          : "#000000"
}
>> código ¶
```

---

## Ciclos

```zymbol
// Intervalo inclusivo: 0..4 itera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervalo com passo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Intervalo inverso
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Enquanto (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Para cada elemento
frutas = ["maçã", "pêra", "uva"]
@ f:frutas { >> f ¶ }

// Sobre caracteres de cadeia
@ c:"olá" { >> c "-" }
>> ¶    // → o-l-á-

// Break e Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continuar
    ? i > 7 { @! }          // @! parar
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funções

```zymbol
// Declaração e chamada
somar(a, b) { <~ a + b }
>> somar(3, 4) ¶    // → 7

// Recursão
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// As funções têm âmbito isolado — sem acesso a variáveis externas
global = 100
testar() {
    x = 42    // apenas local
    <~ x
}
>> testar() ¶    // → 42
```

> **Importante**: As funções declaradas com `nome(params){ }` não são valores de primeira classe.
> Para as passar como argumento, envolver: `x -> nome(x)`.

---

## Lambdas e Encerramentos

```zymbol
// Lambda simples (retorno implícito)
duplo = x -> x * 2
soma = (a, b) -> a + b
>> duplo(5) ¶    // → 10
>> soma(3, 7) ¶  // → 10

// Lambda com bloco (retorno explícito)
classificar = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}
>> classificar(5) ¶     // → positivo
>> classificar(0) ¶     // → zero
>> classificar(-5) ¶    // → negativo

// Encerramentos — lambdas capturam variáveis do âmbito exterior
factor = 3
triplo = x -> x * factor    // captura 'factor'
>> triplo(7) ¶    // → 21

// Fábrica de funções
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas como valores: armazenadas em arrays
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Arrays

```zymbol
arr = [10, 20, 30, 40, 50]

// Acesso (índice 0-base)
>> arr[0] ¶    // → 10

// Comprimento (parênteses necessários em >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Adicionar, remover, contém, fatia
arr = arr$+ 60               // adicionar
arr = arr$- 0                // remover índice 0
tem = arr$? 30               // → #1
fatia = arr$[0..2]           // [20, 30]

// Actualizar elemento
arr[1] = 99

// Para cada elemento
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` devolvem um **novo array** — reatribuir: `arr = arr$+ 4`.
> Sem encadeamento: utilizar duas atribuições separadas.

---

## Tuplos

```zymbol
// Tuplo nomeado
pessoa = (nome: "Alice", idade: 25)
>> pessoa.nome ¶    // → Alice
>> pessoa.idade ¶   // → 25
>> pessoa[0] ¶      // → Alice (índice também funciona)
```

---

## Funções de Ordem Superior

Os operadores HOF requerem uma **lambda inline** — não uma variável lambda directa.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
duplos = nums$> (x -> x * 2)
>> duplos ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pares = nums$| (x -> x % 2 == 0)
>> pares ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (valor_inicial, (acumulador, elemento) -> expr)
total = nums$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55
```

---

## Tratamento de Erros

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisão por zero" ¶
} :! ##IO {
    >> "erro de IO" ¶
} :! {
    >> "outro erro: " _err ¶
} :> {
    >> "executa sempre" ¶
}
```

| Tipo        | Quando ocorre              |
|-------------|---------------------------|
| `##Div`     | Divisão por zero           |
| `##IO`      | Ficheiro / sistema         |
| `##Index`   | Índice fora dos limites    |
| `##Type`    | Erro de tipo               |
| `##Parse`   | Erro de parsing            |
| `##Network` | Erros de rede              |
| `##_`       | Qualquer erro (catch-all)  |

---

## Módulos

```zymbol
// Ficheiro: lib/calc.zy
# calc

#> { somar, get_PI }    // exportações ANTES das definições

_PI := 3.14159
somar(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Ficheiro: main.zy
<# ./lib/calc <= c    // alias obrigatório

>> c::somar(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Exemplo Completo: FizzBuzz

```zymbol
classificar(número) {
    ? número % 15 == 0 { <~ "BolhaZumbido" }
    _? número % 3  == 0 { <~ "Bolha" }
    _? número % 5  == 0 { <~ "Zumbido" }
    _ { <~ número }
}

@ i:1..20 { >> classificar(i) ¶ }
```

---

## Referência de Símbolos

| Símbolo | Operação           | Símbolo    | Operação            |
|---------|--------------------|------------|---------------------|
| `=`     | variável           | `$#`       | comprimento         |
| `:=`    | constante          | `$+`       | adicionar           |
| `>>`    | saída              | `$-`       | remover (por índice)|
| `<<`    | entrada            | `$?`       | contém              |
| `¶`/`\` | nova linha         | `$[s..e]`  | fatia               |
| `?`     | se (if)            | `$>`       | map                 |
| `_?`    | senão se (elif)    | `$\|`      | filter              |
| `_`     | senão / wildcard   | `$<`       | reduce              |
| `??`    | match              | `!?`       | tentar (try)        |
| `@`     | ciclo              | `:!`       | capturar (catch)    |
| `@!`    | parar (break)      | `:>`       | sempre (finally)    |
| `@>`    | continuar          | `$!`       | é erro              |
| `->`    | lambda             | `$!!`      | propagar erro       |
| `<~`    | retornar           | `#`        | declarar módulo     |
| `\|>`   | pipe               | `#>`       | exportar            |
| `#1`    | verdadeiro         | `<#`       | importar            |
| `#0`    | falso              | `::`       | chamada de módulo   |

---

*Zymbol-Lang — Simbólico. Universal. Imutável.*

---

> **Aviso:** Esta documentação foi criada e traduzida por inteligência artificial (IA).
> Foram envidados todos os esforços para garantir a exactidão, mas algumas traduções ou exemplos podem conter erros.
> A referência canónica é a [especificação do Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
