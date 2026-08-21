/*
==========================================
PATRIOT COMMAND
Next-Class Countdown Preference
==========================================
*/
(function () {
  "use strict";

  if (!document.body?.classList.contains("patriot-page-settings")) return;

  const KEY = "__showNextClassCountdown";

  function addToggle() {
    if (document.getElementById("patriot-next-class-countdown-setting")) return;

    const lunch = document.getElementById("patriot-lunch-settings");
    const scheduleGrid = document.querySelector(".schedule-grid");
    if (!lunch && !scheduleGrid) return;

    const section = document.createElement("section");
    section.id = "patriot-next-class-countdown-setting";
    section.style.cssText = "margin-top:12px;padding:12px 13px;background:rgba(42,67,163,.055);border:1px solid rgba(42,67,163,.12);border-radius:11px;";
    section.innerHTML = `
      <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;">
        <input id="show-next-class-countdown" type="checkbox" style="width:18px;height:18px;margin-top:2px;accent-color:#2a43a3;" checked>
        <span>
          <strong style="display:block;color:#20283a;font-size:.74rem;">Show countdown to the next class</strong>
          <span style="display:block;margin-top:2px;color:#657087;font-size:.65rem;line-height:1.4;">Turn this off if you only want Patriot Command to show the next class and its start time without a live countdown.</span>
        </span>
      </label>
    `;

    (lunch || scheduleGrid).insertAdjacentElement("afterend", section);
  }

  function readValue(settings) {
    const stored = settings?.classes?.[KEY];
    return stored === undefined || stored === null || stored === "" ? true : String(stored) !== "false";
  }

  function fill(settings) {
    const checkbox = document.getElementById("show-next-class-countdown");
    if (checkbox) checkbox.checked = readValue(settings);
  }

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem("patriotTeacherProfile") || "null");
    } catch (error) {
      return null;
    }
  }

  function wrapForm() {
    const originalCollect = window.collectForm;
    if (typeof originalCollect === "function" && !originalCollect.__countdownWrapped) {
      const wrappedCollect = function () {
        const settings = originalCollect();
        settings.classes = settings.classes || {};
        settings.classes[KEY] = document.getElementById("show-next-class-countdown")?.checked === false ? "false" : "true";
        return settings;
      };
      wrappedCollect.__countdownWrapped = true;
      window.collectForm = wrappedCollect;
    }

    const originalFill = window.fillForm;
    if (typeof originalFill === "function" && !originalFill.__countdownWrapped) {
      const wrappedFill = function (settings) {
        originalFill(settings);
        fill(settings);
      };
      wrappedFill.__countdownWrapped = true;
      window.fillForm = wrappedFill;
    }
  }

  function start() {
    addToggle();
    wrapForm();
    fill(readProfile());

    window.addEventListener("patriot-teacher-settings-synced", event => {
      fill(event.detail?.settings || readProfile());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.setTimeout(start, 50));
  } else {
    window.setTimeout(start, 50);
  }
})();
