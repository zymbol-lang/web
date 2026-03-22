# Ingcaciso Emfutshane ye-Zymbol-Lang

**Zymbol-Lang** lulwimi lwekhompyutha lweempawu. Ayisebenzisi amagama angundoqo — yonke into yimpawu. Isebenza ngendlela efanayo kuyo nayiphi na ilwimi loluntu.

---

## Ufilosofi

- Akukho magama angundoqo (`if`, `while`, `return` akakho — iimpawu kuphela `?`, `@`, `<~`)
- Unicode epheleleyo — amagama kulo naliphi na ulwimi okanye i-emoji 👋
- Ulwimi-agnostiki — ikhodi ifana kuzo zonke iilwimi

---

## Iinguqu neziConstant

```zymbol
x = 10           // Inguqu (iyatshintsha)
PI := 3.14159    // IziConstant (ayitshintshi — impazamo ukuphinda unikezele)
igama = "Ana"
iyasebenza = #1  // ubunyaniso be-boolean
👋 := "Molo"
```

### Ukumiselwa okudityanisiweyo

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

## Iintlobo zeData

| Uhlobo           | Umzekelo            | Impawu `#?` | Amanothi                              |
|------------------|---------------------|-------------|---------------------------------------|
| Inombolo yonke   | `42`, `-7`          | `###`       | I-64-bit enengqinamba                 |
| Inombolo enxibe  | `3.14`, `1.5e10`    | `##.`       | Uhlobo lwesayensi luyamkelwa          |
| Umxholo          | `"molo"`            | `##"`       | Ukuphinda: `"Molo {igama}"`           |
| Unobumba         | `'A'`               | `##'`       | Unobumba omnye we-Unicode             |
| Ubunyaniso       | `#1`, `#0`          | `##?`       | AYIZO iinombolo 1 no-0                |
| Uluhlu           | `[1, 2, 3]`         | `##]`       | Zonke izinto zohlobo olufanayo        |
| Tupel            | `(a, b)`            | `##)`       | Ngomgangatho                          |
| Tupel enegama    | `(x: 1, y: 2)`      | `##)`       | Ukufikelela ngegama okanye ngenombolo |

---

## Umxholo nokuNgenisa

```zymbol
// Ukukhipha — AYONGEZI umgca omtsha ngokuzenzekelayo
>> "Molo" ¶                       // ¶ okanye \\ unika umgca omtsha obhaliweyo
>> "a=" a " b=" b ¶               // izihloko ezininzi ngokubekana
>> "isums=" hlela(2, 3) ¶         // iminxeba yemisebenzi kwindawo nayiphi na
>> (uluhlu$#) ¶                   // ii-operator zokugqibela zifuna izibiyeli

// Ukungena
<< igama                          // ngaphandle kwesikhokelo — ifunda kwinguqu
<< "Igama lakho? " igama          // nesikhokelo
```

> `¶` okanye `\\` zilingana njengomgca omtsha.

---

## Ukudibanisa iziGama

Iindlela ezintathu ezifanelekileyo — ngamnye kwimeko yakhe:

```zymbol
igama = "Ana"
n = 25

// 1. Ikoma — kwimithetho ene = okanye :=
umyalezo = "Molo ", igama, "!"                // → Molo Ana!
ISIHLOKO := "Umsebenzisi: ", igama

// 2. Ukubekana — kwukukhipha >>
>> "Molo " igama " uneminyaka " n ¶           // → Molo Ana uneminyaka 25

// 3. Ukuphinda — kwimeko nayiphi na
incaciso = "Molo {igama}, uneminyaka {n}"     // → Molo Ana, uneminyaka 25
```

> **Ingxelo**: `+` iyasetyenziswa kwiinombolo kuphela. Kwizigama, ikhuphe isilumkiso.

---

## uLawulo lweSikhephe

```zymbol
x = 7

// Ukuba elula
? x > 0 { >> "ngenxa" ¶ }

// Ukuba / ukuba ngaphandle / enye
? x > 100 {
    >> "nkulu" ¶
} _? x > 0 {
    >> "ngenxa" ¶
} _? x == 0 {
    >> "iqanda" ¶
} _ {
    >> "ngesantya" ¶
}
```

Iibhloko `{ }` **ziyafuneka**, nangona ngokomgca omnye.

---

## Match

