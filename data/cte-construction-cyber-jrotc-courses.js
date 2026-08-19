/* Patriot Command — 2026–27 KDE course maps: Construction, Cyber/Data Science, JROTC */
(function () {
  "use strict";
  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;
  const findGroup = (categoryId, groupId) => {
    const category = ctePathwayStandards.find(c => c.id === categoryId);
    return category && Array.isArray(category.groups) ? category.groups.find(g => g.id === groupId) : null;
  };
  const mapCourses = (categoryId, groupId, sourceUrl, courses) => {
    const group = findGroup(categoryId, groupId); if (!group) return;
    group.courseStandardsMode = true; group.sourceStatus = "verified-2026-27-kde-course-standards";
    group.sourceUrl = sourceUrl;
    group.courses = courses.map(item => {
      const [id,title,page,standards] = item;
      return { id, title, sourceUrl, sourcePage: page, standards: Array.isArray(standards) ? standards.map(x => ({...x})) : [] };
    });
  };
  const numbered = (prefix, texts) => texts.map((text, i) => ({ code: `${prefix}.${i + 1}`, text }));

  const hvacMaintenance = numbered("HVACM", [
    "Use safe HVAC procedures.", "Explain the basic operation of furnaces.", "Inspect a ventilation system.", "Light and adjust a pilot light.", "Adjust burners.", "Inspect heat exchangers.", "Adjust belts and pulleys.", "Service fan motors.", "Check air circulation around units.", "Replace air filters.", "Clean condensing and/or cooling coils.", "Inspect flues.", "Install thermostats.", "Inspect and clean condensate lines.", "Replace a thermocouple.", "Install window air conditioning units."
  ]);

  const armyLet1 = numbered("LET1", [
    "Describe how the U.S. Army JROTC program promotes personal success and citizenship.", "Analyze the organization and traditions of JROTC programs.", "Demonstrate customs and courtesies in the JROTC environment.", "Demonstrate proper etiquette in social settings.", "Use Thinking Maps® to enhance learning.", "Determine your behavioral preferences.", "Apply an appreciation of diversity to interpersonal situations.", "Analyze how thinking and learning affect your academic performance.", "Apply strategies for reading comprehension.", "Develop study skills and test-taking strategies.", "Develop a personal code of conduct.", "Develop a plan for personal growth.", "Relate drill competence to life skills.", "Perform stationary movements and marching techniques on command.", "Demonstrate correct response to squad drill commands.", "Apply the processes for making personal decisions and setting goals.", "Develop personal anger management strategies.", "Apply conflict resolution techniques.", "Determine the causes, effects, and coping strategies for stress in your life.", "Meet the physical fitness standards for the Cadet Challenge.", "Identify the components of service learning.", "Prepare for a service-learning project."
  ]);

  const armyLet2 = numbered("LET2", [
    "Identify the elements of leadership.",
    "Analyze your leadership attributes.",
    "Analyze your leadership competencies.",
    "Apply appropriate leadership styles.",
    "Develop your communication skills.",
    "Improve your writing skills.",
    "Deliver a speech that you wrote.",
    "Analyze career possibilities and requirements.",
    "Relate ethical concepts to your personal code of conduct.",
    "Assess your personal qualities as a team member.",
    "Demonstrate the skills and responsibilities of a good drill leader.",
    "Illustrate the duties of a team leader or squad leader.",
    "Assess first aid emergencies.",
    "Explain how to respond to common injuries.",
    "Describe first aid for severe emergencies.",
    "Evaluate methods to protect yourself and others from bullying.",
    "Apply strategies to prevent violence.",
    "Examine the elements of health.",
    "Develop ways to increase your fitness level.",
    "Develop a personal nutritional plan to promote health.",
    "Examine how body image, eating, and physical activity affect whole health.",
    "Evaluate the effectiveness of a service-learning project.",
    "Evaluate the important elements of our democratic government.",
    "Analyze the rights of U.S. citizens."
  ]);

  const armyLet3 = numbered("LET3", [
    "Explain how command and staff roles relate to leadership duties in your battalion.",
    "Prepare to lead meetings.",
    "Develop a plan for a battalion or school project.",
    "Develop a Continuous Improvement Plan for your JROTC battalion.",
    "Assess personal management skills.",
    "Apply a process for making ethical choices and resolving ethical dilemmas.",
    "Analyze personal supervisory skills.",
    "Create a post-secondary action plan.",
    "Develop personal planning and management strategies.",
    "Create a career portfolio.",
    "Illustrate the duties of a platoon leader or platoon sergeant.",
    "Execute platoon drills.",
    "Develop strategies for neutralizing prejudice in your relationships.",
    "Use negotiation strategies to make agreements.",
    "Describe the effects of substance abuse.",
    "Assess the impact of drug abuse on whole health.",
    "Assess the impact of alcohol and tobacco on whole health.",
    "Respond to substance abuse situations.",
    "Create the plan and schedule for a service-learning project.",
    "Explain how the mandatory and voluntary responsibilities of citizens contribute to a strong community."
  ]);

  const armyLet4 = numbered("LET4", [
    "Apply leadership skills to continuous improvement and program outcomes.",
    "Apply teaching strategies to a lesson plan or mentoring project.",
    "Use feedback to enhance your effectiveness as a leader.",
    "Determine how to manage yourself after high school successfully.",
    "Appraise your plans for the future.",
    "Apply motivation strategies to teams.",
    "Give feedback and direction to team members.",
    "Execute company drills.",
    "Execute battalion drills.",
    "Manage a service-learning project.",
    "Examine how competing principles and values challenge the fundamental principles of our society.",
    "Develop solutions for future challenges to citizen rights."
  ]);

  const armyLeadership = numbered("ARMYLEAD", [
    "Develop a personal exercise program.",
    "Correlate the rights and responsibilities of citizenship to the purpose of the U.S. government.",
    "Describe the mission of various types of military organizations.",
    "Demonstrate the ability to use decision-making skills to enhance health.",
    "Demonstrate protocol to show respect for and handle the United States flag.",
    "Demonstrate employability and social skills relative to the career cluster, including cell phone and internet etiquette, introductions, and grammar.",
    "Demonstrate leadership potential as a role model, management skills, and instructor assistant.",
    "Understand the importance of goal setting, providing feedback, and developing processes in both coaching and mentoring.",
    "Build effective relationships with peers, co-workers, and the community.",
    "Demonstrate the ability to use study skills.",
    "Perform drug prevention and interventions.",
    "Describe the importance of diet and physical activity in maintaining good health and appearance.",
    "Demonstrate proficiency in first aid, CPR, and AED."
  ]);

  const construction = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Construction_Courses.pdf";
  mapCourses("construction-technology", "residential-maintenance-carpenter", construction, [
    ["460112","Introductory Masonry",35],["460114","Residential Maintenance Masonry",37],["460220","Residential Maintenance Carpentry",38],["460222","Residential Interior Maintenance",39],["460229","Co-op (Building Construction Technology)",40],["460232","Internship (Building Construction Technology)",41],["460241","Introduction to Building Construction Technology",42],["460333","Residential Maintenance Wiring",44],["460516","Residential Maintenance Plumbing",45],["460804","Residential Energy Auditor Prep",46],["460818","Residential HVAC Maintenance",48,hvacMaintenance],["460826","Electrical Components",49],["460828","Refrigeration Fundamentals",50],["460847","Sheet Metal Fabrication",52],["499920","Basic Blueprint Reading",53],["499930","Industrial Safety",54]
  ]);

  const computer = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_ComputerScience_Courses.pdf";
  mapCourses("computer-science", "cybersecurity", computer, [["110222","Cyber Literacy I",17],["110223","Cyber Literacy II",18],["110224","Cyber Science",19],["110225","Computer Science Fundamentals",20],["110230","Cybersecurity",22],["110231","AP Cybersecurity",23],["110901","Introduction to Networking Concepts (non-vendor)",39],["110902","Network Fundamentals/Cisco I",40],["110912","Security Fundamentals",44],["110918","Computer Science Co-op",47],["110919","Computer Science Internship",48]]);
  mapCourses("computer-science", "data-science", computer, [["110204","Data Science Principles",10],["110211","Introduction to Database Design",13],["110225","Computer Science Fundamentals",20],["110251","Computational Thinking",24],["111001","Computers, Networks, and Databases",50],["111003","Databases in the Cloud",51],["111004","Data Visualization",52],["210241","Introduction to Geographical Information Systems (GIS)",61],["110918","Computer Science Co-op",47],["110919","Computer Science Internship",48]]);

  const jrotc = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_JROTC_Courses.pdf";
  mapCourses("jrotc", "jrotc", jrotc, [
    ["580100","U.S. Air Force Drill and Ceremonies",3],["580101","U.S. Air Force Wellness",4],["580102","U.S. Air Force Aviation Honors Ground School (AHGS)",5],["580134","U.S. Air Force JROTC 1",7],["580135","U.S. Air Force JROTC 2",12],["580136","U.S. Air Force JROTC 3",17],["580137","U.S. Air Force JROTC 4",24],["580138","U.S. Air Force Honors Senior Project",29],["580240","U.S. Army JROTC LET 1 — The Emerging Leader",31,armyLet1],["580241","U.S. Army JROTC LET 2 — The Developing Leader",32,armyLet2],["580242","U.S. Army JROTC LET 3 — The Supervising Leader",33,armyLet3],["580243","U.S. Army JROTC LET 4 — The Managing Leader",34,armyLet4],["580244","U.S. Army JROTC Leadership",35,armyLeadership],["580310","U.S. Navy JROTC 1",37],["580311","U.S. Navy JROTC 2",38],["580312","U.S. Navy JROTC 3",40],["580313","U.S. Navy JROTC 4",42],["580314","U.S. Navy JROTC Leadership",44],["580320","U.S. Marine Corps JROTC 1",46],["580321","U.S. Marine Corps JROTC 2",47],["580322","U.S. Marine Corps JROTC 3",49],["580323","U.S. Marine Corps JROTC 4",51],["580324","U.S. Marine Corps JROTC Leadership",53]
  ]);
})();
