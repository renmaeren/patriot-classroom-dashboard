/*
==========================================
PATRIOT COMMAND
Transportation Course Standards Sources
ACSHS/ACCTC 2026–27
==========================================
*/
(function () {
  "use strict";
  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;
  const category = ctePathwayStandards.find(item => item.id === "transportation");
  if (!category || !Array.isArray(category.groups)) return;

  const sourceUrl = "https://www.education.ky.gov/CTE/ctepa/Documents/26-27_Transportation_Courses.pdf";
  const aseTruckTaskListUrl = "https://www.aseeducationfoundation.org/wp-content/uploads/Truck_Test_Specs.pdf";
  const numbered = (prefix, texts) => texts.map((text, i) => ({ code: `${prefix}.${i + 1}`, text }));

  const autoMlrStandards = numbered("AMLR", [
    "Explain and apply required shop and personal safety tasks for the automotive industry.",
    "Explain and apply proper use and handling of automotive tools and equipment.",
    "Prepare a vehicle proficiently for routine pre- and post-maintenance and customer service.",
    "Diagnose, service, maintain, and repair engines, cylinder heads, valve trains, engine blocks, lubrication systems, and cooling systems.",
    "Diagnose, service, and repair electrical and electronic system components, including batteries, starting, charging, lighting, instrument clusters, driver information, and body electrical systems.",
    "Diagnose, service, and repair front and rear steering and suspension systems, wheel alignment, wheels, and tires.",
    "Diagnose, service, and repair drum and disc brakes, hydraulic and power-assist systems, electronic brakes, ABS, traction and stability control, wheel bearings, parking brakes, and related systems.",
    "Diagnose, service, maintain, and repair HVAC systems, including heating, air conditioning, refrigeration, ventilation, engine cooling, refrigerant recovery, recycling, handling, and controls.",
    "Diagnose, service, and repair computerized engine controls, fuel systems, air induction, exhaust systems, and emission controls.",
    "Diagnose, service, maintain, and repair in-vehicle and off-vehicle automatic transmissions and transaxles.",
    "Diagnose, service, maintain, and repair manual drivetrain systems, clutches, transmissions/transaxles, drive and half-shafts, universal and CV joints, differential assemblies, drive axles, and two/four/all-wheel-drive systems.",
    "Diagnose, service, and repair heating and air-conditioning systems, including refrigeration, ventilation, engine cooling, controls, refrigerant recovery, recycling, and handling.",
    "Use a professional-level diagnostic scan tool to diagnose electronic systems and identify customer concerns efficiently.",
    "Explain Hybrid/EV operating characteristics and identify required safety protocols, including battery disconnect and service procedures."
  ]);

  const autoCoopStandards = numbered("ACOOP", [
    "Gain career awareness and the opportunity to test career choices.",
    "Receive work experience related to career interests prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation.",
    "Earn funds to help finance education expenses."
  ]);

  const autoInternshipStandards = numbered("AINT", [
    "Gain career awareness and the opportunity to test career choices.",
    "Receive work experience related to career interests prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation."
  ]);

  const dieselImmrStandards = numbered("DIMMR", [
    "Explain and apply required shop and personal safety tasks relating to the automotive industry.",
    "Explain and apply required tasks associated with the proper use and handling of tools and equipment relating to the automotive industry.",
    "Demonstrate proficiency in preparing vehicles for routine pre/post-maintenance and customer services.",
    "Demonstrate workplace employability skills related to personal standards and work habits/ethics.",
    "Identify the basic diesel components and functions.",
    "Identify principles, assemblies, and systems of engine operation.",
    "Explain and apply the diagnosis, service, maintenance, and repair of engines, cylinder heads, valve trains, engine blocks, lubrication and cooling systems, air induction and exhaust systems, fuel systems, and engine braking systems proficiently.",
    "Explain and apply proficiently the diagnosis, service, maintenance and repair of various drivetrain systems and components, including clutch, transmissions, driveshafts, universal joints, and drive axles.",
    "Explain and apply proficiently the diagnosis, service and repair of braking systems, including air brakes and related systems, hydraulic brakes and related systems, wheel bearings, parking brake systems, power assist systems, and Vehicle Dynamic Brake Systems (Air and Hydraulic): Antilock Brake System (ABS), Automatic Traction Control (ATC) System, and Electronic Stability Control (ESC) Systems.",
    "Explain and apply proficiently the diagnosis, service and repair of suspension and steering systems, including steering columns, steering pump and gear units, steering linkage, suspension systems, wheel alignments, wheels and tires, and frame and coupling devices.",
    "Explain and apply proficiently the diagnosis, service and repair of electrical and electronic systems, including battery system, starting system, charging system, lighting system, instrument cluster and driver information systems.",
    "Explain and apply proficiently the diagnosis, service and repair of HVAC systems, including the components, HVAC cooling systems, operating system and related controls.",
    "Explain and apply proficiently the diagnosis, service and repair of the CAB, including instruments and controls, safety equipment, and hardware.",
    "Explain and apply proficiently the diagnosis, service and repair of hydraulic systems."
  ]);

  const dieselCoopStandards = numbered("DCOOP", [
    "Gain career awareness and the opportunity to test career choices.",
    "Receive work experience related to career interests prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation.",
    "Earn funds to help finance education expenses."
  ]);

  const dieselInternshipStandards = numbered("DINT", [
    "Gain career awareness and the opportunity to test career choices.",
    "Receive work experience related to career interests prior to graduation.",
    "Integrate classroom studies with work experience.",
    "Receive exposure to facilities and equipment unavailable in a classroom setting.",
    "Increase employability potential after graduation."
  ]);

  const catalog = {
    autoCoop: { id: "470501", title: "Co-op I (Auto)", page: 6, standards: autoCoopStandards },
    autoInternship: { id: "470504", title: "Automotive Internship I", page: 7, standards: autoInternshipStandards },
    autoA: { id: "470507", title: "Automotive Maintenance and Light Repair Section A", page: 8, standards: autoMlrStandards },
    autoB: { id: "470509", title: "Automotive Maintenance and Light Repair Section B", page: 10, standards: autoMlrStandards },
    autoC: { id: "470511", title: "Automotive Maintenance and Light Repair Section C", page: 11, standards: autoMlrStandards },
    autoD: { id: "470513", title: "Automotive Maintenance and Light Repair Section D", page: 12, standards: autoMlrStandards },
    dieselCoop: { id: "470442", title: "Co-op I (Diesel)", page: 63, standards: dieselCoopStandards },
    dieselInternship: { id: "470445", title: "Internship I (Diesel)", page: 64, standards: dieselInternshipStandards },
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

  apply("automotive-maintenance-light-repair", [catalog.autoA,catalog.autoB,catalog.autoC,catalog.autoD,catalog.autoCoop,catalog.autoInternship]);
  apply("diesel-immr", [catalog.dieselA,catalog.dieselB,catalog.dieselC,catalog.dieselD,catalog.dieselCoop,catalog.dieselInternship]);
})();