```zymbol
// Match ngezikhala
inombolo = 85
uvavanyo = ?? inombolo {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> uvavanyo ¶    // → B

// Match ngezikhuseli (imiqathango nayiphi na)
ubushushu = -5
imeko = ?? ubushushu {
    _? ubushushu < 0  : "qabaka"
    _? ubushushu < 20 : "banda"
    _? ubushushu < 35 : "fudumele"
    _                 : "shushu"
}
>> imeko ¶    // → qabaka

// Match nezigama
umbala = "bomvu"
ikhodi = ?? umbala {
    "bomvu"  : "#FF0000"
    "luhlaza" : "#00FF00"
    _         : "#000000"
}
>> ikhodi ¶
```

---

## Izijikelezi

```zymbol
// Isikhala esithe qelele: 0..4 ihamba 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Isikhala nenyathelo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Isikhala esibuyayo
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Ngelixa (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Kwinto nganye
iziqhamo = ["Apile", "Umcimbi", "Igilivane"]
@ isiqhamo:iziqhamo { >> isiqhamo ¶ }

// Phezu kwenobumba wesigama
@ u:"molo" { >> u "-" }
>> ¶    // → m-o-l-o-

// Ukuyeka nokuqhubeka
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> qhubeka
    ? i > 7 { @! }          // @! yeka
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## IiNto eziSebenzayo

```zymbol
// Ukuxela nokubiza
hlela(a, b) { <~ a + b }
>> hlela(3, 4) ¶    // → 7

// Ukuphinda-phinda
isixa(inombolo) {
    ? inombolo <= 1 { <~ 1 }
    <~ inombolo * isixa(inombolo - 1)
}
>> isixa(5) ¶    // → 120

// Imisebenzi inamazwe ahlukanisiweyo — ayifikeleli iziguqu zangaphandle
jikelele = 100
uvavanyo() {
    x = 42    // yasekhaya kuphela
    <~ x
}
>> uvavanyo() ¶    // → 42
```

> **Ibalulekile**: Imisebenzi enegama `igama(params){ }` ayizizo izixhobo zexabiso lokuqala.
> Ukudlulisa njengempikiswano, biyela: `x -> igama(x)`.

---

## Lambda neziValo

```zymbol
// Lambda elula (ubuyelo obufihlakeleyo)
kabini = x -> x * 2
isums = (a, b) -> a + b
>> kabini(5) ¶    // → 10
>> isums(3, 7) ¶  // → 10

// Lambda enebhloko (ubuyelo obucacileyo)
ukuhlela = x -> {
    ? x > 0 { <~ "ngenxa" }
    _? x < 0 { <~ "ngesantya" }
    <~ "iqanda"
}
>> ukuhlela(5) ¶     // → ngenxa
>> ukuhlela(0) ¶     // → iqanda
>> ukuhlela(-5) ¶    // → ngesantya

// IziValo — amalambda athatha iziguqu zangaphandle
umlinganiselo = 3
kathathu = x -> x * umlinganiselo    // ithatha 'umlinganiselo'
>> kathathu(7) ¶    // → 21

// Ifektri yemisebenzi
yenza_umdibanisi(n) { <~ x -> x + n }
dibanisa10 = yenza_umdibanisi(10)
>> dibanisa10(5) ¶    // → 15

// Amalambda njengamaxabiso: agcinwa kuluhlu
imienzo = [x -> x+1, x -> x*2, x -> x*x]
>> imienzo[0](5) ¶    // → 6
>> imienzo[2](5) ¶    // → 25
```

---

## Uluhlu

```zymbol
uluhlu = [10, 20, 30, 40, 50]

// Ukufikelela (inombolo esiqalweni ngu-0)
>> uluhlu[0] ¶    // → 10

