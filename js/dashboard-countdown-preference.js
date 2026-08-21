/*
==========================================
PATRIOT COMMAND
Dashboard Next-Class Countdown Preference
==========================================
*/
(function () {
  "use strict";

  if (!document.body?.classList.contains("patriot-page-dashboard")) return;

  const KEY = "__showNextClassCountdown";

  function shouldShowCountdown() {
    try {
      const profile = JSON.parse(localStorage.getItem("patriotTeacherProfile") || "null");
      const value = profile?.classes?.[KEY];
      return value === undefined || value === null || value === "" ? true : String(value) !== "false";
    } catch (error) {
      return true;
    }
  }

  function applyPreference() {
    if (shouldShowCountdown()) return;

    const label = document.getElementById("status-label");
    const message = document.getElementById("time-message");
    if (!label || !message || label.textContent.trim() !== "Next Class") return;

    const text = message.textContent || "";
    const separatorIndex = text.indexOf(" · in ");
    if (separatorIndex !== -1) {
      message.textContent = text.slice(0, separatorIndex);
    }
  }

  function start() {
    applyPreference();
    window.setInterval(applyPreference, 250);
    window.addEventListener("storage", event => {
      if (event.key === "patriotTeacherProfile") applyPreference();
    });
    window.addEventListener("patriot-teacher-settings-synced", applyPreference);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
