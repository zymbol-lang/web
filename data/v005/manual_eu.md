> **Oharra:** Dokumentazio hau adimen artifizialak (AA) sortu eta itzuli du.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Eskuliburua

> **v0.0.5 bertsiorako berrikusita — 2026-05-12**

**Zymbol-Lang** programazio lengoaia sinbolikoa da. Hitz-gakoak gabe — dena sinboloa da. Edozein giza-hizkuntzan modu berean funtzionatzen du.

- Ez dago `if`, `while`, `return` — soilik `?`, `@`, `<~`
- Unicode osoa — identifikatzaileak edozein hizkuntzan edo emojitan
- Giza-hizkuntzarekiko neutroa — kodea leku guztietan berdina da

**Interpretatzailearen bertsioa**: v0.0.5 | **Proba-estaldura**: 436/436 (TW ↔ VM parekotasuna)

---

## Aldagaiak eta konstanteak

```zymbol
x = 10              // aldagai aldagarria
PI := 3.14159       // konstantea — berriro esleitzea exekuzio-errorea da
izena = "Alice"
aktiboa = #1        // boolean egia
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

`°` (gradu-ikurra, U+00B0) aldagai bat bere balio neutrora hasieratzen du automatikoki lehen erabileran:

```zymbol
zenbakiak = [3, 1, 4, 1, 5]
@ z:zenbakiak {
    °guztira += z    // 0ra auto-hasieratu begizta gainean; @ ondoren irauten du
}
>> guztira ¶         // → 14
```

> `°x` (aurrizkia) begizta gainean ainguratzen da — emaitza `@` ondoren eskuragarri dago.
> `x°` (atzizkia) begizta barruan ainguratzen da — begizta amaitzean desagertzen da.
> Zuhaitz-ibiltzailerako soilik.

---

## Datu-motak

| Mota | Literala | `#?` etiketa | Oharrak |
|------|---------|------------|---------|
| Osoa | `42`, `-7` | `###` | 64 biteko zeinu-batekin |
| Hamartarra | `3.14`, `1.5e10` | `##.` | Notazio zientifikoa bai |
| Katea | `"testua"` | `##"` | Interpolazioa: `"Kaixo {izena}"` |
| Karakterea | `'A'` | `##'` | Unicode karaktere bakarra |
| Boolearrra | `#1`, `#0` | `##?` | EZ da zenbakizkoa — `#1 ≠ 1` |
| Array-a | `[1, 2, 3]` | `##]` | Elementu homogeneoak |
| Tupleta | `(a, b)` | `##)` | Posizionala |
| Izendatutako tupleta | `(x: 1, y: 2)` | `##)` | Izendatutako eremuak |
| Funtzioa | izendatutako funtzio-erreferentzia | `##()` | Lehen mailakoa; bistaratze `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Lehen mailakoa; bistaratze `<lambd/N>` |

```zymbol
// Mota-introspekzioa — itzultzen du (mota, digituak, balioa)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Irteera eta sarrera

```zymbol
>> "Kaixo" ¶                      // ¶ edo \\ lerro-jausi esplizitua
>> "a=" a " b=" b ¶               // juxtaposizioa — balio anitz
>> (array$#) ¶                    // atzizkiko operadoreek ( ) behar dute >>-n

<< izena                          // irakurri aldagaian (gidoirik gabe)
<< "Sartu izena: " izena          // gidoiarekin
```

> `¶` (AltGr+R espainiako teklatuan) eta `\\` lerro-jausi baliokideak dira.

---

## TUI primitiboak

Terminal-interfazeko operadoreak programa interaktiboetarako. Gehienek `>>| { }` blokea behar dute (pantaila alternatiboa + raw modua).

```zymbol
>>| {
    >>!                             // pantaila alternatiboa garbitu
    >>~ (1, 1, 0, 10) > "Exekutatzen"  // 1. errenkada, 1. zutabe, fg=10 (berdea)
    @~ 1000                         // pausa 1 segundo (1000 ms)
    >>~ (2, 1) > "Amaituta."
}
// terminala automatikoki berrezartzen da irtetean
```

