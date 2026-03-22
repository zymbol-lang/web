# Manuale Compatto di Zymbol-Lang

**Zymbol-Lang** è un linguaggio di programmazione simbolico. Non usa parole chiave — tutto è un simbolo. Funziona allo stesso modo in qualsiasi lingua umana.

---

## Filosofia

- Nessuna parola chiave (`if`, `while`, `return` non esistono — solo simboli `?`, `@`, `<~`)
- Unicode completo — identificatori in qualsiasi lingua o emoji 👋
- Agnostico alla lingua umana — il codice è identico in tutte le lingue

---

## Variabili e Costanti

```zymbol
x = 10           // variabile (mutabile)
PI := 3.14159    // costante (immutabile — errore se riassegnata)
nome = "Ana"
attivo = #1      // booleano vero
👋 := "Ciao"
```

### Assegnazione Composta

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

## Tipi di Dati

| Tipo           | Esempio             | Simbolo `#?` | Note                                |
|----------------|---------------------|--------------|-------------------------------------|
| Intero         | `42`, `-7`          | `###`        | 64 bit con segno                    |
| Virgola mobile | `3.14`, `1.5e10`    | `##.`        | Notazione scientifica OK            |
| Stringa        | `"ciao"`            | `##"`        | Interpolazione: `"Ciao {nome}"`     |
| Carattere      | `'A'`               | `##'`        | Un carattere Unicode                |
| Booleano       | `#1`, `#0`          | `##?`        | NON sono 1 e 0 numerici             |
| Array          | `[1, 2, 3]`         | `##]`        | Tutti gli elementi dello stesso tipo|
| Tupla          | `(a, b)`            | `##)`        | Posizionale                         |
| Tupla nominata | `(x: 1, y: 2)`      | `##)`        | Accesso per nome o indice           |

---

## Uscita e Ingresso

```zymbol
// Uscita — NON aggiunge newline automaticamente
>> "Ciao" ¶                      // ¶ o \\ dà una nuova riga esplicita
>> "a=" a " b=" b ¶              // più valori per giustapposizione
>> "somma=" sommare(2, 3) ¶      // chiamate a funzione in qualsiasi posizione
>> (arr$#) ¶                     // gli operatori postfix richiedono parentesi

// Ingresso
<< nome                          // senza prompt — legge nella variabile
<< "Il tuo nome? " nome          // con prompt
```

> `¶` o `\\` sono equivalenti come nuova riga.

---

## Concatenazione di Stringhe

Tre forme valide — ciascuna per il suo contesto:

```zymbol
nome = "Ana"
n = 25

// 1. Virgola — nelle assegnazioni con = o :=
msg = "Ciao ", nome, "!"                 // → Ciao Ana!
TITOLO := "Utente: ", nome

// 2. Giustapposizione — nell'uscita >>
>> "Ciao " nome " hai " n " anni" ¶      // → Ciao Ana hai 25 anni

// 3. Interpolazione — in qualsiasi contesto
desc = "Ciao {nome}, hai {n} anni"       // → Ciao Ana, hai 25 anni
```

> **Nota**: `+` è solo per i numeri. Usarlo con le stringhe genera un avviso.

---

## Controllo di Flusso

