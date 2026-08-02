> **Penafian:** Dokumentasi ini dibuat dan diterjemahkan oleh kecerdasan buatan (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Rujukan kanonik adalah **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dalam repositori jurubahasa.

---

# Manual Zymbol-Lang

> **Disemak untuk v0.0.5 — 2026-05-12**

**Zymbol-Lang** adalah bahasa pengaturcaraan simbolik. Tiada kata kunci — semuanya adalah simbol. Berfungsi secara sama dalam mana-mana bahasa manusia.

- Tiada `if`, `while`, `return` — hanya `?`, `@`, `<~`
- Unicode penuh — pengecam dalam mana-mana bahasa atau emoji
- Bebas bahasa manusia — kod adalah sama di mana-mana

**Versi jurubahasa**: v0.0.5 | **Liputan ujian**: 436/436 (TW ↔ pariti VM)

---

## Pemboleh Ubah & Pemalar

```zymbol
x = 10              // pemboleh ubah boleh berubah
PI := 3.14159       // pemalar — penetapan semula adalah ralat masa jalan
nama = "Aishah"
aktif = #1          // boolean benar
👋 := "Helo"
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

`°` (tanda darjah, U+00B0) memulakan pemboleh ubah secara automatik ke nilai neutral semasa penggunaan pertama:

```zymbol
nombor = [3, 1, 4, 1, 5]
@ n:nombor {
    °jumlah += n    // inisialisasi automatik ke 0 di atas gelung; kekal selepas @
}
>> jumlah ¶         // → 14
```

> `°x` (awalan) berlabuh di atas gelung — hasil boleh dicapai selepas `@`.
> `x°` (akhiran) berlabuh di dalam gelung — hilang apabila gelung berakhir.
> Penjejak pokok sahaja.

---

## Jenis Data

| Jenis | Literal | Tag `#?` | Nota |
|-------|---------|----------|------|
| Int | `42`, `-7` | `###` | 64-bit bertanda |
| Float | `3.14`, `1.5e10` | `##.` | Notasi saintifik OK |
| String | `"teks"` | `##"` | Interpolasi: `"Helo {nama}"` |
| Char | `'A'` | `##'` | Aksara Unicode tunggal |
| Bool | `#1`, `#0` | `##?` | BUKAN nombor — `#1 ≠ 1` |
| Tatasusunan | `[1, 2, 3]` | `##]` | Elemen homogen |
| Tupel | `(a, b)` | `##)` | Kedudukan |
| Tupel Bernama | `(x: 1, y: 2)` | `##)` | Medan bernama |
| Fungsi | rujukan fungsi bernama | `##()` | Kelas pertama; papar `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas pertama; papar `<lambd/N>` |

```zymbol
// Introspeksi jenis — kembalikan (jenis, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output & Input

```zymbol
>> "Helo" ¶                         // ¶ atau \\ untuk baris baru eksplisit
>> "a=" a " b=" b ¶                 // penjajaran — beberapa nilai
>> (arr$#) ¶                        // pengendali postfiks memerlukan ( ) dalam >>

<< nama                             // baca ke pemboleh ubah (tanpa gesaan)
<< "Masukkan nama: " nama           // dengan gesaan
```

> `¶` (AltGr+R pada papan kekunci Sepanyol) dan `\\` adalah baris baru yang setara.

---

## Primitif TUI

Pengendali antara muka terminal untuk program interaktif. Kebanyakannya memerlukan blok `>>| { }` (skrin alternatif + mod raw).

```zymbol
>>| {
    >>!                              // bersih skrin alternatif
    >>~ (1, 1, 0, 10) > "Berjalan"  // baris 1, lajur 1, fg=10 (hijau)
    @~ 1000                          // jeda 1 saat (1000 ms)
    >>~ (2, 1) > "Selesai."
}
// terminal dipulihkan secara automatik semasa keluar
```

```zymbol
// Tekanan kekunci dan saiz terminal
>>| {
    [baris, lajur] = >>?             // tanya dimensi terminal
    >>~ (1, 1) > "Terminal: " baris " x " lajur
    <<| kekunci                      // baca tekanan kekunci (pemblokiran)
    >>~ (2, 1) > "Ditekan: " kekunci
}
```

> `>>!` bersih skrin. `>>?` kembalikan `[baris, lajur]`. `@~ N` tidur N milisaat.
> `<<|` baca satu tekanan kekunci (pemblokiran); `<<|?` mengundi tanpa pemblokiran (kembalikan `'\0'` jika tiada).
> Tupel output kedudukan: `(baris, lajur, BKS, fg, bg)` — mana-mana slot boleh ditinggalkan dengan koma (`>>~ (,,, 196) > "merah"`).
> Topeng BKS: `1`=Tebal, `2`=Condong, `4`=Garis Bawah. Palet ANSI 256-warna (`0`=lalai terminal).
> Penjejak pokok sahaja (kecuali `>>!`, `>>?`, `@~`, `>>~` yang juga berjalan dalam `--vm`).

---

## Pengendali

```zymbol
// Aritmetik
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pembahagian integer)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (penaikan kuasa)

// Perbandingan — tetapkan untuk memeriksa
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logik
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Rentetan

```zymbol
// Dua bentuk penggabungan
nama = "Aishah"
n = 42

>> "Helo " nama " anda ada " n ¶      // penjajaran — dalam >>
keterangan = "Helo {nama}, anda ada {n}"  // interpolasi — di mana-mana
```

```zymbol
s = "Helo Dunia"
panjang = s$#                  // 10
sub = s$[1..4]                 // "Helo"  (berasas 1, akhir inklusif)
ada = s$? "Dunia"              // #1
bahagi = "a,b,c,d"$/ ','       // [a, b, c, d]  (bahagi dengan pembatas)
ganti = s$~~["l":"L"]          // "HeLo Dunia"
ganti1 = s$~~["l":"L":1]       // "HeLo Dunia"  (N pertama sahaja)
baris = "─" $* 20              // "────────────────────"  (ulang N kali)
```

> `+` hanya untuk nombor. Gunakan `,`, penjajaran, atau interpolasi untuk rentetan.

---

## Aliran Kawalan

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "besar" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "sifar" ¶
} _ {
    >> "negatif" ¶
}
```

> Pendakap kerinting `{ }` **wajib** walaupun untuk satu penyataan.

---

## Padanan

```zymbol
// Julat
markah = 85
gred = ?? markah {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> gred ¶    // → B

// Rentetan
warna = "merah"
kod = ?? warna {
    "merah"  => "#FF0000"
    "hijau"  => "#00FF00"
    _        => "#000000"
}

// Corak perbandingan
suhu = -5
keadaan = ?? suhu {
    < 0  => "ais"
    < 20 => "sejuk"
    < 35 => "suam"
    _    => "panas"
}
>> keadaan ¶    // → ais

// Bentuk penyataan (lengan blok)
n = -3
?? n {
    0    => { >> "sifar" ¶ }
    < 0  => { >> "negatif" ¶ }
    _    => { >> "positif" ¶ }
}
```

---

## Gelung

```zymbol
@ i:0..4  { >> i " " }        // julat inklusif:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // dengan langkah:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // terbalik:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

buah = ["epal", "pir", "anggur"]
@ b:buah { >> b ¶ }           // for-each tatasusunan

@ c:"helo" { >> c "-" }
>> ¶                          // → h-e-l-o-  (for-each rentetan)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> teruskan
    ? i > 7 { @! }             // @! henti
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Gelung tidak terhingga
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Gelung berlabel (henti bersarang)
kiraan = 0
@:luar {
    kiraan++
    ? kiraan >= 3 { @:luar! }
}
>> kiraan ¶                    // → 3
```

---

## Fungsi

```zymbol
tambah(a, b) { <~ a + b }
>> tambah(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Fungsi mempunyai **skop terpencil** — tidak boleh membaca pemboleh ubah luar. Gunakan parameter output `<~` untuk mengubah suai pemboleh ubah pemanggil:

```zymbol
tukar(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
tukar(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fungsi bernama adalah **nilai kelas pertama** — hantar terus: `nombor$> dua_kali`. Untuk membungkus: `x -> fungsi(x)` juga sah.

---

## Lambda & Penutupan

```zymbol
dua_kali = x -> x * 2
jumlah = (a, b) -> a + b
>> dua_kali(5) ¶    // → 10
>> jumlah(3, 7) ¶   // → 10

// Lambda blok
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "sifar"
}

// Penutupan — tangkap skop luar
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶    // → 21

// Kilang
buat_penambah(n) { <~ x -> x + n }
tambah10 = buat_penambah(10)
>> tambah10(5) ¶    // → 15

// Dalam tatasusunan
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Tatasusunan

Tatasusunan bersifat **boleh berubah** dan menyimpan elemen dengan **jenis yang sama**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — capaian (berasas 1: elemen pertama)
x = arr[-1]     // 5 — indeks negatif (elemen terakhir)
x = arr$#       // 5 — panjang (gunakan (arr$#) dalam >>)

arr = arr$+ 6            // tambah → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sisip di kedudukan 2 (berasas 1)
arr3 = arr$- 3           // padam kemunculan pertama nilai
arr4 = arr$-- 3          // padam semua kemunculan
arr5 = arr$-[1]          // padam di indeks 1 (elemen pertama)
arr6 = arr$-[2..3]       // padam julat (berasas 1, akhir inklusif)

ada = arr$? 3            // #1 — mengandungi
kedudukan = arr$?? 3     // [3] — semua indeks nilai (berasas 1)
hirisan = arr$[1..3]     // [1,2,3] — hirisan (berasas 1, akhir inklusif)
hirisan2 = arr$[1:3]     // [1,2,3] — sama, sintaks berasas kiraan

naik = arr$^+             // diisih menaik  (primitif sahaja)
turun = arr$^-            // diisih menurun (primitif sahaja)

// Tatasusunan tupel bernama/kedudukan — gunakan $^ dengan lambda pembanding
db = [(nama: "Carla", umur: 28), (nama: "Ana", umur: 25), (nama: "Bob", umur: 30)]
ikut_umur  = db$^ (a, b -> a.umur < b.umur)    // menaik mengikut umur (<)
ikut_nama  = db$^ (a, b -> a.nama > b.nama)    // menurun mengikut nama (>)
>> ikut_umur[1].nama ¶     // → Ana
>> ikut_nama[1].nama ¶     // → Carla

// Kemas kini elemen langsung (tatasusunan sahaja)
arr[1] = 99              // tetapkan
arr[2] += 5              // kompaun: +=  -=  *=  /=  %=  ^=

// Kemas kini berfungsi — kembalikan tatasusunan baharu; asal tidak berubah
arr2 = arr[2]$~ 99
```

> Semua pengendali koleksi mengembalikan **tatasusunan baharu**. Tetapkan semula: `arr = arr$+ 4`.
> `$+` boleh dirantai: `arr = arr$+ 5$+ 6$+ 7`. Pengendali lain menggunakan penetapan perantara.
> **Pengindeksan berasas 1**: `arr[1]` adalah elemen pertama; `arr[0]` adalah ralat masa jalan.
> `$^+` / `$^-` isih **tatasusunan primitif** (nombor, rentetan). Untuk tatasusunan tupel gunakan `$^` dengan lambda pembanding — arah dikodkan dalam lambda (`<` = menaik, `>` = menurun).

**Semantik nilai** — menetapkan tatasusunan kepada pemboleh ubah lain mencipta salinan bebas:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b tidak terjejas
```

```zymbol
// Tatasusunan bersarang (pengindeksan berasas 1)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (baris 2, lajur 3)
```

---

## Pemecahan Struktur

```zymbol
// Tatasusunan
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pertama, *baki] = arr       // pertama=10  baki=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ dibuang

// Tupel kedudukan
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tupel bernama
orang = (nama: "Ana", umur: 25, bandar: "Kuala Lumpur")
(nama: n, umur: a) = orang   // n="Ana"  a=25
```

---

## Tupel

Tupel bersifat **tidak boleh berubah** dan merupakan bekas tertib yang boleh menyimpan nilai dengan **jenis berbeza**.
Tidak seperti tatasusunan, elemen tidak boleh diubah selepas penciptaan.

```zymbol
// Kedudukan — jenis campuran dibenarkan
titik = (10, 20)
>> titik[1] ¶    // → 10

data = (42, "helo", #1, 3.14)
>> data[3] ¶     // → #1

// Bernama
orang = (nama: "Aishah", umur: 25)
>> orang.nama ¶    // → Aishah
>> orang[1] ¶      // → Aishah  (indeks juga berfungsi, berasas 1)

// Bersarang
kedudukan = (x: 10, y: 20)
p = (kedudukan: kedudukan, label: "asal")
>> p.kedudukan.x ¶        // → 10
```

**Ketidakbolehubahan** — sebarang percubaan untuk mengubah suai elemen tupel adalah ralat masa jalan:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ ralat masa jalan: tupel tidak boleh berubah
// t[1] += 5    // ❌ ralat yang sama
```

Untuk mendapatkan nilai yang diubah suai gunakan `$~` (kemas kini berfungsi) — mengembalikan tupel **baharu**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asal tidak berubah
>> t2 ¶    // → (10, 999, 30)

// Tupel bernama — bina semula secara eksplisit
orang = (nama: "Aishah", umur: 25)
lebih_tua  = (nama: orang.nama, umur: 26)
>> orang.umur ¶       // → 25
>> lebih_tua.umur ¶   // → 26
```

---

## Fungsi Tertib Tinggi

```zymbol
nombor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

digandakan  = nombor$> (x -> x * 2)                    // map  → [2,4,6…20]
genap       = nombor$| (x -> x % 2 == 0)               // filter → [2,4,6,8,10]
total       = nombor$< (0, (terkumpul, x) -> terkumpul + x)  // reduce → 55

// Rantai melalui perantara
langkah1 = nombor$| (x -> x > 3)
langkah2 = langkah1$> (x -> x * x)
>> langkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi bernama boleh dihantar terus ke HOF
dua_kali(x) { <~ x * 2 }
adalah_besar(x) { <~ x > 5 }
r = nombor$> dua_kali       // ✅ rujukan terus
r = nombor$| adalah_besar   // ✅ rujukan terus
```

---

## Pengendali Paip

RHS sentiasa memerlukan `_` sebagai pemegang tempat untuk nilai yang dipaipkan:

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
naik = x -> x + 1

r1 = 5 |> dua_kali(_)        // → 10
r2 = 10 |> tambah(_, 5)      // → 15
r3 = 5 |> tambah(2, _)       // → 7

// Berantai
r = 5 |> dua_kali(_) |> naik(_) |> dua_kali(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Pengendalian Ralat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "bahagi dengan sifar" ¶
} :! {
    >> "lain: " _err ¶    // _err menyimpan mesej ralat
} :> {
    >> "sentiasa berjalan" ¶
}
```

| Jenis | Bila |
|-------|------|
| `##Div` | Bahagi dengan sifar |
| `##IO` | Fail / sistem |
| `##Index` | Indeks di luar julat |
| `##Type` | Ketidakpadanan jenis |
| `##Parse` | Penghuraian data |
| `##Network` | Ralat rangkaian |
| `##_` | Sebarang ralat (tangkap semua) |

---

## Modul

```zymbol
// lib/kira.zy — badan modul dirangkumkan dalam pendakap kerinting
# kira {
    #> { tambah, dapatkan_PI }

    _PI := 3.14159
    tambah(a, b) { <~ a + b }
    dapatkan_PI() { <~ _PI }
}
```

```zymbol
// utama.zy
<# ./lib/kira => k    // alias diperlukan

>> k::tambah(5, 3) ¶     // → 8
pi = k::dapatkan_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksport dengan nama awam berbeza
# libku {
    #> { _tambah_dalaman => jumlah }

    _tambah_dalaman(a, b) { <~ a + b }
}
```

```zymbol
<# ./libku => m

>> m::jumlah(3, 4) ¶    // → 7  (nama dalaman _tambah_dalaman disembunyikan)
```

> **Peraturan modul**: hanya `#>`, definisi fungsi, dan inisialisasi pemboleh ubah/pemalar literal dibenarkan dalam `# nama { }`. Penyataan boleh laksana (`>>`, `<<`, gelung, dll.) menimbulkan ralat E013.

---

## Mod Nombor

Zymbol boleh memaparkan nombor dalam **69 skrip digit Unicode** — Devanagari, Arab-Indik, Thai, Klingon pIqaD, Matematik Tebal, segmen LCD, dan banyak lagi. Mod aktif hanya mempengaruhi output `>>`; aritmetik dalaman sentiasa perduaan.

### Mengaktifkan skrip

Tulis digit `0` dan `9` skrip sasaran yang dirangkum dalam `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indik   (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tetapkan semula ke ASCII
```

### Output dan boolean

```zymbol
x = 42
>> x ¶          // → 42   (lalai ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (titik perpuluhan sentiasa ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: awalan # sentiasa ASCII, digit menyesuaikan
>> #1 ¶         // → #१   (benar dalam Devanagari)
>> #0 ¶         // → #०   (palsu — berbeza daripada ०  integer sifar)

x = 28 > 4
>> x ¶          // → #१   (hasil perbandingan mengikut mod aktif)
```

### Literal digit asli dalam kod sumber

Digit skrip yang disokong adalah literal sah — dalam julat, modulo, perbandingan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal boolean dalam mana-mana skrip

`#` + digit `0` atau `1` daripada mana-mana blok adalah literal boolean yang sah:

```zymbol
#٠٩#
نشط = #١        // sama dengan #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **sentiasa ASCII**. `#0` (palsu) sentiasa berbeza secara visual daripada `0` (integer sifar) dalam setiap skrip.

---

## Pengendali Data

```zymbol
// Tukar jenis
f = ##.42         // → 42.0  (ke Float)
i = ###3.7        // → 4     (ke Int, bulatkan)
t = ##!3.7        // → 3     (ke Int, potong)

// Urai rentetan kepada nombor
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (selamat gagal, tiada ralat)

// Bulatkan / potong
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (bulatkan ke 2 titik perpuluhan)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (potong)

// Format nombor
fmt = #,|1234567|      // → 1,234,567  (dipisah koma)
sci = #^|12345.678|    // → 1.2345678e4  (saintifik)

// Literal asas
a = 0x41         // → 'A'  (heks)
b = 0b01000001   // → 'A'  (perduaan)
c = 0o101        // → 'A'  (oktal)

// Output penukaran asas
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tarikh = <\ date +%Y-%m-%d \>     // tangkap stdout (termasuk \n akhir)
>> "Hari ini: " tarikh

fail = "data.txt"
kandungan = <\ cat {fail} \>       // interpolasi dalam arahan

output = </"./subskrip.zy"/>       // jalankan skrip Zymbol lain, tangkap output
>> output
```

> `><` menangkap argumen CLI sebagai tatasusunan rentetan (penjejak pokok sahaja).

---

## Contoh Lengkap: FizzBuzz

```zymbol
klasifikasi(nombor) {
    ? nombor % 15 == 0 { <~ "FizzBuzz" }
    _? nombor % 3  == 0 { <~ "Fizz" }
    _? nombor % 5  == 0 { <~ "Buzz" }
    _ { <~ nombor }
}

@ i:1..20 { >> klasifikasi(i) ¶ }
```

---

## Rujukan Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|---------|--------|---------|
| `=` | pemboleh ubah | `$#` | panjang |
| `:=` | pemalar | `$+` | tambah (boleh dirantai) |
| `>>` | output | `$+[i]` | sisip di indeks (berasas 1) |
| `<<` | input | `$-` | padam pertama mengikut nilai |
| `¶` / `\\` | baris baru | `$--` | padam semua mengikut nilai |
| `?` | jika | `$-[i]` | padam di indeks (berasas 1) |
| `_?` | atau jika | `$-[i..j]` | padam julat (berasas 1) |
| `_` | lain / kad liar | `$?` | mengandungi |
| `??` | padanan | `$??` | cari semua indeks (berasas 1) |
| `@` | gelung | `$[s..e]` | hirisan (berasas 1) |
| `@ N { }` | gelung N kali (N ulangan) | `$>` | peta |
| `@!` | henti | `$\|` | tapis |
| `@>` | teruskan | `$<` | kurangkan |
| `@:nama { }` | gelung berlabel | `$/ pembatas` | pisah rentetan |
| `@:nama!` | henti label | `$++ a b c` | bina gabungan |
| `@:nama>` | teruskan label | `arr[i>j>k]` | indeks navigasi |
| `->` | lambda | `arr[i] = val` | kemas kini elemen (tatasusunan sahaja) |
| `arr[i] += val` | kemas kini kompaun | `arr[i]$~` | kemas kini berfungsi (salinan baharu) |
| `$^+` | isih menaik (primitif) | `$^-` | isih menurun (primitif) |
| `$^` | isih dengan pembanding (tupel) | `<~` | kembalikan |
| `\|>` | paip | `!?` | cuba |
| `:!` | tangkap | `:>` | akhirnya |
| `#1` | benar | `#0` | palsu |
| `$!` | adakah ralat | `$!!` | sebarkan ralat |
| `<#` | import | `#>` | eksport |
| `#` | isytihar modul | `::` | panggilan modul |
| `.` | capaian medan | `#?` | metadata jenis |
| `#\|..\|` | urai nombor | `##.` | tukar ke Float |
| `###` | tukar ke Int (bulatkan) | `##!` | tukar ke Int (potong) |
| `#.N\|..\|` | bulatkan | `#!N\|..\|` | potong |
| `#,\|..\|` | format koma | `#^\|..\|` | saintifik |
| `#d0d9#` | tukar mod nombor | `#09#` | tetapkan semula ke ASCII |
| `<\ ..\>` | jalankan shell | `>\<` | argumen CLI |
| `\ var` | musnahkan pemboleh ubah eksplisit | `°x` / `x°` | definisi panas (inisialisasi auto) |
| `>>|` | blok TUI (skrin alt) | `>>~` | output berkedudukan |
| `>>!` | bersih skrin | `>>?` | tanya saiz terminal |
| `<<\|` | tekanan kekunci pemblokiran | `<<\|?` | tekanan kekunci bukan pemblokiran |
| `@~ N` | tidur N milisaat | `$*` | ulang rentetan N kali |

---

## Log Perubahan Keluaran

### v0.0.5 — Primitif TUI, Definisi Panas & Pengulangan Rentetan _(Mei 2026)_

- **Perubahan memecah** Pemisah lengan padanan: `pattern : result` → `pattern => result`
- **Perubahan memecah** Alias import: `<# path <= alias` → `<# path => alias`
- **Perubahan memecah** Nama semula eksport: `#> { fn <= pub }` → `#> { fn => pub }`
- **Ditambah** Blok TUI `>>| { }` — skrin alternatif + mod raw; dibersihkan semasa keluar
- **Ditambah** Output berkedudukan `>>~ (baris, lajur, BKS, fg, bg) > item` — slot jarang, ANSI 256-warna
- **Ditambah** Input kekunci `<<| var` (pemblokiran) dan `<<|? var` (pengundian bukan pemblokiran)
- **Ditambah** `>>!` bersih skrin, `>>?` tanya saiz terminal, `@~ N` tidur N milisaat
- **Ditambah** Definisi panas `°x` / `x°` — inisialisasi automatik pemboleh ubah semasa penggunaan pertama dalam gelung
- **Ditambah** Pengulangan rentetan `str $* N` — ulang rentetan N kali
- **VM** Pariti: 436/436 ujian lulus

### v0.0.4 — Pengindeksan Berasas 1, Fungsi Kelas Pertama & Blok Modul _(April 2026)_

- **Perubahan memecah** Semua pengindeksan beralih kepada **berasas 1** — `arr[1]` adalah elemen pertama; `arr[0]` adalah ralat masa jalan
- **Ditambah** Fungsi bernama adalah **nilai kelas pertama** — hantar terus ke HOF: `nombor$> dua_kali`
- **Ditambah** Sintaks **blok** modul diperlukan: `# nama { ... }` — sintaks rata dibuang
- **Ditambah** Pengindeksan berbilang dimensi: `arr[i>j>k]` (navigasi), `arr[p ; q]` (pengekstrakan rata)
- **Ditambah** Tukar jenis: `##.eksp` (Float), `###eksp` (Int bulatkan), `##!eksp` (Int potong)
- **Ditambah** Pisah rentetan: `str$/ pembatas` — mengembalikan `Array(String)`
- **Ditambah** Bina gabungan: `asas$++ a b c` — menambahkan beberapa item
- **Ditambah** Gelung N kali: `@ N { }` — ulang tepat N kali
- **Ditambah** Sintaks gelung berlabel: `@:nama { }`, `@:nama!`, `@:nama>` — menggantikan `@ @nama` / `@! nama`
- **Ditambah** Peraturan skop pemboleh ubah: pemboleh ubah `_nama` mempunyai skop blok tepat; `\ var` musnahkan lebih awal
- **Ditambah** Corak perbandingan padanan: `< 0 :`, `> 5 :`, `== 42 :` dll.
- **Ditambah** Ralat modul E013: penyataan boleh laksana dalam badan modul dilarang
- **Diperbaiki** `take_variable` tidak lagi merosakkan pemalar modul semasa write-back
- **Diperbaiki** `alias.CONST` kini diselesaikan dengan betul; `#>` boleh muncul selepas definisi fungsi
- **VM** Pariti penuh: 393/393 ujian lulus

### v0.0.3 — Sistem Nombor Unicode & Penambahbaikan LSP _(April 2026)_

- **Ditambah** 69 blok digit Unicode dengan token tukar mod `#d0d9#`
- **Ditambah** Literal boolean dalam mana-mana skrip — `#१` / `#०`, `#١` / `#٠`, dll.
- **Ditambah** Digit Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ditambah** Opkod VM `SetNumeralMode` — pariti penuh dengan penjejak pokok
- **Ditambah** REPL menghormati mod nombor aktif dalam echo dan paparan pemboleh ubah
- **Diubah** Output boolean `>>` kini menyertakan awalan `#` (`#0` / `#1`) dalam semua mod

### v0.0.2_01 — Nama Semula Pengendali _(30 Mac 2026)_

- **Diubah** `c|..|` → `#,|..|` dan `e|..|` → `#^|..|` — konsisten dengan keluarga awalan format `#`
- **Ditambah** Alias eksport: eksport semula ahli modul dengan nama berbeza

### v0.0.2 — Reka Bentuk Semula API Koleksi & Pemasang _(24 Mac 2026)_

- **Ditambah** Keluarga pengendali `$` bersepadu untuk tatasusunan dan rentetan (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ditambah** Penetapan pemecahan struktur untuk tatasusunan, tupel, dan tupel bernama
- **Ditambah** Indeks negatif (`arr[-1]` = elemen terakhir)
- **Ditambah** Pemasang asli — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mac 2026)_

- **Ditambah** Penetapan kompaun `^=`
- **Diperbaiki** Kes tepi aritmetik penghurai; pembetulan dokumentasi

### v0.0.1 — Keluaran Awam Pertama _(22 Mac 2026)_

- Jurubahasa penjejak pokok + VM register (`--vm`, ~4× lebih pantas, ~95% pariti)
- Semua binaan teras: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengecam Unicode penuh, sistem modul, lambda, penutupan, pengendalian ralat
- REPL, LSP, sambungan VS Code, pemformat (`zymbol fmt`)

---

_Zymbol-Lang — Simbolik. Universal. Tidak Boleh Berubah._
