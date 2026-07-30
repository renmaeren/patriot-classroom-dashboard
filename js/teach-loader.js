/*
  PATRIOT COMMAND
  Teach Loader v4

  Loads the active lesson from Library or Planner and displays:
  - Bell Ringer
  - I Can
  - Success Criteria
  - Profile of a Patriot
  - Multiple lesson resources
*/

(function () {
  "use strict";

  const TEACH_LESSON_KEY = "patriotTeachLesson";
  const DAILY_LESSON_KEY = "patriotDailyLesson";
  const LAST_PLANNED_KEY = "patriotLastPlannedLesson";

  window.PATRIOT_TEACH_LOADER_VERSION = "4";

  function readJson(key) {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(`Could not read ${key}.`, error);
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
      other: "Resource"
    };

    return labels[type] || "Resource";
  }

  function guessResourceType(url) {
    const value = String(url || "").toLowerCase();

    if (
      value.includes("docs.google.com/presentation") ||
      value.includes("slides.google.com")
    ) {
      return "slides";
    }

    if (
      value.includes("youtube.com") ||
      value.includes("youtu.be")
    ) {
      return "video";
    }

    if (value.includes("canva.com")) {
      return "canva";
    }

    if (value.includes("studysync")) {
      return "studysync";
    }

    if (value.includes("docs.google.com/document")) {
      return "document";
    }

    if (
      value.includes(".pdf") ||
      value.includes("drive.google.com") &&
      value.includes("pdf")
    ) {
      return "pdf";
    }

    return "website";
  }

  function normalizeResources(lesson) {
    if (!lesson || typeof lesson !== "object") {
      return [];
    }

    let resources =
      lesson.resources ||
      lesson.lessonResources ||
      lesson.resourceLinks ||
      lesson.links ||
      [];

    if (typeof resources === "string") {
      try {
        resources = JSON.parse(resources);
      } catch (error) {
        resources = [];
      }
    }

    if (!Array.isArray(resources)) {
      resources = [];
    }

    const normalized = resources
      .map((resource, index) => {
        if (typeof resource === "string") {
          const type = guessResourceType(resource);

          return {
            type,
            url: resource,
            label: getDefaultResourceLabel(type)
          };
        }

        if (!resource || typeof resource !== "object") {
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
          getDefaultResourceLabel(type) ||
          `Resource ${index + 1}`;

        return {
          type,
          url,
          label
        };
      })
      .filter(resource => {
        return resource && resource.url;
      });

    if (normalized.length > 0) {
      return normalized;
    }

    const oldSingleLink =
      lesson.lessonLink ||
      lesson.lessonUrl ||
      lesson.resourceUrl ||
      "";

    if (oldSingleLink) {
      const type = guessResourceType(oldSingleLink);

      return [
        {
          type,
          url: oldSingleLink,
          label: getDefaultResourceLabel(type)
        }
      ];
    }

    return [];
  }

  function setText(elementId, value, emptyMessage) {
    const element = document.getElementById(elementId);

    if (!element) {
      return;
    }

    const cleanValue = String(value || "").trim();

    if (cleanValue) {
      element.textContent = cleanValue;
      element.classList.remove("empty-text");
    } else {
      element.textContent = emptyMessage;
      element.classList.add("empty-text");
    }
  }

  function normalizeLesson(lesson) {
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

      resources: normalizeResources(lesson)
    };
  }

  function createResourceStyles() {
    if (document.getElementById("patriot-resource-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "patriot-resource-styles";

    style.textContent = `
      .resource-tabs {
        display: none;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px 14px;
        background: #e8ebef;
        border-bottom: 1px solid #ccd2da;
      }

      .resource-tabs.show {
        display: flex;
      }

      .resource-tab {
        padding: 8px 13px;
        color: #ffffff;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: 700;
        background: #192e52;
        border: 0;
        border-radius: 7px;
        cursor: pointer;
      }

      .resource-tab:hover {
        background: #28446f;
      }

      .resource-tab.active {
        background: #ad3437;
      }

      .resource-open-placeholder {
        position: absolute;
        inset: 0;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 14px;
        padding: 30px;
        text-align: center;
        background: #ffffff;
      }

      .resource-open-placeholder.show {
        display: flex;
      }

      .resource-open-placeholder h3 {
        margin: 0;
        color: #192e52;
        font-size: 1.6rem;
      }

      .resource-open-placeholder p {
        margin: 0;
        color: #5f6875;
      }

      .resource-open-placeholder a {
        padding: 12px 18px;
        color: #ffffff;
        font-weight: 700;
        text-decoration: none;
        background: #ad3437;
        border-radius: 8px;
      }
    `;

    document.head.appendChild(style);
  }

  function createResourceDisplay() {
    let tabs = document.getElementById("resource-tabs");

    if (tabs) {
      return tabs;
    }

    const lessonWindow =
      document.querySelector(".lesson-window");

    const lessonHeader =
      document.querySelector(".lesson-window-header");

    if (!lessonWindow || !lessonHeader) {
      console.warn(
        "Teach Loader could not find the lesson window."
      );

      return null;
    }

    tabs = document.createElement("div");
    tabs.id = "resource-tabs";
    tabs.className = "resource-tabs";

    lessonHeader.insertAdjacentElement("afterend", tabs);

    const openPlaceholder = document.createElement("div");
    openPlaceholder.id = "resource-open-placeholder";
    openPlaceholder.className = "resource-open-placeholder";

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

    lessonWindow.appendChild(openPlaceholder);

    return tabs;
  }

  function isValidUrl(url) {
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

  function canEmbed(resource) {
    return [
      "slides",
      "video",
      "youtube",
      "canva",
      "pdf"
    ].includes(resource.type);
  }

  function createEmbedUrl(resource) {
    const url = resource.url;

    if (
      resource.type === "slides" &&
      url.includes("docs.google.com/presentation")
    ) {
      const baseUrl = url.split("?")[0];

      if (baseUrl.includes("/edit")) {
        return baseUrl.replace("/edit", "/embed");
      }

      if (baseUrl.includes("/present")) {
        return baseUrl.replace("/present", "/embed");
      }

      return baseUrl;
    }

    if (
      resource.type === "video" ||
      resource.type === "youtube"
    ) {
      try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
          const videoId = parsed.pathname
            .replace("/", "")
            .split("?")[0];

          return `https://www.youtube.com/embed/${videoId}`;
        }

        if (parsed.hostname.includes("youtube.com")) {
          const videoId =
            parsed.searchParams.get("v");

          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
          }

          if (parsed.pathname.includes("/embed/")) {
            return url;
          }

          if (parsed.pathname.includes("/shorts/")) {
            const shortId =
              parsed.pathname.split("/shorts/")[1];

            return `https://www.youtube.com/embed/${shortId}`;
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

  function selectResource(resource, selectedButton) {
    document
      .querySelectorAll(".resource-tab")
      .forEach(button => {
        button.classList.remove("active");
      });

    selectedButton.classList.add("active");

    const frame =
      document.getElementById("lesson-frame");

    const originalPlaceholder =
      document.getElementById("lesson-placeholder");

    const openPlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    const openTitle =
      document.getElementById("resource-open-title");

    const openButton =
      document.getElementById("resource-open-button");

    const headerOpenLink =
      document.getElementById("open-lesson-link");

    if (originalPlaceholder) {
      originalPlaceholder.style.display = "none";
    }

    if (headerOpenLink) {
      headerOpenLink.href = resource.url;
      headerOpenLink.style.display = "inline-block";
    }

    if (canEmbed(resource) && frame) {
      if (openPlaceholder) {
        openPlaceholder.classList.remove("show");
      }

      frame.src = createEmbedUrl(resource);
      frame.style.display = "block";

      return;
    }

    if (frame) {
      frame.style.display = "none";
      frame.removeAttribute("src");
    }

    if (openTitle) {
      openTitle.textContent =
        resource.label ||
        getDefaultResourceLabel(resource.type);
    }

    if (openButton) {
      openButton.href = resource.url;
      openButton.textContent =
        `Open ${
          resource.label ||
          getDefaultResourceLabel(resource.type)
        }`;
    }

    if (openPlaceholder) {
      openPlaceholder.classList.add("show");
    }
  }

  function displayLessonResources(resources) {
    const tabs = createResourceDisplay();

    if (!tabs) {
      return;
    }

    const frame =
      document.getElementById("lesson-frame");

    const originalPlaceholder =
      document.getElementById("lesson-placeholder");

    const openPlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    const headerOpenLink =
      document.getElementById("open-lesson-link");

    tabs.innerHTML = "";

    const validResources = resources.filter(resource => {
      return isValidUrl(resource.url);
    });

    if (validResources.length === 0) {
      tabs.classList.remove("show");

      if (frame) {
        frame.style.display = "none";
        frame.removeAttribute("src");
      }

      if (openPlaceholder) {
        openPlaceholder.classList.remove("show");
      }

      if (originalPlaceholder) {
        originalPlaceholder.style.display = "flex";
      }

      if (headerOpenLink) {
        headerOpenLink.style.display = "none";
      }

      return;
    }

    tabs.classList.add("show");

    validResources.forEach((resource, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "resource-tab";

      button.textContent =
        resource.label ||
        getDefaultResourceLabel(resource.type);

      button.addEventListener("click", function () {
        selectResource(resource, button);
      });

      tabs.appendChild(button);

      if (index === 0) {
        selectResource(resource, button);
      }
    });
  }

  function applyLesson(rawLesson) {
    const lesson = normalizeLesson(rawLesson);

    if (!lesson) {
      displayLessonResources([]);
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

    const profileTitle =
      document.getElementById("profile-title");

    const profileDescription =
      document.getElementById("profile-description");

    if (profileTitle) {
      let title =
        lesson.profileTitle ||
        lesson.profileComponent ||
        lesson.profileId ||
        "Choose a component";

      if (
        typeof window.findProfile === "function" &&
        lesson.profileId
      ) {
        const profile =
          window.findProfile(lesson.profileId);

        if (profile && profile.title) {
          title = profile.title;
        }
      }

      profileTitle.textContent = title;
    }

    if (profileDescription) {
      let description =
        lesson.profileStatement ||
        lesson.profileFocus ||
        "";

      if (
        !description &&
        typeof window.findProfile === "function" &&
        lesson.profileId
      ) {
        const profile =
          window.findProfile(lesson.profileId);

        if (profile && profile.shortDescription) {
          description = profile.shortDescription;
        }
      }

      if (description) {
        profileDescription.textContent = description;
        profileDescription.classList.remove("empty-text");
      } else {
        profileDescription.textContent =
          "Select a component during lesson setup.";

        profileDescription.classList.add("empty-text");
      }
    }

    displayLessonResources(lesson.resources);
  }

  function refreshTeachLesson() {
    const lesson = getActiveLesson();
    applyLesson(lesson);
  }

  window.applyLesson = applyLesson;
  window.refreshTeachLesson = refreshTeachLesson;
  window.getActiveTeachLesson = getActiveLesson;

  function startTeachLoader() {
    createResourceStyles();
    createResourceDisplay();
    refreshTeachLesson();

    window.addEventListener("storage", function (event) {
      if (
        event.key === TEACH_LESSON_KEY ||
        event.key === DAILY_LESSON_KEY ||
        event.key === LAST_PLANNED_KEY
      ) {
        refreshTeachLesson();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startTeachLoader
    );
  } else {
    startTeachLoader();
  }
})();
