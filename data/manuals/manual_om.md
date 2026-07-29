> **Beeksisa:** Asheelli kun uumamee fi hiikame saayinsi yaad-rimeeti (AI) tiin.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Qajeelfamni qaamaa **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** kuusaa hiikaa keessatti argama.

---

# Qajeelfama Zymbol-Lang

> **V0.0.5 tiif irradeega'ame — 2026-05-14**

**Zymbol-Lang** afaanima mallattoo ti. Jechoota ijoo hin qabu — wanti hundi mallattoo ti. Afaan namaa kamittuu walqixxummaan hojjeta.

- `if`, `while`, `return` hin jiru — `?`, `@`, `<~` qofa
- Unicode guutuu — addaangaawwan afaan kamiitii ykn emojiin
- Afaan namaa irraa hin eebbifamne — koodiin bakka hundatti walfakkaata

**Faca’aan hiikaa**: v0.0.5 | **Bal’ina qorannaa**: 436/436 (walqixxummaan TW ↔ VM)

---

## Jijjiramoo fi Dhaabbata

```zymbol
x = 10              // jijjiramoo jijjiiramuu danda’u
π := 3.14159        // dhaabbata — irradeemamtuun dogoggorsa yeroo hojitti
maqaa = "Alice"
hojjechaa = #1         // buuleyaan dhugaa
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

`°` (mallattoo digrii, U+00B0) Jijjiramoo jalqaba fayyadamaa irratti gatii giddugaleessaatti ofiinee jalqaba:

```zymbol
lakkoofsota = [3, 1, 4, 1, 5]
@ n:lakkoofsota {
    °walmadaala += n    // ol marraatti ofiinee 0 jalqaba; booda @ jiraata
}
>> walmadaala ¶         // → 14
```

> `°x` (duraa) ol marraatti maxxeessa — bu’aan booda `@` argamuu danda’a.
> `x°` (duubaa) keessa marraa maxxeessa — yeroo marri xumuramu du’a.
> Kan qofti tree-walker.

---

## Gosa Lakkoofsotaa

| Gosa | Foxumtuu | Qoodduu `#?` | Hubachiisa |
|------|---------|----------|---------|
| Lakkoofsa guutuu | `42`, `-7` | `###` | 64-bit mallattoo qabu |
| Roorraa | `3.14`, `1.5e10` | `##.` | Barruun saayinsii hayyamama |
| Fo’aa | `"barruu"` | `##"` | Seerfama: `"Akkam {maqaa}"` |
| Arfii | `'A'` | `##'` | Arfii Unicode tokko |
| Buuleyaan | `#1`, `#0` | `##?` | Lakkoofsa miti — `#1 ≠ 1` |
| Sarara | `[1, 2, 3]` | `##]` | Wantoota wal fakkaatan |
| Tapulee | `(a, b)` | `##)` | Iddoo |
| Tapulee maqaa qabu | `(x: 1, y: 2)` | `##)` | Dirree maqaa qaban |
| Hojii | wabsi hojii maqaa qabu | `##()` | Sadarkaa 1ffaa; agarsiisa `<funct/N>` |
| Lameedaa | `x -> x * 2` | `##->` | Sadarkaa 1ffaa; agarsiisa `<lambd/N>` |

```zymbol
// Ilaalsa gosa — deebisa (gosa, baay’ina lakkoofsaa, gatii)
meetaa = 42#?
>> meetaa ¶         // → (###, 2, 42)
t = meetaa[1]
>> t ¶            // → ###
```

---

## Baafannaa fi Seensa

```zymbol
>> "Akkam" ¶                       // ¶ ykn \\ tajaajila sarar haaraa ifa ta’eef
>> "a=" a " b=" b ¶               // walitti dhiyeessuu — gatiiwwan hedduu
>> (arr$#) ¶                      /// himeentota duubaa >> keessatti ( ) barbaadu

>> maqaa                           /// jijjiramoo keessatti dubbisa (faankomee malee)
>> "Maqaa galchi: " maqaa            /// faankomee wajjin
```

> `¶` (AltGr+R kubboo Ispeenish irratti) fi `\\` sararoota haaraa walqixxaata.

---

## Primitives TUI

Himeentota tuqaa fayyadamaa teerminaalii fi leenjii walitti dhufeenya qabanuf. Irra caalaan isaanii cufaatii `>>| { }` barbaadu (skiriin filannoo + haala raw).

