// Setup script: Class 9 ICT — Chapter 1: Introduction to ICT (6 pages).
// English-only (hinglish_blocks: []), published: false, no walkthrough videos
// (Ch1 is conceptual — videos begin in Ch2). All content traced to
// ~/Downloads/Class 9 ICT/iict101.pdf. Idempotent: skips pages that exist.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 1;

// ─── Block helpers ─────────────────────────────────────────────────────────
let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({
  id: uuidv4(), type: 'image', order: _o++,
  src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5',
  generation_prompt: prompt,
});
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const timeline = (title, events) => ({
  id: uuidv4(), type: 'timeline', order: _o++, title, orientation: 'vertical',
  events: events.map(([label, detail]) => ({ id: uuidv4(), label, detail })),
});
const table = (caption, headers, rows) => ({ id: uuidv4(), type: 'table', order: _o++, caption, headers, rows });
const quiz = (questions) => ({
  id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67,
  questions: questions.map(q => ({
    id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why,
  })),
});

// ─── Pages ─────────────────────────────────────────────────────────────────
const PAGES = [];

// Page 1 — What is ICT?
reset();
PAGES.push({
  slug: 'what-is-ict', title: 'What is ICT?', page_number: 1,
  blocks: [
    hero(
      'A student recording a science experiment on a phone and sharing it online',
      'Flat-lay collage of a teenage student in a classroom recording a small experiment on a smartphone, with glowing arrows carrying the video out to friends\' phones and a blog page on a laptop. Three labelled zones flow left to right: a notebook (Information), speech-and-chat bubbles (Communication), and devices — phone, laptop, router (Technology). Dark background, orange accent labels, clean technical illustration style.'
    ),
    callout('fun_fact', 'From a notebook to the whole world',
      'Muskan did a simple experiment — weighing a metal ball in air, water and oil. Instead of leaving it in her notebook, she **recorded a video**, shared it with classmates through a messenger app, and started a **blog** to post her learning. One small experiment reached far beyond her desk. That jump — from your notebook to the whole world — is exactly what ICT makes possible.'),
    heading('Breaking down three big words', 2),
    text('**ICT** stands for **Information, Communication and Technology**. Three everyday words, each doing a specific job:\n\n- **Information** — data arranged so it actually *means* something. "Muskan, Class IX, 14 years old, plays table tennis, loves drawing" is information drawn from plain data in her school profile. It even helps in decisions: based on this, her teacher picked her for a poster competition on *Dance forms of India*.\n- **Communication** — sharing or exchanging that information by speaking, writing, or any other medium. It is how your thoughts and feelings travel from you to someone else.\n- **Technology** — methods, systems and devices built from scientific knowledge for a practical purpose: the phone Muskan filmed on, the app she shared through, the blog she wrote.'),
    text('Put them together and you get the textbook definition: **ICT is everything that lets us create, store, process, transmit, share or exchange information by electronic means.** Radio, television and print media were the old carriers — and the digital revolution has reshaped each one. Analog TV became digital TV, the newspaper grew an online edition, and radio is now also streamed online.'),
    heading('What makes communication actually work', 2),
    text('Every act of communication has **four essential parts**:\n\n1. **Sender** — who starts the message (Muskan)\n2. **Message** — what is being shared (her experiment video)\n3. **Medium** — what carries it (the messenger app)\n4. **Receiver** — who gets it (her classmates)\n\nCommunication is only *effective* when all four line up — the right message, on the right medium, in the right order, reaching the right person. Miss one, and the meaning breaks.'),
    callout('note', 'Try it yourself — Activity',
      'Look at any single photo on your phone — a festival, a street, your family. **Write down three pieces of information** that photo communicates to someone who was not there. Then label the four parts of communication: who is the *sender*, what is the *message*, what *medium* are you using to share it, and who is the *receiver*?'),
    quiz([
      { q: 'What do the letters in ICT stand for?', opts: ['Internet, Computers and Telephones', 'Information, Communication and Technology', 'Images, Content and Text', 'Input, Control and Transfer'], a: 1, why: 'ICT = Information, Communication and Technology — the three ideas the whole subject is built on.' },
      { q: 'Data arranged so that it actually means something is called…', opts: ['Technology', 'A medium', 'Information', 'A network'], a: 2, why: 'Information is meaningful data — like Muskan\'s profile, which helped her teacher make a decision.' },
      { q: 'Which of these is NOT one of the four essential elements of communication?', opts: ['Sender', 'Message', 'Medium', 'Password'], a: 3, why: 'The four elements are sender, message, medium and receiver. A password is about security, not communication.' },
    ]),
  ],
});

