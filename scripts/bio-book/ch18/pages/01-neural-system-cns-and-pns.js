'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'neural-system-cns-and-pns',
  title: 'The Neural System — CNS & PNS',
  subtitle: "Your body runs a wiring network built from one kind of cell. Learn how that wiring splits into a control centre and the cables that reach it — the exact split NEET tests every year.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['neural-control-and-coordination', 'nervous-system-organisation'],
  glossary: [
    { term: 'neuron', definition: 'The highly specialised cell that the neural system of all animals is built from. It can detect, receive and transmit different kinds of stimuli.' },
    { term: 'central neural system (CNS)', definition: 'The brain and the spinal cord together. It is the site of information processing and control.' },
    { term: 'peripheral neural system (PNS)', definition: 'All the nerves of the body associated with the CNS (the brain and spinal cord).' },
    { term: 'afferent fibres', definition: 'PNS nerve fibres that transmit impulses from tissues and organs TO the CNS.' },
    { term: 'efferent fibres', definition: 'PNS nerve fibres that transmit regulatory impulses FROM the CNS to the concerned peripheral tissues and organs.' },
    { term: 'somatic neural system', definition: 'The division of the PNS that relays impulses from the CNS to the skeletal muscles.' },
    { term: 'autonomic neural system', definition: 'The division of the PNS that transmits impulses from the CNS to the involuntary organs and smooth muscles of the body. It is split into the sympathetic and parasympathetic neural systems.' },
    { term: 'visceral nervous system', definition: 'The part of the PNS made of the whole complex of nerves, fibres, ganglia and plexuses by which impulses travel between the CNS and the viscera.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A faint glowing human figure seen from behind in the dark, with a soft luminous line running down the head and spine and thin threads branching out into the body',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The silhouette of a single human figure seen from behind, standing in near-darkness. A soft, warm luminous line glows gently down the centre of the head and along the spine, with faint delicate threads branching outward from it into the shoulders, arms and torso, suggesting a body-wide wiring network without becoming a literal labelled diagram. Deep shadows fill the rest of the frame. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram callouts, no faces.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Cell Type Runs the Whole Show',
      markdown: "Pull your hand off a hot pan before you even feel the pain. Read this line and understand it. Keep your heart beating while you sleep. Every one of these — the fast reflex, the thinking, the automatic housekeeping — runs on the same neural system, built from a single kind of specialised cell called the **neuron**. A jellyfish-like **Hydra** runs its whole body on a loose mesh of these cells. You run yours on billions of them, organised into a proper command network.",
    },
    // ── 2 · Core concept — neurons + organisation across animals ─────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The neural system of **all animals** is built from highly specialised cells called **neurons**. A neuron can do three things with a signal: it can **detect** a stimulus, **receive** it, and **transmit** it onward. That is the whole job — pick up different kinds of stimuli and pass them along.\n\nHow those neurons are arranged gets more organised as you move up the animal kingdom:\n\n- In **lower invertebrates** the arrangement is very simple. In **Hydra**, the neural system is just a **network of neurons** spread through the body — no brain, no central boss.\n- In **insects**, it is better organised: there is a **brain** together with a number of **ganglia** and neural tissues.\n- The **vertebrates** — including us — have a **more developed** neural system.",
    },
    // ── 3 · Heading — CNS & PNS ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Human Neural System Splits Into Two: CNS and PNS',
      objective: "By the end of this you can name the two parts of the human neural system, say exactly what each contains, and tell an afferent fibre from an efferent one by the direction it carries an impulse.",
    },
    // ── 4 · Text — CNS vs PNS + afferent/efferent ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **human neural system** is divided into two parts.\n\nThe first is the **central neural system (CNS)** — the **brain** and the **spinal cord**. Think of it as head office: it is the **site of information processing and control**. Decisions are made here.\n\nThe second is the **peripheral neural system (PNS)** — **all the nerves** of the body that connect to the CNS. These are the cables running out to every corner of you. The nerve fibres of the PNS come in **two types**, and the only thing that separates them is the **direction** a signal travels:\n\n- **Afferent fibres** carry impulses **from** the tissues and organs **to** the CNS. (Signals coming *in* to head office — \"here's what's happening out in the body.\")\n- **Efferent fibres** carry regulatory impulses **from** the CNS **to** the concerned peripheral tissues and organs. (Orders going *out* from head office — \"here's what to do about it.\")\n\nOne more slice of the PNS worth naming: the **visceral nervous system** is the part made of the whole complex of **nerves, fibres, ganglia and plexuses** that carry impulses **between the CNS and the viscera** — the internal organs — in both directions.",
    },
    // ── 5 · Interactive image — organisation chart ────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A flow chart of the human neural system branching from a single top box down through CNS and PNS to their sub-divisions',
      caption: '📸 Tap each dot to walk the branching chart from the whole neural system down to its smallest divisions.',
      generation_prompt: "Scientific textbook illustration of an organisation flow chart of the human neural system. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines and thin white connector lines linking labelled boxes in a top-down branching tree. Top box: 'Human Neural System'. It branches into two boxes below: 'Central Neural System (CNS): brain + spinal cord' on the left and 'Peripheral Neural System (PNS): all nerves connected to CNS' on the right. From the PNS box, two small labels branch: 'Afferent fibres (to CNS)' and 'Efferent fibres (from CNS)'. Below PNS, two more boxes: 'Somatic neural system' and 'Autonomic neural system'. From the autonomic box, two final boxes branch: 'Sympathetic' and 'Parasympathetic'. Labels in clean white text. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.10, label: 'Human neural system', detail: "The whole network, built from **neurons**. It divides into two parts — the CNS and the PNS.", icon: 'circle' },
        { id: uuid(), x: 0.28, y: 0.34, label: 'CNS', detail: "The **central neural system** — the **brain** and the **spinal cord**. This is the site of **information processing and control**.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.34, label: 'PNS', detail: "The **peripheral neural system** — **all the nerves** of the body associated with the CNS. Its fibres are either **afferent** (to the CNS) or **efferent** (from the CNS).", icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.62, label: 'Somatic neural system', detail: "A division of the PNS. It relays impulses from the CNS to the **skeletal muscles**.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.62, label: 'Autonomic neural system', detail: "A division of the PNS. It carries impulses from the CNS to the **involuntary organs and smooth muscles**.", icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.86, label: 'Sympathetic & parasympathetic', detail: "The autonomic neural system is further split into the **sympathetic** and **parasympathetic** neural systems.", icon: 'circle' },
      ],
    },
    // ── 6 · Comparison card — CNS vs PNS ──────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'CNS vs PNS',
      columns: [
        { heading: 'Central Neural System (CNS)', points: [
          'Made of the brain + the spinal cord',
          'The site of information processing and control — where decisions are made',
          'The central command, not the wiring that reaches the body',
        ] },
        { heading: 'Peripheral Neural System (PNS)', points: [
          'Made of all the nerves of the body associated with the CNS',
          'The cabling that connects the CNS to every tissue and organ',
          'Its fibres are afferent (carry impulses TO the CNS) or efferent (carry impulses FROM the CNS)',
        ] },
      ],
    },
    // ── 7 · Heading — somatic & autonomic ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Inside the PNS: Somatic and Autonomic Divisions',
      objective: "By the end of this you can split the PNS into its two divisions, say which one drives skeletal muscle and which one drives involuntary organs, and name the two halves the autonomic system splits into.",
    },
    // ── 8 · Text — somatic vs autonomic ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The PNS itself is divided into **two divisions**, sorted by *what they control*.\n\nThe **somatic neural system** relays impulses from the CNS to the **skeletal muscles** — the muscles you move on purpose. When you decide to lift your arm, that order rides the somatic system.\n\nThe **autonomic neural system** transmits impulses from the CNS to the **involuntary organs and smooth muscles** of the body — the things that run without you thinking about them, like the gut squeezing food along or a blood vessel narrowing. The autonomic system is then further classified into two more:\n\n- the **sympathetic neural system**, and\n- the **parasympathetic neural system**.",
    },
    // ── 9 · Comparison card — somatic vs autonomic ────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Somatic vs Autonomic',
      columns: [
        { heading: 'Somatic neural system', points: [
          'Relays impulses from the CNS to skeletal muscles',
          'Drives the muscles you move on purpose (voluntary)',
          'Not further sub-divided',
        ] },
        { heading: 'Autonomic neural system', points: [
          'Transmits impulses from the CNS to involuntary organs and smooth muscles',
          'Drives the things that run automatically (involuntary)',
          'Further split into the sympathetic and parasympathetic neural systems',
        ] },
      ],
    },
    // ── 10 · Reasoning prompt — afferent/efferent + division check ────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "You touch a warm cup, and the message 'this is warm' travels from your fingertip inward to your spinal cord. Which fibre type carried that message, and which part of the neural system does it belong to?",
      options: [
        "An afferent fibre of the PNS — afferent fibres carry impulses from tissues and organs to the CNS",
        "An efferent fibre of the PNS — efferent fibres carry impulses from tissues to the CNS",
        "A somatic fibre of the CNS — the CNS relays impulses from the skin to skeletal muscles",
        "An autonomic fibre of the PNS — the autonomic system carries all incoming sensory signals",
      ],
      reveal: "The answer is the first option. The message is travelling *from* a tissue (your fingertip) *to* the CNS — that is exactly the definition of an afferent fibre, and afferent fibres are part of the PNS. The second option gets the direction backwards: efferent fibres carry regulatory impulses the other way, *from* the CNS *out* to tissues and organs. The third option is wrong on two counts — the incoming fibre is part of the PNS, not the CNS, and the somatic system's job is relaying impulses to skeletal muscles, not carrying sensations inward. The fourth is wrong because the afferent/efferent split (direction of travel) is a separate thing from the somatic/autonomic split (what is being controlled); NCERT does not say the autonomic system carries incoming sensory signals.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Neuron** = the specialised cell the neural system is built from; it can **detect, receive and transmit** stimuli.\n- **CNS** = **brain + spinal cord** → the site of information processing and control.\n- **PNS** = all the nerves connected to the CNS. Its fibres are:\n  - **Afferent** → carry impulses **TO** the CNS (in from tissues/organs).\n  - **Efferent** → carry impulses **FROM** the CNS (out to tissues/organs).\n- **PNS has two divisions:**\n  - **Somatic** → CNS to **skeletal muscles** (voluntary).\n  - **Autonomic** → CNS to **involuntary organs and smooth muscles**, split into **sympathetic** and **parasympathetic**.\n- Direction (afferent/efferent) and control-type (somatic/autonomic) are two *different* ways of splitting the PNS — don't mix them up.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Afferent = arrives at the CNS; efferent = exits the CNS.** The single most common trap on this topic is flipping the two. Anchor it with the letters: **A**fferent → **A**rrives (in), **E**fferent → **E**xits (out).\n\n**Somatic → skeletal muscle; autonomic → involuntary organs & smooth muscle.** NEET loves swapping these targets — watch for 'somatic controls smooth muscle' as a wrong option.\n\n**Classic NEET question:** \"The autonomic neural system is divided into ___ and ___.\" → **sympathetic and parasympathetic**. And \"Afferent fibres carry impulses ___ the CNS.\" → **to / toward** the CNS.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You now have the map of the whole neural system — the CNS at the centre, the PNS reaching out, and the way both split further. Next, you'll zoom in on the single cell that carries every one of these signals: the **neuron** itself, and the parts that let it detect, receive and transmit.",
    },
    // ── 14 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "The neural system of all animals is composed of highly specialised cells that can do what to a stimulus?",
          options: [
            "Detect, receive and transmit different kinds of stimuli",
            "Store and permanently record every stimulus for later use",
            "Digest and break down stimuli into nutrients",
            "Multiply in number each time a stimulus arrives",
          ],
          correct_index: 0,
          explanation: "NCERT states the neural system is built from neurons, which detect, receive and transmit different kinds of stimuli — that is a neuron's three-part job. The other options describe things neurons do not do; storing, digesting, or multiplying on contact are not how NCERT defines a neuron's role.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which of the following correctly lists what the central neural system (CNS) includes?",
          options: [
            "The brain and all the nerves of the body",
            "The brain and the spinal cord",
            "The spinal cord and the skeletal muscles",
            "The ganglia and the smooth muscles",
          ],
          correct_index: 1,
          explanation: "The CNS includes the brain and the spinal cord, and it is the site of information processing and control. Option 1 wrongly folds in the body's nerves, which are the PNS. Options 3 and 4 pull in muscles, which are targets the neural system controls, not parts of the CNS.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A regulatory impulse travels from the CNS out to a gland telling it to act. Which fibre type is this, and in which system?",
          options: [
            "An afferent fibre, because afferent fibres carry impulses away from the CNS",
            "A somatic fibre, because the somatic system controls all glands and organs",
            "An efferent fibre of the PNS, because efferent fibres carry regulatory impulses from the CNS to peripheral tissues and organs",
            "A visceral fibre of the CNS, because the CNS directly forms the visceral system",
          ],
          correct_index: 2,
          explanation: "Efferent fibres carry regulatory impulses from the CNS to the concerned peripheral tissues and organs — exactly what is happening here — and they belong to the PNS. Option 1 reverses the direction (afferent fibres go TO the CNS). Option 2 misassigns it: glands and involuntary organs are handled by the autonomic system, not the somatic. Option 4 is wrong because the visceral nervous system is part of the PNS, not the CNS.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The peripheral neural system is divided into a somatic and an autonomic division. Which statement about these two is correct?",
          options: [
            "The somatic system carries impulses to involuntary organs, and the autonomic system carries them to skeletal muscles",
            "The somatic system relays impulses to skeletal muscles, and the autonomic system carries them to involuntary organs and smooth muscles",
            "Both divisions carry impulses only to skeletal muscles, differing just in speed",
            "The autonomic system is a single unit, while the somatic system splits into sympathetic and parasympathetic",
          ],
          correct_index: 1,
          explanation: "The somatic neural system relays impulses from the CNS to skeletal muscles, while the autonomic neural system carries them to involuntary organs and smooth muscles — option 2 has both targets right. Option 1 swaps the two targets. Option 3 wrongly restricts both to skeletal muscle. Option 4 flips which one sub-divides: it is the autonomic system that splits into sympathetic and parasympathetic, not the somatic.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
