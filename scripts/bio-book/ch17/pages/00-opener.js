'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-17-overview',
  title: 'Locomotion and Movement',
  subtitle: 'Every step, breath and heartbeat is a muscle pulling on a bone. Open up a muscle to its sliding protein threads, walk the 206-bone scaffold they pull on, and see how the two turn a nerve signal into motion.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['locomotion-and-movement'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing impression of a striated muscle fibre over the faint outline of a human skeleton in motion',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of movement in a dark void — a faintly glowing striated muscle fibre and the suggestion of a human skeleton mid-stride behind it, delicate luminous filaments hinting at the protein machinery of contraction, without becoming a literal labelled diagram. The image conveys the union of muscle and bone that produces motion. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one warm glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Tell the three types of movement (amoeboid, ciliary, muscular) and the three types of muscle (skeletal, visceral, cardiac) apart\n- Read the structure of a skeletal muscle down to the sarcomere — the A and I bands, the Z and M lines, the H zone — and the contractile proteins actin and myosin\n- Explain muscle contraction by the sliding filament theory, from the nerve signal at the neuromuscular junction through the calcium-triggered cross-bridge cycle\n- Map the human skeleton — the 206 bones split into axial and appendicular, the skull, vertebral column, ribs, limbs and girdles\n- Know the three types of joints (fibrous, cartilaginous, synovial) and the common disorders of the muscular and skeletal systems",
    },
  ],
};
