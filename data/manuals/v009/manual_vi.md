> **Tuyên bố từ chối trách nhiệm:** Tài liệu này được tạo và dịch bởi trí tuệ nhân tạo (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Tài liệu tham khảo chính là **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** trong kho lưu trữ trình thông dịch.

---

# Sách Hướng Dẫn Zymbol-Lang

> **Đã được sửa đổi cho v0.0.9 — 2026-09-07**

**Zymbol-Lang** là một ngôn ngữ lập trình mang tính biểu tượng. Không có từ nào trong ngữ pháp của nó — mọi cấu trúc đều là một ký hiệu. Hoạt động giống hệt nhau trong bất kỳ ngôn ngữ nào của con người.

- Không có `if`, `while`, `return` — chỉ có `?`, `@`, `<~`
- Unicode đầy đủ — định danh trong bất kỳ ngôn ngữ hoặc biểu tượng cảm xúc nào
- Không phụ thuộc vào ngôn ngữ con người — mã nguồn giống nhau ở mọi nơi

**Phiên bản trình thông dịch**: v0.0.9 | **Độ phủ kiểm thử**: 660/666 (ba công cụ đồng thuận, 0 khác biệt)

---

## Biến và Hằng Số

```zymbol
x = 10              // biến có thể thay đổi
PI := 3.14159       // hằng số — gán lại là lỗi thời gian chạy
tên = "An"
hoạt_động = #1         // boolean đúng
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
x++       // 5
x--       // 4
```

`°` (ký hiệu độ, U+00B0) tự động khởi tạo một biến với giá trị trung tính của nó khi sử dụng lần đầu:

```zymbol
các_số = [3, 1, 4, 1, 5]
@ n:các_số {
    °tổng += n
}
>> tổng ¶              // → 14
```

> `°biến` (tiền tố) neo phía trên vòng lặp — kết quả có thể đọc được sau `@`.
> `biến°` (hậu tố) neo bên trong vòng lặp — nó chết khi vòng lặp kết thúc.

Một câu lệnh chỉ là một tên sẽ đọc biến và loại bỏ giá trị, vì vậy nó cảnh báo:

```zymbol
bộ_đếm = 5
bộ_đếm
```

Trình biên dịch cảnh báo như sau (các thông báo của nó luôn bằng tiếng Anh):

```text
warning: this statement does nothing: 'bộ_đếm' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Nghĩa là: *«câu lệnh này không làm gì cả: 'bộ_đếm' được đọc và loại bỏ»*.

---

## Các Kiểu Dữ Liệu

| Kiểu | Giá trị văn bản | Thẻ `#?` | Ghi chú |
|------|----------------|----------|---------|
| Số nguyên | `42`, `-7` | `###` | Số nguyên an toàn: ±(2⁵³ − 1) |
| Số thực | `3.14`, `1.5e10` | `##.` | IEEE-754 độ chính xác kép |
| Chuỗi | `"văn bản"` | `##"` | Nội suy: `"Xin chào {tên}"` |
| Ký tự | `'A'` | `##'` | Một điểm mã Unicode |
| Boolean | `#1`, `#0` | `##?` | KHÔNG phải số — `#1 ≠ 1` |
| Mảng | `[1, 2, 3]` | `##]` | Một kiểu, đã được kiểm tra |
| Hỗn hợp đã khai báo | `#[1, "hai"]` | `##[` | Cùng kiểu với `[…]`, không kiểm tra |
| Bộ | `(a, b)` | `##)` | Theo vị trí, bất biến |
| Từ điển | `#(x: 1, y: 2)` | `##(` | Theo khóa, có thể thay đổi |
| Hàm | tham chiếu hàm có tên | `##()` | Hạng nhất; hiển thị `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Hạng nhất; hiển thị `<lambd/N>` |
| Đơn vị | `##_` | `##_` | Sự vắng mặt — không có null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Một số nguyên vượt ra ngoài phạm vi an toàn là lỗi có thể bắt được, không bao giờ là sự quấn vòng im lặng:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "ngoài phạm vi" ¶ // → ngoài phạm vi
}
```

`##_` là cách chương trình hỏi liệu một thứ gì đó có vắng mặt không:

```zymbol
không_gì() { }
giá_trị = không_gì()
>> (giá_trị == ##_) ¶     // → #1
```

---

## Đầu Ra và Đầu Vào

```zymbol
tên = "An"
tổng = 3
>> "Xin chào" ¶             // → Xin chào
>> "a=" tên " b=" tổng ¶ // → a=An b=3
>> tổng#? ¶            // → (###, 1, 3)
```

```zymbol
<< tên
<< "Nhập tên của bạn: " tên
<< ###(4) "Tuổi: " tuổi
```

**Hãy nhìn vào hình dạng của hai ký hiệu.** `>>` chỉ ra bên ngoài: nó lấy dữ liệu ra khỏi chương trình. `<<` chỉ vào bên trong: nó đưa dữ liệu vào chương trình. Không có gì để ghi nhớ ở đó — mũi tên chỉ ra hướng thông tin di chuyển, và cùng một ý tưởng đó quay trở lại trong mọi ký hiệu di chuyển một thứ gì đó.

> `¶` và `\\` là các dòng mới tương đương. `>>` không bao giờ thêm một dòng nào.
> Một bộ chỉ định kiểu trước lời nhắc sẽ xác thực khi đọc và yêu cầu lại cho đến khi giá trị hợp lệ:
> `##.` Số thực · `##.(T,D)` số thập phân · `###(N)` Số nguyên · `##"(N)` văn bản · `##'` một Ký tự.

Ở cấp cao nhất của một tệp, `<~` là trạng thái thoát của chương trình:

```zymbol
>> "đang kiểm tra" ¶      // → đang kiểm tra
<~ 0
```

---

## Các Nguyên Thủy TUI

