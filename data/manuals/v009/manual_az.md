> **İmtina:** Bu sənəd süni intellekt (AI) tərəfindən yaradılmış və tərcümə edilmişdir.
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Kanonik istinad tərcüməçi anbarındakı **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** sənədidir.

---

# Zymbol-Lang Təlimatı

> **v0.0.9 üçün yenidən baxılmışdır — 2026-09-07**

**Zymbol-Lang** simvolik proqramlaşdırma dilidir. Qrammatikasında heç bir söz yoxdur — hər bir konstruksiya bir işarədir. İstənilən insan dilində eyni şəkildə işləyir.

- `if`, `while`, `return` yoxdur — yalnız `?`, `@`, `<~`
- Tam Unicode — istənilən dildə və ya emoji ilə identifikatorlar
- İnsan dilindən asılı deyil — kod hər yerdə eynidir

**Tərcüməçi versiyası**: v0.0.9 | **Test əhatəsi**: 660/666 (üç mühərrik razıdır, 0 fərqli)

---

## Dəyişənlər və Sabitlər

```zymbol
x = 10              // dəyişdirilə bilən dəyişən
PI := 3.14159       // sabit — yenidən təyin etmə icra vaxtı xətasıdır
ad = "Aysel"
aktiv = #1          // boolean doğru
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

`°` (dərəcə işarəsi, U+00B0) ilk istifadədə dəyişəni neytral dəyərinə avtomatik başladır:

```zymbol
ədədlər = [3, 1, 4, 1, 5]
@ n:ədədlər {
    °cəm += n
}
>> cəm ¶              // → 14
```

> `°dəyişən` (prefiks) dövrənin üstündə lövbər salır — nəticə `@` sonrası oxuna bilər.
> `dəyişən°` (suffiks) dövrənin içində lövbər salır — dövrə bitdikdə ölür.

Yalnız addan ibarət ifadə dəyişəni oxuyur və dəyəri atır, buna görə xəbərdarlıq edir:

```zymbol
sayğac = 5
sayğac
```

Kompilyator belə xəbərdarlıq edir (mesajları həmişə ingilis dilindədir):

```text
warning: this statement does nothing: 'sayğac' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Yəni: *«bu ifadə heç nə etmir: 'sayğac' oxundu və atıldı»*.

---

## Məlumat Növləri

| Növ | Hərfi | `#?` etiketi | Qeydlər |
|------|---------|----------|-------|
| Tam ədəd | `42`, `-7` | `###` | Təhlükəsiz tam ədəd: ±(2⁵³ − 1) |
| Sürüşən nöqtə | `3.14`, `1.5e10` | `##.` | IEEE-754 ikiqat |
| Sətir | `"mətn"` | `##"` | İnterpolyasiya: `"Salam {ad}"` |
| Simvol | `'A'` | `##'` | Bir Unicode kod nöqtəsi |
| Boolean | `#1`, `#0` | `##?` | Rəqəm DEYİL — `#1 ≠ 1` |
| Massiv | `[1, 2, 3]` | `##]` | Bir növ, yoxlanılmış |
| Bəyan edilmiş qarışıq | `#[1, "iki"]` | `##[` | `[…]` ilə eyni növ, yoxlanılmamış |
| Tuple | `(a, b)` | `##)` | Mövqeli, dəyişməz |
| Lüğət | `#(x: 1, y: 2)` | `##(` | Açarlı, dəyişdirilə bilən |
| Funksiya | adlı funksiya istinadı | `##()` | Birinci dərəcəli; göstərir `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Birinci dərəcəli; göstərir `<lambd/N>` |
| Vahid | `##_` | `##_` | Yoxluq — null yoxdur |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Təhlükəsiz aralıqdan çıxan tam ədəd tutula bilən xətadır, heç vaxt səssiz sarğı deyil:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "aralıqdan kənar" ¶ // → aralıqdan kənar
}
```

`##_` proqramın bir şeyin olmadığını soruşma yoludur:

```zymbol
heç_nə() { }
dəyər = heç_nə()
>> (dəyər == ##_) ¶     // → #1
```

---

## Çıxış və Giriş

```zymbol
ad = "Aysel"
cəm = 3
>> "Salam" ¶             // → Salam
>> "a=" ad " b=" cəm ¶ // → a=Aysel b=3
>> cəm#? ¶            // → (###, 1, 3)
```

```zymbol
<< ad
<< "Adınızı daxil edin: " ad
<< ###(4) "Yaş: " yaş
```

**İki işarənin formasına baxın.** `>>` bayıra işarə edir: məlumatı proqramdan çıxarır. `<<` içinə işarə edir: məlumatı proqrama gətirir. Burada yadda saxlamaq üçün heç nə yoxdur — ox məlumatın hansı istiqamətdə getdiyini göstərir və eyni fikir bir şeyi hərəkət etdirən hər işarədə geri qayıdır.

> `¶` və `\\` ekvivalent yeni sətirlərdir. `>>` heç vaxt birini əlavə etmir.
> Tələb öncəsi növ təyinedicisi oxuyarkən yoxlayır və dəyər doğru olana qədər yenidən soruşur:
> `##.` Sürüşən nöqtə · `##.(T,D)` onluq · `###(N)` Tam ədəd · `##"(N)"` mətn · `##'` bir Simvol.

Faylın ən üst səviyyəsində `<~` proqramın çıxış statusudur:

```zymbol
>> "yoxlanılır" ¶      // → yoxlanılır
<~ 0
```

---

## TUI Primitivləri

