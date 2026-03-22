# Dokumentacija | Kompakten priročnik za Zymbol-Lang

**Zymbol-Lang** je simboličen programski jezik. Ne uporablja ključnih besed — vse je simbol. Deluje enako v kateremkoli človekovem jeziku.

---

## Filozofija

- Brez ključnih besed (`če`, `zanka`, `vrni` ne obstajajo — samo simboli `?`, `@`, `<~`)
- Popolna podpora Unicode — identifikatorji v kateremkoli jeziku ali emoji 👋
- Neodvisno od človekovega jezika — koda je enaka v vsakem jeziku

---

## Spremenljivke in Konstante

```zymbol
x = 10           // spremenljivka (spremenljiva)
PI := 3.14159    // konstanta (nespremenljiva — napaka pri ponovnem dodeljevanju)
ime = "Ana"
aktiven = #1     // logična vrednost true
👋 := "Pozdravljeni"
```

### Sestavljena Dodelitev

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

## Podatkovni Tipi

| Tip            | Primer              | `#?` Simbol | Opombe                              |
|----------------|---------------------|-------------|-------------------------------------|
| Celo število   | `42`, `-7`          | `###`       | 64-bitno s predznakom               |
| Plavajoča pika | `3.14`, `1.5e10`    | `##.`       | Znanstveni zapis je podprt          |
| Niz            | `"pozdravljeni"`    | `##"`       | Interpolacija: `"Pozdravljeni {ime}"` |
| Znak           | `'A'`               | `##'`       | En Unicode znak                     |
| Logična        | `#1`, `#0`          | `##?`       | NI številska 1 in 0                 |
| Polje          | `[1, 2, 3]`         | `##]`       | Vsi elementi morajo biti istega tipa |
| Tuple          | `(a, b)`            | `##)`       | Pozicijski                          |
| Poimenovan Tuple | `(x: 1, y: 2)`    | `##)`       | Dostop po imenu ali indeksu         |

---

## Izhod in Vhod

```zymbol
// Izhod — NE doda samodejno nove vrstice
>> "Pozdravljeni, Svet!" ¶          // ¶ ali \\ doda izrecno novo vrstico
>> "a=" a " b=" b ¶                 // več vrednosti z juxtapozicijo
>> "vsota=" razvrsti(2, 3) ¶        // klici funkcij na kateremkoli mestu
>> (sadje$#) ¶                      // postfiksni operatorji zahtevajo oklepaje

// Vhod
<< ime                              // brez poziva — bere v spremenljivko
<< "Vaše ime? " ime                 // z pozivom
```

> `¶` ali `\\` sta enakovredna kot nova vrstica.

---

## Združevanje Nizov

Tri veljavne oblike — vsaka za svoj kontekst:

```zymbol
ime = "Ana"
število = 25

// 1. Vejica — v dodelitvah z = ali :=
msg = "Pozdravljeni ", ime, "!"            // → Pozdravljeni Ana!
NASLOV := "Uporabnik: ", ime

// 2. Juxtapozicija — v >> izhodu
>> "Pozdravljeni " ime " imaš " število ¶ // → Pozdravljeni Ana imaš 25

// 3. Interpolacija — v kateremkoli kontekstu
opis = "Pozdravljeni {ime}, imaš {število}" // → Pozdravljeni Ana, imaš 25
```

> **Opomba**: `+` je samo za številke. Uporaba z nizi generira opozorilo.

---

## Nadzor Toka

```zymbol
x = 7

// Enostavno če
? x > 0 { >> "pozitivno" ¶ }

// če / sicer-če / sicer
? x > 100 {
    >> "veliko" ¶
} _? x > 0 {
    >> "pozitivno" ¶
} _? x == 0 {
    >> "nič" ¶
} _ {
    >> "negativno" ¶
}
```

Bloki `{ }` so **obvezni** tudi za eno vrstico.

---

## Ujemanje

