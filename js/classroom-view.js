/*
  PATRIOT CLASSROOM LAUNCH
  Classroom View

  This feature creates a clean student-facing view by:
  - entering browser fullscreen when allowed;
  - hiding teacher setup controls;
  - displaying a small Exit Classroom View button;
  - allowing the Escape key to leave fullscreen.
*/

(function () {
  let classroomViewActive = false;

  function addClassroomViewStyles() {
    const style = document.createElement("style");

    style.textContent = `
      .classroom-view-button {
        min-width: 190px;
        padding: 11px 14px;
        color: #ffffff;
        font-weight: bold;
        background: #2f7d4a;
        border: 0;
        border-radius: 9px;
        cursor: pointer;
      }

      .classroom-view-button:hover {
        filter: brightness(1.08);
      }

      .exit-classroom-view {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 2000;
        display: none;
        padding: 10px 14px;
        color: #ffffff;
        font-weight: bold;
        background: rgba(17, 40, 74, 0.92);
        border: 2px solid #ffffff;
        border-radius: 9px;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
      }

      body.classroom-view-active .exit-classroom-view {
        display: block;
      }

      body.classroom-view-active .header-buttons {
        display: none;
      }

      body.classroom-view-active footer {
        display: none;
      }

      body.classroom-view-active main {
        margin-bottom: 20px;
      }

      body.classroom-view-active {
        overflow-x: hidden;
      }

      @media print {
        .classroom-view-button,
        .exit-classroom-view {
          display: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createLaunchButton() {
    const headerButtons =
      document.querySelector(".header-buttons");

    if (!headerButtons) {
      console.warn(
        "The Classroom View button could not be added."
      );

      return;
    }

    const launchButton =
      document.createElement("button");

    launchButton.type = "button";
    launchButton.className =
      "classroom-view-button";

    launchButton.textContent =
      "🖥️ Launch Classroom View";

    launchButton.addEventListener(
      "click",
      enterClassroomView
    );

    headerButtons.appendChild(launchButton);
  }

  function createExitButton() {
    const exitButton =
      document.createElement("button");

    exitButton.type = "button";
    exitButton.className =
      "exit-classroom-view";

    exitButton.textContent =
      "Exit Classroom View";

    exitButton.addEventListener(
      "click",
      exitClassroomView
    );

    document.body.appendChild(exitButton);
  }

  async function requestFullscreen() {
    const page = document.documentElement;

    try {
      if (page.requestFullscreen) {
        await page.requestFullscreen();
      } else if (
        page.webkitRequestFullscreen
      ) {
        await page.webkitRequestFullscreen();
      }
    } catch (error) {
      /*
        Some browsers or school-device policies
        may block fullscreen. The clean classroom
        layout will still work without it.
      */

      console.info(
        "Fullscreen was not available.",
        error
      );
    }
  }

  async function leaveFullscreen() {
    try {
      if (
        document.fullscreenElement &&
        document.exitFullscreen
      ) {
        await document.exitFullscreen();
      } else if (
        document.webkitFullscreenElement &&
        document.webkitExitFullscreen
      ) {
        await document.webkitExitFullscreen();
      }
    } catch (error) {
      console.info(
        "Fullscreen could not be exited automatically.",
        error
      );
    }
  }

  async function enterClassroomView() {
    classroomViewActive = true;

    document.body.classList.add(
      "classroom-view-active"
    );

    await requestFullscreen();
  }

  async function exitClassroomView() {
    classroomViewActive = false;

    document.body.classList.remove(
      "classroom-view-active"
    );

    await leaveFullscreen();
  }

  function handleFullscreenChange() {
    const isFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement;

    /*
      Pressing Escape exits browser fullscreen.
      When that happens, restore the teacher controls.
    */

    if (
      classroomViewActive &&
      !isFullscreen
    ) {
      classroomViewActive = false;

      document.body.classList.remove(
        "classroom-view-active"
      );
    }
  }

  function startClassroomViewFeature() {
    addClassroomViewStyles();
    createLaunchButton();
    createExitButton();

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startClassroomViewFeature
    );
  } else {
    startClassroomViewFeature();
  }
})();
