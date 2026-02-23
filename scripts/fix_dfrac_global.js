/**
 * Global fix: replace \dfrac with \frac in all question and solution text.
 *
 * Root cause: \dfrac forces display-style fraction sizing even inside inline
 * $...$ math. \frac renders identically in display mode ($$...$$) and
 * correctly (smaller) in inline mode ($...$).
 *
 * Fields updated:
 *   - question_text.markdown
 *   - solution.text_markdown
 *   - solution.markdown
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

function replaceDfrac(str) {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/\\dfrac/g, '\\frac');
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('questions_v2');

  const all = await col.find({}).toArray();
  console.log(`Total documents: ${all.length}`);

  let updated = 0;
  for (const doc of all) {
    const sets = {};

    const qtMd = doc.question_text?.markdown || '';
    const solTm = doc.solution?.text_markdown || '';
    const solMd = doc.solution?.markdown || '';

    const newQtMd = replaceDfrac(qtMd);
    const newSolTm = replaceDfrac(solTm);
    const newSolMd = replaceDfrac(solMd);

    if (newQtMd !== qtMd) sets['question_text.markdown'] = newQtMd;
    if (newSolTm !== solTm) sets['solution.text_markdown'] = newSolTm;
    if (newSolMd !== solMd) sets['solution.markdown'] = newSolMd;

    // Fix options[].text
    if (Array.isArray(doc.options) && doc.options.length > 0) {
      const newOptions = doc.options.map(opt => ({
        ...opt,
        text: typeof opt.text === 'string' ? opt.text.replace(/\\dfrac/g, '\\frac') : opt.text,
      }));
      if (newOptions.some((o, i) => o.text !== doc.options[i].text)) {
        sets['options'] = newOptions;
      }
    }

    if (Object.keys(sets).length > 0) {
      await col.updateOne({ _id: doc._id }, { $set: sets });
      updated++;
      console.log(`✓ ${doc.display_id} — fixed fields: ${Object.keys(sets).join(', ')}`);
    }
  }

  console.log(`\nDone. Updated ${updated} / ${all.length} documents.`);
  await mongoose.disconnect();
}

main().catch(console.error);
