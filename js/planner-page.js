/*
==========================================
PATRIOT COMMAND
Lesson Planner Page
==========================================

Handles:

- default lesson date;
- teacher classes;
- Profile of a Patriot choices;
- lesson resource rows;
- Google Drive resource selection;
- starting another lesson.
*/

(function () {
  "use strict";

  const PROFILE_STORAGE_KEY =
    "patriotTeacherProfile";

  const profileOptions =
    typeof profileOfAPatriotOptions !==
      "undefined"
      ? profileOfAPatriotOptions
      : [];

  /*
  ==========================================
  GOOGLE DRIVE RESOURCE TYPES
  ==========================================
  */

  const GOOGLE_PICKER_TYPES = {
    slides: "slides",
    document: "docs",
    spreadsheet: "sheets",
    form: "forms",
    pdf: "pdf",
    image: "images",
    video: "videos"
  };

  /*
  ==========================================
  PAGE STYLES
  ==========================================
  */

  function addPlannerGoogleStyles() {
    if (
      document.getElementById(
        "patriot-planner-google-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "patriot-planner-google-styles";

    style.textContent = `
      /*
      ========================================
      GOOGLE DRIVE RESOURCE BUTTON
      ========================================
      */

      .resource-row {
        grid-template-columns:
          minmax(135px, 180px)
          minmax(0, 1fr)
          auto
          auto;
      }

      .google-drive-resource-button {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 6px;

        min-height: 37px;

        padding:
          7px
          11px;

        color:
          #2a43a3;

        font-size: 0.70rem;
        font-weight: 750;
        line-height: 1;
        white-space: nowrap;

        background:
          rgba(
            255,
            255,
            255,
            0.94
          );

        border:
          1px solid
          rgba(
            42,
            67,
            163,
            0.22
          );

        border-radius: 8px;

        cursor: pointer;

        transition:
          color 180ms ease,
          background 180ms ease,
          border-color 180ms ease,
          box-shadow 180ms ease,
          transform 180ms ease;
      }

      .google-drive-resource-button.show {
        display: inline-flex;
      }

      .google-drive-resource-button:hover {
        color: #ffffff;

        background:
          #2a43a3;

        border-color:
          #2a43a3;

        box-shadow:
          0 5px 12px
          rgba(
            42,
            67,
            163,
            0.14
          );

        transform:
          translateY(-1px);
      }

      .google-drive-resource-button:disabled {
        cursor: wait;
        opacity: 0.65;
        transform: none;
      }

      .google-drive-resource-button:focus-visible {
        outline:
          3px solid
          #ffe269;

        outline-offset: 2px;
      }

      .resource-url.google-selected {
        border-color:
          rgba(
            57,
            118,
            77,
            0.55
          );

        background:
          rgba(
            236,
            248,
            239,
            0.94
          );

        box-shadow:
          0 0 0 3px
          rgba(
            57,
            118,
            77,
            0.08
          );
      }

      .planner-google-message {
        display: none;

        margin-top: 8px;

        padding:
          8px
          10px;

        color:
          #4d5870;

        font-size: 0.68rem;
        line-height: 1.4;

        background:
          rgba(
            42,
            67,
            163,
            0.06
          );

        border-left:
          3px solid
          #2a43a3;

        border-radius: 7px;
      }

      .planner-google-message.show {
        display: block;
      }

      .planner-google-message.error {
        color:
          #8d1712;

        background:
          rgba(
            207,
            27,
            19,
            0.08
          );

        border-left-color:
          #cf1b13;
      }

      @media (
        max-width: 900px
      ) {
        .resource-row {
          grid-template-columns:
            minmax(135px, 180px)
            minmax(0, 1fr)
            auto;
        }

        .google-drive-resource-button {
          grid-column:
            2 / 3;
        }

        .remove-resource {
          grid-column:
            3 / 4;

          grid-row:
            1 / 3;
        }
      }

      @media (
        max-width: 700px
      ) {
        .resource-row {
          grid-template-columns:
            minmax(0, 1fr);
        }

        .google-drive-resource-button,
        .remove-resource {
          grid-column: auto;
          grid-row: auto;

          width: 100%;
        }
      }

      @media (
        prefers-reduced-motion:
        reduce
      ) {
        .google-drive-resource-button {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /*
  ==========================================
  GENERAL HELPERS
  ==========================================
  */

  function getTodayText() {
    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const day =
      String(
        today.getDate()
      ).padStart(
        2,
        "0"
      );

    return (
      `${year}-${month}-${day}`
    );
  }

  function readTeacherProfile() {
    const saved =
      localStorage.getItem(
        PROFILE_STORAGE_KEY
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
      return JSON.parse(
        saved
      );
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

  function getResourceList() {
    return document.getElementById(
      "resource-list"
    );
  }

  function setPlannerGoogleMessage(
    message,
    isError = false
  ) {
    let messageElement =
      document.getElementById(
        "planner-google-message"
      );

    if (!messageElement) {
      const resourceList =
        getResourceList();

      if (!resourceList) {
        return;
      }

      messageElement =
        document.createElement(
          "p"
        );

      messageElement.id =
        "planner-google-message";

      messageElement.className =
        "planner-google-message";

      messageElement.setAttribute(
        "role",
        "status"
      );

      resourceList.insertAdjacentElement(
        "afterend",
        messageElement
      );
    }

    messageElement.textContent =
      message || "";

    messageElement.classList.toggle(
      "show",
      Boolean(message)
    );

    messageElement.classList.toggle(
      "error",
      Boolean(isError)
    );
  }

  /*
  ==========================================
  DEFAULT DATE
  ==========================================
  */

  function setDefaultDate() {
    const dateInput =
      document.getElementById(
        "lesson-date"
      );

    if (
      dateInput &&
      !dateInput.value
    ) {
      dateInput.value =
        getTodayText();
    }
  }

  /*
  ==========================================
  TEACHER CLASSES
  ==========================================
  */

  function loadTeacherClasses() {
    const container =
      document.getElementById(
        "planner-class-options"
      );

    if (!container) {
      return;
    }

    const profile =
      readTeacherProfile();

    const classes =
      Object.entries(
        profile.classes || {}
      ).filter(
        (
          [
            period,
            course
          ]
        ) =>
          period &&
          course &&
          String(
            course
          ).trim()
      );

    container.innerHTML = "";

    if (
      classes.length === 0
    ) {
      container.innerHTML = `
        <p>
          No classes are saved yet.
          <a href="settings.html">
            Complete Teacher Settings
          </a>.
        </p>
      `;

      return;
    }

    classes.forEach(
      (
        [
          period,
          course
        ]
      ) => {
        const label =
          document.createElement(
            "label"
          );

        label.className =
          "class-choice";

        const checkbox =
          document.createElement(
            "input"
          );

        checkbox.type =
          "checkbox";

        checkbox.name =
          "planner-class";

        checkbox.value =
          period;

        checkbox.dataset.course =
          course;

        const text =
          document.createElement(
            "span"
          );

        text.textContent =
          `${period} — ${course}`;

        label.appendChild(
          checkbox
        );

        label.appendChild(
          text
        );

        container.appendChild(
          label
        );
      }
    );
  }

  /*
  ==========================================
  PROFILE OF A PATRIOT
  ==========================================
  */

  function populateProfileComponents() {
    const componentSelect =
      document.getElementById(
        "profile-component"
      );

    if (!componentSelect) {
      return;
    }

    componentSelect.innerHTML = `
      <option value="">
        Choose a component
      </option>
    `;

    profileOptions
      .filter(
        option =>
          option.id !== "none"
      )
      .forEach(
        option => {
          const choice =
            document.createElement(
              "option"
            );

          choice.value =
            option.id;

          choice.textContent =
            option.title;

          componentSelect.appendChild(
            choice
          );
        }
      );
  }

  function populateProfileFocus() {
    const componentSelect =
      document.getElementById(
        "profile-component"
      );

    const focusSelect =
      document.getElementById(
        "profile-focus"
      );

    if (
      !componentSelect ||
      !focusSelect
    ) {
      return;
    }

    focusSelect.innerHTML = `
      <option value="">
        Use the general component
      </option>
    `;

    const selectedProfile =
      profileOptions.find(
        option =>
          option.id ===
          componentSelect.value
      );

    if (!selectedProfile) {
      return;
    }

    (
      selectedProfile.statements ||
      []
    ).forEach(
      statement => {
        const choice =
          document.createElement(
            "option"
          );

        choice.value =
          statement;

        choice.textContent =
          statement;

        focusSelect.appendChild(
          choice
        );
      }
    );
  }

  /*
  ==========================================
  GOOGLE DRIVE RESOURCE PICKER
  ==========================================
  */

  function getPickerType(
    resourceType
  ) {
    return (
      GOOGLE_PICKER_TYPES[
        resourceType
      ] ||
      ""
    );
  }

  function supportsGooglePicker(
    resourceType
  ) {
    return Boolean(
      getPickerType(
        resourceType
      )
    );
  }

  function getDriveButtonLabel(
    resourceType
  ) {
    const labels = {
      slides:
        "Choose Slides",

      document:
        "Choose Doc",

      spreadsheet:
        "Choose Sheet",

      form:
        "Choose Form",

      pdf:
        "Choose PDF",

      image:
        "Choose Image",

      video:
        "Choose Video"
    };

    return (
      labels[resourceType] ||
      "Choose from Drive"
    );
  }

  function updateDriveButton(
    row
  ) {
    if (!row) {
      return;
    }

    const typeSelect =
      row.querySelector(
        ".resource-type"
      );

    const driveButton =
      row.querySelector(
        ".google-drive-resource-button"
      );

    if (
      !typeSelect ||
      !driveButton
    ) {
      return;
    }

    const resourceType =
      typeSelect.value;

    const isSupported =
      supportsGooglePicker(
        resourceType
      );

    driveButton.classList.toggle(
      "show",
      isSupported
    );

    driveButton.disabled =
      false;

    driveButton.textContent =
      getDriveButtonLabel(
        resourceType
      );

    driveButton.setAttribute(
      "aria-label",
      isSupported
        ? `${getDriveButtonLabel(
            resourceType
          )} from Google Drive`
        : "Google Drive is not available for this resource type"
    );
  }

  async function chooseGoogleResource(
    row
  ) {
    if (!row) {
      return;
    }

    const typeSelect =
      row.querySelector(
        ".resource-type"
      );

    const urlInput =
      row.querySelector(
        ".resource-url"
      );

    const driveButton =
      row.querySelector(
        ".google-drive-resource-button"
      );

    if (
      !typeSelect ||
      !urlInput ||
      !driveButton
    ) {
      return;
    }

    const resourceType =
      typeSelect.value;

    const pickerType =
      getPickerType(
        resourceType
      );

    if (!pickerType) {
      setPlannerGoogleMessage(
        "This resource type uses a manually pasted link."
      );

      return;
    }

    if (!window.PatriotGoogle) {
      setPlannerGoogleMessage(
        "Google Drive is not available yet. Refresh the page and try again.",
        true
      );

      return;
    }

    driveButton.disabled =
      true;

    driveButton.textContent =
      "Opening Drive...";

    setPlannerGoogleMessage("");

    try {
      const selectedFile =
        await window.PatriotGoogle
          .openPicker({
            type:
              pickerType
          });

      if (!selectedFile) {
        updateDriveButton(
          row
        );

        return;
      }

      if (!selectedFile.url) {
        throw new Error(
          "Google Drive did not return a usable file link."
        );
      }

      urlInput.value =
        selectedFile.url;

      urlInput.dataset.googleFileId =
        selectedFile.id || "";

      urlInput.dataset.googleFileName =
        selectedFile.name || "";

      urlInput.dataset.googleMimeType =
        selectedFile.mimeType || "";

      urlInput.dataset.googleSource =
        "google-drive";

      urlInput.classList.add(
        "google-selected"
      );

      /*
      Keep the dropdown synchronized with the
      file type Google returned.
      */

      const returnedType =
        selectedFile.type;

      const supportedSelectTypes = [
        "slides",
        "document",
        "spreadsheet",
        "form",
        "pdf",
        "video",
        "image"
      ];

      if (
        returnedType &&
        supportedSelectTypes.includes(
          returnedType
        )
      ) {
        const matchingOption =
          typeSelect.querySelector(
            `option[value="${returnedType}"]`
          );

        if (matchingOption) {
          typeSelect.value =
            returnedType;
        }
      }

      updateDriveButton(
        row
      );

      setPlannerGoogleMessage(
        selectedFile.name
          ? `"${selectedFile.name}" was added from Google Drive.`
          : "Google Drive resource added."
      );

      urlInput.dispatchEvent(
        new Event(
          "input",
          {
            bubbles: true
          }
        )
      );

      urlInput.focus();
    } catch (error) {
      console.error(
        "Google Drive resource selection failed.",
        error
      );

      setPlannerGoogleMessage(
        error.message ||
        "The Google Drive resource could not be selected.",
        true
      );

      updateDriveButton(
        row
      );
    }
  }

  function createDriveButton() {
    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "google-drive-resource-button";

    button.textContent =
      "Choose from Drive";

    button.addEventListener(
      "click",
      event => {
        const row =
          event.currentTarget.closest(
            ".resource-row"
          );

        chooseGoogleResource(
          row
        );
      }
    );

    return button;
  }

  /*
  ==========================================
  RESOURCE ROWS
  ==========================================
  */

  function getResourceOptionsHtml() {
    return `
      <option value="slides">
        Google Slides
      </option>

      <option value="video">
        Video / YouTube
      </option>

      <option value="studysync">
        StudySync
      </option>

      <option value="document">
        Google Doc
      </option>

      <option value="spreadsheet">
        Google Sheet
      </option>

      <option value="form">
        Google Form
      </option>

      <option value="canva">
        Canva
      </option>

      <option value="pdf">
        PDF
      </option>

      <option value="image">
        Image
      </option>

      <option value="website">
        Website
      </option>

      <option value="other">
        Other
      </option>
    `;
  }

  function createResourceRow() {
    const row =
      document.createElement(
        "div"
      );

    row.className =
      "resource-row";

    row.innerHTML = `
      <select
        class="resource-type"
        aria-label="Resource type"
      >
        ${getResourceOptionsHtml()}
      </select>

      <input
        class="resource-url"
        type="url"
        placeholder="Paste a link or choose from Google Drive"
        aria-label="Resource link"
      >

      <button
        class="remove-resource"
        type="button"
      >
        Remove
      </button>
    `;

    const removeButton =
      row.querySelector(
        ".remove-resource"
      );

    row.insertBefore(
      createDriveButton(),
      removeButton
    );

    connectResourceRow(
      row
    );

    return row;
  }

  function removeResourceRow(
    row
  ) {
    const list =
      getResourceList();

    row.remove();

    if (
      list &&
      list.children.length === 0
    ) {
      list.appendChild(
        createResourceRow()
      );
    }
  }

  function connectResourceRow(
    row
  ) {
    if (
      !row ||
      row.dataset.patriotConnected ===
        "true"
    ) {
      return;
    }

    row.dataset.patriotConnected =
      "true";

    const typeSelect =
      row.querySelector(
        ".resource-type"
      );

    const urlInput =
      row.querySelector(
        ".resource-url"
      );

    const removeButton =
      row.querySelector(
        ".remove-resource"
      );

    let driveButton =
      row.querySelector(
        ".google-drive-resource-button"
      );

    if (!driveButton) {
      driveButton =
        createDriveButton();

      if (removeButton) {
        row.insertBefore(
          driveButton,
          removeButton
        );
      } else {
        row.appendChild(
          driveButton
        );
      }
    }

    if (typeSelect) {
      typeSelect.addEventListener(
        "change",
        () => {
          if (urlInput) {
            urlInput.classList.remove(
              "google-selected"
            );

            delete urlInput.dataset
              .googleFileId;

            delete urlInput.dataset
              .googleFileName;

            delete urlInput.dataset
              .googleMimeType;

            delete urlInput.dataset
              .googleSource;
          }

          updateDriveButton(
            row
          );
        }
      );
    }

    if (urlInput) {
      urlInput.addEventListener(
        "input",
        () => {
          /*
          If the teacher manually changes the URL,
          no longer visually mark it as an untouched
          Google Picker selection.
          */

          if (
            urlInput.dataset
              .googleSource ===
              "google-drive"
          ) {
            urlInput.classList.remove(
              "google-selected"
            );
          }
        }
      );
    }

    if (removeButton) {
      removeButton.addEventListener(
        "click",
        () => {
          removeResourceRow(
            row
          );
        }
      );
    }

    updateDriveButton(
      row
    );
  }

  function connectExistingResourceRows() {
    document
      .querySelectorAll(
        ".resource-row"
      )
      .forEach(
        row => {
          connectResourceRow(
            row
          );
        }
      );
  }

  function connectAddResourceButton() {
    const addButton =
      document.getElementById(
        "add-resource-button"
      );

    const list =
      getResourceList();

    if (
      !addButton ||
      !list
    ) {
      return;
    }

    addButton.addEventListener(
      "click",
      () => {
        list.appendChild(
          createResourceRow()
        );
      }
    );
  }

  /*
  Planner editing and lesson duplication may
  rebuild resource rows after this file starts.
  Watch the list so every restored row receives
  the Drive button automatically.
  */

  function observeResourceRows() {
    const list =
      getResourceList();

    if (
      !list ||
      typeof MutationObserver ===
        "undefined"
    ) {
      return;
    }

    const observer =
      new MutationObserver(
        mutations => {
          mutations.forEach(
            mutation => {
              mutation.addedNodes.forEach(
                node => {
                  if (
                    !(node instanceof
                      HTMLElement)
                  ) {
                    return;
                  }

                  if (
                    node.classList.contains(
                      "resource-row"
                    )
                  ) {
                    connectResourceRow(
                      node
                    );
                  }

                  node
                    .querySelectorAll?.(
                      ".resource-row"
                    )
                    .forEach(
                      row => {
                        connectResourceRow(
                          row
                        );
                      }
                    );
                }
              );
            }
          );
        }
      );

    observer.observe(
      list,
      {
        childList: true,
        subtree: true
      }
    );
  }

  /*
  ==========================================
  START ANOTHER LESSON
  ==========================================
  */

  function resetForAnotherLesson() {
    const confirmed =
      window.confirm(
        "Start planning another lesson? Your saved lesson will remain safely in the archive."
      );

    if (!confirmed) {
      return;
    }

    const form =
      document.getElementById(
        "lesson-planner-form"
      );

    if (form) {
      form.reset();
    }

    setDefaultDate();
    loadTeacherClasses();
    populateProfileComponents();
    populateProfileFocus();

    const resourceList =
      getResourceList();

    if (resourceList) {
      resourceList.innerHTML = "";

      resourceList.appendChild(
        createResourceRow()
      );
    }

    setPlannerGoogleMessage("");

    const status =
      document.getElementById(
        "planner-status"
      );

    if (status) {
      status.textContent =
        "Ready for your next lesson.";

      status.style.display =
        "block";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function connectPlannerButtons() {
    const planAnotherButton =
      document.getElementById(
        "plan-another-button"
      );

    if (planAnotherButton) {
      planAnotherButton.addEventListener(
        "click",
        resetForAnotherLesson
      );
    }
  }

  /*
  ==========================================
  START
  ==========================================
  */

  function startPlannerPage() {
    addPlannerGoogleStyles();

    setDefaultDate();
    loadTeacherClasses();
    populateProfileComponents();
    populateProfileFocus();

    const componentSelect =
      document.getElementById(
        "profile-component"
      );

    if (componentSelect) {
      componentSelect.addEventListener(
        "change",
        populateProfileFocus
      );
    }

    connectExistingResourceRows();
    connectAddResourceButton();
    connectPlannerButtons();
    observeResourceRows();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startPlannerPage
    );
  } else {
    startPlannerPage();
  }
})();
