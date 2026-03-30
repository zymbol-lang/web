# Panduan Ringkas Zymbol-Lang

**Zymbol-Lang** adalah bahasa pemrograman simbolis. Tidak menggunakan kata kunci — semuanya adalah simbol. Bekerja dengan cara yang sama di semua bahasa manusia.

- Tidak ada kata kunci (`if`, `while`, `return` tidak ada — hanya simbol `?`, `@`, `<~`)
- Dukungan Unicode penuh — pengenal dalam bahasa atau emoji apa pun 👋
- Bebas bahasa — kode identik di semua bahasa

---

## Variabel dan Konstanta

```zymbol
x = 10           // Variabel (dapat diubah)
PI := 3.14159    // Konstanta (tidak dapat diubah — kesalahan jika ditugaskan ulang)
nama = "Ani"
aktif = #1       // boolean benar
👋 := "Halo"
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

## Tabel Tipe Data

| Tipe             | Contoh              | Simbol `#?` | Catatan                                |
|------------------|---------------------|-------------|----------------------------------------|
| Bilangan Bulat   | `42`, `-7`          | `###`       | 64-bit bertanda                        |
| Bilangan Desimal | `3.14`, `1.5e10`    | `##.`       | Notasi ilmiah didukung                 |
| String           | `"halo"`            | `##"`       | Interpolasi: `"Halo {nama}"`           |
| Karakter         | `'A'`               | `##'`       | Satu karakter Unicode                  |
| Boolean          | `#1`, `#0`          | `##?`       | BUKAN angka 1 dan 0                    |
| Larik            | `[1, 2, 3]`         | `##]`       | Semua elemen bertipe sama              |
| Tupel            | `(a, b)`            | `##)`       | Berdasarkan posisi                     |
| Tupel Bernama    | `(x: 1, y: 2)`      | `##)`       | Akses dengan nama atau indeks          |

