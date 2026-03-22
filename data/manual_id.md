# Panduan Ringkas Zymbol-Lang

**Zymbol-Lang** adalah bahasa pemrograman simbolis. Tidak menggunakan kata kunci — semuanya adalah simbol. Bekerja dengan cara yang sama di semua bahasa manusia.

---

> **Peringatan:** Dokumentasi ini dibuat dan diterjemahkan oleh kecerdasan buatan (AI).
> Segala upaya telah dilakukan untuk memastikan keakuratan, namun beberapa terjemahan atau contoh mungkin mengandung kesalahan.
> Referensi kanonik adalah [spesifikasi Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.

---

## Filosofi

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

### Penugasan Majemuk

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %= 4    // 2
x++       // 3
x--       // 2
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

---

## Keluaran dan Masukan

```zymbol
// Keluaran — TIDAK menambahkan baris baru secara otomatis
>> "Halo" ¶                    // ¶ atau \\ untuk baris baru eksplisit
>> "a=" a " b=" b ¶            // beberapa nilai ditulis berdampingan
>> "jumlah=" jumlah(2, 3) ¶    // pemanggilan fungsi di posisi mana pun
>> (larik$#) ¶                 // operator postfix memerlukan tanda kurung

// Masukan
<< nilai                       // tanpa perintah — membaca ke variabel
<< "Masukkan nama: " nama      // dengan perintah
```

> `¶` atau `\\` setara sebagai baris baru.

---

## Penggabungan String

Tiga bentuk yang valid — masing-masing untuk konteksnya sendiri:

```zymbol
nama = "Ani"
n = 25

// 1. Koma — dalam penugasan dengan = atau :=
pesan = "Halo ", nama, "!"            // → Halo Ani!
JUDUL := "Pengguna: ", nama

// 2. Penjajaran — dalam keluaran >>
>> "Halo " nama " berusia " n ¶       // → Halo Ani berusia 25

// 3. Interpolasi — dalam konteks apa pun
keterangan = "Halo {nama}, usia {n}"  // → Halo Ani, usia 25
```

> **Catatan**: `+` hanya untuk angka. Menggunakannya pada string akan menghasilkan peringatan.

---

## Kendali Aliran

```zymbol
x = 7

// Kondisi sederhana
? x > 0 { >> "positif" ¶ }

// Kondisi / jika tidak / lainnya
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

Blok `{ }` **wajib**, bahkan untuk satu baris.

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

// Pencocokan dengan penjaga (kondisi sewenang-wenang)
suhu = -5
kondisi = ?? suhu {
    _? suhu < 0  : "beku"
    _? suhu < 20 : "dingin"
    _? suhu < 35 : "hangat"
    _            : "panas"
}
>> kondisi ¶    // → beku

// Pencocokan dengan string
warna = "merah"
kode = ?? warna {
    "merah"  : "#FF0000"
    "hijau"  : "#00FF00"
    _        : "#000000"
}
>> kode ¶
```

---

## Perulangan

```zymbol
// Rentang inklusif: 0..4 iterasi pada 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Rentang dengan langkah
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Rentang terbalik
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Perulangan kondisi (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Untuk setiap elemen
buah = ["apel", "mangga", "jeruk"]
@ b:buah { >> b ¶ }

// Iterasi karakter string
@ c:"halo" { >> c "-" }
>> ¶    // → h-a-l-o-

// Henti dan Lanjut
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> lanjut
    ? i > 7 { @! }          // @! henti
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Fungsi

```zymbol
// Pendefinisian dan pemanggilan
jumlah(a, b) { <~ a + b }
>> jumlah(3, 4) ¶    // → 7

// Rekursi
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120

// Fungsi memiliki cakupan terisolasi — tidak dapat mengakses variabel luar
global = 100
uji() {
    x = 42    // hanya lokal
    <~ x
}
>> uji() ¶    // → 42
```

> **Penting**: Fungsi bernama `nama(parameter){ }` bukan nilai kelas pertama.
> Untuk meneruskannya sebagai argumen, bungkus: `x -> jumlah(x)`.

---

## Lambda dan Penutupan

```zymbol
// Lambda sederhana (kembalian implisit)
ganda = x -> x * 2
jumlah = (a, b) -> a + b
>> ganda(5) ¶     // → 10
>> jumlah(3, 7) ¶  // → 10

// Lambda blok (kembalian eksplisit)
klasifikasi_nilai = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "nol"
}
>> klasifikasi_nilai(5) ¶     // → positif
>> klasifikasi_nilai(0) ¶     // → nol
>> klasifikasi_nilai(-5) ¶    // → negatif