// Page 2 — Evolution of ICT
reset();
PAGES.push({
  slug: 'evolution-of-ict', title: 'The Evolution of ICT', page_number: 2,
  blocks: [
    hero(
      'A timeline from smoke signals and carrier pigeons to smartphones and satellites',
      'Left-to-right evolution strip on a dark canvas: a smoke signal on a hill and a carrier pigeon, then a printed newspaper, then an old radio and a boxy TV, then a desktop computer and landline telephone, ending in a modern smartphone beaming to a satellite. Faint connecting line links each stage. Dark background, orange accent labels, clean technical illustration style.'
    ),
    callout('fun_fact', 'How people "messaged" 2,000 years ago',
      'Long before WiFi, people sent messages with **smoke signals, drum beats, carrier pigeons and human messengers**. It worked — but it was slow, unreliable, and sometimes downright unsafe. A pigeon could get lost; a messenger could be stopped. Imagine waiting weeks for a single reply.'),
    heading('From smoke signals to smartphones', 2),
    text('We cannot live in isolation — we constantly need to interact with people and with the world around us. The *tools* we use to do that have changed dramatically.\n\nWith each new technology — radio, television, computers, telephones, smartphones, digital cameras, laptops, interactive boards — communication became **faster, more reliable, and able to cross huge distances in seconds**. Today you can send a message across the globe and learn about world events in the blink of an eye.\n\nAlong the way, these tools stopped being *only* about communicating. They began to **create, store and manage information** too. That whole growing toolkit — the devices and resources we use to store, manage, create and communicate digital information — is what we call ICT.'),
    timeline('A quick journey through communication technology', [
      ['Ancient times', 'Smoke signals, drum sounds, carrier pigeons and messengers — slow and unreliable'],
      ['Print media', 'Newspapers, books and magazines carry information to many people at once'],
      ['Radio & Television', 'For a generation, these were the most advanced sources of information'],
      ['Computers & Telephones', 'Information can now be created, stored and managed, not just sent'],
      ['Internet & Smartphones', 'Instant, worldwide communication in everyone\'s pocket'],
      ['Wireless, AR & VR', 'The newest generation lives in wireless, augmented and virtual spaces'],
    ]),
    text('Notice the pattern: each innovation made the tools **smaller** and **faster** at the same time. The room-sized computers of the past now fit on your wrist — and they process and share information far quicker than their giant ancestors.'),
    callout('note', 'Try it yourself — Activity',
      'Ask a grandparent or an older neighbour: *how did they send an urgent message to a relative in another city when they were your age?* Note down the method and roughly how long a reply took. Then compare it with how long the same message takes today.'),
    quiz([
      { q: 'Which of these was a mode of communication in ancient times?', opts: ['Smartphones', 'Carrier pigeons', 'Online radio', 'Video calls'], a: 1, why: 'Smoke signals, drum sounds, pigeons and messengers were the ancient modes — slow and unreliable compared to today.' },
      { q: 'As communication technology evolved, the tools generally became…', opts: ['Bigger and slower', 'Smaller and faster', 'Smaller and slower', 'Bigger and faster'], a: 1, why: 'Innovation shrank the devices while increasing their speed — room-sized computers became pocket-sized smartphones.' },
      { q: 'Besides communicating, modern ICT tools also let us…', opts: ['Only make phone calls', 'Create, store and manage information', 'Replace human teachers', 'Stop using the internet'], a: 1, why: 'Computers and smartphones do more than send messages — they create, store and manage digital information too.' },
    ]),
  ],
});

