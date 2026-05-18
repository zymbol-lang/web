> **Avvertenza:** Questa documentazione è stata creata con l'assistenza dell'intelligenza artificiale (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Il riferimento canonico è **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nel repository dell'interprete.

---

# Manuale di Zymbol-Lang

> **Revisionato per v0.0.5 — 2026-05-12**

**Zymbol-Lang** è un linguaggio di programmazione simbolico. Nessuna parola chiave — tutto è un simbolo. Funziona in modo identico in qualsiasi lingua umana.

- Nessun `if`, `while`, `return` — solo `?`, `@`, `<~`
- Unicode completo — identificatori in qualsiasi lingua o emoji
- Indipendente dalla lingua — il codice è identico ovunque

**Versione interprete**: v0.0.5 | **Copertura test**: 436/436 (TW ↔ VM parità)

---

## Variabili & Costanti

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

`°` (segno di grado, U+00B0) inizializza automaticamente una variabile al suo valore neutro al primo utilizzo:

```zymbol
numeri = [3, 1, 4, 1, 5]
@ n:numeri {
    °totale += n    // auto-init a 0 sopra il ciclo; sopravvive dopo @
}
>> totale ¶         // → 14
```

> `°x` (prefisso) si ancora sopra il ciclo — risultato accessibile dopo `@`.
> `x°` (postfisso) si ancora dentro il ciclo — scompare quando il ciclo termina.
> Solo Tree-Walker.

---

## Tipi di Dati

| Tipo | Letterale | `#?` tag | Note |
|------|-----------|----------|------|
| Intero | `42`, `-7` | `###` | 64-bit con segno |
| Decimale | `3.14`, `1.5e10` | `##.` | Notazione scientifica OK |
| Stringa | `"testo"` | `##"` | Interpolazione: `"Ciao {nome}"` |
| Carattere | `'A'` | `##'` | Singolo carattere Unicode |
| Booleano | `#1`, `#0` | `##?` | NON numerico — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Elementi omogenei |
| Tupla | `(a, b)` | `##)` | Posizionale |
| Tupla Nominata | `(x: 1, y: 2)` | `##)` | Campi nominati |
| Funzione | riferimento a funzione nominata | `##()` | Prima classe; mostra `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prima classe; mostra `<lambd/N>` |

```zymbol
// Introspezione del tipo — restituisce (tipo, cifre, valore)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output & Input

```zymbol
>> "Ciao" ¶                       // ¶ o \\ per nuova riga esplicita
>> "a=" a " b=" b ¶               // giustapposizione — valori multipli
>> (arr$#) ¶                      // gli operatori postfissi richiedono ( ) in >>

<< nome                           // leggi in variabile (nessun prompt)
<< "Inserisci nome: " nome        // con prompt
```

> `¶` (AltGr+R su tastiera spagnola) e `\\` sono nuove righe equivalenti.

---

## Primitive TUI

Operatori interfaccia terminale per programmi interattivi. La maggior parte richiede un blocco `>>| { }` (schermo alternativo + modalità raw).

```zymbol
>>| {
    >>!                              // pulisci schermo alternativo
    >>~ (1, 1, 0, 10) > "In esecuzione"  // riga 1, col 1, fg=10 (verde)
    @~ 1000                          // pausa 1 secondo (1000 ms)
    >>~ (2, 1) > "Fatto."
}
// terminale ripristinato automaticamente all'uscita
```

```zymbol
// Tasto premuto e dimensioni terminale
>>| {
    [righe, colonne] = >>?           // interroga dimensioni terminale
    >>~ (1, 1) > "Terminale: " righe " x " colonne
    <<| tasto                        // lettura tasto bloccante
    >>~ (2, 1) > "Premuto: " tasto
}
```

> `>>!` pulisce schermo. `>>?` restituisce `[righe, colonne]`. `@~ N` attende N millisecondi.
> `<<|` legge un tasto (bloccante); `<<|?` sonda senza bloccare (restituisce `'\0'` se nessuno).
> Tupla output posizionato: `(riga, colonna, BKS, fg, bg)` — qualsiasi slot può essere omesso con virgola (`>>~ (,,, 196) > "rosso"`).
> Maschera BKS: `1`=Grassetto, `2`=Corsivo, `4`=Sottolineato. Palette ANSI 256-colori (`0`=default terminale).
> Solo Tree-Walker (tranne `>>!`, `>>?`, `@~`, `>>~` che funzionano anche in `--vm`).

---

## Operatori

```zymbol
// Aritmetica
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisione intera)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (elevamento a potenza)

// Confronto — assegnare per ispezionare
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logica
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Stringhe

```zymbol
// Due forme di concatenazione
nome = "Alice"
n = 42

>> "Ciao " nome " hai " n ¶         // giustapposizione — in >>
descr = "Ciao {nome}, hai {n}"      // interpolazione — ovunque
```

```zymbol
s = "Ciao Mondo"
lung = s$#                  // 11
sub = s$[1..4]              // "Ciao"  (1-based, fine inclusa)
ha = s$? "Mondo"            // #1
parti = "a,b,c,d"$/ ','     // [a, b, c, d]  (dividi per delimitatore)
sost = s$~~["o":"0"]        // "Cia0 M0nd0"
sost1 = s$~~["o":"0":1]     // "Cia0 Mondo"  (solo primi N)
linea = "─" $* 20           // "────────────────────"  (ripeti N volte)
```

> `+` è solo per numeri. Usa `,`, giustapposizione o interpolazione per le stringhe.

---

## Flusso di Controllo

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

## Corrispondenza

```zymbol
// Intervalli
punteggio = 85
voto = ?? punteggio {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> voto ¶    // → B

// Stringhe
colore = "rosso"
codice = ?? colore {
    "rosso"  => "#FF0000"
    "verde"  => "#00FF00"
    _        => "#000000"
}

// Pattern di confronto
temp = -5
stato = ?? temp {
    < 0  => "ghiaccio"
    < 20 => "freddo"
    < 35 => "tiepido"
    _    => "caldo"
}
>> stato ¶    // → ghiaccio

// Forma istruzione (braccia a blocco)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negativo" ¶ }
    _    => { >> "positivo" ¶ }
}
```

---

## Cicli

```zymbol
@ i:0..4  { >> i " " }        // intervallo inclusivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // con passo:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverso:               5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frutti = ["mela", "pera", "uva"]
@ f:frutti { >> f ¶ }         // per ogni elemento dell'array

@ c:"ciao" { >> c "-" }
>> ¶                          // → c-i-a-o-  (per ogni carattere)

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

// Ciclo etichettato (interruzione annidata)
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
somma(a, b) { <~ a + b }
>> somma(3, 4) ¶    // → 7

fattoriale(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fattoriale(n - 1)
}
>> fattoriale(5) ¶    // → 120
```

Le funzioni hanno **scope isolato** — non possono leggere variabili esterne. Usa i parametri di output `<~` per modificare le variabili del chiamante:

```zymbol
scambia(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
scambia(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Le funzioni nominate sono **valori di prima classe** — passa direttamente: `numeri$> raddoppia`. Per incapsulare: `x -> fn(x)` è anch'esso valido.

---

## Lambda & Closure

```zymbol
raddoppia = x -> x * 2
somma = (a, b) -> a + b
>> raddoppia(5) ¶    // → 10
>> somma(3, 7) ¶     // → 10

// Lambda a blocco
classifica = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}

// Closure — cattura scope esterno
fattore = 3
triplica = x -> x * fattore
>> triplica(7) ¶    // → 21

// Fabbrica
crea_sommatore(n) { <~ x -> x + n }
aggiungi10 = crea_sommatore(10)
>> aggiungi10(5) ¶    // → 15

// Negli array
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Array

Gli array sono **mutabili** e contengono elementi dello **stesso tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — accesso (1-based: primo elemento)
x = arr[-1]     // 5 — indice negativo (ultimo elemento)
x = arr$#       // 5 — lunghezza (usa (arr$#) in >>)

arr = arr$+ 6            // aggiungi → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // inserisci alla posizione 2 (1-based)
arr3 = arr$- 3           // rimuovi prima occorrenza del valore
arr4 = arr$-- 3          // rimuovi tutte le occorrenze
arr5 = arr$-[1]          // rimuovi all'indice 1 (primo elemento)
arr6 = arr$-[2..3]       // rimuovi intervallo (1-based, fine inclusa)

ha = arr$? 3             // #1 — contiene
pos = arr$?? 3           // [3] — tutti gli indici del valore (1-based)
sl = arr$[1..3]          // [1,2,3] — slice (1-based, fine inclusa)
sl2 = arr$[1:3]          // [1,2,3] — stesso, sintassi basata su conteggio

asc = arr$^+             // ordinato crescente  (solo primitivi)
desc = arr$^-            // ordinato decrescente (solo primitivi)

// Array di tuple nominate/posizionali — usa $^ con lambda comparatore
db = [(nome: "Carla", eta: 28), (nome: "Ana", eta: 25), (nome: "Bob", eta: 30)]
per_eta  = db$^ (a, b -> a.eta < b.eta)    // crescente per età  (<)
per_nome = db$^ (a, b -> a.nome > b.nome)  // decrescente per nome (>)
>> per_eta[1].nome ¶     // → Ana
>> per_nome[1].nome ¶    // → Carla

// Aggiornamento diretto elemento (solo array)
arr[1] = 99              // assegna
arr[2] += 5              // composto: +=  -=  *=  /=  %=  ^=

// Aggiornamento funzionale — restituisce nuovo array; originale invariato
arr2 = arr[2]$~ 99
```

> Tutti gli operatori di collezione restituiscono un **nuovo array**. Riassegna: `arr = arr$+ 4`.
> `$+` può essere concatenato: `arr = arr$+ 5$+ 6$+ 7`. Gli altri operatori usano assegnazioni intermedie.
> **L'indicizzazione è 1-based**: `arr[1]` è il primo elemento; `arr[0]` è un errore a runtime.
> `$^+` / `$^-` ordinano **array primitivi** (numeri, stringhe). Per array di tuple usa `$^` con lambda comparatore — la direzione è codificata nella lambda (`<` = crescente, `>` = decrescente).

**Semantica per valore** — assegnare un array a un'altra variabile crea una copia indipendente:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b non è affetto
```

```zymbol
// Array annidati (indicizzazione 1-based)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (riga 2, colonna 3)
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
(nome: n, eta: e) = persona  // n="Ana"  e=25
```

---

## Tuple

Le tuple sono **contenitori ordinati immutabili** che possono contenere valori di **tipi diversi**.
A differenza degli array, gli elementi non possono essere modificati dopo la creazione.

```zymbol
// Posizionale — tipi misti consentiti
punto = (10, 20)
>> punto[1] ¶    // → 10

dati = (42, "ciao", #1, 3.14)
>> dati[3] ¶     // → #1

// Nominata
persona = (nome: "Alice", eta: 25)
>> persona.nome ¶    // → Alice
>> persona[1] ¶      // → Alice  (l'indice funziona anche, 1-based)

// Annidata
pos = (x: 10, y: 20)
p = (pos: pos, etichetta: "origine")
>> p.pos.x ¶        // → 10
```

**Immutabilità** — qualsiasi tentativo di modificare un elemento di tupla è un errore a runtime:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ errore a runtime: le tuple sono immutabili
// t[1] += 5    // ❌ stesso errore
```

Per derivare un valore modificato usa `$~` (aggiornamento funzionale) — restituisce una **nuova** tupla:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originale invariato
>> t2 ¶    // → (10, 999, 30)

// Tupla nominata — ricostruisci esplicitamente
persona = (nome: "Alice", eta: 25)
piu_vecchia  = (nome: persona.nome, eta: 26)
>> persona.eta ¶       // → 25
>> piu_vecchia.eta ¶   // → 26
```

---

## Funzioni di Ordine Superiore

```zymbol
numeri = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

raddoppiati = numeri$> (x -> x * 2)               // map  → [2,4,6…20]
pari        = numeri$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
totale      = numeri$< (0, (acc, x) -> acc + x)    // reduce → 55

// Catena tramite intermedi
passo1 = numeri$| (x -> x > 3)
passo2 = passo1$> (x -> x * x)
>> passo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Le funzioni nominate possono essere passate direttamente alle HOF
raddoppia(x) { <~ x * 2 }
e_grande(x) { <~ x > 5 }
r = numeri$> raddoppia    // ✅ riferimento diretto
r = numeri$| e_grande     // ✅ riferimento diretto
```

---

## Operatore Pipe

Il lato destro richiede sempre `_` come segnaposto per il valore instradato:

```zymbol
raddoppia = x -> x * 2
aggiungi = (a, b) -> a + b
incrementa = x -> x + 1

r1 = 5 |> raddoppia(_)             // → 10
r2 = 10 |> aggiungi(_, 5)          // → 15
r3 = 5 |> aggiungi(2, _)           // → 7

// Concatenato
r = 5 |> raddoppia(_) |> incrementa(_) |> raddoppia(_)
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
    >> "altro: " _err ¶    // _err contiene il messaggio di errore
} :> {
    >> "esegue sempre" ¶
}
```

| Tipo | Quando |
|------|--------|
| `##Div` | Divisione per zero |
| `##IO` | File / sistema |
| `##Index` | Indice fuori dai limiti |
| `##Type` | Mismatch di tipo |
| `##Parse` | Parsing dati |
| `##Network` | Errori di rete |
| `##_` | Qualsiasi errore (catch-all) |

---

## Moduli

```zymbol
// lib/calcolo.zy — il corpo del modulo è racchiuso tra parentesi graffe
# calcolo {
    #> { somma, ottieni_PI }

    _PI := 3.14159
    somma(a, b) { <~ a + b }
    ottieni_PI() { <~ _PI }
}
```

```zymbol
// principale.zy
<# ./lib/calcolo => c    // alias obbligatorio

>> c::somma(5, 3) ¶      // → 8
pi = c::ottieni_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Esporta con un nome pubblico diverso
# mialib {
    #> { _somma_interna => somma }

    _somma_interna(a, b) { <~ a + b }
}
```

```zymbol
<# ./mialib => m

>> m::somma(3, 4) ¶    // → 7  (il nome interno _somma_interna è nascosto)
```

> **Regole moduli**: solo `#>`, definizioni di funzione e inizializzatori letterali di variabili/costanti sono consentiti dentro `# nome { }`. Le istruzioni eseguibili (`>>`, `<<`, cicli, ecc.) generano l'errore E013.

---

## Modalità Numeriche

Zymbol può visualizzare i numeri in **69 script di cifre Unicode** — Devanagari, Arabo-Indico, Thai, Klingon pIqaD, Matematico Grassetto, segmenti LCD e altro. La modalità attiva influenza solo l'output `>>`; l'aritmetica interna è sempre binaria.

### Attivare uno script

Scrivi la cifra `0` e `9` dello script target racchiuse in `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabo-Indico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reimposta ad ASCII
```

### Output e booleani

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predefinito)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto decimale sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleani: prefisso # sempre ASCII, cifra si adatta
>> #1 ¶         // → #१   (vero in Devanagari)
>> #0 ¶         // → #०   (falso — distinto da ० zero intero)

x = 28 > 4
>> x ¶          // → #१   (risultato confronto segue modalità attiva)
```

### Letterali di cifre native nel sorgente

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

`#` + cifra `0` o `1` da qualsiasi blocco è un letterale booleano valido:

```zymbol
#٠٩#
نشط = #١        // uguale a #1
>> نشط ¶        // → #١
>> (#१ && #٠) ¶ // → #٠
```

> `#` è **sempre ASCII**. `#0` (falso) è sempre visivamente distinto da `0` (zero intero) in ogni script.

---

## Operatori di Dati

```zymbol
// Cast di conversione tipo
f = ##.42         // → 42.0  (a Decimale)
i = ###3.7        // → 4     (a Intero, arrotonda)
t = ##!3.7        // → 3     (a Intero, tronca)

// Analizza stringa in numero
v1 = #|"42"|      // → 42  (Intero)
v2 = #|"3.14"|    // → 3.14  (Decimale)
v3 = #|"abc"|     // → "abc"  (fail-safe, nessun errore)

// Arrotonda / Tronca
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrotonda a 2 decimali)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tronca)

// Formattazione numeri
fmt = #,|1234567|      // → 1,234,567  (separato da virgole)
sci = #^|12345.678|    // → 1.2345678e4  (scientifico)

// Letterali di base
a = 0x41         // → 'A'  (esadecimale)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (ottale)

// Output conversione base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrazione Shell

```zymbol
data = <\ date +%Y-%m-%d \>       // cattura stdout (include \n finale)
>> "Oggi: " data

file = "dati.txt"
contenuto = <\ cat {file} \>      // interpolazione nei comandi

output = </"./sottoscript.zy"/>   // esegui altro script Zymbol, cattura output
>> output
```

> `><` cattura gli argomenti CLI come array di stringhe (solo Tree-Walker).

---

## Esempio Completo: FizzBuzz

```zymbol
classifica(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    _ { <~ numero }
}

@ i:1..20 { >> classifica(i) ¶ }
```

---

## Riferimento Simboli

| Simbolo | Operazione | Simbolo | Operazione |
|---------|------------|---------|------------|
| `=` | variabile | `$#` | lunghezza |
| `:=` | costante | `$+` | aggiungi (concatenabile) |
| `>>` | output | `$+[i]` | inserisci all'indice (1-based) |
| `<<` | input | `$-` | rimuovi primo per valore |
| `¶` / `\\` | nuova riga | `$--` | rimuovi tutti per valore |
| `?` | se | `$-[i]` | rimuovi all'indice (1-based) |
| `_?` | altrimenti-se | `$-[i..j]` | rimuovi intervallo (1-based) |
| `_` | altrimenti / jolly | `$?` | contiene |
| `??` | corrispondenza | `$??` | trova tutti gli indici (1-based) |
| `@` | ciclo | `$[s..e]` | slice (1-based) |
| `@ N { }` | ciclo N volte | `$>` | map |
| `@!` | interrompi | `$\|` | filter |
| `@>` | continua | `$<` | reduce |
| `@:nome { }` | ciclo etichettato | `$/ delim` | dividi stringa |
| `@:nome!` | interrompi etichetta | `$++ a b c` | concat build |
| `@:nome>` | continua etichetta | `arr[i>j>k]` | indice navigazione |
| `->` | lambda | `arr[i] = val` | aggiorna elemento (solo array) |
| `arr[i] += val` | aggiornamento composto | `arr[i]$~` | aggiornamento funzionale (nuova copia) |
| `$^+` | ordina crescente (primitivi) | `$^-` | ordina decrescente (primitivi) |
| `$^` | ordina con comparatore (tuple) | `<~` | ritorna |
| `\|>` | pipe | `!?` | prova |
| `:!` | cattura | `:>` | infine |
| `#1` | vero | `#0` | falso |
| `$!` | è errore | `$!!` | propaga errore |
| `<#` | importa | `#>` | esporta |
| `#` | dichiara modulo | `::` | chiamata modulo |
| `.` | accesso campo | `#?` | metadati tipo |
| `#\|..\|` | analizza numero | `##.` | converti a Decimale |
| `###` | converti a Intero (arrotonda) | `##!` | converti a Intero (tronca) |
| `#.N\|..\|` | arrotonda | `#!N\|..\|` | tronca |
| `#,\|..\|` | formato virgola | `#^\|..\|` | scientifico |
| `#d0d9#` | cambia modalità numerica | `#09#` | reimposta ad ASCII |
| `<\ ..\>` | esecuzione shell | `>\<` | argomenti CLI |
| `\ var` | distruggi variabile esplicitamente | `°x` / `x°` | definizione a caldo (auto-init) |
| `>>|` | blocco TUI (schermo alt.) | `>>~` | output posizionato |
| `>>!` | pulisci schermo | `>>?` | interroga dimensioni terminale |
| `<<\|` | lettura tasto bloccante | `<<\|?` | lettura tasto non-bloccante |
| `@~ N` | attendi N millisecondi | `$*` | ripeti stringa N volte |

---

## Changelog Versioni

### v0.0.5 — Primitive TUI, Definizione a Caldo & Ripetizione Stringa _(Maggio 2026)_

- **Breaking** Separatore braccio match: `pattern : risultato` → `pattern => risultato`
- **Breaking** Alias import: `<# percorso <= alias` → `<# percorso => alias`
- **Breaking** Rinomina export: `#> { fn <= pub }` → `#> { fn => pub }`
- **Added** Blocco TUI `>>| { }` — schermo alternativo + modalità raw; ripristina all'uscita
- **Added** Output posizionato `>>~ (riga, col, BKS, fg, bg) > elementi` — slot sparsi, palette ANSI 256-colori
- **Added** Input tasto `<<| var` (bloccante) e `<<|? var` (polling non-bloccante)
- **Added** `>>!` pulisci schermo, `>>?` interroga dimensioni terminale, `@~ N` attendi N millisecondi
- **Added** Definizione a caldo `°x` / `x°` — auto-inizializza variabile al primo utilizzo nei cicli
- **Added** Ripetizione stringa `str $* N` — ripeti una stringa N volte
- **VM** Parità: 436/436 test superati

### v0.0.4 — Indicizzazione 1-Based, Funzioni Prima Classe & Blocchi Modulo _(Aprile 2026)_

- **Breaking** Tutta l'indicizzazione passata a **1-based** — `arr[1]` è il primo elemento; `arr[0]` è un errore a runtime
- **Added** Le funzioni nominate sono **valori di prima classe** — passa direttamente alle HOF: `numeri$> raddoppia`
- **Added** Sintassi **blocco modulo** obbligatoria: `# nome { ... }` — sintassi piatta rimossa
- **Added** Indicizzazione multidimensionale: `arr[i>j>k]` (navigazione), `arr[p ; q]` (estrazione piatta)
- **Added** Cast di conversione tipo: `##.espressione` (Decimale), `###espressione` (Intero arrotonda), `##!espressione` (Intero tronca)
- **Added** Divisione stringa: `str$/ delim` — restituisce `Array(String)`
- **Added** Concat build: `base$++ a b c` — aggiunge più elementi
- **Added** Ciclo N volte: `@ N { }` — ripeti esattamente N volte
- **Added** Sintassi ciclo etichettato: `@:nome { }`, `@:nome!`, `@:nome>` — sostituisce `@ @nome` / `@! nome`
- **Added** Regole scope variabili: variabili `_nome` hanno scope esatto del blocco; `\ var` distrugge presto
- **Added** Pattern di confronto match: `< 0 :`, `> 5 :`, `== 42 :` ecc.
- **Added** Errore modulo E013: le istruzioni eseguibili nel corpo del modulo sono vietate
- **Fixed** `take_variable` non corrompe più le costanti del modulo al write-back
- **Fixed** `alias.CONST` ora si risolve correttamente; `#>` può apparire dopo le definizioni di funzione
- **VM** Parità completa: 393/393 test superati

### v0.0.3 — Sistemi Numerici Unicode & Miglioramenti LSP _(Aprile 2026)_

- **Added** 69 blocchi di cifre Unicode con token di cambio modalità `#d0d9#`
- **Added** Letterali booleani in qualsiasi script — `#१` / `#०`, `#١` / `#٠`, ecc.
- **Added** Cifre Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Added** Opcode VM `SetNumeralMode` — parità completa con tree-walker
- **Added** REPL rispetta la modalità numerica attiva in echo e visualizzazione variabili
- **Changed** Output booleano `>>` ora include prefisso `#` (`#0` / `#1`) in tutte le modalità

### v0.0.2_01 — Rinomina Operatori _(30 Mar 2026)_

- **Changed** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — coerente con famiglia prefisso formato `#`
- **Added** Alias export: ri-esporta membri del modulo con nome diverso

### v0.0.2 — Ridisegno API Collezioni & Installatori _(24 Mar 2026)_

- **Added** Famiglia operatori `$` unificata per array e stringhe (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Assegnazione destrutturazione per array, tuple e tuple nominate
- **Added** Indici negativi (`arr[-1]` = ultimo elemento)
- **Added** Installatori nativi — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Added** Assegnazione composta `^=`
- **Fixed** Casi limite aritmetici del parser; correzioni documentazione

### v0.0.1 — Prima Versione Pubblica _(22 Mar 2026)_

- Interprete tree-walker + VM a registri (`--vm`, ~4× più veloce, ~95% parità)
- Tutti i costrutti base: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificatori Unicode completi, sistema moduli, lambda, closure, gestione errori
- REPL, LSP, estensione VS Code, formattatore (`zymbol fmt`)

---

_Zymbol-Lang — Simbolico. Universale. Immutabile._
