> **Napomena:** Ova dokumentacija je stvorena i prevedena od strane umjetne inteligencije (UI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Priručnik Zymbol-Lang

> **Pregledano za v0.0.5 — 2026-05-12**

**Zymbol-Lang** je simbolički programski jezik. Bez ključnih riječi — sve je simbol. Radi identično na svakom ljudskom jeziku.

- Bez `if`, `while`, `return` — samo `?`, `@`, `<~`
- Puni Unicode — identifikatori na bilo kojem jeziku ili emojiju
- Neovisan o ljudskom jeziku — kod je svuda isti

**Verzija interpretera**: v0.0.5 | **Pokrivenost testovima**: 436/436 (TW ↔ VM paritet)

---

## Varijable i Konstante

```zymbol
x = 10              // promjenjiva varijabla
PI := 3.14159       // konstanta — ponovna dodjela je greška pri izvođenju
ime = "Alice"
aktivno = #1        // logička istina
👋 := "Pozdrav"
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

`°` (znak stupnja, U+00B0) automatski inicijalizira varijablu na njenu neutralnu vrijednost pri prvoj upotrebi:

```zymbol
brojevi = [3, 1, 4, 1, 5]
@ n:brojevi {
    °ukupno += n    // auto-inicijalizacija na 0 iznad petlje; dostupna nakon @
}
>> ukupno ¶         // → 14
```

> `°x` (prefiks) sidri iznad petlje — rezultat je dostupan nakon `@`.
> `x°` (sufiks) sidri unutar petlje — nestaje kada petlja završi.
> Samo tree-walker.

---

## Tipovi Podataka

| Tip | Literal | Tag `#?` | Napomene |
|-----|---------|----------|---------|
| Cijeli | `42`, `-7` | `###` | 64-bitni s predznakom |
| Decimalni | `3.14`, `1.5e10` | `##.` | Znanstvena notacija OK |
| Niz | `"tekst"` | `##"` | Interpolacija: `"Pozdrav {ime}"` |
| Znak | `'A'` | `##'` | Jedan Unicode znak |
| Logički | `#1`, `#0` | `##?` | NIJE numerički — `#1 ≠ 1` |
| Polje | `[1, 2, 3]` | `##]` | Homogeni elementi |
| Torka | `(a, b)` | `##)` | Pozicijska |
| Imenovana Torka | `(x: 1, y: 2)` | `##)` | Imenovana polja |
| Funkcija | imenovana referenca | `##()` | Prvog reda; prikazuje `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prvog reda; prikazuje `<lambd/N>` |

```zymbol
// Introspekcija tipa — vraća (tip, znamenke, vrijednost)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Izlaz i Ulaz

```zymbol
>> "Pozdrav" ¶                    // ¶ ili \\ za eksplicitni novi red
>> "a=" a " b=" b ¶               // jukstapozicija — više vrijednosti
>> (polje$#) ¶                    // postfiksni operatori zahtijevaju ( ) u >>

<< ime                            // čitanje u varijablu (bez upita)
<< "Unesite ime: " ime            // s upitom
```

> `¶` (AltGr+R na španjolskoj tipkovnici) i `\\` su ekvivalentni novi redovi.

---

## TUI Primitivi

Terminalni UI operatori za interaktivne programe. Većina zahtijeva blok `>>| { }` (alternativni ekran + sirovi način).

```zymbol
>>| {
    >>!                             // brisanje alternativnog ekrana
    >>~ (1, 1, 0, 10) > "Pokrenuto"  // redak 1, stupac 1, fg=10 (zelena)
    @~ 1000                         // pauza 1 sekunda (1000 ms)
    >>~ (2, 1) > "Gotovo."
}
// terminal automatski obnovljen pri izlasku
```

```zymbol
// Pritisak tipke i veličina terminala
>>| {
    [redovi, stupci] = >>?              // upit za dimenzije terminala
    >>~ (1, 1) > "Terminal: " redovi " x " stupci
    <<| tipka                           // blokirajuće čitanje tipke
    >>~ (2, 1) > "Pritisnuto: " tipka
}
```

> `>>!` briše ekran. `>>?` vraća `[redovi, stupci]`. `@~ N` spava N milisekundi.
> `<<|` čita jedan pritisak tipke (blokirajuće); `<<|?` provjerava bez blokiranja (vraća `'\0'` ako nema).
> Torka pozicioniranog izlaza: `(redak, stupac, PDM, fg, bg)` — bilo koji utor može se izostaviti zarezom (`>>~ (,,, 196) > "crvena"`).
> PDM maska: `1`=Podebljano, `2`=Kurziv, `4`=Podcrtano. ANSI 256-bojni paletni (`0`=zadani terminal).
> Samo tree-walker (osim `>>!`, `>>?`, `@~`, `>>~` koji rade i s `--vm`).

---

## Operatori

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (cjelobrojno dijeljenje)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potenciranje)

