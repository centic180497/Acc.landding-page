const faqItems = document.querySelectorAll(".faq-item");
const contactForms = document.querySelectorAll(".contact-form");
const revealSelectors = [
  ".hero-content",
  ".hero-form",
  ".section",
  ".section-heading",
  ".two-column p",
  ".report-grid article",
  ".check-grid div",
  ".callout",
  ".timeline",
  ".timeline article",
  ".document-layout img",
  ".document-list li",
  ".split > div",
  ".price-factors li",
  ".time-grid article",
  ".table-wrap",
  ".benefit-grid article",
  ".faq-item",
  ".quote-content",
  ".quote-points div",
  ".quote-form",
];

faqItems.forEach((item) => {
  const button = item.querySelector("button");

  button?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.querySelector("span").textContent = isOpen ? "-" : "+";
  });
});

contactForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    if (!button) return;

    button.textContent = "Đã ghi nhận yêu cầu";
    button.setAttribute("disabled", "true");
  });
});

const revealElements = [
  ...new Set(revealSelectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)))),
];

const getRevealDelay = (element) => {
  const section = element.closest("section") || document.body;
  const siblings = Array.from(section.querySelectorAll(".reveal"));
  const index = Math.max(siblings.indexOf(element), 0);

  return Math.min(index * 55, 330);
};

revealElements.forEach((element) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${getRevealDelay(element)}ms`);

  if (element.matches(".timeline article:nth-child(odd)")) {
    element.classList.add("reveal-left");
  }

  if (element.matches(".timeline article:nth-child(even)")) {
    element.classList.add("reveal-right");
  }

  if (
    element.matches(
      ".report-grid article, .check-grid div, .document-list li, .price-factors li, .time-grid article, .benefit-grid article, .faq-item, .quote-points div",
    )
  ) {
    element.classList.add("reveal-scale");
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
