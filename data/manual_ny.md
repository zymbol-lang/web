> **Chodzikanira:** Zolemba izi zinapangidwa ndi kumasuliridwa ndi luntha lochita kupanga (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Buku lolozera lalikulu ndi **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** m'malo osungira otanthauzira.

---

# Buku la Zymbol-Lang

> **Kuwunikidwa kwa v0.0.5 — 2026-05-16**

**Zymbol-Lang** ndi chilankhulo chopanga mapulogalamu chazizindikiro. Palibe mawu ofunikira — chilichonse ndi chizindikiro. Chimagwira ntchito mofanana m'chilankhulo chilichonse cha anthu.

- Palibe `if`, `while`, `return` — kokha `?`, `@`, `<~`
- Unicode yathunthu — zizindikiro m'chilankhulo chilichonse kapena emoji
- Osadalira chilankhulo cha anthu — kodi ndi yofanana kulikonse

**Mtundu wa wotanthauzira**: v0.0.5 | **Kufalikira kwa mayeso**: 436/436 (kufanana kwa TW ↔ VM)

---

## Zosintha ndi Zosasintha

```zymbol
x = 10              // zosintha zomwe zingasinthe
π := 3.14159        // zosasintha — kugawanso ndi cholakwika nthawi yothamanga
dzina = "Alice"
kugwira = #1         // boolean choonadi
👋 := "Moni"
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

`°` (chizindikiro cha digiri, U+00B0) chimayambitsa zosintha zokha ku mtengo wake wosalowerera pakugwiritsa ntchito koyamba:

```zymbol
manambala = [3, 1, 4, 1, 5]
@ n:manambala {
    °zonse += n    // kuyambitsa zokha ku 0 pamwamba pa loop; imakhalabe ndi moyo pambuyo pa @
}
>> zonse ¶         // → 14
```

> `°x` (choyambirira) chimangirira pamwamba pa loop — zotsatira zimapezeka pambuyo pa `@`.
> `x°` (chotsatira) chimangirira mkati mwa loop — chimafa loop ikamaliza.
> Tree-walker yokha.

---

## Mitundu ya Deta

| Mtundu | Zolemba | Chizindikiro `#?` | Zolemba |
|------|---------|----------|---------|
| Nambala yathunthu | `42`, `-7` | `###` | 64-bit yokhala ndi chizindikiro |
| Zoyandama | `3.14`, `1.5e10` | `##.` | Zolemba zasayansi zololedwa |
| Chingwe | `"malemba"` | `##"` | Kulowetsa: `"Moni {dzina}"` |
| Chilembo | `'A'` | `##'` | Chilembo chimodzi cha Unicode |
| Boolean | `#1`, `#0` | `##?` | Si nambala — `#1 ≠ 1` |
| Mndandanda | `[1, 2, 3]` | `##]` | Zinthu zofanana |
| Tuple | `(a, b)` | `##)` | Malo |
| Tuple yokhala ndi dzina | `(x: 1, y: 2)` | `##)` | Minda yokhala ndi mayina |
| Ntchito | katchulidwe ka ntchito yokhala ndi dzina | `##()` | Gulu loyamba; ikuwonetsa `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Gulu loyamba; ikuwonetsa `<lambd/N>` |

```zymbol
// Kuyang'ana mtundu — kumabweretsa (mtundu, manambala, mtengo)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Kutulutsa ndi Kulowetsa

```zymbol
>> "Moni" ¶                       // ¶ kapena \\ kwa mzere watsopano womveka
>> "a=" a " b=" b ¶               // kuyika pafupi — zinthu zambiri
>> (arr$#) ¶                      // zotsatira za postfix zimafuna ( ) mu >>

>> dzina                           // werengani mu zosintha (popanda cholozera)
>> "Lowetsani dzina: " dzina            // ndi cholozera
```

> `¶` (AltGr+R pa kiyibodi ya Chisipanishi) ndi `\\` ndi mizere yatsopano yofanana.

---

## Zoyambira za TUI

Zogwiritsira ntchito mawonekedwe ogwiritsira ntchito terminal pamapulogalamu olumikizirana. Zambiri zimafunikira chipika `>>| { }` (chowonera china + mode yaiwisi).

```zymbol
>>| {
    >>!                             // yeretsani chowonera china
    >>~ (1, 1, 0, 10) > "Kugwira"   // mzere 1, ndime 1, fg=10 (wobiriwira)
    @~ 1000                         // yimitsani sekondi imodzi (1000 ms)
    >>~ (2, 1) > "Kutha."
}
// terminal imabwezeretsedwa zokha mukatuluka
```

```zymbol
// Kukantha kiyi ndi kukula kwa terminal
>>| {
    [mizere, ndime] = >>?              // funsani kukula kwa terminal
    >>~ (1, 1) > "Terminal: " mizere " x " ndime
    <<| kiyi                         // werengani kukantha kiyi kotsekera
    >>~ (2, 1) > "Mudakantha: " kiyi
}
```

> `>>!` imayeretsa chowonera. `>>?` imabweretsa `[mizere, ndime]`. `@~ N` imagona N milisekondi.
> `<<|` imawerenga kukantha kiyi kumodzi (kotsekera); `<<|?` imafufuza popanda kutsekera (imabweretsa `'\0'` ngati kulibe).
> Tuple yotulutsa malo: `(mzere, ndime, BKS, fg, bg)` — malo alionse atha kusiyidwa ndi koma (`>>~ (,,, 196) > "kufiira"`).
> BKS maski ya bit: `1`=lakuda, `2`=lopingasa, `4`=mzere pansi. ANSI 256 mitundu ya palette (`0`=kusasintha kwa terminal).
> Tree-walker yokha (kupatula `>>!`, `>>?`, `@~`, `>>~` zomwe zimagwiranso ntchito mu `--vm`).

---

## Zogwiritsira Ntchito

```zymbol
// Masamu
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (kugawa nambala yathunthu)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kukweza mphamvu)

// Kufanizitsa — perekani kuti muwone
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Malingaliro
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Zingwe

```zymbol
// Mitundu iwiri yolumikizira
dzina = "Alice"
n = 42

>> "Moni " dzina " uli ndi " n ¶       // kuyika pafupi — mu >>
kufotokoza = "Moni {dzina}, uli ndi {n}"     // kulowetsa — kulikonse
```

```zymbol
s = "Moni dziko"
utali = s$#                  // 10
kagawo = s$[1..5]             // "Moni "  (1-maziko, kumapeto kuphatikizidwa)
ilipo = s$? "dziko"          // #1
zidutswa = "a,b,c,d"$/ ','   // [a, b, c, d]  (gawani ndi cholekanitsa)
sintha = s$~~["l":"r"]        // "Moni dziko"
sintha1 = s$~~["l":"r":1]     // "Moni dziko"  (N zoyambirira zokha)
mzere = "─" $* 20           // "────────────────────"  (bwerezani N nthawi)
```

> `+` ndi ya manambala okha. Pa zingwe, gwiritsani ntchito `,`, kuyika pafupi, kapena kulowetsa.

---

## Kuwongolera Mayendedwe

```zymbol
x = 7

? x > 0 { >> "chabwino" ¶ }

? x > 100 {
    >> "chachikulu" ¶
} _? x > 0 {
    >> "chabwino" ¶
} _? x == 0 {
    >> "zilo" ¶
} _ {
    >> "choipa" ¶
}
```

> Zolemba `{ }` **ndizofunikira** ngakhale pa mawu amodzi.

---

## Kufanana

```zymbol
// Magawo
malire = 85
kalasi = ?? malire {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> kalasi ¶    // → B

// Zingwe
mtundu = "kufiira"
khodi = ?? mtundu {
    "kufiira"   => "#FF0000"
    "wobiriwira" => "#00FF00"
    _       => "#000000"
}

// Mitundu yofanizira
kutentha = -5
chikhalidwe = ?? kutentha {
    < 0  => "madzi oundana"
    < 20 => "kozizira"
    < 35 => "kofunda"
    _    => "kotentha"
}
>> chikhalidwe ¶    // → madzi oundana

// Mawonekedwe a mawu (mikono ya chipika)
n = -3
?? n {
    0    => { >> "zilo" ¶ }
    < 0  => { >> "choipa" ¶ }
    _    => { >> "chabwino" ¶ }
}
```

---

## Ma Loop

```zymbol
@ i:0..4  { >> i " " }        // gawo kuphatikiza:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ndi sitepe:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // chosinthika:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (pamene)

zipatso = ["apulo", "peyala", "mphesa"]
@ z:zipatso { >> z ¶ }         // pa chinthu chilichonse mu mndandanda

@ c:"hello" { >> c "-" }
>> ¶                          // → h-e-l-l-o-  (pa chilembo chilichonse mu chingwe)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> pitilizani
    ? i > 7 { @! }             // @! thyolani
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop yosatha
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop yokhala ndi chizindikiro (kuthyola kozungulira)
kuwerengera = 0
@:kunja {
    kuwerengera++
    ? kuwerengera >= 3 { @:kunja! }
}
>> kuwerengera ¶                    // → 3
```

---

## Ntchito

```zymbol
onjezani(a, b) { <~ a + b }
>> onjezani(3, 4) ¶    // → 7

chokwanira(n) {
    ? n <= 1 { <~ 1 }
    <~ n * chokwanira(n - 1)
}
>> chokwanira(5) ¶    // → 120
```

Ntchito zili ndi **malo olekanitsidwa** — sizingathe kuwerenga zosintha zakunja. Gwiritsani ntchito magawo otulutsa `<~>` kuti musinthe zosintha za woyimbira:

```zymbol
sinthanitsani(a<~, b<~) {
    kwakanthawi = a
    a = b
    b = kwakanthawi
}
x = 10
y = 20
sinthanitsani(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ntchito zokhala ndi mayina ndi **mfundo za gulu loyamba** — perekani mwachindunji: `manambala$> kuwirikiza`. Pokulunga: `x -> ntchito(x)` ndiyonso yovomerezeka.

---

## Lambda ndi Kutseka

```zymbol
kuwirikiza = x -> x * 2
onjezani = (a, b) -> a + b
>> kuwirikiza(5) ¶    // → 10
>> onjezani(3, 7) ¶  // → 10

// Lambda ya chipika
gawani = x -> {
    ? x > 0 { <~ "chabwino" }
    _? x < 0 { <~ "choipa" }
    <~ "zilo"
}

// Kutseka — kugwira malo akunja
chinthu = 3
katatu = x -> x * chinthu
>> katatu(7) ¶    // → 21

// Fakitale
wopanga_onjezani(n) { <~ x -> x + n }
onjezani_khumi = wopanga_onjezani(10)
>> onjezani_khumi(5) ¶    // → 15

// Mu mndandanda
zogwiritsira = [x -> x+1, x -> x*2, x -> x*x]
>> zogwiritsira[3](5) ¶    // → 25
```

---

## Mndandanda

Mndandanda **ungasinthe** ndipo uli ndi zinthu **za mtundu womwewo**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — kupeza (1-maziko: chinthu choyamba)
x = arr[-1]     // 5 — cholozera choipa (chinthu chomaliza)
x = arr$#       // 5 — utali (gwiritsani ntchito (arr$#) mu >>)

arr = arr$+ 6            // onjezani → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // lowetsani pamalo 2 (1-maziko)
arr3 = arr$- 3           // chotsani kupezeka koyamba kwa mtengo
arr4 = arr$-- 3          // chotsani zochitika zonse
arr5 = arr$-[1]          // chotsani pa cholozera 1 (chinthu choyamba)
arr6 = arr$-[2..3]       // chotsani gawo (1-maziko, kumapeto kuphatikizidwa)

ilipo = arr$? 3            // #1 — ili ndi
malo = arr$?? 3           // [3] — zolozera zonse za mtengo (1-maziko)
kagawo = arr$[1..3]          // [1,2,3] — kagawo (1-maziko, kumapeto kuphatikizidwa)
kagawo2 = arr$[1:3]          // [1,2,3] — chimodzimodzi, kalankhulidwe kozikidwa pa kuwerengera

kukwera = arr$^+             // sankhani kukwera (zoyambira zokha)
kutsika = arr$^-            // sankhani kutsika (zoyambira zokha)

// Mndandanda wa tuple yokhala ndi dzina/malo — gwiritsani ntchito $^ ndi lambda yofananiza
nkhokwe = [(dzina: "Carla", zaka: 28), (dzina: "Ana", zaka: 25), (dzina: "Bob", zaka: 30)]
malinga_zaka  = nkhokwe$^ (a, b -> a.zaka < b.zaka)    // malinga zaka kukwera (<)
malinga_dzina = nkhokwe$^ (a, b -> a.dzina > b.dzina)   // malinga dzina kutsika (>)
>> malinga_zaka[1].dzina ¶     // → Ana
>> malinga_dzina[1].dzina ¶    // → Carla

// Kusintha kwachindunji kwa chinthu (mndandanda wokha)
arr[1] = 99              // perekani
arr[2] += 5              // chophatikiza: +=  -=  *=  /=  %=  ^=

// Kusintha kogwira ntchito — kumabweretsa mndandanda watsopano; woyambirira sunasinthe
arr2 = arr[2]$~ 99
```

> Zogwiritsira ntchito zosonkhanitsira zonse zimatulutsa **mndandanda watsopano**. Perekani chibwererere: `arr = arr$+ 4`.
> `$+` ikhoza kulumikizidwa: `arr = arr$+ 5$+ 6$+ 7`. Zogwiritsira ntchito zina zimagwiritsa ntchito kugawa kwapakatikati.
> **Cholozera ndi 1-maziko**: `arr[1]` ndi chinthu choyamba; `arr[0]` ndi cholakwika nthawi yothamanga.

**Tanthauzo la mtengo** — kugawa mndandanda kwa zosintha zina kumapanga kopi yodziyimira payokha:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b sichikhudzidwa
```

```zymbol
// Mndandanda wozungulira (cholozera 1-maziko)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (mzere 2, ndime 3)
```

---

## Kusokoneza Mapangidwe

```zymbol
// Mndandanda
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[choyamba, *zotsala] = arr         // choyamba=10  zotsala=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ amataya

// Tuple yamalo
mfundo = (100, 200)
(px, py) = mfundo             // px=100  py=200

// Tuple yokhala ndi dzina
munthu = (dzina: "Ana", zaka: 25, mzinda: "Madrid")
(dzina: n, zaka: z) = munthu   // n="Ana"  z=25
```

---

## Tuple

Ma Tuple ndi zotengera zoyitanidwa **zosasinthika** zomwe zingathe kusunga mfundo **za mitundu yosiyanasiyana**.
Mosiyana ndi mndandanda, zinthu sizingasinthidwe pambuyo popangidwa.

```zymbol
// Malo — mitundu yosakanizika yololedwa
mfundo = (10, 20)
>> mfundo[1] ¶    // → 10

deti = (42, "Moni", #1, 3.14)
>> deti[3] ¶     // → #1

// Yokhala ndi dzina
munthu = (dzina: "Alice", zaka: 25)
>> munthu.dzina ¶    // → Alice
>> munthu[1] ¶      // → Alice  (cholozera chimagwiranso ntchito, 1-maziko)

// Yozungulira
malo = (x: 10, y: 20)
p = (malo: malo, cholembera: "chiyambi")
>> p.malo.x ¶        // → 10
```

**Kusasinthika** — kuyesera kulikonse kosintha chinthu cha tuple ndi cholakwika nthawi yothamanga:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ cholakwika nthawi yothamanga: ma tuple ndi osasinthika
// t[1] += 5    // ❌ cholakwika chomwecho
```

Kuti mupeze mtengo wosinthidwa gwiritsani ntchito `$~` (kusintha kogwira ntchito) — kumabweretsa **tuple yatsopano**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← choyambirira sichinasinthe
>> t2 ¶    // → (10, 999, 30)

// Tuple yokhala ndi dzina — mangani mwatsatanetsatane
munthu = (dzina: "Alice", zaka: 25)
wamkulu  = (dzina: munthu.dzina, zaka: 26)
>> munthu.zaka ¶    // → 25
>> wamkulu.zaka ¶     // → 26
```

---

## Ntchito Zapamwamba Kwambiri

```zymbol
manambala = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kuwirikiza  = manambala$> (x -> x * 2)                  // map  → [2,4,6…20]
ofananira    = manambala$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
zonse    = manambala$< (0, (wosonkhanitsa, x) -> wosonkhanitsa + x)     // reduce → 55

// Kulumikiza kudzera mwapakatikati
gawo1 = manambala$| (x -> x > 3)
gawo2 = gawo1$> (x -> x * x)
>> gawo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ntchito zokhala ndi mayina zitha kuperekedwa mwachindunji ku HOF
kuwirikiza(x) { <~ x * 2 }
chachikulu(x) { <~ x > 5 }
r = manambala$> kuwirikiza       // ✅ katchulidwe kachindunji
r = manambala$| chachikulu       // ✅ katchulidwe kachindunji
```

---

## Chogwiritsira Ntchito cha Chitoliro

Mbali yakumanja nthawi zonse imafuna `_` ngati choyikira malo pa mtengo wotumizidwa:

```zymbol
kuwirikiza = x -> x * 2
onjezani = (a, b) -> a + b
kuwonjezera = x -> x + 1

r1 = 5 |> kuwirikiza(_)        // → 10
r2 = 10 |> onjezani(_, 5)       // → 15
r3 = 5 |> onjezani(2, _)        // → 7

// Kulumikiza
r = 5 |> kuwirikiza(_) |> kuwonjezera(_) |> kuwirikiza(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kusamalira Zolakwika

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kugawa ndi ziro" ¶
} :! {
    >> "zina: " _err ¶    // _err imasunga uthenga wolakwika
} :> {
    >> "imathamanga nthawi zonse" ¶
}
```

| Mtundu | Nthawi |
|------|------|
| `##Div` | Kugawa ndi ziro |
| `##IO` | Fayilo / dongosolo |
| `##Index` | Cholozera kunja kwa malire |
| `##Type` | Mitundu yosagwirizana |
| `##Parse` | Kusanthula deta |
| `##Network` | Zolakwika za netiweki |
| `##_` | Chilakwika chilichonse (chogwira-chonse) |

---

## Ma Modulu

```zymbol
// lib/calc.zy — thupi la modulu latsekedwa mu zolemba
# calc {
    #> { onjezani, get_PI }

    _π := 3.14159
    onjezani(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // dzina lachidziwitso likufunika

>> c::onjezani(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Tulutsani ndi dzina lina la pagulu
# mylib {
    #> { _onjezani_mkati => chiwerengero }

    _onjezani_mkati(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::chiwerengero(3, 4) ¶    // → 7  (dzina lamkati _onjezani_mkati labisika)
```

> **Malamulo a modulu**: mkati mwa `# dzina { }`, `#>`, matanthauzo a ntchito, ndi zoyambitsa zenizeni za zosintha/zosasintha zokha zomwe zimaloledwa. Mawu omwe angathe kugwiritsidwa ntchito (`>>`, `<<`, ma loop, ndi zina) amatulutsa cholakwika E013.

---

## Mitundu ya Manambala

Zymbol imatha kuwonetsa manambala mu **69 zilembo za manambala za Unicode** — Devanagari, Arab-Indian, Thai, Klingon pIqaD, Mathematical Bold, zigawo za LCD, ndi zina. Mtundu wogwira umakhudza kutulutsa `>>` kokha; masamu amkati nthawi zonse amakhala a binary.

### Kuyambitsa zilembo

Lembani manambala `0` ndi `9` a zilembo zomwe mukufuna mu `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indian (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // bwezerani ku ASCII
```

### Kutulutsa ndi ma boolean

```zymbol
x = 42
>> x ¶          // → 42   (kusasintha kwa ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (malo a decimal nthawi zonse ndi ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: choyambirira # nthawi zonse ndi ASCII, manambala amasintha
>> #1 ¶         // → #१   (choonadi mu Devanagari)
>> #0 ¶         // → #०   (chabodza — chosiyana ndi ० nambala yathunthu ziro)

x = 28 > 4
>> x ¶          // → #१   (zotsatira zofananira zimatsata mtundu wogwira)
```

### Manambala enieni mu gwero

Manambala a zilembo zilizonse zothandizidwa ndi zolemba zovomerezeka — mu magawo, modulo, kufanizitsa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Zolemba za Boolean mu zilembo zilizonse

`#` + manambala `0` kapena `1` kuchokera pachipika chilichonse ndi cholemba chovomerezeka cha boolean:

```zymbol
#०९#
kugwira = #१        // chofanana ndi #1
>> kugwira ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **nthawi zonse ndi ASCII**. `#0` (chabodza) nthawi zonse chimasiyana ndi `0` (nambala yathunthu ziro) m'zilembo zilizonse.

---

## Zogwiritsira Ntchito za Deta

```zymbol
// Kutembenuza mitundu
f = ##.42         // → 42.0  (kwa zoyandama)
i = ###3.7        // → 4     (kwa nambala yathunthu, kuzungulira)
t = ##!3.7        // → 3     (kwa nambala yathunthu, kudula)

// Kusanthula chingwe kukhala nambala
v1 = #|"42"|      // → 42  (nambala yathunthu)
v2 = #|"3.14"|    // → 3.14  (zoyandama)
v3 = #|"abc"|     // → "abc"  (kotetezeka, palibe cholakwika)

// Kuzungulira / Kudula
π = 3.14159265
kuzungulira2 = #.2|π|      // → 3.14  (zungulirani ku malo 2 a decimal)
kuzungulira4 = #.4|π|      // → 3.1416
kudula2 = #!2|π|      // → 3.14  (dulani)

// Kupanga maumboni a manambala
maumboni = #,|1234567|  // → 1,234,567  (olekanitsidwa ndi koma)
sayanzi = #^|12345.678|    // → 1.2345678e4  (sayanzi)

// Zolemba za maziko
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Kutulutsa kutembenuza maziko
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Kuphatikiza kwa Shell

```zymbol
tsiku = <\ date +%Y-%m-%d \>     // kujambula stdout (kuphatikiza \n kumapeto)
>> "Lero: " tsiku

fayilo = "data.txt"
zomwe_zili = <\ cat {fayilo} \>      // kulowetsa m'malamulo

zotulutsa = </"./subscript.zy"/>   // yambitsani script ina ya Zymbol, jambulani zotulutsa
>> zotulutsa
```

> `><` kujambula zokambirana za CLI ngati mndandanda wa zingwe (tree-walker yokha).

---

## Chitsanzo Chokwanira: FizzBuzz

```zymbol
gawani(nambala) {
    ? nambala % 15 == 0 { <~ "FizzBuzz" }
    _? nambala % 3  == 0 { <~ "Fizz" }
    _? nambala % 5  == 0 { <~ "Buzz" }
    _ { <~ nambala }
}

@ i:1..20 { >> gawani(i) ¶ }
```

---

## Buku Lolozera la Zizindikiro

| Chizindikiro | Ntchito | Chizindikiro | Ntchito |
|--------|-----------|--------|-----------|
| `=` | zosintha | `$#` | utali |
| `:=` | zosasintha | `$+` | onjezani (zolumikizidwa) |
| `>>` | kutulutsa | `$+[i]` | lowetsani pa cholozera (1-maziko) |
| `<<` | kulowetsa | `$-` | chotsani choyamba ndi mtengo |
| `¶` / `\\` | mzere watsopano | `$--` | chotsani zonse ndi mtengo |
| `?` | ngati | `$-[i]` | chotsani pa cholozera (1-maziko) |
| `_?` | apo-ngati | `$-[i..j]` | chotsani gawo (1-maziko) |
| `_` | apo / chizindikiro chakutchire | `$?` | ili ndi |
| `??` | kufanana | `$??` | pezani zolozera zonse (1-maziko) |
| `@` | loop | `$[s..e]` | kagawo (1-maziko) |
| `@ N { }` | loop N nthawi | `$>` | map |
| `@!` | thyolani | `$\|` | filter |
| `@>` | pitilizani | `$<` | reduce |
| `@:dzina { }` | loop yokhala ndi chizindikiro | `$/ cholekanitsa` | gawani chingwe |
| `@:dzina!` | thyolani chizindikiro | `$++ a b c` | kupanga cholumikizira |
| `@:dzina>` | pitilizani chizindikiro | `arr[i>j>k]` | cholozera choyendera |
| `->` | lambda | `arr[i] = mtengo` | sinthani chinthu (mndandanda wokha) |
| `arr[i] += mtengo` | kusintha kophatikiza | `arr[i]$~` | kusintha kogwira ntchito (kopi yatsopano) |
| `$^+` | sankhani kukwera (zoyambira) | `$^-` | sankhani kutsika (zoyambira) |
| `$^` | sankhani ndi wofananiza (tuple) | `<~` | bweretsani |
| `\|>` | chitoliro | `!?` | yesani |
| `:!` | gwirani | `:>` | pamapeto pake |
| `#1` | choonadi | `#0` | chabodza |
| `$!` | kodi ndi cholakwika | `$!!` | falitsani cholakwika |
| `<#` | lowetsani | `#>` | tulutsani |
| `#` | lengezani modulu | `::` | yitanitsani modulu |
| `.` | kupeza gawo | `#?` | deta yamtundu |
| `#\|..\|` | sankhani nambala | `##.` | tembenuzani kukhala zoyandama |
| `###` | tembenuzani kukhala nambala yathunthu (kuzungulira) | `##!` | tembenuzani kukhala nambala yathunthu (kudula) |
| `#.N\|..\|` | zungulirani | `#!N\|..\|` | dulani |
| `#,\|..\|` | maumboni a koma | `#^\|..\|` | sayansi |
| `#d0d9#` | sinthani mtundu wa manambala | `#09#` | bwezerani ku ASCII |
| `<\ ..\>` | yambitsani shell | `>\<` | zokambirana za CLI |
| `\ zosintha` | wonongani zosintha momveka bwino | `°x` / `x°` | kutanthauzira kotentha (kuyambitsa zokha) |
| `>>|` | chipika cha TUI (chowonera china) | `>>~` | kutulutsa kwa malo |
| `>>!` | yeretsani chowonera | `>>?` | funsani kukula kwa terminal |
| `<<\|` | kukantha kiyi kotsekera | `<<\|?` | kufufuza kukantha kiyi kosatsekera |
| `@~ N` | gonani N milisekondi | `$*` | bwerezani chingwe N nthawi |

---

## Zosintha za Kutulutsa

### v0.0.5 — Zoyambira za TUI, Kutanthauzira Kotentha & Kubwereza Chingwe _(Meyi 2026)_

- **Kusokoneza** Cholekanitsa cha mkono wofananiza: `fanizo : zotsatira` → `fanizo => zotsatira`
- **Kusokoneza** Dzina lachidziwitso lolowetsa: `<# njira <= dzina_lachidziwitso` → `<# njira => dzina_lachidziwitso`
- **Kusokoneza** Kusintha dzina lotulutsa: `#> { fn <= pagulu }` → `#> { fn => pagulu }`
- **Kuwonjezeredwa** Chipika cha TUI `>>| { }` — chowonera china + mode yaiwisi; yeretsani potuluka
- **Kuwonjezeredwa** Kutulutsa kwa malo `>>~ (mzere, ndime, BKS, fg, bg) > zinthu` — malo opapatiza, mitundu ya ANSI 256
- **Kuwonjezeredwa** Kulowetsa kiyi `<<| zosintha` (kotsekera) ndi `<<|? zosintha` (kufufuza kosatsekera)
- **Kuwonjezeredwa** `>>!` yeretsani chowonera, `>>?` funsani kukula kwa terminal, `@~ N` gonani N milisekondi
- **Kuwonjezeredwa** Kutanthauzira kotentha `°x` / `x°` — yambitsani zosintha zokha pakugwiritsa ntchito koyamba mu ma loop
- **Kuwonjezeredwa** Kubwereza chingwe `chingwe $* N` — bwerezani chingwe N nthawi
- **VM** Kufanana: 436/436 mayeso adutsa

### v0.0.4 — Cholozera 1-maziko, Ntchito za Gulu Loyamba & Ma Modulu a Chipika _(Epulo 2026)_

- **Kusokoneza** Zolozera zonse zidasinthidwa kukhala **1-maziko** — `arr[1]` ndi chinthu choyamba; `arr[0]` ndi cholakwika nthawi yothamanga
- **Kuwonjezeredwa** Ntchito zokhala ndi mayina ndi **mfundo za gulu loyamba** — perekani mwachindunji ku HOF: `manambala$> kuwirikiza`
- **Kuwonjezeredwa** **Kalankhulidwe ka chipika kofunikira** kwa ma modulu: `# dzina { ... }` — kalankhulidwe kophyoka kuchotsedwa
- **Kuwonjezeredwa** Cholozera cha mbali zambiri: `arr[i>j>k]` (kuyenda), `arr[p ; q]` (kutulutsa kophyoka)
- **Kuwonjezeredwa** Kutembenuza mitundu: `##.mawu` (zoyandama), `###mawu` (nambala yathunthu zungulirani), `##!mawu` (nambala yathunthu dulani)
- **Kuwonjezeredwa** Kugawa chingwe: `chingwe$/ cholekanitsa` — kumabweretsa `Array(chingwe)`
- **Kuwonjezeredwa** Kupanga cholumikizira: `maziko$++ a b c` — onjezani zinthu zingapo
- **Kuwonjezeredwa** Loop ya nthawi: `@ N { }` — bwerezani ndendende N nthawi
- **Kuwonjezeredwa** Kalankhulidwe ka loop yokhala ndi chizindikiro: `@:dzina { }`, `@:dzina!`, `@:dzina>` — m'malo mwa `@ @dzina` / `@! dzina`
- **Kuwonjezeredwa** Malamulo a malo a zosintha: zosintha `_dzina` zili ndi malo enieni a chipika; `\ zosintha` wonongani msanga
- **Kuwonjezeredwa** Mitundu yofananizira yofananiza: `< 0 =>`, `> 5 =>`, `== 42 =>`, ndi zina
- **Kuwonjezeredwa** Cholakwika cha modulu E013: mawu ogwiritsidwa ntchito mu thupi la modulu ndi oletsedwa
- **Kukonzedwa** `alias.CONST` tsopano imathetsa bwino; `#>` ikhoza kuwonekera pambuyo pa matanthauzo a ntchito
- **VM** Kufanana kwathunthu: 393/393 mayeso adutsa

### v0.0.3 — Machitidwe a Manambala a Unicode & Kusintha kwa LSP _(Epulo 2026)_

- **Kuwonjezeredwa** 69 zigawo za manambala a Unicode zokhala ndi chizindikiro chosinthira mtundu `#d0d9#`
- **Kuwonjezeredwa** Zolemba za Boolean mu zilembo zilizonse — `#१` / `#०`, `#१` / `#०`, ndi zina
- **Kuwonjezeredwa** Manambala a Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Kuwonjezeredwa** Opcode ya VM `SetNumeralMode` — kufanana kwathunthu ndi tree-walker
- **Kusinthidwa** Kutulutsa kwa Boolean `>>` tsopano kukuphatikiza choyambirira `#` (`#0` / `#1`) mu mitundu yonse

### v0.0.2_01 — Kusintha Dzina la Chogwiritsira Ntchito _(30 Marichi 2026)_

- **Kusinthidwa** `c|..|` → `#,|..|` ndi `e|..|` → `#^|..|` — kufanana ndi banja la choyambirira `#`
- **Kuwonjezeredwa** Dzina lachidziwitso lotulutsa: tulutsaninso mamembala a modulu ndi dzina lina

### v0.0.2 — Kupanganso API Yosonkhanitsa & Zoyika _(24 Marichi 2026)_

- **Kuwonjezeredwa** Banja logwiritsira ntchito `$` logwirizanitsa la mndandanda ndi zingwe (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Kuwonjezeredwa** Kugawa kosokoneza mapangidwe kwa mndandanda, tuple, ndi tuple yokhala ndi mayina
- **Kuwonjezeredwa** Zolozera zoipa (`arr[-1]` = chinthu chomaliza)
- **Kuwonjezeredwa** Zoyika zoyambirira — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Marichi 2026)_

- **Kuwonjezeredwa** Kugawa kophatikiza `^=`
- **Kukonzedwa** Milandu yam'mphepete ya masamu a wosanthula; kukonza zolemba

### v0.0.1 — Kutulutsa koyamba kwa anthu onse _(22 Marichi 2026)_

- Wotanthauzira tree-walker + VM yolembetsa (`--vm`, ~4× yofulumira, ~95% kufanana)
- Zomangamanga zonse: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Zizindikiro za Unicode zathunthu, dongosolo la modulu, lambda, kutseka, kusamalira zolakwika
- REPL, LSP, chowonjezera cha VS Code, chopanga maumboni (`zymbol fmt`)

---

_Zymbol-Lang — Chizindikiro. Chapadziko Lonse. Chosasinthika._
