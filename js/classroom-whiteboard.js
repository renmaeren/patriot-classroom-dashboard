/*
==========================================
PATRIOT COMMAND
Classroom Whiteboard
==========================================

A simple full-screen classroom whiteboard.

FEATURES:
- Draw
- Erase
- Brush colors
- Brush sizes
- Undo
- Clear
- Local autosave
- Mouse, touch, and stylus support
*/

(function () {
  const WHITEBOARD_STORAGE_KEY =
    "patriotClassroomWhiteboard";

  const MAX_UNDO_STATES = 20;

  const DEFAULT_COLOR = "#11284a";
  const DEFAULT_BRUSH_SIZE = 6;
  const DEFAULT_ERASER_SIZE = 28;

  let overlay = null;
  let canvas = null;
  let context = null;

  let drawing = false;
  let lastPoint = null;

  let currentTool = "draw";
  let currentColor = DEFAULT_COLOR;
  let currentBrushSize = DEFAULT_BRUSH_SIZE;

  let undoStack = [];
  let resizeTimer = null;
  let saveTimer = null;

  /*
  ==========================================
  STYLES
  ==========================================
  */

  function addWhiteboardStyles() {
    if (
      document.getElementById(
        "patriot-whiteboard-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "patriot-whiteboard-styles";

    style.textContent = `
      .patriot-whiteboard-overlay {
        position: fixed;
        inset: 0;
        z-index: 9000;
        display: none;
        flex-direction: column;
        background: #eef1f5;
      }

      .patriot-whiteboard-overlay.open {
        display: flex;
      }

      .patriot-whiteboard-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 62px;
        padding: 9px 14px;
        color: #ffffff;
        background: #11284a;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }

      .patriot-whiteboard-title {
        flex: 0 0 auto;
        margin: 0 10px 0 0;
        font-size: 1.08rem;
        line-height: 1;
      }

      .patriot-whiteboard-toolbar {
        display: flex;
        flex: 1;
        align-items: center;
        gap: 8px;
        min-width: 0;
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .patriot-whiteboard-group {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 0 0 auto;
        padding-right: 8px;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
      }

      .patriot-whiteboard-group:last-child {
        padding-right: 0;
        border-right: 0;
      }

      .patriot-whiteboard-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
        padding: 0 11px;
        color: #11284a;
        font: inherit;
        font-size: 0.88rem;
        font-weight: 700;
        white-space: nowrap;
        background: #ffffff;
        border: 2px solid transparent;
        border-radius: 9px;
        cursor: pointer;
      }

      .patriot-whiteboard-button:hover {
        background: #f5e7e8;
      }

      .patriot-whiteboard-button.active {
        color: #ffffff;
        background: #b3262e;
        border-color: #ffffff;
      }

      .patriot-whiteboard-button:focus-visible,
      .patriot-whiteboard-color:focus-visible,
      .patriot-whiteboard-size:focus-visible {
        outline: 3px solid #d3a84f;
        outline-offset: 2px;
      }

      .patriot-whiteboard-icon-button {
        width: 40px;
        padding: 0;
        font-size: 1.15rem;
      }

      .patriot-whiteboard-close {
        flex: 0 0 auto;
        width: 42px;
        height: 42px;
        padding: 0;
        color: #ffffff;
        font-size: 1.45rem;
        font-weight: bold;
        background: #b3262e;
        border: 1px solid rgba(255, 255, 255, 0.55);
        border-radius: 10px;
        cursor: pointer;
      }

      .patriot-whiteboard-close:hover {
        background: #8f1e25;
      }

      .patriot-whiteboard-colors {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .patriot-whiteboard-color {
        width: 31px;
        height: 31px;
        padding: 0;
        background: var(--whiteboard-color);
        border: 3px solid rgba(255, 255, 255, 0.45);
        border-radius: 50%;
        cursor: pointer;
      }

      .patriot-whiteboard-color.active {
        border-color: #ffffff;
        box-shadow:
          0 0 0 2px #d3a84f,
          0 2px 6px rgba(0, 0, 0, 0.25);
      }

      .patriot-whiteboard-size-label {
        color: #ffffff;
        font-size: 0.78rem;
        font-weight: 700;
        white-space: nowrap;
      }

      .patriot-whiteboard-size {
        width: 105px;
        accent-color: #b3262e;
        cursor: pointer;
      }

      .patriot-whiteboard-size-value {
        min-width: 30px;
        color: #ffffff;
        font-size: 0.78rem;
        font-weight: 700;
        text-align: center;
      }

      .patriot-whiteboard-stage {
        position: relative;
        flex: 1;
        min-height: 0;
        padding: 14px;
        overflow: hidden;
      }

      .patriot-whiteboard-paper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background:
          linear-gradient(
            rgba(17, 40, 74, 0.045) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(17, 40, 74, 0.045) 1px,
            transparent 1px
          ),
          #ffffff;
        background-size: 28px 28px;
        border: 1px solid #cbd2dc;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
      }

      .patriot-whiteboard-canvas {
        display: block;
        width: 100%;
        height: 100%;
        cursor: crosshair;
        touch-action: none;
      }

      .patriot-whiteboard-canvas.erasing {
        cursor: cell;
      }

      .patriot-whiteboard-status {
        position: absolute;
        right: 24px;
        bottom: 21px;
        z-index: 2;
        padding: 5px 9px;
        color: #526174;
        font-size: 0.72rem;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(17, 40, 74, 0.12);
        border-radius: 999px;
        pointer-events: none;
      }

      @media (max-width: 850px) {
        .patriot-whiteboard-header {
          align-items: flex-start;
          min-height: 0;
          padding: 8px;
        }

        .patriot-whiteboard-title {
          display: none;
        }

        .patriot-whiteboard-toolbar {
          align-items: flex-start;
        }

        .patriot-whiteboard-button {
          height: 38px;
          padding: 0 9px;
        }

        .patriot-whiteboard-stage {
          padding: 8px;
        }

        .patriot-whiteboard-paper {
          border-radius: 8px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /*
  ==========================================
  WHITEBOARD HTML
  ==========================================
  */

  function createWhiteboard() {
    if (
      document.getElementById(
        "patriot-whiteboard"
      )
    ) {
      return;
    }

    overlay =
      document.createElement("section");

    overlay.id =
      "patriot-whiteboard";

    overlay.className =
      "patriot-whiteboard-overlay";

    overlay.setAttribute(
      "aria-label",
      "Classroom whiteboard"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    overlay.innerHTML = `
      <header class="patriot-whiteboard-header">
        <h2 class="patriot-whiteboard-title">
          Whiteboard
        </h2>

        <div class="patriot-whiteboard-toolbar">
          <div class="patriot-whiteboard-group">
            <button
              id="patriot-whiteboard-draw"
              class="patriot-whiteboard-button active"
              type="button"
              aria-pressed="true"
              title="Draw"
            >
              ✏️ Draw
            </button>

            <button
              id="patriot-whiteboard-erase"
              class="patriot-whiteboard-button"
              type="button"
              aria-pressed="false"
              title="Erase"
            >
              Erase
            </button>
          </div>

          <div class="patriot-whiteboard-group">
            <div
              class="patriot-whiteboard-colors"
              aria-label="Marker colors"
            >
              <button
                class="patriot-whiteboard-color active"
                type="button"
                data-whiteboard-color="#11284a"
                aria-label="Navy marker"
                title="Navy"
                style="--whiteboard-color: #11284a;"
              ></button>

              <button
                class="patriot-whiteboard-color"
                type="button"
                data-whiteboard-color="#b3262e"
                aria-label="Red marker"
                title="Red"
                style="--whiteboard-color: #b3262e;"
              ></button>

              <button
                class="patriot-whiteboard-color"
                type="button"
                data-whiteboard-color="#2f7d4a"
                aria-label="Green marker"
                title="Green"
                style="--whiteboard-color: #2f7d4a;"
              ></button>

              <button
                class="patriot-whiteboard-color"
                type="button"
                data-whiteboard-color="#7a3db8"
                aria-label="Purple marker"
                title="Purple"
                style="--whiteboard-color: #7a3db8;"
              ></button>

              <button
                class="patriot-whiteboard-color"
                type="button"
                data-whiteboard-color="#111111"
                aria-label="Black marker"
                title="Black"
                style="--whiteboard-color: #111111;"
              ></button>
            </div>
          </div>

          <div class="patriot-whiteboard-group">
            <label
              class="patriot-whiteboard-size-label"
              for="patriot-whiteboard-size"
            >
              Size
            </label>

            <input
              id="patriot-whiteboard-size"
              class="patriot-whiteboard-size"
              type="range"
              min="2"
              max="24"
              step="1"
              value="6"
            >

            <span
              id="patriot-whiteboard-size-value"
              class="patriot-whiteboard-size-value"
            >
              6
            </span>
          </div>

          <div class="patriot-whiteboard-group">
            <button
              id="patriot-whiteboard-undo"
              class="patriot-whiteboard-button patriot-whiteboard-icon-button"
              type="button"
              aria-label="Undo"
              title="Undo"
            >
              ↶
            </button>

            <button
              id="patriot-whiteboard-clear"
              class="patriot-whiteboard-button"
              type="button"
              title="Clear whiteboard"
            >
              Clear
            </button>
          </div>
        </div>

        <button
          id="patriot-whiteboard-close"
          class="patriot-whiteboard-close"
          type="button"
          aria-label="Close whiteboard"
          title="Close whiteboard"
        >
          ×
        </button>
      </header>

      <div class="patriot-whiteboard-stage">
        <div class="patriot-whiteboard-paper">
          <canvas
            id="patriot-whiteboard-canvas"
            class="patriot-whiteboard-canvas"
          ></canvas>
        </div>

        <div
          id="patriot-whiteboard-status"
          class="patriot-whiteboard-status"
          aria-live="polite"
        >
          Saved automatically
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    canvas =
      document.getElementById(
        "patriot-whiteboard-canvas"
      );

    context =
      canvas.getContext("2d");

    connectWhiteboardControls();
    resizeCanvas(false);
  }

  /*
  ==========================================
  CANVAS SIZE AND SAVING
  ==========================================
  */

  function getCanvasSnapshot() {
    if (
      !canvas ||
      canvas.width === 0 ||
      canvas.height === 0
    ) {
      return null;
    }

    return canvas.toDataURL("image/png");
  }

  function restoreSnapshot(snapshot) {
    if (
      !snapshot ||
      !canvas ||
      !context
    ) {
      return;
    }

    const image =
      new Image();

    image.onload = function () {
      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    image.src = snapshot;
  }

  function resizeCanvas(
    preserveCurrentDrawing = true
  ) {
    if (
      !canvas ||
      !context
    ) {
      return;
    }

    const currentSnapshot =
      preserveCurrentDrawing
        ? getCanvasSnapshot()
        : null;

    const rectangle =
      canvas.getBoundingClientRect();

    const pixelRatio =
      Math.max(
        1,
        window.devicePixelRatio || 1
      );

    canvas.width =
      Math.max(
        1,
        Math.round(
          rectangle.width *
          pixelRatio
        )
      );

    canvas.height =
      Math.max(
        1,
        Math.round(
          rectangle.height *
          pixelRatio
        )
      );

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    context.lineCap = "round";
    context.lineJoin = "round";

    if (currentSnapshot) {
      restoreSnapshot(
        currentSnapshot
      );
    }
  }

  function updateStatus(message) {
    const status =
      document.getElementById(
        "patriot-whiteboard-status"
      );

    if (!status) {
      return;
    }

    status.textContent = message;
  }

  function saveWhiteboard() {
    window.clearTimeout(saveTimer);

    saveTimer =
      window.setTimeout(
        () => {
          try {
            const snapshot =
              getCanvasSnapshot();

            if (!snapshot) {
              return;
            }

            localStorage.setItem(
              WHITEBOARD_STORAGE_KEY,
              snapshot
            );

            updateStatus(
              "Saved automatically"
            );
          } catch (error) {
            console.error(
              "The whiteboard could not be saved.",
              error
            );

            updateStatus(
              "Unable to save"
            );
          }
        },
        250
      );
  }

  function restoreSavedWhiteboard() {
    const saved =
      localStorage.getItem(
        WHITEBOARD_STORAGE_KEY
      );

    if (!saved) {
      return;
    }

    restoreSnapshot(saved);
  }

  /*
  ==========================================
  UNDO
  ==========================================
  */

  function saveUndoState() {
    const snapshot =
      getCanvasSnapshot();

    if (!snapshot) {
      return;
    }

    undoStack.push(snapshot);

    if (
      undoStack.length >
      MAX_UNDO_STATES
    ) {
      undoStack.shift();
    }
  }

  function undoLastAction() {
    const previousState =
      undoStack.pop();

    if (!previousState) {
      updateStatus(
        "Nothing to undo"
      );

      return;
    }

    restoreSnapshot(
      previousState
    );

    saveWhiteboard();

    updateStatus(
      "Last action undone"
    );
  }

  /*
  ==========================================
  DRAWING
  ==========================================
  */

  function getPointerPoint(event) {
    const rectangle =
      canvas.getBoundingClientRect();

    return {
      x:
        event.clientX -
        rectangle.left,
      y:
        event.clientY -
        rectangle.top
    };
  }

  function beginDrawing(event) {
    if (
      event.button !== undefined &&
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    saveUndoState();

    drawing = true;
    lastPoint =
      getPointerPoint(event);

    canvas.setPointerCapture(
      event.pointerId
    );

    context.beginPath();
    context.moveTo(
      lastPoint.x,
      lastPoint.y
    );

    drawLine(
      lastPoint,
      {
        x: lastPoint.x + 0.01,
        y: lastPoint.y + 0.01
      }
    );
  }

  function continueDrawing(event) {
    if (!drawing) {
      return;
    }

    event.preventDefault();

    const nextPoint =
      getPointerPoint(event);

    drawLine(
      lastPoint,
      nextPoint
    );

    lastPoint =
      nextPoint;
  }

  function finishDrawing(event) {
    if (!drawing) {
      return;
    }

    drawing = false;
    lastPoint = null;

    if (
      canvas.hasPointerCapture(
        event.pointerId
      )
    ) {
      canvas.releasePointerCapture(
        event.pointerId
      );
    }

    context.beginPath();

    saveWhiteboard();
  }

  function drawLine(
    startPoint,
    endPoint
  ) {
    if (
      !startPoint ||
      !endPoint
    ) {
      return;
    }

    context.save();

    if (currentTool === "erase") {
      context.globalCompositeOperation =
        "destination-out";

      context.lineWidth =
        Math.max(
          DEFAULT_ERASER_SIZE,
          currentBrushSize * 3
        );

      context.strokeStyle =
        "rgba(0, 0, 0, 1)";
    } else {
      context.globalCompositeOperation =
        "source-over";

      context.lineWidth =
        currentBrushSize;

      context.strokeStyle =
        currentColor;
    }

    context.lineCap = "round";
    context.lineJoin = "round";

    context.beginPath();
    context.moveTo(
      startPoint.x,
      startPoint.y
    );

    context.lineTo(
      endPoint.x,
      endPoint.y
    );

    context.stroke();
    context.restore();
  }

  /*
  ==========================================
  TOOLS
  ==========================================
  */

  function chooseTool(toolName) {
    currentTool = toolName;

    const drawButton =
      document.getElementById(
        "patriot-whiteboard-draw"
      );

    const eraseButton =
      document.getElementById(
        "patriot-whiteboard-erase"
      );

    const drawingSelected =
      toolName === "draw";

    drawButton.classList.toggle(
      "active",
      drawingSelected
    );

    eraseButton.classList.toggle(
      "active",
      !drawingSelected
    );

    drawButton.setAttribute(
      "aria-pressed",
      String(drawingSelected)
    );

    eraseButton.setAttribute(
      "aria-pressed",
      String(!drawingSelected)
    );

    canvas.classList.toggle(
      "erasing",
      !drawingSelected
    );

    updateStatus(
      drawingSelected
        ? "Drawing tool selected"
        : "Eraser selected"
    );
  }

  function chooseColor(button) {
    currentColor =
      button.dataset.whiteboardColor ||
      DEFAULT_COLOR;

    document
      .querySelectorAll(
        ".patriot-whiteboard-color"
      )
      .forEach(colorButton => {
        colorButton.classList.toggle(
          "active",
          colorButton === button
        );
      });

    chooseTool("draw");
  }

  function clearWhiteboard() {
    const confirmed =
      window.confirm(
        "Clear the entire whiteboard?"
      );

    if (!confirmed) {
      return;
    }

    saveUndoState();

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    localStorage.removeItem(
      WHITEBOARD_STORAGE_KEY
    );

    updateStatus(
      "Whiteboard cleared"
    );
  }

  /*
  ==========================================
  OPEN AND CLOSE
  ==========================================
  */

  function openWhiteboard() {
    if (!overlay) {
      createWhiteboard();
    }

    overlay.classList.add("open");

    overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    window.requestAnimationFrame(
      () => {
        resizeCanvas(false);
        restoreSavedWhiteboard();
      }
    );
  }

  function closeWhiteboard() {
    if (!overlay) {
      return;
    }

    if (drawing) {
      drawing = false;
      lastPoint = null;
    }

    saveWhiteboard();

    overlay.classList.remove("open");

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";
  }

  function toggleWhiteboard() {
    if (
      overlay &&
      overlay.classList.contains("open")
    ) {
      closeWhiteboard();
    } else {
      openWhiteboard();
    }
  }

  /*
  ==========================================
  EVENTS
  ==========================================
  */

  function connectWhiteboardControls() {
    const drawButton =
      document.getElementById(
        "patriot-whiteboard-draw"
      );

    const eraseButton =
      document.getElementById(
        "patriot-whiteboard-erase"
      );

    const undoButton =
      document.getElementById(
        "patriot-whiteboard-undo"
      );

    const clearButton =
      document.getElementById(
        "patriot-whiteboard-clear"
      );

    const closeButton =
      document.getElementById(
        "patriot-whiteboard-close"
      );

    const sizeInput =
      document.getElementById(
        "patriot-whiteboard-size"
      );

    const sizeValue =
      document.getElementById(
        "patriot-whiteboard-size-value"
      );

    drawButton.addEventListener(
      "click",
      () => chooseTool("draw")
    );

    eraseButton.addEventListener(
      "click",
      () => chooseTool("erase")
    );

    undoButton.addEventListener(
      "click",
      undoLastAction
    );

    clearButton.addEventListener(
      "click",
      clearWhiteboard
    );

    closeButton.addEventListener(
      "click",
      closeWhiteboard
    );

    document
      .querySelectorAll(
        ".patriot-whiteboard-color"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => chooseColor(button)
        );
      });

    sizeInput.addEventListener(
      "input",
      () => {
        currentBrushSize =
          Number(sizeInput.value) ||
          DEFAULT_BRUSH_SIZE;

        sizeValue.textContent =
          String(currentBrushSize);
      }
    );

    canvas.addEventListener(
      "pointerdown",
      beginDrawing
    );

    canvas.addEventListener(
      "pointermove",
      continueDrawing
    );

    canvas.addEventListener(
      "pointerup",
      finishDrawing
    );

    canvas.addEventListener(
      "pointercancel",
      finishDrawing
    );

    canvas.addEventListener(
      "contextmenu",
      event => {
        event.preventDefault();
      }
    );
  }

  function connectGlobalEvents() {
    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          overlay &&
          overlay.classList.contains("open")
        ) {
          closeWhiteboard();
        }

        if (
          event.ctrlKey &&
          event.key.toLowerCase() === "z" &&
          overlay &&
          overlay.classList.contains("open")
        ) {
          event.preventDefault();
          undoLastAction();
        }
      }
    );

    window.addEventListener(
      "resize",
      () => {
        if (
          !overlay ||
          !overlay.classList.contains("open")
        ) {
          return;
        }

        window.clearTimeout(
          resizeTimer
        );

        resizeTimer =
          window.setTimeout(
            () => {
              resizeCanvas(true);
            },
            150
          );
      }
    );

    document.addEventListener(
      "patriotWidgetChange",
      event => {
        const detail =
          event.detail || {};

        if (
          detail.widgetId !==
          "whiteboard"
        ) {
          return;
        }

        if (detail.enabled) {
          openWhiteboard();
        } else {
          closeWhiteboard();
        }
      }
    );
  }

  /*
  ==========================================
  PUBLIC CONTROLS
  ==========================================
  */

  window.PatriotWhiteboard = {
    open: openWhiteboard,
    close: closeWhiteboard,
    toggle: toggleWhiteboard
  };

  /*
  ==========================================
  START
  ==========================================
  */

  function startWhiteboard() {
    addWhiteboardStyles();
    createWhiteboard();
    connectGlobalEvents();
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startWhiteboard
    );
  } else {
    startWhiteboard();
  }
})();
