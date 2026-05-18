> **Daxuyanî:** Ev belge bi alîkariya hişmendiya çêkirî (AI) hatiye çêkirin.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referansa kanonî **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ye di depoya şîroveker de.

<div dir="rtl">

# Rêbernameya Zymbol-Lang

**Zymbol-Lang** zimanekî bernamewesî yê sembolîk e. Peyvên kilît tune — her tişt sembol e. Bi awayekî wekhev di her zimanê mirovî de dixebite.

- `if`، `while`، `return` tune — tenê `?`، `@`، `<~`
- Unicode ya tev — nasnav bi her zimanî an emojiyî
- Ji zimanê mirovî serbixwe — kod li her derê yek e

**Guhertoya şîroveker**: v0.0.4 | **Bergirtina ceribandinan**: 393/393 (wekheviya TW ↔ VM)

---

## Guhêrbar û domdar

```zymbol
x = 10              // guhêrbara guhêrbar
PI := 3.14159       // domdar — ji nû ve tayînkirin xeletiya dema xebitandinê ye
nav = "Alice"
çalak = #1          // Booleyan rast
👋 := "Silav"
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

## Cûreyên Daneyê

| Cûre | Literal | Etîketa `#?` | Nîşe |
|------|---------|--------------|------|
| Hejmara tev | `42`, `-7` | `###` | 64-bitî bi nîşan |
| Xweher | `3.14`, `1.5e10` | `##.` | Nîşana zanistî destûr e |
| Rêz | `"nivîs"` | `##"` | Navbirakirin: `"Silav {nav}"` |
| Tîp | `'A'` | `##'` | Yek tîpa Unicode |
| Booleyan | `#1`, `#0` | `##?` | NE hejmarî ye — `#1 ≠ 1` |
| Rêzik | `[1, 2, 3]` | `##]` | Hêmanên hemcure |
| Tupl | `(a, b)` | `##)` | Cihî |
| Tupla navdar | `(x: 1, y: 2)` | `##)` | Zeviyên navdar |
| Fonksiyon | referansa fonksiyona navdar | `##()` | Pola yekem; nîşan dide `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pola yekem; nîşan dide `<lambd/N>` |

```zymbol
// Teşhîsa cûreyê — vedigerîne (cûre، reqem، nirx)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

---

## Derketin û Têketin

```zymbol
>> "Silav" ¶                       // ¶ an \\ ji bo rêza nû ya eşkere
>> "a=" a " b=" b ¶               // li tenişt hev danîn — nirxên pirjimar
>> (arr$#) ¶                       // operatorên postfix ( ) hewce dikin di >> de

<< nav                           // bixwîne nav guhêrbarekê (bê daxwaz)
<< "Navê xwe binivîse: " nav      // bi daxwazê re
```

> `¶` (AltGr+R li ser klavyeya spanî) û `\\` ji bo rêza nû wekhev in.

---

## Operator

```zymbol
// Hesabî — tayînkirinê bikar bînin; hin operatorên taybetmendiyên rasterast di >> de hene
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (dabeşkirina hejmarên tev)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (hêzkirin)

// Berhevdan
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Mantiqî
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Rêz

```zymbol
// Du şêweyên girêdanê
nav = "Alice"
n = 42

>> "Silav " nav " te hene " n ¶       // li tenişt hev danîn — di >> de
rave = "Silav {nav}، te hene {n}"     // navbirakirin — li her derê
```

```zymbol
r = "Silav Cîhan"
dirêjahî = r$#                  // 10 (bi awayê tîpan ve girêdayî)
bin = r$[1..5]                 // "Silav"  (bingeha-1، dawî tê de)
heye = r$? "Cîhan"             // #1
beş = "a,b,c,d"$/ ','          // [a, b, c, d]  (bi veqetîner dabeş bike)
guhartî = r$~~["s":"ş"]        // "Şilav Cîhan"
guhartî1 = r$~~["s":"ş":1]     // "Şilav Cîhan"  (tenê N yên pêşîn)
```

> `+` tenê ji bo hejmaran e. Ji bo rêzan `,`، li tenişt hev danîn، an navbirakirinê bikar bînin.

---

---

## Herika Kontrolê

```zymbol
x = 7

? x > 0 { >> "erênî" ¶ }

