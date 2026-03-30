# Priručnik Zymbol-Lang

**Zymbol-Lang** je simbolički programski jezik. Nema ključnih riječi — sve je simbol. Funkcionira jednako u svakom ljudskom jeziku.

- Nema `if`, `while`, `return` — samo `?`, `@`, `<~`
- Puna podrška za Unicode — identifikatori u bilo kojem jeziku ili emoji
- Neovisno o ljudskom jeziku — kod je identičan u svim jezicima

---

## Varijable i Konstante

```zymbol
x = 10              // varijabla — promjenjiva
PI := 3.14159       // konstanta — greška pri ponovnom dodjeli
ime = "Alice"
aktivan = #1        // logička istina
👋 := "Zdravo"
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

## Tipovi Podataka

| Tip | Literal | Tag `#?` | Napomena |
|-----|---------|----------|----------|
| Int | `42`, `-7` | `###` | 64-bitni s predznakom |
| Float | `3.14`, `1.5e10` | `##.` | Znanstvena notacija OK |
| String | `"tekst"` | `##"` | Interpolacija: `"Zdravo {ime}"` |
| Char | `'A'` | `##'` | Jedan Unicode znak |
| Bool | `#1`, `#0` | `##?` | NIJE numeričko — `#1 ≠ 1` |
| Polje | `[1, 2, 3]` | `##]` | Homogeni elementi |
| Tuple | `(a, b)` | `##)` | Pozicijsko |
| Imenovani Tuple | `(x: 1, y: 2)` | `##)` | Imenovana polja |

