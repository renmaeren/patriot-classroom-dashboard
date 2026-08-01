/*
==========================================
PATRIOT COMMAND
Teach Presentation Mode v2
==========================================
*/

(function () {
  "use strict";

  const PRESENTATION_STATE_KEY =
    "patriotTeachPresentationStep";

  let presentationSteps = [];
  let currentStepIndex = 0;

  function cleanText(value) {
    return String(value || "")
      .trim();
  }

  function hasContent(value) {
    return Boolean(
      cleanText(value)
    );
  }

  function getActiveLesson() {
    if (
      typeof window.getActiveTeachLesson ===
      "function"
    ) {
      return window.getActiveTeachLesson();
    }

    return null;
  }

  function getNormalizedLesson() {
    const lesson =
      getActiveLesson();

    if (
      !lesson ||
      typeof lesson !== "object"
    ) {
      return null;
    }

    return {
      bellRinger:
        lesson.bellRinger ||
        lesson.bellringer ||
        "",

      essentialQuestion:
        lesson.essentialQuestion ||
        lesson.essentialquestion ||
        "",

      learningTarget:
        lesson.learningTarget ||
        lesson.ican ||
        lesson.iCan ||
        "",

      successCriteria:
        lesson.successCriteria ||
        lesson.success ||
        "",

      profileComponent:
        lesson.profileComponent ||
        lesson.profileTitle ||
        "",

      profileFocus:
        lesson.profileFocus ||
        lesson.profileStatement ||
        "",

      agenda:
        lesson.agenda ||
        lesson.lessonAgenda ||
        "",

      vocabulary:
        lesson.vocabulary ||
        "",

      whyLearning:
        lesson.whyLearning ||
        "",

      materials:
        lesson.materials ||
        "",

      exitTicket:
        lesson.exitTicket ||
        "",

      homework:
        lesson.homework ||
        "",

      resources:
        Array.isArray(
          lesson.resources
        )
          ? lesson.resources
          : []
    };
  }

  function addTextStep(
    steps,
    title,
    value,
    icon
  ) {
    if (!hasContent(value)) {
      return;
    }

    steps.push({
      kind: "text",
      title,
      value:
        cleanText(value),
      icon
    });
  }

  function buildPresentationSteps() {
    const lesson =
      getNormalizedLesson();

    if (!lesson) {
      return [];
    }

    const steps = [];

    addTextStep(
      steps,
      "Bell Ringer",
      lesson.bellRinger,
      "🔔"
    );

    addTextStep(
      steps,
      "Essential Question",
      lesson.essentialQuestion,
      "?"
    );

    addTextStep(
      steps,
      "I Can",
      lesson.learningTarget,
      "🎯"
    );

    if (
      hasContent(
        lesson.profileComponent
      ) ||
      hasContent(
        lesson.profileFocus
      )
    ) {
      steps.push({
        kind: "profile",
        title:
          "Profile of a Patriot",
        component:
          cleanText(
            lesson.profileComponent
          ),
        value:
          cleanText(
            lesson.profileFocus
          ),
        icon: "★"
      });
    }

    addTextStep(
      steps,
      "Success Criteria",
      lesson.successCriteria,
      "✓"
    );

    addTextStep(
      steps,
      "Why Are We Learning This?",
      lesson.whyLearning,
      "💡"
    );

    addTextStep(
      steps,
      "Agenda",
      lesson.agenda,
      "≡"
    );

    addTextStep(
      steps,
      "Vocabulary",
      lesson.vocabulary,
      "Aa"
    );

    addTextStep(
      steps,
      "Materials Needed",
      lesson.materials,
      "▣"
    );

    lesson.resources
      .filter(resource => {
        return Boolean(
          resource &&
          resource.url
        );
      })
      .forEach(
        (
          resource,
          index
        ) => {
          steps.push({
            kind: "resource",

            title:
              resource.label ||
              resource.title ||
              resource.name ||
              `Resource ${index + 1}`,

            resourceIndex:
              index,

            resource
          });
        }
      );

    addTextStep(
      steps,
      "Exit Ticket",
      lesson.exitTicket,
      "↗"
    );

    addTextStep(
      steps,
      "Homework",
      lesson.homework,
      "⌂"
    );

    return steps;
  }

  function addPresentationStyles() {
    if (
      document.getElementById(
        "patriot-presentation-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "patriot-presentation-styles";

    style.textContent = `
      .presentation-controls {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 7;

        display: grid;
        grid-template-columns:
          auto
          minmax(0, 1fr)
          auto;
        align-items: center;
        gap: 12px;

        min-height: 58px;
        padding:
          7px
          12px;

        background:
          rgba(
            255,
            255,
            255,
            0.97
          );

        border-top:
          1px solid
          rgba(
            42,
            67,
            163,
            0.15
          );

        box-shadow:
          0 -5px 18px
          rgba(
            42,
            67,
            163,
            0.08
          );

        backdrop-filter:
          blur(14px);

        -webkit-backdrop-filter:
          blur(14px);
      }

      .presentation-center {
        display: grid;
        gap: 5px;
        min-width: 0;
      }

      .presentation-status {
        overflow: hidden;

        color:
          var(
            --teach-blue,
            #2a43a3
          );

        font-size: 0.67rem;
        font-weight: 800;
        line-height: 1.2;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .presentation-progress-track {
        width: 100%;
        height: 6px;
        overflow: hidden;

        background:
          rgba(
            42,
            67,
            163,
            0.12
          );

        border-radius: 999px;
      }

      .presentation-progress-fill {
        width: 0;
        height: 100%;

        background:
          linear-gradient(
            90deg,
            var(
              --teach-red,
              #cf1b13
            ),
            var(
              --teach-blue,
              #2a43a3
            )
          );

        border-radius: inherit;

        transition:
          width
          220ms
          ease;
      }

      .presentation-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        min-height: 34px;

        padding:
          7px
          12px;

        color:
          #ffffff;

        font-size: 0.69rem;
        font-weight: 800;

        background:
          var(
            --teach-blue,
            #2a43a3
          );

        border: 0;
        border-radius: 9px;
      }

      .presentation-button:hover {
        background:
          var(
            --teach-red,
            #cf1b13
          );
      }

      .presentation-button:disabled {
        cursor: not-allowed;
        opacity: 0.42;
      }

      .presentation-slide {
        position: absolute;

        top: 0;
        right: 0;
        bottom: 58px;
        left: 0;

        z-index: 4;

        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        gap: 16px;

        padding:
          clamp(
            28px,
            5vw,
            70px
          );

        text-align: center;

        background:
          linear-gradient(
            145deg,
            rgba(
              255,
              252,
              233,
              0.98
            ),
            rgba(
              255,
              255,
              255,
              0.99
            )
          );
      }

      .presentation-slide.show {
        display: flex;
      }

      .presentation-slide-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 64px;
        height: 64px;

        color:
          #ffffff;

        font-size: 1.45rem;
        font-weight: 850;

        background:
          linear-gradient(
            145deg,
            var(
              --teach-red,
              #cf1b13
            ),
            #97151d
          );

        border-radius: 18px;
      }

      .presentation-slide h2 {
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

        font-size:
          clamp(
            1.6rem,
            3vw,
            2.8rem
          );

        line-height: 1.12;
      }

      .presentation-slide-content {
        width:
          min(
            920px,
            100%
          );

        max-height: 65%;
        overflow-y: auto;

        color:
          var(
            --teach-ink,
            #20283a
          );

        font-size:
          clamp(
            1rem,
            1.8vw,
            1.55rem
          );

        font-weight: 600;
        line-height: 1.55;
        white-space: pre-line;
      }

      .presentation-profile-title {
        margin-bottom: 8px;

        color:
          var(
            --teach-red,
            #cf1b13
          );

        font-family:
          "Literata",
          Georgia,
          serif;

        font-size:
          clamp(
            1rem,
            1.8vw,
            1.45rem
          );

        font-weight: 800;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function createPresentationInterface() {
    const lessonWindow =
      document.querySelector(
        ".lesson-window"
      );

    if (!lessonWindow) {
      return null;
    }

    lessonWindow.style.position =
      "relative";

    let slide =
      document.getElementById(
        "presentation-slide"
      );

    if (!slide) {
      slide =
        document.createElement(
          "div"
        );

      slide.id =
        "presentation-slide";

      slide.className =
        "presentation-slide";

      lessonWindow.appendChild(
        slide
      );
    }

    let controls =
      document.getElementById(
        "presentation-controls"
      );

    if (!controls) {
      controls =
        document.createElement(
          "div"
        );

      controls.id =
        "presentation-controls";

      controls.className =
        "presentation-controls";

      controls.innerHTML = `
        <button
          id="presentation-previous"
          class="presentation-button"
          type="button"
        >
          ← Previous
        </button>

        <div class="presentation-center">
          <div
            id="presentation-status"
            class="presentation-status"
          >
            Presentation Mode
          </div>

          <div
            class="presentation-progress-track"
            aria-hidden="true"
          >
            <div
              id="presentation-progress-fill"
              class="presentation-progress-fill"
            ></div>
          </div>
        </div>

        <button
          id="presentation-next"
          class="presentation-button"
          type="button"
        >
          Next →
        </button>
      `;

      lessonWindow.appendChild(
        controls
      );
    }

    return {
      slide,
      controls
    };
  }

  function clickResourceTab(index) {
    const tabs =
      Array.from(
        document.querySelectorAll(
          ".resource-tab"
        )
      );

    const resourceButtons =
      tabs.filter(button => {
        return !button.classList.contains(
          "resource-tabs-label"
        );
      });

    const button =
      resourceButtons[index];

    if (button) {
      button.click();
    }
  }

  function showTextStep(step) {
    const slide =
      document.getElementById(
        "presentation-slide"
      );

    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const openPlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    if (!slide) {
      return;
    }

    if (frame) {
      frame.style.display =
        "none";
    }

    if (openPlaceholder) {
      openPlaceholder.classList.remove(
        "show"
      );
    }

    slide.innerHTML = `
      <div
        class="presentation-slide-icon"
        aria-hidden="true"
      >
        ${step.icon || "•"}
      </div>

      <h2>
        ${step.title}
      </h2>

      <div class="presentation-slide-content">
        ${
          step.kind === "profile"
            ? `
              <div class="presentation-profile-title">
                ${step.component}
              </div>

              <div>
                ${step.value}
              </div>
            `
            : step.value
        }
      </div>
    `;

    slide.classList.add(
      "show"
    );
  }

  function showResourceStep(step) {
    const slide =
      document.getElementById(
        "presentation-slide"
      );

    if (slide) {
      slide.classList.remove(
        "show"
      );
    }

    clickResourceTab(
      step.resourceIndex
    );
  }

  function updateControls() {
    const previousButton =
      document.getElementById(
        "presentation-previous"
      );

    const nextButton =
      document.getElementById(
        "presentation-next"
      );

    const status =
      document.getElementById(
        "presentation-status"
      );

    const progressFill =
      document.getElementById(
        "presentation-progress-fill"
      );

    const step =
      presentationSteps[
        currentStepIndex
      ];

    const totalSteps =
      presentationSteps.length;

    const progress =
      totalSteps
        ? (
            (
              currentStepIndex + 1
            ) /
            totalSteps
          ) * 100
        : 0;

    if (previousButton) {
      previousButton.disabled =
        currentStepIndex <= 0;
    }

    if (nextButton) {
      const isFinalStep =
        currentStepIndex >=
        totalSteps - 1;

      nextButton.disabled =
        isFinalStep;

      nextButton.textContent =
        isFinalStep
          ? "Lesson Complete ✓"
          : "Next →";
    }

    if (status) {
      status.textContent =
        step
          ? `${currentStepIndex + 1} of ${totalSteps} • ${step.title}`
          : "No presentation steps available";
    }

    if (progressFill) {
      progressFill.style.width =
        `${progress}%`;
    }
  }

  function showCurrentStep() {
    const step =
      presentationSteps[
        currentStepIndex
      ];

    if (!step) {
      return;
    }

    localStorage.setItem(
      PRESENTATION_STATE_KEY,
      String(
        currentStepIndex
      )
    );

    if (
      step.kind ===
      "resource"
    ) {
      showResourceStep(step);
    } else {
      showTextStep(step);
    }

    updateControls();
  }

  function movePrevious() {
    if (
      currentStepIndex <= 0
    ) {
      return;
    }

    currentStepIndex -= 1;

    showCurrentStep();
  }

  function moveNext() {
    if (
      currentStepIndex >=
      presentationSteps.length - 1
    ) {
      return;
    }

    currentStepIndex += 1;

    showCurrentStep();
  }

  function startPresentationMode() {
    addPresentationStyles();

    const interfaceElements =
      createPresentationInterface();

    if (!interfaceElements) {
      return;
    }

    presentationSteps =
      buildPresentationSteps();

    if (!presentationSteps.length) {
      return;
    }

    const savedStep =
      Number(
        localStorage.getItem(
          PRESENTATION_STATE_KEY
        )
      );

    if (
      Number.isInteger(
        savedStep
      ) &&
      savedStep >= 0 &&
      savedStep <
        presentationSteps.length
    ) {
      currentStepIndex =
        savedStep;
    }

    const previousButton =
      document.getElementById(
        "presentation-previous"
      );

    const nextButton =
      document.getElementById(
        "presentation-next"
      );

    if (previousButton) {
      previousButton.addEventListener(
        "click",
        movePrevious
      );
    }

    if (nextButton) {
      nextButton.addEventListener(
        "click",
        moveNext
      );
    }

    document.addEventListener(
      "keydown",
      event => {
        const activeElement =
          document.activeElement;

        const isTyping =
          activeElement &&
          (
            activeElement.tagName ===
              "INPUT" ||
            activeElement.tagName ===
              "TEXTAREA" ||
            activeElement.isContentEditable
          );

        if (isTyping) {
          return;
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          moveNext();
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {
          movePrevious();
        }
      }
    );

    showCurrentStep();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        window.setTimeout(
          startPresentationMode,
          350
        );
      }
    );
  } else {
    window.setTimeout(
      startPresentationMode,
      350
    );
  }
})();
