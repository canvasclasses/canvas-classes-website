require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  // Regex to find TEMP-13x, TEMP-14x, TEMP-15x (representing NEET 2022 range)
  const cursor = col.find({
    display_id: { $regex: /^TEMP-1[3-9]/ }
  });

  const docs = await cursor.toArray();
  console.log(`🔍 Found ${docs.length} questions from TEMP-130 onwards.`);

  for (const doc of docs) {
    console.log(`- ID: ${doc.display_id}`);
    
    const fixText = (str) => {
      if (!str) return str;
      // 1. Replace literal "\n" strings with actual newline characters
      let fixed = str.replace(/\\n/g, '\n');
      // 2. Replace multiple backslashes \\ with a single \ for LaTeX commands
      // Be careful: LaTeX sometimes uses \\ for new line in tables/align, but 
      // here it's clearly being used for \text, \circ, etc.
      // We only target \\ when followed by a letter (LaTeX command) or a common symbol.
      fixed = fixed.replace(/\\\\([a-zA-Z])/g, '\\$1');
      fixed = fixed.replace(/\\\\circ/g, '\\circ');
      fixed = fixed.replace(/\\\\frac/g, '\\frac');
      fixed = fixed.replace(/\\\\right/g, '\\right');
      fixed = fixed.replace(/\\\\ce/g, '\\ce');
      return fixed;
    };

    const newMarkdown = fixText(doc.question_text.markdown);
    const newOptions = doc.options.map(opt => ({ ...opt, text: fixText(opt.text) }));
    const newSolution = doc.solution ? { ...doc.solution, text_markdown: fixText(doc.solution.text_markdown) } : null;

    await col.updateOne(
      { _id: doc._id },
      { $set: { 
          'question_text.markdown': newMarkdown, 
          options: newOptions,
          solution: newSolution,
          'question_text.latex_validated': true 
        } 
      }
    );
    console.log(`  ✅ Fixed rendering for ${doc.display_id}`);
  }

  await client.close();
}

main().catch(console.error);
