// Setup script: Class 9 ICT — Chapter 6: Getting Connected: Internet (6 pages).
// Browser, search, email tutorial. Pages 1,2,3,5,6 video-driven; page 4 is the
// online-safety concept page (no walkthrough). English-only, published:false.
// Content traced to ~/Downloads/Class 9 ICT/iict106.pdf. Idempotent.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 6;

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

// Page 1 — The web: browsers, websites, webpages
reset();
PAGES.push({
  slug: 'web-browsers-and-websites', title: 'The Web: Browsers, Websites and Pages', page_number: 1,
  blocks: [
    hero('A web browser window with an address bar opening a website',
      'A dark-canvas illustration of a web-browser window: a prominent address bar at the top with a URL typed in, a webpage of multimedia resources below, and a hand-cursor hovering over a glowing hyperlink. A small globe icon labelled WWW floats nearby. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'The library that fits in your pocket',
      `Once, the library was *the* place to gather information. Today, the **Internet** lets you search a world of text, images, audio and video for a project — from any computer, laptop or phone with a connection. The library never closed; it just moved into your pocket.`),
    heading('Finding your way around the web'),
    text(`To reach online resources you need a device with an Internet connection and a piece of software called a **web browser**. A few words make the web easy to navigate:\n\n- **World Wide Web (WWW)** — the information space on the Internet where documents and resources are stored\n- **Web browser** — software for accessing information on the WWW (e.g. Firefox, Chrome)\n- **Address bar** — the box at the top of the browser where you type the address (**URL**) of what you want\n- **Webpage** — a single collection of multimedia information\n- **Website** — a collection of many webpages; the first one you see is the **Home Page**`),
    heading('Hyperlinks: jumping between pages'),
    text(`Notice how, on some text or images, the cursor changes to a little **hand**? That marks a **hyperlink** — a link that jumps you to another webpage or resource when clicked. Hyperlinks are the threads that tie the whole web together.`),
    video('Watch: open a browser, type a URL in the address bar, and follow a hyperlink to another page.'),
    callout('note', 'Try it yourself — Activity',
      `Open a browser and type **creativecommons.org** in the address bar. Explore the site as if researching a project on "Role of youth in the development of a nation". Find **three hyperlinks**, click them, and notice where each one takes you.`),
    quiz([
      { q: 'What is a web browser?', opts: ['A type of website', 'Software for accessing information on the World Wide Web', 'A search keyword', 'An email account'], a: 1, why: 'A web browser is the software you use to access resources on the WWW.' },
      { q: 'A collection of many webpages is called a…', opts: ['Webpage', 'Website', 'Address bar', 'Hyperlink'], a: 1, why: 'A website is a collection of webpages; the first one you see is the Home Page.' },
      { q: 'When the cursor becomes a hand over some text, it means the text is a…', opts: ['Spelling mistake', 'Hyperlink to another page', 'Header', 'Password'], a: 1, why: 'A hand cursor marks a hyperlink — click it to jump to another webpage or resource.' },
    ]),
  ],
});

