> **Fyrirvari:** Þessi skjölun var búin til og þýdd af gervigreind (GG).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> Upprunaleg tilvísun er **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** í túlkageymslu.

---

# Zymbol-Lang Handbók

**Zymbol-Lang** er táknrænt forritunarmál. Engin lykilorð — allt er tákn. Virkar eins í öllum mannlegum tungumálum.

- Engin `if`, `while`, `return` — aðeins `?`, `@`, `<~`
- Fullur Unicode — auðkenni á hvaða tungumáli sem er eða emoji
- Tungumálahlutlægt — kóðinn er sá sami alls staðar

**Túlkaútgáfa**: v0.0.4 | **Prófunarhlutfall**: 393/393 (TW ↔ VM jafngildi)

---

## Breytur og fastar

```zymbol
x = 10              // breytanleg breyta
PI := 3.14159       // fasti — endurúthlutun er keyrslutímavilla
nafn = "Alice"
virkt = #1          // boolean satt
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

---

## Gagnategundir

| Tegund | Bókstafsgildi | `#?`-merki | Athugasemdir |
|--------|--------------|------------|--------------|
| Heiltala | `42`, `-7` | `###` | 64-bita með formerki |
| Kommutala | `3.14`, `1.5e10` | `##.` | Vísindaleg táknun OK |
| Strengur | `"texti"` | `##"` | Breytuinnsetning: `"Halló {nafn}"` |
| Stafur | `'A'` | `##'` | Einn Unicode-stafur |
| Boolean | `#1`, `#0` | `##?` | EKKI tölulegt — `#1 ≠ 1` |
| Fylki | `[1, 2, 3]` | `##]` | Einslæg stök |
| Túpla | `(a, b)` | `##)` | Staðsetningabundið |
| Nefnd túpla | `(x: 1, y: 2)` | `##)` | Nefnd svæði |
| Fall | nefnd fallstilvísun | `##()` | Fyrsta flokks; sýnir `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Fyrsta flokks; sýnir `<lambd/N>` |

```zymbol
// Tegundarrannsókn — skilar (tegund, tölustafir, gildi)
lýsigögn = 42#?
>> lýsigögn ¶         // → (###, 2, 42)
t = lýsigögn[1]
>> t ¶            // → ###
```

---

## Úttak og inntak

```zymbol
>> "Halló" ¶                      // ¶ eða \\ fyrir beinlínan línuskil
>> "a=" a " b=" b ¶               // hlið við hlið — mörg gildi
>> (arr$#) ¶                      // viðskeytisvirkjar krefjast ( ) í >>

<< nafn                           // lesa inn í breytu (engin áskorun)
<< "Sláðu inn nafn: " nafn        // með áskorun
```

> `¶` (AltGr+R á spænskum lyklaborði) og `\\` eru jafngildar línuskilamerkingar.

---

## Virkjar

```zymbol
// Reikningur — notaðu úthlutanir; sumir virkjar hafa sérstöðu beint í >>
a = 10
b = 3
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (heiltöludeiling)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (veldi)

// Samanburður
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b     // #1

// Rökfræðilegt
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Strengir

```zymbol
// Tvær samskeytigarðir
nafn = "Alice"
n = 42

>> "Halló " nafn " þú átt " n ¶    // hlið við hlið — í >>
lýs = "Halló {nafn}, þú átt {n}"   // breytuinnsetning — hvar sem er
```

```zymbol
s = "Halló heimur"
len = s$#                  // 12
sub = s$[1..5]             // "Halló"  (1-byggt, lok innifalið)
er = s$? "heimur"          // #1
hlutar = "a,b,c,d"$/ ','  // [a, b, c, d]  (skipta við afmörkun)
skipt = s$~~["l":"L"]         // "HaLLó heimur"
skipt1 = s$~~["l":"L":1]      // "HaLló heimur"  (aðeins fyrstu N)
```

> `+` er aðeins fyrir tölur. Notaðu `,`, hlið við hlið eða breytuinnsetning fyrir strengi.

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

> `{ }` slaufusvigar eru **nauðsynlegir** jafnvel fyrir eina setningu.

---

## Match

```zymbol
// Bil
skor = 85
einkunn = ?? skor {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> einkunn ¶    // → B

// Strengir
litur = "rauður"
kóði = ?? litur {
    "rauður"  : "#FF0000"
    "grænn"   : "#00FF00"
    _         : "#000000"
}

// Samanburðarmynstur
hiti = -5
ástand = ?? hiti {
    < 0  : "ís"
    < 20 : "kalt"
    < 35 : "hlýtt"
    _    : "heitt"
}
>> ástand ¶    // → ís

// Setningarform (blokkhandleggir)
?? n {
    0       : { >> "núll" ¶ }
    _? n < 0: { >> "neikvætt" ¶ }
    _       : { >> "jákvætt" ¶ }
}
```

---

## Lykkjur

```zymbol
@ i:0..4  { >> i " " }        // bil innifalið:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // með skrefi:     1 3 5 7 9
@ i:5..0:1 { >> i " " }       // öfugt:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (meðan)

ávextir = ["epli", "pera", "vínber"]
@ f:ávextir { >> f ¶ }        // fyrir hvert fylki

@ s:"hæ" { >> s "-" }
>> ¶                          // → h-æ-  (fyrir hvern streng)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> halda áfram
    ? i > 7 { @! }             // @! brjóta
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

// Merktar lykkjur (földuð rof)
fjöldi = 0
@:ytri {
    fjöldi++
    ? fjöldi >= 3 { @:ytri! }
}
>> fjöldi ¶                    // → 3
```

---

## Föll

```zymbol
leggja_saman(a, b) { <~ a + b }
>> leggja_saman(3, 4) ¶    // → 7

þáttun(n) {
    ? n <= 1 { <~ 1 }
    <~ n * þáttun(n - 1)
}
>> þáttun(5) ¶    // → 120
```

Föll hafa **einangrað umfang** — þau geta ekki lesið ytri breytur. Notaðu úttaksbreytur `<~` til að breyta köllunarbreytum:

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

> Nefnd föll eru **fyrsta flokks gildi** — sendu beint: `tölur$> tvöfalda`. Til að pakka inn er `x -> fn(x)` einnig gilt.

---

## Lambda og lokun

```zymbol
tvöfalda = x -> x * 2
summa = (a, b) -> a + b
>> tvöfalda(5) ¶    // → 10
>> summa(3, 7) ¶    // → 10

// Blokk-lambda
flokka = x -> {
    ? x > 0 { <~ "jákvætt" }
    _? x < 0 { <~ "neikvætt" }
    <~ "núll"
}

// Lokun — fangar ytri umfang
þáttur = 3
þrefalda = x -> x * þáttur
>> þrefalda(7) ¶    // → 21

// Verksmiðja
búa_til_adder(n) { <~ x -> x + n }
bæta10 = búa_til_adder(10)
>> bæta10(5) ¶    // → 15

// Í fylkjum
aðgerðir = [x -> x+1, x -> x*2, x -> x*x]
>> aðgerðir[3](5) ¶    // → 25
```

---

## Fylki

Fylki eru **breytanleg** og geyma stök af **sömu tegund**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — aðgangur (1-byggt: fyrsta stak)
arr[-1]         // 5 — neikvæður vísir (síðasta stak)
arr$#           // 5 — lengd (notaðu (arr$#) í >>)

arr = arr$+ 6            // bæta við → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // setja inn á stöðu 2 (1-byggt)
arr3 = arr$- 3           // fjarlægja fyrstu tilvik gildis
arr4 = arr$-- 3          // fjarlægja öll tilvik
arr5 = arr$-[1]          // fjarlægja á vísi 1 (fyrsta stak)
arr6 = arr$-[2..3]       // fjarlægja bil (1-byggt, lok innifalið)

er = arr$? 3            // #1 — inniheldur
sta = arr$?? 3           // [3] — allir vísar gildis (1-byggt)
sneiðing = arr$[1..3]   // [1,2,3] — sneiðing (1-byggt, lok innifalið)
sneiðing2 = arr$[1:3]   // [1,2,3] — sama, fjöldi-byggt setningafræði

hækkandi = arr$^+        // raðað hækkandi  (aðeins frumstæð)
lækkandi = arr$^-        // raðað lækkandi (aðeins frumstæð)

// Nefnd/staðsetningabundin túplufylki — notaðu $^ með samanburðarlambda
gagnasafn = [(nafn: "Carla", aldur: 28), (nafn: "Ana", aldur: 25), (nafn: "Bob", aldur: 30)]
eftir_aldri = gagnasafn$^ (a, b -> a.aldur < b.aldur)    // hækkandi eftir aldri  (<)
eftir_nafni = gagnasafn$^ (a, b -> a.nafn > b.nafn)      // lækkandi eftir nafni (>)
>> eftir_aldri[1].nafn ¶     // → Ana
>> eftir_nafni[1].nafn ¶     // → Carla

// Beint stakuppfærsla (aðeins fylki)
arr[1] = 99              // úthluta
arr[2] += 5              // samsett: +=  -=  *=  /=  %=  ^=

// Virkniuppfærsla — skilar nýju fylki; upprunalegt óbreytt
arr2 = arr[2]$~ 99
```

> Allir safnvirkjar skila **nýju fylki**. Úthlutaðu aftur: `arr = arr$+ 4`.
> `$+` má keðja: `arr = arr$+ 5$+ 6$+ 7`. Aðrir virkjar nota milliúthlutanir.
> **Vísun er 1-byggð**: `arr[1]` er fyrsta stakið; `arr[0]` er keyrslutímavilla.
> `$^+` / `$^-` raðar **frumstæðum fylkjum** (tölur, strengir). Fyrir túplufylki notaðu `$^` með samanburðarlambda — stefna er kóðuð í lambda (`<` = hækkandi, `>` = lækkandi).

**Gildisfræði** — að úthluta fylki til annarrar breytu skapar óháða afrit:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b er óáhrifað
```

```zymbol
// Földuð fylki (1-byggð vísun)
fylki = [[1,2,3],[4,5,6],[7,8,9]]
>> fylki[2][3] ¶    // → 6  (röð 2, dálkur 3)
```

---

## Niðurskipting

```zymbol
// Fylki
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[fyrsta, *afgangur] = arr    // fyrsta=10  afgangur=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ fleygir

// Staðsetningabundin túpla
punkt = (100, 200)
(px, py) = punkt             // px=100  py=200

// Nefnd túpla
einstaklingur = (nafn: "Ana", aldur: 25, borg: "Madrid")
(nafn: n, aldur: a) = einstaklingur   // n="Ana"  a=25
```

---

## Túplur

Túplur eru **óbreytanlegar** raðaðar gámar sem geta geymt gildi af **mismunandi tegundum**.
Ólíkt fylkjum er ekki hægt að breyta stökum eftir stofnun.

```zymbol
// Staðsetningabundin — blönduðar tegundir leyfðar
punkt = (10, 20)
>> punkt[1] ¶    // → 10

gögn = (42, "halló", #1, 3.14)
>> gögn[3] ¶     // → #1

// Nefnd
einstaklingur = (nafn: "Alice", aldur: 25)
>> einstaklingur.nafn ¶    // → Alice
>> einstaklingur[1] ¶      // → Alice  (vísir virkar einnig, 1-byggður)

// Faldar
sta = (x: 10, y: 20)
p = (sta: sta, merki: "uppruni")
>> p.sta.x ¶        // → 10
```

**Óbreytanleiki** — sérhvert tilraun til að breyta túplustaki er keyrslutímavilla:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ keyrslutímavilla: túplur eru óbreytanlegar
// t[1] += 5    // ❌ sama villa
```

Til að fá breytt gildi notaðu `$~` (virkniuppfærsla) — skilar **nýrri** túplu:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← upprunalegt óbreytt
>> t2 ¶    // → (10, 999, 30)

// Nefnd túpla — endurbyggja beinlínis
einstaklingur = (nafn: "Alice", aldur: 25)
eldri  = (nafn: einstaklingur.nafn, aldur: 26)
>> einstaklingur.aldur ¶    // → 25
>> eldri.aldur ¶     // → 26
```

---

## Hærra stigs föll

```zymbol
tölur = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

tvöfaldað  = tölur$> (x -> x * 2)                // map  → [2,4,6…20]
sléttartölur = tölur$| (x -> x % 2 == 0)         // filter → [2,4,6,8,10]
heild      = tölur$< (0, (safn, x) -> safn + x)  // reduce → 55

// Keðja í gegnum milligildi
skref1 = tölur$| (x -> x > 3)
skref2 = skref1$> (x -> x * x)
>> skref2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nefnd föll má senda beint til HOF
tvöfalda(x) { <~ x * 2 }
er_stórt(x) { <~ x > 5 }
r = tölur$> tvöfalda       // ✅ bein tilvísun
r = tölur$| er_stórt       // ✅ bein tilvísun
```

---

## Leiðsluvirkji

Hægri hliðin krefst alltaf `_` sem staðgengils fyrir leiðslugildið:

```zymbol
tvöfalda = x -> x * 2
leggja_við = (a, b) -> a + b
hækka = x -> x + 1

5 |> tvöfalda(_)        // → 10
10 |> leggja_við(_, 5)  // → 15
5 |> leggja_við(2, _)   // → 7

// Keðjaður
r = 5 |> tvöfalda(_) |> hækka(_) |> tvöfalda(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Villumeðhöndlun

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "deiling með núll" ¶
} :! {
    >> "annað: " _err ¶    // _err geymir villuskilaboðin
} :> {
    >> "keyrir alltaf" ¶
}
```

| Tegund | Hvenær |
|--------|--------|
| `##Div` | Deiling með núll |
| `##IO` | Skrá / kerfi |
| `##Index` | Vísir utan marka |
| `##Type` | Tegundarmismunur |
| `##Parse` | Gagnaþátttaka |
| `##Network` | Netvillur |
| `##_` | Öll villa (veiðarnet) |

---

## Einingar

```zymbol
// lib/reikn.zy — einingarkjarninn er í slaufusvigum
# reikn {
    #> { leggja_saman, sækja_PI }

    _PI := 3.14159
    leggja_saman(a, b) { <~ a + b }
    sækja_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/reikn <= r    // gælunafn nauðsynlegt

>> r::leggja_saman(5, 3) ¶     // → 8
pi = r::sækja_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Flytja út með öðru opinberu nafni
# mínlib {
    #> { _innri_samlag <= summa }

    _innri_samlag(a, b) { <~ a + b }
}
```

```zymbol
<# ./mínlib <= m

>> m::summa(3, 4) ¶    // → 7  (innra nafnið _innri_samlag er falið)
```

> **Einingarreglur**: aðeins `#>`, fallskilgreiningar og bókstafsgildi breytu-/fastairæsingar eru leyfðar innan `# nafn { }`. Keyrslegar setningar (`>>`, `<<`, lykkjur o.s.frv.) valda villu E013.

---

## Tölukerfi

Zymbol getur sýnt tölur í **69 Unicode-tölustafahandritum** — Devanagari, arabískt-indískt, taílenskt, klingonskt pIqaD, stærðfræðilegt feitletrað, LCD-hlutar og fleira. Virki hamurinn hefur aðeins áhrif á `>>`-úttak; innri reikningur er alltaf tvíundartala.

### Virkjun handrits

Skrifaðu `0` og `9` tölustaf markhöndilsins í `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabískt-indískt (U+0660–U+0669)
#๐๙#    // Taílenskt    (U+0E50–U+0E59)
#09#    // endurstilla á ASCII
```

### Úttak og boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII sjálfgefið)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (tugabrot alltaf ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: # forskeyti alltaf ASCII, tölustafur aðlagast
>> #1 ¶         // → #१   (satt í Devanagari)
>> #0 ¶         // → #०   (ósatt — frábrugðið ०  heiltölu núll)

x = 28 > 4
>> x ¶          // → #१   (samanburðarniðurstaða fylgir virkum ham)
```

### Innfæddur tölustafur í frumkóða

Tölustafir allra studda handrita eru gilt bókstafsgildi — í bilum, leif, samanburði:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean bókstafsgildi í hvaða handriti sem er

`#` + tölustafur `0` eða `1` úr hvaða blokk sem er er gilt boolean bókstafsgildi:

```zymbol
#٠٩#
نشط = #١        // sama og #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` er **alltaf ASCII**. `#0` (ósatt) er alltaf sjónrænt frábrugðið `0` (heiltölu núll) í hvaða handriti sem er.

---

## Gagnvirkjar

```zymbol
// Tegundarbreytingarkast
##.42         // → 42.0  (í Kommutölu)
###3.7        // → 4     (í Heiltölu, slétta)
##!3.7        // → 3     (í Heiltölu, stýfa)

// Þáttar streng í tölu
v1 = #|"42"|      // → 42  (Heiltala)
v2 = #|"3.14"|    // → 3.14  (Kommutala)
v3 = #|"abc"|     // → "abc"  (villulaus, engin villa)

// Slétta / stýfa
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (slétta í 2 aukastafi)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (stýfa)

// Tölusnið
sniðmát = #,|1234567|  // → 1,234,567  (kommaskilin)
vísf = #^|12345.678|   // → 1.2345678e4  (vísindaleg)

// Grunntölubókstafsgildi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (tvíundar)
c = 0o101        // → 'A'  (áttundar)

// Grunntölubreytingarúttak
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Skeljarsameining

```zymbol
dagsetning = <\ date +%Y-%m-%d \>     // fangar stdout (með aftan \n)
>> "Í dag: " dagsetning

skrá = "gögn.txt"
efni = <\ cat {skrá} \>               // breytuinnsetning í skipunum

úttak = </"./undirforrit.zy"/>        // keyra annað Zymbol-forrit, fanga úttak
>> úttak
```

> `><` fangar CLI-rök sem strengjafylki (aðeins trjáþáttur).

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

## Táknatilvísun

| Tákn | Aðgerð | Tákn | Aðgerð |
|------|--------|------|--------|
| `=` | breyta | `$#` | lengd |
| `:=` | fasti | `$+` | bæta við (keðjanlegur) |
| `>>` | úttak | `$+[i]` | setja inn á vísi (1-byggt) |
| `<<` | inntak | `$-` | fjarlægja fyrsta eftir gildi |
| `¶` / `\\` | línuskil | `$--` | fjarlægja öll eftir gildi |
| `?` | ef | `$-[i]` | fjarlægja á vísi (1-byggt) |
| `_?` | annars-ef | `$-[i..j]` | fjarlægja bil (1-byggt) |
| `_` | annars / víðátt | `$?` | inniheldur |
| `??` | match | `$??` | finna alla vísa (1-byggt) |
| `@` | lykkja | `$[s..e]` | sneiðing (1-byggt) |
| `@ N { }` | teljara-lykkja (N ítrekanir) | `$>` | map |
| `@!` | brjóta | `$\|` | sía |
| `@>` | halda áfram | `$<` | draga saman |
| `@:nafn { }` | merkt lykkja | `$/ delim` | strengskipting |
| `@:nafn!` | rof merkis | `$++ a b c` | samskeyta byggja |
| `@:nafn>` | halda áfram merkis | `arr[i>j>k]` | siglingarvísir |
| `->` | lambda | `arr[i] = val` | uppfæra stak (aðeins fylki) |
| `arr[i] += val` | samsett uppfærsla | `arr[i]$~` | virkniuppfærsla (ný afrit) |
| `$^+` | raða hækkandi (frumstæð) | `$^-` | raða lækkandi (frumstæð) |
| `$^` | raða með samanburði (túplur) | `<~` | skila |
| `\|>` | leiðsla | `!?` | reyna |
| `:!` | grípa | `:>` | loks |
| `#1` | satt | `#0` | ósatt |
| `$!` | er villa | `$!!` | áframsenda villu |
| `<#` | flytja inn | `#>` | flytja út |
| `#` | lýsa einingu | `::` | einingarkall |
| `.` | svæðisaðgangur | `#?` | tegundar-lýsigögn |
| `#\|..\|` | þátta tölu | `##.` | breyta í Kommutölu |
| `###` | breyta í Heiltölu (slétta) | `##!` | breyta í Heiltölu (stýfa) |
| `#.N\|..\|` | slétta | `#!N\|..\|` | stýfa |
| `#,\|..\|` | kommasnið | `#^\|..\|` | vísindaleg |
| `#d0d9#` | tölukerfisskipti | `#09#` | endurstilla á ASCII |
| `<\ ..\>` | skeljarkeyrsel | `>\<` | CLI-rök |
| `\ var` | eyða breytu beinlínis | | |

---

## Útgáfubreytingaskrá

### v0.0.4 — 1-byggð vísun, föll fyrsta flokks og einingablokkir _(apríl 2026)_

- **Breyting** Öll vísun skipt yfir í **1-byggt** — `arr[1]` er fyrsta stakið; `arr[0]` er keyrslutímavilla
- **Bætt við** Nefnd föll eru **fyrsta flokks gildi** — sendu beint til HOF: `tölur$> tvöfalda`
- **Bætt við** Einingar **blokksetningafræði** nauðsynleg: `# nafn { ... }` — flöt setningafræði fjarlægð
- **Bætt við** Fjölvíddavísun: `arr[i>j>k]` (sigling), `arr[p ; q]` (flöt útdráttur)
- **Bætt við** Tegundarbreytingarkast: `##.segð` (Kommutala), `###segð` (Heiltala slétt), `##!segð` (Heiltala stýfð)
- **Bætt við** Strengskipting: `str$/ delim` — skilar `Array(Strengur)`
- **Bætt við** Samskeytubygging: `base$++ a b c` — bætir við mörgum stökum
- **Bætt við** Teljara-lykkja: `@ N { }` — endurtekur nákvæmlega N sinnum
- **Bætt við** Merkt lykkjusetningafræði: `@:nafn { }`, `@:nafn!`, `@:nafn>` — kemur í stað `@ @nafn` / `@! nafn`
- **Bætt við** Breytuumfangsreglur: `_nafn`-breytur hafa nákvæmt blokkumfang; `\ var` eyðir snemma
- **Bætt við** Match samanburðarmynstur: `< 0 :`, `> 5 :`, `== 42 :` o.s.frv.
- **Bætt við** Einings E013-villa: keyrslegar setningar í einingarkjarna eru bannaðar
- **Lagað** `take_variable` spillir ekki lengur einingafástum við skrifendursendingu
- **Lagað** `alias.CONST` leysist nú rétt; `#>` getur komið á eftir fallskilgreiningum
- **VM** Fullt jafngildi: 393/393 prófanir standast

### v0.0.3 — Unicode-tölukerfi og LSP-endurbætur _(apríl 2026)_

- **Bætt við** 69 Unicode-tölustafablokkir með hamaskiptitákni `#d0d9#`
- **Bætt við** Boolean bókstafsgildi í hvaða handriti sem er — `#१` / `#०`, `#١` / `#٠` o.s.frv.
- **Bætt við** Klingonskt pIqaD-tölustafir (CSUR PUA U+F8F0–U+F8F9)
- **Bætt við** `SetNumeralMode` VM-skipunarkóði — fullt jafngildi með trjáþáttara
- **Bætt við** REPL virðir virkan tölukerfsham í bergmál og breytubirting
- **Breytt** Boolean `>>`-úttak inniheldur nú `#`-forskeyti (`#0` / `#1`) í öllum hömum

### v0.0.2_01 — Virkjanafn _(30. mar. 2026)_

- **Breytt** `c|..|` → `#,|..|` og `e|..|` → `#^|..|` — samræmt við `#`-sniðforskeytisfjölskylduna
- **Bætt við** Útflutningsgælunafn: endurflytja einingahluti undir öðru nafni

### v0.0.2 — Safna-API endurhönnun og uppsetningarforrit _(24. mar. 2026)_

- **Bætt við** Sameinuð `$`-virkafjölskylda fyrir fylki og strengi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bætt við** Niðurskiptingarúthlutun fyrir fylki, túplur og nefndar túplur
- **Bætt við** Neikvæðir vísar (`arr[-1]` = síðasta stak)
- **Bætt við** Innfædd uppsetningarforrit — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. mar. 2026)_

- **Bætt við** Samsett úthlutun `^=`
- **Lagað** Þáttunarreikningshorn; leiðréttingar á skjölun

### v0.0.1 — Fyrsta opinbera útgáfa _(22. mar. 2026)_

- Trjáþáttunarþulur + skrásetningar-VM (`--vm`, ~4× hraðari, ~95% jafngildi)
- Öll kjarnaskilyrði: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fullir Unicode-auðkenni, einingakerfi, lambda, lokun, villumeðhöndlun
- REPL, LSP, VS Code-viðbót, sniðmót (`zymbol fmt`)

---

_Zymbol-Lang — Táknrænt. Alþjóðlegt. Óbreytanlegt._
