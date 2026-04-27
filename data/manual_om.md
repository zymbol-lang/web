> **Hubachiisa:** Asmeentaan kun gargaarsa sammuu ogummaa (AI) tiin uumame.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Wabii qulqulluun **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** mana kuusaa hiikaa keessatti.

---

# Zymbol-Lang Qajeelcha

**Zymbol-Lang** afaanoha mallattoo ti. Jechoota ijoo hin qabu — wanti hundi mallattoo ti. Afaan nama hundaan wal qixxee hojjeta.

- `if`, `while`, `return` hin qabu — qofa `?`, `@`, `<~`
- Unicode guutuu — addaayyaa afaan kamii ykn emoji kamitti
- Afaan nama irraa hin eegalu — koodaan lafa hundaa wal qixa

**Hiikaa fooyya'aa**: v0.0.4 | **Tupha qarxii**: 393/393 (wal qixxumma TW ↔ VM)

---

## Jijjiramoo fi Dhaabbattoota

```zymbol
x = 10              // jijjiramoo jijjiiramuu danda'u
PI := 3.14159       // dhaabbataa — deebi'ee ramamuun dogoggorsa yeroo darbeeti
maqaa = "Aliis"
hojjeeffachuu = #1  // Buuliyaan dhugaa
👋 := "Akkam"
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

## Gosa Daataa

| Gosa | Literaala | Taagii `#?` | Yaadannoo |
|------|-----------|-------------|-----------|
| Lakkoofsa faffaca'aa | `42`, `-7` | `###` | 64-bit mallattoo qaba |
| Lakkoofsa qaxxaamura | `3.14`, `1.5e10` | `##.` | Qabxii saayinsiitiin hayyamamti |
| Sirna | `"barruu"` | `##"` | Keessa buusaa: `"Akkam {maqaa}"` |
| Arfii | `'A'` | `##'` | Arfii Unicode tokko |
| Buuliyaan | `#1`, `#0` | `##?` | Lakkoofsa Miti — `#1 ≠ 1` |
| Urush | `[1, 2, 3]` | `##]` | Koree wal fakkaataa |
| Tuupili | `(a, b)` | `##)` | Iddoo |
| Tuupili maqaa qabu | `(x: 1, y: 2)` | `##)` | Dirreewwan maqaa qaban |
| Shaakala | dubbiin shaakala maqaa qabu | `##()` | Sadarkaa 1ffaa; agarsisa `<funct/N>` |
| Laamdaa | `x -> x * 2` | `##->` | Sadarkaa 1ffaa; agarsisa `<lambd/N>` |

```zymbol
// Gosa keessa hubachuu — deebisa (gosa, lakkoofsota, gatii)
meetaa = 42#?
>> meetaa ¶         // → (###, 2, 42)
ti = meetaa[1]
>> ti ¶            // → ###
```

---

## Baafannaa fi Seensaa

```zymbol
>> "Akkam" ¶                       // ¶ ykn \\ sarara haaraa ifa ta'eef
>> "a=" a " b=" b ¶               // wal bira kaa'uu — gatiiwwan hedduu
>> (arr$#) ¶                      // hojiirra ooltoota postfix >> keessatti ( ) barbaadu

<< maqaa                           // jijjiramoo keessatti dubbisuu (ergisiisa malee)
<< "Maqaa galchi: " maqaa          // ergisiisa wajjin
```

> `¶` (AltGr+R kiiboordii Ispeenitti) fi `\\` sarara haaraaf wal qixa.

---

## Hojiirra Ooltoota

```zymbol
// Herrega — ramamuudhaan hojiirra ooli; hojiirra ooltootni tokko tokko >> keessatti qabxii addaa qabu
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (lakkoofsa faffaca'aa qoodu)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (gara guddisuu)

// Wal bira qabu
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b    // #1

// Meeqa tuqaa
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Tartiiba

```zymbol
// Ida'ama roga lama
maqaa = "Aliis"
n = 42

