# Manuale Zymbol-Lang

**Zymbol-Lang** è un linguaggio di programmazione simbolico. Nessuna parola chiave — tutto è un simbolo. Funziona allo stesso modo in qualsiasi lingua umana.

- Nessun `if`, `while`, `return` — solo `?`, `@`, `<~`
- Unicode completo — identificatori in qualsiasi lingua o emoji
- Agnostico alla lingua umana — il codice è identico in tutte le lingue

---

## Variabili e Costanti

```zymbol
x = 10              // variabile mutabile
PI := 3.14159       // costante — errore alla riassegnazione
nome = "Alice"
attivo = #1         // booleano vero
👋 := "Ciao"
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

## Tipi di Dati

| Tipo           | Letterale           | Tag `#?` | Note                               |
|----------------|---------------------|----------|------------------------------------|
| Int            | `42`, `-7`          | `###`    | 64 bit con segno                   |
| Float          | `3.14`, `1.5e10`    | `##.`    | Notazione scientifica OK           |
| String         | `"testo"`           | `##"`    | Interpolazione: `"Ciao {nome}"`    |
| Char           | `'A'`               | `##'`    | Un carattere Unicode               |
| Bool           | `#1`, `#0`          | `##?`    | NON numerico — `#1 ≠ 1`           |
| Array          | `[1, 2, 3]`         | `##]`    | Elementi omogenei                  |
| Tupla          | `(a, b)`            | `##)`    | Posizionale                        |
| Tupla nominata | `(x: 1, y: 2)`      | `##)`    | Campi nominati                     |

```zymbol
// Introspezione del tipo — restituisce (tipo, cifre, valore)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Uscita e Ingresso

```zymbol
>> "Ciao" ¶                        // ¶ o \\ per nuova riga esplicita
>> "a=" a " b=" b ¶                // giustapposizione — valori multipli
>> (arr$#) ¶                       // operatori postfix richiedono ( ) in >>

<< nome                            // leggere nella variabile (senza prompt)
<< "Inserisci il nome: " nome      // con prompt
```

> `¶` (AltGr+R sulla tastiera spagnola) e `\\` sono nuove righe equivalenti.

---

## Operatori

```zymbol
// Aritmetica
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (divisione intera)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potenza)

// Confronto
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Stringhe

```zymbol
// Tre forme di concatenazione
nome = "Alice"
n = 42

msg = "Ciao ", nome, "!"              // virgola — nelle assegnazioni
>> "Ciao " nome " hai " n ¶          // giustapposizione — in >>
desc = "Ciao {nome}, hai {n}"        // interpolazione — ovunque
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (fine esclusiva)
ha = s$? "World"           // #1
parti = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (solo i primi N)
```

> `+` è solo per i numeri. Usare `,`, giustapposizione o interpolazione per le stringhe.

---

## Controllo di Flusso

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

> I blocchi `{ }` sono **obbligatori** anche per una sola istruzione.

---

## Match

```zymbol
// Intervalli
voto = 85
giudizio = ?? voto {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> giudizio ¶    // → B

// Stringhe
colore = "rosso"
codice = ?? colore {
    "rosso" : "#FF0000"
    "verde" : "#00FF00"
    _       : "#000000"
}

// Guardie
temp = -5
stato = ?? temp {
    _? temp < 0  : "ghiaccio"
    _? temp < 20 : "freddo"
    _? temp < 35 : "caldo"
    _            : "rovente"
}
>> stato ¶    // → ghiaccio

// Forma istruzione (rami a blocco)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negativo" ¶ }
    _        : { >> "positivo" ¶ }
}
```

---

## Cicli

```zymbol
@ i:0..4  { >> i " " }        // intervallo inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // con passo:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverso:                5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frutti = ["mela", "pera", "uva"]
@ f:frutti { >> f ¶ }         // per ogni elemento

@ c:"ciao" { >> c "-" }
>> ¶                          // → c-i-a-o-  (sui caratteri)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continua
    ? i > 7 { @! }             // @! interrompi
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

// Ciclo etichettato (break annidato)
conta = 0
@ @esterno {
    conta++
    ? conta >= 3 { @! esterno }
}
>> conta ¶                    // → 3
```

---

## Funzioni

```zymbol
sommare(a, b) { <~ a + b }
>> sommare(3, 4) ¶    // → 7

fattoriale(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fattoriale(n - 1)
}
>> fattoriale(5) ¶    // → 120
```

