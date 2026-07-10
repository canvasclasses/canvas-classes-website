'use strict';
/**
 * Adds the orientation chapter "How the Body Is Built" to the Anatomy & Physiology
 * book and places it FIRST (renumber: How-the-Body-Is-Built = 1, Skeletal = 2,
 * Heart = 3). Built to the canonical A&P template (ANATOMY_PHYSIOLOGY_BOOK.md):
 * hero → hook → form-follows-function → macro → MICRO → CLINICAL → IN-REAL-LIFE →
 * reasoning → remember → §3.6.1 quiz. Opener + 4 lessons.
 *
 * SAFETY (CLAUDE.md §0.6):
 *  - New chapter + new pages = direct insert (additive, safe).
 *  - Renumbering existing chapters is METADATA-ONLY: it rewrites books.chapters[].number
 *    and each existing page's chapter_number (an int field, NOT page content/blocks), so
 *    the content-loss guard does not apply. No `blocks`/`src` are ever touched here.
 *  - Renumber is keyed on each chapter's page_ids (robust, not on current numbers), so
 *    the script is idempotent: re-running sets the same final state.
 *  - Everything UNPUBLISHED. Publishing is a separate, founder-only step.
 */
const { computeReadingTime, computeContentTypes, withDb } = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'anatomy-physiology';
const CH = { number: 1, title: 'How the Body Is Built', slug: 'how-the-body-is-built',
  description: 'From a single cell to a whole human — levels of organisation, the cell, the four tissue types, and the body’s 11 organ systems. The front door to anatomy.' };

const u = () => uuidv4();
const blk = (type, order, extra) => ({ id: u(), type, order, ...extra });

// ───────────────────────── OPENER ─────────────────────────
const opener = [
  blk('image', 0, { src: '', alt: 'A single glowing cell on the left growing into a full human figure on the right', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A visual journey from small to large: a single ' +
      'glowing cell on the far left, growing step by step into a cluster of cells, then a tissue, then an organ, ' +
      'then a faint full human figure on the right — all rendered in warm light against a deep near-black ' +
      'background. Conveys that a whole person is built from tiny parts that team up. Photorealistic ' +
      'science-illustration style. No text.' }),
  blk('text', 1, { markdown:
    'Your body is not one solid thing. It is built — like a house from bricks — out of about **37 trillion ' +
    'tiny living parts called cells**, organised into bigger and bigger teams until they make a whole you. ' +
    'And at every level there is one rule: **form follows function** — the way each part is built is the answer ' +
    'to the job it has to do.\n\n' +
    'This first chapter is the **front door to anatomy**. Before we open up any single system, we’ll see how ' +
    'the body is put together: from the smallest building block up to the great teams of organs that keep you alive.' }),
  blk('text', 2, { markdown:
    '**What you’ll explore in this chapter**\n\n' +
    '- **The ladder of life** — how cells build tissues, tissues build organs, organs build systems, systems build *you*\n' +
    '- **The cell** — your body’s basic building block, and why it comes in so many shapes\n' +
    '- **The four tissue types** — the four “families” of cells every organ is made from\n' +
    '- **Organs and the 11 organ systems** — the great teams, and how they work together' }),
];

