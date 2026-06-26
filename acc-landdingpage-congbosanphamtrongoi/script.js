var TicketSupportInit = {
                  email : "",
                  name : "",
                  description : ""
                };
                (function (d, s, type_id, tag_id) {
                  TicketSupportInit.id = type_id;
                  var time = parseInt(new Date().getTime()/60/60/1000);
                  var js, fjs = d.getElementsByTagName(s)[0];
                  if (d.getElementById(tag_id)) return;
                  js = d.createElement(s);
                  js.id = tag_id;
                  js.src = "https://ticket.bizfly.vn/assets/v1/js/support/embed/embed.js?v=" + time;
                  fjs.parentNode.insertBefore(js, fjs);
                }(document, "script", "67b017adffa25d6f46098465", "tk-embed"));

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = Math.min(index % 4, 3) * 80 + "ms";
  observer.observe(item);
});

document.querySelectorAll(".faq-button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    item.classList.toggle("active");
  });
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const original = button.textContent;
    button.textContent = "Đã ghi nhận yêu cầu";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
      form.reset();
    }, 2200);
  });
});
