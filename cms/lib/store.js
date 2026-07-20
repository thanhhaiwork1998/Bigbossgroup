/* ============================================================
   BIG BOSS CMS - Kho dữ liệu JSON đơn giản
   ============================================================ */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const seed = require("../seed-data");

const DB_PATH = path.join(__dirname, "..", "..", "data", "db.json");

function hashPassword(password, salt) {
  return crypto.createHash("sha256").update(salt + ":" + password).digest("hex");
}

function defaultDb() {
  const salt = crypto.randomBytes(8).toString("hex");
  return {
    settings: {
      ...seed.SETTINGS,
      adminUser: "admin",
      adminSalt: salt,
      // Mật khẩu mặc định: bigboss@2026
      adminPass: hashPassword("bigboss@2026", salt),
    },
    categories: seed.CATEGORIES.map((c) => ({ ...c })),
    products: seed.PRODUCTS.map((p) => ({ ...p, createdAt: Date.now() })),
    articles: seed.ARTICLES.map((a) => ({ ...a, image: a.image || ("assets/img/news/news-" + a.id + ".svg"), createdAt: Date.now() })),
    messages: [],
    traffic: { total: 0, daily: {}, pages: {} },
    counters: {
      category: seed.CATEGORIES.length,
      product: seed.PRODUCTS.length,
      article: seed.ARTICLES.length,
      message: 0,
    },
  };
}

let db = null;

function load() {
  if (db) return db;
  try {
    if (fs.existsSync(DB_PATH)) {
      db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } else {
      db = defaultDb();
      save();
      console.log("→ Đã tạo cơ sở dữ liệu mới tại data/db.json");
    }
  } catch (e) {
    console.error("Lỗi đọc db.json, tạo mới:", e.message);
    db = defaultDb();
    save();
  }
  return db;
}

let saveTimer = null;
function save() {
  if (!db) return;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function nextId(kind) {
  const d = load();
  d.counters[kind] = (d.counters[kind] || 0) + 1;
  return d.counters[kind];
}

module.exports = { load, save, nextId, hashPassword };
