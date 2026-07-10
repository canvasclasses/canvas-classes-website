'use strict';
/**
 * Appends the next four "full-depth" pages to the Skeletal System chapter of the
 * Anatomy & Physiology book (pages 2–5): Inside a Bone, The Chemistry of Bone,
 * Axial vs Appendicular, Joints. PURELY ADDITIVE (new pages only). Unpublished.
 *
 * Voice: simple, plain, global-classroom English — everyday word first, the
 * technical term in (brackets). Each page: hero + hook + concept + a gallery or
 * diagram + a mid-page reasoning check + a §3.6.1-compliant quiz. Images are
 * src:"" + generation_prompts (founder owns/fills); gallery panel prompts live in
 * an IMAGE_GENERATION_PROMPTS comment in the text block above each gallery.
 */
const { computeReadingTime, computeContentTypes, withDb } = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'anatomy-physiology';
const CH_NUMBER = 1;
const CH_SLUG = 'skeletal-system';

const u = () => uuidv4();
const blk = (type, order, extra) => ({ id: u(), type, order, ...extra });
const gi = (alt, caption) => ({ id: u(), src: '', alt, caption });

// ───────────────────────── PAGE 2: Inside a Bone ─────────────────────────
const insideABone = [
  blk('image', 0, {
    src: '', alt: 'A long bone cut open to show the hard outer shell and spongy inside', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5 ratio). A human thigh bone (femur) cut lengthwise to reveal ' +
      'its inside — a hard pale-ivory outer shell, a honeycomb-like spongy mesh near the ends, and a ' +
      'soft reddish marrow core. Warm side lighting, deep near-black background, photorealistic ' +
      'medical-illustration style. No text.',
  }),
  blk('callout', 1, {
    variant: 'fun_fact', title: 'Did you know?',
    markdown:
      'Bone is **alive**. It has its own blood supply and nerves, and your body is always breaking ' +
      'old bone down and building new bone. Bit by bit, you grow an almost-new skeleton roughly every ' +
      '**10 years**.',
  }),
  blk('text', 2, {
    markdown:
      'From the outside a bone looks like a solid, dry stick. Inside, it is partly hard, partly soft, ' +
      'and completely alive. Let’s open one up and look.',
  }),
  blk('heading', 3, { text: 'The parts of a long bone', level: 2,
    objective: 'Name the main parts of a long bone and what each one does.' }),
  blk('text', 4, {
    markdown:
      'A long bone, like the one in your thigh, has a few main parts:\n\n' +
      '- **The shaft** (the *diaphysis*) — the long middle tube. It is mostly hard bone, built to take your weight.\n' +
      '- **The two ends** (the *epiphyses*) — wider, so they can meet the next bone at a joint.\n' +
      '- **A thin outer skin** (the *periosteum*) — a living wrap full of blood vessels that feeds the bone and helps it heal.\n' +
      '- **Hard bone** (*compact bone*) — the dense outer layer that gives strength.\n' +
      '- **Spongy bone** — a light honeycomb mesh inside the ends; strong but not heavy.\n' +
      '- **Marrow** — the soft centre. **Red marrow** makes blood cells; **yellow marrow** stores fat.',
  }),
  blk('image', 5, {
    src: '', alt: 'Labelled diagram of a long bone showing shaft, ends, compact bone, spongy bone, marrow and periosteum',
    caption: '📸 The parts of a long bone, from the hard shaft to the soft marrow centre.',
    width: 'full', aspect_ratio: '4:3',
    generation_prompt:
      'Long bone (femur) anatomy diagram. A human thigh bone shown upright and cut open down the middle ' +
      'to reveal the inside. Clearly show and label: the long middle shaft (diaphysis), the two widened ' +
      'ends (epiphysis), the thin outer skin (periosteum), the dense hard outer layer (compact bone), ' +
      'the honeycomb mesh inside the ends (spongy bone), and the soft central marrow cavity. ' +
      'Anatomically accurate proportions, clean white labels with thin white leader lines, ivory bone ' +
      'colour, deep red marrow. Dark background (#0a0a0a), clean medical-illustration style. No clutter.',
  }),
  blk('heading', 6, { text: 'Hard bone and spongy bone', level: 2,
    objective: 'Explain the difference between compact (hard) and spongy bone and why the body uses both.' }),
  blk('text', 7, {
    markdown:
      'Bone comes in two textures, and your body cleverly uses both. **Compact (hard) bone** forms the ' +
      'dense outer wall — it takes the heavy loads. **Spongy bone** fills the ends with an open ' +
      'honeycomb — it keeps the bone light and leaves room for marrow. The three close-ups below show ' +
      'the difference.\n\n' +
      '<!--\nIMAGE_GENERATION_PROMPTS (gallery: bone-textures)\n' +
      'panel-1 (compact bone) — Microscope-style close-up of compact (hard) bone. Tightly packed ' +
      'concentric rings of bone (osteons / Haversian systems) with a tiny central canal in each. ' +
      'Ivory/cream colour, clean white labels, dark background (#0a0a0a), scientific illustration.\n' +
      'panel-2 (spongy bone) — Close-up of spongy bone: an open honeycomb lattice of thin bony struts ' +
      'with gaps between them, light and airy. Ivory colour, dark background (#0a0a0a), scientific illustration.\n' +
      'panel-3 (marrow) — Close-up of soft red bone marrow inside the spongy lattice, showing the ' +
      'blood-cell-making tissue. Deep red tissue against pale bone, dark background (#0a0a0a), scientific illustration.\n-->',
  }),
  blk('gallery', 8, {
    aspect_ratio: '4:3', figure_key: 'bone-textures',
    items: [
      gi('Close-up of compact (hard) bone showing tightly packed rings', 'Compact bone — dense and strong'),
      gi('Close-up of spongy bone showing an open honeycomb mesh', 'Spongy bone — light, with gaps'),
      gi('Close-up of red bone marrow inside spongy bone', 'Red marrow — the blood-cell factory'),
    ],
  }),
  blk('reasoning_prompt', 9, {
    reasoning_type: 'logical',
    prompt: 'The ends of a long bone are made of spongy bone, not solid hard bone. Why is that a smart design?',
    options: [
      'Spongy bone keeps the ends strong but much lighter, and leaves space for marrow',
      'Spongy bone is weaker, so the bone can break easily on purpose',
      'Spongy bone has no job — it is just empty space',
      'Spongy bone makes the bone heavier so you stay balanced',
    ],
    reveal:
      'Solid bone everywhere would be very heavy. The honeycomb of spongy bone is still strong along the ' +
      'lines of force, but uses far less material — so the bone stays light and there is room inside for ' +
      'marrow to make blood.',
    difficulty_level: 2,
  }),
  blk('callout', 10, {
    variant: 'remember', title: 'Remember',
    markdown:
      '**Compact bone = strength** (the hard outer wall). **Spongy bone = lightness + marrow** (the ' +
      'honeycomb inside the ends). Together they make a bone that is strong *and* light.',
  }),
  blk('inline_quiz', 11, {
    pass_threshold: 0.67,
    questions: [
      { id: u(), question: 'Which part of a long bone makes blood cells?',
        options: ['The dense compact bone', 'The red marrow', 'The outer periosteum', 'The cartilage at the joint'],
        correct_index: 1,
        explanation: 'Red marrow, in the soft centre, is the body’s blood-cell factory. Compact bone and the periosteum are structural, and joint cartilage cushions the ends — none of them make blood.',
        difficulty_level: 1 },
      { id: u(), question: 'What is the main job of the hard, dense compact bone on the outside?',
        options: ['To store fat', 'To make the bone bend easily', 'To give the bone its strength', 'To produce blood cells'],
        correct_index: 2,
        explanation: 'Compact bone is the dense outer wall that carries heavy loads — it gives strength. Fat is stored in yellow marrow, blood is made in red marrow, and bone is built to resist bending, not to bend.',
        difficulty_level: 1 },
      { id: u(), question: 'Why does the body use spongy bone inside the ends instead of solid bone?',
        options: ['To keep the bone light while still strong', 'To make the bone heavier', 'Because spongy bone cannot break', 'To stop blood from reaching the bone'],
        correct_index: 0,
        explanation: 'The honeycomb of spongy bone stays strong but uses much less material, keeping the bone light and leaving room for marrow. It is not heavier, it can still break, and bone is full of blood vessels.',
        difficulty_level: 2 },
    ],
  }),
];

