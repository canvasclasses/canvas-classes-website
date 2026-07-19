'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'function-of-the-tubules',
  title: 'Function of the Tubules',
  subtitle: "The glomerulus makes a rough draft of urine; the tubules edit it line by line. Follow the filtrate through four segments — PCT, Henle's loop, DCT, collecting duct — and learn exactly what each one adds back, throws out, and secretes.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['excretory-products-and-their-elimination', 'nephron-tubules'],
  glossary: [
    { term: 'Proximal Convoluted Tubule (PCT)', definition: "The first coiled segment of the nephron tubule, lined by simple cuboidal brush border epithelium. It reabsorbs nearly all essential nutrients and 70–80% of the electrolytes and water in the filtrate." },
    { term: 'brush border', definition: "A dense fringe of tiny finger-like projections on the PCT's cuboidal epithelium that hugely increases the surface area available for reabsorption." },
    { term: "Henle's loop", definition: "The hairpin-shaped part of the tubule with a descending and an ascending limb. It reabsorbs very little itself but keeps the medullary interstitial fluid highly concentrated." },
    { term: 'descending limb', definition: "The arm of Henle's loop going down into the medulla. It is permeable to water but almost impermeable to electrolytes, so water leaves and the filtrate becomes concentrated." },
    { term: 'ascending limb', definition: "The arm of Henle's loop coming back up. It is impermeable to water but lets electrolytes move out (actively or passively), so the filtrate becomes diluted." },
    { term: 'Distal Convoluted Tubule (DCT)', definition: "The second coiled segment, where conditional reabsorption of Na+ and water occurs, along with reabsorption of HCO3– and secretion of H+, K+ and NH3." },
    { term: 'collecting duct', definition: "A long duct running from the cortex deep into the medulla. Large amounts of water can be reabsorbed here to make concentrated urine, and it passes small amounts of urea into the medullary interstitium." },
    { term: 'conditional reabsorption', definition: "Reabsorption of Na+ and water in the DCT that happens depending on the body's needs at the time, rather than automatically." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A long winding tube descending through dark tissue, faint droplets of fluid leaving its walls along the way, lit softly from within',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single long, winding, softly glowing tubule threads its way downward through deep, shadowy body tissue, coiling at the top, plunging into a hairpin loop in the middle, then rising and running down into darkness at the bottom. Faint translucent droplets are suggested drifting outward from the tube's walls at a few points along its length, hinting at fluid leaving and re-entering, without any labels or text. Warm interior light glows gently from within the tube against the surrounding dark reddish tissue. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Filter Enough to Fill a Bathtub, and Keep Almost All of It',
      markdown: "The filtrate that first enters your tubules is not urine yet — it is basically blood plasma minus the big proteins, and it is packed with glucose, amino acids, salts, and water your body cannot afford to lose. If the tubules simply let it all drain out, you would empty yourself dry in hours. So the tubules go over that rough filtrate segment by segment and pull the valuable material back — in the very first stretch alone, **70–80 per cent** of the electrolytes and water are reclaimed before the filtrate has gone far.",
    },
    // ── 2 · Core concept — the tubule does the fine-tuning ────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Filtration at the glomerulus is fast but blind — it pushes out almost everything small enough to fit through, useful or not. The real precision work happens **after** filtration, along the length of the tubule. Each segment of the tubule has its own job: some parts **reabsorb** material back from the filtrate into the blood, some parts **secrete** unwanted substances from the blood into the filtrate, and some parts control **how much water** stays in.\n\nWalk the filtrate through the tubule in order and you meet four segments: the **Proximal Convoluted Tubule (PCT)**, **Henle's loop** (with a descending and an ascending limb), the **Distal Convoluted Tubule (DCT)**, and finally the **collecting duct**. What comes out at the far end is concentrated urine — everything valuable taken back, everything harmful pushed out, and the water carefully balanced.",
    },
    // ── 3 · Heading — PCT ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Proximal Convoluted Tubule — Bulk Reabsorption',
      objective: "By the end of this you can say what lines the PCT, roughly how much it reabsorbs, and how it keeps the body's pH and ions balanced.",
    },
    // ── 4 · Text — PCT ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **PCT** is lined by **simple cuboidal brush border epithelium**. That \"brush border\" is a thick fringe of tiny projections on the cells' inner surface, and it exists for one reason: it **increases the surface area for reabsorption**. More surface means more material can be pulled back per second, which is why the PCT is where the heavy lifting happens.\n\nIn this segment, **nearly all of the essential nutrients** and **70–80 per cent of the electrolytes and water** are reabsorbed back into the blood. The PCT also **maintains the pH and ionic balance** of the body fluids in two ways at once: it **secretes hydrogen ions and ammonia** into the filtrate, and it **absorbs HCO3– (bicarbonate)** out of it.",
    },
    // ── 5 · Heading — Henle's loop ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: "Henle's Loop — the Two Limbs Do Opposite Jobs",
      objective: "By the end of this you can explain why the descending limb concentrates the filtrate while the ascending limb dilutes it, and why this loop matters even though it reabsorbs little.",
    },
    // ── 6 · Text — Henle's loop ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Henle's loop** looks like a hairpin: the filtrate goes down one limb and back up the other. Here is the key that trips students up — **reabsorption is minimum in its ascending limb**, so at first the loop looks unimportant. But this region plays a **significant role in maintaining the high osmolarity of the medullary interstitial fluid** — the saltiness of the tissue fluid deep in the medulla, which later segments depend on.\n\nThe two limbs have **opposite permeabilities**, and that is the whole trick:\n\n- The **descending limb** is **permeable to water but almost impermeable to electrolytes**. Water leaves; salts stay. So the filtrate **gets concentrated as it moves down**.\n- The **ascending limb** is **impermeable to water but allows transport of electrolytes** (actively or passively). Water can't leave, but electrolytes pass out into the medullary fluid. So as the concentrated filtrate moves up, it **gets diluted**.\n\nTie the two together: on the way down, water exits and the filtrate thickens; on the way up, electrolytes exit into the medulla and the filtrate thins — and those exiting electrolytes are exactly what keeps the medullary interstitium so concentrated.",
    },
    // ── 7 · Interactive image — nephron segment functions ─────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A labelled nephron tubule showing the PCT, descending and ascending limbs of Henle\'s loop, DCT and collecting duct, with arrows for reabsorption and secretion at each segment',
      caption: '📸 Tap each dot to see what its segment of the tubule reabsorbs, secretes, or does to the filtrate.',
      generation_prompt: "Scientific textbook illustration of a single nephron tubule, drawn in the style of NCERT Figure 16.5 (reabsorption and secretion at different parts of the nephron). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. Show, connected in order from left to right: a coiled Proximal Convoluted Tubule (PCT) near the top; a long hairpin Henle's loop dipping down into a shaded medullary region, with its descending limb and ascending limb clearly distinct; a coiled Distal Convoluted Tubule (DCT) near the top; and a long straight collecting duct running from the top down deep into the medulla. Draw small arrows at each segment: arrows pointing OUT of the tubule for reabsorption (water, electrolytes, nutrients, HCO3–) and arrows pointing INTO the tubule for secretion (H+, K+, ammonia). Use blue for water movement, red/orange for electrolytes and ions. Shade a horizontal band to distinguish cortex (upper) from medulla (lower). Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.22, label: 'PCT — bulk reabsorption', detail: "Lined by **brush border** cuboidal epithelium. Reabsorbs **nearly all essential nutrients** and **70–80% of electrolytes and water**. Secretes H+ and ammonia, absorbs HCO3– to hold pH and ionic balance.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.62, label: 'Descending limb — water out', detail: "**Permeable to water but almost impermeable to electrolytes.** Water leaves, salts stay, so the filtrate **gets concentrated** as it moves down.", icon: 'circle' },
        { id: uuid(), x: 0.56, y: 0.62, label: 'Ascending limb — electrolytes out', detail: "**Impermeable to water but allows electrolyte transport** (active or passive). Salts pass out into the medullary fluid, so the filtrate **gets diluted** as it moves up.", icon: 'circle' },
        { id: uuid(), x: 0.49, y: 0.86, label: "Henle's loop — keeps the medulla salty", detail: "Reabsorption is **minimum in the ascending limb**, but this region maintains the **high osmolarity of the medullary interstitial fluid** that later segments rely on.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.22, label: 'DCT — conditional reabsorption', detail: "**Conditional reabsorption of Na+ and water.** Also reabsorbs HCO3– and does selective secretion of **H+, K+ and NH3** to maintain pH and the Na+/K+ balance in blood.", icon: 'circle' },
        { id: uuid(), x: 0.88, y: 0.7, label: 'Collecting duct — concentrates urine', detail: "Runs from cortex deep into the medulla. **Large amounts of water can be reabsorbed** here to make **concentrated urine**, and small amounts of **urea** pass into the medullary interstitium to keep up its osmolarity.", icon: 'circle' },
      ],
    },
    // ── 8 · Heading — DCT & collecting duct ───────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'DCT and Collecting Duct — the Final Adjustments',
      objective: "By the end of this you can say what \"conditional\" reabsorption means, and how the collecting duct makes urine concentrated while feeding urea into the medulla.",
    },
    // ── 9 · Text — DCT & collecting duct ──────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "In the **DCT**, **conditional reabsorption of Na+ and water** takes place — \"conditional\" because how much is taken back depends on the body's needs at that moment, not a fixed amount every time. The DCT is also capable of **reabsorbing HCO3–**, and it does **selective secretion of hydrogen ions, potassium ions, and NH3** to maintain the pH and the sodium–potassium balance in blood.\n\nThe **collecting duct** is a long duct that extends from the **cortex of the kidney to the inner parts of the medulla**. This is where the final concentration happens: **large amounts of water could be reabsorbed** from this region to **produce a concentrated urine**. The collecting duct also **allows the passage of small amounts of urea into the medullary interstitium** — this is deliberate, because that urea helps **keep up the osmolarity** of the medulla. Like the segments before it, the collecting duct also helps maintain pH and ionic balance through the **selective secretion of H+ and K+ ions**.",
    },
    // ── 10 · Table — the four segments ────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'The four tubule segments and the one job each is known for',
      headers: ['Segment', 'Main function'],
      rows: [
        ['PCT', 'Brush border epithelium; reabsorbs nearly all nutrients and 70–80% of electrolytes and water; secretes H+ and ammonia, absorbs HCO3– to hold pH and ionic balance.'],
        ["Henle's loop — descending limb", 'Permeable to water, almost impermeable to electrolytes → water leaves, filtrate gets concentrated moving down.'],
        ["Henle's loop — ascending limb", 'Impermeable to water, allows electrolyte transport → salts leave into the medulla, filtrate gets diluted moving up; maintains high medullary osmolarity.'],
        ['DCT', 'Conditional reabsorption of Na+ and water; reabsorbs HCO3–; selective secretion of H+, K+ and NH3 for pH and Na+/K+ balance.'],
        ['Collecting duct', 'Runs cortex → inner medulla; large amounts of water reabsorbed to make concentrated urine; passes small amounts of urea into the medullary interstitium; secretes H+ and K+.'],
      ],
    },
    // ── 11 · Reasoning prompt — Henle limb permeability ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "The filtrate becomes more concentrated as it travels down one limb of Henle's loop. Which single statement correctly explains which limb this is and why?",
      options: [
        "The descending limb — it is permeable to water but almost impermeable to electrolytes, so water leaves and the filtrate concentrates.",
        "The ascending limb — it is permeable to water but impermeable to electrolytes, so water leaves and the filtrate concentrates.",
        "The descending limb — it is impermeable to water but permeable to electrolytes, so salts leave and the filtrate concentrates.",
        "The ascending limb — it is impermeable to water but permeable to electrolytes, so salts leave and the filtrate concentrates.",
      ],
      reveal: "Option 1 is right. The **descending limb** is permeable to water but almost impermeable to electrolytes — so water exits, salts are left behind, and the filtrate gets **concentrated** as it moves down. The tempting trap is option 4: it correctly describes the **ascending** limb's permeability (impermeable to water, permeable to electrolytes), but the ascending limb **dilutes** the filtrate, it does not concentrate it — salts leaving without water makes the filtrate weaker, not stronger. Options 2 and 3 swap the permeabilities onto the wrong limb.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **PCT** = **brush border** epithelium; reabsorbs **nearly all nutrients** + **70–80% of electrolytes and water**; secretes H+ and ammonia, absorbs HCO3–.\n- **Descending limb of Henle's loop** = permeable to **water**, not electrolytes → filtrate gets **concentrated** going down.\n- **Ascending limb of Henle's loop** = permeable to **electrolytes**, not water → filtrate gets **diluted** going up; keeps the **medullary interstitium highly osmotic**.\n- **DCT** = **conditional** reabsorption of Na+ and water; reabsorbs HCO3–; secretes H+, K+, NH3.\n- **Collecting duct** = reabsorbs large amounts of **water** → **concentrated urine**; passes small amounts of **urea** into the medullary interstitium to keep up osmolarity.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The two Henle limbs are the single most-tested fact here — never mix them up:** descending limb = permeable to **water** (concentrates the filtrate); ascending limb = permeable to **electrolytes**, impermeable to water (dilutes the filtrate).\n\n**PCT = maximum reabsorption.** Nearly all nutrients and 70–80% of electrolytes and water come back here — if a question asks where the *most* reabsorption happens, the answer is the PCT.\n\n**Classic NEET question:** \"The descending limb of Henle's loop is permeable to ___.\" → **water** (but almost impermeable to electrolytes). A close variant: \"Maximum reabsorption of the glomerular filtrate occurs in the ___.\" → **PCT**.",
    },
    // ── 14 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You have now seen how each segment reabsorbs and secretes on its own. But the truly clever part is how Henle's loop and its neighbouring blood vessels work together to make the medulla so concentrated in the first place — the **counter current mechanism**, which is the next thing you'll build up.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "The PCT is lined by simple cuboidal brush border epithelium. What is the brush border's main purpose?",
          options: [
            "It secretes urea directly into the medullary interstitium",
            "It makes the segment impermeable to water so the filtrate stays dilute",
            "It increases the surface area for reabsorption",
            "It concentrates the filtrate by pulling in electrolytes from the blood",
          ],
          correct_index: 2,
          explanation: "NCERT is specific: the brush border epithelium increases the surface area for reabsorption, which is why the PCT can reabsorb nearly all nutrients and 70–80% of electrolytes and water. Passing urea into the medulla is the collecting duct's job; impermeability to water describes the ascending limb of Henle's loop, not the PCT.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Roughly how much of the electrolytes and water in the filtrate is reabsorbed by the PCT?",
          options: [
            "70–80 per cent",
            "10–20 per cent",
            "All of it — 100 per cent",
            "None — the PCT only secretes, it does not reabsorb",
          ],
          correct_index: 0,
          explanation: "The PCT reabsorbs nearly all essential nutrients and 70–80% of the electrolytes and water. It reabsorbs the great majority but not literally all of the water and electrolytes — the later segments and the collecting duct fine-tune the rest. The PCT both reabsorbs and secretes, so 'only secretes' is wrong.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which correctly pairs a limb of Henle's loop with what it does to the filtrate?",
          options: [
            "Descending limb → impermeable to water → dilutes the filtrate",
            "Ascending limb → permeable to water → concentrates the filtrate",
            "Descending limb → permeable to water, almost impermeable to electrolytes → concentrates the filtrate",
            "Ascending limb → impermeable to electrolytes → concentrates the filtrate",
          ],
          correct_index: 2,
          explanation: "The descending limb is permeable to water but almost impermeable to electrolytes, so water leaves and the filtrate gets concentrated moving down. The ascending limb is the opposite — impermeable to water, permeable to electrolytes — so it dilutes the filtrate. Options 1, 2 and 4 all swap a permeability or an outcome onto the wrong limb.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The collecting duct allows small amounts of urea to pass into the medullary interstitium. Why does this happen?",
          options: [
            "To dilute the urine before it leaves the body",
            "To help keep up the osmolarity of the medulla",
            "To reabsorb glucose and amino acids that the PCT missed",
            "To make the ascending limb permeable to water",
          ],
          correct_index: 1,
          explanation: "NCERT states the collecting duct allows passage of small amounts of urea into the medullary interstitium to keep up its osmolarity — that high medullary osmolarity is what lets large amounts of water be reabsorbed to make concentrated urine. It is not about diluting the urine, recovering nutrients (a PCT function), or changing the ascending limb's permeability.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
