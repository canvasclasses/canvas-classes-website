'use strict';
/**
 * Removes the duplicate Acharya-Kanda fun_fact at block 0 of p3
 * ("introduction-chemistry-matter"). Now redundant with p1.
 *
 * Detects the right block by scanning the markdown body for "Kanda" /
 * "Kashyap" / "Paramāṇu" (the previous attempt only checked the title).
 *
 * Run: node scripts/refine_ch1_remove_kanada.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const NOM_SLUG = 'introduction-chemistry-matter';

function flattenBlocks(arr) {
  const out = [];
  for (const b of arr) {
    if (b.type === 'section' && Array.isArray(b.columns)) {
      for (const col of b.columns) out.push(...col);
    } else out.push(b);
  }
  return out;
}
function computeReadingTime(arr) {
  const flat = flattenBlocks(arr);
  let w = 0, v = 0, a = 0;
  for (const b of flat) {
    if (b.type === 'text') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'heading') w += (b.text || '').split(/\s+/).length;
    else if (b.type === 'callout') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'video') v++;
    else if (b.type === 'audio_note') a++;
  }
  return Math.max(1, Math.ceil(w / 200) + v * 2 + a);
}
const INTERACTIVE = new Set([
  'inline_quiz', 'simulation', 'video', 'molecule_3d', 'interactive_image',
  'classify_exercise', 'reasoning_prompt', 'worked_example', 'practice_link',
]);
function computeContentTypes(arr) {
  const flat = flattenBlocks(arr);
  const found = new Set();
  for (const b of flat) if (INTERACTIVE.has(b.type)) found.add(b.type);
  return [...found].sort();
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    const page = await pages.findOne({ slug: NOM_SLUG });
    if (!page) throw new Error(`"${NOM_SLUG}" not found`);

    const block0 = (page.blocks || []).find((b) => b.order === 0);
    if (!block0) throw new Error('No block 0 found');

    const body = (block0.markdown || '').toLowerCase();
    const titleStr = (block0.title || '').toLowerCase();
    const looksLikeKanada =
      block0.type === 'callout' &&
      (body.includes('kanda') || body.includes('kashyap') || body.includes('paramāṇu') ||
       body.includes('paramanu') || body.includes('atomic theory') ||
       titleStr.includes('atomic theory') || titleStr.includes('dalton'));

    if (!looksLikeKanada) {
      console.log(`⚠  Block 0 doesn’t look like the Kanada fun_fact:`);
      console.log(`    type=${block0.type}, title="${block0.title || ''}"`);
      console.log(`    body: ${(block0.markdown || '').slice(0, 120)}…`);
      console.log('Aborting to be safe — no changes made.');
      return;
    }

    console.log(`→ Removing block 0: [${block0.variant}] "${block0.title}"`);
    console.log(`    body: ${(block0.markdown || '').slice(0, 120)}…`);

    const remaining = (page.blocks || [])
      .filter((b) => b.order !== 0)
      .map((b) => ({ ...b, order: b.order - 1 }))
      .sort((a, b) => a.order - b.order);

    await pages.updateOne(
      { _id: page._id },
      {
        $set: {
          blocks: remaining,
          reading_time_min: computeReadingTime(remaining),
          content_types: computeContentTypes(remaining),
          updated_at: new Date(),
        },
      }
    );

    console.log(`  ✓ ${page.blocks.length} → ${remaining.length} blocks`);

    // Verify
    console.log('\n→ Final block layout:');
    const reread = await pages.findOne({ _id: page._id });
    for (const b of (reread.blocks || []).sort((a, c) => a.order - c.order)) {
      let s = '';
      if (b.type === 'heading') s = `(h${b.level}) ${b.text}`;
      else if (b.type === 'callout') s = `[${b.variant}] ${b.title || ''}`;
      else if (b.type === 'image') s = `alt="${(b.alt || '').slice(0, 50)}…"`;
      else if (b.type === 'text') s = `"${(b.markdown || '').slice(0, 60).replace(/\n/g, ' ')}…"`;
      else if (b.type === 'comparison_card') s = `"${b.title || ''}"`;
      else if (b.type === 'inline_quiz') s = `${b.questions?.length || 0} Qs`;
      console.log(`  ${String(b.order).padEnd(3)} ${b.type.padEnd(18)} ${s}`);
    }

    console.log('\n✓ Done.');
  } finally {
    await client.close();
  }
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
