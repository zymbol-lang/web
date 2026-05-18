> **Avviso:** Questa documentazione è stata creata con l'assistenza dell'intelligenza artificiale (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Il riferimento canonico è **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nel repository dell'interprete.

---

# Manuale di Zymbol-Lang

**Zymbol-Lang** è un linguaggio di programmazione simbolico. Nessuna parola chiave — tutto è un simbolo. Funziona in modo identico in qualsiasi lingua umana.

- Nessun `if`, `while`, `return` — solo `?`, `@`, `<~`
- Unicode completo — identificatori in qualsiasi lingua o emoji
- Agnostico alla lingua umana — il codice è lo stesso ovunque

**Versione dell'interprete**: v0.0.4 | **Copertura dei test**: 393/393 (parità TW ↔ VM)

---

## Variabili e Costanti

```zymbol
x = 10              // variabile mutabile
PI := 3.14159       // costante — la riassegnazione è un errore a runtime
nome = "Alice"
attivo = #1         // booleano vero
👋 := "Ciao"
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

## Tipi di Dati

| Tipo | Letterale | Tag `#?` | Note |
|------|-----------|----------|------|
| Intero | `42`, `-7` | `###` | 64 bit con segno |
| Decimale | `3.14`, `1.5e10` | `##.` | Notazione scientifica OK |
| Stringa | `"testo"` | `##"` | Interpolazione: `"Ciao {nome}"` |
| Carattere | `'A'` | `##'` | Singolo carattere Unicode |
| Booleano | `#1`, `#0` | `##?` | NON numerico — `#1 ≠ 1` |
| Vettore | `[1, 2, 3]` | `##]` | Elementi omogenei |
| Tupla | `(a, b)` | `##)` | Posizionale |
| Tupla nominata | `(x: 1, y: 2)` | `##)` | Campi nominati |
| Funzione | riferimento a funzione nominata | `##()` | Primo ordine; mostra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Primo ordine; mostra `<lambd/N>` |

```zymbol
// Introspezione del tipo — restituisce (tipo, cifre, valore)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output e Input

```zymbol
>> "Ciao Mondo" ¶                  // ¶ o \\ per andare a capo esplicitamente
>> "a=" a " b=" b ¶               // giustapposizione — valori multipli
>> (arr$#) ¶                      // gli operatori postfix richiedono ( ) in >>

<< nome                           // leggi in variabile (senza prompt)
<< "Inserisci nome: " nome        // con prompt
```

> `¶` (AltGr+R sulla tastiera spagnola) e `\\` sono equivalenti come andare a capo.

---

## Operatori

```zymbol
// Aritmetica — usare le assegnazioni; alcuni operatori hanno comportamenti particolari direttamente in >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisione intera)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (esponenziazione)

// Confronto
a == b    // #0
a <> b    // #1
a < b      // #0
a <= b    // #0
a > b      // #1
a >= b     // #1

// Logica
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Stringhe

```zymbol
// Due forme di concatenazione
nome = "Alice"
n = 42

>> "Ciao " nome " hai " n ¶            // giustapposizione — in >>
desc = "Ciao {nome}, hai {n}"          // interpolazione — in qualsiasi contesto
```

```zymbol
s = "Ciao Mondo"
len = s$#                  // 10
sub = s$[1..4]             // "Ciao"  (base 1, fine inclusiva)
has = s$? "Mondo"          // #1
parti = "a,b,c,d"$/ ','   // [a, b, c, d]  (dividi per delimitatore)
rep = s$~~["o":"0"]        // "Cia0 M0nd0"
rep1 = s$~~["o":"0":1]    // "Cia0 Mondo"  (solo il primo)
```

> `+` è solo per numeri. Usare `,`, giustapposizione o interpolazione per le stringhe.

---

## Controllo del Flusso

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

> Le parentesi graffe `{ }` sono **obbligatorie** anche per una singola istruzione.

---

## Match

```zymbol
// Intervalli
punteggio = 85
voto = ?? punteggio {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> voto ¶    // → B

// Stringhe
colore = "rosso"
codice = ?? colore {
    "rosso"  : "#FF0000"
    "verde"  : "#00FF00"
    _        : "#000000"
}

// Schemi di confronto
temp = -5
stato = ?? temp {
    < 0  : "ghiaccio"
    < 20 : "freddo"
    < 35 : "tiepido"
    _    : "caldo"
}
>> stato ¶    // → ghiaccio

// Forma a istruzione (blocchi)
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
>> n ¶                        // → 128  (mentre)

frutta = ["mela", "pera", "uva"]
@ f:frutta { >> f ¶ }         // per ogni elemento

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

// Ciclo con etichetta (interrompi ciclo esterno)
contatore = 0
@:esterno {
    contatore++
    ? contatore >= 3 { @:esterno! }
}
>> contatore ¶                // → 3
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

Le funzioni hanno **scope isolato** — non possono leggere variabili esterne. Usare i parametri di output `<~` per modificare le variabili del chiamante:

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

> Le funzioni nominate sono **valori di primo ordine** — possono essere passate direttamente: `nums$> raddoppiare`. Per avvolgerle: `x -> fn(x)` è anche valido.

---

## Lambda e Closure

```zymbol
raddoppiare = x -> x * 2
somma = (a, b) -> a + b
>> raddoppiare(5) ¶    // → 10
>> somma(3, 7) ¶       // → 10

// Lambda con blocco
classificare = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}

// Closure — cattura lo scope esterno
fattore = 3
triplo = x -> x * fattore
>> triplo(7) ¶    // → 21

// Factory
crea_sommatore(n) { <~ x -> x + n }
somma10 = crea_sommatore(10)
>> somma10(5) ¶    // → 15

// Nei vettori
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Vettori

I vettori sono **mutabili** e contengono elementi dello **stesso tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — accesso (base 1: primo elemento)
arr[-1]         // 5 — indice negativo (ultimo elemento)
arr$#           // 5 — lunghezza (usare (arr$#) in >>)

arr = arr$+ 6            // aggiungi → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserisci in posizione 2 (base 1)
arr3 = arr$- 3           // rimuovi la prima occorrenza del valore
arr4 = arr$-- 3          // rimuovi tutte le occorrenze
arr5 = arr$-[1]          // rimuovi all'indice 1 (primo elemento)
arr6 = arr$-[2..3]       // rimuovi intervallo (base 1, fine inclusiva)

has = arr$? 3            // #1 — contiene
pos = arr$?? 3           // [3] — tutti gli indici del valore (base 1)
sl = arr$[1..3]          // [1,2,3] — slice (base 1, fine inclusiva)
sl2 = arr$[1:3]          // [1,2,3] — uguale, sintassi per conteggio

asc = arr$^+             // ordinato crescente  (solo primitivi)
desc = arr$^-            // ordinato decrescente (solo primitivi)

// Vettori di tuple nominate/posizionali — usare $^ con lambda comparatore
dati = [(nome:"Carla",eta:28),(nome:"Ana",eta:25),(nome:"Bob",eta:30)]
per_eta   = dati$^ (a, b -> a.eta < b.eta)       // crescente per età  (<)
per_nome  = dati$^ (a, b -> a.nome > b.nome)     // decrescente per nome (>)
>> per_eta[1].nome ¶     // → Ana
>> per_nome[1].nome ¶    // → Carla

// Aggiornamento diretto dell'elemento (solo vettori)
arr[1] = 99              // assegna
arr[2] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Aggiornamento funzionale — restituisce un nuovo vettore; l'originale non cambia
arr2 = arr[2]$~ 99
```

> Tutti gli operatori di collezione restituiscono un **nuovo vettore**. Riassegnare: `arr = arr$+ 4`.
> `$+` può essere concatenato: `arr = arr$+ 5$+ 6$+ 7`. Gli altri operatori usano assegnazioni intermedie.
> **Indicizzazione base 1**: `arr[1]` è il primo elemento; `arr[0]` è un errore a runtime.
> `$^+` / `$^-` ordinano **vettori di primitivi** (numeri, stringhe). Per vettori di tuple usare `$^` con un lambda comparatore — la direzione è codificata nel lambda (`<` = crescente, `>` = decrescente).

**Semantica del valore** — assegnare un vettore a un'altra variabile crea una copia indipendente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b non è influenzato
```

```zymbol
// Vettori annidati (indicizzazione base 1)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (riga 2, colonna 3)
```

---

## Destrutturazione

```zymbol
// Vettore
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[primo, *resto] = arr        // primo=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ scarta

// Tupla posizionale
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Tupla nominata
persona = (nome: "Ana", eta: 25, citta: "Roma")
(nome: n, eta: e) = persona  // n="Ana"  e=25
```

---

## Tuple

Le tuple sono contenitori ordinati **immutabili** che possono contenere valori di **tipi diversi**.
A differenza dei vettori, gli elementi non possono essere modificati dopo la creazione.

```zymbol
// Posizionale — tipi misti consentiti
punto = (10, 20)
>> punto[1] ¶    // → 10

dati = (42, "ciao", #1, 3.14)
>> dati[3] ¶     // → #1

// Nominata
persona = (nome: "Alice", eta: 25)
>> persona.nome ¶    // → Alice
>> persona[1] ¶      // → Alice  (indice funziona anche, base 1)

// Annidata
pos = (x: 10, y: 20)
p = (pos: pos, etichetta: "origine")
>> p.pos.x ¶        // → 10
```

**Immutabilità** — qualsiasi tentativo di modificare un elemento di una tupla è un errore a runtime:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ errore a runtime: le tuple sono immutabili
// t[1] += 5    // ❌ stesso errore
```

Per derivare un valore modificato usare `$~` (aggiornamento funzionale) — restituisce una **nuova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originale invariato
>> t2 ¶    // → (10, 999, 30)

// Tupla nominata — ricostruire esplicitamente
persona = (nome: "Alice", eta: 25)
piu_grande  = (nome: persona.nome, eta: 26)
>> persona.eta ¶    // → 25
>> piu_grande.eta ¶ // → 26
```

---

## Funzioni di Ordine Superiore

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

raddoppiati = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pari         = nums$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
totale       = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Concatenare tramite variabili intermedie
passo1 = nums$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Le funzioni nominate possono essere passate direttamente alle HOF
raddoppiare(x) { <~ x * 2 }
e_grande(x) { <~ x > 5 }
r = nums$> raddoppiare       // ✅ riferimento diretto
r = nums$| e_grande          // ✅ riferimento diretto
```

---

## Operatore Pipe

Il lato destro richiede sempre `_` come segnaposto per il valore:

```zymbol
raddoppiare = x -> x * 2
sommare = (a, b) -> a + b
inc = x -> x + 1

5 |> raddoppiare(_)        // → 10
10 |> sommare(_, 5)        // → 15
5 |> sommare(2, _)         // → 7

// Concatenato
r = 5 |> raddoppiare(_) |> inc(_) |> raddoppiare(_)
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
    >> "viene sempre eseguito" ¶
}
```

| Tipo | Quando si verifica |
|------|-------------------|
| `##Div` | Divisione per zero |
| `##IO` | File / sistema |
| `##Index` | Indice fuori dai limiti |
| `##Type` | Tipo non corrispondente |
| `##Parse` | Parsing dei dati |
| `##Network` | Errori di rete |
| `##_` | Qualsiasi errore (catch-all) |

