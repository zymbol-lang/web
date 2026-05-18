> **Uyarı:** Bu belge yapay zeka (YZ) tarafından oluşturulmuş ve çevrilmiştir.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Kılavuzu

> **v0.0.5 için gözden geçirildi — 2026-05-12**

**Zymbol-Lang** sembolik bir programlama dilidir. Anahtar kelime yoktur — her şey semboldür. Herhangi bir insan dilinde aynı şekilde çalışır.

- `if`, `while`, `return` yok — yalnızca `?`, `@`, `<~`
- Tam Unicode — herhangi bir dil veya emoji ile tanımlayıcılar
- İnsan dilinden bağımsız — kod her yerde aynıdır

**Yorumlayıcı sürümü**: v0.0.5 | **Test kapsamı**: 436/436 (TW ↔ VM eşliği)

---

## Değişkenler ve Sabitler

```zymbol
x = 10              // değişken
PI := 3.14159       // sabit — yeniden atama çalışma zamanı hatasıdır
isim = "Alice"
aktif = #1          // mantıksal doğru
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
x++        // 5
x--        // 4
```

`°` (derece işareti, U+00B0) bir değişkeni ilk kullanımda otomatik olarak tarafsız değerine başlatır:

```zymbol
sayilar = [3, 1, 4, 1, 5]
@ n:sayilar {
    °toplam += n    // döngünün üstünde 0'a otomatik başlatma; @ sonra kalır
}
>> toplam ¶         // → 14
```

> `°x` (önek) döngünün üstüne sabitlenir — sonuç `@`'dan sonra erişilebilir.
> `x°` (sonek) döngünün içine sabitlenir — döngü bittiğinde yok olur.
> Yalnızca ağaç-yürüyücü.

---

## Veri Türleri

| Tür | Değişmez | `#?` etiketi | Notlar |
|-----|---------|--------------|--------|
| Tamsayı | `42`, `-7` | `###` | 64-bit işaretli |
| Ondalık | `3.14`, `1.5e10` | `##.` | Bilimsel gösterim kabul edilir |
| Dize | `"metin"` | `##"` | İnterpolasyon: `"Merhaba {isim}"` |
| Karakter | `'A'` | `##'` | Tek Unicode karakteri |
| Mantıksal | `#1`, `#0` | `##?` | Sayı DEĞİL — `#1 ≠ 1` |
| Dizi | `[1, 2, 3]` | `##]` | Homojen öğeler |
| Demet | `(a, b)` | `##)` | Konumsal |
| Adlandırılmış Demet | `(x: 1, y: 2)` | `##)` | Adlandırılmış alanlar |
| Fonksiyon | adlandırılmış fonksiyon referansı | `##()` | Birinci sınıf; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Birinci sınıf; `<lambd/N>` |

