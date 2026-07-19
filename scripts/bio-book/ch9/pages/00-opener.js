'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-9-overview',
  title: 'Biomolecules',
  subtitle: 'Grind up any living thing and you get the same short list of molecules — a handful of tiny building blocks, four big polymers they snap into, and the enzymes that run every reaction. Learn the chemistry, and biology stops being memorisation.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['biomolecules'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing tangle of molecular chains — amino acids, sugars and a twisting nucleic acid strand suspended in warm light',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An abstract, atmospheric impression of the molecules of life suspended in a dark void — softly glowing chains and rings hinting at a long protein strand, a twisting sugar-phosphate backbone, and scattered small building-block shapes, all rendered as warm luminous forms against deep darkness, without becoming a literal labelled diagram. A quiet inner glow suggests the chemistry underlying every living cell. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Know how a living tissue is pulled apart into an acid-soluble pool of small molecules and an acid-insoluble pool of macromolecules\n- Recognise the four small building blocks by sight — amino acids, sugars, fatty acids/glycerol, and nucleotides — and the functional groups that define each\n- Tell primary metabolites from secondary metabolites, and micromolecules from the four true macromolecules\n- Build up proteins, polysaccharides and nucleic acids from their monomers, and read a protein through all four levels of structure\n- Understand enzymes cold — active site, activation energy, the ES complex, what changes their rate, competitive inhibition, the six classes, and cofactors — the machinery that makes life's chemistry fast enough to live on",
    },
  ],
};
