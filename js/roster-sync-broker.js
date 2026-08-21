/*
==========================================
PATRIOT COMMAND
Roster Sync Broker
Version 1
==========================================

Runs on authenticated Patriot Command pages that load
google-config.js. Student Rosters themselves remain in
localStorage for fast classroom tools, while this broker
keeps the local copy synchronized with the teacher's
cloud roster record.
*/
(function () {
  "use strict";

  const ROSTER_KEY = "patriotStudentRosters";
  const SNAPSHOT_KEY = "patriotStudentRostersSyncedSnapshot";
  const UPDATED_KEY = "patriotStudentRostersCloudSyncedAt";
  let syncPending = false;

  function cleanText(value) {
    return String(value || "").trim();
  }

  function readRosters() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ROSTER_KEY) || "{}");
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};
    } catch (error) {
      console.warn("Patriot Command could not read local rosters.", error);
      return {};
    }
  }

  function stableRosterJson(rosters) {
    const source = rosters && typeof rosters === "object" ? rosters : {};
    const ordered = {};
    Object.keys(source).sort().forEach(key => {
      ordered[key] = Array.isArray(source[key]) ? source[key] : [];
    });
    return JSON.stringify(ordered);
  }

  function hasRosterData(rosters) {
    return Object.values(rosters || {}).some(value =>
      Array.isArray(value) && value.length > 0
    );
  }

  function writeLocal(rosters, updatedAt) {
    const safe = rosters && typeof rosters === "object" && !Array.isArray(rosters)
      ? rosters
      : {};
    const snapshot = stableRosterJson(safe);

    localStorage.setItem(ROSTER_KEY, JSON.stringify(safe));
    localStorage.setItem(SNAPSHOT_KEY, snapshot);
    if (updatedAt) {
      localStorage.setItem(UPDATED_KEY, cleanText(updatedAt));
    }

    window.dispatchEvent(new CustomEvent("patriot-rosters-synced", {
      detail: { rosters: safe, updatedAt: cleanText(updatedAt) }
    }));
  }

  function authReady() {
    return Boolean(
      window.PATRIOT_AUTH?.signedIn &&
      window.PATRIOT_AUTH?.getUser?.()?.email &&
      window.PATRIOT_AUTH?.getIdToken?.() &&
      window.GOOGLE_SCRIPT_URL
    );
  }

  async function post(action, rosters) {
    const auth = window.PATRIOT_AUTH;
    const user = auth?.getUser?.() || auth?.user;
    const token = auth?.getIdToken?.() || auth?.idToken || "";

    if (!auth?.signedIn || !user?.email || !token) {
      throw new Error("Google sign-in is required for roster sync.");
    }

    const body = new URLSearchParams();
    body.set("action", action);
    body.set("teacherEmail", cleanText(user.email).toLowerCase());
    body.set("idToken", token);
    if (rosters) {
      body.set("rosters", JSON.stringify(rosters));
    }

    const response = await fetch(window.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: body.toString()
    });

    const result = await response.json();
    if (!response.ok || !result || result.success !== true) {
      throw new Error(result?.message || "Roster sync failed.");
    }
    return result;
  }

  async function syncRosters() {
    if (syncPending || !authReady()) return;
    syncPending = true;

    try {
      const local = readRosters();
      const localSnapshot = stableRosterJson(local);
      const lastSyncedSnapshot = localStorage.getItem(SNAPSHOT_KEY) || "";
      const localWasEdited = Boolean(lastSyncedSnapshot && localSnapshot !== lastSyncedSnapshot);

      const cloudResult = await post("getStudentRosters");
      const cloud = cloudResult?.rosters || {};
      const cloudHasData = hasRosterData(cloud);
      const localHasData = hasRosterData(local);

      /* A local roster changed after the last successful sync: local wins. */
      if (localWasEdited) {
        const saved = await post("saveStudentRosters", local);
        writeLocal(saved?.rosters || local, saved?.updatedAt);
        return;
      }

      /* First migration from a teacher's existing browser. */
      if (!lastSyncedSnapshot && localHasData && !cloudHasData) {
        const saved = await post("saveStudentRosters", local);
        writeLocal(saved?.rosters || local, saved?.updatedAt);
        return;
      }

      /* A signed-in new device gets the cloud copy. */
      if (cloudHasData) {
        writeLocal(cloud, cloudResult?.updatedAt);
        return;
      }

      /* Neither side has roster data yet; record the clean baseline. */
      writeLocal(local, cloudResult?.updatedAt || "");
    } catch (error) {
      console.warn("Patriot Command roster sync is unavailable.", error);
    } finally {
      syncPending = false;
    }
  }

  function waitForAuth(attempt) {
    const tries = Number(attempt || 0);
    if (authReady()) {
      syncRosters();
      return;
    }
    if (tries < 40) {
      window.setTimeout(() => waitForAuth(tries + 1), 250);
    }
  }

  function start() {
    waitForAuth(0);

    window.addEventListener("patriot-auth-changed", event => {
      if (event.detail?.signedIn) {
        window.setTimeout(syncRosters, 150);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        syncRosters();
      }
    });

    window.addEventListener("focus", syncRosters);
    window.setInterval(syncRosters, 2 * 60 * 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();