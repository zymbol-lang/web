> **Tlhagiso:** Tokomane e e dirilwe le go ranolwa ke botshelo jo bo iketselitseng (AI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Tokomane

> **E Boeletswe go v0.0.5 — 2026-05-12**

**Zymbol-Lang** ke puo ya porogramo ya matshwao. Ga go na ditlhogamaano — tsotlhe ke matshwao. E dira ka go tshwana mo puong efe fela ya motho.

- Ga go na `if`, `while`, `return` — fela `?`, `@`, `<~`
- Unicode yotlhe — di-identifier mo puong efe fela gongwe emoji
- E sa kgatlhanong le puo ya motho — khoutu e tshwana gope gope

**Phetolo ya moitseanape**: v0.0.5 | **Kakaretso ya diteko**: 436/436 (TW ↔ VM tshwanelo)

---

## Diphetogo le Tse di sa Fetogeng

```zymbol
x = 10              // diphetogo tse di fetogang
PI := 3.14159       // ntlha e e sa fetogeng — go baya gape ke phoso ya nako ya tsamao
leina = "Alice"
akola = #1         // boammaaruri jo bo nnete
👋 := "Dumela"
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

`°` (tshipi ya marapo, U+00B0) e simolola diphetogo go ya go boleng jo bo nna jone ka go dirisiwa ga ntlha:

```zymbol
dinomoro = [3, 1, 4, 1, 5]
@ n:dinomoro {
    °kakaretso += n    // go simolola ka 0 godimo ga lupu; e phela morago ga @
}
>> kakaretso ¶         // → 14
```

> `°x` (go simolola) e emisa godimo ga lupu — diphetogo di a fitlhelwa morago ga `@`.
> `x°` (go fedisa) e emisa mo gare ga lupu — e a swa fa lupu e fela.
> Moitseanape wa ditlhare fela.

---

## Mefuta ya Datha

| Mofuta | Palo ya Motheo | Tshipi ya `#?` | Tlhaloso |
|--------|---------|----------|-------|
| Yotatse | `42`, `-7` | `###` | 64-bit ya go saeniwa |
| Palehalofo | `3.14`, `1.5e10` | `##.` | Taolo ya Saenteifi e a amogelwa |
| Kgotlelo | `"mokwalo"` | `##"` | Motsamao: `"Dumela {leina}"` |
| Tlhaka | `'A'` | `##'` | Tlhaka e le nngwe ya Unicode |
| Boammaaruri | `#1`, `#0` | `##?` | GA se nomoro — `#1 ≠ 1` |
| Tshupetso | `[1, 2, 3]` | `##]` | Dikarolwana tse di tshwanang |
| Tuple | `(a, b)` | `##)` | Ya ntlo |
| Tuple ya Leina | `(x: 1, y: 2)` | `##)` | Maemo a a neilweng leina |
| Tiro | leina la tiro | `##()` | Ya ntlha ya ntlha; bontshe `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ya ntlha ya ntlha; bontshe `<lambd/N>` |

```zymbol
// Tlhaloso ya mofuta — kgoreletsa (mofuta, dinomoro, boleng)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Phatlhalo le Tseno

```zymbol
>> "Dumela" ¶                      // ¶ gongwe \\ go mola o mosha
>> "a=" a " b=" b ¶               // go baya gaufi — dikelo di le dintsi
>> (arr$#) ¶                      // dioperetara tsa morago di tlhoka ( ) mo >>

<< leina                           // bala mo diphetogong (ga go botso)
<< "Tsenya leina: " leina            // le botso
```

> `¶` (AltGr+R mo khiibodong ya Sepanyolo) le `\\` ke dimola tse di tshwanang.

---

## Dintlha tsa TUI

Dioperetara tsa Temorale UI go diporograma tse di tsamaelanang. Di le dintsi di tlhoka kota ya `>>| { }` (sesha se se farologaneng + mekgwa ya motheo).

```zymbol
>>| {
    >>!                             // phepola sesha se se farologaneng
    >>~ (1, 1, 0, 10) > "E Tsamaya"  // mola 1, kholomo 1, fg=10 (botalamorwe)
    @~ 1000                         // emisa sekene e le nngwe (1000 ms)
    >>~ (2, 1) > "E Phethilwe."
}
// temorale e a busetsa ka bonosi fa go tswa
```

```zymbol
// Kgamelo ya konopo le bogolo jwa temorale
>>| {
    [dimela, dikholeamo] = >>?              // botsa bogolo jwa temorale
    >>~ (1, 1) > "Temorale: " dimela " x " dikholeamo
    <<| konopo                         // bala konopo (go emisa)
    >>~ (2, 1) > "Kgametswe: " konopo
}
```

> `>>!` e phepola sesha. `>>?` e busa `[dimela, dikholeamo]`. `@~ N` e robala N millisekene.
> `<<|` e bala konopo e le nngwe (go emisa); `<<|?` e bala ka bonosi (e busa `'\0'` fa go se na sepe).
> Tuple ya phatlhalo ya ntlo: `(mola, kholomo, BKS, fg, bg)` — karolwana efe fela e ka tlosiwa ka koma (`>>~ (,,, 196) > "bosea"`).
> BKS bitmask: `1`=Tsepamo, `2`=Kgetsi, `4`=Mola wa tlase. ANSI mebala 256 (`0`=tlwaelo ya temorale).
> Moitseanape wa ditlhare fela (ga go na `>>!`, `>>?`, `@~`, `>>~` tse di tsamaelang le `--vm`).

---

## Dioperetara

```zymbol
// Dipalo
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (go arola ka dipalo tse dikima)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (go gopotsa)

// Papatso — baya go lekola
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lekanyetso
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Dikholo

```zymbol
// Mefuta e mebedi ya go kopanya
leina = "Alice"
n = 42

>> "Dumela " leina " o na le " n ¶    // go baya gaufi — mo >>
tlhaloso = "Dumela {leina}, o na le {n}"  // motsamao — gope gope
```

```zymbol
s = "Dumela Lefatshe"
botelele = s$#                  // 15
karolo = s$[1..6]             // "Dumela"  (go simolola go 1, mafelelo a a akaretswa)
eteng = s$? "Lefatshe"          // #1
dikarolo = "a,b,c,d"$/ ','    // [a, b, c, d]  (go kgaola ka sepapatso)
fetola = s$~~["e":"E"]        // "DumEla lEfatshE"
fetola1 = s$~~["e":"E":1]     // "DumEla Lefatshe"  (ntlha N fela)
mola = "─" $* 20           // "────────────────────"  (go farologanya N go)
```

> `+` ke ya dipalo fela. Dirisa `,`, go baya gaufi, gongwe motsamao go dikholo.

---

## Taolo ya Phallo

```zymbol
x = 7

? x > 0 { >> "bonngatho" ¶ }

? x > 100 {
    >> "bogolo" ¶
} _? x > 0 {
    >> "bonngatho" ¶
} _? x == 0 {
    >> "sero" ¶
} _ {
    >> "bosenyi" ¶
}
```

> Dikgole tsa `{ }` di **tlhokega** le fa go na le pego e le nngwe.

---

## Go Tshwana

```zymbol
// Dikereisi
mphato = 85
boemo = ?? mphato {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> boemo ¶    // → B

// Dikholo
mmala = "bosea"
khoutu = ?? mmala {
    "bosea"   => "#FF0000"
    "botalamorwe" => "#00FF00"
    _       => "#000000"
}

// Mekgwa ya papatso
themperetsha = -5
boemo = ?? themperetsha {
    < 0  => "leqe"
    < 20 => "tsididi"
    < 35 => "bothitho"
    _    => "mogote"
}
>> boemo ¶    // → leqe

// Sebopego sa pego (maoto a a kota)
n = -3
?? n {
    0    => { >> "sero" ¶ }
    < 0  => { >> "bosenyi" ¶ }
    _    => { >> "bonngatho" ¶ }
}
```

---

## Dilupu

```zymbol
@ i:0..4  { >> i " " }        // kereisi e e akaretsang:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // le kgato:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // go bua:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (fa)

dienywa = ["apole", "pere", "morara"]
@ e:dienywa { >> e ¶ }         // for-each tshupetso

@ t:"dumela" { >> t "-" }
>> ¶                          // → d-u-m-e-l-a-  (for-each kholo)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tswelela
    ? i > 7 { @! }             // @! kgaoganya
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Lupu e e sa feleng
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Lupu ya leina (kgaoganya e e kota)
palogare = 0
@:kwantle {
    palogare++
    ? palogare >= 3 { @:kwantle! }
}
>> palogare ¶                    // → 3
```

---

## Ditiro

```zymbol
okentsa(a, b) { <~ a + b }
>> okentsa(3, 4) ¶    // → 7

fasekhori(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fasekhori(n - 1)
}
>> fasekhori(5) ¶    // → 120
```

Ditiro di na le **sediko se se kokoanyetsweng** — ga di kgone go bala diphetogo tsa ntle. Dirisa diparamitara tsa phatlhalo `<~` go fetola diphetogo tsa molebi:

```zymbol
tlosaetsa(a<~, b<~) {
    setshwantsho = a
    a = b
    b = setshwantsho
}
x = 10
y = 20
tlosaetsa(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ditiro tse di neilweng maina ke **ditekanyetso tsa ntlha** — baya ka tlhogo: `dipalo$> pedi`. Go apara: `x -> tiro(x)` le yona e a siama.

---

## Lambda le go Tswalela

```zymbol
pedi = x -> x * 2
kakaretso = (a, b) -> a + b
>> pedi(5) ¶    // → 10
>> kakaretso(3, 7) ¶    // → 10

// Block lambda
tlhopha = x -> {
    ? x > 0 { <~ "bonngatho" }
    _? x < 0 { <~ "bosenyi" }
    <~ "sero"
}

// Go tswalela — e tshwara sediko sa ntle
sekai = 3
tharo = x -> x * sekai
>> tharo(7) ¶    // → 21

// Mopi
mopi(n) { <~ x -> x + n }
okentsa10 = mopi(10)
>> okentsa10(5) ¶    // → 15

// Mo di-array
ditiro = [x -> x+1, x -> x*2, x -> x*x]
>> ditiro[3](5) ¶    // → 25
```

---

## Tsamaelano

Di-array ke **tse di fetogang** le go tshwara dikarolwana tsa **mofuta o tshwana**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — tsena (go simolola go 1: karolwana ya ntlha)
x = arr[-1]     // 5 — index ya bosenyi (karolwana ya mafelelo)
x = arr$#       // 5 — botelele (dirisa (arr$#) mo >>)

arr = arr$+ 6            // okentsa → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // tsenya ka ntlo 2 (go simolola go 1)
arr3 = arr$- 3           // tlosa go senola ga ntlha ga boleng
arr4 = arr$-- 3          // tlosa tsotlhe tsa boleng
arr5 = arr$-[1]          // tlosa ka index 1 (karolwana ya ntlha)
arr6 = arr$-[2..3]       // tlosa kereisi (go simolola go 1, mafelelo a a akaretswa)

eteng = arr$? 3            // #1 — e na le
ntlo = arr$?? 3           // [3] — di-index tsotlhe tsa boleng (go simolola go 1)
sl = arr$[1..3]          // [1,2,3] — karolo (go simolola go 1, mafelelo a a akaretswa)
sl2 = arr$[1:3]          // [1,2,3] — go tshwana, mothele wa palogare

godimo = arr$^+             // go sekamisa go godimo (di-primitive fela)
tlase = arr$^-            // go sekamisa go tlase (di-primitive fela)

// Di-array tsa di-tuple tsa leina/ntlo — dirisa $^ le lambda ya sekai
polokelo = [(leina: "Carla", dingwaga: 28), (leina: "Ana", dingwaga: 25), (leina: "Bob", dingwaga: 30)]
kadingwaga  = polokelo$^ (a, b -> a.dingwaga < b.dingwaga)    // go godima ka dingwaga  (<)
kaleina = polokelo$^ (a, b -> a.leina > b.leina)  // go tlasa ka leina (>)
>> kadingwaga[1].leina ¶     // → Ana
>> kaleina[1].leina ¶    // → Carla

// Go fetola karolwana ka tlhogo (di-array fela)
arr[1] = 99              // baya
arr[2] += 5              // kopanetsa: +=  -=  *=  /=  %=  ^=

// Go fetola go baa gape — e busa tshupetso e ntshwa; motheo ga o fetoge
arr2 = arr[2]$~ 99
```

> Dioperetara tsotlhe tsa dikgobokano di busa **tshupetso e ntshwa**. Baya gape: `arr = arr$+ 4`.
> `$+` e kgona go kgobokanngwa: `arr = arr$+ 5$+ 6$+ 7`. Dioperetara tse dingwe di dirisa go baya ke kgato.
> **Taolo ya index go simolola go 1**: `arr[1]` ke karolwana ya ntlha; `arr[0]` ke phoso ya nako ya tsamao.
> `$^+` / `$^-` di sekamisa **di-array tsa di-primitive** (dipalo, dikholo). Go di-tuple dirisa `$^` le lambda ya sekai — tlhogo e mo lambdang (`<` = go godima, `>` = go tlasa).

**Boleng jwa tekanyetso** — go baya tshupetso go diphetogo tse dingwe go dira kopi e e ikemeng:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ga e fetoge
```

```zymbol
// Di-array tse di kota (index go simolola go 1)
maikhutshwane = [[1,2,3],[4,5,6],[7,8,9]]
>> maikhutshwane[2][3] ¶    // → 6  (mola 2, kholomo 3)
```

---

## Go Senya Popego

```zymbol
// Tshupetso
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[ntlha, *maphedi] = arr         // ntlha=10  maphedi=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ e fela

// Tuple ya ntlo
ntho = (100, 200)
(px, py) = ntho             // px=100  py=200

// Tuple ya leina
motho = (leina: "Ana", dingwaga: 25, motse: "Madrid")
(leina: n, dingwaga: a) = motho   // n="Ana"  a=25
```

---

## Tuple

Di-tuple ke **tse di sa fetogeng** le go tshwara ditekanyetso tsa **mefuta e farologaneng**.
Go farologana le di-array, dikarolwana ga di kgone go fetogela morago ga go bopwa.

```zymbol
// Ntlo — mefuta e farologaneng e a amogelwa
ntho = (10, 20)
>> ntho[1] ¶    // → 10

datha = (42, "dumela", #1, 3.14)
>> datha[3] ¶     // → #1

// Ya leina
motho = (leina: "Alice", dingwaga: 25)
>> motho.leina ¶    // → Alice
>> motho[1] ¶      // → Alice  (index le yona e a siama, go simolola go 1)

// Kota
boemo = (x: 10, y: 20)
p = (boemo: boemo, tshipi: "motheo")
>> p.boemo.x ¶        // → 10
```

**Go sa Fetoga** — maiteko afe fela go fetola karolwana ya tuple ke phoso ya nako ya tsamao:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ phoso ya nako ya tsamao: di-tuple ga di fetoge
// t[1] += 5    // ❌ phoso e tshwana
```

Go baa boleng jo bo fetotsweng dirisa `$~` (go fetola go baa gape) — e busa **tuple e ntshwa**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← motheo ga o fetoge
>> t2 ¶    // → (10, 999, 30)

// Tuple ya leina — aga gape ka tlhogo
motho = (leina: "Alice", dingwaga: 25)
mogolwane  = (leina: motho.leina, dingwaga: 26)
>> motho.dingwaga ¶    // → 25
>> mogolwane.dingwaga ¶     // → 26
```

---

## Ditiro Tsa Maemo A A Kwa Godimo

```zymbol
dipalo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dipedi  = dipalo$> (x -> x * 2)                // map  → [2,4,6…20]
dipalo_bobedi    = dipalo$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
kakaretso    = dipalo$< (0, (leke, x) -> leke + x)     // reduce → 55

// Kgobokanyo ka go baya ke kgato
kgato1 = dipalo$| (x -> x > 3)
kgato2 = kgato1$> (x -> x * x)
>> kgato2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ditiro tse di neilweng maina di kgona go baiwa ka tlhogo go HOF
pedi(x) { <~ x * 2 }
gobogolo(x) { <~ x > 5 }
r = dipalo$> pedi       // ✅ go baya ka tlhogo
r = dipalo$| gobogolo       // ✅ go baya ka tlhogo
```

---

## Tiriso ya Paipe

Fa fa letshogong la moja e tlhoka `_` jaaka setshwantsho sa boleng jo bo tsamaisiwang:

```zymbol
pedi = x -> x * 2
okentsa = (a, b) -> a + b
okentsa1 = x -> x + 1

r1 = 5 |> pedi(_)        // → 10
r2 = 10 |> okentsa(_, 5)       // → 15
r3 = 5 |> okentsa(2, _)        // → 7

// Go kgobokanngwa
r = 5 |> pedi(_) |> okentsa1(_) |> pedi(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Taolo ya Diphoso

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "go arola ka sero" ¶
} :! {
    >> "sengwe: " _err ¶    // _err e tshwere molaetsa wa phoso
} :> {
    >> "e tsamaa ka dinako tsotlhe" ¶
}
```

| Mofuta | Nako |
|------|------|
| `##Div` | Go arola ka sero |
| `##IO` | Faele / tsamao |
| `##Index` | Index e e fa ntle ga tshupetso |
| `##Type` | Go sa tshwane ga mofuta |
| `##Parse` | Phasela ya datha |
| `##Network` | Diphoso tsa marangrang |
| `##_` | Phoso efe fela (tshwara yotlhe) |

---

## Dimothule

```zymbol
// lib/bala.zy — mothele wa mothule o a kokoanyediwa
# bala {
    #> { okentsa, bua_PI }

    _PI := 3.14159
    okentsa(a, b) { <~ a + b }
    bua_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/bala => k    // alias e a tlhokega

>> k::okentsa(5, 3) ¶     // → 8
pi = k::bua_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Ntsha ka leina le le farologaneng la sechaba
# mothuleame {
    #> { _okentsa_ka_gare => kakaretso }

    _okentsa_ka_gare(a, b) { <~ a + b }
}
```

```zymbol
<# ./mothuleame => m

>> m::kakaretso(3, 4) ¶    // → 7  (leina la gare _okentsa_ka_gare le fitlhilwe)
```

> **Melawana ya mothule**: fela `#>`, ditiro, le go simolola diphetogo/di-ntlha tsa motheo di a letlelelwa mo `# leina { }`. Dipego tse di tshiriwang (`>>`, `<<`, dilupu, jj.) di tsosa phoso ya E013.

---

## Mekgwa ya Dinomoro

Zymbol e kgona go bontshe dinomoro mo **dikokwane tse 69 tsa dinomoro tsa Unicode** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Dipalo tse Tsepameng, Diphedi tsa LCD, le tse dingwe. Mekgwa e e tshwereng e ama fela phatlhalo ya `>>`; dipalo tsa mo gare di a nna binary.

### Go Bua Mokwalo

Ngwala `0` le `9` ya kokwane e e tlhophilweng e apesiwa ka `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // busetsa go ASCII
```

### Phatlhalo le Boammaaruri

```zymbol
x = 42
>> x ¶          // → 42   (ASCII e e tlwaelegileng)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ntlha ya nomoro e a nna ASCII)
>> 1 + 2 ¶      // → ३

// Boammaaruri: # e a nna ASCII, nomoro e fetoga
>> #1 ¶         // → #१   (nnete mo Devanagari)
>> #0 ¶         // → #०   (maaka — e farologana le ०  sero ya yotatse)

x = 28 > 4
>> x ¶          // → #१   (diphetogo tsa papatso di latelela mekgwa e e tshwereng)
```

### Dinomoro tsa Motheo mo Koranteng

Dinomoro tsa kokwane efe fela e e tshegetswang ke dipalo tse di siameng — mo dikereising, go arola, go bapisa:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Dinomoro tsa Boammaaruri mo Mokwalong Ofe

`#` + nomoro `0` gongwe `1` go tswa go bloko efe fela ke nomoro ya boammaaruri e e siameng:

```zymbol
#٠٩#
akola = #١        // go tshwana le #1
>> akola ¶        // → #١
>> (#١ && #٠) ¶   // → #٠
```

> `#` ke **ya ASCII ka dinako tsotlhe**. `#0` (maaka) e a farologana ka go bonwa le `0` (sero ya yotatse) mo kokwaneng efe fela.

---

## Dioperetara tsa Datha

```zymbol
// Phetolo ya mofuta
f = ##.42         // → 42.0  (go ya Palehalofo)
i = ###3.7        // → 4     (go ya Yotatse, kgaola)
t = ##!3.7        // → 3     (go ya Yotatse, tlhola)

// Fetola kholo go ya nomoro
v1 = #|"42"|      // → 42  (Yotatse)
v2 = #|"3.14"|    // → 3.14  (Palehalofo)
v3 = #|"abc"|     // → "abc"  (e babalesega, ga go phoso)

// Kgaola / Tlhola
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (kgaola go go 2 lephata)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tlhola)

// Sebopego sa nomoro
fmt = #,|1234567|  // → 1,234,567  (dikoma)
sci = #^|12345.678|    // → 1.2345678e4  (saenteifi)

// Dinomoro tsa motheo
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Phetolelo ya motheo
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Tirisano ya Shell

```zymbol
letsatsi = <\ date +%Y-%m-%d \>     // tshwara stdout (e akareletsa \n ya mafelelo)
>> "Gompieno: " letsatsi

faele = "datha.txt"
diteng = <\ cat {faele} \>      // motsamao mo ditaelong

diphetogo = </"./mokwalo-we-mongwe.zy"/>   // tshira mokwalo o mongwe wa Zymbol, tshwara diphetogo
>> diphetogo
```

> `><` e tshwara dikonkwane tsa CLI jaaka tshupetso ya dikholo (moitseanape wa ditlhare fela).

---

## Sekai se se Tletseng: FizzBuzz

```zymbol
tlhopha(nomoro) {
    ? nomoro % 15 == 0 { <~ "FizzBuzz" }
    _? nomoro % 3  == 0 { <~ "Fizz" }
    _? nomoro % 5  == 0 { <~ "Buzz" }
    _ { <~ nomoro }
}

@ i:1..20 { >> tlhopha(i) ¶ }
```

---

## Tshupo ya Matshwao

| Tshwao | Tiro | Tshwao | Tiro |
|--------|-----------|--------|-----------|
| `=` | diphetogo | `$#` | botelele |
| `:=` | tse di sa fetogeng | `$+` | okentsa (go kgobokanya) |
| `>>` | phatlhalo | `$+[i]` | tsenya ka index (go simolola go 1) |
| `<<` | tseno | `$-` | tlosa ntlha ya ntlha ka boleng |
| `¶` / `\\` | mola o mosha | `$--` | tlosa tsotlhe ka boleng |
| `?` | fa | `$-[i]` | tlosa ka index (go simolola go 1) |
| `_?` | gongwe fa | `$-[i..j]` | tlosa kereisi (go simolola go 1) |
| `_` | gongwe / tlhapi | `$?` | e na le |
| `??` | go tshwana | `$??` | bona di-index tsotlhe (go simolola go 1) |
| `@` | lupu | `$[s..e]` | karolo (go simolola go 1) |
| `@ N { }` | lupu ya dikgaolo (N go) | `$>` | map |
| `@!` | kgaoganya | `$\|` | filter |
| `@>` | tswelela | `$<` | reduce |
| `@:leina { }` | lupu ya leina | `$/ separ` | go kgaola kholo |
| `@:leina!` | kgaoganya leina | `$++ a b c` | go kopanya go aga |
| `@:leina>` | tswelela leina | `arr[i>j>k]` | index ya go tsamaya |
| `->` | lambda | `arr[i] = bol` | fetola karolwana (di-array fela) |
| `arr[i] += bol` | fetola e e kopanetsweng | `arr[i]$~` | fetola go baa gape (kopi e ntshwa) |
| `$^+` | sekamisa go godimo (di-primitive) | `$^-` | sekamisa go tlase (di-primitive) |
| `$^` | sekamisa le sekai (di-tuple) | `<~` | busa |
| `\|>` | paipe | `!?` | leka |
| `:!` | tshwara | `:>` | mafelelo |
| `#1` | nnete | `#0` | maaka |
| `$!` | ke phoso | `$!!` | tlhakazela phoso |
| `<#` | tsena | `#>` | ntsha |
| `#` | pega mothule | `::` | bua mothule |
| `.` | tsena maemo | `#?` | datha ya mofuta |
| `#\|..\|` | fetola nomoro | `##.` | gama go Palehalofo |
| `###` | gama go Yotatse (kgaola) | `##!` | gama go Yotatse (tlhola) |
| `#.N\|..\|` | kgaola | `#!N\|..\|` | tlhola |
| `#,\|..\|` | sebopego sa dikoma | `#^\|..\|` | saenteifi |
| `#d0d9#` | go fetola mekgwa ya dinomoro | `#09#` | busetsa go ASCII |
| `<\ ..\>` | seta shell | `>\<` | dikonkwane tsa CLI |
| `\ var` | senya diphetogo ka ntlha | `°x` / `x°` | tlhaloso ya bothitho (go simolola ka bonosi) |
| `>>|` | kota ya TUI (sesha se se farologaneng) | `>>~` | phatlhalo ya ntlo |
| `>>!` | phepola sesha | `>>?` | botsa bogolo jwa temorale |
| `<<\|` | bala konopo (go emisa) | `<<\|?` | bala konopo (ga go emise) |
| `@~ N` | robala N millisekene | `$*` | farologanya kholo N go |

---

## Lenaane la Diphetogo tsa Khutullo

### v0.0.5 — Dintlha tsa TUI, Tlhaloso ya Bothitho & Phetlelo ya Kholo _(Mopitlo 2026)_

- **Phetollo** Sepapatso sa gae ya go tshwana: `pattern : result` → `pattern => result`
- **Phetollo** Alias ya tseno: `<# path <= alias` → `<# path => alias`
- **Phetollo** Phetolo ya leina ya ntsha: `#> { fn <= pub }` → `#> { fn => pub }`
- **Gosediwa** Kota ya TUI `>>| { }` — sesha se se farologaneng + mekgwa ya motheo; e a ntsha ka bonosi fa go tswa
- **Gosediwa** Phatlhalo ya ntlo `>>~ (mola, kholomo, BKS, fg, bg) > dikelo` — dikaelo tse di tseneletseng, ANSI ya mebala 256
- **Gosediwa** Tseno ya konopo `<<| var` (go emisa) le `<<|? var` (go bala ka bonosi)
- **Gosediwa** `>>!` phepola sesha, `>>?` botsa bogolo jwa temorale, `@~ N` robala N millisekene
- **Gosediwa** Tlhaloso ya bothitho `°x` / `x°` — go simolola diphetogo ka bonosi mo dirupung
- **Gosediwa** Go farologanya kholo `str $* N` — farologanya kholo N go
- **VM** Tshwanelo: 436/436 diteko di a tshwana

### v0.0.4 — Taolo ya 1-Motheo, Ditiro tsa Ntlha le Mothele wa Mothule _(Moranang 2026)_

- **Phetollo** Taolo ya index yotlhe e fetogile go ya go **1-motheo** — `arr[1]` ke karolwana ya ntlha; `arr[0]` ke phoso ya nako ya tsamao
- **Gosediwa** Ditiro tse di neilweng maina ke **ditekanyetso tsa ntlha** — baya ka tlhogo go HOF: `dipalo$> pedi`
- **Gosediwa** Mothele wa mothule **o o kokoanyetsweng** o tlhokega: `# leina { ... }` — mothele o o masisi o tlosiwa
- **Gosediwa** Taolo ya bogolo jo bo bokae: `arr[i>j>k]` (tsamaya), `arr[p ; q]` (tlhopa pele)
- **Gosediwa** Diphetolo tsa mofuta: `##.expr` (Palehalofo), `###expr` (Yotatse kgaola), `##!expr` (Yotatse tlhola)
- **Gosediwa** Go kgaola kholo: `str$/ separ` — kgoreletsa `Array(Kgotlelo)`
- **Gosediwa** Go aga ka go kopanya: `motheo$++ a b c` — okentsa dikelo di le dintsi
- **Gosediwa** Lupu ya dikgaolo: `@ N { }` — farologanya N go
- **Gosediwa** Mothele wa lupu ya leina: `@:leina { }`, `@:leina!`, `@:leina>` — e tsena gae ya `@ @leina` / `@! leina`
- **Gosediwa** Melawana ya sediko sa diphetogo: diphetogo tsa `_leina` di na le sediko se se utlwalang; `\ var` senya pele
- **Gosediwa** Mekgwa ya papatso ya go tshwana: `< 0 :`, `> 5 :`, `== 42 :` jj.
- **Gosediwa** Phoso ya mothule E013: dipego tse di tshiriwang mo mothuleng ga di amogelwe
- **Lolotswe** `take_variable` ga e sa senya di-ntlha tsa mothule go baya gape
- **Lolotswe** `alias.NTLHA` ga e letlelele ka tshiamo; `#>` e ka bewa morago ga ditiro
- **VM** Tshwanelo yotlhe: 393/393 diteko di a tshwana

### v0.0.3 — Ditlamorago tsa Unicode & Go Tokafatsa LSP _(Moranang 2026)_

- **Gosediwa** Dibloko tse 69 tsa dinomoro tsa Unicode le tshipi ya go fetola mekgwa `#d0d9#`
- **Gosediwa** Dinomoro tsa boammaaruri mo mokwalong ofe — `#१` / `#०`, `#١` / `#٠`, jj.
- **Gosediwa** Dinomoro tsa Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Gosediwa** VM opcode ya `SetNumeralMode` — tshwanelo yotlhe le moitseanape wa ditlhare
- **Fetogile** Phatlhalo ya `>>` ya boammaaruri ga e sa go tshwanela tlhagelo ya `#` (`#0` / `#1`) mo mekgweng yotlhe

### v0.0.2_01 — Phetolo ya Leina la Operetara _(30 Mar 2026)_

- **Fetogile** `c|..|` → `#,|..|` le `e|..|` → `#^|..|` — go tshwana le lelapa la `#` la sebopego
- **Gosediwa** Alias ya ntsha: bua gape ditlhopho tsa mothule ka leina le le farologaneng

### v0.0.2 — Phetollo ya API ya Dikgobokano & Dipeakantsi _(24 Mar 2026)_

- **Gosediwa** Lelapa la operetara `$` le le kopaneng la di-array le dikholo (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Gosediwa** Go senya popego go di-array, di-tuple, le di-tuple tsa leina
- **Gosediwa** Di-index tsa bosenyi (`arr[-1]` = karolwana ya mafelelo)
- **Gosediwa** Dipeakantsi tsa motheo — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Gosediwa** Go baya e e kopanetsweng `^=`
- **Lolotswe** Maemo a phasela a molaodi; diphetolo tsa tokomane

### v0.0.1 — Kgolagano ya Ntlha ya Batho _(22 Mar 2026)_

- Moitseanape wa ditlhare + VM ya go ngwaela-botshelo (`--vm`, ~4× go ikela, ~95% tshwanelo)
- Ditiro tsotlhe tsa motheo: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Di-identifier tsa Unicode yotlhe, tsamao ya mothule, di-lambda, go tswalela, go tshwara diphoso
- REPL, LSP, lonao la VS Code, formateiti (`zymbol fmt`)

---

_Zymbol-Lang — E ya Matshwao. Ya Lefatshe Lotlhe. E sa Fetogang._
