> **Zrzeczenie się odpowiedzialności:** Ten dokument został utworzony i przetłumaczony przez sztuczną inteligencję (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Kanonicznym źródłem jest **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** w repozytorium interpretera.

---

# Podręcznik Zymbol-Lang

> **Zaktualizowano dla v0.0.9 — 2026-09-07**

**Zymbol-Lang** to symboliczny język programowania. W jego gramatyce nie ma słów — każda konstrukcja jest znakiem. Działa identycznie w każdym języku ludzkim.

- Brak `if`, `while`, `return` — tylko `?`, `@`, `<~`
- Pełny Unicode — identyfikatory w dowolnym języku lub emoji
- Niezależny od języka ludzkiego — kod jest wszędzie taki sam

**Wersja interpretera**: v0.0.9 | **Pokrycie testami**: 660/666 (trzy silniki zgodne, 0 rozbieżności)

---

## Zmienne i Stałe

```zymbol
x = 10              // zmienna mutowalna
PI := 3.14159       // stała — ponowne przypisanie to błąd wykonania
imię = "Anna"
aktywny = #1        // boolean prawda
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
x++       // 5
x--       // 4
```

`°` (znak stopnia, U+00B0) automatycznie inicjalizuje zmienną jej wartością neutralną przy pierwszym użyciu:

```zymbol
liczby = [3, 1, 4, 1, 5]
@ n:liczby {
    °suma += n
}
>> suma ¶              // → 14
```

> `°zmienna` (prefiks) zakotwicza się nad pętlą — wynik jest czytelny po `@`.
> `zmienna°` (sufiks) zakotwicza się wewnątrz pętli — umiera, gdy pętla się kończy.

Instrukcja będąca wyłącznie nazwą odczytuje zmienną i odrzuca wartość, więc ostrzega:

```zymbol
licznik = 5
licznik
```

Kompilator ostrzega tak (jego komunikaty są zawsze po angielsku):

```text
warning: this statement does nothing: 'licznik' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

To znaczy: *«ta instrukcja nic nie robi: 'licznik' został odczytany i odrzucony»*.

---

## Typy Danych

| Typ | Literał | Znacznik `#?` | Uwagi |
|------|---------|---------------|-------|
| Liczba całkowita | `42`, `-7` | `###` | Bezpieczna liczba całkowita: ±(2⁵³ − 1) |
| Liczba zmiennoprzecinkowa | `3.14`, `1.5e10` | `##.` | Podwójna precyzja IEEE-754 |
| Łańcuch | `"tekst"` | `##"` | Interpolacja: `"Cześć {imię}"` |
| Znak | `'A'` | `##'` | Jeden punkt kodowy Unicode |
| Wartość logiczna | `#1`, `#0` | `##?` | NIE jest liczbą — `#1 ≠ 1` |
| Tablica | `[1, 2, 3]` | `##]` | Jeden typ, sprawdzany |
| Zadeklarowana mieszanka | `#[1, "dwa"]` | `##[` | Ten sam typ co `[…]`, nie sprawdzany |
| Krotka | `(a, b)` | `##)` | Pozycyjna, niezmienna |
| Słownik | `#(x: 1, y: 2)` | `##(` | Kluczowany, mutowalny |
| Funkcja | odwołanie do nazwanej funkcji | `##()` | Pierwszorzędna; wyświetla `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pierwszorzędna; wyświetla `<lambd/N>` |
| Jednostka | `##_` | `##_` | Nieobecność — nie ma null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Liczba całkowita wychodząca poza bezpieczny zakres jest błędem, który można złapać, nigdy cichym przepełnieniem:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "poza zakresem" ¶ // → poza zakresem
}
```

`##_` to sposób, w jaki program pyta, czy czegoś brakuje:

```zymbol
nic() { }
wartość = nic()
>> (wartość == ##_) ¶     // → #1
```

---

## Wyjście i Wejście

```zymbol
imię = "Anna"
suma = 3
>> "Cześć" ¶             // → Cześć
>> "a=" imię " b=" suma ¶ // → a=Anna b=3
>> suma#? ¶            // → (###, 1, 3)
```

```zymbol
<< imię
<< "Podaj swoje imię: " imię
<< ###(4) "Wiek: " wiek
```

**Spójrz na kształt tych dwóch znaków.** `>>` wskazuje na zewnątrz: wyprowadza dane z programu. `<<` wskazuje do wewnątrz: wprowadza dane do programu. Nie ma tu nic do zapamiętania — strzałka pokazuje kierunek przepływu informacji, a ta sama idea powraca w każdym znaku, który coś przenosi.

> `¶` i `\\` to równoważne znaki nowej linii. `>>` nigdy jej nie dodaje.
> Specyfikator typu przed zachętą waliduje przy odczycie i pyta ponownie, aż wartość będzie prawidłowa:
> `##.` Liczba zmiennoprzecinkowa · `##.(T,D)` liczba dziesiętna · `###(N)` Liczba całkowita · `##"(N)"` tekst · `##'` jeden Znak.

Na najwyższym poziomie pliku `<~` to kod wyjścia programu:

```zymbol
>> "sprawdzam" ¶      // → sprawdzam
<~ 0
```

---

## Prymitywy TUI

