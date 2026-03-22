# Umhlahlandlela Omfushane we-Zymbol-Lang

**Zymbol-Lang** ulimi lwekhompyutha lwezimpawu. Alusebenzisi amagama angukhiye — konke kuyimpawu. Lusebenza ngendlela efanayo kunoma yiluphi ulimi lwesintu.

---

## Ubuhlakani

- Akunamagama angukhiye (`if`, `while`, `return` awekhona — izimpawu kuphela `?`, `@`, `<~`)
- Unicode ephelele — izimpawu kunoma yiluphi ulimi noma i-emoji 👋
- Alunandlela yolimi — ikhodi ifana kuzo zonke izilimi

---

## Iziguquli neziConstant

```zymbol
inani = 10           // Isiguquli (shintsheka)
PI := 3.14159        // Constant (ayishintshi — iphutha uma iphinda ibekwe)
igama = "Ana"
kusebenza = #1       // iqiniso lwe-boolean
👋 := "Sawubona"
```

### Ukubekwa Okuhlangene

```zymbol
inani = 10    // 10
inani += 5    // 15
inani -= 3    // 12
inani *= 2    // 24
inani /= 4    // 6
inani %= 4    // 2
inani++       // 3
inani--       // 2
```

---

## Izinhlobo zeData

| Uhlobo          | Isibonelo           | Impawu `#?` | Amanothi                              |
|-----------------|---------------------|-------------|---------------------------------------|
| Inombolo yonke  | `42`, `-7`          | `###`       | 64-bit enesimpawu                     |
| Inombolo enezigaba | `3.14`, `1.5e10` | `##.`       | Indlela yesayensi ivumelekile         |
| Uchungechunge   | `"sawubona"`        | `##"`       | Ukufaka: `"Sawubona {igama}"`         |
| Uhlamvu         | `'A'`               | `##'`       | Uhlamvu olulodwa lwe-Unicode          |
| Iqiniso         | `#1`, `#0`          | `##?`       | AKUYONA inombolo 1 no-0               |
| Uhlu            | `[1, 2, 3]`         | `##]`       | Zonke izinto zohlobo olufanayo        |
| Tuple           | `(a, b)`            | `##)`       | Ngendawo                              |
| Tuple enegama   | `(x: 1, y: 2)`      | `##)`       | Ukufinyelela ngegama noma inkomba     |

---

## Okukhishwayo nokufakwayo

```zymbol
// Okukhishwayo — AKWENGEZI umugqa omusha ngokwemvelo
>> "Sawubona" ¶                    // ¶ noma \\ unika umugqa omusha ngokucacile
>> "a=" inani " b=" elinye ¶       // amanani amaningi ngokuhlangana
>> "isamba=" hlukanisa(2, 3) ¶     // imisebenzi nganoma yisiphi isikhundla
>> (uhlu$#) ¶                      // izenzo ze-postfix zidinga izibiyeli

// Ukufakwayo
<< igama                           // ngaphandle kwesiyaliso — funda inguquli
<< "Igama lakho? " igama           // nesiyaliso
```

> `¶` noma `\\` afana njengomugqa omusha.

---

## Ukuxhumanisa iziString

Izindlela ezintathu ezivumelekile — ngayinye ingomongo wayo:

```zymbol
igama = "Ana"
iminyaka = 25

// 1. Ikhoma — ekubekweni nge-= noma :=
umyalezo = "Sawubona ", igama, "!"           // → Sawubona Ana!
ISIHLOKO := "Umsebenzisi: ", igama

// 2. Ukuhlangana — ekukhishweni nge->>
>> "Sawubona " igama " uneminyaka " iminyaka ¶   // → Sawubona Ana uneminyaka 25

// 3. Ukufaka — kunoma yimuphi umongo
incazelo = "Sawubona {igama}, uneminyaka {iminyaka}"  // → Sawubona Ana, uneminyaka 25
```

> **Qaphela**: `+` isetulengelwa izinombolo kuphela. Ezistring izokwenza isixwayiso.

---

## Ukulawula uMkhondo

```zymbol
inani = 7

// Uma elilodwa
? inani > 0 { >> "kuphezulu" ¶ }

// Uma / uma-futhi / ngenye indlela
? inani > 100 {
    >> "ukukhulu" ¶
} _? inani > 0 {
    >> "kuphezulu" ¶
} _? inani == 0 {
    >> "iqanda" ¶
} _ {
    >> "ngezansi" ¶
}
```

Amabhuloko `{ }` **ayadingeka**, ngisho nomugqa owodwa.

---

## Match

