document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // SCROLL EFFECTS
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if (backToTopBtn) backToTopBtn.classList.add('active');
    } else {
      if (backToTopBtn) backToTopBtn.classList.remove('active');
    }
  });

  // ==========================================
  // SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, no need to observe again
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================
  // FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current FAQ item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        // Use scrollHeight to animate opening height
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // BACK TO TOP BUTTON
  // ==========================================
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // FORM HANDLING & SUCCESS MODAL
  // ==========================================
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const heroForm = document.getElementById('hero-register-form');
  const mainContactForm = document.getElementById('main-contact-form');

  // Show Success Modal Function
  const showSuccessModal = () => {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll while modal open
  };

  // Close Success Modal Function
  const closeSuccessModal = () => {
    successModal.classList.remove('active');
    document.body.style.overflow = ''; // Enable scroll
  };

  // Attach submit handler to form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Read form inputs (useful for validation or processing)
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate API request delay
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      
      // Clear all fields
      e.target.reset();
      
      // Show confirmation dialog
      showSuccessModal();
    }, 1200);
  };

  if (heroForm) heroForm.addEventListener('submit', handleFormSubmit);
  if (mainContactForm) mainContactForm.addEventListener('submit', handleFormSubmit);

  // Close modal events
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeSuccessModal);
  
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

});