```zymbol
// Teklatu-sakatzea eta terminal-tamaina
>>| {
    [errenkadak, zutabeak] = >>?              // terminal-dimentsioak eskatu
    >>~ (1, 1) > "Terminala: " errenkadak " x " zutabeak
    <<| tekla                         // blokeatuz teklatu-sakatzea irakurri
    >>~ (2, 1) > "Sakatuta: " tekla
}
```

> `>>!` pantaila garbitzen du. `>>?` itzultzen du `[errenkadak, zutabeak]`. `@~ N` N milisegundo lo egiten du.
> `<<|` teklatu-sakatze bat irakurtzen du (blokeatzailea); `<<|?` blokatu gabe galdetzen du (itzultzen du `'\0'` ez badago).
> Posizionatutako irteera tupleta: `(errenkada, zutabea, BKS, fg, bg)` — edozein leku koma batekin utzi daiteke (`>>~ (,,, 196) > "gorria"`).
> BKS bit-maskara: `1`=Lodia, `2`=Etzana, `4`=Azpimarra. ANSI 256 koloreko paleta (`0`=terminal lehenetsita).
> Zuhaitz-ibiltzailerako soilik (`>>!`, `>>?`, `@~`, `>>~` ez bada, `--vm`-n ere exekutatzen direnak).

---

## Operadoreak

```zymbol
// Aritmetika
a = 10
b = 3
e1 = a + b    // 13
e2 = a - b    // 7
e3 = a * b    // 30
e4 = a / b    // 3  (zenbaki osoaren zatiketa)
e5 = a % b    // 1
e6 = a ^ b    // 1000  (berreketa)

// Konparaketa — ikusteko esleitu
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a <= b    // #0
k5 = a > b     // #1
k6 = a >= b    // #1

// Logika
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Kateak

```zymbol
// Bi kateaketa-forma
izena = "Alice"
n = 42

>> "Kaixo " izena " dituzu " n ¶    // juxtaposizioa — >>-n
deskribapena = "Kaixo {izena}, dituzu {n}"  // interpolazioa — edonon
```

```zymbol
s = "Kaixo Mundua"
luzera = s$#                  // 11
azpikatea = s$[1..5]          // "Kaixo"  (1-oinarritua, amaiera barne)
bai = s$? "Mundua"            // #1
zatiak = "a,b,c,d"$/ ','      // [a, b, c, d]  (mugatzailearen arabera zatitu)
ordezkatu = s$~~["a":"A"]     // "KAixo MunduA"
ordezkatu1 = s$~~["a":"A":1]  // "KAixo Mundua"  (lehen N soilik)
lerroa = "─" $* 20            // "────────────────────"  (N aldiz errepikatu)
```

> `+` zenbakientzat soilik. Erabili `,`, juxtaposizioa edo interpolazioa kateetarako.

---

## Fluxu-kontrola

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

> `{ }` giltza-markak **beharrezkoak** dira adierazpen bakarrerako ere.

---

## Patroi-erkaketa

```zymbol
// Tarteak
puntuazioa = 85
nota = ?? puntuazioa {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> nota ¶    // → B

// Kateak
kolorea = "gorria"
kodea = ?? kolorea {
    "gorria"  => "#FF0000"
    "berdea"  => "#00FF00"
    _         => "#000000"
}

// Konparazio-ereduak
tenperatura = -5
egoera = ?? tenperatura {
    < 0  => "izotza"
    < 20 => "hotza"
    < 35 => "epela"
    _    => "beroa"
}
>> egoera ¶    // → izotza

// Adierazpen-forma (blokeko adarrak)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negatiboa" ¶ }
    _    => { >> "positiboa" ¶ }
}
```

---

## Begiztak

```zymbol
@ i:0..4  { >> i " " }        // tartea barne:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pausoarekin:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // alderantziz:   5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frutak = ["sagarra", "udarea", "mahats-alea"]
@ f:frutak { >> f ¶ }         // for-each array-a

