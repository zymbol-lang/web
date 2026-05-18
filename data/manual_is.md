> **Fyrirvari:** Þessi skjölun var búin til og þýdd af gervigreind (GI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Handbók

> **Endurskoðað fyrir v0.0.5 — 2026-05-12**

**Zymbol-Lang** er táknmælið forritunarmál. Engin lykilorð — allt er tákn. Virkar eins á hvaða mannlega máli sem er.

- Ekkert `if`, `while`, `return` — aðeins `?`, `@`, `<~`
- Fullt Unicode — auðkenni á hvaða máli eða emoji
- Mannmálshlutlægt — kóðinn er sá sami alls staðar

**Túlkaútgáfa**: v0.0.5 | **Prófunarþekking**: 436/436 (TW ↔ VM jafngildi)

---

## Breytur & Fastar

```zymbol
x = 10              // breytanleg breyta
PI := 3.14159       // fastur — endurúthlutun er keyrsluvilla
nafn = "Alice"
virkur = #1         // boolean satt
👋 := "Halló"
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

`°` (gráðumerki, U+00B0) frumstillir sjálfkrafa breytu að hlutlægu gildi hennar við fyrsta notkun:

```zymbol
tol = [3, 1, 4, 1, 5]
@ n:tol {
    °samtals += n    // sjálffrumstillt á 0 fyrir lykkju; lifir eftir @
}
>> samtals ¶         // → 14
```

> `°x` (forskeyti) festir fyrir ofan lykkju — niðurstaðan er aðgengileg eftir `@`.
> `x°` (viðskeyti) festir inni í lykkju — hverfur þegar lykkjan lýkur.
> Aðeins trégreining.

---

## Gagnagerðir

| Gerð | Bókstafur | `#?`-merki | Athugasemdir |
|------|-----------|------------|--------------|
| Heiltala | `42`, `-7` | `###` | 64-bita með formerki |
| Fleytitala | `3.14`, `1.5e10` | `##.` | Vísindatáknun OK |
| Strengur | `"texti"` | `##"` | Innskot: `"Halló {nafn}"` |
| Stafur | `'A'` | `##'` | Einstakur Unicode-stafur |
| Boole | `#1`, `#0` | `##?` | EKKI tölulegt — `#1 ≠ 1` |
| Fylki | `[1, 2, 3]` | `##]` | Samhæð einingar |
| Túpla | `(a, b)` | `##)` | Staðsetningarleg |
| Nefnd Túpla | `(x: 1, y: 2)` | `##)` | Nefnd svæði |
| Fall | nefnd fallsviðmiðun | `##()` | Fyrsta flokks; birting `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Fyrsta flokks; birting `<lambd/N>` |

```zymbol
// Tegundarskoðun — skilar (tegund, tölustafir, gildi)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Úttak & Inntök

```zymbol
>> "Halló" ¶                      // ¶ eða \\ fyrir beinan nýjan línu
>> "a=" a " b=" b ¶               // hlið við hlið — mörg gildi
>> (fyl$#) ¶                      // viðskeytisaðgerðir krefjast ( ) í >>

<< nafn                           // lesa í breytu (engin kvaðning)
<< "Sláðu inn nafn: " nafn        // með kvaðningu
```

> `¶` (AltGr+R á spænska lyklaborðinu) og `\\` eru jafngildar nýjar línur.

---

## TUI-frumeiningar

Skjástjórnaraðgerðir fyrir gagnvirkni forrit. Flestar krefjast `>>| { }`-blokks (varasskjár + hrár háttur).

```zymbol
>>| {
    >>!                             // hreinsa varasskjá
    >>~ (1, 1, 0, 10) > "Keyrir"   // röð 1, dálkur 1, fg=10 (grænn)
    @~ 1000                         // hlé 1 sekúndu (1000 ms)
    >>~ (2, 1) > "Lokið."
}
// skjárinn er endurreistur sjálfkrafa við lok
```

```zymbol
// Lyklainntak og skjárstærð
>>| {
    [raedir, dalkar] = >>?              // spyrjast fyrir um skjárstærð
    >>~ (1, 1) > "Skjár: " raedir " x " dalkar
    <<| lykill                          // lokkandi lyklainntak
    >>~ (2, 1) > "Ýtt: " lykill
}
```

> `>>!` hreinsaður skjár. `>>?` skilar `[raedir, dalkar]`. `@~ N` sefur N millisekúndur.
> `<<|` les einn lykil (lokkandi); `<<|?` kannar án lokunar (skilar `'\0'` ef enginn).
> Staðsetningartúpla: `(röð, dálkur, BKS, fg, bg)` — hvaða rauf sem er má sleppa með kommu (`>>~ (,,, 196) > "rauður"`).
> BKS-bitmaska: `1`=Feitletrað, `2`=Skáletrað, `4`=Undirstrikað. ANSI 256-lita litapaletta (`0`=sjálfgefinn skjár).
> Aðeins trégreining (nema `>>!`, `>>?`, `@~`, `>>~` sem keyra einnig í `--vm`).

---

## Aðgerðir

```zymbol
// Reikningur
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (heiltöludeiling)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (veldi)

// Samanburður — úthluta til að skoða
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Rökfræðilegar
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Strengir

```zymbol
// Tvær samskeytistegundir
nafn = "Alice"
n = 42

>> "Halló " nafn " þú átt " n ¶       // hlið við hlið — í >>
lysing = "Halló {nafn}, þú átt {n}"   // innskot — hvar sem er
```

```zymbol
s = "Halló Heimur"
len = s$#                  // 12
hluti = s$[1..5]           // "Halló"  (1-byggt, lok innifalið)
er = s$? "Heimur"          // #1
hlutar = "a,b,c,d"$/ ','   // [a, b, c, d]  (skipt eftir skiltákni)
skpt = s$~~["l":"L"]       // "HaLLó HeimuR"  (skipt út)
skpt1 = s$~~["l":"L":1]    // "HaLló Heimur"  (fyrstu N)
lina = "─" $* 20           // "────────────────────"  (endurtaka N sinnum)
```

> `+` er aðeins fyrir tölur. Notaðu `,`, hlið við hlið eða innskot fyrir strengi.

---

## Stýriflæði

```zymbol
x = 7

? x > 0 { >> "jákvætt" ¶ }

? x > 100 {
    >> "stórt" ¶
} _? x > 0 {
    >> "jákvætt" ¶
} _? x == 0 {
    >> "núll" ¶
} _ {
    >> "neikvætt" ¶
}
```

> `{ }`-svigarnir eru **nauðsynlegir** jafnvel fyrir einnar setningar.

---

## Mynstursamsvörun

```zymbol
// Bil
stig = 85
einkunn = ?? stig {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> einkunn ¶    // → B

// Strengir
litur = "raudur"
kodi = ?? litur {
    "raudur"  => "#FF0000"
    "graenn"  => "#00FF00"
    _         => "#000000"
}

// Samanburðarmynstur
hiti = -5
astand = ?? hiti {
    < 0  => "ís"
    < 20 => "kalt"
    < 35 => "hlýtt"
    _    => "heitt"
}
>> astand ¶    // → ís

// Setningarform (blokkhandleggir)
n = -3
?? n {
    0    => { >> "núll" ¶ }
    < 0  => { >> "neikvætt" ¶ }
    _    => { >> "jákvætt" ¶ }
}
```

---

## Lykkjur

```zymbol
@ i:0..4  { >> i " " }        // bil með innifalið lok:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // með skrefi:             1 3 5 7 9
@ i:5..0:1 { >> i " " }       // öfugt:                  5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (meðan)

avextir = ["epli", "pera", "vínber"]
@ f:avextir { >> f ¶ }        // fyrir hvert fylki

@ s:"halló" { >> s "-" }
>> ¶                          // → h-a-l-l-ó-  (fyrir hvern streng)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> halda áfram
    ? i > 7 { @! }             // @! hætta
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Óendanleg lykkja
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Merkt lykkja (hreiður brot)
teljari = 0
@:ytri {
    teljari++
    ? teljari >= 3 { @:ytri! }
}
>> teljari ¶                   // → 3
```

---

## Föll

```zymbol
leggja_saman(a, b) { <~ a + b }
>> leggja_saman(3, 4) ¶    // → 7

hrotur(n) {
    ? n <= 1 { <~ 1 }
    <~ n * hrotur(n - 1)
}
>> hrotur(5) ¶    // → 120
```

Föll hafa **einangrað umfang** — þau geta ekki lesið ytri breytur. Notaðu úttaksbreytur `<~` til að breyta kallarbreytum:

```zymbol
skipta(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
skipta(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nefnd föll eru **fyrsta flokks gildi** — sendu beint: `tol$> tvofaldur`. Til að pakka inn: `x -> fn(x)` er einnig gilt.

---

## Lambda & Lokun

```zymbol
tvofaldur = x -> x * 2
summa = (a, b) -> a + b
>> tvofaldur(5) ¶    // → 10
>> summa(3, 7) ¶    // → 10

// Blokkur lambda
flokka = x -> {
    ? x > 0 { <~ "jákvætt" }
    _? x < 0 { <~ "neikvætt" }
    <~ "núll"
}

// Lokun — fangar ytra umfang
stuðull = 3
þrefaldur = x -> x * stuðull
>> þrefaldur(7) ¶    // → 21

// Verksmiðja
búa_til_leggjara(n) { <~ x -> x + n }
leggja10_við = búa_til_leggjara(10)
>> leggja10_við(5) ¶    // → 15

// Í fylkjum
aðgerðir = [x -> x+1, x -> x*2, x -> x*x]
>> aðgerðir[3](5) ¶    // → 25
```

---

## Fylki

Fylki eru **breytanleg** og geyma einingar af **sömu gerð**.

```zymbol
fyl = [1, 2, 3, 4, 5]

x = fyl[1]      // 1 — aðgangur (1-byggt: fyrsta eining)
x = fyl[-1]     // 5 — neikvæður vísir (síðasta eining)
x = fyl$#       // 5 — lengd (notaðu (fyl$#) í >>)

fyl = fyl$+ 6            // bæta við → [1,2,3,4,5,6]
fyl2 = fyl$+[2] 99       // setja inn á stöðu 2 (1-byggt)
fyl3 = fyl$- 3           // fjarlægja fyrstu tilvik gildis
fyl4 = fyl$-- 3          // fjarlægja öll tilvik
fyl5 = fyl$-[1]          // fjarlægja við vísir 1 (fyrsta eining)
fyl6 = fyl$-[2..3]       // fjarlægja bil (1-byggt, lok innifalið)

er = fyl$? 3             // #1 — inniheldur
sta = fyl$?? 3           // [3] — allir vísar gildis (1-byggt)
sni = fyl$[1..3]         // [1,2,3] — sneiðing (1-byggt, lok innifalið)
sni2 = fyl$[1:3]         // [1,2,3] — sama, tolubyggt setningafræði

hækkandi = fyl$^+        // raðað hækkandi  (aðeins frumtög)
lækkandi = fyl$^-        // raðað lækkandi  (aðeins frumtög)

// Nefnd/staðsetningartúpla-fylki — notaðu $^ með samanburðarlambda
gagnasafn = [(nafn: "Carla", aldur: 28), (nafn: "Ana", aldur: 25), (nafn: "Bob", aldur: 30)]
eftir_aldri = gagnasafn$^ (a, b -> a.aldur < b.aldur)    // hækkandi eftir aldri  (<)
eftir_nafni = gagnasafn$^ (a, b -> a.nafn > b.nafn)      // lækkandi eftir nafni (>)
>> eftir_aldri[1].nafn ¶     // → Ana
>> eftir_nafni[1].nafn ¶     // → Carla

// Beint einingauppfærsla (aðeins fylki)
fyl[1] = 99              // úthluta
fyl[2] += 5              // samansett: +=  -=  *=  /=  %=  ^=

// Fálaglegt uppfærsla — skilar nýju fylki; upprunalegt óbreytt
fyl2 = fyl[2]$~ 99
```

> Allar safnaðgerðir skila **nýju fylki**. Úthluta til baka: `fyl = fyl$+ 4`.
> `$+` er hægt að keðja: `fyl = fyl$+ 5$+ 6$+ 7`. Aðrar aðgerðir nota millistig úthlutun.
> **Vísun er 1-byggt**: `fyl[1]` er fyrsta eining; `fyl[0]` er keyrsluvilla.
> `$^+` / `$^-` raðar **frumtög fylki** (tölur, strengir). Fyrir túpla-fylki notaðu `$^` með samanburðarlambda — stefna er kóðuð í lambda (`<` = hækkandi, `>` = lækkandi).

**Gildismerking** — úthlutun fylkis til annarrar breytu býr til sjálfstæða afrit:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er ósnortið
```

```zymbol
// Hreiður fylki (1-byggt vísun)
fylki = [[1,2,3],[4,5,6],[7,8,9]]
>> fylki[2][3] ¶    // → 6  (röð 2, dálkur 3)
```

---

## Niðurbrot

```zymbol
// Fylki
fyl = [10, 20, 30, 40, 50]
[a, b, c] = fyl              // a=10  b=20  c=30
[fyrsta, *rest] = fyl        // fyrsta=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ fleygir

// Staðsetningartúpla
punktur = (100, 200)
(px, py) = punktur           // px=100  py=200

// Nefnd túpla
manneskja = (nafn: "Ana", aldur: 25, borg: "Madrid")
(nafn: n, aldur: a) = manneskja   // n="Ana"  a=25
```

---

## Túplur

Túplur eru **óbreytanlegar** raðaðar gámar sem geta geymt gildi af **mismunandi gerðum**.
Ólíkt fylkjum er ekki hægt að breyta einingum eftir stofnun.

```zymbol
// Staðsetningarleg — blandaðar gerðir leyfðar
punktur = (10, 20)
>> punktur[1] ¶    // → 10

gögn = (42, "halló", #1, 3.14)
>> gögn[3] ¶     // → #1

// Nefnd
manneskja = (nafn: "Alice", aldur: 25)
>> manneskja.nafn ¶    // → Alice
>> manneskja[1] ¶      // → Alice  (vísir virkar einnig, 1-byggt)

// Hreiður
sta = (x: 10, y: 20)
p = (sta: sta, merki: "uppruni")
>> p.sta.x ¶        // → 10
```

**Óbreytanleiki** — sérhver tilraun til að breyta túplu-einingu er keyrsluvilla:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ keyrsluvilla: túplur eru óbreytanlegar
// t[1] += 5    // ❌ sama villa
```

Til að fá breikið gildi notaðu `$~` (fálaglegt uppfærsla) — skilar **nýrri** túplu:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← upprunalegt óbreytt
>> t2 ¶    // → (10, 999, 30)

// Nefnd túpla — endursmíða sérstaklega
manneskja = (nafn: "Alice", aldur: 25)
eldri = (nafn: manneskja.nafn, aldur: 26)
>> manneskja.aldur ¶    // → 25
>> eldri.aldur ¶        // → 26
```

---

## Hærra Stig Föll

```zymbol
tol = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tvofaldað = tol$> (x -> x * 2)                // map  → [2,4,6…20]
jafntol   = tol$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
samtals   = tol$< (0, (acc, x) -> acc + x)     // reduce → 55

// Keðja í gegnum milliliði
skref1 = tol$| (x -> x > 3)
skref2 = skref1$> (x -> x * x)
>> skref2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nefnd föll má senda beint til HSF
tvofaldur(x) { <~ x * 2 }
er_stort(x) { <~ x > 5 }
r = tol$> tvofaldur    // ✅ bein viðmiðun
r = tol$| er_stort     // ✅ bein viðmiðun
```

---

## Pípu-aðgerð

Hægri hlið krefst alltaf `_` sem staðgengill fyrir pípaða gildið:

```zymbol
tvofaldur = x -> x * 2
leggja_saman = (a, b) -> a + b
hækka = x -> x + 1

r1 = 5 |> tvofaldur(_)          // → 10
r2 = 10 |> leggja_saman(_, 5)   // → 15
r3 = 5 |> leggja_saman(2, _)    // → 7

// Keðjað
r = 5 |> tvofaldur(_) |> hækka(_) |> tvofaldur(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Villunhöndlun

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deiling með núll" ¶
} :! {
    >> "önnur villa: " _err ¶    // _err geymir villuskilaboðin
} :> {
    >> "keyrir alltaf" ¶
}
```

| Gerð | Hvenær |
|------|--------|
| `##Div` | Deiling með núll |
| `##IO` | Skrá / kerfi |
| `##Index` | Vísir utan marka |
| `##Type` | Tegundarmismunur |
| `##Parse` | Gagnaþátttaka |
| `##Network` | Netvillar |
| `##_` | Hvaða villa sem er (heildarfang) |

---

## Einingar

```zymbol
// lib/reikn.zy — einingarlíkami er í svigum
# reikn {
    #> { leggja_saman, faá_PI }

    _PI := 3.14159
    leggja_saman(a, b) { <~ a + b }
    faá_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/reikn => r    // gælunafn nauðsynlegt

>> r::leggja_saman(5, 3) ¶     // → 8
pi = r::faá_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Flytja út með öðru opinberu nafni
# mittbibliotek {
    #> { _innri_leggja_saman => summa }

    _innri_leggja_saman(a, b) { <~ a + b }
}
```

```zymbol
<# ./mittbibliotek => m

>> m::summa(3, 4) ¶    // → 7  (innra nafnið _innri_leggja_saman er falið)
```

> **Einingareglur**: aðeins `#>`, fallsskilgreiningar og bókstafslegar breytu-/fastafyrirmyndir eru leyfðar í `# nafn { }`. Keyrslulegar setningar (`>>`, `<<`, lykkjur, o.s.frv.) valda villu E013.

---

## Talnasniðir

Zymbol getur sýnt tölur í **69 Unicode-tölustafaskriftum** — Devanagari, arabísk-indísk, thai, Klingon pIqaD, stæðileg feitletrað, LCD-bitar og fleiri. Virkt snið hefur aðeins áhrif á `>>`-úttak; innri reikningur er alltaf tvíundur.

### Virkjun skriftar

Skrifaðu `0`- og `9`-tölustafinn í markkriftinni í `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabísk-indísk (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // endurstilla á ASCII
```

### Úttak og bool-gildi

```zymbol
x = 42
>> x ¶          // → 42   (ASCII sjálfgefið)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (tugabrot alltaf ASCII)
>> 1 + 2 ¶      // → ३

// Bool-gildi: #-forskeyti alltaf ASCII, tölustafur aðlagast
>> #1 ¶         // → #१   (satt í Devanagari)
>> #0 ¶         // → #०   (ósatt — aðskilið frá ०  heiltöla-núll)

x = 28 > 4
>> x ¶          // → #१   (samanburðarniðurstaða fylgir virku sniði)
```

### Innfæddar tölustafabókstafir í uppsprettu

Tölustafir hvaða studda skriftar sem er eru gild bókstafir — í bilum, módúl, samanburðum:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Bool-bókstafir í hvaða skrift sem er

`#` + tölustafur `0` eða `1` frá hvaða blokki sem er er gilt bool-bókstafur:

```zymbol
#٠٩#
virkur = #١        // sama og #1
>> virkur ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` er **alltaf ASCII**. `#0` (ósatt) er alltaf sjónrænt aðskilið frá `0` (heiltöla-núll) í hvaða skrift sem er.

---

## Gagnavirkar

```zymbol
// Tegundarumvörpunarcast
f = ##.42         // → 42.0  (til Fleytitala)
i = ###3.7        // → 4     (til Heiltala, slétta)
t = ##!3.7        // → 3     (til Heiltala, stinga af)

// Þátttaka strengs í tölu
v1 = #|"42"|      // → 42  (Heiltala)
v2 = #|"3.14"|    // → 3.14  (Fleytitala)
v3 = #|"abc"|     // → "abc"  (öruggt við mishap, engin villa)

// Slétting / skerðing
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (slétta í 2 aukastafa)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (skerðing)

// Talasnið
fmt = #,|1234567|  // → 1,234,567  (kommuaðskilið)
sci = #^|12345.678|    // → 1.2345678e4  (vísindalegt)

// Grunnbókstafir
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (tvíundar)
c = 0o101        // → 'A'  (áttundarkerfi)

// Grunnumvörpunarúttak
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell-samþætting

```zymbol
dagsetning = <\ date +%Y-%m-%d \>     // fangar stdout (inniheldur aftan \n)
>> "Í dag: " dagsetning

skra = "gögn.txt"
innihald = <\ cat {skra} \>      // innskot í skipunum

uttak = </"./undirforrit.zy"/>   // keyra annað Zymbol-forrit, fanga úttak
>> uttak
```

> `><` fangar CLI-rök sem strengjafylki (aðeins trégreining).

---

## Heildardæmi: FizzBuzz

```zymbol
flokka(tala) {
    ? tala % 15 == 0 { <~ "FizzBuzz" }
    _? tala % 3  == 0 { <~ "Fizz" }
    _? tala % 5  == 0 { <~ "Buzz" }
    _ { <~ tala }
}

@ i:1..20 { >> flokka(i) ¶ }
```

---

## Táknviðmiðun

| Tákn | Aðgerð | Tákn | Aðgerð |
|------|--------|------|--------|
| `=` | breyta | `$#` | lengd |
| `:=` | fastur | `$+` | bæta við (keðjanleg) |
| `>>` | úttak | `$+[i]` | setja inn við vísir (1-byggt) |
| `<<` | inntök | `$-` | fjarlægja fyrsta eftir gildi |
| `¶` / `\\` | nýr lína | `$--` | fjarlægja öll eftir gildi |
| `?` | ef | `$-[i]` | fjarlægja við vísir (1-byggt) |
| `_?` | annars-ef | `$-[i..j]` | fjarlægja bil (1-byggt) |
| `_` | annars / wildcard | `$?` | inniheldur |
| `??` | mynstursamsvörun | `$??` | finna alla vísa (1-byggt) |
| `@` | lykkja | `$[s..e]` | sneiðing (1-byggt) |
| `@ N { }` | N-sinnum lykkja | `$>` | map |
| `@!` | hætta | `$\|` | filter |
| `@>` | halda áfram | `$<` | reduce |
| `@:nafn { }` | merkt lykkja | `$/ delim` | strengjaskipting |
| `@:nafn!` | hætta merki | `$++ a b c` | samskeytisbygging |
| `@:nafn>` | halda áfram merki | `fyl[i>j>k]` | leiðsöguvísir |
| `->` | lambda | `fyl[i] = val` | uppfæra einingu (aðeins fylki) |
| `fyl[i] += val` | samansett uppfærsla | `fyl[i]$~` | fálaglegt uppfærsla (ný afrit) |
| `$^+` | raða hækkandi (frumtög) | `$^-` | raða lækkandi (frumtög) |
| `$^` | raða með samanburðar (túplur) | `<~` | skila |
| `\|>` | pípa | `!?` | reyna |
| `:!` | fanga | `:>` | að lokum |
| `#1` | satt | `#0` | ósatt |
| `$!` | er villa | `$!!` | breiða villu |
| `<#` | flytja inn | `#>` | flytja út |
| `#` | lýsa einingu | `::` | eininguarkall |
| `.` | svæðisaðgangur | `#?` | tegundarupplýsingar |
| `#\|..\|` | þáttaka tölu | `##.` | cast til Fleytitala |
| `###` | cast til Heiltala (slétta) | `##!` | cast til Heiltala (skerða) |
| `#.N\|..\|` | slétta | `#!N\|..\|` | skerða |
| `#,\|..\|` | kommusnið | `#^\|..\|` | vísindalegt |
| `#d0d9#` | talnasniðsskipti | `#09#` | endurstilla á ASCII |
| `<\ ..\>` | shell-keyrsla | `>\<` | CLI-rök |
| `\ var` | sérstaklega eyða breytu | `°x` / `x°` | heit skilgreining (sjálffrumstilling) |
| `>>|` | TUI-blokkur (varasskjár) | `>>~` | staðsett úttak |
| `>>!` | hreinsa skjá | `>>?` | spyrjast fyrir um skjárstærð |
| `<<\|` | lokkandi lyklainntak | `<<\|?` | ólokkandi lyklainntak |
| `@~ N` | sofa N millisekúndur | `$*` | endurtaka streng N sinnum |

---

## Útgáfubreytingaskrá

### v0.0.5 — TUI-frumeiningar, Heit Skilgreining & Strengjaendurtekning _(Maí 2026)_

- **Þróttabrestandi** Mynsturarm-skiltákn: `mynstur : niðurstaða` → `mynstur => niðurstaða`
- **Þróttabrestandi** Innflutningsgælunafn: `<# slóð <= gælunafn` → `<# slóð => gælunafn`
- **Þróttabrestandi** Útflutningsendurnefning: `#> { fn <= pub }` → `#> { fn => pub }`
- **Bætt** TUI-blokkur `>>| { }` — varasskjár + hrár háttur; hreinsaður við lok
- **Bætt** Staðsett úttak `>>~ (röð, dál, BKS, fg, bg) > einingar` — dreifðar raufar, ANSI 256-litir
- **Bætt** Lykilinntak `<<| var` (lokkandi) og `<<|? var` (ólokkandi könnun)
- **Bætt** `>>!` hreinsa skjá, `>>?` spyrjast fyrir um skjárstærð, `@~ N` sofa N millisekúndur
- **Bætt** Heit skilgreining `°x` / `x°` — sjálffrumstilla breytu við fyrsta notkun í lykkjum
- **Bætt** Strengjaendurtekning `str $* N` — endurtaka streng N sinnum
- **VM** Jafngildi: 436/436 próf standast

### v0.0.4 — 1-Byggt Vísun, Fyrsta Flokks Föll & Eininguarblokkar _(Apríl 2026)_

- **Þróttabrestandi** Öll vísun skipt yfir í **1-byggt** — `fyl[1]` er fyrsta eining; `fyl[0]` er keyrsluvilla
- **Bætt** Nefnd föll eru **fyrsta flokks gildi** — sendu beint til HSF: `tol$> tvofaldur`
- **Bætt** Einingar-**blokkasetningafræði** nauðsynlegt: `# nafn { ... }` — flöt setningafræði fjarlægð
- **Bætt** Fjöl-víddarvísun: `fyl[i>j>k]` (leiðsögn), `fyl[p ; q]` (flöt útdráttur)
- **Bætt** Tegundarumvörpunarcast: `##.expr` (Fleytitala), `###expr` (Heiltala slétta), `##!expr` (Heiltala skerðing)
- **Bætt** Strengjaskipting: `str$/ delim` — skilar `Fylki(Strengur)`
- **Bætt** Samskeytisbygging: `grunnur$++ a b c` — bætir við mörgum einingum
- **Bætt** N-sinnum lykkja: `@ N { }` — endurtaka nákvæmlega N sinnum
- **Bætt** Merkt lykkjasetningafræði: `@:nafn { }`, `@:nafn!`, `@:nafn>` — kemur í stað `@ @nafn` / `@! nafn`
- **Bætt** Breytuumfangsreglur: `_nafn`-breytur hafa nákvæmt blokkumfang; `\ var` eyðir snemma
- **Bætt** Mynstursamsvörun samanburðarmynstrum: `< 0 :`, `> 5 :`, `== 42 :` o.s.frv.
- **Bætt** Einings E013-villa: keyrslulegar setningar í eininguarlíkama eru bannaðar
- **Leiðrétt** `take_variable` spillir ekki lengur einingafastum við afritun
- **Leiðrétt** `alias.CONST` leysist nú rétt; `#>` má birtast eftir fallsskilgreiningar
- **VM** Fullt jafngildi: 393/393 próf standast

### v0.0.3 — Unicode Talnasniðir & LSP-umbætur _(Apríl 2026)_

- **Bætt** 69 Unicode-tölustafablokkir með sniðsskiptatókna `#d0d9#`
- **Bætt** Bool-bókstafir í hvaða skrift sem er — `#१` / `#०`, `#١` / `#٠`, o.s.frv.
- **Bætt** Klingon pIqaD-tölustafir (CSUR PUA U+F8F0–U+F8F9)
- **Bætt** `SetNumeralMode` VM-opkóð — fullt jafngildi með trégreiningu
- **Bætt** REPL virðir virkt talnunarsnið í bergmáli og breytubirting
- **Breytt** Bool-`>>`-úttak inniheldur nú `#`-forskeyti (`#0` / `#1`) í öllum sniðum

### v0.0.2_01 — Aðgerðarendurnefning _(30 Mar 2026)_

- **Breytt** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — samræmt við `#`-snið-forskeyti-fjölskyldu
- **Bætt** Útflutningsgælunafn: endurflytja eininguarmeðlimi undir öðru nafni

### v0.0.2 — Safna-API-endurskipulagning & Uppsetningarforrit _(24 Mar 2026)_

- **Bætt** Sameinuð `$`-aðgerðarfjölskylda fyrir fylki og strengi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bætt** Niðurbrotsúthlutuning fyrir fylki, túplur og nefndar túplur
- **Bætt** Neikvæðir vísar (`fyl[-1]` = síðasta eining)
- **Bætt** Innfædd uppsetningarforrit — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Bætt** Samansett úthlutun `^=`
- **Leiðrétt** Þáttari-reiknings-jaðartilvik; skjölunarleiðréttingar

### v0.0.1 — Fyrsta Opinber Útgáfa _(22 Mar 2026)_

- Trégreiningu-túlkur + skrárVM (`--vm`, ~4× hraðari, ~95% jafngildi)
- Öll kjarnaskipulag: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fullt Unicode-auðkenni, einingakerfi, lambdas, lokanir, villunhöndlun
- REPL, LSP, VS Code-viðbót, snið (`zymbol fmt`)

---

_Zymbol-Lang — Táknlegt. Altækt. Óbreytanlegt._
