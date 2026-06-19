#!/usr/bin/env node
/**
 * READ-ONLY. Dumps the first three class-11 math chapters' questions to JSON
 * for primary-tag analysis. No writes. Output: scripts/_tmp_math_tag/<chap>.json
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const CHAPTERS = [
  { id: 'ma_basic_math', label: 'Basic of Mathematics' },
  { id: 'ma_quadratic', label: 'Quadratic Equation' },
  { id: 'ma_complex', label: 'Complex Number' },
];

const OUT_DIR = path.join(__dirname, '_tmp_math_tag');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.collection('questions_v2');
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const ch of CHAPTERS) {
    const docs = await Q.find({ 'metadata.chapter_id': ch.id, deleted_at: null })
      .project({
        display_id: 1,
        question_text: 1,
        options: 1,
        answer: 1,
        'metadata.tags': 1,
        'metadata.difficultyLevel': 1,
        'metadata.questionNature': 1,
        microConcept: 1,
      })
      .toArray();

    // current primary tag distribution
    const dist = {};
    const out = docs.map((d) => {
      const primary = (d.metadata?.tags?.[0]?.tag_id) ?? '(none)';
      dist[primary] = (dist[primary] || 0) + 1;
      const opts = Array.isArray(d.options)
        ? d.options.map((o) => ({ id: o.id, text: o.text ?? o.markdown ?? o.label ?? '', is_correct: o.is_correct ?? null }))
        : [];
      return {
        display_id: d.display_id,
        _id: String(d._id),
        stem: d.question_text?.markdown ?? d.question_text?.text ?? '',
        options: opts,
        answer: d.answer ?? null,
        difficultyLevel: d.metadata?.difficultyLevel ?? null,
        questionNature: d.metadata?.questionNature ?? null,
        current_primary_tag: primary,
      };
    });

    out.sort((a, b) => (a.display_id || '').localeCompare(b.display_id || '', undefined, { numeric: true }));
    fs.writeFileSync(path.join(OUT_DIR, `${ch.id}.json`), JSON.stringify(out, null, 2));
    console.log(`\n=== ${ch.label} (${ch.id}) — ${out.length} questions ===`);
    console.log('  current primary-tag distribution:', JSON.stringify(dist));
    console.log('  sample display_ids:', out.slice(0, 5).map((q) => q.display_id).join(', '));
  }

  await mongoose.disconnect();
  console.log(`\nWrote JSON dumps to ${OUT_DIR}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
