/*
==========================================
PATRIOT COMMAND
Lesson Planner Page
==========================================
*/

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const PROFILE_STORAGE_KEY =
      "patriotTeacherProfile";

    const profileOptions =
      typeof profileOfAPatriotOptions !==
      "undefined"
        ? profileOfAPatriotOptions
        : [];

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

    function readTeacherProfile() {
      const saved =
        localStorage.getItem(
          PROFILE_STORAGE_KEY
        );

      if (!saved) {
        return {
          teacherName: "",
          teacherEmail: "",
          room: "",
          classes: {}
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
          teacherEmail: "",
          room: "",
          classes: {}
        };
      }
    }

    function setDefaultDate() {
      const dateInput =
        document.getElementById(
          "lesson-date"
        );

      if (
        dateInput &&
        !dateInput.value
      ) {
        dateInput.value =
          getTodayText();
      }
    }

    function loadTeacherClasses() {
      const container =
        document.getElementById(
          "planner-class-options"
        );

      if (!container) {
        return;
      }

      container.innerHTML = "";

      const profile =
        readTeacherProfile();

      const classes =
        Object.entries(
          profile.classes || {}
        ).filter(
          ([period, course]) =>
            period &&
            course &&
            String(course).trim()
        );

      if (classes.length === 0) {
        const message =
          document.createElement("p");

        message.innerHTML =
          'No classes are saved yet. ' +
          '<a href="settings.html">' +
          'Complete Teacher Settings' +
          "</a>.";

        container.appendChild(message);

        return;
      }

      classes.forEach(
        ([period, course]) => {
          const label =
            document.createElement(
              "label"
            );

          label.className =
            "class-choice";

          const checkbox =
            document.createElement(
              "input"
            );

          checkbox.type = "checkbox";
          checkbox.name =
            "planner-class";
          checkbox.value = period;
          checkbox.dataset.course =
            course;

          const text =
            document.createElement(
              "span"
            );

          text.textContent =
            `${period} — ${course}`;

          label.appendChild(checkbox);
          label.appendChild(text);

          container.appendChild(label);
        }
      );
    }

    function populateProfileComponents() {
      const componentSelect =
        document.getElementById(
          "profile-component"
        );

      if (!componentSelect) {
        return;
      }

      componentSelect.innerHTML = "";

      const placeholder =
        document.createElement(
          "option"
        );

      placeholder.value = "";
      placeholder.textContent =
        "Choose a component";

      componentSelect.appendChild(
        placeholder
      );

      profileOptions
        .filter(
          option =>
            option.id !== "none"
        )
        .forEach(option => {
          const choice =
            document.createElement(
              "option"
            );

          choice.value = option.id;
          choice.textContent =
            option.title;

          componentSelect.appendChild(
            choice
          );
        });
    }

    function findSelectedProfile() {
      const componentSelect =
        document.getElementById(
          "profile-component"
        );

      if (!componentSelect) {
        return null;
      }

      return (
        profileOptions.find(
          option =>
            option.id ===
            componentSelect.value
        ) || null
      );
    }

    function populateProfileFocus() {
      const focusSelect =
        document.getElementById(
          "profile-focus"
        );

      if (!focusSelect) {
        return;
      }

      focusSelect.innerHTML = "";

      const generalChoice =
        document.createElement(
          "option"
        );

      generalChoice.value = "";
      generalChoice.textContent =
        "Use the general component";

      focusSelect.appendChild(
        generalChoice
      );

      const selectedProfile =
        findSelectedProfile();

      if (!selectedProfile) {
        return;
      }

      (
        selectedProfile.statements || []
      ).forEach(statement => {
        const choice =
          document.createElement(
            "option"
          );

        choice.value = statement;
        choice.textContent =
          statement;

        focusSelect.appendChild(
          choice
        );
      });
    }

    function createResourceRow() {
      const row =
        document.createElement(
          "div"
        );

      row.className =
        "resource-row";

      row.innerHTML = `
        <select class="resource-type">
          <option value="slides">
            Google Slides
          </option>

          <option value="video">
            Video / YouTube
          </option>

          <option value="studysync">
            StudySync
          </option>

          <option value="document">
            Google Doc
          </option>

          <option value="canva">
            Canva
          </option>

          <option value="pdf">
            PDF
          </option>

          <option value="website">
            Website
          </option>

          <option value="other">
            Other
          </option>
        </select>

        <input
          class="resource-url"
          type="url"
          placeholder="Paste the complete https:// link"
        >

        <button
          class="remove-resource"
          type="button"
        >
          Remove
        </button>
      `;

      const removeButton =
        row.querySelector(
          ".remove-resource"
        );

      removeButton.addEventListener(
        "click",
        () => {
          const list =
            document.getElementById(
              "resource-list"
            );

          row.remove();

          if (
            list &&
            list.children.length === 0
          ) {
            list.appendChild(
              createResourceRow()
            );
          }
        }
      );

      return row;
    }

    function connectExistingResourceRow() {
      const existingRow =
        document.querySelector(
          ".resource-row"
        );

      if (!existingRow) {
        return;
      }

      const removeButton =
        existingRow.querySelector(
          ".remove-resource"
        );

      if (!removeButton) {
        return;
      }

      removeButton.addEventListener(
        "click",
        () => {
          const list =
            document.getElementById(
              "resource-list"
            );

          existingRow.remove();

          if (
            list &&
            list.children.length === 0
          ) {
            list.appendChild(
              createResourceRow()
            );
          }
        }
      );
    }

    function connectAddResourceButton() {
      const addButton =
        document.getElementById(
          "add-resource-button"
        );

      const list =
        document.getElementById(
          "resource-list"
        );

      if (!addButton || !list) {
        return;
      }

      addButton.addEventListener(
        "click",
        () => {
          list.appendChild(
            createResourceRow()
          );
        }
      );
    }

    function connectProfileDropdown() {
      const componentSelect =
        document.getElementById(
          "profile-component"
        );

      if (!componentSelect) {
        return;
      }

      componentSelect.addEventListener(
        "change",
        populateProfileFocus
      );
    }

    function connectPlannerButtons() {
      const planAnotherButton =
        document.getElementById(
          "plan-another-button"
        );

      const libraryButton =
        document.getElementById(
          "open-library-button"
        );

      if (planAnotherButton) {
        planAnotherButton.addEventListener(
          "click",
          () => {
            const confirmed =
              window.confirm(
                "Start planning another lesson? Your saved lesson will remain safely in the archive."
              );

            if (!confirmed) {
              return;
            }

            const form =
              document.getElementById(
                "lesson-planner-form"
              );

            if (form) {
              form.reset();
            }

            setDefaultDate();
            loadTeacherClasses();

            populateProfileComponents();
            populateProfileFocus();

            const resourceList =
              document.getElementById(
                "resource-list"
              );

            if (resourceList) {
              resourceList.innerHTML = "";
              resourceList.appendChild(
                createResourceRow()
              );
            }

            const status =
              document.getElementById(
                "planner-status"
              );

            if (status) {
              status.textContent =
                "Ready for your next lesson.";

              status.style.display =
                "block";
            }

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        );
      }

      if (libraryButton) {
  libraryButton.addEventListener(
    "click",
    () => {
      window.location.href =
        "library.html";
    }
  );
}

    setDefaultDate();
    loadTeacherClasses();

    populateProfileComponents();
    populateProfileFocus();

    connectProfileDropdown();

    connectExistingResourceRow();
    connectAddResourceButton();

    connectPlannerButtons();
  }
);
