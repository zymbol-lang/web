# Kompaktowy Podręcznik Zymbol-Lang

**Zymbol-Lang** to symboliczny język programowania. Nie używa słów kluczowych — wszystko jest symbolem. Działa tak samo w każdym języku ludzkim.

---

## Filozofia

- Brak słów kluczowych (`jeśli`, `pętla`, `powrót` nie istnieją — tylko symbole: `?`, `@`, `<~`)
- Pełna obsługa Unicode — identyfikatory w dowolnym języku lub emoji 👋
- Niezależny od języka ludzkiego — kod jest identyczny w każdym języku

---

## Zmienne i Stałe

```zymbol
x = 10           // zmienna (modyfikowalna)
PI := 3.14159    // stała (niemodyfikowalna — błąd przy ponownym przypisaniu)
nazwa = "Ana"
aktywny = #1     // logiczna prawda
👋 := "Witaj, Polskojęzyczny Świecie!"
```

### Złożone Przypisanie

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

## Typy Danych

| Typ           | Przykład            | Symbol `#?` | Uwagi                                 |
|---------------|---------------------|-------------|---------------------------------------|
| Liczba całk.  | `42`, `-7`          | `###`       | 64-bitowa ze znakiem                  |
| Zmiennoprzec. | `3.14`, `1.5e10`    | `##.`       | Notacja naukowa OK                    |
| Ciąg znaków   | `"cześć"`           | `##"`       | Interpolacja: `"Cześć {nazwa}"`       |
| Znak          | `'A'`               | `##'`       | Jeden znak Unicode                    |
| Logiczny      | `#1`, `#0`          | `##?`       | NIE jest liczbą 1 i 0                 |
| Tablica       | `[1, 2, 3]`         | `##]`       | Wszystkie elementy muszą być tego samego typu |
| Krotka        | `(a, b)`            | `##)`       | Pozycyjna                             |
| Nazwana krotka| `(x: 1, y: 2)`      | `##)`       | Dostęp po nazwie lub indeksie         |

---

## Wyjście i Wejście

```zymbol
// Wyjście — NIE dodaje automatycznie nowej linii
>> "Witaj, Polskojęzyczny Świecie!" ¶   // ¶ lub \\ daje jawny nowy wiersz
>> "a=" a " b=" b ¶                      // wiele wartości przez zestawienie
>> "suma=" add(2, 3) ¶                   // wywołania funkcji na dowolnej pozycji
>> (arr$#) ¶                             // operatory postfiksowe wymagają nawiasów

// Wejście
<< nazwa                                 // bez promptu — odczyt do zmiennej
<< "Twoje imię? " nazwa                  // z promptem
```

> `¶` lub `\\` są równoważne jako nowy wiersz.

---

## Łączenie Ciągów

Trzy prawidłowe formy — każda do swojego kontekstu:

```zymbol
nazwa = "Ana"
liczba = 25

// 1. Przecinek — w przypisaniach z = lub :=
wiad = "Cześć ", nazwa, "!"             // → Cześć Ana!
TYTUL := "Użytkownik: ", nazwa

// 2. Zestawienie — w wyjściu >>
>> "Cześć " nazwa " masz " liczba " lat" ¶    // → Cześć Ana masz 25 lat

// 3. Interpolacja — w dowolnym kontekście
opis = "Cześć {nazwa}, masz {liczba} lat"     // → Cześć Ana, masz 25 lat
```

> **Uwaga**: `+` jest tylko dla liczb. Użycie z ciągami generuje ostrzeżenie.

---

## Przepływ Sterowania