---

## Moduli

```zymbol
// lib/calc.zy — il corpo del modulo è racchiuso tra parentesi graffe
# calc {
    #> { sommare, get_PI }

    _PI := 3.14159
    sommare(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias obbligatorio

>> c::sommare(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Esportare con un nome pubblico diverso
# mialib {
    #> { _sommare_interno <= somma }

    _sommare_interno(a, b) { <~ a + b }
}
```

```zymbol
<# ./mialib <= m

>> m::somma(3, 4) ¶    // → 7  (il nome interno _sommare_interno rimane nascosto)
```

> **Regole dei moduli**: solo `#>`, definizioni di funzioni e inizializzatori letterali sono consentiti dentro `# nome { }`. Le istruzioni eseguibili (`>>`, `<<`, cicli, ecc.) generano l'errore E013.

---

## Sistemi Numerici

Zymbol può visualizzare numeri in **69 sistemi di cifre Unicode** — Devanagari, Arabo-Indico, Thailandese, Klingon pIqaD, Grassetto Matematico, segmenti LCD e altro. La modalità attiva influisce solo sull'output `>>`; l'aritmetica interna è sempre binaria.

### Attivare un sistema

Scrivi la cifra `0` e la cifra `9` del sistema desiderato tra `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabo-Indico  (U+0660–U+0669)
#๐๙#    // Thailandese   (U+0E50–U+0E59)
#09#    // reimposta ASCII
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
>> x ¶          // → #१   (il risultato del confronto segue la modalità attiva)
```

