/* ============================================================
   BIG BOSS CMS - Admin logic
   ============================================================ */
"use strict";
let TOKEN = localStorage.getItem("bb_token") || "";
let SECTION = "dashboard";
let CATS = [];       // cache danh mục (cho dropdown)
let FORM_IMG = null; // dataURL ảnh đang chọn trong modal

const $ = (s) => document.querySelector(s);
const el = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- API ---------- */
async function api(method, path, body) {
  const opt = { method, headers: {} };
  if (TOKEN) opt.headers["Authorization"] = "Bearer " + TOKEN;
  if (body !== undefined) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
  const r = await fetch(path, opt);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Lỗi " + r.status);
  return data;
}

/* ---------- Toast ---------- */
let toastT;
function toast(msg, type = "ok") {
  const t = el("toast");
  t.textContent = msg; t.className = "toast show " + type;
  clearTimeout(toastT);
  toastT = setTimeout(() => (t.className = "toast " + type), 2600);
}

/* ---------- Auth ---------- */
el("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  el("loginErr").textContent = "";
  try {
    const d = await api("POST", "/api/login", { user: el("loginUser").value, pass: el("loginPass").value });
    TOKEN = d.token; localStorage.setItem("bb_token", TOKEN);
    showApp();
  } catch (err) { el("loginErr").textContent = err.message; }
});
el("logoutBtn").addEventListener("click", async () => {
  try { await api("POST", "/api/logout"); } catch {}
  TOKEN = ""; localStorage.removeItem("bb_token");
  el("app").classList.add("hidden"); el("login").classList.remove("hidden");
});

async function showApp() {
  el("login").classList.add("hidden");
  el("app").classList.remove("hidden");
  CATS = await api("GET", "/api/categories").catch(() => []);
  go("dashboard");
  refreshUnread();
}

/* ---------- Navigation ---------- */
document.querySelectorAll(".menu a").forEach((a) =>
  a.addEventListener("click", () => go(a.dataset.section))
);
const TITLES = { dashboard: "Tổng quan", products: "Quản lý sản phẩm", categories: "Quản lý danh mục", articles: "Quản lý bài viết", messages: "Tin nhắn liên hệ", settings: "Cài đặt & Logo" };
function go(section) {
  SECTION = section;
  document.querySelectorAll(".menu a").forEach((a) => a.classList.toggle("active", a.dataset.section === section));
  el("pageTitle").textContent = TITLES[section];
  el("addBtn").style.display = ["products", "categories", "articles"].includes(section) ? "" : "none";
  render();
}
el("addBtn").addEventListener("click", () => openForm(SECTION, null));

/* ---------- Render sections ---------- */
async function render() {
  const v = el("view");
  v.innerHTML = '<div class="empty">⏳ Đang tải…</div>';
  try {
    if (SECTION === "dashboard") return renderDashboard(v);
    if (SECTION === "products") return renderProducts(v);
    if (SECTION === "categories") return renderCategories(v);
    if (SECTION === "articles") return renderArticles(v);
    if (SECTION === "messages") return renderMessages(v);
    if (SECTION === "settings") return renderSettings(v);
  } catch (err) { v.innerHTML = `<div class="empty">⚠️ ${esc(err.message)}</div>`; }
}

