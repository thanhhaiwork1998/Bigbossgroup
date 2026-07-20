/* ============================================================
   BIG BOSS - Dữ liệu bài viết & render trang chi tiết
   ============================================================ */
(function () {
  "use strict";

  const ARTICLES = {
    1: {
      cat: "Nổi bật", date: "19/07/2026", author: "Phòng R&D", read: "5 phút", emoji: "💉",
      title: "Big Boss ra mắt dòng vaccine thế hệ mới phòng cúm gia cầm H5N1",
      excerpt: "Sản phẩm vaccine công nghệ tái tổ hợp, cho hiệu quả bảo hộ cao và thời gian miễn dịch kéo dài, đánh dấu bước tiến mới của Big Boss trong lĩnh vực phòng bệnh gia cầm.",
      body: `
        <p>Ngày 19/07/2026, Công ty Big Boss chính thức giới thiệu dòng vaccine thế hệ mới <strong>Boss-Vac H5N1 Gen2</strong>, ứng dụng công nghệ tái tổ hợp tiên tiến nhằm nâng cao khả năng bảo hộ cho đàn gia cầm trước chủng cúm độc lực cao.</p>
        <h2>Công nghệ tái tổ hợp vượt trội</h2>
        <p>Khác với vaccine bất hoạt truyền thống, dòng sản phẩm mới sử dụng kháng nguyên tái tổ hợp giúp kích thích đáp ứng miễn dịch nhanh và mạnh hơn. Nhờ đó, đàn gia cầm được bảo vệ ngay từ những ngày đầu sau khi tiêm phòng.</p>
        <div class="callout"><span class="callout-ic">💡</span><div><b>Điểm nổi bật</b><p>Thời gian miễn dịch kéo dài tới 12 tháng, giảm số lần tái chủng và tối ưu chi phí cho người chăn nuôi.</p></div></div>
        <h2>Hiệu quả đã được kiểm chứng</h2>
        <p>Qua thử nghiệm thực địa trên nhiều trang trại quy mô lớn, vaccine cho tỷ lệ bảo hộ trên 95%, không ghi nhận phản ứng phụ đáng kể. Đây là cơ sở quan trọng để Big Boss mở rộng phân phối trên toàn quốc.</p>
        <ul>
          <li>Tỷ lệ bảo hộ đàn đạt trên 95%</li>
          <li>An toàn cho gà con từ 7 ngày tuổi</li>
          <li>Bảo quản ổn định ở 2–8°C</li>
        </ul>
        <p>Với việc ra mắt sản phẩm này, Big Boss tiếp tục khẳng định cam kết đồng hành cùng người chăn nuôi trong công tác phòng chống dịch bệnh, hướng tới một nền chăn nuôi an toàn và bền vững.</p>
      `,
    },
    2: {
      cat: "Chăn nuôi", date: "18/07/2026", author: "BS. Thú y", read: "6 phút", emoji: "🐖",
      title: "5 lưu ý phòng bệnh dịch tả heo châu Phi mùa mưa",
      excerpt: "Mùa mưa là thời điểm dịch tả heo châu Phi dễ bùng phát. Nắm vững 5 nguyên tắc dưới đây giúp bà con bảo vệ đàn heo an toàn.",
      body: `
        <p>Dịch tả heo châu Phi (ASF) là bệnh truyền nhiễm nguy hiểm, chưa có vaccine đặc hiệu phổ biến và tỷ lệ chết rất cao. Vào mùa mưa, độ ẩm và mầm bệnh trong môi trường tăng cao khiến nguy cơ lây lan lớn hơn.</p>
        <h2>1. Siết chặt an toàn sinh học</h2>
        <p>Hạn chế tối đa người và phương tiện ra vào khu chăn nuôi. Bố trí hố sát trùng ở cổng trại và thay đồ bảo hộ trước khi vào chuồng.</p>
        <h2>2. Sát trùng định kỳ</h2>
        <p>Phun sát trùng chuồng trại, lối đi và dụng cụ ít nhất 2 lần/tuần bằng các sản phẩm chuyên dụng, tăng tần suất khi khu vực có ổ dịch.</p>
        <div class="callout"><span class="callout-ic">⚠️</span><div><b>Cảnh báo</b><p>Không sử dụng thức ăn thừa chưa qua xử lý nhiệt cho heo — đây là nguồn lây ASF phổ biến.</p></div></div>
        <h2>3. Kiểm soát nguồn thức ăn, nước uống</h2>
        <p>Đảm bảo thức ăn có nguồn gốc rõ ràng, nước uống sạch. Che chắn kho thức ăn tránh chuột, côn trùng mang mầm bệnh.</p>
        <h2>4. Theo dõi sức khỏe đàn hằng ngày</h2>
        <p>Phát hiện sớm heo sốt cao, bỏ ăn, da đỏ tím để cách ly kịp thời và báo ngay cho thú y địa phương.</p>
        <h2>5. Tăng sức đề kháng</h2>
        <p>Bổ sung vitamin, điện giải và men vi sinh giúp đàn heo khỏe mạnh, chống chịu tốt hơn trong điều kiện thời tiết bất lợi.</p>
      `,
    },
    3: {
      cat: "Kỹ thuật", date: "17/07/2026", author: "Phòng Kỹ thuật", read: "4 phút", emoji: "🌡️",
      title: "Chống stress nhiệt cho đàn gà trong ngày nắng nóng",
      excerpt: "Nắng nóng kéo dài khiến gà giảm ăn, giảm đẻ và tăng tỷ lệ chết. Áp dụng ngay các biện pháp làm mát và bổ sung dinh dưỡng hợp lý.",
      body: `
        <p>Khi nhiệt độ vượt 32°C, gà rất dễ bị stress nhiệt dẫn đến giảm năng suất và nguy cơ chết cao, đặc biệt ở gà đẻ và gà thịt giai đoạn cuối.</p>
        <h2>Dấu hiệu nhận biết</h2>
        <ul>
          <li>Gà há mỏ thở gấp, dang cánh</li>
          <li>Uống nhiều nước, giảm ăn rõ rệt</li>
          <li>Gà đẻ giảm sản lượng, vỏ trứng mỏng</li>
        </ul>
        <h2>Giải pháp làm mát chuồng</h2>
        <p>Lắp đặt hệ thống phun sương, quạt thông gió và tăng độ che phủ mái. Điều chỉnh mật độ nuôi phù hợp để không khí lưu thông tốt.</p>
        <div class="callout"><span class="callout-ic">💧</span><div><b>Mẹo</b><p>Cho gà ăn vào sáng sớm và chiều mát, tránh giờ nắng gắt để duy trì lượng ăn ổn định.</p></div></div>
        <h2>Bổ sung dinh dưỡng</h2>
        <p>Sử dụng Vitamin C, điện giải và chất chống oxy hóa pha nước uống giúp gà hạ nhiệt, phục hồi nhanh và duy trì sức đề kháng trong những ngày cao điểm nắng nóng.</p>
      `,
    },
    4: {
      cat: "Sự kiện", date: "15/07/2026", author: "Truyền thông", read: "3 phút", emoji: "🏆",
      title: 'Big Boss đạt giải "Thương hiệu thú y tin dùng 2026"',
      excerpt: "Giải thưởng ghi nhận nỗ lực không ngừng của Big Boss trong việc mang đến sản phẩm chất lượng và dịch vụ tận tâm cho người chăn nuôi Việt Nam.",
      body: `
        <p>Tại lễ vinh danh diễn ra ngày 15/07/2026, Công ty Big Boss vinh dự nhận giải thưởng <strong>"Thương hiệu thú y tin dùng 2026"</strong> do người tiêu dùng và hội đồng chuyên môn bình chọn.</p>
        <h2>Hành trình được ghi nhận</h2>
        <p>Sau hơn 15 năm phát triển, Big Boss đã xây dựng được hệ thống sản phẩm đa dạng đạt chuẩn GMP-WHO cùng mạng lưới phân phối phủ khắp 63 tỉnh thành.</p>
        <div class="callout"><span class="callout-ic">🎉</span><div><b>Cảm ơn</b><p>Giải thưởng này là động lực để chúng tôi tiếp tục nâng cao chất lượng và phục vụ khách hàng tốt hơn nữa.</p></div></div>
        <p>Đại diện công ty chia sẻ, thành tựu này thuộc về niềm tin của hàng chục nghìn trang trại đã đồng hành cùng thương hiệu trong suốt thời gian qua. Big Boss cam kết sẽ tiếp tục đầu tư vào nghiên cứu và dịch vụ hậu mãi.</p>
      `,
    },
    5: {
      cat: "Sản phẩm", date: "19/07/2026", author: "Phòng Kỹ thuật", read: "4 phút", emoji: "💉",
      title: "Hướng dẫn sử dụng vaccine đúng cách để đạt hiệu quả tối đa",
      excerpt: "Bảo quản, pha chế và tiêm vaccine đúng kỹ thuật là yếu tố quyết định hiệu quả phòng bệnh. Cùng Big Boss điểm qua quy trình chuẩn.",
      body: `
        <p>Vaccine chỉ phát huy hiệu quả khi được bảo quản và sử dụng đúng cách. Sai sót nhỏ trong quá trình thao tác có thể làm giảm hoặc mất hoàn toàn tác dụng bảo hộ.</p>
        <h2>Bảo quản đúng nhiệt độ</h2>
        <p>Luôn giữ vaccine trong khoảng 2–8°C, tránh ánh nắng trực tiếp và không để đông đá. Sử dụng thùng lạnh khi vận chuyển.</p>
        <h2>Pha chế và sử dụng</h2>
        <ul>
          <li>Dùng nước pha chuyên dụng, pha đủ liều dùng trong 1–2 giờ</li>
          <li>Lắc đều trước khi sử dụng</li>
          <li>Không dùng chung với kháng sinh hoặc chất sát trùng</li>
        </ul>
        <div class="callout"><span class="callout-ic">✅</span><div><b>Ghi nhớ</b><p>Tiêm đúng liều, đúng vị trí và đúng lịch theo hướng dẫn của nhà sản xuất để đạt miễn dịch tốt nhất.</p></div></div>
        <p>Sau khi tiêm, cần theo dõi đàn vật nuôi trong 24–48 giờ để phát hiện sớm các phản ứng bất thường và xử lý kịp thời.</p>
      `,
    },
    6: {
      cat: "Chăn nuôi", date: "18/07/2026", author: "BS. Thú y", read: "6 phút", emoji: "🐄",
      title: "Bí quyết tăng năng suất sữa cho đàn bò trong mùa hè",
      excerpt: "Nhiệt độ cao ảnh hưởng trực tiếp đến sản lượng sữa. Áp dụng chế độ dinh dưỡng và quản lý phù hợp để duy trì năng suất ổn định.",
      body: `
        <p>Mùa hè là thách thức lớn với bò sữa: nắng nóng làm giảm lượng ăn, tăng stress và kéo theo sản lượng sữa sụt giảm đáng kể.</p>
        <h2>Chế độ dinh dưỡng hợp lý</h2>
        <p>Tăng khẩu phần thức ăn tinh giàu năng lượng, bổ sung khoáng và vitamin. Cung cấp nước sạch mát không giới hạn suốt cả ngày.</p>
        <div class="callout"><span class="callout-ic">🥛</span><div><b>Lưu ý</b><p>Cho bò ăn vào thời điểm mát trong ngày giúp tăng lượng ăn và duy trì sản lượng sữa.</p></div></div>
        <h2>Quản lý chuồng trại</h2>
        <ul>
          <li>Bố trí quạt và hệ thống phun sương làm mát</li>
          <li>Đảm bảo chuồng thông thoáng, sạch sẽ</li>
          <li>Giảm mật độ nuôi trong giai đoạn cao điểm nắng nóng</li>
        </ul>
        <p>Kết hợp bổ sung men tiêu hóa và chất điện giải sẽ giúp đàn bò khỏe mạnh, hạn chế stress nhiệt và giữ vững năng suất sữa trong suốt mùa hè.</p>
      `,
    },
    7: {
      cat: "Phòng bệnh", date: "17/07/2026", author: "Phòng R&D", read: "5 phút", emoji: "🦠",
      title: "An toàn sinh học: Lá chắn bảo vệ trang trại khỏi dịch bệnh",
      excerpt: "An toàn sinh học là biện pháp phòng bệnh hiệu quả và tiết kiệm nhất. Xây dựng quy trình chặt chẽ giúp trang trại chủ động trước dịch bệnh.",
      body: `
        <p>An toàn sinh học là tập hợp các biện pháp ngăn chặn mầm bệnh xâm nhập và lây lan trong trang trại. Đây được xem là "lá chắn" quan trọng nhất trong chăn nuôi hiện đại.</p>
        <h2>Ba nguyên tắc cốt lõi</h2>
        <ul>
          <li><b>Cách ly:</b> kiểm soát người, phương tiện và động vật ra vào</li>
          <li><b>Vệ sinh:</b> làm sạch trước khi sát trùng</li>
          <li><b>Sát trùng:</b> tiêu diệt mầm bệnh định kỳ</li>
        </ul>
        <div class="callout"><span class="callout-ic">🛡️</span><div><b>Nguyên tắc vàng</b><p>Phòng bệnh luôn rẻ hơn và hiệu quả hơn chữa bệnh rất nhiều lần.</p></div></div>
        <h2>Triển khai thực tế</h2>
        <p>Bố trí hố sát trùng tại cổng, khu vực thay đồ bảo hộ, và lịch phun khử khuẩn cố định. Ghi chép nhật ký ra vào để truy vết khi cần.</p>
        <p>Một quy trình an toàn sinh học được duy trì nghiêm túc sẽ giúp trang trại giảm đáng kể nguy cơ bùng phát dịch và ổn định hiệu quả chăn nuôi.</p>
      `,
    },
    8: {
      cat: "Thủy sản", date: "16/07/2026", author: "Phòng Kỹ thuật", read: "5 phút", emoji: "🐟",
      title: "Quản lý chất lượng nước ao nuôi tôm trong giai đoạn chuyển mùa",
      excerpt: "Chuyển mùa khiến môi trường ao nuôi biến động mạnh. Kiểm soát tốt các chỉ tiêu nước là chìa khóa cho vụ tôm thành công.",
      body: `
        <p>Giai đoạn chuyển mùa với những cơn mưa bất chợt khiến các chỉ tiêu môi trường ao nuôi thay đổi nhanh, dễ gây sốc và bệnh cho tôm.</p>
        <h2>Các chỉ tiêu cần theo dõi</h2>
        <ul>
          <li>pH: duy trì ổn định 7.5–8.5</li>
          <li>Oxy hòa tan: trên 4 mg/L</li>
          <li>Độ kiềm và độ mặn phù hợp từng giai đoạn</li>
        </ul>
        <div class="callout"><span class="callout-ic">🌊</span><div><b>Mẹo</b><p>Sau mưa lớn nên tạt vôi và bổ sung khoáng để ổn định pH và độ kiềm cho ao.</p></div></div>
        <h2>Sử dụng men vi sinh</h2>
        <p>Định kỳ bổ sung men vi sinh giúp phân hủy chất hữu cơ, giảm khí độc và duy trì hệ vi sinh có lợi trong ao.</p>
        <p>Quản lý nước tốt kết hợp cho ăn hợp lý sẽ giúp tôm khỏe mạnh, lớn nhanh và hạn chế tối đa rủi ro dịch bệnh trong giai đoạn nhạy cảm này.</p>
      `,
    },
    9: {
      cat: "Kỹ thuật", date: "15/07/2026", author: "BS. Thú y", read: "4 phút", emoji: "🐔",
      title: "Phòng và trị bệnh cầu trùng ở gà thịt hiệu quả",
      excerpt: "Cầu trùng là bệnh phổ biến gây thiệt hại lớn cho gà thịt. Nhận biết sớm và điều trị đúng phác đồ giúp giảm tối đa tổn thất.",
      body: `
        <p>Bệnh cầu trùng do ký sinh trùng Eimeria gây ra, thường bùng phát ở gà 2–6 tuần tuổi trong điều kiện chuồng nuôi ẩm ướt.</p>
        <h2>Triệu chứng nhận biết</h2>
        <ul>
          <li>Gà ủ rũ, xù lông, giảm ăn</li>
          <li>Phân có máu hoặc màu nâu sẫm</li>
          <li>Chậm lớn, tỷ lệ chết tăng nếu không điều trị</li>
        </ul>
        <div class="callout"><span class="callout-ic">🩺</span><div><b>Phác đồ</b><p>Sử dụng thuốc đặc trị cầu trùng kết hợp bổ sung vitamin K và điện giải để cầm máu và phục hồi.</p></div></div>
        <h2>Biện pháp phòng ngừa</h2>
        <p>Giữ chuồng khô ráo, thay chất độn thường xuyên và sử dụng thuốc phòng cầu trùng theo lịch. Đảm bảo mật độ nuôi hợp lý để hạn chế lây lan.</p>
        <p>Phát hiện sớm và điều trị kịp thời là yếu tố then chốt giúp giảm thiệt hại kinh tế do bệnh cầu trùng gây ra.</p>
      `,
    },
    10: {
      cat: "Xu hướng", date: "14/07/2026", author: "Phòng R&D", read: "7 phút", emoji: "🌿",
      title: "Xu hướng chăn nuôi giảm kháng sinh: Cơ hội và thách thức",
      excerpt: "Giảm phụ thuộc kháng sinh là xu hướng tất yếu của ngành chăn nuôi hiện đại. Thảo dược và men vi sinh đang mở ra hướng đi bền vững.",
      body: `
        <p>Trước áp lực về an toàn thực phẩm và kháng kháng sinh, ngành chăn nuôi toàn cầu đang chuyển dịch mạnh mẽ sang mô hình giảm và thay thế kháng sinh.</p>
        <h2>Vì sao cần giảm kháng sinh?</h2>
        <p>Việc lạm dụng kháng sinh dẫn đến hiện tượng kháng thuốc, tồn dư trong sản phẩm và ảnh hưởng đến sức khỏe cộng đồng. Nhiều thị trường xuất khẩu đã siết chặt quy định về vấn đề này.</p>
        <div class="callout"><span class="callout-ic">🌱</span><div><b>Giải pháp</b><p>Thảo dược, men vi sinh và acid hữu cơ là những lựa chọn thay thế tiềm năng, an toàn và thân thiện môi trường.</p></div></div>
        <h2>Cơ hội cho người chăn nuôi</h2>
        <ul>
          <li>Nâng cao giá trị và uy tín sản phẩm</li>
          <li>Mở rộng cơ hội xuất khẩu</li>
          <li>Hướng tới chăn nuôi bền vững</li>
        </ul>
        <p>Big Boss đã và đang đầu tư nghiên cứu các dòng sản phẩm thảo dược và probiotic, đồng hành cùng người chăn nuôi trong quá trình chuyển đổi tất yếu này.</p>
      `,
    },
  };

  // ---------- Render ----------
  const params = new URLSearchParams(location.search);
  let id = parseInt(params.get("id"), 10);
  if (!ARTICLES[id]) id = 1;
  const a = ARTICLES[id];

  const set = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.innerHTML = val;
  };

  document.title = a.title + " — Big Boss";
  set("#a-cat", a.cat);
  set("#a-title", a.title);
  set("#a-crumb", a.title);
  set("#a-meta", `📅 ${a.date} · ✍️ ${a.author} · ⏱️ ${a.read} đọc`);
  set("#a-emoji", a.emoji);
  set("#a-emoji2", a.emoji);
  set("#a-excerpt", a.excerpt);
  set("#a-body", a.body);

  // ---------- Related (3 khác) ----------
  const relatedWrap = document.querySelector("#a-related");
  if (relatedWrap) {
    const ids = Object.keys(ARTICLES).filter((k) => +k !== id).slice(0, 4);
    relatedWrap.innerHTML = ids
      .map((k) => {
        const r = ARTICLES[k];
        return `<a class="related-item" href="bai-viet.html?id=${k}">
          <div class="thumb">${r.emoji}</div>
          <div><span class="n-cat">${r.cat}</span><h4>${r.title}</h4><div class="meta">📅 ${r.date}</div></div>
        </a>`;
      })
      .join("");
  }

  // ---------- Share (demo) ----------
  document.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const type = btn.dataset.share;
      if (type === "copy") {
        navigator.clipboard && navigator.clipboard.writeText(location.href);
        const old = btn.getAttribute("title");
        btn.setAttribute("title", "Đã sao chép!");
        setTimeout(() => btn.setAttribute("title", old || ""), 2000);
      }
    });
  });
})();