### Cifre native nel codice sorgente

Le cifre di qualsiasi sistema supportato sono letterali validi — in intervalli, modulo, confronti:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Letterali booleani in qualsiasi sistema

`#` + cifra `0` o `1` di qualsiasi blocco supportato è un letterale booleano valido:

```zymbol
#٠٩#
نشط = #١        // uguale a #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` è **sempre ASCII**. `#0` (falso) è sempre visivamente distinto da `0` (zero intero) in qualsiasi sistema.

---

## Operatori sui Dati

```zymbol
// Conversioni di tipo
##.42         // → 42.0  (a Decimale)
###3.7        // → 4     (a Intero, arrotonda)
##!3.7        // → 3     (a Intero, tronca)

// Analisi stringa in numero
v1 = #|"42"|      // → 42  (Intero)
v2 = #|"3.14"|    // → 3.14  (Decimale)
v3 = #|"abc"|     // → "abc"  (sicuro, nessun errore, restituisce originale)

// Arrotondare / troncare
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrotonda a 2 decimali)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tronca)

// Formattazione numerica
fmt = #,|1234567|      // → 1,234,567  (con virgole)
sci = #^|12345.678|    // → 1.2345678e4  (notazione scientifica)

// Letterali in altre basi
a = 0x41         // → 'A'  (esadecimale → carattere)
b = 0b01000001   // → 'A'  (binario → carattere)
c = 0o101        // → 'A'  (ottale → carattere)

// Conversione in rappresentazione di base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrazione con la Shell

```zymbol
data = <\ date +%Y-%m-%d \>      // cattura stdout (include \n finale)
>> "Oggi: " data

