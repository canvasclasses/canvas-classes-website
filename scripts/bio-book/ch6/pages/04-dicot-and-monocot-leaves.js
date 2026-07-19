'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'dicot-and-monocot-leaves',
  title: 'Dicot and Monocot Leaves',
  subtitle: "A leaf has two faces that do two different jobs — and once you know why, you can tell a dicot leaf from a monocot leaf from a single glance at a cross-section.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['anatomy-of-flowering-plants', 'leaf-anatomy', 'chapter-synthesis'],
  glossary: [
    { term: 'dorsiventral leaf', definition: 'A leaf whose upper and lower surfaces are structurally different — found in dicots. Its mesophyll is split into palisade and spongy parenchyma, and its abaxial epidermis carries more stomata than the adaxial one.' },
    { term: 'isobilateral leaf', definition: 'A leaf whose upper and lower surfaces are structurally alike — found in monocots. Stomata sit on both surfaces in roughly equal numbers, and the mesophyll is not differentiated into palisade and spongy layers.' },
    { term: 'mesophyll', definition: 'The photosynthetic tissue sitting between the upper and lower epidermis of a leaf. Made of parenchyma packed with chloroplasts.' },
    { term: 'palisade parenchyma', definition: 'Elongated mesophyll cells placed just under the adaxial epidermis, arranged vertically and parallel to each other. Found only in a dorsiventral (dicot) leaf.' },
    { term: 'spongy parenchyma', definition: 'Oval or round, loosely arranged mesophyll cells below the palisade layer, reaching down to the lower epidermis, with large air spaces between the cells.' },
    { term: 'bundle sheath', definition: 'A ring of thick-walled cells that surrounds every vascular bundle in a leaf vein.' },
    { term: 'bulliform cells', definition: 'Large, empty, colourless epidermal cells found along the veins on the adaxial surface of grass leaves. Turgid bulliform cells keep the leaf flat; flaccid ones make it curl inward under water stress.' },
    { term: 'adaxial / abaxial epidermis', definition: 'The upper (adaxial) and lower (abaxial) epidermal layers of a leaf. Both carry a conspicuous cuticle, but in a dorsiventral leaf the abaxial epidermis generally has more stomata than the adaxial one.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single leaf glowing from within at dusk, split by a soft internal light into an upper half and a lower half',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single large leaf floats centred in a dark atmospheric void, seen edge-on and gently backlit at dusk so a soft warm internal glow reveals its inner structure without any literal cross-section lines or labels — the upper half of the leaf reads as slightly cooler and more sealed-looking, the lower half as slightly warmer and more porous-looking, as if lit from two different sources above and below. Fine leaf veins branch faintly visible within the glow. Deep, moody dusk lighting, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Leaf Has Two Different Faces',
      markdown: "A leaf's two faces are not mirror images of each other. Both the top (**adaxial**) and bottom (**abaxial**) surfaces are sealed with a conspicuous waxy **cuticle**, but that's where the similarity ends: the bottom surface generally carries **more stomata** — the pores a leaf breathes through — while the top surface sometimes has almost none. Slice the leaf open and the green tissue underneath is just as split: it stacks into two distinct layers, not one uniform slab. That two-sided design is the whole story of this page — and it's not even the same story in every plant. Monocots build their leaves completely differently.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Slice a leaf vertically through its lamina (the flat blade) and you'll always find the same three parts, in the same order: an outer **epidermis**, a middle layer called the **mesophyll**, and a **vascular system** running through the veins. The epidermis covers both the upper surface — the **adaxial epidermis** — and the lower surface — the **abaxial epidermis** — and both carry a conspicuous waxy **cuticle** that cuts down water loss. But the two epidermises are not equal: the abaxial epidermis generally bears **more stomata** than the adaxial one, and the adaxial epidermis may lack stomata altogether. Between the two epidermises sits the **mesophyll** — the tissue that actually carries out the plant's photosynthesis, packed with chloroplasts and built from parenchyma. Exactly how that mesophyll is arranged is where a dicot leaf and a monocot leaf start to look very different.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Inside a Dorsiventral (Dicot) Leaf',
      objective: 'By the end of this you can name the three layers of a dorsiventral leaf cross-section and tell palisade parenchyma from spongy parenchyma on sight.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In a dorsiventral leaf the mesophyll splits into two distinct kinds of cells. Just under the adaxial epidermis sits the **palisade parenchyma** — elongated cells standing upright, arranged **vertically and parallel to each other**, like a row of columns. Below the palisade layer, and extending all the way down to the abaxial epidermis, sits the **spongy parenchyma** — oval or round cells, loosely arranged, with **numerous large air spaces and cavities** between them.\n\nThe **vascular system** runs through the veins and the midrib: vascular bundles whose size depends on the size of the vein they sit in. Dicot leaves have **reticulate (net-like) venation**, so the veins — and the bundles inside them — **vary in thickness** across the leaf. Every one of these vascular bundles is wrapped in a ring of thick-walled **bundle sheath** cells.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Vertical cross-section through a dorsiventral dicot leaf showing the adaxial epidermis, palisade parenchyma, spongy parenchyma, a vascular bundle, and the abaxial epidermis with stomata',
      caption: '📸 Tap each part of the dorsiventral leaf cross-section to explore',
      generation_prompt: "Scientific textbook illustration of a vertical cross-section through a dorsiventral (dicot) leaf. Flat 2D educational diagram on a dark background (#0a0a0a near-black), shown as a horizontal band from top to bottom. At the very top, a thin upper adaxial epidermis line with a clearly thicker outer cuticle layer above it and no visible pores. Below that, a layer of tall, narrow, tightly packed vertical column-like cells standing upright side by side (palisade parenchyma). Below that, a looser layer of round and oval cells with visible open gaps and air spaces between them (spongy parenchyma), extending down to a thin lower abaxial epidermis line with several small pore-like stomata openings dotted along it, clearly more numerous than any openings on the upper epidermis line. Embedded within the spongy layer, one or two circular vascular bundles (a vein in cross-section), each wrapped in a ring of visibly thicker-walled cells (the bundle sheath). Clean white outlines, biologically accurate proportions, no text or labels baked into the image itself, the layers clearly separated visually. Functional colours: rich green = palisade parenchyma, lighter green = spongy parenchyma, pale/translucent = epidermis and cuticle layers, tan/brown = the vascular bundle and bundle sheath. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.08, label: 'Adaxial epidermis', icon: 'circle',
          detail: "The **upper (adaxial) epidermis** carries a conspicuous waxy **cuticle**, just like the lower epidermis — but it generally has **fewer stomata**, sometimes none at all." },
        { id: uuid(), x: 0.28, y: 0.28, label: 'Palisade parenchyma', icon: 'circle',
          detail: "**Palisade parenchyma** sits just under the adaxial epidermis. Its cells are **elongated** and arranged **vertically, parallel to each other** — this is where most of the leaf's photosynthesis happens." },
        { id: uuid(), x: 0.28, y: 0.58, label: 'Spongy parenchyma', icon: 'circle',
          detail: "**Spongy parenchyma** is **oval or round** and **loosely arranged**, sitting below the palisade layer and reaching down to the lower epidermis. **Numerous large air spaces** sit between its cells." },
        { id: uuid(), x: 0.65, y: 0.55, label: 'Vascular bundle & bundle sheath', icon: 'circle',
          detail: "A **vein in cross-section** — a vascular bundle whose size depends on the size of the vein. It's wrapped in a ring of thick-walled **bundle sheath** cells." },
        { id: uuid(), x: 0.5, y: 0.9, label: 'Abaxial epidermis & stomata', icon: 'circle',
          detail: "The **lower (abaxial) epidermis** generally bears **more stomata** than the upper epidermis — this is the surface doing most of the leaf's gas exchange." },
        { id: uuid(), x: 0.8, y: 0.4, label: 'Veins (reticulate venation)', icon: 'circle',
          detail: "Dicot leaves have **reticulate (net-like) venation**, so the veins — and the vascular bundles inside them — **vary in thickness** across the lamina." },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A cross-section of an unknown leaf shows clearly more stomata on the lower epidermis than on the upper epidermis, which is almost bare of pores. Which type of leaf is this most likely to be, and on what basis?",
      options: [
        "An isobilateral (monocot) leaf, because stomata are equally distributed on isobilateral leaves",
        "A dorsiventral leaf, because its mesophyll is undifferentiated",
        "A dorsiventral (dicot) leaf, because the abaxial epidermis normally bears more stomata than the adaxial one",
        "An isobilateral leaf, because bulliform cells control where stomata sit",
      ],
      correct_index: 2,
      reveal: "NCERT states that in a leaf, the abaxial epidermis generally bears more stomata than the adaxial epidermis, which may even lack stomata altogether — exactly the pattern described. That makes it a **dorsiventral (dicot) leaf**. The isobilateral-leaf answer describes a real leaf type correctly, but that's the *opposite* pattern from the one in the question — an isobilateral leaf has stomata on *both* surfaces in roughly equal numbers. Picking a dorsiventral leaf for the reason that its mesophyll is undifferentiated gets the leaf type right but the reason wrong: a dorsiventral leaf's mesophyll is *differentiated* into palisade and spongy layers — undifferentiated mesophyll is the monocot trait. And the answer built around bulliform cells mixes up a real monocot feature with a job it doesn't do — bulliform cells make the leaf curl under water stress, they don't control stomatal distribution.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: "Isobilateral (Monocot) Leaf — What's Different",
      objective: "By the end of this you can list the three ways an isobilateral leaf's anatomy differs from a dorsiventral one, and explain what bulliform cells do.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "An isobilateral leaf — the kind found in monocots — is built from the same three parts, but three details change. First, **stomata sit on both surfaces of the epidermis**, in roughly equal numbers, instead of being concentrated on the abaxial side. Second, the **mesophyll is not differentiated** into palisade and spongy parenchyma — it stays a single, undifferentiated layer of photosynthetic tissue.\n\nThird, in grasses specifically, certain **adaxial epidermal cells along the veins enlarge into large, empty, colourless bulliform cells**. When these cells have absorbed water and are **turgid**, the leaf surface stays exposed. When they turn **flaccid** under water stress, they make the leaf **curl inwards**, cutting down water loss. And because monocot leaves have **parallel venation**, the vascular bundles come out **near-similar in size** across the lamina — except in the main veins.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 9, title: 'Dorsiventral (Dicot) Leaf vs Isobilateral (Monocot) Leaf',
      columns: [
        { heading: 'Dorsiventral (dicot) leaf', points: [
          'Abaxial epidermis has more stomata than adaxial; adaxial may lack stomata entirely',
          'Mesophyll differentiated into palisade (adaxial, elongated, vertical) + spongy (loose, air spaces) parenchyma',
          'No bulliform cells',
          'Reticulate venation → vein and vascular bundle size varies across the leaf',
        ] },
        { heading: 'Isobilateral (monocot) leaf', points: [
          'Stomata present on both surfaces, in roughly equal numbers',
          'Mesophyll not differentiated — one undifferentiated photosynthetic layer',
          'Bulliform cells present along veins in grasses',
          'Parallel venation → vascular bundles near-similar in size (except main veins)',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **Dorsiventral (dicot) leaf:** abaxial epidermis has **more stomata** than adaxial (which may have none); mesophyll **differentiated** into palisade (adaxial, elongated, vertical) + spongy (loose, air spaces) parenchyma; **reticulate venation** → vein/bundle size varies.\n- **Isobilateral (monocot) leaf:** stomata on **both surfaces**, roughly equal; mesophyll **undifferentiated**; **bulliform cells** (in grasses) control leaf curling; **parallel venation** → bundles near-similar in size (except main veins).\n- Every vascular bundle, in either leaf type, is wrapped in a **bundle sheath** of thick-walled cells.\n- **Bulliform cells: turgid = surface exposed, flaccid = leaf curls inward** to cut water loss.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Palisade vs spongy — which photosynthesises more efficiently?** The palisade cells stand upright, packed in parallel columns directly under the upper epidermis facing the light — that tight, vertical arrangement is why they carry out most of the leaf's photosynthesis, more than the loosely packed spongy layer beneath them.\n\n**Bulliform cells — the mechanism NEET tests:** turgid (water-filled) bulliform cells keep the leaf surface exposed; flaccid (water-stressed) bulliform cells make the leaf **curl inward** to minimise water loss. Flip the turgid/flaccid pair and you've picked the trap.\n\n**Stomata as a diagnostic:** more stomata on the **abaxial** surface (and few/none on adaxial) = dorsiventral, dicot. Roughly **equal** stomata on both surfaces = isobilateral, monocot.\n\n**Mesophyll differentiation is the other diagnostic:** palisade + spongy layers = dicot; one undifferentiated layer = monocot.\n\n**Classic NEET question:** \"In grasses, which large, empty, colourless cells help the leaf curl inward to minimise water loss during water stress?\" → **Bulliform cells.**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Look back across this whole chapter — root, stem, and now leaf — and one difference keeps resurfacing in a new disguise each time. A plant is built from the same three tissue systems everywhere: epidermal, ground, and vascular. The ground tissue system is the same three zones — cortex, pericycle, and pith — whether you're looking at a root or a stem. And its vascular bundles are always classified by the same handful of questions: is cambium present, and where do xylem and phloem sit?\n\nMonocots and dicots answer those questions differently in every organ. In the root and stem, that shows up as differences in the type, number, and location of vascular bundles. In the leaf, it shows up as the mesophyll — differentiated into palisade and spongy layers in a dicot, undifferentiated in a monocot. And running underneath all of it is one more dicot-only trait: **secondary growth**, which thickens most dicot roots and stems year after year but does not happen in monocots at all. Once you can spot cambium, vascular bundle arrangement, and mesophyll differentiation, you can tell a dicot from a monocot in any organ NEET hands you — root, stem, or leaf.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In a dorsiventral (dicot) leaf, where are the elongated palisade parenchyma cells found, and how are they arranged?',
          options: [
            'Abaxially placed, arranged vertically and parallel to each other',
            'Adaxially placed, arranged vertically and parallel to each other',
            'Abaxially placed, arranged loosely with large air spaces between them',
            'Adaxially placed, arranged loosely with large air spaces between them',
          ],
          correct_index: 1,
          explanation: "NCERT places the palisade parenchyma adaxially, made of elongated cells arranged vertically and parallel to each other. Keeping that same vertical, parallel arrangement but placing it abaxially swaps the correct location for the one the spongy parenchyma extends to instead. The two options describing a loose arrangement with large air spaces are actually describing the spongy parenchyma, not the palisade — moving those features onto the palisade cells is the trap.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'How does stomatal distribution differ between a dorsiventral leaf and an isobilateral leaf?',
          options: [
            'Both have more stomata on the adaxial surface',
            'Dorsiventral: stomata present on both surfaces; Isobilateral: more stomata on the abaxial surface',
            'Both have stomata present equally on both surfaces',
            'Dorsiventral: more stomata on the abaxial surface; Isobilateral: stomata present on both surfaces',
          ],
          correct_index: 3,
          explanation: "NCERT states the abaxial epidermis of a dorsiventral leaf generally bears more stomata than the adaxial one, while an isobilateral leaf has stomata present on both surfaces of the epidermis. Putting more stomata on the adaxial surface reverses NCERT's actual pattern. Swapping the two leaf types' patterns around gets both halves backwards. And claiming both leaf types have stomata equally on both surfaces erases the very difference that separates a dorsiventral leaf from an isobilateral one.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In grasses, what happens to the leaf surface when the bulliform cells turn flaccid due to water stress?',
          options: [
            'The leaves curl inwards to minimise water loss',
            'The leaf surface stays fully exposed',
            'The stomata on the abaxial epidermis close completely',
            'The mesophyll differentiates into palisade and spongy layers',
          ],
          correct_index: 0,
          explanation: "NCERT states that flaccid bulliform cells make the leaves curl inwards to minimise water loss. Staying fully exposed describes the opposite condition — a leaf stays exposed when the bulliform cells are turgid (water-filled), not flaccid. Stomata closing completely is a role NCERT never assigns to bulliform cells. And mesophyll differentiating into palisade and spongy layers describes a dorsiventral (dicot) leaf trait — isobilateral leaves, where bulliform cells occur, do not differentiate their mesophyll at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Why do the vascular bundles in an isobilateral (monocot) leaf appear near-similar in size across the lamina, except in the main veins?',
          options: [
            'Because the mesophyll is differentiated into palisade and spongy parenchyma, standardising the bundles',
            'Because the bulliform cells control the size of every vascular bundle in the lamina',
            'Because the parallel venation of monocot leaves is reflected in near-similar sizes of vascular bundles',
            'Because the reticulate venation of monocot leaves keeps the veins evenly thick',
          ],
          correct_index: 2,
          explanation: "NCERT directly states that the parallel venation in monocot leaves is reflected in the near-similar sizes of vascular bundles, except in the main veins. Crediting mesophyll differentiation wrongly imports the dicot's differentiated-mesophyll trait, which monocot leaves don't have. Giving bulliform cells a role here is wrong too — per NCERT their only job is controlling leaf curling under water stress. And crediting reticulate venation swaps the venation pattern — reticulate venation is the dicot leaf's trait, and it's what gives vein thickness that varies rather than stays similar.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
