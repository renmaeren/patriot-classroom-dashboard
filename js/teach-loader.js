/*
==========================================
PATRIOT COMMAND
Teach Loader v2
==========================================

Loads the active lesson from:
- Lesson Library
- Planner
- Daily lesson storage

Displays the lesson lifecycle:

OPENING
- Bell Ringer
- Essential Question
- I Can / Learning Target
- Profile of a Patriot
- Success Criteria (optional)

LEARNING
- Agenda
- Vocabulary (optional)
- Resources

CLOSING
- Exit Ticket (optional)
- Homework (optional)

ADDITIONAL
- Why Are We Learning This? (optional)
- Materials Needed (optional)

Empty optional components are not displayed.
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
    "6";

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
  GENERAL HELPERS
  ==========================================
  */

  function cleanText(value) {
    return String(value || "")
      .trim();
  }

  function hasContent(value) {
    return Boolean(
      cleanText(value)
    );
  }

  function firstContent(...values) {
    return (
      values.find(hasContent) ||
      ""
    );
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /*
  ==========================================
  RESOURCE NORMALIZATION
  ==========================================
  */

  function getDefaultResourceLabel(type) {
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
      cleanText(url)
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

  function parseResourceValue(value) {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (
      typeof value ===
      "string"
    ) {
      try {
        const parsed =
          JSON.parse(value);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch (error) {
        return [];
      }
    }

    return [];
  }

  function normalizeResources(lesson) {
    if (
      !lesson ||
      typeof lesson !== "object"
    ) {
      return [];
    }

    const possibleResources =
      lesson.resources ??
      lesson.lessonResources ??
      lesson.resourceLinks ??
      lesson.links ??
      [];

    const resources =
      parseResourceValue(
        possibleResources
      );

    const normalized =
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
                url: cleanText(
                  resource
                ),
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
              firstContent(
                resource.url,
                resource.link,
                resource.href,
                resource.resourceUrl
              );

            if (!url) {
              return null;
            }

            const type =
              firstContent(
                resource.type,
                resource.resourceType
              ) ||
              guessResourceType(url);

            const label =
              firstContent(
                resource.label,
                resource.title,
                resource.name
              ) ||
              getDefaultResourceLabel(
                type
              ) ||
              `Resource ${index + 1}`;

            return {
              type,
              url,
              label
            };
          }
        )
        .filter(Boolean);

    if (normalized.length) {
      return normalized;
    }

    const oldSingleLink =
      firstContent(
        lesson.lessonLink,
        lesson.lessonUrl,
        lesson.resourceUrl
      );

    if (!oldSingleLink) {
      return [];
    }

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

  /*
  ==========================================
  LESSON NORMALIZATION
  ==========================================
  */

  function normalizeLesson(rawLesson) {
    if (
      !rawLesson ||
      typeof rawLesson !== "object"
    ) {
      return null;
    }

    return {
      lessonId:
        firstContent(
          rawLesson.lessonId
        ),

      lessonTitle:
        firstContent(
          rawLesson.lessonTitle,
          rawLesson.title
        ),

      bellRinger:
        firstContent(
          rawLesson.bellRinger,
          rawLesson.bellringer
        ),

      essentialQuestion:
        firstContent(
          rawLesson.essentialQuestion,
          rawLesson.essentialquestion
        ),

      learningTarget:
        firstContent(
          rawLesson.learningTarget,
          rawLesson.ican,
          rawLesson.iCan
        ),

      successCriteria:
        firstContent(
          rawLesson.successCriteria,
          rawLesson.success
        ),

      profileId:
        firstContent(
          rawLesson.profileId
        ) ||
        "none",

      profileComponent:
        firstContent(
          rawLesson.profileComponent,
          rawLesson.profileTitle
        ),

      profileFocus:
        firstContent(
          rawLesson.profileFocus,
          rawLesson.profileStatement
        ),

      agenda:
        firstContent(
          rawLesson.agenda,
          rawLesson.lessonAgenda
        ),

      vocabulary:
        firstContent(
          rawLesson.vocabulary
        ),

      exitTicket:
        firstContent(
          rawLesson.exitTicket
        ),

      homework:
        firstContent(
          rawLesson.homework
        ),

      whyLearning:
        firstContent(
          rawLesson.whyLearning
        ),

      materials:
        firstContent(
          rawLesson.materials
        ),

      teacherNotes:
        firstContent(
          rawLesson.teacherNotes
        ),

      resources:
        normalizeResources(
          rawLesson
        )
    };
  }

  /*
  ==========================================
  LESSON FLOW STYLES
  ==========================================
  */

  function addLessonFlowStyles() {
    if (
      document.getElementById(
        "patriot-teach-loader-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "patriot-teach-loader-styles";

    style.textContent = `
      .lesson-flow-body {
        display: grid;
        align-content: start;
      }

      .lesson-flow-stage {
        padding:
          10px
          14px
          5px;
        color:
          var(
            --blue,
            #2a43a3
          );
        font-size: 0.61rem;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: 0.11em;
        background:
          rgba(
            42,
            67,
            163,
            0.035
          );
        border-bottom:
          1px solid
          rgba(
            42,
            67,
            163,
            0.09
          );
      }

      .lesson-flow-section {
        padding:
          10px
          14px;
      }

      .lesson-flow-heading {
        margin-bottom: 5px;
        font-size: 0.86rem;
      }

      .lesson-flow-icon {
        width: 22px;
        height: 22px;
        font-size: 0.82rem;
      }

      .lesson-text,
      .profile-description,
      .agenda-list {
        font-size: 0.79rem;
        line-height: 1.38;
      }

      .profile-title {
        margin-bottom: 3px;
        font-size: 0.82rem;
      }

      .agenda-list {
        padding-left: 19px;
      }

      .agenda-list li {
        margin-bottom: 2px;
      }

      .lesson-flow-empty {
        padding:
          18px
          15px;
        color:
          var(
            --muted,
            #657087
          );
        font-size: 0.78rem;
        line-height: 1.45;
        text-align: center;
      }

      .resource-tabs {
        display: none;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        min-height: 42px;
        padding:
          6px
          10px;
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
            --muted,
            #657087
          );
        font-size: 0.61rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.07em;
      }

      .resource-tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 29px;
        padding:
          5px
          9px;
        color:
          var(
            --blue,
            #2a43a3
          );
        font-size: 0.68rem;
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
        border-radius: 8px;
        cursor: pointer;
        transition:
          color 180ms ease,
          background 180ms ease,
          border-color 180ms ease,
          transform 180ms ease;
      }

      .resource-tab:hover {
        color: #ffffff;
        background:
          var(
            --blue,
            #2a43a3
          );
        border-color:
          var(
            --blue,
            #2a43a3
          );
        transform:
          translateY(-1px);
      }

      .resource-tab.active {
        color: #ffffff;
        background:
          var(
            --red,
            #cf1b13
          );
        border-color:
          var(
            --red,
            #cf1b13
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
        gap: 9px;
        padding: 28px;
        color:
          var(
            --ink,
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
        font-family:
          "Literata",
          Georgia,
          serif;
        font-size: 1.15rem;
      }

      .resource-open-placeholder p {
        margin: 0;
        color:
          var(
            --muted,
            #657087
          );
        font-size: 0.8rem;
      }

      .resource-open-placeholder a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 36px;
        padding:
          7px
          12px;
        color: #ffffff;
        font-size: 0.74rem;
        font-weight: 750;
        text-decoration: none;
        background:
          var(
            --red,
            #cf1b13
          );
        border-radius: 8px;
      }

      .resource-open-placeholder a:hover {
        background:
          var(
            --blue,
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
  LESSON FLOW CREATION
  ==========================================
  */

  function createStageHeading(title) {
    const heading =
      document.createElement(
        "div"
      );

    heading.className =
      "lesson-flow-stage";

    heading.textContent =
      title;

    return heading;
  }

  function createTextSection(
    title,
    icon,
    value
  ) {
    if (!hasContent(value)) {
      return null;
    }

    const section =
      document.createElement(
        "section"
      );

    section.className =
      "lesson-flow-section";

    section.innerHTML = `
      <h3 class="lesson-flow-heading">
        <span
          class="lesson-flow-icon"
          aria-hidden="true"
        >
          ${escapeHtml(icon)}
        </span>

        ${escapeHtml(title)}
      </h3>

      <p class="lesson-text">
        ${escapeHtml(value)}
      </p>
    `;

    return section;
  }

  function createAgendaSection(
    agendaText
  ) {
    if (!hasContent(agendaText)) {
      return null;
    }

    const items =
      cleanText(agendaText)
        .split("\n")
        .map(item =>
          item.trim()
        )
        .filter(Boolean);

    if (!items.length) {
      return null;
    }

    const section =
      document.createElement(
        "section"
      );

    section.className =
      "lesson-flow-section";

    section.innerHTML = `
      <h3 class="lesson-flow-heading">
        <span
          class="lesson-flow-icon"
          aria-hidden="true"
        >
          ≡
        </span>

        Agenda
      </h3>

      <ol class="agenda-list">
        ${items
          .map(item => {
            return `
              <li>
                ${escapeHtml(item)}
              </li>
            `;
          })
          .join("")}
      </ol>
    `;

    return section;
  }

  function getProfileInformation(
    lesson
  ) {
    let title =
      firstContent(
        lesson.profileComponent
      );

    let description =
      firstContent(
        lesson.profileFocus
      );

    if (
      typeof window.findProfile ===
        "function" &&
      lesson.profileId &&
      lesson.profileId !== "none"
    ) {
      const profile =
        window.findProfile(
          lesson.profileId
        );

      if (profile) {
        title =
          firstContent(
            title,
            profile.title
          );

        description =
          firstContent(
            description,
            profile.shortDescription
          );
      }
    }

    if (
      !title &&
      lesson.profileId &&
      lesson.profileId !== "none"
    ) {
      title =
        lesson.profileId;
    }

    return {
      title,
      description
    };
  }

  function createProfileSection(
    lesson
  ) {
    const profile =
      getProfileInformation(
        lesson
      );

    if (
      !hasContent(profile.title) &&
      !hasContent(
        profile.description
      )
    ) {
      return null;
    }

    const section =
      document.createElement(
        "section"
      );

    section.className =
      "lesson-flow-section";

    section.innerHTML = `
      <h3 class="lesson-flow-heading">
        <span
          class="lesson-flow-icon"
          aria-hidden="true"
        >
          ★
        </span>

        Profile of a Patriot
      </h3>

      ${
        hasContent(profile.title)
          ? `
            <div class="profile-title">
              ${escapeHtml(
                profile.title
              )}
            </div>
          `
          : ""
      }

      ${
        hasContent(
          profile.description
        )
          ? `
            <p class="profile-description">
              ${escapeHtml(
                profile.description
              )}
            </p>
          `
          : ""
      }
    `;

    return section;
  }

  function appendStage(
    container,
    stageTitle,
    sections
  ) {
    const populatedSections =
      sections.filter(Boolean);

    if (!populatedSections.length) {
      return;
    }

    container.appendChild(
      createStageHeading(
        stageTitle
      )
    );

    populatedSections.forEach(
      section => {
        container.appendChild(
          section
        );
      }
    );
  }

  function displayLessonFlow(lesson) {
    const lessonBody =
      document.querySelector(
        "#lesson-flow-panel .command-panel-body"
      );

    if (!lessonBody) {
      return;
    }

    lessonBody.className =
      "command-panel-body lesson-flow-body";

    lessonBody.innerHTML = "";

    if (!lesson) {
      const empty =
        document.createElement(
          "p"
        );

      empty.className =
        "lesson-flow-empty";

      empty.textContent =
        "Choose a saved lesson from the Library or create one in Planner.";

      lessonBody.appendChild(
        empty
      );

      return;
    }

    appendStage(
      lessonBody,
      "Opening",
      [
        createTextSection(
          "Bell Ringer",
          "📌",
          lesson.bellRinger
        ),

        createTextSection(
          "Essential Question",
          "?",
          lesson.essentialQuestion
        ),

        createTextSection(
          "I Can",
          "🎯",
          lesson.learningTarget
        ),

        createProfileSection(
          lesson
        ),

        createTextSection(
          "Success Criteria",
          "✓",
          lesson.successCriteria
        )
      ]
    );

    appendStage(
      lessonBody,
      "Learning",
      [
        createAgendaSection(
          lesson.agenda
        ),

        createTextSection(
          "Vocabulary",
          "Aa",
          lesson.vocabulary
        )
      ]
    );

    appendStage(
      lessonBody,
      "Closing",
      [
        createTextSection(
          "Exit Ticket",
          "↗",
          lesson.exitTicket
        ),

        createTextSection(
          "Homework",
          "⌂",
          lesson.homework
        )
      ]
    );

    appendStage(
      lessonBody,
      "Additional",
      [
        createTextSection(
          "Why Are We Learning This?",
          "💡",
          lesson.whyLearning
        ),

        createTextSection(
          "Materials Needed",
          "▣",
          lesson.materials
        )
      ]
    );

    if (!lessonBody.children.length) {
      const empty =
        document.createElement(
          "p"
        );

      empty.className =
        "lesson-flow-empty";

      empty.textContent =
        "This lesson does not contain displayable lesson components.";

      lessonBody.appendChild(
        empty
      );
    }
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
          This resource opens in a separate browser tab.
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
  RESOURCE URL HANDLING
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

  function canEmbed(resource) {
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

  function createEmbedUrl(resource) {
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
        baseUrl.includes("/present")
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
      .forEach(button => {
        button.classList.remove(
          "active"
        );

        button.setAttribute(
          "aria-pressed",
          "false"
        );
      });

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
        resource.label;
    }

    if (openButton) {
      openButton.href =
        resource.url;

      openButton.textContent =
        `Open ${resource.label}`;
    }

    if (openPlaceholder) {
      openPlaceholder.classList.add(
        "show"
      );
    }
  }

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

    if (!validResources.length) {
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
          resource.label;

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

  function applyLesson(rawLesson) {
    const lesson =
      normalizeLesson(
        rawLesson
      );

    displayLessonFlow(
      lesson
    );

    displayLessonResources(
      lesson
        ? lesson.resources
        : []
    );
  }

  /*
  ==========================================
  REFRESH
  ==========================================
  */

  function refreshTeachLesson() {
    applyLesson(
      getActiveLesson()
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
    addLessonFlowStyles();

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
