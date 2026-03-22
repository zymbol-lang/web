# Bhuku Pfupi reZymbol-Lang

**Zymbol-Lang** mutauro wekurongedza unoshanda nesimbo. Haashandisi mazwi ekutanga — zvose isimbo. Inoshanda nenzira imwe chete mumutauro wose wemunhu.

---

## Ruzivo

- Hapana mazwi ekutanga (`if`, `while`, `return` haagarepo — simbo chete `?`, `@`, `<~`)
- Unicode yakakwana — mazita emutauro wose kana emoji 👋
- Inoshanda mumutauro wose — code inofanana mumitauro yose

---

## Zvinochinja neZvisingazochinji

```zymbol
x = 10           // chinochinja (chinogona kushandurwa)
PI := 3.14159    // chisingazochinji (hachichinji — kuisa zvakare kuchakanganisa)
zita = "Ana"
chokwadi = #1    // boolean yechokwadi
👋 := "Mhoro"
```

### Kuisa Pamwe

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Mhando dzeZvakachengeterwa

| Mhando         | Muenzaniso          | Simbo `#?` | Mazwi                               |
|----------------|---------------------|------------|-------------------------------------|
| Nhamba yese    | `42`, `-7`          | `###`      | 64-bit ine chiratidzo               |
| Nhamba pfupisi | `3.14`, `1.5e10`    | `##.`      | Nyorwa yesainzi inoshanda           |
| Shoko          | `"mhoro"`           | `##"`      | Kuisa: `"Mhoro {zita}"`            |
| Bvuma          | `'A'`               | `##'`      | Bvuma imwe yeUnicode                |
| Boolean        | `#1`, `#0`          | `##?`      | HAISI nhamba 1 kana 0               |
| Matanda        | `[1, 2, 3]`         | `##]`      | Zvose zvemhando imwe                |
| Tupeli         | `(a, b)`            | `##)`      | Yenzvimbo                           |
| Tupeli ine zita| `(x: 1, y: 2)`      | `##)`      | Kuwana nezita kana nenhamba         |

---

## Kuratidza nekuPinda

```zymbol
// Kuratidza — HAISI kuisa mutsara witsva otomatiki
>> "Mhoro" ¶                    // ¶ kana \\ inopa mutsara witsva
>> "a=" a " b=" b ¶             // mimiririro inoverengeka pamwe chete
>> "muripo=" kuchera(2, 3) ¶    // mabasa anoshanda panzvimbo yose
>> (arr$#) ¶                    // simbo dzinotevera dzinoda makurigu

// Kupinda
<< zita                         // pasina chiratidzo — inoverengera mune chinochinja
<< "Zita rako? " zita           // ine chiratidzo
```

> `¶` kana `\\` zvakaenzana somunyorwa wetsva.

---

## Kubatanidza Mashoko

Nzira nhatu dzakakodzera — imwe neimwe yenzvimbo yayo:

```zymbol
zita = "Ana"
nhamba = 25

// 1. Koma — mukuisa ne = kana :=
msg = "Mhoro ", zita, "!"                // → Mhoro Ana!
TITLE := "Mushandisi: ", zita

// 2. Kuisa pamwe — mukuratidza >>
>> "Mhoro " zita " une makore " nhamba ¶  // → Mhoro Ana une makore 25

// 3. Kuisa mukati — munzvimbo yose
tsananguro = "Mhoro {zita}, une makore {nhamba}"  // → Mhoro Ana, une makore 25
```

> **Ziva**: `+` inoshanda nhamba chete. Neshoko inogadzira yambiro.

---

## Kutungamira Kwekufamba

```zymbol
x = 7

// Kana chete
? x > 0 { >> "nyamupfihwa" ¶ }

// Kana / kana zvakare / zvimwe
? x > 100 {
    >> "kukura" ¶
} _? x > 0 {
    >> "nyamupfihwa" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "nhamba isina pfihwa" ¶
}
```

Mabhokisi `{ }` **anodikanwa**, kunyangwe mutsara umwe chete.

---