// ─────────────────────── PAGE 3: The Chemistry of Bone ───────────────────────
const chemistryOfBone = [
  blk('image', 0, {
    src: '', alt: 'A glowing bone next to a crystal lattice, suggesting bone is part mineral', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5 ratio). On the left, a human bone in warm ivory; on the right, ' +
      'it dissolves into a glowing crystal lattice of tiny mineral blocks woven with fine rope-like ' +
      'protein fibres — showing that bone is part mineral, part protein. Deep near-black background, ' +
      'cool blue crystal glow meeting warm bone, clean science-illustration style. No text.',
  }),
  blk('callout', 1, {
    variant: 'fun_fact', title: 'Did you know?',
    markdown:
      'Gram for gram, bone is **stronger than steel** at resisting being squashed — yet it is light ' +
      'enough to carry around all day and it bends a little instead of shattering. The secret is what ' +
      'it is *made of*.',
  }),
  blk('text', 2, {
    markdown:
      'Why is bone hard like rock, but doesn’t shatter like glass? Because it is a **mix of two ' +
      'materials** working together — what engineers call a *composite*. Think of **reinforced ' +
      'concrete**: steel rods (bendy and tough) set inside concrete (hard but brittle). Bone uses the ' +
      'same trick, with a hard mineral and a stretchy protein.',
  }),
  blk('heading', 3, { text: 'The hard part: a calcium mineral', level: 2,
    objective: 'Name the mineral that makes bone hard and the elements it is built from.' }),
  blk('text', 4, {
    markdown:
      'About **two-thirds** of bone’s weight is a mineral called **hydroxyapatite**. It is built mostly ' +
      'from **calcium** and **phosphate** (plus a little hydroxide). This mineral is what makes bone ' +
      'hard and stiff — very good at resisting a squashing push.',
  }),
  blk('latex_block', 5, {
    latex: 'Ca_{10}(PO_4)_6(OH)_2',
    label: 'Hydroxyapatite — the mineral of bone',
    note: 'Ca = calcium, PO₄ = phosphate, OH = hydroxide. This hard crystal makes up most of bone’s weight.',
  }),
  blk('heading', 6, { text: 'The soft part: collagen', level: 2,
    objective: 'Explain how collagen keeps bone from being brittle.' }),
  blk('text', 7, {
    markdown:
      'Woven all through that mineral is **collagen** — a tough, rope-like protein. Collagen is stretchy, ' +
      'so it lets bone bend just a tiny bit and spring back, instead of snapping like glass.\n\n' +
      'On their own, neither part would work: **mineral alone is brittle** (it would crack), and ' +
      '**protein alone is too soft** (it would bend like rubber). Put them together and you get bone — ' +
      '**hard *and* tough** at the same time.\n\n' +
      '<!--\nIMAGE_GENERATION_PROMPTS (gallery: bone-composite)\n' +
      'panel-1 (the composite) — Cutaway showing bone as a composite: blue-grey mineral crystals tightly ' +
      'packed and bound together by fine pink rope-like collagen fibres running through them. Labels: ' +
      'mineral (hydroxyapatite), collagen fibres. Dark background (#0a0a0a), clean science illustration.\n' +
      'panel-2 (hydroxyapatite crystal) — A single hydroxyapatite crystal shown as a neat lattice of ' +
      'calcium and phosphate, cool blue glow, labelled. Dark background (#0a0a0a), science illustration.\n' +
      'panel-3 (collagen fibres) — Bundles of rope-like collagen protein fibres, pink/cream, twisted like ' +
      'rope, suggesting flexibility. Dark background (#0a0a0a), science illustration.\n-->',
  }),
  blk('gallery', 8, {
    aspect_ratio: '4:3', figure_key: 'bone-composite',
    items: [
      gi('Bone shown as mineral crystals bound by collagen fibres', 'Bone = hard mineral + stretchy collagen'),
      gi('A hydroxyapatite crystal lattice of calcium and phosphate', 'The mineral: hydroxyapatite'),
      gi('Rope-like bundles of collagen protein fibres', 'The protein: collagen (adds toughness)'),
    ],
  }),
  blk('heading', 9, { text: 'Bone is your calcium store', level: 2,
    objective: 'Describe how the body uses bone to keep blood calcium steady.' }),
  blk('text', 10, {
    markdown:
      'Calcium isn’t only for strong bones — your **heartbeat, nerves and muscles** all need a steady ' +
      'amount of calcium in the blood every second. Your bones hold about **99% of your body’s ' +
      'calcium**, so they act like a **calcium bank**.\n\n' +
      'Tiny chemical messengers (**hormones**) keep the blood level just right:\n\n' +
      '- When blood calcium drops too low, a hormone called **PTH** (parathyroid hormone) takes a little ' +
      'calcium *out* of bone and puts it into the blood.\n' +
      '- When blood calcium is high, a hormone called **calcitonin** puts calcium *back* into bone.\n' +
      '- **Vitamin D** helps your gut absorb calcium from food in the first place.',
  }),
  blk('heading', 11, { text: 'How bone is built — and lost', level: 2,
    objective: 'Outline how bone forms (ossification) and what makes bone weak.' }),
  blk('text', 12, {
    markdown:
      'A baby’s skeleton starts off mostly as soft, bendy **cartilage**. As the child grows, that ' +
      'cartilage slowly turns into hard bone — a process called **ossification**. Even in adults, bone ' +
      'is never finished: it is always being broken down and rebuilt.\n\n' +
      'If too much calcium leaves and not enough is replaced — from **old age, a poor diet, or too ' +
      'little vitamin D** — bones grow thin, weak and easy to break. This condition is called ' +
      '**osteoporosis**. That’s exactly why calcium-rich food (like milk and leafy greens) and vitamin ' +
      'D (sunlight) matter so much.',
  }),
  blk('reasoning_prompt', 13, {
    reasoning_type: 'analogical',
    prompt: 'Glass is hard but shatters; rubber bends but is too soft. Bone is hard AND doesn’t shatter. Which part of bone gives it that "doesn’t shatter" toughness?',
    options: [
      'The collagen protein, which is stretchy and lets bone bend a little',
      'The hydroxyapatite mineral, which is hard and stiff',
      'The calcium stored for the blood',
      'The marrow in the centre',
    ],
    reveal:
      'The mineral makes bone hard but, on its own, brittle (like glass). The stretchy collagen woven ' +
      'through it lets bone flex a tiny bit and absorb a knock instead of cracking — that’s the toughness.',
    difficulty_level: 3,
  }),
  blk('callout', 14, {
    variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
    markdown:
      '**Bone matrix:** about **65% mineral** (hydroxyapatite, $\\ce{Ca10(PO4)6(OH)2}$) + about **35% ' +
      'organic** (mostly collagen). Mineral → hardness; collagen → toughness.\n\n' +
      '**Calcium balance:** **PTH raises** blood calcium (pulls from bone); **calcitonin lowers** it ' +
      '(stores in bone); **vitamin D** aids calcium absorption from the gut.\n\n' +
      '**Classic trap:** PTH and calcitonin have *opposite* effects — don’t mix them up.',
  }),
  blk('inline_quiz', 15, {
    pass_threshold: 0.67,
    questions: [
      { id: u(), question: 'Which mineral makes up most of the hard part of bone?',
        options: ['Sodium chloride', 'Hydroxyapatite (calcium phosphate)', 'Iron oxide', 'Calcium carbonate only'],
        correct_index: 1,
        explanation: 'Bone’s hard mineral is hydroxyapatite, built mainly from calcium and phosphate. Table salt (sodium chloride) and rust (iron oxide) are not in bone, and bone mineral is phosphate-based, not plain carbonate.',
        difficulty_level: 1 },
      { id: u(), question: 'What would bone be like if it had its mineral but NO collagen?',
        options: ['Hard but brittle — it would crack easily', 'Soft and rubbery', 'Exactly the same as normal bone', 'Unable to store any calcium'],
        correct_index: 0,
        explanation: 'Collagen adds the stretch that lets bone bend a little. Without it, only the stiff mineral is left, so the bone would be hard but brittle and crack easily — like glass. Without mineral instead, bone would be soft and rubbery.',
        difficulty_level: 2 },
      { id: u(), question: 'Blood calcium has dropped too low. Which hormone raises it by taking calcium out of bone?',
        options: ['Calcitonin', 'Vitamin D', 'PTH (parathyroid hormone)', 'Collagen'],
        correct_index: 2,
        explanation: 'PTH raises blood calcium by releasing it from bone. Calcitonin does the opposite (stores calcium in bone), vitamin D helps absorb calcium from food, and collagen is a structural protein, not a hormone.',
        difficulty_level: 2 },
    ],
  }),
];

