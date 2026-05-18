> **Cafis:** Dukumentigan waxaa sameeyay oo turjumay sirdoonka macmalka ah (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Tixraaca canonical waa **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** oo ku dhex jira kaydka turjumaanka.

---

# Buug-gacmeedka Zymbol-Lang

> **Loo eegay v0.0.5 — 2026-05-14**

**Zymbol-Lang** waa luqad barnaamij oo astaan ah. Ma jiraan ereyo muhiim ah — wax kastaa waa astaan. Waxay u shaqeysaa si isku mid ah luqad kasta oo bani'aadamka ah.

- Ma jiraan `if`, `while`, `return` — kaliya `?`, `@`, `<~`
- Unicode dhammaystiran — aqoonsiyayaasha luqad kasta ama emoji kasta
- Aan ku tiirsanayn luqadda bani'aadamka — koodka waa isku mid meel kasta

**Nooca Turjumaanka**: v0.0.5 | **Daboolista Tijaabada**: 436/436 (sinnaanta TW ↔ VM)

---

## Doorsoomayaasha iyo Joogtayaasha

```zymbol
x = 10              // doorsoome beddeli karo
π := 3.14159        // joogte — dib u qoondayntu waa cillad waqtiga orodka
magaca = "Alice"
firfircoon = #1         // boolean run ah
👋 := "Hayo"
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

`°` (calaamada darajo, U+00B0) waxay si toos ah u bilawdaa doorsoome qiimihiisa dhexdhexaadka ah isticmaalka koowaad:

```zymbol
tirooyinka = [3, 1, 4, 1, 5]
@ n:tirooyinka {
    °wadarta += n    // si toos ah ugu bilow 0 kor loopka; way noolaataa ka dib @
}
>> wadarta ¶         // → 14
```

> `°x` (horgale) waxay ku xirtaa kor loopka — natiijada waa la heli karaa ka dib `@`.
> `x°` (dabagale) waxay ku xirtaa gudaha loopka — way dhimataa marka loopka dhammaado.
> Kaliya tree-walker.

---

## Noocyada Xogta

| Nooca | Saxan | Summada `#?` | Qoraalo |
|------|---------|----------|---------|
| Iskudhaf | `42`, `-7` | `###` | 64-bit oo calaamad leh |
| Sabayn | `3.14`, `1.5e10` | `##.` | Qoraalka sayniska waa la oggol yahay |
| Xarig | `"qoraal"` | `##"` | Gelinta: `"Hayo {magaca}"` |
| Xaraf | `'A'` | `##'` | Xaraf Unicode keliya |
| Boolean | `#1`, `#0` | `##?` | Ma aha tiro — `#1 ≠ 1` |
| Qayb | `[1, 2, 3]` | `##]` | Waxyaabaha isku midka ah |
| Tuple | `(a, b)` | `##)` | Meelayn |
| Tuple magac leh | `(x: 1, y: 2)` | `##)` | Goobo magac leh |
| Hawl | tixraac hawl magac leh | `##()` | Darajada koowaad; waxay tusinaysaa `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Darajada koowaad; waxay tusinaysaa `<lambd/N>` |

```zymbol
// Baaritaanka nooca — waxay soo celisaa (nooca, tirooyinka, qiimaha)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Wax-soo-saarka iyo Wax-soo-gelinta

```zymbol
>> "Hayo" ¶                       // ¶ ama \\ khariidad cusub oo cad
>> "a=" a " b=" b ¶               // is-dul-dhig — qiimayaal badan
>> (arr$#) ¶                      // hawl-wadeennada dabagalka ah waxay u baahan yihiin ( ) gudaha >>

>> magaca                           // u akhri doorsoome (iyada oo aan lahayn macluumaad)
>> "Geli magaca: " magaca            // macluumaad leh
```

> `¶` (AltGr+R oo ku yaal kiiboodhka Isbaanishka) iyo `\\` waa xariiqyo cusub oo isku mid ah.

---

## Aasaasyada TUI

Hawl-wadeennada is-dhexgalka isticmaalaha terminal-ka ee barnaamijyada is-dhexgalka ah. Inta badan waxay u baahan yihiin block `>>| { }` (shaashad beddel ah + qaab cayriin).

```zymbol
>>| {
    >>!                             // nadiifi shaashadda beddelka ah
    >>~ (1, 1, 0, 10) > "Wuu shaqaynayaa"   // safka 1, tiirka 1, fg=10 (cagaar)
    @~ 1000                         // jooji 1 ilbiriqsi (1000 ms)
    >>~ (2, 1) > "Dhammaaday."
}
// markaad baxdo terminal-ka si toos ah ayaa loo soo celiyaa
```

```zymbol
// Garaacidda furaha iyo cabbirka terminal-ka
>>| {
    [safafka, tiirarka] = >>?              // weydii cabbirrada terminal-ka
    >>~ (1, 1) > "Terminal: " safafka " x " tiirarka
    <<| furaha                         // akhri garaacidda furaha ee xanniban
    >>~ (2, 1) > "Waxaad ku dhiftay: " furaha
}
```

> `>>!` waxay nadiifisaa shaashadda. `>>?` waxay soo celisaa `[safafka, tiirarka]`. `@~ N` waxay seexataa N milisekundo.
> `<<|` waxay akhridaa hal garaacis fure (xanniban); `<<|?` waxay sahmiyaa iyada oo aan xannibin (waxay soo celisaa `'\0'` haddii aysan jirin).
> Tuple-ka wax-soo-saarka meeleynta: `(safka, tiirka, BKS, fg, bg)` — goob kasta waa laga tagi karaa iyada oo la isticmaalayo comma (`>>~ (,,, 196) > "guduud"`).
> BKS waa bitmask: `1`=dhumuc weyn, `2`=ferjignaan, `4`=khariidad hoose. Palette-ka 256 midab ee ANSI (`0`=default-ka terminal-ka).
> Kaliya tree-walker (marka laga reebo `>>!`, `>>?`, `@~`, `>>~` oo sidoo kale ka shaqeeya `--vm`).

---

## Hawl-wadeennada

```zymbol
// Xisaabta
a = 10
b = 3
n1 = a + b    // 13
n2 = a - b    // 7
n3 = a * b    // 30
n4 = a / b    // 3  (qaybinta iskudhafka)
n5 = a % b    // 1
n6 = a ^ b    // 1000  (kor u qaadista)

// Isbarbardhigga — u qoondee si aad u baarto
is1 = a == b    // #0
is2 = a <> b    // #1
is3 = a < b     // #0
is4 = a <= b    // #0
is5 = a > b     // #1
is6 = a >= b    // #1

// Macquul
mac1 = #1 && #0    // #0
mac2 = #1 || #0    // #1
mac3 = !#1         // #0
```

---

## Xarigga

```zymbol
// Laba qaab oo isku xidhid
magaca = "Alice"
n = 42

>> "Hayo " magaca " waxaad haysataa " n ¶       // is-dul-dhig — gudaha >>
sharraxaad = "Hayo {magaca}, waxaad haysataa {n}"     // gelinta — meel kasta
```

```zymbol
s = "Hayo dunida"
dhererka = s$#                  // 10
jajab = s$[1..5]             // "Hayo"  (1-sal, dhammaadka lagu daray)
jira = s$? "dunida"          // #1
qaybaha = "a,b,c,d"$/ ','   // [a, b, c, d]  (u qaybi qaybiye)
bedel = s$~~["l":"r"]        // "Hayo dunida" (ma jiro 'l' Soomaaliga)
bedel1 = s$~~["l":"r":1]     // "Hayo dunida"
xariiq = "─" $* 20           // "────────────────────"  (ku celi N jeer)
```

> `+` waxaa loogu talagalay tirooyinka kaliya. Xarigga, isticmaal `,`, is-dul-dhig, ama gelinta.

---

## Socodka Xakamaynta

```zymbol
x = 7

? x > 0 { >> "wax fiican" ¶ }

? x > 100 {
    >> "weyn" ¶
} _? x > 0 {
    >> "wax fiican" ¶
} _? x == 0 {
    >> "eber" ¶
} _ {
    >> "xun" ¶
}
```

> Bannaan-bixiyeyaasha `{ }` **waa lama huraan** xitaa haddii ay tahay hal weedh.

---

## Isku-dhigista

```zymbol
// Kala-duwanaanshaha
buundooyinka = 85
darajada = ?? buundooyinka {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> darajada ¶    // → B

// Xarigga
midabka = "guduud"
koodhka = ?? midabka {
    "guduud"   => "#FF0000"
    "cagaar" => "#00FF00"
    _       => "#000000"
}

// Qaababka isbarbardhigga
heerkulka = -5
xaaladda = ?? heerkulka {
    < 0  => "baraf"
    < 20 => "qabow"
    < 35 => "diirran"
    _    => "kulul"
}
>> xaaladda ¶    // → baraf

// Qaabka weedhaha (gacmaha block-ka)
n = -3
?? n {
    0    => { >> "eber" ¶ }
    < 0  => { >> "xun" ¶ }
    _    => { >> "wax fiican" ¶ }
}
```

---

## Loopyada

```zymbol
@ i:0..4  { >> i " " }        // kala-duwanaanshaha oo lagu daray:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tallaabo leh:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // gadaal:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

miraha = ["tufaax", "canbeed", "canab"]
@ m:miraha { >> m ¶ }         // shay kasta oo ku jira qaybta

@ x:"hello" { >> x "-" }
>> ¶                          // → h-e-l-l-o-  (xaraf kasta oo ku jira xarigga)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> sii wad
    ? i > 7 { @! }             // @! jebi
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop aan dhammaad lahayn
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop calaamadaysan (jebinta isku-xidhan)
tirinta = 0
@:dibedda {
    tirinta++
    ? tirinta >= 3 { @:dibedda! }
}
>> tirinta ¶                    // → 3
```

---

## Hawlaha

```zymbol
ku_dar(a, b) { <~ a + b }
>> ku_dar(3, 4) ¶    // → 7

faktoriyaal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyaal(n - 1)
}
>> faktoriyaal(5) ¶    // → 120
```

Hawlaha waxay leeyihiin **baal gooni ah** — ma akhriyi karaan doorsoomayaasha dibedda. Isticmaal cabirrada wax-soo-saarka `<~>` si aad wax uga beddesho doorsoomayaasha wacaha:

```zymbol
is_dhaaf(a<~, b<~) {
    ku_meel_gaadh = a
    a = b
    b = ku_meel_gaadh
}
x = 10
y = 20
is_dhaaf(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Hawlaha magaca leh waa **qiimayaasha darajada koowaad** — si toos ah u gudbi: `tirooyinka$> labanlaab`. Si aad u duuduubto: `x -> fn(x)` sidoo kale waa sax.

---

## Lambda-yada iyo Xiritaannada

```zymbol
labanlaab = x -> x * 2
ku_dar = (a, b) -> a + b
>> labanlaab(5) ¶    // → 10
>> ku_dar(3, 7) ¶  // → 10

// Lambda block ah
kala_saar = x -> {
    ? x > 0 { <~ "wax fiican" }
    _? x < 0 { <~ "xun" }
    <~ "eber"
}

// Xiritaan — waxay qabataa baalka dibedda
qodob = 3
saddex_lab = x -> x * qodob
>> saddex_lab(7) ¶    // → 21

// Warshad
sameeyaha_ku_darista(n) { <~ x -> x + n }
ku_dar_toban = sameeyaha_ku_darista(10)
>> ku_dar_toban(5) ¶    // → 15

// Qaybta dhexdeeda
hawl_wadeennada = [x -> x+1, x -> x*2, x -> x*x]
>> hawl_wadeennada[3](5) ¶    // → 25
```

---

## Qaybaha

Qaybuhu waa **kuwo beddeli kara** waxayna ka kooban yihiin waxyaabo **isku nooc ah**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — gelitaanka (1-sal: shayga koowaad)
x = arr[-1]     // 5 — tusmo taban (shayga ugu dambeeya)
x = arr$#       // 5 — dhererka (isticmaal (arr$#) gudaha >>)

arr = arr$+ 6            // ku dar → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // geli booska 2 (1-sal)
arr3 = arr$- 3           // ka saar dhacdada koowaad ee qiimaha
arr4 = arr$-- 3          // ka saar dhacdooyinka oo dhan
arr5 = arr$-[1]          // ka saar tusmada 1 (shayga koowaad)
arr6 = arr$-[2..3]       // ka saar kala-duwanaanshaha (1-sal, dhammaadka lagu daray)

jira = arr$? 3            // #1 — waxay ka kooban tahay
meelaha = arr$?? 3           // [3] — dhammaan tusaalayaasha qiimaha (1-sal)
jajab = arr$[1..3]          // [1,2,3] — jajab (1-sal, dhammaadka lagu daray)
jajab2 = arr$[1:3]          // [1,2,3] — isku mid, naxwaha sal-tirada

kor_u_kac = arr$^+             // kala sooc kor u kac (kuwa asaasiga ah kaliya)
hoos_u_dhac = arr$^-            // kala sooc hoos u dhac (kuwa asaasiga ah kaliya)

// Qaybaha tuple-ka ee magac leh/meelayn leh — isticmaal $^ iyo lambda isbarbardhigga
keydka = [(magaca: "Carla", da'da: 28), (magaca: "Ana", da'da: 25), (magaca: "Bob", da'da: 30)]
ku_saleysan_da'da  = keydka$^ (a, b -> a.da'da < b.da'da)    // ku saleysan da'da kor u kac (<)
ku_saleysan_magaca = keydka$^ (a, b -> a.magaca > b.magaca)   // ku saleysan magaca hoos u dhac (>)
>> ku_saleysan_da'da[1].magaca ¶     // → Ana
>> ku_saleysan_magaca[1].magaca ¶    // → Carla

// Cusboonaysiinta shayga tooska ah (qaybaha kaliya)
arr[1] = 99              // u qoondee
arr[2] += 5              // isku-dhafan: +=  -=  *=  /=  %=  ^=

// Cusboonaysiinta hawleed — waxay soo celisaa qayb cusub; asalku ma beddelmo
arr2 = arr[2]$~ 99
```

> Dhammaan hawl-wadeennada ururinta waxay soo celiyaan **qayb cusub**. Dib u qoondee: `arr = arr$+ 4`.
> `$+` waa la isku xiri karaa silsilad: `arr = arr$+ 5$+ 6$+ 7`. Hawl-wadeennada kale waxay isticmaalaan qoondaynta dhexe.
> **Tusmeyntu waa 1-sal**: `arr[1]` waa shayga koowaad; `arr[0]` waa cillad waqtiga orodka.
> `$^+` / `$^-` waxay kala soocaan **qaybaha asaasiga ah** (tirooyinka, xarigga). Qaybaha tuple-ka, isticmaal `$^` iyo lambda isbarbardhigga — jihaynta waxaa lagu xardhay lambda (`<` = kor u kac, `>` = hoos u dhac).

**Semantiga qiimaha** — u qoondaynta qayb doorsoome kale waxay abuurtaa nuqul madax bannaan:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b saameyn kuma yeelan
```

```zymbol
// Qaybaha isku-xidhan (tusmeynta 1-sal)
jaderka = [[1,2,3],[4,5,6],[7,8,9]]
>> jaderka[2][3] ¶    // → 6  (safka 2, tiirka 3)
```

---

## Qaab-dhismeedka Burburinta

```zymbol
// Qaybta
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[koowaad, *hadhay] = arr         // koowaad=10  hadhay=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ waa la tuuray

// Tuple meelayn
dhibic = (100, 200)
(px, py) = dhibic             // px=100  py=200

// Tuple magac leh
qofka = (magaca: "Ana", da'da: 25, magaalada: "Madrid")
(magaca: n, da'da: d) = qofka   // n="Ana"  d=25
```

---

## Tuple-ka

Tuple-yadu waa weelal la kala horreeyo **aan la beddeli karin** oo xambaari kara qiimayaal **noocyo kala duwan ah**.
Si ka duwan qaybaha, waxyaabaha lama beddeli karo ka dib marka la abuuray.

```zymbol
// Meelayn — noocyada isku-dhafan waa la oggol yahay
dhibic = (10, 20)
>> dhibic[1] ¶    // → 10

xogta = (42, "Hayo", #1, 3.14)
>> xogta[3] ¶     // → #1

// Magac leh
qofka = (magaca: "Alice", da'da: 25)
>> qofka.magaca ¶    // → Alice
>> qofka[1] ¶      // → Alice  (tusmada sidoo kale way shaqaysaa, 1-sal)

// Isku-xidhan
meelaha = (x: 10, y: 20)
p = (meelaha: meelaha, calaamadda: "asal")
>> p.meelaha.x ¶        // → 10
```

**Aan la beddeli karin** — isku day kasta oo lagu beddelayo shayga tuple-ka waa cillad waqtiga orodka:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ cillad waqtiga orodka: tuple-yadu ma beddelmaan
// t[1] += 5    // ❌ isla cilladda
```

Si aad u hesho qiime la beddelay isticmaal `$~` (cusboonaysiinta hawleed) — waxay soo celisaa **tuple cusub**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asalku ma beddelmin
>> t2 ¶    // → (10, 999, 30)

// Tuple magac leh — si cad dib u dhis
qofka = (magaca: "Alice", da'da: 25)
ka_weyn  = (magaca: qofka.magaca, da'da: 26)
>> qofka.da'da ¶    // → 25
>> ka_weyn.da'da ¶     // → 26
```

---

## Hawlaha Heerka Sare

```zymbol
tirooyinka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

labanlaabay  = tirooyinka$> (x -> x * 2)                  // map  → [2,4,6…20]
sima    = tirooyinka$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
wadarta    = tirooyinka$< (0, (ururiyaha, x) -> ururiyaha + x)     // reduce → 55

// Silsilad u dhexeeya dhexdhexaadiyeyaasha
tallaabada1 = tirooyinka$| (x -> x > 3)
tallaabada2 = tallaabada1$> (x -> x * x)
>> tallaabada2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Hawlaha magaca leh waxaa si toos ah loogu diri karaa HOF
labanlaab(x) { <~ x * 2 }
wayn(x) { <~ x > 5 }
r = tirooyinka$> labanlaab       // ✅ tixraac toos ah
r = tirooyinka$| wayn       // ✅ tixraac toos ah
```

---

## Hawl-wadeenka Tuubbada

Dhanka midig waxay had iyo jeer u baahan tahay `_` sidii haysashada booska qiimaha la tuubay:

```zymbol
labanlaab = x -> x * 2
ku_dar = (a, b) -> a + b
kordhin = x -> x + 1

n1 = 5 |> labanlaab(_)        // → 10
n2 = 10 |> ku_dar(_, 5)       // → 15
n3 = 5 |> ku_dar(2, _)        // → 7

// Silsilad
n = 5 |> labanlaab(_) |> kordhin(_) |> labanlaab(_)
>> n ¶    // → 22  (5→10→11→22)
```

---

## Maaraynta Cilladaha

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "u qaybinta eber" ¶
} :! {
    >> "kuwa kale: " _err ¶    // _err waxay haysaa fariinta cilladda
} :> {
    >> "mar walba way shaqeysaa" ¶
}
```

| Nooca | Marka |
|------|------|
| `##Div` | U qaybinta eber |
| `##IO` | Fayl / nidaamka |
| `##Index` | Tusmo ka baxsan xadka |
| `##Type` | Nooca iska hor imaada |
| `##Parse` | Xog kala saarid |
| `##Network` | Cilladaha shabakada |
| `##_` | Cillad kasta (qabata-dhammaan) |

---

## Qayb-hoosaadyada

```zymbol
// lib/calc.zy — jirka qayb-hoosaadku wuxuu ku dhex jiraa bannaan-bixiyeyaasha
# calc {
    #> { ku_dar, get_PI }

    _π := 3.14159
    ku_dar(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // magaca kale waa lagama maarmaan

>> c::ku_dar(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Ku soo saaro magac dadweyne oo kala duwan
# mylib {
    #> { _ku_dar_gudaha => isugeyn }

    _ku_dar_gudaha(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::isugeyn(3, 4) ¶    // → 7  (magaca gudaha _ku_dar_gudaha waa qarsoon)
```

> **Xeerarka qayb-hoosaadyada**: gudaha `# magaca { }`, kaliya `#>`, qeexitaannada hawlaha, iyo bilawayaasha doorsoomayaasha/joogtayaasha saxan ah waa la oggol yahay. Weedhaha la fulin karo (`>>`, `<<`, loopyada, iwm.) waxay keenaan cillad E013.

---

## Qaababka Tirooyinka

Zymbol waxay tirooyinka ku soo bandhigi kartaa **69 far tiro oo Unicode** — Devanagari, Carabi-Hindi, Thai, Klingon pIqaD, Mathematical Bold, qaybaha LCD, iyo kuwo kale. Qaabka firfircooni wuxuu saameeyaa kaliya wax-soo-saarka `>>`; xisaabta guduhu waxay had iyo jeer tahay binary.

### Firfircooninta far qoraalka

Qor tirooyinka `0` iyo `9` ee far qoraalka la beegsanayo gudaha `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Carabi-Hindi (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // dib ugu celi ASCII
```

### Wax-soo-saarka iyo booleanka

```zymbol
x = 42
>> x ¶          // → 42   (default-ka ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dhibic tobanle had iyo jeer waa ASCII)
>> 1 + 2 ¶      // → ३

// Booleanka: horgalaha # had iyo jeer waa ASCII, tirooyinkuna way la qabsanayaan
>> #1 ¶         // → #१   (run ku taal Devanagari)
>> #0 ¶         // → #०   (been — way ka duwan tahay ० iskudhafka eber)

x = 28 > 4
>> x ¶          // → #१   (natiijada isbarbardhigga waxay raacdaa qaabka firfircoon)
```

### Tirooyinka saxan ah ee asalka ah

Tirooyinka far qoraal kasta oo la taageeray waa saxanno saxan ah — kala-duwanaanshaha, module-ka, isbarbardhigga:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Saxannada Boolean-ka ee far qoraal kasta

`#` + tiro `0` ama `1` oo ka timid block kasta waa saxan boolean sax ah:

```zymbol
#٠٩#
firfircoon = #١        // waxay la mid tahay #1
>> firfircoon ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **had iyo jeer waa ASCII**. `#0` (been) had iyo jeer way ka duwan tahay muuq ahaan `0` (iskudhafka eber) far qoraal kasta.

---

## Hawl-wadeennada Xogta

```zymbol
// Qaabaynta nooca
f = ##.42         // → 42.0  (loo beddelo sabaynta)
i = ###3.7        // → 4     (loo beddelo iskudhafka, wareeji)
t = ##!3.7        // → 3     (loo beddelo iskudhafka, jar)

// U qaybi xarigga si uu u noqdo tiro
v1 = #|"42"|      // → 42  (iskudhaf)
v2 = #|"3.14"|    // → 3.14  (sabayn)
v3 = #|"abc"|     // → "abc"  (nabadgelyo, cillad ma jirto)

// Wareeji / Jar
π = 3.14159265
wareeji2 = #.2|π|      // → 3.14  (wareeji ilaa 2 meelood oo tobanle)
wareeji4 = #.4|π|      // → 3.1416
jar2 = #!2|π|      // → 3.14  (jar)

// Qaabaynta tirooyinka
qaabaynta = #,|1234567|  // → 1,234,567  (koma u kala qaybin)
sayniska = #^|12345.678|    // → 1.2345678e4  (sayniseed)

// Saxannada saldhiga
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Wax-soo-saarka beddelka saldhiga
hexadecimal = 0x|255|    // → "0x00FF"
binary = 0b|65|     // → "0b1000001"
octal = 0o|8|      // → "0o10"
tobanle = 0d|255|    // → "0d0255"
```

---

## Is-dhexgalka Qolofka

```zymbol
taariikhda = <\ date +%Y-%m-%d \>     // waxay qabsataa stdout (waxaa ku jira \n dhammaadka)
>> "Maanta: " taariikhda

faylka = "data.txt"
waxa_ku_jira = <\ cat {faylka} \>      // gelinta amarada dhexdooda

wax_soo_saarka = </"./subscript.zy"/>   // samee qoraal kale oo Zymbol ah, qabso wax-soo-saarka
>> wax_soo_saarka
```

> `><` waxay qabataa doodaha CLI sida qayb xarig ah (kaliya tree-walker).

---

## Tusaalaha Dhammaystiran: FizzBuzz

```zymbol
kala_saar(tirada) {
    ? tirada % 15 == 0 { <~ "FizzBuzz" }
    _? tirada % 3  == 0 { <~ "Fizz" }
    _? tirada % 5  == 0 { <~ "Buzz" }
    _ { <~ tirada }
}

@ i:1..20 { >> kala_saar(i) ¶ }
```

---

## Tixraaca Calaamadaha

| Calaamadda | Hawlaha | Calaamadda | Hawlaha |
|--------|-----------|--------|-----------|
| `=` | doorsoome | `$#` | dhererka |
| `:=` | joogte | `$+` | ku dar (silsilad lagu xiri karo) |
| `>>` | wax-soo-saarka | `$+[i]` | geli tusmada (1-sal) |
| `<<` | wax-soo-gelinta | `$-` | ka saar koowaad qiime ahaan |
| `¶` / `\\` | xariiq cusub | `$--` | ka saar dhammaan qiime ahaan |
| `?` | haddii | `$-[i]` | ka saar tusmada (1-sal) |
| `_?` | haddii kale-haddii | `$-[i..j]` | ka saar kala-duwanaanshaha (1-sal) |
| `_` | haddii kale / kaadhadh duurjoog ah | `$?` | waxay ka kooban tahay |
| `??` | isku-dhig | `$??` | raadi dhammaan tusmooyinka (1-sal) |
| `@` | loop | `$[s..e]` | jajab (1-sal) |
| `@ N { }` | loop N jeer | `$>` | map |
| `@!` | jebi | `$\|` | filter |
| `@>` | sii wad | `$<` | reduce |
| `@:magaca { }` | loop calaamadaysan | `$/ qaybiye` | xarig u kala qaybi |
| `@:magaca!` | jebi calaamadda | `$++ a b c` | dhismo isku-xirid |
| `@:magaca>` | sii wad calaamadda | `arr[i>j>k]` | tusmo marin-biyoodka |
| `->` | lambda | `arr[i] = qiime` | cusboonaysii shayga (qaybaha kaliya) |
| `arr[i] += qiime` | cusboonaysiinta isku-dhafan | `arr[i]$~` | cusboonaysiinta hawleed (nuqul cusub) |
| `$^+` | kala sooc kor u kac (asaasiga ah) | `$^-` | kala sooc hoos u dhac (asaasiga ah) |
| `$^` | kala sooc isbarbardhig leh (tuple) | `<~` | soo celi |
| `\|>` | tuubbada | `!?` | isku day |
| `:!` | qabso | `:>` | ugu dambeyntii |
| `#1` | run | `#0` | been |
| `$!` | cillad ma tahay | `$!!` | faafin cilladda |
| `<#` | soo deji | `#>` | soo saar |
| `#` | ku dhawaaq qayb-hoosaadka | `::` | wac qayb-hoosaadka |
| `.` | galitaanka goobta | `#?` | xogta nooca |
| `#\|..\|` | u qaybi tiro | `##.` | u beddel sabaynta |
| `###` | u beddel iskudhafka (wareeji) | `##!` | u beddel iskudhafka (jar) |
| `#.N\|..\|` | wareeji | `#!N\|..\|` | jar |
| `#,\|..\|` | qaabaynta koma | `#^\|..\|` | sayniseed |
| `#d0d9#` | beddel qaabka tirada | `#09#` | dib ugu celi ASCII |
| `<\ ..\>` | fuli qolofka | `>\<` | doodaha CLI |
| `\ doorsoome` | si cad u baabi'i doorsoome | `°x` / `x°` | qeexitaanka kuleylka (toos u bilaw) |
| `>>|` | block TUI (shaashad beddel ah) | `>>~` | wax-soo-saarka meelaynta |
| `>>!` | nadiifi shaashadda | `>>?` | weydii cabbirka terminal-ka |
| `<<\|` | garaacidda furaha ee xanniban | `<<\|?` | sahanka garaacidda furaha ee aan xannibnayn |
| `@~ N` | seexo N milisekundo | `$*` | ku celi xarigga N jeer |

---

## Diiwaanka Isbeddellada Siideynta

### v0.0.5 — Aasaasyada TUI, Qeexitaanka Kuleylka & Ku Celinta Xarigga _(Maajo 2026)_

- **Jebinaya** Kala-qaybiyaha cududda isku-dhigista: `qaabka : natiijada` → `qaabka => natiijada`
- **Jebinaya** Magaca kale ee soo dejinta: `<# dariiqa <= magaca_kale` → `<# dariiqa => magaca_kale`
- **Jebinaya** Dib u magacaabista soo saarista: `#> { fn <= dadweyne }` → `#> { fn => dadweyne }`
- **Lagu daray** Block TUI `>>| { }` — shaashad beddel ah + qaab cayriin; way nadiifisaa markaad baxdo
- **Lagu daray** Wax-soo-saarka meelaynta `>>~ (safka, tiirka, BKS, fg, bg) > walxaha` — goobo baahsan, 256 midab oo ANSI ah
- **Lagu daray** Gelinta furaha `<<| doorsoome` (xanniban) iyo `<<|? doorsoome` (sahanka aan xannibnayn)
- **Lagu daray** `>>!` nadiifi shaashadda, `>>?` weydii cabbirka terminal-ka, `@~ N` seexo N milisekundo
- **Lagu daray** Qeexitaanka kuleylka `°x` / `x°` — si toos ah u bilaw doorsoome isticmaalka koowaad ee loopyada
- **Lagu daray** Ku celinta xarigga `xarig $* N` — ku celi xarig N jeer
- **VM** Sinnaanta: 436/436 tijaabooyinku way gudbeen

### v0.0.4 — Tusmeynta 1-sal, Hawlaha Darajada Koowaad & Qayb-hoosaadyada Block-ka _(Abriil 2026)_

- **Jebinaya** Dhammaan tusmeynta waxaa loo beddelay **1-sal** — `arr[1]` waa shayga koowaad; `arr[0]` waa cillad waqtiga orodka
- **Lagu daray** Hawlaha magaca leh waa **qiimayaasha darajada koowaad** — si toos ah ugu dir HOF: `tirooyinka$> labanlaab`
- **Lagu daray** **Naxwaha block-ka waa lagama maarmaan** qayb-hoosaadyada: `# magaca { ... }` — naxwaha fidsan waa la saaray
- **Lagu daray** Tusmeynta cabbirro badan: `arr[i>j>k]` (marin-biyoodka), `arr[p ; q]` (soo saarista fidsan)
- **Lagu daray** Qaabaynta nooca: `##.odhaah` (sabayn), `###odhaah` (iskudhaf wareeji), `##!odhaah` (iskudhaf jar)
- **Lagu daray** Qaybinta xarigga: `xarig$/ qaybiye` — waxay soo celisaa `Array(xarig)`
- **Lagu daray** Dhismaha isku-xiridka: `saldhigga$++ a b c` — waxay ku darshaa walxo badan
- **Lagu daray** Loop-ka jeerarka: `@ N { }` — ku celi saxan N jeer
- **Lagu daray** Naxwaha loop-ka calaamadaysan: `@:magaca { }`, `@:magaca!`, `@:magaca>` — waxay beddeshaa `@ @magaca` / `@! magaca`
- **Lagu daray** Xeerarka baalka doorsoomayaasha: doorsoomayaasha `_magaca` waxay leeyihiin baal block oo sax ah; `\ doorsoome` waxay si degdeg ah u baabiiyaa
- **Lagu daray** Qaababka isbarbardhigga ee isku-dhigista: `< 0 =>`, `> 5 =>`, `== 42 =>`, iwm.
- **Lagu daray** Cilladda qayb-hoosaadka E013: weedhaha la fulin karo ee jirka qayb-hoosaadka waa mamnuuc
- **La hagaajiyay** `alias.CONST` hadda waxay si sax ah u xallisaa; `#>` waxay ka imaan kartaa ka dib qeexitaannada hawlaha
- **VM** Sinnaan dhammaystiran: 393/393 tijaabooyinku way gudbeen

### v0.0.3 — Nidaamyada Tirooyinka Unicode & Hagaajinta LSP _(Abriil 2026)_

- **Lagu daray** 69 block oo tiro Unicode ah oo leh calaamad-beddelka qaabka `#d0d9#`
- **Lagu daray** Saxannada Boolean-ka ee far qoraal kasta — `#१` / `#०`, `#१` / `#०`, iwm.
- **Lagu daray** Tirooyinka Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Lagu daray** Opcode-ka VM `SetNumeralMode` — sinnaan dhammaystiran oo lala yeeshay tree-walker
- **La beddelay** Wax-soo-saarka boolean `>>` hadda waxaa ku jira horgale `#` (`#0` / `#1`) qaababka oo dhan

### v0.0.2_01 — Dib U Magacaabista Hawl-wadeenka _(30 Maarso 2026)_

- **La beddelay** `c|..|` → `#,|..|` iyo `e|..|` → `#^|..|` — si ay ula socoto qoyska horgalaha `#`
- **Lagu daray** Magaca kale ee soo saarista: soo saar dib u ah xubnaha qayb-hoosaadka magac kale hoostiisa

### v0.0.2 — Dib-u-qaabaynta API-ga Ururinta & Kuwa Rakibaadda _(24 Maarso 2026)_

- **Lagu daray** Qoyska hawl-wadeenka `$` ee midoobay ee qaybaha iyo xarigga (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lagu daray** Qoondaynta burburinta qaab-dhismeedka qaybaha, tuple-yada, iyo tuple-yada magaca leh
- **Lagu daray** Tusmooyinka taban (`arr[-1]` = shayga ugu dambeeya)
- **Lagu daray** Kuwa rakibaadda asalka ah — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maarso 2026)_

- **Lagu daray** Qoondaynta isku-dhafan `^=`
- **La hagaajiyay** Kiisaska cidhifka xisaabta ee kala-qaybiyaha; hagaajinta dukumeentiga

### v0.0.1 — Siideyntii Ugu Horeysay ee Dadweynaha _(22 Maarso 2026)_

- Turjumaanka tree-walker + VM-ga diiwaangelinta (`--vm`, ~4× ka dhaqso badan, ~95% sinnaan)
- Dhismooyinka aasaasiga ah oo dhan: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Aqoonsiyeyaasha Unicode-ka oo dhammaystiran, nidaamka qayb-hoosaadyada, lambda-yada, xiritaannada, maaraynta cilladaha
- REPL, LSP, kordhinta VS Code, qaabaynta (`zymbol fmt`)

---

_Zymbol-Lang — Astaan. Caalami. Aan beddelmi karin._
