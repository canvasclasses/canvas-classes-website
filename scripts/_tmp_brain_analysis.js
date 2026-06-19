'use strict';
// READ-ONLY analysis for: (A) the 55 ch00_temp questions, (B) the 828 dangling-tag
// questions grouped, (C) missing-solution counts by chapter. No writes.
const fs = require('fs');
const path = require('path');
const bw = require('./lib/book-writer');

function loadTax() {
  const file = path.join(__dirname, '..', 'packages', 'data', 'taxonomy', 'taxonomyData_from_csv.ts');
  const text = fs.readFileSync(file, 'utf8');
  const anchor = text.indexOf('TAXONOMY_FROM_CSV');
  const eq = text.indexOf('=', anchor);
  const start = text.indexOf('[', eq);
  let depth = 0, end = -1;
  for (let i = start; i < text.length; i++) { if (text[i] === '[') depth++; else if (text[i] === ']') { depth--; if (!depth) { end = i; break; } } }
  const nodes = Function(`"use strict"; return (${text.slice(start, end + 1)});`)();
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const chapterOf = (id) => { let n = byId.get(id), g = 0; while (n && n.type !== 'chapter' && g++ < 12) n = byId.get(n.parent_id); return n && n.type === 'chapter' ? n : null; };
  const subjectOf = (id) => { let n = byId.get(id), g = 0; while (n && n.type !== 'subject' && g++ < 12) n = byId.get(n.parent_id); return n && n.type === 'subject' ? n : null; };
  const chapterIds = new Set(nodes.filter((n) => n.type === 'chapter').map((n) => n.id));
  const tagIds = new Set(nodes.filter((n) => n.type === 'topic' || n.type === 'micro_topic').map((n) => n.id));
  return { nodes, byId, chapterOf, subjectOf, chapterIds, tagIds };
}

(async () => {
  const tax = loadTax();
  await bw.withDb(async (db) => {
    const Q = db.collection('questions_v2');

    // ---- (A) the ch00_temp 55 ----
    const temp = await Q.find({ deleted_at: null, 'metadata.chapter_id': 'ch00_temp' },
      { projection: { display_id: 1, 'metadata.tags': 1, 'metadata.subject': 1, 'question_text.markdown': 1 } }).toArray();
    console.log('\n########## (A) ch00_temp questions: ' + temp.length + ' ##########');
    for (const q of temp) {
      const tags = (q.metadata?.tags || []).map((t) => t.tag_id).join(',') || '(none)';
      const txt = (q.question_text?.markdown || '').replace(/\s+/g, ' ').slice(0, 240);
      console.log(`\n[${q.display_id}] subj=${q.metadata?.subject || '?'} tags=${tags}`);
      console.log('   ' + txt);
    }

    // ---- (B) dangling tags ----
    const all = await Q.find({ deleted_at: null },
      { projection: { display_id: 1, 'metadata.tags': 1, 'metadata.chapter_id': 1 } }).toArray();
    const byStaleTag = new Map();   // staleTagId -> {count, chapters:Set, prefixes:Set, examples:[]}
    const byChapter = new Map();    // chapter_id -> {count, staleTags:Map}
    for (const q of all) {
      const tags = q.metadata?.tags || [];
      const ch = q.metadata?.chapter_id || '(none)';
      const prefix = (q.display_id || '').split('-')[0];
      for (const t of tags) {
        if (t?.tag_id && !tax.tagIds.has(t.tag_id)) {
          const s = byStaleTag.get(t.tag_id) || { count: 0, chapters: new Set(), prefixes: new Set(), examples: [] };
          s.count++; s.chapters.add(ch); s.prefixes.add(prefix); if (s.examples.length < 3) s.examples.push(q.display_id);
          byStaleTag.set(t.tag_id, s);
          const c = byChapter.get(ch) || { count: 0, staleTags: new Map() };
          c.count++; c.staleTags.set(t.tag_id, (c.staleTags.get(t.tag_id) || 0) + 1);
          byChapter.set(ch, c);
        }
      }
    }
    console.log('\n\n########## (B) dangling tags by STALE TAG ##########');
    for (const [tag, s] of [...byStaleTag.entries()].sort((a, b) => b[1].count - a[1].count)) {
      console.log(`  ${tag.padEnd(22)} x${s.count}  chapters=[${[...s.chapters].join(', ')}]  prefixes=[${[...s.prefixes].join(',')}]  eg=${s.examples.join(',')}`);
    }
    console.log('\n########## (B) dangling tags by CHAPTER ##########');
    for (const [ch, c] of [...byChapter.entries()].sort((a, b) => b[1].count - a[1].count)) {
      const node = tax.byId.get(ch);
      const real = [...tax.tagIds].filter((tid) => tax.chapterOf(tid)?.id === ch);
      console.log(`  ${ch} (${node?.name || '?'}) — ${c.count} dangling: ${[...c.staleTags.entries()].map(([t, n]) => `${t}x${n}`).join(', ')}`);
      console.log(`      real tags available in this chapter: ${real.join(', ') || '(none defined)'}`);
    }

    // ---- (C) missing solution by chapter ----
    const missing = await Q.aggregate([
      { $match: { deleted_at: null, status: 'published', $or: [{ 'solution.text_markdown': { $in: [null, ''] } }, { 'solution.text_markdown': { $exists: false } }] } },
      { $group: { _id: '$metadata.chapter_id', n: { $sum: 1 } } },
      { $sort: { n: -1 } },
    ], { allowDiskUse: true }).toArray();
    console.log('\n\n########## (C) published-no-solution by CHAPTER (desc) ##########');
    let tot = 0;
    for (const m of missing) {
      const node = tax.byId.get(m._id);
      const subj = tax.subjectOf(m._id)?.name || (node ? '?' : 'NOT-IN-TAXONOMY');
      console.log(`  ${String(m.n).padStart(4)}  ${m._id || '(no chapter)'}  [${subj}]  ${node?.name || ''}`);
      tot += m.n;
    }
    console.log(`  ---- total ${tot} across ${missing.length} chapters ----`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
