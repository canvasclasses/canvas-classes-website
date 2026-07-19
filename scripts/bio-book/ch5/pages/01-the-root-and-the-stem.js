'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-root-and-the-stem',
  title: 'The Root and the Stem',
  subtitle: "The same seed builds two completely different-looking organs — one underground, one above it. Learn what actually tells a root apart from a stem, and you can read almost any plant diagram NEET puts in front of you.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['morphology-of-flowering-plants', 'root', 'stem'],
  glossary: [
    { term: 'radicle', definition: "The part of the embryo that elongates to form the primary root when a seed germinates." },
    { term: 'tap root system', definition: "The primary root and its branches together, formed by direct elongation of the radicle. Seen in dicotyledonous plants, e.g. mustard." },
    { term: 'fibrous root system', definition: "A large number of roots arising from the base of the stem, replacing a primary root that is short-lived. Seen in monocotyledonous plants, e.g. wheat." },
    { term: 'adventitious roots', definition: "Roots that arise from parts of the plant other than the radicle. Seen in grass, Monstera, and the banyan tree." },
    { term: 'root cap', definition: "A thimble-like structure covering the apex of the root, protecting its tender tip as it pushes through the soil." },
    { term: 'region of meristematic activity', definition: "The zone a few millimetres above the root cap where cells are small, thin-walled, with dense protoplasm, and divide repeatedly." },
    { term: 'region of elongation', definition: "The zone where cells undergo rapid elongation and enlargement, responsible for the growth of the root in length." },
    { term: 'region of maturation', definition: "The zone, proximal to the region of elongation, where cells differentiate and mature; some epidermal cells here form root hairs." },
    { term: 'root hairs', definition: "Fine, delicate, thread-like structures formed by epidermal cells in the region of maturation, which absorb water and minerals from the soil." },
    { term: 'node', definition: "The region of the stem where a leaf is borne." },
    { term: 'internode', definition: "The portion of the stem between two nodes." },
    { term: 'plumule', definition: "The part of the embryo of a germinating seed from which the stem develops." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark cutaway of a young plant showing a tap root reaching into the soil below and a green stem with nodes rising above',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous botanical cutaway scene at dusk: below a soil line running across the middle of the frame, a pale tap root system reaches down into dark earth, a thick main root with thinner lateral roots branching off it at intervals; above the soil line, a slender green young stem rises upward, a few leaves attached at clearly spaced points along its length, catching soft dusk light. Deep dusk lighting, one warm glow near the top of the stem, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no labels, no text, no diagram elements, no photorealism.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Seed, Two Very Different Builds',
      markdown: "A wheat seed and a mustard seed both start the same way — a tiny embryo swelling and pushing out of the seed coat. But look at what grows underground a few weeks later, and they don't match at all. Mustard grows one thick main root with branches coming off it. Wheat grows a whole cluster of thin roots, none of them thicker than the rest. Same starting point, two completely different root systems — and NCERT gives you the exact vocabulary to tell them apart on sight.",
    },
    // ── 2 · Core concept — root vs shoot, framing ───────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A flowering plant is built from two connected halves: the **root system**, which stays underground, and the **shoot system**, which grows above it — stem, leaves, flowers, fruit. Both halves start from the same embryo inside a germinating seed, but they grow from different parts of it, and they end up looking nothing alike.\n\nThis page covers the first two organs on that list: the root and the stem. By the end, you should be able to look at any labelled root or stem diagram and immediately place every part — no guessing.",
    },
    // ── 3 · Heading — The Root ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Root',
      objective: 'By the end of this you can tell tap, fibrous, and adventitious root systems apart, name a plant example for each, and list the four functions every root system performs.',
    },
    // ── 4 · Text — tap, fibrous, adventitious ───────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In **most dicotyledonous plants**, the seed's **radicle** simply elongates directly and grows down into the soil, forming the **primary root**. This primary root bears **lateral roots** of several orders — branches off the main root, then branches off those branches, referred to as **secondary, tertiary**, and so on. The primary root together with all its branches is called the **tap root system**, and mustard is NCERT's example.\n\nIn **monocotyledonous plants**, the story is different: the primary root is **short lived** — it doesn't stick around. It gets **replaced by a large number of roots**, all originating from the **base of the stem**. None of these is a single dominant 'main' root; together they form the **fibrous root system**, and wheat is NCERT's example.\n\nA third kind shows up in some plants: roots that arise from **parts of the plant other than the radicle** — not from the seed's original root at all. These are called **adventitious roots**. NCERT gives grass, *Monstera*, and the banyan tree as examples.\n\nWhatever type it is, a root system is doing four jobs at once: **absorbing water and minerals** from the soil, giving the plant **proper anchorage**, **storing reserve food material**, and **synthesising plant growth regulators**.",
    },
    // ── 5 · Comparison card — three root systems ─────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Tap Root vs Fibrous Root vs Adventitious Root',
      columns: [
        {
          heading: 'Tap Root System',
          points: [
            'Found in dicotyledonous plants',
            'Direct elongation of the radicle forms the primary root, which bears lateral roots of several orders',
            'Example: mustard',
          ],
        },
        {
          heading: 'Fibrous Root System',
          points: [
            'Found in monocotyledonous plants',
            'Primary root is short-lived; replaced by many roots originating from the base of the stem',
            'Example: wheat',
          ],
        },
        {
          heading: 'Adventitious Roots',
          points: [
            'Roots arise from parts of the plant other than the radicle',
            'Not a continuation of the primary root system at all',
            'Examples: grass, Monstera, banyan tree',
          ],
        },
      ],
    },
    // ── 6 · Reasoning prompt (mid-page) ──────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A student digs up a wheat plant and finds no single thick main root — just a dense cluster of thin roots, all roughly the same thickness, coming out from the base of the stem. What kind of root system is this, and why doesn't 'tap root' fit?",
      options: [
        "Tap root system — because wheat is a flowering plant, and NCERT describes all flowering plants as having a tap root",
        "Fibrous root system — because the primary root was short-lived and got replaced by many roots from the base of the stem, with no single dominant root left",
        "Adventitious root system — because none of the roots is thicker than the others, and tap roots always have one thick main root",
        "Tap root system — because the roots came from underground, and only tap roots grow below the soil surface",
      ],
      reveal: "This is a fibrous root system. Wheat is a monocot, and NCERT is explicit that in monocots the primary root is short-lived and gets replaced by a large number of roots arising from the base of the stem — exactly the 'no single dominant root' picture described here. It isn't tap root, because a tap root system keeps one primary root with lateral branches of several orders coming off it (mustard's pattern) — that's not what's being described. It also isn't adventitious just because the roots look alike — adventitious specifically means roots arising from parts of the plant other than the radicle, which isn't what's being tested here; the base-of-stem origin after the primary root dies out is the fibrous root system's defining feature. And 'growing underground' isn't what separates tap from fibrous — both systems grow in the soil.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — Regions of the Root ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Regions of the Root',
      objective: 'By the end of this you can name the four regions of a root tip in order, from the outermost to the innermost, and explain what each one does.',
    },
    // ── 8 · Text — four regions ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Whatever kind of root system a plant has, every single root tip is built from the same four regions, one after another.\n\nAt the very tip sits a **thimble-like structure called the root cap**. It **protects the tender apex of the root** as the root pushes its way through the soil.\n\nA few millimetres above the root cap is the **region of meristematic activity**. The cells here are **very small, thin-walled, with dense protoplasm**, and they **divide repeatedly** — this is where new root cells are actually made.\n\nThe cells just above this region undergo **rapid elongation and enlargement**, and this is what's **responsible for the growth of the root in length**. This is the **region of elongation**.\n\nThe cells of the elongation zone then **gradually differentiate and mature** — this zone, sitting just above the region of elongation, is the **region of maturation**. It's from here that **some of the epidermal cells** form very **fine and delicate, thread-like structures called root hairs**, which **absorb water and minerals from the soil**.",
    },
    // ── 9 · Interactive image — four regions of the root tip ─────────────
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'A vertical cross-section of a root tip showing, from bottom to top, the root cap, the region of meristematic activity, the region of elongation, and the region of maturation with root hairs',
      caption: '📸 Tap each zone of the root tip to see what it does',
      generation_prompt: "Scientific textbook illustration of a root tip in longitudinal section, oriented vertically with the tip pointing downward. Flat 2D educational diagram on a dark background (#0a0a0a near-black). From bottom to top: a smooth thimble-shaped root cap at the very tip; immediately above it a small densely-packed zone of tightly clustered small cells (the region of meristematic activity); above that a zone of visibly longer, more elongated cells stacked in a column (the region of elongation); above that a zone where the outer surface sprouts several fine, delicate, hair-like thread projections extending sideways into the soil (the region of maturation with root hairs). Clean white outlines, biologically accurate proportions, thin white leader lines from each zone to a label position outside the root (labels added separately by the app, do not render text in the image), green tint for the living dividing tissue in the meristematic zone, no photorealism, no cartoon style, no mascots, matches standard biology textbook diagram conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.92, label: 'Root Cap', detail: 'A **thimble-like structure** covering the very tip of the root. It **protects the tender apex** of the root as it pushes through the soil.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.70, label: 'Region of Meristematic Activity', detail: 'A few millimetres above the root cap. Cells here are **very small, thin-walled, with dense protoplasm**, and **divide repeatedly** — this is where new root cells are produced.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.46, label: 'Region of Elongation', detail: 'Cells here undergo **rapid elongation and enlargement**, and this is what is **responsible for the growth of the root in length**.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.20, label: 'Region of Maturation', detail: 'Cells from the elongation zone **differentiate and mature** here. Some epidermal cells form fine, delicate, thread-like **root hairs**, which **absorb water and minerals from the soil**.', icon: 'circle' },
      ],
    },
    // ── 10 · Heading — The Stem ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'The Stem',
      objective: 'By the end of this you can name the exact features that separate a stem from a root, and list the functions a stem performs.',
    },
    // ── 11 · Text — stem features and functions ─────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "What tells a stem apart from a root? The **stem is the ascending part of the axis**, bearing **branches, leaves, flowers and fruits**. Where the root develops from the radicle, the **stem develops from the plumule** of the embryo of a germinating seed.\n\nHere is the feature that actually settles it on a diagram: the **stem bears nodes and internodes**. The **node** is the region of the stem **where a leaf is borne**; the **internode** is the **portion between two nodes**. A root never has this — no nodes, no internodes. The stem also bears **buds**, which may be **terminal** (at the tip) or **axillary** (in the angle between a leaf and the stem). A stem is generally **green when young**, and later often becomes **woody and dark brown**.\n\nThe stem's main function is **spreading out branches** that bear leaves, flowers and fruits. It also **conducts water, minerals and photosynthates** up and down the plant. And in some plants, stems take on extra jobs: **storage of food, support, protection**, and **vegetative propagation**.",
    },
    // ── 12 · Remember callout ──────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Tap root** = primary root + lateral roots of several orders, from direct elongation of the radicle. Dicots. Example: mustard.\n- **Fibrous root** = primary root short-lived, replaced by many roots from the base of the stem. Monocots. Example: wheat.\n- **Adventitious root** = roots from parts of the plant OTHER than the radicle. Examples: grass, Monstera, banyan tree.\n- **Root functions:** absorption of water/minerals, anchorage, storing reserve food, synthesis of plant growth regulators.\n- **Root tip, in order from the tip upward:** root cap → region of meristematic activity → region of elongation → region of maturation (root hairs form here).\n- **Node** = where a leaf is borne. **Internode** = portion between two nodes. Roots have neither.\n- **Stem develops from the plumule.** Root develops from the radicle.",
    },
    // ── 13 · Exam tip ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The single fastest way to tell a root diagram from a stem diagram:** look for nodes and internodes. A stem has them — that's exactly where leaves are attached and where the gaps between leaves sit. A root has **no nodes and no internodes at all**. If a diagram shows leaves attached directly along the structure with visible gaps between attachment points, it's a stem, not a root — every time.\n\n**Region of maturation → root hairs → absorption** is a frequently tested chain. NEET likes to ask which root-tip zone produces root hairs (answer: **region of maturation**, not the meristematic zone or the elongation zone) — and which zone is actually responsible for growth in length (answer: **region of elongation**, not maturation). Don't swap these two.\n\n**Classic NEET question:** \"Which region of the root is responsible for the absorption of water and minerals?\" → **the region of maturation, via its root hairs.**",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now have the root and the stem down — how each one is built, and the exact vocabulary that separates them on any diagram. The shoot system has one organ left to cover: the leaf, attached at every node, and that's next.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'A mustard plant shows one thick primary root with lateral roots of several orders branching off it. What is this root system called, and which group of plants shows it?',
          options: [
            'Fibrous root system, seen in monocotyledonous plants',
            'Tap root system, seen in dicotyledonous plants',
            'Adventitious root system, seen in dicotyledonous plants',
            'Fibrous root system, seen in dicotyledonous plants',
          ],
          correct_index: 1,
          explanation: "Direct elongation of the radicle forming a primary root with lateral roots of several orders is the tap root system, and NCERT places it in dicotyledonous plants like mustard. Fibrous root system belongs to monocots (wheat), where the primary root is short-lived and replaced by many stem-base roots — not what's described here. Adventitious roots specifically arise from parts of the plant other than the radicle, which also doesn't match a primary-root-with-laterals description.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Grass, Monstera, and the banyan tree all produce roots that arise from parts of the plant other than the radicle. What are these roots called?",
          options: [
            'Fibrous roots',
            'Tap roots',
            'Adventitious roots',
            'Lateral roots',
          ],
          correct_index: 2,
          explanation: "Roots arising from parts of the plant other than the radicle are, by definition, adventitious roots — NCERT names exactly grass, Monstera, and the banyan tree as examples. Fibrous roots do originate from the stem base too, but they specifically replace a short-lived primary root in monocots; tap roots are a direct continuation of the radicle; lateral roots are branches of a tap root's primary root, not a separate category from the radicle.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In the region of meristematic activity, just above the root cap, what is happening to the cells?",
          options: [
            'They are undergoing rapid elongation and enlargement, driving growth in root length',
            'They are differentiating and maturing, with some forming root hairs',
            'They are small, thin-walled, with dense protoplasm, and dividing repeatedly',
            'They are forming a thimble-like structure that protects the root apex',
          ],
          correct_index: 2,
          explanation: "NCERT describes the region of meristematic activity as made of very small, thin-walled cells with dense protoplasm that divide repeatedly. Rapid elongation and enlargement describes the region of elongation, one zone further up. Differentiating, maturing, and forming root hairs describes the region of maturation, further up still. Forming a protective thimble-shaped structure describes the root cap, below the meristematic zone, not the zone itself.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A diagram shows a green axis with leaves attached at clearly spaced points along its length, gaps visible between each attachment point. What feature confirms this is a stem and not a root?",
          options: [
            'The presence of a root cap protecting the tip',
            'The presence of nodes, where leaves are borne, and internodes, the portions between them',
            'The presence of root hairs absorbing water and minerals',
            'The presence of lateral roots of several orders branching off a primary axis',
          ],
          correct_index: 1,
          explanation: "NCERT defines nodes as the region of the stem where leaves are borne, and internodes as the portions between two nodes — a structure roots never have. A root cap, root hairs, and lateral roots of several orders are all root features from the region-of-the-root and tap-root-system content; none of them appears on a stem, and none of them is what identifies leaf-bearing points with gaps between them as a stem.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
