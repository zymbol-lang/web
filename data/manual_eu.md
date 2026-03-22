# Dokumentazioa | Zymbol-Lang eskuliburu trinkoa

**Zymbol-Lang** programazio lengoaia sinbolikoa da. Ez du gako-hitzik erabiltzen — dena sinboloa da. Edozein giza-hizkuntzan berdin funtzionatzen du.

---

## Filosofia

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
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Datu Motak

| Mota              | Adibidea            | `#?` Sinboloa | Oharrak                                  |
|-------------------|---------------------|---------------|------------------------------------------|
| Osoa              | `42`, `-7`          | `###`         | 64 biteko zeinu-dunaduna                 |
| Koma mugikorra    | `3.14`, `1.5e10`    | `##.`         | Notazio zientifikoa onartzen da          |
| Katea             | `"kaixo"`           | `##"`         | Interpolazioa: `"Kaixo {izena}"`         |
| Karakterea        | `'A'`               | `##'`         | Unicode karaktere bakarra                |
| Boolearra         | `#1`, `#0`          | `##?`         | EZ da 1 eta 0 zenbakizko                 |
| Arrayak           | `[1, 2, 3]`         | `##]`         | Elementu guztiak mota berekoak izan behar |
| Tupla             | `(a, b)`            | `##)`         | Posizionala                              |
| Izendatutako Tupla | `(x: 1, y: 2)`     | `##)`         | Izenaren edo indizearen bidezko sarbidea |

---

## Irteera eta Sarrera

```zymbol
// Irteera — EZ du lerro-jauzi automatikorik gehitzen
>> "Kaixo, Mundu Euskalduna!" ¶         // ¶ edo \\ lerro-jauzi esplizitua ematen du
>> "a=" a " b=" b ¶                     // balio anitz juxtaposizioaren bidez
>> "batura=" sailkatu(2, 3) ¶           // funtzio-deiak edozein tokitan
>> (fruta$#) ¶                          // postfixo-operadoreek parentesiak behar dituzte

// Sarrera
<< izena                                // gonbidarik gabe — aldagaira irakurtzen du
<< "Zure izena? " izena                 // gonbidarekin
```

> `¶` edo `\\` lerro-jauzi baliokideak dira.

---

## Kate-Kateatzea

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

// Funtzioek esparru isolatua dute — kanpoko aldagaietara sarbiderik gabe
globala = 100
probatu() {
    x = 42    // lokaloa bakarrik
    <~ x
}
>> probatu() ¶    // → 42
```

> **Garrantzitsua**: `izena(params){ }` funtzio izendatuak ez dira lehen mailako balioak.
> Argumentu gisa pasatzeko, bildu: `x -> izena(x)`.

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

```zymbol
arr = [10, 20, 30, 40, 50]

// Sarbidea (0-oinarritutako indizea)
>> arr[0] ¶    // → 10

// Luzera (parentesiak behar ditu >>-n)
zenbakia = arr$#
>> (arr$#) ¶    // → 5

// Gehitu, kendu, dauka, xerra
arr = arr$+ 60               // gehitzea
arr = arr$- 0                // 0 indizea kentzea
dago = arr$? 30              // → #1
xerra = arr$[0..2]           // [20, 30]

// Elementua eguneratu
arr[1] = 99

// Elementu bakoitzarentzat
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]`-k **array berri bat** itzultzen dute — esleitu atzera: `arr = arr$+ 4`.
> Ezin kateatu: erabili bi esleipen bereizi.

---

## Tuplak

```zymbol
// Izendatutako tupla
pertsona = (izena: "Ane", adina: 25)
>> pertsona.izena ¶    // → Ane
>> pertsona.adina ¶    // → 25
>> pertsona[0] ¶       // → Ane (indizea ere funtzionatzen du)
```

---

## Ordena Altuko Funtzioak

HOF operadoreek **lambda txertatua** behar dute — ez lambda aldagai zuzena.

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
```

---

## Erroreen Kudeaketa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "zerozko zatiketa" ¶
} :! ##IO {
    >> "S/I errorea" ¶
} :! {
    >> "beste errorea: " _err ¶
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
// Fitxategia: lib/calc.zy
# calc

#> { gehitu, get_PI }    // esportatu DEFINIZIOEN AURRETIK

_PI := 3.14159
gehitu(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fitxategia: main.zy
<# ./lib/calc <= c    // ezizena derrigorrezkoa da

>> c::gehitu(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

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

| Sinboloa  | Eragiketa           | Sinboloa   | Eragiketa             |
|-----------|---------------------|------------|-----------------------|
| `=`       | aldagaia            | `$#`       | luzera                |
| `:=`      | konstantea          | `$+`       | gehitzea              |
| `>>`      | irteera             | `$-`       | kentzea (ind.)        |
| `<<`      | sarrera             | `$?`       | dauka                 |
| `¶`/`\`   | lerro-jauzia        | `$[s..e]`  | xerra                 |
| `?`       | baldin              | `$>`       | mapa                  |
| `_?`      | bestela-baldin      | `$\|`      | iragazkia             |
| `_`       | bestela / unibertsal| `$<`       | murrizketa            |
| `??`      | bat-etortzea        | `!?`       | saiatu                |
| `@`       | begizta             | `:!`       | errorea harrapatu     |
| `@!`      | eten                | `:>`       | azkenik               |
| `@>`      | jarraitu            | `$!`       | errorea da            |
| `->`      | lambda              | `$!!`      | errorea hedatu        |
| `<~`      | itzuli              | `#`        | modulua deklaratu     |
| `\|>`     | hodeia              | `#>`       | esportatu             |
| `#1`      | egia                | `<#`       | inportatu             |
| `#0`      | gezurra             | `::`       | moduluaren deia       |

---

*Zymbol-Lang — Sinbolikoa. Unibertsala. Aldaezina.*

---

**Oharra:** Dokumentazio hau adimen artifizialak (AA) sortu eta itzuli zuen. Zehaztasuna bermatzeko ahalegin guztiak egin dira, baina zenbait itzulpen edo adibidek akatsak eduki ditzakete. Erreferentzia autoritatiboa [Zymbol-Lang zehaztapena](https://github.com/OscarEEspinozaB/zymbol-lang-web) da.

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
