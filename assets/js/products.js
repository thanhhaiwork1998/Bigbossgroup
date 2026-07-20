/* ============================================================
   BIG BOSS - Dữ liệu sản phẩm & render trang chi tiết
   ============================================================ */
(function () {
  "use strict";

  const PRODUCTS = {
    1: {
      cat: "Kháng sinh", key: "khang-sinh", emoji: "💊", tag: "BÁN CHẠY", tagClass: "",
      title: "Boss-Amox 50%", target: "Heo, gà, vịt", pack: "Gói 100g · 1kg / Thùng 10kg",
      excerpt: "Kháng sinh phổ rộng Amoxicillin đặc trị bệnh hô hấp và tiêu hóa cho gia súc, gia cầm.",
      intro: "Boss-Amox 50% là kháng sinh phổ rộng nhóm Beta-lactam với hàm lượng Amoxicillin cao, hấp thu nhanh và phân bố tốt trong cơ thể. Sản phẩm được sản xuất trên dây chuyền đạt chuẩn GMP-WHO, đảm bảo hiệu quả điều trị và độ an toàn cao.",
      composition: "Amoxicillin trihydrate .......... 500 mg/g. Tá dược vừa đủ 1 g.",
      uses: [
        "Điều trị viêm phổi, hen suyễn, tụ huyết trùng",
        "Đặc trị tiêu chảy, viêm ruột do vi khuẩn",
        "Nhiễm trùng đường tiết niệu, viêm vú, viêm tử cung",
      ],
      dosage: "Pha 1g/2 lít nước uống hoặc trộn 1g/10kg thể trọng. Dùng liên tục 3–5 ngày.",
    },
    2: {
      cat: "Vaccine", key: "vaccine", emoji: "💉", tag: "MỚI", tagClass: "new",
      title: "Boss-Vac ND-IB", target: "Gà các lứa tuổi", pack: "Lọ 500 liều · 1000 liều",
      excerpt: "Vaccine phòng bệnh Newcastle và viêm phế quản truyền nhiễm cho gà.",
      intro: "Boss-Vac ND-IB là vaccine sống nhược độc phối hợp, phòng đồng thời bệnh Newcastle (dịch tả gà) và viêm phế quản truyền nhiễm (IB). Vaccine cho đáp ứng miễn dịch nhanh, an toàn cho gà con.",
      composition: "Virus Newcastle chủng La Sota và virus IB chủng H120 nhược độc, đông khô.",
      uses: [
        "Phòng bệnh Newcastle (dịch tả gà)",
        "Phòng bệnh viêm phế quản truyền nhiễm IB",
        "Tạo miễn dịch chủ động cho đàn gà",
      ],
      dosage: "Nhỏ mắt/mũi hoặc pha nước uống. Lần 1: 3–5 ngày tuổi, nhắc lại theo lịch thú y.",
    },
    3: {
      cat: "Vitamin", key: "vitamin", emoji: "🧪", tag: "", tagClass: "",
      title: "Boss-Vita C+", target: "Gia súc, gia cầm", pack: "Gói 100g · 1kg",
      excerpt: "Bổ sung Vitamin C và điện giải, chống stress nhiệt, tăng sức đề kháng.",
      intro: "Boss-Vita C+ cung cấp Vitamin C hàm lượng cao kết hợp chất điện giải, giúp vật nuôi giải nhiệt, giảm stress trong điều kiện thời tiết nắng nóng, vận chuyển hoặc sau tiêm phòng.",
      composition: "Vitamin C (Ascorbic acid), Na, K, Cl, Glucose và tá dược.",
      uses: [
        "Chống stress nhiệt trong mùa nắng nóng",
        "Tăng sức đề kháng, phục hồi sau bệnh",
        "Hỗ trợ trước và sau khi tiêm vaccine",
      ],
      dosage: "Pha 1g/1–2 lít nước uống. Dùng liên tục trong giai đoạn stress.",
    },
    4: {
      cat: "Thảo dược", key: "thao-duoc", emoji: "🌿", tag: "BÁN CHẠY", tagClass: "",
      title: "Boss-Herb Detox", target: "Heo, gà, vịt", pack: "Chai 1 lít · 5 lít",
      excerpt: "Chiết xuất thảo dược giải độc gan thận, hỗ trợ chức năng chuyển hóa.",
      intro: "Boss-Herb Detox là sản phẩm thảo dược thiên nhiên giúp giải độc gan, lợi mật và tăng cường chức năng thận. An toàn, không tồn dư, phù hợp với xu hướng chăn nuôi giảm kháng sinh.",
      composition: "Chiết xuất Actiso, Cà gai leo, Bồ công anh, Sorbitol.",
      uses: [
        "Giải độc gan, thận, hỗ trợ chuyển hóa",
        "Phục hồi sau khi dùng kháng sinh dài ngày",
        "Kích thích ăn ngon, tăng trọng đều",
      ],
      dosage: "Pha 1ml/1–2 lít nước uống. Dùng định kỳ 5–7 ngày mỗi tháng.",
    },
    5: {
      cat: "Kháng sinh", key: "khang-sinh", emoji: "💊", tag: "", tagClass: "",
      title: "Boss-Tylo 200", target: "Heo, bò, gà", pack: "Chai 20ml · 100ml",
      excerpt: "Tylosin dạng tiêm, đặc trị bệnh CRD, viêm khớp, viêm vú hiệu quả.",
      intro: "Boss-Tylo 200 chứa Tylosin dạng dung dịch tiêm, đặc trị các bệnh do Mycoplasma và vi khuẩn Gram dương. Tác dụng nhanh, kéo dài, ít gây kích ứng nơi tiêm.",
      composition: "Tylosin tartrate .......... 200 mg/ml. Dung môi vừa đủ 1 ml.",
      uses: [
        "Đặc trị CRD, hen suyễn ở gà",
        "Viêm khớp, viêm phổi ở heo",
        "Viêm vú, viêm tử cung ở bò",
      ],
      dosage: "Tiêm bắp 1ml/10kg thể trọng/ngày. Dùng 3–5 ngày liên tục.",
    },
    6: {
      cat: "Thủy sản", key: "thuy-san", emoji: "🐟", tag: "MỚI", tagClass: "new",
      title: "Boss-Aqua Pro", target: "Tôm, cá", pack: "Gói 1kg · Thùng 20kg",
      excerpt: "Men vi sinh xử lý nước ao nuôi, ổn định môi trường cho tôm cá.",
      intro: "Boss-Aqua Pro là chế phẩm men vi sinh đậm đặc chứa các chủng lợi khuẩn, giúp phân hủy chất hữu cơ, giảm khí độc NH3, H2S và ổn định màu nước ao nuôi.",
      composition: "Bacillus subtilis, Bacillus licheniformis, Lactobacillus, enzyme và chất mang.",
      uses: [
        "Phân hủy mùn bã hữu cơ đáy ao",
        "Giảm khí độc NH3, NO2, H2S",
        "Ổn định pH và màu nước, hạn chế tảo",
      ],
      dosage: "Tạt 1kg cho 2.000–3.000 m³ nước. Định kỳ 5–7 ngày/lần.",
    },
    7: {
      cat: "Vitamin", key: "vitamin", emoji: "🧪", tag: "", tagClass: "",
      title: "Boss-ADE Plus", target: "Gia súc, gia cầm", pack: "Gói 100g · 1kg",
      excerpt: "Vitamin A, D3, E bổ sung sinh trưởng, cải thiện khả năng sinh sản.",
      intro: "Boss-ADE Plus bổ sung đồng thời Vitamin A, D3, E hàm lượng cao, thúc đẩy tăng trưởng, phát triển xương và nâng cao năng suất sinh sản cho vật nuôi.",
      composition: "Vitamin A, Vitamin D3, Vitamin E và tá dược.",
      uses: [
        "Kích thích sinh trưởng, phát triển khung xương",
        "Cải thiện tỷ lệ đẻ, ấp nở",
        "Tăng chất lượng tinh và khả năng thụ thai",
      ],
      dosage: "Pha 1g/2 lít nước uống hoặc trộn thức ăn. Dùng 5–7 ngày/đợt.",
    },
    8: {
      cat: "Vaccine", key: "vaccine", emoji: "💉", tag: "", tagClass: "",
      title: "Boss-Vac PRRS", target: "Heo", pack: "Lọ 10 liều · 25 liều",
      excerpt: "Vaccine phòng hội chứng rối loạn sinh sản và hô hấp ở heo.",
      intro: "Boss-Vac PRRS là vaccine phòng hội chứng rối loạn sinh sản và hô hấp (tai xanh) ở heo, giúp giảm thiệt hại do sảy thai, chết non và bệnh hô hấp trên đàn heo.",
      composition: "Virus PRRS nhược độc, đông khô kèm dung dịch pha.",
      uses: [
        "Phòng bệnh tai xanh (PRRS) ở heo",
        "Giảm sảy thai, chết lưu ở heo nái",
        "Hạn chế bệnh hô hấp ở heo con",
      ],
      dosage: "Tiêm bắp 2ml/con theo lịch của thú y. Nhắc lại định kỳ.",
    },
    9: {
      cat: "Thảo dược", key: "thao-duoc", emoji: "🌿", tag: "", tagClass: "",
      title: "Boss-Immune Herb", target: "Gia súc, gia cầm", pack: "Gói 500g · 1kg",
      excerpt: "Tăng cường miễn dịch tự nhiên từ thảo dược, giảm phụ thuộc kháng sinh.",
      intro: "Boss-Immune Herb kết hợp các thảo dược quý giúp kích thích hệ miễn dịch tự nhiên, nâng cao sức đề kháng và giảm sự phụ thuộc vào kháng sinh trong chăn nuôi.",
      composition: "Chiết xuất Xuyên tâm liên, Kim ngân, Diệp hạ châu, Beta-glucan.",
      uses: [
        "Tăng cường miễn dịch tự nhiên",
        "Hỗ trợ phòng bệnh đường hô hấp, tiêu hóa",
        "Giảm sử dụng kháng sinh, an toàn thực phẩm",
      ],
      dosage: "Trộn 1g/1kg thức ăn hoặc pha nước uống. Dùng định kỳ.",
    },
    10: {
      cat: "Kháng sinh", key: "khang-sinh", emoji: "💊", tag: "", tagClass: "",
      title: "Boss-Flor 300", target: "Heo, bò", pack: "Chai 20ml · 100ml",
      excerpt: "Florfenicol đặc trị viêm phổi, tụ huyết trùng cho heo và bò.",
      intro: "Boss-Flor 300 chứa Florfenicol hàm lượng cao, kháng sinh thế hệ mới đặc trị các bệnh hô hấp phức hợp. Tác dụng kéo dài, chỉ cần tiêm ít lần.",
      composition: "Florfenicol .......... 300 mg/ml. Dung môi vừa đủ 1 ml.",
      uses: [
        "Đặc trị viêm phổi, tụ huyết trùng",
        "Điều trị bệnh hô hấp phức hợp ở heo",
        "Nhiễm khuẩn đường tiêu hóa",
      ],
      dosage: "Tiêm bắp 1ml/15kg thể trọng. Nhắc lại sau 48 giờ nếu cần.",
    },
    11: {
      cat: "Thủy sản", key: "thuy-san", emoji: "🐟", tag: "", tagClass: "",
      title: "Boss-Shrimp Grow", target: "Tôm sú, tôm thẻ", pack: "Gói 1kg · Thùng 25kg",
      excerpt: "Khoáng tạt bổ sung canxi, giúp tôm nhanh cứng vỏ, lớn đều.",
      intro: "Boss-Shrimp Grow là khoáng chất tạt cao cấp bổ sung Canxi, Magie, Kali và khoáng vi lượng, giúp tôm nhanh cứng vỏ sau lột xác, giảm cong thân đục cơ và lớn đồng đều.",
      composition: "Canxi, Magie, Kali, Phospho và khoáng vi lượng chelate.",
      uses: [
        "Giúp tôm nhanh cứng vỏ sau lột xác",
        "Giảm cong thân, đục cơ, mềm vỏ",
        "Kích thích tôm lột đồng loạt, lớn đều",
      ],
      dosage: "Tạt 1kg/1.000–1.500 m³ nước, định kỳ 3–5 ngày/lần, tăng vào kỳ lột xác.",
    },
    12: {
      cat: "Vitamin", key: "vitamin", emoji: "🧪", tag: "BÁN CHẠY", tagClass: "",
      title: "Boss-Electrolyte", target: "Gia súc, gia cầm", pack: "Gói 100g · 1kg",
      excerpt: "Bù điện giải nhanh, phục hồi sức khỏe sau bệnh và vận chuyển.",
      intro: "Boss-Electrolyte cung cấp hỗn hợp chất điện giải và đường glucose, bù nước nhanh, cân bằng điện giải và phục hồi sức khỏe cho vật nuôi sau khi bệnh, tiêu chảy hoặc vận chuyển.",
      composition: "Na, K, Cl, Glucose, Glycine và Vitamin bổ sung.",
      uses: [
        "Bù nước và điện giải khi tiêu chảy, mất nước",
        "Phục hồi sức khỏe sau bệnh, sau vận chuyển",
        "Giảm stress, tăng lượng nước uống",
      ],
      dosage: "Pha 1g/1–2 lít nước uống. Dùng đến khi vật nuôi hồi phục.",
    },
  };

  // ---------- Render ----------
  const params = new URLSearchParams(location.search);
  let id = parseInt(params.get("id"), 10);
  if (!PRODUCTS[id]) id = 1;
  const p = PRODUCTS[id];

  const set = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.innerHTML = val;
  };

  document.title = p.title + " — Big Boss";
  set("#p-cat", p.cat);
  set("#p-title", p.title);
  set("#p-crumb", p.title);
  set("#p-emoji", p.emoji);
  set("#p-emoji2", p.emoji);
  set("#p-excerpt", p.excerpt);
  set("#p-target", p.target);
  set("#p-target2", p.target);
  set("#p-pack", p.pack);
  set("#p-pack2", p.pack);
  set("#p-code", "BB-" + String(id).padStart(3, "0"));
  set("#p-intro", `<p>${p.intro}</p>`);
  set("#p-composition", p.composition);
  set("#p-dosage", p.dosage);
  set("#p-uses", p.uses.map((u) => `<li>${u}</li>`).join(""));
  set("#p-features", p.uses.map((u) => `<li><span class="ck">✓</span>${u}</li>`).join(""));

  // tag badge
  const tagEl = document.querySelector("#p-tag");
  if (tagEl) {
    if (p.tag) {
      tagEl.textContent = p.tag;
      tagEl.className = "prod-badge " + (p.tagClass || "");
    } else {
      tagEl.style.display = "none";
    }
  }

  // ---------- Related (cùng danh mục ưu tiên) ----------
  const relatedWrap = document.querySelector("#p-related");
  if (relatedWrap) {
    const all = Object.keys(PRODUCTS).filter((k) => +k !== id);
    const same = all.filter((k) => PRODUCTS[k].key === p.key);
    const others = all.filter((k) => PRODUCTS[k].key !== p.key);
    const pick = same.concat(others).slice(0, 4);
    relatedWrap.innerHTML = pick
      .map((k) => {
        const r = PRODUCTS[k];
        const tag = r.tag ? `<span class="tag ${r.tagClass}">${r.tag}</span>` : "";
        return `<a class="prod-card" href="chi-tiet-san-pham.html?id=${k}">
          <div class="prod-thumb">${r.emoji}${tag}</div>
          <div class="prod-body">
            <span class="prod-cat">${r.cat}</span>
            <h3>${r.title}</h3>
            <p>${r.excerpt}</p>
            <div class="prod-foot"><span class="price">Liên hệ</span><span class="more">→</span></div>
          </div>
        </a>`;
      })
      .join("");
  }
})();
