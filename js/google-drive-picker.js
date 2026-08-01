/*
==========================================
PATRIOT COMMAND
Google Sign-In and Drive Picker
==========================================

This file:

- loads Google Identity Services;
- loads the Google Picker API;
- requests Google authorization;
- remembers the teacher's approved account;
- opens filtered Google Drive pickers;
- returns the selected file to Patriot Command.

Required configuration:

window.PATRIOT_GOOGLE_CONFIG = {
  CLIENT_ID: "...apps.googleusercontent.com",
  API_KEY: "..."
};

IMPORTANT:
- Never place the OAuth Client Secret in browser code.
- OAuth access tokens remain in memory only.
*/

(function () {
  "use strict";

  /*
  ==========================================
  CONSTANTS
  ==========================================
  */

  const GOOGLE_IDENTITY_SCRIPT =
    "https://accounts.google.com/gsi/client";

  const GOOGLE_API_SCRIPT =
    "https://apis.google.com/js/api.js";

  const GOOGLE_USERINFO_URL =
    "https://openidconnect.googleapis.com/v1/userinfo";

  const AUTHORIZED_KEY =
    "patriotGoogleAuthorized";

  const PROFILE_KEY =
    "patriotGoogleProfile";

  const GOOGLE_SCOPE = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/drive.file"
  ].join(" ");

  const GOOGLE_MIME_TYPES = {
    slides:
      "application/vnd.google-apps.presentation",

    docs:
      "application/vnd.google-apps.document",

    sheets:
      "application/vnd.google-apps.spreadsheet",

    forms:
      "application/vnd.google-apps.form",

    pdf:
      "application/pdf",

    images:
      "image/png,image/jpeg,image/gif,image/webp",

    videos:
      "video/mp4,video/webm,video/quicktime"
  };

  /*
  ==========================================
  INTERNAL STATE
  ==========================================
  */

  let identityScriptPromise = null;
  let apiScriptPromise = null;
  let pickerLibraryPromise = null;

  let tokenClient = null;
  let accessToken = "";
  let accessTokenExpiresAt = 0;

  let currentProfile =
    readStoredProfile();

  /*
  ==========================================
  GENERAL HELPERS
  ==========================================
  */

  function getConfig() {
    const config =
      window.PATRIOT_GOOGLE_CONFIG;

    if (
      !config ||
      typeof config !== "object"
    ) {
      throw new Error(
        "Patriot Command Google configuration was not found."
      );
    }

    const clientId =
      String(
        config.CLIENT_ID || ""
      ).trim();

    const apiKey =
      String(
        config.API_KEY || ""
      ).trim();

    if (
      !clientId ||
      clientId.includes(
        "PASTE_YOUR"
      )
    ) {
      throw new Error(
        "The Google OAuth Client ID has not been configured."
      );
    }

    if (
      !apiKey ||
      apiKey.includes(
        "PASTE_YOUR"
      )
    ) {
      throw new Error(
        "The Google Browser API Key has not been configured."
      );
    }

    return {
      clientId,
      apiKey
    };
  }

  function getGoogleProjectNumber() {
    const {
      clientId
    } = getConfig();

    return (
      clientId.split("-")[0] ||
      ""
    );
  }

  function hasValidAccessToken() {
    return Boolean(
      accessToken &&
      Date.now() <
        accessTokenExpiresAt
    );
  }

  function hasPreviousAuthorization() {
    return (
      localStorage.getItem(
        AUTHORIZED_KEY
      ) === "true"
    );
  }

  function rememberAuthorization() {
    localStorage.setItem(
      AUTHORIZED_KEY,
      "true"
    );
  }

  function forgetAuthorization() {
    localStorage.removeItem(
      AUTHORIZED_KEY
    );

    localStorage.removeItem(
      PROFILE_KEY
    );

    currentProfile = null;
  }

  function readStoredProfile() {
    const savedProfile =
      localStorage.getItem(
        PROFILE_KEY
      );

    if (!savedProfile) {
      return null;
    }

    try {
      return JSON.parse(
        savedProfile
      );
    } catch (error) {
      localStorage.removeItem(
        PROFILE_KEY
      );

      return null;
    }
  }

  function saveProfile(profile) {
    if (
      !profile ||
      typeof profile !== "object"
    ) {
      return;
    }

    currentProfile = {
      name:
        String(
          profile.name || ""
        ).trim(),

      email:
        String(
          profile.email || ""
        ).trim(),

      picture:
        String(
          profile.picture || ""
        ).trim()
    };

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(
        currentProfile
      )
    );
  }

  function dispatchEvent(
    eventName,
    detail
  ) {
    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail
        }
      )
    );
  }

  function loadExternalScript(
    source,
    id
  ) {
    const existingScript =
      document.getElementById(id);

    if (existingScript) {
      return Promise.resolve();
    }

    return new Promise(
      (
        resolve,
        reject
      ) => {
        const script =
          document.createElement(
            "script"
          );

        script.id = id;
        script.src = source;
        script.async = true;
        script.defer = true;

        script.addEventListener(
          "load",
          () => {
            resolve();
          }
        );

        script.addEventListener(
          "error",
          () => {
            reject(
              new Error(
                `Could not load ${source}.`
              )
            );
          }
        );

        document.head.appendChild(
          script
        );
      }
    );
  }

  /*
  ==========================================
  GOOGLE LIBRARY LOADING
  ==========================================
  */

  function loadIdentityServices() {
    if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.oauth2
    ) {
      return Promise.resolve();
    }

    if (!identityScriptPromise) {
      identityScriptPromise =
        loadExternalScript(
          GOOGLE_IDENTITY_SCRIPT,
          "patriot-google-identity"
        );
    }

    return identityScriptPromise;
  }

  function loadGoogleApi() {
    if (
      window.gapi &&
      typeof window.gapi.load ===
        "function"
    ) {
      return Promise.resolve();
    }

    if (!apiScriptPromise) {
      apiScriptPromise =
        loadExternalScript(
          GOOGLE_API_SCRIPT,
          "patriot-google-api"
        );
    }

    return apiScriptPromise;
  }

  function loadPickerLibrary() {
    if (
      window.google &&
      window.google.picker
    ) {
      return Promise.resolve();
    }

    if (pickerLibraryPromise) {
      return pickerLibraryPromise;
    }

    pickerLibraryPromise =
      loadGoogleApi()
        .then(() => {
          return new Promise(
            (
              resolve,
              reject
            ) => {
              window.gapi.load(
                "picker",
                {
                  callback:
                    resolve,

                  onerror:
                    () => {
                      reject(
                        new Error(
                          "Google Picker could not be loaded."
                        )
                      );
                    },

                  timeout:
                    10000,

                  ontimeout:
                    () => {
                      reject(
                        new Error(
                          "Google Picker timed out while loading."
                        )
                      );
                    }
                }
              );
            }
          );
        });

    return pickerLibraryPromise;
  }

  /*
  ==========================================
  GOOGLE AUTHORIZATION
  ==========================================
  */

  function initializeTokenClient() {
    if (tokenClient) {
      return tokenClient;
    }

    const {
      clientId
    } = getConfig();

    tokenClient =
      window.google.accounts.oauth2
        .initTokenClient({
          client_id:
            clientId,

          scope:
            GOOGLE_SCOPE,

          callback:
            () => {
              /*
              The callback is replaced immediately
              before each token request.
              */
            }
        });

    return tokenClient;
  }

  async function initialize() {
    getConfig();

    await Promise.all([
      loadIdentityServices(),
      loadGoogleApi()
    ]);

    initializeTokenClient();

    dispatchEvent(
      "patriot-google-ready",
      {
        remembered:
          hasPreviousAuthorization(),

        profile:
          currentProfile
      }
    );

    return {
      remembered:
        hasPreviousAuthorization(),

      profile:
        currentProfile
    };
  }

  function requestAccessToken(
    options = {}
  ) {
    const forceConsent =
      Boolean(
        options.forceConsent
      );

    if (
      hasValidAccessToken() &&
      !forceConsent
    ) {
      return Promise.resolve(
        accessToken
      );
    }

    return initialize()
      .then(() => {
        return new Promise(
          (
            resolve,
            reject
          ) => {
            const client =
              initializeTokenClient();

            client.callback =
              response => {
                if (
                  !response ||
                  response.error
                ) {
                  reject(
                    new Error(
                      response?.error_description ||
                      response?.error ||
                      "Google authorization was not completed."
                    )
                  );

                  return;
                }

                accessToken =
                  response.access_token ||
                  "";

                const expiresIn =
                  Number(
                    response.expires_in ||
                    3600
                  );

                /*
                Expire locally one minute early so
                Patriot Command does not try to use
                a token that is about to expire.
                */

                accessTokenExpiresAt =
                  Date.now() +
                  Math.max(
                    expiresIn - 60,
                    60
                  ) *
                  1000;

                rememberAuthorization();

                dispatchEvent(
                  "patriot-google-authorized",
                  {
                    expiresAt:
                      accessTokenExpiresAt
                  }
                );

                resolve(
                  accessToken
                );
              };

            const prompt =
              forceConsent ||
              !hasPreviousAuthorization()
                ? "consent"
                : "";

            try {
              client.requestAccessToken({
                prompt
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
  }

  async function fetchGoogleProfile() {
    if (!hasValidAccessToken()) {
      return currentProfile;
    }

    try {
      const response =
        await fetch(
          GOOGLE_USERINFO_URL,
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`
            }
          }
        );

      if (!response.ok) {
        return currentProfile;
      }

      const profile =
        await response.json();

      saveProfile(profile);

      dispatchEvent(
        "patriot-google-profile",
        {
          profile:
            currentProfile
        }
      );

      return currentProfile;
    } catch (error) {
      console.info(
        "Google profile information could not be loaded.",
        error
      );

      return currentProfile;
    }
  }

  async function signIn() {
    await requestAccessToken({
      forceConsent:
        !hasPreviousAuthorization()
    });

    const profile =
      await fetchGoogleProfile();

    return {
      signedIn: true,
      profile
    };
  }

  function signOut() {
    return new Promise(
      resolve => {
        const finishSignOut =
          () => {
            accessToken = "";
            accessTokenExpiresAt = 0;

            forgetAuthorization();

            dispatchEvent(
              "patriot-google-signed-out",
              {}
            );

            resolve();
          };

        if (
          !accessToken ||
          !window.google ||
          !window.google.accounts ||
          !window.google.accounts.oauth2
        ) {
          finishSignOut();
          return;
        }

        window.google.accounts.oauth2
          .revoke(
            accessToken,
            finishSignOut
          );
      }
    );
  }

  /*
  ==========================================
  FILE NORMALIZATION
  ==========================================
  */

  function getFileTypeFromMime(
    mimeType
  ) {
    const value =
      String(
        mimeType || ""
      ).toLowerCase();

    if (
      value ===
      GOOGLE_MIME_TYPES.slides
    ) {
      return "slides";
    }

    if (
      value ===
      GOOGLE_MIME_TYPES.docs
    ) {
      return "document";
    }

    if (
      value ===
      GOOGLE_MIME_TYPES.sheets
    ) {
      return "spreadsheet";
    }

    if (
      value ===
      GOOGLE_MIME_TYPES.forms
    ) {
      return "form";
    }

    if (
      value ===
      GOOGLE_MIME_TYPES.pdf
    ) {
      return "pdf";
    }

    if (
      value.startsWith(
        "image/"
      )
    ) {
      return "image";
    }

    if (
      value.startsWith(
        "video/"
      )
    ) {
      return "video";
    }

    return "website";
  }

  function createGoogleFileUrl(
    fileId,
    mimeType
  ) {
    const type =
      getFileTypeFromMime(
        mimeType
      );

    if (type === "slides") {
      return (
        "https://docs.google.com/presentation/d/" +
        encodeURIComponent(fileId) +
        "/edit"
      );
    }

    if (type === "document") {
      return (
        "https://docs.google.com/document/d/" +
        encodeURIComponent(fileId) +
        "/edit"
      );
    }

    if (type === "spreadsheet") {
      return (
        "https://docs.google.com/spreadsheets/d/" +
        encodeURIComponent(fileId) +
        "/edit"
      );
    }

    if (type === "form") {
      return (
        "https://docs.google.com/forms/d/" +
        encodeURIComponent(fileId) +
        "/edit"
      );
    }

    return (
      "https://drive.google.com/file/d/" +
      encodeURIComponent(fileId) +
      "/view"
    );
  }

  function normalizePickedFile(
    documentData
  ) {
    const fileId =
      String(
        documentData.id || ""
      ).trim();

    const mimeType =
      String(
        documentData.mimeType ||
        documentData.type ||
        ""
      ).trim();

    const type =
      getFileTypeFromMime(
        mimeType
      );

    const fallbackUrl =
      createGoogleFileUrl(
        fileId,
        mimeType
      );

    return {
      id:
        fileId,

      name:
        String(
          documentData.name ||
          "Google Drive Resource"
        ).trim(),

      type,

      mimeType,

      url:
        String(
          documentData.url ||
          fallbackUrl
        ).trim(),

      iconUrl:
        String(
          documentData.iconUrl ||
          ""
        ).trim(),

      serviceId:
        String(
          documentData.serviceId ||
          "docs"
        ).trim(),

      source:
        "google-drive"
    };
  }

  /*
  ==========================================
  PICKER CREATION
  ==========================================
  */

  function getMimeTypesForPicker(
    pickerType
  ) {
    const type =
      String(
        pickerType || "all"
      ).toLowerCase();

    if (
      type === "slides"
    ) {
      return [
        GOOGLE_MIME_TYPES.slides
      ];
    }

    if (
      type === "docs" ||
      type === "document"
    ) {
      return [
        GOOGLE_MIME_TYPES.docs
      ];
    }

    if (
      type === "sheets" ||
      type === "spreadsheet"
    ) {
      return [
        GOOGLE_MIME_TYPES.sheets
      ];
    }

    if (
      type === "forms" ||
      type === "form"
    ) {
      return [
        GOOGLE_MIME_TYPES.forms
      ];
    }

    if (type === "pdf") {
      return [
        GOOGLE_MIME_TYPES.pdf
      ];
    }

    if (type === "images") {
      return (
        GOOGLE_MIME_TYPES.images
          .split(",")
      );
    }

    if (type === "videos") {
      return (
        GOOGLE_MIME_TYPES.videos
          .split(",")
      );
    }

    return [];
  }

  function buildPickerView(
    pickerType
  ) {
    const view =
      new window.google.picker
        .DocsView(
          window.google.picker
            .ViewId.DOCS
        );

    const mimeTypes =
      getMimeTypesForPicker(
        pickerType
      );

    view.setIncludeFolders(true);
    view.setSelectFolderEnabled(
      false
    );

    if (mimeTypes.length) {
      view.setMimeTypes(
        mimeTypes.join(",")
      );
    }

    return view;
  }

  async function openPicker(
    options = {}
  ) {
    const pickerType =
      String(
        options.type || "all"
      ).toLowerCase();

    const onPick =
      typeof options.onPick ===
        "function"
        ? options.onPick
        : null;

    await Promise.all([
      requestAccessToken(),
      loadPickerLibrary()
    ]);

    const {
      apiKey
    } = getConfig();

    const projectNumber =
      getGoogleProjectNumber();

    const pickerView =
      buildPickerView(
        pickerType
      );

    const uploadView =
  new window.google.picker
    .DocsUploadView();

    uploadView.setIncludeFolders(
      true
    );

    return new Promise(
      (
        resolve,
        reject
      ) => {
        const picker =
  new window.google.picker
    .PickerBuilder()
    .addView(
      pickerView
    )
    .addView(
      uploadView
    )
    .setOAuthToken(
      accessToken
    )
            .setDeveloperKey(
              apiKey
            )
            .setOrigin(
              window.location.origin
            )
            .setCallback(
              data => {
                const action =
                  data[
                    window.google.picker
                      .Response.ACTION
                  ];

                if (
                  action ===
                  window.google.picker
                    .Action.PICKED
                ) {
                  const documents =
                    data[
                      window.google.picker
                        .Response.DOCUMENTS
                    ] || [];

                  const selectedFile =
                    normalizePickedFile(
                      documents[0] ||
                      {}
                    );

                  if (onPick) {
                    onPick(
                      selectedFile
                    );
                  }

                  dispatchEvent(
                    "patriot-google-file-picked",
                    {
                      file:
                        selectedFile,

                      pickerType
                    }
                  );

                  resolve(
                    selectedFile
                  );

                  return;
                }

                if (
                  action ===
                  window.google.picker
                    .Action.CANCEL
                ) {
                  resolve(null);

                  return;
                }

                if (
                  action ===
                  window.google.picker
                    .Action.ERROR
                ) {
                  reject(
                    new Error(
                      "Google Picker reported an error."
                    )
                  );
                }
              }
            );

        /*
        The project number is required when
        using the drive.file authorization scope.
        */

        if (projectNumber) {
          picker.setAppId(
            projectNumber
          );
        }

        picker
          .build()
          .setVisible(true);
      }
    );
  }

  /*
  ==========================================
  CONVENIENCE PICKERS
  ==========================================
  */

  function openSlidesPicker(
    onPick
  ) {
    return openPicker({
      type:
        "slides",

      onPick
    });
  }

  function openDocsPicker(
    onPick
  ) {
    return openPicker({
      type:
        "docs",

      onPick
    });
  }

  function openSheetsPicker(
    onPick
  ) {
    return openPicker({
      type:
        "sheets",

      onPick
    });
  }

  function openFormsPicker(
    onPick
  ) {
    return openPicker({
      type:
        "forms",

      onPick
    });
  }

  function openPdfPicker(
    onPick
  ) {
    return openPicker({
      type:
        "pdf",

      onPick
    });
  }

  function openImagePicker(
    onPick
  ) {
    return openPicker({
      type:
        "images",

      onPick
    });
  }

  function openVideoPicker(
    onPick
  ) {
    return openPicker({
      type:
        "videos",

      onPick
    });
  }

  /*
  ==========================================
  PUBLIC API
  ==========================================
  */

  window.PatriotGoogle = {
    initialize,
    signIn,
    signOut,
    requestAccessToken,

    openPicker,
    openSlidesPicker,
    openDocsPicker,
    openSheetsPicker,
    openFormsPicker,
    openPdfPicker,
    openImagePicker,
    openVideoPicker,

    getProfile:
      () => currentProfile,

    isRemembered:
      () =>
        hasPreviousAuthorization(),

    hasActiveToken:
      () =>
        hasValidAccessToken()
  };

  /*
  Load the Google libraries quietly when the
  page opens. This does not display a sign-in
  prompt and does not request Drive access.
  */

  function startGoogleIntegration() {
    initialize()
      .catch(error => {
        console.info(
          "Patriot Command Google integration is waiting for configuration.",
          error
        );
      });
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startGoogleIntegration
    );
  } else {
    startGoogleIntegration();
  }
})();