// Page 2 — Searching with search engines
reset();
PAGES.push({
  slug: 'search-engines-and-keywords', title: 'Searching Smart with Search Engines', page_number: 2,
  blocks: [
    hero('A search engine box with keywords and results filtered into All, Images and Videos',
      'A dark-canvas illustration of a search engine: a central search box with a keyword typed in, and a results page below with category tabs "All", "Images" and "Videos". Magnifier icon glows over the box. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'The right words find the right answers',
      `Don't know a website's address? A **search engine** finds it for you. The trick is the **keyword** you type — choose it well and the web hands you exactly what you need; choose it poorly and you drown in results.`),
    heading('Search engines and keywords'),
    text(`A **search engine** is a tool that searches the web for information. You type a **keyword** — a word or phrase — into the **search box**, and it lists webpages containing that word or phrase.\n\nTo pick good keywords, first ask: *What* type of information do I want (facts, ideas, opinions)? *What form* — text, images, or videos? Then choose **precise** words and **avoid common words** like "the", "of" or "apply", which only add noise.`),
    table('Some popular search engines',
      ['Search engine', 'Address'],
      [['Google', 'google.com'], ['Bing', 'bing.com'], ['Yahoo', 'yahoo.com'], ['DuckDuckGo', 'duckduckgo.com']]),
    heading('Filtering your results'),
    text(`A results page shows everything under **All** by default — but you can narrow it. Click the **Images** tab for pictures only, or **Videos** for videos only. This categorises results to exactly the kind of resource you need. Sometimes a site asks you to install a **plug-in** (extra software that lets the browser display certain content) — click the link to add it. And always **cite the source** of anything you use, to credit its creator.`),
    video('Watch: search a keyword in a search engine, then filter the results to show only images.'),
    callout('note', 'Try it yourself — Activity',
      `Search the keyword **"Role of youth in the development of a nation"**. On the results page, answer: what kinds of multimedia resources appear? Did you spot any hyperlinks? Now click the **Images** tab to get a page of pictures only.`),
    quiz([
      { q: 'A search engine helps you to…', opts: ['Print documents', 'Search the web for information', 'Edit photos', 'Record audio'], a: 1, why: 'A search engine is a tool that searches the web for information using keywords.' },
      { q: 'Which makes a better keyword choice?', opts: ['Common words like "the" and "of"', 'Precise words related to what you want', 'Random letters', 'Your password'], a: 1, why: 'Precise words find relevant results; common words like "the" or "of" just add noise.' },
      { q: 'To see only pictures on a results page, you click the…', opts: ['All tab', 'Images tab', 'Videos tab', 'Address bar'], a: 1, why: 'The Images tab filters results to show only pictures.' },
    ]),
  ],
});

// Page 3 — Search operators and bookmarks
reset();
PAGES.push({
  slug: 'search-operators-and-bookmarks', title: 'Power Searching and Bookmarks', page_number: 3,
  blocks: [
    hero('Search operators narrowing results, and a star bookmark icon in the address bar',
      'A dark-canvas illustration: a search box showing keywords joined by AND / OR / quotation marks, a funnel narrowing many results down to a few, and a glowing star bookmark icon in the browser address bar. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Tell the search engine exactly what you mean',
      `Plain keywords are good; **search operators** are sharper. Little symbols like **AND**, **OR** and **quotation marks** tell the search engine precisely how to narrow the focus — turning a flood of results into a short, relevant list.`),
    heading('Search operators'),
    text(`Use these to fine-tune any search:`),
    table('Search operators',
      ['Operator', 'Example', 'What you get'],
      [
        ['AND', 'youth AND nation', 'Pages having ALL the keywords'],
        ['OR', 'youth OR nation', 'Pages having AT LEAST ONE keyword'],
        ['" "', '"Role of youth in the development of nation"', 'Pages having the entire exact phrase'],
        ['…', '"Role of youth" 1990…2018', 'Pages within the specified number/year range'],
      ]),
    heading('Bookmarking pages for later'),
    text(`Found a page you'll want again? Don't print it (that wastes paper). Instead **bookmark** it — **bookmarking** is the process of saving a webpage's URL for future reference. Click the **star icon** in the address bar, and the page is one click away whenever you need it.`),
    video('Watch: narrow a search with AND, OR and quotation marks, then bookmark a useful page.'),
    callout('note', 'Try it yourself — Activity',
      `Pick a project topic. Run one search using **AND**, one using **OR**, and one using **"quotation marks"** around a phrase. Compare how the results change. Then **bookmark** the most useful page using the star icon.`),
    quiz([
      { q: 'Searching for `youth AND nation` returns pages that have…', opts: ['At least one of the words', 'All of the words', 'Neither word', 'Only images'], a: 1, why: 'The AND operator returns pages containing all the keywords.' },
      { q: 'Putting a phrase in "quotation marks" finds pages with…', opts: ['Any one of the words', 'The entire exact phrase', 'No results', 'Only videos'], a: 1, why: 'Quotation marks match the entire exact phrase.' },
      { q: 'Saving a webpage\'s URL for future reference is called…', opts: ['Downloading', 'Bookmarking', 'Printing', 'Uploading'], a: 1, why: 'Bookmarking saves a page\'s URL (via the star icon) for quick future access.' },
    ]),
  ],
});

