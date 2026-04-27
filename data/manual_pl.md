> **Uwaga:** Ta dokumentacja została stworzona przy pomocy sztucznej inteligencji (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanonicznym odniesieniem jest **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** w repozytorium interpretera.

---

# Podręcznik Zymbol-Lang

**Zymbol-Lang** to symboliczny język programowania. Bez słów kluczowych — wszystko jest symbolem. Działa identycznie w każdym języku ludzkim.

- Brak `if`, `while`, `return` — tylko `?`, `@`, `<~`
- Pełna obsługa Unicode — identyfikatory w dowolnym języku lub emoji
- Niezależny od języka ludzkiego — kod jest identyczny wszędzie

**Wersja interpretera**: v0.0.4 | **Pokrycie testami**: 393/393 (TW ↔ VM parytet)

---

## Zmienne i Stałe

```zymbol
x = 10              // zmienna — mutowalna
PI := 3.14159       // stała — ponowne przypisanie jest błędem wykonania
imie = "Alice"
aktywny = #1        // prawda logiczna
👋 := "Cześć"
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

## Typy Danych

| Typ | Literał | Tag `#?` | Uwagi |
|-----|---------|----------|-------|
| Int | `42`, `-7` | `###` | 64-bitowa liczba ze znakiem |
| Float | `3.14`, `1.5e10` | `##.` | Notacja naukowa OK |
| String | `"tekst"` | `##"` | Interpolacja: `"Cześć {imie}"` |
| Char | `'A'` | `##'` | Pojedynczy znak Unicode |
| Bool | `#1`, `#0` | `##?` | NIE jest liczbowy — `#1 ≠ 1` |
| Tablica | `[1, 2, 3]` | `##]` | Jednorodne elementy |
| Krotka | `(a, b)` | `##)` | Pozycyjna |
| Krotka Nazwana | `(x: 1, y: 2)` | `##)` | Nazwane pola |
| Funkcja | referencja do nazwanej funkcji | `##()` | Pierwszoklasowa; wyświetlanie `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pierwszoklasowa; wyświetlanie `<lambd/N>` |

```zymbol
// Introspekcja typu — zwraca (typ, cyfry, wartość)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Wyjście i Wejście

```zymbol
>> "Cześć" ¶                      // ¶ lub \\ dla jawnego nowego wiersza
>> "a=" a " b=" b ¶               // juxtapozycja — wiele wartości
>> (tab$#) ¶                      // operatory postfiksowe wymagają ( ) w >>

<< imie                           // odczyt do zmiennej (bez podpowiedzi)
<< "Podaj imie: " imie            // z podpowiedzią
```

> `¶` (AltGr+R na klawiaturze hiszpańskiej) i `\\` są równoważnymi znakami nowego wiersza.

---

## Operatory

```zymbol
// Arytmetyka — używaj przypisań; niektóre operatory mają osobliwości bezpośrednio w >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (dzielenie całkowite)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potęgowanie)

// Porównanie
a == b    // #0
a <> b    // #1
a < b      // #0
a <= b    // #0
a > b      // #1
a >= b     // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Łańcuchy

```zymbol
// Dwie formy łączenia
imie = "Alice"
n = 42

>> "Cześć " imie " masz " n ¶        // juxtapozycja — w >>
opis = "Cześć {imie}, masz {n}"      // interpolacja — wszędzie
```

```zymbol
s = "Witaj Świecie"
dlugosc = s$#                  // 13
pod = s$[1..5]                 // "Witaj"  (indeks od 1, koniec włącznie)
czy = s$? "Świecie"            // #1
czesci = "a,b,c,d"$/ ','       // [a, b, c, d]  (podziel według ogranicznika)
zam = s$~~["i":"I"]            // zastąp wszystkie
zam1 = s$~~["i":"I":1]         // zastąp pierwsze N
```

> `+` jest tylko dla liczb. Dla łańcuchów używaj juxtapozycji lub interpolacji.

---

## Sterowanie Przepływem

```zymbol
x = 7

? x > 0 { >> "dodatnie" ¶ }

? x > 100 {
    >> "duże" ¶
} _? x > 0 {
    >> "dodatnie" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "ujemne" ¶
}
```

> Nawiasy klamrowe `{ }` są **obowiązkowe** nawet dla jednej instrukcji.

---

## Dopasowanie

```zymbol
// Zakresy
punkty = 85
ocena = ?? punkty {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocena ¶    // → B

// Łańcuchy
kolor = "czerwony"
kod = ?? kolor {
    "czerwony"  : "#FF0000"
    "zielony"   : "#00FF00"
    _           : "#000000"
}

// Wzorce porównań
temp = -5
stan = ?? temp {
    < 0  : "lód"
    < 20 : "zimno"
    < 35 : "ciepło"
    _    : "gorąco"
}
>> stan ¶    // → lód

// Forma instrukcji (bloki ramion)
?? n {
    0       : { >> "zero" ¶ }
    _? n < 0: { >> "ujemne" ¶ }
    _       : { >> "dodatnie" ¶ }
}
```

---

## Pętle

```zymbol
@ i:0..4  { >> i " " }        // zakres włącznie:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // z krokiem:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // wstecz:            5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

owoce = ["jabłko", "gruszka", "winogrono"]
@ f:owoce { >> f ¶ }          // for-each tablica

@ c:"witaj" { >> c "-" }
>> ¶                          // → w-i-t-a-j-  (for-each łańcuch)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> kontynuuj
    ? i > 7 { @! }             // @! przerwij
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Pętla nieskończona
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Pętla oznakowana (zagnieżdżone przerywanie)
licznik = 0
@:zewnetrzna {
    licznik++
    ? licznik >= 3 { @:zewnetrzna! }
}
>> licznik ¶                    // → 3
```

---

## Funkcje

```zymbol
dodaj(a, b) { <~ a + b }
>> dodaj(3, 4) ¶    // → 7

silnia(n) {
    ? n <= 1 { <~ 1 }
    <~ n * silnia(n - 1)
}
>> silnia(5) ¶    // → 120
```

Funkcje mają **izolowany zakres** — nie mogą odczytywać zewnętrznych zmiennych. Używaj parametrów wyjściowych `<~` do modyfikowania zmiennych wywołującego:

```zymbol
zamien(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
zamien(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nazwane funkcje są **wartościami pierwszoklasowymi** — przekazuj bezpośrednio: `liczby$> podwoj`. Opakowanie: `x -> fn(x)` jest również prawidłowe.

---

## Lambdy i Domknięcia

```zymbol
podwoj = x -> x * 2
suma = (a, b) -> a + b
>> podwoj(5) ¶    // → 10
>> suma(3, 7) ¶   // → 10

// Blokowa lambda
klasyfikuj = x -> {
    ? x > 0 { <~ "dodatnie" }
    _? x < 0 { <~ "ujemne" }
    <~ "zero"
}

// Domknięcie — przechwytuje zewnętrzny zakres
wspolczynnik = 3
potrojne = x -> x * wspolczynnik
>> potrojne(7) ¶    // → 21

// Fabryka
make_adder(n) { <~ x -> x + n }
dodaj10 = make_adder(10)
>> dodaj10(5) ¶    // → 15

// W tablicach
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Tablice

Tablice są **mutowalne** i przechowują elementy **tego samego typu**.

```zymbol
tab = [1, 2, 3, 4, 5]

tab[1]          // 1 — dostęp (indeks od 1: pierwszy element)
tab[-1]         // 5 — ujemny indeks (ostatni element)
tab$#           // 5 — długość (używaj (tab$#) w >>)

tab = tab$+ 6            // dołącz → [1,2,3,4,5,6]
tab2 = tab$+[2] 99       // wstaw na pozycję 2 (indeks od 1)
tab3 = tab$- 3           // usuń pierwsze wystąpienie wartości
tab4 = tab$-- 3          // usuń wszystkie wystąpienia
tab5 = tab$-[1]          // usuń na indeksie 1 (pierwszy element)
tab6 = tab$-[2..3]       // usuń zakres (indeks od 1, koniec włącznie)

czy = tab$? 3            // #1 — zawiera
poz = tab$?? 3           // [3] — wszystkie indeksy wartości (indeks od 1)
wycinek = tab$[1..3]     // [1,2,3] — wycinek (indeks od 1, koniec włącznie)
wycinek2 = tab$[1:3]     // [1,2,3] — to samo, składnia zliczania

rosnaco = tab$^+         // posortowano rosnąco  (tylko typy proste)
malejaco = tab$^-        // posortowano malejąco (tylko typy proste)

// Tablice krotek — używaj $^ z lambdą komparatora
db = [(imie: "Carla", wiek: 28), (imie: "Ana", wiek: 25), (imie: "Bob", wiek: 30)]
wg_wieku   = db$^ (a, b -> a.wiek < b.wiek)
wg_imienia = db$^ (a, b -> a.imie > b.imie)
>> wg_wieku[1].imie ¶     // → Ana
>> wg_imienia[1].imie ¶   // → Carla

// Bezpośrednia aktualizacja elementu (tylko tablice)
tab[1] = 99              // przypisz
tab[2] += 5              // złożone: +=  -=  *=  /=  %=  ^=

// Aktualizacja funkcyjna — zwraca nową tablicę; oryginał niezmieniony
tab2 = tab[2]$~ 99
```

> Wszystkie operatory kolekcji zwracają **nową tablicę**. Przypisz z powrotem: `tab = tab$+ 4`.
> `$^+` / `$^-` sortują **tablice typów prostych** (liczby, łańcuchy). Dla tablic krotek używaj `$^` z lambdą komparatora.
> **Indeksowanie od 1**: `tab[1]` jest pierwszym elementem; `tab[0]` jest błędem wykonania.

**Semantyka wartości** — przypisanie tablicy do innej zmiennej tworzy niezależną kopię:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nie jest dotknięte
```

```zymbol
// Zagnieżdżone tablice (indeksowanie od 1)
macierz = [[1,2,3],[4,5,6],[7,8,9]]
>> macierz[2][3] ¶    // → 6  (wiersz 2, kolumna 3)
```

---

## Destrukturyzacja

```zymbol
// Tablica
tab = [10, 20, 30, 40, 50]
[a, b, c] = tab              // a=10  b=20  c=30
[pierwsza, *reszta] = tab    // pierwsza=10  reszta=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ odrzuca

// Krotka pozycyjna
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Krotka nazwana
osoba = (imie: "Ana", wiek: 25, miasto: "Madrid")
(imie: i, wiek: w) = osoba   // i="Ana"  w=25
```

---

## Krotki

Krotki są **niezmiennymi** uporządkowanymi kontenerami, które mogą przechowywać wartości **różnych typów**. W przeciwieństwie do tablic, elementów nie można zmieniać po utworzeniu.

```zymbol
// Pozycyjna — dozwolone typy mieszane
punkt = (10, 20)
>> punkt[1] ¶    // → 10

dane = (42, "hello", #1, 3.14)
>> dane[3] ¶     // → #1

// Nazwana
osoba = (imie: "Alice", wiek: 25)
>> osoba.imie ¶    // → Alice
>> osoba[1] ¶      // → Alice  (indeks też działa, od 1)

// Zagnieżdżona
poz = (x: 10, y: 20)
p = (poz: poz, etykieta: "poczatek")
>> p.poz.x ¶        // → 10
```

**Niezmienność** — każda próba zmodyfikowania elementu krotki jest błędem wykonania:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ błąd wykonania: krotki są niezmienne
// t[1] += 5    // ❌ ten sam błąd
```

Aby uzyskać zmodyfikowaną wartość, użyj `$~` (aktualizacja funkcyjna) — zwraca **nową** krotkę:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← oryginał niezmieniony
>> t2 ¶    // → (10, 999, 30)

// Krotka nazwana — przebuduj jawnie
osoba = (imie: "Alice", wiek: 25)
starsza  = (imie: osoba.imie, wiek: 26)
>> osoba.wiek ¶    // → 25
>> starsza.wiek ¶  // → 26
```

---

## Funkcje Wyższego Rzędu

```zymbol
liczby = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

podwojone  = liczby$> (x -> x * 2)                // map  → [2,4,6…20]
parzyste   = liczby$| (x -> x % 2 == 0)           // filtr → [2,4,6,8,10]
suma_all   = liczby$< (0, (acc, x) -> acc + x)     // redukcja → 55

// Łańcuch przez zmienne pośrednie
krok1 = liczby$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nazwane funkcje mogą być przekazywane bezpośrednio do FWR
podwoj(x) { <~ x * 2 }
jest_duze(x) { <~ x > 5 }
r = liczby$> podwoj       // ✅ bezpośrednia referencja
r = liczby$| jest_duze    // ✅ bezpośrednia referencja
```

---

## Operator Potoku

Prawa strona zawsze wymaga `_` jako zastępnika przekazywanej wartości:

```zymbol
podwoj = x -> x * 2
dodaj = (a, b) -> a + b
inc = x -> x + 1

5 |> podwoj(_)        // → 10
10 |> dodaj(_, 5)     // → 15
5 |> dodaj(2, _)      // → 7

// Łańcuch
r = 5 |> podwoj(_) |> inc(_) |> podwoj(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Obsługa Błędów

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dzielenie przez zero" ¶
} :! {
    >> "inne: " _err ¶    // _err zawiera komunikat błędu
} :> {
    >> "zawsze się wykonuje" ¶
}
```

| Typ | Kiedy |
|-----|-------|
| `##Div` | Dzielenie przez zero |
| `##IO` | Plik / system |
| `##Index` | Indeks poza zakresem |
| `##Type` | Niezgodność typów |
| `##Parse` | Parsowanie danych |
| `##Network` | Błędy sieciowe |
| `##_` | Dowolny błąd (catch-all) |

---

## Moduły

```zymbol
// lib/obliczenia.zy — ciało modułu jest ujęte w nawiasy klamrowe
# obliczenia {
    #> { dodaj, get_PI }

    _PI := 3.14159
    dodaj(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/obliczenia <= o    // alias jest wymagany

>> o::dodaj(5, 3) ¶         // → 8
pi = o::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksport pod inną publiczną nazwą
# mojalib {
    #> { _wewn_dodaj <= suma }

    _wewn_dodaj(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib <= m

>> m::suma(3, 4) ¶    // → 7  (wewnętrzna nazwa _wewn_dodaj jest ukryta)
```

> **Zasady modułów**: tylko `#>`, definicje funkcji i inicjalizatory zmiennych/stałych literalnych są dozwolone wewnątrz `# name { }`. Instrukcje wykonywalne (`>>`, `<<`, pętle itp.) powodują błąd E013.

---

## Systemy Numeryczne

Zymbol może wyświetlać liczby w **69 blokach cyfr Unicode** — Devanagari, Arabsko-Indyjski, Tajski, Klingon pIqaD, matematycznie pogrubiony, cyfry LCD i inne. Aktywny tryb wpływa tylko na wyjście `>>`; wewnętrzna arytmetyka jest zawsze binarna.

### Aktywowanie systemu

Zapisz cyfry `0` i `9` docelowego pisma między `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabsko-Indyjski (U+0660–U+0669)
#๐๙#    // Tajski        (U+0E50–U+0E59)
#09#    // reset do ASCII
```

### Wyjście i wartości logiczne

```zymbol
x = 42
>> x ¶          // → 42   (ASCII domyślnie)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punkt dziesiętny zawsze ASCII)
>> 1 + 2 ¶      // → ३

// Wartości logiczne: prefiks # zawsze ASCII, cyfra się dostosowuje
>> #1 ¶         // → #१   (prawda w Devanagari)
>> #0 ¶         // → #०   (fałsz — różni się od ०  całkowitego zera)

x = 28 > 4
>> x ¶          // → #१   (wynik porównania podąża za aktywnym trybem)
```

### Natywne literały cyfr w kodzie źródłowym

Cyfry dowolnego obsługiwanego systemu są prawidłowymi literałami — w zakresach, modulo, porównaniach:

```zymbol
#٠٩#

@ i:١..١٥ {
    ? i % ١٥ == ٠ { >> "FizzBuzz" ¶ }
    _? i % ٣  == ٠ { >> "Fizz" ¶ }
    _? i % ٥  == ٠ { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logiczne literały w dowolnym systemie

`#` + cyfra `0` lub `1` z dowolnego obsługiwanego bloku jest prawidłowym literałem logicznym:

```zymbol
#٠٩#
aktywny = #١        // to samo co #1
>> aktywny ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` jest **zawsze ASCII**. `#0` (fałsz) jest zawsze wizualnie różne od `0` (całkowite zero) w każdym systemie.

---

## Operatory Danych

```zymbol
// Rzutowania typów
##.42         // → 42.0  (na Float)
###3.7        // → 4     (na Int, zaokrąglij)
##!3.7        // → 3     (na Int, obetnij)

// Parsowanie łańcucha do liczby
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (bezpieczna porażka, bez błędu)

// Zaokrąglenie / obcięcie
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokrąglij do 2 miejsc dziesiętnych)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (obetnij)

// Formatowanie liczb
fmt = #,|1234567|  // → 1,234,567  (rozdzielone przecinkami)
sci = #^|12345.678|    // → 1.2345678e4  (notacja naukowa)

// Literały w różnych podstawach
a = 0x41         // → 'A'  (szesnastkowy)
b = 0b01000001   // → 'A'  (binarny)
c = 0o101        // → 'A'  (ósemkowy)

// Wyjście z konwersją podstawy
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracja z Powłoką

```zymbol
data = <\ date +%Y-%m-%d \>      // przechwytuje stdout (zawiera \n)
>> "Dzisiaj: " data

plik = "data.txt"
zawartosc = <\ cat {plik} \>     // interpolacja w poleceniach

wynik = </"./podskrypt.zy"/>     // wykonaj inny skrypt Zymbol, przechwytuje wyjście
>> wynik
```

> `>\<` przechwytuje argumenty CLI jako tablicę łańcuchów (tylko tree-walker).

---

## Kompletny Przykład: FizzBuzz

```zymbol
klasyfikuj(liczba) {
    ? liczba % 15 == 0 { <~ "FizzBuzz" }
    _? liczba % 3  == 0 { <~ "Fizz" }
    _? liczba % 5  == 0 { <~ "Buzz" }
    _ { <~ liczba }
}

@ i:1..20 { >> klasyfikuj(i) ¶ }
```

---

## Skorowidz Symboli

| Symbol | Operacja | Symbol | Operacja |
|--------|----------|--------|----------|
| `=` | zmienna | `$#` | długość |
| `:=` | stała | `$+` | dołącz (łańcuchowalne) |
| `>>` | wyjście | `$+[i]` | wstaw na indeksie (od 1) |
| `<<` | wejście | `$-` | usuń pierwsze wyst. wg wartości |
| `¶` / `\\` | nowy wiersz | `$--` | usuń wszystkie wyst. wg wartości |
| `?` | jeśli | `$-[i]` | usuń na indeksie (od 1) |
| `_?` | jeśli-inaczej | `$-[i..j]` | usuń zakres (od 1) |
| `_` | inaczej / symbol wieloznaczny | `$?` | zawiera |
| `??` | dopasowanie | `$??` | znajdź wszystkie indeksy (od 1) |
| `@` | pętla | `$[s..e]` | wycinek (od 1) |
| `@ N { }` | pętla N razy | `$>` | mapowanie |
| `@!` | przerwij | `$\|` | filtrowanie |
| `@>` | kontynuuj | `$<` | redukcja |
| `@:name { }` | pętla oznakowana | `$/ delim` | podziel łańcuch |
| `@:name!` | przerwij z etykietą | `$++ a b c` | zbuduj złączenie |
| `@:name>` | kontynuuj z etykietą | `tab[i>j>k]` | indeks nawigacyjny |
| `->` | lambda | `tab[i] = val` | aktualizuj element (tylko tablice) |
| `tab[i] += val` | złożona aktualizacja | `tab[i]$~` | aktualizacja funkcyjna (nowa kopia) |
| `$^+` | sortuj rosnąco (typy proste) | `$^-` | sortuj malejąco (typy proste) |
| `$^` | sortuj z komparatorem (krotki) | `<~` | zwróć |
| `\|>` | potok | `!?` | próbuj |
| `:!` | złap | `:>` | na końcu |
| `#1` | prawda | `#0` | fałsz |
| `$!` | jest błędem | `$!!` | propaguj błąd |
| `<#` | importuj | `#>` | eksportuj |
| `#` | deklaruj moduł | `::` | wywołanie modułu |
| `.` | dostęp do pola | `#?` | metadane typu |
| `#\|..\|` | parsuj liczbę | `##.` | rzutuj na Float |
| `###` | rzutuj na Int (zaokrąglij) | `##!` | rzutuj na Int (obetnij) |
| `#.N\|..\|` | zaokrąglij | `#!N\|..\|` | obetnij |
| `#,\|..\|` | format z przecinkami | `#^\|..\|` | naukowy |
| `#d0d9#` | przełączanie trybu numerycznego | `#09#` | reset do ASCII |
| `<\ ..\>` | wykonaj powłokę | `>\<` | argumenty CLI |
| `\ var` | zniszcz zmienną | | |

---

## Historia Wersji

### v0.0.4 — Indeksowanie od 1, Funkcje Pierwszoklasowe i Bloki Modułów _(kwiecień 2026)_

- **Zmiana** Całe indeksowanie przełączone na **od 1** — `tab[1]` jest pierwszym elementem; `tab[0]` jest błędem wykonania
- **Dodano** Nazwane funkcje są **wartościami pierwszoklasowymi** — przekazuj bezpośrednio do FWR: `liczby$> podwoj`
- **Dodano** Wymagana **składnia blokowa** modułu: `# name { ... }` — składnia płaska usunięta
- **Dodano** Wielowymiarowe indeksowanie: `tab[i>j>k]` (nawigacja), `tab[p ; q]` (płaska ekstrakcja)
- **Dodano** Rzutowania typów: `##.expr` (Float), `###expr` (Int zaokrąglij), `##!expr` (Int obetnij)
- **Dodano** Podział łańcucha: `str$/ delim` — zwraca `Array(String)`
- **Dodano** Budowanie złączenia: `base$++ a b c` — dołącza wiele elementów
- **Dodano** Pętla N razy: `@ N { }` — powtórz dokładnie N razy
- **Dodano** Składnia pętli oznakowanej: `@:name { }`, `@:name!`, `@:name>` — zastępuje `@ @name` / `@! name`
- **Dodano** Zasady zakresu zmiennych: zmienne `_name` mają dokładny zakres bloku; `\ var` niszczy wcześniej
- **Dodano** Wzorce porównań w dopasowaniu: `< 0 :`, `> 5 :`, `== 42 :` itp.
- **Dodano** Błąd E013 modułu: instrukcje wykonywalne w ciele modułu są zabronione
- **Naprawiono** `take_variable` nie uszkadza już stałych modułu przy zapisie z powrotem
- **Naprawiono** `alias.CONST` rozwiązuje się teraz poprawnie; `#>` może pojawiać się po definicjach funkcji
- **VM** Pełny parytet: 393/393 testów przechodzi

### v0.0.3 — Systemy Numeryczne Unicode i Ulepszenia LSP _(kwiecień 2026)_

- **Dodano** 69 bloków cyfr Unicode z tokenem przełączania trybu `#d0d9#`
- **Dodano** Literały logiczne w dowolnym systemie — `#१` / `#०`, `#١` / `#٠` itp.
- **Dodano** Cyfry Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Dodano** Opcode VM `SetNumeralMode` — pełny parytet z tree-walker
- **Dodano** REPL respektuje aktywny tryb numeryczny w echach i wyświetlaniu zmiennych
- **Zmieniono** Wyjście boolowskie `>>` zawiera teraz prefiks `#` (`#0` / `#1`) we wszystkich trybach

### v0.0.2_01 — Zmiana Nazw Operatorów _(30 mar 2026)_

- **Zmieniono** `c|..|` → `#,|..|` i `e|..|` → `#^|..|` — spójne z rodziną prefiksów `#`
- **Dodano** Alias eksportu: ponowny eksport członków modułu pod inną nazwą

### v0.0.2 — Przeprojektowanie Kolekcji i Instalatory _(24 mar 2026)_

- **Dodano** Ujednolicona rodzina operatorów `$` dla tablic i łańcuchów (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Dodano** Destrukturyzacja dla tablic, krotek i nazwanych krotek
- **Dodano** Ujemne indeksy (`tab[-1]` = ostatni element)
- **Dodano** Natywne instalatory — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 mar 2026)_

- **Dodano** Złożone przypisanie `^=`
- **Naprawiono** Przypadki graniczne arytmetyki parsera; poprawki dokumentacji

### v0.0.1 — Pierwsze Publiczne Wydanie _(22 mar 2026)_

- Interpreter tree-walker + rejestrowy VM (`--vm`, ~4× szybszy, ~95% parytet)
- Wszystkie podstawowe konstrukcje: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pełne identyfikatory Unicode, system modułów, lambdy, domknięcia, obsługa błędów
- REPL, LSP, rozszerzenie VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Symboliczny. Uniwersalny. Niezmienny._
