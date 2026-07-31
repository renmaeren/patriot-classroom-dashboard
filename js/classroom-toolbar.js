/*
==========================================
PATRIOT COMMAND
Classroom Edge Controls
==========================================

RIGHT EDGE:
- Classroom Widgets
- Quick Links

Both buttons:
- Stay on the right side
- Can be dragged vertically
- Remember their positions
- Open matching right-side panels

Only one edge panel opens at a time.
*/

(function () {
  "use strict";

  const QUICK_LINK_STORAGE_KEY =
    "patriotClassroomToolbar";

  const WIDGET_STORAGE_KEY =
    "patriotTeachWidgetPreferences";

  const QUICK_LINK_TAB_POSITION_KEY =
    "patriotQuickLinkTabRightPosition";

  const WIDGET_TAB_POSITION_KEY =
    "patriotWidgetTabRightPosition";

  const WHITEBOARD_SCRIPT_PATH =
    "js/classroom-whiteboard.js";

  const COLORS = {
    blue: "#2A43A3",
    red: "#CF1B13",
    cream: "#FFFCE9",
    white: "#FFFFFF",
    gold: "#FFE269",
    text: "#20283A",
    muted: "#657087"
  };

  let whiteboardLoadPromise = null;

  let quickLinkTab = null;
  let quickLinkPanel = null;

  let widgetTab = null;
  let widgetPanel = null;

  /*
  ==========================================
  QUICK LINKS
  ==========================================
  */

  const defaultQuickLinks = [
    {
      id: "campus",
      name: "Infinite Campus",
      icon:
        "Assets/Icons/InfiniteCampus.png",
      url:
        "https://allenky.infinitecampus.org/campus/allen.jsp"
    },
    {
      id: "youtube",
      name: "YouTube",
      icon:
        "Assets/Icons/YouTube.png",
      url:
        "https://www.youtube.com"
    },
    {
      id: "gmail",
      name: "Gmail",
      icon:
        "Assets/Icons/gmail.png",
      url:
        "https://mail.google.com"
    },
    {
      id: "drive",
      name: "Google Drive",
      icon:
        "Assets/Icons/Drive.png",
      url:
        "https://drive.google.com"
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
      defaultEnabled: true,
      type: "toggle"
    },
    {
      id: "announcements",
      name: "Announcements",
      icon: "📣",
      selector: "#announcement-bar",
      defaultEnabled: false,
      type: "toggle"
    },
    {
      id: "picker",
      name: "Student Picker",
      icon: "🎲",
      defaultEnabled: false,
      type: "toggle"
    },
    {
      id: "points",
      name: "Review Game Points",
      icon: "🏆",
      defaultEnabled: false,
      type: "toggle"
    },
    {
      id: "groups",
      name: "Random Groups",
      icon: "👥",
      defaultEnabled: false,
      type: "toggle"
    },
    {
      id: "whiteboard",
      name: "Whiteboard",
      icon: "✎",
      type: "action"
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

  function safelyReadJson(
    key,
    fallback
  ) {
    const savedValue =
      localStorage.getItem(key);

    if (!savedValue) {
      return fallback;
    }

    try {
      return JSON.parse(
        savedValue
      );
    } catch (error) {
      console.error(
        `Saved settings for ${key} could not be read.`,
        error
      );

      return fallback;
    }
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.min(
      Math.max(
        value,
        minimum
      ),
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
  PANEL COORDINATION
  ==========================================
  */

  function hideEdgeTabs() {
    if (widgetTab) {
      widgetTab.classList.add(
        "panel-active"
      );
    }

    if (quickLinkTab) {
      quickLinkTab.classList.add(
        "panel-active"
      );
    }
  }

  function showEdgeTabs() {
    if (widgetTab) {
      widgetTab.classList.remove(
        "panel-active"
      );
    }

    if (quickLinkTab) {
      quickLinkTab.classList.remove(
        "panel-active"
      );
    }
  }

  function closeQuickLinks(
    restoreTabs = true
  ) {
    if (!quickLinkPanel) {
      return;
    }

    quickLinkPanel.classList.remove(
      "open"
    );

    if (quickLinkTab) {
      quickLinkTab.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    if (restoreTabs) {
      showEdgeTabs();
    }
  }

  function closeWidgets(
    restoreTabs = true
  ) {
    if (!widgetPanel) {
      return;
    }

    widgetPanel.classList.remove(
      "open"
    );

    if (widgetTab) {
      widgetTab.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    if (restoreTabs) {
      showEdgeTabs();
    }
  }

  function closeAllPanels() {
    closeQuickLinks(false);
    closeWidgets(false);
    showEdgeTabs();
  }

  function openQuickLinks() {
    closeWidgets(false);

    if (!quickLinkPanel) {
      return;
    }

    hideEdgeTabs();

    quickLinkPanel.classList.add(
      "open"
    );

    quickLinkTab.setAttribute(
      "aria-expanded",
      "true"
    );
  }

  function openWidgets() {
    closeQuickLinks(false);

    if (!widgetPanel) {
      return;
    }

    hideEdgeTabs();

    widgetPanel.classList.add(
      "open"
    );

    widgetTab.setAttribute(
      "aria-expanded",
      "true"
    );
  }

  /*
  ==========================================
  WHITEBOARD
  ==========================================
  */

  function openWhiteboard() {
    if (
      window.PatriotWhiteboard &&
      typeof
        window.PatriotWhiteboard.open ===
        "function"
    ) {
      window.PatriotWhiteboard.open();

      return Promise.resolve();
    }

    if (whiteboardLoadPromise) {
      return whiteboardLoadPromise.then(
        () => {
          window.PatriotWhiteboard.open();
        }
      );
    }

    whiteboardLoadPromise =
      new Promise(
        (
          resolve,
          reject
        ) => {
          const existingScript =
            document.querySelector(
              `script[src="${WHITEBOARD_SCRIPT_PATH}"]`
            );

          if (existingScript) {
            existingScript.addEventListener(
              "load",
              resolve,
              {
                once: true
              }
            );

            existingScript.addEventListener(
              "error",
              reject,
              {
                once: true
              }
            );

            return;
          }

          const script =
            document.createElement(
              "script"
            );

          script.src =
            WHITEBOARD_SCRIPT_PATH;

          script.defer = true;

          script.addEventListener(
            "load",
            resolve,
            {
              once: true
            }
          );

          script.addEventListener(
            "error",
            reject,
            {
              once: true
            }
          );

          document.body.appendChild(
            script
          );
        }
      )
        .then(() => {
          if (
            !window.PatriotWhiteboard ||
            typeof
              window.PatriotWhiteboard.open !==
              "function"
          ) {
            throw new Error(
              "Whiteboard controls were not created."
            );
          }
        })
        .catch(error => {
          whiteboardLoadPromise = null;

          console.error(
            "The classroom whiteboard could not be opened.",
            error
          );

          window.alert(
            "The whiteboard could not be opened. Make sure js/classroom-whiteboard.js is in the project."
          );

          throw error;
        });

    return whiteboardLoadPromise.then(
      () => {
        window.PatriotWhiteboard.open();
      }
    );
  }

  /*
  ==========================================
  DRAGGABLE RIGHT-EDGE BUTTONS
  ==========================================
  */

  function makeEdgeTabDraggable(
    tab,
    storageKey,
    defaultPosition
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
        tab.offsetHeight || 54;

      const minimum =
        EDGE_PADDING +
        tabHeight / 2;

      const maximum =
        window.innerHeight -
        EDGE_PADDING -
        tabHeight / 2;

      return {
        minimum,
        maximum:
          Math.max(
            minimum,
            maximum
          )
      };
    }

    function readSavedPosition() {
      const savedValue =
        localStorage.getItem(
          storageKey
        );

      if (savedValue === null) {
        return defaultPosition;
      }

      const parsedValue =
        Number(savedValue);

      if (
        !Number.isFinite(
          parsedValue
        )
      ) {
        return defaultPosition;
      }

      return clamp(
        parsedValue,
        0,
        1
      );
    }

    function savePosition(
      centerY
    ) {
      const {
        minimum,
        maximum
      } = getVerticalLimits();

      const availableDistance =
        maximum - minimum;

      const position =
        availableDistance > 0
          ? (
              centerY -
              minimum
            ) /
            availableDistance
          : defaultPosition;

      localStorage.setItem(
        storageKey,
        String(
          clamp(
            position,
            0,
            1
          )
        )
      );
    }

    function applySavedPosition() {
      if (isSmallScreen()) {
        const mobilePosition =
          defaultPosition < 0.5
            ? 0.42
            : 0.58;

        tab.style.top =
          `${
            mobilePosition * 100
          }%`;

        return;
      }

      const {
        minimum,
        maximum
      } = getVerticalLimits();

      const centerY =
        minimum +
        readSavedPosition() *
        (
          maximum -
          minimum
        );

      tab.style.top =
        `${centerY}px`;
    }

    function moveTab(
      clientY
    ) {
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
          event.pointerId !==
            pointerId
        ) {
          return;
        }

        currentY =
          event.clientY;

        const distanceMoved =
          Math.abs(
            currentY -
            startY
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

        moveTab(
          currentY
        );
      }
    );

    function finishDragging(
      event
    ) {
      if (
        pointerId === null ||
        event.pointerId !==
          pointerId
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
          moveTab(
            currentY
          );

        savePosition(
          finalCenterY
        );

        suppressNextClick = true;

        window.setTimeout(
          () => {
            suppressNextClick =
              false;
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

  function getToggleWidgets() {
    return classroomWidgets.filter(
      widget =>
        widget.type ===
        "toggle"
    );
  }

  function getDefaultWidgetSettings() {
    const settings = {};

    getToggleWidgets().forEach(
      widget => {
        settings[widget.id] =
          Boolean(
            widget.defaultEnabled
          );
      }
    );

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

  function saveWidgetSettings(
    settings
  ) {
    localStorage.setItem(
      WIDGET_STORAGE_KEY,
      JSON.stringify(
        settings
      )
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
      document.createElement(
        "style"
      );

    style.id =
      "classroom-toolbar-styles";

    style.textContent = `
      /*
      ========================================
      RIGHT EDGE BUTTONS
      ========================================
      */

      .patriot-edge-tab {
        position: fixed;
        right: 0;
        z-index: 6100;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 56px;
        padding: 8px;
        color: ${COLORS.white};
        background:
          rgba(42, 67, 163, 0.82);
        border:
          1px solid
          rgba(255, 255, 255, 0.32);
        border-right: 0;
        border-radius:
          14px 0 0 14px;
        box-shadow:
          0 7px 22px
          rgba(32, 40, 58, 0.18);
        cursor: grab;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        backdrop-filter:
          blur(16px);
        -webkit-backdrop-filter:
          blur(16px);
        transform:
          translateY(-50%);
        transition:
          width 180ms ease,
          opacity 180ms ease,
          visibility 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease,
          transform 180ms ease;
      }

      .patriot-edge-tab:hover {
        width: 51px;
        background:
          rgba(207, 27, 19, 0.94);
        box-shadow:
          0 9px 26px
          rgba(32, 40, 58, 0.24);
      }

      .patriot-edge-tab.dragging {
        width: 51px;
        cursor: grabbing;
        background:
          rgba(207, 27, 19, 0.97);
        box-shadow:
          0 11px 30px
          rgba(32, 40, 58, 0.28);
      }

      .patriot-edge-tab.panel-active {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
        transform:
          translateY(-50%)
          translateX(18px);
      }

      .patriot-edge-tab img {
        display: block;
        width: 30px;
        height: 30px;
        object-fit: contain;
        pointer-events: none;
      }

      .classroom-toolbar-tab img,
      .teach-widget-tab img {
        filter:
          brightness(0)
          invert(1);
      }

      /*
      ========================================
      RIGHT-SIDE GLASS PANELS
      ========================================
      */

      .patriot-edge-panel {
        position: fixed;
        top: 50%;
        right: 12px;
        z-index: 6200;
        visibility: hidden;
        opacity: 0;
        color: ${COLORS.text};
        background:
          rgba(255, 255, 255, 0.88);
        border:
          1px solid
          rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        box-shadow:
          0 20px 52px
          rgba(32, 40, 58, 0.22);
        backdrop-filter:
          blur(22px);
        -webkit-backdrop-filter:
          blur(22px);
        transform:
          translateY(-50%)
          translateX(34px);
        transition:
          visibility 200ms ease,
          opacity 200ms ease,
          transform 200ms ease;
      }

      .patriot-edge-panel.open {
        visibility: visible;
        opacity: 1;
        transform:
          translateY(-50%)
          translateX(0);
      }

      .patriot-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding:
          13px 13px
          11px 16px;
        border-bottom:
          1px solid
          rgba(42, 67, 163, 0.12);
      }

      .patriot-panel-title {
        margin: 0;
        color: ${COLORS.text};
        font-family:
          "Literata",
          Georgia,
          serif;
        font-size: 1rem;
        letter-spacing: -0.02em;
      }

      .patriot-toolbar-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 32px;
        height: 32px;
        padding: 0;
        color: ${COLORS.blue};
        font-size: 1.2rem;
        font-weight: bold;
        background:
          rgba(42, 67, 163, 0.08);
        border: 0;
        border-radius: 9px;
        cursor: pointer;
      }

      .patriot-toolbar-close:hover {
        color: ${COLORS.white};
        background:
          ${COLORS.red};
      }

      /*
      ========================================
      QUICK LINKS PANEL
      ========================================
      */

      .classroom-toolbar-panel {
        width: 94px;
        padding-bottom: 11px;
      }

      .classroom-toolbar-panel
        .patriot-panel-header {
        justify-content: center;
        padding:
          10px 8px 8px;
      }

      .classroom-toolbar-panel
        .patriot-panel-title {
        display: none;
      }

      .classroom-toolbar-links {
        display: grid;
        justify-content: center;
        gap: 8px;
        padding:
          10px 10px 0;
      }

      .classroom-toolbar-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        height: 54px;
        padding: 7px;
        background:
          rgba(255, 255, 255, 0.94);
        border:
          1px solid
          rgba(42, 67, 163, 0.1);
        border-radius: 13px;
        box-shadow:
          0 5px 13px
          rgba(42, 67, 163, 0.08);
        transition:
          transform 170ms ease,
          background 170ms ease,
          box-shadow 170ms ease;
      }

      .classroom-toolbar-link:hover {
        transform:
          translateY(-2px);
        background:
          ${COLORS.white};
        box-shadow:
          0 8px 18px
          rgba(42, 67, 163, 0.14);
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

      /*
      ========================================
      WIDGET PANEL
      ========================================
      */

      .teach-widget-panel {
        width: 286px;
        max-height:
          calc(100vh - 32px);
        overflow-y: auto;
      }

      .teach-widget-description {
        margin:
          0;
        padding:
          10px 16px 4px;
        color:
          ${COLORS.muted};
        font-size: 0.76rem;
        line-height: 1.4;
      }

      .teach-widget-options {
        display: grid;
        gap: 6px;
        padding:
          8px 12px 13px;
      }

      .teach-widget-option {
        display: flex;
        align-items: center;
        gap: 9px;
        width: 100%;
        min-height: 43px;
        padding: 7px 9px;
        color:
          ${COLORS.text};
        font: inherit;
        text-align: left;
        background:
          rgba(255, 255, 255, 0.76);
        border:
          1px solid
          rgba(42, 67, 163, 0.09);
        border-radius: 11px;
        cursor: pointer;
        user-select: none;
        transition:
          background 170ms ease,
          border-color 170ms ease,
          transform 170ms ease;
      }

      .teach-widget-option:hover {
        background:
          ${COLORS.white};
        border-color:
          rgba(42, 67, 163, 0.18);
        transform:
          translateX(-2px);
      }

      .teach-widget-option:focus-within,
      button.teach-widget-option:focus-visible {
        outline:
          3px solid
          ${COLORS.gold};
        outline-offset: 2px;
      }

      .teach-widget-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 27px;
        height: 27px;
        font-size: 1rem;
        background:
          rgba(255, 226, 105, 0.24);
        border-radius: 8px;
      }

      .teach-widget-name {
        flex: 1;
        font-size: 0.82rem;
        font-weight: 700;
      }

      .teach-widget-toggle {
        position: relative;
        flex: 0 0 auto;
        width: 39px;
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
        background: #aab0bc;
        border-radius: 999px;
        transition:
          background 180ms ease;
      }

      .teach-widget-slider::before {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        background:
          ${COLORS.white};
        border-radius: 50%;
        box-shadow:
          0 1px 4px
          rgba(0, 0, 0, 0.26);
        transition:
          transform 180ms ease;
      }

      .teach-widget-toggle
        input:checked
        + .teach-widget-slider {
        background:
          ${COLORS.blue};
      }

      .teach-widget-toggle
        input:checked
        + .teach-widget-slider::before {
        transform:
          translateX(17px);
      }

      .teach-widget-toggle
        input:focus-visible
        + .teach-widget-slider {
        outline:
          3px solid
          ${COLORS.gold};
        outline-offset: 2px;
      }

      .teach-widget-action-label {
        flex: 0 0 auto;
        padding: 5px 8px;
        color:
          ${COLORS.white};
        font-size: 0.67rem;
        font-weight: 750;
        line-height: 1;
        background:
          ${COLORS.red};
        border-radius: 999px;
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
          width: 43px;
          height: 52px;
          cursor: pointer;
          touch-action: auto;
        }

        .patriot-edge-tab:hover {
          width: 46px;
        }

        .patriot-edge-tab img {
          width: 27px;
          height: 27px;
        }

        .patriot-edge-panel {
          top: auto;
          right: 8px;
          bottom: 72px;
          left: 8px;
          width: auto;
          max-height:
            calc(100vh - 96px);
          transform:
            translateY(20px);
        }

        .patriot-edge-panel.open {
          transform:
            translateY(0);
        }

        .classroom-toolbar-panel {
          right: 8px;
          left: auto;
          width: 92px;
        }

        .teach-widget-panel {
          width: auto;
        }
      }

      @media (
        prefers-reduced-motion:
        reduce
      ) {
        .patriot-edge-tab,
        .patriot-edge-panel,
        .classroom-toolbar-link,
        .teach-widget-option,
        .teach-widget-slider,
        .teach-widget-slider::before {
          transition: none;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /*
  ==========================================
  QUICK LINKS
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

  function createQuickLinkButton(
    tool
  ) {
    const name =
      tool.name ||
      "Classroom Tool";

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

    quickLinkTab =
      document.createElement(
        "button"
      );

    quickLinkTab.id =
      "classroom-toolbar-tab";

    quickLinkTab.className =
      "patriot-edge-tab classroom-toolbar-tab";

    quickLinkTab.type =
      "button";

    quickLinkTab.innerHTML = `
      <img
        src="Assets/Icons/tool-tab.png"
        alt=""
      >
    `;

    quickLinkTab.setAttribute(
      "aria-label",
      "Open classroom quick links"
    );

    quickLinkTab.setAttribute(
      "aria-expanded",
      "false"
    );

    quickLinkTab.title =
      "Quick Links — click to open or drag to move";

    quickLinkPanel =
      document.createElement(
        "aside"
      );

    quickLinkPanel.id =
      "classroom-toolbar-panel";

    quickLinkPanel.className =
      "patriot-edge-panel classroom-toolbar-panel";

    quickLinkPanel.setAttribute(
      "aria-label",
      "Classroom quick links"
    );

    quickLinkPanel.innerHTML = `
      <div class="patriot-panel-header">
        <h2 class="patriot-panel-title">
          Quick Links
        </h2>

        <button
          id="classroom-toolbar-close"
          class="patriot-toolbar-close"
          type="button"
          aria-label="Close classroom quick links"
          title="Close"
        >
          ×
        </button>
      </div>

      <div class="classroom-toolbar-links">
        ${tools
          .map(
            createQuickLinkButton
          )
          .join("")}
      </div>
    `;

    document.body.appendChild(
      quickLinkTab
    );

    document.body.appendChild(
      quickLinkPanel
    );

    const closeButton =
      quickLinkPanel.querySelector(
        "#classroom-toolbar-close"
      );

    const dragController =
      makeEdgeTabDraggable(
        quickLinkTab,
        QUICK_LINK_TAB_POSITION_KEY,
        0.59
      );

    quickLinkTab.addEventListener(
      "click",
      () => {
        if (
          dragController.shouldIgnoreClick()
        ) {
          return;
        }

        openQuickLinks();
      }
    );

    closeButton.addEventListener(
      "click",
      closeAllPanels
    );
  }

  /*
  ==========================================
  WIDGET VISIBILITY
  ==========================================
  */

  function findWidgetContainer(
    widget
  ) {
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
      findWidgetContainer(
        widget
      );

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
    getToggleWidgets().forEach(
      widget => {
        applyWidgetVisibility(
          widget,
          Boolean(
            settings[widget.id]
          )
        );
      }
    );
  }

  /*
  ==========================================
  WIDGET OPTIONS
  ==========================================
  */

  function createToggleWidgetOption(
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

  function createActionWidgetOption(
    widget
  ) {
    return `
      <button
        class="teach-widget-option"
        type="button"
        data-widget-action="${escapeHtml(widget.id)}"
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

        <span class="teach-widget-action-label">
          Open
        </span>
      </button>
    `;
  }

  function createWidgetOption(
    widget,
    settings
  ) {
    if (
      widget.type ===
      "action"
    ) {
      return createActionWidgetOption(
        widget
      );
    }

    return createToggleWidgetOption(
      widget,
      Boolean(
        settings[widget.id]
      )
    );
  }

  /*
  ==========================================
  WIDGET PANEL
  ==========================================
  */

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

    widgetTab =
      document.createElement(
        "button"
      );

    widgetTab.id =
      "teach-widget-tab";

    widgetTab.className =
      "patriot-edge-tab teach-widget-tab";

    widgetTab.type =
      "button";

    widgetTab.innerHTML = `
      <img
        src="Assets/Icons/widgets.png"
        alt=""
      >
    `;

    widgetTab.setAttribute(
      "aria-label",
      "Open classroom widgets"
    );

    widgetTab.setAttribute(
      "aria-expanded",
      "false"
    );

    widgetTab.title =
      "Widgets — click to open or drag to move";

    widgetPanel =
      document.createElement(
        "aside"
      );

    widgetPanel.id =
      "teach-widget-panel";

    widgetPanel.className =
      "patriot-edge-panel teach-widget-panel";

    widgetPanel.setAttribute(
      "aria-label",
      "Classroom widgets"
    );

    widgetPanel.innerHTML = `
      <div class="patriot-panel-header">
        <h2 class="patriot-panel-title">
          Classroom Widgets
        </h2>

        <button
          id="teach-widget-close"
          class="patriot-toolbar-close"
          type="button"
          aria-label="Close classroom widgets"
          title="Close"
        >
          ×
        </button>
      </div>

      <p class="teach-widget-description">
        Turn classroom widgets on or open
        a teaching tool. Your choices are saved.
      </p>

      <div class="teach-widget-options">
        ${classroomWidgets
          .map(
            widget =>
              createWidgetOption(
                widget,
                settings
              )
          )
          .join("")}
      </div>
    `;

    document.body.appendChild(
      widgetTab
    );

    document.body.appendChild(
      widgetPanel
    );

    const closeButton =
      widgetPanel.querySelector(
        "#teach-widget-close"
      );

    const dragController =
      makeEdgeTabDraggable(
        widgetTab,
        WIDGET_TAB_POSITION_KEY,
        0.43
      );

    widgetTab.addEventListener(
      "click",
      () => {
        if (
          dragController.shouldIgnoreClick()
        ) {
          return;
        }

        openWidgets();
      }
    );

    closeButton.addEventListener(
      "click",
      closeAllPanels
    );

    widgetPanel.addEventListener(
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
              item.id ===
                widgetId &&
              item.type ===
                "toggle"
          );

        if (!widget) {
          return;
        }

        const updatedSettings =
          readWidgetSettings();

        updatedSettings[
          widgetId
        ] =
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

    widgetPanel.addEventListener(
      "click",
      event => {
        const actionButton =
          event.target.closest(
            "[data-widget-action]"
          );

        if (!actionButton) {
          return;
        }

        const action =
          actionButton.dataset
            .widgetAction;

        if (
          action ===
          "whiteboard"
        ) {
          closeAllPanels();

          openWhiteboard().catch(
            () => {
              /*
              Error messaging is handled
              inside openWhiteboard.
              */
            }
          );
        }
      }
    );

    applyAllWidgetSettings(
      settings
    );
  }

  /*
  ==========================================
  GLOBAL EVENTS
  ==========================================
  */

  function connectGlobalEvents() {
    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key ===
          "Escape"
        ) {
          closeAllPanels();
        }
      }
    );

    document.addEventListener(
      "click",
      event => {
        const clickedPanel =
          event.target.closest(
            ".patriot-edge-panel"
          );

        const clickedTab =
          event.target.closest(
            ".patriot-edge-tab"
          );

        if (
          !clickedPanel &&
          !clickedTab &&
          (
            quickLinkPanel?.classList.contains(
              "open"
            ) ||
            widgetPanel?.classList.contains(
              "open"
            )
          )
        ) {
          closeAllPanels();
        }
      }
    );
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

    connectGlobalEvents();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startToolbars
    );
  } else {
    startToolbars();
  }
})();
