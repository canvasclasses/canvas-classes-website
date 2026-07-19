'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-three-tissue-systems',
  title: 'The Three Tissue Systems',
  subtitle: "Every root, stem, and leaf is built from the same three tissue systems, arranged differently in each. Learn the three, and every cross-section you look at from here on becomes readable.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['anatomy-of-flowering-plants', 'tissue-systems'],
  glossary: [
    { term: 'epidermis', definition: 'The outermost layer of the primary plant body — elongated, compactly-arranged cells forming a single continuous layer, usually one cell thick and parenchymatous.' },
    { term: 'cuticle', definition: 'A waxy thick layer covering the outside of the epidermis that prevents water loss. Absent in roots.' },
    { term: 'stomata', definition: 'Structures present in the leaf epidermis, made of two guard cells enclosing a pore, that regulate transpiration and gaseous exchange.' },
    { term: 'guard cells', definition: 'Two bean-shaped cells (dumb-bell shaped in grasses) enclosing the stomatal pore. Outer wall thin, inner wall highly thickened; possess chloroplasts and regulate the opening and closing of stomata.' },
    { term: 'subsidiary cells', definition: 'Epidermal cells near the guard cells that become specialised in shape and size.' },
    { term: 'stomatal apparatus', definition: 'The stomatal aperture, the guard cells, and the surrounding subsidiary cells, together.' },
    { term: 'trichomes', definition: 'Epidermal hairs on the stem, usually multicellular, branched or unbranched, soft or stiff, sometimes secretory. Help prevent water loss through transpiration.' },
    { term: 'root hairs', definition: 'Unicellular elongations of epidermal cells on the root, which absorb water and minerals from the soil.' },
    { term: 'mesophyll', definition: 'The ground tissue of a leaf — thin-walled cells containing chloroplasts.' },
    { term: 'cambium', definition: 'A tissue present between the phloem and xylem of a vascular bundle in dicot stems, giving it the ability to form secondary xylem and phloem.' },
    { term: 'open vascular bundle', definition: 'A vascular bundle with cambium present between phloem and xylem, able to form secondary xylem and phloem. Found in dicot stems.' },
    { term: 'closed vascular bundle', definition: 'A vascular bundle with no cambium present, unable to form secondary tissues. Found in monocots.' },
    { term: 'radial vascular bundle', definition: 'A vascular bundle where xylem and phloem are arranged alternately along different radii, as in roots.' },
    { term: 'conjoint vascular bundle', definition: 'A vascular bundle where xylem and phloem are jointly situated along the same radius, usually with phloem on the outer side of xylem. Common in stems and leaves.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A close-up cutaway of a plant stem at dawn, showing an outer skin, a soft fleshy middle zone, and a ring of glowing vein-like strands near the centre',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A close-up botanical cutaway of a young plant stem sliced cleanly at an angle, lit by soft early-morning light with dew still visible on the cut surface. Three distinct layers are visible from outside in: a thin, taut outer skin catching the light along its edge (the epidermal layer), a soft, pale, fleshy middle zone filling most of the cut face (the ground tissue), and near the centre a ring of slender, vein-like strands glowing faintly with a warm inner light (the vascular tissue). The cut surface faces the viewer at a gentle angle, softly lit, floating in a dark naturalistic void. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements, no photorealism.",
    },
    // ── 1 · Fun fact hook ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Same Three Layers, Every Single Organ',
      markdown: "Slice open a root, a stem, or a leaf and you'd expect three completely different structures — they look nothing alike on the outside. But cut a thin cross-section and put it under a microscope, and every one of them turns out to be built from the exact same three tissue systems. What actually differs from root to stem to leaf isn't the ingredients — it's how those three systems are arranged. Learn to spot the three, and you can read any plant cross-section NCERT throws at you.",
    },
    // ── 2 · Core concept — three tissue systems, intro ──────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every organ of a flowering plant is built from the same three building blocks, just arranged differently depending on where they sit and what job they do. On the basis of their structure and location, plant tissues fall into three tissue systems: the **epidermal tissue system**, the **ground (or fundamental) tissue system**, and the **vascular (or conducting) tissue system**.\n\nFrom here on, every cross-section you look at is really just these three systems arranged in a different pattern for each organ — and that pattern is exactly what tells a root apart from a stem, and later, a monocot apart from a dicot, on sight.",
    },
    // ── 3 · Heading — Epidermal Tissue System ───────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Epidermal Tissue System',
      objective: 'By the end of this you can name every part of the stomatal apparatus and explain what makes a guard cell able to open and close the pore.',
    },
    // ── 4 · Text — epidermis, cuticle, stomata mechanism ────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The epidermal tissue system forms the **outermost covering of the whole plant body**. It's made of three things working together: the epidermal cells themselves, stomata, and epidermal appendages — trichomes and hairs.\n\nThe **epidermis** itself is the outermost layer of the primary plant body. It's built from **elongated cells, compactly arranged** into a single continuous layer — usually **just one cell thick**. These epidermal cells are **parenchymatous**: a small amount of cytoplasm lines the cell wall, with one large vacuole taking up most of the space inside. To cut down water loss, the outside of the epidermis is often coated in a waxy layer called the **cuticle**. One exception worth remembering: **cuticle is absent in roots**.\n\nLeaves need to breathe, and that's what **stomata** are for. Stomata sit in the leaf epidermis and regulate two things at once — **transpiration** and **gaseous exchange**. Each stoma is built from two **bean-shaped guard cells** enclosing a **stomatal pore** between them (in grasses, the guard cells are **dumb-bell shaped** instead). The two walls of a guard cell aren't equal: the **outer wall**, away from the pore, stays **thin**, while the **inner wall**, towards the pore, is **highly thickened**. Guard cells also carry their own **chloroplasts** — and this pair of features, thickened inner walls plus chloroplasts, is what lets guard cells **regulate the opening and closing of stomata**.\n\nSometimes a few epidermal cells right next to the guard cells become **specialised in shape and size** — these are called **subsidiary cells**. Put the stomatal aperture, the guard cells, and the surrounding subsidiary cells together, and you get what NCERT calls the **stomatal apparatus**.",
    },
    // ── 5 · Interactive image — stomatal apparatus (Figure 6.1) ─────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A surface view of leaf epidermis showing two bean-shaped guard cells with chloroplasts enclosing a central stomatal pore, flanked by subsidiary cells and surrounded by ordinary epidermal cells',
      caption: '📸 Tap each part of the stomatal apparatus to see what it does',
      generation_prompt: "Scientific textbook illustration of a stomatal apparatus in surface view (top-down), as seen in leaf epidermis. Flat 2D educational diagram on a dark background (#0a0a0a near-black). At the centre of the frame: two bean-shaped guard cells curving to enclose a narrow central stomatal pore between them, each guard cell tinted pale green to show chloroplasts dotted inside its cytoplasm, with a visibly thin outer wall (away from the pore) and a visibly thicker inner wall (towards the pore). Flanking the guard cells on either side: two or three subsidiary cells, distinct in outline shape from the guard cells. Surrounding all of this: a tessellated field of ordinary epidermal cells filling the rest of the frame, irregular jigsaw-like outlines typical of leaf epidermis in surface view. Clean white outlines throughout, biologically accurate proportions, thin white leader lines from each structure to a label position outside the cell cluster (labels added separately by the app, do not render text in the image), no photorealism, no cartoon style, no mascots, matches standard biology textbook diagram conventions.",
      hotspots: [
        { id: uuid(), x: 0.85, y: 0.15, label: 'Epidermal Cells', detail: "The ordinary cells that tile the rest of the leaf surface. They're **parenchymatous**, elongated, and packed tightly into a single continuous layer with barely any gaps between them.", icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.5, label: 'Subsidiary Cells', detail: "A few epidermal cells near the guard cells become **specialised in shape and size**. Stomatal aperture + guard cells + subsidiary cells together make up the **stomatal apparatus**.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.35, label: 'Guard Cells', detail: "Two **bean-shaped cells** (dumb-bell shaped in grasses) enclosing the stomatal pore. Their **outer wall is thin**, their **inner wall is highly thickened** — that difference is what lets them regulate the pore.", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.40, label: 'Chloroplast', detail: "Unlike most epidermal cells, guard cells carry their own **chloroplasts** — one of the few epidermal cell types that photosynthesises.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.5, label: 'Stomatal Pore', detail: "The gap enclosed by the two guard cells. Through this pore, the leaf carries out **transpiration** (water loss as vapour) and **gaseous exchange**.", icon: 'circle' },
      ],
    },
    // ── 6 · Text — root hairs and trichomes ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The epidermis doesn't stay smooth everywhere — it grows hairs, and what those hairs are called depends on which organ they're on.\n\nOn roots, epidermal cells put out **unicellular elongations** called **root hairs**. Their job is to **absorb water and minerals** from the soil.\n\nOn the stem, the epidermal hairs are called **trichomes** instead. Shoot-system trichomes are usually **multicellular**, and they come in a range of forms — **branched or unbranched, soft or stiff**, and sometimes even **secretory**. Whatever their shape, trichomes do the same essential job: they **help prevent water loss due to transpiration**.",
    },
    // ── 7 · Reasoning prompt — stomatal apparatus recognition ───────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A labelled diagram of leaf epidermis shows two bean-shaped cells enclosing a central pore, with chloroplasts visible inside them, flanked by a few epidermal cells that look different in shape and size from the rest of the epidermis. What are these differently-shaped flanking cells called, and what group do they form together with the guard cells and the pore?",
      options: [
        "They are called epidermal cells like all the others; together with the guard cells they form the cuticle",
        "They are called guard cells; together with the pore they form the trichome",
        "They are called subsidiary cells; together with the guard cells and stomatal pore they form the stomatal apparatus",
        "They are called trichomes; together with the pore and guard cells they form the root hair complex",
      ],
      reveal: "The flanking cells are subsidiary cells — NCERT describes them as epidermal cells near the guard cells that become specialised in shape and size. The stomatal aperture, the guard cells, and these subsidiary cells together make up the stomatal apparatus. It isn't the cuticle, which is the waxy covering on the epidermis, not a group of cells. It isn't the guard cells themselves — those are already named as the bean-shaped cells enclosing the pore, not the flanking cells being asked about. And it isn't trichomes or a 'root hair complex' — trichomes are shoot-system hairs and root hairs are a root-specific structure; neither term applies to a leaf epidermis diagram.",
      difficulty_level: 2,
    },
    // ── 8 · Heading — Ground Tissue System ──────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Ground Tissue System',
      objective: 'By the end of this you can name the three simple tissues that make up ground tissue, and say what ground tissue is called in a leaf.',
    },
    // ── 9 · Text — ground tissue ─────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Ground tissue is defined by exclusion: it's **every tissue except the epidermis and the vascular bundles**. It's built from the three simple tissues you've already met — **parenchyma, collenchyma, and sclerenchyma**.\n\nIn the primary stem and root, parenchymatous cells are the ones you'll usually find filling the **cortex, the pericycle, the pith, and the medullary rays**. In a leaf, ground tissue looks a little different: it's made of **thin-walled cells containing chloroplasts**, and this leaf-specific ground tissue has its own name — **mesophyll**.",
    },
    // ── 10 · Heading — Vascular Tissue System ───────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'The Vascular Tissue System',
      objective: 'By the end of this you can tell an open vascular bundle from a closed one, and a radial arrangement from a conjoint one — the two classifications NEET tests most on this topic.',
    },
    // ── 11 · Text — xylem+phloem, open/closed, radial/conjoint ─────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "The vascular system is built from two complex tissues working as a pair: **xylem and phloem**. Together, xylem and phloem make up a **vascular bundle** (Figure 6.2).\n\nWhether a vascular bundle can grow thicker over time comes down to one thing: is **cambium present between the phloem and the xylem**? In **dicotyledonous stems**, it is. That cambium gives the bundle the ability to go on producing **secondary xylem and secondary phloem** — so these are called **open vascular bundles**. In **monocotyledons**, there's **no cambium** in the vascular bundle at all. With no cambium, there's no way to form secondary tissue, so these bundles are called **closed**.\n\nA separate question is how the xylem and phloem are positioned relative to each other inside the bundle. When they sit along **different radii, alternating** with each other, the arrangement is called **radial** — this is what you'll find in **roots**. When xylem and phloem instead sit together **along the same radius**, the arrangement is called **conjoint** — common in **stems and leaves**. In a conjoint bundle, the phloem is usually found **only on the outer side of the xylem**.",
    },
    // ── 12 · Comparison card — open vs closed ────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 12,
      title: 'Open Vascular Bundle vs Closed Vascular Bundle',
      columns: [
        {
          heading: 'Open Vascular Bundle',
          points: [
            'Cambium is present between phloem and xylem',
            'Because cambium is present, it can form secondary xylem and secondary phloem',
            'Found in dicotyledonous stems',
          ],
        },
        {
          heading: 'Closed Vascular Bundle',
          points: [
            'No cambium is present between phloem and xylem',
            'Cannot form secondary tissues',
            'Found in monocotyledons',
          ],
        },
      ],
    },
    // ── 13 · Comparison card — radial vs conjoint ────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 13,
      title: 'Radial Arrangement vs Conjoint Arrangement',
      columns: [
        {
          heading: 'Radial Arrangement',
          points: [
            'Xylem and phloem arranged alternately along different radii',
            'Seen in roots',
          ],
        },
        {
          heading: 'Conjoint Arrangement',
          points: [
            'Xylem and phloem jointly situated along the same radius',
            'Common in stems and leaves',
            'Phloem is usually located only on the outer side of xylem',
          ],
        },
      ],
    },
    // ── 14 · Remember callout ──────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Epidermis:** single-layered, parenchymatous, outermost layer of the primary plant body. Covered by a waxy **cuticle** — except in roots, where cuticle is absent.\n- **Stomatal apparatus** = stomatal aperture + guard cells + subsidiary cells. Guard cells: **thin outer wall, thick inner wall**, carry chloroplasts, regulate pore opening/closing.\n- **Root hairs** (on roots) vs **trichomes** (on the stem) — both are epidermal hairs, different names for different organs.\n- **Ground tissue** = every tissue except epidermis and vascular bundles. In leaves it's called **mesophyll**.\n- **Open vascular bundle** = cambium present → can form secondary xylem/phloem → dicot stems.\n- **Closed vascular bundle** = no cambium → no secondary growth → monocots.\n- **Radial** = xylem and phloem alternate along different radii → roots. **Conjoint** = xylem and phloem share the same radius → stems and leaves, phloem usually outside the xylem.",
    },
    // ── 15 · Exam tip ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Open vs closed vascular bundle:** the single highest-yield fact on this page. Cambium present between phloem and xylem = **open** bundle = can form secondary xylem/phloem = **dicot stems**. No cambium = **closed** bundle = no secondary growth possible = **monocots**. If a question tells you whether secondary growth happens, it has already told you whether the bundle is open or closed — and vice versa.\n\n**Guard cell wall thickness:** a frequently tested structural detail. The outer wall (away from the stomatal pore) is thin; the inner wall (towards the pore) is highly thickened. NCERT doesn't spell out the full mechanism of how this drives opening and closing, but it does test the structural fact itself — don't mix up which wall is thin and which is thick.\n\n**Classic NEET question:** \"Which type of vascular bundle is found in the stem of a dicotyledonous plant, and why?\" → **Open**, because cambium is present between the phloem and xylem, giving it the ability to form secondary xylem and phloem.",
    },
    // ── 16 · Bridge text ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 16,
      markdown: "You now have the three tissue systems that build every plant organ — and the two vascular bundle classifications that separate a dicot's plumbing from a monocot's. Next, you'll put these three systems together and read them inside an actual root, stem, and leaf, starting with the difference between a dicot and a monocot cross-section.",
    },
    // ── 17 · Inline quiz (LAST) ──────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Which statement about the epidermis is correct, according to NCERT?',
          options: [
            'The epidermis is usually multi-layered and covered by a waxy cuticle in every organ, including roots',
            'The epidermis is usually single-layered, parenchymatous, and covered by a waxy cuticle that is absent in roots',
            'The epidermis consists of complex tissues and is always covered by a thick cuticle, including in roots',
            'The epidermis is the innermost layer of the primary plant body, protected by the cuticle',
          ],
          correct_index: 1,
          explanation: "NCERT states the epidermis is usually single-layered, made of parenchymatous cells, and often covered by a waxy cuticle that is absent in roots. It isn't multi-layered, isn't built from complex tissue (it's parenchymatous, a simple tissue), and it's the outermost layer of the primary plant body, not the innermost.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'In a guard cell, which wall is thin and which is thick, and why does this detail matter?',
          options: [
            'Both walls of a guard cell are equally thick, since guard cells lack chloroplasts and never regulate the pore',
            'The outer wall away from the pore is thick and the inner wall towards the pore is thin, which keeps the stomatal pore permanently open',
            'The outer wall away from the pore is thin and the inner wall towards the pore is highly thickened, which lets guard cells regulate the pore',
            "The inner and outer walls of a guard cell are identical to an ordinary epidermal cell's walls, since guard cells are otherwise unspecialised",
          ],
          correct_index: 2,
          explanation: "NCERT specifies the outer wall of a guard cell (away from the stomatal pore) is thin, and the inner wall (towards the pore) is highly thickened, and that guard cells possess chloroplasts and regulate stomatal opening and closing. Reversing which wall is thick, claiming guard cells lack chloroplasts, or claiming their walls match an ordinary epidermal cell's all misstate this specific structural fact.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'In dicot stems, cambium is present between phloem and xylem, letting the bundle form secondary xylem and phloem. What is this type of vascular bundle called, and what is it called in monocots, which lack cambium?',
          options: [
            'Closed in dicots, open in monocots',
            'Radial in dicots, conjoint in monocots',
            'Conjoint in dicots, radial in monocots',
            'Open in dicots, closed in monocots',
          ],
          correct_index: 3,
          explanation: "NCERT is explicit: cambium between phloem and xylem gives a bundle the ability to form secondary xylem and phloem — such bundles are open, found in dicot stems. Monocot bundles lack cambium, cannot form secondary tissue, and are called closed. Radial and conjoint describe a completely different classification — how xylem and phloem are positioned relative to each other — not whether cambium is present.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A transverse section shows xylem and phloem jointly situated along the same radius of a vascular bundle, with phloem located only on the outer side of xylem. What is this arrangement called, and where would you expect to find it?',
          options: [
            'Called conjoint arrangement, commonly seen in stems and leaves',
            'Called radial arrangement, commonly seen in stems and leaves',
            'Called conjoint arrangement, commonly seen only in roots',
            'Called radial arrangement, commonly seen only in roots',
          ],
          correct_index: 0,
          explanation: "NCERT defines the conjoint type as xylem and phloem jointly situated along the same radius, common in stems and leaves, with phloem usually on the outer side of xylem. Radial arrangement is the opposite — xylem and phloem alternate along different radii — and that's the pattern seen in roots, not stems and leaves.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