// Page 3 — Why ICT?
reset();
PAGES.push({
  slug: 'why-ict', title: 'Why ICT? Anywhere, Anytime, Anyone', page_number: 3,
  blocks: [
    hero(
      'Two cousins in different cities talking face to face through a video call',
      'Split-screen illustration on a dark canvas: on the left a girl in Bengaluru gardening with a phone propped up, on the right another girl at a laptop, a glowing video-call link arcing between two city skylines. Small floating icons of a weather forecast, a calendar reminder and a chat bubble orbit the link. Dark background, orange accent labels, clean technical illustration style.'
    ),
    callout('fun_fact', 'When a phone call was a luxury',
      'Muskan\'s cousin Nishi lives far away in Bengaluru. They love talking for hours about gardening — but regular phone calls were so **expensive** they had to cut their chats short. Then a friend told Muskan about free video-calling apps like Skype and Google Meet. Now they talk as long as they like, for almost nothing. ICT didn\'t just make it easier — it made it *affordable*.'),
    heading('Three things ICT changed forever', 2),
    text('**1. Anywhere, anytime, by anyone.** Through social media, apps, blogs and wikis, you can now communicate worldwide whenever you want. Distance and time, the two oldest barriers, almost disappear.\n\n**2. It saves time and money.** A video call costs a fraction of a long-distance phone call. An email reaches the other side of the planet for free, instantly. These savings add up in every field.\n\n**3. Access to instant data.** Up-to-the-minute information helps you predict, decide and learn. When Muskan\'s family planned a trip to Mount Abu, her mother wasn\'t sure whether to pack woollens. Muskan simply checked the **recent temperatures on a weather website** — and packed exactly right.'),
    text('Step back and the bigger picture is striking. There was a generation with no telephone at all. Then radio and TV felt like the cutting edge. Now you live in a world of internet, wireless, augmented and virtual spaces. Each leap shrank the tools and sped them up — and opened the door to innovation in *every* field.'),
    callout('note', 'Try it yourself — Activity',
      'Talk to your friends, parents and people around you. **Ask each one: how is ICT essential in their daily life?** Note the main points — a shopkeeper taking digital payments, a parent video-calling family, a student watching lessons online. You\'ll be surprised how many different answers you get.'),
    quiz([
      { q: 'Why were Muskan and Nishi able to talk for hours after switching to a video-calling app?', opts: ['Video calls are slower', 'Video calling is far more cost-effective than phone calls', 'They stopped gardening', 'Phone calls became free'], a: 1, why: 'Apps like Skype and Google Meet are much cheaper than long-distance phone calls, so they no longer had to cut their chats short.' },
      { q: 'How did ICT help Muskan decide what to pack for Mount Abu?', opts: ['It packed the bag automatically', 'It gave access to instant weather data', 'It cancelled the trip', 'It called the hotel'], a: 1, why: 'Access to instant data — recent temperatures on a weather website — helped her make a smart decision.' },
      { q: 'Which phrase best captures a key benefit of ICT?', opts: ['Slow but steady', 'Anywhere, anytime, by anyone', 'Only for big companies', 'One city at a time'], a: 1, why: 'ICT lets almost anyone communicate from almost anywhere, at almost any time.' },
    ]),
  ],
});

