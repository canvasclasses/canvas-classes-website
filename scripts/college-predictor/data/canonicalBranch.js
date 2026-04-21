/**
 * Canonical branch name derivation.
 *
 * Given a JoSAA "Academic Program Name" string like
 *   "Computer Science and Engineering (5 Years, Bachelor and Master of Technology (Dual Degree))"
 * return a stable { short_name, clean_name, degree, duration } regardless of
 * how that program was labelled in a given year's CSV.
 *
 * Design constraints (learned from real data):
 *   1. Specialized programs (e.g. "Computer Science and Engineering (Artificial
 *      Intelligence & Data Science)") must NOT collapse into the mainline
 *      program — they have separate seats and cutoffs. We preserve the
 *      specialization in both clean_name and short_name.
 *   2. Degree/year descriptors ("(4 Years, Bachelor of Technology)") are NOT
 *      program identity — strip them.
 *   3. Nested parens like "(5 Years, Bachelor and Master of Technology (Dual
 *      Degree))" must be handled — the original naive regex only stripped the
 *      innermost last paren block.
 *   4. 4-year and 5-year dual-degree tracks of the same subject are SEPARATE
 *      programs (different seats, different cutoffs) — distinguish with " [5Y]".
 *   5. Source CSVs rename programs silently across years (e.g. NIT Kurukshetra:
 *      "Computer Engineering" in 2022 → "Computer Science and Engineering" in
 *      2024). The BASE_SYNONYMS table handles these 1:1 renames.
 */

// ── 1:1 base-name renames. Keep this table tight — any broad synonym risks
// merging distinct programs. Only add entries when a rename is unambiguous
// across ALL colleges that use the source name.
const BASE_SYNONYMS = {
  'computer engineering': 'Computer Science and Engineering',
  'computer science': 'Computer Science and Engineering',
  'computer science & engineering': 'Computer Science and Engineering',

  'electronics & communication engineering': 'Electronics and Communication Engineering',
  'electronics and communication': 'Electronics and Communication Engineering',

  'electrical': 'Electrical Engineering',
  'electrical & electronics engineering': 'Electrical and Electronics Engineering',

  'mechanical': 'Mechanical Engineering',
  'civil': 'Civil Engineering',
  'chemical': 'Chemical Engineering',
  'aerospace': 'Aerospace Engineering',
  'mining': 'Mining Engineering',
  'metallurgical': 'Metallurgical and Materials Engineering',
  'ceramic': 'Ceramic Engineering',
  'textile': 'Textile Technology',

  'metallurgy engineering': 'Metallurgical and Materials Engineering',
  'metallurgical & materials engineering': 'Metallurgical and Materials Engineering',
  'materials science and engineering': 'Metallurgical and Materials Engineering',

  'artificial intelligence & machine learning': 'Artificial Intelligence and Machine Learning',
  'artificial intelligence & data science': 'Artificial Intelligence and Data Science',

  'microelectronics & vlsi engineering': 'Microelectronics and VLSI Engineering',
  'microelectronics & vlsi': 'Microelectronics and VLSI Engineering',

  'robotics & automation': 'Robotics and Automation',
  'mathematics & computing': 'Mathematics and Computing',

  'biotechnology and biochemical engineering': 'Biotechnology',
  'industrial and production engineering': 'Production and Industrial Engineering',
  'industrial engineering': 'Production and Industrial Engineering',

  'architecture and planning': 'Architecture',
  'bachelor of architecture': 'Architecture',
  'bachelor of planning': 'Planning',
};

