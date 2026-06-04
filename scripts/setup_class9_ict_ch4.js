// Setup script: Class 9 ICT — Chapter 4: Creating Audio Video Communication (5 pages).
// Audacity (audio) + OpenShot (video) tutorial — VIDEO-DRIVEN (page 1 is the
// concept/planning page, no walkthrough). English-only, published:false.
// Content traced to ~/Downloads/Class 9 ICT/iict104.pdf. Idempotent.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 4;

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

// Page 1 — Multimedia and planning a video (concept page, no walkthrough video)
reset();
PAGES.push({
  slug: 'multimedia-and-planning', title: 'Multimedia and Planning a Video Film', page_number: 1,
  blocks: [
    hero('Students planning a video film with text, images, audio and video clips',
      'A dark-canvas illustration of three students at a table planning a film: sticky notes labelled "topic", "content", "sources" and "roles", surrounded by floating icons of text, a photo, a microphone, a video clip and an interactive cursor merging into one filmstrip. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'When a poster isn\'t enough',
      `Raima missed school with a waterborne illness. Her friends had just done a water-purification activity and wanted to share it — but a printed poster felt flat. Their idea: make a **short video film** mixing text, images, audio and a real demonstration. That mix of media is the heart of this chapter.`),
    heading('Multimedia, content and interactives'),
    text(`**Multimedia** means using **more than one medium** to express or communicate — a blend of **text, audio, images, animation, video and interactives**. It's richer than plain printed or handwritten material.\n\n- **Content** is anything expressed through a medium — speech, writing, or any art form.\n- **Interactives** allow **two-way** communication: the user interacts with the content and gets feedback back.`),
    heading('Planning before you record'),
    text(`A good video film starts with planning, not recording. The students followed clear steps:\n\n1. **Pick a topic and title** — "Waterborne Diseases and Their Prevention"\n2. **Decide the content** — water pollution, its causes, its effects, the diseases, and purification methods\n3. **Collect information from sources** — books in the **library**, a **doctor** for the medical facts, a **science teacher** for purification techniques\n4. **Assign roles** — who collects what, who records what\n5. **Write the audio script** before recording the narration\n\nGather everything first; the software comes later.`),
    callout('note', 'Try it yourself — Activity',
      `Plan a video film on **Water Pollution**. On paper, list the **content** you'd include (causes, effects, waterborne diseases, purification methods) and, beside each, the **source** you'd use to get reliable information. You're writing the blueprint before any recording begins.`),
    quiz([
      { q: 'What does "multimedia" mean?', opts: ['Using only printed text', 'Using more than one medium — text, audio, images, video, etc.', 'A type of camera', 'A single audio file'], a: 1, why: 'Multimedia combines several media — text, audio, images, animation, video and interactives.' },
      { q: 'Interactives are special because they allow…', opts: ['One-way broadcasting only', 'Two-way communication with feedback', 'Faster printing', 'Louder audio'], a: 1, why: 'Interactives let the user interact with the content and get feedback — two-way communication.' },
      { q: 'What is the FIRST thing the students did to make their video film?', opts: ['Exported it as MP4', 'Planned the topic, content, sources and roles', 'Recorded random clips', 'Printed posters'], a: 1, why: 'They planned — topic, content, sources and roles — before recording anything.' },
    ]),
  ],
});

// Page 2 — Recording audio with Audacity
reset();
PAGES.push({
  slug: 'audacity-recording', title: 'Recording Audio with Audacity', page_number: 2,
  blocks: [
    hero('The Audacity audio editor recording a voice narration on a track',
      'A dark-canvas view of the Audacity interface: a horizontal audio waveform being recorded on a track, a large red Record button glowing, a microphone in the foreground, and a quiet "silence please" cue. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Disturbance in the recording?',
      `The students recorded their narration on a phone — but on playback they heard **disturbance** and a few coughs. The fix is **audio-editing software**. Meet **Audacity**: a free, open-source tool that records and cleans up sound, no fancy mixer required.`),
    heading('What Audacity is'),
    text(`**Audacity** is a **free, open-source digital audio editor** that runs on Windows, macOS, Linux and more. With it you can **record** (using the default or an external microphone), **edit, import and export** audio files, **mix multiple tracks**, and add **effects**. You don't need a sound mixer or any special device to start.`),
    heading('Recording a narration'),
    text(`To record your voice:\n\n1. Go to **File → New** to open a new project\n2. **Add a new track** for your recording\n3. Make sure the room is **quiet**, then click the **red Record button** and speak\n4. To finish, press the **Stop** button or the **Space Bar**\n\nYou can add more tracks the same way — one for narration, others for music or effects.`),
    video('Watch: open Audacity, add a track, and record a clean voice narration.'),
    table('Some audio recording devices and tools',
      ['Recording devices', 'Audio editing tools'],
      [
        ['Smartphone, Laptop audio interface', 'Audacity'],
        ['Desktop & headphone, DAT recorder', 'Mixxx'],
        ['Mini Disc recorder', 'Ardour'],
      ]),
    callout('note', 'Try it yourself — Activity',
      `In Audacity, record a short **narration of a story** you've heard from your grandparents or parents. Keep the room quiet, use the **red Record button**, and stop with the **Space Bar**. Play it back and listen for any disturbance.`),
    quiz([
      { q: 'Audacity is best described as a…', opts: ['Video editor', 'Free, open-source digital audio editor', 'Word processor', 'Web browser'], a: 1, why: 'Audacity is a free and open-source digital audio editor for recording and editing sound.' },
      { q: 'Which key can you press to STOP a recording in Audacity?', opts: ['Enter', 'Space Bar', 'Ctrl', 'Tab'], a: 1, why: 'Press the Stop button or the Space Bar to finish recording.' },
      { q: 'What should you ensure while recording a narration?', opts: ['Loud background music', 'Proper silence in the room', 'The lights are off', 'The printer is on'], a: 1, why: 'Maintaining silence keeps the recording clean and free of disturbance.' },
    ]),
  ],
});

