// Setup script: Class 9 ICT — Chapter 8: Fun with Logic (4 pages).
// Sequence/logic + Scratch (MIT) tutorial. Page 1 concept (no video);
// pages 2-4 video-driven. English-only, published:false.
// Content traced to ~/Downloads/Class 9 ICT/iict108.pdf. Idempotent.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 8;

let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt });
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const video = (caption) => ({ id: uuidv4(), type: 'video', order: _o++, src: '', provider: 'r2_direct', caption, duration_sec: 0 });
const table = (caption, headers, rows) => ({ id: uuidv4(), type: 'table', order: _o++, caption, headers, rows });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why })) });

const PAGES = [];

// Page 1 — The power of the right sequence (concept, no video)
reset();
PAGES.push({
  slug: 'logic-and-sequence', title: 'The Power of the Right Sequence', page_number: 1,
  blocks: [
    hero('A flowchart of ordered steps with one missing step breaking the result',
      'A dark-canvas illustration of a numbered step sequence flowing into a result, with one step (number 3) greyed out and a red cross showing the task fails because a step was skipped. A checklist and a verify-tick sit alongside. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'One missed step, one failed task',
      `Jason had to open a bank account to receive his scholarship. He followed the steps — but his account was rejected! The reason? He'd **skipped one step**: signing the form. The moment he added his signature, it worked. A single step, out of place or missing, can break the whole task.`),
    heading('Why sequence matters'),
    text(`To finish any task and get the result you want, the instructions must be **clear, sequential and logical**. Change the order, or drop a step, and the outcome changes — usually for the worse.\n\nThe reliable way to plan any task has four steps:\n\n1. **Identify the output** — know exactly what result you want\n2. **Analyse** — work out the instructions needed; if there are several solutions, pick the best\n3. **Finalise the instructions** — put them in the correct, logical sequence\n4. **Verify the output** — check the result matches what you wanted in step 1\n\nThis is the same thinking a computer needs — it does *exactly* what you tell it, in *exactly* the order you say.`),
    callout('remember', 'Computers are very literal',
      `A computer follows your instructions to the letter — it won't guess what you "meant". So the clearer and more correctly ordered your steps, the better the result. This careful, step-by-step thinking is the heart of programming.`),
    callout('note', 'Try it yourself — Activity',
      `Write the steps to **listen to the Prime Minister's address on the radio** on Independence Day. Hand your steps to a friend to follow exactly. Did they succeed? Now **swap two of the steps** and try again — what happens to the result?`),
    quiz([
      { q: 'Why could Jason\'s bank account not be opened at first?', opts: ['The bank was closed', 'He skipped a step — signing the form', 'He had too much money', 'He filled it too quickly'], a: 1, why: 'He missed step 3 (signing); completing every step in order made the task succeed.' },
      { q: 'What is the FIRST step in planning a task?', opts: ['Verify the output', 'Clearly identify the output you want', 'Give instructions randomly', 'Skip analysis'], a: 1, why: 'First identify the output you want, then analyse, finalise instructions, and verify.' },
      { q: 'Why must instructions to a computer be clear and correctly ordered?', opts: ['Computers ignore instructions', 'A computer does exactly what it is told, in the given order', 'Order never matters', 'Computers guess your meaning'], a: 1, why: 'Computers are literal — they follow instructions exactly and in sequence, so clarity and order are essential.' },
    ]),
  ],
});

