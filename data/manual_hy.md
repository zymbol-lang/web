# Zymbol-Lang-ի Կոմպակտ Ուղեցույց

**Zymbol-Lang**-ը խորհրդանշական ծրագրավորման լեզու է — առանց հիմնաբառերի, միայն խորհրդանիշներ. Այն հավասարապես աշխատում է ցանկացած մարդկային լեզվով:

- Չկան հիմնաբառեր (`if`, `while`, `return` գոյություն չունեն — միայն `?`, `@`, `<~` խորհրդանիշներ)
- Unicode-ի լիարժեք աջակցություն — նույնացուցիչներ ցանկացած լեզվով կամ emoji 👋
- Լեզու-անկախ — կոդը նույնն է բարձր լեզուներում

---

## Փոփոխականներ և Հաստատուններ

```zymbol
բ = 10              // Փոփոխական (կարող է փոփոխվել)
ՊԻ := 3.14159       // Հաստատուն (անփոփոխ — կրկնակի վերագործածումը սխալ է)
anun = "Անի"
akt = #1            // բուլյան ճշմարե
👋 := "Բարև"
```

```zymbol
բ = 10
բ += 5    // 15
բ -= 3    // 12
բ *= 2    // 24
բ /= 3    // 8
բ %= 3    // 2
բ ^= 2    // 4
բ++       // 5
բ--       // 4
```

---

## Տվյալների Տեսակներ

| Տեսակ                | Օրինակ              | `#?` Նիշ    | Ծանոթություններ                          |
|----------------------|---------------------|-------------|------------------------------------------|
| Ամբողջ թիվ           | `42`, `-7`          | `###`       | 64-bit նշանով                           |
| Լողացող թիվ          | `3.14`, `1.5e10`    | `##.`       | Գիտական նշում ընդունվում է              |
| Տող                  | `"barrev"`          | `##"`       | Ինտերպոլացիա: `"Բարև {anun}"`          |
| Նիշ                  | `'Ա'`               | `##'`       | Unicode-ի մեկ նիշ                       |
| Բուլյան              | `#1`, `#0`          | `##?`       | ՉԵՆ թվեր 1 և 0                         |
| Զանգված              | `[1, 2, 3]`         | `##]`       | Բոլոր տարրերը նույն տեսակի              |
| Կորտեժ               | `(ա, բ)`            | `##)`       | Դիրքային                                |
| Անվանակիր կորտեժ     | `(x: 1, y: 2)`      | `##)`       | Հասանելիություն անվամբ կամ ինդեքսով    |

