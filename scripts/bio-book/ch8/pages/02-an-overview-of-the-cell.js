'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'an-overview-of-the-cell',
  title: 'An Overview of the Cell',
  subtitle: "Whether the nucleus is wrapped in a membrane or not decides everything else about a cell — right down to which organelles it's even allowed to have.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'prokaryotic-vs-eukaryotic'],
  glossary: [
    { term: 'nucleus', definition: 'A dense, membrane-bound structure inside a cell that contains the chromosomes, which in turn contain the genetic material, DNA.' },
    { term: 'eukaryotic', definition: 'A cell that has a membrane-bound nucleus.' },
    { term: 'prokaryotic', definition: 'A cell that lacks a membrane-bound nucleus.' },
    { term: 'cytoplasm', definition: 'The semi-fluid matrix occupying the volume of a cell, present in both prokaryotic and eukaryotic cells — the main arena of cellular chemical reactions.' },
    { term: 'organelle', definition: 'A distinct, membrane-bound structure inside a eukaryotic cell — e.g. the endoplasmic reticulum, Golgi complex, lysosomes, mitochondria, microbodies, or vacuoles.' },
    { term: 'ribosome', definition: 'A non-membrane-bound structure found in all cells, both prokaryotic and eukaryotic — present in the cytoplasm, within chloroplasts and mitochondria, and on rough ER.' },
    { term: 'centrosome', definition: 'A non-membrane-bound structure found in animal cells that helps in cell division.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark, atmospheric scene of cell-like glowing forms of wildly different sizes and shapes drifting in a dark void',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dark atmospheric microscope-inspired scene: suspended in a deep dark void lit from within by a warm amber glow, a scattered array of soft translucent cell-like forms drift at wildly different scales — a tiny barely-visible glowing speck on the far left, a medium round biconcave disc near the centre, a slender branching thread-like form stretching across the right side of the frame, and one large glowing oval form dwarfing everything else near the right edge. None of these are literal labelled diagrams — just quiet organic silhouettes suggesting an enormous range of size and shape drifting together in the same dark space. Deep, atmospheric lighting, one soft warm glow tying the whole scene together, painterly illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'From Barely-There to the Size of Your Fist',
      markdown: "The smallest cells known, **mycoplasmas**, are only about **0.3 µm** long — you'd need thousands of them lined up just to span a single millimetre. Now hold that next to the **largest isolated single cell on Earth: the egg of an ostrich.** Same basic unit of life, the cell, stretched across a size range wide enough to hold both extremes on the very same page.",
    },
    // ── core concept: recap + nucleus + eu/prokaryotic + cytoplasm ─────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You've already looked at an onion peel and a human cheek cell under the microscope — recall what set them apart. The onion cell, a **typical plant cell**, has a distinct **cell wall** as its outermost boundary, and just inside that wall sits the **cell membrane**. The human cheek cell has no cell wall at all — its **outer membrane** is the only delimiting structure of the cell.\n\nLook inside either cell and you'll find a dense, membrane-bound structure called the **nucleus**. The nucleus contains **chromosomes**, and the chromosomes in turn contain the genetic material, **DNA**. Whether a cell has this membrane-bound nucleus or not is the single biggest split in all of biology: cells with a membrane-bound nucleus are **eukaryotic**; cells that lack one are **prokaryotic**.\n\nBoth kinds of cells — prokaryotic and eukaryotic — share one more thing: a semi-fluid matrix called the **cytoplasm**, which occupies the entire volume of the cell. The cytoplasm is the main arena of cellular activity in both plant and animal cells — it's where the chemical reactions that keep a cell in its 'living state' actually happen.",
    },
    // ── heading: organelles ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Organelles: What Only Eukaryotic Cells Have',
      objective: "By the end of this you can name every membrane-bound organelle eukaryotic cells carry — and say exactly what prokaryotic cells are missing.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Eukaryotic cells don't stop at the nucleus. Besides the nucleus, they carry other distinct, membrane-bound structures called **organelles** — the **endoplasmic reticulum (ER)**, the **Golgi complex**, **lysosomes**, **mitochondria**, **microbodies**, and **vacuoles**. Each one is wrapped in its own membrane, the same way the nucleus is.\n\nProkaryotic cells don't have any of this — they **lack membrane-bound organelles** altogether. The membrane-bound nucleus and the membrane-bound organelles are, in fact, the same underlying idea: a compartment sealed off by its own membrane. Eukaryotic cells build many of these compartments; prokaryotic cells build none.",
    },
    // ── comparison card ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5, title: 'Prokaryotic vs Eukaryotic Cells',
      columns: [
        { heading: 'Prokaryotic', points: ['Nucleus is NOT membrane-bound', 'No membrane-bound organelles — no ER, Golgi complex, lysosomes, mitochondria, microbodies, or vacuoles', 'Has ribosomes (non-membrane bound) and cytoplasm, same as eukaryotic cells'] },
        { heading: 'Eukaryotic', points: ['Nucleus IS membrane-bound, containing chromosomes with DNA', 'Has membrane-bound organelles — ER, Golgi complex, lysosomes, mitochondria, microbodies, vacuoles', 'Animal cells additionally have a centrosome (non-membrane bound, helps in cell division)'] },
      ],
    },
    // ── heading: ribosomes + centrosome ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Ribosomes and Centrosome — The Non-Membrane-Bound Exceptions',
      objective: "By the end of this you know exactly where ribosomes turn up in a cell — the single most-tested fact on this page — and what the centrosome does.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Not every structure in a cell is wrapped in a membrane. **Ribosomes** are non-membrane bound, and — unlike the organelles you just read about — they're found in **all cells, both eukaryotic and prokaryotic**. Within a eukaryotic cell, ribosomes turn up in more than one place: in the **cytoplasm**, and also **within two organelles — the chloroplasts (in plants) and mitochondria — and on rough ER.** Ribosomes sit on the surface of these membrane-bound organelles without ever becoming part of the membrane themselves.\n\nAnimal cells contain one more non-membrane-bound structure: the **centrosome**, which **helps in cell division**.",
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A NEET aspirant reasons: 'Prokaryotic cells lack membrane-bound organelles, so ribosomes — which are organelles — must be missing from prokaryotic cells too.' What's wrong with this reasoning?",
      options: [
        "Nothing is wrong — ribosomes are membrane-bound organelles, so the restriction to eukaryotic cells is correct",
        "Ribosomes are non-membrane bound, so the 'no membrane-bound organelles' rule for prokaryotic cells doesn't apply to them at all — ribosomes are found in every cell, prokaryotic and eukaryotic alike",
        "The reasoning is backwards — ribosomes are found only in prokaryotic cells, never in eukaryotic ones",
        "Ribosomes exist in eukaryotic cells only inside the nucleus, never in the cytoplasm or on other organelles",
      ],
      reveal: "Ribosomes are non-membrane bound — that's exactly why the 'prokaryotic cells lack membrane-bound organelles' rule never touches them. NCERT is explicit: ribosomes are found in ALL cells, both eukaryotic and prokaryotic. The first option gets the membrane status backwards; the third flips which cell type has them; the fourth ignores that ribosomes sit in the cytoplasm AND on rough ER AND within chloroplasts and mitochondria — not confined to the nucleus at all.",
      difficulty_level: 3,
    },
    // ── heading: size and shape ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Cells Come in Every Size and Shape',
      objective: "By the end of this you can quote the size extremes NEET loves to ask about, and explain why a cell's shape often matches its function.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Cells differ greatly in size, shape, and activity (Figure 8.1). At the small end, **mycoplasmas are the smallest cells** — only about **0.3 µm** in length. Bacteria run a little larger, at roughly **3 to 5 µm**. At the other extreme, the **largest isolated single cell is the egg of an ostrich**. Among multicellular organisms, **human red blood cells are about 7.0 µm in diameter**, and **nerve cells are some of the longest cells** in the body.\n\nShape varies just as much as size. Cells can be **disc-like, polygonal, columnar, cuboid, thread-like, or even irregular** — and the shape of a cell may vary with the function it performs, which is exactly what Figure 8.1 shows below.",
    },
    // ── interactive image: Figure 8.1 ────────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'Six cells of different shapes: red blood cells, white blood cells, columnar epithelial cells, a nerve cell, mesophyll cells, and a tracheid',
      caption: '📸 Tap each cell to see its shape',
      generation_prompt: "Scientific textbook illustration of six cells shown side by side, matching NCERT Figure 8.1. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Left to right, top row: a red blood cell drawn as a round, biconcave disc (pink/magenta, animal soft tissue colour); an irregular amoeboid white blood cell with a shapeless, constantly-changing outline (pink/magenta); a tall columnar epithelial cell, long and narrow, drawn upright (pink/magenta). Middle area: a branched, elongated nerve cell with thin branching processes extending outward (pink/magenta). Bottom row: a round-to-oval mesophyll cell (green, living/photosynthetic plant tissue) and a long elongated tracheid cell (green, plant tissue). No photorealism, no cartoon, no mascots, clean minimalist scientific-diagram style matching standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.18, label: 'Red Blood Cells', icon: 'circle',
          detail: "**Round and biconcave** — one of six shapes NCERT lines up in Figure 8.1 to show how much a cell's shape can vary." },
        { id: uuid(), x: 0.38, y: 0.14, label: 'White Blood Cells', icon: 'circle',
          detail: "**Amoeboid** — an irregular, constantly-changing shape, not a fixed disc." },
        { id: uuid(), x: 0.68, y: 0.16, label: 'Columnar Epithelial Cells', icon: 'circle',
          detail: "**Long and narrow.**" },
        { id: uuid(), x: 0.42, y: 0.52, label: 'Nerve Cell', icon: 'circle',
          detail: "**Branched and long** — NCERT names nerve cells among the longest cells in the body." },
        { id: uuid(), x: 0.78, y: 0.68, label: 'Mesophyll Cells', icon: 'circle',
          detail: "**Round and oval.**" },
        { id: uuid(), x: 0.60, y: 0.85, label: 'A Tracheid', icon: 'circle',
          detail: "**Elongated.**" },
      ],
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'Facts You Cannot Blur Together',
      markdown: "- **Membrane-bound nucleus = eukaryotic; no membrane-bound nucleus = prokaryotic.**\n- Eukaryotic cells have membrane-bound organelles — ER, Golgi complex, lysosomes, mitochondria, microbodies, vacuoles. Prokaryotic cells have none of these.\n- **Ribosomes are non-membrane bound and present in ALL cells** — prokaryotic and eukaryotic alike.\n- **Centrosome is non-membrane bound and found in animal cells**; it helps in cell division.\n- **Mycoplasmas ≈ 0.3 µm** (smallest cells); **bacteria 3–5 µm**; **ostrich egg = largest isolated single cell**; **human RBC ≈ 7.0 µm diameter**.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Ribosomes are the biggest trap on this page:** they're the ONE structure NEET expects you to know is present in both prokaryotic and eukaryotic cells — and non-membrane bound despite sitting on membrane-bound organelles (rough ER, mitochondria, chloroplasts) as well as free in the cytoplasm. Don't let 'found on/in organelles' fool you into calling ribosomes membrane-bound — the ribosome itself has no membrane of its own.\n\n**Centrosome is animal-cell only:** it's non-membrane bound, like ribosomes, but NCERT lists it specifically for animal cells, not as a general eukaryotic feature — don't extend it to every eukaryotic cell.\n\n**Classic NEET question:** \"Which of the following is found in both prokaryotic and eukaryotic cells?\" → **Ribosomes** — the only structure on this page common to both cell types.",
    },
    // ── bridge ───────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now know the two basic cell designs — what makes a cell eukaryotic or prokaryotic, and which structures each one is built with. Next, you'll zoom into the prokaryotic cell itself: its shapes, and the parts that make it work.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'What decides whether a cell is called eukaryotic or prokaryotic?',
          options: [
            'Whether the cell has a cell wall or not',
            'Whether the nucleus is membrane-bound or not',
            'Whether the cell has cytoplasm or not',
            'Whether the cell has ribosomes or not',
          ],
          correct_index: 1,
          explanation: "A membrane-bound nucleus makes a cell eukaryotic; its absence makes it prokaryotic — that is the entire definition. A cell wall is what separates the onion cell from the cheek cell, not eukaryotic from prokaryotic cells. Cytoplasm and ribosomes are present in both cell types, so neither can be the deciding factor.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which of these is a correct list of membrane-bound organelles present in eukaryotic cells but absent in prokaryotic cells?',
          options: [
            'Endoplasmic reticulum, Golgi complex, lysosomes, mitochondria, microbodies, vacuoles',
            'Ribosomes, cytoplasm, nucleus, centrosome',
            'Cell wall, cell membrane, cytoplasm, DNA',
            'Chromosomes, DNA, nucleus, ribosomes',
          ],
          correct_index: 0,
          explanation: "This is NCERT's exact list of eukaryotic organelles. Ribosomes and cytoplasm are present in prokaryotic cells too, so they can't belong on a 'eukaryotic-only' list; the nucleus is a single structure, not this list of organelles. Cell wall, cell membrane, and DNA aren't organelles at all — they're boundary structures and genetic material. Chromosomes and DNA sit inside the nucleus, and ribosomes are found in both cell types — none of these are the membrane-bound organelle list being asked for.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Within a eukaryotic cell, where are ribosomes found, according to NCERT?',
          options: [
            'Only in the cytoplasm',
            'In the cytoplasm, and also within chloroplasts, within mitochondria, and on rough ER',
            'Only inside the nucleus',
            'Only on the Golgi complex',
          ],
          correct_index: 1,
          explanation: "NCERT names four locations for ribosomes: free in the cytoplasm, within chloroplasts (in plants), within mitochondria, and on rough ER. Restricting them to only the cytoplasm, only the nucleus, or only the Golgi complex each misses most of the actual list — and the nucleus and Golgi complex aren't ribosome locations NCERT names at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about cell size, per NCERT, is correct?',
          options: [
            'Mycoplasmas, the smallest cells, are about 0.3 µm in length, while bacteria run 3 to 5 µm',
            'Bacteria are the smallest known cells, smaller than mycoplasmas',
            'The largest isolated single cell is the human red blood cell',
            'Human red blood cells are about 7.0 µm in length, making them the longest cells in the body',
          ],
          correct_index: 0,
          explanation: "NCERT names mycoplasmas as the smallest cells at about 0.3 µm, with bacteria running larger at 3 to 5 µm — the reverse of option 2. The largest isolated single cell is the egg of an ostrich, not a human red blood cell. And the 7.0 µm figure for human RBCs is a diameter, not a length, and NCERT separately names nerve cells — not red blood cells — as among the longest cells in the body.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