İnteraktiv proqramlar üçün terminal UI operatorları. Çoxu `>>| { }` blok tələb edir (alternativ ekran + xam rejim).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "İşləyir"
    @~ 1000
    >>~ (2, 1) > "Hazırdır."
}
```

```zymbol
>>| {
    [sətirlər, sütunlar] = >>?
    >>~ (1, 1) > "Terminal: " sətirlər " x " sütunlar
    <<| düymə
    >>~ (2, 1) > "Basıldı: " düymə
}
```

Burada işarələrin niyə vurulmaq yerinə birləşdiyini görə bilərsiniz. Artıq bilirsiniz ki, `<<` girişdir və `?` öhdəlik götürmədən soruşur. Yalnız bir işarə yenidir:

- `|` **tək vahiddir**, bütün axın deyil.

Bununla, hər iki klaviatura operatoru özlərini oxuyur:

```text
<<        |             ?
giriş     tək vahid     öhdəliksiz

<<|   BİR düymə götür və biri gələnə qədər gözlə
<<|?  düymənin olub-olmadığına bax və yoxdursa davam et
```

Digər tərəfdə də eyni: `>>` göndərir, `>>!` **güclə** göndərir (bütün ekranı təmizləyir), `>>?` isə yazmaq yerinə **soruşur** (terminal nə qədər böyükdür). Sağdakı işarə rejimi dəyişdirən işarədir və həmişə sonuncu gəlir.

> `>>!` ekranı təmizləyir. `>>?` `[sətirlər, sütunlar]` qaytarır. `@~ N` N millisaniyə yatır.
> `<<|` bir düymə basmasını oxuyur (bloklayıcı); `<<|?` bloklamadan yoxlayır (`'\0'` yoxdursa).
> Ox düymələri `'↑' '↓' '←' '→'` kimi deşifrə olunur; ESC kod nöqtəsi 27-dir.
> Mövqeli çıxış tuple-ı: `(sətir, sütun, BKS, ön, arxa)` — hər hansı yuva vergüllə buraxıla bilər (`>>~ (,,, 196) > "qırmızı"`).
> BKS bit maskası: `1`=Qalın, `2`=Kursiv, `4`=Altı xətli. ANSI 256 rəng palitrası (`0`=terminal standartı).

---

## Operatorlar

```zymbol
a = 10
b = 3
n1 = a + b    // 13
n2 = a - b    // 7
n3 = a * b    // 30
n4 = a / b    // 3  (tam ədəd bölməsi)
n5 = a % b    // 1
n6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
m1 = a == b    // #0
m2 = a <> b    // #1
m3 = a < b     // #0
m4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` heç vaxt məcbur etmir: `"5" == 5` `#0`-dır. Sıralama məcbur edir: `"5" > 4` `#1`-dir və `"४२" > 5` də — 69 yazı sisteminin hər hansı birindəki rəqəmli mətn ədəd kimi müqayisə olunur.
> Funksiya yalnız özünə bərabərdir, heç vaxt eyni gövdəyə malik başqa funksiyaya bərabər deyil.

---

## Sətirlər

```zymbol
ad = "Aysel"
n = 42
>> "Salam " ad " sizin " n " var" ¶ // → Salam Aysel sizin 42 var
təsvir = "Salam {ad}, sizin {n} var"
>> təsvir ¶              // → Salam Aysel, sizin 42 var
```

```zymbol
s = "Salam dünya"
uzunluq = s$#                  // 11
alt = s$[1..5]             // "Salam"
var = s$? "dünya"          // #1
hissələr = "a,b,c,d"$/ ','    // [a, b, c, d]
dəyişdir = s$~~["a":"ə"]        // "Sələm dünyə"
xətt = "─" $* 20
```

> `+` yalnız ədədlər üçündür. Sətirlər üçün yanaşı qoyma və ya interpolyasiya istifadə edin.
> `\{` və `\}` hərfi buruqlardır — qaçış simmetrikdir.

---

## Nəzarət Axını

```zymbol
x = 7
? x > 100 {
    >> "böyük" ¶
} _? x > 0 {
    >> "müsbət" ¶     // → müsbət
} _ {
    >> "mənfi" ¶
}
```

Burada iki yeni işarə var və üçüncüsü onları birləşdirməkdən gəlir:

- `?` **soruşmaqdır**: şərti açır.
- `_` **təyin edilməyən şeydir**: heç bir sual uyğun gəlmədikdə qalan budaq.
- `_?` hər ikisi ardıcıl: *heç nə uyğun gəlmədisə, yenidən soruş*.

Buna görə `_?` belə yazılır. Öyrənmək üçün yeni simvol deyil — `_` ardınca `?`, iki hissəsinin sıra ilə oxunduğunda nə məna verdiyini tam olaraq bildirir.

> Buruqlar `{ }` bir ifadə üçün belə **məcburidir**.

---

## Uyğunlaşdırma

```zymbol
bal = 85
qiymət = ?? bal {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> qiymət ¶              // → B
```

```zymbol
temperatur = -5
vəziyyət = ?? temperatur {
    < 0  => "buz"
    < 20 => "soyuq"
    _    => "isti"
}
>> vəziyyət ¶              // → buz
```

Artıq bilirsiniz ki, `?` "soruşmaq"dır. **`??` dəfələrlə soruşmaqdır**: dilin hər hansı yerində bir işarəni ikiqat artırmaq, həmin işarənin bir dəfə etdiyini bir neçə dəfə etməkdir. Bir `?` bir şərti yoxlayır; `??` hallar siyahısına qarşı yoxlayır.

