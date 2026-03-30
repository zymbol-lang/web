# Podręcznik Zymbol-Lang

**Zymbol-Lang** to symboliczny język programowania. Nie używa słów kluczowych — wszystko jest symbolem. Działa tak samo w każdym języku ludzkim.

- Brak `if`, `while`, `return` — tylko `?`, `@`, `<~`
- Pełna obsługa Unicode — identyfikatory w dowolnym języku lub emoji
- Niezależny od języka ludzkiego — kod jest identyczny w każdym języku

---

## Zmienne i Stałe

```zymbol
x = 10              // zmienna modyfikowalna
PI := 3.14159       // stała — błąd przy ponownym przypisaniu
nazwa = "Alice"
aktywny = #1        // logiczna prawda
👋 := "Witaj"
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
| Int | `42`, `-7` | `###` | 64-bitowy ze znakiem |
| Float | `3.14`, `1.5e10` | `##.` | Notacja naukowa OK |
| String | `"tekst"` | `##"` | Interpolacja: `"Witaj {nazwa}"` |
| Char | `'A'` | `##'` | Jeden znak Unicode |
| Bool | `#1`, `#0` | `##?` | NIE numeryczne — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Jednorodne elementy |
| Krotka | `(a, b)` | `##)` | Pozycyjna |
| Nazwana Krotka | `(x: 1, y: 2)` | `##)` | Nazwane pola |

