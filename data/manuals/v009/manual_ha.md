> **Sanarwa:** An ƙirƙira wannan takaddun kuma an fassara shi da basirar wucin gadi (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Babban bayani na asali shine **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** a cikin ma'ajiyar mai fassara.

---

# Littafin Jagora na Zymbol-Lang

> **An sake dubawa don v0.0.9 — 2026-09-07**

**Zymbol-Lang** harshe ne na shirye-shirye na alama. Babu kalmomi a cikin nahawunsa — kowane gini alama ce. Yana aiki iri ɗaya a kowane harshen ɗan adam.

- Babu `if`, `while`, `return` — kawai `?`, `@`, `<~`
- Cikakken Unicode — masu ganowa a kowane harshe ko emoji
- Ba ya dogara da harshen ɗan adam — lambar iri ɗaya ce a ko'ina

**Sigar mai fassara**: v0.0.9 | **Rufe gwaji**: 660/666 (injin uku sun yarda, 0 sun bambanta)

---

## Masu Canji da Tsayayyu

```zymbol
x = 10              // mai canji mai iya canzawa
PI := 3.14159       // tsayayye — sake sanyawa kuskure ne na lokacin aiki
suna = "Bello"
aiki = #1           // boolean gaskiya
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
x++       // 5
x--       // 4
```

`°` (alamar digiri, U+00B0) tana fara mai canji kai tsaye zuwa ƙimarsa ta tsaka-tsaki a amfani na farko:

```zymbol
lambobi = [3, 1, 4, 1, 5]
@ n:lambobi {
    °jimla += n
}
>> jimla ¶              // → 14
```

> `°mai_canji` (prefix) yana angare sama da madauki — sakamakon yana iya karantawa bayan `@`.
> `mai_canji°` (suffix) yana angare cikin madauki — yana mutuwa idan madauki ya ƙare.

Bayani wanda suna kawai ya kasance yana karanta mai canji kuma yana jefar da ƙimar, don haka yana gargaɗi:

```zymbol
lissafi = 5
lissafi
```

Mai haɗawa yana gargaɗi kamar haka (saƙonninsa koyaushe cikin Turanci ne):

```text
warning: this statement does nothing: 'lissafi' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Ma'ana: *«wannan bayani ba ya yin komai: an karanta 'lissafi' kuma an jefar da shi»*.

---

## Nau'ikan Bayanai

| Nau'i | Rubutu | Alamar `#?` | Bayani |
|------|---------|----------|-------|
| Cikakken lamba | `42`, `-7` | `###` | Cikakkiyar lamba mai aminci: ±(2⁵³ − 1) |
| Lamba mai iyo | `3.14`, `1.5e10` | `##.` | IEEE-754 ninki biyu |
| Zare | `"rubutu"` | `##"` | Saɓawa: `"Sannu {suna}"` |
| Harafi | `'A'` | `##'` | Lambar Unicode ɗaya |
| Boolean | `#1`, `#0` | `##?` | BA lamba ba — `#1 ≠ 1` |
| Jeri | `[1, 2, 3]` | `##]` | Nau'i ɗaya, an bincika |
| Cakuda da aka ayyana | `#[1, "biyu"]` | `##[` | Nau'i ɗaya da `[…]`, ba a bincika |
| Tufa | `(a, b)` | `##)` | Matsayi, ba ya canzawa |
| Kamus | `#(x: 1, y: 2)` | `##(` | Mai maɓalli, mai iya canzawa |
| Aiki | nuni ga aiki mai suna | `##()` | Aji na farko; yana nuna `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Aji na farko; yana nuna `<lambd/N>` |
| Raka'a | `##_` | `##_` | Rashin — babu null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Cikakkiyar lamba da ta fita daga kewayon aminci kuskure ne da za a iya kamawa, ba kai tsaye ba:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "bayan kewayo" ¶ // → bayan kewayo
}
```

`##_` ita ce hanyar da shiri yake tambaya ko wani abu ba ya nan:

```zymbol
babu_komai() { }
ƙima = babu_komai()
>> (ƙima == ##_) ¶     // → #1
```

---

## Fitarwa da Shigarwa

```zymbol
suna = "Bello"
jimla = 3
>> "Sannu" ¶             // → Sannu
>> "a=" suna " b=" jimla ¶ // → a=Bello b=3
>> jimla#? ¶            // → (###, 1, 3)
```

```zymbol
<< suna
<< "Shigar da sunanka: " suna
<< ###(4) "Shekaru: " shekaru
```

**Duba siffar alamomin biyu.** `>>` yana nuni waje: yana fitar da bayanai daga shirin. `<<` yana nuni ciki: yana shigar da bayanai cikin shirin. Babu abin da za a tuna a nan — kibiya tana nuna inda bayanai suke tafiya, kuma wannan ra'ayi ɗaya yana dawowa a kowace alama da ke motsa wani abu.

> `¶` da `\\` sabbin layuka ne daidai. `>>` ba ya ƙara ɗaya.
> Mai ƙayyade nau'i kafin faɗakarwa yana tabbatarwa yayin karantawa kuma yana sake tambaya har ƙimar ta inganta:
> `##.` Lamba mai iyo · `##.(T,D)` goma · `###(N)` Cikakkiyar lamba · `##"(N)"` rubutu · `##'` Harafi ɗaya.

A matakin sama na fayil, `<~>` ita ce matsayin fita na shirin:

```zymbol
>> "nazartawa" ¶      // → nazartawa
<~ 0
```