Các toán tử giao diện đầu cuối cho chương trình tương tác. Hầu hết yêu cầu khối `>>| { }` (màn hình thay thế + chế độ thô).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Đang chạy"
    @~ 1000
    >>~ (2, 1) > "Hoàn tất."
}
```

```zymbol
>>| {
    [hàng, cột] = >>?
    >>~ (1, 1) > "Thiết bị đầu cuối: " hàng " x " cột
    <<| phím
    >>~ (2, 1) > "Đã nhấn: " phím
}
```

Đây là nơi bạn có thể thấy tại sao các ký hiệu kết hợp thay vì nhân lên. Bạn đã biết `<<` là đầu vào và `?` hỏi mà không cam kết. Chỉ có một ký hiệu mới:

- `|` là **một đơn vị duy nhất**, không phải toàn bộ luồng.

Với điều đó, cả hai toán tử bàn phím đều tự đọc được:

```text
<<        |             ?
đầu vào   một đơn vị    không cam kết

<<|   lấy MỘT phím và đợi cho đến khi có một phím
<<|?  kiểm tra xem CÓ một phím không và tiếp tục nếu không có
```

Tương tự ở phía bên kia: `>>` gửi ra, `>>!` gửi ra **một cách cưỡng chế** (xóa toàn bộ màn hình), trong khi `>>?` **hỏi** thay vì viết (thiết bị đầu cuối lớn bao nhiêu). Ký hiệu bên phải là ký hiệu thay đổi chế độ và nó luôn xuất hiện cuối cùng.

> `>>!` xóa màn hình. `>>?` trả về `[hàng, cột]`. `@~ N` ngủ N mili giây.
> `<<|` đọc một lần nhấn phím (chặn); `<<|?` thăm dò mà không chặn (`'\0'` nếu không có).
> Các phím mũi tên đến được giải mã thành `'↑' '↓' '←' '→'`; ESC là điểm mã 27.
> Bộ đầu ra được định vị: `(hàng, cột, BKS, trước, sau)` — bất kỳ vị trí nào có thể được bỏ qua bằng dấu phẩy (`>>~ (,,, 196) > "đỏ"`).
> Mặt nạ BKS: `1`=In đậm, `2`=In nghiêng, `4`=Gạch chân. Bảng màu ANSI 256 màu (`0`=mặc định thiết bị đầu cuối).

---

## Các Toán Tử

```zymbol
a = 10
b = 3
kq1 = a + b    // 13
kq2 = a - b    // 7
kq3 = a * b    // 30
kq4 = a / b    // 3  (phép chia số nguyên)
kq5 = a % b    // 1
kq6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
so1 = a == b    // #0
so2 = a <> b    // #1
so3 = a < b     // #0
so4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` không bao giờ ép kiểu: `"5" == 5` là `#0`. Sắp xếp ép kiểu: `"5" > 4` là `#1`, và `"४२" > 5` cũng vậy — văn bản số trong bất kỳ 69 hệ thống chữ viết nào đều so sánh như một số.
> Một hàm chỉ bằng chính nó, không bao giờ bằng một hàm khác có cùng thân.

---

## Chuỗi

```zymbol
tên = "An"
n = 42
>> "Xin chào " tên " bạn có " n ¶ // → Xin chào An bạn có 42
mô_tả = "Xin chào {tên}, bạn có {n}"
>> mô_tả ¶              // → Xin chào An, bạn có 42
```

```zymbol
s = "Xin chào thế giới"
độ_dài = s$#                  // 17
chuỗi_con = s$[1..8]             // "Xin chào"
chứa = s$? "thế giới"          // #1
các_phần = "a,b,c,d"$/ ','    // [a, b, c, d]
thay_thế = s$~~["o":"0"]        // "Xin chà0 thế giới"
đường_kẻ = "─" $* 20
```

> `+` chỉ dành cho số. Đối với chuỗi, hãy sử dụng cách đặt cạnh nhau hoặc nội suy.
> `\{` và `\}` là dấu ngoặc nhọn theo nghĩa đen — dấu thoát là đối xứng.

---

## Luồng Điều Khiển

```zymbol
x = 7
? x > 100 {
    >> "lớn" ¶
} _? x > 0 {
    >> "dương" ¶     // → dương
} _ {
    >> "âm" ¶
}
```

Ở đây có hai ký hiệu mới và ký hiệu thứ ba đến từ việc đặt chúng cùng nhau:

- `?` là **hỏi**: nó mở một điều kiện.
- `_` là **những gì không được chỉ định**: nhánh còn lại khi không có câu hỏi nào khớp.
- `_?` là cả hai liên tiếp: *nếu không có gì khớp, hãy hỏi lại*.

Đó là lý do tại sao `_?` được viết như vậy. Nó không phải là một ký hiệu mới để học — nó là `_` theo sau là `?` và nó có nghĩa chính xác những gì hai phần của nó có nghĩa, được đọc theo thứ tự.

> Dấu ngoặc nhọn `{ }` là **bắt buộc** ngay cả đối với một câu lệnh duy nhất.

---

## Đối Sánh

```zymbol
điểm = 85
hạng = ?? điểm {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> hạng ¶              // → B
```

```zymbol
nhiệt_độ = -5
trạng_thái = ?? nhiệt_độ {
    < 0  => "băng"
    < 20 => "lạnh"
    _    => "nóng"
}
>> trạng_thái ¶              // → băng
```

Bạn đã biết `?` là "hỏi". **`??` là hỏi nhiều lần**: nhân đôi một ký hiệu, ở bất kỳ đâu trong ngôn ngữ, là thực hiện nhiều lần những gì ký hiệu làm một lần. Một `?` kiểm tra một điều kiện; `??` kiểm tra với một danh sách các trường hợp.

Các lựa chọn thay thế kết hợp với `||` và chúng có thể trộn các loại mẫu:

