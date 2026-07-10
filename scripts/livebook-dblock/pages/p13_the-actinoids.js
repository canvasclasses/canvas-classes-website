// Ch.5 · Page 13 · MERGED (consolidation 22→16): §8.6 The Actinoids — §8.6.1
// Electronic Configurations + §8.6.2 Ionic Sizes (actinoid contraction) + §8.6.3
// Oxidation States + §8.6.4 General Characteristics and Comparison with the
// Lanthanoids. Composes the two _partials modules losslessly.
const merge = require('./_partials/_merge');
const A = require('./_partials/actinoids-configuration-sizes');
const B = require('./_partials/actinoids-oxidation-comparison');
module.exports = {
  page_number: 13,
  chapter: 5,
  slug: 'the-actinoids',
  title: 'The Actinoids',
  subtitle: 'The fourteen radioactive 5f elements: their 5f/6d configurations, the steeper actinoid contraction, the much wider range of oxidation states, and how they compare point-by-point with the lanthanoids.',
  tags: ['f-block', 'actinoids', 'actinoid-contraction', 'oxidation-states', 'radioactive'],
  reading_time_min: 8,
  build: (h) => merge(h, A, B,
    'Oxidation States & Comparison with the Lanthanoids',
    'Explain why the actinoids show a wider range of oxidation states than the lanthanoids, and compare the two series.'),
};
