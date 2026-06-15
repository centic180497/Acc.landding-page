const faqItems = document.querySelectorAll(".faq-item");
const revealSelectors = [
  ".hero-content",
  ".hero-panel",
  ".hero-panel-list div",
  ".section",
  ".section-heading",
  ".two-column p",
  ".report-grid article",
  ".check-grid div",
  ".service-media",
  ".callout",
  ".timeline",
  ".timeline article",
  ".document-layout img",
  ".document-list li",
  ".compliance-media",
  ".split > div",
  ".price-factors li",
  ".time-grid article",
  ".table-wrap",
  ".benefit-grid article",
  ".faq-item",
  ".quote-content",
  ".contact-info div",
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

  if (
    element.matches(
      ".report-grid article, .check-grid div, .timeline article, .document-list li, .price-factors li, .time-grid article, .benefit-grid article, .faq-item, .contact-info div",
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
