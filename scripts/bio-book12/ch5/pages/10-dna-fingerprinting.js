'use strict';
/**
 * Class 12 Biology — Chapter 5 (Molecular Basis of Inheritance)
 * Page 10 — DNA Fingerprinting. Closing page of the chapter.
 *
 * Every fact traces to NCERT lebo105.txt §5.10 (Rule 0):
 *  - 99.9% identical / 0.1% differences make each individual unique — lines 1184-1194
 *  - repetitive DNA, satellite DNA via density-gradient centrifugation, micro/mini-satellite,
 *    non-coding, high polymorphism, tissue-independence, paternity basis — lines 1195-1211
 *  - what DNA polymorphism means (mutation, germ cell, frequency > 0.01, non-coding) — lines 1212-1242
 *  - Alec Jeffreys, VNTR, Southern blot, the six steps — lines 1243-1255
 *  - VNTR = mini-satellite, 0.1–20 kb, bands, monozygotic-twin exception, PCR, applications — lines 1259-1286
 */
const { v4: uuid } = require('uuid');

const blocks = [
  {
    id: uuid(),
    type: 'image',
    order: 0,
    src: '',
    alt: 'A glowing DNA autoradiogram gel — columns of pale horizontal bands rising out of darkness',
    caption: '',
    width: 'full',
    aspect_ratio: '16:5',
    generation_prompt:
      "Ultra-wide cinematic banner (16:5 ratio). Several vertical lanes of a DNA fingerprint autoradiogram floating in deep darkness — each lane a column of soft, glowing pale-grey and white horizontal bands of different thicknesses and heights, like a barcode made of light. The lanes are unequal to one another, so the patterns clearly differ lane to lane, except two lanes near the centre that match perfectly. A faint cool-blue glow rises from behind the gel, fading into an almost-black background (#0a0a0a base tones). Painterly, atmospheric, forensic mood — the bands look precious and evidentiary. No text, no labels, no letters, no numbers, no rulers, no molecules, just the glowing bands and darkness.",
  },
  {
    id: uuid(),
    type: 'callout',
    order: 1,
    variant: 'fun_fact',
    title: 'No Two People Wear the Same DNA Barcode',
    markdown:
      "Take any two people on Earth, run this test, and their patterns of bands come out different — a barcode nobody else carries. There is exactly one exception: **identical (monozygotic) twins**, who started from the same fertilised egg and so share the same pattern. And the barcode does not depend on which body part you sample. Blood, a hair follicle, skin, bone, saliva, a single sperm cell — DNA from any tissue of the same person gives the very same pattern. That is why a bloodstain at a crime scene can be matched to the person it came from.",
  },
  {
    id: uuid(),
    type: 'text',
    order: 2,
    markdown:
      "Here is the starting fact that makes all of this possible: across all humans, **99.9 per cent** of the DNA base sequence is identical. Your DNA and a stranger's are the same at nearly every letter. Everything that makes you look and be *you* is hidden in the tiny remaining **0.1 per cent**. With a human genome of about 3 × 10⁹ base pairs, that 0.1 per cent still adds up to millions of differing positions — but reading out all three billion letters for every person you want to compare would be slow and hugely expensive.\n\n**DNA fingerprinting** is the shortcut. Instead of sequencing the whole genome, it zooms in on a few specific regions where the differences between people are largest, and reads only those. It is a very quick way to compare the DNA of any two individuals.",
  },
  {
    id: uuid(),
    type: 'heading',
    order: 3,
    level: 2,
    text: 'Where the Differences Hide — Repetitive Satellite DNA and VNTR',
    objective:
      "By the end of this you can explain what makes a stretch of DNA useful for fingerprinting — repetitive, non-coding, and highly variable in copy number.",
  },
  {
    id: uuid(),
    type: 'text',
    order: 4,
    markdown:
      "The test targets **repetitive DNA** — regions where a small stretch of DNA is repeated many, many times over. If you spin genomic DNA in a **density gradient centrifuge**, the bulk of the DNA settles as one big major peak, and these repetitive stretches separate out as small side peaks. Those small peaks are called **satellite DNA**. Depending on their base composition (A:T-rich or G:C-rich), the length of the repeated segment, and how many repeat units they contain, satellite DNA is sorted into classes such as **micro-satellites** and **mini-satellites**.\n\nTwo features make satellite DNA perfect for this job. First, these sequences **normally do not code for any protein** — yet they make up a large portion of the human genome. Second, they show a **high degree of polymorphism**: they vary a great deal from one person to the next. That variation is the whole basis of DNA fingerprinting. And because it is **inherited** from parents to children, the same test also settles **paternity** disputes.\n\nPolymorphism just means variation at the genetic level, and it comes from **mutations**. A mutation in a germ cell (the cells that make gametes) that doesn't stop a person from having children can be passed on and spread through a population. Formally, a site is called a **DNA polymorphism** when more than one variant (allele) exists at that locus in the population at a frequency greater than 0.01 — in plain terms, an inherited change common enough to keep showing up. Such variation is far more likely in **non-coding** DNA, because a change there usually has no effect on the person, so it survives and quietly piles up generation after generation.",
  },
  {
    id: uuid(),
    type: 'heading',
    order: 5,
    level: 2,
    text: 'How the Test Is Actually Run — Six Steps',
    objective:
      "By the end of this you can list the six steps of DNA fingerprinting in the correct order, from isolating DNA to reading the bands.",
  },
  {
    id: uuid(),
    type: 'text',
    order: 6,
    markdown:
      "The technique was first developed by **Alec Jeffreys**. He used a piece of satellite DNA that varies enormously between people as his **probe** — a labelled sequence that seeks out and sticks to its matching region in a sample. He named this highly variable satellite the **VNTR — Variable Number of Tandem Repeats**. A VNTR is a short sequence repeated head-to-tail (tandemly) many times, and the *number* of those repeats differs from chromosome to chromosome and from person to person. It belongs to the **mini-satellite** class, and its size ranges from about **0.1 to 20 kb**.\n\nThe original method was **Southern blot hybridisation** using a radiolabelled VNTR probe, and it runs in six steps:\n\n1. **Isolation of DNA** from the sample cells.\n2. **Digestion of DNA** by restriction endonucleases (molecular scissors that cut it into fragments).\n3. **Separation of the fragments by electrophoresis** — an electric field pulls them through a gel, sorting them by size.\n4. **Blotting** — the separated fragments are transferred onto a synthetic membrane such as nitrocellulose or nylon.\n5. **Hybridisation** using the labelled VNTR probe, which binds only to the VNTR regions.\n6. **Detection by autoradiography** — the labelled probe exposes a film, revealing the bands.\n\nBecause the copy number of the VNTR varies, the probe lights up **many bands of different sizes**. That set of bands is the characteristic pattern for one individual — it differs from person to person, except in identical twins. Modern versions add **PCR** to amplify the DNA first, so that even a **single cell** now contains enough DNA to run the whole analysis.",
  },
  {
    id: uuid(),
    type: 'interactive_image',
    order: 7,
    src: '',
    alt: 'Vertical flowchart of the six steps of DNA fingerprinting, from DNA isolation down to autoradiography and the banded gel',
    caption: '📸 Tap each dot to walk down the six steps of DNA fingerprinting in order (Figure 5.16)',
    generation_prompt:
      "Scientific textbook illustration of the DNA fingerprinting workflow as a top-to-bottom flowchart. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, thin white leader lines, biologically accurate. Six stages stacked vertically, connected by downward arrows: (1) at the top, a cell with a purple DNA double helix being drawn out of it — DNA isolation; (2) the long DNA strand being cut into short fragments by small scissor-like restriction-enzyme symbols; (3) a rectangular gel slab with fragments migrating downward into separated horizontal bands (electrophoresis), fragments purple; (4) the gel pressed against a flat membrane sheet with upward transfer arrows (blotting); (5) small labelled Y-shaped or star-tagged VNTR probe pieces binding onto specific bands on the membrane (hybridisation); (6) at the bottom, a dark photographic film showing a column of pale horizontal bands of varying thickness — the autoradiogram. Use purple for nucleic acid, blue accents for equipment. No baked-in text labels, no numbers, no photorealism, no cartoon, no mascots.",
    hotspots: [
      { id: uuid(), x: 0.5, y: 0.09, label: 'Step 1 — Isolation of DNA', icon: 'circle',
        detail: 'DNA is extracted from the sample cells. It can come from **any tissue** — blood, hair follicle, skin, bone, saliva, sperm — because every tissue of one person carries the same pattern.' },
      { id: uuid(), x: 0.5, y: 0.26, label: 'Step 2 — Digestion by restriction enzymes', icon: 'circle',
        detail: 'The long DNA is cut into fragments by **restriction endonucleases** — enzymes that act as molecular scissors, chopping the DNA at specific points.' },
      { id: uuid(), x: 0.5, y: 0.43, label: 'Step 3 — Separation by electrophoresis', icon: 'circle',
        detail: 'The fragments are pulled through a gel by an electric field. Smaller fragments travel farther, so the pieces get **sorted by size** into a ladder.' },
      { id: uuid(), x: 0.5, y: 0.60, label: 'Step 4 — Blotting onto a membrane', icon: 'circle',
        detail: 'The separated fragments are transferred (blotted) from the gel onto a **synthetic membrane** such as nitrocellulose or nylon. This is the "Southern blot".' },
      { id: uuid(), x: 0.5, y: 0.77, label: 'Step 5 — Hybridisation with the VNTR probe', icon: 'circle',
        detail: 'A **labelled VNTR probe** is washed over the membrane. It binds only to the VNTR regions among all the fragments, tagging exactly the variable spots.' },
      { id: uuid(), x: 0.5, y: 0.93, label: 'Step 6 — Detection by autoradiography', icon: 'circle',
        detail: 'The labelled probe exposes a photographic film, producing an **autoradiogram** — the set of bands of differing sizes that forms the person\'s unique pattern.' },
    ],
  },
  {
    id: uuid(),
    type: 'reasoning_prompt',
    order: 8,
    reasoning_type: 'logical',
    prompt:
      "DNA fingerprinting deliberately reads repetitive, non-coding satellite DNA (the VNTRs) rather than actual genes. Why is non-coding DNA the better choice for telling two people apart?",
    options: [
      "Because genes are the same in every human, while non-coding regions accumulate far more inherited variation between people",
      "Because non-coding DNA codes for more proteins, so it carries more information",
      "Because genes cannot be cut by restriction enzymes, so they can never be separated on a gel",
      "Because only non-coding DNA is present in blood, hair and saliva, whereas genes are found only in the nucleus",
    ],
    reveal:
      "The first option is right. A mutation in non-coding DNA usually has no effect on the person, so it survives and piles up generation after generation, making these regions highly polymorphic — exactly the variation you need to separate individuals. The tempting wrong choice is the second: non-coding DNA does NOT code for proteins at all (that's what 'non-coding' means) — its usefulness comes from being variable and expendable, not from carrying extra protein information.",
    difficulty_level: 2,
  },
  {
    id: uuid(),
    type: 'callout',
    order: 9,
    variant: 'remember',
    title: 'Lock These In',
    markdown:
      "- **99.9%** of human DNA is identical; the **0.1%** difference is what fingerprinting reads.\n- The variable target is **VNTR — Variable Number of Tandem Repeats** — a **mini-satellite**, size **0.1–20 kb**, **non-coding**, highly **polymorphic**.\n- Satellite DNA is separated as small peaks by **density gradient centrifugation**.\n- Technique developed by **Alec Jeffreys**, using **Southern blot hybridisation** with a radiolabelled VNTR probe.\n- The six steps in order: **Isolation → Digestion (restriction enzymes) → Electrophoresis → Blotting → Hybridisation (VNTR probe) → Autoradiography.**\n- Pattern differs for everyone **except monozygotic (identical) twins**. **PCR** now lets a **single cell** be enough.\n- Uses: **forensics, paternity testing, population and genetic diversity** studies.",
  },
  {
    id: uuid(),
    type: 'callout',
    order: 10,
    variant: 'exam_tip',
    title: 'What NEET Lifts Straight From This Section',
    markdown:
      "**VNTR:** know the full form — **Variable Number of Tandem Repeats** — and that it is a **mini-satellite**, non-coding, size range **0.1–20 kb**. NEET loves this expansion.\n\n**The step order:** examiners scramble the six steps and ask you to reorder them. Memorise **Isolation → Digestion → Electrophoresis → Blotting → Hybridisation → Autoradiography**. A classic trap swaps blotting and hybridisation.\n\n**Names:** **Alec Jeffreys** developed the technique; **Southern blotting** is the transfer step; the reading step is **autoradiography**.\n\n**Twin exception:** the pattern is identical only in **monozygotic twins** — a favourite one-word answer.\n\n**Classic NEET question:** \"The technique of DNA fingerprinting was developed by — ?\" → **Alec Jeffreys.**",
  },
  {
    id: uuid(),
    type: 'text',
    order: 11,
    markdown:
      "And that closes Chapter 5. You started with an unknown 'factor' Mendel could only infer, and you finish holding the whole molecular story — the double helix and its packaging, the experiments that proved DNA is the genetic material, replication, transcription, the genetic code, translation, how genes are switched on and off, the reading of the entire human genome, and now the tiny 0.1% differences that let us tell one person from another. That is the molecular basis of inheritance, end to end.",
  },
  {
    id: uuid(),
    type: 'inline_quiz',
    order: 12,
    pass_threshold: 0.67,
    questions: [
      {
        id: uuid(),
        question: "What is the correct order of steps in DNA fingerprinting (Southern blot method)?",
        options: [
          "Isolation → Electrophoresis → Digestion → Hybridisation → Blotting → Autoradiography",
          "Digestion → Isolation → Blotting → Electrophoresis → Autoradiography → Hybridisation",
          "Isolation → Digestion → Electrophoresis → Blotting → Hybridisation → Autoradiography",
          "Isolation → Digestion → Blotting → Electrophoresis → Autoradiography → Hybridisation",
        ],
        correct_index: 2,
        explanation:
          "The DNA must first be cut into fragments (digestion) before it can be sorted by size (electrophoresis), and it must be sorted before it is transferred to a membrane (blotting) — so the order is Isolation → Digestion → Electrophoresis → Blotting → Hybridisation → Autoradiography. The common trap is putting electrophoresis before digestion: uncut, full-length DNA cannot be separated into a band ladder.",
        difficulty_level: 2,
      },
      {
        id: uuid(),
        question: "VNTR, the sequence used as a probe in DNA fingerprinting, stands for:",
        options: [
          "Viral Nucleic Terminal Region",
          "Variable Number of Tandem Repeats",
          "Variable Nucleotide Transfer RNA",
          "Various Non-coding Transcribed Regions",
        ],
        correct_index: 1,
        explanation:
          "VNTR = Variable Number of Tandem Repeats — a short sequence repeated head-to-tail many times, whose repeat count varies between people. The tempting distractor mixes in 'transfer RNA', but VNTR is a stretch of non-coding satellite DNA, not any kind of RNA.",
        difficulty_level: 1,
      },
      {
        id: uuid(),
        question: "DNA fingerprinting targets repetitive, non-coding satellite DNA rather than genes mainly because such regions:",
        options: [
          "Are the only parts of DNA that can be copied by PCR",
          "Code for the proteins that determine physical appearance",
          "Are present in identical twins but absent in everyone else",
          "Show a high degree of polymorphism, differing greatly from one person to the next",
        ],
        correct_index: 3,
        explanation:
          "Satellite DNA is highly polymorphic — it varies enormously between individuals — which is exactly what lets the test tell people apart. The last option is a classic trap: these sequences are non-coding, so they do NOT code for proteins; their value is their variability, not any protein product.",
        difficulty_level: 2,
      },
      {
        id: uuid(),
        question: "The banding pattern from DNA fingerprinting is the same in two people only when they are:",
        options: [
          "Monozygotic (identical) twins",
          "Dizygotic (fraternal) twins",
          "A parent and their child",
          "Siblings born a year apart",
        ],
        correct_index: 0,
        explanation:
          "Monozygotic twins arise from a single fertilised egg, so they carry the same DNA and the same band pattern. A parent and child, or ordinary siblings, share only half their variable sequences on average — their patterns overlap but are not identical, which is precisely why the test can still be used for paternity disputes.",
        difficulty_level: 2,
      },
    ],
  },
];

