require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_redox';
const now = new Date();

function mkSCQ(display_id, difficulty, markdown, opts, correct, tag_id, exam_source) {
  return mk(display_id, difficulty, 'SCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: id === correct })),
    { correct_option: correct }, null, tag_id, exam_source);
}

function mk(display_id, difficulty, type, markdown, options, answer, solution, tag_id, exam_source) {
  return {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: false },
    type, options,
    answer: (answer && (answer.correct_option || answer.integer_value !== undefined || answer.decimal_value !== undefined)) ? answer : null,
    solution: solution ? { text_markdown: solution, latex_validated: false } : null,
    metadata: {
      difficulty, chapter_id: CHAPTER_ID,
      tags: [{ tag_id, weight: 1.0 }],
      is_pyq: !!exam_source, is_top_pyq: false,
      exam_source: exam_source ?? null,
      source_reference: { type: 'image', verified_against_source: true,
        verification_date: now, verified_by: 'ai_agent' }
    },
    status: 'review', version: 1, quality_score: 95,
    created_by: 'ai_agent', updated_by: 'ai_agent',
    created_at: now, updated_at: now, deleted_at: null
  };
}

const questions = [
  mkSCQ('RDX-135', 'Medium', 'Which of the following indicators are used in the titration of $\\ce{KMnO4}$ against sodium oxalate in an acidic medium?', [
    'Starch',
    'Phenolphthalein',
    '$\\ce{K2Cr2O7}$',
    'No indicator is necessary'
  ], 'd', 'tag_redox_1', null),
  mkSCQ('RDX-136', 'Medium', 'Which of the following indicators (nature indicated) are used during the titration of $\\ce{Na2S2O3}$ with $\\ce{I2}$?', [
    'Starch (external indicator)',
    'Starch (internal indicator)',
    '$\\ce{K2CrO4}$ (external indicator)',
    'Fluorescein (internal indicator)'
  ], 'b', 'tag_redox_1', null)
];

const solutions = {
  'RDX-135': `🧠 **The Self-Governing Reagent**
The beauty of $\\ce{KMnO4}$ titrations lies in the dual personality of the reagent itself. It represents a rare case where the oxidizer doesn't just drive the reaction—it also announces its completion. We call this a **Self-Indicator**. The "Aha!" moment comes when you realize that adding an external dye would be redundant because the reagent stays color-coded throughout its transformation.

🗺️ **The Permanganate Electron Swap**
In an acidic medium (typically provided by dilute $\\ce{H2SO4}$), the deep purple Permanganate ion ($\\ce{MnO4^-}$) acts as a potent scavenger for electrons. When it encounters the oxalate ion ($\\ce{C2O4^{2-}}$) from sodium oxalate, it performs a dramatic reduction:

$$ \\ce{2MnO4^- + 5C2O4^{2-} + 16H^+ -> 2Mn^{2+} + 10CO2 + 8H2O} $$

The key to the endpoint is the physical change in the Manganese atom. The **purple $\\ce{MnO4^-}$** is reduced to the **nearly colorless $\\ce{Mn^{2+}}$**. 

As long as there is oxalate left in the flask, every drop of purple Permanganate that falls from the burette is immediately converted to colorless $\\ce{Mn^{2+}}$. However, the moment the last molecule of oxalate is consumed, the very next drop of $\\ce{KMnO4}$ has nothing left to react with. It remains in its purple form, imparting a **persistent, faint pink color** to the entire solution.

⚡ **The Automatic Endpoint**
Whenever you are in a competition hall and see $\\ce{KMnO4}$ listed as the titrant in the burette, you can immediately stop looking for starch or complex organic dyes. $\\ce{KMnO4}$ is its own signal. This is a massive timesaver—if the reagent has a naturally intense color that disappears upon reaction, "No indicator" is the tactical win.

⚠️ **The Indicator Habit**
Students often reach for **Phenolphthalein** out of pure muscle memory from Acid-Base labs. Don't fall into that trap! This is a **Redox titration**, and the intensity of the purple $\\ce{MnO4^-}$ ion is far superior to any organic dye in this specific acidity. Also, never use **$\\ce{HCl}$** to acidify this reaction; the $\\ce{MnO4^-}$ is strong enough to oxidize the chloride ions into toxic $\\ce{Cl2}$ gas, giving you a false reading and a face full of chlorine!

$$\\boxed{\\text{Answer: (d)}}$$`,

  'RDX-136': `🧠 **Tracking the Triiodide Helixes**
Iodine is notoriously difficult to track by eye; a pale yellow solution of $\\ce{I2}$ can look identical to a colorless one at low concentrations. Starch solves this by forming a massive, deep blue **adsorption complex** with the triiodide ion ($\\ce{I3^-}$). The "Aha!" moment here is recognizing that starch acts as a physical cage for iodine—once the thiosulfate consumes the last bit of iodine, the cage empties, and the blue color "turns off" instantly.

🗺️ **The Internal Indicator Mandate**
The classification of an indicator depends entirely on where it does its job. An **internal indicator** is added directly into the reaction mixture (inside the conical flask). Since starch is added directly into the flask where the thiosulfate meets the iodine, it is undeniably an **internal indicator**.

The reaction at play is:
$$ \\ce{I2 + 2Na2S2O3 -> 2NaI + Na2S4O6} $$

While the starch-iodine complex is highly efficient, it must be handled with care. If you add starch at the very beginning when iodine concentration is high, it forms an irreversible complex that releases iodine too slowly, leading to a late endpoint. 

⚡ **The Straw-Yellow Shortcut**
The secret to a sharp endpoint in iodometry is **timing**. You titrate the iodine with thiosulfate until the dark brown solution fades to a **pale straw-yellow**. Only then do you add the starch. The solution turns deep blue immediately, and you only need a few more drops of thiosulfate to reach the colorless endpoint. 

⚠️ **The Classification Pitfall**
You might encounter older test banks or poorly vetted keys that mislabel starch as an "external indicator." Do not be misled. An **external indicator** (like potassium ferricyanide) is kept on a porcelain plate *outside* the flask. Because starch is used *inside* the reaction mixture, it is the textbook definition of an **Internal Indicator**.

$$\\boxed{\\text{Answer: (b)}}$$`
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  for (const q of questions) {
    q.solution = { text_markdown: solutions[q.display_id], latex_validated: false };
    
    const existing = await col.findOne({ display_id: q.display_id });
    if (existing) {
      const { _id, ...updateData } = q;
      await col.updateOne({ display_id: q.display_id }, { $set: updateData });
      console.log(`✅ Updated ${q.display_id}`);
    } else {
      await col.insertOne(q);
      console.log(`✅ Inserted ${q.display_id}`);
    }
  }

  await client.close();
}
main();