```zymbol
phím = 'P'
hành_động = ?? phím {
    'p' || 'P' => "tạm dừng"
    < 0 || > 100 => "ngoài phạm vi"
    _ => "bỏ qua"
}
>> hành_động ¶             // → tạm dừng
```

---

## Vòng Lặp

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
trái_cây = ["táo", "lê", "nho"]
@ t:trái_cây { >> t " " }
>> ¶                    // → táo lê nho
@ k:"Xin chào" { >> k "-" }
>> ¶                    // → X-i-n- -c-h-à-o-
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
bộ_đếm = 0
@:bên_ngoài {
    bộ_đếm++
    ? bộ_đếm >= 3 { @:bên_ngoài! }
}
>> bộ_đếm ¶             // → 3
```

`@` là ký hiệu của **thời gian**: mọi thứ lặp lại đều sống trong đó. Để cắt ngắn thời gian đó, bạn thêm một ký hiệu bên cạnh nó:

- `@!` — `!` là **cưỡng chế**: rời khỏi vòng lặp ngay bây giờ.
- `@>` — `>` đẩy về phía trước: chuyển đến lượt tiếp theo.
- `@:bên_ngoài!` — `:` **ràng buộc một tên**, vì vậy điều này cắt vòng lặp *có tên* bên_ngoài, không phải vòng lặp gần nhất.

Ba toán tử và không có toán tử nào phải được ghi nhớ riêng biệt: chúng là `@` cộng với một ký hiệu đã nói lên những gì nó làm.

> **Một bộ chỉ định là một số đếm hoặc một điều kiện.** Một `Số nguyên` là một số đếm, được đánh giá một lần — `@ 0` chạy thân không lần nào. Mọi thứ khác là một điều kiện. Không có tính đúng đắn: `@ []` và `@ 3.5` bị từ chối. Để duyệt qua một tập hợp, hãy sử dụng `@ x:các_mục`; để đếm nó, `@ các_mục$#`.

---

## Hàm

```zymbol
cộng(a, b) { <~ a + b }
>> cộng(3, 4) ¶        // → 7
```

```zymbol
giai_thừa(n) {
    ? n <= 1 { <~ 1 }
    <~ n * giai_thừa(n - 1)
}
>> giai_thừa(5) ¶       // → 120
```

Một hàm đọc các biến của tệp theo giá trị và một thao tác ghi bên trong vẫn nằm bên trong:

```zymbol
giới_hạn = 100
bên_trong(n) { <~ n < giới_hạn }
>> bên_trong(42) ¶         // → #1
```

Hai ký hiệu thay đổi điều đó và cả hai đều được viết **trong chữ ký và tại vị trí gọi**:

```zymbol
tăng(bộ_đếm<~) { bộ_đếm = bộ_đếm + 1 }
tổng = 0
tăng(tổng<~)
>> tổng ¶              // → 1
```

> `p~` là một bản sao làm việc — thân có thể gán lại nó và người gọi không bị ảnh hưởng.
> `p<~` là một tham số đầu ra — sự thay đổi sẽ quay trở lại. `tăng(tổng)` không có ký hiệu là một lỗi ngữ nghĩa: chú thích và chữ ký không thể tách rời.

---

## Lambda và Bao Đóng

```zymbol
gấp_đôi = x -> x * 2
tổng = (a, b) -> a + b
>> gấp_đôi(5) ¶          // → 10
>> tổng(3, 7) ¶          // → 10
```

```zymbol
phân_loại = x -> {
    ? x > 0 { <~ "dương" }
    _? x < 0 { <~ "âm" }
    <~ "không"
}
>> phân_loại(-4) ¶         // → âm
```

```zymbol
hệ_số = 3
gấp_ba = x -> x * hệ_số
>> gấp_ba(7) ¶          // → 21
```

```zymbol
tạo_bộ_cộng(n) { <~ x -> x + n }
cộng10 = tạo_bộ_cộng(10)
>> cộng10(5) ¶           // → 15
```

Một lambda có thể không nhận tham số nào:

```zymbol
câu_trả_lời = () -> 42
>> câu_trả_lời() ¶           // → 42
```

> Một lambda nắm bắt các biến của tệp **khi nó được tạo**; một hàm có tên đọc chúng **khi nó được gọi**.

---

## Mảng

```zymbol
mảng = [1, 2, 3, 4, 5]
>> mảng[1] ¶       // → 1   chỉ mục bắt đầu từ 1
>> mảng[-1] ¶      // → 5   số âm đếm từ cuối
>> mảng$# ¶        // → 5   độ dài
```

```zymbol
mảng = [1, 2, 3]
>> (mảng$+ 6) ¶          // → [1, 2, 3, 6]   thêm vào
>> (mảng$+[2] 99) ¶      // → [1, 99, 2, 3]  chèn vào vị trí 2
>> (mảng$- 3) ¶          // → [1, 2]         xóa lần xuất hiện đầu tiên
>> (mảng$-[1]) ¶         // → [2, 3]         xóa tại chỉ mục 1
>> (mảng$[1..2]) ¶       // → [1, 2]         cắt lát, bao gồm cả hai đầu
>> (mảng$? 3) ¶          // → #1             chứa
```

Tất cả chúng đều bắt đầu bằng `$`, ký hiệu của **tập hợp** và tiếp tục với một ký hiệu cho biết những gì được thực hiện trong đó: `#` bao nhiêu, `+` thêm vào, `-` xóa, `?` hỏi xem có tồn tại không. Và như với `??`, nhân đôi ký hiệu có nghĩa là thực hiện nó một cách toàn diện: `$?` hỏi *liệu* một giá trị có tồn tại không, `$??` hỏi *ở bao nhiêu vị trí* và trả về tất cả chúng.

```zymbol
mảng = [3, 1, 2]
>> (mảng$^+) ¶     // → [1, 2, 3]   tăng dần
>> (mảng$^-) ¶     // → [3, 2, 1]   giảm dần
```

