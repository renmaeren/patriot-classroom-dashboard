/* Patriot Command — exact KDE Agriculture pathway standards.
   Loaded after cte-pathway-standards.js and before the picker initializes. */
(function () {
  "use strict";

  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;

  const agriculture = ctePathwayStandards.find(category => category.id === "agriculture");
  if (!agriculture || !Array.isArray(agriculture.groups)) return;

  function apply(groupId, sourceUrl, standards) {
    const group = agriculture.groups.find(item => item.id === groupId);
    if (!group) return;
    group.sourceStatus = "verified-exact-kde";
    group.sourceUrl = sourceUrl;
    group.standards = standards;
  }

  apply(
    "animal-science",
    "https://www.education.ky.gov/CTE/endofprog/Documents/AnimalSci-PathStnd.pdf",
    [
      { code: "OA1", text: "Discuss the interrelationships between agriculture commodities based on economic, geographic and production factors" },
      { code: "OA2", text: "Analyze changes in food consumption throughout history" },
      { code: "OA3", text: "Describe the relationship between consumer demands and animal production" },
      { code: "OA4", text: "Evaluate current trends in animal science through industry associations, trade journals, government publications and other reliable resources" },
      { code: "OA5", text: "Describe agricultural practices that ensure a safe food supply e.g., biosecurity, withdrawals, Beef Quality Assurance, Pork Quality Assurance, controlling pathogens" },
      { code: "OA6", text: "Discuss the relationship between the utilization of best practice production systems and product quality/product attributes, e.g., animal handling practices, proper injection techniques, castration, tail docking, administering iron to baby pigs, clipping needle teeth, feed additives for poultry" },
      { code: "OA7", text: "Summarize the benefits of technology in animal science, e.g., artificial intelligence, electronic identification, record keeping, data analysis" },
      { code: "OA8", text: "Evaluate the impact of world trade issues, e.g., diseases, imports/exports, drought, trade agreements, on animal science" },
      { code: "OA9", text: "Summarize agricultural laws impacting animal science, e.g., property, incorporation, liability issues, animal husbandry, labor, farming in populated areas, environmental" },
      { code: "OA10", text: "Identify related government agencies, their functions and programs, as they relate to animal science e.g., USDA, FDA, EPA, Extension service, Kentucky Department of Agriculture" },
      { code: "OA11", text: "Describe the current implications of state and federal agricultural legislation, e.g., farm bill" },
      { code: "OA12", text: "Compare and contrast marketing opportunities for animal commodities, e.g., terminal, direct, niche, local" },
      { code: "OA13", text: "Describe the benefits of common risk management practices, e.g., futures, forward contracts, diversification, insurance" },
      { code: "OB1", text: "Describe behavior concepts that should be considered when working with animals, e.g., flight zones, blind spots, instinct vs trained behavior, neutral vs aggressive, point of balance" },
      { code: "OB2", text: "Describe characteristics of effective animal care facilities" },
      { code: "OB3", text: "Recommend safe handling techniques and equipment when working with animals, e.g., physical restraints, control poles, head chutes" },
      { code: "OB4", text: "Differentiate between animal welfare and animal rights" },
      { code: "OC1", text: "Describe the anatomy and physiology of digestive systems, e.g., monogastric, ruminant, hind gut fermenters, avian" },
      { code: "OC2", text: "Discuss the function of the six classes of nutrients in regards to animal nutrition" },
      { code: "OC3", text: "Describe the impact of water quality on animal health" },
      { code: "OC4", text: "Identify common types of feedstuffs and the role they play in the diets of animals, e.g., roughages, concentrates, mixed feeds" },
      { code: "OC5", text: "Explain the purpose of feed additives and growth promotants in animal production, e.g., pro-biotics, hormonal supplements, implants" },
      { code: "OC6", text: "Describe how stages and level of production impact nutritional requirements, e.g., rapid growth, finishing, gestation, lactation, maintenance" },
      { code: "OC7", text: "Formulate animal rations optimized for nutritional requirements and cost" },
      { code: "OD1", text: "Describe the functions of major reproductive organs and hormones in the male and female reproductive systems of mammals" },
      { code: "OD2", text: "Describe the functions of major reproductive organs and hormones in the male and female reproductive systems of avians" },
      { code: "OD3", text: "Contrast the processes of natural and artificial breeding methods" },
      { code: "OD4", text: "Describe factors that impact the reproductive efficiency of animals, e.g., age, health, nutrition, body condition" },
      { code: "OD5", text: "Evaluate the use of quantitative breeding values in the selection of genetically superior breeding stock, e.g., EPD, pedigree, genomic testing" },
      { code: "OD6", text: "Discuss the importance of efficient and economic reproduction in animals" },
      { code: "OD7", text: "Differentiate principles of animal genetics and heredity, e.g., homozygous, heterozygous, phenotype, genotype, dominance, recessive, heterosis" },
      { code: "OD8", text: "Appraise the advantages of reproductive management practices, including estrous synchronization, superovulation, flushing and embryo transfer" },
      { code: "OE1", text: "Select best practices to sustain soil and water quality, e.g., soil testing, waste management, run off prevention, pasture rotation" },
      { code: "OE2", text: "Describe strategies to mitigate the impact of environmental changes on animal health, e.g., fans, shade, sprinklers" },
      { code: "OE3", text: "Evaluate measures to maintain the quality of the environment in facilities used to raise and house animals, e.g., temperature control, air movement, light" },
      { code: "OF1", text: "Classify animals according to the taxonomical classification system and species-specific terminology related to age and gender" },
      { code: "OF2", text: "Differentiate major animal breeds within the industry and their production strengths" },
      { code: "OF3", text: "Identify the major skeletal and external anatomy of production and companion species" },
      { code: "OF4", text: "Evaluate desirable anatomical and physiological characteristics of animals within a species" },
      { code: "OF5", text: "Identify wholesale and retail meat cuts of production species" },
      { code: "OF6", text: "Describe systems used to evaluate animal product and yield, e.g., quality grade, yield grade, frame size" },
      { code: "OG1", text: "Characterize common disorders and diseases of both production and companion animal species" },
      { code: "OG2", text: "Characterize common internal and external parasites of both production and companion animal species" },
      { code: "OG3", text: "Discuss the health risks of zoonotic diseases to humans and their historical significance" },
      { code: "OG4", text: "Select proper medical dosages and delivery methods, e.g., topical, subcutaneous, intravenous, intramuscular" },
      { code: "OG5", text: "Evaluate preventative measures for controlling and limiting the spread of diseases, parasites and disorders among animals, e.g., vaccination protocols, quarantine, deworming, vector population control" },
      { code: "OG6", text: "Explain common surgical and nonsurgical procedures in animal healthcare, e.g., castration, docking, dental, dehorning, hoof/foot care" },
      { code: "OG7", text: "Define Veterinary Feed Directive and Veterinary Client-Patient Relationship" },
      { code: "OH1", text: "Create a budget for an animal-based operation" },
      { code: "OH2", text: "Identify funding sources for animal-based operations, e.g., credit, grants, County Agriculture Investment Program" },
      { code: "OH3", text: "Compare the benefits related to buying, leasing, renting land and/or equipment" },
      { code: "OH4", text: "Describe how various forms of taxes impact the animal science industry, e.g., income, sales, property" },
      { code: "OH5", text: "Calculate break-even prices in an animal science business to maximize profit" }
    ]
  );

  apply(
    "plant-science",
    "https://www.education.ky.gov/CTE/endofprog/Documents/PlantScience-PathStnd.pdf",
    [
      { code: "OA1", text: "Describe how soil is formed and the horizon layers resulting from the formation" },
      { code: "OA2", text: "Describe the proper methods to collect soil samples" },
      { code: "OA3", text: "Analyze site according to soil type, slope and drainage" },
      { code: "OA4", text: "Differentiate the function of various growing media components, e.g., peat, Perlite, Vermiculite" },
      { code: "OA5", text: "Determine the relationship of optimal air, temperature and water conditions on plant growth" },
      { code: "OA6", text: "Summarize the three measurements of light - color, intensity and duration - that affect plant growth" },
      { code: "OA7", text: "Describe pH, its impact on nutrient availability and how to adjust the pH of growing media" },
      { code: "OA8", text: "Examine the importance of macronutrients and micronutrients to plant growth" },
      { code: "OA9", text: "Identify the essential nutrients for plant growth and development and their major functions, e.g., nitrogen, phosphorus, potassium" },
      { code: "OA10", text: "Calculate the amount of fertilizer to be applied based on nutrient recommendation and fertilizer analysis" },
      { code: "OB1", text: "Explain how the binomial nomenclature system is used to classify plants, including the naming of cultivars" },
      { code: "OB2", text: "Describe the morphological characteristics used to identify agricultural and herbaceous plants, e.g., life cycles, growth habitat, plant use, monocotyledons or dicotyledons, woody, herbaceous" },
      { code: "OB3", text: "Identify structures in a typical plant cell and their functions" },
      { code: "OB4", text: "Describe the components, types and functions of plant roots" },
      { code: "OB5", text: "Describe the components, types and functions of plant stems" },
      { code: "OB6", text: "Describe the components, types and functions of plant leaves" },
      { code: "OB7", text: "Describe the components, types and functions of plant flowers" },
      { code: "OB8", text: "Describe the components, types and functions of seeds and fruit" },
      { code: "OB9", text: "Analyze the life cycle of plant growth/development from seed to seed, e.g., annual, biennial, perennial, cool vs. warm season" },
      { code: "OB10", text: "Identify common agronomic crops grown in Kentucky, e.g., corn, wheat, soybeans" },
      { code: "OB11", text: "Identify common bedding and nursery crops grown in Kentucky, e.g., marigold, petunia, boxwood, hosta" },
      { code: "OB12", text: "Explain requirements necessary for photosynthesis to occur and identify the products and byproducts of photosynthesis" },
      { code: "OB13", text: "Explain factors that affect cellular respiration and identify the products and byproducts of cellular respiration" },
      { code: "OC1", text: "Describe how to safely operate equipment utilized in plant production" },
      { code: "OC2", text: "Explain the importance of equipment cleaning/sanitation in plant production" },
      { code: "OC3", text: "Explain how to safely handle and apply chemicals" },
      { code: "OC4", text: "Utilize industry-appropriate selection techniques for crop varieties/cultivars, e.g., yield, germination, disease tolerance, growing season" },
      { code: "OC5", text: "Analyze seed tag information in crop selection, e.g., germination rate, seeding rate, variety, live seed" },
      { code: "OC6", text: "Determine proper techniques to control and manage plant growth through biological, chemical, cultural and mechanical means" },
      { code: "OC7", text: "Describe the purpose of plant growth regulators" },
      { code: "OC8", text: "Differentiate various watering technologies and methods, e.g., hand, drip, overhead sprinkler, moisture sensors" },
      { code: "OC9", text: "Explain methods used for asexual plant propagation, e.g., cuttings, division, separation, layering, budding, grafting" },
      { code: "OC10", text: "Describe examples of sexual reproduction in flowering plants, e.g., pollination, cross-pollination, self-pollination" },
      { code: "OC11", text: "Explain the purpose of an integrated pest management plan and the components it contains, e.g., action threshold, monitor/identify pests, prevention, control" },
      { code: "OC12", text: "Identify the characteristics of major insect pests in Kentucky, e.g., mouth parts, economic impact, life cycle" },
      { code: "OC13", text: "Identify major plant disorders in Kentucky and their mitigation strategies, e.g., rust, leaf blight, powdery mildew" },
      { code: "OC14", text: "Identify the major invasive weeds found in Kentucky and their mitigation strategies, e.g., johnsongrass, bull thistle, crabgrass, pigweed" },
      { code: "OC15", text: "Predict pest and diseases problems based on environmental conditions and life cycles" },
      { code: "OC16", text: "Identify appropriate techniques for harvesting and storage of crops grown in Kentucky, e.g., machinery, hand tools, hand harvest, grain bins, coolers" },
      { code: "OD1", text: "Describe principles and elements of design that form the basis of artistic impression, e.g., line, form, texture, color" },
      { code: "OD2", text: "Discuss the applications of design in agriculture and ornamental plant systems" },
      { code: "OD3", text: "Identify tools used for design, e.g., drawing tools, florist tools, landscape design software" },
      { code: "OE1", text: "Discuss how imports and exports impact the agriculture markets in the US and abroad" },
      { code: "OE2", text: "Interpret how crop production varies based on geographic location within Kentucky and the US, and the economic impact therein" },
      { code: "OE3", text: "Describe the purpose of plant patents in the agricultural industry" },
      { code: "OE4", text: "Generalize how GMOs impact the agriculture industry" },
      { code: "OE5", text: "Identify current technology used in crop production, e.g., plant genetics, biotechnology, GPS, remote sensors" },
      { code: "OE6", text: "Distinguish roles and responsibilities of state and federal government agencies as they impact crop production, e.g., Kentucky Department of Agriculture, USDA, FDA" },
      { code: "OE7", text: "Discuss the impact of environmental issues on crop production, e.g., surface or groundwater, erosion, drift, chemical residue, runoff, water testing" },
      { code: "OE8", text: "Generalize strategies related to the marketing of crop, e.g., futures and forward cash contracts" },
      { code: "OE9", text: "Develop planning, production, maintenance and harvest schedules for Kentucky crops" },
      { code: "OF1", text: "Apply effective record keeping skills including financial records" },
      { code: "OF2", text: "Discuss the purpose and components of a marketing plan, e.g., goals, target audience, strategies, budget, timeline" },
      { code: "OF3", text: "Assess methods to determine target audience and products for a business" },
      { code: "OF4", text: "Define enterprise budget, fixed cost, variable cost and cash flow as they relate to plant production" },
      { code: "OF5", text: "Discuss the major issues related to labor management, e.g., H2-A, OSHA, insurance" }
    ]
  );
})();