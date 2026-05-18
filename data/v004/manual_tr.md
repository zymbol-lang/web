> **Bildirim:** Bu dokümantasyon yapay zeka (AI) yardımıyla oluşturulmuştur.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanonik referans, yorumlayıcı deposundaki **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dosyasıdır.

---

# Zymbol-Lang Kılavuzu

**Zymbol-Lang** sembolik bir programlama dilidir. Anahtar kelime yok — her şey bir semboldür. Herhangi bir insan dilinde aynı şekilde çalışır.

- `if`, `while`, `return` yok — sadece `?`, `@`, `<~`
- Tam Unicode — herhangi bir dilde veya emojide tanımlayıcılar
- İnsan dilinden bağımsız — kod her yerde aynıdır

**Yorumlayıcı sürümü**: v0.0.4 | **Test kapsamı**: 393/393 (TW ↔ VM eşitliği)

---

## Değişkenler ve Sabitler

```zymbol
x = 10              // değiştirilebilir değişken
PI := 3.14159       // sabit — yeniden atama çalışma zamanı hatasıdır
isim = "Alice"
aktif = #1          // Boolean doğru
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

---

## Veri Tipleri

| Tip | Literal | `#?` etiketi | Notlar |
|-----|---------|--------------|--------|
| Tam Sayı | `42`, `-7` | `###` | 64-bit işaretli |
| Kayan Nokta | `3.14`, `1.5e10` | `##.` | Bilimsel gösterim izinli |
| Dizi | `"metin"` | `##"` | Enterpolasyon: `"Merhaba {isim}"` |
| Karakter | `'A'` | `##'` | Tek Unicode karakteri |
| Boolean | `#1`, `#0` | `##?` | Sayısal DEĞİL — `#1 ≠ 1` |
| Dizi | `[1, 2, 3]` | `##]` | Homojen elemanlar |
| Demet | `(a, b)` | `##)` | Konumsal |
| İsimlendirilmiş demet | `(x: 1, y: 2)` | `##)` | İsimlendirilmiş alanlar |
| Fonksiyon | isimlendirilmiş fonksiyon referansı | `##()` | Birinci sınıf; `<funct/N>` gösterir |
| Lambda | `x -> x * 2` | `##->` | Birinci sınıf; `<lambd/N>` gösterir |