Le funzioni hanno una **portata isolata** — non possono leggere variabili esterne. Usare i parametri di uscita `<~` per modificare le variabili del chiamante:

```zymbol
scambiare(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
scambiare(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Le funzioni nominate non sono valori di prima classe. Per passarle come argomento, avvolgere: `x -> fn(x)`.

---

## Lambda e Chiusure

```zymbol
doppio = x -> x * 2
somma = (a, b) -> a + b
>> doppio(5) ¶    // → 10
>> somma(3, 7) ¶  // → 10

// Lambda con blocco
classificare = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}

// Chiusura — cattura la portata esterna
fattore = 3
triplo = x -> x * fattore
>> triplo(7) ¶    // → 21

// Fabbrica
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Negli array
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Array

Gli array sono **mutabili** e contengono elementi dello **stesso tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — accesso (base 0)
arr[-1]         // 5 — indice negativo (ultimo)
arr$#           // 5 — lunghezza (usare (arr$#) in >>)

arr = arr$+ 6            // aggiungere → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserire all'indice 2
arr3 = arr$- 3           // rimuovere la prima occorrenza del valore
arr4 = arr$-- 3          // rimuovere tutte le occorrenze
arr5 = arr$-[0]          // rimuovere all'indice
arr6 = arr$-[1..3]       // rimuovere un intervallo (fine esclusiva)

ha = arr$? 3             // #1 — contiene
pos = arr$?? 3           // [2] — tutti gli indici del valore
sl = arr$[0..3]          // [1,2,3] — fetta (fine esclusiva)
sl2 = arr$[0:3]          // [1,2,3] — uguale, sintassi per conteggio

asc = arr$^+             // ordinato crescente  (solo primitivi)
desc = arr$^-            // ordinato decrescente (solo primitivi)

// Array di tuple nominate/posizionali — usare $^ con lambda comparatore
db = [(nome: "Carla", eta: 28), (nome: "Ana", eta: 25), (nome: "Bob", eta: 30)]
per_eta  = db$^ (a, b -> a.eta < b.eta)     // crescente per età  (<)
per_nome = db$^ (a, b -> a.nome > b.nome)   // decrescente per nome (>)
>> per_eta[0].nome ¶     // → Ana
>> per_nome[0].nome ¶    // → Carla

// Aggiornamento diretto dell'elemento (solo array)
arr[1] = 99              // assegnare
arr[0] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Aggiornamento funzionale — restituisce un nuovo array; l'originale rimane invariato
arr2 = arr[1]$~ 99
```

> Tutti gli operatori di collezione restituiscono un **nuovo array**. Riassegnare: `arr = arr$+ 4`.
> Gli operatori non possono essere concatenati — usare assegnazioni intermedie.
> `$^+` / `$^-` ordinano **array di primitivi** (numeri, stringhe). Per array di tuple, usare `$^` con lambda comparatore — la direzione è codificata nel lambda (`<` = crescente, `>` = decrescente).

**Semantica del valore** — assegnare un array a un'altra variabile crea una copia indipendente:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b non è influenzato
```

```zymbol
// Array annidati
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[1][2] ¶    // → 6
```

---

## Destrutturazione

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primo, *resto] = arr        // primo=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ scarta

// Tupla posizionale
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Tupla nominata
persona = (nome: "Ana", eta: 25, citta: "Roma")
(nome: n, eta: e) = persona   // n="Ana"  e=25
```

---

## Tuple

Le tuple sono contenitori ordinati **immutabili** che possono contenere valori di **tipi diversi**.
A differenza degli array, gli elementi non possono essere modificati dopo la creazione.

```zymbol
// Posizionale
punto = (10, 20)
>> punto[0] ¶    // → 10

