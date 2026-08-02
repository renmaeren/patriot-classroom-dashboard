/*
==========================================
PATRIOT COMMAND
Dashboard Staff Bulletin
Version 1
==========================================
*/

(function () {
  "use strict";

  let refreshTimer =
    null;

  function cleanText(value) {
    return String(
      value ||
      ""
    ).trim();
  }

  function escapeHtml(value) {
    return String(
      value ||
      ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );
  }

  function getScriptUrl() {
    return cleanText(
      window.GOOGLE_SCRIPT_URL
    );
  }

  function getSignedInUser() {
    return (
      window.PATRIOT_AUTH
        ?.getUser?.() ||
      window.PATRIOT_USER ||
      null
    );
  }

  function getIdToken() {
    return cleanText(
      window.PATRIOT_AUTH
        ?.getIdToken?.()
    );
  }

  function createCallbackName() {
    return (
      "__patriotStaffBulletin_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(16)
        .slice(2)
    );
  }

  function getBulletinHost() {
    return document.getElementById(
      "staff-bulletin"
    );
  }

  function showBulletinStatus(
    message
  ) {
    const host =
      getBulletinHost();

    if (!host) {
      return;
    }

    host.innerHTML = `
      <div class="staff-bulletin-status">
        ${escapeHtml(message)}
      </div>
    `;
  }

  function hideBulletin() {
    const section =
      document.getElementById(
        "staff-bulletin-section"
      );

    if (section) {
      section.hidden =
        true;
    }
  }

  function showBulletinSection() {
    const section =
      document.getElementById(
        "staff-bulletin-section"
      );

    if (section) {
      section.hidden =
        false;
    }
  }

  function formatUpdatedDate(value) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleString(
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
  }

  function renderBulletin(
    bulletin
  ) {
    const host =
      getBulletinHost();

    if (!host) {
      return;
    }

    if (
      !bulletin ||
      !cleanText(
        bulletin.message
      )
    ) {
      hideBulletin();

      return;
    }

    const title =
      cleanText(
        bulletin.title
      ) ||
      "Staff Bulletin";

    const message =
      cleanText(
        bulletin.message
      );

    const updated =
      formatUpdatedDate(
        bulletin.updatedAt ||
        bulletin.createdAt
      );

    host.innerHTML = `
      <div class="staff-bulletin-heading">
        <span
          class="staff-bulletin-icon"
          aria-hidden="true"
        >
          📰
        </span>

        <div>
          <p class="staff-bulletin-label">
            Staff Bulletin
          </p>

          <h2 class="staff-bulletin-title">
            ${escapeHtml(title)}
          </h2>
        </div>
      </div>

      <div class="staff-bulletin-message">
        ${escapeHtml(message)}
      </div>

      ${
        updated
          ? `
            <p class="staff-bulletin-updated">
              Updated ${escapeHtml(updated)}
            </p>
          `
          : ""
      }
    `;

    showBulletinSection();
  }

  function requestBulletin() {
    const scriptUrl =
      getScriptUrl();

    const user =
      getSignedInUser();

    const idToken =
      getIdToken();

    if (!scriptUrl) {
      showBulletinStatus(
        "The bulletin connection is not configured."
      );

      return;
    }

    if (
      !user?.email ||
      !idToken
    ) {
      showBulletinStatus(
        "Sign in with your school Google account to view the staff bulletin."
      );

      showBulletinSection();

      return;
    }

    const callbackName =
      createCallbackName();

    const script =
      document.createElement(
        "script"
      );

    const timeout =
      window.setTimeout(
        function () {
          cleanup();

          showBulletinStatus(
            "The staff bulletin could not be loaded."
          );
        },
        15000
      );

    function cleanup() {
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
          "The staff bulletin request failed."
        );

        showBulletinStatus(
          response?.message ||
          "The staff bulletin could not be loaded."
        );

        return;
      }

      const bulletin =
        response.bulletin ||
        response.content ||
        null;

      renderBulletin(
        bulletin
      );
    };

    const url =
      new URL(
        scriptUrl
      );

    url.searchParams.set(
      "action",
      "getActiveStaffBulletin"
    );

    url.searchParams.set(
      "teacherEmail",
      cleanText(
        user.email
      ).toLowerCase()
    );

    url.searchParams.set(
      "idToken",
      idToken
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

        showBulletinStatus(
          "Patriot Command could not reach the staff bulletin backend."
        );
      };

    document.head.appendChild(
      script
    );
  }

  function startBulletinRefresh() {
    if (refreshTimer) {
      return;
    }

    refreshTimer =
      window.setInterval(
        requestBulletin,
        60000
      );
  }

  function startStaffBulletin() {
    requestBulletin();
    startBulletinRefresh();

    window.addEventListener(
      "patriot-auth-changed",
      requestBulletin
    );
  }

  window.PatriotDashboardBulletin = {
    refresh:
      requestBulletin
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startStaffBulletin
    );
  } else {
    startStaffBulletin();
  }

  console.log(
    "Patriot Dashboard Bulletin v1 loaded."
  );
})();
