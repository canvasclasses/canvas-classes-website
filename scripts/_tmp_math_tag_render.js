#!/usr/bin/env node
/**
 * READ-ONLY. Validates the 3 subagent tag files against the dumps and renders
 * faculty-facing verification tables (CSV + Markdown). No DB writes.
 * Output dir: _agents/tagging/math/
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '_tmp_math_tag');
const OUT = path.join(__dirname, '..', '_agents', 'tagging', 'math');
fs.mkdirSync(OUT, { recursive: true });

const CHAPTERS = [
  { id: 'ma_basic_math', label: 'Basic of Mathematics', prefix: 'BOMA', max: 4 },
  { id: 'ma_quadratic', label: 'Quadratic Equation', prefix: 'QUAD', max: 10 },
  { id: 'ma_complex', label: 'Complex Number', prefix: 'CMPL', max: 13 },
];

const allowed = (chId, max) => new Set(['', ...Array.from({ length: max }, (_, i) => `tag_${chId}_${i + 1}`)]);
const snippet = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 150);
const csvCell = (s) => '"' + String(s ?? '').replace(/"/g, '""') + '"';

let combinedMd = ['# Math primary-tag assignments — faculty verification', '',
  'Agent-proposed **primary (macro) tags** for the first three Class-11 math chapters. Micro tags are left for faculty. Please verify the "Assigned primary tag" column; flag any row to change.', ''];
let grandTotal = 0;
const problems = [];

for (const ch of CHAPTERS) {
  const dump = JSON.parse(fs.readFileSync(path.join(SRC, `${ch.id}.json`), 'utf8'));
  const tags = JSON.parse(fs.readFileSync(path.join(SRC, `${ch.id}_tags.json`), 'utf8'));
  const allow = allowed(ch.id, ch.max);
  const stemById = new Map(dump.map((q) => [q.display_id, q.stem]));
  const tagById = new Map(tags.map((t) => [t.display_id, t]));

  // ---- validation ----
  if (tags.length !== dump.length) problems.push(`${ch.id}: tag count ${tags.length} != question count ${dump.length}`);
  for (const q of dump) if (!tagById.has(q.display_id)) problems.push(`${ch.id}: missing tag for ${q.display_id}`);
  for (const t of tags) {
    if (!stemById.has(t.display_id)) problems.push(`${ch.id}: tag for unknown ${t.display_id}`);
    if (!allow.has(t.tag_id)) problems.push(`${ch.id}: INVALID tag_id '${t.tag_id}' on ${t.display_id}`);
  }

  // ---- distribution ----
  const dist = {};
  for (const t of tags) dist[t.tag_name || t.tag_id || 'NEEDS_REVIEW'] = (dist[t.tag_name || t.tag_id] || 0) + 1;
  const conf = { High: 0, Medium: 0, Low: 0 };
  for (const t of tags) conf[t.confidence] = (conf[t.confidence] || 0) + 1;

  // ---- CSV (sorted by display_id, matching dump order) ----
  const rows = dump.map((q) => {
    const t = tagById.get(q.display_id) || {};
    return [q.display_id, t.tag_id, t.tag_name, t.confidence, t.reason, snippet(q.stem)];
  });
  const csv = ['display_id,assigned_tag_id,assigned_primary_tag,confidence,agent_reason,question_stem']
    .concat(rows.map((r) => r.map(csvCell).join(','))).join('\n');
  fs.writeFileSync(path.join(OUT, `${ch.id}_primary_tags.csv`), csv);

  // ---- Markdown section ----
  combinedMd.push(`## ${ch.label} (${ch.prefix}) — ${tags.length} questions`, '');
  combinedMd.push('**Distribution:** ' + Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(' · '));
  combinedMd.push('', `**Confidence:** High ${conf.High} · Medium ${conf.Medium} · Low ${conf.Low}`, '');
  combinedMd.push('| display_id | Assigned primary tag | Conf | Why | Question (start) |');
  combinedMd.push('|---|---|---|---|---|');
  for (const q of dump) {
    const t = tagById.get(q.display_id) || {};
    const stem = snippet(q.stem).replace(/\|/g, '\\|');
    const reason = (t.reason || '').replace(/\|/g, '\\|');
    combinedMd.push(`| ${q.display_id} | ${t.tag_name || '—'} | ${t.confidence || ''} | ${reason} | ${stem} |`);
  }
  combinedMd.push('');
  grandTotal += tags.length;
  console.log(`${ch.label}: ${tags.length} rows | High ${conf.High}/Med ${conf.Medium}/Low ${conf.Low} | CSV written`);
}

fs.writeFileSync(path.join(OUT, 'ALL_math_primary_tags.md'), combinedMd.join('\n'));

console.log(`\nGrand total: ${grandTotal} questions`);
console.log(problems.length ? `\n⚠️ VALIDATION PROBLEMS:\n  ${problems.join('\n  ')}` : '\n✅ Validation clean: counts match, all display_ids covered, all tag_ids legal.');
console.log(`\nDeliverables in: _agents/tagging/math/`);
