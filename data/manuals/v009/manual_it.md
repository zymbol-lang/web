> **Avviso:** Questa documentazione è stata creata e tradotta da intelligenza artificiale (IA).
> 
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
> 
> Il riferimento canonico è **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nel repository dell'interprete.

---

# Manuale di Zymbol-Lang

> **Revisionato per v0.0.9 — 2026-09-07**

**Zymbol-Lang** è un linguaggio di programmazione simbolico. Nessuna parola nella sua grammatica — ogni costrutto è un segno. Funziona in modo identico in qualsiasi linguaggio umano.

- Nessun `if`, `while`, `return` — solo `?`, `@`, `<~`
- Unicode completo — identificatori in qualsiasi lingua o emoji
- Agnostico rispetto alla lingua umana — il codice è lo stesso ovunque

**Versione dell'interprete**: v0.0.9 | **Copertura dei test**: 660/666 (tre motori d'accordo, 0 divergenti)

---

## Variabili e Costanti

```zymbol
x = 10              // variabile mutabile
PI := 3.14159       // costante — la riassegnazione è un errore di runtime
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
x++       // 5
x--       // 4
```

`°` (segno di grado, U+00B0) inizializza automaticamente una variabile al suo valore neutro al primo utilizzo:

```zymbol
nums = [3, 1, 4, 1, 5]
@ n:nums {
    °totale += n
}
>> totale ¶              // → 14
```

> `°x` (prefisso) ancoraggio sopra il ciclo — il risultato è leggibile dopo `@`.
> `x°` (postfisso) ancoraggio dentro il ciclo — muore quando il ciclo termina.

Un'istruzione che è solo un nome legge la variabile e butta via il valore, quindi lo dice:

```zymbol
conteggio = 5
conteggio
```

Il compilatore lo dice:

```text
warning: this statement does nothing: 'conteggio' is read and discarded
  = help: remove it, or use it — `>> nome ¶` to print it
```

---

## Tipi di Dati

| Tipo | Letterale | `#?` tag | Note |
|------|---------|----------|-------|
| Int | `42`, `-7` | `###` | Intero sicuro: ±(2⁵³ − 1) |
| Float | `3.14`, `1.5e10` | `##.` | IEEE-754 double |
| String | `"testo"` | `##"` | Interpolazione: `"Ciao {nome}"` |
| Char | `'A'` | `##'` | Un grapheme Unicode |
| Bool | `#1`, `#0` | `##?` | NON numerico — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Un tipo, verificato |
| Dichiarato mix | `#[1, "due"]` | `##[` | Stesso tipo di `[…]`, non verificato |
| Tupla | `(a, b)` | `##)` | Posizionale, immutabile |
| Dizionario | `#(x: 1, y: 2)` | `##(` | Chiave, mutabile |
| Funzione | riferimento funzione nominata | `##()` | First-class; display `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-class; display `<lambd/N>` |
| Unit | `##_` | `##_` | Assenza — non c'è null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(a: 1)#? ¶          // → (##(, 1, #(a: 1))
```

Un intero che lascia l'intervallo sicuro è un errore catturabile, mai un avvolgimento silenzioso:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "fuori intervallo" ¶ // → fuori intervallo
}
```

`##_` è come un programma chiede se qualcosa è assente:

```zymbol
nulla() { }
valore = nulla()
>> (valore == ##_) ¶     // → #1
```

---

## Output e Input

```zymbol
nome = "Alice"
totale = 3
>> "Ciao" ¶            // → Ciao
>> "a=" nome " b=" totale ¶ // → a=Alice b=3
>> totale#? ¶            // → (###, 1, 3)
```

```zymbol
<< nome
<< "Inserisci nome: " nome
<< ###(4) "Età: " eta
```

**Guarda la forma dei due segni.** `>>` punta verso l'esterno: porta i dati fuori dal programma. `<<` punta verso l'interno: porta i dati dentro. Non c'è nulla da memorizzare — la freccia mostra la direzione del flusso di informazioni, e la stessa idea torna in ogni segno che sposta qualcosa.

> `¶` e `\\` sono newline equivalenti. `>>` non ne aggiunge mai uno.
> Un typespec prima del prompt valida mentre legge e ri-chiede finché valido:
> `##.` Float · `##.(T,D)` decimale · `###(N)` Int · `##"(N)` testo · `##'` un Char.

Al livello superiore di un file, `<~` è lo stato di uscita del programma:

```zymbol
>> "controllo" ¶         // → controllo
<~ 0
```

---

## Primitive TUI