async function renderDashboard(v) {
  const [s, t] = await Promise.all([
    api("GET", "/api/admin/overview"),
    api("GET", "/api/admin/traffic"),
  ]);
  const maxV = Math.max(1, ...t.series.map((d) => d.views));
  const bars = t.series.map((d) => {
    const h = Math.round((d.views / maxV) * 140);
    const dd = d.date.slice(8) + "/" + d.date.slice(5, 7);
    return `<div class="bar-wrap" title="${d.date}: ${d.views} lượt xem · ${d.visitors} khách">
      <div class="bar" style="height:${h}px">${d.views ? `<span>${d.views}</span>` : ""}</div>
      <div class="bar-label">${dd}</div></div>`;
  }).join("");
  const tops = t.topPages.length
    ? t.topPages.map((p) => `<li><span>${esc(p.path)}</span><b>${p.views}</b></li>`).join("")
    : '<li style="color:var(--muted)">Chưa có dữ liệu truy cập</li>';

  v.innerHTML = `
    <div class="stats">
      <div class="stat"><div class="ic">👁️</div><div class="num">${t.total.toLocaleString("vi-VN")}</div><div class="lbl">Tổng lượt xem</div></div>
      <div class="stat"><div class="ic">📅</div><div class="num">${t.today.views}</div><div class="lbl">Lượt xem hôm nay</div></div>
      <div class="stat"><div class="ic">🧑</div><div class="num">${t.today.visitors}</div><div class="lbl">Khách hôm nay</div></div>
      <div class="stat"><div class="ic">📈</div><div class="num">${t.week}</div><div class="lbl">Lượt xem 7 ngày</div></div>
    </div>

    <div class="panel" style="margin-bottom:22px">
      <div class="panel-head"><h3>📊 Lượt truy cập 14 ngày gần nhất</h3><span class="muted-note">Cột = lượt xem/ngày</span></div>
      <div class="chart">${bars}</div>
    </div>

    <div class="dash-2col">
      <div class="panel"><h3>🔥 Trang được xem nhiều nhất</h3><ul class="top-pages">${tops}</ul></div>
      <div class="panel"><h3>🗂️ Nội dung website</h3><ul class="top-pages">
        <li><span>📦 Sản phẩm</span><b>${s.products}</b></li>
        <li><span>🗂️ Danh mục</span><b>${s.categories}</b></li>
        <li><span>📰 Bài viết</span><b>${s.articles}</b></li>
        <li><span>✉️ Tin nhắn (chưa đọc)</span><b>${s.unread}/${s.messages}</b></li>
      </ul></div>
    </div>`;
}

async function renderProducts(v) {
  const list = await api("GET", "/api/products");
  if (!list.length) return (v.innerHTML = emptyBox("Chưa có sản phẩm nào"));
  const rows = list.map((p) => `
    <tr>
      <td>${p.image ? `<img class="t-img" src="${esc(p.image)}">` : `<span class="t-emoji">${esc(p.emoji)}</span>`}</td>
      <td><b>${esc(p.name)}</b><br><small style="color:var(--muted)">${esc(p.excerpt).slice(0, 60)}</small></td>
      <td><span class="pill pill-cat">${esc(catName(p.categoryKey))}</span></td>
      <td>${p.tag ? `<span class="pill ${p.tagClass === "new" ? "pill-new" : "pill-tag"}">${esc(p.tag)}</span>` : "—"}</td>
      <td><div class="row-actions">
        <button class="btn btn-sm btn-edit" onclick="openForm('products',${p.id})">Sửa</button>
        <button class="btn btn-sm btn-danger" onclick="del('products',${p.id},'${esc(p.name)}')">Xóa</button>
      </div></td>
    </tr>`).join("");
  v.innerHTML = table(["", "Tên sản phẩm", "Danh mục", "Nhãn", ""], rows);
}

async function renderCategories(v) {
  const list = await api("GET", "/api/categories");
  CATS = list;
  if (!list.length) return (v.innerHTML = emptyBox("Chưa có danh mục nào"));
  const rows = list.map((c) => `
    <tr>
      <td><span class="t-emoji">${esc(c.icon)}</span></td>
      <td><b>${esc(c.name)}</b><br><small style="color:var(--muted)">${esc(c.desc)}</small></td>
      <td><code>${esc(c.key)}</code></td>
      <td>${c.count || 0} SP</td>
      <td><div class="row-actions">
        <button class="btn btn-sm btn-edit" onclick="openForm('categories',${c.id})">Sửa</button>
        <button class="btn btn-sm btn-danger" onclick="del('categories',${c.id},'${esc(c.name)}')">Xóa</button>
      </div></td>
    </tr>`).join("");
  v.innerHTML = table(["", "Tên danh mục", "Mã (key)", "Số SP", ""], rows);
}

async function renderArticles(v) {
  const list = await api("GET", "/api/articles");
  if (!list.length) return (v.innerHTML = emptyBox("Chưa có bài viết nào"));
  const rows = list.map((a) => `
    <tr>
      <td>${a.image ? `<img class="t-img" src="${esc(a.image)}">` : `<span class="t-emoji">${esc(a.emoji)}</span>`}</td>
      <td><b>${esc(a.title)}</b><br><small style="color:var(--muted)">${esc(a.cat)} · ${esc(a.author)}</small></td>
      <td>${esc(a.date)}</td>
      <td>${a.published === false ? '<span class="pill pill-off">Ẩn</span>' : '<span class="pill pill-on">Hiện</span>'} ${a.featured ? '<span class="pill pill-tag">Nổi bật</span>' : ""}</td>
      <td><div class="row-actions">
        <button class="btn btn-sm btn-edit" onclick="openForm('articles',${a.id})">Sửa</button>
        <button class="btn btn-sm btn-danger" onclick="del('articles',${a.id},'${esc(a.title).slice(0,30)}')">Xóa</button>
      </div></td>
    </tr>`).join("");
  v.innerHTML = table(["", "Tiêu đề", "Ngày", "Trạng thái", ""], rows);
}

