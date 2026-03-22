# Kompaktni Priručnik za Zymbol-Lang

**Zymbol-Lang** je simbolički programski jezik. Ne koristi ključne riječi — sve je simbol. Funkcionira jednako u svakom ljudskom jeziku.

---

## Filozofija

- Nema ključnih riječi (`ako`, `petlja`, `povrat` ne postoje — samo simboli: `?`, `@`, `<~`)
- Potpuna podrška za Unicode — identifikatori na bilo kojem jeziku ili emoji 👋
- Neovisan o ljudskom jeziku — kod je identičan u svakom jeziku

---

## Varijable i Konstante

```zymbol
x = 10           // varijabla (promjenjiva)
PI := 3.14159    // konstanta (nepromjenjiva — greška pri ponovnom dodjeljivanju)
ime = "Ana"
aktivan = #1     // logička istina
👋 := "Zdravo, Hrvatski govoreći Svijete!"
```

### Složena Dodjela

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

## Vrste Podataka

| Vrsta            | Primjer             | Symbol `#?` | Napomena                               |
|------------------|---------------------|-------------|----------------------------------------|
| Cijeli broj      | `42`, `-7`          | `###`       | 64-bitni s predznakom                  |
| Decimalni broj   | `3.14`, `1.5e10`    | `##.`       | Znanstvena notacija OK                 |
| Niz znakova      | `"zdravo"`          | `##"`       | Interpolacija: `"Zdravo {ime}"`        |
| Znak             | `'A'`               | `##'`       | Jedan znak Unicode                     |
| Logički          | `#1`, `#0`          | `##?`       | NIJE numerički 1 i 0                   |
| Polje            | `[1, 2, 3]`         | `##]`       | Svi elementi moraju biti istog tipa    |
| Tuple            | `(a, b)`            | `##)`       | Pozicijsko                             |
| Imenovani Tuple  | `(x: 1, y: 2)`      | `##)`       | Pristup po imenu ili indeksu           |

---

## Izlaz i Ulaz

```zymbol
// Izlaz — NE dodaje automatski novi red
>> "Zdravo, Hrvatski govoreći Svijete!" ¶   // ¶ ili \\ daje eksplicitni novi red
>> "a=" a " b=" b ¶                          // više vrijednosti jukstapozicijom
>> "zbroj=" add(2, 3) ¶                      // pozivi funkcija na bilo kojoj poziciji
>> (arr$#) ¶                                 // postfiksni operatori zahtijevaju zagrade

// Ulaz
<< ime                                       // bez upita — čita u varijablu
<< "Tvoje ime? " ime                         // s upitom
```

> `¶` ili `\\` su ekvivalentni kao novi red.

---

## Spajanje Nizova

Tri valjana oblika — svaki za svoj kontekst:

```zymbol
ime = "Ana"
broj = 25

// 1. Zarez — u dodjeli s = ili :=
poruka = "Zdravo ", ime, "!"                // → Zdravo Ana!
NASLOV := "Korisnik: ", ime

// 2. Jukstapozicija — u izlazu >>
>> "Zdravo " ime " imaš " broj " godina" ¶    // → Zdravo Ana imaš 25 godina

// 3. Interpolacija — u bilo kojem kontekstu
opis = "Zdravo {ime}, imaš {broj} godina"     // → Zdravo Ana, imaš 25 godina
```

> **Napomena**: `+` je samo za brojeve. Korištenje s nizovima generira upozorenje.

---

## Kontrola Toka

```zymbol
x = 7

// Jednostavno ako
? x > 0 { >> "pozitivno" ¶ }

// ako / inače-ako / inače
? x > 100 {
    >> "veliko" ¶
} _? x > 0 {
    >> "pozitivno" ¶
} _? x == 0 {
    >> "nula" ¶
} _ {
    >> "negativno" ¶
}
```

Blokovi `{ }` su **obavezni** čak i za jedan redak.

---

## Podudaranje

