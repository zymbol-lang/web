# Zymbol-Lang Kompakt Bələdçisi

**Zymbol-Lang** simvolik proqramlaşdırma dilidir. Açar sözlər yoxdur — hər şey simvoldur. Bütün insan dillərində eyni işləyir.

- Açar sözlər yoxdur (`if`, `while`, `return` mövcud deyil — yalnız simvollar `?`, `@`, `<~`)
- Tam Unicode dəstəyi — istənilən dildə və ya emoji ilə identifikatorlar 👋
- Dil-agnostik — kod bütün dillərdə eynidir

---

## Dəyişənlər və Sabitlər

```zymbol
x = 10           // Dəyişən (dəyişdirilə bilən)
PI := 3.14159    // Sabit (dəyişdirilməz — yenidən təyin edildikdə xəta)
ad = "Əli"
fəal = #1        // məntiqi doğru
👋 := "Salam"
```

```zymbol
x = 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++       // 5
x--       // 4
```

---

## Məlumat Tipləri

| Tip              | Nümunə              | Simvol `#?` | Qeydlər                              |
|------------------|---------------------|-------------|--------------------------------------|
| Tam ədəd         | `42`, `-7`          | `###`       | 64-bit işarəli                       |
| Onluq kəsr       | `3.14`, `1.5e10`    | `##.`       | Elmi qeyd dəstəklənir                |
| Sətir            | `"salam"`           | `##"`       | İnterpolyasiya: `"Salam {ad}"`       |
| Simvol           | `'A'`               | `##'`       | Bir Unicode simvolu                  |
| Məntiqi          | `#1`, `#0`          | `##?`       | 1 və 0 rəqəmləri DEYİL               |
| Massiv           | `[1, 2, 3]`         | `##]`       | Eyni tipdə bütün elementlər          |
| Kortej           | `(a, b)`            | `##)`       | Mövqeyə görə                         |
| Adlandırılmış    | `(x: 1, y: 2)`      | `##)`       | Ad və ya indeks ilə giriş            |

