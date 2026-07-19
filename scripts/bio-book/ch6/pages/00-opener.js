'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-6-overview',
  title: 'Anatomy of Flowering Plants',
  subtitle: "Cut a root, a stem, or a leaf in cross-section and you'll see three tissue systems arranged differently in every organ — and completely differently in a monocot versus a dicot.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['anatomy-of-flowering-plants'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark cutaway cross-section of a plant stem showing concentric rings of tissue in warm internal light',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single dramatic cutaway cross-section of a plant stem at dusk, sliced clean to reveal concentric rings of internal tissue glowing faintly from within — an outer protective layer, a soft middle zone, and a ring of vein-like conducting bundles near the centre, each layer a slightly different warm hue as if lit from inside the tissue itself. The cut surface faces the viewer directly, geometric and precise, floating in a dark atmospheric void. Deep, moody lighting, one soft warm glow emanating from the tissue's centre, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Learn the three tissue systems every plant organ is built from — epidermal, ground, and vascular — and read a stomatal apparatus diagram on sight\n- Tell open vascular bundles from closed, and radial from conjoint — the single fact that separates a dicot's plumbing from a monocot's\n- Read a dicot root cross-section against a monocot root cross-section and spot every difference NEET asks about\n- Do the same for stem — ring-arranged vascular bundles vs scattered ones, the classic transverse-section identification question\n- Do the same for leaf — dorsiventral vs isobilateral, palisade-and-spongy mesophyll vs undifferentiated, and what bulliform cells actually do",
    },
  ],
};