// Page 4 — ICT in everyday life and learning
reset();
PAGES.push({
  slug: 'ict-in-life-and-learning', title: 'ICT in Everyday Life and Learning', page_number: 4,
  blocks: [
    hero(
      'A student learning an online course and organising a digital collection',
      'Warm dark illustration of a student at a desk: one screen shows an online puppetry course playing, another shows a neatly tagged digital stamp album, and a calendar app pings a reminder. Floating around: an e-book, an e-newspaper and a shopping-cart icon. Dark background, orange accent labels, clean technical illustration style.'
    ),
    callout('fun_fact', 'A free course that travelled to her',
      'One summer, Muskan couldn\'t visit her grandmother and was bored at home. A friend pointed her to a free online course on **puppetry** — a *MOOC* (Massive Open Online Course), open to anyone, anytime, anywhere. She learnt puppet-making and storytelling from her own room, and planned a puppet show for school. The classroom came to her.'),
    heading('ICT as a learning superpower', 2),
    text('**Learn at your own pace.** ICT lets you learn anytime, anywhere, at whatever speed suits you. Online courses, e-tutorials and MOOCs have opened the door to continuous, lifelong learning — you can even build your own personal learning environment.\n\n**Plan and manage.** ICT tools keep you organised. Muskan kept forgetting to return library books and paying fines — so she set reminders and exam dates in a **digital calendar app** with alerts and priorities. Problem solved.\n\n**Give things a lasting life.** Her grandfather\'s postage-stamp album would fade over time, so Muskan and her brother **scanned every stamp** and tagged each with its country, date and event. Now any stamp is a quick search away, safe forever.'),
    heading('ICT in everyday life and education', 2),
    text('In daily life, ICT is everywhere: reading e-newspapers, e-magazines and e-books, online shopping, paying bills, using mobile apps, booking doctor appointments online.\n\nIn **education**, it runs through almost every school function — admissions, timetables, classroom teaching, evaluation, lab and resource management, examinations and certificates. E-resources like websites, e-books and Open Educational Resources (OERs) are now everyday tools.\n\nIt also powers **inclusive education** — reaching every learner, including children with special needs. Talking books, the *talk-back* feature on phones, and GPS-enabled walking sticks are making real, daily differences in people\'s lives.'),
    callout('note', 'Try it yourself — Activity',
      'Walk around your home and **list every use of ICT you can spot** — the TV recommendations, a parent paying a bill on an app, a smart speaker, online homework. Aim for at least five. Then circle the one your family would find hardest to give up.'),
    quiz([
      { q: 'What is a MOOC?', opts: ['A type of computer virus', 'A free online course open to anyone, anytime, anywhere', 'A paid private tutor', 'A messaging app'], a: 1, why: 'MOOC stands for Massive Open Online Course — Muskan took a free puppetry MOOC from home.' },
      { q: 'How did Muskan stop forgetting library due-dates?', opts: ['She stopped borrowing books', 'She set reminders in a digital calendar app', 'She paid someone to remind her', 'She memorised every date'], a: 1, why: 'ICT tools help us plan and manage — a calendar app with alerts kept her on track.' },
      { q: 'Talking books and the talk-back feature on phones are examples of ICT used for…', opts: ['Online shopping', 'Inclusive education', 'Playing games', 'Weather forecasting'], a: 1, why: 'These assistive technologies support inclusive education, helping learners including those with special needs.' },
    ]),
  ],
});

