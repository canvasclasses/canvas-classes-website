// Setup script: Class 9 ICT — Chapter 7: Safety and Security in the Cyber World (4 pages).
// Concept-only — NO walkthrough videos. English-only, published:false.
// Content traced to ~/Downloads/Class 9 ICT/iict107.pdf. Idempotent.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';
const CHAPTER_NO = 7;

let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt });
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const table = (caption, headers, rows) => ({ id: uuidv4(), type: 'table', order: _o++, caption, headers, rows });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why })) });

const PAGES = [];

// Page 1 — Welcome to the cyber world
reset();
PAGES.push({
  slug: 'cyber-world-and-footprint', title: 'Welcome to the Cyber World', page_number: 1,
  blocks: [
    hero('A person surrounded by online connections leaving a glowing trail of footprints',
      'A dark-canvas illustration of a young person at the centre of a web of glowing connections — chat, photos, video, profiles — with a faint trail of footprints leading away to show a lasting digital footprint. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'The same caution, a new world',
      `Your elders taught you to eat well, stay clean, and be wary of strangers in the real world. The **cyber world** is no different — you share, connect and meet people there too, so the same alertness applies. The twist: online, your actions leave a trail that can last forever.`),
    heading('Your digital footprint'),
    text(`Every time you post, comment, search or sign up, you add to your **digital footprint** — the information about you that exists on the Internet because of your online activity. Here's the catch: a digital footprint can stay online **even after you delete** the original post.\n\nThat's why the golden rule of the cyber world is simple: **pause before you share**. Once something is out there, it's very hard to fully take back.`),
    callout('remember', 'Think before you post',
      `Ask yourself: would I be comfortable if my parents, teachers, or a stranger saw this in five years? If not, don't post it. The Internet rarely forgets.`),
    callout('note', 'Try it yourself — Activity',
      `Make two lists. In the first, write the kinds of things that are **safe** to share online (a hobby, a favourite book). In the second, write things you should **never** share (home address, phone number, passwords). Discuss your lists with a parent or teacher.`),
    quiz([
      { q: 'What is a digital footprint?', opts: ['A type of shoe', 'The information about you that exists online from your activity', 'A computer virus', 'A search engine'], a: 1, why: 'A digital footprint is the trail of information about you on the Internet from your online activity.' },
      { q: 'A worrying feature of a digital footprint is that it…', opts: ['Disappears instantly', 'Can stay online even after you delete the post', 'Cannot be seen by anyone', 'Only exists on paper'], a: 1, why: 'Information can remain online even after the original post is deleted — so pause before sharing.' },
      { q: 'How should you treat the cyber world compared to the real world?', opts: ['Be far less careful', 'Be just as cautious and alert', 'Ignore all safety', 'Trust everyone'], a: 1, why: 'The cyber world needs the same caution and alertness as the real world.' },
    ]),
  ],
});

// Page 2 — Spotting email fraud
reset();
PAGES.push({
  slug: 'spotting-email-fraud', title: 'Spotting Email Fraud', page_number: 2,
  blocks: [
    hero('A suspicious email with a fake prize offer and a phishing link warning',
      'A dark-canvas illustration of an inbox with a flagged email shouting "YOU ARE A LUCKY WINNER!", a misspelt sender address, and a hook-shaped link labelled phishing being avoided. A shield blocks a malware bug. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'Too good to be true?',
      `"You're a lucky winner!" "Download this ₹3,500 game for FREE!" If an email sounds too good to be true, it almost always is. These are **spam** mails, sent to trick you — and spotting them is a skill every Internet user needs.`),
    heading('Spam, phishing and malware'),
    text(`Some emails are sent with bad intent. Learn the words:\n\n- **Spam** — unwanted or junk email, often offering fake prizes or asking for personal information\n- **Phishing** — an attempt to steal sensitive information (username, password, card details) by **pretending to be a trustworthy source** in an email\n- **Malware** — malicious software that can harm your device, sometimes installed when you click a bad link or attachment\n\nTell-tale signs of a fake email: a **misspelt sender address** (like "FIFA" spelt wrong), urgent "act in 48 hours" pressure, wrong details, and links asking you to "verify" your account.`),
    callout('warning', 'Protect yourself from email fraud',
      `**Do not** reply to unknown senders · **Do not** share personal information (name, birthday, school, address) · **Do not** fall for lucrative offers — delete them · **Do not** open attachments or click links from unknown senders · **Check the URL** for a secure site · **Do not** forward spam to others.`),
    table('Real vs fake-looking website addresses',
      ['Looks like...', 'Clue'],
      [
        ['uiidai.gov.in', 'Misspelt (an extra "i") — fake'],
        ['incometakindiaefilling.gov.in', 'Misspelt words — fake'],
        ['onlinesbi.com', 'Correctly spelt and secure — genuine'],
      ]),
    callout('note', 'Try it yourself — Activity',
      `Imagine an email offering a ₹3,500 game for free. Which of these proves it's fake: the "valid for 48 hours" line, the **misspelt sender address**, or the wrong game price? Explain why the misspelt address is the strongest clue.`),
    quiz([
      { q: 'Unwanted junk email sent to trick you is called…', opts: ['Spam', 'A bookmark', 'A hyperlink', 'A footer'], a: 0, why: 'Spam is unwanted/illegal email, often with malicious intent.' },
      { q: 'Phishing is an attempt to…', opts: ['Speed up your computer', 'Steal sensitive information by posing as a trustworthy source', 'Brighten a photo', 'Save a document'], a: 1, why: 'Phishing tries to obtain passwords and card details by pretending to be trustworthy.' },
      { q: 'Which is the strongest sign that an email is fake?', opts: ['It has a subject line', 'A misspelt sender address pretending to be a known brand', 'It is in English', 'It has a date'], a: 1, why: 'A misspelt sender address mimicking a real brand is a classic phishing giveaway.' },
    ]),
  ],
});

