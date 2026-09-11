> **Sorumluluk Reddi:** Bu belge yapay zeka (AI) tarafından oluşturulmuş ve çevrilmiştir.
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Kanonik referans, yorumlayıcı deposundaki **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** adresindedir.

---

# Zymbol-Lang Kılavuzu

> **v0.0.9 için gözden geçirildi — 2026-09-07**

**Zymbol-Lang** sembolik bir programlama dilidir. Dilbilgisinde hiç kelime yoktur — her yapı bir semboldür. Her insan dilinde aynı şekilde çalışır.

- `if`, `while`, `return` yok — sadece `?`, `@`, `<~`
- Tam Unicode — herhangi bir dilde veya emojide tanımlayıcılar
- İnsan dilinden bağımsız — kod her yerde aynıdır

**Yorumlayıcı sürümü**: v0.0.9 | **Test kapsamı**: 660/666 (üç motor aynı fikirde, 0 ayrışıyor)

---

## Değişkenler ve Sabitler

```zymbol
x = 10              // değiştirilebilir değişken
PI := 3.14159       // sabit — yeniden atama çalışma zamanı hatasıdır
isim = "Ali"
etkin = #1          // boolean doğru
👋 := "Merhaba"
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

`°` (derece işareti, U+00B0) bir değişkeni ilk kullanımda nötr değerine otomatik olarak başlatır:

```zymbol
sayılar = [3, 1, 4, 1, 5]
@ n:sayılar {
    °toplam += n
}
>> toplam ¶              // → 14
```

> `°değişken` (önek) döngünün üzerine sabitlenir — sonuç `@`'dan sonra okunabilir.
> `değişken°` (sonek) döngünün içine sabitlenir — döngü bittiğinde ölür.

Yalnızca bir isimden oluşan bir ifade, değişkeni okur ve değeri atar, bu nedenle uyarır:

```zymbol
sayac = 5
sayac
```

Derleyici şu şekilde uyarır (mesajları her zaman İngilizcedir):

```text
warning: this statement does nothing: 'sayac' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Anlamı: *«bu ifade hiçbir şey yapmaz: 'sayac' okundu ve atıldı»*.

---

## Veri Tipleri

| Tip | Literal | `#?` Etiketi | Notlar |
|------|---------|--------------|--------|
| Tam sayı | `42`, `-7` | `###` | Güvenli tam sayı: ±(2⁵³ − 1) |
| Kayan nokta | `3.14`, `1.5e10` | `##.` | IEEE-754 çift |
| Dizi | `"metin"` | `##"` | Yerleştirme: `"Merhaba {isim}"` |
| Karakter | `'A'` | `##'` | Bir Unicode kod noktası |
| Boolean | `#1`, `#0` | `##?` | Sayısal DEĞİL — `#1 ≠ 1` |
| Dizi | `[1, 2, 3]` | `##]` | Tek tip, kontrol edildi |
| Bildirilmiş karışım | `#[1, "iki"]` | `##[` | `[…]` ile aynı tip, kontrol yok |
| Demet | `(a, b)` | `##)` | Konumsal, değişmez |
| Sözlük | `#(x: 1, y: 2)` | `##(` | Anahtarlı, değiştirilebilir |
| Fonksiyon | adlandırılmış fonksiyon referansı | `##()` | Birinci sınıf; gösterir `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Birinci sınıf; gösterir `<lambd/N>` |
| Birim | `##_` | `##_` | Yokluk — null yoktur |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Güvenli aralığın dışına çıkan bir tam sayı, yakalanabilir bir hatadır, asla sessiz bir sarma değildir:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "aralık dışı" ¶ // → aralık dışı
}
```

`##_`, bir programın bir şeyin var olup olmadığını sorma şeklidir:

```zymbol
hiçbir_şey() { }
değer = hiçbir_şey()
>> (değer == ##_) ¶     // → #1
```

---

## Çıktı ve Girdi

```zymbol
isim = "Ali"
toplam = 3
>> "Merhaba" ¶             // → Merhaba
>> "a=" isim " b=" toplam ¶ // → a=Ali b=3
>> toplam#? ¶            // → (###, 1, 3)
```

```zymbol
<< isim
<< "Adınızı girin: " isim
<< ###(4) "Yaş: " yaş
```

**İki işaretin şekline bakın.** `>>` dışarıyı işaret eder: verileri programdan dışarı çıkarır. `<<` içeriyi işaret eder: verileri programa getirir. Orada hatırlanacak bir şey yok — ok, bilginin hangi yöne gittiğini gösterir ve aynı fikir, bir şeyi hareket ettiren her işarette geri gelir.

> `¶` ve `\\` eşdeğer yeni satırlardır. `>>` asla bir tane eklemez.
> İstemden önceki tip belirteci, okurken doğrular ve değer geçerli olana kadar tekrar ister:
> `##.` Kayan nokta · `##.(T,D)` ondalık · `###(N)` Tam sayı · `##"(N)` metin · `##'` bir Karakter.

Bir dosyanın en üst seviyesinde, `<~` programın çıkış durumudur:

```zymbol
>> "kontrol ediliyor" ¶      // → kontrol ediliyor
<~ 0
```

---

## TUI İlkelleri

