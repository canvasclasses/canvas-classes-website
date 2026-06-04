// Setup script: Class 9 ICT — Chapter 3: Creating Visual Communication (6 pages).
// GIMP image-editing tutorial — VIDEO-DRIVEN. English-only, published:false.
// Content traced to ~/Downloads/Class 9 ICT/iict103.pdf. Idempotent.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 3;

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

// Page 1 — Meet GIMP
reset();
PAGES.push({
  slug: 'gimp-getting-started', title: 'Meet GIMP, Your Free Photo Editor', page_number: 1,
  blocks: [
    hero('The GIMP photo editor open with an image on the canvas and a toolbox',
      'A dark-themed graphics-editor workspace: a photo of a village fair on the central canvas, a vertical toolbox of tool icons on the left, and a layers panel on the right. A magnified inset shows tiny squares to illustrate pixels. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Dull photos, rescued',
      `Samayra clicked photos all day at a village fair — but in the evening they looked **dull and out of focus**. Her friend Shirom had the fix: a **free, open-source graphics editor** called **GIMP** that can sharpen, brighten and combine images. The best part — it costs nothing.`),
    heading('What GIMP is and what it does'),
    text(`**GIMP** (GNU Image Manipulation Program) is a **free and open-source** image editor. People use it for **photo editing, collage creation and freehand drawing**. A few words you'll meet everywhere in GIMP:\n\n- **Canvas** — the work area where you place and edit an image\n- **Layer** — one image stacked on the canvas; a canvas can hold *many* layers, like sheets of transparent paper piled up\n- **Pixel** — the smallest dot of light on a screen; an image's size is measured in pixels\n- **Toolbox** — the panel (on the left by default) holding the tools for each task\n\nGIMP saves your work in its own **.xcf** format. To begin, open the image you want to edit through **File → Open**.`),
    video('Watch: open GIMP, open an image, and tour the canvas, toolbox and layers panel.'),
    callout('remember', 'Tooltip tip',
      `Rest your mouse on any tool in the toolbox and a small **tooltip** pops up explaining it — often with its shortcut key. Hover over an item and press **F1** for more help.`),
    callout('note', 'Try it yourself — Activity',
      `Before editing, learn to pick a good picture. Take any three photos on a phone and judge each on: **clarity** (is it sharp?), **information** (does it show what you want?), and **size**. Decide which single photo you'd choose for a newspaper article, and write one line on why.`),
    quiz([
      { q: 'What does GIMP let you do?', opts: ['Only print documents', 'Edit photos, make collages and draw', 'Send emails', 'Record audio'], a: 1, why: 'GIMP is a graphics editor for photo editing, collage creation and freehand drawing.' },
      { q: 'The smallest dot of light on a screen, used to measure image size, is a…', opts: ['Layer', 'Canvas', 'Pixel', 'Toolbox'], a: 2, why: 'A pixel is the smallest illuminated area on a screen; image size is measured in pixels.' },
      { q: 'In which format does GIMP save an image by default?', opts: ['.pdf', '.xcf', '.mp3', '.docx'], a: 1, why: 'GIMP stores images in its own .xcf format by default.' },
    ]),
  ],
});

