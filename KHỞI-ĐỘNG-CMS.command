#!/bin/bash
# =====================================================
#  BIG BOSS CMS - Nhấp đúp file này để khởi động
# =====================================================
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "======================================"
echo "   Đang khởi động Big Boss CMS..."
echo "======================================"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "⚠️  Chưa cài Node.js!"
  echo "   Hãy tải và cài tại: https://nodejs.org (bản LTS)"
  echo "   Sau đó nhấp đúp lại file này."
  echo ""
  read -p "Nhấn Enter để đóng..."
  exit 1
fi

echo "→ Website:  http://localhost:3000"
echo "→ Quản trị: http://localhost:3000/admin"
echo "  (Tài khoản: admin  |  Mật khẩu: bigboss@2026)"
echo ""
echo "Giữ cửa sổ này mở khi đang dùng. Đóng cửa sổ để tắt máy chủ."
echo ""
node cms/server.js
