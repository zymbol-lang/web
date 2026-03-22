# Zymbol-Lang Kompakt Kılavuzu

**Zymbol-Lang** sembolik bir programlama dilidir. Hiç anahtar kelime kullanmaz — her şey bir semboldür. Her insan dilinde aynı şekilde çalışır.

---

## Felsefe

- Anahtar kelime yok (`if`, `while`, `return` diye bir şey yok — yalnızca semboller `?`, `@`, `<~`)
- Tam Unicode desteği — herhangi bir dilde veya emoji ile tanımlayıcı 👋
- Dilden bağımsız — kod tüm dillerde özdeştir

---

## Değişkenler ve Sabitler

```zymbol
x = 10           // Değişken (değiştirilebilir)
PI := 3.14159    // Sabit (değiştirilemez — yeniden atama hatası verir)
isim = "Ali"
aktif = #1       // mantıksal doğru
👋 := "Merhaba"
```

### Bileşik Atama

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

## Veri Tipleri

| Tip              | Örnek               | Sembol `#?` | Notlar                               |
|------------------|---------------------|-------------|--------------------------------------|
| Tam Sayı         | `42`, `-7`          | `###`       | 64-bit işaretli                      |
| Ondalıklı Sayı   | `3.14`, `1.5e10`    | `##.`       | Bilimsel gösterim desteklenir        |
| Dizge            | `"merhaba"`         | `##"`       | Enterpolasyon: `"Merhaba {isim}"`   |
| Karakter         | `'A'`               | `##'`       | Tek bir Unicode karakteri            |
| Mantıksal        | `#1`, `#0`          | `##?`       | 1 ve 0 sayısı DEĞİL                  |
| Dizi             | `[1, 2, 3]`         | `##]`       | Tüm elemanlar aynı tipten            |
| Demet            | `(a, b)`            | `##)`       | Konumsal                             |
| Adlandırılmış Demet | `(x: 1, y: 2)`  | `##)`       | İsim veya indis ile erişim           |

---

## Çıktı ve Girdi

```zymbol
// Çıktı — otomatik olarak satır sonu EKLEMEZ
>> "Merhaba" ¶                    // ¶ veya \\ açık satır sonu verir
>> "a=" a " b=" b ¶               // birden fazla değer yan yana yazılır
>> "toplam=" topla(2, 3) ¶        // herhangi bir konumda işlev çağrısı
>> (arr$#) ¶                      // sonek operatörler parantez gerektirir

// Girdi
<< isim                           // istemi olmadan — değişkene okur
<< "Adınız? " isim                // istemli
```

> `¶` veya `\\` satır sonu olarak eşdeğerdir.

---

## Dizge Birleştirme

Üç geçerli biçim — her biri kendi bağlamı için:

```zymbol
isim = "Ayşe"
n = 25

// 1. Virgül — = veya := ile atamalarda
mesaj = "Merhaba ", isim, "!"            // → Merhaba Ayşe!
BASLIK := "Kullanıcı: ", isim

// 2. Yan yana yazım — >> çıktısında
>> "Merhaba " isim " yaşındasın " n ¶   // → Merhaba Ayşe yaşındasın 25

// 3. Enterpolasyon — her bağlamda
açıklama = "Merhaba {isim}, {n} yaşındasın"   // → Merhaba Ayşe, 25 yaşındasın
```

> **Not**: `+` yalnızca sayılar içindir. Dizgelerde kullanılırsa uyarı üretilir.

---

## Kontrol Akışı

