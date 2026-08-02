> **Pemberitahuan:** Dokumentasi ini dibuat dengan bantuan kecerdasan buatan (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referensi kanonik adalah **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** di repositori interpreter.

---

# Manual Zymbol-Lang

**Zymbol-Lang** adalah bahasa pemrograman simbolik. Tanpa kata kunci — semuanya adalah simbol. Bekerja sama persis dalam bahasa manusia apa pun.

- Tanpa `if`, `while`, `return` — hanya `?`, `@`, `<~`
- Unicode penuh — pengenal dalam bahasa atau emoji apa pun
- Agnostik terhadap bahasa manusia — kodenya sama di mana pun

**Versi interpreter**: v0.0.4 | **Cakupan tes**: 393/393 (paritas TW ↔ VM)

---

## Variabel dan Konstanta

```zymbol
x = 10              // variabel yang dapat diubah
PI := 3.14159       // konstanta — penugasan ulang adalah error runtime
nama = "Alice"
aktif = #1          // Boolean benar
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

---

## Tipe Data

| Tipe | Literal | Tag `#?` | Catatan |
|------|---------|----------|---------|
| Integer | `42`, `-7` | `###` | 64-bit bertanda |
| Float | `3.14`, `1.5e10` | `##.` | Notasi ilmiah diperbolehkan |
| String | `"teks"` | `##"` | Interpolasi: `"Halo {nama}"` |
| Karakter | `'A'` | `##'` | Satu karakter Unicode |
| Boolean | `#1`, `#0` | `##?` | BUKAN numerik — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Elemen homogen |
| Tuple | `(a, b)` | `##)` | Posisional |
| Tuple bernama | `(x: 1, y: 2)` | `##)` | Bidang bernama |
| Fungsi | referensi fungsi bernama | `##()` | Kelas satu; tampilkan `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas satu; tampilkan `<lambd/N>` |

```zymbol
// Instrospeksi tipe — mengembalikan (tipe, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Keluaran dan Masukan

```zymbol
>> "Halo" ¶                       // ¶ atau \\ untuk baris baru eksplisit
>> "a=" a " b=" b ¶               // juxtaposisi — banyak nilai
>> (arr$#) ¶                      // operator postfix memerlukan ( ) di >>

<< nama                           // baca ke variabel (tanpa prompt)
<< "Masukkan nama: " nama         // dengan prompt
```

> `¶` (AltGr+R pada keyboard Spanyol) dan `\\` setara untuk baris baru.

---

## Operator

```zymbol
// Aritmetika — gunakan penugasan; beberapa operator memiliki keanehan langsung di >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pembagian integer)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (perpangkatan)

// Perbandingan
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## String

```zymbol
// Dua bentuk penggabungan
nama = "Alice"
n = 42

>> "Halo " nama " Anda memiliki " n ¶       // juxtaposisi — di >>
deskripsi = "Halo {nama}, Anda memiliki {n}"  // interpolasi — di mana saja
```

```zymbol
s = "Halo Dunia"
panjang = s$#                  // 10
sub = s$[1..4]                 // "Halo"  (basis-1, akhir termasuk)
ada = s$? "Dunia"              // #1
bagian = "a,b,c,d"$/ ','       // [a, b, c, d]  (pisah dengan pemisah)
ganti = s$~~["a":"o"]          // "Holo Dunio"
ganti1 = s$~~["a":"o":1]       // "Holo Dunia"  (hanya N pertama)
```

> `+` hanya untuk angka. Gunakan `,`, juxtaposisi, atau interpolasi untuk string.

---

## Aliran Kontrol

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

> Kurung kurawal `{ }` **wajib** bahkan untuk satu pernyataan.

---

## Pencocokan (Match)

```zymbol
// Rentang
skor = 85
nilai = ?? skor {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nilai ¶    // → B

// String
warna = "merah"
kode = ?? warna {
    "merah"  : "#FF0000"
    "hijau"  : "#00FF00"
    _        : "#000000"
}

// Pola perbandingan
suhu = -5
keadaan = ?? suhu {
    < 0  : "es"
    < 20 : "dingin"
    < 35 : "hangat"
    _    : "panas"
}
>> keadaan ¶    // → es

// Bentuk pernyataan (blok)
?? n {
    0        : { >> "nol" ¶ }
    _? n < 0 : { >> "negatif" ¶ }
    _        : { >> "positif" ¶ }
}
```

---

## Perulangan

```zymbol
@ i:0..4  { >> i " " }        // rentang termasuk:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // dengan langkah:    1 3 5 7 9
@ i:5..0:1 { >> i " " }       // terbalik:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (selama)

buah = ["apel", "pir", "anggur"]
@ b:buah { >> b ¶ }           // untuk setiap elemen array

@ c:"halo" { >> c "-" }
>> ¶                          // → h-a-l-o-  (untuk setiap karakter string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> lanjutkan
    ? i > 7 { @! }            // @! hentikan
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

// Perulangan berlabel (hentikan bersarang)
penghitung = 0
@:luar {
    penghitung++
    ? penghitung >= 3 { @:luar! }
}
>> penghitung ¶               // → 3
```

---

## Fungsi

```zymbol
tambah(a, b) { <~ a + b }
>> tambah(3, 4) ¶   // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Fungsi memiliki **lingkup terisolasi** — mereka tidak dapat membaca variabel luar. Gunakan parameter keluaran `<~` untuk memodifikasi variabel pemanggil:

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

> Fungsi bernama adalah **nilai kelas satu** — kirim langsung: `nums$> ganda`. `x -> fn(x)` juga valid.

---

## Lambda dan Penutupan

```zymbol
ganda = x -> x * 2
tambah = (a, b) -> a + b
>> ganda(5) ¶    // → 10
>> tambah(3, 7) ¶ // → 10

// Lambda blok
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "nol"
}

// Penutupan — menangkap lingkup luar
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶    // → 21

// Pabrik
buat_penambah(n) { <~ x -> x + n }
tambah10 = buat_penambah(10)
>> tambah10(5) ¶     // → 15

// Dalam array
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶       // → 25
```

---

## Array

Array bersifat **dapat diubah** dan berisi elemen dengan **tipe yang sama**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — akses (basis-1: elemen pertama)
arr[-1]         // 5 — indeks negatif (elemen terakhir)
arr$#           // 5 — panjang (gunakan (arr$#) di >>)

arr = arr$+ 6            // tambah → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sisip di posisi 2 (basis-1)
arr3 = arr$- 3           // hapus kemunculan pertama nilai
arr4 = arr$-- 3          // hapus semua kemunculan
arr5 = arr$-[1]          // hapus di indeks 1 (elemen pertama)
arr6 = arr$-[2..3]       // hapus rentang (basis-1, akhir termasuk)

ada = arr$? 3            // #1 — mengandung
posisi = arr$?? 3        // [3] — semua indeks nilai (basis-1)
irisan = arr$[1..3]      // [1,2,3] — irisan (basis-1, akhir termasuk)
irisan2 = arr$[1:3]      // [1,2,3] — sama, sintaksis berbasis jumlah

naik = arr$^+            // urutkan naik (hanya primitif)
turun = arr$^-           // urutkan turun (hanya primitif)

// Array tuple bernama/posisional — gunakan $^ dengan lambda pembanding
db = [(nama: "Carla", umur: 28), (nama: "Ana", umur: 25), (nama: "Bob", umur: 30)]
menurut_umur  = db$^ (a, b -> a.umur < b.umur)     // naik menurut umur (<)
menurut_nama  = db$^ (a, b -> a.nama > b.nama)     // turun menurut nama (>)
>> menurut_umur[1].nama ¶    // → Ana
>> menurut_nama[1].nama ¶    // → Carla

// Pembaruan elemen langsung (hanya array)
arr[1] = 99              // tugaskan
arr[2] += 5              // gabungan: +=  -=  *=  /=  %=  ^=

// Pembaruan fungsional — mengembalikan array baru; asli tidak berubah
arr2 = arr[2]$~ 99
```

> Semua operator koleksi mengembalikan **array baru**. Tugaskan kembali: `arr = arr$+ 4`.
> `$+` dapat dirantai: `arr = arr$+ 5$+ 6$+ 7`. Operator lain menggunakan penugasan perantara.
> **Pengindeksan berbasis 1**: `arr[1]` adalah elemen pertama; `arr[0]` adalah error runtime.
> `$^+` / `$^-` mengurutkan **array primitif** (angka, string). Untuk array tuple gunakan `$^` dengan lambda pembanding — arah dikodekan dalam lambda (`<` = naik, `>` = turun).

**Semantik nilai** — menugaskan array ke variabel lain membuat salinan independen:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b tidak terpengaruh
```

```zymbol
// Array bersarang (pengindeksan basis-1)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (baris 2, kolom 3)
```

---

## Destrukturisasi

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pertama, *sisanya] = arr    // pertama=10  sisanya=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ mengabaikan

// Tuple posisional
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tuple bernama
orang = (nama: "Ana", umur: 25, kota: "Madrid")
(nama: n, umur: u) = orang   // n="Ana"  u=25
```

---

## Tuple

Tuple adalah wadah berurutan **tidak dapat diubah** yang dapat menyimpan nilai dari **tipe yang berbeda**.
Tidak seperti array, elemen tidak dapat diubah setelah pembuatan.

```zymbol
// Posisional — tipe campuran diperbolehkan
titik = (10, 20)
>> titik[1] ¶    // → 10

data = (42, "halo", #1, 3.14)
>> data[3] ¶     // → #1

// Bernama
orang = (nama: "Alice", umur: 25)
>> orang.nama ¶    // → Alice
>> orang[1] ¶      // → Alice  (indeks juga berfungsi, basis-1)

// Bersarang
pos = (x: 10, y: 20)
p = (pos: pos, label: "asal")
>> p.pos.x ¶       // → 10
```

**Ketidakubahan** — setiap upaya untuk memodifikasi elemen tuple adalah error runtime:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ error runtime: tuple tidak dapat diubah
// t[1] += 5    // ❌ error yang sama

// Tuple bernama — bangun ulang secara eksplisit
orang = (nama: "Alice", umur: 25)
lebih_tua = (nama: orang.nama, umur: 26)
>> orang.umur ¶    // → 25
>> lebih_tua.umur ¶ // → 26
```

Untuk mendapatkan nilai yang dimodifikasi gunakan `$~` (pembaruan fungsional) — mengembalikan tuple **baru**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asli tidak berubah
>> t2 ¶    // → (10, 999, 30)
```

---

## Fungsi Orde Tinggi

```zymbol
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

digandakan = angka$> (x -> x * 2)                 // peta → [2,4,6…20]
genap   = angka$| (x -> x % 2 == 0)              // filter → [2,4,6,8,10]
total   = angka$< (0, (akum, x) -> akum + x)      // reduksi → 55

// Rantai melalui perantara
langkah1 = angka$| (x -> x > 3)
langkah2 = langkah1$> (x -> x * x)
>> langkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi bernama dapat dikirim langsung ke HOF
ganda(x) { <~ x * 2 }
besar(x) { <~ x > 5 }
r = angka$> ganda       // ✅ referensi langsung
r = angka$| besar       // ✅ referensi langsung
```

---

## Operator Pipe

Sisi kanan selalu memerlukan `_` sebagai placeholder untuk nilai yang dipipe:

```zymbol
ganda = x -> x * 2
tambah = (a, b) -> a + b
inc = x -> x + 1

5 |> ganda(_)        // → 10
10 |> tambah(_, 5)   // → 15
5 |> tambah(2, _)    // → 7

// Dirantai
r = 5 |> ganda(_) |> inc(_) |> ganda(_)
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
    >> "error lain: " _err ¶    // _err menyimpan pesan error
} :> {
    >> "selalu dijalankan" ¶
}
```

| Tipe | Kapan |
|------|-------|
| `##Div` | Pembagian dengan nol |
| `##IO` | File / sistem |
| `##Index` | Indeks di luar batas |
| `##Type` | Ketidakcocokan tipe |
| `##Parse` | Penguraian data |
| `##Network` | Error jaringan |
| `##_` | Error apa pun (menangkap semua) |

---

## Modul

```zymbol
// lib/calc.zy — badan modul berada dalam kurung kurawal
# calc {
    #> { tambah, get_PI }

    _PI := 3.14159
    tambah(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias wajib

>> c::tambah(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Ekspor dengan nama publik berbeda
# perpustakaan_saya {
    #> { _tambah_internal <= jumlah }

    _tambah_internal(a, b) { <~ a + b }
}
```

```zymbol
<# ./perpustakaan_saya <= m

>> m::jumlah(3, 4) ¶    // → 7  (nama internal _tambah_internal tersembunyi)
```

> **Aturan modul**: hanya `#>`, definisi fungsi, dan penginisialisasi variabel/konstanta literal yang diizinkan di dalam `# nama { }`. Pernyataan yang dapat dieksekusi (`>>`, `<<`, perulangan, dll.) memicu error E013.

---

## Mode Numerik

Zymbol dapat menampilkan angka dalam **69 blok digit Unicode** — Dewanagari, Arab-India, Thai, Klingon pIqaD, Tebal Matematika, segmen LCD, dan lainnya. Mode aktif hanya mempengaruhi keluaran `>>`; aritmetika internal selalu biner.

### Mengaktifkan sebuah aksara

Tulis digit `0` dan `9` dari aksara target di dalam `#…#`:

```zymbol
#०९#    // Dewanagari    (U+0966–U+096F)
#٠٩#    // Arab-India    (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // reset ke ASCII
```

### Keluaran dan Boolean

```zymbol
x = 42
>> x ¶          // → 42   (default ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (titik desimal selalu ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: awalan # selalu ASCII, digit menyesuaikan
>> #1 ¶         // → #१   (benar dalam Dewanagari)
>> #0 ¶         // → #०   (salah — berbeda dari ० integer nol)

x = 28 > 4
>> x ¶          // → #१   (hasil perbandingan mengikuti mode aktif)
```

### Literal digit asli dalam kode sumber

Digit dari aksara yang didukung adalah literal yang valid — dalam rentang, modulo, perbandingan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal Boolean dalam aksara apa pun

`#` + digit `0` atau `1` dari blok mana pun adalah literal Boolean yang valid:

```zymbol
#०९#
aktif = #१        // sama dengan #1
>> aktif ¶        // → #१
>> (#१ && #०) ¶   // → #०
```

> `#` **selalu ASCII**. `#0` (salah) selalu berbeda secara visual dari `0` (integer nol) dalam setiap aksara.

---

## Operator Data

```zymbol
// Konversi tipe
##.42         // → 42.0  (ke Float)
###3.7        // → 4     (ke Int, bulatkan)
##!3.7        // → 3     (ke Int, potong)

// Parse string ke angka
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (aman, tanpa error)

// Bulatkan / potong
pi = 3.14159265
b2 = #.2|pi|      // → 3.14  (bulatkan ke 2 desimal)
b4 = #.4|pi|      // → 3.1416
p2 = #!2|pi|      // → 3.14  (potong)

// Pemformatan angka
fmt = #,|1234567|  // → 1,234,567  (dipisah koma)
sci = #^|12345.678| // → 1.2345678e4  (ilmiah)

// Literal basis
a = 0x41         // → 'A'  (heksadesimal)
b = 0b01000001   // → 'A'  (biner)
c = 0o101        // → 'A'  (oktal)

// Keluaran konversi basis
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tanggal = <\ date +%Y-%m-%d \>     // menangkap stdout (termasuk \n di akhir)
>> "Hari ini: " tanggal

file = "data.txt"
konten = <\ cat {file} \>          // interpolasi dalam perintah

keluaran = </"./subscript.zy"/>    // jalankan skrip Zymbol lain, tangkap keluaran
>> keluaran
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
| `:=` | konstanta | `$+` | tambah (dapat dirantai) |
| `>>` | keluaran | `$+[i]` | sisip di indeks (basis-1) |
| `<<` | masukan | `$-` | hapus pertama berdasarkan nilai |
| `¶` / `\\` | baris baru | `$--` | hapus semua berdasarkan nilai |
| `?` | jika | `$-[i]` | hapus di indeks (basis-1) |
| `_?` | jika tidak jika | `$-[i..j]` | hapus rentang (basis-1) |
| `_` | jika tidak / wildcard | `$?` | mengandung |
| `??` | cocok | `$??` | temukan semua indeks (basis-1) |
| `@` | perulangan | `$[s..e]` | irisan (basis-1) |
| `@ N { }` | perulangan N kali | `$>` | peta |
| `@!` | hentikan | `$|` | filter |
| `@>` | lanjutkan | `$<` | reduksi |
| `@:nama { }` | perulangan berlabel | `$/ pemisah` | pemisahan string |
| `@:nama!` | hentikan berlabel | `$++ a b c` | bangun penggabungan |
| `@:nama>` | lanjutkan berlabel | `arr[i>j>k]` | indeks navigasi |
| `->` | lambda | `arr[i] = nilai` | perbarui elemen (hanya array) |
| `arr[i] += nilai` | pembaruan gabungan | `arr[i]$~` | pembaruan fungsional (salinan baru) |
| `$^+` | urutkan naik (primitif) | `$^-` | urutkan turun (primitif) |
| `$^` | urutkan dengan pembanding (tuple) | `<~` | kembali |
| `|>` | pipe | `!?` | coba |
| `:!` | tangkap | `:>` | akhirnya |
| `#1` | benar | `#0` | salah |
| `$!` | adalah error | `$!!` | sebarkan error |
| `<#` | impor | `#>` | ekspor |
| `#` | deklarasikan modul | `::` | panggil modul |
| `.` | akses bidang | `#?` | metadata tipe |
| `#\|..\|` | parse angka | `##.` | konversi ke Float |
| `###` | konversi ke Int (bulatkan) | `##!` | konversi ke Int (potong) |
| `#.N\|..\|` | bulatkan | `#!N\|..\|` | potong |
| `#,\|..\|` | format koma | `#^\|..\|` | ilmiah |
| `#d0d9#` | ubah mode numerik | `#09#` | reset ke ASCII |
| `<\ ..\>` | jalankan shell | `>\<` | argumen CLI |
| `\ var` | hancurkan variabel secara eksplisit | | |

---

## Log Perubahan Rilis

### v0.0.4 — Pengindeksan Basis-1, Fungsi Kelas Satu & Blok Modul _(April 2026)_

- **Melanggar** Semua pengindeksan diubah menjadi **basis-1** — `arr[1]` adalah elemen pertama; `arr[0]` adalah error runtime
- **Ditambahkan** Fungsi bernama adalah **nilai kelas satu** — kirim langsung ke HOF: `nums$> ganda`
- **Ditambahkan** **Sintaks blok** modul wajib: `# nama { ... }` — sintaks datar dihapus
- **Ditambahkan** Pengindeksan multidimensi: `arr[i>j>k]` (navigasi), `arr[p ; q]` (ekstraksi datar)
- **Ditambahkan** Konversi tipe: `##.expr` (Float), `###expr` (Int bulatkan), `##!expr` (Int potong)
- **Ditambahkan** Pemisahan string: `str$/ pemisah` — mengembalikan `Array(String)`
- **Ditambahkan** Bangun penggabungan: `basis$++ a b c` — menambahkan beberapa item
- **Ditambahkan** Perulangan N kali: `@ N { }` — ulangi tepat N kali
- **Ditambahkan** Sintaks perulangan berlabel: `@:nama { }`, `@:nama!`, `@:nama>` — menggantikan `@ @nama` / `@! nama`
- **Ditambahkan** Aturan lingkup variabel: variabel `_nama` memiliki lingkup blok yang tepat; `\ var` menghancurkan lebih awal
- **Ditambahkan** Pola perbandingan pencocokan: `< 0 :`, `> 5 :`, `== 42 :` dll.
- **Ditambahkan** Error modul E013: pernyataan yang dapat dieksekusi di badan modul dilarang
- **Diperbaiki** `take_variable` tidak lagi merusak konstanta modul saat menulis kembali
- **Diperbaiki** `alias.CONST` sekarang diselesaikan dengan benar; `#>` dapat muncul setelah definisi fungsi
- **VM** Paritas penuh: 393/393 tes lulus

### v0.0.3 — Sistem Angka Unicode & Peningkatan LSP _(April 2026)_

- **Ditambahkan** 69 blok digit Unicode dengan token switch mode `#d0d9#`
- **Ditambahkan** Literal Boolean dalam aksara apa pun — `#१` / `#०`, `#१` / `#०`, dll.
- **Ditambahkan** Digit Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ditambahkan** Opcode VM `SetNumeralMode` — paritas penuh dengan tree-walker
- **Ditambahkan** REPL menghormati mode numerik aktif dalam gema dan tampilan variabel
- **Diubah** Keluaran Boolean `>>` sekarang menyertakan awalan `#` (`#0` / `#1`) di semua mode

### v0.0.2_01 — Penggantian Nama Operator _(30 Mar 2026)_

- **Diubah** `c|..|` → `#,|..|` dan `e|..|` → `#^|..|` — konsisten dengan keluarga awalan format `#`
- **Ditambahkan** Alias ekspor: re-ekspor anggota modul dengan nama berbeda

### v0.0.2 — Desain Ulang API Koleksi & Penginstal _(24 Mar 2026)_

- **Ditambahkan** Keluarga operator `$` terpadu untuk array dan string (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ditambahkan** Penugasan destrukturisasi untuk array, tuple, dan tuple bernama
- **Ditambahkan** Indeks negatif (`arr[-1]` = elemen terakhir)
- **Ditambahkan** Penginstal asli — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Ditambahkan** Penugasan gabungan `^=`
- **Diperbaiki** Kasus tepi aritmetika parser; koreksi dokumentasi

### v0.0.1 — Rilis Publik Perdana _(22 Mar 2026)_

- Interpreter tree-walker + VM register (`--vm`, ~4× lebih cepat, ~95% paritas)
- Semua konstruk inti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengenal Unicode penuh, sistem modul, lambda, penutupan, penanganan error
- REPL, LSP, ekstensi VS Code, pemformat (`zymbol fmt`)

---

_Zymbol-Lang — Simbolik. Universal. Tidak Dapat Diubah._