Operatory interfejsu terminalowego dla programów interaktywnych. Większość wymaga bloku `>>| { }` (ekran alternatywny + tryb surowy).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Uruchomiony"
    @~ 1000
    >>~ (2, 1) > "Gotowe."
}
```

```zymbol
>>| {
    [wiersze, kolumny] = >>?
    >>~ (1, 1) > "Terminal: " wiersze " x " kolumny
    <<| klawisz
    >>~ (2, 1) > "Wciśnięto: " klawisz
}
```

Tu widać, dlaczego znaki się łączą, a nie mnożą. Wiesz już, że `<<` to wejście, a `?` pyta bez zobowiązania. Tylko jeden znak jest nowy:

- `|` to **pojedyncza jednostka**, nie cały strumień.

Dzięki temu oba operatory klawiatury czytają się same:

```text
<<        |             ?
wejście   jedna jednostka  bez zobowiązania

<<|   weź JEDEN klawisz i czekaj, aż jakiś się pojawi
<<|?  sprawdź, czy JAKIŚ klawisz jest, i idź dalej, jeśli nie ma
```

To samo po drugiej stronie: `>>` wysyła, `>>!` wysyła **z mocą** (czyści cały ekran), a `>>?` **pyta** zamiast pisać (jak duży jest terminal). Znak po prawej stronie to ten, który zmienia tryb, i zawsze jest ostatni.

> `>>!` czyści ekran. `>>?` zwraca `[wiersze, kolumny]`. `@~ N` śpi N milisekund.
> `<<|` czyta jedno wciśnięcie klawisza (blokujące); `<<|?` odpytuje bez blokowania (`'\0'`, jeśli brak).
> Klawisze strzałek przychodzą zdekodowane jako `'↑' '↓' '←' '→'`; ESC to punkt kodowy 27.
> Krotka wyjścia pozycjonowanego: `(wiersz, kolumna, BKS, przód, tył)` — każde pole można pominąć przecinkiem (`>>~ (,,, 196) > "czerwony"`).
> Maska bitowa BKS: `1`=Pogrubienie, `2`=Kursywa, `4`=Podkreślenie. Paleta ANSI 256 kolorów (`0`=domyślny terminala).

---

## Operatory

```zymbol
a = 10
b = 3
w1 = a + b    // 13
w2 = a - b    // 7
w3 = a * b    // 30
w4 = a / b    // 3  (dzielenie całkowite)
w5 = a % b    // 1
w6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
p1 = a == b    // #0
p2 = a <> b    // #1
p3 = a < b     // #0
p4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` nigdy nie wymusza konwersji: `"5" == 5` to `#0`. Porządkowanie wymusza: `"5" > 4` to `#1`, podobnie jak `"४२" > 5` — tekst liczbowy w dowolnym z 69 systemów pisma porównuje się jako liczba.
> Funkcja jest równa wyłącznie samej sobie, nigdy innej funkcji o tym samym ciele.

---

## Łańcuchy

```zymbol
imię = "Anna"
n = 42
>> "Cześć " imię " masz " n ¶ // → Cześć Anna masz 42
opis = "Cześć {imię}, masz {n}"
>> opis ¶              // → Cześć Anna, masz 42
```

```zymbol
s = "Witaj świecie"
długość = s$#                  // 13
podciąg = s$[1..5]             // "Witaj"
zawiera = s$? "świecie"          // #1
części = "a,b,c,d"$/ ','    // [a, b, c, d]
zamiana = s$~~["a":"o"]        // "Witoj świecie"
linia = "─" $* 20
```

> `+` służy wyłącznie liczbom. Dla łańcuchów używaj zestawienia lub interpolacji.
> `\{` i `\}` to dosłowne nawiasy klamrowe — ucieczka jest symetryczna.

---

## Sterowanie Przepływem

```zymbol
x = 7
? x > 100 {
    >> "duże" ¶
} _? x > 0 {
    >> "dodatnie" ¶     // → dodatnie
} _ {
    >> "ujemne" ¶
}
```

Mamy tu dwa nowe znaki i trzeci, który powstaje z ich połączenia:

- `?` to **pytanie**: otwiera warunek.
- `_` to **to, co nie zostało określone**: gałąź pozostała, gdy żadne pytanie nie pasuje.
- `_?` to oba po kolei: *jeśli nic nie pasuje, zapytaj ponownie*.

Dlatego `_?` jest napisane właśnie tak. To nie nowy znak do nauki — to `_` po którym następuje `?`, i znaczy dokładnie to, co znaczą obie jego części czytane po kolei.

> Nawiasy klamrowe `{ }` są **wymagane** nawet dla jednej instrukcji.

---

## Dopasowanie

```zymbol
punkty = 85
ocena = ?? punkty {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> ocena ¶              // → B
```

```zymbol
temperatura = -5
stan = ?? temperatura {
    < 0  => "lód"
    < 20 => "zimno"
    _    => "gorąco"
}
>> stan ¶              // → lód
```

Wiesz już, że `?` to «pytać». **`??` to pytać wielokrotnie**: podwojenie znaku gdziekolwiek w języku to wykonanie wielokrotnie tego, co znak robi raz. Jeden `?` sprawdza jeden warunek; `??` sprawdza listę przypadków.