```zymbol
x = 7

// Se semplice
? x > 0 { >> "positivo" ¶ }

// Se / altrimenti se / altrimenti
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

I blocchi `{ }` sono **obbligatori** anche per una sola riga.

---

## Match

```zymbol
// Match con intervalli
voto = 85
giudizio = ?? voto {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> giudizio ¶    // → B

// Match con guardie (condizioni arbitrarie)
temp = -5
stato = ?? temp {
    _? temp < 0  : "ghiaccio"
    _? temp < 20 : "freddo"
    _? temp < 35 : "caldo"
    _            : "rovente"
}
>> stato ¶    // → ghiaccio

// Match con stringhe
colore = "rosso"
codice = ?? colore {
    "rosso"  : "#FF0000"
    "verde"  : "#00FF00"
    _        : "#000000"
}
>> codice ¶
```

---

## Cicli

```zymbol
// Intervallo inclusivo: 0..4 itera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervallo con passo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Intervallo inverso
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Mentre (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Per ogni elemento
frutti = ["mela", "pera", "uva"]
@ f:frutti { >> f ¶ }

// Sui caratteri di una stringa
@ c:"ciao" { >> c "-" }
>> ¶    // → c-i-a-o-

// Break e Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continua
    ? i > 7 { @! }          // @! interrompi
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funzioni

```zymbol
// Dichiarazione e chiamata
sommare(a, b) { <~ a + b }
>> sommare(3, 4) ¶    // → 7

// Ricorsione
fattoriale(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fattoriale(n - 1)
}
>> fattoriale(5) ¶    // → 120

// Le funzioni hanno portata isolata — nessun accesso a variabili esterne
globale = 100
testare() {
    x = 42    // solo locale
    <~ x
}
>> testare() ¶    // → 42
```

> **Importante**: Le funzioni dichiarate con `nome(params){ }` non sono valori di prima classe.
> Per passarle come argomento, avvolgere: `x -> nome(x)`.

---

## Lambda e Chiusure

```zymbol
// Lambda semplice (ritorno implicito)
doppio = x -> x * 2
somma = (a, b) -> a + b
>> doppio(5) ¶    // → 10
>> somma(3, 7) ¶  // → 10

// Lambda con blocco (ritorno esplicito)
classifica = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}
>> classifica(5) ¶     // → positivo
>> classifica(0) ¶     // → zero
>> classifica(-5) ¶    // → negativo

// Chiusure — le lambda catturano variabili dello scope esterno
fattore = 3
triplo = x -> x * fattore    // cattura 'fattore'
>> triplo(7) ¶    // → 21

// Fabbrica di funzioni
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda come valori: archiviate in array
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Array

```zymbol
arr = [10, 20, 30, 40, 50]

// Accesso (indice 0-base)
>> arr[0] ¶    // → 10

// Lunghezza (parentesi richieste in >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Aggiungere, rimuovere, contiene, fetta
arr = arr$+ 60               // aggiungere
arr = arr$- 0                // rimuovere indice 0
contiene = arr$? 30          // → #1
fetta = arr$[0..2]           // [20, 30]

// Aggiornare elemento
arr[1] = 99

// Per ogni elemento
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` restituiscono un **nuovo array** — riassegnare: `arr = arr$+ 4`.
> Nessun concatenamento: usare due assegnazioni separate.

---

## Tuple

```zymbol
// Tupla nominata
persona = (nome: "Alice", eta: 25)
>> persona.nome ¶    // → Alice
>> persona.eta ¶     // → 25
>> persona[0] ¶      // → Alice (l'indice funziona anche)
```

---

## Funzioni di Ordine Superiore

Gli operatori HOF richiedono una **lambda inline** — non una variabile lambda diretta.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
doppi = nums$> (x -> x * 2)
>> doppi ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pari = nums$| (x -> x % 2 == 0)
>> pari ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (valore_iniziale, (accumulatore, elemento) -> expr)
totale = nums$< (0, (acc, x) -> acc + x)
>> totale ¶    // → 55
```

---

## Gestione degli Errori

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisione per zero" ¶
} :! ##IO {
    >> "errore IO" ¶
} :! {
    >> "altro errore: " _err ¶
} :> {
    >> "viene eseguito sempre" ¶
}
```

| Tipo        | Quando si verifica          |
|-------------|----------------------------|
| `##Div`     | Divisione per zero          |
| `##IO`      | File / sistema              |
| `##Index`   | Indice fuori dai limiti     |
| `##Type`    | Errore di tipo              |
| `##Parse`   | Errore di parsing           |
| `##Network` | Errori di rete              |
| `##_`       | Qualsiasi errore (catch-all)|

---

## Moduli

```zymbol
// File: lib/calc.zy
# calc

#> { sommare, get_PI }    // esportazioni PRIMA delle definizioni

_PI := 3.14159
sommare(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// File: main.zy
<# ./lib/calc <= c    // alias obbligatorio

>> c::sommare(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

---

## Esempio Completo: FizzBuzz

```zymbol
classifica(numero) {
    ? numero % 15 == 0 { <~ "FrizzaRonza" }
    _? numero % 3  == 0 { <~ "Frizza" }
    _? numero % 5  == 0 { <~ "Ronza" }
    _ { <~ numero }
}

@ i:1..20 { >> classifica(i) ¶ }
```

---

## Riferimento dei Simboli

| Simbolo | Operazione        | Simbolo    | Operazione          |
|---------|-------------------|------------|---------------------|
| `=`     | variabile         | `$#`       | lunghezza           |
| `:=`    | costante          | `$+`       | aggiungere          |
| `>>`    | uscita            | `$-`       | rimuovere (per ind.)|
| `<<`    | ingresso          | `$?`       | contiene            |
| `¶`/`\` | nuova riga        | `$[s..e]`  | fetta               |
| `?`     | se (if)           | `$>`       | map                 |
| `_?`    | altrimenti se     | `$\|`      | filter              |
| `_`     | altrimenti / jolly| `$<`       | reduce              |
| `??`    | match             | `!?`       | provare (try)       |
| `@`     | ciclo             | `:!`       | catturare (catch)   |
| `@!`    | interrompi (break)| `:>`       | sempre (finally)    |
| `@>`    | continua          | `$!`       | è errore            |
| `->`    | lambda            | `$!!`      | propagare errore    |
| `<~`    | ritornare         | `#`        | dichiarare modulo   |
| `\|>`   | pipe              | `#>`       | esportare           |
| `#1`    | vero              | `<#`       | importare           |
| `#0`    | falso             | `::`       | chiamata modulo     |

---

*Zymbol-Lang — Simbolico. Universale. Immutabile.*

---

> **Avvertenza:** Questa documentazione è stata creata e tradotta dall'intelligenza artificiale (IA).
> Sono stati compiuti tutti gli sforzi per garantire l'accuratezza, ma alcune traduzioni o esempi potrebbero contenere errori.
> Il riferimento canonico è la [specifica Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
