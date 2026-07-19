'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mechanism-of-hormone-action',
  title: 'How Hormones Act on Their Target Cells',
  subtitle: "A hormone travels through the whole body but changes only a few cells. This page shows why — and the two very different ways it flips the switch once it reaches the right cell.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['chemical-coordination-and-integration', 'hormone-action'],
  glossary: [
    { term: 'hormone receptor', definition: 'A specific protein that a hormone binds to. Receptors are found only in the target tissues, which is why a hormone affects some cells and ignores the rest.' },
    { term: 'target tissue', definition: 'The particular tissue a hormone acts on — the one carrying the matching receptor for that hormone.' },
    { term: 'membrane-bound receptor', definition: 'A hormone receptor sitting on the cell membrane (the outer surface) of a target cell. The hormone binds it from outside and usually does not enter the cell.' },
    { term: 'intracellular receptor', definition: 'A hormone receptor located inside the target cell — mostly inside the nucleus (a nuclear receptor). The hormone must enter the cell to reach it.' },
    { term: 'hormone-receptor complex', definition: 'The structure formed when a hormone binds to its receptor. Its formation triggers the biochemical changes that give the hormone its effect.' },
    { term: 'second messenger', definition: 'A molecule made inside the cell (for example cyclic AMP, IP3 or Ca²⁺) when a hormone binds a membrane-bound receptor. It carries the signal onward and regulates the cell\'s metabolism, so the hormone itself never has to enter.' },
    { term: 'cyclic AMP', definition: 'A common second messenger generated inside a target cell after a hormone binds a membrane-bound receptor on the surface.' },
    { term: 'gene expression', definition: 'The switching on (or off) of genes. Hormones that use intracellular receptors act by regulating gene expression through the hormone-receptor complex interacting with the genome.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing molecule drifting through the bloodstream toward one cell whose surface lights up in response, while neighbouring cells stay dark',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single small glowing molecule drifts through a dark, blood-red-tinted bloodstream toward a cluster of cells. Only one cell in the cluster softly lights up along its outer edge, as if recognising the molecule, while the neighbouring cells remain dim and unlit in deep shadow. Suggest the idea of a message reaching exactly one recipient among many, without any literal labels or diagram elements. Painterly, atmospheric illustration, dark background throughout (#0a0a0a base tones), warm faint highlights only on the one responding cell, no text, no labels, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Message, But Only a Few Cells Listen',
      markdown: "When a gland releases a hormone, it doesn't get delivered like a letter to one address. It pours into the blood and reaches **every cell in your body** — heart, skin, bone, everything. Yet only a handful of cells actually respond. A thyroid hormone rushing past a skin cell does nothing to it. So how does the same molecule, touching every cell, change only the right ones? The answer is a single specific protein — and cells that don't carry it simply never get the message.",
    },
    // ── 2 · Core concept — hormones need receptors, receptors are specific ──
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A hormone can't do anything to a cell on its own. To produce an effect, it first has to **bind to a specific protein** inside or on that cell. These proteins are called **hormone receptors**, and here is the key point: receptors are **located in the target tissues only**. That's the whole reason a hormone acts on some cells and ignores the rest — a cell without the matching receptor has nothing for the hormone to grab onto.\n\nWhen a hormone binds its receptor, the two lock together to form a **hormone-receptor complex**. And each receptor is **specific to one hormone only** — one receptor, one hormone, like one lock and one key. This complex is what sets off **biochemical changes** in the target tissue, and through those changes the hormone **regulates the tissue's metabolism** and its **physiological functions**.",
    },
    // ── 3 · Heading — two kinds of receptors ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Two Kinds of Receptors — On the Surface, or Inside',
      objective: "By the end of this you can say where each type of receptor sits, whether the hormone enters the cell, and how the message gets carried onward in each case.",
    },
    // ── 4 · Text — membrane-bound vs intracellular ──────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Receptors come in two locations, and this single difference decides everything about how the hormone works.\n\n**Membrane-bound receptors** sit on the **cell membrane** — the outer surface of the target cell. A hormone that uses this kind of receptor binds it from outside and **normally does not enter the cell at all**. Instead, binding makes the cell produce **second messengers** inside itself — molecules like **cyclic AMP**, IP3 and Ca²⁺. These second messengers then carry the signal onward and **regulate the cell's metabolism**. So the hormone stays outside; a stand-in relays the message within.\n\n**Intracellular receptors** are found **inside** the target cell — mostly **nuclear receptors**, sitting in the nucleus. A hormone that uses this kind must **enter the cell** to reach its receptor. Once bound, the hormone-receptor complex **interacts with the genome** and mostly **regulates gene expression or chromosome function** — it switches genes on or off. Steroid hormones and the thyroid hormones (iodothyronines) work this way.",
    },
    // ── 5 · Interactive image — Figure 19.5 a & b contrast ──────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Two target cells side by side: on the left a peptide hormone binds a receptor on the cell surface and triggers cyclic AMP inside; on the right a steroid hormone passes through the membrane to a nuclear receptor and acts on DNA',
      caption: '📸 Tap each dot to explore the two ways a hormone flips the switch inside a target cell.',
      generation_prompt: "Scientific textbook illustration contrasting two mechanisms of hormone action, side by side, like Figure 19.5 a and b. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. LEFT cell (a): a small peptide/protein hormone (drawn as a small magenta blob) binds to a receptor protein embedded in the cell membrane at the surface; the hormone stays outside; inside the cell a labelled 'second messenger (cyclic AMP)' molecule appears and small arrows fan out into the cytoplasm to show it regulating metabolism. RIGHT cell (b): a steroid hormone (drawn as a small green/tan four-ring molecule) passes straight through the cell membrane into the cell, binds an intracellular receptor drawn inside the nucleus, and the hormone-receptor complex sits on a strand of DNA showing gene expression. Nucleus shown as a rounded inner compartment in each cell. Biologically clean, no photorealism, no cartoon, no mascots, dark background.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.30, label: 'Membrane-bound receptor', detail: "On the **left cell**, the receptor is embedded in the cell membrane, on the surface. Peptide and protein hormones (and amino-acid derivatives like epinephrine) bind here — from **outside** the cell.", icon: 'circle' },
        { id: uuid(), x: 0.10, y: 0.14, label: 'Hormone stays outside', detail: "The membrane-bound hormone **normally does not enter the cell**. It binds the surface receptor and its job is done at the doorstep.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.55, label: 'Second messenger (cyclic AMP)', detail: "Binding makes the cell produce **second messengers** inside — **cyclic AMP**, IP3, Ca²⁺. These relay the message and **regulate the cell's metabolism**.", icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.18, label: 'Steroid hormone enters', detail: "On the **right cell**, a steroid hormone (or a thyroid hormone) passes **through the membrane and into the cell** — because its receptor is inside.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.42, label: 'Intracellular / nuclear receptor', detail: "The receptor waits **inside** the cell, mostly in the **nucleus**. The hormone binds it here to form the **hormone-receptor complex**.", icon: 'circle' },
        { id: uuid(), x: 0.84, y: 0.68, label: 'Gene expression', detail: "The complex **interacts with the genome** and mostly **regulates gene expression or chromosome function** — switching genes on or off to produce the effect.", icon: 'circle' },
      ],
    },
    // ── 6 · Comparison card — membrane-bound vs intracellular ───────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Membrane-bound vs Intracellular Receptors',
      columns: [
        {
          heading: 'Membrane-bound receptors',
          points: [
            'Located on the cell membrane (surface of the target cell)',
            'Used by peptide / protein hormones and amino-acid derivatives (e.g. epinephrine)',
            'Hormone normally does NOT enter the cell',
            'Generate second messengers (cyclic AMP, IP3, Ca²⁺)',
            'Second messengers regulate cellular metabolism',
          ],
        },
        {
          heading: 'Intracellular receptors',
          points: [
            'Located inside the cell, mostly nuclear receptors (in the nucleus)',
            'Used by steroid hormones and iodothyronines (thyroid hormones)',
            'Hormone enters the cell to reach the receptor',
            'Hormone-receptor complex interacts with the genome',
            'Mostly regulate gene expression / chromosome function',
          ],
        },
      ],
    },
    // ── 7 · Heading — four chemical classes ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Four Chemical Classes of Hormones',
      objective: "By the end of this you can sort any named hormone into one of four chemical groups — and know that its group tells you which kind of receptor it uses.",
    },
    // ── 8 · Text — four groups ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Hormones don't all have the same chemical build. On the basis of their **chemical nature**, NCERT divides them into **four groups**. This isn't just filing — the group a hormone belongs to is what decides which receptor it uses.\n\nThe **peptide, polypeptide and protein hormones** (like insulin, glucagon, the pituitary hormones and the hypothalamic hormones) and the **amino-acid derivatives** (like epinephrine) use **membrane-bound receptors** and work through second messengers. The **steroids** (like cortisol, testosterone, estradiol and progesterone) and the **iodothyronines** — the thyroid hormones — use **intracellular receptors** and work by regulating genes. So once you know a hormone's chemical class, you already know how it acts.",
    },
    // ── 9 · Table — four chemical classes ───────────────────────────────────
    {
      id: uuid(), type: 'table', order: 9,
      caption: 'The four chemical classes of hormones, with NCERT\'s own examples',
      headers: ['Chemical class', 'Examples', 'Receptor used'],
      rows: [
        ['Peptide / polypeptide / protein', 'Insulin, glucagon, pituitary hormones, hypothalamic hormones', 'Membrane-bound → second messengers'],
        ['Steroids', 'Cortisol, testosterone, estradiol, progesterone', 'Intracellular → gene expression'],
        ['Iodothyronines', 'Thyroid hormones', 'Intracellular → gene expression'],
        ['Amino-acid derivatives', 'Epinephrine', 'Membrane-bound → second messengers'],
      ],
    },
    // ── 10 · Reasoning prompt — sort by mechanism ───────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A hormone binds a receptor and, without ever entering the cell, causes cyclic AMP to be made inside. Which hormone fits this description?",
      options: [
        "Cortisol, a steroid hormone",
        "Insulin, a protein hormone",
        "A thyroid hormone (iodothyronine)",
        "Estradiol, a steroid hormone",
      ],
      reveal: "Insulin is the answer. The clue 'does not enter the cell' + 'cyclic AMP made inside' describes a hormone using a membrane-bound receptor and a second messenger — and that pathway belongs to peptide/protein hormones (and amino-acid derivatives). Insulin is a protein hormone, so it fits. Cortisol and estradiol are steroids, and thyroid hormones are iodothyronines; all three use intracellular receptors, enter the cell, and regulate gene expression rather than making a second messenger. The steroid options are the tempting traps because steroids are famous — but steroids do exactly the opposite of what the question describes.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Receptors are specific** — one receptor binds one hormone only, and receptors sit **in target tissues only**. That's why a hormone reaches every cell but acts on just a few.\n- **Membrane-bound receptors** → on the cell surface → the hormone **stays outside** and works through **second messengers (cyclic AMP, IP3, Ca²⁺)**. Used by **peptide / protein hormones** and **amino-acid derivatives (epinephrine)**.\n- **Intracellular / nuclear receptors** → inside the cell → the hormone **enters the cell** and works by **regulating gene expression**. Used by **steroids** and **thyroid hormones (iodothyronines)**.\n- **Four chemical classes:** (i) peptide/polypeptide/protein, (ii) steroids, (iii) iodothyronines, (iv) amino-acid derivatives.\n- Every action starts with the **hormone-receptor complex**; its formation triggers the biochemical changes.",
    },
    // ── 12 · Exam tip ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Membrane-bound receptor:** hormone does not enter the cell; generates a **second messenger** (cyclic AMP). Used by peptide/protein hormones + epinephrine.\n\n**Intracellular / nuclear receptor:** hormone enters the cell; regulates **gene expression**. Used by steroids + thyroid hormones (iodothyronines).\n\n**The classic trap:** NEET loves to give you a steroid or thyroid hormone and ask about second messengers, or give you a peptide hormone and ask about gene regulation — the swapped pairing. Anchor it as: *steroids and thyroid go IN and hit the genes; peptides and epinephrine stay OUT and send a messenger.*\n\n**Classic NEET question:** \"Steroid hormones act through ______ receptors.\" → **intracellular (nuclear)** receptors. And: \"Peptide hormones generate ______ inside the cell.\" → **second messengers (e.g. cyclic AMP)**.",
    },
    // ── 13 · Closing synthesis — chapter + whole book ───────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "Step back and look at the whole endocrine story you've just walked through. It's one clean chain: **glands** — the hypothalamus, pituitary, thyroid, adrenals, pancreas and the rest — release **hormones** into the blood; those hormones travel everywhere but bind only to their matching **receptors** in the target tissues; and that binding, through a second messenger or a switched-on gene, becomes a real change in how your body runs. Glands → hormones → receptors → response. That's chemical coordination, start to finish.\n\nAnd with this page, the human-physiology unit is complete — and so is this whole Class 11 Biology book. Think about the distance you've covered: you began with *the living world* and how we name and sort every organism, moved through the *cell* and its molecules, and have now arrived at the two great systems — nervous and endocrine — that pull a whole trillion-celled body together into one coordinated, responding, living thing. From the smallest unit to the fully integrated organism, the arc is finished. Well done for seeing it all the way through.",
    },
    // ── 14 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why does a hormone that reaches every cell in the body act on only a few of them?",
          options: [
            "Only a few cells are close enough to the gland to receive the hormone in time",
            "Only the target tissues carry the specific receptor the hormone can bind to",
            "The hormone is destroyed by every cell except the ones it is meant to act on",
            "Only a few cells are large enough to let the hormone pass through their membrane",
          ],
          correct_index: 1,
          explanation: "NCERT is specific: hormone receptors are located in the target tissues only, and each receptor is specific to one hormone. A cell without the matching receptor has nothing for the hormone to bind, so it never responds — it has nothing to do with distance, destruction, or cell size.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A hormone binds a receptor on the cell surface, stays outside the cell, and triggers cyclic AMP inside. Which type of hormone behaves this way?",
          options: [
            "A steroid hormone such as cortisol",
            "A thyroid hormone (iodothyronine)",
            "A peptide or protein hormone such as insulin",
            "Any hormone that uses an intracellular nuclear receptor",
          ],
          correct_index: 2,
          explanation: "Staying outside the cell and working through a second messenger like cyclic AMP is the membrane-bound receptor pathway, used by peptide/protein hormones (and amino-acid derivatives like epinephrine). Steroids and thyroid hormones do the opposite — they enter the cell and use intracellular receptors, so options 1, 2 and 4 all describe the wrong mechanism.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How do steroid hormones and thyroid hormones mainly produce their effects?",
          options: [
            "By binding membrane-bound receptors and generating second messengers",
            "By entering the cell and binding intracellular receptors that regulate gene expression",
            "By being converted into cyclic AMP on the cell surface",
            "By blocking the cell membrane so no other hormone can bind it",
          ],
          correct_index: 1,
          explanation: "Steroid hormones and iodothyronines interact with intracellular receptors — the hormone enters the cell and the hormone-receptor complex mostly regulates gene expression or chromosome function. Second messengers and cyclic AMP (options 1 and 3) belong to the membrane-bound pathway, and option 4 is a mechanism NCERT never describes.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which set correctly lists the four chemical classes of hormones given by NCERT?",
          options: [
            "Peptide/protein, steroids, iodothyronines, amino-acid derivatives",
            "Peptide/protein, steroids, second messengers, growth factors",
            "Steroids, iodothyronines, cyclic AMP, amino-acid derivatives",
            "Peptide/protein, carbohydrates, steroids, amino-acid derivatives",
          ],
          correct_index: 0,
          explanation: "NCERT's four chemical groups are: (i) peptide/polypeptide/protein hormones, (ii) steroids, (iii) iodothyronines (thyroid hormones), and (iv) amino-acid derivatives. The wrong options smuggle in things that aren't chemical classes at all — second messengers and cyclic AMP are signalling molecules, growth factors are a separate tissue secretion, and carbohydrates are not a hormone class.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
