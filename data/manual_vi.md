# Hướng Dẫn Nhỏ Gọn Zymbol-Lang

**Zymbol-Lang** là một ngôn ngữ lập trình biểu tượng. Nó không sử dụng từ khóa — tất cả đều là ký hiệu. Hoạt động theo cùng một cách trong bất kỳ ngôn ngữ con người nào.

- Không có từ khóa (`if`, `while`, `return` không tồn tại — chỉ có ký hiệu `?`, `@`, `<~`)
- Unicode đầy đủ — định danh trong bất kỳ ngôn ngữ hay emoji nào 👋
- Bất khả tri ngôn ngữ — mã nguồn giống hệt nhau trong mọi ngôn ngữ

---

## Biến và Hằng

```zymbol
x = 10              // biến (có thể thay đổi)
PI := 3.14159       // hằng số (bất biến — lỗi nếu gán lại)
tên = "An"
hoạtĐộng = #1       // boolean đúng
👋 := "Xin chào"
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

## Kiểu Dữ Liệu

| Kiểu           | Ví dụ               | Ký hiệu `#?` | Ghi chú                              |
|----------------|---------------------|--------------|--------------------------------------|
| Số nguyên      | `42`, `-7`          | `###`        | 64 bit có dấu                        |
| Số thực        | `3.14`, `1.5e10`    | `##.`        | Ký hiệu khoa học được hỗ trợ         |
| Chuỗi          | `"xin chào"`        | `##"`        | Nội suy: `"Xin chào {tên}"`          |
| Ký tự          | `'A'`               | `##'`        | Một ký tự Unicode                    |
| Boolean        | `#1`, `#0`          | `##?`        | KHÔNG phải số 1 và 0                 |
| Mảng           | `[1, 2, 3]`         | `##]`        | Tất cả phần tử cùng kiểu             |
| Tuple          | `(a, b)`            | `##)`        | Theo vị trí                          |
| Tuple có tên   | `(x: 1, y: 2)`      | `##)`        | Truy cập theo tên hoặc chỉ số        |

