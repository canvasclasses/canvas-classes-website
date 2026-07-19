'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'respiratory-organs',
  title: 'The Respiratory Organs & the Human Respiratory System',
  subtitle: "Different animals breathe through completely different structures — but in you, air always takes one fixed road from the nostrils down to the alveoli. Learn that road, in order, and you have the spine of this whole chapter.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['breathing-and-exchange-of-gases', 'respiratory-system'],
  glossary: [
    { term: 'breathing', definition: 'The process of exchanging O2 taken from the atmosphere with the CO2 produced by the cells; commonly called respiration.' },
    { term: 'cutaneous respiration', definition: 'Gas exchange through moist skin, as in amphibians like frogs.' },
    { term: 'pharynx', definition: 'The region after the nasal chamber; a portion of it is the common passage for both food and air.' },
    { term: 'larynx', definition: "A cartilaginous box that opens the pharynx into the trachea and helps in sound production — hence called the 'sound box'." },
    { term: 'epiglottis', definition: 'A thin elastic cartilaginous flap that covers the glottis during swallowing, preventing food from entering the larynx.' },
    { term: 'alveoli', definition: 'Very thin, irregular-walled, vascularised bag-like structures at the end of the terminal bronchioles; the actual site of gas exchange.' },
    { term: 'pleura', definition: 'The double-layered membrane covering each lung, with pleural fluid between the two layers to reduce friction on the lung surface.' },
    { term: 'conducting part', definition: 'The passage from the external nostrils up to the terminal bronchioles; it transports, clears, humidifies and warms the air but does not exchange gases.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A pair of human lungs glowing softly inside a dim chest cavity, with a single breath of pale mist being drawn in from above',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A pair of human lungs, softly and warmly lit from within, sit inside a dim, shadowed chest cavity seen in a gentle sectional cut-away. A faint ribbon of pale, cool mist — a single drawn breath — curves down from the top of the frame toward the windpipe, suggesting air entering the body. Deep shadows fill the rest of the frame, with subtle warm highlights on the branching airways. Painterly, atmospheric illustration style, naturalistic anatomy, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people's faces.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Sponge, an Earthworm and You All Solve the Same Problem',
      markdown: "Every living thing has to do the same two things without stopping: pull in **oxygen** and throw out **carbon dioxide**. But look at how differently animals manage it. A sponge just lets gases seep straight through its body surface. An earthworm breathes through its damp skin. A fish uses gills. A frog can breathe through its **moist skin** even while sitting still in a pond. Same problem, completely different hardware — and the hardware an animal ends up with depends mostly on **where it lives** and **how complex its body is**.",
    },
    // ── 2 · Core concept — what breathing is + variety across animals ─────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Your cells are constantly breaking down glucose, amino acids and fatty acids to release energy. That breakdown needs **O2**, and it produces **CO2**, which is harmful and must be thrown out. So O2 has to be supplied to the cells non-stop, and CO2 has to be removed non-stop. This exchange of **O2 from the atmosphere with the CO2 produced by the cells** is called **breathing**, commonly known as **respiration**.\n\nThe *structure* that does this exchange changes from animal to animal, depending on habitat and level of organisation. Lower invertebrates — **sponges, coelenterates, flatworms** — simply let O2 and CO2 pass across their **entire body surface by diffusion**. **Earthworms** use their **moist cuticle**. **Insects** have a network of tubes called **tracheal tubes**. Most **aquatic arthropods and molluscs** use vascularised **gills** (this is called **branchial respiration**), while **terrestrial forms** use vascularised bags called **lungs** (**pulmonary respiration**). Among vertebrates, **fishes** use gills; **amphibians, reptiles, birds and mammals** use lungs — and amphibians like the **frog** can *also* breathe through their **moist skin**, called **cutaneous respiration**.",
    },
    // ── 3 · Table — animal → respiratory structure ──────────────────────────
    {
      id: uuid(), type: 'table', order: 3,
      caption: 'How different animals breathe — match the animal group to its respiratory structure (NCERT §14.1)',
      headers: ['Animal group', 'How they exchange gases'],
      rows: [
        ['Sponges, coelenterates, flatworms', 'Simple diffusion over the entire body surface'],
        ['Earthworms', 'Moist cuticle (skin)'],
        ['Insects', 'Network of tracheal tubes'],
        ['Aquatic arthropods & molluscs', 'Gills — branchial respiration'],
        ['Fishes', 'Gills'],
        ['Terrestrial forms; amphibians, reptiles, birds, mammals', 'Lungs — pulmonary respiration'],
        ['Amphibians (e.g. frog)', 'Lungs, and also moist skin — cutaneous respiration'],
      ],
    },
    // ── 4 · Heading — the human airway ──────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'The Human Airway — One Fixed Road for Every Breath',
      objective: "By the end of this you can trace a breath of air, in the correct order, from the external nostrils all the way down to the alveoli — and say why the epiglottis matters at every swallow.",
    },
    // ── 5 · Text — the airway path ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Air always follows the same path into you. It enters through a pair of **external nostrils** sitting above the upper lips, and passes through the **nasal passage** into a **nasal chamber**. The nasal chamber opens into the **pharynx** — and here's a detail NEET loves: a portion of the pharynx is the **common passage for both food and air**.\n\nFrom the pharynx, air goes through the **larynx** into the **trachea**. The **larynx** is a **cartilaginous box** that helps produce sound, which is why it's nicknamed the **sound box**. Because food and air share the pharynx, there has to be a traffic guard: during swallowing, a thin elastic cartilaginous flap called the **epiglottis** covers the **glottis** so that **food does not enter the larynx**.\n\nThe **trachea** is a straight tube running down to the mid-thoracic cavity. At the level of the **5th thoracic vertebra**, it divides into a **right and left primary bronchi**. Each bronchus divides again and again — into **secondary** and **tertiary bronchi**, then **bronchioles**, ending in very thin **terminal bronchioles**. (The trachea, the primary/secondary/tertiary bronchi and the initial bronchioles are all held open by **incomplete cartilaginous rings**.) Each terminal bronchiole finally opens into a cluster of very thin, **irregular-walled, vascularised, bag-like** structures called **alveoli**. This whole branching network of **bronchi, bronchioles and alveoli** together makes up the **lungs**. Each of your two lungs is covered by a **double-layered pleura**, with **pleural fluid** between the layers that **reduces friction** on the lung surface as it moves.",
    },
    // ── 6 · Interactive image — human respiratory system (Figure 14.1) ───────
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'Sectional diagram of the human respiratory system showing nasal chamber, pharynx, larynx with epiglottis, trachea, bronchi, bronchioles, alveoli, pleura and the diaphragm below',
      caption: '📸 Tap each dot to walk a breath down the airway, from the nostrils to the alveoli.',
      generation_prompt: "Scientific textbook illustration of the human respiratory system in sectional (cut-away) view, matching NCERT Figure 14.1. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. Show, from top to bottom: the nasal chamber above the upper lip, the pharynx behind it, the larynx (sound box) with the small flap of the epiglottis, the straight trachea, its division into a right and left primary bronchus, repeated branching into bronchioles inside the two lungs, and a cut-away of the left lung showing pink alveoli clusters and a bronchiole. Show the double-layered pleura as thin lines around the lung and the dome-shaped diaphragm as a curved sheet below the lungs. Pink/magenta for the soft lung tissue and alveoli, pale grey-white for the cartilaginous airways, a faint red heart between the lungs. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.08, label: 'Nasal chamber', detail: 'Air enters through the paired external nostrils and passes via the nasal passage into the nasal chamber — the very start of the road.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.20, label: 'Pharynx', detail: 'The nasal chamber opens into the pharynx. A portion of it is the **common passage for both food and air** — the one crossing point on the route.', icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.28, label: 'Larynx (epiglottis)', detail: "The cartilaginous **sound box** that helps produce sound. During swallowing the **epiglottis** flap covers the glottis so food can't slip into the larynx.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.38, label: 'Trachea', detail: 'A straight tube running down to the mid-thoracic cavity, held open by incomplete cartilaginous rings. It divides at the level of the **5th thoracic vertebra**.', icon: 'circle' },
        { id: uuid(), x: 0.36, y: 0.48, label: 'Primary bronchi', detail: 'The trachea splits into a right and left primary bronchus, one entering each lung. These divide again into secondary and tertiary bronchi.', icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.58, label: 'Bronchioles', detail: 'The bronchi keep branching into finer and finer bronchioles, ending in very thin **terminal bronchioles** — the last stretch of the conducting part.', icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.66, label: 'Alveoli', detail: 'Each terminal bronchiole opens into clusters of thin, irregular-walled, vascularised **bag-like alveoli** — the actual site where O2 and CO2 diffuse.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.82, label: 'Diaphragm', detail: 'The dome-shaped muscular sheet below the lungs, forming the floor of the air-tight thoracic chamber that houses the lungs.', icon: 'circle' },
      ],
    },
    // ── 7 · Heading — conducting vs exchange part ───────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Two Jobs, Two Zones — Conducting Part vs Exchange Part',
      objective: "By the end of this you can split the whole airway into the part that only carries and prepares air, and the part that actually swaps gases — and name exactly where the boundary sits.",
    },
    // ── 8 · Text — conducting vs exchange ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "The airway does two very different jobs, so NCERT splits it into two named zones. The part starting at the **external nostrils and running up to the terminal bronchioles** is the **conducting part**. It doesn't exchange any gas — its job is to **transport** atmospheric air down to the alveoli, **clear** it of foreign particles, **humidify** it, and **warm** it to body temperature before it arrives.\n\nThe **alveoli and their ducts** form the **respiratory part**, also called the **exchange part**. This is where the real event happens: the **actual diffusion of O2 and CO2 between the blood and the atmospheric air**. So the boundary is sharp — everything from the nostrils down to the terminal bronchioles just prepares and delivers air; only at the alveoli does gas actually cross over.",
    },
    // ── 9 · Comparison card — conducting vs exchange ────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Conducting Part vs Exchange Part',
      columns: [
        { heading: 'Conducting part', points: [
          'From the external nostrils up to the terminal bronchioles',
          'Transports atmospheric air down to the alveoli',
          'Clears the air of foreign particles',
          'Humidifies the air and warms it to body temperature',
          'No gas exchange happens here',
        ] },
        { heading: 'Respiratory / exchange part', points: [
          'The alveoli and their ducts',
          'Site of the actual diffusion of O2 and CO2',
          'Exchange happens between blood and atmospheric air',
          'Walls are very thin, irregular and richly vascularised',
          'This is where breathing finally "pays off"',
        ] },
      ],
    },
    // ── 10 · Heading — thoracic chamber & the 5 steps ───────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'The Air-Tight Box and the Five Steps of Respiration',
      objective: "By the end of this you can name the four walls of the thoracic chamber and list, in order, the five steps that carry O2 from the air all the way into a cell.",
    },
    // ── 11 · Text — thoracic chamber + 5 steps ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "The lungs sit inside the **thoracic chamber**, which is anatomically an **air-tight** box — and that air-tightness is the whole trick. Its walls are: the **vertebral column** at the back (**dorsally**), the **sternum** in front (**ventrally**), the **ribs** on the sides (**laterally**), and the dome-shaped **diaphragm** underneath. Because the box is sealed, **any change in the volume of the thoracic cavity is passed straight on to the lungs**. That matters because you **cannot squeeze or expand the lungs directly** — you can only change the box around them, and the lungs follow.\n\nWith the plumbing in place, NCERT breaks the full act of **respiration** into **five steps**, in order:\n\n1. **Breathing (pulmonary ventilation)** — atmospheric air is drawn in, and CO2-rich alveolar air is pushed out.\n2. **Diffusion of gases (O2 and CO2) across the alveolar membrane.**\n3. **Transport of the gases by the blood.**\n4. **Diffusion of O2 and CO2 between the blood and the tissues.**\n5. **Utilisation of O2 by the cells** for catabolic reactions, releasing CO2 — this is cellular respiration.",
    },
    // ── 12 · Reasoning prompt — conducting vs exchange / epiglottis ─────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "A friend says: \"The whole airway from the nose to the alveoli is all one big exchange surface — O2 keeps leaking into the blood the entire way down.\" Using what NCERT actually says, which single statement correctly fixes their mistake?",
      options: [
        "No gas is exchanged until the alveoli — everything from the nostrils to the terminal bronchioles is the conducting part, which only transports, clears, humidifies and warms the air.",
        "Gas exchange starts in the trachea, because that is where the incomplete cartilaginous rings hold the tube open.",
        "Gas exchange happens all along the bronchi, and the alveoli only store air until it is needed.",
        "Exchange begins at the pharynx, since the pharynx is the common passage for both food and air.",
      ],
      reveal: "The first statement is right. NCERT draws a sharp line: the part from the external nostrils up to the terminal bronchioles is the **conducting part** and does **no** gas exchange — it only transports, clears, humidifies and warms the air. Only the **alveoli and their ducts** (the exchange part) are the site of actual O2/CO2 diffusion. The trap options attach exchange to structures that are purely conducting: the cartilaginous rings just hold the trachea open, the bronchi only carry air, and the pharynx is a shared food-and-air passage — none of them swap gases.",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Airway order (memorise the road):** external nostrils → nasal chamber → **pharynx** → **larynx** → **trachea** → **primary bronchi** → secondary → tertiary bronchi → bronchioles → **terminal bronchioles** → **alveoli**.\n- **Epiglottis** covers the glottis during swallowing so **food does not enter the larynx**. **Larynx = sound box**. Trachea divides at the **5th thoracic vertebra**.\n- **Conducting part** = nostrils → terminal bronchioles (transports, clears, humidifies, warms air; **no exchange**). **Exchange part** = **alveoli + their ducts** (actual O2/CO2 diffusion).\n- **Thoracic chamber walls:** dorsal = **vertebral column**, ventral = **sternum**, lateral = **ribs**, floor = **diaphragm** — and the box is **air-tight**.\n- **Five steps of respiration:** (1) breathing/ventilation → (2) diffusion across alveolar membrane → (3) transport by blood → (4) diffusion between blood and tissues → (5) O2 used by cells (cellular respiration).",
    },
    // ── 14 · Exam tip ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Site of actual gas exchange:** the **alveoli** — never the bronchi, bronchioles or trachea (those are all conducting part). This exact swap is a favourite trap.\n**Sound box:** the **larynx** — a cartilaginous box that helps in sound production.\n**Where the trachea divides:** at the level of the **5th thoracic vertebra**, into right and left primary bronchi.\n**Thoracic-chamber walls in one line:** dorsal vertebral column, ventral sternum, lateral ribs, floor diaphragm.\n\n**Classic NEET question:** \"The actual site of diffusion of O2 and CO2 in the respiratory system is the ___\" → **alveoli** (the exchange part), not the conducting airways.",
    },
    // ── 15 · Bridge text ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now have the full layout: the road air travels, the two zones that road is split into, the air-tight box the lungs sit in, and the five steps that carry O2 from the atmosphere into a cell. But we skipped the most physical question of all — since you can't squeeze your lungs directly, **how does air actually get pulled in and pushed out?** That's the mechanism of breathing, and it's next.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which sequence correctly traces a breath of air from outside the body down to the site of gas exchange?",
          options: [
            "External nostrils → nasal chamber → pharynx → larynx → trachea → bronchi → bronchioles → alveoli",
            "External nostrils → pharynx → nasal chamber → trachea → larynx → alveoli → bronchioles",
            "External nostrils → larynx → pharynx → nasal chamber → bronchi → trachea → alveoli",
            "External nostrils → nasal chamber → larynx → pharynx → bronchioles → trachea → alveoli",
          ],
          correct_index: 0,
          explanation: "NCERT gives one fixed order: nostrils → nasal chamber → pharynx → larynx → trachea → primary bronchi → bronchioles → alveoli. The traps all shuffle the middle: the pharynx comes after the nasal chamber (not before), and the larynx sits between the pharynx and the trachea (not after the trachea or before the pharynx).",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "During swallowing, what stops food from entering the larynx?",
          options: [
            "The glottis swells shut and blocks both the food and air passages at once",
            "A thin elastic cartilaginous flap, the epiglottis, covers the glottis",
            "The incomplete cartilaginous rings of the trachea clamp closed",
            "The pleura tightens around the larynx and seals it off",
          ],
          correct_index: 1,
          explanation: "NCERT is specific: during swallowing the glottis can be covered by a thin elastic cartilaginous flap called the epiglottis, which prevents food from entering the larynx. The cartilaginous rings only hold the trachea open, and the pleura is a membrane around the lungs — neither guards the larynx during a swallow.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which structure is the actual site of diffusion of O2 and CO2 between blood and atmospheric air?",
          options: [
            "The trachea, because it is the widest airway",
            "The terminal bronchioles, the last part of the conducting path",
            "The alveoli, which form the respiratory or exchange part",
            "The pharynx, since it is the common passage for food and air",
          ],
          correct_index: 2,
          explanation: "Only the alveoli and their ducts make up the exchange part, where O2 and CO2 actually diffuse. Everything from the nostrils down to the terminal bronchioles — including the trachea and the terminal bronchioles themselves — is the conducting part and does no exchange; the pharynx merely carries food and air.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which of these correctly describes a boundary of the air-tight thoracic chamber?",
          options: [
            "It is bounded dorsally (at the back) by the sternum and laterally by the diaphragm",
            "It is bounded ventrally by the vertebral column and on its floor by the ribs",
            "It is bounded laterally by the pleura and on its lower side by the trachea",
            "It is bounded ventrally (in front) by the sternum and on its lower side by the dome-shaped diaphragm",
          ],
          correct_index: 3,
          explanation: "NCERT lists the walls precisely: dorsal = vertebral column, ventral = sternum, lateral = ribs, floor = the dome-shaped diaphragm. Option 4 matches two of these correctly. The other options swap the sternum to the back, put the vertebral column in front, or invent walls out of the pleura and trachea — none of which are thoracic-chamber boundaries.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
