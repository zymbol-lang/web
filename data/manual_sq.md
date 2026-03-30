# Manual Kompakt i Zymbol-Lang

**Zymbol-Lang** është një gjuhë programimi simbolike. Ajo nuk përdor fjalë kyçe — gjithçka është simbol. Funksionon njësoj në çdo gjuhë njerëzore.

- Pa fjalë kyçe (`nëse`, `cikël`, `kthe` nuk ekzistojnë — vetëm simbole `?`, `@`, `<~`)
- Unicode i plotë — identifikues në çdo gjuhë ose emoji 👋
- Agnostike ndaj gjuhës njerëzore — kodi është identik në çdo gjuhë

---

## Variablat dhe Konstantet

```zymbol
x = 10           // variabël (i ndryshueshëm)
PI := 3.14159    // konstantë (i pandryshueshëm — gabim nëse ricaktohet)
emri = "Ana"
aktiv = #1       // boolean i vërtetë
👋 := "Përshëndetje"
```

### Caktimi i Kombinuar

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

## Llojet e të Dhënave

| Lloji            | Shembull            | Simboli `#?` | Shënime                                        |
|------------------|---------------------|--------------|------------------------------------------------|
| Numër i plotë    | `42`, `-7`          | `###`        | 64-bit me shenjë                               |
| Numër dhjetor    | `3.14`, `1.5e10`    | `##.`        | Notimi shkencor OK                             |
| Varg teksti      | `"përshëndetje"`    | `##"`        | Interpolim: `"Përshëndetje {emri}"`            |
| Karakter         | `'A'`               | `##'`        | Një karakter Unicode                           |
| Boolean          | `#1`, `#0`          | `##?`        | NUK është numerik 1 dhe 0                     |
| Varg elementesh  | `[1, 2, 3]`         | `##]`        | Të gjitha elementet duhet të jenë i njëjti lloj |
| Tuple            | `(a, b)`            | `##)`        | Pozicional                                     |
| Tuple i emërtuar | `(x: 1, y: 2)`      | `##)`        | Qasja me emër ose indeks                       |

---

## Dalja dhe Hyrja

```zymbol
// Dalja — NUK shton automatikisht rresht të ri
>> "Përshëndetje, Botë!" ¶             // ¶ ose \\ jep rresht të ri eksplicit
>> "a=" a " b=" b ¶                    // vlera të shumta me bashkëpërcjellje
>> "shuma=" add(2, 3) ¶                // thirrje funksioni në çdo pozicion
>> (fruta$#) ¶                         // operatorët pas-pozicionalë kërkojnë kllapa

// Hyrja
<< emri                                // pa nxitje — lexon në variabël
<< "Emri juaj? " emri                  // me nxitje
```

> `¶` ose `\\` janë ekuivalente si rresht i ri.

---

## Operatorët

```zymbol
// Aritmetikë
>> 10 + 3 ¶    // → 13
>> 10 - 3 ¶    // → 7
>> 10 * 3 ¶    // → 30
>> 10 / 3 ¶    // → 3.333…
>> 10 % 3 ¶    // → 1  (modulo)
>> 2 ^ 8  ¶    // → 256  (fuqizim)

// Krahasim — kthejnë #1 ose #0
>> 3 == 3 ¶    // → #1
>> 3 != 4 ¶    // → #1
>> 3 <  5 ¶    // → #1
>> 5 >= 5 ¶    // → #1

// Logjikë
>> #1 && #0 ¶  // → #0  (DHE)
>> #1 || #0 ¶  // → #1  (OSE)
>> !#1     ¶   // → #0  (NUK)
```

---

## Vargjet e Tekstit

Tre forma të vlefshme — secila për kontekstin e vet:

```zymbol
emri = "Ana"
numri = 25

// 1. Presja — në caktime me = ose :=
mesazhi = "Përshëndetje ", emri, "!"       // → Përshëndetje Ana!
TITULLI := "Përdoruesi: ", emri

// 2. Bashkëpërcjellje — në >> dalje
>> "Përshëndetje " emri " ti je " numri ¶  // → Përshëndetje Ana ti je 25

// 3. Interpolim — në çdo kontekst
pershkrimi = "Përshëndetje {emri}, ti je {numri}"  // → Përshëndetje Ana, ti je 25
```