// Page 4 — Judging resources and staying safe (concept page, no video)
reset();
PAGES.push({
  slug: 'evaluating-and-safe-searching', title: 'Judging Resources and Staying Safe', page_number: 4,
  blocks: [
    hero('A magnifying glass checking a website for trust signals like https and a padlock',
      'A dark-canvas illustration of a magnifying glass inspecting a webpage, highlighting a padlock and "https" in the URL, a "Safe Search: ON" toggle, and a checklist of trust questions beside it. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Anyone can publish anything',
      `Here's the catch with the Internet: **anyone can publish anything**. A page can look polished and still be wrong. So a smart user doesn't just *find* information — they *judge* it before trusting it.`),
    heading('Evaluating what you find'),
    text(`Before relying on a web resource, run it through these questions:\n\n- **Who** made the website, and how can you contact the owner?\n- **What** is it about — is it commercial, educational, something else?\n- **Who is it for** — teachers, students, or both?\n- **Is it reliable?** Always **cross-check** the information against other websites, books and experts.\n- **Free or paid?** Check whether the information is free or behind a payment.\n\nIf you can't answer these confidently, treat the resource with caution.`),
    heading('Safe practices while searching'),
    text(`The web is full of opportunity — and a few traps. Stay safe with these habits:\n\n- Prefer websites whose URL starts with **"https"** — the "s" signals a **secured** site\n- Keep your browser's **Safe Search** setting **ON**\n- **Think twice before clicking** a link — it may lead somewhere not appropriate for your age\n- Since most of your time online is spent in the browser, **choose your web browser carefully**\n\nYou'll learn much more about online safety in Chapter 7.`),
    callout('remember', 'Look for the "s"',
      `**http** vs **https** — that single "s" means the connection is secured. Favour https sites, especially when logging in or sharing any information.`),
    callout('note', 'Try it yourself — Activity',
      `Open any website you use for schoolwork. Run it through the evaluation questions above — who made it, what it's for, is it reliable? Check whether its address starts with **https**, and confirm your browser's **Safe Search** is ON.`),
    quiz([
      { q: 'Why must you evaluate information found on the Internet?', opts: ['It is always correct', 'Anyone can publish anything, so it may not be accurate', 'It is always paid', 'Browsers block all good sites'], a: 1, why: 'Anyone can publish anything online, so information must be checked for quality and accuracy.' },
      { q: 'A URL starting with "https" indicates the website is…', opts: ['Free', 'Secured', 'Educational', 'Fake'], a: 1, why: 'The "s" in https indicates a secured website.' },
      { q: 'Which is a safe searching habit?', opts: ['Turn Safe Search OFF', 'Click every link quickly', 'Keep Safe Search ON and think before clicking', 'Avoid using a browser'], a: 2, why: 'Keep Safe Search ON and pause before clicking unfamiliar links.' },
    ]),
  ],
});

// Page 5 — Setting up email
reset();
PAGES.push({
  slug: 'setting-up-email', title: 'Setting Up Your Email', page_number: 5,
  blocks: [
    hero('An email sign-up form with a username and a strong password field',
      'A dark-canvas illustration of an email registration form: fields for username, a strong password with a strength meter, and personal details, with a sample address "shiksha@gmail.com" shown below. A shield icon signals security. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'A letter that arrives in seconds',
      `Searching is only half the web. The other half is **sharing** — and one of the oldest, most useful ways is **email**. From any Internet device, an email reaches a friend in another city in *seconds*, attachments and all.`),
    heading('Creating an email account'),
    text(`**Email** (electronic mail) lets you send and receive messages over the Internet. First you create an account with an **email service provider**. The steps:\n\n1. Type the provider's URL and click **Create account / Sign Up / Register**\n2. Choose a **unique username** (it tells you if one is already taken)\n3. Set a **strong password** (passwords are **case-sensitive**)\n4. Fill in the required details — name, date of birth, etc.\n5. Read the **Terms and Conditions**, then click **Agree**\n\nYour address takes the form **username@provider**, like \`shiksha@gmail.com\`.`),
    table('Some email service providers',
      ['Provider', 'URL'],
      [['Gmail', 'gmail.com'], ['Yahoo Mail', 'login.yahoo.com'], ['Outlook', 'outlook.com'], ['mail.com', 'mail.com']]),
    callout('remember', 'Checklist for a strong password',
      `A strong password uses a **mix of uppercase and lowercase letters, numbers and symbols**, is **at least 6–8 characters** long, and is **unique** for each important account. Example shape: \`13Hlt@8L\`. Change it frequently.`),
    video('Watch: create an email account and set a strong password.'),
    callout('note', 'Try it yourself — Activity',
      `With an adult's help, create an email account on any provider. Practise inventing a **strong password** using the checklist — mix letters, numbers and a symbol, at least 6–8 characters. Don't reuse a password from another account.`),
    quiz([
      { q: 'An email address takes the form…', opts: ['username.provider', 'username@provider', 'provider/username', 'www.username'], a: 1, why: 'Email addresses look like username@provider, e.g. shiksha@gmail.com.' },
      { q: 'Which is the strongest password?', opts: ['password', '12345', '13Hlt@8L', 'aaaaaa'], a: 2, why: 'A strong password mixes uppercase, lowercase, numbers and symbols and is at least 6–8 characters.' },
      { q: 'Which email ID is VALID?', opts: ['Aayush. gmail.com', 'School_yahoo.com', 'Suhana@rediffmail.com', 'name#mail'], a: 2, why: 'A valid email needs an @ between the username and provider — only Suhana@rediffmail.com has it.' },
    ]),
  ],
});