```zymbol
// Introspekicija tipa — vraća (tip, znamenke, vrijednost)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Izlaz i Ulaz

```zymbol
>> "Zdravo" ¶                      // ¶ ili \\ za eksplicitni novi red
>> "a=" a " b=" b ¶                // juxtapozicija — više vrijednosti
>> (arr$#) ¶                       // postfiks operatori zahtijevaju ( )

<< ime                             // čitanje u varijablu (bez upita)
<< "Unesite ime: " ime             // s upitom
```

> `¶` (AltGr+R na španjolskoj tipkovnici) i `\\` su ekvivalentni novi redovi.

---

## Operatori

```zymbol
// Aritmetika — koristite dodjele; neki operatori imaju posebnosti izravno u >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (cjelobrojno dijeljenje)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potenciranje)

// Usporedba
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Nizovi

```zymbol
// Tri oblika spajanja
ime = "Alice"
n = 42

msg = "Zdravo ", ime, "!"            // zarez — u dodjelama
>> "Zdravo " ime " imaš " n ¶        // juxtapozicija — u >>
desc = "Zdravo {ime}, imaš {n}"      // interpolacija — svugdje
```

```zymbol
s = "Zdravo Svijete"
len = s$#                  // 14
sub = s$[0..6]             // "Zdravo"  (kraj ekskluzivan)
has = s$? "Svijete"        // #1
dijelovi = "a,b,c,d" / ',' // [a, b, c, d]
rep = s$~~["a":"A"]        // zamijeni sve
rep1 = s$~~["a":"A":1]     // zamijeni prvih N
```

> `+` je samo za brojeve. Za nizove koristite `,`, juxtapoziciju ili interpolaciju.

---

## Kontrola Toka

```zymbol
x = 7

? x > 0 { >> "pozitivno" ¶ }

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

> Vitičaste zagrade `{ }` su **obavezne** čak i za jednu naredbu.

---

## Podudaranje

```zymbol
// Rasponi
bodovi = 85
ocjena = ?? bodovi {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocjena ¶    // → B

// Nizovi
boja = "crvena"
kod = ?? boja {
    "crvena"  : "#FF0000"
    "zelena"  : "#00FF00"
    _         : "#000000"
}

// Čuvari
temp = -5
stanje = ?? temp {
    _? temp < 0  : "led"
    _? temp < 20 : "hladno"
    _? temp < 35 : "toplo"
    _            : "vruće"
}
>> stanje ¶    // → led

// Izjavni oblik (blok grane)
?? n {
    0       : { >> "nula" ¶ }
    _? n < 0: { >> "negativno" ¶ }
    _       : { >> "pozitivno" ¶ }
}
```

---

## Petlje

```zymbol
@ i:0..4  { >> i " " }        // raspon uključivo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // s korakom:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // unazad:             5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

voće = ["jabuka", "kruška", "grožđe"]
@ f:voće { >> f ¶ }           // for-each polje

@ c:"zdravo" { >> c "-" }
>> ¶                          // → z-d-r-a-v-o-  (for-each niz)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> nastavi
    ? i > 7 { @! }             // @! prekini
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Beskonačna petlja
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Označena petlja (ugniježđeno prekidanje)
count = 0
@ @vanjska {
    count++
    ? count >= 3 { @! vanjska }
}
>> count ¶                    // → 3
```

---

## Funkcije

```zymbol
zbrojiti(a, b) { <~ a + b }
>> zbrojiti(3, 4) ¶    // → 7

faktorijel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorijel(n - 1)
}
>> faktorijel(5) ¶    // → 120
```

Funkcije imaju **izolirani opseg** — ne mogu čitati vanjske varijable. Koristite izlazne parametre `<~` za izmjenu varijabli pozivatelja:

```zymbol
zamijeniti(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
zamijeniti(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Imenovane funkcije nisu vrijednosti prve klase. Za prosljeđivanje kao argument: `x -> fn(x)`.

---

## Lambde i Zatvorenja

```zymbol
dvostruki = x -> x * 2
zbroj = (a, b) -> a + b
>> dvostruki(5) ¶    // → 10
>> zbroj(3, 7) ¶     // → 10

// Blok lambda
klasificirati = x -> {
    ? x > 0 { <~ "pozitivno" }
    _? x < 0 { <~ "negativno" }
    <~ "nula"
}

// Zatvorenje — hvata vanjski opseg
faktor = 3
trostruki = x -> x * faktor
>> trostruki(7) ¶    // → 21

// Tvornica
make_adder(n) { <~ x -> x + n }
dodaj10 = make_adder(10)
>> dodaj10(5) ¶    // → 15

// U poljima
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Polja

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — pristup (indeksiranje od 0)
arr[-1]         // 5 — negativni indeks (zadnji)
arr$#           // 5 — duljina (koristite (arr$#) u >>)

arr = arr$+ 6            // dodaj → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // umetni na indeks 2
arr3 = arr$- 3           // ukloni prvo pojavljivanje vrijednosti
arr4 = arr$-- 3          // ukloni sva pojavljivanja
arr5 = arr$-[0]          // ukloni na indeksu
arr6 = arr$-[1..3]       // ukloni raspon (kraj ekskluzivan)

has = arr$? 3            // #1 — sadrži
pos = arr$?? 3           // [2] — svi indeksi vrijednosti
sl = arr$[0..3]          // [1,2,3] — isječak (kraj ekskluzivan)
sl2 = arr$[0:3]          // [1,2,3] — isto, sintaksa brojanja

asc = arr$^+             // sortirano uzlazno  (samo primitivi)
desc = arr$^-            // sortirano silazno  (samo primitivi)

// Tuple polja — koristite $^ s usporednom lambdom
db = [(ime: "Carla", dob: 28), (ime: "Ana", dob: 25), (ime: "Bob", dob: 30)]
po_dobi  = db$^ (a, b -> a.dob < b.dob)
po_imenu = db$^ (a, b -> a.ime > b.ime)
>> po_dobi[0].ime ¶     // → Ana
>> po_imenu[0].ime ¶    // → Carla

arr[1] = 99              // ažuriraj na mjestu
arr = arr[1]$~ 99        // funkcionalno ažuriranje — vraća novo polje
```

> Svi operatori kolekcija vraćaju **novo polje**. Dodjeli natrag: `arr = arr$+ 4`.
> Operatori se ne mogu ulančati — koristite međunje dodjele.
> `$^+` / `$^-` sortiraju **primitivna polja** (brojevi, nizovi). Za tuple polja koristite `$^` s usporednom lambdom.

```zymbol
// Ugniježđena polja
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[1][2] ¶    // → 6
```

---

## Destrukturiranje

```zymbol
// Polje
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[prvi, *ostatak] = arr       // prvi=10  ostatak=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ odbacuje

// Pozicijsko tuple
točka = (100, 200)
(px, py) = točka             // px=100  py=200

// Imenovano tuple
osoba = (ime: "Ana", dob: 25, grad: "Madrid")
(ime: i, dob: d) = osoba    // i="Ana"  d=25
```

---

## Tuple

```zymbol
// Pozicijsko
točka = (10, 20)
>> točka[0] ¶    // → 10

// Imenovano
osoba = (ime: "Alice", dob: 25)
>> osoba.ime ¶    // → Alice
>> osoba[0] ¶     // → Alice  (indeks također radi)

// Ugniježđeno
pos = (x: 10, y: 20)
p = (pos: pos, oznaka: "ishodište")
>> p.pos.x ¶        // → 10
```

---

## Funkcije Višeg Reda

> Operatori FVR zahtijevaju **inline lambdu** — izravne lambda varijable ne rade.

```zymbol
brojevi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

udvostručeni = brojevi$> (x -> x * 2)                // map  → [2,4,6…20]
parni        = brojevi$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ukupno       = brojevi$< (0, (acc, x) -> acc + x)     // reduce → 55

// Lanac kroz međunje
korak1 = brojevi$| (x -> x > 3)
korak2 = korak1$> (x -> x * x)
>> korak2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imenovane funkcije u FVR — omoti u lambdu
udvostruči(x) { <~ x * 2 }
r = brojevi$> (x -> udvostruči(x))    // ✅
```

---

## Operator Cjevovoda

Desna strana uvijek zahtijeva `_` kao zamjensko mjesto za proslijeđenu vrijednost:

```zymbol
udvostruči = x -> x * 2
zbroji = (a, b) -> a + b
inc = x -> x + 1

5 |> udvostruči(_)     // → 10
10 |> zbroji(_, 5)     // → 15
5 |> zbroji(2, _)      // → 7

// Lanac
r = 5 |> udvostruči(_) |> inc(_) |> udvostruči(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Rukovanje Greškama

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dijeljenje s nulom" ¶
} :! {
    >> "ostalo: " _err ¶    // _err drži poruku greške
} :> {
    >> "uvijek se izvršava" ¶
}
```

| Tip | Kada |
|-----|------|
| `##Div` | Dijeljenje s nulom |
| `##IO` | Datoteka / sustav |
| `##Index` | Indeks izvan raspona |
| `##Type` | Greška tipa |
| `##Parse` | Parsiranje podataka |
| `##Network` | Mrežne greške |
| `##_` | Bilo koja greška (catch-all) |

---

## Moduli

```zymbol
// lib/izracun.zy
# izracun

#> { zbrojiti, get_PI }    // izvozi MORAJU biti prije definicija

_PI := 3.14159
zbrojiti(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — izravni pristup konstanti putem aliasa nije podržan
```

```zymbol
// main.zy
<# ./lib/izracun <= i    // alias obavezan

>> i::zbrojiti(5, 3) ¶   // → 8
pi = i::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Izvoz pod drugim javnim imenom
# mojalib
#> { _interni_zbrojiti <= zbroj }

_interni_zbrojiti(a, b) { <~ a + b }
```

```zymbol
<# ./mojalib <= m

>> m::zbroj(3, 4) ¶    // → 7  (interni naziv _interni_zbrojiti je skriven)
```

---

## Operatori Podataka

```zymbol
// Parsiranje niza u broj
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (sigurni neuspjeh, bez greške)

// Zaokruživanje / skraćivanje
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokruži na 2 decimale)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (skrati)

// Formatiranje brojeva
fmt = #,|1234567|  // → 1.234.567  (odvojeno točkama)
sci = #^|12345.678|    // → 1.2345678e4  (znanstveni zapis)

// Bazni literali
a = 0x41         // → 'A'  (heksadecimalni)
b = 0b01000001   // → 'A'  (binarni)
c = 0o101        // → 'A'  (oktalni)

// Izlaz s konverzijom baze
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracija Ljuske

```zymbol
datum = <\ date +%Y-%m-%d \>     // hvata stdout (uključuje \n)
>> "Danas: " datum

datoteka = "data.txt"
sadrzaj = <\ cat {datoteka} \>   // interpolacija u naredbama

izlaz = </"./podskript.zy"/>     // izvršiti drugi Zymbol skript, uhvatiti izlaz
>> izlaz
```

> `><` hvata argumente CLI kao polje nizova (samo tree-walker).

---

## Potpuni Primjer: FizzBuzz

```zymbol
klasificirati(broj) {
    ? broj % 15 == 0 { <~ "FizzBuzz" }
    _? broj % 3  == 0 { <~ "Fizz" }
    _? broj % 5  == 0 { <~ "Buzz" }
    _ { <~ broj }
}

@ i:1..20 { >> klasificirati(i) ¶ }
```

---

## Referenca Simbola

| Simbol | Operacija | Simbol | Operacija |
|--------|-----------|--------|-----------|
| `=` | varijabla | `$#` | duljina |
| `:=` | konstanta | `$+` | dodavanje |
| `>>` | izlaz | `$+[i]` | umetanje na indeks |
| `<<` | ulaz | `$-` | ukloni prvo pojavl. |
| `¶` / `\\` | novi red | `$--` | ukloni sva pojavl. |
| `?` | ako | `$-[i]` | ukloni na indeksu |
| `_?` | inače-ako | `$-[i..j]` | ukloni raspon |
| `_` | inače / zamjenski | `$?` | sadrži |
| `??` | podudaranje | `$??` | pronađi sve indekse |
| `@` | petlja | `$[s..e]` | isječak |
| `@!` | prekid | `$>` | mapiranje |
| `@>` | nastavak | `$\|` | filtriranje |
| `->` | lambda | `$<` | redukcija |
| `$^+` | sortiraj uzlazno (primitivi) | `$^-` | sortiraj silazno (primitivi) |
| `$^` | sortiraj s usporedbom (tuple) | | |
| `<~` | povratak | `!?` | pokušaj |
| `\|>` | cjevovod | `:!` | uhvati |
| `#1` | istina | `:>` | na kraju |
| `#0` | laž | `$!` | je greška |
| `<#` | uvoz | `$!!` | propagiraj grešku |
| `#` | deklariraj modul | `#>` | izvezi |
| `::` | poziv modula | `.` | pristup polju |
| `#\|..\|` | parsiraj broj | `#?` | metapodaci tipa |
| `#.N\|..\|` | zaokruži | `#!N\|..\|` | skrati |
| `c\|..\|` | format s odjelnicom | `e\|..\|` | znanstveni |
| `<\ ..\>` | izvršiti ljusku | `><` | argumenti CLI |

---

*Zymbol-Lang — Simbolički. Univerzalan. Nepromjenjiv.*

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