file = "dati.txt"
contenuto = <\ cat {file} \>     // interpolazione nei comandi

output = </"./subscript.zy"/>    // esegui un altro script Zymbol, cattura output
>> output
```

> `><` cattura gli argomenti CLI come vettore di stringhe (solo tree-walker).

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

## Riferimento ai Simboli

| Simbolo | Operazione | Simbolo | Operazione |
|---------|-----------|---------|-----------|
| `=` | variabile | `$#` | lunghezza |
| `:=` | costante | `$+` | aggiungi (concatenabile) |
| `>>` | output | `$+[i]` | inserisci all'indice (base 1) |
| `<<` | input | `$-` | rimuovi 1ª occorrenza |
| `¶` / `\\` | a capo | `$--` | rimuovi tutte |
| `?` | se | `$-[i]` | rimuovi all'indice (base 1) |
| `_?` | altrimenti se | `$-[i..j]` | rimuovi intervallo (base 1) |
| `_` | altrimenti / jolly | `$?` | contiene |
| `??` | match | `$??` | trova tutti gli indici (base 1) |
| `@` | ciclo | `$[s..e]` | slice (base 1) |
| `@ N { }` | ciclo N volte | `$>` | map |
| `@!` | interrompi | `$\|` | filter |
| `@>` | continua | `$<` | reduce |
| `@:nome { }` | ciclo con etichetta | `$/ delim` | dividi stringa |
| `@:nome!` | interrompi etichetta | `$++ a b c` | costruzione concat |
| `@:nome>` | continua etichetta | `arr[i>j>k]` | indice di navigazione |
| `->` | lambda | `arr[i] = val` | aggiorna elemento (solo vettori) |
| `arr[i] += val` | aggiornamento composto | `arr[i]$~` | aggiornamento funzionale (nuova copia) |
| `$^+` | ordina crescente (primitivi) | `$^-` | ordina decrescente (primitivi) |
| `$^` | ordina con comparatore (tuple) | `<~` | restituisci |
| `\|>` | pipe | `!?` | prova |
| `:!` | cattura | `:>` | sempre |
| `#1` | vero | `#0` | falso |
| `$!` | è errore | `$!!` | propaga errore |
| `<#` | importa | `#>` | esporta |
| `#` | dichiara modulo | `::` | chiama modulo |
| `.` | accesso al campo | `#?` | metadato del tipo |
| `#\|..\|` | analizza numero | `##.` | converti a Decimale |
| `###` | converti a Intero (arrotonda) | `##!` | converti a Intero (tronca) |
| `#.N\|..\|` | arrotonda | `#!N\|..\|` | tronca |
| `#,\|..\|` | formato con virgole | `#^\|..\|` | notazione scientifica |
| `#d0d9#` | cambio sistema numerico | `#09#` | reimposta ASCII |
| `<\ ..\>` | esegui shell | `>\<` | argomenti CLI |
| `\ var` | distruggi variabile esplicitamente | | |