```zymbol
// Tür iç gözlemi — (tür, basamak, değer) döndürür
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Çıktı ve Girdi

```zymbol
>> "Merhaba" ¶                    // ¶ veya \\ açık yeni satır için
>> "a=" a " b=" b ¶               // birleştirme — birden fazla değer
>> (dizi$#) ¶                     // postfix operatörler >> içinde () gerektirir

<< isim                           // değişkene oku (bilgi istemi olmadan)
<< "İsim girin: " isim            // bilgi istemiyle
```

> `¶` (İspanyolca klavyede AltGr+R) ve `\\` eşdeğer yeni satırlardır.

---

## TUI Temel Öğeleri

İnteraktif programlar için terminal UI operatörleri. Çoğu `>>| { }` bloğu gerektirir (alt ekran + ham mod).

```zymbol
>>| {
    >>!                             // alt ekranı temizle
    >>~ (1, 1, 0, 10) > "Çalışıyor"  // satır 1, sütun 1, ön plan=10 (yeşil)
    @~ 1000                         // 1 saniye dur (1000 ms)
    >>~ (2, 1) > "Tamamlandı."
}
// terminal çıkışta otomatik geri yüklenir
```

```zymbol
// Tuş basımı ve terminal boyutu
>>| {
    [satirlar, sutunlar] = >>?        // terminal boyutlarını sorgula
    >>~ (1, 1) > "Terminal: " satirlar " x " sutunlar
    <<| tus                           // engelleyen tuş okuma
    >>~ (2, 1) > "Basıldı: " tus
}
```

> `>>!` ekranı temizler. `>>?` `[satirlar, sutunlar]` döndürür. `@~ N` N milisaniye bekler.
> `<<|` bir tuş basımını okur (engelleyen); `<<|?` engellemeden yoklar (yoksa `'\0'` döndürür).
> Konumsal çıktı demeti: `(satir, sutun, BKS, ön, arka)` — herhangi bir slot virgülle atlanabilir (`>>~ (,,, 196) > "kırmızı"`).
> BKS bitmask: `1`=Kalın, `2`=İtalik, `4`=Altı çizili. ANSI 256-renk paleti (`0`=terminal varsayılanı).
> Yalnızca ağaç-yürüyücü (`>>!`, `>>?`, `@~`, `>>~` ayrıca `--vm`'de çalışır).

---

## Operatörler

```zymbol
// Aritmetik
a = 10
b = 3
s1 = a + b    // 13
s2 = a - b    // 7
s3 = a * b    // 30
s4 = a / b    // 3  (tamsayı bölmesi)
s5 = a % b    // 1
s6 = a ^ b    // 1000  (üs alma)

// Karşılaştırma — incelemek için değişkene ata
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a <= b    // #0
k5 = a > b     // #1
k6 = a >= b    // #1

// Mantıksal
m1 = #1 && #0    // #0
m2 = #1 || #0    // #1
m3 = !#1         // #0
```

---

## Dizeler

```zymbol
// İki birleştirme formu
isim = "Alice"
n = 42

>> "Merhaba " isim " " n " biriminiz var" ¶    // birleştirme — >> içinde
aciklama = "Merhaba {isim}, {n} biriminiz var"  // interpolasyon — her yerde
```

```zymbol
s = "Merhaba Dunya"
uzunluk = s$#                  // 13
alt = s$[1..7]                 // "Merhaba"  (1-tabanlı, son dahil)
var_mi = s$? "Dunya"           // #1
parcalar = "a,b,c,d"$/ ','     // [a, b, c, d]  (sınırlayıcıya göre böl)
degis = s$~~["a":"A"]          // "MerhAbA DunyA"
degis1 = s$~~["a":"A":1]       // "MerhAba Dunya"  (yalnızca ilk N)
cizgi = "─" $* 20              // "────────────────────"  (N kez tekrarla)
```

> `+` yalnızca sayılar içindir. Dizeler için `,`, birleştirme veya interpolasyon kullanın.

---

## Akış Kontrolü

```zymbol
x = 7

? x > 0 { >> "pozitif" ¶ }

? x > 100 {
    >> "büyük" ¶
} _? x > 0 {
    >> "pozitif" ¶
} _? x == 0 {
    >> "sıfır" ¶
} _ {
    >> "negatif" ¶
}
```

> `{ }` parantezleri tek bir ifade için bile **gereklidir**.

---

## Eşleştirme

```zymbol
// Aralıklar
puan = 85
not = ?? puan {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> not ¶    // → B

// Dizeler
renk = "kirmizi"
kod = ?? renk {
    "kirmizi" => "#FF0000"
    "yesil"   => "#00FF00"
    _         => "#000000"
}

// Karşılaştırma örüntüleri
sicaklik = -5
durum = ?? sicaklik {
    < 0  => "buz"
    < 20 => "soguk"
    < 35 => "ilik"
    _    => "sicak"
}
>> durum ¶    // → buz

// İfade formu (blok kolları)
n = -3
?? n {
    0    => { >> "sıfır" ¶ }
    < 0  => { >> "negatif" ¶ }
    _    => { >> "pozitif" ¶ }
}
```

---

## Döngüler

```zymbol
@ i:0..4  { >> i " " }        // kapsayıcı aralık:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // adımla:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ters:                5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

meyveler = ["elma", "armut", "uzum"]
@ m:meyveler { >> m ¶ }       // dizi üzerinde

@ c:"merhaba" { >> c "-" }
>> ¶                          // → m-e-r-h-a-b-a-  (dize üzerinde)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> devam et
    ? i > 7 { @! }             // @! çık
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Sonsuz döngü
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Etiketli döngü (iç içe çıkış)
sayac = 0
@:dis {
    sayac++
    ? sayac >= 3 { @:dis! }
}
>> sayac ¶                    // → 3
```

---

## Fonksiyonlar

```zymbol
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶    // → 7

faktoriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyel(n - 1)
}
>> faktoriyel(5) ¶    // → 120
```

Fonksiyonların **yalıtılmış kapsamı** vardır — dış değişkenleri okuyamazlar. Çağıran değişkenlerini değiştirmek için çıktı parametreleri `<~` kullanın:

```zymbol
degistir(a<~, b<~) {
    gecici = a
    a = b
    b = gecici
}
x = 10
y = 20
degistir(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Adlandırılmış fonksiyonlar **birinci sınıf değerlerdir** — doğrudan geçirin: `sayilar$> ikile`. Sarmalamak için: `x -> fn(x)` da geçerlidir.

---

## Lambdalar ve Kapanışlar

```zymbol
ikile = x -> x * 2
topla = (a, b) -> a + b
>> ikile(5) ¶    // → 10
>> topla(3, 7) ¶    // → 10

// Blok lambda
siniflandir = x -> {
    ? x > 0 { <~ "pozitif" }
    _? x < 0 { <~ "negatif" }
    <~ "sıfır"
}

// Kapanış — dış kapsamı yakalar
carpan = 3
ucle = x -> x * carpan
>> ucle(7) ¶    // → 21

// Fabrika
toplayici_olustur(n) { <~ x -> x + n }
topla10 = toplayici_olustur(10)
>> topla10(5) ¶    // → 15

// Dizide
islemler = [x -> x+1, x -> x*2, x -> x*x]
>> islemler[3](5) ¶    // → 25
```

---

## Diziler

Diziler **değiştirilebilir** ve **aynı türde** öğeler tutar.

```zymbol
dizi = [1, 2, 3, 4, 5]

x = dizi[1]      // 1 — erişim (1-tabanlı: ilk öğe)
x = dizi[-1]     // 5 — negatif indeks (son öğe)
x = dizi$#       // 5 — uzunluk (>>-de (dizi$#) kullan)

dizi = dizi$+ 6            // ekle → [1,2,3,4,5,6]
dizi2 = dizi$+[2] 99       // 2. konuma ekle (1-tabanlı)
dizi3 = dizi$- 3           // değerin ilk oluşumunu kaldır
dizi4 = dizi$-- 3          // tüm oluşumları kaldır
dizi5 = dizi$-[1]          // 1. indekste kaldır (ilk öğe)
dizi6 = dizi$-[2..3]       // aralığı kaldır (1-tabanlı, son dahil)

var_mi = dizi$? 3          // #1 — içeriyor
konum = dizi$?? 3          // [3] — değerin tüm indeksleri (1-tabanlı)
dilim = dizi$[1..3]        // [1,2,3] — dilim (1-tabanlı, son dahil)
dilim2 = dizi$[1:3]        // [1,2,3] — aynısı, sayım-tabanlı sözdizimi

artan = dizi$^+            // artan sıralanmış (yalnızca ilkel)
azalan = dizi$^-           // azalan sıralanmış (yalnızca ilkel)

// Adlandırılmış/konumsal demet dizileri — karşılaştırıcı lambda ile $^ kullan
vt = [(ad: "Carla", yas: 28), (ad: "Ana", yas: 25), (ad: "Bob", yas: 30)]
yasa_gore  = vt$^ (a, b -> a.yas < b.yas)    // yaşa göre artan  (<)
ada_gore = vt$^ (a, b -> a.ad > b.ad)         // ada göre azalan (>)
>> yasa_gore[1].ad ¶     // → Ana
>> ada_gore[1].ad ¶    // → Carla

// Doğrudan öğe güncellemesi (yalnızca diziler)
dizi[1] = 99              // ata
dizi[2] += 5              // bileşik: +=  -=  *=  /=  %=  ^=

// Fonksiyonel güncelleme — yeni dizi döndürür; orijinal değişmez
dizi2 = dizi[2]$~ 99
```

> Tüm koleksiyon operatörleri **yeni dizi** döndürür. Geri atayın: `dizi = dizi$+ 4`.
> `$+` zincirlenebilir: `dizi = dizi$+ 5$+ 6$+ 7`. Diğer operatörler ara atamalar kullanır.
> **İndeksleme 1-tabanlıdır**: `dizi[1]` ilk öğedir; `dizi[0]` çalışma zamanı hatasıdır.
> `$^+` / `$^-` **ilkel dizileri** (sayılar, dizeler) sıralar. Demet dizileri için karşılaştırıcı lambda ile `$^` kullanın.

**Değer semantiği** — bir diziyi başka bir değişkene atamak bağımsız kopya oluşturur:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b etkilenmedi
```

```zymbol
// İç içe diziler (1-tabanlı indeksleme)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (satır 2, sütun 3)
```

---

## Yıkım

```zymbol
// Dizi
dizi = [10, 20, 30, 40, 50]
[a, b, c] = dizi              // a=10  b=20  c=30
[ilk, *kalan] = dizi          // ilk=10  kalan=[20,30,40,50]
[x, _, z] = [1, 2, 3]         // _ atar

// Konumsal demet
nokta = (100, 200)
(nx, ny) = nokta              // nx=100  ny=200

// Adlandırılmış demet
kisi = (ad: "Ana", yas: 25, sehir: "Madrid")
(ad: n, yas: a) = kisi        // n="Ana"  a=25
```

---

## Demetler

Demetler **değiştirilemez** sıralı kaplardır, **farklı türlerde** değerler tutabilir.
Dizilerin aksine, öğeler oluşturulduktan sonra değiştirilemez.

```zymbol
// Konumsal — karışık türlere izin verilir
nokta = (10, 20)
>> nokta[1] ¶    // → 10

veri = (42, "merhaba", #1, 3.14)
>> veri[3] ¶     // → #1

// Adlandırılmış
kisi = (ad: "Alice", yas: 25)
>> kisi.ad ¶    // → Alice
>> kisi[1] ¶      // → Alice  (indeks de çalışır, 1-tabanlı)

// İç içe
konum = (x: 10, y: 20)
p = (konum: konum, etiket: "orijin")
>> p.konum.x ¶        // → 10
```

**Değiştirilemezlik** — bir demet öğesini değiştirme girişimi çalışma zamanı hatasıdır:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ çalışma zamanı hatası: demetler değiştirilemez
// t[1] += 5    // ❌ aynı hata
```

Değiştirilmiş bir değer elde etmek için `$~` (fonksiyonel güncelleme) kullanın — **yeni** demet döndürür:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orijinal değişmedi
>> t2 ¶    // → (10, 999, 30)

// Adlandırılmış demet — açıkça yeniden oluştur
kisi = (ad: "Alice", yas: 25)
yasli  = (ad: kisi.ad, yas: 26)
>> kisi.yas ¶    // → 25
>> yasli.yas ¶     // → 26
```

---

## Yüksek Dereceli Fonksiyonlar

```zymbol
sayilar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ikikatlanmis  = sayilar$> (x -> x * 2)                // map  → [2,4,6…20]
ciftler       = sayilar$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
toplam        = sayilar$< (0, (bir, x) -> bir + x)     // reduce → 55

// Ara değişkenler aracılığıyla zincir
adim1 = sayilar$| (x -> x > 3)
adim2 = adim1$> (x -> x * x)
>> adim2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Adlandırılmış fonksiyonlar doğrudan YDF'ye geçirilebilir
ikile(x) { <~ x * 2 }
buyuk_mu(x) { <~ x > 5 }
r = sayilar$> ikile       // ✅ doğrudan referans
r = sayilar$| buyuk_mu     // ✅ doğrudan referans
```

---

## Boru Operatörü

Sağ taraf her zaman borulanan değer için `_` yer tutucusu gerektirir:

```zymbol
ikile = x -> x * 2
topla = (a, b) -> a + b
artir = x -> x + 1

s1 = 5 |> ikile(_)        // → 10
s2 = 10 |> topla(_, 5)    // → 15
s3 = 5 |> topla(2, _)     // → 7

// Zincirlenmiş
s = 5 |> ikile(_) |> artir(_) |> ikile(_)
>> s ¶    // → 22  (5→10→11→22)
```

---

## Hata İşleme

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "sıfıra bölme" ¶
} :! {
    >> "diğer: " _err ¶    // _err hata mesajını tutar
} :> {
    >> "her zaman çalışır" ¶
}
```

| Tür | Ne zaman |
|-----|---------|
| `##Div` | Sıfıra bölme |
| `##IO` | Dosya / sistem |
| `##Index` | İndeks sınır dışı |
| `##Type` | Tür uyuşmazlığı |
| `##Parse` | Veri ayrıştırma |
| `##Network` | Ağ hataları |
| `##_` | Herhangi bir hata (hepsini yakala) |

---

## Modüller

```zymbol
// lib/hesap.zy — modül gövdesi küme parantezi içine alınır
# hesap {
    #> { topla, PI_al }

    _PI := 3.14159
    topla(a, b) { <~ a + b }
    PI_al() { <~ _PI }
}
```

```zymbol
// ana.zy
<# ./lib/hesap => h    // takma ad gereklidir

>> h::topla(5, 3) ¶     // → 8
pi = h::PI_al()
>> pi ¶               // → 3.14159
```

```zymbol
// Farklı genel adla dışa aktar
# kutuphanem {
    #> { _ic_topla => toplam }

    _ic_topla(a, b) { <~ a + b }
}
```

```zymbol
<# ./kutuphanem => k

>> k::toplam(3, 4) ¶    // → 7  (dahili ad _ic_topla gizlenmiştir)
```

> **Modül kuralları**: yalnızca `#>`, fonksiyon tanımları ve değişmez değişken/sabit başlatıcılar `# ad { }` içinde izinlidir. Çalıştırılabilir ifadeler (`>>`, `<<`, döngüler, vb.) E013 hatasına yol açar.

---

## Sayı Modları

Zymbol sayıları **69 Unicode rakam sisteminde** görüntüleyebilir — Devanagari, Arap-Hint, Tay, Klingon pIqaD, Matematiksel Kalın, LCD bölümleri ve daha fazlası. Etkin mod yalnızca `>>` çıktısını etkiler; dahili aritmetik her zaman ikili sistemdedir.

### Bir komut dosyasını etkinleştirmek

Hedef sistemin `0` ve `9` rakamını `#…#` içine yazın:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arap-Hint (U+0660–U+0669)
#๐๙#    // Tay         (U+0E50–U+0E59)
#09#    // ASCII'ye sıfırla
```

### Çıktı ve mantıksal değerler

```zymbol
x = 42
>> x ¶          // → 42   (ASCII varsayılan)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ondalık nokta her zaman ASCII)
>> 1 + 2 ¶      // → ३

// Mantıksal: # öneki her zaman ASCII, rakam uyum sağlar
>> #1 ¶         // → #१   (Devanagari'de doğru)
>> #0 ¶         // → #०   (yanlış — ० tamsayı sıfırdan farklıdır)

x = 28 > 4
>> x ¶          // → #१   (karşılaştırma sonucu etkin modu izler)
```

### Kaynakta yerel rakam değişmezleri

Desteklenen herhangi bir sistemin rakamları geçerli değişmezlerdir — aralıklar, modül, karşılaştırmalarda:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Herhangi bir komut dosyasında mantıksal değişmezler

Herhangi bir bloktan `#` + `0` veya `1` rakamı geçerli mantıksal değişmezdir:

```zymbol
#٠٩#
aktif = #١        // #1 ile aynı
>> aktif ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **her zaman ASCII**'dir. `#0` (yanlış) her sistemde `0` (tamsayı sıfır) ile görsel olarak farklıdır.

---

## Veri Operatörleri

```zymbol
// Tür dönüştürme
f = ##.42         // → 42.0  (Ondalığa)
i = ###3.7        // → 4     (Tamsayıya, yuvarla)
t = ##!3.7        // → 3     (Tamsayıya, kes)

// Dizeyi sayıya ayrıştır
d1 = #|"42"|      // → 42  (Tamsayı)
d2 = #|"3.14"|    // → 3.14  (Ondalık)
d3 = #|"abc"|     // → "abc"  (hata güvenli, hata yok)

// Yuvarla / kes
pi = 3.14159265
y2 = #.2|pi|      // → 3.14  (2 ondalık basamağa yuvarla)
y4 = #.4|pi|      // → 3.1416
k2 = #!2|pi|      // → 3.14  (kes)

// Sayı biçimlendirme
bic = #,|1234567|  // → 1,234,567  (virgülle ayrılmış)
bil = #^|12345.678|    // → 1.2345678e4  (bilimsel)

// Taban değişmezleri
a = 0x41         // → 'A'  (onaltılık)
b = 0b01000001   // → 'A'  (ikili)
c = 0o101        // → 'A'  (sekizli)

// Taban dönüştürme çıktısı
onalti = 0x|255|    // → "0x00FF"
iki = 0b|65|        // → "0b1000001"
sekiz = 0o|8|       // → "0o10"
on = 0d|255|        // → "0d0255"
```

---

## Shell Entegrasyonu

```zymbol
tarih = <\ date +%Y-%m-%d \>     // stdout'u yakalar (\n dahil)
>> "Bugün: " tarih

dosya = "data.txt"
icerik = <\ cat {dosya} \>       // komutlarda interpolasyon

cikti = </"./altbetik.zy"/>      // başka Zymbol betiği çalıştır, çıktıyı yakala
>> cikti
```

> `><` CLI bağımsız değişkenlerini dize dizisi olarak yakalar (yalnızca ağaç-yürüyücü).

---

## Tam Örnek: FizzBuzz

```zymbol
siniflandir(sayi) {
    ? sayi % 15 == 0 { <~ "FizzBuzz" }
    _? sayi % 3  == 0 { <~ "Fizz" }
    _? sayi % 5  == 0 { <~ "Buzz" }
    _ { <~ sayi }
}

@ i:1..20 { >> siniflandir(i) ¶ }
```

---

## Sembol Başvurusu

| Sembol | İşlem | Sembol | İşlem |
|--------|-------|--------|-------|
| `=` | değişken | `$#` | uzunluk |
| `:=` | sabit | `$+` | ekle (zincirlenebilir) |
| `>>` | çıktı | `$+[i]` | indekse ekle (1-tabanlı) |
| `<<` | girdi | `$-` | değere göre ilkini kaldır |
| `¶` / `\\` | yeni satır | `$--` | değere göre hepsini kaldır |
| `?` | eğer | `$-[i]` | indekste kaldır (1-tabanlı) |
| `_?` | değilse-eğer | `$-[i..j]` | aralığı kaldır (1-tabanlı) |
| `_` | değilse / joker | `$?` | içeriyor mu |
| `??` | eşleştir | `$??` | tüm indeksleri bul (1-tabanlı) |
| `@` | döngü | `$[s..e]` | dilim (1-tabanlı) |
| `@ N { }` | N kez döngü | `$>` | map |
| `@!` | çık | `$\|` | filter |
| `@>` | devam et | `$<` | reduce |
| `@:ad { }` | etiketli döngü | `$/ ayırıcı` | dizeyi böl |
| `@:ad!` | etiketten çık | `$++ a b c` | birleştirme oluştur |
| `@:ad>` | etikette devam | `dizi[i>j>k]` | gezinme indeksi |
| `->` | lambda | `dizi[i] = değ` | öğe güncelle (yalnızca diziler) |
| `dizi[i] += değ` | bileşik güncelleme | `dizi[i]$~` | fonksiyonel güncelleme (yeni kopya) |
| `$^+` | artan sırala (ilkel) | `$^-` | azalan sırala (ilkel) |
| `$^` | karşılaştırıcı ile sırala (demet) | `<~` | döndür |
| `\|>` | boru | `!?` | dene |
| `:!` | yakala | `:>` | her zaman |
| `#1` | doğru | `#0` | yanlış |
| `$!` | hata mı | `$!!` | hatayı yay |
| `<#` | içe aktar | `#>` | dışa aktar |
| `#` | modül bildir | `::` | modül çağrısı |
| `.` | alan erişimi | `#?` | tür meta verisi |
| `#\|..\|` | sayıyı ayrıştır | `##.` | Ondalığa dönüştür |
| `###` | Tamsayıya dönüştür (yuvarla) | `##!` | Tamsayıya dönüştür (kes) |
| `#.N\|..\|` | yuvarla | `#!N\|..\|` | kes |
| `#,\|..\|` | virgüllü biçim | `#^\|..\|` | bilimsel |
| `#r0r9#` | sayı modu değiştir | `#09#` | ASCII'ye sıfırla |
| `<\ ..\>` | shell çalıştır | `>\<` | CLI bağımsız değişkenleri |
| `\ değ` | değişkeni yok et | `°x` / `x°` | otomatik başlatma |
| `>>|` | TUI bloğu (alt ekran) | `>>~` | konumlu çıktı |
| `>>!` | ekranı temizle | `>>?` | terminal boyutunu sorgula |
| `<<\|` | engelleyen tuş | `<<\|?` | engellemesiz tuş |
| `@~ N` | N milisaniye bekle | `$*` | dizeyi N kez tekrarla |

---

## Sürüm Değişiklik Günlüğü

### v0.0.5 — TUI Temel Öğeleri, Otomatik Başlatma ve Dize Tekrarı _(Mayıs 2026)_

- **Değişen** Eşleştirme kolu ayırıcısı: `örüntü : sonuç` → `örüntü => sonuç`
- **Değişen** İçe aktarma takma adı: `<# yol <= takma` → `<# yol => takma`
- **Değişen** Dışa aktarma yeniden adlandırma: `#> { fn <= genel }` → `#> { fn => genel }`
- **Eklendi** TUI bloğu `>>| { }` — alt ekran + ham mod; çıkışta temizlenir
- **Eklendi** Konumlu çıktı `>>~ (satir, sutun, BKS, ön, arka) > öğeler`
- **Eklendi** Tuş girişi `<<| değ` (engelleyen) ve `<<|? değ` (engellemesiz yoklama)
- **Eklendi** `>>!` ekranı temizle, `>>?` terminal boyutunu sorgula, `@~ N` bekle
- **Eklendi** Otomatik başlatma `°x` / `x°` — döngülerde değişkeni otomatik başlat
- **Eklendi** Dize tekrarı `dize $* N` — bir dizeyi N kez tekrarla
- **VM** Eşlik: 436/436 test geçti

### v0.0.4 — 1-Tabanlı İndeksleme, Birinci Sınıf Fonksiyonlar ve Modül Blokları _(Nisan 2026)_

- **Değişen** Tüm indeksleme **1-tabanlıya** geçti — `dizi[1]` ilk öğedir; `dizi[0]` çalışma zamanı hatasıdır
- **Eklendi** Adlandırılmış fonksiyonlar **birinci sınıf değerlerdir** — YDF'ye doğrudan geçir: `sayilar$> ikile`
- **Eklendi** Modül **blok sözdizimi** gerekli: `# ad { ... }` — düz sözdizimi kaldırıldı
- **Eklendi** Çok boyutlu indeksleme: `dizi[i>j>k]` (gezinme), `dizi[p ; q]` (düz çıkarma)
- **Eklendi** Tür dönüştürme: `##.ifade` (Ondalık), `###ifade` (Tamsayı yuvarla), `##!ifade` (Tamsayı kes)
- **Eklendi** Dize bölme: `dize$/ ayırıcı` — `Dizi(Dize)` döndürür
- **Eklendi** Birleştirme oluşturma: `taban$++ a b c` — birden fazla öğe ekler
- **Eklendi** N kez döngü: `@ N { }` — tam N kez tekrarla
- **Eklendi** Etiketli döngü sözdizimi: `@:ad { }`, `@:ad!`, `@:ad>`
- **Eklendi** Değişken kapsam kuralları: `_ad` değişkenleri blok kapsamına sahip; `\ değ` erken yok eder
- **Eklendi** Eşleştirme karşılaştırma örüntüleri: `< 0`, `> 5`, `== 42` vb.
- **Eklendi** Modül E013 hatası: modül gövdesindeki çalıştırılabilir ifadeler yasaktır
- **Düzeltildi** `take_variable` artık geri yazmada modül sabitlerini bozmaz
- **Düzeltildi** `takma.SABİT` artık doğru çözülür
- **VM** Tam eşlik: 393/393 test geçti

### v0.0.3 — Unicode Sayı Sistemleri ve LSP İyileştirmeleri _(Nisan 2026)_

- **Eklendi** 69 Unicode rakam bloğu ve `#r0r9#` mod değiştirme tokeni
- **Eklendi** Herhangi bir sistemde mantıksal değişmezler — `#१` / `#०`, `#١` / `#٠` vb.
- **Eklendi** Klingon pIqaD rakamları (CSUR PUA U+F8F0–U+F8F9)
- **Eklendi** `SetNumeralMode` VM opkodu — ağaç-yürüyücü ile tam eşlik
- **Eklendi** REPL etkin sayı modunu yansıtır
- **Değişti** Mantıksal `>>` çıktısı artık `#` önekini içerir (`#0` / `#1`)

### v0.0.2_01 — Operatör Yeniden Adlandırma _(30 Mar 2026)_

- **Değişti** `c|..|` → `#,|..|` ve `e|..|` → `#^|..|`
- **Eklendi** Dışa aktarma takma adı

### v0.0.2 — Koleksiyon API'si Yeniden Tasarımı ve Yükleyiciler _(24 Mar 2026)_

- **Eklendi** Diziler ve dizeler için birleşik `$` operatör ailesi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Eklendi** Diziler, demetler ve adlandırılmış demetler için yıkım ataması
- **Eklendi** Negatif indeksler (`dizi[-1]` = son öğe)
- **Eklendi** Yerel yükleyiciler — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Eklendi** Bileşik atama `^=`
- **Düzeltildi** Ayrıştırıcı aritmetik uç durumları

### v0.0.1 — İlk Genel Sürüm _(22 Mar 2026)_

- Ağaç-yürüyücü yorumlayıcı + yazmaç VM'i (`--vm`, ~4× daha hızlı, ~%95 eşlik)
- Tüm temel yapılar: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tam Unicode tanımlayıcılar, modül sistemi, lambdalar, kapanışlar, hata işleme
- REPL, LSP, VS Code uzantısı, biçimlendirici (`zymbol fmt`)

---

_Zymbol-Lang — Sembolik. Evrensel. Değiştirilemez._
