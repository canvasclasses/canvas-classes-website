'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mitosis-prophase-and-metaphase',
  title: 'Mitosis — Prophase & Metaphase',
  subtitle: "M phase is the loudest, most dramatic part of the whole cell cycle — the cell tears itself down and rebuilds. In prophase the chromosomes get packed and the machinery moves to the poles; in metaphase they line up dead-centre. Learn exactly what disappears and what attaches, because that's what NEET asks.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['cell-cycle-and-cell-division', 'mitosis'],
  glossary: [
    { term: 'M phase (mitotic phase)', definition: 'The most dramatic period of the cell cycle, involving a major reorganisation of virtually all components of the cell. It is when the actual division happens.' },
    { term: 'equational division', definition: 'Another name for mitosis — used because the parent cell and the progeny (daughter) cells end up with the same number of chromosomes.' },
    { term: 'karyokinesis', definition: 'The division of the nucleus. In mitosis it is divided for convenience into four stages: prophase, metaphase, anaphase and telophase.' },
    { term: 'centromere', definition: 'The point at which the two chromatids of a chromosome are attached together.' },
    { term: 'centrosome', definition: 'A cell structure that duplicates during the S phase of interphase and, in prophase, begins moving towards opposite poles of the cell.' },
    { term: 'aster', definition: 'The array of microtubules that radiates out from each centrosome. The two asters together with the spindle fibres form the mitotic apparatus.' },
    { term: 'kinetochore', definition: 'A small disc-shaped structure at the surface of the centromere. It is the site where spindle fibres attach to the chromosome.' },
    { term: 'metaphase plate', definition: 'The plane at the equator (centre) of the cell along which all the chromosomes come to lie and get aligned during metaphase.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dividing cell mid-mitosis, glowing condensed chromosomes gathering at the centre while faint spindle threads stretch to two bright poles',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The interior of a single living cell caught mid-division at night, rendered painterly and atmospheric. Softly glowing, thick, compacted thread-like chromosomes are gathered near the centre of the frame, while faint luminous fibres stretch outward toward two brighter glowing points of light at opposite edges, suggesting poles being pulled apart. Deep near-black background (#0a0a0a base tones) with subtle cool blue and warm gold highlights on the glowing structures. Dreamlike, dramatic, sense of a cell reorganising itself. No text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Cell Spends Most of Its Life Getting Ready — Then Divides in a Flash',
      markdown: "Of everything a cell does across its whole life, division is **the most dramatic period** — NCERT's own word for it. In the M phase the cell doesn't just quietly split. It pulls off **a major reorganisation of virtually all of its components** — packing its DNA, tearing down its own nucleus, and building a machine to haul the halves apart. And here's the neat part: the two cells that come out have **the same chromosome number** as the parent. Nothing is lost, nothing is doubled. That balanced bookkeeping is exactly why mitosis has a second name — **equational division**.",
    },
    // ── 2 · Core concept — M phase & karyokinesis ────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **M phase** (mitotic phase) is where the real action of the cell cycle happens. Because the **parent cell and the progeny (daughter) cells carry the same number of chromosomes**, mitosis is also called **equational division** — the count stays equal on both sides.\n\nThe division of the nucleus is called **karyokinesis**, and for convenience it's split into **four stages** in this exact order: **prophase → metaphase → anaphase → telophase**. One warning before we start naming stages: cell division is a **progressive process**. It flows continuously. You cannot draw a sharp, clean line to say \"prophase ended exactly here and metaphase began exactly here\" — the stages blend into one another. The four names are labels of convenience, not four separate rooms the cell walks through. This page covers the first two: **prophase** and **metaphase**.",
    },
    // ── 3 · Heading — Prophase ────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Prophase — Packing the DNA and Sending the Machinery to the Poles',
      objective: "By the end of this you can name the two headline events of prophase (chromosomes condense; centrosomes move to the poles) and list the four structures that have vanished by the time prophase ends.",
    },
    // ── 4 · Text — Prophase ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Prophase** is the **first stage** of karyokinesis, and it picks up right after the **S and G2 phases** of interphase. During S and G2, the newly copied DNA molecules are **not distinct — they're intertwined**, tangled together like a mess of thread. Prophase is where that gets sorted out.\n\n**Event one — the chromosomes condense.** Prophase begins with the **condensation of chromosomal material**. As the chromatin condenses, the tangled material becomes **untangled** and packs down into **compact mitotic chromosomes** you can actually see. Look closely at one of these condensed chromosomes and you'll notice it's **made of two chromatids, attached together at the centromere**. (Those two chromatids are the two copies made back in the S phase — now neatly paired.)\n\n**Event two — the machinery heads for the poles.** The **centrosome**, which had already **duplicated during the S phase**, now **begins to move towards opposite poles** of the cell. Each centrosome **radiates out microtubules called asters**. The two asters together with the **spindle fibres** form the **mitotic apparatus** — the equipment the cell will later use to pull the chromatids apart.",
    },
    // ── 5 · Interactive image — prophase → metaphase cell ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of a cell moving from prophase to metaphase: condensed chromosomes with paired chromatids, centromeres, kinetochores, spindle fibres, asters at two poles, and the metaphase plate at the equator',
      caption: '📸 Tap each dot to explore how a cell is organised during prophase and metaphase.',
      generation_prompt: "Scientific textbook illustration of a single animal cell during the prophase-to-metaphase transition of mitosis. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Show: several thick condensed chromosomes, each drawn as a compact X-shape of two chromatids joined at a central pinched point (the centromere); the chromosomes lined up in a vertical row across the middle of the cell (the equator); two star-like radiating microtubule structures (asters) at the left and right poles, each with a small paired centrosome at its centre; fine spindle fibres stretching from each pole and attaching to small disc-shaped kinetochores on the centromeres of the chromosomes. Pink/magenta for chromosomes, pale blue-white for spindle fibres and asters, no nuclear envelope drawn (it has broken down). No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.42, label: 'Condensed chromosome (two chromatids)', detail: "In prophase the tangled chromosomal material **condenses** into a compact mitotic chromosome. Each one is made of **two chromatids** — the two copies made during S phase.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.52, label: 'Centromere', detail: "The point where the **two chromatids are attached together**. In metaphase the two chromatids held here are called **sister chromatids**.", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.48, label: 'Kinetochore', detail: "A **small disc-shaped structure at the surface of the centromere**. It is the **site where spindle fibres attach** to the chromosome. Each chromatid has its own kinetochore facing an opposite pole.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.50, label: 'Spindle fibre', detail: "Fibres that stretch from the poles and attach to the kinetochores. Together with the asters they form the **mitotic apparatus** that will move the chromosomes into position.", icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.50, label: 'Aster & centrosome (pole)', detail: "The **centrosome** duplicated during S phase and has now moved to this pole. It radiates out microtubules called an **aster**. There is a matching pole on the opposite side.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.14, label: 'Metaphase plate (equator)', detail: "The **plane of alignment at the centre of the cell**. In metaphase all the chromosomes come to lie here along the **metaphase plate**.", icon: 'circle' },
      ],
    },
    // ── 6 · Exam tip — what disappears by end of prophase ─────────────────────
    {
      id: uuid(), type: 'callout', order: 6, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight — What Vanishes by the End of Prophase',
      markdown: "**Memorise this list — NEET tests it directly.** A cell at the **end of prophase**, viewed under the microscope, **does NOT show:**\n- **Golgi complexes**\n- **Endoplasmic reticulum**\n- **Nucleolus**\n- **Nuclear envelope**\n\nAll four are gone by the time prophase finishes. A quick memory hook: **G**olgi, **E**R, **N**ucleolus, **N**uclear envelope.\n\n**Classic NEET question:** \"Which of the following is NOT visible at the end of prophase?\" → any of **golgi complex, ER, nucleolus, or nuclear envelope** (all four have disappeared).",
    },
    // ── 7 · Heading — Metaphase ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Metaphase — Chromosomes Line Up Dead-Centre',
      objective: "By the end of this you can say what event marks the start of metaphase, why chromosome shape is best studied here, and how kinetochores connect each chromatid to a pole.",
    },
    // ── 8 · Text — Metaphase ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Metaphase has a clear starting gun: the **complete disintegration of the nuclear envelope**. Once that wall around the nucleus is fully gone, the **chromosomes are spread through the cytoplasm** of the cell — free of the nucleus that used to contain them.\n\nBy this stage the **condensation of chromosomes is completed**, so they can be seen clearly under the microscope. That's why metaphase is **the stage at which the morphology (shape) of chromosomes is most easily studied** — if you want a good look at a chromosome, this is the moment.\n\nA **metaphase chromosome is made up of two sister chromatids, held together by the centromere**. On the surface of each centromere sit **small disc-shaped structures called kinetochores**. These kinetochores are the **sites where spindle fibres attach** to the chromosome.\n\nHere is the arrangement, and it's the part NEET loves. All the chromosomes come to lie **at the equator** of the cell. For each chromosome, **one chromatid is connected by its kinetochore to spindle fibres from one pole, and its sister chromatid is connected by its kinetochore to spindle fibres from the opposite pole** — each half tethered to a different side. The **plane along which the chromosomes line up at the equator is called the metaphase plate**.",
    },
    // ── 9 · Reasoning prompt — nuclear envelope timing ────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student watches a mitotic cell under the microscope and notes the exact moment the nuclear envelope has completely broken down. Which stage is officially beginning at that moment?",
      options: [
        "Prophase — the nuclear envelope breaks down as prophase begins",
        "Metaphase — its complete disintegration of the nuclear envelope marks the start of metaphase",
        "Anaphase — the envelope must be gone before the chromatids can separate",
        "Telophase — the envelope disappears just before the cell splits in two",
      ],
      reveal: "The answer is metaphase. NCERT states plainly that **the complete disintegration of the nuclear envelope marks the start of** metaphase — that is the event that opens the stage. The tempting wrong choice is prophase: it's true the envelope is on its way out during prophase (it's one of the structures no longer visible at the *end* of prophase), but its *complete* disappearance is defined as the *start of metaphase*, not of prophase. Anaphase and telophase come later, after the chromosomes have already lined up and been pulled apart.",
      difficulty_level: 2,
    },
    // ── 10 · Comparison card — Prophase vs Metaphase ──────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Prophase vs Metaphase',
      columns: [
        {
          heading: 'Prophase',
          points: [
            'First stage of karyokinesis; follows the S and G2 phases',
            'Chromosomal material condenses into compact mitotic chromosomes',
            'Each chromosome seen to have two chromatids attached at the centromere',
            'Centrosome (duplicated in S phase) begins moving to opposite poles',
            'Each centrosome radiates microtubules called asters; asters + spindle fibres = mitotic apparatus',
            'By the end: golgi complex, ER, nucleolus and nuclear envelope are no longer visible',
          ],
        },
        {
          heading: 'Metaphase',
          points: [
            'Begins with the complete disintegration of the nuclear envelope',
            'Chromosomes are spread through the cytoplasm',
            'Chromosome condensation is complete — best stage to study chromosome shape (morphology)',
            'Each chromosome = two sister chromatids held by the centromere',
            'Kinetochores (discs on the centromere) are the sites where spindle fibres attach',
            'All chromosomes line up at the equator along the metaphase plate; each chromatid tethered by its kinetochore to a spindle fibre from an opposite pole',
          ],
        },
      ],
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Mitosis = equational division** — parent and progeny cells have the **same chromosome number**.\n- **Karyokinesis has four stages, in order:** prophase → metaphase → anaphase → telophase. Division is progressive; the lines between stages aren't sharp.\n- **Prophase** = chromosomes **condense** (two chromatids joined at the centromere) + **centrosome moves to the poles**, radiating **asters** (asters + spindle fibres = mitotic apparatus).\n- **By the end of prophase, four things are gone:** golgi complex, ER, nucleolus, nuclear envelope.\n- **Metaphase** starts with **complete disintegration of the nuclear envelope**; chromosomes line up at the **metaphase plate**; **kinetochores** on the centromere are where **spindle fibres attach**.\n- **Best stage to study chromosome shape = metaphase** (condensation is complete).",
    },
    // ── 12 · Exam tip — classic NEET one-liners ───────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight — The One-Liners They Reuse',
      markdown: "**Kinetochore = the attachment site.** Kinetochores are small disc-shaped structures found **on the surface of the centromere**, and they are the **sites where spindle fibres attach**. Don't confuse the kinetochore (the disc) with the centromere (the point holding the two chromatids together).\n\n**Metaphase = the equator.** Chromosomes align at the equator of the cell along the **metaphase plate**, and this is the stage where **chromosome morphology is most easily studied** (condensation is complete).\n\n**Classic NEET question:** \"Chromosomes align at the equator of the cell during ___\" → **metaphase**.\n**Classic NEET question:** \"Kinetochores are found on the ___\" → **centromere**.",
    },
    // ── 13 · Bridge text ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "So far the cell has packed its chromosomes, torn down its nucleus, and lined everything up at the metaphase plate with each chromatid tied to an opposite pole — like a tug-of-war rope pulled taut but not yet released. Next, the rope is released: in **anaphase** the sister chromatids are hauled to opposite poles, in **telophase** two new nuclei rebuild, and finally **cytokinesis** splits the cell body itself in two.",
    },
    // ── 14 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why is mitosis also called equational division?",
          options: [
            "Because the cytoplasm is divided into two exactly equal halves during cytokinesis",
            "Because the parent cell and the progeny cells end up with the same number of chromosomes",
            "Because the chromosomes line up in an equal row along the metaphase plate",
            "Because each chromosome splits into two chromatids of equal length",
          ],
          correct_index: 1,
          explanation: "NCERT gives one specific reason: the number of chromosomes in the parent and progeny cells is the **same**, so the division is 'equational' — the chromosome count stays equal on both sides. The equal cytoplasm split, the equatorial line-up, and equal-length chromatids are all real features of division, but none of them is the reason for the name 'equational division.'",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "By the end of prophase, which set of structures is NO LONGER visible under the microscope?",
          options: [
            "Golgi complex, endoplasmic reticulum, nucleolus and nuclear envelope",
            "Centrosome, asters, spindle fibres and kinetochores",
            "Chromatids, centromere, metaphase plate and cytoplasm",
            "Nuclear envelope, chromatids, spindle fibres and centromere",
          ],
          correct_index: 0,
          explanation: "NCERT lists exactly four things absent at the end of prophase: golgi complex, ER, nucleolus and nuclear envelope. Option 2 is wrong because the centrosome, asters and spindle fibres are the mitotic apparatus that is actively forming during prophase — they're appearing, not disappearing. Options 3 and 4 mix in structures (chromatids, centromere, spindle fibres) that are present, so they can't be the 'no longer visible' set.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "What event marks the START of metaphase?",
          options: [
            "The condensation of chromosomal material into compact chromosomes",
            "The movement of the centrosome towards opposite poles",
            "The complete disintegration of the nuclear envelope",
            "The separation of sister chromatids towards opposite poles",
          ],
          correct_index: 2,
          explanation: "NCERT is explicit: the complete disintegration of the nuclear envelope marks the start of metaphase, after which the chromosomes spread through the cytoplasm. Chromosome condensation and centrosome movement are prophase events, and the separation of sister chromatids belongs to anaphase, the stage after metaphase.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "During metaphase, how is each chromosome connected to the poles of the cell?",
          options: [
            "The centromere of each chromosome fuses directly with the aster at one pole",
            "Each whole chromosome is attached by a single spindle fibre to just one pole",
            "One chromatid is connected by its kinetochore to spindle fibres from one pole, and its sister chromatid by its kinetochore to spindle fibres from the opposite pole",
            "The nuclear envelope holds the chromosomes in place at the equator until anaphase",
          ],
          correct_index: 2,
          explanation: "NCERT describes it precisely: each of the two sister chromatids has its own kinetochore, and the two kinetochores face opposite poles — one chromatid's kinetochore links to spindle fibres from one pole, the sister's to fibres from the opposite pole. Option 2 wrongly ties the whole chromosome to a single pole; option 1 confuses the kinetochore attachment with a fusion to the aster; and option 4 is impossible because the nuclear envelope has already completely disintegrated by metaphase.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
