require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// For each match-list question without a table, provide the corrected question_text.markdown
// with a proper markdown table inserted after List-I and List-II items.

const QUESTION_FIXES = {

'PERI-005': `Match List-I (Atomic number) with List-II (Block of periodic table):

**List-I:** (A) 37, (B) 78, (C) 52, (D) 65

**List-II:** I. p-block, II. d-block, III. f-block, IV. s-block

| List-I (Atomic number) | List-II (Block) |
|------------------------|-----------------|
| (A) 37 | (I) p-block |
| (B) 78 | (II) d-block |
| (C) 52 | (III) f-block |
| (D) 65 | (IV) s-block |

Choose the correct answer from the options given below:`,

'PERI-069': `Match List-I with List-II:

(A) $\\mathrm{Cl_2O_7}$, (B) $\\mathrm{Na_2O}$, (C) $\\mathrm{Al_2O_3}$, (D) $\\mathrm{N_2O}$

(I) Amphoteric, (II) Basic, (III) Neutral, (IV) Acidic

| List-I (Oxide) | List-II (Nature) |
|----------------|------------------|
| (A) $\\mathrm{Cl_2O_7}$ | (I) Amphoteric |
| (B) $\\mathrm{Na_2O}$ | (II) Basic |
| (C) $\\mathrm{Al_2O_3}$ | (III) Neutral |
| (D) $\\mathrm{N_2O}$ | (IV) Acidic |`,

'PERI-079': `Match List-I with List-II:

**List-I (Electronic config):** (a) $1s^2 2s^2$, (b) $1s^2 2s^2 2p^4$, (c) $1s^2 2s^2 2p^3$, (d) $1s^2 2s^2 2p^1$

**List-II ($\\Delta_i H$ in kJ mol$^{-1}$):** (p) 801, (q) 899, (r) 1314, (s) 1402

| List-I (Electronic config) | List-II ($\\Delta_i H$, kJ/mol) |
|----------------------------|--------------------------------|
| (a) $1s^2 2s^2$ (Be) | (p) 801 |
| (b) $1s^2 2s^2 2p^4$ (O) | (q) 899 |
| (c) $1s^2 2s^2 2p^3$ (N) | (r) 1314 |
| (d) $1s^2 2s^2 2p^1$ (B) | (s) 1402 |`,

'THERMO-070': `Match List-I with List-II:

**List-I:** (A) Spontaneous process (B) Process with $\\Delta P=0,\\Delta T=0$ (C) $\\Delta H_{\\text{reaction}}$ (D) Exothermic process

**List-II:** (I) $\\Delta H<0$ (II) $\\Delta G_{T,P}<0$ (III) Isothermal and isobaric process (IV) [Bond energies of reactants] − [Bond energies of products]

| List-I | List-II |
|--------|---------|
| (A) Spontaneous process | (II) $\\Delta G_{T,P}<0$ |
| (B) Process with $\\Delta P=0, \\Delta T=0$ | (III) Isothermal and isobaric process |
| (C) $\\Delta H_{\\text{reaction}}$ | (IV) [Bond energies of reactants] − [Bond energies of products] |
| (D) Exothermic process | (I) $\\Delta H<0$ |`,

'DNF-021': `Match List-I with List-II

**List-I (Process):**
(a) Deacon's process
(b) Contact process
(c) Cracking of hydrocarbons
(d) Hydrogenation of vegetable oils

**List-II (Catalyst):**
(i) ZSM-5
(ii) $\\text{CuCl}_2$
(iii) Ni
(iv) $\\text{V}_2\\text{O}_5$

| List-I (Process) | List-II (Catalyst) |
|------------------|--------------------|
| (a) Deacon's process | (ii) $\\text{CuCl}_2$ |
| (b) Contact process | (iv) $\\text{V}_2\\text{O}_5$ |
| (c) Cracking of hydrocarbons | (i) ZSM-5 |
| (d) Hydrogenation of vegetable oils | (iii) Ni |

Choose the most appropriate answer from the options given below:`,

'DNF-051': `Match List-I with List-II

**List I (Species):**
A. $\\text{Cr}^{+2}$
B. $\\text{Mn}^{+}$
C. $\\text{Ni}^{+2}$
D. $\\text{V}^{+}$

**List II (Electronic distribution):**
i. $3d^8$
ii. $3d^3\\, 4s^1$
iii. $3d^4$
iv. $3d^5\\, 4s^1$

| List-I (Species) | List-II (Electronic distribution) |
|------------------|-----------------------------------|
| A. $\\text{Cr}^{2+}$ | iii. $3d^4$ |
| B. $\\text{Mn}^{+}$ | iv. $3d^5\\,4s^1$ |
| C. $\\text{Ni}^{2+}$ | i. $3d^8$ |
| D. $\\text{V}^{+}$ | ii. $3d^3\\,4s^1$ |

Choose the correct answer from the options given below:`,
};

