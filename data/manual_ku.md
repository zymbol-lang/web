> **Bersyari:** Ev belge ji hêla îstîxbarata sûnî (AI) ve hatiye afirandin û wergerandin.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referansa kanonî **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** di depoya wergêr de ye.

---

# Rêbernameya Zymbol-Lang

> **Ji bo v0.0.5 hate nûvekirin — 2026-05-14**

**Zymbol-Lang** zimanekî bernameyiya sembolîk e. Tu peyvên kilît — her tişt sembol e. Di her zimanê mirovî de bi heman rengî dixebite.

- Tine `if`, `while`, `return` — tenê `?`, `@`, `<~`
- Unicode ya tev — nasname her ziman an emojiyî de
- Ji zimanê mirovî serbixwe — kod li her derê yek e

**Guhertoya Wergêr**: v0.0.5 | **Bergirtina Testê**: 436/436 (wekheviya TW ↔ VM)

---

## Guhêrbar û Sabît

```zymbol
x = 10              // guhêrbara guhêrbar
π := 3.14159        // sabît — ji nû ve tayînkirin xeletiya dema xebitandinê ye
nav = "Alice"
aktîv = #1         // boolean rast
👋 := "Slav"
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

`°` (nîşana pileyê, U+00B0) di bikaranîna yekem de guhêrbarekê bi awayê otomatîk dest pê dike li nirxa wê ya bêalî:

```zymbol
hejmar = [3, 1, 4, 1, 5]
@ n:hejmar {
    °tevahî += n    // li jora loopê otomatîk dest pê dike 0; piştî @ sax dimîne
}
>> tevahî ¶         // → 14
```

> `°x` (pêşgir) li jora loopê radibe — encam piştî `@` bigihîje.
> `x°` (paşgir) di nav loopê de radibe — dema loop bi dawî bibe dimire.
> Tenê tree-walker.

---

## Cûreyên Daneyê

| Cûre | Literal | Etîketa `#?` | Not |
|------|---------|----------|------|
| Hejmara tev | `42`, `-7` | `###` | 64 bit îşaretkirî |
| Xala herikî | `3.14`, `1.5e10` | `##.` | Nîşana zanistî derbasdar e |
| Têl | `"text"` | `##"` | Venasyona: `"Slav {nav}"` |
| Tîp | `'A'` | `##'` | Tîpekî Unicode yê tenê |
| Boolean | `#1`, `#0` | `##?` | NE hejmarî ye — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Hêmanên homojen |
| Tuple | `(a, b)` | `##)` | Cihî |
| Tuple ya navdar | `(x: 1, y: 2)` | `##)` | Zeviyên navdar |
| Fonksiyon | referansa fonksiyona navdar | `##()` | Çîna yekem; nîşan dide `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Çîna yekem; nîşan dide `<lambd/N>` |

```zymbol
// Jêderçûna cûreyê — vedigerîne (cûre, reqem, nirx)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Derketin û Têketin

```zymbol
>> "Slav" ¶                       // ¶ an \\ ji bo xeta nû ya diyar
>> "a=" a " b=" b ¶               // juxtaposition — nirxên pirjimar
>> (arr$#) ¶                      // operatorên paşgir divê ( ) di >> de

>> nav                           // bixwîne nav guhêrbarekê (bê daxwaz)
>> "Navê xwe binivîse: " nav            // bi daxwazê re
```

> `¶` (AltGr+R li ser klavyeya spanî) û `\\` wekhev in xetên nû.

---

## Prîmîtiyên TUI

Operatorên navbeynkariya termînalê ji bo bernameyên înteraktîf. Piraniya wan bloka `>>| { }` hewce dike (ekrana alternatîf + moda xav).