---

## Ainihin TUI

Ma'aikatan mu'amalar tashar jiragen ruwa don shirye-shirye masu hulɗa. Mafi yawansu suna buƙatar toshe `>>| { }` (allon madadin + yanayin danye).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Yana gudana"
    @~ 1000
    >>~ (2, 1) > "An gama."
}
```

```zymbol
>>| {
    [layuka, ginshiƙai] = >>?
    >>~ (1, 1) > "Tasha: " layuka " x " ginshiƙai
    <<| maɓalli
    >>~ (2, 1) > "An danna: " maɓalli
}
```

A nan za ka ga dalilin da alamu suke haɗuwa maimakon ninkawa. Ka riga ka san cewa `<<` shigarwa ce kuma `?` yana tambaya ba tare da alƙawari ba. Alama ɗaya kawai sabuwa ce:

- `|` **raka'a ɗaya** ce, ba dukan rafi ba.

Da wannan, duka ma'aikatan madannai suna karanta kansu:

```text
<<        |             ?
shigarwa  raka'a ɗaya   ba tare da alƙawari ba

<<|   ɗauki maɓalli ƊAYA, kuma jira har ɗaya ta zo
<<|?  duba ko akwai maɓalli, kuma ci gaba idan babu
```

Haka nan a ɗaya gefen: `>>` yana aikawa, `>>!` yana aikawa **da ƙarfi** (yana share dukan allon), yayin da `>>?` yana **tambaya** maimakon rubutawa (girman tasha). Alamar da ke hannun dama ita ce ke canza yanayin, kuma koyaushe tana zuwa ƙarshe.

> `>>!` yana share allon. `>>?` yana mayar da `[layuka, ginshiƙai]`. `@~ N` yana barci minti N.
> `<<|` yana karanta danna maɓalli ɗaya (mai toshewa); `<<|?` yana bincika ba tare da toshewa ba (`'\0'` idan babu).
> Maɓallan kibiya suna zuwa an lalata su kamar `'↑' '↓' '←' '→'`; ESC lambar lamba 27 ce.
> Tufa ta fitarwa mai matsayi: `(layi, ginshiƙi, BKS, gaba, baya)` — kowane rami ana iya watsi da shi da waƙafi (`>>~ (,,, 196) > "ja"`).
> Maskin BKS: `1`=Ƙarfi, `2`=Karkata, `4`=Layi ƙasa. Palette na ANSI 256 launi (`0`=tsoho na tasha).

---

## Ma'aikata

```zymbol
a = 10
b = 3
s1 = a + b    // 13
s2 = a - b    // 7
s3 = a * b    // 30
s4 = a / b    // 3  (rabon cikakkiyar lamba)
s5 = a % b    // 1
s6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a >= b    // #1
h1 = #1 && #0  // #0
h2 = !#1       // #0
```

> `==` ba ya tilastawa: `"5" == 5` ita ce `#0`. Tsari yana tilastawa: `"5" > 4` ita ce `#1`, haka ma `"४२" > 5` — rubutun lamba a kowane ɗaya daga cikin rubutun 69 yana kwatanta kamar lamba.
> Aiki daidai yake da kansa kawai, ba ya taɓa yin daidai da wani aiki mai jiki ɗaya.

---

## Zaruruwa

```zymbol
suna = "Bello"
n = 42
>> "Sannu " suna " kana da " n ¶ // → Sannu Bello kana da 42
bayanin = "Sannu {suna}, kana da {n}"
>> bayanin ¶              // → Sannu Bello, kana da 42
```

```zymbol
s = "Sannu duniya"
tsawo = s$#                  // 12
sashe = s$[1..5]             // "Sannu"
yana_da = s$? "duniya"          // #1
sassa = "a,b,c,d"$/ ','    // [a, b, c, d]
musanya = s$~~["u":"o"]        // "Sanno doniya"
layi = "─" $* 20
```

> `+` na lambobi ne kawai. Don zaruruwa yi amfani da jera ko saɓawa.
> `\{` da `\}` ƙugiya ne na gaske — ɓoyewa daidai take.

---

## Gudanar da Kwarara

```zymbol
x = 7
? x > 100 {
    >> "babba" ¶
} _? x > 0 {
    >> "tabbatacce" ¶     // → tabbatacce
} _ {
    >> "korau" ¶
}
```

A nan akwai sabbin alamu biyu, na uku kuma ya zo daga haɗa su:

- `?` **tambaya** ce: yana buɗe sharadi.
- `_` **abinda ba a fayyace ba** ne: reshen da ya rage idan babu tambayar da ta dace.
- `_?` dukansu a jere ne: *idan babu abin da ya dace, sake tambaya*.

Shi ya sa `_?` ake rubuta shi haka. Ba sabuwar alama ba ce da za a koya — `_` ce ta biye da `?`, kuma tana nufin daidai abin da sassanta biyu suke nufi, an karanta su a jere.

> Ƙugiya `{ }` **tilas** ne ko da bayani ɗaya.

---

## Daidaitawa

```zymbol
maki = 85
daraja = ?? maki {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> daraja ¶              // → B
```

```zymbol
zafi = -5
yanayi = ?? zafi {
    < 0  => "ƙanƙara"
    < 20 => "sanyi"
    _    => "zafi"
}
>> yanayi ¶              // → ƙanƙara
```

Ka riga ka san `?` "tambaya" ce. **`??` tambaya sau da yawa** ce: ninka alama, a ko'ina cikin harshe, shine yin abin da alama take yi sau ɗaya sau da yawa. `?` ɗaya yana gwada sharadi ɗaya; `??` yana gwada da jerin shari'o'i.

