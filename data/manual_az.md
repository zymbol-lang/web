# Zymbol-Lang Kompakt Bələdçisi

**Zymbol-Lang** simvolik proqramlaşdırma dilidir. Açar sözlər yoxdur — hər şey simvoldur. Bütün insan dillərində eyni işləyir.

---

## Fəlsəfə

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

### Mürəkkəb Təyinat

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %= 4    // 2
x++       // 3
x--       // 2
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

---

## Çıxış və Giriş

```zymbol
// Çıxış — avtomatik sətir sonu ƏLAVƏ ETMİR
>> "Salam" ¶                     // ¶ və ya \\ açıq sətir sonu verir
>> "a=" a " b=" b ¶              // bir neçə dəyər yan-yana düzülüşlə
>> "cəm=" topla(2, 3) ¶          // funksiya çağırışları istənilən mövqedə
>> (massiv$#) ¶                  // postfiks operatorlar mötərizə tələb edir

// Giriş
<< ad                            // sorğusuz — dəyişənə oxuyur
<< "Adınız? " ad                 // sorğu ilə
```

> `¶` və ya `\\` sətir sonu kimi ekvivalentdir.

---

## Sətir Birləşdirmə

Üç etibarlı forma — hər biri öz kontekstinə görə:

```zymbol
ad = "Leyla"
n = 25

// 1. Vergül — = və ya := ilə təyinatlarda
mesaj = "Salam ", ad, "!"             // → Salam Leyla!
BAŞLIQ := "İstifadəçi: ", ad

// 2. Yan-yana düzülüş — >> çıxışında
>> "Salam " ad " yaşın " n ¶          // → Salam Leyla yaşın 25

// 3. İnterpolyasiya — istənilən kontekstdə
açıqlama = "Salam {ad}, yaşın {n}"    // → Salam Leyla, yaşın 25
```

> **Qeyd**: `+` yalnız rəqəmlər üçündür. Sətirlərdə istifadə edilərsə xəbərdarlıq yaranır.

---

## Nəzarət Axını