```zymbol
// Match nezindawo
amanani = 85
isilinganiso = ?? amanani {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> isilinganiso ¶    // → B

// Match nezilindi (imibandela efinyelela noma kuphi)
izinga = -5
isimo = ?? izinga {
    _? izinga < 0  : "Ubandakelo"
    _? izinga < 20 : "Kubanda"
    _? izinga < 35 : "Kushisa kancane"
    _              : "Kushisa"
}
>> isimo ¶    // → Ubandakelo

// Match nezistring
umbala = "bomvu"
ikhodi = ?? umbala {
    "bomvu"  : "#FF0000"
    "luhlaza" : "#00FF00"
    _         : "#000000"
}
>> ikhodi ¶
```

---

## Izinqubo

```zymbol
// Indawo efakiwe: 0..4 ikhipha 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Indawo enenyathelo
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Indawo ephendukile
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Ngesikhathi (while)
inombolo = 1
@ inombolo <= 64 { inombolo *= 2 }
>> inombolo ¶    // → 128

// Ngasinye isinto
izithelo = ["Ihhabhula", "Ubhanana", "Igreyiphu"]
@ isithelo:izithelo { >> isithelo ¶ }

// Phezu kwezinhlamvu zestring
@ uhlamvu:"sawubona" { >> uhlamvu "-" }
>> ¶    // → s-a-w-u-b-o-n-a-

// Ukuphuma nokuqhubeka
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> qhubeka
    ? i > 7 { @! }          // @! phuma
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Imisebenzi

```zymbol
// Ukumemezela nokushaya
hlukanisa(a, b) { <~ a + b }
>> hlukanisa(3, 4) ¶    // → 7

// Ukubuyela emuva (recursion)
izinhlanzi(inombolo) {
    ? inombolo <= 1 { <~ 1 }
    <~ inombolo * izinhlanzi(inombolo - 1)
}
>> izinhlanzi(5) ¶    // → 120

// Imisebenzi inendawo ehlukene — ayikwazi ukufinyelela iziguquli zangaphandle
jikelele = 100
hlola() {
    ixephelo = 42    // yasekhaya kuphela
    <~ ixephelo
}
>> hlola() ¶    // → 42
```

> **Kubalulekile**: Imisebenzi eyehlukene `igama(izinto){ }` akuyona amanani angokuqala.
> Ukudlulisa njengempikiswano, beka: `x -> igama(x)`.

---

## Lambda nezivalo

```zymbol
// Lambda elilula (ukubuyela ngokuzimela)
kabili = x -> x * 2
isamba = (a, b) -> a + b
>> kabili(5) ¶    // → 10
>> isamba(3, 7) ¶   // → 10

// Lambda ngebhuloko (ukubuyela ngokusobala)
hlela = x -> {
    ? x > 0 { <~ "kuphezulu" }
    _? x < 0 { <~ "ngezansi" }
    <~ "iqanda"
}
>> hlela(5) ¶     // → kuphezulu
>> hlela(0) ¶     // → iqanda
>> hlela(-5) ¶    // → ngezansi

// Izivalo — amaLambda abamba iziguquli zangaphandle
isici = 3
kathathu = x -> x * isici    // ibamba 'isici'
>> kathathu(7) ¶    // → 21

// Umshini wezenzo
yenza_isibalo(inombolo) { <~ x -> x + inombolo }
engeza10 = yenza_isibalo(10)
>> engeza10(5) ¶    // → 15

// Amalambda njengamanani: agcinwa ezinhlelweni
izenzo = [x -> x+1, x -> x*2, x -> x*x]
>> izenzo[0](5) ¶    // → 6
>> izenzo[2](5) ¶    // → 25
```

---

## Izinhlu

```zymbol
uhlu = [10, 20, 30, 40, 50]

// Ukufinyelela (inkomba eqala ku-0)
>> uhlu[0] ¶    // → 10

