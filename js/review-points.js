(function () {
  "use strict";

  const STORAGE_KEY = "patriotReviewGameTeams";
  const WIDGET_ID = "review-points-widget";

  let teams = [];

  function createDefaultTeams() {
    return [
      {
        id: createId(),
        name: "Team 1",
        points: 0
      },
      {
        id: createId(),
        name: "Team 2",
        points: 0
      }
    ];
  }

  function createId() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 8)
    );
  }

  function readTeams() {
    try {
      const savedTeams = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(savedTeams) || savedTeams.length === 0) {
        return createDefaultTeams();
      }

      return savedTeams
        .map(function (team, index) {
          return {
            id: team.id || createId(),
            name:
              String(team.name || "").trim() ||
              `Team ${index + 1}`,
            points: Number.isFinite(Number(team.points))
              ? Number(team.points)
              : 0
          };
        })
        .slice(0, 12);
    } catch (error) {
      console.error(
        "The saved Review Game Points teams could not be read.",
        error
      );

      return createDefaultTeams();
    }
  }

  function saveTeams() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(teams)
    );
  }

  function addStyles() {
    if (document.getElementById("review-points-styles")) {
      return;
    }

    const styles = document.createElement("style");

    styles.id = "review-points-styles";

    styles.textContent = `
      #${WIDGET_ID}[hidden] {
        display: none;
      }

      .review-points-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
      }

      .review-points-header h2 {
        margin: 0;
      }

      .review-points-add {
        padding: 8px 11px;
        color: #ffffff;
        font-weight: bold;
        background: var(--navy, #11284a);
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
        grid-template-columns: 1fr auto auto;
        align-items: center;
        gap: 8px;
      }

      .review-points-name {
        min-width: 0;
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
        min-width: 52px;
        color: var(--red, #b3262e);
        font-size: 1.8rem;
        font-weight: bold;
        text-align: center;
      }

      .review-points-remove {
        width: 34px;
        height: 34px;
        padding: 0;
        color: #ffffff;
        font-size: 1.1rem;
        background: var(--red, #b3262e);
        border: 0;
        border-radius: 50%;
        cursor: pointer;
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

      .review-points-clear {
        background: var(--navy, #11284a);
      }

      .review-points-add:hover,
      .review-points-remove:hover,
      .review-points-control:hover,
      .review-points-footer button:hover {
        filter: brightness(1.08);
      }

      @media (max-width: 520px) {
        .review-points-team-top {
          grid-template-columns: 1fr auto;
        }

        .review-points-name {
          grid-column: 1 / -1;
        }

        .review-points-controls {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `;

    document.head.appendChild(styles);
  }

  function createWidget() {
    if (document.getElementById(WIDGET_ID)) {
      return;
    }

    const rightColumn = document.querySelector(".right-column");

    if (!rightColumn) {
      console.warn(
        "Review Game Points could not find the right classroom column."
      );

      return;
    }

    const widget = document.createElement("section");

    widget.id = WIDGET_ID;
    widget.className = "card";
    widget.hidden = true;

    widget.innerHTML = `
      <div class="review-points-header">
        <h2>🏆 Review Game Points</h2>

        <button
          id="review-points-add-team"
          class="review-points-add"
          type="button"
        >
          + Add Team
        </button>
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
          id="review-points-clear"
          class="review-points-clear"
          type="button"
        >
          Start Over
        </button>
      </div>
    `;

    rightColumn.appendChild(widget);

    document
      .getElementById("review-points-add-team")
      .addEventListener("click", addTeam);

    document
      .getElementById("review-points-reset")
      .addEventListener("click", resetScores);

    document
      .getElementById("review-points-clear")
      .addEventListener("click", startOver);

    renderTeams();
  }

  function renderTeams() {
    const container = document.getElementById(
      "review-points-teams"
    );

    if (!container) {
      return;
    }

    container.innerHTML = "";

    teams.forEach(function (team) {
      const teamCard = document.createElement("div");

      teamCard.className = "review-points-team";
      teamCard.dataset.teamId = team.id;

      teamCard.innerHTML = `
        <div class="review-points-team-top">
          <input
            class="review-points-name"
            type="text"
            maxlength="40"
            value="${escapeAttribute(team.name)}"
            aria-label="Team name"
          >

          <div
            class="review-points-score"
            aria-live="polite"
          >
            ${team.points}
          </div>

          <button
            class="review-points-remove"
            type="button"
            aria-label="Remove ${escapeAttribute(team.name)}"
            title="Remove team"
          >
            ×
          </button>
        </div>

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

      const nameInput = teamCard.querySelector(
        ".review-points-name"
      );

      const removeButton = teamCard.querySelector(
        ".review-points-remove"
      );

      nameInput.addEventListener("change", function () {
        renameTeam(team.id, nameInput.value);
      });

      nameInput.addEventListener("blur", function () {
        renameTeam(team.id, nameInput.value);
      });

      removeButton.addEventListener("click", function () {
        removeTeam(team.id);
      });

      teamCard
        .querySelectorAll("[data-points]")
        .forEach(function (button) {
          button.addEventListener("click", function () {
            changePoints(
              team.id,
              Number(button.dataset.points)
            );
          });
        });

      container.appendChild(teamCard);
    });
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function addTeam() {
    if (teams.length >= 12) {
      window.alert(
        "You can use up to 12 teams at one time."
      );

      return;
    }

    teams.push({
      id: createId(),
      name: `Team ${teams.length + 1}`,
      points: 0
    });

    saveTeams();
    renderTeams();

    const nameInputs = document.querySelectorAll(
      ".review-points-name"
    );

    const newestInput = nameInputs[nameInputs.length - 1];

    if (newestInput) {
      newestInput.focus();
      newestInput.select();
    }
  }

  function renameTeam(teamId, newName) {
    const team = teams.find(function (item) {
      return item.id === teamId;
    });

    if (!team) {
      return;
    }

    const cleanedName = String(newName || "").trim();

    team.name = cleanedName || "Unnamed Team";

    saveTeams();
    renderTeams();
  }

  function removeTeam(teamId) {
    if (teams.length <= 1) {
      window.alert(
        "Review Game Points needs at least one team."
      );

      return;
    }

    teams = teams.filter(function (team) {
      return team.id !== teamId;
    });

    saveTeams();
    renderTeams();
  }

  function changePoints(teamId, amount) {
    const team = teams.find(function (item) {
      return item.id === teamId;
    });

    if (!team) {
      return;
    }

    team.points += amount;

    saveTeams();
    renderTeams();
  }

  function resetScores() {
    const shouldReset = window.confirm(
      "Reset every team’s score to zero?"
    );

    if (!shouldReset) {
      return;
    }

    teams.forEach(function (team) {
      team.points = 0;
    });

    saveTeams();
    renderTeams();
  }

  function startOver() {
    const shouldStartOver = window.confirm(
      "Remove the current teams and begin again with two teams?"
    );

    if (!shouldStartOver) {
      return;
    }

    teams = createDefaultTeams();

    saveTeams();
    renderTeams();
  }

  function showWidget() {
    const widget = document.getElementById(WIDGET_ID);

    if (widget) {
      widget.hidden = false;
    }
  }

  function hideWidget() {
    const widget = document.getElementById(WIDGET_ID);

    if (widget) {
      widget.hidden = true;
    }
  }

  function setWidgetVisibility(enabled) {
    if (enabled) {
      showWidget();
    } else {
      hideWidget();
    }
  }

  function handlePointsChange(event) {
    const enabled = Boolean(
      event.detail &&
      event.detail.enabled
    );

    setWidgetVisibility(enabled);
  }

  function initialize() {
    teams = readTeams();

    addStyles();
    createWidget();

    document.addEventListener(
      "patriotPointsChange",
      handlePointsChange
    );

    window.PatriotReviewPoints = {
      show: showWidget,
      hide: hideWidget,
      addTeam: addTeam,
      resetScores: resetScores
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