```zymbol
x = 7

// Proste jeśli
? x > 0 { >> "dodatni" ¶ }

// jeśli / jeśli-inaczej / inaczej
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

Bloki `{ }` są **wymagane** nawet dla pojedynczej linii.

---

## Dopasowanie

```zymbol
// Dopasowanie z zakresami
punkty = 85
ocena = ?? punkty {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocena ¶    // → B

// Dopasowanie z warunkami (dowolne warunki)
temperatura = -5
stan = ?? temperatura {
    _? temperatura < 0  : "lód"
    _? temperatura < 20 : "zimno"
    _? temperatura < 35 : "ciepło"
    _                   : "gorąco"
}
>> stan ¶    // → lód

// Dopasowanie z ciągami
kolor = "czerwony"
kod = ?? kolor {
    "czerwony" : "#FF0000"
    "zielony"  : "#00FF00"
    _          : "#000000"
}
>> kod ¶
```

---

## Pętle

```zymbol
// Zakres włączny: 0..4 iteruje 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Zakres z krokiem
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Zakres odwrotny
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Pętla while
liczba = 1
@ liczba <= 64 { liczba *= 2 }
>> liczba ¶    // → 128

// For-each po tablicy
owoc = ["jabłko", "gruszka", "winogrono"]
@ f:owoc { >> f ¶ }

// Po znakach ciągu
@ c:"cześć" { >> c "-" }
>> ¶    // → c-z-e-ś-ć-

// Przerwanie i kontynuacja
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> kontynuacja
    ? i > 7 { @! }          // @! przerwanie
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcje

```zymbol
// Deklaracja i wywołanie
dodaj(a, b) { <~ a + b }
>> dodaj(3, 4) ¶    // → 7

// Rekurencja
silnia(liczba) {
    ? liczba <= 1 { <~ 1 }
    <~ liczba * silnia(liczba - 1)
}
>> silnia(5) ¶    // → 120

// Funkcje mają izolowany zakres — brak dostępu do zewnętrznych zmiennych
_globalny = 100
testuj() {
    x = 42    // tylko lokalna
    <~ x
}
>> testuj() ¶    // → 42
```

> **Ważne**: Nazwane funkcje `nazwa(parametry){ }` nie są wartościami pierwszej klasy.
> Aby przekazać jako argument, opakuj: `x -> funkcja(x)`.

---

## Lambdy i Domknięcia

```zymbol
// Prosta lambda (niejawny powrót)
podwojony = x -> x * 2
suma = (a, b) -> a + b
>> podwojony(5) ¶    // → 10
>> suma(3, 7) ¶      // → 10

// Lambda blokowa (jawny powrót)
sklasyfikuj = x -> {
    ? x > 0 { <~ "dodatni" }
    _? x < 0 { <~ "ujemny" }
    <~ "zero"
}
>> sklasyfikuj(5) ¶     // → dodatni
>> sklasyfikuj(0) ¶     // → zero
>> sklasyfikuj(-5) ¶    // → ujemny

// Domknięcia — lambdy przechwytują zmienne z zewnętrznego zakresu
czynnik = 3
potrojony = x -> x * czynnik    // przechwytuje 'czynnik'
>> potrojony(7) ¶    // → 21

// Fabryka funkcji
zrob_dodawacz(n) { <~ x -> x + n }
dodaj10 = zrob_dodawacz(10)
>> dodaj10(5) ¶    // → 15

// Lambdy jako wartości: przechowywane w tablicach
operacje = [x -> x+1, x -> x*2, x -> x*x]
>> operacje[0](5) ¶    // → 6
>> operacje[2](5) ¶    // → 25
```

---

## Tablice

```zymbol
arr = [10, 20, 30, 40, 50]

// Dostęp (indeks od 0)
>> arr[0] ¶    // → 10

// Długość (wymaga nawiasów w >>)
liczba = arr$#
>> (arr$#) ¶    // → 5

// Dołączanie, usuwanie, zawiera, wycinek
arr = arr$+ 60               // dołączanie
arr = arr$- 0                // usuń indeks 0
jest = arr$? 30              // → #1
wycinek = arr$[0..2]         // [20, 30]

// Aktualizacja elementu
arr[1] = 99

// For-each
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` zwracają **nową tablicę** — przypisz z powrotem: `arr = arr$+ 4`.
> Brak łańcuchowania: użyj dwóch osobnych przypisań.

---

## Krotki

```zymbol
// Nazwana krotka
osoba = (nazwa: "Alice", wiek: 25)
>> osoba.nazwa ¶    // → Alice
>> osoba.wiek ¶     // → 25
>> osoba[0] ¶       // → Alice (indeks też działa)
```

---

## Funkcje Wyższego Rzędu

Operatory HOF wymagają **inline lambdy** — nie bezpośredniej zmiennej lambda.

```zymbol
liczby = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Mapowanie ($>)
podwojone = liczby$> (x -> x * 2)
>> podwojone ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtrowanie ($|)
parzyste = liczby$| (x -> x % 2 == 0)
>> parzyste ¶    // → [2, 4, 6, 8, 10]

// Redukcja ($<) — (wartość początkowa, (acc, elem) -> wyrażenie)
razem = liczby$< (0, (acc, x) -> acc + x)
>> razem ¶    // → 55
```

---

## Obsługa Błędów

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dzielenie przez zero" ¶
} :! ##IO {
    >> "błąd IO" ¶
} :! {
    >> "inny błąd: " _err ¶
} :> {
    >> "zawsze się wykonuje" ¶
}
```

| Typ         | Kiedy występuje          |
|-------------|--------------------------|
| `##Div`     | Dzielenie przez zero      |
| `##IO`      | Plik / system             |
| `##Index`   | Indeks poza zakresem      |
| `##Type`    | Błąd typu                 |
| `##Parse`   | Parsowanie danych         |
| `##Network` | Błędy sieciowe            |
| `##_`       | Dowolny błąd (catch-all)  |

