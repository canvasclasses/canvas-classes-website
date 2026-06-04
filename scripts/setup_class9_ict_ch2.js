// Setup script: Class 9 ICT — Chapter 2: Creating Textual Communication (6 pages).
// LibreOffice Writer tutorial — VIDEO-DRIVEN. Each tutorial page carries a
// placeholder video block (src:'' until the walkthrough is recorded; brief in
// the ledger shot-list). English-only, published:false. Content traced to
// ~/Downloads/Class 9 ICT/iict102.pdf. Idempotent: skips existing slugs.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 2;

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

// Page 1 — Your first document in Writer
reset();
PAGES.push({
  slug: 'writer-first-document', title: 'Your First Document in Writer', page_number: 1,
  blocks: [
    hero('A student opening LibreOffice Writer and typing a report on a computer',
      'A school computer lab scene on a dark canvas: a student double-clicks the LibreOffice Writer icon on a desktop, a fresh blank document opening on screen with a blinking cursor highlighted. A keyboard glows in the foreground with a few keys lit. Floating label "Untitled 1" on the document title bar. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'A report that amazed a friend',
      `At a book fair, Tanya made a report with **colourful text, a picture, and symbols** before each book category. Her friend Rishi was stunned — how did she do it? Her secret: a **word processor** called **LibreOffice Writer**. The magic of a digital document? You can fix mistakes instantly and print as many copies as you like.`),
    heading('What a word processor gives you'),
    text(`A **word processor** is software for creating digital documents — and any piece of information you create in it is called a **document**. Compared to writing by hand, it lets you:\n\n- **Delete and fix errors** without scratching anything out\n- **Take multiple copies** at the click of a button\n- **Format** text with colours, sizes and styles\n\nTo start, **double-click the Writer icon** on the desktop. A blank document opens. The **title bar** at the top shows the document's name and the app's name — and since you haven't named it yet, it says **"Untitled 1"**. The blinking vertical line on the page is the **cursor** — it marks exactly where your typed text will appear.`),
    video('Watch: open LibreOffice Writer and create a new blank document.'),
    heading('Getting friendly with the keyboard'),
    text(`Before you type, it helps to know what a few special keys do:`),
    table('Special keys and what they do',
      ['Key', 'What it does'],
      [
        ['Enter', 'Moves to the next line'],
        ['Tab', 'Moves the cursor 5 spaces to the right'],
        ['Insert', 'Switches between adding text and typing over old text'],
        ['Delete', 'Deletes the character to the right of the cursor'],
        ['Backspace', 'Deletes the character to the left of the cursor'],
        ['Caps Lock', 'Type in CAPITALS; press again to go back to small letters'],
        ['Shift', 'Hold with a letter for one capital; hold with a number key for the symbol above it'],
      ]),
    callout('note', 'Try it yourself — Activity',
      `Open Writer and type your name and one sentence about yourself. Now experiment: turn **Caps Lock** on and off, hold **Shift** to make a single capital, and use **Backspace** and **Delete** to remove letters from each side of the cursor. Notice the difference between Backspace and Delete.`),
    quiz([
      { q: 'What is shown on the title bar of a document you have not named yet?', opts: ['Document1.pdf', 'Untitled 1', 'New File', 'Blank'], a: 1, why: 'An unnamed Writer document shows "Untitled 1" on the title bar until you save it with a name.' },
      { q: 'The blinking vertical line that shows where your text will appear is called the…', opts: ['Pointer', 'Cursor', 'Margin', 'Title bar'], a: 1, why: 'The cursor is the blinking vertical line marking where typed text appears.' },
      { q: 'Which key deletes the character to the LEFT of the cursor?', opts: ['Delete', 'Backspace', 'Tab', 'Insert'], a: 1, why: 'Backspace removes the character to the left; Delete removes the one to the right.' },
    ]),
  ],
});

