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
  if ("IntersectionObserver" in window && revealItems.length) {
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
     Toast helper
     --------------------------------------------------------- */
  const toastEl = document.getElementById("toast");
  const toast = (msg, type = "success") => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `toast show toast-${type}`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3200);
  };

  /* ---------------------------------------------------------
     Form validation + fake submit
     --------------------------------------------------------- */
  const phoneRe = /^(0|\+84)(\d{9,10})$/;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (form, name, message) => {
    const errEl = form.querySelector(`[data-error-for="${name}"]`);
    const input = form.querySelector(`[name="${name}"]`);
    if (errEl) errEl.textContent = message || "";
    if (input) input.classList.toggle("is-invalid", Boolean(message));
  };

  const validateForm = (form) => {
    let ok = true;
    // Reset errors first
    form.querySelectorAll("[data-error-for]").forEach((e) => (e.textContent = ""));
    form.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));

    const name = form.querySelector("[name='name']");
    const phone = form.querySelector("[name='phone']");
    const email = form.querySelector("[name='email']");
    const product = form.querySelector("[name='product']");

    if (name && name.required && name.value.trim().length < 2) {
      setError(form, "name", "Vui lòng nhập họ và tên");
      ok = false;
    }
    if (phone && phone.required) {
      const v = phone.value.replace(/\s+/g, "");
      if (!phoneRe.test(v)) {
        setError(form, "phone", "Số điện thoại không hợp lệ");
        ok = false;
      }
    }
    if (email && email.value.trim() && !emailRe.test(email.value.trim())) {
      setError(form, "email", "Email không đúng định dạng");
      ok = false;
    }
    if (product && product.required && !product.value) {
      setError(form, "product", "Vui lòng chọn loại sản phẩm");
      ok = false;
    }
    return ok;
  };

  document.querySelectorAll(".js-form").forEach((form) => {
    // Live clear errors on input
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        if (field.classList.contains("is-invalid")) {
          field.classList.remove("is-invalid");
          const errEl = form.querySelector(`[data-error-for="${field.name}"]`);
          if (errEl) errEl.textContent = "";
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(form)) {
        toast("Vui lòng kiểm tra lại thông tin", "error");
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      const btn = form.querySelector("button[type='submit']");
      const labelSpan = btn.querySelector("span");
      const original = labelSpan ? labelSpan.textContent : btn.textContent;
      if (labelSpan) labelSpan.textContent = "Đang gửi...";
      else btn.textContent = "Đang gửi...";
      btn.disabled = true;

      // Simulate submit
      setTimeout(() => {
        if (labelSpan) labelSpan.textContent = "Đã gửi yêu cầu ✓";
        else btn.textContent = "Đã gửi yêu cầu ✓";
        toast("Đã gửi yêu cầu. Chuyên viên ACC sẽ liên hệ trong 15 phút!", "success");

        setTimeout(() => {
          if (labelSpan) labelSpan.textContent = original;
          else btn.textContent = original;
          btn.disabled = false;
          form.reset();
        }, 2000);
      }, 900);
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