// Ubude (izibiyeli ziyafuneka ku->>)
n = uluhlu$#
>> (uluhlu$#) ¶    // → 5

// Ukongeza, ukususa, ukuqulethe, isiqephu
uluhlu = uluhlu$+ 60               // ukongeza
uluhlu = uluhlu$- 0                // susa inombolo 0
unayo = uluhlu$? 30                // → #1
isiqephu = uluhlu$[0..2]           // [20, 30]

// Buyekeza into
uluhlu[1] = 99

// Kwinto nganye
@ x:uluhlu { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` zibuyisela **uluhlu olutsha** — phinda unikezele: `uluhlu = uluhlu$+ 4`.
> Akukho ukuxhomeka: sebenzisa imibophelelo emibini ehlukanisiweyo.

---

## Tuple

```zymbol
// Tupel enegama
umntu = (igama: "Alice", iminyaka: 25)
>> umntu.igama ¶      // → Alice
>> umntu.iminyaka ¶   // → 25
>> umntu[0] ¶         // → Alice (inombolo iyasebenza nawe)
```

---

## IiNto eziSebenzayo zeNqanaba eliPhezulu

Ii-operator ze-HOF zifuna **i-lambda ye-inline** — akukho inguqu ye-lambda ethe ngqo.

```zymbol
iinombolo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
kabini = iinombolo$> (x -> x * 2)
>> kabini ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
amaphepha = iinombolo$| (x -> x % 2 == 0)
>> amaphepha ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (ixabiso lokuqala, (umqokeleli, into) -> unxibelelwano)
isums = iinombolo$< (0, (uqokeleli, x) -> uqokeleli + x)
>> isums ¶    // → 55
```

---

## uLawulo lweNgxaki

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Ukwahlula ngo-qanda" ¶
} :! ##IO {
    >> "Impazamo ye-IO" ¶
} :! {
    >> "enye impazamo: " _err ¶
} :> {
    >> "ihlala isebenza" ¶
}
```

| Uhlobo       | Xa kwenzeka                    |
|--------------|--------------------------------|
| `##Div`      | Ukwahlula ngo-qanda            |
| `##IO`       | Ifayile / Uhlelo               |
| `##Index`    | Inombolo ingaphandle           |
| `##Type`     | Impazamo yohlobo               |
| `##Parse`    | Impazamo yokufunda             |
| `##Network`  | Impazamo yenethiwekhi          |
| `##_`        | Nayiphi na impazamo (catch-all)|

---

## IiModyuli

```zymbol
// Ifayile: lib/calc.zy
# calc

#> { hlela, fumana_PI }    // Ukuthumela NGAPHAMBI kwezinto ezichaziweyo

_PI := 3.14159
hlela(a, b) { <~ a + b }
fumana_PI() { <~ _PI }
```

```zymbol
// Ifayile: main.zy
<# ./lib/calc <= c    // I-alias iyafuneka

>> c::hlela(5, 3) ¶   // → 8
pi = c::fumana_PI()
>> pi ¶               // → 3.14159
```

---

## Umzekelo opheleleyo: FizzBuzz

```zymbol
hlela(inombolo) {
    ? inombolo % 15 == 0 { <~ "IgwebuNgxolo" }
    _? inombolo % 3  == 0 { <~ "Igwebu" }
    _? inombolo % 5  == 0 { <~ "Ngxolo" }
    _ { <~ inombolo }
}

@ i:1..20 { >> hlela(i) ¶ }
```

---

## Isalathisi seeMpawu

| Impawu  | Umsebenzi           | Impawu     | Umsebenzi              |
|---------|---------------------|------------|------------------------|
| `=`     | Inguqu              | `$#`       | Ubude                  |
| `:=`    | IziConstant         | `$+`       | ukongeza               |
| `>>`    | Ukukhipha           | `$-`       | susa (ngenombolo)      |
| `<<`    | Ukungena            | `$?`       | uqulathe               |
| `¶`/`\` | Umgca omtsha        | `$[s..e]`  | isiqephu               |
| `?`     | ukuba (if)          | `$>`       | map                    |
| `_?`    | ukuba enye (elif)   | `$\|`      | filter                 |
| `_`     | enye / indawo       | `$<`       | reduce                 |
| `??`    | match               | `!?`       | zama (try)             |
| `@`     | Isijikelezi         | `:!`       | bamba (catch)          |
| `@!`    | yeka (break)        | `:>`       | hlala (finally)        |
| `@>`    | qhubeka (continue)  | `$!`       | yimpazamo              |
| `->`    | Lambda              | `$!!`      | sasa impazamo          |
| `<~`    | buyela (return)     | `#`        | xela imodyuli          |
| `\|>`   | Umjelo (pipe)       | `#>`       | thumela (export)       |
| `#1`    | unyaniso (true)     | `<#`       | ngenisa (import)       |
| `#0`    | ubuxoki (false)     | `::`       | biza imodyuli          |

---

*Zymbol-Lang — Iimpawu. YeHlabathi. Ayitshintshi.*

---

> **Ingxelo:** Le ncwadi yenziwe yahunyushwa ngubuchule bobuchwephesha be-AI.
> Ngokukhulu ukuzinikela kwenziwa ukuqinisekisa ukuchaneka, kodwa amanye amagama okanye imizekelo angazinza iimpazamo.
> Isalathisi esibalulekiyo sisipesifikeshini se-[Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
