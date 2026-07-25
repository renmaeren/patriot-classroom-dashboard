/*
==========================================
PATRIOT COMMAND
Classroom Toolbar
==========================================
*/

(function () {
  const TOOLBAR_STORAGE_KEY =
    "patriotClassroomToolbar";

  const defaultTools = [
    {
      label: "YouTube",
      url: "https://www.youtube.com"
    },
    {
      label: "Google Drive",
      url: "https://drive.google.com"
    },
    {
      label: "Google Slides",
      url: "https://slides.google.com"
    },
    {
      label: "Gmail",
      url: "https://mail.google.com"
    }
  ];

  function readToolbarSettings() {
    const saved =
      localStorage.getItem(
        TOOLBAR_STORAGE_KEY
      );

    if (!saved) {
      return defaultTools;
    }

    try {
      const tools =
        JSON.parse(saved);

      return Array.isArray(tools)
        ? tools
        : defaultTools;
    } catch (error) {
      console.error(
        "Toolbar settings could not be read.",
        error
      );

      return defaultTools;
    }
  }

  function addToolbarStyles() {
    if (
      document.getElementById(
        "classroom-toolbar-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "classroom-toolbar-styles";

    style.textContent = `
      .classroom-toolbar-tab {
        position: fixed;
        top: 50%;
        right: 0;
        z-index: 4000;
        padding: 14px 10px;
        color: #ffffff;
        font-weight: bold;
        writing-mode: vertical-rl;
        transform: translateY(-50%);
        background: #11284a;
        border: 0;
        border-radius: 9px 0 0 9px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
        cursor: pointer;
      }

      .classroom-toolbar-panel {
        position: fixed;
        top: 0;
        right: -270px;
        z-index: 3999;
        width: 250px;
        height: 100vh;
        padding: 22px 18px;
        background: #f7f2e8;
        border-left: 5px solid #b3262e;
        box-shadow: -8px 0 24px rgba(0, 0, 0, 0.24);
        transition: right 0.25s ease;
      }

      .classroom-toolbar-panel.open {
        right: 0;
      }

      .classroom-toolbar-heading {
        margin: 0 0 18px;
        color: #11284a;
        font-size: 1.25rem;
      }

      .classroom-toolbar-links {
        display: grid;
        gap: 10px;
      }

      .classroom-toolbar-link {
        display: block;
        padding: 12px 14px;
        color: #ffffff;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        background: #11284a;
        border-radius: 8px;
      }

      .classroom-toolbar-link:hover {
        background: #b3262e;
      }

      .classroom-toolbar-close {
        width: 100%;
        margin-top: 16px;
        padding: 11px;
        color: #11284a;
        font-weight: bold;
        background: #ffffff;
        border: 2px solid #11284a;
        border-radius: 8px;
        cursor: pointer;
      }
    `;

    document.head.appendChild(style);
  }

  function createToolbar() {
    if (
      document.getElementById(
        "classroom-toolbar-panel"
      )
    ) {
      return;
    }

    const tools =
      readToolbarSettings()
        .filter(
          tool =>
            tool &&
            tool.label &&
            tool.url
        );

    const tab =
      document.createElement("button");

    tab.id =
      "classroom-toolbar-tab";

    tab.className =
      "classroom-toolbar-tab";

    tab.type = "button";
    tab.textContent = "Tools";

    tab.setAttribute(
      "aria-label",
      "Open classroom tools"
    );

    const panel =
      document.createElement("aside");

    panel.id =
      "classroom-toolbar-panel";

    panel.className =
      "classroom-toolbar-panel";

    panel.innerHTML = `
      <h2 class="classroom-toolbar-heading">
        Classroom Tools
      </h2>

      <div class="classroom-toolbar-links">
        ${tools
          .map(
            tool => `
              <a
                class="classroom-toolbar-link"
                href="${tool.url}"
                target="_blank"
                rel="noopener noreferrer"
              >
                ${tool.label}
              </a>
            `
          )
          .join("")}
      </div>

      <button
        id="classroom-toolbar-close"
        class="classroom-toolbar-close"
        type="button"
      >
        Close
      </button>
    `;

    document.body.appendChild(tab);
    document.body.appendChild(panel);

    const closeButton =
      document.getElementById(
        "classroom-toolbar-close"
      );

    function openToolbar() {
      panel.classList.add("open");
      tab.style.display = "none";
    }

    function closeToolbar() {
      panel.classList.remove("open");
      tab.style.display = "block";
    }

    tab.addEventListener(
      "click",
      openToolbar
    );

    closeButton.addEventListener(
      "click",
      closeToolbar
    );
  }

  function startToolbar() {
    addToolbarStyles();
    createToolbar();
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startToolbar
    );
  } else {
    startToolbar();
  }
})();
