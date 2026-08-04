/*
==========================================
PATRIOT COMMAND
Lesson Library Search and Class Filter
Version: 3
==========================================

Connects the search and class-filter controls
already defined in library.html.

This file does not create duplicate controls.
*/

(function () {
  "use strict";

  function addFilterBehaviorStyles() {
    if (
      document.getElementById(
        "library-filter-behavior-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "library-filter-behavior-styles";

    style.textContent = `
      .lesson-card.library-hidden {
        display: none;
      }

      .library-no-results {
        display: none;
        margin: 0;
        padding: 18px;
        text-align: center;
        color: var(--library-ink, #11284a);
        background: rgba(255, 226, 105, 0.22);
        border: 1px solid rgba(211, 168, 79, 0.55);
        border-radius: 10px;
      }

      .library-no-results.show {
        display: block;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function createNoResultsMessage() {
    if (
      document.getElementById(
        "library-no-results"
      )
    ) {
      return;
    }

    const lessonList =
      document.getElementById(
        "lesson-library-list"
      );

    if (!lessonList) {
      return;
    }

    const noResults =
      document.createElement("div");

    noResults.id =
      "library-no-results";

    noResults.className =
      "library-no-results";

    noResults.setAttribute(
      "role",
      "status"
    );

    noResults.textContent =
      "No lessons match those choices.";

    lessonList.insertAdjacentElement(
      "afterend",
      noResults
    );
  }

  function getCourseFromCard(card) {
    const metaLines =
      card.querySelectorAll(
        ".lesson-card-meta"
      );

    if (metaLines.length < 2) {
      return "";
    }

    return metaLines[1]
      .textContent
      .split("·")[0]
      .trim();
  }

  function buildClassChoices() {
    const select =
      document.getElementById(
        "lesson-class-filter"
      );

    if (!select) {
      return;
    }

    const currentValue =
      select.value;

    const courses = [
      ...new Set(
        Array.from(
          document.querySelectorAll(
            ".lesson-card"
          )
        )
          .map(getCourseFromCard)
          .filter(Boolean)
      )
    ].sort((firstCourse, secondCourse) => {
      return firstCourse.localeCompare(
        secondCourse
      );
    });

    select.innerHTML = `
      <option value="">
        All Classes
      </option>
    `;

    courses.forEach(course => {
      const option =
        document.createElement("option");

      option.value =
        course.toLowerCase();

      option.textContent =
        course;

      select.appendChild(
        option
      );
    });

    const stillExists =
      Array.from(
        select.options
      ).some(option => {
        return (
          option.value ===
          currentValue
        );
      });

    select.value =
      stillExists
        ? currentValue
        : "";
  }

  function filterLessons() {
    const searchInput =
      document.getElementById(
        "lesson-search-input"
      );

    const classFilter =
      document.getElementById(
        "lesson-class-filter"
      );

    const resultText =
      document.getElementById(
        "lesson-filter-count"
      );

    const noResults =
      document.getElementById(
        "library-no-results"
      );

    if (
      !searchInput ||
      !classFilter
    ) {
      return;
    }

    const searchText =
      searchInput.value
        .trim()
        .toLowerCase();

    const selectedCourse =
      classFilter.value;

    const cards =
      Array.from(
        document.querySelectorAll(
          ".lesson-card"
        )
      );

    let visibleCount = 0;

    cards.forEach(card => {
      const searchableText =
        (
          card.dataset.searchText ||
          card.textContent ||
          ""
        ).toLowerCase();

      const cardCourse =
        getCourseFromCard(card)
          .toLowerCase();

      const matchesSearch =
        !searchText ||
        searchableText.includes(
          searchText
        );

      const matchesCourse =
        !selectedCourse ||
        cardCourse ===
          selectedCourse;

      const shouldShow =
        matchesSearch &&
        matchesCourse;

      card.classList.toggle(
        "library-hidden",
        !shouldShow
      );

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (resultText) {
      if (cards.length === 0) {
        resultText.textContent =
          "";
      } else {
        const lessonWord =
          cards.length === 1
            ? "lesson"
            : "lessons";

        resultText.textContent =
          `${visibleCount} of ${cards.length} saved ${lessonWord} shown`;
      }
    }

    if (noResults) {
      noResults.classList.toggle(
        "show",
        cards.length > 0 &&
          visibleCount === 0
      );
    }
  }

  function refreshFilters() {
    buildClassChoices();
    filterLessons();
  }

  function connectFilters() {
    const searchInput =
      document.getElementById(
        "lesson-search-input"
      );

    const classFilter =
      document.getElementById(
        "lesson-class-filter"
      );

    if (
      !searchInput ||
      !classFilter
    ) {
      return;
    }

    searchInput.addEventListener(
      "input",
      filterLessons
    );

    classFilter.addEventListener(
      "change",
      filterLessons
    );

    window.addEventListener(
      "patriotLibraryRendered",
      refreshFilters
    );

    const lessonList =
      document.getElementById(
        "lesson-library-list"
      );

    if (
      lessonList &&
      typeof MutationObserver !==
        "undefined"
    ) {
      const observer =
        new MutationObserver(
          refreshFilters
        );

      observer.observe(
        lessonList,
        {
          childList: true
        }
      );
    }

    refreshFilters();
  }

  function startLibraryFilters() {
    addFilterBehaviorStyles();
    createNoResultsMessage();
    connectFilters();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startLibraryFilters
    );
  } else {
    startLibraryFilters();
  }
})();
