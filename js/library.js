/*
==========================================
PATRIOT COMMAND
Lesson Library
==========================================
*/

(function () {
  const ARCHIVE_URL =
    "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

  const TEACHER_PROFILE_KEY =
    "patriotTeacherProfile";

  function readTeacherProfile() {
    const saved =
      localStorage.getItem(
        TEACHER_PROFILE_KEY
      );

    if (!saved) {
      return {
        teacherName: "",
        teacherEmail: ""
      };
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "Teacher settings could not be read.",
        error
      );

      return {
        teacherName: "",
        teacherEmail: ""
      };
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatLessonDate(value) {
    if (!value) {
      return "Date not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function parseResources(value) {
    if (!value) {
      return [];
    }

    try {
      const resources = JSON.parse(value);

      return Array.isArray(resources)
        ? resources
        : [];
    } catch (error) {
      return [];
    }
  }

  function getResourceLabel(type) {
    const labels = {
      slides: "Google Slides",
      video: "Video",
      studysync: "StudySync",
      document: "Google Doc",
      canva: "Canva",
      pdf: "PDF",
      website: "Website",
      other: "Resource"
    };

    return labels[type] || "Resource";
  }

  function createResourceLinks(resourceText) {
    const resources =
      parseResources(resourceText);

    if (resources.length === 0) {
      return `
        <p class="lesson-no-resources">
          No resources attached.
        </p>
      `;
    }

    return `
      <div class="lesson-resource-links">
        ${resources
          .map(resource => {
            const label =
              resource.label ||
              getResourceLabel(
                resource.type
              );

            return `
              <a
                class="lesson-resource-link"
                href="${escapeHtml(resource.url)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                ${escapeHtml(label)}
              </a>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function createLessonCard(lesson) {
    const card =
      document.createElement("article");

    card.className = "lesson-card";

    const title =
      lesson.lessonTitle ||
      lesson.course ||
      "Untitled Lesson";

    card.innerHTML = `
      <div class="lesson-card-heading">
        <div>
          <h3>
            ${escapeHtml(title)}
          </h3>

          <p class="lesson-card-meta">
            ${escapeHtml(
              formatLessonDate(
                lesson.lessonDate
              )
            )}
          </p>

          <p class="lesson-card-meta">
            ${escapeHtml(
              lesson.course ||
              "Course not listed"
            )}

            ${
              lesson.periods
                ? ` · ${escapeHtml(
                    lesson.periods
                  )}`
                : ""
            }
          </p>
        </div>

        <button
          class="lesson-details-button"
          type="button"
        >
          View Lesson
        </button>
      </div>

      <div class="lesson-details">
        <div class="lesson-detail-section">
          <h4>Bell Ringer</h4>
          <p>
            ${escapeHtml(
              lesson.bellRinger ||
              "Not entered"
            )}
          </p>
        </div>

        <div class="lesson-detail-section">
          <h4>Agenda</h4>
          <p>
            ${escapeHtml(
              lesson.agenda ||
              "Not entered"
            )}
          </p>
        </div>

        <div class="lesson-detail-section">
          <h4>I Can / Learning Target</h4>
          <p>
            ${escapeHtml(
              lesson.learningTarget ||
              "Not entered"
            )}
          </p>
        </div>

        <div class="lesson-detail-section">
          <h4>Standards</h4>
          <p>
            ${escapeHtml(
              lesson.standards ||
              "Not entered"
            )}
          </p>
        </div>

        <div class="lesson-detail-section">
          <h4>Profile of a Patriot</h4>
          <p>
            ${escapeHtml(
              lesson.profileComponent ||
              "Not entered"
            )}
          </p>

          ${
            lesson.profileFocus
              ? `
                <p>
                  ${escapeHtml(
                    lesson.profileFocus
                  )}
                </p>
              `
              : ""
          }
        </div>

        <div class="lesson-detail-section">
          <h4>Resources</h4>

          ${createResourceLinks(
            lesson.lessonResources
          )}
        </div>
      </div>
    `;

    const detailsButton =
      card.querySelector(
        ".lesson-details-button"
      );

    const details =
      card.querySelector(
        ".lesson-details"
      );

    detailsButton.addEventListener(
      "click",
      () => {
        const isOpen =
          details.classList.toggle(
            "show"
          );

        detailsButton.textContent =
          isOpen
            ? "Hide Lesson"
            : "View Lesson";
      }
    );

    return card;
  }

  function displayLessons(lessons) {
    const container =
      document.getElementById(
        "lesson-library-list"
      );

    const message =
      document.getElementById(
        "library-message"
      );

    if (!container || !message) {
      return;
    }

    container.innerHTML = "";

    if (!lessons.length) {
      message.textContent =
        "No saved lessons were found for this account.";

      message.classList.add("show");

      return;
    }

    message.classList.remove("show");

    lessons.forEach(lesson => {
      container.appendChild(
        createLessonCard(lesson)
      );
    });
  }

  function showError(messageText) {
    const message =
      document.getElementById(
        "library-message"
      );

    if (!message) {
      return;
    }

    message.textContent = messageText;
    message.classList.add("show");
  }

  function loadLessons() {
    const teacher =
      readTeacherProfile();

    if (!teacher.teacherEmail) {
      showError(
        "Complete Teacher Settings so Patriot Command knows which lesson library to open."
      );

      return;
    }

    const callbackName =
      "patriotLibraryCallback";

    window[callbackName] =
      function (response) {
        if (
          !response ||
          response.success !== true
        ) {
          showError(
            response &&
            response.message
              ? response.message
              : "The Lesson Library could not be loaded."
          );

          return;
        }

        displayLessons(
          response.lessons || []
        );

        delete window[callbackName];
      };

    const script =
      document.createElement("script");

    script.src =
      ARCHIVE_URL +
      "?action=listLessons" +
      "&teacherEmail=" +
      encodeURIComponent(
        teacher.teacherEmail
      ) +
      "&callback=" +
      callbackName +
      "&time=" +
      Date.now();

    script.onerror = function () {
      showError(
        "Patriot Command could not reach the Google lesson archive."
      );
    };

    document.body.appendChild(script);
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      loadLessons
    );
  } else {
    loadLessons();
  }
})();
