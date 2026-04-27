> **Hakilinatigɛ:** Nin sɛbɛnnen bɛɛ dilanna ni hakili miiri (AI) dɛmɛ ye.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Seere kaɲuman ye **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ye interpreter ka mara la.

---

# Zymbol-Lang Kalan

**Zymbol-Lang** ye kalan sigilan ye. Daɲɛ jateminɛ tɛ — o bɛɛ ye jateminɛ ye. A bɛ baara kɛ cogo kelen na ani ani ani cɛmancɛ la.

- `if`, `while`, `return` tɛ — `?`, `@`, `<~` le bɛ yen
- Unicode dafalen — jaatiɲɔgɔnw bɛ kalan bee la ani emoji bee la
- Mɔgɔ kan na kɛrɛnkɛrɛnnen tɛ — kɔdɛ ye kelen ye i n'a fɔ min na

**Interpreter ka sigilan**: v0.0.4 | **Surukuyaw ka kariyɛrɛ**: 393/393 (TW ↔ VM kelenyali)

---

---

## Fɛnniw ni ladilanw

```zymbol
x = 10              // fɛnni min bɛ se ka caya
PI := 3.14159       // ladilan — a ka caya laban ye baara waati fati ye
tɔgɔ = "Alisi"
kaaba = #1          // Booli kaɲuman
👋 := "Aw ni baara"
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

## Wuliw ka jate

| Jate | Tariku | `#?` taagi | Hakilina |
|------|--------|------------|----------|
| Jalan ye | `42`, `-7` | `###` | 64-bit daɲɛw ye |
| Sigiyɔrɔ ye | `3.14`, `1.5e10` | `##.` | Dɔnko tariku bɛ se |
| Kuma | `"sɛbɛn"` | `##"` | A ka kɔn: `"Aw ni baara {tɔgɔ}"` |
| Sɛbɛn ye | `'A'` | `##'` | Unicode sɛbɛn kelen |
| Booli | `#1`, `#0` | `##?` | Jalan tɛ — `#1 ≠ 1` |
| Jatebɔ | `[1, 2, 3]` | `##]` | Fɛnw ka kelen ye |
| Tupulu | `(a, b)` | `##)` | Sigida la |
| Tɔgɔ tupulu | `(x: 1, y: 2)` | `##)` | Tɔgɔ bɛ min na |
| Baarakɛcogo | tɔgɔ baarakɛcogo lajɛlen | `##()` | Danbe ye fɔlɔ; a bɛ jira `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Danbe ye fɔlɔ; a bɛ jira `<lambd/N>` |

```zymbol
// Jate ka ɲɛnajɛ — a bɛ segin (jate, jateminɛw, sɔngɔ)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Bɔli ni donli

```zymbol
>> "Aw ni baara" ¶                       // ¶ wali \\ bɔli ye kɛɲɛ fanga ye
>> "a=" a " b=" b ¶                    // ɲɔgɔn fɛ la — sɔngɔ caman
>> (arr$#) ¶                           // postfix baarakɛcogow ka kan ni ( ) ye >> kɔnɔ

<< tɔgɔ                           // kalan fɛnni la (tɛ ɲinin fɔli ye)
<< "Tɔgɔ sɛbɛn: " tɔgɔ            // ni ɲinin fɔli ye
```

> `¶` (AltGr+R Spatulu kibaritigi kan) ani `\\` ye kelen ye i n'a fɔ ɲɛgɛn ye.

---

## Baarakɛcogow

```zymbol
// Jalanw — kɛ donw; baarakɛcogo dɔw ka nɔgɔya bɛ a la u sigi >> kɔnɔ
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (jalan ye tigɛli)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kungo)

// Ladon
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Hakili
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Kumaw

```zymbol
// Kuma ka duuru cogo fila
tɔgɔ = "Alisi"
n = 42

