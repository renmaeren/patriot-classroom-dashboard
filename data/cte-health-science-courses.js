/*
==========================================
PATRIOT COMMAND
Health Science Course Standards Sources
ACSHS/ACCTC 2026–27
==========================================
*/
(function () {
  "use strict";
  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;
  const category = ctePathwayStandards.find(item => item.id === "health-science");
  if (!category || !Array.isArray(category.groups)) return;
  const sourceUrl = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Healthcare_Courses.pdf";

  const medicalMathStandards = [
    "Perform fundamental arithmetic operations on whole numbers, fractions, decimals, and percentages for accuracy and speed.",
    "Understand mathematical procedures and use them appropriately.",
    "Accurately calculate oral and parenteral dosages.",
    "Relate mathematics to activities in health science and discuss the importance of a thorough understanding of mathematics to a successful career in the health profession.",
    "Perform conversions with accuracy interchanging apothecary, metric, and household systems.",
    "Analyze and compare over-the-counter medications according to the number of doses and unit price.",
    "Observe and record the ways measurement is used in a medical laboratory.",
    "Describe and perform steps in dosage calculations of oral and parenteral medications.",
    "Describe and perform steps in pediatric dosage calculations.",
    "Describe and perform concepts of IV therapy calculation.",
    "Use various types of graphs to interpret and analyze information.",
    "Organize information using classification rules and systems such as symbols, abbreviations, and Roman numerals.",
    "Estimate values for operations involving decimals and cognitively compute the results.",
    "Represent fractions as ratios in simplest form.",
    "Represent numbers in scientific notation.",
    "Demonstrate knowledge of measurement systems and conversion principles.",
    "Perform addition, subtraction, multiplication, and division of signed numbers.",
    "Relate words to algebraic expressions.",
    "Set up and solve proportions.",
    "Find the mean, median, and mode for a group of values.",
    "Use the 24-hour clock (military time).",
    "Utilize activities of HOSA-Future Health Professionals as an integral component of course content, skills application, and leadership development.",
    "Use information technology applications as appropriate to health care specialties.",
    "Integrate literacy and numeracy concepts and processes across all curricular units.",
    "Demonstrate employability and social skills relevant to health careers."
  ].map((text, i) => ({ code: `MEDMATH.${i + 1}`, text }));

  const catalog = {
    principles: { id: "170111", title: "Principles of Health Science", page: 4 },
    terminology: { id: "170131", title: "Medical Terminology", page: 5 },
    emergency: { id: "170141", title: "Emergency Procedures", page: 6 },
    body: { id: "170167", title: "Body Structures and Functions", page: 8 },
    math: { id: "170169", title: "Medical Math", page: 9, standards: medicalMathStandards },
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
      sourceStatus: "official-kde-course-standards",
      standards: Array.isArray(record.standards) ? record.standards.map(item => ({ ...item })) : []
    };
  }

  function apply(groupId, records) {
    const group = category.groups.find(item => item.id === groupId);
    if (!group) return;
    group.courseStandardsMode = true;
    group.courseSourceUrl = sourceUrl;
    group.courses = records.map(course);
  }

  apply("allied-health", [catalog.principles, catalog.terminology, catalog.emergency, catalog.body, catalog.math, catalog.alliedCore]);
  apply("pre-nursing", [catalog.principles, catalog.terminology, catalog.emergency, catalog.body, catalog.math, catalog.nursingCoop, catalog.preNursingInternship, catalog.nursingIntro, catalog.mna]);
  apply("biomedical-sciences", [catalog.biomedicalPrinciples, catalog.humanBodySystems, catalog.medicalInterventions, catalog.biomedicalInnovation, catalog.biomedicalInternship]);
})();