? x > 100 {
    >> "mezin" ¶
} _? x > 0 {
    >> "erênî" ¶
} _? x == 0 {
    >> "sifir" ¶
} _ {
    >> "neyînî" ¶
}
```

> Kevançeyên gir `{ }` **pêwist in** tewra ji bo yek gotinê jî.

---

## Lihevhatin (Match)

```zymbol
// Rêje
puan = 85
not = ?? puan {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> not ¶      // → B

// Rêz
reng = "sor"
kod = ?? reng {
    "sor"   : "#FF0000"
    "kesk"  : "#00FF00"
    _       : "#000000"
}

// Nimûneyên berhevdanê
germahî = -5
rewş = ?? germahî {
    < 0  : "qeşa"
    < 20 : "sar"
    < 35 : "şîrîn"
    _    : "germ"
}
>> rewş ¶      // → qeşa

// Şêweya gotinê (blok)
?? n {
    0        : { >> "sifir" ¶ }
    _? n < 0 : { >> "neyînî" ¶ }
    _        : { >> "erênî" ¶ }
}
```

---

## Gerok

```zymbol
@ i:0..4  { >> i " " }        // rêje tê de:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // bi gavê:     1 3 5 7 9
@ i:5..0:1 { >> i " " }       // berevajî:    5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (heya ku)

fêkî = ["sêv", "hirmî", "tirî"]
@ f:fêkî { >> f ¶ }           // ji bo her hêmaneke rêzika

@ t:"silav" { >> t "-" }
>> ¶                          // → s-i-l-a-v-  (ji bo her tîpa rêzê)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> berdewam bike
    ? i > 7 { @! }            // @! bişkîne
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Geroka bêdawî
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Geroka bi etiketê (bişkîna hêlî)
hejmar = 0
@:derveyî {
    hejmar++
    ? hejmar >= 3 { @:derveyî! }
}
>> hejmar ¶                   // → 3
```

---

## Fonksiyon

```zymbol
lêzêde(a, b) { <~ a + b }
>> lêzêde(3, 4) ¶   // → 7

faktoriyal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyal(n - 1)
}
>> faktoriyal(5) ¶    // → 120
```

Fonksiyon **qada veqetandî** heye — nikarin guhêrbarên derveyî bixwînin. Ji bo guhertina guhêrbarên bangker parametreyên derketinê `<~` bikar bînin:

```zymbol
biguhêre(a<~, b<~) {
    demkî = a
    a = b
    b = demkî
}
x = 10
y = 20
biguhêre(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fonksiyonên navdar **nirxên pola yekem in** — rasterast bişînin: `nums$> ducar`. `x -> fn(x)` jî derbasdar e.

---

---

## Lambda û Girtin

```zymbol
ducar = x -> x * 2
lêzêde = (a, b) -> a + b
>> ducar(5) ¶   // → 10
>> lêzêde(3, 7) ¶ // → 10

// Lambda blokê
tasnîf = x -> {
    ? x > 0 { <~ "erênî" }
    _? x < 0 { <~ "neyînî" }
    <~ "sifir"
}

// Girtin — qada derveyî digire
faktor = 3
sêcar = x -> x * faktor
>> sêcar(7) ¶    // → 21

// Fabrîka
çêkerê_lêzêdeker(n) { <~ x -> x + n }
deh_lêzêde = çêkerê_lêzêdeker(10)
>> deh_lêzêde(5) ¶   // → 15

// Di rêzikan de
operasyon = [x -> x+1, x -> x*2, x -> x*x]
>> operasyon[3](5) ¶   // → 25
```

---

## Rêzik

Rêzik **guhêrbar in** û hêmanên **ji heman cûreyê** digirin.

```zymbol
rêzik = [1, 2, 3, 4, 5]

rêzik[1]          // 1 — gihiştin (bingeha-1: hêmana yekem)
rêzik[-1]         // 5 — endeksa neyînî (hêmana dawîn)
rêzik$#           // 5 — dirêjahî (di >> de (rêzik$#) bikar bîne)

rêzik = rêzik$+ 6            // zêde bike → [1,2,3,4,5,6]
rêzik2 = rêzik$+[2] 99       // têxe li cihê 2 (bingeha-1)
rêzik3 = rêzik$- 3           // cara yekem a nirxê rake
rêzik4 = rêzik$-- 3          // hemû caran rake
rêzik5 = rêzik$-[1]          // li endeksa 1 rake (hêmana yekem)
rêzik6 = rêzik$-[2..3]       // rêjeyê rake (bingeha-1، dawî tê de)

heye = rêzik$? 3             // #1 — dihewîne
cih = rêzik$?? 3             // [3] — hemû endeksên nirxê (bingeha-1)
pirt = rêzik$[1..3]          // [1,2,3] — pirt (bingeha-1، dawî tê de)
pirt2 = rêzik$[1:3]          // [1,2,3] — heman، rêzika hêjmarî

hilkişî = rêzik$^+           // rêz bike hilkişî (tenê primitîv)
daketî = rêzik$^-            // rêz bike daketî (tenê primitîv)

// Rêzikên tuplên navdar/cihî — $^ bi lambda berhevdanê re bikar bîne
daneyên = [(nav: "Karla", temen: 28), (nav: "Ana", temen: 25), (nav: "Bob", temen: 30)]
li_gore_temen   = daneyên$^ (a, b -> a.temen < b.temen)     // hilkişî li gor temen (<)
li_gore_nav     = daneyên$^ (a, b -> a.nav > b.nav)        // daketî li gor nav (>)
>> li_gore_temen[1].nav ¶    // → Ana
>> li_gore_nav[1].nav ¶      // → Karla

// Nûvekirina rasterast a hêmanê (tenê rêzik)
rêzik[1] = 99              // tayîn bike
rêzik[2] += 5              // pêkhatî: +=  -=  *=  /=  %=  ^=

// Nûvekirina fonksiyonel — rêzikek nû vedigerîne; ya orjînal naguhere
rêzik2 = rêzik[2]$~ 99
```

> Hemû operatorên berhevokê **rêzikek nû** vedigerînin. Paş ve tayîn bike: `rêzik = rêzik$+ 4`.
> `$+` dikare were zincîrkirin: `rêzik = rêzik$+ 5$+ 6$+ 7`. Operatorên din tayînkirinên navbir bikar tînin.
> **Endekskirin bingeha-1 e**: `rêzik[1]` hêmana yekem e؛ `rêzik[0]` xeletiya dema xebitandinê ye.
> `$^+` / `$^-` **rêzikên primitîv** rêz dikin (hejmar، rêz). Ji bo rêzikên tuplê $^ bi lambda berhevdanê re bikar bînin — araste di lambda de kodkirî ye (`<` = hilkişî، `>` = daketî).

**Semantîka nirxê** — tayînkirina rêzikek ji bo guhêrbarek din kopiyek serbixwe çêdike:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b bandor nabe
```

```zymbol
// Rêzikên hêlî (endekskirina bingeha-1)
matrîks = [[1,2,3],[4,5,6],[7,8,9]]
>> matrîks[2][3] ¶    // → 6  (rêza 2، stûna 3)
```

---

## Veavakirin

```zymbol
// Rêzik
rêzik = [10, 20, 30, 40, 50]
[a, b, c] = rêzik               // a=10  b=20  c=30
[yekem, *mayî] = rêzik          // yekem=10  mayî=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ paşguh dike

// Tupla cihî
xal = (100, 200)
(px, py) = xal                 // px=100  py=200

// Tupla navdar
kes = (nav: "Ana", temen: 25, bajar: "Madrîd")
(nav: n, temen: t) = kes        // n="Ana"  t=25
```

---

## Tupl

Tupl **neguhêrbar in** konteynirên rêzkirî ne ku dikarin nirxên **ji cûreyên cuda** bigirin.
Berevajî rêzikan، hêman piştî afirandinê nayên guhertin.

```zymbol
// Cihî — cûreyên tevlihev destûr in
xal = (10, 20)
>> xal[1] ¶     // → 10

daneyên = (42, "silav", #1, 3.14)
>> daneyên[3] ¶   // → #1

// Navdar
kes = (nav: "Alice", temen: 25)
>> kes.nav ¶       // → Alice
>> kes[1] ¶        // → Alice  (endeks jî dixebite، bingeha-1)

// Hêlî
cih = (x: 10, y: 20)
p = (cih: cih, etîket: "esl")
>> p.cih.x ¶        // → 10
```

**Neguhêrbûn** — her hewldana guherandina hêmaneke tuplê xeletiya dema xebitandinê ye:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ xeletiya dema xebitandinê: tupl neguhêrbar in
// t[1] += 5    // ❌ heman xeletî

// Tupla navdar — bi eşkere ji nû ve ava bike
kes = (nav: "Alice", temen: 25)
mezin = (nav: kes.nav, temen: 26)
>> kes.temen ¶    // → 25
>> mezin.temen ¶  // → 26
```

Ji bo bidestxistina nirxekî guhartî `$~` (nûvekirina fonksiyonel) bikar bînin — tuplek **nû** vedigerîne:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← ya orjînal naguhere
>> t2 ¶    // → (10, 999, 30)
```

---

## Fonksiyonên Pola Bilind

```zymbol
hejmar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ducarkirî  = hejmar$> (x -> x * 2)                 // nexşe → [2,4,6…20]
cût   = hejmar$| (x -> x % 2 == 0)                // parzûn → [2,4,6,8,10]
tevahî    = hejmar$< (0, (berhev, x) -> berhev + x) // kêmkirin → 55

// Zincîre bi navbiran ve
gav1 = hejmar$| (x -> x > 3)
gav2 = gav1$> (x -> x * x)
>> gav2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fonksiyonên navdar dikarin rasterast bên şandin fonksiyonên pola bilind
ducar(x) { <~ x * 2 }
mezin_e(x) { <~ x > 5 }
r = hejmar$> ducar        // ✅ referansa rasterast
r = hejmar$| mezin_e      // ✅ referansa rasterast
```

---

## Operatora Borrî

Aliyê rastê her gav `_` hewce dike wek cihgirê nirxê borrî:

```zymbol
ducar = x -> x * 2
lêzêde = (a, b) -> a + b
yek_zêde = x -> x + 1

5 |> ducar(_)        // → 10
10 |> lêzêde(_, 5)   // → 15
5 |> lêzêde(2, _)    // → 7

// Zincîrkirî
r = 5 |> ducar(_) |> yek_zêde(_) |> ducar(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

---

## Birêvebirina Xeletiyan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dabeşkirina bi sifirê" ¶
} :! {
    >> "xeletiyeke din: " _err ¶    // _err peyama xeletiyê digire
} :> {
    >> "her gav dixebite" ¶
}
```

| Cûre | Kengî |
|------|-------|
| `##Div` | Dabeşkirina bi sifirê |
| `##IO` | Pel / pergala |
| `##Index` | Endeks li derveyî sinoran |
| `##Type` | Ne lihevhatina cûreyê |
| `##Parse` | Teşhîskirina daneyan |
| `##Network` | Xeletiyên torê |
| `##_` | Her xeletiyek (her tiştî digire) |

---

## Modul

```zymbol
// lib/calc.zy — laşê modulê di kevançeyên gir de ye
# calc {
    #> { lêzêde, get_PI }

    _PI := 3.14159
    lêzêde(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // navê din pêwist e

>> c::lêzêde(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Bi navekî giştî yê cuda derxe
# pirtûkxaneya_min {
    #> { _navxweyî_lêzêde <= berhev }

    _navxweyî_lêzêde(a, b) { <~ a + b }
}
```

```zymbol
<# ./pirtûkxaneya_min <= m

>> m::berhev(3, 4) ¶    // → 7  (navê navxweyî _navxweyî_lêzêde veşartî ye)
```

> **Rêbazên modulê**: di nav `# nav { }` de tenê `#>`، pênaseyên fonksiyonê، û destpêkerên guhêrbar/domdar ên literal destûr in. Gotinên ku têne bicihanîn (`>>`، `<<`، gerok hwd.) xeletiya E013 çêdikin.

---

## Modên Hejmarî

Zymbol dikare hejmaran di **69 blokên reqemên Unicode** de nîşan bide — Devanagarî، Erebî-Hindî، Taylendî، Klingonî pIqaD، Qalindê Matematîkî، perçeyên LCD، û hêj bêhtir. Moda çalak tenê derketina `>>` bandor dike؛ hesabiya navxweyî her gav dudilî ye.

### Aktîvkirina nivîsarekê

Reqemên `0` û `9` yên nivîsara armanc di nav `#…#` de binivîse:

```zymbol
#०९#    // Devanagarî    (U+0966–U+096F)
#٠٩#    // Erebî-Hindî    (U+0660–U+0669)
#๐๙#    // Taylendî       (U+0E50–U+0E59)
#09#    // vesazkirina ASCII
```

### Derketin û Booleyan

```zymbol
x = 42
>> x ¶          // → 42   (standard ASCII)

#٠٩#
>> x ¶          // → ٤٢
>> 3.14 ¶       // → ٣.١٤   (xala dehî her gav ASCII)
>> 1 + 2 ¶      // → ٣

// Booleyan: pêşgira # her gav ASCII، reqem tê adaptekirin
>> #1 ¶         // → #١   (rast bi Devanagarî)
>> #0 ¶         // → #٠   (nerast — ji ٠ hejmara tev sifir cuda ye)

x = 28 > 4
>> x ¶          // → #١   (encama berhevdanê moda çalak dişopîne)
```

### Literalên reqemên xwecihî di koda çavkaniyê de

Reqemên her nivîsarekê yên piştevaniyê literalên derbasdar in — di rêje، modulo، berhevdanê de:

```zymbol
#٠٩#

@ i:١..١٥ {
    ? i % ١٥ == ٠ { >> "FizzBuzz" ¶ }
    _? i % ٣  == ٠ { >> "Fizz" ¶ }
    _? i % ٥  == ٠ { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literalên Booleyan di her nivîsarekê de

`#` + reqema `0` an `1` ya her blokekê literalek Booleyan ya derbasdar e:

```zymbol
#٠٩#
çalak = #١        // wek #1 e
>> çalak ¶        // → #١
>> (#١ && #٠) ¶  // → #٠
```

> `#` **her gav ASCII ye**. `#0` (nerast) her gav bi dîtbarî ji `0` (hejmara tev sifir) di her nivîsarekê de cuda ye.

---

## Operatorên Daneyê

```zymbol
// Guhertina cûreyê
##.42         // → 42.0  (bo Xweher)
###3.7        // → 4     (bo Hejmara tev، giroverkirin)
##!3.7        // → 3     (bo Hejmara tev، qusandin)

// Rêzê teşhîs bike bo hejmarê
v1 = #|"42"|      // → 42  (Hejmara tev)
v2 = #|"3.14"|    // → 3.14  (Xweher)
v3 = #|"abc"|     // → "abc"  (ewle، bê xeletî)

// Giroverkirin / qusandin
pi = 3.14159265
girov2 = #.2|pi|     // → 3.14  (girover bike bo 2 dehiyan)
girov4 = #.4|pi|     // → 3.1416
qusandî2 = #!2|pi|   // → 3.14  (qusandin)

// Formatkirina hejmarê
format = #,|1234567|   // → 1,234,567  (bi bêhnokê veqetiyaye)
zanistî = #^|12345.678| // → 1.2345678e4  (zanistî)

// Literalên bingehê
a = 0x41         // → 'A'  (heksadesîmal)
b = 0b01000001   // → 'A'  (duyîn)
c = 0o101        // → 'A'  (oktal)

// Derketina guhertina bingehê
heks = 0x|255|   // → "0x00FF"
duyîn = 0b|65|   // → "0b1000001"
oktal = 0o|8|    // → "0o10"
deh = 0d|255|    // → "0d0255"
```

---

## Entegrasyona Shell

```zymbol
dîrok = <\ date +%Y-%m-%d \>     // stdout digire (tê de \n li dawiyê)
>> "Îro: " dîrok

pel = "daneyên.txt"
naverok = <\ cat {pel} \>         // navbirakirina di fermanan de

derketin = </"./subscript.zy"/>   // skrîpteke Zymbol a din bixebitîne، derketinê bigire
>> derketin
```

> `><` argumanên CLI wek rêzika rêzan digire (tenê tree-walker).

---

---

## Mînaka Temam: FizzBuzz

```zymbol
tasnîf(hejmar) {
    ? hejmar % 15 == 0 { <~ "FizzBuzz" }
    _? hejmar % 3  == 0 { <~ "Fizz" }
    _? hejmar % 5  == 0 { <~ "Buzz" }
    _ { <~ hejmar }
}

@ i:1..20 { >> tasnîf(i) ¶ }
```

---

## Referansa Sembolan

| Sembol | Kar | Sembol | Kar |
|--------|-----|--------|-----|
| `=` | guhêrbar | `$#` | dirêjahî |
| `:=` | domdar | `$+` | zêde bike (dikare were zincîrkirin) |
| `>>` | derketin | `$+[i]` | têxe li endeksê (bingeha-1) |
| `<<` | têketin | `$-` | yekem li gor nirxê rake |
| `¶` / `\\` | rêza nû | `$--` | hemû li gor nirxê rake |
| `?` | eger | `$-[i]` | li endeksê rake (bingeha-1) |
| `_?` | an eger | `$-[i..j]` | rêjeyê rake (bingeha-1) |
| `_` | an / wilkar | `$?` | dihewîne |
| `??` | lihevhatin | `$??` | hemû endeksên nirxê bibîne (bingeha-1) |
| `@` | gerok | `$[s..e]` | pirt (bingeha-1) |
| `@ N { }` | geroka N caran | `$>` | nexşe |
| `@!` | bişkîne | `$|` | parzûn |
| `@>` | berdewam bike | `$<` | kêmkirin |
| `@:nav { }` | geroka bi etîketê | `$/ veqetîner` | dabeşkirina rêzê |
| `@:nav!` | bişkîna bi etîketê | `$++ a b c` | avakirina girêdanê |
| `@:nav>` | berdewamiya bi etîketê | `rêzik[i>j>k]` | endeksa gerînê |
| `->` | lambda | `rêzik[i] = nirx` | nûvekirina hêmanê (tenê rêzik) |
| `rêzik[i] += nirx` | nûvekirina pêkhatî | `rêzik[i]$~` | nûvekirina fonksiyonel (kopya nû) |
| `$^+` | rêzkirina hilkişî (primitîv) | `$^-` | rêzkirina daketî (primitîv) |
| `$^` | rêzkirina bi berhevdaner (tupl) | `<~` | vegerîne |
| `|>` | borrî | `!?` | hewl bide |
| `:!` | bigire | `:>` | di dawiyê de |
| `#1` | rast | `#0` | nerast |
| `$!` | xeletî ye | `$!!` | xeletiyê belav bike |
| `<#` | îthal bike | `#>` | îxrac bike |
| `#` | modulê îlan bike | `::` | modulê bang bike |
| `.` | gihiştina zeviyê | `#?` | metadata ya cûreyê |
| `#\|..\|` | hejmarê teşhîs bike | `##.` | biguherîne bo Xweher |
| `###` | biguherîne bo Hejmara tev (giroverkirin) | `##!` | biguherîne bo Hejmara tev (qusandin) |
| `#.N\|..\|` | girover bike | `#!N\|..\|` | qusîne |
| `#,\|..\|` | forma bêhnokê | `#^\|..\|` | zanistî |
| `#d0d9#` | moda hejmarî biguherîne | `#09#` | vesazkirina ASCII |
| `<\ ..\>` | shell bixebitîne | `>\<` | argumanên CLI |
| `\ var` | guhêrbar bi eşkere tune bike | | |

---

## Têkiliya Guhertinên Serbestberdanê

### v0.0.4 — Endekskirina Bingeha-1، Fonksiyonên Pola Yekem û Blokên Modulê _(Nîsan 2026)_

- **Şkênayî** Hemû endekskirin hate guhertin **bingeha-1** — `arr[1]` hêmana yekem e؛ `arr[0]` xeletiya dema xebitandinê ye
- **Hate zêdekirin** Fonksiyonên navdar **nirxên pola yekem in** — rasterast bişîne fonksiyonên pola bilind: `nums$> ducar`
- **Hate zêdekirin** **Rêzika blokê** ya modulan pêwist e: `# nav { ... }` — rêzika panî hate rakirin
- **Hate zêdekirin** Endekskirina pirpîvanî: `arr[i>j>k]` (gerîn)، `arr[p ; q]` (derxistina panî)
- **Hate zêdekirin** Guhertina cûreyê: `##.ax` (Xweher)، `###ax` (Hejmara tev giroverkirin)، `##!ax` (Hejmara tev qusandin)
- **Hate zêdekirin** Dabeşkirina rêzê: `rêz$/ veqetîner` — vedigerîne `Array(Rêz)`
- **Hate zêdekirin** Avakirina girêdanê: `bingeh$++ a b c` — gelek hêmanan zêde dike
- **Hate zêdekirin** Geroka N caran: `@ N { }` — tam N caran dubare bike
- **Hate zêdekirin** Rêzika gerokên bi etîketê: `@:nav { }`، `@:nav!`، `@:nav>` — li şûna `@ @nav` / `@! nav` tê
- **Hate zêdekirin** Rêbazên qada guhêrbaran: guhêrbarên `_nav` qada blokê ya rast heye؛ `\ var` zû tune dike
- **Hate zêdekirin** Nimûneyên berhevdanê yên lihevhatinê: `< 0 :`، `> 5 :`، `== 42 :` hwd.
- **Hate zêdekirin** Xeletiya E013 ya modulê: gotinên ku têne bicihanîn di laşê modulê de ne destûr in
- **Hat rast kirin** `take_variable` êdî domdarên modulê xera nake dema paş ve dinivîse
- **Hat rast kirin** `alias.CONST` naha bi rastî tê çareserkirin؛ `#>` dikare piştî pênaseyên fonksiyonê xuya bibe
- **VM** Wekheviya tev: 393/393 ceribandin derbas dibin

### v0.0.3 — Pergalên Hejmarî yên Unicode û Baştirkirinên LSP _(Nîsan 2026)_

- **Hatin zêdekirin** 69 blokên reqemên Unicode bi nîşana guhertina modê `#d0d9#`
- **Hatin zêdekirin** Literalên Booleyan di her nivîsarekê de — `#१` / `#०`، `#١` / `#٠`، hwd.
- **Hatin zêdekirin** Reqemên Klingonî pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Hate zêdekirin** Opkoda VM `SetNumeralMode` — wekheviya tev bi tree-walker re
- **Hate zêdekirin** REPL rêza moda hejmarî ya çalak di dengvedan û nîşandana guhêrbaran de bi rêz dixe
- **Hate guhertin** Derketina Booleyan `>>` naha pêşgira `#` (`#0` / `#1`) di hemû modan de dihewîne

### v0.0.2_01 — Ji nû ve Navkirina Operatorê _(30 Adar 2026)_

- **Hate guhertin** `c|..|` → `#,|..|` û `e|..|` → `#^|..|` — li gor malbata pêşgira formatê `#` lihevhatî ye
- **Hate zêdekirin** Navê din ê îxracatê: endamên modulê bi navekî din ji nû ve îxrac bike

### v0.0.2 — Ji nû ve Sêwirandina API-ya Berhevokê û Sazker _(24 Adar 2026)_

- **Hate zêdekirin** Malbata operatorê yekbûyî ya `$` ji bo rêzik û rêzan (`$#`، `$+`، `$?`، `$-`، `$[..]`)
- **Hate zêdekirin** Tayînkirina veavakirinê ji bo rêzik، tupl، û tuplên navdar
- **Hatin zêdekirin** Endeksên neyînî (`arr[-1]` = hêmana dawîn)
- **Hatin zêdekirin** Sazkerên xwecihî — Linux (deb/rpm/pkg/musl)، macOS (Intel + Apple Silicon)، Windows (MSI، winget)

### v0.0.1-patch _(25 Adar 2026)_

- **Hate zêdekirin** Tayînkirina pêkhatî `^=`
- **Hatin rast kirin** Dozên kêleka hesabiya teşhîsker؛ rastkirinên belgekirinê

### v0.0.1 — Serbestberdana Giştî ya Destpêkê _(22 Adar 2026)_

- Şîrovekerê tree-walker + VM ya tomarê (`--vm`، ~4× zûtir، ~95% wekhevî)
- Hemû avahiyên bingehîn: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Nasnavên Unicode yên tev، pergala modulê، lambda، girtin، birêvebirina xeletiyan
- REPL، LSP، dirêjkirina VS Code، formatker (`zymbol fmt`)

---

_Zymbol-Lang — Sembolîk. Gerdûnî. Neguhêrbar._

</div>
