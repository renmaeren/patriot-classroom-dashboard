/*
==========================================
PATRIOT COMMAND
CTE Standards Picker
Version 8
==========================================
*/
(function () {
  "use strict";

  const CATEGORY_SELECT_ID = "cte-standard-category";
  const GROUP_SELECT_ID = "cte-standard-group";
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

  function setControlAvailability() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    const insertButton = document.getElementById(INSERT_BUTTON_ID);

    if (!categorySelect || !groupSelect || !standardSelect || !insertButton) return;

    groupSelect.disabled = !categorySelect.value;
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

    const category = findCategory(categorySelect.value);
    if (category && Array.isArray(category.groups)) {
      category.groups.forEach(group => {
        const suffix = group.cip ? ` — ${group.cip}` : "";
        const hasStandards = Array.isArray(group.standards) && group.standards.length > 0;
        const status = hasStandards ? "" : " — common standards only";
        addOption(groupSelect, group.id, `${group.title}${suffix}${status}`);
      });
    }

    setControlAvailability();
  }

  function populateStandards() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);

    if (!categorySelect || !groupSelect || !standardSelect) return;

    const group = findGroup(categorySelect.value, groupSelect.value);

    if (!group) {
      resetSelect(standardSelect, "Choose a standard");
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

    categorySelect.addEventListener("change", populateGroups);
    groupSelect.addEventListener("change", populateStandards);
    standardSelect.addEventListener("change", setControlAvailability);
    insertButton.addEventListener("click", insertSelectedStandard);

    populateCategories();
    resetSelect(groupSelect, "Choose a standards group");
    resetSelect(standardSelect, "Choose a standard");
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
                  startStandardsPicker
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
