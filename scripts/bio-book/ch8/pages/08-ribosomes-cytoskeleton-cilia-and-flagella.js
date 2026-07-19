'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'ribosomes-cytoskeleton-cilia-and-flagella',
  title: 'Ribosomes, Cytoskeleton, Cilia, and Flagella',
  subtitle: "A ribosome's 'S' number can't be added like ordinary arithmetic — and once you know why, you're ready to read the cell's other moving parts: the scaffolding that holds its shape and the oar-like structures that move it.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'ribosomes', 'cytoskeleton', 'cilia', 'flagella'],
  glossary: [
    { term: 'ribosome', definition: 'A granular, RNA-and-protein structure that carries out protein synthesis. It has no surrounding membrane and is always built from two subunits.' },
    { term: 'Svedberg unit (S)', definition: "The sedimentation coefficient — an indirect measure of a particle's density and size, used to label ribosome subunits and whole ribosomes (e.g. 70S, 80S). It is a rate, not a mass, so subunit numbers do not add up to the whole ribosome's number." },
    { term: 'cytoskeleton', definition: 'The network of microtubules, microfilaments, and intermediate filaments in the cytoplasm that gives a cell mechanical support, motility, and shape.' },
    { term: 'axoneme', definition: "The microtubule-based core of a cilium or flagellum, arranged in the '9+2' array and covered by the plasma membrane." },
    { term: '9+2 array', definition: 'The arrangement of nine peripheral microtubule doublets around a central pair of microtubules inside an axoneme.' },
    { term: 'basal body', definition: 'The centriole-like structure from which both the cilium and the flagellum emerge.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Countless tiny glowing bead-like specks on the left dissolving into hair-like translucent strands swaying together like oars on the right',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Left half of the frame: a dense scatter of small glowing bead-like specks floating in dark space, each one faintly split into two unequal-sized halves as if built from two joined parts, suggesting countless tiny two-piece machines at work. Moving rightward, the specks thin out and gradually give way to a field of long, translucent, hair-like strands swaying together in a single gentle direction like oars moving through water, softly lit from within with a faint warm glow along their length. No text, no labels, no diagram elements, no people. Deep dusk lighting, painterly illustration style, dark background tones throughout (#0a0a0a base).",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Seen for the First Time Only in 1953',
      markdown: "Ribosomes are everywhere inside a cell, in their thousands — yet nobody could actually see one until the electron microscope came along. In **1953**, **George Palade** looked through one and described them exactly as what they are: small, dense, granular particles scattered through the cytoplasm. Before that, this entire protein-making machine was invisible to biology.",
    },
    // ── 2 · Text — ribosome core concept ──────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A ribosome isn't a single solid blob — think of it as a two-part machine. Long before anyone could see one clearly, ribosomes showed up under the electron microscope as small dense granules, and George Palade was the first to observe and describe them this way, in 1953. Two facts about that description matter for you: what a ribosome is made of, and what it is *not* wrapped in. A ribosome is built from **ribonucleic acid (RNA) and proteins**, and — unlike almost every other organelle you've met in this chapter — it carries **no membrane around it at all**.\n\nThe size of that machine changes depending on which kind of cell you're in. A **eukaryotic cell** — yours, a plant's, a fungus's — carries **80S ribosomes**. A **prokaryotic cell** — a bacterium — carries **70S ribosomes**. In both cases, one ribosome is never a single piece: it is always **two subunits, a larger one and a smaller one**, sitting together.",
    },
    // ── 3 · Heading — Svedberg unit maths ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: "Reading the 'S' Number — Why Subunits Don't Simply Add Up",
      objective: 'By the end of this you can name both subunits of an 80S and a 70S ribosome — and explain exactly why their numbers refuse to add like ordinary arithmetic.',
    },
    // ── 4 · Text — Svedberg unit explanation ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **80S ribosome** splits into a **60S** larger subunit and a **40S** smaller subunit. The **70S ribosome** splits into a **50S** larger subunit and a **30S** smaller subunit. Hold on to this too: both 70S and 80S ribosomes are always made of exactly **two subunits** — never fewer, never more.\n\nHere's the part that trips almost everyone up the first time. That **'S' stands for the Svedberg unit**, and it is the **sedimentation coefficient** — literally, an indirect measure of how dense and how large a particle is, based on how it behaves when spun down in a centrifuge. It is a **rate**, not a length or a mass you can stack up. That's exactly why a **50S subunit plus a 30S subunit is called a 70S ribosome**, not an '80S' one — and why a **60S subunit plus a 40S subunit is called an 80S ribosome**, not a '100S' one. Treat the S number as a label read off the whole machine, never as something you calculate by adding the parts.",
    },
    // ── 5 · Comparison card — 70S vs 80S ──────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: '70S Ribosome vs 80S Ribosome',
      columns: [
        {
          heading: '70S — Prokaryotic',
          points: [
            'Found in prokaryotic cells',
            'Two subunits: 50S (larger) + 30S (smaller)',
            "50S + 30S is still called 70S — the S numbers don't add",
          ],
        },
        {
          heading: '80S — Eukaryotic',
          points: [
            'Found in eukaryotic cells',
            'Two subunits: 60S (larger) + 40S (smaller)',
            "60S + 40S is still called 80S — same non-additive rule",
          ],
        },
      ],
    },
    // ── 6 · Heading — Cytoskeleton ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: "The Cytoskeleton — The Cell's Internal Scaffolding",
      objective: 'By the end of this you can name the three cytoskeleton components and the three jobs they do together.',
    },
    // ── 7 · Text — cytoskeleton ─────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Step back from ribosomes and look at the cytoplasm as a whole, and you'll find another network running through it — this time built entirely from filament-shaped proteins. Three kinds of these filaments together make up the **cytoskeleton**: **microtubules**, **microfilaments**, and **intermediate filaments**.\n\nThis network isn't decoration. It does three real jobs inside the cell: it gives the cell **mechanical support**, it powers **motility** (actual movement), and it **maintains the shape of the cell**. Without it, a cell would have no internal scaffolding to hold its form, let alone move any of its parts.",
    },
    // ── 8 · Heading — Cilia and Flagella ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Cilia and Flagella — Hair-Like Outgrowths Built to Move',
      objective: 'By the end of this you can tell a cilium from a flagellum by function alone, and label every part of the 9+2 array.',
    },
    // ── 9 · Text — cilia/flagella intro + axoneme ───────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Cilia (singular: **cilium**) and flagella (singular: **flagellum**) are both **hair-like outgrowths of the cell membrane** — but they don't do the same job. **Cilia are small structures that work like oars**, beating back and forth to move either the cell itself or the fluid surrounding it. **Flagella are comparatively longer**, and their job is **cell movement**. Prokaryotic bacteria carry flagella too, but bacterial flagella are **structurally different** from the eukaryotic flagella described here — don't assume the two are built the same way just because they share a name.\n\nLook at either one under the electron microscope and you'll find both are **covered by the plasma membrane** on the outside. Inside that covering sits the real machinery: the **axoneme**, a core built from microtubules running parallel to the whole structure's long axis.",
    },
    // ── 10 · Interactive image — Figure 8.10, 9+2 array ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'Cross-section of an axoneme showing nine peripheral microtubule doublets around a central pair, connected by radial spokes and interdoublet bridges, enclosed by the plasma membrane',
      caption: '📸 Tap each part of the axoneme to see what it does — Figure 8.10',
      generation_prompt: "Scientific textbook illustration of a cross-section through the axoneme of a cilium or flagellum, Figure 8.10 style. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A circular cross-section centred in the frame: nine identical paired-tubule (doublet) shapes evenly spaced in a ring around the outer edge, each doublet drawn as a figure-eight-shaped pair of small joined circles. A single pair of separate circular microtubules sits exactly at the centre of the ring, enclosed by a faint circular outline (the central sheath). Nine thin straight radial lines (radial spokes) connect the central sheath outward to one tubule of each of the nine peripheral doublets, like spokes on a wheel. Thin curved linker lines (interdoublet bridges) connect each peripheral doublet to its immediate neighbour around the ring. The entire ring is enclosed by a single outer circular boundary line representing the plasma membrane. Clean white outlines throughout, no baked-in text labels, biologically accurate proportions matching a real 9+2 axonemal cross-section. No photorealism, no cartoon, no mascots — matches standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: uuid(), x: 0.5, y: 0.06, label: 'Plasma membrane', icon: 'circle',
          detail: 'The outer covering of the whole cilium or flagellum. Electron microscopy shows both structures are covered with the plasma membrane, on the outside of the axoneme.',
        },
        {
          id: uuid(), x: 0.85, y: 0.30, label: 'Peripheral microtubule doublet', icon: 'circle',
          detail: "One of nine doublets of microtubules arranged radially around the edge of the axoneme — together they give the '9' in the 9+2 array.",
        },
        {
          id: uuid(), x: 0.5, y: 0.5, label: 'Central microtubules', icon: 'circle',
          detail: "A pair of microtubules sitting at the very centre of the axoneme — the '2' in the 9+2 array. The two central tubules are connected to each other by bridges.",
        },
        {
          id: uuid(), x: 0.5, y: 0.40, label: 'Central sheath', icon: 'circle',
          detail: 'A sheath enclosing the central pair of microtubules. It is connected to one tubule of each peripheral doublet by a radial spoke.',
        },
        {
          id: uuid(), x: 0.66, y: 0.44, label: 'Radial spoke', icon: 'circle',
          detail: 'The connector running from the central sheath out to one tubule of each peripheral doublet. Because there are nine peripheral doublets, there are nine radial spokes in total.',
        },
        {
          id: uuid(), x: 0.78, y: 0.62, label: 'Interdoublet bridge', icon: 'circle',
          detail: 'A linker connecting one peripheral doublet to its neighbouring doublet. The peripheral doublets are interconnected this way all the way around the ring.',
        },
      ],
    },
    // ── 11 · Reasoning prompt — 9+2 array recognition ───────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "You're looking at an electron micrograph cross-section of an axoneme. Right at the centre, enclosed by a sheath, sits a pair of microtubules — and nine thin spokes run outward from that sheath to the ring of doublets at the edge. What is this central, sheath-enclosed pair called, and how many spokes connect it to the periphery?",
      options: [
        'The central microtubules, connected to the nine peripheral doublets by nine radial spokes',
        'One of the nine peripheral microtubule doublets, connected to the plasma membrane by a single radial spoke',
        'The basal body, connected to the peripheral doublets by interdoublet bridges',
        'The central sheath itself, which is one of the nine peripheral doublets pushed to the centre',
      ],
      reveal: "The pair of microtubules at the very centre of the axoneme is the central pair — enclosed by the central sheath, which is linked outward to one tubule of each of the nine peripheral doublets by a radial spoke, giving nine radial spokes in total. A peripheral doublet sits at the edge of the ring, not the centre, and it connects to its neighbouring doublet through an interdoublet bridge, not a radial spoke to the membrane. The basal body is a different structure altogether — the centriole-like base the whole cilium or flagellum grows from, not a part of the axoneme's cross-section. And the central sheath is not a repositioned peripheral doublet; it's the structure enclosing the central pair.",
      difficulty_level: 3,
    },
    // ── 12 · Comparison card — cilium vs flagellum ──────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 12,
      title: 'Cilium vs Flagellum',
      columns: [
        {
          heading: 'Cilium',
          points: [
            'Comparatively short',
            'Works like an oar, beating back and forth',
            'Moves the cell itself, or the fluid surrounding the cell',
          ],
        },
        {
          heading: 'Flagellum',
          points: [
            'Comparatively longer',
            'Responsible for cell movement',
            'Both share the same 9+2 axoneme and a plasma-membrane covering',
          ],
        },
      ],
    },
    // ── 13 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'The Facts You Cannot Get Wrong',
      markdown: "- Ribosomes were first observed as dense granular particles under the electron microscope by **George Palade (1953)**.\n- Ribosomes = **RNA + proteins**, with **no membrane** around them.\n- **Eukaryotic = 80S** (subunits **60S + 40S**). **Prokaryotic = 70S** (subunits **50S + 30S**). Both are always **two subunits**.\n- **'S' = Svedberg unit** = sedimentation coefficient — an indirect measure of density and size, not an additive number.\n- **Cytoskeleton** = microtubules + microfilaments + intermediate filaments → mechanical support, motility, shape.\n- **Cilia**: small, oar-like, move the cell or surrounding fluid. **Flagella**: longer, responsible for cell movement. Bacterial flagella are structurally different from eukaryotic flagella.\n- **Axoneme** = the microtubule core of a cilium/flagellum, covered by the plasma membrane, arranged in a **9+2 array**: 9 peripheral doublets (interconnected by linkers) + 1 central pair (connected by bridges, enclosed by a central sheath, linked to each doublet by one of **nine radial spokes**).\n- Both cilium and flagellum emerge from a centriole-like structure, the **basal body**.",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The Svedberg trap:** 'S' is a sedimentation coefficient, not a mass you can add up. A 70S ribosome is built from a 50S + a 30S subunit — 50 + 30 arithmetically gives 80, but the ribosome is still called **70S, never 80S**. The same trap repeats at the eukaryotic level: 60S + 40S does not become '100S' by simple addition — it's still just **80S**. NEET loves handing you two subunit numbers and asking you to 'add' them. Resist the urge — recall the whole-ribosome number directly instead.\n\n**Classic NEET question:** \"Which ribosome is built from 60S and 40S subunits?\" → the **80S eukaryotic ribosome**.\n\n**Bridge ahead:** Both the cilium and the flagellum arise from a centriole-like structure called the **basal body** — your cue that the next structure worth studying, the centriole itself, is built on the same design.",
    },
    // ── 15 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You've now met the cell's protein-making machines, its internal scaffolding, and its oar-and-whip structures for movement. Next, you'll meet the structure both the cilium and the flagellum are built from at their base — the centriole — and see why it matters far beyond just movement.",
    },
    // ── 16 · Inline quiz ────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'George Palade first described ribosomes in 1953. How did he see them, and using what instrument?',
          options: [
            'As dense granular particles, using the electron microscope',
            'As membrane-bound sacs, using the light microscope',
            'As thread-like fibres, using the electron microscope',
            'As dense granular particles, using the light microscope',
          ],
          correct_index: 0,
          explanation: "NCERT states ribosomes were first observed under the electron microscope as dense particles by George Palade in 1953. Calling them 'membrane-bound' contradicts the very next fact taught alongside it — ribosomes are explicitly not surrounded by any membrane. The other two options get the instrument wrong; an ordinary light microscope cannot resolve structures this small.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "An 80S eukaryotic ribosome is built from two subunits. Which pair are they — and why is it wrong to think 60 + 40 should equal the ribosome's own number?",
          options: [
            "60S and 40S — because 'S' is a sedimentation coefficient, not an additive mass, so the subunit numbers don't sum to the whole ribosome's number",
            '50S and 30S — the same pair that makes up the prokaryotic 70S ribosome',
            '60S and 40S — because Svedberg units always add up exactly, so 60 + 40 confirms the ribosome must be 100S',
            '65S and 15S — an alternate pairing found only in plant ribosomes',
          ],
          correct_index: 0,
          explanation: "The 80S ribosome's two subunits are 60S and 40S — but S is a sedimentation coefficient (how fast a particle settles in a centrifuge), not a size you add up, so 60 + 40 does not become the ribosome's own number. 50S and 30S is the prokaryotic 70S ribosome's pairing, not the eukaryotic one. Claiming Svedberg units 'always add up exactly' gets the reasoning backwards — that's precisely the trap this fact is designed to catch. NCERT gives no alternate 65S/15S pairing for plants.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which three types of filamentous proteins together make up the cytoskeleton?',
          options: [
            'Microtubules, microfilaments, and intermediate filaments',
            'Microtubules, ribosomes, and centrioles',
            'Actin filaments, chromosomes, and the nuclear envelope',
            'Peripheral doublets, central microtubules, and radial spokes',
          ],
          correct_index: 0,
          explanation: 'NCERT names microtubules, microfilaments, and intermediate filaments as the three components of the cytoskeleton. Ribosomes and centrioles are separate organelles, not cytoskeleton components; chromosomes and the nuclear envelope belong to the nucleus. Peripheral doublets, central microtubules, and radial spokes are parts of the axoneme inside a cilium or flagellum — a specific structure, not the general cytoskeleton network.',
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A hair-like outgrowth of the cell membrane is small, beats like an oar, and moves the fluid around the cell rather than driving the cell forward on its own. What is this structure, and how many peripheral microtubule doublets does its axoneme contain?',
          options: [
            'A cilium, with nine peripheral doublets',
            'A flagellum, with nine peripheral doublets',
            'A cilium, with two peripheral doublets',
            'A flagellum, with eleven peripheral doublets',
          ],
          correct_index: 0,
          explanation: "Small, oar-like, and moving surrounding fluid is exactly how NCERT describes a cilium — flagella are comparatively longer and are responsible for cell movement instead. The doublet count doesn't change the answer here: both cilia and flagella share the same 9+2 axoneme, with nine peripheral doublets around a central pair, so 'two' or 'eleven' peripheral doublets are both wrong regardless of which structure is named.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
