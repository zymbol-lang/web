> **Penyangkalan:** Dokumen ini dibuat dan diterjemahkan oleh kecerdasan buatan (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Referensi kanonik adalah **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** di repositori juru bahasa.

---

# Manual Zymbol-Lang

> **Direvisi untuk v0.0.9 — 2026-09-07**

**Zymbol-Lang** adalah bahasa pemrograman simbolis. Tidak ada kata dalam tata bahasanya — setiap konstruksi adalah simbol. Bekerja secara identik dalam bahasa manusia apa pun.

- Tidak ada `if`, `while`, `return` — hanya `?`, `@`, `<~`
- Unicode penuh — pengenal dalam bahasa atau emoji apa pun
- Agnostik terhadap bahasa manusia — kodenya sama di mana pun

**Versi juru bahasa**: v0.0.9 | **Cakupan pengujian**: 660/666 (tiga mesin setuju, 0 berbeda)

---

## Variabel dan Konstanta

```zymbol
x = 10              // variabel yang dapat diubah
PI := 3.14159       // konstanta — penugasan ulang adalah kesalahan waktu jalan
nama = "Alisha"
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
x++       // 5
x--       // 4
```

`°` (tanda derajat, U+00B0) secara otomatis menginisialisasi variabel ke nilai netralnya pada penggunaan pertama:

```zymbol
angka = [3, 1, 4, 1, 5]
@ n:angka {
    °total += n
}
>> total ¶              // → 14
```

> `°var` (awalan) berlabuh di atas perulangan — hasilnya dapat dibaca setelah `@`.
> `var°` (akhiran) berlabuh di dalam perulangan — mati saat perulangan berakhir.

Pernyataan yang hanya berupa nama akan membaca variabel dan membuang nilainya, sehingga memberi peringatan:

```zymbol
hitungan = 5
hitungan
```

Kompilator memberi peringatan seperti ini (pesannya selalu dalam bahasa Inggris):

```text
warning: this statement does nothing: 'hitungan' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Artinya: *«pernyataan ini tidak melakukan apa pun: 'hitungan' dibaca dan dibuang»*.

---

## Tipe Data

| Tipe | Literal | Tag `#?` | Catatan |
|------|---------|----------|---------|
| Bilangan bulat | `42`, `-7` | `###` | Bilangan bulat aman: ±(2⁵³ − 1) |
| Bilangan pecahan | `3.14`, `1.5e10` | `##.` | Ganda IEEE-754 |
| String | `"teks"` | `##"` | Interpolasi: `"Halo {nama}"` |
| Karakter | `'A'` | `##'` | Satu titik kode Unicode |
| Boolean | `#1`, `#0` | `##?` | BUKAN numerik — `#1 ≠ 1` |
| Larik | `[1, 2, 3]` | `##]` | Satu tipe, diperiksa |
| Campuran dideklarasikan | `#[1, "dua"]` | `##[` | Tipe sama dengan `[…]`, tidak diperiksa |
| Tupel | `(a, b)` | `##)` | Posisional, tidak dapat diubah |
| Kamus | `#(x: 1, y: 2)` | `##(` | Berbasis kunci, dapat diubah |
| Fungsi | referensi fungsi bernama | `##()` | Kelas satu; tampilkan `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas satu; tampilkan `<lambd/N>` |
| Unit | `##_` | `##_` | Ketidakhadiran — tidak ada null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Bilangan bulat yang keluar dari rentang aman adalah kesalahan yang dapat ditangkap, bukan pembungkusan diam-diam:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "di luar rentang" ¶ // → di luar rentang
}
```

`##_` adalah cara program bertanya apakah sesuatu tidak ada:

```zymbol
kosong() { }
nilai = kosong()
>> (nilai == ##_) ¶     // → #1
```

---

## Keluaran dan Masukan

```zymbol
nama = "Alisha"
total = 3
>> "Halo" ¶             // → Halo
>> "a=" nama " b=" total ¶ // → a=Alisha b=3
>> total#? ¶            // → (###, 1, 3)
```

```zymbol
<< nama
<< "Masukkan nama Anda: " nama
<< ###(4) "Usia: " usia
```

**Perhatikan bentuk kedua simbol.** `>>` menunjuk ke luar: ia mengeluarkan data dari program. `<<` menunjuk ke dalam: ia membawa data ke dalam program. Tidak ada yang perlu diingat di sini — panah menunjukkan arah informasi mengalir, dan gagasan yang sama kembali dalam setiap simbol yang memindahkan sesuatu.

> `¶` dan `\\` adalah baris baru yang setara. `>>` tidak pernah menambahkan satu pun.
> Penentu tipe sebelum prompt memvalidasi saat membaca dan meminta ulang hingga nilainya valid:
> `##.` Bilangan pecahan · `##.(T,D)` desimal · `###(N)` Bilangan bulat · `##"(N)` teks · `##'` satu Karakter.

Di tingkat atas sebuah berkas, `<~` adalah status keluar program:

