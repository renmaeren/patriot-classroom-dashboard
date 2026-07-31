/*
==========================================
PATRIOT COMMAND
Teach Loader
==========================================

Loads the active lesson from Library,
Planner, or the daily lesson setup.

Displays:
- Bell Ringer
- I Can Statement
- Success Criteria
- Profile of a Patriot
- Agenda
- Multiple lesson resources
*/

(function () {
  "use strict";

  const TEACH_LESSON_KEY =
    "patriotTeachLesson";

  const DAILY_LESSON_KEY =
    "patriotDailyLesson";

  const LAST_PLANNED_KEY =
    "patriotLastPlannedLesson";

  window.PATRIOT_TEACH_LOADER_VERSION =
    "5";

  /*
  ==========================================
  STORAGE
  ==========================================
  */

  function readJson(key) {
    const savedValue =
      localStorage.getItem(key);

    if (!savedValue) {
      return null;
    }

    try {
      return JSON.parse(savedValue);
    } catch (error) {
      console.error(
        `Could not read ${key}.`,
        error
      );

      return null;
    }
  }

  function getActiveLesson() {
    return (
      readJson(TEACH_LESSON_KEY) ||
      readJson(DAILY_LESSON_KEY) ||
      readJson(LAST_PLANNED_KEY) ||
      null
    );
  }

  /*
  ==========================================
  RESOURCE NORMALIZATION
  ==========================================
  */

  function getDefaultResourceLabel(
    type
  ) {
    const labels = {
      slides: "Google Slides",
      video: "Video",
      youtube: "YouTube",
      studysync: "StudySync",
      canva: "Canva",
      pdf: "PDF",
      website: "Website",
      document: "Google Doc",
      spreadsheet: "Google Sheet",
      form: "Google Form",
      other: "Resource"
    };

    return (
      labels[type] ||
      "Resource"
    );
  }

  function guessResourceType(url) {
    const value =
      String(url || "")
        .toLowerCase();

    if (
      value.includes(
        "docs.google.com/presentation"
      ) ||
      value.includes(
        "slides.google.com"
      )
    ) {
      return "slides";
    }

    if (
      value.includes(
        "youtube.com"
      ) ||
      value.includes(
        "youtu.be"
      )
    ) {
      return "video";
    }

    if (
      value.includes(
        "canva.com"
      )
    ) {
      return "canva";
    }

    if (
      value.includes(
        "studysync"
      )
    ) {
      return "studysync";
    }

    if (
      value.includes(
        "docs.google.com/document"
      )
    ) {
      return "document";
    }

    if (
      value.includes(
        "docs.google.com/spreadsheets"
      )
    ) {
      return "spreadsheet";
    }

    if (
      value.includes(
        "docs.google.com/forms"
      )
    ) {
      return "form";
    }

    if (
      value.includes(".pdf") ||
      (
        value.includes(
          "drive.google.com"
        ) &&
        value.includes("pdf")
      )
    ) {
      return "pdf";
    }

    return "website";
  }

  function normalizeResources(
    lesson
  ) {
    if (
      !lesson ||
      typeof lesson !== "object"
    ) {
      return [];
    }

    let resources =
      lesson.resources ||
      lesson.lessonResources ||
      lesson.resourceLinks ||
      lesson.links ||
      [];

    if (
      typeof resources ===
      "string"
    ) {
      try {
        resources =
          JSON.parse(resources);
      } catch (error) {
        resources = [];
      }
    }

    if (
      !Array.isArray(resources)
    ) {
      resources = [];
    }

    const normalizedResources =
      resources
        .map(
          (
            resource,
            index
          ) => {
            if (
              typeof resource ===
              "string"
            ) {
              const type =
                guessResourceType(
                  resource
                );

              return {
                type,
                url: resource,
                label:
                  getDefaultResourceLabel(
                    type
                  )
              };
            }

            if (
              !resource ||
              typeof resource !==
                "object"
            ) {
              return null;
            }

            const url =
              resource.url ||
              resource.link ||
              resource.href ||
              resource.resourceUrl ||
              "";

            const type =
              resource.type ||
              resource.resourceType ||
              guessResourceType(url);

            const label =
              resource.label ||
              resource.title ||
              resource.name ||
              getDefaultResourceLabel(
                type
              ) ||
              `Resource ${
                index + 1
              }`;

            return {
              type,
              url,
              label
            };
          }
        )
        .filter(
          resource =>
            resource &&
            resource.url
        );

    if (
      normalizedResources.length >
      0
    ) {
      return normalizedResources;
    }

    const oldSingleLink =
      lesson.lessonLink ||
      lesson.lessonUrl ||
      lesson.resourceUrl ||
      "";

    if (oldSingleLink) {
      const type =
        guessResourceType(
          oldSingleLink
        );

      return [
        {
          type,
          url: oldSingleLink,
          label:
            getDefaultResourceLabel(
              type
            )
        }
      ];
    }

    return [];
  }

  /*
  ==========================================
  LESSON NORMALIZATION
  ==========================================
  */

  function normalizeLesson(
    lesson
  ) {
    if (!lesson) {
      return null;
    }

    return {
      ...lesson,

      bellringer:
        lesson.bellringer ||
        lesson.bellRinger ||
        "",

      ican:
        lesson.ican ||
        lesson.learningTarget ||
        lesson.iCan ||
        "",

      success:
        lesson.success ||
        lesson.successCriteria ||
        "",

      profileId:
        lesson.profileId ||
        lesson.profileComponent ||
        "none",

      profileStatement:
        lesson.profileStatement ||
        lesson.profileFocus ||
        "",

      agenda:
        lesson.agenda ||
        lesson.lessonAgenda ||
        "",

      resources:
        normalizeResources(
          lesson
        )
    };
  }

  /*
  ==========================================
  TEXT DISPLAY
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

    const cleanValue =
      String(value || "")
        .trim();

    if (cleanValue) {
      element.textContent =
        cleanValue;

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

  function displayAgenda(
    agendaText
  ) {
    const agendaList =
      document.getElementById(
        "agenda-display"
      );

    if (!agendaList) {
      return;
    }

    agendaList.innerHTML = "";

    const items =
      String(agendaText || "")
        .split("\n")
        .map(
          item =>
            item.trim()
        )
        .filter(Boolean);

    if (
      items.length === 0
    ) {
      const emptyItem =
        document.createElement(
          "li"
        );

      emptyItem.textContent =
        "Add today’s agenda.";

      emptyItem.className =
        "empty-text";

      agendaList.appendChild(
        emptyItem
      );

      return;
    }

    items.forEach(
      itemText => {
        const item =
          document.createElement(
            "li"
          );

        item.textContent =
          itemText;

        agendaList.appendChild(
          item
        );
      }
    );
  }

  /*
  ==========================================
  RESOURCE STYLES
  ==========================================
  */

  function createResourceStyles() {
    if (
      document.getElementById(
        "patriot-resource-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "patriot-resource-styles";

    style.textContent = `
      .resource-tabs {
        display: none;
        align-items: center;
        flex-wrap: wrap;
        gap: 7px;
        min-height: 48px;
        padding: 8px 12px;
        background:
          rgba(
            255,
            255,
            255,
            0.84
          );
        border-bottom:
          1px solid
          rgba(
            42,
            67,
            163,
            0.12
          );
        backdrop-filter:
          blur(14px);
        -webkit-backdrop-filter:
          blur(14px);
      }

      .resource-tabs.show {
        display: flex;
      }

      .resource-tabs-label {
        margin-right: 2px;
        color:
          var(
            --patriot-muted,
            #657087
          );
        font-size: 0.7rem;
        font-weight: 750;
        text-transform: uppercase;
        letter-spacing: 0.07em;
      }

      .resource-tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 32px;
        padding: 6px 10px;
        color:
          var(
            --patriot-blue,
            #2a43a3
          );
        font-family:
          "Inter",
          "Segoe UI",
          Arial,
          sans-serif;
        font-size: 0.74rem;
        font-weight: 750;
        line-height: 1;
        background:
          rgba(
            42,
            67,
            163,
            0.08
          );
        border:
          1px solid
          rgba(
            42,
            67,
            163,
            0.13
          );
        border-radius: 9px;
        cursor: pointer;
        transition:
          color 180ms ease,
          background 180ms ease,
          border-color 180ms ease,
          transform 180ms ease,
          box-shadow 180ms ease;
      }

      .resource-tab:hover {
        color: #ffffff;
        background:
          var(
            --patriot-blue,
            #2a43a3
          );
        border-color:
          var(
            --patriot-blue,
            #2a43a3
          );
        box-shadow:
          0 5px 12px
          rgba(
            42,
            67,
            163,
            0.15
          );
        transform:
          translateY(-1px);
      }

      .resource-tab.active {
        color: #ffffff;
        background:
          var(
            --patriot-red,
            #cf1b13
          );
        border-color:
          var(
            --patriot-red,
            #cf1b13
          );
        box-shadow:
          0 5px 12px
          rgba(
            207,
            27,
            19,
            0.15
          );
      }

      .resource-open-placeholder {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        padding: 30px;
        color:
          var(
            --patriot-text,
            #20283a
          );
        text-align: center;
        background:
          linear-gradient(
            145deg,
            rgba(
              255,
              252,
              233,
              0.96
            ),
            rgba(
              255,
              255,
              255,
              0.98
            )
          );
      }

      .resource-open-placeholder.show {
        display: flex;
      }

      .resource-open-placeholder h3 {
        margin: 0;
        color:
          var(
            --patriot-text,
            #20283a
          );
        font-family:
          "Literata",
          Georgia,
          serif;
        font-size: 1.25rem;
      }

      .resource-open-placeholder p {
        margin: 0;
        color:
          var(
            --patriot-muted,
            #657087
          );
        font-size: 0.85rem;
      }

      .resource-open-placeholder a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 38px;
        padding: 8px 13px;
        color: #ffffff;
        font-size: 0.78rem;
        font-weight: 750;
        text-decoration: none;
        background:
          var(
            --patriot-red,
            #cf1b13
          );
        border-radius: 9px;
      }

      .resource-open-placeholder a:hover {
        background:
          var(
            --patriot-blue,
            #2a43a3
          );
      }

      @media (
        max-width: 540px
      ) {
        .resource-tabs {
          align-items: stretch;
          flex-direction: column;
        }

        .resource-tabs-label {
          margin-bottom: 2px;
        }

        .resource-tab {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /*
  ==========================================
  RESOURCE DISPLAY CREATION
  ==========================================
  */

  function findLessonHeader() {
    return (
      document.querySelector(
        ".lesson-workspace-header"
      ) ||
      document.querySelector(
        ".lesson-window-header"
      )
    );
  }

  function findLessonWindow() {
    return document.querySelector(
      ".lesson-window"
    );
  }

  function createResourceDisplay() {
    let tabs =
      document.getElementById(
        "resource-tabs"
      );

    if (tabs) {
      return tabs;
    }

    const lessonHeader =
      findLessonHeader();

    const lessonWindow =
      findLessonWindow();

    if (
      !lessonHeader ||
      !lessonWindow
    ) {
      console.warn(
        "Teach Loader could not find the lesson workspace."
      );

      return null;
    }

    tabs =
      document.createElement(
        "div"
      );

    tabs.id =
      "resource-tabs";

    tabs.className =
      "resource-tabs";

    tabs.setAttribute(
      "aria-label",
      "Lesson resources"
    );

    lessonHeader.insertAdjacentElement(
      "afterend",
      tabs
    );

    let openPlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    if (!openPlaceholder) {
      openPlaceholder =
        document.createElement(
          "div"
        );

      openPlaceholder.id =
        "resource-open-placeholder";

      openPlaceholder.className =
        "resource-open-placeholder";

      openPlaceholder.innerHTML = `
        <h3 id="resource-open-title">
          Open Lesson Resource
        </h3>

        <p>
          This resource opens in a separate
          browser tab.
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

      lessonWindow.appendChild(
        openPlaceholder
      );
    }

    return tabs;
  }

  /*
  ==========================================
  URL HANDLING
  ==========================================
  */

  function isValidUrl(url) {
    try {
      const parsedUrl =
        new URL(url);

      return (
        parsedUrl.protocol ===
          "https:" ||
        parsedUrl.protocol ===
          "http:"
      );
    } catch (error) {
      return false;
    }
  }

  function canEmbed(
    resource
  ) {
    return [
      "slides",
      "video",
      "youtube",
      "canva",
      "pdf"
    ].includes(
      resource.type
    );
  }

  function createEmbedUrl(
    resource
  ) {
    const url =
      resource.url;

    if (
      resource.type === "slides" &&
      url.includes(
        "docs.google.com/presentation"
      )
    ) {
      const baseUrl =
        url.split("?")[0];

      if (
        baseUrl.includes("/edit")
      ) {
        return baseUrl.replace(
          "/edit",
          "/embed"
        );
      }

      if (
        baseUrl.includes(
          "/present"
        )
      ) {
        return baseUrl.replace(
          "/present",
          "/embed"
        );
      }

      return baseUrl;
    }

    if (
      resource.type === "video" ||
      resource.type === "youtube"
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
              .replace("/", "")
              .split("?")[0];

          return (
            "https://www.youtube.com/embed/" +
            videoId
          );
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

          if (videoId) {
            return (
              "https://www.youtube.com/embed/" +
              videoId
            );
          }

          if (
            parsedUrl.pathname.includes(
              "/embed/"
            )
          ) {
            return url;
          }

          if (
            parsedUrl.pathname.includes(
              "/shorts/"
            )
          ) {
            const shortId =
              parsedUrl.pathname
                .split(
                  "/shorts/"
                )[1]
                .split("/")[0];

            return (
              "https://www.youtube.com/embed/" +
              shortId
            );
          }
        }
      } catch (error) {
        console.error(
          "Could not prepare YouTube link.",
          error
        );
      }
    }

    return url;
  }

  /*
  ==========================================
  RESOURCE SELECTION
  ==========================================
  */

  function selectResource(
    resource,
    selectedButton
  ) {
    document
      .querySelectorAll(
        ".resource-tab"
      )
      .forEach(
        button => {
          button.classList.remove(
            "active"
          );

          button.setAttribute(
            "aria-pressed",
            "false"
          );
        }
      );

    selectedButton.classList.add(
      "active"
    );

    selectedButton.setAttribute(
      "aria-pressed",
      "true"
    );

    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const originalPlaceholder =
      document.getElementById(
        "lesson-placeholder"
      );

    const openPlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    const openTitle =
      document.getElementById(
        "resource-open-title"
      );

    const openButton =
      document.getElementById(
        "resource-open-button"
      );

    const headerOpenLink =
      document.getElementById(
        "open-lesson-link"
      );

    if (originalPlaceholder) {
      originalPlaceholder.style.display =
        "none";
    }

    if (headerOpenLink) {
      headerOpenLink.href =
        resource.url;

      headerOpenLink.style.display =
        "inline-flex";
    }

    if (
      canEmbed(resource) &&
      frame
    ) {
      if (openPlaceholder) {
        openPlaceholder.classList.remove(
          "show"
        );
      }

      frame.src =
        createEmbedUrl(
          resource
        );

      frame.style.display =
        "block";

      return;
    }

    if (frame) {
      frame.style.display =
        "none";

      frame.removeAttribute(
        "src"
      );
    }

    if (openTitle) {
      openTitle.textContent =
        resource.label ||
        getDefaultResourceLabel(
          resource.type
        );
    }

    if (openButton) {
      openButton.href =
        resource.url;

      openButton.textContent =
        `Open ${
          resource.label ||
          getDefaultResourceLabel(
            resource.type
          )
        }`;
    }

    if (openPlaceholder) {
      openPlaceholder.classList.add(
        "show"
      );
    }
  }

  /*
  ==========================================
  RESOURCE RENDERING
  ==========================================
  */

  function displayLessonResources(
    resources
  ) {
    const tabs =
      createResourceDisplay();

    if (!tabs) {
      return;
    }

    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const originalPlaceholder =
      document.getElementById(
        "lesson-placeholder"
      );

    const openPlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    const headerOpenLink =
      document.getElementById(
        "open-lesson-link"
      );

    tabs.innerHTML = "";

    const validResources =
      resources.filter(
        resource =>
          isValidUrl(
            resource.url
          )
      );

    if (
      validResources.length ===
      0
    ) {
      tabs.classList.remove(
        "show"
      );

      if (frame) {
        frame.style.display =
          "none";

        frame.removeAttribute(
          "src"
        );
      }

      if (openPlaceholder) {
        openPlaceholder.classList.remove(
          "show"
        );
      }

      if (originalPlaceholder) {
        originalPlaceholder.style.display =
          "flex";
      }

      if (headerOpenLink) {
        headerOpenLink.style.display =
          "none";
      }

      return;
    }

    tabs.classList.add(
      "show"
    );

    const label =
      document.createElement(
        "span"
      );

    label.className =
      "resource-tabs-label";

    label.textContent =
      "Resources";

    tabs.appendChild(label);

    validResources.forEach(
      (
        resource,
        index
      ) => {
        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "resource-tab";

        button.setAttribute(
          "aria-pressed",
          "false"
        );

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

        tabs.appendChild(
          button
        );

        if (index === 0) {
          selectResource(
            resource,
            button
          );
        }
      }
    );
  }

  /*
  ==========================================
  LESSON DISPLAY
  ==========================================
  */

  function applyLesson(
    rawLesson
  ) {
    const lesson =
      normalizeLesson(
        rawLesson
      );

    if (!lesson) {
      displayLessonResources(
        []
      );

      displayAgenda("");

      return;
    }

    setText(
      "bellringer-display",
      lesson.bellringer,
      "Add today’s bell ringer."
    );

    setText(
      "ican-display",
      lesson.ican,
      "Add today’s learning target."
    );

    setText(
      "success-display",
      lesson.success,
      "Add today’s success criteria."
    );

    displayAgenda(
      lesson.agenda
    );

    const profileTitle =
      document.getElementById(
        "profile-title"
      );

    const profileDescription =
      document.getElementById(
        "profile-description"
      );

    if (profileTitle) {
      let title =
        lesson.profileTitle ||
        lesson.profileComponent ||
        lesson.profileId ||
        "Choose a component";

      if (
        typeof window.findProfile ===
          "function" &&
        lesson.profileId
      ) {
        const profile =
          window.findProfile(
            lesson.profileId
          );

        if (
          profile &&
          profile.title
        ) {
          title =
            profile.title;
        }
      }

      profileTitle.textContent =
        title;
    }

    if (profileDescription) {
      let description =
        lesson.profileStatement ||
        lesson.profileFocus ||
        "";

      if (
        !description &&
        typeof window.findProfile ===
          "function" &&
        lesson.profileId
      ) {
        const profile =
          window.findProfile(
            lesson.profileId
          );

        if (
          profile &&
          profile.shortDescription
        ) {
          description =
            profile.shortDescription;
        }
      }

      if (description) {
        profileDescription.textContent =
          description;

        profileDescription.classList.remove(
          "empty-text"
        );
      } else {
        profileDescription.textContent =
          "Select a component during lesson setup.";

        profileDescription.classList.add(
          "empty-text"
        );
      }
    }

    displayLessonResources(
      lesson.resources
    );
  }

  /*
  ==========================================
  REFRESH
  ==========================================
  */

  function refreshTeachLesson() {
    const lesson =
      getActiveLesson();

    applyLesson(
      lesson
    );
  }

  window.applyLesson =
    applyLesson;

  window.refreshTeachLesson =
    refreshTeachLesson;

  window.getActiveTeachLesson =
    getActiveLesson;

  /*
  ==========================================
  START
  ==========================================
  */

  function startTeachLoader() {
    createResourceStyles();

    createResourceDisplay();

    refreshTeachLesson();

    window.addEventListener(
      "storage",
      event => {
        if (
          event.key ===
            TEACH_LESSON_KEY ||
          event.key ===
            DAILY_LESSON_KEY ||
          event.key ===
            LAST_PLANNED_KEY
        ) {
          refreshTeachLesson();
        }
      }
    );

    document.addEventListener(
      "patriotTeachLessonChange",
      refreshTeachLesson
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
