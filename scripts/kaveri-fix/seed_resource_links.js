'use strict';
/**
 * Phase 0c — seed ResourceLink rows mapping each Kaveri grammar micro-skill to
 * the chapter page that teaches it, so the recommendation engine has real
 * "learn this" targets for the skills the Grammar Gym generates weakness on.
 * Idempotent: upsert by (topic_tag_id, resource_id). Run: node scripts/kaveri-fix/seed_resource_links.js [--dry]
 */
const crypto = require('crypto');
const { withBook } = require('./_lib');
const DRY = process.argv.includes('--dry');

const BOOK_SLUG = 'class9-english-kaveri';
// chapter → { micro-skill key, grammar page slug } (mirrors EN9_CHAPTER_GRAMMAR + the grammar pages)
const MAP = {
  1: { micro: 'tenses', slug: 'unit-1-vocabulary-binomials-and-prefixes' },
  2: { micro: 'clauses', slug: 'unit-2-vocabulary-and-grammar-the-pot-maker' },
  3: { micro: 'present_perfect', slug: 'unit-3-vocabulary-and-grammar-winds-of-change' },
  4: { micro: 'reported_speech', slug: 'unit-4-vocabulary-and-reported-speech' },
  5: { micro: 'modals', slug: 'unit-5-vocabulary-modals-and-reported-speech' },
  6: { micro: 'reported_exclamations', slug: 'unit-6-drama-toolkit' },
  7: { micro: 'active_passive', slug: 'unit-7-vocabulary-active-passive-voice' },
  8: { micro: 'conditionals', slug: 'unit-8-grammar-conditionals-and-could' },
};

(async () => {
  await withBook(async ({ db, allPages }) => {
    const links = db.collection('resource_links');
    let up = 0;
    for (const [ch, { micro, slug }] of Object.entries(MAP)) {
      const page = allPages.find((p) => p.slug === slug);
      if (!page) { console.log(`⚠ page not found: ${slug}`); continue; }
      const topic_tag_id = `bk:en9:grammar:${micro}`;
      const doc = {
        topic_tag_id,
        micro_concept: micro,
        chapter_id: `bk:en9:c${ch}`,
        resource_type: 'book_page',
        resource_id: slug,
        resource_title: page.title,
        resource_url: `/class-9/${BOOK_SLUG}/${slug}`,
        difficulty: 'foundation',
        is_primary: true,
        updated_at: new Date(),
      };
      console.log(`${DRY ? '[DRY] ' : ''}${topic_tag_id} → ${slug} ("${page.title}")`);
      if (!DRY) {
        await links.updateOne(
          { topic_tag_id, resource_id: slug },
          { $set: doc, $setOnInsert: { _id: crypto.randomUUID(), created_at: new Date() } },
          { upsert: true }
        );
      }
      up++;
    }
    console.log(`${DRY ? '[DRY] would upsert' : 'upserted'} ${up} resource links.`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
