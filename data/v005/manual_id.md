> **Penafian:** Dokumentasi ini dibuat dan diterjemahkan oleh kecerdasan buatan (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referensi kanonik adalah **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** di repositori interpreter.

---

# Manual Zymbol-Lang

> **Direvisi untuk v0.0.5 — 2026-05-12**

**Zymbol-Lang** adalah bahasa pemrograman simbolik. Tanpa kata kunci — semuanya adalah simbol. Bekerja identik dalam bahasa manusia apa pun.

- Tidak ada `if`, `while`, `return` — hanya `?`, `@`, `<~`
- Unicode penuh — pengenal dalam bahasa apa pun atau emoji
- Agnostik bahasa manusia — kode sama di mana saja

**Versi interpreter**: v0.0.5 | **Cakupan tes**: 436/436 (TW ↔ paritas VM)

---

## Variabel & Konstanta

```zymbol
x = 10              // variabel dapat diubah
PI := 3.14159       // konstanta — penugasan ulang adalah error runtime
nama = "Alya"
aktif = #1          // boolean benar
👋 := "Halo"
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

`°` (tanda derajat, U+00B0) menginisialisasi otomatis variabel ke nilai netralnya saat pertama digunakan:

```zymbol
angka = [3, 1, 4, 1, 5]
@ n:angka {
    °total += n    // inisialisasi otomatis ke 0 di atas loop; bertahan setelah @
}
>> total ¶         // → 14
```

> `°x` (prefiks) berlabuh di atas loop — hasil dapat diakses setelah `@`.
> `x°` (postfiks) berlabuh di dalam loop — hilang ketika loop berakhir.
> Hanya tree-walker.

---

## Tipe Data

| Tipe | Literal | Tag `#?` | Catatan |
|------|---------|----------|---------|
| Int | `42`, `-7` | `###` | 64-bit bertanda |
| Float | `3.14`, `1.5e10` | `##.` | Notasi ilmiah OK |
| String | `"teks"` | `##"` | Interpolasi: `"Halo {nama}"` |
| Char | `'A'` | `##'` | Karakter Unicode tunggal |
| Bool | `#1`, `#0` | `##?` | BUKAN numerik — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Elemen homogen |
| Tuple | `(a, b)` | `##)` | Posisional |
| Tuple Bernama | `(x: 1, y: 2)` | `##)` | Kolom bernama |
| Fungsi | referensi fungsi bernama | `##()` | Kelas satu; tampil `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas satu; tampil `<lambd/N>` |

```zymbol
// Introspeksi tipe — mengembalikan (tipe, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output & Input

```zymbol
>> "Halo" ¶                        // ¶ atau \\ untuk baris baru eksplisit
>> "a=" a " b=" b ¶                // juxtaposition — beberapa nilai
>> (arr$#) ¶                       // operator postfix memerlukan ( ) dalam >>

<< nama                            // baca ke variabel (tanpa prompt)
<< "Masukkan nama: " nama          // dengan prompt
```

> `¶` (AltGr+R pada keyboard Spanyol) dan `\\` adalah baris baru yang setara.

---

## Primitif TUI

Operator antarmuka terminal untuk program interaktif. Sebagian besar memerlukan blok `>>| { }` (layar alternatif + mode raw).

```zymbol
>>| {
    >>!                              // bersihkan layar alternatif
    >>~ (1, 1, 0, 10) > "Berjalan"  // baris 1, kol 1, fg=10 (hijau)
    @~ 1000                          // jeda 1 detik (1000 ms)
    >>~ (2, 1) > "Selesai."
}
// terminal dipulihkan otomatis saat keluar
```

```zymbol
// Penekanan tombol dan ukuran terminal
>>| {
    [baris, kol] = >>?              // tanya dimensi terminal
    >>~ (1, 1) > "Terminal: " baris " x " kol
    <<| tombol                      // baca penekanan tombol (blocking)
    >>~ (2, 1) > "Ditekan: " tombol
}
```

> `>>!` bersihkan layar. `>>?` mengembalikan `[baris, kol]`. `@~ N` tidur N milidetik.
> `<<|` membaca satu penekanan tombol (blocking); `<<|?` polling tanpa blocking (mengembalikan `'\0'` jika tidak ada).
> Tuple output posisi: `(baris, kol, BKS, fg, bg)` — slot mana pun dapat dihilangkan dengan koma (`>>~ (,,, 196) > "merah"`).
> Masker BKS: `1`=Tebal, `2`=Miring, `4`=Garis Bawah. Palet ANSI 256-warna (`0`=default terminal).
> Hanya tree-walker (kecuali `>>!`, `>>?`, `@~`, `>>~` yang juga berjalan dalam `--vm`).

---

## Operator

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pembagian bilangan bulat)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (perpangkatan)