```zymbol
>>| {
    >>!                             // skiriin filannoo qulqulleessi
    >>~ (1, 1, 0, 10) > "Hojiirra"   // tarree 1, kutaalee 1, fg=10 (magariisa)
    @~ 1000                         // sekondii 1 haammachi (1000 ms)
    >>~ (2, 1) > "Xumurame."
}
/// teerminaali ba’uu irratti ofiineedeebi’aa
```

```zymbol
// Bufaa ykn gita’uu fi hamma teerminaalii
>>| {
    [taarii, kutaalee] = >>?              /// hammamteerminaali gaafadhu
    >>~ (1, 1) > "Teerminaalii: " taarii " x " kutaalee
    <<| bufaa                         /// gita’uu bufaa cufaa dubbisi
    >>~ (2, 1) > "Dhiibde: " bufaa
}
```

> `>>!` skiriin qulqulleessa. `>>?` `[taarii, kutaalee]` deebisa. `@~ N` N miliseekondii rafa.
> `<<|` bufa tokko dubbisa (cufaa); `<<|?` baayolessaa cufuu malee (yoo hin jiraann `'\0'` deebisa).
> Tapulee baafannaa iddoo: `(taarii, kutaa, BKS, fg, bg)` — kutaa kamittuu kommaan dhiisuu danda’ama (`>>~ (,,, 196) > "diimaa"`).
> BKS baay’ina bit: `1`=jabaa, `2`=ragadee, `4`=sarara gadi. Paaleettii halluu ANSI 256 (`0`=teerminaalii istaandaardii).
> Kan qofti tree-walker (malee `>>!`, `>>?`, `@~`, `>>~` kan `--vm` keessattis hojjetan).

---

## Himeentota

```zymbol
// Herrega
a = 10
b = 3
taa1 = a + b    // 13
taa2 = a - b    // 7
taa3 = a * b    // 30
taa4 = a / b    // 3  (lakkoofsa guutuu qooduu)
taa5 = a % b    // 1
taa6 = a ^ b    // 1000  (wal’aansoo)

// Walbira qabu — gadi dhaabii keessa galcha
qul1 = a == b    // #0
qul2 = a <> b    // #1
qul3 = a < b     // #0
qul4 = a <= b    // #0
qul5 = a > b     // #1
qul6 = a >= b    // #1

// Samaadaa
sa1 = #1 && #0    // #0
sa2 = #1 || #0    // #1
sa3 = !#1         // #0
```

---

## Fo’aa

```zymbol
// Ulee walitti qabeesa lama
maqaa = "Alice"
n = 42

>> "Akkam " maqaa " ni qabda " n ¶       // walitti dhiyeessuu — >> keessatti
ibsa = "Akkam {maqaa}, ni qabda {n}"     // seerfama — bakkamittiyyuu
```

```zymbol
s = "Akkam addunyaa"
dheerina = s$#                  // 11
caccii = s$[1..5]             // "Akkam"  (1-irratti hundaa’e, dhuma dabale)
jira = s$? "addunyaa"          // #1
qoqqoodama = "a,b,c,d"$/ ','   // [a, b, c, d]  (qoodduudhaan qoodi)
bakka buusi = s$~~["l":"r"]        // "Akkam addunyaa" ( 'l' Oromoo keessatti hin jiru)
bakka buusi1 = s$~~["l":"r":1]     // "Akkam addunyaa"
sarara = "─" $* 20           // "────────────────────"  (N yeroo irradeerami)
```

> `+` kan lakkoofsotaa qofa. Fo’aaaf, `,`, walitti dhiyeessuu ykn seerfama fayyadami.

---

## Yaali Yeroo

```zymbol
x = 7

? x > 0 { >> "mijaa’aa" ¶ }

? x > 100 {
    >> "guddaa" ¶
} _? x > 0 {
    >> "mijaa’aa" ¶
} _? x == 0 {
    >> "zeeroo" ¶
} _ {
    >> "badaa" ¶
}
```

> Cuufaa `{ }` hayyama tokko ta’eeyyuu **barbaachisaa** dha.

---

## Walfakkeessuu

```zymbol
// Daangaa
qabxii = 85
maa’imaa = ?? qabxii {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> maa’imaa ¶    // → B

// Fo’aa
halluu = "diimaa"
koodii = ?? halluu {
    "diimaa"   => "#FF0000"
    "magariisa" => "#00FF00"
    _       => "#000000"
}

// Caasluga walfakkeessaa
ho’a = -5
haala = ?? ho’a {
    < 0  => "jabadhaa"
    < 20 => "qorra"
    < 35 => "bubbe’aa"
    _    => "ho’aa"
}
>> haala ¶    // → jabadhaa

// Haala yaada (cinaa cufaatii)
n = -3
?? n {
    0    => { >> "zeeroo" ¶ }
    < 0  => { >> "badaa" ¶ }
    _    => { >> "mijaa’aa" ¶ }
}
```

