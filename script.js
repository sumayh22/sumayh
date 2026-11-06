/* ============================================================
   معرض أعمالي — تفاعلات خفيفة
   ============================================================ */

(function () {
  "use strict";

  /* ---------- السنة الحالية ---------- */
  var yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- ثبات النافبار عند التمرير ---------- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- قائمة الجوال ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- الظهور عند التمرير ---------- */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });

  /* ---------- الكلمة الدوّارة في البطل ---------- */
  var words = document.querySelectorAll("#rotator .rot-word");
  var rotIndex = 0;
  if (words.length) {
    setInterval(function () {
      var current = words[rotIndex];
      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      rotIndex = (rotIndex + 1) % words.length;
      var next = words[rotIndex];
      // إزالة حالة الخروج بعد انتهاء الحركة
      setTimeout(function () {
        current.classList.remove("is-leaving");
      }, 650);
      void next.offsetWidth; // إعادة تشغيل الانتقال
      next.classList.add("is-active");
    }, 2800);
  }

  /* ---------- إمالة بطاقات الأعمال ---------- */
  var fineMotion = window.matchMedia("(pointer: fine)").matches;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (fineMotion && !reducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var rect = null;
      card.addEventListener("mouseenter", function () {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener("mousemove", function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-y * 4).toFixed(2) + "deg) rotateY(" + (x * 5).toFixed(2) + "deg) translateY(-8px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        rect = null;
      });
    });
  }

  /* ---------- توهّج يتبع المؤشر ---------- */
  var glow = document.querySelector(".cursor-glow");
  if (glow && fineMotion && !reducedMotion) {
    var gx = window.innerWidth / 2;
    var gy = window.innerHeight / 2;
    var cx = gx, cy = gy;
    window.addEventListener("mousemove", function (e) {
      gx = e.clientX;
      gy = e.clientY;
    });
    (function follow() {
      cx += (gx - cx) * 0.08;
      cy += (gy - cy) * 0.08;
      glow.style.left = cx + "px";
      glow.style.top = cy + "px";
      requestAnimationFrame(follow);
    })();
  } else if (glow) {
    glow.style.display = "none";
  }
})();
