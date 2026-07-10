// Ch.5 · Page 7 · MERGED (consolidation 22→16): §8.3.7 Stability of Higher Oxidation
// States + §8.3.8 Chemical Reactivity and E° Values. Composes the two _partials
// modules losslessly (all blocks kept; B's hero dropped; one combined recap+quiz).
const merge = require('./_partials/_merge');
const A = require('./_partials/higher-oxidation-states');
const B = require('./_partials/chemical-reactivity');
module.exports = {
  page_number: 7,
  chapter: 5,
  slug: 'higher-oxidation-states-and-reactivity',
  title: 'Higher Oxidation States & Chemical Reactivity',
  subtitle: 'Why fluorine and oxygen pull transition metals to their very highest states, and how the E° values explain which metals are reactive, which are noble, and which are the strongest oxidising/reducing agents.',
  tags: ['d-block', 'oxidation-states', 'halides', 'oxides', 'electrode-potential', 'reactivity'],
  reading_time_min: 9,
  build: (h) => merge(h, A, B,
    'Chemical Reactivity and E° Values',
    'Relate the standard electrode potentials of the transition metals to their chemical reactivity and to the strength of their ions as oxidising or reducing agents.'),
};