---

## Marroowwan

```zymbol
@ i:0..4  { >> i " " }        /// daangaa dabale:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       /// tarkaanfaaf:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       /// duuba:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (yeroo)

fuduraa = ["bura’ee", "piyaa", "wayinii"]
@ f:fuduraa { >> f ¶ }         /// wantoota sararaa keessaa harkaaf

@ b:"hello" { >> b "-" }
>> ¶                          // → h-e-l-l-o-  (argeefii fo’aa keessaa harkaaf)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> itti fufi
    ? i > 7 { @! }             // @! cee’i
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Marroo dhuma hin qabne
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Marroo leebula qabu (cee’uu keessa kan)
lakkoofsaa = 0
@:alaa {
    lakkoofsaa++
    ? lakkoofsaa >= 3 { @:alaa! }
}
>> lakkoofsaa ¶                    // → 3
```

---

## Hojiiwwan

```zymbol
walitti_dabali(a, b) { <~ a + b }
>> walitti_dabali(3, 4) ¶    // → 7

faktooriyeela(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktooriyeela(n - 1)
}
>> faktooriyeela(5) ¶    // → 120
```

Hojiiwwan **daangaa gargar qabu** — jijjiramoota alaa dubbisuu hin danda’an. Daangaa baasuu `<~>` fayyadami jijjiramoota waamaa jijjiiruuf:

```zymbol
jijjiri(a<~, b<~) {
    yeroodhaaf = a
    a = b
    b = yeroodhaaf
}
x = 10
y = 20
jijjiri(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Hojiiwwan maqaa qaban **gatiiwwan sadarkaa 1ffaa** dha — ol gadi deebisi: `lakkoofsota$> lamaan_an`. Uwwisuf: `x -> hojii(x)` iyyuu sirriidha.

---

## Lameejuu fi Cuftanii

```zymbol
lamaan_an = x -> x * 2
walitti_dabali = (a, b) -> a + b
>> lamaan_an(5) ¶    // → 10
>> walitti_dabali(3, 7) ¶  // → 10

// Lameedaa cufaatii
addaan_buu = x -> {
    ? x > 0 { <~ "mijaa’aa" }
    _? x < 0 { <~ "badaa" }
    <~ "zeeroo"
}

// Cuftanii — daangaa alaa qabata
taayitaa = 3
sadeen_an = x -> x * taayitaa
>> sadeen_an(7) ¶    // → 21

// Faakkutarii
hojjee_anyabaa(n) { <~ x -> x + n }
kudhan_walitti_dabaltaa = hojjee_anyabaa(10)
>> kudhan_walitti_dabaltaa(5) ¶    // → 15

// Sarara keessatti
himeentawwan = [x -> x+1, x -> x*2, x -> x*x]
>> himeentawwan[3](5) ¶    // → 25
```

---

## Sarara

Sararri **jijjiiramuu danda’a** fi wantoota **gosa wal fakkaatan** qaba.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — argachuu (1-irratti hundaa’e: wantoota 1ffaa)
x = arr[-1]     // 5 — addaan nammeessaa (wantoota dhuma)
x = arr$#       // 5 — dheerina (>> keessatti (arr$#) fayyadami)

arr = arr$+ 6            /// dabali → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       /// bakka 2 ffatti galchi (1-irratti hundaa’e)
arr3 = arr$- 3           /// dhufaatii 1ffaa gatii baasi
arr4 = arr$-- 3          /// dhufiitii hunda baasi
arr5 = arr$-[1]          /// addaan nammeessaa 1 irratti baasi (wantoota 1ffaa)
arr6 = arr$-[2..3]       /// daangaa baasi (1-irratti hundaa’e, dhuma dabale)

jira = arr$? 3            // #1 — qaba
iddoo = arr$?? 3           // [3] — addaan nammeessa hunda gatii (1-irratti hundaa’e)
qoqooda = arr$[1..3]          // [1,2,3] — qoqooda (1-irratti hundaa’e, dhuma dabale)
qoqooda2 = arr$[1:3]          // [1,2,3] — walfakkaata, maxxansa lakkoofsa irratti hundaa’e

ol = arr$^+             /// tartee baasi ol (kan durii qofa)
gad = arr$^-            /// tartee baasi gad (kan durii qofa)

// Sarara tapulee maqaa qaban/iddoo qaban — $^ wajjin lameedaa walbira qabu
daataabeeyisii = [(maqaa: "Carlaa", waggaa: 28), (maqaa: "Anaa", waggaa: 25), (maqaa: "Boobii", waggaa: 30)]
akkawaggaa  = daataabeeyisii$^ (a, b -> a.waggaa < b.waggaa)    // akka waggaa ol (<)
akkamaqaa = daataabeeyisii$^ (a, b -> a.maqaa > b.maqaa)   // akka maqaa gad (>)
>> akkawaggaa[1].maqaa ¶     // → Anaa
>> akkamaqaa[1].maqaa ¶    // → Carlaa

// Olgadiwwaan wantoota (sarara qofa)
arr[1] = 99              // gadi dhaabii
arr[2] += 5              /// walitti dabalaa: +=  -=  *=  /=  %=  ^=

// Olgadiwwaan hojii — sarara haaraa deebisa; kan duraa hin jijjiiramu
arr2 = arr[2]$~ 99
```

