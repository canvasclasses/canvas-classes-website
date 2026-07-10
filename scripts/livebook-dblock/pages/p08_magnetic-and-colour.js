// Ch.5 · Page 8 · MERGED (consolidation 22→16): §8.3.9 Magnetic Properties +
// §8.3.10 Formation of Coloured Ions + §8.3.11 Formation of Complex Compounds.
// Composes the two _partials modules losslessly (all blocks kept; B's hero dropped).
const merge = require('./_partials/_merge');
const A = require('./_partials/magnetic-properties');
const B = require('./_partials/coloured-ions-complexes');
module.exports = {
  page_number: 8,
  chapter: 5,
  slug: 'magnetic-and-coloured-ions',
  title: 'Magnetic Properties & Coloured Ions',
  subtitle: 'How the number of unpaired electrons fixes the magnetic moment (the μ ↔ n ↔ ion ladder), and why transition-metal ions are coloured while Sc³⁺ and Zn²⁺ are not.',
  tags: ['d-block', 'magnetic-moment', 'spin-only', 'coloured-ions', 'complexes', 'high-yield'],
  reading_time_min: 8,
  build: (h) => merge(h, A, B,
    'Formation of Coloured Ions & Complexes',
    'Explain why most transition-metal ions are coloured in terms of d–d transitions, and why they readily form complex compounds.'),
};
