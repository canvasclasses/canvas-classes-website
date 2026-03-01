// ============================================
// LATEX VALIDATION UTILITY — Canvas-specific ruleset
// Enforces the rules in QUESTION_INGESTION_WORKFLOW.md
// ============================================

export interface LaTeXIssue {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  autoFixable: boolean;
  fixHint?: string;
}

export interface LaTeXValidationResult {
  isValid: boolean;
  errors: LaTeXIssue[];
  warnings: string[];
  fixableCount: number;
}

// ─── Canvas-specific forbidden patterns ───────────────────────────────────────

// Raw Unicode arrows/symbols that must be inside $...$
const RAW_ARROWS = /(?<!\$)[→←↔⇌⇒⇐↑↓](?![^$]*\$)/g;
// Raw → written as -> outside math
const RAW_TEXT_ARROW = /(?<!\$)(?<![\\-])->(?!\s*>)/g;

// ─── Core validator ───────────────────────────────────────────────────────────

export function validateLaTeX(text: string): LaTeXValidationResult {
  const errors: LaTeXIssue[] = [];
  const warnings: string[] = [];
  const lines = text.split('\n');

  // ── Pass 1: line-by-line checks ──────────────────────────────────────────
  lines.forEach((line, lineIndex) => {
    const ln = lineIndex + 1;

    // 1. $$ display math — FORBIDDEN in Canvas renderer
    if (/\$\$/.test(line)) {
      errors.push({
        line: ln, column: line.indexOf('$$'),
        message: '$$...$$ breaks the renderer — use $...$ only',
        severity: 'error', autoFixable: true,
        fixHint: 'Convert $$...$$ → $...$'
      });
    }

    // 2. \dfrac — renders oversized, always replace with \frac
    if (/\\dfrac/.test(line)) {
      errors.push({
        line: ln, column: line.indexOf('\\dfrac'),
        message: '\\dfrac causes oversized rendering — use \\frac',
        severity: 'error', autoFixable: true,
        fixHint: 'Replace \\dfrac → \\frac'
      });
    }

    // 3. Unmatched $ (odd count on line) — skip lines with $$
    if (!/\$\$/.test(line)) {
      const dollars = (line.match(/\$/g) || []).length;
      if (dollars % 2 !== 0) {
        errors.push({
          line: ln, column: line.lastIndexOf('$'),
          message: 'Unmatched $ — math mode not closed on this line',
          severity: 'error', autoFixable: false
        });
      }
    }

    // 4. Unmatched braces { }
    const openBraces = (line.match(/(?<!\\)\{/g) || []).length;
    const closeBraces = (line.match(/(?<!\\)\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        line: ln,
        column: openBraces > closeBraces ? line.lastIndexOf('{') : line.lastIndexOf('}'),
        message: `Unmatched braces: ${openBraces} { vs ${closeBraces} }`,
        severity: 'error', autoFixable: false
      });
    }

    // 5. \left without matching \right (per line)
    const leftCount = (line.match(/\\left/g) || []).length;
    const rightCount = (line.match(/\\right/g) || []).length;
    if (leftCount !== rightCount) {
      errors.push({
        line: ln, column: 0,
        message: `\\left/\\right mismatch: ${leftCount} \\left vs ${rightCount} \\right`,
        severity: 'error', autoFixable: false
      });
    }

    // 6. Raw Unicode arrows outside math
    const arrowMatch = line.match(RAW_ARROWS);
    if (arrowMatch) {
      errors.push({
        line: ln, column: 0,
        message: `Raw Unicode arrow "${arrowMatch[0]}" outside $...$  — use $\\rightarrow$ etc.`,
        severity: 'error', autoFixable: true,
        fixHint: 'Wrap arrows in $\\rightarrow$, $\\leftarrow$, $\\rightleftharpoons$'
      });
    }

    // 7. LaTeX command used outside $...$  (common: \frac, \ce outside delimiters)
    const outsideDollar = /(?<!\$)(?<![\\])(\\frac|\\sqrt|\\sum|\\int|\\lim|\\alpha|\\beta|\\gamma|\\delta|\\Delta|\\rightarrow|\\leftarrow|\\rightleftharpoons|\\pm|\\times|\\div)(?![^$]*\$)/.exec(line);
    if (outsideDollar) {
      errors.push({
        line: ln, column: outsideDollar.index,
        message: `LaTeX command "${outsideDollar[1]}" appears to be outside $...$`,
        severity: 'warning', autoFixable: false,
        fixHint: 'Wrap the expression in $...$'
      });
    }

    // 8. Empty critical commands
    if (/\\frac\{\s*\}\s*\{/.test(line)) {
      errors.push({ line: ln, column: line.indexOf('\\frac{}'), message: 'Empty \\frac{} numerator', severity: 'warning', autoFixable: false });
    }
    if (/\\ce\{\s*\}/.test(line)) {
      errors.push({ line: ln, column: line.indexOf('\\ce{}'), message: 'Empty \\ce{} — remove or fill', severity: 'warning', autoFixable: false });
    }

    // 9. Missing backslash on standalone math words (only inside $ context)
    const mathWordRegex = /\$[^$]*\b(frac|sqrt|sum|int|lim)\s*\{/g;
    let mwMatch;
    while ((mwMatch = mathWordRegex.exec(line)) !== null) {
      if (!mwMatch[0].includes('\\' + mwMatch[1])) {
        errors.push({
          line: ln, column: mwMatch.index,
          message: `Missing \\ before "${mwMatch[1]}" inside math`,
          severity: 'error', autoFixable: true,
          fixHint: `Add backslash: \\${mwMatch[1]}`
        });
      }
    }

    // 10. Canvas-specific: exam metadata embedded in question text
    if (/JEE Main|JEE Advanced|Shift[-\s]?(I|II|1|2)|Morning|Evening/.test(line)) {
      warnings.push(`Line ${ln}: Exam metadata in question text — remove (belongs in metadata.exam_source only)`);
    }
  });

  // ── Pass 2: whole-document checks ────────────────────────────────────────

  // 11. Chemical formula pattern without \ce{} (e.g. H2SO4, C6H12O6 outside ce)
  const chemPatterns = text.match(/(?<!\\ce\{)(?<!\w)\b[A-Z][a-z]?\d{1,2}(?:[A-Z][a-z]?\d*)*\b(?!\})/g);
  if (chemPatterns) {
    const uniqueChem = [...new Set(chemPatterns)].filter(f => f.length > 3);
    if (uniqueChem.length > 0) {
      warnings.push(`Possible chemical formulas without \\ce{}: ${uniqueChem.slice(0, 4).join(', ')} — wrap with $\\ce{...}$`);
    }
  }

  // 12. Raw -> used as reaction arrow outside math
  const rawArrowMatches = text.match(RAW_TEXT_ARROW);
  if (rawArrowMatches) {
    warnings.push(`Raw "->" found ${rawArrowMatches.length}x — use $\\rightarrow$ inside math`);
  }

  const fixableCount = errors.filter(e => e.autoFixable).length;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fixableCount
  };
}

// ─── Auto-fix engine ──────────────────────────────────────────────────────────

export interface AutoFixResult {
  text: string;
  fixesApplied: string[];
}

export function autoFixLatex(text: string): AutoFixResult {
  let fixed = text;
  const fixesApplied: string[] = [];

  // Fix 1: $$ display math → $ inline math
  // Handle $$...$$ by stripping one layer of $
  if (/\$\$/.test(fixed)) {
    fixed = fixed.replace(/\$\$([^$]*?)\$\$/g, '$$$1$$');
    // The above turns $$X$$ into $$X$$ incorrectly — do it properly:
    fixed = text;
    const displayMathRegex = /\$\$([^]*?)\$\$/g;
    const displayMatches = [...text.matchAll(displayMathRegex)];
    if (displayMatches.length > 0) {
      fixed = text.replace(displayMathRegex, (_match, inner) => `$${inner.trim()}$`);
      fixesApplied.push(`Converted ${displayMatches.length} $$...$$ → $...$`);
    }
  }

  // Fix 2: \dfrac → \frac
  const dfracCount = (fixed.match(/\\dfrac/g) || []).length;
  if (dfracCount > 0) {
    fixed = fixed.replace(/\\dfrac/g, '\\frac');
    fixesApplied.push(`Replaced ${dfracCount} \\dfrac → \\frac`);
  }

  // Fix 3: Spacing around $ delimiters ($ x $ → $x$)
  const spacedDollarCount = (fixed.match(/\$\s+|\s+\$/g) || []).length;
  if (spacedDollarCount > 0) {
    fixed = fixed.replace(/\$\s+/g, '$');
    fixed = fixed.replace(/\s+\$/g, '$');
    fixesApplied.push('Removed extra spaces around $ delimiters');
  }

  // Fix 4: \frac spacing (\\frac  { → \frac{)
  if (/\\frac\s+\{/.test(fixed)) {
    fixed = fixed.replace(/\\frac\s+\{/g, '\\frac{');
    fixesApplied.push('Fixed spacing in \\frac{ commands');
  }

  // Fix 5: Unicode arrow → LaTeX arrow (inside or outside $)
  const unicodeArrowMap: Record<string, string> = {
    '→': '\\rightarrow',
    '←': '\\leftarrow',
    '↔': '\\leftrightarrow',
    '⇌': '\\rightleftharpoons',
    '⇒': '\\Rightarrow',
    '⇐': '\\Leftarrow',
    '↑': '\\uparrow',
    '↓': '\\downarrow',
  };
  let arrowCount = 0;
  for (const [unicode, latex] of Object.entries(unicodeArrowMap)) {
    const count = (fixed.split(unicode).length - 1);
    if (count > 0) {
      // Wrap in $...$ if not already in math
      fixed = fixed.replace(new RegExp(unicode, 'g'), `$${latex}$`);
      arrowCount += count;
    }
  }
  if (arrowCount > 0) {
    fixesApplied.push(`Converted ${arrowCount} Unicode arrow(s) → LaTeX $\\rightarrow$ etc.`);
  }

  // Fix 6: Collapse double $ that may appear from previous fixes ($$x$$ → $x$)
  // After fix 1 and 5 we might have $$ sequences
  fixed = fixed.replace(/\$\$([^$]+)\$\$/g, '$$$1$$');
  // Actually properly clean: remove consecutive single $$ that wrap nothing
  fixed = fixed.replace(/\$\s*\$/g, '');

  return { text: fixed, fixesApplied };
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

export function getLatexSuggestions(text: string): string[] {
  const suggestions: string[] = [];

  if (/[A-Z][a-z]?\d+/.test(text) && !text.includes('\\ce{')) {
    suggestions.push('Wrap chemical formulas with $\\ce{H2SO4}$ for correct rendering');
  }
  if (/\$[^$]*[a-z]{4,}[^$]*\$/.test(text) && !text.includes('\\text{')) {
    suggestions.push('Use \\text{} for words inside math: $\\text{mol}$');
  }
  if (/\d+°/.test(text)) {
    suggestions.push('Temperature: use $25\\,°C$ (with \\, thin space before °)');
  }

  return suggestions;
}

// ─── Extract expressions (used by export renderer) ────────────────────────────

export function extractLatexExpressions(text: string): Array<{ type: 'inline' | 'display', content: string, start: number, end: number }> {
  const expressions: Array<{ type: 'inline' | 'display', content: string, start: number, end: number }> = [];
  let match;

  const inlineRegex = /\$([^$]+)\$/g;
  while ((match = inlineRegex.exec(text)) !== null) {
    expressions.push({ type: 'inline', content: match[1], start: match.index, end: match.index + match[0].length });
  }

  return expressions.sort((a, b) => a.start - b.start);
}
