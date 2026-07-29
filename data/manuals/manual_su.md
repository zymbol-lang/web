> **Bantahan:** Dokumén iki dijieun jeung ditarjamahkeun ku intelijen jieunan (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Rujukan kanonis nyaéta **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dina gudang interpreter.

---

# Manual Zymbol-Lang

> **Diarévisi pikeun v0.0.5 — 2026-05-16**

**Zymbol-Lang** nyaéta basa program simbolis. Taya kecap konci — sagalana simbol. Gawéna idéntik dina sagala basa manusa.

- Taya `if`, `while`, `return` — ngan `?`, `@`, `<~`
- Unicode lengkep — identifier dina sagala basa atawa emoji
- Netral kana basa manusa — kodena sarua di mana waé

**Vérsi interpreter**: v0.0.5 | **Panutupan tés**: 436/436 (paritas TW ↔ VM)

---

## Variahel jeung Konstanta

```zymbol
x = 10              // variahel anu bisa robah
π := 3.14159        // konstanta — tugas deui mangrupa kasalahan waktu ngajalankeun
ngaran = "Alice"
aktif = #1         // boolean leres
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

`°` (tanda darajat, U+00B0) ngamimitian variahel sacara otomatis kana nilai nétralna dina pamakéan kahiji:

```zymbol
angka = [3, 1, 4, 1, 5]
@ n:angka {
    °total += n    // ngamimitian otomatis ka 0 luhureun loop; salamet sanggeus @
}
>> total ¶         // → 14
```

> `°x` (awalan) jangkar luhureun loop — hasilna bisa diaksés sanggeus `@`.
> `x°` (ahiran) jangkar jero loop — paéh nalika loop réngsé.
> Ngan tree-walker.

---

## Jenis Data

| Jenis | Literal | Tag `#?` | Catetan |
|------|---------|----------|---------|
| Integer | `42`, `-7` | `###` | 64-bit tanda |
| Ngambang | `3.14`, `1.5e10` | `##.` | Notasi ilmiah diidinan |
| String | `"téks"` | `##"` | Interpolasi: `"Halo {ngaran}"` |
| Karakter | `'A'` | `##'` | Hiji karakter Unicode |
| Boolean | `#1`, `#0` | `##?` | Sanés numerik — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Unsur homogén |
| Tuple | `(a, b)` | `##)` | Posisional |
| Tuple ngaran | `(x: 1, y: 2)` | `##)` | Kolom ngaran |
| Fungsi | rujukan fungsi ngaran | `##()` | Kelas kahiji; nuduhkeun `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas kahiji; nuduhkeun `<lambd/N>` |

```zymbol
// Introspeksi jenis — balikkeun (jenis, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Kaluaran jeung Asupan

```zymbol
>> "Halo" ¶                       // ¶ atawa \\ pikeun garis anyar jelas
>> "a=" a " b=" b ¶               // juxtaposition — sababaraha nilai
>> (arr$#) ¶                      // operator ahiran merlukeun ( ) dina >>

>> ngaran                           // maca kana variahel (tanpa pamundut)
>> "Lebetkeun ngaran: " ngaran            // kalayan pamundut
```

> `¶` (AltGr+R dina kibor Spanyol) jeung `\\` nyaéta garis anyar sarua.

---

## Primitif TUI

Operator panganteur pamaké terminal pikeun program interaktif. Kalolobaan merlukeun blok `>>| { }` (layar alternatif + mode atah).

```zymbol
>>| {
    >>!                             // meresihan layar alternatif
    >>~ (1, 1, 0, 10) > "Jalankeun"   // baris 1, kolom 1, fg=10 (héjo)
    @~ 1000                         // eureun 1 detik (1000 ms)
    >>~ (2, 1) > "Réngsé."
}
// terminal dibalikkeun sacara otomatis nalika kaluar
```

```zymbol
// Pencét kenop jeung ukuran terminal
>>| {
    [baris, kolom] = >>?              // tanya ukuran terminal
    >>~ (1, 1) > "Terminal: " baris " x " kolom
    <<| kenop                         // maca pencét kenop anu ngahalangan
    >>~ (2, 1) > "Anjeun mencét: " kenop
}
```

> `>>!` meresihan layar. `>>?` balikkeun `[baris, kolom]`. `@~ N` saré N milidetik.
> `<<|` maca hiji pencét kenop (ngahalangan); `<<|?` polling tanpa ngahalangan (balikkeun `'\0'` lamun euweuh).
> Tuple kaluaran posisional: `(baris, kolom, BKS, fg, bg)` — sagala slot bisa dileupaskeun ku koma (`>>~ (,,, 196) > "beureum"`).
> BKS bitmask: `1`=kandel, `2`=déngdék, `4`=garis handap. Palet warna ANSI 256 (`0`=standar terminal).
> Ngan tree-walker (iwal `>>!`, `>>?`, `@~`, `>>~` anu ogé jalan dina `--vm`).

---

## Operator

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pembagian integer)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (éksponénsiasi)

