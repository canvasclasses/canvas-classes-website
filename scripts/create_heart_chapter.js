'use strict';
/**
 * Adds Chapter 2 "The Heart & Circulation" to the Anatomy & Physiology book:
 * opener + 5 lessons embedding the heart-3d sim. PURELY ADDITIVE. Unpublished.
 * Voice: simple, plain, global-classroom English (everyday word first, technical
 * term in brackets). Every lesson: hero + hook + concept + sim/gallery + a mid-page
 * reasoning check + a §3.6.1 quiz (answer positions spread). Images src:""+prompts;
 * gallery panel prompts in an IMAGE_GENERATION_PROMPTS comment above each gallery.
 */
const { computeReadingTime, computeContentTypes, withDb } = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'anatomy-physiology';
const CH = { number: 2, title: 'The Heart & Circulation', slug: 'heart-and-circulation',
  description: 'The pump that never rests — chambers, valves, the double circulation and the blood vessels, explored in 3D.' };

const u = () => uuidv4();
const blk = (type, order, extra) => ({ id: u(), type, order, ...extra });
const gi = (alt, caption) => ({ id: u(), src: '', alt, caption });

// ───────── opener ─────────
const opener = [
  blk('image', 0, { src: '', alt: 'A human heart glowing warm against a dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A realistic human heart, warm red ' +
      'muscle catching dramatic side light, the great vessels rising from the top, set against a deep ' +
      'near-black background. Conveys a tireless, powerful pump at the centre of the body. ' +
      'Photorealistic medical-illustration style. No text.' }),
  blk('text', 1, { markdown:
    'Right now, without you thinking about it, a muscle the size of your fist is squeezing about ' +
    '**once every second** — and it has never taken a single break since before you were born. Your ' +
    '**heart** pushes blood to every corner of your body, so each tiny cell gets the oxygen and food ' +
    'it needs and its waste is carried away.\n\n' +
    'In this chapter we’ll open the heart in 3D, walk through its four rooms and its one-way valves, ' +
    'follow a single drop of blood on its journey, and meet the three kinds of blood vessels.' }),
  blk('text', 2, { markdown:
    '**What you’ll explore in this chapter**\n\n' +
    '- What the heart is and what it does\n' +
    '- The **four chambers** and why the two sides never mix\n' +
    '- The **valves** that keep blood moving one way only\n' +
    '- **Follow a drop of blood** — the double circulation (heart → lungs → heart → body)\n' +
    '- **Blood vessels**: arteries, veins and capillaries' }),
];