// Penutupan — lambda menangkap variabel luar
faktor = 3
tiga_kali = x -> x * faktor    // 'faktor' ditangkap
>> tiga_kali(7) ¶    // → 21

// Pabrik fungsi
buat_penambah(n) { <~ x -> x + n }
tambah_sepuluh = buat_penambah(10)
>> tambah_sepuluh(5) ¶    // → 15

// Lambda sebagai nilai: disimpan dalam larik
operasi = [x -> x+1, x -> x*2, x -> x*x]
>> operasi[0](5) ¶    // → 6
>> operasi[2](5) ¶    // → 25
```

---

## Larik

```zymbol
larik = [10, 20, 30, 40, 50]

// Akses (indeks berbasis 0)
>> larik[0] ¶    // → 10

// Panjang (perlu tanda kurung dalam >>)
n = larik$#
>> (larik$#) ¶    // → 5

// Tambah, hapus, periksa, potong
larik = larik$+ 60               // tambah
larik = larik$- 0                // hapus indeks ke-0
ada = larik$? 30                 // → #1
irisan = larik$[0..2]            // [20, 30]

// Perbarui elemen
larik[1] = 99

// Iterasi setiap elemen
@ x:larik { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` mengembalikan **larik baru** — tugaskan ulang: `larik = larik$+ 4`.
> Tidak bisa dirantai: gunakan dua penugasan terpisah.

---

## Tupel

```zymbol
// Tupel bernama
orang = (nama: "Alisa", usia: 25)
>> orang.nama ¶    // → Alisa
>> orang.usia ¶    // → 25
>> orang[0] ¶      // → Alisa (indeks juga berfungsi)
```

---

## Fungsi Tingkat Tinggi

Operator HOF memerlukan **lambda inline** — variabel lambda langsung tidak dapat digunakan.

```zymbol
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
gandaan = angka$> (x -> x * 2)
>> gandaan ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
genap = angka$| (x -> x % 2 == 0)
>> genap ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (nilai awal, (akumulator, elemen) -> ekspresi)
total = angka$< (0, (akum, x) -> akum + x)
>> total ¶    // → 55
```

---

## Penanganan Kesalahan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Pembagian dengan nol" ¶
} :! ##IO {
    >> "Kesalahan I/O" ¶
} :! {
    >> "kesalahan lain: " _err ¶
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
// Berkas: lib/matematika.zy
# matematika

#> { tambah, get_PI }    // ekspor SEBELUM definisi

_PI := 3.14159
tambah(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Berkas: utama.zy
<# ./lib/matematika <= m    // alias wajib

>> m::tambah(5, 3) ¶   // → 8
pi = m::get_PI()
>> pi ¶                // → 3.14159
```

---

## FizzBuzz

```zymbol
// FizzBuzz — Bahasa Indonesia
// Pengidentifikasi dalam Bahasa Indonesia. Operator selalu simbolis.

>> "Halo, Dunia Berbahasa Indonesia!" ¶

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
| `=`       | Variabel                 | `$#`       | Panjang                       |
| `:=`      | Konstanta                | `$+`       | Tambah                        |
| `>>`      | Keluaran                 | `$-`       | Hapus (dengan indeks)         |
| `<<`      | Masukan                  | `$?`       | Periksa keberadaan            |
| `¶`/`\`   | Baris baru               | `$[s..e]`  | Potong                        |
| `?`       | kondisi (if)             | `$>`       | map                           |
| `_?`      | jika tidak (elif)        | `$\|`      | filter                        |
| `_`       | lainnya / wildcard       | `$<`       | reduce                        |
| `??`      | cocokkan (match)         | `!?`       | coba (try)                    |
| `@`       | Perulangan               | `:!`       | tangkap (catch)               |
| `@!`      | henti (break)            | `:>`       | selalu (finally)              |
| `@>`      | lanjut (continue)        | `$!`       | periksa kesalahan             |
| `->`      | Lambda                   | `$!!`      | teruskan kesalahan            |
| `<~`      | kembalikan (return)      | `#`        | deklarasi modul               |
| `\|>`     | Pipa (pipe)              | `#>`       | ekspor                        |
| `#1`      | benar                    | `<#`       | impor                         |
| `#0`      | salah                    | `::`       | pemanggilan modul             |

---

*Zymbol-Lang — Simbolis. Universal. Tak Berubah.*

---

> **Peringatan:** Dokumentasi ini dibuat dan diterjemahkan oleh kecerdasan buatan (AI).
> Segala upaya telah dilakukan untuk memastikan keakuratan, namun beberapa terjemahan atau contoh mungkin mengandung kesalahan.
> Referensi kanonik adalah [spesifikasi Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