// Page 2 — Page setup and saving
reset();
PAGES.push({
  slug: 'writer-page-setup-and-saving', title: 'Page Setup and Saving Your Work', page_number: 2,
  blocks: [
    hero('A document page settings dialog showing size, orientation and margins',
      'A clean illustration on a dark canvas of a document with its page-setup panel open: A4 page size, a Portrait/Landscape toggle shown as a vertical page beside a horizontal page, margin guides on all four sides, and a colour swatch for background. A floppy-disk save icon glows in the corner. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Why your notebook looks neat',
      `Ever noticed your notebook pages are all the **same size** with neat **margins**? That consistency is what makes it look tidy. A word processor lets you set the same things — page size, margins, orientation — *before* you start typing, so your document looks just as neat.`),
    heading('Set the page first'),
    text(`Fix these page settings before typing your report:\n\n- **Page size** — A4 is the standard choice\n- **Orientation** — **Portrait** makes the page tall (vertical); **Landscape** makes it wide (horizontal)\n- **Margins** — the blank border around the page (e.g. 0.79 inch on all sides)\n- **Background colour** — an optional colour for the whole page\n\nGetting these right first means you won't have to redo your layout later.`),
    video('Watch: set page size, orientation, margins and background colour, then begin typing.'),
    heading('Save it — and save often'),
    text(`A document only survives if you **save** it. There are two save commands, and the difference matters:\n\n- **Save As** — use the *first time* you save, or when you want to give an existing file a *new name*. Always pick a **meaningful name** (like \`bookFairReportRishi.odt\`) so you can find it again easily.\n- **Save** — use to quickly store the changes in a file you've already named.\n\nSave at **regular intervals** while you work, so a crash never costs you more than a few minutes. To close the file: **File → Close**.`),
    table('Handy shortcut keys',
      ['Task', 'Shortcut'],
      [['New document', 'Ctrl + N'], ['Save', 'Ctrl + S'], ['Open', 'Ctrl + O']]),
    callout('remember', 'Pro tip',
      `Tap **Ctrl + S** every few minutes — it becomes a habit that protects hours of work.`),
    callout('note', 'Try it yourself — Activity',
      `Create a document on any topic you like. Set page size to **A4** and orientation to **Portrait**. Now switch the orientation to **Landscape** and watch how the page reshapes. Finally, **Save As** with a meaningful name, type a little more, and press **Ctrl + S** to save the changes.`),
    quiz([
      { q: 'Which orientation makes the page tall (vertically elongated)?', opts: ['Landscape', 'Portrait', 'Square', 'Justified'], a: 1, why: 'Portrait is the tall, vertical orientation; Landscape is wide and horizontal.' },
      { q: 'You are saving a brand-new file for the first time. Which option do you use?', opts: ['Save', 'Save As', 'Print', 'Close'], a: 1, why: 'Use Save As the first time (or to give a new name); Save just stores changes to an already-named file.' },
      { q: 'What does the shortcut Ctrl + S do?', opts: ['Opens a file', 'Saves the document', 'Starts a new document', 'Selects all text'], a: 1, why: 'Ctrl + S saves your document — a habit worth building.' },
    ]),
  ],
});