Etkileşimli programlar için terminal UI operatörleri. Çoğu `>>| { }` bloğu gerektirir (alternatif ekran + ham mod).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Çalışıyor"
    @~ 1000
    >>~ (2, 1) > "Tamamlandı."
}
```

```zymbol
>>| {
    [satırlar, sütunlar] = >>?
    >>~ (1, 1) > "Terminal: " satırlar " x " sütunlar
    <<| tuş
    >>~ (2, 1) > "Basıldı: " tuş
}
```

İşte işaretlerin neden çarpılmak yerine birleştirildiğini görebilirsiniz. Zaten `<<`'in girdi olduğunu ve `?`'nin taahhüt etmeden sorduğunu biliyorsunuz. Sadece bir işaret yeni:

- `|` **tek bir birimdir**, tüm akış değil.

Bununla, her iki klavye operatörü de kendilerini okur:

```text
<<        |             ?
girdi     tek birim     taahhüt etmeden

<<|   BİR tuş alın ve bir tuş gelene kadar bekleyin
<<|?  BİR tuş var mı bakın ve yoksa devam edin
```

Diğer tarafta da aynı: `>>` gönderir, `>>!` **zorla** gönderir (tüm ekranı temizler), `>>?` ise yazmak yerine **sorar** (terminal ne kadar büyük). Sağdaki işaret, modu değiştiren işarettir ve her zaman sonra gelir.

> `>>!` ekranı temizler. `>>?` `[satırlar, sütunlar]` döndürür. `@~ N` N milisaniye uyur.
> `<<|` bir tuş vuruşu okur (engelleyici); `<<|?` engellemeden yoklar (`'\0'` yoksa).
> Ok tuşları `'↑' '↓' '←' '→'` olarak çözülür; ESC kod noktası 27'dir.
> Konumlandırılmış çıktı demeti: `(satır, sütun, BKS, ön, arka)` — herhangi bir yuva virgülle atlanabilir (`>>~ (,,, 196) > "kırmızı"`).
> BKS bit maskesi: `1`=Kalın, `2`=İtalik, `4`=Altı çizili. ANSI 256 renk paleti (`0`=terminal varsayılanı).

---

## Operatörler

```zymbol
a = 10
b = 3
s1 = a + b    // 13
s2 = a - b    // 7
s3 = a * b    // 30
s4 = a / b    // 3  (tam sayı bölmesi)
s5 = a % b    // 1
s6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a >= b    // #1
m1 = #1 && #0  // #0
m2 = !#1       // #0
```

> `==` asla zorlamaz: `"5" == 5` `#0`'dır. Sıralama zorlar: `"5" > 4` `#1`'dir ve `"४२" > 5` da öyle — 69 yazı sisteminden herhangi birindeki sayısal metin, sayı olarak karşılaştırılır.
> Bir fonksiyon yalnızca kendisine eşittir, asla aynı gövdeye sahip başka bir fonksiyona eşit değildir.

---

## Dizgiler

```zymbol
isim = "Ali"
n = 42
>> "Merhaba " isim " sizde " n " var" ¶ // → Merhaba Ali sizde 42 var
açıklama = "Merhaba {isim}, sizde {n} var"
>> açıklama ¶              // → Merhaba Ali, sizde 42 var
```

```zymbol
s = "Merhaba dünya"
uzunluk = s$#                  // 13
alt = s$[1..7]             // "Merhaba"
içerir = s$? "dünya"          // #1
parçalar = "a,b,c,d"$/ ','    // [a, b, c, d]
değiştir = s$~~["a":"e"]        // "Merhebe dünye"
çizgi = "─" $* 20
```

> `+` yalnızca sayılar içindir. Dizgiler için yan yana koyma veya yerleştirme kullanın.
> `\{` ve `\}` değişmez küme parantezleridir — kaçış simetriktir.

---

## Kontrol Akışı

```zymbol
x = 7
? x > 100 {
    >> "büyük" ¶
} _? x > 0 {
    >> "pozitif" ¶     // → pozitif
} _ {
    >> "negatif" ¶
}
```

Burada iki yeni işaret var ve üçüncüsü onları bir araya getirmekten geliyor:

- `?` **sormaktır**: bir koşul açar.
- `_` **belirtilmeyen şeydir**: hiçbir soru eşleşmediğinde kalan dal.
- `_?` ikisi arka arkaya: *hiçbir şey eşleşmediyse, tekrar sor*.

`_?`'nin bu şekilde yazılmasının nedeni budur. Öğrenilecek yeni bir sembol değil — `_`'nin ardından `?` gelir ve iki parçasının sırayla okunduğunda anlamına geldiği şeyi tam olarak ifade eder.

> Süslü parantezler `{ }` tek bir ifade için bile **zorunludur**.

---

## Eşleştirme

```zymbol
puan = 85
not = ?? puan {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> not ¶              // → B
```

```zymbol
sıcaklık = -5
durum = ?? sıcaklık {
    < 0  => "buz"
    < 20 => "soğuk"
    _    => "sıcak"
}
>> durum ¶              // → buz
```

`?`'nin "sormak" olduğunu zaten biliyorsunuz. **`??` defalarca sormaktır**: bir işareti ikiye katlamak, dilin herhangi bir yerinde, işaretin bir kez yaptığını birkaç kez yapmaktır. Bir `?` bir koşulu test eder; `??` bir dizi duruma karşı test eder.

Alternatifler `||` ile birleşir ve desen türlerini karıştırabilirler:

```zymbol
tuş = 'P'
eylem = ?? tuş {
    'p' || 'P' => "duraklat"
    < 0 || > 100 => "aralık dışı"
    _ => "yoksayıldı"
}
>> eylem ¶             // → duraklat
```

---

## Döngüler

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
meyveler = ["elma", "armut", "üzüm"]
@ m:meyveler { >> m " " }
>> ¶                    // → elma armut üzüm
@ c:"Merhaba" { >> c "-" }
>> ¶                    // → M-e-r-h-a-b-a-
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
sayac = 0
@:dış {
    sayac++
    ? sayac >= 3 { @:dış! }
}
>> sayac ¶             // → 3
```

`@` **zamanın** işaretidir: tekrarlanan her şey onun içinde yaşar. Bu zamanı kesmek için yanına bir işaret eklersiniz:

- `@!` — `!` **kuvvettir**: döngüyü şimdi terk et.
- `@>` — `>` ileri iter: sonraki tura geç.
- `@:dış!` — `:` **bir isim bağlar**, bu nedenle bu, *dış* adlı döngüyü keser, en yakın olanı değil.

Üç operatör ve hiçbirinin ayrıca ezberlenmesi gerekmedi: bunlar `@` artı ne yaptığını zaten söyleyen bir işarettir.

> **Bir belirteç bir sayı veya koşuldur.** Bir `Tam sayı` bir sayıdır, bir kez değerlendirilir — `@ 0` gövdeyi sıfır kez çalıştırır. Diğer her şey bir koşuldur. Doğruluk yoktur: `@ []` ve `@ 3.5` reddedilir. Bir koleksiyonu dolaşmak için `@ x:öğeler` kullanın; saymak için `@ öğeler$#`.

---

## Fonksiyonlar

```zymbol
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶        // → 7
```

```zymbol
faktöriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktöriyel(n - 1)
}
>> faktöriyel(5) ¶       // → 120
```

Bir fonksiyon, dosyanın değişkenlerini değerle okur ve içerideki yazma işlemi içeride kalır:

```zymbol
sınır = 100
içinde(n) { <~ n < sınır }
>> içinde(42) ¶         // → #1
```

İki işaret bunu değiştirir ve her ikisi de **imzada ve çağrı sitesinde** yazılır:

```zymbol
arttır(sayaç<~) { sayaç = sayaç + 1 }
toplam = 0
arttır(toplam<~)
>> toplam ¶              // → 1
```

> `p~` bir çalışma kopyasıdır — gövde onu yeniden atayabilir ve çağıran etkilenmez.
> `p<~` bir çıktı parametresidir — değişiklik geri gider. İşaretsiz `arttır(toplam)` anlamsal bir hatadır: ek açıklama ve imza ayrılamaz.

---

## Lambda'lar ve Kapanışlar

```zymbol
iki_kat = x -> x * 2
topla = (a, b) -> a + b
>> iki_kat(5) ¶          // → 10
>> topla(3, 7) ¶          // → 10
```

```zymbol
sınıflandır = x -> {
    ? x > 0 { <~ "pozitif" }
    _? x < 0 { <~ "negatif" }
    <~ "sıfır"
}
>> sınıflandır(-4) ¶         // → negatif
```

```zymbol
çarpan = 3
üç_kat = x -> x * çarpan
>> üç_kat(7) ¶          // → 21
```

```zymbol
toplayıcı_oluştur(n) { <~ x -> x + n }
topla10 = toplayıcı_oluştur(10)
>> topla10(5) ¶           // → 15
```

Bir lambda hiç parametre almayabilir:

```zymbol
cevap = () -> 42
>> cevap() ¶           // → 42
```

> Bir lambda, dosyanın değişkenlerini **oluşturulduğunda** yakalar; adlandırılmış bir fonksiyon onları **çağrıldığında** okur.

---

## Diziler

```zymbol
dizi = [1, 2, 3, 4, 5]
>> dizi[1] ¶       // → 1   indeksleme 1-tabanlıdır
>> dizi[-1] ¶      // → 5   negatif sondan sayar
>> dizi$# ¶        // → 5   uzunluk
```

```zymbol
dizi = [1, 2, 3]
>> (dizi$+ 6) ¶          // → [1, 2, 3, 6]   ekle
>> (dizi$+[2] 99) ¶      // → [1, 99, 2, 3]  2. konuma ekle
>> (dizi$- 3) ¶          // → [1, 2]         ilk oluşumu kaldır
>> (dizi$-[1]) ¶         // → [2, 3]         indeks 1'de kaldır
>> (dizi$[1..2]) ¶       // → [1, 2]         dilim, her iki uç dahil
>> (dizi$? 3) ¶          // → #1             içerir
```

Bunların hepsi `$` ile başlar, bu **koleksiyon** işaretidir ve içinde ne yapıldığını söyleyen bir işaretle devam eder: `#` kaç tane, `+` ekle, `-` kaldır, `?` var mı diye sor. Ve `??`'de olduğu gibi, işareti ikiye katlamak, onu kapsamlı bir şekilde yapmak anlamına gelir: `$?` bir değerin *var olup olmadığını* sorar, `$??` *kaç yerde* olduğunu sorar ve hepsini döndürür.

```zymbol
dizi = [3, 1, 2]
>> (dizi$^+) ¶     // → [1, 2, 3]   artan
>> (dizi$^-) ¶     // → [3, 2, 1]   azalan
```