```zymbol
// Operatorë vargu
s = "Botë"
>> (s$#) ¶                     // → 4  (gjatësi — kërkon kllapa në >>)
spl = s$[1..3]                 // "otë"  (prerje)
s2 = s$~~["Bot":"Gjithësi"]    // "Gjithësi!"  (zëvendësim)
s3 = s$~~["o":2]               // zëvendëso 2 të parat e "o"
```

> **Shënim**: `+` është vetëm për numra. Përdorimi i tij me vargje gjeneron një paralajmërim.

---

## Rrjedha e Kontrollit

```zymbol
x = 7

// Nëse e thjeshtë
? x > 0 { >> "pozitiv" ¶ }

// nëse / tjetër-nëse / tjetër
? x > 100 {
    >> "i madh" ¶
} _? x > 0 {
    >> "pozitiv" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negativ" ¶
}
```

Blloqet `{ }` janë **të detyrueshme** edhe për një rresht të vetëm.

---

## Përputhja

```zymbol
// Përputhja me intervale
pikët = 85
vlerësimi = ?? pikët {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> vlerësimi ¶    // → B

// Përputhja me roje (kushte arbitrare)
temperatura = -5
gjendja = ?? temperatura {
    _? temperatura < 0  : "akull"
    _? temperatura < 20 : "ftohtë"
    _? temperatura < 35 : "ngrohtë"
    _                   : "nxehtë"
}
>> gjendja ¶    // → akull

// Përputhja me vargje teksti
ngjyra = "kuq"
kodi = ?? ngjyra {
    "kuq"     : "#FF0000"
    "gjelbër" : "#00FF00"
    _         : "#000000"
}
>> kodi ¶
```

---

## Ciklet

```zymbol
// Interval gjithëpërfshirës: 0..4 iteron 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Interval me hap
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Interval i kundërt
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Ndërkohë
numri = 1
@ numri <= 64 { numri *= 2 }
>> numri ¶    // → 128

// Për-çdo mbi varg elementesh
fruta = ["mollë", "dardhë", "rrush"]
@ f:fruta { >> f ¶ }

// Mbi karakteret e vargut
@ c:"përshëndetje" { >> c "-" }
>> ¶    // → p-ë-r-s-h-ë-n-d-e-t-j-e-

// Ndalo dhe Vazhdo
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> vazhdo
    ? i > 7 { @! }          // @! ndalo
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funksionet

```zymbol
// Deklarimi dhe thirrja
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

// Rekursioni
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funksionet kanë **fushë të izoluar** — nuk mund të lexojnë variablat e jashtme. Përdorni parametrat dalës `<~` për të modifikuar variablat e thirrësit:

```zymbol
ndërroj(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
ndërroj(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Funksionet e emërtara nuk janë vlera të klasit të parë. Për t'i kaluar si argument, mbështillni: `x -> emri(x)`.

---

## Lambdat dhe Mbyllosjet

```zymbol
// Lambda e thjeshtë (kthim implicit)
dyfishuar = x -> x * 2
shuma = (a, b) -> a + b
>> dyfishuar(5) ¶    // → 10
>> shuma(3, 7) ¶     // → 10

// Lambda bllok (kthim eksplicit)
klasifiko = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "zero"
}
>> klasifiko(5) ¶     // → pozitiv
>> klasifiko(0) ¶     // → zero
>> klasifiko(-5) ¶    // → negativ

// Mbyllosjet — lambdat kapin variablat e fushës së jashtme
faktori = 3
trefishuar = x -> x * faktori    // kap 'faktori'
>> trefishuar(7) ¶    // → 21

// Fabrikë funksioni
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdat si vlera: ruajtura në vargje elementesh
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Vargjet

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — qasja (indeks bazë-0)
arr[-1]         // 5 — indeks negativ (i fundit)
arr$#           // 5 — gjatësia (kërkon kllapa në >>)

arr = arr$+ 6            // shto → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // fut në indeksin 2
arr3 = arr$- 3           // hiq ndodhjen e parë të vlerës
arr4 = arr$-- 3          // hiq të gjitha ndodhjet
arr5 = arr$-[0]          // hiq në indeks
arr6 = arr$-[1..3]       // hiq interval (fundi ekskluziv)

ka = arr$? 3             // #1 — përmban
pozicionet = arr$?? 3    // [2] — të gjithë indekset e vlerës
prer = arr$[0..3]        // [1,2,3] — prerje (fundi ekskluziv)
prer2 = arr$[0:3]        // [1,2,3] — e njëjta, sintaksë me numërim