dati = (42, "hello", #1, 3.14)
>> dati[2] ¶     // → #1

// Nominata
persona = (nome: "Alice", eta: 25)
>> persona.nome ¶    // → Alice
>> persona[0] ¶      // → Alice  (l'indice funziona anche)

// Annidata
pos = (x: 10, y: 20)
p = (pos: pos, etichetta: "origine")
>> p.pos.x ¶        // → 10
```

**Immutabilità** — qualsiasi tentativo di modificare un elemento di una tupla è un errore di esecuzione:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ errore di esecuzione: le tuple sono immutabili
// t[0] += 5    // ❌ stesso errore
```

Per ricavare un valore modificato usare `$~` (aggiornamento funzionale) — restituisce una **nuova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← originale invariato
>> t2 ¶    // → (10, 999, 30)

// Tupla nominata — ricostruire esplicitamente
persona = (nome: "Alice", eta: 25)
piu_vecchia  = (nome: persona.nome, eta: 26)
>> persona.eta ¶    // → 25
>> piu_vecchia.eta ¶    // → 26
```

---

## Funzioni di Ordine Superiore

> Gli operatori HOF richiedono un **lambda inline** — le variabili lambda non possono essere passate direttamente.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doppi   = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pari    = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totale  = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Catena via intermedi
passo1 = nums$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funzioni nominate in HOF — avvolgere in lambda
raddoppiare(x) { <~ x * 2 }
r = nums$> (x -> raddoppiare(x))    // ✅
```

---

## Operatore Pipe

Il lato destro richiede sempre `_` come segnaposto per il valore trasmesso:

```zymbol
doppio = x -> x * 2
sommare = (a, b) -> a + b
inc = x -> x + 1

5 |> doppio(_)        // → 10
10 |> sommare(_, 5)   // → 15
5 |> sommare(2, _)    // → 7

// Concatenato
r = 5 |> doppio(_) |> inc(_) |> doppio(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Gestione degli Errori

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisione per zero" ¶
} :! {
    >> "altro errore: " _err ¶    // _err contiene il messaggio di errore
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
get_PI() { <~ _PI }   // getter — accesso diretto alla costante via alias non supportato
```

```zymbol
// File: main.zy
<# ./lib/calc <= c    // alias obbligatorio

>> c::sommare(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶                   // → 3.14159
```

```zymbol
// Esportare con nome pubblico diverso
# mialib
#> { _sommare_interno <= somma }

_sommare_interno(a, b) { <~ a + b }
```

```zymbol
<# ./mialib <= m

>> m::somma(3, 4) ¶    // → 7  (nome interno _sommare_interno è nascosto)
```

---

## Modi Numerici

Zymbol può visualizzare i numeri in **69 script di cifre Unicode** — Devanagari, Arabo-Indico, Tailandese, Klingon pIqaD, Grassetto Matematico, segmenti LCD e altro. Il modo attivo influisce solo sull'output `>>`; l'aritmetica interna è sempre binaria.

### Attivare uno script

Scrivere la cifra `0` e `9` dello script target racchiusa tra `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabo-Indico  (U+0660–U+0669)
#๐๙#    // Tailandese    (U+0E50–U+0E59)
#09#    // ripristinare in ASCII
```

### Output e booleani

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predefinito)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto decimale sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleani: prefisso # sempre ASCII, la cifra si adatta
>> #1 ¶         // → #१   (vero in Devanagari)
>> #0 ¶         // → #०   (falso — distinto da ०  zero intero)

x = 28 > 4
>> x ¶          // → #१   (risultato di confronto segue il modo attivo)
```

### Letterali numerici nativi nel sorgente

Le cifre di qualsiasi script supportato sono letterali validi — in intervalli, modulo, confronti:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Letterali booleani in qualsiasi script

`#` + cifra `0` o `1` di qualsiasi blocco è un letterale booleano valido:

```zymbol
#٠٩#
نشط = #١        // equivalente a #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` è **sempre ASCII**. `#0` (falso) è sempre visivamente distinto da `0` (zero intero) in ogni script.

---

## Operatori sui Dati

```zymbol
// Convertire stringa in numero
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (sicuro, senza errore)

// Arrotondare / troncare
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrotondare a 2 decimali)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (troncare)

// Formattazione numeri
fmt = #,|1234567|      // → 1,234,567  (separatore di migliaia)
sci = #^|12345.678|    // → 1.2345678e4  (scientifico)

// Letterali di base
a = 0x41         // → 'A'  (esadecimale)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (ottale)

// Conversione di base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrazione Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // cattura stdout (incluso \n finale)
>> "Oggi: " data

file = "data.txt"
contenuto = <\ cat {file} \>    // interpolazione nei comandi

uscita = </"./script.zy"/>      // eseguire un altro script Zymbol, catturare l'uscita
>> uscita
```

> `><` cattura gli argomenti CLI come array di stringhe (solo tree-walker).

---

## Esempio Completo: FizzBuzz

```zymbol
classificare(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> classificare(i) ¶ }
```

---

## Riferimento dei Simboli

