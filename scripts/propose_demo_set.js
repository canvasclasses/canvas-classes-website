/**
 * scripts/propose_demo_set.js   READ-ONLY
 *
 * Stage 2 of the demo-curation pipeline. For each chapter on argv,
 * proposes a balanced demo set of N (default 25) questions:
 *   - Every primary tag with ≥1 qualifying question gets ≥1 slot
 *   - No single tag exceeds 30% of total slots
 *   - Within each tag's quota, 30/40/30 across Easy (L1-L2) / Medium (L3) /
 *     Hard (L4-L5), with graceful redistribution if a stratum is empty
 *   - Within each (tag, stratum) bucket, scores by:
 *       +100  is_top_pyq
 *        +50  sourceType=PYQ
 *        +30  examDetails.year ≥ 2024
 *        +20  examDetails.year ≥ 2022
 *        +20  solution length in 300–1200 sweet spot
 *        +10  exactly 4 options present
 *      -1000  has an unresolved flag
 *
 * sourceType ∈ {Mock, NCERT_Exemplar} is excluded outright per project decision.
 *
 * Output per chapter:
 *   scripts/output/demo_set_<chapter>.json — machine-readable, consumed by
 *     Stage 3 (apply) script.
 *   scripts/output/demo_set_<chapter>.md   — human-readable review document
 *     with per-question why-trace + alternatives.
 *
 * Usage:
 *   node scripts/propose_demo_set.js ch11_mole ch11_atom ch11_periodic \
 *        ch12_solutions ch12_electrochem ch12_kinetics --target 25
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const EXCLUDED_SOURCE_TYPES = new Set(['Mock', 'NCERT_Exemplar']);
const HARD_CAP_PER_TAG_FRACTION = 0.3; // no single tag > 30%

// ── Taxonomy parser (for tag names in the report) ─────────────────────────
function parseTaxonomyTags() {
  const tsPath = path.join(__dirname, '..', 'app', 'crucible', 'admin', 'taxonomy', 'taxonomyData_from_csv.ts');
  const txt = fs.readFileSync(tsPath, 'utf8');
  const tagNames = {};
  const re = /id:\s*'([^']+)'[^\n]*name:\s*'([^']+)'[^\n]*parent_id:\s*'(ch\d+_[a-z_]+)'/;
  for (const line of txt.split('\n')) {
    const m = line.match(re);
    if (m) tagNames[m[1]] = m[2];
  }
  return tagNames;
}

// ── Scoring + classification helpers ───────────────────────────────────────
function classifyDifficulty(level) {
  if (level == null) return 'medium';
  if (level <= 2) return 'easy';
  if (level === 3) return 'medium';
  return 'hard';
}

function scoreQuestion(q) {
  let s = 0;
  const reasons = [];
  if (q.metadata?.is_top_pyq === true) { s += 100; reasons.push('Top PYQ +100'); }
  if (q.metadata?.sourceType === 'PYQ') { s += 50; reasons.push('PYQ +50'); }
  const year = q.metadata?.examDetails?.year || q.metadata?.exam_source?.year;
  if (year >= 2024) { s += 30; reasons.push(`${year} +30`); }
  else if (year >= 2022) { s += 20; reasons.push(`${year} +20`); }
  const solLen = (q.solution?.text_markdown || '').trim().length;
  if (solLen >= 300 && solLen <= 1200) { s += 20; reasons.push(`sol ${solLen}c +20`); }
  if (Array.isArray(q.options) && q.options.length === 4) { s += 10; reasons.push('4 opts +10'); }
  const hasFlag = Array.isArray(q.flags) && q.flags.some((f) => !f.resolved);
  if (hasFlag) { s -= 1000; reasons.push('FLAGGED -1000'); }
  return { score: s, reasons };
}

// Allocate per-tag quotas. Returns { tag_id: quota }.
// Hard rules:
//   - Every tag with ≥1 candidate gets ≥1 slot
//   - No tag exceeds floor(T * 0.3) slots
//   - Sum equals T (or all candidates, whichever is smaller)
function allocateTagQuotas(tagSizes, target) {
  const tags = Object.keys(tagSizes);
  const total = tags.reduce((s, t) => s + tagSizes[t], 0);
  const capPerTag = Math.max(1, Math.floor(target * HARD_CAP_PER_TAG_FRACTION));
  const T = Math.min(target, total);

  // Initial proportional allocation (rounded), floored at 1
  const raw = {};
  for (const t of tags) {
    raw[t] = Math.max(1, Math.round((tagSizes[t] / total) * T));
    raw[t] = Math.min(raw[t], capPerTag, tagSizes[t]);
  }

  // Adjust sum to T by trimming biggest or growing smallest
  let sum = Object.values(raw).reduce((s, n) => s + n, 0);

  // Trim: remove from the tag with the largest gap to its proportional share
  let safety = 200;
  while (sum > T && safety-- > 0) {
    let target_tag = null, best = -Infinity;
    for (const t of tags) {
      if (raw[t] <= 1) continue;
      const fair = (tagSizes[t] / total) * T;
      const excess = raw[t] - fair;
      if (excess > best) { best = excess; target_tag = t; }
    }
    if (!target_tag) break;
    raw[target_tag] -= 1;
    sum -= 1;
  }
  // Grow: add to the tag with the largest deficit (and headroom)
  safety = 200;
  while (sum < T && safety-- > 0) {
    let target_tag = null, best = -Infinity;
    for (const t of tags) {
      if (raw[t] >= capPerTag || raw[t] >= tagSizes[t]) continue;
      const fair = (tagSizes[t] / total) * T;
      const deficit = fair - raw[t];
      if (deficit > best) { best = deficit; target_tag = t; }
    }
    if (!target_tag) break;
    raw[target_tag] += 1;
    sum += 1;
  }

  return raw;
}

// Split a tag's quota across difficulty strata (Easy/Medium/Hard, 30/40/30),
// redistributing to non-empty strata if some are empty.
function splitByDifficulty(quota, available) {
  // available = { easy: n, medium: n, hard: n }
  const targets = {
    easy:   Math.round(quota * 0.3),
    medium: 0, // filled below
    hard:   Math.round(quota * 0.3),
  };
  targets.medium = quota - targets.easy - targets.hard;

  // Cap at availability
  for (const k of ['easy', 'medium', 'hard']) {
    targets[k] = Math.min(targets[k], available[k]);
  }

  // Top-up from non-empty strata if any are short
  let short = quota - (targets.easy + targets.medium + targets.hard);
  let safety = 50;
  while (short > 0 && safety-- > 0) {
    // Prefer redistributing into medium first, then hard, then easy
    const order = ['medium', 'hard', 'easy'];
    let added = false;
    for (const k of order) {
      if (targets[k] < available[k]) {
        targets[k] += 1;
        short -= 1;
        added = true;
        if (short === 0) break;
      }
    }
    if (!added) break; // no more capacity anywhere
  }

  return targets;
}

// ── Main proposer ─────────────────────────────────────────────────────────
async function proposeForChapter(chapterId, target, collection, tagNames) {
  const docs = await collection
    .find({
      'metadata.chapter_id': chapterId,
      status: 'published',
      deleted_at: null,
      'solution.latex_validated': true,
      $expr: { $gte: [{ $strLenCP: { $ifNull: ['$solution.text_markdown', ''] } }, 200] },
    })
    .project({
      _id: 1,
      display_id: 1,
      type: 1,
      flags: 1,
      'metadata.tags': 1,
      'metadata.difficultyLevel': 1,
      'metadata.sourceType': 1,
      'metadata.examDetails': 1,
      'metadata.exam_source': 1,
      'metadata.is_top_pyq': 1,
      'question_text.markdown': 1,
      'solution.text_markdown': 1,
      options: 1,
    })
    .toArray();

  // Eligibility filter
  const eligible = docs.filter((d) => {
    if (!d.metadata?.tags?.[0]?.tag_id) return false;
    if (EXCLUDED_SOURCE_TYPES.has(d.metadata?.sourceType)) return false;
    if (Array.isArray(d.flags) && d.flags.some((f) => !f.resolved)) return false;
    return true;
  });

  // Group by primary tag and difficulty stratum
  const buckets = {}; // tag_id → { easy:[], medium:[], hard:[] }
  for (const q of eligible) {
    const t = q.metadata.tags[0].tag_id;
    const stratum = classifyDifficulty(q.metadata?.difficultyLevel);
    if (!buckets[t]) buckets[t] = { easy: [], medium: [], hard: [] };
    buckets[t][stratum].push(q);
  }

  // Score every candidate
  const scored = {};
  for (const [tag, strata] of Object.entries(buckets)) {
    scored[tag] = {};
    for (const k of ['easy', 'medium', 'hard']) {
      scored[tag][k] = strata[k]
        .map((q) => {
          const { score, reasons } = scoreQuestion(q);
          return { q, score, reasons };
        })
        .sort((a, b) => b.score - a.score || a.q.display_id.localeCompare(b.q.display_id));
    }
  }

  // Per-tag totals (after eligibility, before quota)
  const tagSizes = {};
  for (const [tag, strata] of Object.entries(buckets)) {
    tagSizes[tag] = strata.easy.length + strata.medium.length + strata.hard.length;
  }

  // Allocate quotas
  const tagQuotas = allocateTagQuotas(tagSizes, target);

  // Pick within each tag, stratified
  const picked = [];        // final array of { q, score, reasons, tag, stratum }
  const perTagBreakdown = {}; // tag → { quota, easy, medium, hard, achieved }
  for (const [tag, quota] of Object.entries(tagQuotas)) {
    const avail = {
      easy: scored[tag].easy.length,
      medium: scored[tag].medium.length,
      hard: scored[tag].hard.length,
    };
    const split = splitByDifficulty(quota, avail);
    perTagBreakdown[tag] = { quota, ...split, achieved: 0, available: avail };

    for (const stratum of ['easy', 'medium', 'hard']) {
      const want = split[stratum];
      const pool = scored[tag][stratum];
      for (let i = 0; i < want && i < pool.length; i++) {
        picked.push({ ...pool[i], tag, stratum });
        perTagBreakdown[tag].achieved += 1;
      }
    }
  }

  // Round-robin tiebreak ordering by tag, then by stratum (easy → medium → hard)
  const stratumWeight = { easy: 0, medium: 1, hard: 2 };
  const groupedByTag = {};
  for (const p of picked) {
    if (!groupedByTag[p.tag]) groupedByTag[p.tag] = [];
    groupedByTag[p.tag].push(p);
  }
  for (const tag in groupedByTag) {
    groupedByTag[tag].sort((a, b) => stratumWeight[a.stratum] - stratumWeight[b.stratum]);
  }
  const finalOrdered = [];
  const tagOrder = Object.keys(groupedByTag).sort();
  let stillHaveSome = true;
  let idx = 0;
  while (stillHaveSome) {
    stillHaveSome = false;
    for (const tag of tagOrder) {
      const list = groupedByTag[tag];
      if (idx < list.length) {
        finalOrdered.push(list[idx]);
        stillHaveSome = true;
      }
    }
    idx += 1;
  }

  return {
    chapterId,
    target,
    eligibleTotal: eligible.length,
    finalCount: finalOrdered.length,
    perTagBreakdown,
    picked: finalOrdered,
    // For the alternatives section in the MD report
    scored,
    tagNames,
  };
}

// ── Output builders ───────────────────────────────────────────────────────
function buildJson(proposal) {
  return {
    chapterId: proposal.chapterId,
    target: proposal.target,
    eligible: proposal.eligibleTotal,
    proposed: proposal.finalCount,
    generatedAt: new Date().toISOString(),
    questions: proposal.picked.map((p) => ({
      _id: p.q._id,
      display_id: p.q.display_id,
      tag_id: p.tag,
      difficulty_stratum: p.stratum,
      difficulty_level: p.q.metadata?.difficultyLevel ?? null,
      type: p.q.type,
      sourceType: p.q.metadata?.sourceType,
      score: p.score,
      score_reasons: p.reasons,
    })),
  };
}

function buildMd(proposal) {
  const { chapterId, target, eligibleTotal, finalCount, perTagBreakdown, picked, scored, tagNames } = proposal;
  const out = [];
  out.push(`# Demo Set Proposal — \`${chapterId}\`\n`);
  out.push(`_Generated ${new Date().toISOString()}_  \n`);
  out.push(`Target: **${target}** · Eligible pool: **${eligibleTotal}** · Proposed: **${finalCount}**\n`);
  out.push('---\n');

  // Tag quota table
  out.push('## Per-tag allocation\n');
  out.push('| Tag | Tag name | Quota | E | M | H | Achieved | Available (E/M/H) |');
  out.push('|---|---|---:|---:|---:|---:|---:|---:|');
  for (const [tag, b] of Object.entries(perTagBreakdown)) {
    const name = tagNames[tag] || '(unknown)';
    const av = b.available;
    out.push(`| \`${tag}\` | ${name} | ${b.quota} | ${b.easy} | ${b.medium} | ${b.hard} | ${b.achieved} | ${av.easy}/${av.medium}/${av.hard} |`);
  }
  out.push('');

  // Achieved difficulty distribution
  const diffTally = { easy: 0, medium: 0, hard: 0 };
  for (const p of picked) diffTally[p.stratum]++;
  out.push('## Achieved difficulty mix\n');
  out.push(`Easy: ${diffTally.easy} · Medium: ${diffTally.medium} · Hard: ${diffTally.hard}\n`);

  // The picked questions
  out.push('## Proposed questions (in display order)\n');
  out.push('| # | display_id | Tag | Diff | Type | Source | Score | Why |');
  out.push('|---:|---|---|---|---|---|---:|---|');
  picked.forEach((p, i) => {
    const yr = p.q.metadata?.examDetails?.year || p.q.metadata?.exam_source?.year || '';
    const src = p.q.metadata?.sourceType + (yr ? ` ${yr}` : '');
    const lvl = p.q.metadata?.difficultyLevel != null ? `L${p.q.metadata.difficultyLevel}` : '';
    out.push(
      `| ${i + 1} | \`${p.q.display_id}\` | \`${p.tag}\` | ${lvl} (${p.stratum}) | ${p.q.type} | ${src} | ${p.score} | ${p.reasons.join(', ')} |`
    );
  });
  out.push('');

  // Sample question text (first 120 chars) for the first 10, so the reviewer
  // can spot-check whether the picks read sensibly.
  out.push('## Spot-check — first 10 questions (text excerpt)\n');
  for (let i = 0; i < Math.min(10, picked.length); i++) {
    const p = picked[i];
    const txt = (p.q.question_text?.markdown || '').replace(/\s+/g, ' ').slice(0, 220);
    out.push(`**${i + 1}. \`${p.q.display_id}\` [${p.tag} · ${p.stratum}]**`);
    out.push(`> ${txt}${txt.length === 220 ? '…' : ''}\n`);
  }

  // Alternates — the next-best choice per (tag, stratum), for manual override
  out.push('## Alternates (next-best per tag × stratum) — for manual swap\n');
  out.push('_For each picked slot, the next-highest-scored candidate that wasn\'t taken._\n');
  out.push('| Tag | Stratum | Picked | Picked score | Alternate | Alt score |');
  out.push('|---|---|---|---:|---|---:|');
  const pickedIds = new Set(picked.map((p) => p.q._id.toString()));
  for (const tag in scored) {
    for (const stratum of ['easy', 'medium', 'hard']) {
      const pool = scored[tag][stratum];
      const pickedHere = pool.filter((p) => pickedIds.has(p.q._id.toString()));
      const alternate = pool.find((p) => !pickedIds.has(p.q._id.toString()));
      if (pickedHere.length === 0 || !alternate) continue;
      const worstPicked = pickedHere[pickedHere.length - 1];
      out.push(
        `| \`${tag}\` | ${stratum} | \`${worstPicked.q.display_id}\` | ${worstPicked.score} | \`${alternate.q.display_id}\` | ${alternate.score} |`
      );
    }
  }
  out.push('');

  return out.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);
  const targetIdx = args.indexOf('--target');
  const target = targetIdx >= 0 ? parseInt(args[targetIdx + 1], 10) : 25;
  const chapterIds = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--target');

  if (chapterIds.length === 0) {
    console.error('Usage: node scripts/propose_demo_set.js <chapter_id> [<chapter_id> ...] [--target 25]');
    process.exit(1);
  }

  console.log(`\nProposing demo sets (target=${target}) for: ${chapterIds.join(', ')}\n`);

  const tagNames = parseTaxonomyTags();
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const questions = db.collection('questions_v2');

  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const summary = [];
  for (const cid of chapterIds) {
    process.stdout.write(`  ${cid}… `);
    const proposal = await proposeForChapter(cid, target, questions, tagNames);
    const json = buildJson(proposal);
    const md = buildMd(proposal);
    const jsonPath = path.join(outDir, `demo_set_${cid}.json`);
    const mdPath = path.join(outDir, `demo_set_${cid}.md`);
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
    fs.writeFileSync(mdPath, md);
    summary.push({ cid, eligible: proposal.eligibleTotal, proposed: proposal.finalCount, jsonPath, mdPath });
    console.log(`eligible=${proposal.eligibleTotal}, proposed=${proposal.finalCount}`);
  }

  await client.close();

  console.log('\n────── SUMMARY ──────\n');
  console.log('| Chapter | Eligible | Proposed | Files |');
  console.log('|---|---:|---:|---|');
  for (const s of summary) {
    console.log(`| ${s.cid} | ${s.eligible} | ${s.proposed} | demo_set_${s.cid}.{json,md} |`);
  }
  console.log('\nReview the .md files. When ready, apply with:');
  console.log('  node scripts/apply_demo_set.js scripts/output/demo_set_<chapter>.json --apply');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