---

## Moduły

```zymbol
// Plik: lib/oblicz.zy
# oblicz

#> { dodaj, get_PI }    // eksporty PRZED definicjami

_PI := 3.14159
dodaj(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Plik: main.zy
<# ./lib/oblicz <= o    // alias wymagany

>> o::dodaj(5, 3) ¶    // → 8
pi = o::get_PI()
>> pi ¶                 // → 3.14159
```

---

## Pełny Przykład: FizzBuzz

```zymbol
sklasyfikuj(liczba) {
    ? liczba % 15 == 0 { <~ "SzumBzy" }
    _? liczba % 3  == 0 { <~ "Szum" }
    _? liczba % 5  == 0 { <~ "Bzy" }
    _ { <~ liczba }
}

@ i:1..20 { >> sklasyfikuj(i) ¶ }
```

---

## Odniesienie do Symboli

| Symbol      | Operacja             | Symbol      | Operacja               |
|-------------|----------------------|-------------|------------------------|
| `=`         | zmienna              | `$#`        | długość                |
| `:=`        | stała                | `$+`        | dołączanie             |
| `>>`        | wyjście              | `$-`        | usunięcie (po indeksie)|
| `<<`        | wejście              | `$?`        | zawiera                |
| `¶`/`\`     | nowy wiersz          | `$[s..e]`   | wycinek                |
| `?`         | jeśli                | `$>`        | mapowanie              |
| `_?`        | jeśli-inaczej        | `$\|`       | filtrowanie            |
| `_`         | inaczej / joker      | `$<`        | redukcja               |
| `??`        | dopasowanie          | `!?`        | próba                  |
| `@`         | pętla                | `:!`        | przechwycenie          |
| `@!`        | przerwanie           | `:>`        | na końcu               |
| `@>`        | kontynuacja          | `$!`        | czy błąd               |
| `->`        | lambda               | `$!!`       | propagacja błędu       |
| `<~`        | powrót               | `#`         | deklaracja modułu      |
| `\|>`       | potok                | `#>`        | eksport                |
| `#1`        | prawda               | `<#`        | import                 |
| `#0`        | fałsz                | `::`        | wywołanie modułu       |

---

*Zymbol-Lang — Symboliczny. Uniwersalny. Niezmienny.*

---

> **Zastrzeżenie:** Ta dokumentacja została stworzona i przetłumaczona przez sztuczną inteligencję (SI). Dołożono wszelkich starań, aby zapewnić dokładność, ale niektóre tłumaczenia lub przykłady mogą zawierać błędy. Autorytatywnym odniesieniem jest [specyfikacja Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
