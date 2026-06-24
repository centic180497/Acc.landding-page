/**
 * ACC Landing Page – Business License Registration
 * main.js
 */
(function () {
  'use strict';

  /* ===== FAQ ACCORDION ===== */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        // Close all
        document.querySelectorAll('.faq-item').forEach(function (el) {
          el.classList.remove('active');
          const q = el.querySelector('.faq-q');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        // Open clicked
        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ===== SCROLL REVEAL ===== */
  function initReveal() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ===== CONTACT FORM ===== */
  function initForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('#cf-name').value.trim();
      const phone = form.querySelector('#cf-phone').value.trim();

      if (!name) {
        showToast('Vui lòng nhập họ và tên của bạn.', 'error');
        form.querySelector('#cf-name').focus();
        return;
      }

      const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
      if (!phone || !phoneRegex.test(phone.replace(/[\s.]/g, ''))) {
        showToast('Vui lòng nhập số điện thoại hợp lệ (VD: 0912345678).', 'error');
        form.querySelector('#cf-phone').focus();
        return;
      }

      // Simulate send
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Đang gửi...';

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = '✉ Gửi Yêu Cầu Tư Vấn';
        form.reset();
        showToast('✅ Yêu cầu đã được gửi! ACC sẽ liên hệ bạn trong vòng 24h.', 'success');
      }, 1200);
    });

    function showToast(msg, type) {
      if (!toast) return;
      toast.textContent = msg;
      toast.style.background = type === 'error' ? '#c0392b' : '#7a2828';
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 4000);
    }
  }

  /* ===== SMOOTH SCROLL ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ===== STAT COUNTER ===== */
  function initCounters() {
    // Animate stat items on visibility
    const stats = document.querySelectorAll('.stat-item strong');
    if (!stats.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
          entry.target.style.transform = 'scale(1.08)';
          entry.target.style.opacity = '0.7';
          setTimeout(function () {
            entry.target.style.transform = 'scale(1)';
            entry.target.style.opacity = '1';
          }, 300);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(function (el) { obs.observe(el); });
  }

  /* ===== PROCESS STEP HIGHLIGHT ===== */
  function initProcessSteps() {
    const steps = document.querySelectorAll('.proc-step');
    if (!steps.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = Array.from(steps).indexOf(entry.target) * 80;
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    steps.forEach(function (step) {
      step.style.opacity = '0';
      step.style.transform = 'translateX(-16px)';
      step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      obs.observe(step);
    });
  }

  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
    initReveal();
    initForm();
    initSmoothScroll();
    initCounters();
    initProcessSteps();
  });

})();