// Page 3 — Editing and exporting audio
reset();
PAGES.push({
  slug: 'audacity-editing-exporting', title: 'Editing and Exporting Audio', page_number: 3,
  blocks: [
    hero('An audio waveform with a coughing section selected for deletion, and an export panel',
      'A dark-canvas Audacity scene: a waveform with a highlighted selection over a "cough" spike about to be deleted, a second track labelled "music" below, and an "Export → MP3" panel to the side. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Cut the coughs',
      `Every recording has slip-ups — a cough, a fumble, a repeated sentence. The beauty of editing is you can **select those bits and delete them**, leaving a clean, professional-sounding narration.`),
    heading('Cleaning up the recording'),
    text(`To remove unwanted sounds (coughs, pops, fumbles, repeated lines):\n\n1. Use the **selection tool** to highlight the portion you want gone\n2. Press **Delete** on the keyboard (or delete via the **Edit** menu)\n\nWant background music or sound effects? **Add a new track**, then go to **File → Import** and select your music file — it lands on the new track. To blend everything together, **mix the tracks** using the **Tracks** menu.`),
    video('Watch: delete unwanted sounds, import a music track, and mix the tracks together.'),
    heading('Saving vs exporting'),
    text(`There are two ways to keep your work, and the difference matters:\n\n- **Save** the project in Audacity's default **.aup** format — this stays **editable** so you can change it later\n- **Export** to a shareable format like **.mp3** or **.ogg** when you want to use the audio elsewhere, such as in a presentation\n\nKeep the .aup for editing; export an .mp3 for sharing.`),
    callout('note', 'Try it yourself — Activity',
      `Record a short clip — a **mimicry of cartoons** or a **collection of animal sounds**. Then **edit out** any mistakes with the selection tool and **Delete**, **import** a little background music, and finally **export** the result as an **.mp3** file.`),
    quiz([
      { q: 'How do you remove a cough from a recording in Audacity?', opts: ['Print the track', 'Select the portion and press Delete', 'Increase brightness', 'Change to landscape'], a: 1, why: 'Use the selection tool to highlight the unwanted sound, then press Delete.' },
      { q: 'Audacity\'s editable project format is…', opts: ['.mp3', '.aup', '.mp4', '.pdf'], a: 1, why: 'The default .aup (Audacity Project) format stays editable; export to .mp3/.ogg for sharing.' },
      { q: 'To use your audio inside a presentation, you should…', opts: ['Keep it only as .aup', 'Export it as .mp3 or .ogg', 'Delete the tracks', 'Print it'], a: 1, why: 'Export to a shareable format like .mp3 or .ogg to use the audio elsewhere.' },
    ]),
  ],
});

