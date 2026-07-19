'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'counter-current-mechanism',
  title: 'The Counter Current Mechanism',
  subtitle: "Your kidney can wring urine four times more concentrated than the filtrate it started with — and it does it with a simple trick of geometry: two U-tubes running side by side, their flows pointing opposite ways.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['excretory-products-and-their-elimination', 'counter-current'],
  glossary: [
    { term: 'concentrated urine', definition: 'Urine in which far more water has been reabsorbed than solute, leaving the waste dissolved in a small volume of fluid. Mammals can do this; human kidneys produce urine nearly four times concentrated than the initial filtrate.' },
    { term: "Henle's loop", definition: "The long, hairpin (U-shaped) part of the nephron that dips down into the medulla and turns back up. Its two limbs carry filtrate in opposite directions, forming a counter current." },
    { term: 'vasa recta', definition: "The hairpin-shaped blood capillary that runs alongside Henle's loop. Blood flows through its two limbs in opposite directions too — also a counter current — and it carries solutes back to the interstitium to keep the gradient intact." },
    { term: 'counter current', definition: 'A flow arrangement in which two fluids in adjacent tubes move in opposite directions. In the nephron, both the filtrate in Henle\'s loop and the blood in vasa recta are counter current.' },
    { term: 'osmolarity', definition: 'A measure of how much solute is dissolved in a fluid, given in mOsmol/L. In the kidney it rises from 300 mOsmol/L in the cortex to about 1200 mOsmol/L in the inner medulla.' },
    { term: 'medullary interstitium', definition: 'The tissue fluid lying between the tubules in the medulla of the kidney. The counter current mechanism builds an increasing solute concentration in it towards the inner medulla.' },
    { term: 'counter current mechanism', definition: "The transport of NaCl and urea, made possible by the special side-by-side arrangement of Henle's loop and vasa recta, that maintains the concentration gradient in the medullary interstitium." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Two long hairpin-shaped tubes running side by side deep into dark tissue, faintly glowing more brightly towards their lowest bend',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Two long, slender hairpin-shaped tubes descend side by side into deep, shadowy body tissue and bend back upward, suggesting the loop of Henle and the vasa recta running parallel. A soft glow grows warmer and more intense towards the lowest bend of the tubes, hinting at a rising concentration deep inside, fading to cool darkness near the top. Painterly, atmospheric medical illustration style, biologically suggestive but not a literal labelled diagram, dark background throughout (#0a0a0a base tones), no text, no labels, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Desert Trick Built Into Your Body',
      markdown: "Being able to make **concentrated urine** is the reason a mammal can survive without drinking water all day. Instead of flushing waste out in a flood of water it can't spare, the kidney packs the waste into as little water as possible. Human kidneys can produce urine that is nearly **four times concentrated** than the filtrate they started with — and it comes down to how two tiny tubes are arranged next to each other.",
    },
    // ── 2 · Core concept — why concentrating urine matters ───────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By the time filtrate reaches the last stretch of the nephron, most of the useful stuff has already been taken back. What's left still has too much water in it. To make **concentrated urine**, the kidney has to pull that extra water out of the tubule — but water doesn't move on command. Water only leaves a tube when the fluid *outside* the tube is saltier than the fluid inside; then water follows by osmosis on its own.\n\nSo the real problem the kidney has to solve is this: **make the tissue around the tubule extremely salty**, saltier and saltier the deeper you go. If it can build that, water will drain out of the filtrate by itself. Two structures pull this off together — the **Henle's loop** and the **vasa recta**.",
    },
    // ── 3 · Heading — the counter current ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Counter Current — Two Flows Pointing Opposite Ways',
      objective: "By the end of this you can explain what 'counter current' means in the nephron, and name the two structures where it happens.",
    },
    // ── 4 · Text — counter current in loop and vasa recta ─────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Henle's loop** is shaped like a hairpin — a tube that goes **down** into the medulla, bends, and comes back **up**. That means at any level, filtrate in the descending limb is flowing *down* while filtrate right next to it in the ascending limb is flowing *up*. Two flows, side by side, pointing in **opposite directions** — that is a **counter current**.\n\nThe **vasa recta** — the blood vessel looping alongside Henle's loop — is built the same hairpin way, so blood in its two limbs also flows in **opposite directions**. It is a counter current too. Now here's the key: because Henle's loop and vasa recta sit **very close together (proximity)**, and because both carry counter currents, together they maintain an **increasing osmolarity towards the inner medulla** — the tissue gets steadily saltier as you go deeper. Tap through the diagram below to see it build.",
    },
    // ── 5 · Interactive image — Figure 16.6 style ─────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: "Diagram of a nephron's Henle's loop next to the vasa recta, showing counter current flows and an osmolarity gradient rising from 300 in the cortex to 1200 in the inner medulla",
      caption: '📸 Tap each dot to explore how the counter current mechanism builds the salt gradient.',
      generation_prompt: "Scientific textbook illustration of the counter current mechanism in a nephron (NCERT Figure 16.6 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a hairpin-shaped Henle's loop with a descending limb and an ascending limb side by side, and next to it a hairpin-shaped vasa recta blood vessel with a descending and ascending limb running parallel. A collecting duct runs down the right side into the inner medulla. Two horizontal band labels mark the regions: 'Cortex 300 mOsmol/L' at the top and 'Inner medulla 1200 mOsmol/L' at the bottom, with the background tint growing gradually more saturated from top to bottom to show rising osmolarity. Arrows show filtrate flowing DOWN the descending limb and UP the ascending limb of Henle's loop (opposite directions), and blood flowing in opposite directions in the two limbs of vasa recta. Small arrows show NaCl leaving the ascending limb of Henle's loop, urea leaving the collecting duct, and water leaving the collecting duct. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Functional colours: blue for water, red for the vasa recta blood vessel. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.30, label: "Descending limb of Henle's loop", detail: "Filtrate flows **downward** here, into the medulla. Right beside it the ascending limb runs the opposite way — that side-by-side pair of opposite flows is the **counter current**.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.30, label: "Ascending limb of Henle's loop", detail: "Filtrate flows **upward** here — opposite to the descending limb. This limb **transports NaCl** out into the surrounding tissue, and its thin segment lets **small amounts of urea** enter it.", icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.32, label: 'Vasa recta (counter current too)', detail: "The blood vessel looping alongside Henle's loop. Blood in its two limbs flows in **opposite directions**, so it is also a **counter current**. It carries NaCl back to the interstitium so the salt isn't just washed away.", icon: 'circle' },
        { id: uuid(), x: 0.15, y: 0.12, label: 'Cortex — 300 mOsmol/L', detail: "At the top, in the **cortex**, the tissue fluid osmolarity is about **300 mOsmol/L** — the starting point of the gradient.", icon: 'circle' },
        { id: uuid(), x: 0.15, y: 0.88, label: 'Inner medulla — 1200 mOsmol/L', detail: "Deep down in the **inner medulla**, osmolarity climbs to about **1200 mOsmol/L**. This steadily-rising saltiness towards the inside is what the whole mechanism exists to build.", icon: 'circle' },
        { id: uuid(), x: 0.85, y: 0.55, label: 'Collecting duct — water leaves here', detail: "Because the interstitium outside is so salty, **water passes easily out of the collecting tubule** by osmosis, concentrating the filtrate into urine. The collecting tubule also **carries urea back** into the interstitium to help keep the gradient up.", icon: 'circle' },
      ],
    },
    // ── 6 · Reasoning prompt — what maintains the gradient ────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "The medullary interstitium keeps its saltiness rising towards the inner medulla instead of the salt simply diffusing away and evening out. According to NCERT, what makes this possible?",
      options: [
        "The heart pumps blood fast enough through the kidney to physically push the salt inward",
        "The proximity of Henle's loop and vasa recta, together with the counter current flow in both, maintains the increasing osmolarity towards the inner medulla",
        "The glomerulus filters salt directly into the inner medulla under high pressure",
        "The collecting duct actively pumps water inward to dilute the outer cortex",
      ],
      reveal: "The correct answer is the second one. NCERT states plainly that the closeness (proximity) between Henle's loop and the vasa recta, plus the counter current running in both of them, is what maintains an increasing osmolarity towards the inner medulla — from 300 mOsmol/L in the cortex to about 1200 mOsmol/L in the inner medulla. The heart-pumping option is tempting because blood does flow through the vasa recta, but it is the counter current *arrangement*, not raw pump pressure, that holds the gradient. The glomerulus only filters blood at the start of the nephron; it has nothing to do with building the medullary gradient. And the collecting duct's job here is to let water *leave*, not pump it inward.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — NaCl and urea build the gradient ────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'NaCl and Urea Build the Gradient',
      objective: "By the end of this you can name the two solutes that cause the gradient and trace exactly which structure moves each one.",
    },
    // ── 8 · Text — NaCl and urea routes ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The gradient — that 300 → 1200 mOsmol/L rise — is **mainly caused by NaCl and urea**. Follow each one:\n\n- **NaCl** is transported out by the **ascending limb of Henle's loop**. It gets **exchanged with the descending limb of vasa recta**, and then the **ascending portion of the vasa recta returns it to the interstitium** — so the salt stays deep in the medulla instead of being carried off in the blood.\n- **Urea**: small amounts of urea enter the **thin segment of the ascending limb of Henle's loop**, and the **collecting tubule transports it back to the interstitium**. This tops up the medullary saltiness.\n\nThis whole transport of substances, made possible by the **special side-by-side arrangement of Henle's loop and vasa recta**, is called the **counter current mechanism**. And it pays off at the end: because the interstitium is now so concentrated, **water passes easily out of the collecting tubule**, concentrating the filtrate into urine.",
    },
    // ── 9 · Comparison card — Henle's loop vs vasa recta ──────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: "Henle's Loop vs Vasa Recta",
      columns: [
        {
          heading: "Henle's Loop",
          points: [
            'Part of the nephron tubule — carries **filtrate**',
            'Hairpin shape: the two limbs carry filtrate in **opposite directions** = a counter current',
            "**Ascending limb transports NaCl** out into the interstitium",
            'Its thin ascending segment lets **small amounts of urea** enter',
          ],
        },
        {
          heading: 'Vasa Recta',
          points: [
            'A **blood** capillary running parallel to the loop',
            'Also hairpin-shaped: blood in the two limbs flows in **opposite directions** = a counter current too',
            '**Descending limb exchanges NaCl**; the **ascending limb returns NaCl** to the interstitium',
            'Its proximity keeps the salt in the medulla, **maintaining the gradient**',
          ],
        },
      ],
    },
    // ── 10 · Table — the osmolarity gradient ──────────────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'The medullary osmolarity gradient the counter current mechanism maintains',
      headers: ['Region of the kidney', 'Osmolarity'],
      rows: [
        ['Cortex (outer)', '300 mOsmol/L'],
        ['Inner medulla (deep)', 'about 1200 mOsmol/L'],
      ],
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Henle's loop** and **vasa recta** both run as **counter currents** — the two limbs of each carry their fluid in opposite directions.\n- Their **proximity + counter current** maintains an **increasing osmolarity towards the inner medulla: 300 mOsmol/L (cortex) → about 1200 mOsmol/L (inner medulla)**.\n- The gradient is **mainly caused by NaCl and urea**. NaCl is moved out by the **ascending limb of Henle's loop** and returned by the **ascending vasa recta**; **urea** is carried back by the **collecting tubule**.\n- This special arrangement of transport = the **counter current mechanism**.\n- The salty interstitium lets **water pass easily out of the collecting tubule**, concentrating the urine.\n- Human kidneys can make urine nearly **four times concentrated** than the initial filtrate.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Memorise the two numbers exactly:** the medullary osmolarity gradient runs from **300 mOsmol/L in the cortex to about 1200 mOsmol/L in the inner medulla**. NEET loves fill-in-the-blank and matching questions on this range.\n\n**Know which solute is moved by which structure:** **NaCl → ascending limb of Henle's loop** (exchanged with descending vasa recta, returned by ascending vasa recta); **urea → collecting tubule** carries it back. Swapping these is the classic trap.\n\n**Classic NEET question:** \"The counter current mechanism in the kidney involves Henle's loop and the ___\" → **vasa recta**. And: \"The medullary osmolarity gradient ranges from ___ to ___\" → **300 to about 1200 mOsmol/L**.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You now know how the kidney builds a salt gradient deep in the medulla and uses it to wring water out of the filtrate. Next, you'll see how the whole kidney is switched up and down to fit the body's needs — the hormonal **regulation of kidney function**, and how urine is finally released through **micturition**.",
    },
    // ── 14 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which two structures play the significant role in a mammal's ability to produce concentrated urine?",
          options: [
            "The glomerulus and Bowman's capsule",
            "The proximal convoluted tubule and the distal convoluted tubule",
            "Henle's loop and the vasa recta",
            "The collecting duct and the ureter",
          ],
          correct_index: 2,
          explanation: "NCERT names Henle's loop and the vasa recta as the two structures behind concentrated urine — both run as counter currents and together maintain the medullary gradient. The glomerulus and Bowman's capsule handle filtration at the start of the nephron, not concentration; the PCT and DCT do reabsorption and secretion but aren't the counter current pair; and the ureter simply carries urine away.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What does 'counter current' mean in Henle's loop?",
          options: [
            "Filtrate in the two limbs of the loop flows in opposite directions",
            "Blood and filtrate flow in the same direction through the loop",
            "The filtrate reverses its own direction every few seconds",
            "Salt and water always move in the same direction across the loop wall",
          ],
          correct_index: 0,
          explanation: "A counter current is simply two flows side by side going opposite ways — in Henle's loop, filtrate goes down the descending limb and up the ascending limb, in opposite directions. The vasa recta is a counter current the same way (blood in opposite directions), but the loop itself is about the filtrate's two limbs, not blood-and-filtrate together, and nothing reverses on a timer.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The medullary interstitial osmolarity gradient runs from which value to which?",
          options: [
            "From 1200 mOsmol/L in the cortex to 300 mOsmol/L in the inner medulla",
            "From 300 mOsmol/L in the cortex to about 1200 mOsmol/L in the inner medulla",
            "From 100 mOsmol/L in the cortex to about 600 mOsmol/L in the inner medulla",
            "From 300 mOsmol/L in the inner medulla to about 1200 mOsmol/L in the cortex",
          ],
          correct_index: 1,
          explanation: "The osmolarity increases towards the inner medulla: 300 mOsmol/L in the cortex rising to about 1200 mOsmol/L in the inner medulla. Option 1 flips which region is which; option 4 flips it the other way; and 100 → 600 are simply wrong numbers. The direction matters — it must get saltier as you go deeper so water can be drawn out of the collecting duct.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which pairing of solute-and-transporter matches NCERT's account of how the gradient is built?",
          options: [
            "Urea is transported by the ascending limb of Henle's loop; NaCl is carried back by the collecting tubule",
            "Both NaCl and urea are transported only by the descending limb of vasa recta",
            "NaCl is transported by the ascending limb of Henle's loop and returned to the interstitium by the ascending vasa recta; urea is carried back to the interstitium by the collecting tubule",
            "Glucose and NaCl together build the gradient, transported by the collecting duct",
          ],
          correct_index: 2,
          explanation: "NCERT is specific: NaCl is transported by the ascending limb of Henle's loop, exchanged with the descending vasa recta, and returned to the interstitium by the ascending vasa recta; urea is carried back by the collecting tubule. Option 1 swaps the two solutes' routes. Option 2 puts everything on the descending vasa recta, which isn't what NCERT says. Option 4 brings in glucose, which has no role in this gradient — the gradient is mainly caused by NaCl and urea.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
