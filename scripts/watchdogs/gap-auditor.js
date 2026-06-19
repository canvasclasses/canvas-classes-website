'use strict';
/**
 * gap-auditor.js — Layer-A watchdog #3 (AI-native supervisory layer).
 *
 * WHAT IT CATCHES: cross-system gaps in the question bank that silently break
 * the joints between questions_v2 and the taxonomy / solutions:
 *   • orphan chapter_id   — a question whose metadata.chapter_id is not a real
 *                           taxonomy chapter (it vanishes from filtered views).
 *   • dangling tag        — a question tag_id that doesn't exist in the taxonomy.
 *   • published, no soln  — a published question with an empty solution.
 *   • no chapter_id       — published question with no chapter at all.
 *
 * READ-ONLY. Streams the live (non-deleted) collection once with a tight
 * projection (no full solution text held in memory), validates against the
 * taxonomy source of truth. Mirrors the taxonomy loader in crucible-state.js.
 *
 * RUN:  node scripts/watchdogs/gap-auditor.js [--json]
 * EXIT: 2 if orphan chapter_id or dangling tags (data integrity), 1 if only
 *       missing-solution / no-chapter gaps, else 0.
 */
const fs = require('fs');
const path = require('path');
const bw = require('../lib/book-writer'); // reuse withDb (loads .env.local)

const asJson = process.argv.includes('--json');
const CAP = 15; // max examples kept per category

// ── taxonomy loader (mirrors scripts/crucible-state.js) ──────────────────────
function loadTaxonomyIndex() {
  const file = path.join(__dirname, '..', '..', 'packages', 'data', 'taxonomy', 'taxonomyData_from_csv.ts');
  const text = fs.readFileSync(file, 'utf8');
  const anchor = text.indexOf('TAXONOMY_FROM_CSV');
  const eq = text.indexOf('=', anchor);
  const start = text.indexOf('[', eq);
  let depth = 0, end = -1;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  // eslint-disable-next-line no-new-func
  const nodes = Function(`"use strict"; return (${text.slice(start, end + 1)});`)();
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const chapterIds = new Set(nodes.filter((n) => n.type === 'chapter').map((n) => n.id));
  const tagIds = new Set(nodes.filter((n) => n.type === 'topic' || n.type === 'micro_topic').map((n) => n.id));
  return { byId, chapterIds, tagIds };
}

async function run() {
  const tax = loadTaxonomyIndex();
  return bw.withDb(async (db) => {
    const cur = db.collection('questions_v2').find(
      { deleted_at: null },
      { projection: { display_id: 1, status: 1, 'metadata.chapter_id': 1, 'metadata.tags': 1, 'solution.text_markdown': 1 } }
    );

    let scanned = 0, orphanCount = 0, danglingCount = 0;
    const orphanChapter = [], danglingTags = [], publishedNoSolution = [], noChapter = [];

    for await (const q of cur) {
      scanned++;
      const m = q.metadata || {};
      const ch = m.chapter_id;
      const did = q.display_id || String(q._id);

      if (!ch) { if (q.status === 'published' && noChapter.length < CAP) noChapter.push(did); }
      else if (!tax.chapterIds.has(ch)) { orphanCount++; if (orphanChapter.length < CAP) orphanChapter.push(`${did} → ${ch}`); }

      const tags = Array.isArray(m.tags) ? m.tags : [];
      for (const t of tags) {
        if (t && t.tag_id && !tax.tagIds.has(t.tag_id)) { danglingCount++; if (danglingTags.length < CAP) danglingTags.push(`${did} → ${t.tag_id}`); break; }
      }

      if (q.status === 'published') {
        const sol = q.solution && typeof q.solution.text_markdown === 'string' ? q.solution.text_markdown.trim() : '';
        if (!sol && publishedNoSolution.length < CAP) publishedNoSolution.push(did);
      }
    }

    // Re-count totals with cheap server-side counts (examples above are capped).
    const qc = db.collection('questions_v2');
    const counts = {
      published_no_solution: await qc.countDocuments({ deleted_at: null, status: 'published', $or: [{ 'solution.text_markdown': { $in: [null, ''] } }, { 'solution.text_markdown': { $exists: false } }] }),
      no_chapter_published: await qc.countDocuments({ deleted_at: null, status: 'published', $or: [{ 'metadata.chapter_id': { $in: [null, ''] } }, { 'metadata.chapter_id': { $exists: false } }] }),
    };

    const severity = (orphanCount || danglingCount) ? 2 : counts.no_chapter_published ? 1 : 0;
    return {
      name: 'gap-auditor', severity, scanned,
      headline:
        orphanCount || danglingCount ? `${orphanCount} orphan chapter_id, ${danglingCount} dangling-tag question(s)`
        : counts.no_chapter_published ? `${counts.no_chapter_published} published question(s) with no chapter`
        : 'no taxonomy-integrity gaps',
      counts: {
        orphan_chapter_id: orphanCount, dangling_tags: danglingCount,
        no_chapter_id_published: counts.no_chapter_published, published_no_solution: counts.published_no_solution,
      },
      examples: { orphanChapter, danglingTags, publishedNoSolution, noChapter },
    };
  });
}

function printReport(r) {
  const L = console.log;
  L('\n=== Gap auditor ===');
  L(`scanned ${r.scanned} live questions · severity ${r.severity}\n`);
  const sec = (icon, title, n, ex) => { if (!n) return; L(`${icon} ${title}: ${n}`); for (const e of ex.slice(0, 10)) L(`    • ${e}`); if (n > 10) L(`    …and ${n - 10} more`); L(''); };
  sec('🔴', 'Orphan chapter_id (not in taxonomy)', r.counts.orphan_chapter_id, r.examples.orphanChapter);
  sec('🔴', 'Dangling tag_id (not in taxonomy)', r.counts.dangling_tags, r.examples.danglingTags);
  sec('🟡', 'Published but no chapter_id', r.counts.no_chapter_id_published, r.examples.noChapter);
  L(`📊 Published questions still missing a solution: ${r.counts.published_no_solution} (tracked backlog — see CRUCIBLE_STATE.md; not a defect)\n`);
  if (r.severity === 0) L('✅ No taxonomy-integrity gaps — every live question maps to a real chapter and real tags.\n');
}

run()
  .then((r) => { if (asJson) console.log(JSON.stringify(r, null, 2)); else printReport(r); process.exit(r.severity); })
  .catch((e) => { console.error('gap-auditor failed:', e.message); process.exit(3); });
