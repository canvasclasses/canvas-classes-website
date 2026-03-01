#!/usr/bin/env node
/**
 * Resequence ch12_carbonyl questions — Batch 1 (ALDO-018 to ALDO-096)
 * Matches questions by exam metadata + optional text hint.
 * Run: node scripts/resequence_carbonyl_batch1.js [--apply]
 * Without --apply: dry-run only (safe to run multiple times)
 */

const DRY_RUN = !process.argv.includes('--apply');
const API_BASE = 'http://localhost:3000/api/v2';

// ─── Target mapping from the user's spreadsheet ───────────────────────────────
// M = Morning, E = Evening
// text_hint: first ~40 chars of question text to disambiguate same-paper duplicates
const TARGET_MAPPING = [
  // Image 1
  // 2024 Apr 4 Evening: only ALDO-086 (Vanillin/vanilla beans)
  { new_id: 'ALDO-018', year: 2024, month: 'Apr', day: 4,  shift: 'Evening', text_hint: 'vanilla beans' },
  { new_id: 'ALDO-019', year: 2022, month: 'Jun', day: 28, shift: 'Evening' },
  { new_id: 'ALDO-020', year: 2022, month: 'Jul', day: 29, shift: 'Morning' },
  { new_id: 'ALDO-021', year: 2020, month: 'Sep', day: 6,  shift: 'Evening' },
  // 2025 Apr 3 Morning: only ALDO-066 (iodoform/Ethanol/Isopropyl)
  { new_id: 'ALDO-022', year: 2025, month: 'Apr', day: 3,  shift: 'Morning', text_hint: 'Isopropyl' },
  { new_id: 'ALDO-023', year: 2025, month: 'Apr', day: 2,  shift: 'Evening' },
  // Jan 22 2025: DB has only Shift-II (Evening) — only ALDO-024
  { new_id: 'ALDO-024', year: 2025, month: 'Jan', day: 22, shift: 'Evening' },
  // Jan 24 2025: Morning — ALDO-071 (arrangements), ALDO-072 (Aman/cyclopent), ALDO-217/266 (benzoic acid duplicates)
  { new_id: 'ALDO-025', year: 2025, month: 'Jan', day: 24, shift: 'Morning', text_hint: 'arrangements with respect to their reactivity' },
  // Jan 29 2025 Evening: ALDO-018 (dibenzalacetone, 5.3g), ALDO-026 (dibenzalacetone, duplicate), ALDO-201 (two statements)
  // Book slot ALDO-026 = the Claisen-Schmidt question; prefer the original ALDO-026 (Shift-II/duplicate) for this slot
  { new_id: 'ALDO-026', year: 2025, month: 'Jan', day: 29, shift: 'Evening', text_hint: '3.51' },
  // Jan 29 2024 Evening: ALDO-087 (haloform text), ALDO-078 (image UUID 56382579)
  { new_id: 'ALDO-027', year: 2024, month: 'Jan', day: 29, shift: 'Evening', text_hint: 'haloform' },
  // Jan 30 2024 Morning: only ALDO-029 (ethyl acetate/chlorobenzene)
  { new_id: 'ALDO-028', year: 2024, month: 'Jan', day: 30, shift: 'Morning', text_hint: 'ethyl acetate' },
  // Jan 31 2024 Evening: ALDO-030 (Identify major product P image), ALDO-088 (name reaction image), ALDO-031 (Friedel-Crafts text)
  { new_id: 'ALDO-029', year: 2024, month: 'Jan', day: 31, shift: 'Evening', text_hint: 'Identify major product P' },
  { new_id: 'ALDO-030', year: 2024, month: 'Jan', day: 31, shift: 'Evening', text_hint: 'Friedel-Crafts' },
  // Jan 31 2024 Morning: only ALDO-081 (butanal/stereoisomers)
  { new_id: 'ALDO-031', year: 2024, month: 'Jan', day: 31, shift: 'Morning', text_hint: 'butanal' },
  { new_id: 'ALDO-032', year: 2024, month: 'Apr', day: 9,  shift: 'Morning' },
  { new_id: 'ALDO-033', year: 2024, month: 'Apr', day: 9,  shift: 'Evening' },
  { new_id: 'ALDO-034', year: 2022, month: 'Jun', day: 26, shift: 'Evening' },
  { new_id: 'ALDO-035', year: 2022, month: 'Jul', day: 27, shift: 'Evening' },
  { new_id: 'ALDO-036', year: 2022, month: 'Jun', day: 27, shift: 'Morning' },
  { new_id: 'ALDO-037', year: 2022, month: 'Jul', day: 26, shift: 'Evening' },
  { new_id: 'ALDO-038', year: 2022, month: 'Jun', day: 25, shift: 'Evening' },
  { new_id: 'ALDO-039', year: 2021, month: 'Mar', day: 16, shift: 'Morning' },
  { new_id: 'ALDO-040', year: 2021, month: 'Jul', day: 27, shift: 'Evening' },
  { new_id: 'ALDO-041', year: 2021, month: 'Feb', day: 25, shift: 'Morning', text_hint: null, order_in_paper: 1 },
  { new_id: 'ALDO-042', year: 2021, month: 'Feb', day: 25, shift: 'Evening' },
  { new_id: 'ALDO-043', year: 2021, month: 'Feb', day: 24, shift: 'Morning' },
  { new_id: 'ALDO-044', year: 2021, month: 'Feb', day: 26, shift: 'Morning', text_hint: null, order_in_paper: 1 },
  { new_id: 'ALDO-045', year: 2021, month: 'Feb', day: 25, shift: 'Morning', text_hint: null, order_in_paper: 2 },
  { new_id: 'ALDO-046', year: 2021, month: 'Aug', day: 26, shift: 'Evening' },
  { new_id: 'ALDO-047', year: 2021, month: 'Mar', day: 16, shift: 'Evening' },
  { new_id: 'ALDO-048', year: 2020, month: 'Sep', day: 2,  shift: 'Morning' },
  { new_id: 'ALDO-049', year: 2020, month: 'Sep', day: 6,  shift: 'Evening' },
  // Image 2
  { new_id: 'ALDO-050', year: 2019, month: 'Jan', day: 9,  shift: 'Morning' },
  { new_id: 'ALDO-051', year: 2019, month: 'Jan', day: 12, shift: 'Morning', text_hint: null, order_in_paper: 1 },
  { new_id: 'ALDO-052', year: 2019, month: 'Jan', day: 11, shift: 'Morning' },
  { new_id: 'ALDO-053', year: 2019, month: 'Jan', day: 12, shift: 'Evening' },
  // Apr 8 2025: Evening = ALDO-214, ALDO-055; Shift-II = ALDO-265, ALDO-056
  { new_id: 'ALDO-054', year: 2025, month: 'Apr', day: 8,  shift: 'Evening', text_hint: 'intramolecular aldol' },
  { new_id: 'ALDO-055', year: 2025, month: 'Apr', day: 8,  shift: 'Evening', text_hint: '1, 2-dibromocyclooctane' },
  // Apr 7 2025: DB has 5 questions — 2 Morning (ALDO-215,281 duplicates), Shift-I (ALDO-027), 2 Evening variants (ALDO-058 Shift-II, ALDO-059 Evening)
  // Book expects 3 questions: Shift-I (ALDO-027=final product D), Evening (optically active = ALDO-059), Evening (chlorobenzene = none distinct)
  { new_id: 'ALDO-056', year: 2025, month: 'Apr', day: 7,  shift: 'Morning', text_hint: 'final product (D)' },
  { new_id: 'ALDO-057', year: 2025, month: 'Apr', day: 7,  shift: 'Evening', text_hint: 'optically active' },
  { new_id: 'ALDO-058', year: 2025, month: 'Apr', day: 7,  shift: 'Morning', text_hint: 'least likely' },
  // Apr 4 2025: DB has 3 — Evening=ALDO-061 (yellow solid), Morning=ALDO-063 (C3H6O), ALDO-064 (aldol condensation)
  // Book expects 5 — 3 exist, 2 are missing from DB
  { new_id: 'ALDO-059', year: 2025, month: 'Apr', day: 4,  shift: 'Evening', text_hint: 'yellow solid' },
  { new_id: 'ALDO-060', year: 2025, month: 'Apr', day: 4,  shift: 'Morning', text_hint: 'C3H6O' },
  { new_id: 'ALDO-061', year: 2025, month: 'Apr', day: 4,  shift: 'Morning', text_hint: 'aldol condensation' },
  // Apr 3 2025: Evening=ALDO-065 (major product image) — ALDO-066 Morning already used by ALDO-022
  { new_id: 'ALDO-062', year: 2025, month: 'Apr', day: 3,  shift: 'Evening', text_hint: 'major product (P)' },
  // ALDO-063 slot: Apr 3 Morning already assigned to ALDO-022 — skip
  // Apr 2 2025: Morning = ALDO-067, ALDO-083, ALDO-216
  { new_id: 'ALDO-064', year: 2025, month: 'Apr', day: 2,  shift: 'Morning', text_hint: 'two statements' },
  // Jan 24 2025: Morning — 4 candidates (ALDO-071 arrangements, ALDO-072 Aman/cyclopent, ALDO-217/266 benzoic acid duplicates)
  { new_id: 'ALDO-065', year: 2025, month: 'Jan', day: 24, shift: 'Morning', text_hint: 'arrangements with respect to their reactivity' },
  { new_id: 'ALDO-066', year: 2025, month: 'Jan', day: 24, shift: 'Morning', text_hint: 'Aman' },
  // Jan 28 2025: Evening=ALDO-200, Morning=ALDO-073,074,025,218 (218/025 are duplicates of same question)
  { new_id: 'ALDO-067', year: 2025, month: 'Jan', day: 28, shift: 'Evening' },
  { new_id: 'ALDO-068', year: 2025, month: 'Jan', day: 28, shift: 'Morning', text_hint: 'acetaldehyde and acetone' },
  { new_id: 'ALDO-069', year: 2025, month: 'Jan', day: 28, shift: 'Morning', text_hint: 'rearrangement' },
  { new_id: 'ALDO-070', year: 2025, month: 'Jan', day: 28, shift: 'Morning', text_hint: 'NaHCO3' },
  // Jan 29 2025: Evening=ALDO-201,018,026(Shift-II); Morning=ALDO-202,028,075
  { new_id: 'ALDO-071', year: 2025, month: 'Jan', day: 29, shift: 'Morning', text_hint: 'cyclopent' },
  { new_id: 'ALDO-072', year: 2025, month: 'Jan', day: 29, shift: 'Morning', text_hint: '0.1 mole' },
  // Jan 29 2024: ALDO-087 (haloform) already used by ALDO-027 — only ALDO-078 (image) remains
  // ALDO-073 slot: haloform question already assigned to ALDO-027 — skip
  { new_id: 'ALDO-074', year: 2024, month: 'Jan', day: 29, shift: 'Evening', text_hint: '56382579' },
  // Jan 30 2024: ALDO-029 (ethyl acetate/Morning) already used by ALDO-028 — skip ALDO-075
  // ALDO-075 slot: ethyl acetate question already assigned to ALDO-028 — skip
  { new_id: 'ALDO-076', year: 2024, month: 'Jan', day: 30, shift: 'Evening', text_hint: 'reagent A and reagent B' },
  { new_id: 'ALDO-077', year: 2024, month: 'Jan', day: 30, shift: 'Evening', text_hint: 'f070fa77' },
  // Jan 31 2024: ALDO-030 taken by ALDO-029, ALDO-031 taken by ALDO-030, ALDO-081 taken by ALDO-031
  // Only ALDO-088 (name reaction image) remains for this paper
  { new_id: 'ALDO-079', year: 2024, month: 'Jan', day: 31, shift: 'Evening', text_hint: 'name reaction' },
  // ALDO-080 slot: Friedel-Crafts question already assigned to ALDO-030 — skip
  // Feb 1 2024: Morning only — ALDO-032 (CH_3 with image) and ALDO-082 (Benzene + CH3Cl)
  { new_id: 'ALDO-081', year: 2024, month: 'Feb', day: 1,  shift: 'Morning', text_hint: 'CH_3' },
  { new_id: 'ALDO-082', year: 2024, month: 'Feb', day: 1,  shift: 'Morning', text_hint: 'Benzene + CH' },
  // Image 3 — Apr 2024
  // Apr 4 2024: ALDO-086 Evening already used by ALDO-018 — only ALDO-085 Morning remains
  { new_id: 'ALDO-083', year: 2024, month: 'Apr', day: 4,  shift: 'Morning', text_hint: 'correct reaction(s)' },
  // ALDO-084 slot: vanilla beans question already assigned to ALDO-018 — skip
  // Apr 5 2024: 4 Evening questions — nomenclature(ALDO-197), Jone(ALDO-220), A and B given chemical(ALDO-221), product C(ALDO-222)
  { new_id: 'ALDO-085', year: 2024, month: 'Apr', day: 5,  shift: 'Evening', text_hint: 'nomenclature' },
  { new_id: 'ALDO-086', year: 2024, month: 'Apr', day: 5,  shift: 'Evening', text_hint: 'Jone' },
  { new_id: 'ALDO-087', year: 2024, month: 'Apr', day: 5,  shift: 'Evening', text_hint: 'Identify A and B in the given chemical' },
  { new_id: 'ALDO-088', year: 2024, month: 'Apr', day: 5,  shift: 'Evening', text_hint: 'product (C)' },
  // Apr 6 2024: Evening = ALDO-223 (major product P)
  { new_id: 'ALDO-089', year: 2024, month: 'Apr', day: 6,  shift: 'Evening', text_hint: 'major product P' },
  // Apr 8 2024: Morning = ALDO-224, ALDO-225 (Two moles benzaldehyde)
  { new_id: 'ALDO-090', year: 2024, month: 'Apr', day: 8,  shift: 'Morning', text_hint: 'benzaldehyde' },
  // Apr 9 2024: Shift-I=Morning(ALDO-091), Shift-II=Evening(ALDO-092,093)
  { new_id: 'ALDO-091', year: 2024, month: 'Apr', day: 9,  shift: 'Morning' },
  { new_id: 'ALDO-092', year: 2024, month: 'Apr', day: 9,  shift: 'Evening', text_hint: 'iodoform' },
  { new_id: 'ALDO-093', year: 2024, month: 'Apr', day: 9,  shift: 'Evening', text_hint: 'silver mirror' },
  // Jan 2023
  { new_id: 'ALDO-094', year: 2023, month: 'Jan', day: 24, shift: 'Morning', text_hint: 'Lactone' },
  { new_id: 'ALDO-095', year: 2023, month: 'Jan', day: 30, shift: 'Morning' },
  // Apr 2023
  { new_id: 'ALDO-096', year: 2023, month: 'Apr', day: 12, shift: 'Morning' },
];

