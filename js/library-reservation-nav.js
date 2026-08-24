/* Adds Library Reservations to the shared Plan menu without duplicating navigation markup. */
(function () {
  "use strict";

  function addLink() {
    const buttons = Array.from(document.querySelectorAll(".patriot-nav-dropdown-button"));
    const planButton = buttons.find(button => button.textContent.trim().startsWith("Plan"));
    const wrapper = planButton?.closest(".patriot-nav-item");
    const menu = wrapper?.querySelector(".patriot-nav-dropdown");
    if (!menu || menu.querySelector('a[href="reservations.html"]')) return Boolean(menu);

    const link = document.createElement("a");
    link.className = "patriot-nav-dropdown-link";
    link.href = "reservations.html";
    link.textContent = "Library Reservations";
    link.setAttribute("role", "menuitem");

    const page = (window.location.pathname.split("/").pop() || "").toLowerCase();
    if (page === "reservations.html") {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
      planButton.classList.add("active");
    }

    menu.appendChild(link);
    return true;
  }

  if (addLink()) return;
  const observer = new MutationObserver(() => {
    if (addLink()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 8000);
})();