Alternativlər `||` ilə birləşir və naxış növlərini qarışdıra bilər:

```zymbol
düymə = 'P'
hərəkət = ?? düymə {
    'p' || 'P' => "fasilə"
    < 0 || > 100 => "aralıqdan kənar"
    _ => "laqeyd"
}
>> hərəkət ¶             // → fasilə
```

---

## Dövrələr

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
meyvələr = ["alma", "armud", "üzüm"]
@ m:meyvələr { >> m " " }
>> ¶                    // → alma armud üzüm
@ s:"Salam" { >> s "-" }
>> ¶                    // → S-a-l-a-m-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
sayğac = 0
@:xarici {
    sayğac++
    ? sayğac >= 3 { @:xarici! }
}
>> sayğac ¶             // → 3
```

`@` **zaman** işarəsidir: təkrarlanan hər şey onun içində yaşayır. Bu zamanı kəsmək üçün yanına bir işarə əlavə edirsiniz:

- `@!` — `!` **gücdür**: dövrəni indi tərk et.
- `@>` — `>` irəli itələyir: növbəti dövrəyə keç.
- `@:xarici!` — `:` **ad bağlayır**, buna görə bu *xarici* adlı dövrəni kəsir, ən yaxını deyil.

Üç operator və heç biri ayrıca yadda saxlanılmalı deyildi: onlar `@` üstəgəl nə etdiyini artıq deyən bir işarədir.

> **Təyinedici say və ya şərtdir.** `Tam ədəd` bir saydır, bir dəfə qiymətləndirilir — `@ 0` gövdəni sıfır dəfə işlədir. Digər hər şey şərtdir. Doğruluq yoxdur: `@ []` və `@ 3.5` rədd edilir. Kolleksiyanı gəzmək üçün `@ x:elementlər` istifadə edin; saymaq üçün `@ elementlər$#`.

---

## Funksiyalar

```zymbol
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶        // → 7
```

```zymbol
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶       // → 120
```

Funksiya faylın dəyişənlərini dəyərlə oxuyur və içəridəki yazma içəridə qalır:

```zymbol
hədd = 100
içində(n) { <~ n < hədd }
>> içində(42) ¶         // → #1
```

İki işarə bunu dəyişdirir və hər ikisi **imzada və çağırış yerində** yazılır:

```zymbol
artır(sayğac<~) { sayğac = sayğac + 1 }
cəm = 0
artır(cəm<~)
>> cəm ¶              // → 1
```

> `p~` işçi nüsxədir — gövdə onu yenidən təyin edə bilər və çağıran toxunulmaz qalır.
> `p<~` çıxış parametridir — dəyişiklik geri qayıdır. `artır(cəm)` işarəsiz semantik xətadır: annotasiya və imza ayrıla bilməz.

---

## Lambda və Bağlanmalar

```zymbol
ikiqat = x -> x * 2
cəm = (a, b) -> a + b
>> ikiqat(5) ¶          // → 10
>> cəm(3, 7) ¶          // → 10
```

```zymbol
təsnifat = x -> {
    ? x > 0 { <~ "müsbət" }
    _? x < 0 { <~ "mənfi" }
    <~ "sıfır"
}
>> təsnifat(-4) ¶         // → mənfi
```

```zymbol
əmsal = 3
üçqat = x -> x * əmsal
>> üçqat(7) ¶          // → 21
```

```zymbol
toplayıcı_yarat(n) { <~ x -> x + n }
topla10 = toplayıcı_yarat(10)
>> topla10(5) ¶           // → 15
```

Lambda heç bir parametr götürməyə bilər:

```zymbol
cavab = () -> 42
>> cavab() ¶           // → 42
```

> Lambda faylın dəyişənlərini **yaradıldığı zaman** tutur; adlı funksiya onları **çağırıldığı zaman** oxuyur.

---

## Massivlər

```zymbol
massiv = [1, 2, 3, 4, 5]
>> massiv[1] ¶       // → 1   indeksləmə 1-dən başlayır
>> massiv[-1] ¶      // → 5   mənfi sondan sayır
>> massiv$# ¶        // → 5   uzunluq
```

```zymbol
massiv = [1, 2, 3]
>> (massiv$+ 6) ¶          // → [1, 2, 3, 6]   əlavə et
>> (massiv$+[2] 99) ¶      // → [1, 99, 2, 3]  2-ci mövqeyə daxil et
>> (massiv$- 3) ¶          // → [1, 2]         ilk baş verməni sil
>> (massiv$-[1]) ¶         // → [2, 3]         1-ci indeksdə sil
>> (massiv$[1..2]) ¶       // → [1, 2]         dilim, hər iki uc daxil
>> (massiv$? 3) ¶          // → #1             ehtiva edir
```

Hamısı `$` ilə başlayır, bu **kolleksiya** işarəsidir və içində nə edildiyini deyən işarə ilə davam edir: `#` neçə, `+` əlavə et, `-` sil, `?` var olub-olmadığını soruş. Və `??` kimi, işarəni ikiqat artırmaq onu tamamilə etmək deməkdir: `$?` bir dəyərin *olub-olmadığını* soruşur, `$??` *neçə yerdə* olduğunu soruşur və hamısını qaytarır.

```zymbol
massiv = [3, 1, 2]
>> (massiv$^+) ¶     // → [1, 2, 3]   artan
>> (massiv$^-) ¶     // → [3, 2, 1]   azalan
```