// Babandingan — tugaskeun pikeun mariksa
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
// Dua wangun konkatenasi
ngaran = "Alice"
n = 42

>> "Halo " ngaran " anjeun gaduh " n ¶       // juxtaposition — dina >>
pedaran = "Halo {ngaran}, anjeun gaduh {n}"     // interpolasi — di mana waé
```

```zymbol
s = "Halo dunya"
panjang = s$#                  // 10
bagéan = s$[1..5]             // "Halo "  (1-basis, tungtung kaasup)
aya = s$? "dunya"          // #1
pecahan = "a,b,c,d"$/ ','   // [a, b, c, d]  (pisah ku pamisah)
ganti = s$~~["l":"r"]        // "Haro dunya"
ganti1 = s$~~["l":"r":1]     // "Haro dunya"  (ngan N kahiji)
garis = "─" $* 20           // "────────────────────"  (ulang N kali)
```

> `+` ngan pikeun angka. Pikeun string, paké `,`, juxtaposition, atawa interpolasi.

---

## Kontrol Aliran

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "gedé" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "nol" ¶
} _ {
    >> "négatif" ¶
}
```

> Kurung kurawal `{ }` **wajib** sanajan ngan hiji pernyataan.

---

## Pencocokan

```zymbol
// Rentang
skor = 85
peunteun = ?? skor {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> peunteun ¶    // → B

// String
warna = "beureum"
kode = ?? warna {
    "beureum"   => "#FF0000"
    "héjo" => "#00FF00"
    _       => "#000000"
}

// Pola babandingan
suhu = -5
kaayaan = ?? suhu {
    < 0  => "és"
    < 20 => "tiis"
    < 35 => "héngkér"
    _    => "panas"
}
>> kaayaan ¶    // → és

// Wangun pernyataan (panangan blok)
n = -3
?? n {
    0    => { >> "nol" ¶ }
    < 0  => { >> "négatif" ¶ }
    _    => { >> "positif" ¶ }
}
```

---

## Loop

```zymbol
@ i:0..4  { >> i " " }        // rentang kaasup:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kalayan léngkah:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tibalik:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

bubuahan = ["apel", "pir", "anggur"]
@ b:bubuahan { >> b ¶ }         // pikeun unggal unsur dina array

@ k:"halo" { >> k "-" }
>> ¶                          // → h-a-l-o-  (pikeun unggal karakter dina string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> teruskeun
    ? i > 7 { @! }             // @! pegat
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop taya wates
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop anu dilabélan (pegat sawar)
itung = 0
@:luar {
    itung++
    ? itung >= 3 { @:luar! }
}
>> itung ¶                    // → 3
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

Fungsi boga **wengkuan terasing** — teu bisa maca variahel luar. Paké paraméter kaluaran `<~>` pikeun ngarobah variahel panelepon:

```zymbol
ganti(a<~, b<~) {
    samentara = a
    a = b
    b = samentara
}
x = 10
y = 20
ganti(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fungsi anu dingaranan nyaéta **nilai kelas kahiji** — langsung pasihan: `angka$> dua kali`. Pikeun ngabungkus: `x -> fn(x)` ogé sah.

---

## Lambda jeung Panutupan

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
>> dua_kali(5) ¶    // → 10
>> tambah(3, 7) ¶  // → 10

// Lambda blok
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "négatif" }
    <~ "nol"
}

