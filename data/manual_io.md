# Kompakta Manualo di Zymbol-Lang

**Zymbol-Lang** esas simbolala programo-linguo. Lu ne uzas klef-vortaro — omno esas simbolo. Lu funcionas same en omna hom-linguo.

- Nula klef-vortaro (`if`, `while`, `return` ne existas — sole simboli `?`, `@`, `<~`)
- Plena Unikodo — identigiloj en irga linguo o emoji 👋
- Linguo-agnostika — la kodo esas identa en omna lingui

---

## Variabli e Konstanti

```zymbol
x = 10              // variablo (muteblа)
PI := 3.14159       // konstanto (nemuteblа — eroro se reassignas)
nomo = "Ana"
aktiva = #1         // boolala vera
👋 := "Saluto"
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

## Dati-Tipi

| Tipo            | Exemple           | Simbolo `#?` | Noti                                |
|-----------------|-------------------|--------------|-------------------------------------|
| Integro         | `42`, `-7`        | `###`        | 64-bita kun signo                   |
| Decimalo        | `3.14`, `1.5e10`  | `##.`        | Sciencala notaco OK                 |
| Stringo         | `"saluto"`        | `##"`        | Interpolado: `"Saluto {nomo}"`      |
| Karaktero       | `'A'`             | `##'`        | Un Unikoda karaktero                |
| Boolano         | `#1`, `#0`        | `##?`        | NE la numeri 1 e 0                  |
| Areo            | `[1, 2, 3]`       | `##]`        | Omni elementi di sama tipo          |
| Tuplo           | `(a, b)`          | `##)`        | Pozicional                          |
| Nomata Tuplo    | `(x: 1, y: 2)`    | `##)`        | Aceptebla per nomo o indico         |