---

## Cronologia delle Versioni

### v0.0.4 — Indicizzazione Base 1, Funzioni di Primo Ordine & Blocchi di Modulo _(Aprile 2026)_

- **Modifica importante** Tutta l'indicizzazione cambiata a **base 1** — `arr[1]` è il primo elemento; `arr[0]` è un errore a runtime
- **Aggiunto** Le funzioni nominate sono **valori di primo ordine** — passabili direttamente alle HOF: `nums$> raddoppiare`
- **Aggiunto** **Sintassi a blocco obbligatoria** nei moduli: `# nome { ... }` — sintassi piatta rimossa
- **Aggiunto** Indicizzazione multidimensionale: `arr[i>j>k]` (navigazione), `arr[p ; q]` (estrazione piatta)
- **Aggiunto** Conversioni di tipo: `##.expr` (Decimale), `###expr` (Intero arrotonda), `##!expr` (Intero tronca)
- **Aggiunto** Divisione stringa: `str$/ delim` — restituisce `Vettore(Stringa)`
- **Aggiunto** Costruzione concat: `base$++ a b c` — aggiunge più elementi
- **Aggiunto** Ciclo N volte: `@ N { }` — esegue esattamente N iterazioni
- **Aggiunto** Sintassi ciclo con etichetta: `@:nome { }`, `@:nome!`, `@:nome>` — sostituisce `@ @nome` / `@! nome`
- **Aggiunto** Regole di scope delle variabili: le variabili `_nome` hanno scope esatto di blocco; `\ var` distrugge anticipatamente
- **Aggiunto** Schemi di confronto nel match: `< 0 :`, `> 5 :`, `== 42 :`, ecc.
- **Aggiunto** Errore E013 nei moduli: le istruzioni eseguibili nel corpo del modulo sono vietate
- **Corretto** `take_variable` non corrompe più le costanti del modulo in scrittura
- **Corretto** `alias.CONST` ora si risolve correttamente; `#>` può comparire dopo le definizioni di funzioni
- **VM** Parità totale: 393/393 test superati

### v0.0.3 — Sistemi Numerici Unicode & Miglioramenti LSP _(Aprile 2026)_

- **Aggiunto** 69 blocchi di cifre Unicode con token di cambio modalità `#d0d9#`
- **Aggiunto** Letterali booleani in qualsiasi sistema — `#१` / `#०`, `#١` / `#٠`, ecc.
- **Aggiunto** Cifre Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Aggiunto** Opcode VM `SetNumeralMode` — parità completa con il tree-walker
- **Aggiunto** Il REPL rispetta la modalità numerica attiva in eco e visualizzazione delle variabili
- **Modificato** L'output booleano `>>` ora include il prefisso `#` (`#0` / `#1`) in tutte le modalità

### v0.0.2_01 — Rinomina degli Operatori _(30 Mar 2026)_

- **Modificato** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — coerente con la famiglia di prefisso `#`
- **Aggiunto** Alias di esportazione: ri-esporta i membri del modulo con un nome diverso

### v0.0.2 — Ridisegno delle Collezioni & Installatori _(24 Mar 2026)_

- **Aggiunto** Famiglia unificata di operatori `$` per vettori e stringhe (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Aggiunto** Destrutturazione per vettori, tuple e tuple nominate
- **Aggiunto** Indici negativi (`arr[-1]` = ultimo elemento)
- **Aggiunto** Installatori nativi — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Aggiunto** Assegnazione composta `^=`
- **Corretto** Casi limite nell'aritmetica del parser; correzioni alla documentazione

### v0.0.1 — Prima Versione Pubblica _(22 Mar 2026)_

- Interprete tree-walker + VM a registri (`--vm`, ~4× più veloce, ~95% di parità)
- Tutti i costrutti base: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificatori Unicode completi, sistema di moduli, lambda, closure, gestione degli errori
- REPL, LSP, estensione VS Code, formattatore (`zymbol fmt`)

---

_Zymbol-Lang — Simbolico. Universale. Immutabile._
