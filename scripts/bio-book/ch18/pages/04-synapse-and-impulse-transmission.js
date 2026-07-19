'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'synapse-and-impulse-transmission',
  title: 'The Synapse — Passing the Message On',
  subtitle: "One neuron finishes carrying the impulse — but it isn't the finish line. The message still has to jump the gap to the next neuron. Here's exactly how that hand-off happens, and the two very different ways it can be done.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['neural-control-and-coordination', 'synapse'],
  glossary: [
    { term: 'synapse', definition: 'The junction through which a nerve impulse is transmitted from one neuron to the next. It is formed by the membranes of a pre-synaptic neuron and a post-synaptic neuron, which may or may not be separated by a gap.' },
    { term: 'pre-synaptic neuron', definition: 'The neuron that carries the impulse up to the synapse and hands it on — the sending side of the junction.' },
    { term: 'post-synaptic neuron', definition: 'The neuron on the receiving side of the synapse, in which a new potential is generated after it receives the message.' },
    { term: 'synaptic cleft', definition: 'The fluid-filled gap that separates the pre- and post-synaptic membranes at a chemical synapse.' },
    { term: 'electrical synapse', definition: 'A synapse where the pre- and post-synaptic membranes are in very close proximity and electrical current flows directly from one neuron into the other. Faster than a chemical synapse, but rare in our system.' },
    { term: 'chemical synapse', definition: 'A synapse where the two membranes are separated by a synaptic cleft, and the impulse is carried across by chemicals called neurotransmitters.' },
    { term: 'neurotransmitters', definition: 'Chemicals stored in vesicles at the axon terminal that are released into the synaptic cleft to carry the impulse across a chemical synapse.' },
    { term: 'new potential', definition: 'The electrical potential generated in the post-synaptic neuron when neurotransmitters bind their receptors and open ion channels. It may be either excitatory or inhibitory.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Two neurons almost touching in the dark, with a faint glow suspended in the narrow gap between the end of one and the start of the next',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The swollen end of one nerve fibre reaches from the left toward the branching start of a second nerve fibre on the right, the two coming close but never quite touching. In the narrow dark space between them, a faint scattering of tiny softly glowing specks drifts across, suggesting a message being handed from one to the other, without becoming a literal labelled diagram. Deep shadows fill the rest of the frame, with subtle cool highlights along the smooth membranes. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Neurons Don’t Actually Touch',
      markdown: "You would expect one nerve cell to be wired straight into the next, like two pieces of copper wire twisted together. It isn't. At most junctions the two neurons don't touch at all — there's a real gap between them. So the impulse that just raced down one neuron reaches the end and hits open space. The whole trick of the nervous system is how it gets the message *across* that gap to the next cell. That junction is called a **synapse**.",
    },
    // ── 2 · Core concept — what a synapse is ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A nerve impulse is transmitted from one neuron to another through junctions called **synapses**. A synapse is formed by the **membranes of two neurons**: the **pre-synaptic neuron** (the one sending the message on) and the **post-synaptic neuron** (the one receiving it).\n\nHere's the part students skip: those two membranes **may or may not be separated by a gap** called the **synaptic cleft**. That single 'may or may not' is the whole story of this page — because it's exactly what splits synapses into two types. If the two membranes are pressed almost together with no real gap, you get one kind of synapse. If there's a fluid-filled gap between them, you get the other kind.",
    },
    // ── 3 · Heading — the two types ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Two Ways to Cross: Electrical vs Chemical Synapses',
      objective: "By the end of this you can say how current crosses an electrical synapse, why it's faster, why it's rare, and how a chemical synapse does the same job a slower way.",
    },
    // ── 4 · Text — electrical synapse ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "There are two types of synapses: **electrical synapses** and **chemical synapses**.\n\nAt an **electrical synapse**, the membranes of the pre- and post-synaptic neurons sit in **very close proximity** — practically touching. Because they're that close, **electrical current can flow directly** from one neuron into the other, straight across the junction. There's no separate messenger and no gap to cross. In fact, transmission across an electrical synapse is **very similar to impulse conduction along a single axon** — it's as if the two neurons behave like one continuous wire.\n\nTwo facts NEET wants from this: transmission across an electrical synapse is **always faster** than across a chemical synapse, and electrical synapses are **rare** in our system.",
    },
    // ── 5 · Comparison card — electrical vs chemical ──────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Electrical vs Chemical Synapse',
      columns: [
        {
          heading: 'Electrical synapse',
          points: [
            'Membranes are in very close proximity (almost touching)',
            'Electrical current flows directly from one neuron into the other',
            'Transmission is similar to impulse conduction along a single axon',
            'Always faster than a chemical synapse',
            'Rare in our system',
          ],
        },
        {
          heading: 'Chemical synapse',
          points: [
            'Membranes are separated by a fluid-filled synaptic cleft',
            'A chemical messenger — a neurotransmitter — carries the impulse across',
            'Neurotransmitter binds specific receptors on the post-synaptic membrane',
            'Slower than an electrical synapse',
            'The common type in our system',
          ],
        },
      ],
    },
    // ── 6 · Heading — how a chemical synapse works ────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'How a Chemical Synapse Actually Works',
      objective: "By the end of this you can walk through the chemical synapse step by step: impulse arrives → vesicles fuse → neurotransmitter released → binds receptor → ion channels open → new potential.",
    },
    // ── 7 · Text — the chemical transmission steps ────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "At a **chemical synapse**, the membranes of the pre- and post-synaptic neurons are separated by a fluid-filled space — the **synaptic cleft**. Since the impulse can't simply jump this gap on its own, the neuron uses a chemical courier. Chemicals called **neurotransmitters** carry the impulse across.\n\nWalk through it in order:\n\n1. The **axon terminal** of the pre-synaptic neuron holds **vesicles filled with neurotransmitters** — tiny sacs kept ready.\n2. When an **impulse (action potential)** arrives at the axon terminal, it makes the **synaptic vesicles move towards the membrane**, where they **fuse with it** and **release their neurotransmitters into the synaptic cleft**.\n3. The released neurotransmitters cross the cleft and **bind to their specific receptors** present on the **post-synaptic membrane**.\n4. This binding **opens ion channels**, allowing the **entry of ions** into the post-synaptic neuron.\n5. Those incoming ions **generate a new potential** in the post-synaptic neuron.\n\nAnd here's the catch worth remembering: the new potential that develops **may be either excitatory or inhibitory**. So a synapse doesn't only pass a message on — it can also tell the next neuron to *quiet down*.",
    },
    // ── 8 · Interactive image — chemical synapse (Figure 18.3 style) ──────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Diagram of a chemical synapse: the pre-synaptic axon terminal with neurotransmitter-filled vesicles above, the synaptic cleft in the middle, and the post-synaptic membrane with receptors and ion channels below',
      caption: '📸 Tap each dot to explore how the message crosses a chemical synapse, step by step.',
      generation_prompt: "Scientific textbook illustration of a chemical synapse (axon terminal and synapse). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Show the swollen pre-synaptic axon terminal at the top containing several round synaptic vesicles filled with small dots (neurotransmitters); one vesicle shown fusing with the lower membrane of the terminal and releasing its dots into the gap. Below it a clear fluid-filled synaptic cleft as a horizontal gap. Below the cleft, the post-synaptic membrane drawn as a band bearing receptor shapes that the released dots bind to, with ion channels shown as pores letting small ions cross into the post-synaptic neuron. Use pink/magenta for the neuron membranes (animal soft tissue), pale dots for neurotransmitters, blue tint for ions. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.18, label: 'Pre-synaptic axon terminal', detail: 'The end of the sending (pre-synaptic) neuron. This is where the arriving impulse triggers everything that follows.', icon: 'circle' },
        { id: uuid(), x: 0.60, y: 0.25, label: 'Synaptic vesicles', detail: 'Tiny sacs inside the axon terminal, each **filled with neurotransmitters** and kept ready for the impulse to arrive.', icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.44, label: 'Vesicles fuse & release', detail: 'When the impulse arrives, the synaptic vesicles **move to the membrane, fuse with it, and release neurotransmitters** into the cleft.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.55, label: 'Synaptic cleft', detail: 'The fluid-filled gap between the two neurons. Neurotransmitters cross this space to carry the impulse over.', icon: 'circle' },
        { id: uuid(), x: 0.36, y: 0.72, label: 'Receptors on post-synaptic membrane', detail: 'The released neurotransmitters bind to their **specific receptors** on the post-synaptic membrane — a lock-and-key match.', icon: 'circle' },
        { id: uuid(), x: 0.64, y: 0.74, label: 'Ion channels open', detail: 'Binding **opens ion channels**, letting ions enter and **generate a new potential** in the post-synaptic neuron — which may be excitatory or inhibitory.', icon: 'circle' },
      ],
    },
    // ── 9 · Reasoning prompt — which synapse / step check ─────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student is comparing the two synapse types and makes four claims. Exactly one of them is wrong. Which claim does NOT match what NCERT says?",
      options: [
        "Impulse transmission across an electrical synapse is always faster than across a chemical synapse.",
        "At an electrical synapse, electrical current flows directly from one neuron into the other.",
        "At a chemical synapse, a neurotransmitter carries the impulse across the synaptic cleft.",
        "Chemical synapses are rare in our system, while electrical synapses are the common type.",
      ],
      reveal: "Claim 4 is the wrong one — it swaps the two around. NCERT says **electrical synapses are rare** in our system; chemical synapses are the ordinary, common type. The other three are exactly right: electrical transmission is always faster (the membranes are practically touching, so current flows directly across, just like conduction along a single axon), and at a chemical synapse a neurotransmitter is the messenger that crosses the fluid-filled synaptic cleft. Mixing up which type is 'rare' is the single easiest mark to lose here.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- A **synapse** = a junction formed by the membranes of a **pre-synaptic neuron** and a **post-synaptic neuron**, which **may or may not** be separated by a gap called the **synaptic cleft**.\n- **Electrical synapse** → membranes very close, current flows **directly**, like conduction along a single axon, **faster**, and **rare** in our system.\n- **Chemical synapse** → membranes separated by a **synaptic cleft**; a **neurotransmitter** carries the impulse across; the common type.\n- **Chemical transmission, in order:** impulse reaches axon terminal → synaptic vesicles **move to the membrane, fuse, and release neurotransmitters** into the cleft → neurotransmitters **bind specific receptors** on the post-synaptic membrane → this **opens ion channels** → ions enter → a **new potential** is generated.\n- That new potential may be **excitatory OR inhibitory** — don't assume it's always 'go'.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Faster ≠ common:** NEET loves to test that the **electrical synapse is faster** but **rare**, while the **chemical synapse is slower** but common. Keep 'faster' and 'common' as separate facts — they don't sit on the same synapse.\n\n**Know the exact endpoint:** neurotransmitters binding their receptors open **ion channels**, and the new potential can be **excitatory or inhibitory** — a favourite last-word trap.\n\n**Classic NEET question:** \"Transmission of a nerve impulse across a chemical synapse is mediated by ______.\" → **neurotransmitters.** And its partner: \"Which synapse conducts faster?\" → the **electrical synapse.**",
    },
    // ── 12 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You've now followed the impulse from inside one neuron, across the synapse, and into the next — the complete hand-off. Next, we zoom out from single junctions to the organ that receives, sorts, and commands all of this traffic: the human brain.",
    },
    // ── 13 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "A synapse is formed by the membranes of which two structures?",
          options: [
            "A pre-synaptic neuron and a post-synaptic neuron",
            "An axon and a dendrite of the very same neuron",
            "A neuron and the muscle fibre it controls",
            "Two axon terminals of a single pre-synaptic neuron",
          ],
          correct_index: 0,
          explanation: "NCERT is exact: a synapse is formed by the membranes of a pre-synaptic neuron and a post-synaptic neuron, which may or may not be separated by a synaptic cleft. It's a junction between two neurons — not two parts of one neuron, and not defined here in terms of muscle.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which statement correctly describes an electrical synapse?",
          options: [
            "A neurotransmitter is released into a synaptic cleft to carry the impulse across",
            "The membranes are in very close proximity and electrical current flows directly across; it is faster than a chemical synapse and rare in our system",
            "The membranes are separated by a wide fluid-filled cleft, making it the common synapse type",
            "Ion channels open only after receptors on the post-synaptic membrane are bound by chemicals",
          ],
          correct_index: 1,
          explanation: "At an electrical synapse the pre- and post-synaptic membranes are in very close proximity, current flows directly from one neuron into the other, transmission is faster than a chemical synapse, and it is rare in our system. Options 1 and 4 describe the chemical synapse (neurotransmitter, receptor binding, ion channels), and option 3 wrongly calls the electrical type common — NCERT says it's rare.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "At a chemical synapse, what happens immediately after an impulse (action potential) arrives at the axon terminal?",
          options: [
            "Ion channels on the axon terminal close to stop the impulse",
            "Electrical current flows directly into the post-synaptic neuron",
            "Synaptic vesicles move to the membrane, fuse with it, and release neurotransmitters into the synaptic cleft",
            "Receptors on the post-synaptic membrane release neurotransmitters back across the cleft",
          ],
          correct_index: 2,
          explanation: "The arriving impulse stimulates the synaptic vesicles to move towards the membrane, fuse with it, and release their neurotransmitters into the synaptic cleft — that's the trigger step. Direct current flow (option 2) is the electrical synapse, not the chemical one. Receptors on the post-synaptic side receive neurotransmitters; they don't release them back (option 4).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "When the released neurotransmitters bind their specific receptors on the post-synaptic membrane, what is the final result NCERT describes?",
          options: [
            "Ion channels open, ions enter, and a new potential — either excitatory or inhibitory — is generated in the post-synaptic neuron",
            "The synaptic cleft disappears so the two neurons become one continuous axon",
            "A new potential is generated that is always excitatory, never inhibitory",
            "Neurotransmitters are converted directly into an electrical current inside the cleft",
          ],
          correct_index: 0,
          explanation: "Binding opens ion channels, ions enter, and this generates a new potential in the post-synaptic neuron. NCERT specifically adds that this new potential may be either excitatory or inhibitory — which is why option 3 ('always excitatory') is the trap. The cleft doesn't vanish (that's not a chemical synapse), and the neurotransmitter isn't turned into current in the cleft.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