>> "Akkam " maqaa " ati qaba " n ¶       // wal bira kaa'uu — >> keessatti
ibsa = "Akkam {maqaa}, ati qaba {n}"   // keessa buusuu — lafa kamittuu
```

```zymbol
s = "Akkam Addunyaa"
dheerina = s$#                  // 12 (akkasaa foononni irratti Hundaa'a)
xitoo = s$[1..5]                // "Akkam"  (hundee-1, dhuma dabalee)
jira = s$? "Addunyaa"           // #1
caccabuu = "a,b,c,d"$/ ','      // [a, b, c, d]  (shoqee ittiin caccabuudhaan caccabuu)
jijjiiramee = s$~~["a":"o"]     // "okkom Addunyoo"
jijjiiramee1 = s$~~["a":"o":1]  // "okkom Addunyaa" (N jalqabaa qofa)
```

> `+` lakkoofsotaaf qofa. Sirnootaaf, `,`, wal bira kaa'uu, ykn keessa buusuu fayyadami.

---

---

## Yaa'insa to'annaa

```zymbol
x = 7

? x > 0 { >> "to'aa" ¶ }

? x > 100 {
    >> "gudd" ¶
} _? x > 0 {
    >> "to'aa" ¶
} _? x == 0 {
    >> "zeeroo" ¶
} _ {
    >> "negaatiivii" ¶
}
```

> Ciniinnoo `{ }` **barbaachisaa dha** tokkoon tokkoon himamuufis.

---

---

## Walta'uu

```zymbol
// Daangawwan
qabxii = 85
damdamaa = ?? qabxii {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> damdamaa ¶     // → B

// Tartiiba
halluu = "diimaa"
koodii = ?? halluu {
    "diimaa" : "#FF0000"
    "magariisa" : "#00FF00"
    _        : "#000000"
}

// Fakkiin wal bira qabuu
ho'aa = -5
haala = ?? ho'aa {
    < 0  : "cabuu"
    < 20 : "qorra"
    < 35 : "dimmisaa"
    _    : "boba'aa"
}
>> haala ¶       // → cabuu

// Faankishinii (kutaa)
?? n {
    0        : { >> "zeeroo" ¶ }
    _? n < 0 : { >> "negaatiivii" ¶ }
    _        : { >> "to'aa" ¶ }
}
```

---

## Silindarii

```zymbol
@ i:0..4  { >> i " " }        // daangaa dabalee:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tarkaanfii wajjin:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kan faallessu:    5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (hanga)

firi = ["aplee", "piyaara", "waayinii"]
@ f:firi { >> f ¶ }           // urush keessatti koree tokkoo tokkoof

@ a:"akkam" { >> a "-" }
>> ¶                          // → a-k-k-a-m-  (sirna keessatti arfii tokkoo tokkoof)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> itti fufi
    ? i > 7 { @! }            // @! cabs
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Silindarii xumura hin qabne
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Silindarii leemaallaan (cabsuu maxxantuu)
baala'aa = 0
@:alagaa {
    baala'aa++
    ? baala'aa >= 3 { @:alagaa! }
}
>> baala'aa ¶                // → 3
```

---

---

## Shaakala

```zymbol
iduu(a, b) { <~ a + b }
>> iduu(3, 4) ¶   // → 7

