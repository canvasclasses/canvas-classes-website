// Ch.5 · Page 9 · MERGED (consolidation 22→16): §8.3.12 Catalytic Properties +
// §8.3.13 Interstitial Compounds + §8.3.14 Alloy Formation + §8.4.1 Oxides and
// Oxoanions of Metals (the lead-in to the important-compound pages that follow).
// Composes the two _partials modules losslessly (all blocks kept; B's hero dropped).
const merge = require('./_partials/_merge');
const A = require('./_partials/catalytic-interstitial-alloys');
const B = require('./_partials/oxides-oxoanions');
module.exports = {
  page_number: 9,
  chapter: 5,
  slug: 'catalysis-interstitial-alloys-and-oxides',
  title: 'Catalysis, Interstitial Compounds, Alloys & Oxides',
  subtitle: 'The everyday consequences of variable oxidation states and partly-filled d orbitals — catalytic activity, interstitial hydrides/carbides/nitrides, alloy formation — and the oxides & oxoanions that lead into K₂Cr₂O₇ and KMnO₄.',
  tags: ['d-block', 'catalysis', 'interstitial', 'alloys', 'oxides', 'oxoanions'],
  reading_time_min: 8,
  build: (h) => merge(h, A, B,
    'Oxides and Oxoanions of the Metals',
    'Describe how the oxides of the transition metals change from basic to acidic as the oxidation state rises, and identify their important oxoanions.'),
};