// ───────── P1: What the Heart Does ─────────
const whatHeartDoes = [
  blk('image', 0, { src: '', alt: 'A beating heart inside the chest between the lungs', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A human heart nestled in the chest ' +
      'between the two lungs, tilted slightly to the left, warm red against the pale lungs and ribs, ' +
      'deep near-black background, dramatic side lighting. Photorealistic medical-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'Your heart beats about **100,000 times a day** and pumps roughly **5 litres of blood ' +
      'every minute** — your whole blood supply, every minute. Over a lifetime that’s more than ' +
      '**2 billion** beats, with no rest days.' }),
  blk('text', 2, { markdown:
    'The heart is a **muscular pump**. Its job is simple to say and amazing to do: push blood around ' +
    'the body in a never-ending loop so every cell is fed with oxygen and food, and its waste (like ' +
    'carbon dioxide) is carried away. It is made of a special muscle — **cardiac muscle** — that can ' +
    'squeeze over and over, all your life, without getting tired.' }),
  blk('heading', 3, { text: 'A pump the size of your fist', level: 2,
    objective: 'Describe where the heart sits, how big it is, and what it is made of.' }),
  blk('text', 4, { markdown:
    'Make a fist — that’s about the size of your heart. It sits in the middle of your chest, **between ' +
    'the two lungs**, tilted a little to the **left** (which is why people point left for their heart). ' +
    'Its walls are thick cardiac muscle; when that muscle squeezes, blood is forced out; when it ' +
    'relaxes, blood flows back in to refill it.' }),
  blk('heading', 5, { text: 'See it in 3D', level: 2,
    objective: 'Explore the outside and inside of a real heart model.' }),
  blk('text', 6, { markdown:
    'Rotate, zoom and tap the heart below to explore it. You can peel away its layers, slice it open, ' +
    'and even follow a drop of blood through it.' }),
  blk('simulation', 7, { simulation_id: 'heart-3d', title: 'The Human Heart — 3D',
    prediction: { prompt: 'Before you explore: roughly how often does your heart beat when you are resting?',
      options: ['About once a second', 'About once a minute', 'About once an hour', 'Only when you exercise'],
      reveal_after: 'About **once a second** — roughly 70–75 beats a minute at rest, speeding up when you ' +
        'run or feel excited, and never fully stopping.' } }),
  blk('reasoning_prompt', 8, { reasoning_type: 'logical',
    prompt: 'Cardiac (heart) muscle can keep contracting your whole life without tiring, unlike the muscles in your arm. Why does that matter so much?',
    options: [
      'If the heart muscle tired and paused, blood would stop reaching the body — so it must never stop',
      'It means you never need to exercise your heart',
      'It means the heart does not need any blood supply of its own',
      'It means the heart only works while you are awake',
    ],
    reveal: 'Every cell needs a constant supply of blood. If the heart muscle tired out and paused even ' +
      'for long, oxygen would stop reaching the brain and body. So heart muscle is built to work ' +
      'non-stop — and it even has its own blood vessels (coronary arteries) to feed it.',
    difficulty_level: 2 }),
  blk('callout', 9, { variant: 'remember', title: 'Remember',
    markdown: 'The heart is a **muscular pump** made of **cardiac muscle**, about the size of your **fist**, ' +
      'sitting between the lungs and tilted slightly left. Squeeze → blood out; relax → blood in.' }),
  blk('inline_quiz', 10, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'What is the main job of the heart?',
      options: ['To pump blood around the body', 'To clean the blood', 'To make oxygen', 'To digest food'],
      correct_index: 0,
      explanation: 'The heart is a pump that pushes blood around the body. The kidneys clean blood, the lungs add oxygen (the heart only moves the blood there), and the gut digests food.',
      difficulty_level: 1 },
    { id: u(), question: 'What type of muscle is the heart made of?',
      options: ['Bone tissue', 'Skin tissue', 'Cardiac muscle', 'Fat'],
      correct_index: 2,
      explanation: 'The heart is built from cardiac muscle, a special muscle that contracts tirelessly for life. It is not bone, skin or fat.',
      difficulty_level: 1 },
    { id: u(), question: 'Where in the body does the heart sit?',
      options: ['In the belly, below the stomach', 'In the chest, between the lungs and tilted slightly left', 'On the right side of the chest', 'Inside the skull'],
      correct_index: 1,
      explanation: 'The heart sits in the chest between the two lungs, tilted slightly to the left. It is not in the belly or the skull, and it leans left, not right.',
      difficulty_level: 1 },
  ] }),
];

