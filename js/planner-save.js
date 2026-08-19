/*
==========================================
PATRIOT COMMAND
Full-Page Lesson Planner Saving
Version 14
==========================================
*/

(function () {
  "use strict";

  const ARCHIVE_URL =
    "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

  const TEACHER_PROFILE_KEY = "patriotTeacherProfile";
  const EDIT_LESSON_KEY = "patriotEditLesson";
  const DUPLICATE_LESSON_KEY = "patriotDuplicateLesson";
  const TEACH_LESSON_KEY = "patriotTeachLesson";
  const DAILY_LESSON_KEY = "patriotDailyLesson";
  const PLANNER_DRAFT_KEY = "patriotPlannerUnsavedDraft";

  let activeLessonId = "";
  let saveInProgress = false;

  function readStoredJson(key, fallback = null) {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(`Stored data for ${key} could not be read.`, error);
      return fallback;
    }
  }

  function readTeacherProfile() {
    return readStoredJson(TEACHER_PROFILE_KEY, {
      teacherName: "",
      teacherEmail: "",
      room: "",
      classes: {}
    });
  }

  function getPlannerMode() {
    const mode = new URLSearchParams(window.location.search).get("mode");
    return mode === "edit" || mode === "duplicate" ? mode : "new";
  }

  function createLessonId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `lesson-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getLessonIdForSave() {
    const mode = getPlannerMode();

    if (mode === "edit") {
      const originalLesson = readStoredJson(EDIT_LESSON_KEY);

      if (originalLesson && originalLesson.lessonId) {
        activeLessonId = originalLesson.lessonId;
        return activeLessonId;
      }

      throw new Error(
        "The original lesson ID could not be found. Return to the Library and open the lesson again."
      );
    }

    if (!activeLessonId) {
      activeLessonId = createLessonId();
    }

    return activeLessonId;
  }

  function getTodayText() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
  }

  function isChecked(id) {
    const checkbox = document.getElementById(id);
    return Boolean(checkbox && checkbox.checked);
  }

  function getOptionalFieldValue(checkboxId, fieldId) {
    return isChecked(checkboxId) ? getFieldValue(fieldId) : "";
  }

  function getSelectedText(selectId) {
    const select = document.getElementById(selectId);
    if (!select || select.selectedIndex < 0) return "";
    return select.options[select.selectedIndex].textContent.trim();
  }

  function collectSelectedClasses() {
    return Array.from(
      document.querySelectorAll('input[name="planner-class"]:checked')
    ).map(checkbox => ({
      period: checkbox.value,
      course: checkbox.dataset.course || ""
    }));
  }

  function collectResources() {
    return Array.from(document.querySelectorAll(".resource-row"))
      .map(row => {
        const typeInput = row.querySelector(".resource-type");
        const urlInput = row.querySelector(".resource-url");

        return {
          type: typeInput ? typeInput.value : "other",
          url: urlInput ? urlInput.value.trim() : ""
        };
      })
      .filter(resource => resource.url);
  }

  function collectLesson() {
    const selectedClasses = collectSelectedClasses();
    const mode = getPlannerMode();
    const now = new Date().toISOString();

    let createdAt = now;
    let updatedAt = now;

    if (mode === "edit") {
      const originalLesson = readStoredJson(EDIT_LESSON_KEY);
      if (originalLesson) {
        createdAt = originalLesson.createdAt || now;
      }
    }

    if (mode === "duplicate") {
      createdAt = now;
      updatedAt = now;
    }

    const profileComponentField = document.getElementById("profile-component");
    const profileFocusField = document.getElementById("profile-focus");
    const vocabulary = getOptionalFieldValue("include-vocabulary", "vocabulary");
    const exitTicket = getOptionalFieldValue("include-exit-ticket", "exit-ticket");
    const homework = getOptionalFieldValue("include-homework", "homework");

    return {
      lessonId: getLessonIdForSave(),
      createdAt,
      updatedAt,
      lessonDate: getFieldValue("lesson-date"),
      lessonTitle: getFieldValue("lesson-title"),
      assignedPeriods: selectedClasses.map(item => item.period),
      assignedCourses: selectedClasses.map(item => item.course),
      bellRinger: getFieldValue("bell-ringer"),
      essentialQuestion: getFieldValue("essential-question"),
      learningTarget: getFieldValue("learning-target"),
      agenda: getFieldValue("agenda"),
      vocabulary,
      includeVocabulary: Boolean(vocabulary),
      profileId: profileComponentField ? profileComponentField.value : "",
      profileComponent: getSelectedText("profile-component"),
      profileFocus: profileFocusField ? profileFocusField.value : "",
      standards: getFieldValue("standards"),
      resources: collectResources(),
      exitTicket,
      includeExitTicket: Boolean(exitTicket),
      homework,
      includeHomework: Boolean(homework),
      successCriteria: getFieldValue("success-criteria"),
      whyLearning: getFieldValue("why-learning"),
      materials: getFieldValue("materials"),
      teacherNotes: getFieldValue("teacher-notes")
    };
  }

  function saveUnsavedDraft(lesson) {
    try {
      localStorage.setItem(PLANNER_DRAFT_KEY, JSON.stringify(lesson));
    } catch (error) {
      console.warn("The unsaved lesson draft could not be stored.", error);
    }
  }

  function clearUnsavedDraft() {
    localStorage.removeItem(PLANNER_DRAFT_KEY);
  }

  function setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (field) field.value = value || "";
  }

  function restoreOptionalField(checkboxId, fieldId, value) {
    const checkbox = document.getElementById(checkboxId);
    const field = document.getElementById(fieldId);
    if (!checkbox || !field) return;

    checkbox.checked = Boolean(String(value || "").trim());
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    field.value = value || "";
  }

  function restoreSelectedClasses(assignedPeriods) {
    const periods = Array.isArray(assignedPeriods) ? assignedPeriods : [];

    document
      .querySelectorAll('input[name="planner-class"]')
      .forEach(checkbox => {
        checkbox.checked = periods.includes(checkbox.value);
      });
  }

  function restoreUnsavedDraft(attempts = 0) {
    if (getPlannerMode() !== "new") return;

    const draft = readStoredJson(PLANNER_DRAFT_KEY);
    if (!draft) return;

    const classOptions = document.querySelectorAll('input[name="planner-class"]');
    if (classOptions.length === 0 && attempts < 30) {
      window.setTimeout(() => restoreUnsavedDraft(attempts + 1), 100);
      return;
    }

    activeLessonId = draft.lessonId || "";

    setFieldValue("lesson-date", draft.lessonDate);
    setFieldValue("lesson-title", draft.lessonTitle);
    setFieldValue("bell-ringer", draft.bellRinger);
    setFieldValue("essential-question", draft.essentialQuestion);
    setFieldValue("learning-target", draft.learningTarget);
    setFieldValue("agenda", draft.agenda);
    setFieldValue("standards", draft.standards);
    setFieldValue("success-criteria", draft.successCriteria);
    setFieldValue("why-learning", draft.whyLearning);
    setFieldValue("materials", draft.materials);
    setFieldValue("teacher-notes", draft.teacherNotes);

    restoreOptionalField("include-vocabulary", "vocabulary", draft.vocabulary);
    restoreOptionalField("include-exit-ticket", "exit-ticket", draft.exitTicket);
    restoreOptionalField("include-homework", "homework", draft.homework);
    restoreSelectedClasses(draft.assignedPeriods);

    const profileComponent = document.getElementById("profile-component");
    if (profileComponent && draft.profileId) {
      profileComponent.value = draft.profileId;
      profileComponent.dispatchEvent(new Event("change", { bubbles: true }));
      window.setTimeout(() => setFieldValue("profile-focus", draft.profileFocus), 100);
    }

    showStatus("Your unsaved lesson draft was restored.");
  }

  function isCompleteWebAddress(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch (error) {
      return false;
    }
  }

  function validateLesson(lesson) {
    const missing = [];

    if (!lesson.lessonDate) missing.push("Lesson Date");
    if (lesson.assignedPeriods.length === 0) missing.push("At least one class");
    if (!lesson.bellRinger) missing.push("Bell Ringer");
    if (!lesson.essentialQuestion) missing.push("Essential Question");
    if (!lesson.learningTarget) missing.push("I Can / Learning Target");
    if (!lesson.agenda) missing.push("Agenda");
    if (!lesson.profileId) missing.push("Profile of a Patriot");
    if (!lesson.standards) missing.push("Standards");

    if (lesson.resources.some(resource => !isCompleteWebAddress(resource.url))) {
      missing.push("Complete resource links beginning with https://");
    }

    return missing;
  }

  function focusFirstMissingField(missing) {
    const selectors = {
      "Lesson Date": "#lesson-date",
      "At least one class": "#planner-class-options",
      "Bell Ringer": "#bell-ringer",
      "Essential Question": "#essential-question",
      "I Can / Learning Target": "#learning-target",
      Agenda: "#agenda",
      "Profile of a Patriot": "#profile-component",
      Standards: "#standards",
      "Complete resource links beginning with https://": ".resource-url"
    };

    const field = document.querySelector(selectors[missing[0]] || "");
    if (!field) return;

    field.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      if (typeof field.focus === "function") {
        field.focus({ preventScroll: true });
      }
    }, 350);
  }

  async function sendLessonToArchive(lesson) {
    const teacher = readTeacherProfile();
    const uniqueCourses = [...new Set(lesson.assignedCourses.filter(Boolean))];
    const defaultTitle = uniqueCourses.length
      ? `${uniqueCourses.join(" / ")} Lesson`
      : "Lesson";

    const archiveData = new URLSearchParams({
      lessonId: lesson.lessonId,
      createdAt: lesson.createdAt || "",
      updatedAt: lesson.updatedAt || "",
      lessonDate: lesson.lessonDate,
      teacherEmail: teacher.teacherEmail || "",
      teacherName: teacher.teacherName || "",
      course: uniqueCourses.join(" / "),
      periods: lesson.assignedPeriods.join(", "),
      lessonTitle: lesson.lessonTitle || defaultTitle,
      bellRinger: lesson.bellRinger,
      essentialQuestion: lesson.essentialQuestion,
      learningTarget: lesson.learningTarget,
      agenda: lesson.agenda,
      vocabulary: lesson.vocabulary,
      whyLearning: lesson.whyLearning,
      successCriteria: lesson.successCriteria,
      standards: lesson.standards,
      profileComponent: lesson.profileComponent,
      profileFocus: lesson.profileFocus,
      lessonResources: JSON.stringify(lesson.resources),
      exitTicket: lesson.exitTicket,
      homework: lesson.homework,
      materials: lesson.materials,
      teacherNotes: lesson.teacherNotes
    });

    const archiveRequest = fetch(ARCHIVE_URL, {
      method: "POST",
      mode: "no-cors",
      body: archiveData
    }).catch(error => {
      console.warn("The lesson archive request did not finish normally.", error);
    });

    const timeout = new Promise(resolve => window.setTimeout(resolve, 8000));
    await Promise.race([archiveRequest, timeout]);
  }

  function createClassroomLesson(lesson) {
    return {
      lessonId: lesson.lessonId,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      lessonDate: lesson.lessonDate,
      lessonTitle: lesson.lessonTitle,
      assignedPeriods: lesson.assignedPeriods,
      assignedCourses: lesson.assignedCourses,
      bellringer: lesson.bellRinger,
      essentialQuestion: lesson.essentialQuestion,
      agenda: lesson.agenda,
      ican: lesson.learningTarget,
      success: lesson.successCriteria,
      profileId: lesson.profileId,
      profileComponent: lesson.profileComponent,
      profileStatement: lesson.profileFocus,
      standards: lesson.standards,
      vocabulary: lesson.vocabulary,
      resources: lesson.resources,
      exitTicket: lesson.exitTicket,
      homework: lesson.homework,
      whyLearning: lesson.whyLearning,
      materials: lesson.materials
    };
  }

  function saveLessonLocally(lesson, options = {}) {
    const classroomLesson = createClassroomLesson(lesson);

    localStorage.setItem("patriotLastPlannedLesson", JSON.stringify(lesson));

    if (lesson.lessonDate === getTodayText()) {
      localStorage.setItem(DAILY_LESSON_KEY, JSON.stringify(classroomLesson));
    }

    if (options.forceClassroom) {
      localStorage.removeItem(TEACH_LESSON_KEY);
      localStorage.setItem(TEACH_LESSON_KEY, JSON.stringify(classroomLesson));
      localStorage.setItem(DAILY_LESSON_KEY, JSON.stringify(classroomLesson));
    }
  }

  function showStatus(message) {
    const status = document.getElementById("planner-status");
    if (!status) return;

    status.textContent = message;
    status.style.display = "block";
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function cleanUpPlannerMode(mode) {
    if (mode === "edit") localStorage.removeItem(EDIT_LESSON_KEY);
    if (mode === "duplicate") localStorage.removeItem(DUPLICATE_LESSON_KEY);

    window.history.replaceState({}, document.title, window.location.pathname);
  }

  function updatePageAfterSave(mode) {
    const banner = document.getElementById("planner-mode-banner");
    if (banner) banner.remove();

    const saveButton = document.querySelector(".save-button");
    if (saveButton) saveButton.textContent = "Save Lesson";

    cleanUpPlannerMode(mode);
  }

  function resetIdentityAfterNewSave(mode) {
    if (mode === "edit") return;

    /*
    A completed new/duplicated lesson must never keep its ID as the
    identity for whatever the teacher plans next on this page. Without
    this reset, changing the date/content and pressing Save again updates
    the first archived lesson instead of creating a new one.
    */
    activeLessonId = "";
  }

  async function savePlannerLesson(options = {}) {
    if (saveInProgress) return false;

    const teachAfterSave = Boolean(options.teachAfterSave);
    const mode = getPlannerMode();
    let lesson;

    try {
      lesson = collectLesson();
    } catch (error) {
      window.alert(error.message);
      return false;
    }

    saveUnsavedDraft(lesson);

    const missing = validateLesson(lesson);
    if (missing.length) {
      window.alert(
        "Please complete:\n\n" +
          missing.join("\n") +
          "\n\nYour work has been preserved."
      );
      focusFirstMissingField(missing);
      return false;
    }

    saveInProgress = true;

    const saveButton = document.querySelector(".save-button");
    const teachButton = document.getElementById("teach-this-lesson-button");
    const originalSaveText = saveButton ? saveButton.textContent : "Save Lesson";
    const originalTeachText = teachButton ? teachButton.textContent : "Teach This Lesson";

    if (saveButton) saveButton.disabled = true;
    if (teachButton) teachButton.disabled = true;

    if (teachAfterSave && teachButton) {
      teachButton.textContent = "Preparing Classroom...";
    } else if (saveButton) {
      saveButton.textContent = mode === "edit" ? "Updating Lesson..." : "Saving Lesson...";
    }

    try {
      await sendLessonToArchive(lesson);
      saveLessonLocally(lesson, { forceClassroom: teachAfterSave });
      localStorage.setItem("patriotPlannerLastSaved", "true");
      clearUnsavedDraft();
      updatePageAfterSave(mode);
      resetIdentityAfterNewSave(mode);

      if (teachAfterSave) {
        showStatus("✓ Lesson saved! Opening the Teach workspace...");
        window.setTimeout(() => {
          window.location.href = "classroom.html";
        }, 450);
        return true;
      }

      if (mode === "edit") {
        showStatus("✓ Lesson updated successfully. Return to the Library to view the changes.");
      } else if (mode === "duplicate") {
        showStatus(
          "✓ Duplicated lesson saved as a new lesson. To make another day, change the date/content and Save Lesson again; it will be saved separately."
        );
      } else {
        showStatus(
          "✓ Lesson saved and archived! Any additional lesson you save from this page will now be created as a separate lesson."
        );
      }

      return true;
    } catch (error) {
      console.error("Lesson archive saving failed.", error);
      window.alert(
        "The Google lesson archive could not be reached. Check your internet connection and try again."
      );
      return false;
    } finally {
      saveInProgress = false;

      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = originalSaveText;
      }

      if (teachButton) {
        teachButton.disabled = false;
        teachButton.textContent = originalTeachText;
      }
    }
  }

  function startPlannerSaving() {
    const form = document.getElementById("lesson-planner-form");
    const teachButton = document.getElementById("teach-this-lesson-button");

    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();
        savePlannerLesson({ teachAfterSave: false });
      });
    }

    if (teachButton) {
      teachButton.addEventListener("click", () => {
        savePlannerLesson({ teachAfterSave: true });
      });
    }

    window.setTimeout(restoreUnsavedDraft, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startPlannerSaving);
  } else {
    startPlannerSaving();
  }
})();