module.exports = {
  slug: 'dna-fingerprinting',
  title: 'DNA Fingerprinting',
  subtitle:
    "Everyone's DNA is 99.9% the same — so this test reads only the tiny 0.1% that differs, turning it into a barcode that tells one person from another in crime scenes and paternity disputes.",
  page_number: 10,
  page_type: 'lesson',
  tags: ['molecular-basis-of-inheritance', 'dna-fingerprinting', 'vntr'],
  glossary: [
    {
      term: 'DNA fingerprinting',
      definition:
        'A quick technique to compare the DNA of two individuals by reading a few highly variable regions instead of the whole genome, producing a band pattern unique to each person (except identical twins).',
    },
    {
      term: 'polymorphism',
      definition:
        'Variation at the genetic level; formally, a site where more than one allele occurs in the population at a frequency above 0.01. It arises from inherited mutations and is highest in non-coding DNA.',
    },
    {
      term: 'VNTR',
      definition:
        'Variable Number of Tandem Repeats — a short DNA sequence repeated head-to-tail many times, whose repeat number varies between people. It is a mini-satellite, 0.1–20 kb in size, and is used as the probe in DNA fingerprinting.',
    },
    {
      term: 'satellite DNA',
      definition:
        'Repetitive DNA that separates from bulk genomic DNA as small peaks during density gradient centrifugation. It is non-coding, highly polymorphic, and classed by base composition and repeat number into micro-satellites, mini-satellites, etc.',
    },
    {
      term: 'Southern blotting',
      definition:
        'The step in which DNA fragments separated by electrophoresis are transferred (blotted) from the gel onto a synthetic membrane such as nitrocellulose or nylon, ready for probe hybridisation.',
    },
    {
      term: 'probe',
      definition:
        'A labelled DNA sequence (here, a radiolabelled VNTR) that binds to its matching region in the sample so that region can be detected — in fingerprinting, it lights up the VNTR bands on the autoradiogram.',
    },
    {
      term: 'autoradiography',
      definition:
        'The detection step where the radiolabelled probe exposes a photographic film, revealing the bands of hybridised DNA fragments that make up the individual\'s fingerprint pattern.',
    },
  ],
  blocks,
};