async function renderMessages(v) {
  const list = await api("GET", "/api/admin/messages");
  if (!list.length) return (v.innerHTML = emptyBox("Chưa có tin nhắn liên hệ nào"));
  v.innerHTML = list.map((m) => `
    <div class="msg-item ${m.isRead ? "" : "unread"}">
      <div class="msg-top">
        <b>${esc(m.name)}</b>
        ${m.subject ? `<span class="msg-subject">${esc(m.subject)}</span>` : ""}
      </div>
      <div class="msg-meta">
        ${m.phone ? `📞 ${esc(m.phone)}` : ""} ${m.email ? `✉️ ${esc(m.email)}` : ""}
        <span>🕒 ${new Date(m.createdAt).toLocaleString("vi-VN")}</span>
      </div>
      <div class="msg-body">${esc(m.content)}</div>
      <div class="msg-actions">
        ${m.phone ? `<a class="btn btn-sm btn-gold" href="tel:${esc(m.phone)}">Gọi lại</a>` : ""}
        ${m.email ? `<a class="btn btn-sm btn-edit" href="mailto:${esc(m.email)}">Trả lời email</a>` : ""}
        <button class="btn btn-sm btn-ghost" onclick="toggleRead(${m.id},${!m.isRead})">${m.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}</button>
        <button class="btn btn-sm btn-danger" onclick="del('messages',${m.id},'tin nhắn này')">Xóa</button>
      </div>
    </div>`).join("");
}

async function renderSettings(v) {
  const s = await api("GET", "/api/admin/settings");
  v.innerHTML = `
    <div class="panel" style="margin-bottom:22px">
      <h3>🖼️ Logo thương hiệu</h3>
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <img id="curLogo" class="logo-preview" src="${esc(s.logo)}?t=${Date.now()}" style="background:#241608;padding:10px;border-radius:12px" />
        <div>
          <input type="file" id="logoFile" accept="image/*" />
          <div class="hint">Chọn ảnh PNG/JPG/SVG. Logo sẽ tự cập nhật trên toàn bộ website.</div>
          <button class="btn btn-gold btn-sm" id="logoSave" style="margin-top:10px">Cập nhật logo</button>
        </div>
      </div>
    </div>
    <div class="panel" style="margin-bottom:22px">
      <h3>🏢 Thông tin liên hệ</h3>
      <div class="field"><label>Tên công ty</label><input id="setName" value="${esc(s.siteName)}"></div>
      <div class="field"><label>Hotline</label><input id="setHotline" value="${esc(s.hotline)}"></div>
      <div class="field"><label>Email</label><input id="setEmail" value="${esc(s.email)}"></div>
      <div class="field"><label>Địa chỉ</label><input id="setAddr" value="${esc(s.address)}"></div>
      <button class="btn btn-gold" id="setSave">Lưu thông tin</button>
    </div>
    <div class="panel">
      <h3>🔑 Đổi mật khẩu</h3>
      <div class="field"><label>Mật khẩu hiện tại</label><input id="pwCur" type="password"></div>
      <div class="field"><label>Mật khẩu mới</label><input id="pwNew" type="password"></div>
      <button class="btn btn-gold" id="pwSave">Đổi mật khẩu</button>
    </div>`;

  let logoData = null;
  el("logoFile").addEventListener("change", (e) => readFile(e.target.files[0], (d) => { logoData = d; el("curLogo").src = d; }));
  el("logoSave").addEventListener("click", async () => {
    if (!logoData) return toast("Chọn ảnh trước", "err");
    try { await api("POST", "/api/admin/logo", { dataUrl: logoData }); toast("Đã cập nhật logo ✔"); } catch (e) { toast(e.message, "err"); }
  });
  el("setSave").addEventListener("click", async () => {
    try {
      await api("PUT", "/api/admin/settings", { siteName: el("setName").value, hotline: el("setHotline").value, email: el("setEmail").value, address: el("setAddr").value });
      toast("Đã lưu thông tin ✔");
    } catch (e) { toast(e.message, "err"); }
  });
  el("pwSave").addEventListener("click", async () => {
    try { await api("PUT", "/api/admin/password", { current: el("pwCur").value, next: el("pwNew").value }); toast("Đã đổi mật khẩu ✔"); el("pwCur").value = el("pwNew").value = ""; }
    catch (e) { toast(e.message, "err"); }
  });
}