```zymbol
// Tip introspeksiyası — (tip, rəqəm, dəyər) qaytarır
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Çıxış və Giriş

```zymbol
>> "Salam" ¶                     // ¶ və ya \\ açıq sətir sonu verir
>> "a=" a " b=" b ¶              // bir neçə dəyər yan-yana düzülüşlə
>> (massiv$#) ¶                  // postfiks operatorlar mötərizə tələb edir

<< ad                            // sorğusuz — dəyişənə oxuyur
<< "Adınız? " ad                 // sorğu ilə
```

> `¶` və ya `\\` sətir sonu kimi ekvivalentdir.

---

## Operatorlar

```zymbol
// Riyaziyyat
a = 10
b = 3
n1 = a + b    // 13     n2 = a - b    // 7
n3 = a * b    // 30     n4 = a / b    // 3  (tam ədəd bölməsi)
n5 = a % b    // 1      n6 = a ^ b    // 1000  (qüvvət)

// Müqayisə
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Məntiqi
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Sətirlər

```zymbol
// Üç birləşdirmə forması
ad = "Leyla"
n = 42

mesaj = "Salam ", ad, "!"             // vergül — atamalarda
>> "Salam " ad " yaşın " n ¶          // yan-yana — >> çıxışında
açıqlama = "Salam {ad}, yaşın {n}"    // interpolyasiya — hər yerdə
```

```zymbol
s = "Hello World"
uzunluq = s$#              // 11
alt = s$[0..5]             // "Hello"  (son istisna)
var = s$? "World"          // #1
hiss = "a,b,c,d" / ','     // [a, b, c, d]
əvəz = s$~~["l":"L"]       // "HeLLo WorLd"
əvəz1 = s$~~["l":"L":1]    // "HeLlo World"  (ilk N)
```

> `+` yalnız rəqəmlər üçündür. Sətirlər üçün `,`, yan-yana düzülüş və ya interpolyasiya istifadə edin.

---

## Nəzarət Axını

```zymbol
x = 7

? x > 0 { >> "müsbət" ¶ }

? x > 100 {
    >> "böyük" ¶
} _? x > 0 {
    >> "müsbət" ¶
} _? x == 0 {
    >> "sıfır" ¶
} _ {
    >> "mənfi" ¶
}
```

> `{ }` blokları **məcburidir**, hətta tək sətir üçün belə.

---

## Uyğunlaşdırma (Match)

```zymbol
// Aralıqlar
bal = 85
qiymət = ?? bal {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> qiymət ¶    // → B

// Sətirlər
rəng = "qırmızı"
kod = ?? rəng {
    "qırmızı" : "#FF0000"
    "yaşıl"   : "#00FF00"
    _         : "#000000"
}

// Mühafizəçilər
temp = -5
vəziyyət = ?? temp {
    _? temp < 0  : "buz"
    _? temp < 20 : "soyuq"
    _? temp < 35 : "isti"
    _            : "çox isti"
}
>> vəziyyət ¶    // → buz

// İfadə forması (blok kolları)
?? n {
    0       : { >> "sıfır" ¶ }
    _? n < 0: { >> "mənfi" ¶ }
    _       : { >> "müsbət" ¶ }
}
```

---

## Dövrələr

```zymbol
@ i:0..4  { >> i " " }        // daxiledicili aralıq: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // addımlı: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tərsinə: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

meyvələr = ["alma", "armud", "üzüm"]
@ m:meyvələr { >> m ¶ }       // for-each massiv üzərindən

@ c:"salam" { >> c "-" }
>> ¶                          // → s-a-l-a-m-  (for-each sətir)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> davam et
    ? i > 7 { @! }             // @! kəs
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Sonsuz dövrə
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Etiketli dövrə (iç-içə kəsmə)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Funksiyalar

```zymbol
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funksiyaların **izolyasiya olunmuş əhatəsi** var — xarici dəyişənlərə giriş yoxdur. Çağıran dəyişənləri dəyişdirmək üçün `<~` çıxış parametrlərindən istifadə edin:

```zymbol
dəyiş(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
dəyiş(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Adlandırılmış funksiyalar birinci dərəcəli deyil. Arqument kimi ötürmək üçün sarın: `x -> topla(x)`.

---

## Lambdalar və Bağlamalar (Closures)

```zymbol
ikikat = x -> x * 2
cəm = (a, b) -> a + b
>> ikikat(5) ¶    // → 10
>> cəm(3, 7) ¶    // → 10

// Blok lambda
siniflədir = x -> {
    ? x > 0 { <~ "müsbət" }
    _? x < 0 { <~ "mənfi" }
    <~ "sıfır"
}

// Bağlama — lambda xarici dəyişənləri tutur
əmsal = 3
üçkat = x -> x * əmsal
>> üçkat(7) ¶    // → 21

// Fabrika
adder_yarat(n) { <~ x -> x + n }
add10 = adder_yarat(10)
>> add10(5) ¶    // → 15

// Massivdə
əməliyyatlar = [x -> x+1, x -> x*2, x -> x*x]
>> əməliyyatlar[2](5) ¶    // → 25
```

---

## Massivlər

```zymbol
massiv = [1, 2, 3, 4, 5]

massiv[0]          // 1 — giriş (0-əsaslı indeks)
massiv[-1]         // 5 — mənfi indeks (sonuncu)
massiv$#           // 5 — uzunluq (>> içində (massiv$#) istifadə edin)

massiv = massiv$+ 6            // əlavə et → [1,2,3,4,5,6]
m2 = massiv$+[2] 99            // indeks 2-yə daxil et
m3 = massiv$- 3                // dəyərin ilk təsadüfünü sil
m4 = massiv$-- 3               // bütün təsadüfləri sil
m5 = massiv$-[0]               // indekslə sil
m6 = massiv$-[1..3]            // aralığı sil (son istisna)

var = massiv$? 3               // #1 — mövcuddur
pos = massiv$?? 3              // [2] — bütün indekslər
alt = massiv$[0..3]            // [1,2,3] — kəsim (son istisna)
alt2 = massiv$[0:3]            // [1,2,3] — eyni, say əsaslı sintaksis

asc = massiv$^+                // artan sıralama  (yalnız primitivlər)
desc = massiv$^-               // azalan sıralama (yalnız primitivlər)

// Adlandırılmış/mövqe kortej massivlər — $^ komparator lambda ilə
db = [(ad: "Carla", yas: 28), (ad: "Aytən", yas: 25), (ad: "Bob", yas: 30)]
by_age  = db$^ (a, b -> a.yas < b.yas)    // yaşa görə artan  (<)
by_name = db$^ (a, b -> a.ad > b.ad)      // ada görə azalan (>)
>> by_age[0].ad ¶     // → Aytən
>> by_name[0].ad ¶    // → Carla

massiv[1] = 99              // yerində yeniləmə
massiv = massiv[1]$~ 99     // funksional yeniləmə — yeni massiv qaytarır
```

> Bütün kolleksiya operatorları **yeni massiv** qaytarır. Yenidən təyin edin: `massiv = massiv$+ 4`.
> Operatorlar zəncirlənə bilməz — aralıq dəyişənlər istifadə edin.
> `$^+` / `$^-` **primitiv massivləri** (rəqəmlər, sətirlər) sıralayır. Kortej massivləri üçün `$^` komparator lambda ilə istifadə edin.

```zymbol
// İç-içə massivlər
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Dağıdıcı Atama

```zymbol
// Massiv
massiv = [10, 20, 30, 40, 50]
[a, b, c] = massiv              // a=10  b=20  c=30
[first, *rest] = massiv         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ atır

// Mövqe korteji
point = (100, 200)
(px, py) = point                // px=100  py=200

// Adlandırılmış kortej
person = (ad: "Aytən", yas: 25, şəhər: "Bakı")
(ad: n, yas: a) = person        // n="Aytən"  a=25
```

---

## Kortejlər

```zymbol
// Mövqe
point = (10, 20)
>> point[0] ¶    // → 10

// Adlandırılmış
şəxs = (ad: "Aytən", yaş: 25)
>> şəxs.ad ¶     // → Aytən
>> şəxs[0] ¶     // → Aytən  (indeks də işləyir)

// İç-içə
pos = (x: 10, y: 20)
p = (pos: pos, label: "mənşə")
>> p.pos.x ¶        // → 10
```

---

## Yüksək Dərəcəli Funksiyalar

> HOF operatorları **sətirdaxili lambda** tələb edir — birbaşa lambda dəyişəni deyil.

```zymbol
rəqəmlər = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ikiqat   = rəqəmlər$> (x -> x * 2)                // map  → [2,4,6…20]
cüt      = rəqəmlər$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
cəm      = rəqəmlər$< (0, (yığ, x) -> yığ + x)    // reduce → 55

// Aralıq dəyişənlər vasitəsilə zəncir
step1 = rəqəmlər$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Adlandırılmış funksiyalar HOF-da — lambda içinə sarın
double(x) { <~ x * 2 }
r = rəqəmlər$> (x -> double(x))    // ✅
```

---

## Boru Operatoru

Sağ tərəf həmişə `_` yer tutucusu tələb edir:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Zəncirlənmiş
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Xəta İdarəsi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Sıfıra bölmə" ¶
} :! {
    >> "digər xəta: " _err ¶    // _err xəta mesajını saxlayır
} :> {
    >> "həmişə işlənir" ¶
}
```

| Tip         | Nə vaxt baş verir               |
|-------------|----------------------------------|
| `##Div`     | Sıfıra bölmə                     |
| `##IO`      | Fayl / Sistem                    |
| `##Index`   | İndeks aralıq xaricindədir       |
| `##Type`    | Tip xətası                       |
| `##Parse`   | Təhlil xətası                    |
| `##Network` | Şəbəkə xətası                    |
| `##_`       | İstənilən xəta (hamısını tut)    |

