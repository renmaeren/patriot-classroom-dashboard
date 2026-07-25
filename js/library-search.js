/*
==========================================
PATRIOT COMMAND
Lesson Library Search
==========================================
*/

(function () {
  function addSearchStyles() {
    const style =
      document.createElement("style");

    style.textContent = `
      .library-search-area {
        margin-top: 18px;
      }

      .library-search-label {
        display: block;
        margin-bottom: 7px;
        color: #11284a;
        font-weight: bold;
      }

      .library-search-input {
        width: 100%;
        padding: 13px 15px;
        color: #11284a;
        font: inherit;
        background: #ffffff;
        border: 2px solid #d7dce3;
        border-radius: 9px;
      }

      .library-search-input:focus {
        outline: 3px solid rgba(211, 168, 79, 0.35);
        border-color: #d3a84f;
      }

      .library-search-results {
        margin: 10px 0 0;
        color: #657184;
        font-size: 0.92rem;
      }

      .lesson-card.search-hidden {
        display: none;
      }

      .library-no-search-results {
        display: none;
        margin-top: 18px;
        padding: 18px;
        text-align: center;
        color: #11284a;
        background: #fff0cf;
        border: 2px solid #d3a84f;
        border-radius: 10px;
      }

      .library-no-search-results.show {
        display: block;
      }
    `;

    document.head.appendChild(style);
  }

  function createSearchArea() {
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
      <label
        class="library-search-label"
        for="library-search-input"
      >
        Search Your Lessons
      </label>

      <input
        id="library-search-input"
        class="library-search-input"
        type="search"
        placeholder="Search by title, course, date, standard, agenda, or keyword"
        autocomplete="off"
      >

      <p
        id="library-search-results"
        class="library-search-results"
      ></p>
    `;

    toolbar.appendChild(area);

    const noResults =
      document.createElement("div");

    noResults.id =
      "library-no-search-results";

    noResults.className =
      "library-no-search-results";

    noResults.textContent =
      "No lessons match that search.";

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

  function filterLessons() {
    const input =
      document.getElementById(
        "library-search-input"
      );

    const resultText =
      document.getElementById(
        "library-search-results"
      );

    const noResults =
      document.getElementById(
        "library-no-search-results"
      );

    if (!input) {
      return;
    }

    const searchText =
      input.value
        .trim()
        .toLowerCase();

    const cards =
      Array.from(
        document.querySelectorAll(
          ".lesson-card"
        )
      );

    let visibleCount = 0;

    cards.forEach(card => {
      const cardText =
        card.textContent
          .toLowerCase();

      const matches =
        !searchText ||
        cardText.includes(searchText);

      card.classList.toggle(
        "search-hidden",
        !matches
      );

      if (matches) {
        visibleCount += 1;
      }
    });

    if (resultText) {
      if (!searchText) {
        resultText.textContent =
          cards.length
            ? `${cards.length} saved lesson${
                cards.length === 1
                  ? ""
                  : "s"
              }`
            : "";
      } else {
        resultText.textContent =
          `${visibleCount} lesson${
            visibleCount === 1
              ? ""
              : "s"
          } found`;
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

  function connectSearch() {
    const input =
      document.getElementById(
        "library-search-input"
      );

    if (!input) {
      return;
    }

    input.addEventListener(
      "input",
      filterLessons
    );

    /*
      The lesson cards arrive from Google
      shortly after the page opens.
    */
    const observer =
      new MutationObserver(
        filterLessons
      );

    const lessonList =
      document.getElementById(
        "lesson-library-list"
      );

    if (lessonList) {
      observer.observe(
        lessonList,
        {
          childList: true
        }
      );
    }

    filterLessons();
  }

  function startLibrarySearch() {
    addSearchStyles();
    createSearchArea();
    connectSearch();
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startLibrarySearch
    );
  } else {
    startLibrarySearch();
  }
})();
