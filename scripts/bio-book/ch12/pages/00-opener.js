'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-12-overview',
  title: 'Respiration in Plants',
  subtitle: 'Photosynthesis packs energy into sugar. Respiration is how every living cell — plant, animal or microbe — gets that energy back out, one careful step at a time, and banks it as ATP, the cell\'s spendable currency.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['respiration-in-plants'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing mitochondrion with faint inner folds, warm energy radiating outward as tiny sparks',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of a single mitochondrion glowing in a dark void — its folded inner membranes suggested as soft luminous ridges, with faint warm sparks of released energy drifting outward, without becoming a literal labelled diagram. The image conveys energy being carefully released from food inside a living cell. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one warm amber glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Understand why plants have no breathing organs yet still exchange gases, and why glucose is oxidised in many small steps instead of one burst\n- Walk through glycolysis — glucose to two pyruvate in the cytoplasm — and account for the ATP and NADH made and used\n- Follow the three fates of pyruvate: lactic acid fermentation, alcoholic fermentation, and aerobic respiration\n- Trace aerobic respiration through the link reaction, the Krebs (TCA) cycle, and the electron transport system with oxidative phosphorylation\n- Total up the respiratory balance sheet to 38 ATP, understand why the respiratory pathway is amphibolic, and calculate the respiratory quotient for carbohydrates, fats and proteins",
    },
  ],
};