```zymbol
>> "memeriksa" ¶      // → memeriksa
<~ 0
```

---

## Primitif TUI

Operator antarmuka terminal untuk program interaktif. Sebagian besar memerlukan blok `>>| { }` (layar alternatif + mode mentah).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Menjalankan"
    @~ 1000
    >>~ (2, 1) > "Selesai."
}
```

```zymbol
>>| {
    [baris, kolom] = >>?
    >>~ (1, 1) > "Terminal: " baris " x " kolom
    <<| tombol
    >>~ (2, 1) > "Ditekan: " tombol
}
```

Di sini Anda dapat melihat mengapa simbol-simbol digabungkan daripada dikalikan. Anda sudah tahu bahwa `<<` adalah masukan dan `?` bertanya tanpa berkomitmen. Hanya satu simbol yang baru:

- `|` adalah **satu unit**, bukan seluruh aliran.

Dengan demikian, kedua operator keyboard dapat dibaca sendiri:

```text
<<        |             ?
masukan   satu unit     tanpa berkomitmen

<<|   ambil SATU tombol, dan tunggu sampai ada satu
<<|?  lihat apakah ADA tombol, dan lanjutkan jika tidak ada
```

Hal yang sama di sisi lain: `>>` mengirimkan, `>>!` mengirimkan **dengan paksa** (membersihkan seluruh layar), sedangkan `>>?` **bertanya** daripada menulis (seberapa besar terminal). Simbol di sebelah kanan adalah yang mengubah mode, dan selalu datang terakhir.

> `>>!` membersihkan layar. `>>?` mengembalikan `(baris, kolom)`. `@~ N` tidur N milidetik.
> `<<|` membaca satu penekanan tombol (memblokir); `<<|?` menjajaki tanpa memblokir (`'\0'` jika tidak ada).
> Tombol panah datang didekode sebagai `'↑' '↓' '←' '→'`; ESC adalah titik kode 27.
> Tupel keluaran posisi: `(baris, kolom, BKS, depan, belakang)` — slot apa pun dapat dihilangkan dengan koma (`>>~ (,,, 196) > "merah"`).
> Masker BKS: `1`=Tebal, `2`=Miring, `4`=Garis bawah. Palet 256 warna ANSI (`0`=default terminal).

---

## Operator

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pembagian bilangan bulat)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` tidak pernah memaksa: `"5" == 5` adalah `#0`. Pengurutan memaksa: `"5" > 4` adalah `#1`, dan `"४२" > 5` juga — teks numerik dalam salah satu dari 69 aksara membandingkan sebagai angka.
> Sebuah fungsi hanya sama dengan dirinya sendiri, tidak pernah sama dengan fungsi lain dengan tubuh yang sama.

---

## String

```zymbol
nama = "Alisha"
n = 42
>> "Halo " nama " Anda punya " n ¶ // → Halo Alisha Anda punya 42
deskripsi = "Halo {nama}, Anda punya {n}"
>> deskripsi ¶              // → Halo Alisha, Anda punya 42
```

```zymbol
s = "Halo dunia"
panjang = s$#                  // 10
sub = s$[1..4]             // "Halo"
ada = s$? "dunia"          // #1
bagian = "a,b,c,d"$/ ','    // [a, b, c, d]
ganti = s$~~["o":"0"]        // "Hal0 dunia"
garis = "─" $* 20
```

> `+` hanya untuk angka. Untuk string gunakan penjajaran atau interpolasi.
> `\{` dan `\}` adalah kurung kurawal literal — escape-nya simetris.

---

## Aliran Kontrol

```zymbol
x = 7
? x > 100 {
    >> "besar" ¶
} _? x > 0 {
    >> "positif" ¶     // → positif
} _ {
    >> "negatif" ¶
}
```

Di sini ada dua simbol baru, dan yang ketiga berasal dari menggabungkannya:

- `?` adalah **bertanya**: ia membuka kondisi.
- `_` adalah **apa yang tidak ditentukan**: cabang yang tersisa ketika tidak ada pertanyaan yang cocok.
- `_?` adalah keduanya berurutan: *jika tidak ada yang cocok, tanya lagi*.

Itulah mengapa `_?` ditulis demikian. Ini bukan simbol baru untuk dipelajari — ini `_` diikuti `?`, dan artinya persis seperti yang kedua bagiannya artikan, dibaca secara berurutan.

> Kurung kurawal `{ }` **wajib** bahkan untuk satu pernyataan.

---

## Pencocokan

```zymbol
skor = 85
nilai = ?? skor {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> nilai ¶              // → B
```

```zymbol
suhu = -5
status = ?? suhu {
    < 0  => "es"
    < 20 => "dingin"
    _    => "panas"
}
>> status ¶              // → es
```

Anda sudah tahu bahwa `?` adalah "bertanya". **`??` adalah bertanya berkali-kali**: menggandakan sebuah simbol, di mana pun dalam bahasa, adalah melakukan beberapa kali apa yang simbol lakukan sekali. Satu `?` menguji kondisi; `??` menguji terhadap daftar kasus.

