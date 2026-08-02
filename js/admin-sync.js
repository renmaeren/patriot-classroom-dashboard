/*
==========================================
PATRIOT COMMAND
Admin Calendar Sync
Version 1
==========================================
*/

(function () {
  "use strict";

  let syncPending =
    false;

  function cleanText(value) {
    return String(
      value ||
      ""
    ).trim();
  }

  function getSyncButton() {
    return document.getElementById(
      "sync-acshs-calendar-button"
    );
  }

  function getSyncStatus() {
    return document.getElementById(
      "calendar-sync-status"
    );
  }

  function setSyncStatus(
    message,
    statusType
  ) {
    const status =
      getSyncStatus();

    if (!status) {
      return;
    }

    status.textContent =
      cleanText(
        message
      );

    status.classList.remove(
      "success",
      "error",
      "working"
    );

    if (statusType) {
      status.classList.add(
        statusType
      );
    }
  }

  function setButtonWorking(
    working
  ) {
    const button =
      getSyncButton();

    if (!button) {
      return;
    }

    button.disabled =
      working;

    button.textContent =
      working
        ? "Syncing Calendar..."
        : "Sync ACSHS Schedule";
  }

  function getAdminCredentials() {
    const user =
      window.PATRIOT_AUTH
        ?.getUser?.() ||
      window.PATRIOT_USER ||
      null;

    const idToken =
      cleanText(
        window.PATRIOT_AUTH
          ?.getIdToken?.()
      );

    return {
      adminEmail:
        cleanText(
          user?.email
        ).toLowerCase(),

      idToken:
        idToken
    };
  }

  async function syncAcshsCalendar() {
    if (syncPending) {
      return;
    }

    const scriptUrl =
      cleanText(
        window.GOOGLE_SCRIPT_URL
      );

    if (!scriptUrl) {
      setSyncStatus(
        "The Patriot Command backend URL is missing.",
        "error"
      );

      return;
    }

    const credentials =
      getAdminCredentials();

    if (
      !credentials.adminEmail ||
      !credentials.idToken
    ) {
      setSyncStatus(
        "Sign in with your approved school Google account before syncing.",
        "error"
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Sync the ACSHS Schedule of Events now?\n\n" +
        "This will replace previously imported ACSHS schedule rows while preserving District Calendar rows."
      );

    if (!confirmed) {
      return;
    }

    syncPending =
      true;

    setButtonWorking(
      true
    );

    setSyncStatus(
      "Reading the Google Doc and rebuilding the ACSHS calendar rows...",
      "working"
    );

    try {
      const requestBody =
        new URLSearchParams();

      requestBody.set(
        "action",
        "syncAcshsSchedule"
      );

      requestBody.set(
        "adminEmail",
        credentials.adminEmail
      );

      requestBody.set(
        "idToken",
        credentials.idToken
      );

      const response =
        await fetch(
          scriptUrl,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8"
            },

            body:
              requestBody.toString()
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result ||
        result.success !==
          true
      ) {
        throw new Error(
          result?.message ||
          "The calendar sync could not be completed."
        );
      }

      const importedCount =
        Number(
          result.imported ||
          0
        );

      const skippedCount =
        Array.isArray(
          result.skipped
        )
          ? result.skipped.length
          : 0;

      const completedAt =
        new Date()
          .toLocaleString(
            [],
            {
              month:
                "short",

              day:
                "numeric",

              hour:
                "numeric",

              minute:
                "2-digit"
            }
          );

      setSyncStatus(
        `${importedCount} events synced successfully at ${completedAt}. ` +
        `${skippedCount} entries were skipped.`,
        "success"
      );

      window.dispatchEvent(
        new CustomEvent(
          "patriot-calendar-synced",
          {
            detail: {
              imported:
                importedCount,

              skipped:
                result.skipped ||
                []
            }
          }
        )
      );
    } catch (error) {
      console.error(
        "Patriot Command calendar sync failed.",
        error
      );

      setSyncStatus(
        error.message ||
        "The calendar sync could not be completed.",
        "error"
      );
    } finally {
      syncPending =
        false;

      setButtonWorking(
        false
      );
    }
  }

  function startAdminSync() {
    const button =
      getSyncButton();

    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      syncAcshsCalendar
    );
  }

  window.PatriotAdminSync = {
    syncAcshsCalendar:
      syncAcshsCalendar
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startAdminSync
    );
  } else {
    startAdminSync();
  }

  console.log(
    "Patriot Admin Sync v1 loaded."
  );
})();
