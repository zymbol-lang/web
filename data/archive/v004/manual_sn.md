> **Chiziviso:** Gwaro iri rakagadzirwa nerubatsiro rwehungwaru hwekugadzira (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referensi yechokwadi ndeye **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** mudura redududziro.

---

# Bhuku reZymbol-Lang

**Zymbol-Lang** mutauro wekuronga wechiratidzo. Hapana mazwi akakosha — zvese chiratidzo. Inoshanda zvakafanana mumutauro upi noupi wevanhu.

- Hapana `if`, `while`, `return` — chete `?`, `@`, `<~`
- Unicode yakazara — zviziviso mumutauro upi noupi kana emoji
- Haina hanya nemutauro wevanhu — kodhi yakafanana kwese kwese

**Shanduro yedududziro**: v0.0.4 | **Kufukidzwa kweyedzo**: 393/393 (kuenzana kwe TW ↔ VM)

---

---

## Zvinoshanduka nezvinogara

```zymbol
x = 10              // zvinoshanduka zvinogona kuchinjwa
PI := 3.14159       // chinogara — kugoverazve kukanganisa kwenguva yekumhanya
zita = "Alice"
chinoshanda = #1      // Boolean chechokwadi
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

---

## Mhando dzeData

| Mhando | Chirevo | Tag `#?` | Zvinyorwa |
|--------|---------|----------|-----------|
| Nhamba | `42`, `-7` | `###` | 64-bit ine chiratidzo |
| Inoyangarara | `3.14`, `1.5e10` | `##.` | Kunyorwa kwesainzi kunobvumirwa |
| Tambo | `"zvinyorwa"` | `##"` | Kupindirira: `"Mhoro {zita}"` |
| Hunhu | `'A'` | `##'` | Hunhu hweUnicode humwe |
| Boolean | `#1`, `#0` | `##?` | HAKUCHI nhamba — `#1 ≠ 1` |
| Rondedzero | `[1, 2, 3]` | `##]` | Zvinhu zvakafanana |
| Tuple | `(a, b)` | `##)` | Kwenzvimbo |
| Tuple ine zita | `(x: 1, y: 2)` | `##)` | Minda ine mazita |
| Basa | referensi yebasa rine zita | `##()` | Giredhi yekutanga; inoratidza `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Giredhi yekutanga; inoratidza `<lambd/N>` |

```zymbol
// Kuongorora mhando — inodzosa (mhando, manhamba, kukosha)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Kubuda neKupinda

```zymbol
>> "Mhoro" ¶                       // ¶ kana \\ kune mutsara mutsva wakajeka
>> "a=" a " b=" b ¶               // kuiswa padivi — kukosha kwakawanda
>> (arr$#) ¶                      // vashandisi vepostfix vanoda ( ) mukati me >>

<< zita                           // verenga muchinoshanda (pasina kukurudzira)
<< "Isa zita rako: " zita         // nekukurudzira
```

> `¶` (AltGr+R pakeyibhodhi yeSpanish) na `\\` zvakaenzana pamutsara mutsva.

---

---

## Vashandisi

```zymbol
// Masvomhu — shandisa migove; vamwe vashandisi vane hunhu hwakananga mukati me >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (kupatsanura nhamba)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kusimudzira)

// Kuenzanisa
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Zvepfungwa
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Tambo

```zymbol
// Nzira mbiri dzekubatanidza
zita = "Alice"
n = 42

>> "Mhoro " zita " une " n ¶       // kuiswa padivi — mukati me >>
tsananguro = "Mhoro {zita}, une {n}"   // kupindirira — chero kupi
```

```zymbol
s = "Mhoro Nyika"
urefu = s$#                  // 10
chidimbu = s$[1..5]          // "Mhoro"  (hwaro-1, kusanganisira magumo)
kune = s$? "Nyika"           // #1
zvikamu = "a,b,c,d"$/ ','    // [a, b, c, d]  (kupatsanura nemupatsanuri)
zvakatsiviwa = s$~~["a":"o"] // "Mhoro Nyiko"
zvakatsiviwa1 = s$~~["a":"o":1] // "Mhoro Nyiko" (N dzekutanga chete)
```

> `+` ndeye nhamba chete. Kune tambo, shandisa `,`, kuiswa padivi, kana kupindirira.

---

---

## Kufamba Kwekutonga

```zymbol
x = 7

? x > 0 { >> "chakanaka" ¶ }

? x > 100 {
    >> "hombe" ¶
} _? x > 0 {
    >> "chakanaka" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "chakashata" ¶
}
```

> Mabrace `{ }` **anodiwa** kunyangwe kune chirevo chimwe chete.

---

---

## Kuenzanisa

```zymbol
// Renji
zvibodzwa = 85
giredhi = ?? zvibodzwa {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> giredhi ¶     // → B

// Tambo
rangi = "tsvuku"
kodi = ?? rangi {
    "tsvuku"  : "#FF0000"
    "girinhi" : "#00FF00"
    _         : "#000000"
}

// Mapatani ekuenzanisa
tempericha = -5
chimiro = ?? tempericha {
    < 0  : "chando"
    < 20 : "kutonhora"
    < 35 : "kudziya"
    _    : "kupisa"
}
>> chimiro ¶     // → chando

// Chimiro chechirevo (mabhuroko)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "chakashata" ¶ }
    _        : { >> "chakanaka" ¶ }
}
```

---

## Zvishwe

```zymbol
@ i:0..4  { >> i " " }        // renji rinosanganisira:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // nenhanho:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kudzokera shure:       5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (apo)

zvibereko = ["apuro", "peya", "muzambiringa"]
@ z:zvibereko { >> z ¶ }          // kune chinhu chese murondedzero

@ h:"mhoro" { >> h "-" }
>> ¶                          // → m-h-o-r-o-  (kune hunhu hwese mukati metambo)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> enderera
    ? i > 7 { @! }            // @! tyora
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Zvishwe zvisina magumo
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Zvishwe zvine mucherechedzo (kutyora kwakadzika)
kaunda = 0
@:kunze {
    kaunda++
    ? kaunda >= 3 { @:kunze! }
}
>> kaunda ¶                   // → 3
```

---

---

## Mabasa

```zymbol
wedzera(a, b) { <~ a + b }
>> wedzera(3, 4) ¶   // → 7

zvinowanda(n) {
    ? n <= 1 { <~ 1 }
    <~ n * zvinowanda(n - 1)
}
>> zvinowanda(5) ¶    // → 120
```

Mabasa ane **nzvimbo yakasarudzika** — haakwanise kuverenga zvinoshanduka zvekunze. Shandisa magedhi ekubuda `<~>` kushandura zvinoshanduka zveanodana:

```zymbol
chinjanisa(a<~, b<~) {
    chengetedzo = a
    a = b
    b = chengetedzo
}
x = 10
y = 20
chinjanisa(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Mabasa ane mazita **ndiwo makosho egiredhi yekutanga** — tumira zvakananga: `nums$> kaviri`. `x -> fn(x)` inoshandawo.

---

---

## Lambda uye Zvivharo

```zymbol
kaviri = x -> x * 2
wedzera = (a, b) -> a + b
>> kaviri(5) ¶   // → 10
>> wedzera(3, 7) ¶  // → 10

// Lambda yebhuroko
chikamu = x -> {
    ? x > 0 { <~ "chakanaka" }
    _? x < 0 { <~ "chakashata" }
    <~ "zero"
}

// Chivharo — chinotora nzvimbo yekunze
chinhu = 3
katatu = x -> x * chinhu
>> katatu(7) ¶    // → 21

// Fekitari
gadza_muwedzeri(n) { <~ x -> x + n }
wedzera_gumi = gadza_muwedzeri(10)
>> wedzera_gumi(5) ¶   // → 15

// Murondedzero
maop = [x -> x+1, x -> x*2, x -> x*x]
>> maop[3](5) ¶      // → 25
```

---

## Rondedzero

Rondedzero **dzinochinjika** uye dzine zvinhu **zverudzi rumwe chete**.

```zymbol
rondedzero = [1, 2, 3, 4, 5]

rondedzero[1]          // 1 — kuwana (hwaro-1: chinhu chekutanga)
rondedzero[-1]         // 5 — indekisi isina kunaka (chinhu chekupedzisira)
rondedzero$#           // 5 — urefu (shandisa (rondedzero$#) mukati me >>)

rondedzero = rondedzero$+ 6            // wedzera → [1,2,3,4,5,6]
rondedzero2 = rondedzero$+[2] 99       // isa panzvimbo 2 (hwaro-1)
rondedzero3 = rondedzero$- 3           // bvisa kuonekwa kwekutanga kwekukosha
rondedzero4 = rondedzero$-- 3          // bvisa kuonekwa kwese
rondedzero5 = rondedzero$-[1]          // bvisa paindeksi 1 (chinhu chekutanga)
rondedzero6 = rondedzero$-[2..3]       // bvisa renji (hwaro-1, kusanganisira magumo)

kune = rondedzero$? 3           // #1 — ine
nzvimbo = rondedzero$?? 3       // [3] — indekisi dzese dzekukosha (hwaro-1)
chimedu = rondedzero$[1..3]     // [1,2,3] — chimedu (hwaro-1, kusanganisira magumo)
chimedu2 = rondedzero$[1:3]     // [1,2,3] — zvakafanana, syntax yehuwandu

kukwira = rondedzero$^+         // kuronga kukwira (ezvepakutanga chete)
kudzika = rondedzero$^-         // kuronga kudzika (ezvepakutanga chete)

// Rondedzero yetuple ine mazita/nenzvimbo — shandisa $^ ne lambda yekuenzanisa
data = [(zita: "Carla", makore: 28), (zita: "Ana", makore: 25), (zita: "Bob", makore: 30)]
maererano_nemakore   = data$^ (a, b -> a.makore < b.makore)   // kukwira maererano nemakore (<)
maererano_nezita   = data$^ (a, b -> a.zita > b.zita)         // kudzika maererano nezita (>)
>> maererano_nemakore[1].zita ¶   // → Ana
>> maererano_nezita[1].zita ¶     // → Carla

// Kugadzirisa chinhu zvakananga (rondedzero chete)
rondedzero[1] = 99              // gova
rondedzero[2] += 5              // yakasanganiswa: +=  -=  *=  /=  %=  ^=

// Kugadzirisa kwebasa — inodzosera rondedzero itsva; yekutanga haichinji
rondedzero2 = rondedzero[2]$~ 99
```

> Vashandisi vese vekuunganidza vanodzosera **rondedzero itsva**. Govazve: `rondedzero = rondedzero$+ 4`.
> `$+` inogona kutevedzana: `rondedzero = rondedzero$+ 5$+ 6$+ 7`. Vamwe vashandisi vanoshandisa migove yepakati.
> **Indekisi ndeye hwaro-1**: `rondedzero[1]` ndicho chinhu chekutanga; `rondedzero[0]` kukanganisa kwenguva yekumhanya.
> `$^+` / `$^-` inoronga **rondedzero dzechinyakare** (nhamba, tambo). Kune rondedzero yetuple, shandisa $^ ne lambda yekuenzanisa — gwara rakanyorwa mukati me lambda (`<` = kukwira, `>` = kudzika).

**Semantiki yekukosha** — kugovera rondedzero kune imwe shanduko kunogadzira kopi yakazvimirira:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b haina kukanganiswa
```

```zymbol
// Rondedzero dzakadzika (indekisi yehwaro-1)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (mutsetse 2, mbiru 3)
```

---

---

## Kuparura

```zymbol
// Rondedzero
rondedzero = [10, 20, 30, 40, 50]
[a, b, c] = rondedzero              // a=10  b=20  c=30
[yekutanga, *zvakasara] = rondedzero   // yekutanga=10  zvakasara=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ inorasa

// Tuple yenzvimbo
pfungwa = (100, 200)
(px, py) = pfungwa               // px=100  py=200

// Tuple ine zita
munhu = (zita: "Ana", makore: 25, guta: "Madrid")
(zita: z, makore: m) = munhu     // z="Ana"  m=25
```

---

## Tuple

Tuple midziyo **isingachinjiki** yakarongeka inogona kutakura kukosha **kwemhando dzakasiyana**.
Kusiyana nerondedzero, zvinhu hazvigone kuchinjwa mushure mekusikwa.

```zymbol
// Kwenzvimbo — mhando dzakavhengana dzinobvumirwa
pfungwa = (10, 20)
>> pfungwa[1] ¶     // → 10

data = (42, "mhoro", #1, 3.14)
>> data[3] ¶       // → #1

// Ine zita
munhu = (zita: "Alice", makore: 25)
>> munhu.zita ¶      // → Alice
>> munhu[1] ¶        // → Alice  (indekisi inoshandawo, hwaro-1)

// Yakadzika
nzvimbo = (x: 10, y: 20)
p = (nzvimbo: nzvimbo, mucherechedzo: "mavambo")
>> p.nzvimbo.x ¶      // → 10
```

**Kusachinjika** — chero kuedza kushandura chinhu chetuple kukanganisa kwenguva yekumhanya:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kukanganisa kwenguva yekumhanya: tuple haichinjiki
// t[1] += 5    // ❌ kukanganisa kwakafanana

// Tuple ine zita — vaka zvakajeka
munhu = (zita: "Alice", makore: 25)
hombe = (zita: munhu.zita, makore: 26)
>> munhu.makore ¶    // → 25
>> hombe.makore ¶    // → 26
```

Kuwana kukosha kwakachinjwa shandisa `$~` (kugadzirisa kwebasa) — inodzosera tuple **itsva**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← yekutanga haichinji
>> t2 ¶    // → (10, 999, 30)
```

---

---

## Mabasa Epamusoro-soro

```zymbol
nhamba = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dzakapetwa_kaviri = nhamba$> (x -> x * 2)                // mepu → [2,4,6…20]
nhamba_huru   = nhamba$| (x -> x % 2 == 0)              // sefa → [2,4,6,8,10]
huwandu   = nhamba$< (0, (chiumbwa, x) -> chiumbwa + x) // kudzikisira → 55

// Kutevedzana kuburikidza nezviri pakati
nhanho1 = nhamba$| (x -> x > 3)
nhanho2 = nhanho1$> (x -> x * x)
>> nhanho2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Mabasa ane mazita anogona kutumirwa zvakananga kumabasa epamusoro-soro
kaviri(x) { <~ x * 2 }
hombe(x) { <~ x > 5 }
r = nhamba$> kaviri       // ✅ referensi yakananga
r = nhamba$| hombe        // ✅ referensi yakananga
```

---

---

## Mubati wepombi

Rutivi rwerudyi runogara ruchida `_` sechigadziko chekukosha kwakapombwa:

```zymbol
kaviri = x -> x * 2
wedzera = (a, b) -> a + b
wedzera_imwe = x -> x + 1

5 |> kaviri(_)        // → 10
10 |> wedzera(_, 5)   // → 15
5 |> wedzera(2, _)    // → 7

// Yakatevedzana
r = 5 |> kaviri(_) |> wedzera_imwe(_) |> kaviri(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kubata Kukanganisa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kupatsanura ne zero" ¶
} :! {
    >> "kumwe kukanganisa: " _err ¶    // _err inobata meseji yekukanganisa
} :> {
    >> "inomhanya nguva dzose" ¶
}
```

| Mhando | Rinhi |
|--------|-------|
| `##Div` | Kupatsanura ne zero |
| `##IO` | Faira / sisitimu |
| `##Index` | Indekisi iri kunze kwemiganhu |
| `##Type` | Mhando dzisingaenderani |
| `##Parse` | Kuongorora data |
| `##Network` | Kukanganisa kwetiweki |
| `##_` | Chero kukanganisa (kunobata zvese) |

---

---

## Zvikamu

```zymbol
// lib/calc.zy — muviri wechikamu uri mumabrace
# calc {
    #> { wedzera, get_PI }

    _PI := 3.14159
    wedzera(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias inodiwa

>> c::wedzera(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Kubudisa neimwe zita reruzhinji
# raibhurari_yangu {
    #> { _wedzera_mukati <= chiverengero }

    _wedzera_mukati(a, b) { <~ a + b }
}
```

```zymbol
<# ./raibhurari_yangu <= m

>> m::chiverengero(3, 4) ¶    // → 7  (zita remukati _wedzera_mukati rakavanzika)
```

> **Mitemo yezvikamu**: mukati me `# zita { }`, `#>`, tsanangudzo dzebasa, uye zvinotangisa zvinoshanduka/zvinogara zvechirevo chete ndizvo zvinobvumirwa. Zvirevo zvinogona kuitwa (`>>`, `<<`, zvishwe, nezvimwe) zvinokonzeresa kukanganisa E013.

---

---

## Mamodhi eNhamba

Zymbol inogona kuratidza nhamba mu **69 mabhuroko emanhamba eUnicode** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Mathematical bold, zvikamu zveLCD, nezvimwe. Modhi inoshanda inokanganisa kubuda kwe `>>` chete; masvomhu emukati anogara ari mabhinari.

### Kuita kuti chinyorwa chishande

Nyora manhamba `0` na `9` echinyorwa chauri kunanga mukati me `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic   (U+0660–U+0669)
#๐๙#    // Thai           (U+0E50–U+0E59)
#09#    // reset ku ASCII
```

---

### Kubuda neBoolean

```zymbol
x = 42
>> x ¶          // → 42   (standard ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (poidhi yedesimali inogara iri ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: chivakamberi # chinogara chiri ASCII, nhamba inoenderana
>> #1 ¶         // → #१   (chokwadi muDevanagari)
>> #0 ¶         // → #०   (nhema — inosiyana ne ० nhamba zero)

x = 28 > 4
>> x ¶          // → #१   (mhedzisiro yekuenzanisa inotevera modhi inoshanda)
```

---

## Manhamba echinyakare mukodhi yekutanga

Manhamba echinyorwa chipi nechipi chinotsigirwa zvirevo zvinoshanda — murenji, mumodhulo, mukuenzanisa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

---

### Zvirevo zveBoolean mune chero chinyorwa

`#` + nhamba `0` kana `1` kubva kubhuroko chero ripi zvacho chirevo cheBoolean chinoshanda:

```zymbol
#०९#
chinoshanda = #१        // zvakafanana ne #1
>> chinoshanda ¶        // → #१
>> (#१ && #०) ¶         // → #०
```

> `#` **inogara iri ASCII**. `#0` (nhema) inogara ichisiyana pakuonekwa kubva ku `0` (nhamba zero) mune chero chinyorwa.

---

---

## Vashandisi veData

```zymbol
// Kushandura mhando
##.42         // → 42.0  (ku Inoyangarara)
###3.7        // → 4     (ku Nhamba, kutenderera)
##!3.7        // → 3     (ku Nhamba, kucheka)

// Kuchinjura tambo kuita nhamba
v1 = #|"42"|      // → 42  (Nhamba)
v2 = #|"3.14"|    // → 3.14  (Inoyangarara)
v3 = #|"abc"|     // → "abc"  (yakachengeteka, hapana kukanganisa)

// Kutenderera / kucheka
pi = 3.14159265
kutenderera2 = #.2|pi|     // → 3.14  (tenderera kunzvimbo 2 dzedesimali)
kutenderera4 = #.4|pi|     // → 3.1416
kucheka2 = #!2|pi|         // → 3.14  (cheka)

// Kugadzira nhamba
chimiro = #,|1234567|   // → 1,234,567  (kupatsanurwa nekoma)
sainzi = #^|12345.678|  // → 1.2345678e4  (sainzi)

// Zvirevo zvehwaro
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (bhinari)
c = 0o101        // → 'A'  (octal)

// Kubuda kwekushandura hwaro
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

---

## Kubatanidza Sheli

```zymbol
zuva = <\ date +%Y-%m-%d \>     // inotora stdout (inosanganisira \n kumagumo)
>> "Nhasi: " zuva

faira = "data.txt"
zviri_mukati = <\ cat {faira} \>    // kupindirira mumirairo

kubuda = </"./subscript.zy"/>   // mhanyisa imwe skiripiti yeZymbol, tora kubuda
>> kubuda
```

> `><` inotora magedhi eCLI serondedzero yetambo (tree-walker chete).

---

---

## Muenzaniso Wakazara: FizzBuzz

```zymbol
chikamu(nhamba) {
    ? nhamba % 15 == 0 { <~ "FizzBuzz" }
    _? nhamba % 3  == 0 { <~ "Fizz" }
    _? nhamba % 5  == 0 { <~ "Buzz" }
    _ { <~ nhamba }
}

@ i:1..20 { >> chikamu(i) ¶ }
```

---

## Referensi yezviratidzo

| Chiratidzo | Basa | Chiratidzo | Basa |
|------------|------|------------|------|
| `=` | zvinoshanduka | `$#` | urefu |
| `:=` | chinogara | `$+` | wedzera (zvinotevedzana) |
| `>>` | kubuda | `$+[i]` | isa paindeksi (hwaro-1) |
| `<<` | kupinda | `$-` | bvisa yekutanga maererano nekukosha |
| `¶` / `\\` | mutsara mutsva | `$--` | bvisa zvese maererano nekukosha |
| `?` | kana | `$-[i]` | bvisa paindeksi (hwaro-1) |
| `_?` | zvikasadaro kana | `$-[i..j]` | bvisa renji (hwaro-1) |
| `_` | zvikasadaro / mhando dzese | `$?` | ine |
| `??` | kuenzanisa | `$??` | tsvaga indekisi dzese (hwaro-1) |
| `@` | zvishwe | `$[s..e]` | chimedu (hwaro-1) |
| `@ N { }` | zvishwe N nguva | `$>` | mepu |
| `@!` | tyora | `$|` | sefa |
| `@>` | enderera | `$<` | kudzikisira |
| `@:zita { }` | zvishwe zvine mucherechedzo | `$/ mupatsanuri` | kupatsanura tambo |
| `@:zita!` | tyora zvine mucherechedzo | `$++ a b c` | kuvaka kubatanidza |
| `@:zita>` | enderera zvine mucherechedzo | `rondedzero[i>j>k]` | indekisi yekufambisa |
| `->` | lambda | `rondedzero[i] = kukosha` | gadzirisa chinhu (rondedzero chete) |
| `rondedzero[i] += kukosha` | kugadzirisa kwakasanganiswa | `rondedzero[i]$~` | kugadzirisa kwebasa (kopi itsva) |
| `$^+` | kuronga kukwira (zvepakutanga) | `$^-` | kuronga kudzika (zvepakutanga) |
| `$^` | kuronga nechienzanisi (tuple) | `<~` | dzosa |
| `|>` | pombi | `!?` | edza |
| `:!` | bata | `:>` | pakupedzisira |
| `#1` | chokwadi | `#0` | nhema |
| `$!` | kukanganisa | `$!!` | paradzira kukanganisa |
| `<#` | pinza | `#>` | budisa |
| `#` | zivisa chikamu | `::` | dana chikamu |
| `.` | kuwana munda | `#?` | metadata yemhando |
| `#\|..\|` | chinjura nhamba | `##.` | shandura ku Inoyangarara |
| `###` | shandura ku Nhamba (tenderera) | `##!` | shandura ku Nhamba (cheka) |
| `#.N\|..\|` | tenderera | `#!N\|..\|` | cheka |
| `#,\|..\|` | chimiro chekoma | `#^\|..\|` | sainzi |
| `#d0d9#` | shandura modhi yenhamba | `#09#` | reset ku ASCII |
| `<\ ..\>` | mhanyisa sheli | `>\<` | magedhi eCLI |
| `\ var` | paradza zvinoshanduka pachena | | |

---

---

## Dhindindi rekuchinja kwekubuditswa

### v0.0.4 — Indekisi yeHwaro-1, Mabasa eGiredhi Yekutanga & Zvikamu Zvemabhuroko _(Kubvumbi 2026)_

- **Inotyora** Indekisi dzese dzakashandurwa kuva **hwaro-1** — `rondedzero[1]` ndicho chinhu chekutanga; `rondedzero[0]` kukanganisa kwenguva yekumhanya
- **Yakawedzerwa** Mabasa ane mazita **ndiwo makosho egiredhi yekutanga** — tumira zvakananga kumabasa epamusoro-soro: `nums$> kaviri`
- **Yakawedzerwa** **Syntax yemabhuroko** yezvikamu inodiwa: `# zita { ... }` — syntax yakati sandara yabviswa
- **Yakawedzerwa** Indekisi yemativi akawanda: `rondedzero[i>j>k]` (kufambisa), `rondedzero[p ; q]` (kuburitsa kwakati sandara)
- **Yakawedzerwa** Kushandura mhando: `##.chirevo` (Inoyangarara), `###chirevo` (Nhamba tenderera), `##!chirevo` (Nhamba cheka)
- **Yakawedzerwa** Kupatsanura tambo: `tambo$/ mupatsanuri` — inodzosera `Array(Tambo)`
- **Yakawedzerwa** Kuvaka kubatanidza: `hwaro$++ a b c` — inowedzera zvinhu zvakawanda
- **Yakawedzerwa** Zvishwe N nguva: `@ N { }` — dzokorora kanhivi kaN
- **Yakawedzerwa** Syntax yezvishwe zvine mucherechedzo: `@:zita { }`, `@:zita!`, `@:zita>` — inotsiva `@ @zita` / `@! zita`
- **Yakawedzerwa** Mitemo yenzvimbo yezvinoshanduka: zvinoshanduka `_zita` zvine nzvimbo yebhuroko chaiyo; `\ var` inoparadza nekukurumidza
- **Yakawedzerwa** Mapatani ekuenzanisa ekuenzanisa: `< 0 :`, `> 5 :`, `== 42 :`, nezvimwe
- **Yakawedzerwa** Kukanganisa kwechikamu E013: zvirevo zvinogona kuitwa mumuviri wechikamu zvinorambidzwa
- **Yakagadziriswa** `take_variable` haichakanganisi zvinogara zvechikamu pakunyora kumashure
- **Yakagadziriswa** `alias.CONST` ikozvino inogadziriswa nenzira kwayo; `#>` inogona kuoneka mushure mekutsanangurwa kwebasa
- **VM** Kuenzana kwakazara: 393/393 yedzo dzinopfuura

### v0.0.3 — Sisitimu dzenhamba dzeUnicode & Natsiridzo dzeLSP _(Kubvumbi 2026)_

- **Yakawedzerwa** 65 mabhuroko emanhamba eUnicode ane tokeni yekuchinja modhi `#d0d9#`
- **Yakawedzerwa** Zvirevo zveBoolean mune chero chinyorwa — `#१` / `#०`, `#१` / `#०`, nezvimwe
- **Yakawedzerwa** Manhamba eKlingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Yakawedzerwa** `SetNumeralMode` opkoodi yeVM — kuenzana kwakazara nemufambi wemuti
- **Yakawedzerwa** REPL inoremekedza modhi yenhamba inoshanda mumaeki nekuratidzwa kwezvinoshanduka
- **Yakachinjwa** Boolean `>>` kubuda ikozvino kunosanganisira chivakamberi `#` (`#0` / `#1`) mumamodhi ese

### v0.0.2_01 — Kupihwa zita idzva kwevashandisi _(30 Kurume 2026)_

- **Yakachinjwa** `c|..|` → `#,|..|` uye `e|..|` → `#^|..|` — kuenderana nemhuri yechivakamberi chechimiro `#`
- **Yakawedzerwa** Alias yekubudisa — budisa zvakare nhengo dzechikamu nezita rakasiyana

### v0.0.2 — Kugadzirwazve kweAPI yekuunganidza & Zvinogadzirisa _(24 Kurume 2026)_

- **Yakawedzerwa** Mhuri yakabatana yevashandisi `$` yezvakatevedzana netambo (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yakawedzerwa** Kugovera kwekuparura kwezvakatevedzana, tuple, netuple zvine mazita
- **Yakawedzerwa** Indekisi dzisina kunaka (`rondedzero[-1]` = chinhu chekupedzisira)
- **Yakawedzerwa** Zvinogadzirisa zvechizvarwa — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Kurume 2026)_

- **Yakawedzerwa** Kugovera kwakasanganiswa `^=`
- **Yakagadziriswa** Nyaya dzemumucheto dzemasvomhu dzeanopatsanura; kugadziriswa kwegwaro

### v0.0.1 — Kubuditswa kwekutanga kuruzhinji _(22 Kurume 2026)_

- Dududziro yemufambi wemuti + VM yerejista (`--vm`, ~4× nekukurumidza, ~95% kuenzana)
- Zvivakwa zvese zvepamusoro: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Zviziviso zveUnicode zvizere, sisitimu yezvikamu, lambda, zvivharo, kubata kukanganisa
- REPL, LSP, Kuwedzera kweVS Code, muchimiro (`zymbol fmt`)

---

_Zymbol-Lang — Chiratidzo. Kwese kwese. Hachichinjiki._