// ───────────────────────── P1: THE LADDER OF LIFE ─────────────────────────
const ladder = [
  blk('image', 0, { src: '', alt: 'Steps rising from a cell to a tissue to an organ to a body', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A rising staircase of biological organisation, ' +
      'each step glowing warmly against a deep near-black background: a single cell, then a sheet of cells ' +
      '(tissue), then an organ (a heart), then a full human silhouette. A sense of climbing from small to large. ' +
      'Clean science-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'You are made of roughly **37 trillion cells** — that’s 37 followed by twelve zeros. Laid in a ' +
      'line they would wrap around the Earth many times. Yet every one of them works as part of a larger team.' }),
  blk('text', 2, { markdown:
    'A body would be useless as a giant bag of identical cells. Instead it is **organised into levels**, each ' +
    'one built from the level below — a bit like letters make words, words make sentences, and sentences make a ' +
    'book. Small parts **specialise** for one job, then join with others to do something bigger than any of them ' +
    'could alone. That climb from small to large is the **levels of organisation**.' }),
  blk('heading', 3, { text: 'Climbing the ladder', level: 2,
    objective: 'List the levels of organisation in order and give one body example of each.' }),
  blk('text', 4, { markdown:
    'Follow one example — the heart — all the way up the ladder:\n\n' +
    '1. **Cell** — the smallest living unit. One **heart-muscle cell** can squeeze, but on its own it does almost nothing.\n' +
    '2. **Tissue** — many similar cells working together. Millions of heart-muscle cells together make **cardiac muscle tissue**.\n' +
    '3. **Organ** — different tissues teaming up for one big job. Cardiac muscle plus other tissues make the **heart**.\n' +
    '4. **Organ system** — organs working together. The heart plus the blood vessels make the **circulatory system**.\n' +
    '5. **Organism** — all the systems together make a living **you**.' }),
  blk('table', 5, { caption: 'The levels of organisation, smallest to largest',
    headers: ['Level', 'What it is', 'Heart example'],
    rows: [
      ['Cell', 'The smallest living unit', 'A heart-muscle cell'],
      ['Tissue', 'A team of similar cells, one job', 'Cardiac muscle'],
      ['Organ', 'Different tissues, one bigger job', 'The heart'],
      ['Organ system', 'Organs working together', 'The circulatory system'],
      ['Organism', 'All systems together', 'A living human'],
    ] }),
  blk('image', 6, { src: '', alt: 'Human cells seen under a microscope', width: 'full', aspect_ratio: '4:3',
    caption: '📸 The bottom rung of the ladder: living human cells seen down a microscope.',
    generation_prompt: 'Microscope-style scientific illustration of a cluster of human cells (a simple tissue ' +
      'section), each cell with a clearly visible round nucleus, shown at high magnification. Soft pink and ' +
      'magenta cell bodies, purple-stained nuclei, white labels with thin leader lines (cell, nucleus, cell ' +
      'membrane). Dark background (#0a0a0a), clean histology-textbook style, anatomically accurate, no ' +
      'stylisation. No photorealism of a whole body.' }),
  blk('callout', 7, { variant: 'warning', title: 'When It Goes Wrong — Cancer',
    markdown: 'The ladder works because cells normally divide only when the body needs them. In **cancer**, a ' +
      'cell ignores that control and keeps dividing, building a useless lump (a **tumour**) that crowds out ' +
      'healthy tissue and steals its resources. It is, at heart, a breakdown of organisation at the very ' +
      'bottom rung — one cell that stopped being a team player.' }),
  blk('heading', 8, { text: 'In real life: how a cut heals', level: 2,
    objective: 'Explain an everyday event using the levels of organisation.' }),
  blk('text', 9, { markdown:
    'You see the ladder in action every time you heal:\n\n' +
    '- **A cut on your skin** — nearby skin **cells** divide to make new ones, which rebuild the skin **tissue**, ' +
    'which restores the **organ** (your skin) and seals the gap. Days later you can barely see it.\n' +
    '- **Building muscle in the gym** — training stresses muscle **cells**, which repair thicker and stronger, ' +
    'so the **tissue** grows and the whole **muscle** can pull harder.\n' +
    '- **Getting fitter** — your **cells** make more energy-factories, so your **organs** (heart, lungs, muscles) ' +
    'and the **systems** they belong to all perform better. Fitness is really a change down at the cell level.' }),
  blk('reasoning_prompt', 10, { reasoning_type: 'logical',
    prompt: 'A doctor says “the problem is at the tissue level, not the organ level.” What does that tell you about how serious or widespread the problem might be?',
    options: [
      'The problem is in a particular team of cells, not yet the whole organ — so it may be caught earlier and more locally',
      'The organ has completely stopped working',
      'Every cell in the body is affected',
      'There is nothing wrong, because tissues are not important',
    ],
    reveal: 'The levels of organisation are like zoom levels. A tissue-level problem is more local than an ' +
      'organ-level one — it sits in one team of cells and has not yet disabled the whole organ. Naming the ' +
      'level tells a doctor how widespread the trouble is and how early it has been caught.',
    difficulty_level: 3 }),
  blk('callout', 11, { variant: 'remember', title: 'Remember',
    markdown: 'The ladder of life, smallest to largest: **cell → tissue → organ → organ system → organism.** ' +
      'Each level is built from the one below, and at every level **form follows function**.' }),
  blk('inline_quiz', 12, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'What is the correct order of the levels of organisation, from smallest to largest?',
      options: ['Cell → tissue → organ → organ system → organism', 'Tissue → cell → organ → organism → organ system', 'Organ → cell → tissue → organism → organ system', 'Cell → organ → tissue → organ system → organism'],
      correct_index: 0,
      explanation: 'Cells build tissues, tissues build organs, organs build systems, and systems build the whole organism. The other orders jumble the ladder — for example, a tissue is never smaller than the cells it is made of.',
      difficulty_level: 1 },
    { id: u(), question: 'Cardiac muscle is millions of similar heart cells working together. Which level of organisation is that?',
      options: ['An organ', 'An organism', 'A tissue', 'An organ system'],
      correct_index: 2,
      explanation: 'A team of similar cells doing one job is a tissue. The heart itself (several tissues together) is the organ, and the heart plus vessels is the system.',
      difficulty_level: 2 },
    { id: u(), question: 'Why is the body organised into levels instead of being one giant mass of identical cells?',
      options: ['So that it weighs less', 'So that parts can specialise for one job and then team up to do bigger jobs', 'So that it can be counted more easily', 'So that every cell can be exactly the same'],
      correct_index: 1,
      explanation: 'Organisation lets cells specialise (a nerve cell for signals, a muscle cell for pulling) and then combine into tissues and organs that achieve far more than identical cells could. It is about division of labour, not weight or counting.',
      difficulty_level: 2 },
  ] }),
];

