> **Xəbərdarlıq:** Bu sənəd süni intellekt (AI) köməyi ilə yaradılmışdır.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanonik istinad **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** faylıdır interpreter deposunda.

---

# Zymbol-Lang Təlimatı

**Zymbol-Lang** simvolik proqramlaşdırma dilidir. Açar sözlər yoxdur — hər şey simvoldur. İstənilən insan dilində eyni işləyir.

- `if`, `while`, `return` yoxdur — yalnız `?`, `@`, `<~`
- Tam Unicode — istənilən dildə və ya emojidə identifikatorlar
- İnsan dilindən asılı deyil — kod hər yerdə eynidir

**Interpreter versiyası**: v0.0.4 | **Test əhatəsi**: 393/393 (TW ↔ VM paralelliyi)

---

## Dəyişənlər və sabitlər

```zymbol
x = 10              // dəyişən dəyişən
PI := 3.14159       // sabit — yenidən təyin etmə işləmə xətasıdır
ad = "Alis"
aktiv = #1          // Boolean doğru
👋 := "Salam"
```

```zymbol
x = 10    // 10
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

## Məlumat növləri

| Növ | Literal | `#?` etiketi | Qeydlər |
|-----|---------|--------------|---------|
| Tam | `42`, `-7` | `###` | 64-bit işarəli |
| Kəsr | `3.14`, `1.5e10` | `##.` | Elmi notasiya icazəlidir |
| Sətir | `"mətn"` | `##"` | İnterpolyasiya: `"Salam {ad}"` |
| Simvol | `'A'` | `##'` | Bir Unicode simvolu |
| Boolean | `#1`, `#0` | `##?` | Rəqəm DEYİL — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Homogen elementlər |
| Kortej | `(a, b)` | `##)` | Pozisional |
| Adlandırılmış kortej | `(x: 1, y: 2)` | `##)` | Adlandırılmış sahələr |
| Funksiya | adlandırılmış funksiya istinadı | `##()` | Birinci dərəcəli; `<funct/N>` göstərir |
| Lambda | `x -> x * 2` | `##->` | Birinci dərəcəli; `<lambd/N>` göstərir |

