> **Xəbərdarlıq:** Bu sənədlər süni intellekt (SI) tərəfindən yaradılmış və tərcümə edilmişdir.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Təlimatı

> **v0.0.5 üçün nəzərdən keçirilmişdir — 2026-05-12**

**Zymbol-Lang** simvolik proqramlaşdırma dilidir. Açar söz yoxdur — hər şey simvoldur. İstənilən insan dilində eyni işləyir.

- `if`, `while`, `return` yoxdur — yalnız `?`, `@`, `<~`
- Tam Unicode — identifikatorlar istənilən dil və ya emojidə
- İnsan dilinə uyğunsuzluq — kod hər yerdə eynidir

**Tərcümançı versiyası**: v0.0.5 | **Test əhatəsi**: 436/436 (TW ↔ VM pariteti)

---

## Dəyişənlər və Sabitlər

```zymbol
x = 10              // dəyişən
PI := 3.14159       // sabit — təkrar mənimsətmə icra zamanı xəta verir
ad = "Alice"
aktiv = #1          // mantıq doğru
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
x++        // 5
x--        // 4
```

`°` (dərəcə işarəsi, U+00B0) birinci istifadədə dəyişəni avtomatik neytral dəyərə başladır:

```zymbol
edədlər = [3, 1, 4, 1, 5]
@ n:edədlər {
    °cəm += n    // dövrədən yuxarıda 0-a avtomatik başlanğıc; @-dan sonra qalır
}
>> cəm ¶         // → 14
```

> `°x` (öncəlik) dövrənin üstündə sabitlənir — nəticə `@`-dan sonra əlçatandır.
> `x°` (sonrakı) dövrənin içindədir — dövrə bitdikdə ölür.
> Yalnız ağac gezici.

---

## Məlumat Tipləri

| Tip | Literal | `#?` etiketi | Qeydlər |
|-----|---------|--------------|---------|
| Tam | `42`, `-7` | `###` | 64-bit işarəli |
| Ədəd | `3.14`, `1.5e10` | `##.` | Elmi notasiya qəbul edilir |
| Sətir | `"mətn"` | `##"` | İnterpolasiya: `"Salam {ad}"` |
| Simvol | `'A'` | `##'` | Tək Unicode simvol |
| Mantıq | `#1`, `#0` | `##?` | Rəqəm DEYİL — `#1 ≠ 1` |
| Massiv | `[1, 2, 3]` | `##]` | Eynicinsli elementlər |
| Kortej | `(a, b)` | `##)` | Mövqeli |
| Adlandırılmış Kortej | `(x: 1, y: 2)` | `##)` | Adlandırılmış sahələr |
| Funksiya | adlandırılmış funksiya istinadı | `##()` | Birinci sinif; `<funct/N>` göstərir |
| Lambda | `x -> x * 2` | `##->` | Birinci sinif; `<lambd/N>` göstərir |

