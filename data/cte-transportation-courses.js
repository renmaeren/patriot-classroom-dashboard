/*
==========================================
PATRIOT COMMAND
Transportation Course Standards Sources
ACSHS/ACCTC 2026–27
==========================================

KDE publishes Transportation expectations at the course level and points
Automotive and Diesel programs to current ASE Education Foundation task lists.
This file maps Allen County's current Transportation pathways to the relevant
2026–27 KDE course entries without reproducing the full industry task lists.
*/
(function () {
  "use strict";

  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;

  const category = ctePathwayStandards.find(item => item.id === "transportation");
  if (!category || !Array.isArray(category.groups)) return;

  const sourceUrl = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Transportation_Courses.pdf";

  const catalog = {
    autoCoop: { id: "470501", title: "Co-op I (Auto)", page: 6 },
    autoInternship: { id: "470504", title: "Automotive Internship I", page: 7 },
    autoA: { id: "470507", title: "Automotive Maintenance and Light Repair Section A", page: 8 },
    autoB: { id: "470509", title: "Automotive Maintenance and Light Repair Section B", page: 10 },
    autoC: { id: "470511", title: "Automotive Maintenance and Light Repair Section C", page: 11 },
    autoD: { id: "470513", title: "Automotive Maintenance and Light Repair Section D", page: 12 },
    dieselCoop: { id: "470442", title: "Co-op I (Diesel)", page: 63 },
    dieselInternship: { id: "470445", title: "Internship I (Diesel)", page: 64 },
    dieselA: { id: "470450", title: "Diesel Medium/Heavy Duty Truck IMMR Section A", page: 65 },
    dieselB: { id: "470451", title: "Diesel Medium/Heavy Duty Truck IMMR Section B", page: 67 },
    dieselC: { id: "470452", title: "Diesel Medium/Heavy Duty Truck IMMR Section C", page: 68 },
    dieselD: { id: "470453", title: "Diesel Medium/Heavy Duty Truck IMMR Section D", page: 69 }
  };

  function course(record) {
    return {
      id: record.id,
      title: record.title,
      sourceUrl,
      sourcePage: record.page,
      sourceStatus: "official-kde-course-standards",
      industryStandardsNote: "KDE identifies the current ASE Education Foundation task list as the program standards source for this pathway."
    };
  }

  function apply(groupId, records) {
    const group = category.groups.find(item => item.id === groupId);
    if (!group) return;
    group.courseStandardsMode = true;
    group.courseSourceUrl = sourceUrl;
    group.courses = records.map(course);
  }

  apply("automotive-maintenance-light-repair", [
    catalog.autoA,
    catalog.autoB,
    catalog.autoC,
    catalog.autoD,
    catalog.autoCoop,
    catalog.autoInternship
  ]);

  apply("diesel-immr", [
    catalog.dieselA,
    catalog.dieselB,
    catalog.dieselC,
    catalog.dieselD,
    catalog.dieselCoop,
    catalog.dieselInternship
  ]);
})();