ngjit = arr$^+           // renditur rritës (vetëm primitivë)
zbriti = arr$^-          // renditur zbritës (vetëm primitivë)

// Vargje tuple — përdorni $^ me lambda krahasuese
db = [(name: "Carla", age: 28), (name: "Ana", age: 25), (name: "Bob", age: 30)]
sipas_moshes = db$^ (a, b -> a.age < b.age)
>> sipas_moshes[0].name ¶    // → Ana

arr[1] = 99              // përditëso në vend
arr = arr[1]$~ 99        // përditësim funksional — kthen varg të ri
```

> Të gjithë operatorët e koleksionit kthejnë një **varg të ri**. Caktoni mbrapsht: `arr = arr$+ 4`.
> Operatorët nuk mund të zinxhirohen — përdorni caktime të ndërmjetme.
> `$^+` / `$^-` renditen **vargje primitivësh** (numra, vargje teksti). Për vargje tuple përdorni `$^` me lambda krahasuese.

```zymbol
// Vargje të ndërtuara
matricë = [[1,2,3],[4,5,6],[7,8,9]]
>> matricë[1][2] ¶    // → 6
```

---

## Destrukturimi

```zymbol
// Vargu
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[i parë, *rest] = arr        // i parë=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ hedh poshtë

// Tuple pozicional
pika = (100, 200)
(px, py) = pika              // px=100  py=200

// Tuple i emërtuar
personi = (name: "Ana", age: 25, city: "Madrid")
(name: n, age: a) = personi  // n="Ana"  a=25
```

---

## Tuples

```zymbol
// Pozicional
pika = (10, 20)
>> pika[0] ¶    // → 10

// I emërtuar
personi = (name: "Alice", age: 25)
>> personi.name ¶    // → Alice
>> personi[0] ¶      // → Alice (indeksi funksionon gjithashtu)

// I ndërtuar
poz = (x: 10, y: 20)
p = (poz: poz, label: "origjina")
>> p.poz.x ¶         // → 10
```

---

## Funksionet e Rendit të Lartë

> Operatorët HOF kërkojnë **lambda inline** — variablat lambda të kaluara drejtpërdrejt nuk funksionojnë.

```zymbol
numrat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Hartëzimi ($>)
dyfishuara = numrat$> (x -> x * 2)
>> dyfishuara ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtrimi ($|)
çiftet = numrat$| (x -> x % 2 == 0)
>> çiftet ¶    // → [2, 4, 6, 8, 10]

// Reduktimi ($<) — (fillestare, (akumulues, elem) -> shprehje)
gjithsej = numrat$< (0, (acc, x) -> acc + x)
>> gjithsej ¶    // → 55

// Zinxhir nëpërmjet vlerave të ndërmjetme
hapi1 = numrat$| (x -> x > 3)
hapi2 = hapi1$> (x -> x * x)
>> hapi2 ¶    // → [16, 25, 36, 49, 64, 81, 100]
```

---

## Operatori i Tubit

Krahina djathtas kërkon gjithmonë `_` si vendmbajtës për vlerën e tubuar:

```zymbol
dyfishuar = x -> x * 2
mbledh = (a, b) -> a + b
shto1 = x -> x + 1

5 |> dyfishuar(_)        // → 10
10 |> mbledh(_, 5)       // → 15
5 |> mbledh(2, _)        // → 7

// Zinxhirëzim
r = 5 |> dyfishuar(_) |> shto1(_) |> dyfishuar(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Trajtimi i Gabimeve

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pjesëtim me zero" ¶
} :! {
    >> "tjetër: " _err ¶    // _err mban mesazhin e gabimit
} :> {
    >> "gjithmonë ekzekutohet" ¶
}
```

| Lloji       | Kur ndodh                   |
|-------------|------------------------------|
| `##Div`     | Pjesëtim me zero             |
| `##IO`      | Skedar / sistem              |
| `##Index`   | Indeks jashtë kufijve        |
| `##Type`    | Gabim lloji                  |
| `##Parse`   | Analizim të dhënash          |
| `##Network` | Gabime rrjeti                |
| `##_`       | Çdo gabim (kap-gjithçka)     |

---

## Modulet

