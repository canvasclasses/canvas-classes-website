// Ch.5 · Page 12 · MERGED (consolidation 22→16): the inner-transition (f-block)
// intro + §8.5 The Lanthanoids — §8.5.1 Electronic Configurations + §8.5.2 Atomic
// and Ionic Sizes (lanthanoid contraction) + §8.5.3 Oxidation States + §8.5.4
// General Characteristics. Composes the two _partials modules losslessly.
const merge = require('./_partials/_merge');
const A = require('./_partials/lanthanoids-configuration-sizes');
const B = require('./_partials/lanthanoids-oxidation-characteristics');
module.exports = {
  page_number: 12,
  chapter: 5,
  slug: 'the-lanthanoids',
  title: 'The Lanthanoids',
  subtitle: 'The fourteen 4f elements: their 4fⁿ configurations, the lanthanoid contraction that makes Zr and Hf near-twins, the dominant +3 state (with Ce⁴⁺ and Eu²⁺ as the exceptions), and mischmetall.',
  tags: ['f-block', 'lanthanoids', 'lanthanoid-contraction', 'oxidation-states', 'inner-transition'],
  reading_time_min: 9,
  build: (h) => merge(h, A, B,
    'Oxidation States & General Characteristics',
    'Account for the predominant +3 oxidation state of the lanthanoids and the appearance of Ce(IV) and Eu(II) in terms of f-orbital stability.'),
};