```zymbol
// Kiểm tra kiểu dữ liệu — trả về (kiểu, số chữ số, giá trị)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Xuất và Nhập

```zymbol
>> "Xin chào" ¶                  // ¶ hoặc \\ thêm dòng mới tường minh
>> "a=" a " b=" b ¶              // nhiều giá trị bằng cách đặt cạnh nhau
>> (mảng$#) ¶                    // toán tử postfix cần dấu ngoặc đơn

<< tên                           // không có gợi ý — đọc vào biến
<< "Tên của bạn? " tên           // có gợi ý
```

> `¶` hoặc `\\` tương đương nhau như ký tự xuống dòng.

---

## Toán tử

```zymbol
// Số học
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (chia nguyên)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (lũy thừa)

// So sánh
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Lôgic
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Chuỗi ký tự

```zymbol
// Ba cách nối chuỗi
tên = "An"
n = 25

lời = "Xin chào ", tên, "!"               // dấu phẩy — trong phép gán
>> "Xin chào " tên " có " n " tuổi" ¶    // đặt cạnh nhau — trong xuất >>
mô_tả = "Xin chào {tên}, có {n} tuổi"   // nội suy — trong bất kỳ ngữ cảnh nào
```

```zymbol
s = "Xin chào thế giới"
dài = s$#                  // độ dài
phụ = s$[0..8]             // "Xin chào"  (không gồm cuối)
có = s$? "thế giới"        // #1
phần = "a,b,c,d" / ','     // [a, b, c, d]
thay = s$~~["chào":"bạn"]   // thay thế
thay1 = s$~~["chào":"bạn":1] // N đầu tiên
```

> `+` chỉ dùng cho số. Với chuỗi, dùng `,`, ghép hoặc nội suy.

---

## Luồng Điều Khiển

```zymbol
x = 7

? x > 0 { >> "dương" ¶ }

? x > 100 {
    >> "lớn" ¶
} _? x > 0 {
    >> "dương" ¶
} _? x == 0 {
    >> "không" ¶
} _ {
    >> "âm" ¶
}
```

> Các khối `{ }` là **bắt buộc** ngay cả với một dòng lệnh.

---

## Match

```zymbol
// Khoảng giá trị
điểm = 85
xếpLoại = ?? điểm {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> xếpLoại ¶    // → B

// Chuỗi
màu = "đỏ"
mã = ?? màu {
    "đỏ"   : "#FF0000"
    "xanh" : "#00FF00"
    _      : "#000000"
}

// Guard (điều kiện tùy ý)
nhiệt = -5
trạngThái = ?? nhiệt {
    _? nhiệt < 0  : "băng"
    _? nhiệt < 20 : "lạnh"
    _? nhiệt < 35 : "ấm"
    _             : "nóng"
}
>> trạngThái ¶    // → băng

// Dạng lệnh (block arms)
?? n {
    0       : { >> "không" ¶ }
    _? n < 0: { >> "âm" ¶ }
    _       : { >> "dương" ¶ }
}
```

---

## Vòng Lặp

```zymbol
@ i:0..4  { >> i " " }        // khoảng bao gồm hai đầu:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // với bước nhảy:            1 3 5 7 9
@ i:5..0:1 { >> i " " }       // đảo ngược:                5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

trái = ["táo", "lê", "nho"]
@ t:trái { >> t ¶ }           // duyệt từng phần tử mảng

@ c:"xin chào" { >> c "-" }
>> ¶                          // → x-i-n- -c-h-à-o-  (duyệt chuỗi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tiếp tục
    ? i > 7 { @! }             // @! dừng lại
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Vòng lặp vô hạn
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Vòng lặp có nhãn (nested break)
đếm = 0
@ @ngoài {
    đếm++
    ? đếm >= 3 { @! ngoài }
}
>> đếm ¶                    // → 3
```

---

## Hàm

```zymbol
cộng(a, b) { <~ a + b }
>> cộng(3, 4) ¶    // → 7

giai_thừa(n) {
    ? n <= 1 { <~ 1 }
    <~ n * giai_thừa(n - 1)
}
>> giai_thừa(5) ¶    // → 120
```

Hàm có **phạm vi biệt lập** — không đọc biến ngoài. Dùng tham số đầu ra `<~` để thay đổi biến của người gọi:

```zymbol
hoán_đổi(a<~, b<~) {
    tạm = a
    a = b
    b = tạm
}
x = 10
y = 20
hoán_đổi(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Hàm khai báo với tên không phải là giá trị hạng nhất. Để truyền làm đối số, hãy bọc lại: `x -> tên(x)`.

---

## Lambda và Closure

```zymbol
gấpĐôi = x -> x * 2
tổng = (a, b) -> a + b
>> gấpĐôi(5) ¶    // → 10
>> tổng(3, 7) ¶   // → 10

// Lambda với khối
phânLoạiSố = x -> {
    ? x > 0 { <~ "dương" }
    _? x < 0 { <~ "âm" }
    <~ "không"
}

// Closure — bắt biến từ phạm vi ngoài
hệ_số = 3
gấpBa = x -> x * hệ_số
>> gấpBa(7) ¶    // → 21

// Nhà máy hàm
tạo_cộng(n) { <~ x -> x + n }
cộng10 = tạo_cộng(10)
>> cộng10(5) ¶    // → 15

// Lưu trong mảng
phép = [x -> x+1, x -> x*2, x -> x*x]
>> phép[2](5) ¶    // → 25
```

---

## Mảng

Mảng có thể **thay đổi** và chứa các phần tử có **cùng kiểu**.

```zymbol
mảng = [1, 2, 3, 4, 5]

mảng[0]          // 1 — truy cập (bắt đầu từ 0)
mảng[-1]         // 5 — chỉ số âm (cuối cùng)
mảng$#           // 5 — độ dài

mảng = mảng$+ 6            // thêm vào → [1,2,3,4,5,6]
mảng2 = mảng$+[2] 99       // chèn tại chỉ số 2
mảng3 = mảng$- 3           // xóa lần xuất hiện đầu tiên
mảng4 = mảng$-- 3          // xóa tất cả lần xuất hiện
mảng5 = mảng$-[0]          // xóa theo chỉ số
mảng6 = mảng$-[1..3]       // xóa khoảng (không gồm cuối)

có = mảng$? 3            // #1
vị_trí = mảng$?? 3       // [2] — tất cả chỉ số
cắt = mảng$[0..3]        // [1,2,3]
cắt2 = mảng$[0:3]        // [1,2,3] — cú pháp đếm

tăng = mảng$^+           // sắp xếp tăng dần (kiểu nguyên thủy)
giảm = mảng$^-           // sắp xếp giảm dần (kiểu nguyên thủy)

// Named tuple arrays
dữ_liệu = [(tên: "Carla", tuổi: 28), (tên: "Ana", tuổi: 25), (tên: "Bob", tuổi: 30)]
theo_tuổi  = dữ_liệu$^ (a, b -> a.tuổi < b.tuổi)
theo_tên = dữ_liệu$^ (a, b -> a.tên > b.tên)
>> theo_tuổi[0].tên ¶     // → Ana
>> theo_tên[0].tên ¶    // → Carla

// Cập nhật phần tử trực tiếp (chỉ mảng)
mảng[1] = 99              // gán
mảng[0] += 5              // phức hợp: +=  -=  *=  /=  %=  ^=

// Cập nhật kiểu hàm — trả về mảng mới; bản gốc không thay đổi
mảng2 = mảng[1]$~ 99
```

> Tất cả toán tử collection trả về **mảng mới**. Gán lại: `mảng = mảng$+ 4`.
> Không thể xâu chuỗi — dùng gán trung gian.
> `$^+` / `$^-` sắp xếp **mảng nguyên thủy**. Với tuple arrays, dùng `$^` cùng comparator lambda.

**Ngữ nghĩa giá trị** — gán mảng cho biến khác tạo ra một bản sao độc lập:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b không bị ảnh hưởng
```

```zymbol
// Mảng lồng nhau
ma_trận = [[1,2,3],[4,5,6],[7,8,9]]
>> ma_trận[1][2] ¶    // → 6
```

---

## Phân rã cấu trúc

```zymbol
// Mảng
mảng = [10, 20, 30, 40, 50]
[a, b, c] = mảng              // a=10  b=20  c=30
[đầu, *còn] = mảng             // đầu=10  còn=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ bỏ qua

// Positional tuple
điểm = (100, 200)
(px, py) = điểm                // px=100  py=200

// Named tuple
người = (tên: "Ana", tuổi: 25, thành_phố: "Hà Nội")
(tên: t, tuổi: u) = người      // t="Ana"  u=25
```

---

## Tuple

Tuple là các container có thứ tự **bất biến** có thể chứa các giá trị có **kiểu khác nhau**. Không giống mảng, các phần tử không thể thay đổi sau khi tạo.

```zymbol
// Positional
điểm = (10, 20)
>> điểm[0] ¶    // → 10

dữ_liệu = (42, "hello", #1, 3.14)
>> dữ_liệu[2] ¶     // → #1

// Named
người = (tên: "Alice", tuổi: 25)
>> người.tên ¶    // → Alice
>> người[0] ¶     // → Alice  (chỉ số cũng hoạt động)

// Lồng nhau
vị_trí = (x: 10, y: 20)
p = (vị_trí: vị_trí, nhãn: "gốc")
>> p.vị_trí.x ¶        // → 10
```

**Tính bất biến** — bất kỳ nỗ lực nào để sửa đổi phần tử tuple đều là lỗi thời gian chạy:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ lỗi thời gian chạy: tuple là bất biến
// t[0] += 5    // ❌ cùng lỗi
```

Để tạo ra giá trị đã sửa đổi, dùng `$~` (cập nhật kiểu hàm) — trả về một tuple **mới**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← bản gốc không thay đổi
>> t2 ¶    // → (10, 999, 30)

// Tuple có tên — tái tạo tường minh
người = (tên: "Alice", tuổi: 25)
lớnHơn = (tên: người.tên, tuổi: 26)
>> người.tuổi ¶    // → 25
>> lớnHơn.tuổi ¶   // → 26
```

---

## Hàm Bậc Cao

> Các toán tử HOF yêu cầu **lambda inline** — không phải biến lambda trực tiếp.

```zymbol
số = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

gấpĐôi  = số$> (x -> x * 2)                // map  → [2,4,6…20]
chẵn    = số$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
tổng    = số$< (0, (acc, x) -> acc + x)    // reduce → 55

// Xâu chuỗi qua trung gian
bước1 = số$| (x -> x > 3)
bước2 = bước1$> (x -> x * x)
>> bước2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Hàm có tên trong HOF — bọc bằng lambda
gấpĐôi2(x) { <~ x * 2 }
r = số$> (x -> gấpĐôi2(x))    // ✅
```

---

## Toán tử đường ống

RHS luôn cần `_` làm đầu mục chỗ giữ:

```zymbol
nhân_đôi = x -> x * 2
cộng = (a, b) -> a + b
tăng = x -> x + 1

5 |> nhân_đôi(_)      // → 10
10 |> cộng(_, 5)      // → 15
5 |> cộng(2, _)       // → 7

// Chuỗi
kq = 5 |> nhân_đôi(_) |> tăng(_) |> nhân_đôi(_)
>> kq ¶    // → 22  (5→10→11→22)
```

---

## Xử Lý Lỗi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "chia cho không" ¶
} :! {
    >> "lỗi khác: " _err ¶    // _err chứa thông báo lỗi
} :> {
    >> "luôn chạy" ¶
}
```

| Kiểu        | Khi xảy ra                    |
|-------------|-------------------------------|
| `##Div`     | Chia cho không                |
| `##IO`      | Tệp / hệ thống                |
| `##Index`   | Chỉ số ngoài giới hạn         |
| `##Type`    | Lỗi kiểu dữ liệu              |
| `##Parse`   | Lỗi phân tích cú pháp         |
| `##Network` | Lỗi mạng                      |
| `##_`       | Bất kỳ lỗi nào (catch-all)    |