```zymbol
// lib/calc.zy
# calc

#> { add, get_PI }    // eksportet PARA definicioneve

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias i detyrueshëm

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksportimi me emër tjetër publik
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7
```

---

## Operatorët e të Dhënave

```zymbol
// Analizimi i vargut teksti në numër
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (i sigurt ndaj gabimit)

// Rrumbullakosje / prerje
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rrumbullakos në 2 shifra dhjetore)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (prerje)

// Formatimi i numrave
fmt = #,|1234567|      // → 1,234,567  (me presje)
sci = #^|12345.678|    // → 1.2345678e4  (shkencor)

// Literalë bazë
a = 0x41         // → 'A'  (heksadecimal)
b = 0b01000001   // → 'A'  (binar)
c = 0o101        // → 'A'  (oktal)

// Konvertimi i bazës në dalje
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrimi i Guaskës

```zymbol
data = <\ date +%Y-%m-%d \>      // kap stdout (përfshin \n fundor)
>> "Sot: " data

skedar = "data.txt"
permbajtja = <\ cat {skedar} \>  // interpolim në komanda

dalja = </"./nenskenar.zy"/>     // ekzekuto skenar tjetër Zymbol, kap daljen
>> dalja
```

> `><` kap argumentet CLI si varg vargjesh teksti (vetëm tree-walker).

---

## Shembull i Plotë: FizzBuzz

```zymbol
klasifiko(numër) {
    ? numër % 15 == 0 { <~ "FlluskëZhurmë" }
    _? numër % 3  == 0 { <~ "Flluskë" }
    _? numër % 5  == 0 { <~ "Zhurmë" }
    _ { <~ numër }
}

@ i:1..20 { >> klasifiko(i) ¶ }
```

---

## Referenca e Simboleve

| Simboli    | Operacioni          | Simboli      | Operacioni               |
|------------|---------------------|--------------|--------------------------|
| `=`        | variabël            | `$#`         | gjatësi                  |
| `:=`       | konstantë           | `$+`         | shto                     |
| `>>`       | dalje               | `$+[i]`      | fut në indeks             |
| `<<`       | hyrje               | `$--`        | hiq të gjitha ndodhjet   |
| `¶` / `\`  | rresht i ri         | `$-[i]`      | hiq në indeks             |
| `?`        | nëse                | `$-[i..j]`   | hiq interval              |
| `_?`       | tjetër-nëse         | `$?`         | përmban                   |
| `_`        | tjetër / gjeneral   | `$??`        | gjej të gjithë indekset  |
| `??`       | përputh             | `$[s..e]`    | prerje                    |
| `@`        | cikël               | `$>`         | hartëzo                   |
| `@!`       | ndalo               | `$\|`        | filtro                    |
| `@>`       | vazhdo              | `$<`         | redukto                   |
| `->`       | lambda              | `$^+`        | rendito rritës            |
| `<~`       | kthe                | `$^-`        | rendito zbritës           |
| `\|>`      | tub                 | `$^`         | rendito me krahasues      |
| `#1`       | i vërtetë           | `$!`         | është gabim               |
| `#0`       | i rremë             | `$!!`        | përhap gabimin            |
| `!?`       | provoni             | `#`          | deklaro modulin           |
| `:!`       | kapni               | `#>`         | eksporto                  |
| `:>`       | në fund             | `<#`         | importo                   |
| `.`        | qasje fushe         | `::`         | thirrje moduli            |
| `#\|..\|`  | analizim numri      | `#.N\|..\|`  | rrumbullakosje            |
| `#!N\|..\|`| prerje              | `c\|..\|`    | formatim me presje        |
| `e\|..\|`  | shkencor            | `<\ ..\>`    | ekzekutim guaske          |
| `>\<`      | argumentet CLI      | `$~~[..]`    | zëvendëso varg teksti     |
| `[a,b]=arr`| destrukturim vargu  | `(x,y)=tup`  | destrukturim tuple        |

---

*Zymbol-Lang — Simbolik. Universal. I Pandryshueshëm.*

---

> **Shënim:** Ky dokumentacion u krijua dhe u përkthye nga inteligjenca artificiale (IA). Janë bërë të gjitha përpjekjet për të siguruar saktësinë, por disa përkthime ose shembuj mund të përmbajnë gabime. Referenca autoritative është [specifikimet e Zymbol-Lang](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
