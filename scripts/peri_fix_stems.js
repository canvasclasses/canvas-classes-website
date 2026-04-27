// Fix question stems that I missed in batches 1-8.
// Adds proper \ce{} and $...$ wrapping to raw chemistry in question_text.markdown.

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const fixes = [
  {
    display_id: 'PERI-043',
    stem: `The statement(s) that are correct about the species $\\ce{O^{2-}}$, $\\ce{F^-}$, $\\ce{Na^+}$ and $\\ce{Mg^{2+}}$:

(A) All are isoelectronic
(B) All have the same nuclear charge
(C) $\\ce{O^{2-}}$ has the largest ionic radii
(D) $\\ce{Mg^{2+}}$ has the smallest ionic radii`,
  },
  {
    display_id: 'PERI-045',
    stem: `The electron affinity values are negative for:

A. $\\ce{Be -> Be^-}$
B. $\\ce{N -> N^-}$
C. $\\ce{O -> O^{2-}}$
D. $\\ce{Na -> Na^-}$
E. $\\ce{Al -> Al^-}$`,
  },
  {
    display_id: 'PERI-046',
    stem: `Given below are two statements:

**Statement I:** The oxidation state of an element in a compound is the charge acquired by its atom on the basis of electron gain enthalpy consideration from other atoms in the molecule.

**Statement II:** $p\\pi - p\\pi$ bond formation is more prevalent in second period elements over other periods.

Choose the correct option:`,
  },
  {
    display_id: 'PERI-049',
    stem: `Consider elements $A'$, $B'$, $C'$, $D'$ where $A'$ and $B'$ are in Period 2, $C'$ and $D'$ in Period 3; $A'$ and $C'$ are in Group 1, $B'$ and $D'$ are in Group 2. Which of the following is/are true?

A. Order of atomic radii: $B' < A' < D' < C'$
B. Order of metallic character: $B' < A' < D' < C'$
C. Size: $D' < C' < B' < A'$
D. Order of ionic radii: $B'^{2+} < A'^+ < D'^{2+} < C'^+$`,
  },
  {
    display_id: 'PERI-052',
    stem: `Group-13 elements react with $\\ce{O2}$ to form oxides of type $\\ce{M2O3}$. Which among the following is the most basic oxide?`,
  },
];

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const col = c.db('crucible').collection('questions_v2');
  const now = new Date();
  let fixed = 0, missing = 0;

  for (const f of fixes) {
    const existing = await col.findOne({ display_id: f.display_id });
    if (!existing) { console.log(`MISSING: ${f.display_id}`); missing++; continue; }

    const setOps = {
      'question_text.markdown': f.stem,
      'question_text.latex_validated': true,
      last_validated_at: now,
    };
    const r = await col.updateOne({ display_id: f.display_id }, { $set: setOps });
    console.log(`FIXED: ${f.display_id} (matched=${r.matchedCount}, modified=${r.modifiedCount})`);
    fixed++;
  }

  console.log(`\nDone. Fixed: ${fixed}, Missing: ${missing}`);
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