Madadin suna haɗuwa da `||`, kuma suna iya haɗa nau'ikan ƙira:

```zymbol
maɓalli = 'P'
aiki = ?? maɓalli {
    'p' || 'P' => "dakata"
    < 0 || > 100 => "bayan kewayo"
    _ => "an watsar"
}
>> aiki ¶             // → dakata
```

---

## Madaukai

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
yayan_itace = ["tuffa", "gwanda", "inabi"]
@ y:yayan_itace { >> y " " }
>> ¶                    // → tuffa gwanda inabi
@ c:"Sannu" { >> c "-" }
>> ¶                    // → S-a-n-n-u-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
lissafi = 0
@:waje {
    lissafi++
    ? lissafi >= 3 { @:waje! }
}
>> lissafi ¶             // → 3
```

`@` alamar **lokaci** ce: duk abin da ke maimaitawa yana rayuwa a cikinta. Don yanke wannan lokaci kana ƙara alama a gefenta:

- `@!` — `!` **ƙarfi** ne: bar madauki yanzu.
- `@>` — `>` yana tura gaba: matsa zuwa zagaye na gaba.
- `@:waje!` — `:` **yana ɗaure suna**, don haka wannan yana yanke madaukin da ake *kira* waje, ba na kusa ba.

Ma'aikata uku, kuma babu ɗaya da aka tuna da shi daban: sune `@` da alama da ta riga ta faɗi abin da take yi.

> **Mai ƙayyadewa ƙidaya ne ko sharadi.** `Cikakkiyar lamba` ƙidaya ce, ana kimanta ta sau ɗaya — `@ 0` yana gudanar da jiki sifili. Komai sauran sharadi ne. Babu gaskiya: `@ []` da `@ 3.5` an ƙi su. Don ratsa tarin yi amfani da `@ x:abubuwa`; don ƙidaya shi, `@ abubuwa$#`.

---

## Ayyuka

```zymbol
haɗa(a, b) { <~ a + b }
>> haɗa(3, 4) ¶        // → 7
```

```zymbol
ninkin(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ninkin(n - 1)
}
>> ninkin(5) ¶       // → 120
```

Aiki yana karanta masu canjin fayil ta ƙima, kuma rubutu ciki yana zama ciki:

```zymbol
iyaka = 100
ciki(n) { <~ n < iyaka }
>> ciki(42) ¶         // → #1
```

Alamu biyu suna canza wannan, kuma dukansu ana rubuta su **a sa hannu da wurin kira**:

```zymbol
ƙara(lissafi<~) { lissafi = lissafi + 1 }
jimla = 0
ƙara(jimla<~)
>> jimla ¶              // → 1
```

> `p~` kwafin aiki ne — jiki na iya sake sanyawa kuma mai kira ba ya shafa.
> `p<~` sigar fitarwa ce — canji yana dawowa. `ƙara(jimla)` ba tare da alama ba kuskure ne na ma'ana: bayanin da sa hannu ba za su rabu ba.

---

## Lambda da Rufewa

```zymbol
ninka = x -> x * 2
jumla = (a, b) -> a + b
>> ninka(5) ¶          // → 10
>> jumla(3, 7) ¶          // → 10
```

```zymbol
rarraba = x -> {
    ? x > 0 { <~ "tabbatacce" }
    _? x < 0 { <~ "korau" }
    <~ "sifili"
}
>> rarraba(-4) ¶         // → korau
```

```zymbol
mai_ninka = 3
sau_uku = x -> x * mai_ninka
>> sau_uku(7) ¶          // → 21
```

```zymbol
ƙirƙiri_mai_ƙara(n) { <~ x -> x + n }
ƙara10 = ƙirƙiri_mai_ƙara(10)
>> ƙara10(5) ¶           // → 15
```

Lambda na iya ɗaukar siga babu komai:

```zymbol
amsa = () -> 42
>> amsa() ¶           // → 42
```

> Lambda tana kama masu canjin fayil **lokacin da aka ƙirƙira ta**; aiki mai suna yana karanta su **lokacin da aka kira shi**.

---

## Jeri

```zymbol
jeri = [1, 2, 3, 4, 5]
>> jeri[1] ¶       // → 1   lissafin yana farawa daga 1
>> jeri[-1] ¶      // → 5   korau yana lissafta daga ƙarshe
>> jeri$# ¶        // → 5   tsawo
```

```zymbol
jeri = [1, 2, 3]
>> (jeri$+ 6) ¶          // → [1, 2, 3, 6]   ƙara
>> (jeri$+[2] 99) ¶      // → [1, 99, 2, 3]  saka a matsayi na 2
>> (jeri$- 3) ¶          // → [1, 2]         cire farkon bayyanar
>> (jeri$-[1]) ¶         // → [2, 3]         cire a lissafi na 1
>> (jeri$[1..2]) ¶       // → [1, 2]         yanki, dukansu ƙarshen an haɗa
>> (jeri$? 3) ¶          // → #1             yana ɗauke da
```

Dukansu suna farawa da `$`, alamar **tarin**, kuma suna ci gaba da alamar da ke faɗin abin da ake yi a cikinta: `#` nawa, `+` ƙara, `-` cire, `?` tambaya ko akwai. Kuma kamar `??`, ninka alama yana nufin yin ta gabaɗaya: `$?` yana tambaya *ko* ƙima tana nan, `$??` yana tambaya *a wurare nawa* kuma yana mayar da dukansu.