// Page 6 — Sending and receiving email safely
reset();
PAGES.push({
  slug: 'sending-receiving-email', title: 'Sending and Receiving Email Safely', page_number: 6,
  blocks: [
    hero('A compose-email window with To, Subject, attachment and Send, beside an inbox',
      'A dark-canvas illustration of a compose-email window showing To, Subject and message fields, a paperclip attachment icon, and a Send button, beside an inbox list of received mails. A small shield warns over an attachment. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Send a file across the country',
      `Writing an email is like writing a letter — except you can clip a whole document, photo or video to it and it lands in seconds. Attaching a file is also called **uploading**; pulling one down to your computer is **downloading**.`),
    heading('Composing and sending'),
    text(`To send an email: **log in**, click **Compose / Write**, then fill it in:\n\n- **To** — the email ID of the person you're writing to\n- **Subject** — a short description of the message's topic\n- **Message** — your content\n- **Attachment** (paperclip) — to clip on a document, photo or video\n- **Send** — the button that delivers it\n\nTwo extra fields: **Cc** (Carbon Copy) sends a visible copy to others; **Bcc** (Blind Carbon Copy) sends a copy whose addresses stay hidden from everyone.`),
    video('Watch: compose an email, attach a document, and send it; then open and read your inbox.'),
    heading('Receiving — and downloading safely'),
    text(`Mails you receive land in your **Inbox** — an electronic folder for incoming messages. Click one to read it.\n\nBut be careful with **attachments**. A file can carry a **virus** — a harmful program that damages your computer and its data. Before you download any attachment, ask:\n\n- Is it from a **trusted source**?\n- Is it in a **known format**?\n- Have you run an **anti-virus scan**?\n\n**Anti-virus** programs (like Norton, Kaspersky, McAfee) detect and destroy viruses. Only download once your answers are all "yes".`),
    callout('note', 'Try it yourself — Activity',
      `Compose an email to a friend about an event. Write a clear **Subject**, **attach** a file (such as a saved document), and **Send** it. Then check your **Inbox**, open a message, and — before downloading any attachment — run the three safety checks.`),
    quiz([
      { q: 'In an email, the "Subject" field is for…', opts: ['The receiver\'s address', 'A short description of the message\'s topic', 'The attachment', 'Your password'], a: 1, why: 'Subject is a brief description of what the email is about; To holds the receiver\'s address.' },
      { q: 'Which copy field hides the recipients\' addresses from everyone?', opts: ['To', 'Cc', 'Bcc', 'Subject'], a: 2, why: 'Bcc (Blind Carbon Copy) sends a copy whose addresses are not visible to others.' },
      { q: 'Before downloading an email attachment, you should check that it is…', opts: ['Large in size', 'From a trusted source and virus-scanned', 'Colourful', 'In a foreign language'], a: 1, why: 'Attachments can carry viruses, so confirm a trusted source, known format and a clean anti-virus scan first.' },
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
    console.log('\n✅ Chapter 6: Getting Connected: Internet — setup complete.');
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
