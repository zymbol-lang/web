> **Ziviso:** Gwaro iri rakagadzirwa nekushandurwa nehungwaru hwekugadzira (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Chirevo chepamutemo ndeche **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** mudura redudziro.

---

# Bhuku reZymbol-Lang

> **Rakaongororwa kune v0.0.5 — 2026-05-14**

**Zymbol-Lang** mutauro wepurogiramu wezviratidzo. Hapana mazwi akakosha — zvose chiratidzo. Inoshanda zvakafanana mumutauro wevanhu upi noupi.

- Hapana `if`, `while`, `return` — chete `?`, `@`, `<~`
- Unicode yakazara — ziviso mumutauro upi noupi kana emoji
- Haina hanya nemutauro wevanhu — kodhi yakafanana kwose kwose

**Rudzi rwemuturikiri**: v0.0.5 | **Kufukidza kwekuedza**: 436/436 (kuenzana kweTW ↔ VM)

---

## Zvinoshanduka uye Zvisingachinji

```zymbol
x = 10              // zvinoshanduka zvinochinjika
π := 3.14159        // zvisingachinji — kupihazve ibasa nguva yekumhanya
zita = "Alice"
kushanda = #1         // boolean chokwadi
👋 := "Mhoro"
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

`°` (chiratidzo chedhigirii, U+00B0) inotanga zvinoshanduka zvoga kukosha kwayo kusina kwayakarerekera pakushandiswa kwekutanga:

```zymbol
nhamba = [3, 1, 4, 1, 5]
@ n:nhamba {
    °huwandu += n    // kutanga otomatiki ku 0 pamusoro pechitenderera; inorarama mushure me@
}
>> huwandu ¶         // → 14
```

> `°x` (chivakashure) inosungira pamusoro pechitenderera — mhedzisiro inowanikwa mushure me`@`.
> `x°` (chivakashure chekupedzisira) inosungira mukati mechitenderera — inofa kana chitenderera chapera.
> Tree-walker chete.

---

## Mhando dzeData

| Mhando | Chirevo chaicho | Chiratidzo `#?` | Zvinyorwa |
|------|---------|----------|---------|
| Nhamba yakazara | `42`, `-7` | `###` | 64-bit ine chiratidzo |
| Inoyangarara | `3.14`, `1.5e10` | `##.` | Kunyora kwesainzi kunobvumirwa |
| Tambo | `"zvinyorwa"` | `##"` | Kupinza: `"Mhoro {zita}"` |
| Tsamba | `'A'` | `##'` | Tsamba imwe yeUnicode |
| Boolean | `#1`, `#0` | `##?` | Haisi nhamba — `#1 ≠ 1` |
| Rondedzero | `[1, 2, 3]` | `##]` | Zvinhu zvakafanana |
| Tuple | `(a, b)` | `##)` | Zvinzvimbo |
| Tuple rine zita | `(x: 1, y: 2)` | `##)` | Minda ine mazita |
| Basa | referensi yebasa rine zita | `##()` | Giredhi rekutanga; inoratidza `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Giredhi rekutanga; inoratidza `<lambd/N>` |

```zymbol
// Kuongorora mhando — inodzosera (mhando, manhamba, kukosha)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Kubuda uye Kupinda

```zymbol
>> "Mhoro" ¶                       // ¶ kana \\ kune mutsara mutsva wakajeka
>> "a=" a " b=" b ¶               // kusangana — kukosha kwakawanda
>> (arr$#) ¶                      // zvivakashure zvekupedzisira zvinoda ( ) mu>>

>> zita                           // verenga muchinja (pasina kurudziro)
>> "Isa zita: " zita            // nekurudziro
```

> `¶` (AltGr+R pachibato cheSpanish) na`\\` mitsara mitsva yakaenzana.

---

## Zvekutanga zveTUI

Zvishandiso zvechipo chezvishandiso zvekupedzisira zvezvirongwa zvinopindirana. Zvizhinji zvinoda bhuroko `>>| { }` (skrini inotsiva + modhi mbishi).

```zymbol
>>| {
    >>!                             // chenesa skrini inotsiva
    >>~ (1, 1, 0, 10) > "Kushanda"   // mutsara 1, mbiru 1, fg=10 (girini)
    @~ 1000                         // mira sekondi imwe (1000 ms)
    >>~ (2, 1) > "Zvapera."
}
// terminal inodzoserwa zvoga pakubuda
```

```zymbol
// Kudzvanya kiyi uye saizi yeterminal
>>| {
    [mitsara, mbiru] = >>?              // bvunza zviyero zveterminal
    >>~ (1, 1) > "Terminal: " mitsara " x " mbiru
    <<| kiyi                         // verenga kudzvanya kiyi kunovharira
    >>~ (2, 1) > "Wadzvanya: " kiyi
}
```

> `>>!` inochenesa skrini. `>>?` inodzosera `[mitsara, mbiru]`. `@~ N` inorara N mirisekondi.
> `<<|` inoverenga kudzvanya kiyi kumwe (kunovharira); `<<|?` inoongorora isingavhariri (inodzosera `'\0'` kana isipo).
> Tuple yekubuda kwenzvimbo: `(mutsara, mbiru, BKS, fg, bg)` — nzvimbo ipi neipi inogona kusiiwa nekoma (`>>~ (,,, 196) > "tsvuku"`).
> BKS bitmask: `1`=zvindori, `2`=kutsetsenura, `4`=mutsara wepasi. Palette yemavara 256 eANSI (`0`=default yeterminal).
> Tree-walker chete (kunze kwe `>>!`, `>>?`, `@~`, `>>~` zvinoshandawo mu`--vm`).

---

## Zvishandiso

```zymbol
// Masvomhu
a = 10
b = 3
m1 = a + b    // 13
m2 = a - b    // 7
m3 = a * b    // 30
m4 = a / b    // 3  (kupatsanura nhamba yakazara)
m5 = a % b    // 1
m6 = a ^ b    // 1000  (kusimudzira)

// Enzanisa — pa kuti uongorore
e1 = a == b    // #0
e2 = a <> b    // #1
e3 = a < b     // #0
e4 = a <= b    // #0
e5 = a > b     // #1
e6 = a >= b    // #1

// Zvine musoro
z1 = #1 && #0    // #0
z2 = #1 || #0    // #1
z3 = !#1         // #0
```

---

## Tambo

```zymbol
// Maitiro maviri ekubatanidza
zita = "Alice"
n = 42

>> "Mhoro " zita " une " n ¶       // kusangana — mu>>
tsananguro = "Mhoro {zita}, une {n}"     // kupinza — chero kupi
```

```zymbol
s = "Mhoro nyika"
urefu = s$#                  // 11
chikamu = s$[1..5]             // "Mhoro"  (1-hwaro, magumo akaverengwa)
iripo = s$? "nyika"          // #1
zvikamu = "a,b,c,d"$/ ','   // [a, b, c, d]  (patsanura nechitsauri)
chinja = s$~~["l":"r"]        // "Mhoro nyika" (hapana 'l' muShona)
chinja1 = s$~~["l":"r":1]     // "Mhoro nyika"
mutsetse = "─" $* 20           // "────────────────────"  (dzokorora N nguva)
```

> `+` ndeyenhamba chete. Kune tambo, shandisa `,`, kusangana, kana kupinza.

---

## Kufamba kwekutonga

```zymbol
x = 7

? x > 0 { >> "zvakanaka" ¶ }

? x > 100 {
    >> "hombe" ¶
} _? x > 0 {
    >> "zvakanaka" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "zvakaipa" ¶
}
```

> Mabrace `{ }` **anodiwa** kunyangwe kune chirevo chimwe chete.

---

## Kuenzanisa

```zymbol
// Miganhu
zvibodzwa = 85
giredhi = ?? zvibodzwa {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> giredhi ¶    // → B

// Tambo
rangi = "tsvuku"
kodhi = ?? rangi {
    "tsvuku"   => "#FF0000"
    "girini" => "#00FF00"
    _       => "#000000"
}

// Mapateni ekuenzanisa
tembiricha = -5
chimiro = ?? tembiricha {
    < 0  => "chando"
    < 20 => "kutonhora"
    < 35 => "kudziya"
    _    => "kupisa"
}
>> chimiro ¶    // → chando

// Chimiro chechirevo (maoko ebhuroko)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "zvakaipa" ¶ }
    _    => { >> "zvakanaka" ¶ }
}
```

---

## Zvishwe

```zymbol
@ i:0..4  { >> i " " }        // muganhu unosanganisira:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // nenhanho:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kumashure:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

michero = ["apuro", "peya", "mazambiringa"]
@ m:michero { >> m ¶ }         // kune chinhu chimwe nechimwe murondedzero

@ b:"hello" { >> b "-" }
>> ¶                          // → h-e-l-l-o-  (kune tsamba imwe neimwe mutambo)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> enderera
    ? i > 7 { @! }             // @! tyora
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Chitenderera chisingaperi
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Chitenderera chine chikwangwani (kutyora kwakadzika)
kuverenga = 0
@:kunze {
    kuverenga++
    ? kuverenga >= 3 { @:kunze! }
}
>> kuverenga ¶                    // → 3
```

---

## Mabasa

```zymbol
wedzera(a, b) { <~ a + b }
>> wedzera(3, 4) ¶    // → 7

fakitori(y) {
    ? y <= 1 { <~ 1 }
    <~ y * fakitori(y - 1)
}
>> fakitori(5) ¶    // → 120
```

Mabasa ane **nzvimbo yakaparadzana** — haakwanise kuverenga zvinoshanduka zvekunze. Shandisa paramita yekubuda `<~>` kushandura zvinoshanduka zveanodana:

```zymbol
chinjanisa(a<~, b<~) {
    kwenguva = a
    a = b
    b = kwenguva
}
x = 10
y = 20
chinjanisa(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Mabasa ane mazita **akukosha kwegiredhi rekutanga** — tora zvakananga: `nhamba$> kaviri`. Kuputira: `x -> fn(x)` inoshandawo.

---

## Lambda neClosure

```zymbol
kaviri = x -> x * 2
wedzera = (a, b) -> a + b
>> kaviri(5) ¶    // → 10
>> wedzera(3, 7) ¶  // → 10

// Lambda yebhuroko
patsanura = x -> {
    ? x > 0 { <~ "zvakanaka" }
    _? x < 0 { <~ "zvakaipa" }
    <~ "zero"
}

// Closure — inotora nzvimbo yekunze
chinhu = 3
katatu = x -> x * chinhu
>> katatu(7) ¶    // → 21

// Fekitari
mugadziri_wewedzero(n) { <~ x -> x + n }
wedzera_gumi = mugadziri_wewedzero(10)
>> wedzera_gumi(5) ¶    // → 15

// Murondedzero
zvishandiso = [x -> x+1, x -> x*2, x -> x*x]
>> zvishandiso[3](5) ¶    // → 25
```

---

## Rondedzero

Rondedzero **dzinochinjika** uye dzine zvinhu **zvemhando imwechete**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — kuwana (1-hwaro: chinhu chekutanga)
x = arr[-1]     // 5 — indekisi isina kunaka (chinhu chekupedzisira)
x = arr$#       // 5 — urefu (shandisa (arr$#) mu>>)

arr = arr$+ 6            // wedzera → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // isa panzvimbo 2 (1-hwaro)
arr3 = arr$- 3           // bvisa chiitiko chekutanga cheukoshi
arr4 = arr$-- 3          // bvisa zviitiko zvese
arr5 = arr$-[1]          // bvisa paindekisi 1 (chinhu chekutanga)
arr6 = arr$-[2..3]       // bvisa muganhu (1-hwaro, magumo akaverengwa)

iripo = arr$? 3            // #1 — ine
nzvimbo = arr$?? 3           // [3] — indekisi dzese dzeukoshi (1-hwaro)
chikamu = arr$[1..3]          // [1,2,3] — chikamu (1-hwaro, magumo akaverengwa)
chikamu2 = arr$[1:3]          // [1,2,3] — zvakafanana, syntax yekuverenga-yakavakirwa

kukwira = arr$^+             // ronga kukwira (zvekutanga chete)
kudzika = arr$^-            // ronga kudzika (zvekutanga chete)

// Rondedzero dzetuple dzine mazita/nzvimbo — shandisa $^ nelambda yekuenzanisa
dhatabhesi = [(zita: "Carla", zera: 28), (zita: "Ana", zera: 25), (zita: "Bob", zera: 30)]
nezera  = dhatabhesi$^ (a, b -> a.zera < b.zera)    // nezera kukwira (<)
nezita = dhatabhesi$^ (a, b -> a.zita > b.zita)   // nezita kudzika (>)
>> nezera[1].zita ¶     // → Ana
>> nezita[1].zita ¶    // → Carla

// Kugadziridza chinhu chakananga (rondedzero chete)
arr[1] = 99              // pa
arr[2] += 5              // mubatanidzwa: +=  -=  *=  /=  %=  ^=

// Kugadziridza kwebasa — inodzosera rondedzero itsva; yekutanga haichinji
arr2 = arr[2]$~ 99
```

> Zvose zvekushandisa zveunganidzo zvinodzosera **rondedzero itsva**. Dzosa: `arr = arr$+ 4`.
> `$+` inogona kuketana: `arr = arr$+ 5$+ 6$+ 7`. Zvimwe zvishandiso zvinoshandisa kupihwa kwepakati.
> **Kupihwa kweindekisi kuri 1-hwaro**: `arr[1]` ndicho chinhu chekutanga; `arr[0]` ibasa nguva yekumhanya.
> `$^+` / `$^-` zvinoronga **rondedzero dzezvekutanga** (nhamba, tambo). Kune rondedzero dzetuple, shandisa `$^` nelambda yekuenzanisa — gwara rakanyorwa mulambda (`<` = kukwira, `>` = kudzika).

**Semantiki yekukosha** — kupira rondedzero kune chimwe chinoshanduka kunogadzira kopi yakazvimirira:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b haitanganidzwe
```

```zymbol
// Rondedzero dzakadzika (indekisi 1-hwaro)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (mutsara 2, mbiru 3)
```

---

## Kuputsa Chimiro

```zymbol
// Rondedzero
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[chekutanga, *vasara] = arr         // chekutanga=10  vasara=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ inorasa

// Tuple yenzvimbo
pfungwa = (100, 200)
(px, py) = pfungwa             // px=100  py=200

// Tuple rine zita
munhu = (zita: "Ana", zera: 25, guta: "Madrid")
(zita: n, zera: z) = munhu   // n="Ana"  z=25
```

---

## Tuple

Tuple midziyo yakarongeka **isingachinjiki** inogona kubata kukosha **kwemhando dzakasiyana**.
Kusiyana nerondedzero, zvinhu hazvigone kuchinjwa mushure mekusikwa.

```zymbol
// Nzvimbo — mhando dzakavhengana dzinobvumirwa
pfungwa = (10, 20)
>> pfungwa[1] ¶    // → 10

data = (42, "Mhoro", #1, 3.14)
>> data[3] ¶     // → #1

// Rine zita
munhu = (zita: "Alice", zera: 25)
>> munhu.zita ¶    // → Alice
>> munhu[1] ¶      // → Alice  (indekisi inoshandawo, 1-hwaro)

// Yakadzika
nzvimbo = (x: 10, y: 20)
p = (nzvimbo: nzvimbo, chikwangwani: "mavambo")
>> p.nzvimbo.x ¶        // → 10
```

**Kusachinjika** — chero kuedza kugadzirisa chinhu chetuple ibasa nguva yekumhanya:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ basa nguva yekumhanya: tuple haichinjike
// t[1] += 5    // ❌ basa rimwe chete
```

Kuti uwane kukosha kwakagadziridzwa shandisa `$~` (kugadziridza kwebasa) — inodzosera **tuple itsva**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← yekutanga haichinji
>> t2 ¶    // → (10, 999, 30)

// Tuple rine zita — vaka patsva zvakajeka
munhu = (zita: "Alice", zera: 25)
mukuru  = (zita: munhu.zita, zera: 26)
>> munhu.zera ¶    // → 25
>> mukuru.zera ¶     // → 26
```

---

## Mabasa epamusoro-soro

```zymbol
nhamba = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kaviri  = nhamba$> (x -> x * 2)                  // map  → [2,4,6…20]
zvakaenzana    = nhamba$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
huwandu    = nhamba$< (0, (muunganidzi, x) -> muunganidzi + x)     // reduce → 55

// Ketana kuburikidza nepakati
nhanho1 = nhamba$| (x -> x > 3)
nhanho2 = nhanho1$> (x -> x * x)
>> nhanho2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Mabasa ane mazita anogona kupfuudzwa zvakananga kuHOF
kaviri(x) { <~ x * 2 }
hombe(x) { <~ x > 5 }
r = nhamba$> kaviri       // ✅ referensi yakananga
r = nhamba$| hombe       // ✅ referensi yakananga
```

---

## Mushandisi wepombi

Rutivi rwerudyi runogara rwuchida `_` sechinzvimbo chekukosha kwepombi:

```zymbol
kaviri = x -> x * 2
wedzera = (a, b) -> a + b
kuwedzera = x -> x + 1

m1 = 5 |> kaviri(_)        // → 10
m2 = 10 |> wedzera(_, 5)       // → 15
m3 = 5 |> wedzera(2, _)        // → 7

// Rakatanhamara
m = 5 |> kaviri(_) |> kuwedzera(_) |> kaviri(_)
>> m ¶    // → 22  (5→10→11→22)
```

---

## Kubata Kukanganisa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kupatsanura ne zero" ¶
} :! {
    >> "zvimwe: " _err ¶    // _err inochengeta meseji yekukanganisa
} :> {
    >> "inogara ichishanda" ¶
}
```

| Mhando | Rini |
|------|------|
| `##Div` | Kupatsanura ne zero |
| `##IO` | Faira / sisitimu |
| `##Index` | Indekisi iri kunze kwemuganhu |
| `##Type` | Kusawirirana kwemhando |
| `##Parse` | Kuongorora data |
| `##Network` | Zvikanganiso zvenetiweki |
| `##_` | Chero kukanganisa (kubata-zvose) |

---

## Modules

```zymbol
// lib/calc.zy — muviri wemodule wakavharirwa mumabrace
# calc {
    #> { wedzera, get_PI }

    _π := 3.14159
    wedzera(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // zita renhema rinodiwa

>> c::wedzera(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Budisa nezita reruzhinji rakasiyana
# mylib {
    #> { _wedzera_mukati => huwandu }

    _wedzera_mukati(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::huwandu(3, 4) ¶    // → 7  (zita remukati _wedzera_mukati rakavanzika)
```

> **Mitemo yemodule**: mukati me`# zita { }`, chete `#>`, tsananguro dzebasa, uye zvinotanga zvinoshanduka/zvisingachinji zvechirevo zviri pamutemo. Zvirevo zvinoshanda (`>>`, `<<`, zvishwe, nezvimwe) zvinokonzeresa kukanganisa E013.

---

## Mamodhi eNhamba

Zymbol inogona kuratidza nhamba mu **nhamba dzeUnicode 69** — Devanagari, Arab-Indian, Thai, Klingon pIqaD, Mathematical Bold, zvikamu zveLCD, nezvimwe. Modhi inoshanda inobata chete kubuda kwe`>>`; masvomhu emukati anogara ari binary.

### Kuita kuti nyora ishande

Nyora manhamba `0` uye `9` enyora yaunoda mukati me`#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indian (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reset kuna ASCII
```

### Kubuda uye maboolean

```zymbol
x = 42
>> x ¶          // → 42   (default yeASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (nzvimbo yedhesimali inogara iri ASCII)
>> 1 + 2 ¶      // → ३

// Maboolean: chivakashure # chinogara chiri ASCII, nhamba inochinjika
>> #1 ¶         // → #१   (chokwadi muDevanagari)
>> #0 ¶         // → #०   (nhema — inosiyana na० nhamba yakazara zero)

x = 28 > 4
>> x ¶          // → #१   (mhedzisiro yekuenzanisa inotevera modhi inoshanda)
```

### Manhamba ega ega mubviro

Manhamba echero nyora inotsigirwa anokosha — mumiganhu, modulo, kuenzanisa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Maboolean ega ega mune chero nyora

`#` + nhamba `0` kana `1` kubva kubhuroko ripi neripi inokosha yeboolean:

```zymbol
#٠٩#
kushanda = #١        // yakafanana ne#1
>> kushanda ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **inogara iri ASCII**. `#0` (nhema) inogara yakasiyana ne `0` (nhamba yakazara zero) munyora dzose.

---

## Zvishandiso zveData

```zymbol
// Kutendeuka kwemhando
f = ##.42         // → 42.0  (kuinoyangarara)
i = ###3.7        // → 4     (kunhamba yakazara, tenderera)
t = ##!3.7        // → 3     (kunhamba yakazara, cheka)

// Ongorora tambo kuita nhamba
v1 = #|"42"|      // → 42  (nhamba yakazara)
v2 = #|"3.14"|    // → 3.14  (inoyangarara)
v3 = #|"abc"|     // → "abc"  (yakachengeteka, hapana kukanganisa)

// Tenderera / Cheka
π = 3.14159265
tenderera2 = #.2|π|      // → 3.14  (tenderera kunzvimbo 2 dzedhesimali)
tenderera4 = #.4|π|      // → 3.1416
cheka2 = #!2|π|      // → 3.14  (cheka)

// Kuumbwa kwenhamba
maumbwe = #,|1234567|  // → 1,234,567  (kakomana-kakaparadzaniswa)
sainzi = #^|12345.678|    // → 1.2345678e4  (sainzi)

// Zvekutanga zvehwaro
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Kubuda kwekushandura hwaro
hex = 0x|255|    // → "0x00FF"
bhinari = 0b|65|     // → "0b1000001"
okutari = 0o|8|      // → "0o10"
decimal = 0d|255|    // → "0d0255"
```

---

## Kubatanidzwa kweShell

```zymbol
zuva = <\ date +%Y-%m-%d \>     // tora stdout (inosanganisira \n kumagumo)
>> "Nhasi: " zuva

faira = "data.txt"
zvirimo = <\ cat {faira} \>      // kupinza mumirairo

kubuda = </"./subscript.zy"/>   // shandisa imwe script yeZymbol, tora kubuda
>> kubuda
```

> `><` inotora nharo dzeCLI serondedzero yetambo (tree-walker chete).

---

## Muenzaniso Wakazara: FizzBuzz

```zymbol
patsanura(nhamba) {
    ? nhamba % 15 == 0 { <~ "FizzBuzz" }
    _? nhamba % 3  == 0 { <~ "Fizz" }
    _? nhamba % 5  == 0 { <~ "Buzz" }
    _ { <~ nhamba }
}

@ i:1..20 { >> patsanura(i) ¶ }
```

---

## Referensi yezviratidzo

| Chiratidzo | Kushanda | Chiratidzo | Kushanda |
|--------|-----------|--------|-----------|
| `=` | zvinoshanduka | `$#` | urefu |
| `:=` | zvisingachinji | `$+` | wedzera (inogona kuketana) |
| `>>` | kubuda | `$+[i]` | isa paindekisi (1-hwaro) |
| `<<` | kupinda | `$-` | bvisa chekutanga nekukosha |
| `¶` / `\\` | mutsara mutsva | `$--` | bvisa zvese nekukosha |
| `?` | kana | `$-[i]` | bvisa paindekisi (1-hwaro) |
| `_?` | kana zvisina kudaro-kana | `$-[i..j]` | bvisa muganhu (1-hwaro) |
| `_` | kana zvisina kudaro / kachozi | `$?` | ine |
| `??` | enzanisa | `$??` | tsvaga indekisi dzose (1-hwaro) |
| `@` | chitenderera | `$[s..e]` | chikamu (1-hwaro) |
| `@ N { }` | chitenderera N nguva | `$>` | map |
| `@!` | tyora | `$\|` | filter |
| `@>` | enderera | `$<` | reduce |
| `@:zita { }` | chitenderera chine chikwangwani | `$/ chitsauri` | patsanura tambo |
| `@:zita!` | tyora chikwangwani | `$++ a b c` | kuvaka kubatanidza |
| `@:zita>` | enderera nechikwangwani | `arr[i>j>k]` | indekisi yekufamba |
| `->` | lambda | `arr[i] = kukosha` | gadzirisa chinhu (rondedzero chete) |
| `arr[i] += kukosha` | kugadziridza kwakasanganiswa | `arr[i]$~` | kugadziridza kwebasa (kopi nyowani) |
| `$^+` | ronga kukwira (zvekutanga) | `$^-` | ronga kudzika (zvekutanga) |
| `$^` | ronga nemuenzanisi (tuple) | `<~` | dzosa |
| `\|>` | pombi | `!?` | edza |
| `:!` | bata | `:>` | pakupedzisira |
| `#1` | chokwadi | `#0` | nhema |
| `$!` | ikukanganisa here | `$!!` | paradzira kukanganisa |
| `<#` | pinza | `#>` | budisa |
| `#` | zivisa module | `::` | daidza module |
| `.` | kuwana munda | `#?` | metadata yemhando |
| `#\|..\|` | ongorora nhamba | `##.` | shandura kuinoyangarara |
| `###` | shandura kunhamba yakazara (tenderera) | `##!` | shandura kunhamba yakazara (cheka) |
| `#.N\|..\|` | tenderera | `#!N\|..\|` | cheka |
| `#,\|..\|` | umbo hwekakomana | `#^\|..\|` | sainzi |
| `#d0d9#` | chinja modhi yenhamba | `#09#` | reset kuna ASCII |
| `<\ ..\>` | shandisa shell | `>\<` | nharo dzeCLI |
| `\ zvinoshanduka` | paradza zvinoshanduka pachena | `°x` / `x°` | tsananguro inopisa (kutanga otomatiki) |
| `>>|` | bhuroko reTUI (skrini inotsiva) | `>>~` | kubuda kwenzvimbo |
| `>>!` | chenesa skrini | `>>?` | bvunza saizi yeterminal |
| `<<\|` | kudzvanya kiyi kunovharira | `<<\|?` | ongorora kudzvanya kiyi kusingavhariri |
| `@~ N` | rara N mirisekondi | `$*` | dzokorora tambo N nguva |

---

## Chinyorwa cheKushandurwa kweKuburitswa

### v0.0.5 — Zvekutanga zveTUI, Tsananguro Inopisa & Kudzokorora Tambo _(Chivabvu 2026)_

- **Kutyora** Chitsauri cheruoko rwekuenzanisa: `muenzaniso : mhedzisiro` → `muenzaniso => mhedzisiro`
- **Kutyora** Zita renhema rekupinza: `<# nzira <= zita_renhema` → `<# nzira => zita_renhema`
- **Kutyora** Kutumidza zita rekubudisa: `#> { fn <= veruzhinji }` → `#> { fn => veruzhinji }`
- **Yakawedzerwa** Bhuroko reTUI `>>| { }` — skrini inotsiva + modhi mbishi; inochenesa pakubuda
- **Yakawedzerwa** Kubuda kwenzvimbo `>>~ (mutsara, mbiru, BKS, fg, bg) > zvinhu` — nzvimbo dzisingawanzo, mavara 256 eANSI
- **Yakawedzerwa** Kupinda kwekiyi `<<| zvinoshanduka` (kunovharira) uye `<<|? zvinoshanduka` (kuongorora kusingavhariri)
- **Yakawedzerwa** `>>!` chenesa skrini, `>>?` bvunza saizi yeterminal, `@~ N` rara N mirisekondi
- **Yakawedzerwa** Tsananguro inopisa `°x` / `x°` — kutanga zvinoshanduka otomatiki pakushandiswa kwekutanga muzvishwe
- **Yakawedzerwa** Kudzokorora tambo `tambo $* N` — dzokorora tambo N nguva
- **VM** Kuenzana: 436/436 bvunzo dzakapfuura

### v0.0.4 — Indekesi 1-hwaro, Mabasa eGiredhi rekutanga & Module eBhuroko _(Kubvumbi 2026)_

- **Kutyora** Indekesi dzose dzakachinjirwa ku **1-hwaro** — `arr[1]` ndicho chinhu chekutanga; `arr[0]` ibasa nguva yekumhanya
- **Yakawedzerwa** Mabasa ane mazita **akukosha kwegiredhi rekutanga** — tora zvakananga kuHOF: `nhamba$> kaviri`
- **Yakawedzerwa** **Syntax yebhuroko inodiwa** kune module: `# zita { ... }` — syntax yakadzikama yakabviswa
- **Yakawedzerwa** Indekisi yedhigirii dzakawanda: `arr[i>j>k]` (kufamba), `arr[p ; q]` (kubvisa kwakadzikama)
- **Yakawedzerwa** Kutendeuka kwemhando: `##.chirevo` (inoyangarara), `###chirevo` (nhamba yakazara tenderera), `##!chirevo` (nhamba yakazara cheka)
- **Yakawedzerwa** Kupatsanura tambo: `tambo$/ chitsauri` — inodzosera `Array(tambo)`
- **Yakawedzerwa** Kuvaka kubatanidza: `hwaro$++ a b c` — inowedzera zvinhu zvakawanda
- **Yakawedzerwa** Chitenderera chenguva: `@ N { }` — dzokorora N nguva
- **Yakawedzerwa** Syntax yechitenderera chine chikwangwani: `@:zita { }`, `@:zita!`, `@:zita>` — inotsiva `@ @zita` / `@! zita`
- **Yakawedzerwa** Mitemo yenzvimbo yezvinoshanduka: zvinoshanduka `_zita` zvine nzvimbo yebhuroko chaiyo; `\ zvinoshanduka` zvinoparadza nekukurumidza
- **Yakawedzerwa** Mapateni ekuenzanisa ekuenzanisa: `< 0 =>`, `> 5 =>`, `== 42 =>`, nezvimwe
- **Yakawedzerwa** Kukanganisa kweModule E013: zvirevo zvinoshanda mumuviri wemodule hazvibvumirwi
- **Yakagadziriswa** `alias.CONST` ikozvino inogadzirisa nenzira kwayo; `#>` inogona kuoneka mushure metsananguro dzebasa
- **VM** Kuenzana kwakazara: 393/393 bvunzo dzakapfuura

### v0.0.3 — Hurongwa hweNhamba dzeUnicode & Kuvandudzwa kweLSP _(Kubvumbi 2026)_

- **Yakawedzerwa** Mabhuroko manhamba eUnicode makumi matanhatu nepfumbamwe ane chiratidzo chekuchinja modhi `#d0d9#`
- **Yakawedzerwa** Maboolean ega ega mune chero nyora — `#१` / `#०`, `#१` / `#०`, nezvimwe
- **Yakawedzerwa** Manhamba eKlingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Yakawedzerwa** Opcode yeVM `SetNumeralMode` — kuenzana kwakazara netree-walker
- **Yakachinjwa** Kubuda kweboolean `>>` ikozvino kunosanganisira chivakashure `#` (`#0` / `#1`) mumamodhi ese

### v0.0.2_01 — Kutumidza zita reMushandisi _(30 Kurume 2026)_

- **Yakachinjwa** `c|..|` → `#,|..|` uye `e|..|` → `#^|..|` — kuenderana nemhuri yechivakashure `#`
- **Yakawedzerwa** Zita renhema rekubudisa: budisa zve module zvakare pasi pezita rakasiyana

### v0.0.2 — Kugadzirwazve kweAPI yeUunganidzo & Zvinhuisa _(24 Kurume 2026)_

- **Yakawedzerwa** Mhuri yemushandisi `$` yakabatana yerondedzero netambo (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yakawedzerwa** Kupiwa kwekuputsa chimiro kune rondedzero, tuple, uye tuple dzine mazita
- **Yakawedzerwa** Indekisi dzisina kunaka (`arr[-1]` = chinhu chekupedzisira)
- **Yakawedzerwa** Zvinhuisa zvemuno — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Kurume 2026)_

- **Yakawedzerwa** Kupiwa kwakasanganiswa `^=`
- **Yakagadziriswa** Zviitiko zvemumucheto wemasvomhu wepatsanuri; kugadziriswa kwegwaro

### v0.0.1 — Kuburitswa kwekutanga kweruzhinji _(22 Kurume 2026)_

- Muturikiri wetree-walker + VM yerejista (`--vm`, ~4× inokurumidza, ~95% kuenzana)
- Zvese zvivakwa zvepakutanga: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Ziviso dzeUnicode dzakazara, hurongwa hwemodule, lambda, closure, kubata kukanganisa
- REPL, LSP, kuwedzera kweVS Code, muumbi (`zymbol fmt`)

---

_Zymbol-Lang — Chiratidzo. Chepasi rose. Chisingachinjiki._
