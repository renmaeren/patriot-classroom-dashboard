/*
==========================================
PATRIOT COMMAND
Google Authentication
Version 2
==========================================
*/

(function () {
  "use strict";

  const AUTH_TOKEN_KEY =
    "patriotGoogleIdToken";

  const AUTH_USER_KEY =
    "patriotGoogleUser";

  const ALLOWED_DOMAIN =
    "allen.kyschools.us";

  let initialized =
    false;

  function cleanText(value) {
    return String(
      value ||
      ""
    ).trim();
  }

  function decodeJwtPayload(token) {
    try {
      const parts =
        String(token || "")
          .split(".");

      if (
        parts.length < 2
      ) {
        return null;
      }

      const base64Url =
        parts[1];

      const base64 =
        base64Url
          .replace(
            /-/g,
            "+"
          )
          .replace(
            /_/g,
            "/"
          );

      const padded =
        base64.padEnd(
          Math.ceil(
            base64.length / 4
          ) * 4,
          "="
        );

      const decoded =
        window.atob(
          padded
        );

      const json =
        decodeURIComponent(
          Array.from(
            decoded
          )
            .map(
              character => {
                return (
                  "%" +
                  character
                    .charCodeAt(0)
                    .toString(16)
                    .padStart(
                      2,
                      "0"
                    )
                );
              }
            )
            .join("")
        );

      return JSON.parse(
        json
      );
    } catch (error) {
      console.error(
        "Patriot Google Auth could not decode the ID token.",
        error
      );

      return null;
    }
  }

  function getSavedUser() {
    try {
      return JSON.parse(
        sessionStorage.getItem(
          AUTH_USER_KEY
        ) || "null"
      );
    } catch (error) {
      console.error(
        "Patriot Google Auth could not read the saved user.",
        error
      );

      return null;
    }
  }

  function getIdToken() {
    return (
      sessionStorage.getItem(
        AUTH_TOKEN_KEY
      ) ||
      ""
    );
  }

  function saveSignedInUser(
    token,
    payload
  ) {
    const user = {
      id:
        cleanText(
          payload.sub
        ),

      name:
        cleanText(
          payload.name
        ),

      firstName:
        cleanText(
          payload.given_name
        ),

      lastName:
        cleanText(
          payload.family_name
        ),

      email:
        cleanText(
          payload.email
        ).toLowerCase(),

      picture:
        cleanText(
          payload.picture
        ),

      domain:
        cleanText(
          payload.hd
        ).toLowerCase(),

      expiresAt:
        Number(
          payload.exp ||
          0
        )
    };

    sessionStorage.setItem(
      AUTH_TOKEN_KEY,
      token
    );

    sessionStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(
        user
      )
    );

    window.PATRIOT_USER =
      user;

    window.PATRIOT_AUTH.signedIn =
      true;

    window.PATRIOT_AUTH.user =
      user;

    window.PATRIOT_AUTH.idToken =
      token;

    window.dispatchEvent(
      new CustomEvent(
        "patriot-auth-changed",
        {
          detail: {
            signedIn:
              true,

            user:
              user
          }
        }
      )
    );

    renderAuthStatus();
  }

  function clearSignedInUser() {
    sessionStorage.removeItem(
      AUTH_TOKEN_KEY
    );

    sessionStorage.removeItem(
      AUTH_USER_KEY
    );

    window.PATRIOT_USER =
      null;

    window.PATRIOT_AUTH.signedIn =
      false;

    window.PATRIOT_AUTH.user =
      null;

    window.PATRIOT_AUTH.idToken =
      "";

    window.dispatchEvent(
      new CustomEvent(
        "patriot-auth-changed",
        {
          detail: {
            signedIn:
              false,

            user:
              null
          }
        }
      )
    );
  }

  function isSchoolAccount(user) {
    if (
      !user ||
      !user.email
    ) {
      return false;
    }

    return user.email.endsWith(
      `@${ALLOWED_DOMAIN}`
    );
  }

  function handleCredentialResponse(
    response
  ) {
    const token =
      cleanText(
        response?.credential
      );

    if (!token) {
      window.alert(
        "Google did not return a valid sign-in credential."
      );

      return;
    }

    const payload =
      decodeJwtPayload(
        token
      );

    if (
      !payload ||
      !payload.email
    ) {
      window.alert(
        "Patriot Command could not read your Google account."
      );

      return;
    }

    const user = {
      email:
        cleanText(
          payload.email
        ).toLowerCase()
    };

    if (
      !isSchoolAccount(
        user
      )
    ) {
      clearSignedInUser();

      window.alert(
        "Please sign in with your Allen County Schools Google account."
      );

      return;
    }

    saveSignedInUser(
      token,
      payload
    );
  }

  function createAuthHost() {
    let host =
      document.getElementById(
        "patriot-google-auth"
      );

    if (host) {
      return host;
    }

    host =
      document.createElement(
        "aside"
      );

    host.id =
      "patriot-google-auth";

    host.setAttribute(
      "aria-live",
      "polite"
    );

    host.style.position =
      "fixed";

    host.style.right =
      "14px";

    host.style.bottom =
      "14px";

    host.style.zIndex =
      "99999";

    host.style.maxWidth =
      "320px";

    host.style.padding =
      "12px";

    host.style.background =
      "rgba(255,255,255,.97)";

    host.style.border =
      "1px solid rgba(42,67,163,.18)";

    host.style.borderRadius =
      "14px";

    host.style.boxShadow =
      "0 12px 30px rgba(42,67,163,.18)";

    host.style.fontFamily =
      "Inter,Segoe UI,Arial,sans-serif";

    document.body.appendChild(
      host
    );

    return host;
  }

  function renderSignedInUser(
    host,
    user
  ) {
    host.innerHTML = `
      <div
        style="
          display:flex;
          align-items:center;
          gap:10px;
        "
      >
        ${
          user.picture
            ? `
              <img
                src="${user.picture}"
                alt=""
                referrerpolicy="no-referrer"
                style="
                  width:38px;
                  height:38px;
                  object-fit:cover;
                  border-radius:50%;
                "
              >
            `
            : `
              <div
                aria-hidden="true"
                style="
                  display:grid;
                  place-items:center;
                  width:38px;
                  height:38px;
                  color:#ffffff;
                  background:#2a43a3;
                  border-radius:50%;
                "
              >
                ✓
              </div>
            `
        }

        <div
          style="
            min-width:0;
            flex:1;
          "
        >
          <strong
            style="
              display:block;
              color:#20283a;
              font-size:.78rem;
            "
          >
            ${user.name || "School Account"}
          </strong>

          <span
            style="
              display:block;
              overflow:hidden;
              color:#657087;
              font-size:.65rem;
              text-overflow:ellipsis;
              white-space:nowrap;
            "
          >
            ${user.email}
          </span>
        </div>

        <button
          id="patriot-google-signout"
          type="button"
          style="
            padding:7px 9px;
            color:#2a43a3;
            font-size:.64rem;
            font-weight:700;
            background:#ffffff;
            border:1px solid rgba(42,67,163,.2);
            border-radius:8px;
            cursor:pointer;
          "
        >
          Sign out
        </button>
      </div>
    `;

    host
      .querySelector(
        "#patriot-google-signout"
      )
      ?.addEventListener(
        "click",
        signOut
      );
  }

  function renderSignInButton(
    host
  ) {
    host.innerHTML = `
      <div
        style="
          margin-bottom:8px;
          color:#20283a;
          font-size:.72rem;
          font-weight:750;
          line-height:1.35;
        "
      >
        Sign in to Patriot Command
      </div>

      <div
        id="patriot-google-button"
      ></div>
    `;

    if (
      !window.google?.accounts?.id
    ) {
      host.insertAdjacentHTML(
        "beforeend",
        `
          <p
            style="
              margin:8px 0 0;
              color:#657087;
              font-size:.63rem;
            "
          >
            Google Sign-In is still loading.
          </p>
        `
      );

      return;
    }

    window.google.accounts.id
      .renderButton(
        document.getElementById(
          "patriot-google-button"
        ),
        {
          type:
            "standard",

          theme:
            "outline",

          size:
            "large",

          text:
            "signin_with",

          shape:
            "rectangular",

          width:
            280
        }
      );
  }

  function renderAuthStatus() {
    const host =
      createAuthHost();

    const user =
      window.PATRIOT_AUTH.user;

    if (
      window.PATRIOT_AUTH.signedIn &&
      user
    ) {
      renderSignedInUser(
        host,
        user
      );

      return;
    }

    renderSignInButton(
      host
    );
  }

  function initializeGoogleAuth() {
    if (initialized) {
      return;
    }

    if (
      !window.google?.accounts?.id
    ) {
      window.setTimeout(
        initializeGoogleAuth,
        250
      );

      return;
    }

    const clientId =
      cleanText(
        window
          .PATRIOT_GOOGLE_CONFIG
          ?.CLIENT_ID
      );

    if (!clientId) {
      console.error(
        "Patriot Google Auth is missing the Google Client ID."
      );

      return;
    }

    initialized =
      true;

    window.google.accounts.id
      .initialize({
        client_id:
          clientId,

        callback:
          handleCredentialResponse,

        auto_select:
          false,

        cancel_on_tap_outside:
          true,

        hd:
          ALLOWED_DOMAIN
      });

    renderAuthStatus();
  }

  function signOut() {
    const user =
      window.PATRIOT_AUTH.user;

    if (
      user?.email &&
      window.google?.accounts?.id
    ) {
      window.google.accounts.id
        .disableAutoSelect();
    }

    clearSignedInUser();
    renderAuthStatus();
  }

  function requireSignIn() {
    if (
      window.PATRIOT_AUTH.signedIn
    ) {
      return true;
    }

    renderAuthStatus();

    return false;
  }

  const savedUser =
    getSavedUser();

  const savedToken =
    getIdToken();

  window.PATRIOT_AUTH = {
    signedIn:
      Boolean(
        savedUser &&
        savedToken
      ),

    user:
      savedUser,

    idToken:
      savedToken,

    getUser:
      () =>
        window.PATRIOT_AUTH.user,

    getIdToken,

    requireSignIn,

    signOut,

    initialize:
      initializeGoogleAuth
  };

  window.PATRIOT_USER =
    savedUser;

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeGoogleAuth
    );
  } else {
    initializeGoogleAuth();
  }

  console.log(
    "Patriot Google Auth v2 loaded."
  );
})();
