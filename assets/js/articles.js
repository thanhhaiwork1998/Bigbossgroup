/* ============================================================
   BIG BOSS - Bài viết (lấy dữ liệu từ CMS API)
   Dùng cho: tin-tuc.html (danh sách) & bai-viet.html (chi tiết)
   ============================================================ */
(function () {
  "use strict";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function fmtDate(d) {
    if (!d) return "";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : d;
  }
  function thumbStyle(a) {
    return a.image ? `style="background-image:url(${esc(a.image)});background-size:cover;background-position:center"` : "";
  }
  function thumbInner(a) { return a.image ? "" : esc(a.emoji); }

  async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("fetch " + url);
    return r.json();
  }

  const isDetail = !!document.querySelector("#a-body");
  const isList = !!document.querySelector("#news-grid");

  /* ---------------- DANH SÁCH (tin-tuc.html) ---------------- */
  async function renderList() {
    let list;
    try { list = await getJSON("/api/articles"); }
    catch { document.querySelector("#news-grid").innerHTML = '<p style="color:var(--muted)">Cần chạy qua máy chủ CMS để hiển thị tin tức.</p>'; return; }
    if (!list.length) return;

    const hero = list[0];
    const side = list.slice(1, 4);
    const grid = list.slice(4);

    const feat = document.querySelector("#news-featured");
    if (feat) {
      const heroStyle = hero.image
        ? `style="background-image:linear-gradient(180deg,transparent 20%,rgba(0,0,0,.85)),url(${esc(hero.image)});background-size:cover;background-position:center"`
        : "";
      feat.innerHTML = `
        <a href="bai-viet.html?id=${hero.id}" class="news-hero-card" data-reveal="left" ${heroStyle}>
          ${hero.image ? "" : `<span class="emoji-bg">${esc(hero.emoji)}</span>`}
          <div class="nh-body">
            <span class="n-cat">${esc(hero.cat)}</span>
            <h2>${esc(hero.title)}</h2>
            <div class="meta">📅 ${fmtDate(hero.date)} · ✍️ ${esc(hero.author)} · ⏱️ ${esc(hero.read)} đọc</div>
          </div>
        </a>
        <div class="news-side">
          ${side.map((a, i) => `
            <a href="bai-viet.html?id=${a.id}" class="news-side-item" data-reveal="right" data-delay="${i + 1}">
              <div class="thumb" ${thumbStyle(a)}>${thumbInner(a)}</div>
              <div><span class="n-cat">${esc(a.cat)}</span><h4>${esc(a.title)}</h4><div class="meta">📅 ${fmtDate(a.date)}</div></div>
            </a>`).join("")}
        </div>`;
    }

    const gridEl = document.querySelector("#news-grid");
    gridEl.innerHTML = grid.map((a, i) => `
      <a class="news-card" href="bai-viet.html?id=${a.id}" data-reveal="up" data-delay="${(i % 3) + 1}">
        <div class="n-thumb" ${thumbStyle(a)}>${thumbInner(a)}<span class="n-cat">${esc(a.cat)}</span></div>
        <div class="n-body">
          <div class="meta"><span>📅 ${fmtDate(a.date)}</span><span>⏱️ ${esc(a.read)}</span></div>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.excerpt)}</p>
          <span class="read">Đọc tiếp <span>→</span></span>
        </div>
      </a>`).join("");

    if (window.bbObserveReveals) window.bbObserveReveals(document);
  }

  /* ---------------- CHI TIẾT (bai-viet.html) ---------------- */
  async function renderDetail() {
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get("id"), 10) || 1;
    let a;
    try { a = await getJSON("/api/articles/" + id); }
    catch {
      const t = document.querySelector("#a-title");
      if (t) t.textContent = "Cần chạy qua máy chủ CMS để xem bài viết.";
      return;
    }
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.innerHTML = val; };
    document.title = a.title + " — Big Boss";
    set("#a-cat", esc(a.cat));
    set("#a-title", esc(a.title));
    set("#a-crumb", esc(a.title));
    set("#a-meta", `📅 ${fmtDate(a.date)} · ✍️ ${esc(a.author)} · ⏱️ ${esc(a.read)} đọc`);
    set("#a-excerpt", esc(a.excerpt));
    set("#a-body", a.body || "");
    if (a.image) {
      const fig = document.querySelector("#a-fig");
      if (fig) { fig.style.backgroundImage = `url(${a.image})`; fig.style.backgroundSize = "cover"; fig.style.backgroundPosition = "center"; fig.innerHTML = ""; }
      set("#a-emoji", "🖼️");
    } else {
      set("#a-emoji", esc(a.emoji));
      set("#a-emoji2", esc(a.emoji));
    }

    // Bài liên quan
    try {
      const all = await getJSON("/api/articles");
      const rel = all.filter((x) => x.id !== a.id).slice(0, 4);
      const wrap = document.querySelector("#a-related");
      if (wrap) wrap.innerHTML = rel.map((r) => `
        <a class="related-item" href="bai-viet.html?id=${r.id}">
          <div class="thumb" ${thumbStyle(r)}>${thumbInner(r)}</div>
          <div><span class="n-cat">${esc(r.cat)}</span><h4>${esc(r.title)}</h4><div class="meta">📅 ${fmtDate(r.date)}</div></div>
        </a>`).join("");
    } catch {}

    // Nút chia sẻ
    document.querySelectorAll("[data-share]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (btn.dataset.share === "copy" && navigator.clipboard) {
          navigator.clipboard.writeText(location.href);
          const old = btn.getAttribute("title");
          btn.setAttribute("title", "Đã sao chép!");
          setTimeout(() => btn.setAttribute("title", old || ""), 2000);
        }
      });
    });
  }

  if (isDetail) renderDetail();
  else if (isList) renderList();
})();