---

## Mô-đun

```zymbol
// Tệp: lib/tính.zy
# tính

#> { cộng, lấy_PI }    // xuất TRƯỚC các định nghĩa

_PI := 3.14159
cộng(a, b) { <~ a + b }
lấy_PI() { <~ _PI }   // getter — không hỗ trợ truy cập hằng trực tiếp qua alias
```

```zymbol
// Tệp: main.zy
<# ./lib/tính <= t    // bí danh bắt buộc

>> t::cộng(5, 3) ¶    // → 8
pi = t::lấy_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Xuất với tên công khai khác
# mylib
#> { _cộng_nội <= tổng }

_cộng_nội(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::tổng(3, 4) ¶    // → 7  (tên nội _cộng_nội bị ẩn)
```

---

## Chế Độ Số

Zymbol có thể hiển thị số trong **69 hệ chữ số Unicode** — Devanagari, Ả Rập-Ấn Độ, Thái, Klingon pIqaD, Toán học In đậm, phân đoạn LCD và nhiều hơn nữa. Chế độ hoạt động chỉ ảnh hưởng đến đầu ra `>>`; phép tính nội bộ luôn là nhị phân.

### Kích hoạt một hệ chữ

Viết chữ số `0` và `9` của hệ chữ đích trong `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Ả Rập-Ấn Độ  (U+0660–U+0669)
#๐๙#    // Thái          (U+0E50–U+0E59)
#09#    // đặt lại về ASCII
```