// ───────── P2: The Four Chambers ─────────
const fourChambers = [
  blk('image', 0, { src: '', alt: 'A heart cut open to show its four chambers', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A human heart cut open down the middle ' +
      'to reveal its four hollow chambers — two upper, two lower — with a clear dividing wall down the ' +
      'centre. Right side tinted cool blue, left side warm red. Deep near-black background, clean ' +
      'medical-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'The heart is really **two pumps in one**, working side by side. The right pump sends blood ' +
      'to the lungs; the left pump sends it to the rest of the body — at the very same time.' }),
  blk('text', 2, { markdown:
    'Inside, the heart has **four hollow rooms** (chambers). Two on top, two on the bottom:\n\n' +
    '- The two **upper** chambers are the **atria** (one atrium on each side). They *receive* blood ' +
    'coming back to the heart.\n' +
    '- The two **lower** chambers are the **ventricles**. They *pump* blood out of the heart.\n\n' +
    'A thick wall called the **septum** runs down the middle, splitting the heart into a **left side** ' +
    'and a **right side** — so the two kinds of blood never mix.' }),
  blk('heading', 3, { text: 'Right side vs left side', level: 2,
    objective: 'Explain the job of each side of the heart and why the left ventricle is the strongest.' }),
  blk('text', 4, { markdown:
    'The **right side** handles **oxygen-poor** blood: it collects blood returning from the body and ' +
    'pumps it the short distance to the **lungs** to pick up oxygen.\n\n' +
    'The **left side** handles **oxygen-rich** blood: it receives blood from the lungs and pumps it all ' +
    'the way around the **whole body**. Because it pushes blood the farthest, the **left ventricle has ' +
    'the thickest, strongest wall** of all four chambers.' }),
  blk('simulation', 5, { simulation_id: 'heart-3d', title: 'Explore the chambers — 3D',
    prediction: { prompt: 'Which chamber do you think has the thickest, strongest wall?',
      options: ['Left ventricle', 'Right atrium', 'Left atrium', 'They are all the same'],
      reveal_after: 'The **left ventricle** — it has to push blood all the way around the body, so its ' +
        'muscular wall is the thickest. Peel to the chambers layer in the model and compare the walls.' } }),
  blk('text', 6, { markdown:
    'The four chambers and the wall between them are shown below.\n\n' +
    '<!--\nIMAGE_GENERATION_PROMPTS (gallery: heart-chambers)\n' +
    'panel-1 (four chambers labelled) — Front view of a heart cut open, four chambers labelled: right ' +
    'atrium, right ventricle (cool blue), left atrium, left ventricle (warm red), with the septum down ' +
    'the middle. White labels, dark background (#0a0a0a), clean medical illustration.\n' +
    'panel-2 (wall thickness) — Cross-section comparing the thin-walled atria and right ventricle with ' +
    'the thick-walled left ventricle, an arrow highlighting the thick left wall. Dark background ' +
    '(#0a0a0a), white labels, clean medical illustration.\n' +
    'panel-3 (two pumps) — Simple diagram showing the right side (blue) pumping to the lungs and the ' +
    'left side (red) pumping to the body, the septum keeping them apart. Dark background (#0a0a0a), ' +
    'white labels, clean medical illustration.\n-->' }),
  blk('gallery', 7, { aspect_ratio: '4:3', figure_key: 'heart-chambers', items: [
    gi('The four heart chambers labelled with the septum in the middle', 'Four chambers: 2 atria (top), 2 ventricles (bottom)'),
    gi('Cross-section comparing chamber wall thickness', 'The left ventricle has the thickest wall'),
    gi('Right side pumps to the lungs, left side to the body', 'Two pumps in one, kept apart by the septum'),
  ] }),
  blk('reasoning_prompt', 8, { reasoning_type: 'logical',
    prompt: 'The left ventricle’s wall is much thicker than the right ventricle’s. What does that tell you about their jobs?',
    options: [
      'The left ventricle pushes blood much farther (the whole body), so it needs more muscle',
      'The left ventricle is just older than the right',
      'The right ventricle does no pumping at all',
      'The thickness is random and means nothing',
    ],
    reveal: 'Wall thickness matches the work. The right ventricle only pushes blood to the nearby lungs, ' +
      'but the left ventricle drives blood around the entire body — a much bigger push — so it is built ' +
      'with a thicker, more powerful wall.',
    difficulty_level: 2 }),
  blk('callout', 9, { variant: 'remember', title: 'Remember',
    markdown: '**Atria** (top) = receive. **Ventricles** (bottom) = pump. **Septum** keeps the **right ' +
      'side** (oxygen-poor → lungs) apart from the **left side** (oxygen-rich → body). **Left ventricle ' +
      '= thickest wall.**' }),
  blk('inline_quiz', 10, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'Which chambers RECEIVE blood coming back into the heart?',
      options: ['The ventricles (lower chambers)', 'The atria (upper chambers)', 'The septum', 'The valves'],
      correct_index: 1,
      explanation: 'The atria (upper chambers) receive blood returning to the heart; the ventricles (lower chambers) pump it out. The septum is the dividing wall and the valves are one-way doors.',
      difficulty_level: 1 },
    { id: u(), question: 'Why does the left ventricle have the thickest wall?',
      options: ['Because it pumps blood all the way around the whole body', 'Because it only pumps to the lungs', 'Because it stores extra blood', 'Because it makes oxygen'],
      correct_index: 0,
      explanation: 'The left ventricle pushes blood around the entire body, the longest path, so it needs the most muscle. The right ventricle (shorter path to the lungs) is thinner; chambers do not store blood or make oxygen.',
      difficulty_level: 2 },
    { id: u(), question: 'What is the job of the septum?',
      options: ['To pump blood to the lungs', 'To open and close like a door', 'To keep the left and right sides (and their blood) from mixing', 'To make the heartbeat sound'],
      correct_index: 2,
      explanation: 'The septum is the solid wall that separates the left and right sides so oxygen-rich and oxygen-poor blood never mix. Pumping is done by ventricles, doors are valves, and the sound comes from valves closing.',
      difficulty_level: 1 },
  ] }),
];

