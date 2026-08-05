/*
==========================================
PATRIOT COMMAND
Kentucky CTE Pathway Standards
Version 2
==========================================

PURPOSE

Stores program-specific Kentucky CTE
standards separately from the shared
Academic and Employability standards.

Only official pathway standards should be
added to this file. Do not paraphrase or
invent standards.

INITIAL PILOT PATHWAYS

- Agriculture
- Automotive and Diesel
- Business and Marketing
- Computer Science and Web Development
- Construction
- Education and Training
- Engineering
- Health Science
- Industrial Maintenance and HVAC
- Media Arts
*/

const ctePathwayStandards = [
  {
    id: "agriculture",
    title: "Agriculture",
    groups: [
      { id: "agribusiness", title: "Agribusiness Systems", standards: [] },
      { id: "animal-science", title: "Animal Science Systems", standards: [] },
      { id: "plant-science", title: "Plant Science Systems", standards: [] },
      { id: "ag-power", title: "Agricultural Power, Structural & Technical Systems", standards: [] }
    ]
  },

  {
    id: "education",
    title: "Education & Training",
    groups: [
      { id: "fundamentals-teaching", title: "Fundamentals of Teaching", standards: [] },
      { id: "early-childhood", title: "Early Childhood Education", standards: [] }
    ]
  },

  {
    id: "health",
    title: "Health Science",
    groups: [
      { id: "allied-health", title: "Allied Health", standards: [] },
      { id: "nursing", title: "Nursing Services", standards: [] },
      { id: "phlebotomy", title: "Phlebotomy", standards: [] }
    ]
  },

  {
    id: "business",
    title: "Business & Marketing",
    groups: [
      { id: "marketing", title: "Marketing", standards: [] },
      { id: "accounting", title: "Accounting", standards: [] },
      { id: "administrative-support", title: "Administrative Support", standards: [] },
      { id: "management", title: "Management & Entrepreneurship", standards: [] }
    ]
  },

  {
    id: "engineering",
    title: "Engineering",
    groups: [
      { id: "engineering-design", title: "Engineering Design", standards: [] },
      { id: "mechanical", title: "Mechanical Engineering", standards: [] },
      { id: "civil", title: "Civil Engineering", standards: [] },
      { id: "electrical", title: "Electrical & Electronic Engineering", standards: [] },
      { id: "automation", title: "Automation Engineering", standards: [] }
    ]
  },

  {
    id: "construction",
    title: "Construction",
    groups: [
      { id: "building-construction", title: "Building & Construction", standards: [] }
    ]
  },

  {
    id: "industrial-maintenance",
    title: "Industrial Maintenance / HVAC",
    groups: [
      { id: "industrial-maintenance", title: "Industrial Maintenance", standards: [] },
      { id: "hvac", title: "HVAC", standards: [] }
    ]
  },

  {
    id: "automotive",
    title: "Automotive",
    groups: [
      { id: "automotive", title: "Automotive Technology", standards: [] },
      { id: "diesel", title: "Medium/Heavy Diesel", standards: [] }
    ]
  },

  {
    id: "media-arts",
    title: "Media Arts",
    groups: [
      { id: "interactive-media", title: "Interactive Media", standards: [] },
      { id: "cinematography", title: "Cinematography & Video Production", standards: [] },
      { id: "digital-design", title: "Digital Design & Game Development", standards: [] }
    ]
  },

  {
    id: "computer-science",
    title: "Computer Science",
    groups: [
      { id: "programming", title: "Computer Programming", standards: [] },
      { id: "web", title: "Web Development & Administration", standards: [] },
      { id: "cyber", title: "Cyber Engineering", standards: [] }
    ]
  }
];
