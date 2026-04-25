> **Opomba:** Ta dokumentacija je bila ustvarjena s pomočjo umetne inteligence (UI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanonična referenca je **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** v repozitoriju tolmača.

---

# Priročnik Zymbol-Lang

**Zymbol-Lang** je simbolični programski jezik. Nima ključnih besed — vse je simbol. Deluje identično v vsakem človeškem jeziku.

- Brez `if`, `while`, `return` — le `?`, `@`, `<~`
- Polna podpora Unicode — identifikatorji v katerem koli jeziku ali emoji
- Neodvisen od človeškega jezika — koda je povsod identična

**Različica tolmača**: v0.0.4 | **Pokritost s testi**: 393/393 (TW ↔ VM enakost)

---

## Spremenljivke in Konstante

```zymbol
x = 10              // spremenljivka — spremenljiva
PI := 3.14159       // konstanta — ponovna dodelitev je napaka med izvajanjem
ime = "Alice"
aktiven = #1        // logična resnica
👋 := "Pozdravljen"
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

## Podatkovni Tipi

| Tip | Literal | Oznaka `#?` | Opombe |
|-----|---------|-------------|--------|
| Int | `42`, `-7` | `###` | 64-bitno s predznakom |
| Float | `3.14`, `1.5e10` | `##.` | Znanstveni zapis OK |
| String | `"besedilo"` | `##"` | Interpolacija: `"Pozdravljen {ime}"` |
| Char | `'A'` | `##'` | En znak Unicode |
| Bool | `#1`, `#0` | `##?` | NI številčen — `#1 ≠ 1` |
| Polje | `[1, 2, 3]` | `##]` | Homogeni elementi |
| Nabor | `(a, b)` | `##)` | Pozicijski |
| Poimenovan Nabor | `(x: 1, y: 2)` | `##)` | Poimenovana polja |
| Funkcija | referenca na poimenovano funkcijo | `##()` | Prvorazredna; prikaz `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prvorazredna; prikaz `<lambd/N>` |

```zymbol
// Introspekcija tipa — vrne (tip, števke, vrednost)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Izhod in Vhod

```zymbol
>> "Pozdravljen" ¶                 // ¶ ali \\ za eksplicitno novo vrstico
>> "a=" a " b=" b ¶               // juxtapozicija — več vrednosti
>> (pol$#) ¶                      // postfiksni operatorji zahtevajo ( ) v >>

<< ime                            // branje v spremenljivko (brez poziva)
<< "Vnesite ime: " ime            // s pozivom
```

> `¶` (AltGr+R na španski tipkovnici) in `\\` sta enakovredni novi vrstici.

---

## Operatorji

```zymbol
// Aritmetika — uporabljaj dodelitve; nekateri operatorji imajo posebnosti neposredno v >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (celoštevilčno deljenje)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (potenciranje)

// Primerjanje
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

## Nizi

```zymbol
// Dve obliki združevanja
ime = "Alice"
n = 42

>> "Pozdravljen " ime " imaš " n ¶     // juxtapozicija — v >>
opis = "Pozdravljen {ime}, imaš {n}"   // interpolacija — povsod
```

```zymbol
s = "Pozdrav Svetu"
dolzina = s$#                  // 13
pod = s$[1..7]                 // "Pozdrav"  (od 1, konec vključno)
ima = s$? "Svetu"              // #1
deli = "a,b,c,d"$/ ','         // [a, b, c, d]  (razdeli po ločilu)
zam = s$~~["e":"E"]            // zamenjaj vse
zam1 = s$~~["e":"E":1]         // zamenjaj prvih N
```

> `+` je samo za števila. Za nize uporabljaj juxtapozicijo ali interpolacijo.

---

## Nadzor Toka

```zymbol
x = 7

? x > 0 { >> "pozitivno" ¶ }

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

> Zavite oklepaje `{ }` so **obvezni** tudi za en sam stavek.

---

## Ujemanje

```zymbol
// Obsegi
tocke = 85
ocena = ?? tocke {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocena ¶    // → B

// Nizi
barva = "rdeca"
koda = ?? barva {
    "rdeca"   : "#FF0000"
    "zelena"  : "#00FF00"
    _         : "#000000"
}

// Vzorci primerjave
temp = -5
stanje = ?? temp {
    < 0  : "led"
    < 20 : "hladno"
    < 35 : "toplo"
    _    : "vroče"
}
>> stanje ¶    // → led

// Stavčna oblika (blokove veje)
?? n {
    0       : { >> "nič" ¶ }
    _? n < 0: { >> "negativno" ¶ }
    _       : { >> "pozitivno" ¶ }
}
```

---

## Zanke

```zymbol
@ i:0..4  { >> i " " }        // obseg vključno:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // s korakom:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // nazaj:            5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

sadje = ["jabolko", "hruška", "grozdje"]
@ f:sadje { >> f ¶ }          // for-each polje

@ c:"pozdrav" { >> c "-" }
>> ¶                          // → p-o-z-d-r-a-v-  (for-each niz)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> nadaljuj
    ? i > 7 { @! }             // @! prekini
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Neskončna zanka
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Označena zanka (gnezdena prekinitev)
stevec = 0
@:zunanja {
    stevec++
    ? stevec >= 3 { @:zunanja! }
}
>> stevec ¶                    // → 3
```

---

## Funkcije

```zymbol
sestej(a, b) { <~ a + b }
>> sestej(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funkcije imajo **izolirano področje** — ne morejo brati zunanjih spremenljivk. Uporabljaj izhodne parametre `<~` za spreminjanje spremenljivk klicatelja:

```zymbol
zamenjaj(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
zamenjaj(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Poimenovane funkcije so **prvorazredne vrednosti** — posreduj neposredno: `stevila$> podvoji`. Ovijanje: `x -> fn(x)` je prav tako veljavno.

---

## Lambde in Zaprtja

```zymbol
podvoji = x -> x * 2
vsota = (a, b) -> a + b
>> podvoji(5) ¶    // → 10
>> vsota(3, 7) ¶   // → 10

// Blokovska lambda
klasificiraj = x -> {
    ? x > 0 { <~ "pozitivno" }
    _? x < 0 { <~ "negativno" }
    <~ "nič"
}

// Zaprtje — zajame zunanje področje
koeficient = 3
potrojeno = x -> x * koeficient
>> potrojeno(7) ¶    // → 21

// Tovarna
make_adder(n) { <~ x -> x + n }
dodaj10 = make_adder(10)
>> dodaj10(5) ¶    // → 15

// V poljih
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Polja

Polja so **spremenljiva** in hranijo elemente **istega tipa**.

```zymbol
pol = [1, 2, 3, 4, 5]

pol[1]          // 1 — dostop (indeks od 1: prvi element)
pol[-1]         // 5 — negativni indeks (zadnji element)
pol$#           // 5 — dolžina (uporabljaj (pol$#) v >>)

pol = pol$+ 6            // dodaj → [1,2,3,4,5,6]
pol2 = pol$+[2] 99       // vstavi na položaj 2 (indeks od 1)
pol3 = pol$- 3           // odstrani prvo pojavitev vrednosti
pol4 = pol$-- 3          // odstrani vse pojavitve
pol5 = pol$-[1]          // odstrani na indeksu 1 (prvi element)
pol6 = pol$-[2..3]       // odstrani obseg (indeks od 1, konec vključno)

ima = pol$? 3            // #1 — vsebuje
poz = pol$?? 3           // [3] — vsi indeksi vrednosti (indeks od 1)
rezina = pol$[1..3]      // [1,2,3] — rezina (indeks od 1, konec vključno)
rezina2 = pol$[1:3]      // [1,2,3] — isto, sintaksa štetja

nars = pol$^+            // razvrščeno naraščajoče  (samo primitivni)
pada = pol$^-            // razvrščeno padajoče     (samo primitivni)

// Polja naborov — uporabljaj $^ z lambdo primerjalnika
db = [(ime: "Carla", starost: 28), (ime: "Ana", starost: 25), (ime: "Bob", starost: 30)]
po_starosti = db$^ (a, b -> a.starost < b.starost)
po_imenu    = db$^ (a, b -> a.ime > b.ime)
>> po_starosti[1].ime ¶     // → Ana
>> po_imenu[1].ime ¶        // → Carla

// Neposredna posodobitev elementa (samo polja)
pol[1] = 99              // dodeli
pol[2] += 5              // sestavljeno: +=  -=  *=  /=  %=  ^=

// Funkcionalna posodobitev — vrne novo polje; original nespremenjen
pol2 = pol[2]$~ 99
```

> Vsi operatorji zbirk vrnejo **novo polje**. Dodeli nazaj: `pol = pol$+ 4`.
> `$^+` / `$^-` razvrščata **polja primitivov** (števila, nizi). Za polja naborov uporabljaj `$^` z lambdo primerjalnika.
> **Indeksiranje od 1**: `pol[1]` je prvi element; `pol[0]` je napaka med izvajanjem.

**Vrednostna semantika** — dodelitev polja drugi spremenljivki ustvari neodvisno kopijo:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ni prizadeto
```

```zymbol
// Gnezdena polja (indeksiranje od 1)
matrika = [[1,2,3],[4,5,6],[7,8,9]]
>> matrika[2][3] ¶    // → 6  (vrstica 2, stolpec 3)
```

---

## Destrukturiranje

```zymbol
// Polje
pol = [10, 20, 30, 40, 50]
[a, b, c] = pol              // a=10  b=20  c=30
[prva, *ostalo] = pol        // prva=10  ostalo=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ zavrže

// Pozicijski nabor
tocka = (100, 200)
(px, py) = tocka             // px=100  py=200

// Poimenovan nabor
oseba = (ime: "Ana", starost: 25, mesto: "Madrid")
(ime: i, starost: s) = oseba // i="Ana"  s=25
```

---

## Nabori

Nabori so **nespremenljivi** urejeni vsebniki, ki lahko hranijo vrednosti **različnih tipov**. Za razliko od polj elementov po ustvaritvi ni mogoče spremeniti.

```zymbol
// Pozicijski — dovoljeni mešani tipi
tocka = (10, 20)
>> tocka[1] ¶    // → 10

podatki = (42, "pozdrav", #1, 3.14)
>> podatki[3] ¶     // → #1

// Poimenovan
oseba = (ime: "Alice", starost: 25)
>> oseba.ime ¶    // → Alice
>> oseba[1] ¶     // → Alice  (indeks prav tako deluje, od 1)

// Gnezden
poz = (x: 10, y: 20)
p = (poz: poz, oznaka: "izhodisce")
>> p.poz.x ¶        // → 10
```

**Nespremenljivost** — vsak poskus spremembe elementa nabora je napaka med izvajanjem:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ napaka med izvajanjem: nabori so nespremenljivi
// t[1] += 5    // ❌ enaka napaka
```

Za pridobitev spremenjene vrednosti uporabi `$~` (funkcionalna posodobitev) — vrne **nov** nabor:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original nespremenjen
>> t2 ¶    // → (10, 999, 30)

// Poimenovan nabor — eksplicitno obnovi
oseba = (ime: "Alice", starost: 25)
starejsa  = (ime: oseba.ime, starost: 26)
>> oseba.starost ¶    // → 25
>> starejsa.starost ¶ // → 26
```

---

## Funkcije Višjega Reda

```zymbol
stevila = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

podvojena  = stevila$> (x -> x * 2)                // map  → [2,4,6…20]
soda       = stevila$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
skupaj     = stevila$< (0, (acc, x) -> acc + x)     // reduce → 55

// Veriga prek vmesnih spremenljivk
korak1 = stevila$| (x -> x > 3)
korak2 = korak1$> (x -> x * x)
>> korak2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Poimenovane funkcije lahko posredujemo neposredno v FVR
podvoji(x) { <~ x * 2 }
je_veliko(x) { <~ x > 5 }
r = stevila$> podvoji       // ✅ neposredna referenca
r = stevila$| je_veliko     // ✅ neposredna referenca
```

---

## Cevovodni Operator

Desna stran vedno zahteva `_` kot nadomestek za prenešeno vrednost:

```zymbol
podvoji = x -> x * 2
sestej = (a, b) -> a + b
inc = x -> x + 1

5 |> podvoji(_)        // → 10
10 |> sestej(_, 5)     // → 15
5 |> sestej(2, _)      // → 7

// Veriga
r = 5 |> podvoji(_) |> inc(_) |> podvoji(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Obravnava Napak

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deljenje z nič" ¶
} :! {
    >> "ostalo: " _err ¶    // _err vsebuje sporočilo napake
} :> {
    >> "vedno se izvede" ¶
}
```

| Tip | Kdaj |
|-----|------|
| `##Div` | Deljenje z nič |
| `##IO` | Datoteka / sistem |
| `##Index` | Indeks izven obsega |
| `##Type` | Neskladnost tipov |
| `##Parse` | Razčlenjevanje podatkov |
| `##Network` | Omrežne napake |
| `##_` | Katera koli napaka (catch-all) |

---

## Moduli

```zymbol
// lib/izracuni.zy — telo modula je zaprto v zavitih oklepajih
# izracuni {
    #> { sestej, get_PI }

    _PI := 3.14159
    sestej(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/izracuni <= i    // vzdevek je obvezen

>> i::sestej(5, 3) ¶      // → 8
pi = i::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Izvoz pod drugim javnim imenom
# mojalib {
    #> { _notr_sestej <= vsota }

    _notr_sestej(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib <= m

>> m::vsota(3, 4) ¶    // → 7  (interno ime _notr_sestej je skrito)
```

> **Pravila modula**: samo `#>`, definicije funkcij in inicializatorji dobesednih spremenljivk/konstant so dovoljeni znotraj `# name { }`. Izvršilni stavki (`>>`, `<<`, zanke itd.) povzročijo napako E013.

---

## Številčni Sistemi

Zymbol lahko prikazuje števila v **69 blokih šifer Unicode** — Devanagari, Arabsko-Indijski, Tajski, Klingon pIqaD, matematično krepko, LCD številke in več. Aktivni način vpliva samo na izhod `>>`; interna aritmetika je vedno binarna.

### Aktivacija sistema

Zapiši šifri `0` in `9` ciljne pisave med `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabsko-Indijski (U+0660–U+0669)
#๐๙#    // Tajski        (U+0E50–U+0E59)
#09#    // ponastavi na ASCII
```

### Izhod in logične vrednosti

```zymbol
x = 42
>> x ¶          // → 42   (ASCII privzeto)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimalna pika vedno ASCII)
>> 1 + 2 ¶      // → ३

// Logične vrednosti: predpona # vedno ASCII, šifra se prilagodi
>> #1 ¶         // → #१   (resnica v Devanagari)
>> #0 ¶         // → #०   (neresnica — različno od ०  celoštevilčne ničle)

x = 28 > 4
>> x ¶          // → #१   (rezultat primerjave sledi aktivnemu načinu)
```

### Domače številčne literale v izvorni kodi

Šifre katerega koli podprtega sistema so veljavni literali — v obsegih, modulo, primerjanjih:

```zymbol
#٠٩#

@ i:١..١٥ {
    ? i % ١٥ == ٠ { >> "FizzBuzz" ¶ }
    _? i % ٣  == ٠ { >> "Fizz" ¶ }
    _? i % ٥  == ٠ { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logični literali v katerem koli sistemu

`#` + šifra `0` ali `1` iz katerega koli podprtega bloka je veljaven logični literal:

```zymbol
#٠٩#
aktiven = #١        // isto kot #1
>> aktiven ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` je **vedno ASCII**. `#0` (neresnica) je vedno vizualno različno od `0` (celoštevilčna ničla) v vsakem sistemu.

---

## Podatkovni Operatorji

```zymbol
// Pretvorbe tipov
##.42         // → 42.0  (v Float)
###3.7        // → 4     (v Int, zaokroži)
##!3.7        // → 3     (v Int, okrni)

// Razčlenjevanje niza v število
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (varno neuspešno, brez napake)

// Zaokroževanje / okrnitev
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokroži na 2 decimalni mesti)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (okrni)

// Oblikovanje števil
fmt = #,|1234567|  // → 1,234,567  (ločeno z vejicami)
sci = #^|12345.678|    // → 1.2345678e4  (znanstveni zapis)

// Literali v različnih osnovah
a = 0x41         // → 'A'  (šestnajstiški)
b = 0b01000001   // → 'A'  (binarni)
c = 0o101        // → 'A'  (osmiški)

// Izhod s pretvorbo osnove
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracija z Lupino

```zymbol
datum = <\ date +%Y-%m-%d \>      // zajame stdout (vključuje \n)
>> "Danes: " datum

datoteka = "data.txt"
vsebina = <\ cat {datoteka} \>    // interpolacija v ukazih

rezultat = </"./podskript.zy"/>   // izvedi drug skript Zymbol, zajame izhod
>> rezultat
```

> `>\<` zajame argumente CLI kot polje nizov (samo tree-walker).

---

## Celoten Primer: FizzBuzz

```zymbol
klasificiraj(stevilo) {
    ? stevilo % 15 == 0 { <~ "FizzBuzz" }
    _? stevilo % 3  == 0 { <~ "Fizz" }
    _? stevilo % 5  == 0 { <~ "Buzz" }
    _ { <~ stevilo }
}

@ i:1..20 { >> klasificiraj(i) ¶ }
```

---

## Referenca Simbolov

| Simbol | Operacija | Simbol | Operacija |
|--------|-----------|--------|-----------|
| `=` | spremenljivka | `$#` | dolžina |
| `:=` | konstanta | `$+` | dodaj (verižljivo) |
| `>>` | izhod | `$+[i]` | vstavi na indeks (od 1) |
| `<<` | vhod | `$-` | odstrani prvo po vrednosti |
| `¶` / `\\` | nova vrstica | `$--` | odstrani vse po vrednosti |
| `?` | če | `$-[i]` | odstrani na indeksu (od 1) |
| `_?` | sicer-če | `$-[i..j]` | odstrani obseg (od 1) |
| `_` | sicer / nadomestek | `$?` | vsebuje |
| `??` | ujemanje | `$??` | najdi vse indekse (od 1) |
| `@` | zanka | `$[s..e]` | rezina (od 1) |
| `@ N { }` | zanka N-krat | `$>` | preslikava |
| `@!` | prekini | `$\|` | filtriranje |
| `@>` | nadaljuj | `$<` | redukcija |
| `@:name { }` | označena zanka | `$/ delim` | razdeli niz |
| `@:name!` | prekini z oznako | `$++ a b c` | sestavi združitev |
| `@:name>` | nadaljuj z oznako | `pol[i>j>k]` | navigacijski indeks |
| `->` | lambda | `pol[i] = val` | posodobi element (samo polja) |
| `pol[i] += val` | sestavljeno posodabljanje | `pol[i]$~` | funkcionalna posodobitev (nova kopija) |
| `$^+` | razvrsti naraščajoče (primitivni) | `$^-` | razvrsti padajoče (primitivni) |
| `$^` | razvrsti s primerjalником (nabori) | `<~` | vrni |
| `\|>` | cevovod | `!?` | poskusi |
| `:!` | ujemi | `:>` | na koncu |
| `#1` | resnica | `#0` | neresnica |
| `$!` | je napaka | `$!!` | razširi napako |
| `<#` | uvozi | `#>` | izvozi |
| `#` | deklariraj modul | `::` | klic modula |
| `.` | dostop do polja | `#?` | metapodatki tipa |
| `#\|..\|` | razčleni število | `##.` | pretvori v Float |
| `###` | pretvori v Int (zaokroži) | `##!` | pretvori v Int (okrni) |
| `#.N\|..\|` | zaokroži | `#!N\|..\|` | okrni |
| `#,\|..\|` | oblika z vejicami | `#^\|..\|` | znanstveni |
| `#d0d9#` | preklop številčnega načina | `#09#` | ponastavi na ASCII |
| `<\ ..\>` | izvedi lupino | `>\<` | argumenti CLI |
| `\ var` | uniči spremenljivko | | |

---

## Zgodovina Različic

### v0.0.4 — Indeksiranje od 1, Prvorazredne Funkcije in Bloki Modulov _(april 2026)_

- **Sprememba** Vse indeksiranje preklopljeno na **od 1** — `pol[1]` je prvi element; `pol[0]` je napaka med izvajanjem
- **Dodano** Poimenovane funkcije so **prvorazredne vrednosti** — posreduj neposredno v FVR: `stevila$> podvoji`
- **Dodano** Zahtevana **blokovska sintaksa** modula: `# name { ... }` — ravna sintaksa odstranjena
- **Dodano** Večdimenzionalno indeksiranje: `pol[i>j>k]` (navigacija), `pol[p ; q]` (ravna ekstrakcija)
- **Dodano** Pretvorbe tipov: `##.expr` (Float), `###expr` (Int zaokroži), `##!expr` (Int okrni)
- **Dodano** Razdelitev niza: `str$/ delim` — vrne `Array(String)`
- **Dodano** Sestava združitve: `base$++ a b c` — doda več elementov
- **Dodano** Zanka N-krat: `@ N { }` — ponovi natanko N-krat
- **Dodano** Sintaksa označene zanke: `@:name { }`, `@:name!`, `@:name>` — nadomešča `@ @name` / `@! name`
- **Dodano** Pravila področja spremenljivk: spremenljivke `_name` imajo natančno področje bloka; `\ var` uniči prej
- **Dodano** Vzorci primerjave v ujemanju: `< 0 :`, `> 5 :`, `== 42 :` itd.
- **Dodano** Napaka E013 modula: izvršilni stavki v telesu modula so prepovedani
- **Popravljeno** `take_variable` ne poškoduje več konstant modula pri povratnem pisanju
- **Popravljeno** `alias.CONST` se zdaj pravilno razreši; `#>` se lahko pojavi po definicijah funkcij
- **VM** Polna enakost: 393/393 testov uspe

### v0.0.3 — Številčni Sistemi Unicode in Izboljšave LSP _(april 2026)_

- **Dodano** 69 blokov šifer Unicode z žetonom za preklop načina `#d0d9#`
- **Dodano** Logični literali v katerem koli sistemu — `#१` / `#०`, `#١` / `#٠` itd.
- **Dodano** Šifre Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Dodano** VM opkoda `SetNumeralMode` — polna enakost z tree-walker
- **Dodano** REPL upošteva aktivni številčni način v odmevanju in prikazu spremenljivk
- **Spremenjeno** Logični izhod `>>` zdaj vključuje predpono `#` (`#0` / `#1`) v vseh načinih

### v0.0.2_01 — Preimenovanje Operatorjev _(30. mar. 2026)_

- **Spremenjeno** `c|..|` → `#,|..|` in `e|..|` → `#^|..|` — skladno z družino predpon `#`
- **Dodano** Vzdevek izvoza: ponoven izvoz članov modula pod drugim imenom

### v0.0.2 — Prenova Zbirk in Namestitveni Programi _(24. mar. 2026)_

- **Dodano** Enotna družina operatorjev `$` za polja in nize (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Dodano** Destrukturiranje za polja, nabore in poimenovane nabore
- **Dodano** Negativni indeksi (`pol[-1]` = zadnji element)
- **Dodano** Domači namestitveni programi — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. mar. 2026)_

- **Dodano** Sestavljeno prirejanje `^=`
- **Popravljeno** Robni primeri aritmetike razčlenjevalnika; popravki dokumentacije

### v0.0.1 — Prva Javna Izdaja _(22. mar. 2026)_

- Tolmač tree-walker + registrski VM (`--vm`, ~4× hitrejši, ~95% enakost)
- Vse osnovne konstrukcije: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Polni identifikatorji Unicode, sistem modulov, lambde, zaprtja, obravnava napak
- REPL, LSP, razširitev VS Code, oblikovalnik (`zymbol fmt`)

---

_Zymbol-Lang — Simboličen. Univerzalen. Nespremenljiv._
