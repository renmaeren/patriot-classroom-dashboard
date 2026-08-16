/*
==========================================
PATRIOT COMMAND
Kentucky CTE Pathway Standards
Version 4 — ACSHS/ACCTC 2026–27 pathway map
==========================================

PURPOSE

Stores Allen County's current CTE program/pathway structure separately from the shared Academic and Employability standards.

DISPLAY NAMES follow the current SchooLinks course catalog supplied for ACSHS/ACCTC.
CIP codes are retained as stable pathway identifiers.

Only verified official pathway standards should be added to each standards array. Do not paraphrase or invent standards.
*/

const ctePathwayStandards = [
  {
    id: "agriculture",
    title: "Agriculture",
    groups: [
      { id: "agribusiness", title: "Agribusiness Systems", cip: "01.0101.00", standards: [] },
      { id: "ag-power", title: "Agricultural Power, Structural, Technical Systems", cip: "01.0201.00", standards: [] },
      { id: "animal-science", title: "Animal Science", cip: "01.0901.00", standards: [] },
      { id: "plant-science", title: "Plant Science Systems", cip: "01.1101.00", standards: [] }
    ]
  },
  {
    id: "business-marketing",
    title: "Business & Marketing",
    groups: [
      { id: "administrative-support", title: "Administrative Support", cip: "52.0301.00", standards: [] },
      { id: "e-commerce", title: "E-Commerce", cip: "52.0208.02", standards: [] },
      { id: "management-entrepreneurship", title: "Management & Entrepreneurship", cip: "52.0701.00", standards: [] },
      { id: "marketing", title: "Marketing", cip: "52.1401.01", standards: [] }
    ]
  },
  {
    id: "computer-science",
    title: "Computer Science",
    groups: [
      { id: "computer-programming", title: "Computer Programming", cip: "11.0201.01", standards: [] },
      { id: "cybersecurity", title: "Cybersecurity", cip: "14.0902.00", standards: [] },
      { id: "data-science", title: "Data Science", cip: "11.0802.00", standards: [] },
      { id: "network-administration", title: "Network Administration", cip: "11.0901.01", standards: [] },
      { id: "web-development", title: "Web Development/Administration", cip: "11.0801.01", standards: [] }
    ]
  },
  {
    id: "construction-technology",
    title: "Construction Technology",
    groups: [
      { id: "residential-maintenance-carpenter", title: "Residential Maintenance Carpenter Assistant", cip: "46.0401.01", standards: [] }
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
  {
    id: "engineering",
    title: "Engineering",
    groups: [
      { id: "engineering-design", title: "Engineering Design", cip: "15.1302.00", standards: [] }
    ]
  },
  {
    id: "family-consumer-science",
    title: "Family & Consumer Science",
    groups: [
      { id: "consumer-family-services", title: "Consumer & Family Services", cip: "19.0403.00", standards: [] },
      { id: "culinary-food-services", title: "Culinary & Food Services", cip: "12.0500.00", standards: [] },
      { id: "hospitality-tourism", title: "Hospitality, Travel, Tourism & Recreation", cip: "12.0500.00", standards: [] }
    ]
  },
  {
    id: "health-science",
    title: "Health Science",
    groups: [
      { id: "allied-health", title: "Allied Health", cip: "51.0000.01", standards: [] },
      { id: "biomedical-sciences", title: "Biomedical Sciences", cip: "26.0102.00", standards: [] },
      { id: "pre-nursing", title: "Pre-Nursing", cip: "51.2699.01", standards: [] }
    ]
  },
  {
    id: "industrial-maintenance-technology",
    title: "Industrial Maintenance Technology",
    groups: [
      { id: "industrial-maintenance-mechanic", title: "Industrial Maintenance Mechanic", cip: "47.0303.01", standards: [] },
      { id: "welding-maintenance-technician", title: "Welding Maintenance Technician", cip: "47.0303.06", standards: [] }
    ]
  },
  {
    id: "jrotc",
    title: "JROTC",
    groups: [
      { id: "jrotc", title: "JROTC", cip: "28.0301.00", standards: [] }
    ]
  },
  {
    id: "media-arts",
    title: "Media Arts",
    groups: [
      { id: "cinematography-video", title: "Cinematography & Video Production", cip: "09.0701.00", standards: [] }
    ]
  },
  {
    id: "transportation",
    title: "Transportation",
    groups: [
      { id: "automotive-maintenance-light-repair", title: "Automotive Maintenance & Light Repair", cip: "47.0604.01", standards: [] },
      { id: "diesel-immr", title: "Diesel IMMR", cip: "47.0605.07", standards: [] }
    ]
  }
];
