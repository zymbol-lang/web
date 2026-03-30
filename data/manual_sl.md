# Priročnik Zymbol-Lang

**Zymbol-Lang** je simbolični programski jezik. Nima ključnih besed — vse je simbol. Deluje enako v vsakem človeškem jeziku.

- Brez `if`, `while`, `return` — le `?`, `@`, `<~`
- Polna podpora Unicode — identifikatorji v katerem koli jeziku ali emoji
- Neodvisen od človeškega jezika — koda je identična v vseh jezikih

---

## Spremenljivke in Konstante

```zymbol
x = 10              // spremenljivka — spremenljiva
PI := 3.14159       // konstanta — napaka pri ponovni dodelitvi
ime = "Alice"
aktiven = #1        // logična resnica
👋 := "Pozdravljeni"
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

| Tip | Literal | Tag `#?` | Opomba |
|-----|---------|----------|--------|
| Int | `42`, `-7` | `###` | 64-bitni s predznakom |
| Float | `3.14`, `1.5e10` | `##.` | Znanstvena notacija OK |
| String | `"besedilo"` | `##"` | Interpolacija: `"Pozdravljeni {ime}"` |
| Char | `'A'` | `##'` | En znak Unicode |
| Bool | `#1`, `#0` | `##?` | NI številčno — `#1 ≠ 1` |
| Polje | `[1, 2, 3]` | `##]` | Homogeni elementi |
| Tuple | `(a, b)` | `##)` | Pozicijsko |
| Poimenovani Tuple | `(x: 1, y: 2)` | `##)` | Poimenovana polja |

