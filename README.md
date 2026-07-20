# Big Boss — Website + CMS

Website giới thiệu công ty thuốc thú y Big Boss, kèm hệ thống quản trị (CMS) riêng viết bằng **Node.js thuần** (không cần cài thêm thư viện).

## 🚀 Cách chạy

### Cách 1 — Nhấp đúp (dễ nhất)
Nhấp đúp file **`KHỞI-ĐỘNG-CMS.command`**.
> Lần đầu macOS có thể chặn: chuột phải → **Mở** → **Mở**.

### Cách 2 — Dùng Terminal
```bash
cd "đường/dẫn/tới/BIGBOSS"
node cms/server.js
```

Sau khi chạy, mở trình duyệt:
- 🌐 **Website:** http://localhost:3000
- 🔐 **Quản trị (CMS):** http://localhost:3000/admin

**Đăng nhập CMS:**
- Tài khoản: `admin`
- Mật khẩu: `bigboss@2026`  *(nên đổi trong mục Cài đặt sau khi đăng nhập)*

> ⚠️ Cần cài **Node.js** (bản LTS) tại https://nodejs.org nếu máy chưa có.

## ✨ Tính năng CMS
- **Sửa logo** — tải logo mới, tự cập nhật trên toàn bộ website.
- **Quản lý sản phẩm** — thêm/sửa/xóa, ảnh, nhãn, thành phần, công dụng, cách dùng.
- **Quản lý danh mục sản phẩm** — thêm/sửa/xóa 8 nhóm.
- **Quản lý bài viết** — đăng/ẩn tin tức, ảnh bìa, nội dung.
- **Nhận mail** — form liên hệ trên web gửi thẳng vào hộp thư CMS.
- Đổi thông tin liên hệ, đổi mật khẩu quản trị.

## 📂 Cấu trúc
```
BIGBOSS/
├── index.html, san-pham.html, tin-tuc.html, lien-he.html …   (web công khai)
├── bai-viet.html, chi-tiet-san-pham.html                     (trang chi tiết)
├── assets/                (css, js, hình ảnh)
├── cms/
│   ├── server.js          (máy chủ + API)
│   ├── seed-data.js       (nội dung khởi tạo)
│   ├── lib/store.js       (lưu trữ)
│   └── admin/             (giao diện quản trị)
├── data/db.json           (cơ sở dữ liệu — tự tạo khi chạy)
└── uploads/               (logo & ảnh tải lên)
```

## 💾 Sao lưu
Toàn bộ dữ liệu nằm trong `data/db.json` và thư mục `uploads/`. Sao chép 2 mục này là sao lưu được toàn bộ.

## 🌍 Đưa lên internet (khi cần)
Deploy Node.js lên các dịch vụ như Render, Railway, VPS… (chạy `node cms/server.js`, mở cổng 3000 hoặc dùng biến môi trường `PORT`).