```zymbol
x = 7

// Basit koşul
? x > 0 { >> "pozitif" ¶ }

// Koşul / yoksa koşul / yoksa
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

`{ }` blokları **zorunludur**, tek satır için bile.

---

## Match

```zymbol
// Aralıklarla eşleme
not = 85
değerlendirme = ?? not {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> değerlendirme ¶    // → B

// Koruyucularla eşleme (rastgele koşullar)
sıcaklık = -5
durum = ?? sıcaklık {
    _? sıcaklık < 0  : "buz"
    _? sıcaklık < 20 : "soğuk"
    _? sıcaklık < 35 : "ılık"
    _                : "sıcak"
}
>> durum ¶    // → buz

// Dizgelerle eşleme
renk = "kırmızı"
kod = ?? renk {
    "kırmızı" : "#FF0000"
    "yeşil"   : "#00FF00"
    _         : "#000000"
}
>> kod ¶
```

---

## Döngüler

```zymbol
// Kapsayıcı aralık: 0..4, 0,1,2,3,4 üzerinde döner
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Adımlı aralık
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Ters aralık
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Koşullu döngü (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Her eleman için
meyveler = ["elma", "armut", "üzüm"]
@ m:meyveler { >> m ¶ }

// Dizge karakterleri üzerinde
@ c:"merhaba" { >> c "-" }
>> ¶    // → m-e-r-h-a-b-a-

// Kes ve Devam Et
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> devam et
    ? i > 7 { @! }          // @! kes
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## İşlevler

```zymbol
// Tanımlama ve çağırma
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶    // → 7

// Özyineleme
faktöriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktöriyel(n - 1)
}
>> faktöriyel(5) ¶    // → 120

// İşlevler yalıtılmış kapsama sahiptir — dış değişkenlere erişemez
küresel = 100
sınama() {
    x = 42    // yalnızca yerel
    <~ x
}
>> sınama() ¶    // → 42
```

> **Önemli**: Adlandırılmış işlevler `isim(parametreler){ }` birinci sınıf değer değildir.
> Argüman olarak iletmek için sarılayın: `x -> isim(x)`.

---

## Lambda'lar ve Closure'lar

```zymbol
// Basit lambda (örtük dönüş)
iki_katı = x -> x * 2
toplam = (a, b) -> a + b
>> iki_katı(5) ¶    // → 10
>> toplam(3, 7) ¶   // → 10

// Blok lambda (açık dönüş)
sınıflandır = x -> {
    ? x > 0 { <~ "pozitif" }
    _? x < 0 { <~ "negatif" }
    <~ "sıfır"
}
>> sınıflandır(5) ¶     // → pozitif
>> sınıflandır(0) ¶     // → sıfır
>> sınıflandır(-5) ¶    // → negatif

// Closure'lar — lambda'lar dış değişkenleri yakalar
çarpan = 3
üç_katı = x -> x * çarpan    // 'çarpan' yakalanır
>> üç_katı(7) ¶    // → 21

// İşlev fabrikası
toplayıcı_yap(n) { <~ x -> x + n }
on_ekle = toplayıcı_yap(10)
>> on_ekle(5) ¶    // → 15

// Lambda'lar değer olarak: dizilerde saklanır
işlemler = [x -> x+1, x -> x*2, x -> x*x]
>> işlemler[0](5) ¶    // → 6
>> işlemler[2](5) ¶    // → 25
```

---

## Diziler

```zymbol
arr = [10, 20, 30, 40, 50]

// Erişim (0 tabanlı indis)
>> arr[0] ¶    // → 10

// Uzunluk (>> içinde parantez gerekir)
n = arr$#
>> (arr$#) ¶    // → 5

// Ekle, kaldır, içerir, dilim
arr = arr$+ 60               // ekle
arr = arr$- 0                // 0. indisi kaldır
var_mı = arr$? 30            // → #1
dilim = arr$[0..2]           // [20, 30]

// Eleman güncelle
arr[1] = 99

// Her eleman için
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **yeni bir dizi** döndürür — yeniden ata: `arr = arr$+ 4`.
> Zincirleme yapılmaz: iki ayrı atama kullanın.

---

## Demetler

```zymbol
// Adlandırılmış demet
kişi = (isim: "Fatma", yaş: 25)
>> kişi.isim ¶    // → Fatma
>> kişi.yaş ¶    // → 25
>> kişi[0] ¶      // → Fatma (indis de çalışır)
```

---

## Yüksek Mertebeli İşlevler

HOF operatörleri **satır içi lambda** gerektirir — doğrudan lambda değişkeni kullanılamaz.

```zymbol
sayılar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
iki_katları = sayılar$> (x -> x * 2)
>> iki_katları ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
çiftler = sayılar$| (x -> x % 2 == 0)
>> çiftler ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (başlangıç değeri, (biriktirici, eleman) -> ifade)
toplam = sayılar$< (0, (birikt, x) -> birikt + x)
>> toplam ¶    // → 55
```

---

## Hata İşleme

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Sıfıra bölme" ¶
} :! ##IO {
    >> "G/Ç hatası" ¶
} :! {
    >> "diğer hata: " _err ¶
} :> {
    >> "her zaman çalışır" ¶
}
```

| Tip         | Ne zaman oluşur                  |
|-------------|----------------------------------|
| `##Div`     | Sıfıra bölme                     |
| `##IO`      | Dosya / Sistem                   |
| `##Index`   | İndis aralık dışında             |
| `##Type`    | Tip hatası                       |
| `##Parse`   | Ayrıştırma hatası                |
| `##Network` | Ağ hatası                        |
| `##_`       | Herhangi bir hata (catch-all)    |

---

## Modüller

```zymbol
// Dosya: lib/hesap.zy
# hesap

#> { topla, get_PI }    // Tanımlamalardan ÖNCE dışa aktarımlar

_PI := 3.14159
topla(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Dosya: ana.zy
<# ./lib/hesap <= h    // Takma ad zorunludur

>> h::topla(5, 3) ¶   // → 8
pi = h::get_PI()
>> pi ¶                // → 3.14159
```

---

## Tam Örnek: FizzBuzz

```zymbol
sınıfla(sayı) {
    ? sayı % 15 == 0 { <~ "CızVız" }
    _? sayı % 3  == 0 { <~ "Cız" }
    _? sayı % 5  == 0 { <~ "Vız" }
    _ { <~ sayı }
}

@ i:1..20 { >> sınıfla(i) ¶ }
```

---

## Sembol Referansı

| Sembol  | İşlem                  | Sembol     | İşlem                        |
|---------|------------------------|------------|------------------------------|
| `=`     | Değişken               | `$#`       | Uzunluk                      |
| `:=`    | Sabit                  | `$+`       | Ekle                         |
| `>>`    | Çıktı                  | `$-`       | Kaldır (indis ile)           |
| `<<`    | Girdi                  | `$?`       | İçerir                       |
| `¶`/`\` | Satır sonu             | `$[s..e]`  | Dilim                        |
| `?`     | koşul (if)             | `$>`       | map                          |
| `_?`    | yoksa koşul (elif)     | `$\|`      | filter                       |
| `_`     | yoksa / joker          | `$<`       | reduce                       |
| `??`    | eşle (match)           | `!?`       | dene (try)                   |
| `@`     | Döngü                  | `:!`       | yakala (catch)               |
| `@!`    | kes (break)            | `:>`       | her zaman (finally)          |
| `@>`    | devam et (continue)    | `$!`       | hata mı                      |
| `->`    | Lambda                 | `$!!`      | hatayı ilet                  |
| `<~`    | döndür (return)        | `#`        | modül tanımla                |
| `\|>`   | Boru (pipe)            | `#>`       | dışa aktar                   |
| `#1`    | doğru                  | `<#`       | içe aktar                    |
| `#0`    | yanlış                 | `::`       | modül çağrısı                |

---

*Zymbol-Lang — Sembolik. Evrensel. Değişmez.*

---

> **Uyarı:** Bu belge yapay zeka (YZ) tarafından oluşturulmuş ve çevrilmiştir.
> Doğruluğu sağlamak için her türlü çaba gösterilmiş olmakla birlikte, bazı çeviriler veya örnekler hata içerebilir.
> Kanonik referans [Zymbol-Lang spesifikasyonudur](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
