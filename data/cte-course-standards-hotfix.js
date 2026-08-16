/*
==========================================
PATRIOT COMMAND
Course-Level CTE Standards Hotfix
Reported examples — 2026–27 KDE
==========================================
*/
(function () {
  "use strict";
  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;

  function findCourse(categoryId, groupId, courseId) {
    const category = ctePathwayStandards.find(item => item.id === categoryId);
    const group = category && Array.isArray(category.groups)
      ? category.groups.find(item => item.id === groupId)
      : null;
    return group && Array.isArray(group.courses)
      ? group.courses.find(item => item.id === courseId)
      : null;
  }

  function apply(categoryId, groupId, courseId, prefix, texts) {
    const course = findCourse(categoryId, groupId, courseId);
    if (!course) return;
    course.standards = texts.map((text, index) => ({
      code: `${prefix}.${index + 1}`,
      text
    }));
  }

  apply("health-science", "allied-health", "170169", "MEDMATH", [
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
  ]);

  apply("construction-technology", "residential-maintenance-carpenter", "460818", "HVACM", [
    "Use safe HVAC procedures.",
    "Explain the basic operation of furnaces.",
    "Inspect a ventilation system.",
    "Light and adjust a pilot light.",
    "Adjust burners.",
    "Inspect heat exchangers.",
    "Adjust belts and pulleys.",
    "Service fan motors.",
    "Check air circulation around units.",
    "Replace air filters.",
    "Clean condensing and/or cooling coils.",
    "Inspect flues.",
    "Install thermostats.",
    "Inspect and clean condensate lines.",
    "Replace a thermocouple.",
    "Install window air conditioning units."
  ]);

  apply("industrial-maintenance-technology", "welding-maintenance-technician", "480528", "SMAWGB", [
    "Practice and perform safe shop procedures at all times.",
    "Apply the technical math required for employment opportunities in welding.",
    "Perform all duties with emphasis on integrity, responsibility, quality, discipline and teamwork.",
    "Weld SMAW groove welds in all positions."
  ]);

  apply("jrotc", "jrotc", "580240", "LET1", [
    "Describe how the U.S. Army JROTC program promotes personal success and citizenship.",
    "Analyze the organization and traditions of JROTC programs.",
    "Demonstrate customs and courtesies in the JROTC environment.",
    "Demonstrate proper etiquette in social settings.",
    "Use Thinking Maps® to enhance learning.",
    "Determine your behavioral preferences.",
    "Apply an appreciation of diversity to interpersonal situations.",
    "Analyze how thinking and learning affect your academic performance.",
    "Apply strategies for reading comprehension.",
    "Develop study skills and test-taking strategies.",
    "Develop a personal code of conduct.",
    "Develop a plan for personal growth.",
    "Relate drill competence to life skills.",
    "Perform stationary movements and marching techniques on command.",
    "Demonstrate correct response to squad drill commands.",
    "Apply the processes for making personal decisions and setting goals.",
    "Develop personal anger management strategies.",
    "Apply conflict resolution techniques.",
    "Determine the causes, effects, and coping strategies for stress in your life.",
    "Meet the physical fitness standards for the Cadet Challenge.",
    "Identify the components of service learning.",
    "Prepare for a service-learning project."
  ]);

  apply("transportation", "diesel-immr", "470442", "DCOOP", [
    "Gain career awareness and the opportunity to test career choices.",
    "Receive work experience related to career interests prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation.",
    "Earn funds to help finance education expenses."
  ]);

  apply("transportation", "diesel-immr", "470445", "DINT", [
    "Gain career awareness and the opportunity to test career choices.",
    "Receive work experience related to career interests prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation."
  ]);
})();