// ─────────────────── PAGE 4: Axial vs Appendicular ───────────────────
const axialAppendicular = [
  blk('image', 0, {
    src: '', alt: 'Skeleton with the central bones and the limb bones shown in two different colours', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5 ratio). A full human skeleton where the central bones (skull, ' +
      'spine, ribs, breastbone) glow one warm colour and the limb bones (arms, legs and their girdles) ' +
      'glow a second cool colour — clearly showing the body splits into two bone groups. Deep near-black ' +
      'background, clean medical-illustration style. No text.',
  }),
  blk('callout', 1, {
    variant: 'fun_fact', title: 'Did you know?',
    markdown:
      'Every single one of your **206 bones** belongs to one of just **two groups**. Learn the split ' +
      'and the whole skeleton suddenly makes sense.',
  }),
  blk('text', 2, {
    markdown:
      'To make 206 bones easier to handle, we sort them into two teams by **where they sit** and **what ' +
      'they do**: the **axial** skeleton (the central core) and the **appendicular** skeleton (the limbs).',
  }),
  blk('heading', 3, { text: 'The axial skeleton — the central core (80 bones)', level: 2,
    objective: 'List the bones of the axial skeleton and its main job.' }),
  blk('text', 4, {
    markdown:
      'The **axial** skeleton is the bony core running down the middle of your body (think of it as the ' +
      '*axis*):\n\n' +
      '- the **skull**\n- the **spine** (vertebral column)\n- the **ribs**\n- the **breastbone** (sternum)\n' +
      '- the tiny **hyoid** bone in the throat\n\n' +
      'Its main job is **protection and support**: it shields the brain, spinal cord, heart and lungs, ' +
      'and holds the body up.',
  }),
  blk('heading', 5, { text: 'The appendicular skeleton — the limbs (126 bones)', level: 2,
    objective: 'List the parts of the appendicular skeleton and its main job.' }),
  blk('text', 6, {
    markdown:
      'The **appendicular** skeleton is everything that hangs off the core — your **arms and legs**, ' +
      'plus the two **girdles** that join them to the body:\n\n' +
      '- the **shoulder girdle** (pectoral girdle) — collarbones and shoulder blades\n' +
      '- the **arms and hands**\n- the **hip girdle** (pelvic girdle)\n- the **legs and feet**\n\n' +
      'Its main job is **movement** — reaching, gripping, walking and running.',
  }),
  blk('heading', 7, { text: 'See the split in 3D', level: 2,
    objective: 'Use the model to tell axial from appendicular bones.' }),
  blk('text', 8, {
    markdown:
      'Open the model below and tap the **Axial** and **Appendicular** buttons. Watch the two groups ' +
      'light up so you can see exactly which bones belong where.',
  }),
  blk('simulation', 9, {
    simulation_id: 'skeleton-3d',
    title: 'Axial vs Appendicular — 3D',
    prediction: {
      prompt: 'Which group do you think the rib cage belongs to?',
      options: ['Axial (central core)', 'Appendicular (limbs)', 'Both', 'Neither'],
      reveal_after:
        'The ribs are **axial** — they are part of the central core that protects the heart and lungs. ' +
        'Tap the "Axial" button in the model to see them light up.',
    },
  }),
  blk('table', 10, {
    caption: 'How the 206 bones split (the usual NEET counts)',
    headers: ['Axial (80)', 'Count', 'Appendicular (126)', 'Count'],
    rows: [
      ['Skull', '22', 'Shoulder girdle', '4'],
      ['Ear bones', '6', 'Arms + hands', '60'],
      ['Hyoid', '1', 'Hip girdle', '2'],
      ['Spine (vertebrae)', '26', 'Legs + feet', '60'],
      ['Ribs', '24', '', ''],
      ['Breastbone', '1', '', ''],
      ['Total', '80', 'Total', '126'],
    ],
  }),
  blk('reasoning_prompt', 11, {
    reasoning_type: 'logical',
    prompt: 'Your collarbone connects your arm to your chest. Which group does it belong to — axial or appendicular?',
    options: [
      'Appendicular — it is part of the shoulder girdle that attaches the arm',
      'Axial — because it touches the chest',
      'Both, equally',
      'Neither — it is a separate group',
    ],
    reveal:
      'The collarbone is part of the **shoulder (pectoral) girdle**, whose whole job is to attach the ' +
      'arm to the body. Girdles count as **appendicular** even though they sit near the core.',
    difficulty_level: 3,
  }),
  blk('callout', 12, {
    variant: 'remember', title: 'Remember',
    markdown:
      '**Axial = central core** (skull, spine, ribs, breastbone, hyoid) = **80 bones**.\n' +
      '**Appendicular = limbs + their girdles** = **126 bones**.\n' +
      '**80 + 126 = 206.** The girdles go with the limbs they carry, not the core.',
  }),
  blk('inline_quiz', 13, {
    pass_threshold: 0.67,
    questions: [
      { id: u(), question: 'Which of these is part of the AXIAL skeleton?',
        options: ['The thigh bone (femur)', 'The skull', 'The shoulder blade', 'The hand bones'],
        correct_index: 1,
        explanation: 'The skull is part of the central axis (axial). The femur, shoulder blade and hand bones are all limbs or girdles, which are appendicular.',
        difficulty_level: 1 },
      { id: u(), question: 'How do the 206 bones split between the two groups?',
        options: ['126 axial and 80 appendicular', '80 axial and 126 appendicular', '100 axial and 106 appendicular', '53 axial and 153 appendicular'],
        correct_index: 1,
        explanation: 'The central core (axial) has 80 bones; the limbs and girdles (appendicular) have 126. They add to 206. Swapping the numbers is the classic trap — the limbs outnumber the core.',
        difficulty_level: 1 },
      { id: u(), question: 'Why are the shoulder and hip girdles counted as appendicular, not axial?',
        options: ['Because their job is to attach the limbs to the body', 'Because they protect the brain', 'Because they are part of the spine', 'Because they make blood cells'],
        correct_index: 0,
        explanation: 'Girdles exist to join the arms and legs (the limbs) to the core, so they belong with the appendicular group. They do not protect the brain or form the spine — those are axial roles.',
        difficulty_level: 2 },
    ],
  }),
];

