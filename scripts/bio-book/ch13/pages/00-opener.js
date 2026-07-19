'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-13-overview',
  title: 'Plant Growth and Development',
  subtitle: 'A single fertilised egg becomes a whole tree — roots, leaves, flowers and fruit, each in its right place and time. This is how a plant builds itself, and the tiny chemical messengers that tell every cell what to become.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['plant-growth-and-development'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing seedling unfurling from a seed, roots and shoot reaching in opposite directions in warm light',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of a single seed germinating in a dark void — a delicate seedling unfurling, its shoot reaching upward toward a soft warm light and its roots reaching down into darkness, glowing gently as if alive with growth, without becoming a literal labelled diagram. The image conveys an orderly unfolding of life from a single seed. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one soft green-gold glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Define growth precisely, and understand why plant growth is indeterminate — driven by meristems that never stop dividing\n- Tell the three phases of growth apart (meristematic, elongation, maturation) and read arithmetic vs geometric growth and the sigmoid growth curve\n- Understand differentiation, dedifferentiation and redifferentiation, and why development in plants is 'open' (plasticity, heterophylly)\n- Know the five plant growth regulators — auxins, gibberellins, cytokinins, ethylene, abscisic acid — how each was discovered, and what each does\n- Match the right hormone to the right job: rooting, apical dominance, fruit ripening, delaying senescence, stomatal closure, and stress tolerance",
    },
  ],
};
