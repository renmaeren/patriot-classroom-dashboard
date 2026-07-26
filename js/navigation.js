/*
  PATRIOT COMMAND
  Shared navigation bar
*/

(function () {
  function addNavigationStyles() {
    if (document.getElementById("patriot-navigation-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "patriot-navigation-styles";

    style.textContent = `
      .patriot-nav {
        position: sticky;
        top: 0;
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 12px 22px;
        color: #ffffff;
        background: #11284a;
        border-bottom: 5px solid #b3262e;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
      }

      .patriot-nav-brand {
        color: #ffffff;
        font-size: 1.15rem;
        font-weight: bold;
        text-decoration: none;
        white-space: nowrap;
      }

      .patriot-nav-links {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
      }

      .patriot-nav-link {
        padding: 9px 12px;
        color: #ffffff;
        font-size: 0.94rem;
        font-weight: bold;
        text-decoration: none;
        border-radius: 8px;
      }

      .patriot-nav-link:hover,
      .patriot-nav-link.active {
        background: #b3262e;
      }

      .patriot-nav-link.disabled {
        opacity: 0.48;
        pointer-events: none;
      }

      @media (max-width: 720px) {
        .patriot-nav {
          align-items: flex-start;
          flex-direction: column;
        }

        .patriot-nav-links {
          width: 100%;
          justify-content: flex-start;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function getCurrentPage() {
    const path = window.location.pathname;
    const fileName = path.split("/").pop();

    return fileName || "index.html";
  }

  function createNavigation() {
    if (document.querySelector(".patriot-nav")) {
      return;
    }

    const currentPage = getCurrentPage();

    const nav = document.createElement("nav");
    nav.className = "patriot-nav";
    nav.setAttribute("aria-label", "Patriot Command navigation");

    const brand = document.createElement("a");
    brand.className = "patriot-nav-brand";
    brand.href = "index.html";
brand.textContent = "Patriot Command";
    const links = document.createElement("div");
    links.className = "patriot-nav-links";

    const items = [
      {
        label: "Dashboard",
        href: "index.html"
      },
     {
{
  label: "Planner",
  href: "planner.html"
},
},
{
  label: "Teach",
  href: "classroom.html"
},
      {
 {
  label: "Library",
  href: "library.html"
},
},
      {
        label: "Settings",
        href: "settings.html"
      }
    ];

    items.forEach(item => {
      const link = document.createElement("a");

      link.className = "patriot-nav-link";
      link.href = item.href;
      link.textContent = item.label;

      if (item.disabled) {
        link.classList.add("disabled");
        link.setAttribute("aria-disabled", "true");
      }

      if (
        !item.disabled &&
        currentPage === item.href
      ) {
        link.classList.add("active");
      }

      links.appendChild(link);
    });

    nav.appendChild(brand);
    nav.appendChild(links);

    document.body.insertBefore(
      nav,
      document.body.firstChild
    );
  }

  function startNavigation() {
    addNavigationStyles();
    createNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startNavigation
    );
  } else {
    startNavigation();
  }
})();
