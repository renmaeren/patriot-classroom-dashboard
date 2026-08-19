/*
==========================================
PATRIOT COMMAND
Health Science Course Standards Sources
ACSHS/ACCTC 2026–27
==========================================
*/
(function () {
  "use strict";

  if (
    typeof ctePathwayStandards === "undefined" ||
    !Array.isArray(ctePathwayStandards)
  ) return;

  const category = ctePathwayStandards.find(
    item => item.id === "health-science"
  );

  if (!category || !Array.isArray(category.groups)) return;

  const sourceUrl =
    "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Healthcare_Courses.pdf";

  function standards(prefix, items) {
    return items.map((text, index) => ({
      code: `${prefix}.${index + 1}`,
      text
    }));
  }

  const principlesStandards = standards("PHS", [
    "Analyze and interpret medical milestones, conditions, trends, and issues to develop historical perspectives about the healthcare industry.",
    "Explore the organizational structure of various health care facilities.",
    "Observe, analyze, and interpret human behaviors, social groupings, and institutions to better understand people and the relationships among individuals and groups.",
    "Identify how key systems affect services performed and the quality of health care.",
    "Describe ethical practices with respect to cultural, social, and ethnic differences within the healthcare environment.",
    "Recognize legal responsibilities, limitations, and the implications of actions within the health care industry and manage professional behavior accordingly, specifically related to HIPAA regulations.",
    "Evaluate services, products, and resources available in the community and state in order to make effective consumer decisions.",
    "Follow health and safety policies and procedures to prevent injury or illness through safe work practices.",
    "Understand the roles and responsibilities of the health care team and interact effectively with all team members.",
    "Explore Maslow's Hierarchy of Needs.",
    "Recognize an acceptable Code of Conduct for a health care worker.",
    "Use strategies for choosing and preparing for a career in the health care industry.",
    "Apply methods of giving and obtaining information to communicate effectively, both orally and in writing.",
    "Demonstrate skills and work habits that lead to success in future schooling and work.",
    "Utilize activities of HOSA-Future Health Professionals as an integral component of course content, skills application, and leadership development.",
    "Use information technology applications as appropriate to health care specialties.",
    "Integrate literacy and numeracy concepts and processes across all curricular units.",
    "Demonstrate key employability skills, including interviewing, writing resumes, and completing applications, needed for further education or employment."
  ]);

  const terminologyStandards = standards("MEDTERM", [
    "Arrange word roots, prefixes, and suffixes to form medical terms.",
    "Categorize word parts by body systems.",
    "Interpret terms relating to all major body systems.",
    "Correlate the origin of terms to other languages.",
    "Identify medical acronyms, homonyms, and eponyms.",
    "Recognize and define plural forms of medical terms.",
    "Access resources to enhance understanding of medical terms.",
    "Identify and use common medical abbreviations.",
    "Relate medical terms to normal anatomy, growth and development, diagnostic procedures, pharmacology, surgery, mental health, and medical specialties.",
    "Compare the use of medical terms in the media and real-life situations.",
    "Pronounce medical terms.",
    "Demonstrate employability and social skills relevant to health careers.",
    "Use medical terminology within a scope of practice in order to interpret, transcribe, and communicate information, data, and observations.",
    "Recognize and define suffixes that denote nouns, adjectives, and singular and plural forms of medical words.",
    "Categorize major prefixes in the following groups: position, number, measurement, negation, direction, and other prefixes.",
    "Utilize activities of HOSA-Future Health Professionals as an integral component of course content, skills application, and leadership development.",
    "Use information technology applications as appropriate to health care specialties.",
    "Integrate literacy and numeracy concepts and processes across all curricular units."
  ]);

  const emergencyStandards = standards("EMER", [
    "Demonstrate proper emergency rescue and transport procedures.",
    "Analyze emergencies and determine appropriate emergency care.",
    "Investigate legal and ethical issues related to emergency procedures.",
    "Demonstrate correct use of PPE in relation to standard precautions for the prevention or spread of disease.",
    "Compose an emergency plan for the home.",
    "Assess the physical and mental status of the client.",
    "Research and debate issues concerning organ donation.",
    "Evaluate data related to the mortality rate of the local community.",
    "Identify and locate designated emergency shelters in the community.",
    "Compare and contrast emergency procedures used in the media to reality.",
    "Inspect the school and home for potential safety hazards.",
    "Evaluate current health or safety issues in the community.",
    "Research current data available on the economic impact of life support systems.",
    "Evaluate emergency services and resources available in the community.",
    "Demonstrate proficiency in CPR, AED, and first aid techniques.",
    "Utilize activities of HOSA-Future Health Professionals as an integral component of course content, skills application, and leadership development.",
    "Use information technology applications as appropriate to health care specialties.",
    "Integrate literacy and numeracy concepts and processes across all curricular units.",
    "Demonstrate employability and social skills relevant to careers."
  ]);

  const bodyStandards = standards("BSF", [
    "Describe the basic structures and functions of cells, tissues, organs, and each body system as they relate to homeostasis.",
    "Compare relationships among cells, tissues, organs, and systems.",
    "Explain body planes, directional terms, quadrants, and cavities.",
    "Analyze the interdependence of the body systems as they relate to wellness, disease, disorders, therapies, and care rehabilitation.",
    "Analyze body system changes in light of diseases, disorders, and wellness.",
    "Compare the aging process among the body systems.",
    "Discuss and explain the interrelationships and pathophysiology behind specific illnesses affecting each body system.",
    "Integrate literacy and numeracy concepts and processes across all curricular units."
  ]);

  const medicalMathStandards = standards("MEDMATH", [
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

  const alliedCoreStandards = standards("AHCS", [
    "Develop and practice effective oral and written communication skills.",
    "Understand the roles and responsibilities of individual members of the health care team.",
    "Prepare supplies, equipment, and client for procedures according to facility protocol.",
    "Use accepted ethical practices with respect to cultural, social, and ethnic differences.",
    "Discuss legal responsibilities, limitations, and the implications of actions within the health care delivery setting.",
    "Examine how key systems relate to the services performed and affect the quality of client care.",
    "Prevent injury or illness through safe work practices and following health and safety policies and procedures.",
    "Demonstrate professional etiquette and responsibility.",
    "Demonstrate knowledge of applicable laws, statutes, or regulations in the career major area.",
    "Demonstrate performance skills as outlined on the approved internship competency list.",
    "Assess client health status according to respective professional standards and report results to the treatment team.",
    "Demonstrate the effective use of time management skills.",
    "Utilize activities of HOSA-Future Health Professionals as an integral component of course content, skills application, and leadership development.",
    "Use information technology applications as appropriate to health care specialties.",
    "Integrate literacy and numeracy concepts and processes across all curricular units.",
    "Demonstrate employability and social skills relevant to health careers.",
    "Explore individual health care careers.",
    "Demonstrate skills related to specific health professions."
  ]);

  const nursingCoopStandards = standards("NCOOP", [
    "Gain career awareness and the opportunity to test career choices.",
    "Receive work experience related to career interests prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation."
  ]);

  const preNursingInternshipStandards = standards("PNINT", [
    "Gain career awareness and the opportunity to test career major choices.",
    "Name credentialing agencies for careers related to career majors.",
    "Trace the organizational structure of the career major and affiliating agency.",
    "Research the history and rationale of the career major specialty.",
    "Identify the different specialties in the career major.",
    "Review theory related to a career pathway.",
    "Demonstrate knowledge of applicable laws, statutes, or regulations in the career area.",
    "Research common diseases or problems associated with a career major.",
    "Receive work experience related to the career major prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation.",
    "Demonstrate performance skills related to the career major area.",
    "Demonstrate knowledge of first aid and CPR as they relate to the area.",
    "Demonstrate professional etiquette and responsibilities.",
    "Demonstrate effective communication skills.",
    "Practice team-building concepts.",
    "Demonstrate effective use of time management skills.",
    "Incorporate the use of related medical terminology and theory related to the career major.",
    "Demonstrate correct observation skills.",
    "Demonstrate proper use of the telephone, communication system, copier, and fax machine.",
    "Recognize and provide environmental personal and patient safety."
  ]);

  const nursingIntroStandards = standards("NURSINTRO", [
    "Explain the U.S. healthcare system, including delivery systems and the role of healthcare providers.",
    "Explain the history of nursing as it relates to current practice.",
    "Explain the ethical and legal parameters governing the practice of practical nursing.",
    "Use medical terminology accurately and appropriately.",
    "Demonstrate the use of effective therapeutic communication techniques.",
    "Relate, at a beginning level, activities of daily living to the client's age and health status to determine care needs.",
    "Collect psychosocial and functional information for the assessment of an individual's health status.",
    "Provide basic health care information to promote and maintain health."
  ]);

  const mnaStandards = standards("MNA", [
    "Practice good personal hygiene.",
    "Maintain good personal health.",
    "Exhibit acceptable behavior.",
    "Work cooperatively with others.",
    "Maintain confidentiality.",
    "Observe the Resident's Rights.",
    "Identify and report abuse or neglect to the appropriate person.",
    "Use a plan of care to meet residents' needs.",
    "Communicate with residents, family, and staff.",
    "Assist residents in the use of intercom/call system/telephone.",
    "Report observations/information to appropriate personnel.",
    "Recognize health problems related to the aging process.",
    "Recognize the needs of the resident with cognitive impairment.",
    "Assist with providing recreational activities for the residents.",
    "Assist with giving postmortem care.",
    "Follow standard precautions and bloodborne pathogens standards.",
    "Wash hands aseptically.",
    "Provide for environmental safety.",
    "Adjust bed and side rails.",
    "Assist with the application of protective devices.",
    "Report unsafe conditions to the appropriate person.",
    "Assist with the care of residents with oxygen.",
    "Follow fire and disaster plans.",
    "Assist resident who has fallen.",
    "Assist resident who has fainted.",
    "Assist a resident who is having a seizure.",
    "Clear the obstructed airway - the conscious adult.",
    "Use elevation, direct pressure, and pressure points to control bleeding.",
    "Serve meals and collect trays.",
    "Recognize diet modifications/restrictions.",
    "Check the food tray against the diet list.",
    "Feed or assist residents in eating.",
    "Administer after meal care.",
    "Record and report intake and output.",
    "Give bed bath.",
    "Assist resident with the partial bath.",
    "Assist resident with tub bath.",
    "Assist residents with showers.",
    "Make an unoccupied (closed) bed.",
    "Make an occupied bed.",
    "Perform or assist in performing oral hygiene for the conscious/unconscious resident.",
    "Assist with or shave resident.",
    "Give backrub.",
    "Give perineal care.",
    "Shampoo/groom hair.",
    "Give nail care.",
    "Assist residents with dressing and undressing.",
    "Provide urinary catheter care.",
    "Provide care for the urinary incontinent resident to include incontinence brief.",
    "Provide care for the bowel incontinent resident.",
    "Assist resident in bladder retraining.",
    "Assist residents in bowel retraining.",
    "Assist residents in using bedpan/urinal.",
    "Assist with enema administration.",
    "Collect routine/clean catch urine specimen.",
    "Collect stool specimens.",
    "Collect sputum specimen.",
    "Use good body mechanics.",
    "Perform or assist with range of motion exercises.",
    "Turn and position the resident in bed.",
    "Transfer resident to and from bed/chair.",
    "Use a mechanical lift to transfer residents.",
    "Apply and use a gait belt.",
    "Assist residents with standing/walking.",
    "Assist residents in using a cane/walker.",
    "Transport resident by wheelchair.",
    "Move resident between stretcher and bed.",
    "Assist with admission, in-house transfer, and discharge of residents.",
    "Measure and record resident temperature by using oral, auxiliary, rectal and tympanic routes using a non-mercury glass/electronic thermometer.",
    "Measure and record radial pulse.",
    "Measure and record respiration.",
    "Measure and record blood pressure.",
    "Measure and record height/weight.",
    "Assist in the prevention of pressure/circulatory ulcers.",
    "Apply elastic stockings.",
    "Don and doff personal protective equipment."
  ]);

  const catalog = {
    principles: {
      id: "170111",
      title: "Principles of Health Science",
      page: 4,
      standards: principlesStandards
    },
    terminology: {
      id: "170131",
      title: "Medical Terminology",
      page: 5,
      standards: terminologyStandards
    },
    emergency: {
      id: "170141",
      title: "Emergency Procedures",
      page: 6,
      standards: emergencyStandards
    },
    body: {
      id: "170167",
      title: "Body Structures and Functions",
      page: 8,
      standards: bodyStandards
    },
    math: {
      id: "170169",
      title: "Medical Math",
      page: 9,
      standards: medicalMathStandards
    },
    alliedCore: {
      id: "170501",
      title: "Allied Health Core Skills",
      page: 12,
      standards: alliedCoreStandards
    },
    nursingCoop: {
      id: "170601",
      title: "Co-op (Nursing)",
      page: 36,
      standards: nursingCoopStandards
    },
    preNursingInternship: {
      id: "170603",
      title: "Internship: Pre-Nursing",
      page: 37,
      standards: preNursingInternshipStandards
    },
    nursingIntro: {
      id: "170610",
      title: "Introduction to Nursing and Health Care System",
      page: 38,
      standards: nursingIntroStandards
    },
    mna: {
      id: "170631",
      title: "Medicaid Nurse Aide",
      page: 42,
      standards: mnaStandards
    },
    biomedicalPrinciples: {
      id: "170701",
      title: "Principles of Biomedical Science",
      page: 45
    },
    humanBodySystems: {
      id: "170702",
      title: "Human Body Systems",
      page: 46
    },
    medicalInterventions: {
      id: "170703",
      title: "Medical Interventions",
      page: 47
    },
    biomedicalInnovation: {
      id: "170704",
      title: "Biomedical Innovation",
      page: 48
    },
    biomedicalInternship: {
      id: "170708",
      title: "Internship: Biomedical Science",
      page: 49
    }
  };

  function course(record) {
    return {
      id: record.id,
      title: record.title,
      sourceUrl,
      sourcePage: record.page,
      sourceStatus: "official-kde-course-standards",
      standards: Array.isArray(record.standards)
        ? record.standards.map(item => ({ ...item }))
        : []
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