// ───────────────────────── P2: THE CELL ─────────────────────────
const cell = [
  blk('image', 0, { src: '', alt: 'A single human cell glowing, showing its nucleus and inner parts', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A single human cell rendered large and ' +
      'three-dimensional, its outer membrane glowing softly, the round nucleus visible inside along with small ' +
      'inner structures, set against a deep near-black background with warm rim lighting. Conveys the cell as a ' +
      'busy, living building block. Clean science-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'A typical body cell is so small that about **10,000 of them would fit on the head of a pin**. ' +
      'And you replace **millions of cells every second** — most of the “you” from a few years ago has quietly ' +
      'been rebuilt.' }),
  blk('text', 2, { markdown:
    'Every living thing — a blade of grass, a whale, you — is built from **cells**. The cell is the **smallest ' +
    'unit that is still alive**: it can take in food, use energy, get rid of waste, and make copies of itself. ' +
    'Break it apart and the pieces are just chemicals; keep it whole and it lives. And because different jobs ' +
    'need different tools, cells come in **many shapes** — once again, form following function.' }),
  blk('heading', 3, { text: 'Inside a cell', level: 2,
    objective: 'Name the main parts of a cell and the job each one does.' }),
  blk('text', 4, { markdown:
    'You can picture a cell as a tiny walled workshop:\n\n' +
    '- **Cell membrane** — the outer wall and **gatekeeper**: it decides what gets in (food, oxygen) and what ' +
    'goes out (waste).\n' +
    '- **Cytoplasm** — the jelly-like **workspace** that fills the cell, where most of the work happens.\n' +
    '- **Nucleus** — the **control room**, holding the instructions (**DNA**) that tell the cell what to do.\n' +
    '- **Mitochondria** — the **power stations** that release energy from food so the cell can work. (Hard-working ' +
    'cells, like muscle cells, are packed with them.)' }),
  blk('heading', 5, { text: 'Why cells come in so many shapes', level: 2,
    objective: 'Connect a cell’s shape to the job it performs.' }),
  blk('text', 6, { markdown:
    'A cell’s shape is built around its job:\n\n' +
    '- A **nerve cell** is long and thread-like — perfect for **carrying signals** over distances, sometimes a metre or more.\n' +
    '- A **red blood cell** is a tiny squashed disc with no nucleus — all room given over to **carrying oxygen**, ' +
    'and bendy enough to squeeze through the narrowest vessels.\n' +
    '- A **muscle cell** is long and stretchy — built to **shorten and pull**.\n\n' +
    'Same basic building block, re-shaped for the task. That is form following function at the smallest scale.' }),
  blk('image', 7, { src: '', alt: 'Different specialised human cells shown side by side', width: 'full', aspect_ratio: '4:3',
    caption: '📸 One building block, many shapes: a nerve cell, a red blood cell, and a muscle cell compared.',
    generation_prompt: 'Scientific textbook illustration comparing three specialised human cells side by side at ' +
      'the same scale: a long branching nerve cell, a small biconcave (dimpled disc) red blood cell, and a long ' +
      'spindle-shaped muscle cell. Each clearly labelled in white with thin leader lines, soft pink and red ' +
      'tones, dark background (#0a0a0a), clean histology-textbook style, anatomically accurate, no stylisation.' }),
  blk('callout', 8, { variant: 'warning', title: 'When It Goes Wrong — Sickle-Cell',
    markdown: 'A red blood cell’s round disc shape is what lets it carry oxygen and bend through tiny vessels. In ' +
      '**sickle-cell disease**, a single change makes the cells collapse into stiff, curved **sickle** shapes. ' +
      'They carry less oxygen and get **stuck** in narrow vessels, causing pain and tiredness — a powerful ' +
      'reminder that when a cell loses its shape, it loses its function.' }),
  blk('heading', 9, { text: 'In real life: why you get out of breath', level: 2,
    objective: 'Explain everyday feelings in terms of what cells need.' }),
  blk('text', 10, { markdown:
    'Your whole body runs on what cells need — food and oxygen in, waste out:\n\n' +
    '- **Getting out of breath when you run** — your muscle cells are burning through oxygen faster than it ' +
    'arrives, so you breathe harder and your heart races to deliver more.\n' +
    '- **Feeling dizzy if you stand up too fast** — brain cells are briefly short of the blood (and oxygen) they ' +
    'need, so they protest for a second.\n' +
    '- **Why athletes train** — endurance training makes muscle cells build **more mitochondria**, so they make ' +
    'energy more easily and tire less. Fitness is partly a change inside your cells.' }),
  blk('reasoning_prompt', 11, { reasoning_type: 'analogical',
    prompt: 'A red blood cell gives up its nucleus (its control room) as it matures. Given its one job — carrying oxygen — why might that be a sensible trade?',
    options: [
      'Losing the nucleus frees up space and makes the cell bendier, so it can hold more oxygen and squeeze through tiny vessels',
      'It means the cell can now think for itself',
      'It lets the cell live forever',
      'It has no effect at all on the cell',
    ],
    reveal: 'A red blood cell’s only job is to ferry oxygen. Dropping the bulky nucleus leaves more room for ' +
      'oxygen-carrying cargo and makes the cell flexible enough to bend through the narrowest capillaries. The ' +
      'trade-off is that it can no longer repair itself, so it only lives about four months.',
    difficulty_level: 3 }),
  blk('callout', 12, { variant: 'remember', title: 'Remember',
    markdown: 'The **cell** is the smallest living unit. Key parts: **membrane** (gatekeeper wall), **cytoplasm** ' +
      '(workspace), **nucleus** (control room with DNA), **mitochondria** (power stations). A cell’s **shape ' +
      'follows its job**.' }),
  blk('inline_quiz', 13, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'Which part of the cell holds the instructions (DNA) that control what the cell does?',
      options: ['The cell membrane', 'The nucleus', 'The cytoplasm', 'The mitochondria'],
      correct_index: 1,
      explanation: 'The nucleus is the control room that stores DNA. The membrane is the gatekeeper wall, the cytoplasm is the workspace, and the mitochondria release energy.',
      difficulty_level: 1 },
    { id: u(), question: 'A muscle cell that works hard all day would be expected to contain a large number of which part?',
      options: ['Nuclei', 'Cell membranes', 'Cell walls', 'Mitochondria'],
      correct_index: 3,
      explanation: 'Mitochondria release energy from food, so hard-working cells are packed with them. A cell has only one membrane, animal cells have no cell wall, and extra nuclei would not supply energy.',
      difficulty_level: 2 },
    { id: u(), question: 'Why is a nerve cell long and thread-like?',
      options: ['So it can carry signals over long distances', 'So it can store the most oxygen', 'So it can squeeze through tiny blood vessels', 'So it can pull and shorten like a muscle'],
      correct_index: 0,
      explanation: 'A nerve cell’s long shape suits its job of carrying signals across distances. Carrying oxygen and squeezing through vessels is the red blood cell’s shape; shortening to pull is the muscle cell’s.',
      difficulty_level: 2 },
  ] }),
];