dachaa (n) {
    ? n <= 1 { <~ 1 }
    <~ n * dachaa (n - 1)
}
>> dachaa (5) ¶    // → 120
```

Shaakalaan **daangaa addaan baafame** qabu — jijjiramoota alaa dubbisuu hin danda'u. Jijjiramoota waamtuu jijjiiruuf, parameteroota baafannaa `<~` fayyadami:

```zymbol
jijjiir(a<~, b<~) {
    yeroo = a
    a = b
    b = yeroo
}
x = 10
y = 20
jijjiir(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Shaakalawwan maqaa qaban **gatiiwwan sadarkaa 1ffaa dha** — qajeelchi: `nums$> lama`. `x -> fn(x)` ni ta'a.

---

---

## Laamdaa fi Cufiinsa

```zymbol
lama = x -> x * 2
iduu = (a, b) -> a + b
>> lama(5) ¶   // → 10
>> iduu(3, 7) ¶  // → 10

// Laamdaa kutaa
ramaduu = x -> {
    ? x > 0 { <~ "to'aa" }
    _? x < 0 { <~ "negaatiivii" }
    <~ "zeeroo"
}

// Cufiinsa — daangaa alagaa uwwisa
qoodduu = 3
sadaf = x -> x * qoodduu
>> sadaf(7) ¶   // → 21

// Warshaa
ida'aa_uumuu(n) { <~ x -> x + n }
kudhaan_iduu = ida'aa_uumuu(10)
>> kudhaan_iduu(5) ¶   // → 15

// Urush keessatti
socho'oota = [x -> x+1, x -> x*2, x -> x*x]
>> socho'oota[3](5) ¶   // → 25
```

---

## Urushoota

Urush **jijjiiramuu danda'a** fi koreewwan **gosa wal fakkaatu** qaba.

```zymbol
urushii = [1, 2, 3, 4, 5]

urushii[1]          // 1 — ga'umsa (hundee-1: koree jalqabaa)
urushii[-1]         // 5 — iccaan diinaa (koree xumuraa)
urushii$#           // 5 — dheerina (urushii$#) >> keessatti fayyadami)

urushii = urushii$+ 6            // ida'i → [1,2,3,4,5,6]
urushii2 = urushii$+[2] 99       // bakka 2 kesatti gor (hundee-1)
urushii3 = urushii$- 3           // mul'ata jalqabaa gatiitii balleessi
urushii4 = urushii$-- 3          // mul'ata hunda balleessi
urushii5 = urushii$-[1]          // icciiduratti balleessi 1 (koree jalqabaa)
urushii6 = urushii$-[2..3]       // daangaa balleessi (hundee-1, dhuma dabalee)

jira = urushii$? 3               // #1 — qaba
iddoo = urushii$?? 3             // [3] — iccaa gatiitii hunda (hundee-1)
caccaba = urushii$[1..3]         // [1,2,3] — caccaba (hundee-1, dhuma dabalee)
caccaba2 = urushii$[1:3]         // [1,2,3] — wal qixa, loojikii baay'ina isa

ol = urushii$^+                  // ol galmeessi (qajeelaa qofa)
gad = urushii$^-                 // gad galmeessi (qajeelaa qofa)

// Tuupili maqaa qabu/iddoo urushoota — $^ laamdaa walmadaallaa wajjin fayyadami
dhaata = [(maqaa: "Kaarlaa", waggaa: 28), (maqaa: "Annaa", waggaa: 25), (maqaa: "Boobbii", waggaa: 30)]
akk_waggaatti   = dhaata$^ (a, b -> a.waggaa < b.waggaa)     // akk waggaatti ol (<)
akk_maqaatti   = dhaata$^ (a, b -> a.maqaa > b.maqaa)       // akk maqaatti gad (>)
>> akk_waggaatti[1].maqaa ¶    // → Annaa
>> akk_maqaatti[1].maqaa ¶     // → Kaarlaa

// Koree gahumsa kallattii (urushoota qofa)
urushii[1] = 99              // ramadhu
urushii[2] += 5              // walitti makama: +=  -=  *=  /=  %=  ^=

// Gahumsa shaakala — urush haaraa deebisa; kan jalqabaa hin jijjiiru
urushii2 = urushii[2]$~ 99
```

> Hojiirra ooltoota walitti qabaa hundi **urush haaraa** deebisu. Deebi'i ramadhu: `urushii = urushii$+ 4`.
> `$+` sireeffamuu danda'a: `urushii = urushii$+ 5$+ 6$+ 7`. Hojiirra ooltota biroon rammuu gidduu fayyadamu.
> **Iccaanneessuu hundee-1**: `urushii[1]` koree jalqabaa dha; `urushii[0]` dogoggorsa yeroo darbeeti.
> `$^+` / `$^-` **urushoota qajeelaa** galmeessu (lakkoofsota, tartiiba). Tuupili urushootaaf, laamdaa walmadaallaa wajjin $^ fayyadami — kallattiin laamdaa keessatti kooda'a (`<` = ol, `>` = gad).

**Hiika gati** — urushii jijjiramoo biraaf ramamuun koopiyyii of biratti ta'e uuma:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b hin tuqamne
```

```zymbol
// Urushoota maxxantan (iccaaneessuu hundee-1)
maatiriksii = [[1,2,3],[4,5,6],[7,8,9]]
>> maatiriksii[2][3] ¶    // → 6  (toora 2, sarara 3)
```

---

## Caasaanii babal'isu

```zymbol
// Urushii
urushii = [10, 20, 30, 40, 50]
[a, b, c] = urushii              // a=10  b=20  c=30
[jalqaba, *kanneen_haflan] = urushii   // jalqaba=10  kanneen_haflan=[20,30,40,50]
[x, _, z] = [1, 2, 3]         // _ tuffachuu

// Tuupili iddoo
bu'aa = (100, 200)
(px, py) = bu'aa               // px=100  py=200

// Tuupili maqaa qabu
namni = (maqaa: "Annaa", waggaa: 25, magaalaa: "Madriid")
(maqaa: m, waggaa: wag) = namni   // m="Annaa"  wag=25
```

---

## Tuupilii

Tuupilii **jijjiiramuu hin dandeenye** kan tartibaa dha kan gatiiwwan **gosa adda addaa** qabaachuu danda'u.
Urushoota irraa garagalee, koreewwan uumameen booda jijjiiramuu hin danda'u.

```zymbol
// Iddoo — gosa wal makate hayyamama
bu'aa = (10, 20)
>> bu'aa[1] ¶      // → 10

dhaata = (42, "akkam", #1, 3.14)
>> dhaata[3] ¶     // → #1

// Maqaa qabu
namni = (maqaa: "Aliis", waggaa: 25)
>> namni.maqaa ¶    // → Aliis
>> namni[1] ¶       // → Aliis  (icciis ni hojjeti, hundee-1)

// Maxxantaa
iddoo = (x: 10, y: 20)
p = (iddoo: iddoo, lee'oo: "jalqaba")
>> p.iddoo.x ¶       // → 10
```

**Jijjiiramuu hin dandeenye** — tuupilii koree jijjiiruuf yaaluun dogoggorsa yeroo darbeeti:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ dogoggorsa yeroo darbe: tuupilii jijjiiramuu hin danda'u
// t[1] += 5    // ❌ dogoggorsa wal qixa

// Tuupilii maqaa qabu — ifatti deebi'i ijaari
namni = (maqaa: "Aliis", waggaa: 25)
guddaan = (maqaa: namni.maqaa, waggaa: 26)
>> namni.waggaa ¶    // → 25
>> guddaan.waggaa ¶  // → 26
```

Gatii jijjiirame argachuuf `$~` (gahumsa shaakala) fayyadami — tuupilii **haaraa** deebisa:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← kan jalqabaa hin jijjiirne
>> t2 ¶    // → (10, 999, 30)
```

---

## Shaakala Sadarkaa Ol'aanaa

```zymbol
lakkoofsota = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

lamaan = lakkoofsota$> (x -> x * 2)                // kaarti → [2,4,6…20]
jaachisa   = lakkoofsota$| (x -> x % 2 == 0)       // waraaboo → [2,4,6,8,10]
walmadaala   = lakkoofsota$< (0, (kuufamaa, x) -> kuufamaa + x) // xinneessuu → 55

// Isireen firxi
tarkaanfii1 = lakkoofsota$| (x -> x > 3)
tarkaanfii2 = tarkaanfii1$> (x -> x * x)
>> tarkaanfii2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Shaakalawwan maqaa qaban kallattii sadarkaa ol'aanaa shakalaaf ergamuu danda'u
lama(x) { <~ x * 2 }
guddaa_dha(x) { <~ x > 5 }
r = lakkoofsota$> lama       // ✅ wabii kallattii
r = lakkoofsota$| guddaa_dha   // ✅ wabii kallattii
```

---

---

## Hojiirra ooltoo Ujummoo

Harka mirgaa yeroo hunda `_` gara galaatti gatii ujummoo'ameef bakka dhayaa ta'e barbaada:

```zymbol
lama = x -> x * 2
iduu = (a, b) -> a + b
tokko_guddisuu = x -> x + 1

5 |> lama(_)        // → 10
10 |> iduu(_, 5)    // → 15
5 |> iduu(2, _)     // → 7

// Isireeffame
r = 5 |> lama(_) |> tokko_guddisuu(_) |> lama(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Weeyyuu dogoggorsaa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "zeeroo qoodu" ¶
} :! {
    >> "dogoggorsa biraa: " _err ¶    // _err ergaa dogoggorsaa qaba
} :> {
    >> "yeroo hunda hojjeta" ¶
}
```

| Gosa | Yoom |
|------|------|
| `##Div` | Zeeroo qoodu |
| `##IO` | Faayilii / sirna |
| `##Index` | Iccaa daangaa alaa |
| `##Type` | Gosa wal hin simne |
| `##Parse` | Daataa daduu |
| `##Network` | Dogoggorsa netiworkii |
| `##_` | Dogoggorsa kam iyyuu (hunda qaba) |

---

## Moduulii

```zymbol
// lib/calc.zy — qaama moduulii ciniinnoo keessatti
# calc {
    #> { iduu, get_PI }

    _PI := 3.14159
    iduu(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // maqaa waadaa barbaachisa

>> c::iduu(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Maqaa biraa tiin baafachuu
# mana_kuusaa_koo {
    #> { _iduu_keessaa <= walmadaala }

    _iduu_keessaa(a, b) { <~ a + b }
}
```

```zymbol
<# ./mana_kuusaa_koo <= m

>> m::walmadaala(3, 4) ¶    // → 7  (maqaa keessaa _iduu_keessaa dhokadhaa)
```

> **Seerota Moduulii**: `# maqaa { }` keessatti, `#>`, shaakala himannaa, fi jalqabsiisaa jijjiramoo/dhaabbataa literaala qofa hayyamamu. Himannoonni ho'isan (`>>`, `<<`, silindarii, jj) dogoggorsa E013 uumu.

---

---

## Haala Lakkoofsaa

Zymbol lakkoofsa **69 didal lataa Unicode** keessatti agarsiisuu danda'a — Devanagarii, Araba-Hindii, Taayiifi, Kilingon pIqaD, Herrega dhumri, baantoota LCD, fi kkf. Haala aktiiviin baafannaa `>>` qofa miila; herrega keessaa yeroo hunda ulaagaa lamaa.

### Barruufi shaashii Go'o

Lakkoofsota `0` fi `9` barruufi shaashii yeroo goote `#…#` keessatti barreessi:

```zymbol
#०९#    // Devanagarii   (U+0966–U+096F)
#٠٩#    // Araba-Hindii   (U+0660–U+0669)
#๐๙#    // Taayiifi       (U+0E50–U+0E59)
#09#    // deebisii ASCII
```

---

### Baafannaa fi Buuliyaani

```zymbol
x = 42
>> x ¶          // → 42   (ASCIIdhaan)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (qabxii kudhaa yeroo hunda ASCII)
>> 1 + 2 ¶      // → ३

// Buuliyaan: duraa # yeroo hunda ASCII, lakkoofsi ni too'ata
>> #1 ¶         // → #१   (dhugaa Devanagarii keessatti)
>> #0 ¶         // → #०   (soba — ० dhaan 0 lakkoofsi zeeroo irraa adda)

x = 28 > 4
>> x ¶          // → #१   (bu'aan walmadaalaa haala aktiivii hordofa)
```

---

## Lakkoofsota Dhalattuu Koodii Lakkadda keessatti

Lakkoofsi barruufi shaashii kamii (ni danda'ama) ta'ee hundi literaala ta'uu danda'a — daangawwan keessatti, modulo keessatti, walmadaalota keessatti:

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

### Literaala Buuliyaan Barruufi shaashii Kamii Keessaa

`#` + barruufi shaashii didal kamii irraa lakkoofsa `0` ykn `1` literaala Buuliyaan ta'uu danda'a:

```zymbol
#०९#
hojjeeffachuu = #१        // #1 wajjin wal qixa
>> hojjeeffachuu ¶        // → #१
>> (#१ && #०) ¶           // → #०
```

> `#` **yeroo hunda ASCII dha**. `#0` (soba) yeroo hunda `0` (lakkoofsa faffaca'aa zeeroo) irraa barruufi shaashii kamii keessatti adda ta'e.

---

---

## Hojiirra ooltoota Daataa

```zymbol
// Gosa jijjiiruu
##.42         // → 42.0  (Lakkoofsa qaxxaamuraaf)
###3.7        // → 4     (Lakkoofsa faffaca'aaf, daangeeffame)
##!3.7        // → 3     (Lakkoofsa faffaca'aaf, muruu)

// Sirni lakkoofsatti daduu
v1 = #|"42"|      // → 42  (Lakkoofsa faffaca'aa)
v2 = #|"3.14"|    // → 3.14  (Lakkoofsa qaxxaamura)
v3 = #|"abc"|     // → "abc"  (sirri, dogoggorsa hin qabu)

// Daangeeffama / muruu
pi = 3.14159265
daangeeffame2 = #.2|pi|     // → 3.14  (iddoodhaan digrii 2f daangeeffama)
daangeeffame4 = #.4|pi|     // → 3.1416
mure2 = #!2|pi|             // → 3.14  (muruu)

// Lakkoofsa foormaatii
foormaatii = #,|1234567|    // → 1,234,567  (kommaan gargar baa'a)
saayinse = #^|12345.678|     // → 1.2345678e4  (saayinsii)

// Literaalaalee
a = 0x41         // → 'A'  (heeksaadeesiimooli)
b = 0b01000001   // → 'A'  (ulaagaa lama)
c = 0o101        // → 'A'  (oktaayili)

// Baafannaa bu'uuwwaa jijjiirama
heeksi = 0x|255|   // → "0x00FF"
ulaagaa_lamaa = 0b|65|  // → "0b1000001"
oktaayili = 0o|8|  // → "0o10"
digrii = 0d|255|   // → "0d0255"
```

---

---

## Walitti dhufeenya Shelii

```zymbol
guyyaa = <\ date +%Y-%m-%d \>     // baafannaa stdout qabata (dhuma irratti \n dabalaa)
>> "Har'a: " guyyaa

faayilii = "daataa.txt"
qabiyyee = <\ cat {faayilii} \>    // ajaja keessatti keessa buusuu

baafannaa = </"./subscript.zy"/>   // Zymbol skiriptii biraa laachisi, baafannaa qabadhu
>> baafannaa
```

> `><` waajjira kophaa (CLI) argumeentota tartiiba baafannaa akka ta'een qabata (tree-walker qofa).

---

---

## Fakkeenya Guutuu: FizzBuzz

```zymbol
ramaa(lakkoofsa) {
    ? lakkoofsa % 15 == 0 { <~ "FizzBuzz" }
    _? lakkoofsa % 3  == 0 { <~ "Fizz" }
    _? lakkoofsa % 5  == 0 { <~ "Buzz" }
    _ { <~ lakkoofsa }
}

@ i:1..20 { >> ramaa(i) ¶ }
```

---

## Wabi Mallattoo

| Mallattoo | Socho'aa | Mallattoo | Socho'aa |
|-----------|----------|-----------|----------|
| `=` | jijjiramoo | `$#` | dheerina |
| `:=` | dhaabbataa | `$+` | ida'i (sireeffamuu danda'a) |
| `>>` | baafannaa | `$+[i]` | iccaatti goro (hundee-1) |
| `<<` | seensaa | `$-` | gatii irratti cufaa jalqabaa balleessi |
| `¶` / `\\` | sarara haaraa | `$--` | gatii irratti kanneen hunda balleessi |
| `?` | yoo | `$-[i]` | iccaatti balleessi (hundee-1) |
| `_?` | yoo ta'uu baannaan | `$-[i..j]` | daangaa balleessi (hundee-1) |
| `_` | ta'uu baannaan / wildekaardii | `$?` | qaba |
| `??` | walta'uu | `$??` | iccaawwan hunda barbaadi (hundee-1) |
| `@` | silindarii | `$[s..e]` | caccaba (hundee-1) |
| `@ N { }` | ida'an N yeroo | `$>` | kaarti |
| `@!` | cabs | `$|` | waraaboo |
| `@>` | itti fufi | `$<` | xinneessuu |
| `@:maqaa { }` | silindarii leemaallaan | `$/ shoqee` | sirna caccabu |
| `@:maqaa!` | cabsuu leemaallaan | `$++ a b c` | ijaarsaa ida'amaa |
| `@:maqaa>` | itti fufi leemaallaan | `urushii[i>j>k]` | iccaa daandii |
| `->` | laamdaa | `urushii[i] = gatii` | koree gahumsa (urushoota qofa) |
| `urushii[i] += gatii` | gahumsa makaa | `urushii[i]$~` | gahumsa shaakala (koopiyyii haaraa) |
| `$^+` | galmeessuu ol (qajeelaa) | `$^-` | galmeessuu gad (qajeelaa) |
| `$^` | walmadaaldhaan galmeessuu (tuupilii) | `<~` | deebisuu |
| `|>` | ujummoo | `!?` | yaaluu |
| `:!` | qabuu | `:>` | xumura irratti |
| `#1` | dhugaa | `#0` | soba |
| `$!` | dogoggorsa dha | `$!!` | dogoggorsa babala'uu |
| `<#` | galamsaa | `#>` | baafachuu |
| `#` | moduulii hubachiisuu | `::` | moduulii waamu |
| `.` | ga'umsa dirree | `#?` | metadeetaa gosa |
| `#\|..\|` | lakkoofsa daduu | `##.` | jijjiir Lakkoofsa qaxxaamuraaf |
| `###` | jijjiir Lakkoofsa faffaca'aaf (daangeeffama) | `##!` | jijjiir Lakkoofsa faffaca'aaf (muruu) |
| `#.N\|..\|` | daangeeffama | `#!N\|..\|` | muruu |
| `#,\|..\|` | foormaatii komma | `#^\|..\|` | saayinsii |
| `#d0d9#` | haala lakkoofsaa jijjiir | `#09#` | deebisii ASCII |
| `<\ ..\>` | shelii laachisi | `>\<` | waajjira kophaa |
| `\ var` | jijjiramoo ifatti balleessi | | |

---

---

## Gabatee Jijjiirama Baha Hammaa

### v0.0.4 — Iccaaneessuu Hundee-1, Shaakala Sadarkaa 1ffaa & Kutaa Moduulii _(Elba Fooya 2026)_

- **Cabe** Iccaaneessuun hundi **hundee-1** jijjiirame — `urushii[1]` koree jalqabaa dha; `urushii[0]` dogoggorsa yeroo darbeeti
- **Ida'ame** Shaakalawwan maqaa qaban **gatiiwwan sadarkaa 1ffaa dha** — kallattii lakkoofsota sadarkaa ol'aanaa: `nums$> lama`
- **Ida'ame** **Loojikii kutaa** moduulii barbaachisa — `# maqaa { ... }` — loojikii diriiraa balleeffame
- **Ida'ame** Iccaaneessuu baay'ina qabu: `urushii[i>j>k]` (daandii), `urushii[p ; q]` (diriira baasu)
- **Ida'ame** Gosa jijjiiruu: `##.ibsa` (Lakkoofsa qaxxaamura), `###ibsa` (Lakkoofsa faffaca'aa daangeeffama), `##!ibsa` (Lakkoofsa faffaca'aa muruu)
- **Ida'ame** Sirna caccabu: `sirni$/ shoqee` — deebisa `Array(Sirna)`
- **Ida'ame** Ijaarsaa ida'amaa: `hundee$++ a b c` — koreewwan hedduu ida'a
- **Ida'ame** Ida'an N yeroo silindarii: `@ N { }` — N yeroo suuta deebisi
- **Ida'ame** Loojikii silindarii leemaallaan: `@:maqaa { }`, `@:maqaa!`, `@:maqaa>` — bakka `@ @maqaa` / `@! maqaa` buusa
- **Ida'ame** Seerota daangaa jijjiramoo: jijjiramoon `_maqaa` daangaa kutaa qaba; `\ var` dursee balleessa
- **Ida'ame** Fakkiin walmadaallaa walta'uu: `< 0 :`, `> 5 :`, `== 42 :`, kkf
- **Ida'ame** Dogoggorsa moduulii E013: himannoonni ho'isan qaama moduulii keessatti fafamu
- **Sirreessame** `take_variable` dhaabbattoota moduulii deebi'ee barruuf si'a meetus
- **Sirreessame** `alias.CONST` amma sirriitti furmaata; `#>` shaakala himannaa booda mul'achuu danda'a
- **VM** Walqixxumma guutuu: 393/393 qorannoon darbe

### v0.0.3 — Sirna Lakkoofsaa Unicode & Fooyya'iinsa LSP _(Elba Fooya 2026)_

- **Ida'ame** 69 didal lakkoofsaa Unicode tokeen haala jijjiirsaa `#d0d9#` wajjin
- **Ida'ame** Literaala Buuliyaan barruufi shaashii kamii keessaa — `#१` / `#०`, `#१` / `#०`, kkf
- **Ida'ame** Lakkoofsota Kilingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ida'ame** `SetNumeralMode` opkoodii VM — walqixxumma guutuu tree-walker wajjin
- **Ida'ame** REPL haala lakkoofsaa aktiivii keessatti faallaa fi agarsiisa jijjiramoo keessatti kabaja
- **Jijjiirame** Baafannaa Buuliyaan `>>` amma haala hunda keessatti duraa `#` (`#0` / `#1`) dabala

### v0.0.2_01 — Maqaa Hojiirra ooltoota jijjiiruu _(30 Bitootessa 2026)_

- **Jijjiirame** `c|..|` → `#,|..|` fi `e|..|` → `#^|..|` — walta'ii warra buufashawii foormaatii `#` wajjin
- **Ida'ame** Maqaa waadaa baafachuu: moduulii miseensa maqaa addaatiin deebi'ee baafachuu

### v0.0.2 — API walitti qabaa deebi'uu ijaaruu & Mana mijoo _(24 Bitootessa 2026)_

- **Ida'ame** Warra hojiirra ooltoota `$` waliigala urushootaa fi sirnootaaf (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ida'ame** Rammuu caasaanii babal'isu urushoota, tuupilii, fi tuupili maqaa qabuuf
- **Ida'ame** Iddoo diina (`arr[-1]` = koree xumuraa)
- **Ida'ame** Mana mijoo dhalattuu — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Bitootessa 2026)_

- **Ida'ame** Ramuu makaa `^=`
- **Sirreessame** Koodii daduu herrega casee ciipaa; fooyya'insa asmeentaa

### v0.0.1 — Baha Adda Addummaa Jalqabaa _(22 Bitootessa 2026)_

- Hiikaa tree-walker + VM kaayyeessa (`--vm`, ~4× saffisaa, ~95% walqixxumma)
- Socho'oota iskeelatanii hunda: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Adddayyaa Unicode guutuu, sirna moduulii, laamdaa, cufiinsa, weeyyuu dogoggoraa
- REPL, LSP, Extension VS Code, foormaatii (`zymbol fmt`)

---

_Zymbol-Lang — Mallattoo. Guutuu. Jijjiiramuu Hin Dandeenye._
