> **Nout:** Dis dokumentieshan mek wid asisans a artifishal intelijens (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Di kanonikaal referens a **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** inna di interpreter ripazitori.

---

# Zymbol-Lang Manyuwaal

> **Riviyu fi v0.0.5 — 2026-05-12**

**Zymbol-Lang** a wan simbolik prograaming langwij. Nuh keyword — evriting a simbl. Wok di siem inna eni yuuman langwij.

- Nuh `if`, `while`, `return` — oanli `?`, `@`, `<~`
- Fuul Yunikoord — identifier inna eni langwij ar emoji
- Langwij-agnostik — di kuod siem evriwe

**Interpreter vashon**: v0.0.5 | **Test kovareij**: 436/436 (TW ↔ VM parity)

---

## Variabl dem & Kanstant dem

```zymbol
x = 10              // variabl dat kyaan chienj
PI := 3.14159       // kanstant — chienj it gi runtime erri
niem = "Alis"
aktiv = #1         // boolean tru
👋 := "Wah gwaan"
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

`°` (digriy sain, U+00B0) auto-staat a variabl to im natchral vaalyu pan fos yuuz:

```zymbol
nomz = [3, 1, 4, 1, 5]
@ n:nomz {
    °tuutal += n    // auto-staat to 0 abuv luup; kiip laas afta @
}
>> tuutal ¶         // → 14
```

> `°x` (prefix) angka abuv di luup — rizalt aksesibl afta `@`.
> `x°` (postfix) angka insaid di luup — ded wen luup don.
> Tree-walker oanli.

---

## Tipo a Daata

| Tipo | Literal | `#?` tag | Nuot |
|------|---------|----------|------|
| Intija | `42`, `-7` | `###` | 64-bit saind |
| Flout | `3.14`, `1.5e10` | `##.` | Saiintifik notieshan OK |
| String | `"text"` | `##"` | Interpolieshan: `"Wah gwaan {niem}"` |
| Kyarakta | `'A'` | `##'` | Wan Yunikoord kyarakta |
| Bool | `#1`, `#0` | `##?` | NAH nomba — `#1 ≠ 1` |
| Arei | `[1, 2, 3]` | `##]` | Siem tipo ilement |
| Tyuupl | `(a, b)` | `##)` | Pozishanal |
| Niem Tyuupl | `(x: 1, y: 2)` | `##)` | Niem fild dem |
| Funkshan | niem funkshan ref | `##()` | First-klaas; sho `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-klaas; sho `<lambd/N>` |

```zymbol
// Tipo inspekshan — riton (tipo, digit dem, vaalyu)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Owutput & Input

```zymbol
>> "Wah gwaan" ¶                   // ¶ ar \\ fi nyuu lain
>> "a=" a " b=" b ¶                // jixtapozishan — nuff vaalyu
>> (arei$#) ¶                      // postfiks opirietor niid ( ) inna >>

<< niem                            // riid inna variabl (nuh prompt)
<< "Put yuh niem: " niem           // wid prompt
```

> `¶` (AltGr+R pan Spanish kibod) an `\\` a di siem nyuu lain.

---

## TUI Primitiv dem

Terminal UI opirietor dem fi interaktiv prograam. Muos niid a `>>| { }` blok (alt skrein + raw muud).

```zymbol
>>| {
    >>!                             // klia alt skrein
    >>~ (1, 1, 0, 10) > "A ron"    // rou 1, kol 1, fg=10 (griin)
    @~ 1000                         // slip 1 sekond (1000 ms)
    >>~ (2, 1) > "Dun."
}
// terminal ristor aatumatikli pan exit
```

```zymbol
// Kipress an terminal saiz
>>| {
    [rou, kol] = >>?                // kwieri terminal saiz
    >>~ (1, 1) > "Terminal: " rou " x " kol
    <<| ki                          // blokin kipress riid
    >>~ (2, 1) > "Press: " ki
}
```

> `>>!` klia skrein. `>>?` riton `[rou, kol]`. `@~ N` slip N milisekond.
> `<<|` riid wan kipress (blokin); `<<|?` pol widout blokin (riton `'\0'` if nun).
> Pozishand owutput tyuupl: `(rou, kol, BKS, fg, bg)` — eni slot kyan lef owt wid koma (`>>~ (,,, 196) > "red"`).
> BKS bitmask: `1`=Bold, `2`=Italic, `4`=Underline. ANSI 256-kala palet (`0`=terminal difaalt).
> Tree-walker oanli (eksept `>>!`, `>>?`, `@~`, `>>~` weh run inna `--vm` tu).

---

## Opirietor dem

```zymbol
// Aritmitik
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (intija divijhan)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (eksponienshieshan)

// Kompierisan — asain fi inspek
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a <= b    // #0
k5 = a > b     // #1
k6 = a >= b    // #1

// Lojikaal
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## String dem

```zymbol
// Tu weiz fi konkaat
niem = "Alis"
n = 42

>> "Wah gwaan " niem " yuh av " n ¶    // jixtapozishan — inna >>
deskripshan = "Wah gwaan {niem}, yuh av {n}"  // interpolieshan — eniweh
```

```zymbol
s = "Wah gwaan Wol"
lent = s$#                  // 13
sub = s$[1..9]              // "Wah gwaan"  (staat 1, end inkluusiv)
av = s$? "Wol"              // #1
paats = "a,b,c,d"$/ ','     // [a, b, c, d]  (split bai dilimita)
rep = s$~~["a":"A"]         // "WAh gwAAn Wol"
rep1 = s$~~["a":"A":1]      // "WAh gwaan Wol"  (fos N oanli)
lain = "─" $* 20            // "────────────────────"  (ripiit N taim)
```

> `+` a fi nomba oanli. Yuuz `,`, jixtapozishan, ar interpolieshan fi string dem.

---

## Kontrol Flo

```zymbol
eks = 7

? eks > 0 { >> "pozitiv" ¶ }

? eks > 100 {
    >> "big" ¶
} _? eks > 0 {
    >> "pozitiv" ¶
} _? eks == 0 {
    >> "ziro" ¶
} _ {
    >> "negativ" ¶
}
```

> `{ }` bresis **obligeytid** iiven fi wan stetment.

---

## Mach

```zymbol
// Rienj dem
skuo = 85
grieyd = ?? skuo {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> grieyd ¶    // → B

// String dem
kala = "red"
kuod = ?? kala {
    "red"   => "#FF0000"
    "green" => "#00FF00"
    _       => "#000000"
}

// Kompierisan petaan
temp = -5
stiet = ?? temp {
    < 0  => "aais"
    < 20 => "kuul"
    < 35 => "waam"
    _    => "aat"
}
>> stiet ¶    // → aais

// Stetment faam (blok aam dem)
n = -3
?? n {
    0    => { >> "ziro" ¶ }
    < 0  => { >> "negativ" ¶ }
    _    => { >> "pozitiv" ¶ }
}
```

---

## Luup dem

```zymbol
@ i:0..4  { >> i " " }        // rienj inkluusiv:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // wid step:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ribaks:            5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fuut = ["apl", "pia", "grieip"]
@ f:fuut { >> f ¶ }           // fi iich-wan inna arei

@ c:"ello" { >> c "-" }
>> ¶                          // → e-l-l-o-  (fi iich-wan inna string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> kontinyu
    ? i > 7 { @! }             // @! brek
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Infinit luup
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Lievl luup (nestid brek)
kount = 0
@:owta {
    kount++
    ? kount >= 3 { @:owta! }
}
>> kount ¶                    // → 3
```

---

## Funkshan dem

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

faktoriyal(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyal(n - 1)
}
>> faktoriyal(5) ¶    // → 120
```

Funkshan dem av **aisolitid skuup** — dem kyan riid owta variabl dem. Yuuz owutput paraameeta `<~` fi modify kola variabl dem:

```zymbol
swapp(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
swapp(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Niem funkshan dem a **first-klaas vaalyu** — pas direk: `nomz$> dubl`. Fi wrap: `x -> fn(x)` vaalid tu.

---

## Lambda & Klosha dem

```zymbol
dubl = x -> x * 2
sum = (a, b) -> a + b
>> dubl(5) ¶    // → 10
>> sum(3, 7) ¶    // → 10

// Blok lambda
klaasiifai = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "ziro"
}

// Klosha — katch owta skuup
faakta = 3
trippl = x -> x * faakta
>> trippl(7) ¶    // → 21

// Faktori
mek_ada(n) { <~ x -> x + n }
add10 = mek_ada(10)
>> add10(5) ¶    // → 15

// Inna arei
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Arei dem

Arei dem **myuutabl** an uol ilement bai di **siem tipo**.

```zymbol
arei = [1, 2, 3, 4, 5]

x = arei[1]      // 1 — akses (staat 1: fos ilement)
x = arei[-1]     // 5 — negativ index (laas ilement)
x = arei$#       // 5 — lent (yuuz (arei$#) inna >>)

arei = arei$+ 6            // apend → [1,2,3,4,5,6]
arei2 = arei$+[2] 99       // insert at pozishan 2 (staat 1)
arei3 = arei$- 3           // rimuuv fos wan bai vaalyu
arei4 = arei$-- 3          // rimuuv aal
arei5 = arei$-[1]          // rimuuv at index 1 (fos ilement)
arei6 = arei$-[2..3]       // rimuuv rienj (staat 1, end inkluusiv)

av = arei$? 3            // #1 — kontien
poz = arei$?? 3           // [3] — aal index bai vaalyu (staat 1)
sl = arei$[1..3]          // [1,2,3] — slaais (staat 1, end inkluusiv)
sl2 = arei$[1:3]          // [1,2,3] — siem, kount-biez sintaks

asc = arei$^+             // suot gaan up  (primitiv oanli)
desc = arei$^-            // suot gaan dung (primitiv oanli)

// Niem/pozishanal tyuupl arei — yuuz $^ wid kompierata lambda
db = [(niem: "Kaala", iej: 28), (niem: "Ana", iej: 25), (niem: "Bob", iej: 30)]
bai_iej  = db$^ (a, b -> a.iej < b.iej)    // suot gaan up bai iej  (<)
bai_niem = db$^ (a, b -> a.niem > b.niem)  // suot gaan dung bai niem (>)
>> bai_iej[1].niem ¶     // → Ana
>> bai_niem[1].niem ¶    // → Kaala

// Direk ilement uupdieit (arei oanli)
arei[1] = 99              // asain
arei[2] += 5              // kompound: +=  -=  *=  /=  %=  ^=

// Funkshanabl uupdieit — riton nyuu arei; orizhinaal nuh chienj
arei2 = arei[2]$~ 99
```

> Aal kolekshan opirietor dem riton a **nyuu arei**. Asain bak: `arei = arei$+ 4`.
> `$+` kyan chien: `arei = arei$+ 5$+ 6$+ 7`. Oda opirietor dem yuuz intermediet asainment.
> **Index staat 1**: `arei[1]` a di fos ilement; `arei[0]` a runtime erri.
> `$^+` / `$^-` suot **primitiv arei** (nomba, string). Fi tyuupl arei yuuz `$^` wid kompierata lambda — direkshan inna di lambda (`<` = gaan up, `>` = gaan dung).

**Vaalyu semantik** — asain arei to neda variabl mek inipenident kuopi:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nuh chienj
```

```zymbol
// Nestid arei (staat 1)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (rou 2, kol 3)
```

---

## Distrakcha

```zymbol
// Arei
arei = [10, 20, 30, 40, 50]
[a, b, c] = arei              // a=10  b=20  c=30
[fos, *res] = arei            // fos=10  res=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ tro weh

// Pozishanal tyuupl
puoint = (100, 200)
(px, py) = puoint             // px=100  py=200

// Niem tyuupl
paasin = (niem: "Ana", iej: 25, siti: "Kingstan")
(niem: n, iej: a) = paasin   // n="Ana"  a=25
```

---

## Tyuupl dem

Tyuupl dem **kyan chienj** ordid kanteina weh kyaan uol difrent tipo vaalyu.
Nuh laik arei, ilement kyan chienj afta dem mek.

```zymbol
// Pozishanal — miksop tipo OK
puoint = (10, 20)
>> puoint[1] ¶    // → 10

daata = (42, "ello", #1, 3.14)
>> daata[3] ¶     // → #1

// Niem
paasin = (niem: "Alis", iej: 25)
>> paasin.niem ¶    // → Alis
>> paasin[1] ¶      // → Alis  (index wok tu, staat 1)

// Nestid
poz = (x: 10, y: 20)
p = (poz: poz, lievl: "staat")
>> p.poz.x ¶        // → 10
```

**Immyutabl** — eni atemt fi chienj tyuupl ilement a runtime erri:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ runtime erri: tyuupl kyan chienj
// t[1] += 5    // ❌ siem erri
```

Fi mek modifaid vaalyu yuuz `$~` (funkshanabl uupdieit) — riton a **nyuu** tyuupl:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orizhinaal nuh chienj
>> t2 ¶    // → (10, 999, 30)

// Niem tyuupl — ribiild ekspliisitli
paasin = (niem: "Alis", iej: 25)
ooldim  = (niem: paasin.niem, iej: 26)
>> paasin.iej ¶    // → 25
>> ooldim.iej ¶    // → 26
```

---

## Ai-Oda Funkshan dem

```zymbol
nomz = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dubl_dem  = nomz$> (x -> x * 2)                // mapp  → [2,4,6…20]
iivn_dem  = nomz$| (x -> x % 2 == 0)           // filta → [2,4,6,8,10]
tuutal    = nomz$< (0, (acc, x) -> acc + x)     // riduus → 55

// Chien bai intermediet
stip1 = nomz$| (x -> x > 3)
stip2 = stip1$> (x -> x * x)
>> stip2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Niem funkshan kyan pas direk to HOF
dubl(x) { <~ x * 2 }
iz_big(x) { <~ x > 5 }
r = nomz$> dubl       // ✅ direk referens
r = nomz$| iz_big     // ✅ direk referens
```

---

## Paip Opirietor

Di raait saiid aalweiz niid `_` az plieshouldas fi di paip vaalyu:

```zymbol
dubl = x -> x * 2
add = (a, b) -> a + b
inkriis = x -> x + 1

r1 = 5 |> dubl(_)          // → 10
r2 = 10 |> add(_, 5)       // → 15
r3 = 5 |> add(2, _)        // → 7

// Chien
r = 5 |> dubl(_) |> inkriis(_) |> dubl(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Erri Handling

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divijhan bai ziro" ¶
} :! {
    >> "ada: " _err ¶    // _err uol di erri mesij
} :> {
    >> "aalweiz ron" ¶
}
```

| Tipo | Wen |
|------|-----|
| `##Div` | Divijhan bai ziro |
| `##IO` | Fiel / sistim |
| `##Index` | Index weh gaan ousaid |
| `##Type` | Tipo nuh match |
| `##Parse` | Daata parsin |
| `##Network` | Netwok erri dem |
| `##_` | Eni erri (katch-aal) |

---

## Modyuul dem

```zymbol
// lib/calc.zy — modyuul badi lock up inna braces
# calc {
    #> { add, get_PI }

    _PI := 3.14159
    add(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias obligeytid

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Ekspuot wid difrent pablik niem
# mylib {
    #> { _internal_add => sum }

    _internal_add(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::sum(3, 4) ¶    // → 7  (intena niem _internal_add iz hidn)
```

> **Modyuul ruul dem**: oanli `#>`, funkshan defiinishan, an literal variabl/kanstant init allowd insaid `# niem { }`. Executable stetment dem (`>>`, `<<`, luup, etc.) riez erri E013.

---

## Nomba Muud dem

Zymbol kyan sho nomba inna **69 Yunikoord digit skrip** — Devanagari, Arabik-Indik, Thai, Klingon pIqaD, Matematikaal Bold, LCD segiment, an muor. Di aktiv muud oanli afek `>>` owutput; intena aritmitik aalweiz bainari.

### Aktiveyt A Skrip

Raait di `0` an `9` digit a di target skrip inna `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabik-Indik (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Owutput An Boolean dem

```zymbol
x = 42
>> x ¶          // → 42   (ASCII difaalt)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desimal puoint aalweiz ASCII)
>> 1 + 2 ¶      // → ३

// Boolean dem: # prefix aalweiz ASCII, digit chienj
>> #1 ¶         // → #१   (tru  inna Devanagari)
>> #0 ¶         // → #०   (faals — difrent fram ०  intija ziro)

x = 28 > 4
>> x ¶          // → #१   (kompierisan rizalt fala aktiv muud)
```

### Neitiv Digit Literal Dem Inna Suors

Eni saportid skrip digit dem a vaalid literal — inna rienj, modulo, kompierisan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean Literal Dem Inna Eni Skrip

`#` + digit `0` ar `1` fram eni blok a vaalid boolean literal:

```zymbol
#٠٩#
aktiv = #١        // siem az #1
>> aktiv ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **aalweiz ASCII**. `#0` (faals) aalweiz vizhuali difrent fram `0` (intija ziro) inna evri skrip.

---

## Daata Opirietor dem

```zymbol
// Tipo konvajan kast dem
f = ##.42         // → 42.0  (to Flout)
i = ###3.7        // → 4     (to Intija, rong)
t = ##!3.7        // → 3     (to Intija, chop)

// Pars string to nomba
v1 = #|"42"|      // → 42  (Intija)
v2 = #|"3.14"|    // → 3.14  (Flout)
v3 = #|"abc"|     // → "abc"  (fiel-sief, nuh erri)

// Rong / chop
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rong to 2 desimal plies)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (chop)

// Nomba faarmaat
fmt = #,|1234567|  // → 1,234,567  (koma-separietid)
sci = #^|12345.678|    // → 1.2345678e4  (saiintifik)

// Biez literal dem
a = 0x41         // → 'A'  (heks)
b = 0b01000001   // → 'A'  (bainari)
c = 0o101        // → 'A'  (oktal)

// Biez konvajan owutput
heks = 0x|255|    // → "0x00FF"
bin = 0b|65|      // → "0b1000001"
oct = 0o|8|       // → "0o10"
dec = 0d|255|     // → "0d0255"
```

---

## Shel Integreshan

```zymbol
dieit = <\ date +%Y-%m-%d \>     // katch stdout (inkluud trelin \n)
>> "Tide: " dieit

fiel = "data.txt"
kantiients = <\ cat {fiel} \>      // interpolieshan inna komiand

owutput = </"./subscript.zy"/>   // ron neda Zymbol skrip, katch owutput
>> owutput
```

> `><` katch CLI aagyument dem az string arei (tree-walker oanli).

---

## Komplit Egzaampl: FizzBuzz

```zymbol
klaasiifai(nomba) {
    ? nomba % 15 == 0 { <~ "FizzBuzz" }
    _? nomba % 3  == 0 { <~ "Fizz" }
    _? nomba % 5  == 0 { <~ "Buzz" }
    _ { <~ nomba }
}

@ i:1..20 { >> klaasiifai(i) ¶ }
```

---

## Simbl Refrens

| Simbl | Operieshan | Simbl | Operieshan |
|-------|------------|-------|------------|
| `=` | variabl | `$#` | lent |
| `:=` | kanstant | `$+` | apend (chien-ebl) |
| `>>` | owutput | `$+[i]` | insert at index (staat 1) |
| `<<` | input | `$-` | rimuuv fos bai vaalyu |
| `¶` / `\\` | nyuu lain | `$--` | rimuuv aal bai vaalyu |
| `?` | if | `$-[i]` | rimuuv at index (staat 1) |
| `_?` | els-if | `$-[i..j]` | rimuuv rienj (staat 1) |
| `_` | els / waildkaard | `$?` | kontien |
| `??` | mach | `$??` | fain aal index (staat 1) |
| `@` | luup | `$[s..e]` | slaais (staat 1) |
| `@ N { }` | taim luup (N taim) | `$>` | mapp |
| `@!` | brek | `$\|` | filta |
| `@>` | kontinyu | `$<` | riduus |
| `@:niem { }` | lievl luup | `$/ delim` | string split |
| `@:niem!` | brek lievl | `$++ a b c` | konkaat biild |
| `@:niem>` | kontinyu lievl | `arei[i>j>k]` | navigieshan index |
| `->` | lambda | `arei[i] = val` | uupdieit ilement (arei oanli) |
| `arei[i] += val` | kompound uupdieit | `arei[i]$~` | funkshanabl uupdieit (nyuu kuopi) |
| `$^+` | suot gaan up (primitiv) | `$^-` | suot gaan dung (primitiv) |
| `$^` | suot wid kompierata (tyuupl) | `<~` | riton |
| `\|>` | paip | `!?` | chrai |
| `:!` | katch | `:>` | finali |
| `#1` | tru | `#0` | faals |
| `$!` | iz erri | `$!!` | spred erri |
| `<#` | impuot | `#>` | ekspuot |
| `#` | deklier modyuul | `::` | modyuul kaal |
| `.` | fild akses | `#?` | tipo metadaata |
| `#\|..\|` | pars nomba | `##.` | kast to Flout |
| `###` | kast to Intija (rong) | `##!` | kast to Intija (chop) |
| `#.N\|..\|` | rong | `#!N\|..\|` | chop |
| `#,\|..\|` | koma faarmaat | `#^\|..\|` | saiintifik |
| `#d0d9#` | nomba muud switch | `#09#` | reset to ASCII |
| `<\ ..\>` | shel exec | `>\<` | CLI aagyument |
| `\ var` | distrai variabl | `°x` / `x°` | aut-defiinishan (auto-staat) |
| `>>\|` | TUI blok (alt skrein) | `>>~` | pozishand owutput |
| `>>!` | klia skrein | `>>?` | kwieri terminal saiz |
| `<<\|` | blokin kipress | `<<\|?` | naan-blokin kipress |
| `@~ N` | slip N milisekond | `$*` | string ripiit N taim |

---

## Riliz Chainlug

### v0.0.5 — TUI Primitiv, Aut-Defiinishan & String Ripiit _(Mie 2026)_

- **Brekkin** Mach aam separietor: `petaan : rizalt` → `petaan => rizalt`
- **Brekkin** Impuot alias: `<# pat <= alias` → `<# pat => alias`
- **Brekkin** Ekspuot rieniem: `#> { fn <= pub }` → `#> { fn => pub }`
- **Adid** TUI blok `>>| { }` — alt skrein + raw muud; kliinap pan exit
- **Adid** Pozishand owutput `>>~ (rou, kol, BKS, fg, bg) > item dem` — spars slot, 256-kala ANSI
- **Adid** Ki input `<<| var` (blokin) an `<<|? var` (naan-blokin pol)
- **Adid** `>>!` klia skrein, `>>?` kwieri terminal saiz, `@~ N` slip N milisekond
- **Adid** Aut-defiinishan `°x` / `x°` — auto-staat variabl pan fos yuuz inna luup
- **Adid** String ripiit `str $* N` — ripiit string N taim
- **VM** Parity: 436/436 test pas

### v0.0.4 — Index Staat 1, First-Klaas Funkshan & Modyuul Blok dem _(Epril 2026)_

- **Brekkin** Aal indexin switch to **staat 1** — `arei[1]` a di fos ilement; `arei[0]` a runtime erri
- **Adid** Niem funkshan dem a **first-klaas vaalyu** — pas direk to HOF: `nomz$> dubl`
- **Adid** Modyuul **blok sintaks** obligeytid: `# niem { ... }` — flat sintaks rimuuvd
- **Adid** Multi-daimenshanal indexin: `arei[i>j>k]` (navigieshan), `arei[p ; q]` (flat ekstrakshan)
- **Adid** Tipo konvajan kast dem: `##.expr` (Flout), `###expr` (Intija rong), `##!expr` (Intija chop)
- **Adid** String split: `str$/ delim` — riton `Array(String)`
- **Adid** Konkaat biild: `biez$++ a b c` — apend nuff item
- **Adid** Taim luup: `@ N { }` — ripiit egzaktli N taim
- **Adid** Lievl luup sintaks: `@:niem { }`, `@:niem!`, `@:niem>` — ripleisment fi `@ @niem` / `@! niem`
- **Adid** Variabl skuup ruul dem: `_niem` variabl av egzakt blok skuup; `\ var` distrai arli
- **Adid** Mach kompierisan petaan dem: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Adid** Modyuul E013 erri: executable stetment inna modyuul badi forbid
- **Fikst** `take_variable` nuh langa korapt modyuul kanstant pan raait-bak
- **Fikst** `alias.CONST` nuo rizolv korektli; `#>` kyan kum afta funkshan defiinishan
- **VM** Fuul parity: 393/393 test pas

### v0.0.3 — Yunikoord Nomba Sistim & LSP Impruvment dem _(Epril 2026)_

- **Adid** 69 Yunikoord digit blok wid muud-switch token `#d0d9#`
- **Adid** Boolean literal inna eni skrip — `#१` / `#०`, `#١` / `#٠`, etc.
- **Adid** Klingon pIqaD digit dem (CSUR PUA U+F8F0–U+F8F9)
- **Adid** `SetNumeralMode` VM opkuod — fuul parity wid tree-walker
- **Adid** REPL rispek aktiv nomba muud inna eko an variabl displei
- **Chienj** Boolean `>>` owutput nuo inkluud `#` prefix (`#0` / `#1`) inna aal muud

### v0.0.2_01 — Opirietor Rieniem _(30 Mach 2026)_

- **Chienj** `c|..|` → `#,|..|` an `e|..|` → `#^|..|` — konsistent wid `#` faarmaat prefix famili
- **Adid** Ekspuot alias: ri-ekspuot modyuul memba anda difrent niem

### v0.0.2 — Kolekshan API Ridizain & Instola dem _(24 Mach 2026)_

- **Adid** Yunifaid `$` opirietor famili fi arei an string (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Adid** Distrakcha asainment fi arei, tyuupl, an niem tyuupl
- **Adid** Negativ index (`arei[-1]` = laas ilement)
- **Adid** Neitiv instola dem — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mach 2026)_

- **Adid** Kompound asainment `^=`
- **Fikst** Pasa aritmitik edj kies; dokumentieshan korekshan

### v0.0.1 — Inishal Pablik Riliz _(22 Mach 2026)_

- Tree-walker interpreter + rejista VM (`--vm`, ~4× faasta, ~95% parity)
- Aal kuor konstrukt: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Fuul Yunikoord identifier, modyuul sistim, lambda, klosha, erri handling
- REPL, LSP, VS Code ekstenshon, faarmatta (`zymbol fmt`)

---

_Zymbol-Lang — Simbolik. Yuuniversaal. Kyan Chienj._