**Sonuç kuralı.** Bir operatör ve çevredeki kodun onunla ne yaptığı belirler: kullanılırsa, **inşa** eder ve orijinali olduğu gibi bırakır; atılırsa, **değiştirir**.

```zymbol
dizi = [1, 2, 3]
kopya = dizi[2]$~ 99
>> dizi ¶                // → [1, 2, 3]
>> kopya ¶              // → [1, 99, 3]
dizi[2]$~ 99
>> dizi ¶                // → [1, 99, 3]
```

> **`=` asla bir koleksiyona yazmaz.** `dizi[2] = 99` Zymbol'un bir biçimi değildir — `=` bir **İSME** değer verir. Bir koleksiyonun bir kısmını değiştirmek `$~`'dir, her koleksiyonda.

`[…]` tek bir tip içerir ve kontrol edilir; kasıtlı bir karışım `#[…]` ile **bildirilir**:

```zymbol
karışım = #[1, "iki", #1]
>> karışım ¶             // → [1, iki, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Çok Boyutlu İndeksleme

`>` iç içe geçmiş bir yapıda aşağı iner. Bir köşeli parantez grubu, ne kadar derin olursa olsun bir öğeyi adresler.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   satır 2, sütun 3
>> m[-1>-1] ¶      // → 9   son satır, son sütun
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          düz: köşegen
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   yapılandırılmış: köşeler
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` Zymbol'un bir biçimi **değildir**. Zincirleme indeks, hem okuma hem de yazma için reddedilir — her erişim için bir köşeli parantez grubu ve `>` adımlar arasında gider.

---

## Sözlükler

Adlandırılmış alanlara sahip bir demet bir sözlüktür ve v0.0.9'dan itibaren `#(…)` olarak yazılır.

```zymbol
kişi = #(isim: "Ali", yaş: 25)
>> kişi.isim ¶        // → Ali
>> kişi["yaş"] ¶    // → 25
```

```zymbol
kişi = #(isim: "Ali", yaş: 25)
alan = "isim"
>> kişi[alan] ¶     // → Ali
```

Değiştirilebilirdir, anahtarlar eklenebilir ve dolaşılabilir:

```zymbol
stok = #(armut: 4)
stok["elma"]$~ 10
@ k:stok { >> k "=" stok[k] " " }
>> ¶                    // → armut=4 elma=10
```

```zymbol
stok = #(armut: 4, elma: 10)
@ (k, v):stok { >> k ":" v " " }
>> ¶                    // → armut:4 elma:10
```

> `#()` boş sözlüktür, `()` olamazdı — aynı zamanda boş demet olması gerekirdi. Çıplak `(x: 1)` bu mesajla reddedilir: *a dictionary is written `#(…)`* — «bir sözlük `#(…)` olarak yazılır».
> Bir sözlük anahtarla adreslenir, asla konumla değil, bu nedenle `kişi[1]` bir hatadır.

---

## Demetler

Demetler, farklı türlerdeki değerleri tutan **değişmez** sıralı kaplardır.

```zymbol
nokta = (10, 20)
>> nokta[1] ¶           // → 10
veri = (42, "Merhaba", #1, 3.14)
>> veri[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Bir demeti yerinde değiştirmeye çalışmak, operatör ne olursa olsun bir hatadır — değişmezlik, değerin bir özelliğidir, her `$`'nin içinde bir istisna değildir.

---

## Yapıbozum

```zymbol
dizi = [10, 20, 30, 40, 50]
[a, b, c] = dizi
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
dizi = [10, 20, 30, 40, 50]
[ilk, *kalan] = dizi
>> ilk ¶            // → 10
>> kalan ¶              // → [20, 30, 40, 50]
```

```zymbol
nokta = (100, 200)
(px, py) = nokta
>> px " " py ¶          // → 100 200
```

```zymbol
kişi = #(isim: "Ayşe", yaş: 25)
#(isim: n, yaş: y) = kişi
>> n " " y ¶            // → Ayşe 25
```

> Parantez şekli tiplidir: `[…]` bir dizi alır, `(…)` bir demet, `#(…)` bir sözlük. Son isim **kalanı emer**, bu nedenle yapıbozum asla uzunluk nedeniyle başarısız olmaz — `(a, b, c) = (1,2,3,4,5)` `c = (3,4,5)` verir ve hiçbir şey kalmadığında `##_`.

---

## Üst Düzey Fonksiyonlar

```zymbol
sayılar = [1, 2, 3, 4, 5]
>> (sayılar$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (sayılar$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (sayılar$< (0, (birikim, x) -> birikim + x)) ¶ // → 15
```

```zymbol
sayılar = [1, 2, 3, 4, 5, 6]
iki_kat(x) { <~ x * 2 }
büyük(x) { <~ x > 3 }
>> (sayılar$> iki_kat) ¶    // → [2, 4, 6, 8, 10, 12]
>> (sayılar$| büyük) ¶    // → [4, 5, 6]
```

```zymbol
veritabanı = [#(isim: "Carla", yaş: 28), #(isim: "Ayşe", yaş: 25)]
yaşa_göre = veritabanı$^ (a, b -> a.yaş < b.yaş)
>> yaşa_göre[1].isim ¶     // → Ayşe
```

