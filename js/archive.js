/*
  PATRIOT CLASSROOM
  Google Sheets lesson archive connection
*/

const PATRIOT_ARCHIVE_URL =
  "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

function getLocalDateText() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createLessonId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return (
    "lesson-" +
    Date.now() +
    "-" +
    Math.random().toString(16).slice(2)
  );
}

async function sendLessonToArchive(lesson) {
  const teacherSettings = getTeacherSettings();
  const selectedProfile = findProfile(lesson.profileId);

  const archiveData = new URLSearchParams({
    lessonId: lesson.lessonId,
    lessonDate: getLocalDateText(),

    /*
      We will add automatic school-email collection
      during the account/setup stage.
    */
    teacherEmail: "",

    teacherName: teacherSettings.teacher,
    course: teacherSettings.course,
    periods: "",

    lessonTitle:
      teacherSettings.course + " Daily Lesson",

    bellRinger: lesson.bellringer,
    agenda: lesson.agenda,
    learningTarget: lesson.ican,

    whyLearning: "",
    successCriteria: lesson.success,
    standards: "",

    profileComponent:
      selectedProfile.title || "",

    profileFocus:
      lesson.profileStatement || "",

    lessonResourceLink:
      lesson.lessonLink || "",

    materials: "",
    teacherNotes: ""
  });

  /*
    no-cors is used because the GitHub site and
    Google Apps Script are hosted on different domains.
    The lesson still reaches the archive, although the
    browser cannot read Google's reply directly.
  */
  await fetch(PATRIOT_ARCHIVE_URL, {
    method: "POST",
    mode: "no-cors",
    body: archiveData
  });
}

/*
  This replaces the current Save & Launch action
  while preserving the same simple teacher workflow.
*/
window.saveAndLaunchLesson = async function () {
  const profileId =
    document.getElementById("profile-input").value;

  const lesson = {
    lessonId: createLessonId(),

    bellringer:
      document
        .getElementById("bellringer-input")
        .value.trim(),

    ican:
      document
        .getElementById("ican-input")
        .value.trim(),

    success:
      document
        .getElementById("success-input")
        .value.trim(),

    profileId: profileId,

    profileStatement:
      document
        .getElementById("profile-statement-input")
        .value,

    agenda:
      document
        .getElementById("agenda-input")
        .value.trim(),

    lessonLink:
      document
        .getElementById("lesson-link-input")
        .value.trim()
  };

  const missingFields = [];

  if (!lesson.bellringer) {
    missingFields.push("Bell Ringer");
  }

  if (!lesson.agenda) {
    missingFields.push("Agenda");
  }

  if (!lesson.ican) {
    missingFields.push("I Can Statement");
  }

  if (!profileId || profileId === "none") {
    missingFields.push("Profile of a Patriot");
  }

  if (missingFields.length > 0) {
    window.alert(
      "Please complete:\n\n" +
      missingFields.join("\n")
    );

    return;
  }

  const saveButton =
    document.querySelector(".save-launch-button");

  const originalButtonText =
    saveButton.textContent;

  saveButton.disabled = true;
  saveButton.textContent = "Saving Lesson...";

  /*
    Save immediately on the teacher's computer so the
    classroom display updates even if the internet is slow.
  */
  localStorage.setItem(
    "patriotDailyLesson",
    JSON.stringify(lesson)
  );

  applyLesson(lesson);

  try {
    await sendLessonToArchive(lesson);

    const message =
      document.getElementById(
        "lesson-save-message"
      );

    message.textContent =
      "Lesson saved and sent to the archive!";

    message.classList.add("show");

    setTimeout(closeLessonSetup, 1200);
  } catch (error) {
    console.error(
      "The lesson archive could not be reached.",
      error
    );

    window.alert(
      "Your classroom screen was saved, but the lesson " +
      "could not be sent to the archive. Check your " +
      "internet connection and try Save & Launch again."
    );
  } finally {
    saveButton.disabled = false;
    saveButton.textContent =
      originalButtonText;
  }
};