// Page 5 — ICT all around us: fields and applications
reset();
PAGES.push({
  slug: 'ict-all-around-us', title: 'ICT All Around Us', page_number: 5,
  blocks: [
    hero(
      'A wheel of fields — health, farming, transport, business, government — all connected by ICT',
      'Central glowing ICT hub on a dark canvas with spokes reaching out to six labelled scenes: a robotic surgery, a farmer checking a weather app, a GPS-guided vehicle, an online shopping cart, a hotel-booking screen, and an e-governance service window. Clean iconographic style. Dark background, orange accent labels, clean technical illustration style.'
    ),
    callout('fun_fact', 'A surgeon who isn\'t even in the room',
      'With ICT, complex surgeries can be guided by **robots** and by doctors sitting in *different cities*, working together over a network. The result: smaller cuts, more precision, and much faster recovery. Distance is no longer a barrier to expert care.'),
    heading('One technology, almost every field', 2),
    text('How useful ICT is depends on the user — but its reach is enormous. The same core idea, *create and communicate information electronically*, shows up almost everywhere.'),
    table('Where ICT is at work around you',
      ['Field', 'How ICT is used'],
      [
        ['Everyday life', 'E-newspapers, e-books, online shopping, bill payment, doctor appointments'],
        ['Education', 'Teaching, assessment, e-resources, and inclusive learning for all'],
        ['Art & culture', 'Creating and sharing artwork; spreading art forms from one region to another'],
        ['Health', 'Robotic, less-invasive surgery; specialists collaborating across distance'],
        ['Telecommunication', 'Affordable smartphones and app-based services reaching almost everyone'],
        ['Agriculture', 'Accurate weather forecasts and satellite mapping of resources for better yields'],
        ['Transport', 'GPS navigation, RADAR for planes and trains, online ticket booking'],
        ['Business', 'Online marketing and sales — cost-effective, time-saving, new kinds of jobs'],
        ['Tourism', 'Online hotel booking, previewing a place, and easy digital payments'],
        ['Administration', 'Public safety, tracing criminals\' digital footprints, and e-Governance'],
      ]),
    text('Take **agriculture**: early, fairly accurate rain and weather predictions from the Meteorological Department help farmers get better yields, and satellites help locate resources like oil wells and coal mines. Or **e-Governance** — governments use ICT to deliver services to citizens quickly, conveniently and transparently. The pattern repeats field after field.'),
    callout('note', 'Try it yourself — Activity',
      'Pick **two professionals** you know — say a shopkeeper, tailor, milkman, doctor or nurse. Ask each one how they use ICT in their work, and write down the ways. Notice how even very different jobs lean on the same handful of digital tools.'),
    quiz([
      { q: 'How has ICT changed surgery in healthcare?', opts: ['Made it slower', 'Enabled robotic, less-invasive surgery with faster recovery', 'Removed the need for hospitals', 'Made it more expensive only'], a: 1, why: 'Robotic technology and networked doctors make surgeries more precise, less invasive, and quicker to recover from.' },
      { q: 'In which field do GPS navigation and RADAR play a major role?', opts: ['Cooking', 'Transport', 'Painting', 'Singing'], a: 1, why: 'Transport uses GPS for navigation and RADAR for guiding planes and trains, plus online booking.' },
      { q: 'e-Governance mainly means using ICT to…', opts: ['Play online games', 'Deliver government services to citizens efficiently and transparently', 'Sell mobile phones', 'Forecast the weather'], a: 1, why: 'e-Governance is the use of ICT across government to serve citizens quickly, conveniently and transparently.' },
    ]),
  ],
});