**Nəticənin qaydası.** Bir operator və ətrafdakı kodun onunla nə etdiyi qərar verir: istifadə edilərsə, **qurur** və orijinalı toxunulmaz qoyur; atılırsa, **dəyişdirir**.

```zymbol
massiv = [1, 2, 3]
nüsxə = massiv[2]$~ 99
>> massiv ¶                // → [1, 2, 3]
>> nüsxə ¶              // → [1, 99, 3]
massiv[2]$~ 99
>> massiv ¶                // → [1, 99, 3]
```

> **`=` heç vaxt kolleksiyaya yazmır.** `massiv[2] = 99` Zymbol-un bir forması deyil — `=` **ADA** dəyər verir. Kolleksiyanın bir hissəsini dəyişdirmək `$~`-dır, hər kolleksiyada.

`[…]` bir növ saxlayır və yoxlanılır; qəsdən qarışıq `#[…]` ilə **bəyan edilir**:

```zymbol
qarışıq = #[1, "iki", #1]
>> qarışıq ¶             // → [1, iki, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Çoxölçülü İndeksləmə

`>` iç-içə quruluşun içinə enir. Bir mötərizə qrupu bir elementi ünvanlayır, nə qədər dərin olsa da.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   sətir 2, sütun 3
>> m[-1>-1] ¶      // → 9   son sətir, son sütun
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          düz: diaqonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   quruluşlu: künclər
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` Zymbol-un bir forması **deyil**. Zəncirli indeks həm oxumaq, həm yazmaq üçün rədd edilir — hər giriş üçün bir mötərizə qrupu və `>` addımlar arasında gedən şeydir.

---

## Lüğətlər

Adlı sahələri olan tuple bir lüğətdir və v0.0.9-dan bəri `#(…)` kimi yazılır.

```zymbol
şəxs = #(ad: "Aysel", yaş: 25)
>> şəxs.ad ¶        // → Aysel
>> şəxs["yaş"] ¶    // → 25
```

```zymbol
şəxs = #(ad: "Aysel", yaş: 25)
sahə = "ad"
>> şəxs[sahə] ¶     // → Aysel
```

Dəyişdirilə bilər, açarlar əlavə edilə bilər və gəzmək mümkündür:

```zymbol
ehtiyat = #(armud: 4)
ehtiyat["alma"]$~ 10
@ k:ehtiyat { >> k "=" ehtiyat[k] " " }
>> ¶                    // → armud=4 alma=10
```

```zymbol
ehtiyat = #(armud: 4, alma: 10)
@ (k, v):ehtiyat { >> k ":" v " " }
>> ¶                    // → armud:4 alma:10
```

> `#()` boş lüğətdir, `()` ola bilməzdi — boş tuple da olmalı idi. Çılpaq `(x: 1)` bu mesajla rədd edilir: *a dictionary is written `#(…)`* — «lüğət `#(…)` kimi yazılır».
> Lüğət açar ilə ünvanlanır, heç vaxt mövqe ilə deyil, buna görə `şəxs[1]` xətadır.

---

## Tuple-lar

Tuple-lar **dəyişməz** sıralı qablardır və müxtəlif növ dəyərləri saxlayır.

```zymbol
nöqtə = (10, 20)
>> nöqtə[1] ¶           // → 10
məlumat = (42, "Salam", #1, 3.14)
>> məlumat[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Tuple-ı yerində dəyişmək üçün hər cəhd xətadır, operator nə olursa olsun — dəyişməzlik dəyərin xüsusiyyətidir, hər `$` içindəki istisna deyil.

---

## Strukturun Açılması

```zymbol
massiv = [10, 20, 30, 40, 50]
[a, b, c] = massiv
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
massiv = [10, 20, 30, 40, 50]
[birinci, *qalan] = massiv
>> birinci ¶            // → 10
>> qalan ¶              // → [20, 30, 40, 50]
```

```zymbol
nöqtə = (100, 200)
(px, py) = nöqtə
>> px " " py ¶          // → 100 200
```

```zymbol
şəxs = #(ad: "Leyla", yaş: 25)
#(ad: n, yaş: y) = şəxs
>> n " " y ¶            // → Leyla 25
```

> Mötərizənin forması tipləşdirilib: `[…]` massiv alır, `(…)` tuple, `#(…)` lüğət. Sonuncu ad **qalanı udur**, buna görə strukturun açılması heç vaxt uzunluğa görə uğursuz olmur — `(a, b, c) = (1,2,3,4,5)` `c = (3,4,5)` verir və heç nə qalmadıqda `##_`.

---

## Yüksək Dərəcəli Funksiyalar

```zymbol
ədədlər = [1, 2, 3, 4, 5]
>> (ədədlər$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (ədədlər$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (ədədlər$< (0, (toplayıcı, x) -> toplayıcı + x)) ¶ // → 15
```

```zymbol
ədədlər = [1, 2, 3, 4, 5, 6]
ikiqat(x) { <~ x * 2 }
böyük(x) { <~ x > 3 }
>> (ədədlər$> ikiqat) ¶    // → [2, 4, 6, 8, 10, 12]
>> (ədədlər$| böyük) ¶    // → [4, 5, 6]
```

```zymbol
baza = [#(ad: "Karla", yaş: 28), #(ad: "Leyla", yaş: 25)]
yaşa_görə = baza$^ (a, b -> a.yaş < b.yaş)
>> yaşa_görə[1].ad ¶     // → Leyla
```

> Adlı funksiya HOF-a **mötərizəsiz** gedir: `ədədlər$> ikiqat`. `ədədlər$> (ikiqat)` yazmaq təhlil xətasıdır, çünki `(` lambda açır.