// Page 2 — Meet Scratch
reset();
PAGES.push({
  slug: 'meet-scratch', title: 'Meet Scratch: Coding with Blocks', page_number: 2,
  blocks: [
    hero('The Scratch interface with the cat sprite, block palette and script area',
      'A dark-canvas view of the Scratch interface: a stage on the right with the orange cat sprite, a palette of colourful drag-and-drop instruction blocks on the left, and a script area where Move and Turn blocks are snapped together. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Coding without typing',
      `Imagine helping a lost cat find its way home by giving it instructions — "move forward 10 steps, turn right". With **Scratch**, you can do exactly that on screen, by **dragging and dropping blocks** instead of typing code. It makes logic playful.`),
    heading('What Scratch is'),
    text(`**Scratch** is a free **programming language** developed by **MIT in 2005**. With simple drag-and-drop instructions you can build your own **stories, games and animations**. It works **offline or online** — download it from **scratch.mit.edu**, or create and share projects right in your browser.\n\nKey words in Scratch:\n\n- **Sprite** — any object on screen: a person, animal, vehicle, building, even text\n- **Stage** — the area where your sprites act out the result\n- **Script area** — where you snap instruction blocks together`),
    heading('Making a sprite move'),
    text(`To move a sprite along a path, **choose an instruction block** (like *move 10 steps* or *turn 90 degrees*) and **drag it to the script area**. Snap the blocks in a **logical sequence**, then **run** the script to watch the sprite move on the stage. If the cat ends up in the wrong place, your sequence needs fixing — exactly the logic from page 1, now in action.`),
    video('Watch: open Scratch, drag Move and Turn blocks into a sequence, and run the cat sprite.'),
    callout('note', 'Try it yourself — Activity',
      `In Scratch, build a script that makes the cat sprite trace a simple path — for example a square. Use **move** and **turn** blocks in sequence, then run it. If the path is wrong, adjust the order of your blocks and try again.`),
    quiz([
      { q: 'Scratch is a…', opts: ['Photo editor', 'Free programming language for stories, games and animations', 'Web browser', 'Spreadsheet'], a: 1, why: 'Scratch is a free programming language (from MIT, 2005) for building stories, games and animations.' },
      { q: 'In Scratch, every object on screen — a cat, a person, even text — is called a…', opts: ['Stage', 'Sprite', 'Script', 'Block'], a: 1, why: 'Each object on the Scratch window is called a sprite.' },
      { q: 'How do you give instructions to a sprite in Scratch?', opts: ['Type long code', 'Drag and drop instruction blocks in sequence', 'Print them', 'Email them'], a: 1, why: 'Scratch uses drag-and-drop blocks snapped together in a logical sequence.' },
    ]),
  ],
});

// Page 3 — Sprites, costumes, backdrops, sounds, coordinates
reset();
PAGES.push({
  slug: 'scratch-sprites-and-stage', title: 'Sprites, Costumes, Backdrops and Sounds', page_number: 3,
  blocks: [
    hero('A Scratch stage as an x-y plane with underwater sprites, costumes and a backdrop',
      'A dark-canvas illustration of the Scratch stage shown as an x-y coordinate grid with (0,0) at the centre, an underwater backdrop, several animal sprites placed at coordinates, a costume strip and a sound icon. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'A cast for your story',
      `Scratch isn't just moving shapes — you can stage a whole **animated story**. For an underwater tale about water pollution, you'd cast a starfish, an octopus, a whale and a fish, give them a watery world to live in, and let them speak.`),
    heading('Adding and removing sprites'),
    text(`Scratch has an inbuilt **library of sprites** to choose from. When you open Scratch, a default **cat sprite** sits in the centre — if your story doesn't need it, just **delete** it. You can **add** as many sprites as you like, including a **text sprite** for an on-screen message like "Stop Water Pollution".`),
    heading('Positioning with coordinates'),
    text(`The stage works like a **coordinate plane** with **x and y** values. The centre is **(0, 0)**; the coordinates range up to about **240** and down to **−180**. As you move the mouse on the stage, the x and y values update at the bottom-right. You use these coordinates to tell a sprite exactly where to move.`),
    heading('Backdrops, costumes and sounds'),
    text(`Three finishing touches bring a scene to life:\n\n- **Backdrop** — the background of the stage (e.g. an underwater world instead of plain white)\n- **Costume** — a different *form* of a sprite; add several costumes to make a sprite look like it's moving or changing\n- **Sound** — audio attached to a sprite, like a cough or water ripples`),
    video('Watch: add sprites, delete the default cat, set a backdrop, and add costumes and sounds.'),
    callout('note', 'Try it yourself — Activity',
      `Start a new Scratch project. **Delete** the default cat, **add** two sprites of your choice, and give the stage a **backdrop**. Move a sprite to the centre (coordinates 0, 0) and then to another spot — watch the x and y values change.`),
    quiz([
      { q: 'What are the coordinates of the centre of the Scratch stage?', opts: ['(240, 240)', '(0, 0)', '(−180, −180)', '(100, 100)'], a: 1, why: 'The centre of the stage is (0, 0) on the x-y coordinate plane.' },
      { q: 'A different form of a sprite (to show movement or change) is called a…', opts: ['Backdrop', 'Costume', 'Script', 'Stage'], a: 1, why: 'A costume is an alternate form of a sprite; you can add several per sprite.' },
      { q: 'The background of the Scratch stage is called the…', opts: ['Costume', 'Sprite', 'Backdrop', 'Block'], a: 2, why: 'The backdrop is the stage background — e.g. an underwater scene.' },
    ]),
  ],
});

