/*
==========================================
PATRIOT COMMAND
CTE Standards Picker
Version 2
==========================================

PURPOSE

Connects the shared Kentucky CTE standards
data to the Planner.

Teachers can:
- choose a standards category;
- choose a standards group;
- choose a specific standard;
- insert the standard into the existing
  editable Standards text area.

The Standards text area remains the final
source of truth for lesson saving.
*/

(function () {
  "use strict";

  const CATEGORY_SELECT_ID =
    "cte-standard-category";

  const GROUP_SELECT_ID =
    "cte-standard-group";

  const STANDARD_SELECT_ID =
    "cte-standard-choice";

  const INSERT_BUTTON_ID =
    "insert-cte-standard";

  const STANDARDS_FIELD_ID =
    "standards";

  /*
  ==========================================
  DATA HELPERS
  ==========================================
  */

  function getStandardsData() {
  const shared =
    Array.isArray(window.cteStandards)
      ? window.cteStandards
      : [];

  const pathways =
    Array.isArray(window.ctePathwayStandards)
      ? window.ctePathwayStandards
      : [];

  return [
    ...shared,
    ...pathways
  ];
}

  function findCategory(
    categoryId
  ) {
    return (
      getStandardsData()
        .find(category => {
          return (
            category.id ===
            categoryId
          );
        }) ||
      null
    );
  }

  function findGroup(
    categoryId,
    groupId
  ) {
    const category =
      findCategory(
        categoryId
      );

    if (
      !category ||
      !Array.isArray(
        category.groups
      )
    ) {
      return null;
    }

    return (
      category.groups
        .find(group => {
          return (
            group.id ===
            groupId
          );
        }) ||
      null
    );
  }

  function findStandard(
    categoryId,
    groupId,
    standardCode
  ) {
    const group =
      findGroup(
        categoryId,
        groupId
      );

    if (
      !group ||
      !Array.isArray(
        group.standards
      )
    ) {
      return null;
    }

    return (
      group.standards
        .find(standard => {
          return (
            standard.code ===
            standardCode
          );
        }) ||
      null
    );
  }

  /*
  ==========================================
  SELECT HELPERS
  ==========================================
  */

  function resetSelect(
    select,
    placeholder
  ) {
    if (!select) {
      return;
    }

    select.innerHTML = "";

    const option =
      document.createElement(
        "option"
      );

    option.value = "";
    option.textContent =
      placeholder;

    select.appendChild(
      option
    );

    select.value = "";
  }

  function addOption(
    select,
    value,
    label
  ) {
    if (!select) {
      return;
    }

    const option =
      document.createElement(
        "option"
      );

    option.value =
      value;

    option.textContent =
      label;

    select.appendChild(
      option
    );
  }

  function setControlAvailability() {
    const categorySelect =
      document.getElementById(
        CATEGORY_SELECT_ID
      );

    const groupSelect =
      document.getElementById(
        GROUP_SELECT_ID
      );

    const standardSelect =
      document.getElementById(
        STANDARD_SELECT_ID
      );

    const insertButton =
      document.getElementById(
        INSERT_BUTTON_ID
      );

    if (
      !categorySelect ||
      !groupSelect ||
      !standardSelect ||
      !insertButton
    ) {
      return;
    }

    groupSelect.disabled =
      !categorySelect.value;

    standardSelect.disabled =
      !groupSelect.value;

    insertButton.disabled =
      !standardSelect.value;
  }

  /*
  ==========================================
  POPULATE CONTROLS
  ==========================================
  */

  function populateCategories() {
    const categorySelect =
      document.getElementById(
        CATEGORY_SELECT_ID
      );

    if (!categorySelect) {
      return;
    }

    resetSelect(
      categorySelect,
      "Choose a CTE standards category"
    );

    getStandardsData()
      .forEach(category => {
        addOption(
          categorySelect,
          category.id,
          category.title
        );
      });
  }

  function populateGroups() {
    const categorySelect =
      document.getElementById(
        CATEGORY_SELECT_ID
      );

    const groupSelect =
      document.getElementById(
        GROUP_SELECT_ID
      );

    const standardSelect =
      document.getElementById(
        STANDARD_SELECT_ID
      );

    if (
      !categorySelect ||
      !groupSelect ||
      !standardSelect
    ) {
      return;
    }

    resetSelect(
      groupSelect,
      "Choose a standards group"
    );

    resetSelect(
      standardSelect,
      "Choose a standard"
    );

    const category =
      findCategory(
        categorySelect.value
      );

    if (
      category &&
      Array.isArray(
        category.groups
      )
    ) {
      category.groups
        .forEach(group => {
          addOption(
            groupSelect,
            group.id,
            group.title
          );
        });
    }

    setControlAvailability();
  }

  function populateStandards() {
    const categorySelect =
      document.getElementById(
        CATEGORY_SELECT_ID
      );

    const groupSelect =
      document.getElementById(
        GROUP_SELECT_ID
      );

    const standardSelect =
      document.getElementById(
        STANDARD_SELECT_ID
      );

    if (
      !categorySelect ||
      !groupSelect ||
      !standardSelect
    ) {
      return;
    }

    resetSelect(
      standardSelect,
      "Choose a standard"
    );

    const group =
      findGroup(
        categorySelect.value,
        groupSelect.value
      );

    if (
      group &&
      Array.isArray(
        group.standards
      )
    ) {
      group.standards
        .forEach(standard => {
          addOption(
            standardSelect,
            standard.code,
            `${standard.code} — ${standard.text}`
          );
        });
    }

    setControlAvailability();
  }

  /*
  ==========================================
  INSERT STANDARD
  ==========================================
  */

  function insertSelectedStandard() {
    const categorySelect =
      document.getElementById(
        CATEGORY_SELECT_ID
      );

    const groupSelect =
      document.getElementById(
        GROUP_SELECT_ID
      );

    const standardSelect =
      document.getElementById(
        STANDARD_SELECT_ID
      );

    const standardsField =
      document.getElementById(
        STANDARDS_FIELD_ID
      );

    if (
      !categorySelect ||
      !groupSelect ||
      !standardSelect ||
      !standardsField
    ) {
      return;
    }

    const standard =
      findStandard(
        categorySelect.value,
        groupSelect.value,
        standardSelect.value
      );

    if (!standard) {
      return;
    }

    const standardText =
      `${standard.code}: ${standard.text}`;

    const currentText =
      String(
        standardsField.value ||
        ""
      ).trim();

    const existingLines =
      currentText
        ? currentText
            .split("\n")
            .map(line => {
              return line.trim();
            })
        : [];

    const alreadyIncluded =
      existingLines.some(line => {
        return (
          line ===
          standardText
        );
      });

    if (alreadyIncluded) {
      window.alert(
        `${standard.code} is already included in this lesson.`
      );

      standardsField.focus();

      return;
    }

    standardsField.value =
      currentText
        ? `${currentText}\n${standardText}`
        : standardText;

    standardsField.dispatchEvent(
      new Event(
        "input",
        {
          bubbles: true
        }
      )
    );

    standardsField.focus();

    standardsField.setSelectionRange(
      standardsField.value.length,
      standardsField.value.length
    );
  }

  /*
  ==========================================
  EVENTS
  ==========================================
  */

  function connectStandardsPicker() {
    const categorySelect =
      document.getElementById(
        CATEGORY_SELECT_ID
      );

    const groupSelect =
      document.getElementById(
        GROUP_SELECT_ID
      );

    const standardSelect =
      document.getElementById(
        STANDARD_SELECT_ID
      );

    const insertButton =
      document.getElementById(
        INSERT_BUTTON_ID
      );

    if (
      !categorySelect ||
      !groupSelect ||
      !standardSelect ||
      !insertButton
    ) {
      return;
    }

    categorySelect.addEventListener(
      "change",
      populateGroups
    );

    groupSelect.addEventListener(
      "change",
      populateStandards
    );

    standardSelect.addEventListener(
      "change",
      setControlAvailability
    );

    insertButton.addEventListener(
      "click",
      insertSelectedStandard
    );

    populateCategories();

    resetSelect(
      groupSelect,
      "Choose a standards group"
    );

    resetSelect(
      standardSelect,
      "Choose a standard"
    );

    setControlAvailability();
  }

  function startStandardsPicker() {
    if (
      getStandardsData()
        .length === 0
    ) {
      console.warn(
        "Kentucky CTE standards data was not available."
      );

      return;
    }

    connectStandardsPicker();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startStandardsPicker
    );
  } else {
    startStandardsPicker();
  }
})();
