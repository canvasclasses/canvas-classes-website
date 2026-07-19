'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'nucleic-acids',
  title: 'Nucleic Acids — DNA & RNA',
  subtitle: "The acid-insoluble fraction hides one more giant molecule. Learn its single repeating brick — a nucleotide with three parts — and you can name every base as a purine or a pyrimidine, and tell DNA from RNA by one sugar.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['biomolecules', 'nucleic-acids'],
  glossary: [
    { term: 'nucleic acid', definition: 'A macromolecule found in the acid-insoluble fraction of any living tissue. It is a polynucleotide — a long chain of nucleotides.' },
    { term: 'polynucleotide', definition: 'A polymer made of many nucleotides joined together. Nucleic acids (DNA and RNA) are polynucleotides.' },
    { term: 'nucleotide', definition: 'The building block of a nucleic acid. It has three chemically distinct components: a nitrogenous base (heterocyclic compound), a sugar (monosaccharide), and a phosphate.' },
    { term: 'nitrogenous base', definition: 'The heterocyclic compound in a nucleotide. The five bases are adenine, guanine, uracil, cytosine and thymine.' },
    { term: 'purine', definition: 'The skeletal double-ring heterocyclic structure. Adenine and guanine are substituted purines.' },
    { term: 'pyrimidine', definition: 'The skeletal single-ring heterocyclic structure. Uracil, cytosine and thymine are substituted pyrimidines.' },
    { term: 'DNA (deoxyribonucleic acid)', definition: 'A nucleic acid whose sugar is deoxyribose (2′-deoxyribose).' },
    { term: 'RNA (ribonucleic acid)', definition: 'A nucleic acid whose sugar is ribose, a pentose monosaccharide.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing double-helix ribbon fading into darkness, with faint suggestions of small paired rungs along its length',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single softly glowing translucent ribbon twists gently like a spiral staircase, fading out of focus into deep darkness on both ends, suggested rather than sharply drawn. Faint paired rungs are hinted along its length like the steps of the staircase, without becoming a literal labelled diagram or any text. Cool blue-green glow against an almost black background (#0a0a0a base tones), deep shadows filling the rest of the frame. Painterly, atmospheric illustration style, no text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Fourth Giant in the Cell',
      markdown: "You have already met three giant molecules of the cell: **polysaccharides** (chains of sugars), **polypeptides** (chains of amino acids — proteins), and now the third and final one. Together, these three make up the **true macromolecular fraction** of any living tissue. The last one is the molecule that carries your genetic information — the **nucleic acid**. And just like the other two, it is built by stringing one tiny brick over and over into a long chain.",
    },
    // ── 2 · Core concept — where it sits, what it is ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "When you grind up a living tissue and separate it, the part that will not dissolve in acid is the **acid-insoluble fraction**. Proteins sit there. So do complex carbohydrates. And so does one more macromolecule — the **nucleic acid**.\n\nNucleic acids are **polynucleotides**. The word tells you the whole story: *poly* means many, so a nucleic acid is many **nucleotides** joined into one long chain. The nucleotide is the single repeating brick. Learn that one brick well, and the rest of this page falls into place.",
    },
    // ── 3 · Heading — the three parts of a nucleotide ─────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Nucleotide — One Brick, Three Parts',
      objective: "By the end of this you can name the three chemically distinct components of every nucleotide, without missing one or adding an extra.",
    },
    // ── 4 · Text — the three components ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A **nucleotide has three chemically distinct components** — remember that number, *three*, exactly. They are:\n\n1. A **heterocyclic compound** — this is the **nitrogenous base**.\n2. A **monosaccharide** — this is the **sugar**.\n3. A **phosphoric acid**, or **phosphate**.\n\nThat's it: **base + sugar + phosphate**. Every nucleotide, in both DNA and RNA, is built from these same three kinds of parts. What changes between them — as you'll see below — is only *which* base and *which* sugar.",
    },
    // ── 5 · Interactive image — nucleotide + purine vs pyrimidine ─────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of a single nucleotide with its phosphate, sugar and nitrogenous base labelled, alongside a two-ring purine base and a one-ring pyrimidine base',
      caption: '📸 Tap each dot to explore the three parts of a nucleotide — and see why a purine ring looks different from a pyrimidine ring.',
      generation_prompt: "Scientific textbook illustration of a single nucleotide with its three components, plus a side-by-side comparison of a purine ring and a pyrimidine ring. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. On the left, one nucleotide drawn as three linked parts in a row: a small phosphate group (shown in blue), joined to a five-sided pentose sugar ring (shown in tan), joined to a flat nitrogenous base (shown in magenta). On the right, two separate base skeletons for comparison: a purine drawn as a fused double ring (two rings sharing an edge), and a pyrimidine drawn as a single six-membered ring, both in white outline. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.5, label: 'Phosphate', detail: "The **phosphoric acid / phosphate** — the first of the nucleotide's three components. In a long chain it is the part that links one nucleotide to the next.", icon: 'circle' },
        { id: uuid(), x: 0.3, y: 0.5, label: 'Sugar (monosaccharide)', detail: "The **monosaccharide** — a pentose (five-carbon) sugar. It is either **ribose** or **2′-deoxyribose**, and this single choice is what decides whether the molecule is RNA or DNA.", icon: 'circle' },
        { id: uuid(), x: 0.48, y: 0.5, label: 'Nitrogenous base', detail: "The **heterocyclic compound**, i.e. the **nitrogenous base**. It is one of five: adenine, guanine, uracil, cytosine or thymine.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.4, label: 'Purine (double ring)', detail: "A **purine** is a skeletal **two-ring** structure. **Adenine and guanine** are substituted purines — the bigger, double-ringed bases.", icon: 'circle' },
        { id: uuid(), x: 0.88, y: 0.62, label: 'Pyrimidine (single ring)', detail: "A **pyrimidine** is a skeletal **single-ring** structure. **Uracil, cytosine and thymine** are substituted pyrimidines — the smaller, single-ringed bases.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — the five bases and their two families ───────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Five Bases — Purines vs Pyrimidines',
      objective: "By the end of this you can sort all five nitrogenous bases into purines or pyrimidines without hesitating.",
    },
    // ── 7 · Text — bases classification ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The heterocyclic compounds in nucleic acids — the nitrogenous bases — are five in number: **adenine, guanine, uracil, cytosine, and thymine**. They split into two families based on the shape of their ring skeleton:\n\n- **Adenine and guanine are substituted purines** — their skeleton is the **purine** ring (a double ring).\n- The other three — **uracil, cytosine and thymine — are substituted pyrimidines** — their skeleton is the **pyrimidine** ring (a single ring).\n\nA quick way to keep the purines straight: **Pure As Gold** — **Pur**ines are **A**denine and **G**uanine. Whatever isn't in that pair is a pyrimidine.",
    },
    // ── 8 · Comparison card — purines vs pyrimidines ──────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Purines vs Pyrimidines',
      columns: [
        { heading: 'Purines', points: [
          'Skeletal ring: purine (a double ring)',
          'Larger, two-ring bases',
          'The two bases: adenine and guanine',
          'Memory hook: "Pure As Gold" → A and G',
        ] },
        { heading: 'Pyrimidines', points: [
          'Skeletal ring: pyrimidine (a single ring)',
          'Smaller, one-ring bases',
          'The three bases: cytosine, uracil and thymine',
          'Everything that is not A or G',
        ] },
      ],
    },
    // ── 9 · Reasoning prompt — classify a base ───────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "You're handed four nitrogenous bases and asked to pick the one that is a PURINE. Which of these is it?",
      options: [
        'Cytosine',
        'Guanine',
        'Uracil',
        'Thymine',
      ],
      reveal: "Guanine is the purine. NCERT states plainly that adenine and guanine are the substituted purines — the double-ringed bases — while the rest are substituted pyrimidines. Cytosine, uracil and thymine are all single-ring pyrimidines, so each of those three is a tempting wrong pick if you haven't locked in that only A and G are purines. The 'Pure As Gold' hook (Purines = Adenine, Guanine) sorts this instantly.",
      difficulty_level: 2,
    },
    // ── 10 · Heading — the sugar decides DNA vs RNA ───────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'One Sugar Decides: DNA or RNA',
      objective: "By the end of this you can name the sugar in each nucleic acid and use it to identify the molecule as DNA or RNA.",
    },
    // ── 11 · Text — ribose vs deoxyribose ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "The sugar in a polynucleotide is a **pentose** — a five-carbon monosaccharide. But there are two possible pentoses, and which one is present names the whole molecule:\n\n- If the sugar is **ribose** → the nucleic acid is **ribonucleic acid (RNA)**.\n- If the sugar is **2′-deoxyribose** → the nucleic acid is **deoxyribonucleic acid (DNA)**.\n\nSo the difference between DNA and RNA, at the level NCERT states here, comes down to a single component of the brick: the **sugar**. The word itself carries the clue — **deoxy**ribose sits in **D**NA.",
    },
    // ── 12 · Comparison card — DNA vs RNA ─────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 12,
      title: 'DNA vs RNA',
      columns: [
        { heading: 'DNA (deoxyribonucleic acid)', points: [
          'Sugar present: 2′-deoxyribose',
          'A polynucleotide, like all nucleic acids',
          'Named after its sugar: DEOXYribo→DNA',
        ] },
        { heading: 'RNA (ribonucleic acid)', points: [
          'Sugar present: ribose (a pentose monosaccharide)',
          'A polynucleotide, like all nucleic acids',
          'Named after its sugar: RIBOnucleic→RNA',
        ] },
      ],
    },
    // ── 13 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Nucleic acids are polynucleotides**, found in the acid-insoluble fraction. With polysaccharides and polypeptides, they form the **true macromolecular fraction** of a cell.\n- A **nucleotide = base + sugar + phosphate** (three chemically distinct components).\n- **Purines = adenine, guanine** (double ring). **Pyrimidines = cytosine, uracil, thymine** (single ring).\n- **Deoxyribose → DNA. Ribose → RNA.** The sugar names the molecule.",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Count the components exactly:** a nucleotide has **three** — base, sugar, phosphate. NEET loves to offer \"two\" or \"four\" as traps.\n\n**Purine vs pyrimidine is the single most-tested split here:** only **adenine and guanine are purines**; cytosine, uracil and thymine are pyrimidines. Use \"Pure As Gold\" (A, G) so you never guess.\n\n**Classic NEET question:** \"The sugar present in RNA is ___\" → **ribose**. Or \"Which of the following is a purine?\" → **adenine / guanine** (never cytosine, uracil or thymine).",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You can now name the brick of every nucleic acid, sort all five bases into purines and pyrimidines, and tell DNA from RNA by its sugar. Next, we turn to proteins — and how a single chain of amino acids folds itself through the four levels of protein structure.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "How many chemically distinct components does a single nucleotide have, and what are they?",
          options: [
            "Two components: a nitrogenous base and a phosphate",
            "Three components: a nitrogenous base, a monosaccharide sugar, and a phosphate",
            "Three components: two nitrogenous bases and one sugar",
            "Four components: a base, a sugar, a phosphate, and an amino acid",
          ],
          correct_index: 1,
          explanation: "NCERT states a nucleotide has three chemically distinct components: a heterocyclic compound (the nitrogenous base), a monosaccharide (the sugar), and a phosphoric acid/phosphate. Two-component and four-component options drop or invent a part, and 'two bases and one sugar' misdescribes the brick — there is only one base per nucleotide, and no amino acid is involved.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which pair of nitrogenous bases are the substituted purines?",
          options: [
            "Cytosine and thymine",
            "Uracil and cytosine",
            "Adenine and guanine",
            "Thymine and adenine",
          ],
          correct_index: 2,
          explanation: "NCERT is explicit: adenine and guanine are substituted purines, while uracil, cytosine and thymine are substituted pyrimidines. Options pairing a purine with a pyrimidine (like thymine and adenine) or listing two pyrimidines (cytosine and thymine; uracil and cytosine) are the traps — only the all-purine pair A and G is correct.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A nucleic acid is analysed and found to contain the sugar deoxyribose. What is this nucleic acid?",
          options: [
            "RNA, because ribose and deoxyribose both point to RNA",
            "DNA, because a nucleic acid containing deoxyribose is deoxyribonucleic acid",
            "A polypeptide, because deoxyribose is an amino acid",
            "A polysaccharide, because deoxyribose is a chain of sugars",
          ],
          correct_index: 1,
          explanation: "NCERT states directly that a nucleic acid containing deoxyribose is called deoxyribonucleic acid (DNA), whereas one containing ribose is RNA. Deoxyribose is a single pentose sugar — not an amino acid and not a chain of sugars — so the polypeptide and polysaccharide options are wrong, and it is deoxyribose (not ribose) that marks DNA.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about nucleic acids matches NCERT exactly?",
          options: [
            "Nucleic acids are polynucleotides that, with polysaccharides and polypeptides, form the true macromolecular fraction of a cell",
            "Nucleic acids are the only macromolecule in the acid-soluble fraction of a tissue",
            "Nucleic acids are monomers built from a single nucleotide joined to an amino acid",
            "Nucleic acids use a hexose sugar, either ribose or deoxyribose",
          ],
          correct_index: 0,
          explanation: "NCERT says nucleic acids are polynucleotides and, together with polysaccharides and polypeptides, comprise the true macromolecular fraction of any living tissue or cell. They sit in the acid-INSOLUBLE fraction (not soluble), they are polymers of many nucleotides (not monomers, and no amino acid is involved), and their sugar is a PENTOSE (five-carbon), not a hexose.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
