/*
==========================================
PATRIOT COMMAND
Teach — Automatic Period Refresh
==========================================
*/

(function () {
  function isTestMode() {
    const parameters =
      new URLSearchParams(
        window.location.search
      );

    return (
      parameters.get("test") === "true"
    );
  }

  function timeToMinutes(timeText) {
    const [hours, minutes] =
      String(timeText)
        .split(":")
        .map(Number);

    return (
      hours * 60 +
      minutes
    );
  }

  function getCurrentScheduleState() {
    if (
      typeof bellSchedule ===
        "undefined" ||
      !Array.isArray(bellSchedule)
    ) {
      return "schedule-unavailable";
    }

    const now =
      new Date();

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    const activePeriod =
      bellSchedule.find(period => {
        const start =
          timeToMinutes(
            period.start
          );

        const end =
          timeToMinutes(
            period.end
          );

        return (
          currentMinutes >= start &&
          currentMinutes < end
        );
      });

    if (!activePeriod) {
      return "outside-class-time";
    }

    return [
      activePeriod.name,
      activePeriod.start,
      activePeriod.end
    ].join("|");
  }

  function startAutomaticRefresh() {
    /*
      Developer test mode stays fixed
      until the tester refreshes it.
    */
    if (isTestMode()) {
      return;
    }

    let previousState =
      getCurrentScheduleState();

    setInterval(() => {
      const currentState =
        getCurrentScheduleState();

      if (
        currentState !==
        previousState
      ) {
        window.location.reload();
      }
    }, 15000);
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startAutomaticRefresh
    );
  } else {
    startAutomaticRefresh();
  }
})();