// Panutupan — néwak wengkuan luar
faktor = 3
tilu_kali = x -> x * faktor
>> tilu_kali(7) ¶    // → 21

// Pabrik
nyieun_tambah(n) { <~ x -> x + n }
tambah_sapuluh = nyieun_tambah(10)
>> tambah_sapuluh(5) ¶    // → 15

// Dina array
operator = [x -> x+1, x -> x*2, x -> x*x]
>> operator[3](5) ¶    // → 25
```

---

## Array

Array **bisa robah** jeung ngandung unsur **tina jenis anu sarua**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — aksés (1-basis: unsur kahiji)
x = arr[-1]     // 5 — indéks négatif (unsur pamungkas)
x = arr$#       // 5 — panjang (paké (arr$#) dina >>)

arr = arr$+ 6            // tambahkeun → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // selapkeun dina posisi 2 (1-basis)
arr3 = arr$- 3           // pupus kajadian kahiji tina nilai
arr4 = arr$-- 3          // pupus kabéh kajadian
arr5 = arr$-[1]          // pupus dina indéks 1 (unsur kahiji)
arr6 = arr$-[2..3]       // pupus rentang (1-basis, tungtung kaasup)

aya = arr$? 3            // #1 — ngandung
lokasi = arr$?? 3           // [3] — kabéh indéks tina nilai (1-basis)
iris = arr$[1..3]          // [1,2,3] — iris (1-basis, tungtung kaasup)
iris2 = arr$[1:3]          // [1,2,3] — sarua, sintaksis basis cacah

naék = arr$^+             // asihan naék (ngan primitif)
turun = arr$^-            // asihan turun (ngan primitif)

// Array tuple ngaran/posisional — paké $^ jeung lambda pembanding
database = [(ngaran: "Carla", umur: 28), (ngaran: "Ana", umur: 25), (ngaran: "Bob", umur: 30)]
numutkeun_umur  = database$^ (a, b -> a.umur < b.umur)    // numutkeun umur naék (<)
numutkeun_ngaran = database$^ (a, b -> a.ngaran > b.ngaran)   // numutkeun ngaran turun (>)
>> numutkeun_umur[1].ngaran ¶     // → Ana
>> numutkeun_ngaran[1].ngaran ¶    // → Carla

// Ngamutahirkeun unsur langsung (ngan array)
arr[1] = 99              // tugaskeun
arr[2] += 5              // majemuk: +=  -=  *=  /=  %=  ^=

// Ngamutahirkeun fungsional — balikkeun array anyar; aslina teu robah
arr2 = arr[2]$~ 99
```

> Kabéh operator koléksi balikkeun **array anyar**. Tugaskeun deui: `arr = arr$+ 4`.
> `$+` bisa dirantai: `arr = arr$+ 5$+ 6$+ 7`. Operator séjén maké tugas perantara.
> **Indéksasi 1-basis**: `arr[1]` nyaéta unsur kahiji; `arr[0]` nyaéta kasalahan waktu ngajalankeun.
> `$^+` / `$^-` nyortir **array primitif** (angka, string). Pikeun array tuple, paké `$^` jeung lambda pembanding — arahna dikode dina lambda (`<` = naék, `>` = turun).

**Semantik nilai** — méré array ka variahel séjén nyiptakeun salinan mandiri:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b teu kapangaruhan
```

```zymbol
// Array sawar (indéksasi 1-basis)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (baris 2, kolom 3)
```

---

## Destrukturisasi

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[kahiji, *sésana] = arr         // kahiji=10  sésana=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ dipiceun

// Tuple posisional
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tuple ngaran
jalma = (ngaran: "Ana", umur: 25, kota: "Madrid")
(ngaran: n, umur: u) = jalma   // n="Ana"  u=25
```

