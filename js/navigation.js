/*
==========================================
PATRIOT COMMAND
Shared Navigation and Branding
==========================================

OFFICIAL ACS COLORS:
Cream: #FFFCE9
Blue:  #2A43A3
Red:   #CF1B13
White: #FFFFFF
Gold:  #FFE269

NAVIGATION:
Dashboard
Teach
Plan
  - Planner
  - Library
Settings
  - Settings
  - Students
  - About
*/

(function () {
  "use strict";

  const COLORS = {
    cream: "#FFFCE9",
    blue: "#2A43A3",
    red: "#CF1B13",
    white: "#FFFFFF",
    gold: "#FFE269",
    darkText: "#20283A",
    mutedText: "#5B6476"
  };

  const BRAND_ICON =
    "Assets/Icons/Patriot Command micro.png";

  /*
  ==========================================
  FONT LOADING
  ==========================================
  */

  function loadBrandFonts() {
    if (
      document.getElementById(
        "patriot-brand-fonts"
      )
    ) {
      return;
    }

    const preconnectGoogle =
      document.createElement("link");

    preconnectGoogle.rel =
      "preconnect";

    preconnectGoogle.href =
      "https://fonts.googleapis.com";

    const preconnectStatic =
      document.createElement("link");

    preconnectStatic.rel =
      "preconnect";

    preconnectStatic.href =
      "https://fonts.gstatic.com";

    preconnectStatic.crossOrigin =
      "anonymous";

    const fontLink =
      document.createElement("link");

    fontLink.id =
      "patriot-brand-fonts";

    fontLink.rel =
      "stylesheet";

    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:opsz,wght@7..72,500;7..72,600;7..72,700&display=swap";

    document.head.appendChild(
      preconnectGoogle
    );

    document.head.appendChild(
      preconnectStatic
    );

    document.head.appendChild(
      fontLink
    );
  }

  /*
  ==========================================
  GLOBAL BRANDING AND NAVIGATION STYLES
  ==========================================
  */

  function addNavigationStyles() {
    if (
      document.getElementById(
        "patriot-navigation-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "patriot-navigation-styles";

    style.textContent = `
      :root {
        --patriot-cream: ${COLORS.cream};
        --patriot-blue: ${COLORS.blue};
        --patriot-red: ${COLORS.red};
        --patriot-white: ${COLORS.white};
        --patriot-gold: ${COLORS.gold};
        --patriot-text: ${COLORS.darkText};
        --patriot-muted: ${COLORS.mutedText};

        --patriot-radius-small: 8px;
        --patriot-radius-medium: 12px;
        --patriot-radius-large: 18px;

        --patriot-shadow-small:
          0 2px 8px rgba(42, 67, 163, 0.08);

        --patriot-shadow-medium:
          0 8px 24px rgba(42, 67, 163, 0.12);

        --patriot-transition:
          180ms ease;
      }

      /*
      ========================================
      GLOBAL TYPOGRAPHY
      ========================================
      */

      html {
        color: var(--patriot-text);
        background: var(--patriot-cream);
      }

      body {
        position: relative;
        min-height: 100vh;
        margin: 0;
        color: var(--patriot-text);
        font-family:
          "Inter",
          "Segoe UI",
          Arial,
          sans-serif;
        background:
          linear-gradient(
            180deg,
            rgba(255, 252, 233, 0.82) 0,
            #ffffff 220px
          );
      }

      body::before {
        content: "";
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: -1;
        height: 190px;
        pointer-events: none;
      }

      body.patriot-page-dashboard::before {
        background:
          linear-gradient(
            110deg,
            rgba(207, 27, 19, 0.24) 0%,
            rgba(255, 226, 105, 0.15) 46%,
            rgba(42, 67, 163, 0.22) 100%
          );
      }

      body.patriot-page-teach::before {
        background:
          linear-gradient(
            110deg,
            rgba(207, 27, 19, 0.27) 0%,
            rgba(255, 255, 255, 0.72) 49%,
            rgba(42, 67, 163, 0.25) 100%
          );
      }

      body.patriot-page-plan::before {
        background:
          linear-gradient(
            110deg,
            rgba(42, 67, 163, 0.27) 0%,
            rgba(255, 255, 255, 0.7) 49%,
            rgba(207, 27, 19, 0.22) 100%
          );
      }

      body.patriot-page-library::before {
        background:
          linear-gradient(
            110deg,
            rgba(255, 226, 105, 0.28) 0%,
            rgba(255, 255, 255, 0.72) 49%,
            rgba(42, 67, 163, 0.24) 100%
          );
      }

      body.patriot-page-settings::before {
        background:
          linear-gradient(
            110deg,
            rgba(42, 67, 163, 0.22) 0%,
            rgba(255, 252, 233, 0.78) 52%,
            rgba(255, 226, 105, 0.2) 100%
          );
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      .page-title,
      .section-title,
      .card-title {
        font-family:
          "Literata",
          Georgia,
          "Times New Roman",
          serif;
        letter-spacing: -0.015em;
      }

      button,
      input,
      select,
      textarea {
        font-family:
          "Inter",
          "Segoe UI",
          Arial,
          sans-serif;
      }

      /*
      ========================================
      NAVIGATION
      ========================================
      */

      .patriot-nav {
        position: sticky;
        top: 0;
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        min-height: 56px;
        padding: 0 18px;
        color: var(--patriot-white);
        background:
          rgba(42, 67, 163, 0.94);
        border-bottom:
          3px solid var(--patriot-red);
        box-shadow:
          0 4px 14px rgba(31, 45, 87, 0.16);
        backdrop-filter: blur(13px);
        -webkit-backdrop-filter: blur(13px);
      }

      .patriot-nav-brand {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        min-height: 40px;
        color: var(--patriot-white);
        font-family:
          "Literata",
          Georgia,
          serif;
        font-size: 1.08rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        text-decoration: none;
        white-space: nowrap;
      }

      .patriot-nav-brand-image {
        display: block;
        width: 38px;
        height: 38px;
        object-fit: contain;
        flex: 0 0 auto;
        filter:
          drop-shadow(
            0 2px 4px rgba(0, 0, 0, 0.2)
          );
      }

      .patriot-nav-brand:hover {
        color: var(--patriot-gold);
      }

      .patriot-nav-links {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
      }

      .patriot-nav-item {
        position: relative;
      }

      .patriot-nav-link,
      .patriot-nav-dropdown-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 36px;
        padding: 7px 12px;
        color: var(--patriot-white);
        font: inherit;
        font-size: 0.87rem;
        font-weight: 650;
        line-height: 1;
        text-decoration: none;
        background: transparent;
        border: 1px solid transparent;
        border-radius:
          var(--patriot-radius-small);
        cursor: pointer;
        transition:
          color var(--patriot-transition),
          background var(--patriot-transition),
          border-color var(--patriot-transition),
          transform var(--patriot-transition);
      }

      .patriot-nav-link:hover,
      .patriot-nav-dropdown-button:hover,
      .patriot-nav-link.active,
      .patriot-nav-dropdown-button.active,
      .patriot-nav-item.open
        > .patriot-nav-dropdown-button {
        color: var(--patriot-white);
        background:
          rgba(207, 27, 19, 0.96);
        border-color:
          rgba(255, 255, 255, 0.24);
      }

      .patriot-nav-link:hover,
      .patriot-nav-dropdown-button:hover {
        transform: translateY(-1px);
      }

      .patriot-nav-link:focus-visible,
      .patriot-nav-dropdown-button:focus-visible,
      .patriot-nav-dropdown-link:focus-visible,
      .patriot-nav-brand:focus-visible {
        outline:
          3px solid var(--patriot-gold);
        outline-offset: 3px;
      }

      .patriot-nav-chevron {
        display: inline-block;
        font-size: 0.68rem;
        transition:
          transform var(--patriot-transition);
      }

      .patriot-nav-item.open
        .patriot-nav-chevron {
        transform: rotate(180deg);
      }

      /*
      ========================================
      DROPDOWNS
      ========================================
      */

      .patriot-nav-dropdown {
        position: absolute;
        top: calc(100% + 7px);
        right: 0;
        z-index: 5100;
        display: grid;
        min-width: 190px;
        padding: 7px;
        visibility: hidden;
        opacity: 0;
        background:
          rgba(255, 255, 255, 0.96);
        border:
          1px solid rgba(42, 67, 163, 0.12);
        border-radius:
          var(--patriot-radius-medium);
        box-shadow:
          var(--patriot-shadow-medium);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        transform: translateY(-7px);
        transition:
          opacity var(--patriot-transition),
          transform var(--patriot-transition),
          visibility var(--patriot-transition);
      }

      .patriot-nav-item:hover
        > .patriot-nav-dropdown,
      .patriot-nav-item:focus-within
        > .patriot-nav-dropdown,
      .patriot-nav-item.open
        > .patriot-nav-dropdown {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
      }

      .patriot-nav-dropdown-link {
        display: flex;
        align-items: center;
        min-height: 38px;
        padding: 8px 11px;
        color: var(--patriot-text);
        font-size: 0.84rem;
        font-weight: 600;
        text-decoration: none;
        border-radius:
          var(--patriot-radius-small);
        transition:
          color var(--patriot-transition),
          background var(--patriot-transition),
          transform var(--patriot-transition);
      }

      .patriot-nav-dropdown-link:hover,
      .patriot-nav-dropdown-link.active {
        color: var(--patriot-blue);
        background:
          rgba(42, 67, 163, 0.09);
        transform: translateX(2px);
      }

      .patriot-nav-dropdown-link.active {
        box-shadow:
          inset 3px 0 0 var(--patriot-red);
      }

      /*
      ========================================
      SHARED UI POLISH
      ========================================
      */

      .card,
      .panel,
      .widget,
      [class*="card"] {
        border-color:
          rgba(42, 67, 163, 0.1);
      }

      button,
      .button,
      .btn {
        transition:
          transform var(--patriot-transition),
          box-shadow var(--patriot-transition),
          background var(--patriot-transition),
          color var(--patriot-transition);
      }

      button:hover,
      .button:hover,
      .btn:hover {
        transform: translateY(-1px);
      }

      /*
      ========================================
      MOBILE NAVIGATION
      ========================================
      */

      @media (max-width: 760px) {
        .patriot-nav {
          align-items: stretch;
          flex-direction: column;
          gap: 6px;
          min-height: 0;
          padding: 8px 12px 9px;
        }

        .patriot-nav-brand {
          align-self: flex-start;
        }

        .patriot-nav-brand-image {
          width: 34px;
          height: 34px;
        }

        .patriot-nav-links {
          width: 100%;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 4px;
        }

        .patriot-nav-link,
        .patriot-nav-dropdown-button {
          min-height: 34px;
          padding: 7px 9px;
          font-size: 0.81rem;
        }

        .patriot-nav-dropdown {
          position: fixed;
          top: auto;
          right: 12px;
          left: 12px;
          min-width: 0;
          margin-top: 7px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .patriot-nav-link,
        .patriot-nav-dropdown-button,
        .patriot-nav-dropdown,
        .patriot-nav-dropdown-link,
        button,
        .button,
        .btn {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /*
  ==========================================
  PAGE DETECTION
  ==========================================
  */

  function getCurrentPage() {
    const path =
      window.location.pathname;

    const fileName =
      path.split("/").pop();

    return (
      fileName ||
      "index.html"
    ).toLowerCase();
  }

  function getPageCategory(
    currentPage
  ) {
    if (
      currentPage === "index.html" ||
      currentPage === ""
    ) {
      return "dashboard";
    }

    if (
      currentPage === "classroom.html" ||
      currentPage === "teach.html"
    ) {
      return "teach";
    }

    if (
      currentPage === "planner.html" ||
      currentPage === "plan.html"
    ) {
      return "plan";
    }

    if (
      currentPage === "library.html"
    ) {
      return "library";
    }

    return "settings";
  }

  function applyPageBranding(
    currentPage
  ) {
    const category =
      getPageCategory(
        currentPage
      );

    document.body.classList.add(
      `patriot-page-${category}`
    );
  }

  /*
  ==========================================
  NAVIGATION DATA
  ==========================================
  */

  function getNavigationItems() {
    return [
      {
        type: "link",
        label: "Dashboard",
        href: "index.html"
      },
      {
        type: "link",
        label: "Teach",
        href: "classroom.html"
      },
      {
        type: "dropdown",
        label: "Plan",
        pages: [
          "planner.html",
          "plan.html",
          "library.html"
        ],
        children: [
          {
            label: "Planner",
            href: "planner.html"
          },
          {
            label: "Library",
            href: "library.html"
          }
        ]
      },
      {
        type: "dropdown",
        label: "Settings",
        pages: [
          "settings.html",
          "students.html",
          "about.html"
        ],
        children: [
          {
            label: "Teacher Settings",
            href: "settings.html"
          },
          {
            label: "Students & Rosters",
            href: "students.html"
          },
          {
            label: "About Patriot Command",
            href: "about.html"
          }
        ]
      }
    ];
  }

  /*
  ==========================================
  NAVIGATION BUILDERS
  ==========================================
  */

  function createDirectLink(
    item,
    currentPage
  ) {
    const link =
      document.createElement("a");

    link.className =
      "patriot-nav-link";

    link.href =
      item.href;

    link.textContent =
      item.label;

    if (
      currentPage ===
      item.href.toLowerCase()
    ) {
      link.classList.add(
        "active"
      );

      link.setAttribute(
        "aria-current",
        "page"
      );
    }

    return link;
  }

  function createDropdown(
    item,
    currentPage
  ) {
    const wrapper =
      document.createElement("div");

    wrapper.className =
      "patriot-nav-item";

    const button =
      document.createElement("button");

    button.className =
      "patriot-nav-dropdown-button";

    button.type =
      "button";

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.setAttribute(
      "aria-haspopup",
      "true"
    );

    button.innerHTML = `
      <span>${item.label}</span>
      <span
        class="patriot-nav-chevron"
        aria-hidden="true"
      >
        ▼
      </span>
    `;

    const itemIsActive =
      item.pages.some(
        page =>
          page.toLowerCase() ===
          currentPage
      );

    if (itemIsActive) {
      button.classList.add(
        "active"
      );
    }

    const dropdown =
      document.createElement("div");

    dropdown.className =
      "patriot-nav-dropdown";

    dropdown.setAttribute(
      "role",
      "menu"
    );

    item.children.forEach(
      child => {
        const link =
          document.createElement("a");

        link.className =
          "patriot-nav-dropdown-link";

        link.href =
          child.href;

        link.textContent =
          child.label;

        link.setAttribute(
          "role",
          "menuitem"
        );

        if (
          currentPage ===
          child.href.toLowerCase()
        ) {
          link.classList.add(
            "active"
          );

          link.setAttribute(
            "aria-current",
            "page"
          );
        }

        dropdown.appendChild(
          link
        );
      }
    );

    button.addEventListener(
      "click",
      event => {
        event.stopPropagation();

        const willOpen =
          !wrapper.classList.contains(
            "open"
          );

        closeAllDropdowns(
          wrapper
        );

        wrapper.classList.toggle(
          "open",
          willOpen
        );

        button.setAttribute(
          "aria-expanded",
          String(willOpen)
        );
      }
    );

    wrapper.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape"
        ) {
          wrapper.classList.remove(
            "open"
          );

          button.setAttribute(
            "aria-expanded",
            "false"
          );

          button.focus();
        }
      }
    );

    wrapper.appendChild(
      button
    );

    wrapper.appendChild(
      dropdown
    );

    return wrapper;
  }

  function closeAllDropdowns(
    exceptWrapper = null
  ) {
    document
      .querySelectorAll(
        ".patriot-nav-item.open"
      )
      .forEach(wrapper => {
        if (
          wrapper === exceptWrapper
        ) {
          return;
        }

        wrapper.classList.remove(
          "open"
        );

        const button =
          wrapper.querySelector(
            ".patriot-nav-dropdown-button"
          );

        if (button) {
          button.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      });
  }

  /*
  ==========================================
  CREATE NAVIGATION
  ==========================================
  */

  function createNavigation() {
    if (
      document.querySelector(
        ".patriot-nav"
      )
    ) {
      return;
    }

    const currentPage =
      getCurrentPage();

    applyPageBranding(
      currentPage
    );

    const nav =
      document.createElement("nav");

    nav.className =
      "patriot-nav";

    nav.setAttribute(
      "aria-label",
      "Patriot Command navigation"
    );

    const brand =
      document.createElement("a");

    brand.className =
      "patriot-nav-brand";

    brand.href =
      "index.html";

    brand.innerHTML = `
      <img
        class="patriot-nav-brand-image"
        src="${BRAND_ICON}"
        alt=""
      >

      <span>
        Patriot Command
      </span>
    `;

    const links =
      document.createElement("div");

    links.className =
      "patriot-nav-links";

    getNavigationItems().forEach(
      item => {
        if (
          item.type === "dropdown"
        ) {
          links.appendChild(
            createDropdown(
              item,
              currentPage
            )
          );
        } else {
          links.appendChild(
            createDirectLink(
              item,
              currentPage
            )
          );
        }
      }
    );

    nav.appendChild(
      brand
    );

    nav.appendChild(
      links
    );

    document.body.insertBefore(
      nav,
      document.body.firstChild
    );

    document.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest(
            ".patriot-nav-item"
          )
        ) {
          closeAllDropdowns();
        }
      }
    );

    window.addEventListener(
      "resize",
      () => {
        if (
          window.innerWidth >
          760
        ) {
          closeAllDropdowns();
        }
      }
    );
  }

  /*
  ==========================================
  START
  ==========================================
  */

  function startNavigation() {
    loadBrandFonts();
    addNavigationStyles();
    createNavigation();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startNavigation
    );
  } else {
    startNavigation();
  }
})();
