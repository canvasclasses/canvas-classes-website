'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'nerve-impulse-resting-and-action-potential',
  title: 'The Nerve Impulse — Resting & Action Potential',
  subtitle: "A resting neuron is a charged battery — positive outside, negative inside. Learn exactly how a stimulus flips that charge for a split second, and how that flip races down the axon as a nerve impulse.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['neural-control-and-coordination', 'action-potential'],
  glossary: [
    { term: 'polarised membrane', definition: 'The state of a resting neuron\'s axonal membrane, where the outer surface carries a positive charge and the inner surface a negative charge.' },
    { term: 'resting potential', definition: 'The electrical potential difference across the plasma membrane of a resting (non-conducting) neuron.' },
    { term: 'sodium-potassium pump', definition: 'An active transporter in the axonal membrane that pushes 3 Na⁺ ions out of the cell for every 2 K⁺ ions it brings in, maintaining the ionic gradients across the resting membrane.' },
    { term: 'depolarisation', definition: 'The reversal of membrane polarity at a stimulated site — the outer surface becomes negative and the inner surface positive — caused by a rapid influx of Na⁺.' },
    { term: 'action potential', definition: 'The electrical potential difference across the plasma membrane at a depolarised site; it is, in fact, termed a nerve impulse.' },
    { term: 'nerve impulse', definition: 'The action potential as it travels along the axon — the signal a neuron conducts.' },
    { term: 'repolarisation', definition: 'The restoration of the resting potential at an excited site as K⁺ diffuses out of the membrane, making the fibre responsive to further stimulation again.' },
    { term: 'stimulus', definition: 'A change applied at a site on the polarised membrane that makes that site freely permeable to Na⁺, triggering an action potential.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A long nerve fibre glowing softly in the dark, with a single bright pulse of light travelling along its length',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single long, smooth nerve fibre stretches horizontally across the frame in a dim, dark space, softly self-illuminated. One concentrated bright pulse of pale blue-white light is travelling along its length, leaving a faint fading trail behind it, like a wave of charge moving down a wire. Deep shadow fills the rest of the frame with subtle cool highlights along the fibre's surface. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no numbers, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Your Nerves Run on a Charged Battery',
      markdown: "Right now, before any signal is even sent, every resting neuron in your body is sitting like a tiny charged battery — **positive on the outside, negative on the inside**. It is doing nothing, yet it is fully loaded and ready. A nerve signal is not the battery switching on. It is that charge briefly flipping over — and that flip racing down the fibre faster than you can blink.",
    },
    // ── 2 · Core concept — excitable, polarised membrane ─────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Neurons are called **excitable cells** because their membranes sit in a **polarised** state — charge is unevenly split across the membrane, and that imbalance can be triggered to change. Why is the membrane polarised in the first place? Because of the **ion channels** studded across the neural membrane. These channels are **selectively permeable** — each one lets certain ions cross while blocking others. Control which ions can move, and you control where the charge sits.",
    },
    // ── 3 · Heading — the resting potential ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Resting Potential — How the Battery Gets Charged',
      objective: "By the end of this you can say which ion the resting membrane lets through, which it blocks, exactly what the sodium-potassium pump moves, and why the outside ends up positive.",
    },
    // ── 4 · Text — resting permeability, gradients, pump, polarisation ───────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "When a neuron is **not** conducting any impulse — that is, **resting** — the axonal membrane is comparatively **more permeable to potassium ions (K⁺)** and **nearly impermeable to sodium ions (Na⁺)**. It is also **impermeable to the negatively charged proteins** floating in the axoplasm, so those proteins are trapped inside.\n\nAdd this up and you get two opposite worlds separated by the membrane. **Inside the axon (axoplasm):** high K⁺, plenty of trapped negative proteins, low Na⁺. **Outside the axon:** low K⁺, high Na⁺. These uneven amounts form a **concentration gradient** across the membrane.\n\nThese gradients don't hold themselves — they are actively maintained by the **sodium-potassium pump**, which transports **3 Na⁺ outwards for every 2 K⁺ it pumps into the cell**. Because more positive charge is pushed out than brought in, the **outer surface of the membrane ends up positively charged while the inner surface becomes negatively charged** — the membrane is **polarised**. This electrical potential difference across the resting membrane is the **resting potential**.",
    },
    // ── 5 · Interactive image — impulse conduction along axon (Fig 18.2) ─────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A stretch of axon showing a resting polarised region, a depolarised site with Na plus rushing in, the impulse moving to the next site, and K plus leaving to repolarise behind it',
      caption: '📸 Tap each dot to follow a nerve impulse as it fires and travels down the axon.',
      generation_prompt: "Scientific textbook illustration of a stretch of a nerve axon shown as a long horizontal tube, illustrating impulse conduction (Figure 18.2 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Show, from left to right along the axon: (1) a RESTING polarised region with a row of '+' symbols along the OUTER surface and '−' symbols along the INNER surface; (2) a DEPOLARISED site where the polarity is reversed — '−' symbols on the outer surface and '+' on the inner surface — with blue arrows showing Na⁺ ions rushing INTO the axon; (3) an arrow along the axon showing the impulse/wave moving toward the next region to the right; (4) behind the depolarised site (to its left), green arrows showing K⁺ ions moving OUT of the axon as the region repolarises back to '+' outside; (5) a small embedded sodium-potassium pump symbol in the membrane moving 3 Na⁺ out and 2 K⁺ in. Colour code: blue for sodium (Na⁺), green for potassium (K⁺). No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.4, label: 'Resting polarised region', detail: "Ahead of the impulse the membrane is still at rest: **outer surface positive, inner surface negative**. This is the polarised state, held by the sodium-potassium pump.", icon: 'circle' },
        { id: uuid(), x: 0.4, y: 0.35, label: 'Na⁺ influx (depolarisation)', detail: "The stimulus makes this spot freely permeable to Na⁺. Sodium rushes **in**, and the polarity **reverses** — now the outer surface is negative and the inner surface positive. The site is **depolarised**.", icon: 'circle' },
        { id: uuid(), x: 0.4, y: 0.68, label: 'Action potential = nerve impulse', detail: "The reversed potential difference across the membrane at this depolarised site is the **action potential** — which is, in fact, what we call a **nerve impulse**.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.4, label: 'Impulse moves to the next site', detail: "The site just ahead is still positive outside/negative inside. Current flows between the two sites, reversing the polarity there too — so the action potential is generated at the next site. Repeat this along the axon and the impulse is **conducted**.", icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.68, label: 'K⁺ efflux (repolarisation)', detail: "The Na⁺ permeability is extremely short-lived. It is quickly followed by a rise in K⁺ permeability — **K⁺ diffuses out**, which **restores the resting potential** behind the impulse. This is repolarisation.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.6, label: 'Sodium-potassium pump', detail: "The pump that keeps the whole system charged: it moves **3 Na⁺ out for every 2 K⁺ in**, maintaining the ionic gradients that make the resting potential possible.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — action potential & conduction ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Action Potential — How the Battery Fires and the Signal Travels',
      objective: "By the end of this you can trace, step by step, how a stimulus flips the charge at one site, how that flip jumps to the next site, and how K⁺ resets each site behind the impulse.",
    },
    // ── 7 · Text — stimulus, Na influx, depolarisation, action potential ─────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Now apply a **stimulus** at one site on the polarised membrane — call it **point A**. At that instant, the membrane at A becomes **freely permeable to Na⁺**. Sodium comes flooding in — a **rapid influx of Na⁺** — and the polarity at A **reverses**: the **outer surface becomes negative and the inner surface becomes positive**. Point A is now **depolarised**. This reversed potential difference across the membrane at A is the **action potential**, which is, in fact, termed a **nerve impulse**.",
    },
    // ── 8 · Text — conduction to next site, repolarisation ───────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The site just ahead — **point B** — hasn't fired yet, so it is still positive on the outside and negative on the inside. Now you have opposite charges side by side, so a **current flows**: on the inner surface it flows from A to B, and on the outer surface from B to A, completing the circuit. That current **reverses the polarity at B**, generating an **action potential at site B**. So the impulse that started at A **arrives at B**. This sequence repeats all the way along the axon — and that is how the impulse is **conducted**.\n\nMeanwhile, back at A, the story isn't over. The rise in Na⁺ permeability is **extremely short-lived**. It is quickly followed by a rise in **K⁺ permeability**: within a fraction of a second, **K⁺ diffuses out** of the membrane and **restores the resting potential** at the excited site (**repolarisation**). Once reset, that stretch of fibre is once more **responsive to further stimulation**.",
    },
    // ── 9 · Comparison card — resting vs action potential ────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Resting Potential vs Action Potential',
      columns: [
        {
          heading: 'Resting Potential',
          points: [
            'Neuron is at rest — not conducting any impulse',
            'Membrane is polarised: outer surface positive, inner surface negative',
            'Membrane is more permeable to K⁺, nearly impermeable to Na⁺',
            'Inside: high K⁺ + trapped negative proteins, low Na⁺',
            'Maintained by the Na-K pump (3 Na⁺ out / 2 K⁺ in)',
          ],
        },
        {
          heading: 'Action Potential',
          points: [
            'A stimulus has been applied at that site',
            'Membrane is depolarised: polarity reversed — outer surface negative, inner surface positive',
            'Membrane becomes freely permeable to Na⁺ — rapid Na⁺ influx',
            'This reversed potential is the action potential — the nerve impulse itself',
            'Restored to resting by K⁺ diffusing out (repolarisation)',
          ],
        },
      ],
    },
    // ── 10 · Reasoning prompt — mechanism check ──────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A neuron is stimulated at one point and an action potential is generated there. Which single event is directly responsible for generating that action potential?",
      options: [
        "A rapid influx of Na⁺ into the axon, reversing the polarity so the inside becomes positive",
        "A rapid efflux of K⁺ out of the axon, restoring the resting potential",
        "The sodium-potassium pump pushing 3 Na⁺ out for every 2 K⁺ in",
        "Negatively charged proteins leaking out of the axoplasm across the membrane",
      ],
      reveal: "The first option is correct. When the stimulus makes the site freely permeable to Na⁺, sodium rushes in, the polarity reverses (inside becomes positive), and this reversed potential difference is the action potential. The tempting wrong answer is K⁺ efflux — but that happens afterwards, and its job is the opposite: it restores the resting potential (repolarisation), it doesn't generate the action potential. The Na-K pump only maintains the resting gradients, it doesn't fire the impulse; and the negative proteins never cross the membrane at all — it's impermeable to them.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Resting = polarised:** outer surface **positive**, inner surface **negative**. More permeable to **K⁺**, nearly impermeable to **Na⁺**.\n- **Sodium-potassium pump:** **3 Na⁺ out / 2 K⁺ in** — this maintains the gradients and the resting potential.\n- **Stimulus → Na⁺ influx → depolarisation → action potential.** The action potential **is** the nerve impulse.\n- Depolarised site: polarity **reversed** — outer surface negative, inner surface positive.\n- **K⁺ efflux → repolarisation → resting potential restored**, and the fibre can fire again.\n- The impulse is **conducted** because each site triggers the polarity reversal at the site just ahead, repeating down the axon.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Resting potential:** membrane polarised — outside positive, inside negative; more permeable to K⁺ than Na⁺.\n\n**Na-K pump stoichiometry — a favourite fill-in-the-blank:** it pushes out **3 Na⁺** for every **2 K⁺** it brings in. Keep the numbers and directions exact.\n\n**Don't swap the ions:** **Na⁺ influx** generates the action potential (depolarisation); **K⁺ efflux** restores the resting potential (repolarisation). Reversing these two is the single most common trap.\n\n**Classic NEET question:** \"The action potential is generated by the rapid influx of ___.\" → **Na⁺ (sodium ions)**. A close variant: \"The Na-K pump pushes out ___ Na⁺ for every ___ K⁺ it brings in.\" → **3 for 2**.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You can now trace a nerve impulse from the resting battery, through the Na⁺-driven flip that fires it, to the K⁺-driven reset behind it. But an impulse that reaches the **end** of one neuron still has to cross over to the next one. Next, you'll see how that hand-off happens — at the **synapse**.",
    },
    // ── 14 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "In a resting neuron, the axonal membrane is:",
          options: [
            "More permeable to K⁺ and nearly impermeable to Na⁺",
            "More permeable to Na⁺ and nearly impermeable to K⁺",
            "Equally permeable to both Na⁺ and K⁺",
            "Freely permeable to the negatively charged proteins in the axoplasm",
          ],
          correct_index: 0,
          explanation: "In the resting state the membrane lets K⁺ through comparatively easily but is nearly impermeable to Na⁺ — that selective permeability, plus the pump, is what keeps the inside K⁺-rich and low in Na⁺. Option 2 swaps the two ions (that's closer to the depolarised state). The membrane is never equally permeable to both at rest, and it is impermeable to the negative proteins, which is exactly why they stay trapped inside.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The sodium-potassium pump maintains the resting gradients by transporting:",
          options: [
            "2 Na⁺ out of the cell for every 3 K⁺ into the cell",
            "3 K⁺ out of the cell for every 2 Na⁺ into the cell",
            "3 Na⁺ out of the cell for every 2 K⁺ into the cell",
            "3 Na⁺ into the cell for every 2 K⁺ out of the cell",
          ],
          correct_index: 2,
          explanation: "The pump moves 3 Na⁺ outwards for every 2 K⁺ it brings in — pushing more positive charge out than it lets in, which helps keep the outer surface positive. The other options either flip the numbers (2 out / 3 in), swap which ion goes which way, or reverse the directions of Na⁺ and K⁺ entirely.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "At a site where an action potential is being generated, the membrane's polarity is:",
          options: [
            "Unchanged — outer surface positive, inner surface negative, as at rest",
            "Reversed — outer surface negative, inner surface positive — due to Na⁺ rushing in",
            "Reversed — outer surface negative, inner surface positive — due to K⁺ rushing out",
            "Neutralised — no charge difference remains across the membrane",
          ],
          correct_index: 1,
          explanation: "At the action-potential site the polarity reverses: the rapid influx of Na⁺ makes the outer surface negative and the inner surface positive — this reversal (depolarisation) is the action potential. Option 3 gets the reversed polarity right but blames the wrong ion: K⁺ efflux causes repolarisation, not the action potential. At rest (option 1) nothing has flipped, and the charge difference is never simply erased (option 4).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Just after a site depolarises, how is its resting potential restored so the fibre can respond again?",
          options: [
            "Na⁺ continues to flood in until the charge balances out",
            "The negatively charged proteins move out across the membrane",
            "A rise in K⁺ permeability lets K⁺ diffuse out, restoring the resting potential",
            "The sodium-potassium pump instantly reverses to pump 2 Na⁺ in for every 3 K⁺ out",
          ],
          correct_index: 2,
          explanation: "The Na⁺ permeability is extremely short-lived and is quickly followed by a rise in K⁺ permeability — K⁺ diffuses out of the membrane and restores the resting potential at the excited site (repolarisation), leaving the fibre ready to fire again. Continued Na⁺ influx would keep it depolarised, not reset it; the negative proteins never cross the membrane; and the pump's job is to maintain gradients steadily, not to instantly reverse itself.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
