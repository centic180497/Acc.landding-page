/**
 * ACC Landing Page - Business License Registration
 * Main JavaScript
 */

(function () {
  'use strict';

  // DOM Elements
  const heroForm = document.getElementById('heroForm');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const faqItems = document.querySelectorAll('.faq-item');
  const revealElements = document.querySelectorAll('.reveal');

  /**
   * FAQ accordion
   */
  function initFAQ() {
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-item__question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach((other) => {
          other.classList.remove('active');
          other.querySelector('.faq-item__question')?.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * Scroll reveal animation
   */
  function initScrollReveal() {
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  /**
   * Form submission handler
   */
  function handleFormSubmit(form, successMessage) {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (!data.name || !data.phone) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc.');
        return;
      }

      const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
      const cleanPhone = data.phone.replace(/\s/g, '');

      if (!phoneRegex.test(cleanPhone)) {
        showToast('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }

      showToast(successMessage);
      form.reset();
    });
  }

  /**
   * Initialize all modules
   */
  function init() {
    initFAQ();
    initScrollReveal();
    initSmoothScroll();

    handleFormSubmit(
      heroForm,
      'Cảm ơn bạn! Chuyên viên ACC sẽ liên hệ trong thời gian sớm nhất.'
    );

    handleFormSubmit(
      contactForm,
      'Yêu cầu tư vấn đã được gửi thành công. ACC sẽ liên hệ với bạn sớm!'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