> Adlandırılmış bir fonksiyon, HOF'a **parantezsiz** gider: `sayılar$> iki_kat`. `sayılar$> (iki_kat)` yazmak bir ayrıştırma hatasıdır, çünkü `(` bir lambda açar.

---

## Boru Operatörü

```zymbol
iki_kat = x -> x * 2
topla = (a, b) -> a + b
arttır = x -> x + 1
>> (5 |> iki_kat(_)) ¶    // → 10
>> (10 |> topla(_, 5)) ¶  // → 15
>> (5 |> iki_kat(_) |> arttır(_)) ¶ // → 11
```

---

## Hata Yönetimi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "sıfıra bölme" ¶  // → sıfıra bölme
} :! {
    >> "diğer: " _err ¶
} :> {
    >> "her zaman çalışır" ¶        // → her zaman çalışır
}
```

| Tür | Ne zaman |
|------|---------|
| `##Div` | Sıfıra bölme |
| `##Index` | İndeks sınırların dışında |
| `##Key` | Sözlükte anahtar yok |
| `##Range` | Güvenli tam sayı aralığının dışında |
| `##Type` | Tür uyuşmazlığı |
| `##Parse` | Veri ayrıştırma |
| `##IO` | Dosya / sistem |
| `##Network` | Ağ hataları |
| `##DB` | Veritabanı |
| `##Time` | Var olmayan bir tarih |
| `##_` | Herhangi bir hata (hepsini yakalar) |

`!`, **hata ve kuvvet** işaretidir ve her iki ailede de aynı şekilde okunur: `$!` bir değere hata olup olmadığını sorar; `$!!`, işaret ikiye katlanarak, sormadan yukarı yayar.

> Standart kütüphane başarısızlıkları, durdurmak yerine `$!` ile test ettiğiniz veya `!?` ile yakaladığınız **yumuşak hata değerleri** olarak geri gelir. `$!!` birini çağırana yayar.

---

## Modüller

```zymbol
# hesap {
    #> { topla, PI }

    PI := 3.14159
    topla(a, b) { <~ a + b }
}
```

```zymbol
<# ./hesap => h

>> h::topla(5, 3) ¶
>> h.PI ¶
```

```zymbol
# kütüphanem {
    #> { iç_topla => toplam }

    iç_topla(a, b) { <~ a + b }
}
```

İki modül işareti aynı fikirdir, şimdi dosyalara uygulanmıştır: `#` **bildirim** seviyesidir — bir şeyin *ne olduğu*, değeri değil — ve ok, kodun hangi yöne gittiğini söyler:

```text
<#   ok içeri girer: içe aktar, başka bir dosyadan getir
#>   ok dışarı çıkar: dışa aktar, diğer dosyalara sun
```