```zymbol
// Introspekcja typów — zwraca (typ, cyfry, wartość)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Wyjście i Wejście

```zymbol
>> "Witaj" ¶                      // ¶ lub \\ dla jawnej nowej linii
>> "a=" a " b=" b ¶               // zestawienie — wiele wartości
>> (arr$#) ¶                      // operatory postfiksowe wymagają ( )

<< nazwa                          // odczyt do zmiennej (bez promptu)
<< "Podaj nazwę: " nazwa          // z promptem
```

> `¶` (AltGr+R na klawiaturze hiszpańskiej) i `\\` są równoważnymi znakami nowej linii.

---

## Operatory

```zymbol
// Arytmetyczne — używaj przypisań; niektóre operatory mają osobliwości bezpośrednio w >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (dzielenie całkowite)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potęgowanie)

// Porównanie
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logiczne
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Ciągi Znaków

```zymbol
// Trzy formy łączenia
nazwa = "Alice"
n = 42

msg = "Witaj ", nazwa, "!"            // przecinek — w przypisaniach
>> "Witaj " nazwa " masz " n ¶        // zestawienie — w >>
desc = "Witaj {nazwa}, masz {n}"      // interpolacja — wszędzie
```

```zymbol
s = "Witaj Świecie"
len = s$#                  // 13
sub = s$[0..5]             // "Witaj"  (koniec wyłączny)
has = s$? "Świecie"        // #1
części = "a,b,c,d" / ','   // [a, b, c, d]
rep = s$~~["a":"A"]        // zamień wszystkie
rep1 = s$~~["a":"A":1]     // zamień pierwsze N
```

> `+` jest tylko dla liczb. Używaj `,`, zestawienia lub interpolacji dla ciągów znaków.

---

## Przepływ Sterowania

```zymbol
x = 7

? x > 0 { >> "dodatni" ¶ }

? x > 100 {
    >> "duży" ¶
} _? x > 0 {
    >> "dodatni" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "ujemny" ¶
}
```

> Nawiasy klamrowe `{ }` są **wymagane** nawet dla jednego wyrażenia.

---

## Dopasowanie

```zymbol
// Zakresy
wynik = 85
ocena = ?? wynik {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocena ¶    // → B

// Ciągi znaków
kolor = "czerwony"
kod = ?? kolor {
    "czerwony" : "#FF0000"
    "zielony"  : "#00FF00"
    _          : "#000000"
}

// Strażnicy
temp = -5
stan = ?? temp {
    _? temp < 0  : "lód"
    _? temp < 20 : "zimno"
    _? temp < 35 : "ciepło"
    _            : "gorąco"
}
>> stan ¶    // → lód

// Forma wyrażeniowa (blokowe ramiona)
?? n {
    0       : { >> "zero" ¶ }
    _? n < 0: { >> "ujemne" ¶ }
    _       : { >> "dodatnie" ¶ }
}
```

---

## Pętle

```zymbol
@ i:0..4  { >> i " " }        // zakres włączny:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // z krokiem:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // wstecz:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

owoce = ["jabłko", "gruszka", "winogrono"]
@ f:owoce { >> f ¶ }          // for-each po tablicy

@ c:"cześć" { >> c "-" }
>> ¶                          // → c-z-e-ś-ć-  (for-each po ciągu)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> kontynuacja
    ? i > 7 { @! }             // @! przerwanie
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

// Etykietowana pętla (zagnieżdżone przerwanie)
count = 0
@ @zewnetrzna {
    count++
    ? count >= 3 { @! zewnetrzna }
}
>> count ¶                    // → 3
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

Funkcje mają **izolowany zakres** — nie mogą odczytywać zmiennych zewnętrznych. Używaj parametrów wyjściowych `<~` do modyfikowania zmiennych wywołującego:

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

> Nazwane funkcje nie są wartościami pierwszej klasy. Aby przekazać jako argument: `x -> fn(x)`.

---

## Lambdy i Domknięcia

```zymbol
podwojony = x -> x * 2
suma = (a, b) -> a + b
>> podwojony(5) ¶    // → 10
>> suma(3, 7) ¶      // → 10

// Blokowa lambda
klasyfikuj = x -> {
    ? x > 0 { <~ "dodatni" }
    _? x < 0 { <~ "ujemny" }
    <~ "zero"
}

// Domknięcie — przechwytuje zakres zewnętrzny
czynnik = 3
potrojony = x -> x * czynnik
>> potrojony(7) ¶    // → 21

// Fabryka
make_adder(n) { <~ x -> x + n }
dodaj10 = make_adder(10)
>> dodaj10(5) ¶    // → 15

// W tablicach
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Tablice

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — dostęp (indeksacja od 0)
arr[-1]         // 5 — ujemny indeks (ostatni)
arr$#           // 5 — długość (używaj (arr$#) w >>)

arr = arr$+ 6            // dołącz → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // wstaw na indeks 2
arr3 = arr$- 3           // usuń pierwsze wystąpienie wartości
arr4 = arr$-- 3          // usuń wszystkie wystąpienia
arr5 = arr$-[0]          // usuń na indeksie
arr6 = arr$-[1..3]       // usuń zakres (koniec wyłączny)

has = arr$? 3            // #1 — zawiera
pos = arr$?? 3           // [2] — wszystkie indeksy wartości
sl = arr$[0..3]          // [1,2,3] — wycinek (koniec wyłączny)
sl2 = arr$[0:3]          // [1,2,3] — to samo, składnia oparta na liczbie

asc = arr$^+             // posortowane rosnąco  (tylko typy prymitywne)
desc = arr$^-            // posortowane malejąco (tylko typy prymitywne)

// Tablice krotek — użyj $^ z lambdą porównującą
db = [(nazwa: "Carla", wiek: 28), (nazwa: "Ana", wiek: 25), (nazwa: "Bob", wiek: 30)]
wg_wieku  = db$^ (a, b -> a.wiek < b.wiek)
wg_nazwy  = db$^ (a, b -> a.nazwa > b.nazwa)
>> wg_wieku[0].nazwa ¶     // → Ana
>> wg_nazwy[0].nazwa ¶     // → Carla

arr[1] = 99              // aktualizacja w miejscu
arr = arr[1]$~ 99        // aktualizacja funkcyjna — zwraca nową tablicę
```

> Wszystkie operatory kolekcji zwracają **nową tablicę**. Przypisz z powrotem: `arr = arr$+ 4`.
> Operatory nie mogą być łączone — używaj przypisań pośrednich.
> `$^+` / `$^-` sortują **tablice prymitywne** (liczby, ciągi). Dla tablic krotek używaj `$^` z lambdą porównującą.

```zymbol
// Tablice zagnieżdżone
macierz = [[1,2,3],[4,5,6],[7,8,9]]
>> macierz[1][2] ¶    // → 6
```

---

## Destrukturyzacja

```zymbol
// Tablica
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pierwsza, *reszta] = arr    // pierwsza=10  reszta=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ odrzuca

// Krotka pozycyjna
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Nazwana krotka
osoba = (nazwa: "Ana", wiek: 25, miasto: "Madryt")
(nazwa: n, wiek: w) = osoba  // n="Ana"  w=25
```

---

## Krotki

```zymbol
// Pozycyjna
punkt = (10, 20)
>> punkt[0] ¶    // → 10

// Nazwana
osoba = (nazwa: "Alice", wiek: 25)
>> osoba.nazwa ¶    // → Alice
>> osoba[0] ¶       // → Alice  (indeks też działa)

// Zagnieżdżona
pos = (x: 10, y: 20)
p = (pos: pos, etykieta: "poczatek")
>> p.pos.x ¶        // → 10
```

---

## Funkcje Wyższego Rzędu

> Operatory FWR wymagają **inline lambdy** — zmienne lambda przekazane bezpośrednio nie działają.

```zymbol
liczby = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

podwojone  = liczby$> (x -> x * 2)                // map  → [2,4,6…20]
parzyste   = liczby$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
razem      = liczby$< (0, (acc, x) -> acc + x)     // reduce → 55

