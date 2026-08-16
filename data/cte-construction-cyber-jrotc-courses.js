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
    group.courses = courses.map(([id,title,page]) => ({ id, title, sourceUrl, sourcePage: page }));
  };

  const construction = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Construction_Courses.pdf";
  mapCourses("construction-technology", "residential-maintenance-carpenter", construction, [
    ["460112","Introductory Masonry",35],["460114","Residential Maintenance Masonry",37],
    ["460220","Residential Maintenance Carpentry",38],["460222","Residential Interior Maintenance",39],
    ["460229","Co-op (Building Construction Technology)",40],["460232","Internship (Building Construction Technology)",41],
    ["460241","Introduction to Building Construction Technology",42],["460333","Residential Maintenance Wiring",44],
    ["460516","Residential Maintenance Plumbing",45],["460804","Residential Energy Auditor Prep",46],
    ["460818","Residential HVAC Maintenance",48],["460826","Electrical Components",49],
    ["460828","Refrigeration Fundamentals",50],["460847","Sheet Metal Fabrication",52],
    ["499920","Basic Blueprint Reading",53],["499930","Industrial Safety",54]
  ]);

  const computer = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_ComputerScience_Courses.pdf";
  mapCourses("computer-science", "cybersecurity", computer, [
    ["110222","Cyber Literacy I",17],["110223","Cyber Literacy II",18],["110224","Cyber Science",19],
    ["110225","Computer Science Fundamentals",20],["110230","Cybersecurity",22],["110231","AP Cybersecurity",23],
    ["110901","Introduction to Networking Concepts (non-vendor)",39],["110902","Network Fundamentals/Cisco I",40],
    ["110912","Security Fundamentals",44],["110918","Computer Science Co-op",47],["110919","Computer Science Internship",48]
  ]);
  mapCourses("computer-science", "data-science", computer, [
    ["110204","Data Science Principles",10],["110211","Introduction to Database Design",13],
    ["110225","Computer Science Fundamentals",20],["110251","Computational Thinking",24],
    ["111001","Computers, Networks, and Databases",50],["111003","Databases in the Cloud",51],
    ["111004","Data Visualization",52],["210241","Introduction to Geographical Information Systems (GIS)",61],
    ["110918","Computer Science Co-op",47],["110919","Computer Science Internship",48]
  ]);

  const jrotc = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_JROTC_Courses.pdf";
  mapCourses("jrotc", "jrotc", jrotc, [
    ["580100","U.S. Air Force Drill and Ceremonies",3],["580101","U.S. Air Force Wellness",4],["580102","U.S. Air Force Aviation Honors Ground School (AHGS)",5],
    ["580134","U.S. Air Force JROTC 1",7],["580135","U.S. Air Force JROTC 2",12],["580136","U.S. Air Force JROTC 3",17],["580137","U.S. Air Force JROTC 4",24],["580138","U.S. Air Force Honors Senior Project",29],
    ["580240","U.S. Army JROTC LET 1 — The Emerging Leader",31],["580241","U.S. Army JROTC LET 2 — The Developing Leader",32],["580242","U.S. Army JROTC LET 3 — The Supervising Leader",33],["580243","U.S. Army JROTC LET 4 — The Managing Leader",34],["580244","U.S. Army JROTC Leadership",35],
    ["580310","U.S. Navy JROTC 1",37],["580311","U.S. Navy JROTC 2",38],["580312","U.S. Navy JROTC 3",40],["580313","U.S. Navy JROTC 4",42],["580314","U.S. Navy JROTC Leadership",44],
    ["580320","U.S. Marine Corps JROTC 1",46],["580321","U.S. Marine Corps JROTC 2",47],["580322","U.S. Marine Corps JROTC 3",49],["580323","U.S. Marine Corps JROTC 4",51],["580324","U.S. Marine Corps JROTC Leadership",53]
  ]);
})();