```zymbol
// Tipo-introspekto — returnas (tipo, cifri, valoro)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Exito e Eniro

```zymbol
>> "Saluto, Mondo!" ¶                   // ¶ o \\ donas explicita nova-lineo
>> "a=" a " b=" b ¶                     // multi valori per juxtapozado
>> (arr$#) ¶                            // postfiksa operatori require parentezi

<< nomo                                 // sen promptilo — lektas en variablo
<< "Vua nomo? " nomo                    // kun promptilo
```

> `¶` (AltGr+R sur hispana klavaro) e `\\` esas ekvivalenta kom nova-lineo.

---

## Operatori

```zymbol
// Aritmetiko — uzar assigni; kelki operatori havas kveraji direkta en >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (entjera divizado)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (potencizado)

// Komparado
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logiko
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Kordoni

```zymbol
// Tri formi di konkatenado
nomo = "Ana"
n = 42

msg = "Saluto ", nomo, "!"              // komo — en assigni
>> "Saluto " nomo " tu esas " n ¶       // juxtapozado — en >>
deskrip = "Saluto {nomo}, tu esas {n}"  // interpolado — en irga kontexto
```

```zymbol
s = "Saluto Mondo"
longo = s$#                  // 12
sub = s$[0..6]               // "Saluto"  (fino exkluziva)
havas = s$? "Mondo"          // #1
parti = "a,b,c,d" / ','     // [a, b, c, d]
anst = s$~~["o":"0"]         // "Salut0 M0nd0"
anst1 = s$~~["o":"0":1]      // "Salut0 Mondo"  (unika N)
```

> `+` esas sole por numeri. Uzar `,`, juxtapozado, o interpolado por stringi.

---

## Kontrolo-Fluo

```zymbol
x = 7

? x > 0 { >> "pozitiva" ¶ }

? x > 100 {
    >> "granda" ¶
} _? x > 0 {
    >> "pozitiva" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negativa" ¶
}
```

> Bloki `{ }` esas **requireta** jube por un lineo.

---

## Match

```zymbol
// Intervali
noto = 85
grado = ?? noto {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> grado ¶    // → B

// Stringi
koloro = "reda"
kodo = ?? koloro {
    "reda"   : "#FF0000"
    "verda"  : "#00FF00"
    _        : "#000000"
}

// Gardisti
temp = -5
stato = ?? temp {
    _? temp < 0  : "glacio"
    _? temp < 20 : "kolda"
    _? temp < 35 : "varma"
    _            : "varmega"
}
>> stato ¶    // → glacio

// Bloka formo
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negativa" ¶ }
    _        : { >> "pozitiva" ¶ }
}
```

---

## Bukli

```zymbol
@ i:0..4  { >> i " " }        // inkluziva intervalo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kun pazo:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inversa:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (dum)

frukti = ["pomo", "piro", "uvo"]
@ f:frukti { >> f ¶ }         // por-omna elemento di areo

@ c:"saluto" { >> c "-" }
>> ¶                          // → s-a-l-u-t-o-  (por karakteri di stringo)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> dauro
    ? i > 7 { @! }             // @! rompo
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Infinita buklo
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Etiketa buklo (nestita rompo)
konto = 0
@ @externa {
    konto++
    ? konto >= 3 { @! externa }
}
>> konto ¶                    // → 3
```

---

## Funcioni

```zymbol
adicionar(a, b) { <~ a + b }
>> adicionar(3, 4) ¶    // → 7

faktorialo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorialo(n - 1)
}
>> faktorialo(5) ¶    // → 120
```

Funcioni havas **izolita skopo** — oli ne povas lektar externa variabli. Uzar output-parametri `<~` por modifikar variabli di la vokanto:

```zymbol
interŝanjir(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
interŝanjir(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nomata funcioni ne esas unua-klasa valori. Por pasar kom argumento, envolvar: `x -> fn(x)`.

---

## Lambdi e Klozuri

```zymbol
dupligo = x -> x * 2
sumo = (a, b) -> a + b
>> dupligo(5) ¶    // → 10
>> sumo(3, 7) ¶    // → 10

// Bloka lambdo
klasifikar = x -> {
    ? x > 0 { <~ "pozitiva" }
    _? x < 0 { <~ "negativa" }
    <~ "zero"
}

// Klozuro — kaptas externa skopo
faktoro = 3
tripligo = x -> x * faktoro
>> tripligo(7) ¶    // → 21

// Fabriko
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// En arei
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Arei

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — aceso (0-baza)
arr[-1]         // 5 — negativa indico (lasta)
arr$#           // 5 — longo (uzar (arr$#) en >>)

arr = arr$+ 6            // adicionar → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insertir a indico 2
arr3 = arr$- 3           // forigar prima okazado di valoro
arr4 = arr$-- 3          // forigar omna okazadi
arr5 = arr$-[0]          // forigar a indico
arr6 = arr$-[1..3]       // forigar intervalo (fino exkluziva)

havas = arr$? 3          // #1 — kontenas
poz = arr$?? 3           // [2] — omna indici di valoro
tr = arr$[0..3]          // [1,2,3] — tranchaĵo (fino exkluziva)
tr2 = arr$[0:3]          // [1,2,3] — sama, sintaxo per konto

supren = arr$^+          // ordigita krescanta  (primitive sole)
desupren = arr$^-        // ordigita dekrescanta (primitive sole)

// Nomata/pozicional tuplo-arei — uzar $^ kun komparant-lambdo
db = [(nomo: "Karla", ago: 28), (nomo: "Ana", ago: 25), (nomo: "Bob", ago: 30)]
per_ago  = db$^ (a, b -> a.ago < b.ago)     // krescanta per ago  (<)
per_nomo = db$^ (a, b -> a.nomo > b.nomo)   // dekrescanta per nomo (>)
>> per_ago[0].nomo ¶     // → Ana
>> per_nomo[0].nomo ¶    // → Karla

arr[1] = 99              // ĝisdatigo in-loke
arr = arr[1]$~ 99        // funkciala ĝisdatigo — returnas nova areo
```

> Omna kolekto-operatori returnas **nova areo**. Reassignar: `arr = arr$+ 4`.
> Operatori ne povas katenesar — uzar meza assigni.
> `$^+` / `$^-` ordigas **primitiva arei** (numeri, stringi). Por tuplo-arei uzar `$^` kun komparant-lambdo — la direkco esas kodita en la lambdo (`<` = krescanta, `>` = dekrescanta).

```zymbol
// Nestita arei
matrico = [[1,2,3],[4,5,6],[7,8,9]]
>> matrico[1][2] ¶    // → 6
```

---

## Destrükturado

```zymbol
// Areo
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[prima, *resto] = arr        // prima=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ forjetas

// Pozicional tuplo
punkto = (100, 200)
(px, py) = punkto            // px=100  py=200

// Nomata tuplo
persono = (nomo: "Ana", ago: 25, urbo: "Madrido")
(nomo: n, ago: a) = persono  // n="Ana"  a=25
```

---

## Tupli

```zymbol
// Pozicional
punkto = (10, 20)
>> punkto[0] ¶    // → 10

// Nomata
persono = (nomo: "Alice", ago: 25)
>> persono.nomo ¶    // → Alice
>> persono[0] ¶      // → Alice  (indico anke funcionas)

// Nestita
poz = (x: 10, y: 20)
p = (poz: poz, etiketo: "origino")
>> p.poz.x ¶         // → 10
```

---

## Supera-Orda Funcioni

> HOF-operatori require **interna lambdo** — lambdo-variabli direkta pasita ne funcionas.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dupligi  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pari     = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totalo   = nums$< (0, (acc, x) -> acc + x)    // reduce → 55

// Katenado per meza-valori
pazo1 = nums$| (x -> x > 3)
pazo2 = pazo1$> (x -> x * x)
>> pazo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nomata funcioni en HOF — envolvar en lambdo
dupligo(x) { <~ x * 2 }
r = nums$> (x -> dupligo(x))    // ✅
```

---

## Tubo Operatoro

La dextra flanko esas sempre requireta `_` kom anstataŭanto por la tubizita valoro:

```zymbol
dupligo = x -> x * 2
adicionar = (a, b) -> a + b
inkremento = x -> x + 1

5 |> dupligo(_)        // → 10
10 |> adicionar(_, 5)  // → 15
5 |> adicionar(2, _)   // → 7

// Katenita
r = 5 |> dupligo(_) |> inkremento(_) |> dupligo(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Eroro-Handlado

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divizado per zero" ¶
} :! {
    >> "altra eroro: " _err ¶    // _err tenas la eroro-mesajo
} :> {
    >> "sempre exekutas" ¶
}
```

| Tipo        | Kande eventas                  |
|-------------|--------------------------------|
| `##Div`     | Divizado per zero              |
| `##IO`      | Dosiero / sistemo              |
| `##Index`   | Indico extra limiti            |
| `##Type`    | Tipo-eroro                     |
| `##Parse`   | Parsado-eroro                  |
| `##Network` | Reto-eroro                     |
| `##_`       | Irga eroro (kaptu-omna)        |

---

## Moduli

```zymbol
// lib/calc.zy
# calc

#> { adicionar, get_PI }    // exporti ANTE la deklaradi

_PI := 3.14159
adicionar(a, b) { <~ a + b }
get_PI() { <~ _PI }         // getter — direkta konstanto-aceso per alias ne subtenata
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias requireta

>> c::adicionar(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Exportar kun diferanta publika nomo
# mibiblioteko
#> { _interna_adicionar <= sumo }

_interna_adicionar(a, b) { <~ a + b }
```

```zymbol
<# ./mibiblioteko <= m

>> m::sumo(3, 4) ¶    // → 7  (interna nomo _interna_adicionar esas kaŝita)
```

---

## Datumi Operatori

```zymbol
// Parsizar stringo a numero
v1 = #|"42"|      // → 42  (Integro)
v2 = #|"3.14"|    // → 3.14  (Decimalo)
v3 = #|"abc"|     // → "abc"  (fail-safe, sen eroro)

// Rondigar / trunkar
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rondigar a 2 decimali)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunkar)

// Numero-formatado
fmt = #,|1234567|      // → 1,234,567  (kun kometi)
sci = #^|12345.678|    // → 1.2345678e4  (sciencala)

// Baza literali
a = 0x41         // → 'A'  (hexadecimala)
b = 0b01000001   // → 'A'  (binara)
c = 0o101        // → 'A'  (oktala)

// Baza konvertado exito
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
okt = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Integrado

```zymbol
dato = <\ date +%Y-%m-%d \>     // kaptas stdout (inkluzas fina \n)
>> "Hodie: " dato

dosiero = "datumi.txt"
enhavo = <\ cat {dosiero} \>    // interpolado en komandi

exito = </"./subskripto.zy"/>   // exekutar altra Zymbol-skripto, kaptar exito
>> exito
```

> `><` kaptas CLI-argumenti kom stringo-areo (sole arba-piedisto).

---

## Kompleta Exemplo: FizzBuzz

```zymbol
klasifikar(nombro) {
    ? nombro % 15 == 0 { <~ "FizzBuzz" }
    _? nombro % 3  == 0 { <~ "Fizz" }
    _? nombro % 5  == 0 { <~ "Buzz" }
    _ { <~ nombro }
}

@ i:1..20 { >> klasifikar(i) ¶ }
```

---

## Simbolo-Referenaro

| Simbolo    | Operaco            | Simbolo      | Operaco                 |
|------------|--------------------|--------------|-------------------------|
| `=`        | variablo           | `$#`         | longo                   |
| `:=`       | konstanto          | `$+`         | adicionar               |
| `>>`       | exito              | `$+[i]`      | insertir a indico       |
| `<<`       | eniro              | `$-`         | forigar prima per valor |
| `¶` / `\\` | nova-lineo         | `$--`        | forigar omna per valor  |
| `?`        | se (if)            | `$-[i]`      | forigar a indico        |
| `_?`       | altra-se (elif)    | `$-[i..j]`   | forigar intervalo       |
| `_`        | altra / kovrilo    | `$?`         | kontenas                |
| `??`       | match              | `$??`        | trovar omna indici      |
| `@`        | buklo              | `$[s..e]`    | tranchaĵo               |
| `@!`       | rompo (break)      | `$>`         | map                     |
| `@>`       | dauro (continue)   | `$\|`        | filter                  |
| `->`       | lambdo             | `$<`         | reduce                  |
| `$^+`      | ordigar krescanta  | `$^-`        | ordigar dekrescanta     |
| `$^`       | ordigar kun komp.  | `$~`         | funkciala ĝisdatigo     |
| `<~`       | returnar           | `!?`         | provar (try)            |
| `\|>`      | pipo               | `:!`         | kaptar (catch)          |
| `#1`       | vera               | `:>`         | sempre (finally)        |
| `#0`       | falsa              | `$!`         | esas eroro              |
| `<#`       | importar           | `$!!`        | propagar eroro          |
| `#`        | deklaran modulo    | `#>`         | exportar                |
| `::`       | modulo-voko        | `.`          | aceso a kampo           |
| `#\|..\|`  | parsizar numero    | `#?`         | tipo metadati           |
| `#.N\|..\|` | rondigar          | `#!N\|..\|`  | trunkar                 |
| `c\|..\|`  | formato kometo     | `e\|..\|`    | sciencala               |
| `<\ ..\>`  | shell exekut.      | `><`         | CLI-argumenti           |

---

*Zymbol-Lang — Simbolala. Universala. Nemuteblа.*

> **Noto:** Ica dokumentado esis kreita e tradukita da Artefarita Inteligenco (AI).
> La autoritata referenaro esas la [Zymbol-Lang specifiko](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