---

## Tuple

Tuple nyaéta wadah anu diurutkeun **teu bisa robah** anu bisa nyimpen nilai **tina jenis anu béda**.
Béda jeung array, unsur teu bisa dirobah sanggeus dijieun.

```zymbol
// Posisional — jenis campuran diidinan
titik = (10, 20)
>> titik[1] ¶    // → 10

data = (42, "Halo", #1, 3.14)
>> data[3] ¶     // → #1

// Ngaran
jalma = (ngaran: "Alice", umur: 25)
>> jalma.ngaran ¶    // → Alice
>> jalma[1] ¶      // → Alice  (indéks ogé jalan, 1-basis)

// Sawar
posisi = (x: 10, y: 20)
p = (posisi: posisi, labél: "asal")
>> p.posisi.x ¶        // → 10
```

**Teu bisa robah** — sagala usaha pikeun ngarobah unsur tuple mangrupa kasalahan waktu ngajalankeun:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kasalahan waktu ngajalankeun: tuple teu bisa robah
// t[1] += 5    // ❌ kasalahan sarua
```

Pikeun ménta nilai anu dirobah, paké `$~` (ngamutahirkeun fungsional) — balikkeun **tuple anyar**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← aslina teu robah
>> t2 ¶    // → (10, 999, 30)

// Tuple ngaran — bangun deui sacara eksplisit
jalma = (ngaran: "Alice", umur: 25)
leuwih_tua  = (ngaran: jalma.ngaran, umur: 26)
>> jalma.umur ¶    // → 25
>> leuwih_tua.umur ¶     // → 26
```

---

## Fungsi Tingkat Luhur

```zymbol
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dua_kali  = angka$> (x -> x * 2)                  // map  → [2,4,6…20]
genap    = angka$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = angka$< (0, (akumulator, x) -> akumulator + x)     // reduce → 55

// Rantai ngaliwatan perantara
léngkah1 = angka$| (x -> x > 3)
léngkah2 = léngkah1$> (x -> x * x)
>> léngkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi ngaran bisa langsung dibikeun ka HOF
dua_kali(x) { <~ x * 2 }
gedé(x) { <~ x > 5 }
r = angka$> dua_kali       // ✅ rujukan langsung
r = angka$| gedé       // ✅ rujukan langsung
```

---

## Operator Pipa

Sisi katuhu salawasna merlukeun `_` salaku pananda tempat pikeun nilai anu dialirkeun:

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
tambah_hiji = x -> x + 1

r1 = 5 |> dua_kali(_)        // → 10
r2 = 10 |> tambah(_, 5)       // → 15
r3 = 5 |> tambah(2, _)        // → 7

// Rantai
r = 5 |> dua_kali(_) |> tambah_hiji(_) |> dua_kali(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Penanganan Kasalahan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dibagi ku nol" ¶
} :! {
    >> "lianna: " _err ¶    // _err nyimpen pesen kasalahan
} :> {
    >> "salawasna jalan" ¶
}
```

| Jenis | Iraha |
|------|------|
| `##Div` | Dibagi ku nol |
| `##IO` | Berkas / sistem |
| `##Index` | Indéks luar wates |
| `##Type` | Jenis teu cocog |
| `##Parse` | Parsing data |
| `##Network` | Kasalahan jaringan |
| `##_` | Sakur kasalahan (nyekel-sadayana) |

---

## Modul

```zymbol
// lib/calc.zy — badan modul ditutup dina kurung kurawal
# calc {
    #> { tambah, get_PI }

    _π := 3.14159
    tambah(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // landihan diperlukeun

>> c::tambah(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Ékspor kalayan ngaran publik anu béda
# mylib {
    #> { _tambah_internal => jumlah }

    _tambah_internal(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::jumlah(3, 4) ¶    // → 7  (ngaran internal _tambah_internal disumputkeun)
```

