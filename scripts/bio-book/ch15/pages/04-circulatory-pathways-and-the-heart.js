'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'circulatory-pathways-and-the-heart',
  title: 'Circulatory Pathways & the Human Heart',
  subtitle: "Some animals let their blood slosh loose in body cavities; others keep it locked inside pipes. Follow that split up the vertebrate ladder — 2 chambers to 4 — and then open up the human heart itself, right down to the tiny patch of muscle that fires 72 times a minute on its own.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['body-fluids-and-circulation', 'heart'],
  glossary: [
    { term: 'open circulatory system', definition: 'A circulatory pattern (in arthropods and molluscs) in which blood pumped by the heart passes through large vessels into open spaces or body cavities called sinuses.' },
    { term: 'closed circulatory system', definition: "A circulatory pattern (in annelids and chordates) in which blood pumped by the heart is always kept inside a closed network of blood vessels. It is more advantageous because the flow of fluid can be more precisely regulated." },
    { term: 'single circulation', definition: 'The circulation in fishes: the heart pumps out deoxygenated blood, which is oxygenated by the gills, supplied to the body, and returned deoxygenated to the heart — one loop.' },
    { term: 'incomplete double circulation', definition: 'The circulation in amphibians and reptiles: oxygenated and deoxygenated blood both reach the heart but get mixed up in the single ventricle, which pumps out mixed blood.' },
    { term: 'double circulation', definition: 'The circulation in birds and mammals: oxygenated and deoxygenated blood pass to the ventricles of the same sides and are pumped out without any mixing — two separate circulatory pathways.' },
    { term: 'pericardium', definition: 'The double-walled membranous bag that protects the heart, enclosing the pericardial fluid.' },
    { term: 'nodal tissue', definition: 'A specialised cardiac musculature distributed in the heart (the SAN, AVN, AV bundle and Purkinje fibres) that is autoexcitable — it generates action potentials without any external stimuli.' },
    { term: 'pacemaker', definition: 'The sino-atrial node (SAN), which generates the maximum number of action potentials (70–75 per minute) and is responsible for initiating and maintaining the rhythmic contraction of the heart.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dramatic dark banner of a human heart at the centre of the chest, faint vessels branching outward into darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human heart, the size of a clenched fist, glows softly at the centre of a dark chest cavity nestled between two dim lung shapes, tilted slightly to the left. Faint red and blue vessel branches trail outward into deep shadow on either side, suggesting circulation without becoming a literal labelled diagram. Warm reddish highlights on the muscular heart, cool bluish tones in the surrounding darkness. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram callouts, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Your Heart Beats Without Being Told To',
      markdown: "Right now, roughly **72 times every minute**, your heart squeezes — and not one of those beats needed a signal from your brain to start. A tiny patch of special muscle in the top-right corner of your heart fires the beat entirely on its own, over and over, for your whole life. Cut the heart off from every nerve and it would still keep its rhythm. By the end of this page you'll know exactly which patch of muscle does this, and why doctors call it the **pacemaker**.",
    },
    // ── 2 · Core concept — open vs closed circulation ────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Animals move blood around in one of two patterns. In an **open circulatory system**, the heart pumps blood into large vessels that empty it out into open spaces — the body cavities themselves, called **sinuses**. The blood just bathes the organs directly and slowly drains back. This is the plan in **arthropods** (insects, crabs) and **molluscs** (snails, clams).\n\nIn a **closed circulatory system**, the blood never leaves its plumbing. The heart pumps it, and it stays **inside a closed network of blood vessels** the whole time, from the heart to the tissues and back. This is the plan in **annelids** (earthworms) and **chordates** (which includes us). A closed system is considered **more advantageous**, for one clear reason: when the fluid is kept inside pipes, its **flow can be more precisely regulated** — you can send more to the muscles you're using and less to the ones you aren't. In an open system, sloshing through cavities, you get nothing like that control.",
    },
    // ── 3 · Heading — heart chambers across vertebrates ──────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Heart Evolution Across Vertebrates: 2, 3, and 4 Chambers',
      objective: "By the end of this you can name how many chambers each vertebrate group has, and match it to its type of circulation — single, incomplete double, or double.",
    },
    // ── 4 · Text — chambers + circulation, leading into the table ────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Every vertebrate has a **muscular chambered heart**, but the number of chambers climbs as you move up the group.\n\n**Fishes** have a **2-chambered heart** — one **atrium** and one **ventricle**. Their heart pumps out **deoxygenated** blood, which the **gills** oxygenate, then send to the body; the body returns deoxygenated blood to the heart. Blood makes one full loop per trip, so this is **single circulation**.\n\n**Amphibians** (frogs) and **reptiles** — with one exception, **crocodiles** — have a **3-chambered heart**: **two atria** but only **a single ventricle**. The left atrium takes in oxygenated blood, the right atrium takes in deoxygenated blood — but because there's only one ventricle, the two **get mixed up** there before being pumped out. Mixed blood goes to the body, so this is called **incomplete double circulation**.\n\n**Crocodiles, birds and mammals** have a fully **4-chambered heart** — **two atria and two ventricles**. Oxygenated and deoxygenated blood reach the left and right atria, pass to the ventricles of the **same** side, and get pumped out with **no mixing at all**. Two completely separate pathways exist, so this is true **double circulation**.",
    },
    // ── 5 · Table — vertebrate chambers & circulation ────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'Heart chambers and circulation type across the vertebrate groups',
      headers: ['Group', 'Chambers', 'Circulation'],
      rows: [
        ['Fishes', '2 (1 atrium + 1 ventricle)', 'Single circulation — deoxygenated blood pumped to gills, then to body'],
        ['Amphibians & reptiles (except crocodiles)', '3 (2 atria + 1 ventricle)', 'Incomplete double — blood mixes in the single ventricle'],
        ['Crocodiles, birds & mammals', '4 (2 atria + 2 ventricles)', 'Double circulation — no mixing, two separate pathways'],
      ],
    },
    // ── 6 · Heading — the human heart ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Human Heart: Chambers, Septa and Valves',
      objective: "By the end of this you can locate all four chambers, name the three septa that wall them off, and say which valve guards which opening and which way blood is allowed to move.",
    },
    // ── 7 · Text — human heart anatomy, into interactive image ───────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The human heart is **mesodermally derived** — it develops from the middle germ layer. It sits in the **thoracic cavity, between the two lungs, tilted slightly to the left**, and is about the **size of your clenched fist**. Around it is a protective **double-walled membranous bag, the pericardium**, which holds a lubricating **pericardial fluid** so the beating heart doesn't rub against the chest.\n\nInside are **four chambers**: **two smaller upper chambers, the atria**, and **two larger lower chambers, the ventricles**. Three walls, called septa, keep them separated:\n- the **inter-atrial septum** — a thin, muscular wall between the right and left atria,\n- the **inter-ventricular septum** — a thick-walled partition between the left and right ventricles,\n- the **atrio-ventricular septum** — a thick fibrous tissue separating the atrium and the ventricle of the same side.\n\nEach septum has an **opening** so the two chambers on the same side stay connected, and every opening is guarded by a **valve**. The right atrium–right ventricle opening is guarded by the **tricuspid valve** (three muscular flaps, or cusps). The left atrium–left ventricle opening is guarded by the **bicuspid or mitral valve**. Where the ventricles open into the **pulmonary artery** and the **aorta**, there are the **semilunar valves**. Every valve does one job: it **allows blood to flow in only one direction** — atria to ventricles, ventricles to the great arteries — and **prevents any backward flow**. Note also that the **walls of the ventricles are much thicker than those of the atria**, because they do the harder pumping.",
    },
    // ── 8 · Interactive image — section of the human heart (Figure 15.2) ─────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Front-section diagram of the human heart showing the four chambers, the three septa, the four valves, and the nodal tissue',
      caption: '📸 Tap each dot to explore the chambers, septa, valves and nodal tissue of the human heart.',
      generation_prompt: "Scientific textbook illustration of a sectioned (cutaway) human heart, front view, in the style of NCERT Figure 15.2. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. Show all four chambers: the two upper atria (smaller) and two lower ventricles (larger, with visibly thicker muscular walls). Show the inter-atrial septum between the atria, the thick inter-ventricular septum between the ventricles, and the atrio-ventricular septa. Show the tricuspid valve between the right atrium and right ventricle (three cusps), the bicuspid/mitral valve between the left atrium and left ventricle, and the semilunar valves at the roots of the pulmonary artery and aorta. Indicate the nodal tissue: a small patch (sino-atrial node) in the upper-right corner of the right atrium, and another mass (atrio-ventricular node) in the lower-left of the right atrium, with the AV bundle and Purkinje fibres branching through the ventricular walls. Colour convention: red for oxygenated/left-side blood, blue for deoxygenated/right-side blood, pale pink for muscle tissue. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.30, label: 'Right atrium', detail: 'One of the two smaller upper chambers. It receives deoxygenated blood returning from the body. The **sino-atrial node** and **atrio-ventricular node** both sit within its wall.', icon: 'circle' },
        { id: uuid(), x: 0.68, y: 0.30, label: 'Left atrium', detail: 'The other upper chamber. It receives oxygenated blood from the lungs and passes it, through the bicuspid valve, into the left ventricle.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.66, label: 'Right ventricle', detail: 'A larger lower chamber with a thick muscular wall. It pumps deoxygenated blood out into the pulmonary artery through a semilunar valve.', icon: 'circle' },
        { id: uuid(), x: 0.68, y: 0.66, label: 'Left ventricle', detail: 'The lower chamber whose wall is thickest of all — it pumps oxygenated blood out into the aorta through a semilunar valve. Ventricle walls are much thicker than atrial walls.', icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.47, label: 'Tricuspid valve', detail: 'Guards the opening between the **right** atrium and the **right** ventricle. It is formed of **three** muscular flaps or cusps, and allows blood to flow only one way — atrium to ventricle.', icon: 'circle' },
        { id: uuid(), x: 0.60, y: 0.47, label: 'Bicuspid (mitral) valve', detail: 'Guards the opening between the **left** atrium and the **left** ventricle. Like all heart valves, it permits one-way flow only and prevents backward flow.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.15, label: 'Semilunar valves', detail: 'Sit where the right and left ventricles open into the **pulmonary artery** and the **aorta** respectively. They stop blood from flowing back into the ventricles.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.62, label: 'Inter-ventricular septum', detail: 'The thick-walled partition separating the left and right ventricles, so oxygenated and deoxygenated blood never mix. The AV bundle emerges on top of it and divides into right and left bundles.', icon: 'circle' },
      ],
    },
    // ── 9 · Heading — nodal system & pacemaker ───────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'The Nodal System & the Pacemaker',
      objective: "By the end of this you can trace the path of the heartbeat's electrical signal from SAN to Purkinje fibres, and explain why the SAN sets the rhythm.",
    },
    // ── 10 · Text — nodal tissue, autoexcitable, pacemaker ───────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "The whole heart is made of **cardiac muscle**, but scattered within it is a special **nodal tissue** — a specialised cardiac musculature that carries the signal for each beat. It comes in a definite sequence:\n\n- A patch called the **sino-atrial node (SAN)** sits in the **right upper corner of the right atrium**.\n- Another mass, the **atrio-ventricular node (AVN)**, sits in the **lower left corner of the right atrium**, close to the atrio-ventricular septum.\n- From the AVN, a bundle of nodal fibres — the **atrio-ventricular bundle (AV bundle)** — passes through the atrio-ventricular septum, emerges on top of the inter-ventricular septum, and immediately **divides into a right and a left bundle**.\n- These branches give off minute fibres running throughout the ventricular muscle of each side, called the **Purkinje fibres**.\n\nSo the signal's path is: **SAN → AVN → AV bundle → right & left bundles → Purkinje fibres.**\n\nHere's the special part: the nodal muscle can **generate action potentials without any external stimuli** — it is **autoexcitable**. Different parts fire at different rates, but the **SAN generates the maximum number of action potentials, about 70–75 per minute**, so it sets the pace for everyone else and is responsible for **initiating and maintaining the rhythmic contraction of the heart**. That is exactly why the SAN is called the **pacemaker**. It's why a normal heart beats **70–75 times a minute (average 72 beats per minute)**.",
    },
    // ── 11 · Reasoning prompt — pacemaker / mixing check ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A student is asked to name the structure that fires first and sets the rhythm of every heartbeat. Which of these is the correct answer — and the reason it beats the others?",
      options: [
        "The atrio-ventricular node (AVN), because it lies closest to the atrio-ventricular septum",
        "The sino-atrial node (SAN), because it generates the maximum number of action potentials (70–75 per minute)",
        "The AV bundle, because it carries the signal into both ventricles through the Purkinje fibres",
        "The Purkinje fibres, because they spread throughout the ventricular muscle where contraction actually happens",
      ],
      reveal: "The answer is the **SAN**. Although every part of the nodal tissue is autoexcitable, the SAN generates the *most* action potentials per minute (70–75), so it fires first and forces the rest of the system to follow its rhythm — that is precisely why it is called the pacemaker. The AVN, AV bundle and Purkinje fibres do carry and spread the signal, but they receive it *after* the SAN has already set the tempo; none of them is the one that initiates the beat.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Open circulation** (arthropods, molluscs): blood empties into open sinuses. **Closed circulation** (annelids, chordates): blood stays inside vessels — more advantageous because flow is precisely regulated.\n- **Chambers by group:** fishes → **2** (single circulation); amphibians & reptiles *except crocodiles* → **3** (incomplete double, blood mixes in the one ventricle); crocodiles, birds & mammals → **4** (double, no mixing).\n- **Valves:** **tricuspid** guards the **right** atrium→ventricle opening (3 cusps); **bicuspid/mitral** guards the **left** atrium→ventricle opening; **semilunar** valves guard the ventricle→pulmonary artery/aorta openings. All allow **one-way flow only**.\n- **Three septa:** inter-atrial (between atria), inter-ventricular (between ventricles), atrio-ventricular (between atrium and ventricle of the same side).\n- **Nodal path:** **SAN → AVN → AV bundle → right & left bundles → Purkinje fibres.** All of it is **autoexcitable**.\n- **SAN = pacemaker**, generates **70–75 action potentials/min**; heart normally beats **70–75/min (avg 72)**.",
    },
    // ── 13 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The crocodile is the classic trap:** reptiles have a 3-chambered heart — *except crocodiles*, which have 4 chambers like birds and mammals. NEET loves to test this exception.\n\n**Don't swap the valves:** **tri**cuspid is on the **right** (three cusps), **bi**cuspid/mitral is on the **left**. A common memory hook — 'LAB': **L**eft **A**trium has the **B**icuspid.\n\n**Autoexcitable means no external stimulus needed** — the nodal tissue fires on its own, and the SAN fires fastest, which is the whole reason it is the pacemaker.\n\n**Classic NEET question:** \"The pacemaker of the human heart is the ___\" → the **sino-atrial node (SAN)**, located in the right upper corner of the right atrium, generating 70–75 action potentials per minute.",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now know the pathways, the chambers, the valves that force blood one way, and the nodal system that fires each beat. Next you'll watch that beat play out in real time — the **cardiac cycle**, and the electrical trace it leaves behind on an **ECG**.",
    },
    // ── 15 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which set of animals has an open circulatory system, and what defines it?",
          options: [
            "Annelids and chordates — blood is kept inside a closed network of vessels the whole time",
            "Arthropods and molluscs — blood is pumped into open spaces called sinuses that bathe the organs directly",
            "Amphibians and reptiles — blood mixes inside a single ventricle before being pumped out",
            "Birds and mammals — blood follows two completely separate circulatory pathways",
          ],
          correct_index: 1,
          explanation: "Open circulation is found in arthropods and molluscs: blood is pumped through large vessels into open body cavities, the sinuses. Option 1 describes the closed system of annelids and chordates. Options 3 and 4 describe types of circulation (incomplete double and double), not the open-versus-closed distinction.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A 3-chambered heart with two atria and a single ventricle, in which oxygenated and deoxygenated blood mix, is found in:",
          options: [
            "Fishes, which have single circulation",
            "Amphibians and all reptiles, including crocodiles",
            "Amphibians and reptiles except crocodiles, which show incomplete double circulation",
            "Birds and mammals, which show double circulation",
          ],
          correct_index: 2,
          explanation: "Amphibians and reptiles — but not crocodiles — have a 3-chambered heart (2 atria, 1 ventricle), and the single ventricle mixes the blood, giving incomplete double circulation. Option 2 is the classic error: crocodiles are the reptile exception with a 4-chambered heart. Fishes are 2-chambered (single circulation), and birds and mammals are 4-chambered (double circulation).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The bicuspid (mitral) valve guards the opening between which two chambers?",
          options: [
            "The right atrium and the right ventricle",
            "The left atrium and the left ventricle",
            "The left ventricle and the aorta",
            "The right ventricle and the pulmonary artery",
          ],
          correct_index: 1,
          explanation: "The bicuspid or mitral valve guards the left atrium–left ventricle opening. Option 1 is the tricuspid valve (right side). Options 3 and 4 describe where the semilunar valves sit, at the openings of the ventricles into the aorta and pulmonary artery.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Why is the sino-atrial node (SAN) called the pacemaker of the heart?",
          options: [
            "It is the only part of the heart that is autoexcitable, so no other tissue can generate a beat",
            "It lies on top of the inter-ventricular septum and divides into the right and left bundles",
            "It generates the maximum number of action potentials (70–75 per minute), so it initiates and maintains the heart's rhythm",
            "It carries the signal last, delivering it to the ventricular muscle through the Purkinje fibres",
          ],
          correct_index: 2,
          explanation: "All of the nodal tissue is autoexcitable, but the SAN generates the most action potentials per minute (70–75), so it sets the rhythm the rest of the heart follows — that is the definition of the pacemaker. Option 1 is wrong because the SAN is not the only autoexcitable tissue, just the fastest. Option 2 describes the AV bundle, and option 4 describes the Purkinje fibres.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
