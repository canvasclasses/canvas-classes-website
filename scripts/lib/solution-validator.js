// solution-validator.js — SINGLE SOURCE OF TRUTH for solution validation across
// all three solution toolkits: scripts/{chemistry,math,physics}-solutions/.
//
// WHY THIS EXISTS (2026-06-13): the three toolkits each carried their own copy of
// validateSolution()/FORBIDDEN_PHRASES/normalizeCeCharges, and they DRIFTED. The
// FORMAT v2 switch (no iconified headings — teacher voice) shipped in math- and
// physics-solutions but never reached chemistry-solutions/apply-batch.js, which
// kept hard-requiring the 4 legacy icons and would have rejected every v2
// chemistry solution. A physics-pilot agent caught it. The fix is to keep the
// STRUCTURAL CORE here, in one place, so the icon skeleton can never drift again.
//
// SUBJECT-SPECIFIC POLICY is injected via `policy`, because the subjects
// intentionally differ — do NOT flatten these into one identical rule set:
//   - physics keeps 🖼️ as a v2 figure-anchor heading, ALLOWS the word "anchor"
//     (legit physics term), and bans "monster" only in v2 (word-boundary).
//   - chemistry & math forbid ALL six section icons in v2 and ban both "monster"
//     and "anchor" as substrings everywhere.
// `softLint` (the crammed-calc-step note) is a per-CALL option, not policy: only
// math's apply-batch opts in, and audits never do (keeps audit output stable).
//
// When a validation rule needs to change, change it HERE and it applies to every
// subject and to both apply-batch + audit at once. Mirror behavior, not copies.

// Shared cliché / never-break-character substrings, checked for ALL subjects in
// BOTH v2 and legacy. Subject-specific extras (monster/anchor) live in POLICY.
const BASE_FORBIDDEN_PHRASES = [
  "let's dive in", "in conclusion", 'therefore, we can easily see',
  "let's break this down", 'delve', 'it is crucial to note',
  '1. The "Aha!" Moment', '2. Method 1: The Standard Approach',
  '3. Method 2: The 30-Second Trick', '3. Method 2: The Insight Shortcut',
  '4. Method 3: The Alternate Angle', 'The Aha Moment',
  '**The Smart Move**', '**Where Students Get Stuck**',
  // "Never break character" violations (chemistry-solution-workflow §🚫, 2026-06-11).
  'brutally capped', 'fantasy math', 'if the universe had no friction',
  'crush it down', 'truth-state', 'stored system key', 'legacy data mismatch',
  'recorded logic key', 'per recorded logic', 'my rigorous calculation',
  'to trap students', 'sitting right there as option',
];

const ALL_SECTION_ICONS = ['🧠', '🗺️', '⚡', '⚠️', '🖼️', '💡'];

// Per-subject policy. `v2AllowedIcons` = icons permitted even in v2 (physics keeps
// the figure anchor 🖼️). `extraForbidden` = substrings banned in addition to the
// base list, always. `v2BannedWords` = word-boundary bans applied only in v2.
const POLICY = {
  chemistry: { v2AllowedIcons: [],      extraForbidden: ['monster', 'anchor'], v2BannedWords: [] },
  math:      { v2AllowedIcons: [],      extraForbidden: ['monster', 'anchor'], v2BannedWords: [] },
  physics:   { v2AllowedIcons: ['🖼️'], extraForbidden: [],                    v2BannedWords: ['monster'] },
};

// Canonicalize ion charges inside \ce{...}: `^2+` → `^{2+}`. The renderer's \ce
// shim historically braced only the digit, dropping the sign to the baseline
// ("Mg²+" not "Mg²⁺"). Scoped to inside \ce{} (one nesting level) so plain math
// like `n^2+1` is never touched; single-sign (`^+`/`^-`) and already-braced
// (`^{2+}`) charges are left as-is. See memory: reference_ce_charge_bracing.
function normalizeCeCharges(md) {
  if (!md || typeof md !== 'string') return md;
  return md.replace(/\\ce\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_whole, inner) => {
    const fixed = inner.replace(/\^(\d+[+\-])/g, '^{$1}');
    return `\\ce{${fixed}}`;
  });
}