---

## Boru Operatoru

```zymbol
ikiqat = x -> x * 2
topla = (a, b) -> a + b
bir_artır = x -> x + 1
>> (5 |> ikiqat(_)) ¶    // → 10
>> (10 |> topla(_, 5)) ¶  // → 15
>> (5 |> ikiqat(_) |> bir_artır(_)) ¶ // → 11
```

---

## Xəta İdarəetməsi

```zymbol
!? {
    a = 10 / 0
} :! ##Div {
    >> "sıfıra bölmə" ¶  // → sıfıra bölmə
} :! {
    >> "digər: " _err ¶
} :> {
    >> "həmişə işləyir" ¶        // → həmişə işləyir
}
```

| Növ | Nə vaxt |
|------|------|
| `##Div` | Sıfıra bölmə |
| `##Index` | İndeks hüduddan kənar |
| `##Key` | Lüğətdə açar yoxdur |
| `##Range` | Təhlükəsiz tam ədəd aralığından kənar |
| `##Type` | Növ uyğunsuzluğu |
| `##Parse` | Məlumat təhlili |
| `##IO` | Fayl / sistem |
| `##Network` | Şəbəkə xətaları |
| `##DB` | Verilənlər bazası |
| `##Time` | Mövcud olmayan tarix |
| `##_` | İstənilən xəta (hamısını tutur) |

`!` **xəta və güc** işarəsidir və hər iki ailədə eyni oxunur: `$!` dəyərdən xəta olub-olmadığını soruşur; `$!!`, işarə ikiqat artırılmış halda, soruşmadan yuxarı yayır.

> Standart kitabxana uğursuzluqları dayandırmaq yerinə `$!` ilə yoxladığınız və ya `!?` ilə tutduğunuz **yumşaq xəta dəyərləri** kimi qaytarılır. `$!!` birini çağırana yayır.

---

## Modullar

```zymbol
# hesab {
    #> { topla, PI }

    PI := 3.14159
    topla(a, b) { <~ a + b }
}
```

```zymbol
<# ./hesab => h

>> h::topla(5, 3) ¶
>> h.PI ¶
```

```zymbol
# kitabxanam {
    #> { daxili_toplama => cəm }

    daxili_toplama(a, b) { <~ a + b }
}
```

İki modul işarəsi eyni fikirdir, indi fayllara tətbiq olunur: `#` **bəyan** səviyyəsidir — bir şeyin *nə olduğu*, dəyəri deyil — ox isə kodun hansı istiqamətə getdiyini deyir:

```text
<#   ox içəri girir: idxal et, başqa fayldan gətir
#>   ox xaricə çıxır: ixrac et, başqa fayllara təklif et
```

İstiqamət işarəsi həmişə işarə etdiyi istiqamətə baxan kənarda oturur. Bu, `<~`-nin sola qayıtmasının (funksiyadan çıxması) və `->`-nin sağa girməsinin (lambda-nın gövdəsinə) eyni səbəbidir.

> **Modul nə ixrac etdiyini bəyan edir.** `#>` bloku məcburidir — onu buraxmaq **E014**-dür və `#> { }` bir modulun səthinin boş olduğunu demə üsuludur. `::` funksiya çağırır, `.` sabit oxuyur. Modul gövdəsində yalnız idxallar, ixrac bloku, hərfi başlatmalar və funksiya təyinatları görünə bilər; icra edilə bilən hər şey **E013**-dür.

---

## Standart Kitabxana

Doğma modullar, digərləri kimi idxal olunur:

| Modul | Funksiyalar |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   iki qlif, dörd sütun
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