// ── Abbrev table (canonical full base name → short). Only the "clean" base
// name (without specialization/degree) is looked up here.
const ABBREV = {
  'Computer Science and Engineering': 'CSE',
  'Electronics and Communication Engineering': 'ECE',
  'Electrical Engineering': 'EE',
  'Electrical and Electronics Engineering': 'EEE',
  'Electronics and Instrumentation Engineering': 'EIE',
  'Mechanical Engineering': 'ME',
  'Civil Engineering': 'CE',
  'Chemical Engineering': 'CHE',
  'Metallurgical and Materials Engineering': 'MME',
  'Aerospace Engineering': 'AE',
  'Biotechnology': 'BT',
  'Production and Industrial Engineering': 'PIE',
  'Information Technology': 'IT',
  'Artificial Intelligence': 'AI',
  'Artificial Intelligence and Machine Learning': 'AI & ML',
  'Artificial Intelligence and Data Science': 'AI & DS',
  'Data Science and Engineering': 'DSE',
  'Mining Engineering': 'MIN',
  'Mathematics and Computing': 'M&C',
  'Engineering Physics': 'EP',
  'Textile Technology': 'TT',
  'Ceramic Engineering': 'CER',
  'Microelectronics and VLSI Engineering': 'VLSI',
  'Robotics and Automation': 'R&A',
  'Industrial Internet of Things': 'IIoT',
  'Sustainable Energy Technologies': 'SET',
  'Architecture': 'B.Arch',
  'Planning': 'B.Plan',
};

// ── Common specialization shortenings (append-only). Anything not in this map
// is kept verbatim in the short_name suffix.
const SPEC_SHORTENINGS = {
  'artificial intelligence and data science': 'AI & DS',
  'artificial intelligence & data science': 'AI & DS',
  'artificial intelligence and machine learning': 'AI & ML',
  'artificial intelligence & machine learning': 'AI & ML',
  'artificial intelligence': 'AI',
  'data science': 'DS',
  'cyber security': 'Cyber',
  'cyber physical system': 'CPS',
  'vlsi and embedded systems': 'VLSI-Emb',
};

const DEGREE_HINTS = [
  { rx: /Bachelor and Master of Technology|B\. ?Tech\.? \+ M\. ?Tech\.?/i, degree: 'B.Tech + M.Tech', duration: 5 },
  { rx: /Dual Degree/i, degree: 'Dual Degree', duration: 5 },
  { rx: /Integrated M\.?\s*Tech/i, degree: 'Int. M.Tech', duration: 5 },
  { rx: /Integrated M\.?\s*Sc/i, degree: 'Int. M.Sc.', duration: 5 },
  { rx: /Bachelor of Architecture/i, degree: 'B.Arch', duration: 5 },
  { rx: /Bachelor of Planning/i, degree: 'B.Plan', duration: 4 },
  { rx: /Bachelor of Technology/i, degree: 'B.Tech', duration: 4 },
];

// A paren block looks like a DEGREE descriptor if it mentions years, degree
// types, or "Hons" / "Dual Degree". Otherwise it's a specialization.
const DEGREE_TOKEN_RX = /\b(Years?|Bachelor|Master|Dual Degree|Integrated|Hons\.?|B\.? ?Tech|B\.? ?Arch|B\.? ?Plan|M\.? ?Tech|M\.? ?Sc|MBA|Flexible Academic Program)\b/i;

function normalizeWS(s) {
  return s.replace(/\s+/g, ' ').trim();
}

// Find all top-level (balanced) paren blocks and return an array of
// { start, end, inner, outer } entries along with the plain text between them.
function tokenizeParenBlocks(s) {
  const tokens = []; // sequence of { type: 'text' | 'paren', value }
  let i = 0;
  let textStart = 0;
  while (i < s.length) {
    if (s[i] === '(') {
      if (i > textStart) tokens.push({ type: 'text', value: s.slice(textStart, i) });
      let depth = 1;
      let j = i + 1;
      while (j < s.length && depth > 0) {
        if (s[j] === '(') depth++;
        else if (s[j] === ')') depth--;
        j++;
      }
      tokens.push({ type: 'paren', value: s.slice(i + 1, j - 1), outer: s.slice(i, j) });
      i = j;
      textStart = j;
    } else {
      i++;
    }
  }
  if (textStart < s.length) tokens.push({ type: 'text', value: s.slice(textStart) });
  return tokens;
}

