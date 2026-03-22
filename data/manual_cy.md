# Llawlyfr Cryno Zymbol-Lang

**Zymbol-Lang** yw iaith raglennu symbolaidd. Nid yw'n defnyddio unrhyw eiriau allweddol — mae popeth yn symbol. Mae'n gweithio'r un fath ym mhob iaith ddynol.

---

## Athroniaeth

- Dim geiriau allweddol (`os`, `dolen`, `dychwelyd` nid ydynt yn bodoli — dim ond symbolau `?`, `@`, `<~`)
- Unicode llawn — cyfrifiaduron mewn unrhyw iaith neu emoji 👋
- Iaith-ddynol-amherthnasol — mae'r cod yr un peth ym mhob iaith

---

## Newidynnau a Chysonion

```zymbol
x = 10           // newidyn (newidiadwy)
PI := 3.14159    // cysonyn (annewidiadwy — gwall os ailneiltuir)
enw = "Ana"
actif = #1       // boole gwir
👋 := "Helo"
```

### Aseiniad Cyfansawdd

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

## Mathau Data

| Math           | Enghraifft          | Symbol `#?` | Nodiadau                              |
|----------------|---------------------|-------------|---------------------------------------|
| Cyfanrif       | `42`, `-7`          | `###`       | 64-did arwyddol                       |
| Pwynt Arnawf   | `3.14`, `1.5e10`    | `##.`       | Nodiant gwyddonol OK                  |
| Llinyn         | `"helo"`            | `##"`       | Rhyngosodiad: `"Helo {enw}"`          |
| Cymeriad       | `'A'`               | `##'`       | Un cymeriad Unicode                   |
| Boole          | `#1`, `#0`          | `##?`       | NID yn rhifiadol 1 a 0                |
| Arae           | `[1, 2, 3]`         | `##]`       | Rhaid i bob elfen fod o'r un math     |
| Twpl           | `(a, b)`            | `##)`       | Seilio ar safle                       |
| Twpl Enwol     | `(x: 1, y: 2)`      | `##)`       | Mynediad drwy enw neu fynegai         |

---

## Allbwn a Mewnbwn

```zymbol
// Allbwn — NID yn ychwanegu llinell newydd yn awtomatig
>> "Helo, Byd Cymraeg!" ¶              // ¶ neu \\ yn rhoi llinell newydd benodol
>> "a=" a " b=" b ¶                    // gwerthoedd lluosog ochr yn ochr
>> "swm=" add(2, 3) ¶                  // galwadau ffwythiant mewn unrhyw safle
>> (ffrwyth$#) ¶                       // mae angen cromfachau ar weithredwyr ôl-dodi

// Mewnbwn
<< enw                                 // dim anogaeth — yn darllen i mewn i newidyn
<< "Eich enw? " enw                    // gydag anogaeth
```

> `¶` neu `\\` sy'n gywerth â llinell newydd.

---

## Cysylltu Llinynau

Tair ffurf ddilys — pob un ar gyfer ei chyd-destun:

```zymbol
enw = "Ana"
rhif = 25

// 1. Atalnod — mewn aseiniadau gyda = neu :=
neges = "Helo ", enw, "!"              // → Helo Ana!
TEITL := "Defnyddiwr: ", enw

// 2. Ochr yn ochr — mewn >> allbwn
>> "Helo " enw " rydych chi'n " rhif ¶  // → Helo Ana rydych chi'n 25

// 3. Rhyngosodiad — mewn unrhyw gyd-destun
disgrifiad = "Helo {enw}, rydych chi'n {rhif}"  // → Helo Ana, rydych chi'n 25
```

> **Nodyn**: `+` ar gyfer rhifau yn unig. Mae ei ddefnyddio gyda llinynau yn cynhyrchu rhybudd.

---

## Llif Rheoli

```zymbol
x = 7

// Os syml
? x > 0 { >> "positif" ¶ }

// os / arall-os / arall
? x > 100 {
    >> "mawr" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "sero" ¶
} _ {
    >> "negatif" ¶
}
```