```zymbol
// Ujemanje z obsegi
točke = 85
ocena = ?? točke {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocena ¶    // → B

// Ujemanje s pogoji (poljubni pogoji)
temperatura = -5
stanje = ?? temperatura {
    _? temperatura < 0  : "led"
    _? temperatura < 20 : "hladno"
    _? temperatura < 35 : "toplo"
    _                   : "vroče"
}
>> stanje ¶    // → led

// Ujemanje z nizi
barva = "rdeča"
koda = ?? barva {
    "rdeča"  : "#FF0000"
    "zelena" : "#00FF00"
    _        : "#000000"
}
>> koda ¶
```

---

## Zanke

```zymbol
// Vključujoč obseg: 0..4 iterira 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Obseg s korakom
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Obratni obseg
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Medtem ko
število = 1
@ število <= 64 { število *= 2 }
>> število ¶    // → 128

// Za vsak element polja
sadje = ["jabolko", "hruška", "grozdje"]
@ f:sadje { >> f ¶ }

// Po znakih niza
@ c:"pozdravljeni" { >> c "-" }
>> ¶    // → p-o-z-d-r-a-v-l-j-e-n-i-

// Prekinitev in Nadaljevanje
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> nadaljevanje
    ? i > 7 { @! }          // @! prekinitev
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcije

```zymbol
// Deklaracija in klic
seštej(a, b) { <~ a + b }
>> seštej(3, 4) ¶    // → 7

// Rekurzija
faktorijel(število) {
    ? število <= 1 { <~ 1 }
    <~ število * faktorijel(število - 1)
}
>> faktorijel(5) ¶    // → 120

// Funkcije imajo izolirano področje — brez dostopa do zunanjih spremenljivk
globalen = 100
testirati() {
    x = 42    // samo lokalno
    <~ x
}
>> testirati() ¶    // → 42
```

> **Pomembno**: Poimenovane funkcije `ime(params){ }` niso vrednosti prve stopnje.
> Za posredovanje kot argument, zavijte: `x -> ime(x)`.

---

## Lambde in Zaprtja

```zymbol
// Enostavna lambda (implicitni vrni)
podvojen = x -> x * 2
vsota = (a, b) -> a + b
>> podvojen(5) ¶    // → 10
>> vsota(3, 7) ¶    // → 10

// Lambda z blokom (eksplicitni vrni)
razvrsti = x -> {
    ? x > 0 { <~ "pozitivno" }
    _? x < 0 { <~ "negativno" }
    <~ "nič"
}
>> razvrsti(5) ¶     // → pozitivno
>> razvrsti(0) ¶     // → nič
>> razvrsti(-5) ¶    // → negativno

// Zaprtja — lambde zajamejo spremenljivke zunanjega področja
faktor = 3
potrojen = x -> x * faktor    // zajame 'faktor'
>> potrojen(7) ¶    // → 21

// Tovarna funkcij
naredi_seštevač(n) { <~ x -> x + n }
dodaj10 = naredi_seštevač(10)
>> dodaj10(5) ¶    // → 15

// Lambde kot vrednosti: shranjene v poljih
operacije = [x -> x+1, x -> x*2, x -> x*x]
>> operacije[0](5) ¶    // → 6
>> operacije[2](5) ¶    // → 25
```

---

## Polja

```zymbol
arr = [10, 20, 30, 40, 50]

// Dostop (indeks od 0)
>> arr[0] ¶    // → 10