@ k:"kaixo" { >> k "-" }
>> ¶                          // → k-a-i-x-o-  (for-each katea)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jarraitu
    ? i > 7 { @! }             // @! eten
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Begiztarik gabeko begizta
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Izendatutako begizta (habiaratutako etena)
kontagailua = 0
@:kanpoa {
    kontagailua++
    ? kontagailua >= 3 { @:kanpoa! }
}
>> kontagailua ¶                    // → 3
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

Funtzioek **isolatutako esparrua** dute — ezin dituzte kanpoko aldagaiak irakurri. Erabili irteera-parametroak `<~` dei-egilearen aldagaiak aldatzeko:

```zymbol
trukatu(a<~, b<~) {
    aldi = a
    a = b
    b = aldi
}
x = 10
y = 20
trukatu(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Izendatutako funtzioak **lehen mailako balioak** dira — zuzenean pasa daitezke: `zenbakiak$> bikoiztu`. Biltzeko: `x -> fn(x)` ere baliozkoa da.

---

## Lambdak eta itxierak

```zymbol
bikoiztu = x -> x * 2
batura = (a, b) -> a + b
>> bikoiztu(5) ¶    // → 10
>> batura(3, 7) ¶   // → 10

// Bloke-lambda
sailkatu = x -> {
    ? x > 0 { <~ "positiboa" }
    _? x < 0 { <~ "negatiboa" }
    <~ "zero"
}

// Itxiera — kanpoko esparrua harrapatzen du
faktorea = 3
hirukoiztu = x -> x * faktorea
>> hirukoiztu(7) ¶    // → 21

// Fabrika
gehitzailea_egin(n) { <~ x -> x + n }
gehitu10 = gehitzailea_egin(10)
>> gehitu10(5) ¶    // → 15

// Array-etan
eragiketak = [x -> x+1, x -> x*2, x -> x*x]
>> eragiketak[3](5) ¶    // → 25
```

---

## Array-ak

Array-ak **aldagarriak** dira eta **mota bereko** elementuak gordetzen dituzte.

```zymbol
array = [1, 2, 3, 4, 5]

x = array[1]      // 1 — sarbidea (1-oinarritua: lehen elementua)
x = array[-1]     // 5 — indize negatiboa (azken elementua)
x = array$#       // 5 — luzera (erabili (array$#) >>-n)

array = array$+ 6            // gehitu → [1,2,3,4,5,6]
array2 = array$+[2] 99       // txertatu 2. posizioan (1-oinarritua)
array3 = array$- 3           // kendu balioaren lehen agerpena
array4 = array$-- 3          // kendu agerraldi guztiak
array5 = array$-[1]          // kendu 1. indizean (lehen elementua)
array6 = array$-[2..3]       // kendu tartea (1-oinarritua, amaiera barne)

bai = array$? 3            // #1 — edukitzen du
pos = array$?? 3           // [3] — balioaren indize guztiak (1-oinarritua)
zatia = array$[1..3]       // [1,2,3] — zatia (1-oinarritua, amaiera barne)
zatia2 = array$[1:3]       // [1,2,3] — berdina, kopuruetan oinarritutako sintaxia

gora = array$^+             // goranzko ordenan ordenatua  (primitivoak soilik)
behera = array$^-           // beheranzko ordenan ordenatua (primitivoak soilik)

// Izendatutako/posiziozko tupleta array-ak — erabili $^ konparadore-lambdarekin
bd = [(izena: "Carla", adina: 28), (izena: "Ana", adina: 25), (izena: "Bob", adina: 30)]
adina_arabera  = bd$^ (a, b -> a.adina < b.adina)    // goranzko adinaren arabera  (<)
izena_arabera = bd$^ (a, b -> a.izena > b.izena)     // beheranzko izenaren arabera (>)
>> adina_arabera[1].izena ¶     // → Ana
>> izena_arabera[1].izena ¶    // → Carla