// ───────────────────────── P3: THE FOUR TISSUE TYPES ─────────────────────────
const tissues = [
  blk('image', 0, { src: '', alt: 'Four panels of different human tissues under a microscope', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). Four glowing microscope-style panels in a row, ' +
      'each a different human tissue (a sheet of lining cells, a fibrous support tissue, striped muscle fibres, ' +
      'and a branching nerve cell), against a deep near-black background. Conveys that the whole body is built ' +
      'from just four tissue families. Clean histology-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'Every organ in your body — heart, brain, skin, gut, bone — is built from just **four basic tissue ' +
      'types**. Four families of cells, mixed in different amounts, make every part of you.' }),
  blk('text', 2, { markdown:
    'A **tissue** is a team of **similar cells** doing **one job** together. Remarkably, the entire human body is ' +
    'built from only **four tissue families**. Knowing them is like knowing the four basic ingredients every ' +
    'recipe in the body is made from.' }),
  blk('heading', 3, { text: 'The four families', level: 2,
    objective: 'Name the four tissue types and give the job and an example of each.' }),
  blk('text', 4, { markdown:
    '- **Epithelial tissue** — the **covering and lining** tissue. It sheets over surfaces and lines hollow ' +
    'organs: your **skin’s surface**, the lining of your **gut** and **lungs**. It protects and controls what ' +
    'passes through.\n' +
    '- **Connective tissue** — the **support, connect and fill** tissue, and the most varied. It includes ' +
    '**bone**, **blood**, **fat**, and **tendons**. Its cells often sit spread out in a material they make ' +
    'themselves.\n' +
    '- **Muscle tissue** — the **movement** tissue. Its cells **shorten to pull**: **skeletal** muscle moves ' +
    'your bones, **cardiac** muscle drives the heart, **smooth** muscle squeezes the gut and vessels.\n' +
    '- **Nervous tissue** — the **control and signalling** tissue. Its cells carry fast electrical messages: the ' +
    '**brain**, **spinal cord** and **nerves**.' }),
  blk('comparison_card', 5, { title: 'The four tissue types at a glance', columns: [
    { heading: 'Epithelial', points: ['Job: cover & line', 'Where: skin surface, gut & lung lining', 'Cells: packed in tight sheets'] },
    { heading: 'Connective', points: ['Job: support, connect, fill', 'Where: bone, blood, fat, tendon', 'Cells: spread in a matrix'] },
    { heading: 'Muscle', points: ['Job: movement (shorten to pull)', 'Where: skeletal, cardiac, smooth', 'Cells: long and contractile'] },
    { heading: 'Nervous', points: ['Job: control & signals', 'Where: brain, cord, nerves', 'Cells: long, wired for messages'] },
  ] }),
  blk('image', 6, { src: '', alt: 'The four tissue types shown side by side under a microscope', width: 'full', aspect_ratio: '4:3',
    caption: '📸 Tap to compare: epithelial, connective, muscle and nervous tissue at the same magnification.',
    generation_prompt: 'Scientific histology illustration with four labelled panels at the same magnification: ' +
      '(1) epithelial tissue as a neat sheet of tightly packed cells, (2) connective tissue as scattered cells ' +
      'in a fibrous matrix, (3) muscle tissue as long striped (striated) fibres, (4) nervous tissue as a ' +
      'branching nerve cell with long extensions. Each panel labelled in white with thin leader lines, soft ' +
      'natural tissue colours (pinks, magentas, ivory), dark background (#0a0a0a), identical scale and viewing ' +
      'angle, clean histology-textbook style, anatomically accurate, no stylisation.' }),
  blk('callout', 7, { variant: 'warning', title: 'When It Goes Wrong — Severe Burns',
    markdown: 'Your skin’s **epithelial** tissue is a sealed barrier that keeps water in and germs out. A severe ' +
      '**burn** destroys that barrier over a large area, so the body loses fluid fast and germs get in easily. ' +
      'That is why big burns are so dangerous — not the pain alone, but the loss of the epithelial seal — and ' +
      'why doctors rush to cover them.' }),
  blk('heading', 8, { text: 'In real life: a single movement uses all four', level: 2,
    objective: 'Identify the tissue types working together in an everyday action.' }),
  blk('text', 9, { markdown:
    'Catch a ball and you use the whole team at once:\n\n' +
    '- **Nervous tissue** spots the ball and fires the order to move.\n' +
    '- **Muscle tissue** contracts to swing your arm and close your hand.\n' +
    '- **Connective tissue** — the **tendons** — passes the muscle’s pull to the bones, and the **bones** ' +
    '(also connective) act as levers.\n' +
    '- **Epithelial tissue** — your skin — feels the ball land and grips it.\n\n' +
    'Pull a muscle or strain a tendon playing sport and you have injured specific tissues — which is exactly how ' +
    'a physio describes it.' }),
  blk('reasoning_prompt', 10, { reasoning_type: 'logical',
    prompt: 'Blood is classed as a connective tissue, even though it is a liquid you can pour. Using the definition of a tissue, why does that classification make sense?',
    options: [
      'Because blood is a team of similar cells sitting in a shared material (plasma) and its job is to connect and supply the whole body',
      'Because blood is red, and all connective tissue is red',
      'Because blood is found only inside bones',
      'Because blood cannot be a tissue at all — it must be an organ',
    ],
    reveal: 'A tissue is similar cells working together in a shared material. Blood is exactly that: red and ' +
      'white cells suspended in liquid plasma (its matrix), doing the connective job of carrying food, oxygen ' +
      'and warmth everywhere. The liquid matrix is unusual, but the definition still fits.',
    difficulty_level: 3 }),
  blk('callout', 11, { variant: 'remember', title: 'Remember',
    markdown: 'The **four tissue types**: **Epithelial** (cover & line), **Connective** (support, connect, fill — ' +
      'bone, blood, fat, tendon), **Muscle** (movement), **Nervous** (control & signals). Every organ is a ' +
      'mix of these four.' }),
  blk('inline_quiz', 12, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'Which tissue type’s main job is to cover surfaces and line hollow organs like the gut and lungs?',
      options: ['Muscle tissue', 'Nervous tissue', 'Epithelial tissue', 'Connective tissue'],
      correct_index: 2,
      explanation: 'Epithelial tissue covers and lines surfaces. Muscle moves, nervous tissue signals, and connective tissue supports and connects.',
      difficulty_level: 1 },
    { id: u(), question: 'Bone, blood, fat and tendons all belong to which tissue family?',
      options: ['Connective tissue', 'Epithelial tissue', 'Muscle tissue', 'Nervous tissue'],
      correct_index: 0,
      explanation: 'These are all connective tissues — they support, connect or fill, often with cells spread through a matrix. They do not line surfaces (epithelial), contract (muscle), or carry signals (nervous).',
      difficulty_level: 2 },
    { id: u(), question: 'The heart wall is mostly cardiac muscle. Which tissue type is that?',
      options: ['Epithelial tissue', 'Connective tissue', 'Nervous tissue', 'Muscle tissue'],
      correct_index: 3,
      explanation: 'Cardiac muscle is a muscle tissue — it contracts to pump blood. The heart also contains the other three types, but its thick wall is muscle.',
      difficulty_level: 1 },
  ] }),
];

