/* ============================================================
   BIG BOSS - Sản phẩm (lấy dữ liệu từ CMS API)
   Dùng cho: san-pham.html (danh sách) & chi-tiet-san-pham.html (chi tiết)
   ============================================================ */
(function () {
  "use strict";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const thumbStyle = (p) => (p.image ? `style="background-image:url(${esc(p.image)});background-size:cover;background-position:center"` : "");
  const thumbInner = (p) => (p.image ? "" : esc(p.emoji));

  async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("fetch " + url);
    return r.json();
  }

  let CAT_MAP = {};
  const catName = (key) => CAT_MAP[key] || key || "—";

  const isDetail = !!document.querySelector("#p-title");
  const isList = !!document.querySelector("#prod-grid");

  /* ---------------- DANH SÁCH (san-pham.html) ---------------- */
  async function renderList() {
    let cats, products;
    try { [cats, products] = await Promise.all([getJSON("/api/categories"), getJSON("/api/products")]); }
    catch { document.querySelector("#prod-grid").innerHTML = '<p style="color:var(--muted)">Cần chạy qua máy chủ CMS để hiển thị sản phẩm.</p>'; return; }
    cats.forEach((c) => (CAT_MAP[c.key] = c.name));

    // Danh mục
    const catGrid = document.querySelector("#cat-grid");
    if (catGrid) {
      catGrid.innerHTML = cats.map((c, i) => `
        <div class="cat-card" data-key="${esc(c.key)}" data-reveal="up" data-delay="${(i % 4) + 1}">
          <div class="cat-emoji">${esc(c.icon)}</div>
          <h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p>
          <div class="cat-count">${c.count || 0} sản phẩm</div>
        </div>`).join("");
      catGrid.querySelectorAll(".cat-card").forEach((card) =>
        card.addEventListener("click", () => {
          applyFilter(card.dataset.key);
          document.querySelector("#prod-grid").scrollIntoView({ behavior: "smooth", block: "start" });
        })
      );
    }

    // Tabs lọc
    const tabs = document.querySelector("#filter-tabs");
    if (tabs) {
      tabs.innerHTML = `<button class="active" data-filter="all">Tất cả</button>` +
        cats.map((c) => `<button data-filter="${esc(c.key)}">${esc(c.name)}</button>`).join("");
      tabs.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => applyFilter(b.dataset.filter))
      );
    }

    // Sản phẩm
    const grid = document.querySelector("#prod-grid");
    grid.innerHTML = products.map((p, i) => {
      const tag = p.tag ? `<span class="tag ${p.tagClass === "new" ? "new" : ""}">${esc(p.tag)}</span>` : "";
      return `
        <a class="prod-card" data-cat="${esc(p.categoryKey)}" href="chi-tiet-san-pham.html?id=${p.id}" data-reveal="up" data-delay="${(i % 4) + 1}">
          <div class="prod-thumb" ${thumbStyle(p)}>${thumbInner(p)}${tag}</div>
          <div class="prod-body">
            <span class="prod-cat">${esc(catName(p.categoryKey))}</span>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.excerpt)}</p>
            <div class="prod-foot"><span class="price">Liên hệ</span><span class="more">→</span></div>
          </div>
        </a>`;
    }).join("");

    if (window.bbObserveReveals) window.bbObserveReveals(document);
  }

  function applyFilter(key) {
    document.querySelectorAll("#filter-tabs button").forEach((b) =>
      b.classList.toggle("active", b.dataset.filter === key)
    );
    document.querySelectorAll("#prod-grid .prod-card").forEach((card) => {
      const show = key === "all" || card.dataset.cat === key;
      card.style.display = show ? "" : "none";
    });
  }

  /* ---------------- CHI TIẾT (chi-tiet-san-pham.html) ---------------- */
  async function renderDetail() {
    const id = parseInt(new URLSearchParams(location.search).get("id"), 10) || 1;
    let p, cats;
    try { [p, cats] = await Promise.all([getJSON("/api/products/" + id), getJSON("/api/categories")]); }
    catch {
      const t = document.querySelector("#p-title");
      if (t) t.textContent = "Cần chạy qua máy chủ CMS để xem sản phẩm.";
      return;
    }
    cats.forEach((c) => (CAT_MAP[c.key] = c.name));
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.innerHTML = val; };

    document.title = p.name + " — Big Boss";
    set("#p-cat", esc(catName(p.categoryKey)));
    set("#p-title", esc(p.name));
    set("#p-crumb", esc(p.name));
    set("#p-excerpt", esc(p.excerpt));
    set("#p-target", esc(p.target)); set("#p-target2", esc(p.target));
    set("#p-pack", esc(p.pack)); set("#p-pack2", esc(p.pack));
    set("#p-code", "BB-" + String(p.id).padStart(3, "0"));
    set("#p-intro", `<p>${esc(p.intro)}</p>`);
    set("#p-composition", esc(p.composition));
    set("#p-dosage", esc(p.dosage));
    const uses = Array.isArray(p.uses) ? p.uses : [];
    set("#p-uses", uses.map((u) => `<li>${esc(u)}</li>`).join(""));
    set("#p-features", uses.map((u) => `<li><span class="ck">✓</span>${esc(u)}</li>`).join(""));

    // Ảnh
    if (p.image) {
      const g = document.querySelector(".gallery-main");
      if (g) { g.style.backgroundImage = `url(${p.image})`; g.style.backgroundSize = "cover"; g.style.backgroundPosition = "center"; g.innerHTML = ""; }
    } else {
      set("#p-emoji", esc(p.emoji)); set("#p-emoji2", esc(p.emoji));
    }

    // Nhãn
    const tagEl = document.querySelector("#p-tag");
    if (tagEl) {
      if (p.tag) { tagEl.textContent = p.tag; tagEl.className = "prod-badge " + (p.tagClass === "new" ? "new" : ""); }
      else tagEl.style.display = "none";
    }

    // Sản phẩm liên quan
    try {
      const all = await getJSON("/api/products");
      const same = all.filter((x) => x.id !== p.id && x.categoryKey === p.categoryKey);
      const others = all.filter((x) => x.id !== p.id && x.categoryKey !== p.categoryKey);
      const pick = same.concat(others).slice(0, 4);
      const wrap = document.querySelector("#p-related");
      if (wrap) wrap.innerHTML = pick.map((r) => {
        const tag = r.tag ? `<span class="tag ${r.tagClass === "new" ? "new" : ""}">${esc(r.tag)}</span>` : "";
        return `<a class="prod-card" href="chi-tiet-san-pham.html?id=${r.id}">
          <div class="prod-thumb" ${thumbStyle(r)}>${thumbInner(r)}${tag}</div>
          <div class="prod-body"><span class="prod-cat">${esc(catName(r.categoryKey))}</span><h3>${esc(r.name)}</h3><p>${esc(r.excerpt)}</p>
          <div class="prod-foot"><span class="price">Liên hệ</span><span class="more">→</span></div></div>
        </a>`;
      }).join("");
    } catch {}

    if (window.bbObserveReveals) window.bbObserveReveals(document);
  }

  if (isDetail) renderDetail();
  else if (isList) renderList();
})();