// Elementua zuzenean eguneratu (array-ak soilik)
array[1] = 99              // esleitu
array[2] += 5              // konposatuak: +=  -=  *=  /=  %=  ^=

// Eguneraketa funtzionala — array berria itzultzen du; originala aldatu gabe
array2 = array[2]$~ 99
```

> Bilduma-operadore guztiek **array berria** itzultzen dute. Berriro esleitu: `array = array$+ 4`.
> `$+` kate daiteke: `array = array$+ 5$+ 6$+ 7`. Beste operadoreek tarteko esleipen-ak erabiltzen dituzte.
> **Indexatzea 1-oinarritua da**: `array[1]` lehen elementua da; `array[0]` exekuzio-errorea da.
> `$^+` / `$^-` **primitibozko array-ak** ordenatzen dituzte (zenbakiak, kateak). Tupleta array-etarako erabili `$^` konparadore-lambdarekin — norabidea lambdan kodetuta dago (`<` = goranzkoa, `>` = beheranzkoa).

**Balio-semantika** — array bat beste aldagai bati esleitzeak kopia independentea sortzen du:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ez da aldatzen
```

```zymbol
// Habiaratutako array-ak (1-oinarritutako indexatzea)
matrizea = [[1,2,3],[4,5,6],[7,8,9]]
>> matrizea[2][3] ¶    // → 6  (2. errenkada, 3. zutabea)
```

---

## Desegituraketa

```zymbol
// Array-a
array = [10, 20, 30, 40, 50]
[a, b, c] = array              // a=10  b=20  c=30
[lehena, *gainontzekoak] = array  // lehena=10  gainontzekoak=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ baztertu

// Posiziozko tupleta
puntua = (100, 200)
(px, py) = puntua              // px=100  py=200

// Izendatutako tupleta
pertsona = (izena: "Ana", adina: 25, hiria: "Madril")
(izena: n, adina: a) = pertsona  // n="Ana"  a=25
```

---

## Tupletak

Tupletak **aldaezinak** diren ordenatutako edukiontziak dira, **mota desberdineko** balioak gordetzeko gai direnak.
Array-en ez bezala, elementuak ezin dira sortu ondoren aldatu.

```zymbol
// Posiziozko — mota nahasiak onartuta
puntua = (10, 20)
>> puntua[1] ¶    // → 10

datuak = (42, "kaixo", #1, 3.14)
>> datuak[3] ¶     // → #1

// Izendatuta
pertsona = (izena: "Alice", adina: 25)
>> pertsona.izena ¶    // → Alice
>> pertsona[1] ¶       // → Alice  (indizea ere funtzionatzen du, 1-oinarritua)

// Habiaratuta
pos = (x: 10, y: 20)
p = (pos: pos, etiketa: "jatorria")
>> p.pos.x ¶        // → 10
```

**Aldaezintasuna** — tupleta-elementu bat aldatzeko edozein saiakera exekuzio-errorea da:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ exekuzio-errorea: tupletak aldaezinak dira
// t[1] += 5    // ❌ errore bera
```

Aldatutako balio bat lortzeko erabili `$~` (eguneraketa funtzionala) — tupleta **berria** itzultzen du:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originala aldatu gabe
>> t2 ¶    // → (10, 999, 30)

// Izendatutako tupleta — berreraiki esplizituki
pertsona = (izena: "Alice", adina: 25)
zaharragoa  = (izena: pertsona.izena, adina: 26)
>> pertsona.adina ¶    // → 25
>> zaharragoa.adina ¶  // → 26
```

---

## Ordena handiko funtzioak

