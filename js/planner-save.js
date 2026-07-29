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

  const EDIT_LESSON_KEY =
    "patriotEditLesson";

  const DUPLICATE_LESSON_KEY =
    "patriotDuplicateLesson";

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

  function readStoredLesson(key) {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "The stored lesson could not be read.",
        error
      );

      return null;
    }
  }

  function getPlannerMode() {
    const parameters =
      new URLSearchParams(
        window.location.search
      );

    const mode =
      parameters.get("mode");

    if (
      mode === "edit" ||
      mode === "duplicate"
    ) {
      return mode;
    }

    return "new";
  }

  function getLessonIdForSave() {
    const mode =
      getPlannerMode();

    if (mode === "edit") {
      const originalLesson =
        readStoredLesson(
          EDIT_LESSON_KEY
        );

      if (
        originalLesson &&
        originalLesson.lessonId
      ) {
        return originalLesson.lessonId;
      }

      throw new Error(
        "The original lesson ID could not be found. Return to the Library and open the lesson again."
      );
    }

    return createLessonId();
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

  function collectSelectedClasses() {
    return Array.from(
      document.querySelectorAll(
        'input[name="planner-class"]:checked'
      )
    ).map(checkbox => ({
      period:
        checkbox.value,

      course:
        checkbox.dataset.course ||
        ""
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
      .filter(resource => {
        return resource.url;
      });
  }

  function isCompleteWebAddress(url) {
    try {
      const parsed =
        new URL(url);

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
      document.getElementById(
        selectId
      );

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

  function getFieldValue(id) {
    const field =
      document.getElementById(id);

    if (!field) {
      return "";
    }

    return field.value.trim();
  }

  function collectLesson() {
    const selectedClasses =
      collectSelectedClasses();

    const profileComponentField =
      document.getElementById(
        "profile-component"
      );

    const profileFocusField =
      document.getElementById(
        "profile-focus"
      );

    return {
      lessonId:
        getLessonIdForSave(),

      lessonDate:
        getFieldValue(
          "lesson-date"
        ),

      lessonTitle:
        getFieldValue(
          "lesson-title"
        ),

      assignedPeriods:
        selectedClasses.map(
          item => item.period
        ),

      assignedCourses:
        selectedClasses.map(
          item => item.course
        ),

      bellRinger:
        getFieldValue(
          "bell-ringer"
        ),

      agenda:
        getFieldValue(
          "agenda"
        ),

      learningTarget:
        getFieldValue(
          "learning-target"
        ),

      profileId:
        profileComponentField
          ? profileComponentField.value
          : "",

      profileComponent:
        getSelectedText(
          "profile-component"
        ),

      profileFocus:
        profileFocusField
          ? profileFocusField.value
          : "",

      standards:
        getFieldValue(
          "standards"
        ),

      resources:
        collectResources(),

      successCriteria:
        getFieldValue(
          "success-criteria"
        ),

      whyLearning:
        getFieldValue(
          "why-learning"
        ),

      materials:
        getFieldValue(
          "materials"
        ),

      teacherNotes:
        getFieldValue(
          "teacher-notes"
        )
    };
  }

  function validateLesson(lesson) {
    const missing = [];

    if (!lesson.lessonDate) {
      missing.push(
        "Lesson Date"
      );
    }

    if (
      lesson.assignedPeriods.length === 0
    ) {
      missing.push(
        "At least one class"
      );
    }

    if (!lesson.bellRinger) {
      missing.push(
        "Bell Ringer"
      );
    }

    if (!lesson.agenda) {
      missing.push(
        "Agenda"
      );
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
      missing.push(
        "Standards"
      );
    }

    const invalidResource =
      lesson.resources.find(
        resource => {
          return !isCompleteWebAddress(
            resource.url
          );
        }
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

    const defaultTitle =
      uniqueCourses.length > 0
        ? `${uniqueCourses.join(
            " / "
          )} Lesson`
        : "Lesson";

    const archiveData =
      new URLSearchParams({
        lessonId:
          lesson.lessonId,

        lessonDate:
          lesson.lessonDate,

        teacherEmail:
          teacher.teacherEmail ||
          "",

        teacherName:
          teacher.teacherName ||
          "",

        course:
          uniqueCourses.join(
            " / "
          ),

        periods:
          lesson.assignedPeriods.join(
            ", "
          ),

        lessonTitle:
          lesson.lessonTitle ||
          defaultTitle,

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

    await fetch(
      ARCHIVE_URL,
      {
        method: "POST",
        mode: "no-cors",
        body: archiveData
      }
    );
  }

  function saveLessonLocally(
    lesson
  ) {
    localStorage.setItem(
      "patriotLastPlannedLesson",
      JSON.stringify(lesson)
    );

    /*
      Only today's lesson becomes the
      active classroom lesson automatically.
    */
    if (
      lesson.lessonDate ===
      getTodayText()
    ) {
      localStorage.setItem(
        "patriotDailyLesson",
        JSON.stringify({
          lessonId:
            lesson.lessonId,

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

    status.textContent =
      message;

    status.style.display =
      "block";

    status.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function cleanUpPlannerMode(
    mode
  ) {
    if (mode === "edit") {
      localStorage.removeItem(
        EDIT_LESSON_KEY
      );
    }

    if (mode === "duplicate") {
      localStorage.removeItem(
        DUPLICATE_LESSON_KEY
      );
    }

    const cleanUrl =
      window.location.pathname;

    window.history.replaceState(
      {},
      document.title,
      cleanUrl
    );
  }

  function updatePageAfterSave(
    mode
  ) {
    const banner =
      document.getElementById(
        "planner-mode-banner"
      );

    if (banner) {
      banner.remove();
    }

    const saveButton =
      document.querySelector(
        ".save-button"
      );

    if (saveButton) {
      saveButton.textContent =
        "Save Lesson";
    }

    cleanUpPlannerMode(mode);
  }

  async function handleSave(event) {
    event.preventDefault();

    const mode =
      getPlannerMode();

    let lesson;

    try {
      lesson =
        collectLesson();
    } catch (error) {
      window.alert(
        error.message
      );

      return;
    }

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

    if (!saveButton) {
      return;
    }

    const originalText =
      saveButton.textContent;

    saveButton.disabled =
      true;

    saveButton.textContent =
      mode === "edit"
        ? "Updating Lesson..."
        : "Saving Lesson...";

    try {
      await sendLessonToArchive(
        lesson
      );

      saveLessonLocally(
        lesson
      );

      if (mode === "edit") {
        showStatus(
          "✓ Lesson updated successfully. Return to the Library to view the changes."
        );
      } else if (
        mode === "duplicate"
      ) {
        showStatus(
          "✓ Duplicated lesson saved as a new lesson. You may return to the Library or continue planning."
        );
      } else {
        showStatus(
          "✓ Lesson saved and archived! You may now plan another class or return to the Dashboard."
        );
      }

      localStorage.setItem(
        "patriotPlannerLastSaved",
        "true"
      );

      updatePageAfterSave(
        mode
      );
    } catch (error) {
      console.error(
        "Lesson archive saving failed.",
        error
      );

      window.alert(
        "The Google lesson archive could not be reached. Check your internet connection and try again."
      );

      saveButton.textContent =
        originalText;
    } finally {
      saveButton.disabled =
        false;
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
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startPlannerSaving
    );
  } else {
    startPlannerSaving();
  }
})();
