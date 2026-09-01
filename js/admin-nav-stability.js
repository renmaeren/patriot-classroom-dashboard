/*
==========================================
PATRIOT COMMAND
Admin Navigation Stability
==========================================
*/
(function () {
  "use strict";

  const SESSION_KEY = "patriotVerifiedAdmin";
  let verificationPending = false;

  function clean(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getAuth() {
    const auth = window.PATRIOT_AUTH || {};
    const user = auth.getUser?.() || auth.user || window.PATRIOT_USER || null;
    return {
      email: clean(user?.email),
      idToken: String(auth.getIdToken?.() || auth.idToken || "").trim()
    };
  }

  function cachedAdminEmail() {
    try {
      return clean(sessionStorage.getItem(SESSION_KEY));
    } catch (error) {
      return "";
    }
  }

  function setCachedAdmin(email) {
    try {
      sessionStorage.setItem(SESSION_KEY, clean(email));
    } catch (error) {}
  }

  function clearCachedAdmin() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (error) {}
  }

  function ensureAdminLink() {
    const auth = getAuth();
    if (!auth.email || cachedAdminEmail() !== auth.email) return;

    const links = document.querySelector(".patriot-nav-links");
    if (!links || links.querySelector('a[href="admin.html"]')) return;

    const link = document.createElement("a");
    link.className = "patriot-nav-link";
    link.href = "admin.html";
    link.textContent = "Admin";

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page === "admin.html") {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    links.appendChild(link);
  }

  async function verifyAdmin() {
    if (verificationPending) return;

    const auth = getAuth();
    if (!auth.email || !auth.idToken || !window.GOOGLE_SCRIPT_URL) return;

    verificationPending = true;

    try {
      const body = new URLSearchParams();
      body.set("action", "getUserPermissions");
      body.set("userEmail", auth.email);
      body.set("idToken", auth.idToken);

      const response = await fetch(window.GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString()
      });

      const result = await response.json();
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.message || "Permission verification failed.");
      }

      if (result.isAdmin === true) {
        setCachedAdmin(auth.email);
        ensureAdminLink();
      } else {
        clearCachedAdmin();
      }
    } catch (error) {
      // A temporary connection problem must not remove a previously verified Admin link.
      console.warn("Admin navigation verification is temporarily unavailable.", error);
      ensureAdminLink();
    } finally {
      verificationPending = false;
    }
  }

  function start() {
    ensureAdminLink();
    verifyAdmin();

    const observer = new MutationObserver(() => {
      ensureAdminLink();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener("patriot-auth-changed", event => {
      if (event.detail?.signedIn) {
        window.setTimeout(verifyAdmin, 50);
      } else {
        clearCachedAdmin();
      }
    });

    window.addEventListener("patriot-admin-verified", event => {
      const email = clean(event.detail?.email);
      if (email) {
        setCachedAdmin(email);
        ensureAdminLink();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