// Page 2 — Crop, flip, rotate
reset();
PAGES.push({
  slug: 'gimp-crop-flip-rotate', title: 'Crop, Flip and Rotate', page_number: 2,
  blocks: [
    hero('An image being cropped, flipped and rotated',
      'Three side-by-side panels on a dark canvas: the first shows a photo with a crop rectangle trimming away the edges, the second shows the photo mirrored left-to-right (flip), the third shows it turned on its side (rotate). Tool icons glow between them. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Trim away what you don\'t want',
      `Samayra's photo had **unwanted areas** at the edges spoiling it. The cure is **cropping** — slicing off the parts you don't need so only the good bit remains. It's the single most common photo fix.`),
    heading('Cropping out the unwanted bits'),
    text(`**Cropping** removes the unwanted area of a picture, keeping only what matters. You can use the **Crop tool** from the toolbox, or select the area first with **Tools → Selection Tools → Rectangle Select** and then **Image → Crop to Selection**. The part *inside* your selection is kept; the darkened outside area is trimmed away.`),
    heading('Flipping and rotating'),
    text(`- **Flip** makes a **mirror image** — left becomes right (or top becomes bottom). Always keep a **copy first**, so you still have the original.\n- **Rotate** turns the image by an angle, such as **90 degrees**, to fix a sideways photo or create a new effect.\n\nBoth are quick ways to change how an image is oriented.`),
    video('Watch: crop out unwanted parts, then flip and rotate an image.'),
    callout('note', 'Try it yourself — Activity',
      `Download an image of a flower. Then: **(1)** make a copy of it, **(2)** use the crop tool to cut away areas you don't need, **(3)** flip the cropped image vertically, and **(4)** rotate the flipped image by 90 degrees. Notice how each step changes the picture.`),
    quiz([
      { q: 'What does cropping an image do?', opts: ['Brightens it', 'Removes unwanted areas, keeping the rest', 'Adds text', 'Saves it as PDF'], a: 1, why: 'Cropping trims away the unwanted parts and keeps the area you select.' },
      { q: 'Flipping an image creates a…', opts: ['Brighter image', 'Mirror image', 'Smaller file', 'New layer of text'], a: 1, why: 'Flip produces a mirror image — left becomes right (or top becomes bottom).' },
      { q: 'Why should you keep a copy before flipping an image?', opts: ['To save space', 'So you still have the original to use', 'To make it brighter', 'It is required to print'], a: 1, why: 'Flipping changes the image, so keeping a copy preserves the original.' },
    ]),
  ],
});

// Page 3 — Scale and brighten
reset();
PAGES.push({
  slug: 'gimp-scale-and-brighten', title: 'Resize and Brighten', page_number: 3,
  blocks: [
    hero('An image being scaled down and a dull photo turned bright',
      'A dark-canvas split: on the left a large photo shrinks to a smaller one with a pixel-dimension label (scaling down); on the right a dull, grey photo brightens into a vivid one via a brightness slider. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Too big to email?',
      `A huge photo can be too heavy to mail or upload. The fix is to **scale it down** — shrink the image so it has fewer pixels and a smaller file size, without starting over.`),
    heading('Scaling: making an image smaller'),
    text(`**Scaling down** reduces the size of an image. It lowers the number of **pixels** and resizes the canvas to match, so the file becomes lighter and easier to share. You can scale in two ways:\n\n- **Tools → Transform Tools** (the Scale tool), or\n- **Image → Scale Image**\n\nBoth let you set the new size in pixels.`),
    heading('Brightness: rescuing a dull photo'),
    text(`GIMP's **brightness control** turns a dull, dim photo into a bright, lively one. It's perfect for pictures taken in low light — exactly Samayra's problem at the fair. Nudge the brightness up until the image looks natural.`),
    video('Watch: scale an image down to a smaller size, then brighten a dull photo.'),
    callout('remember', 'DPI vs PPI',
      `**DPI** (Dots Per Inch) describes a **printer's** resolution; **PPI** (Pixels Per Inch) describes a **screen's** display resolution. Higher resolution means better printing quality.`),
    callout('note', 'Try it yourself — Activity',
      `Take (or find) a photo shot in **low light** that looks dull. Open it in GIMP and use the **brightness control** to turn it into a brighter, clearer picture. Save both versions and compare them side by side.`),
    quiz([
      { q: 'What happens when you scale down an image?', opts: ['It gets more pixels and a bigger file', 'It gets fewer pixels and a smaller file', 'It becomes a PDF', 'It gets a mirror image'], a: 1, why: 'Scaling down reduces the pixels and the file size, making it easier to email or share.' },
      { q: 'Which GIMP feature rescues a dull, low-light photo?', opts: ['Crop tool', 'Brightness control', 'Flip tool', 'Find & Replace'], a: 1, why: 'The brightness control brightens dim images so they look lively and clear.' },
      { q: 'DPI (Dots Per Inch) is mainly about the resolution of a…', opts: ['Screen', 'Printer', 'Speaker', 'Keyboard'], a: 1, why: 'DPI refers to printer resolution; PPI refers to screen/display resolution.' },
    ]),
  ],
});

