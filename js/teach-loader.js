/*
==========================================
PATRIOT COMMAND
Teach — Lesson Loader

Supports:
1. Normal Teaching Mode
2. Developer Test Mode
3. Library Preview Mode
4. Teach from Library Mode
==========================================
*/

(function () {
  const ARCHIVE_URL =
    "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

  const TEACHER_PROFILE_KEY =
    "patriotTeacherProfile";

  const PREVIEW_LESSON_KEY =
    "patriotPreviewLesson";

  const TEACH_LESSON_KEY =
    "patriotTeachLesson";

  /*
  ==========================================
  SETTINGS
  ==========================================
  */

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

  /*
  ==========================================
  MODE DETECTION
  ==========================================
  */

  function readPageMode() {
    const parameters =
      new URLSearchParams(
        window.location.search
      );

    const mode =
      parameters.get("mode");

    if (mode === "teach") {
      return "teach";
    }

    if (mode === "preview") {
      return "preview";
    }

    if (
      parameters.get("test") ===
      "true"
    ) {
      return "test";
    }

    return "normal";
  }

  function readStoredLesson(
    storageKey,
    errorMessage
  ) {
    const saved =
      localStorage.getItem(
        storageKey
      );

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        errorMessage,
        error
      );

      return null;
    }
  }

  function readPreviewLesson() {
    return readStoredLesson(
      PREVIEW_LESSON_KEY,
      "The preview lesson could not be read."
    );
  }

  function readTeachLesson() {
    return readStoredLesson(
      TEACH_LESSON_KEY,
      "The selected teaching lesson could not be read."
    );
  }

  function readTestMode() {
    const parameters =
      new URLSearchParams(
        window.location.search
      );

    const testEnabled =
      parameters.get("test") ===
      "true";

    if (!testEnabled) {
      return null;
    }

    const testDate =
      parameters.get("date");

    const testPeriod =
      parameters.get("period");

    if (
      !testDate ||
      !testPeriod
    ) {
      return null;
    }

    return {
      date: testDate,
      period: testPeriod
    };
  }

  /*
  ==========================================
  DATE AND PERIOD HELPERS
  ==========================================
  */

  function getTodayText() {
    const testMode =
      readTestMode();

    if (testMode) {
      return testMode.date;
    }

    const today =
      new Date();

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

  function getEffectiveDate() {
    const dateText =
      getTodayText();

    const parts =
      dateText
        .split("-")
        .map(Number);

    if (parts.length !== 3) {
      return new Date();
    }

    return new Date(
      parts[0],
      parts[1] - 1,
      parts[2],
      12,
      0,
      0,
      0
    );
  }

  function isWeekend() {
    const day =
      getEffectiveDate()
        .getDay();

    return (
      day === 0 ||
      day === 6
    );
  }

  function timeToDate(timeText) {
    const [hours, minutes] =
      String(timeText)
        .split(":")
        .map(Number);

    const date =
      new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date;
  }

  function getPeriodSuffix(number) {
    if (number === "1") {
      return "st";
    }

    if (number === "2") {
      return "nd";
    }

    if (number === "3") {
      return "rd";
    }

    return "th";
  }

  function createTestPeriod(
    periodValue
  ) {
    const normalized =
      String(periodValue || "")
        .trim()
        .toLowerCase();

    if (
      normalized ===
      "advisory"
    ) {
      return {
        name: "Advisory",
        start: "10:52",
        end: "11:17",
        type: "advisory"
      };
    }

    const periodNumber =
      normalized.match(/\d+/);

    if (!periodNumber) {
      return null;
    }

    const number =
      periodNumber[0];

    return {
      name:
        `${number}${getPeriodSuffix(
          number
        )} Period`,

      start: "",
      end: "",
      type: "class"
    };
  }

  function getCurrentPeriod() {
    const testMode =
      readTestMode();

    if (testMode) {
      return createTestPeriod(
        testMode.period
      );
    }

    if (
      typeof bellSchedule ===
        "undefined" ||
      !Array.isArray(
        bellSchedule
      )
    ) {
      return null;
    }

    const now =
      new Date();

    return (
      bellSchedule.find(period => {
        const start =
          timeToDate(
            period.start
          );

        const end =
          timeToDate(
            period.end
          );

        return (
          now >= start &&
          now < end
        );
      }) || null
    );
  }

  function createStoredLessonPeriod(
    lesson,
    fallbackName
  ) {
    const periods =
      String(
        lesson.periods || ""
      ).trim();

    if (!periods) {
      return {
        name: fallbackName,
        start: "",
        end: "",
        type: "library"
      };
    }

    const periodList =
      periods
        .split(",")
        .map(period => {
          return period.trim();
        })
        .filter(Boolean);

    if (periodList.length === 1) {
      const normalized =
        periodList[0]
          .toLowerCase();

      if (
        normalized ===
        "advisory"
      ) {
        return {
          name: "Advisory",
          start: "",
          end: "",
          type: "library"
        };
      }

      const number =
        normalized.match(/\d+/);

      if (number) {
        return {
          name:
            `${number[0]}${getPeriodSuffix(
              number[0]
            )} Period`,

          start: "",
          end: "",
          type: "library"
        };
      }
    }

    return {
      name:
        `Periods ${periods}`,

      start: "",
      end: "",
      type: "library"
    };
  }

  function createPreviewPeriod(
    lesson
  ) {
    return createStoredLessonPeriod(
      lesson,
      "Lesson Preview"
    );
  }

  function createTeachPeriod(
    lesson
  ) {
    return createStoredLessonPeriod(
      lesson,
      "Teaching from Library"
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
    if (
      !lesson ||
      !activePeriod
    ) {
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

  function normalizeLessonDate(
    value
  ) {
    if (!value) {
      return "";
    }

    const text =
      String(value).trim();

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        text
      )
    ) {
      return text;
    }

    const date =
      new Date(text);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatLessonDate(
    value
  ) {
    const normalized =
      normalizeLessonDate(
        value
      );

    if (!normalized) {
      return "Date unavailable";
    }

    const parts =
      normalized
        .split("-")
        .map(Number);

    const date =
      new Date(
        parts[0],
        parts[1] - 1,
        parts[2],
        12,
        0,
        0
      );

    return date.toLocaleDateString(
      [],
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  }

  /*
  ==========================================
  LESSON DISPLAY HELPERS
  ==========================================
  */

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

  function showAgenda(
    agendaText
  ) {
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
        .map(item => {
          return item.trim();
        })
        .filter(Boolean);

    if (!items.length) {
      const item =
        document.createElement(
          "li"
        );

      item.textContent =
        "No agenda has been entered.";

      item.className =
        "empty-text";

      list.appendChild(item);

      return;
    }

    items.forEach(itemText => {
      const item =
        document.createElement(
          "li"
        );

      item.textContent =
        itemText;

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

      return Array.isArray(
        resources
      )
        ? resources
        : [];
    } catch (error) {
      return [];
    }
  }

  function convertYouTubeLink(
    url
  ) {
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

  function convertSlidesLink(
    url
  ) {
    if (
      url.includes(
        "docs.google.com/presentation"
      ) &&
      url.includes("/edit")
    ) {
      return url
        .replace(
          "/edit",
          "/embed"
        )
        .split("?")[0];
    }

    return url;
  }

  function prepareEmbedLink(
    url
  ) {
    let prepared =
      String(url || "")
        .trim();

    prepared =
      convertYouTubeLink(
        prepared
      );

    prepared =
      convertSlidesLink(
        prepared
      );

    return prepared;
  }

  function showFirstResource(
    resourceText
  ) {
    const resources =
      parseResources(
        resourceText
      );

    const firstResource =
      resources.find(resource => {
        return (
          resource &&
          resource.url
        );
      });

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
      frame.style.display =
        "none";

      frame.removeAttribute(
        "src"
      );

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

    const periodName =
      document.getElementById(
        "period-name"
      );

    if (
      activePeriod &&
      periodName
    ) {
      periodName.textContent =
        activePeriod.name;
    }
  }

  function showNoLesson(
    message
  ) {
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

  /*
  ==========================================
  NOTICE BANNERS
  ==========================================
  */

  function insertNotice(
    notice
  ) {
    const scheduleStrip =
      document.querySelector(
        ".schedule-strip"
      );

    if (scheduleStrip) {
      scheduleStrip.insertAdjacentElement(
        "beforebegin",
        notice
      );

      return;
    }

    document.body.insertAdjacentElement(
      "afterbegin",
      notice
    );
  }

  function showTestModeNotice() {
    const testMode =
      readTestMode();

    if (!testMode) {
      return;
    }

    const testPeriod =
      createTestPeriod(
        testMode.period
      );

    const existing =
      document.getElementById(
        "teach-test-mode-notice"
      );

    if (existing) {
      return;
    }

    const notice =
      document.createElement(
        "div"
      );

    notice.id =
      "teach-test-mode-notice";

    notice.textContent =
      `Test Mode: ${testMode.date} · ${
        testPeriod
          ? testPeriod.name
          : testMode.period
      }`;

    notice.style.cssText = `
      padding: 8px 14px;
      color: #11284a;
      font-weight: bold;
      text-align: center;
      background: #f6e3a7;
      border-bottom: 2px solid #d3a84f;
    `;

    insertNotice(notice);
  }

  function showPreviewModeNotice(
    lesson
  ) {
    const existing =
      document.getElementById(
        "teach-preview-mode-notice"
      );

    if (existing) {
      return;
    }

    const notice =
      document.createElement(
        "div"
      );

    notice.id =
      "teach-preview-mode-notice";

    notice.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 10px 16px;
      color: #11284a;
      font-weight: bold;
      text-align: center;
      background: #f6e3a7;
      border-bottom: 2px solid #d3a84f;
    `;

    const title =
      lesson.lessonTitle ||
      lesson.course ||
      "Untitled Lesson";

    const message =
      document.createElement(
        "span"
      );

    message.textContent =
      `Preview Mode: ${title} · ${formatLessonDate(
        lesson.lessonDate
      )}`;

    const exitButton =
      document.createElement(
        "button"
      );

    exitButton.type =
      "button";

    exitButton.textContent =
      "Exit Preview";

    exitButton.style.cssText = `
      padding: 7px 13px;
      color: #ffffff;
      font-weight: bold;
      background: #aa3235;
      border: 2px solid #aa3235;
      border-radius: 7px;
      cursor: pointer;
    `;

    exitButton.addEventListener(
      "click",
      exitPreviewMode
    );

    notice.appendChild(
      message
    );

    notice.appendChild(
      exitButton
    );

    insertNotice(notice);
  }

  function showTeachModeNotice(
    lesson
  ) {
    const existing =
      document.getElementById(
        "teach-library-mode-notice"
      );

    if (existing) {
      return;
    }

    const notice =
      document.createElement(
        "div"
      );

    notice.id =
      "teach-library-mode-notice";

    notice.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 10px 16px;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      background: #11284a;
      border-bottom: 2px solid #07162b;
    `;

    const title =
      lesson.lessonTitle ||
      lesson.course ||
      "Untitled Lesson";

    const message =
      document.createElement(
        "span"
      );

    message.textContent =
      `Teaching from Library: ${title} · ${formatLessonDate(
        lesson.lessonDate
      )}`;

    const returnButton =
      document.createElement(
        "button"
      );

    returnButton.type =
      "button";

    returnButton.textContent =
      "Return to Today's Lesson";

    returnButton.style.cssText = `
      padding: 7px 13px;
      color: #11284a;
      font-weight: bold;
      background: #ffffff;
      border: 2px solid #ffffff;
      border-radius: 7px;
      cursor: pointer;
    `;

    returnButton.addEventListener(
      "click",
      exitTeachMode
    );

    notice.appendChild(
      message
    );

    notice.appendChild(
      returnButton
    );

    insertNotice(notice);
  }

  function exitPreviewMode() {
    localStorage.removeItem(
      PREVIEW_LESSON_KEY
    );

    window.location.href =
      "library.html";
  }

  function exitTeachMode() {
    localStorage.removeItem(
      TEACH_LESSON_KEY
    );

    window.location.href =
      "classroom.html";
  }

  /*
  ==========================================
  LESSON SELECTION
  ==========================================
  */

  function selectLesson(
    lessons,
    activePeriod
  ) {
    const today =
      getTodayText();

    const todayLessons =
      lessons.filter(lesson => {
        return (
          normalizeLessonDate(
            lesson.lessonDate
          ) === today
        );
      });

    return (
      todayLessons.find(lesson => {
        return lessonMatchesPeriod(
          lesson,
          activePeriod
        );
      }) || null
    );
  }

  /*
  ==========================================
  PREVIEW MODE
  ==========================================
  */

  function loadPreviewLesson() {
    const lesson =
      readPreviewLesson();

    if (!lesson) {
      showNoLesson(
        "The preview lesson could not be found. Return to the Library and select the lesson again."
      );

      showMissingPreviewNotice();

      return;
    }

    const previewPeriod =
      createPreviewPeriod(
        lesson
      );

    showPreviewModeNotice(
      lesson
    );

    showLesson(
      lesson,
      previewPeriod
    );
  }

  function showMissingPreviewNotice() {
    const existing =
      document.getElementById(
        "teach-preview-mode-notice"
      );

    if (existing) {
      return;
    }

    const notice =
      document.createElement(
        "div"
      );

    notice.id =
      "teach-preview-mode-notice";

    notice.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 10px 16px;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      background: #aa3235;
      border-bottom: 2px solid #7d2023;
    `;

    const message =
      document.createElement(
        "span"
      );

    message.textContent =
      "Preview Mode: No preview lesson was found.";

    const libraryButton =
      document.createElement(
        "button"
      );

    libraryButton.type =
      "button";

    libraryButton.textContent =
      "Return to Library";

    libraryButton.style.cssText = `
      padding: 7px 13px;
      color: #11284a;
      font-weight: bold;
      background: #ffffff;
      border: 2px solid #ffffff;
      border-radius: 7px;
      cursor: pointer;
    `;

    libraryButton.addEventListener(
      "click",
      function () {
        localStorage.removeItem(
          PREVIEW_LESSON_KEY
        );

        window.location.href =
          "library.html";
      }
    );

    notice.appendChild(
      message
    );

    notice.appendChild(
      libraryButton
    );

    insertNotice(notice);
  }

  /*
  ==========================================
  TEACH FROM LIBRARY MODE
  ==========================================
  */

  function loadLibraryTeachLesson() {
    const lesson =
      readTeachLesson();

    if (!lesson) {
      showNoLesson(
        "The selected lesson could not be found. Return to the Library and select Teach again."
      );

      showMissingTeachNotice();

      return;
    }

    const teachPeriod =
      createTeachPeriod(
        lesson
      );

    showTeachModeNotice(
      lesson
    );

    showLesson(
      lesson,
      teachPeriod
    );
  }

  function showMissingTeachNotice() {
    const existing =
      document.getElementById(
        "teach-library-mode-notice"
      );

    if (existing) {
      return;
    }

    const notice =
      document.createElement(
        "div"
      );

    notice.id =
      "teach-library-mode-notice";

    notice.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 10px 16px;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      background: #aa3235;
      border-bottom: 2px solid #7d2023;
    `;

    const message =
      document.createElement(
        "span"
      );

    message.textContent =
      "Teaching from Library: No lesson was found.";

    const libraryButton =
      document.createElement(
        "button"
      );

    libraryButton.type =
      "button";

    libraryButton.textContent =
      "Return to Library";

    libraryButton.style.cssText = `
      padding: 7px 13px;
      color: #11284a;
      font-weight: bold;
      background: #ffffff;
      border: 2px solid #ffffff;
      border-radius: 7px;
      cursor: pointer;
    `;

    libraryButton.addEventListener(
      "click",
      function () {
        localStorage.removeItem(
          TEACH_LESSON_KEY
        );

        window.location.href =
          "library.html";
      }
    );

    notice.appendChild(
      message
    );

    notice.appendChild(
      libraryButton
    );

    insertNotice(notice);
  }

  /*
  ==========================================
  NORMAL AND TEST MODES
  ==========================================
  */

  function loadScheduledLesson() {
    const testMode =
      readTestMode();

    showTestModeNotice();

    if (
      !testMode &&
      isWeekend()
    ) {
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

          delete window[
            callbackName
          ];

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

          delete window[
            callbackName
          ];

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

        delete window[
          callbackName
        ];
      };

    document.body.appendChild(
      script
    );
  }

  /*
  ==========================================
  MAIN LOADER
  ==========================================
  */

  function loadTeachPage() {
    const mode =
      readPageMode();

    if (mode === "teach") {
      loadLibraryTeachLesson();

      return;
    }

    if (mode === "preview") {
      loadPreviewLesson();

      return;
    }

    loadScheduledLesson();
  }

  function startTeachLoader() {
    setTimeout(
      loadTeachPage,
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