Mae blociau `{ }` yn **ofynnol** hyd yn oed ar gyfer un llinell.

---

## Cyfatebu

```zymbol
// Cyfatebu gydag ystodau
pwyntiau = 85
gradd = ?? pwyntiau {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> gradd ¶    // → B

// Cyfatebu gyda gwylwyr (amodau mympwyol)
tymheredd = -5
cyflwr = ?? tymheredd {
    _? tymheredd < 0  : "iâ"
    _? tymheredd < 20 : "oer"
    _? tymheredd < 35 : "cynnes"
    _                 : "poeth"
}
>> cyflwr ¶    // → iâ

// Cyfatebu gyda llinynau
lliw = "coch"
cod = ?? lliw {
    "coch"   : "#FF0000"
    "gwyrdd" : "#00FF00"
    _        : "#000000"
}
>> cod ¶
```

---

## Dolenni

```zymbol
// Ystod gynhwysol: 0..4 yn ailadrodd 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Ystod gyda cham
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Ystod wrthdroi
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Tra
rhif = 1
@ rhif <= 64 { rhif *= 2 }
>> rhif ¶    // → 128

// Am-bob-un dros arae
ffrwyth = ["afal", "gellygen", "grawnwin"]
@ f:ffrwyth { >> f ¶ }

// Dros gymeriadau llinyn
@ c:"helo" { >> c "-" }
>> ¶    // → h-e-l-o-

// Torri a Pharhau
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> parhau
    ? i > 7 { @! }          // @! torri
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Ffwythiannau

```zymbol
// Datganiad a galwad
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

// Ailgyfeiriad
dyblu(n) {
    ? n <= 1 { <~ 1 }
    <~ n * dyblu(n - 1)
}
>> dyblu(5) ¶    // → 120

// Mae gan ffwythiannau gwmpas ynysig — dim mynediad at newidynnau allanol
byd_eang = 100
profi() {
    x = 42    // lleol yn unig
    <~ x
}
>> profi() ¶    // → 42
```

> **Pwysig**: Nid yw ffwythiannau enwol `enw(paramedrau){ }` yn werthoedd dosbarth cyntaf.
> I'w basio fel dadl, lapiwch: `x -> enw(x)`.

---

## Lambdas a Chaead

```zymbol
// Lambda syml (dychweliad ymhlyg)
dyblu = x -> x * 2
swm = (a, b) -> a + b
>> dyblu(5) ¶    // → 10
>> swm(3, 7) ¶   // → 10

// Lambda bloc (dychweliad penodol)
dosbarthu = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "sero"
}
>> dosbarthu(5) ¶     // → positif
>> dosbarthu(0) ¶     // → sero
>> dosbarthu(-5) ¶    // → negatif

// Caead — mae lambdas yn dal newidynnau cwmpas allanol
ffactor = 3
treblu = x -> x * ffactor    // yn dal 'ffactor'
>> treblu(7) ¶    // → 21

// Ffatri ffwythiant
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas fel gwerthoedd: storio mewn araeau
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Araeau

```zymbol
arr = [10, 20, 30, 40, 50]

// Mynediad (mynegai 0-seiliedig)
>> arr[0] ¶    // → 10

// Hyd (mae angen cromfachau yn >>)
rhif = arr$#
>> (arr$#) ¶    // → 5

// Ychwanegu, tynnu, yn cynnwys, sleisen
arr = arr$+ 60               // ychwanegu
arr = arr$- 0                // tynnu mynegai 0
mae = arr$? 30               // → #1
sleisen = arr$[0..2]         // [20, 30]

// Diweddaru elfen
arr[1] = 99

// Am-bob-un
@ x:arr { >> x " " }
>> ¶
```

> Mae `$+`, `$-`, `$[..]` yn dychwelyd **arae newydd** — neiltuiwch yn ôl: `arr = arr$+ 4`.
> Dim cadwyniad: defnyddiwch ddau aseiniad ar wahân.

---

## Typlau

