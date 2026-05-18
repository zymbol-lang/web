> **Ikililo:** A ṣẹda ati tumọ iwe-ipamọ yii nipasẹ ọgbọn atọwọda (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Itọkasi canonical ni **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ninu ibi-ipamọ onitumọ.

---

# Itọsọna Zymbol-Lang

> **Ṣe atunyẹwo fun v0.0.5 — 2026-05-14**

**Zymbol-Lang** jẹ ede siseto aami. Ko si awọn ọrọ-ọkọọ — ohun gbogbo jẹ aami. Nṣiṣẹ ni bakanna ni eyikeyi ede eniyan.

- Ko si `if`, `while`, `return` — `?`, `@`, `<~` nikan
- Unicode ni kikun — awọn idamo ni eyikeyi ede tabi emoji
- Ominira ede eniyan — koodu naa jẹ kanna nibikibi

**Ipele Onitumọ**: v0.0.5 | **Agbegbe Idanwo**: 436/436 (afiwera TW ↔ VM)

---

## Awọn Oniyipada ati Awọn Iduro

```zymbol
x = 10              // oniyipada ti o le yipada
π := 3.14159        // iduro — atunkọ jẹ aṣiṣe akoko ṣiṣe
orúkọ = "Alice"
lọwọ = #1         // boolean otito
👋 := "Káàbọ"
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

`°` (aami ìwọ̀n, U+00B0) ṣe ipilẹṣẹ oniyipada laifọwọyi si iye alainidii rẹ ni lilo akọkọ:

```zymbol
awọn_nọmba = [3, 1, 4, 1, 5]
@ n:awọn_nọmba {
    °lapapọ += n    // ipilẹṣẹ laifọwọyi si 0 loke lupu; ye lẹhin @
}
>> lapapọ ¶         // → 14
```

> `°x` (iṣaju) n daduro loke lupu — abajade wa ni iraye si lẹhin `@`.
> `x°` (iṣẹhin) n daduro ninu lupu — ku nigbati lupu ba pari.
> tree-walker nikan.

---

## Awọn Iru Data

| Iru | Lítíró | Àmì `#?` | Awọn akọsilẹ |
|------|---------|----------|---------|
| Nọmba odidi | `42`, `-7` | `###` | 64-bit ti o ni ami |
| Nọmba lilefoofo | `3.14`, `1.5e10` | `##.` | Aami imọ-jinlẹ gba laaye |
| Okun | `"ọrọ"` | `##"` | Ifisi: `"Káàbọ {orúkọ}"` |
| Lẹta | `'A'` | `##'` | Lẹta Unicode kanṣoṣo |
| Boolean | `#1`, `#0` | `##?` | Kii ṣe nọmba — `#1 ≠ 1` |
| Ọ̀wọ̀ | `[1, 2, 3]` | `##]` | Awọn eroja isokan |
| Tuple | `(a, b)` | `##)` | Ipo |
| Tuple ti a npè ni | `(x: 1, y: 2)` | `##)` | Awọn aaye ti a npè ni |
| Iṣẹ | itọkasi iṣẹ ti a npè ni | `##()` | Ipele-akọkọ; ṣe afihan `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ipele-akọkọ; ṣe afihan `<lambd/N>` |

```zymbol
// Ìwádìí iru — pada (iru, awọn nọmba, iye)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Ijade ati Iṣiṣẹsi

```zymbol
>> "Káàbọ" ¶                       // ¶ tabi \\ fun laini tuntun ti o han gbangba
>> "a=" a " b=" b ¶               // isọpọ — awọn iye pupọ
>> (arr$#) ¶                      // awọn oniṣẹ iṣẹhin nilo ( ) ni >>

>> orúkọ                           // ka sinu oniyipada (laisi itọka)
>> "Tẹ orúkọ sii: " orúkọ            // pẹlu itọka
```

> `¶` (AltGr+R lori bọtini itẹwe Sipeeni) ati `\\` jẹ awọn laini tuntun deede.

---

## Awọn Ipilẹ TUI

Awọn oniṣẹ wiwo olumulo ebute fun awọn eto ibaraenisepo. Pupọ nilo bulọki `>>| { }` (iboju aropo + ipo aise).

```zymbol
>>| {
    >>!                             // nu iboju aropo
    >>~ (1, 1, 0, 10) > "Nṣiṣẹ"   // ori ila 1, ọwọn 1, fg=10 (alawọ ewe)
    @~ 1000                         // da duro fun iṣẹju-aaya 1 (1000 ms)
    >>~ (2, 1) > "Ti pari."
}
// ebute pada wa laifọwọyi nigbati o ba jade
```

```zymbol
// Titẹ bọtini ati iwọn ebute
>>| {
    [awọn_ila, awọn_ọwọn] = >>?              // beere awọn iwọn ebute
    >>~ (1, 1) > "Ebute: " awọn_ila " x " awọn_ọwọn
    <<| bọtini                         // ka titẹ bọtini idilọwọ
    >>~ (2, 1) > "Tẹ: " bọtini
}
```

> `>>!` nu iboju. `>>?` pada `[awọn_ila, awọn_ọwọn]`. `@~ N` sun N miliseconds.
> `<<|` ka titẹ bọtini kan (idilọwọ); `<<|?` ṣe idibo laisi idilọwọ (pada `'\0'` ti ko ba si).
> Tuple ijade ipo: `(ila, ọwọn, BKS, fg, bg)` — aaye eyikeyi le jẹ fifi silẹ pẹlu aami idẹsẹ (`>>~ (,,, 196) > "pupa"`).
> BKS bitmask: `1`=okun, `2`=itẹlẹ, `4`=ila-ẹ̀yẹ. ANSI 256 awọ paleti (`0`=aiyipada ebute).
> tree-walker nikan (ayafi `>>!`, `>>?`, `@~`, `>>~` eyiti o tun ṣiṣẹ ni `--vm`).

---

## Awọn Oniṣẹ

```zymbol
// Iṣiro
a = 10
b = 3
ab1 = a + b    // 13
ab2 = a - b    // 7
ab3 = a * b    // 30
ab4 = a / b    // 3  (pipin nọmba odidi)
ab5 = a % b    // 1
ab6 = a ^ b    // 1000  (igbega)

// Ifiwera — sọtọ fun ayewo
fi1 = a == b    // #0
fi2 = a <> b    // #1
fi3 = a < b     // #0
fi4 = a <= b    // #0
fi5 = a > b     // #1
fi6 = a >= b    // #1

// Ọgbọn
ọgb1 = #1 && #0    // #0
ọgb2 = #1 || #0    // #1
ọgb3 = !#1         // #0
```

---

## Awọn Okun

```zymbol
// Awọn ọna asopọ meji
orúkọ = "Alice"
n = 42

>> "Káàbọ " orúkọ " o ni " n ¶       // isọpọ — ni >>
apejuwe = "Káàbọ {orúkọ}, o ni {n}"     // ifisi — nibikibi
```

```zymbol
s = "Káàbọ aye"
gigun = s$#                  // 10
ìpín = s$[1..5]             // "Káàbọ"  (1-ipilẹ, opin pẹlu)
wà = s$? "aye"          // #1
awọn_ẹya = "a,b,c,d"$/ ','   // [a, b, c, d]  (pin pẹlu oluyapa)
rọpo = s$~~["l":"r"]        // "Káàbọ aye" (ko si 'l' ninu Yoruba)
rọpo1 = s$~~["l":"r":1]     // "Káàbọ aye"
ila = "─" $* 20           // "────────────────────"  (tun ṣe N igba)
```

> `+` jẹ fun awọn nọmba nikan. Fun awọn okun, lo `,`, isọpọ, tabi ifisi.

---

## Iṣakoso Sisan

```zymbol
x = 7

? x > 0 { >> "rere" ¶ }

? x > 100 {
    >> "ntobi" ¶
} _? x > 0 {
    >> "rere" ¶
} _? x == 0 {
    >> "odo" ¶
} _ {
    >> "odi" ¶
}
```

> Awọn àmì-ọ̀rọ̀ `{ }` **jẹ dandan** paapaa fun alaye kanṣoṣo.

---

## Ibamu

```zymbol
// Awọn sakani
Dimegilio = 85
ite = ?? Dimegilio {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> ite ¶    // → B

// Awọn okun
awọ = "pupa"
koodu = ?? awọ {
    "pupa"   => "#FF0000"
    "alawọ ewe" => "#00FF00"
    _       => "#000000"
}

// Awọn apẹrẹ ifiwera
iwọn_otutu = -5
ipo = ?? iwọn_otutu {
    < 0  => "yinyin"
    < 20 => "tutu"
    < 35 => "gbigbona"
    _    => "gbigbona"
}
>> ipo ¶    // → yinyin

// Fọọmu alaye (awọn apa bulọki)
n = -3
?? n {
    0    => { >> "odo" ¶ }
    < 0  => { >> "odi" ¶ }
    _    => { >> "rere" ¶ }
}
```

---

## Awọn Lupu

```zymbol
@ i:0..4  { >> i " " }        // sakani pẹlu:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pẹlu igbesẹ:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // yiyipada:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (nigba ti)

awọn_eso = ["appu", "pia", "esin"]
@ e:awọn_eso { >> e ¶ }         // fun gbogbo eroja ninu ọ̀wọ̀

@ k:"hello" { >> k "-" }
>> ¶                          // → h-e-l-l-o-  (fun gbogbo lẹta ninu okun)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tẹsiwaju
    ? i > 7 { @! }             // @! bu
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Lupu ailopin
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Lupu ti o ni aami (bu ti o wa ni itosi)
kika = 0
@:ita {
    kika++
    ? kika >= 3 { @:ita! }
}
>> kika ¶                    // → 3
```

---

## Awọn Iṣẹ

```zymbol
fi_ku_n(a, b) { <~ a + b }
>> fi_ku_n(3, 4) ¶    // → 7

iṣiro_factored(n) {
    ? n <= 1 { <~ 1 }
    <~ n * iṣiro_factored(n - 1)
}
>> iṣiro_factored(5) ¶    // → 120
```

Awọn iṣẹ ni **agbegbe ti o ya sọtọ** — wọn ko le ka awọn oniyipada ita. Lo awọn paramita ijade `<~>` lati paarọ awọn oniyipada olupè:

```zymbol
paarọ(a<~, b<~) {
    igba_die = a
    a = b
    b = igba_die
}
x = 10
y = 20
paarọ(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Awọn iṣẹ ti a npè ni jẹ **awọn iye ipele-akọkọ** — fi taara ranṣẹ: `awọn_nọmba$> ìlọpo_meji`. Lati fi ipò: `x -> fn(x)` tun wulo.

---

## Lambda ati Awọn Pipade

```zymbol
ìlọpo_meji = x -> x * 2
fi_ku_n = (a, b) -> a + b
>> ìlọpo_meji(5) ¶    // → 10
>> fi_ku_n(3, 7) ¶  // → 10

// Lambda bulọki
pin = x -> {
    ? x > 0 { <~ "rere" }
    _? x < 0 { <~ "odi" }
    <~ "odo"
}

// Pipade — gba agbegbe ita
ifosiwewe = 3
ìlọpo_mẹta = x -> x * ifosiwewe
>> ìlọpo_mẹta(7) ¶    // → 21

// Ile-iṣẹ
oṣelu_fi_ku_n(n) { <~ x -> x + n }
fi_ku_n_mẹwa = oṣelu_fi_ku_n(10)
>> fi_ku_n_mẹwa(5) ¶    // → 15

// Ninu ọ̀wọ̀
awọn_onísẹ = [x -> x+1, x -> x*2, x -> x*x]
>> awọn_onísẹ[3](5) ¶    // → 25
```

---

## Ọ̀wọ̀

Awọn ọ̀wọ̀ **le yipada** ati pe wọn ni awọn eroja **ti iru kanna**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — iraye si (1-ipilẹ: eroja akọkọ)
x = arr[-1]     // 5 — atọka odi (eroja ikẹhin)
x = arr$#       // 5 — gigun (lo (arr$#) ni >>)

arr = arr$+ 6            // fi kun → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // fi sii ni ipo 2 (1-ipilẹ)
arr3 = arr$- 3           // yọ iṣẹlẹ akọkọ ti iye kuro
arr4 = arr$-- 3          // yọ gbogbo awọn iṣẹlẹ kuro
arr5 = arr$-[1]          // yọ ni atọka 1 (eroja akọkọ)
arr6 = arr$-[2..3]       // yọ sakani (1-ipilẹ, opin pẹlu)

wà = arr$? 3            // #1 — ni ninu
awọn_ipo = arr$?? 3           // [3] — gbogbo awọn atọka ti iye (1-ipilẹ)
ge = arr$[1..3]          // [1,2,3] — ge (1-ipilẹ, opin pẹlu)
ge2 = arr$[1:3]          // [1,2,3] — kanna, sintasi orisun kika

òkè = arr$^+             // to òkè (awọn alakọbẹrẹ nikan)
isalẹ = arr$^-            // to isalẹ (awọn alakọbẹrẹ nikan)

// Awọn ọ̀wọ̀ tuple ti a npè ni/ipo — lo $^ pẹlu lambda afiwera
data_base = [(orúkọ: "Carla", ọjọ_ori: 28), (orúkọ: "Ana", ọjọ_ori: 25), (orúkọ: "Bob", ọjọ_ori: 30)]
ni_ibamu_si_ọjọ_ori  = data_base$^ (a, b -> a.ọjọ_ori < b.ọjọ_ori)    // ni ibamu si ọjọ-ori òkè (<)
ni_ibamu_si_orúkọ = data_base$^ (a, b -> a.orúkọ > b.orúkọ)   // ni ibamu si orúkọ isalẹ (>)
>> ni_ibamu_si_ọjọ_ori[1].orúkọ ¶     // → Ana
>> ni_ibamu_si_orúkọ[1].orúkọ ¶    // → Carla

// Imudojuiwọn eroja taara (awọn ọ̀wọ̀ nikan)
arr[1] = 99              // sọtọ
arr[2] += 5              // akojọpọ: +=  -=  *=  /=  %=  ^=

// Imudojuiwọn iṣẹ — pada ọ̀wọ̀ tuntun; atilẹba ko yipada
arr2 = arr[2]$~ 99
```

> Gbogbo awọn oniṣẹ ikojọpọ pada **ọ̀wọ̀ tuntun**. Sọtọ pada: `arr = arr$+ 4`.
> `$+` le ṣe pq: `arr = arr$+ 5$+ 6$+ 7`. Awọn oniṣẹ miiran lo awọn sọtọ agbedemeji.
> **Atọka jẹ 1-ipilẹ**: `arr[1]` jẹ eroja akọkọ; `arr[0]` jẹ aṣiṣe akoko ṣiṣe.
> `$^+` / `$^-` to **awọn ọ̀wọ̀ alakọbẹrẹ** (awọn nọmba, awọn okun). Fun awọn ọ̀wọ̀ tuple, lo `$^` pẹlu lambda afiwera — itọsọna ti wa ni koodu sinu lambda (`<` = òkè, `>` = isalẹ).

**Ìtumọ iye** — sọtọ ọ̀wọ̀ si oniyipada miiran ṣẹda ẹda ominira:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ko ni ipa
```

```zymbol
// Awọn ọ̀wọ̀ ti o wa ni itosi (atọka 1-ipilẹ)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (ila 2, ọwọn 3)
```

---

## Itusilẹ Ilana

```zymbol
// Ọ̀wọ̀
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[akọkọ, *iṣẹku] = arr         // akọkọ=10  iṣẹku=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ danu

// Tuple ipo
ojuami = (100, 200)
(px, py) = ojuami             // px=100  py=200

// Tuple ti a npè ni
eniyan = (orúkọ: "Ana", ọjọ_ori: 25, ilu: "Madrid")
(orúkọ: n, ọjọ_ori: o) = eniyan   // n="Ana"  o=25
```

---

## Tuple

Awọn tuple jẹ awọn apoti ti a ṣe lẹsẹsẹ **ti ko le yipada** ti o le ni awọn iye **ti awọn iru oriṣiriṣi**.
Ko dabi awọn ọ̀wọ̀, awọn eroja ko le yipada lẹhin ẹda.

```zymbol
// Ipo — awọn iru idapọmọra gba laaye
ojuami = (10, 20)
>> ojuami[1] ¶    // → 10

data = (42, "Káàbọ", #1, 3.14)
>> data[3] ¶     // → #1

// Ti a npè ni
eniyan = (orúkọ: "Alice", ọjọ_ori: 25)
>> eniyan.orúkọ ¶    // → Alice
>> eniyan[1] ¶      // → Alice  (atọka tun ṣiṣẹ, 1-ipilẹ)

// Ti o wa ni itosi
ipo = (x: 10, y: 20)
p = (ipo: ipo, àmì: "ipilẹṣẹ")
>> p.ipo.x ¶        // → 10
```

**Ailipadabọ** — eyikeyi igbiyanju lati paarọ eroja tuple jẹ aṣiṣe akoko ṣiṣe:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ aṣiṣe akoko ṣiṣe: awọn tuple ko le yipada
// t[1] += 5    // ❌ aṣiṣe kanna
```

Lati gba iye ti a ṣe atunṣe lo `$~` (imudojuiwọn iṣẹ) — pada **tuple tuntun**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← atilẹba ko yipada
>> t2 ¶    // → (10, 999, 30)

// Tuple ti a npè ni — tun kọ ni gbangba
eniyan = (orúkọ: "Alice", ọjọ_ori: 25)
àgbà  = (orúkọ: eniyan.orúkọ, ọjọ_ori: 26)
>> eniyan.ọjọ_ori ¶    // → 25
>> àgbà.ọjọ_ori ¶     // → 26
```

---

## Awọn Iṣẹ Ipele-giga

```zymbol
awọn_nọmba = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ìlọpo_meji  = awọn_nọmba$> (x -> x * 2)                  // map  → [2,4,6…20]
afẹfẹ    = awọn_nọmba$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
lapapọ    = awọn_nọmba$< (0, (akopọ, x) -> akopọ + x)     // reduce → 55

// Pọ pẹlu awọn agbedemeji
igbesẹ1 = awọn_nọmba$| (x -> x > 3)
igbesẹ2 = igbesẹ1$> (x -> x * x)
>> igbesẹ2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Awọn iṣẹ ti a npè ni ni a le fi taara si HOF ranṣẹ
ìlọpo_meji(x) { <~ x * 2 }
tóbi(x) { <~ x > 5 }
r = awọn_nọmba$> ìlọpo_meji       // ✅ itọkasi taara
r = awọn_nọmba$| tóbi       // ✅ itọkasi taara
```

---

## Oniṣẹ Paipu

Apa ọtun nigbagbogbo nilo `_` bi ohun idaduro fun iye ti a fi paipu:

```zymbol
ìlọpo_meji = x -> x * 2
fi_ku_n = (a, b) -> a + b
afikun = x -> x + 1

ab1 = 5 |> ìlọpo_meji(_)        // → 10
ab2 = 10 |> fi_ku_n(_, 5)       // → 15
ab3 = 5 |> fi_ku_n(2, _)        // → 7

// Ti a so po
ab = 5 |> ìlọpo_meji(_) |> afikun(_) |> ìlọpo_meji(_)
>> ab ¶    // → 22  (5→10→11→22)
```

---

## Mimu Aṣiṣe

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pipa nipasẹ odo" ¶
} :! {
    >> "omiiran: " _err ¶    // _err mu ifiranṣẹ aṣiṣe
} :> {
    >> "nigbagbogbo nṣiṣẹ" ¶
}
```

| Iru | Nigbawo |
|------|------|
| `##Div` | Pipa nipasẹ odo |
| `##IO` | Faili / eto |
| `##Index` | Atọka ita agbegbe |
| `##Type` | Aibamu iru |
| `##Parse` | Itupalẹ data |
| `##Network` | Awọn aṣiṣe nẹtiwọọki |
| `##_` | Eyikeyi aṣiṣe (mu-gbogbo) |

---

## Awọn Modulu

```zymbol
// lib/calc.zy — ara modulu ti wa ni pipade ni awọn àmì-ọ̀rọ̀
# calc {
    #> { fi_ku_n, get_PI }

    _π := 3.14159
    fi_ku_n(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // orukọ ikẹhin nilo

>> c::fi_ku_n(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Ṣe okeere pẹlu orukọ gbangba ti o yatọ
# mylib {
    #> { _fi_ku_n_inu => apapọ }

    _fi_ku_n_inu(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::apapọ(3, 4) ¶    // → 7  (orukọ inu _fi_ku_n_inu ti farasin)
```

> **Awọn ofin modulu**: inu `# orúkọ { }`, `#>`, awọn itumọ iṣẹ, ati awọn olupilẹṣẹ oniyipada/iduro litiriki nikan ni a gba laaye. Awọn alaye ti o le ṣiṣẹ (`>>`, `<<`, awọn lupu, ati bẹbẹ lọ) nfa aṣiṣe E013.

---

## Awọn Ipo Nọmba

Zymbol le ṣe afihan awọn nọmba ni **awọn iwe afọwọkọ nọmba Unicode 69** — Devanagari, Arab-India, Thai, Klingon pIqaD, Iwoye Iṣiro, awọn apa LCD, ati diẹ sii. Ipo ti nṣiṣẹ nikan ni ipa lori ijade `>>`; iṣiro inu nigbagbogbo jẹ alakomeji.

### Mu iwe afọwọkọ ṣiṣẹ

Kọ awọn nọmba `0` ati `9` ti iwe afọwọkọ ibi-afẹde laarin `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-India (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tun ṣe eto si ASCII
```

### Ijade ati booleans

```zymbol
x = 42
>> x ¶          // → 42   (aiyipada ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (aami eleemewa nigbagbogbo ASCII)
>> 1 + 2 ¶      // → ३

// Booleans: iṣaju # nigbagbogbo ASCII, nọmba ṣe atunṣe
>> #1 ¶         // → #१   (otito ni Devanagari)
>> #0 ¶         // → #०   (iro — yato si ० odidi nọmba odo)

x = 28 > 4
>> x ¶          // → #१   (abajade ifiwera tẹle ipo ti nṣiṣẹ)
```

### Awọn litiriki nọmba abinibi ninu orisun

Awọn nọmba ti eyikeyi iwe afọwọkọ ti o ni atilẹyin jẹ litiriki to wulo — ninu awọn sakani, modulo, awọn ifiwera:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Awọn litiriki Boolean ni eyikeyi iwe afọwọkọ

`#` + nọmba `0` tabi `1` lati eyikeyi bulọki jẹ litiriki boolean to wulo:

```zymbol
#٠٩#
lọwọ = #١        // bakanna bi #1
>> lọwọ ¶        // → #१
>> (#١ && #०) ¶ // → #०
```

> `#` **nigbagbogbo ASCII** ni. `#0` (iro) nigbagbogbo yato ni oju si `0` (odidi nọmba odo) ni gbogbo iwe afọwọkọ.

---

## Awọn Oniṣẹ Data

```zymbol
// Awọn simẹnti iyipada iru
f = ##.42         // → 42.0  (si lilefoofo)
i = ###3.7        // → 4     (si odidi, yika)
t = ##!3.7        // → 3     (si odidi, ge)

// Parse okun si nọmba
v1 = #|"42"|      // → 42  (odidi)
v2 = #|"3.14"|    // → 3.14  (lilefoofo)
v3 = #|"abc"|     // → "abc"  (ailewu, ko si aṣiṣe)

// Yika / Ge
π = 3.14159265
yika2 = #.2|π|      // → 3.14  (yika si awọn aaye eleemewa 2)
yika4 = #.4|π|      // → 3.1416
ge2 = #!2|π|      // → 3.14  (ge)

// Ṣiṣeto nọmba
ọna_kika = #,|1234567|  // → 1,234,567  (aami idẹsẹ-ipinya)
imọ_jinlẹ = #^|12345.678|    // → 1.2345678e4  (imọ-jinlẹ)

// Awọn litiriki ipilẹ
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Ijade iyipada ipilẹ
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ijọpọ Shell

```zymbol
ọjọ = <\ date +%Y-%m-%d \>     // mu stdout (pẹlu \n ni opin)
>> "Loni: " ọjọ

faili = "data.txt"
akoonu = <\ cat {faili} \>      // ifisi ninu awọn aṣẹ

ijade = </"./subscript.zy"/>   // ṣiṣẹ iwe afọwọkọ Zymbol miiran, mu ijade
>> ijade
```

> `><` mu awọn ariyanjiyan CLI gẹgẹbi ọ̀wọ̀ okun (tree-walker nikan).

---

## Apeere Pipe: FizzBuzz

```zymbol
pin(nọmba) {
    ? nọmba % 15 == 0 { <~ "FizzBuzz" }
    _? nọmba % 3  == 0 { <~ "Fizz" }
    _? nọmba % 5  == 0 { <~ "Buzz" }
    _ { <~ nọmba }
}

@ i:1..20 { >> pin(i) ¶ }
```

---

## Itọkasi Aami

| Aami | Iṣiṣẹ | Aami | Iṣiṣẹ |
|--------|-----------|--------|-----------|
| `=` | oniyipada | `$#` | gigun |
| `:=` | iduro | `$+` | fi kun (pq) |
| `>>` | ijade | `$+[i]` | fi sii ni atọka (1-ipilẹ) |
| `<<` | iṣiṣẹsi | `$-` | yọ akọkọ nipasẹ iye |
| `¶` / `\\` | laini tuntun | `$--` | yọ gbogbo nipasẹ iye |
| `?` | ti o ba jẹ | `$-[i]` | yọ ni atọka (1-ipilẹ) |
| `_?` | bibẹẹkọ-ti o ba jẹ | `$-[i..j]` | yọ sakani (1-ipilẹ) |
| `_` | bibẹẹkọ / kaadi egan | `$?` | ni ninu |
| `??` | ibamu | `$??` | wa gbogbo atọka (1-ipilẹ) |
| `@` | lupu | `$[s..e]` | ge (1-ipilẹ) |
| `@ N { }` | lupu N igba | `$>` | map |
| `@!` | bu | `$\|` | filter |
| `@>` | tẹsiwaju | `$<` | reduce |
| `@:orúkọ { }` | lupu ti o ni aami | `$/ oluyapa` | pin okun |
| `@:orúkọ!` | bu aami | `$++ a b c` | kọ akojọpọ |
| `@:orúkọ>` | tẹsiwaju aami | `arr[i>j>k]` | atọka lilọ kiri |
| `->` | lambda | `arr[i] = iye` | mu eroja dojuiwọn (awọn ọ̀wọ̀ nikan) |
| `arr[i] += iye` | imudojuiwọn akojọpọ | `arr[i]$~` | imudojuiwọn iṣẹ (ẹda tuntun) |
| `$^+` | to òkè (alakọbẹrẹ) | `$^-` | to isalẹ (alakọbẹrẹ) |
| `$^` | to pẹlu afiwera (tuple) | `<~` | pada |
| `\|>` | paipu | `!?` | gbiyanju |
| `:!` | mu | `:>` | nikẹhin |
| `#1` | otito | `#0` | iro |
| `$!` | ṣe aṣiṣe ni | `$!!` | tan aṣiṣe kaakiri |
| `<#` | ṣe agbewọle | `#>` | ṣe okeere |
| `#` | kede modulu | `::` | pe modulu |
| `.` | iraye si aaye | `#?` | metadata iru |
| `#\|..\|` | parse nọmba | `##.` | yipada si lilefoofo |
| `###` | yipada si odidi (yika) | `##!` | yipada si odidi (ge) |
| `#.N\|..\|` | yika | `#!N\|..\|` | ge |
| `#,\|..\|` | ọna kika aami idẹsẹ | `#^\|..\|` | imọ-jinlẹ |
| `#d0d9#` | yipada ipo nọmba | `#09#` | tun ṣe eto si ASCII |
| `<\ ..\>` | ṣiṣẹ shell | `>\<` | awọn ariyanjiyan CLI |
| `\ oniyipada` | pa oniyipada run ni gbangba | `°x` / `x°` | itumọ gbigbona (ipilẹṣẹ laifọwọyi) |
| `>>|` | bulọki TUI (iboju aropo) | `>>~` | ijade ipo |
| `>>!` | nu iboju | `>>?` | beere iwọn ebute |
| `<<\|` | titẹ bọtini idilọwọ | `<<\|?` | idibo titẹ bọtini ti kii ṣe idilọwọ |
| `@~ N` | sun N miliseconds | `$*` | tun okun ṣe N igba |

---

## Iwe-akọọlẹ Iyipada Itusilẹ

### v0.0.5 — Awọn Ipilẹ TUI, Itumọ Gbigbona & Atunwi Okun _(May 2026)_

- **Ikọrin** Oluyapa apa ibamu: `apẹrẹ : abajade` → `apẹrẹ => abajade`
- **Ikọrin** Orukọ ikẹhin agbewọle: `<# ọna <= orukọ_ikẹhin` → `<# ọna => orukọ_ikẹhin`
- **Ikọrin** Tun orukọ okeere: `#> { fn <= gbangba }` → `#> { fn => gbangba }`
- **Ṣafikun** Bulọki TUI `>>| { }` — iboju aropo + ipo aise; nu nigbati o ba jade
- **Ṣafikun** Ijade ipo `>>~ (ila, ọwọn, BKS, fg, bg) > awọn ohun kan` — awọn aaye ti o ṣọwọn, awọ ANSI 256
- **Ṣafikun** Iṣiṣẹsi bọtini `<<| oniyipada` (idilọwọ) ati `<<|? oniyipada` (idibo ti kii ṣe idilọwọ)
- **Ṣafikun** `>>!` nu iboju, `>>?` beere iwọn ebute, `@~ N` sun N miliseconds
- **Ṣafikun** Itumọ gbigbona `°x` / `x°` — ipilẹṣẹ oniyipada laifọwọyi ni lilo akọkọ ninu awọn lupu
- **Ṣafikun** Atunwi okun `okun $* N` — tun okun kan ṣe N igba
- **VM** Afiwera: awọn idanwo 436/436 kọja

### v0.0.4 — Atọka 1-ipilẹ, Awọn Iṣẹ Ipele-akọkọ & Awọn Modulu Bulọki _(Kẹrin 2026)_

- **Ikọrin** Gbogbo atọka ti yipada si **1-ipilẹ** — `arr[1]` jẹ eroja akọkọ; `arr[0]` jẹ aṣiṣe akoko ṣiṣe
- **Ṣafikun** Awọn iṣẹ ti a npè ni jẹ **awọn iye ipele-akọkọ** — fi taara ranṣẹ si HOF: `awọn_nọmba$> ìlọpo_meji`
- **Ṣafikun** **Sintasi bulọki dandan** fun awọn modulu: `# orúkọ { ... }` — sintasi alapin ti yọ kuro
- **Ṣafikun** Atọka onisẹpo pupọ: `arr[i>j>k]` (lilọ kiri), `arr[p ; q]` (iyọkuro alapin)
- **Ṣafikun** Awọn simẹnti iyipada iru: `##.ọrọ` (lilefoofo), `###ọrọ` (odidi yika), `##!ọrọ` (odidi ge)
- **Ṣafikun** Pipin okun: `okun$/ oluyapa` — pada `Array(okun)`
- **Ṣafikun** Kọ akojọpọ: `ipilẹ$++ a b c` — fi awọn ohun kan pupọ sii
- **Ṣafikun** Lupu iye igba: `@ N { }` — tun ṣe deede N igba
- **Ṣafikun** Sintasi lupu ti o ni aami: `@:orúkọ { }`, `@:orúkọ!`, `@:orúkọ>` — rọpo `@ @orúkọ` / `@! orúkọ`
- **Ṣafikun** Awọn ofin agbegbe oniyipada: awọn oniyipada `_orúkọ` ni agbegbe bulọki to peye; `\ oniyipada` pa run ni kutukutu
- **Ṣafikun** Awọn apẹrẹ ifiwera ibamu: `< 0 =>`, `> 5 =>`, `== 42 =>` ati bẹbẹ lọ
- **Ṣafikun** Aṣiṣe modulu E013: awọn alaye ti o le ṣiṣẹ ni ara modulu jẹ eewọ
- **Ṣatunṣe** `alias.CONST` bayi ṣe ipinnu ni deede; `#>` le han lẹhin awọn itumọ iṣẹ
- **VM** Afiwera pipe: awọn idanwo 393/393 kọja

### v0.0.3 — Awọn Eto Nọmba Unicode & Awọn Ilọsiwaju LSP _(Kẹrin 2026)_

- **Ṣafikun** Awọn bulọki nọmba Unicode 69 pẹlu aami iyipada ipo `#d0d9#`
- **Ṣafikun** Awọn litiriki Boolean ni eyikeyi iwe afọwọkọ — `#१` / `#०`, `#١` / `#٠`, ati bẹbẹ lọ
- **Ṣafikun** Awọn nọmba Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ṣafikun** Opcode VM `SetNumeralMode` — afiwera pipe pẹlu tree-walker
- **Ṣe atunṣe** Ijade Boolean `>>` bayi pẹlu iṣaju `#` (`#0` / `#1`) ni gbogbo awọn ipo

### v0.0.2_01 — Tun Orukọ Oniṣẹ _(30 Oṣu Kẹta 2026)_

- **Ṣe atunṣe** `c|..|` → `#,|..|` ati `e|..|` → `#^|..|` — ni ibamu pẹlu idile iṣaju `#`
- **Ṣafikun** Orukọ ikẹhin okeere: tun ṣe okeere awọn ọmọ ẹgbẹ modulu labẹ orukọ miiran

### v0.0.2 — Atunto API Ikojọpọ & Awọn Olufiṣii _(24 Oṣu Kẹta 2026)_

- **Ṣafikun** Idile oniṣẹ `$` iṣọkan fun awọn ọ̀wọ̀ ati awọn okun (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ṣafikun** Sọtọ itusilẹ ilana fun awọn ọ̀wọ̀, tuple, ati tuple ti a npè ni
- **Ṣafikun** Awọn atọka odi (`arr[-1]` = eroja ikẹhin)
- **Ṣafikun** Awọn olufiisii abinibi — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Oṣu Kẹta 2026)_

- **Ṣafikun** Sọtọ akojọpọ `^=`
- **Ṣatunṣe** Awọn ọran eti iṣiro ti olutọpa; awọn atunṣe iwe

### v0.0.1 — Itusilẹ Akọkọ si Gbogbo Eniyan _(22 Oṣu Kẹta 2026)_

- Onitumọ tree-walker + VM iforukọsilẹ (`--vm`, ~4× yiyara, ~95% afiwera)
- Gbogbo awọn itumọ ipilẹ: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Awọn idamo Unicode ni kikun, eto modulu, awọn lambda, awọn pipade, mimu aṣiṣe
- REPL, LSP, ifaagun VS Code, oluṣeto (`zymbol fmt`)

---

_Zymbol-Lang — Aami. Gbogbo agbaye. Aileyipada._