## Match

```zymbol
// Match ine nzvimbo
nhamba = 85
chiratidzo = ?? nhamba {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> chiratidzo ¶    // → B

// Match ine vhareti (mamiriro ekuongorora)
tembiricha = -5
mamiriro = ?? tembiricha {
    _? tembiricha < 0  : "chando"
    _? tembiricha < 20 : "chibvumirano"
    _? tembiricha < 35 : "kupisa"
    _                  : "kupisa kwazvo"
}
>> mamiriro ¶    // → chando

// Match neshoko
ruvara = "tsvuku"
code = ?? ruvara {
    "tsvuku"  : "#FF0000"
    "girini"  : "#00FF00"
    _         : "#000000"
}
>> code ¶
```

---

## Kudzokera

```zymbol
// Nzvimbo ine mukati: 0..4 inotenderera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Nzvimbo ine danho
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Nzvimbo dzokudzoka
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Solange (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Zvakachengeterwa zvose
michero = ["Apuro", "Mango", "Hrozeni"]
@ chichero:michero { >> chichero ¶ }

// Pamusoro pebvuma dzomutsara
@ c:"mhoro" { >> c "-" }
>> ¶    // → m-h-o-r-o-

// Kumira nekuramba
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> ramba
    ? i > 7 { @! }          // @! mira
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Mabasa

```zymbol
// Kutsanangura nekushandisa
kuchera(a, b) { <~ a + b }
>> kuchera(3, 4) ¶    // → 7

// Kudzokera (recursion)
factorial(nhamba) {
    ? nhamba <= 1 { <~ 1 }
    <~ nhamba * factorial(nhamba - 1)
}
>> factorial(5) ¶    // → 120

// Mabasa ane nzvimbo yakasiyanasiyana — haagone kuwana zviri kunze
global = 100
ongorora() {
    x = 42    // yepasi chete
    <~ x
}
>> ongorora() ¶    // → 42
```

> **Kunyanya**: Mabasa ane zita `zita(params){ }` haasi zvakachengeterwa zvekutanga.
> Kupfuudza semutsigiri: `x -> zita(x)`.

---

## Lambda neBatanidzo

```zymbol
// Lambda nyore (kudzoka kwakavanzwa)
kaviri = x -> x * 2
muripo = (a, b) -> a + b
>> kaviri(5) ¶    // → 10
>> muripo(3, 7) ¶   // → 10

// Lambda ine bhokisi (kudzoka kwakajeka)
rongedza = x -> {
    ? x > 0 { <~ "nyamupfihwa" }
    _? x < 0 { <~ "nhamba isina pfihwa" }
    <~ "zero"
}
>> rongedza(5) ¶     // → nyamupfihwa
>> rongedza(0) ¶     // → zero
>> rongedza(-5) ¶    // → nhamba isina pfihwa

// Kudzinga — Lambda dzinotora zviri kunze
mhando = 3
katatu = x -> x * mhando    // inotora 'mhando'
>> katatu(7) ¶    // → 21

// Fekitori yebasa
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda sezvakachengeterwa: dzakachengetwa mumatanda
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Matanda

```zymbol
arr = [10, 20, 30, 40, 50]

// Kuwana (0-based index)
>> arr[0] ¶    // → 10

// Hurefu (makurigu anodikanwa mu >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Kuwedzera, kubvisa, kuva nacho, chikamu
arr = arr$+ 60               // kuwedzera
arr = arr$- 0                // kubvisa index 0
kune = arr$? 30               // → #1
chikamu = arr$[0..2]          // [20, 30]

// Kushandura chinhu
arr[1] = 99

// Zvose zvakachengeterwa
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` dzinodzorera **matanda matsva** — isa zvakare: `arr = arr$+ 4`.
> Hapana kuenzanisa: shandisa kuisa kaviri zvakasiyana.

---

## Tupeli

```zymbol
// Tupeli ine zita
munhu = (zita: "Alice", makore: 25)
>> munhu.zita ¶    // → Alice
>> munhu.makore ¶   // → 25
>> munhu[0] ¶      // → Alice (index inoshanda zvakare)
```

