/*
==========================================
PATRIOT COMMAND
Google Authentication
Version 5
==========================================
*/
(function () {
  "use strict";

  const AUTH_TOKEN_KEY = "patriotGoogleIdToken";
  const AUTH_USER_KEY = "patriotGoogleUser";
  const TEACHER_PROFILE_KEY = "patriotTeacherProfile";
  const LEGACY_TEACHER_SETTINGS_KEY = "patriotTeacherSettings";
  const CLOUD_SYNC_MARKER = "__cloudSyncedAt";
  const ALLOWED_DOMAIN = "allen.kyschools.us";
  let initialized = false;
  let settingsSyncPending = false;

  function cleanText(value) {
    return String(value || "").trim();
  }

  function escapeHtml(value) {
    return cleanText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function decodeJwtPayload(token) {
    try {
      const parts = String(token || "").split(".");
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      const decoded = window.atob(padded);
      const json = decodeURIComponent(
        Array.from(decoded)
          .map(character => "%" + character.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
      return JSON.parse(json);
    } catch (error) {
      console.error("Patriot Google Auth could not decode the ID token.", error);
      return null;
    }
  }

  function isTokenExpired(token) {
    const payload = decodeJwtPayload(token);
    return !payload || !payload.exp || Date.now() >= Number(payload.exp) * 1000;
  }

  function getSavedUser() {
    try {
      return JSON.parse(sessionStorage.getItem(AUTH_USER_KEY) || "null");
    } catch (error) {
      console.error("Patriot Google Auth could not read the saved user.", error);
      return null;
    }
  }

  function getIdToken() {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) || "";
  }

  function isDashboard() {
    return document.body?.classList.contains("patriot-page-dashboard");
  }

  function isSchoolAccount(user) {
    return Boolean(user?.email && user.email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`));
  }

  function readLocalTeacherSettings() {
    try {
      const value = JSON.parse(localStorage.getItem(TEACHER_PROFILE_KEY) || "null");
      return value && typeof value === "object" ? value : null;
    } catch (error) {
      console.warn("Patriot Command could not read local teacher settings.", error);
      return null;
    }
  }

  function writeLocalTeacherSettings(settings, syncedAt) {
    if (!settings || typeof settings !== "object") return;

    const normalized = {
      teacherName: cleanText(settings.teacherName),
      teacherEmail: cleanText(settings.teacherEmail).toLowerCase(),
      room: cleanText(settings.room),
      classes:
        settings.classes && typeof settings.classes === "object"
          ? { ...settings.classes }
          : {},
      [CLOUD_SYNC_MARKER]: cleanText(syncedAt || settings.updatedAt || new Date().toISOString())
    };

    localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(normalized));
    localStorage.setItem(
      LEGACY_TEACHER_SETTINGS_KEY,
      JSON.stringify({
        teacher: normalized.teacherName,
        course: normalized.classes["1st Period"] || "Your Class",
        room: normalized.room
      })
    );

    window.dispatchEvent(new CustomEvent("patriot-teacher-settings-synced", {
      detail: { settings: normalized }
    }));
  }

  function getBackendUrl() {
    return cleanText(window.GOOGLE_SCRIPT_URL);
  }

  async function postTeacherSettingsAction(action, user, token, settings) {
    const scriptUrl = getBackendUrl();
    if (!scriptUrl || !user?.email || !token) return null;

    const requestBody = new URLSearchParams();
    requestBody.set("action", action);
    requestBody.set("teacherEmail", cleanText(user.email).toLowerCase());
    requestBody.set("idToken", token);

    if (settings) {
      requestBody.set("teacherName", cleanText(settings.teacherName || user.name));
      requestBody.set("room", cleanText(settings.room));
      requestBody.set("classes", JSON.stringify(settings.classes || {}));
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: requestBody.toString()
    });

    const result = await response.json();
    if (!response.ok || !result || result.success !== true) {
      throw new Error(result?.message || "Teacher settings could not be synchronized.");
    }
    return result;
  }

  async function syncTeacherSettingsAcrossDevices(user, token) {
    if (settingsSyncPending || !user?.email || !token || !getBackendUrl()) return;
    settingsSyncPending = true;

    try {
      const cloudResult = await postTeacherSettingsAction(
        "getTeacherSettings",
        user,
        token
      );

      const cloudSettings = cloudResult?.settings || null;
      const localSettings = readLocalTeacherSettings();
      const localEmail = cleanText(localSettings?.teacherEmail).toLowerCase();
      const sameTeacher = !localEmail || localEmail === cleanText(user.email).toLowerCase();
      const localLooksEdited = Boolean(localSettings && sameTeacher && !localSettings[CLOUD_SYNC_MARKER]);

      if (localLooksEdited || (!cloudSettings && localSettings && sameTeacher)) {
        const saveResult = await postTeacherSettingsAction(
          "saveTeacherSettings",
          user,
          token,
          {
            ...localSettings,
            teacherName: cleanText(localSettings.teacherName || user.name),
            teacherEmail: cleanText(user.email).toLowerCase()
          }
        );

        if (saveResult?.settings) {
          writeLocalTeacherSettings(saveResult.settings, saveResult.settings.updatedAt);
        }
        return;
      }

      if (cloudSettings) {
        writeLocalTeacherSettings(cloudSettings, cloudSettings.updatedAt);
      }
    } catch (error) {
      console.warn("Patriot Command teacher settings cloud sync is unavailable.", error);
    } finally {
      settingsSyncPending = false;
    }
  }

  function saveSignedInUser(token, payload) {
    const user = {
      id: cleanText(payload.sub),
      name: cleanText(payload.name),
      firstName: cleanText(payload.given_name),
      lastName: cleanText(payload.family_name),
      email: cleanText(payload.email).toLowerCase(),
      picture: cleanText(payload.picture),
      domain: cleanText(payload.hd).toLowerCase(),
      expiresAt: Number(payload.exp || 0)
    };

    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    window.PATRIOT_USER = user;
    window.PATRIOT_AUTH.signedIn = true;
    window.PATRIOT_AUTH.user = user;
    window.PATRIOT_AUTH.idToken = token;

    window.dispatchEvent(new CustomEvent("patriot-auth-changed", {
      detail: { signedIn: true, user }
    }));

    syncTeacherSettingsAcrossDevices(user, token);
    renderAuthStatus();
  }

  function clearSignedInUser() {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    window.PATRIOT_USER = null;
    window.PATRIOT_AUTH.signedIn = false;
    window.PATRIOT_AUTH.user = null;
    window.PATRIOT_AUTH.idToken = "";

    window.dispatchEvent(new CustomEvent("patriot-auth-changed", {
      detail: { signedIn: false, user: null }
    }));
  }

  function handleCredentialResponse(response) {
    const token = cleanText(response?.credential);
    if (!token) {
      window.alert("Google did not return a valid sign-in credential.");
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload?.email) {
      window.alert("Patriot Command could not read your Google account.");
      return;
    }

    if (!isSchoolAccount({ email: cleanText(payload.email).toLowerCase() })) {
      clearSignedInUser();
      window.alert("Please sign in with your Allen County Schools Google account.");
      return;
    }

    saveSignedInUser(token, payload);
  }

  function createAuthHost() {
    let host = document.getElementById("patriot-google-auth");
    if (host) return host;

    host = document.createElement("aside");
    host.id = "patriot-google-auth";
    host.setAttribute("aria-live", "polite");
    host.setAttribute("aria-label", "Patriot Command Google account");
    document.body.appendChild(host);
    return host;
  }

  function styleAuthHost(host, prominent) {
    Object.assign(host.style, {
      position: "fixed",
      zIndex: "99999",
      fontFamily: "Inter,Segoe UI,Arial,sans-serif",
      background: "rgba(255,255,255,.98)",
      border: "1px solid rgba(42,67,163,.18)",
      transition: "all 180ms ease"
    });

    if (prominent) {
      Object.assign(host.style, {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        width: "min(440px, calc(100% - 32px))",
        maxWidth: "440px",
        padding: "28px 26px 24px",
        transform: "translate(-50%, -50%)",
        borderRadius: "20px",
        boxShadow: "0 0 0 100vmax rgba(24,31,52,.42), 0 22px 60px rgba(24,31,52,.28)",
        textAlign: "center"
      });
      return;
    }

    Object.assign(host.style, {
      top: "auto",
      left: "auto",
      right: "14px",
      bottom: "14px",
      width: "auto",
      maxWidth: "340px",
      padding: "12px",
      transform: "none",
      borderRadius: "14px",
      boxShadow: "0 12px 30px rgba(42,67,163,.18)",
      textAlign: "left"
    });
  }

  function renderSignedInUser(host, user) {
    styleAuthHost(host, false);
    host.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        ${user.picture
          ? `<img src="${escapeHtml(user.picture)}" alt="" referrerpolicy="no-referrer" style="width:38px;height:38px;object-fit:cover;border-radius:50%;">`
          : `<div aria-hidden="true" style="display:grid;place-items:center;width:38px;height:38px;color:#fff;background:#2a43a3;border-radius:50%;">✓</div>`}
        <div style="min-width:0;flex:1;">
          <strong style="display:block;color:#20283a;font-size:.78rem;">${escapeHtml(user.name || "School Account")}</strong>
          <span style="display:block;overflow:hidden;color:#657087;font-size:.65rem;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(user.email)}</span>
        </div>
        <button id="patriot-google-signout" type="button" style="padding:7px 9px;color:#2a43a3;font-size:.64rem;font-weight:700;background:#fff;border:1px solid rgba(42,67,163,.2);border-radius:8px;cursor:pointer;">Sign out</button>
      </div>
    `;
    host.querySelector("#patriot-google-signout")?.addEventListener("click", signOut);
  }

  function renderSignInButton(host) {
    const prominent = isDashboard();
    styleAuthHost(host, prominent);

    host.innerHTML = prominent
      ? `
        <div aria-hidden="true" style="display:grid;place-items:center;width:56px;height:56px;margin:0 auto 14px;color:#fff;font-size:1.35rem;font-weight:900;background:#2a43a3;border:4px solid #ffe269;border-radius:50%;">P</div>
        <div style="margin-bottom:7px;color:#20283a;font-family:Literata,Georgia,serif;font-size:1.3rem;font-weight:750;line-height:1.2;">Connect your school Google account</div>
        <p style="margin:0 auto 18px;max-width:360px;color:#657087;font-size:.78rem;line-height:1.5;">Sign in before you begin so Patriot Command can connect saved lessons and teacher settings to your Allen County Schools account across devices.</p>
        <div id="patriot-google-button" style="display:flex;justify-content:center;"></div>
        <p style="margin:14px 0 0;color:#657087;font-size:.65rem;line-height:1.4;">Use your <strong>@allen.kyschools.us</strong> account.</p>
      `
      : `
        <div style="margin-bottom:8px;color:#20283a;font-size:.72rem;font-weight:750;line-height:1.35;">Sign in to Patriot Command</div>
        <div id="patriot-google-button"></div>
      `;

    if (!window.google?.accounts?.id) {
      host.insertAdjacentHTML("beforeend", `<p style="margin:8px 0 0;color:#657087;font-size:.63rem;">Google Sign-In is still loading.</p>`);
      return;
    }

    window.google.accounts.id.renderButton(
      document.getElementById("patriot-google-button"),
      {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: prominent ? 320 : 280
      }
    );
  }

  function renderAuthStatus() {
    const host = createAuthHost();
    const user = window.PATRIOT_AUTH.user;
    if (window.PATRIOT_AUTH.signedIn && user) {
      renderSignedInUser(host, user);
    } else {
      renderSignInButton(host);
    }
  }

  function initializeGoogleAuth() {
    if (initialized) return;
    if (!window.google?.accounts?.id) {
      window.setTimeout(initializeGoogleAuth, 250);
      return;
    }

    const clientId = cleanText(window.PATRIOT_GOOGLE_CONFIG?.CLIENT_ID);
    if (!clientId) {
      console.error("Patriot Google Auth is missing the Google Client ID.");
      return;
    }

    initialized = true;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: false,
      hd: ALLOWED_DOMAIN
    });
    renderAuthStatus();

    if (window.PATRIOT_AUTH.signedIn && window.PATRIOT_AUTH.user && !isTokenExpired(getIdToken())) {
      syncTeacherSettingsAcrossDevices(window.PATRIOT_AUTH.user, getIdToken());
    }
  }

  function signOut() {
    if (window.PATRIOT_AUTH.user?.email && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    clearSignedInUser();
    renderAuthStatus();
  }

  function requireSignIn() {
    if (window.PATRIOT_AUTH.signedIn) return true;
    renderAuthStatus();
    return false;
  }

  let savedToken = getIdToken();
  let savedUser = getSavedUser();

  if (savedToken && isTokenExpired(savedToken)) {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    savedUser = null;
    savedToken = "";
  }

  window.PATRIOT_AUTH = {
    signedIn: Boolean(savedUser) && !isTokenExpired(savedToken),
    user: savedUser,
    idToken: savedUser ? savedToken : "",
    getUser: () => window.PATRIOT_AUTH.user,
    getIdToken,
    requireSignIn,
    signOut,
    syncTeacherSettings: () => syncTeacherSettingsAcrossDevices(window.PATRIOT_AUTH.user, getIdToken()),
    initialize: initializeGoogleAuth
  };

  window.PATRIOT_USER = savedUser;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGoogleAuth);
  } else {
    initializeGoogleAuth();
  }

  console.log("Patriot Google Auth v5 loaded.");
})();
