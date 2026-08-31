/*
==========================================
PATRIOT COMMAND
Admin Access Compatibility
==========================================
Keeps Admin permissions working whether Google auth exposes
getUser()/getIdToken() methods or user/idToken properties.
*/
(function () {
  "use strict";

  let compatibilityEventSent = false;

  function normalizeAuth() {
    const auth = window.PATRIOT_AUTH;
    if (!auth) return false;

    let changed = false;

    if (
      typeof auth.getUser !== "function" &&
      auth.user &&
      auth.user.email
    ) {
      auth.getUser = function () {
        return auth.user || null;
      };
      changed = true;
    }

    if (
      typeof auth.getIdToken !== "function" &&
      auth.idToken
    ) {
      auth.getIdToken = function () {
        return String(auth.idToken || "").trim();
      };
      changed = true;
    }

    if (
      !window.PATRIOT_USER &&
      auth.user &&
      auth.user.email
    ) {
      window.PATRIOT_USER = auth.user;
      changed = true;
    }

    const user =
      (typeof auth.getUser === "function"
        ? auth.getUser()
        : auth.user) ||
      window.PATRIOT_USER ||
      null;

    const token = String(
      typeof auth.getIdToken === "function"
        ? auth.getIdToken()
        : auth.idToken || ""
    ).trim();

    const signedIn = Boolean(
      (auth.signedIn === true || user?.email) &&
      user?.email &&
      token
    );

    if (
      signedIn &&
      changed &&
      !compatibilityEventSent
    ) {
      compatibilityEventSent = true;
      window.setTimeout(function () {
        window.dispatchEvent(
          new CustomEvent(
            "patriot-auth-changed",
            {
              detail: {
                signedIn: true,
                user: user
              }
            }
          )
        );
      }, 0);
    }

    return signedIn;
  }

  function retryNormalize() {
    normalizeAuth();
  }

  window.addEventListener(
    "patriot-auth-changed",
    function () {
      normalizeAuth();
    }
  );

  window.addEventListener(
    "focus",
    retryNormalize
  );

  document.addEventListener(
    "visibilitychange",
    function () {
      if (!document.hidden) {
        retryNormalize();
      }
    }
  );

  normalizeAuth();

  const retryTimer = window.setInterval(
    retryNormalize,
    500
  );

  window.setTimeout(function () {
    window.clearInterval(retryTimer);
    normalizeAuth();
  }, 12000);
})();
