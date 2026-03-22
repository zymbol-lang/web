# Manual Kompakt i Zymbol-Lang

**Zymbol-Lang** është një gjuhë programimi simbolike. Ajo nuk përdor fjalë kyçe — gjithçka është simbol. Funksionon njësoj në çdo gjuhë njerëzore.

---

## Filozofia

- Asnjë fjalë kyçe (`nëse`, `cikël`, `kthe` nuk ekzistojnë — vetëm simbole `?`, `@`, `<~`)
- Unicode i plotë — identifikues në çdo gjuhë ose emoji 👋
- Agnostike ndaj gjuhës njerëzore — kodi është identik në çdo gjuhë

---

## Variablat dhe Konstantet

```zymbol
x = 10           // variabël (i ndryshueshëm)
PI := 3.14159    // konstantë (i pandryshueshëm — gabim nëse ricaktohet)
emri = "Ana"
aktiv = #1       // boole i vërtetë
👋 := "Përshëndetje"
```

### Caktimi i Kombinuar

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

## Llojet e të Dhënave

| Lloji          | Shembull            | Simboli `#?` | Shënime                              |
|----------------|---------------------|--------------|--------------------------------------|
| Numër i plotë  | `42`, `-7`          | `###`        | 64-bit me shenjë                     |
| Numër dhjetor  | `3.14`, `1.5e10`    | `##.`        | Notimi shkencor OK                   |
| Varg           | `"përshëndetje"`    | `##"`        | Interpolim: `"Përshëndetje {emri}"`  |
| Karakter       | `'A'`               | `##'`        | Një karakter Unicode                 |
| Boolean        | `#1`, `#0`          | `##?`        | NUK është numerik 1 dhe 0            |
| Varg elementesh | `[1, 2, 3]`        | `##]`        | Të gjitha elementet duhet të jenë i njëjti lloj |
| Tuple          | `(a, b)`            | `##)`        | Pozicional                           |
| Tuple i emërtuar | `(x: 1, y: 2)`    | `##)`        | Qasja me emër ose indeks             |

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

## Lidhja e Vargjeve

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

Bllokuet `{ }` janë **të detyrueshme** edhe për një rresht të vetëm.

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

// Përputhja me vargje
ngjyra = "kuq"
kodi = ?? ngjyra {
    "kuq"   : "#FF0000"
    "gjelbër" : "#00FF00"
    _       : "#000000"
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
dyfishuar(n) {
    ? n <= 1 { <~ 1 }
    <~ n * dyfishuar(n - 1)
}
>> dyfishuar(5) ¶    // → 120

// Funksionet kanë fushë të izoluar — asnjë qasje te variablat e jashtme
global = 100
testoj() {
    x = 42    // vetëm lokale
    <~ x
}
>> testoj() ¶    // → 42
```

> **E rëndësishme**: Funksionet e emërtara `emri(params){ }` nuk janë vlera të klasit të parë.
> Për t'i kaluar si argument, mbështillni: `x -> emri(x)`.

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
arr = [10, 20, 30, 40, 50]

// Qasja (indeks bazë-0)
>> arr[0] ¶    // → 10

// Gjatësia (kërkon kllapa në >>)
numri = arr$#
>> (arr$#) ¶    // → 5

// Shto, hiq, përmban, prerje
arr = arr$+ 60               // shto
arr = arr$- 0                // hiq indeksin 0
ka = arr$? 30                // → #1
prerje = arr$[0..2]          // [20, 30]

// Përditëso elementin
arr[1] = 99

// Për-çdo
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` kthejnë **varg të ri** — caktoni mbrapsht: `arr = arr$+ 4`.
> Pa zinxhir: përdorni dy caktime të ndara.

---

## Tuples

```zymbol
// Tuple i emërtuar
personi = (name: "Alice", age: 25)
>> personi.name ¶    // → Alice
>> personi.age ¶     // → 25
>> personi[0] ¶      // → Alice (indeksi funksionon gjithashtu)
```

---

## Funksionet e Rendit të Lartë

Operatorët HOF kërkojnë **lambda inline** — jo një variabël lambda të drejtpërdrejtë.

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
```

---

## Trajtimi i Gabimeve

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pjesëtim me zero" ¶
} :! ##IO {
    >> "gabim IO" ¶
} :! {
    >> "gabim tjetër: " _err ¶
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
// Skedar: lib/calc.zy
# calc

#> { add, get_PI }    // eksportet PARA definicioneve

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Skedar: main.zy
<# ./lib/calc <= c    // alias i detyrueshëm

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

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

| Simboli  | Operacioni         | Simboli    | Operacioni          |
|----------|--------------------|------------|---------------------|
| `=`      | variabël           | `$#`       | gjatësi             |
| `:=`     | konstantë          | `$+`       | shto                |
| `>>`     | dalje              | `$-`       | hiq (indeks)        |
| `<<`     | hyrje              | `$?`       | përmban             |
| `¶`/`\`  | rresht i ri        | `$[s..e]`  | prerje              |
| `?`      | nëse               | `$>`       | hartëzo             |
| `_?`     | tjetër-nëse        | `$\|`      | filtro              |
| `_`      | tjetër / karakter gjeneral | `$<` | redukto          |
| `??`     | përputh            | `!?`       | provoni             |
| `@`      | cikël              | `:!`       | kapni               |
| `@!`     | ndalo              | `:>`       | në fund             |
| `@>`     | vazhdo             | `$!`       | është gabim         |
| `->`     | lambda             | `$!!`      | përhap gabimin      |
| `<~`     | kthe               | `#`        | deklaro modulin     |
| `\|>`    | tub                | `#>`       | eksporto            |
| `#1`     | i vërtetë          | `<#`       | importo             |
| `#0`     | i rremë            | `::`       | thirrje moduli      |

---

*Zymbol-Lang — Simbolik. Universal. I Pandryshueshëm.*

---

> **Shënim:** Ky dokumentacion u krijua dhe u përkthye nga inteligjenca artificiale (IA). Janë bërë të gjitha përpjekjet për të siguruar saktësinë, por disa përkthime ose shembuj mund të përmbajnë gabime. Referenca autoritative është [specifikimet e Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
