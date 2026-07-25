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

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
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
      return null;
    }
  }

  function setValue(id, value) {
    const field =
      document.getElementById(id);

    if (field) {
      field.value = value || "";
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
      Array.from(select.options)
        .find(
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
        .map(period => period.trim())
        .filter(Boolean);

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

  function parseResources(value) {
    if (!value) {
      return [];
    }

    try {
      const resources =
        JSON.parse(value);

      return Array.isArray(resources)
        ? resources
        : [];
    } catch (error) {
      return [];
    }
  }

  function fillResources(resourceText) {
    const resources =
      parseResources(resourceText);

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

    if (!list || !addButton) {
      return;
    }

    const firstRow =
      list.querySelector(
        ".resource-row"
      );

    resources.forEach(
      (resource, index) => {
        let row = firstRow;

        if (index > 0) {
          addButton.click();

          const rows =
            list.querySelectorAll(
              ".resource-row"
            );

          row =
            rows[rows.length - 1];
        }

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
            resource.type || "other";
        }

        if (url) {
          url.value =
            resource.url || "";
        }
      }
    );
  }

  function showDuplicateMessage(
    lesson
  ) {
    const status =
      document.getElementById(
        "planner-status"
      );

    if (!status) {
      return;
    }

    status.textContent =
      "Lesson copied from your Library. Choose the new date and classes, make any changes, and click Save Lesson.";

    status.style.display = "block";
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

    selectClasses(
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

    showDuplicateMessage(lesson);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      fillDuplicateLesson
    );
  } else {
    fillDuplicateLesson();
  }
})();
