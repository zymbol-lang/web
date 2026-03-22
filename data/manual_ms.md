# Panduan Ringkas Zymbol-Lang

**Zymbol-Lang** ialah bahasa pengaturcaraan simbolik. Ia tidak menggunakan sebarang kata kunci — semuanya adalah simbol. Ia berfungsi sama dalam setiap bahasa manusia.

---

> **Amaran:** Dokumentasi ini dicipta dan diterjemahkan oleh kecerdasan buatan (AI).
> Semua usaha telah dilakukan untuk memastikan ketepatan, tetapi beberapa terjemahan atau contoh mungkin mengandungi kesilapan.
> Rujukan kanonik ialah [spesifikasi Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.

---

## Falsafah

- Tiada kata kunci (`if`, `while`, `return` tidak wujud — hanya simbol `?`, `@`, `<~`)
- Sokongan Unicode penuh — pengecam dalam mana-mana bahasa atau emoji 👋
- Bebas bahasa — kod adalah sama dalam semua bahasa

---

## Pemboleh ubah dan Pemalar

```zymbol
x = 10           // Pemboleh ubah (boleh diubah)
PI := 3.14159    // Pemalar (tidak boleh diubah — ralat jika ditugaskan semula)
nama = "Ani"
aktif = #1       // boolean benar
👋 := "Helo"
```

### Tugasan Kompaun

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

## Jadual Jenis Data

| Jenis              | Contoh              | Simbol `#?` | Nota                                  |
|--------------------|---------------------|-------------|---------------------------------------|
| Integer            | `42`, `-7`          | `###`       | 64-bit bertanda                       |
| Perpuluhan         | `3.14`, `1.5e10`    | `##.`       | Notasi saintifik disokong             |
| Rentetan           | `"helo"`            | `##"`       | Interpolasi: `"Helo {nama}"`          |
| Aksara             | `'A'`               | `##'`       | Satu aksara Unicode                   |
| Boolean            | `#1`, `#0`          | `##?`       | BUKAN nombor 1 dan 0                  |
| Tatasusunan        | `[1, 2, 3]`         | `##]`       | Semua elemen jenis yang sama          |
| Tupel              | `(a, b)`            | `##)`       | Kedudukan                             |
| Tupel Bernama      | `(x: 1, y: 2)`      | `##)`       | Akses dengan nama atau indeks         |

---

## Keluaran dan Masukan

```zymbol
// Keluaran — TIDAK menambah baris baru secara automatik
>> "Helo, Dunia!" ¶               // ¶ atau \\ memberi baris baru yang jelas
>> "a=" a " b=" b ¶               // pelbagai nilai secara berdampingan
>> "jumlah=" jumlah(2, 3) ¶       // panggilan fungsi di mana-mana kedudukan
>> (tatasusunan$#) ¶              // operasi postfix memerlukan kurungan

// Masukan
<< nama                           // tanpa gesaan — baca ke pemboleh ubah
<< "Nama anda? " nama             // dengan gesaan
```

> `¶` atau `\\` adalah setara sebagai baris baru.

---

## Penggabungan Rentetan

Tiga bentuk yang sah — setiap satu untuk konteks tersendiri:

```zymbol
nama = "Siti"
n = 25

// 1. Koma — dalam tugasan dengan = atau :=
mesej = "Helo ", nama, "!"            // → Helo Siti!
TAJUK := "Pengguna: ", nama

// 2. Berdampingan — dalam keluaran >>
>> "Helo " nama " berumur " n ¶       // → Helo Siti berumur 25

// 3. Interpolasi — dalam mana-mana konteks
penerangan = "Helo {nama}, berumur {n} tahun"   // → Helo Siti, berumur 25 tahun
```

> **Nota**: `+` hanya untuk nombor. Menggunakannya pada rentetan akan menghasilkan amaran.

---

## Kawalan Aliran

```zymbol
x = 7

// Syarat mudah
? x > 0 { >> "positif" ¶ }

// Syarat / jika tidak / selainnya
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

Blok `{ }` adalah **wajib**, walaupun untuk satu baris.

---

## Pemadanan

```zymbol
// Pemadanan dengan julat
markah = 85
gred = ?? markah {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> gred ¶    // → B

// Pemadanan dengan penjaga (syarat sewenang-wenangnya)
suhu = -5
keadaan = ?? suhu {
    _? suhu < 0  : "beku"
    _? suhu < 20 : "sejuk"
    _? suhu < 35 : "suam"
    _            : "panas"
}
>> keadaan ¶    // → beku

// Pemadanan dengan rentetan
warna = "merah"
kod = ?? warna {
    "merah" : "#FF0000"
    "hijau"  : "#00FF00"
    _        : "#000000"
}
>> kod ¶
```

---

## Gelung

```zymbol
// Julat inklusif: 0..4 berulang pada 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Julat dengan langkah
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Julat terbalik
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Gelung bersyarat (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Untuk setiap elemen
buah = ["epal", "pisang", "mangga"]
@ b:buah { >> b ¶ }

// Atas aksara rentetan
@ c:"helo" { >> c "-" }
>> ¶    // → h-e-l-o-

// Henti dan Teruskan
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> teruskan
    ? i > 7 { @! }          // @! henti
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Fungsi

```zymbol
// Takrifan dan panggilan
jumlah(a, b) { <~ a + b }
>> jumlah(3, 4) ¶    // → 7

// Rekursi
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120

// Fungsi mempunyai skop terpencil — tidak boleh akses pemboleh ubah luar
global = 100
uji() {
    x = 42    // tempatan sahaja
    <~ x
}
>> uji() ¶    // → 42
```

> **Penting**: Fungsi bernama `nama(parameter){ }` bukan nilai kelas pertama.
> Untuk menyerahkan sebagai argumen, balut: `x -> nama(x)`.

---

## Lambda dan Penutupan

```zymbol
// Lambda mudah (pulangan tersirat)
ganda = x -> x * 2
jumlah = (a, b) -> a + b
>> ganda(5) ¶    // → 10
>> jumlah(3, 7) ¶   // → 10

// Lambda blok (pulangan tersurat)
klasifikasi_nilai = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "sifar"
}
>> klasifikasi_nilai(5) ¶     // → positif
>> klasifikasi_nilai(0) ¶     // → sifar
>> klasifikasi_nilai(-5) ¶    // → negatif

// Penutupan — lambda menangkap pemboleh ubah luar
faktor = 3
tiga_kali = x -> x * faktor    // 'faktor' ditangkap
>> tiga_kali(7) ¶    // → 21

// Kilang fungsi
buat_penambah(n) { <~ x -> x + n }
tambah_sepuluh = buat_penambah(10)
>> tambah_sepuluh(5) ¶    // → 15

// Lambda sebagai nilai: disimpan dalam tatasusunan
operasi = [x -> x+1, x -> x*2, x -> x*x]
>> operasi[0](5) ¶    // → 6
>> operasi[2](5) ¶    // → 25
```

---

## Tatasusunan

```zymbol
tatasusunan = [10, 20, 30, 40, 50]

// Akses (indeks berasas-0)
>> tatasusunan[0] ¶    // → 10

// Panjang (kurungan diperlukan dalam >>)
n = tatasusunan$#
>> (tatasusunan$#) ¶    // → 5

// Tambah, buang, mengandungi, hirisan
tatasusunan = tatasusunan$+ 60               // tambah
tatasusunan = tatasusunan$- 0                // buang indeks ke-0
ada = tatasusunan$? 30                       // → #1
hirisan = tatasusunan$[0..2]                 // [20, 30]

// Kemas kini elemen
tatasusunan[1] = 99

// Untuk setiap elemen
@ x:tatasusunan { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **mengembalikan tatasusunan baru** — tugaskan semula: `tatasusunan = tatasusunan$+ 4`.
> Tiada rantaian: gunakan dua tugasan berasingan.

---

## Tupel

```zymbol
// Tupel bernama
orang = (nama: "Alisa", umur: 25)
>> orang.nama ¶    // → Alisa
>> orang.umur ¶    // → 25
>> orang[0] ¶      // → Alisa (indeks juga berfungsi)
```

---

## Fungsi Tertib Tinggi

Operator HOF memerlukan **lambda sebaris** — pemboleh ubah lambda terus tidak boleh digunakan.

```zymbol
nombor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
gandaan = nombor$> (x -> x * 2)
>> gandaan ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
genap = nombor$| (x -> x % 2 == 0)
>> genap ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (nilai awal, (pengumpul, elemen) -> ungkapan)
jumlah_keseluruhan = nombor$< (0, (terkumpul, x) -> terkumpul + x)
>> jumlah_keseluruhan ¶    // → 55
```

---

## Pengendalian Ralat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Bahagi dengan sifar" ¶
} :! ##IO {
    >> "Ralat I/O" ¶
} :! {
    >> "ralat lain: " _err ¶
} :> {
    >> "sentiasa dijalankan" ¶
}
```

| Jenis       | Bila berlaku                       |
|-------------|------------------------------------|
| `##Div`     | Bahagi dengan sifar                |
| `##IO`      | Fail / Sistem                      |
| `##Index`   | Indeks di luar julat               |
| `##Type`    | Ralat jenis                        |
| `##Parse`   | Ralat penghuraian                  |
| `##Network` | Ralat rangkaian                    |
| `##_`       | Mana-mana ralat (tangkap semua)    |

---

## Modul

```zymbol
// Fail: lib/kiraan.zy
# kiraan

#> { tambah, get_PI }    // Eksport SEBELUM takrifan

_PI := 3.14159
tambah(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fail: utama.zy
<# ./lib/kiraan <= k    // Alias wajib

>> k::tambah(5, 3) ¶   // → 8
pi = k::get_PI()
>> pi ¶                 // → 3.14159
```

---

## Contoh Lengkap: FizzBuzz

```zymbol
klasifikasi(nombor) {
    ? nombor % 15 == 0 { <~ "BuihDengung" }
    _? nombor % 3  == 0 { <~ "Buih" }
    _? nombor % 5  == 0 { <~ "Dengung" }
    _ { <~ nombor }
}

@ i:1..20 { >> klasifikasi(i) ¶ }
```

---

## Rujukan Simbol

| Simbol  | Operasi                | Simbol     | Operasi                       |
|---------|------------------------|------------|-------------------------------|
| `=`     | Pemboleh ubah          | `$#`       | Panjang                       |
| `:=`    | Pemalar                | `$+`       | Tambah                        |
| `>>`    | Keluaran               | `$-`       | Buang (dengan indeks)         |
| `<<`    | Masukan                | `$?`       | Mengandungi                   |
| `¶`/`\` | Baris baru             | `$[s..e]`  | Hirisan                       |
| `?`     | syarat (if)            | `$>`       | peta (map)                    |
| `_?`    | jika tidak (elif)      | `$\|`      | tapis (filter)                |
| `_`     | selainnya / kad liar   | `$<`       | kurangkan (reduce)            |
| `??`    | padankan (match)       | `!?`       | cuba (try)                    |
| `@`     | Gelung                 | `:!`       | tangkap (catch)               |
| `@!`    | henti (break)          | `:>`       | sentiasa (finally)            |
| `@>`    | teruskan (continue)    | `$!`       | adakah ralat                  |
| `->`    | Lambda                 | `$!!`      | sebarkan ralat                |
| `<~`    | pulang (return)        | `#`        | takrifkan modul               |
| `\|>`   | Paip (pipe)            | `#>`       | eksport                       |
| `#1`    | benar                  | `<#`       | import                        |
| `#0`    | palsu                  | `::`       | panggilan modul               |

---

*Zymbol-Lang — Simbolik. Universal. Tidak Berubah.*
