/*
==========================================
PATRIOT COMMAND
Sleek Classroom Toolbar
==========================================
*/

(function () {
  const TOOLBAR_STORAGE_KEY =
    "patriotClassroomToolbar";

const defaultTools = [
  {
    id: "campus",
    name: "Infinite Campus",
    icon: "Assets/Icons/InfiniteCampus.png",
    url: "https://allenky.infinitecampus.org/campus/allen.jsp"
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "Assets/Icons/YouTube.png",
    url: "https://www.youtube.com"
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: "Assets/Icons/gmail.png",
    url: "https://mail.google.com"
  },
  {
    id: "drive",
    name: "Google Drive",
    icon: "Assets/Icons/Drive.png",
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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 68px;
        padding: 8px;
        transform: translateY(-50%);
        background: rgba(17, 40, 74, 0.74);
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-right: 0;
        border-radius: 14px 0 0 14px;
        box-shadow: -3px 3px 12px rgba(0, 0, 0, 0.18);
        cursor: pointer;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        transition:
          width 0.18s ease,
          background 0.18s ease,
          transform 0.18s ease;
      }

      .classroom-toolbar-tab:hover {
        width: 50px;
        background: rgba(179, 38, 46, 0.88);
      }

      .classroom-toolbar-tab img {
        display: block;
        width: 28px;
        height: 28px;
        object-fit: contain;
        filter: brightness(0) invert(1);
        pointer-events: none;
      }

      .classroom-toolbar-panel {
        position: fixed;
        top: 50%;
        right: -92px;
        z-index: 4000;
        width: 80px;
        padding: 12px 10px;
        transform: translateY(-50%);
        background: rgba(17, 40, 74, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-right: 0;
        border-radius: 15px 0 0 15px;
        box-shadow: -5px 4px 18px rgba(0, 0, 0, 0.22);
        backdrop-filter: blur(7px);
        -webkit-backdrop-filter: blur(7px);
        transition: right 0.24s ease;
      }

      .classroom-toolbar-panel.open {
        right: 0;
      }

      .classroom-toolbar-links {
        display: grid;
        justify-content: center;
        gap: 10px;
      }

      .classroom-toolbar-link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        padding: 7px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.62);
        border-radius: 12px;
        box-shadow: 0 2px 7px rgba(0, 0, 0, 0.13);
        transition:
          transform 0.16s ease,
          background 0.16s ease,
          box-shadow 0.16s ease;
      }

      .classroom-toolbar-link:hover {
        transform: scale(1.06);
        background: #ffffff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
      }

      .classroom-toolbar-link img {
        display: block;
        width: 40px;
        height: 40px;
        object-fit: contain;
        pointer-events: none;
      }

      .classroom-toolbar-link.disabled {
        opacity: 0.38;
        cursor: default;
        pointer-events: none;
      }

      .classroom-toolbar-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 34px;
        margin: 11px auto 0;
        padding: 0;
        color: #ffffff;
        font-size: 1.35rem;
        font-weight: bold;
        background: rgba(255, 255, 255, 0.13);
        border: 1px solid rgba(255, 255, 255, 0.34);
        border-radius: 10px;
        cursor: pointer;
        transition:
          background 0.16s ease,
          transform 0.16s ease;
      }

      .classroom-toolbar-close:hover {
        background: rgba(179, 38, 46, 0.94);
        transform: scale(1.03);
      }

      @media (max-width: 700px) {
        .classroom-toolbar-tab {
          width: 42px;
          height: 62px;
        }

        .classroom-toolbar-panel {
          width: 74px;
        }

        .classroom-toolbar-link,
        .classroom-toolbar-close {
          width: 50px;
        }

        .classroom-toolbar-link {
          height: 50px;
        }

        .classroom-toolbar-link img {
          width: 35px;
          height: 35px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createToolButton(tool) {
    const name =
      tool.name ||
      "Classroom Tool";

    const icon =
      tool.icon || "";

    const hasLink =
      tool.url &&
      String(tool.url).trim();

    if (!hasLink) {
      return `
        <span
          class="classroom-toolbar-link disabled"
          title="${escapeHtml(name)} link has not been added yet."
          aria-label="${escapeHtml(name)} unavailable"
        >
          <img
            src="${escapeHtml(icon)}"
            alt=""
          >
        </span>
      `;
    }

    return `
      <a
        class="classroom-toolbar-link"
        href="${escapeHtml(tool.url)}"
        target="_blank"
        rel="noopener noreferrer"
        title="${escapeHtml(name)}"
        aria-label="${escapeHtml(name)}"
      >
        <img
          src="${escapeHtml(icon)}"
          alt=""
        >
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
            tool.name &&
            tool.icon
        );

    const tab =
      document.createElement("button");

    tab.id =
      "classroom-toolbar-tab";

    tab.className =
      "classroom-toolbar-tab";

    tab.type = "button";

    tab.innerHTML = `
      <img
src="Assets/Icons/tool-tab.png"        alt=""
      >
    `;

    tab.setAttribute(
      "aria-label",
      "Open classroom tools"
    );

    tab.setAttribute(
      "aria-expanded",
      "false"
    );

    tab.title =
      "Classroom Tools";

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
      <div class="classroom-toolbar-links">
        ${tools
          .map(createToolButton)
          .join("")}
      </div>

      <button
        id="classroom-toolbar-close"
        class="classroom-toolbar-close"
        type="button"
        aria-label="Close classroom tools"
        title="Close"
      >
        ×
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
      tab.style.display = "flex";

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