> Himeentawwan walitti qabeessaa hunda **sarara haaraa** deebisu. Dura gadi dhaabi: `arr = arr$+ 4`.
> `$+` maxxanfamaa danda’a: `arr = arr$+ 5$+ 6$+ 7`. Himeentawwan kaan gadi dhaabii giddu galeessa fayyadamu.
> **Iddoo sirreeffamaa 1-irratti hundaa’e**: `arr[1]` wantoota 1ffaa; `arr[0]` dogoggorsa yeroo hojitti.
> `$^+` / `$^-` **sarara kan durii** (lakkoofsota, fo’aa) tartee baasu. Tapulee sarara, `$^` lameedaa walbira qabu fayyadami — kallattiin lameedaa keessatti koodameera (`<` = ol, `>` = gad).

**Atamantiksi gatii** — sarara jijjiramoo biraaf gadi dhaabuun koopii michuumaa uuma:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b hin miidhamu
```

```zymbol
// Sarara keessaa (Iddoo sirreeffamaa 1-irratti hundaa’e)
martiiksii = [[1,2,3],[4,5,6],[7,8,9]]
>> martiiksii[2][3] ¶    // → 6  (tarree 2, kutaalee 3)
```

---

## Caasluga Caccabuu

```zymbol
// Sarara
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[toqnuma, *hafuu] = arr         // toqnuma=10  hafuu=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ gatii dhabaa

// Tapulee iddoo
cuqqaaltuu = (100, 200)
(px, py) = cuqqaaltuu             // px=100  py=200

// Tapulee maqaa qabu
nama = (maqaa: "Anaa", waggaa: 25, magaala: "Maadiriid")
(maqaa: n, waggaa: w) = nama   // n="Anaa"  w=25
```

---

## Tapulee

Tapuleewwan **jijjiiramuu hin dandeenye** mi’aawwan tarteeffaman wantoota **gosaa addaaddaa** qabachuu danda’an.
Sarara irraa adda, wantoota uumamee booda jijjiiramuu hin danda’an.

```zymbol
// Iddoo — gosawwan makamaa hayyamama
cuqqaaltuu = (10, 20)
>> cuqqaaltuu[1] ¶    // → 10