// Page 4 — Layers and reflection
reset();
PAGES.push({
  slug: 'gimp-layers-and-reflection', title: 'Working with Layers', page_number: 4,
  blocks: [
    hero('Stacked image layers and a water-style reflection of a photo',
      'A dark-canvas illustration of three semi-transparent image layers floating apart to show they stack, with a layers panel listing them. Beside it, a photo sits above its softly faded mirror reflection, like an object reflected on water. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Sheets of transparent paper',
      `Think of **layers** as sheets of transparent paper stacked on the canvas — you can edit one without disturbing the others. Layers are the secret behind effects like a **mirror reflection** sitting neatly under a photo.`),
    heading('Layers, copies and moving images'),
    text(`A **layer** holds one image, and a canvas can stack many of them. To work with layers:\n\n- **Add a new layer** and **paste** a copied image onto it with **Edit → Paste as → New Layer**\n- Use the **Move tool** to slide a layer around the canvas\n- **Duplicate a layer** (right-click the layer → *Duplicate Layer*) to make an exact copy\n- See every layer in the **Layers palette** (open it via **Windows → Dockable Dialogs → Layers**)`),
    heading('Building a reflection'),
    text(`A reflection is just clever layering. The idea: **duplicate** the image layer, **flip it vertically**, place the flipped copy just **below** the original, then fade it out using a **layer mask** and lower **opacity** (around 65%) so it looks like a soft reflection. Finally **merge** the layers down. You can even add **text as an image** on its own layer to make a caption or title.`),
    video('Watch: work with layers — duplicate a layer, flip it, and build a mirror reflection.'),
    callout('note', 'Try it yourself — Activity',
      `Open any clear photo of a single object. **Duplicate** its layer, **flip the copy vertically**, and place it just below the original to create a **reflection**. Lower the reflected layer's opacity so it looks faded and natural.`),
    quiz([
      { q: 'What is a layer in GIMP?', opts: ['A type of file format', 'One image stacked on the canvas, like a transparent sheet', 'A printer setting', 'A keyboard shortcut'], a: 1, why: 'A layer holds one image; a canvas can stack many layers like sheets of transparent paper.' },
      { q: 'To create a reflection, after duplicating the layer you would…', opts: ['Crop it', 'Flip it vertically and place it below', 'Print it', 'Delete it'], a: 1, why: 'A reflection is a duplicated layer flipped vertically, placed below, and faded with opacity.' },
      { q: 'Lowering a layer\'s opacity to about 65% makes the reflection look…', opts: ['Brighter than the original', 'Faded and natural', 'Bigger', 'Sharper'], a: 1, why: 'Reduced opacity fades the reflected layer so it resembles a soft, natural reflection.' },
    ]),
  ],
});

// Page 5 — Clone tool
reset();
PAGES.push({
  slug: 'gimp-clone-tool', title: 'Repairing Photos with the Clone Tool', page_number: 5,
  blocks: [
    hero('An unwanted object being painted out of a photo with the clone tool',
      'A dark-canvas before-and-after: the left photo has an unwanted patch of text on a signboard, the right photo shows it cleanly removed, with a clone-tool brush and a crosshair "source" marker mid-action between them. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Make it disappear',
      `Samayra didn't like some **red text** on a board in her photo. With GIMP's **Clone tool**, you can paint right over an unwanted patch using pixels copied from a clean part of the image — and the patch simply vanishes into the background.`),
    heading('How the Clone tool works'),
    text(`The **Clone tool** copies pixels from one part of an image and paints them over another part — perfect for removing patches, blemishes or unwanted text. It works much like the **Format Painter** in a word processor, but for image pixels. The basic steps:\n\n1. Open the image that needs repair\n2. Pick **Tools → Paint Tools → Clone** (or click the clone icon in the toolbox); adjust **opacity**, **scale** and **brush size** so the repair looks natural\n3. Hold the **Ctrl key** and click a clean area to set the **source** — the pixels you'll paint with\n4. Now paint over the unwanted patch; click as many source areas as you need for a seamless blend`),
    video('Watch: use the Clone tool to paint out an unwanted object or text from a photo.'),
    callout('note', 'Try it yourself — Activity',
      `Find a photo of you and your friends that has an **unknown person in one corner**. Use the **Clone tool** to paint that person out, so the picture shows only your friends. Save the cleaned image.`),
    quiz([
      { q: 'The Clone tool is used to…', opts: ['Print the image', 'Copy pixels from one area to paint over another', 'Change the file format', 'Add a header'], a: 1, why: 'The Clone tool paints over problem areas using pixel data copied from clean parts of the image.' },
      { q: 'Which key do you hold to set the source area for the Clone tool?', opts: ['Shift', 'Ctrl', 'Alt', 'Tab'], a: 1, why: 'Hold Ctrl and click a clean area to set the clone source.' },
      { q: 'The Clone tool works most like which word-processor feature?', opts: ['Spell check', 'Format Painter', 'Find & Replace', 'Print Preview'], a: 1, why: 'Cloning is similar to the Format Painter — it copies from one place and applies it to another.' },
    ]),
  ],
});

