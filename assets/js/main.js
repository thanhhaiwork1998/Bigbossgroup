/* ============================================================
   BIG BOSS - Interactions & Animations
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Header shrink on scroll ---------- */
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const toTop = document.querySelector(".to-top");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  if (toTop) {
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      navLinks.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.classList.remove("nav-open");
      })
    );
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  let revealIO = null;
  if ("IntersectionObserver" in window) {
    revealIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }
  // Có thể gọi lại cho nội dung nạp động (danh sách từ API)
  window.bbObserveReveals = function (root) {
    const els = (root || document).querySelectorAll("[data-reveal]:not(.is-visible)");
    if (revealIO) els.forEach((el) => revealIO.observe(el));
    else els.forEach((el) => el.classList.add("is-visible"));
  };
  window.bbObserveReveals(document);

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const dur = 1600;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent =
              (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Hero parallax (subtle) ---------- */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.15;
          el.style.transform = `translateY(${y * speed}px)`;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Product filter ---------- */
  const tabs = document.querySelectorAll(".filter-tabs button");
  const prods = document.querySelectorAll(".prod-card");
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const cat = tab.dataset.filter;
        prods.forEach((p) => {
          const show = cat === "all" || p.dataset.cat === cat;
          if (show) {
            p.style.display = "";
            requestAnimationFrame(() => {
              p.style.opacity = "0";
              p.style.transform = "translateY(20px)";
              requestAnimationFrame(() => {
                p.style.transition = "all .5s cubic-bezier(.22,1,.36,1)";
                p.style.opacity = "1";
                p.style.transform = "none";
              });
            });
          } else {
            p.style.display = "none";
          }
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains("open");
      document
        .querySelectorAll(".faq-item")
        .forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- Contact form → gửi về CMS (nhận mail) ---------- */
  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = (n) => { const el = form.querySelector(`[name="${n}"]`); return el ? el.value.trim() : ""; };
      const payload = { name: val("name"), phone: val("phone"), email: val("email"), subject: val("subject"), content: val("content") };
      const ok = form.querySelector(".form-success");
      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Đang gửi…"; }
      try {
        const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error();
        if (ok) ok.classList.add("show");
        form.reset();
        setTimeout(() => ok && ok.classList.remove("show"), 6000);
      } catch {
        // Khi mở bằng file:// (không có server) vẫn hiển thị thành công demo
        if (ok) { ok.textContent = "✅ Cảm ơn bạn! (Lưu ý: cần chạy qua máy chủ CMS để nhận tin nhắn thật)"; ok.classList.add("show"); }
        form.reset();
        setTimeout(() => ok && ok.classList.remove("show"), 6000);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      }
    });
  }

  /* ---------- Nạp logo + thông tin liên hệ từ CMS ---------- */
  (async function loadSettings() {
    try {
      const r = await fetch("/api/settings");
      if (!r.ok) return;
      const s = await r.json();
      if (s.logo) document.querySelectorAll(".brand-logo img").forEach((img) => (img.src = s.logo));
      const apply = (key, val) => {
        if (val == null) return;
        document.querySelectorAll(`[data-cms="${key}"]`).forEach((el) => {
          el.textContent = val;
          if (el.tagName === "A") {
            if (key === "hotline") el.setAttribute("href", "tel:" + String(val).replace(/[^0-9+]/g, ""));
            if (key === "email") el.setAttribute("href", "mailto:" + val);
          }
        });
      };
      apply("hotline", s.hotline);
      apply("email", s.email);
      apply("address", s.address);
      apply("siteName", s.siteName);
    } catch {}
  })();

  /* ---------- Đo lượt truy cập (traffic) ---------- */
  (function track() {
    try {
      const path = location.pathname;
      if (path.startsWith("/admin")) return;
      let vid = localStorage.getItem("bb_vid");
      if (!vid) { vid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem("bb_vid", vid); }
      const body = JSON.stringify({ path, vid });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    } catch {}
  })();

  /* ---------- Newsletter (demo) ---------- */
  const nl = document.querySelector("#newsletterForm");
  if (nl) {
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = nl.querySelector("button");
      const original = btn.textContent;
      btn.textContent = "✓ Đã đăng ký!";
      nl.reset();
      setTimeout(() => (btn.textContent = original), 3000);
    });
  }

  /* ---------- Set active nav link by filename ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(
    (el) => (el.textContent = new Date().getFullYear())
  );
})();
