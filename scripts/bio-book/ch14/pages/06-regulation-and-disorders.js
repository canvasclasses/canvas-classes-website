'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'regulation-and-disorders',
  title: 'Regulation of Respiration & Respiratory Disorders',
  subtitle: "Your breathing rate is not something you choose — a tiny cluster of cells in your brainstem sets it, and it listens to carbon dioxide, not oxygen. Learn who holds the controls, and what goes wrong when the airways and alveoli break down.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['breathing-and-exchange-of-gases', 'respiratory-disorders'],
  glossary: [
    { term: 'respiratory rhythm centre', definition: 'A specialised centre in the medulla region of the brain that is primarily responsible for maintaining and moderating the respiratory rhythm.' },
    { term: 'pneumotaxic centre', definition: 'A centre in the pons region of the brain that can moderate the respiratory rhythm centre; its neural signals can reduce the duration of inspiration and so alter the respiratory rate.' },
    { term: 'chemosensitive area', definition: 'An area situated next to the respiratory rhythm centre that is highly sensitive to carbon dioxide and hydrogen ions; a rise in these activates it, and it signals the rhythm centre to adjust breathing to eliminate them.' },
    { term: 'asthma', definition: 'A difficulty in breathing that causes wheezing, due to inflammation of the bronchi and bronchioles.' },
    { term: 'emphysema', definition: 'A chronic disorder in which the alveolar walls are damaged, so the respiratory surface is decreased. A major cause is cigarette smoking.' },
    { term: 'fibrosis', definition: 'The proliferation (overgrowth) of fibrous tissue in the lungs, following long exposure to dust in industries like grinding and stone-breaking; it leads to serious lung damage.' },
    { term: 'occupational respiratory disorder', definition: 'Lung damage caused by the job — long exposure to industrial dust (e.g. grinding, stone-breaking) that the body cannot fully cope with, leading to inflammation and fibrosis.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing human brainstem suggested inside the silhouette of a head, with faint paired lungs below it, in a dim atmospheric scene',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The dim side-profile silhouette of a human head and upper chest against deep darkness. Softly glowing warm light traces a small central cluster at the base of the brain, where the brain meets the spinal cord, as if a control centre is quietly lit from within. Below, in the chest, a faint pair of lungs is suggested by soft translucent light, gently pulsing. No text, no labels, no diagram lines, no arrows. Painterly, atmospheric, naturalistic illustration, dark background throughout (#0a0a0a base tones), no people's faces in detail, no clinical look.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Breathe Faster Because of the Gas You Make, Not the One You Need',
      markdown: "Sprint up a flight of stairs and within seconds you're panting. It feels like your body is gasping for **oxygen** — but that's not what your brain is actually reacting to. The thing that makes you breathe harder is the **carbon dioxide** piling up in your blood. In NCERT's own words, the role of oxygen in regulating your breathing rhythm is **quite insignificant**. Your body chases the gas it has to get rid of, not the one it wants to take in.",
    },
    // ── 2 · Core concept — breathing is controlled, not automatic-by-accident ──
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You don't have to *decide* to breathe. It happens on its own, all day and all night. But it isn't random — human beings have a real ability to **maintain and moderate the respiratory rhythm** to suit whatever the body's tissues need at that moment. Resting on a sofa, you breathe slowly. Running for a bus, you breathe fast. Something is measuring the demand and adjusting the rate.\n\nThat 'something' is the **neural system** — your nervous system. The control does not sit in the lungs themselves; the lungs just follow orders. The orders come from the **brain**.",
    },
    // ── 3 · Heading — regulation of respiration ───────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Regulation of Respiration — Who Sets the Rhythm',
      objective: "By the end of this you can name the brain region that holds the respiratory rhythm centre, what the pneumotaxic centre does to it, and which gas the body actually monitors to adjust your breathing.",
    },
    // ── 4 · Text — the medulla rhythm centre + pons pneumotaxic centre ────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Start with the master switch. A specialised centre in the **medulla** region of the brain, called the **respiratory rhythm centre**, is **primarily responsible** for setting and holding your breathing rhythm. This is the one to remember: rhythm centre = medulla.\n\nSitting above it is a second centre in the **pons** region of the brain, the **pneumotaxic centre**. It doesn't run breathing itself — it **moderates** the rhythm centre, like a supervisor adjusting a worker. Its neural signal can **reduce the duration of inspiration** (shorten each in-breath) and, through that, **alter the respiratory rate**. Fewer, longer breaths or many shorter ones — the pons fine-tunes it.",
    },
    // ── 5 · Interactive image — brainstem respiratory control + peripheral receptors ──
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of the brainstem showing the medulla respiratory rhythm centre, the pons pneumotaxic centre, and the adjacent chemosensitive area, with peripheral receptors marked on the aortic arch and carotid artery',
      caption: '📸 Tap each dot to explore the control system that sets your breathing rhythm.',
      generation_prompt: "Scientific textbook illustration of the neural control of human respiration. Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, a simplified side view of the brainstem: the pons drawn as an upper rounded region and the medulla oblongata as the region just below it leading into the spinal cord, biologically accurate proportions, clean white outlines. On the right, a simplified outline of the heart with the aortic arch curving over the top and the carotid arteries running upward in the neck. Small distinct marked spots (no text labels baked in) for: the respiratory rhythm centre in the medulla, the pneumotaxic centre in the pons, the chemosensitive area just beside the rhythm centre, and the receptors on the aortic arch and on the carotid artery. Thin white leader lines pointing to each spot. Functional colours: pink/magenta for the nervous tissue of the brainstem, red for the aortic arch and carotid artery (blood vessels). No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.60, label: 'Respiratory rhythm centre (medulla)', detail: "The master control. Situated in the **medulla** region of the brain, this centre is **primarily responsible** for maintaining and moderating your respiratory rhythm.", icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.30, label: 'Pneumotaxic centre (pons)', detail: "Sits in the **pons** region, just above the rhythm centre. It **moderates** the rhythm centre — its signal can **reduce the duration of inspiration** and so alter the respiratory rate.", icon: 'circle' },
        { id: uuid(), x: 0.33, y: 0.58, label: 'Chemosensitive area', detail: "Situated **adjacent to** the rhythm centre. It is highly sensitive to **CO2 and hydrogen (H+) ions**; a rise in these activates it, and it signals the rhythm centre to adjust breathing so the CO2 is eliminated.", icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.35, label: 'Receptors on the aortic arch', detail: "Receptors associated with the **aortic arch** also recognise changes in **CO2 and H+** concentration and send signals to the rhythm centre for remedial action.", icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.20, label: 'Receptors on the carotid artery', detail: "Receptors on the **carotid artery** work the same way — they detect changes in **CO2 and H+** and signal the rhythm centre to correct the breathing.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.62, label: 'Oxygen — barely watched', detail: "Notice what is **not** a major sensor here: oxygen. The role of **O2** in regulating the respiratory rhythm is **quite insignificant** — the system is built to track CO2 and H+, not O2.", icon: 'circle' },
      ],
    },
    // ── 6 · Text — the chemosensitive area + peripheral receptors, CO2 not O2 ──
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Now, how does the rhythm centre know *when* to speed up? It has sensors. Right next to it sits a **chemosensitive area**, highly sensitive to **CO2 and hydrogen (H+) ions**. When these build up in the blood, this area is **activated**, and it signals the rhythm centre to make the necessary adjustments so that the extra CO2 can be **eliminated** — you breathe more, you blow off CO2.\n\nThere are back-up sensors further out too. **Receptors** on the **aortic arch** and the **carotid artery** also detect rises in **CO2 and H+** and send their own signals to the rhythm centre for remedial action. Across the whole system, one gas is conspicuously missing from the sensor list: **oxygen**. Its role in regulating the respiratory rhythm is **quite insignificant**. Your breathing is a CO2-management system, not an O2-hunting one.",
    },
    // ── 7 · Reasoning prompt — mid-page check on regulation ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A student says: 'When I climb stairs, my brain senses that oxygen is running low, so the pons speeds up my breathing.' According to NCERT, what is wrong with this statement?",
      options: [
        "Nothing is wrong — the pons directly senses oxygen and sets the breathing rate.",
        "The breathing is triggered by a rise in CO2 and H+, not by low oxygen; and the primary rhythm centre is in the medulla, with the pons only moderating it.",
        "The rhythm centre is in the pons, and it senses falling oxygen levels to speed up breathing.",
        "The chemosensitive area senses oxygen, and the aortic arch receptors sense carbon dioxide.",
      ],
      reveal: "The correct choice is the second one. Two things are wrong in the student's statement. First, the trigger: the body reacts to a rise in **CO2 and H+**, not to low oxygen — NCERT states the role of oxygen in regulating the rhythm is quite insignificant. Second, the location: the **primary** respiratory rhythm centre is in the **medulla**; the **pneumotaxic centre in the pons** only **moderates** that centre (it can shorten inspiration and alter the rate), it isn't the primary controller. The tempting wrong option puts the rhythm centre in the pons and has it sensing oxygen — both details are swapped from what NCERT actually says.",
      difficulty_level: 2,
    },
    // ── 8 · Heading — disorders of the respiratory system ─────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'When the System Breaks Down — Respiratory Disorders',
      objective: "By the end of this you can tell apart asthma, emphysema, and occupational disorders — what goes wrong in each, and the cause behind it.",
    },
    // ── 9 · Text — asthma, emphysema, occupational ────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The same airway you traced from nose to alveoli can go wrong in a few specific ways, and NCERT names three.\n\n**Asthma** is a difficulty in breathing that causes **wheezing**. The problem is **inflammation of the bronchi and bronchioles** — the swollen, narrowed airways make each breath a struggle, and the narrowed passages produce that whistling wheeze.\n\n**Emphysema** is a **chronic** disorder in which the **alveolar walls are damaged**. Remember from the exchange page that the alveoli are where gases actually cross — so damaging their walls **decreases the respiratory surface**, and there's simply less area left to exchange gases. One of the **major causes is cigarette smoking**.\n\n**Occupational respiratory disorders** come from the job itself. In certain industries — especially those with **grinding or stone-breaking** — so much **dust** is produced that the body's defence mechanism cannot fully cope. Long exposure causes **inflammation**, leading to **fibrosis** (the proliferation of fibrous tissue), and thus serious lung damage. This is why workers in such industries should wear **protective masks**.",
    },
    // ── 10 · Table — the three disorders ──────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'The three respiratory disorders NCERT names — what goes wrong, and why',
      headers: ['Disorder', 'What happens', 'Cause'],
      rows: [
        ['Asthma', 'Difficulty in breathing with wheezing; inflammation of the bronchi and bronchioles', 'Inflammation of the airways (bronchi and bronchioles)'],
        ['Emphysema', 'Alveolar walls are damaged, so the respiratory surface is decreased', 'Chronic damage — a major cause is cigarette smoking'],
        ['Occupational disorder', 'Inflammation → fibrosis (proliferation of fibrous tissue) → serious lung damage', 'Long exposure to dust (e.g. grinding, stone-breaking) that the body cannot cope with'],
      ],
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Respiratory rhythm centre → medulla.** It is primarily responsible for the breathing rhythm.\n- **Pneumotaxic centre → pons.** It only *moderates* the rhythm centre — reduces the duration of inspiration, alters the rate.\n- **Chemosensitive area** (next to the rhythm centre) senses **CO2 and H+**; a rise activates it. **Aortic arch and carotid artery receptors** also sense CO2/H+.\n- **Oxygen's role in regulating breathing is *quite insignificant*.** The body tracks CO2, not O2.\n- **Asthma** = inflammation of **bronchi and bronchioles** → wheezing.\n- **Emphysema** = **alveolar walls damaged** → less respiratory surface; major cause = **cigarette smoking**.\n- **Occupational disorder** = **dust** → inflammation → **fibrosis** → lung damage; wear **protective masks**.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Respiratory rhythm centre = medulla; pneumotaxic centre = pons.** NEET swaps these two regions constantly — if you remember nothing else, remember the rhythm centre is in the **medulla** and only the **pons** houses the pneumotaxic centre.\n\n**Oxygen is the trap.** The role of O2 in regulating the respiratory rhythm is **quite insignificant** — the sensors track **CO2 and H+**. Any option claiming O2 drives your breathing rate is wrong by NCERT's own line.\n\n**Emphysema damages the alveolar walls; cigarette smoking is the major cause.** Don't confuse it with asthma, which is inflammation of the **bronchi and bronchioles**.\n\n**Classic NEET question:** \"The respiratory rhythm centre is located in the ___\" → **medulla**. And its twin: \"Emphysema damages the ___\" → **alveolar walls** (decreasing the respiratory surface).",
    },
    // ── 13 · Closing synthesis of the whole chapter ───────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "Step back and look at the whole chapter as one connected machine. Air enters through the **airway** — nostrils, pharynx, larynx, trachea, bronchi, bronchioles — and is cleaned and warmed on the way to the alveoli. The **mechanism of breathing** pulls that air in and pushes it out, as the diaphragm and intercostal muscles change the pressure inside your chest, and the amount of air moved is measured as **respiratory volumes and capacities**. At the alveoli, **gas exchange** happens by simple diffusion down partial-pressure gradients — O2 crosses into the blood, CO2 crosses out. The blood then handles **transport of gases** — oxygen carried mostly by haemoglobin as oxyhaemoglobin, and CO2 carried mostly as bicarbonate — delivering O2 to every tissue and carrying their CO2 back. And overseeing all of it, the **neural control** in the medulla and pons quietly adjusts the rhythm, watching CO2 rather than O2, so the whole system speeds up or slows down to match exactly what your body needs. Airway, mechanism, volumes, exchange, transport, control — six pieces, one breath.",
    },
    // ── 14 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which brain region contains the respiratory rhythm centre that is primarily responsible for regulating breathing?",
          options: [
            "The medulla region of the brain",
            "The pons region of the brain",
            "The cerebellum region of the brain",
            "The carotid artery in the neck",
          ],
          correct_index: 0,
          explanation: "NCERT states the respiratory rhythm centre — the centre primarily responsible for regulation — is in the **medulla**. The pons holds the pneumotaxic centre, which only *moderates* the rhythm centre rather than being primarily responsible. The cerebellum is not named for this role, and the carotid artery carries peripheral receptors, not the rhythm centre itself.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What does the pneumotaxic centre in the pons do to breathing?",
          options: [
            "It is primarily responsible for generating the entire respiratory rhythm on its own",
            "It directly senses oxygen levels and speeds up breathing when oxygen falls",
            "It moderates the rhythm centre — its signal can reduce the duration of inspiration and alter the respiratory rate",
            "It produces the chemosensitive signals for CO2 and hydrogen ions",
          ],
          correct_index: 2,
          explanation: "The pneumotaxic centre **moderates** the respiratory rhythm centre; its neural signal can **reduce the duration of inspiration** and thereby alter the respiratory rate. It is not the primary generator of the rhythm (that is the medulla's rhythm centre). It does not sense oxygen, and the CO2/H+ sensing is done by the separate chemosensitive area and the aortic/carotid receptors.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "According to NCERT, which substances do the chemosensitive area and the aortic/carotid receptors monitor to adjust breathing?",
          options: [
            "Oxygen and nitrogen",
            "Oxygen only, since it is the gas the tissues need most",
            "Bicarbonate and haemoglobin",
            "Carbon dioxide and hydrogen ions",
          ],
          correct_index: 3,
          explanation: "Both the chemosensitive area and the receptors on the aortic arch and carotid artery detect changes in **CO2 and H+ (hydrogen ions)**, and signal the rhythm centre to respond. NCERT is explicit that the role of oxygen here is quite insignificant, so options built around oxygen are the intended trap. Bicarbonate and haemoglobin are transport molecules, not what these sensors monitor.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A chronic disorder in which the alveolar walls are damaged, decreasing the respiratory surface, and whose major cause is cigarette smoking, is:",
          options: [
            "Asthma",
            "Emphysema",
            "An occupational respiratory disorder caused by dust",
            "Fibrosis of the bronchi",
          ],
          correct_index: 1,
          explanation: "This describes **emphysema** exactly: a chronic disorder with damaged alveolar walls, a decreased respiratory surface, and cigarette smoking as a major cause. Asthma is inflammation of the bronchi and bronchioles (wheezing), not alveolar-wall damage. Occupational disorders come from long dust exposure leading to fibrosis, a different pathway — and fibrosis itself is the proliferation of fibrous tissue, not the alveolar-wall damage that defines emphysema.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