---

## Modullar

```zymbol
// Fayl: lib/hesab.zy
# hesab

#> { topla, get_PI }    // İxracatlar TƏRİFLƏRDƏN ƏVVƏL

_PI := 3.14159
topla(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fayl: əsas.zy
<# ./lib/hesab <= h    // Ləqəb məcburidir

>> h::topla(5, 3) ¶    // → 8
pi = h::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Fərqli ictimai adla ixrac
# mylib
#> { _daxili_topla <= cəm }

_daxili_topla(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::cəm(3, 4) ¶    // → 7  (daxili ad _daxili_topla gizlidir)
```

---

## Məlumat Operatorları

```zymbol
// Sətri rəqəmə çevirmə
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (təhlükəsiz)

// Yuvarlaqlaşdırma / kəsmə
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Rəqəm formatlaşdırma
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Baza literalları
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Baza çevrilməsi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell İnteqrasiyası

```zymbol
date = <\ date +%Y-%m-%d \>     // stdout-u ələ keçirir
>> "Bu gün: " date

file = "data.txt"
content = <\ cat {file} \>      // əmrlərdə interpolyasiya

output = </"./subscript.zy"/>   // Zymbol skriptini icra edir
>> output
```

> `><` CLI arqumentlərini sətir massivi kimi ələ keçirir (yalnız tree-walker).

---

## Tam Nümunə: FizzBuzz

```zymbol
təsnif(rəqəm) {
    ? rəqəm % 15 == 0 { <~ "KöpükVızıltı" }
    _? rəqəm % 3  == 0 { <~ "Köpük" }
    _? rəqəm % 5  == 0 { <~ "Vızıltı" }
    _ { <~ rəqəm }
}