```zymbol
x = 7

// Sadə şərt
? x > 0 { >> "müsbət" ¶ }

// Əgər / yoxsa əgər / yoxsa
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

`{ }` blokları **məcburidir**, hətta tək sətir üçün belə.

---

## Uyğunlaşdırma (Match)

```zymbol
// Aralıqlarla uyğunlaşdırma
bal = 85
qiymət = ?? bal {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> qiymət ¶    // → B

// Mühafizəçilərlə uyğunlaşdırma (ixtiyari şərtlər)
temp = -5
vəziyyət = ?? temp {
    _? temp < 0  : "buz"
    _? temp < 20 : "soyuq"
    _? temp < 35 : "isti"
    _            : "çox isti"
}
>> vəziyyət ¶    // → buz

// Sətirlərlə uyğunlaşdırma
rəng = "qırmızı"
kod = ?? rəng {
    "qırmızı" : "#FF0000"
    "yaşıl"   : "#00FF00"
    _         : "#000000"
}
>> kod ¶
```

---

## Dövrələr

```zymbol
// Daxil olan aralıq: 0..4 → 0,1,2,3,4 təkrar edir
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Addımlı aralıq
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Tərsinə aralıq
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Müddət şərti ilə (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Hər element üçün
meyvələr = ["alma", "armud", "üzüm"]
@ m:meyvələr { >> m ¶ }

// Sətrin simvolları üzərindən
@ c:"salam" { >> c "-" }
>> ¶    // → s-a-l-a-m-

// Kəsmə və Davam etmə
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> davam et
    ? i > 7 { @! }          // @! kəs
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funksiyalar

```zymbol
// Elan və çağırış
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶    // → 7

// Rekursiya
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120

// Funksiyaların izolyasiya olunmuş əhatəsi var — xarici dəyişənlərə giriş yoxdur
qlobal = 100
yoxla() {
    x = 42    // yalnız lokal
    <~ x
}
>> yoxla() ¶    // → 42
```

> **Vacib**: Adlandırılmış funksiyalar `ad(parametrlər){ }` birinci dərəcəli dəyər deyil.
> Arqument kimi ötürmək üçün sarın: `x -> topla(x, 1)`.

---

## Lambdalar və Bağlamalar (Closures)

```zymbol
// Sadə lambda (örtük qaytarma)
ikikat = x -> x * 2
cəm = (a, b) -> a + b
>> ikikat(5) ¶    // → 10
>> cəm(3, 7) ¶    // → 10

// Bloklu lambda (açıq qaytarma)
siniflədir = x -> {
    ? x > 0 { <~ "müsbət" }
    _? x < 0 { <~ "mənfi" }
    <~ "sıfır"
}
>> siniflədir(5) ¶     // → müsbət
>> siniflədir(0) ¶     // → sıfır
>> siniflədir(-5) ¶    // → mənfi

// Bağlamalar — lambdalar xarici dəyişənləri tutur
əmsal = 3
üçkat = x -> x * əmsal    // 'əmsal' tutulur
>> üçkat(7) ¶    // → 21

// Funksiya fabrikası
adder_yarat(n) { <~ x -> x + n }
add10 = adder_yarat(10)
>> add10(5) ¶    // → 15

// Lambdalar dəyər kimi: massivdə saxlanır
əməliyyatlar = [x -> x+1, x -> x*2, x -> x*x]
>> əməliyyatlar[0](5) ¶    // → 6
>> əməliyyatlar[2](5) ¶    // → 25
```

---

## Massivlər

```zymbol
massiv = [10, 20, 30, 40, 50]

// Giriş (0-əsaslı indeks)
>> massiv[0] ¶    // → 10

// Uzunluq (>> içində mötərizə lazımdır)
n = massiv$#
>> (massiv$#) ¶    // → 5

// Əlavə et, sil, mövcuddur, kəsim
massiv = massiv$+ 60            // əlavə et
massiv = massiv$- 0             // 0 indeksini sil
var = massiv$? 30               // → #1
kəsim = massiv$[0..2]           // [20, 30]

// Elementi yenilə
massiv[1] = 99

// Hər element üçün
@ x:massiv { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **yeni massiv** qaytarır — yenidən təyin edin: `massiv = massiv$+ 4`.
> Zəncirləmə yoxdur: iki ayrı təyinat istifadə edin.

---

## Kortejlər

```zymbol
// Adlandırılmış kortej
şəxs = (ad: "Aytən", yaş: 25)
>> şəxs.ad ¶     // → Aytən
>> şəxs.yaş ¶    // → 25
>> şəxs[0] ¶     // → Aytən (indeks də işləyir)
```

---

## Yüksək Dərəcəli Funksiyalar

HOF operatorları **sətirdaxili lambda** tələb edir — birbaşa lambda dəyişəni deyil.

```zymbol
rəqəmlər = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
ikiqat = rəqəmlər$> (x -> x * 2)
>> ikiqat ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
cüt = rəqəmlər$| (x -> x % 2 == 0)
>> cüt ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (başlanğıc dəyər, (akkumulyator, element) -> ifadə)
cəm = rəqəmlər$< (0, (yığ, x) -> yığ + x)
>> cəm ¶    // → 55
```

---

## Xəta İdarəsi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Sıfıra bölmə" ¶
} :! ##IO {
    >> "Giriş/Çıxış xətası" ¶
} :! {
    >> "digər xəta: " _err ¶
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
| `>>`     | Çıxış                 | `$-`       | Sil (indeks ilə)        |
| `<<`     | Giriş                 | `$?`       | Mövcuddur               |
| `¶`/`\`  | Sətir sonu            | `$[s..e]`  | Kəsim                   |
| `?`      | əgər (if)             | `$>`       | map                     |
| `_?`     | yoxsa əgər (elif)     | `$\|`      | filter                  |
| `_`      | yoxsa / yer tutucu    | `$<`       | reduce                  |
| `??`     | uyğunlaşdırma (match) | `!?`       | cəhd et (try)           |
| `@`      | Dövrə (loop)          | `:!`       | tut (catch)             |
| `@!`     | kəs (break)           | `:>`       | həmişə (finally)        |
| `@>`     | davam et (continue)   | `$!`       | xətadır                 |
| `->`     | Lambda                | `$!!`      | xətanı ötür             |
| `<~`     | qaytar (return)       | `#`        | Modul elan et           |
| `\|>`    | Boru (pipe)           | `#>`       | ixrac et                |
| `#1`     | doğru (true)          | `<#`       | idxal et                |
| `#0`     | yanlış (false)        | `::`       | Modul çağırışı          |

---

*Zymbol-Lang — Simvolik. Universal. Dəyişməz.*

---

> **Xəbərdarlıq:** Bu sənəd süni intellekt (Sİ) tərəfindən yaradılmış və tərcümə edilmişdir.
> Dəqiqliyi təmin etmək üçün hər cür səy göstərilmişdir, lakin bəzi tərcümələr və ya nümunələr xətalar ehtiva edə bilər.
> Kanonik istinad [Zymbol-Lang spesifikasiyasıdır](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