> **Aturan modul**: dina `# ngaran { }`, ngan `#>`, definisi fungsi, jeung inisialisasi literal variahel/konstanta anu diidinan. Pernyataan anu bisa dieksekusi (`>>`, `<<`, loop, jsb.) ngabalukarkeun kasalahan E013.

---

## Mode Numerik

Zymbol bisa némbongkeun angka dina **69 aksara digit Unicode** — Devanagari, Arab-India, Thailand, Klingon pIqaD, Mathematical Bold, bagéan LCD, jeung sajabana. Mode aktip ngan mangaruhan kaluaran `>>`; aritmetika internal salawasna binér.

### Ngaktipkeun aksara

Tulis digit `0` jeung `9` tina aksara target dina `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-India (U+0660–U+0669)
#๐๙#    // Thailand     (U+0E50–U+0E59)
#09#    // reset ka ASCII
```

### Kaluaran jeung boolean

```zymbol
x = 42
>> x ¶          // → 42   (standar ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (titik desimal salawasna ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: awalan # salawasna ASCII, digit adaptasi
>> #1 ¶         // → #१   (leres dina Devanagari)
>> #0 ¶         // → #०   (salah — béda jeung ० integer nol)

x = 28 > 4
>> x ¶          // → #१   (hasil babandingan nuturkeun mode aktip)
```

### Literal digit asli dina sumber

Digit tina sakur aksara anu dirojong nyaéta literal sah — dina rentang, modulo, babandingan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal Boolean dina sakur aksara

`#` + digit `0` atawa `1` tina sakur blok nyaéta literal Boolean sah:

```zymbol
#०९#
aktif = #१        // sarua jeung #1
>> aktif ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **salawasna ASCII**. `#0` (salah) salawasna visual béda jeung `0` (integer nol) dina unggal aksara.

---

## Operator Data

```zymbol
// Konvérsi jenis
f = ##.42         // → 42.0  (ka ngambang)
i = ###3.7        // → 4     (ka integer, buleudkeun)
t = ##!3.7        // → 3     (ka integer, potong)

// Parse string jadi angka
v1 = #|"42"|      // → 42  (integer)
v2 = #|"3.14"|    // → 3.14  (ngambang)
v3 = #|"abc"|     // → "abc"  (aman, euweuh kasalahan)

// Buleudkeun / Potong
π = 3.14159265
buleudkeun2 = #.2|π|      // → 3.14  (buleudkeun ka 2 tempat desimal)
buleudkeun4 = #.4|π|      // → 3.1416
potong2 = #!2|π|      // → 3.14  (potong)

// Format angka
format = #,|1234567|  // → 1,234,567  (dipisah ku koma)
ilmiah = #^|12345.678|    // → 1.2345678e4  (ilmiah)

// Literal dasar
a = 0x41         // → 'A'  (héks)
b = 0b01000001   // → 'A'  (binér)
c = 0o101        // → 'A'  (oktal)

// Kaluaran konvérsi dasar
héks = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
okt = 0o|8|      // → "0o10"
desimal = 0d|255|    // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tanggal = <\ date +%Y-%m-%d \>     // néwak stdout (kaasup \n dina tungtung)
>> "Dinten ieu: " tanggal

berkas = "data.txt"
eusi = <\ cat {berkas} \>      // interpolasi dina paréntah

kaluaran = </"./subscript.zy"/>   // jalankeun skrip Zymbol séjén, néwak kaluaran
>> kaluaran
```

> `><` néwak argumen CLI salaku array string (ngan tree-walker).

---

## Conto Lengkep: FizzBuzz

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

