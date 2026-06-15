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