daataa = (42, "Akkam", #1, 3.14)
>> daataa[3] ¶     // → #1

// Maqaa qabu
nama = (maqaa: "Aliisii", waggaa: 25)
>> nama.maqaa ¶    // → Aliisii
>> nama[1] ¶      // → Aliisii  (idaan nammeessaa iyyuu ni hojjeta, 1-irratti hundaa’e)

// Keessaa
iddoo = (x: 10, y: 20)
p = (iddoo: iddoo, leebula: "madda")
>> p.iddoo.x ¶        // → 10
```

**Hin jijjiiramuu** — tapulee wantoota jijjiiruuf yaaluun dogoggorsa yeroo hojitti:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ dogoggorsa yeroo hojitti: tapulee jijjiramuu hin danda’u
// t[1] += 5    // ❌ dogoggorsa walfakkaata
```

Gatii jijjiirame argachuf `$~` (olgadiwwaan hojii) fayyadami — **tapulee haaraa** deebisa:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← kan duraa hin jijjiiramu
>> t2 ¶    // → (10, 999, 30)

// Tapulee maqaa qabu — ifatti irra ijaari
nama = (maqaa: "Aliisii", waggaa: 25)
guddoo  = (maqaa: nama.maqaa, waggaa: 26)
>> nama.waggaa ¶    // → 25
>> guddoo.waggaa ¶     // → 26
```

---

## Hojiiwwan Sadarkaa Olaanaa

```zymbol
lakkoofsota = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

lammaan_yoo  = lakkoofsota$> (x -> x * 2)                  // map  → [2,4,6…20]
lakkoofsa_walqixaa    = lakkoofsota$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
walmadaala    = lakkoofsota$< (0, (kuusaa, x) -> kuusaa + x)     // reduce → 55

// Maxxanfama giddugaleessa karaa
tarkaanfaa1 = lakkoofsota$| (x -> x > 3)
tarkaanfaa2 = tarkaanfaa1$> (x -> x * x)
>> tarkaanfaa2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Hojiiwwan maqaa qaban ol gadi HOF deebisuu danda’u
lamaan_an(x) { <~ x * 2 }
guddaa(x) { <~ x > 5 }
r = lakkoofsota$> lamaan_an       // ✅ wabsi kallattii
r = lakkoofsota$| guddaa       // ✅ wabsi kallattii
```

---

## Himeentaa Paayipii

Irra mirgaa yeroo hundaatiif `_` bakka buusaa gatii paayipii fedhii:

```zymbol
lamaan_an = x -> x * 2
walitti_dabali = (a, b) -> a + b
taa = x -> x + 1

taa1 = 5 |> lamaan_an(_)        // → 10
taa2 = 10 |> walitti_dabali(_, 5)       // → 15
taa3 = 5 |> walitti_dabali(2, _)        // → 7

// Maxxanfame
taa = 5 |> lamaan_an(_) |> taa(_) |> lamaan_an(_)
>> taa ¶    // → 22  (5→10→11→22)
```

---

## Dogoggorsa Sirreessuu

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "zeeroodhaan qooduu" ¶
} :! {
    >> "kalee: " _err ¶    // _err ergaa dogoggorsaa qaba
} :> {
    >> "yeroo hunda hojjeta" ¶
}
```

| Gosa | Yoom |
|------|------|
| `##Div` | Zeeroodhaan qooduu |
| `##IO` | Faayilii / siisteemaa |
| `##Index` | Iddoo nammeessaa daangaa alaa |
| `##Type` | Gosa walsimsiisuu |
| `##Parse` | Daataa caccabuu |
| `##Network` | Dogoggorsawwan neetworkii |
| `##_` | Dogoggorsa kamittuu (buudhuf) |

---

## Mooguyuliiwwan

```zymbol
// lib/calc.zy — dhagni mooguyulii cuufaa keessatti cufame
# calc {
    #> { walitti_dabali, get_PI }

    _π := 3.14159
    walitti_dabali(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // maqaa biraa barbaachisa

>> c::walitti_dabali(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Maqaa biraa fayyadamuun baasi
# mylib {
    #> { _walitti_dabala_keessa => walmadaala }

    _walitti_dabala_keessa(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::walmadaala(3, 4) ¶    // → 7  (maqaa keessa _walitti_dabala_keessa dhokate)
```

> **Seera mooguyulii**: `# maqaa { }` keessatti, `#>`, ibsa hojii, fi kan jalqaba jijjiramoo/dhaabbata foxumtuu qofa hayyamama. Yaadawwan raaw’atamuu danda’an (`>>`, `<<`, marroowwan, ati.) dogoggorsa E013 olkaasa.

---

## Haalawwan Lakkoofsaa

Zymbol lakkoofsota **caasluga lakkoofsota Unicode 69** keessatti agarsiisuu danda’a — Deevanaagaarii, Araba-Indik, Taayii, Kilingon pIqaD, Herrega Ijaabbate, kutaaawwan LCD, fi kanneen biroo. Haalli hojiirra oolu baafannaa `>>` qofa miidha; herrega keessaa yeroo hunda baayinarii dha.

### Barreeffama to’annaa

Barreeffama buufatamu `0` fi `9` `#…#` keessatti barreessi:

```zymbol
#०९#    // Deevanaagaarii   (U+0966–U+096F)
#٠٩#    // Araba-Indik (U+0660–U+0669)
#๐๙#    // Taayii         (U+0E50–U+0E59)
#09#    // askeetooti irradeebi’aa
```

### Baafannaa fi buuleyaan

```zymbol
x = 42
>> x ¶          // → 42   (Askeetooti istaandaardii)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (qoodduu toorbee yeroo hunda Askeetooti dha)
>> 1 + 2 ¶      // → ३

// Buuleyaan: duraa # yeroo hunda Askeetooti dha, baay’inni lakkoofsaa walsima
>> #1 ¶         // → #१   (dhugaa Deevanaagaarii keessatti)
>> #0 ¶         // → #०   (soba — ० lakkoofsa guutuu eeroodhaa adda)

x = 28 > 4
>> x ¶          // → #१   (bu’aan walbira qabuu haala hojiirra oolu hordofa)
```

### Lakkoofsota foxumtuu madda keessatti

Baay’inni lakkoofsaa barreeffama kamiyyuu kan deeggaramu foxumtuuwwan sirriidha — daangawwan, modyuuloo, walbira qabuu keessatti:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Buuleyaan foxumtuu barreeffama kamiitu keessatti

`#` + lakkoofsa `0` ykn `1` cufaatii kamiitii foxumtuu buuleyaan sirriidha:

```zymbol
#٠٩#
hojjechaa = #١        // #1 wajjin walfakkaata
>> hojjechaa ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **yeroo hunda Askeetooti** dha. `#0` (soba) yeroo hunda `0` (lakkoofsa guutuu eeroodhaa) waliin ilaaluu irraa adda ta’a barreeffama keessatti.

---

## Himeentota Daataa

```zymbol
// Jijjiira gosa
f = ##.42         // → 42.0  (roorraf)
i = ###3.7        // → 4     (lakkoofsa guutuu, mara)
t = ##!3.7        // → 3     (lakkoofsa guutuu, ciree)

// Fo’aa gara lakkoofsaatti caccabi
v1 = #|"42"|      // → 42  (lakkoofsa guutuu)
v2 = #|"3.14"|    // → 3.14  (roorraf)
v3 = #|"abc"|     // → "abc"  (nageessa, dogoggorsa hin jiru)

// Mara / Ciree
π = 3.14159265
mara2 = #.2|π|      // → 3.14  (bakka 2 ffaa toorbee mara)
mara4 = #.4|π|      // → 3.1416
ciree2 = #!2|π|      // → 3.14  (ciree)

// Baafannaa lakkoofsaa
baafannaa = #,|1234567|  // → 1,234,567  (kommaan qoodame)
saayinsii = #^|12345.678|    // → 1.2345678e4  (saayinsii)

// Foxumtuuwwan hundee
a = 0x41         // → 'A'  (heeksaa)
b = 0b01000001   // → 'A'  (baayinarii)
c = 0o101        // → 'A'  (oktaal)

// Baafannaa jijjiira hundee
heeksaa = 0x|255|    // → "0x00FF"
baayinarii = 0b|65|     // → "0b1000001"
oktaal = 0o|8|      // → "0o10"
deesiimaalii = 0d|255|    // → "0d0255"
```

---

## Walitti qabamuu Sheelii

```zymbol
guyyaa = <\ date +%Y-%m-%d \>     // stdout qabata (dhumaatti \n dabale)
>> "Har’a: " guyyaa

faayilii = "data.txt"
qabiyyee = <\ cat {faayilii} \>      // seerfama ajajawwan keessatti

baafannaa = </"./subscript.zy"/>   // skiriptii Zymbol biraa hojjechi, baafannaa qabadhu
>> baafannaa
```

> `><` falantoota CLI akka sarara fo’aaatti qabata (tree-walker qofa).

---

## Fakkeenya Guutuu: FizzBuzz

```zymbol
addaan_buu(lakkoofsa) {
    ? lakkoofsa % 15 == 0 { <~ "FizzBuzz" }
    _? lakkoofsa % 3  == 0 { <~ "Fizz" }
    _? lakkoofsa % 5  == 0 { <~ "Buzz" }
    _ { <~ lakkoofsa }
}

@ i:1..20 { >> addaan_buu(i) ¶ }
```

---

## Wabsi Mallattoo

| Mallattoo | Hojii | Mallattoo | Hojii |
|--------|-----------|--------|-----------|
| `=` | jijjiramoo | `$#` | dheerina |
| `:=` | dhaabbata | `$+` | dabali (maxxanfamuu danda’a) |
| `>>` | baafannaa | `$+[i]` | iddoo nammeessaa galchi (1-irratti hundaa’e) |
| `<<` | seensaa | `$-` | tokkoffaa gatiiin baasi |
| `¶` / `\\` | sarara haaraa | `$--` | hunda gatiiin baasi |
| `?` | yoo | `$-[i]` | iddoo nammeessaa baasi (1-irratti hundaa’e) |
| `_?` | yoonmalee-yoo | `$-[i..j]` | daangaa baasi (1-irratti hundaa’e) |
| `_` | yoonmalee / wildcard | `$?` | qaba |
| `??` | walsimsi | `$??` | iddoo nammeessa hunda barbaadi (1-irratti hundaa’e) |
| `@` | marroo | `$[s..e]` | qoqooda (1-irratti hundaa’e) |
| `@ N { }` | marroo N yeroodhaaf | `$>` | map |
| `@!` | cee’i | `$\|` | filter |
| `@>` | itti fufi | `$<` | reduce |
| `@:maqaa { }` | marroo leebula qabu | `$/ qoodduu` | fo’aa qoodi |
| `@:maqaa!` | leebula cee’i | `$++ a b c` | ijaarsa maxxantaa |
| `@:maqaa>` | leebula itti fufi | `arr[i>j>k]` | iddoo nammeessaa agarsisi |
| `->` | lameedaa | `arr[i] = gatii` | wantoota olgadi (sarara qofa) |
| `arr[i] += gatii` | olgadiwwaan walitti dabale | `arr[i]$~` | olgadiwwaan hojii (koopii haaraa) |
| `$^+` | tartee baasi ol (kan durii) | `$^-` | tartee baasi gad (kan durii) |
| `$^` | walbira qabuun tartee baasi (tapulee) | `<~` | deebisi |
| `\|>` | paayipii | `!?` | yaali |
| `:!` | qabadhu | `:>` | xumura irratti |
| `#1` | dhugaa | `#0` | soba |
| `$!` | dogoggorsa | `$!!` | dogoggorsa balleessi |
| `<#` | galchi | `#>` | baasi |
| `#` | mooguyulii labsi | `::` | mooguyulii waam |
| `.` | dirree argachuu | `#?` | meettadeetaa gosa |
| `#\|..\|` | lakkoofsa caccabi | `##.` | gara roorraf jijjiiri |
| `###` | gara lakkoofsa guutuu jijjiiri (mara) | `##!` | gara lakkoofsa guutuu jijjiiri (ciree) |
| `#.N\|..\|` | mara | `#!N\|..\|` | ciree |
| `#,\|..\|` | baafannaa kommaa | `#^\|..\|` | saayinsii |
| `#d0d9#` | haala lakkoofsaa jijjiiri | `#09#` | gara Askeetooti irradeebi’aa |
| `<\ ..\>` | sheelii hojjechi | `>\<` | falantoota CLI |
| `\ jijjiramoo` | jijjiramoo ifatti barbadeessi | `°x` / `x°` | ibsa o’aa (ofii jalqaba) |
| `>>|` | cufaatii TUI (skiriin filannoo) | `>>~` | baafannaa iddoo |
| `>>!` | skiriin qulqulleessi | `>>?` | hamma teerminaalii gaafadhu |
| `<<\|` | buufannaa bufaa cufaa | `<<\|?` | buufannaa bufaa olgadi’uu |
| `@~ N` | N miliseekondii rafi | `$*` | fo’aa N yeroo irradeerami |

---

## Galmee Jijjiirama Baafannaa

### v0.0.5 — Primitives TUI, Ibsa O’aa & Irradeeramuu Fo’aa _(Caamsaa 2026)_

- **Caccabaa** Qoodduu cinaa walsimsi: `caaslugaa : bu’aa` → `caaslugaa => bu’aa`
- **Caccabaa** Maqaa biraa galchii: `<# karaa <= maqaa_biraa` → `<# karaa => maqaa_biraa`
- **Caccabaa** Irradeemamuu maqaa baasuu: `#> { fn <= uumama }` → `#> { fn => uumama }`
- **Dabale** Cufaatii TUI `>>| { }` — skiriin filannoo + haala raw; ba’uu irratti qulqulleessa
- **Dabale** Baafannaa iddoo `>>~ (tarree, kutaa, BKS, fg, bg) > meeshaawwan` — iddoowwan baay’ee, halluuwwan ANSI 256
- **Dabale** Seensa bufaa `<<| jijjiramoo` (cufaa) fi `<<|? jijjiramoo` (baayolessaa cufuu malee)
- **Dabale** `>>!` skiriin qulqulleessi, `>>?` hamma teerminaalii gaafadhu, `@~ N` N miliseekondii rafi
- **Dabale** Ibsa o’aa `°x` / `x°` — jijjiramoo yeroodhaaf jalqaba marroo keessatti ofiinee
- **Dabale** Irradeeramuu fo’aa `fo’aa $* N` — fo’aa tokko N yeroo irradeerami
- **VM** Walqixxummaan: qorannawwan 436/436 darbe

### v0.0.4 — Iddoo Sirreeffamaa 1-irratti Hundaa’e, Hojiiwwan Sadarkaa 1ffaa & Mooguyuliwwan Cufaatii _(Ebla 2026)_

- **Caccabaa** Iddoo sirreeffamaa hunda gara **1-irratti hundaa’e** jijjirame — `arr[1]` wantoota toqqoffaa; `arr[0]` dogoggorsa yeroo hojitti
- **Dabale** Hojiiwwan maqaa qaban **gatiiwwan sadarkaa 1ffaa** dha — ol gadi HOF deebisi: `lakkoofsota$> lamaan_an`
- **Dabale** **Maxxansa cufaatii barbaachisa** mooguyuliif: `# maqaa { ... }` — maxxansa diimaa balleessame
- **Dabale** Iddoo sirreeffamaa sadarkaa hedduu: `arr[i>j>k]` (agarsisi), `arr[p ; q]` (baafannaa diimaa)
- **Dabale** Jijjiira gosa: `##.ibsa` (roorraf), `###ibsa` (lakkoofsa guutuu mara), `##!ibsa` (lakkoofsa guutuu ciree)
- **Dabale** Qooduu fo’aa: `fo’aa$/ qoodduu` — `Array(fo’aa)` deebisa
- **Dabale** Ijaarsa maxxantaa: `hundee$++ a b c` — meeshaawwan hedduu dabala
- **Dabale** Marroo yeroo: `@ N { }` — sirriitti N yeroo irradeerami
- **Dabale** Maxxansa marroo leebula qabu: `@:maqaa { }`, `@:maqaa!`, `@:maqaa>` — bakka `@ @maqaa` / `@! maqaa` buuse
- **Dabale** Seerawwan daangaa jijjiramoo: jijjiramoonni `_maqaa` daangaa cufaatii sirrii qabu; `\ jijjiramoo` yeroo tokko barbadeessa
- **Dabale** Caaslugaan walbira qabuu walsimsi: `< 0 =>`, `> 5 =>`, `== 42 =>`, ati.
- **Dabale** Dogoggorsa mooguyulii E013: yaadawwan raaw’atamuu danda’an dhagna mooguyulii keessatti dhorkamu
- **Sirreesse** `alias.CONST` amma sirriitti furmaata; `#>` booda ibsa hojii dhufuu danda’a
- **VM** Walqixxummaan guutuu: qorannawwan 393/393 darbe

### v0.0.3 — Sirna Lakkoofsaa Unicode fi Fooyya’insa LSP _(Ebla 2026)_

- **Dabale** Cufaatiiwwan lakkoofsota Unicode 69 mallattoo jijjiirama haala `#d0d9#` wajjin
- **Dabale** Foxumtuuwwan buuleyaa barreeffama kamittuu keessatti — `#१` / `#०`, `#१` / `#०`, ati.
- **Dabale** Lakkoofsawwan Kilingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Dabale** Opkoodii VM `SetNumeralMode` — walqixxummaan guutuu tree-walker wajjin
- **Jijjirame** Baafannaa buuleyaa `>>` amma duraa `#` (`#0` / `#1`) haalawwan hunda keessatti dabale

### v0.0.2_01 — Irradeemamuu Maqaa Himeentaa _(30 Bitootessa 2026)_

- **Jijjirame** `c|..|` → `#,|..|` fi `e|..|` → `#^|..|` — walsimsi warra duraa `#` wajjin
- **Dabale** Maqaa biraa baasuu: miseensonni mooguyulii maqaa biraadhaan irradeebi’an

### v0.0.2 — Irradeesaayinii API Walitti Qabeessaa & Faayilaawwan Itti Qabsiisaa _(24 Bitootessa 2026)_

- **Dabale** Warri himeentaa `$` walitti qabame sararaa fi fo’aaaf (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Dabale** Caasluga caccabuu gadi dhaabuu sarara, tapulee, fi tapulee maqaa qabuuf
- **Dabale** Iddoo nammeessaa neggaatiivoo (`arr[-1]` = wantoota dhuma)
- **Dabale** Itti qabsiisaa mootummaa — Liiniksii (deb/rpm/pkg/musl), maakosii (Intel + Apple Silicon), Wiindawuus (MSI, winget)

### v0.0.1-patch _(25 Bitootessa 2026)_

- **Dabale** Gadi dhaabii walitti dabale `^=`
- **Sirreesse** Caccabaa herregaa dhumaa; sirreessa waraqaa

### v0.0.1 — Baafannaa Uumama Duraa _(22 Bitootessa 2026)_

- Caccabaa tree-walker + VM galmeessaa (`--vm`, ~4× saffisaa, ~95% walqixxummaan)
- Ijaarsa ijoo hunda: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Addangaawwan Unicode guutuu, sirna mooguyulii, lameejuuwwan, cuftanii, sirreessuu dogoggorsa
- REPL, LSP, dabalata VS Code, baayolessaan (`zymbol fmt`)

---

_Zymbol-Lang — Kan mallattoo. Kan addunyaa. Hin jijjiiramne._