```zymbol
// Növ introspeksiyası — qaytarır (növ, rəqəmlər, dəyər)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Çıxış və giriş

```zymbol
>> "Salam" ¶                       // ¶ və ya \\ açıq sətir keçidi üçün
>> "a=" a " b=" b ¶                // yanaşı qoyma — çoxlu dəyərlər
>> (arr$#) ¶                       // postfix operatorları >> daxilində ( ) tələb edir

<< ad                              // dəyişənə oxu (prompt olmadan)
<< "Ad daxil edin: " ad            // prompt ilə
```

> `¶` (İspan klaviaturasında AltGr+R) və `\\` sətir keçidi kimi ekvivalentdir.

---

## Operatorlar

```zymbol
// Arifmetika — təyinlərdən istifadə edin; bəzi operatorların birbaşa >> daxilində xüsusiyyətləri var
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (tam bölmə)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (üst)

// Müqayisə
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Məntiqi
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Sətirlər

```zymbol
// İki birləşdirmə forması
ad = "Alis"
n = 42

>> "Salam " ad " sizdə " n " var" ¶       // yanaşı qoyma — >> daxilində
təsvir = "Salam {ad}, sizdə {n} var"     // interpolyasiya — istənilən yerdə
```

```zymbol
s = "Salam Dünya"
uzunluq = s$#                  // 11
alt = s$[1..5]                 // "Salam"  (1-əsaslı, son daxil olmaqla)
var = s$? "Dünya"              // #1
hissələr = "a,b,c,d"$/ ','     // [a, b, c, d]  (ayırıcı ilə böl)
əvəz = s$~~["a":"e"]           // "Selem Dünye"
əvəz1 = s$~~["a":"e":1]        // "Selem Dünya"  (yalnız ilk N)
```

> `+` yalnız rəqəmlər üçündür. Sətirlər üçün `,`, yanaşı qoyma və ya interpolyasiyadan istifadə edin.

---

---

## İdarəetmə axını

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

> `{ }` fiqurlu mötərizələr **tələb olunur** hətta bir ifadə üçün belə.

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

// Müqayisə nümunələri
temp = -5
vəziyyət = ?? temp {
    < 0  : "buz"
    < 20 : "soyuq"
    < 35 : "ilıq"
    _    : "isti"
}
>> vəziyyət ¶    // → buz

// İfadə forması (bloklar)
?? n {
    0        : { >> "sıfır" ¶ }
    _? n < 0 : { >> "mənfi" ¶ }
    _        : { >> "müsbət" ¶ }
}
```

---

## Dövrlər

```zymbol
@ i:0..4  { >> i " " }        // aralıq daxil olmaqla:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // addımla:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tərs:                 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

meyvələr = ["alma", "armud", "üzüm"]
@ m:meyvələr { >> m ¶ }       // hər bir array elementi üçün

@ c:"salam" { >> c "-" }
>> ¶                          // → s-a-l-a-m-  (hər bir sətir simvolu üçün)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> davam et
    ? i > 7 { @! }            // @! dayandır
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Sonsuz dövr
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Etiketli dövr (iç-içə dayandırma)
sayğac = 0
@:xarici {
    sayğac++
    ? sayğac >= 3 { @:xarici! }
}
>> sayğac ¶                   // → 3
```

---

## Funksiyalar

```zymbol
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶   // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funksiyalar **təcrid olunmuş əhatə dairəsinə** malikdir — onlar xarici dəyişənləri oxuya bilməzlər. Çağıranın dəyişənlərini dəyişdirmək üçün `<~` çıxış parametrlərindən istifadə edin:

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

> Adlandırılmış funksiyalar **birinci dərəcəli dəyərlərdir** — birbaşa ötürün: `nums$> ikiqat`. `x -> fn(x)` da etibarlıdır.

---

## Lambdalar və bağlanmalar

```zymbol
ikiqat = x -> x * 2
topla = (a, b) -> a + b
>> ikiqat(5) ¶   // → 10
>> topla(3, 7) ¶ // → 10

// Blok lambda
təsnif = x -> {
    ? x > 0 { <~ "müsbət" }
    _? x < 0 { <~ "mənfi" }
    <~ "sıfır"
}

// Bağlanma — xarici əhatə dairəsini tutur
amil = 3
üçqat = x -> x * amil
>> üçqat(7) ¶    // → 21

// Fabrika
toplayıcı_yarat(n) { <~ x -> x + n }
əlavə10 = toplayıcı_yarat(10)
>> əlavə10(5) ¶   // → 15

// Array-larda
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Array-lar

Array-lar **dəyişkəndir** və **eyni növ** elementləri saxlayır.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — giriş (1-əsaslı: birinci element)
arr[-1]         // 5 — mənfi indeks (son element)
arr$#           // 5 — uzunluq (>> daxilində (arr$#) istifadə edin)

arr = arr$+ 6            // əlavə → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // 2-ci mövqeyə yerləşdir (1-əsaslı)
arr3 = arr$- 3           // dəyərin ilk görünüşünü sil
arr4 = arr$-- 3          // bütün görünüşləri sil
arr5 = arr$-[1]          // indeks 1-də sil (birinci element)
arr6 = arr$-[2..3]       // aralığı sil (1-əsaslı, son daxil olmaqla)

var = arr$? 3            // #1 — ehtiva edir
mövqelər = arr$?? 3      // [3] — dəyərin bütün indeksləri (1-əsaslı)
dilim = arr$[1..3]       // [1,2,3] — dilim (1-əsaslı, son daxil olmaqla)
dilim2 = arr$[1:3]       // [1,2,3] — eyni, say sintaksisi

artan = arr$^+           // artan sırala (yalnız primitivlər)
azalan = arr$^-          // azalan sırala (yalnız primitivlər)

// Adlandırılmış/pozisional kortej array-ları — müqayisə lambda ilə $^ istifadə edin
db = [(ad: "Karla", yaş: 28), (ad: "Ana", yaş: 25), (ad: "Bob", yaş: 30)]
yaşa_görə   = db$^ (a, b -> a.yaş < b.yaş)       // yaşa görə artan (<)
ada_görə    = db$^ (a, b -> a.ad > b.ad)         // ada görə azalan (>)
>> yaşa_görə[1].ad ¶     // → Ana
>> ada_görə[1].ad ¶      // → Karla

// Birbaşa element yeniləməsi (yalnız array-lar)
arr[1] = 99              // təyin et
arr[2] += 5              // mürəkkəb: +=  -=  *=  /=  %=  ^=

// Funksional yeniləmə — yeni array qaytarır; orijinal dəyişməz
arr2 = arr[2]$~ 99
```

> Bütün kolleksiya operatorları **yeni array** qaytarır. Geri təyin edin: `arr = arr$+ 4`.
> `$+` zəncirilənə bilər: `arr = arr$+ 5$+ 6$+ 7`. Digər operatorlar aralıq təyinlərdən istifadə edir.
> **İndeksləmə 1-əsaslıdır**: `arr[1]` birinci elementdir; `arr[0]` işləmə xətasıdır.
> `$^+` / `$^-` **primitiv array-ları** sıralayır (rəqəmlər, sətirlər). Kortej array-ları üçün müqayisə lambda ilə `$^` istifadə edin — istiqamət lambda-da kodlaşdırılır (`<` = artan, `>` = azalan).

**Dəyər semantikası** — array-ı başqa dəyişənə təyin etmək müstəqil bir surət yaradır:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b təsirlənmir
```

```zymbol
// İç-içə array-lar (1-əsaslı indeksləmə)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (2-ci sətir, 3-cü sütun)
```

---

## Destrukturizasiya

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[birinci, *qalan] = arr      // birinci=10  qalan=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ atır

// Pozisional kortej
nöqtə = (100, 200)
(px, py) = nöqtə             // px=100  py=200

// Adlandırılmış kortej
şəxs = (ad: "Ana", yaş: 25, şəhər: "Madrid")
(ad: a, yaş: y) = şəxs        // a="Ana"  y=25
```

---

## Kortejlər

Kortejlər **dəyişməz** sıralanmış konteynerlərdir **müxtəlif növ** dəyərləri saxlaya bilər.
Array-lardan fərqli olaraq, elementlər yaradıldıqdan sonra dəyişdirilə bilməz.

```zymbol
// Pozisional — qarışıq növlərə icazə verilir
nöqtə = (10, 20)
>> nöqtə[1] ¶    // → 10

məlumat = (42, "salam", #1, 3.14)
>> məlumat[3] ¶   // → #1

// Adlandırılmış
şəxs = (ad: "Alis", yaş: 25)
>> şəxs.ad ¶       // → Alis
>> şəxs[1] ¶       // → Alis  (indeks də işləyir, 1-əsaslı)

// İç-içə
pos = (x: 10, y: 20)
p = (pos: pos, etiket: "mənşə")
>> p.pos.x ¶       // → 10
```

**Dəyişməzlik** — kortej elementini dəyişdirmək cəhdi işləmə xətasıdır:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ işləmə xətası: kortejlər dəyişməzdir
// t[1] += 5    // ❌ eyni xəta
```

Dəyişdirilmiş dəyər əldə etmək üçün `$~` (funksional yeniləmə) istifadə edin — **yeni** kortej qaytarır:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orijinal dəyişməz
>> t2 ¶    // → (10, 999, 30)

// Adlandırılmış kortej — açıq şəkildə yenidən qurun
şəxs = (ad: "Alis", yaş: 25)
böyük = (ad: şəxs.ad, yaş: 26)
>> şəxs.yaş ¶    // → 25
>> böyük.yaş ¶   // → 26
```

---

## Yüksək dərəcəli funksiyalar

```zymbol
ədədlər = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ikiqat_edilmiş  = ədədlər$> (x -> x * 2)                // map → [2,4,6…20]
cütlər   = ədədlər$| (x -> x % 2 == 0)                 // filter → [2,4,6,8,10]
cəm     = ədədlər$< (0, (acc, x) -> acc + x)           // reduce → 55

// Aralıqlar vasitəsilə zəncirlə
addım1 = ədədlər$| (x -> x > 3)
addım2 = addım1$> (x -> x * x)
>> addım2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Adlandırılmış funksiyalar birbaşa YDF-ə ötürülə bilər
ikiqat(x) { <~ x * 2 }
böyükdür(x) { <~ x > 5 }
r = ədədlər$> ikiqat       // ✅ birbaşa istinad
r = ədədlər$| böyükdür     // ✅ birbaşa istinad
```

---

## Boru operatoru

Sağ tərəf həmişə boruya verilən dəyər üçün `_` yer tutucusunu tələb edir:

```zymbol
ikiqat = x -> x * 2
topla = (a, b) -> a + b
inc = x -> x + 1

5 |> ikiqat(_)        // → 10
10 |> topla(_, 5)     // → 15
5 |> topla(2, _)      // → 7

// Zəncirlənmiş
r = 5 |> ikiqat(_) |> inc(_) |> ikiqat(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Xəta idarəetməsi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "sıfıra bölmə" ¶
} :! {
    >> "digər xəta: " _err ¶    // _err xəta mesajını saxlayır
} :> {
    >> "həmişə işləyir" ¶
}
```

| Növ | Nə vaxt |
|-----|---------|
| `##Div` | Sıfıra bölmə |
| `##IO` | Fayl / sistem |
| `##Index` | İndeks hüdudlardan kənar |
| `##Type` | Növ uyğunsuzluğu |
| `##Parse` | Məlumat analizi |
| `##Network` | Şəbəkə xətaları |
| `##_` | İstənilən xəta (hamısını tutur) |

---

## Modullar

```zymbol
// lib/calc.zy — modulun gövdəsi fiqurlu mötərizələr daxilindədir
# calc {
    #> { topla, get_PI }

    _PI := 3.14159
    topla(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias tələb olunur

>> c::topla(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Fərqli ictimai adla ixrac et
# mənim_kitabxanam {
    #> { _daxili_topla <= cəm }

    _daxili_topla(a, b) { <~ a + b }
}
```

```zymbol
<# ./mənim_kitabxanam <= m

>> m::cəm(3, 4) ¶    // → 7  (daxili ad _daxili_topla gizlədilib)
```

> **Modul qaydaları**: `# ad { }` daxilində yalnız `#>`, funksiya tərifləri və literal dəyişən/sabit başlatmalarına icazə verilir. İcra edilə bilən ifadələr (`>>`, `<<`, dövrlər və s.) E013 xətası verir.

---

## Rəqəm rejimləri

Zymbol rəqəmləri **69 Unicode rəqəm blokunda** göstərə bilər — Devanagari, Ərəb-Hind, Tay, Klingon pIqaD, Riyazi qalın, LCD seqmentləri və daha çox. Aktiv rejim yalnız `>>` çıxışına təsir edir; daxili arifmetika həmişə ikilidir.

### Rejimin aktivləşdirilməsi

Hədəf yazısının `0` və `9` rəqəmlərini `#…#` arasında yazın:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Ərəb-Hind     (U+0660–U+0669)
#๐๙#    // Tay           (U+0E50–U+0E59)
#09#    // ASCII-yə sıfırla
```

### Çıxış və Booleanlar

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standart)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ondalık nöqtə həmişə ASCII)
>> 1 + 2 ¶      // → ३

// Booleanlar: # prefiksi həmişə ASCII, rəqəm uyğunlaşır
>> #1 ¶         // → #१   (doğru Devanagari)
>> #0 ¶         // → #०   (yalan — ० tam sıfırından fərqlidir)

x = 28 > 4
>> x ¶          // → #१   (müqayisə nəticəsi aktiv rejimi izləyir)
```

### Mənbə kodunda yerli rəqəm literalları

Dəstəklənən hər hansı yazının rəqəmləri etibarlı literallardır — aralıqlarda, modulda, müqayisələrdə:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### İstənilən yazıda Boolean literalları

`#` + hər hansı blokdan `0` və ya `1` rəqəmi etibarlı Boolean literalıdır:

```zymbol
#٠٩#
aktiv = #١        // #1 ilə eynidir
>> aktiv ¶        // → #١
>> (#١ && #٠) ¶   // → #٠
```

> `#` həmişə **ASCII**-dir. `#0` (yalan) hər bir yazıda həmişə `0`-dan (tam sıfır) vizual olaraq fərqlənir.

---

## Məlumat operatorları

```zymbol
// Növ çevirməsi
##.42         // → 42.0  (Kəsrə)
###3.7        // → 4     (Tama, yuvarlaqlaşdır)
##!3.7        // → 3     (Tama, kəs)

// Sətri rəqəmə çevir
v1 = #|"42"|      // → 42  (Tam)
v2 = #|"3.14"|    // → 3.14  (Kəsr)
v3 = #|"abc"|     // → "abc"  (təhlükəsiz, xəta yoxdur)

// Yuvarlaqlaşdır / kəs
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (2 onluq yerinə yuvarlaqlaşdır)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kəs)

// Rəqəm formatlaması
fmt = #,|1234567|   // → 1,234,567  (vergüllə ayrılmış)
sci = #^|12345.678| // → 1.2345678e4  (elmi)

// Əsas literalları
a = 0x41         // → 'A'  (onaltılıq)
b = 0b01000001   // → 'A'  (ikili)
c = 0o101        // → 'A'  (səkkizlik)

// Əsas çevirmə çıxışı
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell inteqrasiyası

```zymbol
tarix = <\ date +%Y-%m-%d \>     // stdout-u tutur (sonunda \n daxil olmaqla)
>> "Bu gün: " tarix

fayl = "məlumat.txt"
məzmun = <\ cat {fayl} \>        // commandalarda interpolyasiya

çıxış = </"./subscript.zy"/>     // başqa Zymbol skriptini icra et, çıxışı tut
>> çıxış
```

> `><` CLI arqumentlərini sətir array-i kimi tutur (yalnız tree-walker).

---

## Tam nümunə: FizzBuzz

```zymbol
təsnif(ədəd) {
    ? ədəd % 15 == 0 { <~ "FizzBuzz" }
    _? ədəd % 3  == 0 { <~ "Fizz" }
    _? ədəd % 5  == 0 { <~ "Buzz" }
    _ { <~ ədəd }
}

@ i:1..20 { >> təsnif(i) ¶ }
```

---

## Simvol istinadı

| Simvol | Əməliyyat | Simvol | Əməliyyat |
|--------|-----------|--------|-----------|
| `=` | dəyişən | `$#` | uzunluq |
| `:=` | sabit | `$+` | əlavə et (zəncirilənə bilər) |
| `>>` | çıxış | `$+[i]` | indeksə yerləşdir (1-əsaslı) |
| `<<` | giriş | `$-` | dəyərə görə birincini sil |
| `¶` / `\\` | sətir keçidi | `$--` | dəyərə görə hamısını sil |
| `?` | əgər | `$-[i]` | indeksdə sil (1-əsaslı) |
| `_?` | əks halda əgər | `$-[i..j]` | aralığı sil (1-əsaslı) |
| `_` | əks halda / wildcard | `$?` | ehtiva edir |
| `??` | uyğunlaşdırma | `$??` | bütün indeksləri tap (1-əsaslı) |
| `@` | dövr | `$[s..e]` | dilim (1-əsaslı) |
| `@ N { }` | N dəfə dövr | `$>` | xəritə |
| `@!` | dayandır | `$|` | filtr |
| `@>` | davam et | `$<` | azalt |
| `@:ad { }` | etiketli dövr | `$/ ayır` | sətir bölməsi |
| `@:ad!` | etiketli dayandır | `$++ a b c` | birləşdirmə qurma |
| `@:ad>` | etiketli davam et | `arr[i>j>k]` | naviqasiya indeksi |
| `->` | lambda | `arr[i] = dəyər` | elementi yenilə (yalnız array-lar) |
| `arr[i] += dəyər` | mürəkkəb yeniləmə | `arr[i]$~` | funksional yeniləmə (yeni surət) |
| `$^+` | artan sırala (primitivlər) | `$^-` | azalan sırala (primitivlər) |
| `$^` | müqayisə edənlə sırala (kortejlər) | `<~` | qaytar |
| `|>` | boru | `!?` | cəhd et |
| `:!` | tut | `:>` | nəhayət |
| `#1` | doğru | `#0` | yalan |
| `$!` | xətadır | `$!!` | xətanı yay |
| `<#` | idxal et | `#>` | ixrac et |
| `#` | modul elan et | `::` | modulu çağır |
| `.` | sahəyə giriş | `#?` | növ metadatası |
| `#|..|` | rəqəmi analiz et | `##.` | Kəsrə çevir |
| `###` | Tama çevir (yuvarlaqlaşdır) | `##!` | Tama çevir (kəs) |
| `#.N|..|` | yuvarlaqlaşdır | `#!N|..|` | kəs |
| `#,|..|` | vergül formatı | `#^|..|` | elmi |
| `#d0d9#` | rəqəm rejimini dəyiş | `#09#` | ASCII-yə sıfırla |
| `<\ ..\>` | shell icrası | `>\<` | CLI arqumentləri |
| `\ var` | dəyişəni açıq şəkildə məhv et | | |

---

## Buraxılış dəyişiklik jurnalı

### v0.0.4 — 1-əsaslı İndeksləmə, Birinci Dərəcəli Funksiyalar və Modul Blokları _(Aprel 2026)_

- **Qırılan** Bütün indeksləmə **1-əsaslı** olaraq dəyişdirildi — `arr[1]` birinci elementdir; `arr[0]` işləmə xətasıdır
- **Əlavə edildi** Adlandırılmış funksiyalar **birinci dərəcəli dəyərlərdir** — birbaşa YDF-ə ötürün: `nums$> ikiqat`
- **Əlavə edildi** Modulların **blok sintaksisi tələb olunur**: `# ad { ... }` — düz sintaksis çıxarıldı
- **Əlavə edildi** Çoxölçülü indeksləmə: `arr[i>j>k]` (naviqasiya), `arr[p ; q]` (düz çıxarma)
- **Əlavə edildi** Növ çevirməsi: `##.ifadə` (Kəsr), `###ifadə` (Tam yuvarlaqlaşdır), `##!ifadə` (Tam kəs)
- **Əlavə edildi** Sətir bölməsi: `str$/ ayır` — `Array(Sətir)` qaytarır
- **Əlavə edildi** Birləşdirmə qurma: `əsas$++ a b c` — birdən çox element əlavə edir
- **Əlavə edildi** N dəfə dövr: `@ N { }` — tam N dəfə təkrarla
- **Əlavə edildi** Etiketli dövr sintaksisi: `@:ad { }`, `@:ad!`, `@:ad>` — `@ @ad` / `@! ad` əvəz edir
- **Əlavə edildi** Dəyişən əhatə dairəsi qaydaları: `_ad` dəyişənlərinin dəqiq blok əhatə dairəsi var; `\ var` erkən məhv edir
- **Əlavə edildi** Uyğunlaşdırma müqayisə nümunələri: `< 0 :`, `> 5 :`, `== 42 :` və s.
- **Əlavə edildi** Modul E013 xətası: modul gövdəsində icra edilə bilən ifadələr qadağandır
- **Düzəldildi** `take_variable` geri yazarkən modul sabitlərini korlamır
- **Düzəldildi** `alias.SABİT` artıq düzgün həll olunur; `#>` funksiya təriflərindən sonra görünə bilər
- **VM** Tam paralellik: 393/393 test keçir

### v0.0.3 — Unicode Rəqəm Sistemləri və LSP Təkmilləşdirmələri _(Aprel 2026)_

- **Əlavə edildi** 69 Unicode rəqəm bloku rejim dəyişdirmə tokeni ilə `#d0d9#`
- **Əlavə edildi** İstənilən yazıda Boolean literalları — `#१` / `#०`, `#١` / `#٠`, və s.
- **Əlavə edildi** Klingon pIqaD rəqəmləri (CSUR PUA U+F8F0–U+F8F9)
- **Əlavə edildi** `SetNumeralMode` VM opkodu — ağac gəzənlə tam paralellik
- **Əlavə edildi** REPL aktiv rəqəm rejiminə əks-səda və dəyişən göstərilməsində hörmət edir
- **Dəyişdirildi** Boolean `>>` çıxışı artıq bütün rejimlərdə `#` prefiksini (`#0` / `#1`) ehtiva edir

### v0.0.2_01 — Operatorun adının dəyişdirilməsi _(30 Mart 2026)_

- **Dəyişdirildi** `c|..|` → `#,|..|` və `e|..|` → `#^|..|` — `#` format prefiksi ailəsi ilə ardıcıl
- **Əlavə edildi** İxrac aliası: modul üzvlərini fərqli adla yenidən ixrac et

### v0.0.2 — Kolleksiya API-nin Yenidən Dizaynı və Quraşdırıcılar _(24 Mart 2026)_

- **Əlavə edildi** Vahid `$` operator ailəsi array-lar və sətirlər üçün (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Əlavə edildi** Array-lar, kortejlər və adlandırılmış kortejlər üçün destrukturizasiya təyini
- **Əlavə edildi** Mənfi indekslər (`arr[-1]` = son element)
- **Əlavə edildi** Yerli quraşdırıcılar — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mart 2026)_

- **Əlavə edildi** Mürəkkəb təyini `^=`
- **Düzəldildi** Təhlilçinin arifmetika künc halları; sənəd düzəlişləri

### v0.0.1 — İlk İctimai Buraxılış _(22 Mart 2026)_

- Ağac gəzən interpreter + registr VM (`--vm`, ~4× daha sürətli, ~95% paralellik)
- Bütün əsas konstruksiyalar: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tam Unicode identifikatorları, modul sistemi, lambdalar, bağlanmalar, xəta idarəetməsi
- REPL, LSP, VS Code uzantısı, formatlayıcı (`zymbol fmt`)

---

_Zymbol-Lang — Simvolik. Universal. Dəyişməz._