// Page 3 — Formatting your text
reset();
PAGES.push({
  slug: 'writer-formatting-text', title: 'Formatting Your Text', page_number: 3,
  blocks: [
    hero('A formatting toolbar with font, size, bold, colour and alignment tools',
      'A close-up of a word-processor formatting toolbar on a dark canvas: a font-name dropdown, a size box, bold/italic/underline buttons, a text-colour swatch, and four alignment icons (left, centre, right, justified). A sample line of text below shows a bold underlined coloured title. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'From plain to polished',
      `Rishi's first report was plain. He wanted a **bold, underlined title**, coloured text of different sizes, and a tidy layout. Every one of those touches comes from the **Formatting toolbar** — the row of tools that turns plain text into a presentable document.`),
    heading('Fonts, size, and style'),
    text(`On the **Formatting toolbar** you can change how your text looks:\n\n- **Font name** — the lettering style, e.g. *Times New Roman, Arial, Calibri, Courier New*\n- **Font size** — bigger for titles, smaller for body text\n- **Style** — **Bold**, *Italic*, or Underline\n- **Colour** — pick any text colour you like\n\nSelect the text first, then click the tool to apply it.`),
    video('Watch: change the font name, size and colour, and apply bold, italic and underline.'),
    heading('Alignment and spacing'),
    text(`**Alignment** decides where text sits between the margins:\n\n- **Align left** — text hugs the left margin\n- **Centre** — text sits in the middle (great for titles)\n- **Align right** — text hugs the right margin (handy for a date)\n- **Justified** — text stretches to touch both margins evenly\n\nIf your writing feels cramped, adjust the spacing. **Line spacing** is the gap between lines; **paragraph spacing** is the gap between paragraphs. Adding a little blank space at the start of a paragraph's first line is called **indentation**.`),
    table('Formatting shortcut keys',
      ['Task', 'Shortcut'],
      [['Bold', 'Ctrl + B'], ['Italic', 'Ctrl + I'], ['Underline', 'Ctrl + U']]),
    callout('note', 'Try it yourself — Activity',
      `Write a paragraph on **"My Favourite Festival"** and add a quote at the top. Then apply: a **bold, centre-aligned title**; **underlined and bold** important points; a **justified** paragraph; **coloured** text and background; a chosen **font style**; and **indentation with line spacing**. Tick off each one as you manage it.`),
    quiz([
      { q: 'Which alignment is best for a title you want in the middle of the page?', opts: ['Align left', 'Centre', 'Align right', 'Justified'], a: 1, why: 'Centre alignment places text in the middle of the page — ideal for titles.' },
      { q: 'Justified alignment makes the text…', opts: ['Touch only the left margin', 'Touch both the left and right margins evenly', 'Sit in the centre', 'Move to a new page'], a: 1, why: 'Justified stretches each line to meet both margins, giving clean edges on both sides.' },
      { q: 'The gap added between paragraphs is called…', opts: ['Line spacing', 'Paragraph spacing', 'Indentation', 'Margin'], a: 1, why: 'Paragraph spacing is the gap between paragraphs; line spacing is the gap between lines within a paragraph.' },
    ]),
  ],
});