@ i:1..20 { >> təsnif(i) ¶ }
```

---

## Simvol İstinadı

| Simvol   | Əməliyyat             | Simvol     | Əməliyyat               |
|----------|-----------------------|------------|-------------------------|
| `=`      | Dəyişən               | `$#`       | Uzunluq                 |
| `:=`     | Sabit                 | `$+`       | Əlavə et                |
| `>>`     | Çıxış                 | `$+[i]`    | İndeksə daxil et        |
| `<<`     | Giriş                 | `$-`       | İlkini dəyərlə sil      |
| `¶`/`\\` | Sətir sonu            | `$--`      | Hamısını dəyərlə sil    |
| `?`      | əgər (if)             | `$-[i]`    | İndekslə sil            |
| `_?`     | yoxsa əgər (elif)     | `$-[i..j]` | Aralığı sil             |
| `_`      | yoxsa / yer tutucu    | `$?`       | Mövcuddur               |
| `??`     | uyğunlaşdırma (match) | `$??`      | Bütün indeksləri tap    |
| `@`      | Dövrə (loop)          | `$[s..e]`  | Kəsim                   |
| `@!`     | kəs (break)           | `$>`       | map                     |
| `@>`     | davam et (continue)   | `$\|`      | filter                  |
| `->`     | Lambda                | `$<`       | reduce                  |
| `$^+`    | Artan sıralama (prim.) | `$^-`     | Azalan sıralama (prim.) |
| `$^`     | Komparator ilə sırala |            |                         |
| `<~`     | qaytar (return)       | `!?`       | cəhd et (try)           |
| `\|>`    | Boru (pipe)           | `:!`       | tut (catch)             |
| `#1`     | doğru (true)          | `:>`       | həmişə (finally)        |
| `#0`     | yanlış (false)        | `$!`       | xətadır                 |
| `<#`     | idxal et              | `$!!`      | xətanı ötür             |
| `#`      | Modul elan et         | `#>`       | ixrac et                |
| `::`     | Modul çağırışı        | `.`        | sahəyə giriş            |
| `#\|..\|` | Rəqəm parse          | `#?`       | Tip metadatası          |
| `#.N\|..\|` | Yuvarlaqlaşdır     | `#!N\|..\|` | Kəs                   |
| `c\|..\|` | Vergüllü format      | `e\|..\|`  | Elmi format             |
| `<\ ..\>` | Shell icra           | `><`       | CLI arqumentlər         |

---

*Zymbol-Lang — Simvolik. Universal. Dəyişməz.*

> **Xəbərdarlıq:** Bu sənəd süni intellekt (Sİ) tərəfindən yaradılmış və tərcümə edilmişdir.
> Dəqiqliyi təmin etmək üçün hər cür səy göstərilmişdir, lakin bəzi tərcümələr və ya nümunələr xətalar ehtiva edə bilər.
> Kanonik istinad [Zymbol-Lang spesifikasiyasıdır](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> For authoritative reference, consult the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