// Page 4 — Scripting an animated story
reset();
PAGES.push({
  slug: 'scratch-scripting-a-story', title: 'Scripting an Animated Story', page_number: 4,
  blocks: [
    hero('Instruction blocks stacked into a script and an animated story playing on stage',
      'A dark-canvas illustration of a tall stack of snapped-together instruction blocks (move, say, play sound, when green flag clicked) beside the stage where underwater sprites act out a story with speech bubbles. A green flag glows at the top. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Instructions become a story',
      `Once your cast and stage are ready, you bring them to life with a **script** — a stack of instructions, in logical order, telling each sprite when to move, speak, change costume and make sound. Click the green flag, and your story plays.`),
    heading('What a script is'),
    text(`A **script** is the set of instructions for a sprite, given in a **logical sequence**. Each sprite gets its own script covering its every action — movement, speech, sound, costume change. You **drag** instruction blocks from the Scripts tab into the script area, and they run **in the exact order you stack them**.`),
    table('Some common Scratch instruction blocks',
      ['Category', 'Example block', 'What it does'],
      [
        ['Motion', 'Move n steps / Turn n degrees', 'Moves or turns the sprite'],
        ['Motion', 'Glide n secs to x, y', 'Glides the sprite to coordinates over time'],
        ['Looks', 'Say <text> for n secs', 'Shows text in a speech bubble'],
        ['Looks', 'Switch costume / Hide / Show', 'Changes the sprite\'s form or visibility'],
        ['Sound', 'Play sound <audio>', 'Plays an attached sound'],
        ['Events', 'When green flag clicked', 'Starts the script'],
        ['Control', 'Wait n secs', 'Pauses before the next block'],
      ]),
    video('Watch: stack instruction blocks into scripts for several sprites and play the animated story.'),
    callout('note', 'Try it yourself — Activity',
      `Create an animation in which **your name appears letter by letter** (hint: use letter sprites). Then answer: How many sprites did you add? Did you add a costume? Did you add sound? Did you run it in **full-screen** mode?`),
    quiz([
      { q: 'In Scratch, the set of instructions for a sprite in logical order is called a…', opts: ['Costume', 'Script', 'Backdrop', 'Sprite'], a: 1, why: 'A script is the ordered set of instructions controlling a sprite\'s actions.' },
      { q: 'Which block typically STARTS a Scratch script?', opts: ['Wait n secs', 'When green flag clicked', 'Hide', 'Move 10 steps'], a: 1, why: 'The "When green flag clicked" event block runs the script.' },
      { q: 'The instruction blocks in a script run…', opts: ['In a random order', 'In the exact order you stack them', 'All at once', 'Backwards'], a: 1, why: 'Blocks execute in the same sequence in which you stack them — order matters.' },
    ]),
  ],
});

// ─── Insert ────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found.`);
    const ch = (book.chapters || []).find(c => c.number === CHAPTER_NO);
    if (!ch) throw new Error(`Chapter ${CHAPTER_NO} shell missing.`);
    console.log(`✓ Found book: ${book.title} (${book._id})`);
    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) { console.log(`  ⤷ "${p.slug}" exists — skipping.`); pageIds.push(String(existing._id)); continue; }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId, book_id: String(book._id), chapter_number: CHAPTER_NO,
        page_number: p.page_number, slug: p.slug, title: p.title, blocks: p.blocks,
        hinglish_blocks: [], tags: [], published: false, reading_time_min: 5,
        created_at: new Date(), updated_at: new Date(),
      });
      pageIds.push(pageId);
      console.log(`  ✓ Created page ${p.page_number}: ${p.slug} (${p.blocks.length} blocks)`);
    }
    const toAdd = pageIds.filter(id => !(ch.page_ids || []).includes(id));
    if (toAdd.length) {
      await books.updateOne({ _id: book._id, 'chapters.number': CHAPTER_NO },
        { $push: { 'chapters.$.page_ids': { $each: toAdd } }, $set: { updated_at: new Date() } });
      console.log(`✓ Wired ${toAdd.length} page(s) into Chapter ${CHAPTER_NO}.`);
    } else console.log('✓ All pages already wired.');
    console.log('\n✅ Chapter 8: Fun with Logic — setup complete.');
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
