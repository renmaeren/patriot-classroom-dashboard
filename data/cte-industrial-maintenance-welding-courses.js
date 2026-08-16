/*
==========================================
PATRIOT COMMAND
Industrial Maintenance & Welding Course Standards Sources
ACSHS/ACCTC 2026–27
==========================================
*/
(function () {
  "use strict";
  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;
  const category = ctePathwayStandards.find(item => item.id === "industrial-maintenance-technology");
  if (!category || !Array.isArray(category.groups)) return;
  const sourceUrl = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_AdvancedManufacturing_Courses.pdf";

  const smawBackingStandards = [
    "Practice and perform safe shop procedures at all times.",
    "Apply the technical math required for employment opportunities in welding.",
    "Perform all duties with emphasis on integrity, responsibility, quality, discipline and teamwork.",
    "Weld SMAW groove welds in all positions."
  ].map((text, i) => ({ code: `SMAWGB.${i + 1}`, text }));

  const catalog = {
    printing3d: { id: "332001", title: "Introduction to 3D Printing Technology", page: 43 },
    shopManagement: { id: "470301", title: "Shop Management", page: 45 },
    coop: { id: "470305", title: "Co-op I (Ind Maint)", page: 46 },
    internship: { id: "470308", title: "Internship: Ind Maint", page: 47 },
    machineToolsA: { id: "470313", title: "Fundamentals of Machine Tools – A (For Maintenance)", page: 48 },
    machineToolsB: { id: "470314", title: "Fundamentals of Machine Tools – B (For Maintenance)", page: 49 },
    advancedHydraulics: { id: "470316", title: "Advanced Hydraulic Systems", page: 50 },
    maintainingEquipment: { id: "470318", title: "Maintaining Industrial Equipment", page: 51 },
    fluidPower: { id: "470321", title: "Fluid Power", page: 52 },
    electricalPrinciples: { id: "470322", title: "Industrial Maintenance Electrical Principles", page: 53 },
    advancedPneumatics: { id: "470326", title: "Advanced Pneumatic Systems", page: 54 },
    weldingMaintenance: { id: "470328", title: "Welding for Maintenance", page: 55 },
    plc: { id: "470330", title: "Industrial Maintenance of PLCs", page: 56 },
    specialTopics: { id: "470336", title: "Special Topics - Industrial Maintenance Technology", page: 57 },
    motorControls: { id: "470348", title: "Industrial Maintenance Electrical Motor Controls", page: 58 },
    refrigeration: { id: "470349", title: "Refrigeration Fundamentals (For Maintenance)", page: 59 },
    robotics: { id: "470351", title: "Robotics and Automation (For Maintenance)", page: 61 },
    smawMaintenance: { id: "470354", title: "Shielded Metal Arc Welding and Lab (For Maintenance)", page: 62 },
    electricalComponents: { id: "470358", title: "Electrical Components (Ind. Maint.)", page: 63 },
    appliedMachining: { id: "470360", title: "Applied Machining I (for Industrial Maint.)", page: 65 },
    cooling: { id: "470361", title: "Cooling and Dehumidification (for Industrial Maint.)", page: 66 },
    heating: { id: "470363", title: "Heating and Humidification (for Industrial Maint.)", page: 68 },
    hvacElectricity: { id: "470365", title: "HVAC Electricity (Ind Maint)", page: 71 },
    gmawMaintenance: { id: "470367", title: "Gas Metal Arc Welding and Lab", page: 72 },
    basicBlueprint: { id: "499920", title: "Basic Blueprint Reading", page: 75 },
    troubleshooting: { id: "499925", title: "Basic Troubleshooting", page: 76 },
    cutting: { id: "480501", title: "Cutting Processes and Lab", page: 93 },
    weldingBlueprint: { id: "480505", title: "Blueprint Reading for Welding", page: 94 },
    weldingCertification: { id: "480507", title: "Welding Certification", page: 95 },
    smaw: { id: "480521", title: "Shielded Metal Arc Welding (SMAW) and Lab", page: 96 },
    gmaw: { id: "480522", title: "Gas Metal Arc Welding and Lab", page: 97 },
    oxyFuel: { id: "480523", title: "Oxy-Fuel Systems and Lab", page: 98 },
    basicWelding: { id: "480524", title: "Basic Welding and Lab", page: 99 },
    gtaw: { id: "480525", title: "Gas Tungsten Arc Welding and Lab", page: 100 },
    smawBacking: { id: "480528", title: "SMAW Groove Welds with Backing Lab", page: 101, standards: smawBackingStandards },
    gtawGroove: { id: "480530", title: "GTAW Groove Lab", page: 102 },
    gmawGroove: { id: "480533", title: "GMAW Groove Lab", page: 103 },
    gmawAluminum: { id: "480534", title: "GMAW Aluminum Lab", page: 104 },
    smawOpenGroove: { id: "480535", title: "SMAW Open Groove Lab", page: 105 },
    smawPipeA: { id: "480536", title: "Shielded Metal Arc Welding Pipe Lab A", page: 106 },
    smawPipeB: { id: "480537", title: "Shielded Metal Arc Welding Pipe Lab B", page: 107 }
  };

  function course(record) { return { id: record.id, title: record.title, sourceUrl, sourcePage: record.page, sourceStatus: "official-kde-course-standards", standards: Array.isArray(record.standards) ? record.standards.map(item => ({ ...item })) : [] }; }
  function apply(groupId, records) { const group = category.groups.find(item => item.id === groupId); if (!group) return; group.courseStandardsMode = true; group.courseSourceUrl = sourceUrl; group.courses = records.map(course); }

  apply("industrial-maintenance-mechanic", [catalog.printing3d,catalog.shopManagement,catalog.coop,catalog.internship,catalog.machineToolsA,catalog.machineToolsB,catalog.advancedHydraulics,catalog.maintainingEquipment,catalog.fluidPower,catalog.electricalPrinciples,catalog.advancedPneumatics,catalog.weldingMaintenance,catalog.plc,catalog.specialTopics,catalog.motorControls,catalog.refrigeration,catalog.robotics,catalog.electricalComponents,catalog.appliedMachining,catalog.cooling,catalog.heating,catalog.hvacElectricity,catalog.basicBlueprint,catalog.troubleshooting]);
  apply("welding-maintenance-technician", [catalog.weldingMaintenance,catalog.smawMaintenance,catalog.gmawMaintenance,catalog.basicBlueprint,catalog.troubleshooting,catalog.cutting,catalog.weldingBlueprint,catalog.weldingCertification,catalog.smaw,catalog.gmaw,catalog.oxyFuel,catalog.basicWelding,catalog.gtaw,catalog.smawBacking,catalog.gtawGroove,catalog.gmawGroove,catalog.gmawAluminum,catalog.smawOpenGroove,catalog.smawPipeA,catalog.smawPipeB]);
})();
