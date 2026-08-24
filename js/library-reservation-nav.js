/* Adds Library Reservations beside Dashboard in the shared navigation. */
(function () {
  "use strict";

  function addLink() {
    const links = document.querySelector(".patriot-nav-links");
    if (!links) return false;
    if (links.querySelector('a[href="reservations.html"]')) return true;

    const dashboardLink = links.querySelector('a[href="index.html"]');
    if (!dashboardLink) return false;

    const link = document.createElement("a");
    link.className = "patriot-nav-link";
    link.href = "reservations.html";
    link.textContent = "Library Reservations";

    const page = (window.location.pathname.split("/").pop() || "").toLowerCase();
    if (page === "reservations.html") {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    dashboardLink.insertAdjacentElement("afterend", link);
    return true;
  }

  if (addLink()) return;
  const observer = new MutationObserver(() => {
    if (addLink()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 8000);
})();
