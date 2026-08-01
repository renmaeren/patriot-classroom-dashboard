/*
==========================================
PATRIOT COMMAND
Admin Access Control
==========================================
*/

(function () {
  "use strict";

  const ADMIN_EMAILS = [
    "maegan.renick@allen.kyschools.us"
  ];

  function cleanText(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function getCurrentUserEmail() {
  const possibleSources = [
    window.patriotCurrentUserEmail,
    window.currentUserEmail,
    window.teacherEmail
  ];

  for (
    let index = 0;
    index < possibleSources.length;
    index += 1
  ) {
    const email =
      cleanText(
        possibleSources[index]
      );

    if (email) {
      return email;
    }
  }

  try {
    const savedProfile =
      JSON.parse(
        localStorage.getItem(
          "patriotTeacherProfile"
        ) || "{}"
      );

    return cleanText(
      savedProfile.teacherEmail ||
      savedProfile.email
    );
  } catch (error) {
    console.error(
      "Admin access could not read the teacher profile.",
      error
    );

    return "";
  }
}

    try {
      const savedSettings =
        JSON.parse(
          localStorage.getItem(
            "patriotTeacherSettings"
          ) || "{}"
        );

      return cleanText(
        savedSettings.teacherEmail ||
        savedSettings.email
      );
    } catch (error) {
      console.error(
        "Admin access could not read teacher settings.",
        error
      );

      return "";
    }
  }

  function isApprovedAdmin(email) {
    return ADMIN_EMAILS.includes(
      cleanText(email)
    );
  }

  function showAccessDenied(email) {
    document.body.innerHTML = `
      <main
        style="
          display:grid;
          place-items:center;
          min-height:100vh;
          padding:24px;
          background:#fffce9;
          font-family:Inter,Segoe UI,Arial,sans-serif;
        "
      >
        <section
          style="
            width:min(560px,100%);
            padding:32px;
            text-align:center;
            background:#ffffff;
            border:1px solid rgba(42,67,163,.16);
            border-radius:18px;
            box-shadow:0 14px 36px rgba(42,67,163,.14);
          "
        >
          <div
            style="
              font-size:2rem;
              margin-bottom:10px;
            "
          >
            🔒
          </div>

          <h1
            style="
              margin:0;
              color:#2a43a3;
              font-family:Georgia,serif;
            "
          >
            Admin Access Required
          </h1>

          <p
            style="
              margin:14px 0 0;
              color:#5b6476;
              line-height:1.5;
            "
          >
            This area is limited to approved Patriot Command administrators.
          </p>

          <p
            style="
              margin:10px 0 0;
              color:#20283a;
              font-size:.9rem;
            "
          >
            Signed in as:
            <strong>
              ${email || "Unknown account"}
            </strong>
          </p>

          <a
            href="index.html"
            style="
              display:inline-block;
              margin-top:20px;
              padding:10px 16px;
              color:#ffffff;
              text-decoration:none;
              background:#2a43a3;
              border-radius:9px;
            "
          >
            Return to Dashboard
          </a>
        </section>
      </main>
    `;
  }

  function enforceAdminAccess() {
    const email =
      getCurrentUserEmail();

    if (
      !isApprovedAdmin(
        email
      )
    ) {
      showAccessDenied(
        email
      );

      return false;
    }

    document.documentElement
      .classList.add(
        "patriot-admin-authorized"
      );

    window.PATRIOT_ADMIN_EMAIL =
      email;

    return true;
  }

  window.PatriotAdminAccess = {
    getCurrentUserEmail,
    isApprovedAdmin,
    enforceAdminAccess
  };
})();
