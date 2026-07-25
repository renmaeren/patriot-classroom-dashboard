/*
  PATRIOT COMMAND
  Planner Mode

  When classroom.html is opened with ?mode=plan,
  the lesson setup panel opens automatically.
*/

(function () {
  function openPlannerWhenRequested() {
    const parameters =
      new URLSearchParams(window.location.search);

    if (parameters.get("mode") !== "plan") {
      return;
    }

    /*
      Wait briefly so all lesson-planner features
      finish loading before opening the panel.
    */
    setTimeout(() => {
      if (
        typeof window.openLessonSetup === "function"
      ) {
        window.openLessonSetup();
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      openPlannerWhenRequested
    );
  } else {
    openPlannerWhenRequested();
  }
})();