// Page 3 — Staying safe on social media
reset();
PAGES.push({
  slug: 'social-media-safety', title: 'Staying Safe on Social Media', page_number: 3,
  blocks: [
    hero('A social media profile with privacy settings and an identity-theft warning',
      'A dark-canvas illustration of a social-media profile card with a privacy-settings shield set to "high", a masked figure attempting identity theft being blocked, and icons for photos and messages. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'You only know their chosen identity',
      `Social networks connect you with people across the world — exciting! But online, it's hard to truly know who someone is; you only see the **identity they choose to show**. That single fact is why social-media safety matters so much.`),
    heading('Social networking and identity theft'),
    text(`A **social networking site** is an online platform to connect with people, send messages, and share photos and videos. You sign up using your **email ID** as the username.\n\nThe big risk is **identity theft** — someone deliberately using *your* identity to gain benefits or to defame you. Because the cyber world reaches far wider than the real one, the damage can be serious. So guard your information carefully.`),
    callout('warning', 'Safe social-media habits',
      `**Don't** reveal too much personal information (age, address, school) · Set your **privacy settings** carefully · **Never** share your password with anyone but a parent/guardian · **Change** your password often · Connect only with people you **know offline** · **Don't** post anything that hurts others · Be careful with photos — they leave permanent **digital footprints** · Protect friends by not posting their details · **Log out** when you're done.`),
    callout('remember', 'Would you do it on the street?',
      `You wouldn't tell your address to a random stranger on the street — so don't do it online either. Keep privacy settings high and connect only with people you know in real life.`),
    callout('note', 'Try it yourself — Activity',
      `Find the names of any **three social networking sites**. Then, with a parent, open the privacy settings of an account your family uses and check: who can see the posts? Is any personal information public that shouldn't be? Adjust the settings together.`),
    quiz([
      { q: 'What do you use as your username on most social networking sites?', opts: ['Your phone number', 'Your email ID', 'Your home address', 'Your password'], a: 1, why: 'You typically register on a social networking site using your email ID as the username.' },
      { q: 'Identity theft means someone…', opts: ['Brightens your photos', 'Deliberately uses your identity to gain benefits or defame you', 'Sends you a friend request', 'Bookmarks your page'], a: 1, why: 'Identity theft is the deliberate misuse of another person\'s identity for credit, benefits or defamation.' },
      { q: 'Whom may you share your social media password with?', opts: ['Anyone who asks', 'Only a parent or guardian', 'Your online friends', 'Strangers in a group'], a: 1, why: 'Never reveal your password to anyone other than a parent or guardian.' },
    ]),
  ],
});

// Page 4 — Standing up to cyber bullying
reset();
PAGES.push({
  slug: 'cyber-bullying', title: 'Standing Up to Cyber Bullying', page_number: 4,
  blocks: [
    hero('A person blocking a hurtful online message and talking to a trusted adult',
      'A dark-canvas illustration of a young person calmly tapping a "Block & Report" button on a hurtful message, with a screenshot being saved, and in the background a supportive parent and teacher to talk to. Dark background, orange accent labels, clean technical illustration style.'),
    callout('fun_fact', 'When the online world turns unkind',
      `Most online feedback is positive — but sometimes people turn cruel. That's **cyber bullying**, and it's not something to suffer in silence. There are clear, calm steps that put *you* back in control.`),
    heading('What cyber bullying looks like'),
    text(`**Cyber bullying** means sending, posting or sharing negative, harmful, false or mean content about someone. It is a **serious offence, punishable under Cyber Law**. It can include:\n\n- Nasty comments on or about you\n- A **fake profile** made in your name to defame you\n- Threatening or abusive messages\n- Being deliberately excluded from online groups\n- Embarrassing photos posted without your permission\n- Rumours and lies, or someone misusing your stolen account`),
    callout('warning', 'If you are cyber bullied — do this',
      `**Do not respond** or retaliate (it makes things worse) · **Screenshot** the evidence and keep a record · **Block and report** the offender on the platform · **Talk about it** — tell your parents and teachers; never keep it to yourself · **Be private** — keep settings high, connect only with people you know · **Be aware** — stay updated on safety measures.`),
    callout('remember', 'You are never alone',
      `Cyber bullying can affect you in many ways — but you don't have to face it by yourself. Telling a trusted adult is a sign of strength, not weakness.`),
    callout('note', 'Try it yourself — Activity',
      `Write a short "action plan" for a friend who is being cyber bullied. List the steps in order: don't respond, take a screenshot, block and report, and talk to a trusted adult. Decide which trusted adults *you* would go to.`),
    quiz([
      { q: 'Cyber bullying is…', opts: ['A harmless joke', 'A serious offence punishable under Cyber Law', 'A type of search engine', 'A way to save files'], a: 1, why: 'Cyber bullying is a serious offence punishable under Cyber Law.' },
      { q: 'What is the FIRST thing you should do if someone cyber bullies you?', opts: ['Retaliate with the same', 'Do not respond, and keep a record', 'Delete your account', 'Share your password'], a: 1, why: 'Do not respond or retaliate — it can make matters worse; instead keep evidence and report it.' },
      { q: 'After taking a screenshot of cyber bullying, you should…', opts: ['Forward it to everyone', 'Block and report the offender, and talk to a trusted adult', 'Ignore it forever', 'Post it publicly'], a: 1, why: 'Block and report the offender, and tell a trusted adult — never keep it to yourself.' },
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
    console.log('\n✅ Chapter 7: Safety and Security in the Cyber World — setup complete.');
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