// Page 6 — Collage and file formats
reset();
PAGES.push({
  slug: 'gimp-collage-and-formats', title: 'Collages and Saving in the Right Format', page_number: 6,
  blocks: [
    hero('A photo collage being assembled and exported to JPEG',
      'A dark-canvas illustration of several photos being arranged into a single grid collage on one canvas, each as its own layer, with an "Export As → JPEG" panel and a quality slider beside it. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Many photos, one picture',
      `Samayra and Shirom wanted **all their fair photos in one picture** — that's a **collage**. In GIMP you simply bring each photo in as its own **layer**, then resize and arrange them on a single canvas.`),
    heading('Building a collage'),
    text(`To **club images together** into a collage:\n\n- Open each photo as a new layer (**Open as Layers**) on one canvas\n- Click a layer and use the **Scale tool** to resize it and the **Move tool** to position it\n- Right-click a picture's layer and choose **Scale Layer** to fit it neatly into the grid\n\nKeep arranging until every photo sits where you want it.`),
    heading('Saving and exporting: the right format'),
    text(`GIMP's default **.xcf** files keep all your layers, but they are **heavy** and not meant for sharing. So the good practice is: **edit in .xcf, then export to a lighter format** through **File → Export**, where you can also set the image quality.`),
    table('Common image formats and when to use them',
      ['Format', 'Best for'],
      [
        ['.xcf', 'GIMP\'s own working file — keeps layers, heavy, for editing only'],
        ['JPEG', 'Good-quality compressed photos — accepted worldwide, great for sharing'],
        ['PNG', 'Good quality but bulky — supported by all web browsers'],
        ['TIFF', 'Bulky but high quality — supported by all image-processing software'],
      ]),
    callout('note', 'Try it yourself — Activity',
      `Pick several photos from a festival you celebrated at home and **build a collage** showing different scenes. When it looks good, **export it as a JPEG** so it's light enough to share with friends.`),
    quiz([
      { q: 'In GIMP, how do you bring several photos together for a collage?', opts: ['Print them all', 'Open each as a layer, then scale and move them', 'Save each as PDF', 'Delete the extra ones'], a: 1, why: 'Each photo comes in as its own layer; you scale and move them to arrange the collage.' },
      { q: 'Which format is the lightweight, worldwide-accepted choice for sharing a finished photo?', opts: ['.xcf', 'JPEG', 'TIFF', '.docx'], a: 1, why: 'JPEG is a good-quality compressed format accepted everywhere — ideal for sharing.' },
      { q: 'What is the recommended good practice when working in GIMP?', opts: ['Only ever keep .xcf files', 'Edit in .xcf, then export to a format like JPEG', 'Never save your work', 'Always print before saving'], a: 1, why: 'Edit in the layered .xcf file, then export a lighter format such as JPEG for sharing.' },
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
    console.log('\n✅ Chapter 3: Creating Visual Communication — setup complete.');
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
