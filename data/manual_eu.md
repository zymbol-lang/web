# Dokumentazioa | Zymbol-Lang eskuliburu trinkoa

**Zymbol-Lang** programazio lengoaia sinbolikoa da. Ez du gako-hitzik erabiltzen — dena sinboloa da. Edozein giza-hizkuntzan berdin funtzionatzen du.

- Gako-hitzik ez (`baldin`, `begizta`, `itzuli` ez dira existitzen — sinboloak bakarrik `?`, `@`, `<~`)
- Unicode osoa — identifikadoreak edozein hizkuntzan edo emoji 👋
- Giza-hizkuntzatik independentea — kodea identikoa da hizkuntza guztietan

---

## Aldagaiak eta Konstanteak

```zymbol
x = 10           // aldagaia (aldarazgarria)
PI := 3.14159    // konstantea (aldaezina — errorea berriro esleitzean)
izena = "Ana"
aktibo = #1      // boolear balioa true
👋 := "Kaixo"
```

### Esleipen Konposatua

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

## Datu Motak

| Mota               | Adibidea            | `#?` Sinboloa | Oharrak                                   |
|--------------------|---------------------|---------------|-------------------------------------------|
| Osoa               | `42`, `-7`          | `###`         | 64 biteko zeinu-dunaduna                  |
| Koma mugikorra     | `3.14`, `1.5e10`    | `##.`         | Notazio zientifikoa onartzen da           |
| Katea              | `"kaixo"`           | `##"`         | Interpolazioa: `"Kaixo {izena}"`          |
| Karakterea         | `'A'`               | `##'`         | Unicode karaktere bakarra                 |
| Boolearra          | `#1`, `#0`          | `##?`         | EZ da 1 eta 0 zenbakizko                  |
| Arrayak            | `[1, 2, 3]`         | `##]`         | Elementu guztiak mota berekoak izan behar |
| Tupla              | `(a, b)`            | `##)`         | Posizionala                               |
| Izendatutako Tupla | `(x: 1, y: 2)`      | `##)`         | Izenaren edo indizearen bidezko sarbidea  |

---

## Irteera eta Sarrera

```zymbol
// Irteera — EZ du lerro-jauzi automatikorik gehitzen
>> "Kaixo, Mundu Euskalduna!" ¶         // ¶ edo \\ lerro-jauzi esplizitua ematen du
>> "a=" a " b=" b ¶                     // balio anitz juxtaposizioaren bidez
>> "batura=" gehitu(2, 3) ¶             // funtzio-deiak edozein tokitan
>> (fruta$#) ¶                          // postfixo-operadoreek parentesiak behar dituzte

// Sarrera
<< izena                                // gonbidarik gabe — aldagaira irakurtzen du
<< "Zure izena? " izena                 // gonbidarekin
```

> `¶` edo `\\` lerro-jauzi baliokideak dira.

---

## Operadoreak

```zymbol
// Aritmetika
>> 10 + 3 ¶    // → 13
>> 10 - 3 ¶    // → 7
>> 10 * 3 ¶    // → 30
>> 10 / 3 ¶    // → 3.333…
>> 10 % 3 ¶    // → 1  (modulo)
>> 2 ^ 8  ¶    // → 256  (berretura)

// Konparazioa — #1 edo #0 itzultzen dute
>> 3 == 3 ¶    // → #1
>> 3 != 4 ¶    // → #1
>> 3 <  5 ¶    // → #1
>> 5 >= 5 ¶    // → #1

// Logika
>> #1 && #0 ¶  // → #0  (ETA)
>> #1 || #0 ¶  // → #1  (EDO)
>> !#1     ¶   // → #0  (EZ)
```

---

## Kateak

Hiru forma baliodunak — bakoitza bere testuingururako:

```zymbol
izena = "Ana"
zenbakia = 25

// 1. Koma — = edo := esleipeneetan
mezua = "Kaixo ", izena, "!"              // → Kaixo Ana!
IZENBURUA := "Erabiltzailea: ", izena

// 2. Juxtaposizioa — >> irteeran
>> "Kaixo " izena " zuk " zenbakia ¶     // → Kaixo Ana zuk 25

// 3. Interpolazioa — edozein testuingurutan
deskribapena = "Kaixo {izena}, zuk {zenbakia}" // → Kaixo Ana, zuk 25
```