### Đầu ra và giá trị boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII mặc định)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dấu thập phân luôn là ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: tiền tố # luôn là ASCII, chữ số thích nghi
>> #1 ¶         // → #१   (đúng trong Devanagari)
>> #0 ¶         // → #०   (sai — khác với ०  số nguyên không)

x = 28 > 4
>> x ¶          // → #१   (kết quả so sánh theo chế độ hiện hoạt)
```

### Ký tự số gốc trong mã nguồn

Chữ số từ bất kỳ hệ chữ được hỗ trợ nào đều là ký tự hợp lệ — trong phạm vi, modulo, so sánh:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Ký tự boolean trong bất kỳ hệ chữ nào

`#` + chữ số `0` hoặc `1` từ bất kỳ khối nào là ký tự boolean hợp lệ:

```zymbol
#٠٩#
نشط = #١        // giống như #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **luôn là ASCII**. `#0` (sai) luôn khác biệt về mặt thị giác so với `0` (số nguyên không) trong mỗi hệ chữ.

---

## Toán tử dữ liệu

```zymbol
// Chuyển chuỗi thành số
v1 = #|"42"|      // → 42
v2 = #|"3.14"|    // → 3.14
v3 = #|"abc"|     // → "abc"

// Làm tròn / cắt bớt
pi = 3.14159265
r2 = #.2|pi|      // → 3.14
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14

// Định dạng số
fmt = #,|1234567|       // → 1,234,567
khoa = #^|12345.678|    // → 1.2345678e4

// Hằng số cơ số
a = 0x41         // → 'A'
b = 0b01000001   // → 'A'
c = 0o101        // → 'A'

// Chuyển đổi cơ số
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Tích hợp Shell

```zymbol
ngày = <\ date +%Y-%m-%d \>     // bắt stdout
>> "Hôm nay: " ngày