// Page 4 — Editing tools
reset();
PAGES.push({
  slug: 'writer-editing-tools', title: 'Editing Like a Pro', page_number: 4,
  blocks: [
    hero('A document with red and green wavy underlines and a find-and-replace box',
      'A document on a dark canvas showing a red wavy underline under a misspelt word and a green wavy underline under a grammar slip, with a Spelling & Grammar dialog and a Find & Replace box floating beside it. Small scissors (cut), two-pages (copy) and clipboard (paste) icons glow nearby. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'The clever — and not-so-clever — spell-checker',
      `Writer underlines a **spelling mistake in red** and a **grammar slip in green**. But it isn't perfect: it red-underlined "Pragati Maidan" (a real place name it didn't know), yet it *missed* Rishi typing "fare" instead of "fair" — because "fare" is itself a real word! The spell-checker is a helper, not a substitute for your own eyes.`),
    heading('Spelling and grammar check'),
    text(`Those wavy lines are clues:\n\n- **Red wavy line** = a possible **spelling** mistake\n- **Green wavy line** = a possible **grammar** mistake\n\nOpen the **Spelling and Grammar** check (shortcut **F7**) to review them. When a word is correct but flagged — like a name or a place — click **Add to Dictionary** so Writer stops underlining it. And remember: a wrong word that happens to be spelt correctly (like "fare" for "fair") won't be caught — so proofread yourself too.`),
    video('Watch: run the spelling and grammar check and add a correct word to the dictionary.'),
    heading('Find & Replace, and Cut / Copy / Paste'),
    text(`Need to fix the *same* mistake everywhere? **Find & Replace** (shortcut **Ctrl + H**) swaps every "Fare" for "Fair" in one go — far faster than retyping each one.\n\nTo move or duplicate text, use these three:\n\n- **Cut** — *removes* text from its place so you can move it elsewhere\n- **Copy** — *duplicates* text, leaving the original where it is\n- **Paste** — drops the cut or copied text at the new spot\n\nSo: **Cut + Paste = move**, while **Copy + Paste = duplicate**.`),
    table('Editing shortcut keys',
      ['Task', 'Shortcut'],
      [['Cut', 'Ctrl + X'], ['Copy', 'Ctrl + C'], ['Paste', 'Ctrl + V'], ['Spelling & Grammar', 'F7'], ['Find & Replace', 'Ctrl + H']]),
    callout('note', 'Try it yourself — Activity',
      `Open your "My Favourite Festival" document. First **Copy** the quote and **Paste** it at the end. Then **Cut** it and **Paste** it somewhere else. What difference did you notice between Copy and Cut?`),
    quiz([
      { q: 'A red wavy line under a word usually means…', opts: ['A grammar mistake', 'A possible spelling mistake', 'The text is bold', 'A correct word'], a: 1, why: 'Red marks a possible spelling mistake; green marks a possible grammar mistake.' },
      { q: 'Which command MOVES text, removing it from its original spot?', opts: ['Copy', 'Cut', 'Paste', 'Find'], a: 1, why: 'Cut removes text so you can move it; Copy leaves the original in place.' },
      { q: 'To change every "Fare" to "Fair" at once, you would use…', opts: ['Spell check', 'Find & Replace', 'Bold', 'Save As'], a: 1, why: 'Find & Replace (Ctrl + H) swaps all occurrences in one step.' },
    ]),
  ],
});

// Page 5 — Lists and tables
reset();
PAGES.push({
  slug: 'writer-lists-and-tables', title: 'Lists and Tables', page_number: 5,
  blocks: [
    hero('A bulleted list and a bordered table inside a document',
      'A document on a dark canvas showing a bulleted list with symbol markers beside a neat table with bold headings, coloured borders and two merged cells highlighted. A small toolbar shows bullet and numbering icons and an "insert table" grid picker. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Symbols that organise your thoughts',
      `In Tanya's report, each book category had a little **symbol** in front of it. Those are **bullets** — and they instantly make a list easier to read. Choose **bullets** when order doesn't matter, and **numbers or letters** when it does.`),
    heading('Bulleted vs numbered lists'),
    text(`A list makes information scannable. There are two kinds:\n\n- **Bulleted list** — items start with a symbol; use it when the **order doesn't matter** (e.g. a list of fruits you like)\n- **Numbered / lettered list** — items are numbered; use it when there **is an order** (e.g. the steps to make a cup of tea)\n\nPick the type that matches whether sequence matters.`),
    heading('Inserting and formatting tables'),
    text(`A **table** lines up information in rows and columns. You can:\n\n- **Insert a table** by choosing the number of rows and columns\n- **Add more rows or columns** later if you run out of space\n- Add **borders** and make the **headings bold**\n- **Merge cells** — join cells together when one label covers several rows (e.g. "Textbooks" spanning three rows)`),
    video('Watch: make bulleted and numbered lists, insert a table, add borders, and merge cells.'),
    table('Example: Rishi\'s book and CD list',
      ['S. No.', 'Title of Book/CD', 'Category', 'Publisher'],
      [
        ['1', 'Science – Vigyan', 'Textbooks', 'NCERT'],
        ['2', 'Mind Map Your Brain', 'Audio/Video CDs', '—'],
        ['3', 'Encyclopedia', 'Audio/Video CDs', 'Britannica'],
        ['4', 'What on earth is energy?', "Children's Book", 'NCERT'],
      ]),
    callout('note', 'Try it yourself — Activity',
      `Decide bullets or numbering for each, then make the lists: **fruits you like** (any order), **fruits in order of preference**, **steps to make a cup of tea**, and **your favourite games**. Tip: if the *order* matters, use numbering.`),
    quiz([
      { q: 'You are listing the steps to make tea. Which list type fits best?', opts: ['Bulleted list (order does not matter)', 'Numbered list (order matters)', 'No list', 'A picture'], a: 1, why: 'Steps have a definite order, so a numbered list is the right choice.' },
      { q: 'Joining several table cells into one is called…', opts: ['Splitting', 'Merging', 'Bordering', 'Aligning'], a: 1, why: 'Merge combines cells — useful when one label, like "Textbooks", spans several rows.' },
      { q: 'When should you use a bulleted list?', opts: ['When the order of items matters', 'When the order does not matter', 'Only for numbers', 'Never'], a: 1, why: 'Bullets suit lists where sequence is unimportant; numbering suits ordered lists.' },
    ]),
  ],
});

