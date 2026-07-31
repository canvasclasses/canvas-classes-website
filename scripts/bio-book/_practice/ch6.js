'use strict';
// Class 11 Biology — Ch.6 Anatomy of Flowering Plants — "Practice — NCERT
// Exercises" page. All 7 verbatim NCERT exercises (source:
// scripts/bio-book/_ncert_pdfs/kebo106.txt, EXERCISES section), regrouped into
// 3 revision themes. Every fact traces to this chapter's own already-published
// lesson pages. Ids are hardcoded static strings, not dynamic uuid() calls.
module.exports = {
  slug: 'ch6-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 7 NCERT textbook exercises for the chapter, grouped into 3 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '9b599ec3-c079-4450-9fa6-708274747744',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dicot stem cross-section on the left showing vascular bundles arranged in a single ring, beside a monocot stem cross-section on the right showing bundles scattered throughout the ground tissue',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). Left half: a circular stem cross-section with small oval vascular bundles arranged in one neat ring just inside the outer edge. Right half: a circular stem cross-section of the same size with similar oval vascular bundles scattered randomly throughout the entire cross-section, some near the edge, some near the centre, no ring pattern. Clean white outlines, muted natural sage and tan tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image.",
    },
    {
      id: 'e34e9129-9779-43af-8b58-00649eae14ac',
      type: 'text',
      order: 1,
      markdown: "You've read the chapter — now drill it. Below are **all 7 NCERT exercises** for *Anatomy of Flowering Plants*, pulled out of the textbook's running order and re-sorted into three revision themes: the stomatal apparatus and tissue systems, reading a root/stem cross-section to call it dicot or monocot, and the internal structure of a leaf.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through.",
    },
    {
      id: 'f1122596-b8ec-46b5-ab0e-1b293348cf82',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 6.1–6.7',
      intro: 'Every end-of-chapter exercise, regrouped into three revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: 's1-tissue-systems',
          title: 'The Three Tissue Systems & the Stomatal Apparatus',
          blurb: 'What every plant organ is built from, and the one structure every leaf breathes through.',
          items: [
            {
              kind: 'numerical',
              id: 'a0007604-82f3-4cc2-ad23-6bbe1bc89516',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.4',
              prompt: 'What is stomatal apparatus? Explain the structure of stomata with a labelled diagram.',
              answer: 'The stomatal apparatus is the stomatal aperture plus its two guard cells plus the surrounding subsidiary cells. Each guard cell is bean-shaped (dumb-bell shaped in grasses), with a thin outer wall and a thick inner wall, and carries its own chloroplasts.',
              solution: "The **stomatal apparatus** is the stomatal aperture (pore) together with its **guard cells** and the surrounding **subsidiary cells** — all three parts, taken as one unit.\n\nSince we can't draw here, picture the structure this way: two **bean-shaped guard cells** (in grasses, they're **dumb-bell shaped** instead) sit facing each other, enclosing a gap between them called the **stomatal pore**. The two walls of each guard cell are deliberately unequal — the **outer wall**, away from the pore, is **thin**, while the **inner wall**, toward the pore, is **highly thickened**. Unlike most epidermal cells, guard cells carry their own **chloroplasts**. Right beside the guard cells sit a few ordinary epidermal cells that have become **specialised in shape and size** — these are the **subsidiary cells**.\n\nThat wall asymmetry (thin outer, thick inner) plus the chloroplasts is exactly what lets guard cells regulate the pore's opening and closing — the single most-tested structural detail on this topic.",
            },
            {
              kind: 'numerical',
              id: 'b1a8891a-a089-4f8c-9efe-c9ae3e7ed27b',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.5',
              prompt: 'Name the three basic tissue systems in the flowering plants. Give the tissue names under each system.',
              answer: 'Epidermal (epidermis, stomata, trichomes/root hairs), Ground (parenchyma, collenchyma, sclerenchyma — called mesophyll in leaves), and Vascular (xylem and phloem).',
              solution: "Every organ of a flowering plant is built from the same three tissue systems, just arranged differently:\n\n1. **Epidermal tissue system** — the outermost covering of the whole plant body. Made of the **epidermal cells** themselves, **stomata**, and epidermal appendages (**trichomes** on the stem, **root hairs** on the root).\n2. **Ground (fundamental) tissue system** — defined by exclusion: every tissue except the epidermis and the vascular bundles. Built from the three simple tissues **parenchyma, collenchyma, and sclerenchyma**. In a leaf specifically, this tissue is called **mesophyll**.\n3. **Vascular (conducting) tissue system** — built from two complex tissues working as a pair: **xylem and phloem**, together forming a vascular bundle.\n\nEvery cross-section you look at, in any organ, is really just these three systems arranged in a different pattern — which is exactly the pattern that lets you tell a root from a stem, and a dicot from a monocot.",
            },
          ],
        },
        {
          id: 's2-root-and-stem',
          title: 'Reading a Root or Stem Cross-Section',
          blurb: 'The fastest tests for calling a transverse section dicot or monocot, root or stem.',
          items: [
            {
              kind: 'numerical',
              id: 'c8db9ffa-a384-4c4c-81de-72dc01a8f91d',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.1',
              prompt: 'Draw illustrations to bring out the anatomical difference between\n(a) Monocot root and Dicot root\n(b) Monocot stem and Dicot stem',
              answer: 'Root: dicot has 2–4 xylem patches, small pith, and a cambium ring develops later; monocot is polyarch (>6 xylem bundles) with a large pith and never undergoes secondary growth. Stem: dicot bundles sit in a ring; monocot bundles are scattered.',
              solution: "Since we can't draw here, walk through the anatomical differences point by point, ring by ring.\n\n**(a) Monocot root vs Dicot root** — both share the same tissue order from outside in: epidermis, cortex, endodermis, pericycle, vascular bundles, pith. Three real differences: \n- **Xylem count:** dicot root has **2 to 4** xylem and phloem patches; monocot root is **polyarch** — usually **more than six**.\n- **Pith:** small or inconspicuous in the dicot root; **large and well developed** in the monocot root.\n- **Secondary growth:** the dicot root later develops a **cambium ring** between xylem and phloem; the monocot root **never** undergoes secondary growth at all.\n\n**(b) Monocot stem vs Dicot stem** — the single fastest visual test: in a dicot stem, vascular bundles sit in **one neat ring**; in a monocot stem, they're **scattered** right across the ground tissue with no ring at all. Other differences: the dicot stem's hypodermis is **collenchymatous** (monocot's is **sclerenchymatous**); the dicot stem has **phloem parenchyma present** and its bundles are **open** (cambium present, can form secondary tissue); the monocot stem's bundles are **closed** (no cambium), each wrapped in its own **sclerenchymatous bundle sheath**, with **phloem parenchyma absent**.",
            },
            {
              kind: 'numerical',
              id: 'e5ae63ca-1fe7-4d72-8494-5771f819f927',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.2',
              prompt: 'Cut a transverse section of young stem of a plant from your school garden and observe it under the microscope. How would you ascertain whether it is a monocot stem or a dicot stem? Give reasons.',
              answer: 'Check whether the vascular bundles form one ring (dicot) or are scattered across the section (monocot) — this chapter\'s own fastest, cleanest test.',
              solution: "Look first at how the **vascular bundles** are arranged. NCERT is direct about this: the **\"ring\" arrangement of vascular bundles is a characteristic of dicot stem** — every bundle sits in a single neat ring just inside the outer layers. If instead the bundles are **scattered** right across the whole cross-section, with no ring pattern, it's a **monocot stem**.\n\nIf you want a backup confirmation, check the **hypodermis** just below the epidermis: **collenchymatous** hypodermis means dicot stem, **sclerenchymatous** hypodermis means monocot stem. Two more monocot give-aways if you need them: **phloem parenchyma is absent**, and each vascular bundle carries its own **sclerenchymatous bundle sheath** and small **water-containing cavities** — features a dicot stem's bundles don't have.\n\nRing vs scattered is the single cleanest, fastest clue — a botanist checks this first before looking at anything else.",
            },
            {
              kind: 'numerical',
              id: 'c7a44e8c-18dc-4c28-a0e4-d3a8cf7ad5df',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.3',
              prompt: 'The transverse section of a plant material shows the following anatomical features - (a) the vascular bundles are conjoint, scattered and surrounded by a sclerenchymatous bundle sheaths. (b) phloem parenchyma is absent. What will you identify it as?',
              answer: 'A monocot stem — this is NCERT\'s own exercise question, matching this chapter\'s Dicot & Monocot Stems page word for word.',
              solution: "This is a **monocot stem**. Every feature named in the question matches this chapter's own description of a monocot stem, feature for feature:\n\n- **Conjoint** vascular bundles — xylem and phloem sit together along the same radius. (Both dicot and monocot stems are conjoint — this alone doesn't decide it.)\n- **Scattered** — not arranged in a ring. This is the deciding clue: a ring means dicot, scattered means **monocot**.\n- **Sclerenchymatous bundle sheath** around each bundle — a feature the dicot stem's bundles don't carry at all.\n- **Phloem parenchyma absent** — explicitly one of the two named monocot give-aways in this chapter (the other being small water-containing cavities in each bundle).\n\nEvery single clue points the same direction, which is exactly why this combination is such a clean, unambiguous identification: **monocot stem**.",
            },
          ],
        },
        {
          id: 's3-leaf-and-application',
          title: 'The Leaf, and Why Anatomy Matters',
          blurb: "The internal structure of a dorsiventral leaf, and what studying plant anatomy is actually for.",
          items: [
            {
              kind: 'numerical',
              id: '1723efff-cff6-4139-90c5-2766970f4ed8',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.6',
              prompt: 'How is the study of plant anatomy useful to us?',
              answer: 'It lets you identify a plant as monocot or dicot from a single cross-section, and it explains how a plant actually transports water and food and grows thicker over time — none of which is visible from the outside.',
              solution: "This chapter is itself the answer, laid out end to end. Studying plant anatomy — the internal tissue arrangement — does several things external observation alone cannot:\n\n1. **It lets you identify a plant confidently.** A single glance at a root, stem, or leaf cross-section — ring vs scattered bundles, xylem count, mesophyll differentiation — tells you monocot or dicot, often faster and more reliably than looking at the whole plant.\n2. **It explains how the plant actually functions.** The vascular tissue system (xylem and phloem) is the plant's plumbing; knowing its arrangement (open vs closed bundles, radial vs conjoint) explains how water, minerals, and food actually move through the plant, and which plants are capable of adding secondary tissue and growing thicker year after year.\n3. **It reveals adaptations invisible from outside.** The Casparian strips in a root's endodermis, the bulliform cells in a grass leaf, the thin-vs-thick guard cell walls — every one of these is a functional adaptation you would never notice without looking inside.\n\nIn short: anatomy is what turns a plant from something you can only describe from the outside into something you can actually explain.",
            },
            {
              kind: 'numerical',
              id: '0ae72517-8457-42e7-9d2e-3dda7cb7e8d2',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.7',
              prompt: 'Describe the internal structure of a dorsiventral leaf with the help of labelled diagrams.',
              answer: 'From top to bottom: adaxial epidermis (few/no stomata) → palisade parenchyma (upright, photosynthetic) → spongy parenchyma (loose, air spaces) → abaxial epidermis (more stomata), with vascular bundles running through as veins, each wrapped in a bundle sheath.',
              solution: "Since we can't draw here, walk through the layers top to bottom, exactly as a vertical section through the lamina would show them.\n\n**Adaxial epidermis** (the upper surface) — covered in a conspicuous waxy **cuticle**, generally bears **fewer stomata** than the lower surface, sometimes none at all.\n\n**Palisade parenchyma** — sits just under the adaxial epidermis: elongated cells standing upright, arranged **vertically and parallel to each other**, like a row of columns. This is where most of the leaf's photosynthesis happens, since it faces the light directly.\n\n**Spongy parenchyma** — below the palisade layer, reaching down to the lower epidermis: oval or round cells, **loosely arranged**, with **numerous large air spaces and cavities** between them.\n\n**Vascular bundles (the veins)** — running through the mesophyll, size depending on the size of the vein. Dicot leaves have **reticulate (net-like) venation**, so bundle size varies across the leaf. Every bundle is wrapped in a ring of thick-walled **bundle sheath** cells.\n\n**Abaxial epidermis** (the lower surface) — also cuticle-covered, but carries **more stomata** than the adaxial side, making it the surface that does most of the leaf's gas exchange.\n\nThat two-sided design — palisade on top, spongy below, unequal stomata on the two faces — is exactly what makes a leaf a **dorsiventral** leaf, and it's the direct opposite of a monocot's undifferentiated, isobilateral design.",
            },
          ],
        },
      ],
    },
  ],
};
