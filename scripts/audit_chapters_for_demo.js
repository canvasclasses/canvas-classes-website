/**
 * scripts/audit_chapters_for_demo.js   READ-ONLY
 *
 * Pre-curation audit for the side-by-side practice panel
 * (/handwritten-notes/[chapter]). For each chapter passed on argv it
 * surfaces two things:
 *
 *   1. CURATION DATA — what's pickable for the demo set:
 *      - Per primary tag count
 *      - Per difficulty level count
 *      - Per type and per sourceType counts
 *      - Tag × Difficulty matrix (the curation heatmap)
 *      - Quality-gate pass count (solution ≥ 200 chars + latex_validated)
 *      - The same breakdowns AFTER applying the quality gate
 *
 *   2. DATA QUALITY RED FLAGS — anti-curation signals:
 *      - Questions with NO primary tag (untagged)
 *      - Questions with NO difficultyLevel
 *      - Questions with NO microConcept (when project convention sets one)
 *      - Solutions failing the quality gate (length / latex_validated)
 *      - Suspicious uniformity: dominant difficulty level > 70% of pool
 *      - Tag IDs referenced by questions that don't exist in the official
 *        taxonomy (orphan refs)
 *
 * Run as:
 *   node scripts/audit_chapters_for_demo.js ch11_mole ch11_atom ch11_periodic ch12_solutions ch12_electrochem ch12_kinetics
 *
 * Output:
 *   - Console summary per chapter
 *   - Full markdown report → scripts/output/demo_audit_<ts>.md
 *
 * This script makes ZERO writes to MongoDB.
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// ── Parse taxonomy file for valid tag IDs per chapter ──────────────────────
function parseTaxonomyTags() {
  const tsPath = path.join(__dirname, '..', 'app', 'crucible', 'admin', 'taxonomy', 'taxonomyData_from_csv.ts');
  const txt = fs.readFileSync(tsPath, 'utf8');
  const tagsByChapter = {};
  // Walk line by line; track current chapter as we encounter parent_id: null
  // (chapter) and parent_id: 'chXX_...' (topic).
  const reChapter = /id:\s*'([^']+)'[^\n]*parent_id:\s*null[^\n]*type:\s*'chapter'/;
  const reTopic   = /id:\s*'([^']+)'[^\n]*parent_id:\s*'([^']+)'[^\n]*type:\s*'topic'/;
  for (const line of txt.split('\n')) {
    const mc = line.match(reChapter);
    if (mc) {
      tagsByChapter[mc[1]] = tagsByChapter[mc[1]] || new Set();
      continue;
    }
    const mt = line.match(reTopic);
    if (mt) {
      const [, tagId, parentChapter] = mt;
      tagsByChapter[parentChapter] = tagsByChapter[parentChapter] || new Set();
      tagsByChapter[parentChapter].add(tagId);
    }
  }
  // Also build a tag_id → tag_name map for the report
  const tagNames = {};
  const reTopicName = /id:\s*'([^']+)'[^\n]*name:\s*'([^']+)'[^\n]*parent_id:\s*'(ch\d+_[a-z_]+)'/;
  for (const line of txt.split('\n')) {
    const m = line.match(reTopicName);
    if (m) tagNames[m[1]] = m[2];
  }
  return { tagsByChapter, tagNames };
}

// ── Quality gate (mirrors the API at /api/v2/questions/[id]/route.ts) ──────
function passesQualityGate(q) {
  const sol = q.solution || {};
  const txt = (sol.text_markdown || '').trim();
  return txt.length >= 200 && sol.latex_validated === true;
}

// ── Pure helpers (no IO) ──────────────────────────────────────────────────
function tally(arr, keyFn) {
  const m = new Map();
  for (const x of arr) {
    const k = keyFn(x);
    m.set(k, (m.get(k) || 0) + 1);
  }
  // Sort descending by count, then by key
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function pct(n, total) {
  if (total === 0) return '0%';
  return `${((n / total) * 100).toFixed(1)}%`;
}

function dominantShare(entries) {
  if (entries.length === 0) return 0;
  const total = entries.reduce((s, [, n]) => s + n, 0);
  const top = entries[0][1];
  return total > 0 ? top / total : 0;
}

// ── Per-chapter audit ─────────────────────────────────────────────────────
async function auditChapter(chapterId, collection, taxonomy) {
  const docs = await collection
    .find({
      'metadata.chapter_id': chapterId,
      status: 'published',
      deleted_at: null,
    })
    .project({
      display_id: 1,
      type: 1,
      flags: 1,
      'metadata.tags': 1,
      'metadata.difficultyLevel': 1,
      'metadata.microConcept': 1,
      'metadata.sourceType': 1,
      'metadata.is_top_pyq': 1,
      'metadata.is_demo_question': 1,
      'solution.text_markdown': 1,
      'solution.latex_validated': 1,
      options: 1,
    })
    .toArray();

  const total = docs.length;

  // ── Data quality red flags ───────────────────────────────────────────
  const untagged = docs.filter((d) => {
    const tags = d.metadata?.tags;
    return !Array.isArray(tags) || tags.length === 0 || !tags[0]?.tag_id;
  });
  const noDifficulty = docs.filter(
    (d) => d.metadata?.difficultyLevel == null || isNaN(Number(d.metadata.difficultyLevel))
  );
  const noMicroConcept = docs.filter(
    (d) => !d.metadata?.microConcept || String(d.metadata.microConcept).trim() === ''
  );
  const solTooShort = docs.filter((d) => {
    const t = (d.solution?.text_markdown || '').trim();
    return t.length < 200;
  });
  const solNotValidated = docs.filter((d) => d.solution?.latex_validated !== true);
  const activeFlagged = docs.filter((d) =>
    Array.isArray(d.flags) && d.flags.some((f) => !f.resolved)
  );

  // Orphan tags — tag_ids used by questions but not in the taxonomy for this chapter
  const expectedTagSet = taxonomy.tagsByChapter[chapterId] || new Set();
  const usedTagIds = new Set();
  for (const d of docs) {
    const tags = Array.isArray(d.metadata?.tags) ? d.metadata.tags : [];
    if (tags[0]?.tag_id) usedTagIds.add(tags[0].tag_id);
  }
  const orphanTags = Array.from(usedTagIds).filter((t) => !expectedTagSet.has(t));
  const unusedExpectedTags = Array.from(expectedTagSet).filter((t) => !usedTagIds.has(t));

  // ── Breakdowns (FULL pool) ───────────────────────────────────────────
  const byTag = tally(docs.filter((d) => d.metadata?.tags?.[0]?.tag_id), (d) => d.metadata.tags[0].tag_id);
  const byDifficulty = tally(
    docs.filter((d) => d.metadata?.difficultyLevel != null),
    (d) => `L${d.metadata.difficultyLevel}`
  );
  const byType = tally(docs, (d) => d.type || 'UNKNOWN');
  const bySourceType = tally(docs, (d) => d.metadata?.sourceType || 'UNSET');
  const topPyqCount = docs.filter((d) => d.metadata?.is_top_pyq === true).length;
  const demoQuestionCount = docs.filter((d) => d.metadata?.is_demo_question === true).length;

  // ── Quality-gate-passing pool ────────────────────────────────────────
  const qDocs = docs.filter(passesQualityGate);
  const qTotal = qDocs.length;
  const qByTag = tally(qDocs.filter((d) => d.metadata?.tags?.[0]?.tag_id), (d) => d.metadata.tags[0].tag_id);
  const qByDifficulty = tally(
    qDocs.filter((d) => d.metadata?.difficultyLevel != null),
    (d) => `L${d.metadata.difficultyLevel}`
  );
  const qBySourceType = tally(qDocs, (d) => d.metadata?.sourceType || 'UNSET');

  // ── Tag × Difficulty heatmap (quality-pool only — that's what matters
  // for picking) ─────────────────────────────────────────────────────────
  const heatmap = {}; // tag_id → {L1, L2, L3, L4, L5, total}
  for (const d of qDocs) {
    const t = d.metadata?.tags?.[0]?.tag_id || '__untagged__';
    const lvl = d.metadata?.difficultyLevel;
    if (!heatmap[t]) heatmap[t] = { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0, total: 0 };
    if (lvl >= 1 && lvl <= 5) heatmap[t][`L${lvl}`]++;
    heatmap[t].total++;
  }

  // ── Suspicious uniformity ────────────────────────────────────────────
  const difficultyDominance = dominantShare(byDifficulty);
  const suspiciousUniformity = difficultyDominance > 0.7 && byDifficulty.length > 0;

  return {
    chapterId,
    total,
    qualityPassing: qTotal,
    qualityPassRate: total > 0 ? qTotal / total : 0,
    topPyqCount,
    demoQuestionCount,
    redFlags: {
      untagged: untagged.length,
      untaggedSamples: untagged.slice(0, 5).map((d) => d.display_id),
      noDifficulty: noDifficulty.length,
      noDifficultySamples: noDifficulty.slice(0, 5).map((d) => d.display_id),
      noMicroConcept: noMicroConcept.length,
      solTooShort: solTooShort.length,
      solNotValidated: solNotValidated.length,
      activeFlagged: activeFlagged.length,
      orphanTags,
      unusedExpectedTags,
      suspiciousUniformity,
      difficultyDominance,
    },
    breakdowns: {
      byTag,
      byDifficulty,
      byType,
      bySourceType,
      qByTag,
      qByDifficulty,
      qBySourceType,
      heatmap,
    },
  };
}

// ── Markdown report builder ────────────────────────────────────────────────
function buildMarkdown(audits, taxonomy) {
  const out = [];
  out.push(`# Demo-Curation Pre-Audit — ${audits.length} chapters\n`);
  out.push(`_Generated ${new Date().toISOString()}_\n`);
  out.push(`_Quality gate: solution.text_markdown ≥ 200 chars AND solution.latex_validated === true_\n`);
  out.push('---\n');

  // Executive table
  out.push('## Executive summary\n');
  out.push('| Chapter | Total | Quality OK | Pass rate | Untagged | No L | Demo flag set | Top PYQ |');
  out.push('|---|---:|---:|---:|---:|---:|---:|---:|');
  for (const a of audits) {
    out.push(
      `| \`${a.chapterId}\` | ${a.total} | ${a.qualityPassing} | ${pct(a.qualityPassing, a.total)} | ${a.redFlags.untagged} | ${a.redFlags.noDifficulty} | ${a.demoQuestionCount} | ${a.topPyqCount} |`
    );
  }
  out.push('');

  // Per-chapter detail
  for (const a of audits) {
    out.push(`---\n## \`${a.chapterId}\`\n`);
    out.push(`**${a.total}** published, non-deleted questions. **${a.qualityPassing}** pass the demo quality gate (${pct(a.qualityPassing, a.total)}).\n`);

    // ── Red flags section ──────────────────────────────────────────────
    out.push('### 🚩 Data-quality red flags\n');
    const rf = a.redFlags;
    const flagRows = [];
    if (rf.untagged > 0) flagRows.push(`- **${rf.untagged}** question(s) have NO primary tag (samples: ${rf.untaggedSamples.join(', ')})`);
    if (rf.noDifficulty > 0) flagRows.push(`- **${rf.noDifficulty}** question(s) have NO difficultyLevel (samples: ${rf.noDifficultySamples.join(', ')})`);
    if (rf.noMicroConcept > 0) flagRows.push(`- **${rf.noMicroConcept}** question(s) have NO microConcept`);
    if (rf.solTooShort > 0) flagRows.push(`- **${rf.solTooShort}** solution(s) are shorter than 200 chars`);
    if (rf.solNotValidated > 0) flagRows.push(`- **${rf.solNotValidated}** solution(s) have \`latex_validated !== true\``);
    if (rf.activeFlagged > 0) flagRows.push(`- **${rf.activeFlagged}** question(s) carry an unresolved \`flags[]\` entry`);
    if (rf.orphanTags.length > 0) flagRows.push(`- **Orphan tag refs** (not in taxonomy for this chapter): \`${rf.orphanTags.join('`, `')}\``);
    if (rf.unusedExpectedTags.length > 0) flagRows.push(`- **Tags in taxonomy with ZERO questions in this chapter**: \`${rf.unusedExpectedTags.join('`, `')}\``);
    if (rf.suspiciousUniformity) {
      flagRows.push(`- ⚠️ **Suspicious difficulty uniformity** — dominant level is ${(rf.difficultyDominance * 100).toFixed(1)}% of the pool (over 70% threshold). Likely auto-tagged with one level applied everywhere.`);
    }
    if (flagRows.length === 0) out.push('_No red flags — looks clean._\n');
    else out.push(flagRows.join('\n') + '\n');

    // ── Full pool breakdowns ───────────────────────────────────────────
    out.push('### Full pool — breakdowns\n');

    out.push('**By primary tag**');
    out.push('| Tag ID | Tag name | Count | Share |');
    out.push('|---|---|---:|---:|');
    for (const [tag, n] of a.breakdowns.byTag) {
      const name = taxonomy.tagNames[tag] || (tag === '__untagged__' ? '(no primary tag)' : '(unknown)');
      out.push(`| \`${tag}\` | ${name} | ${n} | ${pct(n, a.total)} |`);
    }
    out.push('');

    out.push('**By difficulty**');
    out.push('| Level | Count | Share |');
    out.push('|---|---:|---:|');
    for (const [lvl, n] of a.breakdowns.byDifficulty) {
      out.push(`| ${lvl} | ${n} | ${pct(n, a.total)} |`);
    }
    out.push('');

    out.push('**By type**');
    out.push('| Type | Count |');
    out.push('|---|---:|');
    for (const [t, n] of a.breakdowns.byType) {
      out.push(`| ${t} | ${n} |`);
    }
    out.push('');

    out.push('**By sourceType**');
    out.push('| Source | Count |');
    out.push('|---|---:|');
    for (const [s, n] of a.breakdowns.bySourceType) {
      out.push(`| ${s} | ${n} |`);
    }
    out.push('');

    // ── Quality pool breakdowns ────────────────────────────────────────
    out.push('### Quality-passing pool — breakdowns\n');
    out.push(`(${a.qualityPassing} / ${a.total} questions pass)\n`);

    out.push('**By primary tag (quality pool)**');
    out.push('| Tag ID | Tag name | Quality count | Share of quality pool |');
    out.push('|---|---|---:|---:|');
    for (const [tag, n] of a.breakdowns.qByTag) {
      const name = taxonomy.tagNames[tag] || '(unknown)';
      out.push(`| \`${tag}\` | ${name} | ${n} | ${pct(n, a.qualityPassing)} |`);
    }
    out.push('');

    out.push('**By difficulty (quality pool)**');
    out.push('| Level | Count | Share |');
    out.push('|---|---:|---:|');
    for (const [lvl, n] of a.breakdowns.qByDifficulty) {
      out.push(`| ${lvl} | ${n} | ${pct(n, a.qualityPassing)} |`);
    }
    out.push('');

    out.push('**By sourceType (quality pool)**');
    out.push('| Source | Count |');
    out.push('|---|---:|');
    for (const [s, n] of a.breakdowns.qBySourceType) {
      out.push(`| ${s} | ${n} |`);
    }
    out.push('');

    // ── Tag × difficulty heatmap (the curation gold) ────────────────────
    out.push('### Tag × Difficulty heatmap (quality pool only)\n');
    out.push('_This is what the picker actually has to choose from._\n');
    out.push('| Tag | Tag name | L1 | L2 | L3 | L4 | L5 | Total |');
    out.push('|---|---|---:|---:|---:|---:|---:|---:|');
    for (const [tag, _] of a.breakdowns.qByTag) {
      const row = a.breakdowns.heatmap[tag];
      if (!row) continue;
      const name = taxonomy.tagNames[tag] || '(unknown)';
      out.push(`| \`${tag}\` | ${name} | ${row.L1} | ${row.L2} | ${row.L3} | ${row.L4} | ${row.L5} | ${row.total} |`);
    }
    out.push('');
  }

  // ── Cross-chapter signals ──────────────────────────────────────────────
  out.push('---\n## Cross-chapter signals\n');
  const launchReady = audits.filter((a) => a.qualityPassing >= 25 && a.redFlags.untagged === 0 && !a.redFlags.suspiciousUniformity);
  const needsWork = audits.filter((a) => !launchReady.includes(a));
  out.push(`- **Launch-ready** (≥25 quality, no untagged, no uniformity): ${launchReady.length === 0 ? '_none_' : launchReady.map((a) => '`' + a.chapterId + '`').join(', ')}`);
  out.push(`- **Needs work before launch**: ${needsWork.length === 0 ? '_none_' : needsWork.map((a) => '`' + a.chapterId + '`').join(', ')}`);
  out.push('');

  return out.join('\n');
}

// ── Main ───────────────────────────────────────────────────────────────────
(async () => {
  const chapterIds = process.argv.slice(2);
  if (chapterIds.length === 0) {
    console.error('Usage: node scripts/audit_chapters_for_demo.js <chapter_id> [<chapter_id> ...]');
    process.exit(1);
  }

  const taxonomy = parseTaxonomyTags();

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const collection = db.collection('questions_v2');

  const audits = [];
  for (const chapterId of chapterIds) {
    process.stdout.write(`Auditing ${chapterId}… `);
    const a = await auditChapter(chapterId, collection, taxonomy);
    audits.push(a);
    console.log(`${a.total} total, ${a.qualityPassing} quality-passing`);
  }

  await client.close();

  // Build markdown
  const md = buildMarkdown(audits, taxonomy);

  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const mdPath = path.join(outDir, `demo_audit_${ts}.md`);
  fs.writeFileSync(mdPath, md);

  console.log('\n──────────── REPORT ────────────');
  console.log(md);
  console.log(`\nFull report saved to: ${mdPath}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
