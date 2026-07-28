/*
==========================================
PATRIOT COMMAND
Load Duplicate or Editable Lesson
==========================================
*/

(function () {
  const DUPLICATE_LESSON_KEY =
    "patriotDuplicateLesson";

  const EDIT_LESSON_KEY =
    "patriotEditLesson";

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

  function getPlannerMode() {
    const parameters =
      new URLSearchParams(
        window.location.search
      );

    const mode =
      parameters.get("mode");

    if (
      mode === "edit" ||
      mode === "duplicate"
    ) {
      return mode;
    }

    return "";
  }

  function readStoredLesson(key) {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "The selected lesson could not be read.",
        error
      );

      return null;
    }
  }

  function getSelectedLesson(mode) {
    if (mode === "edit") {
      return readStoredLesson(
        EDIT_LESSON_KEY
      );
    }

    if (mode === "duplicate") {
      return readStoredLesson(
        DUPLICATE_LESSON_KEY
      );
    }

    return null;
  }

  function normalizeDate(value) {
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

  function setValue(id, value) {
    const field =
      document.getElementById(id);

    if (!field) {
      return;
    }

    field.value =
      value || "";
  }

  function chooseOptionByText(
    select,
    text
  ) {
    if (!select || !text) {
      return;
    }

    const requestedText =
      String(text)
        .trim()
        .toLowerCase();

    const matchingOption =
      Array.from(
        select.options
      ).find(option => {
        return (
          option.textContent
            .trim()
            .toLowerCase() ===
          requestedText
        );
      });

    if (matchingOption) {
      select.value =
        matchingOption.value;
    }
  }

  function parsePeriods(value) {
    if (Array.isArray(value)) {
      return value
        .map(item =>
          String(item).trim()
        )
        .filter(Boolean);
    }

    return String(value || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  }

  function selectClasses(periodValue) {
    const periods =
      parsePeriods(periodValue);

    document
      .querySelectorAll(
        'input[name="planner-class"]'
      )
      .forEach(checkbox => {
        checkbox.checked =
          periods.includes(
            checkbox.value
          );
      });
  }

  function waitForClasses(
    periodValue,
    attempts = 0
  ) {
    const checkboxes =
      document.querySelectorAll(
        'input[name="planner-class"]'
      );

    if (checkboxes.length > 0) {
      selectClasses(periodValue);
      return;
    }

    if (attempts >= 40) {
      console.warn(
        "Planner class options were not ready."
      );

      return;
    }

    setTimeout(() => {
      waitForClasses(
        periodValue,
        attempts + 1
      );
    }, 100);
  }

  function parseResources(value) {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    try {
      const parsed =
        JSON.parse(value);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      return [];
    }
  }

  function clearResourceRows() {
    const rows =
      document.querySelectorAll(
        "#resource-list .resource-row"
      );

    rows.forEach(
      (row, index) => {
        if (index > 0) {
          row.remove();
        }
      }
    );

    const firstRow =
      document.querySelector(
        "#resource-list .resource-row"
      );

    if (!firstRow) {
      return;
    }

    const type =
      firstRow.querySelector(
        ".resource-type"
      );

    const url =
      firstRow.querySelector(
        ".resource-url"
      );

    if (type) {
      type.value = "slides";
    }

    if (url) {
      url.value = "";
    }
  }

  function fillResources(resourceValue) {
    const resources =
      parseResources(
        resourceValue
      );

    const list =
      document.getElementById(
        "resource-list"
      );

    const addButton =
      document.getElementById(
        "add-resource-button"
      );

    if (!list || !addButton) {
      return;
    }

    clearResourceRows();

    if (!resources.length) {
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
        "planner-mode-banner-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "planner-mode-banner-styles";

    style.textContent = `
      .planner-mode-banner {
        width: min(1100px, 94%);
        margin: 24px auto 0;
        padding: 20px 24px;
        border-radius: 12px;
        box-shadow:
          0 5px 14px
          rgba(0, 0, 0, 0.10);
      }

      .planner-mode-banner h2 {
        margin: 0 0 10px;
        font-size: 1.25rem;
      }

      .planner-mode-banner p {
        margin: 0;
        line-height: 1.55;
        font-weight: bold;
      }

      .planner-mode-banner.duplicate {
        color: #244f31;
        background: #e7f5eb;
        border: 2px solid #4d8256;
      }

      .planner-mode-banner.duplicate h2 {
        color: #2f6c40;
      }

      .planner-mode-banner.edit {
        color: #11284a;
        background: #fff0cf;
        border: 2px solid #d3a84f;
      }

      .planner-mode-banner.edit h2 {
        color: #aa3235;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function showModeBanner(mode) {
    const existing =
      document.getElementById(
        "planner-mode-banner"
      );

    if (existing) {
      existing.remove();
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
      "planner-mode-banner";

    banner.className =
      `planner-mode-banner ${mode}`;

    banner.setAttribute(
      "role",
      "status"
    );

    if (mode === "edit") {
      banner.innerHTML = `
        <h2>
          Editing an existing lesson
        </h2>

        <p>
          Make your changes below.
          Saving will update this lesson
          rather than create a duplicate.
        </p>
      `;
    } else {
      banner.innerHTML = `
        <h2>
          Lesson duplicated
        </h2>

        <p>
          Choose a new date and class,
          make any changes, and save this
          as a new lesson.
        </p>
      `;
    }

    header.insertAdjacentElement(
      "afterend",
      banner
    );
  }

  function updateSaveButton(mode) {
    const saveButton =
      document.querySelector(
        ".save-button"
      );

    if (!saveButton) {
      return;
    }

    saveButton.textContent =
      mode === "edit"
        ? "Update Lesson"
        : "Save New Lesson";
  }

  function hideOldStatus() {
    const status =
      document.getElementById(
        "planner-status"
      );

    if (status) {
      status.style.display =
        "none";
    }
  }

  function fillLessonForm(
    lesson,
    mode
  ) {
    const lessonDate =
      mode === "duplicate"
        ? getTodayText()
        : normalizeDate(
            lesson.lessonDate
          );

    setValue(
      "lesson-date",
      lessonDate
    );

    setValue(
      "lesson-title",
      lesson.lessonTitle ||
      lesson.course ||
      (
        mode === "duplicate"
          ? "Copied Lesson"
          : "Lesson"
      )
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
      lesson.periods ||
      lesson.assignedPeriods
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

    setTimeout(() => {
      const focusSelect =
        document.getElementById(
          "profile-focus"
        );

      chooseOptionByText(
        focusSelect,
        lesson.profileFocus
      );
    }, 100);

    fillResources(
      lesson.lessonResources ||
      lesson.resources
    );

    hideOldStatus();
    showModeBanner(mode);
    updateSaveButton(mode);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function loadPlannerMode() {
    const mode =
      getPlannerMode();

    if (!mode) {
      return;
    }

    const lesson =
      getSelectedLesson(mode);

    if (!lesson) {
      console.warn(
        "No lesson was available for this Planner mode."
      );

      return;
    }

    fillLessonForm(
      lesson,
      mode
    );
  }

  function startPlannerMode() {
    addBannerStyles();

    setTimeout(
      loadPlannerMode,
      250
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startPlannerMode
    );
  } else {
    startPlannerMode();
  }
})();
