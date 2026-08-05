/*
==========================================
PATRIOT COMMAND
Full-Page Lesson Planner Saving
Version 12
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

  const TEACH_LESSON_KEY =
    "patriotTeachLesson";

  const DAILY_LESSON_KEY =
    "patriotDailyLesson";

  const PLANNER_DRAFT_KEY =
    "patriotPlannerUnsavedDraft";
  let activeLessonId = "";
  let saveInProgress = false;

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
      activeLessonId =
        originalLesson.lessonId;

      return activeLessonId;
    }

    throw new Error(
      "The original lesson ID could not be found. Return to the Library and open the lesson again."
    );
  }

  if (activeLessonId) {
    return activeLessonId;
  }

  activeLessonId =
    createLessonId();

  return activeLessonId;
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

  function isChecked(id) {
    const checkbox =
      document.getElementById(id);

    return Boolean(
      checkbox &&
      checkbox.checked
    );
  }

  function getOptionalFieldValue(
    checkboxId,
    fieldId
  ) {
    if (!isChecked(checkboxId)) {
      return "";
    }

    return getFieldValue(fieldId);
  }

  function collectLesson() {
    const selectedClasses =
      collectSelectedClasses();
    const mode =
  getPlannerMode();

let createdAt =
  new Date().toISOString();

let updatedAt =
  new Date().toISOString();

if (mode === "edit") {
  const originalLesson =
    readStoredLesson(
      EDIT_LESSON_KEY
    );

  if (originalLesson) {
    createdAt =
      originalLesson.createdAt ||
      createdAt;
  }
}

if (mode === "duplicate") {
  createdAt =
    new Date().toISOString();

  updatedAt =
    createdAt;
}

    const profileComponentField =
      document.getElementById(
        "profile-component"
      );

    const profileFocusField =
      document.getElementById(
        "profile-focus"
      );

    const vocabulary =
      getOptionalFieldValue(
        "include-vocabulary",
        "vocabulary"
      );

    const exitTicket =
      getOptionalFieldValue(
        "include-exit-ticket",
        "exit-ticket"
      );

    const homework =
      getOptionalFieldValue(
        "include-homework",
        "homework"
      );

    return {
      lessonId:
        getLessonIdForSave(),
      createdAt:
        createdAt,

      updatedAt:
        updatedAt,

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

      essentialQuestion:
        getFieldValue(
          "essential-question"
        ),

      learningTarget:
        getFieldValue(
          "learning-target"
        ),

      agenda:
        getFieldValue(
          "agenda"
        ),

      vocabulary:
        vocabulary,

      includeVocabulary:
        Boolean(vocabulary),

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

      exitTicket:
        exitTicket,

      includeExitTicket:
        Boolean(exitTicket),

      homework:
        homework,

      includeHomework:
        Boolean(homework),

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
    function saveUnsavedDraft(
    lesson
  ) {
    if (!lesson) {
      return;
    }

    try {
      localStorage.setItem(
        PLANNER_DRAFT_KEY,
        JSON.stringify(
          lesson
        )
      );
    } catch (error) {
      console.warn(
        "The unsaved lesson draft could not be stored.",
        error
      );
    }
  }

  function clearUnsavedDraft() {
    localStorage.removeItem(
      PLANNER_DRAFT_KEY
    );
  }

  function setFieldValue(
    id,
    value
  ) {
    const field =
      document.getElementById(id);

    if (!field) {
      return;
    }

    field.value =
      value || "";
  }

  function restoreSelectedClasses(
    assignedPeriods
  ) {
    const periods =
      Array.isArray(
        assignedPeriods
      )
        ? assignedPeriods
        : [];

    document
      .querySelectorAll(
        'input[name="planner-class"]'
      )
      .forEach(checkbox => {
        checkbox.checked =
          periods.includes(
            checkbox.value
          );
      });
  }

  function restoreOptionalField(
    checkboxId,
    fieldId,
    value
  ) {
    const checkbox =
      document.getElementById(
        checkboxId
      );

    const field =
      document.getElementById(
        fieldId
      );

    if (!checkbox || !field) {
      return;
    }

    const hasValue =
      Boolean(
        String(value || "").trim()
      );

    checkbox.checked =
      hasValue;

    checkbox.dispatchEvent(
      new Event(
        "change",
        {
          bubbles: true
        }
      )
    );

    field.value =
      value || "";
  }

  function restoreUnsavedDraft(
    attempts = 0
  ) {
    if (
      getPlannerMode() !== "new"
    ) {
      return;
    }

    const draft =
      readStoredLesson(
        PLANNER_DRAFT_KEY
      );

    if (!draft) {
      return;
    }

    const classOptions =
      document.querySelectorAll(
        'input[name="planner-class"]'
      );

    if (
      classOptions.length === 0 &&
      attempts < 30
    ) {
      window.setTimeout(
        () => {
          restoreUnsavedDraft(
            attempts + 1
          );
        },
        100
      );

      return;
    }

    activeLessonId =
      draft.lessonId || "";

    setFieldValue(
      "lesson-date",
      draft.lessonDate
    );

    setFieldValue(
      "lesson-title",
      draft.lessonTitle
    );

    setFieldValue(
      "bell-ringer",
      draft.bellRinger
    );

    setFieldValue(
      "essential-question",
      draft.essentialQuestion
    );

    setFieldValue(
      "learning-target",
      draft.learningTarget
    );

    setFieldValue(
      "agenda",
      draft.agenda
    );

    setFieldValue(
      "standards",
      draft.standards
    );

    setFieldValue(
      "success-criteria",
      draft.successCriteria
    );

    setFieldValue(
      "why-learning",
      draft.whyLearning
    );

    setFieldValue(
      "materials",
      draft.materials
    );

    setFieldValue(
      "teacher-notes",
      draft.teacherNotes
    );

    restoreOptionalField(
      "include-vocabulary",
      "vocabulary",
      draft.vocabulary
    );

    restoreOptionalField(
      "include-exit-ticket",
      "exit-ticket",
      draft.exitTicket
    );

    restoreOptionalField(
      "include-homework",
      "homework",
      draft.homework
    );

    restoreSelectedClasses(
      draft.assignedPeriods
    );

    const profileComponent =
      document.getElementById(
        "profile-component"
      );

    if (
      profileComponent &&
      draft.profileId
    ) {
      profileComponent.value =
        draft.profileId;

      profileComponent.dispatchEvent(
        new Event(
          "change",
          {
            bubbles: true
          }
        )
      );

      window.setTimeout(
        () => {
          setFieldValue(
            "profile-focus",
            draft.profileFocus
          );
        },
        100
      );
    }

    showStatus(
      "Your unsaved lesson draft was restored."
    );
  }

  function getValidationField(
    missingItem
  ) {
    const validationFields = {
      "Lesson Date":
        "#lesson-date",

      "At least one class":
        "#planner-class-options",

      "Bell Ringer":
        "#bell-ringer",

      "Essential Question":
        "#essential-question",

      "I Can / Learning Target":
        "#learning-target",

      "Agenda":
        "#agenda",

      "Profile of a Patriot":
        "#profile-component",

      "Standards":
        "#standards",

      "Complete resource links beginning with https://":
        ".resource-url"
    };

    return document.querySelector(
      validationFields[
        missingItem
      ] || ""
    );
  }

  function focusFirstMissingField(
    missing
  ) {
    const firstMissing =
      getValidationField(
        missing[0]
      );

    if (!firstMissing) {
      return;
    }

    firstMissing.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    window.setTimeout(
      () => {
        if (
          typeof firstMissing.focus ===
          "function"
        ) {
          firstMissing.focus({
            preventScroll: true
          });
        }
      },
      350
    );
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

    if (!lesson.essentialQuestion) {
      missing.push(
        "Essential Question"
      );
    }

    if (!lesson.learningTarget) {
      missing.push(
        "I Can / Learning Target"
      );
    }

    if (!lesson.agenda) {
      missing.push(
        "Agenda"
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

    createdAt:
      lesson.createdAt ||
      "",

    updatedAt:
      lesson.updatedAt ||
      "",

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

        essentialQuestion:
          lesson.essentialQuestion,

        learningTarget:
          lesson.learningTarget,

        agenda:
          lesson.agenda,

        vocabulary:
          lesson.vocabulary,

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

        exitTicket:
          lesson.exitTicket,

        homework:
          lesson.homework,

        materials:
          lesson.materials,

        teacherNotes:
          lesson.teacherNotes
      });

    const archiveRequest =
      fetch(
        ARCHIVE_URL,
        {
          method: "POST",
          mode: "no-cors",
          body: archiveData
        }
      ).catch(error => {
        console.warn(
          "The lesson archive request did not finish normally.",
          error
        );
      });

    const archiveTimeout =
      new Promise(resolve => {
        window.setTimeout(
          resolve,
          8000
        );
      });

    /*
    Do not leave the Planner frozen if Google
    Apps Script takes too long to respond.

    Because this is a no-cors request, Patriot
    Command cannot reliably confirm the response
    anyway. The request may still finish in the
    background.
    */

    await Promise.race([
      archiveRequest,
      archiveTimeout
    ]);
  }

  function createClassroomLesson(
    lesson
  ) {
    return {
      lessonId:
        lesson.lessonId,

      createdAt:
        lesson.createdAt,

      updatedAt:
        lesson.updatedAt,

      lessonDate:
        lesson.lessonDate,

      lessonTitle:
        lesson.lessonTitle,

      assignedPeriods:
        lesson.assignedPeriods,

      assignedCourses:
        lesson.assignedCourses,

      bellringer:
        lesson.bellRinger,

      essentialQuestion:
        lesson.essentialQuestion,

      agenda:
        lesson.agenda,

      ican:
        lesson.learningTarget,

      success:
        lesson.successCriteria,

      profileId:
        lesson.profileId,

      profileComponent:
        lesson.profileComponent,

      profileStatement:
        lesson.profileFocus,

      standards:
        lesson.standards,

      vocabulary:
        lesson.vocabulary,

      resources:
        lesson.resources,

      exitTicket:
        lesson.exitTicket,

      homework:
        lesson.homework,

      whyLearning:
        lesson.whyLearning,

      materials:
        lesson.materials
    };
  }

  function saveLessonLocally(
    lesson,
    options = {}
  ) {
    const forceClassroom =
      Boolean(
        options.forceClassroom
      );

    const classroomLesson =
      createClassroomLesson(
        lesson
      );

    localStorage.setItem(
      "patriotLastPlannedLesson",
      JSON.stringify(
        lesson
      )
    );

    if (
      lesson.lessonDate ===
        getTodayText()
    ) {
      localStorage.setItem(
        DAILY_LESSON_KEY,
        JSON.stringify(
          classroomLesson
        )
      );
    }

    if (forceClassroom) {
      localStorage.removeItem(
        TEACH_LESSON_KEY
      );

      localStorage.setItem(
        TEACH_LESSON_KEY,
        JSON.stringify(
          classroomLesson
        )
      );

      localStorage.setItem(
        DAILY_LESSON_KEY,
        JSON.stringify(
          classroomLesson
        )
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

  async function savePlannerLesson(
    options = {}
  ) {
      if (saveInProgress) {
    return false;
  }
    
    const teachAfterSave =
      Boolean(
        options.teachAfterSave
      );

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

      return false;
    }

        /*
    Preserve the teacher's work before validation.
    If the page unexpectedly refreshes or another
    script interferes, the lesson can be restored.
    */

    saveUnsavedDraft(
      lesson
    );

    const missing =
      validateLesson(
        lesson
      );

      if (
      missing.length > 0
    ) {
      window.alert(
        "Please complete:\n\n" +
        missing.join("\n") +
        "\n\nYour work has been preserved."
      );

      focusFirstMissingField(
        missing
      );

      return false;
    }
      saveInProgress = true;

    const saveButton =
      document.querySelector(
        ".save-button"
      );

    const teachButton =
      document.getElementById(
        "teach-this-lesson-button"
      );

    const originalSaveText =
      saveButton
        ? saveButton.textContent
        : "Save Lesson";

    const originalTeachText =
      teachButton
        ? teachButton.textContent
        : "Teach This Lesson";

    if (saveButton) {
      saveButton.disabled =
        true;
    }

    if (teachButton) {
      teachButton.disabled =
        true;
    }

    if (teachAfterSave) {
      if (teachButton) {
        teachButton.textContent =
          "Preparing Classroom...";
      }
    } else if (saveButton) {
      saveButton.textContent =
        mode === "edit"
          ? "Updating Lesson..."
          : "Saving Lesson...";
    }

    try {
      await sendLessonToArchive(
        lesson
      );

      saveLessonLocally(
        lesson,
        {
          forceClassroom:
            teachAfterSave
        }
      );

            localStorage.setItem(
        "patriotPlannerLastSaved",
        "true"
      );

      clearUnsavedDraft();

      updatePageAfterSave(
        mode
      );

      if (teachAfterSave) {
        showStatus(
          "✓ Lesson saved! Opening the Teach workspace..."
        );

        window.setTimeout(
          () => {
            window.location.href =
              "classroom.html";
          },
          450
        );

        return true;
      }

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
          "✓ Lesson saved and archived! You may now teach this lesson or return to the Lesson Library."
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Lesson archive saving failed.",
        error
      );

      window.alert(
        "The Google lesson archive could not be reached. Check your internet connection and try again."
      );

      return false;
    } finally {
      saveInProgress = false;
      
      if (saveButton) {
        saveButton.disabled =
          false;

        saveButton.textContent =
          originalSaveText;
      }

      if (teachButton) {
        teachButton.disabled =
          false;

        teachButton.textContent =
          originalTeachText;
      }
    }
  }

  async function handleSave(
    event
  ) {
    event.preventDefault();

    await savePlannerLesson({
      teachAfterSave:
        false
    });
  }

  async function handleTeachLesson() {
    await savePlannerLesson({
      teachAfterSave:
        true
    });
  }

  function startPlannerSaving() {
    const form =
      document.getElementById(
        "lesson-planner-form"
      );

    const teachButton =
      document.getElementById(
        "teach-this-lesson-button"
      );

    if (form) {
      form.addEventListener(
        "submit",
        handleSave
      );
    }

    if (teachButton) {
      teachButton.addEventListener(
        "click",
        handleTeachLesson
      );
    }

    window.setTimeout(
      restoreUnsavedDraft,
      300
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
