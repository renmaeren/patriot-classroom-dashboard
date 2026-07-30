(function () {
  "use strict";

  const ROSTER_STORAGE_KEY =
    "patriotStudentPickerRoster";

  const WIDGET_ID =
    "random-groups-widget";

  let generatedGroups = [];

  function readRoster() {
    try {
      const savedRoster =
        JSON.parse(
          localStorage.getItem(
            ROSTER_STORAGE_KEY
          ) || "[]"
        );

      return Array.isArray(savedRoster)
        ? savedRoster
            .map(function (name) {
              return String(
                name || ""
              ).trim();
            })
            .filter(Boolean)
        : [];
    } catch (error) {
      console.error(
        "The saved student roster could not be read.",
        error
      );

      return [];
    }
  }

  function shuffleNames(names) {
    const shuffled =
      names.slice();

    for (
      let index =
        shuffled.length - 1;
      index > 0;
      index -= 1
    ) {
      const randomIndex =
        Math.floor(
          Math.random() *
          (index + 1)
        );

      const temporaryValue =
        shuffled[index];

      shuffled[index] =
        shuffled[randomIndex];

      shuffled[randomIndex] =
        temporaryValue;
    }

    return shuffled;
  }

  function addStyles() {
    if (
      document.getElementById(
        "random-groups-styles"
      )
    ) {
      return;
    }

    const styles =
      document.createElement(
        "style"
      );

    styles.id =
      "random-groups-styles";

    styles.textContent = `
      #${WIDGET_ID}[hidden] {
        display: none;
      }

      .random-groups-header {
        display: flex;
        justify-content:
          space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
      }

      .random-groups-header h2 {
        margin: 0;
      }

      .random-groups-roster-count {
        margin: 0 0 13px;
        color: #666666;
        font-size: 0.88rem;
      }

      .random-groups-controls {
        display: grid;
        grid-template-columns:
          1fr 1fr;
        gap: 9px;
      }

      .random-groups-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .random-groups-field label {
        font-size: 0.86rem;
        font-weight: bold;
      }

      .random-groups-field select {
        width: 100%;
        padding: 10px;
        color:
          var(--navy, #11284a);
        background: #ffffff;
        border:
          2px solid #d8d8d8;
        border-radius: 8px;
      }

      .random-groups-buttons {
        display: grid;
        grid-template-columns:
          1fr 1fr;
        gap: 8px;
        margin-top: 11px;
      }

      .random-groups-button {
        padding: 11px;
        color: #ffffff;
        font-weight: bold;
        background:
          var(--red, #b3262e);
        border: 0;
        border-radius: 8px;
        cursor: pointer;
      }

      .random-groups-button.secondary {
        background:
          var(--navy, #11284a);
      }

      .random-groups-button:hover {
        filter: brightness(1.07);
      }

      .random-groups-message {
        display: none;
        margin-top: 12px;
        padding: 11px;
        color:
          var(--navy, #11284a);
        line-height: 1.4;
        background:
          var(--cream, #f7f2e8);
        border-left:
          5px solid
          var(--gold, #d3a84f);
        border-radius: 7px;
      }

      .random-groups-message.show {
        display: block;
      }

      .random-groups-results {
        display: grid;
        gap: 10px;
        margin-top: 14px;
      }

      .random-group-card {
        padding: 12px;
        background:
          var(--cream, #f7f2e8);
        border:
          2px solid
          var(--gold, #d3a84f);
        border-radius: 10px;
      }

      .random-group-card h3 {
        margin: 0 0 8px;
        color:
          var(--red, #b3262e);
        font-size: 1rem;
      }

      .random-group-card ul {
        margin: 0;
        padding-left: 22px;
        line-height: 1.5;
      }

      .random-groups-empty {
        margin: 14px 0 0;
        color: #777777;
        font-style: italic;
        text-align: center;
      }

      @media (max-width: 520px) {
        .random-groups-controls,
        .random-groups-buttons {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(
      styles
    );
  }

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
        "Random Groups could not find the right classroom column."
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
      <div class="random-groups-header">
        <h2>👥 Random Groups</h2>
      </div>

      <p
        id="random-groups-roster-count"
        class="random-groups-roster-count"
      ></p>

      <div class="random-groups-controls">
        <div class="random-groups-field">
          <label for="random-groups-method">
            Group By
          </label>

          <select id="random-groups-method">
            <option value="size">
              Students per group
            </option>

            <option value="count">
              Number of groups
            </option>
          </select>
        </div>

        <div class="random-groups-field">
          <label for="random-groups-number">
            Amount
          </label>

          <select id="random-groups-number">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4" selected>4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>

      <div class="random-groups-buttons">
        <button
          id="random-groups-create-button"
          class="random-groups-button"
          type="button"
        >
          Create Groups
        </button>

        <button
          id="random-groups-reshuffle-button"
          class="random-groups-button secondary"
          type="button"
        >
          Reshuffle
        </button>
      </div>

      <div
        id="random-groups-message"
        class="random-groups-message"
      ></div>

      <div
        id="random-groups-results"
        class="random-groups-results"
        aria-live="polite"
      >
        <p class="random-groups-empty">
          Create groups from the saved Student Picker roster.
        </p>
      </div>
    `;

    rightColumn.appendChild(
      widget
    );

    document
      .getElementById(
        "random-groups-create-button"
      )
      .addEventListener(
        "click",
        createGroups
      );

    document
      .getElementById(
        "random-groups-reshuffle-button"
      )
      .addEventListener(
        "click",
        createGroups
      );

    updateRosterCount();
  }

  function updateRosterCount() {
    const countDisplay =
      document.getElementById(
        "random-groups-roster-count"
      );

    if (!countDisplay) {
      return;
    }

    const roster =
      readRoster();

    if (roster.length === 0) {
      countDisplay.textContent =
        "No Student Picker roster is saved.";

      return;
    }

    const studentWord =
      roster.length === 1
        ? "student"
        : "students";

    countDisplay.textContent =
      `${roster.length} ${studentWord} available`;
  }

  function showMessage(message) {
    const messageBox =
      document.getElementById(
        "random-groups-message"
      );

    if (!messageBox) {
      return;
    }

    messageBox.textContent =
      message;

    messageBox.classList.add(
      "show"
    );
  }

  function clearMessage() {
    const messageBox =
      document.getElementById(
        "random-groups-message"
      );

    if (!messageBox) {
      return;
    }

    messageBox.textContent = "";

    messageBox.classList.remove(
      "show"
    );
  }

  function createGroups() {
    const roster =
      readRoster();

    updateRosterCount();
    clearMessage();

    if (roster.length === 0) {
      generatedGroups = [];

      renderGroups();

      showMessage(
        "Add names through Student Picker before creating groups."
      );

      return;
    }

    if (roster.length === 1) {
      generatedGroups = [
        roster.slice()
      ];

      renderGroups();

      return;
    }

    const method =
      document.getElementById(
        "random-groups-method"
      ).value;

    const amount =
      Number(
        document.getElementById(
          "random-groups-number"
        ).value
      );

    const shuffledRoster =
      shuffleNames(roster);

    if (method === "count") {
      generatedGroups =
        divideByGroupCount(
          shuffledRoster,
          amount
        );
    } else {
      generatedGroups =
        divideByGroupSize(
          shuffledRoster,
          amount
        );
    }

    renderGroups();
  }

  function divideByGroupSize(
    names,
    groupSize
  ) {
    const groups = [];

    for (
      let index = 0;
      index < names.length;
      index += groupSize
    ) {
      groups.push(
        names.slice(
          index,
          index + groupSize
        )
      );
    }

    if (
      groups.length > 1 &&
      groups[
        groups.length - 1
      ].length === 1
    ) {
      const finalGroup =
        groups[
          groups.length - 1
        ];

      const previousGroup =
        groups[
          groups.length - 2
        ];

      previousGroup.push(
        finalGroup[0]
      );

      groups.pop();
    }

    return groups;
  }

  function divideByGroupCount(
    names,
    requestedCount
  ) {
    const groupCount =
      Math.min(
        requestedCount,
        names.length
      );

    const groups =
      Array.from(
        {
          length: groupCount
        },
        function () {
          return [];
        }
      );

    names.forEach(
      function (name, index) {
        groups[
          index % groupCount
        ].push(name);
      }
    );

    return groups;
  }

  function renderGroups() {
    const container =
      document.getElementById(
        "random-groups-results"
      );

    if (!container) {
      return;
    }

    container.innerHTML = "";

    if (
      generatedGroups.length === 0
    ) {
      const emptyMessage =
        document.createElement(
          "p"
        );

      emptyMessage.className =
        "random-groups-empty";

      emptyMessage.textContent =
        "Create groups from the saved Student Picker roster.";

      container.appendChild(
        emptyMessage
      );

      return;
    }

    generatedGroups.forEach(
      function (group, index) {
        const groupCard =
          document.createElement(
            "section"
          );

        groupCard.className =
          "random-group-card";

        const heading =
          document.createElement(
            "h3"
          );

        heading.textContent =
          `Group ${index + 1}`;

        const list =
          document.createElement(
            "ul"
          );

        group.forEach(
          function (studentName) {
            const listItem =
              document.createElement(
                "li"
              );

            listItem.textContent =
              studentName;

            list.appendChild(
              listItem
            );
          }
        );

        groupCard.appendChild(
          heading
        );

        groupCard.appendChild(
          list
        );

        container.appendChild(
          groupCard
        );
      }
    );
  }

  function showWidget() {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (widget) {
      widget.hidden = false;

      updateRosterCount();
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

  function handleGroupsChange(
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

  function initialize() {
    addStyles();
    createWidget();

    document.addEventListener(
      "patriotGroupsChange",
      handleGroupsChange
    );

    window.addEventListener(
      "storage",
      function (event) {
        if (
          event.key ===
          ROSTER_STORAGE_KEY
        ) {
          updateRosterCount();
        }
      }
    );

    window.PatriotRandomGroups = {
      show: showWidget,
      hide: hideWidget,
      create: createGroups,
      refreshRoster:
        updateRosterCount
    };
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