// Page 6 — Pictures, headers, printing and PDF
reset();
PAGES.push({
  slug: 'writer-pictures-printing-pdf', title: 'Pictures, Printing and PDF', page_number: 6,
  blocks: [
    hero('A document with a header, footer page number, an inserted photo and a PDF export icon',
      'A two-page document on a dark canvas: a header band at the top, a page-number footer at the bottom, a photo placed in the body, and a print-preview pane beside it. A glowing "PDF" badge sits over a lock icon to suggest a non-editable file. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'The report that changed overnight',
      `Rishi opened his file the next day and got a shock — it had been **altered**! Anyone could edit his editable file. The fix: save it as a **PDF**, a format that **can't be edited**, so your finished work stays exactly as you left it.`),
    heading('Add pictures, headers and footers'),
    text(`To make a report richer:\n\n- **Insert a picture** — drop in a photo saved on your computer\n- **Header** — text that appears at the **top of every page** (Rishi used "Rishi's Report")\n- **Footer** — text at the **bottom of every page** (Rishi added the **page number**)\n\nHeaders and footers repeat automatically on every page, so you set them once.`),
    video('Watch: insert a picture, then add a header and a footer with page numbers.'),
    heading('Printing, soft copy vs hard copy, and PDF'),
    text(`Before printing, click **File → Print Preview** to see exactly how the page will look on paper, then set the **number of copies** in the Print dialog. Two useful terms:\n\n- **Soft copy** — the digital file, saved on a device or seen on the monitor\n- **Hard copy** — the version **printed on paper**\n\nSaving as **PDF** makes the document **non-editable**, protecting your final version. Two good habits: **never edit someone else's document without permission**, and **print only when needed** to save paper and trees.`),
    callout('remember', 'Be a responsible user',
      `Looking at or editing other people's documents without asking is not ethical. And every page you *don't* print needlessly helps save a tree — preview first, print only what you need.`),
    callout('note', 'Try it yourself — Activity',
      `In your festival document: insert a **picture**, add **"Favourite Festival" as the header** and a **page number as the footer**, and add a small **table** of activities. Then answer: which menu had the table option? Did you use a bullet or a number list? How many rows and columns did your table have?`),
    quiz([
      { q: 'A document printed on paper is called a…', opts: ['Soft copy', 'Hard copy', 'Header', 'Footer'], a: 1, why: 'A hard copy is printed on paper; a soft copy is the digital version on a device or screen.' },
      { q: 'Why might you save a finished report as a PDF?', opts: ['To make it editable by anyone', 'To make it non-editable and protect it', 'To delete it', 'To print it automatically'], a: 1, why: 'PDF is a non-editable format, so your finished work cannot be altered by others.' },
      { q: 'Text that appears at the bottom of every page is placed in the…', opts: ['Header', 'Footer', 'Title bar', 'Margin'], a: 1, why: 'A footer shows at the bottom of every page; a header shows at the top.' },
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
    console.log('\n✅ Chapter 2: Creating Textual Communication — setup complete.');
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