```zymbol
// Podudaranje s rasponima
bodovi = 85
ocjena = ?? bodovi {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocjena ¶    // → B

// Podudaranje s uvjetima (proizvoljni uvjeti)
temperatura = -5
stanje = ?? temperatura {
    _? temperatura < 0  : "led"
    _? temperatura < 20 : "hladno"
    _? temperatura < 35 : "toplo"
    _                   : "vruće"
}
>> stanje ¶    // → led

// Podudaranje s nizovima
boja = "crvena"
kod = ?? boja {
    "crvena" : "#FF0000"
    "zelena" : "#00FF00"
    _        : "#000000"
}
>> kod ¶
```

---

## Petlje

```zymbol
// Uključivi raspon: 0..4 iterira 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Raspon s korakom
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Obrnuti raspon
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Petlja while
broj = 1
@ broj <= 64 { broj *= 2 }
>> broj ¶    // → 128

// For-each po polju
voće = ["jabuka", "kruška", "grožđe"]
@ f:voće { >> f ¶ }

// Po znakovima niza
@ c:"zdravo" { >> c "-" }
>> ¶    // → z-d-r-a-v-o-

// Prekid i nastavak
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> nastavak
    ? i > 7 { @! }          // @! prekid
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcije

```zymbol
// Deklaracija i poziv
dodati(a, b) { <~ a + b }
>> dodati(3, 4) ¶    // → 7

// Rekurzija
faktor(broj) {
    ? broj <= 1 { <~ 1 }
    <~ broj * faktor(broj - 1)
}
>> faktor(5) ¶    // → 120

// Funkcije imaju izolirani opseg — bez pristupa vanjskim varijablama
_globalan = 100
testirati() {
    x = 42    // samo lokalno
    <~ x
}
>> testirati() ¶    // → 42
```

> **Važno**: Imenovane funkcije `ime(parametri){ }` nisu vrijednosti prve klase.
> Za prosljeđivanje kao argument, omotajte: `x -> funkcija(x)`.

---

## Lambde i Zatvorenja

```zymbol
// Jednostavna lambda (implicitni povrat)
udvostručen = x -> x * 2
zbroj = (a, b) -> a + b
>> udvostručen(5) ¶    // → 10
>> zbroj(3, 7) ¶       // → 10

// Blok lambda (eksplicitni povrat)
klasificiraj = x -> {
    ? x > 0 { <~ "pozitivno" }
    _? x < 0 { <~ "negativno" }
    <~ "nula"
}
>> klasificiraj(5) ¶     // → pozitivno
>> klasificiraj(0) ¶     // → nula
>> klasificiraj(-5) ¶    // → negativno

// Zatvorenja — lambde hvataju varijable iz vanjskog opsega
faktor = 3
utrostručen = x -> x * faktor    // hvata 'faktor'
>> utrostručen(7) ¶    // → 21

// Tvornica funkcija
napravi_dodavač(n) { <~ x -> x + n }
dodaj10 = napravi_dodavač(10)
>> dodaj10(5) ¶    // → 15

// Lambde kao vrijednosti: pohranjene u poljima
operacije = [x -> x+1, x -> x*2, x -> x*x]
>> operacije[0](5) ¶    // → 6
>> operacije[2](5) ¶    // → 25
```

---

## Polja

```zymbol
arr = [10, 20, 30, 40, 50]

// Pristup (indeks od 0)
>> arr[0] ¶    // → 10