// Usporedba — dodjela za provjeru
u1 = a == b    // #0
u2 = a <> b    // #1
u3 = a < b     // #0
u4 = a <= b    // #0
u5 = a > b     // #1
u6 = a >= b    // #1

// Logički
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Nizovi

```zymbol
// Dva oblika ulančavanja
ime = "Alice"
n = 42

>> "Pozdrav " ime " imate " n ¶    // jukstapozicija — u >>
opis = "Pozdrav {ime}, imate {n}"  // interpolacija — bilo gdje
```

```zymbol
s = "Pozdrav Svijet"
duz = s$#                  // 14
pod = s$[1..7]             // "Pozdrav"  (1-bazno, kraj uključen)
ima = s$? "Svijet"          // #1
dijelovi = "a,b,c,d"$/ ','  // [a, b, c, d]  (dijeljenje odvojnikom)
zam = s$~~["a":"A"]         // zamjena
zam1 = s$~~["a":"A":1]      // samo prvih N
red = "─" $* 20             // "────────────────────"  (ponavljanje N puta)
```

> `+` je samo za brojeve. Za nizove koristite `,`, jukstapoziciju ili interpolaciju.

---

## Upravljanje Tokom

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
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> ocjena ¶    // → B

// Nizovi
boja = "crvena"
kod = ?? boja {
    "crvena"  => "#FF0000"
    "zelena"  => "#00FF00"
    _         => "#000000"
}

// Uzorci usporedbe
temp = -5
stanje = ?? temp {
    < 0  => "led"
    < 20 => "hladno"
    < 35 => "toplo"
    _    => "vruće"
}
>> stanje ¶    // → led

// Naredbeni oblik (blokovske grane)
n = -3
?? n {
    0    => { >> "nula" ¶ }
    < 0  => { >> "negativno" ¶ }
    _    => { >> "pozitivno" ¶ }
}
```

---

## Petlje

```zymbol
@ i:0..4  { >> i " " }        // raspon uključen:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // s korakom:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // obrnuto:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

voce = ["jabuka", "kruška", "grožđe"]
@ v:voce { >> v ¶ }           // for-each polje

@ c:"pozdrav" { >> c "-" }
>> ¶                          // → p-o-z-d-r-a-v-  (for-each niz)

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

// Označena petlja (ugniježđeni prekid)
brojac = 0
@:vanjska {
    brojac++
    ? brojac >= 3 { @:vanjska! }
}
>> brojac ¶                   // → 3
```

---

## Funkcije

```zymbol
zbroji(a, b) { <~ a + b }
>> zbroji(3, 4) ¶    // → 7

