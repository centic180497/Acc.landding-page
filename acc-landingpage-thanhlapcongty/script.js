document.addEventListener('DOMContentLoaded', () => {

  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (backToTop && window.scrollY > 300) {
      backToTop.classList.add('show');
    } else if (backToTop) {
      backToTop.classList.remove('show');
    }
  });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 3. SCROLL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  // ==========================================
  // 4. FAQ ACCORDION TOGGLE
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items first
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current FAQ item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 5. INTERACTIVE FORM SUBMISSION & SUCCESS MODAL
  // ==========================================
  const mainForm = document.getElementById('mainContactForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  const showSuccessModal = () => {
    if (successModal) {
      successModal.classList.add('show');
    }
  };

  const hideSuccessModal = () => {
    if (successModal) {
      successModal.classList.remove('show');
    }
  };

  // Main contact form submission
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const type = document.getElementById('formSelectType').value;
      const msg = document.getElementById('formMsg').value.trim();

      if (name && phone) {
        // Here you would normally send data to server
        console.log('Main form submitted:', { name, phone, email, type, msg });
        
        // Reset form
        mainForm.reset();
        
        // Show success
        showSuccessModal();
      }
    });
  }

  // Modal actions
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        hideSuccessModal();
      }
    });
  }

  // ==========================================
  // 6. PROCESS CAROUSEL (Continuous + drag-to-scroll)
  // ==========================================
  (function initProcessCarousel() {
    const root = document.getElementById('processCarousel');
    if (!root) return;
    const viewport = root.querySelector('.process-carousel-viewport');
    const track = root.querySelector('#processCarouselTrack');
    if (!viewport || !track) return;

    const originals = Array.from(track.children);
    if (originals.length === 0) return;

    // Duplicate cards twice so the loop reads as continuous in both directions.
    [1, 2].forEach(() => {
      originals.forEach((li) => {
        const clone = li.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SPEED = 60; // px / second
    let loopWidth = 0;
    let offset = 0;
    let last = 0;
    let rafId = null;
    let paused = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let pointerId = null;

    const measure = () => {
      const cardWidth = originals[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      loopWidth = (cardWidth + gap) * originals.length;
      // Start a touch shifted in so user can drag forward or backward immediately.
      if (offset === 0) offset = -loopWidth;
      normalize();
      apply();
    };

    const normalize = () => {
      if (loopWidth <= 0) return;
      // Keep offset within [-2*loopWidth, 0] so middle copy is on screen.
      while (offset <= -2 * loopWidth) offset += loopWidth;
      while (offset > -loopWidth) offset -= loopWidth;
    };

    const apply = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const tick = (ts) => {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      if (!paused && !isDragging && !reduceMotion) {
        offset -= SPEED * dt;
        normalize();
        apply();
      }
      rafId = requestAnimationFrame(tick);
    };

    // Pause on hover / focus.
    root.addEventListener('mouseenter', () => { paused = true; });
    root.addEventListener('mouseleave', () => { paused = false; });
    root.addEventListener('focusin', () => { paused = true; });
    root.addEventListener('focusout', () => { paused = false; });

    // Pointer drag (mouse + touch + pen).
    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isDragging = true;
      pointerId = e.pointerId;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      root.classList.add('is-dragging');
      try { viewport.setPointerCapture(pointerId); } catch (_) {}
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      offset = dragStartOffset + dx;
      normalize();
      apply();
    };

    const onUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      root.classList.remove('is-dragging');
      try { viewport.releasePointerCapture(pointerId); } catch (_) {}
      pointerId = null;
      last = 0; // reset so auto-scroll resumes smoothly
    };

    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);
    viewport.addEventListener('pointerleave', onUp);

    // Prevent native image drag inside cards from hijacking the pointer.
    track.addEventListener('dragstart', (e) => e.preventDefault());

    // Re-measure on resize.
    let resizeTO;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(measure, 120);
    });

    measure();
    if (!reduceMotion) {
      rafId = requestAnimationFrame(tick);
    }
  })();

  // Smooth scroll to links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