```zymbol
// Tip içgözlemi — döndürür (tip, basamaklar, değer)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Çıktı ve Girdi

```zymbol
>> "Merhaba" ¶                       // ¶ veya \\ açık satır sonu için
>> "a=" a " b=" b ¶                  // yan yana koyma — çoklu değerler
>> (arr$#) ¶                         // postfix operatörleri >> içinde ( ) gerektirir

<< isim                              // değişkene oku (istem yok)
<< "İsim girin: " isim               // istem ile
```

> `¶` (İspanyol klavyede AltGr+R) ve `\\` satır sonu olarak eşdeğerdir.

---

## Operatörler

```zymbol
// Aritmetik — atamaları kullanın; bazı operatörlerin doğrudan >> içinde tuhaflıkları vardır
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (tam sayı bölmesi)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (üs alma)

// Karşılaştırma
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Mantıksal
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Dizgiler

```zymbol
// İki birleştirme biçimi
isim = "Alice"
n = 42

>> "Merhaba " isim " şu kadarınız var: " n ¶       // yan yana koyma — >> içinde
açıklama = "Merhaba {isim}, şu kadarınız var: {n}"  // enterpolasyon — her yerde
```

```zymbol
s = "Merhaba Dünya"
uzunluk = s$#                  // 12
alt = s$[1..7]                 // "Merhaba"  (1-tabanlı, bitiş dahil)
var_mı = s$? "Dünya"           // #1
parçalar = "a,b,c,d"$/ ','     // [a, b, c, d]  (ayırıcı ile böl)
değiş = s$~~["a":"e"]          // "Merhebe Dünye"
değiş1 = s$~~["a":"e":1]       // "Merheba Dünya"  (yalnızca ilk N)
```

> `+` yalnızca sayılar içindir. Dizgiler için `,`, yan yana koyma veya enterpolasyon kullanın.

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

> `{ }` süslü parantezler **zorunludur** tek bir ifade için bile.

---

## Eşleme (Match)

```zymbol
// Aralıklar
puan = 85
harf_notu = ?? puan {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> harf_notu ¶    // → B

// Dizgiler
renk = "kırmızı"
kod = ?? renk {
    "kırmızı" : "#FF0000"
    "yeşil"   : "#00FF00"
    _         : "#000000"
}

// Karşılaştırma kalıpları
sıcaklık = -5
durum = ?? sıcaklık {
    < 0  : "buz"
    < 20 : "soğuk"
    < 35 : "ılık"
    _    : "sıcak"
}
>> durum ¶    // → buz

// İfade biçimi (bloklar)
?? n {
    0        : { >> "sıfır" ¶ }
    _? n < 0 : { >> "negatif" ¶ }
    _        : { >> "pozitif" ¶ }
}
```

---

## Döngüler

```zymbol
@ i:0..4  { >> i " " }        // aralık dahil:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // adımlı:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ters:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

meyveler = ["elma", "armut", "üzüm"]
@ m:meyveler { >> m ¶ }       // dizideki her eleman için

@ c:"merhaba" { >> c "-" }
>> ¶                          // → m-e-r-h-a-b-a-  (dizgideki her karakter için)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> devam et
    ? i > 7 { @! }            // @! kır
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

// Etiketli döngü (iç içe kırma)
sayıcı = 0
@:dış {
    sayıcı++
    ? sayıcı >= 3 { @:dış! }
}
>> sayıcı ¶                   // → 3
```

---

## Fonksiyonlar

```zymbol
topla(a, b) { <~ a + b }
>> topla(3, 4) ¶   // → 7

faktöriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktöriyel(n - 1)
}
>> faktöriyel(5) ¶    // → 120
```

Fonksiyonlar **izole edilmiş kapsama** sahiptir — dış değişkenleri okuyamazlar. Çağıranın değişkenlerini değiştirmek için `<~` çıktı parametrelerini kullanın:

```zymbol
takas(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
takas(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> İsimlendirilmiş fonksiyonlar **birinci sınıf değerlerdir** — doğrudan aktarın: `nums$> iki_kat`. `x -> fn(x)` de geçerlidir.

---

---

## Lambdalar ve Kapanımlar

```zymbol
iki_kat = x -> x * 2
topla = (a, b) -> a + b
>> iki_kat(5) ¶   // → 10
>> topla(3, 7) ¶  // → 10

// Blok lambda
sınıflandır = x -> {
    ? x > 0 { <~ "pozitif" }
    _? x < 0 { <~ "negatif" }
    <~ "sıfır"
}

// Kapanım — dış kapsamı yakalar
çarpan = 3
üç_kat = x -> x * çarpan
>> üç_kat(7) ¶    // → 21

// Fabrika
toplayıcı_yarat(n) { <~ x -> x + n }
on_ekle = toplayıcı_yarat(10)
>> on_ekle(5) ¶    // → 15

// Dizilerde
işlemler = [x -> x+1, x -> x*2, x -> x*x]
>> işlemler[3](5) ¶   // → 25
```

---

## Diziler

Diziler **değiştirilebilirdir** ve **aynı türde** elemanlar içerir.

```zymbol
dizi = [1, 2, 3, 4, 5]

dizi[1]          // 1 — erişim (1-tabanlı: ilk eleman)
dizi[-1]         // 5 — negatif indeks (son eleman)
dizi$#           // 5 — uzunluk (>> içinde (dizi$#) kullanın)

dizi = dizi$+ 6            // ekle → [1,2,3,4,5,6]
dizi2 = dizi$+[2] 99       // 2. konuma ekle (1-tabanlı)
dizi3 = dizi$- 3           // değerin ilk bulunmasını kaldır
dizi4 = dizi$-- 3          // tüm bulunmaları kaldır
dizi5 = dizi$-[1]          // 1 indeksindekini kaldır (ilk eleman)
dizi6 = dizi$-[2..3]       // aralığı kaldır (1-tabanlı, bitiş dahil)

var_mı = dizi$? 3          // #1 — içeriyor
konumlar = dizi$?? 3       // [3] — değerin tüm indeksleri (1-tabanlı)
dilim = dizi$[1..3]        // [1,2,3] — dilim (1-tabanlı, bitiş dahil)
dilim2 = dizi$[1:3]        // [1,2,3] — aynı, miktar sözdizimi

artan = dizi$^+            // artan sırala (yalnızca ilkeller)
azalan = dizi$^-           // azalan sırala (yalnızca ilkeller)

// İsimlendirilmiş/konumsal demet dizileri — karşılaştırma lambdası ile $^ kullanın
veri = [(isim: "Carla", yaş: 28), (isim: "Ana", yaş: 25), (isim: "Bob", yaş: 30)]
yaşa_göre   = veri$^ (a, b -> a.yaş < b.yaş)      // yaşa göre artan (<)
isme_göre   = veri$^ (a, b -> a.isim > b.isim)    // isme göre azalan (>)
>> yaşa_göre[1].isim ¶     // → Ana
>> isme_göre[1].isim ¶     // → Carla

// Doğrudan eleman güncelleme (yalnızca diziler)
dizi[1] = 99              // ata
dizi[2] += 5              // bileşik: +=  -=  *=  /=  %=  ^=

// Fonksiyonel güncelleme — yeni bir dizi döndürür; orijinal değişmez
dizi2 = dizi[2]$~ 99
```

> Tüm koleksiyon operatörleri **yeni bir dizi** döndürür. Geri atayın: `dizi = dizi$+ 4`.
> `$+` zincirlenebilir: `dizi = dizi$+ 5$+ 6$+ 7`. Diğer operatörler ara atamalar kullanır.
> **İndeksleme 1-tabanlıdır**: `dizi[1]` ilk elemandır; `dizi[0]` çalışma zamanı hatasıdır.
> `$^+` / `$^-` **ilkel dizileri** sıralar (sayılar, dizgiler). Demet dizileri için karşılaştırma lambdasıyla `$^` kullanın — yön lambda'da kodlanır (`<` = artan, `>` = azalan).

**Değer semantiği** — bir diziyi başka bir değişkene atamak bağımsız bir kopya oluşturur:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b etkilenmez
```

```zymbol
// İç içe diziler (1-tabanlı indeksleme)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (2. satır, 3. sütun)
```

---

## Yıkıcı Atama

```zymbol
// Dizi
dizi = [10, 20, 30, 40, 50]
[a, b, c] = dizi              // a=10  b=20  c=30
[ilk, *geri_kalan] = dizi     // ilk=10  geri_kalan=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ atar

// Konumsal demet
nokta = (100, 200)
(px, py) = nokta              // px=100  py=200

// İsimlendirilmiş demet
kişi = (isim: "Ana", yaş: 25, şehir: "Madrid")
(isim: i, yaş: y) = kişi      // i="Ana"  y=25
```

---

## Demetler

Demetler **değiştirilemez** sıralı kaplardır ve **farklı türlerde** değerler tutabilirler.
Dizilerden farklı olarak, elemanlar oluşturulduktan sonra değiştirilemez.

```zymbol
// Konumsal — karışık türlere izin verilir
nokta = (10, 20)
>> nokta[1] ¶    // → 10

veri = (42, "merhaba", #1, 3.14)
>> veri[3] ¶     // → #1

// İsimlendirilmiş
kişi = (isim: "Alice", yaş: 25)
>> kişi.isim ¶    // → Alice
>> kişi[1] ¶      // → Alice  (indeks de çalışır, 1-tabanlı)

// İç içe
konum = (x: 10, y: 20)
p = (konum: konum, etiket: "orijin")
>> p.konum.x ¶    // → 10
```

**Değiştirilemezlik** — bir demet elemanını değiştirme girişimi çalışma zamanı hatasıdır:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ çalışma zamanı hatası: demetler değiştirilemez
// t[1] += 5    // ❌ aynı hata
```

Değiştirilmiş bir değer elde etmek için `$~` (fonksiyonel güncelleme) kullanın — **yeni** bir demet döndürür:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orijinal değişmez
>> t2 ¶    // → (10, 999, 30)

// İsimlendirilmiş demet — açıkça yeniden oluştur
kişi = (isim: "Alice", yaş: 25)
daha_yaşlı = (isim: kişi.isim, yaş: 26)
>> kişi.yaş ¶    // → 25
>> daha_yaşlı.yaş ¶ // → 26
```

---

## Yüksek Dereceli Fonksiyonlar

```zymbol
sayılar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

iki_katlanmış  = sayılar$> (x -> x * 2)                // haritalama → [2,4,6…20]
çiftler   = sayılar$| (x -> x % 2 == 0)               // filtreleme → [2,4,6,8,10]
toplam    = sayılar$< (0, (birikim, x) -> birikim + x) // indirgeme → 55

// Ara adımlarla zincirleme
adım1 = sayılar$| (x -> x > 3)
adım2 = adım1$> (x -> x * x)
>> adım2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// İsimlendirilmiş fonksiyonlar doğrudan YDF'ye aktarılabilir
iki_kat(x) { <~ x * 2 }
büyük_mü(x) { <~ x > 5 }
r = sayılar$> iki_kat       // ✅ doğrudan referans
r = sayılar$| büyük_mü      // ✅ doğrudan referans
```

---

## Boru Operatörü

Sağ taraf, borulanan değer için her zaman bir yer tutucu olarak `_` gerektirir:

```zymbol
iki_kat = x -> x * 2
topla = (a, b) -> a + b
arttır = x -> x + 1

5 |> iki_kat(_)        // → 10
10 |> topla(_, 5)      // → 15
5 |> topla(2, _)       // → 7

// Zincirli
r = 5 |> iki_kat(_) |> arttır(_) |> iki_kat(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Hata Yönetimi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "sıfıra bölme" ¶
} :! {
    >> "diğer hata: " _err ¶    // _err hata mesajını tutar
} :> {
    >> "her zaman çalışır" ¶
}
```

| Tip | Ne zaman |
|-----|----------|
| `##Div` | Sıfıra bölme |
| `##IO` | Dosya / sistem |
| `##Index` | İndeks sınırların dışında |
| `##Type` | Tip uyuşmazlığı |
| `##Parse` | Veri ayrıştırma |
| `##Network` | Ağ hataları |
| `##_` | Herhangi bir hata (hepsini yakalar) |

---

## Modüller

```zymbol
// lib/calc.zy — modül gövdesi süslü parantezler içindedir
# calc {
    #> { topla, get_PI }

    _PI := 3.14159
    topla(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // takma ad zorunludur

>> c::topla(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Farklı bir genel adla dışa aktar
# benim_kitaplığım {
    #> { _iç_toplama <= sum }

    _iç_toplama(a, b) { <~ a + b }
}
```

```zymbol
<# ./benim_kitaplığım <= m

>> m::sum(3, 4) ¶    // → 7  (_iç_toplama iç adı gizlidir)
```

> **Modül kuralları**: `# isim { }` içinde yalnızca `#>`, fonksiyon tanımları ve literal değişken/sabit başlatıcılarına izin verilir. Yürütülebilir ifadeler (`>>`, `<<`, döngüler vb.) E013 hatası verir.

---

## Sayısal Modlar

Zymbol, sayıları **69 Unicode basamak bloğunda** görüntüleyebilir — Devanagari, Arap-Hint, Tay, Klingon pIqaD, Matematiksel Kalın, LCD segmentleri ve daha fazlası. Aktif mod yalnızca `>>` çıktısını etkiler; iç aritmetik her zaman ikilidir.

### Bir yazı sistemini etkinleştirme

Hedef yazı sisteminin `0` ve `9` rakamlarını `#…#` içine yazın:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arap-Hint     (U+0660–U+0669)
#๐๙#    // Tay           (U+0E50–U+0E59)
#09#    // ASCII'ye sıfırla
```

### Çıktı ve Boolean'lar

```zymbol
x = 42
>> x ¶          // → 42   (ASCII varsayılan)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ondalık nokta her zaman ASCII)
>> 1 + 2 ¶      // → ३

// Boolean'lar: # öneki her zaman ASCII, basamak uyum sağlar
>> #1 ¶         // → #१   (Devanagari'de doğru)
>> #0 ¶         // → #०   (yanlış — ० tam sayı sıfırından farklıdır)

x = 28 > 4
>> x ¶          // → #१   (karşılaştırma sonucu aktif modu izler)
```

### Kaynak kodunda yerel basamak litarelleri

Desteklenen herhangi bir yazı sisteminin rakamları geçerli litarellerdir — aralıklarda, modülde, karşılaştırmalarda:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Herhangi bir yazı sisteminde Boolean litarelleri

`#` + herhangi bir bloktan `0` veya `1` rakamı geçerli bir Boolean literalıdır:

```zymbol
#٠٩#
aktif = #١        // #1 ile aynı
>> aktif ¶        // → #१
>> (#١ && #٠) ¶   // → #०
```

> `#` **her zaman ASCII'dir**. `#0` (yanlış) her yazı sisteminde her zaman `0`'dan (tam sayı sıfırı) görsel olarak ayırt edilebilir.

---

## Veri Operatörleri

```zymbol
// Tip dönüşümü
##.42         // → 42.0  (Kayan Noktaya)
###3.7        // → 4     (Tam Sayıya, yuvarla)
##!3.7        // → 3     (Tam Sayıya, kırp)

// Dizgiyi sayıya ayrıştır
v1 = #|"42"|      // → 42  (Tam Sayı)
v2 = #|"3.14"|    // → 3.14  (Kayan Nokta)
v3 = #|"abc"|     // → "abc"  (güvenli, hata yok)

// Yuvarla / kırp
pi = 3.14159265
y2 = #.2|pi|      // → 3.14  (2 ondalık basamağa yuvarla)
y4 = #.4|pi|      // → 3.1416
k2 = #!2|pi|      // → 3.14  (kırp)

// Sayı biçimlendirme
biçim = #,|1234567|   // → 1,234,567  (virgülle ayrılmış)
bilim = #^|12345.678| // → 1.2345678e4  (bilimsel)

// Taban litarelleri
a = 0x41         // → 'A'  (onaltılık)
b = 0b01000001   // → 'A'  (ikili)
c = 0o101        // → 'A'  (sekizli)

// Taban dönüşümü çıktısı
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Kabuk Entegrasyonu

```zymbol
tarih = <\ date +%Y-%m-%d \>     // stdout'u yakalar (sonunda \n içerir)
>> "Bugün: " tarih

dosya = "veri.txt"
içerik = <\ cat {dosya} \>       // komutlarda enterpolasyon

çıktı = </"./subscript.zy"/>     // başka bir Zymbol betiği çalıştır, çıktıyı yakala
>> çıktı
```

> `><` CLI argümanlarını bir dizi dizgi olarak yakalar (yalnızca tree-walker).

---

## Tam Örnek: FizzBuzz

```zymbol
sınıflandır(sayı) {
    ? sayı % 15 == 0 { <~ "FizzBuzz" }
    _? sayı % 3  == 0 { <~ "Fizz" }
    _? sayı % 5  == 0 { <~ "Buzz" }
    _ { <~ sayı }
}

@ i:1..20 { >> sınıflandır(i) ¶ }
```

---

## Sembol Referansı

| Sembol | İşlem | Sembol | İşlem |
|--------|-------|--------|-------|
| `=` | değişken | `$#` | uzunluk |
| `:=` | sabit | `$+` | ekle (zincirlenebilir) |
| `>>` | çıktı | `$+[i]` | indekse ekle (1-tabanlı) |
| `<<` | girdi | `$-` | değere göre ilkini kaldır |
| `¶` / `\\` | satır sonu | `$--` | değere göre tümünü kaldır |
| `?` | eğer | `$-[i]` | indeksten kaldır (1-tabanlı) |
| `_?` | değilse eğer | `$-[i..j]` | aralığı kaldır (1-tabanlı) |
| `_` | değilse / joker | `$?` | içeriyor |
| `??` | eşleme | `$??` | tüm indeksleri bul (1-tabanlı) |
| `@` | döngü | `$[s..e]` | dilim (1-tabanlı) |
| `@ N { }` | N kez döngü | `$>` | haritalama |
| `@!` | kır | `$|` | filtreleme |
| `@>` | devam et | `$<` | indirgeme |
| `@:isim { }` | etiketli döngü | `$/ ayır` | dizi bölme |
| `@:isim!` | etiketli kır | `$++ a b c` | birleştirme oluşturma |
| `@:isim>` | etiketli devam et | `dizi[i>j>k]` | gezinme indeksi |
| `->` | lambda | `dizi[i] = değer` | eleman güncelle (yalnızca diziler) |
| `dizi[i] += değer` | bileşik güncelleme | `dizi[i]$~` | fonksiyonel güncelleme (yeni kopya) |
| `$^+` | artan sırala (ilkeller) | `$^-` | azalan sırala (ilkeller) |
| `$^` | karşılaştırıcı ile sırala (demetler) | `<~` | döndür |
| `|>` | boru | `!?` | dene |
| `:!` | yakala | `:>` | sonunda |
| `#1` | doğru | `#0` | yanlış |
| `$!` | hatadır | `$!!` | hatayı yay |
| `<#` | içe aktar | `#>` | dışa aktar |
| `#` | modül bildir | `::` | modülü çağır |
| `.` | alana erişim | `#?` | tip metaverisi |
| `#\|..\|` | sayıyı ayrıştır | `##.` | Kayan Noktaya dönüştür |
| `###` | Tam Sayıya dönüştür (yuvarla) | `##!` | Tam Sayıya dönüştür (kırp) |
| `#.N\|..\|` | yuvarla | `#!N\|..\|` | kırp |
| `#,\|..\|` | virgül biçimi | `#^\|..\|` | bilimsel |
| `#d0d9#` | sayısal mod değiştir | `#09#` | ASCII'ye sıfırla |
| `<\ ..\>` | kabuk çalıştır | `>\<` | CLI argümanları |
| `\ var` | değişkeni açıkça yok et | | |

---

## Sürüm Değişiklik Günlüğü

### v0.0.4 — 1-Tabanlı İndeksleme, Birinci Sınıf Fonksiyonlar ve Modül Blokları _(Nisan 2026)_

- **Kırılan** Tüm indeksleme **1-tabanlı** olarak değiştirildi — `arr[1]` ilk elemandır; `arr[0]` çalışma zamanı hatasıdır
- **Eklendi** İsimlendirilmiş fonksiyonlar **birinci sınıf değerlerdir** — doğrudan YDF'ye aktarın: `nums$> iki_kat`
- **Eklendi** Modüller için **blok sözdizimi zorunludur**: `# isim { ... }` — düz sözdizimi kaldırıldı
- **Eklendi** Çok boyutlu indeksleme: `arr[i>j>k]` (gezinme), `arr[p ; q]` (düz çıkarma)
- **Eklendi** Tip dönüşümü: `##.ifade` (Kayan Nokta), `###ifade` (Tam Sayı yuvarla), `##!ifade` (Tam Sayı kırp)
- **Eklendi** Dizi bölme: `str$/ ayır` — `Array(Dizi)` döndürür
- **Eklendi** Birleştirme oluşturma: `taban$++ a b c` — birden çok öğe ekler
- **Eklendi** N kez döngü: `@ N { }` — tam olarak N kez tekrarla
- **Eklendi** Etiketli döngü sözdizimi: `@:isim { }`, `@:isim!`, `@:isim>` — `@ @isim` / `@! isim` yerine geçer
- **Eklendi** Değişken kapsam kuralları: `_isim` değişkenleri tam blok kapsamına sahiptir; `\ var` erken yok eder
- **Eklendi** Eşleme karşılaştırma kalıpları: `< 0 :`, `> 5 :`, `== 42 :` vb.
- **Eklendi** Modül E013 hatası: modül gövdesinde yürütülebilir ifadeler yasaktır
- **Düzeltildi** `take_variable` artık geri yazarken modül sabitlerini bozmaz
- **Düzeltildi** `alias.CONST` artık doğru çözümlenir; `#>` fonksiyon tanımlarından sonra görünebilir
- **VM** Tam eşitlik: 393/393 test geçer

### v0.0.3 — Unicode Sayısal Sistemler ve LSP İyileştirmeleri _(Nisan 2026)_

- **Eklendi** 69 Unicode basamak bloğu, mod değiştirme tokenı `#d0d9#` ile
- **Eklendi** Herhangi bir yazı sisteminde Boolean litarelleri — `#१` / `#०`, `#١` / `#٠`, vb.
- **Eklendi** Klingon pIqaD rakamları (CSUR PUA U+F8F0–U+F8F9)
- **Eklendi** `SetNumeralMode` VM opkodu — tree-walker ile tam eşitlik
- **Eklendi** REPL, yankı ve değişken görüntülemede aktif sayısal moda saygı gösterir
- **Değiştirildi** Boolean `>>` çıktısı artık tüm modlarda `#` önekini içerir (`#0` / `#1`)

### v0.0.2_01 — Operatör Yeniden Adlandırma _(30 Mart 2026)_

- **Değiştirildi** `c|..|` → `#,|..|` ve `e|..|` → `#^|..|` — `#` biçim öneki ailesiyle tutarlı
- **Eklendi** Dışa aktarma takma adı: modül üyelerini farklı bir adla yeniden dışa aktar

### v0.0.2 — Koleksiyon API'si Yeniden Tasarımı ve Yükleyiciler _(24 Mart 2026)_

- **Eklendi** Diziler ve dizgiler için birleşik `$` operatör ailesi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Eklendi** Diziler, demetler ve isimlendirilmiş demetler için yıkıcı atama
- **Eklendi** Negatif indeksler (`arr[-1]` = son eleman)
- **Eklendi** Yerel yükleyiciler — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mart 2026)_

- **Eklendi** Bileşik atama `^=`
- **Düzeltildi** Ayrıştırıcı aritmetik köşe durumları; dokümantasyon düzeltmeleri

### v0.0.1 — İlk Halka Açık Sürüm _(22 Mart 2026)_

- Tree-walker yorumlayıcı + kayıt VM (`--vm`, ~4× daha hızlı, ~95% eşitlik)
- Tüm çekirdek yapılar: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tam Unicode tanımlayıcılar, modül sistemi, lambdalar, kapanımlar, hata yönetimi
- REPL, LSP, VS Code eklentisi, biçimlendirici (`zymbol fmt`)

---

_Zymbol-Lang — Sembolik. Evrensel. Değişmez._
