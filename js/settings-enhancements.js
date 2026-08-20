/*
==========================================
PATRIOT COMMAND
Teacher Settings Enhancements
Version 1
==========================================

Adds:
- clean one-column period layout;
- teacher lunch start/end settings;
- immediate cloud sync after Save Teacher Settings;
- live form refresh when cloud settings arrive.
*/
(function () {
  "use strict";

  if (!document.body?.classList.contains("patriot-page-settings")) {
    return;
  }

  const LUNCH_START_KEY = "Lunch Start";
  const LUNCH_END_KEY = "Lunch End";

  function addStyles() {
    if (document.getElementById("patriot-settings-enhancement-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "patriot-settings-enhancement-styles";
    style.textContent = `
      .schedule-grid {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px !important;
      }

      .schedule-row {
        grid-template-columns: 110px minmax(0, 1fr) !important;
      }

      .patriot-lunch-settings {
        margin-top: 16px;
        padding: 13px;
        background: rgba(255, 226, 105, 0.12);
        border: 1px solid rgba(42, 67, 163, 0.12);
        border-radius: 11px;
      }

      .patriot-lunch-heading {
        margin: 0 0 4px;
        color: var(--settings-red, #cf1b13);
        font-family: "Literata", Georgia, serif;
        font-size: 0.9rem;
      }

      .patriot-lunch-copy {
        margin: 0 0 10px;
        color: var(--settings-muted, #657087);
        font-size: 0.66rem;
        line-height: 1.4;
      }

      .patriot-lunch-time-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .patriot-lunch-field label {
        display: block;
        margin-bottom: 4px;
        color: var(--settings-blue, #2a43a3);
        font-size: 0.7rem;
        font-weight: 750;
      }

      .patriot-lunch-field input {
        width: 100%;
        min-height: 38px;
        padding: 7px 9px;
        color: var(--settings-ink, #20283a);
        background: rgba(255,255,255,.94);
        border: 1px solid rgba(42,67,163,.18);
        border-radius: 8px;
      }

      @media (max-width: 700px) {
        .patriot-lunch-time-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }

      @media (max-width: 500px) {
        .schedule-row {
          grid-template-columns: 92px minmax(0, 1fr) !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function addLunchFields() {
    if (document.getElementById("patriot-lunch-settings")) {
      return;
    }

    const scheduleGrid = document.querySelector(".schedule-grid");
    if (!scheduleGrid) {
      return;
    }

    const lunch = document.createElement("section");
    lunch.id = "patriot-lunch-settings";
    lunch.className = "patriot-lunch-settings";
    lunch.innerHTML = `
      <h3 class="patriot-lunch-heading">Lunch Time</h3>
      <p class="patriot-lunch-copy">
        Enter your normal lunch start and end times. Patriot Command will keep track of lunch on the dashboard and warn you when lunch is almost over.
      </p>
      <div class="patriot-lunch-time-grid">
        <div class="patriot-lunch-field">
          <label for="lunch-start">Lunch Starts</label>
          <input id="lunch-start" type="time" aria-label="Lunch start time">
        </div>
        <div class="patriot-lunch-field">
          <label for="lunch-end">Lunch Ends</label>
          <input id="lunch-end" type="time" aria-label="Lunch end time">
        </div>
      </div>
    `;

    scheduleGrid.insertAdjacentElement("afterend", lunch);
  }

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem("patriotTeacherProfile") || "null");
    } catch (error) {
      return null;
    }
  }

  function fillLunch(settings) {
    const start = document.getElementById("lunch-start");
    const end = document.getElementById("lunch-end");
    if (!start || !end) return;

    const classes = settings?.classes || {};
    start.value = String(classes[LUNCH_START_KEY] || "").trim();
    end.value = String(classes[LUNCH_END_KEY] || "").trim();
  }

  function enhanceFormFunctions() {
    const originalCollectForm = window.collectForm;
    if (typeof originalCollectForm === "function" && !originalCollectForm.__patriotLunchWrapped) {
      const enhancedCollectForm = function () {
        const settings = originalCollectForm();
        settings.classes = settings.classes || {};
        settings.classes[LUNCH_START_KEY] =
          document.getElementById("lunch-start")?.value || "";
        settings.classes[LUNCH_END_KEY] =
          document.getElementById("lunch-end")?.value || "";
        return settings;
      };
      enhancedCollectForm.__patriotLunchWrapped = true;
      window.collectForm = enhancedCollectForm;
    }

    const originalFillForm = window.fillForm;
    if (typeof originalFillForm === "function" && !originalFillForm.__patriotLunchWrapped) {
      const enhancedFillForm = function (settings) {
        originalFillForm(settings);
        fillLunch(settings);
      };
      enhancedFillForm.__patriotLunchWrapped = true;
      window.fillForm = enhancedFillForm;
    }

    const originalSave = window.saveTeacherSettings;
    if (typeof originalSave === "function" && !originalSave.__patriotCloudWrapped) {
      const enhancedSave = async function () {
        originalSave();

        const saved = readProfile();
        if (!saved?.teacherName || !saved?.teacherEmail) {
          return;
        }

        const message = document.getElementById("save-message");

        if (!window.PATRIOT_AUTH?.signedIn) {
          if (message) {
            message.textContent = "Saved on this device. Sign in with Google to sync across devices.";
            message.classList.add("show");
          }
          return;
        }

        try {
          if (message) {
            message.textContent = "Saving to your Patriot Command account...";
            message.classList.add("show");
          }

          await window.PATRIOT_AUTH.syncTeacherSettings?.();

          if (message) {
            message.textContent = "Settings saved and synced across devices!";
            message.classList.add("show");
          }
        } catch (error) {
          console.warn("Teacher settings cloud save did not complete.", error);
          if (message) {
            message.textContent = "Saved on this device, but cloud sync needs another try.";
            message.classList.add("show");
          }
        }
      };
      enhancedSave.__patriotCloudWrapped = true;
      window.saveTeacherSettings = enhancedSave;
    }
  }

  function requestCloudRefresh() {
    if (window.PATRIOT_AUTH?.signedIn) {
      window.PATRIOT_AUTH.syncTeacherSettings?.();
    }
  }

  function start() {
    addStyles();
    addLunchFields();
    enhanceFormFunctions();
    fillLunch(readProfile());

    window.addEventListener("patriot-teacher-settings-synced", event => {
      const settings = event.detail?.settings || readProfile();
      if (typeof window.fillForm === "function" && settings) {
        window.fillForm(settings);
      } else {
        fillLunch(settings);
      }
    });

    window.addEventListener("patriot-auth-changed", event => {
      if (event.detail?.signedIn) {
        window.setTimeout(requestCloudRefresh, 150);
      }
    });

    window.setTimeout(requestCloudRefresh, 350);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