Operatori interfaccia utente terminale per programmi interattivi. La maggior parte richiede un blocco `>>| { }` (schermo alternativo + modalità raw).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Esecuzione"
    @~ 1000
    >>~ (2, 1) > "Fatto."
}
```

```zymbol
>>| {
    [righe, colonne] = >>?
    >>~ (1, 1) > "Terminale: " righe " x " colonne
    <<| tasto
    >>~ (2, 1) > "Premuto: " tasto
}
```

Ecco perché i segni si combinano invece di moltiplicarsi. Conosci già `<<` come input e `?` come chiede senza impegno. Solo un segno è nuovo:

- `|` è **una singola unità**, non l'intero stream.

Con quello, entrambi i keyborad operator si leggono da soli:

```text
<<        |            ?
input     una unità     senza impegno

<<|   leggi UNA tasto, e attendi fino a quando c'è uno
<<|?  guarda se c'è una tasto, e continua se non c'è
```

Lo stesso dall'altro lato: `>>` manda fuori, `>>!` manda fuori **con forza** (cancella lo schermo intero), e `>>?` **chiede** invece di scrivere (quanto è grande il terminale). Il segno sulla destra è quello che cambia la modalità, e viene sempre per ultimo.

> `>>!` cancella lo schermo. `>>?` ritorna `(righe, colonne)`. `@~ N` dorme N millisecondi.
> `<<|` legge una pressione di tasto (blocco); `<<|?` sondaggi senza blocco (`'\0'` se nessuno).
> I tasti freccia arrivano decodificati come `'↑' '↓' '←' '→'`; ESC è il punto di codice 27.
> Tupla di output posizionato: `(riga, colonna, BKS, fg, bg)` — qualsiasi slot può essere omesso con una virgola (`>>~ (,,, 196) > "rosso"`).
> Maschera BKS: `1`=Grassetto, `2`=Corsivo, `4`=Sottolineato. Tavolozza ANSI 256 colori (`0`=predefinito del terminale).

---

## Operatori

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divisione intera)
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

> `==` non coerce mai: `"5" == 5` è `#0`. L'ordinamento lo fa: `"5" > 4` è `#1`, e così è
> `"४२" > 5` — il testo numerico in uno qualsiasi dei 69 script di cifre confronta come un numero.
> Una funzione è uguale solo a se stessa, mai a un'altra funzione con lo stesso corpo.

---

## Stringhe

```zymbol
nome = "Alice"
n = 42
>> "Ciao " nome " hai " n ¶ // → Ciao Alice hai 42
desc = "Ciao {nome}, hai {n}"
>> desc ¶               // → Ciao Alice, hai 42
```

```zymbol
s = "Ciao Mondo"
len = s$#                  // 11
sub = s$[1..5]             // "Ciao"
has = s$? "Mondo"          // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "CiaoL MondoL"
line = "─" $* 20
```

> `+` è solo per i numeri. Usa giustapposizione o interpolazione per le stringhe.
> `\{` e `\}` sono parentesi graffe letterali — l'escape è simmetrico.

---

## Flusso di Controllo

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

Due nuovi segni qui, e un terzo che viene dal metterli insieme:

- `?` è **chiedere**: apre una condizione.
- `_` è **quello che non era specificato**: il ramo rimasto quando nessuna domanda corrisponde.
- `_?` è entrambi di fila: *se nulla corrisponde, chiedi di nuovo*.

Ecco perché `_?` è scritto in questo modo. Non è un nuovo simbolo da imparare — è `_` seguito da `?`, e significa esattamente quello che i suoi due parti significano, letto in ordine.

> `{ }` le parentesi graffe sono **richieste** anche per una singola istruzione.

---

## Corrispondenza

```zymbol
punteggio = 85
grado = ?? punteggio {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> grado ¶              // → B
```

```zymbol
temp = -5
stato = ?? temp {
    < 0  => "ghiaccio"
    < 20 => "freddo"
    _    => "caldo"
}
>> stato ¶              // → ghiaccio
```

Conosci già `?` come "chiedere". **`??` chiede molte volte**: raddoppiare un segno, ovunque nel linguaggio, significa fare più volte quello che il segno fa una volta. Un `?` testa una condizione; `??` testa rispetto a un elenco di casi.

Le alternative si uniscono con `||`, e possono mescolare tipi di pattern:

```zymbol
tasto = 'P'
azione = ?? tasto {
    'p' || 'P' => "pausa"
    < 0 || > 100 => "fuori intervallo"
    _ => "ignorato"
}
>> azione ¶             // → pausa
```

