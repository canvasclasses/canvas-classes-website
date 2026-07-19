'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'regulation-and-micturition',
  title: 'Regulating Kidney Function & Micturition',
  subtitle: "Your kidneys never work at a fixed setting — three hormones (ADH, the renin-angiotensin team, and ANF) keep dialing water and blood pressure up or down, and one final voluntary signal from your brain lets the stored urine out. Learn exactly which hormone does what, because NEET tests it word-for-word.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['excretory-products-and-their-elimination', 'osmoregulation', 'micturition'],
  glossary: [
    { term: 'osmoreceptors', definition: 'Receptors in the body that are activated by changes in blood volume, body fluid volume and ionic concentration; when excessive fluid is lost they stimulate the hypothalamus to release ADH.' },
    { term: 'ADH (antidiuretic hormone / vasopressin)', definition: 'A hormone released from the neurohypophysis that facilitates water reabsorption from the later parts of the tubule (preventing diuresis) and also constricts blood vessels to raise blood pressure.' },
    { term: 'diuresis', definition: 'The loss of large amounts of water in urine. ADH prevents diuresis by pulling water back from the tubule into the blood.' },
    { term: 'renin', definition: 'An enzyme released by the JG cells of the JGA when glomerular blood flow, blood pressure or GFR falls; it converts angiotensinogen in the blood to angiotensin I.' },
    { term: 'angiotensin II', definition: 'A powerful vasoconstrictor formed from angiotensin I; it raises glomerular blood pressure and GFR, and activates the adrenal cortex to release aldosterone.' },
    { term: 'aldosterone', definition: 'A hormone released by the adrenal cortex on the signal of angiotensin II; it causes reabsorption of Na+ and water from the distal parts of the tubule, raising blood pressure and GFR.' },
    { term: 'Atrial Natriuretic Factor (ANF)', definition: 'A factor released when blood flow to the atria of the heart increases; it causes vasodilation and lowers blood pressure, acting as a check on the renin-angiotensin mechanism.' },
    { term: 'micturition', definition: 'The process of releasing stored urine from the urinary bladder. The neural mechanism causing it is called the micturition reflex.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A pair of kidneys glowing faintly in darkness, with soft threads of light reaching toward them from the brain and the heart above',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A pair of human kidneys rendered softly and semi-translucent, glowing faint amber in an otherwise deep, dark space. From above them, thin ribbons of soft light curve down toward the kidneys — suggesting silent control signals arriving from unseen organs — without any labels, arrows, or text. Warm highlights catch the edge of each kidney; the rest of the frame falls away into deep shadow. Painterly, atmospheric, naturalistic illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Drink Nothing All Day, and Your Urine Almost Vanishes',
      markdown: "On a hot day when you sweat a lot and forget to drink water, you'll notice your urine turns dark and there's barely any of it. That isn't a coincidence — it's a hormone called **ADH** working in the background. The moment your body senses it's losing too much water, ADH quietly tells your kidney tubules to grab water back before it's lost. Your kidney isn't set to one fixed speed; it's constantly being retuned by hormones, minute by minute.",
    },
    // ── 2 · Core concept — feedback regulation ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The kidneys don't run at one steady setting. Their work is **monitored and regulated by hormonal feedback mechanisms** — and three players run those mechanisms: the **hypothalamus** (in the brain), the **JGA** (the juxtaglomerular apparatus in the kidney), and, **to a certain extent, the heart**.\n\nThe word to hold onto here is **feedback**: the body senses a problem (too little water, low blood pressure), sends out a hormone to fix it, and then — once the problem is corrected — switches that hormone back off. Nothing stays switched on forever. Let's take the three regulators one at a time.",
    },
    // ── 3 · Heading — ADH & renin-angiotensin ──────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'ADH and the Renin-Angiotensin Mechanism',
      objective: "By the end of this you can trace, step by step, how the body reacts to fluid loss with ADH, and how a drop in kidney blood pressure triggers the renin-angiotensin chain all the way to aldosterone.",
    },
    // ── 4 · Text — ADH loop ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Start with fluid loss. Scattered around the body are **osmoreceptors**, and they're activated by changes in **blood volume, body fluid volume and ionic concentration**. When the body loses too much fluid, these receptors fire and **stimulate the hypothalamus to release antidiuretic hormone (ADH)** — also called **vasopressin** — from the **neurohypophysis**.\n\nWhat does ADH then do? It **facilitates water reabsorption from the later parts of the tubule**, so water is pulled back into the blood instead of being lost — this is how it **prevents diuresis** (the loss of large amounts of water). Once body fluid volume climbs back up, that rise **switches off the osmoreceptors and suppresses ADH release** — the feedback loop closes itself. ADH has a second job too: it **constricts blood vessels**, which **raises blood pressure**, and a higher blood pressure **increases glomerular blood flow and therefore the GFR**.",
    },
    // ── 5 · Interactive image — the two feedback loops ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A two-branch flow diagram: an ADH branch running osmoreceptors → hypothalamus → neurohypophysis → water reabsorption, and a renin-angiotensin branch running JGA → renin → angiotensin II → aldosterone',
      caption: '📸 Tap each dot to follow how the body reacts — the top branch is the ADH water loop, the bottom branch is the renin-angiotensin blood-pressure loop.',
      generation_prompt: "Scientific textbook illustration of the hormonal regulation of kidney function as a two-branch flow diagram. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines and thin white leader lines, labels in white text. TOP BRANCH (ADH water loop, left to right): a small cluster of osmoreceptors → an outline of the brain's hypothalamus → the neurohypophysis releasing ADH → a kidney tubule segment showing water droplets moving back into a blood vessel (blue for water, red for blood). BOTTOM BRANCH (renin-angiotensin loop, left to right): the juxtaglomerular apparatus (JGA) on a glomerulus → renin → a labelled arrow chain angiotensinogen to angiotensin I to angiotensin II → a constricting blood vessel, plus a branch to the adrenal cortex releasing aldosterone acting on the distal tubule (Na+ and water arrows). Biologically accurate proportions, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.09, y: 0.30, label: 'Osmoreceptors', detail: "Activated by changes in blood volume, body fluid volume and ionic concentration. An excessive loss of fluid sets them off — and a later rise in body fluid volume switches them back off.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.22, label: 'Hypothalamus → ADH', detail: "The fired osmoreceptors stimulate the hypothalamus to release **ADH (vasopressin)** from the **neurohypophysis**.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.28, label: 'Water reabsorption', detail: "ADH facilitates **water reabsorption from the later parts of the tubule**, preventing diuresis. ADH also constricts blood vessels → raises blood pressure → raises GFR.", icon: 'circle' },
        { id: uuid(), x: 0.12, y: 0.74, label: 'JGA releases renin', detail: "A fall in glomerular blood flow / blood pressure / GFR activates the **JG cells to release renin**, which converts **angiotensinogen → angiotensin I**.", icon: 'circle' },
        { id: uuid(), x: 0.48, y: 0.72, label: 'Angiotensin II', detail: "Formed from angiotensin I, it is a **powerful vasoconstrictor** — it raises glomerular blood pressure and GFR, and signals the adrenal cortex.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.72, label: 'Aldosterone', detail: "Released by the **adrenal cortex** on the angiotensin II signal. It causes reabsorption of **Na+ and water** from the distal tubule → raises blood pressure and GFR.", icon: 'circle' },
      ],
    },
    // ── 6 · Text — renin-angiotensin + ANF ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Now the second regulator, and it starts inside the kidney. When **glomerular blood flow, glomerular blood pressure, or GFR falls**, the **JG cells release renin**. Renin converts **angiotensinogen** in the blood to **angiotensin I**, and that is converted further to **angiotensin II**.\n\n**Angiotensin II** is the key molecule. It's a **powerful vasoconstrictor**, so it squeezes blood vessels and **raises glomerular blood pressure and GFR**. It also **activates the adrenal cortex to release aldosterone**, and **aldosterone causes reabsorption of Na+ and water from the distal parts of the tubule** — which raises blood pressure and GFR as well. This whole chain is the **Renin-Angiotensin mechanism**.\n\nThe third regulator is the body's brake. When **blood flow to the atria of the heart increases**, the atria release **Atrial Natriuretic Factor (ANF)**. ANF causes **vasodilation** — it widens blood vessels — which **decreases blood pressure**. So ANF works in the opposite direction to the renin-angiotensin chain, and that's exactly its role: it **acts as a check on the renin-angiotensin mechanism**.",
    },
    // ── 7 · Comparison card — the three regulators ─────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 7,
      title: 'The Three Hormonal Regulators, Side by Side',
      columns: [
        {
          heading: 'ADH (vasopressin)',
          points: [
            'Trigger: osmoreceptors fire on fluid loss → hypothalamus → released from neurohypophysis',
            'Main action: water reabsorption from the later tubule → prevents diuresis',
            'Also constricts blood vessels → raises blood pressure → raises GFR',
            'Switched off when body fluid volume rises again',
          ],
        },
        {
          heading: 'Renin-Angiotensin-Aldosterone',
          points: [
            'Trigger: fall in glomerular blood flow / blood pressure / GFR → JG cells release renin',
            'renin: angiotensinogen → angiotensin I → angiotensin II',
            'Angiotensin II = powerful vasoconstrictor → raises blood pressure & GFR',
            'Angiotensin II → adrenal cortex → aldosterone → Na+ and water reabsorption (distal tubule)',
          ],
        },
        {
          heading: 'ANF (Atrial Natriuretic Factor)',
          points: [
            'Trigger: increased blood flow to the atria of the heart',
            'Main action: vasodilation (widens blood vessels)',
            'Effect: decreases blood pressure',
            'Role: a check that opposes the renin-angiotensin mechanism',
          ],
        },
      ],
    },
    // ── 8 · Heading — Micturition ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Micturition — The Voluntary Release of Urine',
      objective: "By the end of this you can describe the micturition reflex step by step — from a full, stretched bladder to the moment urine is released — and quote the standard daily numbers NEET expects.",
    },
    // ── 9 · Text — micturition ─────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The urine made by the nephrons is carried to the **urinary bladder**, and it's **stored there until a voluntary signal is given by the central nervous system (CNS)**. That's the important part — the release is *voluntary*, under conscious control.\n\nHere's the sequence. As the bladder fills with urine, its wall gets **stretched**. This stretching activates the **stretch receptors on the walls of the bladder**, which **send signals to the CNS**. The CNS then **passes motor messages back** that do two things at once: they **contract the smooth muscles of the bladder** and **relax the urethral sphincter**. With the muscle squeezing and the gate open, urine is released. This release is called **micturition**, and the neural mechanism behind it is the **micturition reflex**.\n\nSome numbers to lock in: an adult human excretes, on average, **1 to 1.5 litres of urine per day**. The urine is a **light yellow, watery fluid**, **slightly acidic (pH ~6.0)**, with a **characteristic odour**, and it carries out about **25–30 g of urea per day**. Because urine reflects what's happening inside, analysing it helps diagnose disorders: for example, the presence of **glucose (glycosuria)** and **ketone bodies (ketonuria)** in urine are indicative of **diabetes mellitus**.",
    },
    // ── 10 · Reasoning prompt — ADH function check ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A person loses a large amount of fluid through heavy sweating, and their osmoreceptors fire. Following the feedback loop exactly as NCERT describes it, what does the hormone that gets released do?",
      options: [
        "It facilitates water reabsorption from the later parts of the tubule, preventing diuresis",
        "It causes vasodilation, widening blood vessels to lower the blood pressure",
        "It triggers the adrenal cortex to release aldosterone, reabsorbing Na+ and water",
        "It converts angiotensinogen in the blood into angiotensin I",
      ],
      reveal: "Option 1 is right. Fluid loss activates the osmoreceptors, which stimulate the hypothalamus to release ADH from the neurohypophysis — and ADH's main action is to facilitate water reabsorption from the later parts of the tubule, preventing diuresis. Option 2 is the job of ANF (vasodilation, lowering blood pressure), a completely different regulator that opposes water-retention responses. Option 3 belongs to angiotensin II, and option 4 to renin — both part of the renin-angiotensin chain, which is triggered by a fall in glomerular blood pressure, not by osmoreceptors firing on fluid loss.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ──────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Kidney function is regulated by hormonal feedback** involving the **hypothalamus, JGA, and (to some extent) the heart**.\n- **ADH (vasopressin)** — released from the **neurohypophysis** → **water reabsorption** from the later tubule → prevents **diuresis**; also constricts vessels → raises BP and GFR.\n- **Renin → angiotensin I → angiotensin II**. **Angiotensin II** = powerful **vasoconstrictor** → raises BP & GFR → triggers **aldosterone** (adrenal cortex) → **Na+ and water** reabsorption from the distal tubule.\n- **ANF** = **vasodilation**, lowers blood pressure; acts as a **check on the renin-angiotensin mechanism**.\n- **Micturition reflex:** bladder fills → stretched wall → **stretch receptors → CNS** → **bladder smooth muscle contracts + urethral sphincter relaxes** → urine released.\n- Numbers: **1–1.5 L urine/day**, pH **~6.0**, **25–30 g urea/day**. **Glycosuria** (glucose) and **ketonuria** (ketone bodies) → **diabetes mellitus**.",
    },
    // ── 12 · Exam tip ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**ADH:** promotes **water reabsorption** from the later parts of the tubule (prevents diuresis) — the single most-tested fact on this page.\n\n**Angiotensin II vs ANF — opposite effects:** angiotensin II is a **vasoconstrictor** that *raises* blood pressure; **ANF** causes **vasodilation** that *lowers* it and checks the renin-angiotensin mechanism. NEET loves to swap these two.\n\n**Aldosterone** comes from the **adrenal cortex** (on angiotensin II's signal) and reabsorbs **Na+ and water** — don't confuse its source with the JGA.\n\n**Classic NEET question:** \"Presence of glucose in urine is called ___\" → **Glycosuria** (and ketone bodies in urine → **ketonuria**), both indicative of **diabetes mellitus**.",
    },
    // ── 13 · Bridge text ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You can now trace all three hormonal loops that keep the kidney tuned, and describe the micturition reflex from stretched bladder to released urine. Next, you'll see that the kidneys aren't the only organs that help the body get rid of wastes — and what goes wrong when the kidneys themselves fail.",
    },
    // ── 14 · Inline quiz (LAST) ────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which set of structures monitors and regulates the functioning of the kidneys through hormonal feedback?",
          options: [
            "The hypothalamus, the JGA, and — to a certain extent — the heart",
            "The urinary bladder, the urethral sphincter, and the stretch receptors",
            "The adrenal cortex, the neurohypophysis, and the ureters",
            "The glomerulus, the loop of Henle, and the collecting duct only",
          ],
          correct_index: 0,
          explanation: "NCERT states the kidneys are regulated by hormonal feedback mechanisms involving the hypothalamus, the JGA, and to a certain extent the heart. The bladder and sphincter (option 2) belong to micturition, not to hormonal regulation; the structures in options 3 and 4 are involved in the pathways but are not named as the three regulating centres.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What is the main action of ADH (vasopressin) on the kidney tubule?",
          options: [
            "It causes reabsorption of Na+ from the distal tubule after being released by the adrenal cortex",
            "It facilitates water reabsorption from the later parts of the tubule, thereby preventing diuresis",
            "It causes vasodilation of blood vessels, lowering the blood pressure and the GFR",
            "It converts angiotensinogen in the blood into angiotensin I",
          ],
          correct_index: 1,
          explanation: "ADH, released from the neurohypophysis, facilitates water reabsorption from the later parts of the tubule and so prevents diuresis. Option 1 describes aldosterone (Na+ and water, from the adrenal cortex); option 3 describes ANF (vasodilation, lowering BP); option 4 describes renin. Each of these belongs to a different regulator.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Angiotensin II and Atrial Natriuretic Factor (ANF) affect blood pressure in opposite ways. Which pairing is correct?",
          options: [
            "Angiotensin II causes vasodilation and lowers BP; ANF causes vasoconstriction and raises BP",
            "Both angiotensin II and ANF are vasoconstrictors that raise blood pressure",
            "Angiotensin II is a vasoconstrictor that raises BP and GFR; ANF causes vasodilation that lowers BP and checks the renin-angiotensin mechanism",
            "Angiotensin II relaxes the urethral sphincter; ANF contracts the bladder wall",
          ],
          correct_index: 2,
          explanation: "Angiotensin II is a powerful vasoconstrictor that raises glomerular blood pressure and GFR, while ANF causes vasodilation, lowers blood pressure, and acts as a check on the renin-angiotensin mechanism — genuinely opposite effects. Option 1 reverses the two, option 2 wrongly makes both raise BP, and option 4 confuses these hormones with the micturition reflex.",
          difficulty_level: 3,
        },
        {
          id: uuid(),
          question: "During micturition, what two events happen simultaneously once the CNS sends its motor messages?",
          options: [
            "The bladder smooth muscles contract and the urethral sphincter relaxes",
            "The bladder smooth muscles relax and the urethral sphincter contracts",
            "The stretch receptors contract and the osmoreceptors relax",
            "The adrenal cortex releases aldosterone and the neurohypophysis releases ADH",
          ],
          correct_index: 0,
          explanation: "The CNS sends motor messages that contract the smooth muscles of the bladder and simultaneously relax the urethral sphincter, releasing the urine — this release is micturition. Option 2 reverses both actions. Option 3 confuses receptors with muscles, and option 4 describes hormonal regulation, not the micturition reflex.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
