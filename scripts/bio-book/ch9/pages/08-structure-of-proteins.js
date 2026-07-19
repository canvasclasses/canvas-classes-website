'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'structure-of-proteins',
  title: 'The Four Levels of Protein Structure',
  subtitle: "A protein is a string of amino acids that then folds, twists, and clumps into a working 3-D shape. Biologists describe that shape at four levels — and NEET tests all four, most often with haemoglobin's famous 2α + 2β.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['biomolecules', 'proteins', 'protein-structure'],
  glossary: [
    { term: 'primary structure', definition: 'The sequence of amino acids in a protein — the positional information saying which amino acid is first, which is second, and so on.' },
    { term: 'N-terminal', definition: 'The first amino acid of a protein. If the protein is drawn as a line, it sits at the left end.' },
    { term: 'C-terminal', definition: 'The last amino acid of a protein. If the protein is drawn as a line, it sits at the right end.' },
    { term: 'secondary structure', definition: 'The way portions of the protein thread fold into regular shapes — a helix (like a revolving staircase) or a beta-pleated sheet.' },
    { term: 'helix', definition: 'A coiled, staircase-like fold in part of the protein thread. In proteins, only right-handed helices are observed.' },
    { term: 'tertiary structure', definition: 'The long protein chain folded upon itself like a hollow woollen ball, giving the protein its 3-dimensional shape. This structure is absolutely necessary for the many biological activities of proteins.' },
    { term: 'quaternary structure', definition: 'The way two or more folded polypeptides (subunits) are arranged with respect to each other in a protein made of more than one chain.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing protein ribbon coiling and folding from a straight thread into a rounded three-dimensional ball, set against deep darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single softly glowing translucent protein ribbon is shown mid-transformation across the frame: on the left it begins as an almost straight thread of tiny beads, then coils into a gentle spiral, then folds and clumps into a rounded three-dimensional ball shape on the right — suggesting a chain becoming a working structure. Warm amber and pale blue highlights trace the ribbon against deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Same Beads, A Different Shape, A Different Job',
      markdown: "Think of a long string of coloured beads. The order of the beads is fixed — but the string itself can lie flat, coil up, or ball up in your hand. A protein is exactly like this. It starts as one fixed line of amino acids, and then that line folds. And here's the part that matters: the protein only does its job **after** it has folded into the right shape. The order of the beads decides everything that comes next.",
    },
    // ── 2 · Core concept — proteins are described at four levels ──────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You already know a protein is a **heteropolymer** — a long chain built from strings of **amino acids** joined together. But saying \"it's a chain of amino acids\" doesn't tell you what the protein actually looks like or how it works. So biologists describe a protein's structure at **four levels**, each one a bigger-picture view than the last: **primary**, **secondary**, **tertiary**, and **quaternary**.\n\nDon't think of these as four separate proteins. Think of them as four zoom levels on the *same* protein — from the plain list of its parts, all the way up to the finished, folded, working molecule.",
    },
    // ── 3 · Heading — Primary structure ──────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Level 1 — Primary Structure: The Order of the Amino Acids',
      objective: "By the end of this you can say what the primary structure is, and name the two ends of a protein line — which is the N-terminal and which is the C-terminal.",
    },
    // ── 4 · Text — primary, N- and C-terminal ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **primary structure** is the **sequence of amino acids** in a protein — the **positional information**. It answers a simple question: which amino acid is first, which is second, which is third, and so on down the chain.\n\nTo picture it, imagine the protein as a straight **line**. The **left end** is the first amino acid, and the **right end** is the last one. These two ends have names you must not mix up:\n\n- The **first** amino acid (left end) is the **N-terminal amino acid**.\n- The **last** amino acid (right end) is the **C-terminal amino acid**.\n\nThat's the whole of the primary structure — just the order, and its two labelled ends. Nothing here is folded yet.",
    },
    // ── 5 · Heading — Secondary structure ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Level 2 — Secondary Structure: The Thread Starts to Fold',
      objective: "By the end of this you can describe the two shapes the protein thread folds into, and state the one rule about which way the helix turns.",
    },
    // ── 6 · Text — secondary: helix + beta sheet ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "A protein thread does **not** stay stretched out as a straight, rigid rod. Some portions of it fold into a **helix** — picture a **revolving staircase** winding upward. Only *some* stretches of the thread take this helical shape, not the whole thing.\n\nThere's one rule about the helix that NEET loves: **in proteins, only right-handed helices are observed.** A left-handed helix does not occur.\n\nOther regions of the thread fold into a different shape called the **beta-pleated sheet**. Together, these folded stretches — the helix and the beta-pleated sheet — make up the **secondary structure**.",
    },
    // ── 7 · Heading — Tertiary structure ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Level 3 — Tertiary Structure: The Whole Chain Balls Up',
      objective: "By the end of this you can describe the tertiary fold and say why it is the level that actually makes a protein work.",
    },
    // ── 8 · Text — tertiary ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Now zoom out further. The long protein chain is folded **upon itself** like a **hollow woollen ball**. This gives us the full **3-dimensional view** of the protein — its **tertiary structure**.\n\nHere is the line to underline: **the tertiary structure is absolutely necessary for the many biological activities of proteins.** In other words, a protein doesn't do its job as a flat thread or a loose coil — it works only once it has folded into this final 3-D ball shape.",
    },
    // ── 9 · Heading — Quaternary structure ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Level 4 — Quaternary Structure: When Several Chains Team Up',
      objective: "By the end of this you can explain what quaternary structure is and give NCERT's example — the four subunits of adult human haemoglobin.",
    },
    // ── 10 · Text — quaternary + haemoglobin ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Some proteins aren't one chain at all — they're an **assembly of more than one polypeptide**, and each folded chain in the assembly is called a **subunit**. The way these individual folded subunits are **arranged with respect to each other** is the **quaternary structure**. They might sit in a line (a linear string of spheres), or stack up like a cube or a plate — that arrangement is what this level describes.\n\nNCERT's example to memorise: **adult human haemoglobin** consists of **4 subunits**. Two of them are one type and two are another — so it's built from **two subunits of α type and two subunits of β type**, together making the haemoglobin molecule (**2α + 2β**).",
    },
    // ── 11 · Interactive image — the four levels ─────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'A four-panel diagram showing the same protein at primary, secondary, tertiary, and quaternary levels of structure',
      caption: '📸 Tap each dot to explore the four levels of protein structure',
      generation_prompt: "Scientific textbook illustration of the four levels of protein structure, shown as four labelled panels arranged left to right or in a 2x2 grid. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Panel (a) Primary: a straight horizontal line of small linked beads representing the amino-acid sequence, with the leftmost bead marked as the first amino acid and the rightmost bead as the last. Panel (b) Secondary: two shapes — a coiled right-handed helix (like a revolving staircase) and a flat zig-zag beta-pleated sheet. Panel (c) Tertiary: the chain folded upon itself into a compact rounded hollow-woollen-ball 3-D shape. Panel (d) Quaternary: four separate folded ball-shaped subunits clustered together, two shaded one way and two shaded another, representing haemoglobin's two alpha and two beta subunits. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.08, y: 0.28, label: 'N-terminal', detail: "The **first** amino acid of the protein — the left end of the line. Its name uses **N**.", icon: 'circle' },
        { id: uuid(), x: 0.38, y: 0.28, label: 'C-terminal', detail: "The **last** amino acid of the protein — the right end of the line. Its name uses **C**.", icon: 'circle' },
        { id: uuid(), x: 0.18, y: 0.68, label: 'Alpha-helix (right-handed only)', detail: "A portion of the thread coiled like a revolving staircase. In proteins, **only right-handed helices** are observed. Part of the secondary structure.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.68, label: 'Beta-pleated sheet', detail: "Other regions of the thread fold into this flat, pleated shape. It is the other form of the secondary structure, alongside the helix.", icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.30, label: 'Tertiary fold', detail: "The long chain folded upon itself like a **hollow woollen ball**, giving the 3-D shape. This fold is **absolutely necessary** for the protein's biological activities.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.72, label: 'Quaternary subunits', detail: "Several folded subunits arranged together. Adult human haemoglobin = **4 subunits: 2α + 2β**.", icon: 'circle' },
      ],
    },
    // ── 12 · Table — the four levels side by side ────────────────────────────
    {
      id: uuid(), type: 'table', order: 12,
      caption: 'The four levels of protein structure, side by side',
      headers: ['Level', 'What it is', 'Key fact to remember'],
      rows: [
        ['Primary', 'The sequence (order) of amino acids in the chain', 'First amino acid = N-terminal (left end); last = C-terminal (right end)'],
        ['Secondary', 'Portions of the thread folded into a helix or a beta-pleated sheet', 'In proteins, only right-handed helices are observed'],
        ['Tertiary', 'The whole chain folded upon itself like a hollow woollen ball (3-D shape)', 'Absolutely necessary for the many biological activities of proteins'],
        ['Quaternary', 'The arrangement of two or more folded subunits with respect to each other', 'Adult human haemoglobin = 4 subunits: 2α + 2β'],
      ],
    },
    // ── 13 · Reasoning prompt — which level? ─────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 13, reasoning_type: 'logical',
      prompt: "Adult human haemoglobin is built from two α subunits and two β subunits arranged together into one working molecule. This feature — several separate folded chains assembled with respect to each other — illustrates which level of protein structure?",
      options: [
        "Quaternary structure",
        "Tertiary structure",
        "Secondary structure",
        "Primary structure",
      ],
      reveal: "The answer is **quaternary structure**. Quaternary structure is the one level that only appears when a protein is an assembly of **more than one** polypeptide (subunit), describing how those subunits are arranged together — and haemoglobin's 2α + 2β is NCERT's exact example of it. The most tempting wrong pick is **tertiary**, but tertiary describes a **single** chain folded upon itself into a hollow-woollen-ball 3-D shape — it stops at one chain and never involves multiple subunits joining. Secondary (helix / beta-pleated sheet) and primary (the amino-acid sequence) are lower levels within a single chain, not the assembly of several.",
      difficulty_level: 2,
    },
    // ── 14 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **The four levels, in order:** Primary → Secondary → Tertiary → Quaternary.\n- **Primary** = sequence of amino acids. First amino acid = **N-terminal** (left end); last = **C-terminal** (right end).\n- **Secondary** = helix + beta-pleated sheet. **Only right-handed helices** occur in proteins.\n- **Tertiary** = the chain folded like a **hollow woollen ball** (3-D shape). It is **absolutely necessary for the biological activities** of proteins.\n- **Quaternary** = arrangement of **more than one** subunit. **Adult human haemoglobin = 4 subunits: 2α + 2β.**",
    },
    // ── 15 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Primary structure = the amino-acid sequence.** If a question describes \"the positional information\" or \"which amino acid is first, second, third,\" the answer is primary — every time.\n\n**The N-terminal / C-terminal trap:** the **first** amino acid is the **N-terminal**, the **last** is the **C-terminal**. NEET likes to swap these.\n\n**Only right-handed helices** are found in proteins — a \"left-handed helix\" option is always a plant.\n\n**Classic NEET question:** \"The quaternary structure of adult human haemoglobin has how many subunits?\" → **four — two α and two β (2α + 2β).** A close cousin: \"Which level is the sequence of amino acids?\" → **primary.**",
    },
    // ── 16 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 16,
      markdown: "So a protein is a folded chain, and the folded shape is what makes it work. Next, you'll meet a special group of proteins whose folded shape lets them speed up the chemical reactions of life — the **enzymes**.",
    },
    // ── 17 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "The sequence of amino acids in a protein — the positional information saying which amino acid is first, second, and so on — is called its:",
          options: [
            "Primary structure",
            "Secondary structure",
            "Tertiary structure",
            "Quaternary structure",
          ],
          correct_index: 0,
          explanation: "The primary structure is exactly the sequence, or positional information, of amino acids. Secondary is the folding of stretches into a helix or beta-pleated sheet, tertiary is the whole chain balled up into a 3-D shape, and quaternary is the arrangement of several subunits — none of those is the plain order of amino acids.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In a protein drawn as a line, the first amino acid and the last amino acid are named, in order:",
          options: [
            "N-terminal (first) and C-terminal (last)",
            "C-terminal (first) and N-terminal (last)",
            "Alpha-terminal (first) and beta-terminal (last)",
            "Primary-terminal (first) and secondary-terminal (last)",
          ],
          correct_index: 0,
          explanation: "The first amino acid, at the left end of the line, is the N-terminal; the last, at the right end, is the C-terminal. Option 2 reverses them — the exact swap examiners set as a trap. The alpha/beta and primary/secondary labels in the other options are borrowed from other parts of the topic and are not names for the ends of the chain.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which statement about the helix in a protein's secondary structure is correct?",
          options: [
            "Both right-handed and left-handed helices occur equally in proteins",
            "In proteins, only right-handed helices are observed",
            "In proteins, only left-handed helices are observed",
            "The helix is the same thing as the hollow woollen ball of the tertiary structure",
          ],
          correct_index: 1,
          explanation: "NCERT states plainly that in proteins only right-handed helices are observed, so option 2 is right and options 1 and 3 are wrong. Option 4 confuses two different levels: the helix (a revolving-staircase coil) belongs to the secondary structure, while the hollow-woollen-ball fold is the tertiary structure.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Adult human haemoglobin is made of 4 subunits arranged together. This assembly, and the count of its subunits, is:",
          options: [
            "Tertiary structure; 2 subunits, one α and one β",
            "Secondary structure; 4 subunits, all of α type",
            "Quaternary structure; 4 subunits, two of α type and two of β type",
            "Primary structure; 4 subunits, two of α type and two of β type",
          ],
          correct_index: 2,
          explanation: "Haemoglobin is NCERT's example of quaternary structure — the arrangement of more than one subunit — and it has 4 subunits: two α and two β (2α + 2β). Tertiary describes a single chain, not an assembly, and the count is wrong in option 1; secondary and primary are lower single-chain levels, and option 2 also miscounts the subunit types.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
