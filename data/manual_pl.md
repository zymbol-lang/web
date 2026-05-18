> **Zastrzeżenie:** Ta dokumentacja została stworzona i przetłumaczona przez sztuczną inteligencję (SI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Podręcznik Zymbol-Lang

> **Przejrzano dla v0.0.5 — 2026-05-12**

**Zymbol-Lang** to symboliczny język programowania. Bez słów kluczowych — wszystko jest symbolem. Działa identycznie w każdym ludzkim języku.

- Bez `if`, `while`, `return` — tylko `?`, `@`, `<~`
- Pełny Unicode — identyfikatory w dowolnym języku lub emoji
- Niezależny od języka ludzkiego — kod jest wszędzie taki sam

**Wersja interpretera**: v0.0.5 | **Pokrycie testami**: 436/436 (TW ↔ VM parytet)

---

## Zmienne i Stałe

```zymbol
x = 10              // zmienna
PI := 3.14159       // stała — ponowne przypisanie jest błędem w czasie wykonania
imie = "Alicja"
aktywny = #1        // logiczna prawda
👋 := "Cześć"
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

`°` (znak stopnia, U+00B0) automatycznie inicjalizuje zmienną do jej neutralnej wartości przy pierwszym użyciu:

```zymbol
liczby = [3, 1, 4, 1, 5]
@ n:liczby {
    °lacznie += n    // auto-inicjalizacja do 0 przed pętlą; dostępna po @
}
>> lacznie ¶         // → 14
```

> `°x` (prefiks) zakotwicza nad pętlą — wynik jest dostępny po `@`.
> `x°` (sufiks) zakotwicza wewnątrz pętli — znika gdy pętla się kończy.
> Tylko tree-walker.

---

## Typy Danych

| Typ | Literał | Tag `#?` | Uwagi |
|-----|---------|----------|-------|
| Całkowity | `42`, `-7` | `###` | 64-bitowy ze znakiem |
| Zmiennoprzecinkowy | `3.14`, `1.5e10` | `##.` | Notacja naukowa OK |
| Łańcuch | `"tekst"` | `##"` | Interpolacja: `"Cześć {imie}"` |
| Znak | `'A'` | `##'` | Pojedynczy znak Unicode |
| Logiczny | `#1`, `#0` | `##?` | NIE jest liczbą — `#1 ≠ 1` |
| Tablica | `[1, 2, 3]` | `##]` | Jednorodne elementy |
| Krotka | `(a, b)` | `##)` | Pozycyjna |
| Nazwana Krotka | `(x: 1, y: 2)` | `##)` | Nazwane pola |
| Funkcja | nazwana referencja | `##()` | Pierwsza klasa; wyświetla `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pierwsza klasa; wyświetla `<lambd/N>` |

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
>> (tablica$#) ¶                  // operatory postfiksowe wymagają ( ) w >>

<< imie                           // odczyt do zmiennej (bez podpowiedzi)
<< "Podaj imie: " imie            // z podpowiedzią
```

> `¶` (AltGr+R na hiszpańskiej klawiaturze) i `\\` są równoważnymi nowymi wierszami.

---

## Prymitywy TUI

Operatory terminale UI dla programów interaktywnych. Większość wymaga bloku `>>| { }` (ekran alternatywny + tryb raw).

```zymbol
>>| {
    >>!                             // czyszczenie ekranu alternatywnego
    >>~ (1, 1, 0, 10) > "Działa"   // wiersz 1, kolumna 1, fg=10 (zielony)
    @~ 1000                         // pauza 1 sekunda (1000 ms)
    >>~ (2, 1) > "Gotowe."
}
// terminal automatycznie przywrócony po wyjściu
```

```zymbol
// Naciśnięcie klawisza i rozmiar terminala
>>| {
    [wiersze, kolumny] = >>?              // zapytanie o wymiary terminala
    >>~ (1, 1) > "Terminal: " wiersze " x " kolumny
    <<| klawisz                            // blokujące odczytanie klawisza
    >>~ (2, 1) > "Naciśnięto: " klawisz
}
```

> `>>!` czyści ekran. `>>?` zwraca `[wiersze, kolumny]`. `@~ N` śpi N milisekund.
> `<<|` odczytuje jedno naciśnięcie klawisza (blokujące); `<<|?` odpytuje bez blokowania (zwraca `'\0'` gdy brak).
> Krotka pozycjonowanego wyjścia: `(wiersz, kolumna, STP, fg, bg)` — dowolny slot można pominąć przecinkiem (`>>~ (,,, 196) > "czerwony"`).
> Maska STP: `1`=Pogrubiony, `2`=Kursywa, `4`=Podkreślony. Paleta ANSI 256-kolorów (`0`=domyślny terminal).
> Tylko tree-walker (z wyjątkiem `>>!`, `>>?`, `@~`, `>>~` które działają też z `--vm`).

---

## Operatory

```zymbol
// Arytmetyka
a = 10
b = 3
w1 = a + b    // 13
w2 = a - b    // 7
w3 = a * b    // 30
w4 = a / b    // 3  (dzielenie całkowite)
w5 = a % b    // 1
w6 = a ^ b    // 1000  (potęgowanie)

// Porównanie — przypisanie do sprawdzenia
p1 = a == b    // #0
p2 = a <> b    // #1
p3 = a < b     // #0
p4 = a <= b    // #0
p5 = a > b     // #1
p6 = a >= b    // #1

// Logiczne
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Łańcuchy

```zymbol
// Dwie formy łączenia
imie = "Alicja"
n = 42

>> "Cześć " imie " masz " n ¶    // juxtapozycja — w >>
opis = "Cześć {imie}, masz {n}"  // interpolacja — wszędzie
```

```zymbol
s = "Cześć Świat"
dlugosc = s$#                  // 11
pod = s$[1..5]                 // "Cześć"  (1-bazowe, koniec włącznie)
ma = s$? "Świat"               // #1
czesci = "a,b,c,d"$/ ','       // [a, b, c, d]  (podział przez separator)
zam = s$~~["ś":"Ś"]            // zamiana
zam1 = s$~~["ś":"Ś":1]         // tylko pierwsze N
linia = "─" $* 20              // "────────────────────"  (powtórzenie N razy)
```

> `+` jest tylko dla liczb. Dla łańcuchów użyj `,`, juxtapozycji lub interpolacji.

---

## Kontrola Przepływu

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

> Nawiasy klamrowe `{ }` są **wymagane** nawet dla jednej instrukcji.

---

## Dopasowanie

```zymbol
// Zakresy
wynik = 85
ocena = ?? wynik {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> ocena ¶    // → B

// Łańcuchy
kolor = "czerwony"
kod = ?? kolor {
    "czerwony"  => "#FF0000"
    "zielony"   => "#00FF00"
    _           => "#000000"
}

// Wzorce porównania
temp = -5
stan = ?? temp {
    < 0  => "lód"
    < 20 => "zimno"
    < 35 => "ciepło"
    _    => "gorąco"
}
>> stan ¶    // → lód

// Forma instrukcji (gałęzie blokowe)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "ujemne" ¶ }
    _    => { >> "dodatnie" ¶ }
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
@ o:owoce { >> o ¶ }          // for-each tablica

@ c:"czesc" { >> c "-" }
>> ¶                          // → c-z-e-s-c-  (for-each łańcuch)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> kontynuuj
    ? i > 7 { @! }             // @! przerwij
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Nieskończona pętla
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Oznaczona pętla (zagnieżdżone przerwanie)
licznik = 0
@:zewnetrzna {
    licznik++
    ? licznik >= 3 { @:zewnetrzna! }
}
>> licznik ¶                  // → 3
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

Funkcje mają **izolowany zasięg** — nie mogą odczytywać zewnętrznych zmiennych. Używaj parametrów wyjściowych `<~` do modyfikacji zmiennych wywołującego:

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

> Nazwane funkcje są **wartościami pierwszej klasy** — przekazuj bezpośrednio: `liczby$> podwoj`. Do opakowania: `x -> fn(x)` jest też poprawne.

---

## Lambdy i Domknięcia

```zymbol
podwoj = x -> x * 2
suma = (a, b) -> a + b
>> podwoj(5) ¶    // → 10
>> suma(3, 7) ¶   // → 10

// Lambda blokowa
klasyfikuj = x -> {
    ? x > 0 { <~ "dodatnie" }
    _? x < 0 { <~ "ujemne" }
    <~ "zero"
}

// Domknięcie — przechwytuje zewnętrzny zasięg
wspolczynnik = 3
potroj = x -> x * wspolczynnik
>> potroj(7) ¶    // → 21

// Fabryka
stworz_dodawacz(n) { <~ x -> x + n }
dodaj10 = stworz_dodawacz(10)
>> dodaj10(5) ¶    // → 15

// W tablicach
operacje = [x -> x+1, x -> x*2, x -> x*x]
>> operacje[3](5) ¶    // → 25
```

---

## Tablice

Tablice są **mutowalne** i przechowują elementy **tego samego typu**.

```zymbol
tablica = [1, 2, 3, 4, 5]

x = tablica[1]      // 1 — dostęp (1-bazowe: pierwszy element)
x = tablica[-1]     // 5 — ujemny indeks (ostatni element)
x = tablica$#       // 5 — długość (użyj (tablica$#) w >>)

tablica = tablica$+ 6            // dołączenie → [1,2,3,4,5,6]
tablica2 = tablica$+[2] 99       // wstawienie na pozycji 2 (1-bazowe)
tablica3 = tablica$- 3           // usunięcie pierwszego wystąpienia wartości
tablica4 = tablica$-- 3          // usunięcie wszystkich wystąpień
tablica5 = tablica$-[1]          // usunięcie pod indeksem 1 (pierwszy element)
tablica6 = tablica$-[2..3]       // usunięcie zakresu (1-bazowe, koniec włącznie)

ma = tablica$? 3                 // #1 — zawiera
poz = tablica$?? 3               // [3] — wszystkie indeksy wartości (1-bazowe)
wyc = tablica$[1..3]             // [1,2,3] — wycinek (1-bazowe, koniec włącznie)
wyc2 = tablica$[1:3]             // [1,2,3] — to samo, składnia z licznikiem

rosnaco = tablica$^+             // posortowane rosnąco (tylko prymitywy)
malejaco = tablica$^-            // posortowane malejąco (tylko prymitywy)

// Tablice nazwanych/pozycyjnych krotek — użyj $^ z lambdą komparatora
baza = [(imie: "Karla", wiek: 28), (imie: "Ana", wiek: 25), (imie: "Bob", wiek: 30)]
wg_wieku = baza$^ (a, b -> a.wiek < b.wiek)    // rosnąco wg wieku  (<)
wg_imie  = baza$^ (a, b -> a.imie > b.imie)    // malejąco wg imienia (>)
>> wg_wieku[1].imie ¶     // → Ana
>> wg_imie[1].imie ¶      // → Karla

// Bezpośrednia aktualizacja elementu (tylko tablice)
tablica[1] = 99              // przypisanie
tablica[2] += 5              // złożone: +=  -=  *=  /=  %=  ^=

// Aktualizacja funkcyjna — zwraca nową tablicę; oryginał niezmieniony
tablica2 = tablica[2]$~ 99
```

> Wszystkie operatory kolekcji zwracają **nową tablicę**. Przypisz z powrotem: `tablica = tablica$+ 4`.
> `$+` można łączyć w łańcuch: `tablica = tablica$+ 5$+ 6$+ 7`. Inne operatory używają pośrednich przypisań.
> **Indeksowanie jest 1-bazowe**: `tablica[1]` to pierwszy element; `tablica[0]` jest błędem w czasie wykonania.
> `$^+` / `$^-` sortują **tablice prymitywów** (liczby, łańcuchy). Dla tablic krotek użyj `$^` z lambdą komparatora — kierunek jest zakodowany w lambdzie (`<` = rosnąco, `>` = malejąco).

**Semantyka wartości** — przypisanie tablicy do innej zmiennej tworzy niezależną kopię:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nie jest dotknięte
```

```zymbol
// Zagnieżdżone tablice (indeksowanie 1-bazowe)
macierz = [[1,2,3],[4,5,6],[7,8,9]]
>> macierz[2][3] ¶    // → 6  (wiersz 2, kolumna 3)
```

---

## Destrukturyzacja

```zymbol
// Tablica
tablica = [10, 20, 30, 40, 50]
[a, b, c] = tablica              // a=10  b=20  c=30
[pierwszy, *reszta] = tablica    // pierwszy=10  reszta=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ odrzuca

// Krotka pozycyjna
punkt = (100, 200)
(px, py) = punkt                 // px=100  py=200

// Nazwana krotka
osoba = (imie: "Ana", wiek: 25, miasto: "Warszawa")
(imie: i, wiek: w) = osoba       // i="Ana"  w=25
```

---

## Krotki

Krotki są **niemutowalnymi** uporządkowanymi kontenerami, które mogą przechowywać wartości **różnych typów**.
W przeciwieństwie do tablic, elementy nie mogą być zmieniane po utworzeniu.

```zymbol
// Pozycyjne — dozwolone typy mieszane
punkt = (10, 20)
>> punkt[1] ¶    // → 10

dane = (42, "cześć", #1, 3.14)
>> dane[3] ¶     // → #1

// Nazwane
osoba = (imie: "Alicja", wiek: 25)
>> osoba.imie ¶    // → Alicja
>> osoba[1] ¶      // → Alicja  (indeks też działa, 1-bazowe)

// Zagnieżdżone
poz = (x: 10, y: 20)
p = (poz: poz, etykieta: "poczatek")
>> p.poz.x ¶       // → 10
```

**Niezmienność** — każda próba modyfikacji elementu krotki jest błędem w czasie wykonania:

```zymbol
k = (10, 20, 30)
// k[1] = 99    // ❌ błąd w czasie wykonania: krotki są niezmienne
// k[1] += 5    // ❌ ten sam błąd
```

Aby uzyskać zmodyfikowaną wartość użyj `$~` (aktualizacja funkcyjna) — zwraca **nową** krotkę:

```zymbol
k = (10, 20, 30)
k2 = k[2]$~ 999
>> k ¶     // → (10, 20, 30)   ← oryginał niezmieniony
>> k2 ¶    // → (10, 999, 30)

// Nazwana krotka — jawna przebudowa
osoba = (imie: "Alicja", wiek: 25)
starsza = (imie: osoba.imie, wiek: 26)
>> osoba.wiek ¶    // → 25
>> starsza.wiek ¶  // → 26
```

---

## Funkcje Wyższego Rzędu

```zymbol
liczby = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

podwojone  = liczby$> (x -> x * 2)                // map  → [2,4,6…20]
parzyste   = liczby$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
lacznie    = liczby$< (0, (akum, x) -> akum + x)  // reduce → 55

// Łańcuchowanie przez pośrednie
krok1 = liczby$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nazwane funkcje można przekazać bezpośrednio do HOF
podwoj(x) { <~ x * 2 }
jest_duze(x) { <~ x > 5 }
w = liczby$> podwoj      // ✅ bezpośrednia referencja
w = liczby$| jest_duze   // ✅ bezpośrednia referencja
```

---

## Operator Potoku

Prawa strona zawsze wymaga `_` jako symbolu zastępczego dla przekazywanej wartości:

```zymbol
podwoj = x -> x * 2
dodaj = (a, b) -> a + b
zwieksz = x -> x + 1

w1 = 5 |> podwoj(_)         // → 10
w2 = 10 |> dodaj(_, 5)      // → 15
w3 = 5 |> dodaj(2, _)       // → 7

// Łańcuchowane
w = 5 |> podwoj(_) |> zwieksz(_) |> podwoj(_)
>> w ¶    // → 22  (5→10→11→22)
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
// lib/calc.zy — ciało modułu jest ujęte w nawiasy klamrowe
# calc {
    #> { dodaj, pobierz_PI }

    _PI := 3.14159
    dodaj(a, b) { <~ a + b }
    pobierz_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => k    // alias jest wymagany

>> k::dodaj(5, 3) ¶     // → 8
pi = k::pobierz_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Eksport z inną publiczną nazwą
# mojalib {
    #> { _wewnetrzny_dodaj => suma }

    _wewnetrzny_dodaj(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib => m

>> m::suma(3, 4) ¶    // → 7  (wewnętrzna nazwa _wewnetrzny_dodaj jest ukryta)
```

> **Zasady modułu**: tylko `#>`, definicje funkcji i literalne inicjalizatory zmiennych/stałych są dozwolone wewnątrz `# nazwa { }`. Wykonywalne instrukcje (`>>`, `<<`, pętle itd.) powodują błąd E013.

---

## Tryby Numeryczne

Zymbol może wyświetlać liczby w **69 skryptach cyfr Unicode** — Dewanagari, Arabsko-Indyjski, Tajski, Klingońskie pIqaD, Matematyczny Pogrubiony, segmenty LCD i więcej. Aktywny tryb wpływa tylko na wyjście `>>`; wewnętrzna arytmetyka jest zawsze binarna.

### Aktywowanie skryptu

Zapisz cyfry `0` i `9` docelowego skryptu ujęte w `#…#`:

```zymbol
#०९#    // Dewanagari   (U+0966–U+096F)
#٠٩#    // Arabsko-Indyjski (U+0660–U+0669)
#๐๙#    // Tajski       (U+0E50–U+0E59)
#09#    // reset do ASCII
```

### Wyjście i wartości logiczne

```zymbol
x = 42
>> x ¶          // → 42   (ASCII domyślnie)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (przecinek dziesiętny zawsze ASCII)
>> 1 + 2 ¶      // → ३

// Logiczne: prefiks # zawsze ASCII, cyfra się dostosowuje
>> #1 ¶         // → #१   (prawda w Dewanagari)
>> #0 ¶         // → #०   (fałsz — różni się od ०  liczba całkowita zero)

x = 28 > 4
>> x ¶          // → #१   (wynik porównania podąża za aktywnym trybem)
```

### Natywne literały cyfr w kodzie źródłowym

Cyfry dowolnego obsługiwanego skryptu są poprawnymi literałami — w zakresach, modulo, porównaniach:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literały logiczne w dowolnym skrypcie

`#` + cyfra `0` lub `1` z dowolnego bloku jest poprawnym literałem logicznym:

```zymbol
#٠٩#
aktywny = #١        // to samo co #1
>> aktywny ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` jest **zawsze ASCII**. `#0` (fałsz) jest zawsze wizualnie różne od `0` (liczba całkowita zero) w każdym skrypcie.

---

## Operatory Danych

```zymbol
// Konwersje typów
f = ##.42         // → 42.0  (na Zmiennoprzecinkowy)
i = ###3.7        // → 4     (na Całkowity, zaokrąglenie)
t = ##!3.7        // → 3     (na Całkowity, obcięcie)

// Parsowanie łańcucha do liczby
v1 = #|"42"|      // → 42  (Całkowity)
v2 = #|"3.14"|    // → 3.14  (Zmiennoprzecinkowy)
v3 = #|"abc"|     // → "abc"  (bezpieczna porażka, bez błędu)

// Zaokrąglenie / obcięcie
pi = 3.14159265
v2 = #.2|pi|      // → 3.14  (zaokrąglij do 2 miejsc dziesiętnych)
v4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (obcięcie)

// Formatowanie liczb
fmt = #,|1234567|  // → 1,234,567  (oddzielone przecinkami)
nau = #^|12345.678|    // → 1.2345678e4  (notacja naukowa)

// Literały podstaw
a = 0x41         // → 'A'  (szesnastkowy)
b = 0b01000001   // → 'A'  (binarny)
c = 0o101        // → 'A'  (ósemkowy)

// Wyjście konwersji podstawy
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracja Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // przechwytuje stdout (włącznie z końcowym \n)
>> "Dzisiaj: " data

plik = "dane.txt"
zawartosc = <\ cat {plik} \>    // interpolacja w poleceniach

wyjscie = </"./podskrypt.zy"/>  // wykonuje inny skrypt Zymbol, przechwytuje wyjście
>> wyjscie
```

> `><` przechwytuje argumenty CLI jako tablicę łańcuchów (tylko tree-walker).

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

## Odwołanie do Symboli

| Symbol | Operacja | Symbol | Operacja |
|--------|----------|--------|----------|
| `=` | zmienna | `$#` | długość |
| `:=` | stała | `$+` | dołączanie (łańcuchowe) |
| `>>` | wyjście | `$+[i]` | wstawianie pod indeks (1-bazowe) |
| `<<` | wejście | `$-` | usuwanie pierwszego wg wartości |
| `¶` / `\\` | nowy wiersz | `$--` | usuwanie wszystkich wg wartości |
| `?` | jeśli | `$-[i]` | usuwanie pod indeksem (1-bazowe) |
| `_?` | w przeciwnym razie-jeśli | `$-[i..j]` | usuwanie zakresu (1-bazowe) |
| `_` | w przeciwnym razie / wzorzec | `$?` | zawiera |
| `??` | dopasowanie | `$??` | szukanie wszystkich indeksów (1-bazowe) |
| `@` | pętla | `$[s..e]` | wycinek (1-bazowe) |
| `@ N { }` | pętla N razy | `$>` | map |
| `@!` | przerwanie | `$\|` | filter |
| `@>` | kontynuuj | `$<` | reduce |
| `@:nazwa { }` | oznaczona pętla | `$/ sep` | podział łańcucha |
| `@:nazwa!` | przerwij oznaczoną | `$++ a b c` | konkatenacja |
| `@:nazwa>` | kontynuuj oznaczoną | `tablica[i>j>k]` | indeks nawigacyjny |
| `->` | lambda | `tablica[i] = war` | aktualizacja elementu (tylko tablice) |
| `tablica[i] += war` | złożona aktualizacja | `tablica[i]$~` | aktualizacja funkcyjna (nowa kopia) |
| `$^+` | sortowanie rosnąco (prym.) | `$^-` | sortowanie malejąco (prym.) |
| `$^` | sortowanie z komparatorem (krotki) | `<~` | powrót |
| `\|>` | potok | `!?` | próba |
| `:!` | przechwytywanie | `:>` | na końcu |
| `#1` | prawda | `#0` | fałsz |
| `$!` | jest błędem | `$!!` | propagacja błędu |
| `<#` | import | `#>` | eksport |
| `#` | deklaracja modułu | `::` | wywołanie modułu |
| `.` | dostęp do pola | `#?` | metadane typu |
| `#\|..\|` | parsowanie liczby | `##.` | konwersja na Zmiennoprzecinkowy |
| `###` | konwersja na Całkowity (zaokr.) | `##!` | konwersja na Całkowity (obcięcie) |
| `#.N\|..\|` | zaokrąglenie | `#!N\|..\|` | obcięcie |
| `#,\|..\|` | format z przecinkami | `#^\|..\|` | notacja naukowa |
| `#d0d9#` | przełączanie trybu cyfr | `#09#` | reset do ASCII |
| `<\ ..\>` | wykonanie shell | `>\<` | argumenty CLI |
| `\ zm` | jawne zniszczenie | `°x` / `x°` | gorąca definicja (auto-init) |
| `>>|` | blok TUI (alt. ekran) | `>>~` | pozycjonowane wyjście |
| `>>!` | czyszczenie ekranu | `>>?` | zapytanie o rozmiar terminala |
| `<<\|` | blokujący klawisz | `<<\|?` | nieblokujący klawisz |
| `@~ N` | uśpienie N milisekund | `$*` | powtórzenie łańcucha N razy |

---

## Dziennik Zmian

### v0.0.5 — Prymitywy TUI, Gorąca Definicja i Powtórzenie Łańcucha _(maj 2026)_

- **Zmiana** Separator gałęzi dopasowania: `wzorzec : wynik` → `wzorzec => wynik`
- **Zmiana** Alias importu: `<# ścieżka <= alias` → `<# ścieżka => alias`
- **Zmiana** Zmiana nazwy przy eksporcie: `#> { fn <= pub }` → `#> { fn => pub }`
- **Dodano** Blok TUI `>>| { }` — ekran alternatywny + tryb raw; czyści po wyjściu
- **Dodano** Pozycjonowane wyjście `>>~ (wiersz, kol, STP, fg, bg) > elementy` — rzadkie sloty, 256-kolorowy ANSI
- **Dodano** Wejście klawisza `<<| zm` (blokujące) i `<<|? zm` (nieblokujące odpytywanie)
- **Dodano** `>>!` czyszczenie, `>>?` zapytanie o rozmiar, `@~ N` uśpienie N milisekund
- **Dodano** Gorąca definicja `°x` / `x°` — auto-inicjalizacja przy pierwszym użyciu w pętlach
- **Dodano** Powtórzenie łańcucha `lancuch $* N` — powtarza łańcuch N razy
- **VM** Parytet: 436/436 testów przechodzi

### v0.0.4 — Indeksowanie 1-Bazowe, Funkcje Pierwszej Klasy i Bloki Modułów _(kwiecień 2026)_

- **Zmiana** Całe indeksowanie przełączone na **1-bazowe** — `tablica[1]` to pierwszy element; `tablica[0]` jest błędem
- **Dodano** Nazwane funkcje są **wartościami pierwszej klasy** — przekazuj bezpośrednio do HOF: `liczby$> podwoj`
- **Dodano** Obowiązkowa **blokowa składnia** modułów: `# nazwa { ... }` — płaska składnia usunięta
- **Dodano** Wielowymiarowe indeksowanie: `tablica[i>j>k]` (nawigacja), `tablica[p ; q]` (płaskie wyodrębnianie)
- **Dodano** Konwersje typów: `##.wyr` (Zmiennoprzecinkowy), `###wyr` (Całkowity zaokr.), `##!wyr` (Całkowity obcięcie)
- **Dodano** Podział łańcucha: `lancuch$/ sep` — zwraca `Array(String)`
- **Dodano** Konkatenacja: `baza$++ a b c` — dołącza wiele elementów
- **Dodano** Pętla N razy: `@ N { }` — powtarza dokładnie N razy
- **Dodano** Składnia oznaczonej pętli: `@:nazwa { }`, `@:nazwa!`, `@:nazwa>` — zastępuje `@ @nazwa` / `@! nazwa`
- **Dodano** Zasady zakresu zmiennych: `_nazwa` ma dokładny zasięg blokowy; `\ zm` niszczy wcześnie
- **Dodano** Wzorce porównania w dopasowaniu: `< 0 :`, `> 5 :`, `== 42 :` itd.
- **Dodano** Błąd E013 modułu: wykonywalne instrukcje w ciele modułu są zabronione
- **Naprawiono** `take_variable` już nie uszkadza stałych modułu przy zapisie zwrotnym
- **Naprawiono** `alias.CONST` teraz rozwiązuje się poprawnie; `#>` może się pojawić po definicjach funkcji
- **VM** Pełny parytet: 393/393 testów przechodzi

### v0.0.3 — Unicode Systemy Numeryczne i Ulepszenia LSP _(kwiecień 2026)_

- **Dodano** 69 bloków cyfr Unicode z tokenem przełączającym `#d0d9#`
- **Dodano** Literały logiczne w dowolnym skrypcie — `#१` / `#०`, `#١` / `#٠` itd.
- **Dodano** Klingońskie cyfry pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Dodano** Kod operacyjny VM `SetNumeralMode` — pełny parytet z tree-walker
- **Zmiana** REPL respektuje aktywny tryb numeryczny w echo i wyświetlaniu zmiennych
- **Zmiana** Wyjście `>>` dla wartości logicznych teraz zawiera prefiks `#` (`#0` / `#1`) we wszystkich trybach

### v0.0.2_01 — Zmiana Nazwy Operatora _(30 mar 2026)_

- **Zmiana** `c|..|` → `#,|..|` i `e|..|` → `#^|..|` — konsekwentne z rodziną prefiksu `#`
- **Dodano** Alias eksportu: ponowny eksport członków modułu pod inną nazwą

### v0.0.2 — Przeprojektowanie API Kolekcji i Instalatory _(24 mar 2026)_

- **Dodano** Zunifikowana rodzina operatorów `$` dla tablic i łańcuchów (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Dodano** Destrukturyzacja dla tablic, krotek i nazwanych krotek
- **Dodano** Ujemne indeksy (`tablica[-1]` = ostatni element)
- **Dodano** Natywne instalatory — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 mar 2026)_

- **Dodano** Złożone przypisanie `^=`
- **Naprawiono** Przypadki brzegowe arytmetyki parsera; korekty dokumentacji

### v0.0.1 — Pierwsze Publiczne Wydanie _(22 mar 2026)_

- Interpreter tree-walker + rejestrowy VM (`--vm`, ~4× szybszy, ~95% parytet)
- Wszystkie podstawowe konstrukty: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pełne identyfikatory Unicode, system modułów, lambdy, domknięcia, obsługa błędów
- REPL, LSP, rozszerzenie VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Symboliczny. Uniwersalny. Niezmienny._
