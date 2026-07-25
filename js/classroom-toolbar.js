/*
==========================================
PATRIOT COMMAND
Custom Classroom Toolbar
==========================================
*/

(function () {
  const TOOLBAR_STORAGE_KEY =
    "patriotClassroomToolbar";

  /*
    These appear until the teacher
    customizes the toolbar in Settings.
  */
  const defaultTools = [
    {
      label: "IC",
      name: "Infinite Campus",
      url: ""
    },
    {
      label: "YT",
      name: "YouTube",
      url: "https://www.youtube.com"
    },
    {
      label: "GM",
      name: "Gmail",
      url: "https://mail.google.com"
    },
    {
      label: "Drive",
      name: "Google Drive",
      url: "https://drive.google.com"
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
        "Classroom toolbar settings could not be read.",
        error
      );

      return defaultTools;
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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
        z-index: 4001;
        padding: 15px 10px;
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
        right: -245px;
        z-index: 4000;
        width: 225px;
        height: 100vh;
        padding: 22px 16px;
        overflow-y: auto;
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
        font-size: 1.2rem;
        text-align: center;
      }

      .classroom-toolbar-links {
        display: grid;
        gap: 10px;
      }

      .classroom-toolbar-link {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 52px;
        padding: 11px;
        color: #ffffff;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        background: #11284a;
        border-radius: 9px;
      }

      .classroom-toolbar-link:hover {
        background: #b3262e;
      }

      .classroom-toolbar-link.disabled {
        color: #657184;
        background: #dfe3e8;
        cursor: default;
        pointer-events: none;
      }

      .classroom-toolbar-close {
        width: 100%;
        margin-top: 18px;
        padding: 11px;
        color: #11284a;
        font-weight: bold;
        background: #ffffff;
        border: 2px solid #11284a;
        border-radius: 8px;
        cursor: pointer;
      }

      .classroom-toolbar-close:hover {
        color: #ffffff;
        background: #b3262e;
        border-color: #b3262e;
      }
    `;

    document.head.appendChild(style);
  }

  function createToolLink(tool) {
    const hasLink =
      tool.url &&
      String(tool.url).trim();

    if (!hasLink) {
      return `
        <span
          class="classroom-toolbar-link disabled"
          title="${escapeHtml(
            tool.name ||
            tool.label
          )} link has not been added yet."
        >
          ${escapeHtml(tool.label)}
        </span>
      `;
    }

    return `
      <a
        class="classroom-toolbar-link"
        href="${escapeHtml(tool.url)}"
        target="_blank"
        rel="noopener noreferrer"
        title="${escapeHtml(
          tool.name ||
          tool.label
        )}"
      >
        ${escapeHtml(tool.label)}
      </a>
    `;
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
            tool.label
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

    tab.setAttribute(
      "aria-expanded",
      "false"
    );

    const panel =
      document.createElement("aside");

    panel.id =
      "classroom-toolbar-panel";

    panel.className =
      "classroom-toolbar-panel";

    panel.setAttribute(
      "aria-label",
      "Classroom tools"
    );

    panel.innerHTML = `
      <h2 class="classroom-toolbar-heading">
        Classroom Tools
      </h2>

      <div class="classroom-toolbar-links">
        ${tools
          .map(createToolLink)
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

      tab.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    function closeToolbar() {
      panel.classList.remove("open");
      tab.style.display = "block";

      tab.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    tab.addEventListener(
      "click",
      openToolbar
    );

    closeButton.addEventListener(
      "click",
      closeToolbar
    );

    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          panel.classList.contains(
            "open"
          )
        ) {
          closeToolbar();
        }
      }
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