```zymbol
// Տիպի ինտրոսպեկցիա — վերադարձնում է (տիպ, թվանշաններ, արժեք)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Ելք և Մուտք

```zymbol
>> "Բարև, Աշխարհ!" ¶             // ¶ կամ \\ — բացահայտ տողի ընդմիջում
>> "a=" ա " b=" բ ¶               // բազմատիպ արժեքներ juxtaposition-ով
>> (zandzvadd$#) ¶                // postfix օператորները փակագծեր են պահանջում

<< arzhek                         // առանց հուշման — կարդում է փոփոխականի մեջ
<< "Ձեր անունը? " anun            // հուշումով
```

> `¶` և `\\` համարժեք են որպես տողի ընդմիջում:

---

## Գործողություններ

```zymbol
// Թվաբանություն
ա = 10
բ = 3
ա1 = ա + բ    // 13     ա2 = ա - բ    // 7
ա3 = ա * բ    // 30     ա4 = ա / բ    // 3  (ամբողջ բաժանում)
ա5 = ա % բ    // 1      ա6 = ա ^ բ    // 1000  (աստիճան)

// Համեմատություն
ա == բ    // #0    ա <> բ    // #1    ա < բ    // #0
ա <= բ    // #0   ա > բ     // #1    ա >= բ   // #1

// Տրամաբանություն
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Տողեր

```zymbol
// Երեք կոնկատենացիայի ձև
anun = "Անի"
n = 42

haghordakum = "Բարև ", anun, "!"           // ստորակետ — վերագործածումներում
>> "Բարև " anun " կեզ " n ¶               // juxtaposition — >> ելքում
nkarutyun = "Բարև {anun}, կեզ {n}"        // ինտերպոլացիա — ամենուր
```

```zymbol
s = "Hello World"
yerkartutyun = s$#              // 11
qvetex = s$[0..5]               // "Hello"  (վերջը բացառված)
ka = s$? "World"                // #1
maser = "a,b,c,d" / ','         // [a, b, c, d]
poxar = s$~~["l":"L"]           // "HeLLo WorLd"
poxar1 = s$~~["l":"L":1]        // "HeLlo World"  (առաջին N)
```

> `+` միայն թվերի համար է: Տողերի համար օգտագործեք `,`, juxtaposition կամ ինտերպոլացիա:

---

## Հոսքի Կառավարում

```zymbol
բ = 7

? բ > 0 { >> "դրական" ¶ }

? բ > 100 {
    >> "մեծ" ¶
} _? բ > 0 {
    >> "դրական" ¶
} _? բ == 0 {
    >> "զրո" ¶
} _ {
    >> "բացասական" ¶
}
```

> `{ }` բլոկները **պարտադիր** են, անգամ մեկ տողի համար:

---

## Համընկնում (Match)

```zymbol
// Տիրույթներ
gnahatakan = 85
ardyunq = ?? gnahatakan {
    90..100 : 'Ա'
    80..89  : 'Բ'
    70..79  : 'Գ'
    _       : 'Ն'
}
>> ardyunq ¶    // → Բ

// Տողեր
guyn = "kantach"
kod = ?? guyn {
    "kantach"  : "#FF0000"
    "kanach"   : "#00FF00"
    _          : "#000000"
}

// Պահապաններ
jermastikan = -5
vichak = ?? jermastikan {
    _? jermastikan < 0  : "saruyts"
    _? jermastikan < 20 : "karak"
    _? jermastikan < 35 : "tsek"
    _                   : "shog"
}
>> vichak ¶    // → saruyts

// Հայտարարության ձև (բլոկ-ճյուղեր)
?? n {
    0       : { >> "զրո" ¶ }
    _? n < 0: { >> "բացասական" ¶ }
    _       : { >> "դրական" ¶ }
}
```

---

## Ցիկլեր (Loops)

```zymbol
@ ի:0..4  { >> ի " " }        // ներառական տիրույթ: 0 1 2 3 4
@ ի:1..9:2 { >> ի " " }       // քայլով: 1 3 5 7 9
@ ի:5..0:1 { >> ի " " }       // հակառակ: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

meyvaner = ["khntsor", "tandzeni", "khaghogh"]
@ m:meyvaner { >> m ¶ }       // for-each զանգվածի վրա

@ s:"barrev" { >> s "-" }
>> ¶                          // → b-a-r-r-e-v-  (for-each տող)

@ ի:1..10 {
    ? ի % 2 == 0 { @> }       // @> շարունակել
    ? ի > 7 { @! }             // @! կանգնեցնել
    >> ի " "
}
>> ¶                          // → 1 3 5 7

// Անվերջ ցիկլ
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Պիտակավորված ցիկլ (ներդրված կանգ)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Ֆունկցիաներ (Functions)

```zymbol
gumar(ա, բ) { <~ ա + բ }
>> gumar(3, 4) ¶    // → 7

factorial(ն) {
    ? ն <= 1 { <~ 1 }
    <~ ն * factorial(ն - 1)
}
>> factorial(5) ¶    // → 120
```

Ֆունկցիաները ունեն **մեկուսացված շրջանակ** — չեն կարող կարդալ արտաքին փոփոխականներ: Օգտագործեք `<~` ելքային պարամետրեր կանչողի փոփոխականները փոփոխելու համար:

```zymbol
togh(ա<~, բ<~) {
    tmp = ա
    ա = բ
    բ = tmp
}
x = 10
y = 20
togh(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Անվանակիր ֆունկցիաները առաջին կարգի չեն: Փաստարկ փոխանցելու համար փաթաթեք. `x -> gumar(x)`:

---

## Լամբդաներ և Ամրափներ

```zymbol
krknakim = բ -> բ * 2
gumar = (ա, բ) -> ա + բ
>> krknakim(5) ¶    // → 10
>> gumar(3, 7) ¶    // → 10

// Բլոկ-լամբդա
dasakargel = բ -> {
    ? բ > 0 { <~ "դրական" }
    _? բ < 0 { <~ "բացասական" }
    <~ "զրո"
}

// Ամրափ — լամբդան գրավում է արտաքին շրջանակը
gorts = 3
eraki = բ -> բ * gorts
>> eraki(7) ¶    // → 21

// Ֆաբրիկ
kazm(ն) { <~ բ -> բ + ն }
tas = kazm(10)
>> tas(5) ¶    // → 15

// Զանգվածում
gortsoghutyunner = [բ -> բ+1, բ -> բ*2, բ -> բ*բ]
>> gortsoghutyunner[2](5) ¶    // → 25
```

---

## Զանգվածներ (Arrays)

```zymbol
zandzvadd = [1, 2, 3, 4, 5]

zandzvadd[0]          // 1 — հասանելիություն (0-ից ինդեքս)
zandzvadd[-1]         // 5 — բացասական ինդեքս (վերջին)
zandzvadd$#           // 5 — երկարություն (>> -ում (zandzvadd$#) օգտագործեք)

zandzvadd = zandzvadd$+ 6            // ավելացնել → [1,2,3,4,5,6]
z2 = zandzvadd$+[2] 99               // ներդնել ինդեքս 2-ում
z3 = zandzvadd$- 3                   // հեռացնել արժեքի առաջին հանդիպումը
z4 = zandzvadd$-- 3                  // հեռացնել բոլոր հանդիպումները
z5 = zandzvadd$-[0]                  // հեռացնել ինդեքսով
z6 = zandzvadd$-[1..3]               // հեռացնել տիրույթ (վերջը բացառված)

ka = zandzvadd$? 3                   // #1 — պարունակում է
pos = zandzvadd$?? 3                 // [2] — բոլոր ինդեքսները
qvetex = zandzvadd$[0..3]            // [1,2,3] — հատված (վերջը բացառված)
qvetex2 = zandzvadd$[0:3]            // [1,2,3] — նույնը, հաշվի վրա հիմնված

asc = zandzvadd$^+                   // աճման դասավորություն  (միայն պրիմիտիվներ)
desc = zandzvadd$^-                  // նվազման դասավորություն (միայն պրիմիտիվներ)

// Անվանակիր/դիրքային կորտեժ զանգվածներ — $^ կոմparat-ov lambda-ov
db = [(anun: "Carla", hasak: 28), (anun: "Ani", hasak: 25), (anun: "Bob", hasak: 30)]
by_age  = db$^ (a, b -> a.hasak < b.hasak)    // աճման ըստ տարիք  (<)
by_name = db$^ (a, b -> a.anun > b.anun)      // նվազման ըստ անուն (>)
>> by_age[0].anun ¶     // → Ani
>> by_name[0].anun ¶    // → Carla

zandzvadd[1] = 99              // թարմացնել տեղում
zandzvadd = zandzvadd[1]$~ 99  // ֆունկցիոնալ թարմացում — վերադարձնում է նոր զանգված
```

> Բոլոր կոլեկցիա-օператորները **նոր զանգված** են վերադարձնում: Վերագործածեք. `zandzvadd = zandzvadd$+ 4`:
> Օператորները չեն կարող շղթայվել — օգտագործեք ժամանակավոր փոփոխականներ:
> `$^+` / `$^-` դասավորում են **պրիմիտիվ զանգվածներ** (թվեր, տողեր): Կորտեժ զանգվածների համար օգտագործեք `$^` կոմparatorovlambda-ով:

```zymbol
// Ներդրված զանգվածներ
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[1][2] ¶    // → 6
```

---

## Ապակառուցում

```zymbol
// Զանգված
zandzvadd = [10, 20, 30, 40, 50]
[a, b, c] = zandzvadd              // a=10  b=20  c=30
[first, *rest] = zandzvadd         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]              // _ բաց է թողնում

// Դիրքային կորտեժ
point = (100, 200)
(px, py) = point                   // px=100  py=200

// Անվանակիր կորտեժ
person = (anun: "Անի", hasak: 25, kaghak: "Երևան")
(anun: n, hasak: a) = person       // n="Անի"  a=25
```

---

## Կորտեժներ (Թupelner)

```zymbol
// Դիրքային
point = (10, 20)
>> point[0] ¶    // → 10

// Անվանակիր
անձ = (anun: "Alisa", hasak: 25)
>> անձ.anun ¶     // → Alisa
>> անձ[0] ¶       // → Alisa  (ինդեքսն էլ է աշխատում)

// Ներդրված
pos = (x: 10, y: 20)
p = (pos: pos, label: "origin")
>> p.pos.x ¶        // → 10
```

---

## Բարձր Կարգի Ֆունկցիաներ (HOF)

> HOF-ի օператորները **ներդրված լամբդա** են պահանջում — ոչ ուղղակի լամբդա-փոփոխական:

```zymbol
tvner = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

krknakinert  = tvner$> (բ -> բ * 2)                // map  → [2,4,6…20]
zuig         = tvner$| (բ -> բ % 2 == 0)           // filter → [2,4,6,8,10]
yndameny     = tvner$< (0, (akk, բ) -> akk + բ)    // reduce → 55

// Շղթա ժամանակավոր փոփոխականներով
step1 = tvner$| (բ -> բ > 3)
step2 = step1$> (բ -> բ * բ)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Անվանակիր ֆունկցիաներ HOF-ում — փաթաթեք lambda-ի մեջ
double(x) { <~ x * 2 }
r = tvner$> (x -> double(x))    // ✅
```

---

## Խողովակի Գործողություն

Աջ կողմը միշտ պահանջում է `_` որպես տեղապահ:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Շղթայված
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Սխալների Մշակում (Error Handling)

```zymbol
!? {
    բ = 10 / 0
} :! ##Div {
    >> "բաժանումն զրոյով" ¶
} :! {
    >> "այլ սխալ: " _err ¶    // _err-ը պահում է սխալի հաղորդագրությունը
} :> {
    >> "միշտ գործվում է" ¶
}
```

| Տեսակ        | Երբ է առաջանում                       |
|--------------|---------------------------------------|
| `##Div`      | Բաժանումն զրոյի վրա                   |
| `##IO`       | Ֆայл / համակարգ                       |
| `##Index`    | Ինդեքսն տիրույթից դուրս               |
| `##Type`     | Տեսակային սխալ                        |
| `##Parse`    | Վերծուծماbյան սխալ                    |
| `##Network`  | Ցանցային սխալ                         |
| `##_`        | Ցանկացած սխալ (universand catch)      |

---

## Մոդուլներ (Modules)

```zymbol
// Ֆայլ: lib/hisvabl.zy
# hisvabl

#> { gumar, get_PI }    // Արտadրվածությունները ՍԿԶԲՆԱԿԱՆ սահমանումներից առաջ

_PI := 3.14159
gumar(ա, բ) { <~ ա + բ }
get_PI() { <~ _PI }
```

```zymbol
// Ֆայլ: main.zy
<# ./lib/hisvabl <= h    // Կlanumy պarտadіran e

>> h::gumar(5, 3) ¶  // → 8
pi = h::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Արտadրել այլ հանրային անվամب
# mylib
#> { _internal_add <= sum }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::sum(3, 4) ¶    // → 7  (ներքին անուն _internal_add թաquyt e)
```

---

## Տվյալների Գործողություններ

```zymbol
// Տողը թվի վերածում
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (անվտանg)

// Կlort / կtrunc
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Թvayi ձevavorutyun
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Baze-i literal
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Baze-i konvertsia
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell ինտեգրում

```zymbol
date = <\ date +%Y-%m-%d \>     // stdout-ի ֆixum
>> "Aysor: " date

file = "data.txt"
content = <\ cat {file} \>      // ինterpoliatsia-yvstovneri mej

output = </"./subscript.zy"/>   // Zymbol script-i gortsardkum
>> output
```

> `><` ֆixum e CLI argumenny vorpes togheri zandzvadd (miayн tree-walker):

---

## Ամboghdj Оrinakn: FizzBuzz

```zymbol
dasakargel(tiv) {
    ? tiv % 15 == 0 { <~ "ՊgpjakBzzots" }
    _? tiv % 3  == 0 { <~ "Պgpjak" }
    _? tiv % 5  == 0 { <~ "Bzzots" }
    _ { <~ tiv }
}

@ ի:1..20 { >> dasakargel(ի) ¶ }
```

---

## Նիշanneri Teghanuts (Symbol Reference)

| Nishan       | Gortsoghutyun               | Nishan      | Gortsoghutyun                   |
|--------------|-----------------------------|-------------|----------------------------------|
| `=`          | Փոփokhakan                  | `$#`        | Yerkartutyun                     |
| `:=`         | Hastatun                    | `$+`        | Avelaсnel                        |
| `>>`         | Yelk                        | `$+[i]`     | Nerdrel index-um                 |
| `<<`         | Muutk                       | `$-`        | Hatanel arjeqi arach handipmamb  |
| `¶`/`\\`     | Toghi yndmijum              | `$--`       | Hatanel bolor handipmamby        |
| `?`          | Etye (if)                   | `$-[i]`     | Hatanel index-ov                 |
| `_?`         | Aylapes etye (elif)         | `$-[i..j]`  | Hatanel tirauyth                 |
| `_`          | Aylapes / takhavar           | `$?`        | Petakum                          |
| `??`         | Hamaynknum (match)          | `$??`       | Gorcel bolor indexnery           |
| `@`          | Vikl (loop)                 | `$[s..e]`   | Ktom                             |
| `@!`         | Kangangel (break)           | `$>`        | map                              |
| `@>`         | Sharunakel (continue)       | `$\|`       | filter                           |
| `->`         | Lambda                      | `$<`        | reduce                           |
| `$^+`        | Dasavarorel aetsayin (prim.) | `$^-`      | Dasavarorel nvatsayin (prim.)    |
| `$^`         | Dasavarorel komparator-ov   |             |                                  |
| `<~`         | Veradardzel (return)        | `!?`        | Karoghakanum (try)               |
| `\|>`        | Khoughakvarum (pipe)        | `:!`        | Bkhosum (catch)                  |
| `#1`         | Chshmare (true)             | `:>`        | Misht (finally)                  |
| `#0`         | Kegh (false)                | `$!`        | Sgal e                           |
| `<#`         | Importel                    | `$!!`       | Sgaly tararachel                 |
| `#`          | Modul hasatarel             | `#>`        | Eksportel                        |
| `::`         | Moduli kanchoum             | `.`         | Vel hasaneliyutyun               |
| `#\|..\|`    | Parse t'iv                  | `#?`        | Tipи metadata                    |
| `#.N\|..\|`  | Klorutyun                   | `#!N\|..\|` | Ktrukum                         |
| `c\|..\|`    | Shtaput format              | `e\|..\|`   | Gitakan format                   |
| `<\ ..\>`    | Shell gortsardkum           | `><`        | CLI argumenny                    |

---

*Zymbol-Lang — Խоrhrhdanshakayin. Hamashkharhayin. Ankerpeli.*

> **Zgushatruyun:** Sa vavagragutyunn steghtsvats ev t'argmanyel e arhakayin intelekti (AI) karoghutyamb.
> Chshmarutyany apahоvelu hamar karatsvel en bolor hoghadzery, sakayn orosh t'argmanutyunner kam orinaknеr kan petakum sgalnеr.
> Kanonakan hghorzoumov е [Zymbol-Lang specifikatsian](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> For authoritative reference, consult the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