```zymbol
jeri = [3, 1, 2]
>> (jeri$^+) ¶     // → [1, 2, 3]   hawa
>> (jeri$^-) ¶     // → [3, 2, 1]   sauka
```

**Ka'idar sakamako.** Ma'aikaci ɗaya, kuma abin da lambar da ke kewaye take yi da shi shi ne ke yanke shawara: idan an yi amfani da shi, yana **gina** kuma yana barin na asali; idan an jefar da shi, yana **gyara**.

```zymbol
jeri = [1, 2, 3]
kwafi = jeri[2]$~ 99
>> jeri ¶                // → [1, 2, 3]
>> kwafi ¶              // → [1, 99, 3]
jeri[2]$~ 99
>> jeri ¶                // → [1, 99, 3]
```

> **`=` ba ya taɓa rubutu cikin tarin.** `jeri[2] = 99` ba siffa ba ce ta Zymbol — `=` yana ba da ƙima ga **SUNA**. Canza wani ɓangare na tarin shine `$~`, a kowane tarin.

`[…]` yana riƙe da nau'i ɗaya kuma ana bincika; cakuda da gangan ana **ayyana** shi da `#[…]`:

```zymbol
cakuda = #[1, "biyu", #1]
>> cakuda ¶             // → [1, biyu, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Lissafin Multi-dimensional

`>` yana sauka cikin tsari mai rikitarwa. Ƙungiyar ƙugiya ɗaya tana magance abu ɗaya, komai zurfinsa.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   layi 2, ginshiƙi 3
>> m[-1>-1] ¶      // → 9   layi na ƙarshe, ginshiƙi na ƙarshe
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          lebur: diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   tsari: kusurwoyi
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **ba** siffa ba ce ta Zymbol. Lissafin sarkar an ƙi shi don karantawa da rubutu — ƙungiyar ƙugiya ɗaya ga kowane shiga, kuma `>` shine abin da ke tsakanin matakai.

---

## Kamus

Tufa mai filaye masu suna kamus ne, kuma tun daga v0.0.9 an rubuta shi `#(…)`.

```zymbol
mutum = #(suna: "Bello", shekaru: 25)
>> mutum.suna ¶        // → Bello
>> mutum["shekaru"] ¶    // → 25
```

```zymbol
mutum = #(suna: "Bello", shekaru: 25)
filin = "suna"
>> mutum[filin] ¶     // → Bello
```

Yana iya canzawa, ana iya ƙara maɓallai, kuma ana iya ratsa shi:

```zymbol
haja = #(gwanda: 4)
haja["tuffa"]$~ 10
@ k:haja { >> k "=" haja[k] " " }
>> ¶                    // → gwanda=4 tuffa=10
```

```zymbol
haja = #(gwanda: 4, tuffa: 10)
@ (k, v):haja { >> k ":" v " " }
>> ¶                    // → gwanda:4 tuffa:10
```

> `#()` kamus mara komai ne, wanda `()` ba zai iya zama ba — dole ne ya zama tufa mara komai kuma. `(x: 1)` tsirara an ƙi shi da wannan saƙon: *a dictionary is written `#(…)`* — «ana rubuta kamus `#(…)`».
> Kamus ana magance shi da maɓalli, ba ta matsayi ba, don haka `mutum[1]` kuskure ne.

---

## Tufa

Tufa **marasa canzawa** kwantena ne masu tsari waɗanda ke riƙe da ƙimomi na nau'i daban-daban.

```zymbol
tabo = (10, 20)
>> tabo[1] ¶           // → 10
bayanai = (42, "Sannu", #1, 3.14)
>> bayanai[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Duk wani yunƙuri na gyara tufa a wurin kuskure ne, ko ma'aikaci wanene — rashin canzawa dukiya ce ta ƙima, ba togiya ba ce cikin kowane `$`.

---

## Rarrabuwa

```zymbol
jeri = [10, 20, 30, 40, 50]
[a, b, c] = jeri
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
jeri = [10, 20, 30, 40, 50]
[na_farko, *saura] = jeri
>> na_farko ¶            // → 10
>> saura ¶              // → [20, 30, 40, 50]
```

```zymbol
tabo = (100, 200)
(px, py) = tabo
>> px " " py ¶          // → 100 200
```

```zymbol
mutum = #(suna: "Aisha", shekaru: 25)
#(suna: n, shekaru: s) = mutum
>> n " " s ¶            // → Aisha 25
```

> Siffar ƙugiya tana da nau'i: `[…]` yana ɗaukar jeri, `(…)` tufa, `#(…)` kamus. Sunan ƙarshe **yana shanye saura**, don haka rarrabuwa ba ya faɗuwa kan tsawo — `(a, b, c) = (1,2,3,4,5)` yana ba da `c = (3,4,5)`, kuma `##_` idan babu abin da ya rage.

---

## Ayyukan Matsayi Mai Girma

```zymbol
lambobi = [1, 2, 3, 4, 5]
>> (lambobi$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (lambobi$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (lambobi$< (0, (tara, x) -> tara + x)) ¶ // → 15
```

```zymbol
lambobi = [1, 2, 3, 4, 5, 6]
ninka(x) { <~ x * 2 }
babba(x) { <~ x > 3 }
>> (lambobi$> ninka) ¶    // → [2, 4, 6, 8, 10, 12]
>> (lambobi$| babba) ¶    // → [4, 5, 6]
```

