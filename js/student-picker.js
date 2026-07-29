(function () {
  "use strict";

  const STORAGE_KEY = "patriotStudentPickerRoster";
  const WIDGET_ID = "student-picker-widget";
  const MODAL_ID = "student-picker-modal";

  let roster = [];

  function readRoster() {
    try {
      const savedRoster = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(savedRoster)
        ? savedRoster.filter(Boolean)
        : [];
    } catch (error) {
      console.error(
        "The saved student roster could not be read.",
        error
      );

      return [];
    }
  }

  function saveRoster(names) {
    roster = names;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(roster)
    );
  }

  function addStyles() {
    if (
      document.getElementById(
        "student-picker-styles"
      )
    ) {
      return;
    }

    const styles =
      document.createElement("style");

    styles.id = "student-picker-styles";

    styles.textContent = `
      #${WIDGET_ID} {
        text-align: center;
      }

      #${WIDGET_ID}[hidden] {
        display: none;
      }

      .student-picker-result {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 95px;
        margin: 14px 0;
        padding: 16px;
        color: var(--navy, #11284a);
        font-size: clamp(1.4rem, 2.6vw, 2.2rem);
        font-weight: bold;
        background: var(--cream, #f7f2e8);
        border: 3px solid var(--gold, #d3a84f);
        border-radius: 12px;
      }

      .student-picker-result.empty {
        color: #777777;
        font-size: 1rem;
        font-style: italic;
        font-weight: normal;
      }

      .student-picker-buttons {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .student-picker-button {
        padding: 11px 14px;
        color: #ffffff;
        font-weight: bold;
        background: var(--red, #b3262e);
        border: 0;
        border-radius: 8px;
      }

      .student-picker-button.secondary {
        background: var(--navy, #11284a);
      }

      .student-picker-button:hover {
        filter: brightness(1.07);
      }

      .student-picker-count {
        margin: 10px 0 0;
        color: #666666;
        font-size: 0.85rem;
      }

      .student-picker-modal {
        position: fixed;
        inset: 0;
        z-index: 1600;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.58);
      }

      .student-picker-modal.open {
        display: flex;
      }

      .student-picker-dialog {
        width: min(520px, 100%);
        max-height: 90vh;
        padding: 24px;
        overflow-y: auto;
        color: var(--navy, #11284a);
        background: var(--cream, #f7f2e8);
        border-radius: 14px;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
      }

      .student-picker-dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 3px solid var(--gold, #d3a84f);
      }

      .student-picker-dialog-header h2 {
        margin: 0;
        color: var(--red, #b3262e);
      }

      .student-picker-close {
        width: 38px;
        height: 38px;
        padding: 0;
        color: #ffffff;
        font-size: 1.4rem;
        background: var(--navy, #11284a);
        border: 0;
        border-radius: 50%;
      }

      .student-picker-instructions {
        margin: 0 0 12px;
        line-height: 1.45;
      }

      .student-picker-textarea {
        width: 100%;
        min-height: 300px;
        padding: 12px;
        color: var(--navy, #11284a);
        background: #ffffff;
        border: 2px solid #d8d8d8;
        border-radius: 8px;
        resize: vertical;
      }

      .student-picker-modal-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 15px;
      }

      .student-picker-save {
        padding: 12px;
        color: #ffffff;
        font-weight: bold;
        background: var(--green, #2f7d4a);
        border: 0;
        border-radius: 8px;
      }

      .student-picker-cancel {
        padding: 12px;
        color: #ffffff;
        font-weight: bold;
        background: var(--navy, #11284a);
        border: 0;
        border-radius: 8px;
      }
    `;

    document.head.appendChild(styles);
  }

  function createWidget() {
    if (document.getElementById(WIDGET_ID)) {
      return;
    }

    const rightColumn =
      document.querySelector(".right-column");

    if (!rightColumn) {
      console.warn(
        "The Student Picker could not find the right classroom column."
      );

      return;
    }

    const widget =
      document.createElement("section");

    widget.id = WIDGET_ID;
    widget.className = "card";
    widget.hidden = true;

    widget.innerHTML = `
      <h2>🎲 Student Picker</h2>

      <div
        id="student-picker-result"
        class="student-picker-result empty"
        aria-live="polite"
      >
        No student selected
      </div>

      <div class="student-picker-buttons">
        <button
          id="student-picker-pick-button"
          class="student-picker-button"
          type="button"
        >
          Pick Student
        </button>

        <button
          id="student-picker-edit-button"
          class="student-picker-button secondary"
          type="button"
        >
          Edit Roster
        </button>
      </div>

      <p
        id="student-picker-count"
        class="student-picker-count"
      ></p>
    `;

    rightColumn.appendChild(widget);

    document
      .getElementById("student-picker-pick-button")
      .addEventListener("click", pickStudent);

    document
      .getElementById("student-picker-edit-button")
      .addEventListener("click", openRosterEditor);

    updateRosterCount();
  }

  function createModal() {
    if (document.getElementById(MODAL_ID)) {
      return;
    }

    const modal =
      document.createElement("div");

    modal.id = MODAL_ID;
    modal.className = "student-picker-modal";

    modal.innerHTML = `
      <div
        class="student-picker-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-picker-modal-title"
      >
        <div class="student-picker-dialog-header">
          <h2 id="student-picker-modal-title">
            Edit Student Roster
          </h2>

          <button
            id="student-picker-close-button"
            class="student-picker-close"
            type="button"
            aria-label="Close roster editor"
          >
            ×
          </button>
        </div>

        <p class="student-picker-instructions">
          Enter or paste one student name on each line.
        </p>

        <textarea
          id="student-picker-roster-input"
          class="student-picker-textarea"
          placeholder="Abby Smith&#10;Ben Jones&#10;Claire Wilson"
        ></textarea>

        <div class="student-picker-modal-buttons">
          <button
            id="student-picker-save-button"
            class="student-picker-save"
            type="button"
          >
            Save Roster
          </button>

          <button
            id="student-picker-cancel-button"
            class="student-picker-cancel"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document
      .getElementById("student-picker-save-button")
      .addEventListener("click", saveRosterFromEditor);

    document
      .getElementById("student-picker-cancel-button")
      .addEventListener("click", closeRosterEditor);

    document
      .getElementById("student-picker-close-button")
      .addEventListener("click", closeRosterEditor);

    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeRosterEditor();
      }
    });
  }

  function updateRosterCount() {
    const countDisplay =
      document.getElementById(
        "student-picker-count"
      );

    if (!countDisplay) {
      return;
    }

    if (roster.length === 0) {
      countDisplay.textContent =
        "No roster saved";
      return;
    }

    const studentWord =
      roster.length === 1
        ? "student"
        : "students";

    countDisplay.textContent =
      `${roster.length} ${studentWord} saved`;
  }

  function pickStudent() {
    const result =
      document.getElementById(
        "student-picker-result"
      );

    if (roster.length === 0) {
      result.textContent =
        "Add a roster first";

      result.classList.add("empty");
      openRosterEditor();
      return;
    }

    const randomIndex =
      Math.floor(Math.random() * roster.length);

    result.textContent =
      roster[randomIndex];

    result.classList.remove("empty");
  }

  function openRosterEditor() {
    const modal =
      document.getElementById(MODAL_ID);

    const rosterInput =
      document.getElementById(
        "student-picker-roster-input"
      );

    rosterInput.value =
      roster.join("\n");

    modal.classList.add("open");
    rosterInput.focus();
  }

  function closeRosterEditor() {
    document
      .getElementById(MODAL_ID)
      .classList.remove("open");
  }

  function saveRosterFromEditor() {
    const rosterText =
      document.getElementById(
        "student-picker-roster-input"
      ).value;

    const names = rosterText
      .split("\n")
      .map(name => name.trim())
      .filter(Boolean);

    saveRoster(names);
    updateRosterCount();
    closeRosterEditor();

    const result =
      document.getElementById(
        "student-picker-result"
      );

    result.textContent =
      names.length > 0
        ? "Roster ready"
        : "No student selected";

    result.classList.add("empty");
  }

  function showWidget() {
    const widget =
      document.getElementById(WIDGET_ID);

    if (widget) {
      widget.hidden = false;
    }
  }

  function hideWidget() {
    const widget =
      document.getElementById(WIDGET_ID);

    if (widget) {
      widget.hidden = true;
    }
  }

  function toggleWidget(forceState) {
    const widget =
      document.getElementById(WIDGET_ID);

    if (!widget) {
      return;
    }

    if (typeof forceState === "boolean") {
      widget.hidden = !forceState;
      return;
    }

    widget.hidden = !widget.hidden;
  }

  function handleWidgetEvent(event) {
    const detail = event.detail || {};

    const widgetName =
      detail.widget ||
      detail.widgetId ||
      detail.name;

    if (
      widgetName !== "student-picker" &&
      widgetName !== "picker"
    ) {
      return;
    }

    if (typeof detail.enabled === "boolean") {
      toggleWidget(detail.enabled);
      return;
    }

    if (typeof detail.visible === "boolean") {
      toggleWidget(detail.visible);
      return;
    }

    toggleWidget();
  }

  function initialize() {
    roster = readRoster();

    addStyles();
    createWidget();
    createModal();

    document.addEventListener(
      "patriot:widget-change",
      handleWidgetEvent
    );

    document.addEventListener(
      "patriot:student-picker",
      () => toggleWidget()
    );

    window.PatriotStudentPicker = {
      show: showWidget,
      hide: hideWidget,
      toggle: toggleWidget,
      pick: pickStudent,
      editRoster: openRosterEditor
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();
