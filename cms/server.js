/* ============================================================
   BIG BOSS CMS - Máy chủ (Node.js thuần, không cần npm install)
   Chạy:  node cms/server.js
   Web:   http://localhost:3000
   Admin: http://localhost:3000/admin   (admin / bigboss@2026)
   ============================================================ */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");
const store = require("./lib/store");

const PORT = process.env.PORT || 3000;
const BASE_DIR = path.join(__dirname, "..");
const UPLOADS_DIR = path.join(BASE_DIR, "uploads");
const ADMIN_DIR = path.join(__dirname, "admin");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
};

/* ---------- Tokens (phiên đăng nhập, lưu trong RAM) ---------- */
const tokens = new Map(); // token -> expiry(ms)
const TOKEN_TTL = 7 * 24 * 3600 * 1000;
function newToken() {
  const t = crypto.randomBytes(24).toString("hex");
  tokens.set(t, Date.now() + TOKEN_TTL);
  return t;
}
function validToken(req) {
  const h = req.headers["authorization"] || "";
  const t = h.replace(/^Bearer\s+/i, "").trim();
  if (!t || !tokens.has(t)) return false;
  if (tokens.get(t) < Date.now()) { tokens.delete(t); return false; }
  return true;
}

/* ---------- Helpers ---------- */
function json(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 12 * 1024 * 1024) req.destroy(); });
    req.on("end", () => { try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); } });
    req.on("error", () => resolve({}));
  });
}
function publicSettings(s) {
  return { logo: s.logo, siteName: s.siteName, hotline: s.hotline, email: s.email, address: s.address };
}
function saveDataUrl(dataUrl, prefix) {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || "");
  if (!m) return "";
  const ext = { "image/png": ".png", "image/jpeg": ".jpg", "image/gif": ".gif", "image/webp": ".webp", "image/svg+xml": ".svg" }[m[1]] || ".png";
  const name = prefix + "-" + Date.now() + "-" + crypto.randomBytes(3).toString("hex") + ext;
  fs.writeFileSync(path.join(UPLOADS_DIR, name), Buffer.from(m[2], "base64"));
  return "/uploads/" + name;
}
// Nếu là data URL thì lưu thành file rồi trả path; nếu đã là path/url thì giữ nguyên.
function resolveImage(val, prefix) {
  if (typeof val === "string" && val.startsWith("data:image/")) return saveDataUrl(val, prefix);
  return val || "";
}

/* ---------- Traffic (đo lượt truy cập) ---------- */
function ensureTraffic(db) {
  if (!db.traffic) db.traffic = { total: 0, daily: {}, pages: {} };
  if (!db.traffic.daily) db.traffic.daily = {};
  if (!db.traffic.pages) db.traffic.pages = {};
  return db.traffic;
}
function localDate(d = new Date()) {
  const o = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return o.toISOString().slice(0, 10);
}
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => { saveTimer = null; store.save(); }, 1500);
}

/* ---------- Static file ---------- */
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404 - Không tìm thấy</h1>");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(buf);
  });
}
function safeJoin(root, target) {
  const p = path.normalize(path.join(root, target));
  if (!p.startsWith(root)) return null; // chặn path traversal
  return p;
}

/* ============================================================
   SERVER
   ============================================================ */
