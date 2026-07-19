'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mitosis-anaphase-telophase-cytokinesis',
  title: 'Mitosis — Anaphase, Telophase & Why It Matters',
  subtitle: "The sister chromatids finally let go and race to opposite poles, the nucleus rebuilds itself twice over, and the cytoplasm splits in two — one way in animals, a completely different way in plants. This is where one cell becomes two.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['cell-cycle-and-cell-division', 'mitosis', 'cytokinesis'],
  glossary: [
    { term: 'anaphase', definition: 'The mitotic stage in which every chromosome splits at its centromere and the two chromatids — now called daughter chromosomes — move to opposite poles.' },
    { term: 'daughter chromosome', definition: 'The name given to each chromatid once the centromere has split in anaphase and it starts moving toward a pole to become part of a future daughter nucleus.' },
    { term: 'telophase', definition: 'The final stage of karyokinesis: chromosomes at the poles decondense and lose their identity, and a nuclear envelope forms around each cluster to make two daughter nuclei.' },
    { term: 'karyokinesis', definition: 'Division of the nucleus — the segregation of duplicated chromosomes into two daughter nuclei. It is completed by the end of telophase.' },
    { term: 'cytokinesis', definition: 'Division of the cytoplasm that splits one cell into two daughter cells, completing cell division after karyokinesis.' },
    { term: 'cell-plate', definition: 'A simple precursor that forms in the centre of a dividing plant cell and grows outward; it represents the middle lamella between the walls of the two new cells.' },
    { term: 'syncytium', definition: 'A multinucleate condition that arises when karyokinesis happens but is not followed by cytokinesis — for example, the liquid endosperm of coconut.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing cell caught mid-division, its duplicated threads pulling apart toward two opposite poles in the darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single softly glowing cell floats in a dark field, caught at the exact moment of splitting: its inner threads are being drawn apart toward two opposite poles, faint spindle-like fibres of pale light stretching between them, while the whole cell has begun to pinch gently at its middle as if about to become two. Painterly, atmospheric illustration style, warm and cool light bleeding through translucent membranes, deep shadow filling the rest of the frame (#0a0a0a base tones). No text, no labels, no diagram elements, no letters, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Coconut Water Is a Cell That Forgot to Finish Dividing',
      markdown: "The clear liquid inside a green coconut is not just \"water\" — it's the **liquid endosperm** of the coconut, and it exists because of a hiccup in cell division. Normally, once a nucleus divides, the cell body splits too. But here the nucleus divided again and again **without the cell ever splitting**, so all those nuclei ended up floating together in one shared pool of cytoplasm. That shared, many-nucleus pool is called a **syncytium** — and you've been drinking it on hot afternoons your whole life.",
    },
    // ── 2 · Core concept — where we are in mitosis ───────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By the end of **metaphase**, every chromosome has lined up neatly on the **metaphase plate**, each one still made of **two sister chromatids** joined at the **centromere**. Everything is loaded and ready. What happens next is the payoff of the whole process: the two identical copies get pulled apart and handed to two separate nuclei, and then the cell itself is cut in two.\n\nThat happens in three moves — **anaphase** (the chromatids separate and travel), **telophase** (the nuclei rebuild), and **cytokinesis** (the cytoplasm splits). Let's take them one at a time.",
    },
    // ── 3 · Heading — Anaphase ────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Anaphase — The Chromatids Finally Let Go',
      objective: "By the end of this you can name the two key events of anaphase and describe exactly how a chromosome moves toward the pole — centromere first, arms trailing.",
    },
    // ── 4 · Text — Anaphase ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The moment anaphase begins, **each chromosome sitting on the metaphase plate splits simultaneously** — all together, at the same instant, not one after another. The **centromere** holding the two sister chromatids finally divides, and the two chromatids come apart. From this point on they are no longer chromatids of one chromosome — each one is now a **daughter chromosome** in its own right, headed for one of the two **future daughter nuclei**.\n\nThe two daughter chromosomes then **migrate toward opposite poles** of the cell. Watch *how* one moves: the **centromere stays pointed toward the pole**, so it goes first, at the leading edge — and the **arms of the chromosome trail behind** it, like a person being pulled by the belt buckle while their limbs stream backward. So the two events that define anaphase are simple to state and heavily tested:\n\n1. **Centromeres split and the chromatids separate.**\n2. **The chromatids move to opposite poles.**",
    },
    // ── 5 · Reasoning prompt — what defines anaphase ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "During anaphase, a chromosome is seen moving toward one of the poles. Which part of it is at the leading edge — pointing toward the pole — and why?",
      options: [
        "The arms lead the way, because they are the heaviest part of the chromosome and get pulled first.",
        "The centromere leads the way, pointing toward the pole, with the arms trailing behind.",
        "Both ends of the chromosome move together side by side, because the whole chromosome is rigid.",
        "The nuclear envelope leads, dragging the chromosome behind it toward the pole.",
      ],
      reveal: "The centromere leads (option 2). In anaphase each chromosome splits at its centromere, and as the daughter chromosomes move apart the centromere stays directed toward the pole — so it is at the leading edge while the arms trail behind. The arms never lead (that rules out option 1). The chromosome isn't dragged along stiffly with both ends level (option 3), and the nuclear envelope has already broken down earlier in mitosis, so it can't be leading anything here (option 4) — in fact it only reforms later, in telophase.",
      difficulty_level: 2,
    },
    // ── 6 · Heading — Telophase ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Telophase — Two Nuclei Are Rebuilt From Scratch',
      objective: "By the end of this you can list what happens as the chromosomes arrive at the poles — decondensing, the nuclear envelope reforming, and which organelles come back.",
    },
    // ── 7 · Text — Telophase ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Telophase is the **final stage of karyokinesis** — the nucleus-dividing part of mitosis. The daughter chromosomes have now reached their respective poles, and they do the opposite of what they did at the start: they **decondense** — uncoil and loosen — and **lose their individuality**. You can no longer pick out one distinct chromosome from another; each set just collects into a mass of chromatin at its pole.\n\nThen the cell rebuilds the nucleus it had taken apart earlier. A **nuclear envelope forms around each cluster of chromatin**, creating **two daughter nuclei** — one at each pole. The other structures that had disappeared during division now come back too: the **nucleolus, the golgi complex, and the ER reform**. At the end of telophase there are two complete, fully-formed nuclei sitting inside a single cell that has not yet split.",
    },
    // ── 8 · Heading — Cytokinesis ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Cytokinesis — Splitting the Cell Body in Two',
      objective: "By the end of this you can explain how animal and plant cells divide their cytoplasm differently, and why the plant cell needs a special mechanism.",
    },
    // ── 9 · Text — Cytokinesis ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "So far mitosis has only sorted the duplicated chromosomes into two daughter nuclei — that's **karyokinesis**. But the cell body is still one. **Cytokinesis** is the **division of the cytoplasm** that finally separates the cell into two daughter cells, and only when it finishes is cell division complete.\n\nHow the cytoplasm gets cut depends on whether the cell has a wall around it.\n\nIn an **animal cell**, there's no wall to get in the way, so the cell simply squeezes itself apart from the outside. A **furrow appears in the plasma membrane**, gradually **deepens**, and finally **joins in the centre**, dividing the cytoplasm into two. Picture pulling a drawstring tight around the middle of a soft bag until the two halves pinch off.\n\nA **plant cell** can't do that — it's boxed in by a **relatively inextensible cell wall** that won't pinch. So it builds a new dividing wall instead, and it builds it from the inside out. **Wall formation starts in the centre of the cell and grows outward** to meet the existing lateral walls. It begins as a simple precursor called the **cell-plate**, and that cell-plate goes on to represent the **middle lamella** — the shared layer between the walls of the two adjacent cells that result. Meanwhile the **organelles like mitochondria and plastids get distributed** between the two daughter cells, so each one gets its share.\n\nOne more thing worth holding on to: **karyokinesis and cytokinesis don't always come as a pair.** In some organisms the nucleus divides again and again but the cytoplasm never splits, producing a **multinucleate condition called a syncytium** — the classic example being the **liquid endosperm in coconut**.",
    },
    // ── 10 · Interactive image — animal vs plant cytokinesis ──────────────────
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'Side-by-side diagram: an animal cell dividing by a cleavage furrow pinching in from the outside, and a plant cell dividing by a cell-plate forming in the centre and growing outward',
      caption: '📸 Tap each dot to explore how an animal cell and a plant cell each split their cytoplasm in two.',
      generation_prompt: "Scientific textbook illustration comparing cytokinesis in an animal cell and a plant cell, shown side by side. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. LEFT: an animal cell (pink/magenta soft-tissue cytoplasm, rounded, no cell wall) with a distinct furrow pinching inward from the plasma membrane on both sides at the middle, shown deepening toward the centre, two daughter nuclei already present. RIGHT: a rectangular plant cell (green cytoplasm, thick brown/tan outer cell wall) with a straight cell-plate forming across the centre and growing outward toward the two lateral walls, two daughter nuclei present, the new central dividing line clearly meeting the side walls. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.5, label: 'Cleavage furrow (animal)', detail: "In the animal cell, a **furrow appears in the plasma membrane** at the middle. Because there's no cell wall, the cell can pinch inward from the outside.", icon: 'circle' },
        { id: uuid(), x: 0.28, y: 0.32, label: 'Deepening furrow', detail: "The furrow **gradually deepens** and moves toward the centre from both sides — like a drawstring being pulled tighter around the middle of the cell.", icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.68, label: 'Furrow joins in the centre', detail: "Finally the furrow **joins in the centre**, dividing the cytoplasm into two. Cytokinesis in the animal cell is complete — it splits from the **outside in**.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.5, label: 'Cell-plate (plant)', detail: "In the plant cell, wall formation **starts in the centre** and builds outward. It begins as a simple precursor called the **cell-plate**.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.28, label: 'Growing outward', detail: "The new wall **grows outward from the centre to meet the existing lateral walls** — the reverse direction from the animal cell's furrow, which came inward from the edge.", icon: 'circle' },
        { id: uuid(), x: 0.88, y: 0.5, label: 'Lateral cell wall', detail: "The **relatively inextensible cell wall** is exactly why the plant cell can't simply pinch itself in two the way an animal cell does — it has to build a fresh dividing wall instead.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.72, label: 'Middle lamella', detail: "The cell-plate goes on to **represent the middle lamella** — the shared cementing layer between the walls of the two new adjacent cells.", icon: 'circle' },
      ],
    },
    // ── 11 · Comparison card — animal vs plant cytokinesis ────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11,
      title: 'Cytokinesis: Animal Cell vs Plant Cell',
      columns: [
        {
          heading: 'Animal Cell',
          points: [
            'No cell wall — the cell can pinch itself apart.',
            'A furrow appears in the plasma membrane.',
            'The furrow deepens and joins in the centre.',
            'Direction: splits from the OUTSIDE IN.',
          ],
        },
        {
          heading: 'Plant Cell',
          points: [
            'Enclosed by a relatively inextensible cell wall — cannot pinch.',
            'Builds a new wall instead, starting as a cell-plate.',
            'The cell-plate forms in the centre and grows outward to the lateral walls.',
            'Direction: builds from the CENTRE OUTWARD; the cell-plate = the middle lamella.',
          ],
        },
      ],
    },
    // ── 12 · Heading — Significance ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 12, level: 2,
      text: 'Why Mitosis Matters',
      objective: "By the end of this you can give the four reasons NCERT lists for why mitosis matters — identical diploid cells, growth, restoring the nucleo-cytoplasmic ratio, and repair.",
    },
    // ── 13 · Text — Significance of mitosis ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "Mitosis is also called the **equational division**, because the two cells it makes are exactly equal to the parent. It's **usually restricted to diploid cells** — though there are exceptions worth remembering: in **some lower plants and some social insects, haploid cells also divide by mitosis**.\n\nWhat does mitosis actually do for a living body? Four things:\n\n- **It makes identical copies.** Mitosis produces **diploid daughter cells with an identical genetic complement** — every new cell carries the same genes as the parent.\n- **It drives growth.** The **growth of a multicellular organism is due to mitosis** — you got from one fertilised egg to trillions of cells by this one process repeating.\n- **It restores the nucleo-cytoplasmic ratio.** As a cell grows, the cytoplasm outpaces the nucleus and the **ratio between nucleus and cytoplasm gets disturbed**. Dividing brings that ratio back into balance.\n- **It repairs and replaces.** A very significant role of mitosis is **cell repair**. The cells of the **upper layer of the epidermis, the lining of the gut, and blood cells are constantly being replaced** by fresh ones made through mitosis.\n\nAnd in plants, mitotic divisions in the **meristematic tissues — the apical and the lateral cambium — give continuous growth throughout the plant's life.**",
    },
    // ── 14 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Anaphase** = centromeres **split**, chromatids **separate** and move to opposite poles; the **centromere leads** (points to the pole), the arms trail behind.\n- **Telophase** = chromosomes at the poles **decondense** and lose their identity; the **nuclear envelope reforms** → two daughter nuclei; the **nucleolus, golgi complex and ER reform**.\n- **Cytokinesis** — **animal cell**: a **furrow** in the plasma membrane deepens and joins (outside → in). **Plant cell**: a **cell-plate** forms in the centre and grows outward to the lateral walls; the **cell-plate = the middle lamella** (centre → out).\n- **Karyokinesis without cytokinesis** → a multinucleate **syncytium**, e.g. **liquid endosperm in coconut**.\n- **Significance of mitosis:** identical diploid cells · **growth** of multicellular organisms · restores the **nucleo-cytoplasmic ratio** · **cell repair** (epidermis, gut lining, blood cells). Meristem (apical + lateral cambium) → continuous plant growth.",
    },
    // ── 15 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Anaphase's two key events are lifted straight from NCERT:** (i) centromeres split and chromatids separate, (ii) chromatids move to opposite poles. If a question asks \"when does the centromere split?\", the answer is **anaphase** — nowhere else.\n\n**The plant-vs-animal cytokinesis contrast is a favourite trap.** Cell-plate = plant; furrow = animal. And remember the *direction*: the plant cell-plate grows **centre → outward**, the animal furrow closes **outside → in**. The cell-plate **represents the middle lamella** — that exact phrase gets tested.\n\n**Classic NEET question:** \"Cell-plate formation occurs during cytokinesis in ___ cells.\" → **plant** cells. And its partner: \"Liquid endosperm of coconut is an example of ___.\" → a **syncytium** (karyokinesis not followed by cytokinesis).",
    },
    // ── 16 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 16,
      markdown: "That completes mitosis — one cell dividing into two identical diploid copies, used for growth and repair. But making eggs and sperm needs the opposite: cells with **half** the chromosomes, reshuffled for variety. For that the body uses a different kind of division. Next, you'll meet **meiosis I** — where the story stops being about copying and starts being about halving and mixing.",
    },
    // ── 17 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which pair correctly describes the two key events that define anaphase?",
          options: [
            "Centromeres split so the chromatids separate, and the chromatids move to opposite poles",
            "The nuclear envelope reforms, and the nucleolus, golgi complex and ER reappear",
            "Chromosomes line up single-file on the metaphase plate, and the spindle fibres attach to them",
            "Chromosomes decondense at the poles and lose their individuality as discrete elements",
          ],
          correct_index: 0,
          explanation: "Anaphase is defined by exactly two events: the centromeres split so the chromatids come apart, and those chromatids move to opposite poles. The nuclear-envelope option and the decondensing option both describe telophase. Lining up on the metaphase plate describes metaphase, which happens just before anaphase — the tempting near-miss, because it's the immediately preceding stage.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "As a chromosome moves toward a pole during anaphase, which part leads and which part trails?",
          options: [
            "The arms lead at the front, and the centromere trails behind",
            "The nuclear envelope leads, pulling the chromosome behind it",
            "The centromere leads, directed toward the pole, and the arms trail behind",
            "Both arms and centromere advance level with each other in a straight line",
          ],
          correct_index: 2,
          explanation: "The centromere stays directed toward the pole, so it's at the leading edge while the arms trail behind. The arms-lead option reverses this — a common slip. The nuclear envelope has already broken down and doesn't reform until telophase, so it can't lead. And the chromosome doesn't advance stiffly with both ends level; it's clearly centromere-first, arms-behind.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How does cytokinesis differ between an animal cell and a plant cell?",
          options: [
            "In the animal cell a cell-plate forms in the centre; in the plant cell a furrow pinches inward from the plasma membrane",
            "Both divide by a furrow in the plasma membrane, but the plant cell's furrow is slower because of its cell wall",
            "In the animal cell the nuclear envelope splits the cytoplasm; in the plant cell the middle lamella dissolves to separate the cells",
            "In the animal cell a furrow in the plasma membrane deepens and joins in the centre; in the plant cell a cell-plate forms in the centre and grows outward to the lateral walls",
          ],
          correct_index: 3,
          explanation: "The animal cell splits by a furrow that deepens from the outside in; the plant cell, boxed in by an inextensible cell wall, instead builds a cell-plate from the centre outward. The first option swaps the two mechanisms. The 'both use a furrow' option is wrong because the plant cell doesn't use a furrow at all. The nuclear-envelope option misuses the middle lamella — the cell-plate becomes the middle lamella, it doesn't dissolve to separate anything.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The liquid endosperm of a coconut is a well-known example of which situation?",
          options: [
            "Cytokinesis happening without karyokinesis, producing an enucleate cell",
            "Karyokinesis not being followed by cytokinesis, producing a multinucleate syncytium",
            "Meiosis producing haploid daughter cells for reproduction",
            "A cell-plate forming the middle lamella between two adjacent daughter cells",
          ],
          correct_index: 1,
          explanation: "In coconut liquid endosperm, the nucleus divides repeatedly (karyokinesis) but the cytoplasm never splits (no cytokinesis), so many nuclei end up in one shared mass — a multinucleate syncytium. Option 1 reverses the two processes. Option 3 is the wrong kind of division entirely. Option 4 describes normal plant cytokinesis — the very thing that is NOT happening here.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