// ─────────────────────── PAGE 5: Joints ───────────────────────
const joints = [
  blk('image', 0, {
    src: '', alt: 'Close-up of a knee joint where two bones meet, with smooth cushioned ends', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5 ratio). A close-up of a human knee joint — the thigh bone ' +
      'meeting the shin bone, their ends capped with smooth glossy cartilage and bound by pale ' +
      'ligaments. Warm side lighting, deep near-black background, photorealistic medical-illustration ' +
      'style. No text.',
  }),
  blk('callout', 1, {
    variant: 'fun_fact', title: 'Did you know?',
    markdown:
      'If your skeleton were one solid piece of bone, you couldn’t move at all — not even sit down. ' +
      'Everything you do depends on the places where bones **meet**.',
  }),
  blk('text', 2, {
    markdown:
      'A **joint** is simply a place where two bones meet. Some joints don’t move at all, some move a ' +
      'little, and some move freely. The freely-moving ones do almost all of your everyday movement.',
  }),
  blk('heading', 3, { text: 'Three kinds of joints (by how much they move)', level: 2,
    objective: 'Sort joints into fixed, slightly movable and freely movable, with an example of each.' }),
  blk('text', 4, {
    markdown:
      '1. **Fixed joints** (no movement) — the plates of the **skull** are locked together by zig-zag ' +
      'seams called *sutures*. Great for protecting the brain.\n' +
      '2. **Slightly movable joints** — the bones of your **spine** are separated by soft discs that let ' +
      'each one shift just a little; together they let your back bend.\n' +
      '3. **Freely movable joints** (*synovial* joints) — the **knee, elbow, shoulder and hip**. These ' +
      'do most of your moving.',
  }),
  blk('heading', 5, { text: 'Inside a freely movable joint', level: 2,
    objective: 'Name the parts that let a joint move smoothly without wearing out.' }),
  blk('text', 6, {
    markdown:
      'A freely movable joint is built to glide without grinding:\n\n' +
      '- **Cartilage** — a smooth, slippery cap on each bone end that cushions the bones and stops them ' +
      'scraping.\n' +
      '- **Joint fluid** (synovial fluid) — a thin, slippery liquid that oils the joint, like oil in a hinge.\n' +
      '- **Ligaments** — tough straps that tie **bone to bone** and hold the joint together.\n\n' +
      '> *Quick word check:* a **ligament** joins **bone to bone**; a **tendon** joins **muscle to bone**. ' +
      'Easy to mix up.',
  }),
  blk('heading', 7, { text: 'See the joints in 3D', level: 2,
    objective: 'Find ligaments and joint cartilage on the model.' }),
  blk('text', 8, {
    markdown:
      'Open the model and turn on the **“Ligaments + joint cartilage”** layer, then zoom into a knee. ' +
      'Watch the smooth cartilage caps and the straps that hold the joint together appear.',
  }),
  blk('simulation', 9, {
    simulation_id: 'skeleton-3d',
    title: 'Joints, cartilage & ligaments — 3D',
    prediction: {
      prompt: 'A ligament connects…',
      options: ['Bone to bone', 'Muscle to bone', 'Muscle to muscle', 'Skin to bone'],
      reveal_after:
        'A **ligament joins bone to bone** and holds a joint together. (A *tendon* is the one that joins ' +
        'muscle to bone.) Turn on the ligaments layer to see them wrapping each joint.',
    },
  }),
  blk('text', 10, {
    markdown:
      'Freely movable joints come in different shapes, and the shape decides how they move. The three ' +
      'below are the ones to know.\n\n' +
      '<!--\nIMAGE_GENERATION_PROMPTS (gallery: joint-types)\n' +
      'panel-1 (ball-and-socket) — A ball-and-socket joint (hip or shoulder): the rounded head of one ' +
      'bone sitting in a cup of another, arrows showing it can swing in all directions. Ivory bone, ' +
      'white labels, dark background (#0a0a0a), clean medical illustration.\n' +
      'panel-2 (hinge) — A hinge joint (elbow or knee): two bones meeting like a door hinge, arrow ' +
      'showing it bends back and forth in one direction only. Ivory bone, white labels, dark background ' +
      '(#0a0a0a), clean medical illustration.\n' +
      'panel-3 (pivot) — A pivot joint (top of the neck): one bone rotating around another, arrow ' +
      'showing a turning/rotating motion (shaking the head "no"). Ivory bone, white labels, dark ' +
      'background (#0a0a0a), clean medical illustration.\n-->',
  }),
  blk('gallery', 11, {
    aspect_ratio: '4:3', figure_key: 'joint-types',
    items: [
      gi('A ball-and-socket joint like the hip or shoulder', 'Ball-and-socket — swings every way (hip, shoulder)'),
      gi('A hinge joint like the elbow or knee', 'Hinge — bends one way (elbow, knee)'),
      gi('A pivot joint at the top of the neck', 'Pivot — rotates/turns (neck)'),
    ],
  }),
  blk('reasoning_prompt', 12, {
    reasoning_type: 'logical',
    prompt: 'Over many years, the smooth cartilage in someone’s knee slowly wears away. What is the most likely result?',
    options: [
      'The bones rub directly and the joint becomes stiff and painful',
      'The joint moves more smoothly than before',
      'The bone ends start making blood cells',
      'The ligaments turn into cartilage to replace it',
    ],
    reveal:
      'Cartilage is the smooth cushion that stops bone ends scraping. If it wears away, bone grinds on ' +
      'bone — stiff, painful movement. This is what happens in arthritis. The body can’t simply regrow it ' +
      'or swap ligaments in to replace it.',
    difficulty_level: 3,
  }),
  blk('callout', 13, {
    variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
    markdown:
      '**Joint types by movement:** *fibrous* (fixed, e.g. skull sutures) · *cartilaginous* (slightly ' +
      'movable, e.g. between vertebrae) · *synovial* (freely movable, e.g. knee).\n\n' +
      '**Synovial shapes:** ball-and-socket (hip, shoulder) move in all directions; hinge (elbow, knee) ' +
      'move one way; pivot (atlas–axis, neck) rotate.\n\n' +
      '**Classic trap:** **ligament = bone-to-bone**, **tendon = muscle-to-bone**.',
  }),
  blk('inline_quiz', 14, {
    pass_threshold: 0.67,
    questions: [
      { id: u(), question: 'Which type of joint allows NO movement?',
        options: ['The hinge joint at the elbow', 'The fixed joints (sutures) of the skull', 'The ball-and-socket joint at the hip', 'The pivot joint in the neck'],
        correct_index: 1,
        explanation: 'The skull’s sutures are fixed joints that lock the bones together to protect the brain. The elbow, hip and neck joints are all freely movable (synovial) joints.',
        difficulty_level: 1 },
      { id: u(), question: 'What does a ligament connect?',
        options: ['Muscle to bone', 'Bone to bone', 'Skin to muscle', 'Nerve to bone'],
        correct_index: 1,
        explanation: 'A ligament ties bone to bone to hold a joint together. The strap that joins muscle to bone is a tendon — the classic mix-up.',
        difficulty_level: 1 },
      { id: u(), question: 'The hip lets your leg swing forwards, backwards and out to the side. Which joint shape allows movement in all these directions?',
        options: ['Hinge joint', 'Fixed joint', 'Ball-and-socket joint', 'Pivot joint'],
        correct_index: 2,
        explanation: 'A ball-and-socket joint (rounded head sitting in a cup) swings in all directions, which is why the hip is so mobile. A hinge moves only one way, a pivot only rotates, and a fixed joint does not move.',
        difficulty_level: 2 },
    ],
  }),
];

