/*
  PATRIOT COMMAND
  Lesson Planner Upgrade

  Adds:
  - advance lesson dates;
  - class and period assignments;
  - multiple lesson resources;
  - resource tabs on the classroom screen;
  - Google archive saving.
*/

(function () {
  const ARCHIVE_URL =
    "https://script.google.com/macros/s/AKfycbzGckJAit70HvekLOlIwNmaPVTv5-vb8o_orjRZDK0koTW-LTT4E6bgL1J9qiHBp_41/exec";

  const PROFILE_KEY = "patriotTeacherProfile";
  const LESSON_KEY = "patriotDailyLesson";

  let resourceCounter = 0;

  function readStoredJson(key, fallback) {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    try {
      return {
        ...fallback,
        ...JSON.parse(saved)
      };
    } catch (error) {
      console.error(
        "Saved information could not be read.",
        error
      );

      return fallback;
    }
  }

  function getTeacherProfile() {
    return readStoredJson(PROFILE_KEY, {
      teacherName: "",
      teacherEmail: "",
      room: "",
      classes: {}
    });
  }

  function getSavedLesson() {
    return readStoredJson(LESSON_KEY, {
      lessonId: "",
      lessonDate: getTodayText(),
      assignedPeriods: [],
      assignedCourses: [],
      bellringer: "",
      ican: "",
      success: "",
      profileId: "none",
      profileStatement: "",
      agenda: "",
      resources: []
    });
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

  function addPlannerStyles() {
    if (
      document.getElementById(
        "lesson-planner-upgrade-styles"
      )
    ) {
      return;
    }

    const style = document.createElement("style");

    style.id = "lesson-planner-upgrade-styles";

    style.textContent = `
      .planner-class-options {
        display: grid;
        gap: 9px;
      }

      .planner-class-choice {
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 11px 12px;
        background: #ffffff;
        border: 2px solid #d8d8d8;
        border-radius: 8px;
        cursor: pointer;
      }

      .planner-class-choice:hover {
        border-color: #d3a84f;
      }

      .planner-class-choice input {
        width: 20px;
        height: 20px;
        margin: 0;
        flex: 0 0 auto;
      }

      .planner-class-period {
        color: #11284a;
        font-weight: bold;
      }

      .planner-class-course {
        margin-left: 5px;
        color: #626b78;
      }

      .planner-warning {
        display: none;
        margin: 9px 0 0;
        padding: 10px;
        color: #713b00;
        background: #fff0cf;
        border-radius: 7px;
      }

      .planner-warning.show {
        display: block;
      }

      .resource-editor-list {
        display: grid;
        gap: 11px;
      }

      .resource-editor-row {
        padding: 12px;
        background: #ffffff;
        border: 2px solid #d8d8d8;
        border-radius: 9px;
      }

      .resource-editor-grid {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 9px;
      }

      .resource-editor-row select,
      .resource-editor-row input {
        width: 100%;
        padding: 10px;
        border: 2px solid #d8d8d8;
        border-radius: 7px;
      }

      .resource-label-input {
        margin-top: 9px;
      }

      .resource-remove-button,
      .resource-add-button {
        margin-top: 9px;
        padding: 9px 12px;
        color: #ffffff;
        font-weight: bold;
        border: 0;
        border-radius: 7px;
        cursor: pointer;
      }

      .resource-remove-button {
        background: #b3262e;
      }

      .resource-add-button {
        width: 100%;
        background: #11284a;
      }

      .resource-tabs {
        display: none;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px 14px;
        background: #e7ebf0;
        border-bottom: 1px solid #cdd3dc;
      }

      .resource-tabs.show {
        display: flex;
      }

      .resource-tab {
        padding: 8px 12px;
        color: #ffffff;
        font-weight: bold;
        background: #11284a;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
      }

      .resource-tab.active {
        background: #b3262e;
      }

      .resource-open-placeholder {
        position: absolute;
        inset: 0;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;
        padding: 30px;
        text-align: center;
        background: #f7f7f7;
      }

      .resource-open-placeholder.show {
        display: flex;
      }

      .resource-open-placeholder h3 {
        margin: 0;
        color: #11284a;
        font-size: 1.6rem;
      }

      .resource-open-placeholder a {
        padding: 13px 18px;
        color: #ffffff;
        font-weight: bold;
        text-decoration: none;
        background: #b3262e;
        border-radius: 9px;
      }

      @media (max-width: 650px) {
        .resource-editor-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createFormGroup(labelText) {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    label.textContent = labelText;

    group.appendChild(label);

    return group;
  }

  function insertDateField() {
    if (
      document.getElementById("lesson-date-input")
    ) {
      return;
    }

    const bellringer =
      document.getElementById("bellringer-input");

    const bellringerGroup =
      bellringer &&
      bellringer.closest(".form-group");

    if (!bellringerGroup) {
      return;
    }

    const group =
      createFormGroup("Lesson Date");

    const help =
      document.createElement("span");

    help.className = "form-help";

    help.textContent =
      "Choose today or any future planning date.";

    const input =
      document.createElement("input");

    input.id = "lesson-date-input";
    input.type = "date";
    input.value = getTodayText();

    group.appendChild(help);
    group.appendChild(input);

    bellringerGroup.parentNode.insertBefore(
      group,
      bellringerGroup
    );
  }

  function insertClassChoices() {
    if (
      document.getElementById(
        "planner-class-group"
      )
    ) {
      return;
    }

    const bellringer =
      document.getElementById("bellringer-input");

    const bellringerGroup =
      bellringer &&
      bellringer.closest(".form-group");

    if (!bellringerGroup) {
      return;
    }

    const group =
      createFormGroup("Use This Lesson For");

    group.id = "planner-class-group";

    const help =
      document.createElement("span");

    help.className = "form-help";

    help.textContent =
      "Check every class that will use this lesson.";

    const options =
      document.createElement("div");

    options.id = "planner-class-options";
    options.className =
      "planner-class-options";

    const warning =
      document.createElement("p");

    warning.id = "planner-class-warning";
    warning.className = "planner-warning";

    warning.textContent =
      "Complete Teacher Settings before assigning classes.";

    group.appendChild(help);
    group.appendChild(options);
    group.appendChild(warning);

    bellringerGroup.parentNode.insertBefore(
      group,
      bellringerGroup
    );
  }

  function buildClassChoices(
    selectedPeriods = []
  ) {
    const options =
      document.getElementById(
        "planner-class-options"
      );

    const warning =
      document.getElementById(
        "planner-class-warning"
      );

    if (!options || !warning) {
      return;
    }

    options.innerHTML = "";

    const profile = getTeacherProfile();

    const classes = Object.entries(
      profile.classes || {}
    ).filter(
      ([period, course]) =>
        period &&
        course &&
        String(course).trim()
    );

    if (classes.length === 0) {
      warning.classList.add("show");
      return;
    }

    warning.classList.remove("show");

    classes.forEach(
      ([period, course]) => {
        const label =
          document.createElement("label");

        label.className =
          "planner-class-choice";

        const checkbox =
          document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.name = "planner-class";
        checkbox.value = period;
        checkbox.dataset.course = course;

        checkbox.checked =
          selectedPeriods.includes(period);

        const text =
          document.createElement("span");

        text.innerHTML =
          `<span class="planner-class-period">` +
          `${escapeHtml(period)}</span>` +
          `<span class="planner-class-course">` +
          `— ${escapeHtml(course)}</span>`;

        label.appendChild(checkbox);
        label.appendChild(text);

        options.appendChild(label);
      }
    );
  }

  function insertResourceEditor() {
    if (
      document.getElementById(
        "resource-planner-group"
      )
    ) {
      return;
    }

    const oldLinkInput =
      document.getElementById(
        "lesson-link-input"
      );

    const oldGroup =
      oldLinkInput &&
      oldLinkInput.closest(".form-group");

    if (!oldGroup) {
      return;
    }

    oldGroup.style.display = "none";

    const group =
      createFormGroup("Lesson Resources");

    group.id = "resource-planner-group";

    const help =
      document.createElement("span");

    help.className = "form-help";

    help.textContent =
      "Add Slides, videos, StudySync, PDFs, Canva, or websites.";

    const list =
      document.createElement("div");

    list.id = "resource-editor-list";
    list.className = "resource-editor-list";

    const addButton =
      document.createElement("button");

    addButton.type = "button";
    addButton.className =
      "resource-add-button";

    addButton.textContent =
      "+ Add Another Resource";

    addButton.addEventListener(
      "click",
      () => addResourceRow()
    );

    group.appendChild(help);
    group.appendChild(list);
    group.appendChild(addButton);

    oldGroup.parentNode.insertBefore(
      group,
      oldGroup
    );
  }

  function addResourceRow(resource = {}) {
    resourceCounter += 1;

    const list =
      document.getElementById(
        "resource-editor-list"
      );

    if (!list) {
      return;
    }

    const row =
      document.createElement("div");

    row.className = "resource-editor-row";
    row.dataset.resourceRow = "true";

    row.innerHTML = `
      <div class="resource-editor-grid">
        <select class="resource-type-input">
          <option value="slides">Google Slides</option>
          <option value="video">Video / YouTube</option>
          <option value="studysync">StudySync</option>
          <option value="canva">Canva</option>
          <option value="pdf">PDF</option>
          <option value="website">Website</option>
          <option value="document">Google Doc</option>
          <option value="other">Other</option>
        </select>

        <input
          class="resource-url-input"
          type="url"
          placeholder="Paste the complete https:// link"
        >
      </div>

      <input
        class="resource-label-input"
        type="text"
        placeholder="Optional button label"
      >

      <button
        type="button"
        class="resource-remove-button"
      >
        Remove Resource
      </button>
    `;

    row.querySelector(
      ".resource-type-input"
    ).value = resource.type || "slides";

    row.querySelector(
      ".resource-url-input"
    ).value = resource.url || "";

    row.querySelector(
      ".resource-label-input"
    ).value = resource.label || "";

    row.querySelector(
      ".resource-remove-button"
    ).addEventListener("click", () => {
      row.remove();

      if (
        list.querySelectorAll(
          '[data-resource-row="true"]'
        ).length === 0
      ) {
        addResourceRow();
      }
    });

    list.appendChild(row);
  }

  function fillResourceRows(resources) {
    const list =
      document.getElementById(
        "resource-editor-list"
      );

    if (!list) {
      return;
    }

    list.innerHTML = "";

    const usableResources =
      Array.isArray(resources)
        ? resources
        : [];

    if (usableResources.length === 0) {
      addResourceRow();
      return;
    }

    usableResources.forEach(resource =>
      addResourceRow(resource)
    );
  }

  function collectSelectedClasses() {
    return Array.from(
      document.querySelectorAll(
        'input[name="planner-class"]:checked'
      )
    ).map(checkbox => ({
      period: checkbox.value,
      course: checkbox.dataset.course || ""
    }));
  }

  function collectResources() {
    return Array.from(
      document.querySelectorAll(
        '[data-resource-row="true"]'
      )
    )
      .map(row => {
        const type =
          row.querySelector(
            ".resource-type-input"
          ).value;

        const url =
          row.querySelector(
            ".resource-url-input"
          ).value.trim();

        const customLabel =
          row.querySelector(
            ".resource-label-input"
          ).value.trim();

        return {
          type: type,
          url: url,
          label:
            customLabel ||
            getDefaultResourceLabel(type)
        };
      })
      .filter(resource => resource.url);
  }

  function getDefaultResourceLabel(type) {
    const labels = {
      slides: "Google Slides",
      video: "Video",
      studysync: "StudySync",
      canva: "Canva",
      pdf: "PDF",
      website: "Website",
      document: "Google Doc",
      other: "Resource"
    };

    return labels[type] || "Resource";
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

  function createResourceDisplay() {
    if (
      document.getElementById(
        "resource-tabs"
      )
    ) {
      return;
    }

    const lessonWindow =
      document.querySelector(".lesson-window");

    const lessonHeader =
      document.querySelector(
        ".lesson-window-header"
      );

    if (!lessonWindow || !lessonHeader) {
      return;
    }

    const tabs =
      document.createElement("div");

    tabs.id = "resource-tabs";
    tabs.className = "resource-tabs";

    lessonHeader.insertAdjacentElement(
      "afterend",
      tabs
    );

    const placeholder =
      document.createElement("div");

    placeholder.id =
      "resource-open-placeholder";

    placeholder.className =
      "resource-open-placeholder";

    placeholder.innerHTML = `
      <h3 id="resource-open-title">
        Open Lesson Resource
      </h3>

      <p>
        This resource opens securely in a separate tab.
      </p>

      <a
        id="resource-open-button"
        href="#"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Resource
      </a>
    `;

    lessonWindow.appendChild(placeholder);
  }

  function displayLessonResources(
    resources = []
  ) {
    const tabs =
      document.getElementById(
        "resource-tabs"
      );

    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const originalPlaceholder =
      document.getElementById(
        "lesson-placeholder"
      );

    const securePlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    const headerOpenLink =
      document.getElementById(
        "open-lesson-link"
      );

    if (
      !tabs ||
      !frame ||
      !originalPlaceholder ||
      !securePlaceholder
    ) {
      return;
    }

    tabs.innerHTML = "";

    const validResources =
      resources.filter(resource =>
        isCompleteWebAddress(resource.url)
      );

    if (validResources.length === 0) {
      tabs.classList.remove("show");

      frame.style.display = "none";
      frame.removeAttribute("src");

      securePlaceholder.classList.remove(
        "show"
      );

      originalPlaceholder.style.display =
        "flex";

      if (headerOpenLink) {
        headerOpenLink.style.display =
          "none";
      }

      return;
    }

    tabs.classList.add("show");

    validResources.forEach(
      (resource, index) => {
        const button =
          document.createElement("button");

        button.type = "button";
        button.className = "resource-tab";

        button.textContent =
          resource.label ||
          getDefaultResourceLabel(
            resource.type
          );

        button.addEventListener(
          "click",
          () => {
            selectResource(
              resource,
              button
            );
          }
        );

        tabs.appendChild(button);

        if (index === 0) {
          selectResource(resource, button);
        }
      }
    );
  }

  function selectResource(
    resource,
    selectedButton
  ) {
    document
      .querySelectorAll(".resource-tab")
      .forEach(button =>
        button.classList.remove("active")
      );

    selectedButton.classList.add("active");

    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const originalPlaceholder =
      document.getElementById(
        "lesson-placeholder"
      );

    const securePlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    const secureTitle =
      document.getElementById(
        "resource-open-title"
      );

    const secureButton =
      document.getElementById(
        "resource-open-button"
      );

    const headerOpenLink =
      document.getElementById(
        "open-lesson-link"
      );

    originalPlaceholder.style.display =
      "none";

    if (headerOpenLink) {
      headerOpenLink.href = resource.url;
      headerOpenLink.style.display =
        "inline-block";
    }

    if (canEmbedResource(resource)) {
      securePlaceholder.classList.remove(
        "show"
      );

      frame.src =
        prepareResourceEmbedUrl(resource);

      frame.style.display = "block";
    } else {
      frame.style.display = "none";
      frame.removeAttribute("src");

      secureTitle.textContent =
        resource.label ||
        getDefaultResourceLabel(
          resource.type
        );

      secureButton.href = resource.url;

      secureButton.textContent =
        `Open ${
          resource.label ||
          getDefaultResourceLabel(
            resource.type
          )
        }`;

      securePlaceholder.classList.add(
        "show"
      );
    }
  }

  function canEmbedResource(resource) {
    return [
      "slides",
      "video",
      "canva",
      "pdf"
    ].includes(resource.type);
  }

  function prepareResourceEmbedUrl(resource) {
    const url = resource.url;

    if (
      resource.type === "slides" &&
      url.includes(
        "docs.google.com/presentation"
      )
    ) {
      return url
        .replace("/edit", "/embed")
        .split("?")[0];
    }

    if (resource.type === "video") {
      try {
        const parsed = new URL(url);

        if (
          parsed.hostname.includes(
            "youtu.be"
          )
        ) {
          const id =
            parsed.pathname.replace(
              "/",
              ""
            );

          return (
            "https://www.youtube.com/embed/" +
            id
          );
        }

        if (
          parsed.hostname.includes(
            "youtube.com"
          )
        ) {
          const id =
            parsed.searchParams.get("v");

          if (id) {
            return (
              "https://www.youtube.com/embed/" +
              id
            );
          }
        }
      } catch (error) {
        return url;
      }
    }

    return url;
  }

  function fillPlanner(lesson) {
    const dateInput =
      document.getElementById(
        "lesson-date-input"
      );

    if (dateInput) {
      dateInput.value =
        lesson.lessonDate ||
        getTodayText();
    }

    buildClassChoices(
      Array.isArray(lesson.assignedPeriods)
        ? lesson.assignedPeriods
        : []
    );

    fillResourceRows(
      Array.isArray(lesson.resources)
        ? lesson.resources
        : []
    );
  }

  function createLessonFromForm() {
    const selectedClasses =
      collectSelectedClasses();

    return {
      lessonId: createLessonId(),

      lessonDate:
        document.getElementById(
          "lesson-date-input"
        ).value,

      assignedPeriods:
        selectedClasses.map(
          item => item.period
        ),

      assignedCourses:
        selectedClasses.map(
          item => item.course
        ),

      bellringer:
        document
          .getElementById(
            "bellringer-input"
          )
          .value.trim(),

      ican:
        document
          .getElementById(
            "ican-input"
          )
          .value.trim(),

      success:
        document
          .getElementById(
            "success-input"
          )
          .value.trim(),

      profileId:
        document.getElementById(
          "profile-input"
        ).value,

      profileStatement:
        document.getElementById(
          "profile-statement-input"
        ).value,

      agenda:
        document
          .getElementById(
            "agenda-input"
          )
          .value.trim(),

      resources:
        collectResources()
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
      missing.push("At least one class");
    }

    if (!lesson.bellringer) {
      missing.push("Bell Ringer");
    }

    if (!lesson.agenda) {
      missing.push("Agenda");
    }

    if (!lesson.ican) {
      missing.push(
        "I Can / Learning Target"
      );
    }

    if (
      !lesson.profileId ||
      lesson.profileId === "none"
    ) {
      missing.push(
        "Profile of a Patriot"
      );
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
        "Complete https:// resource links"
      );
    }

    return missing;
  }

  async function sendLessonToArchive(
    lesson
  ) {
    const teacher =
      getTeacherProfile();

    const selectedProfile =
      typeof findProfile === "function"
        ? findProfile(lesson.profileId)
        : {
            title: lesson.profileId
          };

    const courses = [
      ...new Set(
        lesson.assignedCourses.filter(
          Boolean
        )
      )
    ];

    const archiveData =
      new URLSearchParams({
        lessonId: lesson.lessonId,
        lessonDate: lesson.lessonDate,

        teacherEmail:
          teacher.teacherEmail || "",

        teacherName:
          teacher.teacherName || "",

        course: courses.join(" / "),

        periods:
          lesson.assignedPeriods.join(
            ", "
          ),

        lessonTitle:
          courses.length
            ? `${courses.join(
                " / "
              )} Lesson`
            : "Daily Lesson",

        bellRinger:
          lesson.bellringer,

        agenda:
          lesson.agenda,

        learningTarget:
          lesson.ican,

        whyLearning: "",

        successCriteria:
          lesson.success || "",

        standards: "",

        profileComponent:
          selectedProfile.title || "",

        profileFocus:
          lesson.profileStatement || "",

        lessonResources:
          JSON.stringify(
            lesson.resources
          ),

        materials: "",
        teacherNotes: ""
      });

    await fetch(ARCHIVE_URL, {
      method: "POST",
      mode: "no-cors",
      body: archiveData
    });
  }

  function installSaveFunction() {
    window.saveAndLaunchLesson =
      async function () {
        const lesson =
          createLessonFromForm();

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
            ".save-launch-button"
          );

        const originalText =
          saveButton.textContent;

        saveButton.disabled = true;

        saveButton.textContent =
          "Saving Lesson...";

        localStorage.setItem(
          LESSON_KEY,
          JSON.stringify(lesson)
        );

        if (
          typeof applyLesson ===
          "function"
        ) {
          applyLesson(lesson);
        }

        displayLessonResources(
          lesson.resources
        );

        try {
          await sendLessonToArchive(
            lesson
          );

          const message =
            document.getElementById(
              "lesson-save-message"
            );

          message.textContent =
            "Lesson saved and archived!";

          message.classList.add("show");

          setTimeout(() => {
            if (
              typeof closeLessonSetup ===
              "function"
            ) {
              closeLessonSetup();
            }
          }, 1100);
        } catch (error) {
          console.error(
            "Archive saving failed.",
            error
          );

          window.alert(
            "The lesson was saved on this computer, " +
            "but the archive could not be reached."
          );
        } finally {
          saveButton.disabled = false;
          saveButton.textContent =
            originalText;
        }
      };
  }

  function wrapOpenLessonSetup() {
    if (
      typeof window.openLessonSetup !==
      "function"
    ) {
      return;
    }

    const original =
      window.openLessonSetup;

    window.openLessonSetup =
      function () {
        original();

        fillPlanner(getSavedLesson());
      };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function startLessonPlanner() {
    addPlannerStyles();

    insertDateField();
    insertClassChoices();
    insertResourceEditor();

    createResourceDisplay();

    buildClassChoices();
    fillResourceRows(
      getSavedLesson().resources
    );

    displayLessonResources(
      getSavedLesson().resources || []
    );

    wrapOpenLessonSetup();
    installSaveFunction();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startLessonPlanner
    );
  } else {
    startLessonPlanner();
  }
})();