// Ubude (izibiyeli zidingeka ku->>)
inani = uhlu$#
>> (uhlu$#) ¶    // → 5

// Engeza, susa, unayo, isiqephu
uhlu = uhlu$+ 60               // engeza
uhlu = uhlu$- 0                // susa inkomba 0
kukhona = uhlu$? 30             // → #1
isiqephu = uhlu$[0..2]          // [20, 30]

// Buyekeza isinto
uhlu[1] = 99

// Ngasinye isinto
@ inani:uhlu { >> inani " " }
>> ¶
```

> `$+`, `$-`, `$[..]` zibuya **uhlu olusha** — phinda ubeke: `uhlu = uhlu$+ 4`.
> Akukho ukuxhumana kwamaketanga: sebenzisa ukubekwa okwehlukene okubili.

---

## Tuple

```zymbol
// Tuple enegama
umuntu = (igama: "Alice", iminyaka: 25)
>> umuntu.igama ¶    // → Alice
>> umuntu.iminyaka ¶   // → 25
>> umuntu[0] ¶         // → Alice (inkomba nayo isebenza)
```

---

## Imisebenzi yeNqanaba eliPhezulu

Izenzo ze-HOF zidinga **iLambda elihlangene** — akukho iguquli yeLambda ngqo.

```zymbol
izinombolo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
kabili = izinombolo$> (x -> x * 2)
>> kabili ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
amaphakathi = izinombolo$| (x -> x % 2 == 0)
>> amaphakathi ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (inani lokuqala, (umbutheli, into) -> inkulumo)
isamba = izinombolo$< (0, (acc, x) -> acc + x)
>> isamba ¶    // → 55
```

---

## Ukubhekana nezinkinga

```zymbol
!? {
    ixephelo = 10 / 0
} :! ##Div {
    >> "Ukwabela ngeqanda" ¶
} :! ##IO {
    >> "Iphutha le-IO" ¶
} :! {
    >> "elinye iphutha: " _err ¶
} :> {
    >> "iyasebenza njalo" ¶
}
```

| Uhlobo       | Nini kwenzeka                    |
|--------------|----------------------------------|
| `##Div`      | Ukwabela ngeqanda                |
| `##IO`       | Ifayela / Uhlelo                 |
| `##Index`    | Inkomba ingaphandle kwendawo     |
| `##Type`     | Iphutha lohlobo                  |
| `##Parse`    | Iphutha lokuhlaziya              |
| `##Network`  | Iphutha lenethiwekhi             |
| `##_`        | Noma yiliphi iphutha (catch-all) |

---

## Izimodyuli

```zymbol
// Ifayela: lib/izibalo.zy
# izibalo

#> { hlukanisa, thola_PI }    // Ukukhipha NGAPHAMBI kwezincazelo

_PI := 3.14159
hlukanisa(a, b) { <~ a + b }
thola_PI() { <~ _PI }
```

```zymbol
// Ifayela: main.zy
<# ./lib/izibalo <= iz    // Isithonjana sidingeka

>> iz::hlukanisa(5, 3) ¶  // → 8
pi = iz::thola_PI()
>> pi ¶                    // → 3.14159
```

---

## Isibonelo Esiphelele: FizzBuzz

```zymbol
hlukanisa(inombolo) {
    ? inombolo % 15 == 0 { <~ "IgwebuDuma" }
    _? inombolo % 3  == 0 { <~ "Igwebu" }
    _? inombolo % 5  == 0 { <~ "Duma" }
    _ { <~ inombolo }
}

@ i:1..20 { >> hlukanisa(i) ¶ }
```

---

## Isigcawu sezimpawu

| Impawu  | Umsebenzi           | Impawu     | Umsebenzi              |
|---------|---------------------|------------|------------------------|
| `=`     | Isiguquli           | `$#`       | Ubude                  |
| `:=`    | Constant            | `$+`       | Engeza                 |
| `>>`    | Okukhishwayo        | `$-`       | Susa (ngenkomba)       |
| `<<`    | Ukufakwayo          | `$?`       | Unayo                  |
| `¶`/`\` | Umugqa omusha       | `$[s..e]`  | Isiqephu               |
| `?`     | uma (if)            | `$>`       | map                    |
| `_?`    | uma-futhi (elif)    | `$\|`      | filter                 |
| `_`     | ngenye / indawo     | `$<`       | reduce                 |
| `??`    | match               | `!?`       | zama (try)             |
| `@`     | Inqubo (loop)       | `:!`       | bamba (catch)          |
| `@!`    | phuma (break)       | `:>`       | njalo (finally)        |
| `@>`    | qhubeka (continue)  | `$!`       | yiphutha               |
| `->`    | Lambda              | `$!!`      | dlulisa iphutha        |
| `<~`    | buyela (return)     | `#`        | memezela imodyuli      |
| `\|>`   | Pipe                | `#>`       | khipha (export)        |
| `#1`    | iqiniso (true)      | `<#`       | ngenisa (import)       |
| `#0`    | amanga (false)      | `::`       | shaya imodyuli         |

---

*Zymbol-Lang — Izimpawu. Umhlaba wonke. Ayiguquki.*

---

> **Isixwayiso:** Lo mhlahlandlela wenziwa futhi waguqulelwa yi-artificial intelligence (AI).
> Yize kwenziwe yonke imizamo yokwenza izinto zicace, ezinye izinguqulo noma izibonelo zingaba neziphosiso.
> Incwadi ebalulekile yolimi ukuthi: [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
