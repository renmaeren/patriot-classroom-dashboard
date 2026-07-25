/*
==========================================
PATRIOT COMMAND
Duplicate Lesson into Planner
==========================================
*/

(function () {
  const DUPLICATE_LESSON_KEY =
    "patriotDuplicateLesson";

  function getTodayText() {
    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function readDuplicateLesson() {
    const saved =
      localStorage.getItem(
        DUPLICATE_LESSON_KEY
      );

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "Duplicated lesson could not be read.",
        error
      );

      return null;
    }
  }

  function setValue(id, value) {
    const field =
      document.getElementById(id);

    if (field) {
      field.value =
        value || "";
    }
  }

  function chooseOptionByText(
    select,
    text
  ) {
    if (!select || !text) {
      return;
    }

    const matchingOption =
      Array.from(
        select.options
      ).find(
        option =>
          option.textContent
            .trim()
            .toLowerCase() ===
          String(text)
            .trim()
            .toLowerCase()
      );

    if (matchingOption) {
      select.value =
        matchingOption.value;
    }
  }

  function selectClasses(periodText) {
    const periods =
      String(periodText || "")
        .split(",")
        .map(
          period =>
            period.trim()
        )
        .filter(Boolean);

    document
      .querySelectorAll(
        'input[name="planner-class"]'
      )
      .forEach(
        checkbox => {
          checkbox.checked =
            periods.includes(
              checkbox.value
            );
        }
      );
  }

  function waitForClasses(
    periodText,
    attempts = 0
  ) {
    const classCheckboxes =
      document.querySelectorAll(
        'input[name="planner-class"]'
      );

    if (
      classCheckboxes.length > 0
    ) {
      selectClasses(
        periodText
      );

      return;
    }

    if (attempts < 30) {
      setTimeout(
        () => {
          waitForClasses(
            periodText,
            attempts + 1
          );
        },
        100
      );
    }
  }

  function parseResources(value) {
    if (!value) {
      return [];
    }

    try {
      const resources =
        JSON.parse(value);

      return Array.isArray(
        resources
      )
        ? resources
        : [];
    } catch (error) {
      return [];
    }
  }

  function fillResources(
    resourceText
  ) {
    const resources =
      parseResources(
        resourceText
      );

    if (!resources.length) {
      return;
    }

    const list =
      document.getElementById(
        "resource-list"
      );

    const addButton =
      document.getElementById(
        "add-resource-button"
      );

    if (
      !list ||
      !addButton
    ) {
      return;
    }

    resources.forEach(
      (resource, index) => {
        let rows =
          list.querySelectorAll(
            ".resource-row"
          );

        if (
          index > 0 &&
          rows.length <= index
        ) {
          addButton.click();

          rows =
            list.querySelectorAll(
              ".resource-row"
            );
        }

        const row =
          rows[index];

        if (!row) {
          return;
        }

        const type =
          row.querySelector(
            ".resource-type"
          );

        const url =
          row.querySelector(
            ".resource-url"
          );

        if (type) {
          type.value =
            resource.type ||
            "other";
        }

        if (url) {
          url.value =
            resource.url || "";
        }
      }
    );
  }

  function addBannerStyles() {
    if (
      document.getElementById(
        "duplicate-banner-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "duplicate-banner-styles";

    style.textContent = `
      .duplicate-banner {
        width: min(1100px, 94%);
        margin: 24px auto 0;
        padding: 20px 24px;
        color: #244f31;
        background: #e7f5eb;
        border: 2px solid #4d8256;
        border-radius: 12px;
        box-shadow: 0 5px 14px rgba(0, 0, 0, 0.10);
      }

      .duplicate-banner h2 {
        margin: 0 0 12px;
        color: #2f6c40;
        font-size: 1.25rem;
      }

      .duplicate-banner ol {
        margin: 0;
        padding-left: 26px;
        line-height: 1.65;
        font-weight: bold;
      }

      .duplicate-banner li {
        padding-left: 4px;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function showDuplicateBanner() {
    if (
      document.getElementById(
        "duplicate-banner"
      )
    ) {
      return;
    }

    const header =
      document.querySelector(
        ".planner-header"
      );

    if (!header) {
      return;
    }

    const banner =
      document.createElement(
        "section"
      );

    banner.id =
      "duplicate-banner";

    banner.className =
      "duplicate-banner";

    banner.setAttribute(
      "role",
      "status"
    );

    banner.innerHTML = `
      <h2>
        Lesson duplicated. Make it your own:
      </h2>

      <ol>
        <li>
          Choose a new date.
        </li>

        <li>
          Select your class(es).
        </li>

        <li>
          Make any changes.
        </li>

        <li>
          Save as a new lesson.
        </li>
      </ol>
    `;

    header.insertAdjacentElement(
      "afterend",
      banner
    );
  }

  function hideOldBottomMessage() {
    const oldStatus =
      document.getElementById(
        "planner-status"
      );

    if (oldStatus) {
      oldStatus.style.display =
        "none";
    }
  }

  function fillDuplicateLesson() {
    const parameters =
      new URLSearchParams(
        window.location.search
      );

    if (
      parameters.get("mode") !==
      "duplicate"
    ) {
      return;
    }

    const lesson =
      readDuplicateLesson();

    if (!lesson) {
      return;
    }

    setValue(
      "lesson-date",
      getTodayText()
    );

    setValue(
      "lesson-title",
      lesson.lessonTitle ||
      lesson.course ||
      "Copied Lesson"
    );

    setValue(
      "bell-ringer",
      lesson.bellRinger
    );

    setValue(
      "agenda",
      lesson.agenda
    );

    setValue(
      "learning-target",
      lesson.learningTarget
    );

    setValue(
      "standards",
      lesson.standards
    );

    setValue(
      "success-criteria",
      lesson.successCriteria
    );

    setValue(
      "why-learning",
      lesson.whyLearning
    );

    setValue(
      "materials",
      lesson.materials
    );

    setValue(
      "teacher-notes",
      lesson.teacherNotes
    );

    waitForClasses(
      lesson.periods
    );

    const componentSelect =
      document.getElementById(
        "profile-component"
      );

    chooseOptionByText(
      componentSelect,
      lesson.profileComponent
    );

    if (componentSelect) {
      componentSelect.dispatchEvent(
        new Event("change")
      );
    }

    const focusSelect =
      document.getElementById(
        "profile-focus"
      );

    chooseOptionByText(
      focusSelect,
      lesson.profileFocus
    );

    fillResources(
      lesson.lessonResources
    );

    hideOldBottomMessage();
    showDuplicateBanner();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function startDuplicateLesson() {
    addBannerStyles();

    setTimeout(
      fillDuplicateLesson,
      200
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startDuplicateLesson
    );
  } else {
    startDuplicateLesson();
  }
})();