// ───────────────────────── P4: ORGANS & THE 11 SYSTEMS ─────────────────────────
const systems = [
  blk('image', 0, { src: '', alt: 'A human figure with several organ systems glowing inside it', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A translucent human figure seen from the front ' +
      'with several organ systems glowing inside in different colours — the skeleton, the heart and blood ' +
      'vessels, the lungs, the brain and nerves — all visible at once against a deep near-black background. ' +
      'Conveys many teams working together inside one body. Clean science-illustration style. No text.' }),
  blk('callout', 1, { variant: 'fun_fact', title: 'Did you know?',
    markdown: 'Just **reading this sentence** takes several organ systems at once: your eyes and nerves (nervous ' +
      'system), your heart and blood (circulatory system) feeding the brain, and your lungs (respiratory system) ' +
      'supplying the oxygen. No system works alone.' }),
  blk('text', 2, { markdown:
    'Climb the last two rungs of the ladder. An **organ** is different **tissues teaming up** for one big job — ' +
    'the **heart**, for example, is made of all four tissue types at once. An **organ system** is several ' +
    '**organs teaming up** for an even bigger job. Form follows function all the way up: bigger jobs need bigger ' +
    'teams.' }),
  blk('heading', 3, { text: 'What makes an organ', level: 2,
    objective: 'Explain how an organ combines several tissue types for one job.' }),
  blk('text', 4, { markdown:
    'Take the **heart** as the model organ. It is not made of one tissue but four, each doing its part:\n\n' +
    '- **Muscle** tissue (cardiac muscle) — the thick wall that squeezes.\n' +
    '- **Connective** tissue — the strong fibrous skeleton and the blood it pumps.\n' +
    '- **Epithelial** tissue — the smooth lining inside its chambers and vessels.\n' +
    '- **Nervous** tissue — the wiring that sets the beat.\n\n' +
    'Put together for **one job — pumping blood** — they make an organ. That is what every organ is: tissues ' +
    'combined for a shared task.' }),
  blk('heading', 5, { text: 'The body’s 11 organ systems', level: 2,
    objective: 'List the 11 organ systems and the main job of each.' }),
  blk('text', 6, { markdown:
    'Organs group into **11 great systems**, each with a clear job. You’ll meet many of them as full chapters in ' +
    'this book.' }),
  blk('table', 7, { caption: 'The 11 organ systems and what each one does',
    headers: ['System', 'Main job', 'Key organs'],
    rows: [
      ['Skeletal', 'Support, protect, move, store minerals', 'Bones, joints'],
      ['Muscular', 'Movement and posture', 'Skeletal muscles'],
      ['Circulatory (cardiovascular)', 'Transport blood, oxygen, food', 'Heart, blood vessels'],
      ['Respiratory', 'Take in oxygen, remove carbon dioxide', 'Lungs, airways'],
      ['Digestive', 'Break down food, absorb nutrients', 'Stomach, intestines, liver'],
      ['Nervous', 'Sense, decide, control, signal', 'Brain, spinal cord, nerves'],
      ['Endocrine', 'Control the body with hormones', 'Glands (e.g. thyroid, pancreas)'],
      ['Excretory (urinary)', 'Filter blood, remove liquid waste', 'Kidneys, bladder'],
      ['Reproductive', 'Produce offspring', 'Ovaries / testes'],
      ['Integumentary', 'Barrier, temperature, sense touch', 'Skin, hair, nails'],
      ['Immune (lymphatic)', 'Defend against germs, drain fluid', 'Lymph nodes, white blood cells'],
    ] }),
  blk('callout', 8, { variant: 'warning', title: 'When It Goes Wrong — One Failure Cascades',
    markdown: 'Because the systems depend on each other, a failure in one quickly spreads. If the **respiratory ' +
      'system** can’t take in oxygen, the **circulatory system** has nothing to deliver, so the **brain** and ' +
      'every other organ starve within minutes. This is why emergencies focus first on **airway, breathing and ' +
      'circulation** — the systems everything else relies on.' }),
  blk('heading', 9, { text: 'In real life: running a race uses every system', level: 2,
    objective: 'Identify several organ systems working together in one activity.' }),
  blk('text', 10, { markdown:
    'Sprint for a bus and the whole body works as one:\n\n' +
    '- **Nervous** system fires the order to move and steers your balance.\n' +
    '- **Muscular** system contracts; the **skeletal** system gives it bones to pull as levers.\n' +
    '- **Respiratory** system grabs more oxygen as you pant.\n' +
    '- **Circulatory** system speeds up to rush that oxygen to the muscles.\n' +
    '- **Integumentary** system (your skin) sweats to stop you overheating.\n\n' +
    'A single everyday act is really a whole orchestra of systems playing together.' }),
  blk('text', 11, { markdown:
    'Now that you can see how the body is built — cell to tissue to organ to system — we’ll open up those ' +
    'systems one at a time. We start with the framework that holds everything up: **the skeletal system**.' }),
  blk('reasoning_prompt', 12, { reasoning_type: 'logical',
    prompt: 'The skin is often called the largest organ in the body, yet it is the main part of the integumentary system. How can skin be both an organ and (almost) a whole system?',
    options: [
      'Because skin combines several tissues into one organ, and that organ plus hair and nails makes up the system — the same structure can be named at more than one level',
      'Because the words “organ” and “system” mean exactly the same thing',
      'Because skin is not really part of the body',
      'Because skin is made of only one tissue type',
    ],
    reveal: 'Levels of organisation are nested. Skin itself is an organ (several tissues — epithelial, ' +
      'connective, nervous — working together). Add hair, nails and glands and you have the integumentary ' +
      'system. Naming depends on the zoom level, which is why one structure can sit at more than one rung.',
    difficulty_level: 3 }),
  blk('callout', 13, { variant: 'remember', title: 'Remember',
    markdown: 'An **organ** = different **tissues** combined for one job (the heart uses all four tissue types). ' +
      'An **organ system** = **organs** combined for a bigger job. The body has **11 organ systems**, and they ' +
      'all depend on one another.' }),
  blk('inline_quiz', 14, { pass_threshold: 0.67, questions: [
    { id: u(), question: 'What best describes an organ?',
      options: ['A single type of cell on its own', 'A team of similar cells doing one job', 'A liquid that carries food around the body', 'Different tissues combined to do one bigger job'],
      correct_index: 3,
      explanation: 'An organ combines several tissue types for one job — the heart, for example, uses all four. A single cell type is just a cell, similar cells together are a tissue, and the carrying liquid is blood (a tissue).',
      difficulty_level: 2 },
    { id: u(), question: 'Which organ system takes in oxygen and removes carbon dioxide?',
      options: ['The circulatory system', 'The respiratory system', 'The digestive system', 'The excretory system'],
      correct_index: 1,
      explanation: 'The respiratory system (lungs and airways) handles the oxygen–carbon dioxide swap. The circulatory system then transports those gases, the digestive system handles food, and the excretory system removes liquid waste.',
      difficulty_level: 1 },
    { id: u(), question: 'Why do emergency responders check airway, breathing and circulation first?',
      options: ['Because those are the easiest systems to see', 'Because the skeletal system depends on them', 'Because if oxygen intake or blood flow stops, every other organ starves within minutes', 'Because the digestive system is the most important system'],
      correct_index: 2,
      explanation: 'Oxygen intake (breathing) and delivery (circulation) keep every organ alive, so their failure cascades fastest. The other choices misjudge which systems are most immediately life-critical.',
      difficulty_level: 2 },
  ] }),
];