// Perbandingan — tugaskan untuk memeriksa
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logika
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## String

```zymbol
// Dua bentuk penggabungan
nama = "Alya"
n = 42

>> "Halo " nama " kamu punya " n ¶       // juxtaposition — dalam >>
deskripsi = "Halo {nama}, kamu punya {n}"  // interpolasi — di mana saja
```

```zymbol
s = "Halo Dunia"
panjang = s$#                  // 10
sub = s$[1..4]                 // "Halo"  (berbasis 1, akhir inklusif)
ada = s$? "Dunia"              // #1
bagian = "a,b,c,d"$/ ','       // [a, b, c, d]  (bagi berdasarkan pembatas)
ganti = s$~~["l":"L"]          // "HaLo Dunia"
ganti1 = s$~~["l":"L":1]       // "HaLo Dunia"  (N pertama saja)
garis = "─" $* 20              // "────────────────────"  (ulangi N kali)
```

> `+` hanya untuk angka. Gunakan `,`, juxtaposition, atau interpolasi untuk string.

---

## Alur Kontrol

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

> Tanda kurung kurawal `{ }` **wajib** bahkan untuk satu pernyataan.

---

## Match

```zymbol
// Rentang
nilai = 85
peringkat = ?? nilai {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> peringkat ¶    // → B

// String
warna = "merah"
kode = ?? warna {
    "merah"  => "#FF0000"
    "hijau"  => "#00FF00"
    _        => "#000000"
}

// Pola perbandingan
suhu = -5
kondisi = ?? suhu {
    < 0  => "es"
    < 20 => "dingin"
    < 35 => "hangat"
    _    => "panas"
}
>> kondisi ¶    // → es

// Bentuk pernyataan (lengan blok)
n = -3
?? n {
    0    => { >> "nol" ¶ }
    < 0  => { >> "negatif" ¶ }
    _    => { >> "positif" ¶ }
}
```

---

## Loop

```zymbol
@ i:0..4  { >> i " " }        // rentang inklusif:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // dengan langkah:    1 3 5 7 9
@ i:5..0:1 { >> i " " }       // terbalik:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

buah = ["apel", "pir", "anggur"]
@ b:buah { >> b ¶ }           // for-each array

@ c:"halo" { >> c "-" }
>> ¶                          // → h-a-l-o-  (for-each string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> lanjut
    ? i > 7 { @! }             // @! berhenti
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop tak terbatas
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop berlabel (berhenti bersarang)
hitungan = 0
@:luar {
    hitungan++
    ? hitungan >= 3 { @:luar! }
}
>> hitungan ¶                    // → 3
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

Fungsi memiliki **cakupan terisolasi** — tidak dapat membaca variabel luar. Gunakan parameter output `<~` untuk memodifikasi variabel pemanggil:

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

> Fungsi bernama adalah **nilai kelas satu** — teruskan langsung: `angka$> dua_kali`. Untuk membungkus: `x -> fungsi(x)` juga valid.

---

## Lambda & Closure

```zymbol
dua_kali = x -> x * 2
jumlah = (a, b) -> a + b
>> dua_kali(5) ¶    // → 10
>> jumlah(3, 7) ¶   // → 10

// Lambda blok
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "nol"
}

// Closure — menangkap cakupan luar
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶    // → 21

// Pabrik
buat_penambah(n) { <~ x -> x + n }
tambah10 = buat_penambah(10)
>> tambah10(5) ¶    // → 15

// Dalam array
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Array

Array bersifat **dapat diubah** dan menampung elemen dengan **tipe yang sama**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — akses (berbasis 1: elemen pertama)
x = arr[-1]     // 5 — indeks negatif (elemen terakhir)
x = arr$#       // 5 — panjang (gunakan (arr$#) dalam >>)

arr = arr$+ 6            // tambahkan → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sisipkan di posisi 2 (berbasis 1)
arr3 = arr$- 3           // hapus kemunculan pertama nilai
arr4 = arr$-- 3          // hapus semua kemunculan
arr5 = arr$-[1]          // hapus di indeks 1 (elemen pertama)
arr6 = arr$-[2..3]       // hapus rentang (berbasis 1, akhir inklusif)