```zymbol
>>| {
    >>!                             // ekrana alternatîf paqij bike
    >>~ (1, 1, 0, 10) > "Dixebite"  // rêza 1, stûna 1, fg=10 (kesk)
    @~ 1000                         // 1 saniye bisekine (1000 ms)
    >>~ (2, 1) > "Qediya."
}
// termînal dema derketinê bi awayê otomatîk tê vegerandin
```

```zymbol
// Pêlkirina bişkokê û mezinahiya termînalê
>>| {
    [rêz, stûn] = >>?              // pîvanên termînalê bipirse
    >>~ (1, 1) > "Termînal: " rêz " x " stûn
    <<| bişkok                         // pêlkirina bişkokê ya astengker bixwîne
    >>~ (2, 1) > "Pêl kir: " bişkok
}
```

> `>>!` ekranê paqij dike. `>>?` `[rêz, stûn]` vedigerîne. `@~ N` N mîlîçirke radizê.
> `<<|` pêlkirina bişkokê ya astengker dixwîne; `<<|?` bêyî astengkirinê venêrînê dike (heke tune be `'\0'` vedigerîne).
> Tupla derketina cihkirî: `(rêz, stûn, BKS, fg, bg)` — her slotek dikare bi virgulê were berdan (`>>~ (,,, 196) > "sor"`).
> BKS maskeya bit: `1`=stûr, `2`=xwehr, `4`=binxêzkirî. Paleta rengên ANSI 256 (`0`=pêşwestarê termînalê).
> Tenê tree-walker (ji bilî `>>!`, `>>?`, `@~`, `>>~` ku di `--vm` de jî dixebitin).

---

## Operator

```zymbol
// Arîmetîk
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (dabeşkirina hejmarên tev)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (hêzdan)

// Berhevdan — tayîn bike ji bo venêrînê
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Mantiqî
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Têl

```zymbol
// Du awayên girêdanê
nav = "Alice"
n = 42

