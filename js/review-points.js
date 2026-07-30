(function () {
  "use strict";

  const PROFILE_STORAGE_KEY =
    "patriotTeacherProfile";

  const ROSTER_STORAGE_KEY =
    "patriotStudentRosters";

  const ACTIVE_CLASS_STORAGE_KEY =
    "patriotActiveClass";

  const TEAMS_STORAGE_KEY =
    "patriotReviewGameTeams";

  const WIDGET_ID =
    "review-points-widget";

  let teams = [];
  let selectedMethod = "pick";
  let selectedTeamCount = 2;

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
      localStorage.getItem(
        storageKey
      );

    if (!savedValue) {
      return fallbackValue;
    }

    try {
      const parsedValue =
        JSON.parse(savedValue);

      return parsedValue ??
        fallbackValue;
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

  function readActiveClass() {
    return (
      localStorage.getItem(
        ACTIVE_CLASS_STORAGE_KEY
      ) || ""
    );
  }

  function readSavedTeams() {
    const savedTeams =
      readStorage(
        TEAMS_STORAGE_KEY,
        []
      );

    if (!Array.isArray(savedTeams)) {
      return [];
    }

    return savedTeams
      .map(
        function (
          team,
          index
        ) {
          return {
            id:
              team.id ||
              createId(),

            name:
              String(
                team.name || ""
              ).trim() ||
              `Team ${index + 1}`,

            points:
              Number.isFinite(
                Number(
                  team.points
                )
              )
                ? Number(
                    team.points
                  )
                : 0,

            members:
              Array.isArray(
                team.members
              )
                ? team.members
                    .map(
                      function (
                        member
                      ) {
                        return String(
                          member || ""
                        ).trim();
                      }
                    )
                    .filter(
                      Boolean
                    )
                : []
          };
        }
      )
      .slice(
        0,
        6
      );
  }

  function saveTeams() {
    localStorage.setItem(
      TEAMS_STORAGE_KEY,
      JSON.stringify(
        teams
      )
    );
  }

  /*
  ==========================================
  CLASS AND ROSTER DATA
  ==========================================
  */

  function getClassLabel(
    classKey
  ) {
    if (!classKey) {
      return "No class selected";
    }

    const profile =
      readTeacherProfile();

    const courseName =
      profile &&
      profile.classes
        ? String(
            profile.classes[
              classKey
            ] || ""
          ).trim()
        : "";

    if (!courseName) {
      return classKey;
    }

    return (
      `${classKey} — ` +
      courseName
    );
  }

  function getStudentDisplayName(
    student
  ) {
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
      .filter(
        Boolean
      )
      .join(" ");
  }

  function getActiveRoster() {
    const activeClass =
      readActiveClass();

    if (!activeClass) {
      return [];
    }

    const rosters =
      readRosters();

    const savedRoster =
      Array.isArray(
        rosters[
          activeClass
        ]
      )
        ? rosters[
            activeClass
          ]
        : [];

    return savedRoster.filter(
      function (
        student
      ) {
        return (
          student &&
          student.active !==
            false &&
          getStudentDisplayName(
            student
          )
        );
      }
    );
  }

  /*
  ==========================================
  TEAM CREATION
  ==========================================
  */

  function createId() {
    return (
      Date.now().toString(
        36
      ) +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }

  function shuffleArray(
    items
  ) {
    const shuffledItems =
      [...items];

    for (
      let index =
        shuffledItems.length -
        1;
      index > 0;
      index -= 1
    ) {
      const randomIndex =
        Math.floor(
          Math.random() *
          (index + 1)
        );

      [
        shuffledItems[index],
        shuffledItems[
          randomIndex
        ]
      ] = [
        shuffledItems[
          randomIndex
        ],
        shuffledItems[index]
      ];
    }

    return shuffledItems;
  }

  function createEmptyTeams(
    teamCount
  ) {
    return Array.from(
      {
        length: teamCount
      },
      function (
        unused,
        index
      ) {
        return {
          id: createId(),
          name:
            `Team ${index + 1}`,
          points: 0,
          members: []
        };
      }
    );
  }

  function createRandomTeams(
    roster,
    teamCount
  ) {
    const newTeams =
      createEmptyTeams(
        teamCount
      );

    const shuffledStudents =
      shuffleArray(
        roster
      );

    shuffledStudents.forEach(
      function (
        student,
        index
      ) {
        const teamIndex =
          index %
          teamCount;

        newTeams[
          teamIndex
        ].members.push(
          getStudentDisplayName(
            student
          )
        );
      }
    );

    return newTeams;
  }

  function createTeams() {
    if (
      selectedMethod ===
      "random"
    ) {
      const activeClass =
        readActiveClass();

      if (!activeClass) {
        window.alert(
          "Select a current class first."
        );

        return;
      }

      const roster =
        getActiveRoster();

      if (
        roster.length === 0
      ) {
        window.alert(
          "This class does not have a saved roster."
        );

        return;
      }

      teams =
        createRandomTeams(
          roster,
          selectedTeamCount
        );
    } else {
      teams =
        createEmptyTeams(
          selectedTeamCount
        );
    }

    saveTeams();
    renderWidget();
  }

  /*
  ==========================================
  TEAM ACTIONS
  ==========================================
  */

  function renameTeam(
    teamId,
    newName
  ) {
    const team =
      teams.find(
        function (
          item
        ) {
          return (
            item.id ===
            teamId
          );
        }
      );

    if (!team) {
      return;
    }

    team.name =
      String(
        newName || ""
      ).trim() ||
      "Unnamed Team";

    saveTeams();
  }

  function changePoints(
    teamId,
    amount
  ) {
    const team =
      teams.find(
        function (
          item
        ) {
          return (
            item.id ===
            teamId
          );
        }
      );

    if (!team) {
      return;
    }

    team.points +=
      amount;

    saveTeams();
    renderTeams();
  }

  function resetScores() {
    const confirmed =
      window.confirm(
        "Reset all scores to zero?"
      );

    if (!confirmed) {
      return;
    }

    teams.forEach(
      function (
        team
      ) {
        team.points = 0;
      }
    );

    saveTeams();
    renderTeams();
  }

  function startNewTeams() {
    const confirmed =
      window.confirm(
        "Replace the current teams?"
      );

    if (!confirmed) {
      return;
    }

    teams = [];
    saveTeams();
    renderWidget();
  }

  /*
  ==========================================
  STYLES
  ==========================================
  */

  function addStyles() {
    if (
      document.getElementById(
        "review-points-styles"
      )
    ) {
      return;
    }

    const styles =
      document.createElement(
        "style"
      );

    styles.id =
      "review-points-styles";

    styles.textContent = `
      #${WIDGET_ID}[hidden] {
        display: none;
      }

      .review-points-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
      }

      .review-points-header h2 {
        margin: 0;
      }

      .review-points-class {
        margin: -5px 0 14px;
        color: #666666;
        font-size: 0.84rem;
        line-height: 1.4;
      }

      .review-points-setup-label {
        display: block;
        margin: 14px 0 7px;
        color: var(--navy, #11284a);
        font-size: 0.9rem;
        font-weight: bold;
      }

      .review-points-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .review-points-option {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 8px 10px;
        color: var(--navy, #11284a);
        font-size: 0.9rem;
        font-weight: bold;
        background: var(--cream, #f7f2e8);
        border: 2px solid #d7dce3;
        border-radius: 8px;
        cursor: pointer;
      }

      .review-points-option:has(input:checked) {
        background: #ffffff;
        border-color: var(--gold, #d3a84f);
        box-shadow: 0 0 0 2px rgba(211, 168, 79, 0.18);
      }

      .review-points-option input {
        margin: 0;
        accent-color: var(--red, #b3262e);
      }

      .review-points-create {
        width: 100%;
        margin-top: 16px;
        padding: 11px;
        color: #ffffff;
        font-weight: bold;
        background: var(--green, #2f7d4a);
        border: 0;
        border-radius: 8px;
        cursor: pointer;
      }

      .review-points-teams {
        display: grid;
        gap: 12px;
      }

      .review-points-team {
        padding: 12px;
        background: var(--cream, #f7f2e8);
        border: 2px solid var(--gold, #d3a84f);
        border-radius: 12px;
      }

      .review-points-team-top {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 8px;
      }

      .review-points-name {
        min-width: 0;
        width: 100%;
        padding: 8px 9px;
        color: var(--navy, #11284a);
        font: inherit;
        font-weight: bold;
        background: #ffffff;
        border: 2px solid #d7d7d7;
        border-radius: 7px;
      }

      .review-points-name:focus {
        outline: none;
        border-color: var(--navy, #11284a);
        box-shadow: 0 0 0 3px rgba(17, 40, 74, 0.12);
      }

      .review-points-score {
        min-width: 54px;
        color: var(--red, #b3262e);
        font-size: 1.8rem;
        font-weight: bold;
        text-align: center;
      }

      .review-points-member-details {
        margin-top: 9px;
        color: var(--navy, #11284a);
        font-size: 0.86rem;
      }

      .review-points-member-details summary {
        font-weight: bold;
        cursor: pointer;
      }

      .review-points-members {
        margin: 8px 0 0;
        padding-left: 22px;
        line-height: 1.55;
      }

      .review-points-controls {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 7px;
        margin-top: 10px;
      }

      .review-points-control {
        padding: 9px 6px;
        color: #ffffff;
        font-weight: bold;
        background: var(--navy, #11284a);
        border: 0;
        border-radius: 7px;
        cursor: pointer;
      }

      .review-points-control.positive {
        background: var(--green, #2f7d4a);
      }

      .review-points-control.negative {
        background: var(--red, #b3262e);
      }

      .review-points-footer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 14px;
      }

      .review-points-footer button {
        padding: 10px;
        color: #ffffff;
        font-weight: bold;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
      }

      .review-points-reset {
        background: var(--red, #b3262e);
      }

      .review-points-new {
        background: var(--navy, #11284a);
      }

      .review-points-create:hover,
      .review-points-control:hover,
      .review-points-footer button:hover {
        filter: brightness(1.07);
      }

      .review-points-create:focus-visible,
      .review-points-control:focus-visible,
      .review-points-footer button:focus-visible {
        outline: 3px solid var(--gold, #d3a84f);
        outline-offset: 2px;
      }

      @media (max-width: 520px) {
        .review-points-controls {
          grid-template-columns: repeat(2, 1fr);
        }

        .review-points-footer {
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
        "Review Game Points could not find the right classroom column."
      );

      return;
    }

    const widget =
      document.createElement(
        "section"
      );

    widget.id =
      WIDGET_ID;

    widget.className =
      "card";

    widget.hidden =
      true;

    rightColumn.appendChild(
      widget
    );

    renderWidget();
  }

  function renderWidget() {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (!widget) {
      return;
    }

    if (
      teams.length === 0
    ) {
      renderSetup();
    } else {
      renderScorekeeper();
    }
  }

  function renderSetup() {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (!widget) {
      return;
    }

    const activeClass =
      readActiveClass();

    widget.innerHTML = `
      <div class="review-points-header">
        <h2>🏆 Teams</h2>
      </div>

      <p class="review-points-class">
        Class:
        ${escapeHtml(
          getClassLabel(
            activeClass
          )
        )}
      </p>

      <span class="review-points-setup-label">
        Method
      </span>

      <div class="review-points-options">
        <label class="review-points-option">
          <input
            type="radio"
            name="review-points-method"
            value="pick"
            ${
              selectedMethod ===
              "pick"
                ? "checked"
                : ""
            }
          >
          Pick
        </label>

        <label class="review-points-option">
          <input
            type="radio"
            name="review-points-method"
            value="random"
            ${
              selectedMethod ===
              "random"
                ? "checked"
                : ""
            }
          >
          Random
        </label>
      </div>

      <span class="review-points-setup-label">
        Number
      </span>

      <div class="review-points-options">
        ${[2, 3, 4, 5, 6]
          .map(
            function (
              teamCount
            ) {
              return `
                <label class="review-points-option">
                  <input
                    type="radio"
                    name="review-points-count"
                    value="${teamCount}"
                    ${
                      selectedTeamCount ===
                      teamCount
                        ? "checked"
                        : ""
                    }
                  >
                  ${teamCount}
                </label>
              `;
            }
          )
          .join("")}
      </div>

      <button
        id="review-points-create"
        class="review-points-create"
        type="button"
      >
        Create
      </button>
    `;

    widget
      .querySelectorAll(
        'input[name="review-points-method"]'
      )
      .forEach(
        function (
          radio
        ) {
          radio.addEventListener(
            "change",
            function () {
              selectedMethod =
                radio.value;
            }
          );
        }
      );

    widget
      .querySelectorAll(
        'input[name="review-points-count"]'
      )
      .forEach(
        function (
          radio
        ) {
          radio.addEventListener(
            "change",
            function () {
              selectedTeamCount =
                Number(
                  radio.value
                );
            }
          );
        }
      );

    document
      .getElementById(
        "review-points-create"
      )
      .addEventListener(
        "click",
        createTeams
      );
  }

  function renderScorekeeper() {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (!widget) {
      return;
    }

    widget.innerHTML = `
      <div class="review-points-header">
        <h2>🏆 Review Game</h2>
      </div>

      <div
        id="review-points-teams"
        class="review-points-teams"
      ></div>

      <div class="review-points-footer">
        <button
          id="review-points-reset"
          class="review-points-reset"
          type="button"
        >
          Reset Scores
        </button>

        <button
          id="review-points-new"
          class="review-points-new"
          type="button"
        >
          New Teams
        </button>
      </div>
    `;

    document
      .getElementById(
        "review-points-reset"
      )
      .addEventListener(
        "click",
        resetScores
      );

    document
      .getElementById(
        "review-points-new"
      )
      .addEventListener(
        "click",
        startNewTeams
      );

    renderTeams();
  }

  function renderTeams() {
    const container =
      document.getElementById(
        "review-points-teams"
      );

    if (!container) {
      return;
    }

    container.innerHTML =
      "";

    teams.forEach(
      function (
        team
      ) {
        const teamCard =
          document.createElement(
            "div"
          );

        teamCard.className =
          "review-points-team";

        teamCard.innerHTML = `
          <div class="review-points-team-top">
            <input
              class="review-points-name"
              type="text"
              maxlength="40"
              value="${escapeAttribute(
                team.name
              )}"
              aria-label="Team name"
            >

            <div
              class="review-points-score"
              aria-live="polite"
            >
              ${team.points}
            </div>
          </div>

          ${
            team.members.length >
            0
              ? `
                <details class="review-points-member-details">
                  <summary>
                    ${team.members.length}
                    ${
                      team.members.length ===
                      1
                        ? "student"
                        : "students"
                    }
                  </summary>

                  <ul class="review-points-members">
                    ${team.members
                      .map(
                        function (
                          member
                        ) {
                          return `
                            <li>
                              ${escapeHtml(
                                member
                              )}
                            </li>
                          `;
                        }
                      )
                      .join("")}
                  </ul>
                </details>
              `
              : ""
          }

          <div class="review-points-controls">
            <button
              class="review-points-control negative"
              type="button"
              data-points="-1"
            >
              −1
            </button>

            <button
              class="review-points-control positive"
              type="button"
              data-points="1"
            >
              +1
            </button>

            <button
              class="review-points-control positive"
              type="button"
              data-points="5"
            >
              +5
            </button>

            <button
              class="review-points-control positive"
              type="button"
              data-points="10"
            >
              +10
            </button>
          </div>
        `;

        const nameInput =
          teamCard.querySelector(
            ".review-points-name"
          );

        nameInput.addEventListener(
          "change",
          function () {
            renameTeam(
              team.id,
              nameInput.value
            );
          }
        );

        nameInput.addEventListener(
          "blur",
          function () {
            renameTeam(
              team.id,
              nameInput.value
            );
          }
        );

        teamCard
          .querySelectorAll(
            "[data-points]"
          )
          .forEach(
            function (
              button
            ) {
              button.addEventListener(
                "click",
                function () {
                  changePoints(
                    team.id,
                    Number(
                      button.dataset.points
                    )
                  );
                }
              );
            }
          );

        container.appendChild(
          teamCard
        );
      }
    );
  }

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  function escapeHtml(
    value
  ) {
    return String(
      value
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  function escapeAttribute(
    value
  ) {
    return escapeHtml(
      value
    );
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
      widget.hidden =
        false;
    }
  }

  function hideWidget() {
    const widget =
      document.getElementById(
        WIDGET_ID
      );

    if (widget) {
      widget.hidden =
        true;
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

  function handlePointsChange(
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

  function handleActiveClassChange() {
    if (
      teams.length === 0
    ) {
      renderSetup();
    }
  }

  /*
  ==========================================
  PUBLIC ACCESS
  ==========================================
  */

  window.PatriotReviewPoints = {
    show: showWidget,
    hide: hideWidget,
    resetScores: resetScores,
    newTeams: startNewTeams
  };

  /*
  ==========================================
  START
  ==========================================
  */

  function initialize() {
    teams =
      readSavedTeams();

    addStyles();
    createWidget();

    document.addEventListener(
      "patriotPointsChange",
      handlePointsChange
    );

    document.addEventListener(
      "patriotActiveClassChange",
      handleActiveClassChange
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
