/*
==========================================
PATRIOT COMMAND
Teach — Classroom Widgets
==========================================

Manages optional classroom widgets that
are separate from the lesson itself.

Current widgets:
1. Scrolling Announcements
2. Student Picker hook
3. Review Points hook
4. Random Groups hook

Announcements load from the shared
AdminContent Google Sheet.
==========================================
*/

(function () {
  const WIDGET_STORAGE_KEY =
    "patriotTeachWidgetPreferences";

  let liveAnnouncements = [];

  let announcementRequestPending =
    false;

  let announcementRefreshTimer =
    null;

  const DEFAULT_WIDGET_SETTINGS = {
    timer: true,
    announcements: false,
    picker: false,
    points: false,
    groups: false
  };

  /*
  ==========================================
  STORAGE HELPERS
  ==========================================
  */

  function safelyReadJson(
    storageKey,
    fallbackValue
  ) {
    const savedValue =
      localStorage.getItem(
        storageKey
      );

    if (!savedValue) {
      return fallbackValue;
    }

    try {
      return JSON.parse(
        savedValue
      );
    } catch (error) {
      console.error(
        `Patriot Command could not read ${storageKey}.`,
        error
      );

      return fallbackValue;
    }
  }

  function readWidgetSettings() {
    const savedSettings =
      safelyReadJson(
        WIDGET_STORAGE_KEY,
        DEFAULT_WIDGET_SETTINGS
      );

    if (
      !savedSettings ||
      typeof savedSettings !== "object" ||
      Array.isArray(savedSettings)
    ) {
      return {
        ...DEFAULT_WIDGET_SETTINGS
      };
    }

    return {
      ...DEFAULT_WIDGET_SETTINGS,
      ...savedSettings
    };
  }

    function cleanText(value) {
    return String(
      value ||
      ""
    ).trim();
  }

  function readAnnouncements() {
    return [
      ...liveAnnouncements
    ];
  }

  function createAnnouncementCallbackName() {
    return (
      "__patriotTeachAnnouncements_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(16)
        .slice(2)
    );
  }

  function loadLiveAnnouncements() {
    if (announcementRequestPending) {
      return;
    }

    const scriptUrl =
      cleanText(
        window.GOOGLE_SCRIPT_URL
      );

    if (!scriptUrl) {
      console.error(
        "Patriot Command could not load announcements because the Google Apps Script URL is missing."
      );

      return;
    }

    announcementRequestPending =
      true;

    const callbackName =
      createAnnouncementCallbackName();

    const script =
      document.createElement(
        "script"
      );

    const timeout =
      window.setTimeout(
        function () {
          cleanup();

          console.error(
            "The Patriot Command announcement request timed out."
          );
        },
        15000
      );

    function cleanup() {
      announcementRequestPending =
        false;

      window.clearTimeout(
        timeout
      );

      delete window[
        callbackName
      ];

      script.remove();
    }

    window[
      callbackName
    ] = function (
      response
    ) {
      cleanup();

      if (
        !response ||
        response.success !==
          true
      ) {
        console.error(
          response?.message ||
          "Patriot Command could not load announcements."
        );

        return;
      }

      liveAnnouncements =
        Array.isArray(
          response.announcements
        )
          ? response.announcements
              .map(
                function (
                  announcement
                ) {
                  return cleanText(
                    announcement?.message
                  );
                }
              )
              .filter(Boolean)
          : [];

      renderAnnouncements();
    };

    const url =
      new URL(
        scriptUrl
      );

    url.searchParams.set(
      "action",
      "getActiveAnnouncements"
    );

    url.searchParams.set(
      "callback",
      callbackName
    );

    url.searchParams.set(
      "cacheBust",
      String(
        Date.now()
      )
    );

    script.src =
      url.toString();

    script.async =
      true;

    script.onerror =
      function () {
        cleanup();

        console.error(
          "Patriot Command could not reach the announcement backend."
        );
      };

    document.head.appendChild(
      script
    );
  }

  function startAnnouncementRefresh() {
    if (announcementRefreshTimer) {
      return;
    }

    announcementRefreshTimer =
      window.setInterval(
        loadLiveAnnouncements,
        60000
      );
  }

  /*
  ==========================================
  HTML SAFETY
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

  /*
  ==========================================
  STYLES
  ==========================================
  */

  function addWidgetStyles() {
    if (
      document.getElementById(
        "patriot-classroom-widget-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "patriot-classroom-widget-styles";

    style.textContent = `
      /*
      ========================================
      ANNOUNCEMENT TICKER
      ========================================
      */

            body.patriot-announcements-active {
  padding-bottom: 46px;
}

.patriot-announcement-bar {
  position: fixed;
  right: 10px;
  bottom: 8px;
  left: 10px;
  z-index: 3900;

  display: none;
  align-items: center;

  height: 46px;

  overflow: hidden;

  color: #ffffff;

  background:
    linear-gradient(
      110deg,
      rgba(42, 67, 163, 0.98) 0%,
      rgba(31, 50, 121, 0.98) 55%,
      rgba(22, 40, 91, 0.98) 100%
    );

  border:
    1px solid
    rgba(255, 255, 255, 0.28);

  border-radius: 13px;

  box-shadow:
    0 -3px 18px
    rgba(32, 40, 58, 0.18);

  backdrop-filter:
    blur(16px);

  -webkit-backdrop-filter:
    blur(16px);
}

.patriot-announcement-bar.visible {
  display: flex;
}

.patriot-announcement-label {
  position: relative;
  z-index: 3;

  display: flex;
  align-items: center;
  align-self: stretch;
  flex: 0 0 auto;

  gap: 7px;

  min-width: 165px;

  padding:
    0
    16px;

  color:
    #20283a;

  font-family:
    "Literata",
    Georgia,
    serif;

  font-size: 0.74rem;
  font-weight: 750;
  line-height: 1;

  letter-spacing: -0.01em;
  text-transform: none;

  background:
    linear-gradient(
      135deg,
      #ffe269,
      #e8c95d
    );

  border-right:
    3px solid
    #cf1b13;

  box-shadow:
    5px
    0
    15px
    rgba(0, 0, 0, 0.13);
}

.patriot-announcement-label-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 23px;
  height: 23px;

  color:
    #cf1b13;

  font-size: 0.83rem;

  background:
    rgba(255, 255, 255, 0.48);

  border-radius: 7px;
}

.patriot-announcement-label-text {
  white-space: nowrap;
}

.patriot-announcement-window {
  position: relative;

  flex: 1;

  min-width: 0;
  height: 100%;

  overflow: hidden;
}

.patriot-announcement-window::before,
.patriot-announcement-window::after {
  content: "";

  position: absolute;
  top: 0;
  bottom: 0;

  z-index: 2;

  width: 32px;

  pointer-events: none;
}

.patriot-announcement-window::before {
  left: 0;

  background:
    linear-gradient(
      90deg,
      rgba(42, 67, 163, 1),
      rgba(42, 67, 163, 0)
    );
}

.patriot-announcement-window::after {
  right: 0;

  background:
    linear-gradient(
      270deg,
      rgba(22, 40, 91, 1),
      rgba(22, 40, 91, 0)
    );
}

.patriot-announcement-track {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;

  width: max-content;
  height: 100%;

  white-space: nowrap;

  will-change:
    transform;

  animation:
    patriot-announcement-scroll
    var(
      --patriot-announcement-speed,
      34s
    )
    linear
    infinite;
}

.patriot-announcement-bar.paused
.patriot-announcement-track {
  animation-play-state:
    paused;
}

.patriot-announcement-group {
  display: flex;
  align-items: center;
  justify-content: space-around;

  flex: 0 0 auto;

  min-width: 100vw;
  height: 100%;

  padding:
    0
    80px
    0
    30px;
}

.patriot-announcement-item {
  display: inline-flex;
  align-items: center;

  flex: 0 0 auto;

  gap: 13px;

  padding:
    0
    30px;

  font-family:
    "Inter",
    "Segoe UI",
    Arial,
    sans-serif;

  font-size: 0.78rem;
  font-weight: 650;
  line-height: 1;

  letter-spacing: 0.005em;
}

.patriot-announcement-divider {
  color:
    #ffe269;

  font-size: 0.62rem;
}

.patriot-announcement-controls {
  position: relative;
  z-index: 4;

  display: flex;
  align-items: center;
  align-self: stretch;

  flex: 0 0 auto;

  gap: 5px;

  padding:
    0
    8px;

  background:
    linear-gradient(
      90deg,
      rgba(22, 40, 91, 0),
      rgba(22, 40, 91, 0.98) 30%
    );
}

.patriot-announcement-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 29px;
  height: 29px;

  padding: 0;

  color:
    #ffffff;

  font-size: 0.76rem;

  background:
    rgba(255, 255, 255, 0.10);

  border:
    1px solid
    rgba(255, 255, 255, 0.24);

  border-radius: 8px;

  cursor: pointer;

  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}

.patriot-announcement-control:hover {
  color:
    #ffffff;

  background:
    #cf1b13;

  border-color:
    #cf1b13;

  transform:
    translateY(-1px);
}

.patriot-announcement-control:focus-visible {
  outline:
    3px solid
    #ffe269;

  outline-offset:
    2px;
}
      @keyframes
      patriot-announcement-scroll {
        from {
          transform:
            translateX(0);
        }

        to {
          transform:
            translateX(-50%);
        }
      }

      /*
      ========================================
      ANNOUNCEMENT EDITOR
      ========================================
      */

      .patriot-announcement-modal {
        position: fixed;
        inset: 0;
        z-index: 5000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 22px;
        background:
          rgba(5, 16, 32, 0.7);
        backdrop-filter:
          blur(5px);
        -webkit-backdrop-filter:
          blur(5px);
      }

      .patriot-announcement-modal.open {
        display: flex;
      }

      .patriot-announcement-editor {
        width: min(
          620px,
          100%
        );
        max-height:
          calc(100vh - 44px);
        padding: 24px;
        overflow-y: auto;
        color: #11284a;
        background: #ffffff;
        border:
          3px solid #d3a84f;
        border-radius: 16px;
        box-shadow:
          0 18px 55px
          rgba(0, 0, 0, 0.34);
      }

      .patriot-announcement-editor h2 {
        margin:
          0 0 6px;
        color: #11284a;
        font-size: 1.45rem;
      }

      .patriot-announcement-editor p {
        margin:
          0 0 16px;
        color: #596579;
        line-height: 1.45;
      }

      .patriot-announcement-editor label {
        display: block;
        margin-bottom: 7px;
        color: #11284a;
        font-size: 0.9rem;
        font-weight: 800;
      }

      .patriot-announcement-editor textarea {
        display: block;
        width: 100%;
        min-height: 230px;
        padding: 13px;
        color: #11284a;
        font: inherit;
        line-height: 1.5;
        resize: vertical;
        background: #f7f8fa;
        border:
          2px solid #c6ccd5;
        border-radius: 9px;
        box-sizing: border-box;
      }

      .patriot-announcement-editor textarea:
      focus {
        outline: none;
        border-color: #11284a;
        box-shadow:
          0 0 0 3px
          rgba(17, 40, 74, 0.14);
      }

      .patriot-announcement-example {
        margin-top: 8px;
        color: #6a7485;
        font-size: 0.8rem;
      }

      .patriot-announcement-editor-actions {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 9px;
        margin-top: 18px;
      }

      .patriot-announcement-button {
        min-height: 42px;
        padding: 9px 17px;
        font: inherit;
        font-weight: 800;
        border-radius: 8px;
        cursor: pointer;
      }

      .patriot-announcement-button.cancel {
        color: #11284a;
        background: #ffffff;
        border:
          2px solid #aeb6c1;
      }

      .patriot-announcement-button.save {
        color: #ffffff;
        background: #aa3235;
        border:
          2px solid #aa3235;
      }

      .patriot-announcement-button:hover {
        filter: brightness(0.96);
      }

      /*
      ========================================
      RESPONSIVE
      ========================================
      */

      @media (
  max-width: 700px
) {
  body.patriot-announcements-active {
    padding-bottom: 43px;
  }

  .patriot-announcement-bar {
    right: 5px;
    bottom: 5px;
    left: 5px;

    height: 43px;

    border-radius: 11px;
  }

  .patriot-announcement-label {
    min-width: 0;

    padding:
      0
      9px;
  }

  .patriot-announcement-label-text {
    display: none;
  }

  .patriot-announcement-item {
    padding:
      0
      20px;

    font-size: 0.72rem;
  }

  .patriot-announcement-group {
    padding-right: 68px;
  }

  .patriot-announcement-editor {
    padding: 19px;
  }
}
      @media (
        prefers-reduced-motion:
        reduce
      ) {
        .patriot-announcement-track {
          animation: none;
          position: static;
          width: auto;
        }

        .patriot-announcement-group {
          min-width: auto;
        }

        .patriot-announcement-group.copy {
          display: none;
        }

        .patriot-announcement-window {
          overflow-x: auto;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /*
  ==========================================
  TICKER CONTENT
  ==========================================
  */

  function createAnnouncementItems(
    announcements
  ) {
    const usableAnnouncements =
      announcements.length
        ? announcements
        : [
            "No announcements have been added."
          ];

    return usableAnnouncements
      .map(
        (
          announcement,
          index
        ) => {
          const divider =
            index <
            usableAnnouncements.length -
              1
              ? `
                <span
                  class="patriot-announcement-divider"
                  aria-hidden="true"
                >
                  ◆
                </span>
              `
              : "";

          return `
            <span
              class="patriot-announcement-item"
            >
              <span>
                ${escapeHtml(
                  announcement
                )}
              </span>

              ${divider}
            </span>
          `;
        }
      )
      .join("");
  }

  function calculateTickerSpeed(
    announcements
  ) {
    const totalCharacters =
      announcements.reduce(
        (
          total,
          announcement
        ) => {
          return (
            total +
            String(
              announcement
            ).length
          );
        },
        0
      );

    const calculatedSeconds =
      Math.round(
        totalCharacters / 3.4
      );

    return Math.max(
      24,
      Math.min(
        calculatedSeconds,
        90
      )
    );
  }

  function renderAnnouncements() {
    const bar =
      document.getElementById(
        "announcement-bar"
      );

    if (!bar) {
      return;
    }

    const track =
      bar.querySelector(
        ".patriot-announcement-track"
      );

    if (!track) {
      return;
    }

    const announcements =
      readAnnouncements();

    const items =
      createAnnouncementItems(
        announcements
      );

    track.innerHTML = `
      <div
        class="patriot-announcement-group"
      >
        ${items}
      </div>

      <div
        class="patriot-announcement-group copy"
        aria-hidden="true"
      >
        ${items}
      </div>
    `;

    const speed =
      calculateTickerSpeed(
        announcements
      );

    track.style.setProperty(
      "--patriot-announcement-speed",
      `${speed}s`
    );
  }

  /*
  ==========================================
  TICKER CREATION
  ==========================================
  */

  function createAnnouncementBar() {
    if (
      document.getElementById(
        "announcement-bar"
      )
    ) {
      return;
    }

    const bar =
      document.createElement(
        "section"
      );

    bar.id =
      "announcement-bar";

    bar.className =
      "patriot-announcement-bar";

    bar.setAttribute(
      "aria-label",
      "Classroom announcements"
    );

    bar.innerHTML = `
      <div
        class="patriot-announcement-label"
      >
        <span
          class="patriot-announcement-label-icon"
          aria-hidden="true"
        >
          📣
        </span>

        <span
          class="patriot-announcement-label-text"
        >
          Announcements
        </span>
      </div>

      <div
        class="patriot-announcement-window"
      >
        <div
          class="patriot-announcement-track"
        ></div>
      </div>

      <div
        class="patriot-announcement-controls"
      >
        <button
          id="announcement-pause-button"
          class="patriot-announcement-control"
          type="button"
          title="Pause announcements"
          aria-label="Pause announcements"
          aria-pressed="false"
        >
          ❚❚
        </button>
        
      </div>
    `;

    document.body.appendChild(
      bar
    );

    const pauseButton =
      document.getElementById(
        "announcement-pause-button"
      );

    pauseButton.addEventListener(
      "click",
      function () {
        const paused =
          bar.classList.toggle(
            "paused"
          );

        pauseButton.setAttribute(
          "aria-pressed",
          String(paused)
        );

        pauseButton.setAttribute(
          "aria-label",
          paused
            ? "Resume announcements"
            : "Pause announcements"
        );

        pauseButton.title =
          paused
            ? "Resume announcements"
            : "Pause announcements";

        pauseButton.textContent =
          paused
            ? "▶"
            : "❚❚";
      }
    );


    loadLiveAnnouncements();
  }

  /*
  ==========================================
  ANNOUNCEMENT EDITOR
  ==========================================
  */

  function createAnnouncementEditor() {
    if (
      document.getElementById(
        "announcement-editor-modal"
      )
    ) {
      return;
    }

    const modal =
      document.createElement(
        "div"
      );

    modal.id =
      "announcement-editor-modal";

    modal.className =
      "patriot-announcement-modal";

    modal.setAttribute(
      "role",
      "dialog"
    );

    modal.setAttribute(
      "aria-modal",
      "true"
    );

    modal.setAttribute(
      "aria-labelledby",
      "announcement-editor-title"
    );

    modal.innerHTML = `
      <div
        class="patriot-announcement-editor"
      >
        <h2
          id="announcement-editor-title"
        >
          Edit Announcements
        </h2>

        <p>
          Enter one announcement on each
          line. Patriot Command will cycle
          through them continuously.
        </p>

        <label
          for="announcement-editor-text"
        >
          Weekly announcements
        </label>

        <textarea
          id="announcement-editor-text"
          placeholder="Faculty meeting Tuesday at 3:15&#10;Picture Day is Friday&#10;Book giveaway this week"
        ></textarea>

        <div
          class="patriot-announcement-example"
        >
          Blank lines will be ignored.
        </div>

        <div
          class="patriot-announcement-editor-actions"
        >
          <button
            id="announcement-cancel-button"
            class="patriot-announcement-button cancel"
            type="button"
          >
            Cancel
          </button>

          <button
            id="announcement-save-button"
            class="patriot-announcement-button save"
            type="button"
          >
            Save Announcements
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(
      modal
    );

    const cancelButton =
      document.getElementById(
        "announcement-cancel-button"
      );

    const saveButton =
      document.getElementById(
        "announcement-save-button"
      );

    cancelButton.addEventListener(
      "click",
      closeAnnouncementEditor
    );

    saveButton.addEventListener(
      "click",
      saveAnnouncementEditor
    );

    modal.addEventListener(
      "click",
      function (event) {
        if (
          event.target === modal
        ) {
          closeAnnouncementEditor();
        }
      }
    );
  }

  function openAnnouncementEditor() {
    createAnnouncementEditor();

    const modal =
      document.getElementById(
        "announcement-editor-modal"
      );

    const textarea =
      document.getElementById(
        "announcement-editor-text"
      );

    if (
      !modal ||
      !textarea
    ) {
      return;
    }

    textarea.value =
      readAnnouncements()
        .join("\n");

    modal.classList.add(
      "open"
    );

    document.body.style.overflow =
      "hidden";

    window.setTimeout(
      function () {
        textarea.focus();
      },
      50
    );
  }

  function closeAnnouncementEditor() {
    const modal =
      document.getElementById(
        "announcement-editor-modal"
      );

    if (!modal) {
      return;
    }

    modal.classList.remove(
      "open"
    );

    document.body.style.overflow =
      "";
  }

  function saveAnnouncementEditor() {
    const textarea =
      document.getElementById(
        "announcement-editor-text"
      );

    if (!textarea) {
      return;
    }

    const announcements =
      textarea.value
        .split("\n")
        .map(announcement => {
          return announcement.trim();
        })
        .filter(Boolean);

    saveAnnouncements(
      announcements
    );

    renderAnnouncements();
    closeAnnouncementEditor();
  }

  /*
  ==========================================
  ANNOUNCEMENT VISIBILITY
  ==========================================
  */

  function setAnnouncementsEnabled(
    enabled
  ) {
    createAnnouncementBar();

    const bar =
      document.getElementById(
        "announcement-bar"
      );

    if (!bar) {
      return;
    }

    bar.classList.toggle(
      "visible",
      enabled
    );

    document.body.classList.toggle(
      "patriot-announcements-active",
      enabled
    );

    if (enabled) {
      loadLiveAnnouncements();
      startAnnouncementRefresh();
    }
  }

/*
  ==========================================
  OTHER WIDGET HOOKS
  ==========================================

  These events are ready for the Picker,
  Points, and Groups widgets when those
  tools are added.

  Each future widget can listen for:

  patriotPickerChange
  patriotPointsChange
  patriotGroupsChange
  ==========================================
  */

  function sendIndividualWidgetEvent(
    widgetId,
    enabled
  ) {
    const eventNames = {
      picker:
        "patriotPickerChange",

      points:
        "patriotPointsChange",

      groups:
        "patriotGroupsChange"
    };

    const eventName =
      eventNames[widgetId];

    if (!eventName) {
      return;
    }

    document.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail: {
            enabled
          }
        }
      )
    );
  }

  /*
  ==========================================
  TOOLBAR EVENT LISTENER
  ==========================================
  */

  function handleWidgetChange(
    event
  ) {
    if (
      !event.detail ||
      !event.detail.widgetId
    ) {
      return;
    }

    const widgetId =
      event.detail.widgetId;

    const enabled =
      Boolean(
        event.detail.enabled
      );

    if (
      widgetId ===
      "announcements"
    ) {
      setAnnouncementsEnabled(
        enabled
      );

      return;
    }

    if (
      widgetId === "picker" ||
      widgetId === "points" ||
      widgetId === "groups"
    ) {
      sendIndividualWidgetEvent(
        widgetId,
        enabled
      );
    }
  }

  /*
  ==========================================
  KEYBOARD CONTROLS
  ==========================================
  */

  function addKeyboardControls() {
    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key !== "Escape"
        ) {
          return;
        }

        const modal =
          document.getElementById(
            "announcement-editor-modal"
          );

        if (
          modal &&
          modal.classList.contains(
            "open"
          )
        ) {
          closeAnnouncementEditor();
        }
      }
    );
  }

  /*
  ==========================================
  PUBLIC ACCESS
  ==========================================

  This lets another Patriot Command file
  open the announcement editor later with:

  PatriotClassroomWidgets.editAnnouncements()
  ==========================================
  */

  window.PatriotClassroomWidgets = {
    showAnnouncements:
      function () {
        setAnnouncementsEnabled(
          true
        );
      },

    hideAnnouncements:
      function () {
        setAnnouncementsEnabled(
          false
        );
      },

    refreshAnnouncements:
      loadLiveAnnouncements
  };

  /*
  ==========================================
  START
  ==========================================
  */

  function startClassroomWidgets() {
    addWidgetStyles();
    createAnnouncementBar();
    addKeyboardControls();

    document.addEventListener(
      "patriotWidgetChange",
      handleWidgetChange
    );

    const settings =
      readWidgetSettings();

    setAnnouncementsEnabled(
      Boolean(
        settings.announcements
      )
    );

    sendIndividualWidgetEvent(
      "picker",
      Boolean(
        settings.picker
      )
    );

    sendIndividualWidgetEvent(
      "points",
      Boolean(
        settings.points
      )
    );

    sendIndividualWidgetEvent(
      "groups",
      Boolean(
        settings.groups
      )
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startClassroomWidgets
    );
  } else {
    startClassroomWidgets();
  }
})();