## Rujukan Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|-----------|--------|-----------|
| `=` | variahel | `$#` | panjang |
| `:=` | konstanta | `$+` | tambahkeun (bisa dirantai) |
| `>>` | kaluaran | `$+[i]` | selapkeun dina indéks (1-basis) |
| `<<` | asupan | `$-` | pupus kahiji dumasar nilai |
| `¶` / `\\` | garis anyar | `$--` | pupus kabéh dumasar nilai |
| `?` | lamun | `$-[i]` | pupus dina indéks (1-basis) |
| `_?` | lamun heunteu-lamun | `$-[i..j]` | pupus rentang (1-basis) |
| `_` | heunteu / wildcard | `$?` | ngandung |
| `??` | cocok | `$??` | panggihan kabéh indéks (1-basis) |
| `@` | loop | `$[s..e]` | iris (1-basis) |
| `@ N { }` | loop N kali | `$>` | map |
| `@!` | pegat | `$\|` | filter |
| `@>` | teruskeun | `$<` | reduce |
| `@:ngaran { }` | loop labél | `$/ pamisah` | pisahkeun string |
| `@:ngaran!` | pegat labél | `$++ a b c` | bangunan konkatenasi |
| `@:ngaran>` | teruskeun labél | `arr[i>j>k]` | indéks navigasi |
| `->` | lambda | `arr[i] = nilai` | ngamutahirkeun unsur (ngan array) |
| `arr[i] += nilai` | ngamutahirkeun majemuk | `arr[i]$~` | ngamutahirkeun fungsional (salinan anyar) |
| `$^+` | asihan naék (primitif) | `$^-` | asihan turun (primitif) |
| `$^` | asihan jeung pembanding (tuple) | `<~` | balikkeun |
| `\|>` | pipa | `!?` | cobaan |
| `:!` | nyekel | `:>` | tungtungna |
| `#1` | leres | `#0` | salah |
| `$!` | naha kasalahan | `$!!` | nyebarkeun kasalahan |
| `<#` | impor | `#>` | ékspor |
| `#` | deklarasi modul | `::` | nelepon modul |
| `.` | aksés kolom | `#?` | metadata jenis |
| `#\|..\|` | parse angka | `##.` | konvérsi ka ngambang |
| `###` | konvérsi ka integer (buleudkeun) | `##!` | konvérsi ka integer (potong) |
| `#.N\|..\|` | buleudkeun | `#!N\|..\|` | potong |
| `#,\|..\|` | format koma | `#^\|..\|` | ilmiah |
| `#d0d9#` | genti mode numerik | `#09#` | reset ka ASCII |
| `<\ ..\>` | jalankeun shell | `>\<` | argumen CLI |
| `\ variahel` | ancurkeun variahel sacara eksplisit | `°x` / `x°` | definisi panas (ngamimitian otomatis) |
| `>>|` | blok TUI (layar alternatif) | `>>~` | kaluaran posisional |
| `>>!` | meresihan layar | `>>?` | tanya ukuran terminal |
| `<<\|` | pencét kenop ngahalangan | `<<\|?` | polling pencét kenop teu ngahalangan |
| `@~ N` | saré N milidetik | `$*` | ulang string N kali |

---

## Log Parobahan Rilis

### v0.0.5 — Primitif TUI, Definisi Panas & Pengulangan String _(Méi 2026)_

- **Megatkeun** Pemisah panangan pencocokan: `pola : hasil` → `pola => hasil`
- **Megatkeun** Landihan impor: `<# jalur <= landihan` → `<# jalur => landihan`
- **Megatkeun** Ganti ngaran ékspor: `#> { fn <= publik }` → `#> { fn => publik }`
- **Ditambahkeun** Blok TUI `>>| { }` — layar alternatif + mode atah; meresihan nalika kaluar
- **Ditambahkeun** Kaluaran posisional `>>~ (baris, kolom, BKS, fg, bg) > item` — slot jarang, warna ANSI 256
- **Ditambahkeun** Asupan kenop `<<| variahel` (ngahalangan) jeung `<<|? variahel` (polling teu ngahalangan)
- **Ditambahkeun** `>>!` meresihan layar, `>>?` tanya ukuran terminal, `@~ N` saré N milidetik
- **Ditambahkeun** Definisi panas `°x` / `x°` — ngamimitian variahel otomatis dina pamakéan kahiji dina loop
- **Ditambahkeun** Pengulangan string `string $* N` — ulang string N kali
- **VM** Paritas: 436/436 tés lulus

### v0.0.4 — Indéksasi 1-basis, Fungsi Kelas Kahiji & Modul Blok _(April 2026)_