// Łańcuch przez pośrednie
krok1 = liczby$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nazwane funkcje w FWR — opakuj w lambdę
podwoj(x) { <~ x * 2 }
r = liczby$> (x -> podwoj(x))    // ✅
```

---

## Operator Potoku

Prawa strona zawsze wymaga `_` jako miejsca zastępczego dla przekazanej wartości:

```zymbol
podwojony = x -> x * 2
dodaj = (a, b) -> a + b
inc = x -> x + 1

5 |> podwojony(_)      // → 10
10 |> dodaj(_, 5)      // → 15
5 |> dodaj(2, _)       // → 7

// Łańcuch
r = 5 |> podwojony(_) |> inc(_) |> podwojony(_)
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
| `##Type` | Błąd typu |
| `##Parse` | Parsowanie danych |
| `##Network` | Błędy sieciowe |
| `##_` | Dowolny błąd (catch-all) |

---

## Moduły

```zymbol
// lib/oblicz.zy
# oblicz

#> { dodaj, get_PI }    // eksporty MUSZĄ być przed definicjami

_PI := 3.14159
dodaj(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — bezpośredni dostęp do stałej przez alias nie jest obsługiwany
```

```zymbol
// main.zy
<# ./lib/oblicz <= o    // alias wymagany

>> o::dodaj(5, 3) ¶     // → 8
pi = o::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksport pod inną publiczną nazwą
# mojalib
#> { _wewnetrzne_dodaj <= suma }

_wewnetrzne_dodaj(a, b) { <~ a + b }
```

```zymbol
<# ./mojalib <= m

>> m::suma(3, 4) ¶    // → 7  (wewnętrzna nazwa _wewnetrzne_dodaj jest ukryta)
```

---

## Operatory Danych

```zymbol
// Parsowanie ciągu do liczby
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (bezpieczna awaria, bez błędu)

// Zaokrąglanie / obcinanie
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokrąglij do 2 miejsc dziesiętnych)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (obetnij)

// Formatowanie liczb
fmt = #,|1234567|  // → 1 234 567  (oddzielony spacją)
sci = #^|12345.678|    // → 1.2345678e4  (naukowy)

// Literały bazowe
a = 0x41         // → 'A'  (szesnastkowy)
b = 0b01000001   // → 'A'  (binarny)
c = 0o101        // → 'A'  (ósemkowy)

// Wyjście z konwersją bazy
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracja z Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // przechwytuje stdout (zawiera \n)
>> "Dzisiaj: " data

plik = "data.txt"
zawartosc = <\ cat {plik} \>    // interpolacja w poleceniach

wynik = </"./podskrypt.zy"/>    // wykonaj inny skrypt Zymbol, przechwyć wyjście
>> wynik
```

> `><` przechwytuje argumenty CLI jako tablicę ciągów (tylko tree-walker).

---

## Pełny Przykład: FizzBuzz

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

## Odniesienie do Symboli

| Symbol | Operacja | Symbol | Operacja |
|--------|----------|--------|----------|
| `=` | zmienna | `$#` | długość |
| `:=` | stała | `$+` | dołączanie |
| `>>` | wyjście | `$+[i]` | wstawianie na indeks |
| `<<` | wejście | `$-` | usuń pierwsze wyst. |
| `¶` / `\\` | nowy wiersz | `$--` | usuń wszystkie wyst. |
| `?` | jeśli | `$-[i]` | usuń na indeksie |
| `_?` | jeśli-inaczej | `$-[i..j]` | usuń zakres |
| `_` | inaczej / joker | `$?` | zawiera |
| `??` | dopasowanie | `$??` | znajdź wszystkie indeksy |
| `@` | pętla | `$[s..e]` | wycinek |
| `@!` | przerwanie | `$>` | mapowanie |
| `@>` | kontynuacja | `$\|` | filtrowanie |
| `->` | lambda | `$<` | redukcja |
| `$^+` | sortuj rosnąco (prymitywy) | `$^-` | sortuj malejąco (prymitywy) |
| `$^` | sortuj z porównaniem (krotki) | | |
| `<~` | powrót | `!?` | próba |
| `\|>` | potok | `:!` | przechwycenie |
| `#1` | prawda | `:>` | na końcu |
| `#0` | fałsz | `$!` | czy błąd |
| `<#` | import | `$!!` | propagacja błędu |
| `#` | deklaracja modułu | `#>` | eksport |
| `::` | wywołanie modułu | `.` | dostęp do pola |
| `#\|..\|` | parsuj liczbę | `#?` | metadane typu |
| `#.N\|..\|` | zaokrąglij | `#!N\|..\|` | obetnij |
| `c\|..\|` | format z separatorem | `e\|..\|` | naukowy |
| `<\ ..\>` | wykonaj shell | `><` | argumenty CLI |

---

*Zymbol-Lang — Symboliczny. Uniwersalny. Niezmienny.*

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
