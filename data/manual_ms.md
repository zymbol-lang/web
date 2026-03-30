# Panduan Ringkas Zymbol-Lang

**Zymbol-Lang** ialah bahasa pengaturcaraan simbolik. Ia tidak menggunakan sebarang kata kunci — semuanya adalah simbol. Ia berfungsi sama dalam setiap bahasa manusia.

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

```zymbol
// Introspeksi jenis — mengembalikan (jenis, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Keluaran dan Masukan

```zymbol
>> "Helo" ¶                    // ¶ atau \\ untuk baris baru yang jelas
>> "a=" a " b=" b ¶            // pelbagai nilai secara berdampingan
>> (tatasusunan$#) ¶           // operasi postfix memerlukan kurungan

<< nama                        // tanpa gesaan — baca ke pemboleh ubah
<< "Nama anda? " nama          // dengan gesaan
```

> `¶` atau `\\` adalah setara sebagai baris baru.

---

## Pengendali

```zymbol
// Aritmetik
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (bahagi integer)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (kuasa dua)

// Perbandingan
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logik
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Rentetan

Tiga bentuk yang sah — setiap satu untuk konteks tersendiri:

```zymbol
nama = "Siti"
n = 25

// 1. Koma — dalam tugasan dengan = atau :=
mesej = "Helo ", nama, "!"            // → Helo Siti!

// 2. Berdampingan — dalam keluaran >>
>> "Helo " nama " berumur " n ¶       // → Helo Siti berumur 25

// 3. Interpolasi — dalam mana-mana konteks
penerangan = "Helo {nama}, berumur {n} tahun"   // → Helo Siti, berumur 25 tahun
```

```zymbol
s = "Helo Dunia"
pjg = s$#                  // panjang
sub = s$[0..4]             // "Helo"
ada = s$? "Dunia"          // #1
bah = "a,b,c,d" / ','     // [a, b, c, d]
ganti = s$~~["a":"e"]      // gantikan
ganti1 = s$~~["a":"e":1]   // N pertama
```

> `+` hanya untuk nombor. Untuk rentetan gunakan `,`, penjajaran atau interpolasi.

---

## Kawalan Aliran

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

> Blok `{ }` adalah **wajib**, walaupun untuk satu baris.

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

// Rentetan
warna = "merah"
kod = ?? warna {
    "merah" : "#FF0000"
    "hijau"  : "#00FF00"
    _        : "#000000"
}

// Penjaga
suhu = -5
keadaan = ?? suhu {
    _? suhu < 0  : "beku"
    _? suhu < 20 : "sejuk"
    _? suhu < 35 : "suam"
    _            : "panas"
}
>> keadaan ¶    // → beku

// Bentuk penyataan (lengan blok)
?? n {
    0       : { >> "sifar" ¶ }
    _? n < 0: { >> "negatif" ¶ }
    _       : { >> "positif" ¶ }
}
```

---

## Gelung

```zymbol
@ i:0..4  { >> i " " }        // julat inklusif:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // dengan langkah:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // terbalik:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

buah = ["epal", "pisang", "mangga"]
@ b:buah { >> b ¶ }           // untuk setiap tatasusunan

@ c:"helo" { >> c "-" }
>> ¶                          // → h-e-l-o-  (untuk setiap rentetan)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> teruskan
    ? i > 7 { @! }             // @! henti
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Gelung tak terhingga
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Gelung berlabel (henti bersarang)
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

Fungsi mempunyai **skop terpencil** — tidak boleh membaca pemboleh ubah luar. Gunakan parameter keluaran `<~` untuk mengubah pemboleh ubah pemanggil:

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

> Fungsi bernama bukan nilai kelas pertama. Untuk menyerahkan sebagai argumen, balut: `x -> jumlah(x)`.

---

## Lambda dan Penutupan

```zymbol
ganda = x -> x * 2
jumlah = (a, b) -> a + b
>> ganda(5) ¶    // → 10
>> jumlah(3, 7) ¶   // → 10

// Lambda blok
klasifikasi_nilai = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "sifar"
}

// Penutupan — lambda menangkap pemboleh ubah luar
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶    // → 21

// Kilang fungsi
buat_penambah(n) { <~ x -> x + n }
tambah_sepuluh = buat_penambah(10)
>> tambah_sepuluh(5) ¶    // → 15

// Dalam tatasusunan
operasi = [x -> x+1, x -> x*2, x -> x*x]
>> operasi[2](5) ¶    // → 25
```

---

## Tatasusunan

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — akses (berasas 0)
arr[-1]         // 5 — indeks negatif (terakhir)
arr$#           // 5 — panjang (gunakan (arr$#) dalam >>)

arr = arr$+ 6            // tambah → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sisip di indeks 2
arr3 = arr$- 3           // buang kemunculan pertama nilai
arr4 = arr$-- 3          // buang semua kemunculan
arr5 = arr$-[0]          // buang di indeks
arr6 = arr$-[1..3]       // buang julat (akhir eksklusif)

ada = arr$? 3            // #1 — mengandungi
pos = arr$?? 3           // [2] — semua indeks nilai
sl = arr$[0..3]          // [1,2,3] — hirisan (akhir eksklusif)
sl2 = arr$[0:3]          // [1,2,3] — sama, sintaks berasaskan kiraan

naik = arr$^+            // diisih menaik  (primitif sahaja)
turun = arr$^-           // diisih menurun (primitif sahaja)

// Tatasusunan tupel bernama/kedudukan — gunakan $^ dengan lambda pembanding
db = [(nama: "Carla", umur: 28), (nama: "Ana", umur: 25), (nama: "Bob", umur: 30)]
ikut_umur  = db$^ (a, b -> a.umur < b.umur)    // menaik mengikut umur  (<)
ikut_nama  = db$^ (a, b -> a.nama > b.nama)    // menurun mengikut nama (>)
>> ikut_umur[0].nama ¶     // → Ana
>> ikut_nama[0].nama ¶     // → Carla

arr[1] = 99              // kemas kini di tempat
arr = arr[1]$~ 99        // kemas kini berfungsi — mengembalikan tatasusunan baru
```

> Semua pengendali koleksi mengembalikan **tatasusunan baru**. Tugaskan semula: `arr = arr$+ 4`.
> Pengendali tidak boleh dirantai — gunakan tugasan perantara.
> `$^+` / `$^-` mengisih **tatasusunan primitif** (nombor, rentetan). Untuk tatasusunan tupel gunakan `$^` dengan lambda pembanding — arah dikodkan dalam lambda (`<` = menaik, `>` = menurun).

```zymbol
// Tatasusunan bersarang
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[1][2] ¶    // → 6
```

---

## Pemecahan Struktur

```zymbol
// Tatasusunan
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pertama, *baki] = arr        // pertama=10  baki=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ diabaikan

