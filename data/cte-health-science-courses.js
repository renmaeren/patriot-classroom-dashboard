/*
==========================================
PATRIOT COMMAND
Health Science Course Standards Sources
ACSHS/ACCTC 2026–27
==========================================

KDE publishes Health Science expectations at the course level in the
2026–27 Health Science Courses document. This file maps Allen County's
Health Science pathways to the current KDE course entries without
reproducing the full standards/task text.

The Planner uses these records to let teachers choose a course and open
the exact official KDE source before inserting or pasting standards.
*/
(function () {
  "use strict";

  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;

  const category = ctePathwayStandards.find(item => item.id === "health-science");
  if (!category || !Array.isArray(category.groups)) return;

  const sourceUrl = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Healthcare_Courses.pdf";

  const catalog = {
    principles: { id: "170111", title: "Principles of Health Science", page: 4 },
    terminology: { id: "170131", title: "Medical Terminology", page: 5 },
    emergency: { id: "170141", title: "Emergency Procedures", page: 6 },
    body: { id: "170167", title: "Body Structures and Functions", page: 8 },
    math: { id: "170169", title: "Medical Math", page: 9 },
    alliedCore: { id: "170501", title: "Allied Health Core Skills", page: 12 },
    nursingCoop: { id: "170601", title: "Co-op (Nursing)", page: 36 },
    preNursingInternship: { id: "170603", title: "Internship: Pre-Nursing", page: 36 },
    nursingIntro: { id: "170610", title: "Introduction to Nursing and Health Care System", page: 38 },
    mna: { id: "170631", title: "Medicaid Nurse Aide", page: 42 },
    biomedicalPrinciples: { id: "170701", title: "Principles of Biomedical Science", page: 45 },
    humanBodySystems: { id: "170702", title: "Human Body Systems", page: 46 },
    medicalInterventions: { id: "170703", title: "Medical Interventions", page: 47 },
    biomedicalInnovation: { id: "170704", title: "Biomedical Innovation", page: 48 },
    biomedicalInternship: { id: "170708", title: "Internship: Biomedical Science", page: 49 }
  };

  function course(record) {
    return {
      id: record.id,
      title: record.title,
      sourceUrl,
      sourcePage: record.page,
      sourceStatus: "official-kde-course-standards"
    };
  }

  function apply(groupId, records) {
    const group = category.groups.find(item => item.id === groupId);
    if (!group) return;
    group.courseStandardsMode = true;
    group.courseSourceUrl = sourceUrl;
    group.courses = records.map(course);
  }

  apply("allied-health", [
    catalog.principles,
    catalog.terminology,
    catalog.emergency,
    catalog.body,
    catalog.math,
    catalog.alliedCore
  ]);

  apply("pre-nursing", [
    catalog.principles,
    catalog.terminology,
    catalog.emergency,
    catalog.body,
    catalog.math,
    catalog.nursingCoop,
    catalog.preNursingInternship,
    catalog.nursingIntro,
    catalog.mna
  ]);

  apply("biomedical-sciences", [
    catalog.biomedicalPrinciples,
    catalog.humanBodySystems,
    catalog.medicalInterventions,
    catalog.biomedicalInnovation,
    catalog.biomedicalInternship
  ]);
})();