```zymbol
zenbakiak = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

bikoiztuak  = zenbakiak$> (x -> x * 2)                // map  → [2,4,6…20]
bikoitiak   = zenbakiak$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
guztira     = zenbakiak$< (0, (akum, x) -> akum + x)  // reduce → 55

// Kate bidez tarteko aldagaiekin
urratsa1 = zenbakiak$| (x -> x > 3)
urratsa2 = urratsa1$> (x -> x * x)
>> urratsa2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Izendatutako funtzioak zuzenean pasa daitezke HOF-era
bikoiztu(x) { <~ x * 2 }
handia_da(x) { <~ x > 5 }
e = zenbakiak$> bikoiztu       // ✅ erreferentzia zuzena
e = zenbakiak$| handia_da      // ✅ erreferentzia zuzena
```

---

## Hodiak operadorea

Eskuineko aldeak beti `_` behar du lekukotze gisa kanalizatutako balioaren:

```zymbol
bikoiztu = x -> x * 2
gehitu = (a, b) -> a + b
handitu = x -> x + 1

e1 = 5 |> bikoiztu(_)        // → 10
e2 = 10 |> gehitu(_, 5)      // → 15
e3 = 5 |> gehitu(2, _)       // → 7

// Kateatuta
e = 5 |> bikoiztu(_) |> handitu(_) |> bikoiztu(_)
>> e ¶    // → 22  (5→10→11→22)
```

---

## Errore-kudeaketa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "zeroz zatiketa" ¶
} :! {
    >> "bestea: " _err ¶    // _err errorea gordeta dago
} :> {
    >> "beti exekutatzen da" ¶
}
```

| Mota | Noiz |
|------|------|
| `##Div` | Zeroz zatiketa |
| `##IO` | Fitxategia / sistema |
| `##Index` | Indizea mugaz kanpo |
| `##Type` | Mota-desadostasuna |
| `##Parse` | Datuen analisia |
| `##Network` | Sare-erroreak |
| `##_` | Edozein errore (dena harrapatu) |

---

## Moduluak

```zymbol
// lib/kalkulua.zy — moduluaren gorputza giltza-marken artean dago
# kalkulua {
    #> { gehitu, PI_eskuratu }

    _PI := 3.14159
    gehitu(a, b) { <~ a + b }
    PI_eskuratu() { <~ _PI }
}
```

```zymbol
// nagusia.zy
<# ./lib/kalkulua => k    // aliasak beharrezkoak dira

>> k::gehitu(5, 3) ¶     // → 8
pi = k::PI_eskuratu()
>> pi ¶               // → 3.14159
```

```zymbol
// Izen publiko desberdinekin esportatu
# nire_liburutegia {
    #> { _barneko_batuketa => batura }

    _barneko_batuketa(a, b) { <~ a + b }
}
```

```zymbol
<# ./nire_liburutegia => n

>> n::batura(3, 4) ¶    // → 7  (barneko izena _barneko_batuketa ezkutatuta dago)
```

> **Modulu-arauak**: `# izena { }` barruan `#>`, funtzio-definizioak eta literalezko aldagai/konstante-hasieratzaileak soilik onartzen dira. Adierazpen exekutagarriak (`>>`, `<<`, begiztak, etab.) E013 errorea eragiten dute.

---

## Zenbaki-modoak

Zymbol zenbakiak **69 Unicode zifra-scriptetakoak** bezala bistaratu ditzake — Devanagari, Arabe-Indiar, Tailandiarra, Klingon pIqaD, Mathematical Bold, LCD segmentuak, eta gehiago. Modu aktiboa `>>` irteeran soilik eragiten du; barneko aritmetika beti binarioa da.

### Script bat aktibatu

Idatzi helburuko scriptaren `0` eta `9` zifraren artean `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabe-Indiar (U+0660–U+0669)
#๐๙#    // Tailandiar   (U+0E50–U+0E59)
#09#    // ASCII-ra berrezarri
```

### Irteera eta booleanarrak

```zymbol
x = 42
>> x ¶          // → 42   (ASCII lehenetsita)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (hamartar-puntua beti ASCII)
>> 1 + 2 ¶      // → ३

// Booleanarrak: # aurrizkia beti ASCII, zifra egokitzen da
>> #1 ¶         // → #१   (egia Devanagarin)
>> #0 ¶         // → #०   (gezurra — ०  osoko zerotik bereizita)

x = 28 > 4
>> x ¶          // → #१   (konparazio-emaitza modu aktiboa jarraitzen du)
```