tệp = "data.txt"
nội_dung = <\ cat {tệp} \>     // nội suy trong lệnh

kết_quả = </"./subscript.zy"/> // chạy Zymbol script
>> kết_quả
```

> `><` bắt tham số CLI dưới dạng mảng chuỗi (chỉ tree-walker).

---

## Ví Dụ Hoàn Chỉnh: FizzBuzz

```zymbol
phânLoại(số) {
    ? số % 15 == 0 { <~ "XìVù" }
    _? số % 3  == 0 { <~ "Xì" }
    _? số % 5  == 0 { <~ "Vù" }
    _ { <~ số }
}

@ i:1..20 { >> phânLoại(i) ¶ }
```

---

## Tham Chiếu Ký Hiệu

| Ký hiệu      | Thao tác                          | Ký hiệu       | Thao tác                        |
|--------------|-----------------------------------|---------------|---------------------------------|
| `=`          | biến                              | `$#`          | độ dài                          |
| `:=`         | hằng số                           | `$+`          | thêm vào cuối                   |
| `>>`         | xuất                              | `$+[i]`       | chèn tại chỉ số                 |
| `<<`         | nhập                              | `$-`          | xóa lần đầu theo giá trị        |
| `¶` / `\`    | xuống dòng                        | `$--`         | xóa tất cả theo giá trị         |
| `?`          | nếu (if)                          | `$-[i]`       | xóa theo chỉ số                 |
| `_?`         | nếu không thì (elif)              | `$-[i..j]`    | xóa khoảng                      |
| `_`          | khác / wildcard                   | `$?`          | kiểm tra có chứa                |
| `??`         | match                             | `$??`         | tìm tất cả chỉ số               |
| `@`          | vòng lặp                          | `$[s..e]`     | cắt mảng/chuỗi                  |
| `@!`         | dừng (break)                      | `$>`          | map                             |
| `@>`         | tiếp tục (continue)               | `$\|`         | filter                          |
| `->`         | lambda                            | `$<`          | reduce                          |
| `arr[i] = val` | cập nhật phần tử (chỉ mảng)   | `arr[i] += val` | cập nhật phức hợp             |
| `arr[i]$~`   | cập nhật kiểu hàm (bản sao mới)  | `$^+`         | sắp xếp tăng dần (nguyên thủy) |
| `$^-`        | sắp xếp giảm dần (nguyên thủy)   | `$^`          | sắp xếp với comparator (tuples) |
| `<~`         | trả về (return)                   | `!?`          | thử (try)                       |
| `\|>`        | pipe                              | `:!`          | bắt lỗi (catch)                 |
| `#1`         | đúng (true)                       | `:>`          | luôn chạy (finally)             |
| `#0`         | sai (false)                       | `$!`          | là lỗi                          |
| `<#`         | nhập khẩu (import)                | `$!!`         | lan truyền lỗi                  |
| `#`          | khai báo mô-đun                   | `#>`          | xuất khẩu (export)              |
| `::`         | gọi mô-đun                        | `.`           | truy cập trường                 |
| `#\|..\|`    | chuyển đổi số                     | `#?`          | siêu dữ liệu kiểu               |
| `#.N\|..\|`  | làm tròn                          | `#!N\|..\|`   | cắt bớt                         |
| `#,\|..\|`    | định dạng dấu phẩy                | `#^\|..\|`     | ký hiệu khoa học                |
| `#d0d9#` | chuyển chế độ số | `#09#` | đặt lại về ASCII |
| `<\ ..\>`    | thực thi shell                    | `>\<`         | tham số CLI                     |

