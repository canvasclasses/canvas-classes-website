'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-11-overview',
  title: 'Photosynthesis in Higher Plants',
  subtitle: 'Almost every calorie you have ever eaten, and almost every breath of oxygen you have ever taken, was made by a green leaf. This is how the leaf does it — sunlight caught by pigments, water split, and CO2 built into sugar, step by step.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['photosynthesis-in-higher-plants'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing green leaf backlit by a shaft of warm sunlight, faint impressions of chloroplasts and light rays inside',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single green leaf held against deep darkness, backlit by one warm shaft of sunlight that makes its veins glow, with a faint luminous suggestion of tiny chloroplasts and light being caught within the leaf tissue, without becoming a literal labelled diagram. The image conveys sunlight being captured and turned into life. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one warm green-gold glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Know the classic experiments (Priestley, Ingenhousz, Sachs, Engelmann, van Niel) and the corrected photosynthesis equation — and why the O2 released comes from water, not CO2\n- Locate photosynthesis in the chloroplast, and separate the light reaction (on the thylakoid membranes) from the carbon-fixing reactions (in the stroma)\n- Read the light reaction fully — the four pigments, Photosystems I and II, P700 and P680, the Z-scheme, water splitting, cyclic vs non-cyclic photophosphorylation, and ATP made by chemiosmosis\n- Trace the Calvin cycle through carboxylation, reduction and regeneration, and account for exactly how much ATP and NADPH one glucose costs\n- Understand the C4 pathway and Kranz anatomy, why photorespiration wastes RuBisCO in C3 plants, and the internal and external factors that limit the rate of photosynthesis",
    },
  ],
};
