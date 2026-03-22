# Zymbol-Lang — nêhiyawêwin Kîskinahamâkêwin (SRO)

**Zymbol-Lang** pêyak kîskinahamâkêwin pîkiskwêwin masinahikanis ôma — namôya kîkway âpacihiwêwin, masinahikanis piko. Kâ-pêyakwan ispayiw cîki ôma nêhiyaw-pîkiskwêwin.

---

## Kistêyimôwin

- Namôya âpacihiwêwina (`if`, `while`, `return` namôya âpatisiw — masinahikanis piko `?`, `@`, `<~`)
- Kahkiyaw Unicode — pîkiskwêwina kâ-isi-pîkiskwêt ispayiw, mîna emoji 👋
- Pîkiskwêwin-kâ-kî-osîhtâk — kîkway masinahikanis kâ-pêyakwan ispayiw kahkiyaw pîkiskwêwinihk

---

## Pîkiskwêwina mîna Namôya Pâstâhowak

```zymbol
kî = 10              // pîkiskwêwin (kâ-wîhtamâhk)
pâyi := 3.14159      // namôya pâstâhôw (pâstâhowêw kâ-mâyinikêhk)
isiyihkâsowin = "nêhiyaw"
kistêyi = #1         // tâpwêwin kistêyimôwin
👋 := "Tânisi"
```

### Kâ-Wîhtamihk Mâmawi

```zymbol
kî = 10    // 10
kî += 5    // 15
kî -= 3    // 12
kî *= 2    // 24
kî /= 4    // 6
kî %= 4    // 2
kî++       // 3
kî--       // 2
```

---

## Kîkway Ôhi

| Kîkway             | Tipahikêwin         | Masinahikanis `#?` | Kiskêyihtamowin                         |
|--------------------|---------------------|--------------------|-----------------------------------------|
| Akihtâsona         | `42`, `-7`          | `###`              | 64-bit kâ-kî-ihtakok                    |
| Pîtosâyâwin        | `3.14`, `1.5e10`    | `##.`              | Kistêyimôwin pîkiskwêwin OK             |
| Masinahikanis      | `"tânisi"`          | `##"`              | Wîhtamâkêwin: `"Tânisi {isiyihkâsowin}"` |
| Pîkiskwêwin        | `'A'`               | `##'`              | Pêyak Unicode pîkiskwêwin               |
| Tâpwêwin           | `#1`, `#0`          | `##?`              | NAMÔYA akihtâsona 1 mîna 0              |
| Masinahikanisa     | `[1, 2, 3]`         | `##]`              | Kâ-pêyakwan kîkwaya                     |
| Tupêl              | `(aw, êk)`          | `##)`              | Kâ-isi-itahpitêhk                       |
| Wîhcikâtêw Tupêl  | `(kî: 1, nî: 2)`    | `##)`              | Wîhcikâtêw mîna akihtâsona âpacihâwin  |

---

## Nâtawihoht mîna Tâpakêw

```zymbol
// Nâtawihoht — NAMÔYA kîkway pihtwâwin kîhtwâm
>> "Tânisi" ¶                         // ¶ mîna \ pihtwâwin masinahikanis
>> "a=" kî " b=" nî ¶                 // mihcêt kîkwaya mâmawi
>> "mâmawi=" mâmawihoht(2, 3) ¶       // âpacihiwêwina tânispîhk
>> (masinahikana$#) ¶                  // postfix-masinahikanis wâwis ( ) kihci

// Tâpakêw
<< isiyihkâsowin                       // namôya kakwêcihkêmôwin — isinâkwahk pîkiskwêwin
<< "Kîkisêpâ kiyawâw? " isiyihkâsowin // kakwêcihkêmôwin kâ-wîhtamihk
```

> `¶` mîna `\` kâ-pêyakwan — pihtwâwin masinahikanis.

---

## Masinahikanis Ôhci

Nistam kâ-isi-itôtahk — tânisi kâ-itôtamihk:

```zymbol
isiyihkâsowin = "nêhiyaw"
akihtâson = 25

// 1. Kâ-kîskwêpayik — pîkiskwêwina kâ-wîhtamihk = mîna :=
wîhtamôwin = "Tânisi ", isiyihkâsowin, "!"       // → Tânisi nêhiyaw!
KÎHCÎPÎKISKWÊWIN := "Kiyawâw: ", isiyihkâsowin

