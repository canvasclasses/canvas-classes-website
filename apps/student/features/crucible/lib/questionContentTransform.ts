/**
 * Pure string transforms that prepare `questions_v2` markdown for the
 * server-renderable ReactMarkdown + remark-math + rehype-katex (+ mhchem)
 * path used by QuestionContent.tsx.
 *
 * WHY THIS EXISTS (QUESTION_LIBRARY_SPEC Phase A.2, 2026-07-18):
 * The legacy renderer (`packages/ui/MathRenderer.tsx`) builds its output in a
 * `useEffect` → `innerHTML`, so the server HTML ships EMPTY divs — invisible
 * to Google/AI crawlers. That renderer also accumulated ~200 lines of
 * compensation for DB-content quirks. This module ports the *pure string*
 * portion of those repairs so the ReactMarkdown path renders the same
 * content — but in SSR HTML.
 *
 * Differences from MathRenderer, on purpose:
 * - Braced `\ce{...}` is left UNTOUCHED. MathRenderer downgraded it to
 *   `\mathrm{...}` because its KaTeX had no mhchem; the new path imports
 *   `katex/contrib/mhchem`, which renders `\ce{}` natively (and better:
 *   real arrows, `->[\Delta]` annotations, charge stacking). §4 of CLAUDE.md
 *   lists `\ce{H2SO4}` as the canonical authoring form — we now honour it.
 * - Brace-less `\ce` (ingestion bug, e.g. `$\ceCH4$`) is repaired by adding
 *   braces (`$\ce{CH4}$`) and letting mhchem do the chemistry, instead of
 *   hand-building subscripts with `_{...}`.
 * - MTC pseudo-tables are converted to GFM PIPE tables (ReactMarkdown
 *   escapes raw HTML, so MathRenderer's `<table>` synthesis can't be used).
 *
 * PURE — no I/O, no React, no DOM. Unit-testable with plain node.
 */

/** Main entry: apply all repairs in the required order. */
export function prepareQuestionMarkdown(raw: string): string {
  if (!raw) return '';
  let text = raw;
  text = repairBracelessCe(text);
  text = fixCaretStarInsideMath(text);
  text = mtcPseudoTablesToPipes(text);
  return text;
}

/**
 * Brace-less `\ce` repair (port of MathRenderer.tsx:49-54).
 * Defends against ingestion bugs that dropped the braces (`$\ceCH4$`,
 * `$\ceCa^{2+}$`). Rules preserved from the original:
 * - `\ce` MUST be immediately followed by [A-Z] (no whitespace) — otherwise
 *   `\ce Hello` (stray `\ce ` before English text) would get wrapped.
 * - The capture consumes trailing brace groups (`Ca^{2+}`, `Fe_{3}`) so ions
 *   and isotopes don't get clipped at the brace.
 * - Already-braced `\ce{...}` is untouched (lookahead fails on `{`).
 */
function repairBracelessCe(text: string): string {
  return text.replace(
    /\\ce(?=[A-Z])([A-Za-z][A-Za-z0-9^_+\-]*(?:\{[^}]+\})*)/g,
    (_m: string, formula: string) => `\\ce{${formula}}`
  );
}

/**
 * Normalise `^*` → `^{*}` inside math spans only (port of
 * MathRenderer.tsx:74,:81) so MO configurations (σ*, π*) render correctly.
 * Restricted to `$...$` / `$$...$$` spans so prose asterisks are untouched.
 * Single alternation with the `$$` branch FIRST so the inline branch can
 * never bite into a display block.
 */
function fixCaretStarInsideMath(text: string): string {
  return text.replace(
    /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g,
    (span: string) => span.replace(/\^\*/g, '^{*}')
  );
}