// Month name → number for comparison
const MONTH_NUM = {
  Jan: 1, January: 1, Feb: 2, February: 2, Mar: 3, March: 3,
  Apr: 4, April: 4, May: 5, Jun: 6, June: 6, Jul: 7, July: 7,
  Aug: 8, August: 8, Sep: 9, September: 9, Oct: 10, October: 10,
  Nov: 11, November: 11, Dec: 12, December: 12
};

// Normalize month strings from DB (handles 'January', 'Jan', 'Jul', 'July', '01', etc.)
function normalizeMonth(m) {
  if (!m) return null;
  if (typeof m === 'number') return m;
  const s = String(m).trim();
  if (/^\d+$/.test(s)) return parseInt(s);
  // Try exact match first
  if (MONTH_NUM[s]) return MONTH_NUM[s];
  // Try first 3 chars capitalized
  const abbrev = s.charAt(0).toUpperCase() + s.slice(1, 3).toLowerCase();
  return MONTH_NUM[abbrev] || null;
}

// Shift-I = Morning, Shift-II = Evening (DB uses both formats)
function normalizeShift(s) {
  if (!s) return null;
  const lower = String(s).toLowerCase().replace(/[\s_]/g, '-');
  if (lower === 'morning' || lower === 'shift-i' || lower === 'shift-1' || lower === 'm') return 'Morning';
  if (lower === 'evening' || lower === 'shift-ii' || lower === 'shift-2' || lower === 'e') return 'Evening';
  // Afternoon = Evening (some entries)
  if (lower === 'afternoon') return 'Evening';
  return s;
}

