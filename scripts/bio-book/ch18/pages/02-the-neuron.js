'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-neuron',
  title: 'The Neuron — the Functional Unit',
  subtitle: "One microscopic cell carries every message in your body. Learn its three parts, the one-way traffic rule that governs it, and the three-vs-two classifications NEET loves to swap around.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['neural-control-and-coordination', 'neuron'],
  glossary: [
    { term: 'neuron', definition: 'A microscopic cell that is the structural and functional unit of the neural system, composed of three major parts — cell body, dendrites and axon.' },
    { term: "Nissl's granules", definition: 'Granular bodies found in the cytoplasm of the cell body (and in the dendrites) of a neuron.' },
    { term: 'dendrites', definition: 'Short fibres that branch repeatedly and project out of the cell body; they contain Nissl’s granules and transmit impulses towards the cell body.' },
    { term: 'axon', definition: 'A long fibre whose distal end is branched; it transmits nerve impulses away from the cell body to a synapse or a neuro-muscular junction.' },
    { term: 'synaptic knob', definition: 'The bulb-like structure at the end of each axon branch; it holds synaptic vesicles containing chemicals called neurotransmitters.' },
    { term: 'neurotransmitters', definition: 'Chemicals stored in the synaptic vesicles inside the synaptic knob of an axon.' },
    { term: 'myelin sheath', definition: 'A covering formed around an axon by Schwann cells in myelinated nerve fibres.' },
    { term: 'nodes of Ranvier', definition: 'The gaps between two adjacent myelin sheaths along a myelinated axon.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing nerve cell stretched across a dark field, its branching fibres reaching outward like the roots and branches of a tree',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single neuron stretched across the frame in a dark, atmospheric field — a rounded central body on the left with many fine fibres branching out of it, and one long slender fibre reaching far to the right, ending in a spray of tiny bulb-tipped branches. Soft, warm, translucent glow along the cell, like a living wire lit from within, fading into deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Longest Cell in Your Body',
      markdown: "The **axon** of a single neuron can be a remarkably long fibre — one thin thread of one cell, carrying a message across a distance far larger than the cell body it grew out of. When you pull your hand off a hot pan before you even feel the pain, that whole reaction rode along fibres like this. And a neuron is just **one microscopic cell** — the unit this entire chapter is built on.",
    },
    // ── 2 · Core concept — three parts ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A **neuron** is a microscopic structure made of **three major parts**: the **cell body**, the **dendrites**, and the **axon**. Hold that number — *three* — because almost every question about neuron structure is really testing whether you know which part is which.\n\nThink of the neuron as having a shape like a tree. The **cell body** is the trunk base where everything is controlled. The **dendrites** are the many short branches spreading out from it, catching incoming signals. The **axon** is the single long root running away to deliver the message somewhere else. Signals come *in* through the dendrites and go *out* through the axon — one-way traffic, and that direction is the whole key to this page.",
    },
    // ── 3 · Heading — the three parts up close ───────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Cell Body, Dendrites and Axon — Up Close',
      objective: "By the end of this you can point to each of the three parts of a neuron, say which way it carries impulses, and name what sits at the very tip of the axon.",
    },
    // ── 4 · Text — cell body + dendrites + axon detail ──────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **cell body** contains **cytoplasm** with the usual cell organelles, plus certain granular bodies called **Nissl's granules**. That name is worth locking in now — Nissl's granules are a classic one-word answer.\n\nOut of the cell body project short fibres that **branch repeatedly**. These are the **dendrites**, and they *also* contain Nissl's granules. Their job is direction-specific: **dendrites transmit impulses towards the cell body**. Signals travel inward, from the outside world back to the body of the cell.\n\nThe **axon** is a single **long fibre**, and its far (distal) end is **branched**. Each of those branches ends in a bulb-like structure called a **synaptic knob**. Inside every synaptic knob are **synaptic vesicles** holding chemicals called **neurotransmitters** — the messengers passed on at the far end. And the axon's direction is the exact opposite of the dendrite's: **axons transmit nerve impulses away from the cell body**, carrying them onward to a **synapse** or to a **neuro-muscular junction**.",
    },
    // ── 5 · Interactive image — neuron diagram ───────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Labelled diagram of a single neuron showing the cell body with Nissl’s granules, branching dendrites, a long axon covered by a myelin sheath with Schwann cells and nodes of Ranvier, and synaptic knobs at the branched distal end',
      caption: '📸 Tap each dot to explore the parts of a neuron — Figure 18.1.',
      generation_prompt: "Scientific textbook illustration of a single neuron (Figure 18.1 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. On the left, a rounded cell body (soma) shown in soft pink/magenta with small stippled dots inside representing Nissl's granules; several short, repeatedly branching dendrite fibres project outward from the cell body. From the cell body extends one long horizontal axon running to the right. The axon is wrapped along its length by segmented myelin sheath sections in pale tan, with small Schwann cell nuclei on the sheath and clear gaps (nodes of Ranvier) between adjacent sheath segments. The far (distal) end of the axon splits into a few branches, each terminating in a small bulb-like synaptic knob. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.50, label: 'Cell body', detail: "Contains cytoplasm with the usual cell organelles plus granular bodies called **Nissl's granules**. This is the control centre the other two parts grow out of.", icon: 'circle' },
        { id: uuid(), x: 0.10, y: 0.24, label: "Nissl's granules", detail: 'Granular bodies inside the cytoplasm of the cell body. They are also present in the dendrites.', icon: 'circle' },
        { id: uuid(), x: 0.06, y: 0.72, label: 'Dendrites', detail: 'Short fibres that branch repeatedly and project out of the cell body. They also contain Nissl’s granules and **transmit impulses towards the cell body**.', icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.50, label: 'Axon', detail: 'A long fibre whose distal end is branched. It **transmits nerve impulses away from the cell body** to a synapse or a neuro-muscular junction.', icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.36, label: 'Myelin sheath', detail: 'The covering formed around the axon by Schwann cells in a myelinated nerve fibre.', icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.64, label: 'Schwann cell', detail: 'The cell that envelops a myelinated axon and forms the myelin sheath around it.', icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.36, label: 'Node of Ranvier', detail: 'A gap between two adjacent myelin sheaths along the axon.', icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.58, label: 'Synaptic knob', detail: 'The bulb-like structure at the end of each axon branch. It holds **synaptic vesicles** containing chemicals called **neurotransmitters**.', icon: 'circle' },
      ],
    },
    // ── 6 · Comparison card — dendrite vs axon ───────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Dendrite vs Axon',
      columns: [
        { heading: 'Dendrite', points: [
          'Short fibre that branches repeatedly out of the cell body',
          'Contains Nissl’s granules',
          'Carries the impulse **towards** the cell body (signal comes in)',
        ] },
        { heading: 'Axon', points: [
          'Single long fibre with a branched distal end',
          'Each branch ends in a synaptic knob holding neurotransmitter vesicles',
          'Carries the impulse **away from** the cell body (signal goes out) to a synapse or neuro-muscular junction',
        ] },
      ],
    },
    // ── 7 · Heading — classifying neurons and axons ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Two Ways to Sort Neurons',
      objective: "By the end of this you can group neurons three ways by their fibres and match each to where it's found, and split axons into the two myelin types.",
    },
    // ── 8 · Text — neuron types + axon types ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The first sorting is by the **number of axons and dendrites** a neuron has. This gives **three types**:\n\n- **Multipolar** — one axon and **two or more** dendrites; found in the **cerebral cortex**.\n- **Bipolar** — one axon and **one** dendrite; found in the **retina of the eye**.\n- **Unipolar** — a cell body with **one axon only**; usually found in the **embryonic stage**.\n\nThe second sorting is about the **axon** itself, and it splits axons into **two types** — **myelinated** and **non-myelinated**. In a **myelinated** nerve fibre, the axon is enveloped by **Schwann cells**, which form a **myelin sheath** around it. The gaps between two adjacent myelin sheaths are the **nodes of Ranvier**. These myelinated fibres are found in the **spinal and cranial nerves**. A **non-myelinated** (unmyelinated) fibre is still enclosed by a Schwann cell, but that Schwann cell **does not form a myelin sheath** around the axon — so there is no sheath and no nodes of Ranvier. Unmyelinated fibres are commonly found in the **autonomous and somatic neural systems**.",
    },
    // ── 9 · Table — neuron types ─────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 9,
      caption: 'The three neuron types, by number of axons and dendrites, and where each is found',
      headers: ['Type', 'Axons & dendrites', 'Where found'],
      rows: [
        ['Multipolar', 'One axon + two or more dendrites', 'Cerebral cortex'],
        ['Bipolar', 'One axon + one dendrite', 'Retina of the eye'],
        ['Unipolar', 'Cell body with one axon only', 'Usually the embryonic stage'],
      ],
    },
    // ── 10 · Comparison card — myelinated vs non-myelinated axon ──────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Myelinated vs Non-myelinated Axon',
      columns: [
        { heading: 'Myelinated fibre', points: [
          'Axon enveloped by Schwann cells that **form a myelin sheath** around it',
          'Gaps between adjacent sheaths = nodes of Ranvier',
          'Found in the spinal and cranial nerves',
        ] },
        { heading: 'Non-myelinated fibre', points: [
          'Enclosed by a Schwann cell that **does not form a myelin sheath**',
          'No myelin sheath, so no nodes of Ranvier',
          'Found in the autonomous and somatic neural systems',
        ] },
      ],
    },
    // ── 11 · Reasoning prompt — direction / where-found check ─────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A biology teacher writes four statements about neurons on the board and asks the class to find the one that is completely correct. Which statement is right?",
      options: [
        "Dendrites carry impulses away from the cell body, and the axon carries them towards it.",
        "Bipolar neurons have one axon and one dendrite and are found in the retina of the eye.",
        "Multipolar neurons have one axon and one dendrite and are found in the embryonic stage.",
        "In a myelinated fibre the Schwann cell encloses the axon but does not form any myelin sheath.",
      ],
      reveal: "Statement 2 is correct: a bipolar neuron has one axon and one dendrite and is found in the retina of the eye. Statement 1 reverses the traffic — dendrites carry impulses *towards* the cell body and the axon carries them *away* from it. Statement 3 mixes up two types: 'one axon and one dendrite' is bipolar (not multipolar, which has two or more dendrites), and the embryonic stage is where *unipolar* neurons are found. Statement 4 describes a *non-myelinated* fibre — it's the myelinated fibre in which the Schwann cell *does* form a myelin sheath.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Three parts of a neuron:** cell body, dendrites, axon. The **cell body** cytoplasm holds **Nissl's granules** (dendrites contain them too).\n- **Direction rule:** **dendrites** carry impulses **towards** the cell body; **axons** carry them **away** from the cell body. At the axon's branched tip sits the **synaptic knob**, packed with **synaptic vesicles** of **neurotransmitters**.\n- **Three neuron types (by fibre number):** **multipolar** → cerebral cortex, **bipolar** → retina of the eye, **unipolar** → embryonic stage.\n- **Two axon types:** **myelinated** = Schwann cells form a **myelin sheath**, gaps between sheaths = **nodes of Ranvier**, found in spinal and cranial nerves. **Non-myelinated** = Schwann cell but no sheath, found in autonomous and somatic neural systems.",
    },
    // ── 13 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Direction is the favourite trap:** dendrite = *towards* the cell body, axon = *away* from it. NEET routinely swaps these two words and hopes you skim past it.\n\n**Match the type to its place, exactly:** multipolar → cerebral cortex, bipolar → retina of the eye, unipolar → embryonic stage. Reshuffling these three pairings is one of the most common one-mark questions from this line of NCERT.\n\n**Classic NEET question:** \"The gaps between two adjacent myelin sheaths are called ___\" → **nodes of Ranvier**. A close cousin: \"Bipolar neurons are found in the ___\" → **retina of the eye**.",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now know the neuron part by part, which way each part carries a signal, and how neurons and their axons are classified. Next, you'll see *how* that signal actually travels down the axon — the nerve impulse itself.",
    },
    // ── 15 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "What are the three major parts of a neuron?",
          options: [
            "Cell body, dendrites and axon",
            "Cell body, myelin sheath and nodes of Ranvier",
            "Dendrites, synaptic knob and neurotransmitters",
            "Cell body, Schwann cells and synaptic vesicles",
          ],
          correct_index: 0,
          explanation: "NCERT states a neuron is composed of three major parts: the cell body, the dendrites and the axon. The other options list real neuron structures, but they are sub-parts or features (myelin sheath, nodes of Ranvier, synaptic knob, Schwann cells, vesicles) — not the three top-level parts.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which statement about the direction a neuron carries impulses is correct?",
          options: [
            "Dendrites carry impulses towards the cell body; axons carry them away from the cell body",
            "Dendrites carry impulses away from the cell body; axons carry them towards the cell body",
            "Both dendrites and axons carry impulses towards the cell body",
            "Both dendrites and axons carry impulses away from the cell body",
          ],
          correct_index: 0,
          explanation: "Dendrites transmit impulses towards the cell body, and axons transmit nerve impulses away from the cell body to a synapse or neuro-muscular junction. Option 2 reverses the two — the single most common way this fact is tested wrong. Options 3 and 4 wrongly make both fibres run the same way.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A neuron has one axon and one dendrite. Which type is it, and where is it found?",
          options: [
            "Multipolar, found in the cerebral cortex",
            "Unipolar, found in the embryonic stage",
            "Bipolar, found in the retina of the eye",
            "Multipolar, found in the retina of the eye",
          ],
          correct_index: 2,
          explanation: "One axon and one dendrite defines a bipolar neuron, found in the retina of the eye. Multipolar neurons have two or more dendrites (cerebral cortex), and unipolar neurons have one axon only (embryonic stage). Option 4 pairs the wrong type with the retina.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In a myelinated nerve fibre, what are the gaps between two adjacent myelin sheaths called, and where are such fibres found?",
          options: [
            "Synaptic knobs, found in the autonomous and somatic neural systems",
            "Nissl's granules, found in the retina of the eye",
            "Nodes of Ranvier, found in the spinal and cranial nerves",
            "Nodes of Ranvier, found in the autonomous and somatic neural systems",
          ],
          correct_index: 2,
          explanation: "The gaps between two adjacent myelin sheaths are the nodes of Ranvier, and myelinated nerve fibres are found in the spinal and cranial nerves. Option 4 names the gaps correctly but places them in the autonomous and somatic systems — that's where the non-myelinated fibres (with no sheath and no nodes) are found. Synaptic knobs and Nissl's granules are unrelated structures.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
