/*
==========================================
PATRIOT COMMAND
Lesson Library Search and Class Filter
==========================================
*/

(function () {
  function addFilterStyles() {
    if (
      document.getElementById(
        "library-filter-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id = "library-filter-styles";

    style.textContent = `
      .library-search-area {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 14px;
        margin-top: 18px;
      }

      .library-filter-group label {
        display: block;
        margin-bottom: 7px;
        color: #11284a;
        font-weight: bold;
      }

      .library-search-input,
      .library-class-filter {
        width: 100%;
        padding: 13px 15px;
        color: #11284a;
        font: inherit;
        background: #ffffff;
        border: 2px solid #d7dce3;
        border-radius: 9px;
      }

      .library-search-input:focus,
      .library-class-filter:focus {
        outline: 3px solid rgba(211, 168, 79, 0.35);
        border-color: #d3a84f;
      }

      .library-search-results {
        grid-column: 1 / -1;
        margin: 0;
        color: #657184;
        font-size: 0.92rem;
      }

      .lesson-card.library-hidden {
        display: none;
      }

      .library-no-results {
        display: none;
        margin-top: 18px;
        padding: 18px;
        text-align: center;
        color: #11284a;
        background: #fff0cf;
        border: 2px solid #d3a84f;
        border-radius: 10px;
      }

      .library-no-results.show {
        display: block;
      }

      @media (max-width: 700px) {
        .library-search-area {
          grid-template-columns: 1fr;
        }

        .library-search-results {
          grid-column: auto;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createFilterArea() {
    const toolbar =
      document.querySelector(
        ".library-toolbar"
      );

    if (
      !toolbar ||
      document.getElementById(
        "library-search-input"
      )
    ) {
      return;
    }

    const area =
      document.createElement("div");

    area.className =
      "library-search-area";

    area.innerHTML = `
      <div class="library-filter-group">
        <label for="library-search-input">
          Search Your Lessons
        </label>

        <input
          id="library-search-input"
          class="library-search-input"
          type="search"
          placeholder="Search by title, standard, agenda, or keyword"
          autocomplete="off"
        >
      </div>

      <div class="library-filter-group">
        <label for="library-class-filter">
          Class
        </label>

        <select
          id="library-class-filter"
          class="library-class-filter"
        >
          <option value="">
            All Classes
          </option>
        </select>
      </div>

      <p
        id="library-search-results"
        class="library-search-results"
      ></p>
    `;

    toolbar.appendChild(area);

    const noResults =
      document.createElement("div");

    noResults.id =
      "library-no-results";

    noResults.className =
      "library-no-results";

    noResults.textContent =
      "No lessons match those choices.";

    const lessonList =
      document.getElementById(
        "lesson-library-list"
      );

    if (lessonList) {
      lessonList.insertAdjacentElement(
        "afterend",
        noResults
      );
    }
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
        "library-class-filter"
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
    ].sort();

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

      option.textContent = course;

      select.appendChild(option);
    });

    select.value = currentValue;
  }

  function filterLessons() {
    const searchInput =
      document.getElementById(
        "library-search-input"
      );

    const classFilter =
      document.getElementById(
        "library-class-filter"
      );

    const resultText =
      document.getElementById(
        "library-search-results"
      );

    const noResults =
      document.getElementById(
        "library-no-results"
      );

    if (!searchInput || !classFilter) {
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
      const cardText =
        card.textContent.toLowerCase();

      const cardCourse =
        getCourseFromCard(card)
          .toLowerCase();

      const matchesSearch =
        !searchText ||
        cardText.includes(searchText);

      const matchesCourse =
        !selectedCourse ||
        cardCourse === selectedCourse;

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
      resultText.textContent =
        cards.length
          ? `${visibleCount} of ${cards.length} saved lesson${
              cards.length === 1
                ? ""
                : "s"
            } shown`
          : "";
    }

    if (noResults) {
      noResults.classList.toggle(
        "show",
        cards.length > 0 &&
        visibleCount === 0
      );
    }
  }

  function connectFilters() {
    const searchInput =
      document.getElementById(
        "library-search-input"
      );

    const classFilter =
      document.getElementById(
        "library-class-filter"
      );

    if (!searchInput || !classFilter) {
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

    const lessonList =
      document.getElementById(
        "lesson-library-list"
      );

    if (lessonList) {
      const observer =
        new MutationObserver(() => {
          buildClassChoices();
          filterLessons();
        });

      observer.observe(
        lessonList,
        {
          childList: true
        }
      );
    }

    buildClassChoices();
    filterLessons();
  }

  function startLibraryFilters() {
    addFilterStyles();
    createFilterArea();
    connectFilters();
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startLibraryFilters
    );
  } else {
    startLibraryFilters();
  }
})();