---

## Cicli

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
frutti = ["mela", "pera", "uva"]
@ f:frutti { >> f " " }
>> ¶                    // → mela pera uva
@ c:"ciao" { >> c "-" }
>> ¶                    // → c-i-a-o-
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
conteggio = 0
@:esterno {
    conteggio++
    ? conteggio >= 3 { @:esterno! }
}
>> conteggio ¶              // → 3
```

`@` è il segno di **tempo**: tutto quello che si ripete vive in esso. Per tagliare il tempo cortisci aggiungi un segno accanto:

- `@!` — `!` è **forza**: lascia il ciclo adesso.
- `@>` — `>` spinge avanti: salta al prossimo turno.
- `@:esterno!` — `:` **lega un nome**, quindi questo taglia il ciclo *chiamato* esterno, non il più vicino.

Tre operatori, e nessuno di loro doveva essere memorizzato separatamente: sono `@` più un segno che dice già quello che fa.

> **Un specificatore è un conteggio o una condizione.** Un `Int` è un conteggio, valutato una volta — `@ 0` esegue il corpo zero volte. Qualsiasi altra cosa è una condizione. Non c'è truthiness: `@ []` e `@ 3.5` sono rifiutati. Per attraversare una raccolta usa `@ x:items`; per contarla, `@ items$#`.

---

## Funzioni

```zymbol
somma(a, b) { <~ a + b }
>> somma(3, 4) ¶          // → 7
```

```zymbol
fattoriale(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fattoriale(n - 1)
}
>> fattoriale(5) ¶       // → 120
```

Una funzione legge le variabili del file in base al valore, e una scrittura all'interno rimane all'interno:

```zymbol
limite = 100
dentro(n) { <~ n < limite }
>> dentro(42) ¶         // → #1
```

Due segni cambiano questo, e entrambi sono scritti **nella firma e nel sito di chiamata**:

```zymbol
bump(contatore<~) { contatore = contatore + 1 }
totale = 0
bump(totale<~)
>> totale ¶              // → 1
```

> `p~` è una copia di lavoro — il corpo può riassegnarlo e il chiamante non è toccato.
> `p<~` è un parametro di output — il cambio ritorna. `bump(totale)` senza il
> segno è un errore semantico: l'annotazione e la firma non possono divergere.

---

## Lambda e Chiusure

```zymbol
doppio = x -> x * 2
somma = (a, b) -> a + b
>> doppio(5) ¶          // → 10
>> somma(3, 7) ¶          // → 10
```

```zymbol
classifica = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "zero"
}
>> classifica(-4) ¶       // → negativo
```

```zymbol
fattore = 3
triplo = x -> x * fattore
>> triplo(7) ¶          // → 21
```

```zymbol
crea_somma(n) { <~ x -> x + n }
somma10 = crea_somma(10)
>> somma10(5) ¶           // → 15
```

Una lambda può non prendere parametri affatto:

```zymbol
risposta = () -> 42
>> risposta() ¶           // → 42
```

> Una lambda cattura le variabili del file **quando viene creata**; una funzione denominata le legge **quando viene chiamata**.

---

## Array

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   l'indicizzazione è basata su 1
>> arr[-1] ¶      // → 5   negativo conta dalla fine
>> arr$# ¶        // → 5   lunghezza
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   aggiungi
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  inserisci in posizione 2
>> (arr$- 3) ¶          // → [1, 2]         rimuovi prima occorrenza
>> (arr$-[1]) ¶         // → [2, 3]         rimuovi in indice 1
>> (arr$[1..2]) ¶       // → [1, 2]         slice, entrambe le estremità incluse
>> (arr$? 3) ¶          // → #1             contiene
```

Iniziano tutti con `$`, il segno per **raccolta**, e continuano con un segno che dice cosa si fa in essa: `#` quanti, `+` aggiungi, `-` rimuovi, `?` chiedere se è lì. E come con `??`, raddoppiare il segno significa farlo esaustivamente: `$?` chiede *se* un valore è presente, `$??` chiede *in quanti posti* e ritorna tutti.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   ascendente
>> (arr$^-) ¶     // → [3, 2, 1]   discendente
```

**La regola del risultato.** Un operatore, e quello che il codice circostante fa con esso decide: usato, **costruisce** e lascia l'originale da solo; scartato, **modifica**.

```zymbol
arr = [1, 2, 3]
copia = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> copia ¶               // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` non scrive mai in una raccolta.** `arr[2] = 99` non è una forma di Zymbol — `=` dà un valore a un NOME. Cambiare parte di una raccolta è `$~`, in ogni raccolta.

