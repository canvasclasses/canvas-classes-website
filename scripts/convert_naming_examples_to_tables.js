'use strict';
/**
 * Converts the "Working through each" part-by-part breakdown in the two
 * nomenclature worked_example blocks (on 'additional-practice-beyond-ncert')
 * from a long "(a) ..., (b) ..." paragraph list into a GFM markdown table —
 * founder feedback 2026-07-24: the paragraph list looked cluttered.
 *
 * This required a companion engine change first: WorkedExampleRenderer.tsx
 * didn't have any table styling wired in (react-markdown's default <table>
 * is unstyled and unreadable on the dark background) — added the same
 * responsive-table pattern already used by CalloutBlockRenderer's
 * RememberCallout (packages/book-renderer/blocks/_responsiveTable.tsx),
 * which benefits every worked_example block platform-wide, not just this
 * page.
 *
 * Only the "Working through each:" ... up to "**Why this matters:**" span
 * is replaced in each block's `solution` string — the technique bullets
 * above it and the closing line after it are untouched. Purely a content
 * edit via book-writer.savePage (versioned). Idempotent: skips a block if
 * its solution already contains a markdown table.
 * Run: node scripts/convert_naming_examples_to_tables.js
 */
const bw = require('./lib/book-writer');

const SLUG = 'additional-practice-beyond-ncert';

const TABLE_1 = // "Writing Formulas from Names"
  '| Part | Name | Formula | Why |\n' +
  '|---|---|---|---|\n' +
  '| (a) | potassium nitrate | $\\ce{KNO3}$ | $\\ce{K+}$ + $\\ce{NO3-}$, both charge 1, no crossing needed |\n' +
  '| (b) | calcium carbonate | $\\ce{CaCO3}$ | $\\ce{Ca^{2+}}$ + $\\ce{CO3^{2-}}$, charges already match |\n' +
  '| (c) | cobalt(II) phosphate | $\\ce{Co3(PO4)2}$ | crossing $\\ce{Co^{2+}}$ and $\\ce{PO4^{3-}}$ gives 3 Co, 2 phosphate |\n' +
  '| (d) | magnesium sulfite | $\\ce{MgSO3}$ | $\\ce{Mg^{2+}}$ + $\\ce{SO3^{2-}}$, charges match |\n' +
  '| (e) | iron(III) bromide | $\\ce{FeBr3}$ | (III) gives $\\ce{Fe^{3+}}$; needs three $\\ce{Br-}$ |\n' +
  '| (f) | magnesium nitride | $\\ce{Mg3N2}$ | crossing $\\ce{Mg^{2+}}$ and $\\ce{N^{3-}}$ gives 3 Mg, 2 N |\n' +
  '| (g) | aluminum selenide | $\\ce{Al2Se3}$ | crossing $\\ce{Al^{3+}}$ and $\\ce{Se^{2-}}$ gives 2 Al, 3 Se |\n' +
  '| (h) | copper(II) perchlorate | $\\ce{Cu(ClO4)2}$ | (II) gives $\\ce{Cu^{2+}}$; perchlorate is $\\ce{ClO4-}$, so two of them |\n' +
  "| (i) | bromine pentafluoride | $\\ce{BrF5}$ | 'penta' is the giveaway; no crossing for covalent names |\n" +
  "| (j) | dinitrogen pentaoxide | $\\ce{N2O5}$ | 'dinitrogen' = $\\ce{N2}$, 'pentaoxide' = $\\ce{O5}$ |\n" +
  '| (k) | strontium acetate | $\\ce{Sr(C2H3O2)2}$ | acetate is $\\ce{C2H3O2-}$ (charge 1); $\\ce{Sr^{2+}}$ needs two of them |\n' +
  '| (l) | ammonium dichromate | $\\ce{(NH4)2Cr2O7}$ | ammonium $\\ce{NH4+}$ (charge 1) with dichromate $\\ce{Cr2O7^{2-}}$ (charge 2) needs two ammonium |\n' +
  '| (m) | copper(I) sulfide | $\\ce{Cu2S}$ | (I) gives $\\ce{Cu+}$; sulfide is $\\ce{S^{2-}}$, so two Cu |';

