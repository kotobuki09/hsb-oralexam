# Kế hoạch Thiết kế Hệ thống HSB3102E Oral Exam Studio
**Phong cách: Công cụ kỹ thuật dữ liệu chuyên nghiệp (Linear / Databricks / Workbench)**

---

### 1. Triệt tiêu hoàn toàn "AI Slop"
- **Loại bỏ banner gradient trang trí**: Xóa bỏ hoàn toàn thanh banner màu mè trên đầu màn hình và các icon lơ lửng không chức năng.
- **Tuân thủ quy tắc Không Pill tĩnh (Zero-Pill Discipline)**: Các thông số (bài học, nhóm câu, ngày tháng) được trình bày dạng văn bản tinh gọn với dấu phân cách typographic (`·`, `/`), không đóng hộp màu kẹo bóng bẩy.
- **Độ sâu phẳng chuẩn xác (Single-Elevation)**: Bề mặt phẳng, nền canvas sáng trung tính kết hợp viền tóc mảnh siêu nhỏ (`1px border border-slate-200/80`), không dùng đổ bóng dày hay bo tròn quá mức (`rounded-lg` chuẩn mực thay cho `rounded-3xl`).

---

### 2. Thiết kế Bàn làm việc Giảng viên (Instructor Workspace)
- **Top Bar chuẩn 3 vùng (Top Bar Contract)**:
  - Vùng 1: Tên hệ thống tinh gọn, một dòng duy nhất.
  - Vùng 2: Điều hướng dạng văn bản thanh lịch với hover tinh tế.
  - Vùng 3: Thao tác chính duy nhất (Nút mở màn hình chiếu sinh viên).
- **Phòng thi (Exam Desk)**:
  - Tách đôi rõ ràng: Cột trái hiển thị đề bài, ngữ cảnh dữ liệu và câu hỏi gợi mở; Cột phải là cụm đồng hồ tối giản và Bảng chấm Rubric ma trận.
  - Rubric chấm điểm: Dạng lưới ma trận phẳng, các nút điểm 0.25đ xếp hàng ngang trật tự, phản hồi nhấp chuột tức thì dưới 100ms.
  - Đồng hồ đếm giờ: Font số đơn cách (`font-mono tabular-nums`), thiết kế như đồng hồ đo kỹ thuật phòng lab, thanh thoát và trang trọng.

---

### 3. Tối ưu Typography & Bảng dữ liệu Kỹ thuật
- **Bộ đôi phông chữ chuẩn**:
  - Tiêu đề & Giao diện: `Plus Jakarta Sans` / `Inter` cấu trúc sắc nét.
  - Bảng dữ liệu, câu lệnh SQL & Điểm số: `IBM Plex Mono` / `font-mono tabular-nums`.
- **Trình bày SQL & Dữ liệu mẫu**:
  - Khung code tối màu xám đen (`#0f172a`), cú pháp sạch, viền sắc cạnh, dễ đọc ngay cả khi giảng viên nhìn nhanh trong phòng thi.
