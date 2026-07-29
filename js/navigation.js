<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Student Picker | Patriot Command</title>

  <style>
    :root {
      --navy: #11284a;
      --red: #b3262e;
      --gold: #d3a84f;
      --green: #2f7d4a;
      --cream: #f7f2e8;
      --white: #ffffff;
      --light-blue: #e8edf3;
      --gray: #d7dce3;
      --dark-gray: #657184;
      --shadow: rgba(0, 0, 0, 0.16);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      color: var(--navy);
      font-family: Arial, Helvetica, sans-serif;
      background: var(--light-blue);
    }

    button,
    select {
      font: inherit;
    }

    header {
      padding: 24px 30px;
      color: var(--white);
      background: var(--navy);
      border-bottom: 7px solid var(--red);
    }

    .header-inner {
      width: min(1100px, 94%);
      margin: auto;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 5vw, 3.5rem);
    }

    .subtitle {
      margin: 8px 0 0;
      color: var(--gold);
      font-weight: bold;
      line-height: 1.5;
    }

    main {
      width: min(1100px, 94%);
      margin: 26px auto;
    }

    .card {
      margin-bottom: 22px;
      padding: 24px;
      background: var(--white);
      border-radius: 16px;
      box-shadow: 0 7px 20px var(--shadow);
    }

    .card h2 {
      margin: 0 0 18px;
      padding-bottom: 10px;
      color: var(--red);
      border-bottom: 3px solid var(--gold);
    }

    .instructions {
      margin: 0 0 20px;
      padding: 14px;
      line-height: 1.5;
      background: var(--cream);
      border-left: 5px solid var(--gold);
      border-radius: 8px;
    }

    .warning {
      display: none;
      margin-bottom: 18px;
      padding: 14px;
      color: #713b00;
      line-height: 1.5;
      background: #fff0cf;
      border: 2px solid #d6a23d;
      border-radius: 9px;
    }

    .warning.show {
      display: block;
    }

    .form-group label {
      display: block;
      margin-bottom: 7px;
      font-weight: bold;
    }

    .form-group select {
      width: 100%;
      padding: 11px;
      color: var(--navy);
      background: var(--white);
      border: 2px solid var(--gray);
      border-radius: 8px;
    }

    .form-group select:focus {
      outline: 3px solid rgba(211, 168, 79, 0.35);
      border-color: var(--gold);
    }

    .picker-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.8fr);
      gap: 22px;
      align-items: start;
    }

    .picker-panel {
      min-height: 420px;
      padding: 28px;
      text-align: center;
      background: var(--cream);
      border: 3px solid var(--navy);
      border-radius: 16px;
    }

    .picker-label {
      margin: 0 0 12px;
      color: var(--dark-gray);
      font-size: 0.9rem;
      font-weight: bold;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .picked-name {
      display: grid;
      min-height: 180px;
      margin-bottom: 22px;
      padding: 24px;
      place-items: center;
      color: var(--navy);
      font-size: clamp(2rem, 6vw, 4.5rem);
      font-weight: bold;
      line-height: 1.1;
      background: var(--white);
      border: 4px solid var(--gold);
      border-radius: 16px;
      box-shadow: 0 5px 14px var(--shadow);
    }

    .picked-name.empty {
      color: var(--dark-gray);
      font-size: clamp(1.4rem, 4vw, 2.2rem);
      border-color: var(--gray);
    }

    .button {
      display: inline-block;
      padding: 13px 18px;
      color: var(--white);
      text-align: center;
      font-weight: bold;
      text-decoration: none;
      border: 0;
      border-radius: 9px;
      cursor: pointer;
    }

    .button:hover {
      filter: brightness(1.08);
    }

    .button-primary {
      min-width: 220px;
      font-size: 1.15rem;
      background: var(--navy);
    }

    .button-secondary {
      color: var(--navy);
      background: var(--gray);
    }

    .button-danger {
      background: var(--red);
    }

    .button:disabled {
      color: #666666;
      background: #dddddd;
      cursor: not-allowed;
      filter: none;
    }

    .button-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .progress-section {
      margin-top: 24px;
    }

    .progress-text {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
      color: var(--dark-gray);
      font-size: 0.92rem;
      font-weight: bold;
    }

    .progress-track {
      height: 16px;
      overflow: hidden;
      background: var(--gray);
      border-radius: 999px;
    }

    .progress-bar {
      width: 0;
      height: 100%;
      background: var(--green);
      transition: width 0.25s ease;
    }

    .history-panel {
      padding: 18px;
      background: var(--white);
      border: 2px solid var(--gray);
      border-radius: 14px;
    }

    .history-panel h3 {
      margin: 0 0 8px;
    }

    .history-summary {
      margin: 0 0 14px;
      color: var(--dark-gray);
      line-height: 1.5;
    }

    .history-list {
      display: grid;
      gap: 8px;
      max-height: 390px;
      overflow-y: auto;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--cream);
      border-left: 5px solid var(--gold);
      border-radius: 8px;
    }

    .history-number {
      display: grid;
      flex: 0 0 30px;
      width: 30px;
      height: 30px;
      place-items: center;
      color: var(--white);
      font-size: 0.82rem;
      font-weight: bold;
      background: var(--navy);
      border-radius: 50%;
    }

    .history-name {
      font-weight: bold;
      line-height: 1.3;
    }

    .empty-history {
      padding: 20px;
      color: var(--dark-gray);
      text-align: center;
      line-height: 1.5;
      background: var(--cream);
      border-radius: 8px;
    }

    .round-complete {
      display: none;
      margin-top: 18px;
      padding: 14px;
      color: #1e5b34;
      font-weight: bold;
      line-height: 1.5;
      background: #dff3e7;
      border: 2px solid var(--green);
      border-radius: 9px;
    }

    .round-complete.show {
      display: block;
    }

    .status-message {
      display: none;
      margin-top: 16px;
      padding: 12px;
      color: var(--white);
      text-align: center;
      font-weight: bold;
      background: var(--green);
      border-radius: 8px;
    }

    .status-message.show {
      display: block;
    }

    .empty-state {
      padding: 36px 18px;
      color: var(--dark-gray);
      text-align: center;
      line-height: 1.6;
      background: var(--cream);
      border-radius: 12px;
    }

    @media (max-width: 800px) {
      .picker-layout {
        grid-template-columns: 1fr;
      }

      .history-list {
        max-height: none;
      }
    }

    @media (max-width: 520px) {
      .picker-panel {
        padding: 18px;
      }

      .picked-name {
        min-height: 150px;
        padding: 18px;
      }

      .button-row {
        display: grid;
      }

      .button {
        width: 100%;
      }
    }
  </style>
