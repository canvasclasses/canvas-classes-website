'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-10-overview',
  title: 'Cell Cycle and Cell Division',
  subtitle: 'You started as a single cell. Every cell in your body traces back to that one, copied and split again and again. This is the choreography of that copying — the cell cycle, mitosis, and the special reduction division, meiosis, that makes eggs and sperm.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['cell-cycle-and-cell-division'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing sequence of one cell dividing into two, chromosomes drawn apart by faint spindle threads',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of a single glowing cell in the act of dividing into two, suspended in a dark void — a faint suggestion of condensed chromosomes being drawn toward opposite poles by delicate luminous spindle threads, the cell gently pinching in the middle, without becoming a literal labelled diagram. Warm inner light against deep darkness conveys the drama of division. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Understand the cell cycle and its two big phases — interphase (G1, S, G2) and the M phase — and track how DNA content and chromosome number change through each\n- Walk through mitosis stage by stage — prophase, metaphase, anaphase, telophase — and know exactly what defines each\n- See how cytokinesis differs in animal cells (a furrow) and plant cells (a cell plate), and why mitosis matters for growth and repair\n- Master meiosis — the reduction division — including its unusually long Prophase I with its five sub-stages, crossing over, and the two divisions that yield four haploid cells\n- Tell mitosis and meiosis apart cleanly, and know why meiosis both conserves the chromosome number across generations and creates the variation evolution runs on",
    },
  ],
};
