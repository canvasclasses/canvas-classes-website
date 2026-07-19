'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'dicot-and-monocot-roots',
  title: 'Dicot and Monocot Roots',
  subtitle: "Slice a sunflower root and a grass root in cross-section and one number gives away which is which — count the xylem arms. Here's every ring you'll see, in order, and why that count works.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['anatomy-of-flowering-plants', 'root-anatomy'],
  glossary: [
    { term: 'epiblema', definition: "The outermost layer of a dicot root. Many of its cells protrude outward as unicellular root hairs." },
    { term: 'endodermis', definition: 'The innermost layer of the cortex — a single ring of barrel-shaped cells, with no intercellular spaces, whose tangential and radial walls carry a waterproof waxy deposit.' },
    { term: 'Casparian strips', definition: 'The strip-like bands of suberin (a water-impermeable, waxy material) deposited on the tangential and radial walls of endodermal cells.' },
    { term: 'pericycle', definition: 'A few layers of thick-walled parenchyma cells lying just inside the endodermis. Lateral roots, and the vascular cambium during secondary growth, both begin here.' },
    { term: 'stele', definition: 'Everything that lies on the inner side of the endodermis — the pericycle, the vascular bundles, and the pith — taken together.' },
    { term: 'polyarch', definition: 'Having more than six xylem bundles arranged around the centre of a root — the arrangement typical of a monocot root.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A cutaway view beneath the soil showing a root reaching downward, its cut face glowing faintly to hint at rings of tissue inside',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single dusk scene set just beneath the soil surface: a plant root reaching down and slightly toward the viewer, its lower end sliced cleanly to reveal a faint cross-section glowing softly from within — concentric rings barely visible, hinting at internal structure without any labels or diagram lines. Fine root hairs are visible as delicate wisps along the root's upper length. Loose dark soil particles drift around the root, lit by a single warm glow rising from the cut cross-section itself. Deep, moody lighting, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Root, No Way Around the Wall',
      markdown: "The endodermis — the innermost ring of the root's cortex — isn't just another layer of cells. Its walls are lined with a **waterproof waxy material** running as thin bands called **Casparian strips**. That single strip is why the endodermis works like a checkpoint: nothing can slip straight through those waterproofed walls on its way toward the centre of the root. Every dicot and monocot root you'll ever slice open has this same checkpoint built in.",
    },
    // ── 2 · Core concept ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A transverse section — a thin slice cut straight across an organ — is the easiest way to see how a root, stem, or leaf is actually built inside. Cut a sunflower root across and you'll see a set of rings, each one a different tissue, arranged in a fixed order from the outside in. Cut a grass root the same way and you'll see the same *kind* of rings — but not quite the same numbers.\n\nThis page walks that cross-section twice: once for a typical **dicot root** (Figure 6.3a, the sunflower), and once for a typical **monocot root** (Figure 6.3b), so you can hold both pictures side by side and know exactly what to look for in each.",
    },
    // ── 3 · Heading — dicot root ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Dicotyledonous Root — Ring by Ring',
      objective: "By the end of this you can name every ring in a dicot root T.S., in order from the outside in, and say what each one does.",
    },
    // ── 4 · Text — dicot root detail ─────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Start at the outside and work in. The **outermost layer is the epiblema**. Many of its cells protrude outward as **unicellular root hairs** — a single cell, drawn out into a hair, doing the job of soaking up water and minerals from the soil.\n\nJust inside the epiblema sits the **cortex** — several layers of **thin-walled parenchyma cells**, with visible **intercellular spaces** between them. The innermost layer of that cortex is different enough to get its own name: the **endodermis**. It's a **single layer of barrel-shaped cells**, packed tight with **no intercellular spaces** at all. Both the tangential walls (running around the ring) and the radial walls (running inward) of every endodermal cell carry a deposit of **suberin** — a **water-impermeable, waxy material** — laid down in strips called **Casparian strips**. That waterproofing is exactly why nothing can leak straight through an endodermal cell wall on its way inward.\n\nNext to the endodermis lies a few layers of **thick-walled parenchymatous cells** called the **pericycle**. This layer does real work later on: it's where **lateral roots first initiate**, and it's also where the **vascular cambium forms during secondary growth**. Inside the pericycle, the **pith is small or inconspicuous** — barely there. The parenchymatous cells sitting between the xylem and the phloem are called **conjunctive tissue**. A dicot root usually shows **two to four xylem and phloem patches**, and later in the root's life, a **cambium ring develops between the xylem and the phloem**. Every tissue on the inner side of the endodermis — the pericycle, the vascular bundles, and the pith, taken together — is called the **stele**.",
    },
    // ── 5 · Interactive image — dicot root T.S. ──────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Transverse section of a dicot (sunflower) root, showing epiblema, cortex, endodermis, pericycle, xylem, phloem and pith',
      caption: '📸 Tap each ring of the dicot root cross-section to explore',
      generation_prompt: "Scientific textbook illustration of a transverse section (T.S.) of a dicot root, based on a sunflower root. Flat 2D educational diagram on a dark background (#0a0a0a near-black), circular cross-section centred in the frame. From the outside in: an outer ring labelled with fine hair-like projections (root hairs) extending outward from the epiblema; a wide multi-layered ring of loosely packed parenchyma cells with visible gaps between them (cortex); a thin single ring of neat barrel-shaped cells with a distinct thickened band on their outer and side walls, shown in a contrasting pale-gold tone (endodermis with Casparian strips); a narrow ring of small thick-walled cells just inside that (pericycle); and at the very centre, a star-shaped arrangement of three to four solid wedge-shaped patches in pale blue (xylem, water-conducting) alternating with softer patches in warm tan (phloem), with only a tiny sliver of empty space at the dead centre (small, inconspicuous pith). Clean white outlines throughout, biologically accurate proportions, labels in white text with thin white leader lines pointing to each ring. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.06, label: 'Epiblema & Root Hairs', icon: 'circle',
          detail: 'The outermost layer of the root. Many epiblema cells protrude outward as **unicellular root hairs**, which absorb water and minerals from the soil.' },
        { id: uuid(), x: 0.82, y: 0.30, label: 'Cortex', icon: 'circle',
          detail: 'Several layers of **thin-walled parenchyma cells** with **intercellular spaces** between them, lying just inside the epiblema.' },
        { id: uuid(), x: 0.74, y: 0.56, label: 'Endodermis', icon: 'circle',
          detail: 'The innermost layer of the cortex — a **single ring of barrel-shaped cells** with **no intercellular spaces**. Its tangential and radial walls carry **suberin**, deposited as **Casparian strips**, making them water-impermeable.' },
        { id: uuid(), x: 0.50, y: 0.80, label: 'Pericycle', icon: 'circle',
          detail: 'A few layers of **thick-walled parenchymatous cells** just inside the endodermis. **Lateral roots** and the **vascular cambium** (during secondary growth) both initiate here.' },
        { id: uuid(), x: 0.38, y: 0.52, label: 'Xylem', icon: 'circle',
          detail: 'Usually **2 to 4 patches** in a dicot root, arranged with protoxylem toward the outside and metaxylem toward the centre.' },
        { id: uuid(), x: 0.62, y: 0.52, label: 'Phloem', icon: 'circle',
          detail: 'Alternates with the xylem patches — also usually **2 to 4 patches**. A cambium ring later develops **between** the xylem and the phloem.' },
        { id: uuid(), x: 0.50, y: 0.50, label: 'Pith & Stele', icon: 'circle',
          detail: 'The pith is **small or inconspicuous** in a dicot root. Together, the pericycle, vascular bundles, and pith — everything inside the endodermis — form the **stele**.' },
      ],
    },
    // ── 6 · Heading — monocot root ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Monocotyledonous Root — Same Plan, Three Real Differences',
      objective: "By the end of this you can list the three facts that separate a monocot root T.S. from a dicot root T.S. on sight.",
    },
    // ── 7 · Text — monocot root detail ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The anatomy of the monocot root (Figure 6.3b) is similar to the dicot root in many respects. It has the same set of tissues — **epidermis, cortex, endodermis, pericycle, vascular bundles, and pith** — arranged in the same order, from the outside in.\n\nWhat's different is three specific facts. First, **xylem bundle number**: a dicot root has fewer xylem bundles, but a monocot root usually has **more than six — described as polyarch**. Second, **pith size**: where the dicot root's pith is small or inconspicuous, the monocot root's **pith is large and well developed**. Third, and most important: **monocotyledonous roots do not undergo any secondary growth** — a monocot root never forms the cambium ring that a dicot root develops later in life.",
    },
    // ── 8 · Reasoning prompt (mid-page) ──────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "You're handed an unlabelled transverse section of a root and asked whether it's a dicot root or a monocot root. Which single structural check, per NCERT, gives you the fastest and most reliable answer?",
      options: [
        "Count the xylem bundles: 2 to 4 patches means dicot, more than six (polyarch) means monocot",
        "Compare the pith: a large, well-developed pith means dicot, and a small, inconspicuous one means monocot",
        "Check for a cambium ring: if one is already present, the root must be monocot, since only monocots undergo secondary growth",
        "Check for vascular bundles: only the dicot root has them, while the monocot root relies on scattered parenchyma instead",
      ],
      reveal: "The first option is right. NCERT gives xylem bundle number as an explicit difference — 2 to 4 patches in a dicot root, more than six (polyarch) in a monocot root — and it's the fastest thing to count in a cross-section. The second option reverses the actual fact: it's the **dicot** root whose pith is small or inconspicuous, and the **monocot** root whose pith is large and well developed — exactly backwards. The third option also reverses the fact: a **dicot** root develops a cambium ring later in life, while a **monocot** root never undergoes secondary growth at all. The fourth option is simply wrong — NCERT explicitly lists vascular bundles as one of the tissues present in the monocot root, right alongside epidermis, cortex, endodermis, pericycle, and pith.",
      difficulty_level: 2,
    },
    // ── 9 · Comparison card ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Dicot Root vs Monocot Root',
      columns: [
        {
          heading: 'Dicot Root',
          points: [
            'Xylem bundles: usually 2 to 4 xylem and phloem patches',
            'Pith: small or inconspicuous',
            'Secondary growth: yes — a cambium ring develops later, between the xylem and phloem',
            'Outer layer: epiblema, with cells protruding as unicellular root hairs',
          ],
        },
        {
          heading: 'Monocot Root',
          points: [
            'Xylem bundles: usually more than six — polyarch',
            'Pith: large and well developed',
            'Secondary growth: none — monocot roots never undergo secondary growth',
            'Shares with dicot: epidermis, cortex, endodermis, pericycle, vascular bundles, and pith — same tissues, same order',
          ],
        },
      ],
    },
    // ── 10 · Remember callout ──────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Epiblema** = dicot root's outermost layer; cells protrude as **unicellular** root hairs.\n- **Endodermis** = single layer, barrel-shaped cells, no intercellular spaces; **suberin** deposited as **Casparian strips** on the tangential and radial walls.\n- **Pericycle** = thick-walled parenchyma next to the endodermis; gives rise to **lateral roots** and the **vascular cambium** (secondary growth).\n- **Stele** = everything inside the endodermis — pericycle + vascular bundles + pith, together.\n- **Dicot root:** 2–4 xylem/phloem patches, small pith, cambium ring develops later.\n- **Monocot root:** polyarch (>6) xylem bundles, large pith, **never** undergoes secondary growth.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Casparian strips — the water checkpoint:** the endodermis's tangential and radial walls carry a waterproof waxy deposit of suberin, laid down as Casparian strips. Because those exact walls are water-impermeable, nothing can leak straight through them — that's what makes the endodermis the checkpoint controlling what reaches the stele.\n\n**The fastest T.S. identification rule:** count the xylem arms. **2 to 4 arms = dicot root. More than six, polyarch = monocot root.** NEET loves handing you an unlabelled root cross-section and asking 'dicot or monocot?' — the xylem count answers it faster than checking pith size or hunting for a cambium ring.\n\n**Classic NEET question:** \"In a monocot root, the pith is —\" → **large and well developed** (the opposite of the dicot root, where it's small or inconspicuous).",
    },
    // ── 12 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know every ring in a root cross-section, and the one number — xylem count — that gives away dicot or monocot in a glance. Next, we take that same slicing idea above ground, into the stem, where the vascular bundles fall into a completely different arrangement.",
    },
    // ── 13 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "What is the outermost layer of a dicot root called, and what distinctive structure do many of its cells form?",
          options: [
            'Epiblema; many cells protrude outward as unicellular root hairs',
            'Epidermis; many cells form multicellular root hairs',
            'Cortex; many cells form air-filled intercellular spaces',
            'Pericycle; many cells initiate lateral roots',
          ],
          correct_index: 0,
          explanation: "NCERT names the dicot root's outermost layer the epiblema, and its root hairs are unicellular — a single cell drawn into a hair, not several cells joined together. The cortex lies just inside the epiblema and is defined by its intercellular spaces, not root hairs, and it isn't the outermost layer. The pericycle is an inner layer next to the endodermis, where lateral roots initiate — it isn't the outer layer either.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In a dicot root, the tangential and radial walls of the endodermal cells carry a water-impermeable, waxy deposit laid down as strip-like bands. What is this material, and what are the bands called?",
          options: [
            'Cutin, deposited as Casparian strips',
            'Suberin, deposited as Casparian strips',
            'Lignin, deposited as pericycle bands',
            'Suberin, deposited as cortex bands',
          ],
          correct_index: 1,
          explanation: "NCERT names the waterproof waxy material suberin, and the bands it forms are Casparian strips — both on the endodermal walls. Cutin is a different waxy plant substance (found in the cuticle), not the one described here. Lignin thickens cell walls elsewhere in the plant, not the endodermis, and 'pericycle bands' and 'cortex bands' aren't terms NCERT uses — Casparian strips belong specifically to the endodermis.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which of these is an accurate difference between a dicot root and a monocot root, as described by NCERT?",
          options: [
            "The dicot root has a large, well-developed pith, while the monocot root's pith is small or inconspicuous",
            'The monocot root develops a cambium ring during secondary growth, while the dicot root never does',
            'The monocot root usually has more than six (polyarch) xylem bundles, while the dicot root has fewer (2 to 4) xylem and phloem patches',
            'The dicot root lacks a pericycle, while the monocot root has one',
          ],
          correct_index: 2,
          explanation: "NCERT states the monocot root usually has more than six, polyarch, xylem bundles, against the dicot root's 2 to 4 xylem and phloem patches. The first option has pith size exactly backwards — it's the monocot root with the large, well-developed pith, and the dicot root with the small, inconspicuous one. The second option also reverses secondary growth — it's the dicot root that develops a cambium ring later, while the monocot root never undergoes secondary growth. The fourth option is false: NCERT explicitly lists the pericycle as present in both roots.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The pericycle in a dicot root is described as a few layers of thick-walled parenchymatous cells lying next to the endodermis. What two processes does NCERT say begin in these cells?",
          options: [
            'Initiation of root hairs and absorption of water',
            'Initiation of xylem and phloem differentiation',
            'Initiation of the Casparian strip and suberin deposition',
            'Initiation of lateral roots and vascular cambium during secondary growth',
          ],
          correct_index: 3,
          explanation: "NCERT states plainly that the initiation of lateral roots, and of the vascular cambium during secondary growth, both take place in the pericycle. Root hairs form from the epiblema, not the pericycle. The Casparian strip and suberin deposition belong to the endodermis, the layer just outside the pericycle. Xylem and phloem differentiation isn't described as beginning in the pericycle in this text.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