Alternatywy łączą się przez `||` i mogą mieszać rodzaje wzorców:

```zymbol
klawisz = 'P'
akcja = ?? klawisz {
    'p' || 'P' => "pauza"
    < 0 || > 100 => "poza zakresem"
    _ => "ignorowane"
}
>> akcja ¶             // → pauza
```

---

## Pętle

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
owoce = ["jabłko", "gruszka", "winogrono"]
@ o:owoce { >> o " " }
>> ¶                    // → jabłko gruszka winogrono
@ z:"Cześć" { >> z "-" }
>> ¶                    // → C-z-e-ś-ć-
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
licznik = 0
@:zewnętrzna {
    licznik++
    ? licznik >= 3 { @:zewnętrzna! }
}
>> licznik ¶             // → 3
```

`@` to znak **czasu**: wszystko, co się powtarza, żyje w nim. Aby skrócić ten czas, dodajesz znak obok:

- `@!` — `!` to **siła**: wyjdź z pętli teraz.
- `@>` — `>` popycha do przodu: przejdź do następnego obrotu.
- `@:zewnętrzna!` — `:` **wiąże nazwę**, więc to przerywa pętlę *o nazwie* zewnętrzna, a nie najbliższą.

Trzy operatory, a żadnego nie trzeba było zapamiętywać osobno: to `@` plus znak, który już mówi, co robi.

> **Specyfikator to liczba lub warunek.** `Liczba całkowita` to liczba, oceniana raz — `@ 0` wykonuje ciało zero razy. Wszystko inne to warunek. Nie ma prawdziwości: `@ []` i `@ 3.5` są odrzucane. Aby przejść kolekcję, użyj `@ x:elementy`; aby ją policzyć, `@ elementy$#`.

---

## Funkcje

```zymbol
dodaj(a, b) { <~ a + b }
>> dodaj(3, 4) ¶        // → 7
```

```zymbol
silnia(n) {
    ? n <= 1 { <~ 1 }
    <~ n * silnia(n - 1)
}
>> silnia(5) ¶       // → 120
```

Funkcja odczytuje zmienne pliku przez wartość, a zapis wewnątrz pozostaje wewnątrz:

```zymbol
granica = 100
wewnątrz(n) { <~ n < granica }
>> wewnątrz(42) ¶         // → #1
```

Dwa znaki to zmieniają i oba są zapisywane **w sygnaturze i w miejscu wywołania**:

```zymbol
zwiększ(licznik<~) { licznik = licznik + 1 }
suma = 0
zwiększ(suma<~)
>> suma ¶              // → 1
```

> `p~` to kopia robocza — ciało może ją przypisać ponownie, a wywołujący pozostaje nietknięty.
> `p<~` to parametr wyjściowy — zmiana wraca. `zwiększ(suma)` bez znaku to błąd semantyczny: adnotacja i sygnatura nie mogą się rozchodzić.

---

## Lambdy i Domknięcia

```zymbol
podwój = x -> x * 2
suma = (a, b) -> a + b
>> podwój(5) ¶          // → 10
>> suma(3, 7) ¶          // → 10
```

```zymbol
klasyfikuj = x -> {
    ? x > 0 { <~ "dodatnie" }
    _? x < 0 { <~ "ujemne" }
    <~ "zero"
}
>> klasyfikuj(-4) ¶         // → ujemne
```

```zymbol
czynnik = 3
potrój = x -> x * czynnik
>> potrój(7) ¶          // → 21
```

```zymbol
stwórz_dodawacz(n) { <~ x -> x + n }
dodaj10 = stwórz_dodawacz(10)
>> dodaj10(5) ¶           // → 15
```

Lambda może nie przyjmować żadnych parametrów:

```zymbol
odpowiedź = () -> 42
>> odpowiedź() ¶           // → 42
```

> Lambda przechwytuje zmienne pliku **w momencie utworzenia**; nazwana funkcja odczytuje je **w momencie wywołania**.

---

## Tablice

```zymbol
tab = [1, 2, 3, 4, 5]
>> tab[1] ¶       // → 1   indeksowanie od 1
>> tab[-1] ¶      // → 5   ujemny liczy od końca
>> tab$# ¶        // → 5   długość
```

```zymbol
tab = [1, 2, 3]
>> (tab$+ 6) ¶          // → [1, 2, 3, 6]   dodaj
>> (tab$+[2] 99) ¶      // → [1, 99, 2, 3]  wstaw na pozycji 2
>> (tab$- 3) ¶          // → [1, 2]         usuń pierwsze wystąpienie
>> (tab$-[1]) ¶         // → [2, 3]         usuń na indeksie 1
>> (tab$[1..2]) ¶       // → [1, 2]         wycinek, oba końce włącznie
>> (tab$? 3) ¶          // → #1             zawiera
```

Wszystkie zaczynają się od `$`, znaku **kolekcji**, i kontynuują znakiem mówiącym, co się w niej robi: `#` ile, `+` dodaj, `-` usuń, `?` zapytaj, czy jest. I podobnie jak z `??`, podwojenie znaku oznacza wykonanie tego wyczerpująco: `$?` pyta, *czy* wartość jest obecna, `$??` pyta, *w ilu miejscach*, i zwraca wszystkie.