// For questions where we need to fetch and restructure, we handle them programmatically
async function fixQuestion(db, id, doc) {
  const q = doc.question_text.markdown;

  // Generic approach: find List-I and List-II blocks and build a table
  // Try to extract items from bold-line format or inline format

  // Pattern 1: **List-I (label):**\n(A) item\n(B) item...
  const listIBlock = q.match(/\*\*List[- ]I[^*]*\*\*:?\s*\n([\s\S]+?)(?=\*\*List[- ]II|\n\n\(I\)|\nwith \(I\))/i)
    || q.match(/List[- ]I[^:\n]*:\s*\n([\s\S]+?)(?=List[- ]II|\n\n\(I\))/i);
  const listIIBlock = q.match(/\*\*List[- ]II[^*]*\*\*:?\s*\n([\s\S]+?)(?=\n\nChoose|\n\nSelect|\n\n\(1\)|\n\n$)/i)
    || q.match(/List[- ]II[^:\n]*:\s*\n([\s\S]+?)(?=\n\nChoose|\n\nSelect|\n\n\(1\))/i);

  if (!listIBlock || !listIIBlock) {
    // Try inline: "List-I: (A) foo, (B) bar\nList-II: (I) x, (II) y"
    const inlineI = q.match(/List[- ]I[^:\n]*:\s*(.+?)(?=\n|List[- ]II)/i);
    const inlineII = q.match(/List[- ]II[^:\n]*:\s*(.+?)(?=\n\n|Choose|$)/i);
    if (!inlineI || !inlineII) {
      console.log('SKIP (cannot parse):', id);
      return null;
    }

    const itemsI = parseItems(inlineI[1]);
    const itemsII = parseItems(inlineII[1]);
    if (itemsI.length < 2) { console.log('SKIP (too few items):', id); return null; }

    const table = buildTable(itemsI, itemsII);
    // Insert table after the List-II line
    const newQ = q.replace(inlineII[0], inlineII[0].trimEnd() + '\n\n' + table);
    return newQ;
  }

  const itemsI = parseItems(listIBlock[1]);
  const itemsII = parseItems(listIIBlock[1]);
  if (itemsI.length < 2) { console.log('SKIP (too few items):', id); return null; }

  const table = buildTable(itemsI, itemsII);
  const newQ = q.replace(listIIBlock[0], listIIBlock[0].trimEnd() + '\n\n' + table + '\n');
  return newQ;
}

function parseItems(text) {
  // Try "(A) item" or "A. item" or "**A.**" patterns
  const matches = [...text.matchAll(/(?:^|\n)\s*\(?([A-Da-dI-IVi-iv1-4]+)\)?[.\)]\s*(.+)/g)];
  if (matches.length >= 2) return matches.map(m => `(${m[1].toUpperCase()}) ${m[2].trim()}`);

  // Inline comma-separated: (A) foo, (B) bar
  const inline = [...text.matchAll(/\(?([A-Da-dI-IVi-iv1-4]+)\)?\s+([^,()\n]+)/g)];
  if (inline.length >= 2) return inline.map(m => `(${m[1].toUpperCase()}) ${m[2].trim()}`);

  return [];
}

function buildTable(itemsI, itemsII) {
  const rows = Math.max(itemsI.length, itemsII.length);
  let t = '| List-I | List-II |\n|--------|--------|\n';
  for (let i = 0; i < rows; i++) {
    t += `| ${itemsI[i] || ''} | ${itemsII[i] || ''} |\n`;
  }
  return t;
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;

  // Find ALL match-list questions without a table
  const all = await db.collection('questions_v2')
    .find({}, { projection: { display_id: 1, 'question_text.markdown': 1 } })
    .toArray();

  const noTable = all.filter(d => {
    const q = d.question_text?.markdown || '';
    const isMatchList = /match list.{0,10}(i|1|one).{0,20}(ii|2|two)/i.test(q) || /match.{0,5}list-i/i.test(q);
    const hasTable = /\|.+\|/.test(q);
    return isMatchList && !hasTable;
  });

  console.log('Match-list questions without tables:', noTable.length);

  let updated = 0;
  for (const doc of noTable) {
    const id = doc.display_id;

    // Use manual fix if provided
    if (QUESTION_FIXES[id] !== undefined && QUESTION_FIXES[id] !== null) {
      await db.collection('questions_v2').updateOne(
        { _id: doc._id },
        { $set: { 'question_text.markdown': QUESTION_FIXES[id] } }
      );
      console.log('FIXED (manual):', id);
      updated++;
      continue;
    }

    // Auto-fix
    const newQ = await fixQuestion(db, id, doc);
    if (newQ && newQ !== doc.question_text.markdown) {
      await db.collection('questions_v2').updateOne(
        { _id: doc._id },
        { $set: { 'question_text.markdown': newQ } }
      );
      console.log('FIXED (auto):', id);
      updated++;
    }
  }

  console.log(`\nDone. Updated ${updated}/${noTable.length} questions.`);
  mongoose.disconnect();
});
