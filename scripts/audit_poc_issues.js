// Audit all POC questions for every type of issue
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function audit() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  
  const docs = await col.find({ 'metadata.chapter_id': 'ch11_prac_org' })
    .sort({ display_id: 1 }).toArray();
  
  console.log(`Total POC questions: ${docs.length}\n`);
  
  const issues = [];
  
  for (const doc of docs) {
    const q = doc.question_text?.markdown || '';
    const sol = doc.solution?.text_markdown || '';
    const opts = (doc.options || []).map(o => o.text || '');
    
    const docIssues = [];
    
    // LaTeX table issues
    if (q.includes('\\begin{tabular}') || q.includes('\\hline') || q.includes('\\multicolumn')) {
      docIssues.push('RAW_LATEX_TABLE_IN_QUESTION');
    }
    
    // Unrendered LaTeX in options (\\( \\) delimiters not converted)
    opts.forEach((o, i) => {
      if (o.includes('\\(') || o.includes('\\)')) {
        docIssues.push(`UNRENDERED_LATEX_OPTION_${i+1}: ${o.substring(0,60)}`);
      }
      if (o.includes('\\mathrm{')) {
        docIssues.push(`MATHRM_IN_OPTION_${i+1}: ${o.substring(0,60)}`);
      }
    });
    
    // \dfrac usage
    if (q.includes('\\dfrac') || sol.includes('\\dfrac')) {
      docIssues.push('DFRAC_USED');
    }
    
    // $$...$$ in question text (banned per workflow)
    // Actually $$ IS ok in solutions per workflow, but check question text
    // Workflow says use $ for inline AND display in question text
    
    // Short/inadequate solution
    const solWords = sol.split(/\s+/).filter(w => w).length;
    if (solWords < 50) {
      docIssues.push(`SHORT_SOLUTION: ${solWords} words`);
    }
    
    // Generic boilerplate solution
    if (sol.includes('Based on the principles and concepts involved') || 
        sol.includes('Using the given data and applying') ||
        sol.includes('Analyze each option systematically') ||
        sol.includes('Evaluate based on fundamental')) {
      docIssues.push('GENERIC_BOILERPLATE_SOLUTION');
    }
    
    // Missing steps structure
    if (!sol.includes('**Step') && solWords > 0) {
      docIssues.push('NO_STEP_STRUCTURE');
    }
    
    // Missing Key Points
    if (!sol.includes('Key Point') && !sol.includes('key point')) {
      docIssues.push('NO_KEY_POINTS');
    }
    
    // Table question that needs proper pipe table format
    if ((q.includes('List I') || q.includes('List-I')) && !q.includes('|')) {
      docIssues.push('MTC_NEEDS_PIPE_TABLE');
    }
    
    if (docIssues.length > 0) {
      issues.push({ id: doc.display_id, type: doc.type, issues: docIssues });
    }
  }
  
  console.log(`Questions with issues: ${issues.length}\n`);
  console.log('=== ISSUES BY QUESTION ===\n');
  
  // Group by issue type
  const byType = {};
  issues.forEach(({ id, issues: iss }) => {
    iss.forEach(i => {
      const key = i.split(':')[0].split('_').slice(0, -1).join('_') || i.split(':')[0];
      // Simplify key
      const simpleKey = i.includes('GENERIC') ? 'GENERIC_SOLUTION' :
                        i.includes('SHORT_SOLUTION') ? 'SHORT_SOLUTION' :
                        i.includes('NO_STEP') ? 'NO_STEP_STRUCTURE' :
                        i.includes('NO_KEY') ? 'NO_KEY_POINTS' :
                        i.includes('MTC') ? 'MTC_PIPE_TABLE' :
                        i.includes('UNRENDERED') ? 'UNRENDERED_LATEX' :
                        i.includes('MATHRM') ? 'MATHRM_IN_OPTS' :
                        i.includes('DFRAC') ? 'DFRAC' :
                        i.includes('RAW_LATEX') ? 'RAW_LATEX_TABLE' : i;
      if (!byType[simpleKey]) byType[simpleKey] = [];
      byType[simpleKey].push(id);
    });
  });
  
  Object.entries(byType).forEach(([type, ids]) => {
    console.log(`${type} (${ids.length}): ${ids.slice(0,20).join(', ')}${ids.length > 20 ? '...' : ''}`);
  });
  
  // Print each question's full issue list
  console.log('\n=== DETAILED ISSUES ===\n');
  issues.slice(0, 30).forEach(({ id, issues: iss }) => {
    console.log(`${id}: ${iss.join(' | ')}`);
  });
  
  // Also dump full question text for first few broken ones
  console.log('\n=== SAMPLE QUESTION TEXTS (first 5 with issues) ===\n');
  for (const { id } of issues.slice(0, 5)) {
    const doc = docs.find(d => d.display_id === id);
    console.log(`\n--- ${id} ---`);
    console.log('Q:', doc.question_text.markdown.substring(0, 300));
    console.log('SOL:', (doc.solution?.text_markdown || '').substring(0, 200));
  }
  
  await mongoose.disconnect();
}

audit().catch(e => { console.error(e); process.exit(1); });