`[…]` contiene un tipo ed è verificato; una miscela deliberata è **dichiarata** con `#[…]`:

```zymbol
ok = #[1, "due", #1]
>> ok ¶                 // → [1, due, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indicizzazione Multidimensionale

`>` scende in una struttura nidificata. Un gruppo di parentesi indirizza un elemento, quanto profondo.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   riga 2, colonna 3
>> m[-1>-1] ¶      // → 9   ultima riga, ultima colonna
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          piatto: la diagonale
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   strutturato: gli angoli
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **non** è una forma di Zymbol. L'indice concatenato è rifiutato, sia per la lettura che per la scrittura — un gruppo di parentesi per accesso, e `>` è quello che va tra i passaggi.

---

## Dizionari

Una tupla con campi denominati è un dizionario, e da v0.0.9 è scritto `#(…)`.

```zymbol
persona = #(nome: "Alice", eta: 25)
>> persona.nome ¶        // → Alice
>> persona["eta"] ¶      // → 25
```

```zymbol
persona = #(nome: "Alice", eta: 25)
campo = "nome"
>> persona[campo] ¶      // → Alice
```

È mutabile, le chiavi possono essere aggiunte, e può essere attraversato:

```zymbol
stock = #(pera: 4)
stock["mela"]$~ 10
@ k:stock { >> k "=" stock[k] " " }
>> ¶                    // → pera=4 mela=10
```

```zymbol
stock = #(pera: 4, mela: 10)
@ (k, v):stock { >> k ":" v " " }
>> ¶                    // → pera:4 mela:10
```

> `#()` è il dizionario vuoto, che `()` non potrebbe essere — dovrebbe essere anche la tupla vuota. Il `(a: 1)` nudo è rifiutato, con quello come messaggio: *un dizionario è scritto `#(…)`*.
> Un dizionario è indirizzato per chiave, mai per posizione, quindi `persona[1]` è un errore.

---

## Tuple

Le tuple sono contenitori **immutabili** ordinati che mantengono valori di tipi diversi.

```zymbol
punto = (10, 20)
>> punto[1] ¶           // → 10
data = (42, "ciao", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Qualsiasi tentativo di modificare una tupla in loco è un errore, indipendentemente dall'operatore — l'immutabilità è una proprietà del valore, non un'eccezione dentro ogni `$`.

---

## Destrutturazione

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[primo, *resto] = arr
>> primo ¶              // → 10
>> resto ¶               // → [20, 30, 40, 50]
```

```zymbol
punto = (100, 200)
(px, py) = punto
>> px " " py ¶          // → 100 200
```

```zymbol
persona = #(nome: "Ana", eta: 25)
#(nome: n, eta: a) = persona
>> n " " a ¶            // → Ana 25
```

> La forma della parentesi è tipizzata: `[…]` prende un array, `(…)` una tupla, `#(…)` un dizionario.
> L'ultimo nome **assorbe il resto**, quindi la destrutturazione non fallisce mai sulla lunghezza —
> `(a, b, c) = (1,2,3,4,5)` dà `c = (3,4,5)`, e `##_` quando non rimane niente.

---

## Funzioni di Ordine Superiore

```zymbol
nums = [1, 2, 3, 4, 5]
>> (nums$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (nums$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (nums$< (0, (acc, x) -> acc + x)) ¶ // → 15
```

```zymbol
nums = [1, 2, 3, 4, 5, 6]
doppio(x) { <~ x * 2 }
è_grande(x) { <~ x > 3 }
>> (nums$> doppio) ¶    // → [2, 4, 6, 8, 10, 12]
>> (nums$| è_grande) ¶    // → [4, 5, 6]
```

```zymbol
db = [#(nome: "Carla", eta: 28), #(nome: "Ana", eta: 25)]
per_eta = db$^ (a, b -> a.eta < b.eta)
>> per_eta[1].nome ¶     // → Ana
```

> Una funzione denominata va a una HOF **senza parentesi**: `nums$> doppio`. Scrivere
> `nums$> (doppio)` è un errore di parse, perché `(` apre una lambda.

---

## Operatore Pipe

```zymbol
doppio = x -> x * 2
somma = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> doppio(_)) ¶   // → 10
>> (10 |> somma(_, 5)) ¶  // → 15
>> (5 |> doppio(_) |> inc(_)) ¶ // → 11
```

---