/** Escape pipes inside a cell so GFM table parsing survives `|x|` in math. */
function cell(s: string): string {
  return s.replace(/\|/g, '\\|').trim();
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

function buildPipeTable(h1: string, h2: string, rowsI: string[], rowsII: string[]): string {
  const count = Math.max(rowsI.length, rowsII.length);
  const lines = [
    `| | ${cell(h1)} | | ${cell(h2)} |`,
    '| --- | --- | --- | --- |',
  ];
  for (let i = 0; i < count; i++) {
    lines.push(`| ${LETTERS[i] ?? ''} | ${cell(rowsI[i] ?? '')} | ${NUMERALS[i] ?? ''} | ${cell(rowsII[i] ?? '')} |`);
  }
  // Blank lines around the table = block boundary for the markdown parser.
  return `\n\n${lines.join('\n')}\n\n`;
}

/**
 * Convert non-pipe-table Match-The-Column markdown into GFM pipe tables
 * (port of MathRenderer.tsx processNonTableMTC:139-183; output format
 * changed from raw <table> HTML to pipe tables — see file header).
 * Handles the two formats found in the DB:
 *   Multiline:  **List I:**\nA. item\nB. item\n\n**List II:**\nI. item\n...
 *   Inline:     **List I (label):** A. item B. item **List II (label):** I. item ...
 */
function mtcPseudoTablesToPipes(text: string): string {
  // ── Multiline format ──────────────────────────────────────────────────────
  // Deviation from the MathRenderer original: the header→items separator is
  // `[^\S\n]*\n\s*` (MUST contain a newline), not `[\s\n]+`. The original's
  // any-whitespace separator let this regex swallow single-line INLINE inputs
  // ("**List I:** A. x B. y **List II:** …") as a one-item-per-list match,
  // mangling them into 1-row tables and dead-lettering the inline handler
  // below. Requiring a real newline routes each format to its own handler
  // (verified: scratchpad/test_transform.mjs).
  text = text.replace(
    /(\*\*List I([^*]*)\*\*:?)[^\S\n]*\n\s*((?:[A-Da-d][.)][^\n]+\n?)+)[\s\n]*(\*\*List II([^*]*)\*\*:?)[^\S\n]*\n\s*((?:[IVXivx]+[.)][^\n]+\n?)+)/g,
    (_m: string, _h1raw: string, h1label: string, listI: string, _h2raw: string, h2label: string, listII: string) => {
      const h1 = `List I${h1label.trim() ? ' ' + h1label.trim() : ''}`;
      const h2 = `List II${h2label.trim() ? ' ' + h2label.trim() : ''}`;
      const rowsI = listI.trim().split('\n').map((l: string) => l.replace(/^[A-Da-d][.)\s]+/, '').trim()).filter(Boolean);
      const rowsII = listII.trim().split('\n').map((l: string) => l.replace(/^[IVXivx]+[.)\s]+/, '').trim()).filter(Boolean);
      return buildPipeTable(h1, h2, rowsI, rowsII);
    }
  );

  // ── Inline format ─────────────────────────────────────────────────────────
  text = text.replace(
    /(\*\*List I([^*]*)\*\*:?)\s+((?:[A-Da-d][.)][^*]+?)+)(\*\*List II([^*]*)\*\*:?)\s+((?:[IVXivx]+[.)]\s*[^\n*]+)+)/g,
    (_m: string, _h1: string, h1label: string, listI: string, _h2: string, h2label: string, listII: string) => {
      const h1 = `List I${h1label.trim() ? ' ' + h1label.trim() : ''}`;
      const h2 = `List II${h2label.trim() ? ' ' + h2label.trim() : ''}`;
      const rowsI = listI.trim().split(/(?=[A-Da-d][.)])/).map((l: string) => l.replace(/^[A-Da-d][.)\s]+/, '').trim()).filter(Boolean);
      const rowsII = listII.trim().split(/(?=[IVXivx]+[.)])/).map((l: string) => l.replace(/^[IVXivx]+[.)\s]+/, '').trim()).filter(Boolean);
      return buildPipeTable(h1, h2, rowsI, rowsII);
    }
  );

  return text;
}