// Duljina (zahtijeva zagrade u >>)
broj = arr$#
>> (arr$#) ¶    // → 5

// Dodavanje, uklanjanje, sadrži, isječak
arr = arr$+ 60               // dodavanje
arr = arr$- 0                // ukloni indeks 0
ima = arr$? 30               // → #1
isječak = arr$[0..2]         // [20, 30]

// Ažuriranje elementa
arr[1] = 99

// For-each
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` vraćaju **novo polje** — dodjeli natrag: `arr = arr$+ 4`.
> Bez ulančavanja: koristite dvije odvojene dodjele.

---

## Tuple-i

```zymbol
// Imenovani tuple
osoba = (ime: "Alice", dob: 25)
>> osoba.ime ¶    // → Alice
>> osoba.dob ¶    // → 25
>> osoba[0] ¶     // → Alice (indeks također radi)
```

---

## Funkcije Višeg Reda

HOF operatori zahtijevaju **inline lambdu** — ne izravnu varijablu lambda.

```zymbol
brojevi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Mapiranje ($>)
udvostručeni = brojevi$> (x -> x * 2)
>> udvostručeni ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtriranje ($|)
parni = brojevi$| (x -> x % 2 == 0)
>> parni ¶    // → [2, 4, 6, 8, 10]

// Redukcija ($<) — (početna vrijednost, (acc, elem) -> izraz)
ukupno = brojevi$< (0, (acc, x) -> acc + x)
>> ukupno ¶    // → 55
```

---

## Rukovanje Pogreškama

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dijeljenje s nulom" ¶
} :! ##IO {
    >> "IO pogreška" ¶
} :! {
    >> "druga pogreška: " _err ¶
} :> {
    >> "uvijek se izvodi" ¶
}
```

| Vrsta       | Kada se pojavljuje        |
|-------------|---------------------------|
| `##Div`     | Dijeljenje s nulom         |
| `##IO`      | Datoteka / sustav          |
| `##Index`   | Indeks izvan granica       |
| `##Type`    | Pogreška tipa              |
| `##Parse`   | Parsiranje podataka        |
| `##Network` | Mrežne pogreške            |
| `##_`       | Bilo koja pogreška (catch-all)|

---

## Moduli

```zymbol
// Datoteka: lib/izracun.zy
# izracun

#> { dodati, get_PI }    // izvozi PRIJE definicija

_PI := 3.14159
dodati(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Datoteka: main.zy
<# ./lib/izracun <= iz    // alias obavezan

>> iz::dodati(5, 3) ¶    // → 8
pi = iz::get_PI()
>> pi ¶                   // → 3.14159
```

---

## Potpuni Primjer: FizzBuzz

```zymbol
klasificiraj(broj) {
    ? broj % 15 == 0 { <~ "ŠišZuj" }
    _? broj % 3  == 0 { <~ "Šiš" }
    _? broj % 5  == 0 { <~ "Zuj" }
    _ { <~ broj }
}

@ i:1..20 { >> klasificiraj(i) ¶ }
```

---

## Referenca Simbola

| Simbol      | Operacija            | Simbol      | Operacija               |
|-------------|----------------------|-------------|-------------------------|
| `=`         | varijabla            | `$#`        | duljina                 |
| `:=`        | konstanta            | `$+`        | dodavanje               |
| `>>`        | izlaz                | `$-`        | uklanjanje (po indeksu) |
| `<<`        | ulaz                 | `$?`        | sadrži                  |
| `¶`/`\`     | novi red             | `$[s..e]`   | isječak                 |
| `?`         | ako                  | `$>`        | mapiranje               |
| `_?`        | inače-ako            | `$\|`       | filtriranje             |
| `_`         | inače / zamjenski    | `$<`        | redukcija               |
| `??`        | podudaranje          | `!?`        | pokušaj                 |
| `@`         | petlja               | `:!`        | hvatanje                |
| `@!`        | prekid               | `:>`        | na kraju                |
| `@>`        | nastavak             | `$!`        | je li pogreška          |
| `->`        | lambda               | `$!!`       | širenje pogreške        |
| `<~`        | povrat               | `#`         | deklaracija modula      |
| `\|>`       | cijev                | `#>`        | izvoz                   |
| `#1`        | istina               | `<#`        | uvoz                    |
| `#0`        | laž                  | `::`        | poziv modula            |

---

*Zymbol-Lang — Simboličan. Univerzalan. Nepromjenjiv.*

---

> **Napomena:** Ova dokumentacija je stvorena i prevedena umjetnom inteligencijom (UI). Uloženi su svi napori kako bi se osigurala točnost, ali neki prijevodi ili primjeri mogu sadržavati pogreške. Autoritativna referenca je [specifikacija Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
