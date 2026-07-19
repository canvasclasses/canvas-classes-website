'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'auxins-gibberellins-cytokinins',
  title: 'The Growth Promoters — Auxins, Gibberellins & Cytokinins',
  subtitle: "Three plant hormones that push growth forward — one roots your cuttings and keeps the boss bud in charge, one stretches stems and stalks, and one drives cell division. Learn which effect belongs to which, because that exact match is what NEET asks.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['plant-growth-and-development', 'plant-growth-regulators'],
  glossary: [
    { term: 'auxin', definition: 'A plant growth regulator (from Greek "auxein", to grow), first isolated from human urine. Natural auxins include IAA and IBA; NAA and 2,4-D are synthetic auxins.' },
    { term: 'IAA (indole-3-acetic acid)', definition: 'A natural auxin isolated from plants; it is the compound the term "auxin" was originally applied to.' },
    { term: 'apical dominance', definition: 'The phenomenon in most higher plants where the growing apical bud inhibits the growth of the lateral (axillary) buds. Caused by auxin.' },
    { term: 'decapitation', definition: 'Removal of the shoot tips of a plant; because it removes the source of apical dominance, the lateral buds then grow. Used in tea plantations and hedge-making.' },
    { term: 'parthenocarpy', definition: 'The development of fruit without fertilisation. Auxins can induce it, for example in tomatoes.' },
    { term: 'gibberellin', definition: 'A promotory plant growth regulator; more than 100 are known (from fungi and higher plants), denoted GA1, GA2, GA3 and so on. All gibberellins are acidic.' },
    { term: 'bolting', definition: 'Internode elongation just prior to flowering. Gibberellins promote it in beet, cabbages and many rosette-habit plants.' },
    { term: 'cytokinin', definition: 'A plant growth regulator with specific effects on cytokinesis (cell division). First discovered as kinetin; zeatin is a natural cytokinin from corn-kernels and coconut milk.' },
    { term: 'senescence', definition: 'The ageing of a plant part. Gibberellins delay it in fruits; cytokinins delay it in leaves by mobilising nutrients toward them.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A young plant on dark soil sending out fresh green shoots and roots, lit softly from one side',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single young green plant grows out of dark, rich soil in the centre of the frame, sending out fresh new shoots at the top and pale new roots below the soil line, softly lit from one side by warm light. In the deep shadows around it are faint suggestions of more sprouting seedlings, a cut stem taking root, and a tall stretched stalk, hinting at growth and propagation without becoming a labelled diagram. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The First Growth Hormone Came From Human Urine',
      markdown: "The very first auxin — the hormone that makes plants grow toward light and pushes their shoots and roots longer — was not first isolated from a plant at all. It was **first isolated from human urine**. Only later were the same growth-regulating compounds found inside plants themselves. The word **auxin** even comes from the Greek *auxein*, meaning simply \"to grow.\"",
    },
    // ── 2 · Core concept — what a growth promoter is ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A plant doesn't have a brain or nerves. So how does it decide where to grow, when to flower, or which bud to push forward? It uses chemical messengers called **plant growth regulators (PGRs)**. Some of them slow the plant down or help it survive stress. But three of them do the opposite — they **promote growth**, driving the plant to get taller, root faster, and divide its cells. These three **growth promoters** are the **auxins**, the **gibberellins**, and the **cytokinins**.\n\nThe trick to this topic is not memorising a hundred effects loosely. It's tying each specific job to the *right* hormone. Auxin, gibberellin, and cytokinin each own a distinct set of famous jobs — and NEET tests you by naming a job and asking which hormone does it. Learn them job-by-job.",
    },
    // ── 3 · Heading — Auxins ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Auxins — The Rooting, Bossing, Weed-Killing Hormone',
      objective: "By the end of this you can list which auxins are natural and which are synthetic, and name auxin's signature jobs — rooting, apical dominance, parthenocarpy, and weed-killing.",
    },
    // ── 4 · Text — auxin sources, types, effects ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Auxins are **generally produced by the growing apices (tips) of the stems and roots**, and from there they **migrate** down to the regions where they act. There are two families you must keep apart:\n\n- **Natural auxins** (isolated from plants): **IAA (indole-3-acetic acid)** and **IBA (indole butyric acid)**.\n- **Synthetic auxins** (man-made): **NAA (naphthalene acetic acid)** and **2,4-D (2,4-dichlorophenoxyacetic acid)**.\n\nWhat do auxins actually do? A whole list of jobs, and each one gets tested:\n\n- They **initiate rooting in stem cuttings** — this is why gardeners dip a cutting in rooting hormone to make it grow roots. It's used widely for **plant propagation**.\n- They **promote flowering**, for example in **pineapples**.\n- They **prevent fruit and leaf drop at early stages**, but **promote the abscission (shedding) of older, mature leaves and fruits** — so young ones stay on, old ones fall.\n- They induce **parthenocarpy** — fruit without fertilisation — for example in **tomatoes**.\n- They are used as **herbicides**: **2,4-D kills dicotyledonous (broad-leaf) weeds but does not affect mature monocots** like grass, which is exactly how you make a **weed-free lawn**.\n- They also **control xylem differentiation** and **help in cell division**.",
    },
    // ── 5 · Interactive image — apical dominance ──────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Two plants side by side: the left one has an intact apical bud with lateral buds suppressed, the right one has its tip cut off and its lateral buds have grown into branches',
      caption: '📸 Tap each dot to explore how the apical bud keeps the side buds in check — and what happens when you cut it off (Figure 13.11).',
      generation_prompt: "Scientific textbook illustration of apical dominance in plants, showing two plants side by side for comparison. Flat 2D educational diagram on a dark background (#0a0a0a near-black). LEFT plant (a): a single upright plant with its apical bud intact at the very top, a straight main stem, and small dormant lateral (axillary) buds sitting in the leaf axils along the stem but NOT growing out. RIGHT plant (b): the same plant but with the shoot tip cut off (decapitated), and now the lateral buds have grown out into full side branches, giving a bushy shape. Clean white outlines, biologically accurate proportions, green stems and leaves (living/photosynthetic tissue), a small cut mark where the tip was removed on the right plant. Labels in white text with thin white leader lines. Label the left plant '(a) apical bud intact', the right plant '(b) apical bud removed'. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.12, label: 'Apical bud (intact)', detail: 'The growing bud at the very tip of the shoot. While it is present and active, it **inhibits the growth of the lateral buds below** — this is **apical dominance**, and auxin from the tip is the cause.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.5, label: 'Suppressed lateral buds', detail: 'The **lateral (axillary) buds** sit in the leaf axils but stay dormant. The apical bud is keeping them switched off, so the plant grows tall and unbranched.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.1, label: 'Decapitated tip', detail: '**Decapitation** = removal of the shoot tip. With the apical bud gone, its source of auxin is gone too, so its grip on the lateral buds is released.', icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.42, label: 'Lateral buds now growing', detail: 'Freed from apical dominance, the **lateral buds grow out into branches**. The plant becomes bushy instead of tall.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.78, label: 'Why it matters', detail: 'This is why **tea plantations and hedge-making** deliberately cut the tips — decapitation forces side branches, making the bush denser and fuller.', icon: 'circle' },
      ],
    },
    // ── 6 · Reasoning prompt — match the effect to the hormone (auxin) ────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A gardener wants a dense, bushy hedge, so she snips off the growing tips of every plant. A few weeks later the side branches have burst out and the hedge is full. Which statement correctly explains what happened?",
      options: [
        "Cutting the tip removed the source of auxin, ending apical dominance, so the lateral buds were free to grow into branches.",
        "Cutting the tip added auxin to the lateral buds, which forced them to grow into branches.",
        "Cutting the tip released gibberellin, which caused bolting and made the side branches elongate.",
        "Cutting the tip triggered cytokinin at the apex, which is what normally holds the lateral buds back.",
      ],
      reveal: "The first option is right. The apical bud is the source of auxin, and that auxin is what keeps the lateral buds suppressed — a phenomenon called apical dominance. Remove the tip (decapitation) and you remove the auxin, so the lateral buds are released and grow into branches. Option 2 has it backwards: auxin from the tip *inhibits* the side buds, it doesn't force them to grow. Option 3 wrongly credits gibberellin — bolting is internode elongation before flowering, not the branching effect here. Option 4 is doubly wrong: it's auxin, not cytokinin, that maintains apical dominance, and cytokinins actually help *overcome* apical dominance.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — Gibberellins ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Gibberellins — The Stretch Hormone',
      objective: "By the end of this you can state that all gibberellins are acidic, that GA3 is the most studied, and name the elongation jobs — grape stalks, sugarcane yield, and bolting.",
    },
    // ── 8 · Text — gibberellins ───────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Gibberellins are the second group of growth promoters. There are **more than 100** of them, reported from very different organisms — from **fungi to higher plants**. They are named **GA1, GA2, GA3** and so on. **Gibberellic acid (GA3)** was one of the first to be discovered and is still the **most intensively studied**. One fact NEET loves: **all gibberellins are acidic**.\n\nThink of gibberellin as the **stretch** hormone — its headline power is increasing the **length of the axis** (the stem). Look at where that shows up:\n\n- It **lengthens grape stalks** — the ability to increase axis length used directly on grapes.\n- It makes **apples elongate and improves their shape**.\n- It **delays senescence (ageing)**, so **fruits can be left on the tree longer** to extend the market period.\n- **GA3 speeds up the malting process** in the brewing industry.\n- Spraying **sugarcane** increases stem length, boosting yield by as much as **20 tonnes per acre** (sugarcane stores its sugar in the stem, so a longer stem means more sugar).\n- Spraying **juvenile conifers** hastens maturity, leading to **early seed production**.\n- It promotes **bolting** — **internode elongation just before flowering** — in **beet, cabbages and many rosette-habit plants**.",
    },
    // ── 9 · Heading — Cytokinins ──────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Cytokinins — The Cell-Division Hormone',
      objective: "By the end of this you can explain the kinetin-vs-zeatin story, name where cytokinins are made, and give their signature jobs — cell division, overcoming apical dominance, and delaying leaf senescence.",
    },
    // ── 10 · Text — cytokinins ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Cytokinins get their name from their **specific effect on cytokinesis** — cell division. Their discovery story is worth knowing because it gets tested:\n\n- They were first discovered as **kinetin** — a **modified form of adenine (a purine)** — from **autoclaved herring sperm DNA**. Watch the trap: **kinetin does not occur naturally in plants.**\n- The search for a *natural* cytokinin led to **zeatin**, isolated from **corn-kernels and coconut milk**. Zeatin is the natural one.\n\nNatural cytokinins are **synthesised in regions where rapid cell division happens** — **root apices, developing shoot buds, and young fruits**. Their jobs:\n\n- They help **produce new leaves, chloroplasts in leaves, lateral shoot growth, and adventitious shoot formation**.\n- They help **overcome apical dominance** — the exact opposite of auxin, which *causes* it.\n- They **promote nutrient mobilisation**, which helps **delay the senescence (ageing) of leaves** — nutrients are pulled toward the leaf, keeping it green and alive longer.",
    },
    // ── 11 · Comparison card — the three promoters ────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11,
      title: 'Auxin vs Gibberellin vs Cytokinin — Who Does What',
      columns: [
        {
          heading: 'Auxin',
          points: [
            'Made at growing apices of stems and roots',
            'Natural: IAA, IBA · Synthetic: NAA, 2,4-D',
            'Initiates rooting in stem cuttings (propagation)',
            'Causes apical dominance (tip suppresses side buds)',
            'Induces parthenocarpy (e.g. tomato)',
            'Herbicide: 2,4-D kills dicot weeds, spares monocots',
          ],
        },
        {
          heading: 'Gibberellin',
          points: [
            'Over 100 known (fungi + higher plants); all acidic',
            'GA3 first discovered, most studied',
            'Increases length of axis — grape stalks, sugarcane yield',
            'Delays fruit senescence (leave fruit on the tree longer)',
            'Speeds up malting in brewing',
            'Promotes bolting in beet, cabbage, rosette plants',
          ],
        },
        {
          heading: 'Cytokinin',
          points: [
            'Made where cells divide fast — root apices, shoot buds, young fruits',
            'Kinetin (not natural) from herring sperm DNA · Zeatin is natural',
            'Specific effect on cytokinesis (cell division)',
            'New leaves, chloroplasts, lateral shoots, adventitious shoots',
            'Helps OVERCOME apical dominance',
            'Delays leaf senescence via nutrient mobilisation',
          ],
        },
      ],
    },
    // ── 12 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In — One Hormone, Its Signature Jobs',
      markdown: "- **Auxin** = **rooting** in stem cuttings · **apical dominance** · **parthenocarpy** · herbicide **2,4-D** (kills dicot weeds, spares monocots). Natural = IAA, IBA; synthetic = NAA, 2,4-D.\n- **Gibberellin** = **axis / stem elongation** (grape stalks, sugarcane yield) · **bolting** · **delays fruit senescence** · speeds up **malting**. All GAs are **acidic**; **GA3** is the most studied.\n- **Cytokinin** = **cell division (cytokinesis)** · **overcomes apical dominance** · **delays leaf senescence**. **Kinetin** is NOT natural (from herring sperm DNA); **zeatin** IS natural (corn-kernels, coconut milk).\n- The trap NEET loves: **auxin CAUSES apical dominance, cytokinin OVERCOMES it.** Opposite hormones, same phenomenon.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Apical dominance:** caused by **auxin** (produced at the apical bud). **Overcoming apical dominance:** done by **cytokinin**. Examiners put these two in the same question on purpose — keep them straight.\n\n**Bolting** (internode elongation just before flowering in rosette plants) → **gibberellin**. **Parthenocarpy** (tomato) and **rooting of cuttings** → **auxin**. **Delay of leaf senescence** → **cytokinin**; **delay of fruit senescence** → **gibberellin**.\n\n**Natural vs synthetic auxin** is a favourite one-liner: **IAA and IBA are natural; NAA and 2,4-D are synthetic.** And **kinetin is not natural, zeatin is.**\n\n**Classic NEET question:** \"Apical dominance in plants is caused by ___\" → **auxin**. Watch for the twin: \"Which hormone helps overcome apical dominance?\" → **cytokinin**.",
    },
    // ── 14 · Bridge text ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So far every hormone here has pushed growth **forward** — rooting, stretching, dividing. But a plant also needs to know when to **stop**: to drop its leaves before winter, to keep a seed dormant, to close its pores in a drought. On the next page you'll meet the two regulators that put on the brakes — **ethylene** and **abscisic acid (ABA)**.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which of the following is a pair of synthetic auxins?",
          options: [
            "IAA and IBA",
            "NAA and 2,4-D",
            "GA3 and zeatin",
            "Kinetin and IAA",
          ],
          correct_index: 1,
          explanation: "NAA (naphthalene acetic acid) and 2,4-D are the synthetic auxins. IAA and IBA are the natural auxins isolated from plants, so option 1 is the tempting reverse. GA3 is a gibberellin and zeatin is a cytokinin, so option 3 mixes hormone families entirely; kinetin is a cytokinin, so option 4 is also wrong.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A plant's growing apical bud is keeping its lateral buds from sprouting. Which hormone is responsible, and what is this phenomenon called?",
          options: [
            "Cytokinin causes it, and the phenomenon is called bolting",
            "Gibberellin causes it, and the phenomenon is called parthenocarpy",
            "Auxin causes it, and the phenomenon is called apical dominance",
            "Auxin causes it, and the phenomenon is called abscission",
          ],
          correct_index: 2,
          explanation: "Auxin produced at the apical bud inhibits the lateral (axillary) buds — this is apical dominance. Cytokinin actually helps overcome apical dominance, so option 1 reverses the roles (and bolting is a gibberellin effect). Gibberellin and parthenocarpy in option 2 are both wrong for this phenomenon. Option 4 names the right hormone but the wrong term: abscission is the shedding of leaves and fruits, not the suppression of side buds.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Spraying a sugarcane crop with gibberellins can raise the yield by as much as 20 tonnes per acre. What is the direct reason?",
          options: [
            "Gibberellins increase the length of the stem, and sugarcane stores its sugar in the stem",
            "Gibberellins induce parthenocarpy, so each plant produces extra seedless fruits",
            "Gibberellins overcome apical dominance, so many more side shoots form",
            "Gibberellins initiate rooting, so the crop absorbs far more water",
          ],
          correct_index: 0,
          explanation: "Gibberellins increase the length of the axis (the stem), and because sugarcane stores its carbohydrate as sugar in the stem, a longer stem means more stored sugar and a bigger yield. Parthenocarpy (option 2) and rooting of cuttings (option 4) are auxin effects, and overcoming apical dominance (option 3) is a cytokinin effect — none of them explains the sugarcane result.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Kinetin was the first cytokinin discovered. Which statement about it is correct?",
          options: [
            "It is a natural cytokinin isolated from corn-kernels and coconut milk",
            "It is a modified form of adenine obtained from autoclaved herring sperm DNA, and it does not occur naturally in plants",
            "It is a synthetic auxin used to kill dicotyledonous weeds",
            "It is an acidic gibberellin that promotes bolting in rosette plants",
          ],
          correct_index: 1,
          explanation: "Kinetin is a modified form of adenine (a purine), discovered from autoclaved herring sperm DNA, and it does not occur naturally in plants. Option 1 describes zeatin — the natural cytokinin from corn-kernels and coconut milk — not kinetin. Option 3 describes 2,4-D, a synthetic auxin, and option 4 describes gibberellins; both belong to different hormone families.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
