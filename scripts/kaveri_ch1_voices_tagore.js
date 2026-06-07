'use strict';
/**
 * Kaveri Ch.1 pilot — drops a `voices_that_inspire` callout (Tagore's "Where
 * the mind is without fear" from Gitanjali, 1910 — public domain) onto the
 * themes page, between the theme_explorer and the existing literature_in_life
 * callout. The first "One Page from My Bookshelf" — see ~/brain/wisdom_seeds/.
 *
 * Idempotent: re-running updates the same callout (matched by `id` prefix).
 * Run:  node scripts/kaveri_ch1_voices_tagore.js   [--rollback]
 * Docs affected: 1 book_pages doc (themes page) — its blocks array only.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_SLUG = 'class9-english-kaveri';
const PAGE_SLUG = 'unit-1-themes-grandmother-story';
const SENTINEL = 'ch1-voices-tagore-grandmother'; // stamped into the block id for idempotent re-runs

// Teacher voice: warm, direct, North-Indian classroom register. Quote is short
// enough to be fair use even if Gitanjali weren't already public domain.
const MARKDOWN = `I want to share something with you. Long before Sudha Murty was even born, **Rabindranath Tagore** wrote a poem — a prayer, really — for the kind of country he wished India would become. The poem is called *Where the mind is without fear*. One line in it sat in my head all through Krishtakka's story.

> Where knowledge is free... where the mind is led forward by thee, into ever-widening thought and action — into that heaven of freedom, my Father, let my country awake.

*— Rabindranath Tagore, Gitanjali (1910)*

Tagore is praying for a country where knowledge belongs to **everyone**. Not just those who could afford school as children. Not just men. Not just the rich.

Now think about Krishtakka. A sixty-two-year-old grandmother, sitting on her veranda with a slate and her granddaughter. Her wish to read isn't a quirky decision — it is exactly the prayer Tagore was praying. Every time a person, at any age, chooses to learn, they step out of what Tagore calls *"the dreary desert sand of dead habit"* into a wider, freer life.

So when you close this chapter, don't just remember "the grandmother learned to read." Remember **why** it mattered — and why a whole nation's poet was asking for it.

?? Where else have you seen this idea — that knowledge should belong to everyone, not just some? In your own family? In the news? In another story you have read?`;

(async () => {
  const rollback = process.argv.includes('--rollback');
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const pages = db.collection('book_pages');
  const books = db.collection('books');

  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`Book ${BOOK_SLUG} not found`);
  const page = await pages.findOne({ book_id: String(book._id), slug: PAGE_SLUG });
  if (!page) throw new Error(`Page ${PAGE_SLUG} not found`);

  const blocks = page.blocks || [];
  const existingIdx = blocks.findIndex((b) => typeof b.id === 'string' && b.id.startsWith(SENTINEL));

  if (rollback) {
    if (existingIdx === -1) { console.log('No Tagore callout found — nothing to roll back.'); await c.close(); return; }
    const kept = blocks.filter((_, i) => i !== existingIdx).map((b, i) => ({ ...b, order: i }));
    await pages.updateOne({ _id: page._id }, { $set: { blocks: kept, updated_at: new Date() } });
    console.log(`Rolled back: removed Tagore callout from ${PAGE_SLUG}.`);
    await c.close();
    return;
  }

  const callout = {
    id: `${SENTINEL}-${randomUUID().slice(0, 8)}`,
    type: 'callout',
    order: 0, // re-stamped below
    variant: 'voices_that_inspire',
    title: 'Gitanjali — Rabindranath Tagore (1910)',
    markdown: MARKDOWN,
  };

  let next;
  if (existingIdx !== -1) {
    // Update in place — preserve position, keep the same block id.
    callout.id = blocks[existingIdx].id;
    next = blocks.map((b, i) => (i === existingIdx ? { ...callout, order: i } : b));
    console.log(`Updated existing Tagore callout at order ${existingIdx}.`);
  } else {
    // Insert just BEFORE the literature_in_life callout (themes-page arc:
    // theme_explorer → Tagore zoom-out → literature_in_life zoom-in → prompt → quiz).
    // Fallback: append after theme_explorer if no literature_in_life is present.
    const litIdx = blocks.findIndex((b) => b.type === 'callout' && b.variant === 'literature_in_life');
    const themeIdx = blocks.findIndex((b) => b.type === 'theme_explorer');
    const insertAt = litIdx !== -1 ? litIdx : (themeIdx !== -1 ? themeIdx + 1 : blocks.length);
    next = [...blocks.slice(0, insertAt), callout, ...blocks.slice(insertAt)].map((b, i) => ({ ...b, order: i }));
    console.log(`Inserted Tagore callout at order ${insertAt} on ${PAGE_SLUG}. Page now has ${next.length} blocks.`);
  }

  await pages.updateOne({ _id: page._id }, { $set: { blocks: next, updated_at: new Date() } });
  await c.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