>> "Slav " nav " te " n " heye" ¶       // juxtaposition — di >> de
danasîn = "Slav {nav}, te {n} heye"     // venasyona — li her derê
```

```zymbol
s = "Slav Cîhan"
dirêjahî = s$#                  // 10
bin = s$[1..5]             // "Slav"  (1-based, dawî tê de ye)
hewce = s$? "Cîhan"          // #1
parçe = "a,b,c,d"$/ ','   // [a, b, c, d]  (bi sînorî veqetîne)
guherandin = s$~~["l":"r"]        // "Srav Cîhan"
guherandin1 = s$~~["l":"r":1]     // "Srav Cîhan"  (tenê yekem N)
xet = "─" $* 20           // "────────────────────"  (N car dubare bike)
```

> `+` tenê ji bo hejmaran e. Ji bo têlan `,`, juxtaposition, an venasyona bikar bînin.

---

## Kontrola Herikînê

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

> Kelekên `{ }` **pêwist in** heke tenê yek beyan be jî.

---

## Lihevhatin

```zymbol
// Rêze
puan = 85
not = ?? puan {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> not ¶    // → B

// Têl
reng = "sor"
kod = ?? reng {
    "sor"   => "#FF0000"
    "kesk" => "#00FF00"
    _       => "#000000"
}

// Nimûneyên berhevdanê
germahî = -5
hal = ?? germahî {
    < 0  => "qeşa"
    < 20 => "sar"
    < 35 => "germ"
    _    => "kel"
}
>> hal ¶    // → qeşa

// Forma beyanê (milên blokê)
n = -3
?? n {
    0    => { >> "sifir" ¶ }
    < 0  => { >> "neyînî" ¶ }
    _    => { >> "erênî" ¶ }
}
```

---

## Loop

```zymbol
@ i:0..4  { >> i " " }        // rêza tevde:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // bi gavê:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // berevajî:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fêkî = ["sêv", "hirmî", "tirî"]
@ f:fêkî { >> f ¶ }         // her hêmanek arrayê

@ t:"hello" { >> t "-" }
>> ¶                          // → h-e-l-l-o-  (her tîpek têlê)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> dewam bike
    ? i > 7 { @! }             // @! bişkîne
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop bêdawî
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop ya bi etîketê (bişkandina hêlî)
hejmartin = 0
@:derveyî {
    hejmartin++
    ? hejmartin >= 3 { @:derveyî! }
}
>> hejmartin ¶                    // → 3
```

---

## Fonksiyon

```zymbol
lêzêdekirin(a, b) { <~ a + b }
>> lêzêdekirin(3, 4) ¶    // → 7

faktoriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyel(n - 1)
}
>> faktoriyel(5) ¶    // → 120
```

Fonksiyon **qada veqetandî** heye — ew nikarin guhêrbarên derveyî bixwînin. Parametreyên derketinê `<~` bikar bînin ji bo guhertina guhêrbarên bangewer:

```zymbol
biguvêre(a<~, b<~) {
    demkî = a
    a = b
    b = demkî
}
x = 10
y = 20
biguvêre(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fonksiyonên navdar **nirxên çîna yekem** in — rasterast derbas bike: `hejmar$> ducarî`. Ji bo pêçanê: `x -> fn(x)` jî derbasdar e.

---

## Lambda û Girtin

```zymbol
ducarî = x -> x * 2
lêzêdekirin = (a, b) -> a + b
>> ducarî(5) ¶    // → 10
>> lêzêdekirin(3, 7) ¶  // → 10

// Lambda ya blokê
dabeşandin = x -> {
    ? x > 0 { <~ "erênî" }
    _? x < 0 { <~ "neyînî" }
    <~ "sifir"
}

// Girtin — qada derveyî digire
faktor = 3
sêcar = x -> x * faktor
>> sêcar(7) ¶    // → 21

// Pêkhêner
çêkerê_lêzêdekirinê(n) { <~ x -> x + n }
zêdekirina10 = çêkerê_lêzêdekirinê(10)
>> zêdekirina10(5) ¶    // → 15

// Di arrayan de
operator = [x -> x+1, x -> x*2, x -> x*x]
>> operator[3](5) ¶    // → 25
```

---

## Array

Array **guhêrbar** in û hêmanên **ji heman cûreyê** digirin.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — gihîştin (1-based: hêmana yekem)
x = arr[-1]     // 5 — endeksa neyînî (hêmana dawî)
x = arr$#       // 5 — dirêjahî (di >> de (arr$#) bikar bînin)

arr = arr$+ 6            // zêde bike → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // têxe li pozisyona 2 (1-based)
arr3 = arr$- 3           // yekem rûdana nirxê rake
arr4 = arr$-- 3          // hemî rûdanan rake
arr5 = arr$-[1]          // li endeksa 1 rake (hêmana yekem)
arr6 = arr$-[2..3]       // rêzê rake (1-based, dawî tê de ye)

hewce = arr$? 3            // #1 — tê de ye
cih = arr$?? 3           // [3] — hemî endeksên nirxê (1-based)
parçe = arr$[1..3]          // [1,2,3] — parçe (1-based, dawî tê de ye)
parçe2 = arr$[1:3]          // [1,2,3] — heman, rêzimanê li ser hejmartinê

bilind = arr$^+             // bilind hatiye rêzkirin (tenê primîtîv)
nizim = arr$^-            // nizim hatiye rêzkirin (tenê primîtîv)

// Arrayên tupleên navdar/cihî — $^ bi lambda berhevdanê bikar bînin
db = [(nav: "Carla", temen: 28), (nav: "Ana", temen: 25), (nav: "Bob", temen: 30)]
li_göre_temen  = db$^ (a, b -> a.temen < b.temen)    // li gor temen bilind (<)
li_göre_nav = db$^ (a, b -> a.nav > b.nav)   // li gor nav nizim (>)
>> li_göre_temen[1].nav ¶     // → Ana
>> li_göre_nav[1].nav ¶    // → Carla

// Nûvekirina hêmana rasterast (tenê array)
arr[1] = 99              // tayîn bike
arr[2] += 5              // pêkhatî: +=  -=  *=  /=  %=  ^=

// Nûvekirina fonksiyonel — arrayek nû vedigerîne; orjînal naguhere
arr2 = arr[2]$~ 99
```

> Hemî operatorên berhevokê arrayek **nû** vedigerînin. Paşve tayîn bike: `arr = arr$+ 4`.
> `$+` dikare were zincîrkirin: `arr = arr$+ 5$+ 6$+ 7`. Operatorên din tayînkirinên navbeynkar bikar tînin.
> **Endekskirina 1-based**: `arr[1]` hêmana yekem e; `arr[0]` xeletiya dema xebitandinê ye.
> `$^+` / `$^-` arrayên **prîmîtîv** (hejmar, têl) rêz dikin. Ji bo arrayên tuple `$^` bi lambda berhevdanê bikar bînin — araste di lambda de hatîye kodkirin (`<` = bilind, `>` = nizim).

**Semantîka nirxê** — tayînkirina arrayek ji bo guhêrbarek din kopiyek serbixwe diafirîne:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b bandor nabe
```

```zymbol
// Arrayên hêlî (endekskirina 1-based)
matrîks = [[1,2,3],[4,5,6],[7,8,9]]
>> matrîks[2][3] ¶    // → 6  (rêza 2, stûna 3)
```

---

## Destrukturing

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[yekem, *mayî] = arr         // yekem=10  mayî=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ red dike

// Tuple ya cihî
xal = (100, 200)
(px, py) = xal             // px=100  py=200

// Tuple ya navdar
kes = (nav: "Ana", temen: 25, bajar: "Madrid")
(nav: n, temen: t) = kes   // n="Ana"  t=25
```

---

## Tuple

Tuple amûrên rêzkirî yên **neguhêrbar** in ku dikarin nirxên **cûreyên cihêreng** bigirin.
Berevajî arrayan, hêman piştî afirandinê nayên guhertin.

```zymbol
// Cihî — cûreyên tevlihev têne destûr kirin
xal = (10, 20)
>> xal[1] ¶    // → 10

daney = (42, "slav", #1, 3.14)
>> daney[3] ¶     // → #1

// Navdar
kes = (nav: "Alice", temen: 25)
>> kes.nav ¶    // → Alice
>> kes[1] ¶      // → Alice  (endeks jî dixebite, 1-based)

// Hêlî
cih = (x: 10, y: 20)
p = (cih: cih, etîket: "esl")
>> p.cih.x ¶        // → 10
```

**Neguhêrbarî** — her hewildanek ji bo guhertina hêmanek tuple xeletiya dema xebitandinê ye:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ xeletiya dema xebitandinê: tuple neguhêrbar in
// t[1] += 5    // ❌ heman xeletî
```

Ji bo derxistina nirxek guhertî `$~` bikar bînin (nûvekirina fonksiyonel) — tuple **nû** vedigerîne:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orjînal naguhere
>> t2 ¶    // → (10, 999, 30)

// Tuple ya navdar — bi eşkere ji nû ve ava bike
kes = (nav: "Alice", temen: 25)
mezintir  = (nav: kes.nav, temen: 26)
>> kes.temen ¶    // → 25
>> mezintir.temen ¶     // → 26
```

---

## Fonksiyonên Rêza Bilind

```zymbol
hejmar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ducarkirin  = hejmar$> (x -> x * 2)                  // map  → [2,4,6…20]
cift    = hejmar$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
tevahî    = hejmar$< (0, (komker, x) -> komker + x)     // reduce → 55

// Bi navbeynkaran zincîre bike
gave1 = hejmar$| (x -> x > 3)
gave2 = gave1$> (x -> x * x)
>> gave2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fonksiyonên navdar dikarin rasterast werin derbas kirin HOF
ducarî(x) { <~ x * 2 }
mezin_e(x) { <~ x > 5 }
r = hejmar$> ducarî       // ✅ referansa rasterast
r = hejmar$| mezin_e       // ✅ referansa rasterast
```

---

## Operatore Borrî

Aliyê rastê her tim `_` hewce dike wekî cihgirê nirxa borrî:

```zymbol
ducarî = x -> x * 2
lêzêdekirin = (a, b) -> a + b
zêde = x -> x + 1

r1 = 5 |> ducarî(_)        // → 10
r2 = 10 |> lêzêdekirin(_, 5)       // → 15
r3 = 5 |> lêzêdekirin(2, _)        // → 7

// Zincîre
r = 5 |> ducarî(_) |> zêde(_) |> ducarî(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Hilgirtina Xeletiyan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dabeşkirina bi sifirê" ¶
} :! {
    >> "yên din: " _err ¶    // _err peyama xeletiyê digire
} :> {
    >> "her tim diçe" ¶
}
```

| Cûre | Dema |
|------|------|
| `##Div` | Dabeşkirina bi sifirê |
| `##IO` | Pel / sîstem |
| `##Index` | Endeks li derveyî sinor e |
| `##Type` | Cûre li hev nake |
| `##Parse` | Daneya parsekirinê |
| `##Network` | Xeletiyên torê |
| `##_` | Her xeletiyek (her tiştî digire) |

---

## Modul

```zymbol
// lib/calc.zy — laşê modulê di kelekên xaçereng de hatiye girtin
# calc {
    #> { lêzêdekirin, get_PI }

    _π := 3.14159
    lêzêdekirin(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // navê cîgir pêwist e

>> c::lêzêdekirin(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Bi navekî giştî yê cuda derxe
# mylib {
    #> { _lêzêdekirina_navxweyî => tevahî }

    _lêzêdekirina_navxweyî(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::tevahî(3, 4) ¶    // → 7  (navê navxweyî _lêzêdekirina_navxweyî veşartiye)
```

> **Qaîdeyên modulê**: di nav `# nav { }` de tenê `#>`, pênaseyên fonksiyonê, û destpêkerên literal ên guhêrbar/sabît têne destûr kirin. Beyanên cîbicîkirî (`>>`, `<<`, loop, hwd.) xeletiya E013 radikin.

---

## Modên Hejmarî

Zymbol dikare hejmaran di **69 pergalên reqemên Unicode** de nîşan bide — Devanagari, Erebî-Hindî, Taylendî, Klingon pIqaD, Matematîkî Stûr, beşên LCD, û hêj bêtir. Moda çalak tenê bandorê li derketina `>>` dike; arîmetîka navxweyî her tim binary ye.

### Aktîvkirina nivîsê

Reqema `0` û `9` ya nivîsa armanc di nav `#…#` de binivîse:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Erebî-Hindî (U+0660–U+0669)
#๐๙#    // Taylendî     (U+0E50–U+0E59)
#09#    // ji nû ve saz bike ASCII
```

### Derketin û boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII pêşwestar)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (xala dehiyê her tim ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: pêşgira # her tim ASCII, reqem adapte dibe
>> #1 ¶         // → #१   (rast bi Devanagari)
>> #0 ¶         // → #०   (xelet — ji ० hejmara tev ya sifirê cuda ye)

x = 28 > 4
>> x ¶          // → #१   (encama berhevdanê li dû moda çalak dibe)
```

### Literalên reqemî yên xwecihî di çavkaniyê de

Reqemên her nivîsa piştevaniyê literalên derbasdar in — di rêzan, moduloyê de, berhevdanan de:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literalên boolean di her nivîsê de

`#` + reqema `0` an `1` ya her blokekê literalek boolean a derbasdar e:

```zymbol
#٠٩#
aktîv = #١        // wekî #1
>> aktîv ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **her tim ASCII** ye. `#0` (xelet) her tim ji `0` (hejmara tev ya sifirê) bi dîtbarî cuda ye di her nivîsê de.

---

## Operatorên Daneyê

```zymbol
// Veguheztina cûreyê
f = ##.42         // → 42.0  (bi Xala Herikî)
i = ###3.7        // → 4     (bi Hejmara Tev, dorpêçkirin)
t = ##!3.7        // → 3     (bi Hejmara Tev, birîn)

// Parse têl bike hejmar
v1 = #|"42"|      // → 42  (Hejmara Tev)
v2 = #|"3.14"|    // → 3.14  (Xala Herikî)
v3 = #|"abc"|     // → "abc"  (ewle, no error)

// Dorpêçkirin / birîn
π = 3.14159265
dorpêç2 = #.2|π|      // → 3.14  (dorpêç bike 2 cihên dehiyê)
dorpêç4 = #.4|π|      // → 3.1416
birî2 = #!2|π|      // → 3.14  (birîn)

// Formatkirina hejmaran
format = #,|1234567|  // → 1,234,567  (bi virgulan veqetandî)
zanistî = #^|12345.678|    // → 1.2345678e4  (zanistî)

// Literalên bingehê
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Veguheztina bingehê derketin
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Yekbûna Shell

```zymbol
dîrok = <\ date +%Y-%m-%d \>     // stdoutê digire (tê de \n ya dawî ye)
>> "Îro: " dîrok

pel = "data.txt"
naverok = <\ cat {pel} \>      // venasyona di fermanan de

derketin = </"./subscript.zy"/>   // skrîptek Zymbol a din pêk bîne, derketinê bigire
>> derketin
```

> `><` argumanên CLI wekî arrayek têlan digire (tenê tree-walker).

---

## Mînaka Temam: FizzBuzz

```zymbol
dabeşandin(hejmar) {
    ? hejmar % 15 == 0 { <~ "FizzBuzz" }
    _? hejmar % 3  == 0 { <~ "Fizz" }
    _? hejmar % 5  == 0 { <~ "Buzz" }
    _ { <~ hejmar }
}

@ i:1..20 { >> dabeşandin(i) ¶ }
```

---

## Referansa Sembolan

| Sembol | Operasyon | Sembol | Operasyon |
|--------|-----------|--------|-----------|
| `=` | guhêrbar | `$#` | dirêjahî |
| `:=` | sabît | `$+` | zêde bike (zincîrkirî) |
| `>>` | derketin | `$+[i]` | li endeksê têxe (1-based) |
| `<<` | têketin | `$-` | yekem bi nirxê rake |
| `¶` / `\\` | xeta nû | `$--` | hemî bi nirxê rake |
| `?` | heke | `$-[i]` | li endeksê rake (1-based) |
| `_?` | din-heke | `$-[i..j]` | rêzê rake (1-based) |
| `_` | din / wildcard | `$?` | tê de ye |
| `??` | lihevhatin | `$??` | hemî endeksan bibîne (1-based) |
| `@` | loop | `$[s..e]` | parçe (1-based) |
| `@ N { }` | loop N car | `$>` | map |
| `@!` | bişkîne | `$\|` | filter |
| `@>` | dewam bike | `$<` | reduce |
| `@:nav { }` | loopa bi etîketê | `$/ sînor` | têl veqetîne |
| `@:nav!` | etîketê bişkîne | `$++ a b c` | concat ava bike |
| `@:nav>` | etîketê dewam bike | `arr[i>j>k]` | endeksa navîgasyonê |
| `->` | lambda | `arr[i] = nirx` | hêman nûve bike (tenê array) |
| `arr[i] += nirx` | nûvekirina pêkhatî | `arr[i]$~` | nûvekirina fonksiyonel (kopiya nû) |
| `$^+` | bilind rêz bike (prîmîtîv) | `$^-` | nizim rêz bike (prîmîtîv) |
| `$^` | bi berhevdanê rêz bike (tuple) | `<~` | vegerîne |
| `\|>` | borrî | `!?` | hewl bide |
| `:!` | bigire | `:>` | di dawiyê de |
| `#1` | rast | `#0` | xelet |
| `$!` | xeletî ye | `$!!` | xeletiyê belav bike |
| `<#` | îthal bike | `#>` | îxrac bike |
| `#` | modulê îlan bike | `::` | modulê bang bike |
| `.` | gihîştina zeviyê | `#?` | metadata cûreyê |
| `#\|..\|` | hejmar parse bike | `##.` | veguherîne Xala Herikî |
| `###` | veguherîne Hejmara Tev (dorpêçkirin) | `##!` | veguherîne Hejmara Tev (birîn) |
| `#.N\|..\|` | dorpêç bike | `#!N\|..\|` | birîn |
| `#,\|..\|` | formatê virgulê | `#^\|..\|` | zanistî |
| `#d0d9#` | moda hejmarî biguherîne | `#09#` | ji nû ve saz bike ASCII |
| `<\ ..\>` | shell pêk bîne | `>\<` | argumanên CLI |
| `\ guhêrbar` | guhêrbara bi eşkere hilweşîne | `°x` / `x°` | pênaseya germ (destpêka otomatîk) |
| `>>|` | bloka TUI (ekrana alternatîf) | `>>~` | derketina cihkirî |
| `>>!` | ekranê paqij bike | `>>?` | mezinahiya termînalê bipirse |
| `<<\|` | pêlkirina bişkokê ya astengker | `<<\|?` | venêrîna pêlkirina bişkokê ya ne-astengker |
| `@~ N` | N mîlîçirke razê | `$*` | têl N car dubare bike |

---

## Guhertoya Rojanê

### v0.0.5 — Prîmîtiyên TUI, Pênaseya Germ & Dubarekirina Têlê _(Gulan 2026)_

- **Şkender** Ciyakera milê lihevhatinê: `pattern : result` → `pattern => result`
- **Şkender** Navê cîgirê îthalê: `<# path <= alias` → `<# path => alias`
- **Şkender** Navê cîgirê îxracê: `#> { fn <= pub }` → `#> { fn => pub }`
- **Hate zêdekirin** Bloka TUI `>>| { }` — ekrana alternatîf + moda xav; dema derketinê paqij dike
- **Hate zêdekirin** Derketina cihkirî `>>~ (rêz, stûn, BKS, fg, bg) > tişt` — slotên vala, paleta rengên ANSI 256
- **Hate zêdekirin** Têketina bişkokê `<<| guhêrbar` (astengker) û `<<|? guhêrbar` (venêrîna ne-astengker)
- **Hate zêdekirin** `>>!` ekranê paqij bike, `>>?` mezinahiya termînalê bipirse, `@~ N` N mîlîçirke razê
- **Hate zêdekirin** Pênaseya germ `°x` / `x°` — di loopan de di bikaranîna yekem de guhêrbarê bi awayê otomatîk dest pê dike
- **Hate zêdekirin** Dubarekirina têlê `têl $* N` — têlekê N car dubare bike
- **VM** Wekhevî: 436/436 test derbas dibin

### v0.0.4 — Endekskirina 1-Based, Fonksiyonên Çîna Yekem & Blokên Modulê _(Avrêl 2026)_

- **Şkender** Hemî endekskirin veguherî **1-based** — `arr[1]` hêmana yekem e; `arr[0]` xeletiya dema xebitandinê ye
- **Hate zêdekirin** Fonksiyonên navdar **nirxên çîna yekem** in — rasterast derbasî HOF bike: `hejmar$> ducarî`
- **Hate zêdekirin** **Rêzimana blokê ya pêwist** ji bo modulan: `# nav { ... }` — rêzimana xav hate rakirin
- **Hate zêdekirin** Endekskirina pir-alî: `arr[i>j>k]` (navîgasyon), `arr[p ; q]` (derxistina xav)
- **Hate zêdekirin** Veguheztina cûreyê: `##.beyan` (Xala Herikî), `###beyan` (Hejmara Tev dorpêçkirin), `##!beyan` (Hejmara Tev birîn)
- **Hate zêdekirin** Têl veqetîne: `têl$/ sînor` — vedigerîne `Array(Têl)`
- **Hate zêdekirin** Concat ava bike: `bingeh$++ a b c` — pir tiştan zêde dike
- **Hate zêdekirin** Loop ya caran: `@ N { }` — bi rastî N car dubare dike
- **Hate zêdekirin** Rêzimana loopa bi etîketê: `@:nav { }`, `@:nav!`, `@:nav>` — li şûna `@ @nav` / `@! nav`
- **Hate zêdekirin** Qaîdeyên qada guhêrbar: guhêrbarên `_nav` qada blokê ya rast heye; `\ guhêrbar` zû hilweşîne
- **Hate zêdekirin** Nimûneyên berhevdanê yên lihevhatinê: `< 0 =>`, `> 5 =>`, `== 42 =>` hwd.
- **Hate zêdekirin** Xeletiya modulê E013: beyanên cîbicîkirî di laşê modulê de qedexe ne
- **Hate rast kirin** `alias.CONST` naha bi rastî çareser dibe; `#>` dikare piştî pênaseyên fonksiyonê were
- **VM** Wekheviya tev: 393/393 test derbas dibin

### v0.0.3 — Pergalên Hejmarî yên Unicode & Pêşveçûnên LSP _(Avrêl 2026)_

- **Hate zêdekirin** 69 blokên reqemên Unicode bi nîşana guheztina modê `#d0d9#`
- **Hate zêdekirin** Literalên boolean di her nivîsê de — `#१` / `#०`, `#١` / `#٠`, hwd.
- **Hate zêdekirin** Reqemên Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Hate zêdekirin** VM Opcode `SetNumeralMode` — wekheviya tev bi tree-walker
- **Hate guherandin** Derketina boolean a `>>` naha pêşgira `#` (`#0` / `#1`) di hemî modan de dihewîne

### v0.0.2_01 — Navê Operatorê Hate Guherandin _(30 Adar 2026)_

- **Hate guherandin** `c|..|` → `#,|..|` û `e|..|` → `#^|..|` — li gor malbata pêşgira `#` ye
- **Hate zêdekirin** Navê cîgirê îxracê: endamên modulê bi navekî cuda ji nû ve îxrac bike

### v0.0.2 — Ji Nû ve Sêwirana API ya Berhevokê & Sazker _(24 Adar 2026)_

- **Hate zêdekirin** Malbata operatorê `$` yekbûyî ji bo array û têlan (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Hate zêdekirin** Tayînkirina destructuring ji bo array, tuple, û tuple yên navdar
- **Hate zêdekirin** Endeksên neyînî (`arr[-1]` = hêmana dawî)
- **Hate zêdekirin** Sazkerên xwecihî — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Adar 2026)_

- **Hate zêdekirin** Tayînkirina pêkhatî `^=`
- **Hate rast kirin** Dozên arîmetîka marjînal ên parserê; rastkirinên belgekirinê

### v0.0.1 — Serbestberdana Destpêkê ya Giştî _(22 Adar 2026)_

- Wergêrê tree-walker + VM ya tomarê (`--vm`, ~4× zûtir, ~95% wekhevî)
- Hemî avahiyên bingehîn: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Nasnameyên Unicode yên tev, pergala modulê, lambda, girtin, hilgirtina xeletiyan
- REPL, LSP, dirêjkirina VS Code, formatker (`zymbol fmt`)

---

_Zymbol-Lang — Sembolîk. Gerdûnî. Neguhêrbar._
