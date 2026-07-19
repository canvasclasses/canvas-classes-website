'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'cardiac-cycle-and-ecg',
  title: 'The Cardiac Cycle & the ECG',
  subtitle: "One heartbeat is not a single squeeze — it's a fixed 0.8-second sequence of chambers filling, contracting, and relaxing in order. Learn that order, the two sounds it makes, and how a machine draws it as the P-QRS-T trace NEET loves to quiz.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['body-fluids-and-circulation', 'cardiac-cycle', 'ecg'],
  glossary: [
    { term: 'cardiac cycle', definition: 'The sequential event in the heart that is cyclically repeated — the systole and diastole of both the atria and ventricles. At 72 beats per minute, one cardiac cycle lasts 0.8 seconds.' },
    { term: 'joint diastole', definition: 'The stage when all four heart chambers are relaxed together. The tricuspid and bicuspid valves are open and the semilunar valves are closed, so blood flows from the veins through the atria into the ventricles.' },
    { term: 'atrial systole', definition: 'The simultaneous contraction of both atria, triggered by an action potential from the SAN. It pushes about 30 per cent more blood into the ventricles.' },
    { term: 'ventricular systole', definition: 'The contraction of the ventricles (with the atria relaxed) that raises ventricular pressure, closes the tricuspid and bicuspid valves, and forces the semilunar valves open so blood leaves for the pulmonary artery and aorta.' },
    { term: 'stroke volume', definition: 'The volume of blood pumped out by each ventricle during one cardiac cycle — approximately 70 mL.' },
    { term: 'cardiac output', definition: 'Stroke volume multiplied by heart rate — the volume of blood pumped out by each ventricle per minute. It averages about 5000 mL (5 litres) in a healthy individual.' },
    { term: 'electrocardiogram (ECG)', definition: 'A graphical representation of the electrical activity of the heart during a cardiac cycle, obtained with an electro-cardiograph.' },
    { term: 'QRS complex', definition: 'The peak in an ECG that represents the depolarisation of the ventricles, which initiates ventricular contraction; the systole begins shortly after Q.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing human heart in a dark chest cavity, with a faint pulse-trace of light curving away from it into shadow',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human heart, anatomically suggested rather than fully detailed, glows softly with warm red-and-crimson inner light inside a dark chest cavity. A faint, thin ribbon of pale light curves away from it toward one edge of the frame, hinting at a heartbeat trace without becoming a literal labelled graph. Deep shadows fill the rest of the frame, with subtle warm highlights catching the surface of the heart. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Every Beat Is Exactly 0.8 Seconds Long',
      markdown: "Your heart beats about **72 times every minute**, and it never rushes any single beat to keep up. Divide one minute among 72 beats and each one takes almost exactly **0.8 seconds** — start to finish, fill to squeeze to relax. That neat little number isn't a coincidence you have to memorise blindly; it falls straight out of \"72 beats packed into 60 seconds,\" and by the end of this page you'll be able to work it out yourself.",
    },
    // ── 2 · Core concept — joint diastole, the starting state ────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with the heart completely at rest. All **four chambers are relaxed** at the same time — this state is called **joint diastole**. Because everything is relaxed, the **tricuspid and bicuspid valves are open**, so blood coming back through the **pulmonary veins** and the **vena cava** simply flows from the atria down into the ventricles below. At this stage the **semilunar valves are closed**, so nothing is leaving the heart yet — blood is just quietly filling up. This is the calm point that every heartbeat both starts from and returns to.",
    },
    // ── 3 · Heading — the cardiac cycle sequence ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Cardiac Cycle — One Beat, Step by Step',
      objective: "By the end of this you can walk through one full beat in order — atrial systole, ventricular systole, ventricular diastole — and state the stroke volume and cardiac output numbers.",
    },
    // ── 4 · Text — the systole/diastole sequence ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "From that resting fill, the **SAN** fires an **action potential** that stimulates both atria to contract together — the **atrial systole**. This squeeze pushes even more blood down into the ventricles, increasing the blood flowing in by about **30 per cent**.\n\nThe same action potential is then carried to the ventricular side by the **AVN** and **AV bundle**, from where the **bundle of His** spreads it through the entire ventricular muscle. Now the **ventricles contract** — the **ventricular systole** — while the atria relax (their diastole) at the same time. The ventricles squeezing raises the **ventricular pressure**, which slams the **tricuspid and bicuspid valves shut** (blood tries to flow backward into the atria, and the closing valves stop it). As the pressure keeps climbing, it forces the **semilunar valves open**, and blood rushes out of the ventricles into the **pulmonary artery** (right side) and the **aorta** (left side).\n\nThen the ventricles relax — the **ventricular diastole** — and ventricular pressure falls. That falling pressure lets the **semilunar valves close**, preventing blood from flowing back into the ventricles. As pressure drops further, the blood piling up in the atria pushes the **tricuspid and bicuspid valves open** again, and the ventricles refill. All four chambers are relaxed once more — back to **joint diastole** — and the SAN soon fires again to repeat the whole sequence.",
    },
    // ── 5 · Text — numbers: rate, stroke volume, cardiac output ──────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "This repeating sequence is the **cardiac cycle**, and it is made up of the systole and diastole of both the atria and the ventricles. Since the heart beats **72 times per minute**, it performs that many cardiac cycles per minute — so the **duration of one cardiac cycle is 0.8 seconds** (60 seconds ÷ 72 beats).\n\nDuring each cycle, every ventricle pumps out about **70 mL of blood**, which is called the **stroke volume**. Multiply the stroke volume by the heart rate and you get the **cardiac output** — the volume of blood pumped out by each ventricle per minute. In a healthy person this averages **5000 mL, or 5 litres**. The body can change the stroke volume and the heart rate, and so change the cardiac output: an **athlete's cardiac output is much higher** than an ordinary person's.",
    },
    // ── 6 · Heading — heart sounds ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Lub and Dub — The Two Heart Sounds',
      objective: "By the end of this you can say which valves make the first sound and which make the second — and never swap them.",
    },
    // ── 7 · Text — heart sounds ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "During each cardiac cycle the heart makes **two prominent sounds** that you can hear easily through a stethoscope. The **first heart sound**, **'lub'**, comes from the **closure of the tricuspid and bicuspid valves** (the AV valves, shutting as the ventricles begin to contract). The **second heart sound**, **'dub'**, comes from the **closure of the semilunar valves** (shutting as the ventricles relax). These two sounds are of **clinical diagnostic significance** — a doctor listening to them can pick up on problems inside the heart.",
    },
    // ── 8 · Comparison card — lub vs dub ─────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: "'Lub' vs 'Dub'",
      columns: [
        {
          heading: "First sound — 'lub'",
          points: [
            'Caused by closure of the tricuspid and bicuspid valves (the AV valves)',
            'Happens as the ventricles begin to contract (start of ventricular systole)',
            'Of clinical diagnostic significance',
          ],
        },
        {
          heading: "Second sound — 'dub'",
          points: [
            'Caused by closure of the semilunar valves',
            'Happens as the ventricles relax (ventricular diastole)',
            'Of clinical diagnostic significance',
          ],
        },
      ],
    },
    // ── 9 · Heading — the ECG ────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'The ECG — Reading the Heart as a Trace',
      objective: "By the end of this you can name what the P-wave, the QRS complex, and the T-wave each stand for, and how the trace gives the heart rate.",
    },
    // ── 10 · Text — the ECG + interactive image reference ───────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "You have probably seen the hospital-TV scene: a patient wired to a machine that draws jagged voltage traces on a screen and beeps with every beat. That machine is the **electro-cardiograph**, and the trace it produces is an **electrocardiogram (ECG)** — a **graphical representation of the electrical activity of the heart during a cardiac cycle**.\n\nTo record a standard ECG, the patient is connected to the machine with **three electrical leads** — one to each **wrist** and one to the **left ankle** — which continuously monitor the heart's activity. (For a detailed evaluation, many more leads are attached to the chest, but a standard ECG uses just these three.)\n\nEach peak in the trace is labelled with a letter from **P to T**, and each letter matches a specific electrical event in the heart. Tap through the trace below to see what each one means.",
    },
    // ── 11 · Interactive image — standard ECG trace ─────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'A standard ECG trace on a dark grid, showing one cardiac cycle with a small P-wave, a tall spiked QRS complex, and a rounded T-wave, each labelled',
      caption: '📸 Tap each dot to explore what every peak of the ECG stands for.',
      generation_prompt: "Scientific textbook illustration of a standard ECG (electrocardiogram) trace for one cardiac cycle, in the style of NCERT Figure 15.3. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single clean white waveform runs left to right across a faint dark grid: first a small rounded upward bump (the P-wave), then a short flat segment, then a tall sharp spike that dips slightly down, shoots up to a high peak, and dips down again (the Q, R and S of the QRS complex), then another flat segment, then a broad low rounded bump (the T-wave). Label each feature in white text with thin white leader lines: 'P-wave', 'QRS complex', 'T-wave'. Biologically accurate ECG shape, clean white outlines, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.55, label: 'P-wave', detail: "Represents the **electrical excitation (depolarisation) of the atria**, which leads to the contraction of both atria (atrial systole).", icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.78, label: 'Q', detail: "The small initial downward dip of the QRS complex. The **ventricular contraction (systole) begins shortly after Q**.", icon: 'circle' },
        { id: uuid(), x: 0.47, y: 0.15, label: 'R (QRS complex)', detail: "The tall peak of the **QRS complex**, which represents the **depolarisation of the ventricles** — this initiates the ventricular contraction.", icon: 'circle' },
        { id: uuid(), x: 0.54, y: 0.82, label: 'S', detail: "The downward deflection completing the QRS complex. Together, Q, R and S make up the QRS complex that fires off ventricular systole.", icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.50, label: 'T-wave', detail: "Represents the **repolarisation of the ventricles** — their return from an excited state to normal. The **end of the T-wave marks the end of systole**.", icon: 'circle' },
        { id: uuid(), x: 0.92, y: 0.62, label: 'Counting the beats', detail: "By **counting the number of QRS complexes** in a given time, you can work out the heart rate. Since a normal ECG has a roughly fixed shape, any deviation signals a possible abnormality.", icon: 'circle' },
      ],
    },
    // ── 12 · Table — ECG waves ───────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 12,
      caption: 'What each peak of a standard ECG represents',
      headers: ['Wave / peak', 'What it represents'],
      rows: [
        ['P-wave', 'Electrical excitation (depolarisation) of the atria, leading to contraction of both atria'],
        ['QRS complex', 'Depolarisation of the ventricles, which initiates ventricular contraction (systole begins shortly after Q)'],
        ['T-wave', 'Repolarisation of the ventricles — their return from excited to normal state; end of T marks the end of systole'],
      ],
    },
    // ── 13 · Reasoning prompt — QRS meaning check ────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 13, reasoning_type: 'logical',
      prompt: "A doctor points at the tall central spike on an ECG strip — the QRS complex — and asks what electrical event it represents. Which answer is correct?",
      options: [
        "Depolarisation of the ventricles, which initiates ventricular contraction",
        "Depolarisation of the atria, which leads to atrial contraction",
        "Repolarisation of the ventricles, marking the end of systole",
        "Closure of the semilunar valves, producing the second heart sound",
      ],
      reveal: "The **QRS complex represents the depolarisation of the ventricles**, and it initiates the ventricular contraction — the systole begins shortly after Q. The tempting wrong pick is 'depolarisation of the atria': that's the **P-wave**, not the QRS. 'Repolarisation of the ventricles' is the **T-wave** (the end of systole), and valve closure is a mechanical event that makes the heart *sounds* — the ECG records electrical activity, not sounds.",
      difficulty_level: 2,
    },
    // ── 14 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Cardiac cycle = 0.8 seconds** at **72 beats per minute** (60 ÷ 72 = 0.8).\n- **Stroke volume ≈ 70 mL** per ventricle per cycle.\n- **Cardiac output = stroke volume × heart rate ≈ 5000 mL (5 litres)** per minute in a healthy person (much higher in an athlete).\n- Atrial systole increases ventricular blood by about **30 per cent**.\n- **'Lub' (first sound) = closure of the tricuspid & bicuspid (AV) valves. 'Dub' (second sound) = closure of the semilunar valves.**\n- ECG waves: **P = atrial depolarisation**, **QRS = ventricular depolarisation**, **T = ventricular repolarisation** (end of T = end of systole).\n- A standard ECG uses **three leads** — one to each wrist and one to the left ankle.",
    },
    // ── 15 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Cardiac output = stroke volume × heart rate.** This exact formula, and the numbers behind it (SV ≈ 70 mL, rate 72/min, output ≈ 5 L/min), are lifted straight into NEET.\n\n**Don't mix up the ECG waves.** P = atria, QRS = ventricles (depolarisation), T = ventricles (repolarisation). The most common trap is swapping the P-wave and the QRS complex, or calling the T-wave a 'depolarisation' when it's actually **re**polarisation.\n\n**Classic NEET question:** \"The QRS complex in an ECG represents ___\" → **depolarisation of the ventricles** (which initiates ventricular contraction). And its sibling: \"Cardiac output = ___\" → **stroke volume × heart rate**.",
    },
    // ── 16 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 16,
      markdown: "You can now trace one full beat in order, put numbers on it, and read the P-QRS-T of an ECG. Next, you'll follow the blood out of the heart and around the body — the two separate loops that make up **double circulation**.",
    },
    // ── 17 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "The heart beats 72 times per minute. What is the duration of one cardiac cycle?",
          options: [
            "0.8 seconds",
            "1.2 seconds",
            "0.4 seconds",
            "72 seconds",
          ],
          correct_index: 0,
          explanation: "One minute (60 seconds) shared among 72 beats gives 60 ÷ 72 = 0.8 seconds per cardiac cycle. '1.2 seconds' and '0.4 seconds' are common miscalculations, and '72 seconds' confuses the number of beats with a duration.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which valves close to produce the first heart sound ('lub')?",
          options: [
            "The tricuspid and bicuspid (AV) valves",
            "The semilunar valves",
            "The semilunar valves of the aorta only",
            "The valves in the pulmonary veins and vena cava",
          ],
          correct_index: 0,
          explanation: "The first sound, 'lub', is the closure of the tricuspid and bicuspid valves as the ventricles start to contract. Closure of the semilunar valves makes the second sound, 'dub' — swapping these two is the classic error. The pulmonary veins and vena cava are large veins, not valve sites that produce heart sounds.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "During which phase of the cardiac cycle are the semilunar valves forced open, sending blood into the pulmonary artery and aorta?",
          options: [
            "Ventricular systole, when rising ventricular pressure pushes them open",
            "Joint diastole, when all four chambers are relaxed",
            "Atrial systole, when the atria contract",
            "Ventricular diastole, when ventricular pressure falls",
          ],
          correct_index: 0,
          explanation: "As the ventricles contract, ventricular pressure rises high enough to force the semilunar valves open and drive blood out into the pulmonary artery and aorta. In joint diastole the semilunar valves are closed; atrial systole only pushes more blood into the ventricles; and in ventricular diastole the falling pressure lets the semilunar valves close, not open.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In a standard ECG, what does the T-wave represent?",
          options: [
            "Repolarisation of the ventricles; the end of the T-wave marks the end of systole",
            "Depolarisation of the ventricles, which initiates their contraction",
            "Depolarisation of the atria, leading to atrial contraction",
            "The closure of the semilunar valves during ventricular diastole",
          ],
          correct_index: 0,
          explanation: "The T-wave is the repolarisation of the ventricles — their return from an excited to a normal state — and the end of the T-wave marks the end of systole. Depolarisation of the ventricles is the QRS complex; depolarisation of the atria is the P-wave; and valve closure is a mechanical event that produces heart sounds, not an ECG wave.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
