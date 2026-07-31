'use strict';
/**
 * Flags NCERT-exercise text fields (prompt / answer / solution / explanation /
 * options) that contain chemical formulas, isotope notation, or unit / scientific
 * -notation exponents OUTSIDE $...$ math mode.
 *
 * WHY: the reader only converts text inside $...$ (remark-math + rehype-katex,
 * see packages/book-renderer/blocks/_katexConfig.ts) — anything outside renders
 * as literal characters. "m-2" stays "m-2" instead of becoming m⁻², "H2O" stays
 * "H2O" instead of H₂O. Every `prompt` field in ch1.js had exactly this bug
 * (found + fixed 2026-07-22) while the matching `solution` field for the same
 * question was correctly wrapped all along — so this check exists to make that
 * class of bug impossible to push through the sanctioned pipeline again. See
 * CONTRACT.md Rule 1.
 *
 * Used by validate_practice.mts and insert_practice_pages.js (both hard-fail
 * on a non-empty result) — this is deliberately code enforcement, not just a
 * documented convention.
 */

// Strip $...$ / \(...\) math spans first — anything inside is already LaTeX
// and is exempt (e.g. isotope notation written correctly as $\ce{^{35}Cl}$).
function stripMath(text) {
  return text.replace(/\$[^$]*\$/g, ' ').replace(/\\\([^)]*\\\)/g, ' ');
}

// Whitelisted unit abbreviations only — NOT a generic 1-4-letter wildcard,
// which false-positives on ordinary hyphenated prose ("post-2019", "step-1").
const UNITS = 'mol|atm|torr|Torr|kJ|kPa|MPa|kg|mg|ng|pg|mL|dL|cm|mm|nm|pm|dm|min|hr|Hz|IU|ppm|m|g|s|N|J|K|L|Pa';
const UNIT_EXPONENT = new RegExp(`\\b(?:${UNITS})-\\d+\\b`, 'g'); // m-2, cm-2, mol-1, mL-1, s-1
const CARET_EXPONENT = /\d+\^-?\d+/g; // 10^6, 10^-15
// Isotope mass-number prefix (35Cl, 12C, 238U). Requires >=2 digits — a single
// digit is almost always a stoichiometric coefficient (2K, 3Fe), not a mass
// number. Trailing K/M excluded — in this corpus they are overwhelmingly
// Kelvin/molarity ("298K", "01M"), not the elements potassium/? (M isn't even
// an element symbol). If a genuine K-isotope question is ever authored, wrap
// it by hand and it'll still pass (this check only flags UNwrapped text).
const ISOTOPE_PREFIX = /\b\d{2,3}(?!K\b|M\b)[A-Z][a-z]?\b/g;
const FORMULA_TOKEN = /\b[A-Z][A-Za-z0-9]*\d[A-Za-z0-9]*\b/g; // H2O, CO2, Na2SO4, CH3COONa

// Known false-positive tokens that otherwise match FORMULA_TOKEN/UNIT_EXPONENT
// but are not chemistry/unit notation — e.g. an in-solution cross-reference
// like "Q6". Extend this list for verified-safe cases; don't loosen the regexes.
const DENYLIST = new Set(['Q6']);

function findUnwrappedLatex(text) {
  if (typeof text !== 'string' || !text) return [];
  const stripped = stripMath(text);
  const hits = new Set();
  for (const re of [UNIT_EXPONENT, CARET_EXPONENT, ISOTOPE_PREFIX, FORMULA_TOKEN]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(stripped))) {
      if (!DENYLIST.has(m[0])) hits.add(m[0]);
    }
  }
  return [...hits];
}

// Walks one practice_bank block's items; returns [{id, source_label, field, hits}]
function checkPracticeBank(pb) {
  const problems = [];
  for (const sec of pb.sections || []) {
    for (const item of sec.items || []) {
      const fields = { prompt: item.prompt };
      if (item.kind === 'mcq') {
        fields.explanation = item.explanation;
        (item.options || []).forEach((o, i) => { fields[`options[${i}]`] = o; });
      } else {
        fields.answer = item.answer;
        fields.solution = item.solution;
      }
      for (const [field, value] of Object.entries(fields)) {
        const hits = findUnwrappedLatex(value);
        if (hits.length) problems.push({ id: item.id, source_label: item.source_label, field, hits });
      }
    }
  }
  return problems;
}

module.exports = { findUnwrappedLatex, checkPracticeBank, stripMath };
