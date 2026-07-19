// READ-ONLY. Dumps a book chapter's pages as readable text for content review.
// Usage: node scripts/livebook-review/_dump_chapter.js <bookSlug> <chapterNumber> [maxPage]
// Writes nothing to Mongo. Outputs to stdout.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const [, , bookSlug, chapterNumArg, maxPageArg] = process.argv;
if (!bookSlug || !chapterNumArg) {
  console.error('Usage: node _dump_chapter.js <bookSlug> <chapterNumber> [maxPage]');
  process.exit(1);
}
const chapterNumber = Number(chapterNumArg);
const maxPage = maxPageArg ? Number(maxPageArg) : Infinity;

function txt(v) {
  if (v == null) return '';
  return String(v).replace(/\s+/g, ' ').trim();
}

function renderBlock(b, i) {
  const type = b.type || b.block_type || 'unknown';
  const lines = [`  [block ${i}] type=${type}${b.id ? ' id=' + b.id : ''}`];
  // Common text-bearing fields across block types
  const fields = ['title', 'subtitle', 'heading', 'text', 'markdown', 'body',
    'caption', 'prompt', 'question', 'alt', 'label', 'content', 'explanation',
    'answer', 'summary', 'sim', 'simulator', 'simulation', 'component', 'variant',
    'audio_url', 'video_url', 'src', 'url'];
  for (const f of fields) {
    if (b[f] != null && typeof b[f] !== 'object') {
      const val = txt(b[f]);
      if (val) lines.push(`     ${f}: ${val.slice(0, 4000)}`);
    }
  }
  // Nested text object (e.g. text.markdown)
  if (b.text && typeof b.text === 'object') {
    for (const k of Object.keys(b.text)) {
      const val = txt(b.text[k]);
      if (val) lines.push(`     text.${k}: ${val.slice(0, 4000)}`);
    }
  }
  // Reasoning blocks
  if (b.steps && Array.isArray(b.steps)) {
    b.steps.forEach((s, si) => lines.push(`     step ${si}: ${txt(JSON.stringify(s)).slice(0, 800)}`));
  }
  // Quiz options / questions
  if (b.questions && Array.isArray(b.questions)) {
    b.questions.forEach((q, qi) => lines.push(`     Q${qi}: ${txt(JSON.stringify(q)).slice(0, 1200)}`));
  }
  if (b.options && Array.isArray(b.options)) {
    b.options.forEach((o, oi) => lines.push(`     opt ${oi}: ${txt(typeof o === 'object' ? JSON.stringify(o) : o).slice(0, 600)}`));
  }
  // Catch-all: any other object keys we didn't render, list their key names + short json
  const rendered = new Set([...fields, 'type', 'block_type', 'id', 'steps', 'questions', 'options']);
  for (const k of Object.keys(b)) {
    if (rendered.has(k)) continue;
    const v = b[k];
    if (v && typeof v === 'object') {
      const j = txt(JSON.stringify(v));
      if (j && j !== '{}' && j !== '[]') lines.push(`     ${k}(obj): ${j.slice(0, 1500)}`);
    }
  }
  return lines.join('\n');
}

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: bookSlug, deleted_at: null });
  if (!book) { console.error('Book not found:', bookSlug); process.exit(1); }
  const chapter = (book.chapters || []).find((c) => c.number === chapterNumber);
  console.log(`# BOOK: ${book.title} (${book.slug})  subject=${book.subject} grade=${book.grade}`);
  console.log(`# CHAPTER ${chapterNumber}: ${chapter ? chapter.title : '(no chapter meta)'}`);
  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: chapterNumber, deleted_at: null })
    .sort({ page_number: 1 })
    .toArray();
  console.log(`# PAGES FOUND: ${pages.length}\n`);
  for (const p of pages) {
    if (p.page_number > maxPage) break;
    console.log('='.repeat(90));
    console.log(`PAGE ${p.page_number} — ${p.title}${p.subtitle ? ' | ' + p.subtitle : ''}`);
    console.log(`slug=${p.slug}  page_type=${p.page_type || 'lesson'}  blocks=${(p.blocks || []).length}  content_types=${(p.content_types || []).join(',')}`);
    if (p.video_title) console.log(`video_title=${p.video_title}`);
    console.log('-'.repeat(90));
    (p.blocks || []).forEach((b, i) => console.log(renderBlock(b, i)));
    console.log('');
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