// ───────── P3: Valves ─────────
const valves = [
  blk('image', 0, { src: '', alt: 'Close-up of a heart valve opening and closing', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). Close-up of a heart valve — thin ' +
      'cup-shaped flaps caught mid-motion as blood pushes through one way. Warm red tissue, glossy and ' +
      'wet, deep near-black background, dramatic lighting. Photorealistic medical-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'That **“lub-dub”** sound a doctor hears through a stethoscope is not the heart squeezing — ' +
      'it’s the **valves snapping shut**, two sets closing one after the other.' }),
  blk('text', 2, { markdown:
    'Blood must flow through the heart **one way only** — forward, never backward. The heart makes sure ' +
    'of this with **valves**: thin flaps that open to let blood through, then snap shut behind it like ' +
    'a one-way door. The heart has **four** of them.' }),
  blk('heading', 3, { text: 'The four valves', level: 2,
    objective: 'Name the four heart valves and where each one sits.' }),
  blk('text', 4, { markdown:
    'Two valves sit between the atria and ventricles, and two guard the exits where blood leaves the heart:\n\n' +
    '- **Tricuspid valve** — between the **right** atrium and right ventricle (it has three flaps, or “cusps”).\n' +
    '- **Bicuspid (mitral) valve** — between the **left** atrium and left ventricle (two flaps).\n' +
    '- **Pulmonary valve** — the exit door from the right ventricle towards the **lungs**.\n' +
    '- **Aortic valve** — the exit door from the left ventricle towards the **body**.\n\n' +
    'Each one opens to let blood pass, then closes so blood cannot leak back.' }),
  blk('simulation', 5, { simulation_id: 'heart-3d', title: 'Find the valves — 3D',
    prediction: { prompt: 'What is a heart valve for?',
      options: ['To let blood flow one way and stop it flowing back', 'To make new blood', 'To store oxygen', 'To join the heart to the lungs'],
      reveal_after: 'A valve is a **one-way door**: it opens to let blood through, then shuts so blood ' +
        'cannot flow backward. Peel to the valves layer in the model to see all four.' } }),
  blk('image', 6, { src: '', alt: 'Diagram of the four heart valves labelled', width: 'full', aspect_ratio: '4:3',
    caption: '📸 The four valves: tricuspid, bicuspid (mitral), pulmonary and aortic.',
    generation_prompt: 'Heart valves diagram. A heart cut open from the front showing all four valves ' +
      'clearly and labelled: tricuspid valve (right atrium to right ventricle), bicuspid/mitral valve ' +
      '(left atrium to left ventricle), pulmonary valve (exit to lungs), aortic valve (exit to body). ' +
      'Show small arrows for the one-way blood flow through each. White labels with thin leader lines, ' +
      'cool blue right side, warm red left side, dark background (#0a0a0a), clean medical illustration.' }),
  blk('reasoning_prompt', 7, { reasoning_type: 'logical',
    prompt: 'Imagine one valve became leaky and no longer closed fully. What problem would that cause?',
    options: [
      'Some blood would leak backward, so the heart must work harder to push it forward again',
      'The heart would instantly stop',
      'Blood would start flowing the right way faster',
      'It would have no effect at all',
    ],
    reveal: 'A valve’s whole point is to stop backflow. A leaky valve lets some blood slip back the wrong ' +
      'way, so the heart has to re-pump it — extra work that, over time, strains the heart. This is a ' +
      'real condition doctors listen for as a “murmur”.',
    difficulty_level: 3 }),
  blk('callout', 8, { variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
    markdown: '**Tricuspid** = right side (3 cusps); **bicuspid/mitral** = left side (2 cusps). Remember ' +
      '**“LAB / RAT”** isn’t needed — just: **tri**cuspid on the **right**, **bi**cuspid on the **left**.\n\n' +
      '**Semilunar valves** (half-moon shaped) = the **pulmonary** (to lungs) and **aortic** (to body) exit valves.\n\n' +
      '**“Lub-dub”:** “lub” = the two AV valves (tricuspid + bicuspid) closing; “dub” = the two semilunar valves closing.' }),
  blk('inline_quiz', 9, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'What is the main job of a heart valve?',
      options: ['To make the heart beat', 'To let blood flow one way and prevent it flowing back', 'To produce blood cells', 'To store oxygen'],
      correct_index: 1,
      explanation: 'Valves are one-way doors that stop blood flowing backward. They do not create the beat (cardiac muscle does), make blood, or store oxygen.',
      difficulty_level: 1 },
    { id: u(), question: 'Which valve sits between the LEFT atrium and the LEFT ventricle?',
      options: ['Tricuspid valve', 'Pulmonary valve', 'Bicuspid (mitral) valve', 'Aortic valve'],
      correct_index: 2,
      explanation: 'The bicuspid (mitral) valve is on the left, between the left atrium and ventricle. The tricuspid is the right-side equivalent; the pulmonary and aortic are the exit valves.',
      difficulty_level: 2 },
    { id: u(), question: 'The “lub-dub” heart sound is made by…',
      options: ['The valves closing', 'The blood entering the lungs', 'The septum splitting', 'The atria filling up'],
      correct_index: 0,
      explanation: 'The familiar “lub-dub” is the two sets of valves snapping shut, one after the other. It is not blood entering the lungs, the septum, or the atria filling.',
      difficulty_level: 2 },
  ] }),
];