- **Megatkeun** Kabéh indéksasi robah jadi **1-basis** — `arr[1]` nyaéta unsur kahiji; `arr[0]` nyaéta kasalahan waktu ngajalankeun
- **Ditambahkeun** Fungsi ngaran nyaéta **nilai kelas kahiji** — langsung pasihan ka HOF: `angka$> dua_kali`
- **Ditambahkeun** **Sintaksis blok wajib** pikeun modul: `# ngaran { ... }` — sintaksis datar dipupus
- **Ditambahkeun** Indéksasi multi-dimensi: `arr[i>j>k]` (navigasi), `arr[p ; q]` (ékstraksi datar)
- **Ditambahkeun** Konvérsi jenis: `##.éksprési` (ngambang), `###éksprési` (integer buleudkeun), `##!éksprési` (integer potong)
- **Ditambahkeun** Pisah string: `string$/ pamisah` — balikkeun `Array(string)`
- **Ditambahkeun** Bangunan konkatenasi: `dasar$++ a b c` — tambahkeun sababaraha item
- **Ditambahkeun** Loop kali: `@ N { }` — ulang persis N kali
- **Ditambahkeun** Sintaksis loop labél: `@:ngaran { }`, `@:ngaran!`, `@:ngaran>` — ngaganti `@ @ngaran` / `@! ngaran`
- **Ditambahkeun** Aturan wengkuan variahel: variahel `_ngaran` boga wengkuan blok anu tepat; `\ variahel` ancurkeun awal
- **Ditambahkeun** Pola babandingan pencocokan: `< 0 =>`, `> 5 =>`, `== 42 =>`, jsb.
- **Ditambahkeun** Kasalahan modul E013: pernyataan anu bisa dieksekusi dina badan modul dilarang
- **Dibereskeun** `alias.CONST` ayeuna ngabéréskeun leres; `#>` bisa muncul sanggeus definisi fungsi
- **VM** Paritas lengkep: 393/393 tés lulus

### v0.0.3 — Sistem Numerik Unicode & Peningkatan LSP _(April 2026)_

- **Ditambahkeun** 69 blok digit Unicode kalayan token genti mode `#d0d9#`
- **Ditambahkeun** Literal Boolean dina sakur aksara — `#१` / `#०`, `#१` / `#०`, jsb.
- **Ditambahkeun** Digit Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ditambahkeun** Opkode VM `SetNumeralMode` — paritas lengkep jeung tree-walker
- **Dirobah** Kaluaran Boolean `>>` ayeuna kaasup awalan `#` (`#0` / `#1`) dina kabéh mode

### v0.0.2_01 — Ganti Ngaran Operator _(30 Maret 2026)_

- **Dirobah** `c|..|` → `#,|..|` jeung `e|..|` → `#^|..|` — konsisten jeung kulawarga awalan `#`
- **Ditambahkeun** Landihan ékspor: ékspor deui anggota modul kalayan ngaran anu béda

### v0.0.2 — Desain Ulang API Koléksi & Instalér _(24 Maret 2026)_

- **Ditambahkeun** Kulawarga operator `$` terpadu pikeun array jeung string (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ditambahkeun** Tugas destrukturisasi pikeun array, tuple, jeung tuple ngaran
- **Ditambahkeun** Indéks négatif (`arr[-1]` = unsur pamungkas)
- **Ditambahkeun** Instalér asli — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maret 2026)_

- **Ditambahkeun** Tugas majemuk `^=`
- **Dibereskeun** Kasus tepi aritmetika parser; koréksi dokuméntasi

### v0.0.1 — Rilis Publik Perdana _(22 Maret 2026)_

- Interpreter tree-walker + VM register (`--vm`, ~4× leuwih gancang, ~95% paritas)
- Kabéh konstruksi inti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identifier Unicode lengkep, sistem modul, lambda, panutupan, penanganan kasalahan
- REPL, LSP, éksténsi VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Simbolis. Universal. Teu bisa dirobah._