ada = arr$? 3            // #1 — berisi
pos = arr$?? 3           // [3] — semua indeks nilai (berbasis 1)
irisan = arr$[1..3]      // [1,2,3] — irisan (berbasis 1, akhir inklusif)
irisan2 = arr$[1:3]      // [1,2,3] — sama, sintaks berbasis jumlah

urut_naik = arr$^+             // terurut naik  (hanya primitif)
urut_turun = arr$^-            // terurut turun (hanya primitif)

// Array tuple bernama/posisional — gunakan $^ dengan lambda komparator
db = [(nama: "Carla", usia: 28), (nama: "Ana", usia: 25), (nama: "Bob", usia: 30)]
per_usia  = db$^ (a, b -> a.usia < b.usia)    // naik berdasarkan usia (<)
per_nama  = db$^ (a, b -> a.nama > b.nama)    // turun berdasarkan nama (>)
>> per_usia[1].nama ¶     // → Ana
>> per_nama[1].nama ¶     // → Carla

// Pembaruan elemen langsung (hanya array)
arr[1] = 99              // tugaskan
arr[2] += 5              // majemuk: +=  -=  *=  /=  %=  ^=

// Pembaruan fungsional — mengembalikan array baru; asli tidak berubah
arr2 = arr[2]$~ 99
```

> Semua operator koleksi mengembalikan **array baru**. Tugaskan kembali: `arr = arr$+ 4`.
> `$+` dapat dirantai: `arr = arr$+ 5$+ 6$+ 7`. Operator lain menggunakan penugasan perantara.
> **Indeks berbasis 1**: `arr[1]` adalah elemen pertama; `arr[0]` adalah error runtime.
> `$^+` / `$^-` mengurutkan **array primitif** (angka, string). Untuk array tuple gunakan `$^` dengan lambda komparator — arah dikodekan dalam lambda (`<` = naik, `>` = turun).

**Semantik nilai** — menugaskan array ke variabel lain membuat salinan independen:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b tidak terpengaruh
```

```zymbol
// Array bersarang (indeks berbasis 1)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (baris 2, kolom 3)
```

---

## Destrukturisasi

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pertama, *sisa] = arr       // pertama=10  sisa=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ dibuang

// Tuple posisional
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tuple bernama
orang = (nama: "Ana", usia: 25, kota: "Jakarta")
(nama: n, usia: a) = orang   // n="Ana"  a=25
```

---

## Tuple

Tuple bersifat **tidak dapat diubah** dan merupakan kontainer terurut yang dapat menampung nilai dengan **tipe berbeda**.
Tidak seperti array, elemen tidak dapat diubah setelah dibuat.

```zymbol
// Posisional — tipe campuran diperbolehkan
titik = (10, 20)
>> titik[1] ¶    // → 10