// ───────── P4: Follow a Drop of Blood ─────────
const followDrop = [
  blk('image', 0, { src: '', alt: 'Blood looping from heart to lungs and from heart to body', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A flowing figure-eight loop of blood — ' +
      'one loop running between the heart and the lungs (turning from blue to red), the other between the ' +
      'heart and the body (turning red to blue). Glowing blue and red streams on a deep near-black ' +
      'background, clean science-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'A single drop of your blood passes through your heart **twice** to make one full trip ' +
      'around your body. That double loop is why our system is called **double circulation**.' }),
  blk('text', 2, { markdown:
    'Blood doesn’t just go around in one big circle. It travels in a **figure-eight** — two connected ' +
    'loops — passing through the heart **twice** each time. We use colour to keep track: **blue** for ' +
    '**oxygen-poor** blood (carrying waste carbon dioxide) and **red** for **oxygen-rich** blood.' }),
  blk('heading', 3, { text: 'The two loops', level: 2,
    objective: 'Trace blood through the pulmonary (lung) loop and the systemic (body) loop.' }),
  blk('text', 4, { markdown:
    '**Loop 1 — to the lungs (pulmonary):** oxygen-poor (blue) blood comes back from the body into the ' +
    '**right** side, which pumps it to the **lungs**. There it drops off carbon dioxide and picks up ' +
    'oxygen, turning **red**, and returns to the **left** side of the heart.\n\n' +
    '**Loop 2 — to the body (systemic):** the **left** side pumps that oxygen-rich (red) blood out to ' +
    'the **whole body**. Cells take the oxygen and add their waste, turning it **blue** again, and it ' +
    'returns to the **right** side — ready to start over.' }),
  blk('simulation', 5, { simulation_id: 'heart-3d', title: 'Follow a drop of blood — 3D',
    prediction: { prompt: 'Where does blood go to pick up fresh oxygen?',
      options: ['The lungs', 'The stomach', 'The brain', 'The liver'],
      reveal_after: 'The **lungs** — that’s where blood swaps carbon dioxide for oxygen and turns from ' +
        'blue to red. Press “Follow a drop of blood” in the model and watch it change colour at the lungs.' } }),
  blk('heading', 6, { text: 'The famous exceptions', level: 2,
    objective: 'Explain why the pulmonary artery and pulmonary veins break the usual colour rule.' }),
  blk('text', 7, { markdown:
    'Normally **arteries** carry oxygen-rich (red) blood and **veins** carry oxygen-poor (blue) blood. ' +
    'But the lung loop has **two famous exceptions**:\n\n' +
    '- The **pulmonary artery** carries **oxygen-poor (blue)** blood — it’s the *only* artery that does ' +
    '(it’s heading *to* the lungs to get oxygen).\n' +
    '- The **pulmonary veins** carry **oxygen-rich (red)** blood — the *only* veins that do (they’re ' +
    'coming *from* the lungs, freshly oxygenated).' }),
  blk('reasoning_prompt', 8, { reasoning_type: 'logical',
    prompt: 'The pulmonary artery carries blue, oxygen-poor blood — yet it is still called an artery. Why?',
    options: [
      'Because “artery” means a vessel carrying blood AWAY from the heart, whatever its oxygen level',
      'Because someone made a naming mistake long ago',
      'Because it is actually a vein',
      'Because all arteries carry blue blood',
    ],
    reveal: 'An artery is defined by *direction* — it carries blood **away from the heart** — not by ' +
      'colour. The pulmonary artery leaves the heart heading for the lungs, so it’s an artery even ' +
      'though its blood is oxygen-poor.',
    difficulty_level: 3 }),
  blk('callout', 9, { variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
    markdown: '**Double circulation** = blood passes through the heart **twice** per full circuit: the ' +
      '**pulmonary** circuit (heart → lungs → heart) and the **systemic** circuit (heart → body → heart).\n\n' +
      '**The two exceptions (very common question):** **pulmonary artery = deoxygenated**, **pulmonary ' +
      'veins = oxygenated**. Artery/vein is defined by *direction* (away from / toward the heart), not by ' +
      'whether the blood is oxygen-rich.' }),
  blk('inline_quiz', 10, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'In double circulation, how many times does blood pass through the heart in one full trip around the body?',
      options: ['Once', 'Twice', 'Three times', 'It never returns to the heart'],
      correct_index: 1,
      explanation: 'Blood passes through the heart twice — once on the lung loop and once on the body loop — which is what “double” circulation means.',
      difficulty_level: 1 },
    { id: u(), question: 'Where does blood pick up oxygen and turn from blue to red?',
      options: ['In the body’s muscles', 'In the lungs', 'In the stomach', 'In the left ventricle'],
      correct_index: 1,
      explanation: 'Blood becomes oxygen-rich (red) in the lungs, where it swaps carbon dioxide for oxygen. The muscles use up oxygen (turning it blue), and the left ventricle just pumps the already-red blood.',
      difficulty_level: 1 },
    { id: u(), question: 'Which blood vessel is unusual because it is an artery carrying oxygen-POOR blood?',
      options: ['The aorta', 'A vein in the leg', 'The pulmonary artery', 'A capillary in the skin'],
      correct_index: 2,
      explanation: 'The pulmonary artery is the only artery carrying oxygen-poor blood, because it heads to the lungs to collect oxygen. The aorta carries oxygen-rich blood, and the others are not arteries.',
      difficulty_level: 2 },
  ] }),
];

