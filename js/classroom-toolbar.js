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

Both toolbar tabs can be dragged vertically.
Their positions are saved for each teacher.
*/

(function () {
  const QUICK_LINK_STORAGE_KEY =
    "patriotClassroomToolbar";

  const WIDGET_STORAGE_KEY =
    "patriotTeachWidgetPreferences";

  const QUICK_LINK_TAB_POSITION_KEY =
    "patriotQuickLinkTabPosition";

  const WIDGET_TAB_POSITION_KEY =
    "patriotWidgetTabPosition";

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

  function clamp(value, minimum, maximum) {
    return Math.min(
      Math.max(value, minimum),
      maximum
    );
  }

  function isSmallScreen() {
    return window.matchMedia(
      "(max-width: 700px)"
    ).matches;
  }

  /*
  ==========================================
  DRAGGABLE EDGE TABS
  ==========================================
  */

  function makeEdgeTabDraggable(
    tab,
    storageKey
  ) {
    const EDGE_PADDING = 12;
    const DRAG_THRESHOLD = 6;

    let pointerId = null;
    let startY = 0;
    let currentY = 0;
    let dragging = false;
    let suppressNextClick = false;

    function getVerticalLimits() {
      const tabHeight =
        tab.offsetHeight || 62;

      const minimum =
        EDGE_PADDING +
        tabHeight / 2;

      const maximum =
        window.innerHeight -
        EDGE_PADDING -
        tabHeight / 2;

      return {
        minimum,
        maximum: Math.max(
          minimum,
          maximum
        )
      };
    }

    function readSavedPosition() {
      const savedValue =
        localStorage.getItem(storageKey);

      if (savedValue === null) {
        return 0.5;
      }

      const parsedValue =
        Number(savedValue);

      if (!Number.isFinite(parsedValue)) {
        return 0.5;
      }

      return clamp(
        parsedValue,
        0,
        1
      );
    }

    function savePosition(centerY) {
      const {
        minimum,
        maximum
      } = getVerticalLimits();

      const availableDistance =
        maximum - minimum;

      const position =
        availableDistance > 0
          ? (
              centerY - minimum
            ) / availableDistance
          : 0.5;

      localStorage.setItem(
        storageKey,
        String(
          clamp(position, 0, 1)
        )
      );
    }

    function applySavedPosition() {
      if (isSmallScreen()) {
        tab.style.top = "50%";
        return;
      }

      const {
        minimum,
        maximum
      } = getVerticalLimits();

      const savedPosition =
        readSavedPosition();

      const centerY =
        minimum +
        savedPosition *
          (maximum - minimum);

      tab.style.top =
        `${centerY}px`;
    }

    function moveTab(clientY) {
      const {
        minimum,
        maximum
      } = getVerticalLimits();

      const centerY =
        clamp(
          clientY,
          minimum,
          maximum
        );

      tab.style.top =
        `${centerY}px`;

      return centerY;
    }

    tab.addEventListener(
      "pointerdown",
      event => {
        if (
          isSmallScreen() ||
          event.button !== 0
        ) {
          return;
        }

        pointerId =
          event.pointerId;

        startY =
          event.clientY;

        currentY =
          event.clientY;

        dragging = false;

        tab.setPointerCapture(
          pointerId
        );
      }
    );

    tab.addEventListener(
      "pointermove",
      event => {
        if (
          pointerId === null ||
          event.pointerId !== pointerId
        ) {
          return;
        }

        currentY =
          event.clientY;

        const distanceMoved =
          Math.abs(
            currentY - startY
          );

        if (
          !dragging &&
          distanceMoved >=
            DRAG_THRESHOLD
        ) {
          dragging = true;
          tab.classList.add(
            "dragging"
          );
        }

        if (!dragging) {
          return;
        }

        event.preventDefault();

        moveTab(currentY);
      }
    );

    function finishDragging(event) {
      if (
        pointerId === null ||
        event.pointerId !== pointerId
      ) {
        return;
      }

      if (
        tab.hasPointerCapture(
          pointerId
        )
      ) {
        tab.releasePointerCapture(
          pointerId
        );
      }

      if (dragging) {
        const finalCenterY =
          moveTab(currentY);

        savePosition(
          finalCenterY
        );

        suppressNextClick = true;

        window.setTimeout(
          () => {
            suppressNextClick = false;
          },
          0
        );
      }

      pointerId = null;
      dragging = false;

      tab.classList.remove(
        "dragging"
      );
    }

    tab.addEventListener(
      "pointerup",
      finishDragging
    );

    tab.addEventListener(
      "pointercancel",
      finishDragging
    );

    window.addEventListener(
      "resize",
      applySavedPosition
    );

    applySavedPosition();

    return {
      shouldIgnoreClick() {
        return suppressNextClick;
      }
    };
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
        width: 44px;
        height: 62px;
        padding: 8px;
        color: #ffffff;
        background: rgba(17, 40, 74, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.28);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
        cursor: grab;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        backdrop-filter: blur(7px);
        -webkit-backdrop-filter: blur(7px);
        transform: translateY(-50%);
        transition:
          width 0.18s ease,
          background 0.18s ease,
          box-shadow 0.18s ease;
      }

      .patriot-edge-tab:hover {
        width: 49px;
        background: rgba(179, 38, 46, 0.94);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.24);
      }

      .patriot-edge-tab.dragging {
        width: 49px;
        cursor: grabbing;
        background: rgba(179, 38, 46, 0.96);
        box-shadow: 0 5px 16px rgba(0, 0, 0, 0.3);
        transition:
          background 0.18s ease,
          box-shadow 0.18s ease;
      }

      .patriot-edge-tab img {
        display: block;
        width: 29px;
        height: 29px;
        object-fit: contain;
        pointer-events: none;
      }

      .patriot-edge-panel {
        position: fixed;
        top: 50%;
        z-index: 4000;
        color: #ffffff;
        background: rgba(17, 40, 74, 0.9);
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
        height: 32px;
        padding: 0;
        color: #ffffff;
        font-size: 1.25rem;
        font-weight: bold;
        background: rgba(255, 255, 255, 0.13);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
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
        border-radius: 13px 0 0 13px;
      }

      .classroom-toolbar-tab img {
        filter: brightness(0) invert(1);
      }

      .classroom-toolbar-panel {
        right: -90px;
        width: 76px;
        padding: 10px 8px;
        border-right: 0;
        border-radius: 14px 0 0 14px;
        transition: right 0.24s ease;
      }

      .classroom-toolbar-panel.open {
        right: 0;
      }

      .classroom-toolbar-links {
        display: grid;
        justify-content: center;
        gap: 8px;
      }

      .classroom-toolbar-link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 54px;
        height: 54px;
        padding: 7px;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.62);
        border-radius: 11px;
        box-shadow: 0 2px 7px rgba(0, 0, 0, 0.13);
        transition:
          transform 0.16s ease,
          background 0.16s ease,
          box-shadow 0.16s ease;
      }

      .classroom-toolbar-link:hover {
        transform: scale(1.05);
        background: #ffffff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
      }

      .classroom-toolbar-link img {
        display: block;
        width: 39px;
        height: 39px;
        object-fit: contain;
        pointer-events: none;
      }

      .classroom-toolbar-link.disabled {
        opacity: 0.38;
        cursor: default;
        pointer-events: none;
      }

      .classroom-toolbar-close {
        width: 54px;
        margin: 9px auto 0;
      }

      /*
      ========================================
      LEFT WIDGET TOOLBAR
      ========================================
      */

      .teach-widget-tab {
        left: 0;
        border-left: 0;
        border-radius: 0 13px 13px 0;
      }

      .teach-widget-tab img {
        filter: brightness(0) invert(1);
      }

      .teach-widget-panel {
        left: -264px;
        width: 252px;
        max-height: calc(100vh - 30px);
        padding: 13px;
        overflow-y: auto;
        border-left: 0;
        border-radius: 0 14px 14px 0;
        transition: left 0.24s ease;
      }

      .teach-widget-panel.open {
        left: 0;
      }

      .teach-widget-heading {
        margin: 0;
        color: #ffffff;
        font-size: 1rem;
      }

      .teach-widget-description {
        margin: 4px 0 11px;
        color: rgba(255, 255, 255, 0.78);
        font-size: 0.76rem;
        line-height: 1.35;
      }

      .teach-widget-options {
        display: grid;
        gap: 7px;
      }

      .teach-widget-option {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 42px;
        padding: 6px 8px;
        color: #11284a;
        background: rgba(255, 255, 255, 0.96);
        border-radius: 9px;
        cursor: pointer;
        user-select: none;
      }

      .teach-widget-option:hover {
        background: #ffffff;
      }

      .teach-widget-icon {
        flex: 0 0 auto;
        width: 25px;
        text-align: center;
        font-size: 1.15rem;
      }

      .teach-widget-name {
        flex: 1;
        font-size: 0.84rem;
        font-weight: bold;
      }

      .teach-widget-toggle {
        position: relative;
        flex: 0 0 auto;
        width: 40px;
        height: 22px;
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
        width: 16px;
        height: 16px;
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
        margin-top: 10px;
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
          top: 50% !important;
          width: 41px;
          height: 58px;
          cursor: pointer;
          touch-action: auto;
        }

        .patriot-edge-tab img {
          width: 26px;
          height: 26px;
        }

        .classroom-toolbar-panel {
          width: 70px;
        }

        .classroom-toolbar-link,
        .classroom-toolbar-close {
          width: 48px;
        }

        .classroom-toolbar-link {
          height: 48px;
        }

        .classroom-toolbar-link img {
          width: 34px;
          height: 34px;
        }

        .teach-widget-panel {
          left: -244px;
          width: 232px;
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
      "Click to open. Drag up or down to move.";

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

    const dragController =
      makeEdgeTabDraggable(
        tab,
        QUICK_LINK_TAB_POSITION_KEY
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
      () => {
        if (
          dragController.shouldIgnoreClick()
        ) {
          return;
        }

        openToolbar();
      }
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

    if (container) {
      container.classList.toggle(
        "patriot-widget-hidden",
        !enabled
      );
    }

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
      <img
        src="Assets/Icons/widgets.png"
        alt=""
      >
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
      "Click to open. Drag up or down to move.";

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
        Turn tools on or off.
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
        title="Close"
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

    const dragController =
      makeEdgeTabDraggable(
        tab,
        WIDGET_TAB_POSITION_KEY
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
      () => {
        if (
          dragController.shouldIgnoreClick()
        ) {
          return;
        }

        openToolbar();
      }
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