const TABLE_2 = // "Reading Names from Formulas"
  '| Part | Formula | Name | Why |\n' +
  '|---|---|---|---|\n' +
  '| (a) | $\\ce{NaClO3}$ | sodium chlorate | $\\ce{ClO3-}$ is chlorate |\n' +
  '| (b) | $\\ce{Ca3(PO4)2}$ | calcium phosphate | Ca is Group 2, no Roman numeral needed |\n' +
  "| (c) | $\\ce{NaMnO4}$ | sodium permanganate | $\\ce{MnO4-}$ is the permanganate ion — Mn's charge is fixed by the ion name itself, not a separate Roman numeral |\n" +
  '| (d) | $\\ce{AlP}$ | aluminum phosphide | Al only ever forms $\\ce{Al^{3+}}$; $\\ce{P^{3-}}$ is phosphide |\n' +
  '| (e) | $\\ce{ICl3}$ | iodine trichloride | two non-metals — prefixes, not charges |\n' +
  '| (f) | $\\ce{PCl3}$ | phosphorus trichloride | two non-metals — prefixes, not charges |\n' +
  '| (g) | $\\ce{K2CrO4}$ | potassium chromate | $\\ce{CrO4^{2-}}$ is chromate; two $\\ce{K+}$ balance it |\n' +
  '| (h) | $\\ce{Ca(CN)2}$ | calcium cyanide | $\\ce{CN-}$ is cyanide |\n' +
  '| (i) | $\\ce{MnCl2}$ | manganese(II) chloride | two $\\ce{Cl-}$ (charge $-1$ each) means Mn must be $+2$ to stay neutral — that is where the Roman numeral comes from |\n' +
  '| (j) | $\\ce{NaNO2}$ | sodium nitrite | $\\ce{NO2-}$ is nitrite — one oxygen fewer than nitrate, $\\ce{NO3-}$ |\n' +
  '| (k) | $\\ce{Fe(NO3)2}$ | iron(II) nitrate | two nitrate ions (each $-1$) means Fe must be $+2$ |';

const REPLACEMENTS = [
  { label: 'Example — Naming Technique: Writing Formulas from Names', table: TABLE_1 },
  { label: 'Example — Naming Technique: Reading Names from Formulas', table: TABLE_2 },
];

function replaceWorkingThroughSection(solution, table) {
  const startMarker = '**Working through each:**';
  const endMarker = '**Why this matters:**';
  const startIdx = solution.indexOf(startMarker);
  const endIdx = solution.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error('could not locate the "Working through each" span — markers not found as expected');
  }
  const before = solution.slice(0, startIdx);
  const after = solution.slice(endIdx);
  return `${before}${startMarker}\n\n${table}\n\n${after}`;
}

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    let changed = false;
    const newBlocks = cur.blocks.map((b) => {
      const target = REPLACEMENTS.find((r) => r.label === b.label);
      if (!target) return b;
      if (/^\|/m.test(b.solution)) { console.log('already a table — skipping (idempotent):', b.label); return b; }
      changed = true;
      return { ...b, solution: replaceWorkingThroughSection(b.solution, target.table) };
    });

    if (!changed) { console.log('nothing to change — both blocks already converted.'); return; }

    const res = await bw.savePage(db, { slug: SLUG }, newBlocks, {
      author: 'agent',
      summary: 'Converted the "Working through each" part-by-part breakdown in the two nomenclature worked ' +
        'examples from a paragraph list into a GFM markdown table (founder feedback: too cluttered) — required ' +
        'wiring responsive table styling into WorkedExampleRenderer.tsx first, which now benefits every worked ' +
        'example platform-wide.',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· lossDetected:', res.diff.lossDetected);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
