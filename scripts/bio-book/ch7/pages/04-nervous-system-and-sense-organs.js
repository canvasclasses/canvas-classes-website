'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'nervous-system-and-sense-organs',
  title: "The Frog's Nervous System and Sense Organs",
  subtitle: "Every organ you've traced so far needs a manager. Here's the pair of systems that run the frog moment to moment — and why a frog's eye only ever has one visual unit.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['structural-organisation-in-animals', 'frog', 'nervous-system', 'sense-organs'],
  glossary: [
    { term: 'cranium', definition: "The bony structure (brain box) that encloses and protects a frog's brain." },
    { term: 'foramen magnum', definition: 'The opening at the base of the cranium through which the medulla oblongata passes out of the skull to continue as the spinal cord.' },
    { term: 'autonomic nervous system', definition: 'The sympathetic and parasympathetic networks that run involuntary body functions, layered on top of the central and peripheral nervous systems.' },
    { term: 'optic lobes', definition: 'A paired structure that characterises the midbrain.' },
    { term: 'diencephalon', definition: 'The unpaired third part of the forebrain, sitting behind the paired cerebral hemispheres.' },
    { term: 'sensory papillae', definition: "Small cellular clusters around nerve endings that give a frog its sense of touch." },
    { term: 'simple eye', definition: "An eye built from only one visual unit — the term NCERT uses for a frog's eyes." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: "A frog frozen mid-alert at dusk, eyes bulging and turned toward an unseen sound, its whole posture reading as pure reaction",
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single olive-green frog crouched on a wet rock at the edge of still water at dusk, frozen mid-alert, its large round eyes bulging and turned toward something unseen off to one side, body tensed and ready to leap. Faint ripples on the water surface beside it hint at a recent disturbance. Soft warm dusk light catching the moisture on its skin. Out-of-focus reeds and a dim horizon glow in the background. Deep dusk lighting, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Structure, Two Jobs',
      markdown: "A frog has no visible outer ear at all — no flap, no opening, nothing sticking out from the side of its head. Just a flat, round patch of skin called the **tympanum**. And that one unassuming patch is doing double duty: it's not only how the frog hears, it's also how the frog keeps its **balance**.",
    },
    // ── 2 · Core concept — why coordination exists at all ────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You've followed food down the frog's gut, watched air move through its lungs and skin, traced blood through its three-chambered heart, and sent waste out through its kidneys. None of that timing happens by accident — something has to decide when the heart should beat faster, when the lungs need more air, when the frog should stay perfectly still. That job belongs to two systems working together: a **neural system** that reacts in an instant, and a set of **endocrine glands** that manage things more slowly, through chemicals released straight into the blood.",
    },
    // ── 3-4 · Endocrine System ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Endocrine System — Coordination by Chemical Messenger',
      objective: 'By the end of this you can list every prominent endocrine gland NCERT names in the frog, without missing one.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Chemical coordination** is how one organ influences another without a single nerve being involved — it works through **hormones**, chemical messengers secreted directly by **endocrine glands**. NCERT names eight prominent endocrine glands in the frog: the **pituitary**, **thyroid**, **parathyroid**, **thymus**, **pineal body**, **pancreatic islets**, **adrenals**, and the **gonads**.\n\nNotice two of these are organs you already know from other jobs — the pancreatic islets sit inside the pancreas, and the gonads are the same testes or ovaries you'll meet again when you get to reproduction. Many organs in the frog pull double duty like this: one job moving substances around, a second job releasing hormones on the side.",
    },
    // ── 5-6 · Nervous System overview ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: "The Nervous System — Three Networks, One Command Centre",
      objective: "By the end of this you can name all three networks in the frog's nervous system, and place any brain structure into forebrain, midbrain, or hindbrain without hesitating.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The neural side of coordination is organised into three networks. The **central nervous system (CNS)** is the brain and spinal cord — the command centre itself. The **peripheral nervous system (PNS)** is the wiring connecting that command centre to the rest of the body: **ten pairs of cranial nerves** arising directly from the brain, plus the spinal nerves running out from the spinal cord. Layered on top of both is the **autonomic nervous system (ANS)** — the **sympathetic** and **parasympathetic** networks that run automatic, involuntary functions like heart rate, without the frog ever having to think about them.\n\nThe brain itself sits protected inside a bony case called the **cranium**, or brain box. Cut it open and you find three regions, arranged front to back: a **forebrain**, a **midbrain**, and a **hindbrain** — each built from different working parts, each doing a different job. That's what the diagram below breaks apart, piece by piece.",
    },
    // ── 7 · Interactive brain diagram ─────────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: "A lateral view of a frog's brain showing the forebrain, midbrain, and hindbrain and their parts",
      caption: '📸 Tap each region of the brain to see what it does',
      generation_prompt: "Scientific textbook illustration of a frog brain, lateral (side) view, dissected out and shown in isolation. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. From front to back: a small rounded pair of olfactory lobes at the front tip, a larger paired bulge for the cerebral hemispheres just behind it, a small unpaired diencephalon nestled behind the hemispheres, a raised pair of optic lobes forming a distinct bulge marking the midbrain, a compact cerebellum sitting just behind the optic lobes, and an elongated medulla oblongata narrowing toward the rear before continuing into a thin spinal cord trailing off the edge of the frame. Each structure rendered with a subtle tonal shift in soft grey-white shading so its boundaries are visible without any text. No text or labels baked into the image itself — labels are added separately as interactive hotspots. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.10, y: 0.50, label: 'Olfactory lobes', icon: 'circle',
          detail: "The frontmost part of the **forebrain** — handle the frog's sense of smell." },
        { id: uuid(), x: 0.26, y: 0.40, label: 'Paired cerebral hemispheres', icon: 'circle',
          detail: 'A **paired** structure sitting just behind the olfactory lobes — part of the **forebrain**.' },
        { id: uuid(), x: 0.40, y: 0.55, label: 'Diencephalon', icon: 'circle',
          detail: 'The **unpaired** third part of the forebrain, tucked behind the cerebral hemispheres.' },
        { id: uuid(), x: 0.55, y: 0.32, label: 'Optic lobes', icon: 'circle',
          detail: 'A pair of **optic lobes** is exactly what characterises the **midbrain** — NCERT names this as the defining feature of the region.' },
        { id: uuid(), x: 0.71, y: 0.40, label: 'Cerebellum', icon: 'circle',
          detail: 'Part of the **hindbrain**, sitting just behind the optic lobes.' },
        { id: uuid(), x: 0.87, y: 0.56, label: 'Medulla oblongata', icon: 'circle',
          detail: "The rearmost part of the **hindbrain**. It passes out of the skull through an opening called the **foramen magnum** and continues directly into the spinal cord, which runs protected inside the vertebral column." },
      ],
    },
    // ── 8 · Reasoning check ────────────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A frog's brain has three regions — forebrain, midbrain, and hindbrain — each defined by different parts. Which region is characterised by a pair of optic lobes?",
      options: [
        'The midbrain, since NCERT names a pair of optic lobes as exactly what characterises this region',
        'The forebrain, because the diencephalon inside it is responsible for processing vision',
        'The hindbrain, because the cerebellum inside it is responsible for coordinating what the eyes see',
        'The forebrain, because the paired cerebral hemispheres handle all sensory input, including sight',
      ],
      reveal: "NCERT is direct about this: the midbrain is characterised by a pair of optic lobes — that's the one defining feature given for this region. The forebrain is built from the olfactory lobes, paired cerebral hemispheres, and the unpaired diencephalon, and the hindbrain is built from the cerebellum and medulla oblongata — optic lobes belong to neither. Assigning vision-sounding jobs to the diencephalon or cerebral hemispheres, or a coordination-sounding job to the cerebellum, is exactly the kind of plausible-sounding swap this question is built to catch.",
      difficulty_level: 2,
    },
    // ── 9 · Comparison card — three nervous networks ──────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: "The Three Networks of the Frog's Nervous System",
      columns: [
        {
          heading: 'Central (CNS)',
          points: [
            'Brain + spinal cord',
            'The command centre itself',
            'Brain protected inside the cranium; spinal cord protected inside the vertebral column',
          ],
        },
        {
          heading: 'Peripheral (PNS)',
          points: [
            'Cranial nerves + spinal nerves',
            'Ten pairs of cranial nerves arise directly from the brain',
            'Carries signals between the CNS and the rest of the body',
          ],
        },
        {
          heading: 'Autonomic (ANS)',
          points: [
            'Sympathetic + parasympathetic networks',
            'Runs involuntary functions — the ones never consciously switched on',
            'Layered on top of the CNS and PNS, not separate from them',
          ],
        },
      ],
    },
    // ── 10-11 · Sense organs ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Sense Organs — Windows to the World',
      objective: "By the end of this you can match every sense to its exact structure — and explain why only two of the five count as 'well-organised.'",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "A frog reads the world through five kinds of sense organ, each tied to a specific structure: touch through **sensory papillae**, taste through **taste buds**, smell through the **nasal epithelium**, vision through the **eyes**, and hearing through the **tympanum along with internal ears**. Out of these five, only two are genuinely well-organised structures — the **eyes** and the **internal ears**. The rest — touch, taste, and smell — are simpler: just **cellular aggregations clustered around nerve endings**, not a dedicated organ the way an eye is.\n\nThe eyes themselves are a **pair of spherical structures sitting in the orbit of the skull** — but NCERT calls them **simple eyes**, meaning each eye is built from just **one visual unit**. Hold onto that phrase — when you study Arthropoda later, you'll meet an eye built on the opposite principle: a compound eye, made of many separate units instead of one.\n\nHearing works differently from what you might expect: a frog has **no external ear at all** — no flap, no visible opening. All you can see from the outside is the **tympanum**. And that one structure does two jobs at once — it's an organ of **hearing** as well as **balancing (equilibrium)**.",
    },
    // ── 12 · Table — senses at a glance ───────────────────────────────────
    {
      id: uuid(), type: 'table', order: 12, caption: 'Frog Sense Organs at a Glance',
      headers: ['Sense', 'Structure', 'How well-organised'],
      rows: [
        ['Touch', 'Sensory papillae', 'Cellular aggregation around nerve endings'],
        ['Taste', 'Taste buds', 'Cellular aggregation around nerve endings'],
        ['Smell', 'Nasal epithelium', 'Cellular aggregation around nerve endings'],
        ['Vision', 'Eyes (simple eyes — one unit)', 'Well-organised structure'],
        ['Hearing + balance', 'Tympanum with internal ears', 'Well-organised structure'],
      ],
    },
    // ── 13-14 · Remember + exam tip ────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember', title: 'Lock These In',
      markdown: "- **Endocrine glands (8):** pituitary, thyroid, parathyroid, thymus, pineal body, pancreatic islets, adrenals, gonads.\n- **Three nervous networks:** central (brain + spinal cord), peripheral (cranial + spinal nerves), autonomic (sympathetic + parasympathetic).\n- **Ten pairs of cranial nerves** arise from the brain. The brain sits inside the **cranium**.\n- **Forebrain** = olfactory lobes + paired cerebral hemispheres + unpaired diencephalon. **Midbrain** = a pair of **optic lobes**. **Hindbrain** = cerebellum + medulla oblongata.\n- The **medulla oblongata** exits through the **foramen magnum** and continues as the spinal cord.\n- Only **eyes** and **internal ears** are well-organised sense structures — touch, taste, and smell are just cellular clusters around nerve endings.\n- Frog eyes are **simple eyes** (one visual unit). There is **no external ear** — only the tympanum is visible, and it handles **both hearing and balance**.",
    },
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Simple eyes, one-liner:** NCERT calls a frog's eyes 'simple eyes' for one exact reason — each eye has **only one visual unit**. NEET likes to test this word choice directly, rather than asking about vision in general.\n\n**External ear absent:** one of the most repeated one-liners from this page — a frog has **no external ear**; only the **tympanum** is visible from outside. Don't confuse 'no external ear' with 'no hearing organ' — the tympanum is doing the job just fine.\n\n**The ear does two jobs:** NCERT explicitly calls the ear an organ of **hearing as well as balancing (equilibrium)** — a detail that's easy to drop if you only remember 'hearing.'\n\n**Classic NEET question:** \"Which two sense organs in the frog are well-organised structures, while the rest are cellular aggregations around nerve endings?\" → **Eyes and internal ears.**",
    },
    // ── 15 · Bridge to next page ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "The frog can now sense the world and react to it in an instant. One system is still left unexplored — the one that makes more frogs in the first place. Reproduction is next.",
    },
    // ── 16 · Quiz ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "Which of the following is NOT one of the prominent endocrine glands NCERT names in the frog?",
          options: ['Pituitary', 'Liver', 'Thymus', 'Adrenals'],
          correct_index: 1,
          explanation: "NCERT's list of prominent frog endocrine glands is pituitary, thyroid, parathyroid, thymus, pineal body, pancreatic islets, adrenals, and gonads. The liver is a digestive organ and does not appear on that list, making it the odd one out among these four options.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "How many pairs of cranial nerves arise from a frog's brain?",
          options: ['Eight', 'Ten', 'Twelve', 'Twenty'],
          correct_index: 1,
          explanation: "NCERT states exactly ten pairs of cranial nerves arise from the brain, forming part of the peripheral nervous system alongside the spinal nerves. The other counts given here are simply not the figure NCERT gives for the frog.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "A frog has no external ear opening or flap. What is visible from the outside instead, and what does that structure do?",
          options: [
            'The operculum, which only covers the ear opening without any sensory role',
            'The tympanum, which handles hearing only — balance is managed elsewhere',
            'The tympanum, which handles both hearing and balancing (equilibrium)',
            'The pineal body, which is visible externally and manages both hearing and balance',
          ],
          correct_index: 2,
          explanation: "The tympanum is the visible external structure, and NCERT is specific that it is an organ of both hearing and balancing (equilibrium) — not hearing alone. The operculum is a gill-covering flap from bony fish, unrelated to the frog's ear, and the pineal body is an internal endocrine gland, not a visible ear structure.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "NCERT describes a frog's eyes as 'simple eyes.' What does that description actually mean?",
          options: [
            'Each eye is built from only one visual unit, unlike a compound eye made of many separate units',
            'A frog has only one eye rather than the usual pair',
            'The eyes lack the internal ear\'s dual hearing-and-balance function',
            'The eyes are cellular aggregations around nerve endings rather than a well-organised structure',
          ],
          correct_index: 0,
          explanation: "'Simple eyes' means each eye has just one visual unit — that's the exact reason NCERT gives. A frog has a pair of eyes, not one, so that option contradicts the text directly. Mixing in the ear's dual function doesn't explain anything about the eyes. And eyes are explicitly one of only two well-organised sense structures in the frog (along with internal ears), so calling them a cellular aggregation reverses that fact.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
