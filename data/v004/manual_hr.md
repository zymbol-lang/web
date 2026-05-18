> **Napomena:** Ova dokumentacija je kreirana uz pomoć umjetne inteligencije (UI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanonska referenca je **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** u repozitoriju interpretera.

---

# Priručnik Zymbol-Lang

**Zymbol-Lang** je simbolički programski jezik. Nema ključnih riječi — sve je simbol. Funkcionira jednako u svakom ljudskom jeziku.

- Nema `if`, `while`, `return` — samo `?`, `@`, `<~`
- Puna podrška za Unicode — identifikatori u bilo kojem jeziku ili emoji
- Neovisno o ljudskom jeziku — kod je identičan u svim jezicima

**Verzija interpretera**: v0.0.4 | **Pokrivenost testovima**: 393/393 (TW ↔ VM paritet)

---

## Varijable i Konstante

```zymbol
x = 10              // promjenjiva varijabla
PI := 3.14159       // konstanta — greška pri ponovnoj dodjeli
ime = "Alice"
aktivan = #1        // logička istina
👋 := "Zdravo"
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
| Funkcija | ref na imenovanu funkciju | `##()` | Prva klasa; prikaz `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prva klasa; prikaz `<lambd/N>` |

```zymbol
// Introspekicija tipa — vraća (tip, znamenke, vrijednost)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
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
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (cjelobrojno dijeljenje)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (potenciranje)

// Usporedba
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

## Nizovi

```zymbol
// Dva oblika spajanja
ime = "Alice"
n = 42

>> "Zdravo " ime " imaš " n ¶    // juxtapozicija — u >>
opis = "Zdravo {ime}, imaš {n}"  // interpolacija — svugdje
```

```zymbol
s = "Zdravo Svijete"
len = s$#                  // 14
sub = s$[1..6]             // "Zdravo"  (od 1, kraj uključiv)
has = s$? "Svijete"        // #1
dijelovi = "a,b,c,d"$/ ',' // [a, b, c, d]  (dijeljenje po odjelnici)
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

// Uzorci usporedbe
temp = -5
stanje = ?? temp {
    < 0  : "led"
    < 20 : "hladno"
    < 35 : "toplo"
    _    : "vruće"
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
@:vanjska {
    count++
    ? count >= 3 { @:vanjska! }
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

> Imenovane funkcije su **vrijednosti prve klase** — prosljeđuje se izravno: `nums$> udvostruči`. Za omotavanje: `x -> fn(x)` je također valjano.

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
>> ops[3](5) ¶    // → 25
```

---

## Polja

Polja su **promjenjiva** i sadrže elemente **istog tipa**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — pristup (indeksiranje od 1: prvi element)
arr[-1]         // 5 — negativni indeks (zadnji element)
arr$#           // 5 — duljina (koristite (arr$#) u >>)

arr = arr$+ 6            // dodaj → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // umetni na poziciju 2 (od 1)
arr3 = arr$- 3           // ukloni prvo pojavljivanje vrijednosti
arr4 = arr$-- 3          // ukloni sva pojavljivanja
arr5 = arr$-[1]          // ukloni na indeksu 1 (prvi element)
arr6 = arr$-[2..3]       // ukloni raspon (od 1, kraj uključiv)

has = arr$? 3            // #1 — sadrži
pos = arr$?? 3           // [3] — svi indeksi vrijednosti (od 1)
sl = arr$[1..3]          // [1,2,3] — isječak (od 1, kraj uključiv)
sl2 = arr$[1:3]          // [1,2,3] — isto, sintaksa brojanja

asc = arr$^+             // sortirano uzlazno  (samo primitivi)
desc = arr$^-            // sortirano silazno  (samo primitivi)

// Tuple polja — koristite $^ s usporednom lambdom
db = [(ime: "Carla", dob: 28), (ime: "Ana", dob: 25), (ime: "Bob", dob: 30)]
po_dobi  = db$^ (a, b -> a.dob < b.dob)    // uzlazno po dobi (<)
po_imenu = db$^ (a, b -> a.ime > b.ime)    // silazno po imenu (>)
>> po_dobi[1].ime ¶     // → Ana
>> po_imenu[1].ime ¶    // → Carla

// Izravno ažuriranje elementa (samo polja)
arr[1] = 99              // dodijeli
arr[2] += 5              // složeno: +=  -=  *=  /=  %=  ^=

// Funkcionalno ažuriranje — vraća novo polje; original nepromijenjen
arr2 = arr[2]$~ 99
```

> Svi operatori kolekcija vraćaju **novo polje**. Dodjeli natrag: `arr = arr$+ 4`.
> `$+` se može ulančati: `arr = arr$+ 5$+ 6$+ 7`. Ostali operatori koriste međunje dodjele.
> **Indeksiranje je od 1**: `arr[1]` je prvi element; `arr[0]` je greška izvođenja.
> `$^+` / `$^-` sortiraju **primitivna polja** (brojevi, nizovi). Za tuple polja koristite `$^` s usporednom lambdom — smjer je kodiran u lambdi (`<` = uzlazno, `>` = silazno).

**Vrijednosna semantika** — dodjeljivanje polja drugoj varijabli stvara neovisnu kopiju:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nije pogođeno
```

```zymbol
// Ugniježđena polja (indeksiranje od 1)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (red 2, stupac 3)
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

Tupleovi su **nepromjenjivi** uređeni kontejneri koji mogu sadržavati vrijednosti **različitih tipova**.
Za razliku od polja, elementi se ne mogu mijenjati nakon stvaranja.

```zymbol
// Pozicijsko — miješani tipovi su dozvoljeni
točka = (10, 20)
>> točka[1] ¶    // → 10

podatak = (42, "hello", #1, 3.14)
>> podatak[3] ¶     // → #1

// Imenovano
osoba = (ime: "Alice", dob: 25)
>> osoba.ime ¶    // → Alice
>> osoba[1] ¶     // → Alice  (indeks također radi, od 1)

// Ugniježđeno
pos = (x: 10, y: 20)
p = (pos: pos, oznaka: "ishodište")
>> p.pos.x ¶        // → 10
```

**Nepromjenjivost** — svaki pokušaj izmjene elementa tuplea je greška pri izvođenju:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ greška izvođenja: tupleovi su nepromjenjivi
// t[1] += 5    // ❌ ista greška
```

Za izvođenje izmijenjene vrijednosti koristite `$~` (funkcionalno ažuriranje) — vraća **novi** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original nepromijenjen
>> t2 ¶    // → (10, 999, 30)

// Imenovani tuple — eksplicitno obnoviti
osoba = (ime: "Alice", dob: 25)
starija = (ime: osoba.ime, dob: 26)
>> osoba.dob ¶    // → 25
>> starija.dob ¶  // → 26
```

---

## Funkcije Višeg Reda

```zymbol
brojevi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

udvostručeni = brojevi$> (x -> x * 2)                // map  → [2,4,6…20]
parni        = brojevi$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ukupno       = brojevi$< (0, (acc, x) -> acc + x)     // reduce → 55

// Lanac kroz međunje
korak1 = brojevi$| (x -> x > 3)
korak2 = korak1$> (x -> x * x)
>> korak2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imenovane funkcije se mogu izravno proslijediti HOF-u
udvostruči(x) { <~ x * 2 }
je_velik(x) { <~ x > 5 }
r = brojevi$> udvostruči       // ✅ izravna referenca
r = brojevi$| je_velik         // ✅ izravna referenca
```

---

## Operator Cjevovoda

Desna strana uvijek zahtijeva `_` kao zamjensko mjesto za proslijeđenu vrijednost:

```zymbol
dvostruki = x -> x * 2
zbroji = (a, b) -> a + b
inc = x -> x + 1

5 |> dvostruki(_)     // → 10
10 |> zbroji(_, 5)    // → 15
5 |> zbroji(2, _)     // → 7

// Lanac
r = 5 |> dvostruki(_) |> inc(_) |> dvostruki(_)
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
// lib/izracun.zy — tijelo modula je omeđeno vitičastim zagradama
# izracun {
    #> { zbrojiti, get_PI }

    _PI := 3.14159
    zbrojiti(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
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
# mojalib {
    #> { _interni_zbrojiti <= zbroj }

    _interni_zbrojiti(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib <= m

>> m::zbroj(3, 4) ¶    // → 7  (interni naziv _interni_zbrojiti je skriven)
```

> **Pravila modula**: unutar `# naziv { }` su dozvoljeni samo `#>`, definicije funkcija i inicijalizatori varijabli/konstanti. Izvršne naredbe (`>>`, `<<`, petlje, itd.) podižu grešku E013.

---

## Numerički Načini

Zymbol može prikazivati brojeve u **69 Unicode pisama s znamenkama** — Devanagari, Arapsko-indijsko, Tajlandsko, Klingon pIqaD, Matematički podebljano, LCD segmenti i više. Aktivni način utječe samo na `>>`-izlaz; interna aritmetika uvijek je binarna.

### Aktiviranje pisma

Zapišite znamenku `0` i `9` ciljnog pisma unutar `#…#`:

```zymbol
#०९#    // Devanagari      (U+0966–U+096F)
#٠٩#    // Arapsko-ind.    (U+0660–U+0669)
#๐๙#    // Tajlandsko      (U+0E50–U+0E59)
#09#    // resetirati na ASCII
```

### Izlaz i booleani

```zymbol
x = 42
>> x ¶          // → 42   (ASCII zadano)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimalna točka uvijek ASCII)
>> 1 + 2 ¶      // → ३

// Booleani: prefiks # uvijek ASCII, znamenka se prilagođava
>> #1 ¶         // → #१   (istina u Devanagari)
>> #0 ¶         // → #०   (neistina — različito od ०  cijeli broj nula)

x = 28 > 4
>> x ¶          // → #१   (rezultat usporedbe prati aktivni način)
```

### Nativni literali znamenki u izvornom kodu

Znamenke bilo kojeg podržanog pisma su valjani literali — u rasponima, modulo, usporedbama:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolovske literale u bilo kojem pismu

`#` + znamenka `0` ili `1` iz bilo kojeg bloka je valjani boolov literal:

```zymbol
#٠٩#
نشط = #١        // isto kao #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` je **uvijek ASCII**. `#0` (neistina) uvijek je vizualno različit od `0` (cijeli broj nula) u svakom pismu.

---

## Operatori Podataka

```zymbol
// Konverzija tipova
##.42         // → 42.0  (u Float)
###3.7        // → 4     (u Int, zaokruži)
##!3.7        // → 3     (u Int, skrati)

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
fmt = #,|1234567|  // → 1,234,567  (odvojeno zarezima)
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
| `:=` | konstanta | `$+` | dodavanje (lančano) |
| `>>` | izlaz | `$+[i]` | umetanje na indeks (od 1) |
| `<<` | ulaz | `$-` | ukloni prvo pojavl. |
| `¶` / `\\` | novi red | `$--` | ukloni sva pojavl. |
| `?` | ako | `$-[i]` | ukloni na indeksu (od 1) |
| `_?` | inače-ako | `$-[i..j]` | ukloni raspon (od 1) |
| `_` | inače / zamjenski | `$?` | sadrži |
| `??` | podudaranje | `$??` | pronađi sve indekse (od 1) |
| `@` | petlja | `$[s..e]` | isječak (od 1) |
| `@ N { }` | petlja N puta (N iteracija) | `$>` | mapiranje |
| `@!` | prekid | `$\|` | filtriranje |
| `@>` | nastavak | `$<` | redukcija |
| `@:naziv { }` | označena petlja | `$/ delim` | dijeljenje niza |
| `@:naziv!` | prekid oznake | `$++ a b c` | izgradnja spajanjem |
| `@:naziv>` | nastavak oznake | `arr[i>j>k]` | navigacijski indeks |
| `->` | lambda | `arr[i] = val` | ažuriranje elementa (samo polja) |
| `arr[i] += val` | složeno ažuriranje | `arr[i]$~` | funkcionalno ažuriranje (nova kopija) |
| `$^+` | sortiraj uzlazno (primitivi) | `$^-` | sortiraj silazno (primitivi) |
| `$^` | sortiraj s usporedbom (tuple) | `<~` | povratak |
| `\|>` | cjevovod | `!?` | pokušaj |
| `:!` | uhvati | `:>` | na kraju |
| `#1` | istina | `#0` | laž |
| `$!` | je greška | `$!!` | propagiraj grešku |
| `<#` | uvoz | `#>` | izvozi |
| `#` | deklariraj modul | `::` | poziv modula |
| `.` | pristup polju | `#?` | metapodaci tipa |
| `#\|..\|` | parsiraj broj | `##.` | pretvori u Float |
| `###` | pretvori u Int (zaokruži) | `##!` | pretvori u Int (skrati) |
| `#.N\|..\|` | zaokruži | `#!N\|..\|` | skrati |
| `#,\|..\|` | format s odjelnicom | `#^\|..\|` | znanstveni |
| `#d0d9#` | prekidač numeričkog načina | `#09#` | resetirati na ASCII |
| `<\ ..\>` | izvršiti ljusku | `>\<` | argumenti CLI |
| `\ var` | eksplicitno uništi varijablu | | |

---

## Povijest Verzija

### v0.0.4 — Indeksiranje od 1, Funkcije Prve Klase i Blokovi Modula _(Travanj 2026)_

- **Promjena** Svo indeksiranje prebačeno na **od 1** — `arr[1]` je prvi element; `arr[0]` je greška izvođenja
- **Dodano** Imenovane funkcije su **vrijednosti prve klase** — prosljeđuju se izravno HOF-u: `nums$> udvostruči`
- **Dodano** Sintaksa **bloka modula** obavezna: `# naziv { ... }` — ravna sintaksa uklonjena
- **Dodano** Višedimenzionalno indeksiranje: `arr[i>j>k]` (navigacija), `arr[p ; q]` (ravno izlučivanje)
- **Dodano** Konverzija tipova: `##.izraz` (Float), `###izraz` (Int zaokruži), `##!izraz` (Int skrati)
- **Dodano** Dijeljenje niza: `niz$/ delim` — vraća `Array(String)`
- **Dodano** Izgradnja spajanjem: `baza$++ a b c` — dodaje više stavki
- **Dodano** Petlja N puta: `@ N { }` — ponavlja točno N puta
- **Dodano** Sintaksa označene petlje: `@:naziv { }`, `@:naziv!`, `@:naziv>` — zamjenjuje `@ @naziv` / `@! naziv`
- **Dodano** Pravila opsega varijabli: varijable `_naziv` imaju točan opseg bloka; `\ var` uništava rano
- **Dodano** Uzorci usporedbe za podudaranje: `< 0 :`, `> 5 :`, `== 42 :` itd.
- **Dodano** Greška E013 modula: izvršne naredbe u tijelu modula su zabranjene
- **Ispravljeno** `take_variable` više ne kvari konstante modula pri pisanju natrag
- **Ispravljeno** `alias.CONST` se sada ispravno razrješava; `#>` može biti iza definicija funkcija
- **VM** Puni paritet: 393/393 testova prolaze

### v0.0.3 — Unicode Brojevni Sustavi & Poboljšanja LSP _(Travanj 2026)_

- **Dodano** 69 Unicode blokova znamenki s token za prekidanje načina `#d0d9#`
- **Dodano** Boolovske literale u bilo kojem pismu — `#१` / `#०`, `#١` / `#٠`, itd.
- **Dodano** Klingon pIqaD znamenke (CSUR PUA U+F8F0–U+F8F9)
- **Dodano** VM opkod `SetNumeralMode` — potpuni paritet s tree-walkerom
- **Dodano** REPL poštuje aktivni numerički način u echu i prikazu varijabli
- **Promijenjeno** `>>`-izlaz booleana sada uključuje prefiks `#` (`#0` / `#1`) u svim načinima

### v0.0.2_01 — Preimenovanje Operatora _(30 Mar 2026)_

- **Promijenjeno** `c|..|` → `#,|..|` i `e|..|` → `#^|..|` — dosljedno obitelji prefiksa `#`
- **Dodano** Alias izvoza: ponovni izvoz članova modula pod drugim imenom

### v0.0.2 — Redizajn API Kolekcija & Instalatori _(24 Mar 2026)_

- **Dodano** Ujedinjena obitelj operatora `$` za polja i nizove (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Dodano** Destrukturiranje za polja, tuple i imenovane tuple
- **Dodano** Negativni indeksi (`arr[-1]` = zadnji element)
- **Dodano** Nativni instalatori — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Dodano** Složena dodjela `^=`
- **Ispravljeno** Rubni slučajevi aritmetičkog parsera; ispravci dokumentacije

### v0.0.1 — Prvo Javno Izdanje _(22 Mar 2026)_

- Tree-walker interpreter + registarski VM (`--vm`, ~4× brži, ~95% paritet)
- Svi osnovni konstrukti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Puni Unicode identifikatori, modularni sustav, lambde, zatvorenja, rukovanje greškama
- REPL, LSP, VS Code proširenje, formater (`zymbol fmt`)

---

*Zymbol-Lang — Simbolički. Univerzalan. Nepromjenjiv.*
