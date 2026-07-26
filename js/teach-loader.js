/*
==========================================
PATRIOT COMMAND
Teach — Load Today's Lesson
==========================================
*/

(function () {
  const ARCHIVE_URL =
    "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

  const TEACHER_PROFILE_KEY =
    "patriotTeacherProfile";

  function readTeacherProfile() {
    const saved =
      localStorage.getItem(
        TEACHER_PROFILE_KEY
      );

    if (!saved) {
      return {
        teacherName: "",
        teacherEmail: "",
        room: ""
      };
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "Teacher settings could not be read.",
        error
      );

      return {
        teacherName: "",
        teacherEmail: "",
        room: ""
      };
    }
  }

  function getTodayText() {
    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function isWeekend() {
    const day =
      new Date().getDay();

    return day === 0 || day === 6;
  }

  function timeToDate(timeText) {
    const [hours, minutes] =
      String(timeText)
        .split(":")
        .map(Number);

    const date = new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date;
  }

  function getCurrentPeriod() {
    if (
      typeof bellSchedule ===
        "undefined" ||
      !Array.isArray(bellSchedule)
    ) {
      return null;
    }

    const now = new Date();

    return (
      bellSchedule.find(period => {
        const start =
          timeToDate(period.start);

        const end =
          timeToDate(period.end);

        return (
          now >= start &&
          now < end
        );
      }) || null
    );
  }

  function normalizePeriod(value) {
    const text =
      String(value || "")
        .trim()
        .toLowerCase();

    const number =
      text.match(/\d+/);

    if (number) {
      return number[0];
    }

    return text;
  }

  function lessonMatchesPeriod(
    lesson,
    activePeriod
  ) {
    if (!lesson || !activePeriod) {
      return false;
    }

    const activeValue =
      normalizePeriod(
        activePeriod.name
      );

    return String(
      lesson.periods || ""
    )
      .split(",")
      .map(normalizePeriod)
      .includes(activeValue);
  }

  function setText(
    elementId,
    value,
    emptyMessage
  ) {
    const element =
      document.getElementById(
        elementId
      );

    if (!element) {
      return;
    }

    if (
      value &&
      String(value).trim()
    ) {
      element.textContent =
        String(value).trim();

      element.classList.remove(
        "empty-text"
      );
    } else {
      element.textContent =
        emptyMessage;

      element.classList.add(
        "empty-text"
      );
    }
  }

  function showAgenda(agendaText) {
    const list =
      document.getElementById(
        "agenda-display"
      );

    if (!list) {
      return;
    }

    list.innerHTML = "";

    const items =
      String(agendaText || "")
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);

    if (!items.length) {
      const item =
        document.createElement("li");

      item.textContent =
        "No agenda has been entered.";

      item.className =
        "empty-text";

      list.appendChild(item);

      return;
    }

    items.forEach(itemText => {
      const item =
        document.createElement("li");

      item.textContent = itemText;

      list.appendChild(item);
    });
  }

  function parseResources(value) {
    if (!value) {
      return [];
    }

    try {
      const resources =
        typeof value === "string"
          ? JSON.parse(value)
          : value;

      return Array.isArray(resources)
        ? resources
        : [];
    } catch (error) {
      return [];
    }
  }

  function convertYouTubeLink(url) {
    try {
      const parsedUrl =
        new URL(url);

      if (
        parsedUrl.hostname.includes(
          "youtu.be"
        )
      ) {
        const videoId =
          parsedUrl.pathname
            .replace("/", "");

        return videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : url;
      }

      if (
        parsedUrl.hostname.includes(
          "youtube.com"
        )
      ) {
        const videoId =
          parsedUrl.searchParams.get(
            "v"
          );

        return videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : url;
      }
    } catch (error) {
      return url;
    }

    return url;
  }

  function convertSlidesLink(url) {
    if (
      url.includes(
        "docs.google.com/presentation"
      ) &&
      url.includes("/edit")
    ) {
      return url
        .replace("/edit", "/embed")
        .split("?")[0];
    }

    return url;
  }

  function prepareEmbedLink(url) {
    let prepared =
      String(url || "").trim();

    prepared =
      convertYouTubeLink(prepared);

    prepared =
      convertSlidesLink(prepared);

    return prepared;
  }

  function showFirstResource(
    resourceText
  ) {
    const resources =
      parseResources(resourceText);

    const firstResource =
      resources.find(
        resource =>
          resource &&
          resource.url
      );

    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const placeholder =
      document.getElementById(
        "lesson-placeholder"
      );

    const openLink =
      document.getElementById(
        "open-lesson-link"
      );

    if (
      !frame ||
      !placeholder ||
      !openLink
    ) {
      return;
    }

    if (!firstResource) {
      frame.style.display = "none";
      frame.removeAttribute("src");

      placeholder.style.display =
        "flex";

      placeholder.innerHTML = `
        <strong>
          No lesson resource is attached.
        </strong>

        <span>
          Add a Slides, Canva, YouTube,
          PDF, or website link in the
          Lesson Planner.
        </span>
      `;

      openLink.style.display =
        "none";

      return;
    }

    frame.src =
      prepareEmbedLink(
        firstResource.url
      );

    frame.style.display =
      "block";

    placeholder.style.display =
      "none";

    openLink.href =
      firstResource.url;

    openLink.style.display =
      "inline-block";
  }

  function showLesson(
    lesson,
    activePeriod
  ) {
    const profile =
      readTeacherProfile();

    const periodDisplay =
  document.getElementById(
    "display-period"
  );

    const courseDisplay =
      document.getElementById(
        "display-course"
      );

    const roomDisplay =
      document.getElementById(
        "display-room"
      );

    if (periodDisplay) {
  periodDisplay.textContent =
    activePeriod
      ? activePeriod.name
      : "Current Period";
}

    if (courseDisplay) {
      courseDisplay.textContent =
        lesson.course ||
        "Course";
    }

    if (roomDisplay) {
      roomDisplay.textContent =
        profile.room || "";
    }

    setText(
      "bellringer-display",
      lesson.bellRinger,
      "No bell ringer has been entered."
    );

    setText(
      "ican-display",
      lesson.learningTarget,
      "No learning target has been entered."
    );

    setText(
      "success-display",
      lesson.successCriteria,
      "No success criteria have been entered."
    );

    setText(
      "profile-title",
      lesson.profileComponent,
      "Profile of a Patriot"
    );

    setText(
      "profile-description",
      lesson.profileFocus,
      "No specific focus has been entered."
    );

    showAgenda(
      lesson.agenda
    );

    showFirstResource(
      lesson.lessonResources
    );

    if (
      activePeriod &&
      document.getElementById(
        "period-name"
      )
    ) {
      document.getElementById(
        "period-name"
      ).textContent =
        activePeriod.name;
    }
  }

  function showNoLesson(message) {
    const courseDisplay =
  document.getElementById(
    "display-course"
  );

const periodDisplay =
  document.getElementById(
    "display-period"
  );

if (courseDisplay) {
  courseDisplay.textContent =
    isWeekend()
      ? "Weekend"
      : "No Active Class";
}

if (periodDisplay) {
  periodDisplay.textContent =
    isWeekend()
      ? "No Classes Scheduled"
      : "Outside Scheduled Class Time";
}
    setText(
      "bellringer-display",
      "",
      message
    );

    setText(
      "ican-display",
      "",
      "No lesson is scheduled right now."
    );

    setText(
      "success-display",
      "",
      "No lesson is scheduled right now."
    );

    setText(
      "profile-title",
      "",
      "Profile of a Patriot"
    );

    setText(
      "profile-description",
      "",
      "No lesson is scheduled right now."
    );

    showAgenda("");

    showFirstResource("");
  }

  function selectLesson(
    lessons,
    activePeriod
  ) {
    const today =
      getTodayText();

    const todayLessons =
      lessons.filter(
        lesson =>
          String(
            lesson.lessonDate || ""
          ).slice(0, 10) === today
      );

    return (
      todayLessons.find(
        lesson =>
          lessonMatchesPeriod(
            lesson,
            activePeriod
          )
      ) || null
    );
  }

  function loadTodayLesson() {
    if (isWeekend()) {
      showNoLesson(
        "Enjoy your weekend! No classes are scheduled today."
      );

      return;
    }

    const teacher =
      readTeacherProfile();

    if (!teacher.teacherEmail) {
      showNoLesson(
        "Complete Teacher Settings to load today’s lesson."
      );

      return;
    }

    const activePeriod =
      getCurrentPeriod();

    if (!activePeriod) {
      showNoLesson(
        "No class is currently in session."
      );

      return;
    }

    const callbackName =
      "patriotTeachCallback";

    window[callbackName] =
      function (response) {
        if (
          !response ||
          response.success !== true
        ) {
          showNoLesson(
            "Today’s lesson could not be loaded."
          );

          return;
        }

        const lesson =
          selectLesson(
            response.lessons || [],
            activePeriod
          );

        if (!lesson) {
          showNoLesson(
            "No lesson is saved for this class today."
          );

          return;
        }

        showLesson(
          lesson,
          activePeriod
        );

        delete window[
          callbackName
        ];
      };

    const script =
      document.createElement(
        "script"
      );

    script.src =
      ARCHIVE_URL +
      "?action=listLessons" +
      "&teacherEmail=" +
      encodeURIComponent(
        teacher.teacherEmail
      ) +
      "&callback=" +
      callbackName +
      "&time=" +
      Date.now();

    script.onerror =
      function () {
        showNoLesson(
          "Patriot Command could not reach the Lesson Library."
        );
      };

    document.body.appendChild(
      script
    );
  }

  function startTeachLoader() {
    /*
      Wait briefly so the existing Teach
      page finishes loading first.
    */
    setTimeout(
      loadTodayLesson,
      300
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startTeachLoader
    );
  } else {
    startTeachLoader();
  }
})();
