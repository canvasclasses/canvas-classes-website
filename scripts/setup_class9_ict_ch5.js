// Setup script: Class 9 ICT — Chapter 5: Presenting Ideas (4 pages).
// LibreOffice Impress tutorial — VIDEO-DRIVEN. English-only, published:false.
// Content traced to ~/Downloads/Class 9 ICT/iict105.pdf. Idempotent.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 5;

let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt });
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const video = (caption) => ({ id: uuidv4(), type: 'video', order: _o++, src: '', provider: 'r2_direct', caption, duration_sec: 0 });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why })) });

const PAGES = [];

// Page 1 — First presentation in Impress
reset();
PAGES.push({
  slug: 'impress-first-presentation', title: 'Your First Presentation in Impress', page_number: 1,
  blocks: [
    hero('The LibreOffice Impress interface with a title slide and a slides panel',
      'A dark-canvas view of the Impress interface: a large title slide in the centre reading "Historical Places of Delhi", a slides thumbnail panel on the left, and a layout chooser on the right showing different text/picture arrangements. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Sharing a trip they couldn\'t join',
      `Samayra and Shirom explored Delhi's monuments — but some classmates missed the trip. A plain report wouldn't capture the experience, so they built a **presentation**: slides of text, images, audio, video, even their own narration. It's the next best thing to being there.`),
    heading('What a presentation is, and meeting Impress'),
    text(`A **presentation** shares information across **slides** using text, images, audio, video and animations — you can even add your own voice narration. The tool here is **Impress**, the free, open-source presentation app from the LibreOffice Suite.\n\nOpen it from the **Impress icon** on the desktop. A blank presentation starts with a slide in the **Title Layout**. A **layout** decides *where* text and pictures sit on a slide — you can pick from several.`),
    heading('Building your first slides'),
    text(`Start with the **title slide**: type a **title** in the top placeholder (e.g. "Historical Places of Delhi") and a **subtitle** below it — you can even add your names.\n\nOne slide isn't enough for a whole trip, so **add more slides**. On each, type your **text content** in its placeholders. Slide by slide, your story takes shape.`),
    video('Watch: open Impress, create a title slide, add more slides, and type text content.'),
    callout('note', 'Try it yourself — Activity',
      `Start a presentation on **"Experience of Summer Vacation"**. Make a **title slide** with a title and your name, then **add two more slides** with text about where you went and what you did. Try choosing a different **layout** for one of them.`),
    quiz([
      { q: 'What is Impress used for?', opts: ['Editing photos', 'Making presentations with slides', 'Recording audio', 'Browsing the web'], a: 1, why: 'Impress is the free, open-source presentation tool from LibreOffice — it makes slide presentations.' },
      { q: 'A slide\'s "layout" decides…', opts: ['The file format', 'Where text and pictures are placed on the slide', 'The audio quality', 'The print colour'], a: 1, why: 'Layout controls the placement of text and pictures on a slide.' },
      { q: 'When you open a blank presentation, the first slide uses which layout by default?', opts: ['Blank Layout', 'Title Layout', 'Image Layout', 'PDF Layout'], a: 1, why: 'A new presentation opens with a slide in the Title Layout by default.' },
    ]),
  ],
});

// Page 2 — Images, animation, transitions
reset();
PAGES.push({
  slug: 'impress-images-animation-transitions', title: 'Images, Animation and Transitions', page_number: 2,
  blocks: [
    hero('A slide with an inserted monument photo, animation effects and a transition arrow',
      'A dark-canvas Impress slide showing a photo of the Red Fort being inserted, sparkle marks indicating a custom animation on the text, and a curved arrow between two slide thumbnails to suggest a transition effect. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Catch the eye — but don\'t overdo it',
      `A few well-placed effects make a presentation pop. But pile on too many and the audience forgets your actual message. The skill is using animation to *guide* attention, not steal it.`),
    heading('Inserting images'),
    text(`To add a picture — say, the Red Fort — use the **Insert Menu** and choose the image. Pictures turn a wall of text into something your audience actually wants to look at.`),
    heading('Animation and slide transitions'),
    text(`**Custom animation** adds emphasis to a chosen object or piece of text. Select the text or object, then apply an effect — you might change the **font size** or make text **Blink**, and save that effect.\n\n**Slide transition** controls how one slide gives way to the next; add it from the **View menu**. A golden rule: **avoid too many animations** on a slide — they reduce focus on your main content.`),
    video('Watch: insert an image, add a custom animation, and apply a slide transition.'),
    callout('remember', 'Less is more',
      `Custom animation should *highlight* one important thing, not decorate everything. One tasteful effect beats ten distracting ones.`),
    callout('note', 'Try it yourself — Activity',
      `On a slide, **insert an image** using the Insert menu. Add **one** custom animation to the title (not more), then apply a **slide transition** between two slides. Notice how a single effect draws the eye without cluttering the slide.`),
    quiz([
      { q: 'How do you add a picture to a slide?', opts: ['Insert Menu → image', 'File → Print', 'Tools → Crop', 'Edit → Delete'], a: 0, why: 'Use the Insert Menu to place an image on a slide.' },
      { q: 'What does "custom animation" do?', opts: ['Changes the file format', 'Adds emphasis to a chosen object or text', 'Saves the slide as PDF', 'Deletes a slide'], a: 1, why: 'Custom animation emphasises a specific object or piece of text on the slide.' },
      { q: 'Why should you avoid too many animation effects on a slide?', opts: ['They cost money', 'They reduce focus on the main content', 'They cannot be saved', 'They make the file smaller'], a: 1, why: 'Too many effects distract the audience from the actual message.' },
    ]),
  ],
});

