'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-15-overview',
  title: 'Body Fluids and Circulation',
  subtitle: 'Your cells are landlocked — nowhere near air or food. Blood is the river that reaches every one of them, and the heart is the pump that never rests. This is how that river is built and kept moving, beat after beat.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['body-fluids-and-circulation'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing human heart with faint vessels branching outward, a warm pulse of light at its centre',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of a human heart glowing softly in a dark void — a warm pulse of light at its centre and delicate luminous vessels branching outward into the darkness, without becoming a literal labelled diagram. The image conveys the tireless rhythm of circulation. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one warm red glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Know what blood is made of — plasma and the formed elements (RBCs, WBCs, platelets) — and what each part does\n- Understand the ABO and Rh blood group systems, universal donors and recipients, and erythroblastosis foetalis\n- Follow the clotting cascade, and tell blood from lymph\n- Map the human heart — chambers, valves, septa, and the nodal system (SAN, AVN, pacemaker) that makes it beat on its own\n- Walk through the cardiac cycle, read a standard ECG (P, QRS, T), understand double circulation, and how the heart is regulated by nerves and hormones",
    },
  ],
};