```zymbol
// Twpl enwol
person = (name: "Alice", age: 25)
>> person.name ¶    // → Alice
>> person.age ¶     // → 25
>> person[0] ¶      // → Alice (mae mynegai hefyd yn gweithio)
```

---

## Ffwythiannau Uwch Drefn

Mae gweithredwyr HOF yn gofyn am **lambda mewnol** — nid newidyn lambda uniongyrchol.

```zymbol
rhifau = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Mapio ($>)
dyblu_maes = rhifau$> (x -> x * 2)
>> dyblu_maes ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Hidlo ($|)
eilrif = rhifau$| (x -> x % 2 == 0)
>> eilrif ¶    // → [2, 4, 6, 8, 10]

// Lleihau ($<) — (cychwynnol, (crynhoad, elfen) -> myneg)
cyfanswm = rhifau$< (0, (acc, x) -> acc + x)
>> cyfanswm ¶    // → 55
```

---

## Trin Gwallau

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "rhannu â sero" ¶
} :! ##IO {
    >> "gwall IO" ¶
} :! {
    >> "gwall arall: " _err ¶
} :> {
    >> "yn rhedeg bob amser" ¶
}
```

| Math        | Pan ddigwydd             |
|-------------|--------------------------|
| `##Div`     | Rhannu â sero            |
| `##IO`      | Ffeil / system           |
| `##Index`   | Mynegai y tu hwnt i fwnd |
| `##Type`    | Gwall math               |
| `##Parse`   | Dadosodiad data          |
| `##Network` | Gwallau rhwydwaith       |
| `##_`       | Unrhyw wall (dal-popeth) |

---

## Modiwlau

```zymbol
// Ffeil: lib/calc.zy
# calc

#> { add, get_PI }    // allforio CYN diffiniadau

_PI := 3.14159
add(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Ffeil: main.zy
<# ./lib/calc <= c    // mae angen alias

>> c::add(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Enghraifft Gyflawn: FizzBuzz

```zymbol
dosbarthu(rhif) {
    ? rhif % 15 == 0 { <~ "SwigenBwm" }
    _? rhif % 3  == 0 { <~ "Swigen" }
    _? rhif % 5  == 0 { <~ "Bwm" }
    _ { <~ rhif }
}

@ i:1..20 { >> dosbarthu(i) ¶ }
```

---

## Cyfeiriad Symbolau

| Symbol   | Gweithrediad       | Symbol     | Gweithrediad        |
|----------|--------------------|------------|---------------------|
| `=`      | newidyn            | `$#`       | hyd                 |
| `:=`     | cysonyn            | `$+`       | ychwanegu           |
| `>>`     | allbwn             | `$-`       | tynnu (mynegai)     |
| `<<`     | mewnbwn            | `$?`       | yn cynnwys          |
| `¶`/`\`  | llinell newydd     | `$[s..e]`  | sleisen             |
| `?`      | os                 | `$>`       | mapio               |
| `_?`     | arall-os           | `$\|`      | hidlo               |
| `_`      | arall / cardiau gwyllt | `$<`   | lleihau             |
| `??`     | cyfatebu           | `!?`       | ceisio              |
| `@`      | dolen              | `:!`       | dal                 |
| `@!`     | torri              | `:>`       | yn y diwedd         |
| `@>`     | parhau             | `$!`       | yw gwall            |
| `->`     | lambda             | `$!!`      | lledaenu gwall      |
| `<~`     | dychwelyd          | `#`        | datgan fodiwl       |
| `\|>`    | pibell             | `#>`       | allforio            |
| `#1`     | gwir               | `<#`       | mewnforio           |
| `#0`     | anwir              | `::`       | galwad fodiwl       |

---

*Zymbol-Lang — Symbolaidd. Cyffredinol. Annewidiol.*

---

> **Rhybudd:** Crëwyd a chyfieithwyd y ddogfennaeth hon gan ddeallusrwydd artiffisial (DA). Gwnaed pob ymdrech i sicrhau cywirdeb, ond gall rhai cyfieithiadau neu enghreifftiau gynnwys gwallau. Y cyfeiriad awdurdodol yw [manylebau Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
