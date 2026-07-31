/*
==========================================
PATRIOT COMMAND
Whiteboard Lesson Resource
==========================================
*/

(function () {
  "use strict";

  const WHITEBOARD_ID =
    "patriot-whiteboard-resource";

  const WHITEBOARD_TAB_ID =
    "patriot-whiteboard-tab";

  const WHITEBOARD_STORAGE_KEY =
    "patriotWhiteboardNotes";

  let whiteboardCanvas = null;
  let whiteboardContext = null;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  /*
  ==========================================
  STYLES
  ==========================================
  */

  function addWhiteboardStyles() {
    if (
      document.getElementById(
        "patriot-whiteboard-resource-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "patriot-whiteboard-resource-styles";

    style.textContent = `
      .whiteboard-resource {
        position: absolute;
        inset: 0;
        z-index: 8;
        display: none;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        background: #ffffff;
      }

      .whiteboard-resource.show {
        display: flex;
      }

      .whiteboard-resource-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        flex: 0 0 auto;
        padding: 8px 10px;
        background:
          rgba(255, 255, 255, 0.96);
        border-bottom:
          1px solid rgba(42, 67, 163, 0.14);
      }

      .whiteboard-resource-title {
        margin: 0;
        color:
          var(
            --teach-blue,
            #2a43a3
          );
        font-family:
          "Literata",
          Georgia,
          serif;
        font-size: 0.82rem;
      }

      .whiteboard-resource-controls {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
      }

      .whiteboard-resource-button,
      .whiteboard-color-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 30px;
        padding: 5px 9px;
        color: #ffffff;
        font-size: 0.67rem;
        font-weight: 750;
        background:
          var(
            --teach-blue,
            #2a43a3
          );
        border: 0;
        border-radius: 8px;
        cursor: pointer;
      }

      .whiteboard-resource-button:hover {
        background:
          var(
            --teach-red,
            #cf1b13
          );
      }

      .whiteboard-resource-button.danger {
        background:
          var(
            --teach-red,
            #cf1b13
          );
      }

      .whiteboard-color-button {
        width: 29px;
        min-width: 29px;
        padding: 0;
        border:
          2px solid rgba(
            255,
            255,
            255,
            0.9
          );
        box-shadow:
          0 0 0 1px rgba(
            42,
            67,
            163,
            0.18
          );
      }

      .whiteboard-color-button.active {
        box-shadow:
          0 0 0 3px
          rgba(
            255,
            226,
            105,
            0.9
          );
      }

      .whiteboard-color-button[data-color="#20283a"] {
        background: #20283a;
      }

      .whiteboard-color-button[data-color="#cf1b13"] {
        background: #cf1b13;
      }

      .whiteboard-color-button[data-color="#2a43a3"] {
        background: #2a43a3;
      }

      .whiteboard-color-button[data-color="#39764d"] {
        background: #39764d;
      }

      .whiteboard-resource-canvas-wrap {
        position: relative;
        min-width: 0;
        min-height: 0;
        flex: 1;
        overflow: hidden;
        background:
          repeating-linear-gradient(
            0deg,
            #ffffff,
            #ffffff 31px,
            rgba(
              42,
              67,
              163,
              0.08
            ) 32px
          );
      }

      #patriot-whiteboard-canvas {
        display: block;
        width: 100%;
        height: 100%;
        touch-action: none;
        cursor: crosshair;
      }

      .whiteboard-resource-note {
        position: absolute;
        right: 10px;
        bottom: 8px;
        pointer-events: none;
        color: rgba(
          101,
          112,
          135,
          0.68
        );
        font-size: 0.58rem;
        font-weight: 650;
      }

      @media (max-width: 560px) {
        .whiteboard-resource-toolbar {
          align-items: flex-start;
          flex-direction: column;
        }

        .whiteboard-resource-controls {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /*
  ==========================================
  WHITEBOARD CREATION
  ==========================================
  */

  function createWhiteboard() {
    const lessonWindow =
      document.querySelector(
        ".lesson-window"
      );

    if (!lessonWindow) {
      return null;
    }

    const existing =
      document.getElementById(
        WHITEBOARD_ID
      );

    if (existing) {
      return existing;
    }

    const whiteboard =
      document.createElement("section");

    whiteboard.id =
      WHITEBOARD_ID;

    whiteboard.className =
      "whiteboard-resource";

    whiteboard.setAttribute(
      "aria-label",
      "Classroom whiteboard"
    );

    whiteboard.innerHTML = `
      <div class="whiteboard-resource-toolbar">
        <h3 class="whiteboard-resource-title">
          Classroom Whiteboard
        </h3>

        <div class="whiteboard-resource-controls">
          <button
            class="whiteboard-color-button active"
            type="button"
            data-color="#20283a"
            aria-label="Use black marker"
            title="Black marker"
          ></button>

          <button
            class="whiteboard-color-button"
            type="button"
            data-color="#cf1b13"
            aria-label="Use red marker"
            title="Red marker"
          ></button>

          <button
            class="whiteboard-color-button"
            type="button"
            data-color="#2a43a3"
            aria-label="Use blue marker"
            title="Blue marker"
          ></button>

          <button
            class="whiteboard-color-button"
            type="button"
            data-color="#39764d"
            aria-label="Use green marker"
            title="Green marker"
          ></button>

          <button
            id="whiteboard-eraser-button"
            class="whiteboard-resource-button"
            type="button"
          >
            Eraser
          </button>

          <button
            id="whiteboard-clear-button"
            class="whiteboard-resource-button danger"
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="whiteboard-resource-canvas-wrap">
        <canvas
          id="patriot-whiteboard-canvas"
          aria-label="Draw on the classroom whiteboard"
        ></canvas>

        <span class="whiteboard-resource-note">
          Draw with a mouse, stylus, or touchscreen.
        </span>
      </div>
    `;

    lessonWindow.appendChild(
      whiteboard
    );

    whiteboardCanvas =
      document.getElementById(
        "patriot-whiteboard-canvas"
      );

    whiteboardContext =
      whiteboardCanvas.getContext(
        "2d"
      );

    configureCanvas();
    connectWhiteboardControls();
    connectDrawingEvents();
    restoreSavedWhiteboard();

    return whiteboard;
  }

  /*
  ==========================================
  CANVAS
  ==========================================
  */

  function configureCanvas() {
    if (
      !whiteboardCanvas ||
      !whiteboardContext
    ) {
      return;
    }

    const bounds =
      whiteboardCanvas
        .parentElement
        .getBoundingClientRect();

    const scale =
      window.devicePixelRatio ||
      1;

    const savedImage =
      whiteboardCanvas.width > 0
        ? whiteboardCanvas.toDataURL()
        : "";

    whiteboardCanvas.width =
      Math.max(
        1,
        Math.floor(
          bounds.width * scale
        )
      );

    whiteboardCanvas.height =
      Math.max(
        1,
        Math.floor(
          bounds.height * scale
        )
      );

    whiteboardCanvas.style.width =
      `${bounds.width}px`;

    whiteboardCanvas.style.height =
      `${bounds.height}px`;

    whiteboardContext.setTransform(
      scale,
      0,
      0,
      scale,
      0,
      0
    );

    whiteboardContext.lineCap =
      "round";

    whiteboardContext.lineJoin =
      "round";

    whiteboardContext.lineWidth =
      4;

    whiteboardContext.strokeStyle =
      "#20283a";

    if (savedImage) {
      drawStoredImage(savedImage);
    }
  }

  function getPointerPosition(event) {
    const bounds =
      whiteboardCanvas
        .getBoundingClientRect();

    return {
      x:
        event.clientX -
        bounds.left,

      y:
        event.clientY -
        bounds.top
    };
  }

  function beginDrawing(event) {
    if (!whiteboardCanvas) {
      return;
    }

    event.preventDefault();

    const position =
      getPointerPosition(event);

    isDrawing = true;
    lastX = position.x;
    lastY = position.y;

    whiteboardCanvas.setPointerCapture(
      event.pointerId
    );
  }

  function continueDrawing(event) {
    if (
      !isDrawing ||
      !whiteboardContext
    ) {
      return;
    }

    event.preventDefault();

    const position =
      getPointerPosition(event);

    whiteboardContext.beginPath();

    whiteboardContext.moveTo(
      lastX,
      lastY
    );

    whiteboardContext.lineTo(
      position.x,
      position.y
    );

    whiteboardContext.stroke();

    lastX = position.x;
    lastY = position.y;
  }

  function finishDrawing(event) {
    if (!isDrawing) {
      return;
    }

    isDrawing = false;

    if (
      whiteboardCanvas &&
      event.pointerId !== undefined
    ) {
      try {
        whiteboardCanvas.releasePointerCapture(
          event.pointerId
        );
      } catch (error) {
        /*
        The pointer may already have been released.
        */
      }
    }

    saveWhiteboard();
  }

  function connectDrawingEvents() {
    if (!whiteboardCanvas) {
      return;
    }

    whiteboardCanvas.addEventListener(
      "pointerdown",
      beginDrawing
    );

    whiteboardCanvas.addEventListener(
      "pointermove",
      continueDrawing
    );

    whiteboardCanvas.addEventListener(
      "pointerup",
      finishDrawing
    );

    whiteboardCanvas.addEventListener(
      "pointercancel",
      finishDrawing
    );

    whiteboardCanvas.addEventListener(
      "pointerleave",
      finishDrawing
    );
  }

  /*
  ==========================================
  CONTROLS
  ==========================================
  */

  function selectMarkerColor(
    button
  ) {
    if (!whiteboardContext) {
      return;
    }

    document
      .querySelectorAll(
        ".whiteboard-color-button"
      )
      .forEach(colorButton => {
        colorButton.classList.remove(
          "active"
        );
      });

    button.classList.add(
      "active"
    );

    whiteboardContext.globalCompositeOperation =
      "source-over";

    whiteboardContext.lineWidth =
      4;

    whiteboardContext.strokeStyle =
      button.dataset.color;
  }

  function selectEraser() {
    if (!whiteboardContext) {
      return;
    }

    document
      .querySelectorAll(
        ".whiteboard-color-button"
      )
      .forEach(button => {
        button.classList.remove(
          "active"
        );
      });

    whiteboardContext.globalCompositeOperation =
      "destination-out";

    whiteboardContext.lineWidth =
      24;
  }

  function clearWhiteboard() {
    if (
      !whiteboardCanvas ||
      !whiteboardContext
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear the entire whiteboard?"
      );

    if (!confirmed) {
      return;
    }

    whiteboardContext.clearRect(
      0,
      0,
      whiteboardCanvas.width,
      whiteboardCanvas.height
    );

    localStorage.removeItem(
      WHITEBOARD_STORAGE_KEY
    );
  }

  function connectWhiteboardControls() {
    document
      .querySelectorAll(
        ".whiteboard-color-button"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            selectMarkerColor(
              button
            );
          }
        );
      });

    const eraserButton =
      document.getElementById(
        "whiteboard-eraser-button"
      );

    const clearButton =
      document.getElementById(
        "whiteboard-clear-button"
      );

    if (eraserButton) {
      eraserButton.addEventListener(
        "click",
        selectEraser
      );
    }

    if (clearButton) {
      clearButton.addEventListener(
        "click",
        clearWhiteboard
      );
    }
  }

  /*
  ==========================================
  STORAGE
  ==========================================
  */

  function saveWhiteboard() {
    if (!whiteboardCanvas) {
      return;
    }

    try {
      localStorage.setItem(
        WHITEBOARD_STORAGE_KEY,
        whiteboardCanvas.toDataURL(
          "image/png"
        )
      );
    } catch (error) {
      console.info(
        "Whiteboard drawing could not be saved locally.",
        error
      );
    }
  }

  function drawStoredImage(
    imageData
  ) {
    if (
      !imageData ||
      !whiteboardContext ||
      !whiteboardCanvas
    ) {
      return;
    }

    const image =
      new Image();

    image.onload = function () {
      const bounds =
        whiteboardCanvas
          .getBoundingClientRect();

      whiteboardContext.drawImage(
        image,
        0,
        0,
        bounds.width,
        bounds.height
      );
    };

    image.src =
      imageData;
  }

  function restoreSavedWhiteboard() {
    const saved =
      localStorage.getItem(
        WHITEBOARD_STORAGE_KEY
      );

    if (saved) {
      drawStoredImage(saved);
    }
  }

  /*
  ==========================================
  RESOURCE TAB
  ==========================================
  */

  function hideOtherLessonContent() {
    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const lessonPlaceholder =
      document.getElementById(
        "lesson-placeholder"
      );

    const resourcePlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    if (frame) {
      frame.style.display =
        "none";
    }

    if (lessonPlaceholder) {
      lessonPlaceholder.style.display =
        "none";
    }

    if (resourcePlaceholder) {
      resourcePlaceholder.classList.remove(
        "show"
      );
    }
  }

  function showWhiteboard() {
    const whiteboard =
      createWhiteboard();

    if (!whiteboard) {
      return;
    }

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

    const whiteboardTab =
      document.getElementById(
        WHITEBOARD_TAB_ID
      );

    if (whiteboardTab) {
      whiteboardTab.classList.add(
        "active"
      );

      whiteboardTab.setAttribute(
        "aria-pressed",
        "true"
      );
    }

    hideOtherLessonContent();

    whiteboard.classList.add(
      "show"
    );

    window.requestAnimationFrame(
      configureCanvas
    );
  }

  function hideWhiteboard() {
    const whiteboard =
      document.getElementById(
        WHITEBOARD_ID
      );

    if (whiteboard) {
      whiteboard.classList.remove(
        "show"
      );
    }
  }

  function addWhiteboardTab() {
    const tabs =
      document.getElementById(
        "resource-tabs"
      );

    if (!tabs) {
      return false;
    }

    if (
      document.getElementById(
        WHITEBOARD_TAB_ID
      )
    ) {
      return true;
    }

    /*
    Teach Loader hides the resource row when a
    lesson has no attached resources. Whiteboard
    should remain available regardless.
    */

    tabs.classList.add(
      "show"
    );

    if (
      !tabs.querySelector(
        ".resource-tabs-label"
      )
    ) {
      const label =
        document.createElement(
          "span"
        );

      label.className =
        "resource-tabs-label";

      label.textContent =
        "Resources";

      tabs.appendChild(label);
    }

    const button =
      document.createElement(
        "button"
      );

    button.id =
      WHITEBOARD_TAB_ID;

    button.type =
      "button";

    button.className =
      "resource-tab";

    button.setAttribute(
      "aria-pressed",
      "false"
    );

    button.textContent =
      "Whiteboard";

    button.addEventListener(
      "click",
      showWhiteboard
    );

    tabs.appendChild(button);

    /*
    When another resource is selected, close
    the whiteboard automatically.
    */

    tabs.addEventListener(
      "click",
      event => {
        const selectedButton =
          event.target.closest(
            ".resource-tab"
          );

        if (
          selectedButton &&
          selectedButton.id !==
            WHITEBOARD_TAB_ID
        ) {
          hideWhiteboard();
        }
      }
    );

    return true;
  }

  function waitForResourceTabs(
    attempts = 0
  ) {
    if (addWhiteboardTab()) {
      return;
    }

    if (attempts >= 50) {
      console.warn(
        "Whiteboard could not be added to lesson resources."
      );

      return;
    }

    window.setTimeout(
      () => {
        waitForResourceTabs(
          attempts + 1
        );
      },
      100
    );
  }

  /*
  ==========================================
  REMOVE OLD WHITEBOARD TOOL
  ==========================================
  */

  function hideOldWhiteboardControls() {
    const possibleControls =
      document.querySelectorAll(
        "button, a, [role='button']"
      );

    possibleControls.forEach(
      control => {
        const label =
          String(
            control.textContent ||
            control.getAttribute(
              "aria-label"
            ) ||
            control.getAttribute(
              "title"
            ) ||
            ""
          )
            .trim()
            .toLowerCase();

        if (
          label === "whiteboard" ||
          label === "open whiteboard"
        ) {
          if (
            control.id !==
            WHITEBOARD_TAB_ID
          ) {
            control.style.display =
              "none";
          }
        }
      }
    );
  }

  /*
  ==========================================
  START
  ==========================================
  */

  function startWhiteboardResource() {
    addWhiteboardStyles();
    createWhiteboard();
    waitForResourceTabs();

    window.setTimeout(
      hideOldWhiteboardControls,
      500
    );

    window.setTimeout(
      hideOldWhiteboardControls,
      1500
    );

    window.addEventListener(
      "resize",
      () => {
        const whiteboard =
          document.getElementById(
            WHITEBOARD_ID
          );

        if (
          whiteboard &&
          whiteboard.classList.contains(
            "show"
          )
        ) {
          configureCanvas();
        }
      }
    );

    document.addEventListener(
      "patriotTeachLessonChange",
      () => {
        window.setTimeout(
          addWhiteboardTab,
          100
        );
      }
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startWhiteboardResource
    );
  } else {
    startWhiteboardResource();
  }
})();
