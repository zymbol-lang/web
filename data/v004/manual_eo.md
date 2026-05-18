# Kompakta Zymbol-Lang Manlibro

**Zymbol-Lang** estas simbola programlingvo. Ĝi ne uzas ŝlosilvortojn — ĉio estas simbolo. Ĝi funkcias same en ĉiu homa lingvo.

- Neniaj ŝlosilvortoj (`se`, `buklo`, `redonu` ne ekzistas — nur simboloj `?`, `@`, `<~`)
- Plena Unicode — identigiloj en ĉiu lingvo aŭ emoji 👋
- Homa-lingvo-agnostika — la kodo estas identa en ĉiu lingvo

---

## Variabloj kaj Konstantoj

```zymbol
x = 10              // variablo (ŝanĝebla)
PI := 3.14159       // konstanto (neŝanĝebla — eraro se retransdona)
nomo = "Ana"
aktiva = #1         // bulea vera
👋 := "Saluton"
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

## Datumtipoj

| Tipo           | Ekzemplo            | Simbolo `#?` | Notoj                               |
|----------------|---------------------|--------------|-------------------------------------|
| Entjero        | `42`, `-7`          | `###`        | 64-bita kun signo                   |
| Glitpunkto     | `3.14`, `1.5e10`    | `##.`        | Scienca notacio OK                  |
| Ĉeno           | `"saluton"`         | `##"`        | Interpolado: `"Saluton {nomo}"`     |
| Signo          | `'A'`               | `##'`        | Unu Unicode-signo                   |
| Buleo          | `#1`, `#0`          | `##?`        | NE numeraj 1 kaj 0                  |
| Tabelo         | `[1, 2, 3]`         | `##]`        | Ĉiuj eroj devas esti de sama tipo   |
| Oplo           | `(a, b)`            | `##)`        | Pozicia                             |
| Nomita Oplo    | `(x: 1, y: 2)`      | `##)`        | Aliro per nomo aŭ indekso           |