## Gestione degli Errori

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divisione per zero" ¶   // → divisione per zero
} :! {
    >> "altro: " _err ¶
} :> {
    >> "esegue sempre" ¶        // → esegue sempre
}
```

| Tipo | Quando |
|------|--------|
| `##Div` | Divisione per zero |
| `##Index` | Indice fuori dai limiti |
| `##Key` | Chiave non in un dizionario |
| `##Range` | Fuori dall'intervallo di interi sicuri |
| `##Type` | Mancata corrispondenza di tipo |
| `##Parse` | Analisi dei dati |
| `##IO` | File / sistema |
| `##Network` | Errori di rete |
| `##DB` | Database |
| `##Time` | Una data che non esiste |
| `##_` | Qualsiasi errore (catch-all) |

`!` è il segno di **errore e forza**, e si legge lo stesso in entrambe le famiglie: `$!` chiede a un valore se è un errore; `$!!`, con il segno raddoppiato, lo propaga verso l'alto senza chiedere.

> Gli errori della libreria standard tornano come **valori di errore soft** che testi con `$!` o catturi con `!?`, piuttosto che abortire. `$!!` propaga uno al chiamante.

---

## Moduli

```zymbol
# calcolo {
    #> { somma, PI }

    PI := 3.14159
    somma(a, b) { <~ a + b }
}
```

```zymbol
<# ./calcolo => c

>> c::somma(5, 3) ¶
>> c.PI ¶
```

```zymbol
# mylib {
    #> { somma_interna => somma }

    somma_interna(a, b) { <~ a + b }
}
```

I due segni di modulo sono la stessa idea di nuovo, ora applicati ai file: `#` è il livello di **dichiarazione** — cosa una cosa *è*, non quello che vale — e la freccia dice da che parte va il codice:

```text
<#   la freccia entra: importa, porta da un altro file
#>   la freccia esce: esporta, offri ad altri file
```

Un segno di direzione siede sempre sul bordo che guarda da dove punta. È lo stesso motivo per cui `<~` ritorna a sinistra (fuori dalla funzione) e `->` entra a destra (nel corpo della lambda).

> **Un modulo dichiara cosa esporta.** Il blocco `#>` è richiesto — ometterlo è **E014**, e `#> { }` è come un modulo dice che la sua superficie è vuota. `::` chiama una funzione, `.` legge una costante. Solo importazioni, il blocco di esportazione, inizializzatori letterali e definizioni di funzioni possono apparire in un corpo di modulo; qualsiasi cosa eseguibile è **E013**.

---

## Libreria Standard

Moduli nativi, importati come qualsiasi altro:

| Modulo | Funzioni |
|--------|----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan` · `PI` `E` |
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

>> t::width("手番") ¶            // → 4   due glife, quattro colonne
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

giorno = T::of(2026, 1, 31)
>> T::format(giorno, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(giorno, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` misura **colonne di visualizzazione**, non caratteri: CJK e la maggior parte emoji sono 2 colonne, quindi disponi una tabella con `t::width`, mai `$#`.
> In `std/time` un istante è millisecondi dall'epoca. Al di sotto di un giorno è durata, da un giorno su è calendario — quindi un mese atterra nello stesso giorno del mese, pinzato. `diff(a, b)` è `a - b`, quindi l'istante precedente per primo dà una risposta negativa.

---

## Pacchetti

Un `.zyp` raggruppa un programma multi-file in un unico file portatile. È un archivio di **sorgente**, non un binario, quindi funziona ovunque un binario `zymbol` lo fa.

```bash
zymbol package mioprogetto/ --script main.zy -o mioprogetto.zyp
zymbol run mioprogetto.zyp
```

> L'archivio porta un manifesto (`zyp.toml`) che dichiara i suoi script di ingresso e la versione del motore di cui ha bisogno. `zymbol run` lo estrae in una directory temporanea e esegue da lì, quindi il codice è smaltibile mentre qualsiasi cosa lo script scrive atterra nella tua vera directory di lavoro. Il playground carica anche i file `.zyp`.

---

## Modalità Numerali

Zymbol può scrivere numeri in **69 script di cifre Unicode** — Devanagari, Arabo-Indico, Thai, Klingon pIqaD, Mathematical Bold, segmenti LCD e altro. La modalità è globale al processo e influenza l'output; l'aritmetica non cambia.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabo-Indico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ripristina ad ASCII
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

Qualsiasi cifra di script supportata è un letterale valido nell'origine:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