## Lịch Sử Phiên Bản

### v0.0.3 — Hệ Thống Số Unicode & Cải Tiến LSP _(Tháng 4 năm 2026)_

- **Thêm** 69 khối chữ số Unicode với token chuyển chế độ `#d0d9#`
- **Thêm** Ký tự boolean trong bất kỳ hệ chữ nào — `#१` / `#०`, `#١` / `#٠`, v.v.
- **Thêm** Chữ số Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Thêm** Opcode VM `SetNumeralMode` — tương đương hoàn toàn với tree-walker
- **Thêm** REPL tôn trọng chế độ số hiện hoạt trong echo và hiển thị biến
- **Thay đổi** Đầu ra `>>` của boolean giờ bao gồm tiền tố `#` (`#0` / `#1`) trong tất cả các chế độ

### v0.0.2_01 — Đổi Tên Toán Tử _(30 tháng 3 năm 2026)_

- **Thay đổi** `c|..|` → `#,|..|` và `e|..|` → `#^|..|` — nhất quán với họ tiền tố `#`
- **Thêm** Bí danh xuất: xuất lại các thành viên module với tên khác

### v0.0.2 — Thiết Kế Lại API Bộ Sưu Tập & Trình Cài Đặt _(24 tháng 3 năm 2026)_

- **Thêm** Họ toán tử `$` thống nhất cho mảng và chuỗi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Thêm** Destructuring cho mảng, tuple và tuple có tên
- **Thêm** Chỉ số âm (`arr[-1]` = phần tử cuối)
- **Thêm** Trình cài đặt gốc — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 tháng 3 năm 2026)_

- **Thêm** Gán kết hợp `^=`
- **Sửa** Các trường hợp biên của parser số học; sửa tài liệu

### v0.0.1 — Phát Hành Công Khai Đầu Tiên _(22 tháng 3 năm 2026)_

- Trình thông dịch tree-walker + VM thanh ghi (`--vm`, ~4× nhanh hơn, ~95% tương đương)
- Tất cả các cấu trúc cốt lõi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Định danh Unicode đầy đủ, hệ thống module, lambda, closure, xử lý lỗi
- REPL, LSP, tiện ích mở rộng VS Code, bộ định dạng (`zymbol fmt`)

---

*Zymbol-Lang — Biểu Tượng. Phổ Quát. Bất Biến.*

> **Cảnh báo:** Tài liệu này được tạo và dịch bởi trí tuệ nhân tạo (AI).
> Mọi nỗ lực đã được thực hiện để đảm bảo độ chính xác, nhưng một số bản dịch hoặc ví dụ có thể chứa lỗi.
> Tài liệu tham chiếu chính thức là [đặc tả Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
