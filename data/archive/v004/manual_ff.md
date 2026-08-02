> **Boytaŋgal:** Dewtere ndee ko e ballal miijotooɗo dañaa (AI) waɗaa.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Ɗerewol kanonikun ko **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nder defterdu firoore.

---

# Zymbol-Lang haalpitaare

**Zymbol-Lang** ko ɗemngal fijirde tiitoonde. Alkulal ngartol alaa — ŋarɗuyeeji fow ko tiitoonde. Ngal golloo ko wooturu e kala ɗemngal neɗɗanke.

- Ala `if`, `while`, `return` — heen tawaade `?`, `@`, `<~`
- Unicode timmunde — hinle buutinɗe e kala ɗemngal walla emoji
- Ngaɗaaki e ɗemngal neɗɗanke — koode nden ko wootere e kala nokku

**Firoore diɗɗal**: v0.0.4 | **Barmal jarruɓe**: 393/393 (lootogol TW ↔ VM)

---

## Waylotooɗe e luttuɗe

```zymbol
x = 10              // waylotoojo waylotoo
PI := 3.14159       // lutto — lintinoowo keso ko jewte jokkondirɗe
innde = "Aaliisa"
huuɓtinde = #1      // Booliyaan goonga
👋 := "A jaaraama"
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

## Sifaaji data

| Sifa | Kirol | Taggo `#?` | Maanduɗi |
|------|-------|------------|----------|
| Limoore timmunde | `42`, `-7` | `###` | 64-bit siynanoongal |
| Limoore lodda | `3.14`, `1.5e10` | `##.` | Binndi ganndal hoolaama |
| Haalol | `"binndi"` | `##"` | Naanirgol: `"A jaaraama {innde}"` |
| Alfaa | `'A'` | `##'` | Alfaa Unicode gooto |
| Booliyaan | `#1`, `#0` | `##?` | Hina limoore — `#1 ≠ 1` |
| Moofu | `[1, 2, 3]` | `##]` | Ŋarɗuyaaji kawraaɗi |
| Tupli | `(a, b)` | `##)` | Jogorgal |
| Tupli inniraaɗo | `(x: 1, y: 2)` | `##)` | Gese inniraaɗe |
| Golle | ciimtol golle inniraaɗe | `##()` | Ɓonndi aranere; hollirta `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ɓonndi aranere; hollirta `<lambd/N>` |

```zymbol
// Caarugol sifa — hollirta (sifa, limle, njeendi)
meeta = 42#?
>> meeta ¶         // → (###, 2, 42)
t = meeta[1]
>> t ¶            // → ###
```

---

---

## Njeñtudi e Naatirgol

```zymbol
>> "A jaaraama" ¶                       // ¶ walla \\ ngam faddere kesiriere haqiiqa
>> "a=" a " b=" b ¶                    // fawaade — njeendiiji keewɗi
>> (arr$#) ¶                           // gollorɗi postfix njiɗɗi ( ) nder >> gila

<< innde                           // jangude e nder waylotoojo (ɓaawo yaqtu)
<< "Naate innde: " innde            // e yaqtu
```

> `¶` (AltGr+R e kala ekeyeere ispañol) e `\\` ko gooto ngam faddere kesiriire.

---

---

## Kuutorɗe

```zymbol
// limle — kuutorɗe limtooje; gollorɗe goɗɗe ina ngondi e nder >> fawa
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (limoore timmunde feccugol)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (limoore ndarnde)

// Yondinnde
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b    // #1

// Hakkilantaaku
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

---

## Haalol

```zymbol
// No ɗiɗi njuɓɓinirgol
innde = "Aaliisa"
n = 42

>> "A jaaraama " innde " a woodi " n ¶       // fawaade — nder >> gila
bayyinoore = "A jaaraama {innde}, a woodi {n}"   // naanirgol — e nokku kala
```

```zymbol
s = "A jaaraama Aduna"
njuuteendi = s$#                  // 11 (e dow font)
cukkol = s$[1..5]                 // "A jaa"  (ɓullere-1, hannde fawii)
woodi = s$? "Aduna"               // #1
feccuɗe = "a,b,c,d"$/ ','         // [a, b, c, d]  (feccugol e njuɓɓotoojo)
looti = s$~~["a":"o"]             // "A joaaraama Aduno"
looti1 = s$~~["a":"o":1]          // "A joaaraama Aduna" (gootanɗe n tan)
```

> `+` woni e limooje tan. Ngam haalol, kuutor `,`, fawaade, walla naanirgol.

---

## Luural jawdi

```zymbol
x = 7

? x > 0 { >> "ko bam" ¶ }

? x > 100 {
    >> "mawngu" ¶
} _? x > 0 {
    >> "ko bam" ¶
} _? x == 0 {
    >> "re'e" ¶
} _ {
    >> "ko bamtu" ¶
}
```

> Ŋirɗe buubɗe `{ }` **ko boddii** hay ngam haalngu gootungu.

---

---

## Hawrugol

```zymbol
// Jahe
limle = 85
leltol = ?? limle {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> leltol ¶     // → B

// Haaluje
ndiiƴre = "boɗeeru"
koodu = ?? ndiiƴre {
    "boɗeeru"  : "#FF0000"
    "haako"    : "#00FF00"
    _          : "#000000"
}

// mbaydiiji yondindirɗi
ngulee = -5
haala = ?? ngulee {
    < 0  : "leydi"
    < 20 : "dabbude"
    < 35 : "tunna"
    _    : "ulee"
}
>> haala ¶       // → leydi

// Faamu haalngu (foccaaɗi)
?? n {
    0        : { >> "re'e" ¶ }
    _? n < 0 : { >> "ko bamtu" ¶ }
    _        : { >> "ko bam" ¶ }
}
```

---

## Haylagol

```zymbol
@ i:0..4  { >> i " " }        // jaha heewi:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // e daande:     1 3 5 7 9
@ i:5..0:1 { >> i " " }       // waylitugol:   5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (haa)

lekku = ["poma", "peeru", "weneere"]
@ l:lekku { >> l ¶ }            // ngam kala feccere moofu

@ k:"a jaaraama" { >> k "-" }
>> ¶                          // → a- -j-a-a-r-a-a-m-a-  (ngam kala alfaa e haalol)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> jokku
    ? i > 7 { @! }            // @> haaɓtu
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Haylagol joppaniingol
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Haylagol inniraangol (haaɓtugol hawtaangol)
lomtirɗe = 0
@:yaasi {
    lomtirɗe++
    ? lomtirɗe >= 3 { @:yaasi! }
}
>> lomtirɗe ¶                 // → 3
```

---

## Golle

```zymbol
Ɓeydogol(a, b) { <~ a + b }
>> Ɓeydogol(3, 4) ¶   // → 7

Faktooriyal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * Faktooriyal(n - 1)
}
>> Faktooriyal(5) ¶    // → 120
```

Golle ina ngoodi **koŋkol keeringal** — ɗe nganndoo waylotooɗe yaasi. Kuutor njeñtudi parameteeruuji `<~>` ngam laɓɓinde waylotooɗe noddotooɗo:

```zymbol
loo(a<~, b<~) {
    ɓundu = a
    a = b
    b = ɓundu
}
x = 10
y = 20
loo(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Golle inniraaɗe ko **Ɓonndi aranere njeendiiji** — neldu fawa: `nums$> hitilgo`. `x -> fn(x)` kadi ko laawɗuɗo.

---

---

## Lambdaaji e daande winndude

```zymbol
hitilgo = x -> x * 2
Ɓeydogol = (a, b) -> a + b
>> hitilgo(5) ¶   // → 10
>> Ɓeydogol(3, 7) ¶ // → 10

// Foccaato lambda
feccugol = x -> {
    ? x > 0 { <~ "ko bam" }
    _? x < 0 { <~ "ko bamtu" }
    <~ "re'e"
}

// Daande winndude — nangi koŋkol yaasi
fokkal = 3
hitirgol tati = x -> x * fokkal
>> hitirgol tati(7) ¶   // → 21

// Duungal
waɓtu_Ɓeydiwol(n) { <~ x -> x + n }
Ɓeydu sappo = waɓtu_Ɓeydiwol(10)
>> Ɓeydu sappo(5) ¶   // → 15

// E nder moofu
gollaade = [x -> x+1, x -> x*2, x -> x*x]
>> gollaade[3](5) ¶   // → 25
```

---

## Moofu

Moofu **ko waylo** e ina jogoo **sifa gootol** ŋarɗuyaaji.

```zymbol
moofu = [1, 2, 3, 4, 5]

moofu[1]          // 1 — naatugol (ɓullere-1: ŋarɗuyaango aranere)
moofu[-1]         // 5 — cuusalan gobbo (ŋarɗuyaango hande)
moofu$#           // 5 — njuuteendi (kuutor (moofu$#) nder >> gila)

moofu = moofu$+ 6            // ɓeydoo → [1,2,3,4,5,6]
moofu2 = moofu$+[2] 99       // naato e cuusalan 2 (ɓullere-1)
moofu3 = moofu$- 3           // ittu feccere aranere njeendi
moofu4 = moofu$-- 3          // ittu feccere ɗe fow
moofu5 = moofu$-[1]          // ittu e cuusalan 1 (ŋarɗuyaango aranere)
moofu6 = moofu$-[2..3]       // ittu jaha (ɓullere-1, hannde fawii)

woodi = moofu$? 3            // #1 — ina woodi
cuuɗe = moofu$?? 3           // [3] — cuuɗe ɗe fow njeendi (ɓullere-1)
riiwol = moofu$[1..3]        // [1,2,3] — riiwol (ɓullere-1, hannde fawii)
riiwol2 = moofu$[1:3]        // [1,2,3} — gootol, haalngu cuusalan

yahrude = moofu$^+           // tolnude yahrude (ko adanɗe faw)
wartude = moofu$^-           // tolnude wartude (ko adanɗe faw)

// Tupli inniraaɗo/cuusalan moofu — kuutor $^ e lambda yondinnde
daata = [(innde: "Kaarla", duuɓi: 28), (innde: "Aana", duuɓi: 25), (innde: "Bob", duuɓi: 30)]
duuɓi_faw   = daata$^ (a, b -> a.duuɓi < b.duuɓi)     // yahrude e duuɓi (<)
innde_faw   = daata$^ (a, b -> a.innde > b.innde)     // wartude e innde (>)
>> duuɓi_faw[1].innde ¶    // → Aana
>> innde_faw[1].innde ¶     // → Kaarla

// Laɓɓingol ŋarɗuyaango fawa (moofu tan)
moofu[1] = 99              // lintin
moofu[2] += 5              // doon: +=  -=  *=  /=  %=  ^=

// Laɓɓingol kuuɓtidinngol — hollirta moofu keso; fuɗɗorol gaggaaka
moofu2 = moofu[2]$~ 99
```

> Kuutorɗe moofu fow ko **moofu keso** hollirta. Lintin ɓaawo: `moofu = moofu$+ 4`.
> `$+` kaɲey ana waawi: `moofu = moofu$+ 5$+ 6$+ 7`. Kuutorɗe goɗɗe kuutor lintinooɗe hakkukor.
> **Cuusalan noon ko ɓullere-1**: `moofu[1]` ko ŋarɗuyaango aranere; `moofu[0]` ko ewte jokkondirɗe.
> `$^+` / `$^-` **moofu adanɗe** faw (limooje, haaluje). Ngam moofu tupli, kuutor $^ e lambda yondinnde — laawol ngol ko e lambda winndaa (`<` = yahrude, `>` = wartude).

**Njeendi hakkilantaaku** — lintin moofu e waylotoojo goɗɗo ina waɗa koppi keeriiɗo:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b handaaka
```

```zymbol
// Moofu hawtaaɗi (cuusalan ɓullere-1)
fadaaru = [[1,2,3],[4,5,6],[7,8,9]]
>> fadaaru[2][3] ¶    // → 6  (taƴre 2, haatere 3)
```

---

## Torra ko'e

```zymbol
// Moofu
moofu = [10, 20, 30, 40, 50]
[a, b, c] = moofu              // a=10  b=20  c=30
[ɓooyɗo, *hettiiɗe] = moofu    // ɓooyɗo=10  hettiiɗe=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ rewnii

// Tupli cuusalan
tufto = (100, 200)
(px, py) = tufto              // px=100  py=200

// Tupli inniraaɗo
neɗɗo = (innde: "Aana", duuɓi: 25, saare: "Madriid")
(innde: i, duuɓi: d) = neɗɗo   // i="Aana"  d=25
```

---

## Tupli

Tupli ko ronooji **gaɗaani** dorndirɗi ɗi mbaawi jogude njeendiiji **sifaaji sarija**.
Wakkaati moofu, ŋarɗuyaaji mbaawi laɓɓineede caggal raɓɓugol.

```zymbol
// Cuusalan — sifaaji hawtirɗi horiima
tufto = (10, 20)
>> tufto[1] ¶      // → 10

daata = (42, "a jaaraama", #1, 3.14)
>> daata[3] ¶      // → #1

// Inniraaɗo
neɗɗo = (innde: "Aaliisa", duuɓi: 25)
>> neɗɗo.innde ¶    // → Aaliisa
>> neɗɗo[1] ¶      // → Aaliisa  (cuusalan kadi golloo, ɓullere-1)

// Hawtaaɗo
nokku = (x: 10, y: 20)
p = (nokku: nokku, tiitoonde: "fuɗɗorii")
>> p.nokku.x ¶       // → 10
```

**Gagaagol** — kala haaarugo laɓɓinde ŋarɗuyaango tupli ko ewte jokkondirɗe:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ ewte jokkondirɗe: tupli ko gaɗaani
// t[1] += 5    // ❌ ewte gootol

// Tupli inniraaɗo — mahugo haqiiqa
neɗɗo = (innde: "Aaliisa", duuɓi: 25)
mawngu = (innde: neɗɗo.innde, duuɓi: 26)
>> neɗɗo.duuɓi ¶    // → 25
>> mawngu.duuɓi ¶    // → 26
```

Ngam heɓugo njeendi laɓɓinaa, kuutor `$~` (laɓɓingol kuuɓtidinngol) — hollirta tupli **keso**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← fuɗɗorol gaggaaka
>> t2 ¶    // → (10, 999, 30)
```

---

## Golle tolno toowngo

```zymbol
limooji = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

hiɗaaɗi = limooji$> (x -> x * 2)                // mappi → [2,4,6…20]
fotooji   = limooji$| (x -> x % 2 == 0)          // raɓɓoo → [2,4,6,8,10]
firo   = limooji$< (0, (buuɗe, x) -> buuɗe + x) // uste → 55

// Hawrogol e gese hakkunde
daande1 = limooji$| (x -> x > 3)
daande2 = daande1$> (x -> x * x)
>> daande2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Golle inniraaɗe mbaawi neldeede fawa to golle tolno toowngo
hiɗugo(x) { <~ x * 2 }
mawngu_ngoo(x) { <~ x > 5 }
r = limooji$> hiɗugo       // ✅ ciimtol fawa
r = limooji$| mawngu_ngoo   // ✅ ciimtol fawa
```

---

## Kuutorgol piiw

Joŋge ñaamo njiɗɗo `_` haa woto ngam jogorgol njeendi ndi piipaaka:

```zymbol
hiɗugo = x -> x * 2
Ɓeydogol = (a, b) -> a + b
Ɓeydu = x -> x + 1

5 |> hiɗugo(_)        // → 10
10 |> Ɓeydogol(_, 5)   // → 15
5 |> Ɓeydogol(2, _)    // → 7

// Hawraa
r = 5 |> hiɗugo(_) |> Ɓeydu(_) |> hiɗugo(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Jogingol ewte

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "feccugol e re'e" ¶
} :! {
    >> "ewte woɗɗunde: " _err ¶    // _err jogii haalngu ewte
} :> {
    >> "wanaa wootere" ¶
}
```

| Faamu | Jaman |
|-------|-------|
| `##Div` | Feccugol e re'e |
| `##IO` | Deftere / njuɓɓudi |
| `##Index` | Cuusalan kaɓɓiti balɗe |
| `##Type` | Faamu lunndi |
| `##Parse` | Caarugol daata |
| `##Network` | Ewte je'e | 
| `##_` | Ewte kala (nanga fow) |

---

---

## Bajji

```zymbol
// lib/calc.zy — baali modulu ndi e nder ŋirɗe buubɗe
# calc {
    #> { Ɓeydogol, get_PI }

    _PI := 3.14159
    Ɓeydogol(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // innde woɗɗunde boddii

>> c::Ɓeydogol(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Yaltinde e innde fahde woɗɗunde
# defterdu_am {
    #> { _Ɓeydogol_nderu <= lewru }

    _Ɓeydogol_nderu(a, b) { <~ a + b }
}
```

```zymbol
<# ./defterdu_am <= m

>> m::lewru(3, 4) ¶    // → 7  (innde nderu _Ɓeydogol_nderu suuɗaama)
```

> **Laabi bajji**: nder `# innde { }`, `#>`, bayyini golle, e daɓɓinooɗe waylotoojo/lutto kirol tan horiima. Haalnguuji huutoraaɗi (`>>`, `<<`, haylagol, woɗɗuɗi) neddina ewte E013.

---

---

## Kuugal limooji

Zymbol mbaawi hollirde limooji e **69 foccataa limle Unicode** — Dewanaagari, Aruuba-Hindu, Taylande, Kilingon pIqaD, Limle semmbiɗe, bojjeeji LCD, e woɗɗuɗi. Kuugol kuutortee ngol hollirta e njeñtudi `>>` tan; limle nderu ko ɗiɗaɓere wanaa wootere.

### Teenugol binndi

Windugol `0` e `9` binndi ngi fotoo nder `#…#`:

```zymbol
#०९#    // Dewanaagari    (U+0966–U+096F)
#٠٩#    // Aruuba-Hindu   (U+0660–U+0669)
#๐๙#    // Taylande       (U+0E50–U+0E59)
#09#    // huccintinoo ASCII
```

---

### Njeñtudi e Booliyaanuuji

```zymbol
x = 42
>> x ¶          // → 42   (ko ɓuri heewde ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (nokku cappannde ko ASCII wanaa wootere)
>> 1 + 2 ¶      // → ३

// Booliyaanuuji: fottorgol # ko ASCII wanaa wootere, limol ngal hawrotana
>> #1 ¶         // → #१   (goonga e Dewanaagari)
>> #0 ¶         // → #०   (hay — wayi e ० limoore timmunde re'e)

x = 28 > 4
>> x ¶          // → #१   (lootogol yondinnde jokki kuugol kuutortee ngol)
```

---

## Kiroloji limle adanɗe nder koode ɓundu

Limle binndi fow ɗi ballitaa ko kiroloji laawɗuɗi — e jahe, e modulo, e yondinnde:

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

### Kiroloji Booliyaanuuji e kala binndi

`#` + limol `0` walla `1` binndi foccataa kala ko kirol Booliyaan laawɗuɗo:

```zymbol
#०९#
huuɓtinde = #१        // gootol e #1
>> huuɓtinde ¶        // → #१
>> (#१ && #०) ¶       // → #०
```

> `#` **ko ASCII wanaa wootere**. `#0` (hay) ko wayi e `0` (limoore timmunde re'e) e kala binndi.

---

---

## Kuutorɗe daata

```zymbol
// Waylude faamu
##.42         // → 42.0  (ngam Lodda)
###3.7        // → 4     (ngam Limoore timmunde, wondru)
##!3.7        // → 3     (ngam Limoore timmunde, ittugol)

// Caarugol haalol ngam limoore
v1 = #|"42"|      // → 42  (Limoore timmunde)
v2 = #|"3.14"|    // → 3.14  (Lodda)
v3 = #|"abc"|     // → "abc"  (deeƴanɗum, ewte alaa)

// Wondrude / Ittugol
pi = 3.14159265
wondru2 = #.2|pi|      // → 3.14  (wondrude e cuusalan 2 loppi)
wondru4 = #.4|pi|      // → 3.1416
ittu2 = #!2|pi|        // → 3.14  (ittugol)

// Waɗtugol limoore
waɗtugol = #,|1234567|   // → 1,234,567  (feccagol e loppol)
ganndal = #^|12345.678|  // → 1.2345678e4  (ganndal)

// Kiroloji kalluŋge
a = 0x41         // → 'A'  (heksadesimaal)
b = 0b01000001   // → 'A'  (binari)
c = 0o101        // → 'A'  (oktal)

// Njeñtudi waylugol kalluŋge
heks = 0x|255|   // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
okt = 0o|8|      // → "0o10"
des = 0d|255|    // → "0d0255"
```

---

---

## Hawroogol Shella

```zymbol
taariika = <\ date +%Y-%m-%d \>     // nanga stdout (e \n nder hande)
>> "Hannde: " taariika

deftere = "daata.txt"
ko_ngoo = <\ cat {deftere} \>        // naanirgol e nder yamirooje

njeñtudi = </"./subscript.zy"/>      // huutora goɗɗo Zymbol binndi, nanga njeñtudi
>> njeñtudi
```

> `><` nanga CLI jaɓuɗe wa haalol moofu (tree-walker tan).

---

## Maandol timmungol: FizzBuzz

```zymbol
feccugol(limol) {
    ? limol % 15 == 0 { <~ "FizzBuzz" }
    _? limol % 3  == 0 { <~ "Fizz" }
    _? limol % 5  == 0 { <~ "Buzz" }
    _ { <~ limol }
}

@ i:1..20 { >> feccugol(i) ¶ }
```

---

---

## Ciimtol tiitoonde

| Tiitoonde | Gollal | Tiitoonde | Gollal |
|-----------|--------|-----------|--------|
| `=` | waylotoojo | `$#` | njuuteendi |
| `:=` | lutto | `$+` | Ɓeydoo (ana waawi hawre) |
| `>>` | njeñtudi | `$+[i]` | naato e cuusalan (ɓullere-1) |
| `<<` | naatirgol | `$-` | ittu aranere e njeendi |
| `¶` / `\\` | faddere kesiriire | `$--` | ittu ɗe fow e njeendi |
| `?` | si | `$-[i]` | ittu e cuusalan (ɓullere-1) |
| `_?` | ma si | `$-[i..j]` | ittu jaha (ɓullere-1) |
| `_` | ma / gaafal | `$?` | woodi |
| `??` | hawrugol | `$??` | yiytu cuuɗe ɗe fow (ɓullere-1) |
| `@` | haylagol | `$[s..e]` | riiwol (ɓullere-1) |
| `@ N { }` | haylagol N laabi | `$>` | mappi |
| `@!` | haaɓtu | `$|` | raɓɓoo |
| `@>` | jokku | `$<` | uste |
| `@:innde { }` | haylagol inniraangol | `$/ njuɓɓotoojo` | feccugol haalol |
| `@:innde!` | haaɓtugol inniraangol | `$++ a b c` | mahugol hawrogol |
| `@:innde>` | jokku inniraangol | `moofu[i>j>k]` | cuusalan lewru |
| `->` | lambda | `moofu[i] = njeendi` | laɓɓin ŋarɗuyaango (moofu tan) |
| `moofu[i] += njeendi` | laɓɓinndo doon | `moofu[i]$~` | laɓɓingol kuuɓtidinngol (koppi keso) |
| `$^+` | tolnude yahrude (adanɗe) | `$^-` | tolnude wartude (adanɗe) |
| `$^` | tolnude e yondinnde (tupli) | `<~` | hollir |
| `|>` | piiw | `!?` | jarribo |
| `:!` | nangu | `:>` | wattan |
| `#1` | goonga | `#0` | hay |
| `$!` | ko ewte | `$!!` | mbaɗa ewte |
| `<#` | huutora | `#>` | yaltin |
| `#` | bayyina modulu | `::` | noddu modulu |
| `.` | naatugol gese | `#?` | metadaata faamu |
| `#\|..\|` | caaru limol | `##.` | waylu ngam Lodda |
| `###` | waylu ngam Limoore timmunde (wondru) | `##!` | waylu ngam Limoore timmunde (ittu) |
| `#.N\|..\|` | wondru | `#!N\|..\|` | ittu |
| `#,\|..\|` | waɗtugol loppol | `#^\|..\|` | ganndal |
| `#d0d9#` | waylu kuugal limooji | `#09#` | huccintinoo ASCII |
| `<\ ..\>` | huutora shell | `>\<` | Jaɓuɗe CLI |
| `\ var` | ittu waylotoojo haqiiqa | | |

---

## Bayyinol wayluɗe cuɓaaɗe

### v0.0.4 — Cuusalan ɓullere-1, Golle ɓonndi aranere & Foccaaɗi modulu _(Abriil 2026)_

- **Bonngu** Cuuɗe ɗe fow waylitii **ɓullere-1** — `moofu[1]` ko ŋarɗuyaango aranere; `moofu[0]` ko ewte jokkondirɗe
- **Ɓeydi** Golle inniraaɗe ko **ɓonndi aranere njeendiiji** — neldu fawa ngam golle tolno toowngo: `nums$> hiɗugo`
- **Ɓeydi** **Haalngu foccaato** ngam modulu boddii: `# innde { ... }` — haalngu fottugol ittaama
- **Ɓeydi** Cuusalan dinariiji keewɗi: `moofu[i>j>k]` (lewru), `moofu[p ; q]` (fottugol)
- **Ɓeydi** Waylude faamu: `##.haala` (Lodda), `###haala` (Limoore timmunde wondru), `##!haala` (Limoore timmunde ittu)
- **Ɓeydi** Feccugol haalol: `haalol$/ njuɓɓotoojo` — hollirta `Array(Haalol)`
- **Ɓeydi** Mahugol hawrogol: `koore$++ a b c` — Ɓeyda ŋarɗuyaaji keewɗi
- **Ɓeydi** Haylagol N laabi: `@ N { }` — jaabitol N laabi haa woto
- **Ɓeydi** Haalngu haylagol inniraangol: `@:innde { }`, `@:innde!`, `@:innde>` — lomtana `@ @innde` / `@! innde`
- **Ɓeydi** Laabi koŋkol waylotoojo: waylotooɗe `_innde` ina ngoodi koŋkol foccaato haqiiqa; `\ var` ittata ko adan
- **Ɓeydi** Mbaydiiji yondinnde hawrugol: `< 0 :`, `> 5 :`, `== 42 :` woɗɗuɗi
- **Ɓeydi** Ewte modulu E013: haalnguuji huutoraaɗi e baali modulu ko haɗaa
- **Ɓeydoo** `take_variable` hayfataa luttuɗe modulu e nder winndugol ɓaawo
- **Ɓeydoo** `alias.LUTTO` jooni cuuxata haqiiqa; `#>` mbaawi waɗde caggal bayyini golle
- **VM** Lootogol timmungol: 393/393 jarruɓe feƴƴi

### v0.0.3 — Kuugal limooji Unicode & Ɓeydagol LSP _(Abriil 2026)_

- **Ɓeydi** 69 foccataa limle Unicode e tiitoonde waylugol kuugal `#d0d9#`
- **Ɓeydi** Kiroloji Booliyaanuuji e kala binndi — `#१` / `#०`, `#१` / `#०`, woɗɗuɗi
- **Ɓeydi** Limle Kilingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ɓeydi** `SetNumeralMode` VM opkoode — lootogol timmungol e tree-walker
- **Ɓeydi** REPL teddina kuugal limooji kuutortee ngol e woonditaare e hollirgol waylotoojo
- **Wayli** Booliyaan `>>` njeñtudi jooni ina jogii fottorgol `#` (`#0` / `#1`) e kuugal kala

### v0.0.2_01 — Lirtugol innde kuutor _(30 Mars 2026)_

- **Wayli** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — hawru e galle fottorgol waɗtugol `#`
- **Ɓeydi** Innde woɗɗunde yaltinde: yaltin modulu terɗe e innde woɗɗunde

### v0.0.2 — Ciimtol API moofu & Kuutorɗe _(24 Mars 2026)_

- **Ɓeydi** Galle kuutor `$` hawruɗo ngam moofu e haalol (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ɓeydi** Lintinol torra ko'e ngam moofu, tupli, e tupli inniraaɗi
- **Ɓeydi** Cuuɗe gobɓe (`arr[-1]` = ŋarɗuyaango hande)
- **Ɓeydi** Kuutorɗe asli — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mars 2026)_

- **Ɓeydi** Lintinol doon `^=`
- **Ɓeydoo** Bojjeeji caarugol limle; ɓeydagol winndannde

### v0.0.1 — Cuɓagol aranere saa'i _(22 Mars 2026)_

- Firoore tree-walker + VM regista (`--vm`, ~4× yaawde, ~95% lootogol)
- Mahudiiji fow: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Hinle buutinɗe Unicode timmude, njuɓɓudi modulu, lambdaaji, daande winndude, jogingol ewte
- REPL, LSP, ɓeydagol VS Code, waɗtuɗo (zymbol fmt)

---

_Zymbol-Lang — Tiitoonde. Winndereere. Gaɗaande._