Alternatif bergabung dengan `||`, dan dapat mencampur jenis pola:

```zymbol
tombol = 'P'
tindakan = ?? tombol {
    'p' || 'P' => "jeda"
    < 0 || > 100 => "di luar rentang"
    _ => "diabaikan"
}
>> tindakan ¶             // → jeda
```

---

## Perulangan

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
buah = ["apel", "pir", "anggur"]
@ b:buah { >> b " " }
>> ¶                    // → apel pir anggur
@ c:"Halo" { >> c "-" }
>> ¶                    // → H-a-l-o-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
hitungan = 0
@:luar {
    hitungan++
    ? hitungan >= 3 { @:luar! }
}
>> hitungan ¶             // → 3
```

`@` adalah simbol **waktu**: segala sesuatu yang berulang hidup di dalamnya. Untuk memotong waktu itu, Anda menambahkan simbol di sampingnya:

- `@!` — `!` adalah **paksa**: tinggalkan perulangan sekarang.
- `@>` — `>` mendorong maju: lanjutkan ke putaran berikutnya.
- `@:luar!` — `:` **mengikat nama**, jadi ini memotong perulangan yang *bernama* luar, bukan yang terdekat.

Tiga operator, dan tidak ada yang perlu dihafal secara terpisah: mereka adalah `@` ditambah simbol yang sudah mengatakan apa yang dilakukannya.

> **Penentu adalah hitungan atau kondisi.** `Bilangan bulat` adalah hitungan, dievaluasi sekali — `@ 0` menjalankan tubuh nol kali. Apa pun selain itu adalah kondisi. Tidak ada kebenaran: `@ []` dan `@ 3.5` ditolak. Untuk melintasi koleksi gunakan `@ x:item`; untuk menghitungnya, `@ item$#`.

---

## Fungsi

```zymbol
tambah(a, b) { <~ a + b }
>> tambah(3, 4) ¶        // → 7
```

```zymbol
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶       // → 120
```

Sebuah fungsi membaca variabel berkas berdasarkan nilai, dan penulisan di dalam tetap di dalam:

```zymbol
batas = 100
di_dalam(n) { <~ n < batas }
>> di_dalam(42) ¶         // → #1
```

Dua simbol mengubah itu, dan keduanya ditulis **di tanda tangan dan di tempat pemanggilan**:

```zymbol
tambah_hitung(hitungan<~) { hitungan = hitungan + 1 }
total = 0
tambah_hitung(total<~)
>> total ¶              // → 1
```

> `p~` adalah salinan kerja — tubuh dapat menetapkan ulang dan pemanggil tetap utuh.
> `p<~` adalah parameter keluaran — perubahannya kembali. `tambah_hitung(total)` tanpa simbol adalah kesalahan semantik: anotasi dan tanda tangan tidak dapat menyimpang.

---

## Lambda dan Penutupan

```zymbol
dua_kali = x -> x * 2
jumlah = (a, b) -> a + b
>> dua_kali(5) ¶          // → 10
>> jumlah(3, 7) ¶          // → 10
```

```zymbol
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "nol"
}
>> klasifikasi(-4) ¶         // → negatif
```

```zymbol
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶          // → 21
```

```zymbol
buat_penambah(n) { <~ x -> x + n }
tambah10 = buat_penambah(10)
>> tambah10(5) ¶           // → 15
```

Lambda dapat tidak mengambil parameter sama sekali:

```zymbol
jawaban = () -> 42
>> jawaban() ¶           // → 42
```

> Lambda menangkap variabel berkas **saat dibuat**; fungsi bernama membacanya **saat dipanggil**.

---

## Larik

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   pengindeksan berbasis 1
>> arr[-1] ¶      // → 5   negatif menghitung dari akhir
>> arr$# ¶        // → 5   panjang
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   tambahkan
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  sisipkan di posisi 2
>> (arr$- 3) ¶          // → [1, 2]         hapus kemunculan pertama
>> (arr$-[1]) ¶         // → [2, 3]         hapus di indeks 1
>> (arr$[1..2]) ¶       // → [1, 2]         iris, kedua ujung termasuk
>> (arr$? 3) ¶          // → #1             berisi
```

Semuanya dimulai dengan `$`, simbol **koleksi**, dan dilanjutkan dengan simbol yang mengatakan apa yang dilakukan di dalamnya: `#` berapa banyak, `+` tambahkan, `-` hapus, `?` tanya apakah ada. Dan seperti dengan `??`, menggandakan simbol berarti melakukannya secara menyeluruh: `$?` bertanya *apakah* suatu nilai ada, `$??` bertanya *di berapa tempat* dan mengembalikan semuanya.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   naik
>> (arr$^-) ¶     // → [3, 2, 1]   turun
```

**Aturan hasil.** Satu operator, dan apa yang dilakukan kode di sekitarnya dengannya memutuskan: digunakan, ia **membangun** dan membiarkan yang asli utuh; dibuang, ia **memodifikasi**.

```zymbol
arr = [1, 2, 3]
salinan = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> salinan ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` tidak pernah menulis ke koleksi.** `arr[2] = 99` bukanlah bentuk Zymbol — `=` memberikan nilai ke **NAMA**. Mengubah bagian dari koleksi adalah `$~`, di setiap koleksi.

`[…]` berisi satu tipe dan diperiksa; campuran yang disengaja **dideklarasikan** dengan `#[…]`:

