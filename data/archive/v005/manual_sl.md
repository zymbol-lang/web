> **Opozorilo:** Ta dokumentacija je bila ustvarjena in prevedena z umetno inteligenco (UI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Priročnik Zymbol-Lang

> **Pregledano za v0.0.5 — 2026-05-12**

**Zymbol-Lang** je simbolični programski jezik. Brez ključnih besed — vse je simbol. Deluje enako v vsakem človeškem jeziku.

- Brez `if`, `while`, `return` — samo `?`, `@`, `<~`
- Polni Unicode — identifikatorji v katerem koli jeziku ali emojiju
- Neodvisen od človeškega jezika — koda je povsod enaka

**Različica tolmača**: v0.0.5 | **Pokritost s testi**: 436/436 (TW ↔ VM paritetnost)

---

## Spremenljivke in Konstante

```zymbol
x = 10              // spremenljivka
PI := 3.14159       // konstanta — ponovna dodelitev je napaka med izvajanjem
ime = "Alica"
aktiven = #1        // logična resnica
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

`°` (znak stopinje, U+00B0) samodejno inicializira spremenljivko na njeno nevtralno vrednost ob prvi uporabi:

```zymbol
stevila = [3, 1, 4, 1, 5]
@ n:stevila {
    °skupaj += n    // samodejno inicializira na 0 pred zanko; dostopno po @
}
>> skupaj ¶         // → 14
```

> `°x` (predpona) zasidra nad zanko — rezultat je dostopen po `@`.
> `x°` (pripona) zasidra znotraj zanke — izgine ko se zanka konča.
> Samo tree-walker.

---

## Podatkovni Tipi

| Tip | Literal | Oznaka `#?` | Opombe |
|-----|---------|-------------|--------|
| Celo | `42`, `-7` | `###` | 64-bitno s predznakom |
| Decimalno | `3.14`, `1.5e10` | `##.` | Znanstvena notacija OK |
| Niz | `"besedilo"` | `##"` | Interpolacija: `"Pozdrav {ime}"` |
| Znak | `'A'` | `##'` | En znak Unicode |
| Logično | `#1`, `#0` | `##?` | NI število — `#1 ≠ 1` |
| Polje | `[1, 2, 3]` | `##]` | Homogeni elementi |
| Terka | `(a, b)` | `##)` | Pozicijska |
| Poimenovana Terka | `(x: 1, y: 2)` | `##)` | Poimenovana polja |
| Funkcija | poimenovana referenca | `##()` | Prvega reda; prikaže `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prvega reda; prikaže `<lambd/N>` |

```zymbol
// Introspekacija tipa — vrne (tip, števke, vrednost)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Izhod in Vhod

```zymbol
>> "Pozdrav" ¶                    // ¶ ali \\ za izrecno novo vrstico
>> "a=" a " b=" b ¶               // juxtapozicija — več vrednosti
>> (polje$#) ¶                    // priponski operatorji zahtevajo ( ) v >>

<< ime                            // branje v spremenljivko (brez poziva)
<< "Vnesite ime: " ime            // s pozivom
```

> `¶` (AltGr+R na španski tipkovnici) in `\\` sta enakovredni novi vrstici.

---

## TUI Primitivi

Terminalni UI operatorji za interaktivne programe. Večina zahteva blok `>>| { }` (alternativni zaslon + neposredni način).

```zymbol
>>| {
    >>!                             // brisanje alternativnega zaslona
    >>~ (1, 1, 0, 10) > "Deluje"   // vrstica 1, stolpec 1, fg=10 (zelena)
    @~ 1000                         // premor 1 sekunda (1000 ms)
    >>~ (2, 1) > "Končano."
}
// terminal samodejno obnovljen ob izhodu
```

```zymbol
// Pritisk tipke in velikost terminala
>>| {
    [vrstice, stolpci] = >>?              // poizvedba o dimenzijah terminala
    >>~ (1, 1) > "Terminal: " vrstice " x " stolpci
    <<| tipka                              // blokirajoče branje tipke
    >>~ (2, 1) > "Pritisnjeno: " tipka
}
```

> `>>!` izbriše zaslon. `>>?` vrne `[vrstice, stolpci]`. `@~ N` spi N milisekund.
> `<<|` prebere en pritisk tipke (blokirajoče); `<<|?` preverja brez blokiranja (vrne `'\0'` če ni).
> Terka pozicioniranega izhoda: `(vrstica, stolpec, SDM, fg, bg)` — kateri koli reža se lahko izpusti z vejico (`>>~ (,,, 196) > "rdeča"`).
> Maska SDM: `1`=Krepko, `2`=Poševno, `4`=Podčrtano. Paleta ANSI 256 barv (`0`=privzeti terminal).
> Samo tree-walker (razen `>>!`, `>>?`, `@~`, `>>~`, ki delujejo tudi z `--vm`).

---

## Operatorji

```zymbol
// Aritmetika
a = 10
b = 3
v1 = a + b    // 13
v2 = a - b    // 7
v3 = a * b    // 30
v4 = a / b    // 3  (celoštevilsko deljenje)
v5 = a % b    // 1
v6 = a ^ b    // 1000  (potenciranje)

// Primerjava — dodelitev za preveritev
p1 = a == b    // #0
p2 = a <> b    // #1
p3 = a < b     // #0
p4 = a <= b    // #0
p5 = a > b     // #1
p6 = a >= b    // #1

// Logično
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Nizi

```zymbol
// Dve obliki stikanja
ime = "Alica"
n = 42

>> "Pozdrav " ime " imaš " n ¶    // juxtapozicija — v >>
opis = "Pozdrav {ime}, imaš {n}"  // interpolacija — kjer koli
```

```zymbol
s = "Pozdrav Svet"
dolzina = s$#                  // 11
pod = s$[1..7]                 // "Pozdrav"  (1-osnovno, konec vključen)
ima = s$? "Svet"               // #1
deli = "a,b,c,d"$/ ','         // [a, b, c, d]  (razdelitev z ločilom)
zam = s$~~["a":"A"]            // zamenjava
zam1 = s$~~["a":"A":1]         // samo prvih N
vrstica = "─" $* 20            // "────────────────────"  (ponavljanje N krat)
```

> `+` je samo za števila. Za nize uporabite `,`, juxtapozicijo ali interpolacijo.

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

> Zaviti oklepaji `{ }` so **obvezni** tudi za en stavek.

---

## Ujemanje

```zymbol
// Obsegi
tocke = 85
ocena = ?? tocke {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> ocena ¶    // → B

// Nizi
barva = "rdeča"
koda = ?? barva {
    "rdeča"   => "#FF0000"
    "zelena"  => "#00FF00"
    _         => "#000000"
}

// Vzorci primerjave
temp = -5
stanje = ?? temp {
    < 0  => "led"
    < 20 => "hladno"
    < 35 => "toplo"
    _    => "vroče"
}
>> stanje ¶    // → led

// Stavčna oblika (blokovske veje)
n = -3
?? n {
    0    => { >> "nič" ¶ }
    < 0  => { >> "negativno" ¶ }
    _    => { >> "pozitivno" ¶ }
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
@ s:sadje { >> s ¶ }          // for-each polje

@ c:"pozd" { >> c "-" }
>> ¶                          // → p-o-z-d-  (for-each niz)

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
>> stevec ¶                   // → 3
```

---

## Funkcije

```zymbol
sestej(a, b) { <~ a + b }
>> sestej(3, 4) ¶    // → 7

faktorjel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorjel(n - 1)
}
>> faktorjel(5) ¶    // → 120
```

Funkcije imajo **izoliran obseg** — ne morejo brati zunanjih spremenljivk. Uporabite izhodne parametre `<~` za spremembo spremenljivk klicatelja:

```zymbol
zamenjaj(a<~, b<~) {
    zac = a
    a = b
    b = zac
}
x = 10
y = 20
zamenjaj(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Poimenovane funkcije so **vrednosti prvega reda** — posredujte neposredno: `stevila$> podvoji`. Za ovijanje: `x -> fn(x)` je prav tako veljavno.

---

## Lambde in Zaprtja

```zymbol
podvoji = x -> x * 2
vsota = (a, b) -> a + b
>> podvoji(5) ¶    // → 10
>> vsota(3, 7) ¶   // → 10

// Blokovna lambda
klasificiraj = x -> {
    ? x > 0 { <~ "pozitivno" }
    _? x < 0 { <~ "negativno" }
    <~ "nič"
}

// Zaprtje — zajame zunanji obseg
faktor = 3
potrojи = x -> x * faktor
>> potrojи(7) ¶    // → 21

// Tovarna
ustvari_sestevac(n) { <~ x -> x + n }
pristej10 = ustvari_sestevac(10)
>> pristej10(5) ¶    // → 15

// V poljih
operacije = [x -> x+1, x -> x*2, x -> x*x]
>> operacije[3](5) ¶    // → 25
```

---

## Polja

Polja so **spremenljiva** in vsebujejo elemente **istega tipa**.

```zymbol
polje = [1, 2, 3, 4, 5]

x = polje[1]      // 1 — dostop (1-osnovno: prvi element)
x = polje[-1]     // 5 — negativni indeks (zadnji element)
x = polje$#       // 5 — dolžina (uporabite (polje$#) v >>)

polje = polje$+ 6            // dodajanje → [1,2,3,4,5,6]
polje2 = polje$+[2] 99       // vstavljanje na položaj 2 (1-osnovno)
polje3 = polje$- 3           // odstranitev prvega pojavljanja vrednosti
polje4 = polje$-- 3          // odstranitev vseh pojavljanj
polje5 = polje$-[1]          // odstranitev na indeksu 1 (prvi element)
polje6 = polje$-[2..3]       // odstranitev obsega (1-osnovno, konec vključen)

ima = polje$? 3              // #1 — vsebuje
poz = polje$?? 3             // [3] — vsi indeksi vrednosti (1-osnovno)
rez = polje$[1..3]           // [1,2,3] — rezina (1-osnovno, konec vključen)
rez2 = polje$[1:3]           // [1,2,3] — enako, sintaksa s številom

nara = polje$^+              // razvrščeno naraščajoče (samo primitivni)
pada = polje$^-              // razvrščeno padajoče (samo primitivni)

// Polja poimenovanih/pozicijskih terk — uporabite $^ z lambda komparatorjem
bp = [(ime: "Karla", sta: 28), (ime: "Ana", sta: 25), (ime: "Bob", sta: 30)]
po_starosti = bp$^ (a, b -> a.sta < b.sta)    // naraščajoče po starosti  (<)
po_imenu    = bp$^ (a, b -> a.ime > b.ime)    // padajoče po imenu (>)
>> po_starosti[1].ime ¶     // → Ana
>> po_imenu[1].ime ¶        // → Karla

// Neposredna posodobitev elementa (samo polja)
polje[1] = 99              // dodelitev
polje[2] += 5              // sestavljeno: +=  -=  *=  /=  %=  ^=

// Funkcionalna posodobitev — vrne novo polje; izvirnik nespremenjen
polje2 = polje[2]$~ 99
```

> Vsi operatorji zbirk vrnejo **novo polje**. Dodelite nazaj: `polje = polje$+ 4`.
> `$+` se lahko verižno poveže: `polje = polje$+ 5$+ 6$+ 7`. Drugi operatorji uporabljajo vmesne dodelitve.
> **Indeksiranje je 1-osnovno**: `polje[1]` je prvi element; `polje[0]` je napaka med izvajanjem.
> `$^+` / `$^-` razvrščata **primitivna polja** (števila, nizi). Za polja terk uporabite `$^` z lambda komparatorjem — smer je kodirana v lambdi (`<` = naraščajoče, `>` = padajoče).

**Semantika vrednosti** — dodelitev polja drugi spremenljivki ustvari neodvisno kopijo:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ni prizadeto
```

```zymbol
// Gnezdena polja (1-osnovno indeksiranje)
matrika = [[1,2,3],[4,5,6],[7,8,9]]
>> matrika[2][3] ¶    // → 6  (vrstica 2, stolpec 3)
```

---

## Destrukturiranje

```zymbol
// Polje
polje = [10, 20, 30, 40, 50]
[a, b, c] = polje              // a=10  b=20  c=30
[prvi, *ostalo] = polje        // prvi=10  ostalo=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ zavrže

// Pozicijska terka
tocka = (100, 200)
(tx, ty) = tocka               // tx=100  ty=200

// Poimenovana terka
oseba = (ime: "Ana", sta: 25, mesto: "Ljubljana")
(ime: i, sta: s) = oseba       // i="Ana"  s=25
```

---

## Terke

Terke so **nespremenljivi** urejeni vsebniki, ki lahko vsebujejo vrednosti **različnih tipov**.
Za razliko od polj elementov ni mogoče spremeniti po ustvarjanju.

```zymbol
// Pozicijske — dovoljeni mešani tipi
tocka = (10, 20)
>> tocka[1] ¶    // → 10

podatki = (42, "pozdrav", #1, 3.14)
>> podatki[3] ¶  // → #1

// Poimenovane
oseba = (ime: "Alica", sta: 25)
>> oseba.ime ¶    // → Alica
>> oseba[1] ¶     // → Alica  (indeks prav tako deluje, 1-osnovno)

// Gnezdene
poz = (x: 10, y: 20)
p = (poz: poz, oznaka: "zacetek")
>> p.poz.x ¶      // → 10
```

**Nespremenljivost** — vsak poskus spremembe elementa terke je napaka med izvajanjem:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ napaka med izvajanjem: terke so nespremenljive
// t[1] += 5    // ❌ ista napaka
```

Za pridobitev spremenjene vrednosti uporabite `$~` (funkcionalna posodobitev) — vrne **novo** terko:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← izvirnik nespremenjen
>> t2 ¶    // → (10, 999, 30)

// Poimenovana terka — eksplicitna rekonstrukcija
oseba = (ime: "Alica", sta: 25)
starejsa = (ime: oseba.ime, sta: 26)
>> oseba.sta ¶    // → 25
>> starejsa.sta ¶ // → 26
```

---

## Funkcije Višjega Reda

```zymbol
stevila = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

podvojena  = stevila$> (x -> x * 2)                // map  → [2,4,6…20]
soda       = stevila$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
skupaj     = stevila$< (0, (akum, x) -> akum + x)  // reduce → 55

// Veriženje prek vmesnih
korak1 = stevila$| (x -> x > 3)
korak2 = korak1$> (x -> x * x)
>> korak2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Poimenovane funkcije se lahko neposredno posredujejo HOF
podvoji(x) { <~ x * 2 }
je_veliko(x) { <~ x > 5 }
v = stevila$> podvoji    // ✅ neposredna referenca
v = stevila$| je_veliko  // ✅ neposredna referenca
```

---

## Operator Cevovoda

Desna stran vedno zahteva `_` kot nadomestni znak za posredovano vrednost:

```zymbol
podvoji = x -> x * 2
pristej = (a, b) -> a + b
povecaj = x -> x + 1

v1 = 5 |> podvoji(_)          // → 10
v2 = 10 |> pristej(_, 5)      // → 15
v3 = 5 |> pristej(2, _)       // → 7

// Veriženo
v = 5 |> podvoji(_) |> povecaj(_) |> podvoji(_)
>> v ¶    // → 22  (5→10→11→22)
```

---

## Obvladovanje Napak

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deljenje z nič" ¶
} :! {
    >> "drugo: " _err ¶    // _err vsebuje sporočilo o napaki
} :> {
    >> "vedno se izvede" ¶
}
```

| Tip | Kdaj |
|-----|------|
| `##Div` | Deljenje z nič |
| `##IO` | Datoteka / sistem |
| `##Index` | Indeks izven meja |
| `##Type` | Neusklajenost tipov |
| `##Parse` | Razčlenjevanje podatkov |
| `##Network` | Omrežne napake |
| `##_` | Katera koli napaka (catch-all) |

---

## Moduli

```zymbol
// lib/calc.zy — telo modula je zaprto v zavite oklepaje
# calc {
    #> { sestej, pridobi_PI }

    _PI := 3.14159
    sestej(a, b) { <~ a + b }
    pridobi_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => k    // vzdevek je obvezen

>> k::sestej(5, 3) ¶     // → 8
pi = k::pridobi_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Izvoz z drugim javnim imenom
# mojalib {
    #> { _notranja_sestej => vsota }

    _notranja_sestej(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib => m

>> m::vsota(3, 4) ¶    // → 7  (notranje ime _notranja_sestej je skrito)
```

> **Pravila modula**: samo `#>`, definicije funkcij in literalni inicializatorji spremenljivk/konstant so dovoljeni znotraj `# ime { }`. Izvršilni stavki (`>>`, `<<`, zanke itd.) povzročijo napako E013.

---

## Številčni Načini

Zymbol lahko prikazuje števila v **69 skriptah številk Unicode** — Devanagari, Arabsko-Indijsko, Tajsko, Klingonski pIqaD, Matematično krepko, LCD segmenti in več. Aktivni način vpliva samo na `>>` izhod; notranja aritmetika je vedno binarna.

### Aktiviranje skripte

Zapišite številki `0` in `9` ciljne skripte zaprte v `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabsko-Indijsko (U+0660–U+0669)
#๐๙#    // Tajsko       (U+0E50–U+0E59)
#09#    // ponastavitev na ASCII
```

### Izhod in logične vrednosti

```zymbol
x = 42
>> x ¶          // → 42   (ASCII privzeto)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimalna pika je vedno ASCII)
>> 1 + 2 ¶      // → ३

// Logično: predpona # je vedno ASCII, številka se prilagodi
>> #1 ¶         // → #१   (resnica v Devanagari)
>> #0 ¶         // → #०   (laž — različno od ०  celo število nič)

x = 28 > 4
>> x ¶          // → #१   (rezultat primerjave sledi aktivnemu načinu)
```

### Domači literali številk v izvorni kodi

Številke katere koli podprte skripte so veljavni literali — v obsegih, modulo, primerjavah:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logični literali v kateri koli skripti

`#` + številka `0` ali `1` iz katerega koli bloka je veljaven logični literal:

```zymbol
#٠٩#
aktiven = #١        // enako kot #1
>> aktiven ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` je **vedno ASCII**. `#0` (laž) je vedno vizualno različno od `0` (celo število nič) v vsaki skripti.

---

## Operatorji Podatkov

```zymbol
// Pretvorbe tipov
f = ##.42         // → 42.0  (v Decimalno)
i = ###3.7        // → 4     (v Celo, zaokroži)
t = ##!3.7        // → 3     (v Celo, okrni)

// Razčlenjevanje niza v število
v1 = #|"42"|      // → 42  (Celo)
v2 = #|"3.14"|    // → 3.14  (Decimalno)
v3 = #|"abc"|     // → "abc"  (varna neuspešnost, brez napake)

// Zaokroži / okrni
pi = 3.14159265
v2 = #.2|pi|      // → 3.14  (zaokroži na 2 decimalni mesti)
v4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (okrnitev)

// Oblikovanje števil
fmt = #,|1234567|  // → 1,234,567  (ločeno z vejicami)
zna = #^|12345.678|    // → 1.2345678e4  (znanstvena notacija)

// Literali osnov
a = 0x41         // → 'A'  (šestnajstiško)
b = 0b01000001   // → 'A'  (dvojiško)
c = 0o101        // → 'A'  (osmiško)

// Izhod pretvorbe osnove
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracija Lupine

```zymbol
datum = <\ date +%Y-%m-%d \>     // zajame stdout (vključno s končnim \n)
>> "Danes: " datum

datoteka = "podatki.txt"
vsebina = <\ cat {datoteka} \>   // interpolacija v ukazih

izhod = </"./podskript.zy"/>     // izvede drug Zymbol skript, zajame izhod
>> izhod
```

> `><` zajame argumente CLI kot polje nizov (samo tree-walker).

---

## Popoln Primer: FizzBuzz

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
| `:=` | konstanta | `$+` | dodajanje (verižno) |
| `>>` | izhod | `$+[i]` | vstavljanje na indeks (1-osnovno) |
| `<<` | vhod | `$-` | odstranitev prvega po vrednosti |
| `¶` / `\\` | nova vrstica | `$--` | odstranitev vseh po vrednosti |
| `?` | če | `$-[i]` | odstranitev na indeksu (1-osnovno) |
| `_?` | sicer-če | `$-[i..j]` | odstranitev obsega (1-osnovno) |
| `_` | sicer / vzorec | `$?` | vsebuje |
| `??` | ujemanje | `$??` | iskanje vseh indeksov (1-osnovno) |
| `@` | zanka | `$[s..e]` | rezina (1-osnovno) |
| `@ N { }` | zanka N krat | `$>` | map |
| `@!` | prekinitev | `$\|` | filter |
| `@>` | nadaljuj | `$<` | reduce |
| `@:ime { }` | označena zanka | `$/ locilo` | razdelitev niza |
| `@:ime!` | prekini označeno | `$++ a b c` | stikanje |
| `@:ime>` | nadaljuj označeno | `polje[i>j>k]` | navigacijski indeks |
| `->` | lambda | `polje[i] = vred` | posodobitev elementa (samo polja) |
| `polje[i] += vred` | sestavljeno posodob. | `polje[i]$~` | funkcionalna posodob. (nova kopija) |
| `$^+` | razvrščanje naraščajoče (primit.) | `$^-` | razvrščanje padajoče (primit.) |
| `$^` | razvrščanje s komparatorjem (terke) | `<~` | vrnitev |
| `\|>` | cevovod | `!?` | poskus |
| `:!` | ujemanje napak | `:>` | na koncu |
| `#1` | resnica | `#0` | laž |
| `$!` | je napaka | `$!!` | razširjanje napake |
| `<#` | uvoz | `#>` | izvoz |
| `#` | deklaracija modula | `::` | klic modula |
| `.` | dostop do polja | `#?` | metapodatki tipa |
| `#\|..\|` | razčlenjevanje števila | `##.` | pretvorba v Decimalno |
| `###` | pretvorba v Celo (zaokr.) | `##!` | pretvorba v Celo (okrn.) |
| `#.N\|..\|` | zaokroževanje | `#!N\|..\|` | okrnitev |
| `#,\|..\|` | oblika z vejicami | `#^\|..\|` | znanstvena notacija |
| `#d0d9#` | preklop številčnega načina | `#09#` | ponastavitev na ASCII |
| `<\ ..\>` | izvedba lupine | `>\<` | argumenti CLI |
| `\ spr` | eksplicitno uničenje | `°x` / `x°` | vroča definicija (avto-init) |
| `>>|` | TUI blok (alt. zaslon) | `>>~` | pozicionirani izhod |
| `>>!` | brisanje zaslona | `>>?` | poizvedba o velikosti terminala |
| `<<\|` | blokirajuča tipka | `<<\|?` | neblokirajuča tipka |
| `@~ N` | spanje N milisekund | `$*` | ponavljanje niza N krat |

---

## Dnevnik Sprememb

### v0.0.5 — TUI Primitivi, Vroča Definicija in Ponavljanje Niza _(maj 2026)_

- **Sprememba** Ločevalnik veje ujemanja: `vzorec : rezultat` → `vzorec => rezultat`
- **Sprememba** Vzdevek uvoza: `<# pot <= vzdevek` → `<# pot => vzdevek`
- **Sprememba** Preimenovanje pri izvozu: `#> { fn <= pub }` → `#> { fn => pub }`
- **Dodano** TUI blok `>>| { }` — alternativni zaslon + neposredni način; počisti ob izhodu
- **Dodano** Pozicionirani izhod `>>~ (vrstica, stolpec, SDM, fg, bg) > elementi` — redke reže, 256-barvni ANSI
- **Dodano** Vhod tipke `<<| spr` (blokirajoče) in `<<|? spr` (neblokirajoče spraševanje)
- **Dodano** `>>!` brisanje, `>>?` poizvedba o velikosti, `@~ N` spanje N milisekund
- **Dodano** Vroča definicija `°x` / `x°` — samodejno inicializira ob prvi uporabi v zankah
- **Dodano** Ponavljanje niza `niz $* N` — ponovi niz N krat
- **VM** Paritetnost: 436/436 testov prestane

### v0.0.4 — 1-Osnovno Indeksiranje, Funkcije Prvega Reda in Bloki Modulov _(april 2026)_

- **Sprememba** Celotno indeksiranje preklopi na **1-osnovno** — `polje[1]` je prvi element; `polje[0]` je napaka
- **Dodano** Poimenovane funkcije so **vrednosti prvega reda** — posredujte neposredno HOF: `stevila$> podvoji`
- **Dodano** Obvezna **blokovna sintaksa** modulov: `# ime { ... }` — ploska sintaksa odstranjena
- **Dodano** Večdimenzionalno indeksiranje: `polje[i>j>k]` (navigacija), `polje[p ; q]` (plosko ekstrakcija)
- **Dodano** Pretvorbe tipov: `##.izr` (Decimalno), `###izr` (Celo zaokr.), `##!izr` (Celo okrn.)
- **Dodano** Razdelitev niza: `niz$/ locilo` — vrne `Array(String)`
- **Dodano** Stikanje: `osnova$++ a b c` — doda več elementov
- **Dodano** Zanka N krat: `@ N { }` — ponovi natanko N krat
- **Dodano** Sintaksa označene zanke: `@:ime { }`, `@:ime!`, `@:ime>` — nadomešča `@ @ime` / `@! ime`
- **Dodano** Pravila obsega spremenljivk: `_ime` ima natančen blokovski obseg; `\ spr` uniči zgodaj
- **Dodano** Vzorci primerjave v ujemanju: `< 0 :`, `> 5 :`, `== 42 :` itd.
- **Dodano** Napaka E013 modula: izvršilni stavki v telesu modula so prepovedani
- **Popravljeno** `take_variable` ne pokvari več konstant modula pri povrnitvi
- **Popravljeno** `vzdevek.CONST` se zdaj pravilno razreši; `#>` se lahko pojavi za definicijami funkcij
- **VM** Polna paritetnost: 393/393 testov prestane

### v0.0.3 — Številčni Sistemi Unicode in Izboljšave LSP _(april 2026)_

- **Dodano** 69 blokov številk Unicode s preklopnim žetonom `#d0d9#`
- **Dodano** Logični literali v kateri koli skripti — `#१` / `#०`, `#١` / `#٠` itd.
- **Dodano** Klingonske številke pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Dodano** Operacijska koda VM `SetNumeralMode` — polna paritetnost s tree-walker
- **Sprememba** REPL spoštuje aktivni številčni način pri odmevanju in prikazovanju spremenljivk
- **Sprememba** Izhod `>>` za logične vrednosti zdaj vključuje predpono `#` (`#0` / `#1`) v vseh načinih

### v0.0.2_01 — Preimenovanje Operatorja _(30 mar 2026)_

- **Sprememba** `c|..|` → `#,|..|` in `e|..|` → `#^|..|` — skladno z družino predpone `#`
- **Dodano** Vzdevek izvoza: ponoven izvoz članov modula pod drugim imenom

### v0.0.2 — Preoblikovanje API Zbirk in Namestitveni Programi _(24 mar 2026)_

- **Dodano** Poenotena družina operatorjev `$` za polja in nize (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Dodano** Destrukturiranje za polja, terke in poimenovane terke
- **Dodano** Negativni indeksi (`polje[-1]` = zadnji element)
- **Dodano** Domači namestitveni programi — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 mar 2026)_

- **Dodano** Sestavljeno prirejanje `^=`
- **Popravljeno** Robni primeri aritmetike razčlenjevalnika; popravki dokumentacije

### v0.0.1 — Prva Javna Izdaja _(22 mar 2026)_

- Tolmač tree-walker + registrski VM (`--vm`, ~4× hitrejši, ~95% paritetnost)
- Vse temeljne konstrukte: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Polni identifikatorji Unicode, modulski sistem, lambde, zaprtja, obvladovanje napak
- REPL, LSP, razširitev VS Code, oblikovalnik (`zymbol fmt`)

---

_Zymbol-Lang — Simboličen. Univerzalen. Nespremenljiv._
