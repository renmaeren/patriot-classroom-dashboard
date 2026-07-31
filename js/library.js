/*
==========================================
PATRIOT COMMAND
Lesson Library with Calendar
==========================================
*/

(function () {
  const ARCHIVE_URL =
    "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

  const TEACHER_PROFILE_KEY =
    "patriotTeacherProfile";

  const DUPLICATE_LESSON_KEY =
    "patriotDuplicateLesson";

  const EDIT_LESSON_KEY =
    "patriotEditLesson";

  const TEACH_LESSON_KEY =
    "patriotTeachLesson";

  let allLessons = [];

  let selectedDate = "";

  const today = new Date();

  let visibleMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

  /*
  ==========================================
  TEACHER PROFILE
  ==========================================
  */

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

  /*
  ==========================================
  DATE HELPERS
  ==========================================
  */

  function dateToText(date) {
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function normalizeLessonDate(value) {
    if (!value) {
      return "";
    }

    const text =
      String(value).trim();

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        text
      )
    ) {
      return text;
    }

    const date =
      new Date(text);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return dateToText(date);
  }

  function textToLocalDate(value) {
    const normalized =
      normalizeLessonDate(value);

    if (!normalized) {
      return null;
    }

    const parts =
      normalized
        .split("-")
        .map(Number);

    return new Date(
      parts[0],
      parts[1] - 1,
      parts[2],
      12,
      0,
      0
    );
  }

  function formatLessonDate(value) {
    const date =
      textToLocalDate(value);

    if (!date) {
      return (
        value ||
        "Date not available"
      );
    }

    return date.toLocaleDateString(
      [],
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  }

  function formatResultsDate(value) {
    const date =
      textToLocalDate(value);

    if (!date) {
      return value;
    }

    return date.toLocaleDateString(
      [],
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  }

  function isSameMonth(
    firstDate,
    secondDate
  ) {
    return (
      firstDate.getFullYear() ===
        secondDate.getFullYear() &&
      firstDate.getMonth() ===
        secondDate.getMonth()
    );
  }

  /*
  ==========================================
  HTML AND RESOURCE HELPERS
  ==========================================
  */

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function hasContent(value) {
    return Boolean(
      String(value || "").trim()
    );
  }

  function parseResources(value) {
    if (!value) {
      return [];
    }

    try {
      const resources =
        typeof value === "string"
          ? JSON.parse(value)
          : value;

      return Array.isArray(resources)
        ? resources
        : [];
    } catch (error) {
      return [];
    }
  }

  function getLessonResources(lesson) {
    return (
      lesson.lessonResources ??
      lesson.resources ??
      []
    );
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

    return (
      labels[type] ||
      "Resource"
    );
  }

  function createResourceLinks(
    resourceValue
  ) {
    const resources =
      parseResources(
        resourceValue
      ).filter(resource => {
        return (
          resource &&
          resource.url
        );
      });

    if (
      resources.length === 0
    ) {
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
                href="${escapeHtml(
                  resource.url
                )}"
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

  function createDetailSection(
    title,
    value
  ) {
    if (!hasContent(value)) {
      return "";
    }

    return `
      <div class="lesson-detail-section">
        <h4>
          ${escapeHtml(title)}
        </h4>

        <p>
          ${escapeHtml(value)}
        </p>
      </div>
    `;
  }

  function createProfileSection(
    lesson
  ) {
    const component =
      lesson.profileComponent;

    const focus =
      lesson.profileFocus;

    if (
      !hasContent(component) &&
      !hasContent(focus)
    ) {
      return "";
    }

    return `
      <div class="lesson-detail-section">
        <h4>
          Profile of a Patriot
        </h4>

        ${
          hasContent(component)
            ? `
              <p>
                ${escapeHtml(component)}
              </p>
            `
            : ""
        }

        ${
          hasContent(focus)
            ? `
              <p>
                ${escapeHtml(focus)}
              </p>
            `
            : ""
        }
      </div>
    `;
  }

  function createResourcesSection(
    lesson
  ) {
    return `
      <div class="lesson-detail-section">
        <h4>
          Resources
        </h4>

        ${createResourceLinks(
          getLessonResources(lesson)
        )}
      </div>
    `;
  }

  /*
  ==========================================
  LESSON ACTIONS
  ==========================================
  */

  function teachLesson(lesson) {
    localStorage.setItem(
      TEACH_LESSON_KEY,
      JSON.stringify(lesson)
    );

    window.location.href =
      "classroom.html?mode=teach";
  }

  function editLesson(lesson) {
    localStorage.setItem(
      EDIT_LESSON_KEY,
      JSON.stringify(lesson)
    );

    window.location.href =
      "planner.html?mode=edit";
  }

  function duplicateLesson(lesson) {
    localStorage.setItem(
      DUPLICATE_LESSON_KEY,
      JSON.stringify(lesson)
    );

    window.location.href =
      "planner.html?mode=duplicate";
  }

  /*
  ==========================================
  LESSON CARDS
  ==========================================
  */

  function createLessonCard(lesson) {
    const card =
      document.createElement(
        "article"
      );

    card.className =
      "lesson-card";

    card.dataset.lessonDate =
      normalizeLessonDate(
        lesson.lessonDate
      );

    card.dataset.searchText = [
      lesson.lessonTitle,
      lesson.course,
      lesson.periods,
      lesson.bellRinger,
      lesson.essentialQuestion,
      lesson.learningTarget,
      lesson.profileComponent,
      lesson.profileFocus,
      lesson.agenda,
      lesson.vocabulary,
      lesson.exitTicket,
      lesson.homework,
      lesson.successCriteria,
      lesson.whyLearning,
      lesson.standards,
      lesson.materials,
      lesson.teacherNotes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const title =
      lesson.lessonTitle ||
      lesson.course ||
      "Untitled Lesson";

    card.innerHTML = `
      <div class="lesson-card-heading">
        <div class="lesson-card-copy">
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

        <div class="lesson-card-actions">
          <button
            class="lesson-preview-button lesson-teach-button"
            type="button"
          >
            Teach
          </button>

          <button
            class="lesson-details-button"
            type="button"
          >
            View Lesson
          </button>

          <button
            class="lesson-edit-button"
            type="button"
          >
            Edit
          </button>

          <button
            class="lesson-duplicate-button"
            type="button"
          >
            Duplicate
          </button>
        </div>
      </div>

      <div class="lesson-details">
        ${createDetailSection(
          "Bell Ringer",
          lesson.bellRinger
        )}

        ${createDetailSection(
          "Essential Question",
          lesson.essentialQuestion
        )}

        ${createDetailSection(
          "I Can / Learning Target",
          lesson.learningTarget
        )}

        ${createProfileSection(
          lesson
        )}

        ${createDetailSection(
          "Agenda",
          lesson.agenda
        )}

        ${createDetailSection(
          "Vocabulary",
          lesson.vocabulary
        )}

        ${createResourcesSection(
          lesson
        )}

        ${createDetailSection(
          "Exit Ticket",
          lesson.exitTicket
        )}

        ${createDetailSection(
          "Homework",
          lesson.homework
        )}

        ${createDetailSection(
          "Success Criteria",
          lesson.successCriteria
        )}

        ${createDetailSection(
          "Why Are We Learning This?",
          lesson.whyLearning
        )}

        ${createDetailSection(
          "Standards",
          lesson.standards
        )}

        ${createDetailSection(
          "Materials Needed",
          lesson.materials
        )}

        ${createDetailSection(
          "Teacher Notes",
          lesson.teacherNotes
        )}
      </div>
    `;

    const detailsButton =
      card.querySelector(
        ".lesson-details-button"
      );

    const teachButton =
      card.querySelector(
        ".lesson-teach-button"
      );

    const editButton =
      card.querySelector(
        ".lesson-edit-button"
      );

    const duplicateButton =
      card.querySelector(
        ".lesson-duplicate-button"
      );

    const details =
      card.querySelector(
        ".lesson-details"
      );

    detailsButton.addEventListener(
      "click",
      function () {
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

    teachButton.addEventListener(
      "click",
      function () {
        teachLesson(lesson);
      }
    );

    editButton.addEventListener(
      "click",
      function () {
        editLesson(lesson);
      }
    );

    duplicateButton.addEventListener(
      "click",
      function () {
        duplicateLesson(lesson);
      }
    );

    return card;
  }

  /*
  ==========================================
  RESULTS DISPLAY
  ==========================================
  */

  function updateResultsHeading(
    lessons
  ) {
    const title =
      document.getElementById(
        "lesson-results-title"
      );

    const count =
      document.getElementById(
        "lesson-results-count"
      );

    if (title) {
      title.textContent =
        selectedDate
          ? `Lessons for ${formatResultsDate(
              selectedDate
            )}`
          : "All Saved Lessons";
    }

    if (count) {
      const lessonWord =
        lessons.length === 1
          ? "lesson"
          : "lessons";

      count.textContent =
        `${lessons.length} ${lessonWord}`;
    }
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

    if (
      !container ||
      !message
    ) {
      return;
    }

    container.innerHTML = "";

    updateResultsHeading(
      lessons
    );

    if (!lessons.length) {
      message.textContent =
        selectedDate
          ? "No lessons are saved for this date."
          : "No saved lessons were found for this account.";

      message.classList.add(
        "show"
      );

      return;
    }

    message.classList.remove(
      "show"
    );

    lessons.forEach(lesson => {
      container.appendChild(
        createLessonCard(lesson)
      );
    });

    window.dispatchEvent(
      new CustomEvent(
        "patriotLibraryRendered",
        {
          detail: {
            lessons:
              lessons.slice(),

            selectedDate:
              selectedDate
          }
        }
      )
    );
  }

  function getLessonsForDate(
    dateText
  ) {
    return allLessons.filter(
      lesson => {
        return (
          normalizeLessonDate(
            lesson.lessonDate
          ) === dateText
        );
      }
    );
  }

  function showAllLessons() {
    selectedDate = "";

    displayLessons(
      allLessons
    );

    renderCalendar();
  }

  function selectCalendarDate(
    dateText
  ) {
    selectedDate =
      dateText;

    const selected =
      textToLocalDate(
        dateText
      );

    if (
      selected &&
      !isSameMonth(
        selected,
        visibleMonth
      )
    ) {
      visibleMonth =
        new Date(
          selected.getFullYear(),
          selected.getMonth(),
          1
        );
    }

    displayLessons(
      getLessonsForDate(
        dateText
      )
    );

    renderCalendar();

    const resultsHeading =
      document.querySelector(
        ".lesson-results-heading"
      );

    if (resultsHeading) {
      resultsHeading.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  /*
  ==========================================
  CALENDAR
  ==========================================
  */

  function buildLessonDateCounts() {
    const counts = {};

    allLessons.forEach(lesson => {
      const dateText =
        normalizeLessonDate(
          lesson.lessonDate
        );

      if (!dateText) {
        return;
      }

      counts[dateText] =
        (counts[dateText] || 0) +
        1;
    });

    return counts;
  }

  function createCalendarDay(
    date,
    dateCounts
  ) {
    const dateText =
      dateToText(date);

    const lessonCount =
      dateCounts[dateText] || 0;

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "calendar-day";

    button.setAttribute(
      "role",
      "gridcell"
    );

    button.dataset.date =
      dateText;

    if (
      !isSameMonth(
        date,
        visibleMonth
      )
    ) {
      button.classList.add(
        "outside-month"
      );
    }

    if (lessonCount > 0) {
      button.classList.add(
        "has-lessons"
      );
    }

    if (
      selectedDate ===
      dateText
    ) {
      button.classList.add(
        "selected"
      );

      button.setAttribute(
        "aria-selected",
        "true"
      );
    } else {
      button.setAttribute(
        "aria-selected",
        "false"
      );
    }

    if (
      dateText ===
      dateToText(today)
    ) {
      button.classList.add(
        "today"
      );
    }

    const lessonWord =
      lessonCount === 1
        ? "lesson"
        : "lessons";

    button.setAttribute(
      "aria-label",
      lessonCount > 0
        ? `${formatResultsDate(
            dateText
          )}, ${lessonCount} ${lessonWord}`
        : `${formatResultsDate(
            dateText
          )}, no lessons`
    );

    button.innerHTML = `
      <span class="calendar-day-number">
        ${date.getDate()}
      </span>

      ${
        lessonCount > 0
          ? `
            <span class="calendar-day-lesson-count">
              ${lessonCount}
              ${lessonWord}
            </span>

            <span
              class="calendar-day-dots"
              aria-hidden="true"
            >
              ${Array.from({
                length:
                  Math.min(
                    lessonCount,
                    5
                  )
              })
                .map(() => {
                  return `
                    <span
                      class="calendar-day-dot"
                    ></span>
                  `;
                })
                .join("")}
            </span>
          `
          : ""
      }
    `;

    button.addEventListener(
      "click",
      function () {
        selectCalendarDate(
          dateText
        );
      }
    );

    return button;
  }

  function renderCalendar() {
    const grid =
      document.getElementById(
        "lesson-calendar-grid"
      );

    const monthLabel =
      document.getElementById(
        "calendar-month-label"
      );

    if (
      !grid ||
      !monthLabel
    ) {
      return;
    }

    monthLabel.textContent =
      visibleMonth.toLocaleDateString(
        [],
        {
          month: "long",
          year: "numeric"
        }
      );

    grid.innerHTML = "";

    const dateCounts =
      buildLessonDateCounts();

    const firstDayOfMonth =
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        1
      );

    const gridStart =
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        1 -
          firstDayOfMonth.getDay()
      );

    for (
      let index = 0;
      index < 42;
      index += 1
    ) {
      const date =
        new Date(
          gridStart.getFullYear(),
          gridStart.getMonth(),
          gridStart.getDate() +
            index,
          12,
          0,
          0
        );

      grid.appendChild(
        createCalendarDay(
          date,
          dateCounts
        )
      );
    }
  }

  function changeVisibleMonth(
    amount
  ) {
    visibleMonth =
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() +
          amount,
        1
      );

    renderCalendar();
  }

  function goToToday() {
    visibleMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

    selectCalendarDate(
      dateToText(today)
    );
  }

  function connectCalendarControls() {
    const previousButton =
      document.getElementById(
        "calendar-previous-month"
      );

    const nextButton =
      document.getElementById(
        "calendar-next-month"
      );

    const todayButton =
      document.getElementById(
        "calendar-today-button"
      );

    const allLessonsButton =
      document.getElementById(
        "calendar-all-lessons-button"
      );

    if (previousButton) {
      previousButton.addEventListener(
        "click",
        function () {
          changeVisibleMonth(-1);
        }
      );
    }

    if (nextButton) {
      nextButton.addEventListener(
        "click",
        function () {
          changeVisibleMonth(1);
        }
      );
    }

    if (todayButton) {
      todayButton.addEventListener(
        "click",
        goToToday
      );
    }

    if (allLessonsButton) {
      allLessonsButton.addEventListener(
        "click",
        showAllLessons
      );
    }
  }

  /*
  ==========================================
  ARCHIVE LOADING
  ==========================================
  */

  function showError(messageText) {
    const message =
      document.getElementById(
        "library-message"
      );

    if (!message) {
      return;
    }

    message.textContent =
      messageText;

    message.classList.add(
      "show"
    );
  }

  function showLoadingMessage() {
    const message =
      document.getElementById(
        "library-message"
      );

    if (!message) {
      return;
    }

    message.textContent =
      "Loading your saved lessons...";

    message.classList.add(
      "show"
    );
  }

  function sortLessonsNewestFirst(
    lessons
  ) {
    return lessons
      .slice()
      .sort(
        (
          firstLesson,
          secondLesson
        ) => {
          const firstDate =
            textToLocalDate(
              firstLesson.lessonDate
            );

          const secondDate =
            textToLocalDate(
              secondLesson.lessonDate
            );

          const firstTime =
            firstDate
              ? firstDate.getTime()
              : 0;

          const secondTime =
            secondDate
              ? secondDate.getTime()
              : 0;

          return (
            secondTime -
            firstTime
          );
        }
      );
  }

  function setInitialCalendarMonth() {
    if (!allLessons.length) {
      return;
    }

    const lessonDates =
      allLessons
        .map(lesson => {
          return textToLocalDate(
            lesson.lessonDate
          );
        })
        .filter(Boolean);

    if (!lessonDates.length) {
      return;
    }

    const currentMonthHasLessons =
      lessonDates.some(date => {
        return isSameMonth(
          date,
          visibleMonth
        );
      });

    if (currentMonthHasLessons) {
      return;
    }

    const newestLessonDate =
      lessonDates.sort(
        (
          firstDate,
          secondDate
        ) => {
          return (
            secondDate.getTime() -
            firstDate.getTime()
          );
        }
      )[0];

    visibleMonth =
      new Date(
        newestLessonDate.getFullYear(),
        newestLessonDate.getMonth(),
        1
      );
  }

  function loadLessons() {
    const teacher =
      readTeacherProfile();

    showLoadingMessage();

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
              : "The Library could not be loaded."
          );

          delete window[
            callbackName
          ];

          return;
        }

        allLessons =
          sortLessonsNewestFirst(
            response.lessons || []
          );

        window.patriotLibraryLessons =
          allLessons.slice();

        setInitialCalendarMonth();

        renderCalendar();

        displayLessons(
          allLessons
        );

        delete window[
          callbackName
        ];
      };

    const script =
      document.createElement(
        "script"
      );

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

    script.onerror =
      function () {
        showError(
          "Patriot Command could not reach the Google lesson archive."
        );

        delete window[
          callbackName
        ];
      };

    document.body.appendChild(
      script
    );
  }

  /*
  ==========================================
  STARTUP
  ==========================================
  */

  function startLessonLibrary() {
    connectCalendarControls();

    renderCalendar();

    loadLessons();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startLessonLibrary
    );
  } else {
    startLessonLibrary();
  }
})();
