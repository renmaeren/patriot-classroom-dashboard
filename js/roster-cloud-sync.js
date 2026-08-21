/*
==========================================
PATRIOT COMMAND
Student Roster Cloud Sync
Version 1
==========================================

Keeps roster data local for fast classroom tools,
while syncing the complete roster set to the
verified teacher account through Apps Script.
*/
(function () {
  "use strict";

  if (!document.body?.classList.contains("patriot-page-students")) {
    return;
  }

  const ROSTER_STORAGE_KEY = "patriotStudentRosters";
  const ROSTER_SYNC_MARKER = "patriotStudentRostersCloudSyncedAt";
  const ALLOWED_PERIODS = [
    "1st Period",
    "2nd Period",
    "3rd Period",
    "4th Period",
    "Advisory",
    "5th Period",
    "6th Period",
    "7th Period",
    "8th Period"
  ];

  let syncPending = false;

  function cleanText(value) {
    return String(value || "").trim();
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (error) {
      console.warn(`Patriot Command could not read ${key}.`, error);
      return fallback;
    }
  }

  function readRosters() {
    const rosters = readJson(ROSTER_STORAGE_KEY, {});
    return !Array.isArray(rosters) ? rosters : {};
  }

  function hasRosterData(rosters) {
    return Object.values(rosters || {}).some(roster =>
      Array.isArray(roster) && roster.length > 0
    );
  }

  function writeRosters(rosters, updatedAt) {
    const safe = rosters && typeof rosters === "object" && !Array.isArray(rosters)
      ? rosters
      : {};

    localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(safe));
    if (updatedAt) {
      localStorage.setItem(ROSTER_SYNC_MARKER, cleanText(updatedAt));
    }

    window.dispatchEvent(new CustomEvent("patriot-rosters-synced", {
      detail: { rosters: safe, updatedAt: cleanText(updatedAt) }
    }));
  }

  function getAuth() {
    return window.PATRIOT_AUTH || null;
  }

  function getBackendUrl() {
    return cleanText(window.GOOGLE_SCRIPT_URL);
  }

  async function postRosterAction(action, rosters) {
    const auth = getAuth();
    const user = auth?.getUser?.() || auth?.user;
    const token = auth?.getIdToken?.() || auth?.idToken || "";
    const scriptUrl = getBackendUrl();

    if (!auth?.signedIn || !user?.email || !token || !scriptUrl) {
      throw new Error("Sign in with your school Google account to sync rosters.");
    }

    const body = new URLSearchParams();
    body.set("action", action);
    body.set("teacherEmail", cleanText(user.email).toLowerCase());
    body.set("idToken", token);

    if (rosters) {
      body.set("rosters", JSON.stringify(rosters));
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: body.toString()
    });

    const result = await response.json();
    if (!response.ok || !result || result.success !== true) {
      throw new Error(result?.message || "Student rosters could not be synchronized.");
    }

    return result;
  }

  function renderSyncMessage(message, isError) {
    const saveMessage = document.getElementById("save-message");
    if (!saveMessage) return;

    saveMessage.textContent = message;
    saveMessage.style.background = isError ? "#a5151c" : "#2f7d4a";
    saveMessage.classList.add("show");

    window.setTimeout(() => {
      saveMessage.classList.remove("show");
    }, isError ? 4200 : 2600);
  }

  function rebuildClassSelector() {
    const selector = document.getElementById("class-selector");
    const warning = document.getElementById("settings-warning");
    if (!selector) return;

    const previous = selector.value;
    const profile = readJson("patriotTeacherProfile", null);
    const classes = profile?.classes || {};

    selector.innerHTML = '<option value="">Select a class</option>';

    let count = 0;
    ALLOWED_PERIODS.forEach(periodName => {
      const courseName = cleanText(classes[periodName]);
      if (!courseName) return;

      const option = document.createElement("option");
      option.value = periodName;
      option.textContent = `${periodName} — ${courseName}`;
      selector.appendChild(option);
      count += 1;
    });

    selector.disabled = count === 0;
    warning?.classList.toggle("show", count === 0);

    if (previous && ALLOWED_PERIODS.includes(previous)) {
      selector.value = previous;
    }
  }

  async function synchronizeRosters() {
    if (syncPending) return;

    const auth = getAuth();
    if (!auth?.signedIn) return;

    syncPending = true;

    try {
      const localRosters = readRosters();
      const cloudResult = await postRosterAction("getStudentRosters");
      const cloudRosters = cloudResult?.rosters || {};

      if (hasRosterData(cloudRosters)) {
        writeRosters(cloudRosters, cloudResult.updatedAt);
        renderSyncMessage("Rosters synced from your Patriot Command account.", false);
        return;
      }

      if (hasRosterData(localRosters)) {
        const saveResult = await postRosterAction("saveStudentRosters", localRosters);
        writeRosters(saveResult?.rosters || localRosters, saveResult?.updatedAt);
        renderSyncMessage("Existing rosters were backed up to your Patriot Command account.", false);
        return;
      }

      writeRosters({}, cloudResult?.updatedAt || "");
    } catch (error) {
      console.warn("Patriot Command roster cloud sync is unavailable.", error);
      renderSyncMessage(
        "Rosters are available on this device, but cloud sync needs you to sign in or try again.",
        true
      );
    } finally {
      syncPending = false;
    }
  }

  async function saveCurrentRostersToCloud() {
    const auth = getAuth();
    if (!auth?.signedIn) {
      renderSyncMessage("Roster saved on this device. Sign in with Google to sync it across devices.", true);
      auth?.requireSignIn?.();
      return;
    }

    try {
      const localRosters = readRosters();
      const result = await postRosterAction("saveStudentRosters", localRosters);
      writeRosters(result?.rosters || localRosters, result?.updatedAt);
      renderSyncMessage("Roster saved and synced across devices!", false);
    } catch (error) {
      console.warn("Roster cloud save did not complete.", error);
      renderSyncMessage("Roster saved on this device, but cloud sync needs another try.", true);
    }
  }

  function attachSaveSync() {
    const button = document.getElementById("save-roster-button");
    if (!button || button.dataset.cloudSyncAttached === "true") return;

    button.dataset.cloudSyncAttached = "true";
    button.addEventListener("click", () => {
      /* The page's original click handler saves localStorage first. */
      window.setTimeout(saveCurrentRostersToCloud, 0);
    });
  }

  function refreshVisibleRosterAfterSync() {
    rebuildClassSelector();

    /* If a class is already selected, re-run the page's loader so
       the newly downloaded roster appears immediately. */
    const selector = document.getElementById("class-selector");
    if (selector?.value && typeof window.loadSelectedRoster === "function") {
      window.loadSelectedRoster();
    }
  }

  function requestSyncWhenReady(attempt) {
    const tries = Number(attempt || 0);
    if (getAuth()?.signedIn) {
      synchronizeRosters();
      return;
    }

    if (tries < 30) {
      window.setTimeout(() => requestSyncWhenReady(tries + 1), 250);
    }
  }

  function start() {
    rebuildClassSelector();
    attachSaveSync();
    requestSyncWhenReady(0);

    window.addEventListener("patriot-auth-changed", event => {
      if (event.detail?.signedIn) {
        window.setTimeout(synchronizeRosters, 100);
      }
    });

    window.addEventListener("patriot-rosters-synced", refreshVisibleRosterAfterSync);
    window.addEventListener("patriot-teacher-settings-synced", rebuildClassSelector);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();