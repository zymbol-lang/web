> **Ohar garrantzitsua:** Dokumentazio hau adimen artifizialaren (AI) laguntzaz sortu da.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Erreferentzia kanonikoa **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** da interpretearen biltegian.

---

# Zymbol-Lang-en Eskuliburua

**Zymbol-Lang** programazio lengoaia sinbolikoa da. Ez dago gako-hitzik — dena sinboloa da. Edozein gizaki hizkuntzatan berdin funtzionatzen du.

- Ez dago `if`-rik, `while`-rik, `return`-ik — bakarrik `?`, `@`, `<~`
- Unicode osoa — identifikatzaileak edozein hizkuntzatan edo emojitan
- Giza hizkuntzarekiko agnostikoa — kodea berdina da leku guztietan

**Interpretearen bertsioa**: v0.0.4 | **Test estaldura**: 393/393 (TW ↔ VM parekotasuna)

---

## Aldagaiak eta konstanteak

```zymbol
x = 10              // aldaera aldakorra
PI := 3.14159       // konstantea — berresleitzea exekuzio errorea da
izena = "Alizia"
aktibo = #1         // boolear egia
👋 := "Kaixo"
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

---

## Datu motak

| Mota | Literala | `#?` etiketa | Oharrak |
|------|---------|----------|-------|
| Zenbaki osoa | `42`, `-7` | `###` | 64 biteko sinoduna |
| Zenbaki hamartarra | `3.14`, `1.5e10` | `##.` | Notazio zientifiko onartuta |
| Katea | `"testua"` | `##"` | Interpolazioa: `"Kaixo {izena}"` |
| Karakterea | `'A'` | `##'` | Unicode karaktere bakarra |
| Boolearra | `#1`, `#0` | `##?` | EZ da zenbakia — `#1 ≠ 1` |
| Array-a | `[1, 2, 3]` | `##]` | Elementu homogeneoak |
| Tupla | `(a, b)` | `##)` | Posizionala |
| Izeneko tupla | `(x: 1, y: 2)` | `##)` | Izeneko eremuak |
| Funtzioa | izendun funtzio erreferenzia | `##()` | Lehen mailakoa; `<funct/N>` bistaratzen du |
| Lambda | `x -> x * 2` | `##->` | Lehen mailakoa; `<lambd/N>` bistaratzen du |