// Page 4 — Editing video with OpenShot
reset();
PAGES.push({
  slug: 'openshot-importing-timeline', title: 'Editing Video with OpenShot', page_number: 4,
  blocks: [
    hero('The OpenShot video editor with clips arranged on a timeline',
      'A dark-canvas OpenShot interface: a project-files panel of imported photos and video clips on the left, a preview window top-right, and a multi-track timeline along the bottom with image clips placed in sequence on a track. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Where the film comes together',
      `Audio done, the students moved to **OpenShot** — a video editor where photos, clips and narration are arranged on a **timeline** to become a finished film. The first rule? Get organised before you import.`),
    heading('Organise, then import'),
    text(`**OpenShot** is a video-editing tool. Step one is to **organise** all your material — images, video clips and the recorded narration — neatly in a **folder**. Then **import** them into OpenShot's project files (you can also use the shortcut **Ctrl + F** to import images and audio).`),
    heading('Building the timeline'),
    text(`The **timeline** at the bottom holds your clips on **tracks**, in the order they'll play. There are two ways to place images:\n\n- **Drag** each picture one after another onto a track, or\n- Select an image and use the **Add to Timeline** option\n\nYou can **change the sequence** any time by dragging clips to rearrange them. The order on the timeline is the order they appear in your film.`),
    video('Watch: import images and clips into OpenShot and arrange them on the timeline.'),
    table('Some video editing tools',
      ['Video editing software'],
      [['OpenShot Video Editor'], ['Blender'], ['Pitivi'], ['Avidemux']]),
    callout('note', 'Try it yourself — Activity',
      `Collect three or four photos in a folder, then **import** them into OpenShot and place them on the **timeline** in a sensible order. Try **dragging** them to rearrange the sequence and watch how the story changes.`),
    quiz([
      { q: 'OpenShot is used for…', opts: ['Editing audio only', 'Editing video', 'Writing documents', 'Browsing the internet'], a: 1, why: 'OpenShot is a video-editing tool for arranging clips, images and audio into a film.' },
      { q: 'What is the FIRST step before importing into OpenShot?', opts: ['Export as MP4', 'Organise all files neatly in a folder', 'Delete the audio', 'Print the clips'], a: 1, why: 'Organise images, clips and narration in a folder before importing them.' },
      { q: 'How do you change the order in which clips play?', opts: ['Re-record everything', 'Drag the clips to rearrange them on the timeline', 'Change the file format', 'Brighten them'], a: 1, why: 'Dragging clips along the timeline changes the sequence in which they appear.' },
    ]),
  ],
});

// Page 5 — Music, preview and export
reset();
PAGES.push({
  slug: 'openshot-music-preview-export', title: 'Music, Preview and Export Your Film', page_number: 5,
  blocks: [
    hero('Background music on a timeline track, a preview window playing, and an export panel',
      'A dark-canvas OpenShot scene: an audio clip with a music-note symbol sitting on Track 1 of the timeline, a preview window showing the film mid-play with a Play button, and an "Export → MP4" panel glowing to the side. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'The finishing touches',
      `A film feels alive with music. In OpenShot you just **drag an audio file onto a track** — a little **♫** appears to show it's there — then **preview** the whole thing before sharing it with the world.`),
    heading('Add music, then preview'),
    text(`To add background music, **drag an audio file** from the Project Files window and drop it onto **Track 1** of the timeline. A **♫** symbol confirms the audio is in place.\n\nReady to watch it? Click the **Play** button in the **preview** window to see your film so far. If anything feels out of place, just **drag and drop** clips to rearrange them, then preview again.`),
    video('Watch: add background music, preview the film, and export it as an MP4.'),
    heading('Save and export'),
    text(`Just like with audio, keep two versions:\n\n- **Save** the project in OpenShot's default **.osp** format (shortcut **Ctrl + S**) — it stays **editable**\n- **Export** to a shareable video format like **.mp4** or **.ogg** to use the film in a presentation or share it online`),
    table('Editable project vs shareable export',
      ['Tool', 'Editable project file', 'Export for sharing'],
      [
        ['Audacity (audio)', '.aup', '.mp3 / .ogg'],
        ['OpenShot (video)', '.osp', '.mp4 / .ogg'],
      ]),
    callout('note', 'Try it yourself — Activity',
      `Make a short **advertisement video** encouraging rainwater harvesting at home and school. Arrange your clips, **add background music**, **preview** it, and finally **export** it as an **.mp4** so you can share it.`),
    quiz([
      { q: 'How do you add background music to your film in OpenShot?', opts: ['Type it in', 'Drag an audio file onto a timeline track', 'Print it', 'Crop it'], a: 1, why: 'Drag an audio file from Project Files onto a track; the ♫ symbol confirms it was added.' },
      { q: 'OpenShot\'s editable project format is…', opts: ['.osp', '.mp4', '.aup', '.jpg'], a: 0, why: 'Save in .osp to keep editing; export to .mp4/.ogg to share.' },
      { q: 'To use your finished film in a presentation, you should export it as…', opts: ['.osp', '.mp4 or .ogg', '.aup', '.xcf'], a: 1, why: 'Export to a shareable video format like .mp4 or .ogg for use elsewhere.' },
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
    console.log('\n✅ Chapter 4: Creating Audio Video Communication — setup complete.');
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