</head>

<body>
  <header>
    <div class="header-inner">
      <h1>Student Picker</h1>

      <p class="subtitle">
        Randomly select students without repeating anyone until the round is complete.
      </p>
    </div>
  </header>

  <main>
    <section class="card">
      <h2>Choose a Class</h2>

      <p class="instructions">
        Select a class below. Patriot Command will remember which students
        have already been picked, even if you leave the page and return later.
      </p>

      <div
        id="class-warning"
        class="warning"
      >
        No classes were found. Add your classes in Teacher Settings first.
      </div>

      <div
        id="roster-warning"
        class="warning"
      >
        This class does not have a saved roster. Import its roster on the
        Students page before using the picker.
      </div>

      <div class="form-group">
        <label for="class-selector">
          Class
        </label>

        <select id="class-selector">
          <option value="">
            Select a class
          </option>
        </select>
      </div>
    </section>

    <section class="card">
      <h2 id="picker-heading">
        Random Student Picker
      </h2>

      <div
        id="empty-state"
        class="empty-state"
      >
        Select a class to begin.
      </div>

      <div
        id="picker-workspace"
        class="picker-layout"
        hidden
      >
        <div class="picker-panel">
          <p class="picker-label">
            Selected Student
          </p>

          <div
            id="picked-name"
            class="picked-name empty"
            aria-live="polite"
          >
            Ready to pick
          </div>

          <div class="button-row">
            <button
              id="pick-button"
              class="button button-primary"
              type="button"
            >
              Pick a Student
            </button>

            <button
              id="reset-button"
              class="button button-danger"
              type="button"
            >
              Reset Round
            </button>
          </div>

          <div class="progress-section">
            <div class="progress-text">
              <span id="progress-label">
                0 of 0 picked
              </span>

              <span id="remaining-label">
                0 remaining
              </span>
            </div>

            <div class="progress-track">
              <div
                id="progress-bar"
                class="progress-bar"
              ></div>
            </div>
          </div>

          <div
            id="round-complete"
            class="round-complete"
          >
            Everyone has been picked. Reset the round to begin again.
          </div>

          <div
            id="status-message"
            class="status-message"
            aria-live="polite"
          ></div>
        </div>

        <aside class="history-panel">
          <h3>Picked This Round</h3>

          <p
            id="history-summary"
            class="history-summary"
          >
            No students have been picked yet.
          </p>

          <div
            id="history-list"
            class="history-list"
          ></div>
        </aside>
      </div>
    </section>
  </main>

  <script>
    const PROFILE_STORAGE_KEY =
      "patriotTeacherProfile";

    const ROSTER_STORAGE_KEY =
      "patriotStudentRosters";

    const PICKER_STORAGE_KEY =
      "patriotStudentPicker";

    const classSelector =
      document.getElementById(
        "class-selector"
      );

    const classWarning =
      document.getElementById(
        "class-warning"
      );

    const rosterWarning =
      document.getElementById(
        "roster-warning"
      );

    const pickerHeading =
      document.getElementById(
        "picker-heading"
      );

    const emptyState =
      document.getElementById(
        "empty-state"
      );

    const pickerWorkspace =
      document.getElementById(
        "picker-workspace"
      );

    const pickedName =
      document.getElementById(
        "picked-name"
      );

    const pickButton =
      document.getElementById(
        "pick-button"
      );

    const resetButton =
      document.getElementById(
        "reset-button"
      );

    const progressLabel =
      document.getElementById(
        "progress-label"
      );

    const remainingLabel =
      document.getElementById(
        "remaining-label"
      );

    const progressBar =
      document.getElementById(
        "progress-bar"
      );

    const roundComplete =
      document.getElementById(
        "round-complete"
      );

    const historySummary =
      document.getElementById(
        "history-summary"
      );

    const historyList =
      document.getElementById(
        "history-list"
      );

    const statusMessage =
      document.getElementById(
        "status-message"
      );

    let selectedClassKey = "";
    let selectedClassLabel = "";
    let roster = [];
    let pickedStudentIds = [];
    let lastPickedStudentId = "";

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

    function writeStorage(
      storageKey,
      value
    ) {
      localStorage.setItem(
        storageKey,
        JSON.stringify(value)
      );
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

    function readPickerProgress() {
      return readStorage(
        PICKER_STORAGE_KEY,
        {}
      );
    }

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
              String(courseName).trim()
          })
        );
    }

    function populateClassSelector() {
      const classes =
        getClassOptions();

      classSelector.innerHTML = `
        <option value="">
          Select a class
        </option>
      `;

      classes.forEach(classInfo => {
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
      });

      classWarning.classList.toggle(
        "show",
        classes.length === 0
      );

      classSelector.disabled =
        classes.length === 0;
    }

    function getSelectedClassLabel() {
      const selectedOption =
        classSelector.options[
          classSelector.selectedIndex
        ];

      return selectedOption
        ? selectedOption.textContent.trim()
        : "";
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

    function getStudentById(
      studentId
    ) {
      return roster.find(
        student =>
          student.id === studentId
      );
    }

    function getActiveRoster() {
      const rosters =
        readRosters();

      const classRoster =
        rosters[selectedClassKey];

      if (
        !Array.isArray(classRoster)
      ) {
        return [];
      }

      return classRoster.filter(
        student =>
          student &&
          student.active !== false
      );
    }

    function loadSelectedClass() {
      selectedClassKey =
        classSelector.value;

      selectedClassLabel =
        getSelectedClassLabel();

      lastPickedStudentId = "";

      if (!selectedClassKey) {
        roster = [];
        pickedStudentIds = [];

        rosterWarning.classList.remove(
          "show"
        );

        showEmptyState(
          "Select a class to begin."
        );

        return;
      }

      roster =
        getActiveRoster();

      const hasRoster =
        roster.length > 0;

      rosterWarning.classList.toggle(
        "show",
        !hasRoster
      );

      if (!hasRoster) {
        pickedStudentIds = [];

        showEmptyState(
          "This class does not have a saved roster."
        );

        return;
      }

      loadSavedProgress();
      renderPicker();
    }

    function loadSavedProgress() {
      const allProgress =
        readPickerProgress();

      const classProgress =
        allProgress[selectedClassKey];

      if (
        !classProgress ||
        !Array.isArray(
          classProgress.pickedStudentIds
        )
      ) {
        pickedStudentIds = [];
        lastPickedStudentId = "";
        return;
      }

      const validStudentIds =
        new Set(
          roster.map(
            student => student.id
          )
        );

      pickedStudentIds =
        classProgress.pickedStudentIds.filter(
          studentId =>
            validStudentIds.has(
              studentId
            )
        );

      if (
        validStudentIds.has(
          classProgress.lastPickedStudentId
        )
      ) {
        lastPickedStudentId =
          classProgress.lastPickedStudentId;
      }
    }

    function saveProgress() {
      if (!selectedClassKey) {
        return;
      }

      const allProgress =
        readPickerProgress();

      allProgress[selectedClassKey] = {
        pickedStudentIds:
          [...pickedStudentIds],

        lastPickedStudentId:
          lastPickedStudentId,

        updatedAt:
          new Date().toISOString()
      };

      writeStorage(
        PICKER_STORAGE_KEY,
        allProgress
      );
    }

    function showEmptyState(
      message
    ) {
      emptyState.textContent =
        message;

      emptyState.hidden = false;
      pickerWorkspace.hidden = true;

      pickerHeading.textContent =
        "Random Student Picker";
    }

    function renderPicker() {
      emptyState.hidden = true;
      pickerWorkspace.hidden = false;

      pickerHeading.textContent =
        selectedClassLabel ||
        "Random Student Picker";

      renderPickedName();
      renderProgress();
      renderHistory();
      updateButtons();
    }

    function renderPickedName() {
      if (!lastPickedStudentId) {
        pickedName.textContent =
          "Ready to pick";

        pickedName.classList.add(
          "empty"
        );

        return;
      }

      const student =
        getStudentById(
          lastPickedStudentId
        );

      pickedName.textContent =
        student
          ? getStudentDisplayName(
              student
            )
          : "Student unavailable";

      pickedName.classList.remove(
        "empty"
      );
    }

    function renderProgress() {
      const total =
        roster.length;

      const picked =
        pickedStudentIds.length;

      const remaining =
        Math.max(
          0,
          total - picked
        );

      progressLabel.textContent =
        `${picked} of ${total} picked`;

      remainingLabel.textContent =
        `${remaining} remaining`;

      const percentage =
        total > 0
          ? Math.round(
              (picked / total) * 100
            )
          : 0;

      progressBar.style.width =
        `${percentage}%`;

      roundComplete.classList.toggle(
        "show",
        total > 0 &&
        picked >= total
      );
    }

    function renderHistory() {
      historyList.innerHTML = "";

      if (
        pickedStudentIds.length === 0
      ) {
        historySummary.textContent =
          "No students have been picked yet.";

        const emptyHistory =
          document.createElement(
            "div"
          );

        emptyHistory.className =
          "empty-history";

        emptyHistory.textContent =
          "Student names will appear here as they are selected.";

        historyList.appendChild(
          emptyHistory
        );

        return;
      }

      historySummary.textContent =
        `${pickedStudentIds.length} student` +
        (
          pickedStudentIds.length === 1
            ? ""
            : "s"
        ) +
        " picked this round.";

      pickedStudentIds
        .slice()
        .reverse()
        .forEach(
          (
            studentId,
            reverseIndex
          ) => {
            const student =
              getStudentById(
                studentId
              );

            if (!student) {
              return;
            }

            const originalNumber =
              pickedStudentIds.length -
              reverseIndex;

            const item =
              document.createElement(
                "div"
              );

            item.className =
              "history-item";

            const number =
              document.createElement(
                "span"
              );

            number.className =
              "history-number";

            number.textContent =
              originalNumber;

            const name =
              document.createElement(
                "span"
              );

            name.className =
              "history-name";

            name.textContent =
              getStudentDisplayName(
                student
              );

            item.appendChild(number);
            item.appendChild(name);

            historyList.appendChild(
              item
            );
          }
        );
    }

    function updateButtons() {
      const roundIsComplete =
        roster.length > 0 &&
        pickedStudentIds.length >=
          roster.length;

      pickButton.disabled =
        roster.length === 0 ||
        roundIsComplete;

      resetButton.disabled =
        pickedStudentIds.length === 0 &&
        !lastPickedStudentId;
    }

    function getAvailableStudents() {
      const pickedSet =
        new Set(
          pickedStudentIds
        );

      return roster.filter(
        student =>
          !pickedSet.has(
            student.id
          )
      );
    }

    function pickRandomStudent() {
      const availableStudents =
        getAvailableStudents();

      if (
        availableStudents.length === 0
      ) {
        showStatus(
          "Everyone has already been picked."
        );

        updateButtons();
        return;
      }

      const randomIndex =
        Math.floor(
          Math.random() *
          availableStudents.length
        );

      const selectedStudent =
        availableStudents[
          randomIndex
        ];

      pickedStudentIds.push(
        selectedStudent.id
      );

      lastPickedStudentId =
        selectedStudent.id;

      saveProgress();
      renderPicker();
    }

    function resetRound() {
      if (
        pickedStudentIds.length === 0 &&
        !lastPickedStudentId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Reset this class and make every student available again?"
        );

      if (!confirmed) {
        return;
      }

      pickedStudentIds = [];
      lastPickedStudentId = "";

      saveProgress();
      renderPicker();

      showStatus(
        "The picker round has been reset."
      );
    }

    function showStatus(
      message
    ) {
      statusMessage.textContent =
        message;

      statusMessage.classList.add(
        "show"
      );

      window.setTimeout(
        () => {
          statusMessage.classList.remove(
            "show"
          );
        },
        1800
      );
    }

    classSelector.addEventListener(
      "change",
      loadSelectedClass
    );

    pickButton.addEventListener(
      "click",
      pickRandomStudent
    );

    resetButton.addEventListener(
      "click",
      resetRound
    );

    populateClassSelector();
  </script>

  <script src="js/navigation.js"></script>
</body>
</html>
