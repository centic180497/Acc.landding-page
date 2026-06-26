document.documentElement.classList.add("js-reveal");

var TicketSupportInit = {
  email: "",
  name: "",
  description: ""
};

(function (d, s, type_id, tag_id) {
  TicketSupportInit.id = type_id;
  var time = parseInt(new Date().getTime() / 60 / 60 / 1000);
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(tag_id)) return;
  js = d.createElement(s);
  js.id = tag_id;
  js.src = "https://ticket.bizfly.vn/assets/v1/js/support/embed/embed.js?v=" + time;
  fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "67b017adffa25d6f46098465", "tk-embed"));

(function () {
  function initReveal() {
    var revealItems = document.querySelectorAll(".reveal");

    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index % 4, 3) * 80 + "ms";
      observer.observe(item);
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-button").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".faq-item");
        if (item) item.classList.toggle("active");
      });
    });
  }

  function initForms() {
    document.querySelectorAll("form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var button = form.querySelector("button[type='submit']");
        if (!button) return;
        var original = button.textContent;
        button.textContent = "Đã ghi nhận yêu cầu";
        button.disabled = true;
        setTimeout(function () {
          button.textContent = original;
          button.disabled = false;
          form.reset();
        }, 2200);
      });
    });
  }

  function initPage() {
    initReveal();
    initFaq();
    initForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
}());