gün = T::of(2026, 1, 31)
>> T::format(gün, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(gün, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` **görüntü sütunlarını** ölçür, simvolları deyil: CJK və əksər emojilər 2 sütundur, buna görə cədvəli `t::width` ilə düzün, heç vaxt `$#` ilə deyil.
> `std/time`-da bir an dövrdən bəri millisaniyədir. Bir gündən az müddətdir, bir gündən yuxarı təqvimdir — buna görə bir ay həmin ayın gününə düşür, sıxılmış. `fərq(a, b)` `a - b`-dir, buna görə əvvəlki anı birinci versəniz mənfi cavab alırsınız.

---

## Paketlər

`.zyp` çoxfayllı proqramı bir portativ faylda birləşdirir. **Mənbə** arxividir, binar deyil, buna görə `zymbol` binasının işlədiyi hər yerdə işləyir.

```bash
zymbol package layihəm/ --script main.zy -o layihəm.zyp
zymbol run layihəm.zyp
```

> Arxiv manifest (`zyp.toml`) daşıyır və giriş skriptlərini və tələb olunan mühərrik versiyasını bəyan edir. `zymbol run` onu müvəqqəti kataloqa çıxarır və oradan işlədir, buna görə kod birdəfəlikdir, skriptin yazdığı isə real iş kataloqunuza düşür. Oyun meydançası da `.zyp` fayllarını yükləyir.

---

## Rəqəm Rejimləri

Zymbol rəqəmləri **69 Unicode rəqəm yazısında** yaza bilər — Devanaqari, Ərəb-Hind, Tay, Klingon pIqaD, Riyazi Qalın, LCD seqmentləri və s. Rejim proses üçün qlobaldır və çıxışa təsir edir; arifmetika dəyişmir.

```zymbol
#०९#    // Devanaqari   (U+0966–U+096F)
#٠٩#    // Ərəb-Hind (U+0660–U+0669)
#๐๙#    // Tay         (U+0E50–U+0E59)
#09#    // ASCII-yə sıfırla
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Hər hansı dəstəklənən yazının rəqəmləri mənbədə etibarlı hərfi ifadələrdir:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Oxuma simmetrikdir — rəqəm hər hansı yazıda başa düşülür:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` həmişə ASCII-dir, buna görə `#0` hər yazıda sıfır rəqəmindən vizual olaraq fərqlənir.
> `#,` və `#^` də rəqəmlərini aktiv yazıda yazır və ayırıcılar onu izləyir — lakin cüt heç vaxt tərsinə çevrilmir: `,` qruplaşdırır və `.` bölür, hər yazıda.

---

## Məlumat Operatorları

```zymbol
f = ##.42         // Sürüşən nöqtəyə
i = ###3.7        // Tam ədədə, yuvarlaqlaşdırılmış  → 4
t = ##!3.7        // Tam ədədə, kəsilmiş  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Sürüşən nöqtə rəqəm kimi çap olunur, heç vaxt eksponent kimi deyil və sondakı `.0`-ı atır — `##.42` `42` yazır və hələ də Sürüşən nöqtədir, `f#?` göstərdiyi kimi.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   uğursuzluq-təhlükəsiz: girişi dəyişmədən qaytarır
>> ##!'A' ¶        // → 65    Simvolun kod nöqtəsi
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          2 onluq rəqəmə yuvarlaqlaşdır
>> #!2|pi| ¶       // → 3.14          2 onluq rəqəmə kəs
>> #,|1234567| ¶   // → 1,234,567     minlik ayırıcıları
>> #^|12345.678| ¶ // → 1.2345678e4   elmi notasiya
```

```zymbol
>> 0x41 ¶        // → A   onaltılıq
>> 0b01000001 ¶  // → A   ikilik
>> 0o101 ¶       // → A   səkkizlik
>> 0d65 ¶        // → A   onluq
```

> ASCII aralığında baza hərfi **Simvoldur**: `0d65 == 'A'` `#1`-dir və `0d65 == 65` `#0`-dır. Dörd baza da eyni simvolu yazır.

---

## Shell İnteqrasiyası

```zymbol
bu_gün = <\ date +%Y-%m-%d \>
>> "Bu gün: " bu_gün
```

```zymbol
çıxış = </"./alt_skript.zy"/>
>> çıxış
```

> `<\ … \>` stdout və stderr-i tutur, sondakı yeni sətri çıxarır.
> `>< args` əmr sətri arqumentlərini sətir massivi kimi tutur.

---

## Tam Nümunə: FizzBuzz

```zymbol
təsnifat(ədəd) {
    ? ədəd % 15 == 0 { <~ "FizzBuzz" }
    _? ədəd % 3  == 0 { <~ "Fizz" }
    _? ədəd % 5  == 0 { <~ "Buzz" }
    <~ ədəd
}

@ i:1..20 { >> təsnifat(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (hər sətirdə bir)
```

---

## İşarələr Necə Birləşir

Bu təlimat boyu eyni şeyi gördünüz: **operator yadda saxlamaq üçün çəkilmiş rəsm deyil, sıra ilə bir neçə işarədir və hər biri öz mənasını verir.** İndi hamısını bildiyinizə görə, tam naxış budur.

Əvvəlcə **hansı dünyada olduğumuz** gəlir:

| İşarə | Dünya | Bunu harada gördünüz |
|--------|-------|----------------------------|
| `$` | kolleksiya | `$#` `$+` `$?` `$^-` |
| `@` | zaman, təkrarlanan hər şey | `@!` `@>` `@~` |
| `#` | bir şeyin *nə olduğu*, dəyəri deyil | `#?` `#(…)` `<#` `#>` |
| `>>` | proqramdan çıxış | `>>` `>>!` `>>?` |
| `<<` | proqrama giriş | `<<` `<<\|` `<<\|?` |
| `?` | soruşmaq, öhdəliksiz | `?` `_?` `??` `$?` |
| `!` | güc və ya xəta | `@!` `$!` `!?` |

Sonra **orada nə edildiyi** gəlir: `+` əlavə et, `-` sil, `^` sırala, `~` dəyişdir, `#` say, `|` tək vahid, `:` ad bağla.

Və heç vaxt uğursuz olmayan iki qayda:

**İşarəni ikiqat artırmaq onu hərtərəfli edir.** `?` bir dəfə soruşur, `??` bir çox halı yoxlayır. `$?` dəyərin olub-olmadığını soruşur, `$??` olduğu hər yeri qaytarır. `!` xətanı işarələyir, `!!` soruşmadan yayır.

**Rejim işarəsi həmişə sonuncu gəlir.** `?` və ya `!` bir şeyin *necə* edildiyini — tərəddüdlə və ya güclə — demək üçün görünəndə, onlar operatorun sonuncu işarəsidir: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:xarici!`. Onlardan sonra heç vaxt əməliyyat olmur.

Buradan praktik bir şey çıxır: **heç vaxt görmədiyiniz bir kombinasiya, ona baxmadan əvvəl artıq məna kəsb edir.** Əgər `$` kolleksiyadırsa və `^` sıradırsa və `-` tərsdirsə, onda `$^-` azalan sıra ilə düzür və heç kim sizə deməli deyildi.

Bütün inventar bu şəkildə işləmir və bunu demək özünü elə göstərməkdən yaxşıdır. Əksər operatorlar təmiz şəkildə parçalanır. Altısı parçalanır, lakin hissələrindən çoxunu ifadə edir: `!?` `:!` `:>` `|>` `::` `$++`. Və onunu yadda saxlamaq lazımdır, çünki heç parçalanmırlar: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Qaranlıq olanları az olduğunu güman etmək yerinə saymaq qəsdəndir: onlar dilin həqiqi yadda saxlama xərcidir. Tam istinad — inventar, bəyan edilmiş homograflar və yeni operatorun mövcud olmaq üçün yerinə yetirməli olduğu qaydalar — tərcüməçi anbarındakı `SYMBOLS.md`-dədir.

---

## İşarə İstinadı

| İşarə | Əməliyyat | İşarə | Əməliyyat |
|--------|-----------|--------|-----------|
| `=` | dəyişən | `$#` | uzunluq |
| `:=` | sabit | `$+` | əlavə et |
| `>>` | çıxış | `$+[i]` | indeksə daxil et (1-dən) |
| `<<` | giriş | `$-` | dəyərə görə birincini sil |
| `¶` / `\\` | yeni sətir | `$--` | dəyərə görə hamısını sil |
| `?` | əgər | `$-[i]` | indeksdə sil (1-dən) |
| `_?` | əks halda-əgər | `$-[i..j]` | aralığı sil (1-dən) |
| `_` | əks halda / vəhşi kart | `$?` | ehtiva edir |
| `??` | uyğunlaşdırma | `$??` | bütün indeksləri tap (1-dən) |
| `\|\|` | uyğun budaqda və ya-naxışı | `$[s..e]` | dilim (1-dən) |
| `@` | dövrə | `$>` | xəritə |
| `@ N { }` | N dəfə dövrə | `$\|` | filtr |
| `@!` | qır | `$<` | azalt |
| `@>` | davam et | `$/ ayırıcı` | sətri böl |
| `@:ad { }` | etiketli dövrə | `$++ a b c` | birləşdirməklə qur |
| `@:ad!` | etiketi qır | `$~~[p:r]` | sətirdə dəyişdir |
| `@:ad>` | etiketi davam etdir | `$*` | sətri təkrarla |
| `->` | lambda | `massiv[i]$~ v` | YEGANƏ yeniləmə forması |
| `<~` | qaytar / çıxış parametri | `~` | işçi-nüsxə parametri |
| `massiv[i>j]` | naviqasiya indeksi | `massiv[p ; q]` | düz çıxarış |
| `$^+` | artan sırala | `$^-` | azalan sırala |
| `$^` | müqayisə edici ilə sırala | `\|>` | boru |
| `!?` | cəhd et | `:!` | tut |
| `:>` | nəhayət | `$!` | xəta |
| `$!!` | xətanı yay | `#1` / `#0` | doğru / yanlış |
| `##_` | Vahid — yoxluq | `[…]` | massiv, bir növ |
| `#[…]` | massiv, bəyan edilmiş qarışıq | `#(…)` | lüğət |
| `(…)` | mövqeli tuple | `#()` | boş lüğət |
| `<#` | idxal | `#>` | ixrac |
| `#` | modul bəyan et | `::` | modul çağır |
| `.` | sahə / sabit girişi | `#?` | növ metadata |
| `#\|..\|` | ədədi təhlil et | `##.` | Sürüşən nöqtəyə çevir |
| `###` | Tam ədədə çevir (yuvarlaq) | `##!` | Tam ədədə çevir (kəs) |
| `#.N\|..\|` | yuvarlaqlaşdır | `#!N\|..\|` | kəs |
| `#,\|..\|` | minlik ayırıcıları | `#^\|..\|` | elmi |
| `#d0d9#` | rəqəm rejimini dəyişdir | `#09#` | ASCII-yə sıfırla |
| `<\ ..\>` | shell icra et | `><` | CLI arqumentləri |
| `\ var` | dəyişəni məhv et | `°x` / `x°` | isti təyinat |
| `>>\|` | TUI bloku (alternativ ekran) | `>>~` | mövqeli çıxış |
| `>>!` | ekranı təmizlə | `>>?` | terminal ölçüsünü soruş |
| `<<\|` | bloklayıcı düymə basması | `<<\|?` | bloklamayan düymə basması |
| `@~ N` | N millisaniyə yat | `0d` `0x` `0o` `0b` | baza hərfi ifadələri |

---

## Buraxılış Dəyişiklikləri Jurnalı

### v0.0.9 — Kolleksiyalar Qərar Verdi _(Sentyabr 2026)_

- **Qırıcı** Lüğətin öz notasiyası var: `#(açar: dəyər)`. Çılpaq `(x: 1)` rədd edilir və `#()` boş lüğətdir — `()` heç vaxt ola bilməzdi
- **Qırıcı** İndeksli təyinat geri götürüldü: `massiv[i] = v` və bütün birləşik formalar. `=` **ADA** dəyər verir; kolleksiyanın bir hissəsini dəyişmək `$~`-dır
- **Qırıcı** Zəncirli indeks `m[i][j]` həm oxumaq, həm yazmaq üçün rədd edilir — `>` addımlar arasında gedir
- **Qırıcı** Modul nə ixrac etdiyini bəyan etməlidir (**E014**); `#> { }` modulun səthinin boş olduğunu demə üsuludur
- **Qırıcı** Dövrə təyinedicisi say və ya şərtdir — doğruluq yoxdur. `@ []` və `@ 3.5` rədd edilir
- **Əlavə edildi** `##_` — Vahid hərfi və proqramın bir şeyin olmadığını soruşma yolu
- **Əlavə edildi** `#[…]` — element növlərinin qarışığı bəyan edilmiş massiv
- **Əlavə edildi** `#?` dörd kolleksiyanı fərqləndirir: `##]` `##[` `##)` `##(`
- **Əlavə edildi** `std/time` — saat və mülki təqvim, zona və təqvim arifmetikası ilə
- **Əlavə edildi** Üst səviyyədə `<~>` proqramın çıxış statusudur
- **Əlavə edildi** `@ (k, v):cütlər` — dövrə başlığında naxış
- **Əlavə edildi** `#|c|` 69 yazının hər hansı birində rəqəm oxuyur; `#,` və `#^` aktiv yazıda yazır
- **Dəyişdirildi** `Tam ədəd` təhlükəsiz tam ədəddir, ±(2⁵³ − 1), hər mühərrikdə uğursuzluq-bağlı
- **Dəyişdirildi** Adlı funksiya faylın dəyişənlərini çağırış vaxtı dəyərlə oxuyur
- **Dəyişdirildi** Yalnız ad oxuyan ifadə səssizcə keçmək yerinə xəbərdarlıq edir
- **Mühərriklər** 666 korpus faylından 660-ı üç mühərrikdə razıdır, 0 fərqli

### v0.0.8 — Avtomatik Azad Etmə, `std/term` və Paketlər _(Avqust 2026)_

- **Əlavə edildi** Son istifadədə avtomatik məhv — görünməz; yalnız pik yaddaşı azaldır
- **Əlavə edildi** `std/term` — terminal sütunlarında göstəriş metrikləri
- **Əlavə edildi** `Simvol` üzərində `##!` — Unicode kod nöqtəsi
- **Əlavə edildi** Uyğunlaşdırmada və ya-naxışları: `'p' || 'P' => …`, bir budaqda hər növdən alternativlər
- **Əlavə edildi** Zymbol Paketləri (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Əlavə edildi** Çağırış yerində `<~>` məcburidir, çağırılan çıxış parametri bəyan etdikdə
- **Düzəldildi** Registr VM-də modul sistemi pariteti

### v0.0.7 — Doğma Standart Kitabxana _(İyul 2026)_

- **Əlavə edildi** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — hamısı yumşaq xəta dəyərləri ilə
- **Əlavə edildi** Tipli/təsdiqlənmiş giriş: `<< ##.(5,2) "qiymət: " p`
- **Əlavə edildi** `>>`-də birbaşa postfiks operatorları — mötərizə tələb olunmur
- **Dəyişdirildi** Uğursuzluq-bağlı formatlayıcı: yenidən oxuya bilmədiyi çıxışı yazmaqdan imtina edir

### v0.0.6 — Təkmilləşdirmə və Elmi Stdlib _(İyun 2026)_

- **Qırıcı** `=>` uyğun budaqlarında `:` və idxal/ixrac ləqəblərində `<=`-i əvəz edir
- **Əlavə edildi** `std/math` və `std/random`
- **Əlavə edildi** Açarla lüğət yeniləməsi: `d["k"]$~ dəyər`

### v0.0.5 — TUI Primitivləri və İsti Təyinat _(May 2026)_

- **Əlavə edildi** TUI bloku `>>| { }`, mövqeli çıxış `>>~`, düymə girişi `<<|` və `<<|?`
- **Əlavə edildi** `>>!` ekranı təmizlə, `>>?` terminal ölçüsü, `@~ N` yat
- **Əlavə edildi** İsti təyinat `°x` / `x°` və sətir təkrarı `$*`

### v0.0.4 — 1-dən Başlayan İndeksləmə və Birinci Dərəcəli Funksiyalar _(Aprel 2026)_

- **Qırıcı** Bütün indeksləmə **1-dən başlayır** — `massiv[1]` birinci elementdir
- **Əlavə edildi** Adlı funksiyalar birinci dərəcəli dəyərlər kimi; modul bloku sintaksisi `# ad { }`
- **Əlavə edildi** Çoxölçülü indeksləmə `massiv[i>j>k]` və düz çıxarış `massiv[p ; q]`

### v0.0.3 — Unicode Rəqəm Sistemləri _(Aprel 2026)_

- **Əlavə edildi** 69 Unicode rəqəm bloku, rejim dəyişdirmə tokeni `#d0d9#` ilə
- **Əlavə edildi** Hər yazıda boolean hərfi ifadələr — `#१` / `#०`

### v0.0.2 — Kolleksiya API-nin Yenidən Dizaynı _(Mart 2026)_

- **Əlavə edildi** Massivlər və sətirlər üçün `$` operator ailəsi
- **Əlavə edildi** Strukturun açılması təyinatı və mənfi indekslər

### v0.0.1 — İlk İctimai Buraxılış _(Mart 2026)_

- Ağac gəzən tərcüməçi + registr VM (`--vm`)
- Bütün əsas konstruksiyalar: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tam Unicode identifikatorları, modul sistemi, lambda, bağlanmalar, xəta idarəetməsi
- REPL, LSP, VS Code genişlənməsi, formatlayıcı (`zymbol fmt`)

---

_Zymbol-Lang — Simvolik. Universal. Dəyişməz._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lisenziya:** bu təlimat [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) altında lisenziyalanmışdır — © 2024-2026 Zymbol-Lang Komandası. Tam mətn: `LICENSE-CC-BY-SA-4.0` <https://github.com/zymbol-lang/web>-də. Tərcüməçi və brauzer mühərriki (`zymbol.js`) ayrı əsərlərdir, AGPL-3.0-only altında lisenziyalanmışdır.
