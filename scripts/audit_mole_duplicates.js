/**
 * READ-ONLY audit: find likely duplicate questions in the MOLE chapter.
 *
 * Premise (from founder): MOLE-001..090 were ingested from handwritten notes
 * (solutions + recordings already added) and are NOT PYQ-tagged even though some
 * ARE previous-year questions. Later PYQ ingests (display num > 90) may be
 * duplicates of those. We want to KEEP the early version (it has the solution)
 * and later decide whether to remove the duplicate.
 *
 * This script ONLY READS questions_v2 and writes a markdown report. It performs
 * NO updates, NO deletes, NO metadata changes. Nothing is mutated.
 *
 * Matching: paraphrased duplicates won't match on exact text, so we score on
 *   - stem token Jaccard (normalized words, LaTeX stripped)
 *   - NUMBER-set Jaccard (all numeric literals incl. inside LaTeX) — strong
 *     signal for quantitative mole problems
 *   - option-text token Jaccard
 * combined = 0.45*tok + 0.40*num + 0.15*opt
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');

const CHAPTER_ID = 'ch11_mole';
const ANCHOR_MAX = 90;            // display num <= 90 => anchor (handwritten, has solution)
const REPORT_MIN = 0.45;          // surface a candidate↔anchor pair at/above this combined score

const STOP = new Set(('a an the of to is are be in on for and or if then what which value following given below above ' +
  'will would can could number find calculate that this these those it its as at by with from has have').split(' '));

function parseNum(displayId) {
  const m = String(displayId || '').match(/(\d+)\s*$/);
  return m ? parseInt(m[1], 10) : NaN;
}

// strip LaTeX/markdown noise -> lowercase token stream
function normalize(s) {
  return String(s || '')
    .replace(/\$+/g, ' ')
    .replace(/\\ce\{([^}]*)\}/g, ' $1 ')   // keep formula contents
    .replace(/\\[a-zA-Z]+/g, ' ')          // drop \frac \rightarrow etc.
    .replace(/[{}]/g, ' ')
    .toLowerCase();
}

function tokenSet(s) {
  const toks = normalize(s).match(/[a-z0-9]+/g) || [];
  return new Set(toks.filter(t => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t)));
}

// all numeric literals (12, 0.1, 22.4, 6.022, 273.15 ...)
function numberSet(s) {
  const nums = normalize(s).match(/\d+\.?\d*/g) || [];
  return new Set(nums.map(n => String(parseFloat(n))).filter(n => n !== '0' && n !== 'NaN'));
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function optText(q) {
  return (q.options || []).map(o => o.text || '').join(' ');
}
function answerStr(q) {
  const a = q.answer || {};
  if (a.correct_option) return `opt ${a.correct_option}`;
  if (a.integer_value != null) return `int ${a.integer_value}`;
  return '—';
}
function hasSolution(q) {
  return !!(q.solution && q.solution.text_markdown && q.solution.text_markdown.trim());
}
function hasRecording(q) {
  const s = q.solution || {};
  const audio = s.asset_ids && Array.isArray(s.asset_ids.audio) && s.asset_ids.audio.filter(Boolean).length;
  return !!(s.video_url || audio);
}
function isPyq(q) {
  const m = q.metadata || {};
  return m.sourceType === 'PYQ' || m.is_pyq === true;
}
function trunc(s, n) { s = (s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; }

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 60000 });
  await client.connect();
  const db = client.db('crucible');

  const docs = await db.collection('questions_v2').find(
    { 'metadata.chapter_id': CHAPTER_ID, deleted_at: null },
    { projection: { display_id: 1, question_text: 1, options: 1, answer: 1, type: 1, solution: 1,
                    'metadata.sourceType': 1, 'metadata.is_pyq': 1, 'metadata.examDetails': 1, flags: 1 } }
  ).toArray();

  // build feature vectors
  for (const q of docs) {
    q._num = parseNum(q.display_id);
    const stem = (q.question_text && q.question_text.markdown) || '';
    q._tok = tokenSet(stem + ' ' + optText(q));
    q._numset = numberSet(stem + ' ' + optText(q));
    q._opt = tokenSet(optText(q));
  }
  const withNum = docs.filter(d => !isNaN(d._num)).sort((a, b) => a._num - b._num);
  const anchors = withNum.filter(d => d._num <= ANCHOR_MAX);
  const candidates = withNum.filter(d => d._num > ANCHOR_MAX);

  // premise validation
  const pyqInAnchors = anchors.filter(isPyq).length;
  const pyqInCandidates = candidates.filter(isPyq).length;

  // score each candidate against every anchor
  const pairs = [];
  for (const c of candidates) {
    let best = null;
    for (const a of anchors) {
      const tok = jaccard(c._tok, a._tok);
      const num = jaccard(c._numset, a._numset);
      const opt = jaccard(c._opt, a._opt);
      const combined = 0.45 * tok + 0.40 * num + 0.15 * opt;
      if (!best || combined > best.combined) best = { a, tok, num, opt, combined };
    }
    if (best && best.combined >= REPORT_MIN) pairs.push({ c, ...best });
  }
  pairs.sort((x, y) => y.combined - x.combined);

  const HIGH = pairs.filter(p => p.combined >= 0.7 || (p.num >= 0.85 && p.tok >= 0.4));
  const MAYBE = pairs.filter(p => !HIGH.includes(p));

  // ---- report ----
  const L = [];
  L.push(`# MOLE duplicate audit (READ-ONLY — nothing mutated)\n`);
  L.push(`Chapter: \`${CHAPTER_ID}\` · live questions: **${docs.length}** · with parseable display num: ${withNum.length}`);
  L.push(`Anchors (display ≤ ${ANCHOR_MAX}): **${anchors.length}** · Candidates (> ${ANCHOR_MAX}): **${candidates.length}**`);
  L.push(`\n**Premise check:** PYQ-tagged among anchors = ${pyqInAnchors}/${anchors.length} (expected: low — they're handwritten) · PYQ-tagged among candidates = ${pyqInCandidates}/${candidates.length}`);
  L.push(`\nScoring: combined = 0.45·stemTokens + 0.40·numberSet + 0.15·options. Surfacing combined ≥ ${REPORT_MIN}.`);
  L.push(`Legend per row: \`display_id\` (PYQ? / sol? / rec?) · answer.\n`);

  const renderPair = (p, i) => {
    const c = p.c, a = p.a;
    const cStem = (c.question_text && c.question_text.markdown) || '';
    const aStem = (a.question_text && a.question_text.markdown) || '';
    return [
      `### ${i + 1}. ${a.display_id}  ⟷  ${c.display_id}   — combined ${p.combined.toFixed(2)} (tok ${p.tok.toFixed(2)} · num ${p.num.toFixed(2)} · opt ${p.opt.toFixed(2)})`,
      `- **ANCHOR ${a.display_id}** (PYQ:${isPyq(a)?'Y':'N'} · sol:${hasSolution(a)?'Y':'N'} · rec:${hasRecording(a)?'Y':'N'} · ${answerStr(a)})`,
      `  - ${trunc(aStem, 240)}`,
      `- **CANDIDATE ${c.display_id}** (PYQ:${isPyq(c)?'Y':'N'} · sol:${hasSolution(c)?'Y':'N'} · rec:${hasRecording(c)?'Y':'N'} · ${answerStr(c)}${c.metadata?.examDetails?.year?` · ${c.metadata.examDetails.exam||''} ${c.metadata.examDetails.year}`:''})`,
      `  - ${trunc(cStem, 240)}`,
      ``,
    ].join('\n');
  };

  L.push(`\n## 🔴 HIGH-confidence duplicates (${HIGH.length})\n`);
  HIGH.forEach((p, i) => L.push(renderPair(p, i)));
  L.push(`\n## 🟡 POSSIBLE duplicates — needs your eye (${MAYBE.length})\n`);
  MAYBE.forEach((p, i) => L.push(renderPair(p, i)));

  const outPath = 'scripts/_mole_dedup_report.md';
  fs.writeFileSync(outPath, L.join('\n'));

  // console summary
  console.log(`MOLE live=${docs.length} anchors(≤${ANCHOR_MAX})=${anchors.length} candidates=${candidates.length}`);
  console.log(`PYQ-tagged: anchors ${pyqInAnchors}/${anchors.length}, candidates ${pyqInCandidates}/${candidates.length}`);
  console.log(`HIGH-confidence dup pairs: ${HIGH.length} | POSSIBLE: ${MAYBE.length}`);
  console.log(`\nTop matches:`);
  pairs.slice(0, 25).forEach(p =>
    console.log(`  ${p.combined.toFixed(2)}  ${p.a.display_id}(sol:${hasSolution(p.a)?'Y':'N'}) <-> ${p.c.display_id}(PYQ:${isPyq(p.c)?'Y':'N'})  tok${p.tok.toFixed(2)} num${p.num.toFixed(2)}`));
  console.log(`\nFull report: ${outPath}`);

  await client.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
