(function () {
  "use strict";

  const MAX_HISTORY = 75;
  const undoStack = [];
  const redoStack = [];
  let restoring = false;
  let recordTimer = null;
  let lastSnapshot = "";

  function getPlannerControls() {
    return Array.from(
      document.querySelectorAll(
        ".planner-main input, .planner-main textarea, .planner-main select"
      )
    ).filter(control => !control.closest(".planner-history-toolbar"));
  }

  function controlKey(control, index) {
    return control.id || control.name || `planner-control-${index}`;
  }

  function captureState() {
    const state = {};

    getPlannerControls().forEach((control, index) => {
      const key = controlKey(control, index);

      if (control.type === "checkbox" || control.type === "radio") {
        state[key] = {
          kind: "checked",
          value: control.checked
        };
      } else {
        state[key] = {
          kind: "value",
          value: control.value
        };
      }
    });

    return JSON.stringify(state);
  }

  function restoreState(snapshot) {
    let state;

    try {
      state = JSON.parse(snapshot);
    } catch (error) {
      console.error("Planner history could not restore a state.", error);
      return;
    }

    restoring = true;

    getPlannerControls().forEach((control, index) => {
      const key = controlKey(control, index);
      const saved = state[key];
      if (!saved) return;

      if (saved.kind === "checked") {
        control.checked = Boolean(saved.value);
      } else {
        control.value = saved.value == null ? "" : String(saved.value);
      }

      control.dispatchEvent(new Event("input", { bubbles: true }));
      control.dispatchEvent(new Event("change", { bubbles: true }));
    });

    window.setTimeout(() => {
      restoring = false;
      lastSnapshot = captureState();
      updateButtons();
    }, 0);
  }

  function pushCurrentState() {
    if (restoring) return;

    const snapshot = captureState();
    if (!snapshot || snapshot === lastSnapshot) return;

    if (lastSnapshot) {
      undoStack.push(lastSnapshot);
      if (undoStack.length > MAX_HISTORY) undoStack.shift();
    }

    lastSnapshot = snapshot;
    redoStack.length = 0;
    updateButtons();
  }

  function scheduleRecord(immediate) {
    if (restoring) return;
    window.clearTimeout(recordTimer);
    recordTimer = window.setTimeout(pushCurrentState, immediate ? 0 : 350);
  }

  function undo() {
    window.clearTimeout(recordTimer);
    pushCurrentState();
    if (!undoStack.length) return;

    const current = captureState();
    const previous = undoStack.pop();
    redoStack.push(current);
    restoreState(previous);
  }

  function redo() {
    window.clearTimeout(recordTimer);
    if (!redoStack.length) return;

    const current = captureState();
    const next = redoStack.pop();
    undoStack.push(current);
    restoreState(next);
  }

  function updateButtons() {
    const undoButton = document.getElementById("planner-undo-button");
    const redoButton = document.getElementById("planner-redo-button");

    if (undoButton) {
      undoButton.disabled = undoStack.length === 0;
      undoButton.title = undoStack.length
        ? `Undo last change (${undoStack.length} available)`
        : "Nothing to undo";
    }

    if (redoButton) {
      redoButton.disabled = redoStack.length === 0;
      redoButton.title = redoStack.length
        ? `Redo last undone change (${redoStack.length} available)`
        : "Nothing to redo";
    }
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .planner-history-toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 7px;
        width: min(1500px, calc(100% - 24px));
        margin: -3px auto 10px;
      }

      .planner-history-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 92px;
        min-height: 36px;
        padding: 7px 12px;
        color: #2a43a3;
        font-size: 0.72rem;
        font-weight: 800;
        background: rgba(255,255,255,.9);
        border: 1px solid rgba(42,67,163,.18);
        border-radius: 9px;
        box-shadow: 0 3px 10px rgba(42,67,163,.08);
      }

      .planner-history-button:hover:not(:disabled) {
        color: #fff;
        background: #2a43a3;
      }

      .planner-history-button:disabled {
        color: #8a91a2;
        background: rgba(255,255,255,.55);
        cursor: not-allowed;
        opacity: .65;
      }

      @media (max-width: 600px) {
        .planner-history-toolbar {
          justify-content: stretch;
        }
        .planner-history-button {
          flex: 1 1 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addToolbar() {
    if (document.getElementById("planner-history-toolbar")) return;

    const header = document.querySelector(".planner-header");
    if (!header) return;

    const toolbar = document.createElement("div");
    toolbar.id = "planner-history-toolbar";
    toolbar.className = "planner-history-toolbar";
    toolbar.setAttribute("aria-label", "Planner edit history");

    const undoButton = document.createElement("button");
    undoButton.id = "planner-undo-button";
    undoButton.className = "planner-history-button";
    undoButton.type = "button";
    undoButton.innerHTML = "↶ <span>Undo</span>";
    undoButton.addEventListener("click", undo);

    const redoButton = document.createElement("button");
    redoButton.id = "planner-redo-button";
    redoButton.className = "planner-history-button";
    redoButton.type = "button";
    redoButton.innerHTML = "↷ <span>Redo</span>";
    redoButton.addEventListener("click", redo);

    toolbar.appendChild(undoButton);
    toolbar.appendChild(redoButton);
    header.insertAdjacentElement("afterend", toolbar);
    updateButtons();
  }

  function bindHistory() {
    document.addEventListener("input", event => {
      if (!event.target.closest || !event.target.closest(".planner-main")) return;
      scheduleRecord(false);
    }, true);

    document.addEventListener("change", event => {
      if (!event.target.closest || !event.target.closest(".planner-main")) return;
      scheduleRecord(true);
    }, true);

    document.addEventListener("click", event => {
      if (!event.target.closest || !event.target.closest(".planner-main")) return;
      const button = event.target.closest("button");
      if (!button) return;
      if (button.id === "planner-undo-button" || button.id === "planner-redo-button") return;
      window.setTimeout(() => scheduleRecord(true), 0);
    }, true);

    document.addEventListener("keydown", event => {
      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier || event.key.toLowerCase() !== "z") return;

      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    });
  }

  function initialize() {
    if (!document.querySelector(".planner-main")) return;
    addStyles();
    addToolbar();
    bindHistory();

    window.setTimeout(() => {
      lastSnapshot = captureState();
      updateButtons();
    }, 800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