// 2. Mâmawi >> kâ-nâtawihohtihk
>> "Tânisi " isiyihkâsowin " kiyawâw " akihtâson ¶   // → Tânisi nêhiyaw kiyawâw 25

// 3. Wîhtamôwin — tânispîhk
kiskinotahwâwin = "Tânisi {isiyihkâsowin}, kiyawâw {akihtâson}"
```

> **Kiskêyihtamowin**: `+` akihtâsona piko. Masinahikanis kâ-wîhtamihk — mayi-ispayiw.

---

## Kâ-Isi-Ispayik

```zymbol
kî = 7

// Pêyak kâ-tâpwêwihk
? kî > 0 { >> "kihci-akihtâson" ¶ }

// Kâ-tâpwêwihk / namôya / mâka
? kî > 100 {
    >> "mistahi kihci" ¶
} _? kî > 0 {
    >> "kihci-akihtâson" ¶
} _? kî == 0 {
    >> "sôskwâc" ¶
} _ {
    >> "namôya kihci" ¶
}
```

Mihkwâhpitêwina `{ }` **kihci-itôtamihk** — mâka pêyak masinahikanis.

---

## Kâ-Kîspihtahk (Match)

```zymbol
// Kâ-kîspihtahk kâ-isi-akihtâhk
tipahikêwin = 85
wîhtamôwin = ?? tipahikêwin {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> wîhtamôwin ¶    // → B

// Kâ-kîspihtahk kâ-isi-kâkîsimihk (kahkiyaw tâpwêwina)
kisikâw = -5
ispayiwin = ?? kisikâw {
    _? kisikâw < 0  : "Kôna"
    _? kisikâw < 20 : "kîspin"
    _? kisikâw < 35 : "kîsikâw"
    _               : "kisikâw-mihkwâw"
}
>> ispayiwin ¶    // → Kôna

// Kâ-kîspihtahk masinahikanis
wâpikiwan = "mihko"
kîsikâw = ?? wâpikiwan {
    "mihko"    : "#FF0000"
    "askihtaw" : "#00FF00"
    _          : "#000000"
}
>> kîsikâw ¶
```

---

## Kâ-Ispayik

```zymbol
// Kâ-isi-akihtâhk mâmawi: 0..4 isinâkwan 0,1,2,3,4
@ ê:0..4 { >> ê " " }
>> ¶    // → 0 1 2 3 4

// Kâ-isi-akihtâhk kâ-kêyâpic
@ ê:1..9:2 { >> ê " " }
>> ¶    // → 1 3 5 7 9

// Kâ-kîwêhk akihtâsona
@ ê:5..0:1 { >> ê " " }
>> ¶    // → 5 4 3 2 1 0

// Kâ-tâpwêwihk (while)
nî = 1
@ nî <= 64 { nî *= 2 }
>> nî ¶    // → 128

// Kahkiyaw kîkwaya
mînisa = ["pahkwêsikan", "maskêkominak", "sâsâkisiw"]
@ mî:mînisa { >> mî ¶ }

// Masinahikanis kâ-isi-pîkiskwêt
@ sê:"tânisi" { >> sê "-" }
>> ¶    // → t-â-n-i-s-i-

// @! mîna @>
@ ê:1..10 {
    ? ê % 2 == 0 { @> }    // @> kâ-kîwêhk
    ? ê > 7 { @! }          // @! kâ-nîpâhahk
    >> ê " "
}
>> ¶    // → 1 3 5 7
```

---

## Âpacihiwêwina

```zymbol
// Wîhtamôwin mîna âpacihâwin
mâmawihoht(kî, nî) { <~ kî + nî }
>> mâmawihoht(3, 4) ¶    // → 7

// Kîhtwâm kâ-nâtawihohk
akihtâsonâpacihikêwin(nî) {
    ? nî <= 1 { <~ 1 }
    <~ nî * akihtâsonâpacihikêwin(nî - 1)
}
>> akihtâsonâpacihikêwin(5) ¶    // → 120

// Âpacihiwêwina pêyakwan kâ-itahpitêwak — namôya kîkway pîtos nâtawihohtêwin
kihci = 100
kîskinotahwâwin() {
    kî = 42    // piko ôta
    <~ kî
}
>> kîskinotahwâwin() ¶    // → 42
```

> **Kistêyimôwin**: Wîhcikâtêwa âpacihiwêwina `isiyihkâsowin(akihtâsona){ }` namôya pêyak kîkway.
> Kâ-pimipayihcikêhk: `kî -> isiyihkâsowin(kî)`.

---

## Lamda mîna Kâ-Kîwêhât

```zymbol
// Âpacihâwin lamda (namôya pihtwâwin wîhtamâkêwin)
pêyakosit = kî -> kî * 2
mâmawi = (kî, nî) -> kî + nî
>> pêyakosit(5) ¶    // → 10
>> mâmawi(3, 7) ¶    // → 10

// Lamda mihkwâhpitêwin (kihci-wîhtamôwin)
kistêyimôwin = kî -> {
    ? kî > 0 { <~ "kihci-akihtâson" }
    _? kî < 0 { <~ "namôya kihci" }
    <~ "sôskwâc"
}
>> kistêyimôwin(5) ¶     // → kihci-akihtâson
>> kistêyimôwin(0) ¶     // → sôskwâc
>> kistêyimôwin(-5) ¶    // → namôya kihci

// Kâ-Kîwêhâtwak — lamda kâ-kî-wîhtamihk pîtos kîkwaya
tipahikêwin = 3
nistomâpacihikêwin = kî -> kî * tipahikêwin    // kâ-kî-wîhtamihk 'tipahikêwin'
>> nistomâpacihikêwin(7) ¶    // → 21

// Âpacihiwêwin kâ-osîhtâhk
osîhtâkê(nî) { <~ kî -> kî + nî }
mitahtêwkî = osîhtâkê(10)
>> mitahtêwkî(5) ¶    // → 15

// Lamda kîkwaya: masinahikanisihk
âpacihiwêwina = [kî -> kî+1, kî -> kî*2, kî -> kî*kî]
>> âpacihiwêwina[0](5) ¶    // → 6
>> âpacihiwêwina[2](5) ¶    // → 25
```

---

## Masinahikanisa

```zymbol
masinahikana = [10, 20, 30, 40, 50]

// Âpacihâwin (sôskwâc akihtâson)
>> masinahikana[0] ¶    // → 10

// Tipahikêwin (wâwis ( ) kâ-nâtawihohtihk >>)
nî = masinahikana$#
>> (masinahikana$#) ¶    // → 5

// $+ wîhtamôwin, $- kâ-wâhpamihk, $? kâ-itohtatihk, $[..] kâ-kîskihk
masinahikana = masinahikana$+ 60              // $+ wîhtamôwin
masinahikana = masinahikana$- 0               // akihtâson 0 kâ-wîhtamihk
ayâwin = masinahikana$? 30           // → #1
kîskihwin = masinahikana$[0..2]      // [20, 30]

// Kîkway kâ-wîhtamihk
masinahikana[1] = 99

// Kahkiyaw kîkwaya
@ kî:masinahikana { >> kî " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **pîtos masinahikanisa** — kîhtwâm wîhtamôwin: `masinahikana = masinahikana$+ 4`.
> Namôya kâ-mâmawi-pimipayihcikâtêk: niswaw wîhtamôwin kâ-isi-pimipayihcikâtêk.

---

## Tupêl

```zymbol
// Wîhcikâtêw tupêl
iyinîw = (isiyihkâsowin: "Alice", akihtâson: 25)
>> iyinîw.isiyihkâsowin ¶    // → Alice
>> iyinîw.akihtâson ¶        // → 25
>> iyinîw[0] ¶               // → Alice (akihtâson mîna âpacihiwêwin)
```

---

## Nîpawistamâkêwina

HOF-masinahikanisa **lamda kâ-pimipayihcikâtêk** kihci — namôya lamda-pîkiskwêwin kiyâpic.

```zymbol
akihtâsona = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
pêyakositwa = akihtâsona$> (kî -> kî * 2)
>> pêyakositwa ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
nisto = akihtâsona$| (kî -> kî % 2 == 0)
>> nisto ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (nâtamowin, (kâ-mâmawi-wîhtamihk, kîkway) -> kâ-ispayik)
mâmawi = akihtâsona$< (0, (mâmawi, kî) -> mâmawi + kî)
>> mâmawi ¶    // → 55
```

---

## Kâ-Mâyipayik

```zymbol
!? {
    kî = 10 / 0
} :! ##Div {
    >> "Namôya akihtâson kâ-sipihkêhk" ¶
} :! ##IO {
    >> "IO kâ-mâyipayik" ¶
} :! {
    >> "pîtos kâ-mâyipayik: " _err ¶
} :> {
    >> "kahkiyaw ispayiw" ¶
}
```

| Kîkway        | Tânisîsi ispayiw                        |
|---------------|-----------------------------------------|
| `##Div`       | Namôya akihtâson kâ-sipihkêhk           |
| `##IO`        | Masinahikanis / kâ-ispayik              |
| `##Index`     | Akihtâsow pihci kâ-ispayik              |
| `##Type`      | Kîkway-kistêyimôwin kâ-mâyipayik        |
| `##Parse`     | Kâ-misinahamihk kâ-mâyipayik            |
| `##Network`   | Kâ-wâpahtamihk kâ-mâyipayik             |
| `##_`         | Kahkiyaw kâ-mâyipayik (catch-all)       |

---

## Masinahikan Ôhi

```zymbol
// Masinahikan: lib/mâmawihoht.zy
# mâmawihoht

#> { mâmawihoht, get_pâyi }    // Nâtawihoht NISTAM wîhtamôwinihk isi

_pâyi := 3.14159
mâmawihoht(kî, nî) { <~ kî + nî }
get_pâyi() { <~ _pâyi }
```

```zymbol
// Masinahikan: nistam.zy
<# ./lib/mâmawihoht <= sê    // Wîhcikâtêwin kihci

>> sê::mâmawihoht(5, 3) ¶  // → 8
pâyi = sê::get_pâyi()
>> pâyi ¶                    // → 3.14159
```

---

## Mâmawôhkatôwin: FizzBuzz

```zymbol
mâmawihoht(akihtâson) {
    ? akihtâson % 15 == 0 { <~ "PapîwinWîwîhcikan" }
    _? akihtâson % 3  == 0 { <~ "Papîwin" }
    _? akihtâson % 5  == 0 { <~ "Wîwîhcikan" }
    _ { <~ akihtâson }
}

@ ê:1..20 { >> mâmawihoht(ê) ¶ }
```

---

## Masinahikanis Ôhci Kâ-Nâtawihoht

| Masinahikanis | Âpacihâwin          | Masinahikanis  | Âpacihâwin                 |
|---------------|---------------------|----------------|----------------------------|
| `=`           | Pîkiskwêwin         | `$#`           | Tipahikêwin                |
| `:=`          | Namôya Pâstâhôw     | `$+`           | Wîhtamôwin                 |
| `>>`          | Nâtawihoht          | `$-`           | Kâ-wîhtamihk (akihtâson)  |
| `<<`          | Tâpakêw             | `$?`           | Kâ-itohtatihk              |
| `¶`/`\`      | Pihtwâwin           | `$[s..e]`      | Kîskihwin                  |
| `?`           | ? (if)              | `$>`           | map                        |
| `_?`          | _? (elif)           | `$\|`         | filter                     |
| `_`           | _ / kâ-pîkiskwêhk  | `$<`           | reduce                     |
| `??`          | match               | `!?`           | kâ-kîskinotahwâhk (try)    |
| `@`           | Kâ-Ispayik          | `:!`           | kâ-kîsihtâhk (catch)       |
| `@!`          | @! (break)          | `:>`           | kahkiyaw (finally)         |
| `@>`          | @> (continue)       | `$!`           | kâ-mâyipayik               |
| `->`          | lamda               | `$!!`          | kâ-wîhtamihk mâyipayiwin   |
| `<~`          | Kîhtwâm (return)    | `#`            | Masinahikan wîhtamôwin     |
| `\|>`        | Pipe                | `#>`           | Nâtawihoht                 |
| `#1`          | tâpwêwin            | `<#`           | Pê-isi-nâtawihoht          |
| `#0`          | namôya tâpwêwin     | `::`           | Masinahikan âpacihâwin     |

---

*Zymbol-Lang — Masinahikanis. Pêyak. Namôya Pâstâhôw.*

---

> **Kiskêyihtamowin:** Ôma masinahikanis kistêyimôwin-âpacihikêwin (AI) kâ-osîhtâhk mîna kâ-pîkiskwêwihcikêhk. Pîkiskwêwina itwêwina (altlab.ualberta.ca) kâ-nâtawihohtamihk — Wolvengrey mîna Maskwacîs masinahikana.
> Kahkiyaw kâ-isi-itôtamihk mâka mâskôc pîtos pîkiskwêwina mîna tipahikêwina mâyitôtamwak.
> Nistam âpacihâwin: [Zymbol-Lang kîskinahamâkêwin](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