**Quy tắc của kết quả.** Một toán tử và những gì mã xung quanh làm với nó sẽ quyết định: được sử dụng, nó **xây dựng** và giữ nguyên bản gốc; bị loại bỏ, nó **sửa đổi**.

```zymbol
mảng = [1, 2, 3]
bản_sao = mảng[2]$~ 99
>> mảng ¶                // → [1, 2, 3]
>> bản_sao ¶              // → [1, 99, 3]
mảng[2]$~ 99
>> mảng ¶                // → [1, 99, 3]
```

> **`=` không bao giờ ghi vào một tập hợp.** `mảng[2] = 99` không phải là một dạng của Zymbol — `=` gán một giá trị cho một **TÊN**. Thay đổi một phần của tập hợp là `$~`, trong mọi tập hợp.

`[…]` chứa một kiểu và được kiểm tra; một hỗn hợp có chủ đích được **khai báo** với `#[…]`:

```zymbol
hỗn_hợp = #[1, "hai", #1]
>> hỗn_hợp ¶             // → [1, hai, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Lập Chỉ Mục Đa Chiều

`>` đi xuống một cấu trúc lồng nhau. Một nhóm dấu ngoặc vuông định vị một phần tử, dù sâu đến đâu.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   hàng 2, cột 3
>> m[-1>-1] ¶      // → 9   hàng cuối cùng, cột cuối cùng
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          phẳng: đường chéo
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   có cấu trúc: các góc
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **không phải** là một dạng của Zymbol. Chỉ mục được xâu chuỗi bị từ chối cho cả đọc và viết — một nhóm dấu ngoặc cho mỗi lần truy cập và `>` là thứ nằm giữa các bước.

---

## Từ Điển

Một bộ có các trường được đặt tên là một từ điển và từ v0.0.9, nó được viết `#(…)`.

```zymbol
người = #(tên: "An", tuổi: 25)
>> người.tên ¶        // → An
>> người["tuổi"] ¶    // → 25
```

```zymbol
người = #(tên: "An", tuổi: 25)
trường = "tên"
>> người[trường] ¶     // → An
```

Nó có thể thay đổi, các khóa có thể được thêm vào và có thể được duyệt qua:

```zymbol
kho = #(lê: 4)
kho["táo"]$~ 10
@ k:kho { >> k "=" kho[k] " " }
>> ¶                    // → lê=4 táo=10
```

```zymbol
kho = #(lê: 4, táo: 10)
@ (k, v):kho { >> k ":" v " " }
>> ¶                    // → lê:4 táo:10
```

> `#()` là từ điển rỗng, điều mà `()` không thể là — nó sẽ phải là bộ rỗng. Dạng trần `(x: 1)` bị từ chối với thông báo này: *a dictionary is written `#(…)`* — «một từ điển được viết `#(…)`».
> Một từ điển được định vị theo khóa, không bao giờ theo vị trí, vì vậy `người[1]` là một lỗi.

---

## Bộ

Các bộ là các vùng chứa có thứ tự **bất biến** chứa các giá trị thuộc các kiểu khác nhau.

```zymbol
điểm = (10, 20)
>> điểm[1] ¶           // → 10
dữ_liệu = (42, "Xin chào", #1, 3.14)
>> dữ_liệu[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Bất kỳ nỗ lực nào để sửa đổi một bộ tại chỗ đều là một lỗi, bất kể toán tử là gì — tính bất biến là một thuộc tính của giá trị, không phải là một ngoại lệ bên trong mỗi `$`.

---

## Giải Cấu Trúc

```zymbol
mảng = [10, 20, 30, 40, 50]
[a, b, c] = mảng
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
mảng = [10, 20, 30, 40, 50]
[đầu, *còn_lại] = mảng
>> đầu ¶            // → 10
>> còn_lại ¶              // → [20, 30, 40, 50]
```

```zymbol
điểm = (100, 200)
(px, py) = điểm
>> px " " py ¶          // → 100 200
```

```zymbol
người = #(tên: "Bình", tuổi: 25)
#(tên: t, tuổi: u) = người
>> t " " u ¶            // → Bình 25
```

> Hình dạng của dấu ngoặc được phân loại: `[…]` lấy một mảng, `(…)` một bộ, `#(…)` một từ điển. Tên cuối cùng **hấp thụ phần còn lại**, vì vậy việc giải cấu trúc không bao giờ thất bại về độ dài — `(a, b, c) = (1,2,3,4,5)` cho `c = (3,4,5)` và `##_` khi không còn gì.

---

## Hàm Bậc Cao

```zymbol
các_số = [1, 2, 3, 4, 5]
>> (các_số$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (các_số$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (các_số$< (0, (tích_lũy, x) -> tích_lũy + x)) ¶ // → 15
```

```zymbol
các_số = [1, 2, 3, 4, 5, 6]
gấp_đôi(x) { <~ x * 2 }
lớn(x) { <~ x > 3 }
>> (các_số$> gấp_đôi) ¶    // → [2, 4, 6, 8, 10, 12]
>> (các_số$| lớn) ¶    // → [4, 5, 6]
```

```zymbol
cơ_sở = [#(tên: "Carla", tuổi: 28), #(tên: "Bình", tuổi: 25)]
theo_tuổi = cơ_sở$^ (a, b -> a.tuổi < b.tuổi)
>> theo_tuổi[1].tên ¶     // → Bình
```

> Một hàm có tên đi đến HOF **không có dấu ngoặc đơn**: `các_số$> gấp_đôi`. Viết `các_số$> (gấp_đôi)` là một lỗi phân tích cú pháp, vì `(` mở một lambda.

---

## Toán Tử Đường Ống