| Simbolo   | Operazione                          | Simbolo       | Operazione                     |
|-----------|-------------------------------------|---------------|-------------------------------|
| `=`       | variabile                           | `$#`          | lunghezza                     |
| `:=`      | costante                            | `$+`          | aggiungere                    |
| `>>`      | uscita                              | `$+[i]`       | inserire all'indice           |
| `<<`      | ingresso                            | `$-`          | rimuovere prima occorrenza    |
| `¶`/`\\`  | nuova riga                          | `$--`         | rimuovere tutte le occorrenze |
| `?`       | se (if)                             | `$-[i]`       | rimuovere all'indice          |
| `_?`      | altrimenti se (elif)                | `$-[i..j]`    | rimuovere un intervallo       |
| `_`       | altrimenti / jolly                  | `$?`          | contiene                      |
| `??`      | match                               | `$??`         | tutti gli indici del valore   |
| `@`       | ciclo                               | `$[s..e]`     | fetta                         |
| `@!`      | interrompi (break)                  | `$>`          | map                           |
| `@>`      | continua                            | `$\|`         | filter                        |
| `->`      | lambda                              | `$<`          | reduce                        |
| `arr[i] = val` | aggiornare elemento (solo array) | `arr[i] += val` | aggiornamento composto   |
| `arr[i]$~` | aggiornamento funzionale (nuova copia) | `$^+`    | ordinare crescente (primitivi) |
| `$^-`     | ordinare decrescente (primitivi)    | `$^`          | ordinare con lambda comparatore |
| `<~`      | ritornare (return)                  | `!?`          | provare (try)                 |
| `\|>`     | pipe                                | `:!`          | catturare (catch)             |
| `#1`      | vero                                | `:>`          | sempre (finally)              |
| `#0`      | falso                               | `$!`          | è errore                      |
| `<#`      | importare                           | `$!!`         | propagare errore              |
| `#`       | dichiarare modulo                   | `#>`          | esportare                     |
| `::`      | chiamata modulo                     | `.`           | accesso al campo              |
| `#\|..\|` | convertire in numero               | `#?`          | metadati di tipo              |
| `#.N\|..\|` | arrotondare                      | `#!N\|..\|`   | troncare                      |
| `#,\|..\|` | formato virgola                    | `#^\|..\|`     | scientifico                   |
| `#d0d9#` | cambio modalità numerica | `#09#` | ripristina in ASCII |
| `<\ ..\>` | esecuzione shell                   | `>\<`         | argomenti CLI                 |

## Registro delle Modifiche

### v0.0.3 — Sistemi Numerici Unicode & Miglioramenti LSP _(Aprile 2026)_

- **Aggiunto** 69 blocchi di cifre Unicode con il token di commutazione `#d0d9#`
- **Aggiunto** Letterali booleani in qualsiasi script — `#१` / `#०`, `#١` / `#٠`, ecc.
- **Aggiunto** Cifre Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Aggiunto** Opcode VM `SetNumeralMode` — parità completa con il tree-walker
- **Aggiunto** Il REPL rispetta il modo numerico attivo nell'eco e nella visualizzazione delle variabili
- **Modificato** L'output `>>` dei booleani include ora il prefisso `#` (`#0` / `#1`) in tutte le modalità

### v0.0.2_01 — Rinomina degli Operatori _(30 Mar 2026)_

- **Modificato** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — coerente con la famiglia di prefissi `#`
- **Aggiunto** Alias di esportazione: riesportare membri di modulo con un nome diverso

### v0.0.2 — Riprogettazione dell'API Collezioni & Installer _(24 Mar 2026)_

- **Aggiunto** Famiglia di operatori `$` unificata per array e stringhe (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Aggiunto** Destrutturazione per array, tuple e tuple con nome
- **Aggiunto** Indici negativi (`arr[-1]` = ultimo elemento)
- **Aggiunto** Installer nativi — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Aggiunto** Assegnazione composta `^=`
- **Corretto** Casi limite del parser aritmetico; correzioni alla documentazione

### v0.0.1 — Rilascio Pubblico Iniziale _(22 Mar 2026)_

- Interprete tree-walker + VM a registri (`--vm`, ~4× più veloce, ~95% di parità)
- Tutti i costrutti principali: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificatori Unicode completi, sistema di moduli, lambda, closure, gestione degli errori
- REPL, LSP, estensione VS Code, formattatore (`zymbol fmt`)

---

> **Avvertenza:** Questa documentazione è stata creata e tradotta dall'intelligenza artificiale (IA).
> Sono stati compiuti tutti gli sforzi per garantire l'accuratezza, ma alcune traduzioni o esempi potrebbero contenere errori.
> Il riferimento canonico è la [specifica Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
