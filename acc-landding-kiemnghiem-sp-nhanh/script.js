/* =========================================================
   ACC Landing - Kiểm nghiệm sản phẩm
   Reveal · Accordion · Testimonial slider · Form validation · Toast
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal");
  if (("IntersectionObserver" in window) ? Boolean(revealItems.length) : false) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((item, i) => {
      item.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      io.observe(item);
    });
  } else {
    revealItems.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------------------------------------------------
     Accordion (FAQ + sản phẩm bắt buộc kiểm nghiệm)
     --------------------------------------------------------- */
  document.querySelectorAll(".accordion-list").forEach((list) => {
    const items = list.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const btn = item.querySelector(".accordion-button");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        // Close siblings inside the same list (single-open behavior)
        items.forEach((it) => it.classList.remove("active"));
        if (!isActive) item.classList.add("active");
      });
    });
  });

  /* ---------------------------------------------------------
     Testimonial / Reason slider (multi-instance)
     --------------------------------------------------------- */
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector("[data-slider-track]");
    const slides = slider.querySelectorAll("[data-slide]");
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");
    const dotsHost = slider.querySelector("[data-slider-dots]");
    if (!track || !slides.length) return;

    const type = slider.dataset.sliderType || "testimonial";
    let index = 0;
    let perView = 0;
    let timer = null;

    const computePerView = () => {
      const w = window.innerWidth;
      if (type === "reason") {
        if (w >= 1080) return 3;
        if (w >= 720) return 2;
        return 1;
      }
      if (w >= 1080) return 3;
      if (w >= 720) return 2;
      return 1;
    };

    const totalPages = () => Math.max(1, Math.ceil(slides.length / perView));

    const buildDots = () => {
      if (!dotsHost) return;
      dotsHost.innerHTML = "";
      const pages = totalPages();
      for (let p = 0; p < pages; p++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "testimonial-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Trang ${p + 1}`);
        dot.addEventListener("click", () => goTo(p));
        dotsHost.appendChild(dot);
      }
    };

    const update = () => {
      const slideWidth = slides[0].offsetWidth;
      const slideGap = type === "reason" ? 12 : 12;
      const moveX = (slideWidth + slideGap) * perView * index;
      track.style.transform = `translateX(${-moveX}px)`;
      if (dotsHost) {
        dotsHost.querySelectorAll(".testimonial-dot").forEach((d, i) => {
          d.classList.toggle("active", i === index);
        });
      }
    };

    const goTo = (i) => {
      const pages = totalPages();
      index = ((i % pages) + pages) % pages;
      update();
    };

    const nextSlide = () => goTo(index + 1);
    const prevSlide = () => goTo(index - 1);

    const setPerView = () => {
      const newPerView = computePerView();
      if (newPerView !== perView) {
        perView = newPerView;
        track.style.setProperty("--per-view", perView);
        buildDots();
        index = 0;
        update();
      }
    };

    if (next) next.addEventListener("click", nextSlide);
    if (prev) prev.addEventListener("click", prevSlide);

    const start = () => {
      stop();
      timer = setInterval(nextSlide, 6500);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    let touchStartX = 0;
    let touchDeltaX = 0;
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
        stop();
      },
      { passive: true }
    );
    track.addEventListener(
      "touchmove",
      (e) => {
        touchDeltaX = e.touches[0].clientX - touchStartX;
      },
      { passive: true }
    );
    track.addEventListener("touchend", () => {
      if (Math.abs(touchDeltaX) > 40) {
        if (touchDeltaX < 0) nextSlide();
        else prevSlide();
      }
      start();
    });

    // Mouse drag (desktop)
    let mouseStartX = 0;
    let mouseDeltaX = 0;
    let isDragging = false;
    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      mouseStartX = e.clientX;
      mouseDeltaX = 0;
      track.style.cursor = "grabbing";
      stop();
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      mouseDeltaX = e.clientX - mouseStartX;
    });
    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = "grab";
      if (Math.abs(mouseDeltaX) > 40) {
        if (mouseDeltaX < 0) nextSlide();
        else prevSlide();
      }
      start();
    });

    setPerView();
    update();
    start();
    window.addEventListener("resize", () => {
      setPerView();
    });
  });

  /* ---------------------------------------------------------
     Smooth scroll for in-page anchors (with header offset)
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

})();