// ───────── P5: Blood Vessels ─────────
const bloodVessels = [
  blk('image', 0, { src: '', alt: 'Arteries, veins and tiny capillaries branching through the body', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A network of blood vessels — thick red ' +
      'arteries branching into a fine mesh of tiny capillaries and gathering into blue veins — glowing ' +
      'against a deep near-black background. Clean science-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'If you joined all your blood vessels end to end, they would stretch about **100,000 km** — ' +
      'enough to wrap around the Earth **two and a half times**. Almost all of that length is microscopic ' +
      'capillaries.' }),
  blk('text', 2, { markdown:
    'Blood travels through a network of tubes called **blood vessels**. There are **three kinds**, each ' +
    'built for a different job.' }),
  blk('heading', 3, { text: 'Arteries, veins and capillaries', level: 2,
    objective: 'Tell apart arteries, veins and capillaries by their job and their structure.' }),
  blk('text', 4, { markdown:
    '- **Arteries** carry blood **away from the heart**. The heart’s push makes the pressure high, so ' +
    'arteries have **thick, muscular, stretchy walls** to take it.\n' +
    '- **Veins** carry blood **back to the heart**. The pressure here is low, so veins have **thinner ' +
    'walls** and small **valves** inside to stop blood from sliding backward.\n' +
    '- **Capillaries** are the **tiniest** vessels, linking the smallest arteries to the smallest veins. ' +
    'Their walls are just **one cell thick** — thin enough for oxygen, food and waste to pass in and out. ' +
    'This is where the real exchange with your cells happens.' }),
  blk('text', 5, { markdown:
    'The cross-sections below show why each vessel looks the way it does.\n\n' +
    '<!--\nIMAGE_GENERATION_PROMPTS (gallery: vessel-types)\n' +
    'panel-1 (artery) — Cross-section of an artery: a small round opening (lumen) surrounded by a thick ' +
    'muscular wall. Warm red, white labels (lumen, thick muscular wall), dark background (#0a0a0a), clean ' +
    'medical illustration.\n' +
    'panel-2 (vein) — Cross-section of a vein: a larger, less round opening with a thin wall, and a small ' +
    'one-way valve flap inside. Cool blue, white labels (thin wall, valve), dark background (#0a0a0a), ' +
    'clean medical illustration.\n' +
    'panel-3 (capillary) — A single capillary shown as a tube with a wall just one cell thick, a red ' +
    'blood cell squeezing through in single file, oxygen passing out to a nearby body cell. White labels ' +
    '(one-cell-thick wall), dark background (#0a0a0a), clean medical illustration.\n-->' }),
  blk('gallery', 6, { aspect_ratio: '4:3', figure_key: 'vessel-types', items: [
    gi('Cross-section of an artery with a thick muscular wall', 'Artery — thick wall for high pressure'),
    gi('Cross-section of a vein with a thin wall and a valve', 'Vein — thin wall, valves stop backflow'),
    gi('A capillary one cell thick with a red blood cell passing through', 'Capillary — one cell thick, where exchange happens'),
  ] }),
  blk('comparison_card', 7, { title: 'Artery vs Vein', columns: [
    { heading: 'Artery', points: ['Carries blood AWAY from the heart', 'Thick, muscular, stretchy wall', 'High pressure', 'No valves (except at the heart exits)'] },
    { heading: 'Vein', points: ['Carries blood BACK to the heart', 'Thinner wall', 'Low pressure', 'Has valves to stop backflow'] },
  ] }),
  blk('reasoning_prompt', 8, { reasoning_type: 'logical',
    prompt: 'Why must a capillary’s wall be only one cell thick?',
    options: [
      'So oxygen, food and waste can pass easily between the blood and the body’s cells',
      'So it can carry blood at very high pressure',
      'So it can pump blood by itself',
      'So it can store the most blood',
    ],
    reveal: 'Capillaries are where the blood actually hands over oxygen and food to cells and takes their ' +
      'waste. A wall just one cell thick is short enough for these things to pass straight through. Thick ' +
      'walls (like an artery’s) would block that exchange.',
    difficulty_level: 2 }),
  blk('callout', 9, { variant: 'remember', title: 'Remember',
    markdown: '**Arteries → Away** from the heart (thick walls, high pressure). **Veins → back** to the ' +
      'heart (thin walls, valves). **Capillaries** = one cell thick, where oxygen and food are exchanged ' +
      'with your cells.' }),
  blk('inline_quiz', 10, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'Which blood vessels carry blood AWAY from the heart?',
      options: ['Veins', 'Arteries', 'Capillaries', 'Valves'],
      correct_index: 1,
      explanation: 'Arteries carry blood away from the heart (remember: Arteries → Away). Veins carry it back, capillaries are the exchange vessels, and valves are doors, not vessels.',
      difficulty_level: 1 },
    { id: u(), question: 'Why do veins have valves but arteries (mostly) do not?',
      options: ['Because blood in veins is at low pressure and could slide backward without them', 'Because veins carry more blood', 'Because veins are closer to the skin', 'Because arteries are longer'],
      correct_index: 0,
      explanation: 'Vein blood is at low pressure, so valves are needed to stop it slipping backward. Artery blood is pushed hard by the heart, so it keeps moving forward without valves. Closeness to skin and length are not the reason.',
      difficulty_level: 2 },
    { id: u(), question: 'Where does oxygen and food actually pass from the blood into the body’s cells?',
      options: ['In the thick-walled arteries', 'In the capillaries', 'In the heart’s ventricles', 'In the valves'],
      correct_index: 1,
      explanation: 'Exchange happens in the capillaries, whose walls are only one cell thick. Arteries and ventricles have thick walls that blood cannot pass through, and valves just control flow direction.',
      difficulty_level: 1 },
  ] }),
];

