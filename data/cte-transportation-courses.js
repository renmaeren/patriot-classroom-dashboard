/*
==========================================
PATRIOT COMMAND
Transportation Course Standards Sources
ACSHS/ACCTC 2026–27
==========================================

KDE publishes Transportation expectations at the course level and points
Automotive and Diesel programs to current ASE Education Foundation task lists.
This file maps Allen County's current Transportation pathways to the relevant
2026–27 KDE course entries. Diesel IMMR Sections A-D also expose the 14 KDE
course standards listed in Section A; KDE states those same standards/tasks
apply across Sections A, B, C, and D and may be completed in any sequence.
*/
(function () {
  "use strict";

  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;

  const category = ctePathwayStandards.find(item => item.id === "transportation");
  if (!category || !Array.isArray(category.groups)) return;

  const sourceUrl = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Transportation_Courses.pdf";
  const aseTruckTaskListUrl = "https://www.aseeducationfoundation.org/wp-content/uploads/Truck_Test_Specs.pdf";

  const dieselImmrStandards = [
    { code: "DIMMR.1", text: "Explain and apply required shop and personal safety tasks relating to the automotive industry." },
    { code: "DIMMR.2", text: "Explain and apply required tasks associated with the proper use and handling of tools and equipment relating to the automotive industry." },
    { code: "DIMMR.3", text: "Demonstrate proficiency in preparing vehicles for routine pre/post-maintenance and customer services." },
    { code: "DIMMR.4", text: "Demonstrate workplace employability skills related to personal standards and work habits/ethics." },
    { code: "DIMMR.5", text: "Identify the basic diesel components and functions." },
    { code: "DIMMR.6", text: "Identify principles, assemblies, and systems of engine operation." },
    { code: "DIMMR.7", text: "Explain and apply the diagnosis, service, maintenance, and repair of engines, cylinder heads, valve trains, engine blocks, lubrication and cooling systems, air induction and exhaust systems, fuel systems, and engine braking systems proficiently." },
    { code: "DIMMR.8", text: "Explain and apply proficiently the diagnosis, service, maintenance and repair of various drivetrain systems and components, including clutch, transmissions, driveshafts, universal joints, and drive axles." },
    { code: "DIMMR.9", text: "Explain and apply proficiently the diagnosis, service and repair of braking systems, including air brakes and related systems, hydraulic brakes and related systems, wheel bearings, parking brake systems, power assist systems, and Vehicle Dynamic Brake Systems (Air and Hydraulic): Antilock Brake System (ABS), Automatic Traction Control (ATC) System, and Electronic Stability Control (ESC) Systems." },
    { code: "DIMMR.10", text: "Explain and apply proficiently the diagnosis, service and repair of suspension and steering systems, including steering columns, steering pump and gear units, steering linkage, suspension systems, wheel alignments, wheels and tires, and frame and coupling devices." },
    { code: "DIMMR.11", text: "Explain and apply proficiently the diagnosis, service and repair of electrical and electronic systems, including battery system, starting system, charging system, lighting system, instrument cluster and driver information systems." },
    { code: "DIMMR.12", text: "Explain and apply proficiently the diagnosis, service and repair of HVAC systems, including the components, HVAC cooling systems, operating system and related controls." },
    { code: "DIMMR.13", text: "Explain and apply proficiently the diagnosis, service and repair of the CAB, including instruments and controls, safety equipment, and hardware." },
    { code: "DIMMR.14", text: "Explain and apply proficiently the diagnosis, service and repair of hydraulic systems." }
  ];

  const catalog = {
    autoCoop: { id: "470501", title: "Co-op I (Auto)", page: 6 },
    autoInternship: { id: "470504", title: "Automotive Internship I", page: 7 },
    autoA: { id: "470507", title: "Automotive Maintenance and Light Repair Section A", page: 8 },
    autoB: { id: "470509", title: "Automotive Maintenance and Light Repair Section B", page: 10 },
    autoC: { id: "470511", title: "Automotive Maintenance and Light Repair Section C", page: 11 },
    autoD: { id: "470513", title: "Automotive Maintenance and Light Repair Section D", page: 12 },
    dieselCoop: { id: "470442", title: "Co-op I (Diesel)", page: 63 },
    dieselInternship: { id: "470445", title: "Internship I (Diesel)", page: 64 },
    dieselA: { id: "470450", title: "Diesel Medium/Heavy Duty Truck IMMR Section A", page: 65, standards: dieselImmrStandards },
    dieselB: { id: "470451", title: "Diesel Medium/Heavy Duty Truck IMMR Section B", page: 67, standards: dieselImmrStandards },
    dieselC: { id: "470452", title: "Diesel Medium/Heavy Duty Truck IMMR Section C", page: 68, standards: dieselImmrStandards },
    dieselD: { id: "470453", title: "Diesel Medium/Heavy Duty Truck IMMR Section D", page: 69, standards: dieselImmrStandards }
  };

  function course(record) {
    return {
      id: record.id,
      title: record.title,
      sourceUrl,
      sourcePage: record.page,
      sourceStatus: "official-kde-course-standards",
      standards: Array.isArray(record.standards) ? record.standards.map(item => ({ ...item })) : [],
      industryStandardsUrl: aseTruckTaskListUrl,
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