// validateSolution(md, opts) → string[] of issues (SOFT issues prefixed "SOFT:").
//   opts.format     — the batch item's `format` ('v2' | undefined). Legacy if absent.
//   opts.policy     — POLICY.chemistry | POLICY.math | POLICY.physics (defaults chemistry).
//   opts.autoDetect — audits pass true: when format is absent, treat a no-icon
//                     solution as v2 (so v2 docs aren't flagged for "missing icons").
//   opts.softLint   — emit the crammed-calc-step SOFT note (math apply-batch only).
function validateSolution(md, opts = {}) {
  const { format, policy = POLICY.chemistry, autoDetect = false, softLint = false } = opts;
  const issues = [];
  if (!md || typeof md !== 'string') return ['solution is empty or non-string'];

  // FORMAT v2 (teacher voice, no iconified headings) vs LEGACY 6-section. With an
  // explicit format that wins; for audits (autoDetect) a format-less doc with no
  // legacy icons is treated as v2.
  const isV2 = format === 'v2' || (autoDetect && format == null && !/\*\*(🧠|🗺️|⚡|⚠️)/.test(md));

  if (isV2) {
    for (const icon of ALL_SECTION_ICONS) {
      if (policy.v2AllowedIcons.includes(icon)) continue;
      if (md.includes(`**${icon}`)) {
        issues.push(`format:'v2' must not use the legacy **${icon}** section heading (prose + **Shortcut:**/**Watch out:** only)`);
      }
    }
    for (const word of (policy.v2BannedWords || [])) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(md)) issues.push(`forbidden v2 word: "${word}"`);
    }
    if (softLint) {
      const crammed = md.split('\n').filter(l => (l.match(/=/g) || []).length >= 4);
      if (crammed.length) {
        issues.push(`SOFT:possible crammed calc steps (${crammed.length} line(s) with 4+ '='; one step per line)`);
      }
    }
  } else {
    if (!/\*\*🧠/.test(md)) issues.push('missing 🧠 heading (Reading the Question)');
    if (!/\*\*🗺️/.test(md)) issues.push('missing 🗺️ heading (Working It Out)');
    if (!/\*\*⚡/.test(md)) issues.push('missing ⚡ heading (The Smart Move)');
    if (!/\*\*⚠️/.test(md)) issues.push('missing ⚠️ heading (Where Students Get Stuck)');
  }

  if (/^###\s/m.test(md)) issues.push('uses forbidden Markdown heading syntax (###); use **bold** lines instead');

  const tail = md.slice(-300);
  if (!/\\boxed\{/.test(tail)) issues.push('missing $\\boxed{...}$ at end');

  const dollarSingles = (md.match(/(?<!\$)\$(?!\$)/g) || []).length;
  if (dollarSingles % 2 !== 0) issues.push(`unbalanced $ delimiters (${dollarSingles})`);

  if (/\$\$/.test(md)) issues.push('uses forbidden $$ display math');

  const opens = (md.match(/\{/g) || []).length;
  const closes = (md.match(/\}/g) || []).length;
  if (opens !== closes) issues.push(`unbalanced braces (${opens} open vs ${closes} close)`);

  const lower = md.toLowerCase();
  for (const phrase of [...BASE_FORBIDDEN_PHRASES, ...(policy.extraForbidden || [])]) {
    if (lower.includes(phrase.toLowerCase())) issues.push(`forbidden phrase: "${phrase}"`);
  }

  if (/^\*{0,2}step\s+\d/im.test(md)) {
    issues.push('uses numbered "Step N" enumeration (workflow: prose only)');
  }

  return issues;
}

module.exports = { BASE_FORBIDDEN_PHRASES, POLICY, ALL_SECTION_ICONS, normalizeCeCharges, validateSolution };
