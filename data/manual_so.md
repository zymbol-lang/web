> **Ogeysiis:** Dukumiintigaan waxaa la sameeyay iyadoo la kaashanayo sirdoonka macmalka ah (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Tixraaca caadiga ah waa **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** oo ku dhex jira kaydka turjumaanka.

---

# Buug-gacmeedka Zymbol-Lang

**Zymbol-Lang** waa luqad barnaamijyeed oo astaan ah. Ma jiraan ereyo furaha ah — wax walba waa astaan. Waxay u shaqeysaa si la mid ah luqad kasta oo aadane.

- Ma jiraan `if`, `while`, `return` — kaliya `?`, `@`, `<~`
- Unicode dhammaystiran — aqoonsiyayaal luqad kasta ama emoji kasta
- Ka madax banaan luqadda aadanaha — koodku waa isku mid meel kasta

**Nooca turjumaanka**: v0.0.4 | **Daboolida tijaabada**: 393/393 (sinnaanta TW ↔ VM)

---

---

## Doorsoomayaasha iyo Joogtayaasha

```zymbol
x = 10              // doorsoome la bedeli karo
PI := 3.14159       // joogte — dib u qoondayntu waa qalad wakhtiga orodka
magac = "Alice"
firfircoon = #1     // Boolean run
👋 := "Hello"
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

## Noocyada Xogta

| Nooc | Suugaan | Calaamadda `#?` | Qoraalo |
|------|---------|-----------------|---------|
| Tiro dhan | `42`, `-7` | `###` | 64-bit oo saxeexan |
| Dhibic sabeynaysa | `3.14`, `1.5e10` | `##.` | Qoraalka sayniska waa la ogolyahay |
| Xaraf | `"qoraal"` | `##"` | Dhexgalka: `"Hello {magac}"` |
| Xaraf | `'A'` | `##'` | Hal xaraf oo Unicode ah |
| Boolean | `#1`, `#0` | `##?` | MA aha tiro — `#1 ≠ 1` |
| Saf | `[1, 2, 3]` | `##]` | Walxo isku mid ah |
| Tuupil | `(a, b)` | `##)` | Mawqifi |
| Tuupil magac leh | `(x: 1, y: 2)` | `##)` | Goobo magac leh |
| Hawl | tixraac hawl magac leh | `##()` | Heerka koowaad; waxay muujinaysaa `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Heerka koowaad; waxay muujinaysaa `<lambd/N>` |

```zymbol
// Baarista nooca — waxay soo celisaa (nooc, tirooyinka, qiimaha)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Soo-saaris iyo Gelis

```zymbol
>> "Hello" ¶                       // ¶ ama \\ xariiq cusub oo cad
>> "a=" a " b=" b ¶               // is-dul-dhig — qiimayaal badan
>> (arr$#) ¶                      // hawlwadeennada postfix waxay u baahan yihiin ( ) gudaha >>

<< magac                           // u aqri doorsoome (lama odhan)
<< "Geli magacaaga: " magac        // leh odhan
```

> `¶` (AltGr+R on keyboard-ka Isbaanishka) iyo `\\` waxay u dhigmaan xariiq cusub.

---

## Hawlwadeennada

```zymbol
// Xisaab — isticmaal qoondayn; hawlwadeennada qaarkood waxay leeyihiin astaamo toos ah gudaha >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (qaybinta tiro dhan)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kordhin)

// Isbarbardhig
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b    // #1

// Caqli
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

---

## Xarfo

```zymbol
// Laba qaab oo isku xidhidh
magac = "Alice"
n = 42

>> "Hello " magac " waxaad haysataa " n ¶       // is-dul-dhig — gudaha >>
sharraxaad = "Hello {magac}, waxaad haysataa {n}"   // dhexgal — meel kasta
```

```zymbol
s = "Hello Dunida"
dherer = s$#                  // 11
cabir = s$[1..5]              // "Hello"  (saldhig-1, dhamaadka lagu daray)
waxaa_jira = s$? "Dunida"     // #1
qaybo = "a,b,c,d"$/ ','       // [a, b, c, d]  (u qaybi kala-qaate)
beddelay = s$~~["a":"o"]      // "Hello Dunido"
beddelay1 = s$~~["a":"o":1]   // "Hello Dunida" (kaliya N-ka hore)
```

> `+` waxaa loogu talagalay tirooyinka kaliya. Xarfaha, isticmaal `,`, is-dul-dhig, ama dhexgel.

---

## Socodka Xakamaynta

```zymbol
x = 7

? x > 0 { >> "wax togan" ¶ }

? x > 100 {
    >> "weyn" ¶
} _? x > 0 {
    >> "wax togan" ¶
} _? x == 0 {
    >> "eber" ¶
} _ {
    >> "wax taban" ¶
}
```

> Qabsadeyaasha `{ }` **waa qasab** xitaa hal weedh.

---

---

## Isku-dhiga

```zymbol
// Kala-duwanaansho
dhibcaha = 85
darajo = ?? dhibcaha {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> darajo ¶     // → B

// Xarfo
midab = "guduud"
koodh = ?? midab {
    "guduud"  : "#FF0000"
    "cagaar"  : "#00FF00"
    _         : "#000000"
}

// Qaababka isbarbardhigga
heerkul = -5
xaalka = ?? heerkul {
    < 0  : "baraf"
    < 20 : "qabow"
    < 35 : "diirran"
    _    : "kulul"
}
>> xaalka ¶      // → baraf

// Qaabka weedhaha (baloogyo)
?? n {
    0        : { >> "eber" ¶ }
    _? n < 0 : { >> "wax taban" ¶ }
    _        : { >> "wax togan" ¶ }
}
```

---

## Wareegyo

```zymbol
@ i:0..4  { >> i " " }        // kala-duwanaansho lagu daray:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // leh tallaabo:               1 3 5 7 9
@ i:5..0:1 { >> i " " }       // rogrogid:                   5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (halka)

miraha = ["tufaax", "canbe", "iinab"]
@ m:miraha { >> m ¶ }         // walax kasta oo safka ku jirta

@ x:"hello" { >> x "-" }
>> ¶                          // → h-e-l-l-o-  (xaraf kasta oo xarafka ku jira)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> sii wad
    ? i > 7 { @! }            // @! jabiyo
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Wareeg aan dhamaanayn
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Wareeg sumad leh (jebin isku dhex milmay)
tiraawe = 0
@:dibadda {
    tiraawe++
    ? tiraawe >= 3 { @:dibadda! }
}
>> tiraawe ¶                  // → 3
```

---

---

## Hawlaha

```zymbol
ku_dar(a, b) { <~ a + b }
>> ku_dar(3, 4) ¶   // → 7

isku_dhurasho(n) {
    ? n <= 1 { <~ 1 }
    <~ n * isku_dhurasho(n - 1)
}
>> isku_dhurasho(5) ¶    // → 120
```

Hawluhu waxay leeyihiin **baahsan gooni ah** — ma akhrin karaan doorsoomayaasha dibadda. Isticmaal cabbirrada soo-saarka `<~>` si aad wax uga beddesho doorsoomayaasha qofka baaqaya:

```zymbol
beddel(a<~, b<~) {
    ku_meel_gaar = a
    a = b
    b = ku_meel_gaar
}
x = 10
y = 20
beddel(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Hawlaha magac leh **waa qiimayaal heerka koowaad** — si toos ah u dir: `nums$> labanlaab`. `x -> fn(x)` sidoo kale waa sax.

---

---

## Lambda-yada iyo Xirista

```zymbol
labanlaab = x -> x * 2
ku_dar = (a, b) -> a + b
>> labanlaab(5) ¶   // → 10
>> ku_dar(3, 7) ¶   // → 10

// Lambda baloog ah
kala_saar = x -> {
    ? x > 0 { <~ "wax togan" }
    _? x < 0 { <~ "wax taban" }
    <~ "eber"
}

// Xiritaan — waxay qabsataa baahsan dibadda
wax_ka_qabso = 3
saddexlaab = x -> x * wax_ka_qabso
>> saddexlaab(7) ¶   // → 21

// Warshad
samee_ku_dareeye(n) { <~ x -> x + n }
ku_dar_toban = samee_ku_dareeye(10)
>> ku_dar_toban(5) ¶   // → 15

// Safka dhexdiisa
hawl_wadeeno = [x -> x+1, x -> x*2, x -> x*x]
>> hawl_wadeeno[3](5) ¶   // → 25
```

---

## Safaf

Safafku waa **la bedeli karaa** waxayna ka kooban yihiin walxo **iskku mid ah**.

```zymbol
saf = [1, 2, 3, 4, 5]

saf[1]          // 1 — gelid (saldhig-1: walaxda koowaad)
saf[-1]         // 5 — tusmo diidmo ah (walaxda u dambaysa)
saf$#           // 5 — dherer (isticmaal (saf$#) gudaha >>)

saf = saf$+ 6            // ku dar → [1,2,3,4,5,6]
saf2 = saf$+[2] 99       // geli booska 2 (saldhig-1)
saf3 = saf$- 3           // ka saar muuqaalka koowaad ee qiimaha
saf4 = saf$-- 3          // ka saar dhammaan muuqaalada
saf5 = saf$-[1]          // ka saar tusmada 1 (walaxda koowaad)
saf6 = saf$-[2..3]       // ka saar kala-duwanaanshaha (saldhig-1, dhamaadka lagu daray)

waxaa_jira = saf$? 3     // #1 — waxay ka kooban tahay
boosaska = saf$?? 3      // [3] — dhammaan tusmooyinka qiimaha (saldhig-1)
jajab = saf$[1..3]       // [1,2,3] — jajab (saldhig-1, dhamaadka lagu daray)
jajab2 = saf$[1:3]       // [1,2,3] — isku mid, naxwaha tirada ku salaysan

sare_uyo = saf$^+        // kala sooc sare (kaliya kuwa asaasiga ah)
hoos_u_dhac = saf$^-     // kala sooc hoos (kaliya kuwa asaasiga ah)

// Safafka tuupilka magac leh/mawqif leh — isticmaal $^ laambda isbarbardhigga leh
xog = [(magac: "Karla", da': 28), (magac: "Ana", da': 25), (magac: "Bob", da': 30)]
ku_saleysan_da'  = xog$^ (a, b -> a.da' < b.da')      // sare u kac ku saleysan da'da (<)
ku_saleysan_magac  = xog$^ (a, b -> a.magac > b.magac) // hoos u dhac ku saleysan magaca (>)
>> ku_saleysan_da'[1].magac ¶    // → Ana
>> ku_saleysan_magac[1].magac ¶  // → Karla

// Cusbooneysiinta walaxda tooska ah (safafka kaliya)
saf[1] = 99              // qoondey
saf[2] += 5              // isku dhafan: +=  -=  *=  /=  %=  ^=

// Cusbooneysiinta hawlaha — waxay soo celisaa saf cusub; asalku kuma beddelmina
saf2 = saf[2]$~ 99
```

> Dhammaan hawlwadeennada ururinta waxay soo celiyaan **saf cusub**. Dib u qoondey: `saf = saf$+ 4`.
> `$+` waa la silsiladaysan karaa: `saf = saf$+ 5$+ 6$+ 7`. Hawlwadeennada kale waxay isticmaalaan qoondayn dhexdhexaad ah.
> **Tusmayntu waa saldhig-1**: `saf[1]` waa walaxda koowaad; `saf[0]` waa qalad wakhtiga orodka.
> `$^+` / `$^-` waxay kala soocaan **safafka asaasiga ah** (tirooyinka, xarfaha). Safafka tuupilka, isticmaal $^ leh laambda isbarbardhigga — jihada waxaa lagu codeeyay laambda dhexdeeda (`<` = sare u kac, `>` = hoos u dhac).

**Macnaha qiimaha** — in saf loo qoondeeyo doorsoome kale waxay abuurtaa nuqul madax banaan:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b saamayn ma leh
```

```zymbol
// Safaf isku dhex milmay (tusmaynta saldhig-1)
shax = [[1,2,3],[4,5,6],[7,8,9]]
>> shax[2][3] ¶    // → 6  (safka 2, tiirka 3)
```

---

---

## Burburin

```zymbol
// Saf
saf = [10, 20, 30, 40, 50]
[a, b, c] = saf               // a=10  b=20  c=30
[koowaad, *intaa_kadib] = saf    // koowaad=10  intaa_kadib=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ waa la iska indho tiray

// Tuupil mawqif
dhibic = (100, 200)
(px, py) = dhibic            // px=100  py=200

// Tuupil magac leh
qof = (magac: "Ana", da': 25, magaalo: "Madrid")
(magac: m, da': d) = qof      // m="Ana"  d=25
```

---

## Tuupil

Tuupilku waa weelal **aan la beddeli karin** oo la kala horreeyo oo qaadi kara qiimayaal **noocyo kala duwan ah**.
Si ka duwan safafka, walxaha lama beddeli karo ka dib marka la sameeyo.

```zymbol
// Mawqif — noocyada isku dhafan waa la oggol yahay
dhibic = (10, 20)
>> dhibic[1] ¶     // → 10

xog = (42, "hello", #1, 3.14)
>> xog[3] ¶        // → #1

// Magac leh
qof = (magac: "Alice", da': 25)
>> qof.magac ¶      // → Alice
>> qof[1] ¶         // → Alice  (tusmada sidoo kale way shaqaysaa, saldhig-1)

// Isku dhex milmay
boos = (x: 10, y: 20)
p = (boos: boos, calaamad: "asal")
>> p.boos.x ¶       // → 10
```

**Aan la beddeli karin** — isku day kasta oo lagu beddelayo walax tuupil waa qalad wakhtiga orodka:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ qalad wakhtiga orodka: tuupilka lama beddeli karo
// t[1] += 5    // ❌ isla qalad

// Tuupil magac leh — dib u dhis si cad
qof = (magac: "Alice", da': 25)
ka_weyn = (magac: qof.magac, da': 26)
>> qof.da' ¶       // → 25
>> ka_weyn.da' ¶    // → 26
```

Si aad u hesho qiime la beddelay isticmaal `$~` (cusbooneysiinta hawlaha) — waxay soo celisaa tuupil **cusub**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asalku ma beddelmin
>> t2 ¶    // → (10, 999, 30)
```

---

---

## Hawlaha Heerka Sare

```zymbol
tirooyinka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

labanlaabay = tirooyinka$> (x -> x * 2)                // khariidaynta → [2,4,6…20]
sima   = tirooyinka$| (x -> x % 2 == 0)              // sifaynta → [2,4,6,8,10]
wadar    = tirooyinka$< (0, (ururin, x) -> ururin + x) // dhimista → 55

// Silsilad iyada oo loo marayo dhexdhexaadiyeyaal
talaabo1 = tirooyinka$| (x -> x > 3)
talaabo2 = talaabo1$> (x -> x * x)
>> talaabo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Hawlaha magac leh waxaa si toos ah loogu diri karaa hawlaha heerka sare
labanlaab(x) { <~ x * 2 }
weynyahay(x) { <~ x > 5 }
r = tirooyinka$> labanlaab       // ✅ tixraac toos ah
r = tirooyinka$| weynyahay       // ✅ tixraac toos ah
```

---

---

## Hawlwadeega Tuubada

Dhinaca midig waxay had iyo jeer u baahan tahay `_` si ay boos ugu hayso qiimaha la tuubaynayo:

```zymbol
labanlaab = x -> x * 2
ku_dar = (a, b) -> a + b
korodhsi = x -> x + 1

5 |> labanlaab(_)        // → 10
10 |> ku_dar(_, 5)       // → 15
5 |> ku_dar(2, _)        // → 7

// Silsiladaysan
r = 5 |> labanlaab(_) |> korodhsi(_) |> labanlaab(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Maaraynta Qaladka

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "qaybinta eber" ¶
} :! {
    >> "qalad kale: " _err ¶    // _err waxay haysaa fariinta qaladka
} :> {
    >> "had iyo jeer waa shaqeysaa" ¶
}
```

| Nooc | Goorma |
|------|--------|
| `##Div` | Qaybinta eber |
| `##IO` | Fayl / nidaam |
| `##Index` | Tusmo ka baxsan xadadka |
| `##Type` | Is waafajin la'aanta nooca |
| `##Parse` | Falanqaynta xogta |
| `##Network` | Qaladada shabakada |
| `##_` | Qalad kasta (wax kasta qabta) |

---

---

## Qaybaha

```zymbol
// lib/calc.zy — jirka qaybta wuxuu ku dhex jiraa qabsadeyaasha
# calc {
    #> { ku_dar, get_PI }

    _PI := 3.14159
    ku_dar(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // magac beddelka ayaa loo baahan yahay

>> c::ku_dar(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Ku soo saarid magac dadweyne oo kale ah
# maktabada_ iisa {
    #> { _ku_dar_gudaha <= wadarta }

    _ku_dar_gudaha(a, b) { <~ a + b }
}
```

```zymbol
<# ./maktabada_ iisa <= m

>> m::wadarta(3, 4) ¶    // → 7  (magaca gudaha _ku_dar_gudaha waa la qariyay)
```

> **Xeerarka qaybaha**: gudaha `# magac { }`, kaliya `#>`, qeexitaannada hawlaha, iyo bilowgayaasha doorsoome/joogte ee suugaan ayaa la oggol yahay. Weedhaha la fulin karo (`>>`, `<<`, wareegyada, iwm.) waxay keenaan qalad E013.

---

---

## Xaaladaha Tirooyinka

Zymbol waxay tirooyinka ku soo bandhigi kartaa **69 baloog tiro oo Unicode ah** — Devanagari, Carabi-Hindi, Taylandi, Kilingon pIqaD, Xarfo culus oo Xisaabta ah, qaybo LCD ah, iyo waxyaabo kale. Xaaladda firfircooni waxay saameyn ku yeelataa soo-saarista `>>` kaliya; xisaabta gudaha ah had iyo jeer waa labaale.

### Firfircoonaynta far

Qor tirooyinka `0` iyo `9` ee farta la beegsanayo gudaha `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Carabi-Hindi   (U+0660–U+0669)
#๐๙#    // Taylandi       (U+0E50–U+0E59)
#09#    // dib ugu celi ASCII
```

---

### Soo-saarista iyo Booleanka

```zymbol
x = 42
>> x ¶          // → 42   (taas oo ah ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dhibic tobanle had iyo jeer waa ASCII)
>> 1 + 2 ¶      // → ३

// Booleanka: horgale # had iyo jeer waa ASCII, tiro way la qabsanaysaa
>> #1 ¶         // → #१   (run Devanagari gudaheed)
>> #0 ¶         // → #०   (been — way ka duwan tahay ० eber tiro dhan)

x = 28 > 4
>> x ¶          // → #१   (natiijada isbarbardhigga waxay raacaysaa xaaladda firfircoon)
```

---

## Tirooyinka asalka ah ee koodka isha ku jira

Tirooyinka far kasta oo la taageero waa suugaan sax ah — kala-duwanaanshaha, qaybinta, isbarbardhigyada:

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

### Suugaanta Booleanka ee far kasta

`#` + tiro `0` ama `1` oo ka yimid baloog kasta waa suugaan Boolean oo sax ah:

```zymbol
#०९#
firfircoon = #१        // la mid ah #1
>> firfircoon ¶        // → #१
>> (#१ && #०) ¶        // → #०
```

> `#` **had iyo jeer waa ASCII**. `#0` (been) had iyo jeer way ka duwan tahay muuqaal ahaan `0` (eber tiro dhan) far kasta.

---

---

## Hawlwadeennada Xogta

```zymbol
// Beddelidda nooca
##.42         // → 42.0  (Dhibic sabeynaysa)
###3.7        // → 4     (Tiro dhan, soo wareejin)
##!3.7        // → 3     (Tiro dhan, jarid)

// Falanqaynta xarafka si loo helo tiro
v1 = #|"42"|      // → 42  (Tiro dhan)
v2 = #|"3.14"|    // → 3.14  (Dhibic sabeynaysa)
v3 = #|"abc"|     // → "abc"  (badbaado leh, qalad ma jiro)

// Soo wareejin / jarid
pi = 3.14159265
soo_wareeji2 = #.2|pi|     // → 3.14  (soo wareeji 2 boos tobanle)
soo_wareeji4 = #.4|pi|     // → 3.1416
jar2 = #!2|pi|             // → 3.14  (jar)

// Qaabaynta tirada
qaab = #,|1234567|   // → 1,234,567  (kala soocid comma)
saynisi = #^|12345.678| // → 1.2345678e4  (saynisi)

// Suugaanta saldhigga
a = 0x41         // → 'A'  (laba iyo tobanle)
b = 0b01000001   // → 'A'  (labaale)
c = 0o101        // → 'A'  (siddeedle)

// Soo-saarista beddelidda saldhigga
laba_iyo_tobanle = 0x|255|    // → "0x00FF"
labaale = 0b|65|             // → "0b1000001"
siddeedle = 0o|8|            // → "0o10"
tobanle = 0d|255|            // → "0d0255"
```

---

---

## Is-dhexgalka Qolofka

```zymbol
taariikh = <\ date +%Y-%m-%d \>     // waxay qabataa stdout (waxaa ku jira \n dhamaadka)
>> "Maanta: " taariikh

fayl = "xogta.txt"
nuxurka = <\ cat {fayl} \>          // dhexgalka amarrooyinka

soo_saar = </"./subscript.zy"/>     // samee qoraal kale oo Zymbol ah, qabso soo-saarista
>> soo_saar
```

> `><` waxay u qabataa doodaha CLI siday u kala horreeyaan saf tiro ah (tree-walker kaliya).

---

---

## Tusaale Dhammaystiran: FizzBuzz

```zymbol
kala_saar(tiro) {
    ? tiro % 15 == 0 { <~ "FizzBuzz" }
    _? tiro % 3  == 0 { <~ "Fizz" }
    _? tiro % 5  == 0 { <~ "Buzz" }
    _ { <~ tiro }
}

@ i:1..20 { >> kala_saar(i) ¶ }
```

---

## Tixraaca Astaamaha

| Astaanta | Hawlaha | Astaanta | Hawlaha |
|----------|---------|----------|---------|
| `=` | doorsoome | `$#` | dherer |
| `:=` | joogte | `$+` | ku dar (la silsiladaysan karo) |
| `>>` | soo-saar | `$+[i]` | geli tusmada (saldhig-1) |
| `<<` | gelin | `$-` | ka saar koowaad iyadoo loo eegayo qiimaha |
| `¶` / `\\` | xariiq cusub | `$--` | ka saar dhammaan iyadoo loo eegayo qiimaha |
| `?` | haddii | `$-[i]` | ka saar tusmada (saldhig-1) |
| `_?` | haddii kale haddii | `$-[i..j]` | ka saar kala-duwanaanshaha (saldhig-1) |
| `_` | haddii kale / bakhti | `$?` | waxaa ku jira |
| `??` | isku-dhig | `$??` | raadi dhammaan tusmooyinka (saldhig-1) |
| `@` | wareeg | `$[s..e]` | jajab (saldhig-1) |
| `@ N { }` | wareeg N jeer | `$>` | khariidayn |
| `@!` | jabiyo | `$|` | sifee |
| `@>` | sii wad | `$<` | dhimo |
| `@:magac { }` | wareeg sumad leh | `$/ kala-qaate` | kala qaybinta xarafka |
| `@:magac!` | jabiyo sumad leh | `$++ a b c` | dhismaha isku xidhka |
| `@:magac>` | sii wad sumad leh | `saf[i>j>k]` | tusmada hagista |
| `->` | lambda | `saf[i] = qiimo` | cusbooneysii walaxda (safafka kaliya) |
| `saf[i] += qiimo` | cusbooneysiin isku dhafan | `saf[i]$~` | cusbooneysiin hawl (nuqul cusub) |
| `$^+` | kala sooc sare (asaasiga ah) | `$^-` | kala sooc hoose (asaasiga ah) |
| `$^` | kala sooc leh isbarbardhig (tuupil) | `<~` | soo celi |
| `|>` | tuubada | `!?` | isku day |
| `:!` | qabasho | `:>` | ugu dambeyn |
| `#1` | run | `#0` | been |
| `$!` | waa qalad | `$!!` | faafin qaladka |
| `<#` | soo dejiso | `#>` | soo saar |
| `#` | ku dhawaaq qaybta | `::` | u yeedh qaybta |
| `.` | gelida goobta | `#?` | xogta nooca |
| `#\|..\|` | falanqaynta tirada | `##.` | u beddel Dhibic sabeynaysa |
| `###` | u beddel Tiro dhan (soo wareeji) | `##!` | u beddel Tiro dhan (jar) |
| `#.N\|..\|` | soo wareeji | `#!N\|..\|` | jar |
| `#,\|..\|` | qaabaynta comma | `#^\|..\|` | saynisi |
| `#d0d9#` | beddel xaaladda tirada | `#09#` | dib ugu celi ASCII |
| `<\ ..\>` | samee qolofka | `>\<` | doodaha CLI |
| `\ var` | baabi doorsoome si cad | | |

---

---

## Diiwaanka Isbeddellada Siidaynta

### v0.0.4 — Tusmaynta Saldhig-1, Hawlaha Heerka Koowaad & Baloogyada Qaybaha _(Abriil 2026)_

- **Jabiya** Dhammaan tusmaynta waxaa loo beddelay **saldhig-1** — `saf[1]` waa walaxda koowaad; `saf[0]` waa qalad wakhtiga orodka
- **Lagadaray** Hawlaha magac leh **waa qiimayaal heerka koowaad** — si toos ah ugu dir hawlaha heerka sare: `nums$> labanlaab`
- **Lagadaray** **Naxwaha baloogga** qaybaha waa qasab: `# magac { ... }` — naxwaha fidsan waa la saaray
- **Lagadaray** Tusmaynta cabbirro badan: `saf[i>j>k]` (hagista), `saf[p ; q]` (soo saarid fidsan)
- **Lagadaray** Beddelidda nooca: `##.odhaah` (Dhibic sabeynaysa), `###odhaah` (Tiro dhan soo wareeji), `##!odhaah` (Tiro dhan jar)
- **Lagadaray** Kala qaybinta xarafka: `xaraf$/ kala-qaate` — waxay soo celisaa `Array(Xaraf)`
- **Lagadaray** Dhismaha isku xidhka: `saldhig$++ a b c` — waxay ku dartaa walxo badan
- **Lagadaray** Wareeg N jeer: `@ N { }` — ku celi si sax ah N jeer
- **Lagadaray** Naxwaha wareegyada sumadaha leh: `@:magac { }`, `@:magac!`, `@:magac>` — waxay bedeshay `@ @magac` / `@! magac`
- **Lagadaray** Xeerarka baahsan ee doorsoomaha: doorsoomayaasha `_magac` waxay leeyihiin baahsan baloog oo sax ah; `\ var` waa u baabiiyaa goor hore
- **Lagadaray** Qaababka isbarbardhigga ee isku-dhigga: `< 0 :`, `> 5 :`, `== 42 :`, iwm
- **Lagadaray** Qaladka qaybta E013: weedhaha la fulin karo ee jirka qaybta ku jira waa mamnuuc
- **La hagaajiyay** `take_variable` hada ma baabiyeejoogtayaasha qaybta marka dib loo qorayo
- **La hagaajiyay** `alias.CONST` hada si sax ah ayay u xallinaysaa; `#>` waxay ka dhici kartaa ka dib qeexitaannada hawlaha
- **VM** Sinnaan dhammaystiran: 393/393 tijaaboo ah ayaa gudbay

### v0.0.3 — Nidaamyada Tirooyinka Unicode & Hagaajinta LSP _(Abriil 2026)_

- **Lagadaray** 69 baloog tiro oo Unicode ah oo leh calaamadda beddelka xaaladda `#d0d9#`
- **Lagadaray** Suugaanta Boolean ee far kasta — `#१` / `#०`, `#१` / `#०`, iwm
- **Lagadaray** Tirooyinka Kilingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Lagadaray** `SetNumeralMode` opcode VM — sinnaan dhammaystiran oo lala yeelanayo socod-baraha geedka
- **Lagadaray** REPL waxay ixtiraamaysaa xaaladda tirada ee firfircoon ee codaynta iyo soo-bandhigidda doorsoomaha
- **La beddelay** Boolean `>>` soo-saarista hada waxaa ku jira horgale `#` (`#0` / `#1`) dhammaan xaaladaha

### v0.0.2_01 — Beddelida Magaca Hawlwadeega _(30 Maarso 2026)_

- **La beddelay** `c|..|` → `#,|..|` iyo `e|..|` → `#^|..|` — waafaqsan qoyska horgalaha qaabaynta `#`
- **Lagadaray** Magac beddelka soo-saarista — dib u soo saar xubnaha qaybta magac kale hoostiisa

### v0.0.2 — Dib-u-qaabaynta API-ga Uruurinta & Kuwa Rakibaadda _(24 Maarso 2026)_

- **Lagadaray** Qoyska hawlwadeega `$` ee midoobay ee safafka iyo xarfaha (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Lagadaray** Qoondaynta burburinta ee safafka, tuupilka, iyo tuupilka magac leh
- **Lagadaray** Tusmooyinka diidmada ah (`saf[-1]` = walaxda u dambaysa)
- **Lagadaray** Kuwa rakibaadda asalka ah — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maarso 2026)_

- **Lagadaray** Qoondayn isku dhafan `^=`
- **La hagaajiyay** Kiisaska geeska ah ee xisaabta ee falanqeeyaha; sixitaannada dukumiintiga

### v0.0.1 — Siidaynta Guud ee Koowaad _(22 Maarso 2026)_

- Turjumaane socod-baraha geedka + VM diiwaangeliyey (`--vm`, ~4× ka dheereeya, ~95% sinnaan)
- Dhammaan qaab-dhismeedka asaasiga ah: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Aqoonsiyayaasha Unicode ee dhammaystiran, nidaamka qaybaha, lambda-yada, xiritaannada, maaraynta qaladka
- REPL, LSP, Kordhinta VS Code, qaabaynta (`zymbol fmt`)

---

_Zymbol-Lang — Astaan. Caalami. Aan la beddeli karin._