// Tuple kedudukan
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tuple bernama
orang = (nama: "Ana", umur: 25, bandar: "Kuala Lumpur")
(nama: n, umur: u) = orang   // n="Ana"  u=25
```

---

## Tupel

```zymbol
// Kedudukan
titik = (10, 20)
>> titik[0] ¶    // → 10

// Bernama
orang = (nama: "Alisa", umur: 25)
>> orang.nama ¶    // → Alisa
>> orang[0] ¶      // → Alisa  (indeks juga berfungsi)

// Bersarang
pos = (x: 10, y: 20)
p = (pos: pos, label: "asal")
>> p.pos.x ¶        // → 10
```

---

## Fungsi Tertib Tinggi

> Operator HOF memerlukan **lambda sebaris** — pemboleh ubah lambda terus tidak boleh digunakan.

```zymbol
nombor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

gandaan          = nombor$> (x -> x * 2)                // map  → [2,4,6…20]
genap            = nombor$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
jumlah_keseluruhan = nombor$< (0, (terkumpul, x) -> terkumpul + x)  // reduce → 55

// Berantai melalui perantara
langkah1 = nombor$| (x -> x > 3)
langkah2 = langkah1$> (x -> x * x)
>> langkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi bernama dalam HOF — balut dalam lambda
gandakan(x) { <~ x * 2 }
r = nombor$> (x -> gandakan(x))    // ✅
```

---

## Pengendali Paip

Bahagian kanan sentiasa memerlukan `_` sebagai pemegang tempat:

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
tambah_satu = x -> x + 1

5 |> dua_kali(_)         // → 10
10 |> tambah(_, 5)       // → 15
5 |> tambah(2, _)        // → 7

// Berantai
hasil = 5 |> dua_kali(_) |> tambah_satu(_) |> dua_kali(_)
>> hasil ¶    // → 22  (5→10→11→22)
```

---