La lettura è simmetrica — una cifra è compresa in qualsiasi script:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` è sempre ASCII, quindi `#0` rimane visivamente distinto dalla cifra zero in ogni script.
> `#,` e `#^` scrivono anche le loro cifre nello script attivo, e i separatori lo seguono — ma la coppia non si inverte mai: `,` raggruppa e `.` divide, in ogni script.

---

## Operatori di Dati

```zymbol
f = ##.42         // a Float
i = ###3.7        // a Int, arrotondato    → 4
t = ##!3.7        // a Int, troncato  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Un Float stampa come cifre, mai come esponente, e cade un `.0` finale — `##.42` scrive `42` ed è ancora un Float, come `f#?` mostra.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   fail-safe: ritorna l'ingresso invariato
>> ##!'A' ¶        // → 65    punto di codice di un Char
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          arrotonda a 2 decimali
>> #!2|pi| ¶       // → 3.14          tronca a 2 decimali
>> #,|1234567| ¶   // → 1,234,567     separatori di migliaia
>> #^|12345.678| ¶ // → 1.2345678e4   notazione scientifica
```

```zymbol
>> 0x41 ¶        // → A   hex
>> 0b01000001 ¶  // → A   binario
>> 0o101 ¶       // → A   ottale
>> 0d65 ¶        // → A   decimale
```

> Un letterale base nell'intervallo ASCII è un **carattere**: `0d65 == 'A'` è `#1`, e `0d65 == 65` è `#0`. Tutti e quattro le basi scrivono lo stesso carattere.

---

## Integrazione Shell

```zymbol
oggi = <\ date +%Y-%m-%d \>
>> "Oggi: " oggi
```

```zymbol
output = </"./subscript.zy"/>
>> output
```

> `<\ … \>` cattura stdout e stderr, con il newline finale spogliato.
> `>< args` cattura gli argomenti della riga di comando come un array di stringhe.

---

## Esempio Completo: FizzBuzz

```zymbol
classifica(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    <~ numero
}

@ i:1..20 { >> classifica(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (uno per linea)
```

---

## Come i Segni si Combinano

Stai vedendo la stessa cosa per tutto questo manuale: **un operatore non è un disegno da memorizzare, è diversi segni di fila, e ognuno contribuisce il suo significato.** Ora che li conosci tutti, ecco l'intero pattern.

Prima viene **quale mondo siamo**:

| Segno | Mondo | L'hai visto in |
|------|--------|---------------|
| `$` | una raccolta | `$#` `$+` `$?` `$^-` |
| `@` | tempo, tutto quello che si ripete | `@!` `@>` `@~` |
| `#` | cosa qualcosa *è*, non quello che vale | `#?` `#(…)` `<#` `#>` |
| `>>` | fuori dal programma | `>>` `>>!` `>>?` |
| `<<` | nel programma | `<<` `<<\|` `<<\|?` |
| `?` | chiedere, senza impegno | `?` `_?` `??` `$?` |
| `!` | forza, o errore | `@!` `$!` `!?` |

Poi viene **cosa si fa lì**: `+` aggiungi, `-` rimuovi, `^` ordina, `~` modifica, `#` conta, `|` una singola unità, `:` lega un nome.

E due regole che non falliscono mai:

**Raddoppiare un segno lo rende esaustivo.** `?` chiede una volta, `??` prova molti casi. `$?` chiede se un valore è lì, `$??` ritorna ogni luogo dove è. `!` contrassegna un errore, `!!` lo propaga senza chiedere.

**Il segno della modalità viene sempre per ultimo.** Quando `?` o `!` appaiono per dire *come* qualcosa si fa — in modo tentativo o forzato — sono il marchio finale dell'operatore: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:esterno!`. Non c'è mai un'operazione dopo di loro.

Qualcosa di pratico ne deriva: **una combinazione che non hai mai visto già ha senso prima di cercarla.** Se `$` è raccolta e `^` è ordina e `-` è invertito, allora `$^-` ordina discendente, e nessuno doveva dirti.

Non l'intero inventario funziona in questo modo, e dirlo è meglio che fingere. La maggior parte degli operatori si separa bene. Sei si separano ma significano più delle loro parti: `!?` `:!` `:>` `|>` `::` `$++`. E dieci devono essere imparati a memoria perché non si separano affatto: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Contare gli opachi invece di presumere che siano pochi è deliberato: sono il vero costo di memorizzazione del linguaggio. Il riferimento completo — l'inventario, gli omografi dichiarati, e le regole che un nuovo operatore deve soddisfare per esistere — è `SYMBOLS.md`, nel repository dell'interprete.

---

## Riferimento ai Simboli

