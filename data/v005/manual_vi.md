> **Tuyên bố miễn trách nhiệm:** Tài liệu này được tạo và dịch bởi trí tuệ nhân tạo (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Tài liệu tham khảo chính thức là **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** trong kho lưu trữ trình thông dịch.

---

# Hướng dẫn Zymbol-Lang

> **Đã được xem xét cho v0.0.5 — 2026-05-14**

**Zymbol-Lang** là một ngôn ngữ lập trình ký hiệu. Không có từ khóa — mọi thứ đều là ký hiệu. Hoạt động giống hệt nhau trong bất kỳ ngôn ngữ nào của con người.

- Không có `if`, `while`, `return` — chỉ có `?`, `@`, `<~`
- Unicode đầy đủ — định danh trong bất kỳ ngôn ngữ hoặc biểu tượng cảm xúc nào
- Không phụ thuộc ngôn ngữ con người — mã giống nhau ở mọi nơi

**Phiên bản trình thông dịch**: v0.0.5 | **Độ phủ kiểm thử**: 436/436 (tương đương TW ↔ VM)

---

## Biến và Hằng số

```zymbol
x = 10              // biến có thể thay đổi
π := 3.14159        // hằng số — gán lại là lỗi thời gian chạy
tên = "Alice"
hoạt_động = #1         // boolean true
👋 := "Xin chào"
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

`°` (ký hiệu độ, U+00B0) tự động khởi tạo một biến thành giá trị trung tính của nó khi sử dụng lần đầu:

```zymbol
các_số = [3, 1, 4, 1, 5]
@ n:các_số {
    °tổng += n    // tự động khởi tạo thành 0 bên trên vòng lặp; tồn tại sau @
}
>> tổng ¶         // → 14
```

> `°x` (tiền tố) neo bên trên vòng lặp — kết quả có thể truy cập sau `@`.
> `x°` (hậu tố) neo bên trong vòng lặp — chết khi vòng lặp kết thúc.
> Chỉ tree-walker.

---

## Kiểu Dữ liệu

| Kiểu | Literal | Thẻ `#?` | Ghi chú |
|------|---------|----------|---------|
| Số nguyên | `42`, `-7` | `###` | 64-bit có dấu |
| Số thực | `3.14`, `1.5e10` | `##.` | Ký hiệu khoa học được phép |
| Chuỗi | `"văn bản"` | `##"` | Nội suy: `"Xin chào {tên}"` |
| Ký tự | `'A'` | `##'` | Một ký tự Unicode |
| Boolean | `#1`, `#0` | `##?` | Không phải số — `#1 ≠ 1` |
| Mảng | `[1, 2, 3]` | `##]` | Các phần tử đồng nhất |
| Tuple | `(a, b)` | `##)` | Vị trí |
| Tuple có tên | `(x: 1, y: 2)` | `##)` | Các trường có tên |
| Hàm | tham chiếu hàm có tên | `##()` | Hạng nhất; hiển thị `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Hạng nhất; hiển thị `<lambd/N>` |

```zymbol
// Nội quan kiểu — trả về (kiểu, chữ số, giá trị)
siêu = 42#?
>> siêu ¶         // → (###, 2, 42)
t = siêu[1]
>> t ¶            // → ###
```

---

## Đầu ra và Đầu vào

```zymbol
>> "Xin chào" ¶                       // ¶ hoặc \\ cho dòng mới rõ ràng
>> "a=" a " b=" b ¶               // juxtaposition — nhiều giá trị
>> (arr$#) ¶                      // toán tử hậu tố yêu cầu ( ) trong >>

>> tên                           // đọc vào biến (không có lời nhắc)
>> "Nhập tên: " tên            // có lời nhắc
```

> `¶` (AltGr+R trên bàn phím Tây Ban Nha) và `\\` là các dòng mới tương đương.

---

## Nguyên thủy TUI

Các toán tử giao diện người dùng thiết bị đầu cuối cho chương trình tương tác. Hầu hết yêu cầu khối `>>| { }` (màn hình thay thế + chế độ thô).

```zymbol
>>| {
    >>!                             // xóa màn hình thay thế
    >>~ (1, 1, 0, 10) > "Đang chạy"   // hàng 1, cột 1, fg=10 (xanh lá)
    @~ 1000                         // tạm dừng 1 giây (1000 ms)
    >>~ (2, 1) > "Hoàn thành."
}
// thiết bị đầu cuối được khôi phục tự động khi thoát
```

```zymbol
// Nhấn phím và kích thước thiết bị đầu cuối
>>| {
    [hàng, cột] = >>?              // truy vấn kích thước thiết bị đầu cuối
    >>~ (1, 1) > "Thiết bị đầu cuối: " hàng " x " cột
    <<| phím                         // đọc lần nhấn phím chặn
    >>~ (2, 1) > "Đã nhấn: " phím
}
```

> `>>!` xóa màn hình. `>>?` trả về `[hàng, cột]`. `@~ N` ngủ N mili giây.
> `<<|` đọc một lần nhấn phím (chặn); `<<|?` thăm dò không chặn (trả về `'\0'` nếu không có).
> Tuple đầu ra vị trí: `(hàng, cột, BKS, fg, bg)` — bất kỳ vị trí nào có thể bỏ qua bằng dấu phẩy (`>>~ (,,, 196) > "đỏ"`).
> BKS mặt nạ bit: `1`=đậm, `2`=nghiêng, `4`=gạch chân. Bảng màu ANSI 256 (`0`=mặc định thiết bị đầu cuối).
> Chỉ tree-walker (ngoại trừ `>>!`, `>>?`, `@~`, `>>~` cũng chạy trong `--vm`).

---

## Toán tử

```zymbol
// Số học
a = 10
b = 3
kq1 = a + b    // 13
kq2 = a - b    // 7
kq3 = a * b    // 30
kq4 = a / b    // 3  (chia số nguyên)
kq5 = a % b    // 1
kq6 = a ^ b    // 1000  (lũy thừa)

// So sánh — gán để kiểm tra
ss1 = a == b    // #0
ss2 = a <> b    // #1
ss3 = a < b     // #0
ss4 = a <= b    // #0
ss5 = a > b     // #1
ss6 = a >= b    // #1

// Logic
lg1 = #1 && #0    // #0
lg2 = #1 || #0    // #1
lg3 = !#1         // #0
```

---

## Chuỗi

```zymbol
// Hai dạng nối
tên = "Alice"
n = 42

>> "Xin chào " tên " bạn có " n ¶       // juxtaposition — trong >>
mô_tả = "Xin chào {tên}, bạn có {n}"     // nội suy — ở bất kỳ đâu
```

```zymbol
s = "Xin chào thế giới"
độ_dài = s$#                  // 11
phần = s$[1..5]             // "Xin c"  (1-based, bao gồm cuối)
có = s$? "thế giới"          // #1
các_phần = "a,b,c,d"$/ ','   // [a, b, c, d]  (chia theo dấu phân cách)
thay_thế = s$~~["h":"x"]        // "Xin chào thế giới" (không có 'h' trong TV)
thay_thế1 = s$~~["h":"x":1]     // "Xin chào thế giới"
dòng = "─" $* 20           // "────────────────────"  (lặp lại N lần)
```

> `+` chỉ dành cho số. Sử dụng `,`, juxtaposition, hoặc nội suy cho chuỗi.

---

## Luồng điều khiển

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

> Dấu ngoặc nhọn `{ }` **bắt buộc** ngay cả với một câu lệnh duy nhất.

---

## So khớp

```zymbol
// Khoảng
điểm = 85
hạng = ?? điểm {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> hạng ¶    // → B

// Chuỗi
màu = "đỏ"
mã = ?? màu {
    "đỏ"   => "#FF0000"
    "xanh" => "#00FF00"
    _       => "#000000"
}

// Mẫu so sánh
nhiệt_độ = -5
trạng_thái = ?? nhiệt_độ {
    < 0  => "băng"
    < 20 => "lạnh"
    < 35 => "ấm"
    _    => "nóng"
}
>> trạng_thái ¶    // → băng

// Dạng câu lệnh (nhánh khối)
n = -3
?? n {
    0    => { >> "không" ¶ }
    < 0  => { >> "âm" ¶ }
    _    => { >> "dương" ¶ }
}
```

---

## Vòng lặp

```zymbol
@ i:0..4  { >> i " " }        // khoảng bao gồm:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // có bước:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ngược:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

trái_cây = ["táo", "lê", "nho"]
@ t:trái_cây { >> t ¶ }         // cho mỗi phần tử trong mảng

@ k:"xin chào" { >> k "-" }
>> ¶                          // → x-i-n- -c-h-à-o-  (cho mỗi ký tự trong chuỗi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tiếp tục
    ? i > 7 { @! }             // @! phá vỡ
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

// Vòng lặp có nhãn (phá vỡ lồng nhau)
đếm = 0
@:bên_ngoài {
    đếm++
    ? đếm >= 3 { @:bên_ngoài! }
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

Các hàm có **phạm vi biệt lập** — chúng không thể đọc biến bên ngoài. Sử dụng tham số đầu ra `<~` để sửa đổi biến của người gọi:

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

> Các hàm có tên là **giá trị hạng nhất** — truyền trực tiếp: `các_số$> gấp_đôi`. Để bọc: `x -> fn(x)` cũng hợp lệ.

---

## Lambda và Closure

```zymbol
gấp_đôi = x -> x * 2
cộng = (a, b) -> a + b
>> gấp_đôi(5) ¶    // → 10
>> cộng(3, 7) ¶  // → 10

// Lambda khối
phân_loại = x -> {
    ? x > 0 { <~ "dương" }
    _? x < 0 { <~ "âm" }
    <~ "không"
}

// Closure — nắm bắt phạm vi bên ngoài
hệ_số = 3
gấp_ba = x -> x * hệ_số
>> gấp_ba(7) ¶    // → 21

// Nhà máy
tạo_bộ_cộng(n) { <~ x -> x + n }
cộng_mười = tạo_bộ_cộng(10)
>> cộng_mười(5) ¶    // → 15

// Trong mảng
các_toán_tử = [x -> x+1, x -> x*2, x -> x*x]
>> các_toán_tử[3](5) ¶    // → 25
```

---

## Mảng

Mảng **có thể thay đổi** và chứa các phần tử **cùng kiểu**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — truy cập (1-based: phần tử đầu tiên)
x = arr[-1]     // 5 — chỉ số âm (phần tử cuối cùng)
x = arr$#       // 5 — độ dài (sử dụng (arr$#) trong >>)

arr = arr$+ 6            // thêm → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // chèn tại vị trí 2 (1-based)
arr3 = arr$- 3           // xóa lần xuất hiện đầu tiên của giá trị
arr4 = arr$-- 3          // xóa tất cả các lần xuất hiện
arr5 = arr$-[1]          // xóa tại chỉ số 1 (phần tử đầu tiên)
arr6 = arr$-[2..3]       // xóa khoảng (1-based, bao gồm cuối)

có = arr$? 3            // #1 — chứa
vị_trí = arr$?? 3           // [3] — tất cả chỉ số của giá trị (1-based)
lát = arr$[1..3]          // [1,2,3] — lát cắt (1-based, bao gồm cuối)
lát2 = arr$[1:3]          // [1,2,3] — tương tự, cú pháp dựa trên số lượng

tăng_dần = arr$^+             // sắp xếp tăng dần (chỉ kiểu nguyên thủy)
giảm_dần = arr$^-            // sắp xếp giảm dần (chỉ kiểu nguyên thủy)

// Mảng tuple có tên/vị trí — sử dụng $^ với lambda so sánh
cơ_sở_dữ_liệu = [(tên: "Carla", tuổi: 28), (tên: "Ana", tuổi: 25), (tên: "Bob", tuổi: 30)]
theo_tuổi  = cơ_sở_dữ_liệu$^ (a, b -> a.tuổi < b.tuổi)    // theo tuổi tăng dần (<)
theo_tên = cơ_sở_dữ_liệu$^ (a, b -> a.tên > b.tên)   // theo tên giảm dần (>)
>> theo_tuổi[1].tên ¶     // → Ana
>> theo_tên[1].tên ¶    // → Carla

// Cập nhật phần tử trực tiếp (chỉ mảng)
arr[1] = 99              // gán
arr[2] += 5              // kết hợp: +=  -=  *=  /=  %=  ^=

// Cập nhật hàm — trả về một mảng mới; bản gốc không thay đổi
arr2 = arr[2]$~ 99
```

> Tất cả các toán tử tập hợp trả về một **mảng mới**. Gán lại: `arr = arr$+ 4`.
> `$+` có thể được xâu chuỗi: `arr = arr$+ 5$+ 6$+ 7`. Các toán tử khác sử dụng gán trung gian.
> **Đánh chỉ số 1-based**: `arr[1]` là phần tử đầu tiên; `arr[0]` là lỗi thời gian chạy.
> `$^+` / `$^-` sắp xếp **mảng nguyên thủy** (số, chuỗi). Đối với mảng tuple, sử dụng `$^` với lambda so sánh — hướng được mã hóa trong lambda (`<` = tăng dần, `>` = giảm dần).

**Ngữ nghĩa giá trị** — gán một mảng cho một biến khác tạo ra một bản sao độc lập:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b không bị ảnh hưởng
```

```zymbol
// Mảng lồng nhau (đánh chỉ số 1-based)
ma_trận = [[1,2,3],[4,5,6],[7,8,9]]
>> ma_trận[2][3] ¶    // → 6  (hàng 2, cột 3)
```

---

## Giải cấu trúc

```zymbol
// Mảng
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[đầu, *còn_lại] = arr         // đầu=10  còn_lại=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ loại bỏ

// Tuple vị trí
điểm = (100, 200)
(px, py) = điểm             // px=100  py=200

// Tuple có tên
người = (tên: "Ana", tuổi: 25, thành_phố: "Madrid")
(tên: n, tuổi: t) = người   // n="Ana"  t=25
```

---

## Tuple

Tuple là các container có thứ tự **không thể thay đổi** có thể chứa các giá trị **khác kiểu**.
Không giống như mảng, các phần tử không thể thay đổi sau khi tạo.

```zymbol
// Vị trí — cho phép các kiểu hỗn hợp
điểm = (10, 20)
>> điểm[1] ¶    // → 10

dữ_liệu = (42, "Xin chào", #1, 3.14)
>> dữ_liệu[3] ¶     // → #1

// Có tên
người = (tên: "Alice", tuổi: 25)
>> người.tên ¶    // → Alice
>> người[1] ¶      // → Alice  (chỉ số cũng hoạt động, 1-based)

// Lồng nhau
vị_trí = (x: 10, y: 20)
p = (vị_trí: vị_trí, nhãn: "gốc")
>> p.vị_trí.x ¶        // → 10
```

**Tính không thể thay đổi** — bất kỳ nỗ lực nào để sửa đổi một phần tử tuple đều là lỗi thời gian chạy:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ lỗi thời gian chạy: tuple không thể thay đổi
// t[1] += 5    // ❌ lỗi tương tự
```

Để lấy giá trị đã sửa đổi, sử dụng `$~` (cập nhật hàm) — trả về một **tuple mới**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← bản gốc không thay đổi
>> t2 ¶    // → (10, 999, 30)

// Tuple có tên — xây dựng lại một cách rõ ràng
người = (tên: "Alice", tuổi: 25)
lớn_hơn  = (tên: người.tên, tuổi: 26)
>> người.tuổi ¶    // → 25
>> lớn_hơn.tuổi ¶     // → 26
```

---

## Hàm bậc cao

```zymbol
các_số = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

gấp_đôi  = các_số$> (x -> x * 2)                  // map  → [2,4,6…20]
số_chẵn    = các_số$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
tổng    = các_số$< (0, (tích_lũy, x) -> tích_lũy + x)     // reduce → 55

// Xâu chuỗi qua trung gian
bước1 = các_số$| (x -> x > 3)
bước2 = bước1$> (x -> x * x)
>> bước2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Các hàm có tên có thể được truyền trực tiếp vào HOF
gấp_đôi(x) { <~ x * 2 }
lớn(x) { <~ x > 5 }
r = các_số$> gấp_đôi       // ✅ tham chiếu trực tiếp
r = các_số$| lớn       // ✅ tham chiếu trực tiếp
```

---

## Toán tử đường ống

Vế phải luôn yêu cầu `_` làm trình giữ chỗ cho giá trị được chuyển qua đường ống:

```zymbol
gấp_đôi = x -> x * 2
cộng = (a, b) -> a + b
tăng = x -> x + 1

kq1 = 5 |> gấp_đôi(_)        // → 10
kq2 = 10 |> cộng(_, 5)       // → 15
kq3 = 5 |> cộng(2, _)        // → 7

// Xâu chuỗi
kq = 5 |> gấp_đôi(_) |> tăng(_) |> gấp_đôi(_)
>> kq ¶    // → 22  (5→10→11→22)
```

---

## Xử lý lỗi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "chia cho không" ¶
} :! {
    >> "khác: " _err ¶    // _err giữ thông báo lỗi
} :> {
    >> "luôn chạy" ¶
}
```

| Kiểu | Khi nào |
|------|------|
| `##Div` | Chia cho không |
| `##IO` | Tệp / Hệ thống |
| `##Index` | Chỉ số ngoài phạm vi |
| `##Type` | Sai kiểu |
| `##Parse` | Phân tích dữ liệu |
| `##Network` | Lỗi mạng |
| `##_` | Bất kỳ lỗi nào (bắt tất cả) |

---

## Mô-đun

```zymbol
// lib/calc.zy — thân mô-đun được bao trong dấu ngoặc nhọn
# calc {
    #> { cộng, get_PI }

    _π := 3.14159
    cộng(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // bí danh bắt buộc

>> c::cộng(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Xuất với tên công khai khác
# mylib {
    #> { _cộng_bên_trong => tổng }

    _cộng_bên_trong(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::tổng(3, 4) ¶    // → 7  (tên bên trong _cộng_bên_trong bị ẩn)
```

> **Quy tắc mô-đun**: Bên trong `# tên { }`, chỉ cho phép `#>`, định nghĩa hàm, và bộ khởi tạo biến/hằng literal. Các câu lệnh thực thi được (`>>`, `<<`, vòng lặp, v.v.) gây ra lỗi E013.

---

## Chế độ Chữ số

Zymbol có thể hiển thị số trong **69 bộ chữ số Unicode** — Devanagari, Ả Rập-Ấn Độ, Thái, Klingon pIqaD, Chữ đậm Toán học, các đoạn LCD, và hơn thế nữa. Chế độ hoạt động chỉ ảnh hưởng đến đầu ra `>>`; số học bên trong luôn là nhị phân.

### Kích hoạt một bộ chữ

Viết chữ số `0` và `9` của bộ chữ mục tiêu trong `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Ả Rập-Ấn Độ (U+0660–U+0669)
#๐๙#    // Thái         (U+0E50–U+0E59)
#09#    // đặt lại thành ASCII
```

### Đầu ra và boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII mặc định)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dấu thập phân luôn là ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: tiền tố # luôn là ASCII, chữ số thích nghi
>> #1 ¶         // → #१   (true trong Devanagari)
>> #0 ¶         // → #०   (false — khác biệt với ० số nguyên không)

x = 28 > 4
>> x ¶          // → #१   (kết quả so sánh tuân theo chế độ hoạt động)
```

### Chữ số literal bản địa trong mã nguồn

Chữ số của bất kỳ bộ chữ được hỗ trợ nào đều là literal hợp lệ — trong khoảng, modulo, so sánh:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literal trong bất kỳ bộ chữ nào

`#` + chữ số `0` hoặc `1` từ bất kỳ khối nào là một boolean literal hợp lệ:

```zymbol
#०९#
hoạt_động = #१        // giống #1
>> hoạt_động ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **luôn là ASCII**. `#0` (false) luôn khác biệt trực quan với `0` (số nguyên không) trong mọi bộ chữ.

---

## Toán tử Dữ liệu

```zymbol
// Chuyển đổi kiểu
f = ##.42         // → 42.0  (thành số thực)
i = ###3.7        // → 4     (thành số nguyên, làm tròn)
t = ##!3.7        // → 3     (thành số nguyên, cắt bớt)

// Phân tích chuỗi thành số
v1 = #|"42"|      // → 42  (số nguyên)
v2 = #|"3.14"|    // → 3.14  (số thực)
v3 = #|"abc"|     // → "abc"  (an toàn, không có lỗi)

// Làm tròn / Cắt bớt
π = 3.14159265
làm_tròn2 = #.2|π|      // → 3.14  (làm tròn đến 2 chữ số thập phân)
làm_tròn4 = #.4|π|      // → 3.1416
cắt_bớt2 = #!2|π|      // → 3.14  (cắt bớt)

// Định dạng số
định_dạng = #,|1234567|  // → 1,234,567  (phân cách bằng dấu phẩy)
khoa_học = #^|12345.678|    // → 1.2345678e4  (khoa học)

// Literal cơ số
a = 0x41         // → 'A'  (thập lục phân)
b = 0b01000001   // → 'A'  (nhị phân)
c = 0o101        // → 'A'  (bát phân)

// Đầu ra chuyển đổi cơ số
thập_lục_phân = 0x|255|    // → "0x00FF"
nhị_phân = 0b|65|     // → "0b1000001"
bát_phân = 0o|8|      // → "0o10"
thập_phân = 0d|255|    // → "0d0255"
```

---

## Tích hợp Shell

```zymbol
ngày = <\ date +%Y-%m-%d \>     // chụp stdout (bao gồm \n ở cuối)
>> "Hôm nay: " ngày

tệp = "data.txt"
nội_dung = <\ cat {tệp} \>      // nội suy trong lệnh

đầu_ra = </"./subscript.zy"/>   // chạy một tập lệnh Zymbol khác, chụp đầu ra
>> đầu_ra
```

> `><` chụp các đối số CLI dưới dạng mảng chuỗi (chỉ tree-walker).

---

## Ví dụ hoàn chỉnh: FizzBuzz

```zymbol
phân_loại(số) {
    ? số % 15 == 0 { <~ "FizzBuzz" }
    _? số % 3  == 0 { <~ "Fizz" }
    _? số % 5  == 0 { <~ "Buzz" }
    _ { <~ số }
}

@ i:1..20 { >> phân_loại(i) ¶ }
```

---

## Bảng tham chiếu Ký hiệu

| Ký hiệu | Thao tác | Ký hiệu | Thao tác |
|--------|-----------|--------|-----------|
| `=` | biến | `$#` | độ dài |
| `:=` | hằng số | `$+` | thêm (có thể xâu chuỗi) |
| `>>` | đầu ra | `$+[i]` | chèn tại chỉ số (1-based) |
| `<<` | đầu vào | `$-` | xóa phần tử đầu tiên theo giá trị |
| `¶` / `\\` | dòng mới | `$--` | xóa tất cả theo giá trị |
| `?` | nếu | `$-[i]` | xóa tại chỉ số (1-based) |
| `_?` | nếu không thì | `$-[i..j]` | xóa khoảng (1-based) |
| `_` | nếu không / ký tự đại diện | `$?` | chứa |
| `??` | so khớp | `$??` | tìm tất cả chỉ số (1-based) |
| `@` | vòng lặp | `$[s..e]` | lát cắt (1-based) |
| `@ N { }` | vòng lặp N lần | `$>` | map |
| `@!` | phá vỡ | `$\|` | filter |
| `@>` | tiếp tục | `$<` | reduce |
| `@:tên { }` | vòng lặp có nhãn | `$/ dấu_phân_cách` | chia chuỗi |
| `@:tên!` | phá vỡ nhãn | `$++ a b c` | xây dựng nối tiếp |
| `@:tên>` | tiếp tục nhãn | `arr[i>j>k]` | chỉ số điều hướng |
| `->` | lambda | `arr[i] = giá_trị` | cập nhật phần tử (chỉ mảng) |
| `arr[i] += giá_trị` | cập nhật kết hợp | `arr[i]$~` | cập nhật hàm (bản sao mới) |
| `$^+` | sắp xếp tăng dần (nguyên thủy) | `$^-` | sắp xếp giảm dần (nguyên thủy) |
| `$^` | sắp xếp với bộ so sánh (tuple) | `<~` | trả về |
| `\|>` | đường ống | `!?` | thử |
| `:!` | bắt | `:>` | cuối cùng |
| `#1` | true | `#0` | false |
| `$!` | có phải lỗi không | `$!!` | lan truyền lỗi |
| `<#` | nhập | `#>` | xuất |
| `#` | khai báo mô-đun | `::` | gọi mô-đun |
| `.` | truy cập trường | `#?` | siêu dữ liệu kiểu |
| `#\|..\|` | phân tích số | `##.` | chuyển thành số thực |
| `###` | chuyển thành số nguyên (làm tròn) | `##!` | chuyển thành số nguyên (cắt bớt) |
| `#.N\|..\|` | làm tròn | `#!N\|..\|` | cắt bớt |
| `#,\|..\|` | định dạng dấu phẩy | `#^\|..\|` | khoa học |
| `#d0d9#` | chuyển chế độ chữ số | `#09#` | đặt lại thành ASCII |
| `<\ ..\>` | chạy shell | `>\<` | đối số CLI |
| `\ biến` | hủy biến rõ ràng | `°x` / `x°` | định nghĩa nóng (tự động khởi tạo) |
| `>>|` | khối TUI (màn hình thay thế) | `>>~` | đầu ra vị trí |
| `>>!` | xóa màn hình | `>>?` | truy vấn kích thước thiết bị đầu cuối |
| `<<\|` | nhấn phím chặn | `<<\|?` | thăm dò nhấn phím không chặn |
| `@~ N` | ngủ N mili giây | `$*` | lặp lại chuỗi N lần |

---

## Nhật ký thay đổi Phiên bản

### v0.0.5 — Nguyên thủy TUI, Định nghĩa nóng & Lặp lại Chuỗi _(Tháng 5, 2026)_

- **Phá vỡ** Dấu phân cách nhánh so khớp: `mẫu : kết_quả` → `mẫu => kết_quả`
- **Phá vỡ** Bí danh nhập: `<# đường_dẫn <= bí_danh` → `<# đường_dẫn => bí_danh`
- **Phá vỡ** Đổi tên xuất: `#> { fn <= công_khai }` → `#> { fn => công_khai }`
- **Đã thêm** Khối TUI `>>| { }` — màn hình thay thế + chế độ thô; dọn dẹp khi thoát
- **Đã thêm** Đầu ra vị trí `>>~ (hàng, cột, BKS, fg, bg) > các_mục` — các vị trí thưa thớt, màu ANSI 256
- **Đã thêm** Đầu vào phím `<<| biến` (chặn) và `<<|? biến` (thăm dò không chặn)
- **Đã thêm** `>>!` xóa màn hình, `>>?` truy vấn kích thước thiết bị đầu cuối, `@~ N` ngủ N mili giây
- **Đã thêm** Định nghĩa nóng `°x` / `x°` — tự động khởi tạo biến khi sử dụng lần đầu trong vòng lặp
- **Đã thêm** Lặp lại chuỗi `chuỗi $* N` — lặp lại một chuỗi N lần
- **VM** Tương đương: 436/436 bài kiểm tra đạt

### v0.0.4 — Đánh chỉ số 1-based, Hàm hạng nhất & Mô-đun khối _(Tháng 4, 2026)_

- **Phá vỡ** Tất cả đánh chỉ số được chuyển thành **1-based** — `arr[1]` là phần tử đầu tiên; `arr[0]` là lỗi thời gian chạy
- **Đã thêm** Các hàm có tên là **giá trị hạng nhất** — truyền trực tiếp vào HOF: `các_số$> gấp_đôi`
- **Đã thêm** **Cú pháp khối bắt buộc** cho mô-đun: `# tên { ... }` — cú pháp phẳng đã bị loại bỏ
- **Đã thêm** Đánh chỉ số đa chiều: `arr[i>j>k]` (điều hướng), `arr[p ; q]` (trích xuất phẳng)
- **Đã thêm** Chuyển đổi kiểu: `##.biểu_thức` (số thực), `###biểu_thức` (số nguyên làm tròn), `##!biểu_thức` (số nguyên cắt bớt)
- **Đã thêm** Chia chuỗi: `chuỗi$/ dấu_phân_cách` — trả về `Array(chuỗi)`
- **Đã thêm** Xây dựng nối tiếp: `cơ_sở$++ a b c` — thêm nhiều mục
- **Đã thêm** Vòng lặp số lần: `@ N { }` — lặp lại chính xác N lần
- **Đã thêm** Cú pháp vòng lặp có nhãn: `@:tên { }`, `@:tên!`, `@:tên>` — thay thế `@ @tên` / `@! tên`
- **Đã thêm** Quy tắc phạm vi biến: các biến `_tên` có phạm vi khối chính xác; `\ biến` hủy sớm
- **Đã thêm** Mẫu so sánh so khớp: `< 0 =>`, `> 5 =>`, `== 42 =>`, v.v.
- **Đã thêm** Lỗi mô-đun E013: các câu lệnh thực thi được trong thân mô-đun bị cấm
- **Đã sửa** `alias.CONST` hiện giải quyết chính xác; `#>` có thể xuất hiện sau định nghĩa hàm
- **VM** Tương đương hoàn toàn: 393/393 bài kiểm tra đạt

### v0.0.3 — Hệ thống Chữ số Unicode & Cải tiến LSP _(Tháng 4, 2026)_

- **Đã thêm** 69 khối chữ số Unicode với mã thông báo chuyển chế độ `#d0d9#`
- **Đã thêm** Boolean literal trong bất kỳ bộ chữ nào — `#१` / `#०`, `#١` / `#٠`, v.v.
- **Đã thêm** Chữ số Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Đã thêm** Mã lệnh VM `SetNumeralMode` — tương đương hoàn toàn với tree-walker
- **Đã thay đổi** Đầu ra boolean `>>` hiện bao gồm tiền tố `#` (`#0` / `#1`) trong tất cả các chế độ

### v0.0.2_01 — Đổi tên Toán tử _(30 Tháng 3, 2026)_

- **Đã thay đổi** `c|..|` → `#,|..|` và `e|..|` → `#^|..|` — nhất quán với họ tiền tố `#`
- **Đã thêm** Bí danh xuất: xuất lại các thành viên mô-đun dưới một tên khác

### v0.0.2 — Thiết kế lại API Bộ sưu tập & Trình cài đặt _(24 Tháng 3, 2026)_

- **Đã thêm** Họ toán tử `$` thống nhất cho mảng và chuỗi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Đã thêm** Gán giải cấu trúc cho mảng, tuple và tuple có tên
- **Đã thêm** Chỉ số âm (`arr[-1]` = phần tử cuối cùng)
- **Đã thêm** Trình cài đặt gốc — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Tháng 3, 2026)_

- **Đã thêm** Gán kết hợp `^=`
- **Đã sửa** Các trường hợp biên số học của bộ phân tích; sửa lỗi tài liệu

### v0.0.1 — Bản phát hành công khai đầu tiên _(22 Tháng 3, 2026)_

- Trình thông dịch tree-walker + VM thanh ghi (`--vm`, nhanh hơn ~4×, ~95% tương đương)
- Tất cả cấu trúc cốt lõi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Định danh Unicode đầy đủ, hệ thống mô-đun, lambda, closure, xử lý lỗi
- REPL, LSP, phần mở rộng VS Code, bộ định dạng (`zymbol fmt`)

---

_Zymbol-Lang — Ký hiệu. Phổ quát. Bất biến._
