// Ch.5 · Page 4 · MERGED (consolidation 22→16): §8.3.2 Variation in Atomic & Ionic
// Sizes + §8.3.3 Ionisation Enthalpies. Composes the two component modules in
// _partials/ losslessly (all blocks kept; B's hero dropped; one combined recap+quiz).
const merge = require('./_partials/_merge');
const A = require('./_partials/atomic-ionic-sizes');
const B = require('./_partials/ionisation-enthalpies');
module.exports = {
  page_number: 4,
  chapter: 5,
  slug: 'sizes-and-ionisation-enthalpies',
  title: 'Atomic & Ionic Sizes · Ionisation Enthalpies',
  subtitle: 'Why a transition-metal atom barely shrinks across a series, the lanthanoid contraction that makes Zr and Hf near-identical twins, and why the ionisation enthalpies climb so irregularly.',
  tags: ['d-block', 'atomic-radii', 'lanthanoid-contraction', 'ionisation-enthalpy', 'periodic-trends'],
  reading_time_min: 8,
  build: (h) => merge(h, A, B,
    'Ionisation Enthalpies',
    'Account for the irregular increase in the ionisation enthalpies across the first transition series.'),
};