```zymbol
tab = [3, 1, 2]
>> (tab$^+) ¶     // → [1, 2, 3]   rosnąco
>> (tab$^-) ¶     // → [3, 2, 1]   malejąco
```

**Reguła wyniku.** Jeden operator, a to, co robi z nim otaczający kod, decyduje: użyty — **buduje** i pozostawia oryginał nietknięty; odrzucony — **modyfikuje**.

```zymbol
tab = [1, 2, 3]
kopia = tab[2]$~ 99
>> tab ¶                // → [1, 2, 3]
>> kopia ¶              // → [1, 99, 3]
tab[2]$~ 99
>> tab ¶                // → [1, 99, 3]
```

> **`=` nigdy nie pisze do kolekcji.** `tab[2] = 99` nie jest formą Zymbol — `=` nadaje wartość **NAZWIE**. Zmiana części kolekcji to `$~`, w każdej kolekcji.

`[…]` zawiera jeden typ i jest sprawdzany; celowa mieszanka jest **deklarowana** przez `#[…]`:

```zymbol
mieszanka = #[1, "dwa", #1]
>> mieszanka ¶             // → [1, dwa, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indeksowanie Wielowymiarowe

`>` schodzi w dół struktury zagnieżdżonej. Jedna grupa nawiasów adresuje jeden element, niezależnie od głębokości.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   wiersz 2, kolumna 3
>> m[-1>-1] ¶      // → 9   ostatni wiersz, ostatnia kolumna
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          płasko: przekątna
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   strukturalnie: narożniki
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **nie jest** formą Zymbol. Indeks łańcuchowy jest odrzucany zarówno do czytania, jak i do zapisu — jedna grupa nawiasów na jedno odwołanie, a `>` jest tym, co idzie między krokami.

---

## Słowniki

Krotka z nazwanymi polami to słownik, a od v0.0.9 zapisuje się go jako `#(…)`.

```zymbol
osoba = #(imię: "Anna", wiek: 25)
>> osoba.imię ¶        // → Anna
>> osoba["wiek"] ¶    // → 25
```

```zymbol
osoba = #(imię: "Anna", wiek: 25)
pole = "imię"
>> osoba[pole] ¶     // → Anna
```

Jest mutowalny, można dodawać klucze i można go przechodzić:

```zymbol
magazyn = #(gruszka: 4)
magazyn["jabłko"]$~ 10
@ k:magazyn { >> k "=" magazyn[k] " " }
>> ¶                    // → gruszka=4 jabłko=10
```

```zymbol
magazyn = #(gruszka: 4, jabłko: 10)
@ (k, v):magazyn { >> k ":" v " " }
>> ¶                    // → gruszka:4 jabłko:10
```

> `#()` to pusty słownik, którym `()` nigdy być nie mogło — musiałoby być także pustą krotką. Gołe `(x: 1)` jest odrzucane z komunikatem: *a dictionary is written `#(…)`* — «słownik pisze się `#(…)`».
> Słownik adresuje się kluczem, nigdy pozycją, więc `osoba[1]` to błąd.

---

## Krotki

Krotki to **niezmienne** uporządkowane kontenery przechowujące wartości różnych typów.

```zymbol
punkt = (10, 20)
>> punkt[1] ¶           // → 10
dane = (42, "Cześć", #1, 3.14)
>> dane[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Każda próba zmiany krotki w miejscu jest błędem, niezależnie od operatora — niezmienność jest właściwością wartości, a nie wyjątkiem wewnątrz każdego `$`.

---

## Destrukturyzacja

```zymbol
tab = [10, 20, 30, 40, 50]
[a, b, c] = tab
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
tab = [10, 20, 30, 40, 50]
[pierwszy, *reszta] = tab
>> pierwszy ¶            // → 10
>> reszta ¶              // → [20, 30, 40, 50]
```

```zymbol
punkt = (100, 200)
(px, py) = punkt
>> px " " py ¶          // → 100 200
```

```zymbol
osoba = #(imię: "Basia", wiek: 25)
#(imię: n, wiek: w) = osoba
>> n " " w ¶            // → Basia 25
```

> Kształt nawiasu jest typowany: `[…]` bierze tablicę, `(…)` krotkę, `#(…)` słownik. Ostatnia nazwa **wchłania resztę**, więc destrukturyzacja nigdy nie zawodzi z powodu długości — `(a, b, c) = (1,2,3,4,5)` daje `c = (3,4,5)`, a `##_`, gdy nic nie zostało.

---

## Funkcje Wyższego Rzędu

```zymbol
liczby = [1, 2, 3, 4, 5]
>> (liczby$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (liczby$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (liczby$< (0, (akum, x) -> akum + x)) ¶ // → 15
```

```zymbol
liczby = [1, 2, 3, 4, 5, 6]
podwój(x) { <~ x * 2 }
duży(x) { <~ x > 3 }
>> (liczby$> podwój) ¶    // → [2, 4, 6, 8, 10, 12]
>> (liczby$| duży) ¶    // → [4, 5, 6]
```

```zymbol
baza = [#(imię: "Karolina", wiek: 28), #(imię: "Basia", wiek: 25)]
według_wieku = baza$^ (a, b -> a.wiek < b.wiek)
>> według_wieku[1].imię ¶     // → Basia
```

