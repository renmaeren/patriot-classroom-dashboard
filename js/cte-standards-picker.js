/*
==========================================
PATRIOT COMMAND
CTE Standards Picker
Version 15
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
  const LOCAL_LIBRARY_CACHE_KEY = "patriotLessonLibraryCacheV1";

  function getStandardsData() {
    const shared = typeof cteStandards !== "undefined" && Array.isArray(cteStandards) ? cteStandards : [];
    const pathways = typeof ctePathwayStandards !== "undefined" && Array.isArray(ctePathwayStandards) ? ctePathwayStandards : [];
    return [...shared, ...pathways];
  }

  function findCategory(id) {
    return getStandardsData().find(category => category.id === id) || null;
  }

  function findGroup(categoryId, groupId) {
    const category = findCategory(categoryId);
    return category && Array.isArray(category.groups)
      ? category.groups.find(group => group.id === groupId) || null
      : null;
  }

  function findPathwayStandard(categoryId, groupId, code) {
    const group = findGroup(categoryId, groupId);
    return group && Array.isArray(group.standards)
      ? group.standards.find(standard => standard.code === code) || null
      : null;
  }

  function findSelectedCourse() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const courseSelect = document.getElementById(COURSE_SELECT_ID);
    if (!categorySelect || !groupSelect || !courseSelect) return null;
    const group = findGroup(categorySelect.value, groupSelect.value);
    return group && Array.isArray(group.courses)
      ? group.courses.find(course => course.id === courseSelect.value) || null
      : null;
  }

  function findSelectedStandard() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    const groupSelect = document.getElementById(GROUP_SELECT_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    if (!categorySelect || !groupSelect || !standardSelect) return null;

    const group = findGroup(categorySelect.value, groupSelect.value);
    if (!group) return null;

    if (group.courseStandardsMode) {
      const course = findSelectedCourse();
      return course && Array.isArray(course.standards)
        ? course.standards.find(standard => standard.code === standardSelect.value) || null
        : null;
    }

    return findPathwayStandard(categorySelect.value, groupSelect.value, standardSelect.value);
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
    sourceLink.style.cssText = "display:none;margin-top:6px;font-size:.7rem;font-weight:750;color:var(--planner-blue,#2a43a3)";

    courseControl.append(label, select, sourceLink);
    grid.insertBefore(courseControl, standardControl);
    select.addEventListener("change", updateCourseSelection);
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
      const course = findSelectedCourse();
      const hasCourseStandards = !!(course && Array.isArray(course.standards) && course.standards.length);
      standardSelect.disabled = !hasCourseStandards;
      insertButton.disabled = !hasCourseStandards || !standardSelect.value;
      return;
    }

    standardSelect.disabled = !groupSelect.value;
    insertButton.disabled = !standardSelect.value;
  }

  function populateCategories() {
    const categorySelect = document.getElementById(CATEGORY_SELECT_ID);
    if (!categorySelect) return;
    resetSelect(categorySelect, "Choose a CTE standards category");
    getStandardsData().forEach(category => addOption(categorySelect, category.id, category.title));
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
    (group.courses || []).forEach(course => addOption(courseSelect, course.id, `${course.id} — ${course.title}`));
    resetSelect(standardSelect, "Choose a course above to load standards");
    standardSelect.disabled = true;
  }

  function updateCourseSelection() {
    const sourceLink = document.getElementById(COURSE_SOURCE_ID);
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    const course = findSelectedCourse();
    if (!sourceLink || !standardSelect) return;

    if (course && course.sourceUrl) {
      const page = Number(course.sourcePage || 0);
      sourceLink.href = page > 0 ? `${course.sourceUrl}#page=${page}` : course.sourceUrl;
      sourceLink.style.display = "inline-block";
    } else {
      sourceLink.style.display = "none";
      sourceLink.removeAttribute("href");
    }

    const standards = course && Array.isArray(course.standards) ? course.standards : [];
    if (!course) {
      resetSelect(standardSelect, "Choose a course above to load standards");
    } else if (!standards.length) {
      resetSelect(standardSelect, "No selectable standards loaded for this course — use official source link");
    } else {
      resetSelect(standardSelect, "Choose a standard");
      standards.forEach(standard => addOption(standardSelect, standard.code, `${standard.code} — ${standard.text}`));
    }

    setControlAvailability();
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

    if (group.courseStandardsMode && Array.isArray(group.courses) && group.courses.length) {
      populateCourses(group);
      setControlAvailability();
      return;
    }

    const standards = Array.isArray(group.standards) ? group.standards : [];
    if (!standards.length) {
      resetSelect(standardSelect, "No pathway-specific KDE standards loaded — use Academic/Employability standards");
      setControlAvailability();
      return;
    }

    resetSelect(standardSelect, "Choose a standard");
    standards.forEach(standard => addOption(standardSelect, standard.code, `${standard.code} — ${standard.text}`));
    setControlAvailability();
  }

  function insertSelectedStandard() {
    const standardSelect = document.getElementById(STANDARD_SELECT_ID);
    const field = document.getElementById(STANDARDS_FIELD_ID);
    if (!standardSelect || !field) return;

    const standard = findSelectedStandard();
    if (!standard) return;

    const text = `${standard.code}: ${standard.text}`;
    const current = String(field.value || "").trim();
    const lines = current ? current.split("\n").map(line => line.trim()) : [];

    if (lines.includes(text)) {
      window.alert(`${standard.code} is already included in this lesson.`);
      field.focus();
      return;
    }

    field.value = current ? `${current}\n${text}` : text;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
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
    if (!getStandardsData().length) {
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

  function readLocalLessonCache() {
    try {
      const value = JSON.parse(localStorage.getItem(LOCAL_LIBRARY_CACHE_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.warn("Local lesson library cache could not be read.", error);
      return [];
    }
  }

  function normalizeCachedLesson(lesson) {
    if (!lesson || !lesson.lessonId) return null;
    const courses = Array.isArray(lesson.assignedCourses) ? lesson.assignedCourses.filter(Boolean) : [];
    const periods = Array.isArray(lesson.assignedPeriods) ? lesson.assignedPeriods.filter(Boolean) : [];
    return {
      ...lesson,
      course: lesson.course || courses.join(" / "),
      periods: lesson.periods || periods.join(", "),
      lessonResources: lesson.lessonResources || lesson.resources || [],
      cachedLocally: true
    };
  }

  function captureLatestSavedLesson() {
    let lesson = null;
    try {
      lesson = JSON.parse(localStorage.getItem("patriotLastPlannedLesson") || "null");
    } catch (error) {
      return;
    }

    const normalized = normalizeCachedLesson(lesson);
    if (!normalized) return;

    const cache = readLocalLessonCache();
    const index = cache.findIndex(item => item && item.lessonId === normalized.lessonId);
    if (index >= 0) cache[index] = normalized;
    else cache.unshift(normalized);

    cache.sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));

    try {
      localStorage.setItem(LOCAL_LIBRARY_CACHE_KEY, JSON.stringify(cache.slice(0, 250)));
    } catch (error) {
      console.warn("Local lesson library cache could not be updated.", error);
    }
  }

  function installLocalLibraryCacheBridge() {
    captureLatestSavedLesson();
    const form = document.getElementById("lesson-planner-form");
    const teach = document.getElementById("teach-this-lesson-button");
    const scheduleCapture = () => {
      [500, 1500, 3500, 8500].forEach(delay => window.setTimeout(captureLatestSavedLesson, delay));
    };
    if (form) form.addEventListener("submit", scheduleCapture);
    if (teach) teach.addEventListener("click", scheduleCapture);
  }

  function initialize() {
    installLocalLibraryCacheBridge();
    const scripts = [
      ["data/cte-agriculture-standards-exact.js?v=2", "Exact Agriculture standards supplement did not load."],
      ["data/cte-business-marketing-standards-exact.js?v=2", "Exact Business & Marketing standards supplement did not load."],
      ["data/cte-computer-science-standards.js?v=2", "Computer Science standards supplement did not load."],
      ["data/cte-engineering-fcs-standards.js?v=2", "Engineering/FCS standards supplement did not load."],
      ["data/cte-media-arts-standards.js?v=2", "Media Arts standards supplement did not load."],
      ["data/cte-health-science-courses.js?v=2", "Health Science course standards map did not load."],
      ["data/cte-industrial-maintenance-welding-courses.js?v=2", "Industrial Maintenance/Welding course standards map did not load."],
      ["data/cte-transportation-courses.js?v=3", "Transportation course standards map did not load."],
      ["data/cte-construction-cyber-jrotc-courses.js?v=2", "Construction/Cyber/Data/JROTC course standards map did not load."]
    ];

    let index = 0;
    const next = () => {
      if (index >= scripts.length) {
        startStandardsPicker();
        return;
      }
      const [src, warning] = scripts[index++];
      loadScript(src, warning, next);
    };
    next();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
