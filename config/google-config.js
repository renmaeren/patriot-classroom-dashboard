window.PATRIOT_GOOGLE_CONFIG = {
  CLIENT_ID: "390057015202-jrl17ud8lp1rt6278ks1bp3v373049lc.apps.googleusercontent.com",
  API_KEY: "AIzaSyD0ZpeOMV8Z4wKoWrXS20GYO8sHGcmbhtM"
};
/*
==========================================
Google Apps Script
==========================================
*/

window.GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

/*
==========================================
Patriot Command page enhancements
==========================================
*/
(function () {
  "use strict";

  function loadScript(source, id) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = source;
    script.defer = true;
    document.head.appendChild(script);
  }

  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* Normalize older/newer Google auth shapes so Admin access stays available. */
  loadScript("js/admin-access-compat.js?v=1", "patriot-admin-access-compat");

  /* Keep long-running tabs from silently using an expired Google session. */
  loadScript("js/auth-watchdog.js?v=1", "patriot-auth-watchdog");

  /* Keep student rosters backed up to the signed-in teacher account. */
  loadScript("js/roster-sync-broker.js?v=3", "patriot-roster-sync-broker");

  if (page === "settings.html") {
    loadScript("js/google-auth.js?v=5", "patriot-settings-google-auth");
    loadScript("js/settings-enhancements.js?v=1", "patriot-settings-enhancements");
    loadScript("js/settings-countdown-toggle.js?v=1", "patriot-settings-countdown-toggle");
  }

  if (page === "planner.html" || page === "plan.html") {
    loadScript("js/planner-undo-redo.js?v=1", "patriot-planner-undo-redo");
  }

  if (page === "index.html" || page === "") {
    loadScript("js/lunch-dashboard.js?v=1", "patriot-lunch-dashboard");
    loadScript("js/dashboard-countdown-preference.js?v=1", "patriot-dashboard-countdown-preference");
    loadScript("js/dashboard-library-reservations.js?v=1", "patriot-dashboard-library-reservations");
    loadScript("js/dashboard-notes-reminders.js?v=1", "patriot-dashboard-notes-reminders");
  }

  if (page === "classroom.html") {
    loadScript("js/teach-reminders.js?v=1", "patriot-teach-reminders");
  }
})();
