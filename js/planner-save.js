/*
==========================================
PATRIOT COMMAND
Full-Page Lesson Planner Saving
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
        room: "",
        classes: {}
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
        room: "",
        classes: {}
      };
    }
  }

  function createLessonId() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID ===
        "function"
    ) {
      return window.crypto.randomUUID();
    }

    return (
      "lesson-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(16)
        .slice(2)
    );
  }

  function getTodayText() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function collectSelectedClasses() {
    return Array.from(
      document.querySelectorAll(
        'input[name="planner-class"]:checked'
      )
    ).map(checkbox => ({
      period: checkbox.value,
      course:
        checkbox.dataset.course || ""
    }));
  }

  function collectResources() {
    return Array.from(
      document.querySelectorAll(
        ".resource-row"
      )
    )
      .map(row => {
        const typeInput =
          row.querySelector(
            ".resource-type"
          );

        const urlInput =
          row.querySelector(
            ".resource-url"
          );

        return {
          type:
            typeInput
              ? typeInput.value
              : "other",

          url:
            urlInput
              ? urlInput.value.trim()
              : ""
        };
      })
      .filter(resource => resource.url);
  }

  function isCompleteWebAddress(url) {
    try {
      const parsed = new URL(url);

      return (
        parsed.protocol === "https:" ||
        parsed.protocol === "http:"
      );
    } catch (error) {
      return false;
    }
  }

  function getSelectedText(selectId) {
    const select =
      document.getElementById(selectId);

    if (
      !select ||
      select.selectedIndex < 0
    ) {
      return "";
    }

    return select.options[
      select.selectedIndex
    ].textContent.trim();
  }

  function collectLesson() {
    const selectedClasses =
      collectSelectedClasses();

    const profileComponent =
      document
        .getElementById(
          "profile-component"
        )
        .value;

    return {
      lessonId: createLessonId(),

      lessonDate:
        document
          .getElementById(
            "lesson-date"
          )
          .value,

      lessonTitle:
        document
          .getElementById(
            "lesson-title"
          )
          .value.trim(),

      assignedPeriods:
        selectedClasses.map(
          item => item.period
        ),

      assignedCourses:
        selectedClasses.map(
          item => item.course
        ),

      bellRinger:
        document
          .getElementById(
            "bell-ringer"
          )
          .value.trim(),

      agenda:
        document
          .getElementById(
            "agenda"
          )
          .value.trim(),

      learningTarget:
        document
          .getElementById(
            "learning-target"
          )
          .value.trim(),

      profileId:
        profileComponent,

      profileComponent:
        getSelectedText(
          "profile-component"
        ),

      profileFocus:
        document
          .getElementById(
            "profile-focus"
          )
          .value,

      standards:
        document
          .getElementById(
            "standards"
          )
          .value.trim(),

      resources:
        collectResources(),

      successCriteria:
        document
          .getElementById(
            "success-criteria"
          )
          .value.trim(),

      whyLearning:
        document
          .getElementById(
            "why-learning"
          )
          .value.trim(),

      materials:
        document
          .getElementById(
            "materials"
          )
          .value.trim(),

      teacherNotes:
        document
          .getElementById(
            "teacher-notes"
          )
          .value.trim()
    };
  }

  function validateLesson(lesson) {
    const missing = [];

    if (!lesson.lessonDate) {
      missing.push("Lesson Date");
    }

    if (
      lesson.assignedPeriods.length === 0
    ) {
      missing.push(
        "At least one class"
      );
    }

    if (!lesson.bellRinger) {
      missing.push("Bell Ringer");
    }

    if (!lesson.agenda) {
      missing.push("Agenda");
    }

    if (!lesson.learningTarget) {
      missing.push(
        "I Can / Learning Target"
      );
    }

    if (!lesson.profileId) {
      missing.push(
        "Profile of a Patriot"
      );
    }

    if (!lesson.standards) {
      missing.push("Standards");
    }

    const invalidResource =
      lesson.resources.find(
        resource =>
          !isCompleteWebAddress(
            resource.url
          )
      );

    if (invalidResource) {
      missing.push(
        "Complete resource links beginning with https://"
      );
    }

    return missing;
  }

  async function sendLessonToArchive(
    lesson
  ) {
    const teacher =
      readTeacherProfile();

    const uniqueCourses = [
      ...new Set(
        lesson.assignedCourses.filter(
          Boolean
        )
      )
    ];

    const archiveData =
      new URLSearchParams({
        lessonId: lesson.lessonId,

        lessonDate:
          lesson.lessonDate,

        teacherEmail:
          teacher.teacherEmail || "",

        teacherName:
          teacher.teacherName || "",

        course:
          uniqueCourses.join(" / "),

        periods:
          lesson.assignedPeriods.join(
            ", "
          ),

        lessonTitle:
          lesson.lessonTitle ||
          `${uniqueCourses.join(
            " / "
          )} Lesson` ||
          "Lesson",

        bellRinger:
          lesson.bellRinger,

        agenda:
          lesson.agenda,

        learningTarget:
          lesson.learningTarget,

        whyLearning:
          lesson.whyLearning,

        successCriteria:
          lesson.successCriteria,

        standards:
          lesson.standards,

        profileComponent:
          lesson.profileComponent,

        profileFocus:
          lesson.profileFocus,

        lessonResources:
          JSON.stringify(
            lesson.resources
          ),

        materials:
          lesson.materials,

        teacherNotes:
          lesson.teacherNotes
      });

    await fetch(ARCHIVE_URL, {
      method: "POST",
      mode: "no-cors",
      body: archiveData
    });
  }

  function saveLessonLocally(lesson) {
    localStorage.setItem(
      "patriotLastPlannedLesson",
      JSON.stringify(lesson)
    );

    /*
      Keep the current Teach page compatible.
      Only today's lesson becomes the active
      classroom lesson automatically.
    */
    if (
      lesson.lessonDate ===
      getTodayText()
    ) {
      localStorage.setItem(
        "patriotDailyLesson",
        JSON.stringify({
          lessonId: lesson.lessonId,
          lessonDate:
            lesson.lessonDate,

          assignedPeriods:
            lesson.assignedPeriods,

          assignedCourses:
            lesson.assignedCourses,

          bellringer:
            lesson.bellRinger,

          agenda:
            lesson.agenda,

          ican:
            lesson.learningTarget,

          success:
            lesson.successCriteria,

          profileId:
            lesson.profileId,

          profileStatement:
            lesson.profileFocus,

          resources:
            lesson.resources
        })
      );
    }
  }

  function showStatus(message) {
    const status =
      document.getElementById(
        "planner-status"
      );

    if (!status) {
      return;
    }

    status.textContent = message;
    status.style.display = "block";

    status.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  async function handleSave(event) {
    event.preventDefault();

    const lesson = collectLesson();
    const missing =
      validateLesson(lesson);

    if (missing.length > 0) {
      window.alert(
        "Please complete:\n\n" +
        missing.join("\n")
      );

      return;
    }

    const saveButton =
      document.querySelector(
        ".save-button"
      );

    const originalText =
      saveButton.textContent;

    saveButton.disabled = true;
    saveButton.textContent =
      "Saving Lesson...";

    saveLessonLocally(lesson);

    try {
      await sendLessonToArchive(
        lesson
      );

      showStatus(
        "✓ Lesson saved and archived! You may now plan another class or return to the Dashboard."
      );

      localStorage.setItem(
        "patriotPlannerLastSaved",
        "true"
      );
    } catch (error) {
      console.error(
        "Lesson archive saving failed.",
        error
      );

      window.alert(
        "The lesson was saved on this computer, but the Google archive could not be reached. Check your internet connection and try again."
      );
    } finally {
      saveButton.disabled = false;
      saveButton.textContent =
        originalText;
    }
  }

  function startPlannerSaving() {
    const form =
      document.getElementById(
        "lesson-planner-form"
      );

    if (!form) {
      return;
    }

    form.addEventListener(
      "submit",
      handleSave
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startPlannerSaving
    );
  } else {
    startPlannerSaving();
  }
})();