### Jatorrizko zifra-literalak iturrian

Onartutako edozein scriptaren zifrак literalak baliozkoak dira — tarteetan, moduluan, konparaketetan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literalak edozein scriptan

`#` + `0` edo `1` zifra edozein bloketik boolean literal baliozkoa da:

```zymbol
#٠٩#
aktiboa = #١        // #1 berdina
>> aktiboa ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **beti ASCII**. `#0` (gezurra) beti bisualki bereizita dago `0`-tik (osoko zero) script guztietan.

---

## Datu-operadoreak

```zymbol
// Mota-bihurketa-casteak
f = ##.42         // → 42.0  (Hamartarrera)
i = ###3.7        // → 4     (Osora, biribiltzea)
t = ##!3.7        // → 3     (Osora, moztea)

// Kate bat zenbakira analizatu
v1 = #|"42"|      // → 42  (Osoa)
v2 = #|"3.14"|    // → 3.14  (Hamartarra)
v3 = #|"abc"|     // → "abc"  (segurua, errorerik gabe)

// Biribildu / moztu
pi = 3.14159265
b2 = #.2|pi|      // → 3.14  (2 dezimaltara biribildu)
b4 = #.4|pi|      // → 3.1416
m2 = #!2|pi|      // → 3.14  (moztea)

// Zenbaki-formatua
fmt = #,|1234567|  // → 1,234,567  (komarekin bereizita)
zient = #^|12345.678|    // → 1.2345678e4  (notazio zientifikoa)

// Oinarri-literalak
a = 0x41         // → 'A'  (hexadezimala)
b = 0b01000001   // → 'A'  (binarioa)
c = 0o101        // → 'A'  (oktala)

// Oinarri-bihurketa irteera
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell integrazioa

```zymbol
data = <\ date +%Y-%m-%d \>     // stdout harrapatu (amaierako \n barne)
>> "Gaur: " data

fitxategia = "datuak.txt"
edukia = <\ cat {fitxategia} \>      // interpolazioa komandoetan