```zymbol
gấp_đôi = x -> x * 2
cộng = (a, b) -> a + b
tăng = x -> x + 1
>> (5 |> gấp_đôi(_)) ¶    // → 10
>> (10 |> cộng(_, 5)) ¶  // → 15
>> (5 |> gấp_đôi(_) |> tăng(_)) ¶ // → 11
```

---

## Xử Lý Lỗi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "chia cho không" ¶  // → chia cho không
} :! {
    >> "khác: " _err ¶
} :> {
    >> "luôn chạy" ¶        // → luôn chạy
}
```

| Loại | Khi nào |
|------|---------|
| `##Div` | Chia cho không |
| `##Index` | Chỉ mục ngoài phạm vi |
| `##Key` | Khóa không có trong từ điển |
| `##Range` | Ngoài phạm vi số nguyên an toàn |
| `##Type` | Không khớp kiểu |
| `##Parse` | Phân tích cú pháp dữ liệu |
| `##IO` | Tệp / hệ thống |
| `##Network` | Lỗi mạng |
| `##DB` | Cơ sở dữ liệu |
| `##Time` | Một ngày không tồn tại |
| `##_` | Bất kỳ lỗi nào (bắt tất cả) |

`!` là ký hiệu của **lỗi và cưỡng chế** và nó được đọc giống nhau trong cả hai họ: `$!` hỏi một giá trị xem nó có phải là lỗi không; `$!!`, với ký hiệu được nhân đôi, sẽ truyền nó lên trên mà không hỏi.

> Các lỗi của thư viện chuẩn trả về dưới dạng **giá trị lỗi mềm** mà bạn kiểm tra bằng `$!` hoặc bắt bằng `!?`, thay vì hủy bỏ. `$!!` truyền một lỗi đến người gọi.

---

## Mô-đun

```zymbol
# máy_tính {
    #> { cộng, PI }

    PI := 3.14159
    cộng(a, b) { <~ a + b }
}
```

```zymbol
<# ./máy_tính => mt

>> mt::cộng(5, 3) ¶
>> mt.PI ¶
```

```zymbol
# thư_viện_của_tôi {
    #> { cộng_bên_trong => tổng }

    cộng_bên_trong(a, b) { <~ a + b }
}
```

Hai ký hiệu mô-đun là cùng một ý tưởng, bây giờ được áp dụng cho các tệp: `#` là cấp độ của **khai báo** — một thứ *là gì*, không phải giá trị của nó — và mũi tên cho biết mã di chuyển theo hướng nào:

```text
<#   mũi tên đi vào: nhập khẩu, mang từ tệp khác
#>   mũi tên đi ra: xuất khẩu, cung cấp cho các tệp khác
```

Một ký hiệu hướng luôn nằm ở cạnh hướng về phía nó chỉ. Đó là lý do tương tự tại sao `<~` trở về bên trái (ra khỏi hàm) và `->` đi vào bên phải (vào thân của lambda).

> **Một mô-đun khai báo những gì nó xuất khẩu.** Khối `#>` là bắt buộc — bỏ qua nó là **E014** và `#> { }` là cách một mô-đun nói rằng bề mặt của nó trống. `::` gọi một hàm, `.` đọc một hằng số. Chỉ các nhập khẩu, khối xuất khẩu, bộ khởi tạo theo nghĩa đen và định nghĩa hàm mới có thể xuất hiện trong thân mô-đun; bất cứ thứ gì có thể thực thi đều là **E013**.

---

## Thư Viện Chuẩn

Các mô-đun gốc, được nhập khẩu như bất kỳ mô-đun nào khác:

| Mô-đun | Hàm |
|--------|------|
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

>> t::width("手番") ¶            // → 4   hai ký tự, bốn cột
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