## Pengendalian Ralat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Bahagi dengan sifar" ¶
} :! {
    >> "ralat lain: " _err ¶    // _err menyimpan mesej ralat
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
// lib/kiraan.zy
# kiraan

#> { tambah, get_PI }    // eksport SEBELUM takrifan

_PI := 3.14159
tambah(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — akses pemalar terus melalui alias tidak disokong
```

```zymbol
// utama.zy
<# ./lib/kiraan <= k    // alias wajib

>> k::tambah(5, 3) ¶   // → 8
pi = k::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Eksport dengan nama awam berbeza
# mylib
#> { _tambah_dalaman <= jumlah }

_tambah_dalaman(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::jumlah(3, 4) ¶    // → 7  (nama dalaman _tambah_dalaman tersembunyi)
```

---

## Pengendali Data

```zymbol
// Parsing rentetan ke nombor
v1 = #|"42"|      // → 42
v2 = #|"3.14"|    // → 3.14
v3 = #|"abc"|     // → "abc"

// Pembundaran / pemotongan
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Format nombor
fmt = #,|1234567|       // → 1,234,567
sains = #^|12345.678|   // → 1.2345678e4

// Literal asas
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Penukaran asas
heks = 0x|255|    // → "0x00FF"
perduaan = 0b|65| // → "0b1000001"
oktal = 0o|8|     // → "0o10"
perpuluhan = 0d|255| // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tarikh = <\ date +%Y-%m-%d \>     // tangkap stdout
>> "Hari ini: " tarikh

fail = "data.txt"
kandungan = <\ cat {fail} \>      // interpolasi dalam perintah

output = </"./subscript.zy"/>     // jalankan skrip Zymbol
>> output
```

> `><` menangkap argumen CLI sebagai array rentetan (tree-walker sahaja).

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

| Simbol    | Operasi                   | Simbol     | Operasi                       |
|-----------|---------------------------|------------|-------------------------------|
| `=`       | pemboleh ubah             | `$#`       | panjang                       |
| `:=`      | pemalar                   | `$+`       | tambah                        |
| `>>`      | keluaran                  | `$+[i]`    | sisip di indeks               |
| `<<`      | masukan                   | `$-`       | buang pertama mengikut nilai  |
| `¶` / `\\` | baris baru               | `$--`      | buang semua mengikut nilai    |
| `?`       | syarat (if)               | `$-[i]`    | buang di indeks               |
| `_?`      | jika tidak (else-if)      | `$-[i..j]` | buang julat                   |
| `_`       | selainnya / kad liar      | `$?`       | mengandungi                   |
| `??`      | padankan (match)          | `$??`      | cari semua indeks             |
| `@`       | gelung                    | `$[s..e]`  | hirisan                       |
| `@!`      | henti (break)             | `$>`       | peta (map)                    |
| `@>`      | teruskan (continue)       | `$\|`      | tapis (filter)                |
| `->`      | lambda                    | `$<`       | kurangkan (reduce)            |
| `$^+`     | isih menaik (primitif)    | `$^-`      | isih menurun (primitif)       |
| `$^`      | isih dengan pembanding (tupel) | |                          |
| `<~`      | pulang (return)           | `!?`       | cuba (try)                    |
| `\|>`     | paip (pipe)               | `:!`       | tangkap (catch)               |
| `#1`      | benar                     | `:>`       | sentiasa (finally)            |
| `#0`      | palsu                     | `$!`       | adakah ralat                  |
| `<#`      | import                    | `$!!`      | sebarkan ralat                |
| `#`       | takrifkan modul           | `#>`       | eksport                       |
| `::`      | panggilan modul           | `.`        | akses medan                   |
| `#\|..\|` | parsing nombor            | `#?`       | metadata jenis                |
| `#.N\|..\|` | bundarkan              | `#!N\|..\|` | potong                     |
| `c\|..\|` | format koma              | `e\|..\|`  | format saintifik              |
| `<\ ..\>` | pelaksanaan shell        | `>\<`      | argumen CLI                   |

---

*Zymbol-Lang — Simbolik. Universal. Tidak Berubah.*

> **Amaran:** Dokumentasi ini dicipta dan diterjemahkan oleh kecerdasan buatan (AI).
> Semua usaha telah dilakukan untuk memastikan ketepatan, tetapi beberapa terjemahan atau contoh mungkin mengandungi kesilapan.
> Rujukan kanonik ialah [spesifikasi Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