---

## Mabasa epamusoro

Mabasa epamusoro anoda **lambda yakanyorwa mukati** — haashandisi chinochinja chelambda.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
kaviri = nums$> (x -> x * 2)
>> kaviri ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
nhamba_dzakadzika = nums$| (x -> x % 2 == 0)
>> nhamba_dzakadzika ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (mutangiro, (accumulator, chinhu) -> mutsara)
muripo = nums$< (0, (acc, x) -> acc + x)
>> muripo ¶    // → 55
```

---

## Kugadzirisa Zvakaipa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Kupatsanura nezero" ¶
} :! ##IO {
    >> "Dambudziko reIO" ¶
} :! {
    >> "dambudziko rimwe: " _err ¶
} :> {
    >> "inogara ichiita" ¶
}
```

| Mhando      | Rinobuda rinhi                    |
|-------------|-----------------------------------|
| `##Div`     | Kupatsanura nezero                |
| `##IO`      | Faira / Sistema                   |
| `##Index`   | Index iri kunze kwenzvimbo        |
| `##Type`    | Dambudziko remhando               |
| `##Parse`   | Dambudziko rekuongorora           |
| `##Network` | Dambudziko reNetworki             |
| `##_`       | Dambudziko ripi neripi (catch-all)|

---

## Mamodhuru

```zymbol
// Faira: lib/calc.zy
# calc

#> { kuchera, get_PI }    // Kutumira PAMBERI petsananguro

_PI := 3.14159
kuchera(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Faira: main.zy
<# ./lib/calc <= c    // Zita rakadikanwa

>> c::kuchera(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

---

## Muenzaniso Wakakwana: FizzBuzz

```zymbol
kuchera(nhamba) {
    ? nhamba % 15 == 0 { <~ "FizziBuzzi" }
    _? nhamba % 3  == 0 { <~ "Fizzi" }
    _? nhamba % 5  == 0 { <~ "Buzzi" }
    _ { <~ nhamba }
}
@ i:1..20 { >> kuchera(i) ¶ }
```

---

## Ongorora Zvisimbiso

| Simbo   | Basa               | Simbo      | Basa                  |
|---------|--------------------|------------|-----------------------|
| `=`     | Chinochinja        | `$#`       | Hurefu                |
| `:=`    | Chisingazochinji   | `$+`       | Kuwedzera             |
| `>>`    | Kuratidza          | `$-`       | Kubvisa (nenhamba)    |
| `<<`    | Kupinda            | `$?`       | Kuva nacho            |
| `¶`/`\` | Mutsara witsva     | `$[s..e]`  | Chikamu               |
| `?`     | kana (if)          | `$>`       | map                   |
| `_?`    | kana zvakare (elif)| `$\|`      | filter                |
| `_`     | zvimwe / nzvimbo   | `$<`       | reduce                |
| `??`    | match              | `!?`       | edza (try)            |
| `@`     | tenderera (loop)   | `:!`       | bata (catch)          |
| `@!`    | mira (break)       | `:>`       | nguva yose (finally)  |
| `@>`    | ramba (continue)   | `$!`       | iri kukanganisa       |
| `->`    | Lambda             | `$!!`      | pindura kanganiso     |
| `<~`    | dzokera (return)   | `#`        | tsanangura modhuru    |
| `\|>`   | Pipe               | `#>`       | tumira (export)       |
| `#1`    | chokwadi           | `<#`       | isa (import)          |
| `#0`    | nhema              | `::`       | Kushandisa modhuru    |

---

*Zymbol-Lang — Isimbo. Inoshanda pasi pose. Isingazochinji.*

---

> **Zivo:** Bhuku iri rakagadzirwa uye rakashandurwa neMuchenjeri weKurongedza (AI).
> Zvose zvakaitwa kuti rume chokwadi, asi shanduro dzimwe kana mienzaniso inogona kuva neminamato.
> Zano rechokwadi nde [zvirevo zveZymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
