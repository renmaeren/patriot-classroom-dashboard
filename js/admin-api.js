/*
==========================================
PATRIOT COMMAND
Admin Console API
Version 1
==========================================
*/

(function () {
  "use strict";

  function cleanText(value) {
    return String(
      value ||
      ""
    ).trim();
  }

  function getScriptUrl() {
    const scriptUrl =
      cleanText(
        window.GOOGLE_SCRIPT_URL
      );

    if (!scriptUrl) {
      throw new Error(
        "The Google Apps Script URL is missing."
      );
    }

    return scriptUrl;
  }

  function getSignedInUser() {
    const user =
      window.PATRIOT_AUTH
        ?.getUser?.() ||
      window.PATRIOT_USER ||
      null;

    if (
      !user ||
      !cleanText(user.email)
    ) {
      throw new Error(
        "Please sign in to Patriot Command with your school Google account."
      );
    }

    return user;
  }

  function getIdToken() {
    const idToken =
      cleanText(
        window.PATRIOT_AUTH
          ?.getIdToken?.()
      );

    if (!idToken) {
      throw new Error(
        "Your Google sign-in could not be verified. Please sign out and sign in again."
      );
    }

    return idToken;
  }

  function getAuthData() {
    const user =
      getSignedInUser();

    return {
      adminEmail:
        cleanText(
          user.email
        ).toLowerCase(),

      idToken:
        getIdToken()
    };
  }

  function createCallbackName() {
    return (
      "__patriotAdminCallback_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(16)
        .slice(2)
    );
  }

  function jsonpRequest(
    parameters
  ) {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        const callbackName =
          createCallbackName();

        const script =
          document.createElement(
            "script"
          );

        const timeout =
          window.setTimeout(
            () => {
              cleanup();

              reject(
                new Error(
                  "The Admin Console connection timed out."
                )
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
        ] = response => {
          cleanup();

          if (
            !response ||
            response.success !==
              true
          ) {
            reject(
              new Error(
                response?.message ||
                "The Admin Console request was unsuccessful."
              )
            );

            return;
          }

          resolve(
            response
          );
        };

        const url =
          new URL(
            getScriptUrl()
          );

        Object.entries({
          ...parameters,
          callback:
            callbackName
        }).forEach(
          (
            [
              key,
              value
            ]
          ) => {
            url.searchParams.set(
              key,
              cleanText(
                value
              )
            );
          }
        );

        script.src =
          url.toString();

        script.async =
          true;

        script.onerror =
          () => {
            cleanup();

            reject(
              new Error(
                "Patriot Command could not reach the Admin Console backend."
              )
            );
          };

        document.head.appendChild(
          script
        );
      }
    );
  }

  async function postRequest(
    request
  ) {
    const response =
      await fetch(
        getScriptUrl(),
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(
              request
            ),

          redirect:
            "follow"
        }
      );

    if (!response.ok) {
      throw new Error(
        "The Admin Console backend returned an error."
      );
    }

    let result;

    try {
      result =
        await response.json();
    } catch (error) {
      throw new Error(
        "The Admin Console received an unreadable response."
      );
    }

    if (
      !result ||
      result.success !==
        true
    ) {
      throw new Error(
        result?.message ||
        "The Admin Console request was unsuccessful."
      );
    }

    return result;
  }

  async function listContent() {
    const auth =
      getAuthData();

    const response =
      await jsonpRequest({
        action:
          "listAdminContent",

        adminEmail:
          auth.adminEmail,

        idToken:
          auth.idToken
      });

    return Array.isArray(
      response.content
    )
      ? response.content
      : [];
  }

  async function saveContent(
    content
  ) {
    const auth =
      getAuthData();

    return postRequest({
      action:
        "saveAdminContent",

      adminEmail:
        auth.adminEmail,

      idToken:
        auth.idToken,

      contentId:
        cleanText(
          content.contentId
        ),

      contentType:
        cleanText(
          content.contentType
        ),

      title:
        cleanText(
          content.title
        ),

      message:
        cleanText(
          content.message
        ),

      priority:
        cleanText(
          content.priority
        ),

      start:
        cleanText(
          content.start
        ),

      end:
        cleanText(
          content.end
        ),

      enabled:
        Boolean(
          content.enabled
        )
    });
  }

  async function deleteContent(
    contentId
  ) {
    const auth =
      getAuthData();

    const requestedId =
      cleanText(
        contentId
      );

    if (!requestedId) {
      throw new Error(
        "A content ID is required."
      );
    }

    return postRequest({
      action:
        "deleteAdminContent",

      adminEmail:
        auth.adminEmail,

      idToken:
        auth.idToken,

      contentId:
        requestedId
    });
  }

  window.PatriotAdminApi = {
    listContent,
    saveContent,
    deleteContent
  };

  console.log(
    "Patriot Admin API v1 loaded."
  );
})();