```zymbol
// Tipintrospekto — redonas (tipo, ciferoj, valoro)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Eligo kaj Enigo

```zymbol
>> "Saluton, Esperanta Mondo!" ¶        // ¶ aŭ \\ donas eksplicitan novlinion
>> "a=" a " b=" b ¶                     // multaj valoroj per apudmeto
>> (frukto$#) ¶                         // postfiks-operatoroj bezonas krampojn

<< nomo                                 // sen promptilo — legas en variablon
<< "Via nomo? " nomo                    // kun promptilo
```

> `¶` (AltGr+R en hispana klavaro) kaj `\\` estas ekvivalentaj kiel novlinio.

---

## Operatoroj

```zymbol
// Aritmetiko — uzu atribuojn; iuj operatoroj havas kverojn rekte en >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (entjera divido)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potenco)

// Komparo
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logiko
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Ĉenoj

```zymbol
// Tri konkatenaj formoj
nomo = "Ana"
n = 42

mesaĝo = "Saluton ", nomo, "!"              // komo — en atribuoj
>> "Saluton " nomo " vi estas " n ¶         // apudmeto — en >>
priskribo = "Saluton {nomo}, vi estas {n}"  // interpolado — ĉie
```

```zymbol
s = "Saluton Mondo"
longo = s$#                  // 13
sub = s$[0..7]               // "Saluton"  (fino ekskluziva)
havas = s$? "Mondo"          // #1
partoj = "a,b,c,d" / ','    // [a, b, c, d]
anst = s$~~["o":"0"]         // "Salut0n M0nd0"
anst1 = s$~~["o":"0":1]      // "Salut0n Mondo"  (nur unua N)
```

> `+` estas nur por nombroj. Uzu `,`, apudmeton, aŭ interpoladon por ĉenoj.

---

## Kontrolfluo

```zymbol
x = 7

? x > 0 { >> "pozitiva" ¶ }

? x > 100 {
    >> "granda" ¶
} _? x > 0 {
    >> "pozitiva" ¶
} _? x == 0 {
    >> "nulo" ¶
} _ {
    >> "negativa" ¶
}
```

> Blokoj `{ }` estas **devigaj** eĉ por unu frazo.

---

## Kongruado

```zymbol
// Intervaloj
poentoj = 85
takso = ?? poentoj {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> takso ¶    // → B

// Ĉenoj
koloro = "ruĝa"
kodo = ?? koloro {
    "ruĝa"   : "#FF0000"
    "verda"  : "#00FF00"
    _        : "#000000"
}

// Gardistoj
temperaturo = -5
stato = ?? temperaturo {
    _? temperaturo < 0  : "glacio"
    _? temperaturo < 20 : "malvarma"
    _? temperaturo < 35 : "varma"
    _                   : "varmega"
}
>> stato ¶    // → glacio

// Bloka formo
?? n {
    0        : { >> "nulo" ¶ }
    _? n < 0 : { >> "negativa" ¶ }
    _        : { >> "pozitiva" ¶ }
}
```

---

## Bukloj

```zymbol
@ i:0..4  { >> i " " }        // inkluziva intervalo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kun paŝo:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inversa:              5 4 3 2 1 0

nombro = 1
@ nombro <= 64 { nombro *= 2 }
>> nombro ¶                   // → 128  (dum)

frukto = ["pomo", "piro", "vinbero"]
@ f:frukto { >> f ¶ }         // por-ĉiu tabelo

@ c:"saluton" { >> c "-" }
>> ¶                          // → s-a-l-u-t-o-n-  (por-ĉiu ĉeno)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> daŭrigu
    ? i > 7 { @! }             // @! haltu
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Senfina buklo
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Etikedita buklo (nestitaj haltoj)
kalkulo = 0
@ @ekstera {
    kalkulo++
    ? kalkulo >= 3 { @! ekstera }
}
>> kalkulo ¶                  // → 3
```

---

## Funkcioj

```zymbol
aldoni(a, b) { <~ a + b }
>> aldoni(3, 4) ¶    // → 7

faktorialo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorialo(n - 1)
}
>> faktorialo(5) ¶    // → 120
```

Funkcioj havas **izolitan amplekson** — ili ne povas legi eksterajn variablojn. Uzu elirajn parametrojn `<~` por modifi variablojn de la vokanto:

```zymbol
interŝanĝi(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
interŝanĝi(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nomitaj funkcioj ne estas unua-klasaj. Por pasi kiel argumento, envolvu: `x -> fn(x)`.

---

## Lambdoj kaj Fermoj

```zymbol
duobligita = x -> x * 2
sumo = (a, b) -> a + b
>> duobligita(5) ¶    // → 10
>> sumo(3, 7) ¶       // → 10

// Bloka lambdo
klasifiki = x -> {
    ? x > 0 { <~ "pozitiva" }
    _? x < 0 { <~ "negativa" }
    <~ "nulo"
}

// Fermo — kaptas eksteran amplekson
faktoro = 3
triobligita = x -> x * faktoro
>> triobligita(7) ¶    // → 21

// Fabriko
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// En tabeloj
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Aroj

Aroj estas **ŝanĝeblaj** kaj enhavas elementojn de la **sama tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — aliro (0-baza)
arr[-1]         // 5 — negativa indekso (lasta)
arr$#           // 5 — longo (uzu (arr$#) en >>)

arr = arr$+ 6            // aldonu → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // enmetu ĉe indekso 2
arr3 = arr$- 3           // forigu unuan aperon de valoro
arr4 = arr$-- 3          // forigu ĉiujn aperojn
arr5 = arr$-[0]          // forigu ĉe indekso
arr6 = arr$-[1..3]       // forigu intervalon (fino ekskluziva)

havas = arr$? 3          // #1 — enhavas
poz = arr$?? 3           // [2] — ĉiuj indeksoj de valoro
tr = arr$[0..3]          // [1,2,3] — tranĉo (fino ekskluziva)
tr2 = arr$[0:3]          // [1,2,3] — sama, laŭ-kvanta sintakso

supren = arr$^+          // ordigita kreskanta  (nur primitivoj)
malsupren = arr$^-       // ordigita malkres.   (nur primitivoj)

// Nomitaj/poziciaj tabeloj de oploj — uzu $^ kun kompara lambdo
db = [(nomo: "Karla", aĝo: 28), (nomo: "Ana", aĝo: 25), (nomo: "Bob", aĝo: 30)]
laŭ_aĝo  = db$^ (a, b -> a.aĝo < b.aĝo)     // kreskanta laŭ aĝo  (<)
laŭ_nomo = db$^ (a, b -> a.nomo > b.nomo)   // malkres. laŭ nomo (>)
>> laŭ_aĝo[0].nomo ¶     // → Ana
>> laŭ_nomo[0].nomo ¶    // → Karla

// Rekta ĝisdatigo de elemento (nur aroj)
arr[1] = 99              // asigni
arr[0] += 5              // kunmetita: +=  -=  *=  /=  %=  ^=

// Funkcia ĝisdatigo — redonas novan tabelon; la originalo ne ŝanĝiĝas
arr2 = arr[1]$~ 99
```

> Ĉiuj kolektaj operatoroj redonas **novan tabelon**. Reattributu: `arr = arr$+ 4`.
> Operatoroj ne povas esti ĉenataj — uzu mezajn atribuojn.
> `$^+` / `$^-` ordigas **primitivajn tabelojn** (nombroj, ĉenoj). Por oplaj tabeloj uzu `$^` kun kompara lambdo — la direkto estas kodita en la lambdo (`<` = kreskanta, `>` = malkreskanta).

**Valora semantiko** — asigni tabelon al alia variablo kreas sendependan kopion:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ne estas tuŝita
```

```zymbol
// Nestitaj tabeloj
matrico = [[1,2,3],[4,5,6],[7,8,9]]
>> matrico[1][2] ¶    // → 6
```

---

## Malkunstrukturado

```zymbol
// Tabelo
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[unua, *resto] = arr         // unua=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ forĵetas

// Pozicia oplo
punkto = (100, 200)
(px, py) = punkto            // px=100  py=200

// Nomita oplo
persono = (nomo: "Ana", aĝo: 25, urbo: "Madrido")
(nomo: n, aĝo: a) = persono  // n="Ana"  a=25
```

---

## Tuploj

Tuploj estas **neŝanĝeblaj** ordigitaj ujoj, kiuj povas enhavi valorojn de **malsamaj tipoj**. Male al aroj, elementoj ne povas esti ŝanĝitaj post kreado.

```zymbol
// Pozicia
punkto = (10, 20)
>> punkto[0] ¶    // → 10

datumoj = (42, "saluton", #1, 3.14)
>> datumoj[2] ¶     // → #1

// Nomita
persono = (nomo: "Alice", aĝo: 25)
>> persono.nomo ¶    // → Alice
>> persono[0] ¶      // → Alice  (indekso ankaŭ funkcias)

// Nestita
poz = (x: 10, y: 20)
p = (poz: poz, etikedo: "origino")
>> p.poz.x ¶        // → 10
```

**Neŝanĝebleco** — ĉiu provo modifi tuploelementon estas eraro dum ekzekuto:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ eraro dum ekzekuto: tuploj estas neŝanĝeblaj
// t[0] += 5    // ❌ sama eraro
```

Por derivi modifitan valoron uzu `$~` (funkcia ĝisdatigo) — redonas **novan** tuplon:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalo ne ŝanĝiĝis
>> t2 ¶    // → (10, 999, 30)

// Nomita tuplo — rekonstrui eksplicite
persono = (nomo: "Alice", aĝo: 25)
pliagxa  = (nomo: persono.nomo, aĝo: 26)
>> persono.aĝo ¶    // → 25
>> pliagxa.aĝo ¶    // → 26
```

---

## Higher-Ordaj Funkcioj

> HOF-operatoroj bezonas **enlinian lambdon** — lambdaj variabloj rekte pasitaj ne funkcias.

```zymbol
nombroj = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

duobligitaj = nombroj$> (x -> x * 2)              // mapo  → [2,4,6…20]
paroj       = nombroj$| (x -> x % 2 == 0)         // filtro → [2,4,6,8,10]
entute      = nombroj$< (0, (acc, x) -> acc + x)  // redukto → 55

// Ĉenado per mezaĵoj
paŝo1 = nombroj$| (x -> x > 3)
paŝo2 = paŝo1$> (x -> x * x)
>> paŝo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nomitaj funkcioj ene de HOF — envolvu en lambdo
duobligita(x) { <~ x * 2 }
r = nombroj$> (x -> duobligita(x))    // ✅
```

---

## Pipa Operatoro

La dekstra flanko ĉiam bezonas `_` kiel anstataŭilon por la pipita valoro:

```zymbol
duobligita = x -> x * 2
aldoni = (a, b) -> a + b
pliigi = x -> x + 1

5 |> duobligita(_)        // → 10
10 |> aldoni(_, 5)        // → 15
5 |> aldoni(2, _)         // → 7

// Ĉenita
r = 5 |> duobligita(_) |> pliigi(_) |> duobligita(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Eraro-Traktado

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divido per nulo" ¶
} :! {
    >> "alia eraro: " _err ¶    // _err tenas la erarmesaĝon
} :> {
    >> "ĉiam kuras" ¶
}
```

| Tipo        | Kiam okazas               |
|-------------|---------------------------|
| `##Div`     | Divido per nulo           |
| `##IO`      | Dosiero / sistemo         |
| `##Index`   | Indekso ekster limoj      |
| `##Type`    | Tiperaro                  |
| `##Parse`   | Datuma analizado          |
| `##Network` | Retaj eraroj              |
| `##_`       | Iu ajn eraro (kaptu-ĉion) |

---

## Moduloj

```zymbol
// lib/calc.zy
# calc

#> { aldoni, get_PI }    // eksportoj ANTAŬ difinoj

_PI := 3.14159
aldoni(a, b) { <~ a + b }
get_PI() { <~ _PI }      // alirilo — rekta konstanta aliro per kaŝnomo ne subtenata
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias deviga

>> c::aldoni(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksporto kun malsama publika nomo
# mibiblioteko
#> { _interna_aldoni <= sumo }

_interna_aldoni(a, b) { <~ a + b }
```

```zymbol
<# ./mibiblioteko <= m

>> m::sumo(3, 4) ¶    // → 7  (interna nomo _interna_aldoni estas kaŝita)
```

---

## Cifera Reĝimoj

Zymbol povas montri nombrojn en **69 Unikodaj ciferaj skriboj** — Devanagari, Araba-Hinda, Taja, Klingona pIqaD, Matematika Grasa, LCD-segmentoj kaj pli. La aktiva reĝimo nur influas la eliron `>>`; la interna aritmetiko estas ĉiam duuma.

### Aktivigi skribon

Skribu la ciferon `0` kaj `9` de la celita skribo inter `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Araba-Hinda   (U+0660–U+0669)
#๐๙#    // Taja          (U+0E50–U+0E59)
#09#    // restarigi al ASCII
```

### Eliro kaj bulea valoroj

```zymbol
x = 42
>> x ¶          // → 42   (ASCII defaŭlte)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dekuma punkto ĉiam ASCII)
>> 1 + 2 ¶      // → ३

// Buleaj: # prefikso ĉiam ASCII, cifero adaptiĝas
>> #1 ¶         // → #१   (vera en Devanagari)
>> #0 ¶         // → #०   (malvera — distingas de ०  entjera nulo)

x = 28 > 4
>> x ¶          // → #१   (kompara rezulto sekvas aktivan reĝimon)
```

### Indiĝenaj ciferaj literaloj en fontkodo

Ciferoj de ajna subtenata skribo estas validaj literaloj — en intervaloj, modulo, komparoj:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Buleaj literaloj en ajna skribo

`#` + cifero `0` aŭ `1` el ajna bloko estas valida bulea literalo:

```zymbol
#٠٩#
نشط = #١        // sama kiel #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` estas **ĉiam ASCII**. `#0` (malvera) ĉiam estas vide distinga de `0` (entjera nulo) en ĉiu skribo.

---

## Datumaj Operatoroj

```zymbol
// Analizi ĉenon al nombro
v1 = #|"42"|      // → 42  (Entjero)
v2 = #|"3.14"|    // → 3.14  (Glitpunkto)
v3 = #|"abc"|     // → "abc"  (malsukceso-sekura, sen eraro)

// Rondigi / trunki
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rondigi al 2 decimaloj)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunki)

// Nombra formatado
fmt = #,|1234567|      // → 1,234,567  (kun komoj)
sci = #^|12345.678|    // → 1.2345678e4  (scienca)

// Bazaj literaloj
a = 0x41         // → 'A'  (heksa)
b = 0b01000001   // → 'A'  (binara)
c = 0o101        // → 'A'  (okta)

// Baza konverta eligo
heks = 0x|255|    // → "0x00FF"
bin  = 0b|65|     // → "0b1000001"
okt  = 0o|8|      // → "0o10"
dec  = 0d|255|    // → "0d0255"
```

---

## Ŝela Integriĝo

```zymbol
dato = <\ date +%Y-%m-%d \>     // kaptas stdout (inkluzive fina \n)
>> "Hodiaŭ: " dato

dosiero = "datumoj.txt"
enhavo = <\ cat {dosiero} \>    // interpolado en komandoj

eligo = </"./subskripto.zy"/>   // ekzekuti alian Zymbol-skripton, kapti eliron
>> eligo
```

> `><` kaptas CLI-argumentojn kiel ĉenan tabelon (nur arba-piedisto).

---

## Plena Ekzemplo: FizzBuzz

```zymbol
klasifiki(nombro) {
    ? nombro % 15 == 0 { <~ "FizzBuzz" }
    _? nombro % 3  == 0 { <~ "Fizz" }
    _? nombro % 5  == 0 { <~ "Buzz" }
    _ { <~ nombro }
}

@ i:1..20 { >> klasifiki(i) ¶ }
```

---

## Referenca Tabelo de Simboloj

| Simbolo  | Operacio           | Simbolo      | Operacio              |
|----------|--------------------|--------------|-----------------------|
| `=`      | variablo           | `$#`         | longo                 |
| `:=`     | konstanto          | `$+`         | aldonu                |
| `>>`     | eligo              | `$+[i]`      | enmetu ĉe indekso     |
| `<<`     | enigo              | `$-`         | forigu unuan per val. |
| `¶` / `\\` | novlinio         | `$--`        | forigu ĉiujn per val. |
| `?`      | se                 | `$-[i]`      | forigu ĉe indekso     |
| `_?`     | alie-se            | `$-[i..j]`   | forigu intervalon     |
| `_`      | alie / ĵokero      | `$?`         | enhavas               |
| `??`     | kongruado          | `$??`        | trovas ĉiujn indeksojn|
| `@`      | buklo              | `$[s..e]`    | tranĉo                |
| `@!`     | haltu              | `$>`         | mapu                  |
| `@>`     | daŭrigu            | `$\|`        | filtru                |
| `->`     | lambdo             | `$<`         | reduktu               |
| `arr[i] = val` | ĝisdatigi elementon (nur aroj) | `arr[i] += val` | kunmetita ĝisdatigo |
| `arr[i]$~` | funkcia ĝisdatigo (nova kopio) | `$^+` | ordigu kreskanta |
| `$^-` | ordigu malkreskanta | `$^` | ordigu kun kompara lambdo |
| `<~`     | redonu             | `!?`         | provu                 |
| `\|>`    | tubo               | `:!`         | kaptu                 |
| `#1`     | vera               | `:>`         | fine                  |
| `#0`     | malvera            | `$!`         | estas eraro           |
| `<#`     | importu            | `$!!`        | disvastigu eraron     |
| `#`      | deklaru modulon    | `#>`         | eksportu              |
| `::`     | modulovoko         | `.`          | aliro al kampo        |
| `#\|..\|` | analizu nombron  | `#?`         | tiaj metadatenoj      |
| `#.N\|..\|` | rondigi        | `#!N\|..\|`  | trunki                |
| `#,\|..\|` | komforma         | `#^\|..\|`    | scienca               |
| `#d0d9#` | ŝaltilo de cifera reĝimo | `#09#` | restarigi al ASCII |
| `<\ ..\>` | ŝela ekz.        | `><`         | CLI-argumentoj        |

## Versiohistorio

### v0.0.3 — Unikodaj Ciferaj Sistemoj & LSP Plibonigoj _(Aprilo 2026)_

- **Aldonita** 69 Unikodaj ciferaj blokoj kun la reĝim-ŝalt-ĵetono `#d0d9#`
- **Aldonita** Buleaj literaloj en ajna skribo — `#१` / `#०`, `#१` / `#٠`, ktp.
- **Aldonita** Klingonaj pIqaD ciferoj (CSUR PUA U+F8F0–U+F8F9)
- **Aldonita** VM opkodo `SetNumeralMode` — plena pareco kun la arbmarŝanto
- **Aldonita** REPL respektas aktivan ciferon reĝimon en eĥo kaj montrado de variabloj
- **Ŝanĝita** La `>>` eliro de buleaj valoroj nun inkluzivas la prefikson `#` (`#0` / `#1`) en ĉiuj reĝimoj

### v0.0.2_01 — Renomado de Operatoroj _(30 Mar 2026)_

- **Ŝanĝita** `c|..|` → `#,|..|` kaj `e|..|` → `#^|..|` — konsekvenca kun la `#`-prefiksa familio
- **Aldonita** Eksporta kromnomo: reeksporti modulanojn sub alia nomo

### v0.0.2 — Kolekto-API Reenkonceptigo & Instaliloj _(24 Mar 2026)_

- **Aldonita** Unuigita `$`-operatora familio por tabeloj kaj ĉenoj (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Aldonita** Malstrukturo por tabeloj, opoj kaj nomitaj opoj
- **Aldonita** Negativaj indicoj (`arr[-1]` = lasta elemento)
- **Aldonita** Denaskaj instaliloj — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Aldonita** Kunmetita asigno `^=`
- **Korektita** Limkazoj de aritmetika analizilo; dokumentadaj korektoj

### v0.0.1 — Unua Publika Eldono _(22 Mar 2026)_

- Arbmarŝanta interpretilo + registro-VM (`--vm`, ~4× pli rapida, ~95% pareco)
- Ĉiuj kernaj konstruoj: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plenaj Unikodaj identigiloj, modula sistemo, lambdoj, fermoj, eraro-traktado
- REPL, LSP, VS Code etendaĵo, formatiilo (`zymbol fmt`)

---

*Zymbol-Lang — Simbola. Universala. Neŝanĝebla.*

> **Rimarko:** Ĉi tiu dokumentaro estis kreita kaj tradukita de artefarita inteligenteco (AI).
> La autoritata referenco estas la [Zymbol-Lang specifiko](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
