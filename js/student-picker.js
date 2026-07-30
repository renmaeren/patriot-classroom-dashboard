(function () {
  "use strict";

  const PROFILE_STORAGE_KEY =
    "patriotTeacherProfile";

  const ROSTER_STORAGE_KEY =
    "patriotStudentRosters";

  const ACTIVE_CLASS_STORAGE_KEY =
    "patriotActiveClass";

  const ROUND_STORAGE_KEY =
    "patriotStudentPickerRounds";

  const WIDGET_ID =
    "student-picker-widget";

  let selectedClassKey = "";
  let roster = [];
  let remainingStudentIds = [];

  /*
  ==========================================
  STORAGE
  ==========================================
  */

  function readStorage(
    storageKey,
    fallbackValue
  ) {
    const saved =
      localStorage.getItem(
        storageKey
      );

    if (!saved) {
      return fallbackValue;
    }

    try {
      const parsed =
        JSON.parse(saved);

      return parsed ?? fallbackValue;
    } catch (error) {
      console.error(
        `Could not read ${storageKey}.`,
        error
      );

      return fallbackValue;
    }
  }

  function readTeacherProfile() {
    return readStorage(
      PROFILE_STORAGE_KEY,
      null
    );
  }

  function readRosters() {
    return readStorage(
      ROSTER_STORAGE_KEY,
      {}
    );
  }

  function readRoundData() {
    return readStorage(
      ROUND_STORAGE_KEY,
      {}
    );
  }

  function saveRoundData(
    roundData
  ) {
    localStorage.setItem(
      ROUND_STORAGE_KEY,
      JSON.stringify(roundData)
    );
  }

  function saveActiveClass(
    classKey
  ) {
    localStorage.setItem(
      ACTIVE_CLASS_STORAGE_KEY,
      classKey
    );

    document.dispatchEvent(
      new CustomEvent(
        "patriotActiveClassChange",
        {
          detail: {
            classKey: classKey
          }
        }
      )
    );
  }

  /*
  ==========================================
  CLASS AND ROSTER DATA
  ==========================================
  */

  function getClassOptions() {
    const profile =
      readTeacherProfile();

    if (
      !profile ||
      !profile.classes
    ) {
      return [];
    }

    return Object.entries(
      profile.classes
    )
      .filter(
        ([periodName, courseName]) =>
          periodName &&
          String(
            courseName || ""
          ).trim()
      )
      .map(
        ([periodName, courseName]) => ({
          key: periodName,

          label:
            `${periodName} — ` +
            String(
              courseName
            ).trim()
        })
      );
  }

  function getStudentDisplayName(
    student
  ) {
    const preferredName =
      String(
        student.preferredName || ""
      ).trim();

    const firstName =
      preferredName ||
      String(
        student.firstName || ""
      ).trim();

    const lastName =
      String(
        student.lastName || ""
      ).trim();

    return [
      firstName,
      lastName
    ]
      .filter(Boolean)
      .join(" ");
  }

  function loadRosterForClass(
    classKey
  ) {
    const rosters =
      readRosters();

    const savedRoster =
      Array.isArray(
        rosters[classKey]
      )
        ? rosters[classKey]
        : [];

    roster =
      savedRoster.filter(
        student =>
          student &&
          student.active !== false &&
          getStudentDisplayName(
            student
          )
      );

    loadSavedRound();
    updateWidgetDisplay();
  }

  /*
  ==========================================
  FAIR PICKING ROUND
  ==========================================
  */

  function getValidStudentIds() {
    return roster.map(
      student => student.id
    );
  }

  function createFreshRound() {
    remainingStudentIds =
      getValidStudentIds();

    saveCurrentRound();
  }

  function loadSavedRound() {
    const validIds =
      new Set(
        getValidStudentIds()
      );

    const roundData =
      readRoundData();

    const savedIds =
      Array.isArray(
        roundData[selectedClassKey]
      )
        ? roundData[
            selectedClassKey
          ]
        : [];

    remainingStudentIds =
      savedIds.filter(
        studentId =>
          validIds.has(studentId)
      );

    const savedRoundWasMissing =
      !Array.isArray(
        roundData[selectedClassKey]
      );

    if (
      savedRoundWasMissing &&
      roster.length > 0
    ) {
      createFreshRound();
    }
  }

  function saveCurrentRound() {
    if (!selectedClassKey) {
      return;
    }

    const roundData =
      readRoundData();

    roundData[selectedClassKey] =
      [...remainingStudentIds];

    saveRoundData(
      roundData
    );
  }

  function resetRound() {
    if (
      !selectedClassKey ||
      roster.length === 0
    ) {
      return;
    }

    createFreshRound();

    const result =
      document.getElementById(
        "student-picker-result"
      );

    if (result) {
      result.textContent =
        "Round reset";

      result.classList.add(
        "empty"
      );
    }

    updateRoundCount();
  }

  function pickStudent() {
    const result =
      document.getElementById(
        "student-picker-result"
      );

    if (!result) {
      return;
    }

    if (!selectedClassKey) {
      result.textContent =
        "Select a class first";

      result.classList.add(
        "empty"
      );

      return;
    }

    if (roster.length === 0) {
      result.textContent =
        "No saved roster for this class";

      result.classList.add(
        "empty"
      );

      return;
    }

    if (
      remainingStudentIds.length === 0
    ) {
      result.textContent =
        "Everyone has been called";

      result.classList.add(
        "empty"
      );

      updateRoundCount();

      return;
    }

    const randomIndex =
      Math.floor(
        Math.random() *
        remainingStudentIds.length
      );

    const selectedStudentId =
      remainingStudentIds[
        randomIndex
      ];

    remainingStudentIds.splice(
      randomIndex,
      1
    );

    saveCurrentRound();

    const student =
      roster.find(
        item =>
          item.id ===
          selectedStudentId
      );

    result.textContent =
      student
        ? getStudentDisplayName(
            student
          )
        : "Student unavailable";

    result.classList.remove(
      "empty"
    );

    updateRoundCount();
  }

  /*
  ==========================================
  STYLES
  ==========================================
  */

  function addStyles() {
    if (
      document.getElementById(
        "student-picker-styles"
      )
    ) {
      return;
    }

    const styles =
      document.createElement(
        "style"
      );

    styles.id =
      "student-picker-styles";

    styles.textContent = `
      #${WIDGET_ID} {
        text-align: center;
      }

      #${WIDGET_ID}[hidden] {
        display: none;
      }

      .student-picker-class-group {
        margin-bottom: 12px;
        text-align: left;
      }

      .student-picker-class-group label {
        display: block;
        margin-bottom: 6px;
        color: var(--navy, #11284a);
        font-size: 0.86rem;
        font-weight: bold;
      }

      .student-picker-class-select {
        width: 100%;
        padding: 10px;
        color: var(--navy, #11284a);
        font: inherit;
        background: #ffffff;
        border: 2px solid #d7dce3;
        border-radius: 8px;
      }

      .student-picker-class-select:focus {
        outline: 3px solid
          rgba(211, 168, 79, 0.35);
        border-color:
          var(--gold, #d3a84f);
      }

      .student-picker-result {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 95px;
        margin: 14px 0;
        padding: 16px;
        color: var(--navy, #11284a);
        font-size: clamp(
          1.4rem,
          2.6vw,
          2.2rem
        );
        font-weight: bold;
        overflow-wrap: anywhere;
        background:
          var(--cream, #f7f2e8);
        border:
          3px solid
          var(--gold, #d3a84f);
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
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .student-picker-button {
        padding: 11px 14px;
        color: #ffffff;
        font-weight: bold;
        background:
          var(--red, #b3262e);
        border: 0;
        border-radius: 8px;
        cursor: pointer;
      }

      .student-picker-button.secondary {
        background:
          var(--navy, #11284a);
      }

      .student-picker-button:hover {
        filter: brightness(1.07);
      }

      .student-picker-button:disabled {
        color: #666666;
        background: #dddddd;
        cursor: not-allowed;
        filter: none;
      }

      .student-picker-button:focus-visible {
        outline:
          3px solid
          var(--gold, #d3a84f);
        outline-offset: 2px;
      }

      .student-picker-count {
        margin: 10px 0 0;
        color: #666666;
        font-size: 0.85rem;
        line-height: 1.4;
      }

      .student-picker-roster-link {
        display: inline-block;
        margin-top: 9px;
        color: var(--navy, #11284a);
        font-size: 0.82rem;
        font-weight: bold;
      }

      @media (max-width: 520px) {
        .student-picker-buttons {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(
      styles
    );
  }

  /*
  ==========================================
  WIDGET
  ==========================================
  */

  function createWidget() {
    if (
      document.getElementById(
        WIDGET_ID
      )
    ) {
      return;
    }

    const rightColumn =
      document.querySelector(
        ".right-column"
      );

    if (!rightColumn) {
      console.warn(
        "The Student Picker could not find the right classroom column."
      );

      return;
    }

    const widget =
      document.createElement(
        "section"
      );

    widget.id = WIDGET_ID;
    widget.className = "card";
    widget.hidden = true;

    widget.innerHTML = `
      <h2>🎲 Student Picker</h2>

      <div
        class="student-picker-class-group"
      >
        <label
          for="student-picker-class-select"
        >
          Current Class
        </label>

        <select
          id="student-picker-class-select"
          class="student-picker-class-select"
        >
          <option value="">
            Select a class
          </option>
        </select>
      </div>

      <div
        id="student-picker-result"
        class="student-picker-result empty"
        aria-live="polite"
      >
        Select a class
      </div>

      <div
        class="student-picker-buttons"
      >
        <button
          id="student-picker-pick-button"
          class="student-picker-button"
          type="button"
          disabled
        >
          Pick Student
        </button>

        <button
          id="student-picker-reset-button"
          class="student-picker-button secondary"
          type="button"
          disabled
        >
          Reset Round
        </button>
      </div>

      <p
        id="student-picker-count"
        class="student-picker-count"
      >
        No class selected
      </p>

      <a
        class="student-picker-roster-link"
        href="students.html"
      >
        Manage class rosters
      </a>
    `;

    rightColumn.appendChild(
      widget
    );

    document
      .getElementById(
        "student-picker-class-select"
      )
      .addEventListener(
        "change",
        handleClassChange
      );

    document
      .getElementById(
        "student-picker-pick-button"
      )
      .addEventListener(
        "click",
        pickStudent
      );

    document
      .getElementById(
        "student-picker-reset-button"
      )
      .addEventListener(
        "click",
        resetRound
      );
  }

  function populateClassSelector() {
    const classSelector =
      document.getElementById(
        "student-picker-class-select"
      );

    if (!classSelector) {
      return;
    }

    const classes =
      getClassOptions();

    classSelector.innerHTML = `
      <option value="">
        Select a class
      </option>
    `;

    classes.forEach(
      classInfo => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          classInfo.key;

        option.textContent =
          classInfo.label;

        classSelector.appendChild(
          option
        );
      }
    );

    const savedClass =
      localStorage.getItem(
        ACTIVE_CLASS_STORAGE_KEY
      ) || "";

    const savedClassExists =
      classes.some(
        classInfo =>
          classInfo.key ===
          savedClass
      );

    if (savedClassExists) {
      classSelector.value =
        savedClass;

      selectedClassKey =
        savedClass;

      loadRosterForClass(
        selectedClassKey
      );
    } else {
      updateWidgetDisplay();
    }
  }

  function handleClassChange(
    event
  ) {
    selectedClassKey =
      event.target.value;

    saveActiveClass(
      selectedClassKey
    );

    const result =
      document.getElementById(
        "student-picker-result"
      );

    if (result) {
      result.textContent =
        selectedClassKey
          ? "Ready to pick"
          : "Select a class";

      result.classList.add(
        "empty"
      );
    }

    if (!selectedClassKey) {
      roster = [];
      remainingStudentIds = [];

      updateWidgetDisplay();

      return;
    }

    loadRosterForClass(
      selectedClassKey
    );
  }

  function updateWidgetDisplay() {
    updateRoundCount();
    updateButtons();
  }

  function updateButtons() {
    const pickButton =
      document.getElementById(
        "student-picker-pick-button"
      );

    const resetButton =
      document.getElementById(
        "student-picker-reset-button"
      );

    const hasRoster =
      selectedClassKey &&
      roster.length > 0;

    if (pickButton) {
      pickButton.disabled =
        !hasRoster;
    }

    if (resetButton) {
      resetButton.disabled =
        !hasRoster;
    }
  }

  function updateRoundCount() {
    const countDisplay =
      document.getElementById(
        "student-picker-count"
      );

    if (!countDisplay) {
      return;
    }

    if (!selectedClassKey) {
      countDisplay.textContent =
        "No class selected";

      return;
    }

    if (roster.length === 0) {
      countDisplay.textContent =
        "No saved roster for this class";

      return;
    }

    const calledCount =
      roster.length -
      remainingStudentIds.length;

    countDisplay.textContent =
      `${calledCount} called · ` +
      `${remainingStudentIds.length} remaining · ` +
      `${roster.length} total`;
  }

  /*
  ==========================================
  VISIBILITY
  ==========================================
  */

  function showWidget() {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (widget) {
      widget.hidden = false;
    }
  }

  function hideWidget() {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (widget) {
      widget.hidden = true;
    }
  }

  function setWidgetVisibility(
    enabled
  ) {
    if (enabled) {
      showWidget();
    } else {
      hideWidget();
    }
  }

  function handlePickerChange(
    event
  ) {
    const enabled =
      Boolean(
        event.detail &&
        event.detail.enabled
      );

    setWidgetVisibility(
      enabled
    );
  }

  /*
  ==========================================
  PUBLIC ACCESS
  ==========================================
  */

  window.PatriotStudentPicker = {
    show: showWidget,
    hide: hideWidget,
    pick: pickStudent,
    resetRound: resetRound,

    toggle:
      function () {
        const widget =
          document.getElementById(
            WIDGET_ID
          );

        if (!widget) {
          return;
        }

        widget.hidden =
          !widget.hidden;
      }
  };

  /*
  ==========================================
  START
  ==========================================
  */

  function initialize() {
    addStyles();
    createWidget();
    populateClassSelector();

    document.addEventListener(
      "patriotPickerChange",
      handlePickerChange
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();