// Dolžina (zahteva oklepaje v >>)
število = arr$#
>> (arr$#) ¶    // → 5

// Dodajanje, odstranjevanje, vsebuje, rezina
arr = arr$+ 60               // dodajanje
arr = arr$- 0                // odstranitev indeksa 0
vsebuje = arr$? 30           // → #1
rezina = arr$[0..2]          // [20, 30]

// Posodobitev elementa
arr[1] = 99

// Za vsak element
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` vrnejo **novo polje** — dodelite nazaj: `arr = arr$+ 4`.
> Brez veriženja: uporabite dve ločeni dodelitvi.

---

## Tuple-i

```zymbol
// Poimenovan tuple
oseba = (ime: "Maja", starost: 25)
>> oseba.ime ¶      // → Maja
>> oseba.starost ¶  // → 25
>> oseba[0] ¶       // → Maja (indeks deluje tudi)
```

---

## Funkcije Višjega Reda

Operatorji HOF zahtevajo **vgrajeno lambda** — ne neposredne spremenljivke lambda.

```zymbol
številke = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Preslika ($>)
podvojena = številke$> (x -> x * 2)
>> podvojena ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtriraj ($|)
soda = številke$| (x -> x % 2 == 0)
>> soda ¶    // → [2, 4, 6, 8, 10]

// Zmanjšaj ($<) — (začetna, (acc, elem) -> izraz)
skupaj = številke$< (0, (acc, x) -> acc + x)
>> skupaj ¶    // → 55
```

---

## Upravljanje Napak

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deljenje z nič" ¶
} :! ##IO {
    >> "napaka V/I" ¶
} :! {
    >> "druga napaka: " _err ¶
} :> {
    >> "vedno se izvede" ¶
}
```

| Tip         | Ko se pojavi              |
|-------------|---------------------------|
| `##Div`     | Deljenje z nič            |
| `##IO`      | Datoteka / sistem         |
| `##Index`   | Indeks izven meja         |
| `##Type`    | Napaka tipa               |
| `##Parse`   | Razčlenjevanje podatkov   |
| `##Network` | Omrežne napake            |
| `##_`       | Kakršnakoli napaka        |

---

## Moduli

```zymbol
// Datoteka: lib/calc.zy
# calc

#> { seštej, get_PI }    // izvozi PRED definicijami

_PI := 3.14159
seštej(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Datoteka: main.zy
<# ./lib/calc <= c    // vzdevek je obvezen

>> c::seštej(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Popoln Primer: FizzBuzz

```zymbol
razvrsti(število) {
    ? število % 15 == 0 { <~ "MehurčekBrnenje" }
    _? število % 3  == 0 { <~ "Mehurček" }
    _? število % 5  == 0 { <~ "Brnenje" }
    _ { <~ število }
}

@ i:1..20 { >> razvrsti(i) ¶ }
```

---

## Referenca Simbolov

| Simbol   | Operacija           | Simbol     | Operacija            |
|----------|---------------------|------------|----------------------|
| `=`      | spremenljivka       | `$#`       | dolžina              |
| `:=`     | konstanta           | `$+`       | dodajanje            |
| `>>`     | izhod               | `$-`       | odstranitev (po ind.)|
| `<<`     | vhod                | `$?`       | vsebuje              |
| `¶`/`\`  | nova vrstica        | `$[s..e]`  | rezina               |
| `?`      | če                  | `$>`       | preslika             |
| `_?`     | sicer-če            | `$\|`      | filtriraj            |
| `_`      | sicer / poljubno    | `$<`       | zmanjšaj             |
| `??`     | ujemanje            | `!?`       | poskusi              |
| `@`      | zanka               | `:!`       | ujemi napako         |
| `@!`     | prekinitev          | `:>`       | končno               |
| `@>`     | nadaljevanje        | `$!`       | je napaka            |
| `->`     | lambda              | `$!!`      | razširi napako       |
| `<~`     | vrni                | `#`        | deklariraj modul     |
| `\|>`    | cev                 | `#>`       | izvozi               |
| `#1`     | res                 | `<#`       | uvozi                |
| `#0`     | lažno               | `::`       | klic modula          |

---

*Zymbol-Lang — Simboličen. Univerzalen. Nespremenljiv.*

---

**Opomba:** Ta dokumentacija je bila ustvarjena in prevedena z umetno inteligenco (UI). Vsa prizadevanja so bila usmerjena v zagotavljanje točnosti, vendar nekateri prevodi ali primeri lahko vsebujejo napake. Avtoritativna referenca je [specifikacija Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