| Simbolo | Operazione | Simbolo | Operazione |
|--------|-----------|--------|-----------|
| `=` | variabile | `$#` | lunghezza |
| `:=` | costante | `$+` | aggiungi |
| `>>` | output | `$+[i]` | inserisci in indice (basato su 1) |
| `<<` | input | `$-` | rimuovi primo per valore |
| `¶` / `\\` | newline | `$--` | rimuovi tutto per valore |
| `?` | if | `$-[i]` | rimuovi in indice (basato su 1) |
| `_?` | else-if | `$-[i..j]` | rimuovi intervallo (basato su 1) |
| `_` | else / wildcard | `$?` | contiene |
| `??` | corrispondenza | `$??` | trova tutti gli indici (basato su 1) |
| `\|\|` | or-pattern in un'uscita di corrispondenza | `$[s..e]` | slice (basato su 1) |
| `@` | ciclo | `$>` | mappa |
| `@ N { }` | ciclo di volte (N iterazioni) | `$\|` | filtro |
| `@!` | rottura | `$<` | riduci |
| `@>` | continua | `$/ delim` | split di stringa |
| `@:name { }` | ciclo etichettato | `$++ a b c` | concatena build |
| `@:name!` | etichetta di rottura | `$~~[p:r]` | sostituzione di stringa |
| `@:name>` | etichetta continua | `$*` | ripeti stringa |
| `->` | lambda | `arr[i]$~ v` | la forma UPDATE di UNO |
| `<~` | ritorno / param di output | `~` | param di copia di lavoro |
| `arr[i>j]` | indice di navigazione | `arr[p ; q]` | estrazione piatta |
| `$^+` | ordina ascendente | `$^-` | ordina discendente |
| `$^` | ordina con comparatore | `\|>` | pipe |
| `!?` | prova | `:!` | cattura |
| `:>` | finalmente | `$!` | è errore |
| `$!!` | propaga errore | `#1` / `#0` | vero / falso |
| `##_` | Unit — assenza | `[…]` | array, un tipo |
| `#[…]` | array, miscela dichiarata | `#(…)` | dizionario |
| `(…)` | tupla posizionale | `#()` | dizionario vuoto |
| `<#` | importa | `#>` | esporta |
| `#` | dichiara modulo | `::` | chiamata modulo |
| `.` | accesso a campo / costante | `#?` | metadati di tipo |
| `#\|..\|` | analizza numero | `##.` | casting a Float |
| `###` | casting a Int (arrotonda) | `##!` | casting a Int (tronca) |
| `#.N\|..\|` | arrotonda | `#!N\|..\|` | tronca |
| `#,\|..\|` | separatori di migliaia | `#^\|..\|` | scientifico |
| `#d0d9#` | cambio modalità numerale | `#09#` | ripristina ad ASCII |
| `<\ ..\>` | esecuzione shell | `><` | arg CLI |
| `\ var` | distruggi variabile | `°x` / `x°` | definizione hot |
| `>>\|` | blocco TUI (schermo alt) | `>>~` | output posizionato |
| `>>!` | cancella schermo | `>>?` | dimensione terminale di query |
| `<<\|` | pressione tasto di blocco | `<<\|?` | pressione tasto di non-blocco |
| `@~ N` | dorme N millisecondi | `0d` `0x` `0o` `0b` | letterali di base |

---

## Changelog della Release

### v0.0.9 — Le Collezioni Decidono _(Settembre 2026)_

- **Interruzione** Il dizionario ha una notazione propria: `#(key: value)`. Il bare `(a: 1)` è rifiutato, e `#()` è il dizionario vuoto — che `()` non potrebbe mai essere
- **Interruzione** Assegnazione indicizzata ritirata: `arr[i] = v` e ogni forma composta. `=` dà un valore a un NOME; cambiare parte di una raccolta è `$~`
- **Interruzione** L'indice concatenato `m[i][j]` è rifiutato per la lettura così come per la scrittura — `>` è quello che va tra i passaggi
- **Interruzione** Un modulo deve dichiarare cosa esporta (**E014**); `#> { }` dice che la superficie è vuota
- **Interruzione** Un specificatore di ciclo è un conteggio o una condizione — nessuna truthiness. `@ []` e `@ 3.5` sono rifiutati
- **Aggiunto** `##_` — il letterale Unit, e come un programma chiede se qualcosa è assente
- **Aggiunto** `#[…]` — un array la cui miscela di tipi di elemento è dichiarata
- **Aggiunto** `#?` dice le quattro raccolte a parte: `##]` `##[` `##)` `##(`
- **Aggiunto** `std/time` — l'orologio e il calendario civile, con zone e aritmetica del calendario
- **Aggiunto** Un top-level `<~` è lo stato di uscita del programma
- **Aggiunto** `@ (k, v):pairs` — un pattern nella testa del ciclo
- **Aggiunto** `#|c|` legge una cifra in uno qualsiasi dei 69 script; `#,` e `#^` scrivono le loro nello script attivo
- **Cambiato** `Int` è un intero sicuro, ±(2⁵³ − 1), fail-closed in ogni motore
- **Cambiato** Una funzione denominata legge le variabili del file al momento della chiamata, per valore
- **Cambiato** Un'istruzione che legge solo un nome avverte invece di passare silenziosamente
- **Motori** 660 di 666 file corpus concordano in tutti e tre i motori, 0 divergenti