function toTitleCase(s) {
  return s
    .split(' ')
    .map((w, idx) => {
      if (!w) return w;
      // Preserve short acronyms ALL-CAPS (len <=4)
      if (w.length <= 4 && w === w.toUpperCase() && /[A-Z]/.test(w)) return w;
      if (/^(of|and|the|in|for|with|to|a|an|&)$/i.test(w) && idx > 0) return w.toLowerCase();
      // Preserve dotted abbrevs (B.Tech, M.Sc, Pvt., etc.) — don't lowercase mid-word letters.
      if (/\./.test(w)) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function fallbackShort(full) {
  return normalizeWS(full.replace(/\s+Engineering\b/i, '')).trim();
}

function shortenSpec(spec) {
  const k = spec.trim().toLowerCase().replace(/\s+/g, ' ');
  return SPEC_SHORTENINGS[k] ?? toTitleCase(spec.trim());
}

/**
 * @param {string} rawProgram
 * @returns {{short_name: string, clean_name: string, degree: string, duration: number}}
 */
function canonicalBranch(rawProgram) {
  const raw = String(rawProgram || '').trim();
  if (!raw) return { short_name: 'UNKNOWN', clean_name: '', degree: 'B.Tech', duration: 4 };

  // 1. Pull out paren tokens in order.
  const tokens = tokenizeParenBlocks(raw);
  let baseText = '';
  const specParts = [];
  for (const t of tokens) {
    if (t.type === 'text') {
      baseText += t.value;
    } else {
      // Paren block: is it a degree descriptor or a specialization?
      if (DEGREE_TOKEN_RX.test(t.value)) {
        // Degree descriptor — drop entirely.
      } else {
        // Specialization — capture it.
        specParts.push(t.value.trim());
      }
    }
  }
  baseText = normalizeWS(baseText);
  // Strip program-prefix noise that leaks in from some CSVs:
  //   "B.Tech in X", "Bachelor of Technology in X", "Integrated B.Tech - M.Tech in X", etc.
  baseText = baseText.replace(
    /^(Integrated\s+)?(B\.?\s*Tech\.?|Bachelor of Technology|B\.?\s*Sc\.?|M\.?\s*Tech\.?|B\.?\s*Tech\.?\s*[-–]\s*M\.?\s*Tech\.?)\s*(\.\s*)?(and\s+M\.?\s*Tech\.?\s+)?in\s+/i,
    '',
  ).trim();

  // Convert " with Specialization in X" suffix into a specialization.
  const specSuffixMatch = baseText.match(/^(.*?)\s+with\s+Specialization\s+in\s+(.+)$/i);
  if (specSuffixMatch) {
    baseText = specSuffixMatch[1].trim();
    specParts.unshift(specSuffixMatch[2].trim());
  }

  // Trim dangling connectors ("Computer Science and" that came from old parser mangling).
  baseText = baseText.replace(/\s*(and|&|with|in|-)\s*$/i, '').trim();

  // 2. Base synonym lookup.
  const baseKey = baseText.toLowerCase();
  const baseClean = BASE_SYNONYMS[baseKey] ?? toTitleCase(baseText);

  // 3. Abbrev lookup for the base.
  const baseShort = ABBREV[baseClean] ?? fallbackShort(baseClean);

  // 4. Handle specializations (non-degree parens).
  let shortName = baseShort;
  let cleanName = baseClean;
  if (specParts.length > 0) {
    const specClean = specParts.map(toTitleCase).join(' / ');
    cleanName = `${baseClean} (${specClean})`;
    const specShort = specParts.map(shortenSpec).join('/');
    shortName = `${baseShort} (${specShort})`;
  }

  // 5. Degree/duration from the ORIGINAL string.
  const hit = DEGREE_HINTS.find((h) => h.rx.test(raw));
  const degree = hit ? hit.degree : 'B.Tech';
  const duration = hit ? hit.duration : 4;

  // 6. 5-year dual-degree / integrated programs are distinct admission tracks;
  //    disambiguate in the short_name. Arch/Plan already have their own base.
  const isArchOrPlan = degree === 'B.Arch' || degree === 'B.Plan';
  const needsSuffix = !isArchOrPlan &&
    (duration !== 4 || degree === 'Dual Degree' || degree === 'B.Tech + M.Tech' || /^Int\./.test(degree));
  if (needsSuffix) shortName = `${shortName} [5Y]`;

  return { short_name: shortName, clean_name: cleanName, degree, duration };
}

module.exports = { canonicalBranch, ABBREV, BASE_SYNONYMS };
