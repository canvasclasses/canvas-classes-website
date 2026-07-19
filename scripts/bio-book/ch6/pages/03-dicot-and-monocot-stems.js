'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'dicot-and-monocot-stems',
  title: 'Dicot and Monocot Stems',
  subtitle: "One ring of vascular bundles, or bundles scattered like seeds — a single glance at a stem's cross-section is often all it takes to call it dicot or monocot.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['anatomy-of-flowering-plants', 'stem-anatomy'],
  glossary: [
    { term: 'hypodermis', definition: "A layer just below the epidermis. In a dicot stem it's a few layers of collenchymatous cells giving the young stem mechanical strength; in a monocot stem it's sclerenchymatous instead." },
    { term: 'endodermis (starch sheath)', definition: "The innermost layer of the cortex in a dicot stem. Its cells are rich in starch grains, which is why this layer is also called the starch sheath." },
    { term: 'pericycle', definition: "The tissue just inside the endodermis. In a dicot stem it forms semi-lunar patches of sclerenchyma sitting above each vascular bundle, on the inner side of the endodermis." },
    { term: 'medullary rays', definition: "Radially placed parenchymatous cells lying between adjacent vascular bundles in a dicot stem." },
    { term: 'conjoint vascular bundle', definition: "A vascular bundle where xylem and phloem sit together along the same radius, phloem usually on the outer side of the xylem — common in stems and leaves." },
    { term: 'bundle sheath', definition: "A sclerenchymatous covering that wraps each vascular bundle in a monocot stem. A dicot stem's vascular bundles don't have one." },
    { term: 'ground tissue', definition: "The large, conspicuous parenchymatous tissue filling a monocot stem around the scattered vascular bundles, in place of a separate cortex and pith." },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A cutaway cross-section of a dicot stem showing a ring of glowing vascular bundles beside a monocot stem with bundles scattered across its whole width',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single dusk scene showing two plant stems cut cleanly in cross-section, floating side by side in a dark atmospheric void, each glowing faintly from within. On the left, a dicot stem's cut face shows a neat ring of small glowing vein-like vascular bundles running just inside its outer rim, evenly spaced like beads on a necklace. On the right, a monocot stem's cut face shows the same kind of glowing bundles scattered at random depths across its whole width, some near the edge and some buried deep in the centre, with no ring pattern at all. Both cut faces are circular, geometric, precise, lit with a warm inner glow against a dark naturalistic background (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Ring vs No Ring — The Fastest Test in the Lab',
      markdown: "Cut a young dicot stem straight across and look at the cut face. Every vascular bundle you can see sits in a single neat **ring**, just inside the outer layers, like beads strung around the stem. Cut a grass stem — a monocot — the same way, and there's no ring anywhere. The bundles are **scattered** right across the whole cross-section, some near the edge, some buried deep in the middle. No stain, no chemical test needed — this one pattern, ring or no ring, is often the very first thing a botanist checks under the microscope to call a stem dicot or monocot.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Just like a root, the internal structure of a stem is easiest to study by cutting it straight across — a **transverse section (T.S.)** — and reading the tissue in layers from the outside in.\n\nIn a typical young **dicotyledonous stem**, the **epidermis** is the outermost layer, and its job is protection. It's covered with a thin layer of **cuticle**, and it may carry **trichomes** (small hair-like outgrowths) and a few **stomata**, scattered pores that let gas exchange happen through the stem's own surface.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Cortex: Three Sub-Zones',
      objective: "By the end of this you can name each of the cortex's three sub-zones in order, from the epidermis inward to the endodermis.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Between the epidermis and the pericycle sits a broad zone called the **cortex**, made of cells arranged in multiple layers. NCERT splits it into three sub-zones, each with a different job.\n\nThe outer sub-zone is the **hypodermis** — a few layers of **collenchymatous cells** sitting just below the epidermis. Collenchyma cells have thickened corners, and here that thickening does one specific job: it gives the young, still-growing stem **mechanical strength** before any wood has formed.\n\nBelow the hypodermis come the **cortical layers proper** — rounded, thin-walled **parenchymatous cells** with **conspicuous intercellular spaces** between them, the kind of loosely packed tissue you'd expect in a zone built mainly for storage, not strength.\n\nThe **innermost layer of the cortex** is the **endodermis**. Its cells are packed with **starch grains**, which is exactly why this layer has a second name you'll see just as often in questions: the **starch sheath**.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Pericycle to Pith — the Ring That Defines a Dicot Stem',
      objective: "By the end of this you can trace a dicot stem from pericycle to pith and explain exactly why NCERT calls the ring arrangement 'characteristic of dicot stem.'",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Just inside the endodermis, on its inner side and lying above the phloem, is the **pericycle** — not a continuous ring here, but a series of **semi-lunar patches of sclerenchyma**, curved like little crescent moons sitting over each vascular bundle.\n\nBetween one vascular bundle and the next are a few layers of **radially placed parenchymatous cells** — cells arranged like spokes pointing outward from the centre. These are the **medullary rays**.\n\nNow for the feature that actually names the stem: a large number of **vascular bundles are arranged in a ring**. NCERT is direct about this — the **'ring' arrangement of vascular bundles is a characteristic of dicot stem**. Each of these bundles is **conjoint** (xylem and phloem sit together along the same radius), **open** (cambium is present, so the bundle can add secondary tissue later), and has **endarch protoxylem** — the protoxylem points toward the centre of the stem.\n\nAt the very centre, filling the space the ring of bundles surrounds, is the **pith** — a large mass of rounded parenchymatous cells with big intercellular spaces, occupying the whole central portion of the stem.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Transverse section of a young dicot stem showing epidermis, hypodermis, cortex, endodermis, pericycle, ring-arranged vascular bundles, and central pith',
      caption: '📸 Tap each dot to walk through a dicot stem, layer by layer',
      generation_prompt: "Scientific textbook illustration of a transverse section of a dicotyledonous stem (mirroring NCERT Figure 6.4a). Flat 2D educational diagram on a dark background (#0a0a0a near-black), circular cross-section viewed from directly above, clean white outlines, biologically accurate proportions, no labels baked in. From the outer rim inward: a thin continuous epidermis line with a fine cuticle layer and a couple of small hair-like trichomes; just inside it a narrow band of hypodermis cells (collenchyma, drawn with slightly thickened corners); below that a wider zone of loosely packed rounded parenchyma cells with visible gaps between them (the cortex); a thin single-cell-layer ring just inside the cortex, drawn slightly darker to suggest starch grains packed inside each cell (the endodermis / starch sheath); small crescent-moon-shaped patches sitting just inside the endodermis, positioned above each vascular bundle (the pericycle sclerenchyma patches); a neat ring of oval vascular bundles running around the stem just inside the pericycle patches, evenly spaced, each with xylem toward the centre and phloem toward the outside; thin radiating lines of cells running between adjacent vascular bundles (the medullary rays); and a large open central zone of loosely packed rounded parenchyma cells filling the middle (the pith). Functional colours: white outlines for epidermis and hypodermis, tan/brown for the sclerenchyma pericycle patches, blue-white for xylem, pink for phloem within each bundle. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.06, label: 'Epidermis & cuticle', icon: 'circle',
          detail: "The **outermost protective layer**, covered with a thin layer of **cuticle**. It may bear **trichomes** and a few **stomata**." },
        { id: uuid(), x: 0.63, y: 0.12, label: 'Hypodermis', icon: 'circle',
          detail: "A few layers of **collenchymatous cells** just below the epidermis. Their thickened corners give the young stem **mechanical strength** before any wood forms." },
        { id: uuid(), x: 0.76, y: 0.24, label: 'Cortex (parenchyma)', icon: 'circle',
          detail: "Rounded, **thin-walled parenchymatous cells** with **conspicuous intercellular spaces** — loosely packed tissue below the hypodermis." },
        { id: uuid(), x: 0.80, y: 0.40, label: 'Endodermis / starch sheath', icon: 'circle',
          detail: "The **innermost cortex layer**. Its cells are rich in **starch grains**, which is why it's also called the **starch sheath**." },
        { id: uuid(), x: 0.72, y: 0.56, label: 'Pericycle (sclerenchyma patches)', icon: 'circle',
          detail: "Sits on the inner side of the endodermis, above the phloem, as **semi-lunar patches of sclerenchyma** — one crescent-shaped patch over each vascular bundle." },
        { id: uuid(), x: 0.50, y: 0.72, label: 'Vascular bundles (in a ring)', icon: 'circle',
          detail: "A large number of bundles arranged in a **ring** — NCERT calls this the defining feature of a dicot stem. Each bundle is **conjoint, open, with endarch protoxylem**. Between neighbouring bundles sit radially placed parenchyma cells, the **medullary rays**." },
        { id: uuid(), x: 0.50, y: 0.50, label: 'Pith', icon: 'circle',
          detail: "A large mass of rounded **parenchymatous cells** with big **intercellular spaces**, filling the whole **central portion** of the stem." },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Monocot Stem — Same Organ, Different Plan',
      objective: "By the end of this you can list every feature that separates a monocot stem's transverse section from a dicot's, feature for feature.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Cut a monocot stem the same way and almost every feature changes. The **hypodermis** here is **sclerenchymatous**, not collenchymatous — a tougher, more rigid layer right below the epidermis from the very start.\n\nInstead of a neat ring, the monocot stem has a **large number of scattered vascular bundles**, spread right across the stem with no ring pattern at all. Each one is wrapped in its own **sclerenchymatous bundle sheath** — a tough protective jacket a dicot bundle doesn't have. All of this sits inside a **large, conspicuous parenchymatous ground tissue** that fills the rest of the stem — there's no separate cortex-versus-pith split the way there is in a dicot.\n\nThe bundles themselves are different too: they're still **conjoint** (xylem and phloem together, like the dicot), but **closed** — there's no cambium, so a monocot stem can never lay down secondary tissue the way a dicot can. **Peripheral vascular bundles** — the ones nearer the edge — are generally **smaller** than the ones sitting centrally. And two more give-aways: the **phloem parenchyma is absent**, and each vascular bundle contains its own small **water-containing cavities**.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A transverse section under the microscope shows vascular bundles that are conjoint, scattered right across the section, and each one surrounded by a sclerenchymatous bundle sheath — with phloem parenchyma absent. What is this a cross-section of?",
      options: [
        'A dicot root — pericycle patches only form above scattered vascular bundles, never a ring',
        'A dicot stem — vascular bundles conjoint but arranged in a single ring around the stem',
        'A monocot stem — vascular bundles conjoint, scattered, each in its own bundle sheath',
        'A monocot root — xylem and phloem here would be radial, never conjoint or scattered',
      ],
      reveal: "This is a **monocot stem**. NCERT lists these exact clues as diagnostic: bundles that are **conjoint** and **scattered** (never in a ring), each wrapped in its own **sclerenchymatous bundle sheath**, with **phloem parenchyma absent**. A dicot stem would show the opposite pattern — bundles conjoint but arranged in a single **ring**, not scattered. And neither root option fits at all: in a root, xylem and phloem sit on **alternate radii** — a **radial** arrangement, never conjoint — so 'conjoint' vascular bundles already rule out both root options.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'comparison_card', order: 11, title: 'Dicot Stem vs Monocot Stem',
      columns: [
        { heading: 'Dicot Stem', points: [
          'Vascular bundles arranged in a ring — NCERT calls this the defining feature of a dicot stem',
          'Hypodermis is collenchymatous — a few layers of collenchyma cells just below the epidermis',
          'No sclerenchymatous bundle sheath around individual vascular bundles',
          'Vascular bundles are conjoint and open, with a cambium (can form secondary tissue)',
          'Phloem parenchyma is present',
        ] },
        { heading: 'Monocot Stem', points: [
          'Vascular bundles scattered right across the ground tissue — no ring at all',
          'Hypodermis is sclerenchymatous — tough and rigid from the start',
          'Each vascular bundle wrapped in its own sclerenchymatous bundle sheath',
          'Vascular bundles are conjoint but closed — no cambium, so no secondary growth',
          'Phloem parenchyma is absent; each bundle has small water-containing cavities',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'Lock These Down',
      markdown: "- **Ring = dicot, scattered = monocot.** This single pattern is the fastest way to identify a stem's cross-section on sight.\n- **Cortex has three sub-zones** in a dicot stem, outside to in: **hypodermis** (collenchyma, mechanical strength) → **cortical parenchyma** (thin-walled, air spaces) → **endodermis / starch sheath** (starch-packed).\n- **Pericycle in a dicot stem is patchy, not continuous** — semi-lunar sclerenchyma patches sitting above each vascular bundle, not a full ring like in a root.\n- **Open vs closed is about cambium.** Dicot bundles are **open** (cambium present, can add secondary tissue). Monocot bundles are **closed** (no cambium, no secondary growth) and carry a **sclerenchymatous bundle sheath** the dicot bundle doesn't have.\n- **Two monocot give-aways:** **phloem parenchyma is absent**, and each vascular bundle has its own **water-containing cavities**.",
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Ring vs scattered is THE single cleanest clue.** If a transverse section shows vascular bundles in one ring, it's a dicot stem. If they're scattered with no pattern, it's a monocot stem — NCERT's own way of telling the two apart at a glance.\n\n**Hypodermis type is the backup clue.** Collenchymatous hypodermis → dicot stem. Sclerenchymatous hypodermis → monocot stem. Use this to confirm a call you've already made from the ring-vs-scattered pattern.\n\n**Don't confuse 'conjoint' with 'radial.'** Both dicot and monocot stems have **conjoint** bundles (xylem and phloem together on the same radius). Only **roots** have the **radial** arrangement (xylem and phloem alternating on different radii). If a question describes radial bundles, the answer is never a stem.\n\n**Classic NEET question:** \"A transverse section shows vascular bundles that are conjoint, scattered, and surrounded by a sclerenchymatous bundle sheath, with phloem parenchyma absent. Identify it.\" → *monocot stem* — this is NCERT's own Chapter 6 exercise question, word for word.",
    },
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "Stem and root both build their tissue in layers around a plumbing system — the difference is just how that plumbing is arranged. Leaves work differently again: instead of stacking tissue in rings, they spread it flat, sandwiched between two surfaces built for catching sunlight. That's the **dorsiventral leaf**, next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "In a dicot stem, which layer is also called the 'starch sheath'?",
          options: ['The hypodermis', 'The pericycle', 'The endodermis', 'The pith'],
          correct_index: 2,
          explanation: "The endodermis is the innermost layer of the cortex, and its cells are packed with starch grains — which is exactly why it's also called the starch sheath. The hypodermis is the outer, collenchymatous sub-zone; the pericycle sits just inside the endodermis as sclerenchyma patches; the pith is the central parenchymatous mass, unrelated to starch storage.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What is the single feature NCERT calls 'characteristic of dicot stem'?",
          options: [
            'Vascular bundles arranged in a ring',
            'A sclerenchymatous hypodermis',
            'Vascular bundles scattered through the ground tissue',
            'Absence of phloem parenchyma',
          ],
          correct_index: 0,
          explanation: "NCERT states directly that the ring arrangement of vascular bundles is characteristic of dicot stem. A sclerenchymatous hypodermis and scattered vascular bundles both describe a monocot stem, and absence of phloem parenchyma is also a monocot feature — not a dicot one.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Which pair correctly matches the vascular bundle type each stem has?',
          options: [
            'Dicot stem — closed bundles (no cambium); monocot stem — open bundles (cambium present)',
            'Dicot stem — open bundles (cambium present); monocot stem — closed bundles (no cambium)',
            'Both dicot and monocot stems have closed bundles, with no cambium present in either',
            'Both dicot and monocot stems have open bundles, with cambium present in both',
          ],
          correct_index: 1,
          explanation: "A dicot stem's vascular bundles are open because cambium is present between the xylem and phloem, letting the stem form secondary tissue later. A monocot stem's bundles are closed — no cambium, so no secondary growth. The two are never both open or both closed.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A monocot stem's vascular bundles carry a feature a dicot stem's bundles never have. What is it?",
          options: [
            "Endarch protoxylem pointing toward the stem's centre",
            'Phloem sitting only on the outer side of the xylem',
            'A cambium present between the xylem and phloem',
            'A sclerenchymatous bundle sheath around each vascular bundle',
          ],
          correct_index: 3,
          explanation: "Each monocot vascular bundle is wrapped in its own sclerenchymatous bundle sheath — a feature the dicot stem's bundles don't carry. Endarch protoxylem and phloem-on-the-outer-side both describe the dicot stem's conjoint bundles, and cambium presence is actually the dicot's open-bundle feature — monocot bundles are closed, with no cambium at all.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
