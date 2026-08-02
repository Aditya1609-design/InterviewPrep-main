const { SECTION_ALIASES } = require("./sectionAliases");

const KNOWN_HEADINGS = new Set([
  ...Object.keys(SECTION_ALIASES),
  "experience", "projects", "skills", "education", "certifications",
  "summary", "objective", "achievements", "awards", "extracurricular",
  "work experience", "technical skills", "publications", "leadership",
]);

function splitIntoSections(text) {
  const out = {};
  const lines = text.split("\n");
  const headingLineRe = /^([A-Z][A-Za-z ]{2,40})\s*[:\-]?$/;

  const boundaries = [];
  lines.forEach((line, idx) => {
    const match = line.trim().match(headingLineRe);
    if (!match) return;
    const hdrRaw = match[1].trim().toLowerCase();
    if (KNOWN_HEADINGS.has(hdrRaw)) {
      boundaries.push({ index: idx, canon: SECTION_ALIASES[hdrRaw] || hdrRaw });
    }
  });

  for (let i = 0; i < boundaries.length; i++) {
    const start = boundaries[i].index + 1;
    const end = i + 1 < boundaries.length ? boundaries[i + 1].index : lines.length;
    const content = lines.slice(start, end).join("\n").trim();
    const canon = boundaries[i].canon;
    out[canon] = (out[canon] ? out[canon] + "\n\n" : "") + content;
  }

  return out;
}

module.exports = { splitIntoSections };