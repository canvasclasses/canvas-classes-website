// Class 12 Chemistry — Ch.1 Solutions — end-of-chapter Practice page.
// One practice_bank block, five sub-topic sections. Each section is a MIXED
// bank: NCERT textbook Exercises (2.1–2.41) first, then NCERT Exemplar
// questions (Q1–62), each source-tagged. published:false (draft).
//   NCERT exercise items  → ./ncert_sol.js     (section-keyed map, source 'ncert_exercise')
//   NCERT Exemplar items  → ./exemplar_sol.js  (section-keyed map, source 'ncert_exemplar')
// Exemplar answers verified against the official answer PDF, EXCEPT:
//   - Q23: answer CORRECTED to (ii) — the key prints (i); a minimum-boiling
//          azeotrope is a POSITIVE deviation (A–B interactions weaker, more
//          molecules escape), so (ii) is correct, not (i).
//   - Q25: correct_index CORRECTED to (i) [index 0] — same positive-deviation ⇒
//          minimum-boiling logic; (ii) "maximum boiling + positive deviation" is
//          self-contradictory. (Found in the post-build verification pass.)
const SECTIONS = [
  { id: 'types-conc', title: 'Types of Solutions & Concentration Terms',
    blurb: 'Types of solutions, mass %, ppm, mole fraction, molarity, molality, and why molarity is temperature-dependent.' },
  { id: 'solubility-henry', title: 'Solubility & Henry’s Law',
    blurb: 'Solubility of solids and gases, the like-dissolves-like rule, and Henry’s law (K_H, pressure and temperature effects).' },
  { id: 'raoult-vp', title: 'Vapour Pressure & Raoult’s Law',
    blurb: 'Raoult’s law, ideal vs non-ideal solutions, positive/negative deviations, and azeotropes.' },
  { id: 'colligative', title: 'Colligative Properties',
    blurb: 'Relative lowering of vapour pressure, boiling-point elevation, freezing-point depression, and osmotic pressure.' },
  { id: 'vant-hoff', title: 'Abnormal Molar Mass & van’t Hoff Factor',
    blurb: 'Association and dissociation of solutes, the van’t Hoff factor i, and abnormal molar masses.' },
];

module.exports = {
  page_number: 14,
  chapter: 1,
  slug: 'solutions-practice',
  title: 'Practice — Solutions',
  subtitle: 'Every NCERT textbook exercise and NCERT Exemplar question for the chapter, by sub-topic.',
  build(h) {
    const ncert = require('./ncert_sol');
    const exemplar = require('./exemplar_sol');
    const sections = SECTIONS.map((s) => ({
      ...s,
      // textbook exercises first within each section, then the Exemplar questions
      items: [...(ncert[s.id] || []), ...(exemplar[s.id] || [])],
    }));
    return [
      h.bank(
        'Practice — Solutions',
        'Every NCERT textbook exercise and NCERT Exemplar question for this chapter, organised by sub-topic. Pick a section on the left. The longer questions reveal a full worked solution; MCQs and assertion-reason check instantly.',
        sections
      ),
    ];
  },
};