```zymbol
campuran = #[1, "dua", #1]
>> campuran ¶             // → [1, dua, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Pengindeksan Multidimensi

`>` turun ke struktur bersarang. Satu kelompok kurung siku mengalamatkan satu elemen, sedalam apa pun.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   baris 2, kolom 3
>> m[-1>-1] ¶      // → 9   baris terakhir, kolom terakhir
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          datar: diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   terstruktur: sudut
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **bukan** bentuk Zymbol. Indeks berantai ditolak baik untuk membaca maupun menulis — satu kelompok kurung siku per akses, dan `>` adalah apa yang ada di antara langkah-langkah.

---

## Kamus

Tupel dengan bidang bernama adalah kamus, dan sejak v0.0.9 ditulis `#(…)`.

```zymbol
orang = #(nama: "Alisha", usia: 25)
>> orang.nama ¶        // → Alisha
>> orang["usia"] ¶    // → 25
```

```zymbol
orang = #(nama: "Alisha", usia: 25)
bidang = "nama"
>> orang[bidang] ¶     // → Alisha
```

Ia dapat diubah, kunci dapat ditambahkan, dan dapat dilintasi:

```zymbol
stok = #(pir: 4)
stok["apel"]$~ 10
@ k:stok { >> k "=" stok[k] " " }
>> ¶                    // → pir=4 apel=10
```

```zymbol
stok = #(pir: 4, apel: 10)
@ (k, v):stok { >> k ":" v " " }
>> ¶                    // → pir:4 apel:10
```

> `#()` adalah kamus kosong, yang `()` tidak bisa menjadi — ia harus menjadi tupel kosong juga. `(x: 1)` yang telanjang ditolak dengan pesan ini: *a dictionary is written `#(…)`* — «kamus ditulis `#(…)`».
> Kamus dialamatkan berdasarkan kunci, tidak pernah berdasarkan posisi, jadi `orang[1]` adalah kesalahan.

---

## Tupel

Tupel adalah wadah terurut yang **tidak dapat diubah** yang menyimpan nilai dari tipe yang berbeda.

```zymbol
titik = (10, 20)
>> titik[1] ¶           // → 10
data = (42, "Halo", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Setiap upaya untuk mengubah tupel di tempat adalah kesalahan, operator apa pun — ketidakubahan adalah properti dari nilai, bukan pengecualian di dalam setiap `$`.

---

## Destrukturisasi

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[pertama, *sisanya] = arr
>> pertama ¶            // → 10
>> sisanya ¶              // → [20, 30, 40, 50]
```

```zymbol
titik = (100, 200)
(px, py) = titik
>> px " " py ¶          // → 100 200
```

```zymbol
orang = #(nama: "Ana", usia: 25)
#(nama: n, usia: u) = orang
>> n " " u ¶            // → Ana 25
```

> Bentuk kurung diketik: `[…]` mengambil larik, `(…)` tupel, `#(…)` kamus. Nama terakhir **menyerap sisanya**, sehingga destrukturisasi tidak pernah gagal karena panjang — `(a, b, c) = (1,2,3,4,5)` menghasilkan `c = (3,4,5)`, dan `##_` saat tidak ada yang tersisa.

---

## Fungsi Orde Tinggi

```zymbol
angka = [1, 2, 3, 4, 5]
>> (angka$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (angka$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (angka$< (0, (akum, x) -> akum + x)) ¶ // → 15
```

```zymbol
angka = [1, 2, 3, 4, 5, 6]
dua_kali(x) { <~ x * 2 }
besar(x) { <~ x > 3 }
>> (angka$> dua_kali) ¶    // → [2, 4, 6, 8, 10, 12]
>> (angka$| besar) ¶    // → [4, 5, 6]
```

```zymbol
basis = [#(nama: "Carla", usia: 28), #(nama: "Ana", usia: 25)]
menurut_usia = basis$^ (a, b -> a.usia < b.usia)
>> menurut_usia[1].nama ¶     // → Ana
```

> Fungsi bernama menuju ke HOF **tanpa tanda kurung**: `angka$> dua_kali`. Menulis `angka$> (dua_kali)` adalah kesalahan parsing, karena `(` membuka lambda.

---

## Operator Pipa

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> dua_kali(_)) ¶    // → 10
>> (10 |> tambah(_, 5)) ¶  // → 15
>> (5 |> dua_kali(_) |> inc(_)) ¶ // → 11
```

---

## Penanganan Kesalahan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pembagian dengan nol" ¶  // → pembagian dengan nol
} :! {
    >> "lainnya: " _err ¶
} :> {
    >> "selalu dijalankan" ¶        // → selalu dijalankan
}
```