### v0.0.8 — Auto-Free, `std/term` e Pacchetti _(Agosto 2026)_

- **Aggiunto** Distruzione automatica all'ultimo utilizzo — invisibile; abbassa solo il picco di memoria
- **Aggiunto** `std/term` — metriche di visualizzazione in colonne di terminale
- **Aggiunto** `##!` su un `Char` — il suo punto di codice Unicode
- **Aggiunto** Pattern match or: `'p' || 'P' => …`, alternative di qualsiasi tipo in un'uscita
- **Aggiunto** Pacchetti Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Aggiunto** `<~` al sito di chiamata è richiesto ovunque il callee dichiara un parametro di output
- **Corretto** Parità del sistema di moduli nella VM di registro

### v0.0.7 — Libreria Standard Nativa _(Luglio 2026)_

- **Aggiunto** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — tutti con valori di errore soft
- **Aggiunto** Input tipizzato/validato: `<< ##.(5,2) "prezzo: " p`
- **Aggiunto** Operatori postfissi direttamente in `>>` — nessuna parentesi necessaria
- **Cambiato** Formattatore fail-closed: rifiuta di scrivere output che non può leggere di nuovo

### v0.0.6 — Affinamento e Stdlib Scientifico _(Giugno 2026)_

- **Interruzione** `=>` sostituisce `:` negli arm di corrispondenza e `<=` negli alias di importazione/esportazione
- **Aggiunto** `std/math` e `std/random`
- **Aggiunto** Aggiornamento del dizionario per chiave: `d["k"]$~ value`

### v0.0.5 — Primitive TUI e Definizione Hot _(Maggio 2026)_

- **Aggiunto** Blocco TUI `>>| { }`, output posizionato `>>~`, input chiave `<<|` e `<<|?`
- **Aggiunto** `>>!` cancella schermo, `>>?` dimensione terminale, `@~ N` dorme
- **Aggiunto** Definizione hot `°x` / `x°`, e ripeti stringa `$*`

### v0.0.4 — Indicizzazione Basata su 1 e Funzioni First-Class _(Aprile 2026)_

- **Interruzione** Tutta l'indicizzazione è **basata su 1** — `arr[1]` è il primo elemento
- **Aggiunto** Funzioni denominate come valori first-class; sintassi blocco modulo `# name { }`
- **Aggiunto** Indicizzazione multidimensionale `arr[i>j>k]` e estrazione piatta `arr[p ; q]`

### v0.0.3 — Sistemi Numerali Unicode _(Aprile 2026)_

- **Aggiunto** 69 blocchi di cifre Unicode con token di cambio modalità `#d0d9#`
- **Aggiunto** Letterali booleani in qualsiasi script — `#१` / `#०`

### v0.0.2 — Redesign API Raccolta _(Marzo 2026)_

- **Aggiunto** La famiglia di operatori `$` per array e stringhe
- **Aggiunto** Assegnazione destrutturante, e indici negativi

### v0.0.1 — Versione Pubblica Iniziale _(Marzo 2026)_

- Interprete tree-walker + VM di registro (`--vm`)
- Tutti i costrutti core: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identificatori Unicode completi, sistema di moduli, lambda, chiusure, gestione degli errori
- REPL, LSP, estensione VS Code, formattatore (`zymbol fmt`)

---

_Zymbol-Lang — Simbolico. Universale. Immutabile._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licenza:** questo manuale è concesso in licenza secondo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Testo completo: `LICENSE-CC-BY-SA-4.0` in <https://github.com/zymbol-lang/web>. L'interprete e il motore del browser (`zymbol.js`) sono opere separate, concesse in licenza AGPL-3.0-only.
