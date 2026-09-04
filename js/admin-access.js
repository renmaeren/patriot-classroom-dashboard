/*
==========================================
PATRIOT COMMAND
Admin Access Control
Version 4
==========================================
*/
(function () {
  "use strict";

  const SESSION_KEY = "patriotVerifiedAdmin";
  const COMPAT_CACHE_KEY = "patriotAdminPermissionCacheV2";
  const AUTH_WAIT_MS = 10000;
  const REQUEST_TIMEOUT_MS = 8000;

  let verificationPending = false;

  function cleanText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getAuthSnapshot() {
    const auth = window.PATRIOT_AUTH || {};
    const user = auth.getUser?.() || auth.user || window.PATRIOT_USER || null;
    const idToken = String(auth.getIdToken?.() || auth.idToken || "").trim();
    return {
      signedIn: auth.signedIn === true || Boolean(user && idToken),
      email: cleanText(user?.email),
      idToken
    };
  }

  function getCachedAdminEmail() {
    try {
      return cleanText(sessionStorage.getItem(SESSION_KEY));
    } catch (_) {
      return "";
    }
  }

  function getCompatAdminEmail() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(COMPAT_CACHE_KEY) || "null");
      if (!cached || cached.isAdmin !== true) return "";
      return cleanText(cached.email);
    } catch (_) {
      return "";
    }
  }

  function getAnyVerifiedAdminEmail() {
    return getCachedAdminEmail() || getCompatAdminEmail();
  }

  function hasVerifiedAdminSession(email) {
    const normalized = cleanText(email);
    const verified = getAnyVerifiedAdminEmail();
    return Boolean(normalized && verified && normalized === verified);
  }

  function cacheAdmin(email) {
    try {
      sessionStorage.setItem(SESSION_KEY, cleanText(email));
    } catch (_) {}
  }

  function clearCachedAdmin() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(COMPAT_CACHE_KEY);
    } catch (_) {}
  }

  function createGate(title, message, email, allowRetry) {
    let gate = document.getElementById("patriot-admin-access-gate");
    if (!gate) {
      gate = document.createElement("div");
      gate.id = "patriot-admin-access-gate";
      document.body.appendChild(gate);
    }

    gate.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:100000",
      "display:grid",
      "place-items:center",
      "padding:24px",
      "background:#fffce9",
      "font-family:Inter,Segoe UI,Arial,sans-serif"
    ].join(";");

    gate.innerHTML = `<section style="width:min(560px,100%);padding:32px;text-align:center;background:#fff;border:1px solid rgba(42,67,163,.16);border-radius:18px;box-shadow:0 14px 36px rgba(42,67,163,.14);"><div style="font-size:2rem;margin-bottom:10px;">🔒</div><h1 style="margin:0;color:#2a43a3;font-family:Georgia,serif;">${title}</h1><p style="margin:14px 0 0;color:#5b6476;line-height:1.5;">${message}</p>${email ? `<p style="margin:10px 0 0;color:#20283a;font-size:.9rem;">Signed in as: <strong>${email}</strong></p>` : ""}<div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:20px;">${allowRetry ? `<button id="patriot-admin-retry" type="button" style="padding:10px 16px;color:#fff;background:#2a43a3;border:0;border-radius:9px;cursor:pointer;">Try Again</button>` : ""}<a href="index.html" style="display:inline-block;padding:10px 16px;color:#fff;text-decoration:none;background:#2a43a3;border-radius:9px;">Return to Dashboard</a></div></section>`;

    gate.querySelector("#patriot-admin-retry")?.addEventListener("click", () => {
      verifyAdminAccess(true);
    });
  }

  function showChecking(email) {
    createGate(
      "Checking Admin Access",
      "Patriot Command is verifying your school account and administrator permission.",
      email,
      false
    );
  }

  function showAccessDenied(email) {
    clearCachedAdmin();
    createGate(
      "Admin Access Required",
      "This area is limited to approved Patriot Command administrators.",
      email,
      false
    );
  }

  function showConnectionError(email, message) {
    createGate(
      "Admin Verification Problem",
      message || "Patriot Command could not verify administrator access. Your permission has not been removed. Please try again.",
      email,
      true
    );
  }

  function authorize(email) {
    const normalized = cleanText(email);
    if (!normalized) return false;

    document.getElementById("patriot-admin-access-gate")?.remove();
    document.documentElement.classList.add("patriot-admin-authorized");
    window.PATRIOT_ADMIN_EMAIL = normalized;
    cacheAdmin(normalized);

    window.dispatchEvent(new CustomEvent("patriot-admin-verified", {
      detail: { email: normalized, isAdmin: true }
    }));

    return true;
  }

  async function waitForAuth() {
    const started = Date.now();
    while (Date.now() - started < AUTH_WAIT_MS) {
      const snapshot = getAuthSnapshot();
      if (snapshot.email && snapshot.idToken) return snapshot;
      await new Promise(resolve => window.setTimeout(resolve, 200));
    }
    return getAuthSnapshot();
  }

  async function requestPermissions(snapshot) {
    const scriptUrl = String(window.GOOGLE_SCRIPT_URL || "").trim();
    if (!scriptUrl) {
      throw new Error("The Patriot Command permission service is unavailable.");
    }

    const body = new URLSearchParams();
    body.set("action", "getUserPermissions");
    body.set("userEmail", snapshot.email);
    body.set("idToken", snapshot.idToken);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString(),
        signal: controller.signal
      });

      const result = await response.json();
      if (!response.ok || !result || result.success !== true) {
        throw new Error(result?.message || "Administrator permission could not be verified.");
      }
      return result;
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("Administrator verification timed out. Please try again.");
      }
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function refreshVerifiedSessionInBackground(expectedEmail) {
    const snapshot = await waitForAuth();
    if (!snapshot.email || !snapshot.idToken) return;

    if (cleanText(expectedEmail) !== snapshot.email) {
      clearCachedAdmin();
      showAccessDenied(snapshot.email);
      return;
    }

    try {
      const result = await requestPermissions(snapshot);
      if (result.isAdmin !== true) {
        showAccessDenied(snapshot.email);
      } else {
        cacheAdmin(snapshot.email);
      }
    } catch (error) {
      console.warn("Verified Admin session refresh failed; keeping current verified session.", error);
    }
  }

  async function verifyAdminAccess(force) {
    if (verificationPending && !force) return false;

    const cachedEmail = getAnyVerifiedAdminEmail();

    /*
      If navigation already verified this administrator in this browser
      session, open the static Admin UI immediately. All protected Admin
      data calls still verify the Google ID token on Apps Script.
    */
    if (!force && cachedEmail) {
      authorize(cachedEmail);
      refreshVerifiedSessionInBackground(cachedEmail);
      return true;
    }

    verificationPending = true;
    let snapshot = getAuthSnapshot();
    showChecking(snapshot.email);

    try {
      if (!snapshot.email || !snapshot.idToken) {
        snapshot = await waitForAuth();
      }

      if (!snapshot.email || !snapshot.idToken) {
        showConnectionError(
          snapshot.email,
          "Your Google school sign-in has not finished loading. Return to the Dashboard, sign in with your school account, and then open Admin again."
        );
        return false;
      }

      if (!force && hasVerifiedAdminSession(snapshot.email)) {
        authorize(snapshot.email);
        refreshVerifiedSessionInBackground(snapshot.email);
        return true;
      }

      const result = await requestPermissions(snapshot);
      if (result.isAdmin === true) {
        return authorize(snapshot.email);
      }

      showAccessDenied(snapshot.email);
      return false;
    } catch (error) {
      console.error("Patriot Command Admin verification failed.", error);
      if (hasVerifiedAdminSession(snapshot.email)) {
        return authorize(snapshot.email);
      }
      showConnectionError(snapshot.email, error.message);
      return false;
    } finally {
      verificationPending = false;
    }
  }

  function getCurrentUserEmail() {
    return getAuthSnapshot().email || getAnyVerifiedAdminEmail();
  }

  function isApprovedAdmin(email) {
    return hasVerifiedAdminSession(email);
  }

  function enforceAdminAccess() {
    verifyAdminAccess(false);
    return true;
  }

  window.addEventListener("patriot-auth-changed", event => {
    if (event.detail?.signedIn) {
      const snapshot = getAuthSnapshot();
      const cachedEmail = getAnyVerifiedAdminEmail();
      if (cachedEmail && snapshot.email && cachedEmail !== snapshot.email) {
        clearCachedAdmin();
      }
      verifyAdminAccess(false);
    } else {
      clearCachedAdmin();
    }
  });

  window.PatriotAdminAccess = {
    getCurrentUserEmail,
    isApprovedAdmin,
    enforceAdminAccess,
    verifyAdminAccess
  };
})();