>> "Aw ni baara " tɔgɔ " i bɛ " n ¶       // ɲɔgɔn fɛ la — >> kɔnɔ
jatilanni = "Aw ni baara {tɔgɔ}, i bɛ {n}"   // kɔn — min bɛ o min na
```

```zymbol
s = "Aw ni baara Duniɲɛ"
jan = s$#                  // 12
dugukolo = s$[1..5]        // "Aw ni"  (firilan-1, laban bɛ yen)
bɛ = s$? "Duniɲɛ"          // #1
fara = "a,b,c,d"$/ ','     // [a, b, c, d]  (tigɛli ni faralan ye)
falili = s$~~["a":"o"]      // "Aw ni boaro Duniɲɛ"
falili1 = s$~~["a":"o":1]   // "Aw ni boaro Duniɲɛ" (N fɔlɔw doro)
```

> `+` ye jalanw le ye. Kuma caman la, kɛ `,`, ɲɔgɔn fɛ la, wali kɔn.

---

---

## Marali jɔyɔrɔ

```zymbol
x = 7

? x > 0 { >> "faaba" ¶ }

? x > 100 {
    >> "ba" ¶
} _? x > 0 {
    >> "faaba" ¶
} _? x == 0 {
    >> "fɛrɛ" ¶
} _ {
    >> "finitɛ" ¶
}
```

> `{ }` binbaw ka kan **niɲɛ** i n'a fɔ daɲɛ kelen na.

---

## Ladonu (Match)

```zymbol
// Danw
mɔgɔman = 85
jateminɛ = ?? mɔgɔman {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> jateminɛ ¶     // → B

// Kumaw
jɛ = "bilen"
kɔdi = ?? jɛ {
    "bilen"  : "#FF0000"
    "binkɛn" : "#00FF00"
    _        : "#000000"
}

// Ladon jateminɛw
funteni = -5
ɲɛnajɛ = ?? funteni {
    < 0  : "nɛgɛ"
    < 20 : "nɛnɛ"
    < 35 : "funteni"
    _    : "funteni ba"
}
>> ɲɛnajɛ ¶     // → nɛgɛ

// Daɲɛ sigilan (dalansɛmɛw)
?? n {
    0        : { >> "fɛrɛ" ¶ }
    _? n < 0 : { >> "finitɛ" ¶ }
    _        : { >> "faaba" ¶ }
}
```

---

## Jɛgɛw

```zymbol
@ i:0..4  { >> i " " }        // dan bɛ yen:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ni tɛmɛn ye:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kɛnɛma:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (waati)

abolo = ["pɔm", "pɛri", "rɛzɛ̃"]
@ a:abolo { >> a ¶ }          // fɛn bɛɛ la jatebɔ kɔnɔ

@ s:"aw ni baara" { >> s "-" }
>> ¶                          // → a-w- -n-i- -b-a-a-r-a-  (kuma kɔnɔ sɛbɛn bɛɛ la)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tɛmɛ
    ? i > 7 { @! }            // @! kiri
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Jɛgɛ laban tɛ
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Jɛgɛ tɔgɔ bɛ min na (kiri lajɛgɛnyalen)
jate = 0
@:kɛnɛma {
    jate++
    ? jate >= 3 { @:kɛnɛma! }
}
>> jate ¶                     // → 3
```

---

## Baarakɛcogow

```zymbol
fara(a, b) { <~ a + b }
>> fara(3, 4) ¶   // → 7

jateminɛlann (n) {
    ? n <= 1 { <~ 1 }
    <~ n * jateminɛlann (n - 1)
}
>> jateminɛlann (5) ¶    // → 120
```

Baarakɛcogow ka **sigida kɛlɛma** bɛ — u tɛ se ka fɛnniw kalan kɛnɛma la. Kɛ baarakɛla ka fɛnniw falen, kɛ bɔli paramɛtɛriw `<~`:

```zymbol
bilisi(a<~, b<~) {
    tɛmp = a
    a = b
    b = tɛmp
}
x = 10
y = 20
bilisi(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Tɔgɔ baarakɛcogow ye **danbe ye fɔlɔ sɔngɔw** le ye — ka di tagi la: `nums$> fɔlɔ`. `x -> fn(x)` fan fana bɛ se.

---

## Lambdaw ani dalanw

```zymbol
fɔlɔ = x -> x * 2
fara = (a, b) -> a + b
>> fɔlɔ(5) ¶   // → 10
>> fara(3, 7) ¶  // → 10

// Dalansɛmɛ lambda
jateminɛ = x -> {
    ? x > 0 { <~ "faaba" }
    _? x < 0 { <~ "finitɛ" }
    <~ "fɛrɛ"
}

// Dalan — a bɛ kɛnɛma sigida minɛ
jateminɛba = 3
fɔlɔ saba = x -> x * jateminɛba
>> fɔlɔ saba(7) ¶   // → 21

// Baarakɛyɔrɔ
fara baga da (n) { <~ x -> x + n }
fara tan = fara baga da (10)
>> fara tan(5) ¶    // → 15

// Jatebɔ kɔnɔ
baarakɛw = [x -> x+1, x -> x*2, x -> x*x]
>> baarakɛw[3](5) ¶   // → 25
```

---

## Jatebɔw

Jatebɔw **bɛ se ka caya** ani u bɛ fɛn **jate kelen** bɛɛ mara.

```zymbol
jatebɔ = [1, 2, 3, 4, 5]

jatebɔ[1]          // 1 — a lajɛ (firilan-1: fɛn fɔlɔ)
jatebɔ[-1]         // 5 — jateli jugu (fɛn laban)
jatebɔ$#           // 5 — jan (kɛ (jatebɔ$#) >> kɔnɔ)

jatebɔ = jatebɔ$+ 6            // fara → [1,2,3,4,5,6]
jatebɔ2 = jatebɔ$+[2] 99       // don sigida 2 la (firilan-1)
jatebɔ3 = jatebɔ$- 3           // sɔngɔ fɔlɔ bɔ
jatebɔ4 = jatebɔ$-- 3          // sɔngɔ bɛɛ bɔ
jatebɔ5 = jatebɔ$-[1]          // bɔ jateli 1 la (fɛn fɔlɔ)
jatebɔ6 = jatebɔ$-[2..3]       // dan bɔ (firilan-1, laban bɛ yen)

bɛ = jatebɔ$? 3            // #1 — a bɛ yen
sigidaw = jatebɔ$?? 3      // [3] — sɔngɔ ka jateli bɛɛ (firilan-1)
tigɛ = jatebɔ$[1..3]       // [1,2,3] — tigɛ (firilan-1, laban bɛ yen)
tigɛ2 = jatebɔ$[1:3]       // [1,2,3] — kelen ye, jate la daɲɛ

sɛgɛn = jatebɔ$^+          // sɛgɛn sɔrɔ (firilan bɛɛ la, jateminɛw doro)
jigi = jatebɔ$^-           // jigi sɔrɔ (firilan bɛɛ la, jateminɛw doro)

// Tɔgɔ tupulu/jateminɛ tupulu jatebɔw — kɛ $^ ni ladon lambda ye
db = [(tɔgɔ: "Karla", sanni: 28), (tɔgɔ: "Ana", sanni: 25), (tɔgɔ: "Bob", sanni: 30)]
sanni la   = db$^ (a, b -> a.sanni < b.sanni)     // sɛgɛn sanni la (<)
tɔgɔ la   = db$^ (a, b -> a.tɔgɔ > b.tɔgɔ)      // jigi tɔgɔ la (>)
>> sanni la[1].tɔgɔ ¶     // → Ana
>> tɔgɔ la[1].tɔgɔ ¶      // → Karla

// Fɛn falen tilennen (jatebɔw doro)
jatebɔ[1] = 99              // don
jatebɔ[2] += 5              // falen: +=  -=  *=  /=  %=  ^=

// Baarakɛcogo falen — a bɛ jatebɔ kura segin; fɔlɔ mana caya
jatebɔ2 = jatebɔ[2]$~ 99
```

> Jateminɛ baarakɛcogow bɛɛ ye **jatebɔ kura** le segin. Segin don: `jatebɔ = jatebɔ$+ 4`.
> `$+` bɛ se ka kɛ kɛrɛfɛ: `jatebɔ = jatebɔ$+ 5$+ 6$+ 7`. Baarakɛcogow tɛ kɛ ni tɛmɛn kɛrɛfɛw ye.
> **Jateli sigilan ye firilan-1 ye**: `jatebɔ[1]` ye fɛn fɔlɔ ye; `jatebɔ[0]` ye baara waati fati ye.
> `$^+` / `$^-` bɛ **jateminɛ jatebɔw** sɔrɔ (jalaniw, kumaw). Tupulu jatebɔw la kɛ `$^` ni ladon lambda ye — ajugu bɛ lambda kɔnɔ kɔdɛni (`<` = sɛgɛn, `>` = jigi).

**Sɔngɔ hakili** — jatebɔ don fɛnni wɛrɛ la a bɛ kɔpi kura da:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b mana caya
```

```zymbol
// Jatebɔw lajɛgɛnyalen (firilan-1 jateli)
matrisi = [[1,2,3],[4,5,6],[7,8,9]]
>> matrisi[2][3] ¶    // → 6  (rɔn 2, tɛrɛw 3)
```

---

## Falifalen don

```zymbol
// Jatebɔ
jatebɔ = [10, 20, 30, 40, 50]
[a, b, c] = jatebɔ              // a=10  b=20  c=30
[fɔlɔ, *seginw] = jatebɔ        // fɔlɔ=10  seginw=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ bɛ fɛn mɛ

// Sigida tupulu
yɔrɔ = (100, 200)
(px, py) = yɔrɔ              // px=100  py=200

// Tɔgɔ tupulu
mɔgɔ = (tɔgɔ: "Ana", sanni: 25, dugu: "Madrid")
(tɔgɔ: t, sanni: s) = mɔgɔ   // t="Ana"  s=25
```

---

## Tupuluw

Tupuluw ye **min mana se ka caya** bɔnsɔgɛw ye, ani u bɛ se ka **jate sirilanw** mara.
Jatebɔw kɛrɛfɛ la, fɛnw tɛ se ka caya u ka bɔ laban na.

```zymbol
// Sigida la — jate falen bɛ se
yɔrɔ = (10, 20)
>> yɔrɔ[1] ¶     // → 10

dati = (42, "aw ni baara", #1, 3.14)
>> dati[3] ¶     // → #1

// Tɔgɔ min bɛ
mɔgɔ = (tɔgɔ: "Alisi", sanni: 25)
>> mɔgɔ.tɔgɔ ¶    // → Alisi
>> mɔgɔ[1] ¶      // → Alisi  (jateli fan fana bɛ baara, firilan-1)

// Lajɛgɛnyalen
sigida = (x: 10, y: 20)
p = (sigida: sigida, taagi: "dɔrɔn")
>> p.sigida.x ¶     // → 10
```

**Min mana se ka caya** — tupulu fɛn don o don bɛ se ka caya, o ye baara waati fati ye:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ baara waati fati: tupuluw tɛ se ka caya
// t[1] += 5    // ❌ fati kelen ye

// Tɔgɔ tupulu — a falen tilennen
mɔgɔ = (tɔgɔ: "Alisi", sanni: 25)
ba = (tɔgɔ: mɔgɔ.tɔgɔ, sanni: 26)
>> mɔgɔ.sanni ¶    // → 25
>> ba.sanni ¶       // → 26
```

Ni a caya, kɛ `$~` (baarakɛcogo falen) — a bɛ tupulu **kura** le segin:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← fɔlɔ mana caya
>> t2 ¶    // → (10, 999, 30)
```

---

## Baarakɛcogow ɲɛmanya

```zymbol
jalenw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

fɔlɔlenw = jalenw$> (x -> x * 2)                // karata → [2,4,6…20]
bɛnɛnw   = jalenw$| (x -> x % 2 == 0)           // sɛbɛn → [2,4,6,8,10]
bɛɛ     = jalenw$< (0, (bɔn, x) -> bɔn + x)     // bɔn → 55

// Kɛrɛfɛ ni tɛmɛnw ye
tɛmɛn1 = jalenw$| (x -> x > 3)
tɛmɛn2 = tɛmɛn1$> (x -> x * x)
>> tɛmɛn2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Tɔgɔ baarakɛcogow bɛ se ka di tagi la baarakɛcogow ɲɛmanya la
fɔlɔ(x) { <~ x * 2 }
ba_yɛlɛma(x) { <~ x > 5 }
r = jalenw$> fɔlɔ       // ✅ lajɛlen tilennen
r = jalenw$| ba_yɛlɛma   // ✅ lajɛlen tilennen
```

---

## Piyibu baarakɛcogo

Bolo fɛ a la bɛ se ka `_` kɛ sigida ye i n'a fɔ sɔngɔ min bɛ piyibu la:

```zymbol
fɔlɔ = x -> x * 2
fara = (a, b) -> a + b
tɔbɔ = x -> x + 1

5 |> fɔlɔ(_)        // → 10
10 |> fara(_, 5)    // → 15
5 |> fara(2, _)     // → 7

// Kɛrɛfɛ
r = 5 |> fɔlɔ(_) |> tɔbɔ(_) |> fɔlɔ(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Fatiw ka mara

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "tigɛli ni fɛrɛ ye" ¶
} :! {
    >> "fati wɛrɛ: " _err ¶    // _err bɛ fati kuma minɛ
} :> {
    >> "a bɛ baara o waati bɛɛ" ¶
}
```

| Jate | Waati |
|------|-------|
| `##Div` | Tigɛli ni fɛrɛ ye |
| `##IO` | Fiyeli / jatebɔ |
| `##Index` | Jateli ka tɛmɛ danw kan |
| `##Type` | Jate tɛ kelen ye |
| `##Parse` | Dati ka kalan |
| `##Network` | Jalakadaw ka fati |
| `##_` | Fati o fati (a bɛ bɛɛ minɛ) |

---

## Modulu

```zymbol
// lib/calc.zy — modulu ka yɔrɔ bɛ binba kɔnɔ
# calc {
    #> { fara, get_PI }

    _PI := 3.14159
    fara(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // tɔgɔ wɛrɛ ka kan

>> c::fara(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Bɔli ni tɔgɔ wɛrɛ ye
# n ka gafe {
    #> { _kɔnɔ_fara <= bɛɛ }

    _kɔnɔ_fara(a, b) { <~ a + b }
}
```

```zymbol
<# ./n ka gafe <= m

>> m::bɛɛ(3, 4) ¶    // → 7  (kɔnɔ tɔgɔ _kɔnɔ_fara dogolen)
```

> **Modulu ka ɲɛminɛw**: `# tɔgɔ { }` kɔnɔ, `#>`, baarakɛcogo jatilaw, ani tariku fɛnni/ladilan daminɛw le bɛ se. Baarakɛ se daɲɛw (`>>`, `<<`, jɛgɛw, wɛrɛw) bɛ fati E130 kɛ.

---

## Jateminɛ sigidaw

Zymbol bɛ se ka jateminɛw jira **69 Unicode jateminɛ dalanw** la — Dewanagari, Arabu-Hinduku, Tayilandi, Klingon pIqaD, Matematiki ba, LCD sigidaw, ani wɛrɛw. Sigida min bɛ baara, o bɛ bɔli `>>` le la; kɔnɔ jateminɛ ye binari ye o waati bɛɛ.

### Sɛbɛn baga da

Sɛbɛn baga da ka `0` ani `9` jateminɛw sɛbɛn `#…#` kɔnɔ:

```zymbol
#०९#    // Dewanagari    (U+0966–U+096F)
#٠٩#    // Arabu-Hinduku  (U+0660–U+0669)
#๐๙#    // Tayilandi      (U+0E50–U+0E59)
#09#    // segin ASCII ma
```

### Bɔli ani Booliw

```zymbol
x = 42
>> x ¶          // → 42   (ASCII a fɔlɔ)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (tigitigi sigida ye ASCII ye o waati bɛɛ)
>> 1 + 2 ¶      // → ३

// Booliw: # fɔlɔlen ye ASCII ye o waati bɛɛ, jateminɛ bɛ sigi
>> #1 ¶         // → #१   (kaɲuman Dewanagari la)
>> #0 ¶         // → #०   (fanin — a bɛ fara ० jalan fɛrɛ kan)

x = 28 > 4
>> x ¶          // → #१   (ladon laban bɛ sigida min bɛ baara o la)
```

---

## Tariku jateminɛw kɔdɛ kɔnɔ

Sɛbɛn baga da o baga da ka jateminɛw ye tariku jateminɛ bɛɛ ye — danw la, modulo la, ladonw la:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booli tarikuw sɛbɛn o sɛbɛn baga da la

`#` + jateminɛ `0` wali `1` dalan o dalan la ye booli tariku min bɛ se:

```zymbol
#०९#
kaaba = #१        // kelen ye #1 ye
>> kaaba ¶        // → #१
>> (#१ && #०) ¶   // → #०
```

> `#` ye **ASCII ye o waati bɛɛ**. `#0` (fanin) bɛ se ka fara `0` (jalan fɛrɛ) kan i n'a fɔ sɛbɛn baga da o baga da la.

---

## Dati baarakɛcogow

```zymbol
// Jate falen
##.42         // → 42.0  (Sigiyɔrɔ ma)
###3.7        // → 4     (Jalan ye ma, ka lan)
##!3.7        // → 3     (Jalan ye ma, ka kiri)

// Kuma kalan ni jalan ye
v1 = #|"42"|      // → 42  (Jalan ye)
v2 = #|"3.14"|    // → 3.14  (Sigiyɔrɔ)
v3 = #|"abc"|     // → "abc"  (a bɛ se, fati tɛ)

// Ka lan / ka kiri
pi = 3.14159265
lan2 = #.2|pi|     // → 3.14  (lan sigida 2 ɲɛfɛli la)
lan4 = #.4|pi|     // → 3.1416
kiri2 = #!2|pi|    // → 3.14  (ka kiri)

// Jateminɛ sigilan
sigilan = #,|1234567|   // → 1,234,567  (koma la)
dɔnko = #^|12345.678| // → 1.2345678e4  (dɔnko la)

// Firilan tarikuw
a = 0x41         // → 'A'  (heksadesimali)
b = 0b01000001   // → 'A'  (binari)
c = 0o101        // → 'A'  (oktali)

// Firilan falen bɔli
heks = 0x|255|   // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
okt = 0o|8|      // → "0o10"
des = 0d|255|    // → "0d0255"
```

---

## Sheli lajɛgɛn

```zymbol
don = <\ date +%Y-%m-%d \>     // a bɛ stdout minɛ (a bɛ \n don laban na)
>> "Bi: " don

fiyeli = "dati.txt"
kɔnɔ = <\ cat {fiyeli} \>       // kɔn don marali la

bɔli = </"./subscript.zy"/>    // Zymbol sɛbɛn wɛrɛ baga da, a ka bɔli minɛ
>> bɔli
```

> `><` bɛ CLI maraliw minɛ kuma jatebɔ ye (tree-walker le yɔrɔ).

---

## Jateminɛ dafalen: FizzBuzz

```zymbol
jateminɛ(jalan) {
    ? jalan % 15 == 0 { <~ "FizzBuzz" }
    _? jalan % 3  == 0 { <~ "Fizz" }
    _? jalan % 5  == 0 { <~ "Buzz" }
    _ { <~ jalan }
}

@ i:1..20 { >> jateminɛ(i) ¶ }
```

---

## Jateminɛw ka tigɛli

| Jateminɛ | Baarakɛ | Jateminɛ | Baarakɛ |
|----------|---------|----------|---------|
| `=` | fɛnni | `$#` | jan |
| `:=` | ladilan | `$+` | fara (bɛ se ka kɛrɛfɛ) |
| `>>` | bɔli | `$+[i]` | don jateli la (firilan-1) |
| `<<` | donli | `$-` | fɔlɔ bɔ sɔngɔ la |
| `¶` / `\\` | ɲɛgɛn | `$--` | bɛɛ bɔ sɔngɔ la |
| `?` | ni | `$-[i]` | bɔ jateli la (firilan-1) |
| `_?` | ni tɛ, ni | `$-[i..j]` | dan bɔ (firilan-1) |
| `_` | ni tɛ / jateminɛ bɛɛ | `$?` | a bɛ yen |
| `??` | ladonu | `$??` | jateli bɛɛ ɲini (firilan-1) |
| `@` | jɛgɛ | `$[s..e]` | tigɛ (firilan-1) |
| `@ N { }` | jɛgɛ N tɛmɛn | `$>` | karata |
| `@!` | kiri | `$|` | sɛbɛn |
| `@>` | tɛmɛ | `$<` | bɔn |
| `@:tɔgɔ { }` | jɛgɛ min tɔgɔ bɛ | `$/ faralan` | kuma tigɛ |
| `@:tɔgɔ!` | kiri min tɔgɔ bɛ | `$++ a b c` | kuma duuru baara |
| `@:tɔgɔ>` | tɛmɛ min tɔgɔ bɛ | `jatebɔ[i>j>k]` | ɲɛbɔ jateli |
| `->` | lambda | `jatebɔ[i] = sɔngɔ` | fɛn falen (jatebɔw doro) |
| `jatebɔ[i] += sɔngɔ` | falen falen | `jatebɔ[i]$~` | baarakɛcogo falen (kɔpi kura) |
| `$^+` | sɛgɛn falen (jateminɛw) | `$^-` | jigi falen (jateminɛw) |
| `$^` | falen ni ladonlambda ye (tupuluw) | `<~` | segin |
| `|>` | piyibu | `!?` | kɛ k'a lajɛ |
| `:!` | minɛ | `:>` | laban na |
| `#1` | kaɲuman | `#0` | fanin |
| `$!` | fati ye | `$!!` | fati jigi |
| `<#` | don | `#>` | bɔ |
| `#` | modulu jatera | `::` | modulu wele |
| `.` | lajɛ fɛn | `#?` | jate hakili dɔ |
| `#\|..\|` | jalan kalan | `##.` | falen Sigiyɔrɔ ma |
| `###` | falen Jalan ye ma (ka lan) | `##!` | falen Jalan ye ma (ka kiri) |
| `#.N\|..\|` | ka lan | `#!N\|..\|` | ka kiri |
| `#,\|..\|` | koma sigilan | `#^\|..\|` | dɔnko |
| `#d0d9#` | jateminɛ sigida falen | `#09#` | segin ASCII ma |
| `<\ ..\>` | sheli baga da | `>\<` | CLI maraliw |
| `\ var` | fɛnni bɔ tilennen | | |

---

---

## Bɔli falen mara

### v0.0.4 — Firilan-1 Jateli, Danbe ye Fɔlɔ Baarakɛcogow ani Modulu Dalansɛmɛw _(Awirili 2026)_

- **Falenba** Jateli bɛɛ firilan-1 ye — `arr[1]` ye fɛn fɔlɔ ye; `arr[0]` ye baara waati fati ye
- **Don** Tɔgɔ baarakɛcogow **danbe ye fɔlɔ sɔngɔw** le ye — kɛ tagi tilennen ɲɛmanya baarakɛcogow ma: `nums$> fɔlɔ`
- **Don** Modulu **dalansɛmɛ sigilan ka kan**: `# tɔgɔ { ... }` — kalan danyoro bɔra
- **Don** Jateli caman: `arr[i>j>k]` (ɲɛbɔ), `arr[p ; q]` (danyoro bɔ)
- **Don** Jate falen: `##.kuma` (Sigiyɔrɔ), `###kuma` (Jalan ye lan), `##!kuma` (Jalan ye kiri)
- **Don** Kuma tigɛli: `kuma$/ faralan` — a bɛ segin `Array(Kuma)`
- **Don** Kuma duuru baara: `firilan$++ a b c` — a bɛ fɛn caman fara
- **Don** Jɛgɛ N tɛmɛn: `@ N { }` — a bɛ kɛ N tɛmɛn tilennen
- **Don** Jɛgɛ min tɔgɔ bɛ sigilan: `@:tɔgɔ { }`, `@:tɔgɔ!`, `@:tɔgɔ>` — a bɛ falen `@ @tɔgɔ` / `@! tɔgɔ` yɔrɔ
- **Don** Fɛnni sigida ɲɛminɛw: Fɛnni `_tɔgɔ` bɛ sigida dalansɛmɛ tilennen la; `\ var` bɛ bɔ waati fɔlɔ
- **Don** Ladonu ladon jateminɛw: `< 0 :`, `> 5 :`, `== 42 :` wɛrɛw
- **Don** Modulu fati E130: baarakɛ se daɲɛw tɛ se ka kɛ modulu kɔnɔ
- **Sɛnɛ** `take_variable` tɛ fɛn falen na modulu ladilanw kɔnɔ
- **Sɛnɛ** `alias.LADILAN` bɛ kɛ tilennen; `#>` bɛ se ka kɛ baarakɛcogo jatilaw laban na
- **VM** Kelenyali dafalen: 393/393 surukuyaw bɛ tɛmɛ

### v0.0.3 — Unicode Jateminɛ Sigidaw ani LSP ɲɛmɛnw _(Awirili 2026)_

- **Don** 69 Unicode jateminɛ dalanw ni sigida falen taagi `#d0d9#`
- **Don** Booli tarikuw sɛbɛn o sɛbɛn baga da la — `#१` / `#०`, `#१` / `#०`, wɛrɛw
- **Don** Klingon pIqaD jateminɛw (CSUR PUA U+F8F0–U+F8F9)
- **Don** `SetNumeralMode` VM baarakɛcogo — kelenyali dafalen tree-walker ye
- **Don** REPL bɛ sigida min bɛ baara o la ɲɛfɛli la ani fɛnni jira la
- **Falen** Booli `>>` bɔli bɛ `#` fɔlɔlen (`#0` / `#1`) don sigida bɛɛ la

### v0.0.2_01 — Baarakɛcogo tɔgɔ falen _(30 Marsi 2026)_

- **Falen** `c|..|` → `#,|..|` ani `e|..|` → `#^|..|` — kelen ye `#` sigilan fɔlɔlen balo ye
- **Don** Bɔli tɔgɔ wɛrɛ: modulu kɔnɔ fɛnw bɔ tɔgɔ wɛrɛ la

### v0.0.2 — Jateminɛ API falen ani ladonw _(24 Marsi 2026)_

- **Don** `$` baarakɛcogo balo kelen ye jatebɔw ni kumaw la (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Don** Falifalen don jatebɔw, tupuluw, ani tɔgɔ tupuluw la
- **Don** Jateli juguw (`arr[-1]` = fɛn laban)
- **Don** Ladonw min dɔn — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Marsi 2026)_

- **Don** Falen don `^=`
- **Sɛnɛ** Jateminɛ kumakanw ɲɛmɛn; sɛbɛnnenw falen

### v0.0.1 — Bɔli fɔlɔ _(22 Marsi 2026)_

- Tree-walker baarakɛcogo + register VM (`--vm`, ~4× gɛlɛn, ~95% kelenyali)
- Baarakɛcogo bɛɛ fɔlɔ: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode jaatiɲɔgɔnw dafalen, modulu jateminɛw, lambdaw, dalanw, fati mara
- REPL, LSP, VS Code ladon, sigilan cɛn (`zymbol fmt`)

---

_Zymbol-Lang — Jateminɛ ye. Duniɲɛ bɛɛ la. Tɛ se ka caya._