```zymbol
tushe = [#(suna: "Carla", shekaru: 28), #(suna: "Aisha", shekaru: 25)]
bisa_shekaru = tushe$^ (a, b -> a.shekaru < b.shekaru)
>> bisa_shekaru[1].suna ¶     // → Aisha
```

> Aiki mai suna yana zuwa HOF **ba tare da baka ba**: `lambobi$> ninka`. Rubuta `lambobi$> (ninka)` kuskure ne na bincike, domin `(` yana buɗe lambda.

---

## Ma'aikacin Bututu

```zymbol
ninka = x -> x * 2
haɗa = (a, b) -> a + b
ƙara_ɗaya = x -> x + 1
>> (5 |> ninka(_)) ¶    // → 10
>> (10 |> haɗa(_, 5)) ¶  // → 15
>> (5 |> ninka(_) |> ƙara_ɗaya(_)) ¶ // → 11
```

---

## Magance Kuskure

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "rabawa da sifili" ¶  // → rabawa da sifili
} :! {
    >> "wani: " _err ¶
} :> {
    >> "koyaushe yana gudana" ¶        // → koyaushe yana gudana
}
```

| Nau'i | Lokacin |
|------|---------|
| `##Div` | Rabawa da sifili |
| `##Index` | Lissafi bayan iyaka |
| `##Key` | Maɓalli babu a kamus |
| `##Range` | Bayan kewayon amincin lamba |
| `##Type` | Rashin daidaituwar nau'i |
| `##Parse` | Binciken bayanai |
| `##IO` | Fayil / tsari |
| `##Network` | Kuskuren cibiyar sadarwa |
| `##DB` | Bayanan bayanai |
| `##Time` | Kwanan da ba ya nan |
| `##_` | Duk wani kuskure (mai kama duka) |

`!` alamar **kuskure da ƙarfi** ce, kuma ana karanta ta iri ɗaya a duka iyalai: `$!` yana tambayar ƙima ko kuskure ce; `$!!`, da alamar ninki biyu, yana yada ta sama ba tare da tambaya ba.

> Rashin nasarar ɗakin karatu na yau da kullum suna dawowa kamar **ƙimomin kuskure masu laushi** waɗanda kake gwadawa da `$!` ko kamawa da `!?`, maimakon dakatarwa. `$!!` yana yada ɗaya ga mai kira.

---

## Modula

```zymbol
# lissafi {
    #> { haɗa, PI }

    PI := 3.14159
    haɗa(a, b) { <~ a + b }
}
```

```zymbol
<# ./lissafi => l

>> l::haɗa(5, 3) ¶
>> l.PI ¶
```

```zymbol
# ɗakin_karatu_na {
    #> { haɗa_ciki => jimla }

    haɗa_ciki(a, b) { <~ a + b }
}
```

Alamomin modula biyu ra'ayi ɗaya ne, yanzu an yi amfani da su ga fayiloli: `#` matakin **ayyana** ne — abin da abu *yake*, ba ƙimarsa ba — kuma kibiya tana faɗin inda lambar take tafiya:

```text
<#   kibiya tana shiga: shigo da, kawo daga wani fayil
#>   kibiya tana fita: fitar da, bayar ga wasu fayiloli
```

Alamar shugabanci koyaushe tana zaune a gefen da ke fuskantar inda take nuni. Wannan shine dalilin da ya sa `<~` yake dawowa hagu (daga aiki) kuma `->` yana shiga dama (cikin jikin lambda).

> **Modula tana ayyana abin da take fitarwa.** Toshen `#>` tilas ne — watsi da shi **E014** ne, kuma `#> { }` ita ce hanyar da modula take faɗin cewa samanta babu komai. `::` yana kira aiki, `.` yana karanta tsayayye. Shigo da, toshen fitarwa, masu fara rubutu na gaske da ma'anar aiki ne kawai za su iya bayyana a jikin modula; duk abin da za a iya aiwatarwa **E013** ne.

---

## Ɗakin Karatu na Yau da Kullum

Modula na asali, ana shigo da su kamar kowa:

| Modula | Ayyuka |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   glyph biyu, ginshiƙi huɗu
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