Bir yön işareti her zaman işaret ettiği yöne bakan kenarda oturur. Bu, `<~`'nin sola dönmesinin (fonksiyonun dışına) ve `->`'nin sağa girmesinin (lambda'nın gövdesine) aynı nedenidir.

> **Bir modül, ne dışa aktardığını bildirir.** `#>` bloğu zorunludur — atlanması **E014**'tür ve `#> { }`, bir modülün yüzeyinin boş olduğunu söyleme şeklidir. `::` bir fonksiyonu çağırır, `.` bir sabiti okur. Bir modül gövdesinde yalnızca içe aktarmalar, dışa aktarma bloğu, değişmez başlatıcılar ve fonksiyon tanımları görünebilir; yürütülebilir herhangi bir şey **E013**'tür.

---

## Standart Kütüphane

Yerel modüller, diğerleri gibi içe aktarılır:

| Modül | Fonksiyonlar |
|-------|--------------|
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

>> t::width("手番") ¶            // → 4   iki glif, dört sütun
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

gün = T::of(2026, 1, 31)
>> T::format(gün, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(gün, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term`, **görüntü sütunlarını** ölçer, karakterleri değil: CJK ve çoğu emoji 2 sütundur, bu nedenle bir tabloyu `t::width` ile düzenleyin, asla `$#` ile değil.
> `std/time`'da bir an, çağdan itibaren milisaniye cinsindendir. Bir günden az süre, bir günden itibaren takvimdir — bu nedenle bir ay, aynı güne denk gelir, kenetlenmiş. `fark(a, b)` `a - b`'dir, bu nedenle önceki an önce verilirse negatif cevap verir.

---

## Paketler

Bir `.zyp`, çok dosyalı bir programı tek bir taşınabilir dosyada toplar. Bu bir **kaynak** arşividir, ikili değil, bu nedenle `zymbol` ikilisinin çalıştığı her yerde çalışır.

```bash
zymbol package projem/ --script main.zy -o projem.zyp
zymbol run projem.zyp
```

> Arşiv, giriş betiklerini ve ihtiyaç duyduğu motor sürümünü bildiren bir bildirim (`zyp.toml`) içerir. `zymbol run`, onu geçici bir dizine çıkarır ve oradan çalıştırır, böylece kod tek kullanımlıktır, betiğin yazdıkları ise gerçek çalışma dizininize düşer. Oyun alanı ayrıca `.zyp` dosyalarını da yükler.

---

## Sayısal Modlar

Zymbol, sayıları **69 Unicode rakam yazısıyla** yazabilir — Devanagari, Arap-Hint, Tayca, Klingon pIqaD, Matematiksel Kalın, LCD segmentleri ve daha fazlası. Mod, işlem için küreseldir ve çıktıyı etkiler; aritmetik değişmez.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arap-Hint (U+0660–U+0669)
#๐๙#    // Tayca         (U+0E50–U+0E59)
#09#    // ASCII'ye sıfırla
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

Desteklenen herhangi bir yazı sistemindeki rakamlar, kaynakta geçerli değişmezlerdir:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Okuma simetriktir — bir rakam herhangi bir yazı sisteminde anlaşılır:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` her zaman ASCII'dir, bu nedenle `#0`, her yazı sisteminde sıfır rakamından görsel olarak ayrı kalır.
> `#,` ve `#^` de rakamlarını etkin yazı sisteminde yazar ve ayırıcılar onu takip eder — ancak çift asla tersine dönmez: `,` gruplar ve `.` böler, her yazı sisteminde.

---

## Veri Operatörleri

```zymbol
f = ##.42         // Kayan noktaya
i = ###3.7        // Tam sayıya, yuvarlanmış  → 4
t = ##!3.7        // Tam sayıya, kesilmiş  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Bir Kayan nokta, rakam olarak yazdırılır, asla üs olarak değildir ve sondaki `.0`'ı düşürür — `##.42` `42` yazar ve yine de Kayan noktadır, `f#?`'nin gösterdiği gibi.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   güvenli: girdiyi olduğu gibi döndürür
>> ##!'A' ¶        // → 65    bir Karakterin kod noktası
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          2 ondalık basamağa yuvarla
>> #!2|pi| ¶       // → 3.14          2 ondalık basamağa kes
>> #,|1234567| ¶   // → 1,234,567     binlik ayırıcılar
>> #^|12345.678| ¶ // → 1.2345678e4   bilimsel gösterim
```

```zymbol
>> 0x41 ¶        // → A   onaltılık
>> 0b01000001 ¶  // → A   ikili
>> 0o101 ¶       // → A   sekizlik
>> 0d65 ¶        // → A   ondalık
```

> ASCII aralığındaki bir taban değişmezi bir **Karakterdir**: `0d65 == 'A'` `#1`'dir ve `0d65 == 65` `#0`'dır. Dört taban da aynı karakteri heceler.

---

## Kabuk Tümleştirme

```zymbol
bugün = <\ date +%Y-%m-%d \>
>> "Bugün: " bugün
```

```zymbol
çıktı = </"./alt_betik.zy"/>
>> çıktı
```

> `<\ … \>` stdout ve stderr'i yakalar, sondaki yeni satırı kaldırır.
> `>< args` komut satırı argümanlarını bir dizi dizisi olarak yakalar.

---

## Tam Örnek: FizzBuzz

```zymbol
sınıflandır(sayı) {
    ? sayı % 15 == 0 { <~ "FizzBuzz" }
    _? sayı % 3  == 0 { <~ "Fizz" }
    _? sayı % 5  == 0 { <~ "Buzz" }
    <~ sayı
}

@ i:1..20 { >> sınıflandır(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (satır başına bir)
```

---

## İşaretler Nasıl Birleştirilir

Bu kılavuz boyunca aynı şeyi görüyordunuz: **bir operatör ezberlenecek bir çizim değil, bir sıra halinde birden fazla işarettir ve her biri kendi anlamını katar.** Artık hepsini bildiğinize göre, işte tam kalıp.

İlk olarak **hangi dünyada olduğumuz** gelir:

| İşaret | Dünya | Nerede gördün |
|--------|-------|---------------|
| `$` | bir koleksiyon | `$#` `$+` `$?` `$^-` |
| `@` | zaman, tekrarlanan her şey | `@!` `@>` `@~` |
| `#` | bir şeyin *ne olduğu*, değeri değil | `#?` `#(…)` `<#` `#>` |
| `>>` | programdan dışarı | `>>` `>>!` `>>?` |
| `<<` | programa içeri | `<<` `<<\|` `<<\|?` |
| `?` | sormak, taahhüt etmeden | `?` `_?` `??` `$?` |
| `!` | kuvvet veya hata | `@!` `$!` `!?` |

Sonra **orada ne yapıldığı** gelir: `+` ekle, `-` kaldır, `^` sırala, `~` değiştir, `#` say, `|` tek bir birim, `:` isim bağla.

Ve asla başarısız olmayan iki kural:

**Bir işareti ikiye katlamak onu kapsamlı yapar.** `?` bir kez sorar, `??` birçok durumu test eder. `$?` bir değerin var olup olmadığını sorar, `$??` bulunduğu her yeri döndürür. `!` bir hatayı işaretler, `!!` sormadan yayar.

**Mod işareti her zaman sonra gelir.** `?` veya `!` bir şeyin *nasıl* yapıldığını söylemek için göründüğünde — tereddütle veya zorla — operatörün son işaretleridir: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:dış!`. Onlardan sonra asla bir işlem gelmez.

Bundan pratik bir şey çıkar: **hiç görmediğiniz bir kombinasyon, bakmadan önce zaten anlamlıdır.** `$` koleksiyon, `^` sıralama ve `-` ters ise, `$^-` azalan sıralar ve kimsenin size söylemesi gerekmedi.

Tüm envanter bu şekilde çalışmaz ve bunu söylemek, numara yapmaktan daha iyidir. Çoğu operatör temiz bir şekilde ayrışır. Altı tanesi ayrışır ancak parçalarından daha fazlasını ifade eder: `!?` `:!` `:>` `|>` `::` `$++`. Ve on tanesi ezberlenmelidir çünkü hiç ayrışmazlar: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Opak olanları saymak, az olduklarını varsaymak yerine kasıtlıdır: bunlar dilin gerçek ezberleme maliyetidir. Tam referans — envanter, bildirilen eşsesliler ve yeni bir operatörün var olmak için karşılaması gereken kurallar — yorumlayıcı deposunda `SYMBOLS.md`'dedir.

---

## İşaret Referansı

| İşaret | İşlem | İşaret | İşlem |
|--------|-------|--------|-------|
| `=` | değişken | `$#` | uzunluk |
| `:=` | sabit | `$+` | ekle |
| `>>` | çıktı | `$+[i]` | indekse ekle (1-tabanlı) |
| `<<` | girdi | `$-` | değere göre ilkini kaldır |
| `¶` / `\\` | yeni satır | `$--` | değere göre hepsini kaldır |
| `?` | eğer | `$-[i]` | indekste kaldır (1-tabanlı) |
| `_?` | değilse-eğer | `$-[i..j]` | aralığı kaldır (1-tabanlı) |
| `_` | değilse / joker | `$?` | içerir |
| `??` | eşleştirme | `$??` | tüm indeksleri bul (1-tabanlı) |
| `\|\|` | eşleştirme dalında veya-deseni | `$[s..e]` | dilim (1-tabanlı) |
| `@` | döngü | `$>` | haritala |
| `@ N { }` | N kez döngü | `$\|` | filtrele |
| `@!` | kır | `$<` | azalt |
| `@>` | devam et | `$/ ayraç` | dizgiyi böl |
| `@:isim { }` | etiketli döngü | `$++ a b c` | birleştirerek inşa et |
| `@:isim!` | etiketi kır | `$~~[p:r]` | dizgiyi değiştir |
| `@:isim>` | etiketi devam ettir | `$*` | dizgiyi tekrarla |
| `->` | lambda | `dizi[i]$~ v` | TEK güncelleme biçimi |
| `<~` | dönüş / çıktı parametresi | `~` | çalışma kopyası parametresi |
| `dizi[i>j]` | gezinme indeksi | `dizi[p ; q]` | düz çıkarma |
| `$^+` | artan sırala | `$^-` | azalan sırala |
| `$^` | karşılaştırıcıyla sırala | `\|>` | boru |
| `!?` | dene | `:!` | yakala |
| `:>` | sonunda | `$!` | hata mı |
| `$!!` | hatayı yay | `#1` / `#0` | doğru / yanlış |
| `##_` | Birim — yokluk | `[…]` | dizi, tek tip |
| `#[…]` | dizi, bildirilmiş karışım | `#(…)` | sözlük |
| `(…)` | konumsal demet | `#()` | boş sözlük |
| `<#` | içe aktar | `#>` | dışa aktar |
| `#` | modül bildir | `::` | modül çağır |
| `.` | alan / sabit erişimi | `#?` | tip meta verisi |
| `#\|..\|` | sayı ayrıştır | `##.` | Kayan noktaya dönüştür |
| `###` | Tam sayıya dönüştür (yuvarla) | `##!` | Tam sayıya dönüştür (kes) |
| `#.N\|..\|` | yuvarla | `#!N\|..\|` | kes |
| `#,\|..\|` | binlik ayırıcılar | `#^\|..\|` | bilimsel |
| `#d0d9#` | sayısal modu değiştir | `#09#` | ASCII'ye sıfırla |
| `<\ ..\>` | kabuğu çalıştır | `><` | CLI argümanları |
| `\ var` | değişkeni yok et | `°x` / `x°` | sıcak tanım |
| `>>\|` | TUI bloğu (alternatif ekran) | `>>~` | konumlandırılmış çıktı |
| `>>!` | ekranı temizle | `>>?` | terminal boyutunu sorgula |
| `<<\|` | engelleyici tuş vuruşu | `<<\|?` | engelleyici olmayan tuş vuruşu |
| `@~ N` | N milisaniye uyu | `0d` `0x` `0o` `0b` | taban değişmezleri |

---

## Sürüm Değişiklik Günlüğü

### v0.0.9 — Koleksiyonlar Karar Verdi _(Eylül 2026)_

- **Kırılan** Sözlüğün kendi gösterimi var: `#(anahtar: değer)`. Çıplak `(x: 1)` reddedildi ve `#()` boş sözlük — `()` asla olamazdı
- **Kırılan** Dizinli atama kaldırıldı: `dizi[i] = v` ve tüm bileşik biçimler. `=` bir **İSME** değer verir; bir koleksiyonun bir kısmını değiştirmek `$~`'dir
- **Kırılan** Zincirleme indeks `m[i][j]` hem okuma hem yazma için reddedildi — `>` adımlar arasında gider
- **Kırılan** Bir modül ne dışa aktardığını bildirmelidir (**E014**); `#> { }`, bir modülün yüzeyinin boş olduğunu söyleme şeklidir
- **Kırılan** Bir döngü belirteci bir sayı veya koşuldur — doğruluk yok. `@ []` ve `@ 3.5` reddedildi
- **Eklendi** `##_` — Birim değişmezi ve bir programın bir şeyin var olup olmadığını sorma şekli
- **Eklendi** `#[…]` — öğe türlerinin karışımı bildirilmiş bir dizi
- **Eklendi** `#?` dört koleksiyonu ayırt eder: `##]` `##[` `##)` `##(`
- **Eklendi** `std/time` — saat ve sivil takvim, dilimler ve takvim aritmetiği ile
- **Eklendi** Üst düzey `<~>` programın çıkış durumudur
- **Eklendi** `@ (k, v):çiftler` — döngü başlığında bir desen
- **Eklendi** `#|c|` 69 yazı sisteminden herhangi birinde bir rakam okur; `#,` ve `#^` etkin yazı sisteminde rakamlarını yazar
- **Değiştirildi** `Tam sayı` güvenli bir tam sayıdır, ±(2⁵³ − 1), her motorda hatada kapanır
- **Değiştirildi** Adlandırılmış bir fonksiyon, dosyanın değişkenlerini çağrı zamanında değerle okur
- **Değiştirildi** Yalnızca bir isim okuyan bir ifade, sessizce geçmek yerine uyarır
- **Motorlar** 666 derlem dosyasından 660'ı üç motorda aynı fikirde, 0 ayrışıyor

### v0.0.8 — Otomatik Serbest Bırakma, `std/term` ve Paketler _(Ağustos 2026)_

- **Eklendi** Son kullanımda otomatik imha — görünmez; yalnızca tepe belleği düşürür
- **Eklendi** `std/term` — terminal sütunlarında görüntü metrikleri
- **Eklendi** Bir `Karakter` üzerinde `##!` — Unicode kod noktası
- **Eklendi** Eşleştirmede veya-deseni: `'p' || 'P' => …`, her türden alternatifler tek bir dald
- **Eklendi** Zymbol Paketleri (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Eklendi** Çağrı sitesinde `<~>` zorunludur; çağrılan bir çıktı parametresi bildirirse
- **Düzeltildi** Kayıt VM'de modül sistemi eşliği

### v0.0.7 — Yerel Standart Kütüphane _(Temmuz 2026)_

- **Eklendi** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — hepsi yumuşak hata değerleriyle
- **Eklendi** Tipli/doğrulanmış girdi: `<< ##.(5,2) "fiyat: " p`
- **Eklendi** `>>` içinde doğrudan sonek operatörleri — parantez gerekmez
- **Değiştirildi** Hatada kapanan biçimlendirici: yeniden okuyamadığı çıktıyı yazmayı reddeder

### v0.0.6 — İyileştirme ve Bilimsel Stdlib _(Haziran 2026)_

- **Kırılan** `=>`, eşleştirme dallarındaki `:` ve içe/dışa aktarma takma adlarındaki `<=`'nin yerini alır
- **Eklendi** `std/math` ve `std/random`
- **Eklendi** Anahtarla sözlük güncellemesi: `d["k"]$~ değer`

### v0.0.5 — TUI İlkelleri ve Sıcak Tanım _(Mayıs 2026)_

- **Eklendi** TUI bloğu `>>| { }`, konumlandırılmış çıktı `>>~`, tuş girdisi `<<|` ve `<<|?`
- **Eklendi** `>>!` ekranı temizle, `>>?` terminal boyutu, `@~ N` uyu
- **Eklendi** Sıcak tanım `°x` / `x°` ve dizgi tekrarı `$*`

### v0.0.4 — 1-Tabanlı İndeksleme ve Birinci Sınıf Fonksiyonlar _(Nisan 2026)_

- **Kırılan** Tüm indeksleme **1-tabanlıdır** — `dizi[1]` ilk öğedir
- **Eklendi** Adlandırılmış fonksiyonlar birinci sınıf değerler olarak; modül bloğu sözdizimi `# isim { }`
- **Eklendi** Çok boyutlu indeksleme `dizi[i>j>k]` ve düz çıkarma `dizi[p ; q]`

### v0.0.3 — Unicode Sayısal Sistemleri _(Nisan 2026)_

- **Eklendi** 69 Unicode rakam bloğu, mod değiştirme jetonu `#d0d9#` ile
- **Eklendi** Herhangi bir yazı sisteminde boolean değişmezleri — `#१` / `#०`

### v0.0.2 — Koleksiyon API'si Yeniden Tasarımı _(Mart 2026)_

- **Eklendi** Diziler ve dizgiler için `$` operatör ailesi
- **Eklendi** Yapıbozum ataması ve negatif indeksler

### v0.0.1 — İlk Genel Sürüm _(Mart 2026)_

- Ağaç yürüyücü yorumlayıcı + kayıt VM (`--vm`)
- Tüm temel yapılar: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tam Unicode tanımlayıcılar, modül sistemi, lambdalar, kapanışlar, hata yönetimi
- REPL, LSP, VS Code uzantısı, biçimlendirici (`zymbol fmt`)

---

_Zymbol-Lang — Sembolik. Evrensel. Değişmez._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lisans:** Bu kılavuz, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) lisansı altında lisanslanmıştır — © 2024-2026 Zymbol-Lang Ekibi. Tam metin: `LICENSE-CC-BY-SA-4.0` <https://github.com/zymbol-lang/web> adresinde. Yorumlayıcı ve tarayıcı motoru (`zymbol.js`) ayrı çalışmalardır ve AGPL-3.0-only lisansı altında lisanslanmıştır.
