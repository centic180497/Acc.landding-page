/**
 * Công ty Luật ACC – Landing Page Tư vấn Ly hôn
 * script.js  |  Vanilla JS, ES5-compatible
 */

(function () {
  'use strict';

  /* ===== STICKY HEADER ===== */
  function initStickyHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run on init
  }

  /* ===== STICKY CTA BAR ===== */
  function initStickyCTA() {
    var stickyCTA = document.getElementById('sticky-cta');
    if (!stickyCTA) return;

    var THRESHOLD = 500;

    function onScroll() {
      if (window.scrollY > THRESHOLD) {
        stickyCTA.classList.add('show');
      } else {
        stickyCTA.classList.remove('show');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===== MOBILE NAV ===== */
  function initMobileNav() {
    var hamburger  = document.getElementById('hamburger-btn');
    var mobileNav  = document.getElementById('mobile-nav');
    var closeBtn   = document.getElementById('close-nav-btn');
    if (!hamburger || !mobileNav) return;

    function openNav() {
      mobileNav.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeNav() {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    // Close on overlay click
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) closeNav();
    });

    // Close on nav link click
    var navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeNav();
      }
    });
  }

  /* ===== SCROLL REVEAL ANIMATIONS ===== */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll(
      '.fade-up, .fade-left, .fade-right, .zoom-in'
    );
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all immediately
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* ===== FAQ ACCORDION ===== */
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(function (el) {
          el.classList.remove('active');
          var q = el.querySelector('.faq-q');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked
        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ===== SMOOTH SCROLL ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var headerHeight = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ===== CONTACT FORM ===== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var toast = document.getElementById('toast');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameField  = form.querySelector('#cf-name');
      var phoneField = form.querySelector('#cf-phone');
      var submitBtn  = form.querySelector('#form-submit-btn');

      var name  = nameField ? nameField.value.trim() : '';
      var phone = phoneField ? phoneField.value.trim() : '';

      // Validation
      if (!name) {
        showToast('Vui lòng nhập họ và tên của bạn.', 'error');
        if (nameField) nameField.focus();
        return;
      }

      var phonePattern = /^(0|\+84)[0-9]{8,10}$/;
      if (!phone || !phonePattern.test(phone.replace(/[\s.\-]/g, ''))) {
        showToast('Vui lòng nhập số điện thoại hợp lệ (VD: 0912 345 678).', 'error');
        if (phoneField) phoneField.focus();
        return;
      }

      // Simulate sending
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Đang gửi...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '✉ Gửi Yêu Cầu Tư Vấn';
        }
        form.reset();
        showToast('✅ Yêu cầu đã gửi! Luật sư ACC sẽ liên hệ bạn trong thời gian sớm nhất.', 'success');
      }, 1400);
    });

    function showToast(message, type) {
      if (!toast) return;
      toast.textContent = message;
      toast.style.background = type === 'error' ? '#b91c1c' : '#1B8A3D';
      toast.classList.add('show');
      setTimeout(function () {
        toast.classList.remove('show');
      }, 4500);
    }
  }

  /* ===== PROCESS STEPS STAGGER ANIMATION ===== */
  function initProcessAnimation() {
    var steps = document.querySelectorAll('.proc-item');
    if (!steps.length || !('IntersectionObserver' in window)) return;

    // Set initial state
    steps.forEach(function (step) {
      step.style.opacity = '0';
      step.style.transform = 'translateY(20px)';
      step.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.prototype.indexOf.call(steps, entry.target);
          var delay = index * 120;
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    steps.forEach(function (step) {
      observer.observe(step);
    });
  }

  /* ===== SERVICE CARDS STAGGER ===== */
  function initServiceCards() {
    var cards = document.querySelectorAll('.svc-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(18px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.prototype.indexOf.call(cards, entry.target);
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* ===== STAT COUNTER ANIMATION ===== */
  function initCounters() {
    var stats = document.querySelectorAll('.hc-stat strong, .istat strong');
    if (!stats.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var rawText = el.textContent.trim();
          var suffix = rawText.replace(/[0-9]/g, '');
          var num = parseInt(rawText.replace(/[^0-9]/g, ''), 10);

          if (isNaN(num) || num === 0) {
            observer.unobserve(el);
            return;
          }

          var duration = 1200;
          var steps = 40;
          var stepTime = Math.floor(duration / steps);
          var increment = num / steps;
          var current = 0;
          var timer = setInterval(function () {
            current += increment;
            if (current >= num) {
              current = num;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ===== DISPUTE ITEMS ANIMATION ===== */
  function initDisputeAnimation() {
    var items = document.querySelectorAll('.disp-item');
    if (!items.length || !('IntersectionObserver' in window)) return;

    items.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.92)';
      item.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.prototype.indexOf.call(items, entry.target);
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
          }, index * 70);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ===== ACTIVE NAV LINK ===== */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.hdr-nav a');
    if (!sections.length || !navLinks.length) return;

    function onScroll() {
      var scrollPos = window.scrollY + 120;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var bottom = top + section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < bottom) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===== FLOATING BUTTONS PULSE ===== */
  function initFloatingPulse() {
    var phoneBtn = document.querySelector('.float-btn--tel');
    if (!phoneBtn) return;
    // CSS animation handles the pulse via @keyframes pulse-green
  }

  /* ===== DOC ITEMS ANIMATION ===== */
  function initDocItems() {
    var items = document.querySelectorAll('.doc-item');
    if (!items.length || !('IntersectionObserver' in window)) return;

    items.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-12px)';
      item.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.prototype.indexOf.call(items, entry.target);
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          }, index * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ===== ROLE ITEMS ANIMATION ===== */
  function initRoleItems() {
    var items = document.querySelectorAll('.role-item');
    if (!items.length || !('IntersectionObserver' in window)) return;

    items.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateX(16px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.prototype.indexOf.call(items, entry.target);
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ===== TIMELINE CARDS ANIMATION ===== */
  function initTimelineCards() {
    var cards = document.querySelectorAll('.tl-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    cards.forEach(function (card, i) {
      card.style.opacity = '0';
      card.style.transform = i % 2 === 0 ? 'translateX(-20px)' : 'translateX(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* ===== HERO POINTS STAGGER ===== */
  function initHeroPoints() {
    var points = document.querySelectorAll('.hero__pts li');
    points.forEach(function (li, i) {
      li.style.opacity = '0';
      li.style.transform = 'translateX(-14px)';
      li.style.transition = 'opacity 0.4s ease ' + (0.8 + i * 0.12) + 's, transform 0.4s ease ' + (0.8 + i * 0.12) + 's';
      setTimeout(function () {
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
      }, 800 + i * 120);
    });
  }

  /* ===== INIT ALL ===== */
  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initStickyCTA();
    initMobileNav();
    initScrollReveal();
    initFAQ();
    initSmoothScroll();
    initContactForm();
    initProcessAnimation();
    initServiceCards();
    initCounters();
    initDisputeAnimation();
    initActiveNav();
    initFloatingPulse();
    initDocItems();
    initRoleItems();
    initTimelineCards();
    initHeroPoints();
  });

})();
