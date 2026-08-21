/*
==========================================
PATRIOT COMMAND
Authentication Watchdog
Version 1
==========================================

Keeps long-running Patriot Command tabs from silently
continuing after a Google ID token expires.
*/
(function () {
  "use strict";

  const CHECK_INTERVAL_MS = 60 * 1000;
  const AUTH_TOKEN_KEY = "patriotGoogleIdToken";
  const AUTH_USER_KEY = "patriotGoogleUser";
  let expiredPromptVisible = false;

  function decodeJwtPayload(token) {
    try {
      const parts = String(token || "").split(".");
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      return JSON.parse(window.atob(padded));
    } catch (error) {
      return null;
    }
  }

  function tokenExpired(token) {
    const payload = decodeJwtPayload(token);
    return !payload?.exp || Date.now() >= Number(payload.exp) * 1000;
  }

  function getToken() {
    return String(window.PATRIOT_AUTH?.getIdToken?.() || sessionStorage.getItem(AUTH_TOKEN_KEY) || "").trim();
  }

  function removePrompt() {
    document.getElementById("patriot-session-expired-overlay")?.remove();
    expiredPromptVisible = false;
  }

  function renderExpiredPrompt() {
    if (expiredPromptVisible || document.getElementById("patriot-session-expired-overlay")) return;
    expiredPromptVisible = true;

    const overlay = document.createElement("div");
    overlay.id = "patriot-session-expired-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Google sign-in required");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "100000",
      display: "grid",
      placeItems: "center",
      padding: "20px",
      background: "rgba(24,31,52,.56)",
      backdropFilter: "blur(4px)"
    });

    const card = document.createElement("div");
    Object.assign(card.style, {
      width: "min(460px, 100%)",
      padding: "28px 26px",
      color: "#20283a",
      textAlign: "center",
      fontFamily: "Inter,Segoe UI,Arial,sans-serif",
      background: "rgba(255,255,255,.99)",
      border: "1px solid rgba(42,67,163,.18)",
      borderRadius: "20px",
      boxShadow: "0 22px 60px rgba(24,31,52,.3)"
    });

    card.innerHTML = `
      <div aria-hidden="true" style="display:grid;place-items:center;width:58px;height:58px;margin:0 auto 14px;color:#fff;font-size:1.35rem;font-weight:900;background:#2a43a3;border:4px solid #ffe269;border-radius:50%;">P</div>
      <h2 style="margin:0 0 8px;font-family:Literata,Georgia,serif;font-size:1.35rem;">Sign back in to Patriot Command</h2>
      <p style="margin:0 0 18px;color:#657087;font-size:.8rem;line-height:1.5;">Your Google session expired while Patriot Command was open. Sign back in before creating or saving lessons so your work stays connected to your account.</p>
      <div id="patriot-session-signin-button" style="display:flex;justify-content:center;"></div>
      <p style="margin:14px 0 0;color:#657087;font-size:.66rem;">Use your <strong>@allen.kyschools.us</strong> account.</p>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function renderButtonWhenReady() {
      const host = document.getElementById("patriot-session-signin-button");
      if (!host) return;
      if (!window.google?.accounts?.id) {
        host.textContent = "Google Sign-In is loading…";
        window.setTimeout(renderButtonWhenReady, 300);
        return;
      }
      host.textContent = "";
      window.google.accounts.id.renderButton(host, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 320
      });
    }

    renderButtonWhenReady();
  }

  function expireSession() {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);

    if (window.PATRIOT_AUTH) {
      window.PATRIOT_AUTH.signedIn = false;
      window.PATRIOT_AUTH.user = null;
      window.PATRIOT_AUTH.idToken = "";
    }
    window.PATRIOT_USER = null;

    window.dispatchEvent(new CustomEvent("patriot-auth-changed", {
      detail: { signedIn: false, user: null, reason: "expired" }
    }));

    renderExpiredPrompt();
  }

  function checkSession() {
    const auth = window.PATRIOT_AUTH;
    const token = getToken();

    if (auth?.signedIn && token && tokenExpired(token)) {
      expireSession();
      return;
    }

    if (auth?.signedIn && token && !tokenExpired(token)) {
      removePrompt();
    }
  }

  function start() {
    window.setInterval(checkSession, CHECK_INTERVAL_MS);
    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) checkSession();
    });
    window.addEventListener("patriot-auth-changed", event => {
      if (event.detail?.signedIn) removePrompt();
    });
    window.setTimeout(checkSession, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
