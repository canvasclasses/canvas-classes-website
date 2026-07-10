// Class 12 Chemistry — Ch.4 p-Block Elements — chapter-end Practice page.
// One practice_bank block, four group sections. Each section is a MIXED bank:
// NCERT textbook Exercises (7.1–7.40) first, then NCERT Exemplar questions,
// each source-tagged. published:false (draft).
//   NCERT exercise items → ./ncert_pblock.js     (section-keyed, 'ncert_exercise')
//   NCERT Exemplar items → ./exemplar_pblock.js  (section-keyed, 'ncert_exemplar')
// Exemplar answers verified against the official answer PDF, EXCEPT:
//   - Q36: corrected to (ii) AND (iii) — the key prints only (ii), but
//          reaction (iii) (Cu + conc. H2SO4) is also conc.-H2SO4-as-oxidiser.
const SECTIONS = [
  { id: 'group-15', title: 'Group 15 — The Nitrogen Family',
    blurb: 'N, P, As, Sb, Bi and their compounds — dinitrogen, ammonia, oxides of nitrogen, nitric acid, phosphorus, phosphine, halides and oxoacids.' },
  { id: 'group-16', title: 'Group 16 — The Oxygen Family',
    blurb: 'O, S, Se, Te — dioxygen, simple oxides, ozone, sulphur, sulphur dioxide, oxoacids of sulphur and sulphuric acid.' },
  { id: 'group-17', title: 'Group 17 — The Halogens',
    blurb: 'F, Cl, Br, I — chlorine, hydrogen chloride, oxoacids of halogens and interhalogen compounds.' },
  { id: 'group-18', title: 'Group 18 — The Noble Gases',
    blurb: 'He, Ne, Ar, Kr, Xe, Rn — trends, and the xenon fluorides and oxofluorides.' },
];

module.exports = {
  page_number: 23,
  chapter: 4,
  slug: 'p-block-practice',
  title: 'Practice — The p-Block Elements',
  subtitle: 'Every NCERT textbook exercise and NCERT Exemplar question for the chapter, by group.',
  tags: ['p-block', 'practice', 'ncert-exercises', 'exemplar'],
  reading_time_min: 25,
  build(h) {
    const ncert = require('./ncert_pblock');
    const exemplar = require('./exemplar_pblock');
    const sections = SECTIONS.map((s) => ({
      ...s,
      // textbook exercises first within each section, then the Exemplar questions
      items: [...(ncert[s.id] || []), ...(exemplar[s.id] || [])],
    }));
    return [
      h.bank(
        'Practice — The p-Block Elements',
        'Every NCERT textbook exercise and NCERT Exemplar question for this chapter, organised by group. Pick a section on the left. MCQs and assertion-reason check instantly; the descriptive and long-answer questions reveal a full answer.',
        sections
      ),
    ];
  },
};