| Jenis | Kapan |
|-------|-------|
| `##Div` | Pembagian dengan nol |
| `##Index` | Indeks di luar batas |
| `##Key` | Kunci tidak ada di kamus |
| `##Range` | Di luar rentang bilangan bulat aman |
| `##Type` | Ketidakcocokan tipe |
| `##Parse` | Penguraian data |
| `##IO` | Berkas / sistem |
| `##Network` | Kesalahan jaringan |
| `##DB` | Basis data |
| `##Time` | Tanggal yang tidak ada |
| `##_` | Kesalahan apa pun (tangkap-semua) |

`!` adalah simbol **kesalahan dan paksaan**, dan dibaca sama di kedua keluarga: `$!` bertanya pada nilai apakah itu kesalahan; `$!!`, dengan simbol digandakan, menyebarkannya ke atas tanpa bertanya.

> Kegagalan pustaka standar kembali sebagai **nilai kesalahan lunak** yang Anda uji dengan `$!` atau tangkap dengan `!?`, daripada menghentikan. `$!!` menyebarkan satu ke pemanggil.

---

## Modul

```zymbol
# kalk {
    #> { tambah, PI }

    PI := 3.14159
    tambah(a, b) { <~ a + b }
}
```

```zymbol
<# ./kalk => k

>> k::tambah(5, 3) ¶
>> k.PI ¶
```

```zymbol
# perpustakaan_ku {
    #> { tambah_dalam => jumlah }

    tambah_dalam(a, b) { <~ a + b }
}
```

Kedua simbol modul adalah ide yang sama, sekarang diterapkan pada berkas: `#` adalah tingkat **deklarasi** — apa suatu hal *adalah*, bukan nilainya — dan panah mengatakan ke arah mana kode bergerak:

```text
<#   panah masuk: impor, bawa dari berkas lain
#>   panah keluar: ekspor, tawarkan ke berkas lain
```

Simbol arah selalu berada di tepi yang menghadap ke arah yang ditunjuknya. Ini alasan yang sama mengapa `<~` kembali ke kiri (keluar dari fungsi) dan `->` masuk ke kanan (ke tubuh lambda).

> **Modul mendeklarasikan apa yang diekspornya.** Blok `#>` wajib — menghilangkannya adalah **E014**, dan `#> { }` adalah cara modul mengatakan permukaannya kosong. `::` memanggil fungsi, `.` membaca konstanta. Hanya impor, blok ekspor, inisialisasi literal, dan definisi fungsi yang boleh muncul di tubuh modul; apa pun yang dapat dieksekusi adalah **E013**.

---

## Pustaka Standar

Modul asli, diimpor seperti yang lain:

| Modul | Fungsi |
|-------|--------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   dua glyph, empat kolom
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

