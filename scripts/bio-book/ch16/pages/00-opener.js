'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-16-overview',
  title: 'Excretory Products and Their Elimination',
  subtitle: 'Burning food for energy leaves toxic nitrogen waste behind. Left in the blood, it would kill you. This is how the kidney filters 180 litres a day, reclaims almost all of it, and sends out just the poison — as barely a litre and a half of urine.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['excretory-products-and-their-elimination'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing pair of human kidneys with a faint nephron filtering network, warm light passing through',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of a pair of bean-shaped human kidneys glowing softly in a dark void — a faint suggestion of an intricate filtering network within, with warm light passing through as if fluid is being cleaned, without becoming a literal labelled diagram. The image conveys tireless filtration and purification. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one warm amber glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Know the three nitrogenous wastes (ammonia, urea, uric acid), the ammonotelic/ureotelic/uricotelic strategies, and the excretory organs across the animal kingdom\n- Map the human kidney and the nephron — glomerulus, Bowman's capsule, PCT, loop of Henle, DCT, collecting duct — and cortical vs juxtamedullary nephrons\n- Understand urine formation through filtration, reabsorption and secretion, and what GFR means\n- Follow the counter-current mechanism that lets the kidney concentrate urine, and how ADH and the renin-angiotensin system regulate it\n- Understand micturition, the roles of lungs/liver/skin in excretion, and disorders like uremia (and how dialysis helps)",
    },
  ],
};
