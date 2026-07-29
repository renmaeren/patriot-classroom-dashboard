/*
==========================================
PATRIOT COMMAND
Classroom Toolbars
==========================================

RIGHT SIDE:
Quick links to frequently used websites.

LEFT SIDE:
Switches for showing or hiding classroom
widgets on the Teach page.
*/

(function () {
  const QUICK_LINK_STORAGE_KEY =
    "patriotClassroomToolbar";

  const WIDGET_STORAGE_KEY =
    "patriotTeachWidgetPreferences";

  /*
  ==========================================
  QUICK LINKS
  ==========================================
  */

  const defaultQuickLinks = [
    {
      id: "campus",
      name: "Infinite Campus",
      icon: "Assets/Icons/InfiniteCampus.png",
      url: "https://allenky.infinitecampus.org/campus/allen.jsp"
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "Assets/Icons/YouTube.png",
      url: "https://www.youtube.com"
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: "Assets/Icons/gmail.png",
      url: "https://mail.google.com"
    },
    {
      id: "drive",
      name: "Google Drive",
      icon: "Assets/Icons/Drive.png",
      url: "https://drive.google.com"
    }
  ];

  /*
  ==========================================
  CLASSROOM WIDGETS
  ==========================================
  */

  const classroomWidgets = [
    {
      id: "timer",
      name: "Classroom Timer",
      icon: "⏱",
      selector: ".timer-card",
      defaultEnabled: true
    },
   {
  id: "announcements",
  name: "Announcements",
  icon: "📣",
  selector: "#announcement-bar",
  defaultEnabled: false
},
    {
      id: "picker",
      name: "Student Picker",
      icon: "🎲",
      defaultEnabled: false
    },
    {
      id: "points",
      name: "Review Game Points",
      icon: "🏆",
      defaultEnabled: false
    },
    {
      id: "groups",
      name: "Random Groups",
      icon: "👥",
      defaultEnabled: false
    }
  ];

  /*
  ==========================================
  GENERAL HELPERS
  ==========================================
  */

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safelyReadJson(key, fallback) {
    const savedValue =
      localStorage.getItem(key);

    if (!savedValue) {
      return fallback;
    }

    try {
      return JSON.parse(savedValue);
    } catch (error) {
      console.error(
        `Saved settings for ${key} could not be read.`,
        error
      );

      return fallback;
    }
  }

  /*
  ==========================================
  WIDGET SETTINGS
  ==========================================
  */

  function getDefaultWidgetSettings() {
    const settings = {};

    classroomWidgets.forEach(widget => {
      settings[widget.id] =
        widget.defaultEnabled;
    });

    return settings;
  }

  function readWidgetSettings() {
    const defaults =
      getDefaultWidgetSettings();

    const saved =
      safelyReadJson(
        WIDGET_STORAGE_KEY,
        defaults
      );

    if (
      !saved ||
      typeof saved !== "object" ||
      Array.isArray(saved)
    ) {
      return defaults;
    }

    return {
      ...defaults,
      ...saved
    };
  }

  function saveWidgetSettings(settings) {
    localStorage.setItem(
      WIDGET_STORAGE_KEY,
      JSON.stringify(settings)
    );
  }

  /*
  ==========================================
  STYLES
  ==========================================
  */

  function addToolbarStyles() {
    if (
      document.getElementById(
        "classroom-toolbar-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "classroom-toolbar-styles";

    style.textContent = `
      /*
      ========================================
      SHARED TOOLBAR STYLES
      ========================================
      */

      .patriot-edge-tab {
        position: fixed;
        top: 50%;
        z-index: 4001;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 68px;
        padding: 8px;
        color: #ffffff;
        font-size: 1.45rem;
        background: rgba(17, 40, 74, 0.76);
        border: 1px solid rgba(255, 255, 255, 0.28);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
        cursor: pointer;
        backdrop-filter: blur(7px);
        -webkit-backdrop-filter: blur(7px);
        transform: translateY(-50%);
        transition:
          width 0.18s ease,
          background 0.18s ease;
      }

      .patriot-edge-tab:hover {
        width: 51px;
        background: rgba(179, 38, 46, 0.9);
      }

      .patriot-edge-panel {
        position: fixed;
        top: 50%;
        z-index: 4000;
        color: #ffffff;
        background: rgba(17, 40, 74, 0.84);
        border: 1px solid rgba(255, 255, 255, 0.24);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.23);
        backdrop-filter: blur(9px);
        -webkit-backdrop-filter: blur(9px);
        transform: translateY(-50%);
      }

      .patriot-toolbar-close {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 34px;
        padding: 0;
        color: #ffffff;
        font-size: 1.3rem;
        font-weight: bold;
        background: rgba(255, 255, 255, 0.13);
        border: 1px solid rgba(255, 255, 255, 0.32);
        border-radius: 9px;
        cursor: pointer;
      }

      .patriot-toolbar-close:hover {
        background: rgba(179, 38, 46, 0.95);
      }

      /*
      ========================================
      RIGHT QUICK-LINK TOOLBAR
      ========================================
      */

      .classroom-toolbar-tab {
        right: 0;
        border-right: 0;
        border-radius: 14px 0 0 14px;
      }

      .classroom-toolbar-tab img {
        display: block;
        width: 28px;
        height: 28px;
        object-fit: contain;
        filter: brightness(0) invert(1);
        pointer-events: none;
      }

      .classroom-toolbar-panel {
        right: -94px;
        width: 80px;
        padding: 12px 10px;
        border-right: 0;
        border-radius: 15px 0 0 15px;
        transition: right 0.24s ease;
      }

      .classroom-toolbar-panel.open {
        right: 0;
      }

      .classroom-toolbar-links {
        display: grid;
        justify-content: center;
        gap: 10px;
      }

      .classroom-toolbar-link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        padding: 7px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.62);
        border-radius: 12px;
        box-shadow: 0 2px 7px rgba(0, 0, 0, 0.13);
        transition:
          transform 0.16s ease,
          background 0.16s ease,
          box-shadow 0.16s ease;
      }

      .classroom-toolbar-link:hover {
        transform: scale(1.06);
        background: #ffffff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
      }

      .classroom-toolbar-link img {
        display: block;
        width: 40px;
        height: 40px;
        object-fit: contain;
        pointer-events: none;
      }

      .classroom-toolbar-link.disabled {
        opacity: 0.38;
        cursor: default;
        pointer-events: none;
      }

      .classroom-toolbar-close {
        width: 56px;
        margin: 11px auto 0;
      }

      /*
      ========================================
      LEFT WIDGET TOOLBAR
      ========================================
      */

      .teach-widget-tab {
        left: 0;
        border-left: 0;
        border-radius: 0 14px 14px 0;
      }

      .teach-widget-tab-label {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        color: #ffffff;
        font-size: 0.72rem;
        font-weight: bold;
        letter-spacing: 1px;
        text-transform: uppercase;
        pointer-events: none;
      }

      .teach-widget-panel {
        left: -292px;
        width: 280px;
        max-height: calc(100vh - 30px);
        padding: 16px;
        overflow-y: auto;
        border-left: 0;
        border-radius: 0 15px 15px 0;
        transition: left 0.24s ease;
      }

      .teach-widget-panel.open {
        left: 0;
      }

      .teach-widget-heading {
        margin: 0;
        color: #ffffff;
        font-size: 1.05rem;
      }

      .teach-widget-description {
        margin: 5px 0 14px;
        color: rgba(255, 255, 255, 0.78);
        font-size: 0.8rem;
        line-height: 1.35;
      }

      .teach-widget-options {
        display: grid;
        gap: 8px;
      }

      .teach-widget-option {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 48px;
        padding: 8px 10px;
        color: #11284a;
        background: rgba(255, 255, 255, 0.94);
        border-radius: 10px;
        cursor: pointer;
        user-select: none;
      }

      .teach-widget-option:hover {
        background: #ffffff;
      }

      .teach-widget-icon {
        flex: 0 0 auto;
        width: 27px;
        text-align: center;
        font-size: 1.25rem;
      }

      .teach-widget-name {
        flex: 1;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .teach-widget-toggle {
        position: relative;
        flex: 0 0 auto;
        width: 42px;
        height: 24px;
      }

      .teach-widget-toggle input {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
      }

      .teach-widget-slider {
        position: absolute;
        inset: 0;
        background: #a9afb8;
        border-radius: 999px;
        transition: background 0.18s ease;
      }

      .teach-widget-slider::before {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.28);
        transition: transform 0.18s ease;
      }

      .teach-widget-toggle input:checked +
      .teach-widget-slider {
        background: #2f7d4a;
      }

      .teach-widget-toggle input:checked +
      .teach-widget-slider::before {
        transform: translateX(18px);
      }

      .teach-widget-toggle input:focus-visible +
      .teach-widget-slider {
        outline: 3px solid #d3a84f;
        outline-offset: 2px;
      }

      .teach-widget-close {
        width: 100%;
        margin-top: 13px;
      }

      /*
      ========================================
      WIDGET VISIBILITY
      ========================================
      */

      .patriot-widget-hidden {
        display: none !important;
      }

      /*
      ========================================
      MOBILE
      ========================================
      */

      @media (max-width: 700px) {
        .patriot-edge-tab {
          width: 42px;
          height: 62px;
        }

        .classroom-toolbar-panel {
          width: 74px;
        }

        .classroom-toolbar-link,
        .classroom-toolbar-close {
          width: 50px;
        }

        .classroom-toolbar-link {
          height: 50px;
        }

        .classroom-toolbar-link img {
          width: 35px;
          height: 35px;
        }

        .teach-widget-panel {
          left: -272px;
          width: 260px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /*
  ==========================================
  RIGHT QUICK-LINK TOOLBAR
  ==========================================
  */

  function readQuickLinks() {
    const tools =
      safelyReadJson(
        QUICK_LINK_STORAGE_KEY,
        defaultQuickLinks
      );

    return Array.isArray(tools)
      ? tools
      : defaultQuickLinks;
  }

  function createQuickLinkButton(tool) {
    const name =
      tool.name || "Classroom Tool";

    const icon =
      tool.icon || "";

    const hasLink =
      tool.url &&
      String(tool.url).trim();

    if (!hasLink) {
      return `
        <span
          class="classroom-toolbar-link disabled"
          title="${escapeHtml(name)} link has not been added yet."
          aria-label="${escapeHtml(name)} unavailable"
        >
          <img
            src="${escapeHtml(icon)}"
            alt=""
          >
        </span>
      `;
    }

    return `
      <a
        class="classroom-toolbar-link"
        href="${escapeHtml(tool.url)}"
        target="_blank"
        rel="noopener noreferrer"
        title="${escapeHtml(name)}"
        aria-label="${escapeHtml(name)}"
      >
        <img
          src="${escapeHtml(icon)}"
          alt=""
        >
      </a>
    `;
  }

  function createQuickLinkToolbar() {
    if (
      document.getElementById(
        "classroom-toolbar-panel"
      )
    ) {
      return;
    }

    const tools =
      readQuickLinks().filter(
        tool =>
          tool &&
          tool.name &&
          tool.icon
      );

    const tab =
      document.createElement("button");

    tab.id =
      "classroom-toolbar-tab";

    tab.className =
      "patriot-edge-tab classroom-toolbar-tab";

    tab.type = "button";

    tab.innerHTML = `
      <img
        src="Assets/Icons/tool-tab.png"
        alt=""
      >
    `;

    tab.setAttribute(
      "aria-label",
      "Open classroom quick links"
    );

    tab.setAttribute(
      "aria-expanded",
      "false"
    );

    tab.title =
      "Classroom Quick Links";

    const panel =
      document.createElement("aside");

    panel.id =
      "classroom-toolbar-panel";

    panel.className =
      "patriot-edge-panel classroom-toolbar-panel";

    panel.setAttribute(
      "aria-label",
      "Classroom quick links"
    );

    panel.innerHTML = `
      <div class="classroom-toolbar-links">
        ${tools
          .map(createQuickLinkButton)
          .join("")}
      </div>

      <button
        id="classroom-toolbar-close"
        class="patriot-toolbar-close classroom-toolbar-close"
        type="button"
        aria-label="Close classroom quick links"
        title="Close"
      >
        ×
      </button>
    `;

    document.body.appendChild(tab);
    document.body.appendChild(panel);

    const closeButton =
      document.getElementById(
        "classroom-toolbar-close"
      );

    function openToolbar() {
      panel.classList.add("open");
      tab.style.display = "none";

      tab.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    function closeToolbar() {
      panel.classList.remove("open");
      tab.style.display = "flex";

      tab.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    tab.addEventListener(
      "click",
      openToolbar
    );

    closeButton.addEventListener(
      "click",
      closeToolbar
    );

    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          panel.classList.contains("open")
        ) {
          closeToolbar();
        }
      }
    );
  }

  /*
  ==========================================
  LEFT WIDGET TOOLBAR
  ==========================================
  */

  function findWidgetContainer(widget) {
    if (widget.id === "agenda") {
      const agenda =
        document.querySelector(
          widget.selector
        );

      return agenda
        ? agenda.closest(".card")
        : null;
    }

    if (widget.selector) {
      return document.querySelector(
        widget.selector
      );
    }

    return document.querySelector(
      `[data-patriot-widget="${widget.id}"]`
    );
  }

  function sendWidgetEvent(
    widgetId,
    enabled
  ) {
    document.dispatchEvent(
      new CustomEvent(
        "patriotWidgetChange",
        {
          detail: {
            widgetId,
            enabled
          }
        }
      )
    );
  }

  function applyWidgetVisibility(
    widget,
    enabled
  ) {
    const container =
      findWidgetContainer(widget);

    /*
    Timer and Agenda already exist in
    classroom.html, so they can be shown
    or hidden immediately.
    */

    if (container) {
      container.classList.toggle(
        "patriot-widget-hidden",
        !enabled
      );
    }

    /*
    Picker, Points, and Groups will be
    inserted by teach-loader.js.

    This event tells that file which
    widgets should be loaded or removed.
    */

    sendWidgetEvent(
      widget.id,
      enabled
    );
  }

  function applyAllWidgetSettings(
    settings
  ) {
    classroomWidgets.forEach(widget => {
      applyWidgetVisibility(
        widget,
        Boolean(settings[widget.id])
      );
    });
  }

  function createWidgetOption(
    widget,
    enabled
  ) {
    return `
      <label
        class="teach-widget-option"
        for="teach-widget-${escapeHtml(widget.id)}"
      >
        <span
          class="teach-widget-icon"
          aria-hidden="true"
        >
          ${widget.icon}
        </span>

        <span class="teach-widget-name">
          ${escapeHtml(widget.name)}
        </span>

        <span class="teach-widget-toggle">
          <input
            id="teach-widget-${escapeHtml(widget.id)}"
            type="checkbox"
            data-widget-id="${escapeHtml(widget.id)}"
            ${enabled ? "checked" : ""}
          >

          <span
            class="teach-widget-slider"
            aria-hidden="true"
          ></span>
        </span>
      </label>
    `;
  }

  function createWidgetToolbar() {
    if (
      document.getElementById(
        "teach-widget-panel"
      )
    ) {
      return;
    }

    const settings =
      readWidgetSettings();

    const tab =
      document.createElement("button");

    tab.id =
      "teach-widget-tab";

    tab.className =
      "patriot-edge-tab teach-widget-tab";

    tab.type = "button";

    tab.innerHTML = `
      <span class="teach-widget-tab-label">
        Widgets
      </span>
    `;

    tab.setAttribute(
      "aria-label",
      "Choose classroom widgets"
    );

    tab.setAttribute(
      "aria-expanded",
      "false"
    );

    tab.title =
      "Classroom Widgets";

    const panel =
      document.createElement("aside");

    panel.id =
      "teach-widget-panel";

    panel.className =
      "patriot-edge-panel teach-widget-panel";

    panel.setAttribute(
      "aria-label",
      "Choose classroom widgets"
    );

    panel.innerHTML = `
      <h2 class="teach-widget-heading">
        Classroom Widgets
      </h2>

      <p class="teach-widget-description">
        Turn on as many tools as you need.
        Your choices will be remembered.
      </p>

      <div class="teach-widget-options">
        ${classroomWidgets
          .map(widget =>
            createWidgetOption(
              widget,
              Boolean(settings[widget.id])
            )
          )
          .join("")}
      </div>

      <button
        id="teach-widget-close"
        class="patriot-toolbar-close teach-widget-close"
        type="button"
        aria-label="Close classroom widget choices"
      >
        ×
      </button>
    `;

    document.body.appendChild(tab);
    document.body.appendChild(panel);

    const closeButton =
      document.getElementById(
        "teach-widget-close"
      );

    function openToolbar() {
      panel.classList.add("open");
      tab.style.display = "none";

      tab.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    function closeToolbar() {
      panel.classList.remove("open");
      tab.style.display = "flex";

      tab.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    tab.addEventListener(
      "click",
      openToolbar
    );

    closeButton.addEventListener(
      "click",
      closeToolbar
    );

    panel.addEventListener(
      "change",
      event => {
        const checkbox =
          event.target.closest(
            "[data-widget-id]"
          );

        if (!checkbox) {
          return;
        }

        const widgetId =
          checkbox.dataset.widgetId;

        const widget =
          classroomWidgets.find(
            item =>
              item.id === widgetId
          );

        if (!widget) {
          return;
        }

        const updatedSettings =
          readWidgetSettings();

        updatedSettings[widgetId] =
          checkbox.checked;

        saveWidgetSettings(
          updatedSettings
        );

        applyWidgetVisibility(
          widget,
          checkbox.checked
        );
      }
    );

    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          panel.classList.contains("open")
        ) {
          closeToolbar();
        }
      }
    );

    /*
    Apply saved choices after the page
    and current cards have loaded.
    */

    applyAllWidgetSettings(settings);
  }

  /*
  ==========================================
  START
  ==========================================
  */

  function startToolbars() {
    addToolbarStyles();
    createQuickLinkToolbar();
    createWidgetToolbar();
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startToolbars
    );
  } else {
    startToolbars();
  }
})();