```zymbol
// Introspekcija tipa — vrne (tip, števke, vrednost)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Izhod in Vhod

```zymbol
>> "Pozdravljeni" ¶                 // ¶ ali \\ za eksplicitno novo vrstico
>> "a=" a " b=" b ¶                 // juxtapozicija — več vrednosti
>> (arr$#) ¶                        // postfiksni operatorji zahtevajo ( )

<< ime                              // branje v spremenljivko (brez poziva)
<< "Vnesite ime: " ime              // s pozivom
```

> `¶` (AltGr+R na španski tipkovnici) in `\\` sta enakovredni novi vrstici.

---

## Operatorji

```zymbol
// Aritmetika — uporabljajte dodelitve; nekateri operatorji imajo posebnosti neposredno v >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (celoštevilsko deljenje)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potenciranje)

// Primerjava
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Nizi

```zymbol
// Tri oblike spajanja
ime = "Alice"
n = 42

msg = "Pozdravljeni ", ime, "!"            // vejica — v dodelitvah
>> "Pozdravljeni " ime " imaš " n ¶        // juxtapozicija — v >>
desc = "Pozdravljeni {ime}, imaš {n}"      // interpolacija — kjerkoli
```

```zymbol
s = "Pozdravljen Svet"
len = s$#                  // 15
sub = s$[0..10]            // "Pozdravljen"  (konec ekskluziven)
has = s$? "Svet"           // #1
deli = "a,b,c,d" / ','     // [a, b, c, d]
rep = s$~~["a":"A"]        // zamenjaj vse
rep1 = s$~~["a":"A":1]     // zamenjaj prvih N
```

> `+` je samo za številke. Za nize uporabite `,`, juxtapozicijo ali interpolacijo.

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
točke = 85
ocena = ?? točke {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ocena ¶    // → B

// Nizi
barva = "rdeča"
koda = ?? barva {
    "rdeča"  : "#FF0000"
    "zelena" : "#00FF00"
    _        : "#000000"
}

// Varuhi
temp = -5
stanje = ?? temp {
    _? temp < 0  : "led"
    _? temp < 20 : "hladno"
    _? temp < 35 : "toplo"
    _            : "vroče"
}
>> stanje ¶    // → led

// Stavčna oblika (blokovne veje)
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

@ c:"zdravo" { >> c "-" }
>> ¶                          // → z-d-r-a-v-o-  (for-each niz)

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

// Označena zanka (gnezdeno prekinjanje)
count = 0
@ @zunanja {
    count++
    ? count >= 3 { @! zunanja }
}
>> count ¶                    // → 3
```

---

## Funkcije

```zymbol
sešteti(a, b) { <~ a + b }
>> sešteti(3, 4) ¶    // → 7

faktorijel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorijel(n - 1)
}
>> faktorijel(5) ¶    // → 120
```

Funkcije imajo **izolirani obseg** — ne morejo brati zunanjih spremenljivk. Uporabite izhodne parametre `<~` za spremembo spremenljivk klicatelja:

```zymbol
zamenjati(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
zamenjati(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Poimenovane funkcije niso vrednosti prve klase. Za posredovanje kot argument: `x -> fn(x)`.

---

## Lambde in Zaprtja

```zymbol
podvojeni = x -> x * 2
vsota = (a, b) -> a + b
>> podvojeni(5) ¶    // → 10
>> vsota(3, 7) ¶     // → 10

// Blokovna lambda
klasificirati = x -> {
    ? x > 0 { <~ "pozitivno" }
    _? x < 0 { <~ "negativno" }
    <~ "nič"
}

// Zaprtje — zajame zunanji obseg
faktor = 3
potrojeni = x -> x * faktor
>> potrojeni(7) ¶    // → 21

// Tovarna
make_adder(n) { <~ x -> x + n }
dodaj10 = make_adder(10)
>> dodaj10(5) ¶    // → 15

// V poljih
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Polja

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — dostop (indeksiranje od 0)
arr[-1]         // 5 — negativni indeks (zadnji)
arr$#           // 5 — dolžina (uporabite (arr$#) v >>)

arr = arr$+ 6            // dodaj → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // vstavi na indeks 2
arr3 = arr$- 3           // odstrani prvo pojavitev vrednosti
arr4 = arr$-- 3          // odstrani vse pojavitve
arr5 = arr$-[0]          // odstrani na indeksu
arr6 = arr$-[1..3]       // odstrani obseg (konec ekskluziven)

has = arr$? 3            // #1 — vsebuje
pos = arr$?? 3           // [2] — vsi indeksi vrednosti
sl = arr$[0..3]          // [1,2,3] — rezina (konec ekskluziven)
sl2 = arr$[0:3]          // [1,2,3] — enako, sintaksa štetja

asc = arr$^+             // razvrščeno naraščajoče  (samo primitivi)
desc = arr$^-            // razvrščeno padajoče     (samo primitivi)

// Tuple polja — uporabite $^ s primerjalno lambdo
db = [(ime: "Carla", starost: 28), (ime: "Ana", starost: 25), (ime: "Bob", starost: 30)]
po_starosti = db$^ (a, b -> a.starost < b.starost)
po_imenu    = db$^ (a, b -> a.ime > b.ime)
>> po_starosti[0].ime ¶    // → Ana
>> po_imenu[0].ime ¶       // → Carla

arr[1] = 99              // posodobi na mestu
arr = arr[1]$~ 99        // funkcionalno posodabljanje — vrne novo polje
```

> Vsi operatorji zbirk vrnejo **novo polje**. Dodelite nazaj: `arr = arr$+ 4`.
> Operatorji se ne morejo verižiti — uporabite vmesne dodelitve.
> `$^+` / `$^-` razvrščata **primitivna polja** (številke, nizi). Za tuple polja uporabite `$^` s primerjalno lambdo.

```zymbol
// Gnezdena polja
matrika = [[1,2,3],[4,5,6],[7,8,9]]
>> matrika[1][2] ¶    // → 6
```

---

## Destrukturiranje

```zymbol
// Polje
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[prvi, *ostanek] = arr       // prvi=10  ostanek=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ zavrže

// Pozicijsko tuple
točka = (100, 200)
(px, py) = točka             // px=100  py=200

// Poimenovano tuple
oseba = (ime: "Ana", starost: 25, mesto: "Madrid")
(ime: i, starost: s) = oseba // i="Ana"  s=25
```

---

## Tuple

```zymbol
// Pozicijsko
točka = (10, 20)
>> točka[0] ¶    // → 10

// Poimenovano
oseba = (ime: "Alice", starost: 25)
>> oseba.ime ¶    // → Alice
>> oseba[0] ¶     // → Alice  (indeks prav tako deluje)

// Gnezdeno
pos = (x: 10, y: 20)
p = (pos: pos, oznaka: "izhodišče")
>> p.pos.x ¶        // → 10
```

---

## Funkcije Višjega Reda

> Operatorji FVR zahtevajo **inline lambdo** — neposredne lambda spremenljivke ne delujejo.

```zymbol
številke = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

podvojene  = številke$> (x -> x * 2)                // map  → [2,4,6…20]
sode       = številke$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
skupaj     = številke$< (0, (acc, x) -> acc + x)     // reduce → 55

// Veriga prek vmesnih
korak1 = številke$| (x -> x > 3)
korak2 = korak1$> (x -> x * x)
>> korak2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Poimenovane funkcije v FVR — ovijte v lambdo
podvoji(x) { <~ x * 2 }
r = številke$> (x -> podvoji(x))    // ✅
```

---

## Operator Cevovoda

Desna stran vedno zahteva `_` kot nadomestno mesto za posredovano vrednost:

```zymbol
podvoji = x -> x * 2
seštej = (a, b) -> a + b
inc = x -> x + 1

5 |> podvoji(_)      // → 10
10 |> seštej(_, 5)   // → 15
5 |> seštej(2, _)    // → 7

// Veriga
r = 5 |> podvoji(_) |> inc(_) |> podvoji(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Obravnavanje Napak

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deljenje z nič" ¶
} :! {
    >> "drugo: " _err ¶    // _err vsebuje sporočilo napake
} :> {
    >> "vedno se izvede" ¶
}
```

| Tip | Kdaj |
|-----|------|
| `##Div` | Deljenje z nič |
| `##IO` | Datoteka / sistem |
| `##Index` | Indeks izven obsega |
| `##Type` | Napaka tipa |
| `##Parse` | Razčlenjevanje podatkov |
| `##Network` | Omrežne napake |
| `##_` | Katera koli napaka (catch-all) |

---

## Moduli

```zymbol
// lib/izracun.zy
# izracun

#> { sešteti, get_PI }    // izvozi MORAJO biti pred definicijami

_PI := 3.14159
sešteti(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — neposreden dostop do konstante prek vzdevka ni podprt
```

```zymbol
// main.zy
<# ./lib/izracun <= i    // vzdevek obvezen

>> i::sešteti(5, 3) ¶    // → 8
pi = i::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Izvoz pod drugim javnim imenom
# mojalib
#> { _interno_sešteti <= vsota }

_interno_sešteti(a, b) { <~ a + b }
```

```zymbol
<# ./mojalib <= m

>> m::vsota(3, 4) ¶    // → 7  (interno ime _interno_sešteti je skrito)
```

---

## Podatkovni Operatorji

```zymbol
// Razčlenjevanje niza v število
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (varna napaka, brez izjeme)

// Zaokroževanje / okrnitev
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokroži na 2 decimalni mesti)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (okrni)

// Oblikovanje številk
fmt = #,|1234567|  // → 1.234.567  (ločeno s pikami)
sci = #^|12345.678|    // → 1.2345678e4  (znanstveni zapis)

// Osnovni literali
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

## Integracija Lupine

```zymbol
datum = <\ date +%Y-%m-%d \>     // zajame stdout (vključno z \n)
>> "Danes: " datum

datoteka = "data.txt"
vsebina = <\ cat {datoteka} \>   // interpolacija v ukazih

izhod = </"./podskript.zy"/>     // izvede drug Zymbol skript, zajame izhod
>> izhod
```

> `><` zajame argumente CLI kot polje nizov (samo tree-walker).

---

## Popoln Primer: FizzBuzz

```zymbol
klasificirati(število) {
    ? število % 15 == 0 { <~ "FizzBuzz" }
    _? število % 3  == 0 { <~ "Fizz" }
    _? število % 5  == 0 { <~ "Buzz" }
    _ { <~ število }
}

@ i:1..20 { >> klasificirati(i) ¶ }
```

---

## Referenca Simbolov

| Simbol | Operacija | Simbol | Operacija |
|--------|-----------|--------|-----------|
| `=` | spremenljivka | `$#` | dolžina |
| `:=` | konstanta | `$+` | dodaj |
| `>>` | izhod | `$+[i]` | vstavi na indeks |
| `<<` | vhod | `$-` | odstrani prvo pojavitev |
| `¶` / `\\` | nova vrstica | `$--` | odstrani vse pojavitve |
| `?` | če | `$-[i]` | odstrani na indeksu |
| `_?` | sicer-če | `$-[i..j]` | odstrani obseg |
| `_` | sicer / nadomestek | `$?` | vsebuje |
| `??` | ujemanje | `$??` | najdi vse indekse |
| `@` | zanka | `$[s..e]` | rezina |
| `@!` | prekini | `$>` | preslikava |
| `@>` | nadaljuj | `$\|` | filtriranje |
| `->` | lambda | `$<` | redukcija |
| `$^+` | razvrsti naraščajoče (primitivi) | `$^-` | razvrsti padajoče (primitivi) |
| `$^` | razvrsti s primerjavo (tuple) | | |
| `<~` | vrni | `!?` | poskusi |
| `\|>` | cevovod | `:!` | ujemi |
| `#1` | resnica | `:>` | na koncu |
| `#0` | neresnica | `$!` | je napaka |
| `<#` | uvozi | `$!!` | razširi napako |
| `#` | deklariraj modul | `#>` | izvozi |
| `::` | klic modula | `.` | dostop do polja |
| `#\|..\|` | razčleni število | `#?` | metapodatki tipa |
| `#.N\|..\|` | zaokroži | `#!N\|..\|` | okrni |
| `c\|..\|` | format z ločilom | `e\|..\|` | znanstveni |
| `<\ ..\>` | izvedi lupino | `><` | argumenti CLI |

---

*Zymbol-Lang — Simboličen. Univerzalen. Nespremenljiv.*

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
