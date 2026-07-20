/**
 * Công ty Luật ACC – Landing Page Tư vấn Ly hôn
 */
(function () {
  'use strict';

  var IO = 'IntersectionObserver' in window;

  /* Fade-up / left / right reveal */
  function initReveal() {
    var els = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    if (!els.length) return;
    if (!IO) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* Stagger reveal for repeating card grids */
  function stagger(selector, from, gap) {
    var items = document.querySelectorAll(selector);
    if (!items.length) return;
    if (!IO) {
      items.forEach(function (el) { el.style.opacity = '1'; });
      return;
    }
    items.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = from;
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var i = Array.prototype.indexOf.call(items, entry.target);
        setTimeout(function () {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        }, i * gap);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* FAQ accordion */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var wasActive = item.classList.contains('active');
        items.forEach(function (el) {
          el.classList.remove('active');
          var q = el.querySelector('.faq-q');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!wasActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* Smooth scroll for in-page anchors */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* Count-up for stat numbers */
  function initCounters() {
    var stats = document.querySelectorAll('.hc-stat strong, .istat strong');
    if (!stats.length || !IO) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var raw = el.textContent.trim();
        var suffix = raw.replace(/[0-9]/g, '');
        // var num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        obs.unobserve(el);
        if (isNaN(num) || num === 0) return;
        var steps = 40, current = 0, inc = num / steps;
        var timer = setInterval(function () {
          current += inc;
          if (current >= num) { current = num; clearInterval(timer); }
          el.textContent = Math.floor(current) + suffix;
        }, 30);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { obs.observe(el); });
  }

  /* Mobile nav close handlers (open trigger to be wired when header added) */
  function initMobileNav() {
    var nav = document.getElementById('mobile-nav');
    if (!nav) return;
    var closeBtn = document.getElementById('close-nav-btn');

    function close() {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (closeBtn) closeBtn.addEventListener('click', close);
    nav.addEventListener('click', function (e) { if (e.target === nav) close(); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) close();
    });
  }

  /* Hero points stagger-in on load */
  function initHeroPoints() {
    document.querySelectorAll('.hero__pts li').forEach(function (li, i) {
      li.style.opacity = '0';
      li.style.transform = 'translateX(-14px)';
      li.style.transition = 'opacity .4s ease, transform .4s ease';
      setTimeout(function () {
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
      }, 800 + i * 120);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    stagger('.proc-item', 'translateY(20px)', 120);
    stagger('.doc-item',  'translateX(-12px)', 60);
    stagger('.role-item', 'translateX(16px)', 100);
    initFAQ();
    initSmoothScroll();
    initCounters();
    initMobileNav();
    initHeroPoints();
  });
})();
