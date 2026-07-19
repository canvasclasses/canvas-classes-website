'use strict';
/**
 * Class 12 Biology — Chapter 5 (Molecular Basis of Inheritance)
 * Page 0 — Chapter opener.
 *
 * Every fact traces to NCERT lebo105.txt (Rule 0): the journey from Mendel's
 * unknown 'factors' to DNA is the chapter intro (lines 45-80) + §5.2 (lines
 * 256-265); the Central dogma is lines 187-190; the section list is the
 * chapter header (5.1-5.10). No inline_quiz on a chapter_opener.
 */
const { v4: uuid } = require('uuid');

const blocks = [
  {
    id: uuid(),
    type: 'image',
    order: 0,
    src: '',
    alt: 'A single luminous DNA double helix rising like a glowing thread through deep darkness',
    caption: '',
    width: 'full',
    aspect_ratio: '16:5',
    generation_prompt:
      "Ultra-wide cinematic banner (16:5 ratio). A single continuous DNA double helix rendered as a softly glowing, twisting ribbon-ladder rising diagonally from the lower-left of the frame up toward the upper-right, receding into deep darkness at both ends as if it has no beginning and no end. The two sugar-phosphate backbones read as two intertwined luminous strands, the base pairs as faint rungs of light bridging them. A single warm amber light source glows from deep within the coils, catching the helix and fading into an almost-black background (#0a0a0a base tones). Painterly, atmospheric, reverent mood — the molecule looks precious and alive, not clinical. No text, no labels, no letters, no diagram callouts, no cell or laboratory around it, just the helix and darkness.",
  },
  {
    id: uuid(),
    type: 'callout',
    order: 1,
    variant: 'fun_fact',
    title: 'One Molecule Carries the Whole Instruction Manual',
    markdown:
      "Everything you inherited from your parents — every trait Mendel called a 'factor' — is written into a single kind of molecule: **DNA**, deoxyribonucleic acid. It sits coiled inside almost every cell you own, and in most living organisms it is the one substance that decides what gets passed on. This whole chapter is the story of how biologists proved that, cracked open its structure, and worked out exactly how the instructions inside it get read and used.",
  },
  {
    id: uuid(),
    type: 'text',
    order: 2,
    markdown:
      "In the previous chapter you met inheritance as patterns — Mendel's ratios, dominant and recessive characters. But at Mendel's time, nobody knew what those 'factors' actually *were*. What physical thing sat inside a cell and carried a trait from parent to child? That question took almost a hundred years to answer.\n\nThe search narrowed step by step. Work by **Mendel, Walter Sutton, Thomas Hunt Morgan** and many others pointed to the **chromosomes** sitting in the nucleus of most cells — so biologists knew the genetic material lived *there*. But a chromosome is made of both protein and DNA, and for a long time the smart money was on protein. It was only later, through a chain of famous experiments, that the answer became unavoidable: the molecule doing the job is **DNA**. This chapter picks up exactly at that turning point — from 'genes sit on chromosomes' to 'genes are made of DNA'.",
  },
  {
    id: uuid(),
    type: 'heading',
    order: 3,
    level: 2,
    text: 'What This Chapter Walks You Through',
    objective:
      "By the end of the chapter you can trace a single instruction all the way from a DNA sequence to a finished protein — and explain how the cell switches that whole process on and off.",
  },
  {
    id: uuid(),
    type: 'text',
    order: 4,
    markdown:
      "The chapter follows the molecule from its shape to its uses. First you'll build up the **structure of DNA** — the double helix, base pairing, and the clever way an entire two-metre-long thread gets packaged into a nucleus you'd need a microscope to see. Then comes the **search for the genetic material**: the experiments that ruled out protein and settled on DNA, and why DNA (not its cousin RNA) became the preferred molecule for storing information.\n\nWith the molecule understood, you'll watch it work. **Replication** is how DNA copies itself before a cell divides. **Transcription** is how a stretch of DNA is copied into RNA. The **genetic code** is the three-letter dictionary that maps those RNA letters onto amino acids, and **translation** is where that dictionary is used to actually build a protein. This flow — **DNA → RNA → Protein** — is the backbone Francis Crick called the **central dogma**, and it runs through the whole chapter.\n\nFinally, the chapter zooms out. **Regulation of gene expression** explains how a cell decides which genes to switch on and when (using the famous *lac* operon as the model). The **Human Genome Project** is the mega-effort that read every letter of human DNA. And **DNA fingerprinting** shows how the tiny differences between two people's DNA are used to tell them apart — in crime scenes, paternity disputes, and beyond.",
  },
  {
    id: uuid(),
    type: 'callout',
    order: 5,
    variant: 'remember',
    title: 'The Ten Sections Ahead — Your Map for the Chapter',
    markdown:
      "- **5.1 The DNA** — structure of the polynucleotide chain, the double helix, and packaging into chromatin\n- **5.2 The Search for Genetic Material** — Griffith, Avery–MacLeod–McCarty, and Hershey–Chase\n- **5.3 RNA World** — why RNA is thought to be the first genetic material\n- **5.4 Replication** — the semiconservative copying of DNA\n- **5.5 Transcription** — copying a DNA strand into RNA\n- **5.6 Genetic Code** — the triplet dictionary linking bases to amino acids\n- **5.7 Translation** — building a protein on the ribosome\n- **5.8 Regulation of Gene Expression** — the *lac* operon and how genes are switched on and off\n- **5.9 Human Genome Project** — sequencing every base of human DNA\n- **5.10 DNA Fingerprinting** — using DNA differences to identify individuals",
  },
];

module.exports = {
  slug: 'chapter-5-overview',
  title: 'Molecular Basis of Inheritance',
  subtitle:
    "For a hundred years after Mendel, nobody knew what a 'gene' was actually made of. This chapter is the answer — DNA — and the full journey from its double-helix shape to the finished protein it builds.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['molecular-basis-of-inheritance', 'dna', 'central-dogma'],
  glossary: [
    {
      term: 'DNA',
      definition:
        'Deoxyribonucleic acid — a long polymer of deoxyribonucleotides that acts as the genetic material in most organisms, storing the instructions passed from parent to offspring.',
    },
    {
      term: 'gene',
      definition:
        'The functional unit of inheritance; in simple terms, a segment of DNA that codes for an RNA (and usually, in turn, a protein).',
    },
    {
      term: 'central dogma',
      definition:
        'The rule, proposed by Francis Crick, that genetic information flows from DNA to RNA to protein.',
    },
    {
      term: 'nucleotide',
      definition:
        'The repeating building block of a nucleic acid, made of three parts — a nitrogenous base, a pentose sugar, and a phosphate group.',
    },
  ],
  blocks,
};
