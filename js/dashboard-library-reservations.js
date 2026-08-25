/* Patriot Command — Dashboard Library Reservations quick launch */
(function () {
  "use strict";

  function addReservationCard() {
    const actions = document.querySelector(".home-actions");
    if (!actions) return false;
    if (actions.querySelector('a[href="reservations.html"]')) return true;

    const styleId = "patriot-dashboard-library-reservations-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @media (min-width: 901px) {
          .home-actions {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .home-button.library-reservations .home-button-icon {
          background: rgba(255, 226, 105, 0.2);
        }
        .home-button.library-reservations:hover {
          background: #2a43a3;
          border-color: #2a43a3;
        }
      `;
      document.head.appendChild(style);
    }

    const link = document.createElement("a");
    link.className = "home-button library-reservations";
    link.href = "reservations.html";
    link.innerHTML = `
      <span class="home-button-icon" aria-hidden="true">📅</span>
      <span class="home-button-copy">
        <span class="home-button-title">Reserve the Library</span>
        <span class="home-button-description">Check availability and reserve the Library Media Center.</span>
      </span>
    `;

    actions.appendChild(link);
    return true;
  }

  if (addReservationCard()) return;

  const observer = new MutationObserver(() => {
    if (addReservationCard()) observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(() => observer.disconnect(), 8000);
})();
