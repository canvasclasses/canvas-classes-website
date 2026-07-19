'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-8-overview',
  title: 'Cell: The Unit of Life',
  subtitle: 'Every living thing you have ever studied is built from this one unit — open it up and name every organelle inside, from the power house to the packaging plant.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['cell-the-unit-of-life'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark glowing cutaway of a cell revealing its internal organelles suspended in warm cytoplasm',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single cell rendered as a vast glowing sphere floating in a dark void, its outer membrane translucent enough to reveal suggestions of internal structures within — soft warm shapes hinting at organelles suspended in a luminous cytoplasm, a denser glowing core near the centre suggesting a nucleus, without becoming a literal labelled diagram. The whole cell radiates a quiet inner warmth against the surrounding darkness. Deep, atmospheric lighting, one soft warm glow emanating from within the cell, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Know cell theory cold — who discovered what, and the two-line modern statement NEET quotes verbatim\n- Tell prokaryotic from eukaryotic on sight, and know exactly what a prokaryotic cell has and lacks\n- Read the plasma membrane's fluid mosaic model, and tell passive transport from active transport\n- Name every organelle in the endomembrane system — ER, Golgi, lysosomes, vacuoles — and what makes them a system\n- Know mitochondria and plastids inside out, plus ribosomes, the cytoskeleton, cilia/flagella, and the nucleus down to chromosome types by centromere position — the single most-tested structural chapter in the whole syllabus",
    },
  ],
};