faktorijel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorijel(n - 1)
}
>> faktorijel(5) ¶    // → 120
```

Funkcije imaju **izolirani opseg** — ne mogu čitati vanjske varijable. Koristite izlazne parametre `<~` za izmjenu varijabli pozivatelja:

```zymbol
zamijeni(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
zamijeni(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Imenovane funkcije su **vrijednosti prvog reda** — prosljeđujte izravno: `brojevi$> udvostruci`. Za omotavanje: `x -> fn(x)` je također valjano.

---

## Lambde i Zatvaranja

```zymbol
udvostruci = x -> x * 2
zbroj = (a, b) -> a + b
>> udvostruci(5) ¶    // → 10
>> zbroj(3, 7) ¶      // → 10

// Blokovna lambda
klasificiraj = x -> {
    ? x > 0 { <~ "pozitivno" }
    _? x < 0 { <~ "negativno" }
    <~ "nula"
}

// Zatvaranje — hvata vanjski opseg
faktor = 3
utrostruci = x -> x * faktor
>> utrostruci(7) ¶    // → 21

// Tvornica
napravi_zbrajac(n) { <~ x -> x + n }
dodaj10 = napravi_zbrajac(10)
>> dodaj10(5) ¶    // → 15

// U poljima
operacije = [x -> x+1, x -> x*2, x -> x*x]
>> operacije[3](5) ¶    // → 25
```

---

## Polja

Polja su **promjenjiva** i sadrže elemente **istog tipa**.

```zymbol
polje = [1, 2, 3, 4, 5]

x = polje[1]      // 1 — pristup (1-bazno: prvi element)
x = polje[-1]     // 5 — negativni indeks (zadnji element)
x = polje$#       // 5 — duljina (koristite (polje$#) u >>)

polje = polje$+ 6            // dodavanje → [1,2,3,4,5,6]
polje2 = polje$+[2] 99       // umetanje na poziciju 2 (1-bazno)
polje3 = polje$- 3           // uklanjanje prvog pojavljivanja vrijednosti
polje4 = polje$-- 3          // uklanjanje svih pojavljivanja
polje5 = polje$-[1]          // uklanjanje na indeksu 1 (prvi element)
polje6 = polje$-[2..3]       // uklanjanje raspona (1-bazno, kraj uključen)

ima = polje$? 3              // #1 — sadrži
poz = polje$?? 3             // [3] — svi indeksi vrijednosti (1-bazno)
rez = polje$[1..3]           // [1,2,3] — isječak (1-bazno, kraj uključen)
rez2 = polje$[1:3]           // [1,2,3] — isto, sintaksa s brojem

uzl = polje$^+               // sortirano uzlazno (samo primitivni)
sil = polje$^-               // sortirano silazno (samo primitivni)

// Polja imenovanih/pozicijskih torki — koristite $^ s lambda komparatorom
bp = [(ime: "Karla", god: 28), (ime: "Ana", god: 25), (ime: "Bob", god: 30)]
po_godinama = bp$^ (a, b -> a.god < b.god)    // uzlazno po godinama  (<)
po_imenu    = bp$^ (a, b -> a.ime > b.ime)    // silazno po imenu (>)
>> po_godinama[1].ime ¶     // → Ana
>> po_imenu[1].ime ¶        // → Karla

// Izravno ažuriranje elementa (samo polja)
polje[1] = 99              // dodjela
polje[2] += 5              // složeno: +=  -=  *=  /=  %=  ^=

// Funkcionalno ažuriranje — vraća novo polje; original nepromijenjen
polje2 = polje[2]$~ 99
```

> Svi operatori kolekcija vraćaju **novo polje**. Dodijelite natrag: `polje = polje$+ 4`.
> `$+` se može ulančati: `polje = polje$+ 5$+ 6$+ 7`. Ostali operatori koriste međuassignacije.
> **Indeksiranje je 1-bazno**: `polje[1]` je prvi element; `polje[0]` je greška pri izvođenju.
> `$^+` / `$^-` sortiraju **primitivna polja** (brojevi, nizovi). Za polja torki koristite `$^` s lambda komparatorom — smjer je kodiran u lambdi (`<` = uzlazno, `>` = silazno).

**Semantika vrijednosti** — dodjela polja drugoj varijabli stvara neovisnu kopiju:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nije pod utjecajem
```

```zymbol
// Ugniježđena polja (1-bazno indeksiranje)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (redak 2, stupac 3)
```

---

## Destrukturiranje

```zymbol
// Polje
polje = [10, 20, 30, 40, 50]
[a, b, c] = polje              // a=10  b=20  c=30
[prvi, *ostalo] = polje        // prvi=10  ostalo=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ odbacuje

// Pozicijska torka
tocka = (100, 200)
(tx, ty) = tocka               // tx=100  ty=200

// Imenovana torka
osoba = (ime: "Ana", god: 25, grad: "Zagreb")
(ime: i, god: g) = osoba       // i="Ana"  g=25
```

---

## Torke

Torke su **nepromjenjivi** uređeni kontejneri koji mogu sadržavati vrijednosti **različitih tipova**.
Za razliku od polja, elementi se ne mogu mijenjati nakon stvaranja.

```zymbol
// Pozicijske — dozvoljeni miješani tipovi
tocka = (10, 20)
>> tocka[1] ¶    // → 10

podaci = (42, "pozdrav", #1, 3.14)
>> podaci[3] ¶   // → #1

// Imenovane
osoba = (ime: "Alice", god: 25)
>> osoba.ime ¶    // → Alice
>> osoba[1] ¶     // → Alice  (indeks također radi, 1-bazno)

// Ugniježđene
poz = (x: 10, y: 20)
p = (poz: poz, oznaka: "ishodište")
>> p.poz.x ¶      // → 10
```

**Nepromjenjivost** — svaki pokušaj izmjene elementa torke je greška pri izvođenju:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ greška pri izvođenju: torke su nepromjenjive
// t[1] += 5    // ❌ ista greška
```

Za izvođenje izmijenjene vrijednosti koristite `$~` (funkcionalno ažuriranje) — vraća **novu** torku:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original nepromijenjen
>> t2 ¶    // → (10, 999, 30)

// Imenovana torka — eksplicitna rekonstrukcija
osoba = (ime: "Alice", god: 25)
starija = (ime: osoba.ime, god: 26)
>> osoba.god ¶    // → 25
>> starija.god ¶  // → 26
```

---

## Funkcije Višeg Reda

```zymbol
brojevi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

udvostruceni = brojevi$> (x -> x * 2)                // map  → [2,4,6…20]
parni        = brojevi$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ukupno       = brojevi$< (0, (akum, x) -> akum + x)  // reduce → 55

// Ulančavanje kroz međuvrijednosti
korak1 = brojevi$| (x -> x > 3)
korak2 = korak1$> (x -> x * x)
>> korak2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imenovane funkcije mogu se izravno proslijediti HOF
udvostruci(x) { <~ x * 2 }
je_veliko(x) { <~ x > 5 }
r = brojevi$> udvostruci    // ✅ izravna referenca
r = brojevi$| je_veliko     // ✅ izravna referenca
```

---

## Operator Cijevi

Desna strana uvijek zahtijeva `_` kao rezervno mjesto za proslijeđenu vrijednost:

```zymbol
udvostruci = x -> x * 2
zbroji = (a, b) -> a + b
povecaj = x -> x + 1

r1 = 5 |> udvostruci(_)       // → 10
r2 = 10 |> zbroji(_, 5)       // → 15
r3 = 5 |> zbroji(2, _)        // → 7

// Ulančano
r = 5 |> udvostruci(_) |> povecaj(_) |> udvostruci(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Upravljanje Greškama

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dijeljenje nulom" ¶
} :! {
    >> "ostalo: " _err ¶    // _err sadrži poruku greške
} :> {
    >> "uvijek se izvodi" ¶
}
```

| Tip | Kada |
|-----|------|
| `##Div` | Dijeljenje nulom |
| `##IO` | Datoteka / sustav |
| `##Index` | Indeks izvan granica |
| `##Type` | Neusklađenost tipova |
| `##Parse` | Parsiranje podataka |
| `##Network` | Mrežne greške |
| `##_` | Bilo koja greška (catch-all) |

---

## Moduli

```zymbol
// lib/calc.zy — tijelo modula je zatvoreno u vitičaste zagrade
# calc {
    #> { zbroji, dohvati_PI }

    _PI := 3.14159
    zbroji(a, b) { <~ a + b }
    dohvati_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => k    // alias je obavezan

>> k::zbroji(5, 3) ¶     // → 8
pi = k::dohvati_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Izvoz s drugačijim javnim imenom
# mojalib {
    #> { _unutarnji_zbroj => suma }

    _unutarnji_zbroj(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib => m

>> m::suma(3, 4) ¶    // → 7  (unutarnje ime _unutarnji_zbroj je skriveno)
```

> **Pravila modula**: samo `#>`, definicije funkcija i literalni inicijalizatori varijabli/konstanti dopušteni su unutar `# ime { }`. Izvršive naredbe (`>>`, `<<`, petlje itd.) uzrokuju grešku E013.

---

## Numerički Načini

Zymbol može prikazivati brojeve u **69 Unicode skripti znamenki** — Devanagari, Arapsko-Indijski, Tajlandski, Klingonski pIqaD, Matematički podebljani, LCD segmenti i još. Aktivni način utječe samo na `>>` izlaz; unutarnja aritmetika je uvijek binarna.

### Aktiviranje skripte

Napišite znamenke `0` i `9` ciljane skripte zatvorene u `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arapsko-Indijski (U+0660–U+0669)
#๐๙#    // Tajlandski   (U+0E50–U+0E59)
#09#    // reset na ASCII
```

### Izlaz i logičke vrijednosti

```zymbol
x = 42
>> x ¶          // → 42   (ASCII zadano)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimalna točka uvijek ASCII)
>> 1 + 2 ¶      // → ३

// Logičke: prefiks # uvijek ASCII, znamenka se prilagođava
>> #1 ¶         // → #१   (istina u Devanagari)
>> #0 ¶         // → #०   (laž — različito od ०  cijelog broja nula)

x = 28 > 4
>> x ¶          // → #१   (rezultat usporedbe prati aktivni način)
```

### Nativni literali znamenki u izvornom kodu

Znamenke bilo koje podržane skripte su valjani literali — u rasponima, modulo, usporedbama:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logički literali u bilo kojoj skripti

`#` + znamenka `0` ili `1` iz bilo kojeg bloka je valjan logički literal:

```zymbol
#٠٩#
aktivno = #١        // isto kao #1
>> aktivno ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` je **uvijek ASCII**. `#0` (laž) je uvijek vizualno različito od `0` (cijeli broj nula) u svakoj skripti.

---

## Operatori Podataka

```zymbol
// Konverzije tipova
f = ##.42         // → 42.0  (u Decimalni)
i = ###3.7        // → 4     (u Cijeli, zaokruživanje)
t = ##!3.7        // → 3     (u Cijeli, odsijecanje)

// Parsiranje niza u broj
v1 = #|"42"|      // → 42  (Cijeli)
v2 = #|"3.14"|    // → 3.14  (Decimalni)
v3 = #|"abc"|     // → "abc"  (sigurni neuspjeh, bez greške)

// Zaokruživanje / odsijecanje
pi = 3.14159265
v2 = #.2|pi|      // → 3.14  (zaokruži na 2 decimalna mjesta)
v4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (odsijecanje)

// Formatiranje brojeva
fmt = #,|1234567|  // → 1,234,567  (odvojeno zarezima)
znan = #^|12345.678|    // → 1.2345678e4  (znanstvena notacija)

// Literali baza
a = 0x41         // → 'A'  (heksadecimalno)
b = 0b01000001   // → 'A'  (binarno)
c = 0o101        // → 'A'  (oktalno)

// Izlaz konverzije baze
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracija Shell-a

```zymbol
datum = <\ date +%Y-%m-%d \>     // hvata stdout (uključuje završni \n)
>> "Danas: " datum

datoteka = "podaci.txt"
sadrzaj = <\ cat {datoteka} \>   // interpolacija u naredbama

izlaz = </"./podskript.zy"/>     // izvodi drugi Zymbol skript, hvata izlaz
>> izlaz
```

> `><` hvata CLI argumente kao polje nizova (samo tree-walker).

---

## Potpuni Primjer: FizzBuzz

```zymbol
klasificiraj(broj) {
    ? broj % 15 == 0 { <~ "FizzBuzz" }
    _? broj % 3  == 0 { <~ "Fizz" }
    _? broj % 5  == 0 { <~ "Buzz" }
    _ { <~ broj }
}

@ i:1..20 { >> klasificiraj(i) ¶ }
```

---

## Referenca Simbola

| Simbol | Operacija | Simbol | Operacija |
|--------|-----------|--------|-----------|
| `=` | varijabla | `$#` | duljina |
| `:=` | konstanta | `$+` | dodavanje (ulančivo) |
| `>>` | izlaz | `$+[i]` | umetanje na indeks (1-bazno) |
| `<<` | ulaz | `$-` | uklanjanje prvog po vrijednosti |
| `¶` / `\\` | novi red | `$--` | uklanjanje svih po vrijednosti |
| `?` | ako | `$-[i]` | uklanjanje na indeksu (1-bazno) |
| `_?` | inače-ako | `$-[i..j]` | uklanjanje raspona (1-bazno) |
| `_` | inače / uzorak | `$?` | sadrži |
| `??` | podudaranje | `$??` | pronalaženje svih indeksa (1-bazno) |
| `@` | petlja | `$[s..e]` | isječak (1-bazno) |
| `@ N { }` | petlja N puta | `$>` | map |
| `@!` | prekid | `$\|` | filter |
| `@>` | nastavi | `$<` | reduce |
| `@:ime { }` | označena petlja | `$/ razdv` | dijeljenje niza |
| `@:ime!` | prekid označene | `$++ a b c` | konkatenacija |
| `@:ime>` | nastavi označenu | `polje[i>j>k]` | navigacijski indeks |
| `->` | lambda | `polje[i] = vrij` | ažuriranje elementa (samo polja) |
| `polje[i] += vrij` | složeno ažuriranje | `polje[i]$~` | funkcionalno ažuriranje (nova kopija) |
| `$^+` | sortiranje uzlazno (prim.) | `$^-` | sortiranje silazno (prim.) |
| `$^` | sortiranje s komparatorom (torke) | `<~` | povratak |
| `\|>` | cijev | `!?` | pokušaj |
| `:!` | hvatanje | `:>` | na kraju |
| `#1` | istina | `#0` | laž |
| `$!` | je greška | `$!!` | propagacija greške |
| `<#` | uvoz | `#>` | izvoz |
| `#` | deklaracija modula | `::` | poziv modula |
| `.` | pristup polju | `#?` | metapodaci tipa |
| `#\|..\|` | parsiranje broja | `##.` | konverzija u Decimalni |
| `###` | konverzija u Cijeli (zaokr.) | `##!` | konverzija u Cijeli (odsjec.) |
| `#.N\|..\|` | zaokruživanje | `#!N\|..\|` | odsijecanje |
| `#,\|..\|` | format sa zarezima | `#^\|..\|` | znanstvena notacija |
| `#d0d9#` | prebacivanje načina znamenki | `#09#` | reset na ASCII |
| `<\ ..\>` | izvođenje shell-a | `>\<` | CLI argumenti |
| `\ var` | eksplicitno uništavanje | `°x` / `x°` | vrela definicija (auto-init) |
| `>>|` | TUI blok (alt. ekran) | `>>~` | pozicionirani izlaz |
| `>>!` | brisanje ekrana | `>>?` | upit veličine terminala |
| `<<\|` | blokirajuća tipka | `<<\|?` | neblokirajuća tipka |
| `@~ N` | spavanje N milisekundi | `$*` | ponavljanje niza N puta |

---

## Evidencija Promjena

### v0.0.5 — TUI Primitivi, Vrela Definicija i Ponavljanje Niza _(svibanj 2026)_

- **Promjena** Odvojnik grane podudaranja: `uzorak : rezultat` → `uzorak => rezultat`
- **Promjena** Alias uvoza: `<# put <= alias` → `<# put => alias`
- **Promjena** Preimenovanje pri izvozu: `#> { fn <= pub }` → `#> { fn => pub }`
- **Dodano** TUI blok `>>| { }` — alternativni ekran + sirovi način; čisti pri izlasku
- **Dodano** Pozicionirani izlaz `>>~ (redak, stupac, PDM, fg, bg) > elementi` — rijetki utori, 256-bojni ANSI
- **Dodano** Ulaz tipke `<<| var` (blokirajuće) i `<<|? var` (neblokirajuće ispitivanje)
- **Dodano** `>>!` brisanje, `>>?` upit veličine, `@~ N` spavanje N milisekundi
- **Dodano** Vrela definicija `°x` / `x°` — auto-inicijalizacija pri prvoj upotrebi u petljama
- **Dodano** Ponavljanje niza `niz $* N` — ponavlja niz N puta
- **VM** Paritet: 436/436 testova prolazi

### v0.0.4 — 1-Bazno Indeksiranje, Funkcije Prvog Reda i Blokovi Modula _(travanj 2026)_

- **Promjena** Sve indeksiranje prebačeno na **1-bazno** — `polje[1]` je prvi element; `polje[0]` je greška
- **Dodano** Imenovane funkcije su **vrijednosti prvog reda** — prosljeđujte izravno HOF: `brojevi$> udvostruci`
- **Dodano** Obavezan **blokovni sintaktički oblik** modula: `# ime { ... }` — ravni oblik uklonjen
- **Dodano** Višedimenzionalno indeksiranje: `polje[i>j>k]` (navigacija), `polje[p ; q]` (ravno ekstrakcija)
- **Dodano** Konverzije tipova: `##.izr` (Decimalni), `###izr` (Cijeli zaokr.), `##!izr` (Cijeli odsjec.)
- **Dodano** Dijeljenje niza: `niz$/ razdv` — vraća `Array(String)`
- **Dodano** Konkatenacija: `baza$++ a b c` — dodaje više elemenata
- **Dodano** Petlja N puta: `@ N { }` — ponavlja točno N puta
- **Dodano** Sintaksa označene petlje: `@:ime { }`, `@:ime!`, `@:ime>` — zamjenjuje `@ @ime` / `@! ime`
- **Dodano** Pravila opsega varijabli: `_ime` ima točan blokovski opseg; `\ var` uništava rano
- **Dodano** Uzorci usporedbe u podudaranju: `< 0 :`, `> 5 :`, `== 42 :` itd.
- **Dodano** Greška E013 modula: izvršive naredbe u tijelu modula su zabranjene
- **Ispravljeno** `take_variable` više ne oštećuje konstante modula pri povratu
- **Ispravljeno** `alias.CONST` se sada ispravno razrješuje; `#>` može se pojaviti nakon definicija funkcija
- **VM** Puni paritet: 393/393 testova prolazi

### v0.0.3 — Unicode Numerički Sustavi i Poboljšanja LSP _(travanj 2026)_

- **Dodano** 69 Unicode blokova znamenki s prebacivačkim tokenom `#d0d9#`
- **Dodano** Logički literali u bilo kojoj skripti — `#१` / `#०`, `#١` / `#٠` itd.
- **Dodano** Klingonske pIqaD znamenke (CSUR PUA U+F8F0–U+F8F9)
- **Dodano** Operacijski kod VM `SetNumeralMode` — puni paritet s tree-walker
- **Promjena** REPL poštuje aktivni numerički način pri ehu i prikazu varijabli
- **Promjena** `>>` izlaz za logičke vrijednosti sada uključuje prefiks `#` (`#0` / `#1`) u svim načinima

### v0.0.2_01 — Preimenovanje Operatora _(30 ožu 2026)_

- **Promjena** `c|..|` → `#,|..|` i `e|..|` → `#^|..|` — konzistentno s obitelji prefiksa `#`
- **Dodano** Alias izvoza: ponovno izvozi module pod različitim imenom

### v0.0.2 — Redizajn API Kolekcija i Instalatori _(24 ožu 2026)_

- **Dodano** Unificirana obitelj operatora `$` za polja i nizove (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Dodano** Destrukturiranje za polja, torke i imenovane torke
- **Dodano** Negativni indeksi (`polje[-1]` = zadnji element)
- **Dodano** Nativni instalatori — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 ožu 2026)_

- **Dodano** Složena dodjela `^=`
- **Ispravljeno** Rubni slučajevi aritmetike parsera; ispravci dokumentacije

### v0.0.1 — Početno Javno Izdanje _(22 ožu 2026)_

- Tree-walker interpreter + registarski VM (`--vm`, ~4× brži, ~95% paritet)
- Svi osnovni konstrukti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Puni Unicode identifikatori, modulski sustav, lambde, zatvaranja, upravljanje greškama
- REPL, LSP, VS Code proširenje, formater (`zymbol fmt`)

---

_Zymbol-Lang — Simbolički. Univerzalni. Nepromjenjivi._
