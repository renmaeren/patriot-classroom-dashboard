/*
PATRIOT COMMAND
Engineering + Family & Consumer Science pathway standards map

These entries use KDE occupational strand codes with concise summaries for picker usability.
They are not substitutes for the official KDE wording; sourceUrl remains authoritative.
*/
(function () {
  "use strict";

  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;

  function findGroup(categoryId, groupId) {
    const category = ctePathwayStandards.find(item => item.id === categoryId);
    if (!category || !Array.isArray(category.groups)) return null;
    return category.groups.find(item => item.id === groupId) || null;
  }

  function apply(categoryId, groupId, sourceUrl, standards) {
    const group = findGroup(categoryId, groupId);
    if (!group) return;
    group.sourceStatus = "verified-kde-source-with-coded-summary";
    group.sourceUrl = sourceUrl;
    group.standards = standards;
  }

  apply(
    "engineering",
    "engineering-design",
    "https://www.education.ky.gov/CTE/endofprog/Documents/EngiDesign-PathStnd.pdf",
    [
      { code: "OA", text: "General laboratory safety and procedures" },
      { code: "OB", text: "Hand-tool identification, use, care and safety" },
      { code: "OC", text: "Power tools, equipment and machining processes" },
      { code: "OD", text: "History and development of STEM" },
      { code: "OE", text: "STEM careers, training and workforce connections" },
      { code: "OF", text: "Engineering ethics and professional standards" },
      { code: "OG", text: "Engineering design process and iterative problem solving" },
      { code: "OH", text: "Digital portfolio documentation of the design process" },
      { code: "OI", text: "Freehand technical sketching" },
      { code: "OJ", text: "Measurement, precision and scaling" },
      { code: "OK", text: "Engineering documentation and communication" },
      { code: "OL", text: "Computer-aided design systems" },
      { code: "OM", text: "Physical, conceptual and mathematical modeling" },
      { code: "ON", text: "Rapid prototyping technologies and applications" },
      { code: "OO", text: "Architecture and building construction" },
      { code: "OP", text: "Civil engineering foundations" },
      { code: "OQ", text: "Structures, loads and structural efficiency" },
      { code: "OR", text: "Geotechnical concepts and soil analysis" },
      { code: "OS", text: "Surveying tools, mapping and emerging technology" },
      { code: "OT", text: "Concrete properties, testing and applications" },
      { code: "OU", text: "Building and city information modeling" },
      { code: "OV", text: "Urban planning, zoning and plan sets" },
      { code: "OW", text: "Statics, equilibrium, forces and trusses" },
      { code: "OX", text: "Material properties, stress and strain" }
    ]
  );

  apply(
    "family-consumer-science",
    "consumer-family-services",
    "https://www.education.ky.gov/CTE/endofprog/Documents/ConFamSvcs-PathStnd.pdf",
    [
      { code: "OA", text: "Managing individual and family resources" },
      { code: "OB", text: "Environmental influences on family and consumer resources" },
      { code: "OC", text: "Consumer rights, responsibilities and policy" },
      { code: "OD", text: "Technology and family/consumer decision-making" },
      { code: "OE", text: "Economic systems and consumer actions" },
      { code: "OF", text: "Financial resource management across the lifespan" },
      { code: "OG", text: "Consumer advocacy and fraud prevention" },
      { code: "OH", text: "Long-term financial planning, credit, risk and wealth" },
      { code: "OI", text: "Resource conservation, consumption and waste management" }
    ]
  );

  apply(
    "family-consumer-science",
    "culinary-food-services",
    "https://www.education.ky.gov/CTE/endofprog/Documents/Culinary-PathStnd.pdf",
    [
      { code: "OA", text: "Careers in food production, food service and nutrition" },
      { code: "OB", text: "Food safety, sanitation and illness prevention" },
      { code: "OC", text: "Food-preparation equipment selection, use and maintenance" },
      { code: "OD", text: "Menu planning and restaurant concepts" },
      { code: "OE", text: "Commercial food preparation methods and products" },
      { code: "OF", text: "Food-service planning, operations and management" }
    ]
  );

  apply(
    "family-consumer-science",
    "hospitality-tourism",
    "https://www.education.ky.gov/CTE/endofprog/Documents/HosTravTourRec-PathStnd.pdf",
    [
      { code: "OA", text: "Hospitality, travel, tourism and recreation careers" },
      { code: "OB", text: "Human resources and facilities management" },
      { code: "OC", text: "Safety, security and environmental practices" },
      { code: "OD", text: "Customer service and guest expectations" },
      { code: "OE", text: "Hospitality, travel, tourism and recreation operations" },
      { code: "OF", text: "Program and event planning and management" }
    ]
  );
})();