```zymbol
// Introspeksi tipe — mengembalikan (tipe, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Keluaran dan Masukan

```zymbol
>> "Halo" ¶                    // ¶ atau \\ untuk baris baru eksplisit
>> "a=" a " b=" b ¶            // beberapa nilai ditulis berdampingan
>> (larik$#) ¶                 // operator postfix memerlukan tanda kurung

<< nilai                       // tanpa perintah — membaca ke variabel
<< "Masukkan nama: " nama      // dengan perintah
```

> `¶` atau `\\` setara sebagai baris baru.

---

## Operator

```zymbol
// Aritmatika
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (pembagian integer)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (perpangkatan)

// Perbandingan
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## String

Tiga bentuk yang valid — masing-masing untuk konteksnya sendiri:

```zymbol
nama = "Ani"
n = 25

// 1. Koma — dalam penugasan dengan = atau :=
pesan = "Halo ", nama, "!"            // → Halo Ani!

// 2. Penjajaran — dalam keluaran >>
>> "Halo " nama " berusia " n ¶       // → Halo Ani berusia 25

// 3. Interpolasi — dalam konteks apa pun
keterangan = "Halo {nama}, usia {n}"  // → Halo Ani, usia 25
```

```zymbol
s = "Halo Dunia"
pjg = s$#                  // 10
sub = s$[0..4]             // "Halo"  (akhir eksklusif)
ada = s$? "Dunia"          // #1
bagi = "a,b,c,d" / ','     // [a, b, c, d]
ganti = s$~~["a":"e"]       // ganti
ganti1 = s$~~["a":"e":1]    // N pertama
```

> `+` hanya untuk angka. Untuk string gunakan `,`, penjajaran, atau interpolasi.

---

## Kendali Aliran

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "besar" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "nol" ¶
} _ {
    >> "negatif" ¶
}
```

> Blok `{ }` **wajib**, bahkan untuk satu baris.

---

## Pencocokan

```zymbol
// Pencocokan dengan rentang
skor = 85
nilai = ?? skor {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nilai ¶    // → B

// Pencocokan dengan string
warna = "merah"
kode = ?? warna {
    "merah"  : "#FF0000"
    "hijau"  : "#00FF00"
    _        : "#000000"
}

// Pencocokan dengan penjaga
suhu = -5
kondisi = ?? suhu {
    _? suhu < 0  : "beku"
    _? suhu < 20 : "dingin"
    _? suhu < 35 : "hangat"
    _            : "panas"
}
>> kondisi ¶    // → beku

// Bentuk pernyataan (lengan blok)
?? n {
    0       : { >> "nol" ¶ }
    _? n < 0: { >> "negatif" ¶ }
    _       : { >> "positif" ¶ }
}
```

---

## Perulangan

```zymbol
@ i:0..4  { >> i " " }        // rentang inklusif:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // dengan langkah:     1 3 5 7 9
@ i:5..0:1 { >> i " " }       // terbalik:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

buah = ["apel", "mangga", "jeruk"]
@ b:buah { >> b ¶ }           // untuk setiap larik

@ c:"halo" { >> c "-" }
>> ¶                          // → h-a-l-o-  (untuk setiap string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> lanjut
    ? i > 7 { @! }             // @! henti
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Perulangan tak terbatas
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Perulangan berlabel (henti bersarang)
count = 0
@ @luar {
    count++
    ? count >= 3 { @! luar }
}
>> count ¶                    // → 3
```

---

## Fungsi

```zymbol
jumlah(a, b) { <~ a + b }
>> jumlah(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Fungsi memiliki **cakupan terisolasi** — tidak dapat membaca variabel luar. Gunakan parameter keluaran `<~` untuk memodifikasi variabel pemanggil:

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

> Fungsi bernama bukan nilai kelas pertama. Untuk meneruskannya sebagai argumen, bungkus: `x -> jumlah(x)`.

---

## Lambda dan Penutupan

```zymbol
ganda = x -> x * 2
jumlah = (a, b) -> a + b
>> ganda(5) ¶    // → 10
>> jumlah(3, 7) ¶  // → 10

// Lambda blok
klasifikasi_nilai = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "nol"
}

// Penutupan — menangkap cakupan luar
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶    // → 21

// Pabrik fungsi
buat_penambah(n) { <~ x -> x + n }
tambah_sepuluh = buat_penambah(10)
>> tambah_sepuluh(5) ¶    // → 15

// Dalam larik
operasi = [x -> x+1, x -> x*2, x -> x*x]
>> operasi[2](5) ¶    // → 25
```

---

## Larik

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — akses (berbasis 0)
arr[-1]         // 5 — indeks negatif (terakhir)
arr$#           // 5 — panjang (gunakan (arr$#) dalam >>)

arr = arr$+ 6            // tambah → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sisipkan di indeks 2
arr3 = arr$- 3           // hapus kemunculan pertama nilai
arr4 = arr$-- 3          // hapus semua kemunculan
arr5 = arr$-[0]          // hapus di indeks
arr6 = arr$-[1..3]       // hapus rentang (akhir eksklusif)

ada = arr$? 3            // #1 — mengandung
pos = arr$?? 3           // [2] — semua indeks nilai
sl = arr$[0..3]          // [1,2,3] — irisan (akhir eksklusif)
sl2 = arr$[0:3]          // [1,2,3] — sama, sintaks berbasis hitungan

naik = arr$^+            // diurutkan naik  (primitif saja)
turun = arr$^-           // diurutkan turun (primitif saja)

// Larik tupel bernama/posisional — gunakan $^ dengan lambda pembanding
db = [(nama: "Carla", usia: 28), (nama: "Ana", usia: 25), (nama: "Bob", usia: 30)]
urut_usia  = db$^ (a, b -> a.usia < b.usia)    // naik berdasarkan usia  (<)
urut_nama  = db$^ (a, b -> a.nama > b.nama)    // turun berdasarkan nama (>)
>> urut_usia[0].nama ¶     // → Ana
>> urut_nama[0].nama ¶     // → Carla

arr[1] = 99              // perbarui di tempat
arr = arr[1]$~ 99        // perbarui fungsional — mengembalikan larik baru
```

> Semua operator koleksi mengembalikan **larik baru**. Tugaskan kembali: `arr = arr$+ 4`.
> Operator tidak dapat dirantai — gunakan penugasan sementara.
> `$^+` / `$^-` mengurutkan **larik primitif** (angka, string). Untuk larik tupel gunakan `$^` dengan lambda pembanding — arah dikodekan dalam lambda (`<` = naik, `>` = turun).

```zymbol
// Larik bersarang
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[1][2] ¶    // → 6
```

---

## Destrukturisasi

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pertama, *sisa] = arr        // pertama=10  sisa=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ diabaikan

// Tuple posisional
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tuple bernama
orang = (nama: "Ana", usia: 25, kota: "Jakarta")
(nama: n, usia: u) = orang   // n="Ana"  u=25
```

---

## Tupel

```zymbol
// Posisional
titik = (10, 20)
>> titik[0] ¶    // → 10

// Bernama
orang = (nama: "Alisa", usia: 25)
>> orang.nama ¶    // → Alisa
>> orang[0] ¶      // → Alisa  (indeks juga berfungsi)

// Bersarang
pos = (x: 10, y: 20)
p = (pos: pos, label: "asal")
>> p.pos.x ¶        // → 10
```

---

## Fungsi Tingkat Tinggi

> Operator HOF memerlukan **lambda inline** — variabel lambda langsung tidak dapat digunakan.

```zymbol
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

gandaan  = angka$> (x -> x * 2)                // map  → [2,4,6…20]
genap    = angka$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = angka$< (0, (akum, x) -> akum + x)  // reduce → 55

// Berantai melalui perantara
langkah1 = angka$| (x -> x > 3)
langkah2 = langkah1$> (x -> x * x)
>> langkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi bernama di dalam HOF — bungkus dalam lambda
gandakan(x) { <~ x * 2 }
r = angka$> (x -> gandakan(x))    // ✅
```

---

## Operator Pipa

Sisi kanan selalu membutuhkan `_` sebagai penanda:

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
tambah_satu = x -> x + 1

5 |> dua_kali(_)        // → 10
10 |> tambah(_, 5)      // → 15
5 |> tambah(2, _)       // → 7

// Berantai
hasil = 5 |> dua_kali(_) |> tambah_satu(_) |> dua_kali(_)
>> hasil ¶    // → 22  (5→10→11→22)
```

---

## Penanganan Kesalahan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Pembagian dengan nol" ¶
} :! {
    >> "kesalahan lain: " _err ¶    // _err menyimpan pesan kesalahan
} :> {
    >> "selalu berjalan" ¶
}
```

| Tipe        | Kapan terjadi                      |
|-------------|------------------------------------|
| `##Div`     | Pembagian dengan nol               |
| `##IO`      | File / Sistem                      |
| `##Index`   | Indeks di luar batas               |
| `##Type`    | Kesalahan tipe                     |
| `##Parse`   | Kesalahan penguraian               |
| `##Network` | Kesalahan jaringan                 |
| `##_`       | Kesalahan apa pun (tangkap semua)  |

---

## Modul

```zymbol
// lib/matematika.zy
# matematika

#> { tambah, get_PI }    // ekspor SEBELUM definisi

_PI := 3.14159
tambah(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — akses konstanta langsung via alias tidak didukung
```

```zymbol
// utama.zy
<# ./lib/matematika <= m    // alias wajib

>> m::tambah(5, 3) ¶   // → 8
pi = m::get_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Ekspor dengan nama publik berbeda
# mylib
#> { _tambah_internal <= jumlah }

_tambah_internal(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::jumlah(3, 4) ¶    // → 7  (nama internal _tambah_internal tersembunyi)
```

---

## Operator Data

```zymbol
// Parsing string ke angka
v1 = #|"42"|      // → 42
v2 = #|"3.14"|    // → 3.14
v3 = #|"abc"|     // → "abc"

// Pembulatan / pemotongan
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Format angka
fmt = #,|1234567|       // → 1,234,567
sains = #^|12345.678|   // → 1.2345678e4

// Literal basis
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Konversi basis
heks = 0x|255|    // → "0x00FF"
biner = 0b|65|    // → "0b1000001"
oktal = 0o|8|     // → "0o10"
desimal = 0d|255| // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tanggal = <\ date +%Y-%m-%d \>     // tangkap stdout
>> "Hari ini: " tanggal

berkas = "data.txt"
isi = <\ cat {berkas} \>           // interpolasi dalam perintah

keluaran = </"./subscript.zy"/>    // jalankan skrip Zymbol
>> keluaran
```

> `><` menangkap argumen CLI sebagai array string (hanya tree-walker).

---

## Contoh Lengkap: FizzBuzz

```zymbol
klasifikasi(angka) {
    ? angka % 15 == 0 { <~ "DesisDengung" }
    _? angka % 3  == 0 { <~ "Desis" }
    _? angka % 5  == 0 { <~ "Dengung" }
    _ { <~ angka }
}

@ i:1..20 { >> klasifikasi(i) ¶ }
```

---

## Referensi Simbol

| Simbol    | Operasi                  | Simbol     | Operasi                       |
|-----------|--------------------------|------------|-------------------------------|
| `=`       | variabel                 | `$#`       | panjang                       |
| `:=`      | konstanta                | `$+`       | tambah                        |
| `>>`      | keluaran                 | `$+[i]`    | sisipkan di indeks            |
| `<<`      | masukan                  | `$-`       | hapus pertama berdasarkan nilai |
| `¶` / `\\` | baris baru              | `$--`      | hapus semua berdasarkan nilai |
| `?`       | kondisi (if)             | `$-[i]`    | hapus di indeks               |
| `_?`      | jika tidak (else-if)     | `$-[i..j]` | hapus rentang                 |
| `_`       | lainnya / wildcard       | `$?`       | mengandung                    |
| `??`      | cocokkan (match)         | `$??`      | temukan semua indeks          |
| `@`       | perulangan               | `$[s..e]`  | irisan                        |
| `@!`      | henti (break)            | `$>`       | map                           |
| `@>`      | lanjut (continue)        | `$\|`      | filter                        |
| `->`      | lambda                   | `$<`       | reduce                        |
| `$^+`     | urutkan naik (primitif)  | `$^-`      | urutkan turun (primitif)      |
| `$^`      | urutkan dengan pembanding (tupel) | | |
| `<~`      | kembalikan (return)      | `!?`       | coba (try)                    |
| `\|>`     | pipa (pipe)              | `:!`       | tangkap (catch)               |
| `#1`      | benar                    | `:>`       | selalu (finally)              |
| `#0`      | salah                    | `$!`       | periksa kesalahan             |
| `<#`      | impor                    | `$!!`      | teruskan kesalahan            |
| `#`       | deklarasi modul          | `#>`       | ekspor                        |
| `::`      | pemanggilan modul        | `.`        | akses field                   |
| `#\|..\|` | parsing angka            | `#?`       | metadata tipe                 |
| `#.N\|..\|` | pembulatan             | `#!N\|..\|` | pemotongan                 |
| `c\|..\|` | format koma              | `e\|..\|`  | format ilmiah                 |
| `<\ ..\>` | eksekusi shell           | `>\<`      | argumen CLI                   |

---

*Zymbol-Lang — Simbolis. Universal. Tak Berubah.*

> **Peringatan:** Dokumentasi ini dibuat dan diterjemahkan oleh kecerdasan buatan (AI).
> Segala upaya telah dilakukan untuk memastikan keakuratan, namun beberapa terjemahan atau contoh mungkin mengandung kesalahan.
> Referensi kanonik adalah [spesifikasi Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