const PAGES = [
  { slug: 'heart-and-circulation-opener', title: 'The Heart & Circulation', page_number: 0, page_type: 'chapter_opener',
    subtitle: 'The pump that never rests — chambers, valves, the double circulation and the blood vessels.', blocks: opener },
  { slug: 'what-the-heart-does', title: 'What the Heart Does', page_number: 1, page_type: 'lesson',
    subtitle: 'A muscular pump the size of your fist that pushes blood to every cell — explored in 3D.', blocks: whatHeartDoes },
  { slug: 'the-four-chambers', title: 'The Four Chambers', page_number: 2, page_type: 'lesson',
    subtitle: 'Two atria, two ventricles, and the wall that keeps the two sides from mixing.', blocks: fourChambers },
  { slug: 'heart-valves', title: 'Valves: One-Way Doors', page_number: 3, page_type: 'lesson',
    subtitle: 'The four valves that keep blood moving forward — and make the “lub-dub” sound.', blocks: valves },
  { slug: 'follow-a-drop-of-blood', title: 'Follow a Drop of Blood', page_number: 4, page_type: 'lesson',
    subtitle: 'The double circulation — two loops, blue to red and back — plus the famous pulmonary exceptions.', blocks: followDrop },
  { slug: 'blood-vessels', title: 'Blood Vessels', page_number: 5, page_type: 'lesson',
    subtitle: 'Arteries, veins and capillaries — three tubes, three jobs.', blocks: bloodVessels },
];

