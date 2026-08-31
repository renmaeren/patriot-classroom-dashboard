/*
==========================================
PATRIOT COMMAND
Admin Access Stability + Compatibility
Version 2
==========================================

Purpose:
- Supports both Patriot Google auth shapes.
- Verifies Admin access against the Apps Script Permissions backend.
- Remembers a verified result for the current browser session.
- Prevents the Admin navigation link from blinking away during
  temporary auth/backend timing failures.
- Never grants backend Admin rights; Apps Script remains authoritative.
*/
(function () {
  "use strict";

  const CACHE_KEY = "patriotAdminPermissionCacheV2";
  const VERIFY_RETRY_MS = 1200;
  const STARTUP_RETRY_WINDOW_MS = 18000;

  let compatibilityEventSent = false;
  let verificationPending = false;
  let lastVerificationAttempt = 0;

  function cleanText(value) {
    return String(value || "").trim();
  }

  function normalizeEmail(value) {
    return cleanText(value).toLowerCase();
  }

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
        return cleanText(auth.idToken);
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

    const credentials = getCredentials();
    const signedIn = Boolean(
      credentials.email &&
      credentials.idToken
    );

    if (
      signedIn &&
      changed &&
      !compatibilityEventSent
    ) {
      compatibilityEventSent = true;
      window.setTimeout(function () {
        window.dispatchEvent(
          new CustomEvent("patriot-auth-changed", {
            detail: {
              signedIn: true,
              user: credentials.user
            }
          })
        );
      }, 0);
    }

    return signedIn;
  }

  function getCredentials() {
    const auth = window.PATRIOT_AUTH || {};

    const user =
      (typeof auth.getUser === "function"
        ? auth.getUser()
        : auth.user) ||
      window.PATRIOT_USER ||
      null;

    const idToken = cleanText(
      typeof auth.getIdToken === "function"
        ? auth.getIdToken()
        : auth.idToken
    );

    return {
      user: user,
      email: normalizeEmail(user?.email),
      idToken: idToken
    };
  }

  function readCache() {
    try {
      const cached = JSON.parse(
        sessionStorage.getItem(CACHE_KEY) || "null"
      );

      if (!cached || typeof cached !== "object") {
        return null;
      }

      return {
        email: normalizeEmail(cached.email),
        isAdmin: cached.isAdmin === true,
        permissions: Array.isArray(cached.permissions)
          ? cached.permissions
          : [],
        verifiedAt: cleanText(cached.verifiedAt)
      };
    } catch (_) {
      return null;
    }
  }

  function writeCache(email, result) {
    const cache = {
      email: normalizeEmail(email),
      isAdmin: result?.isAdmin === true,
      permissions: Array.isArray(result?.permissions)
        ? result.permissions
        : [],
      verifiedAt: new Date().toISOString()
    };

    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify(cache)
    );

    applyCachedAdminState();
  }

  function clearCache() {
    sessionStorage.removeItem(CACHE_KEY);
    removeInjectedAdminLink();
  }

  function cacheMatchesCurrentUser(cache) {
    if (!cache) return false;

    const credentials = getCredentials();
    return Boolean(
      credentials.email &&
      cache.email === credentials.email
    );
  }

  function findAdminLink() {
    return document.querySelector(
      '.patriot-nav-links a[href="admin.html"]'
    );
  }

  function removeInjectedAdminLink() {
    document
      .querySelectorAll(
        '.patriot-nav-links a[data-patriot-stable-admin="true"]'
      )
      .forEach(function (link) {
        link.remove();
      });
  }

  function ensureAdminLink() {
    const links = document.querySelector(
      ".patriot-nav-links"
    );

    if (!links || findAdminLink()) {
      return;
    }

    const link = document.createElement("a");
    link.className = "patriot-nav-link";
    link.href = "admin.html";
    link.textContent = "Admin";
    link.dataset.patriotStableAdmin = "true";

    const currentPage =
      (window.location.pathname.split("/").pop() || "index.html")
        .toLowerCase();

    if (currentPage === "admin.html") {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    links.appendChild(link);
  }

  function applyCachedAdminState() {
    const cache = readCache();

    if (!cacheMatchesCurrentUser(cache)) {
      return;
    }

    if (cache.isAdmin) {
      ensureAdminLink();
      return;
    }

    const adminLink = findAdminLink();
    if (adminLink) {
      adminLink.remove();
    }
  }

  async function verifyPermissions(options) {
    const force = options?.force === true;

    if (verificationPending) return;

    const now = Date.now();
    if (
      !force &&
      now - lastVerificationAttempt < VERIFY_RETRY_MS
    ) {
      return;
    }

    normalizeAuth();

    const credentials = getCredentials();
    const scriptUrl = cleanText(window.GOOGLE_SCRIPT_URL);

    if (
      !scriptUrl ||
      !credentials.email ||
      !credentials.idToken
    ) {
      /*
        Credentials may simply not be ready yet. Do NOT turn a
        previously verified administrator into a non-admin here.
      */
      applyCachedAdminState();
      return;
    }

    lastVerificationAttempt = now;
    verificationPending = true;

    try {
      const body = new URLSearchParams();
      body.set("action", "getUserPermissions");
      body.set("userEmail", credentials.email);
      body.set("idToken", credentials.idToken);

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString()
      });

      const result = await response.json();

      if (
        !response.ok ||
        !result ||
        result.success !== true
      ) {
        throw new Error(
          result?.message ||
          "User permissions could not be loaded."
        );
      }

      writeCache(credentials.email, result);
    } catch (error) {
      /*
        A network timeout/temporary Apps Script failure is not proof
        that a previously verified administrator lost permission.
        Keep the last verified session state and retry later.
      */
      console.warn(
        "Patriot Command Admin verification will retry.",
        error
      );
      applyCachedAdminState();
    } finally {
      verificationPending = false;
    }
  }

  function handleAuthChanged(event) {
    const signedIn = event?.detail?.signedIn === true;

    if (signedIn) {
      compatibilityEventSent = true;
      applyCachedAdminState();
      verifyPermissions({ force: true });
      return;
    }

    /* Only clear the verified state after a real sign-out. */
    window.setTimeout(function () {
      const credentials = getCredentials();
      if (!credentials.email || !credentials.idToken) {
        clearCache();
      }
    }, 100);
  }

  window.addEventListener(
    "patriot-auth-changed",
    handleAuthChanged
  );

  window.addEventListener("focus", function () {
    applyCachedAdminState();
    verifyPermissions();
  });

  document.addEventListener(
    "visibilitychange",
    function () {
      if (!document.hidden) {
        applyCachedAdminState();
        verifyPermissions();
      }
    }
  );

  /*
    Navigation.js rebuilds its links after permission requests.
    Re-apply the last VERIFIED Admin state if that redraw removes it.
  */
  const navigationObserver = new MutationObserver(function () {
    applyCachedAdminState();
  });

  function observeNavigation() {
    const navigation = document.querySelector(".patriot-nav");
    if (!navigation) return false;

    navigationObserver.observe(navigation, {
      childList: true,
      subtree: true
    });
    return true;
  }

  normalizeAuth();
  applyCachedAdminState();
  verifyPermissions({ force: true });

  if (!observeNavigation()) {
    const pageObserver = new MutationObserver(function () {
      if (observeNavigation()) {
        pageObserver.disconnect();
        applyCachedAdminState();
      }
    });

    pageObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  const startupStartedAt = Date.now();
  const startupTimer = window.setInterval(function () {
    normalizeAuth();
    applyCachedAdminState();
    verifyPermissions();

    if (
      Date.now() - startupStartedAt >=
      STARTUP_RETRY_WINDOW_MS
    ) {
      window.clearInterval(startupTimer);
    }
  }, VERIFY_RETRY_MS);
})();
