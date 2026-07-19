'use strict';
// Auto-generate chapter_opener ("chapter intro") pages for EVERY chapter that has content but no
// opener, across ALL Live Books (founder request 2026-07-10). Mirrors the Class 11 mole template
// (page_type:'chapter_opener', page_number 0). Each opener gets:
//   - a full-bleed hero IMAGE block (placeholder src + a subject-tailored 21:9 generation_prompt),
//   - `subtitle` = the "promise" derived from the best IN-LANGUAGE source available on the chapter
//     (first-lesson subtitle → chapter.description → first-lesson curiosity hook → first text),
//   - the lesson "journey" + Start CTA are auto-computed by the reader (BookReader/ChapterOpener).
// Bespoke "What you'll master" outcomes are intentionally left for a later hand-polish (they would
// just duplicate the auto-journey otherwise). published = true only if the chapter already has ≥1
// published lesson (so live chapters get a visible cover; drafts stay hidden). Idempotent + additive.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('./lib/book-writer');

const HERO_STYLE = 'Dark, atmospheric, cinematic, painterly illustration, no text overlay.';
const SUBJECT_SCENE = {
  chemistry: 'glowing molecular structures, lab glassware and a sense of transformation',
  physics: 'light, waves, motion and energy rendered as luminous forms',
  mathematics: 'elegant geometric forms, curves and numbers rendered in light',
  biology: 'cells, living forms and the natural world',
  science: 'instruments, light and the spirit of scientific discovery',
  english: 'an open book opening into evocative, human, literary imagery',
  hindi: 'evocative Indian cultural and literary imagery suited to the story',
  ict: 'computers, glowing screens and digital connection',
  social_science: 'maps, monuments, landscapes and human society',
  life_skills: 'a calm, focused young person and a sense of growth',
};

function firstSentences(text, maxSentences = 2, cap = 300) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  const parts = clean.split(/(?<=[.।?!])\s+/).filter(Boolean);
  let out = parts.slice(0, maxSentences).join(' ');
  if (out.length > cap) out = out.slice(0, cap).replace(/\s+\S*$/, '') + '…';
  return out;
}

function derivePromise(chapter, lessons) {
  const first = lessons[0] || {};
  // 1) first lesson's crafted subtitle — usually the best, most compelling one-liner
  if (first.subtitle && first.subtitle.trim().length >= 25) return { src: 'lesson-subtitle', text: first.subtitle.trim() };
  // 2) chapter description (designed summary)
  if (chapter.description && chapter.description.trim().length >= 40) return { src: 'chapter-description', text: chapter.description.trim() };
  // 3) first lesson's curiosity hook (in-language)
  const cur = (first.blocks || []).find((b) => b.type === 'curiosity_prompt');
  if (cur && cur.prompt) return { src: 'curiosity-hook', text: firstSentences(cur.prompt) };
  // 4) first text/narrated block opening
  const txt = (first.blocks || []).find((b) => b.type === 'text' || b.type === 'narrated_passage');
  if (txt && (txt.markdown || txt.text)) return { src: 'first-text', text: firstSentences((txt.markdown || txt.text).replace(/[#*_>`-]/g, '')) };
  // 5) template
  return { src: 'template', text: `A clear, step-by-step journey through ${chapter.title}.` };
}

function heroPrompt(subject, chapterTitle) {
  const scene = SUBJECT_SCENE[subject] || 'an evocative scene capturing the theme';
  return `Ultra-wide cinematic cover banner (21:9). A cover image for the chapter "${chapterTitle}": ${scene}, themed around the chapter's subject. ${HERO_STYLE}`;
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI, { ignoreUndefined: true });
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const allBooks = await books.find({}).toArray();
    let made = 0, skipped = 0;
    const report = [];
    for (const book of allBooks) {
      for (const ch of book.chapters || []) {
        const pages = await pagesCol.find({ book_id: book._id, chapter_number: ch.number, deleted_at: null }).sort({ page_number: 1 }).toArray();
        const lessons = pages.filter((p) => p.page_type !== 'chapter_opener');
        if (lessons.length === 0) continue; // empty shell
        if (pages.some((p) => p.page_type === 'chapter_opener')) { skipped++; continue; } // already has one

        const promise = derivePromise(ch, lessons);
        const hero = { id: uuid(), order: 0, type: 'image', src: '', alt: `${ch.title} — chapter cover`, caption: '', width: 'full', generation_prompt: heroPrompt(book.subject, ch.title) };
        const blocks = [hero];
        const published = lessons.some((l) => l.published);
        const _id = uuid();
        const baseSlug = (ch.slug || `chapter-${ch.number}`).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
        const slug = `${baseSlug}-opener`;
        // Sit just before the first lesson (unique on the (book,chapter,page_number) index, sorts first).
        const openerPageNum = Math.min(...lessons.map((l) => (typeof l.page_number === 'number' ? l.page_number : 1))) - 1;
        await pagesCol.insertOne({
          _id, book_id: book._id, chapter_number: ch.number, page_number: openerPageNum,
          slug, title: ch.title, subtitle: promise.text, page_type: 'chapter_opener',
          blocks, hinglish_blocks: [], tags: [], published,
          reading_time_min: bw.computeReadingTime(blocks), content_types: bw.computeContentTypes(blocks),
          video_title: null, deleted_at: null, deleted_by: null, deletion_reason: null,
          created_at: new Date(), updated_at: new Date(),
        });
        await books.updateOne({ _id: book._id, 'chapters.number': ch.number },
          { $push: { 'chapters.$.page_ids': { $each: [_id], $position: 0 } }, $set: { updated_at: new Date() } });
        made++;
        report.push({ book: book.slug, ch: ch.number, title: ch.title, pub: published, src: promise.src, promise: promise.text.slice(0, 90) });
      }
    }
    console.log(`\n✅ Created ${made} openers, skipped ${skipped} (already had one).\n`);
    // grouped report + promise-source tally
    const srcTally = {};
    let curBook = '';
    for (const r of report) {
      if (r.book !== curBook) { curBook = r.book; console.log(`\n── ${r.book} ──`); }
      srcTally[r.src] = (srcTally[r.src] || 0) + 1;
      console.log(`  Ch${r.ch} [${r.pub ? 'PUB' : 'draft'}] via ${r.src}: "${r.promise}"`);
    }
    console.log('\nPromise-source tally:', JSON.stringify(srcTally));
  } finally { await client.close(); }
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
