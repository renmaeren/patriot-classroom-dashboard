/*
==========================================
PATRIOT COMMAND
CTE Standards Picker
Version 10
==========================================
*/
(function () {
  "use strict";

  const CATEGORY_SELECT_ID = "cte-standard-category";
  const GROUP_SELECT_ID = "cte-standard-group";
  const COURSE_SELECT_ID = "cte-standard-course";
  const COURSE_SOURCE_ID = "cte-course-source";
  const STANDARD_SELECT_ID = "cte-standard-choice";
  const INSERT_BUTTON_ID = "insert-cte-standard";
  const STANDARDS_FIELD_ID = "standards";

  function getStandardsData() {
    const shared = typeof cteStandards !== "undefined" && Array.isArray(cteStandards)
      ? cteStandards
      : [];

    const pathways = typeof ctePathwayStandards !== "undefined" && Array.isArray(ctePathwayStandards)
      ? ctePathwayStandards
      : [];

    return [...shared, ...pathways];
  }

  function findCategory(categoryId) {
    return getStandardsData().find(category => category.id === categoryId) || null;
  }

  function findGroup(categoryId, groupId) {
    const category = findCategory(categoryId);
    if (!category || !Array.isArray(category.groups)) return null;
    return category.groups.find(group => group.id === groupId) || null;
  }

  function findStandard(categoryId, groupId, standardCode) {
    const group = findGroup(categoryId, groupId);
    if (!group || !Array.isArray(group.standards)) return null;
    return group.standards.find(standard => standard.code === standardCode) || null;
  }

  function resetSelect(select, placeholder) {
    if (!select) return;
    select.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    select.appendChild(option);
    select.value = "";
  }

  function addOption(select, value, label) {
    if (!select) return;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }

  function ensureCourseControls() {
    if (document.getElementById(COURSE_SELECT_ID)) return;

    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    if (!groupSelect || !standardSelect) return;

    const groupControl = groupSelect.closest(".cte-standard-control");
    const standardControl = standardSelect.closest(".cte-standard-control");
    const grid = standardControl ? standardControl.parentElement : null;
    if (!groupControl || !standardControl || !grid) return;

    const courseControl = document.createElement("div");
    courseControl.className = "cte-standard-control";
    courseControl.id = "cte-course-control";
    courseControl.style.display = "none";

    const label = document.createElement("label");
    label.htmlFor = COURSE_SELECT_ID;
    label.textContent = "Course";

    const select = document.createElement("select");
    select.id = COURSE_SELECT_ID;
    select.disabled = true;
    resetSelect(select, "Choose a KDE course");

    const sourceLink = document.createElement("a");
    sourceLink.id = COURSE_SOURCE_ID;
    sourceLink.href = "#";
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    sourceLink.textContent = "Open official KDE course standards ↗";
    sourceLink.style.display = "none";
    sourceLink.style.marginTop = "6px";
    sourceLink.style.fontSize = "0.7rem";
    sourceLink.style.fontWeight = "750";
    sourceLink.style.color = "var(--planner-blue, #2a43a3)";

    courseControl.appendChild(label);
    courseControl.appendChild(select);
    courseControl.appendChild(sourceLink);
    grid.insertBefore(courseControl, standardControl);

    select.addEventListener("change", updateCourseSource);
  }

  function getCourseSelect() {
    return document.getElementById(COURSE_SELECT_ID);
  }

  function resetCourseControls() {
    const courseControl = document.getElementById("cte-course-control");
    const courseSelect = getCourseSelect();
    const sourceLink = document.getElementById(COURSE_SOURCE_ID);

    if (courseSelect) {
      resetSelect(courseSelect, "Choose a KDE course");
      courseSelect.disabled = true;
    }
    if (sourceLink) {
      sourceLink.style.display = "none";
      sourceLink.removeAttribute("href");
    }
    if (courseControl) courseControl.style.display = "none";
  }

  function setControlAvailability() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const courseSelect = getCourseSelect();
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    const insertButton = document.getElementById(INSERT_BUTTON_ID);

    if (!categorySelect || !groupSelect || !standardSelect || !insertButton) return;

    groupSelect.disabled = !categorySelect.value;

    const group = findGroup(categorySelect.value, groupSelect.value);
    const courseMode = !!(group && group.courseStandardsMode);

    if (courseSelect && courseMode) {
      courseSelect.disabled = !groupSelect.value;
      standardSelect.disabled = true;
      insertButton.disabled = true;
      return;
    }

    standardSelect.disabled = !groupSelect.value;
    insertButton.disabled = !standardSelect.value;
  }

  function populateCategories() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    if (!categorySelect) return;

    resetSelect(categorySelect, "Choose a CTE standards category");
    getStandardsData().forEach(category => {
      addOption(categorySelect, category.id, category.title);
    });
  }

  function populateGroups() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);

    if (!categorySelect || !groupSelect || !standardSelect) return;

    resetSelect(groupSelect, "Choose a standards group");
    resetSelect(standardSelect, "Choose a standard");
    resetCourseControls();

    const category = findCategory(categorySelect.value);
    if (category && Array.isArray(category.groups)) {
      category.groups.forEach(group => {
        const suffix = group.cip ? ` — ${group.cip}` : "";
        const hasStandards = Array.isArray(group.standards) && group.standards.length > 0;
        const hasCourses = Array.isArray(group.courses) && group.courses.length > 0;
        const status = hasStandards ? "" : hasCourses ? " — course standards" : " — common standards only";
        addOption(groupSelect, group.id, `${group.title}${suffix}${status}`);
      });
    }

    setControlAvailability();
  }

  function populateCourses(group) {
    const courseControl = document.getElementById("cte-course-control");
    const courseSelect = getCourseSelect();
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);

    if (!courseControl || !courseSelect || !standardSelect) return;

    courseControl.style.display = "block";
    resetSelect(courseSelect, "Choose a KDE course");
    courseSelect.disabled = false;

    (group.courses || []).forEach(course => {
      addOption(courseSelect, course.id, `${course.id} — ${course.title}`);
    });

    resetSelect(
      standardSelect,
      "Choose a course above to open its official KDE standards"
    );
  }

  function updateCourseSource() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const courseSelect = getCourseSelect();
    const sourceLink = document.getElementById(COURSE_SOURCE_ID);

    if (!categorySelect || !groupSelect || !courseSelect || !sourceLink) return;

    const group = findGroup(categorySelect.value, groupSelect.value);
    const course = group && Array.isArray(group.courses)
      ? group.courses.find(item => item.id === courseSelect.value)
      : null;

    if (!course || !course.sourceUrl) {
      sourceLink.style.display = "none";
      sourceLink.removeAttribute("href");
      return;
    }

    const page = Number(course.sourcePage || 0);
    sourceLink.href = page > 0 ? `${course.sourceUrl}#page=${page}` : course.sourceUrl;
    sourceLink.style.display = "inline-block";
  }

  function populateStandards() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);

    if (!categorySelect || !groupSelect || !standardSelect) return;

    resetCourseControls();
    const group = findGroup(categorySelect.value, groupSelect.value);

    if (!group) {
      resetSelect(standardSelect, "Choose a standard");
      setControlAvailability();
      return;
    }

    if (group.courseStandardsMode && Array.isArray(group.courses) && group.courses.length > 0) {
      populateCourses(group);
      setControlAvailability();
      return;
    }

    const standards = Array.isArray(group.standards) ? group.standards : [];

    if (standards.length === 0) {
      resetSelect(
        standardSelect,
        "No pathway-specific KDE standards loaded — use Academic/Employability standards"
      );
      setControlAvailability();
      return;
    }

    resetSelect(standardSelect, "Choose a standard");
    standards.forEach(standard => {
      addOption(standardSelect, standard.code, `${standard.code} — ${standard.text}`);
    });

    setControlAvailability();
  }

  function insertSelectedStandard() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    const standardsField = document.getElementById(STANDARDS_FIELD_ID);

    if (!categorySelect || !groupSelect || !standardSelect || !standardsField) return;

    const standard = findStandard(
      categorySelect.value,
      groupSelect.value,
      standardSelect.value
    );

    if (!standard) return;

    const standardText = `${standard.code}: ${standard.text}`;
    const currentText = String(standardsField.value || "").trim();
    const existingLines = currentText
      ? currentText.split("\n").map(line => line.trim())
      : [];

    if (existingLines.includes(standardText)) {
      window.alert(`${standard.code} is already included in this lesson.`);
      standardsField.focus();
      return;
    }

    standardsField.value = currentText
      ? `${currentText}\n${standardText}`
      : standardText;

    standardsField.dispatchEvent(new Event("input", { bubbles: true }));
    standardsField.focus();
    standardsField.setSelectionRange(
      standardsField.value.length,
      standardsField.value.length
    );
  }

  function connectStandardsPicker() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    const insertButton = document.getElementById(INSERT_BUTTON_ID);

    if (!categorySelect || !groupSelect || !standardSelect || !insertButton) return;

    ensureCourseControls();

    categorySelect.addEventListener("change", populateGroups);
    groupSelect.addEventListener("change", populateStandards);
    standardSelect.addEventListener("change", setControlAvailability);
    insertButton.addEventListener("click", insertSelectedStandard);

    populateCategories();
    resetSelect(groupSelect, "Choose a standards group");
    resetSelect(standardSelect, "Choose a standard");
    resetCourseControls();
    setControlAvailability();
  }

  function startStandardsPicker() {
    if (getStandardsData().length === 0) {
      console.warn("Kentucky CTE standards data was not available.");
      return;
    }
    connectStandardsPicker();
  }

  function loadScript(src, warning, done) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = done;
    script.onerror = function () {
      console.warn(warning);
      done();
    };
    document.head.appendChild(script);
  }

  function initialize() {
    loadScript(
      "data/cte-agriculture-standards-exact.js?v=1",
      "Exact Agriculture standards supplement did not load.",
      function () {
        loadScript(
          "data/cte-business-marketing-standards-exact.js?v=1",
          "Exact Business & Marketing standards supplement did not load.",
          function () {
            loadScript(
              "data/cte-computer-science-standards.js?v=1",
              "Computer Science standards supplement did not load.",
              function () {
                loadScript(
                  "data/cte-engineering-fcs-standards.js?v=1",
                  "Engineering/FCS standards supplement did not load.",
                  function () {
                    loadScript(
                      "data/cte-media-arts-standards.js?v=1",
                      "Media Arts standards supplement did not load.",
                      function () {
                        loadScript(
                          "data/cte-health-science-courses.js?v=1",
                          "Health Science course standards map did not load.",
                          startStandardsPicker
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
