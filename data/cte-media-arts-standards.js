/* Patriot Command — KDE-aligned Media Arts pathway standards. */
(function () {
  "use strict";
  if (typeof ctePathwayStandards === "undefined" || !Array.isArray(ctePathwayStandards)) return;
  const category = ctePathwayStandards.find(item => item.id === "media-arts");
  if (!category || !Array.isArray(category.groups)) return;
  const group = category.groups.find(item => item.id === "cinematography-video");
  if (!group) return;
  group.sourceStatus = "verified-kde-strand-map";
  group.sourceUrl = "https://www.education.ky.gov/CTE/endofprog/Documents/Cin-VidProd-PathStnd.pdf";
  group.displayLevel = "occupational-strand-summary";
  group.standards = [
    { code: "OA", text: "Laws and ethics in media production" },
    { code: "OB", text: "History of media and technological development" },
    { code: "OC", text: "Digital communication and collaboration" },
    { code: "OD", text: "Audience, purpose and media presentation" },
    { code: "OE", text: "Video-production workflow and crew roles" },
    { code: "OF", text: "Video-production equipment, audio and lighting" },
    { code: "OG", text: "Writing, research, scripting and interviewing" },
    { code: "OH", text: "Field and studio production practices" },
    { code: "OI", text: "Editing workflow, media management and post-production" }
  ];
})();