# Zymbol-Lang Kompakt Kılavuzu

**Zymbol-Lang** sembolik bir programlama dilidir. Hiç anahtar kelime kullanmaz — her şey bir semboldür. Her insan dilinde aynı şekilde çalışır.

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

```zymbol
// Tip iç gözlemi — (tip, basamak, değer) döndürür
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Çıktı ve Girdi

```zymbol
>> "Merhaba" ¶                    // ¶ veya \\ açık satır sonu verir
>> "a=" a " b=" b ¶               // birden fazla değer yan yana yazılır
>> (arr$#) ¶                      // sonek operatörler parantez gerektirir

<< isim                           // istemi olmadan — değişkene okur
<< "Adınız? " isim                // istemli
```

> `¶` veya `\\` satır sonu olarak eşdeğerdir.

---

## Operatörler

```zymbol
// Aritmetik
a = 10
b = 3
s1 = a + b    // 13     s2 = a - b    // 7
s3 = a * b    // 30     s4 = a / b    // 3  (tam bölme)
s5 = a % b    // 1      s6 = a ^ b    // 1000  (üs alma)

// Karşılaştırma
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Mantıksal
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Dizeler

```zymbol
// Üç birleştirme biçimi
isim = "Ayşe"
n = 42

mesaj = "Merhaba ", isim, "!"            // virgül — atamalarda
>> "Merhaba " isim " yaşındasın " n ¶   // yan yana — >> çıktısında
açıklama = "Merhaba {isim}, {n} yaşındasın"   // enterpolasyon — her yerde
```

```zymbol
s = "Hello World"
uzunluk = s$#              // 11
alt = s$[0..5]             // "Hello"  (son hariç)
var_mı = s$? "World"       // #1
parç = "a,b,c,d" / ','     // [a, b, c, d]
değiş = s$~~["l":"L"]      // "HeLLo WorLd"
değiş1 = s$~~["l":"L":1]   // "HeLlo World"  (ilk N)
```

> `+` yalnızca sayılar içindir. Dizeler için `,`, yan yana yazım veya enterpolasyon kullanın.

---

## Kontrol Akışı

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

> `{ }` blokları **zorunludur**, tek satır için bile.

---

## Match

```zymbol
// Aralıklar
not = 85
değerlendirme = ?? not {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> değerlendirme ¶    // → B

// Dizeler
renk = "kırmızı"
kod = ?? renk {
    "kırmızı" : "#FF0000"
    "yeşil"   : "#00FF00"
    _         : "#000000"
}

// Koruyucular
sıcaklık = -5
durum = ?? sıcaklık {
    _? sıcaklık < 0  : "buz"
    _? sıcaklık < 20 : "soğuk"
    _? sıcaklık < 35 : "ılık"
    _                : "sıcak"
}
>> durum ¶    // → buz

// Deyim biçimi (blok kolları)
?? n {
    0       : { >> "sıfır" ¶ }
    _? n < 0: { >> "negatif" ¶ }
    _       : { >> "pozitif" ¶ }
}
```

---

## Döngüler

```zymbol
@ i:0..4  { >> i " " }        // kapsayıcı aralık: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // adımlı: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ters: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

meyveler = ["elma", "armut", "üzüm"]
@ m:meyveler { >> m ¶ }       // for-each dizi üzerinde

@ c:"merhaba" { >> c "-" }
>> ¶                          // → m-e-r-h-a-b-a-  (for-each dizge)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> devam et
    ? i > 7 { @! }             // @! kes
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

// Etiketli döngü (iç içe kesmek)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## İşlevler

```zymbol
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶    // → 7

faktöriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktöriyel(n - 1)
}
>> faktöriyel(5) ¶    // → 120
```

İşlevler **yalıtılmış kapsama** sahiptir — dış değişkenlere erişemez. Çağıranın değişkenlerini değiştirmek için `<~` çıkış parametrelerini kullanın:

```zymbol
değiştir(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
değiştir(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Adlandırılmış işlevler birinci sınıf değer değildir. Argüman olarak iletmek için sarılayın: `x -> topla(x)`.

---

## Lambda'lar ve Closure'lar

```zymbol
iki_katı = x -> x * 2
toplam = (a, b) -> a + b
>> iki_katı(5) ¶    // → 10
>> toplam(3, 7) ¶   // → 10

// Blok lambda
sınıflandır = x -> {
    ? x > 0 { <~ "pozitif" }
    _? x < 0 { <~ "negatif" }
    <~ "sıfır"
}

// Closure — lambda dış değişkenleri yakalar
çarpan = 3
üç_katı = x -> x * çarpan
>> üç_katı(7) ¶    // → 21

// İşlev fabrikası
toplayıcı_yap(n) { <~ x -> x + n }
on_ekle = toplayıcı_yap(10)
>> on_ekle(5) ¶    // → 15

// Dizide
işlemler = [x -> x+1, x -> x*2, x -> x*x]
>> işlemler[2](5) ¶    // → 25
```

---

## Diziler

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — erişim (0 tabanlı indis)
arr[-1]         // 5 — negatif indis (son)
arr$#           // 5 — uzunluk (>> içinde (arr$#) kullanın)

arr = arr$+ 6            // ekle → [1,2,3,4,5,6]
a2 = arr$+[2] 99         // indis 2'ye daxil et
a3 = arr$- 3             // değerin ilk tekrarını kaldır
a4 = arr$-- 3            // tüm tekrarları kaldır
a5 = arr$-[0]            // indisle kaldır
a6 = arr$-[1..3]         // aralığı kaldır (son hariç)

var_mı = arr$? 3         // #1 — içerir
pos = arr$?? 3           // [2] — tüm indisler
dilim = arr$[0..3]       // [1,2,3] — dilim (son hariç)
dilim2 = arr$[0:3]       // [1,2,3] — aynı, sayıma dayalı sözdizimi

asc = arr$^+             // artan sıralama  (yalnız ilkeller)
desc = arr$^-            // azalan sıralama (yalnız ilkeller)

// Adlandırılmış/konumsal demet dizileri — $^ karşılaştırıcı lambda ile
db = [(isim: "Carla", yaş: 28), (isim: "Fatma", yaş: 25), (isim: "Bob", yaş: 30)]
by_age  = db$^ (a, b -> a.yaş < b.yaş)    // yaşa göre artan  (<)
by_name = db$^ (a, b -> a.isim > b.isim)  // isme göre azalan (>)
>> by_age[0].isim ¶     // → Fatma
>> by_name[0].isim ¶    // → Carla

arr[1] = 99              // yerinde güncelleme
arr = arr[1]$~ 99        // fonksiyonel güncelleme — yeni dizi döndürür
```

> Tüm koleksiyon operatörleri **yeni bir dizi** döndürür. Yeniden atayın: `arr = arr$+ 4`.
> Operatörler zincirlenemez — ara değişkenler kullanın.
> `$^+` / `$^-` **ilkel dizileri** (sayılar, dizgeler) sıralar. Demet dizileri için `$^` karşılaştırıcı lambda ile kullanın.

```zymbol
// İç içe diziler
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Yıkım Ataması

```zymbol
// Dizi
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ yok sayar

// Konumsal demet
point = (100, 200)
(px, py) = point             // px=100  py=200

// Adlandırılmış demet
kişi = (isim: "Fatma", yaş: 25, şehir: "İstanbul")
(isim: n, yaş: a) = kişi    // n="Fatma"  a=25
```

---

## Demetler

```zymbol
// Konumsal
point = (10, 20)
>> point[0] ¶    // → 10

// Adlandırılmış
kişi = (isim: "Fatma", yaş: 25)
>> kişi.isim ¶    // → Fatma
>> kişi[0] ¶      // → Fatma  (indis de çalışır)

// İç içe
pos = (x: 10, y: 20)
p = (pos: pos, label: "köken")
>> p.pos.x ¶        // → 10
```

---

## Yüksek Mertebeli İşlevler

> HOF operatörleri **satır içi lambda** gerektirir — doğrudan lambda değişkeni kullanılamaz.

```zymbol
sayılar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

iki_katları = sayılar$> (x -> x * 2)                // map  → [2,4,6…20]
çiftler     = sayılar$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
toplam      = sayılar$< (0, (birikt, x) -> birikt + x) // reduce → 55

// Ara değişkenler ile zincir
step1 = sayılar$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// HOF içinde adlandırılmış işlevler — lambda içine sarın
double(x) { <~ x * 2 }
r = sayılar$> (x -> double(x))    // ✅
```

---

## Boru Operatörü

Sağ taraf her zaman `_` yer tutucusunu gerektirir:

```zymbol
double = x -> x * 2
add = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)        // → 10
10 |> add(_, 5)       // → 15
5 |> add(2, _)        // → 7

// Zincirlenmiş
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Hata İşleme

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Sıfıra bölme" ¶
} :! {
    >> "diğer hata: " _err ¶    // _err hata mesajını tutar
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

```zymbol
// Farklı genel adla dışa aktar
# mylib
#> { _dahili_topla <= toplam }

_dahili_topla(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::toplam(3, 4) ¶    // → 7  (dahili ad _dahili_topla gizlenir)
```

---

## Veri Operatörleri

```zymbol
// Dizeyi sayıya dönüştür
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (güvenli)

// Yuvarlama / kesme
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Sayı biçimlendirme
fmt = #,|1234567|      // → 1,234,567
sci = #^|12345.678|    // → 1.2345678e4

// Taban değişmezleri
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Taban dönüştürme
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Kabuk Entegrasyonu

```zymbol
date = <\ date +%Y-%m-%d \>     // stdout'u yakalar
>> "Bugün: " date

file = "data.txt"
content = <\ cat {file} \>      // komutlarda enterpolasyon

output = </"./subscript.zy"/>   // Zymbol betiği çalıştırır
>> output
```

> `><` CLI argümanlarını dizge dizisi olarak yakalar (yalnızca tree-walker).

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
| `>>`    | Çıktı                  | `$+[i]`    | İndise ekle                  |
| `<<`    | Girdi                  | `$-`       | İlkini değerle kaldır        |
| `¶`/`\\`| Satır sonu             | `$--`      | Hepsini değerle kaldır       |
| `?`     | koşul (if)             | `$-[i]`    | İndisle kaldır               |
| `_?`    | yoksa koşul (elif)     | `$-[i..j]` | Aralığı kaldır               |
| `_`     | yoksa / joker          | `$?`       | İçerir                       |
| `??`    | eşle (match)           | `$??`      | Tüm indisleri bul            |
| `@`     | Döngü                  | `$[s..e]`  | Dilim                        |
| `@!`    | kes (break)            | `$>`       | map                          |
| `@>`    | devam et (continue)    | `$\|`      | filter                       |
| `->`    | Lambda                 | `$<`       | reduce                       |
| `$^+`   | Artan sıralama (ilkel) | `$^-`      | Azalan sıralama (ilkel)      |
| `$^`    | Karşılaştırıcı ile sırala |         |                              |
| `<~`    | döndür (return)        | `!?`       | dene (try)                   |
| `\|>`   | Boru (pipe)            | `:!`       | yakala (catch)               |
| `#1`    | doğru                  | `:>`       | her zaman (finally)          |
| `#0`    | yanlış                 | `$!`       | hata mı                      |
| `<#`    | içe aktar              | `$!!`      | hatayı ilet                  |
| `#`     | modül tanımla          | `#>`       | dışa aktar                   |
| `::`    | modül çağrısı          | `.`        | alan erişimi                 |
| `#\|..\|` | Sayı ayrıştır        | `#?`       | Tip meta verisi              |
| `#.N\|..\|` | Yuvarla            | `#!N\|..\|` | Kes                        |
| `c\|..\|` | Virgüllü biçim       | `e\|..\|`  | Bilimsel biçim               |
| `<\ ..\>` | Kabuk çalıştır       | `><`       | CLI argümanları              |

---

*Zymbol-Lang — Sembolik. Evrensel. Değişmez.*

> **Uyarı:** Bu belge yapay zeka (YZ) tarafından oluşturulmuş ve çevrilmiştir.
> Doğruluğu sağlamak için her türlü çaba gösterilmiş olmakla birlikte, bazı çeviriler veya örnekler hata içerebilir.
> Kanonik referans [Zymbol-Lang spesifikasyonudur](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> For authoritative reference, consult the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
