/* ============================================================
   BIG BOSS - Tạo ảnh bìa (thumbnail) SVG cho các bài viết seed
   Chạy:  node cms/gen-thumbs.js
   ============================================================ */
const fs = require("fs");
const path = require("path");
const seed = require("./seed-data");

const OUT = path.join(__dirname, "..", "assets", "img", "news");
fs.mkdirSync(OUT, { recursive: true });

// Bảng màu gradient theo chuyên mục
const PALETTES = {
  "Nổi bật": ["#d99a1f", "#7a4f15"],
  "Sản phẩm": ["#e0a91d", "#9a6c12"],
  "Chăn nuôi": ["#3a9f5f", "#1c5e39"],
  "Kỹ thuật": ["#2a8fb0", "#155f75"],
  "Phòng bệnh": ["#c85a3a", "#7a3520"],
  "Thủy sản": ["#2aa6c8", "#14607f"],
  "Sự kiện": ["#8a5cb0", "#472e6e"],
  "Xu hướng": ["#4aa03a", "#245f1e"],
};
const FALLBACK = Object.values(PALETTES);

function pal(cat, i) { return PALETTES[cat] || FALLBACK[i % FALLBACK.length]; }
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function makeSvg(a, i) {
  const [c1, c2] = pal(a.cat, i);
  const chipW = a.cat.length * 17 + 46;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="'Be Vietnam Pro',Segoe UI,sans-serif">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.2" r="0.8">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <rect width="800" height="500" fill="url(#glow)"/>
  <circle cx="660" cy="90" r="170" fill="#ffffff" opacity="0.08"/>
  <circle cx="120" cy="440" r="130" fill="#ffffff" opacity="0.06"/>
  <circle cx="720" cy="430" r="70" fill="#ffffff" opacity="0.05"/>
  <text x="400" y="315" font-size="210" text-anchor="middle">${a.emoji}</text>
  <rect x="44" y="44" rx="22" ry="22" width="${chipW}" height="44" fill="#000000" opacity="0.22"/>
  <text x="${44 + chipW / 2}" y="73" font-size="21" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">${esc(a.cat.toUpperCase())}</text>
  <text x="758" y="466" font-size="25" font-weight="800" fill="#ffffff" opacity="0.85" text-anchor="end" letter-spacing="1">👑 BIG BOSS</text>
</svg>`;
}

let n = 0;
seed.ARTICLES.forEach((a, i) => {
  fs.writeFileSync(path.join(OUT, "news-" + a.id + ".svg"), makeSvg(a, i), "utf8");
  n++;
});
console.log("→ Đã tạo " + n + " ảnh bìa tại assets/img/news/");

// Cập nhật ảnh cho db.json hiện có (nếu đã chạy CMS)
const dbPath = path.join(__dirname, "..", "data", "db.json");
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  let patched = 0;
  db.articles.forEach((a) => {
    if (!a.image) { a.image = "assets/img/news/news-" + a.id + ".svg"; patched++; }
  });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
  console.log("→ Đã gán ảnh cho " + patched + " bài viết trong data/db.json");
}
