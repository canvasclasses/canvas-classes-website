'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mechanism-of-muscle-contraction',
  title: 'The Mechanism of Muscle Contraction',
  subtitle: "A muscle doesn't squeeze shut — its thin filaments slide over the thick ones like fingers interlocking. Follow the exact chain from a nerve signal to a shortened sarcomere, the way NEET tests it step by step.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['locomotion-and-movement', 'sliding-filament-theory'],
  glossary: [
    { term: 'sliding filament theory', definition: 'The theory that a muscle fibre contracts because the thin filaments slide over the thick filaments — the filaments themselves do not shorten, they just overlap more.' },
    { term: 'motor unit', definition: 'A single motor neuron together with all the muscle fibres it connects to and controls.' },
    { term: 'neuromuscular junction', definition: 'The junction between a motor neuron and the sarcolemma of a muscle fibre; also called the motor-end plate. It is where the nerve signal is passed to the muscle.' },
    { term: 'acetylcholine', definition: 'The neurotransmitter released at the neuromuscular junction. It generates an action potential in the sarcolemma, starting the contraction.' },
    { term: 'troponin', definition: 'A protein on the actin (thin) filament. When calcium binds one of its subunits, the masking of the myosin active sites on actin is removed.' },
    { term: 'cross bridge', definition: 'The connection formed when a myosin head binds to an exposed active site on actin. Pulling on this bridge is what drags the thin filaments inward.' },
    { term: 'myoglobin', definition: 'A red-coloured, oxygen-storing pigment inside muscle. Muscles with a lot of it look reddish and are called red fibres.' },
    { term: 'red vs white fibres', definition: 'Red fibres are rich in myoglobin and mitochondria and work aerobically; white fibres have little myoglobin (so look pale), few mitochondria, high sarcoplasmic reticulum, and work anaerobically.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Two sets of parallel protein filaments sliding past one another in warm light, suggesting a muscle tightening',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An abstract, atmospheric impression of two sets of long parallel protein filaments overlapping and sliding past one another, one set thicker and one set thinner, drawn together toward a bright centre as if a muscle is tightening. Warm amber highlights catch the edges of the filaments against deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people, no cartoon.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Nothing Actually Shrinks',
      markdown: "Here is the part that surprises most students: when a muscle contracts, **not a single filament inside it gets shorter**. The thick filaments stay their length. The thin filaments stay their length. The muscle shortens only because the thin filaments **slide over** the thick ones and overlap them more — the way you can make two hands look shorter by sliding the fingers of one between the fingers of the other. That single idea is the whole **sliding filament theory**.",
    },
    // ── 2 · Core concept — sliding filament theory ─────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The mechanism of muscle contraction is best explained by the **sliding filament theory**. It states one clean thing: contraction of a muscle fibre takes place by the **sliding of the thin filaments over the thick filaments**.\n\nSo when you picture a contracting muscle, don't picture rubber being squeezed. Picture two overlapping combs. The thin filaments (actin) and the thick filaments (myosin) are already partly overlapped when the muscle is relaxed. During contraction, the thin filaments are dragged further in, deeper across the thick ones. More overlap means a shorter fibre — even though every individual filament is exactly as long as it was before.",
    },
    // ── 3 · Heading — from nerve signal to cross bridge ────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'From Nerve Signal to Cross Bridge',
      objective: "By the end of this you can trace the exact chain — CNS signal → motor neuron → acetylcholine → action potential → calcium → troponin unmasks actin → myosin head forms a cross bridge — in the right order.",
    },
    // ── 4 · Text — the signalling chain ────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A muscle never contracts on its own. Contraction is **initiated by a signal from the central nervous system (CNS)**, sent down a **motor neuron**. One motor neuron together with all the muscle fibres it connects to is called a **motor unit**.\n\nThe motor neuron meets the muscle fibre at the **neuromuscular junction** (also called the **motor-end plate**) — the junction between the motor neuron and the **sarcolemma** of the fibre. When the neural signal reaches this junction, it releases a neurotransmitter, **acetylcholine**. Acetylcholine generates an **action potential** in the sarcolemma. That action potential spreads through the whole muscle fibre and causes the release of **calcium ions (Ca²⁺)** into the **sarcoplasm**.\n\nNow the calcium does the key job. The rise in Ca²⁺ makes calcium bind to a subunit of **troponin** on the actin filaments, and this **removes the masking of the active sites** for myosin — the spots on actin were covered, and now they're exposed. Using energy from **ATP hydrolysis**, the **myosin head** binds to these exposed active sites on actin, forming a **cross bridge**.",
    },
    // ── 5 · Interactive image — cross-bridge cycle / sliding filaments ─────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of the cross-bridge cycle: a myosin head binding an actin active site, the power stroke pulling actin toward the A-band centre, the Z-lines drawn inward and the sarcomere shortening, and a new ATP breaking the bridge',
      caption: '📸 Tap each dot to walk through one turn of the cross-bridge cycle, from binding to power stroke to release.',
      generation_prompt: "Scientific textbook illustration of the sliding-filament / cross-bridge cycle of muscle contraction. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show one sarcomere: a central thick filament (myosin) with protruding myosin heads, and two thin filaments (actin) on either side anchored to vertical Z-lines at the outer edges, with the A-band marked at the centre and I-bands near the Z-lines. Depict a myosin head binding to an exposed active site on actin to form a cross bridge, an arrow showing the power stroke pulling the actin filament toward the centre of the A-band, the Z-lines being pulled inward so the sarcomere shortens, and a separate small inset of a new ATP molecule binding the myosin head to break the cross bridge. Clean white outlines, biologically accurate proportions. Thick filament in warm tan/brown, thin filament in pink/magenta, calcium and ATP labelled. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.45, label: 'Myosin head binds actin', detail: "Using energy from **ATP hydrolysis**, the myosin head attaches to an exposed active site on the actin filament. This attachment is the **cross bridge**.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.40, label: 'Power stroke', detail: "The bound head pivots and **pulls the actin filament toward the centre of the A-band**, dragging the thin filament deeper over the thick one.", icon: 'circle' },
        { id: uuid(), x: 0.12, y: 0.55, label: 'Z-line pulled inward', detail: "The **Z-line** attached to that actin is pulled inward. Both Z-lines moving in is what physically shortens the unit.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.72, label: 'Sarcomere shortens', detail: "With the Z-lines drawn together, the **sarcomere shortens** — this shortening is the contraction itself.", icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.78, label: 'I-band reduced', detail: "During contraction the **I-bands get reduced (shorten)**, while the **A-band keeps its length**. This is the tell-tale sign of a contracted fibre.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.30, label: 'ATP breaks the bridge', detail: "Myosin releases **ADP + Pi** and returns to its relaxed state. A **new ATP binds** the myosin head and the **cross bridge breaks**, so the head can grab a fresh site and pull again.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — what shortens, and relaxation ────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'What Shortens, and How the Muscle Lets Go',
      objective: "By the end of this you can say which band shortens and which stays constant, what breaks a cross bridge, and how the fibre relaxes.",
    },
    // ── 7 · Text — I-band shortens, cycle repeats, relaxation ──────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The cross bridge pulls the attached actin filaments toward the **centre of the A-band**. The **Z-lines** attached to those actins are pulled inward too, and that shortens the **sarcomere** — which is exactly what we mean by contraction.\n\nWatch the bands carefully, because NEET does. During contraction the **I-bands get reduced (shorten)**, while the **A-bands retain their length**. The A-band never changes; only the I-band narrows.\n\nOne pull isn't enough, so the cycle repeats. The myosin releases **ADP and Pi** and goes back to its relaxed state. A **new ATP binds, and the cross bridge is broken**. That ATP is then hydrolysed again by the myosin head, and the whole cross-bridge formation-and-breakage repeats, causing further sliding.\n\nThe muscle keeps contracting until the calcium signal stops. Relaxation happens when the **Ca²⁺ ions are pumped back to the sarcoplasmic cisternae**. With calcium gone, the actin active sites get **masked again**, the **Z-lines return to their original position**, and the fibre relaxes.",
    },
    // ── 8 · Heading — red vs white fibres & fatigue ────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Fatigue, and Why Some Muscles Are Red and Others Pale',
      objective: "By the end of this you can explain what causes fatigue and tell red fibres from white fibres by myoglobin, mitochondria, and aerobic vs anaerobic working.",
    },
    // ── 9 · Text — fatigue + red/white ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Keep firing a muscle again and again and it eventually tires. **Repeated activation leads to the accumulation of lactic acid**, produced by the **anaerobic breakdown of glycogen** in the muscle — and that build-up causes **fatigue**.\n\nMuscles aren't all the same colour, and the reason is a pigment. Muscle contains a red-coloured, oxygen-storing pigment called **myoglobin**. Muscles with a lot of myoglobin look reddish — these are the **red fibres**. They also carry plenty of **mitochondria**, which use that stored oxygen to make ATP, so red fibres are **aerobic muscles**. Muscles with very little myoglobin appear **pale or whitish** — the **white fibres**. They have few mitochondria but a high amount of **sarcoplasmic reticulum**, and they depend on the **anaerobic process** for energy.",
    },
    // ── 10 · Comparison card — red vs white fibres ─────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Red vs White Muscle Fibres',
      columns: [
        { heading: 'Red fibres', points: [
          'High myoglobin content — reddish appearance',
          'Plenty of mitochondria',
          'Use stored oxygen for ATP production',
          'Work aerobically (aerobic muscles)',
        ] },
        { heading: 'White fibres', points: [
          'Very little myoglobin — pale / whitish appearance',
          'Few mitochondria',
          'High amount of sarcoplasmic reticulum',
          'Depend on the anaerobic process for energy',
        ] },
      ],
    },
    // ── 11 · Reasoning prompt — which band shortens ────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A muscle fibre is caught mid-contraction. Comparing it to the same fibre relaxed, which single change is actually happening inside the sarcomere?",
      options: [
        "The I-band gets reduced, while the A-band keeps its length",
        "The A-band gets reduced, while the I-band keeps its length",
        "Both the A-band and the I-band shorten together as the filaments themselves shrink",
        "The thick filaments slide over the thin filaments, shortening the A-band",
      ],
      reveal: "The first option is right. During contraction the thin filaments slide inward over the thick ones, the Z-lines are pulled together, and the **I-band gets reduced while the A-band retains its length**. The tempting trap is the second option — students remember 'a band shortens' but attach it to the wrong band. The A-band is the one thing that never changes length. The third option is wrong because no filament shrinks at all (that is the whole point of the sliding filament theory), and the fourth reverses the sliding direction — it is the thin filaments that slide over the thick, not the other way round.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ──────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Sliding filament theory:** contraction = thin filaments **slide over** the thick filaments. No filament shortens.\n- **Signal chain:** CNS → motor neuron → **acetylcholine** at the neuromuscular junction → action potential in sarcolemma → **Ca²⁺** released into sarcoplasm.\n- **Ca²⁺ binds troponin** on actin → removes the masking of myosin's active sites.\n- **Myosin head** (uses ATP hydrolysis) binds the exposed actin site → **cross bridge** → pulls actin toward the A-band centre.\n- **Sarcomere & I-band shorten; A-band length stays constant.**\n- A **new ATP binds and breaks the cross bridge**; the cycle repeats.\n- Relaxation = **Ca²⁺ pumped back** to the sarcoplasmic cisternae → actin re-masked → Z-lines return.\n- **Fatigue** = **lactic acid** build-up from anaerobic breakdown of glycogen.\n- **Red fibres** = high myoglobin + many mitochondria = **aerobic**. **White fibres** = low myoglobin (pale), few mitochondria, high sarcoplasmic reticulum = **anaerobic**.",
    },
    // ── 13 · Exam tip ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The band trap:** during contraction the **I-band shortens while the A-band stays constant**. NEET loves to swap these two — memorise that the A-band is the one that never changes.\n\n**The two ATP roles:** ATP hydrolysis gives the myosin head energy to **form** the cross bridge, and a **fresh ATP binding breaks** it. Both steps use ATP — a favourite two-mark distractor is claiming the cross bridge breaks without ATP.\n\n**Red vs white:** red = high myoglobin, many mitochondria, aerobic; white = low myoglobin (pale), few mitochondria, high sarcoplasmic reticulum, anaerobic.\n\n**Classic NEET question:** \"During muscle contraction, the ___ band shortens while the A-band stays constant.\" → **I-band**. And its partner: \"The neurotransmitter released at the neuromuscular junction is ___.\" → **acetylcholine**.",
    },
    // ── 14 · Bridge text ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now have the full contraction machinery — from the nerve signal that fires it to the calcium that unmasks actin, the cross bridge that pulls, and the ATP that resets it. But a contracting muscle needs something rigid to pull against. Next, you'll meet that framework: the **skeletal system** — the bones and cartilage the muscles are anchored to.",
    },
    // ── 15 · Inline quiz (LAST) ────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to the sliding filament theory, how does a muscle fibre actually shorten during contraction?",
          options: [
            "The thick filaments contract and physically shrink in length",
            "The thin filaments slide over the thick filaments, increasing their overlap",
            "Both thick and thin filaments shrink by the same amount at once",
            "The thick filaments slide over the thin filaments toward the Z-lines",
          ],
          correct_index: 1,
          explanation: "The sliding filament theory says contraction happens by the thin filaments sliding over the thick filaments — more overlap, shorter fibre, but no filament changes length. Option 1 and 3 are wrong because nothing shrinks; that is the core idea. Option 4 reverses the direction — it is the thin filaments that slide, not the thick.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A neural signal reaches the neuromuscular junction. What is released there, and what does it trigger?",
          options: [
            "Calcium ions are released, which directly bind the myosin head",
            "Acetylcholine is released, generating an action potential in the sarcolemma",
            "Troponin is released, which unmasks the active sites on actin",
            "ATP is released, forming a cross bridge with actin straight away",
          ],
          correct_index: 1,
          explanation: "At the neuromuscular junction the neurotransmitter acetylcholine is released, and it generates an action potential in the sarcolemma — that action potential later causes calcium release. Option 1 confuses a later step (calcium) with the neurotransmitter, and calcium binds troponin, not the myosin head. Troponin is a protein already on actin, not something released (option 3), and ATP powers the myosin head but is not the junction's signal (option 4).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "During contraction, what happens to the A-band and the I-band of the sarcomere?",
          options: [
            "The A-band shortens while the I-band retains its length",
            "Both the A-band and the I-band shorten together",
            "The I-band gets reduced while the A-band retains its length",
            "Both bands retain their length while only the Z-lines move apart",
          ],
          correct_index: 2,
          explanation: "As the thin filaments slide inward and pull the Z-lines together, the I-band gets reduced but the A-band retains its length. Option 1 swaps the two bands — the single most common mistake. Option 2 is wrong because the A-band never shortens, and option 4 is wrong because the Z-lines are pulled inward (closer together), not apart.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about red and white muscle fibres is correct?",
          options: [
            "Red fibres have little myoglobin and depend on the anaerobic process for energy",
            "White fibres are rich in myoglobin and mitochondria and work aerobically",
            "Red fibres have high myoglobin and plenty of mitochondria and work aerobically; white fibres have little myoglobin, few mitochondria, and work anaerobically",
            "Both red and white fibres store equal myoglobin, differing only in the amount of sarcoplasmic reticulum",
          ],
          correct_index: 2,
          explanation: "Red fibres are rich in myoglobin (so they look red) and mitochondria, using stored oxygen to make ATP aerobically; white fibres have little myoglobin (so they look pale), few mitochondria, high sarcoplasmic reticulum, and depend on the anaerobic process. Options 1 and 2 flip the two fibre types. Option 4 is wrong because it is precisely the myoglobin amount that differs — that is what makes one red and the other pale.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
