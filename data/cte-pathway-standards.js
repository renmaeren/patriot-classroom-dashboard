/*
==========================================
PATRIOT COMMAND
Kentucky CTE Pathway Standards
Version 5 — ACSHS/ACCTC 2026–27 verified pathway map
==========================================

PURPOSE

Stores Allen County's current CTE program/pathway structure separately from the shared Academic and Employability standards.

DISPLAY NAMES follow the current SchooLinks course catalog supplied for ACSHS/ACCTC.
CIP codes are retained as stable pathway identifiers.

For pathways with a direct match on KDE's current Pathway Standards Documents page,
the standards array contains concise, source-verified occupational STRAND summaries
for use in the Patriot Command picker. The linked KDE document remains the
authoritative source for the complete standard language.

Pathways without a direct KDE Pathway Standards document are intentionally left
unpopulated rather than being force-matched to a different pathway.
==========================================
*/

const ctePathwayStandards = [
  {
    id: "agriculture",
    title: "Agriculture",
    groups: [
      {
        id: "agribusiness",
        title: "Agribusiness Systems",
        cip: "01.0101.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AgBus-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Agribusiness management, policy, budgeting and resource planning" },
          { code: "OB", text: "Agribusiness recordkeeping, accounting, credit and inventory management" },
          { code: "OC", text: "Business planning, ownership, risk management and agricultural economics" },
          { code: "OD", text: "Agribusiness sales, marketing, market research and international markets" }
        ]
      },
      {
        id: "ag-power",
        title: "Agricultural Power, Structural, Technical Systems",
        cip: "01.0201.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AgPower-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Agricultural energy sources and efficiency" },
          { code: "OB", text: "Safe selection and use of tools and equipment" },
          { code: "OC", text: "Agricultural electrical principles, circuits, measurement and troubleshooting" },
          { code: "OD", text: "Operation, maintenance and repair of agricultural engines" },
          { code: "OE", text: "Hydraulic and pneumatic systems" },
          { code: "OF", text: "Safe operation of agricultural power units and equipment" }
        ]
      },
      {
        id: "animal-science",
        title: "Animal Science",
        cip: "01.0901.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AnimalSci-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Animal-science industry trends, production systems, markets, regulation and technology" },
          { code: "OB", text: "Animal behavior, husbandry, welfare and best-practice protocols" },
          { code: "OC", text: "Animal anatomy, physiology, health and disease" },
          { code: "OD", text: "Animal nutrition and feeding" },
          { code: "OE", text: "Animal genetics, reproduction and breeding" },
          { code: "OF", text: "Animal facilities, handling, equipment and production management" }
        ]
      },
      {
        id: "plant-science",
        title: "Plant Science Systems",
        cip: "01.1101.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/PlantScience-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Growing media, environmental factors, soil fertility and plant nutrition" },
          { code: "OB", text: "Plant classification, anatomy, physiology and Kentucky crop identification" },
          { code: "OC", text: "Plant propagation, growth and production practices" },
          { code: "OD", text: "Plant pests, diseases and integrated management" },
          { code: "OE", text: "Plant-production business, marketing and sustainability" }
        ]
      }
    ]
  },
  {
    id: "business-marketing",
    title: "Business & Marketing",
    groups: [
      {
        id: "administrative-support",
        title: "Administrative Support",
        cip: "52.0301.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AdminSupp-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Business law and business ownership" },
          { code: "OB", text: "Business communication" },
          { code: "OC", text: "Customer relations" },
          { code: "OD", text: "Economics and business decision-making" },
          { code: "OE", text: "Emotional intelligence, teamwork and leadership" },
          { code: "OF", text: "Financial analysis and accounting" },
          { code: "OG", text: "Information management, business records and technology" },
          { code: "OI", text: "Marketing foundations" },
          { code: "OJ", text: "Business operations, safety, security and office systems" },
          { code: "OK", text: "Professional development and career advancement" },
          { code: "OL", text: "Risk management" },
          { code: "OQ", text: "Selling foundations" },
          { code: "OS", text: "Human-resources management" },
          { code: "OV", text: "Strategic management" }
        ]
      },
      {
        id: "e-commerce",
        title: "E-Commerce",
        cip: "52.0208.02",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Market-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Business law and ownership" },
          { code: "OB", text: "Marketing and business communication" },
          { code: "OC", text: "Customer relationships and brand experience" },
          { code: "OD", text: "Economics and market conditions" },
          { code: "OE", text: "Emotional intelligence, teamwork and leadership" },
          { code: "OF", text: "Financial analysis and accounting foundations" },
          { code: "OG", text: "Information and data management" },
          { code: "OH", text: "Marketing planning and strategy" },
          { code: "OI", text: "Market research and information management" },
          { code: "OJ", text: "Product and service management" },
          { code: "OK", text: "Pricing" },
          { code: "OL", text: "Promotion and digital marketing" },
          { code: "OM", text: "Channel management and distribution" },
          { code: "ON", text: "Selling and customer engagement" }
        ]
      },
      {
        id: "management-entrepreneurship",
        title: "Management & Entrepreneurship",
        cip: "52.0701.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/BusMngt-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Business law and ownership" },
          { code: "OB", text: "Business communication" },
          { code: "OC", text: "Customer relations" },
          { code: "OD", text: "Economics and global trade" },
          { code: "OE", text: "Emotional intelligence, teamwork and leadership" },
          { code: "OF", text: "Financial analysis and accounting" },
          { code: "OG", text: "Information management and business technology" },
          { code: "OH", text: "Management and organizational leadership" },
          { code: "OI", text: "Marketing and market analysis" },
          { code: "OJ", text: "Operations and project management" },
          { code: "OK", text: "Professional development" },
          { code: "OL", text: "Risk management" },
          { code: "OM", text: "Entrepreneurship and business planning" },
          { code: "ON", text: "Human-resources and strategic management" }
        ]
      },
      {
        id: "marketing",
        title: "Marketing",
        cip: "52.1401.01",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Market-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Business law and ownership" },
          { code: "OB", text: "Marketing and business communication" },
          { code: "OC", text: "Customer relationships and brand experience" },
          { code: "OD", text: "Economics and market conditions" },
          { code: "OE", text: "Emotional intelligence, teamwork and leadership" },
          { code: "OF", text: "Financial analysis and accounting foundations" },
          { code: "OG", text: "Information and data management" },
          { code: "OH", text: "Marketing planning and strategy" },
          { code: "OI", text: "Market research and information management" },
          { code: "OJ", text: "Product and service management" },
          { code: "OK", text: "Pricing" },
          { code: "OL", text: "Promotion and digital marketing" },
          { code: "OM", text: "Channel management and distribution" },
          { code: "ON", text: "Selling and customer engagement" }
        ]
      }
    ]
  },
  {
    id: "computer-science",
    title: "Computer Science",
    groups: [
      {
        id: "computer-programming",
        title: "Computer Programming",
        cip: "11.0201.01",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/CompProg-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Impacts of computing, accessibility, ethics, privacy and society" },
          { code: "OB", text: "Software-project planning and project management" },
          { code: "OC", text: "Computing systems and abstraction" },
          { code: "OD", text: "Data collection, privacy, modeling and analysis" },
          { code: "OE", text: "Algorithms, programming, data structures and software development" }
        ]
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity",
        cip: "14.0902.00",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      },
      {
        id: "data-science",
        title: "Data Science",
        cip: "11.0802.00",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      },
      {
        id: "network-administration",
        title: "Network Administration",
        cip: "11.0901.01",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/NetworkAdmin-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Impacts of computing, accessibility, ethics and privacy" },
          { code: "OB", text: "Technology-project planning and management" },
          { code: "OC", text: "Computing systems, operating systems and troubleshooting" },
          { code: "OD", text: "Data structures, storage, databases, privacy and analysis" },
          { code: "OE", text: "Algorithms and programming concepts" },
          { code: "OF", text: "Networks, internet architecture, reliability and security" }
        ]
      },
      {
        id: "web-development",
        title: "Web Development/Administration",
        cip: "11.0801.01",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/WebDevAdmin-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Impacts of computing, accessibility, ethics and privacy" },
          { code: "OB", text: "Web-project planning and management" },
          { code: "OC", text: "Computing systems and troubleshooting" },
          { code: "OD", text: "Data, databases, privacy and analysis" },
          { code: "OE", text: "Algorithms, programming and iterative software development" },
          { code: "OF", text: "Internet and cybersecurity foundations" },
          { code: "OG", text: "Web-design workflow, design principles and production tools" }
        ]
      }
    ]
  },
  {
    id: "construction-technology",
    title: "Construction Technology",
    groups: [
      {
        id: "residential-maintenance-carpenter",
        title: "Residential Maintenance Carpenter Assistant",
        cip: "46.0401.01",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      }
    ]
  },
  {
    id: "education-training",
    title: "Education & Training",
    groups: [
      {
        id: "teaching-learning",
        title: "Teaching and Learning",
        cip: "13.0101.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/FundamentalTeaching-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Education careers, professional expectations and the role of education in society" },
          { code: "OB", text: "Ethics, advocacy, communication, leadership and professionalism" },
          { code: "OC", text: "History, policy and current trends in education" },
          { code: "OD", text: "Learning theory, development, learner differences and behavior" },
          { code: "OE", text: "Safe, respectful and effective learning environments" },
          { code: "OF", text: "Curriculum, instructional planning, standards and assessment" },
          { code: "OG", text: "Teaching strategies, assessment, feedback and instructional technology" }
        ]
      }
    ]
  },
  {
    id: "engineering",
    title: "Engineering",
    groups: [
      {
        id: "engineering-design",
        title: "Engineering Design",
        cip: "15.1302.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/EngiDesign-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Engineering laboratory safety and procedures" },
          { code: "OB", text: "Hand-tool identification, use and maintenance" },
          { code: "OC", text: "Power tools, equipment and machining processes" },
          { code: "OD", text: "History and societal development of STEM" },
          { code: "OE", text: "STEM careers, education and workforce needs" },
          { code: "OF", text: "Engineering ethics and professional standards" },
          { code: "OG", text: "Engineering design process, constraints, modeling and teamwork" },
          { code: "OH", text: "Digital portfolios and documentation of the design process" }
        ]
      }
    ]
  },
  {
    id: "family-consumer-science",
    title: "Family & Consumer Science",
    groups: [
      {
        id: "consumer-family-services",
        title: "Consumer & Family Services",
        cip: "19.0403.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/ConFamSvcs-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Management of individual and family resources" },
          { code: "OB", text: "Environmental issues affecting families and consumer resources" },
          { code: "OC", text: "Consumer rights, responsibilities and protection" },
          { code: "OD", text: "Technology and media effects on family and consumer decisions" },
          { code: "OE", text: "Economic systems and consumer actions" },
          { code: "OF", text: "Family financial management across the lifespan" },
          { code: "OG", text: "Consumer advocacy and fraud prevention" },
          { code: "OH", text: "Long-term financial planning, credit, insurance and investing" },
          { code: "OI", text: "Resource conservation, energy use and waste management" },
          { code: "OJ", text: "Consumer product development, testing, research and presentation" }
        ]
      },
      {
        id: "culinary-food-services",
        title: "Culinary & Food Services",
        cip: "12.0500.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Culinary-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Careers in food production, food service and nutrition" },
          { code: "OB", text: "Food safety, sanitation, HACCP and safe storage" },
          { code: "OC", text: "Selection, safe use, cleaning and maintenance of food-service equipment" },
          { code: "OD", text: "Menu planning, restaurant concepts and production requirements" },
          { code: "OE", text: "Commercial food preparation, measurement, cooking methods and presentation" },
          { code: "OF", text: "Food-service planning, operations and management" }
        ]
      },
      {
        id: "hospitality-tourism",
        title: "Hospitality, Travel, Tourism & Recreation",
        cip: "12.0500.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/HosTravTourRec-PathStnd.pdf",
        displayLevel: "occupational-strand-summary",
        standards: [
          { code: "OA", text: "Hospitality, travel, tourism and recreation careers" },
          { code: "OB", text: "Human-resources and facilities management" },
          { code: "OC", text: "Safety, security, emergency procedures and environmental issues" },
          { code: "OD", text: "Customer service and guest expectations" },
          { code: "OE", text: "Hospitality operations, travel practices and workplace skills" },
          { code: "OF", text: "Program and event planning and management" },
          { code: "OG", text: "Economic principles in hospitality and tourism" },
          { code: "OH", text: "Business management and entrepreneurship" },
          { code: "OI", text: "Market research and information management" },
          { code: "OJ", text: "Marketing concepts and target markets" },
          { code: "OK", text: "Advertising, branding and promotion" },
          { code: "OL", text: "Selling and customer relationships" },
          { code: "OM", text: "Destination marketing organizations and visitor bureaus" }
        ]
      }
    ]
  },
  {
    id: "health-science",
    title: "Health Science",
    groups: [
      {
        id: "allied-health",
        title: "Allied Health",
        cip: "51.0000.01",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      },
      {
        id: "biomedical-sciences",
        title: "Biomedical Sciences",
        cip: "26.0102.00",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      },
      {
        id: "pre-nursing",
        title: "Pre-Nursing",
        cip: "51.2699.01",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      }
    ]
  },
  {
    id: "industrial-maintenance-technology",
    title: "Industrial Maintenance Technology",
    groups: [
      {
        id: "industrial-maintenance-mechanic",
        title: "Industrial Maintenance Mechanic",
        cip: "47.0303.01",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      },
      {
        id: "welding-maintenance-technician",
        title: "Welding Maintenance Technician",
        cip: "47.0303.06",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      }
    ]
  },
  {
    id: "jrotc",
    title: "JROTC",
    groups: [
      {
        id: "jrotc",
        title: "JROTC",
        cip: "28.0301.00",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      }
    ]
  },
  {
    id: "media-arts",
    title: "Media Arts",
    groups: [
      {
        id: "cinematography-video",
        title: "Cinematography & Video Production",
        cip: "09.0701.00",
        sourceStatus: "verified-direct-kde-match",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Cin-VidProd-PathStnd.pdf",
        displayLevel: "not-populated-pending-source-fetch",
        standards: []
      }
    ]
  },
  {
    id: "transportation",
    title: "Transportation",
    groups: [
      {
        id: "automotive-maintenance-light-repair",
        title: "Automotive Maintenance & Light Repair",
        cip: "47.0604.01",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      },
      {
        id: "diesel-immr",
        title: "Diesel IMMR",
        cip: "47.0605.07",
        sourceStatus: "no-direct-kde-pathway-standards-document",
        displayLevel: "not-populated",
        standards: []
      }
    ]
  }
];