ngày = T::of(2026, 1, 31)
>> T::format(ngày, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(ngày, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` đo **cột hiển thị**, không phải ký tự: CJK và hầu hết biểu tượng cảm xúc là 2 cột, vì vậy hãy bố trí một bảng với `t::width`, không bao giờ dùng `$#`.
> Trong `std/time`, một thời điểm tính bằng mili giây kể từ kỷ nguyên. Dưới một ngày là khoảng thời gian, từ một ngày trở lên là lịch — vì vậy một tháng rơi vào cùng ngày trong tháng, được kẹp. `chênh_lệch(a, b)` là `a - b`, vì vậy thời điểm sớm hơn trước sẽ cho câu trả lời âm.

---

## Gói

Một `.zyp` gói một chương trình nhiều tệp thành một tệp di động duy nhất. Nó là một kho lưu trữ **mã nguồn**, không phải nhị phân, vì vậy nó chạy ở bất kỳ đâu có tệp nhị phân `zymbol`.

```bash
zymbol package dự_án_của_tôi/ --script main.zy -o dự_án_của_tôi.zyp
zymbol run dự_án_của_tôi.zyp
```

> Kho lưu trữ mang theo một tệp kê khai (`zyp.toml`) khai báo các tập lệnh đầu vào và phiên bản công cụ mà nó cần. `zymbol run` giải nén nó vào một thư mục tạm thời và chạy từ đó, vì vậy mã có thể dùng một lần trong khi những gì tập lệnh ghi sẽ rơi vào thư mục làm việc thực tế của bạn. Sân chơi cũng tải các tệp `.zyp`.

---

## Các Chế Độ Số

Zymbol có thể viết số trong **69 hệ thống chữ số Unicode** — Devanagari, Ả Rập-Ấn Độ, Thái Lan, Klingon pIqaD, In đậm Toán học, các đoạn LCD, v.v. Chế độ này là toàn cục cho quá trình và ảnh hưởng đến đầu ra; phép tính số học không thay đổi.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Ả Rập-Ấn Độ (U+0660–U+0669)
#๐๙#    // Thái Lan     (U+0E50–U+0E59)
#09#    // đặt lại về ASCII
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

Các chữ số từ bất kỳ hệ thống chữ viết nào được hỗ trợ đều là giá trị văn bản hợp lệ trong mã nguồn:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Việc đọc là đối xứng — một chữ số được hiểu trong bất kỳ hệ thống chữ viết nào:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` luôn là ASCII, vì vậy `#0` vẫn khác biệt trực quan với chữ số 0 trong mọi hệ thống chữ viết.
> `#,` và `#^` cũng viết các chữ số của chúng trong hệ thống chữ viết đang hoạt động và các dấu phân cách theo sau nó — nhưng cặp không bao giờ đảo ngược: `,` nhóm và `.` phân tách, trong mọi hệ thống chữ viết.

---

## Các Toán Tử Dữ Liệu

```zymbol
f = ##.42         // chuyển sang Số thực
i = ###3.7        // chuyển sang Số nguyên, làm tròn  → 4
t = ##!3.7        // chuyển sang Số nguyên, cắt bỏ  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Một Số thực được in dưới dạng chữ số, không bao giờ là số mũ và loại bỏ `.0` ở cuối — `##.42` viết `42` và vẫn là Số thực, như `f#?` cho thấy.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   an toàn: trả lại đầu vào không thay đổi
>> ##!'A' ¶        // → 65    điểm mã của một Ký tự
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          làm tròn đến 2 chữ số thập phân
>> #!2|pi| ¶       // → 3.14          cắt bỏ đến 2 chữ số thập phân
>> #,|1234567| ¶   // → 1,234,567     dấu phân cách hàng nghìn
>> #^|12345.678| ¶ // → 1.2345678e4   ký hiệu khoa học
```

```zymbol
>> 0x41 ¶        // → A   thập lục phân
>> 0b01000001 ¶  // → A   nhị phân
>> 0o101 ¶       // → A   bát phân
>> 0d65 ¶        // → A   thập phân
```

> Một giá trị văn bản cơ số trong phạm vi ASCII là một **Ký tự**: `0d65 == 'A'` là `#1` và `0d65 == 65` là `#0`. Cả bốn cơ số đều đánh vần cùng một ký tự.

---

## Tích Hợp Shell

```zymbol
hôm_nay = <\ date +%Y-%m-%d \>
>> "Hôm nay: " hôm_nay
```

```zymbol
đầu_ra = </"./tập_lệnh_con.zy"/>
>> đầu_ra
```

> `<\ … \>` thu thập stdout và stderr, loại bỏ dòng mới ở cuối.
> `>< đối_số` thu thập các đối số dòng lệnh dưới dạng một mảng chuỗi.

---

## Ví Dụ Đầy Đủ: FizzBuzz

```zymbol
phân_loại(số) {
    ? số % 15 == 0 { <~ "FizzBuzz" }
    _? số % 3  == 0 { <~ "Fizz" }
    _? số % 5  == 0 { <~ "Buzz" }
    <~ số
}

@ i:1..20 { >> phân_loại(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (mỗi dòng một)
```

---

## Các Ký Hiệu Kết Hợp Như Thế Nào

Bạn đã thấy điều tương tự trong toàn bộ sách hướng dẫn này: **một toán tử không phải là một hình vẽ để ghi nhớ, mà là một số ký hiệu trong một hàng và mỗi ký hiệu đóng góp ý nghĩa của nó.** Bây giờ bạn đã biết tất cả chúng, đây là mô hình hoàn chỉnh.

Đầu tiên đến **chúng ta đang ở thế giới nào**:

| Ký hiệu | Thế giới | Bạn đã thấy nó trong |
|---------|----------|---------------------|
| `$` | một tập hợp | `$#` `$+` `$?` `$^-` |
| `@` | thời gian, bất cứ thứ gì lặp lại | `@!` `@>` `@~` |
| `#` | một thứ *là gì*, không phải giá trị của nó | `#?` `#(…)` `<#` `#>` |
| `>>` | ra khỏi chương trình | `>>` `>>!` `>>?` |
| `<<` | vào chương trình | `<<` `<<\|` `<<\|?` |
| `?` | hỏi, không cam kết | `?` `_?` `??` `$?` |
| `!` | cưỡng chế, hoặc lỗi | `@!` `$!` `!?` |

Sau đó đến **những gì được thực hiện ở đó**: `+` thêm, `-` xóa, `^` sắp xếp, `~` sửa đổi, `#` đếm, `|` một đơn vị duy nhất, `:` ràng buộc tên.

Và hai quy tắc không bao giờ thất bại:

**Nhân đôi một ký hiệu làm cho nó trở nên toàn diện.** `?` hỏi một lần, `??` kiểm tra nhiều trường hợp. `$?` hỏi liệu một giá trị có tồn tại không, `$??` trả về mọi vị trí mà nó có. `!` đánh dấu một lỗi, `!!` truyền nó mà không hỏi.

**Ký hiệu chế độ luôn xuất hiện cuối cùng.** Khi `?` hoặc `!` xuất hiện để nói *cách* một cái gì đó được thực hiện — một cách do dự hoặc cưỡng chế — chúng là ký hiệu cuối cùng của toán tử: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:bên_ngoài!`. Không bao giờ có một phép toán sau chúng.

Một điều thực tế xuất phát từ đó: **một sự kết hợp mà bạn chưa từng thấy đã có ý nghĩa trước khi bạn tra cứu nó.** Nếu `$` là tập hợp và `^` là thứ tự và `-` là đảo ngược, thì `$^-` sắp xếp giảm dần và không ai phải nói với bạn.

Không phải toàn bộ kho công cụ hoạt động theo cách này và nói ra điều đó tốt hơn là giả vờ. Hầu hết các toán tử phân tách một cách rõ ràng. Sáu toán tử phân tách nhưng có nghĩa nhiều hơn các phần của chúng: `!?` `:!` `:>` `|>` `::` `$++`. Và mười toán tử phải được ghi nhớ vì chúng hoàn toàn không phân tách: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Việc đếm các toán tử mờ đục thay vì cho rằng chúng ít là có chủ đích: chúng là chi phí ghi nhớ thực sự của ngôn ngữ. Tài liệu tham khảo đầy đủ — kho công cụ, các từ đồng âm đã khai báo và các quy tắc mà một toán tử mới phải thỏa mãn để tồn tại — nằm trong `SYMBOLS.md`, trong kho lưu trữ trình thông dịch.

---

## Tham Chiếu Ký Hiệu

| Ký hiệu | Thao tác | Ký hiệu | Thao tác |
|---------|----------|---------|----------|
| `=` | biến | `$#` | độ dài |
| `:=` | hằng số | `$+` | thêm |
| `>>` | đầu ra | `$+[i]` | chèn tại chỉ mục (bắt đầu từ 1) |
| `<<` | đầu vào | `$-` | xóa lần đầu theo giá trị |
| `¶` / `\\` | dòng mới | `$--` | xóa tất cả theo giá trị |
| `?` | nếu | `$-[i]` | xóa tại chỉ mục (bắt đầu từ 1) |
| `_?` | nếu không thì-nếu | `$-[i..j]` | xóa phạm vi (bắt đầu từ 1) |
| `_` | nếu không thì / đại diện | `$?` | chứa |
| `??` | đối sánh | `$??` | tìm tất cả chỉ mục (bắt đầu từ 1) |
| `\|\|` | mẫu hoặc trong nhánh đối sánh | `$[s..e]` | cắt lát (bắt đầu từ 1) |
| `@` | vòng lặp | `$>` | ánh xạ |
| `@ N { }` | vòng lặp N lần | `$\|` | lọc |
| `@!` | ngắt | `$<` | rút gọn |
| `@>` | tiếp tục | `$/ dấu_phân_cách` | chia chuỗi |
| `@:tên { }` | vòng lặp có nhãn | `$++ a b c` | xây dựng bằng cách nối |
| `@:tên!` | ngắt nhãn | `$~~[p:r]` | thay thế chuỗi |
| `@:tên>` | tiếp tục nhãn | `$*` | lặp lại chuỗi |
| `->` | lambda | `mảng[i]$~ v` | HÌNH THỨC cập nhật DUY NHẤT |
| `<~` | trả về / tham số đầu ra | `~` | tham số bản sao làm việc |
| `mảng[i>j]` | chỉ mục điều hướng | `mảng[p ; q]` | trích xuất phẳng |
| `$^+` | sắp xếp tăng dần | `$^-` | sắp xếp giảm dần |
| `$^` | sắp xếp với bộ so sánh | `\|>` | đường ống |
| `!?` | thử | `:!` | bắt |
| `:>` | cuối cùng | `$!` | có phải lỗi không |
| `$!!` | truyền lỗi | `#1` / `#0` | đúng / sai |
| `##_` | Đơn vị — sự vắng mặt | `[…]` | mảng, một kiểu |
| `#[…]` | mảng, hỗn hợp đã khai báo | `#(…)` | từ điển |
| `(…)` | bộ theo vị trí | `#()` | từ điển rỗng |
| `<#` | nhập khẩu | `#>` | xuất khẩu |
| `#` | khai báo mô-đun | `::` | gọi mô-đun |
| `.` | truy cập trường / hằng số | `#?` | siêu dữ liệu kiểu |
| `#\|..\|` | phân tích số | `##.` | chuyển sang Số thực |
| `###` | chuyển sang Số nguyên (làm tròn) | `##!` | chuyển sang Số nguyên (cắt bỏ) |
| `#.N\|..\|` | làm tròn | `#!N\|..\|` | cắt bỏ |
| `#,\|..\|` | dấu phân cách hàng nghìn | `#^\|..\|` | khoa học |
| `#d0d9#` | chuyển đổi chế độ số | `#09#` | đặt lại về ASCII |
| `<\ ..\>` | chạy shell | `><` | đối số CLI |
| `\ var` | hủy biến | `°x` / `x°` | định nghĩa nóng |
| `>>\|` | khối TUI (màn hình thay thế) | `>>~` | đầu ra được định vị |
| `>>!` | xóa màn hình | `>>?` | truy vấn kích thước thiết bị đầu cuối |
| `<<\|` | nhấn phím chặn | `<<\|?` | nhấn phím không chặn |
| `@~ N` | ngủ N mili giây | `0d` `0x` `0o` `0b` | giá trị văn bản cơ số |

---

## Lịch Sử Thay Đổi Phiên Bản

### v0.0.9 — Các Tập Hợp Quyết Định _(Tháng 9 năm 2026)_

- **Thay đổi phá vỡ** Từ điển có ký hiệu riêng: `#(khóa: giá_trị)`. Dạng trần `(x: 1)` bị từ chối và `#()` là từ điển rỗng — điều mà `()` không bao giờ có thể là
- **Thay đổi phá vỡ** Gán theo chỉ mục bị loại bỏ: `mảng[i] = v` và tất cả các dạng kết hợp. `=` gán giá trị cho một **TÊN**; thay đổi một phần của tập hợp là `$~`
- **Thay đổi phá vỡ** Chỉ mục được xâu chuỗi `m[i][j]` bị từ chối cho cả đọc và viết — `>` là thứ nằm giữa các bước
- **Thay đổi phá vỡ** Một mô-đun phải khai báo những gì nó xuất khẩu (**E014**); `#> { }` là cách một mô-đun nói rằng bề mặt của nó trống
- **Thay đổi phá vỡ** Một bộ chỉ định vòng lặp là một số đếm hoặc một điều kiện — không có tính đúng đắn. `@ []` và `@ 3.5` bị từ chối
- **Đã thêm** `##_` — giá trị văn bản Đơn vị và cách chương trình hỏi liệu một thứ gì đó có vắng mặt không
- **Đã thêm** `#[…]` — một mảng có sự pha trộn của các kiểu phần tử được khai báo
- **Đã thêm** `#?` phân biệt bốn tập hợp: `##]` `##[` `##)` `##(`
- **Đã thêm** `std/time` — đồng hồ và lịch dân sự, với múi giờ và số học lịch
- **Đã thêm** `<~>` ở cấp cao nhất là trạng thái thoát của chương trình
- **Đã thêm** `@ (k, v):các_cặp` — một mẫu trong tiêu đề vòng lặp
- **Đã thêm** `#|c|` đọc một chữ số trong bất kỳ 69 hệ thống chữ viết nào; `#,` và `#^` viết chữ số của chúng trong hệ thống chữ viết đang hoạt động
- **Đã thay đổi** `Số nguyên` là một số nguyên an toàn, ±(2⁵³ − 1), đóng khi gặp lỗi trong mọi công cụ
- **Đã thay đổi** Một hàm có tên đọc các biến của tệp tại thời điểm gọi, theo giá trị
- **Đã thay đổi** Một câu lệnh chỉ đọc một tên sẽ cảnh báo thay vì lặng lẽ bỏ qua
- **Công cụ** 660 trong số 666 tệp kho văn bản đồng ý trên cả ba công cụ, 0 khác biệt

### v0.0.8 — Tự Giải Phóng, `std/term` và Gói _(Tháng 8 năm 2026)_

- **Đã thêm** Hủy tự động khi sử dụng lần cuối — vô hình; chỉ giảm bộ nhớ cao điểm
- **Đã thêm** `std/term` — số liệu hiển thị trong cột thiết bị đầu cuối
- **Đã thêm** `##!` trên một `Ký tự` — điểm mã Unicode của nó
- **Đã thêm** Mẫu hoặc trong đối sánh: `'p' || 'P' => …`, các lựa chọn thay thế thuộc bất kỳ loại nào trong một nhánh
- **Đã thêm** Gói Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Đã thêm** `<~>` tại vị trí gọi là bắt buộc nếu người được gọi khai báo một tham số đầu ra
- **Đã sửa** Tính tương đương của hệ thống mô-đun trong VM thanh ghi

### v0.0.7 — Thư Viện Chuẩn Gốc _(Tháng 7 năm 2026)_

- **Đã thêm** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — tất cả với giá trị lỗi mềm
- **Đã thêm** Đầu vào được đánh kiểu/xác thực: `<< ##.(5,2) "giá: " p`
- **Đã thêm** Các toán tử hậu tố trực tiếp trong `>>` — không cần dấu ngoặc đơn
- **Đã thay đổi** Trình định dạng đóng khi gặp lỗi: từ chối viết đầu ra mà nó không thể đọc lại

### v0.0.6 — Tinh Chỉnh và Thư Viện Khoa Học _(Tháng 6 năm 2026)_

- **Thay đổi phá vỡ** `=>` thay thế `:` trong các nhánh đối sánh và `<=` trong các bí danh nhập/xuất
- **Đã thêm** `std/math` và `std/random`
- **Đã thêm** Cập nhật từ điển theo khóa: `d["k"]$~ giá_trị`

### v0.0.5 — Các Nguyên Thủy TUI và Định Nghĩa Nóng _(Tháng 5 năm 2026)_

- **Đã thêm** Khối TUI `>>| { }`, đầu ra được định vị `>>~`, đầu vào phím `<<|` và `<<|?`
- **Đã thêm** `>>!` xóa màn hình, `>>?` kích thước thiết bị đầu cuối, `@~ N` ngủ
- **Đã thêm** Định nghĩa nóng `°x` / `x°` và lặp lại chuỗi `$*`

### v0.0.4 — Lập Chỉ Mục Bắt Đầu Từ 1 và Hàm Hạng Nhất _(Tháng 4 năm 2026)_

- **Thay đổi phá vỡ** Tất cả lập chỉ mục **bắt đầu từ 1** — `mảng[1]` là phần tử đầu tiên
- **Đã thêm** Các hàm có tên là giá trị hạng nhất; cú pháp khối mô-đun `# tên { }`
- **Đã thêm** Lập chỉ mục đa chiều `mảng[i>j>k]` và trích xuất phẳng `mảng[p ; q]`

### v0.0.3 — Hệ Thống Chữ Số Unicode _(Tháng 4 năm 2026)_

- **Đã thêm** 69 khối chữ số Unicode với mã thông báo chuyển đổi chế độ `#d0d9#`
- **Đã thêm** Giá trị văn bản boolean trong bất kỳ hệ thống chữ viết nào — `#१` / `#०`

### v0.0.2 — Thiết Kế Lại API Tập Hợp _(Tháng 3 năm 2026)_

- **Đã thêm** Họ toán tử `$` cho mảng và chuỗi
- **Đã thêm** Gán giải cấu trúc và chỉ mục âm

### v0.0.1 — Bản Phát Hành Công Khai Đầu Tiên _(Tháng 3 năm 2026)_

- Trình thông dịch duyệt cây + VM thanh ghi (`--vm`)
- Tất cả các cấu trúc cốt lõi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Định danh Unicode đầy đủ, hệ thống mô-đun, lambda, bao đóng, xử lý lỗi
- REPL, LSP, tiện ích mở rộng VS Code, trình định dạng (`zymbol fmt`)

---

_Zymbol-Lang — Mang Tính Biểu Tượng. Phổ Quát. Bất Biến._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Giấy phép:** sách hướng dẫn này được cấp phép theo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Văn bản đầy đủ: `LICENSE-CC-BY-SA-4.0` tại <https://github.com/zymbol-lang/web>. Trình thông dịch và công cụ trình duyệt (`zymbol.js`) là các tác phẩm riêng biệt, được cấp phép theo AGPL-3.0-only.