> Nazwana funkcja przechodzi do HOF **bez nawiasów**: `liczby$> podwój`. Zapis `liczby$> (podwój)` to błąd składni, bo `(` otwiera lambdę.

---

## Operator Potoku

```zymbol
podwój = x -> x * 2
dodaj = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> podwój(_)) ¶    // → 10
>> (10 |> dodaj(_, 5)) ¶  // → 15
>> (5 |> podwój(_) |> inc(_)) ¶ // → 11
```

---

## Obsługa Błędów

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dzielenie przez zero" ¶  // → dzielenie przez zero
} :! {
    >> "inne: " _err ¶
} :> {
    >> "zawsze uruchamiane" ¶        // → zawsze uruchamiane
}
```

| Rodzaj | Kiedy |
|------|-------|
| `##Div` | Dzielenie przez zero |
| `##Index` | Indeks poza zakresem |
| `##Key` | Brak klucza w słowniku |
| `##Range` | Poza bezpiecznym zakresem liczby całkowitej |
| `##Type` | Niezgodność typów |
| `##Parse` | Analiza danych |
| `##IO` | Plik / system |
| `##Network` | Błędy sieci |
| `##DB` | Baza danych |
| `##Time` | Data, która nie istnieje |
| `##_` | Dowolny błąd (łapie wszystko) |

`!` to znak **błędu i siły**, i czyta się go tak samo w obu rodzinach: `$!` pyta wartość, czy jest błędem; `$!!`, z podwojonym znakiem, propaguje go w górę bez pytania.

> Błędy biblioteki standardowej wracają jako **miękkie wartości błędów**, które testujesz przez `$!` lub łapiesz przez `!?`, zamiast przerywać program. `$!!` propaguje jeden do wywołującego.

---

## Moduły

```zymbol
# kalk {
    #> { dodaj, PI }

    PI := 3.14159
    dodaj(a, b) { <~ a + b }
}
```

```zymbol
<# ./kalk => k

>> k::dodaj(5, 3) ¶
>> k.PI ¶
```

```zymbol
# moja_biblio {
    #> { wewn_dodaj => suma }

    wewn_dodaj(a, b) { <~ a + b }
}
```

Dwa znaki modułu to ta sama idea, teraz zastosowana do plików: `#` to poziom **deklaracji** — czym coś *jest*, a nie ile jest warte — a strzałka mówi, w którą stronę wędruje kod:

```text
<#   strzałka wchodzi: importuj, przynieś z innego pliku
#>   strzałka wychodzi: eksportuj, zaoferuj innym plikom
```

Znak kierunku zawsze siedzi na krawędzi zwróconej w stronę, w którą wskazuje. Z tego samego powodu `<~` wraca w lewo (z funkcji), a `->` wchodzi w prawo (do ciała lambdy).

> **Moduł deklaruje, co eksportuje.** Blok `#>` jest wymagany — jego pominięcie to **E014**, a `#> { }` to sposób, w jaki moduł mówi, że jego powierzchnia jest pusta. `::` wywołuje funkcję, `.` czyta stałą. W ciele modułu mogą pojawiać się wyłącznie importy, blok eksportu, inicjalizatory literałowe i definicje funkcji; cokolwiek wykonywalne to **E013**.

---

## Biblioteka Standardowa

Moduły natywne, importowane jak każde inne:

| Moduł | Funkcje |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
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

>> t::width("手番") ¶            // → 4   dwa glify, cztery kolumny
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