```zymbol
// Kate-operadoreak
s = "Mundu"
>> (s$#) ¶                     // → 5  (luzera — parentesiak behar ditu >>-n)
xerra = s$[1..4]               // "undu"  (xerra)
s2 = s$~~["und":"izar"]        // "Mizarra"  (ordezkapena)
s3 = s$~~["u":2]               // "u" 2 lehenengo aldiz ordezkatzen du
```

> **Oharra**: `+` zenbakientzat bakarrik da. Kateekin erabiltzeak abisua sortzen du.

---

## Kontrol-Fluxua

```zymbol
x = 7

// Baldintza sinplea
? x > 0 { >> "positiboa" ¶ }

// baldintza / bestela-baldintza / bestela
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

Blokeak `{ }` **derrigorrezkoak** dira lerro bakar batentzat ere.

---

## Bat-Etortzea

```zymbol
// Bat-etortzea tarteekin
puntuak = 85
ebaluazioa = ?? puntuak {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ebaluazioa ¶    // → B

// Bat-etortzea baldintzekin (baldintza arbitrarioak)
tenperatura = -5
egoera = ?? tenperatura {
    _? tenperatura < 0  : "izotza"
    _? tenperatura < 20 : "hotza"
    _? tenperatura < 35 : "epela"
    _                   : "beroa"
}
>> egoera ¶    // → izotza

// Bat-etortzea kateekin
kolorea = "gorria"
kodea = ?? kolorea {
    "gorria"  : "#FF0000"
    "berdea"  : "#00FF00"
    _         : "#000000"
}
>> kodea ¶
```

---

## Begiztak

```zymbol
// Tarte inklusiboa: 0..4-k 0,1,2,3,4 iteratzen du
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Tartea urratsekin
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Alderantzizko tartea
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Bitartean begizta
zenbakia = 1
@ zenbakia <= 64 { zenbakia *= 2 }
>> zenbakia ¶    // → 128

// Array-ko elementu bakoitzarentzat
fruta = ["sagarra", "udarea", "mahastia"]
@ f:fruta { >> f ¶ }

// Kate-karaktereen gainetik
@ c:"kaixo" { >> c "-" }
>> ¶    // → k-a-i-x-o-

// Etena eta Jarraipena
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> jarraitu
    ? i > 7 { @! }          // @! eten
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funtzioak

```zymbol
// Deklarazioa eta deia
gehitu(a, b) { <~ a + b }
>> gehitu(3, 4) ¶    // → 7

// Errekurtsioa
faktoriala(zenbakia) {
    ? zenbakia <= 1 { <~ 1 }
    <~ zenbakia * faktoriala(zenbakia - 1)
}
>> faktoriala(5) ¶    // → 120
```

Funtzioek **esparru isolatua** dute — ezin dituzte kanpoko aldagaiak irakurri. Erabili `<~` irteera-parametroak deitzailearen aldagaiak aldatzeko:

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

> Funtzio izendatuak ez dira lehen mailako balioak. Argumentu gisa pasatzeko, bildu: `x -> izena(x)`.

---

## Lambdak eta Itxierak

```zymbol
// Lambda sinplea (inplizitua itzulera)
bikoiztu = x -> x * 2
batura = (a, b) -> a + b
>> bikoiztu(5) ¶    // → 10
>> batura(3, 7) ¶   // → 10

// Bloke-lambda (esplizitu itzulera)
sailkatu = x -> {
    ? x > 0 { <~ "positiboa" }
    _? x < 0 { <~ "negatiboa" }
    <~ "zero"
}
>> sailkatu(5) ¶     // → positiboa
>> sailkatu(0) ¶     // → zero
>> sailkatu(-5) ¶    // → negatiboa

// Itxierak — lambdek kanpoko esparruaren aldagaiak harrapatzen dituzte
faktorea = 3
hirukoiztu = x -> x * faktorea    // 'faktorea' harrapatzen du
>> hirukoiztu(7) ¶    // → 21

// Funtzio-fabrika
gehitzaile_sortu(n) { <~ x -> x + n }
gehitu10 = gehitzaile_sortu(10)
>> gehitu10(5) ¶    // → 15

// Lambdak balio gisa: array-etan gordeta
eragiketak = [x -> x+1, x -> x*2, x -> x*x]
>> eragiketak[0](5) ¶    // → 6
>> eragiketak[2](5) ¶    // → 25
```

---

## Arrayak

Arrayak **aldarazgarriak** dira eta **mota bereko** elementuak gordetzen dituzte.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — sarbidea (0-oinarritutako indizea)
arr[-1]         // 5 — indize negatiboa (azkena)
arr$#           // 5 — luzera (parentesiak behar ditu >>-n)

arr = arr$+ 6            // gehitzea → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // 2 indizean txertatzea
arr3 = arr$- 3           // balioaren lehen agerraldia kentzea
arr4 = arr$-- 3          // agerraldi guztiak kentzea
arr5 = arr$-[0]          // indizean kentzea
arr6 = arr$-[1..3]       // tartea kentzea (amaiera esklusiboa)

dago = arr$? 3           // #1 — dauka
posizioak = arr$?? 3     // [2] — balioaren indize guztiak
xerra = arr$[0..3]       // [1,2,3] — xerra (amaiera esklusiboa)
xerra2 = arr$[0:3]       // [1,2,3] — berdina, kontaketa-sintaxia

gorantz = arr$^+         // goranzko ordena (soilik primitiboak)
beherantz = arr$^-       // beheranzko ordena (soilik primitiboak)

// Tupla-arrayak — erabili $^ konparatzaile-lambdarekin
db = [(izena: "Ane", adina: 28), (izena: "Ana", adina: 25), (izena: "Mikel", adina: 30)]
adinaren_arabera = db$^ (a, b -> a.adina < b.adina)
>> adinaren_arabera[0].izena ¶    // → Ana

// Elementuaren zuzeneko eguneratzea (arrayak soilik)
arr[1] = 99              // esleitu
arr[0] += 5              // konposatua: +=  -=  *=  /=  %=  ^=

// Eguneratze funtzionala — array berri bat itzultzen du; originala ez da aldatzen
arr2 = arr[1]$~ 99
```

> Bilduma-operadore guztiek **array berri bat** itzultzen dute. Esleitu atzera: `arr = arr$+ 4`.
> Operadoreak ezin dira kateatu — erabili tarteko esleipen-aldagaiak.
> `$^+` / `$^-`-k **primitive-arrayak** ordenatzen dituzte (zenbakiak, kateak). Tupla-arrayetarako erabili `$^` konparatzaile-lambda batekin.

**Balio-semantika** — array bat beste aldagai bati esleitzeak kopia independente bat sortzen du:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ez da aldatzen
```

```zymbol
// Habiaratutako arrayak
matrizea = [[1,2,3],[4,5,6],[7,8,9]]
>> matrizea[1][2] ¶    // → 6
```

---

## Destrukturaketa

```zymbol
// Array-a
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[lehena, *gainerakoa] = arr  // lehena=10  gainerakoa=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ baztertzen du

// Tupla posizionala
puntua = (100, 200)
(px, py) = puntua            // px=100  py=200

// Izendatutako tupla
pertsona = (izena: "Ana", adina: 25, hiria: "Bilbao")
(izena: i, adina: a) = pertsona  // i="Ana"  a=25
```

---

## Tuplak

Tuplak **aldaezinak** diren edukiontzi ordenatu dira, **mota ezberdineko** balioak gordetzen dituzte. Arrayak ez bezala, elementuak ezin dira aldatu sortzen diren ondoren.

```zymbol
// Posizionala
puntua = (10, 20)
>> puntua[0] ¶    // → 10

datuak = (42, "kaixo", #1, 3.14)
>> datuak[2] ¶     // → #1

// Izendatua
pertsona = (izena: "Ane", adina: 25)
>> pertsona.izena ¶    // → Ane
>> pertsona[0] ¶       // → Ane (indizea ere funtzionatzen du)

// Habiaratua
pos = (x: 10, y: 20)
p = (pos: pos, etiketa: "jatorria")
>> p.pos.x ¶           // → 10
```

**Aldaezintasuna** — tupla elementu bat aldatzeko edozein saiakera exekuzio-denboran errorea da:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ exekuzio-denborako errorea: tuplak aldaezinak dira
// t[0] += 5    // ❌ errore berdina
```

Balio aldatua lortzeko erabili `$~` (eguneratze funtzionala) — **tupla berri** bat itzultzen du:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← originala aldatu gabe
>> t2 ¶    // → (10, 999, 30)

// Izendatutako tupla — berreraikitzen da esplizituki
pertsona = (izena: "Ane", adina: 25)
zaharragoa  = (izena: pertsona.izena, adina: 26)
>> pertsona.adina ¶    // → 25
>> zaharragoa.adina ¶  // → 26
```

---

## Ordena Altuko Funtzioak

> HOF operadoreek **lambda txertatua** behar dute — ez lambda aldagai zuzena.

```zymbol
zenbakiak = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Mapa ($>)
bikoiztuak = zenbakiak$> (x -> x * 2)
>> bikoiztuak ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Iragazkia ($|)
bikoitiak = zenbakiak$| (x -> x % 2 == 0)
>> bikoitiak ¶    // → [2, 4, 6, 8, 10]

// Murrizketa ($<) — (hasierako balioa, (acc, elem) -> adierazpena)
guztira = zenbakiak$< (0, (acc, x) -> acc + x)
>> guztira ¶    // → 55

// Tarteko balioen bidezko katea
urr1 = zenbakiak$| (x -> x > 3)
urr2 = urr1$> (x -> x * x)
>> urr2 ¶    // → [16, 25, 36, 49, 64, 81, 100]
```

---

## Hodi-Operadorea

Eskuineko aldeak beti `_` behar du balioa pasatzeko leku-gordailu gisa:

```zymbol
bikoiztu = x -> x * 2
gehitu = (a, b) -> a + b
gehitu1 = x -> x + 1

5 |> bikoiztu(_)        // → 10
10 |> gehitu(_, 5)      // → 15
5 |> gehitu(2, _)       // → 7

// Kateatzea
r = 5 |> bikoiztu(_) |> gehitu1(_) |> bikoiztu(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Erroreen Kudeaketa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "zerozko zatiketa" ¶
} :! {
    >> "beste errorea: " _err ¶    // _err errore-mezua gordetzen du
} :> {
    >> "beti exekutatzen da" ¶
}
```

| Mota        | Noiz gertatzen den        |
|-------------|---------------------------|
| `##Div`     | Zerozko zatiketa          |
| `##IO`      | Fitxategia / sistema      |
| `##Index`   | Indizea mugetatik kanpo   |
| `##Type`    | Mota-errorea              |
| `##Parse`   | Datuen analizea           |
| `##Network` | Sare-erroreak             |
| `##_`       | Edozein errorea           |

---

## Moduluak

```zymbol
// lib/calc.zy
# calc

#> { gehitu, get_PI }    // esportatu DEFINIZIOEN AURRETIK

_PI := 3.14159
gehitu(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // ezizena derrigorrezkoa da

>> c::gehitu(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Izen publiko ezberdinekin esportatzea
# mylib
#> { _internal_gehitu <= batura }

_internal_gehitu(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::batura(3, 4) ¶    // → 7
```

---

## Zenbaki Moduak

Zymbol-ek zenbakiak **69 Unicode zenbaki-idazkeratan** bistaratu ditzake — Devanagari, Arabiar-Indiarra, Tailandiera, Klingon pIqaD, Matematika Lodia, LCD segmentuak eta gehiago. Modu aktiboak `>>`-irteeran bakarrik du eragina; barne-aritmetika beti da bitarra.

### Idazkera aktibatzea

Idatzi `0` eta `9` digituak `#…#` artean:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabiar-Ind.  (U+0660–U+0669)
#๐๙#    // Tailandiera   (U+0E50–U+0E59)
#09#    // ASCII-ra berrezarri
```

### Irteera eta boolearrak

```zymbol
x = 42
>> x ¶          // → 42   (ASCII lehenetsia)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (puntu hamartarra beti ASCII)
>> 1 + 2 ¶      // → ३

// Boolearrak: # aurrizkia beti ASCII, digitua egokitzen da
>> #1 ¶         // → #१   (egiazkoa Devanagarin)
>> #0 ¶         // → #०   (faltsua — ०  zero osoetik bereizita)

x = 28 > 4
>> x ¶          // → #१   (konparaketa-emaitza modu aktiboa jarraitzen du)
```

### Jatorrizko digitu-literalak iturburu-kodean

Onartutako edozein idazkeraren digitoak literal baliozko dira — tarteetan, modulo, konparaketetan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolear literalak edozein idazkeratan

`#` + `0` edo `1` digitua edozein bloketik boolear literal baliozko da:

```zymbol
#٠٩#
نشط = #١        // #1 berdina
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **beti da ASCII**. `#0` (faltsua) beti bereizten da ikusmen aldetik `0`-tik (zero osoa) idazkera guztietan.

---

## Datu-Operadoreak

```zymbol
// Kate-a zenbakira bihurtu
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (errorerik gabe)

// Biribilketa / mozketa
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (2 dezimal-lekutara biribildu)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (mozketa)

// Zenbaki-formatua
fmt = #,|1234567|      // → 1,234,567  (komarekin)
sci = #^|12345.678|    // → 1.2345678e4  (zientifikoa)

// Oinarri-literalak
a = 0x41         // → 'A'  (hexadezimala)
b = 0b01000001   // → 'A'  (binarioa)
c = 0o101        // → 'A'  (oktala)

// Oinarri-bihurtzea
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Integrazioa

```zymbol
data = <\ date +%Y-%m-%d \>      // stdout harrapatzen du (\n amaierarekin)
>> "Gaur: " data

fitxategia = "datuak.txt"
edukia = <\ cat {fitxategia} \>  // interpolazioa komandoetan

irteera = </"./azpiscript.zy"/>  // beste Zymbol script bat exekutatu, irteera harrapatu
>> irteera
```

> `><`-k CLI argumentuak kate-array gisa harrapatzen ditu (soilik tree-walker-ean).

---

## Adibide Osoa: FizzBuzz

```zymbol
sailkatu(zenbakia) {
    ? zenbakia % 15 == 0 { <~ "BurbuilaZurrumurru" }
    _? zenbakia % 3  == 0 { <~ "Burbuila" }
    _? zenbakia % 5  == 0 { <~ "Zurrumurru" }
    _ { <~ zenbakia }
}

@ i:1..20 { >> sailkatu(i) ¶ }
```

---

## Sinboloen Erreferentzia

| Sinboloa    | Eragiketa           | Sinboloa      | Eragiketa                  |
|-------------|---------------------|---------------|----------------------------|
| `=`         | aldagaia            | `$#`          | luzera                     |
| `:=`        | konstantea          | `$+`          | gehitzea                   |
| `>>`        | irteera             | `$+[i]`       | indizean txertatzea        |
| `<<`        | sarrera             | `$--`         | agerraldi guztiak kentzea  |
| `¶` / `\`   | lerro-jauzia        | `$-[i]`       | indizean kentzea           |
| `?`         | baldin              | `$-[i..j]`    | tartea kentzea             |
| `_?`        | bestela-baldin      | `$?`          | dauka                      |
| `_`         | bestela / unibertsal| `$??`         | indize guztiak bilatu      |
| `??`        | bat-etortzea        | `$[s..e]`     | xerra                      |
| `@`         | begizta             | `$>`          | mapa                       |
| `@!`        | eten                | `$\|`         | iragazkia                  |
| `@>`        | jarraitu            | `$<`          | murrizketa                 |
| `->`        | lambda              | `arr[i] = val` | elementua eguneratu (arrayak soilik) |
| `arr[i] += val` | eguneratze konposatua | `arr[i]$~` | eguneratze funtzionala (kopia berria) |
| `$^+`       | goranzko ordena     | `$^-`         | beheranzko ordena          |
| `<~`        | itzuli              | `$^`          | konparatzaile-ordena        |
| `\|>`       | hodia               | `$!`          | errorea da                 |
| `#1`        | egia                | `$!!`         | errorea hedatu             |
| `#0`        | gezurra             | `!?`          | saiatu                     |
| `:!`        | errorea harrapatu   | `#`           | modulua deklaratu          |
| `:>`        | azkenik             | `<#`          | inportatu                  |
| `.`         | eremuaren sarbidea  | `::`          | moduluaren deia            |
| `#\|..\|`   | zenbakia bihurtu    | `#.N\|..\|`   | biribilketa                |
| `#!N\|..\|` | mozketa             | `#,\|..\|`     | koma-formatua              |
| `#d0d9#` | zenbaki-modu aldagailua | `#09#` | ASCII-ra berrezarri |
| `#^\|..\|`   | zientifikoa         | `<\ ..\>`     | shell exekuzioa            |
| `>\<`       | CLI argumentuak     | `$~~[..]`     | katea ordezkatu            |
| `[a,b]=arr` | array-destrukturak. | `(x,y)=tup`   | tupla-destrukturak.        |

---

*Zymbol-Lang — Sinbolikoa. Unibertsala. Aldaezina.*

## Bertsio Historia

### v0.0.3 — Unicode Zenbaki Sistemak & LSP Hobekuntzak _(2026ko apirila)_

- **Gehitua** 69 Unicode digitu-bloke modu-aldatze tokenarekin `#d0d9#`
- **Gehitua** Boolear literalak edozein idazkeratan — `#१` / `#०`, `#١` / `#٠`, etab.
- **Gehitua** Klingon pIqaD digitoak (CSUR PUA U+F8F0–U+F8F9)
- **Gehitua** `SetNumeralMode` VM opkodea — tree-walkerarekin parekotasun osoa
- **Gehitua** REPL-ek modu zenbakiduna aktiboan errespetatzen du oihartzunean eta aldagaiak erakusterakoan
- **Aldatua** Boolearren `>>`-irteera-k `#` aurrizkia biltzen du orain (`#0` / `#1`) modu guztietan

### v0.0.2_01 — Operadore Aldaketak _(2026ko martxoaren 30a)_

- **Aldatua** `c|..|` → `#,|..|` eta `e|..|` → `#^|..|` — `#` aurrizki-familiarekin koherentea
- **Gehitua** Esportazio-aliasa: moduluaren kideak beste izen batekin berresportatzea

### v0.0.2 — Bildumen API Berrediseinua & Instalatzaileak _(2026ko martxoaren 24a)_

- **Gehitua** `$` operadore-familia bateratua arrayentzat eta kateentzat (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Gehitua** Desegituraketa arrayentzat, tuplaentzat eta izendutako tuplaentzat
- **Gehitua** Indize negatiboak (`arr[-1]` = azken elementua)
- **Gehitua** Instalatzaile natiboak — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(2026ko martxoaren 25a)_

- **Gehitua** Esleipen konposatua `^=`
- **Konpondua** Analizatzaile aritmetikoaren ertz-kasuak; dokumentazio-zuzenketak

### v0.0.1 — Lehen Argitalpen Publikoa _(2026ko martxoaren 22a)_

- Tree-walker interpretatzailea + erregistro VM (`--vm`, ~4× azkarragoa, ~95% parekotasuna)
- Oinarrizko eraikuntza guztiak: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode identifikatzaile osoak, modulu-sistema, lambdak, itxierak, errore-kudeaketa
- REPL, LSP, VS Code luzapena, formateatzailea (`zymbol fmt`)

---

> **Oharra:** Dokumentazio hau adimen artifizialak (AA) sortu eta itzuli zuen. Zehaztasuna bermatzeko ahalegin guztiak egin dira, baina zenbait itzulpen edo adibidek akatsak eduki ditzakete. Erreferentzia autoritatiboa [Zymbol-Lang zehaztapena](https://github.com/zymbol-lang/interpreter) da.

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