// Page 3 — Audio/video and running the show
reset();
PAGES.push({
  slug: 'impress-media-and-slideshow', title: 'Adding Media and Running the Show', page_number: 3,
  blocks: [
    hero('A slide with an audio clip, the slide show running, and a slide sorter grid',
      'A dark-canvas Impress scene: a slide with a small speaker/audio icon, a full-screen slide-show preview with a Play cue, and a slide-sorter grid showing all slides as thumbnails for rearranging. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Let the guide speak',
      `Samayra had recorded the tour guide narrating a monument's story. Dropping that **audio clip** — and a few **video clips** — straight into the slides made the whole presentation feel alive, like the trip was happening again.`),
    heading('Inserting audio and video'),
    text(`To make slides lively and informative, add media through the **Insert Menu → Audio or Video** option. A recorded narration, a short video clip, or background sound can carry far more than text alone.`),
    heading('Previewing and navigating the show'),
    text(`To watch your presentation full-screen, start the **Slide Show** — press **F5** or use the **Slide Show menu**. During the show:\n\n- **Right-click anywhere** to bring up a floating menu that lets you jump to the next or previous slide\n\nWant to see every slide at once? The **Slide Sorter view** shows all slides on a single screen, making it easy to **rearrange** their order.`),
    video('Watch: insert an audio/video clip, run the slide show with F5, and rearrange slides in Slide Sorter.'),
    callout('note', 'Try it yourself — Activity',
      `Insert a short **audio or video clip** into one of your slides using the Insert menu. Then press **F5** to run the **slide show**, and practise moving forward and back with a **right-click**. Finally, open **Slide Sorter** and reorder two slides.`),
    quiz([
      { q: 'Which menu do you use to add an audio or video clip to a slide?', opts: ['File Menu', 'Insert Menu', 'View Menu', 'Edit Menu'], a: 1, why: 'Audio and video are added through the Insert Menu → Audio or Video option.' },
      { q: 'Which key starts the slide show?', opts: ['F1', 'F5', 'Ctrl + S', 'Tab'], a: 1, why: 'Press F5 (or use the Slide Show menu) to run the presentation full-screen.' },
      { q: 'The Slide Sorter view is useful for…', opts: ['Recording audio', 'Seeing all slides at once and rearranging them', 'Exporting to MP4', 'Printing a document'], a: 1, why: 'Slide Sorter shows every slide on one screen so you can rearrange the order easily.' },
    ]),
  ],
});

// Page 4 — Sharing as PDF + good habits
reset();
PAGES.push({
  slug: 'impress-sharing-pdf', title: 'Sharing Your Presentation as PDF', page_number: 4,
  blocks: [
    hero('A presentation being exported to a PDF for sharing',
      'A dark-canvas illustration of a slide deck flowing into a single "PDF" document badge, with a share arrow pointing outward to friends\' devices. A small note reads "no animations in PDF". Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'One format everyone can open',
      `When it's time to send your presentation to friends, the safest choice is **PDF** — an open standard almost every device can open. Just remember: a PDF freezes your slides, so the animations and transitions won't play in it.`),
    heading('Exporting to PDF'),
    text(`To share your presentation, **export it to PDF** (Portable Document Format) — an **open standard** for viewing and sending files. Anyone can open a PDF, on almost any device, without needing Impress.\n\nOne trade-off to remember: **no effects or animations appear in a PDF**. The PDF shows your slides as still pages, so put the real message in the *content*, not only in the effects.`),
    video('Watch: export a finished presentation to PDF for sharing.'),
    heading('Putting it all together'),
    text(`You can now build a complete presentation: title and content slides, inserted images, tasteful animation and transitions, audio and video, a full-screen slide show — and a PDF to share. With a **projector**, you can present it to the whole class and relive the moments together.`),
    callout('note', 'Try it yourself — Activity',
      `Build a full presentation on **"School's Annual Day Celebrations"** or the **biography of a scientist**: a title slide, a few content slides with images, one animation, and a transition. When it's ready, **export it as a PDF** and share it with a friend.`),
    quiz([
      { q: 'Why is PDF a good format for sharing a presentation?', opts: ['It plays all animations', 'It is an open standard almost any device can open', 'It records audio', 'It makes slides editable by everyone'], a: 1, why: 'PDF is an open standard for viewing and sending files, openable on almost any device.' },
      { q: 'What is the trade-off when you export a presentation to PDF?', opts: ['The text disappears', 'Effects and animations are not shown', 'It cannot be opened', 'The images are deleted'], a: 1, why: 'A PDF shows slides as still pages — no effects or animations play.' },
      { q: 'A PDF version of a presentation is…', opts: ['Fully editable by anyone', 'A fixed set of pages anyone can view', 'An audio file', 'A video file'], a: 1, why: 'PDF freezes the slides into viewable pages; it is not meant for editing.' },
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
    console.log('\n✅ Chapter 5: Presenting Ideas — setup complete.');
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