const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const method = req.method.toUpperCase();
  const db = store.load();

  if (method === "OPTIONS") return json(res, 204, {});

  try {
    /* ---------------- API ---------------- */
    if (pathname.startsWith("/api/")) {
      const seg = pathname.split("/").filter(Boolean); // ['api', ...]

      /* ----- Auth ----- */
      if (pathname === "/api/login" && method === "POST") {
        const b = await readBody(req);
        const s = db.settings;
        const ok = b.user === s.adminUser && store.hashPassword(b.pass || "", s.adminSalt) === s.adminPass;
        if (!ok) return json(res, 401, { error: "Sai tài khoản hoặc mật khẩu" });
        return json(res, 200, { token: newToken(), user: s.adminUser });
      }
      if (pathname === "/api/logout" && method === "POST") {
        const h = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "").trim();
        tokens.delete(h);
        return json(res, 200, { ok: true });
      }

      /* ----- Public reads ----- */
      if (pathname === "/api/settings" && method === "GET")
        return json(res, 200, publicSettings(db.settings));
      if (pathname === "/api/categories" && method === "GET")
        return json(res, 200, db.categories.slice().sort((a, b) => a.sort - b.sort));
      if (pathname === "/api/products" && method === "GET") {
        const cat = parsed.searchParams.get("category");
        let list = db.products.slice();
        if (cat) list = list.filter((p) => p.categoryKey === cat);
        return json(res, 200, list);
      }
      if (seg[0] === "api" && seg[1] === "products" && seg[2] && method === "GET") {
        const p = db.products.find((x) => x.id === +seg[2]);
        return p ? json(res, 200, p) : json(res, 404, { error: "Không tìm thấy sản phẩm" });
      }
      if (pathname === "/api/articles" && method === "GET") {
        const list = db.articles.filter((a) => a.published !== false)
          .slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        return json(res, 200, list);
      }
      if (seg[0] === "api" && seg[1] === "articles" && seg[2] && method === "GET") {
        const a = db.articles.find((x) => x.id === +seg[2]);
        return a ? json(res, 200, a) : json(res, 404, { error: "Không tìm thấy bài viết" });
      }
      if (pathname === "/api/track" && method === "POST") {
        const b = await readBody(req);
        let p = String(b.path || "/").split("?")[0].split("#")[0].slice(0, 120) || "/";
        if (p.startsWith("/admin") || p.startsWith("/api")) return json(res, 200, { ok: true });
        const vid = String(b.vid || "").slice(0, 40);
        const t = ensureTraffic(db);
        const date = localDate();
        t.total = (t.total || 0) + 1;
        t.pages[p] = (t.pages[p] || 0) + 1;
        let d = t.daily[date];
        if (!d) { d = { v: 0, u: {} }; t.daily[date] = d; }
        d.v++;
        if (vid && !d.u[vid]) d.u[vid] = 1;
        // Giữ tối đa 60 ngày gần nhất
        const keys = Object.keys(t.daily).sort();
        while (keys.length > 60) delete t.daily[keys.shift()];
        scheduleSave();
        return json(res, 200, { ok: true });
      }
      if (pathname === "/api/contact" && method === "POST") {
        const b = await readBody(req);
        if (!b.name || !b.content) return json(res, 400, { error: "Thiếu thông tin" });
        const msg = {
          id: store.nextId("message"),
          name: String(b.name).slice(0, 120), phone: String(b.phone || "").slice(0, 40),
          email: String(b.email || "").slice(0, 120), subject: String(b.subject || "").slice(0, 120),
          content: String(b.content).slice(0, 4000), isRead: false, createdAt: Date.now(),
        };
        db.messages.unshift(msg);
        store.save();
        return json(res, 200, { ok: true });
      }

      /* ----- Admin (yêu cầu đăng nhập) ----- */
      if (pathname.startsWith("/api/admin/")) {
        if (!validToken(req)) return json(res, 401, { error: "Chưa đăng nhập" });

        if (pathname === "/api/admin/overview" && method === "GET") {
          return json(res, 200, {
            products: db.products.length, categories: db.categories.length,
            articles: db.articles.length, messages: db.messages.length,
            unread: db.messages.filter((m) => !m.isRead).length,
          });
        }

        if (pathname === "/api/admin/traffic" && method === "GET") {
          const t = ensureTraffic(db);
          const series = [];
          for (let i = 13; i >= 0; i--) {
            const dt = new Date(); dt.setDate(dt.getDate() - i);
            const key = localDate(dt);
            const e = t.daily[key] || { v: 0, u: {} };
            series.push({ date: key, views: e.v || 0, visitors: Object.keys(e.u || {}).length });
          }
          const todayKey = localDate();
          const te = t.daily[todayKey] || { v: 0, u: {} };
          const week = series.slice(-7).reduce((a, x) => a + x.views, 0);
          const weekVisitors = series.slice(-7).reduce((a, x) => a + x.visitors, 0);
          const topPages = Object.entries(t.pages).sort((a, b) => b[1] - a[1]).slice(0, 6)
            .map(([path, views]) => ({ path, views }));
          return json(res, 200, {
            total: t.total || 0,
            today: { views: te.v || 0, visitors: Object.keys(te.u || {}).length },
            week, weekVisitors, series, topPages,
          });
        }

        /* --- Categories --- */
        if (pathname === "/api/admin/categories" && method === "POST") {
          const b = await readBody(req);
          const c = {
            id: store.nextId("category"), name: b.name || "Danh mục", key: b.key || ("cat-" + Date.now()),
            icon: b.icon || "📦", desc: b.desc || "", count: +b.count || 0, sort: +b.sort || db.categories.length + 1,
          };
          db.categories.push(c); store.save();
          return json(res, 200, c);
        }
        if (seg[2] === "categories" && seg[3] && (method === "PUT" || method === "DELETE")) {
          const idx = db.categories.findIndex((x) => x.id === +seg[3]);
          if (idx < 0) return json(res, 404, { error: "Không tìm thấy" });
          if (method === "DELETE") { db.categories.splice(idx, 1); store.save(); return json(res, 200, { ok: true }); }
          const b = await readBody(req);
          Object.assign(db.categories[idx], {
            name: b.name, key: b.key, icon: b.icon, desc: b.desc,
            count: +b.count || 0, sort: +b.sort || db.categories[idx].sort,
          });
          store.save();
          return json(res, 200, db.categories[idx]);
        }

        /* --- Products --- */
        if (pathname === "/api/admin/products" && method === "POST") {
          const b = await readBody(req);
          const p = {
            id: store.nextId("product"), name: b.name || "Sản phẩm", categoryKey: b.categoryKey || "",
            emoji: b.emoji || "📦", image: resolveImage(b.image, "product"),
            tag: b.tag || "", tagClass: b.tagClass || "", target: b.target || "", pack: b.pack || "",
            excerpt: b.excerpt || "", intro: b.intro || "", composition: b.composition || "",
            uses: Array.isArray(b.uses) ? b.uses : String(b.uses || "").split("\n").map(s => s.trim()).filter(Boolean),
            dosage: b.dosage || "", createdAt: Date.now(),
          };
          db.products.push(p); store.save();
          return json(res, 200, p);
        }
        if (seg[2] === "products" && seg[3] && (method === "PUT" || method === "DELETE")) {
          const idx = db.products.findIndex((x) => x.id === +seg[3]);
          if (idx < 0) return json(res, 404, { error: "Không tìm thấy" });
          if (method === "DELETE") { db.products.splice(idx, 1); store.save(); return json(res, 200, { ok: true }); }
          const b = await readBody(req);
          Object.assign(db.products[idx], {
            name: b.name, categoryKey: b.categoryKey, emoji: b.emoji,
            image: resolveImage(b.image, "product"),
            tag: b.tag || "", tagClass: b.tagClass || "", target: b.target || "", pack: b.pack || "",
            excerpt: b.excerpt || "", intro: b.intro || "", composition: b.composition || "",
            uses: Array.isArray(b.uses) ? b.uses : String(b.uses || "").split("\n").map(s => s.trim()).filter(Boolean),
            dosage: b.dosage || "",
          });
          store.save();
          return json(res, 200, db.products[idx]);
        }

        /* --- Articles --- */
        if (pathname === "/api/admin/articles" && method === "POST") {
          const b = await readBody(req);
          const a = {
            id: store.nextId("article"), title: b.title || "Bài viết", cat: b.cat || "Tin tức",
            date: b.date || new Date().toISOString().slice(0, 10), author: b.author || "Big Boss",
            read: b.read || "3 phút", emoji: b.emoji || "📰", image: resolveImage(b.image, "article"),
            featured: !!b.featured, published: b.published !== false,
            excerpt: b.excerpt || "", body: b.body || "", createdAt: Date.now(),
          };
          db.articles.push(a); store.save();
          return json(res, 200, a);
        }
        if (seg[2] === "articles" && seg[3] && (method === "PUT" || method === "DELETE")) {
          const idx = db.articles.findIndex((x) => x.id === +seg[3]);
          if (idx < 0) return json(res, 404, { error: "Không tìm thấy" });
          if (method === "DELETE") { db.articles.splice(idx, 1); store.save(); return json(res, 200, { ok: true }); }
          const b = await readBody(req);
          Object.assign(db.articles[idx], {
            title: b.title, cat: b.cat, date: b.date, author: b.author, read: b.read,
            emoji: b.emoji, image: resolveImage(b.image, "article"),
            featured: !!b.featured, published: b.published !== false,
            excerpt: b.excerpt || "", body: b.body || "",
          });
          store.save();
          return json(res, 200, db.articles[idx]);
        }

        /* --- Messages (mail) --- */
        if (pathname === "/api/admin/messages" && method === "GET")
          return json(res, 200, db.messages);
        if (seg[2] === "messages" && seg[3] && method === "PATCH") {
          const m = db.messages.find((x) => x.id === +seg[3]);
          if (!m) return json(res, 404, { error: "Không tìm thấy" });
          const b = await readBody(req);
          if (typeof b.isRead === "boolean") m.isRead = b.isRead;
          store.save();
          return json(res, 200, m);
        }
        if (seg[2] === "messages" && seg[3] && method === "DELETE") {
          const idx = db.messages.findIndex((x) => x.id === +seg[3]);
          if (idx < 0) return json(res, 404, { error: "Không tìm thấy" });
          db.messages.splice(idx, 1); store.save();
          return json(res, 200, { ok: true });
        }

        /* --- Settings & Logo --- */
        if (pathname === "/api/admin/settings" && method === "GET")
          return json(res, 200, publicSettings(db.settings));
        if (pathname === "/api/admin/settings" && method === "PUT") {
          const b = await readBody(req);
          const s = db.settings;
          if (b.siteName != null) s.siteName = b.siteName;
          if (b.hotline != null) s.hotline = b.hotline;
          if (b.email != null) s.email = b.email;
          if (b.address != null) s.address = b.address;
          store.save();
          return json(res, 200, publicSettings(s));
        }
        if (pathname === "/api/admin/logo" && method === "POST") {
          const b = await readBody(req);
          const p = saveDataUrl(b.dataUrl, "logo");
          if (!p) return json(res, 400, { error: "Ảnh không hợp lệ" });
          db.settings.logo = p; store.save();
          return json(res, 200, { logo: p });
        }
        if (pathname === "/api/admin/password" && method === "PUT") {
          const b = await readBody(req);
          const s = db.settings;
          if (store.hashPassword(b.current || "", s.adminSalt) !== s.adminPass)
            return json(res, 400, { error: "Mật khẩu hiện tại không đúng" });
          if (!b.next || b.next.length < 6) return json(res, 400, { error: "Mật khẩu mới tối thiểu 6 ký tự" });
          s.adminSalt = crypto.randomBytes(8).toString("hex");
          s.adminPass = store.hashPassword(b.next, s.adminSalt);
          store.save();
          return json(res, 200, { ok: true });
        }

        return json(res, 404, { error: "API không tồn tại" });
      }

      return json(res, 404, { error: "API không tồn tại" });
    }

    /* ---------------- Static files ---------------- */
    if (pathname.startsWith("/uploads/")) {
      const fp = safeJoin(UPLOADS_DIR, pathname.replace("/uploads/", ""));
      return fp ? serveFile(res, fp) : json(res, 400, { error: "bad path" });
    }
    if (pathname === "/admin" || pathname === "/admin/") return serveFile(res, path.join(ADMIN_DIR, "index.html"));
    if (pathname.startsWith("/admin/")) {
      const fp = safeJoin(ADMIN_DIR, pathname.replace("/admin/", ""));
      return fp ? serveFile(res, fp) : json(res, 400, { error: "bad path" });
    }

    // Web công khai
    let rel = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const fp = safeJoin(BASE_DIR, rel);
    if (!fp) return json(res, 400, { error: "bad path" });
    return serveFile(res, fp);
  } catch (e) {
    console.error("Lỗi máy chủ:", e);
    return json(res, 500, { error: "Lỗi máy chủ" });
  }
});

server.listen(PORT, () => {
  console.log("\n========================================");
  console.log("  BIG BOSS CMS đang chạy!");
  console.log("  🌐 Website:  http://localhost:" + PORT);
  console.log("  🔐 Quản trị: http://localhost:" + PORT + "/admin");
  console.log("     Tài khoản: admin");
  console.log("     Mật khẩu:  bigboss@2026");
  console.log("========================================\n");
});
