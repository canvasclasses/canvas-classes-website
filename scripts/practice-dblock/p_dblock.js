// Class 12 Chemistry — Ch.5 The d- and f-Block Elements — chapter-end Practice page.
// One practice_bank block, five thematic sections following the build contract
// (_agents/plans/DFBLOCK_BUILD.md "Practice bank — 5 sections"). Each section holds
// the NCERT textbook Exercises (8.1–8.38) assigned to it, source-tagged.
// published:false (draft).
//   NCERT exercise items → ./ncert_dblock.js  (section-keyed, 'ncert_exercise')
// Mirrors scripts/practice-pblock/p_pblock.js.
const SECTIONS = [
  { id: 's1-structure',
    title: 'Position, configuration & general characteristics',
    blurb: 'Electronic configurations of d- and f-block ions, what makes an element a transition element, and how the three transition series compare.' },
  { id: 's2-oxidation-redox',
    title: 'Oxidation states, redox & electrode potentials',
    blurb: 'The chapter\'s core — variable oxidation states, stability of the +2/+3 states, E° values, disproportionation and the oxometal anions.' },
  { id: 's3-properties-compounds',
    title: 'Magnetic, colour, catalysis, interstitial, alloys & key compounds',
    blurb: 'Paramagnetism and spin-only moments, coloured d–d transitions, catalysis, interstitial compounds, and potassium dichromate and permanganate.' },
  { id: 's4-lanthanoids',
    title: 'The lanthanoids & lanthanoid contraction',
    blurb: 'The 4f series — lanthanoid contraction and its consequences, the +3/+2/+4 states, mischmetal and the magnetic moment of Ce³⁺.' },
  { id: 's5-actinoids',
    title: 'The actinoids & comparison',
    blurb: 'The 5f series — inner transition elements, the wide range of actinoid oxidation states, and the lanthanoid–actinoid comparison.' },
];

const INTRO =
  'Every NCERT textbook exercise (8.1–8.38) for this chapter, sorted into five revision themes. ' +
  'Section S2 (oxidation states) is the heaviest because it is the heart of the chapter. ' +
  'Tap any question to reveal a full worked answer.';

module.exports = {
  page_number: 16,
  chapter: 5,
  slug: 'd-and-f-block-practice',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 38 NCERT textbook exercises for the chapter, grouped into five revision themes.',
  tags: ['d-block', 'f-block', 'practice', 'ncert-exercises'],
  reading_time_min: 25,
  build(h) {
    const ncert = require('./ncert_dblock');
    const sections = SECTIONS.map((s) => ({
      ...s,
      items: [...(ncert[s.id] || [])],
    }));
    return [
      h.img(
        'A hand-drawn coloured illustration on a deep-charcoal (#121316) background, muted earthy palette, no glow / neon / 3D. ' +
        'A study-desk "revision board" scene for the d- and f-block elements: a corner of the periodic table showing the central d-block ' +
        'transition-metal strip (Sc to Zn) and, pulled out below it, the two long f-block rows (lanthanoids and actinoids) drawn as labelled ' +
        'tiles. Around them, small sketched icons of the chapter\'s big ideas — a colourful row of test tubes (coloured ions), a tiny bar magnet ' +
        '(paramagnetism), an orange dichromate and a purple permanganate crystal, and a balance/arrow motif for oxidation states. Neat handwritten ' +
        'chalk-style labels. Warm, textbook-illustration feel, landscape orientation.',
        '16:9',
        'Practice — the d- and f-Block Elements: every NCERT exercise, by theme.'
      ),
      h.text(
        'You have read the chapter — now drill it. Below are **all 38 NCERT textbook exercises (8.1–8.38)**, ' +
        'reorganised from the textbook\'s running order into **five revision themes** so you can practise one idea at a time. ' +
        'Start with whichever theme you found hardest; tap a question to reveal the full answer.'
      ),
      h.bank('NCERT Exercises 8.1–8.38', INTRO, sections),
    ];
  },
};