rana = T::of(2026, 1, 31)
>> T::format(rana, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(rana, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` yana auna **ginshiƙan nuni**, ba haruffa ba: CJK da yawancin emoji ginshiƙi 2 ne, don haka shirya tebur da `t::width`, ba `$#` ba.
> A cikin `std/time` lokaci minti ne tun daga zamanin. Ƙasa da rana ɗaya tsawon lokaci ne, daga rana ɗaya zuwa sama kalanda ne — don haka wata yana faɗuwa a rana ɗaya ta wata, an danne. `bambanci(a, b)` shine `a - b`, don haka lokacin da ya gabata da farko yana ba da amsa mara kyau.

---

## Fakiti

`.zyp` yana haɗa shirin fayiloli da yawa cikin fayil ɗaya mai ɗaukar nauyi. Kayan **tushe** ne, ba binary ba, don haka yana aiki a duk inda binary na `zymbol` ke aiki.

```bash
zymbol package aikina/ --script main.zy -o aikina.zyp
zymbol run aikina.zyp
```

> Kayan yana ɗauke da sanarwa (`zyp.toml`) da ke ayyana rubutun shigarsa da sigar injin da yake buƙata. `zymbol run` yana fitar da shi cikin wani directory na ɗan lokaci kuma yana gudanarwa daga can, don haka lambar za a iya zubarwa yayin da abin da rubutun ke rubutawa ke faɗuwa cikin ainihin directory ɗin aikinka. Filin wasa kuma yana loda fayilolin `.zyp`.

---

## Yanayin Lambobi

Zymbol na iya rubuta lambobi cikin **rubutun lambobin Unicode 69** — Devanagari, Larabci-Indiya, Thai, Klingon pIqaD, Ƙarfin Lissafi, sassan LCD, da sauransu. Yanayin na duniya ne ga tsari kuma yana shafar fitarwa; lissafi ba ya canzawa.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Larabci-Indiya (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // sake saita zuwa ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Lambobin kowane rubutun da aka goyi baya rubutu ne na gaske a cikin tushe:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Karatu daidai yake — ana fahimtar lamba a kowane rubutu:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` koyaushe ASCII ne, don haka `#0` ya kasance daban da lambar sifili a kowane rubutu.
> `#,` da `#^` kuma suna rubuta lambobinsu a cikin rubutun da ke aiki, kuma masu rabuwa suna biye da shi — amma ma'auratan ba sa juyawa: `,` yana rukuni kuma `.` yana rabawa, a kowane rubutu.

---

## Ma'aikatan Bayanai

```zymbol
f = ##.42         // zuwa Lamba mai iyo
i = ###3.7        // zuwa Cikakkiyar lamba, an yi zagaye  → 4
t = ##!3.7        // zuwa Cikakkiyar lamba, an yanke  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Lamba mai iyo ana buga ta da lambobi, ba ta sigar juzu'i ba, kuma tana barin `.0` na ƙarshe — `##.42` yana rubuta `42` kuma har yanzu Lamba mai iyo ce, kamar yadda `f#?` ya nuna.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   mai aminci: yana mayar da shigarwa ba ta canza ba
>> ##!'A' ¶        // → 65    lambar lambar Harafi
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          zagaye zuwa goma 2
>> #!2|pi| ¶       // → 3.14          yanke zuwa goma 2
>> #,|1234567| ¶   // → 1,234,567     masu raba dubbai
>> #^|12345.678| ¶ // → 1.2345678e4   bayanin kimiyya
```

```zymbol
>> 0x41 ¶        // → A   goma sha shida
>> 0b01000001 ¶  // → A   binary
>> 0o101 ¶       // → A   takwas
>> 0d65 ¶        // → A   goma
```

> Rubutun tushe a cikin kewayon ASCII **Harafi** ne: `0d65 == 'A'` ita ce `#1`, kuma `0d65 == 65` ita ce `#0`. Dukansu tushe huɗu suna rubuta harafi ɗaya.

---

## Haɗin Shell

```zymbol
yau = <\ date +%Y-%m-%d \>
>> "Yau: " yau
```

```zymbol
fitarwa = </"./ƙaramin_rubutu.zy"/>
>> fitarwa
```

> `<\ … \>` yana kama stdout da stderr, yana cire sabon layi na ƙarshe.
> `>< args` yana kama gardamar layin umarni kamar jerin zaruruwa.

---

## Cikakken Misali: FizzBuzz

```zymbol
rarraba(lamba) {
    ? lamba % 15 == 0 { <~ "FizzBuzz" }
    _? lamba % 3  == 0 { <~ "Fizz" }
    _? lamba % 5  == 0 { <~ "Buzz" }
    <~ lamba
}

@ i:1..20 { >> rarraba(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (ɗaya a kowace layi)
```

---

## Yadda Alamomi Suke Haɗuwa

Ka kasance kana ganin abu ɗaya cikin wannan littafi duka: **ma'aikaci ba zane ba ne da za a tuna, alamu da yawa ne a jere, kuma kowanne yana ba da gudummawar ma'anarsa.** Yanzu da ka san su duka, ga cikakken tsari.

Da farko yakan zo **a wace duniya muke**:

| Alama | Duniya | Ka gan ta a |
|--------|-------|----------------------------|
| `$` | tarin | `$#` `$+` `$?` `$^-` |
| `@` | lokaci, duk abin da ke maimaitawa | `@!` `@>` `@~` |
| `#` | abin da abu *yake*, ba ƙimarsa ba | `#?` `#(…)` `<#` `#>` |
| `>>` | daga shirin waje | `>>` `>>!` `>>?` |
| `<<` | cikin shirin | `<<` `<<\|` `<<\|?` |
| `?` | tambaya, ba tare da alƙawari ba | `?` `_?` `??` `$?` |
| `!` | ƙarfi, ko kuskure | `@!` `$!` `!?` |

Sa'an nan **abin da ake yi a can** ya zo: `+` ƙara, `-` cire, `^` tsari, `~` gyara, `#` lissafa, `|` raka'a ɗaya, `:` ɗaure suna.

Kuma ƙa'idoji biyu da ba sa faɗuwa:

**Ninka alama yana sa ta gama-gari.** `?` tana tambaya sau ɗaya, `??` tana gwada shari'o'i da yawa. `$?` tana tambaya ko ƙima tana nan, `$??` tana mayar da duk inda take. `!` yana nuna kuskure, `!!` yana yada shi ba tare da tambaya ba.

**Alamar yanayi koyaushe tana zuwa ƙarshe.** Lokacin da `?` ko `!` suka bayyana don su faɗi *yadda* ake yin wani abu — cikin shakka ko da ƙarfi — su ne alamomin ƙarshe na ma'aikacin: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:waje!`. Babu wani aiki bayansu.

Wani abu mai amfani yana fitowa daga nan: **haɗin da ba ka taɓa gani ba yana da ma'ana tun kafin ka duba shi.** Idan `$` tarin ne kuma `^` tsari ne kuma `-` juyi ne, to `$^-` yana tsara saukewa, kuma babu wanda ya gaya maka.

Ba duk kayan aikin ke aiki haka ba, kuma faɗin haka ya fi yin kamar ba haka ba. Yawancin ma'aikata suna rabuwa da kyau. Shida suna rabuwa amma suna nufin fiye da sassansu: `!?` `:!` `:>` `|>` `::` `$++`. Kuma goma dole a haddace su domin ba sa rabuwa kwata-kwata: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Ƙidaya waɗanda ba a gane su ba maimakon ɗauka kaɗan ne da gangan: su ne ainihin kuɗin haddace harshe. Cikakken bayani — kayan aiki, homographs da aka ayyana, da ƙa'idojin da sabon ma'aikaci dole ya cika don wanzuwa — yana cikin `SYMBOLS.md`, a cikin ma'ajiyar mai fassara.

---

## Bayanin Alamu

| Alama | Aiki | Alama | Aiki |
|--------|-----------|--------|-----------|
| `=` | mai canji | `$#` | tsawo |
| `:=` | tsayayye | `$+` | ƙara |
| `>>` | fitarwa | `$+[i]` | saka a lissafi (1-tushe) |
| `<<` | shigarwa | `$-` | cire na farko da ƙima |
| `¶` / `\\` | sabon layi | `$--` | cire duka da ƙima |
| `?` | idan | `$-[i]` | cire a lissafi (1-tushe) |
| `_?` | in ba haka ba-idan | `$-[i..j]` | cire kewayo (1-tushe) |
| `_` | in ba haka ba / wildcard | `$?` | yana ɗauke da |
| `??` | daidaitawa | `$??` | nemo duk lissafai (1-tushe) |
| `\|\|` | ko-tsari a reshen match | `$[s..e]` | yanki (1-tushe) |
| `@` | madauki | `$>` | taswira |
| `@ N { }` | madauki N sau | `$\|` | tace |
| `@!` | karye | `$<` | rage |
| `@>` | ci gaba | `$/ mai_rabawa` | raba zare |
| `@:suna { }` | madauki mai lakabi | `$++ a b c` | gina ta haɗawa |
| `@:suna!` | karya lakabi | `$~~[p:r]` | musanya zare |
| `@:suna>` | ci gaba da lakabi | `$*` | maimaita zare |
| `->` | lambda | `jeri[i]$~ v` | SAIƊIN hanyar sabuntawa |
| `<~` | dawo / sigar fitarwa | `~` | sigar kwafin aiki |
| `jeri[i>j]` | lissafin kewayawa | `jeri[p ; q]` | ciro lebur |
| `$^+` | tsara hawa | `$^-` | tsara sauka |
| `$^` | tsara da mai kwatance | `\|>` | bututu |
| `!?` | gwada | `:!` | kama |
| `:>` | a ƙarshe | `$!` | kuskure ne |
| `$!!` | yada kuskure | `#1` / `#0` | gaskiya / ƙarya |
| `##_` | Raka'a — rashin | `[…]` | jeri, nau'i ɗaya |
| `#[…]` | jeri, cakuda da aka ayyana | `#(…)` | kamus |
| `(…)` | tufa ta matsayi | `#()` | kamus mara komai |
| `<#` | shigo da | `#>` | fitar da |
| `#` | ayyana modula | `::` | kira modula |
| `.` | shiga fili / tsayayye | `#?` | metadata na nau'i |
| `#\|..\|` | bincika lamba | `##.` | juya zuwa Lamba mai iyo |
| `###` | juya zuwa Cikakkiyar lamba (zagaye) | `##!` | juya zuwa Cikakkiyar lamba (yanke) |
| `#.N\|..\|` | zagaye | `#!N\|..\|` | yanke |
| `#,\|..\|` | masu raba dubbai | `#^\|..\|` | kimiyya |
| `#d0d9#` | canza yanayin lambobi | `#09#` | sake saita zuwa ASCII |
| `<\ ..\>` | gudanar da shell | `><` | gardamar CLI |
| `\ var` | lalata mai canji | `°x` / `x°` | ma'anar zafi |
| `>>\|` | toshe TUI (allon madadin) | `>>~` | fitarwa mai matsayi |
| `>>!` | share allon | `>>?` | tambayi girman tasha |
| `<<\|` | danna maɓalli mai toshewa | `<<\|?` | danna maɓalli mara toshewa |
| `@~ N` | barci minti N | `0d` `0x` `0o` `0b` | rubutun tushe |

---

## Tarihin Canje-canjen Saki

### v0.0.9 — Tarin Sun Yanke Shawara _(Satumba 2026)_

- **Karya** Kamus yana da nasa rubutun: `#(maɓalli: ƙima)`. `(x: 1)` tsirara an ƙi shi, kuma `#()` shine kamus mara komai — wanda `()` ba zai taɓa iya zama ba
- **Karya** An janye sanyawa mai lissafi: `jeri[i] = v` da duk siffofin haɗe. `=` yana ba da ƙima ga **SUNA**; canza wani ɓangare na tarin shine `$~`
- **Karya** Lissafin sarkar `m[i][j]` an ƙi shi don karantawa da rubutu — `>` shine abin da ke tsakanin matakai
- **Karya** Modula dole ta ayyana abin da take fitarwa (**E014**); `#> { }` ita ce hanyar da modula take faɗin cewa samanta babu komai
- **Karya** Mai ƙayyadewa madauki ƙidaya ne ko sharadi — babu gaskiya. `@ []` da `@ 3.5` an ƙi su
- **An ƙara** `##_` — rubutun Raka'a, da yadda shiri yake tambaya ko wani abu ba ya nan
- **An ƙara** `#[…]` — jeri wanda cakudar nau'ikan abubuwansa aka ayyana
- **An ƙara** `#?` yana bambanta tarin huɗu: `##]` `##[` `##)` `##(`
- **An ƙara** `std/time` — agogo da kalandar farar hula, tare da yankuna da lissafin kalanda
- **An ƙara** `<~>` a matakin sama matsayin fita na shiri ne
- **An ƙara** `@ (k, v):ma'aurata` — tsari a kan madauki
- **An ƙara** `#|c|` yana karanta lamba a kowane ɗaya daga cikin rubutun 69; `#,` da `#^` suna rubuta cikin aiki
- **An canza** `Cikakkiyar lamba` amintaccen lamba ce, ±(2⁵³ − 1), rufewa-kan-kuskure a kowane inji
- **An canza** Aiki mai suna yana karanta masu canjin fayil a lokacin kira, ta ƙima
- **An canza** Bayani da ke karanta suna kawai yana gargaɗi maimakon wucewa shiru
- **Injina** 660 daga cikin fayilolin corpus 666 sun yarda a duk injin uku, 0 sun bambanta

### v0.0.8 — Saki Kai Tsaye, `std/term` da Fakiti _(Agusta 2026)_

- **An ƙara** Rushewa ta atomatik a amfani na ƙarshe — ganuwa ba; yana rage ƙwaƙwalwar kololuwa kawai
- **An ƙara** `std/term` — ma'aunin nuni a cikin ginshiƙan tasha
- **An ƙara** `##!` akan `Harafi` — lambar lambar Unicode
- **An ƙara** Ko-tsari a cikin match: `'p' || 'P' => …`, madadin kowane nau'i a reshe ɗaya
- **An ƙara** Fakiti na Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **An ƙara** `<~>` a wurin kira tilas ne inda mai karɓa ya ayyana sigar fitarwa
- **An gyara** Daidaituwar tsarin modula a cikin VM register

### v0.0.7 — Ɗakin Karatu na Asali _(Yuli 2026)_

- **An ƙara** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — dukansu da ƙimomin kuskure masu laushi
- **An ƙara** Shigarwa mai nau'i/tabbatarwa: `<< ##.(5,2) "farashi: " p`
- **An ƙara** Ma'aikata bayan a cikin `>>` kai tsaye — babu buƙatar baka
- **An canza** Mai tsarawa rufewa-kan-kuskure: yana ƙi rubuta fitarwa da ba zai iya sake karantawa ba

### v0.0.6 — Gyara da Ɗakin Karatu na Kimiyya _(Yuni 2026)_

- **Karya** `=>` yana maye gurbin `:` a reshen match da `<=` a laƙabin shigo/fitar
- **An ƙara** `std/math` da `std/random`
- **An ƙara** Sabunta kamus da maɓalli: `d["k"]$~ ƙima`

### v0.0.5 — Ainihin TUI da Ma'anar Zafi _(Mayu 2026)_

- **An ƙara** Toshe TUI `>>| { }`, fitarwa mai matsayi `>>~`, shigarwar maɓalli `<<|` da `<<|?`
- **An ƙara** `>>!` share allon, `>>?` girman tasha, `@~ N` barci
- **An ƙara** Ma'anar zafi `°x` / `x°`, da maimaita zare `$*`

### v0.0.4 — Lissafi daga 1 da Ayyukan Aji na Farko _(Afrilu 2026)_

- **Karya** Duk lissafin **daga 1** — `jeri[1]` shine abu na farko
- **An ƙara** Ayyuka masu suna kamar ƙimomi na aji na farko; rubutun toshe modula `# suna { }`
- **An ƙara** Lissafin multi-dimensional `jeri[i>j>k]` da ciro lebur `jeri[p ; q]`

### v0.0.3 — Tsarin Lambobin Unicode _(Afrilu 2026)_

- **An ƙara** Toshe lambobin Unicode 69 da alamar canza yanayi `#d0d9#`
- **An ƙara** Rubutun boolean a kowane rubutu — `#१` / `#०`

### v0.0.2 — Sake Tsara API na Tarin _(Maris 2026)_

- **An ƙara** Iyalin ma'aikacin `$` don jeri da zaruruwa
- **An ƙara** Sanyawar rarrabuwa, da lissafai marasa kyau

### v0.0.1 — Farkon Sakin Jama'a _(Maris 2026)_

- Mai fassara na tafiya bishiya + VM register (`--vm`)
- Duk manyan gine-gine: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Cikakkun masu gano Unicode, tsarin modula, lambda, rufewa, magance kuskure
- REPL, LSP, ƙarin VS Code, mai tsarawa (`zymbol fmt`)

---

_Zymbol-Lang — Alama. Duniya. Mara Canzawa._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lasisi:** wannan littafin yana ƙarƙashin lasisin [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Cikakken rubutu: `LICENSE-CC-BY-SA-4.0` a <https://github.com/zymbol-lang/web>. Mai fassara da injin burauza (`zymbol.js`) ayyuka ne daban, waɗanda ke ƙarƙashin lasisin AGPL-3.0-only.
