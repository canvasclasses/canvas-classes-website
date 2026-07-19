'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-14-overview',
  title: 'Breathing and Exchange of Gases',
  subtitle: 'Every cell needs oxygen and must dump carbon dioxide — but your cells never touch the air. This is the machinery that bridges the gap: lungs that draw air in, and blood that ferries the gases to and from every corner of the body.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['breathing-and-exchange-of-gases'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing pair of human lungs with a branching bronchial tree, faint air moving in and out',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of a pair of human lungs glowing softly in a dark void — the branching bronchial tree suggested as delicate luminous channels, with a faint sense of air flowing in and out, without becoming a literal labelled diagram. The image conveys the quiet rhythm of breathing. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one soft cool glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Trace the path of air from the nostrils to the alveoli, and tell the conducting part from the exchange part of the respiratory system\n- Understand how the diaphragm and intercostal muscles create the pressure gradients that drive inspiration and expiration\n- Know the respiratory volumes and capacities cold (TV, IRV, ERV, RV, and the capacities built from them)\n- See how O2 and CO2 cross the alveolar membrane by diffusion down partial-pressure gradients\n- Follow how oxygen rides on haemoglobin (the dissociation curve) and how CO2 travels mostly as bicarbonate, and how the medulla keeps the rhythm going",
    },
  ],
};
