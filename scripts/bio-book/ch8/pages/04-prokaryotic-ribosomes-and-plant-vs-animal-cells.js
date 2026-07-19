'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'prokaryotic-ribosomes-and-plant-vs-animal-cells',
  title: 'Prokaryotic Ribosomes and Plant vs Animal Cells',
  subtitle: "A 70S ribosome is really two subunits working as one protein-making machine — and once you know that, you're ready to walk into the eukaryotic cell and spot exactly what makes a plant cell a plant cell.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'ribosomes', 'plant-cell', 'animal-cell'],
  glossary: [
    { term: 'ribosome', definition: 'A cell structure made of two subunits that is the site of protein synthesis. In prokaryotes it stays attached to the plasma membrane.' },
    { term: 'polyribosome (polysome)', definition: 'A chain formed when several ribosomes attach to a single mRNA strand at once, all translating that same mRNA into protein.' },
    { term: 'inclusion body', definition: 'Reserve material stored free in the cytoplasm of a prokaryotic cell, not enclosed by any membrane — e.g. phosphate granules, cyanophycean granules, glycogen granules.' },
    { term: 'gas vacuole', definition: 'A cytoplasmic space found in blue-green and purple and green photosynthetic bacteria.' },
    { term: 'centriole', definition: 'A cytoskeletal structure found in almost all animal cells but absent in almost all plant cells.' },
    { term: 'large central vacuole', definition: "A big fluid-filled sac in a plant cell, absent in animal cells." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark scene of countless tiny glowing specks strung along a single thread on one side, opening into two large translucent cell silhouettes on the other',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Left half of the frame: a single curving thread stretched through dark space with many small glowing bead-like specks strung along its length, like pearls on a string, suggesting countless tiny machines at work on one strand. The thread and specks dissolve gradually into the right half of the frame, which opens into two large softly glowing translucent cell-shaped silhouettes floating side by side in the dark — one faintly edged in a warm green tint, the other faintly edged in a warm pink tint, both softly lit from within without revealing literal labelled detail. No text, no labels, no diagram elements, no people. Deep dusk lighting, painterly illustration style, dark background tones throughout (#0a0a0a base).",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Instruction, Read by a Whole Crowd at Once',
      markdown: "A single strand of mRNA doesn't wait for one ribosome to finish before the next one starts. Several ribosomes can attach to that same strand at the same time, one behind the other, each one reading and translating it into protein simultaneously. NCERT calls this chain a **polyribosome**, or **polysome** — and it's the reason a prokaryotic cell can turn out proteins so fast from a single piece of genetic instruction.",
    },
    // ── 2 · Text — ribosome structure and function ───────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In prokaryotes, **ribosomes are associated with the plasma membrane** of the cell — you'll find them studded along the inner face of the membrane, not floating loose. Each one is tiny, about **15 nm by 20 nm** in size, and it isn't a single solid particle. It's built from **two subunits — a 50S unit and a 30S unit** — and only when these two come together do you get the complete **70S prokaryotic ribosome**.\n\nRibosomes exist for one job: they are the **site of protein synthesis**. And they rarely work alone. **Several ribosomes may attach to a single mRNA** strand and form a chain called a **polyribosome or polysome** — the ribosomes strung along that one polysome all **translate the same mRNA into proteins**, together.",
    },
    // ── 3 · Heading — Inclusion bodies ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Inclusion Bodies — Reserve Material With No Membrane Around It',
      objective: "By the end of this you can say exactly what makes an inclusion body different from every membrane-bound structure you've studied so far.",
    },
    // ── 4 · Text — inclusion bodies + gas vacuoles ────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A prokaryotic cell still needs to store reserve material, and it does this in the cytoplasm in the form of **inclusion bodies**. The one detail worth locking in: these **are not bound by any membrane system** — they simply **lie free in the cytoplasm**, with nothing wrapping around them. Examples NCERT gives are **phosphate granules, cyanophycean granules, and glycogen granules**.\n\nOne more inclusion worth knowing by name: **gas vacuoles**, found specifically in **blue-green and purple and green photosynthetic bacteria**.",
    },
    // ── 5 · Reasoning prompt — polysome concept ───────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A single mRNA strand has five ribosomes attached to it at once, all actively translating it. A student says this means five completely different proteins are being made from five different genetic messages. What's wrong with that reasoning?",
      options: [
        "Nothing is wrong — each ribosome on a polysome reads a different, unrelated mRNA",
        "All five ribosomes are attached to the same single mRNA strand, so they are all translating that one message into protein together, not five different messages",
        "Only one of the five ribosomes is actually functional; the other four are just structurally attached without translating anything",
        "A polysome can only form when the ribosomes are 30S subunits alone, without ever combining into 70S ribosomes",
      ],
      correct_index: 1,
      reveal: "A polysome is defined by multiple ribosomes attached to one single mRNA strand, all translating that same message at the same time. It isn't five separate messages being read by five separate ribosomes — it's one message being read by several ribosomes in a chain, which is exactly what lets the cell make many copies of the same protein quickly from one strand.",
      difficulty_level: 2,
    },
    // ── 6 · Heading — Eukaryotic cells ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Eukaryotic Cells — A Different Level of Organisation Altogether',
      objective: 'By the end of this you can list what every eukaryotic cell shares, and name the exact organelles that split plant cells from animal cells.',
    },
    // ── 7 · Text — eukaryotic overview + plant/animal difference ─────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Every prokaryotic cell you've studied so far belongs to bacteria alone. Step up to **eukaryotic cells**, and the membership list widens to include **all the protists, plants, animals, and fungi**.\n\nWhat actually changes at this level? In a eukaryotic cell, the cytoplasm is **extensively compartmentalised** — broken up into separate working spaces — through the presence of **membrane-bound organelles**. The cell also has a properly **organised nucleus**, wrapped in its own **nuclear envelope**, instead of genetic material sitting loose. On top of that, eukaryotic cells carry **complex locomotory and cytoskeletal structures**, and their **genetic material is organised into chromosomes** rather than floating as a single loop.\n\nBut here's the part worth sitting with: **not all eukaryotic cells are identical**. Plant and animal cells, in particular, are built differently from each other. **Plant cells possess a cell wall, plastids, and a large central vacuole** — all three of which are **absent in animal cells**. Flip it around, and **animal cells have centrioles**, which are **absent in almost all plant cells**.",
    },
    // ── 8 · Interactive image — Figure 8.3 ────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A plant cell and an animal cell shown side by side, with their shared organelles and their distinguishing structures labelled',
      caption: '📸 Tap each part to see whether it belongs to the plant cell, the animal cell, or both — Figure 8.3',
      generation_prompt: "Scientific textbook illustration comparing a generalised plant cell (left) and a generalised animal cell (right), side by side, Figure 8.3 style. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no text or labels baked into the image. Left cell: a rigid rectangular plant cell outline with a distinct thick tan/brown cell wall as its outer boundary, a large pale blue fluid-filled sac (large central vacuole) occupying most of the interior, several oval green plastids (chloroplasts) with faint internal striping near the cell wall, a rounded central nucleus, a network of pale membranous endoplasmic reticulum, and a small oval mitochondrion, all in pale white/pink outline against the cytoplasm. Right cell: a rounded, flexible animal cell outline with no cell wall and no vacuole, showing a rounded central nucleus, a network of endoplasmic reticulum, a small oval mitochondrion (matching the plant cell's, for comparison), and near the nucleus a small pair of short perpendicular cylindrical structures (a centriole pair) in pale grey. Functional colours: tan/brown for the plant cell wall (dead/structural), green for plastids (photosynthetic), pale blue for the large central vacuole (water/fluid), pink/white for shared soft organelles. No photorealism, no cartoon, no mascots — matches standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: uuid(), x: 0.08, y: 0.50, label: 'Cell wall (plant only)', icon: 'circle',
          detail: "The rigid outer boundary of the plant cell. It's one of three structures NCERT lists as present in plant cells and absent in animal cells.",
        },
        {
          id: uuid(), x: 0.24, y: 0.55, label: 'Large central vacuole (plant only)', icon: 'circle',
          detail: 'A big fluid-filled space that takes up most of the plant cell. Like the cell wall and plastids, this is absent in animal cells.',
        },
        {
          id: uuid(), x: 0.30, y: 0.30, label: 'Plastids (plant only)', icon: 'circle',
          detail: 'Present in plant cells, absent in animal cells — the third structure on the plant-only list, alongside the cell wall and the large central vacuole.',
        },
        {
          id: uuid(), x: 0.50, y: 0.45, label: 'Nucleus (both cells)', icon: 'circle',
          detail: 'A properly organised nucleus with its own nuclear envelope — a feature of every eukaryotic cell, plant or animal, unlike a prokaryotic cell.',
        },
        {
          id: uuid(), x: 0.44, y: 0.62, label: 'Endoplasmic reticulum (both cells)', icon: 'circle',
          detail: 'Part of the extensive compartmentalisation that defines a eukaryotic cell — membrane-bound organelle territory that a prokaryotic cell simply does not have.',
        },
        {
          id: uuid(), x: 0.58, y: 0.72, label: 'Mitochondrion (both cells)', icon: 'circle',
          detail: 'Another membrane-bound organelle present in both the plant and the animal cell — this compartmentalisation is exactly what separates eukaryotic cells from prokaryotic ones.',
        },
        {
          id: uuid(), x: 0.86, y: 0.40, label: 'Centriole (animal only)', icon: 'circle',
          detail: "Present in animal cells, but absent in almost all plant cells — NCERT's own hedge, so a handful of plant cells are the rare exception.",
        },
      ],
    },
    // ── 9 · Reasoning prompt — plant vs animal distinguishing organelle ──
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student is shown two eukaryotic cells under a microscope and told one is a plant cell, the other an animal cell — but the labels have been removed. One of the two cells clearly has a pair of centrioles near its nucleus. Based on NCERT, which cell is this most likely to be, and why?",
      options: [
        "The plant cell, because centrioles are one of the three structures unique to plant cells",
        "The animal cell, because animal cells have centrioles, which are absent in almost all plant cells",
        "It could be either cell with equal likelihood, since centrioles are present in every eukaryotic cell",
        "Neither cell, since centrioles only appear in prokaryotic cells, not in eukaryotic ones",
      ],
      correct_index: 1,
      reveal: "NCERT states plainly that animal cells have centrioles, and that centrioles are absent in almost all plant cells. So a visible centriole pair points to the animal cell. The plant-only list is a different trio altogether — cell wall, plastids, and a large central vacuole — none of which is a centriole. And centrioles belong to eukaryotic cells, not prokaryotic ones, which don't have this kind of cytoskeletal structure at all.",
      difficulty_level: 2,
    },
    // ── 10 · Comparison card — plant vs animal cell ───────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Plant Cell vs Animal Cell',
      columns: [
        {
          heading: 'Plant cell',
          points: [
            'Cell wall — present',
            'Plastids — present',
            'Large central vacuole — present',
            'Centrioles — absent (in almost all plant cells)',
          ],
        },
        {
          heading: 'Animal cell',
          points: [
            'Cell wall — absent',
            'Plastids — absent',
            'Large central vacuole — absent',
            'Centrioles — present',
          ],
        },
      ],
    },
    // ── 11 · Remember callout ──────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'The Facts You Cannot Get Wrong',
      markdown: "- Prokaryotic ribosomes are **70S**, made of a **50S subunit + a 30S subunit**, sized about **15 nm × 20 nm**, and sit **attached to the plasma membrane**.\n- Ribosomes are the **site of protein synthesis**. Several ribosomes on one mRNA form a **polyribosome / polysome**.\n- **Inclusion bodies** = reserve material, **not bound by any membrane**, lying free in the cytoplasm (phosphate, cyanophycean, glycogen granules).\n- **Gas vacuoles** occur in blue-green and purple and green photosynthetic bacteria.\n- Eukaryotes = **all protists, plants, animals, fungi** — with compartmentalised cytoplasm, an organised nucleus with a nuclear envelope, cytoskeletal structures, and chromosomes.\n- **Plant-only:** cell wall, plastids, large central vacuole. **Animal-only:** centrioles (absent in almost all plant cells).",
    },
    // ── 12 · Exam tip ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The four-organelle checklist:** the fastest way to tell a plant cell diagram from an animal cell diagram is to scan for four structures — **cell wall, plastids, and large central vacuole** mean plant; **centrioles** mean animal. NCERT hedges the centriole rule with \"almost all\" plant cells, so don't answer an absolute-certainty question with it if the option itself says \"always.\"\n\n**Ribosome subunit maths:** memorise this exactly — **50S + 30S = 70S**. NEET likes swapping these numbers (e.g. writing 40S + 60S, which is the eukaryotic ribosome's subunit pair, not the prokaryotic one) — know which pair belongs to which cell type.\n\n**Classic NEET question:** \"Which of the following is absent in a prokaryotic cell's reserve material storage — a membrane, or free lying in the cytoplasm?\" → inclusion bodies have **no membrane** and lie **free in the cytoplasm**.",
    },
    // ── 13 · Bridge to next page ─────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You now know what tells a plant cell apart from an animal cell at a glance. Next, you'll go inside the boundary both of them share — the plasma membrane — and see exactly how it decides what gets in and what stays out.",
    },
    // ── 14 · Inline quiz ────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'A prokaryotic 70S ribosome is formed from which two subunits?',
          options: ['50S and 30S', '40S and 60S', '50S and 40S', '30S and 60S'],
          correct_index: 0,
          explanation: "NCERT states the prokaryotic ribosome's two subunits are 50S and 30S, which together form the 70S ribosome. 40S and 60S is the eukaryotic ribosome's subunit pair, not the prokaryotic one — mixing the two is the exact trap this question tests.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'What exactly is an inclusion body in a prokaryotic cell?',
          options: [
            'A structure that stores DNA separately from the nucleoid',
            'A protein-synthesising structure found attached to the plasma membrane',
            'Reserve material enclosed in its own single-layered membrane inside the cytoplasm',
            'Reserve material lying free in the cytoplasm, not bound by any membrane system',
          ],
          correct_index: 3,
          explanation: "NCERT is explicit that inclusion bodies are not bound by any membrane system and lie free in the cytoplasm. Claiming they have a membrane reverses the defining fact; storing DNA is not their role, and protein synthesis is the ribosome's job, not the inclusion body's.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Several ribosomes attach to a single mRNA strand and translate it together. What is this structure called?',
          options: ['A nucleoid', 'A gas vacuole', 'A polyribosome (polysome)', 'An inclusion body'],
          correct_index: 2,
          explanation: "This chain of multiple ribosomes on one mRNA is exactly what NCERT defines as a polyribosome or polysome. A nucleoid is the region holding a prokaryote's genetic material, an inclusion body is unrelated reserve material, and a gas vacuole is a separate structure found in specific photosynthetic bacteria.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which pair of structures does NCERT list as present in plant cells but absent in animal cells?',
          options: [
            'Centrioles and mitochondria',
            'Cell wall and large central vacuole',
            'Nucleus and endoplasmic reticulum',
            'Ribosomes and cytoskeleton',
          ],
          correct_index: 1,
          explanation: "NCERT lists cell wall, plastids, and a large central vacuole as present in plant cells and absent in animal cells — cell wall and large central vacuole are two of that trio. Centrioles run the other way (animal cells have them, plant cells almost never do), while nucleus, endoplasmic reticulum, ribosomes, and cytoskeleton are shared by both cell types.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
