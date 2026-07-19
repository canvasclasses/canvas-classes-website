'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-5-overview',
  title: 'Morphology of Flowering Plants',
  subtitle: 'Root, stem, leaf, flower, fruit, seed — the exact vocabulary that turns any labelled plant diagram, floral formula, or floral diagram into something you can read at a glance.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['morphology-of-flowering-plants'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark botanical cutaway of a flowering plant showing its root system, stem, leaves, and a single open flower with fruit forming beside it',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single continuous botanical illustration of a flowering plant at dusk, shown as a cutaway from below the soil to the flower above: on the left, a tangle of pale roots reaching down into dark earth; rising up through a woody stem with a few leaves catching soft light; on the right, one open flower in gentle bloom with a small green fruit forming just beside it. Every part rendered with quiet botanical precision but no labels or text. Deep dusk lighting, one warm glow behind the flower, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no diagram elements, no text.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Tell tap roots from fibrous roots from adventitious roots, and read the four zones of a growing root tip\n- Know exactly what separates a stem from a root, and read a leaf's parts, venation, and phyllotaxy from a diagram\n- Tell racemose from cymose inflorescence, and read a flower's symmetry, merosity, and the position of its ovary (hypogynous/perigynous/epigynous) — a NEET diagram favourite\n- Learn every floral whorl in order — calyx, corolla, androecium, gynoecium — down to aestivation types and placentation types\n- Read a dicot seed and a monocot seed side by side, and decode a floral formula and floral diagram on sight",
    },
  ],
};