dzień = T::of(2026, 1, 31)
>> T::format(dzień, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(dzień, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` mierzy **kolumny wyświetlania**, nie znaki: CJK i większość emoji zajmują 2 kolumny, więc układaj tabele przez `t::width`, nigdy przez `$#`.
> W `std/time` moment to milisekundy od epoki. Poniżej jednego dnia to czas trwania, od jednego dnia w górę to kalendarz — więc miesiąc wypada tego samego dnia miesiąca, przycięty. `różnica(a, b)` to `a - b`, więc wcześniejszy moment podany pierwszy daje odpowiedź ujemną.

---

## Pakiety

`.zyp` pakuje wieloplikowy program w jeden przenośny plik. To archiwum **źródła**, nie plik binarny, więc działa wszędzie tam, gdzie działa binarka `zymbol`.

```bash
zymbol package mojprojekt/ --script main.zy -o mojprojekt.zyp
zymbol run mojprojekt.zyp
```

> Archiwum zawiera manifest (`zyp.toml`) deklarujący skrypty wejściowe i wymaganą wersję silnika. `zymbol run` rozpakowuje je do katalogu tymczasowego i uruchamia stamtąd, więc kod jest jednorazowy, a to, co zapisze skrypt, trafia do twojego prawdziwego katalogu roboczego. Playground również ładuje pliki `.zyp`.

---

## Tryby Numeryczne

Zymbol może zapisywać liczby w **69 systemach cyfr Unicode** — dewanagari, arabsko-indyjskim, tajskim, klingońskim pIqaD, matematycznym pogrubionym, segmentach LCD i innych. Tryb jest globalny dla procesu i wpływa na wyjście; arytmetyka się nie zmienia.

```zymbol
#०९#    // dewanagari   (U+0966–U+096F)
#٠٩#    // arabsko-indyjski (U+0660–U+0669)
#๐๙#    // tajski         (U+0E50–U+0E59)
#09#    // reset do ASCII
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

Cyfry dowolnego obsługiwanego systemu pisma są prawidłowymi literałami w źródle:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Odczyt jest symetryczny — cyfra jest rozumiana w dowolnym systemie pisma:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` jest zawsze ASCII, więc `#0` pozostaje wizualnie odróżnialne od cyfry zero w każdym systemie pisma.
> `#,` i `#^` również piszą swoje cyfry w aktywnym systemie pisma, a separatory za nim podążają — ale para nigdy się nie odwraca: `,` grupuje, a `.` oddziela, w każdym systemie pisma.

---

## Operatory Danych

```zymbol
f = ##.42         // do liczby zmiennoprzecinkowej
i = ###3.7        // do liczby całkowitej, zaokrąglone  → 4
t = ##!3.7        // do liczby całkowitej, obcięte  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Liczba zmiennoprzecinkowa drukuje się jako cyfry, nigdy w postaci wykładniczej, i opuszcza końcowe `.0` — `##.42` pisze `42` i nadal jest liczbą zmiennoprzecinkową, jak pokazuje `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   bezpieczne: zwraca wejście niezmienione
>> ##!'A' ¶        // → 65    punkt kodowy Znaku
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          zaokrąglij do 2 miejsc
>> #!2|pi| ¶       // → 3.14          obetnij do 2 miejsc
>> #,|1234567| ¶   // → 1,234,567     separatory tysięcy
>> #^|12345.678| ¶ // → 1.2345678e4   notacja naukowa
```

```zymbol
>> 0x41 ¶        // → A   szesnastkowo
>> 0b01000001 ¶  // → A   dwójkowo
>> 0o101 ¶       // → A   ósemkowo
>> 0d65 ¶        // → A   dziesiętnie
```

> Literał podstawy w zakresie ASCII jest **znakiem**: `0d65 == 'A'` to `#1`, a `0d65 == 65` to `#0`. Wszystkie cztery podstawy zapisują ten sam znak.

---

## Integracja z Powłoką

```zymbol
dzisiaj = <\ date +%Y-%m-%d \>
>> "Dzisiaj: " dzisiaj
```

```zymbol
wyjście = </"./podskrypt.zy"/>
>> wyjście
```

> `<\ … \>` przechwytuje stdout i stderr, z usunięciem końcowego znaku nowej linii.
> `>< args` przechwytuje argumenty wiersza poleceń jako tablicę łańcuchów.

---

## Pełny Przykład: FizzBuzz

```zymbol
klasyfikuj(liczba) {
    ? liczba % 15 == 0 { <~ "FizzBuzz" }
    _? liczba % 3  == 0 { <~ "Fizz" }
    _? liczba % 5  == 0 { <~ "Buzz" }
    <~ liczba
}

@ i:1..20 { >> klasyfikuj(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (jeden na wiersz)
```

---

## Jak Znaki Się Łączą

Widziałeś to samo przez cały podręcznik: **operator to nie rysunek do zapamiętania, to kilka znaków pod rząd, a każdy z nich wnosi swoje znaczenie.** Teraz, gdy znasz je wszystkie, oto pełny wzorzec.

Najpierw przychodzi **w jakim świecie jesteśmy**:

| Znak | Świat | Widziałeś go w |
|------|-------|----------------|
| `$` | kolekcja | `$#` `$+` `$?` `$^-` |
| `@` | czas, wszystko, co się powtarza | `@!` `@>` `@~` |
| `#` | czym coś *jest*, nie ile jest warte | `#?` `#(…)` `<#` `#>` |
| `>>` | na zewnątrz programu | `>>` `>>!` `>>?` |
| `<<` | do programu | `<<` `<<\|` `<<\|?` |
| `?` | pytać, bez zobowiązania | `?` `_?` `??` `$?` |
| `!` | siła albo błąd | `@!` `$!` `!?` |

Potem przychodzi **co się tam robi**: `+` dodaj, `-` usuń, `^` uporządkuj, `~` zmodyfikuj, `#` policz, `|` jedna jednostka, `:` zwiąż nazwę.

I dwie zasady, które nigdy nie zawodzą:

**Podwojenie znaku czyni go wyczerpującym.** `?` pyta raz, `??` sprawdza wiele przypadków. `$?` pyta, czy wartość jest obecna, `$??` zwraca każde miejsce, w którym jest. `!` oznacza błąd, `!!` propaguje go bez pytania.

**Znak trybu zawsze jest ostatni.** Kiedy `?` albo `!` pojawiają się, by powiedzieć, *jak* coś się dzieje — niepewnie czy z mocą — są ostatnim znakiem operatora: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:zewnętrzna!`. Nigdy po nich nie ma żadnej operacji.

Wynika z tego coś praktycznego: **kombinacja, której nigdy nie widziałeś, ma sens zanim jej poszukasz.** Jeśli `$` to kolekcja, `^` to porządek, a `-` to odwrócenie, to `$^-` sortuje malejąco i nikt nie musiał ci tego mówić.

Nie cały inwentarz działa w ten sposób i powiedzenie tego jest lepsze niż udawanie. Większość operatorów rozkłada się czysto. Sześć rozkłada się, ale znaczy więcej niż ich części: `!?` `:!` `:>` `|>` `::` `$++`. I dziesięć trzeba zapamiętać, bo wcale się nie rozkładają: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Liczenie nieprzejrzystych, zamiast zakładania, że jest ich mało, jest celowe: to prawdziwy koszt zapamiętywania języka. Pełne źródło — inwentarz, zadeklarowane homografy i reguły, które musi spełniać nowy operator, by istnieć — znajduje się w `SYMBOLS.md` w repozytorium interpretera.

---

## Skorowidz Znaków

| Znak | Operacja | Znak | Operacja |
|--------|-----------|--------|-----------|
| `=` | zmienna | `$#` | długość |
| `:=` | stała | `$+` | dodaj |
| `>>` | wyjście | `$+[i]` | wstaw na indeksie (od 1) |
| `<<` | wejście | `$-` | usuń pierwsze po wartości |
| `¶` / `\\` | nowa linia | `$--` | usuń wszystkie po wartości |
| `?` | jeśli | `$-[i]` | usuń na indeksie (od 1) |
| `_?` | w przeciwnym razie jeśli | `$-[i..j]` | usuń zakres (od 1) |
| `_` | inaczej / symbol zastępczy | `$?` | zawiera |
| `??` | dopasowanie | `$??` | znajdź wszystkie indeksy (od 1) |
| `\|\|` | wzorzec lub w gałęzi | `$[s..e]` | wycinek (od 1) |
| `@` | pętla | `$>` | mapuj |
| `@ N { }` | pętla N razy | `$\|` | filtruj |
| `@!` | przerwij | `$<` | zredukuj |
| `@>` | kontynuuj | `$/ separator` | podziel łańcuch |
| `@:nazwa { }` | pętla z etykietą | `$++ a b c` | buduj przez konkatenację |
| `@:nazwa!` | przerwij etykietę | `$~~[p:r]` | zamień w łańcuchu |
| `@:nazwa>` | kontynuuj etykietę | `$*` | powtórz łańcuch |
| `->` | lambda | `tab[i]$~ v` | JEDYNA forma aktualizacji |
| `<~` | zwrot / parametr wyjściowy | `~` | parametr kopii roboczej |
| `tab[i>j]` | indeks nawigacji | `tab[p ; q]` | ekstrakcja płaska |
| `$^+` | sortuj rosnąco | `$^-` | sortuj malejąco |
| `$^` | sortuj z komparatorem | `\|>` | potok |
| `!?` | spróbuj | `:!` | złap |
| `:>` | w końcu | `$!` | czy błąd |
| `$!!` | propaguj błąd | `#1` / `#0` | prawda / fałsz |
| `##_` | Jednostka — nieobecność | `[…]` | tablica, jeden typ |
| `#[…]` | tablica, zadeklarowana mieszanka | `#(…)` | słownik |
| `(…)` | krotka pozycyjna | `#()` | pusty słownik |
| `<#` | importuj | `#>` | eksportuj |
| `#` | zadeklaruj moduł | `::` | wywołaj moduł |
| `.` | dostęp do pola / stałej | `#?` | metadane typu |
| `#\|..\|` | parsuj liczbę | `##.` | konwertuj na liczbę zmiennoprzecinkową |
| `###` | konwertuj na liczbę całkowitą (zaokrąglij) | `##!` | konwertuj na liczbę całkowitą (obetnij) |
| `#.N\|..\|` | zaokrąglij | `#!N\|..\|` | obetnij |
| `#,\|..\|` | separatory tysięcy | `#^\|..\|` | notacja naukowa |
| `#d0d9#` | przełącz tryb numeryczny | `#09#` | reset do ASCII |
| `<\ ..\>` | wykonaj shell | `><` | argumenty CLI |
| `\ var` | zniszcz zmienną | `°x` / `x°` | gorąca definicja |
| `>>\|` | blok TUI (ekran alternatywny) | `>>~` | wyjście pozycjonowane |
| `>>!` | wyczyść ekran | `>>?` | zapytaj o rozmiar terminala |
| `<<\|` | blokujące wciśnięcie klawisza | `<<\|?` | nieblokujące wciśnięcie klawisza |
| `@~ N` | śpij N milisekund | `0d` `0x` `0o` `0b` | literały podstawy |

---

## Dziennik Zmian Wydania

### v0.0.9 — Kolekcje Zdecydowały _(wrzesień 2026)_

- **Łamiąca** Słownik ma własną notację: `#(klucz: wartość)`. Gołe `(x: 1)` jest odrzucane, a `#()` to pusty słownik — którym `()` nigdy nie mogło być
- **Łamiąca** Przypisanie indeksowane wycofane: `tab[i] = v` i wszystkie formy złożone. `=` nadaje wartość **NAZWIE**; zmiana części kolekcji to `$~`
- **Łamiąca** Indeks łańcuchowy `m[i][j]` odrzucany zarówno do czytania, jak i zapisu — `>` jest tym, co idzie między krokami
- **Łamiąca** Moduł musi zadeklarować, co eksportuje (**E014**); `#> { }` to sposób, w jaki moduł mówi, że jego powierzchnia jest pusta
- **Łamiąca** Specyfikator pętli to liczba albo warunek — bez prawdziwości. `@ []` i `@ 3.5` są odrzucane
- **Dodano** `##_` — literał Jednostki i sposób, w jaki program pyta, czy czegoś brakuje
- **Dodano** `#[…]` — tablica, której mieszanka typów elementów jest zadeklarowana
- **Dodano** `#?` rozróżnia cztery kolekcje: `##]` `##[` `##)` `##(`
- **Dodano** `std/time` — zegar i kalendarz cywilny, ze strefami i arytmetyką kalendarzową
- **Dodano** Najwyższego poziomu `<~` to kod wyjścia programu
- **Dodano** `@ (k, v):pary` — wzorzec w nagłówku pętli
- **Dodano** `#|c|` czyta cyfrę w jednym z 69 systemów pisma; `#,` i `#^` piszą w aktywnym
- **Zmieniono** `Liczba całkowita` to bezpieczna liczba całkowita, ±(2⁵³ − 1), zamykana przy błędzie w każdym silniku
- **Zmieniono** Nazwana funkcja odczytuje zmienne pliku w momencie wywołania, przez wartość
- **Zmieniono** Instrukcja czytająca tylko nazwę ostrzega, zamiast przechodzić cicho
- **Silniki** 660 z 666 plików korpusu zgodnych we wszystkich trzech silnikach, 0 rozbieżności

### v0.0.8 — Auto-zwalnianie, `std/term` i Pakiety _(sierpień 2026)_

- **Dodano** Automatyczne zniszczenie przy ostatnim użyciu — niewidoczne; obniża tylko szczytową pamięć
- **Dodano** `std/term` — metryki wyświetlania w kolumnach terminala
- **Dodano** `##!` na `Znaku` — jego punkt kodowy Unicode
- **Dodano** Wzorce lub w dopasowaniu: `'p' || 'P' => …`, alternatywy dowolnego rodzaju w jednej gałęzi
- **Dodano** Pakiety Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Dodano** `<~` w miejscu wywołania jest wymagane tam, gdzie wywoływany deklaruje parametr wyjściowy
- **Naprawiono** Parytet systemu modułów w VM rejestrowej

### v0.0.7 — Natywna Biblioteka Standardowa _(lipiec 2026)_

- **Dodano** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — wszystkie z miękkimi wartościami błędów
- **Dodano** Wejście typowane/walidowane: `<< ##.(5,2) "cena: " p`
- **Dodano** Operatory postfiksowe bezpośrednio w `>>` — bez nawiasów
- **Zmieniono** Formatter zamykany przy błędzie: odmawia zapisu wyjścia, którego nie może odczytać ponownie

### v0.0.6 — Udoskonalenie i Biblioteka Naukowa _(czerwiec 2026)_

- **Łamiąca** `=>` zastępuje `:` w gałęziach dopasowania i `<=` w aliasach importu/eksportu
- **Dodano** `std/math` i `std/random`
- **Dodano** Aktualizacja słownika po kluczu: `d["k"]$~ wartość`

### v0.0.5 — Prymitywy TUI i Gorąca Definicja _(maj 2026)_

- **Dodano** Blok TUI `>>| { }`, wyjście pozycjonowane `>>~`, wejście klawiszy `<<|` i `<<|?`
- **Dodano** `>>!` wyczyść ekran, `>>?` rozmiar terminala, `@~ N` sen
- **Dodano** Gorąca definicja `°x` / `x°` i powtórzenie łańcucha `$*`

### v0.0.4 — Indeksowanie od 1 i Funkcje Pierwszorzędne _(kwiecień 2026)_

- **Łamiąca** Wszystkie indeksy **od 1** — `tab[1]` to pierwszy element
- **Dodano** Nazwane funkcje jako wartości pierwszorzędne; składnia bloku modułu `# nazwa { }`
- **Dodano** Indeksowanie wielowymiarowe `tab[i>j>k]` i ekstrakcja płaska `tab[p ; q]`

### v0.0.3 — Systemy Cyfr Unicode _(kwiecień 2026)_

- **Dodano** 69 bloków cyfr Unicode z tokenem przełączania trybu `#d0d9#`
- **Dodano** Literały logiczne w dowolnym systemie pisma — `#१` / `#०`

### v0.0.2 — Przeprojektowanie API Kolekcji _(marzec 2026)_

- **Dodano** Rodzina operatorów `$` dla tablic i łańcuchów
- **Dodano** Przypisanie destrukcyjne i indeksy ujemne

### v0.0.1 — Pierwsze Wydanie Publiczne _(marzec 2026)_

- Interpreter przechodzenia po drzewie + VM rejestrowa (`--vm`)
- Wszystkie konstrukcje rdzenia: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pełne identyfikatory Unicode, system modułów, lambdy, domknięcia, obsługa błędów
- REPL, LSP, rozszerzenie VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Symboliczny. Uniwersalny. Niezmienny._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licencja:** ten podręcznik jest objęty licencją [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Pełny tekst: `LICENSE-CC-BY-SA-4.0` w <https://github.com/zymbol-lang/web>. Interpreter i silnik przeglądarkowy (`zymbol.js`) są odrębnymi utworami, licencjonowanymi na AGPL-3.0-only.
