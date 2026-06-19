(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        initSmoothScroll();
        initFadeInOnScroll();
        initCounters();
        initFAQ();
        initLazyLoad();
        initCarousels();
    });
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId.length < 2) return;
                const target = document.querySelector(targetId);
                if (!target) return;
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const offset = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            });
        });
    }
    function initFadeInOnScroll() {
        const elements = document.querySelectorAll('.fade-up');
        if (!elements.length) return;
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
            elements.forEach(function (el) { observer.observe(el); });
        } else {
            elements.forEach(function (el) { el.classList.add('visible'); });
        }
    }
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;
        const animate = function (counter) {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const duration = 1800;
            const start = performance.now();
            const update = function (now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 2);
                counter.textContent = Math.floor(target * eased).toLocaleString('vi-VN');
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target.toLocaleString('vi-VN');
            };
            requestAnimationFrame(update);
        };
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            counters.forEach(function (c) { observer.observe(c); });
        } else {
            counters.forEach(animate);
        }
    }
    function initFAQ() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(function (item) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;
            question.addEventListener('click', function () {
                const isActive = item.classList.contains('active');
                items.forEach(function (other) {
                    other.classList.remove('active');
                    const ans = other.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = null;
                });
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }
    function showToast(message, type) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        const span = toast.querySelector('span');
        const icon = toast.querySelector('i');
        if (span) span.textContent = message;
        if (icon) {
            icon.className = type === 'error'
                ? 'fas fa-circle-exclamation'
                : 'fas fa-circle-check';
        }
        toast.classList.remove('toast-error', 'toast-success');
        toast.classList.add(type === 'error' ? 'toast-error' : 'toast-success');
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 3500);
    }
    function initLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        const srcset = img.getAttribute('data-srcset');
                        if (srcset) img.srcset = srcset;
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '100px 0px' });
            images.forEach(function (img) { observer.observe(img); });
        } else {
            images.forEach(function (img) { img.src = img.getAttribute('data-src'); });
        }
    }
    function initCarousels() {
        const carousels = document.querySelectorAll('[data-carousel]');
        carousels.forEach(function (carousel) {
            const track = carousel.querySelector('[data-track]');
            const prevBtn = carousel.querySelector('[data-prev]');
            const nextBtn = carousel.querySelector('[data-next]');
            const dotsWrap = carousel.querySelector('[data-dots]');
            if (!track) return;
            const slides = track.querySelectorAll('.carousel-slide');
            if (!slides.length) return;
            // Calculate visible slides per page from CSS
            const visibleSlides = function () {
                const trackWidth = track.clientWidth;
                const slideWidth = slides[0].getBoundingClientRect().width;
                const gap = parseFloat(getComputedStyle(track).gap) || 0;
                return Math.max(1, Math.round((trackWidth + gap) / (slideWidth + gap)));
            };
            // Build dots
            const buildDots = function () {
                if (!dotsWrap) return;
                const visible = visibleSlides();
                const pages = Math.max(1, Math.ceil(slides.length / visible));
                dotsWrap.innerHTML = '';
                for (let i = 0; i < pages; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot';
                    dot.setAttribute('aria-label', 'Trang ' + (i + 1));
                    dot.addEventListener('click', function () {
                        const slide = slides[i * visible];
                        if (slide) {
                            track.scrollTo({
                                left: slide.offsetLeft - track.offsetLeft,
                                behavior: 'smooth'
                            });
                        }
                    });
                    dotsWrap.appendChild(dot);
                }
                updateDots();
            };
            const updateDots = function () {
                if (!dotsWrap) return;
                const dots = dotsWrap.querySelectorAll('.carousel-dot');
                if (!dots.length) return;
                const visible = visibleSlides();
                const slideWidth = slides[0].getBoundingClientRect().width;
                const gap = parseFloat(getComputedStyle(track).gap) || 0;
                const currentIdx = Math.round(track.scrollLeft / (slideWidth + gap));
                const activePage = Math.floor(currentIdx / visible);
                dots.forEach(function (dot, idx) {
                    dot.classList.toggle('active', idx === activePage);
                });
            };
            const scrollByPage = function (dir) {
                const visible = visibleSlides();
                const slideWidth = slides[0].getBoundingClientRect().width;
                const gap = parseFloat(getComputedStyle(track).gap) || 0;
                const distance = (slideWidth + gap) * visible;
                track.scrollBy({ left: dir * distance, behavior: 'smooth' });
            };
            if (prevBtn) prevBtn.addEventListener('click', function () { scrollByPage(-1); });
            if (nextBtn) nextBtn.addEventListener('click', function () { scrollByPage(1); });
            track.addEventListener('scroll', function () {
                window.requestAnimationFrame(updateDots);
            }, { passive: true });
            window.addEventListener('resize', function () {
                buildDots();
            });
            buildDots();
            // Autoplay
            var autoplayDelay = carousel.getAttribute('data-autoplay');
            if (autoplayDelay) {
                autoplayDelay = parseInt(autoplayDelay, 10) || 3500;
                var autoTimer = null;
                var startAutoplay = function () {
                    stopAutoplay();
                    autoTimer = setInterval(function () {
                        var maxScroll = track.scrollWidth - track.clientWidth;
                        if (track.scrollLeft >= maxScroll - 2) {
                            track.scrollTo({ left: 0, behavior: 'smooth' });
                        } else {
                            scrollByPage(1);
                        }
                    }, autoplayDelay);
                };
                var stopAutoplay = function () {
                    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
                };
                // Pause on hover/touch
                carousel.addEventListener('mouseenter', stopAutoplay);
                carousel.addEventListener('mouseleave', startAutoplay);
                carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
                carousel.addEventListener('touchend', function () {
                    setTimeout(startAutoplay, 2000);
                });
                startAutoplay();
            }
        });
    }
})();