hari = T::of(2026, 1, 31)
>> T::format(hari, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(hari, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` mengukur **kolom tampilan**, bukan karakter: CJK dan sebagian besar emoji adalah 2 kolom, jadi tata tabel dengan `t::width`, jangan pernah `$#`.
> Di `std/time` sebuah instan adalah milidetik sejak zaman. Di bawah satu hari adalah durasi, dari satu hari ke atas adalah kalender — jadi sebulan jatuh pada hari yang sama dalam bulan, dijepit. `selisih(a, b)` adalah `a - b`, jadi instan yang lebih dulu terlebih dahulu memberikan jawaban negatif.

---

## Paket

Sebuah `.zyp` menggabungkan program multi-berkas menjadi satu berkas portabel. Ini adalah arsip **sumber**, bukan biner, sehingga berjalan di mana pun biner `zymbol` berjalan.

```bash
zymbol package proyekku/ --script main.zy -o proyekku.zyp
zymbol run proyekku.zyp
```

> Arsip membawa manifes (`zyp.toml`) yang mendeklarasikan skrip entri dan versi mesin yang dibutuhkannya. `zymbol run` mengekstraknya ke direktori sementara dan menjalankan dari sana, sehingga kode bersifat sekali pakai sementara apa yang ditulis skrip jatuh ke direktori kerja nyata Anda. Taman bermain juga memuat berkas `.zyp`.

---

## Mode Numerik

Zymbol dapat menulis angka dalam **69 aksara digit Unicode** — Dewanagari, Arab-Indik, Thai, Klingon pIqaD, Tebal Matematika, segmen LCD, dan banyak lagi. Mode bersifat global untuk proses dan memengaruhi keluaran; aritmetika tidak berubah.

```zymbol
#०९#    // Dewanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indik (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // atur ulang ke ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Digit dari aksara apa pun yang didukung adalah literal yang valid dalam sumber:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Pembacaan simetris — digit dipahami dalam aksara apa pun:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` selalu ASCII, jadi `#0` tetap terlihat berbeda dari digit nol di setiap aksara.
> `#,` dan `#^` juga menulis digitnya dalam aksara aktif, dan pemisah mengikutinya — tetapi pasangan tidak pernah terbalik: `,` mengelompokkan dan `.` memisahkan, di setiap aksara.

---

## Operator Data

```zymbol
f = ##.42         // ke Bilangan pecahan
i = ###3.7        // ke Bilangan bulat, dibulatkan  → 4
t = ##!3.7        // ke Bilangan bulat, dipotong  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Bilangan pecahan dicetak sebagai digit, tidak pernah sebagai eksponen, dan membuang `.0` akhir — `##.42` menulis `42` dan tetap sebagai Bilangan pecahan, seperti yang ditunjukkan `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   aman-gagal: mengembalikan masukan tanpa perubahan
>> ##!'A' ¶        // → 65    titik kode Karakter
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          bulatkan ke 2 desimal
>> #!2|pi| ¶       // → 3.14          potong ke 2 desimal
>> #,|1234567| ¶   // → 1,234,567     pemisah ribuan
>> #^|12345.678| ¶ // → 1.2345678e4   notasi ilmiah
```

```zymbol
>> 0x41 ¶        // → A   heksadesimal
>> 0b01000001 ¶  // → A   biner
>> 0o101 ¶       // → A   oktal
>> 0d65 ¶        // → A   desimal
```

> Literal basis dalam rentang ASCII adalah **Karakter**: `0d65 == 'A'` adalah `#1`, dan `0d65 == 65` adalah `#0`. Keempat basis mengeja karakter yang sama.

---

## Integrasi Shell

```zymbol
hari_ini = <\ date +%Y-%m-%d \>
>> "Hari ini: " hari_ini
```

```zymbol
keluaran = </"./sub_skrip.zy"/>
>> keluaran
```

> `<\ … \>` menangkap stdout dan stderr, dengan menghapus baris baru di akhir.
> `>< args` menangkap argumen baris perintah sebagai larik string.

---

## Contoh Lengkap: FizzBuzz

```zymbol
klasifikasi(angka) {
    ? angka % 15 == 0 { <~ "FizzBuzz" }
    _? angka % 3  == 0 { <~ "Fizz" }
    _? angka % 5  == 0 { <~ "Buzz" }
    <~ angka
}

@ i:1..20 { >> klasifikasi(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (satu per baris)
```

---

## Bagaimana Simbol Digabungkan

Anda telah melihat hal yang sama sepanjang manual ini: **operator bukanlah gambar yang harus dihafal, ini adalah beberapa simbol dalam satu baris, dan masing-masing menyumbangkan maknanya.** Sekarang Anda tahu semuanya, inilah pola lengkapnya.

Pertama datang **dunia mana kita berada**:

| Simbol | Dunia | Anda melihatnya di |
|--------|-------|-------------------|
| `$` | sebuah koleksi | `$#` `$+` `$?` `$^-` |
| `@` | waktu, apa pun yang berulang | `@!` `@>` `@~` |
| `#` | apa suatu hal *adalah*, bukan nilainya | `#?` `#(…)` `<#` `#>` |
| `>>` | keluar dari program | `>>` `>>!` `>>?` |
| `<<` | masuk ke program | `<<` `<<\|` `<<\|?` |
| `?` | bertanya, tanpa berkomitmen | `?` `_?` `??` `$?` |
| `!` | paksaan, atau kesalahan | `@!` `$!` `!?` |

Kemudian datang **apa yang dilakukan di sana**: `+` tambah, `-` hapus, `^` urutkan, `~` modifikasi, `#` hitung, `|` satu unit, `:` ikat nama.

Dan dua aturan yang tidak pernah gagal:

**Menggandakan simbol membuatnya menyeluruh.** `?` bertanya sekali, `??` menguji banyak kasus. `$?` bertanya apakah suatu nilai ada, `$??` mengembalikan setiap tempat di mana ia berada. `!` menandai kesalahan, `!!` menyebarkannya tanpa bertanya.

**Simbol mode selalu datang terakhir.** Ketika `?` atau `!` muncul untuk mengatakan *bagaimana* sesuatu dilakukan — dengan ragu atau paksa — mereka adalah simbol terakhir dari operator: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:luar!`. Tidak pernah ada operasi setelahnya.

Sesuatu yang praktis muncul dari itu: **kombinasi yang belum pernah Anda lihat sudah masuk akal sebelum Anda mencarinya.** Jika `$` adalah koleksi dan `^` adalah urutan dan `-` adalah kebalikan, maka `$^-` mengurutkan menurun, dan tidak ada yang perlu memberi tahu Anda.

Tidak seluruh inventaris bekerja seperti ini, dan mengatakannya lebih baik daripada berpura-pura. Sebagian besar operator dapat diurai dengan bersih. Enam dapat diurai tetapi berarti lebih dari bagian-bagiannya: `!?` `:!` `:>` `|>` `::` `$++`. Dan sepuluh harus dihafal karena tidak dapat diurai sama sekali: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Menghitung yang buram daripada menganggap jumlahnya sedikit adalah disengaja: mereka adalah biaya hafalan nyata dari bahasa tersebut. Referensi lengkap — inventaris, homograf yang dideklarasikan, dan aturan yang harus dipenuhi oleh operator baru untuk ada — ada di `SYMBOLS.md`, di repositori juru bahasa.

---

## Referensi Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|---------|--------|---------|
| `=` | variabel | `$#` | panjang |
| `:=` | konstanta | `$+` | tambahkan |
| `>>` | keluaran | `$+[i]` | sisipkan di indeks (berbasis 1) |
| `<<` | masukan | `$-` | hapus yang pertama berdasarkan nilai |
| `¶` / `\\` | baris baru | `$--` | hapus semua berdasarkan nilai |
| `?` | jika | `$-[i]` | hapus di indeks (berbasis 1) |
| `_?` | selain-jika | `$-[i..j]` | hapus rentang (berbasis 1) |
| `_` | selain / wildcard | `$?` | berisi |
| `??` | pencocokan | `$??` | temukan semua indeks (berbasis 1) |
| `\|\|` | atau-pola di cabang match | `$[s..e]` | iris (berbasis 1) |
| `@` | perulangan | `$>` | petakan |
| `@ N { }` | perulangan N kali | `$\|` | saring |
| `@!` | hentikan | `$<` | reduksi |
| `@>` | lanjutkan | `$/ pembatas` | bagi string |
| `@:nama { }` | perulangan berlabel | `$++ a b c` | bangun dengan penggabungan |
| `@:nama!` | hentikan label | `$~~[p:r]` | ganti string |
| `@:nama>` | lanjutkan label | `$*` | ulangi string |
| `->` | lambda | `arr[i]$~ v` | SATU-SATUNYA bentuk pembaruan |
| `<~` | kembali / parameter keluaran | `~` | parameter salinan kerja |
| `arr[i>j]` | indeks navigasi | `arr[p ; q]` | ekstraksi datar |
| `$^+` | urutkan naik | `$^-` | urutkan turun |
| `$^` | urutkan dengan pembanding | `\|>` | pipa |
| `!?` | coba | `:!` | tangkap |
| `:>` | akhirnya | `$!` | apakah kesalahan |
| `$!!` | sebarkan kesalahan | `#1` / `#0` | benar / salah |
| `##_` | Unit — ketidakhadiran | `[…]` | larik, satu tipe |
| `#[…]` | larik, campuran dideklarasikan | `#(…)` | kamus |
| `(…)` | tupel posisional | `#()` | kamus kosong |
| `<#` | impor | `#>` | ekspor |
| `#` | deklarasikan modul | `::` | panggil modul |
| `.` | akses bidang / konstanta | `#?` | metadata tipe |
| `#\|..\|` | urai angka | `##.` | konversi ke Bilangan pecahan |
| `###` | konversi ke Bilangan bulat (bulat) | `##!` | konversi ke Bilangan bulat (potong) |
| `#.N\|..\|` | bulatkan | `#!N\|..\|` | potong |
| `#,\|..\|` | pemisah ribuan | `#^\|..\|` | ilmiah |
| `#d0d9#` | alihkan mode numerik | `#09#` | atur ulang ke ASCII |
| `<\ ..\>` | jalankan shell | `><` | argumen CLI |
| `\ var` | hancurkan variabel | `°x` / `x°` | definisi panas |
| `>>\|` | blok TUI (layar alternatif) | `>>~` | keluaran posisi |
| `>>!` | bersihkan layar | `>>?` | tanyakan ukuran terminal |
| `<<\|` | penekanan tombol memblokir | `<<\|?` | penekanan tombol tidak memblokir |
| `@~ N` | tidur N milidetik | `0d` `0x` `0o` `0b` | literal basis |

---

## Log Perubahan Rilis

### v0.0.9 — Koleksi Memutuskan _(September 2026)_

- **Perubahan besar** Kamus memiliki notasinya sendiri: `#(kunci: nilai)`. `(x: 1)` yang telanjang ditolak, dan `#()` adalah kamus kosong — yang `()` tidak pernah bisa menjadi
- **Perubahan besar** Penugasan terindeks ditarik: `arr[i] = v` dan semua bentuk majemuk. `=` memberikan nilai ke **NAMA**; mengubah bagian dari koleksi adalah `$~`
- **Perubahan besar** Indeks berantai `m[i][j]` ditolak baik untuk membaca maupun menulis — `>` adalah apa yang ada di antara langkah-langkah
- **Perubahan besar** Modul harus mendeklarasikan apa yang diekspornya (**E014**); `#> { }` adalah cara modul mengatakan permukaannya kosong
- **Perubahan besar** Penentu perulangan adalah hitungan atau kondisi — tidak ada kebenaran. `@ []` dan `@ 3.5` ditolak
- **Ditambahkan** `##_` — literal Unit, dan cara program bertanya apakah sesuatu tidak ada
- **Ditambahkan** `#[…]` — larik yang campuran tipe elemennya dideklarasikan
- **Ditambahkan** `#?` membedakan keempat koleksi: `##]` `##[` `##)` `##(`
- **Ditambahkan** `std/time` — jam dan kalender sipil, dengan zona dan aritmetika kalender
- **Ditambahkan** `<~>` di tingkat atas adalah status keluar program
- **Ditambahkan** `@ (k, v):pasangan` — pola di kepala perulangan
- **Ditambahkan** `#|c|` membaca digit dalam salah satu dari 69 aksara; `#,` dan `#^` menulis dalam aksara aktif
- **Diubah** `Bilangan bulat` adalah bilangan bulat aman, ±(2⁵³ − 1), tertutup-gagal di setiap mesin
- **Diubah** Fungsi bernama membaca variabel berkas saat dipanggil, berdasarkan nilai
- **Diubah** Pernyataan yang hanya membaca nama memberi peringatan daripada diam-diam berlalu
- **Mesin** 660 dari 666 berkas korpus setuju di ketiga mesin, 0 berbeda

### v0.0.8 — Pembebasan Otomatis, `std/term` dan Paket _(Agustus 2026)_

- **Ditambahkan** Penghancuran otomatis pada penggunaan terakhir — tidak terlihat; hanya menurunkan memori puncak
- **Ditambahkan** `std/term` — metrik tampilan dalam kolom terminal
- **Ditambahkan** `##!` pada `Karakter` — titik kode Unicode-nya
- **Ditambahkan** Pola-atau dalam match: `'p' || 'P' => …`, alternatif jenis apa pun dalam satu cabang
- **Ditambahkan** Paket Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Ditambahkan** `<~>` di tempat pemanggilan wajib jika yang dipanggil mendeklarasikan parameter keluaran
- **Diperbaiki** Paritas sistem modul di VM register

### v0.0.7 — Pustaka Standar Asli _(Juli 2026)_

- **Ditambahkan** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — semuanya dengan nilai kesalahan lunak
- **Ditambahkan** Masukan bertipe/tervalidasi: `<< ##.(5,2) "harga: " p`
- **Ditambahkan** Operator postfix langsung di `>>` — tidak perlu tanda kurung
- **Diubah** Pemformat tertutup-gagal: menolak menulis keluaran yang tidak dapat dibaca ulang

### v0.0.6 — Penyempurnaan dan Pustaka Ilmiah _(Juni 2026)_

- **Perubahan besar** `=>` menggantikan `:` di cabang match dan `<=` di alias impor/ekspor
- **Ditambahkan** `std/math` dan `std/random`
- **Ditambahkan** Pembaruan kamus berdasarkan kunci: `d["k"]$~ nilai`

### v0.0.5 — Primitif TUI dan Definisi Panas _(Mei 2026)_

- **Ditambahkan** Blok TUI `>>| { }`, keluaran posisi `>>~`, masukan tombol `<<|` dan `<<|?`
- **Ditambahkan** `>>!` bersihkan layar, `>>?` ukuran terminal, `@~ N` tidur
- **Ditambahkan** Definisi panas `°x` / `x°`, dan pengulangan string `$*`

### v0.0.4 — Pengindeksan Berbasis 1 dan Fungsi Kelas Satu _(April 2026)_

- **Perubahan besar** Semua pengindeksan **berbasis 1** — `arr[1]` adalah elemen pertama
- **Ditambahkan** Fungsi bernama sebagai nilai kelas satu; sintaks blok modul `# nama { }`
- **Ditambahkan** Pengindeksan multidimensi `arr[i>j>k]` dan ekstraksi datar `arr[p ; q]`

### v0.0.3 — Sistem Numerik Unicode _(April 2026)_

- **Ditambahkan** 69 blok digit Unicode dengan token alih mode `#d0d9#`
- **Ditambahkan** Literal boolean dalam aksara apa pun — `#१` / `#०`

### v0.0.2 — Desain Ulang API Koleksi _(Maret 2026)_

- **Ditambahkan** Keluarga operator `$` untuk larik dan string
- **Ditambahkan** Penugasan destrukturisasi, dan indeks negatif

### v0.0.1 — Rilis Publik Pertama _(Maret 2026)_

- Juru bahasa penjelajah pohon + VM register (`--vm`)
- Semua konstruksi inti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengenal Unicode penuh, sistem modul, lambda, penutupan, penanganan kesalahan
- REPL, LSP, ekstensi VS Code, pemformat (`zymbol fmt`)

---

_Zymbol-Lang — Simbolis. Universal. Tak Terubah._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lisensi:** manual ini dilisensikan di bawah [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Teks lengkap: `LICENSE-CC-BY-SA-4.0` di <https://github.com/zymbol-lang/web>. Juru bahasa dan mesin peramban (`zymbol.js`) adalah karya terpisah, dilisensikan di bawah AGPL-3.0-only.