// Page 6 — Is it an ICT? Becoming a smart user
reset();
PAGES.push({
  slug: 'is-it-an-ict', title: 'Is It an ICT? Becoming a Smart User', page_number: 6,
  blocks: [
    hero(
      'A sorting game: gadgets sorted into ICT and not-ICT trays',
      'Playful dark illustration of two labelled trays — "ICT" and "Not ICT" — with gadgets mid-sort: a smart TV, digital camera, computer, WiFi router and hard disk floating toward the ICT tray, a refrigerator drifting to the other. A magnifying glass inspects one device. Dark background, orange accent labels, clean technical illustration style.'
    ),
    callout('fun_fact', 'A smart test for "is this an ICT?"',
      'Here\'s a quick filter: does the device help **create, store, process, transmit or share information by electronic means?** A smart TV, a computer, WiFi, a hard disk — yes. A refrigerator keeps food cold but doesn\'t handle information, so it isn\'t an ICT. One simple question sorts most gadgets.'),
    heading('What counts as an ICT — and what doesn\'t', 2),
    text('ICT is any technology used to **create, display, store, process, transmit, share or exchange information** electronically. Run any gadget through that test:\n\n- A **digital camera** captures and stores images → **ICT**\n- A **smart TV** receives and displays information → **ICT**\n- **WiFi** transmits information → **ICT**\n- A **hard disk** stores information → **ICT**\n- A **refrigerator** cools food but handles no information → **not ICT**\n\nThe question is never "is it electronic?" but "does it work with *information*?"'),
    table('Quick check: ICT or not?',
      ['Device', 'ICT?', 'Why'],
      [
        ['Computer', 'Yes', 'Creates, stores and processes information'],
        ['Smart TV', 'Yes', 'Receives and displays information'],
        ['WiFi', 'Yes', 'Transmits information wirelessly'],
        ['Hard disk', 'Yes', 'Stores digital information'],
        ['Radio', 'Yes', 'Transmits and receives information (sound)'],
        ['Refrigerator', 'No', 'Cools food — does not handle information'],
      ]),
    callout('note', 'Try it yourself — Activity',
      'Make your own two-column list — **ICT** and **Not ICT** — and sort these: digital camera, refrigerator, smart TV, telephone, DVD player, computer, headphone, WiFi, radio, hard disk. For each one, write a one-line reason. Tip: ask "does it work with information?"'),
    callout('remember', 'What\'s coming next',
      'Now that you know *what* ICT is and *why* it matters, the rest of this book is hands-on. You\'ll learn to **create text documents, edit images, make audio and video, build presentations, get connected on the internet, stay safe online, and even play with logic**. From here on, you don\'t just read about ICT — you start *using* it.'),
    quiz([
      { q: 'Which one of these is NOT an ICT?', opts: ['Computer', 'WiFi', 'Refrigerator', 'Smart TV'], a: 2, why: 'A refrigerator cools food but does not create, store or share information, so it is not an ICT.' },
      { q: 'What is the best single test for whether a device is an ICT?', opts: ['Is it expensive?', 'Does it work with information electronically?', 'Is it big?', 'Does it need batteries?'], a: 1, why: 'ICT is about creating, storing, processing, transmitting or sharing information by electronic means.' },
      { q: 'Why is a hard disk considered an ICT?', opts: ['It cools the computer', 'It stores digital information', 'It makes sound', 'It connects to WiFi only'], a: 1, why: 'A hard disk stores information digitally, which is exactly what ICT devices do.' },
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
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found. Run setup_class9_ict_book.js first.`);
    console.log(`✓ Found book: ${book.title} (${book._id})`);

    const ch = (book.chapters || []).find(c => c.number === CHAPTER_NO);
    if (!ch) throw new Error(`Chapter ${CHAPTER_NO} shell missing — re-run setup_class9_ict_book.js.`);

    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) {
        console.log(`  ⤷ Page "${p.slug}" already exists — skipping.`);
        pageIds.push(String(existing._id));
        continue;
      }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId,
        book_id: String(book._id),
        chapter_number: CHAPTER_NO,
        page_number: p.page_number,
        slug: p.slug,
        title: p.title,
        blocks: p.blocks,
        hinglish_blocks: [],
        tags: [],
        published: false,
        reading_time_min: 4,
        created_at: new Date(),
        updated_at: new Date(),
      });
      pageIds.push(pageId);
      console.log(`  ✓ Created page ${p.page_number}: ${p.slug} (${p.blocks.length} blocks)`);
    }

    // Wire any new page ids into chapter 1 (preserve order, no duplicates).
    const toAdd = pageIds.filter(id => !(ch.page_ids || []).includes(id));
    if (toAdd.length) {
      await books.updateOne(
        { _id: book._id, 'chapters.number': CHAPTER_NO },
        { $push: { 'chapters.$.page_ids': { $each: toAdd } }, $set: { updated_at: new Date() } }
      );
      console.log(`✓ Wired ${toAdd.length} page(s) into Chapter ${CHAPTER_NO}.`);
    } else {
      console.log('✓ All pages already wired into the chapter.');
    }

    console.log('\n✅ Chapter 1: Introduction to ICT — setup complete.');
    PAGES.forEach(p => console.log(`  → /class9-ict/${p.slug}`));
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