function examMatches(dbQ, target) {
  const es = dbQ.metadata?.exam_source;
  if (!es) return false;

  const dbYear = es.year;
  const dbMonth = normalizeMonth(es.month);
  const dbDay = es.day ? parseInt(es.day) : null;
  const dbShift = normalizeShift(es.shift);

  const targetMonth = MONTH_NUM[target.month];
  const targetShift = normalizeShift(target.shift);

  return (
    dbYear === target.year &&
    dbMonth === targetMonth &&
    dbDay === target.day &&
    dbShift === targetShift
  );
}

function textMatches(dbQ, hint) {
  if (!hint) return true;
  const text = dbQ.question_text?.markdown?.toLowerCase() || '';
  return text.includes(hint.toLowerCase());
}

async function fetchAllCarbonylQuestions() {
  let allQuestions = [];
  let skip = 0;
  const limit = 300;

  while (true) {
    const url = `${API_BASE}/questions?chapter_id=ch12_carbonyl&limit=${limit}&skip=${skip}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success) throw new Error(`API error: ${JSON.stringify(data)}`);

    // API returns data as array directly (not data.questions)
    const batch = Array.isArray(data.data) ? data.data : [];
    allQuestions = allQuestions.concat(batch);

    if (batch.length < limit || !data.pagination?.hasMore) break;
    skip += limit;
  }

  // Filter to ALDO-NNN only (exclude CARB-001, CARB-002)
  return allQuestions.filter(q => /^ALDO-\d+$/.test(q.display_id));
}

async function main() {
  console.log(`\n🔧 Carbonyl Resequencing — Batch 1 (ALDO-018 to ALDO-096)`);
  console.log(`   Mode: ${DRY_RUN ? '🟡 DRY RUN (no changes)' : '🔴 LIVE — will update DB'}\n`);

  const questions = await fetchAllCarbonylQuestions();
  console.log(`✓ Fetched ${questions.length} ALDO questions from API\n`);

  // Build a working pool (exclude ALDO-001 to ALDO-015 which are original PYQs, keep untouched)
  const pool = questions.filter(q => {
    const num = parseInt(q.display_id.replace('ALDO-', ''));
    return num >= 16; // only renumber ALDO-016+
  });

  // ── TWO-PASS MATCHING ────────────────────────────────────────────────────
  // Pass 1: Lock in all targets that have a text_hint (exact match wins)
  //         This prevents hinted targets from stealing pool entries needed
  //         by other hinted targets.
  // Pass 2: Assign remaining unhinted targets positionally from what's left.

  const assigned = new Set(); // _id values already matched
  const results = new Array(TARGET_MAPPING.length).fill(null);

  // ─ Pass 1: resolve hinted targets ──────────────────────────────────────
  for (let i = 0; i < TARGET_MAPPING.length; i++) {
    const target = TARGET_MAPPING[i];
    if (!target.text_hint) continue; // leave for pass 2

    const metaMatches = pool.filter(q => examMatches(q, target));

    if (metaMatches.length === 0) {
      results[i] = { target, matched: null, status: 'NOT_FOUND' };
      continue;
    }

    // Filter unassigned candidates, then apply hint
    const unassigned = metaMatches.filter(q => !assigned.has(q._id));
    if (unassigned.length === 0) {
      results[i] = { target, matched: null, status: 'NOT_FOUND' };
      continue;
    }

    const hintMatches = unassigned.filter(q => textMatches(q, target.text_hint));

    let chosen;
    if (hintMatches.length >= 1) {
      chosen = hintMatches.sort((a, b) => a.display_id.localeCompare(b.display_id))[0];
      if (hintMatches.length > 1) {
        console.log(`  ⚠️  P1 ${target.new_id}: hint "${target.text_hint}" matched ${hintMatches.length} — taking ${chosen.display_id}`);
      }
    } else {
      // hint matched nothing — defer to pass 2 so we don't steal a needed question
      results[i] = { target, matched: null, status: 'HINT_MISS', _metaMatches: unassigned };
      continue;
    }

    assigned.add(chosen._id);
    const unchanged = chosen.display_id === target.new_id;
    results[i] = { target, matched: chosen, status: unchanged ? 'SAME' : 'RENAME', old_id: chosen.display_id, new_id: target.new_id };
  }

  // ─ Pass 2: resolve unhinted + hint-miss targets positionally ───────────
  for (let i = 0; i < TARGET_MAPPING.length; i++) {
    const target = TARGET_MAPPING[i];
    // Skip already resolved
    if (results[i] !== null && results[i].status !== 'HINT_MISS') continue;

    const prevMeta = results[i]?._metaMatches; // cached from pass 1 hint miss
    const metaMatches = prevMeta || pool.filter(q => examMatches(q, target));
    const unassigned = metaMatches.filter(q => !assigned.has(q._id));

    if (unassigned.length === 0) {
      results[i] = { target, matched: null, status: 'NOT_FOUND' };
      if (results[i]?.status === 'HINT_MISS') {
        console.log(`  ⚠️  P2 ${target.new_id}: hint "${target.text_hint}" matched nothing, pool also exhausted`);
      } else if (metaMatches.length > 0) {
        console.log(`  ⚠️  P2 ${target.new_id}: pool exhausted (${metaMatches.length} questions exist but all assigned)`);
      }
      results[i] = { target, matched: null, status: 'NOT_FOUND' };
      continue;
    }

    // Sort by current display_id (numerical), pick first
    const sorted = unassigned.sort((a, b) => {
      const na = parseInt(a.display_id.replace('ALDO-',''));
      const nb = parseInt(b.display_id.replace('ALDO-',''));
      return na - nb;
    });

    // If order_in_paper specified, use it
    const idx = target.order_in_paper ? (target.order_in_paper - 1) : 0;
    const chosen = sorted[Math.min(idx, sorted.length - 1)];

    if (unassigned.length > 1 && !target.text_hint) {
      console.log(`  ⚠️  P2 ${target.new_id}: ${unassigned.length} candidates, no hint — taking ${chosen.display_id}`);
    } else if (results[i]?.status === 'HINT_MISS') {
      console.log(`  ⚠️  P2 ${target.new_id}: hint "${target.text_hint}" matched nothing — taking ${chosen.display_id}`);
    }

    assigned.add(chosen._id);
    const unchanged = chosen.display_id === target.new_id;
    results[i] = { target, matched: chosen, status: unchanged ? 'SAME' : 'RENAME', old_id: chosen.display_id, new_id: target.new_id };
  }

  // ── Print results ─────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('MATCHING RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  let renames = 0, same = 0, notFound = 0;

  for (const r of results) {
    if (r.status === 'NOT_FOUND') {
      console.log(`  ✗ NOT FOUND  ${r.target.new_id}  ← ${r.target.year} ${r.target.month} ${r.target.day} ${r.target.shift}`);
      notFound++;
    } else if (r.status === 'SAME') {
      console.log(`  =  SAME      ${r.old_id}`);
      same++;
    } else {
      console.log(`  ✎  RENAME    ${r.old_id.padEnd(12)} → ${r.new_id}  (${r.target.year} ${r.target.month} ${r.target.day} ${r.target.shift})`);
      renames++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`  ✎  Renames:   ${renames}`);
  console.log(`  =  Unchanged: ${same}`);
  console.log(`  ✗  Not found: ${notFound}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  if (notFound > 0) {
    console.log('⚠️  Not-found questions — check exam metadata in DB:\n');
    results.filter(r => r.status === 'NOT_FOUND').forEach(r => {
      console.log(`   ${r.target.new_id}: ${r.target.year} ${r.target.month} ${r.target.day} ${r.target.shift}`);
    });
    console.log('');
  }

  if (DRY_RUN) {
    console.log('🟡 DRY RUN complete. Run with --apply to execute renames.\n');
    return;
  }

  // ── IMPORTANT: Two-phase rename to avoid display_id collisions ───────────
  // Phase 1: Rename all targets to temp IDs (ALDO-T018, ALDO-T019, ...)
  // Phase 2: Rename temp IDs to final target IDs
  // This avoids: ALDO-050 → ALDO-018 collision when ALDO-018 already exists

  const toRename = results.filter(r => r.status === 'RENAME');

  if (toRename.length === 0) {
    console.log('✅ Nothing to rename.\n');
    return;
  }

  console.log(`\n🔄 Phase 1: Assign temp IDs to ${toRename.length} questions...\n`);
  let phase1ok = 0, phase1fail = 0;

  for (const r of toRename) {
    const tempId = r.new_id.replace('ALDO-', 'ALDO-T');
    const res = await fetch(`${API_BASE}/questions/${r.matched._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_id: tempId })
    });
    const data = await res.json();
    if (data.success) {
      r.temp_id = tempId;
      phase1ok++;
    } else {
      console.log(`  ✗ Phase1 failed: ${r.old_id} → ${tempId}: ${data.error}`);
      phase1fail++;
    }
    await new Promise(res => setTimeout(res, 40));
  }

  console.log(`  Phase 1 done: ${phase1ok} ok, ${phase1fail} failed\n`);

  console.log(`🔄 Phase 2: Assign final IDs...\n`);
  let phase2ok = 0, phase2fail = 0;

  for (const r of toRename) {
    if (!r.temp_id) continue; // phase 1 failed for this one
    const res = await fetch(`${API_BASE}/questions/${r.matched._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_id: r.new_id })
    });
    const data = await res.json();
    if (data.success) {
      console.log(`  ✓ ${r.old_id} → ${r.new_id}`);
      phase2ok++;
    } else {
      console.log(`  ✗ ${r.temp_id} → ${r.new_id}: ${data.error}`);
      phase2fail++;
    }
    await new Promise(res => setTimeout(res, 40));
  }

  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`✅ Done! Phase 2: ${phase2ok} renamed, ${phase2fail} failed`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