const NEW_PAGES = [
  { slug: 'inside-a-bone', title: 'Inside a Bone', page_number: 2,
    subtitle: 'Bone is alive — part hard, part spongy, with a blood-making centre.', blocks: insideABone },
  { slug: 'the-chemistry-of-bone', title: 'The Chemistry of Bone', page_number: 3,
    subtitle: 'Why bone is hard like rock yet doesn’t shatter like glass — and how it stores your calcium.', blocks: chemistryOfBone },
  { slug: 'axial-and-appendicular', title: 'Two Groups: Axial and Appendicular', page_number: 4,
    subtitle: 'How the 206 bones split into the central core (80) and the limbs (126).', blocks: axialAppendicular },
  { slug: 'joints-where-bones-meet', title: 'Joints: Where Bones Meet', page_number: 5,
    subtitle: 'Fixed, slightly movable and freely movable joints — and what’s inside a moving joint.', blocks: joints },
];

(async () => {
  await withDb(async (db) => {
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const now = new Date();
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book not found — run create_anatomy_book.js first');

    const chapter = (book.chapters || []).find((c) => c.slug === CH_SLUG);
    const pageIds = [...(chapter ? chapter.page_ids : [])];

    for (const p of NEW_PAGES) {
      const existing = await pages.findOne({ book_id: book._id, slug: p.slug });
      if (existing) { console.log('exists, skipping:', p.slug); if (!pageIds.includes(existing._id)) pageIds.push(existing._id); continue; }
      const doc = {
        _id: uuidv4(), book_id: book._id,
        chapter_number: CH_NUMBER, page_number: p.page_number,
        slug: p.slug, title: p.title, subtitle: p.subtitle,
        blocks: p.blocks, page_type: 'lesson', published: false,
        reading_time_min: computeReadingTime(p.blocks),
        content_types: computeContentTypes(p.blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      };
      await pages.insertOne(doc);
      pageIds.push(doc._id);
      console.log('created:', p.slug, '·', doc.reading_time_min, 'min ·', doc.content_types.join('/'));
    }

    await books.updateOne(
      { _id: book._id, 'chapters.slug': CH_SLUG },
      { $set: { 'chapters.$.page_ids': pageIds, updated_at: now } },
    );
    console.log('chapter now has', pageIds.length, 'pages. All UNPUBLISHED.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