irteera = </"./azpiscripta.zy"/>   // beste Zymbol scripta exekutatu, irteera harrapatu
>> irteera
```

> `><` CLI argumentuak katea-array gisa harrapatzen ditu (zuhaitz-ibiltzailerako soilik).

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

## Sinbolo erreferentzia

| Sinboloa | Eragiketa | Sinboloa | Eragiketa |
|---------|----------|---------|----------|
| `=` | aldagaia | `$#` | luzera |
| `:=` | konstantea | `$+` | gehitu (kateagarria) |
| `>>` | irteera | `$+[i]` | txertatu indizean (1-oinarritua) |
| `<<` | sarrera | `$-` | kendu lehenengoa balioaren arabera |
| `¶` / `\\` | lerro-jauzia | `$--` | kendu guztiak balioaren arabera |
| `?` | if | `$-[i]` | kendu indizearen arabera (1-oinarritua) |
| `_?` | else-if | `$-[i..j]` | kendu tartea (1-oinarritua) |
| `_` | else / metamaska | `$?` | edukitzen du |
| `??` | patroi-erkaketa | `$??` | aurkitu indize guztiak (1-oinarritua) |
| `@` | begizta | `$[s..e]` | zatia (1-oinarritua) |
| `@ N { }` | N aldiz begizta | `$>` | map |
| `@!` | eten | `$\|` | filter |
| `@>` | jarraitu | `$<` | reduce |
| `@:izena { }` | izendatutako begizta | `$/ mug` | katea zatitu |
| `@:izena!` | eten izena | `$++ a b c` | kateaketa eraiki |
| `@:izena>` | jarraitu izena | `array[i>j>k]` | nabigazio-indizea |
| `->` | lambda | `array[i] = b` | elementua eguneratu (array-ak soilik) |
| `array[i] += b` | konposatu-eguneraketa | `array[i]$~` | eguneraketa funtzionala (kopia berria) |
| `$^+` | ordenatu goranzko (primitivoak) | `$^-` | ordenatu beheranzko (primitivoak) |
| `$^` | ordenatu konparadorearekin (tupletak) | `<~` | itzuli |
| `\|>` | hodi | `!?` | saiatu |
| `:!` | harrapatu | `:>` | azkenean |
| `#1` | egia | `#0` | gezurra |
| `$!` | errorea da | `$!!` | errorea zabaldu |
| `<#` | inportatu | `#>` | esportatu |
| `#` | modulua deklaratu | `::` | modulu-deia |
| `.` | eremura sartu | `#?` | mota-metadatuak |
| `#\|..\|` | zenbakia analizatu | `##.` | Hamartarrera cast |
| `###` | Osora cast (biribiltzea) | `##!` | Osora cast (moztea) |
| `#.N\|..\|` | biribildu | `#!N\|..\|` | moztu |
| `#,\|..\|` | koma-formatua | `#^\|..\|` | notazio zientifikoa |
| `#d0d9#` | zenbaki-modo aldaketa | `#09#` | ASCII-ra berrezarri |
| `<\ ..\>` | shell exekuzioa | `>\<` | CLI argumentuak |
| `\ aldg` | aldagaia esplizituki suntsitu | `°x` / `x°` | definizio beroa (auto-hasieraketa) |
| `>>|` | TUI blokea (alt-pantaila) | `>>~` | posizionatutako irteera |
| `>>!` | pantaila garbitu | `>>?` | terminal-tamaina eskatu |
| `<<\|` | blokeatuz tekla-sakatzea | `<<\|?` | ez-blokeatuz tekla-sakatzea |
| `@~ N` | N milisegundo lo egin | `$*` | katea N aldiz errepikatu |

---

## Aldaketen erregistroa

### v0.0.5 — TUI primitiboak, definizio beroa eta katearen errepikatzea _(Maiatza 2026)_

- **Hautsi** Patroi-erkaketa adar-banatzailea: `eredua : emaitza` → `eredua => emaitza`
- **Hautsi** Inportazio-aliasa: `<# bide <= aliasa` → `<# bide => aliasa`
- **Hautsi** Esportazio-berrizendatzea: `#> { fn <= pub }` → `#> { fn => pub }`
- **Gehitu** TUI blokea `>>| { }` — pantaila alternatiboa + raw modua; irtetean garbitze
- **Gehitu** Posizionatutako irteera `>>~ (errenkada, zutabea, BKS, fg, bg) > elementuak` — leku hutsak, 256 koloretako ANSI
- **Gehitu** Tekla-sarrera `<<| aldg` (blokeatzailea) eta `<<|? aldg` (ez-blokeatzaile inkestatzea)
- **Gehitu** `>>!` pantaila garbitu, `>>?` terminal-tamaina eskatu, `@~ N` N milisegundo lo egin
- **Gehitu** Definizio beroa `°x` / `x°` — aldagaia auto-hasieratzen du begiztan lehen erabileran
- **Gehitu** Katea errepikatzea `katea $* N` — katea N aldiz errepikatu
- **VM** Parekotasuna: 436/436 proba gainditu

### v0.0.4 — 1-oinarritutako indexatzea, lehen mailako funtzioak eta modulu-blokeak _(Apirila 2026)_

