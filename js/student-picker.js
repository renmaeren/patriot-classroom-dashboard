/*
==========================================
PATRIOT COMMAND
Student Picker Widget
==========================================

FEATURES:
- Uses saved teacher classes and rosters
- Remembers the active class
- Calls every student once per round
- Saves round progress by class
- Responds to the shared widget toolbar
- Matches the modern Teaching Tools panel
*/

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

  const WIDGET_SETTINGS_STORAGE_KEY =
    "patriotTeachWidgetPreferences";

  const WIDGET_ID =
    "student-picker-widget";

  const WIDGET_NAME =
    "picker";

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
    const savedValue =
      localStorage.getItem(storageKey);

    if (!savedValue) {
      return fallbackValue;
    }

    try {
      const parsedValue =
        JSON.parse(savedValue);

      return (
        parsedValue ??
        fallbackValue
      );
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

  function readInitialVisibility() {
    const settings =
      readStorage(
        WIDGET_SETTINGS_STORAGE_KEY,
        {}
      );

    return Boolean(
      settings &&
      settings[WIDGET_NAME]
    );
  }

  function saveActiveClass(
    classKey
  ) {
    if (classKey) {
      localStorage.setItem(
        ACTIVE_CLASS_STORAGE_KEY,
        classKey
      );
    } else {
      localStorage.removeItem(
        ACTIVE_CLASS_STORAGE_KEY
      );
    }

    document.dispatchEvent(
      new CustomEvent(
        "patriotActiveClassChange",
        {
          detail: {
            classKey
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
      !profile.classes ||
      typeof profile.classes !==
        "object"
    ) {
      return [];
    }

    return Object.entries(
      profile.classes
    )
      .filter(
        ([
          periodName,
          courseName
        ]) =>
          String(
            periodName || ""
          ).trim() &&
          String(
            courseName || ""
          ).trim()
      )
      .map(
        ([
          periodName,
          courseName
        ]) => ({
          key:
            String(
              periodName
            ).trim(),

          label:
            `${String(
              periodName
            ).trim()} — ` +
            String(
              courseName
            ).trim()
        })
      );
  }

  function getStudentDisplayName(
    student
  ) {
    if (!student) {
      return "";
    }

    const preferredName =
      String(
        student.preferredName ||
        ""
      ).trim();

    const firstName =
      preferredName ||
      String(
        student.firstName ||
        ""
      ).trim();

    const lastName =
      String(
        student.lastName ||
        ""
      ).trim();

    return [
      firstName,
      lastName
    ]
      .filter(Boolean)
      .join(" ");
  }

  function getStudentId(
    student,
    index
  ) {
    if (
      student.id !== undefined &&
      student.id !== null &&
      String(student.id).trim()
    ) {
      return String(student.id);
    }

    return (
      `${selectedClassKey}-` +
      `${index}-` +
      getStudentDisplayName(student)
    );
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
      savedRoster
        .filter(
          student =>
            student &&
            student.active !== false &&
            getStudentDisplayName(
              student
            )
        )
        .map(
          (
            student,
            index
          ) => ({
            ...student,
            id:
              getStudentId(
                student,
                index
              )
          })
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
      student =>
        String(student.id)
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

    const savedRound =
      roundData[
        selectedClassKey
      ];

    const savedIds =
      Array.isArray(savedRound)
        ? savedRound.map(String)
        : [];

    remainingStudentIds =
      savedIds.filter(
        studentId =>
          validIds.has(
            studentId
          )
      );

    if (
      !Array.isArray(savedRound) &&
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

    roundData[
      selectedClassKey
    ] = [
      ...remainingStudentIds
    ];

    saveRoundData(
      roundData
    );
  }

  function setResult(
    message,
    isEmpty = true
  ) {
    const result =
      document.getElementById(
        "student-picker-result"
      );

    if (!result) {
      return;
    }

    result.textContent =
      message;

    result.classList.toggle(
      "empty",
      isEmpty
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

    setResult(
      "Round reset"
    );

    updateWidgetDisplay();
  }

  function pickStudent() {
    if (!selectedClassKey) {
      setResult(
        "Select a class first"
      );

      return;
    }

    if (
      roster.length === 0
    ) {
      setResult(
        "No saved roster for this class"
      );

      return;
    }

    if (
      remainingStudentIds.length ===
      0
    ) {
      setResult(
        "Everyone has been called"
      );

      updateWidgetDisplay();

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
          String(item.id) ===
          String(
            selectedStudentId
          )
      );

    setResult(
      student
        ? getStudentDisplayName(
            student
          )
        : "Student unavailable",
      false
    );

    updateWidgetDisplay();
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
        margin: 0;
        padding: 15px;
        text-align: left;
        background: transparent;
        border: 0;
        border-top:
          1px solid
          rgba(42, 67, 163, 0.12);
        border-radius: 0;
        box-shadow: none;
      }

      #${WIDGET_ID}[hidden] {
        display: none !important;
      }

      .student-picker-heading {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 12px;
        color:
          var(
            --patriot-red,
            #cf1b13
          );
        font-family:
          "Literata",
          Georgia,
          serif;
        font-size: 0.98rem;
        letter-spacing: -0.02em;
      }

      .student-picker-heading-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 27px;
        height: 27px;
        font-family:
          "Inter",
          "Segoe UI Emoji",
          sans-serif;
        font-size: 1rem;
        background:
          rgba(
            255,
            226,
            105,
            0.3
          );
        border-radius: 8px;
      }

      #${WIDGET_ID}
        .pc-widget-field {
        margin-bottom: 10px;
      }

      #${WIDGET_ID}
        .pc-widget-field label {
        display: block;
        margin-bottom: 5px;
        color:
          var(
            --patriot-text,
            #20283a
          );
        font-size: 0.74rem;
        font-weight: 750;
      }

      #${WIDGET_ID}
        .pc-widget-select {
        width: 100%;
        min-height: 39px;
        padding: 7px 34px 7px 10px;
        color:
          var(
            --patriot-text,
            #20283a
          );
        font-size: 0.79rem;
        background:
          rgba(
            255,
            255,
            255,
            0.82
          );
        border:
          1px solid
          rgba(
            42,
            67,
            163,
            0.17
          );
        border-radius: 9px;
        outline: none;
      }

      #${WIDGET_ID}
        .pc-widget-select:focus {
        border-color:
          var(
            --patriot-blue,
            #2a43a3
          );
        box-shadow:
          0 0 0 3px
          rgba(
            42,
            67,
            163,
            0.12
          );
      }

      .student-picker-result {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 78px;
        margin: 10px 0;
        padding: 12px;
        overflow-wrap: anywhere;
        color:
          var(
            --patriot-blue,
            #2a43a3
          );
        font-size:
          clamp(
            1.15rem,
            2.1vw,
            1.7rem
          );
        font-weight: 800;
        line-height: 1.15;
        text-align: center;
        background:
          rgba(
            255,
            252,
            233,
            0.72
          );
        border:
          2px solid
          rgba(
            255,
            226,
            105,
            0.95
          );
        border-radius: 12px;
      }

      .student-picker-result.empty {
        color: #777f8e;
        font-size: 0.86rem;
        font-style: italic;
        font-weight: 500;
      }

      #${WIDGET_ID}
        .pc-widget-button-row {
        display: grid;
        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
        gap: 7px;
      }

      #${WIDGET_ID}
        .pc-widget-button {
        min-width: 0;
        min-height: 39px;
        padding: 7px 8px;
        color: #ffffff;
        font-size: 0.75rem;
        font-weight: 750;
        line-height: 1.15;
        background:
          var(
            --patriot-red,
            #cf1b13
          );
        border: 0;
        border-radius: 9px;
        transition:
          transform 180ms ease,
          filter 180ms ease,
          box-shadow 180ms ease;
      }

      #${WIDGET_ID}
        .pc-widget-button.secondary {
        background:
          var(
            --patriot-blue,
            #2a43a3
          );
      }

      #${WIDGET_ID}
        .pc-widget-button:hover:not(
          :disabled
        ) {
        filter: brightness(1.06);
        box-shadow:
          0 5px 12px
          rgba(
            42,
            67,
            163,
            0.15
          );
        transform:
          translateY(-1px);
      }

      #${WIDGET_ID}
        .pc-widget-button:disabled {
        opacity: 0.42;
        cursor: not-allowed;
      }

      .student-picker-count {
        margin: 9px 0 0;
        color:
          var(
            --patriot-muted,
            #657087
          );
        font-size: 0.72rem;
        line-height: 1.35;
        text-align: center;
      }

      .student-picker-roster-link {
        display: block;
        width: fit-content;
        margin: 7px auto 0;
        color:
          var(
            --patriot-blue,
            #2a43a3
          );
        font-size: 0.72rem;
        font-weight: 750;
        text-align: center;
        text-decoration:
          underline;
        text-underline-offset: 2px;
      }

      .student-picker-roster-link:hover {
        color:
          var(
            --patriot-red,
            #cf1b13
          );
      }

      @media (
        max-width: 1180px
      ) {
        #${WIDGET_ID} {
          border-top: 0;
          border-left:
            1px solid
            rgba(
              42,
              67,
              163,
              0.12
            );
        }
      }

      @media (
        max-width: 820px
      ) {
        #${WIDGET_ID} {
          border-top:
            1px solid
            rgba(
              42,
              67,
              163,
              0.12
            );
          border-left: 0;
        }
      }
    `;

    document.head.appendChild(
      styles
    );
  }

  /*
  ==========================================
  WIDGET CREATION
  ==========================================
  */

  function getWidgetContainer() {
    return document.querySelector(
      ".right-column"
    );
  }

  function createWidget() {
    const existingWidget =
      document.getElementById(
        WIDGET_ID
      );

    if (existingWidget) {
      return existingWidget;
    }

    const container =
      getWidgetContainer();

    if (!container) {
      console.warn(
        "The Student Picker could not find the Teaching Tools container."
      );

      return null;
    }

    const widget =
      document.createElement(
        "section"
      );

    widget.id =
      WIDGET_ID;

    widget.dataset.patriotWidget =
      WIDGET_NAME;

    widget.hidden = true;

    widget.innerHTML = `
      <h2 class="student-picker-heading">
        <span
          class="student-picker-heading-icon"
          aria-hidden="true"
        >
          🎲
        </span>

        Student Picker
      </h2>

      <div class="pc-widget-field">
        <label
          for="student-picker-class-select"
        >
          Current Class
        </label>

        <select
          id="student-picker-class-select"
          class="pc-widget-select"
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

      <div class="pc-widget-button-row">
        <button
          id="student-picker-pick-button"
          class="pc-widget-button"
          type="button"
          disabled
        >
          Pick Student
        </button>

        <button
          id="student-picker-reset-button"
          class="pc-widget-button secondary"
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

    container.appendChild(
      widget
    );

    connectWidgetEvents();

    return widget;
  }

  function connectWidgetEvents() {
    const classSelector =
      document.getElementById(
        "student-picker-class-select"
      );

    const pickButton =
      document.getElementById(
        "student-picker-pick-button"
      );

    const resetButton =
      document.getElementById(
        "student-picker-reset-button"
      );

    if (classSelector) {
      classSelector.addEventListener(
        "change",
        handleClassChange
      );
    }

    if (pickButton) {
      pickButton.addEventListener(
        "click",
        pickStudent
      );
    }

    if (resetButton) {
      resetButton.addEventListener(
        "click",
        resetRound
      );
    }
  }

  /*
  ==========================================
  CLASS SELECTOR
  ==========================================
  */

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
      selectedClassKey =
        savedClass;

      classSelector.value =
        savedClass;

      loadRosterForClass(
        selectedClassKey
      );

      setResult(
        "Ready to pick"
      );
    } else {
      selectedClassKey = "";
      roster = [];
      remainingStudentIds = [];

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

    if (!selectedClassKey) {
      roster = [];
      remainingStudentIds = [];

      setResult(
        "Select a class"
      );

      updateWidgetDisplay();

      return;
    }

    loadRosterForClass(
      selectedClassKey
    );

    setResult(
      roster.length > 0
        ? "Ready to pick"
        : "No saved roster for this class"
    );
  }

  /*
  ==========================================
  DISPLAY UPDATES
  ==========================================
  */

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
      Boolean(
        selectedClassKey &&
        roster.length > 0
      );

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

    if (
      roster.length === 0
    ) {
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

  function setWidgetVisibility(
    enabled
  ) {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (!widget) {
      return;
    }

    widget.hidden =
      !Boolean(enabled);
  }

  function showWidget() {
    setWidgetVisibility(
      true
    );
  }

  function hideWidget() {
    setWidgetVisibility(
      false
    );
  }

  function handleWidgetChange(
    event
  ) {
    const detail =
      event.detail || {};

    if (
      detail.widgetId !==
      WIDGET_NAME
    ) {
      return;
    }

    setWidgetVisibility(
      detail.enabled
    );
  }

  /*
  ==========================================
  DATA REFRESH
  ==========================================
  */

  function refreshWidgetData() {
    populateClassSelector();
  }

  function handleStorageChange(
    event
  ) {
    if (
      event.key ===
        PROFILE_STORAGE_KEY ||
      event.key ===
        ROSTER_STORAGE_KEY ||
      event.key ===
        ACTIVE_CLASS_STORAGE_KEY
    ) {
      refreshWidgetData();
    }

    if (
      event.key ===
      WIDGET_SETTINGS_STORAGE_KEY
    ) {
      setWidgetVisibility(
        readInitialVisibility()
      );
    }
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
    resetRound,
    refresh:
      refreshWidgetData,

    toggle() {
      const widget =
        document.getElementById(
          WIDGET_ID
        );

      if (!widget) {
        return;
      }

      setWidgetVisibility(
        widget.hidden
      );
    }
  };

  /*
  ==========================================
  START
  ==========================================
  */

  function initialize() {
    addStyles();

    const widget =
      createWidget();

    if (!widget) {
      return;
    }

    populateClassSelector();

    setWidgetVisibility(
      readInitialVisibility()
    );

    document.addEventListener(
      "patriotWidgetChange",
      handleWidgetChange
    );

    document.addEventListener(
      "patriotActiveClassChange",
      refreshWidgetData
    );

    window.addEventListener(
      "storage",
      handleStorageChange
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