/* ---------- Helpers UI ---------- */
function table(headers, rows) {
  return `<table class="data-table"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
}
function emptyBox(msg) { return `<div class="empty"><div class="em">📭</div><p>${esc(msg)}</p></div>`; }
function catName(key) { const c = CATS.find((x) => x.key === key); return c ? c.name : (key || "—"); }
function readFile(file, cb) { if (!file) return; const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(file); }

/* ---------- Forms (modal) ---------- */
const SCHEMAS = {
  products: [
    { n: "name", l: "Tên sản phẩm", t: "text" },
    { n: "categoryKey", l: "Danh mục", t: "cat" },
    { n: "emoji", l: "Biểu tượng (emoji)", t: "text", half: true },
    { n: "tag", l: "Nhãn (VD: BÁN CHẠY)", t: "text", half: true },
    { n: "tagClass", l: "Loại nhãn", t: "select", opts: [["", "Vàng (mặc định)"], ["new", "Xanh (MỚI)"]], half: true },
    { n: "target", l: "Đối tượng", t: "text", half: true },
    { n: "pack", l: "Quy cách đóng gói", t: "text" },
    { n: "image", l: "Ảnh sản phẩm (tùy chọn)", t: "image" },
    { n: "excerpt", l: "Mô tả ngắn", t: "textarea" },
    { n: "intro", l: "Mô tả chi tiết", t: "textarea" },
    { n: "composition", l: "Thành phần", t: "textarea" },
    { n: "uses", l: "Công dụng (mỗi dòng 1 ý)", t: "lines" },
    { n: "dosage", l: "Liều dùng / cách dùng", t: "textarea" },
  ],
  categories: [
    { n: "name", l: "Tên danh mục", t: "text" },
    { n: "key", l: "Mã (key, không dấu)", t: "text", half: true },
    { n: "icon", l: "Biểu tượng (emoji)", t: "text", half: true },
    { n: "count", l: "Số sản phẩm", t: "number", half: true },
    { n: "sort", l: "Thứ tự", t: "number", half: true },
    { n: "desc", l: "Mô tả", t: "textarea" },
  ],
  articles: [
    { n: "title", l: "Tiêu đề", t: "text" },
    { n: "cat", l: "Chuyên mục", t: "text", half: true },
    { n: "date", l: "Ngày đăng", t: "date", half: true },
    { n: "author", l: "Tác giả", t: "text", half: true },
    { n: "read", l: "Thời gian đọc", t: "text", half: true },
    { n: "emoji", l: "Biểu tượng (emoji)", t: "text", half: true },
    { n: "featured", l: "Bài nổi bật", t: "check", half: true },
    { n: "published", l: "Hiển thị công khai", t: "check", half: true },
    { n: "image", l: "Ảnh bìa (tùy chọn)", t: "image" },
    { n: "excerpt", l: "Tóm tắt", t: "textarea" },
    { n: "body", l: "Nội dung (HTML: dùng <h2>, <p>, <ul><li>)", t: "textarea", big: true },
  ],
};

async function openForm(section, id) {
  const schema = SCHEMAS[section];
  if (!schema) return;
  FORM_IMG = null;
  let item = {};
  if (id) {
    const path = section === "products" ? "/api/products/" + id : section === "articles" ? "/api/articles/" + id : null;
    if (path) item = await api("GET", path);
    else item = CATS.find((c) => c.id === id) || (await api("GET", "/api/categories")).find((c) => c.id === id) || {};
  } else {
    if (section === "articles") item = { published: true, date: new Date().toISOString().slice(0, 10) };
  }
  el("modalTitle").textContent = (id ? "Sửa " : "Thêm ") + ({ products: "sản phẩm", categories: "danh mục", articles: "bài viết" }[section]);
  const form = el("modalForm");
  form.innerHTML = schema.map((f) => fieldHtml(f, item)).join("");
  // gắn sự kiện cho ô ảnh
  const imgIn = form.querySelector('input[type="file"]');
  if (imgIn) imgIn.addEventListener("change", (e) => readFile(e.target.files[0], (d) => { FORM_IMG = d; const pv = form.querySelector(".img-preview"); if (pv) { pv.innerHTML = ""; pv.style.backgroundImage = `url(${d})`; pv.style.backgroundSize = "cover"; } }));
  el("modal").dataset.section = section;
  el("modal").dataset.id = id || "";
  el("modal").classList.remove("hidden");
}
function fieldHtml(f, item) {
  const val = item[f.n];
  const wrap = (inner) => `<div class="field" style="${f.half ? "" : "grid-column:1/-1"}"><label>${f.l}</label>${inner}</div>`;
  if (f.t === "textarea") return wrap(`<textarea name="${f.n}" rows="${f.big ? 8 : 3}">${esc(val)}</textarea>`);
  if (f.t === "lines") return wrap(`<textarea name="${f.n}" rows="4">${esc(Array.isArray(val) ? val.join("\n") : val || "")}</textarea>`);
  if (f.t === "number") return wrap(`<input type="number" name="${f.n}" value="${esc(val)}">`);
  if (f.t === "date") return wrap(`<input type="date" name="${f.n}" value="${esc(val)}">`);
  if (f.t === "check") return wrap(`<label style="display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" name="${f.n}" ${val !== false && val ? "checked" : ""} style="width:auto"> Có</label>`);
  if (f.t === "select") return wrap(`<select name="${f.n}">${f.opts.map(([v, t]) => `<option value="${v}" ${val === v ? "selected" : ""}>${t}</option>`).join("")}</select>`);
  if (f.t === "cat") return wrap(`<select name="${f.n}">${CATS.map((c) => `<option value="${c.key}" ${val === c.key ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>`);
  if (f.t === "image") return wrap(`<div style="display:flex;gap:14px;align-items:center"><div class="img-preview" style="${val ? `background-image:url(${esc(val)});background-size:cover` : ""}">${val ? "" : "🖼️"}</div><input type="file" name="${f.n}" accept="image/*"></div>`);
  return wrap(`<input type="text" name="${f.n}" value="${esc(val)}">`);
}

el("modalClose").addEventListener("click", closeModal);
el("modalCancel").addEventListener("click", closeModal);
function closeModal() { el("modal").classList.add("hidden"); }
el("modalSave").addEventListener("click", saveForm);
el("modalForm").addEventListener("submit", (e) => { e.preventDefault(); saveForm(); });

async function saveForm() {
  const section = el("modal").dataset.section;
  const id = el("modal").dataset.id;
  const schema = SCHEMAS[section];
  const form = el("modalForm");
  const data = {};
  schema.forEach((f) => {
    if (f.t === "image") { if (FORM_IMG) data[f.n] = FORM_IMG; return; }
    const inp = form.querySelector(`[name="${f.n}"]`);
    if (!inp) return;
    if (f.t === "check") data[f.n] = inp.checked;
    else if (f.t === "number") data[f.n] = +inp.value;
    else data[f.n] = inp.value;
  });
  try {
    if (id) await api("PUT", `/api/admin/${section}/${id}`, data);
    else await api("POST", `/api/admin/${section}`, data);
    toast("Đã lưu ✔");
    closeModal();
    if (section === "categories") CATS = await api("GET", "/api/categories");
    render();
  } catch (e) { toast(e.message, "err"); }
}

/* ---------- Actions ---------- */
async function del(section, id, name) {
  if (!confirm(`Xóa "${name}"? Hành động này không thể hoàn tác.`)) return;
  try {
    const base = section === "messages" ? "/api/admin/messages/" : `/api/admin/${section}/`;
    await api("DELETE", base + id);
    toast("Đã xóa ✔");
    render(); refreshUnread();
  } catch (e) { toast(e.message, "err"); }
}
async function toggleRead(id, val) {
  try { await api("PATCH", "/api/admin/messages/" + id, { isRead: val }); render(); refreshUnread(); } catch (e) { toast(e.message, "err"); }
}
async function refreshUnread() {
  try {
    const s = await api("GET", "/api/admin/overview");
    const b = el("navUnread");
    b.textContent = s.unread || ""; b.style.display = s.unread ? "" : "none";
  } catch {}
}
window.openForm = openForm; window.del = del; window.toggleRead = toggleRead;

/* ---------- Boot ---------- */
(async function boot() {
  if (TOKEN) {
    try { await api("GET", "/api/admin/overview"); showApp(); return; } catch { TOKEN = ""; localStorage.removeItem("bb_token"); }
  }
  el("login").classList.remove("hidden");
})();