data = (42, "halo", #1, 3.14)
>> data[3] ¶     // → #1

// Bernama
orang = (nama: "Alya", usia: 25)
>> orang.nama ¶    // → Alya
>> orang[1] ¶      // → Alya  (indeks juga berlaku, berbasis 1)

// Bersarang
pos = (x: 10, y: 20)
p = (pos: pos, label: "asal")
>> p.pos.x ¶        // → 10
```

**Kekekalan** — setiap upaya memodifikasi elemen tuple adalah error runtime:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ error runtime: tuple tidak dapat diubah
// t[1] += 5    // ❌ error yang sama
```

Untuk mendapatkan nilai yang dimodifikasi gunakan `$~` (pembaruan fungsional) — mengembalikan tuple **baru**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asli tidak berubah
>> t2 ¶    // → (10, 999, 30)

// Tuple bernama — bangun ulang secara eksplisit
orang = (nama: "Alya", usia: 25)
lebih_tua  = (nama: orang.nama, usia: 26)
>> orang.usia ¶       // → 25
>> lebih_tua.usia ¶   // → 26
```

---

## Fungsi Tingkat Tinggi

```zymbol
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

digandakan  = angka$> (x -> x * 2)                // map  → [2,4,6…20]
genap       = angka$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total       = angka$< (0, (akum, x) -> akum + x)  // reduce → 55

// Rantai melalui perantara
langkah1 = angka$| (x -> x > 3)
langkah2 = langkah1$> (x -> x * x)
>> langkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi bernama dapat diteruskan langsung ke HOF
dua_kali(x) { <~ x * 2 }
adalah_besar(x) { <~ x > 5 }
r = angka$> dua_kali       // ✅ referensi langsung
r = angka$| adalah_besar   // ✅ referensi langsung
```

---

## Operator Pipe

RHS selalu memerlukan `_` sebagai pengganti nilai yang di-pipe:

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
naik = x -> x + 1

r1 = 5 |> dua_kali(_)        // → 10
r2 = 10 |> tambah(_, 5)      // → 15
r3 = 5 |> tambah(2, _)       // → 7

// Dirantai
r = 5 |> dua_kali(_) |> naik(_) |> dua_kali(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Penanganan Error

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pembagian dengan nol" ¶
} :! {
    >> "lainnya: " _err ¶    // _err menyimpan pesan error
} :> {
    >> "selalu berjalan" ¶
}
```

| Tipe | Kapan |
|------|-------|
| `##Div` | Pembagian dengan nol |
| `##IO` | Berkas / sistem |
| `##Index` | Indeks di luar batas |
| `##Type` | Ketidakcocokan tipe |
| `##Parse` | Penguraian data |
| `##Network` | Error jaringan |
| `##_` | Error apa pun (tangkap semua) |

---

## Modul

```zymbol
// lib/kalkulator.zy — tubuh modul diapit tanda kurung kurawal
# kalkulator {
    #> { tambah, dapatkan_PI }

    _PI := 3.14159
    tambah(a, b) { <~ a + b }
    dapatkan_PI() { <~ _PI }
}
```

```zymbol
// utama.zy
<# ./lib/kalkulator => k    // alias diperlukan

>> k::tambah(5, 3) ¶        // → 8
pi = k::dapatkan_PI()
>> pi ¶                     // → 3.14159
```

```zymbol
// Ekspor dengan nama publik berbeda
# libku {
    #> { _tambah_internal => jumlah }

    _tambah_internal(a, b) { <~ a + b }
}
```

```zymbol
<# ./libku => m

>> m::jumlah(3, 4) ¶    // → 7  (nama internal _tambah_internal disembunyikan)
```

> **Aturan modul**: hanya `#>`, definisi fungsi, dan inisialisasi variabel/konstanta literal yang diperbolehkan di dalam `# nama { }`. Pernyataan yang dapat dieksekusi (`>>`, `<<`, loop, dll.) memunculkan error E013.

---

## Mode Angka

Zymbol dapat menampilkan angka dalam **69 skrip digit Unicode** — Devanagari, Arab-Indik, Thai, Klingon pIqaD, Matematika Tebal, segmen LCD, dan lainnya. Mode aktif hanya memengaruhi output `>>`; aritmetika internal selalu biner.

### Mengaktifkan skrip

Tulis digit `0` dan `9` dari skrip target yang diapit `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reset ke ASCII
```

### Output dan boolean

```zymbol
x = 42
>> x ¶          // → 42   (default ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (titik desimal selalu ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: prefiks # selalu ASCII, digit menyesuaikan
>> #1 ¶         // → #१   (benar dalam Devanagari)
>> #0 ¶         // → #०   (salah — berbeda dari ०  bilangan bulat nol)

x = 28 > 4
>> x ¶          // → #१   (hasil perbandingan mengikuti mode aktif)
```

### Literal digit asli dalam sumber

Digit dari skrip yang didukung adalah literal valid — dalam rentang, modulo, perbandingan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal boolean dalam skrip apa pun

`#` + digit `0` atau `1` dari blok apa pun adalah literal boolean valid:

```zymbol
#٠٩#
نشط = #١        // sama dengan #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **selalu ASCII**. `#0` (salah) selalu berbeda secara visual dari `0` (bilangan bulat nol) dalam setiap skrip.

---

## Operator Data

```zymbol
// Konversi tipe
f = ##.42         // → 42.0  (ke Float)
i = ###3.7        // → 4     (ke Int, bulatkan)
t = ##!3.7        // → 3     (ke Int, potong)

// Urai string ke angka
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (aman gagal, tanpa error)

// Bulatkan / potong
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (bulatkan ke 2 desimal)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (potong)

// Pemformatan angka
fmt = #,|1234567|      // → 1,234,567  (dipisah koma)
sci = #^|12345.678|    // → 1.2345678e4  (ilmiah)

// Literal basis
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (biner)
c = 0o101        // → 'A'  (oktal)

// Output konversi basis
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tanggal = <\ date +%Y-%m-%d \>     // menangkap stdout (termasuk \n akhir)
>> "Hari ini: " tanggal

berkas = "data.txt"
isi = <\ cat {berkas} \>            // interpolasi dalam perintah

output = </"./subskrip.zy"/>        // jalankan skrip Zymbol lain, tangkap output
>> output
```

> `><` menangkap argumen CLI sebagai array string (hanya tree-walker).

---

## Contoh Lengkap: FizzBuzz

```zymbol
klasifikasi(angka) {
    ? angka % 15 == 0 { <~ "FizzBuzz" }
    _? angka % 3  == 0 { <~ "Fizz" }
    _? angka % 5  == 0 { <~ "Buzz" }
    _ { <~ angka }
}

@ i:1..20 { >> klasifikasi(i) ¶ }
```

---

## Referensi Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|---------|--------|---------|
| `=` | variabel | `$#` | panjang |
| `:=` | konstanta | `$+` | tambahkan (dapat dirantai) |
| `>>` | output | `$+[i]` | sisipkan di indeks (berbasis 1) |
| `<<` | input | `$-` | hapus pertama berdasarkan nilai |
| `¶` / `\\` | baris baru | `$--` | hapus semua berdasarkan nilai |
| `?` | jika | `$-[i]` | hapus di indeks (berbasis 1) |
| `_?` | jika tidak maka | `$-[i..j]` | hapus rentang (berbasis 1) |
| `_` | lain / wildcard | `$?` | berisi |
| `??` | match | `$??` | temukan semua indeks (berbasis 1) |
| `@` | loop | `$[s..e]` | irisan (berbasis 1) |
| `@ N { }` | loop N kali (N iterasi) | `$>` | map |
| `@!` | berhenti | `$\|` | filter |
| `@>` | lanjut | `$<` | reduce |
| `@:nama { }` | loop berlabel | `$/ pembatas` | pisah string |
| `@:nama!` | berhenti berlabel | `$++ a b c` | bangun rangkaian |
| `@:nama>` | lanjut berlabel | `arr[i>j>k]` | indeks navigasi |
| `->` | lambda | `arr[i] = val` | perbarui elemen (hanya array) |
| `arr[i] += val` | perbarui majemuk | `arr[i]$~` | pembaruan fungsional (salinan baru) |
| `$^+` | urut naik (primitif) | `$^-` | urut turun (primitif) |
| `$^` | urut dengan komparator (tuple) | `<~` | kembalikan |
| `\|>` | pipe | `!?` | coba |
| `:!` | tangkap | `:>` | akhirnya |
| `#1` | benar | `#0` | salah |
| `$!` | adalah error | `$!!` | sebarkan error |
| `<#` | impor | `#>` | ekspor |
| `#` | deklarasi modul | `::` | panggilan modul |
| `.` | akses kolom | `#?` | metadata tipe |
| `#\|..\|` | urai angka | `##.` | cast ke Float |
| `###` | cast ke Int (bulatkan) | `##!` | cast ke Int (potong) |
| `#.N\|..\|` | bulatkan | `#!N\|..\|` | potong |
| `#,\|..\|` | format koma | `#^\|..\|` | ilmiah |
| `#d0d9#` | alihkan mode angka | `#09#` | reset ke ASCII |
| `<\ ..\>` | eksekusi shell | `>\<` | argumen CLI |
| `\ var` | hancurkan variabel eksplisit | `°x` / `x°` | definisi panas (inisialisasi-otomatis) |
| `>>|` | blok TUI (layar alt) | `>>~` | output posisi |
| `>>!` | bersihkan layar | `>>?` | tanya ukuran terminal |
| `<<\|` | penekanan tombol blocking | `<<\|?` | penekanan tombol non-blocking |
| `@~ N` | tidur N milidetik | `$*` | ulangi string N kali |

---

## Catatan Rilis

### v0.0.5 — Primitif TUI, Definisi Panas & Pengulangan String _(Mei 2026)_

- **Perubahan** Pemisah lengan match: `pattern : result` → `pattern => result`
- **Perubahan** Alias impor: `<# path <= alias` → `<# path => alias`
- **Perubahan** Ganti nama ekspor: `#> { fn <= pub }` → `#> { fn => pub }`
- **Ditambahkan** Blok TUI `>>| { }` — layar alternatif + mode raw; dibersihkan saat keluar
- **Ditambahkan** Output posisi `>>~ (baris, kol, BKS, fg, bg) > item` — slot jarang, ANSI 256-warna
- **Ditambahkan** Input tombol `<<| var` (blocking) dan `<<|? var` (polling non-blocking)
- **Ditambahkan** `>>!` bersihkan layar, `>>?` tanya ukuran terminal, `@~ N` tidur N milidetik
- **Ditambahkan** Definisi panas `°x` / `x°` — inisialisasi otomatis variabel saat pertama digunakan dalam loop
- **Ditambahkan** Pengulangan string `str $* N` — ulangi string N kali
- **VM** Paritas: 436/436 tes lolos

### v0.0.4 — Indeks Berbasis 1, Fungsi Kelas Satu & Blok Modul _(April 2026)_

- **Perubahan** Semua indeks beralih ke **berbasis 1** — `arr[1]` adalah elemen pertama; `arr[0]` adalah error runtime
- **Ditambahkan** Fungsi bernama adalah **nilai kelas satu** — teruskan langsung ke HOF: `angka$> dua_kali`
- **Ditambahkan** Sintaks **blok** modul diperlukan: `# nama { ... }` — sintaks datar dihapus
- **Ditambahkan** Indeks multidimensi: `arr[i>j>k]` (navigasi), `arr[p ; q]` (ekstraksi datar)
- **Ditambahkan** Cast konversi tipe: `##.ekpr` (Float), `###ekpr` (Int bulatkan), `##!ekpr` (Int potong)
- **Ditambahkan** Pisah string: `str$/ pembatas` — mengembalikan `Array(String)`
- **Ditambahkan** Bangun rangkaian: `dasar$++ a b c` — menambahkan beberapa item
- **Ditambahkan** Loop N kali: `@ N { }` — ulangi tepat N kali
- **Ditambahkan** Sintaks loop berlabel: `@:nama { }`, `@:nama!`, `@:nama>` — menggantikan `@ @nama` / `@! nama`
- **Ditambahkan** Aturan cakupan variabel: variabel `_nama` memiliki cakupan blok tepat; `\ var` menghancurkan lebih awal
- **Ditambahkan** Pola perbandingan match: `< 0 :`, `> 5 :`, `== 42 :` dll.
- **Ditambahkan** Error modul E013: pernyataan yang dapat dieksekusi dalam tubuh modul dilarang
- **Diperbaiki** `take_variable` tidak lagi mengkorupsi konstanta modul saat write-back
- **Diperbaiki** `alias.CONST` sekarang diselesaikan dengan benar; `#>` dapat muncul setelah definisi fungsi
- **VM** Paritas penuh: 393/393 tes lolos

### v0.0.3 — Sistem Angka Unicode & Peningkatan LSP _(April 2026)_

- **Ditambahkan** 69 blok digit Unicode dengan token alih mode `#d0d9#`
- **Ditambahkan** Literal boolean dalam skrip apa pun — `#१` / `#०`, `#١` / `#٠`, dll.
- **Ditambahkan** Digit Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ditambahkan** Opkode VM `SetNumeralMode` — paritas penuh dengan tree-walker
- **Ditambahkan** REPL menghormati mode angka aktif dalam echo dan tampilan variabel
- **Diubah** Output boolean `>>` sekarang menyertakan prefiks `#` (`#0` / `#1`) dalam semua mode

### v0.0.2_01 — Ganti Nama Operator _(30 Mar 2026)_

- **Diubah** `c|..|` → `#,|..|` dan `e|..|` → `#^|..|` — konsisten dengan keluarga prefiks format `#`
- **Ditambahkan** Alias ekspor: ekspor ulang anggota modul dengan nama berbeda

### v0.0.2 — Desain Ulang API Koleksi & Installer _(24 Mar 2026)_

- **Ditambahkan** Keluarga operator `$` terpadu untuk array dan string (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ditambahkan** Penugasan destrukturisasi untuk array, tuple, dan tuple bernama
- **Ditambahkan** Indeks negatif (`arr[-1]` = elemen terakhir)
- **Ditambahkan** Installer asli — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Ditambahkan** Penugasan majemuk `^=`
- **Diperbaiki** Kasus sisi aritmetika parser; koreksi dokumentasi

### v0.0.1 — Rilis Publik Perdana _(22 Mar 2026)_

- Interpreter tree-walker + VM register (`--vm`, ~4× lebih cepat, ~95% paritas)
- Semua konstruksi inti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengenal Unicode penuh, sistem modul, lambda, closure, penanganan error
- REPL, LSP, ekstensi VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Simbolik. Universal. Imutabel._
