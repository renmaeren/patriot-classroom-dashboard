/*
==========================================
PATRIOT COMMAND
Kentucky CTE Pathway Standards
Version 7 — ACSHS/ACCTC 2026–27 verified pathway map
==========================================

PURPOSE

Stores Allen County's current CTE program/pathway structure separately from the shared Academic and Employability standards.

DISPLAY NAMES follow the current SchooLinks course catalog supplied for ACSHS/ACCTC.
CIP codes are retained as stable pathway identifiers.

RULE: Only exact, verified KDE occupational-standard wording belongs in a standards array.
Do not paraphrase or substitute a related pathway's standards.

Pathways still awaiting exact-source verification are intentionally left unpopulated.
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
        sourceStatus: "verified-exact-kde",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AgBus-PathStnd.pdf",
        standards: [
          { code: "OA1", text: "Evaluate how mission statements guide business goals, objectives and resource allocation" },
          { code: "OA2", text: "Formulate individual/business goals and objectives" },
          { code: "OA3", text: "Describe the impact of the US Farm Bill on the agriculture industry" },
          { code: "OA4", text: "Evaluate federal government and industry regulations, e.g., EPA, OSHA, USDA, NRCS, FSA, in planning/operating an AFNR business" },
          { code: "OA5", text: "Develop a budget, as applied to the AFNR business, including capital, human, financial and time, e.g., enterprise budget, time on investment, budget constraint" },
          { code: "OA6", text: "Describe how special interest groups, e.g., PETA, HSUS, Sierra Club, influence U.S. agricultural policy" },
          { code: "OA7", text: "Describe how proactive farm groups influence agricultural policy, e.g., KYFB, KY Pork Producers, KY Beef Council, KY Soybean Board, KY Corn Growers Association, Kentucky Poultry Federation, Kentucky Dairy Development Council" },
          { code: "OA8", text: "Analyze how communication technology, e.g., social media, print news, television, impacts public perception of the agriculture industry" },
          { code: "OA9", text: "Evaluate state government and industry regulations, e.g., KDA, KY Proud, livestock reports, in planning/operating an AFNR business" },
          { code: "OA10", text: "Identify related government agencies, their functions and programs, as they relate to agribusiness, e.g., Extension, KY Ag Finance, KY Ag Development" },
          { code: "OB1", text: "Maintain accurate production/agribusiness records, e.g., balance sheet, profit/loss sheet, enterprise budgets" },
          { code: "OB2", text: "Analyze records to improve efficiency and profitability of an AFNR business, e.g., liquidity and solvency, return on investment, repayment capacity" },
          { code: "OB3", text: "Compare types and terms of credit, e.g., line of credit, term loan, interest rate, credit establishment" },
          { code: "OB4", text: "Budget resources, as applied to the AFNR business, including capital, human, financial and time, e.g., enterprise budget, time on investment, budget constraint" },
          { code: "OB5", text: "Identify tax reporting requirements for income, property and employment associated with small AFNR businesses, e.g., Farm Business Management Program" },
          { code: "OB6", text: "Monitor inventory to maintain optimal levels and calculate costs of carrying input and output inventory" },
          { code: "OC1", text: "Differentiate types of ownership/business structures, e.g., corporations, cooperatives, partnerships, sole proprietorships, non-profit, in a capitalistic economic system" },
          { code: "OC2", text: "Analyze businesses to determine strengths, weaknesses, opportunities and threats, i.e., SWOT Analysis" },
          { code: "OC3", text: "Describe ways to assess and manage risks, e.g., financial, environmental, workplace, to reduce liability" },
          { code: "OC4", text: "Describe how enterprise diversification can address production risks" },
          { code: "OC5", text: "Analyze marketing techniques, e.g., contracts, futures, direct marketing, options that reduce risk" },
          { code: "OC6", text: "Explain how insurance strategies minimize risk, e.g., property, liability, production/income loss, personal life and health, workman's comp, auto liability" },
          { code: "OC7", text: "Describe the types and components of a risk management plan for an AFNR business, e.g., Water Quality Plan, HACCP" },
          { code: "OC8", text: "Identify the effect of foreign policy on agricultural economics, e.g., tariffs, trade agreements, embargos" },
          { code: "OC9", text: "Compare sources of credit, e.g., farm credit systems, grants, dealer credit" },
          { code: "OD1", text: "Interpret the laws of supply and demand" },
          { code: "OD2", text: "Compare and contrast macroeconomic and microeconomic concepts" },
          { code: "OD3", text: "Discuss factors that influence buyer motivation, e.g., service, price, brand loyalty, product quality, product features" },
          { code: "OD4", text: "Explain effective techniques that develop effective customer relationships" },
          { code: "OD5", text: "Explain components of the sales process, e.g., personal rapport, needs and wants, features and benefits, objections, close" },
          { code: "OD6", text: "Describe the meaning and use of the four P's, i.e., product, place, price and promotion, in marketing" },
          { code: "OD7", text: "Analyze appropriate market and marketing research, e.g., target market, niche market, buyer profiles" },
          { code: "OD8", text: "Compare the effectiveness of various marketing strategies for an AFNR business" },
          { code: "OD9", text: "Develop a marketing plan for an agricultural product, service, or agribusiness" },
          { code: "OD10", text: "Explain concepts associated with international markets, e.g., global food supply chain" },
          { code: "OD11", text: "Assess the presence of marketing infrastructure for agricultural commodities, e.g., storage, transportation, processing" }
        ]
      },
      {
        id: "ag-power",
        title: "Agricultural Power, Structural, Technical Systems",
        cip: "01.0201.00",
        sourceStatus: "verified-exact-kde",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AgPower-PathStnd.pdf",
        standards: [
          { code: "OA1", text: "Discuss the advantages and disadvantages of types of renewable and non-renewable energy, e.g., solar, wind, hydro, fossil fuels" },
          { code: "OA2", text: "Compare the efficiency of various energy sources, e.g., gas, diesel, natural gas, biofuels" },
          { code: "OB1", text: "Demonstrate safe practices specific to agriculture power, structural and technical systems, e.g., PPE, materials handling, shop/laboratory operation" },
          { code: "OB2", text: "Discuss the function of safety systems on tools and equipment, e.g., PTO guard, SawStop, nail gun with sequential trigger" },
          { code: "OB3", text: "Demonstrate proper use of measurement and layout tools" },
          { code: "OB4", text: "Select, maintain and use hand/power tools in service, construction and fabrication" },
          { code: "OC1", text: "Identify hazards and safety practices in planning and installing an electrical circuit" },
          { code: "OC2", text: "Identify materials and tools used in electrical installation, e.g., wiring, fixtures, breakers, fuses, conduit" },
          { code: "OC3", text: "Interpret basic electrical components, e.g., wiring, switches, receptacles, duplexes and diagrams" },
          { code: "OC4", text: "Differentiate between alternating and direct current" },
          { code: "OC5", text: "Describe types of electrical measurements, e.g., amperage, voltage, wattage, resistance" },
          { code: "OC6", text: "Calculate measurements of electricity, e.g., watts, amps, volts, Ohm's Law" },
          { code: "OC7", text: "Differentiate between the design and function of parallel and series electrical circuits" },
          { code: "OC8", text: "Test and service electrical systems using a multimeter" },
          { code: "OC9", text: "Diagnose malfunctioning electrical system components such as battery and lighting" },
          { code: "OC10", text: "Describe basic operation of electric motors, e.g., parts, electromagnetism" },
          { code: "OC11", text: "Select the proper electric motors, e.g., repulsion start, capacitor, split-phase, for various applications in AFNR" },
          { code: "OD1", text: "Differentiate between the operation of gasoline and diesel engines" },
          { code: "OD2", text: "Identify components and systems, e.g., cooling, compression, exhaust, fuel, lubrication, ignition, of internal combustion engines" },
          { code: "OD3", text: "Select lubricants based on viscosity, source and equipment compatibility" },
          { code: "OD4", text: "Discuss proper use and disposal of lubricants" },
          { code: "OD5", text: "Assess an internal combustion engine to determine service and repair of basic ignition, fuel and compression using technical manuals and diagnostics" },
          { code: "OE1", text: "Identify principles of hydraulic and pneumatic system operation, e.g., Pascal's Law, pressure, flow, valves" },
          { code: "OE2", text: "Interpret basic symbols and diagrams in hydraulic and pneumatic systems" },
          { code: "OE3", text: "Identify basic hydraulic and pneumatic system fittings and ports" },
          { code: "OF1", text: "Demonstrate safe practices in the operation of power units and equipment, e.g. tractors, lawnmowers, generators" },
          { code: "OF2", text: "Outline power unit and equipment controls, startup and shutdown procedures and pre-operation inspections using owners/service manuals" },
          { code: "OF3", text: "Establish a preventative maintenance schedule for power units and equipment, e.g., lubricants, fluids, filters" },
          { code: "OF4", text: "Describe the importance of adjusting equipment including belts, drives, chains, sprockets and maintenance of fluid conveyance components, e.g., hoses, lines, nozzles" },
          { code: "OG1", text: "Identify symbols and drawing techniques used to develop plans, sketches and basic blueprints" },
          { code: "OG2", text: "Identify the different types of construction drawings, e.g., design, electrical, elevation, floor plans" },
          { code: "OG3", text: "Create sketches and plans of agricultural structures using scales and legends" },
          { code: "OG4", text: "Prepare bills of materials, e.g., structures, fencing, repair, to accompany plans and sketches" },
          { code: "OH1", text: "Develop criteria for selecting materials based on cost, quantities and characteristics for a specific project plan" },
          { code: "OH2", text: "Apply basic principles of design, fabrication and installation of agricultural structures" },
          { code: "OH3", text: "Describe options available to make AFNR structures more energy efficient, e.g., solar panels, geothermal energy, natural lighting, rainwater harvesting" },
          { code: "OH4", text: "Discuss the steps, e.g., measuring, cutting, fastening, finishing, in constructing a project out of wood" },
          { code: "OH5", text: "Calculate materials for concrete, brick, stone or masonry units in agricultural construction" },
          { code: "OH6", text: "Describe the proper process to follow when pouring and finishing concrete" },
          { code: "OH7", text: "Distinguish plumbing materials and products, e.g., copper, iron, steel, PVC, PEX" },
          { code: "OH8", text: "Demonstrate basic plumbing skills, e.g., tool selection, measuring, installing, sweating/soldering, repair" },
          { code: "OH9", text: "Determine proper insulation material and use for a given task in AFNR structures" },
          { code: "OH10", text: "Calculate areas and volumes for coatings, e.g., paints, stains, varnishes" },
          { code: "OH11", text: "Determine proper paint/coating material and method for various tasks" },
          { code: "OI1", text: "Identify metal materials, e.g., steel, aluminum, stainless steel and their characteristics" },
          { code: "OI2", text: "Describe the steps in basic repair, e.g., welding, brazing, riveting, of a metal object" },
          { code: "OI3", text: "Distinguish welding processes, positions, materials preparation and equipment workpiece setup, e.g., beveling/grinding" },
          { code: "OI4", text: "Construct and/or repair metal structures and equipment using welding procedures, including those associated with SMAW, GMAW, GTAW, fuel-oxygen and plasma arc torch methods" },
          { code: "OJ1", text: "Discuss the use of computer-based systems in agriculture, food and natural resources, e.g., web-based service information, software diagnostics" },
          { code: "OJ2", text: "Describe how Geographic Information System (GIS), Remote Sensing (RS) and Global Positioning System (GPS) are utilized in the agriculture industry" },
          { code: "OJ3", text: "Describe equipment and processes, e.g., auto-guidance, variable-rate technology, yield maps, sensor technology used in precision agriculture" },
          { code: "OJ4", text: "Explain how triangulation is utilized in geospatial technology" },
          { code: "OJ5", text: "Describe robotic and drone applications utilized in agriculture" }
        ]
      },
      { id: "animal-science", title: "Animal Science", cip: "01.0901.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AnimalSci-PathStnd.pdf", standards: [] },
      { id: "plant-science", title: "Plant Science Systems", cip: "01.1101.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/PlantScience-PathStnd.pdf", standards: [] }
    ]
  },
  {
    id: "business-marketing",
    title: "Business & Marketing",
    groups: [
      { id: "administrative-support", title: "Administrative Support", cip: "52.0301.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/AdminSupp-PathStnd.pdf", standards: [] },
      { id: "e-commerce", title: "E-Commerce", cip: "52.0208.02", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Market-PathStnd.pdf", standards: [] },
      { id: "management-entrepreneurship", title: "Management & Entrepreneurship", cip: "52.0701.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/BusMngt-PathStnd.pdf", standards: [] },
      { id: "marketing", title: "Marketing", cip: "52.1401.01", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Market-PathStnd.pdf", standards: [] }
    ]
  },
  {
    id: "computer-science",
    title: "Computer Science",
    groups: [
      { id: "computer-programming", title: "Computer Programming", cip: "11.0201.01", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/CompProg-PathStnd.pdf", standards: [] },
      { id: "cybersecurity", title: "Cybersecurity", cip: "14.0902.00", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] },
      { id: "data-science", title: "Data Science", cip: "11.0802.00", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] },
      { id: "network-administration", title: "Network Administration", cip: "11.0901.01", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/NetworkAdmin-PathStnd.pdf", standards: [] },
      { id: "web-development", title: "Web Development/Administration", cip: "11.0801.01", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/WebDevAdmin-PathStnd.pdf", standards: [] }
    ]
  },
  {
    id: "construction-technology",
    title: "Construction Technology",
    groups: [
      { id: "residential-maintenance-carpenter", title: "Residential Maintenance Carpenter Assistant", cip: "46.0401.01", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] }
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
        sourceStatus: "verified-exact-kde",
        sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/FundamentalTeaching-PathStnd.pdf",
        standards: [
          { code: "OA1", text: "Examine roles, functions, and education and training requirements of individuals engaged in education careers." },
          { code: "OA2", text: "Explain personal characteristics, abilities, knowledge and skills needed to work in education careers." },
          { code: "OA3", text: "Understand ethical and legal standards and principles that impact education careers." },
          { code: "OA4", text: "Recognize the symptoms of child abuse and neglect and the appropriate reporting protocol." },
          { code: "OA5", text: "Examine the historical and contemporary significance of education in society." },
          { code: "OA6", text: "Explore opportunities for employment and emerging careers." },
          { code: "OA7", text: "Examine the impact of the education profession on local, state, national and global economies." },
          { code: "OA8", text: "Explore employee responsibilities and employer expectations." },
          { code: "OA9", text: "Utilize activities of the Family, Career and Community Leaders of America student organization." },
          { code: "OB1", text: "Demonstrate ethical and legal standards and principles that impact education careers." },
          { code: "OB2", text: "Evaluate ethical standards established by employers or affiliated associations." },
          { code: "OB3", text: "Analyze ethical dilemmas and determine courses of action." },
          { code: "OB4", text: "Explore various methods of advocacy." },
          { code: "OB5", text: "Explore factors that impact education funding." },
          { code: "OB6", text: "Demonstrate communication skills that contribute to positive relationships with students, families, colleagues and stakeholders." },
          { code: "OB7", text: "Use problem solving techniques to mediate conflicts that occur in the workplace." },
          { code: "OB8", text: "Identify the qualities of teacher professionalism and leadership." },
          { code: "OB9", text: "Assess individual personality traits and use them to create a Professional Growth Plan." },
          { code: "OC1", text: "Examine the history of education from the 17th century to the 21st century." },
          { code: "OC2", text: "Analyze the contributions of influential historical figures in education." },
          { code: "OC3", text: "Identify current educational trends." },
          { code: "OC4", text: "Examine the evolution of educational policies." },
          { code: "OD1", text: "Apply learning theories and principles to learners." },
          { code: "OD2", text: "Analyze educational philosophies." },
          { code: "OD3", text: "Examine how effective teaching practices accommodate learning styles, learning differences, and special needs." },
          { code: "OD4", text: "Determine individualized needs of children." },
          { code: "OD5", text: "Explain how language, culture, and educational background affect learning and schools." },
          { code: "OD6", text: "Examine physical, emotional, social, and intellectual development of children and adolescents." },
          { code: "OD7", text: "Determine management strategies that promote positive student behavior while engaging students in learning." },
          { code: "OD8", text: "Explain how schedules, activities, routines, and transitions promote learning." },
          { code: "OE1", text: "Determine classroom management procedures that support learning." },
          { code: "OE2", text: "Analyze how materials, furnishings, and other resources create safe and effective instructional environments." },
          { code: "OE3", text: "Identify emergency, safety, health, and security procedures." },
          { code: "OE4", text: "Discuss the importance of a safe and respectful learning environment for all learners." },
          { code: "OE5", text: "Create the components of a management plan." },
          { code: "OE6", text: "Analyze educational approaches." },
          { code: "OE7", text: "Utilize field experiences and observations to assess the learning environment." },
          { code: "OF1", text: "Describe curriculum and instruction models." },
          { code: "OF2", text: "Establish instructional goals that are developmentally appropriate." },
          { code: "OF3", text: "Develop organizational and managerial skills that enhance professionalism." },
          { code: "OF4", text: "Utilize relevant standards in instructional planning and assessment." },
          { code: "OF5", text: "Apply principles and elements of effective instruction and assessment." },
          { code: "OF6", text: "Design effective lesson plans with developmentally appropriate activities with diversity in mind to include differentiation to meet all students' needs." },
          { code: "OF7", text: "Identify the characteristics and uses of specific types of instructional methods." },
          { code: "OG1", text: "Examine how a variety of teaching strategies impact student learning." },
          { code: "OG2", text: "Examine purposes of and apply techniques for assessing student learning." },
          { code: "OG3", text: "Summarize how assessment is integrated into teaching and learning." },
          { code: "OG4", text: "Understand how learner feedback guides instruction." },
          { code: "OG5", text: "Integrate technology as a tool for instruction, evaluation, and management." },
          { code: "OG6", text: "Demonstrate discussion and questioning techniques that promote critical thinking and problem solving." },
          { code: "OG7", text: "Create examples of assessments based on student learning objectives." },
          { code: "OG8", text: "Utilize scoring tools to evaluate student performance." }
        ]
      }
    ]
  },
  { id: "engineering", title: "Engineering", groups: [{ id: "engineering-design", title: "Engineering Design", cip: "15.1302.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/EngiDesign-PathStnd.pdf", standards: [] }] },
  { id: "family-consumer-science", title: "Family & Consumer Science", groups: [
    { id: "consumer-family-services", title: "Consumer & Family Services", cip: "19.0403.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/ConFamSvcs-PathStnd.pdf", standards: [] },
    { id: "culinary-food-services", title: "Culinary & Food Services", cip: "12.0500.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Culinary-PathStnd.pdf", standards: [] },
    { id: "hospitality-tourism", title: "Hospitality, Travel, Tourism & Recreation", cip: "12.0500.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/HosTravTourRec-PathStnd.pdf", standards: [] }
  ] },
  { id: "health-science", title: "Health Science", groups: [
    { id: "allied-health", title: "Allied Health", cip: "51.0000.01", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] },
    { id: "biomedical-sciences", title: "Biomedical Sciences", cip: "26.0102.00", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] },
    { id: "pre-nursing", title: "Pre-Nursing", cip: "51.2699.01", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] }
  ] },
  { id: "industrial-maintenance-technology", title: "Industrial Maintenance Technology", groups: [
    { id: "industrial-maintenance-mechanic", title: "Industrial Maintenance Mechanic", cip: "47.0303.01", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] },
    { id: "welding-maintenance-technician", title: "Welding Maintenance Technician", cip: "47.0303.06", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] }
  ] },
  { id: "jrotc", title: "JROTC", groups: [{ id: "jrotc", title: "JROTC", cip: "28.0301.00", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] }] },
  { id: "media-arts", title: "Media Arts", groups: [{ id: "cinematography-video", title: "Cinematography & Video Production", cip: "09.0701.00", sourceStatus: "verified-source-pending-exact-entry", sourceUrl: "https://www.education.ky.gov/CTE/endofprog/Documents/Cin-VidProd-PathStnd.pdf", standards: [] }] },
  { id: "transportation", title: "Transportation", groups: [
    { id: "automotive-maintenance-light-repair", title: "Automotive Maintenance & Light Repair", cip: "47.0604.01", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] },
    { id: "diesel-immr", title: "Diesel IMMR", cip: "47.0605.07", sourceStatus: "no-direct-kde-pathway-standards-document", standards: [] }
  ] }
];