```zymbol
// Mota introspekzioa — itzultzen du (mota, digituak, balioa)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Irteera eta sarrera

```zymbol
>> "Kaixo" ¶                       // ¶ edo \\ lerro jauzi espliziturako
>> "a=" a " b=" b ¶               // elkartzea — balio anitz
>> (arr$#) ¶                      // postfix eragileek ( ) behar dute >> barruan

<< izena                           // aldagaira irakurri (gonbipenik gabe)
<< "Sartu izena: " izena            // gonbipenarekin
```

> `¶` (AltGr+R teklatu espainolean) eta `\\` berdinak dira lerro jauzi gisa.

---

## Eragileak

```zymbol
// Aritmetika — esleipenak erabili; eragile batzuek berezitasunak dituzte >> zuzenean
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (zatiketa osoa)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (berretura)

// Konparazioa
a == b    // #0    
a <> b    // #1    
a < b    // #0
a <= b    // #0   
a > b     // #1    
a >= b   // #1

// Logikoa
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Kateak

```zymbol
// Bi elkartze modu
izena = "Alizia"
n = 42

>> "Kaixo " izena " " n " dituzu" ¶       // elkartzea — >> barruan
desc = "Kaixo {izena}, {n} dituzu"        // interpolazioa — edozein lekutan
```

```zymbol
s = "Kaixo Mundua"
luz = s$#                  // 11 (edo 12 kontu)
sub = s$[1..5]             // "Kaixo" (1-oinarria, amaiera barne)
badauka = s$? "Mundua"     // #1
zatiak = "a,b,c,d"$/ ','   // [a, b, c, d]  (zatitu mugatzaileaz)
rep = s$~~["o":"0"]        // "Kai0 Mundua"
rep1 = s$~~["o":"0":1]     // "Kai0 Mundo"  (lehen N bakarrik)
```

> `+` zenbakientzat bakarrik da. Erabili `,`, elkartzea edo interpolazioa kateentzat.

---

## Kontrol fluxua

```zymbol
x = 7

? x > 0 { >> "positiboa" ¶ }

? x > 100 {
    >> "handia" ¶
} _? x > 0 {
    >> "positiboa" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negatiboa" ¶
}
```

> `{ }` giltzak **beharrezkoak** dira adierazpen bakarra izan arren.

---

## Match

```zymbol
// Tarteak
puntuazioa = 85
nota = ?? puntuazioa {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nota ¶    // → B

// Kateak
kolorea = "gorria"
kodea = ?? kolorea {
    "gorria" : "#FF0000"
    "berdea" : "#00FF00"
    _        : "#000000"
}

// Konparazio ereduak
tenp = -5
egoera = ?? tenp {
    < 0  : "izotza"
    < 20 : "hotza"
    < 35 : "epela"
    _    : "beroa"
}
>> egoera ¶    // → izotza

// Adierazpen forma (blokeak)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negatiboa" ¶ }
    _        : { >> "positiboa" ¶ }
}
```

---

## Begiztak

```zymbol
@ i:0..4  { >> i " " }        // tarte inklusiboa:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pausoarekin:       1 3 5 7 9
@ i:5..0:1 { >> i " " }       // alderantziz:       5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (bitartean)

fruitak = ["sagarra", "udarea", "mahatsa"]
@ f:fruitak { >> f ¶ }        // bakoitzeko

@ c:"kaixo" { >> c "-" }
>> ¶                          // → k-a-i-x-o-  (karaktere bakoitzeko)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jarraitu
    ? i > 7 { @! }            // @! hautsi
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Begizta infinitua
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Etiketadun begizta (habiaratua hautsi)
kont = 0
@:kanpokoa {
    kont++
    ? kont >= 3 { @:kanpokoa! }
}
>> kont ¶                     // → 3
```

---

## Funtzioak

```zymbol
batu(a, b) { <~ a + b }
>> batu(3, 4) ¶    // → 7

faktoriala(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriala(n - 1)
}
>> faktoriala(5) ¶    // → 120
```

Funtzioek **isolatutako eskopea** dute — ezin dituzte kanpoko aldagaiak irakurri. Erabili irteera parametroak `<~` deitzailearen aldagaiak aldatzeko:

```zymbol
trukatu(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
trukatu(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Izeneko funtzioak **lehen mailako balioak** dira — zuzenean pasa daitezke: `nums$> bikoiztu`. `x -> fn(x)` ere balio du.

---

## Lambdak eta itxiurak

```zymbol
bikoiztu = x -> x * 2
batu = (a, b) -> a + b
>> bikoiztu(5) ¶    // → 10
>> batu(3, 7) ¶     // → 10

// Bloke lambda
sailkatu = x -> {
    ? x > 0 { <~ "positiboa" }
    _? x < 0 { <~ "negatiboa" }
    <~ "zero"
}

// Itxiura — kanpoko eskopea harrapatzen du
faktorea = 3
hirukoiztu = x -> x * faktorea
>> hirukoiztu(7) ¶    // → 21

// Fabrika
sortu_batugailua(n) { <~ x -> x + n }
batu10 = sortu_batugailua(10)
>> batu10(5) ¶        // → 15

// Array-etan
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶        // → 25
```

---

## Array-ak

Array-ak **aldakorrak** dira eta **mota bereko** elementuak dituzte.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — sarrera (1-oinarria: lehen elementua)
arr[-1]         // 5 — indize negatiboa (azken elementua)
arr$#           // 5 — luzera (erabili (arr$#) >> barruan)

arr = arr$+ 6            // atxiki → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // txertatu 2. posizioan (1-oinarria)
arr3 = arr$- 3           // kendu balioaren lehen agerpena
arr4 = arr$-- 3          // kendu agerpen guztiak
arr5 = arr$-[1]          // kendu indize 1ean (lehen elementua)
arr6 = arr$-[2..3]       // kendu tartea (1-oinarria, amaiera barne)

badauka = arr$? 3        // #1 — badu
pos = arr$?? 3           // [3] — balioaren indize guztiak (1-oinarria)
sl = arr$[1..3]          // [1,2,3] — zati (1-oinarria, amaiera barne)
sl2 = arr$[1:3]          // [1,2,3] — berdina, kopuruaren sintaxia

asc = arr$^+             // ordenatu goranzka (primitiboak bakarrik)
desc = arr$^-            // ordenatu beheranzka (primitiboak bakarrik)

// Izeneko/posizioko tupla array-ak — erabili $^ lambda konparatzailearekin
db = [(izena: "Karla", adina: 28), (izena: "Ana", adina: 25), (izena: "Bob", adina: 30)]
adinez_gora  = db$^ (a, b -> a.adina < b.adina)       // goranzka adinez  (<)
izenez_behera = db$^ (a, b -> a.izena > b.izena)      // beheranzka izenez (>)
>> adinez_gora[1].izena ¶     // → Ana
>> izenez_behera[1].izena ¶   // → Karla

// Elementu zuzeneko eguneraketa (array-ak bakarrik)
arr[1] = 99              // esleitu
arr[2] += 5              // konposatua: +=  -=  *=  /=  %=  ^=

// Eguneraketa funtzionala — array berri bat itzultzen du; jatorrizkoa aldatu gabe
arr2 = arr[2]$~ 99
```

> Bilduma eragile guztiek **array berri bat** itzultzen dute. Esleitu atzera: `arr = arr$+ 4`.
> `$+` kateatu daiteke: `arr = arr$+ 5$+ 6$+ 7`. Beste eragileek bitarteko esleipenak erabiltzen dituzte.
> **Indexazioa 1-oinarria**: `arr[1]` lehen elementua da; `arr[0]` exekuzio errorea da.
> `$^+` / `$^-` **array primitiboak** ordenatzen ditu (zenbakiak, kateak). Tupla array-etan erabili `$^` lambda konparatzailearekin — norabidea lambda-kodetzen da (`<` = goranzka, `>` = beheranzka).

**Balio semantika** — array bat beste aldagai batera esleitzeak kopia independente bat sortzen du:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ez da aldatzen
```

```zymbol
// Habiaratutako array-ak (1-oinarria)
matrizea = [[1,2,3],[4,5,6],[7,8,9]]
>> matrizea[2][3] ¶    // → 6  (2. lerroa, 3. zutabea)
```

---

## Destructuring

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[lehena, *gainontzekoa] = arr      // lehena=10  gainontzekoa=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ baztertu

// Tupla posizionala
puntua = (100, 200)
(px, py) = puntua             // px=100  py=200

// Izeneko tupla
pertsona = (izena: "Ana", adina: 25, hiria: "Madril")
(izena: n, adina: a) = pertsona   // n="Ana"  a=25
```

---

## Tuplak

Tuplak ordenatutako edukiontzi **aldaezinak** dira, **mota desberdinetako** balioak eduki ditzaketenak.
Array-ek ez bezala, elementuak ezin dira sortu ondoren aldatu.

```zymbol
// Posizionala — mota mistoak onartzen dira
puntua = (10, 20)
>> puntua[1] ¶    // → 10

datuak = (42, "kaixo", #1, 3.14)
>> datuak[3] ¶    // → #1

// Izenekoa
pertsona = (izena: "Alizia", adina: 25)
>> pertsona.izena ¶    // → Alizia
>> pertsona[1] ¶       // → Alizia  (indizea ere funtzionatzen du, 1-oinarria)

// Habiaratua
pos = (x: 10, y: 20)
p = (pos: pos, etiketa: "jatorria")
>> p.pos.x ¶        // → 10
```

**Aldaezintasuna** — tupla baten elementu bat aldatzen saiatzea exekuzio errorea da:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ exekuzio errorea: tuplak aldaezinak dira
// t[1] += 5    // ❌ errore bera
```

Balio aldatua ateratzeko erabili `$~` (eguneraketa funtzionala) — tupla **berri** bat itzultzen du:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← jatorrizkoa aldatu gabe
>> t2 ¶    // → (10, 999, 30)

// Izeneko tupla — eraiki esplizituki
pertsona = (izena: "Alizia", adina: 25)
zaharragoa  = (izena: pertsona.izena, adina: 26)
>> pertsona.adina ¶    // → 25
>> zaharragoa.adina ¶  // → 26
```

---

## Ordena altuko funtzioak

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

bikoiztuak  = nums$> (x -> x * 2)                  // mapa   → [2,4,6…20]
bakoitiak   = nums$| (x -> x % 2 == 0)             // iragazki → [2,4,6,8,10]
guztira    = nums$< (0, (acc, x) -> acc + x)       // murriztu → 55

// Kateatu bitarteko aldagaiekin
urrats1 = nums$| (x -> x > 3)
urrats2 = urrats1$> (x -> x * x)
>> urrats2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Izeneko funtzioak zuzenean pasa daitezke HOF-era
bikoiztu(x) { <~ x * 2 }
handia(x) { <~ x > 5 }
r = nums$> bikoiztu       // ✅ zuzeneko erreferentzia
r = nums$| handia         // ✅ zuzeneko erreferentzia
```

---

## Pipe eragilea

Eskuinaldeak beti `_` behar du balioan ordezko gisa:

```zymbol
bikoiztu = x -> x * 2
batu = (a, b) -> a + b
inc = x -> x + 1

5 |> bikoiztu(_)        // → 10
10 |> batu(_, 5)        // → 15
5 |> batu(2, _)         // → 7

// Kateatua
r = 5 |> bikoiztu(_) |> inc(_) |> bikoiztu(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Errore kudeaketa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "zeroz biderkatzea" ¶
} :! {
    >> "beste errorea: " _err ¶    // _err errore mezua du
} :> {
    >> "beti exekutatzen da" ¶
}
```

| Mota | Noiz gertatzen da |
|------|-------------------|
| `##Div` | Zeroz biderkatzea |
| `##IO` | Fitxategia / sistema |
| `##Index` | Indizea kanpoan |
| `##Type` | Mota desegokitasuna |
| `##Parse` | Datuen parseaketa |
| `##Network` | Sare erroreak |
| `##_` | Edozein errore (dena harrapatzen du) |

---

## Moduluak

```zymbol
// lib/calc.zy — moduluaren gorputza giltzen artean doa
# calc {
    #> { batu, get_PI }

    _PI := 3.14159
    batu(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias derrigorrezkoa

>> c::batu(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Esportatu izen publiko ezberdinarekin
# nirelib {
    #> { _barne_batu <= batura }

    _barne_batu(a, b) { <~ a + b }
}
```

```zymbol
<# ./nirelib <= m

>> m::batura(3, 4) ¶    // → 7  (barne izena _barne_batu ezkutatuta dago)
```

> **Modulu arauak**: `# izena { }` barruan bakarrik `#>`, funtzio definizioak eta literalen hasieratzaileak onartzen dira. Adierazpen exekutagarriek (`>>`, `<<`, begiztak, etab.) E013 errorea sortzen dute.

---

## Sistema numeralak

Zymbol-ek **69 Unicode digitu bloke**tan erakutsi ditzake zenbakiak — Devanagari, Arabiar-Indiar, Thailandiar, Klingoierazko pIqaD, Matematikako lodia, LCD segmentuak, eta gehiago. Modu aktiboak `>>` irteerari bakarrik eragiten dio; barne aritmetika beti bitarra da.

### Sistema bat aktibatzea

Idatzi helburuko sistemaren `0` eta `9` digituak `#…#` artean:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabiar-Indiar (U+0660–U+0669)
#๐๙#    // Thailandiar    (U+0E50–U+0E59)
#09#    // ASCIIra berrezarri
```

### Irteera eta booleanak

```zymbol
x = 42
>> x ¶          // → 42   (ASCII lehenetsia)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (hamartar puntua beti ASCII)
>> 1 + 2 ¶      // → ३

// Booleanak: # aurrizkia beti ASCII, digitua egokitzen da
>> #1 ¶         // → #१   (egia Devanagariz)
>> #0 ¶         // → #०   (faltsua — ० zenbaki oso zeroz desberdina)

x = 28 > 4
>> x ¶          // → #१   (konparazio emaitzak modu aktiboa jarraitzen du)
```

### Jatorrizko digitu literalak iturburu kodean

Onartutako edozein sistemako digituak literal baliodunak dira — tarteetan, moduloan, konparazioetan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal boolearrak edozein sistematan

`#` + digitu `0` edo `1` edozein bloketakoa literal boolear balioduna da:

```zymbol
#٠٩#
aktibo = #١        // #1 berdin
>> aktibo ¶        // → #١
>> (#١ && #٠) ¶    // → #०
```

> `#` **beti ASCII da**. `#0` (faltsua) beti bereiz daiteke bisualki `0`-tik (zenbaki oso zero) edozein sistematan.

---

## Datu eragileak

```zymbol
// Mota bihurketa
##.42         // → 42.0  (Float-era)
###3.7        // → 4     (Oso-era, biribildu)
##!3.7        // → 3     (Oso-era, moztu)

// Katea zenbakira parseatu
v1 = #|"42"|      // → 42  (Zenbaki osoa)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (segurua, errorerik gabe)

// Biribildu / moztu
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (biribildu 2 hamartarretara)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (moztu)

// Zenbaki formatua
fmt = #,|1234567|      // → 1,234,567  (komaz bereizita)
sci = #^|12345.678|    // → 1.2345678e4  (zientifikoa)

// Beste oinarrietako literalak
a = 0x41         // → 'A'  (hexa)
b = 0b01000001   // → 'A'  (bitar)
c = 0o101        // → 'A'  (zortzitar)

// Oinarri bihurketa irteera
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell integrazioa

```zymbol
data = <\ date +%Y-%m-%d \>    // stdout harrapatzen du (lerro amaiera \n barne)
>> "Gaur: " data

fitxategia = "datuak.txt"
edukia = <\ cat {fitxategia} \>      // interpolazioa komandoetan

irteera = </"./subscript.zy"/>      // beste Zymbol script bat exekutatu, irteera harrapatu
>> irteera
```

> `><` CLI argumentuak kate-array gisa harrapatzen ditu (tree-walker bakarrik).

---

## Adibide osoa: FizzBuzz

```zymbol
sailkatu(zenbakia) {
    ? zenbakia % 15 == 0 { <~ "FizzBuzz" }
    _? zenbakia % 3  == 0 { <~ "Fizz" }
    _? zenbakia % 5  == 0 { <~ "Buzz" }
    _ { <~ zenbakia }
}

@ i:1..20 { >> sailkatu(i) ¶ }
```

---

## Sinboloen erreferentziak

| Sinboloa | Eragiketa | Sinboloa | Eragiketa |
|----------|-----------|----------|-----------|
| `=` | aldagaia | `$#` | luzera |
| `:=` | konstantea | `$+` | atxiki (kateagarria) |
| `>>` | irteera | `$+[i]` | txertatu indizean (1-oinarria) |
| `<<` | sarrera | `$-` | kendu lehena balioz |
| `¶` / `\\` | lerro jauzia | `$--` | kendu guztiak balioz |
| `?` | baldin | `$-[i]` | kendu indizean (1-oinarria) |
| `_?` | bestela baldin | `$-[i..j]` | kendu tartea (1-oinarria) |
| `_` | bestela / komodin | `$?` | badu |
| `??` | bat etorri | `$??` | aurkitu indize guztiak (1-oinarria) |
| `@` | begizta | `$[s..e]` | zati (1-oinarria) |
| `@ N { }` | N aldiz begizta | `$>` | mapa |
| `@!` | hautsi | `$|` | iragazki |
| `@>` | jarraitu | `$<` | murriztu |
| `@:izena { }` | etiketadun begizta | `$/ delim` | katea zatitu |
| `@:izena!` | hautsi etiketa | `$++ a b c` | konkatenatu eraiki |
| `@:izena>` | jarraitu etiketa | `arr[i>j>k]` | nabigazio indizea |
| `->` | lambda | `arr[i] = bal` | eguneratu elementua (array-ak bakarrik) |
| `arr[i] += bal` | konposatu eguneraketa | `arr[i]$~` | eguneraketa funtzionala (kopia berria) |
| `$^+` | ordenatu goranzka (primitiboak) | `$^-` | ordenatu beheranzka (primitiboak) |
| `$^` | ordenatu konparatzaileaz (tuplak) | `<~` | itzuli |
| `|>` | hodia | `!?` | saiatu |
| `:!` | harrapatu | `:>` | azkenik |
| `#1` | egia | `#0` | faltsua |
| `$!` | errorea da | `$!!` | hedatu errorea |
| `<#` | inportatu | `#>` | esportatu |
| `#` | deklaratu modulua | `::` | deitu modulua |
| `.` | eremura sartu | `#?` | mota metadatuak |
| `#|..|` | parseatu zenbakia | `##.` | bihurtu Float-era |
| `###` | bihurtu Oso-era (biribildu) | `##!` | bihurtu Oso-era (moztu) |
| `#.N|..|` | biribildu | `#!N|..|` | moztu |
| `#,|..|` | koma formatua | `#^|..|` | zientifikoa |
| `#d0d9#` | sistema numerala aldatu | `#09#` | ASCIIra berrezarri |
| `<\ ..\>` | shell exekutatu | `>\<` | CLI argumentuak |
| `\ var` | aldagaia suntsitu esplizituki | | |

---

## Bertsioen historia

### v0.0.4 — 1-oinarriko Indexazioa, Lehen Mailako Funtzioak eta Modulu blokeak _(Apirila 2026)_

- **Haustura** Indexazio guztia **1-oinarrira** aldatu da — `arr[1]` lehen elementua da; `arr[0]` exekuzio errorea da
- **Gehituta** Izeneko funtzioak **lehen mailako balioak** dira — zuzenean pasa daitezke HOF-era: `nums$> bikoiztu`
- **Gehituta** Moduluen **bloke sintaxia beharrezkoa** da: `# izena { ... }` — sintaxia laua kendu da
- **Gehituta** Dimentsio anitzeko indexazioa: `arr[i>j>k]` (nabigazioa), `arr[p ; q]` (hedapen laua)
- **Gehituta** Mota bihurketa: `##.adiera` (Float), `###adiera` (Oso biribildu), `##!adiera` (Oso moztu)
- **Gehituta** Katea zatitu: `str$/ delim` — `Array(String)` itzultzen du
- **Gehituta** Konkatenatu eraiki: `oinarria$++ a b c` — hainbat elementu atxikitzen ditu
- **Gehituta** N aldiz begizta: `@ N { }` — N aldiz errepikatu zehazki
- **Gehituta** Etiketadun begizten sintaxia: `@:izena { }`, `@:izena!`, `@:izena>` — `@ @izena` / `@! izena` ordezkatzen du
- **Gehituta** Aldagaien eskopearen arauak: `_izena` aldagaiek bloke eskope zehatza dute; `\ var` goiz suntsitzen du
- **Gehituta** Match konparazio ereduak: `< 0 :`, `> 5 :`, `== 42 :` etab.
- **Gehituta** Moduluetako E013 errorea: adierazpen exekutagarriak moduluaren gorputzean debekatuta daude
- **Konponduta** `take_variable`-k ez ditu moduluen konstanteak hondatzen atzera idaztean
- **Konponduta** `alias.KONST`-a behar bezala ebazten da; `#>` funtzio definizioen atzetik ager daiteke
- **VM** Parekotasun osoa: 393/393 test gainditu

### v0.0.3 — Unicode Sistema Numeralak eta LSP Hobekuntzak _(Apirila 2026)_

- **Gehituta** 69 Unicode digitu bloke modu aldaketa tokenarekin `#d0d9#`
- **Gehituta** Literal boolearrak edozein sistematan — `#१` / `#०`, `#١` / `#٠`, etab.
- **Gehituta** Klingoierazko pIqaD digituak (CSUR PUA U+F8F0–U+F8F9)
- **Gehituta** `SetNumeralMode` VM opcode — parekotasun osoa zuhaitz ibiltariarekin
- **Gehituta** REPL-ek modu numeral aktiboa errespetatzen du oihartzunean eta aldagaien bistaratzean
- **Aldatuta** Boolearren `>>` irteerak `#` aurrizkia barne hartzen du (`#0` / `#1`) modu guztietan

### v0.0.2_01 — Eragileen berrizendatzea _(2026 Martxoa 30)_

- **Aldatuta** `c|..|` → `#,|..|` eta `e|..|` → `#^|..|` — `#` formatu aurrizki familiarekin koherentzia
- **Gehituta** Esportazio aliasa: moduluko kideak izen ezberdinarekin berresportatu

### v0.0.2 — Bildumen APIaren berrazterketa eta Instalatzaileak _(2026 Martxoa 24)_

- **Gehituta** `$` eragile familia bateratua array eta kateentzat (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Gehituta** Destructuring esleipena array, tupla eta izeneko tupletarako
- **Gehituta** Indize negatiboak (`arr[-1]` = azken elementua)
- **Gehituta** Instalatzaile natiboak — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(2026 Martxoa 25)_

- **Gehituta** Konposatu esleipena `^=`
- **Konponduta** Parserraren aritmetika kasu ertzak; dokumentazio zuzenketak

### v0.0.1 — Lehen Publikazioa _(2026 Martxoa 22)_

- Zuhaitz ibiltari interpretea + erregistro VM (`--vm`, ~4× azkarrago, ~%95 parekotasuna)
- Oinarrizko egitura guztiak: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode identifikatzaile osoak, modulu sistema, lambdak, itxiurak, errore kudeaketa
- REPL, LSP, VS Code luzapena, formateatzailea (`zymbol fmt`)

---

_Zymbol-Lang — Sinbolikoa. Unibertsala. Aldaezina._
