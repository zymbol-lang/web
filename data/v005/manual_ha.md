> **Rashin alhaki:** Wannan takardar an ƙirƙira ta kuma an fassara ta da hankali na wucin gadi (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Madogarar canonical ita ce **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** a cikin ma'ajiyar fassarar.

---

# Jagorar Zymbol-Lang

> **An sake duba don v0.0.5 — 2026-05-14**

**Zymbol-Lang** harshe ne na shirye-shirye na alama. Babu kalmomin maɓalli — komai alama ce. Yana aiki iri ɗaya a kowane harshe na ɗan adam.

- Babu `if`, `while`, `return` — `?`, `@`, `<~` kawai
- Cikakken Unicode — masu ganowa a kowane harshe ko emoji
- Rashin dogaro da harshen ɗan adam — lambar tana aiki iri ɗaya a ko'ina

**Siffar Fassarar**: v0.0.5 | **Murfin Gwaji**: 436/436 (daidaiton TW ↔ VM)

---

## Maɓallai da Madawwama

```zymbol
x = 10              // maɓalli mai canzawa
π := 3.14159        // madawwami — sake yiwa aiki kuskure ne a lokacin aiki
suna = "Alice"
aiki = #1         // boolean gaskiya
👋 := "Sannu"
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

`°` (alamar digiri, U+00B0) yana fara maɓalli ta atomatik zuwa darajarsa ta tsaka tsaki a amfani na farko:

```zymbol
lambobi = [3, 1, 4, 1, 5]
@ n:lambobi {
    °jimla += n    // fara atomatik zuwa 0 saman madauki; yana rayuwa bayan @
}
>> jimla ¶         // → 14
```

> `°x` (prefix) yana ɗora sama da madauki — sakamako yana samuwa bayan `@`.
> `x°` (postfix) yana ɗora cikin madauki — yana mutuwa idan madauki ya ƙare.
> tree-walker kawai.

---

## Nau'ukan Bayanai

| Nau'in | Zahiri | Alamar `#?` | Bayani |
|------|---------|----------|---------|
| Lamba gabadaya | `42`, `-7` | `###` | 64-bit mai alama |
| Masauniyar ruwa | `3.14`, `1.5e10` | `##.` | Alamar kimiyya an halatta |
| Zari | `"rubutu"` | `##"` | Saka ciki: `"Sannu {suna}"` |
| Harafi | `'A'` | `##'` | Harafin Unicode guda ɗaya |
| Boolean | `#1`, `#0` | `##?` | Ba lamba ba — `#1 ≠ 1` |
| Tsararru | `[1, 2, 3]` | `##]` | Abubuwa iri ɗaya |
| Tupul | `(a, b)` | `##)` | Matsayi |
| Tupul mai suna | `(x: 1, y: 2)` | `##)` | Filaye masu suna |
| Aiki | nunin aiki mai suna | `##()` | Matsayi na farko; yana nuna `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Matsayi na farko; yana nuna `<lambd/N>` |

```zymbol
// Binciken nau'in — yana mayar (nau'in, lambobi, daraja)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Fitarwa da Shigarwa

```zymbol
>> "Sannu" ¶                       // ¶ ko \\ don sabon layi bayyananne
>> "a=" a " b=" b ¶               // juxtaposition — dardajoji masu yawa
>> (arr$#) ¶                      // ma'aikatan postfix suna buƙatar ( ) a cikin >>

>> suna                           // karanta cikin maɓalli (ba tare da faɗakarwa ba)
>> "Shigar da suna: " suna            // tare da faɗakarwa
```

> `¶` (AltGr+R a kan maballin Sifen) da `\\` sababbin layuka daidai suke.

---

## Mahimman TUI

Ma'aikatan mu'amalar mai amfani ta tashar don shirye-shirye masu mu'amala. Yawancin suna buƙatar toshe `>>| { }` (allon madadin + yanayin ɗanye).

```zymbol
>>| {
    >>!                             // share allon madadin
    >>~ (1, 1, 0, 10) > "Yana aiki"   // jere 1, ginshiƙi 1, fg=10 (kore)
    @~ 1000                         // dakata da daƙiƙa 1 (1000 ms)
    >>~ (2, 1) > "An kammala."
}
// tashar tana dawowa ta atomatik lokacin fita
```

```zymbol
// Maɓallin dannawa da girman tashar
>>| {
    [jeruka, ginshiƙai] = >>?              // tambayi girman tashar
    >>~ (1, 1) > "Tashar: " jeruka " x " ginshiƙai
    <<| maɓalli                         // karanta dannawar maɓalli mai toshewa
    >>~ (2, 1) > "Ka danna: " maɓalli
}
```

> `>>!` yana share allo. `>>?` yana mayar `[jeruka, ginshiƙai]`. `@~ N` yana barci N millisekan.
> `<<|` yana karanta dannawar maɓalli ɗaya (mai toshewa); `<<|?` yana bincike ba tare da toshewa ba (yana mayar `'\0'` idan babu).
> Tupul na fitarwa mai matsayi: `(jere, ginshiƙi, BKS, fg, bg)` — ana iya barin kowane wuri da waƙafi (`>>~ (,,, 196) > "ja"`).
> BKS bitmask: `1`=mai ƙarfi, `2`=mai karkata, `4`=layin ƙasa. Palet 256 launuka na ANSI (`0`=tsoho na tashar).
> tree-walker kawai (ban da `>>!`, `>>?`, `@~`, `>>~` waɗanda suma suna aiki a `--vm`).

---

## Ma'aikata

```zymbol
// Ilimin lissafi
a = 10
b = 3
s1 = a + b    // 13
s2 = a - b    // 7
s3 = a * b    // 30
s4 = a / b    // 3  (rabon lamba gabadaya)
s5 = a % b    // 1
s6 = a ^ b    // 1000  (ɗagawa)

// Kwatantawa — sanya don dubawa
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a <= b    // #0
k5 = a > b     // #1
k6 = a >= b    // #1

// Ma'ana
m1 = #1 && #0    // #0
m2 = #1 || #0    // #1
m3 = !#1         // #0
```

---

## Zari

```zymbol
// Siffofin haɗin kai guda biyu
suna = "Alice"
n = 42

>> "Sannu " suna " kana da " n ¶       // juxtaposition — a cikin >>
bayani = "Sannu {suna}, kana da {n}"     // saka ciki — ko'ina
```

```zymbol
s = "Sannu duniya"
tsawo = s$#                  // 11
ɓangaren = s$[1..5]             // "Sannu"  (1-tushe, ƙarshe an haɗa)
yana = s$? "duniya"          // #1
sassa = "a,b,c,d"$/ ','   // [a, b, c, d]  (raba da mai rabawa)
maye = s$~~["l":"r"]        // "Sannu duniya" (babu 'l' a cikin Hausa)
maye1 = s$~~["l":"r":1]     // "Sannu duniya"
layi = "─" $* 20           // "────────────────────"  (maimaita N sau)
```

> `+` na lambobi ne kawai. Don zari, yi amfani da `,`, juxtaposition, ko saka ciki.

---

## Sarrafa Gudu

```zymbol
x = 7

? x > 0 { >> "tabbatacce" ¶ }

? x > 100 {
    >> "babba" ¶
} _? x > 0 {
    >> "tabbatacce" ¶
} _? x == 0 {
    >> "sifili" ¶
} _ {
    >> "korau" ¶
}
```

> Ƙuƙwalwar {} **wajibi ne** ko da don bayani ɗaya.

---

## Daidaitawa

```zymbol
// Iyakoki
maki = 85
daraja = ?? maki {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> daraja ¶    // → B

// Zari
launi = "ja"
lamba = ?? launi {
    "ja"   => "#FF0000"
    "kore" => "#00FF00"
    _       => "#000000"
}

// Sifofin kwatantawa
zazzabi = -5
hali = ?? zazzabi {
    < 0  => "ƙanƙara"
    < 20 => "sanyi"
    < 35 => "dumi"
    _    => "zafi"
}
>> hali ¶    // → ƙanƙara

// Siffar bayani (hannayen toshe)
n = -3
?? n {
    0    => { >> "sifili" ¶ }
    < 0  => { >> "korau" ¶ }
    _    => { >> "tabbatacce" ¶ }
}
```

---

## Madaukai

```zymbol
@ i:0..4  { >> i " " }        // iyako da aka haɗa:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tare da mataki:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // juye:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (yayin da)

yayanitace = ["tuffa", "pear", "innabi"]
@ ya:yayanitace { >> ya ¶ }         // ga kowane abu a cikin tsararru

@ h:"hello" { >> h "-" }
>> ¶                          // → h-e-l-l-o-  (ga kowane harafi a cikin zari)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> ci gaba
    ? i > 7 { @! }             // @! karya
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Madauki mara iyaka
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Madauki mai lakabi (karya mai gida)
ƙidaya = 0
@:waje {
    ƙidaya++
    ? ƙidaya >= 3 { @:waje! }
}
>> ƙidaya ¶                    // → 3
```

---

## Ayyuka

```zymbol
ƙara(a, b) { <~ a + b }
>> ƙara(3, 4) ¶    // → 7

fakto (n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakto (n - 1)
}
>> fakto (5) ¶    // → 120
```

Ayyuka suna da **keɓewar iyaka** — ba za su iya karanta maɓallan waje ba. Yi amfani da sigogin fitarwa `<~>` don gyara maɓallan mai kira:

```zymbol
musanya (a<~, b<~) {
    wucin_gadi = a
    a = b
    b = wucin_gadi
}
x = 10
y = 20
musanya (x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ayyuka masu suna **darajoji ne na matsayi na farko** — aika kai tsaye: `lambobi$> ninki biyu`. Don nade: `x -> fn(x)` shima yana aiki.

---

## Lambda da Rufewa

```zymbol
ninki_biyu = x -> x * 2
ƙara = (a, b) -> a + b
>> ninki_biyu(5) ¶    // → 10
>> ƙara(3, 7) ¶  // → 10

// Lambda na toshe
rarrabawa = x -> {
    ? x > 0 { <~ "tabbatacce" }
    _? x < 0 { <~ "korau" }
    <~ "sifili"
}

// Rufewa — yana kama iyakar waje
ma'auni = 3
ninki_uku = x -> x * ma'auni
>> ninki_uku(7) ¶    // → 21

// Masana'anta
mai_yin_ƙara (n) { <~ x -> x + n }
ƙara_goma = mai_yin_ƙara (10)
>> ƙara_goma(5) ¶    // → 15

// A cikin tsararru
ma'aikata = [x -> x+1, x -> x*2, x -> x*x]
>> ma'aikata[3](5) ¶    // → 25
```

---

## Tsararru

Tsararru **masu canzawa** ne kuma suna ƙunshe da abubuwa **na nau'in ɗaya**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — isa ga (1-tushe: abu na farko)
x = arr[-1]     // 5 — fihirisa mara kyau (abu na ƙarshe)
x = arr$#       // 5 — tsawo (yi amfani da (arr$#) a cikin >>)

arr = arr$+ 6            // ƙara → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // saka a wuri na 2 (1-tushe)
arr3 = arr$- 3           // cire faruwar farko ta darajar
arr4 = arr$-- 3          // cire duk faruwar
arr5 = arr$-[1]          // cire a fihirisa 1 (abu na farko)
arr6 = arr$-[2..3]       // cire iyako (1-tushe, ƙarshe an haɗa)

yana = arr$? 3            // #1 — yana ƙunshe
wurare = arr$?? 3           // [3] — duk fihirisar darajar (1-tushe)
yanki = arr$[1..3]          // [1,2,3] — yanki (1-tushe, ƙarshe an haɗa)
yanki2 = arr$[1:3]          // [1,2,3] — iri ɗaya, nahawun tushen ƙidaya

hawa = arr$^+             // jeri hawa (na farko kawai)
sauka = arr$^-            // jeri sauka (na farko kawai)

// Tsararrun tupul masu suna/matsayi — yi amfani da $^ tare da lambda mai kwatantawa
db = [(suna: "Carla", shekaru: 28), (suna: "Ana", shekaru: 25), (suna: "Bob", shekaru: 30)]
bisa_shekaru  = db$^ (a, b -> a.shekaru < b.shekaru)    // bisa shekaru hawa (<)
bisa_suna = db$^ (a, b -> a.suna > b.suna)   // bisa suna sauka (>)
>> bisa_shekaru[1].suna ¶     // → Ana
>> bisa_suna[1].suna ¶    // → Carla

// Sabunta abu kai tsaye (tsararru kawai)
arr[1] = 99              // sanya
arr[2] += 5              // haɗe: +=  -=  *=  /=  %=  ^=

// Sabuntawa na aiki — yana mayar da sabon tsararru; asali baya canzawa
arr2 = arr[2]$~ 99
```

> Duk ma'aikatan tarawa suna mayar da **sabon tsararru**. Sanya baya: `arr = arr$+ 4`.
> `$+` ana iya ɗaura shi: `arr = arr$+ 5$+ 6$+ 7`. Sauran ma'aikata suna amfani da sanya tsakani.
> **Sanya fihirisa 1-tushe**: `arr[1]` shine abu na farko; `arr[0]` kuskure ne a lokacin aiki.
> `$^+` / `$^-` suna jeri **tsararrun farko** (lambobi, zari). Don tsararrun tupul, yi amfani da `$^` tare da lambda mai kwatantawa — kwatance yana cikin lambda (`<` = hawa, `>` = sauka).

**Maanantar daraja** — sanya tsararru zuwa wani maɓalli yana haifar da kwafi mai zaman kansa:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b bai shafa ba
```

```zymbol
// Tsararru masu gida (sanya fihirisa 1-tushe)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (jere 2, ginshiƙi 3)
```

---

## Rushe Tsari

```zymbol
// Tsararru
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[na_farko, *raguwa] = arr         // na_farko=10  raguwa=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ yana watsi

// Tupul na matsayi
aya = (100, 200)
(px, py) = aya             // px=100  py=200

// Tupul mai suna
mutum = (suna: "Ana", shekaru: 25, birni: "Madrid")
(suna: n, shekaru: s) = mutum   // n="Ana"  s=25
```

---

## Tupul

Tupul kwantena ne masu tsari **marasa canzawa** waɗanda zasu iya ɗaukar darajoji na **nau'uka daban-daban**.
Ba kamar tsararru ba, abubuwa ba za su iya canzawa ba bayan ƙirƙirarsu.

```zymbol
// Matsayi — an halatta nau'uka masu gauraya
aya = (10, 20)
>> aya[1] ¶    // → 10

bayanai = (42, "Sannu", #1, 3.14)
>> bayanai[3] ¶     // → #1

// Mai suna
mutum = (suna: "Alice", shekaru: 25)
>> mutum.suna ¶    // → Alice
>> mutum[1] ¶      // → Alice  (fihirisa ma tana aiki, 1-tushe)

// Mai gida
wuri = (x: 10, y: 20)
p = (wuri: wuri, lakabi: "asali")
>> p.wuri.x ¶        // → 10
```

**Rashin canzawa** — duk wani ƙoƙari na gyara abun tupul kuskure ne a lokacin aiki:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kuskure a lokacin aiki: tupul ba su canzawa
// t[1] += 5    // ❌ kuskure iri ɗaya
```

Don samun darajar da aka gyara yi amfani da `$~` (sabuntawa na aiki) — yana mayar da **sabon tupul**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asali bai canza ba
>> t2 ¶    // → (10, 999, 30)

// Tupul mai suna — sake ginawa a bayyane
mutum = (suna: "Alice", shekaru: 25)
babba  = (suna: mutum.suna, shekaru: 26)
>> mutum.shekaru ¶    // → 25
>> babba.shekaru ¶     // → 26
```

---

## Ayyuka Masu Girman Daraja

```zymbol
lambobi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ninki_biyu  = lambobi$> (x -> x * 2)                  // map  → [2,4,6…20]
ko_daidai    = lambobi$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
jimla    = lambobi$< (0, (maigida, x) -> maigida + x)     // reduce → 55

// Sarka ta hanyar masu tsakani
mataki1 = lambobi$| (x -> x > 3)
mataki2 = mataki1$> (x -> x * x)
>> mataki2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ana iya aika ayyuka masu suna kai tsaye zuwa HOF
ninki_biyu(x) { <~ x * 2 }
babba_ne(x) { <~ x > 5 }
r = lambobi$> ninki_biyu       // ✅ nunin kai tsaye
r = lambobi$| babba_ne       // ✅ nunin kai tsaye
```

---

## Ma'aikacin Bututu

Gefen dama koyaushe yana buƙatar `_` a matsayin mai riƙe wuri don darajar da aka bututu:

```zymbol
ninki_biyu = x -> x * 2
ƙara = (a, b) -> a + b
haɓaka = x -> x + 1

s1 = 5 |> ninki_biyu(_)        // → 10
s2 = 10 |> ƙara(_, 5)       // → 15
s3 = 5 |> ƙara(2, _)        // → 7

// Daure
s = 5 |> ninki_biyu(_) |> haɓaka(_) |> ninki_biyu(_)
>> s ¶    // → 22  (5→10→11→22)
```

---

## Sarrafa Kurakurai

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "rabawa da sifili" ¶
} :! {
    >> "wani: " _err ¶    // _err yana riƙe saƙon kuskure
} :> {
    >> "koyaushe yana aiki" ¶
}
```

| Nau'in | Lokacin |
|------|------|
| `##Div` | Rabawa da sifili |
| `##IO` | Fayil / tsarin |
| `##Index` | Fihirisa a waje da iyaka |
| `##Type` | Rashin daidaituwar nau'in |
| `##Parse` | Ƙirƙirar bayanai |
| `##Network` | Kurakuran hanyar sadarwa |
| `##_` | Duk wani kuskure (kama-duk) |

---

## Modules

```zymbol
// lib/calc.zy — jikin module an rufe shi a cikin ƙuƙwalwa
# calc {
    #> { ƙara, get_PI }

    _π := 3.14159
    ƙara(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // ana buƙatar laƙabi

>> c::ƙara(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Fitarwa da wani suna na jama'a daban
# mylib {
    #> { _ƙara_na_ciki => jimla }

    _ƙara_na_ciki(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::jimla(3, 4) ¶    // → 7  (sunan ciki _ƙara_na_ciki yana ɓoye)
```

> **Dokokin module**: a cikin `# suna { }`, `#>`, ma'anar ayyuka, da masu fara maɓalli/madawwami na zahiri kawai aka halatta. Bayanan da za a iya aiwatarwa (`>>`, `<<`, madaukai, da sauransu) suna haifar da kuskure E013.

---

## Yanayin Lambobi

Zymbol na iya nuna lambobi a cikin **rubutun lambobi 69 na Unicode** — Devanagari, Larabci-Indic, Thai, Klingon pIqaD, Maƙarƙashiyar Lissafi, sassan LCD, da ƙari. Yanayin aiki yana shafar fitarwar `>>` kawai; lissafin ciki koyaushe binary ne.

### Kunna rubutun

Rubuta lambobin `0` da `9` na rubutun da aka yi niyya a cikin `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Larabci-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // sake saiti zuwa ASCII
```

### Fitowa da booleans

```zymbol
x = 42
>> x ¶          // → 42   (tsoho na ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ma'anar goma koyaushe ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: prefix # koyaushe ASCII, lambar tana daidaitawa
>> #1 ¶         // → #१   (gaskiya a Devanagari)
>> #0 ¶         // → #०   (ƙarya — ya bambanta da ० sifili na lamba)

x = 28 > 4
>> x ¶          // → #१   (sakamakon kwatantawa yana bin yanayin aiki)
```

### Lambobin zahiri na asali a cikin tushe

Lambobin kowane rubutun da aka tallafa suna aiki ne — a cikin iyakoki, modulo, kwatantawa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booleans na zahiri a kowane rubutu

`#` + lambobi `0` ko `1` daga kowane toshe halal ne na zahiri na boolean:

```zymbol
#٠٩#
aiki = #١        // daidai da #1
>> aiki ¶        // → #१
>> (#١ && #٠) ¶ // → #०
```

> `#` **koyaushe ASCII** ne. `#0` (ƙarya) koyaushe yana bambanta da gani da `0` (sifili na lamba) a kowane rubutu.

---

## Ma'aikatan Bayanai

```zymbol
// Juyar da nau'in
f = ##.42         // → 42.0  (zuwa masauniyar ruwa)
i = ###3.7        // → 4     (zuwa lamba gabadaya, zagaye)
t = ##!3.7        // → 3     (zuwa lamba gabadaya, yanke)

// Fassara zari zuwa lamba
v1 = #|"42"|      // → 42  (lamba gabadaya)
v2 = #|"3.14"|    // → 3.14  (masauniyar ruwa)
v3 = #|"abc"|     // → "abc"  (lafiya, babu kuskure)

// Zagaye / Yanke
π = 3.14159265
zagaye2 = #.2|π|      // → 3.14  (zagaye zuwa wurare 2 na goma)
zagaye4 = #.4|π|      // → 3.1416
yanke2 = #!2|π|      // → 3.14  (yanke)

// Tsara lambobi
tsari = #,|1234567|  // → 1,234,567  (waƙafi-rabewa)
kimiyya = #^|12345.678|    // → 1.2345678e4  (kimiyya)

// Lambobin tushe
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Fitowar juyar da tushe
hex = 0x|255|    // → "0x00FF"
binary = 0b|65|     // → "0b1000001"
octal = 0o|8|      // → "0o10"
decimal = 0d|255|    // → "0d0255"
```

---

## Haɗin Shell

```zymbol
kwanan_wata = <\ date +%Y-%m-%d \>     // yana kama stdout (ya haɗa da \n a ƙarshe)
>> "Yau: " kwanan_wata

fayil = "data.txt"
abun_ciki = <\ cat {fayil} \>      // saka ciki a cikin umarni

fitarwa = </"./subscript.zy"/>   // aiwatar da wani rubutun Zymbol, kama fitarwa
>> fitarwa
```

> `><` yana kama muhawarorin CLI azaman tsararru na zari (tree-walker kawai).

---

## Cikakken Misali: FizzBuzz

```zymbol
rarrabawa(lamba) {
    ? lamba % 15 == 0 { <~ "FizzBuzz" }
    _? lamba % 3  == 0 { <~ "Fizz" }
    _? lamba % 5  == 0 { <~ "Buzz" }
    _ { <~ lamba }
}

@ i:1..20 { >> rarrabawa(i) ¶ }
```

---

## Manazarta Alama

| Alama | Aiki | Alama | Aiki |
|--------|-----------|--------|-----------|
| `=` | maɓalli | `$#` | tsawo |
| `:=` | madawwami | `$+` | ƙara (mai ɗaura) |
| `>>` | fitarwa | `$+[i]` | saka a fihirisa (1-tushe) |
| `<<` | shigarwa | `$-` | cire na farko bisa daraja |
| `¶` / `\\` | sabon layi | `$--` | cire duka bisa daraja |
| `?` | idan | `$-[i]` | cire a fihirisa (1-tushe) |
| `_?` | in ba haka ba-idan | `$-[i..j]` | cire iyako (1-tushe) |
| `_` | in ba haka ba / katin daji | `$?` | ya ƙunshi |
| `??` | daidaita | `$??` | nemo duk fihirisa (1-tushe) |
| `@` | madauki | `$[s..e]` | yanki (1-tushe) |
| `@ N { }` | madauki N sau | `$>` | map |
| `@!` | karya | `$\|` | filter |
| `@>` | ci gaba | `$<` | reduce |
| `@:suna { }` | madauki mai lakabi | `$/ mai rabawa` | raba zari |
| `@:suna!` | karya lakabi | `$++ a b c` | ginin haɗawa |
| `@:suna>` | ci gaba lakabi | `arr[i>j>k]` | fihirisar kewayawa |
| `->` | lambda | `arr[i] = daraja` | sabunta abu (tsararru kawai) |
| `arr[i] += daraja` | sabuntawar haɗe | `arr[i]$~` | sabuntawar aiki (kwafi sabo) |
| `$^+` | jeri hawa (na farko) | `$^-` | jeri sauka (na farko) |
| `$^` | jeri tare da mai kwatantawa (tupul) | `<~` | mayar |
| `\|>` | bututu | `!?` | gwada |
| `:!` | kama | `:>` | daga ƙarshe |
| `#1` | gaskiya | `#0` | ƙarya |
| `$!` | kuskure ne | `$!!` | yada kuskure |
| `<#` | shigo da | `#>` | fitar |
| `#` | ayyana module | `::` | kira module |
| `.` | isa ga filin | `#?` | metadata na nau'in |
| `#\|..\|` | fassara lamba | `##.` | juye zuwa masauniyar ruwa |
| `###` | juye zuwa lamba gabadaya (zagaye) | `##!` | juye zuwa lamba gabadaya (yanke) |
| `#.N\|..\|` | zagaye | `#!N\|..\|` | yanke |
| `#,\|..\|` | tsarin waƙafi | `#^\|..\|` | kimiyya |
| `#d0d9#` | canza yanayin lambobi | `#09#` | sake saiti zuwa ASCII |
| `<\ ..\>` | aiwatar da shell | `>\<` | muhawarorin CLI |
| `\ maɓalli` | lalata maɓalli a bayyane | `°x` / `x°` | ma'anar zafi (fara atomatik) |
| `>>|` | toshe TUI (allon madadin) | `>>~` | fitarwa mai matsayi |
| `>>!` | share allo | `>>?` | tambayi girman tashar |
| `<<\|` | dannawar maɓalli mai toshewa | `<<\|?` | binciken dannawar maɓalli mara toshewa |
| `@~ N` | barci N millisekan | `$*` | maimaita zari N sau |

---

## Tarihin Canje-canjen Saki

### v0.0.5 — Mahimman TUI, Ma'anar Zafi & Maimaita Zari _(Mayu 2026)_

- **Mai karyawa** Mai raba hannun daidaitawa: `tsari : sakamako` → `tsari => sakamako`
- **Mai karyawa** Laƙabin shigo da: `<# hanya <= laƙabi` → `<# hanya => laƙabi`
- **Mai karyawa** Sake sunan fitarwa: `#> { fn <= jama'a }` → `#> { fn => jama'a }`
- **An ƙara** Toshe TUI `>>| { }` — allon madadin + yanayin ɗanye; yana sharewa lokacin fita
- **An ƙara** Fitarwa mai matsayi `>>~ (jere, ginshiƙi, BKS, fg, bg) > abubuwa` — wurare marasa yawa, launuka 256 na ANSI
- **An ƙara** Shigar da maɓalli `<<| maɓalli` (mai toshewa) da `<<|? maɓalli` (binciken mara toshewa)
- **An ƙara** `>>!` share allo, `>>?` tambayi girman tashar, `@~ N` barci N millisekan
- **An ƙara** Ma'anar zafi `°x` / `x°` — fara maɓalli ta atomatik a amfani na farko a cikin madaukai
- **An ƙara** Maimaita zari `zari $* N` — maimaita zari N sau
- **VM** Daidaito: gwaje-gwaje 436/436 sun wuce

### v0.0.4 — Sanya Fihirisa 1-tushe, Ayyukan Matsayi Na Farko & Modules na Toshe _(Afrilu 2026)_

- **Mai karyawa** An canza duk sanya fihirisa zuwa **1-tushe** — `arr[1]` shine abu na farko; `arr[0]` kuskure ne a lokacin aiki
- **An ƙara** Ayyuka masu suna **darajoji ne na matsayi na farko** — aika kai tsaye zuwa HOF: `lambobi$> ninki_biyu`
- **An ƙara** **Nahawun toshe wajibi ne** don modules: `# suna { ... }` — an cire nahawun lebur
- **An ƙara** Sanya fihirisa mai girma dabam: `arr[i>j>k]` (kewayawa), `arr[p ; q]` (hakowa lebur)
- **An ƙara** Juyar da nau'in: `##.magana` (masauniyar ruwa), `###magana` (lamba gabadaya zagaye), `##!magana` (lamba gabadaya yanke)
- **An ƙara** Rabar zari: `zari$/ mai rabawa` — yana mayar `Array(zari)`
- **An ƙara** Ginin haɗawa: `tushe$++ a b c` — yana ƙara abubuwa da yawa
- **An ƙara** Madaukin sau: `@ N { }` — maimaita daidai N sau
- **An ƙara** Nahawun madauki mai lakabi: `@:suna { }`, `@:suna!`, `@:suna>` — ya maye gurbin `@ @suna` / `@! suna`
- **An ƙara** Dokokin iyakar maɓalli: maɓallan `_suna` suna da iyakar toshe daidai; `\ maɓalli` yana lalata da wuri
- **An ƙara** Sifofin kwatantawa na daidaitawa: `< 0 =>`, `> 5 =>`, `== 42 =>` da sauransu
- **An ƙara** Kuskuren module E013: bayanan da za a iya aiwatarwa a jikin module an haramta su
- **An gyara** `alias.CONST` yanzu yana warwarewa daidai; `#>` na iya bayyana bayan ma'anar ayyuka
- **VM** Cikakken daidaito: gwaje-gwaje 393/393 sun wuce

### v0.0.3 — Tsarin Lambobi na Unicode & Haɓakawa na LSP _(Afrilu 2026)_

- **An ƙara** Toshe 69 na lambobin Unicode tare da alamar canza yanayin `#d0d9#`
- **An ƙara** Booleans na zahiri a kowane rubutu — `#१` / `#०`, `#١` / `#٠`, da sauransu
- **An ƙara** Lambobin Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **An ƙara** Opcode na VM `SetNumeralMode` — cikakken daidaito tare da tree-walker
- **An canza** Fitarwar boolean `>>` yanzu ta haɗa da prefix `#` (`#0` / `#1`) a duk yanayin

### v0.0.2_01 — Canjin Sunan Ma'aikaci _(30 Maris 2026)_

- **An canza** `c|..|` → `#,|..|` da `e|..|` → `#^|..|` — don daidaitawa da dangin prefix `#`
- **An ƙara** Laƙabin fitarwa: sake fitar da membobin module a wani suna daban

### v0.0.2 — Sake Tsara API na Tarawa & Masu Saka _(24 Maris 2026)_

- **An ƙara** dangin ma'aikata `$` mai haɗe don tsararru da zari (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **An ƙara** Sanya rushe tsari don tsararru, tupul, da tupul masu suna
- **An ƙara** Fihirisa mara kyau (`arr[-1]` = abu na ƙarshe)
- **An ƙara** Masu saka na asali — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maris 2026)_

- **An ƙara** Sanya haɗe `^=`
- **An gyara** Abubuwan gefen lissafi na mai fassara; gyare-gyaren takardu

### v0.0.1 — Saki Na Farko Ga Jama'a _(22 Maris 2026)_

- Mafassarin tree-walker + VM na rijista (`--vm`, ~4× sauri, ~95% daidaito)
- Duk gine-ginen asali: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Cikakkun masu ganowa na Unicode, tsarin module, lambdas, rufewa, sarrafa kuskure
- REPL, LSP, kari na VS Code, mai tsarawa (`zymbol fmt`)

---

_Zymbol-Lang — Alama. Duniya. Mara canzawa._