(async () => {
  await withDb(async (db) => {
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const now = new Date();
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book not found — run create_anatomy_book.js first');

    if (!(book.chapters || []).some((c) => c.slug === CH.slug)) {
      await books.updateOne({ _id: book._id }, {
        $push: { chapters: { number: CH.number, title: CH.title, slug: CH.slug, page_ids: [], description: CH.description, is_published: false } },
        $set: { updated_at: now },
      });
      console.log('added chapter:', CH.title);
    } else console.log('chapter exists:', CH.title);

    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: book._id, slug: p.slug });
      if (existing) { console.log('exists, skipping:', p.slug); pageIds.push(existing._id); continue; }
      const doc = {
        _id: uuidv4(), book_id: book._id, chapter_number: CH.number, page_number: p.page_number,
        slug: p.slug, title: p.title, subtitle: p.subtitle, blocks: p.blocks,
        page_type: p.page_type, published: false,
        reading_time_min: computeReadingTime(p.blocks), content_types: computeContentTypes(p.blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      };
      await pages.insertOne(doc);
      pageIds.push(doc._id);
      console.log('created:', p.slug, '·', doc.reading_time_min, 'min ·', doc.content_types.join('/') || 'no-interactive');
    }
    await books.updateOne({ _id: book._id, 'chapters.slug': CH.slug }, { $set: { 'chapters.$.page_ids': pageIds, updated_at: now } });
    console.log('Heart chapter:', pageIds.length, 'pages. All UNPUBLISHED.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
