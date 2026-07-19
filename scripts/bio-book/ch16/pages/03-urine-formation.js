'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'urine-formation',
  title: 'Urine Formation — Filtration, Reabsorption & Secretion',
  subtitle: "Your kidneys quietly filter 180 litres of fluid a day and hand back almost all of it — here's exactly how the nephron pulls off that trick in three clean steps.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['excretory-products-and-their-elimination', 'urine-formation'],
  glossary: [
    { term: 'glomerular filtration', definition: 'The first step of urine formation — the filtration of blood carried out by the glomerulus.' },
    { term: 'ultrafiltration', definition: 'The very fine filtration at the glomerulus in which almost all constituents of the plasma except the proteins pass into the lumen of Bowman\'s capsule.' },
    { term: 'podocytes', definition: 'The epithelial cells of Bowman\'s capsule, arranged in an intricate way that leaves minute spaces called filtration slits (slit pores).' },
    { term: 'filtration slits', definition: 'The minute spaces (also called slit pores) left between the podocytes of Bowman\'s capsule, through which blood is finely filtered.' },
    { term: 'glomerular filtration rate (GFR)', definition: 'The amount of filtrate formed by the kidneys per minute — approximately 125 ml/minute, i.e. 180 litres per day in a healthy individual.' },
    { term: 'juxta glomerular apparatus (JGA)', definition: 'A special sensitive region formed by cellular modifications in the distal convoluted tubule and the afferent arteriole where they touch; it regulates GFR.' },
    { term: 'renin', definition: 'A substance released by the JG cells when GFR falls; it stimulates glomerular blood flow and brings the GFR back to normal.' },
    { term: 'reabsorption', definition: 'The process by which the renal tubules take back nearly 99 per cent of the filtrate, by active or passive mechanisms.' },
    { term: 'tubular secretion', definition: 'The step in which tubular cells secrete substances like H+, K+ and ammonia into the filtrate, helping maintain ionic and acid-base balance.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing single nephron winding through a dark kidney, with a bright filtering knot of blood vessels at one end',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single long, winding nephron tubule drawn as a soft, luminous thread snaking across a very dark field, beginning at a bright knot of tangled blood vessels (a glomerulus) cupped inside a rounded capsule on the left. Faint red blood-vessel tones feed into the bright filtering knot; the thread of the tubule glows cool and pale as it winds toward the right and fades into shadow. Painterly, atmospheric, biological illustration style, deep near-black background throughout (#0a0a0a base tones), gentle warm and cool highlights only, no text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Filter a Bathtub of Fluid Every Day',
      markdown: "Your kidneys form about **180 litres** of filtrate in a single day — enough to fill a large bathtub. Yet you only pass around **1.5 litres** of urine. So where does the other ~178 litres go? Your tubules quietly pull almost all of it back into your blood, minute after minute, without you ever noticing. This page is the story of how that happens.",
    },
    // ── 2 · Core concept — the three processes ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Making urine is not one action — it is **three main processes** happening in **different parts of the nephron**: **glomerular filtration**, **reabsorption**, and **secretion**.\n\nThink of it like sorting a huge basket of mixed items. First you tip almost everything out through a sieve (**filtration**). Then you carefully pick back the useful things you tipped out by mistake (**reabsorption**). Finally you throw in a few extra things you specifically want to get rid of (**secretion**). What's left at the end is urine. Keep these three steps and their order in your head — the rest of the page just fills in the detail of each one.",
    },
    // ── 3 · Heading — glomerular filtration ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Step 1 — Glomerular Filtration',
      objective: "By the end of this you can say how much blood is filtered per minute, name the 3 layers blood passes through, and explain why this step is called ultrafiltration.",
    },
    // ── 4 · Text — filtration, blood volume, 3 layers ────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **first step** in urine formation is the **filtration of blood**, carried out by the **glomerulus** — this is why it's called **glomerular filtration**. On average, **1100–1200 ml of blood is filtered by the kidneys per minute**. That's a lot: it's **roughly 1/5th** of all the blood pumped out by each ventricle of the heart in a minute. Your kidneys are only a small part of your body, yet a fifth of your heart's output runs through them for cleaning.\n\nWhat pushes the blood through the filter is the **glomerular capillary blood pressure**. The blood is forced through **3 layers** stacked together:\n\n1. the **endothelium** of the glomerular blood vessels,\n2. the **epithelium of Bowman's capsule**, and\n3. a **basement membrane** sitting between those two.\n\nThe epithelial cells of Bowman's capsule are called **podocytes**. They're arranged in an intricate way that leaves tiny gaps between them — **filtration slits**, also called **slit pores**. Blood gets filtered so finely through these membranes that **almost all the constituents of the plasma pass into the lumen of Bowman's capsule — except the proteins**. Because the filtering is this fine, the whole step is called **ultrafiltration**.",
    },
    // ── 5 · Interactive image — renal corpuscle / filtration ─────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of the renal corpuscle showing the glomerulus inside Bowman\'s capsule, afferent and efferent arterioles, podocytes with filtration slits, and the three filtration layers',
      caption: '📸 Tap each dot to explore where blood is filtered at the start of the nephron.',
      generation_prompt: "Scientific textbook illustration of the renal corpuscle (glomerulus inside Bowman's capsule) where blood is filtered. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Show: a tangled ball of glomerular capillaries (tinted red for blood) cupped inside a rounded double-walled Bowman's capsule; a wider afferent arteriole entering and a narrower efferent arteriole leaving the capillary tuft; the cup-shaped epithelial cells (podocytes, tinted pink) wrapping the capillaries with small gaps (filtration slits) between their foot-like extensions; an inset zoom showing the three stacked filtration layers — capillary endothelium, a basement membrane, and the Bowman's capsule epithelium — with pale filtrate droplets passing through into the capsular space. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.42, y: 0.44, label: 'Glomerulus', detail: "The tangled knot of capillaries where filtration actually happens. The **glomerular capillary blood pressure** here is what forces blood through the filter.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.66, label: "Bowman's capsule", detail: "The cup that surrounds the glomerulus and catches the filtrate. Almost all plasma constituents **except proteins** end up in its **lumen**.", icon: 'circle' },
        { id: uuid(), x: 0.16, y: 0.34, label: 'Afferent arteriole', detail: "Brings blood **into** the glomerulus. A fall in filtration rate can trigger renin, which raises the blood flow arriving here.", icon: 'circle' },
        { id: uuid(), x: 0.18, y: 0.62, label: 'Efferent arteriole', detail: "Carries the filtered blood **away** from the glomerulus after filtration.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.24, label: 'Podocytes & filtration slits', detail: "The epithelial cells of Bowman's capsule are **podocytes**, arranged to leave minute gaps called **filtration slits (slit pores)** that blood is filtered through.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.5, label: 'The 3 filtration layers', detail: "Blood crosses three layers: the **endothelium** of the glomerular vessels, the **epithelium of Bowman's capsule**, and a **basement membrane** between them.", icon: 'circle' },
      ],
    },
    // ── 6 · Text — GFR and JGA ───────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "How much filtrate is formed each minute? That number has a name: the **glomerular filtration rate (GFR)**. In a healthy person, **GFR is approximately 125 ml/minute — that adds up to 180 litres per day**.\n\nThe kidneys don't just let this rate wander. They have a built-in control: the **juxta glomerular apparatus (JGA)**. It's a special sensitive region formed by **cellular modifications in the distal convoluted tubule (DCT) and the afferent arteriole**, right at the spot where the two touch. If the **GFR falls**, the **JG cells release renin**, which stimulates the glomerular blood flow and pushes the **GFR back to normal**. So the JGA acts like a thermostat that keeps filtration steady.",
    },
    // ── 7 · Heading — reabsorption & secretion ───────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Steps 2 & 3 — Reabsorption and Secretion',
      objective: "By the end of this you can explain why nearly 99% of the filtrate is reabsorbed, which substances move actively vs passively, and what the tubules secrete.",
    },
    // ── 8 · Text — reabsorption + secretion ──────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Now compare the two numbers from before: **180 litres of filtrate** formed per day, but only **1.5 litres of urine** released. That gap tells you something huge — **nearly 99 per cent of the filtrate has to be reabsorbed** by the renal tubules. This process is **reabsorption**.\n\nThe tubular epithelial cells do this in two ways. Some things are pulled back **actively** — **glucose, amino acids, Na+**, and the like. Other things move back **passively** — the **nitrogenous wastes** are absorbed by passive transport, and **water is reabsorbed passively in the initial segments** of the nephron.\n\nThe third step runs the other way. During urine formation, the tubular cells **secrete** substances like **H+, K+ and ammonia** into the filtrate. This is **tubular secretion**, and it matters because it helps maintain the **ionic and acid-base balance** of the body fluids.",
    },
    // ── 9 · Table — the three processes ──────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 9,
      caption: 'The three processes of urine formation — where each happens and what moves',
      headers: ['Process', 'Where it happens', 'What moves'],
      rows: [
        ['Glomerular filtration', 'Glomerulus (into Bowman\'s capsule)', 'Almost all plasma constituents except proteins are pushed out of the blood into the filtrate (ultrafiltration)'],
        ['Reabsorption', 'Renal tubules', 'Nearly 99% of the filtrate is taken back — glucose, amino acids and Na+ actively; nitrogenous wastes and (in initial segments) water passively'],
        ['Tubular secretion', 'Tubular cells', 'H+, K+ and ammonia are secreted from the cells into the filtrate, to maintain ionic and acid-base balance'],
      ],
    },
    // ── 10 · Reasoning prompt — GFR / ultrafiltration check ──────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A healthy person's blood is being filtered at the glomerulus. Which one of these statements matches what NCERT actually says about this filtration step?",
      options: [
        "The glomerular filtration rate (GFR) is approximately 125 ml/minute, which works out to about 180 litres per day.",
        "Filtration is driven by the tubular cells actively pumping plasma out of the blood, one molecule at a time.",
        "Proteins pass freely into Bowman's capsule along with glucose, amino acids and salts.",
        "The kidneys filter about 1.5 litres of blood per minute, roughly 1/5th of the heart's output.",
      ],
      reveal: "The first statement is correct: GFR ≈ 125 ml/minute, i.e. about 180 litres per day. The tempting wrong one is the last — it mixes up two different numbers. About 1100–1200 ml of *blood* is filtered per minute (the ~1/5th-of-heart-output figure), while 1.5 litres is the *urine* released per day, not blood filtered per minute. The pumping option is wrong because filtration is driven by glomerular capillary blood pressure, not active pumping; and proteins are exactly the thing that does NOT pass into Bowman's capsule — that's why the step is called ultrafiltration.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Three processes** of urine formation: **glomerular filtration → reabsorption → secretion**, in different parts of the nephron.\n- **~1100–1200 ml of blood is filtered per minute** — roughly **1/5th** of what each ventricle pumps out per minute.\n- Blood crosses **3 layers**: endothelium of glomerular vessels + epithelium of Bowman's capsule + a basement membrane between them.\n- **Ultrafiltration** = almost all plasma constituents pass into Bowman's capsule **except proteins** (proteins stay in the blood).\n- **GFR ≈ 125 ml/minute = 180 litres/day.** The **JGA** regulates it; a fall in GFR makes **JG cells release renin** to push GFR back to normal.\n- **~99% of the filtrate is reabsorbed** — glucose, amino acids, Na+ **actively**; nitrogenous wastes and water (initial segments) **passively**.\n- **Secreted into the filtrate: H+, K+ and ammonia** — for ionic and acid-base balance.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Memorise the two headline numbers exactly — NEET lifts them straight from NCERT:** blood filtered ≈ **1100–1200 ml/minute** (~1/5th of ventricular output), and **GFR ≈ 125 ml/minute = 180 litres/day**. Don't let the 1.5-litre urine figure or the 180-litre filtrate figure get swapped in.\n\n**Know why it's called ultrafiltration:** everything in the plasma passes into Bowman's capsule *except proteins*. Proteins staying behind is the whole point.\n\n**JGA one-liner:** formed from cellular modifications of the **DCT + afferent arteriole**; a fall in GFR → **JG cells release renin** → GFR restored.\n\n**Classic NEET question:** \"GFR in a healthy individual is approximately ___\" → **125 ml/minute (180 litres per day)**.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You now have the three-step blueprint of urine formation — filter almost everything out, take nearly all of it back, then secrete a few extras in. But *where* along the nephron does each part of the taking-back happen? Next, you'll walk down the tubule segment by segment — the PCT, the loop of Henle, the DCT and beyond — to see which part does which job.",
    },
    // ── 14 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Urine formation involves three main processes that take place in different parts of the nephron. Which set names them correctly?",
          options: [
            "Glomerular filtration, reabsorption and secretion",
            "Filtration, digestion and excretion",
            "Ultrafiltration, respiration and reabsorption",
            "Filtration, secretion and osmoregulation",
          ],
          correct_index: 0,
          explanation: "NCERT names exactly three: glomerular filtration, reabsorption and secretion. The other options slip in unrelated body processes (digestion, respiration, osmoregulation) that are not the three steps of urine formation, so each is a partial-match trap rather than the full correct set.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In glomerular filtration, blood is filtered so finely that almost all constituents of the plasma pass into Bowman's capsule EXCEPT one. Which is held back, giving the step its name 'ultrafiltration'?",
          options: [
            "Proteins",
            "Glucose",
            "Sodium ions (Na+)",
            "Amino acids",
          ],
          correct_index: 0,
          explanation: "Almost all plasma constituents pass into the lumen of Bowman's capsule except the proteins — that's precisely why it's called ultrafiltration. Glucose, Na+ and amino acids all DO pass into the filtrate; in fact they are later reabsorbed actively by the tubules, so picking any of them reverses what NCERT states.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The glomerular filtration rate (GFR) in a healthy individual is approximately:",
          options: [
            "125 ml/minute, which is about 180 litres per day",
            "1200 ml/minute, which is about 1.5 litres per day",
            "1.5 ml/minute, which is about 125 litres per day",
            "180 ml/minute, which is about 125 litres per day",
          ],
          correct_index: 0,
          explanation: "GFR ≈ 125 ml/minute, i.e. 180 litres per day. The distractors deliberately jumble the real numbers of this chapter — 1200 ml/minute is the blood *filtered* per minute (not GFR), and 1.5 litres is the daily *urine* volume, not a filtration rate — so each wrong option is a familiar figure placed in the wrong slot.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "During tubular secretion, which substances do the tubular cells secrete into the filtrate to help maintain ionic and acid-base balance?",
          options: [
            "H+, K+ and ammonia",
            "Glucose, amino acids and Na+",
            "Proteins and nitrogenous wastes",
            "Water, HCO3– and bile",
          ],
          correct_index: 0,
          explanation: "The tubular cells secrete H+, K+ and ammonia into the filtrate, which is what maintains ionic and acid-base balance. Option 2 lists substances that are reabsorbed (taken back) actively, not secreted; proteins never even enter the filtrate; and bile has nothing to do with the nephron — so each distractor confuses secretion with a different process.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