const PAGES = [
  { slug: 'how-the-body-is-built-opener', title: 'How the Body Is Built', page_number: 0, page_type: 'chapter_opener',
    subtitle: 'From a single cell to a whole human — the front door to anatomy.', blocks: opener },
  { slug: 'the-ladder-of-life', title: 'The Ladder of Life', page_number: 1, page_type: 'lesson',
    subtitle: 'Cell → tissue → organ → organ system → organism: how the body is organised, smallest to largest.', blocks: ladder },
  { slug: 'the-cell-building-block', title: 'The Cell — Your Building Block', page_number: 2, page_type: 'lesson',
    subtitle: 'The smallest living unit, its main parts, and why it comes in so many shapes.', blocks: cell },
  { slug: 'the-four-tissue-types', title: 'The Four Tissue Types', page_number: 3, page_type: 'lesson',
    subtitle: 'Epithelial, connective, muscle and nervous — the four families every organ is built from.', blocks: tissues },
  { slug: 'organs-and-organ-systems', title: 'Organs & the 11 Systems', page_number: 4, page_type: 'lesson',
    subtitle: 'How tissues build organs, organs build systems, and the body’s 11 systems work as one.', blocks: systems },
];

(async () => {
  await withDb(async (db) => {
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const now = new Date();
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book not found — run create_anatomy_book.js first');

    const chapters = [...(book.chapters || [])];
    const skeletal = chapters.find((c) => c.slug === 'skeletal-system');
    const heart = chapters.find((c) => c.slug === 'heart-and-circulation');

    // 1) Renumber existing chapters by their page_ids (robust + idempotent).
    //    ORDER MATTERS: the unique index {book_id,chapter_number,page_number} means we
    //    must vacate the higher slot first. Move Heart 2→3 BEFORE Skeletal 1→2, else
    //    Skeletal's new chapter-2 pages collide with Heart's still-at-2 pages.
    if (heart) {
      heart.number = 3;
      if (heart.page_ids && heart.page_ids.length) {
        const r = await pages.updateMany({ _id: { $in: heart.page_ids } }, { $set: { chapter_number: 3, updated_at: now } });
        console.log('Heart → chapter 3:', r.modifiedCount, 'pages set');
      }
    }
    if (skeletal) {
      skeletal.number = 2;
      if (skeletal.page_ids && skeletal.page_ids.length) {
        const r = await pages.updateMany({ _id: { $in: skeletal.page_ids } }, { $set: { chapter_number: 2, updated_at: now } });
        console.log('Skeletal → chapter 2:', r.modifiedCount, 'pages set');
      }
    }

    // 2) Insert the new chapter's pages (additive; idempotent by slug). chapter_number = 1.
    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: book._id, slug: p.slug });
      if (existing) { console.log('page exists, skipping:', p.slug); pageIds.push(existing._id); continue; }
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

    // 3) Add / refresh the new chapter, then write the whole chapters array back
    //    sorted by number so the table of contents renders in order.
    let mine = chapters.find((c) => c.slug === CH.slug);
    if (!mine) {
      mine = { number: CH.number, title: CH.title, slug: CH.slug, page_ids: pageIds, description: CH.description, is_published: false };
      chapters.push(mine);
    } else {
      mine.number = CH.number; mine.title = CH.title; mine.description = CH.description; mine.page_ids = pageIds;
    }
    chapters.sort((a, b) => a.number - b.number);
    await books.updateOne({ _id: book._id }, { $set: { chapters, updated_at: now } });

    console.log('\nChapters now:', chapters.map((c) => `${c.number}. ${c.title}`).join(' | '));
    console.log('Orientation chapter:', pageIds.length, 'pages. All UNPUBLISHED.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