- **Hautsi** Indexatze guztia **1-oinarritutakora** aldatu zen — `array[1]` lehen elementua da; `array[0]` exekuzio-errorea da
- **Gehitu** Izendatutako funtzioak **lehen mailako balioak** dira — zuzenean pasa HOF-era: `zenbakiak$> bikoiztu`
- **Gehitu** Moduluaren **bloke-sintaxia** beharrezkoa da: `# izena { ... }` — sintaxi laua kendu
- **Gehitu** Dimentsio anitzeko indexatzea: `array[i>j>k]` (nabigazioa), `array[p ; q]` (lau erauzketa)
- **Gehitu** Mota-bihurketa-casteak: `##.adierazpena` (Hamartarra), `###adierazpena` (Osoa biribiltzea), `##!adierazpena` (Osoa moztea)
- **Gehitu** Katea zatitzea: `katea$/ mug` — `Array(String)` itzultzen du
- **Gehitu** Kateaketa eraikitzea: `oinarria$++ a b c` — elementu anitz gehitzen ditu
- **Gehitu** N aldiz begizta: `@ N { }` — zehazki N aldiz errepikatu
- **Gehitu** Izendatutako begizta-sintaxia: `@:izena { }`, `@:izena!`, `@:izena>` — `@ @izena` / `@! izena` ordezkatzen du
- **Gehitu** Aldagai-esparru-arauak: `_izena` aldagaiek bloke-esparru zehatza dute; `\ aldg` goiz suntsitzen du
- **Gehitu** Patroi-erkaketa konparazio-ereduak: `< 0 :`, `> 5 :`, `== 42 :` etab.
- **Gehitu** Moduluaren E013 errorea: adierazpen exekutagarriak modulu-gorputzean debekatuta daude
- **Konponduta** `take_variable` ez du moduluaren konstanteak gehiago hondatzen idaztean
- **Konponduta** `aliasa.KONSTANTEA` orain zuzen konpontzen da; `#>` funtzio-definizioen ondoren ager daiteke
- **VM** Parekotasun osoa: 393/393 proba gainditu

### v0.0.3 — Unicode zenbaki-sistemak eta LSP hobekuntzak _(Apirila 2026)_

- **Gehitu** 69 Unicode zifra-bloke modo-aldaketa tokenarekin `#d0d9#`
- **Gehitu** Boolean literalak edozein scriptan — `#१` / `#०`, `#١` / `#٠`, etab.
- **Gehitu** Klingon pIqaD zifrак (CSUR PUA U+F8F0–U+F8F9)
- **Gehitu** VM opkodea `SetNumeralMode` — zuhaitz-ibiltzailearekin parekotasun osoa
- **Gehitu** REPL modu aktiboan dagoen zenbaki-sistema errespetatzen du oihartzunean eta aldagaien bistaratze
- **Aldatu** Boolean `>>` irteerak orain `#` aurrizkia barne hartzen du (`#0` / `#1`) modu guztietan

### v0.0.2_01 — Operadore-berrizendatzea _(30 Mar 2026)_

- **Aldatu** `c|..|` → `#,|..|` eta `e|..|` → `#^|..|` — `#` formatu-aurrizki familiarekin koherentzia
- **Gehitu** Esportazio-aliasa: modulu-kideak beste izen batean berresportatu

### v0.0.2 — Bilduma APIaren berrdiseinua eta instalazioak _(24 Mar 2026)_

- **Gehitu** `$` operadore-familia bateratua array-etarako eta kateetarako (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Gehitu** Desegituraketa-esleipena array-etarako, tupletarako eta izendatutako tupletarako
- **Gehitu** Indize negatiboak (`array[-1]` = azken elementua)
- **Gehitu** Jatorrizko instalatzaileak — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Gehitu** Konposatu-esleipena `^=`
- **Konponduta** Analizadorearen aritmetika-kasu muturrekoak; dokumentazio-zuzenketak

### v0.0.1 — Lehen argitalpen publikoa _(22 Mar 2026)_

- Zuhaitz-ibiltzaile interpretatzailea + erregistro VM-a (`--vm`, ~4× azkarrago, ~95% parekotasuna)
- Oinarrizko egitura guztiak: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode identifikatzaile osoak, modulu-sistema, lambdak, itxierak, errore-kudeaketa
- REPL, LSP, VS Code hedapena, formateatzailea (`zymbol fmt`)

---

_Zymbol-Lang — Sinbolikoa. Unibertsala. Aldaezina._
