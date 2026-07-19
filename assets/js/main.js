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
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
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
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

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

  /* ---------- Contact form (demo, no send) ---------- */
  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = form.querySelector(".form-success");
      if (ok) ok.classList.add("show");
      form.reset();
      setTimeout(() => ok && ok.classList.remove("show"), 6000);
    });
  }

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