```zymbol
// Tip introspeksiyası — (tip, rəqəm, dəyər) qaytarır
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Çıxış və Giriş

```zymbol
>> "Salam" ¶                      // ¶ ya da \\ açıq yeni sətir üçün
>> "a=" a " b=" b ¶               // birləşmə — çoxlu dəyərlər
>> (massiv$#) ¶                   // postfix operatorlar >> içində ( ) tələb edir

<< ad                             // dəyişənə oxu (istəmsiz)
<< "Adı daxil edin: " ad          // istəmlə
```

> `¶` (İspan klaviaturasında AltGr+R) və `\\` ekvivalent yeni sətirdir.

---

## TUI Primitivi

Terminal UI operatorları interaktiv proqramlar üçündür. Əksəriyyəti `>>| { }` bloku tələb edir (alternativ ekran + xam rejim).

```zymbol
>>| {
    >>!                             // alternativ ekranı sil
    >>~ (1, 1, 0, 10) > "İşləyir"  // sıra 1, sütun 1, ön plan=10 (yaşıl)
    @~ 1000                         // 1 saniyə gözlə (1000 ms)
    >>~ (2, 1) > "Tamamlandı."
}
// çıxışda terminal avtomatik bərpa edilir
```

```zymbol
// Klaviş basmaq və terminal ölçüsü
>>| {
    [sətir, sütun] = >>?              // terminal ölçülərini sorğula
    >>~ (1, 1) > "Terminal: " sətir " x " sütun
    <<| düymə                         // bloklaşdırıcı klaviş oxu
    >>~ (2, 1) > "Basıldı: " düymə
}
```

> `>>!` ekranı silir. `>>?` `[sətir, sütun]` qaytarır. `@~ N` N millisaniyə gözləyir.
> `<<|` bir klaviş oxuyur (bloklaşdırıcı); `<<|?` bloklaşdırılmadan sorğu edir (yoxdursa `'\0'` qaytarır).
> Mövqeli çıxış demetesi: `(sıra, sütun, BKS, ön, arxa)` — istənilən yuva vergüllə buraxıla bilər (`>>~ (,,, 196) > "qırmızı"`).
> BKS bitmask: `1`=Qalın, `2`=Kursiv, `4`=Altçizgi. ANSI 256-rəng palitrasından (`0`=terminal standart).
> Yalnız ağac gezici (`>>!`, `>>?`, `@~`, `>>~` istisna olmaqla, `--vm`-də də işləyir).

---

## Operatorlar

```zymbol
// Arifmetik
a = 10
b = 3
n1 = a + b    // 13
n2 = a - b    // 7
n3 = a * b    // 30
n4 = a / b    // 3  (tam ədəd bölməsi)
n5 = a % b    // 1
n6 = a ^ b    // 1000  (qüvvətə yüksəltmə)

// Müqayisə — yoxlamaq üçün mənimsət
t1 = a == b    // #0
t2 = a <> b    // #1
t3 = a < b     // #0
t4 = a <= b    // #0
t5 = a > b     // #1
t6 = a >= b    // #1

// Məntiqi
m1 = #1 && #0    // #0
m2 = #1 || #0    // #1
m3 = !#1         // #0
```

---

## Sətir Əməliyyatları

```zymbol
// İki birləşdirmə forması
ad = "Alice"
n = 42

>> "Salam " ad " siz " n " sayınız var" ¶   // birləşmə — >> içində
izah = "Salam {ad}, siz {n} sayınız var"    // interpolasiya — istənilən yerdə
```

```zymbol
s = "Salam Dünya"
uzunluq = s$#                  // 11
alt = s$[1..5]                 // "Salam"  (1-əsaslı, son daxil)
var_mi = s$? "Dünya"           // #1
hissələr = "a,b,c,d"$/ ','    // [a, b, c, d]  (ayırıcıya görə böl)
əvəz = s$~~["a":"A"]          // "SAlAm DünyA"
əvəz1 = s$~~["a":"A":1]       // "SAlam Dünya"  (yalnız birinci N)
xətt = "─" $* 20              // "────────────────────"  (N dəfə təkrar et)
```

> `+` yalnız ədədlər üçündür. Sətirlərdə `,`, birləşmə və ya interpolasiyadan istifadə edin.

---

## Axın İdarəetməsi

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

> `{ }` mötərizələri tək bəyanat üçün belə **tələb olunur**.

---

## Uyğunlaşma

```zymbol
// Diapazonlar
bal = 85
qiymət = ?? bal {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> qiymət ¶    // → B

// Sətir uyğunluğu
rəng = "qırmızı"
kod = ?? rəng {
    "qırmızı"  => "#FF0000"
    "yaşıl"    => "#00FF00"
    _          => "#000000"
}

// Müqayisə nümunələri
temp = -5
vəziyyət = ?? temp {
    < 0  => "buz"
    < 20 => "soyuq"
    < 35 => "isti"
    _    => "çox isti"
}
>> vəziyyət ¶    // → buz

// Bəyanat forması (blok qolları)
n = -3
?? n {
    0    => { >> "sıfır" ¶ }
    < 0  => { >> "mənfi" ¶ }
    _    => { >> "müsbət" ¶ }
}
```

---

## Dövrələr

```zymbol
@ i:0..4  { >> i " " }        // daxil aralıq:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // addımla:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tərsinə:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

meyvələr = ["alma", "armud", "üzüm"]
@ m:meyvələr { >> m ¶ }       // massiv üzərindən

@ c:"salam" { >> c "-" }
>> ¶                          // → s-a-l-a-m-  (sətir üzərindən)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> davam et
    ? i > 7 { @! }             // @! çıx
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

// Etiketli dövrə (iç-içə çıxış)
say = 0
@:xarici {
    say++
    ? say >= 3 { @:xarici! }
}
>> say ¶                    // → 3
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

Funksiyalar **ayrılmış əhatəyə** sahibdir — xarici dəyişənlər oxuna bilməz. Çağıran dəyişənlərini dəyişdirmək üçün çıxış parametrləri `<~` istifadə edin:

```zymbol
dəyiş(a<~, b<~) {
    müvəqqəti = a
    a = b
    b = müvəqqəti
}
x = 10
y = 20
dəyiş(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Adlandırılmış funksiyalar **birinci sinif dəyərlərdir** — birbaşa ötürün: `rəqəmlər$> ikiqat`. Sarmaq üçün: `x -> fn(x)` da etibarlıdır.

---

## Lambdalar və Bağlamalar

```zymbol
ikiqat = x -> x * 2
cəm = (a, b) -> a + b
>> ikiqat(5) ¶    // → 10
>> cəm(3, 7) ¶    // → 10

// Blok lambda
sinifləndirmə = x -> {
    ? x > 0 { <~ "müsbət" }
    _? x < 0 { <~ "mənfi" }
    <~ "sıfır"
}

// Bağlama — xarici əhatəni ələ keçirir
əmsal = 3
üçqat = x -> x * əmsal
>> üçqat(7) ¶    // → 21

// Fabrika
cəmleyici_yarat(n) { <~ x -> x + n }
cəm10 = cəmleyici_yarat(10)
>> cəm10(5) ¶    // → 15

// Massivdə
əməliyyatlar = [x -> x+1, x -> x*2, x -> x*x]
>> əməliyyatlar[3](5) ¶    // → 25
```

---

## Massivlər

Massivlər **dəyişkəndir** və **eyni tipdən** elementlər saxlayır.

```zymbol
massiv = [1, 2, 3, 4, 5]

x = massiv[1]      // 1 — giriş (1-əsaslı: birinci element)
x = massiv[-1]     // 5 — mənfi indeks (son element)
x = massiv$#       // 5 — uzunluq (>>-da (massiv$#) istifadə et)

massiv = massiv$+ 6            // əlavə et → [1,2,3,4,5,6]
massiv2 = massiv$+[2] 99       // 2-ci mövqeyə daxil et (1-əsaslı)
massiv3 = massiv$- 3           // dəyərin birinci baş verməsini sil
massiv4 = massiv$-- 3          // bütün baş vermələri sil
massiv5 = massiv$-[1]          // 1-ci indeksdə silmə (birinci element)
massiv6 = massiv$-[2..3]       // aralığı sil (1-əsaslı, son daxil)

var_mi = massiv$? 3            // #1 — ehtiva edir
mövqe = massiv$?? 3            // [3] — dəyərin bütün indeksləri (1-əsaslı)
dilim = massiv$[1..3]          // [1,2,3] — dilim (1-əsaslı, son daxil)
dilim2 = massiv$[1:3]          // [1,2,3] — eyni, say-əsaslı sintaksis

artan = massiv$^+              // artan sıralanmış  (yalnız primitiv)
azalan = massiv$^-             // azalan sıralanmış (yalnız primitiv)

// Adlandırılmış/mövqeli kortej massivləri — müqayisəedici lambda ilə $^ istifadə et
db = [(ad: "Carla", yaş: 28), (ad: "Ana", yaş: 25), (ad: "Bob", yaş: 30)]
yaşa_görə  = db$^ (a, b -> a.yaş < b.yaş)    // yaşa görə artan  (<)
ada_görə = db$^ (a, b -> a.ad > b.ad)         // ada görə azalan (>)
>> yaşa_görə[1].ad ¶     // → Ana
>> ada_görə[1].ad ¶    // → Carla

// Birbaşa element yeniləmə (yalnız massivlər)
massiv[1] = 99              // mənimsət
massiv[2] += 5              // birləşik: +=  -=  *=  /=  %=  ^=

// Funksional yeniləmə — yeni massiv qaytarır; orijinal dəyişməz
massiv2 = massiv[2]$~ 99
```

> Bütün kolleksiya operatorları **yeni massiv** qaytarır. Geriyə mənimsədin: `massiv = massiv$+ 4`.
> `$+` zəncirli ola bilər: `massiv = massiv$+ 5$+ 6$+ 7`. Digər operatorlar aralıq mənimsəmələrdən istifadə edir.
> **İndeksləmə 1-əsaslıdır**: `massiv[1]` birinci elementdir; `massiv[0]` icra zamanı xətadır.
> `$^+` / `$^-` **primitiv massivləri** (ədədlər, sətir) sıralayır. Kortej massivləri üçün müqayisəedici lambda ilə `$^` istifadə edin — istiqamət lambda içindəki (`<` = artan, `>` = azalan).

**Dəyər semantikası** — bir massivi başqa dəyişənə mənimsətmək müstəqil nüsxə yaradır:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b təsirsizdir
```

```zymbol
// İç-içə massivlər (1-əsaslı indeksləmə)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (sıra 2, sütun 3)
```

---

## Parçalama

```zymbol
// Massiv
massiv = [10, 20, 30, 40, 50]
[a, b, c] = massiv              // a=10  b=20  c=30
[birinci, *qalan] = massiv      // birinci=10  qalan=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ atar

// Mövqeli kortej
nöqtə = (100, 200)
(nx, ny) = nöqtə               // nx=100  ny=200

// Adlandırılmış kortej
şəxs = (ad: "Ana", yaş: 25, şəhər: "Madrid")
(ad: n, yaş: a) = şəxs         // n="Ana"  a=25
```

---

## Kortejlər

Kortejlər **dəyişməz** sıralı konteynerdir, **fərqli tiplər** saxlaya bilər.
Massivlərdən fərqli olaraq, elementlər yaradıldıqdan sonra dəyişdirilə bilməz.

```zymbol
// Mövqeli — qarışıq tiplər icazəlidir
nöqtə = (10, 20)
>> nöqtə[1] ¶    // → 10

məlumat = (42, "salam", #1, 3.14)
>> məlumat[3] ¶     // → #1

// Adlandırılmış
şəxs = (ad: "Alice", yaş: 25)
>> şəxs.ad ¶    // → Alice
>> şəxs[1] ¶      // → Alice  (indeks də işləyir, 1-əsaslı)

// İç-içə
mövqe = (x: 10, y: 20)
p = (mövqe: mövqe, etiket: "mənşə")
>> p.mövqe.x ¶        // → 10
```

**Dəyişməzlik** — kortej elementini dəyişdirməyə istənilən cəhd icra xətasıdır:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ icra xətası: kortejlər dəyişməzdir
// t[1] += 5    // ❌ eyni xəta
```

Dəyişdirilmiş dəyər çıxarmaq üçün `$~` (funksional yeniləmə) istifadə edin — **yeni** kortej qaytarır:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orijinal dəyişməz
>> t2 ¶    // → (10, 999, 30)

// Adlandırılmış kortej — açıq şəkildə yenidən qurun
şəxs = (ad: "Alice", yaş: 25)
yaşlı  = (ad: şəxs.ad, yaş: 26)
>> şəxs.yaş ¶    // → 25
>> yaşlı.yaş ¶     // → 26
```

---

## Ali Dərəcəli Funksiyalar

```zymbol
rəqəmlər = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ikiqatlanmış  = rəqəmlər$> (x -> x * 2)               // map  → [2,4,6…20]
cüt_ədədlər   = rəqəmlər$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
cəm_nəticəsi  = rəqəmlər$< (0, (topl, x) -> topl + x) // reduce → 55

// Aralıq vasitəsilə zəncirləmə
addım1 = rəqəmlər$| (x -> x > 3)
addım2 = addım1$> (x -> x * x)
>> addım2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Adlandırılmış funksiyalar HOF-a birbaşa ötürülə bilər
ikiqat(x) { <~ x * 2 }
böyükdür(x) { <~ x > 5 }
r = rəqəmlər$> ikiqat       // ✅ birbaşa istinad
r = rəqəmlər$| böyükdür     // ✅ birbaşa istinad
```

---

## Boru Operatoru

Sağ tərəf həmişə boru xəttinə keçirilmiş dəyər üçün `_` yer tutucu tələb edir:

```zymbol
ikiqat = x -> x * 2
topla = (a, b) -> a + b
artır = x -> x + 1

n1 = 5 |> ikiqat(_)        // → 10
n2 = 10 |> topla(_, 5)     // → 15
n3 = 5 |> topla(2, _)      // → 7

// Zəncirli
n = 5 |> ikiqat(_) |> artır(_) |> ikiqat(_)
>> n ¶    // → 22  (5→10→11→22)
```

---

## Xəta İdarəetməsi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "sıfıra bölmə" ¶
} :! {
    >> "digər: " _err ¶    // _err xəta mesajını saxlayır
} :> {
    >> "həmişə işləyir" ¶
}
```

| Tip | Zaman |
|-----|-------|
| `##Div` | Sıfıra bölmə |
| `##IO` | Fayl / sistem |
| `##Index` | İndeks həddindən kənardır |
| `##Type` | Tip uyğunsuzluğu |
| `##Parse` | Məlumat sintaksisi |
| `##Network` | Şəbəkə xətaları |
| `##_` | İstənilən xəta (hamısını tut) |

---

## Modullar

```zymbol
// lib/hesab.zy — modul gövdəsi mötərizəyə alınır
# hesab {
    #> { topla, PI_al }

    _PI := 3.14159
    topla(a, b) { <~ a + b }
    PI_al() { <~ _PI }
}
```

```zymbol
// əsas.zy
<# ./lib/hesab => h    // ləqəb tələb olunur

>> h::topla(5, 3) ¶     // → 8
pi = h::PI_al()
>> pi ¶               // → 3.14159
```

```zymbol
// Fərqli ictimai adla ixrac et
# kitabxana {
    #> { _daxili_topla => cəm }

    _daxili_topla(a, b) { <~ a + b }
}
```

```zymbol
<# ./kitabxana => k

>> k::cəm(3, 4) ¶    // → 7  (daxili ad _daxili_topla gizlənir)
```

> **Modul qaydaları**: yalnız `#>`, funksiya tərifləri və literal dəyişən/sabit başlanğıcları `# ad { }` içindədir. İcra edilə bilən bəyanatlar (`>>`, `<<`, dövrələr və s.) E013 xətası verir.

---

## Ədəd Rejimləri

Zymbol rəqəmləri **69 Unicode rəqəm yazı sistemində** göstərə bilər — Devanagari, Ərəb-Hind, Tailand, Klingon pIqaD, Riyazi Qalın, LCD seqmentlər və daha çox. Aktiv rejim yalnız `>>` çıxışına təsir edir; daxili arifmetik həmişə ikilik sistemidir.

### Skripti aktivləşdirmək

Hədəf yazı sisteminin `0` və `9` rəqəmini `#…#` içinə yazın:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Ərəb-Hind (U+0660–U+0669)
#๐๙#    // Tailand       (U+0E50–U+0E59)
#09#    // ASCII-yə sıfırla
```

### Çıxış və mantıq dəyərləri

```zymbol
x = 42
>> x ¶          // → 42   (ASCII standart)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (onluq nöqtə həmişə ASCII)
>> 1 + 2 ¶      // → ३

// Mantıq: # prefiksi həmişə ASCII, rəqəm uyğunlaşır
>> #1 ¶         // → #१   (Devanagari-də doğru)
>> #0 ¶         // → #०   (yanlış — ० tam ədəd sıfırdan fərqlidir)

x = 28 > 4
>> x ¶          // → #१   (müqayisə nəticəsi aktiv rejimi izləyir)
```

### Mənbədə yerli rəqəm literalları

Dəstəklənən istənilən yazı sisteminin rəqəmləri etibarlı literallardır — aralıqlarda, modul, müqayisələrdə:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### İstənilən skriptdə mantıq literalları

İstənilən blokdan `#` + `0` ya da `1` rəqəmi etibarlı mantıq literalıdır:

```zymbol
#٠٩#
aktiv = #١        // #1 ilə eynidir
>> aktiv ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **həmişə ASCII**-dir. `#0` (yanlış) hər yazı sistemindəki `0` (tam ədəd sıfır) ilə vizual olaraq fərqlənir.

---

## Məlumat Operatorları

```zymbol
// Tip çevirmə çevrilmələri
f = ##.42         // → 42.0  (Ədədə)
i = ###3.7        // → 4     (Tama, yuvarlaqlaşdır)
t = ##!3.7        // → 3     (Tama, kəs)

// Sətiri ədədə çevir
d1 = #|"42"|      // → 42  (Tam)
d2 = #|"3.14"|    // → 3.14  (Ədəd)
d3 = #|"abc"|     // → "abc"  (xətasız, xəta yoxdur)

// Yuvarlaqlaşdır / kəs
pi = 3.14159265
y2 = #.2|pi|      // → 3.14  (2 onluq yerə yuvarlaqlaşdır)
y4 = #.4|pi|      // → 3.1416
k2 = #!2|pi|      // → 3.14  (kəs)

// Ədəd formatlaması
fmt = #,|1234567|  // → 1,234,567  (vergüllə ayrılmış)
elm = #^|12345.678|    // → 1.2345678e4  (elmi)

// Əsas literallar
a = 0x41         // → 'A'  (onaltılı)
b = 0b01000001   // → 'A'  (ikili)
c = 0o101        // → 'A'  (səkkizli)

// Əsas çevirici çıxış
on16 = 0x|255|    // → "0x00FF"
iki = 0b|65|     // → "0b1000001"
səkkiz = 0o|8|      // → "0o10"
on = 0d|255|    // → "0d0255"
```

---

## Shell İnteqrasiyası

```zymbol
tarix = <\ date +%Y-%m-%d \>     // stdout-u tutur (sonu \n daxildir)
>> "Bu gün: " tarix

fayl = "data.txt"
məzmun = <\ cat {fayl} \>      // əmrlərdə interpolasiya

çıxış = </"./altssenariy.zy"/>   // başqa Zymbol skriptini icra et, çıxışı tut
>> çıxış
```

> `><` CLI arqumentlərini sətir massivi kimi tutur (yalnız ağac gezici).

---

## Tam Nümunə: FizzBuzz

```zymbol
sinifləndirmə(ədəd) {
    ? ədəd % 15 == 0 { <~ "FizzBuzz" }
    _? ədəd % 3  == 0 { <~ "Fizz" }
    _? ədəd % 5  == 0 { <~ "Buzz" }
    _ { <~ ədəd }
}

@ i:1..20 { >> sinifləndirmə(i) ¶ }
```

---

## Simvol İstinadı

| Simvol | Əməliyyat | Simvol | Əməliyyat |
|--------|-----------|--------|-----------|
| `=` | dəyişən | `$#` | uzunluq |
| `:=` | sabit | `$+` | əlavə et (zəncirli) |
| `>>` | çıxış | `$+[i]` | indeksdə daxil et (1-əsaslı) |
| `<<` | giriş | `$-` | dəyərə görə birincini sil |
| `¶` / `\\` | yeni sətir | `$--` | dəyərə görə hamısını sil |
| `?` | əgər | `$-[i]` | indeksdə sil (1-əsaslı) |
| `_?` | yoxsa-əgər | `$-[i..j]` | aralığı sil (1-əsaslı) |
| `_` | yoxsa / joker | `$?` | ehtiva edir |
| `??` | uyğunlaşma | `$??` | bütün indeksləri tap (1-əsaslı) |
| `@` | dövrə | `$[s..e]` | dilim (1-əsaslı) |
| `@ N { }` | N dəfəlik dövrə | `$>` | xəritə |
| `@!` | çıx | `$\|` | süzgəc |
| `@>` | davam et | `$<` | azalt |
| `@:ad { }` | etiketli dövrə | `$/ ayırıcı` | sətir böl |
| `@:ad!` | etiketdən çıx | `$++ a b c` | birləşdirmə qur |
| `@:ad>` | etiketdə davam et | `massiv[i>j>k]` | naviqasiya indeksi |
| `->` | lambda | `massiv[i] = dəy` | elementi yenilə (yalnız massivlər) |
| `massiv[i] += dəy` | birləşik yeniləmə | `massiv[i]$~` | funksional yeniləmə (yeni nüsxə) |
| `$^+` | artan sırala (primitivlər) | `$^-` | azalan sırala (primitivlər) |
| `$^` | müqayisəedici ilə sırala (kortejlər) | `<~` | qaytar |
| `\|>` | boru | `!?` | cəhd et |
| `:!` | tut | `:>` | nəhayət |
| `#1` | doğru | `#0` | yanlış |
| `$!` | xətadır | `$!!` | xətanı yay |
| `<#` | idxal | `#>` | ixrac |
| `#` | modulu elan et | `::` | modul çağırışı |
| `.` | sahəyə giriş | `#?` | tip metadata |
| `#\|..\|` | ədədi analiz et | `##.` | Ədədə çevir |
| `###` | Tama çevir (yuvarlaq) | `##!` | Tama çevir (kəs) |
| `#.N\|..\|` | yuvarlaqlaşdır | `#!N\|..\|` | kəs |
| `#,\|..\|` | vergül formatı | `#^\|..\|` | elmi |
| `#r0r9#` | ədəd rejimi keçidi | `#09#` | ASCII-yə sıfırla |
| `<\ ..\>` | shell icra | `>\<` | CLI arqumentləri |
| `\ dəy` | dəyişəni açıq məhv et | `°x` / `x°` | isti tərif (avtomatik başlanğıc) |
| `>>|` | TUI bloku (alt ekran) | `>>~` | mövqeli çıxış |
| `>>!` | ekranı sil | `>>?` | terminal ölçüsünü sorğula |
| `<<\|` | bloklaşdırıcı klaviş | `<<\|?` | bloklaşdırılmayan klaviş |
| `@~ N` | N millisaniyə gözlə | `$*` | sətiri N dəfə təkrar et |

---

## Buraxılış Dəyişiklikləri Qeydi

### v0.0.5 — TUI Primitivi, İsti Tərif və Sətir Təkrarı _(May 2026)_

- **Pozulan** Uyğunlaşma qolu ayırıcısı: `nümunə : nəticə` → `nümunə => nəticə`
- **Pozulan** İdxal ləqəbi: `<# yol <= ləqəb` → `<# yol => ləqəb`
- **Pozulan** İxrac adlandırması: `#> { fn <= ictimai }` → `#> { fn => ictimai }`
- **Əlavə edildi** TUI bloku `>>| { }` — alternativ ekran + xam rejim; çıxışda təmizlənir
- **Əlavə edildi** Mövqeli çıxış `>>~ (sıra, sütun, BKS, ön, arxa) > elementlər` — seyrek yuvalar, 256-rəng ANSI
- **Əlavə edildi** Klaviş girişi `<<| dəy` (bloklaşdırıcı) və `<<|? dəy` (bloklaşdırılmayan sorğu)
- **Əlavə edildi** `>>!` ekranı sil, `>>?` terminal ölçüsünü sorğula, `@~ N` N millisaniyə gözlə
- **Əlavə edildi** İsti tərif `°x` / `x°` — dövrələrdə dəyişəni avtomatik başlat
- **Əlavə edildi** Sətir təkrarı `sətir $* N` — sətiri N dəfə təkrar et
- **VM** Paritet: 436/436 test keçir

### v0.0.4 — 1-Əsaslı İndeksləmə, Birinci Sinif Funksiyalar və Modul Blokları _(Aprel 2026)_

- **Pozulan** Bütün indeksləmə **1-əsaslıya** keçdi — `massiv[1]` birinci elementdir; `massiv[0]` icra zamanı xətadır
- **Əlavə edildi** Adlandırılmış funksiyalar **birinci sinif dəyərlərdir** — HOF-a birbaşa ötür: `rəqəmlər$> ikiqat`
- **Əlavə edildi** Modul **blok sintaksisi** tələb olunur: `# ad { ... }` — düz sintaksis silindi
- **Əlavə edildi** Çox ölçülü indeksləmə: `massiv[i>j>k]` (naviqasiya), `massiv[p ; q]` (düz çıxarma)
- **Əlavə edildi** Tip çevirmə: `##.ifadə` (Ədəd), `###ifadə` (Tam yuvarlaq), `##!ifadə` (Tam kəs)
- **Əlavə edildi** Sətir bölmə: `sətir$/ ayırıcı` — `Massiv(Sətir)` qaytarır
- **Əlavə edildi** Birləşdirmə qurma: `əsas$++ a b c` — çoxlu elementlər əlavə edir
- **Əlavə edildi** N dəfəlik dövrə: `@ N { }` — tam N dəfə təkrar et
- **Əlavə edildi** Etiketli dövrə sintaksisi: `@:ad { }`, `@:ad!`, `@:ad>` — `@ @ad` / `@! ad` ilə əvəz olunur
- **Əlavə edildi** Dəyişən əhatə qaydaları: `_ad` dəyişənləri blok əhatəsinə sahibdir; `\ dəy` erkən məhv edir
- **Əlavə edildi** Uyğunlaşma müqayisə nümunələri: `< 0 :`, `> 5 :`, `== 42 :` və s.
- **Əlavə edildi** Modul E013 xətası: modul gövdəsindəki icra edilə bilən bəyanatlar qadağandır
- **Düzəldildi** `take_variable` artıq geri yazma zamanı modul sabitlərini korlamır
- **Düzəldildi** `ləqəb.SABİT` indi düzgün həll edilir; `#>` funksiya təriflərindən sonra görünə bilər
- **VM** Tam paritet: 393/393 test keçir

### v0.0.3 — Unicode Ədəd Sistemləri və LSP İnkişafları _(Aprel 2026)_

- **Əlavə edildi** 69 Unicode rəqəm bloku rejim keçid tokeni `#r0r9#` ilə
- **Əlavə edildi** İstənilən skriptdə mantıq literalları — `#१` / `#०`, `#١` / `#٠` və s.
- **Əlavə edildi** Klingon pIqaD rəqəmləri (CSUR PUA U+F8F0–U+F8F9)
- **Əlavə edildi** `SetNumeralMode` VM opkodu — ağac gezici ilə tam paritet
- **Əlavə edildi** REPL aktiv ədəd rejimini əks etdirmə və dəyişən göstərməsində nəzərə alır
- **Dəyişdirildi** Mantıq `>>` çıxışı indi bütün rejimlərdə `#` prefiksini daxil edir (`#0` / `#1`)

### v0.0.2_01 — Operator Adlandırması _(30 Mar 2026)_

- **Dəyişdirildi** `c|..|` → `#,|..|` və `e|..|` → `#^|..|` — `#` format prefiksi ailəsi ilə ardıcıl
- **Əlavə edildi** İxrac ləqəbi: modul üzvlərini fərqli adla yenidən ixrac et

### v0.0.2 — Kolleksiya API Yenidən Dizaynı və Quraşdırıcılar _(24 Mar 2026)_

- **Əlavə edildi** Massivlər və sətirləər üçün vahid `$` operator ailəsi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Əlavə edildi** Massivlər, kortejlər və adlandırılmış kortejlər üçün parçalama mənimsətməsi
- **Əlavə edildi** Mənfi indekslər (`massiv[-1]` = son element)
- **Əlavə edildi** Yerli quraşdırıcılar — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Əlavə edildi** Birləşik mənimsətmə `^=`
- **Düzəldildi** Parser arifmetik kənar hallar; sənəd düzəlişləri

### v0.0.1 — İlk İctimai Buraxılış _(22 Mar 2026)_

- Ağac gezici tərcümançı + qeydiyyat VM-i (`--vm`, ~4× daha sürətli, ~95% paritet)
- Bütün əsas konstruklar: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tam Unicode identifikatorlar, modul sistemi, lambdalar, bağlamalar, xəta idarəetməsi
- REPL, LSP, VS Code genişlənməsi, formatlayıcı (`zymbol fmt`)

---

_Zymbol-Lang — Simvolik. Universal. Dəyişməz._
